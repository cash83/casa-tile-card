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

async function creaCosto(hass, nome, stato) {
  // il flusso dei template parte da un menu: prima dico che voglio un sensore
  return flusso(hass, "template", {
    name: nome, state: stato, unit_of_measurement: "€",
    device_class: "monetary", state_class: "total",
  }, "sensor");
}

// tutti gli aiutanti che sono un prezzo in euro al kWh
export function prezziDelKWh(hass) {
  const st = (hass && hass.states) || {};
  const suo = (id) => String((st[id].attributes || {}).unit_of_measurement || "").replace(/\s/g, "");
  return Object.keys(st).filter((id) => id.startsWith("input_number.") && suo(id) === "€/kWh")
    // il totale per primo: e' quello che serve alla scheda della casa
    .sort((a, b) => (a === "input_number.prezzo_energia" ? -1 : 0)
      - (b === "input_number.prezzo_energia" ? -1 : 0) || a.localeCompare(b));
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
    type: "input_number/create", name: "Prezzo energia", min: 0, max: 5, step: 0.001,
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
    const nome = base + " " + chiave;
    const vecchio = gia("utility_meter", nome);
    if (vecchio) {
      contatori[chiave] = vecchio;
      conto.riusati++;
      dillo(etichetta + ": c'era gia' (" + vecchio + ").");
    } else {
      dillo("Creo il contatore di " + etichetta.toLowerCase() + "...");
      nuovi.push([chiave, await creaContatore(hass, nome, sorgente, ciclo)]);
      conto.creati++;
    }
  }
  if (nuovi.length) {
    reg = await registro(hass);
    nuovi.forEach(([chiave, id]) => {
      const e = entitaDellaVoce(reg, id);
      if (e) contatori[chiave] = e;
    });
  }

  // 3. i costi: i kWh del periodo per il prezzo
  const costi = {};
  const nuoviCosti = [];
  const perPrezzo = (entita) => "{{ (states('" + entita + "') | float(0) * states('"
    + prezzo + "') | float(0)) | round(2) }}";
  voci = await vociDiConfigurazione(hass);
  for (const [etichetta, chiave] of PERIODI.map((p) => [p[0], p[1]])) {
    if (!contatori[chiave]) continue;
    const nome = "Costo " + base.toLowerCase() + " " + chiave;
    const vecchio = gia("template", nome);
    if (vecchio) {
      costi[chiave] = vecchio;
      conto.riusati++;
    } else {
      dillo("Creo il costo di " + etichetta.toLowerCase() + "...");
      nuoviCosti.push([chiave, await creaCosto(hass, nome, perPrezzo(contatori[chiave]))]);
      conto.creati++;
    }
  }
  // e il costo di ieri, dal periodo chiuso del contatore di oggi
  if (contatori.oggi) {
    const nome = "Costo " + base.toLowerCase() + " ieri";
    const vecchio = gia("template", nome);
    if (vecchio) { costi.ieri = vecchio; conto.riusati++; } else {
      dillo("Creo il costo di ieri...");
      const stato = "{{ (state_attr('" + contatori.oggi + "', 'last_period') | float(0) * states('"
        + prezzo + "') | float(0)) | round(2) }}";
      nuoviCosti.push(["ieri", await creaCosto(hass, nome, stato)]);
      conto.creati++;
    }
  }
  if (nuoviCosti.length) {
    reg = await registro(hass);
    nuoviCosti.forEach(([chiave, id]) => {
      const e = entitaDellaVoce(reg, id);
      if (e) costi[chiave] = e;
    });
  }

  // 4. il pezzo di configurazione per la scheda
  const periods = PERIODI.filter((p) => contatori[p[1]]).map(([etichetta, chiave]) => {
    const riga = { label: etichetta, energy: contatori[chiave] };
    if (costi[chiave]) riga.cost = costi[chiave];
    return riga;
  });
  const patch = { periods };
  if (contatori.oggi) {
    const ieri = { label: "Ieri", energy: contatori.oggi, energy_attr: "last_period" };
    if (costi.ieri) ieri.cost = costi.ieri;
    patch.periods_prev = [ieri];
  }
  patch.settings_sections = [{ title: "Costi", rows: [{ entity: prezzo, label: "Prezzo energia (€/kWh)" }] }];
  dillo("Fatto: " + conto.creati + " creati, " + conto.riusati + " c'erano gia'.");
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
const FINESTRE = [
  ["oggi", "today", "{{ today_at() }}", "daily"],
  ["mese", "month", "{{ now().replace(day=1, hour=0, minute=0, second=0, microsecond=0) }}", "monthly"],
];

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
    method: "left", round: 3, max_sub_interval: { hours: 0, minutes: 5, seconds: 0 },
  });
}

