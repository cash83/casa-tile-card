// Il tasto "Crea i sensori base" dell'editor di casa-energia.
//
// Crea in Home Assistant, al posto tuo, la parte noiosa: i contatori
// (ora/oggi/settimana/mese) sopra al sensore dei kWh della casa e i sensori del
// costo di ogni periodo, piu' il prezzo in euro al kWh. Sono gli stessi helper
// che faresti a mano da Impostazioni > Dispositivi e servizi > Helper: stanno
// in .storage, quindi entrano nel backup e da li' si cancellano.
//
// Quello che questa scorciatoia NON fa: il conto voce per voce, i cicli degli
// elettrodomestici, il risparmio del fotovoltaico. Quella roba vuole i template
// a trigger e le macro, e resta nella guida (esempi/luce).
//
// Chi c'e' gia' non si tocca: riconosco i miei helper dal NOME della voce di
// configurazione (il contatore non dice piu' da quale sensore nasce, quindi
// l'attributo "source" non si puo' guardare), e se lo trovo lo riuso.

const PERIODI = [
  ["Ora", "ora", "hourly"],
  ["Oggi", "oggi", "daily"],
  ["Settimana", "settimana", "weekly"],
  ["Mese", "mese", "monthly"],
  ["Bolletta", "bimestre", "bimonthly"],
];

// il nome del sensore, senza la coda "energia"/"totale"
function nomeSorgente(hass, eid) {
  const st = hass.states[eid];
  const n = st ? String(st.attributes.friendly_name || eid) : eid;
  return n.replace(/\s+(energia|energy|totale|total)\s*$/i, "").replace(/\s{2,}/g, " ").trim() || "Casa";
}

// tutte le voci di configurazione (helper compresi): WebSocket, e se non va, REST
async function vociDiConfigurazione(hass) {
  try {
    return await hass.callWS({ type: "config_entries/get" });
  } catch (e) {
    return await hass.callApi("GET", "config/config_entries/entry");
  }
}

// da voce di configurazione a entita': serve il registro
async function registro(hass) {
  return hass.callWS({ type: "config/entity_registry/list" });
}

function entitaDellaVoce(reg, idVoce) {
  const v = reg.find((e) => e.config_entry_id === idVoce);
  return v ? v.entity_id : null;
}

// Apre un flusso di configurazione e lo porta fino in fondo.
// A ogni passo Home Assistant dice quali campi vuole (data_schema): gli mando
// solo quelli, presi da `dati`. Cosi' il giorno che un passo cambia, la scheda
// non si rompe. `menu` e' la voce da scegliere quando il flusso parte da un
// menu (il template chiede prima che tipo di entita' vuoi).
async function flusso(hass, handler, dati, menu) {
  let r = await hass.callApi("POST", "config/config_entries/flow",
    { handler, show_advanced_options: true });
  for (let giro = 0; giro < 8; giro++) {
    if (r.type === "create_entry" || r.type === "abort") break;
    let invio;
    if (r.type === "menu" || (r.menu_options && !r.data_schema)) {
      invio = { next_step_id: menu };
    } else {
      invio = {};
      (r.data_schema || []).forEach((campo) => {
        if (campo && campo.name && dati[campo.name] !== undefined) invio[campo.name] = dati[campo.name];
      });
    }
    r = await hass.callApi("POST", "config/config_entries/flow/" + r.flow_id, invio);
  }
  if (r.type !== "create_entry") {
    const perche = (r.errors && JSON.stringify(r.errors)) || r.reason || r.type || "?";
    throw new Error("Home Assistant non ha creato l'helper (" + perche + ")");
  }
  return (r.result && (r.result.entry_id || r.result)) || null;
}

async function creaContatore(hass, nome, sorgente, ciclo) {
  return flusso(hass, "utility_meter", {
    name: nome, source: sorgente, cycle: ciclo, offset: 0, tariffs: [],
    net_consumption: false, delta_values: false, periodically_resetting: true,
    always_available: true,
  });
}

async function creaEnergiaKwh(hass, nome, sorgente) {
  return flusso(hass, "template", {
    name: nome,
    state: "{{ (states('" + sorgente + "') | float(0) / 1000) | round(4) }}",
    unit_of_measurement: "kWh", device_class: "energy", state_class: "total_increasing",
  }, "sensor");
}

async function creaCosto(hass, nome, stato) {
  // il flusso dei template parte da un menu: prima dico che voglio un sensore
  return flusso(hass, "template", {
    name: nome, state: stato, unit_of_measurement: "€",
    device_class: "monetary", state_class: "total",
  }, "sensor");
}

// tutti gli aiutanti che sono un prezzo in euro al kWh
// rete/oneri, accise, IVA e quota fissa NON sono un prezzo da scegliere: sono
// le voci che sommate fanno il totale, e il totale lo tiene gia' un'automazione
export const INGREDIENTE = /rete|oneri|accis|iva|quota|fiss/i;

export function prezziDelKWh(hass) {
  const st = (hass && hass.states) || {};
  const suo = (id) => String((st[id].attributes || {}).unit_of_measurement || "").replace(/\s/g, "");
  return Object.keys(st).filter((id) => id.startsWith("input_number.") && suo(id) === "€/kWh")
    // il totale per primo: e' quello che serve alla scheda della casa
    .sort((a, b) => (a === "input_number.prezzo_energia" ? -1 : 0)
      - (b === "input_number.prezzo_energia" ? -1 : 0) || a.localeCompare(b));
}

// Le quattro voci della tariffa, come stanno in bolletta. Gli id sono fissi:
// e' cosi' che ogni altra scheda sa dove andare a leggere il prezzo.
export const VOCI_TARIFFA = [
  { chiave: "energia", id: "input_number.prezzo_luce_energia", nome: "Prezzo luce energia", unita: "\u20ac/kWh" },
  { chiave: "rete", id: "input_number.prezzo_luce_rete_e_oneri", nome: "Prezzo luce rete e oneri", unita: "\u20ac/kWh" },
  { chiave: "accise", id: "input_number.prezzo_luce_accise", nome: "Prezzo luce accise", unita: "\u20ac/kWh" },
  { chiave: "iva", id: "input_number.iva_luce", alias: ["input_number.prezzo_luce_iva"], nome: "IVA luce", unita: "%" },
  { chiave: "quota", id: "input_number.quota_fissa_energia_giorno", nome: "Quota fissa energia giorno", unita: "\u20ac/giorno" },
];

// l'aiutante di questa voce, con qualunque nome sia nato
export function idDellaVoce(hass, v) {
  const st = (hass && hass.states) || {};
  if (st[v.id]) return v.id;
  const altro = (v.alias || []).find((x) => st[x]);
  return altro || v.id;
}
export const ID_TOTALE = "input_number.prezzo_energia";

// Il prezzo che la scheda della casa tiene per tutti: la SOLA energia, quella
// che va sugli apparecchi e sulle prese. Se non c'e', il totale.
export function prezzoDellaCasa(hass) {
  const st = (hass && hass.states) || {};
  if (st["input_number.prezzo_luce_energia"]) return "input_number.prezzo_luce_energia";
  const soli = prezziDelKWh(hass).filter((id) => !INGREDIENTE.test(id));
  const energia = soli.filter((id) => Number(st[id].state) > 0 && Number(st[id].state) < 0.20);
  return energia[0] || soli[0] || "";
}

// La tariffa scritta a mano sulla scheda principale: se l'aiutante non c'e' lo
// creo, se c'e' gli riscrivo il valore. E alla fine metto anche il totale
// (energia + rete + accise, piu' l'IVA), che e' il prezzo della bolletta.
export async function scriviTariffa(hass, voci, dillo) {
  const parla = dillo || (() => {});
  const messi = {};
  for (let v of VOCI_TARIFFA) {
    const n = Number(voci[v.chiave]);
    if (!Number.isFinite(n) || n < 0) continue;
    v = { ...v, id: idDellaVoce(hass, v) };
    if (!hass.states[v.id]) {
      parla("Creo " + v.nome + "...");
      await hass.callWS({
        type: "input_number/create", name: v.nome, min: 0, max: v.unita === "%" ? 100 : 5,
        step: v.unita === "%" ? 1 : 0.0001, mode: "box", unit_of_measurement: v.unita,
        icon: "mdi:currency-eur",
      });
    }
    await hass.callService("input_number", "set_value", { entity_id: v.id, value: n });
    messi[v.chiave] = n;
    parla(v.nome + ": " + n + " " + v.unita);
  }
  const base = (messi.energia || 0) + (messi.rete || 0) + (messi.accise || 0);
  const totale = Math.round(base * (1 + (messi.iva || 0) / 100) * 10000) / 10000;
  if (totale > 0) {
    if (!hass.states[ID_TOTALE]) {
      await hass.callWS({
        type: "input_number/create", name: "Prezzo energia", min: 0, max: 5, step: 0.0001,
        mode: "box", unit_of_measurement: "\u20ac/kWh", icon: "mdi:currency-eur",
      });
    }
    await hass.callService("input_number", "set_value", { entity_id: ID_TOTALE, value: totale });
    parla("Totale della bolletta: " + totale.toFixed(4) + " \u20ac/kWh");
  }
  return { totale, energia: messi.energia || 0 };
}

// Home Assistant, quando crea un contatore, gli mette davanti il nome del
// dispositivo della sorgente: chiedi "Lavasciuga energia oggi" e ti ritrovi
// sensor.lavatrice_lavasciuga_energia_oggi. Nome diverso = entita' diversa =
// storico perso. Quindi appena creato lo rinomino come si deve, che e' quello
// che farebbe uno a mano dalle impostazioni.
function slug(nome) {
  // i segni combinanti scritti coi codici: a caratteri veri sono invisibili
  return String(nome).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
}

export async function sistemaNome(hass, entita, nomeVoluto, dillo) {
  if (!entita || !nomeVoluto) return entita;
  const dominio = entita.split(".")[0];
  const voluto = dominio + "." + slug(nomeVoluto);
  if (entita === voluto) return entita;
  if (hass.states[voluto]) return entita;          // il nome buono e' occupato
  try {
    await hass.callWS({
      type: "config/entity_registry/update", entity_id: entita, new_entity_id: voluto,
    });
    if (dillo) dillo("Rinominato in " + voluto + " (cosi' ritrova il suo storico).");
    return voluto;
  } catch (e) {
    return entita;
  }
}

// il prezzo in euro al kWh: quello scelto, quello che c'e', o uno nuovo
async function prezzoDelKWh(hass, opzioni, dillo, conto) {
  if (opzioni.prezzo_entita && hass.states[opzioni.prezzo_entita]) {
    dillo("Prezzo: " + opzioni.prezzo_entita + " ("
      + hass.states[opzioni.prezzo_entita].state + " €/kWh).");
    conto.riusati++;
    return opzioni.prezzo_entita;
  }
  const gia = prezziDelKWh(hass)[0];
  if (gia) {
    dillo("Prezzo: uso quello che c'era gia' (" + gia + ").");
    conto.riusati++;
    return gia;
  }
  dillo("Creo il prezzo in €/kWh...");
  await hass.callWS({
    type: "input_number/create", name: "Prezzo energia", min: 0, max: 5, step: 0.0001,
    mode: "box", unit_of_measurement: "€/kWh", icon: "mdi:currency-eur",
  });
  conto.creati++;
  const v = Number(opzioni.prezzo);
  if (Number.isFinite(v) && v > 0) {
    try {
      await hass.callService("input_number", "set_value",
        { entity_id: "input_number.prezzo_energia", value: v });
    } catch (e) { dillo("Il prezzo lo scrivi tu nel pop-up della scheda."); }
  }
  return "input_number.prezzo_energia";
}

/**
 * Crea (o ritrova) contatori e costi. `dillo(testo)` racconta cosa sta facendo.
 * Torna il pezzo di configurazione da mettere nella scheda.
 */