/**
 * Crea (o ritrova) gli helper delle statistiche di un elettrodomestico.
 * Torna il pezzo di configurazione da mettere nella scheda.
 */
export async function creaSensoriElettrodomestico(hass, opzioni, dillo) {
  const potenza = opzioni.potenza;
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
    nuovi.push([await fai(), dove]);
    return null;
  };
  const risolvi = async () => {
    if (!nuovi.length) return;
    reg = await registro(hass);
    voci = await vociDiConfigurazione(hass);
    nuovi.splice(0).forEach(([id, dove]) => {
      const e = entitaDellaVoce(reg, id);
      if (e) dove(e);
    });
  };

  // 1. "sta lavorando"
  let acceso = null;
  await trovaOCrea("threshold", base + " in funzione",
    () => creaSoglia(hass, base + " in funzione", potenza, soglia), (e) => { acceso = e; });
  await risolvi();
  if (!acceso) throw new Error("Non trovo l'entita' della soglia appena creata.");

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
  for (const [chiave, periodo, inizio, ciclo] of FINESTRE) {
    periodi[periodo] = {};
    await trovaOCrea("history_stats", base + " tempo " + chiave,
      () => creaStorico(hass, base + " tempo " + chiave, acceso, "time", inizio),
      (e) => { periodi[periodo].time = e; });
    await trovaOCrea("history_stats", base + " cicli " + chiave,
      () => creaStorico(hass, base + " cicli " + chiave, acceso, "count", inizio),
      (e) => { cicli[chiave] = e; });
    if (kwh) {
      await trovaOCrea("utility_meter", base + " energia " + chiave,
        () => creaContatore(hass, base + " energia " + chiave, kwh, ciclo),
        (e) => { periodi[periodo].energy = e; });
    }
  }
  await risolvi();
  // i costi vengono dopo: hanno bisogno dei contatori gia' risolti
  for (const [chiave, periodo] of FINESTRE.map((f) => [f[0], f[1]])) {
    const contatore = periodi[periodo].energy;
    if (!contatore) continue;
    const nome = "Costo " + base.toLowerCase() + " " + chiave;
    await trovaOCrea("template", nome, () => creaCosto(hass, nome,
      "{{ (states('" + contatore + "') | float(0) * states('" + prezzo + "') | float(0)) | round(2) }}"),
      (e) => { periodi[periodo].cost = e; });
  }
  await risolvi();

  const patch = { period_entities: periodi, stats: { ...(opzioni.stats || {}) } };
  // senza questa la finestra dei grafici non disegna "Questo mese" e "Quest'anno"
  if (kwh) patch.energy_stat_entity = kwh;
  if (cicli.oggi) patch.stats.cycles_today = cicli.oggi;
  if (cicli.mese) patch.stats.cycles_month = cicli.mese;
  patch.settings_sections = [{ title: "Costi", rows: [{ entity: prezzo, label: "Prezzo energia (€/kWh)" }] }];
  dillo("Fatto: " + conto.creati + " creati, " + conto.riusati + " c'erano gia'.");
  return patch;
}