export async function creaSensoriBase(hass, opzioni, dillo) {
  const sorgente = opzioni.sorgente;
  if (!sorgente || !hass.states[sorgente]) throw new Error("Scegli il sensore dei kWh della casa.");
  const base = nomeSorgente(hass, sorgente);
  const memoria = opzioni.memoria || {};
  // come si chiamava prima questo contatore (o questo costo)
  const comePrima = (chiave, costo) => Object.keys(memoria).find((t) => {
    const eraCosto = /^costo/i.test(t);
    return eraCosto === !!costo && new RegExp("(^|[ _])" + chiave + "$", "i").test(t);
  }) || null;
  const conto = { creati: 0, riusati: 0 };

  let voci = await vociDiConfigurazione(hass);
  let reg = await registro(hass);
  // cerca una voce di configurazione gia' fatta, per dominio e nome
  const gia = (dominio, nome) => {
    const v = voci.find((x) => x.domain === dominio
      && String(x.title || "").toLowerCase() === nome.toLowerCase());
    return v ? entitaDellaVoce(reg, v.entry_id) : null;
  };

  // 1. il prezzo in euro al kWh
  const prezzo = await prezzoDelKWh(hass, opzioni, dillo, conto);

  // 2. i contatori: uno per periodo
  const contatori = {};
  const nuovi = [];
  for (const [etichetta, chiave, ciclo] of PERIODI) {
    const nome = comePrima(chiave, false) || (base + " " + chiave);
    const vecchio = gia("utility_meter", nome);
    if (vecchio) {
      contatori[chiave] = vecchio;
      conto.riusati++;
      dillo(etichetta + ": c'era gia' (" + vecchio + ").");
    } else {
      dillo("Creo il contatore di " + etichetta.toLowerCase() + "...");
      nuovi.push([chiave, await creaContatore(hass, nome, sorgente, ciclo), nome]);
      conto.creati++;
    }
  }
  if (nuovi.length) {
    reg = await registro(hass);
    for (const [chiave, id, nome] of nuovi) {
      const e = entitaDellaVoce(reg, id);
      if (e) contatori[chiave] = await sistemaNome(hass, e, nome, dillo);
    }
  }

  // 3. i costi: i kWh del periodo per il prezzo
  const costi = {};
  const nuoviCosti = [];
  // Il costo di un periodo non e' solo kWh x prezzo: c'e' la quota fissa, che
  // si paga a giorno anche a casa spenta. I giorni li conto da quando il
  // contatore si e' azzerato, cosi' la formula vale per oggi, per il mese e
  // per il bimestre senza cambiare niente. Sull'ora la quota non c'entra.
  const QUOTA = "input_number.quota_fissa_energia_giorno";
  const GIORNI = {
    oggi: "1",
    mese: "now().day",
    // il bimestre non ha una data di inizio che io possa sapere: conto da
    // quando il contatore si e' azzerato, e dopo il primo rollover e' esatto
    bimestre: "((now() - as_datetime(state_attr('%E%', 'last_reset'))).days + 1"
      + " if state_attr('%E%', 'last_reset') else 1)",
  };
  const perPrezzo = (entita, chiave) => {
    const base = "states('" + entita + "') | float(0) * states('" + prezzo + "') | float(0)";
    const quanti = GIORNI[chiave];
    if (!quanti || !hass.states[QUOTA]) return "{{ (" + base + ") | round(2) }}";
    const giorni = quanti.split("%E%").join(entita);
    return "{{ (" + base + " + states('" + QUOTA + "') | float(0) * " + giorni + ") | round(2) }}";
  };
  voci = await vociDiConfigurazione(hass);
  for (const [etichetta, chiave] of PERIODI.map((p) => [p[0], p[1]])) {
    if (!contatori[chiave]) continue;
    const nome = comePrima(chiave, true) || ("Costo " + base.toLowerCase() + " " + chiave);
    const vecchio = gia("template", nome);
    if (vecchio) {
      costi[chiave] = vecchio;
      conto.riusati++;
    } else {
      dillo("Creo il costo di " + etichetta.toLowerCase() + "...");
      nuoviCosti.push([chiave, await creaCosto(hass, nome,
        perPrezzo(contatori[chiave], chiave)), nome]);
      conto.creati++;
    }
  }
  // e il costo di ieri, dal periodo chiuso del contatore di oggi
  if (contatori.oggi) {
    const nome = comePrima("ieri", true) || ("Costo " + base.toLowerCase() + " ieri");
    const vecchio = gia("template", nome);
    if (vecchio) { costi.ieri = vecchio; conto.riusati++; } else {
      dillo("Creo il costo di ieri...");
      const stato = "{{ (state_attr('" + contatori.oggi + "', 'last_period') | float(0) * states('"
        + prezzo + "') | float(0)) | round(2) }}";
      nuoviCosti.push(["ieri", await creaCosto(hass, nome, stato), nome]);
      conto.creati++;
    }
  }
  if (nuoviCosti.length) {
    reg = await registro(hass);
    for (const [chiave, id, nome] of nuoviCosti) {
      const e = entitaDellaVoce(reg, id);
      if (e) costi[chiave] = await sistemaNome(hass, e, nome, dillo);
    }
  }

  // 3-bis. i valori di prima: li rimetto dove sono tornati con lo stesso nome
  let rimessi = 0;
  for (const chiave of Object.keys(contatori)) {
    const eid = contatori[chiave];
    const nome = Object.keys(memoria).find((k) => memoria[k].entita === eid);
    const v = nome && memoria[nome] && memoria[nome].valore;
    if (eid && v > 0) {
      const ora = Number((hass.states[eid] || {}).state);
      if (Number.isFinite(ora) && ora >= v - 0.0005) {
        dillo(nome + ": sta gia' contando (" + ora + "), non lo tocco.");
        continue;
      }
      rimessi++;
      dillo("Rimetto " + v + " su " + nome + ".");
      try {
        await hass.callService("utility_meter", "calibrate", { entity_id: eid, value: String(v) });
      } catch (e) { dillo("Il valore vecchio non sono riuscito a rimetterlo: " + (e.message || e)); }
    }
  }

  // 4. il pezzo di configurazione per la scheda
  const periods = PERIODI.filter((p) => contatori[p[1]] && p[1] !== "bimestre").map(([etichetta, chiave]) => {
    const riga = { label: etichetta, energy: contatori[chiave] };
    if (costi[chiave]) riga.cost = costi[chiave];
    return riga;
  });
  await avvisoUnita(hass, Object.values(contatori), dillo);
  const patch = { periods };
  // la memoria e' servita: la butto, se no al prossimo giro rischia di
  // riportare indietro contatori che intanto sono andati avanti
  if (Object.keys(memoria).length) patch.helper_memoria = null;
  if (contatori.bimestre) patch.bolletta_energia = contatori.bimestre;
  if (costi.bimestre) patch.bolletta_costo = costi.bimestre;
  if (contatori.oggi) {
    const ieri = { label: "Ieri", energy: contatori.oggi, energy_attr: "last_period" };
    if (costi.ieri) ieri.cost = costi.ieri;
    patch.periods_prev = [ieri];
  }
  patch.settings_sections = [{ title: "Costi", rows: [{ entity: prezzo, label: "Prezzo energia (€/kWh)" }] }];
  dillo("Fatto: " + conto.creati + " creati, " + conto.riusati + " c'erano gia'."
    + (rimessi ? " " + rimessi + " sono ripartiti dal valore di prima." : ""));
  return patch;
}

// ---------------------------------------------------------------------------
// Gli elettrodomestici.
//
// Il riquadro "Ultimo ciclo" nasce da un sensore template A TRIGGER, che
// dall'interfaccia di Home Assistant non si puo' creare: quello resta
// nell'esempio (esempi/luce). Quello che si puo' fare senza YAML sono le
// STATISTICHE: quante volte e' partito, quanto ha lavorato e quanto e'
// costato, oggi e questo mese. Servono quattro helper normali:
//   soglia (threshold)   -> "sta lavorando" (binary_sensor)
//   tempo (history_stats) -> quanto e' stato acceso
//   cicli (history_stats) -> quante volte si e' acceso
//   kWh: il sensore della presa, oppure un integrale (Riemann) dai Watt
//   contatore + costo   -> i kWh e gli euro del periodo
const FINESTRE_TUTTE = [
  ["oggi", "today", "{{ today_at() }}", "daily"],
  ["settimana", "week", "{{ today_at() - timedelta(days=now().weekday()) }}", "weekly"],
  ["mese", "month", "{{ now().replace(day=1, hour=0, minute=0, second=0, microsecond=0) }}", "monthly"],
];
// quali periodi creare: se non lo dici, oggi e mese come prima
const finestre = (opzioni) => {
  const scelti = (opzioni && opzioni.periodi) || ["oggi", "mese"];
  return FINESTRE_TUTTE.filter(([chiave]) => scelti.includes(chiave));
};

async function creaSoglia(hass, nome, potenza, soglia) {
  return flusso(hass, "threshold", {
    name: nome, entity_id: potenza, upper: soglia, hysteresis: 0,
  });
}

async function creaStorico(hass, nome, acceso, tipo, inizio) {
  return flusso(hass, "history_stats", {
    name: nome, entity_id: acceso, type: tipo, state: ["on"],
    start: inizio, end: "{{ now() }}",
  });
}

async function creaIntegrale(hass, nome, potenza) {
  return flusso(hass, "integration", {
    name: nome, source: potenza, unit_prefix: "k", unit_time: "h",
    // un minuto, non cinque: cosi' dice il suo primo valore (e la sua unita')
    // quasi subito, anche se l'apparecchio e' spento
    method: "left", round: 3, max_sub_interval: { hours: 0, minutes: 1, seconds: 0 },
  });
}

// I contatori appena nati che non hanno ancora un'unita'. Succede quando
// l'apparecchio e' spento: il contatore la prende solo al primo conto vero, e
// fino a quel momento le statistiche vanno a finire senza unita'. Quando poi
// l'unita' arriva, Home Assistant apre una "riparazione" per ognuno.
// PROVATO: non si puo' evitare - ne' aspettando che la sorgente dia un numero,
// ne' con utility_meter.calibrate. Percio' lo dico prima invece di lasciartelo
// scoprire dopo.
async function avvisoUnita(hass, entita, dillo) {
  if (!dillo) return;
  // `hass.states` qui e' la fotografia di PRIMA: i contatori appena creati non
  // ci sono ancora e l'avviso non sarebbe mai scattato. Li richiedo.
  let stati = hass.states;
  try { stati = await hass.callWS({ type: "get_states" }); } catch (e) { stati = null; }
  const diEntita = {};
  if (Array.isArray(stati)) stati.forEach((x) => { diEntita[x.entity_id] = x; });
  else Object.assign(diEntita, hass.states);
  const mute = (entita || []).filter((e) => {
    const st = e && diEntita[e];
    return st && !(st.attributes || {}).unit_of_measurement;
  });
  if (!mute.length) return;
  dillo("\u26a0 " + mute.length + (mute.length === 1 ? " contatore e' nato" : " contatori sono nati")
    + " senza unita', perche' l'apparecchio adesso e' fermo. Appena comincera' a"
    + " contare, Home Assistant ti chiedera' di sistemare l'unita' delle statistiche:"
    + " rispondi \u00abaggiorna l'unita' senza conversione\u00bb. Succede una volta sola.");
}

// ---------------------------------------------------------------- i cicli
// Un template a trigger dall'interfaccia non si puo' fare (Home Assistant non
// lo offre). La stessa cosa pero' si ottiene con pezzi che so creare: una
// soglia che dice quando lavora, un contatore che parte da zero a ogni ciclo,
// tre memorie e un'automazione che al termine ci scrive dentro.

async function creaNumero(hass, nome, unita, passo, massimo) {
  await hass.callWS({
    type: "input_number/create", name: nome, min: 0, max: massimo, step: passo,
    mode: "box", unit_of_measurement: unita, icon: "mdi:counter",
  });
  return "input_number." + slug(nome);
}

async function creaDataOra(hass, nome) {
  await hass.callWS({
    type: "input_datetime/create", name: nome, has_date: true, has_time: true,
    icon: "mdi:flag-checkered",
  });
  return "input_datetime." + slug(nome);
}

async function creaAutomazione(hass, conf) {
  const id = String(Date.now());
  await hass.callApi("POST", "config/automation/config/" + id, { id, ...conf });
  return id;
}

/**
 * Il giro completo dei cicli di un elettrodomestico: torna il pezzo di
 * configurazione con le tre entita' da mostrare nella scheda.
 */
export async function creaCicli(hass, opzioni, dillo) {
  const parla = dillo || (() => {});
  // quanti minuti di fermo vogliono dire "ha finito": il forno spegne e
  // riaccende la resistenza, la lavatrice ha le pause dell'ammollo
  const ATTESA = Number(opzioni.attesa) > 0 ? Number(opzioni.attesa) : 5;
  const { potenza, energia, soglia } = opzioni;
  if (!potenza) throw new Error("Serve il sensore dei Watt.");
  if (!energia) throw new Error("Serve il contatore dei kWh.");
  const base = opzioni.nome || nomeSorgente(hass, potenza);

  let voci = await vociDiConfigurazione(hass);
  let reg = await registro(hass);
  const gia = (dominio, nome) => {
    const v = voci.find((x) => x.domain === dominio
      && String(x.title || "").toLowerCase() === nome.toLowerCase());
    return v ? entitaDellaVoce(reg, v.entry_id) : null;
  };
  const rinfresca = async () => { voci = await vociDiConfigurazione(hass); reg = await registro(hass); };
  const esiste = (eid) => !!hass.states[eid];

  // 1. quando sta lavorando
  const nomeSoglia = base + " in funzione";
  let acceso = gia("threshold", nomeSoglia);
  if (!acceso) {
    parla("Creo la soglia «" + nomeSoglia + "»...");
    await creaSoglia(hass, nomeSoglia, potenza, Number(soglia) || 10);
    await rinfresca();
    acceso = await sistemaNome(hass, gia("threshold", nomeSoglia), nomeSoglia, parla);
  } else parla("La soglia c'era gia'.");

  // 2. il contatore del ciclo: nessun ciclo suo, lo azzero io alla partenza
  const nomeContatore = base + " ciclo kWh";
  let contatore = gia("utility_meter", nomeContatore);
  if (!contatore) {
    parla("Creo il contatore del ciclo...");
    await flusso(hass, "utility_meter", {
      name: nomeContatore, source: energia, cycle: "none", offset: 0, tariffs: [],
      net_consumption: false, delta_values: false, periodically_resetting: true,
      always_available: true,
    });
    await rinfresca();
    contatore = await sistemaNome(hass, gia("utility_meter", nomeContatore), nomeContatore, parla);
  } else parla("Il contatore del ciclo c'era gia'.");

  // 3. le tre memorie dell'ultimo ciclo
  const nKwh = base + " ultimo ciclo kWh";
  const nMin = base + " ultimo ciclo minuti";
  const nFine = base + " ultimo ciclo fine";
  const nVia = base + " ciclo iniziato";
  const eKwh = "input_number." + slug(nKwh);
  const eMin = "input_number." + slug(nMin);
  const eFine = "input_datetime." + slug(nFine);
  const eVia = "input_datetime." + slug(nVia);
  if (!esiste(eKwh)) { parla("Creo la memoria dei kWh..."); await creaNumero(hass, nKwh, "kWh", 0.001, 1000); }
  if (!esiste(eMin)) { parla("Creo la memoria dei minuti..."); await creaNumero(hass, nMin, "min", 1, 10000); }
  if (!esiste(eFine)) { parla("Creo la memoria della fine..."); await creaDataOra(hass, nFine); }
  if (!esiste(eVia)) { parla("Creo la memoria della partenza..."); await creaDataOra(hass, nVia); }

  // 4. l'automazione che al termine del ciclo scrive le tre memorie
  const nomeAuto = base + ": segna il ciclo";
  const automazioni = Object.keys(hass.states).filter((x) => x.startsWith("automation."));
  const gia_auto = automazioni.some((x) => (hass.states[x].attributes.friendly_name || "") === nomeAuto);
  if (!gia_auto) {
    parla("Creo l'automazione del ciclo...");
    await creaAutomazione(hass, {
      alias: nomeAuto,
      description: "Fatta dalla scheda " + base + ". Segna quando il ciclo e' cominciato, e alla fine"
        + " scrive kWh, minuti e ora. Un apparecchio come il forno accende e spegne di continuo:"
        + " per questo il ciclo si chiude solo dopo " + ATTESA + " minuti di fermo, e il contatore"
        + " si azzera alla FINE, non alla partenza.",
      mode: "single",
      triggers: [
        { trigger: "state", entity_id: acceso, to: "on", id: "parte" },
        { trigger: "state", entity_id: acceso, to: "off", for: { minutes: ATTESA }, id: "finisce" },
      ],
      conditions: [],
      actions: [{
        choose: [
          {
            // la partenza vale solo se il contatore e' a zero: se no e' una
            // delle accensioni intermittenti dentro un ciclo gia' cominciato
            conditions: [
              { condition: "trigger", id: "parte" },
              { condition: "numeric_state", entity_id: contatore, below: 0.005 },
            ],
            sequence: [{
              action: "input_datetime.set_datetime",
              target: { entity_id: eVia },
              data: { datetime: "{{ now().strftime('%Y-%m-%d %H:%M:%S') }}" },
            }],
          },
          {
            conditions: [{ condition: "trigger", id: "finisce" }],
            sequence: [
              {
                action: "input_number.set_value", target: { entity_id: eKwh },
                data: { value: "{{ states('" + contatore + "') | float(0) | round(3) }}" },
              },
              {
                action: "input_number.set_value", target: { entity_id: eMin },
                data: {
                  value: "{{ [0, ((now() - (states('" + eVia + "') | as_datetime | as_local"
                    + " if states('" + eVia + "') not in ['unknown','unavailable'] else now()))"
                    + ".total_seconds() / 60 - " + ATTESA + ") | round(0)] | max }}",
                },
              },
              {
                action: "input_datetime.set_datetime", target: { entity_id: eFine },
                data: { datetime: "{{ (now() - timedelta(minutes=" + ATTESA + ")).strftime('%Y-%m-%d %H:%M:%S') }}" },
              },
              {
                // azzero adesso, non alla partenza: cosi' le intermittenze non
                // buttano via quello che il ciclo ha gia' consumato
                action: "utility_meter.calibrate",
                target: { entity_id: contatore }, data: { value: "0" },
              },
            ],
          },
        ],
      }],
    });
  } else parla("L'automazione c'era gia'.");

  parla("Cicli agganciati.");
  return {
    ciclo: { fine: eFine, durata: eMin, consumo: eKwh, contatore, inizio: eVia },
    soglia_acceso: acceso,
  };
}

/**
 * I kWh di una fonte (i pannelli, la batteria): se il sensore e' in Watt gli
 * costruisco il contatore, poi i due periodi. Torna { oggi, mese }.
 */
export async function creaFonte(hass, opzioni, dillo) {
  const parla = dillo || (() => {});
  const quali = (Array.isArray(opzioni.entita) ? opzioni.entita : [opzioni.entita])
    .filter((x) => x && hass.states[x]);
  if (!quali.length) throw new Error("Scegli il sensore.");
  let fonte = quali[0];
  const base = opzioni.nome || nomeSorgente(hass, fonte);

  let voci = await vociDiConfigurazione(hass);
  let reg = await registro(hass);
  const gia = (dominio, nome) => {
    const v = voci.find((x) => x.domain === dominio
      && String(x.title || "").toLowerCase() === nome.toLowerCase());
    return v ? entitaDellaVoce(reg, v.entry_id) : null;
  };
  const rinfresca = async () => { voci = await vociDiConfigurazione(hass); reg = await registro(hass); };

  // piu' apparecchi (due batterie, due inverter): prima li sommo con l'aiutante
  // "somma" di Home Assistant, poi conto i periodi su quello
  if (quali.length > 1) {
    const nomeSomma = base + " totale";
    let somma = gia("min_max", nomeSomma);
    if (!somma) {
      parla("Sommo " + quali.length + " sensori in \u00ab" + nomeSomma + "\u00bb...");
      await flusso(hass, "min_max", {
        name: nomeSomma, entity_ids: quali, type: "sum", round_digits: 3,
      });
      await rinfresca();
      somma = await sistemaNome(hass, gia("min_max", nomeSomma), nomeSomma, parla);
    }
    fonte = somma;
  }

  const a = (hass.states[fonte].attributes || {});
  const u = String(a.unit_of_measurement || "").toLowerCase();
  let kwh = fonte;
  if (u === "w" || u === "kw") {
    const nome = base + " energia";
    kwh = gia("integration", nome);
    if (!kwh) {
      parla("Calcolo i kWh di " + base.toLowerCase() + " dai Watt...");
      await creaIntegrale(hass, nome, fonte);
      await rinfresca();
      kwh = await sistemaNome(hass, gia("integration", nome), nome, parla);
    }
  } else if (u === "wh") {
    const nome = base + " kWh";
    kwh = gia("template", nome);
    if (!kwh) {
      parla("Il sensore e' in Wh: lo porto in kWh...");
      await creaEnergiaKwh(hass, nome, fonte);
      await rinfresca();
      kwh = await sistemaNome(hass, gia("template", nome), nome, parla);
    }
  }

  const fuori = {};
  for (const [chiave, ciclo] of [["oggi", "daily"], ["settimana", "weekly"], ["mese", "monthly"]]) {
    const nome = base + " " + chiave;
    let e = gia("utility_meter", nome);
    if (!e) {
      parla("Creo " + nome.toLowerCase() + "...");
      await creaContatore(hass, nome, kwh, ciclo);
      await rinfresca();
      e = await sistemaNome(hass, gia("utility_meter", nome), nome, parla);
    }
    fuori[chiave] = e;
  }
  await avvisoUnita(hass, Object.values(fuori), parla);
  return fuori;
}

/**
 * Il risparmio dei pannelli, dalla sola entita' della produzione solare.
 * Se gli dai i Watt si fa l'integrale; poi trasforma i kWh in euro con la
 * tariffa e li mette in due contatori, oggi e mese. Torna le due entita'.
 */
export async function creaRisparmio(hass, opzioni, dillo) {
  const parla = dillo || (() => {});
  const pannelli = opzioni.pannelli;
  if (!pannelli || !hass.states[pannelli]) throw new Error("Scegli il sensore dei pannelli.");
  const prezzo = opzioni.prezzo_entita;
  if (!prezzo) throw new Error("Prima scrivi la tariffa.");
  const base = nomeSorgente(hass, pannelli);

  let voci = await vociDiConfigurazione(hass);
  let reg = await registro(hass);
  const gia = (dominio, nome) => {
    const v = voci.find((x) => x.domain === dominio
      && String(x.title || "").toLowerCase() === nome.toLowerCase());
    return v ? entitaDellaVoce(reg, v.entry_id) : null;
  };
  const rinfresca = async () => { voci = await vociDiConfigurazione(hass); reg = await registro(hass); };

  // 1. i kWh dei pannelli: se il sensore e' in Watt me li calcolo
  const st = hass.states[pannelli];
  const unita = String((st.attributes || {}).unit_of_measurement || "").toLowerCase();
  let kwh = pannelli;
  if (unita === "w" || unita === "kw") {
    const nome = base + " energia";
    kwh = gia("integration", nome);
    if (!kwh) {
      parla("Calcolo i kWh dei pannelli dai Watt...");
      await creaIntegrale(hass, nome, pannelli);
      await rinfresca();
      kwh = await sistemaNome(hass, gia("integration", nome), nome, parla);
    } else parla("I kWh dei pannelli c'erano gia'.");
  }

  // 2. quanti euro sono: i kWh prodotti per quello che avresti pagato
  const nomeEuro = "Risparmio fotovoltaico";
  let euro = gia("template", nomeEuro)
    || Object.keys(hass.states).find((x) => x.startsWith("sensor.")
      && (hass.states[x].attributes.friendly_name || "") === nomeEuro);
  if (!euro) {
    parla("Creo il valore in euro del risparmio...");
    await creaCosto(hass, nomeEuro,
      "{{ (states('" + kwh + "') | float(0) * states('" + prezzo + "') | float(0)) | round(4) }}");
    await rinfresca();
    euro = await sistemaNome(hass, gia("template", nomeEuro), nomeEuro, parla);
  } else parla("Il risparmio in euro c'era gia'.");

  // 3. i due contatori, oggi e mese
  const fuori = {};
  for (const [chiave, etichetta, ciclo] of [["oggi", "oggi", "daily"], ["mese", "mese", "monthly"]]) {
    const nome = nomeEuro + " " + etichetta;
    let e = gia("utility_meter", nome);
    if (!e) {
      parla("Creo il risparmio di " + etichetta + "...");
      await creaContatore(hass, nome, euro, ciclo);
      await rinfresca();
      e = await sistemaNome(hass, gia("utility_meter", nome), nome, parla);
    }
    fuori["risparmio_" + chiave] = e;
  }
  parla("Pannelli agganciati.");
  return fuori;
}

/**
 * Crea (o ritrova) gli helper delle statistiche di un elettrodomestico.
 * Torna il pezzo di configurazione da mettere nella scheda.
 */
export async function creaSensoriElettrodomestico(hass, opzioni, dillo) {
  const potenza = opzioni.potenza;
  // se il contatore scelto e' in Wh me lo porto in kWh prima di usarlo
  if (opzioni.energia) {
    const u = String(((hass.states[opzioni.energia] || {}).attributes || {}).unit_of_measurement || "");
    if (u.toLowerCase() === "wh") {
      const nome = (opzioni.nome || nomeSorgente(hass, opzioni.energia)) + " kWh";
      const voci0 = await vociDiConfigurazione(hass);
      const reg0 = await registro(hass);
      const trovato = voci0.find((x) => x.domain === "template"
        && String(x.title || "").toLowerCase() === nome.toLowerCase());
      if (trovato) {
        opzioni = { ...opzioni, energia: entitaDellaVoce(reg0, trovato.entry_id) };
      } else {
        (dillo || (() => {}))("Il contatore e' in Wh: lo porto in kWh...");
        await creaEnergiaKwh(hass, nome, opzioni.energia);
        const reg1 = await registro(hass);
        const voci1 = await vociDiConfigurazione(hass);
        const nuovo = voci1.find((x) => x.domain === "template"
          && String(x.title || "").toLowerCase() === nome.toLowerCase());
        if (nuovo) opzioni = { ...opzioni, energia: entitaDellaVoce(reg1, nuovo.entry_id) };
      }
    }
  }
  if (!potenza || !hass.states[potenza]) throw new Error("Scegli la presa che misura i Watt.");
  const base = (opzioni.nome || nomeSorgente(hass, potenza)).trim();
  const soglia = Number(opzioni.soglia) > 0 ? Number(opzioni.soglia) : 10;
  const conto = { creati: 0, riusati: 0 };

  let voci = await vociDiConfigurazione(hass);
  let reg = await registro(hass);
  const nuovi = [];
  // cerca la voce gia' fatta; se non c'e' la crea e segna che va risolta
  const trovaOCrea = async (dominio, nome, fai, dove) => {
    const v = voci.find((x) => x.domain === dominio
      && String(x.title || "").toLowerCase() === nome.toLowerCase());
    if (v) {
      const e = entitaDellaVoce(reg, v.entry_id);
      conto.riusati++;
      if (e) dove(e);
      return e;
    }
    dillo("Creo: " + nome + "...");
    conto.creati++;
    nuovi.push([await fai(), dove, nome]);
    return null;
  };
  const risolvi = async () => {
    if (!nuovi.length) return;
    reg = await registro(hass);
    voci = await vociDiConfigurazione(hass);
    const lista = nuovi.splice(0);
    for (const [id, dove, nome] of lista) {
      let e = entitaDellaVoce(reg, id);
      if (!e) continue;
      if (nome) e = await sistemaNome(hass, e, nome, dillo);
      dove(e);
    }
  };

  // 1. "sta lavorando": serve solo per tempo e cicli
  let acceso = null;
  if (opzioni.tempi !== false) {
    await trovaOCrea("threshold", base + " in funzione",
      () => creaSoglia(hass, base + " in funzione", potenza, soglia), (e) => { acceso = e; });
    await risolvi();
    if (!acceso) throw new Error("Non trovo l'entita' della soglia appena creata.");
  }

  // 2. i kWh: quelli della presa se ci sono, se no li calcolo dai Watt
  let kwh = opzioni.energia || null;
  if (!kwh) {
    await trovaOCrea("integration", base + " energia",
      () => creaIntegrale(hass, base + " energia", potenza), (e) => { kwh = e; });
    await risolvi();
  } else {
    dillo("kWh: uso il sensore della presa (" + kwh + ").");
  }

  // 3. tempo, cicli, contatori e costi, per oggi e per il mese
  const prezzo = await prezzoDelKWh(hass, opzioni, dillo, conto);
  const periodi = {};
  const cicli = {};
  for (const [chiave, periodo, inizio, ciclo] of finestre(opzioni)) {
    periodi[periodo] = {};
    // tempo e cicli si creano SOLO se li hai chiesti: per una presa che sta
    // sempre accesa sono sei aiutanti che non guarderai mai
    if (opzioni.tempi !== false) {
      await trovaOCrea("history_stats", base + " tempo " + chiave,
        () => creaStorico(hass, base + " tempo " + chiave, acceso, "time", inizio),
        (e) => { periodi[periodo].time = e; });
      await trovaOCrea("history_stats", base + " cicli " + chiave,
        () => creaStorico(hass, base + " cicli " + chiave, acceso, "count", inizio),
        (e) => { cicli[chiave] = e; });
    }
    if (kwh) {
      const suo = (opzioni.gia || {})[chiave];
      if (suo && hass.states[suo]) {
        periodi[periodo].energy = suo;
        dillo("Contatore di " + chiave + ": uso quello che la scheda ha gia' (" + suo + ").");
        conto.riusati++;
        continue;
      }
      const comePrima = Object.keys(opzioni.memoria || {}).find((t) =>
        !/^costo/i.test(t) && new RegExp("(^|[ _])" + chiave + "$", "i").test(t));
      const nomeContatore = comePrima || (base + " energia " + chiave);
      await trovaOCrea("utility_meter", nomeContatore,
        () => creaContatore(hass, nomeContatore, kwh, ciclo),
        (e) => { periodi[periodo].energy = e; });
    }
  }
  await risolvi();
  // I costi: un sensore per il costo non lo creo piu'. La scheda sa i kWh e sa
  // il prezzo, il conto se lo fa da sola: un aiutante in meno per ogni periodo.
  // Se pero' un sensore del costo esiste gia' (l'avevi fatto tu, o c'era prima)
  // me lo tengo e la scheda usa quello.
  for (const [chiave, periodo] of finestre(opzioni).map((f) => [f[0], f[1]])) {
    const contatore = periodi[periodo].energy;
    if (!contatore) continue;
    if (!opzioni.costi) {
      const gia = Object.values(hass.states).find((x) => x.entity_id.startsWith("sensor.")
        && (x.attributes.friendly_name || "").toLowerCase()
          === ("Costo " + base.toLowerCase() + " " + chiave).toLowerCase());
      if (gia) periodi[periodo].cost = gia.entity_id;
      continue;
    }
    const nome = "Costo " + base.toLowerCase() + " " + chiave;
    await trovaOCrea("template", nome, () => creaCosto(hass, nome,
      "{{ (states('" + contatore + "') | float(0) * states('" + prezzo + "') | float(0)) | round(2) }}"),
      (e) => { periodi[periodo].cost = e; });
  }
  await risolvi();


  // se questa scheda aveva gia' dei contatori e li hai cancellati, il valore
  // se l'era segnato: lo rimetto, cosi' non riparti da zero
  const memoria = opzioni.memoria || {};
  for (const periodo of Object.keys(periodi)) {
    const eid = periodi[periodo].energy;
    const nome = Object.keys(memoria).find((k) => memoria[k].entita === eid)
      || Object.keys(memoria).find((k) => k.toLowerCase() === (base + " energia "
        + (periodo === "today" ? "oggi" : periodo === "week" ? "settimana" : "mese")).toLowerCase());
    const v = nome && memoria[nome] && memoria[nome].valore;
    if (eid && v > 0) {
      const ora = Number((hass.states[eid] || {}).state);
      if (Number.isFinite(ora) && ora >= v - 0.0005) {
        dillo(nome + ": sta gia' contando (" + ora + "), non lo tocco.");
        continue;
      }
      dillo("Rimetto " + v + " su " + nome + " (era il valore di prima).");
      try {
        await hass.callService("utility_meter", "calibrate", { entity_id: eid, value: String(v) });
      } catch (e) { dillo("Il valore vecchio non sono riuscito a rimetterlo: " + (e.message || e)); }
    }
  }
  await avvisoUnita(hass, Object.values(periodi).map((x) => x.energy), dillo);
  const patch = { period_entities: periodi, stats: { ...(opzioni.stats || {}) } };
  if (Object.keys(memoria).length) patch.helper_memoria = null;
  // senza questa la finestra dei grafici non disegna "Questo mese" e "Quest'anno"
  if (kwh) patch.energy_stat_entity = kwh;
  if (cicli.oggi) patch.stats.cycles_today = cicli.oggi;
  if (cicli.settimana) patch.stats.cycles_week = cicli.settimana;
  if (cicli.mese) patch.stats.cycles_month = cicli.mese;
  patch.settings_sections = [{ title: "Costi", rows: [{ entity: prezzo, label: "Prezzo energia (€/kWh)" }] }];
  dillo("Fatto: " + conto.creati + " creati, " + conto.riusati + " c'erano gia'.");
  return patch;
}

// Cancella gli aiutanti che questa scheda si e' fatta creare. Tocca SOLO
// entita' che stanno nella configurazione della scheda e che sono davvero
// aiutanti (una voce di configurazione con uno di questi domini): la presa e
// i sensori del dispositivo non si toccano nemmeno per sbaglio.
const DOMINI_AIUTANTI = ["threshold", "history_stats", "utility_meter", "integration", "template"];

export function aiutantiDellaScheda(hass, cfg) {
  const dentro = new Set();
  const metti = (x) => { if (x && typeof x === "string" && x.includes(".")) dentro.add(x); };
  const pe = cfg.period_entities || {};
  Object.keys(pe).forEach((k) => { metti(pe[k].energy); metti(pe[k].cost); metti(pe[k].time); });
  metti(cfg.energy_stat_entity);
  Object.values(cfg.stats || {}).forEach(metti);
  ["oggi_energia", "oggi_costo", "settimana_energia", "settimana_costo", "mese_energia", "mese_costo",
   "bolletta_energia", "bolletta_costo", "bill_today", "bill_month"].forEach((k) => metti(cfg[k]));
  // la scheda della casa tiene i suoi contatori qui dentro
  [...(cfg.periods || []), ...(cfg.periods_prev || [])].forEach((r) => { metti(r.energy); metti(r.cost); });
  // pannelli, batteria e risparmio: oggi, settimana, mese
  ["pannelli", "batteria", "risparmio"].forEach((chi) => {
    ["oggi", "settimana", "mese"].forEach((q) => metti(cfg[chi + "_" + q]));
  });
  // i pezzi dell'ultimo ciclo e la soglia "sta lavorando"
  const c = cfg.ciclo || {};
  metti(c.contatore);
  metti(cfg.soglia_acceso);
  // anche la soglia "... in funzione", che sta nel binary_sensor dei cicli
  const reg = (hass && hass.entities) || {};
  Object.keys(reg).forEach((eid) => {
    if (eid.startsWith("binary_sensor.") && /_in_funzione$/.test(eid)
        && [...dentro].some((x) => eid.replace("binary_sensor.", "").replace(/_in_funzione$/, "")
            && x.includes(eid.replace("binary_sensor.", "").replace(/_in_funzione$/, "")))) {
      dentro.add(eid);
    }
  });
  return [...dentro];
}

// Gli aiutanti VERI fra quelli nominati dalla scheda: quelli che hanno una
// voce di configurazione di un dominio da aiutante. Il resto (la presa, i
// sensori del dispositivo) non e' roba nostra e non si tocca.
export async function aiutantiVeri(hass, cfg) {
  const candidati = aiutantiDellaScheda(hass, cfg);
  if (!candidati.length) return [];
  const reg = await registro(hass);
  const voci = await vociDiConfigurazione(hass);
  const perId = {};
  voci.forEach((x) => { perId[x.entry_id] = x; });
  const fuori = [];
  candidati.forEach((eid) => {
    const e = reg.find((x) => x.entity_id === eid);
    const voce = e && e.config_entry_id ? perId[e.config_entry_id] : null;
    if (voce && DOMINI_AIUTANTI.includes(voce.domain) && !fuori.some((f) => f.entry_id === voce.entry_id)) {
      fuori.push({ entity: eid, entry_id: voce.entry_id, titolo: voce.title || eid });
    }
  });
  return fuori;
}

export async function cancellaQuesti(hass, scelti, dillo) {
  const parla = dillo || (() => {});
  const memoria = {};
  let cancellati = 0;
  for (const a of scelti) {
    const st = hass.states[a.entity];
    const n = st ? Number(st.state) : NaN;
    if (Number.isFinite(n)) {
      memoria[a.titolo] = { valore: n, entita: a.entity, quando: new Date().toISOString().slice(0, 16) };
    }
    try {
      await hass.callWS({ type: "config_entries/delete", entry_id: a.entry_id });
      parla("Cancellato: " + a.titolo);
      cancellati++;
    } catch (e) {
      parla("Non ho potuto cancellare " + a.titolo + ": " + (e.message || e));
    }
  }
  return { cancellati, memoria };
}

// Toglie dalla configurazione i riferimenti alle entita' sparite, ovunque siano.
export function scollegaEntita(cfg, spariti) {
  const via = new Set(spariti);
  const c = { ...cfg };
  const CHIAVI = ["oggi_energia", "oggi_costo", "settimana_energia", "settimana_costo",
    "mese_energia", "mese_costo", "bolletta_energia", "bolletta_costo", "energy_stat_entity",
    "soglia_acceso"];
  CHIAVI.forEach((k) => { if (via.has(c[k])) delete c[k]; });
  ["pannelli", "batteria", "risparmio"].forEach((chi) => {
    ["oggi", "settimana", "mese"].forEach((q) => {
      if (via.has(c[chi + "_" + q])) delete c[chi + "_" + q];
    });
  });
  if (c.period_entities) {
    const pe = {};
    Object.keys(c.period_entities).forEach((k) => {
      const r = { ...c.period_entities[k] };
      ["energy", "cost", "time"].forEach((x) => { if (via.has(r[x])) delete r[x]; });
      if (Object.keys(r).length) pe[k] = r;
    });
    if (Object.keys(pe).length) c.period_entities = pe; else delete c.period_entities;
  }
  ["periods", "periods_prev"].forEach((k) => {
    if (!Array.isArray(c[k])) return;
    const l = c[k].map((r) => {
      const n = { ...r };
      if (via.has(n.energy)) delete n.energy;
      if (via.has(n.cost)) delete n.cost;
      return n;
    }).filter((r) => r.energy || r.cost);
    if (l.length) c[k] = l; else delete c[k];
  });
  if (c.stats) {
    const st = { ...c.stats };
    Object.keys(st).forEach((k) => { if (via.has(st[k])) delete st[k]; });
    if (Object.keys(st).length) c.stats = st; else delete c.stats;
  }
  if (c.ciclo && via.has(c.ciclo.contatore)) {
    const ci = { ...c.ciclo };
    delete ci.contatore;
    c.ciclo = ci;
  }
  return c;
}
