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

// QUANDO E' COMINCIATO IL PERIODO IN CORSO (ora locale).
// Serve al ripristino del valore vecchio: cancellando gli aiutanti alle 23:00
// e rifacendoli alle 00:30, il contatore di «oggi» appena nato veniva
// calibrato al valore di IERI, perche' il confronto guardava solo il numero.
// Quel salto entra anche nelle statistiche a lungo termine - l'utility_meter
// e' `total_increasing` - e da li' non si toglie piu'.
function inizioDelPeriodo(chiave) {
  const q = String(chiave || "").toLowerCase();
  const d = new Date();
  const a = d.getFullYear();
  const m = d.getMonth();
  const g = d.getDate();
  if (["ora", "hour", "hourly"].includes(q)) return new Date(a, m, g, d.getHours());
  if (["oggi", "today", "daily"].includes(q)) return new Date(a, m, g);
  // la settimana comincia di lunedi': getDay() torna 0 per la domenica
  if (["settimana", "week", "weekly"].includes(q)) return new Date(a, m, g - ((d.getDay() + 6) % 7));
  if (["mese", "month", "monthly"].includes(q)) return new Date(a, m, 1);
  // il bimestre comincia il primo dei mesi dispari (qui gennaio e' 0)
  if (["bimestre", "bimonthly"].includes(q)) return new Date(a, m % 2 === 0 ? m : m - 1, 1);
  return null;
}

// il valore che mi ero segnato e' ancora di questo periodo?
function stessoPeriodo(quando, chiave) {
  const inizio = inizioDelPeriodo(chiave);
  if (!inizio) return true;        // un ciclo che non conosco: non mi metto in mezzo
  if (!quando) return false;       // non so di quando e' quel valore: non lo rimetto
  // `cancellaQuesti` lo scrive in UTC, tagliato ai minuti e senza la Z
  const t = new Date(/[zZ]$/.test(String(quando)) ? String(quando) : quando + "Z");
  if (isNaN(t.getTime())) return false;
  return t.getTime() >= inizio.getTime();
}

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

// RIMETTE A POSTO UNA VOCE CHE C'E' GIA'.
//
// `gia(...)` ritrova l'aiutante che c'e' e NON gli riscrive dentro niente:
// correggere un template qui serviva solo a chi lo creava da zero, mentre chi
// ce l'aveva gia' si teneva quello sbagliato per sempre (e il costo della
// bolletta senza la quota fissa non si vede, e' solo piu' basso).
// Questo apre il flusso delle OPZIONI della voce, parte dai valori che ci
// sono - il flusso li porta indietro come `suggested_value`, sono quelli che
// l'interfaccia ti mostra gia' compilati - e cambia solo i campi che gli
// dico: cosi' non azzera quelli che non conosce. Se non riesce a leggere
// quello che c'e' dentro lascia perdere, invece di sovrascrivere a occhi
// chiusi. `cambi[campo] = null` vuol dire "questo campo va via".
async function riallinea(hass, entryId, cambi, parla, perche) {
  if (!entryId || !cambi) return false;
  const dillo = parla || (() => {});
  try {
    let r = await hass.callApi("POST", "config/config_entries/options/flow",
      { handler: entryId, show_advanced_options: true });
    for (let giro = 0; giro < 8; giro++) {
      if (!r || r.type === "create_entry" || r.type === "abort") return false;
      const campi = (r.data_schema || []).filter((c) => c && c.name);
      if (!campi.length) return false;
      const ora = {};
      let letti = 0;
      campi.forEach((c) => {
        const d = c.description || {};
        if (Object.prototype.hasOwnProperty.call(d, "suggested_value")) {
          ora[c.name] = d.suggested_value;
          letti++;
        }
      });
      if (!letti) return false;              // non so cosa c'e' dentro: non lo tocco
      const invio = { ...ora };
      let cambiato = false;
      Object.keys(cambi).forEach((k) => {
        if (!campi.some((c) => c.name === k)) return;   // campo che non mi offre
        if (cambi[k] === null) {
          if (invio[k] !== undefined && invio[k] !== null && invio[k] !== "") cambiato = true;
          delete invio[k];
          return;
        }
        if (String(invio[k] === undefined || invio[k] === null ? "" : invio[k]) !== String(cambi[k])) {
          cambiato = true;
        }
        invio[k] = cambi[k];
      });
      if (!cambiato) return false;           // e' gia' come lo scriverei oggi
      r = await hass.callApi("POST", "config/config_entries/options/flow/" + r.flow_id, invio);
      if (r && r.type === "create_entry") {
        dillo("Ho rimesso a posto un aiutante che c'era gia'" + (perche ? ": " + perche : "") + ".");
        return true;
      }
    }
  } catch (e) { /* non ci riesco: meglio lasciare quello che c'e' */ }
  return false;
}

// la voce di configurazione di un'entita' (per poterla riallineare)
function voceDellEntita(reg, voci, eid) {
  const e = (reg || []).find((x) => x.entity_id === eid);
  if (!e || !e.config_entry_id) return null;
  return (voci || []).find((v) => v.entry_id === e.config_entry_id) || null;
}

async function creaContatore(hass, nome, sorgente, ciclo) {
  return flusso(hass, "utility_meter", {
    name: nome, source: sorgente, cycle: ciclo, offset: 0, tariffs: [],
    net_consumption: false, delta_values: false, periodically_resetting: true,
    always_available: true,
  });
}

// UN CONTATORE NON SI LEGGE CON `float(0)`.
//
// Un contatore cumulativo (kWh) che non si riesce a leggere - presa staccata,
// integrazione ricaricata, OGNI riavvio di Home Assistant - con `float(0)`
// diventa ZERO, e quello zero costa: per un sensore
// `state_class: total_increasing` il recorder vede il calo, dichiara "il
// contatore e' ripartito da zero" e quando il valore torna somma alle
// statistiche a lungo termine TUTTO il contatore. Nel pannello Energia resta
// un picco grande come il contatore intero, e non lo ripulisce nessun
// aggiornamento della scheda: si corregge solo a mano da
// Developer tools > Statistics. Lo stesso zero fa ripartire da capo anche gli
// utility_meter costruiti sopra.
// Quindi quando la sorgente non e' un numero il template non pubblica
// niente: `none` diventa "unknown", e uno stato non numerico il recorder lo
// SALTA, senza inventarsi ne' cali ne' ripartenze.
//
// Dove invece la somma deve valere zero se un pezzo manca - la quota fissa
// che non e' ancora stata creata, il prezzo - `float(0)` RESTA: li' lo zero
// e' la verita', non una bugia.
const daStato = (ent) => "states('" + ent + "')";
const daAttributo = (ent, attr) => "state_attr('" + ent + "', '" + attr + "')";

// `letture` sono espressioni Jinja (daStato/daAttributo): diventano v0, v1...
// e la `formula` si calcola solo se sono tutte dei numeri.
function seLeggibili(letture, formula) {
  const quali = [].concat(letture);
  const set = quali.map((e, i) => "{% set v" + i + " = " + e + " | float(default=none) %}").join("");
  const cond = quali.map((e, i) => "v" + i + " is not none").join(" and ");
  return set + "{% if " + cond + " %}{{ " + formula + " }}{% else %}{{ none }}{% endif %}";
}

// Lo stesso controllo come template di DISPONIBILITA'. Se il flusso di Home
// Assistant offre il campo `availability` l'entita' diventa "unavailable"
// invece di "unknown" (piu' pulito: il recorder salta tutte e due); se non lo
// offre, `flusso` non lo manda e ci pensa il template dello stato.
function disponibileSe(letture) {
  return "{{ " + [].concat(letture).map((e) => e + " | float(default=none) is not none")
    .join(" and ") + " }}";
}

function datiEnergiaKwh(nome, sorgente) {
  return {
    name: nome,
    state: seLeggibili(daStato(sorgente), "(v0 / 1000) | round(4)"),
    availability: disponibileSe(daStato(sorgente)),
    unit_of_measurement: "kWh", device_class: "energy", state_class: "total_increasing",
  };
}

async function creaEnergiaKwh(hass, nome, sorgente) {
  return flusso(hass, "template", datiEnergiaKwh(nome, sorgente), "sensor");
}

// `cresce: false` per i sensori che sono una FOTOGRAFIA e non un contatore.
// `state_class: total` vuole un valore che cresce (o che dice quando e'
// ripartito): su "Costo ... ieri", che a ogni mezzanotte sale o scende a
// seconda di com'e' andato il giorno prima, la somma delle statistiche a
// lungo termine non significa niente - e quella somma sbagliata resta nel
// database anche dopo. Quelli nascono senza state_class: restano un valore
// da guardare, che e' quello che sono.
function datiCosto(nome, stato, extra) {
  const o = extra || {};
  const d = {
    name: nome, state: stato, unit_of_measurement: "€", device_class: "monetary",
  };
  if (o.cresce !== false) d.state_class = "total";
  if (o.disponibile) d.availability = o.disponibile;
  return d;
}

async function creaCosto(hass, nome, stato, extra) {
  // il flusso dei template parte da un menu: prima dico che voglio un sensore
  return flusso(hass, "template", datiCosto(nome, stato, extra), "sensor");
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

// LO SCRIPT DELL'AZZERAMENTO. Uno per tutta la casa: non sa quali apparecchi
// hai, gli arrivano le entita' come variabili dal tasto della scheda. Cosi'
// non va riscritto per ogni elettrodomestico, e chi installa non deve
// scriverselo. Il mese lo lascia stare se non glielo chiedi.
export const ID_AZZERA = "casa_tile_azzera";

function passoAzzera(titolo, quale, servizio, valore) {
  return {
    alias: titolo,
    if: [{ condition: "template",
      value_template: "{{ " + quale + " | default('', true) != ''"
        + " and states(" + quale + ") not in ['unknown', 'unavailable'] }}" }],
    then: [{ action: servizio, target: { entity_id: "{{ " + quale + " }}" }, data: valore }],
  };
}

// due pezzi di configurazione sono lo stesso pezzo? (le chiavi in ordine,
// cosi' non conta come sono scritte)
function ordinato(x) {
  if (Array.isArray(x)) return "[" + x.map(ordinato).join(",") + "]";
  if (x && typeof x === "object") {
    return "{" + Object.keys(x).sort().map((k) => JSON.stringify(k) + ":" + ordinato(x[k])).join(",") + "}";
  }
  return JSON.stringify(x === undefined ? null : x);
}

export async function creaScriptAzzera(hass, dillo) {
  const parla = dillo || (() => {});
  const eid = "script." + ID_AZZERA;
  const mese = passoAzzera("Il mese, solo se lo hai chiesto", "mese",
    "utility_meter.calibrate", { value: "0" });
  mese.if[0].value_template = "{{ anche_il_mese | default(false)"
    + " and mese | default('', true) != ''"
    + " and states(mese) not in ['unknown', 'unavailable'] }}";
  const conf = {
    alias: "Azzera i contatori di un apparecchio",
    icon: "mdi:restart",
    mode: "single",
    description: "Lo chiama il tasto \u00abAzzera i contatori\u00bb delle schede"
      + " casa-elettrodomestico, che gli passa le entita' di quell'apparecchio."
      + " Uno solo basta per tutta la casa. Lo storico gia' registrato non si tocca.",
    fields: {
      anche_il_mese: {
        name: "Azzera anche il mese",
        description: "Spento azzera oggi, la settimana e l'ultimo ciclo",
        default: false,
        selector: { boolean: {} },
      },
    },
    sequence: [
      passoAzzera("Il contatore di oggi", "oggi", "utility_meter.calibrate", { value: "0" }),
      passoAzzera("Il contatore della settimana", "settimana", "utility_meter.calibrate", { value: "0" }),
      mese,
      passoAzzera("Il contatore del ciclo in corso", "ciclo_contatore", "utility_meter.calibrate", { value: "0" }),
      passoAzzera("I kWh dell'ultimo ciclo", "ciclo_kwh", "input_number.set_value", { value: 0 }),
      passoAzzera("I minuti dell'ultimo ciclo", "ciclo_minuti", "input_number.set_value", { value: 0 }),
    ],
  };
  // LO SCRIPT VECCHIO SI RISCRIVE. Prima c'era un `if (hass.states[eid])
  // return eid` in cima: uno script creato da una versione vecchia non veniva
  // mai aggiornato, anche dopo che i passi erano cambiati, e chi ce l'aveva
  // gia' si teneva per sempre l'azzeramento di allora. Adesso confronto
  // quello che c'e' con quello che scriverei oggi e lo riscrivo solo se
  // differisce (stesso id = stessa entita', niente storico perso).
  if (hass.states[eid]) {
    let attuale = null;
    try {
      attuale = await hass.callApi("GET", "config/script/config/" + ID_AZZERA);
    } catch (e) { attuale = null; }
    if (attuale && typeof attuale === "object") {
      const soloMie = {};
      Object.keys(conf).forEach((k) => { soloMie[k] = attuale[k]; });
      if (ordinato(soloMie) === ordinato(conf)) return eid;
      parla("Lo script dell'azzeramento e' di una versione vecchia: lo riscrivo.");
    } else {
      // non riesco a leggere quello che c'e': non lo tocco, meglio il suo
      // che un mio sovrascritto alla cieca
      return eid;
    }
  } else parla("Creo lo script dell'azzeramento...");
  await hass.callApi("POST", "config/script/config/" + ID_AZZERA, conf);
  parla("Script dell'azzeramento: " + eid);
  return eid;
}

// Il prezzo che la scheda della casa tiene per tutti: la SOLA energia, quella
// che va sugli apparecchi e sulle prese. Se non c'e', il totale.
export function prezzoDellaCasa(hass) {
  const st = (hass && hass.states) || {};
  if (st["input_number.prezzo_luce_energia"]) return "input_number.prezzo_luce_energia";
  const soli = prezziDelKWh(hass).filter((id) => !INGREDIENTE.test(id));
  const energia = soli.filter((id) => Number(st[id].state) > 0 && Number(st[id].state) < 0.20);
  return energia[0] || soli[0] || "";
}

// ASPETTA CHE L'AIUTANTE CI SIA DAVVERO.
//
// Home Assistant, quando gli chiedi di creare un input_number, risponde
// subito ma l'entita' compare un attimo dopo. Chi crea e scrive di fila
// scrive nel VUOTO: nessun errore, nessun valore, e l'aiutante resta a
// "unknown". Non si vede da chi ce li ha gia' (il ramo della creazione non
// lo percorre mai), quindi morde solo alla prima installazione - cioe'
// proprio a chi usa "Compila da solo".
//
// Non guardo `hass.states`: dentro a una scheda quella e' una fotografia che
// Home Assistant sostituisce, e la nostra copia non cambierebbe mai. Chiedo
// a lui l'elenco vero, finche' non ce lo vede.
//
// L'INDIRIZZO DEVE ESSERE QUELLO VERO, non lo slug che mi aspetto: se quello
// slug e' occupato da un'entita' che in `hass.states` non si vede (un
// aiutante disabilitato) Home Assistant crea il doppione e lo chiama
// `..._2`. Aspettando lo slug sbagliato l'attesa andava in timeout dopo 3
// secondi, l'utente leggeva "non si fa vedere: il valore non l'ho scritto" e
// restava un input_number nuovo e vuoto. L'id vero sta nella risposta della
// creazione: vedi `daCreato`.
async function aspettaAiutante(hass, entityId, quanti = 25) {
  const pezzi = String(entityId).split(".");
  const dominio = pezzi[0];
  const chiave = pezzi.slice(1).join(".");
  if (!dominio || !chiave) return false;
  for (let i = 0; i < quanti; i++) {
    try {
      const elenco = await hass.callWS({ type: dominio + "/list" });
      if ((elenco || []).some((x) => x && x.id === chiave)) return true;
    } catch (e) { /* non risponde: riprovo */ }
    await new Promise((r) => setTimeout(r, 120));
  }
  return false;
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
      // l'indirizzo lo dice la risposta, non lo indovino dal nome
      const fatto = await hass.callWS({
        type: "input_number/create", name: v.nome, min: 0, max: v.unita === "%" ? 100 : 5,
        step: v.unita === "%" ? 1 : 0.0001, mode: "box", unit_of_measurement: v.unita,
        icon: "mdi:currency-eur",
      });
      const vero = daCreato("input_number", fatto, v.nome);
      if (vero !== v.id) {
        parla("⚠ L'indirizzo " + v.id + " era gia' occupato: " + v.nome
          + " e' nato come " + vero + ". Le altre schede cercano quello di prima:"
          + " o rinomini l'aiutante che lo occupa, o " + v.nome + " lo scrivi a mano.");
      }
      v = { ...v, id: vero };
      if (!await aspettaAiutante(hass, v.id)) {
        parla("⚠ " + v.nome + " non si fa vedere: il valore non l'ho scritto.");
        continue;
      }
    }
    await hass.callService("input_number", "set_value", { entity_id: v.id, value: n });
    messi[v.chiave] = n;
    parla(v.nome + ": " + n + " " + v.unita);
  }
  const base = (messi.energia || 0) + (messi.rete || 0) + (messi.accise || 0);
  const totale = Math.round(base * (1 + (messi.iva || 0) / 100) * 10000) / 10000;
  if (totale > 0) {
    // anche qui l'indirizzo e' quello che dice la risposta della creazione
    let idTotale = ID_TOTALE;
    if (!hass.states[ID_TOTALE]) {
      const fatto = await hass.callWS({
        type: "input_number/create", name: "Prezzo energia", min: 0, max: 5, step: 0.0001,
        mode: "box", unit_of_measurement: "\u20ac/kWh", icon: "mdi:currency-eur",
      });
      idTotale = daCreato("input_number", fatto, "Prezzo energia");
      if (idTotale !== ID_TOTALE) {
        parla("L'indirizzo " + ID_TOTALE + " era gia' occupato: il totale e' nato come "
          + idTotale + ", e le altre schede cercano quello di prima.");
      }
      if (!await aspettaAiutante(hass, idTotale)) {
        parla("⚠ Il totale non si fa vedere: non l'ho scritto.");
        return { totale, energia: messi.energia || 0 };
      }
    }
    await hass.callService("input_number", "set_value", { entity_id: idTotale, value: totale });
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
  // la SOLA energia, non il totale di bolletta: prezziDelKWh mette per primo
  // `prezzo_energia` (tutto compreso) perche' serve alla scheda della casa, e
  // prenderlo qui faceva pagare le tasse due volte sugli elettrodomestici.
  const gia = prezzoDellaCasa(hass) || prezziDelKWh(hass)[0];
  if (gia) {
    dillo("Prezzo: uso quello che c'era gia' (" + gia + ").");
    conto.riusati++;
    return gia;
  }
  dillo("Creo il prezzo in €/kWh...");
  const fatto = await hass.callWS({
    type: "input_number/create", name: "Prezzo energia", min: 0, max: 5, step: 0.0001,
    mode: "box", unit_of_measurement: "€/kWh", icon: "mdi:currency-eur",
  });
  // l'indirizzo e' quello della risposta: se `prezzo_energia` era occupato da
  // un aiutante che in `hass.states` non si vede, questo e' nato come
  // `..._2` e scrivere nel primo non farebbe niente
  const suo = daCreato("input_number", fatto, "Prezzo energia");
  // stesso motivo di scriviTariffa: appena creato l'aiutante non c'e'
  // ancora, e scrivergli dentro il valore non farebbe niente
  if (!await aspettaAiutante(hass, suo)) {
    dillo("Il prezzo non si fa vedere: scrivilo tu nel pop-up della scheda.");
    return suo;
  }
  conto.creati++;
  const v = Number(opzioni.prezzo);
  if (Number.isFinite(v) && v > 0) {
    try {
      await hass.callService("input_number", "set_value", { entity_id: suo, value: v });
    } catch (e) { dillo("Il prezzo lo scrivi tu nel pop-up della scheda."); }
  }
  return suo;
}

/**
 * Crea (o ritrova) contatori e costi. `dillo(testo)` racconta cosa sta facendo.
 * Torna il pezzo di configurazione da mettere nella scheda.
 */
// Cerca una voce di configurazione gia' fatta, per dominio e nome. Sta qui
// fuori perche' quattro funzioni qui sotto la facevano uguale, ognuna con la
// sua copia: quattro posti dove sbagliare lo stesso confronto.
function cercaVoce(voci, reg, dominio, nome) {
  const v = voci.find((x) => x.domain === dominio
    && String(x.title || "").toLowerCase() === nome.toLowerCase());
  return v ? entitaDellaVoce(reg, v.entry_id) : null;
}

// ------------------------------------------------------------ IL MARCATORE
//
// Riconoscere i propri aiutanti dal solo TITOLO della voce di configurazione
// non basta. Due schede casa-elettrodomestico chiamate entrambe «Forno» si
// prendevano gli aiutanti a vicenda: la seconda adottava soglia, contatore
// del ciclo e le quattro memorie della prima, e poi le riscriveva anche
// l'automazione; le due schede mostravano gli stessi numeri e «Cancella gli
// aiutanti» di una cancellava quelli dell'altra. E un aiutante fatto a mano
// dall'utente, se si chiamava come il mio, finiva nella cancellazione gia'
// spuntato.
//
// Quindi ogni aiutante che creo lo scrivo in configurazione sotto
// `aiutanti_miei` (ruolo -> entita'): QUELLA e' la prova che e' roba mia,
// insieme al taccuino di questo giro del tasto (APPENA_FATTI) e agli
// indirizzi che la scheda si tiene gia' (`ciclo`, `soglia_acceso`).
// Il titolo resta solo come RIPIEGO per le schede nate prima di questa
// correzione - quelle che hanno aiutanti scritti in configurazione ma nessun
// elenco - e per chi li rifa' dopo averli cancellati: cosi' le
// installazioni di prima ritrovano i loro.
//
// NOTA PER CHI LAVORA SUGLI EDITOR: perche' il ripiego si spenga davvero
// anche sulle schede nuove, l'editor deve ripassare qui `aiutanti_miei` fra
// le opzioni (una riga: `aiutanti_miei: this._config.aiutanti_miei`).
// Finche' non lo fa, il riconoscimento resta quello di prima; l'elenco serve
// comunque da subito, perche' e' lui che tiene in piedi «Cancella gli
// aiutanti» (niente piu' orfani) e che distingue la roba tua dalla mia.

// Gli aiutanti creati in QUESTO giro del tasto. creaCicli parte subito dopo
// creaSensoriElettrodomestico e non riceve la sua patch: senza questo
// taccuino la soglia appena fatta la ritrovava solo per nome - che e'
// quello che stiamo smettendo di fare - e ne nasceva una seconda. La chiave
// comprende la SORGENTE, cosi' due schede con lo stesso nome ma su prese
// diverse non si scambiano niente. Vive quanto la pagina dell'editor: non e'
// memoria, e' il passaggio di mano dentro allo stesso clic.
const APPENA_FATTI = new Map();
const chiaveFatto = (dominio, nome, sorgente) =>
  dominio + "|" + String(nome || "").trim().toLowerCase() + "|" + (sorgente || "");
function segnaFatto(dominio, nome, sorgente, eid) {
  if (eid) APPENA_FATTI.set(chiaveFatto(dominio, nome, sorgente), eid);
  return eid || null;
}
function giaFatto(dominio, nome, sorgente) {
  return APPENA_FATTI.get(chiaveFatto(dominio, nome, sorgente)) || null;
}

// Guarda davvero questa sorgente? La soglia se lo tiene nell'attributo
// `entity_id`, l'integrale (Riemann) in `source`. utility_meter,
// history_stats e i template non lo dicono: li' torna null, «non lo so».
function guardaQuesto(hass, eid, sorgente) {
  const a = ((hass.states[eid] || {}).attributes) || {};
  const suo = a.entity_id || a.source || a.source_id;
  if (!suo || !sorgente) return null;
  return [].concat(suo).includes(sorgente);
}

// Questa scheda ha gia' degli aiutanti suoi? (allora e' una di prima del
// marcatore, e il ripiego sul titolo le serve per ritrovarli)
function schedaConAiutanti(opzioni) {
  const o = opzioni || {};
  const pieno = (x) => !!x && typeof x === "object" && Object.values(x).some((v) => v);
  return pieno(o.gia) || pieno(o.ciclo) || pieno(o.memoria) || pieno(o.stats)
    || !!o.soglia_acceso || !!o.reset_script || !!o.aiutanti_miei;
}

/**
 * Il libretto degli aiutanti di una scheda. `stato()` deve tornare
 * { voci, reg } aggiornati (li rinfresca chi crea).
 * `sempreIlTitolo: true` per la scheda della casa, dove i contatori non
 * tornano indietro nelle opzioni e il titolo e' l'unica strada che c'e'.
 */
function proprieta(hass, opzioni, stato, sempreIlTitolo) {
  const mappa = { ...((opzioni && opzioni.aiutanti_miei) || {}) };
  const conElenco = Object.keys(mappa).length > 0;
  const ripiego = !!sempreIlTitolo || (!conElenco && schedaConAiutanti(opzioni));
  return {
    mappa,
    ripiego,
    // l'aiutante di questo ruolo: il mio se ce l'ho ancora, se no quello che
    // si chiama come lo chiamerei io - ma solo col ripiego, o se dimostra di
    // guardare la mia stessa sorgente
    mio(ruolo, dominio, nome, sorgente) {
      const fatto = giaFatto(dominio, nome, sorgente);
      if (fatto) return fatto;
      const { voci, reg } = stato();
      const suo = mappa[ruolo];
      // c'e' ancora? lo chiedo al REGISTRO, non a `hass.states`: quella e'
      // una fotografia di prima e un aiutante creato in questo stesso giro
      // del tasto non ci sarebbe
      if (suo && (reg || []).some((x) => x.entity_id === suo)) return suo;
      const trovato = cercaVoce(voci || [], reg || [], dominio, nome);
      if (!trovato) return null;
      if (ripiego) return trovato;
      return guardaQuesto(hass, trovato, sorgente) === true ? trovato : null;
    },
    segna(ruolo, eid) { if (eid) mappa[ruolo] = eid; return eid || null; },
  };
}

// IL NOME DI BASE, UNO SOLO PER TUTTI.
// creaSensoriElettrodomestico e creaCicli se lo calcolavano ognuna a modo
// suo: la prima col nome del DISPOSITIVO e il `.trim()`, la seconda col solo
// `name` della scheda, senza ripiego e senza trim. Senza `name` la prima
// creava «Lavatrice in funzione» e la seconda cercava «Lavatrice Potenza in
// funzione» (il friendly_name dei watt: `nomeSorgente` toglie
// energia/totale, non «potenza») e ne faceva una SECONDA: in configurazione
// finiva la seconda, i history_stats restavano agganciati alla prima, che
// non stava in nessuna chiave e non si poteva piu' cancellare. Bastava uno
// spazio in fondo al nome.
const BASE_DECISA = new Map();
function nomeDispositivo(hass, eid) {
  const voce = ((hass && hass.entities) || {})[eid];
  const dev = voce && voce.device_id && ((hass.devices || {})[voce.device_id]);
  const n = dev && (dev.name_by_user || dev.name);
  return n ? String(n).trim() : "";
}
function nomeBase(hass, opzioni, sorgente) {
  const dato = String((opzioni && opzioni.nome) || "").trim();
  if (dato) return dato;
  // quello che ha deciso creaSensoriElettrodomestico in questo stesso giro
  // (e' lui che ha anche il contatore dei kWh per scegliere il dispositivo)
  if (BASE_DECISA.has(sorgente)) return BASE_DECISA.get(sorgente);
  return nomeDispositivo(hass, sorgente) || nomeSorgente(hass, sorgente);
}

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
  // La scheda della casa cerca ANCHE per titolo, sempre: i suoi contatori non
  // tornano indietro nelle opzioni quando ripremi il tasto, quindi il titolo
  // e' l'unica strada per ritrovarli invece di rifarli. Qui non c'e' il
  // rischio delle due schede omonime: di casa ce n'e' una.
  const libretto = proprieta(hass, opzioni, () => ({ voci, reg }), true);

  // 1. il prezzo in euro al kWh
  const prezzo = await prezzoDelKWh(hass, opzioni, dillo, conto);

  // 2. i contatori: uno per periodo
  const contatori = {};
  const nuovi = [];
  for (const [etichetta, chiave, ciclo] of PERIODI) {
    const nome = comePrima(chiave, false) || (base + " " + chiave);
    const vecchio = libretto.mio("contatore_" + chiave, "utility_meter", nome);
    if (vecchio) {
      contatori[chiave] = libretto.segna("contatore_" + chiave, vecchio);
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
      if (!e) continue;
      contatori[chiave] = libretto.segna("contatore_" + chiave,
        await sistemaNome(hass, e, nome, dillo));
      segnaFatto("utility_meter", nome, sorgente, contatori[chiave]);
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
  // I giorni si contano dal CALENDARIO, non da `last_reset` del contatore.
  //
  // `last_reset` dice quando il contatore e' stato azzerato, che non e' quando
  // e' cominciato il periodo: un contatore nato - o anche solo RINOMINATO - a
  // meta' periodo porta una data che col calendario non c'entra niente.
  // Misurato in casa il 04/10/2026: il contatore del bimestre, rinominato il
  // 20 settembre, giurava "14 giorni" mentre il bimestre ne aveva 34. I kWh
  // erano giusti, la quota no: 69,37 euro invece di 80,21.
  //
  // I cicli di Home Assistant stanno tutti sul calendario - il giorno a
  // mezzanotte, la settimana di lunedi', il mese il primo, il bimestre il
  // primo dei mesi dispari - quindi i giorni si prendono da li'.
  const PRIMO_DEL_BIMESTRE = "now().replace(month=(now().month if now().month % 2 == 1"
    + " else now().month - 1), day=1, hour=0, minute=0, second=0, microsecond=0)";
  const GIORNI = {
    oggi: "1",
    // lunedi' vale 1, domenica 7: weekday() torna 0 per lunedi'
    settimana: "(now().weekday() + 1)",
    mese: "now().day",
    bimestre: "((now() - " + PRIMO_DEL_BIMESTRE + ").days + 1)",
  };
  // LA QUOTA SI LEGGE MENTRE GIRA, non quando creo il template.
  // Prima il termine della quota entrava solo se l'aiutante esisteva GIA':
  // chi premeva «Crea contatori e costi» prima di «Scrivi la tariffa» -
  // sono due tasti indipendenti, niente lo impedisce - si teneva i costi
  // senza quota per sempre, perche' al secondo giro `gia("template", nome)`
  // ritrovava la voce e non le riscriveva dentro niente. La bolletta
  // risultava piu' bassa di quota x giorni e dalla scheda non si vedeva.
  // Adesso il termine c'e' sempre: finche' l'aiutante non esiste
  // `states()` torna "unknown" e `float(0)` lo fa valere zero - qui lo zero
  // e' la verita' - e il giorno che lo crei i costi se ne accorgono da soli.
  // Il CONTATORE invece non si legge con `float(0)`: vedi seLeggibili.
  const perPrezzo = (entita, chiave) => {
    const quanti = GIORNI[chiave];
    const euro = "v0 * states('" + prezzo + "') | float(0)";
    // (i giorni non guardano piu' l'entita': stanno sul calendario)
    const quota = quanti ? " + states('" + QUOTA + "') | float(0) * " + quanti : "";
    return seLeggibili(daStato(entita), "(" + euro + quota + ") | round(2)");
  };
  voci = await vociDiConfigurazione(hass);
  for (const [etichetta, chiave] of PERIODI.map((p) => [p[0], p[1]])) {
    if (!contatori[chiave]) continue;
    const nome = comePrima(chiave, true) || ("Costo " + base.toLowerCase() + " " + chiave);
    const vecchio = libretto.mio("costo_" + chiave, "template", nome);
    const formula = perPrezzo(contatori[chiave], chiave);
    const quando = disponibileSe(daStato(contatori[chiave]));
    if (vecchio) {
      costi[chiave] = libretto.segna("costo_" + chiave, vecchio);
      conto.riusati++;
      // quello che c'e' puo' essere nato senza la quota fissa, o col
      // contatore letto a `float(0)`: lo riporto a quello che scriverei oggi
      const voce = voceDellEntita(reg, voci, vecchio);
      if (voce) {
        await riallinea(hass, voce.entry_id, { state: formula, availability: quando }, dillo,
          "il costo di " + etichetta.toLowerCase() + " adesso comprende la quota fissa"
          + " e non vale zero quando il contatore non si legge");
      }
    } else {
      dillo("Creo il costo di " + etichetta.toLowerCase() + "...");
      nuoviCosti.push([chiave, await creaCosto(hass, nome, formula,
        { disponibile: quando }), nome]);
      conto.creati++;
    }
  }
  // e il costo di ieri, dal periodo chiuso del contatore di oggi
  if (contatori.oggi) {
    const nome = comePrima("ieri", true) || ("Costo " + base.toLowerCase() + " ieri");
    const vecchio = libretto.mio("costo_ieri", "template", nome);
    // La quota di un giorno c'e' anche qui: «Costo oggi» la comprende, e
    // senza di lei lo stesso giorno finiva mostrato con due numeri diversi -
    // uno mentre e' oggi, un altro il giorno dopo.
    const letto = daAttributo(contatori.oggi, "last_period");
    const stato = seLeggibili(letto, "(v0 * states('" + prezzo + "') | float(0)"
      + " + states('" + QUOTA + "') | float(0)) | round(2)");
    // `cresce: false`: questo non e' un contatore, e' la fotografia del
    // periodo chiuso (vedi datiCosto)
    const comeOggi = { cresce: false, disponibile: disponibileSe(letto) };
    if (vecchio) {
      costi.ieri = libretto.segna("costo_ieri", vecchio);
      conto.riusati++;
      const voce = voceDellEntita(reg, voci, vecchio);
      if (voce) {
        await riallinea(hass, voce.entry_id,
          { state: stato, availability: comeOggi.disponibile, state_class: null }, dillo,
          "«costo di ieri»: ci metto la quota fissa come su «oggi» e gli tolgo lo"
          + " state_class, che su una fotografia sporcava le statistiche");
      }
    } else {
      dillo("Creo il costo di ieri...");
      nuoviCosti.push(["ieri", await creaCosto(hass, nome, stato, comeOggi), nome]);
      conto.creati++;
    }
  }
  if (nuoviCosti.length) {
    reg = await registro(hass);
    for (const [chiave, id, nome] of nuoviCosti) {
      const e = entitaDellaVoce(reg, id);
      if (!e) continue;
      costi[chiave] = libretto.segna("costo_" + chiave, await sistemaNome(hass, e, nome, dillo));
      segnaFatto("template", nome, sorgente, costi[chiave]);
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
      // il valore vecchio si rimette SOLO se siamo ancora nello stesso
      // periodo di quel contatore: vedi stessoPeriodo
      if (!stessoPeriodo((memoria[nome] || {}).quando, chiave)) {
        dillo(nome + ": quel valore e' del periodo prima, lo lascio a zero.");
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
  // l'elenco di quello che ho creato io: vedi IL MARCATORE
  const patch = { periods };
  // l'elenco di quello che ho creato io (vedi IL MARCATORE): vuoto non lo
  // scrivo, se no cancellerei quello che c'e' gia' scritto
  if (Object.keys(libretto.mappa).length) patch.aiutanti_miei = libretto.mappa;
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

// la sorgente misura in kilowatt?
function inKilo(hass, eid) {
  const u = String(((((hass || {}).states || {})[eid] || {}).attributes || {})
    .unit_of_measurement || "").trim().toLowerCase();
  return u.startsWith("k");
}

// LA SOGLIA DI DEFAULT guarda l'unita' della sorgente.
// 10 va bene in W; con una sorgente in kW sarebbero 10 kW, una soglia che non
// si accende mai - e tempo, cicli e automazione del ciclo restano a zero in
// silenzio, senza un errore - quindi diventano 0,01 kW (cioe' 10 W).
// Il valore SCRITTO non si converte: l'editor mette l'unita' della sorgente
// accanto alla casella («Sopra questi kW sta lavorando»), quindi arriva
// gia' nell'unita' giusta. Resta da sistemare il precompilato `value="10"`
// della casella, che sta nell'editor.
function sogliaDi(hass, potenza, soglia) {
  const n = Number(soglia);
  if (Number.isFinite(n) && n > 0) return n;
  return inKilo(hass, potenza) ? 0.01 : 10;
}

// UN'ISTERESI, se no il binary_sensor sfarfalla.
// Con `hysteresis: 0` un apparecchio che in standby sta attorno alla soglia
// (forno o lavastoviglie a 9-11 W con la soglia a 10) accende e spegne la
// soglia a ogni lettura. L'automazione del ciclo e' protetta dai
// `for: {seconds: ...}`, ma il history_stats dei CICLI e' `type: count` e
// conta ogni sfarfallio: «e' partito 180 volte oggi», e quello storico non
// si recupera. Un decimo della soglia (soglia 10 -> accende sopra 11, spegne
// sotto 9) tiene fuori il rumore, e andando a percentuale vale anche quando
// la soglia e' in kW.
function isteresiDi(soglia) {
  const s = Math.abs(Number(soglia) || 0);
  if (!s) return 0;
  return Math.round(s * 0.1 * 1e6) / 1e6;
}

function datiSoglia(hass, nome, potenza, soglia) {
  const s = sogliaDi(hass, potenza, soglia);
  return { name: nome, entity_id: potenza, upper: s, hysteresis: isteresiDi(s) };
}

async function creaSoglia(hass, nome, potenza, soglia) {
  return flusso(hass, "threshold", datiSoglia(hass, nome, potenza, soglia));
}

// l'isteresi su una soglia che c'era gia': quelle fatte prima sono nate con
// zero e sfarfallano ancora, e il template non basta a sistemarle
async function isteresiAnche(hass, voci, reg, eid, parla) {
  if (!eid) return;
  const a = ((hass.states[eid] || {}).attributes) || {};
  if (Number(a.hysteresis) !== 0) return;      // ce l'ha gia' (o non lo dice)
  const su = Number(a.upper);
  if (!Number.isFinite(su) || !su) return;
  const voce = voceDellEntita(reg, voci, eid);
  if (!voce) return;
  await riallinea(hass, voce.entry_id, { hysteresis: isteresiDi(su) }, parla,
    "la soglia era senza isteresi e sfarfallava a ogni lettura");
}

async function creaStorico(hass, nome, acceso, tipo, inizio) {
  return flusso(hass, "history_stats", {
    name: nome, entity_id: acceso, type: tipo, state: ["on"],
    start: inizio, end: "{{ now() }}",
  });
}

// IL PREFISSO DIPENDE DALL'UNITA' DELLA SORGENTE.
// L'integrale divide sempre per il prefisso: W·s / (1000 x 3600) = kWh,
// giusto; ma kW·s / (1000 x 3600) = kWh/1000, e veniva fuori «FV oggi 0,012
// kWh» invece di 12, con l'unita' «kkWh» - e tutti gli utility_meter
// costruiti sopra si portavano dietro unita' e scala sbagliate, anche nelle
// statistiche a lungo termine. Non e' un caso di scuola: creaFonte e
// creaRisparmio entrano qui con `u === "w" || u === "kw"`, e l'editor accetta
// esplicitamente i kW.
// Con una sorgente gia' in kW il prefisso non serve: non lo mando nemmeno,
// cosi' ci mette il suo «nessuno» il flusso di Home Assistant, senza che
// debba indovinare io come si chiama quel valore.
// Unita' vuota o sconosciuta (apparecchio staccato nel momento in cui lo
// creo): resta "k", che e' il caso di gran lunga piu' comune.
function creaIntegrale(hass, nome, potenza) {
  const dati = {
    name: nome, source: potenza, unit_time: "h",
    // un minuto, non cinque: cosi' dice il suo primo valore (e la sua unita')
    // quasi subito, anche se l'apparecchio e' spento
    method: "left", round: 3, max_sub_interval: { hours: 0, minutes: 1, seconds: 0 },
  };
  if (!inKilo(hass, potenza)) dati.unit_prefix = "k";
  return flusso(hass, "integration", dati);
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

// L'INDIRIZZO LO DICE HOME ASSISTANT, non lo indovino io. Lui lo ricava dal
// nome, ma se quello slug e' gia' occupato ci appende _2: indovinandolo
// scrivevo in configurazione l'aiutante di QUALCUN ALTRO, e quello appena
// creato restava orfano. La risposta della creazione porta l'id vero; se un
// Home Assistant vecchio non lo desse, si ripiega sullo slug come prima.
function daCreato(dominio, fatto, nome) {
  const id = fatto && (fatto.id || fatto.object_id);
  return dominio + "." + (id ? String(id) : slug(nome));
}

async function creaNumero(hass, nome, unita, passo, massimo) {
  const fatto = await hass.callWS({
    type: "input_number/create", name: nome, min: 0, max: massimo, step: passo,
    mode: "box", unit_of_measurement: unita, icon: "mdi:counter",
  });
  return daCreato("input_number", fatto, nome);
}

async function creaDataOra(hass, nome) {
  const fatto = await hass.callWS({
    type: "input_datetime/create", name: nome, has_date: true, has_time: true,
    icon: "mdi:flag-checkered",
  });
  return daCreato("input_datetime", fatto, nome);
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
  // quanti SECONDI di fermo vogliono dire "ha finito": il forno spegne e
  // riaccende la resistenza, la lavatrice ha le pause dell'ammollo
  const ATTESA_SEC = Number(opzioni.attesa) > 0 ? Math.round(Number(opzioni.attesa)) : 100;
  // per la durata servono minuti: 100 secondi sono 1,6667 minuti
  // sotto questi kWh quello che si e' chiuso non e' un ciclo, e' una briciola
  const BRICIOLA_KWH = 0.01;
  const ATTESA_MIN = (ATTESA_SEC / 60).toFixed(4).replace(/0+$/, "").replace(/\.$/, "");
  const { potenza, energia, soglia } = opzioni;
  if (!potenza) throw new Error("Serve il sensore dei Watt.");
  if (!energia) throw new Error("Serve il contatore dei kWh.");
  // lo stesso nome che usa creaSensoriElettrodomestico, trim compreso: vedi
  // nomeBase (prima qui mancavano il trim e il ripiego sul dispositivo, e la
  // soglia veniva creata due volte)
  const base = nomeBase(hass, opzioni, potenza);

  let voci = await vociDiConfigurazione(hass);
  let reg = await registro(hass);
  const libretto = proprieta(hass, opzioni, () => ({ voci, reg }));
  const rinfresca = async () => { voci = await vociDiConfigurazione(hass); reg = await registro(hass); };
  const esiste = (eid) => !!hass.states[eid];

  // QUELLO CHE LA SCHEDA HA GIA' viene prima di tutto. Rinominando la scheda
  // cambiano i nomi che darei ai pezzi nuovi, e senza questo il rinomino si
  // lasciava dietro la soglia, il contatore e le quattro memorie di prima -
  // con dentro tutto lo storico - per rifarli vuoti col nome nuovo.
  const miei = opzioni.ciclo || {};
  const giaMio = (eid) => (eid && esiste(eid) ? eid : null);

  // 1. quando sta lavorando
  const nomeSoglia = base + " in funzione";
  let acceso = giaMio(opzioni.soglia_acceso) || libretto.mio("soglia", "threshold", nomeSoglia, potenza);
  if (!acceso) {
    parla("Creo la soglia «" + nomeSoglia + "»...");
    await creaSoglia(hass, nomeSoglia, potenza, soglia);
    await rinfresca();
    acceso = await sistemaNome(hass, cercaVoce(voci, reg, "threshold", nomeSoglia), nomeSoglia, parla);
    segnaFatto("threshold", nomeSoglia, potenza, acceso);
  } else {
    parla("La soglia c'era gia'.");
    // se era nata senza isteresi sfarfalla ancora: gliela metto
    await isteresiAnche(hass, voci, reg, acceso, parla);
  }
  libretto.segna("soglia", acceso);

  // 2. il contatore del ciclo: nessun ciclo suo, lo azzero io alla partenza
  const nomeContatore = base + " ciclo kWh";
  let contatore = giaMio(miei.contatore) || libretto.mio("ciclo_contatore", "utility_meter", nomeContatore);
  if (!contatore) {
    parla("Creo il contatore del ciclo...");
    await flusso(hass, "utility_meter", {
      name: nomeContatore, source: energia, cycle: "none", offset: 0, tariffs: [],
      net_consumption: false, delta_values: false, periodically_resetting: true,
      always_available: true,
    });
    await rinfresca();
    contatore = await sistemaNome(hass, cercaVoce(voci, reg, "utility_meter", nomeContatore),
      nomeContatore, parla);
    segnaFatto("utility_meter", nomeContatore, energia, contatore);
  } else parla("Il contatore del ciclo c'era gia'.");
  libretto.segna("ciclo_contatore", contatore);

  // 3. le tre memorie dell'ultimo ciclo
  const nKwh = base + " ultimo ciclo kWh";
  const nMin = base + " ultimo ciclo minuti";
  const nFine = base + " ultimo ciclo fine";
  const nVia = base + " ciclo iniziato";
  // La memoria all'indirizzo che mi aspetto e' MIA solo se si chiama come la
  // chiamerei io. Se no e' di qualcun altro - due schede chiamate "Forno", un
  // aiutante fatto a mano - e scriverci dentro vorrebbe dire rovinargli lo
  // storico. Nel dubbio (nome non ancora caricato) la considero mia: fare un
  // doppione e' peggio.
  const mia = (eid, nome) => {
    const st = hass.states[eid];
    if (!st) return false;
    const suo = String((st.attributes || {}).friendly_name || "").trim().toLowerCase();
    return !suo || suo === nome.trim().toLowerCase();
  };
  const memoriaDi = async (dominio, nome, vecchia, crea) => {
    // quella che la scheda sta gia' usando vince su qualunque nome
    if (giaMio(vecchia)) return vecchia;
    const atteso = dominio + "." + slug(nome);
    // quella creata in questo stesso giro del tasto e' mia per certo
    const fatta = giaFatto(dominio, nome, potenza);
    if (fatta) return fatta;
    // IL NOME DA SOLO NON BASTA a dire che e' mia: con due schede chiamate
    // entrambe «Forno» la seconda si prendeva le quattro memorie della
    // prima - stessi numeri in tutte e due, e «Cancella gli aiutanti» di
    // una che cancellava quelle dell'altra. Il nome lo accetto solo col
    // ripiego, cioe' per le schede che quelle memorie le avevano gia' ma non
    // se le sono scritte in configurazione (vedi IL MARCATORE).
    if (libretto.ripiego && mia(atteso, nome)) return atteso;
    if (esiste(atteso)) parla("«" + slug(nome) + "» e' gia' di un'altra cosa: ne faccio una mia.");
    // la segno nel taccuino del giro: se ripremi il tasto non ne nasce un'altra
    const fresca = await crea();
    return segnaFatto(dominio, nome, potenza, fresca) || fresca;
  };
  const eKwh = await memoriaDi("input_number", nKwh, miei.consumo, () => {
    parla("Creo la memoria dei kWh..."); return creaNumero(hass, nKwh, "kWh", 0.001, 1000);
  });
  const eMin = await memoriaDi("input_number", nMin, miei.durata, () => {
    parla("Creo la memoria dei minuti..."); return creaNumero(hass, nMin, "min", 1, 10000);
  });
  const eFine = await memoriaDi("input_datetime", nFine, miei.fine, () => {
    parla("Creo la memoria della fine..."); return creaDataOra(hass, nFine);
  });
  const eVia = await memoriaDi("input_datetime", nVia, miei.inizio, () => {
    parla("Creo la memoria della partenza..."); return creaDataOra(hass, nVia);
  });

  // 4. l'automazione che al termine del ciclo scrive le tre memorie.
  // "La partenza non e' credibile": mai scritta (mezzanotte) o piu' vecchia
  // della fine dell'ultimo ciclo. Le date stanno tutte nello stesso formato,
  // quindi si confrontano come stringhe.
  const SOSPETTA_CORPO = "states('" + eVia + "') in ['unknown','unavailable','']"
    + " or states('" + eVia + "').endswith('00:00:00')"
    + " or (states('" + eFine + "') not in ['unknown','unavailable','']"
    + " and states('" + eVia + "') < states('" + eFine + "'))";
  const SOSPETTA = "{{ " + SOSPETTA_CORPO + " }}";
  const nomeAuto = base + ": segna il ciclo";
  const automazioni = Object.keys(hass.states).filter((x) => x.startsWith("automation."));
  const corpoAuto = {
    alias: nomeAuto,
    description: "Fatta dalla scheda " + base + ". Segna quando il ciclo e' cominciato, e alla fine"
      + " scrive kWh, minuti e ora. Un apparecchio come il forno accende e spegne di continuo:"
      + " per questo il ciclo si chiude solo dopo " + ATTESA_SEC + " secondi di fermo, e il contatore"
      + " si azzera alla FINE, non alla partenza.",
    mode: "single",
    triggers: [
      { trigger: "state", entity_id: acceso, to: "on", id: "parte" },
      { trigger: "state", entity_id: acceso, to: "off", for: { seconds: ATTESA_SEC }, id: "finisce" },
    ],
    conditions: [],
    actions: [{
      choose: [
        {
          // La partenza vale se il contatore e' a zero (se no e' una delle
          // accensioni intermittenti dentro un ciclo gia' cominciato) OPPURE
          // se quella che c'e' scritta non e' credibile: mai scritta, o
          // PRIMA della fine dell'ultimo ciclo. Senza questo secondo caso il
          // primo ciclo dopo la creazione non registrava la partenza - il
          // contatore non era mai stato azzerato - e la durata veniva fuori
          // di duemila minuti.
          conditions: [
            { condition: "trigger", id: "parte" },
            { condition: "or", conditions: [
              { condition: "numeric_state", entity_id: contatore, below: 0.005 },
              { condition: "template", value_template: SOSPETTA },
            ] },
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
              // Una briciola non deve cancellare il ciclo vero. Bastava un
              // riavvio di Home Assistant, o un'accensione di pochi secondi,
              // e qui si scriveva 0,002 kWh sopra al ciclo buono di ieri.
              // Sotto ai 0,01 kWh quello che si chiude non e' un ciclo:
              // il contatore lo azzero lo stesso (fuori da qui), le memorie no.
              if: [{ condition: "numeric_state", entity_id: contatore, above: BRICIOLA_KWH }],
              then: [
                {
                  // qui `float(0)` va bene e resta: ci si arriva solo dopo il
                  // `numeric_state above` qui sopra, quindi il contatore e'
                  // per forza un numero - e la destinazione e' un
                  // input_number, non un sensore con le statistiche
                  action: "input_number.set_value", target: { entity_id: eKwh },
                  data: { value: "{{ states('" + contatore + "') | float(0) | round(3) }}" },
                },
                {
                  // I MINUTI, CON IL FUSO GIUSTO.
                  // `as_datetime` di una stringa senza fuso torna un datetime
                  // NAIVE, e `as_local` di Home Assistant un naive lo tratta
                  // come UTC e lo converte: la partenza finiva spostata
                  // avanti di un'ora d'inverno e di due d'estate, `now() -
                  // partenza` veniva negativo e il `| max` su 0 lo
                  // appiattiva. D'estate OGNI ciclo piu' corto di due ore
                  // registrava «0 min» - e il numero resta scritto
                  // nell'input_number. La contraddizione si vedeva nella
                  // stessa scheda: mentre il ciclo girava la card leggeva la
                  // stessa stringa come ora LOCALE e diceva «1h 28m».
                  // La stringa dell'input_datetime E' ora locale, quindi al
                  // naive attacco il fuso di casa: `.replace(tzinfo=
                  // now().tzinfo)` tiene il fuso giusto per QUELLA data (ora
                  // solare o legale), cosa che un offset fisso non farebbe.
                  // Le parentesi attorno al conto prima di `| round(0)` non
                  // si toccano: in Jinja i filtri legano piu' forte di `-`,
                  // e senza di quelle si arrotonderebbe solo l'attesa.
                  // i minuti: 0 se la partenza non e' credibile (la scheda
                  // mostra "-", che e' la verita'), se no il tempo vero
                  action: "input_number.set_value", target: { entity_id: eMin },
                  data: {
                    value: "{% set via = states('" + eVia + "') | as_datetime %}"
                      + "{% if " + SOSPETTA_CORPO + " or via is none %}0{% else %}"
                      + "{{ [0, ((now() - via.replace(tzinfo=now().tzinfo))"
                      + ".total_seconds() / 60 - " + ATTESA_MIN + ") | round(0)] | max }}{% endif %}",
                  },
                },
                {
                  action: "input_datetime.set_datetime", target: { entity_id: eFine },
                  data: { datetime: "{{ (now() - timedelta(seconds=" + ATTESA_SEC + ")).strftime('%Y-%m-%d %H:%M:%S') }}" },
                },
              ],
              // Niente ciclo, ma la PARTENZA era stata segnata lo stesso: e
              // finche' resta avanti alla fine la scheda crede che la macchina
              // stia lavorando, e il "ciclo in corso" cresce all'infinito
              // (23 ore sulla lavastoviglie, per un'accensione di 34 secondi).
              // Quindi la partenza si rimette sulla fine di quello vero.
              else: [
                {
                  // prima mi assicuro che la fine sia una data leggibile: se
                  // non si e' mai chiuso un ciclo qui c'e' "unknown", e la
                  // scheda conta aperto qualunque cosa dica la partenza
                  action: "input_datetime.set_datetime", target: { entity_id: eFine },
                  data: { datetime: "{% set f = states('" + eFine + "') %}{% if f not in ['unknown','unavailable',''] %}{{ f }}{% else %}{{ (now() - timedelta(seconds=" + ATTESA_SEC + ")).strftime('%Y-%m-%d %H:%M:%S') }}{% endif %}" },
                },
                {
                  action: "input_datetime.set_datetime", target: { entity_id: eVia },
                  data: { datetime: "{% set f = states('" + eFine + "') %}{% if f not in ['unknown','unavailable',''] %}{{ f }}{% else %}{{ (now() - timedelta(seconds=" + ATTESA_SEC + ")).strftime('%Y-%m-%d %H:%M:%S') }}{% endif %}" },
                },
              ],
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
  };
  // L'AUTOMAZIONE SI RITROVA DAL SUO ID, non dal nome ne' da uno slug
  // ricostruito. L'id lo scrivo in configurazione (`ciclo.automazione`): e'
  // l'unica cosa che non cambia ne' rinominando la scheda ne' quando lo slug
  // collide con quello di un'altra scheda («Forno» e «Forno »
  // con uno spazio in piu' danno `..._2`, e la radice ricostruita a colpi di
  // replace puntava sull'automazione della PRIMA scheda).
  let suo = null;
  let idSuo = String((opzioni.ciclo || {}).automazione || "") || null;
  if (idSuo) {
    suo = automazioni.find((x) => String((hass.states[x].attributes || {}).id || "") === idSuo) || null;
    if (!suo) idSuo = null;      // cancellata a mano: ne rifaccio una
  }
  // Se c'era gia' NON la lascio com'e': la riscrivo. E' roba fatta da me, e
  // se non la rifaccio cambiare i minuti di attesa non servirebbe a niente.
  // Riscriverla sullo stesso id vuol dire che l'entita' resta quella.
  if (!suo) {
    suo = automazioni.find((x) => (hass.states[x].attributes.friendly_name || "") === nomeAuto) || null;
  }
  // RINOMINANDO LA SCHEDA cambia anche questo nome, e senza quello che segue
  // nasceva una SECONDA automazione: la prima restava accesa e continuava a
  // scrivere nelle vecchie memorie, e «Cancella gli aiutanti» non la
  // trovava piu'. Per le schede che non hanno ancora l'id scritto in
  // configurazione resta il ripiego sull'indirizzo di prima.
  if (!suo) {
    const prima = radiceDellaScheda({ ciclo: opzioni.ciclo || {}, soglia_acceso: opzioni.soglia_acceso });
    const eidPrima = prima ? "automation." + prima + "_segna_il_ciclo" : "";
    if (eidPrima && hass.states[eidPrima]) {
      suo = eidPrima;
      parla("L'automazione del ciclo c'era gia' col nome di prima: la rinomino invece di rifarla.");
    }
  }
  if (!suo) {
    parla("Creo l'automazione del ciclo...");
    idSuo = await creaAutomazione(hass, corpoAuto);
  } else {
    idSuo = String((hass.states[suo].attributes || {}).id || "") || idSuo;
    if (idSuo) {
      parla("Rimetto a posto l'automazione del ciclo (" + ATTESA_SEC + " s di fermo)...");
      await hass.callApi("POST", "config/automation/config/" + idSuo, { id: idSuo, ...corpoAuto });
    } else parla("L'automazione c'era gia' (non ha un id: la lascio com'e').");
  }

  parla("Cicli agganciati.");
  const fuoriCiclo = { fine: eFine, durata: eMin, consumo: eKwh, contatore, inizio: eVia };
  // l'id dell'automazione viaggia dentro `ciclo`, che la scheda si tiene gia'
  if (idSuo) fuoriCiclo.automazione = String(idSuo);
  return { ciclo: fuoriCiclo, soglia_acceso: acceso };
}

/**
 * I kWh di una fonte (i pannelli, la batteria): se il sensore e' in Watt gli
 * costruisco il contatore, poi i tre periodi.
 * Torna { oggi, settimana, mese } piu' gli aiutanti di mezzo - la somma,
 * l'integrale, il template dei Wh - che prima non tornavano a nessuno:
 * nascevano, non finivano in nessuna chiave della configurazione, e
 * `aiutantiDellaScheda` (che legge solo la configurazione) non li vedeva.
 * Risultato: restavano in Impostazioni > Helper per sempre, senza nessuna
 * scheda che li usasse e senza modo di cancellarli dal pop-up.
 */
export async function creaFonte(hass, opzioni, dillo) {
  const parla = dillo || (() => {});
  const quali = (Array.isArray(opzioni.entita) ? opzioni.entita : [opzioni.entita])
    .filter((x) => x && hass.states[x]);
  if (!quali.length) throw new Error("Scegli il sensore.");
  let fonte = quali[0];
  const base = nomeBase(hass, opzioni, fonte);

  let voci = await vociDiConfigurazione(hass);
  let reg = await registro(hass);
  // la fonte del fotovoltaico non torna indietro nelle opzioni: il titolo
  // resta l'unica strada per ritrovare quello che ho gia' fatto
  const libretto = proprieta(hass, opzioni, () => ({ voci, reg }), true);
  const rinfresca = async () => { voci = await vociDiConfigurazione(hass); reg = await registro(hass); };

  // piu' apparecchi (due batterie, due inverter): prima li sommo con l'aiutante
  // "somma" di Home Assistant, poi conto i periodi su quello
  if (quali.length > 1) {
    const nomeSomma = base + " totale";
    let somma = libretto.mio("somma", "min_max", nomeSomma);
    if (!somma) {
      parla("Sommo " + quali.length + " sensori in «" + nomeSomma + "»...");
      await flusso(hass, "min_max", {
        name: nomeSomma, entity_ids: quali, type: "sum", round_digits: 3,
      });
      await rinfresca();
      somma = await sistemaNome(hass, cercaVoce(voci, reg, "min_max", nomeSomma), nomeSomma, parla);
    }
    fonte = libretto.segna("somma", somma) || somma;
  }

  // L'UNITA' LA CHIEDO ALLE SORGENTI, non alla somma.
  // `hass.states` qui dentro e' la fotografia di PRIMA (lo stesso motivo per
  // cui avvisoUnita si rifa' gli stati): l'aiutante «somma» appena creato
  // non c'e', e `hass.states[fonte].attributes` era un TypeError secco al
  // primo giro con due o piu' sensori - «Non ce l'ho fatta: Cannot read
  // properties of undefined» - lasciando dietro il min_max e nessun
  // contatore (al secondo tentativo funzionava). La somma ha comunque
  // l'unita' delle sue sorgenti.
  const a = ((hass.states[fonte] || hass.states[quali[0]] || {}).attributes) || {};
  const u = String(a.unit_of_measurement || "").toLowerCase();
  let kwh = fonte;
  if (u === "w" || u === "kw") {
    const nome = base + " energia";
    kwh = libretto.mio("energia", "integration", nome, fonte);
    if (!kwh) {
      parla("Calcolo i kWh di " + base.toLowerCase() + " dai Watt...");
      await creaIntegrale(hass, nome, fonte);
      await rinfresca();
      kwh = await sistemaNome(hass, cercaVoce(voci, reg, "integration", nome), nome, parla);
      segnaFatto("integration", nome, fonte, kwh);
    }
    libretto.segna("energia", kwh);
  } else if (u === "wh") {
    const nome = base + " kWh";
    kwh = libretto.mio("kwh_da_wh", "template", nome);
    if (!kwh) {
      parla("Il sensore e' in Wh: lo porto in kWh...");
      await creaEnergiaKwh(hass, nome, fonte);
      await rinfresca();
      kwh = await sistemaNome(hass, cercaVoce(voci, reg, "template", nome), nome, parla);
      segnaFatto("template", nome, fonte, kwh);
    } else {
      // quello che c'e' puo' essere nato col `float(0)` che regalava uno
      // zero al recorder a ogni riavvio: lo riporto a quello di oggi
      const voce = voceDellEntita(reg, voci, kwh);
      const d = datiEnergiaKwh(nome, fonte);
      if (voce) {
        await riallinea(hass, voce.entry_id,
          { state: d.state, availability: d.availability }, parla,
          "i kWh dai Wh adesso restano indisponibili invece di valere zero");
      }
    }
    libretto.segna("kwh_da_wh", kwh);
  }

  const fuori = {};
  for (const [chiave, ciclo] of [["oggi", "daily"], ["settimana", "weekly"], ["mese", "monthly"]]) {
    const nome = base + " " + chiave;
    let e = libretto.mio("contatore_" + chiave, "utility_meter", nome);
    if (!e) {
      parla("Creo " + nome.toLowerCase() + "...");
      await creaContatore(hass, nome, kwh, ciclo);
      await rinfresca();
      e = await sistemaNome(hass, cercaVoce(voci, reg, "utility_meter", nome), nome, parla);
      segnaFatto("utility_meter", nome, kwh, e);
    }
    fuori[chiave] = libretto.segna("contatore_" + chiave, e);
  }
  await avvisoUnita(hass, Object.values(fuori), parla);
  // NOTA PER CHI LAVORA SULL'EDITOR DI casa-energia: questi due si scrivono
  // in configurazione solo se l'editor spande tutto quello che torna
  // (`{...this._config, ...p}`) invece di copiare le sole chiavi
  // oggi/settimana/mese. Finche' non lo fa, la somma e l'integrale restano
  // orfani come prima - il calcolo di qui e' pronto.
  if (fonte !== quali[0]) fuori.fv_somma = fonte;
  if (kwh !== fonte) fuori.fv_energia = kwh;
  if (Object.keys(libretto.mappa).length) fuori.aiutanti_fv = libretto.mappa;
  return fuori;
}

/**
 * Il risparmio del fotovoltaico, dalla sola entita' dei kWh che arrivano in
 * casa (di giorno dal sole, di sera dalla batteria). Non dalla produzione:
 * quella comprende anche l'energia finita in batteria, che in casa non e'
 * ancora arrivata e quindi non ha ancora risparmiato niente.
 * Se gli dai i Watt si fa l'integrale; poi trasforma i kWh in euro con la
 * tariffa e li mette in due contatori, oggi e mese. Torna le due entita'.
 */
export async function creaRisparmio(hass, opzioni, dillo) {
  const parla = dillo || (() => {});
  const fonte = opzioni.fonte;
  if (!fonte || !hass.states[fonte]) throw new Error("Scegli il sensore del fotovoltaico che arriva in casa.");
  const prezzo = opzioni.prezzo_entita;
  if (!prezzo) throw new Error("Prima scrivi la tariffa.");
  const base = nomeSorgente(hass, fonte);

  let voci = await vociDiConfigurazione(hass);
  let reg = await registro(hass);
  // come creaFonte: qui non torna indietro niente nelle opzioni, il titolo
  // resta l'unica strada per ritrovare quello che ho gia' fatto
  const libretto = proprieta(hass, opzioni, () => ({ voci, reg }), true);
  const rinfresca = async () => { voci = await vociDiConfigurazione(hass); reg = await registro(hass); };

  // 1. i kWh: se il sensore e' in Watt me li calcolo
  const st = hass.states[fonte];
  const unita = String((st.attributes || {}).unit_of_measurement || "").toLowerCase();
  let kwh = fonte;
  if (unita === "w" || unita === "kw") {
    const nome = base + " energia";
    kwh = libretto.mio("energia", "integration", nome, fonte);
    if (!kwh) {
      parla("Calcolo i kWh dai Watt...");
      await creaIntegrale(hass, nome, fonte);
      await rinfresca();
      kwh = await sistemaNome(hass, cercaVoce(voci, reg, "integration", nome), nome, parla);
      segnaFatto("integration", nome, fonte, kwh);
    } else parla("I kWh c'erano gia'.");
    libretto.segna("energia", kwh);
  }

  // 2. quanti euro sono: i kWh arrivati per quello che avresti pagato
  // I kWh si leggono con `float(default=none)` e non con `float(0)`: questo
  // template finisce dentro a due utility_meter `total_increasing`, e uno
  // zero a ogni riavvio di Home Assistant faceva dichiarare al recorder una
  // ripartenza e sommava alle statistiche tutto il contatore (vedi
  // seLeggibili). Il PREZZO invece resta a `float(0)`: li' lo zero e' un
  // prezzo che non c'e', non una bugia.
  const nomeEuro = "Risparmio fotovoltaico";
  const formulaEuro = seLeggibili(daStato(kwh),
    "(v0 * states('" + prezzo + "') | float(0)) | round(4)");
  const quandoEuro = disponibileSe(daStato(kwh));
  let euro = libretto.mio("euro", "template", nomeEuro)
    || Object.keys(hass.states).find((x) => x.startsWith("sensor.")
      && (hass.states[x].attributes.friendly_name || "") === nomeEuro);
  if (!euro) {
    parla("Creo il valore in euro del risparmio...");
    await creaCosto(hass, nomeEuro, formulaEuro, { disponibile: quandoEuro });
    await rinfresca();
    euro = await sistemaNome(hass, cercaVoce(voci, reg, "template", nomeEuro), nomeEuro, parla);
    segnaFatto("template", nomeEuro, kwh, euro);
  } else {
    parla("Il risparmio in euro c'era gia'.");
    const voce = voceDellEntita(reg, voci, euro);
    if (voce) {
      await riallinea(hass, voce.entry_id,
        { state: formulaEuro, availability: quandoEuro }, parla,
        "il risparmio non vale piu' zero quando i kWh non si leggono");
    }
  }
  libretto.segna("euro", euro);

  // 3. i due contatori, oggi e mese
  const fuori = {};
  for (const [chiave, etichetta, ciclo] of [["oggi", "oggi", "daily"], ["mese", "mese", "monthly"]]) {
    const nome = nomeEuro + " " + etichetta;
    let e = libretto.mio("contatore_" + chiave, "utility_meter", nome);
    if (!e) {
      parla("Creo il risparmio di " + etichetta + "...");
      await creaContatore(hass, nome, euro, ciclo);
      await rinfresca();
      e = await sistemaNome(hass, cercaVoce(voci, reg, "utility_meter", nome), nome, parla);
      segnaFatto("utility_meter", nome, euro, e);
    }
    fuori["risparmio_" + chiave] = libretto.segna("contatore_" + chiave, e);
  }
  parla("Pannelli agganciati.");
  // L'INTEGRALE E IL TEMPLATE DEGLI EURO TORNANO A CASA. Prima uscivano solo
  // i due contatori: «<nome> energia» e «Risparmio fotovoltaico» non
  // finivano in nessuna chiave, e `aiutantiDellaScheda` - che legge solo la
  // configurazione - non li vedeva: restavano in Impostazioni > Helper senza
  // nessuna scheda che li usasse e senza modo di cancellarli dal pop-up.
  // L'editor di casa-energia spande tutto quello che torna, quindi qui
  // basta tornarli.
  if (euro) fuori.risparmio_euro = euro;
  if (kwh !== fonte) fuori.risparmio_energia = kwh;
  if (Object.keys(libretto.mappa).length) fuori.aiutanti_risparmio = libretto.mappa;
  return fuori;
}

/**
 * Crea (o ritrova) gli helper delle statistiche di un elettrodomestico.
 * Torna il pezzo di configurazione da mettere nella scheda.
 */
export async function creaSensoriElettrodomestico(hass, opzioni, dillo) {
  const potenza = opzioni.potenza;
  // la presa che hai SCELTO TU nel picker: me la segno adesso, perche' due
  // righe sotto `opzioni.energia` puo' diventare un template fatto da me
  const sceltoDaTe = opzioni.energia || null;
  let nostroDaWh = null;
  // se il contatore scelto e' in Wh me lo porto in kWh prima di usarlo
  if (opzioni.energia) {
    const u = String(((hass.states[opzioni.energia] || {}).attributes || {}).unit_of_measurement || "");
    if (u.toLowerCase() === "wh") {
      const nome = nomeBase(hass, opzioni, opzioni.energia) + " kWh";
      // anche col nome che gli davo prima (il ripiego era il friendly_name
      // del sensore, adesso e' il nome del dispositivo): se no a chi ce
      // l'ha gia' ne nascerebbe un secondo, identico
      const nomePrima = (opzioni.nome || nomeSorgente(hass, opzioni.energia)).trim() + " kWh";
      const voci0 = await vociDiConfigurazione(hass);
      const reg0 = await registro(hass);
      const cercaTitolo = (voci, t) => voci.find((x) => x.domain === "template"
        && String(x.title || "").toLowerCase() === t.toLowerCase());
      const trovato = cercaTitolo(voci0, nome)
        || (nomePrima !== nome ? cercaTitolo(voci0, nomePrima) : null);
      if (trovato) {
        nostroDaWh = entitaDellaVoce(reg0, trovato.entry_id);
        opzioni = { ...opzioni, energia: nostroDaWh };
        // quello che c'e' puo' essere nato col `float(0)`, che a ogni
        // riavvio di Home Assistant pubblicava zero e faceva impazzire le
        // statistiche del contatore (vedi seLeggibili): lo riallineo
        const d = datiEnergiaKwh(nome, sceltoDaTe);
        await riallinea(hass, trovato.entry_id,
          { state: d.state, availability: d.availability }, dillo,
          "i kWh dai Wh adesso restano indisponibili invece di valere zero");
      } else {
        (dillo || (() => {}))("Il contatore e' in Wh: lo porto in kWh...");
        await creaEnergiaKwh(hass, nome, opzioni.energia);
        const reg1 = await registro(hass);
        const voci1 = await vociDiConfigurazione(hass);
        const nuovo = cercaTitolo(voci1, nome);
        if (nuovo) {
          nostroDaWh = entitaDellaVoce(reg1, nuovo.entry_id);
          opzioni = { ...opzioni, energia: nostroDaWh };
        }
      }
    }
  }
  if (!potenza || !hass.states[potenza]) throw new Error("Scegli la presa che misura i Watt.");
  // lo stesso nome che usa creaCicli, trim compreso: vedi nomeBase
  const base = nomeBase(hass, opzioni, potenza);
  // e me lo ricordo per creaCicli, che parte subito dopo e non riceve questa
  // patch (e' lui a sapere il contatore dei kWh, quindi il dispositivo buono)
  BASE_DECISA.set(potenza, base);
  const soglia = sogliaDi(hass, potenza, opzioni.soglia);
  const conto = { creati: 0, riusati: 0 };

  let voci = await vociDiConfigurazione(hass);
  let reg = await registro(hass);
  const libretto = proprieta(hass, opzioni, () => ({ voci, reg }));
  // il template dei Wh->kWh l'ho fatto io: va nell'elenco, se no resta orfano
  if (nostroDaWh) libretto.segna("kwh_da_wh", nostroDaWh);
  const nuovi = [];
  // cerca la voce gia' fatta - per marcatore, non per solo titolo (vedi IL
  // MARCATORE); se non c'e' la crea e segna che va risolta
  const trovaOCrea = async (ruolo, dominio, nome, sorgente, fai, dove) => {
    const e = libretto.mio(ruolo, dominio, nome, sorgente);
    if (e) {
      conto.riusati++;
      libretto.segna(ruolo, e);
      dove(e);
      return e;
    }
    dillo("Creo: " + nome + "...");
    conto.creati++;
    nuovi.push([await fai(), dove, nome, ruolo, dominio, sorgente]);
    return null;
  };
  const risolvi = async () => {
    if (!nuovi.length) return;
    reg = await registro(hass);
    voci = await vociDiConfigurazione(hass);
    const lista = nuovi.splice(0);
    for (const [id, dove, nome, ruolo, dominio, sorgente] of lista) {
      let e = entitaDellaVoce(reg, id);
      if (!e) continue;
      if (nome) e = await sistemaNome(hass, e, nome, dillo);
      libretto.segna(ruolo, e);
      segnaFatto(dominio, nome, sorgente, e);
      dove(e);
    }
  };

  // 1. "sta lavorando": serve solo per tempo e cicli
  let acceso = null;
  if (opzioni.tempi !== false) {
    await trovaOCrea("soglia", "threshold", base + " in funzione", potenza,
      () => creaSoglia(hass, base + " in funzione", potenza, soglia), (e) => { acceso = e; });
    await risolvi();
    if (!acceso) throw new Error("Non trovo l'entita' della soglia appena creata.");
    // se la soglia c'era gia' ed era senza isteresi, sfarfallava: gliela metto
    await isteresiAnche(hass, voci, reg, acceso, dillo);
  }

  // 2. i kWh: quelli della presa se ci sono, se no li calcolo dai Watt
  let kwh = opzioni.energia || null;
  if (!kwh) {
    await trovaOCrea("kwh_integrale", "integration", base + " energia", potenza,
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
      await trovaOCrea("tempo_" + chiave, "history_stats", base + " tempo " + chiave, acceso,
        () => creaStorico(hass, base + " tempo " + chiave, acceso, "time", inizio),
        (e) => { periodi[periodo].time = e; });
      await trovaOCrea("cicli_" + chiave, "history_stats", base + " cicli " + chiave, acceso,
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
      await trovaOCrea("contatore_" + chiave, "utility_meter", nomeContatore, kwh,
        () => creaContatore(hass, nomeContatore, kwh, ciclo),
        (e) => { periodi[periodo].energy = e; });
    }
  }
  await risolvi();
  // i costi che trovo gia' fatti e mi limito a riconoscere: me li segno, cosi'
  // la cancellazione degli aiutanti sa che non sono roba mia
  const adottati = [];
  // I costi: un sensore per il costo non lo creo piu'. La scheda sa i kWh e sa
  // il prezzo, il conto se lo fa da sola: un aiutante in meno per ogni periodo.
  // Se pero' un sensore del costo esiste gia' (l'avevi fatto tu, o c'era prima)
  // me lo tengo e la scheda usa quello.
  for (const [chiave, periodo] of finestre(opzioni).map((f) => [f[0], f[1]])) {
    const contatore = periodi[periodo].energy;
    if (!contatore) continue;
    if (!opzioni.costi) {
      // Questo riconoscimento e' ancora per NOME, ma e' in sola lettura e
      // finisce fra gli «adottati»: la scheda lo mostra e la
      // cancellazione non lo propone mai. Due schede omonime possono
      // mostrare lo stesso costo - che e' inevitabile quando puntano allo
      // stesso apparecchio - ma nessuna delle due puo' rovinarlo.
      const gia = Object.values(hass.states).find((x) => x.entity_id.startsWith("sensor.")
        && (x.attributes.friendly_name || "").toLowerCase()
          === ("Costo " + base.toLowerCase() + " " + chiave).toLowerCase());
      if (gia) {
        periodi[periodo].cost = gia.entity_id;
        // me lo tengo e la scheda lo usa, ma me lo SEGNO: non l'ho creato io,
        // quindi la cancellazione degli aiutanti non deve proporlo
        adottati.push(gia.entity_id);
      }
      continue;
    }
    const nome = "Costo " + base.toLowerCase() + " " + chiave;
    // il contatore letto con `float(default=none)`: se non si legge il costo
    // resta indisponibile invece di crollare a zero (vedi seLeggibili)
    const formula = seLeggibili(daStato(contatore),
      "(v0 * states('" + prezzo + "') | float(0)) | round(2)");
    const quando = disponibileSe(daStato(contatore));
    const vecchioCosto = libretto.mio("costo_" + chiave, "template", nome);
    if (vecchioCosto) {
      const voce = voceDellEntita(reg, voci, vecchioCosto);
      if (voce) {
        await riallinea(hass, voce.entry_id, { state: formula, availability: quando }, dillo,
          "il costo di " + chiave + " non vale piu' zero quando il contatore non si legge");
      }
    }
    await trovaOCrea("costo_" + chiave, "template", nome, contatore,
      () => creaCosto(hass, nome, formula, { disponibile: quando }),
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
      // solo se siamo ancora nello stesso periodo di quel contatore: vedi
      // stessoPeriodo (cancellati alle 23:00 e rifatti alle 00:30, «oggi»
      // ripartiva dal valore di ieri e il salto entrava nelle statistiche)
      if (!stessoPeriodo((memoria[nome] || {}).quando, periodo)) {
        dillo(nome + ": quel valore e' del periodo prima, lo lascio a zero.");
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
  // QUELLO CHE HAI SCELTO TU NEL PICKER NON E' ROBA MIA.
  // `energy_stat_entity` e' il sensore dei kWh: se l'hai puntato a un TUO
  // utility_meter, integrale o template helper - il caso normale di chi ha
  // gia' i suoi contatori - il suo dominio e' fra i DOMINI_AIUTANTI e
  // «Cancella gli aiutanti» lo metteva in elenco GIA' SPUNTATO: un clic e
  // spariva lui con tutto il suo storico, mentre il testo del riquadro
  // promette che «la presa e i sensori del dispositivo non si toccano».
  // Quindi me lo segno fra quelli adottati: miei sono solo quelli che ho
  // creato io (vedi IL MARCATORE). Il template dei Wh->kWh invece l'ho fatto
  // io, e quello resta cancellabile.
  if (kwh && sceltoDaTe && kwh === sceltoDaTe && kwh !== nostroDaWh) adottati.push(kwh);
  if (adottati.length) patch.costi_adottati = adottati;
  // l'elenco di quello che ho creato io: vedi IL MARCATORE
  if (Object.keys(libretto.mappa).length) patch.aiutanti_miei = libretto.mappa;
  // il tasto "Azzera i contatori" vuole uno script: se non ne hai gia' uno tuo
  // glielo faccio io, ed e' lo stesso per tutta la casa
  if (!opzioni.reset_script) {
    try {
      patch.reset_script = await creaScriptAzzera(hass, dillo);
      conto.creati = conto.creati + (hass.states[patch.reset_script] ? 0 : 1);
    } catch (e) { dillo("Lo script dell'azzeramento non sono riuscito a crearlo: " + (e.message || e)); }
  }
  if (cicli.oggi) patch.stats.cycles_today = cicli.oggi;
  if (cicli.settimana) patch.stats.cycles_week = cicli.settimana;
  if (cicli.mese) patch.stats.cycles_month = cicli.mese;
  dillo("Fatto: " + conto.creati + " creati, " + conto.riusati + " c'erano gia'.");
  return patch;
}

// Cancella gli aiutanti che questa scheda si e' fatta creare. Tocca SOLO
// entita' che stanno nella configurazione della scheda e che sono davvero
// aiutanti (una voce di configurazione con uno di questi domini): la presa e
// i sensori del dispositivo non si toccano nemmeno per sbaglio.
const DOMINI_AIUTANTI = ["threshold", "history_stats", "utility_meter", "integration", "template"];
// le memorie del ciclo non sono voci di configurazione: stanno in due elenchi
// a parte, e si cancellano con un comando loro
const DOMINI_MEMORIA = ["input_number", "input_datetime"];

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
  // il fotovoltaico in casa e il risparmio: oggi, settimana, mese (pannelli e
  // batteria non li fa piu' nessuno, ma le schede vecchie li hanno ancora
  // scritti dentro e vanno riconosciuti per poterli scollegare)
  ["fv_casa", "pannelli", "batteria", "risparmio"].forEach((chi) => {
    ["oggi", "settimana", "mese"].forEach((q) => metti(cfg[chi + "_" + q]));
  });
  // gli aiutanti di mezzo del fotovoltaico e del risparmio: la somma,
  // l'integrale dai Watt, il template degli euro. Prima non finivano in
  // nessuna chiave e restavano in Impostazioni > Helper per sempre.
  ["fv_somma", "fv_energia", "risparmio_euro", "risparmio_energia"].forEach((k) => metti(cfg[k]));
  // L'ELENCO DI QUELLO CHE HO CREATO IO (vedi IL MARCATORE): e' qui che
  // finiscono anche gli aiutanti che la scheda non mostra - la soglia creata
  // per i tempi, il template dei Wh->kWh - e che senza questo non erano
  // cancellabili da nessuna parte.
  ["aiutanti_miei", "aiutanti_fv", "aiutanti_risparmio"].forEach((k) => {
    const m = cfg[k];
    if (m && typeof m === "object") Object.values(m).forEach(metti);
  });
  // i pezzi dell'ultimo ciclo: il contatore, le quattro memorie e la soglia
  const c = cfg.ciclo || {};
  metti(c.contatore);
  metti(c.consumo); metti(c.durata); metti(c.fine); metti(c.inizio);
  metti(cfg.soglia_acceso);
  // Qui c'era anche la soglia INDOVINATA per nome,
  // "binary_sensor.<radice>_in_funzione", per le schede che non se la
  // ricordano. Tolta: bastava che un TUO aiutante si chiamasse cosi' per
  // vederselo proporre, gia' spuntato, nella cancellazione. Quella che la
  // scheda si e' fatta creare sta in `soglia_acceso`, qui sopra.
  //
  // E i costi che non ho creato io - solo riconosciuti, perche' c'erano gia' -
  // non si toccano: sono tuoi.
  const nonMiei = Array.isArray(cfg.costi_adottati) ? cfg.costi_adottati
    : (cfg.costi_adottati ? [cfg.costi_adottati] : []);
  nonMiei.forEach((x) => dentro.delete(x));
  return [...dentro];
}

// Il nome-radice della scheda: serve per ritrovare la soglia e l'automazione
// del ciclo quando nella configurazione non sono scritte.
function radiceDellaScheda(cfg) {
  const c = cfg.ciclo || {};
  const da = (eid, coda) => {
    // IL `_N` NON SI TOGLIE PIU'.
    // Qui c'era un `.replace(/_\d+$/, "")` per «togliere la coda che Home
    // Assistant appende quando lo slug e' occupato». Succedeva il
    // contrario: con due schede dagli slug uguali («Forno» e «Forno »
    // con uno spazio in piu'), la seconda aveva
    // `automation.forno_segna_il_ciclo_2`, il replace la riduceva a "forno" e
    // «Cancella gli aiutanti» proponeva - spuntata - l'automazione della
    // PRIMA scheda: cancellandola la prima smetteva di registrare i cicli e
    // la `_2` restava invisibile a tutte e due.
    // Gli indirizzi veri delle memorie stanno in `cfg.ciclo`, e l'id
    // dell'automazione in `cfg.ciclo.automazione`: questa radice e' solo il
    // ripiego per le schede che non ce l'hanno ancora scritto.
    const o = String(eid || "").split(".")[1] || "";
    return o.endsWith(coda) ? o.slice(0, -coda.length) : "";
  };
  // PRIMA GLI INDIRIZZI, POI il nome. Gli indirizzi non cambiano quando
  // rinomini la scheda; il nome si', e allora la soglia e l'automazione del
  // ciclo - che si chiamano ancora com'erano - non si ritrovavano piu', e ne
  // nasceva un secondo giro.
  const dagliIndirizzi = da(c.consumo, "_ultimo_ciclo_kwh") || da(c.durata, "_ultimo_ciclo_minuti")
    || da(c.inizio, "_ciclo_iniziato") || da(c.contatore, "_ciclo_kwh")
    || da(cfg.soglia_acceso, "_in_funzione");
  return dagliIndirizzi || (cfg.name ? slug(cfg.name) : "");
}

// Gli aiutanti VERI fra quelli nominati dalla scheda. Tre razze:
//   voce       -> una voce di configurazione (contatore, soglia, template...)
//   memoria    -> un input_number / input_datetime dell'ultimo ciclo
//   automazione-> quella che riempie le memorie a fine ciclo
// Il resto (la presa, i sensori del dispositivo) non e' roba nostra e non si
// tocca nemmeno per sbaglio.
export async function aiutantiVeri(hass, cfg) {
  const candidati = aiutantiDellaScheda(hass, cfg);
  const fuori = [];
  if (candidati.length) {
    const reg = await registro(hass);
    const voci = await vociDiConfigurazione(hass);
    const perId = {};
    voci.forEach((x) => { perId[x.entry_id] = x; });
    candidati.forEach((eid) => {
      const dominio = eid.split(".")[0];
      if (DOMINI_MEMORIA.includes(dominio)) {
        if (!hass.states[eid]) return;
        fuori.push({ entity: eid, tipo: "memoria", dominio,
          id: eid.split(".").slice(1).join("."),
          titolo: (hass.states[eid].attributes || {}).friendly_name || eid });
        return;
      }
      const e = reg.find((x) => x.entity_id === eid);
      const voce = e && e.config_entry_id ? perId[e.config_entry_id] : null;
      if (voce && DOMINI_AIUTANTI.includes(voce.domain) && !fuori.some((f) => f.entry_id === voce.entry_id)) {
        fuori.push({ entity: eid, tipo: "voce", entry_id: voce.entry_id, titolo: voce.title || eid });
      }
    });
  }
  // L'AUTOMAZIONE DEL CICLO: PRIMA DAL SUO ID, che la scheda si e' scritto in
  // `ciclo.automazione` quando l'ha creata. Il nome e lo slug ricostruito
  // puntavano all'automazione di un'altra scheda quando i due slug
  // collidevano (vedi radiceDellaScheda).
  const idMio = String((cfg.ciclo || {}).automazione || "");
  if (idMio) {
    const eid = Object.keys(hass.states).find((x) => x.startsWith("automation.")
      && String((hass.states[x].attributes || {}).id || "") === idMio);
    if (eid) {
      fuori.push({ entity: eid, tipo: "automazione", id: idMio,
        titolo: (hass.states[eid].attributes || {}).friendly_name || eid });
    }
    return fuori;
  }
  // il ripiego per le schede nate prima, che l'id non ce l'hanno scritto:
  // la riconosco dal nome che le ho dato io
  const base = radiceDellaScheda(cfg);
  if (base && (cfg.ciclo || cfg.soglia_acceso)) {
    const eid = "automation." + base + "_segna_il_ciclo";
    const st = hass.states[eid];
    if (st && st.attributes && st.attributes.id) {
      fuori.push({ entity: eid, tipo: "automazione", id: String(st.attributes.id),
        titolo: st.attributes.friendly_name || eid });
    }
  }
  return fuori;
}

/**
 * Cancella solo gli aiutanti che gli passi, ognuno come va cancellato lui.
 * Torna { cancellati, memoria }: la memoria sono i valori che avevano, per
 * farli ripartire da li'.
 */
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
      if (a.tipo === "memoria") {
        await hass.callWS({ type: a.dominio + "/delete", [a.dominio + "_id"]: a.id });
      } else if (a.tipo === "automazione") {
        await hass.callApi("DELETE", "config/automation/config/" + a.id);
      } else {
        await hass.callWS({ type: "config_entries/delete", entry_id: a.entry_id });
      }
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
    "soglia_acceso", "fv_somma", "fv_energia", "risparmio_euro", "risparmio_energia"];
  CHIAVI.forEach((k) => { if (via.has(c[k])) delete c[k]; });
  // l'elenco di quello che ho creato io: via le righe delle entita' sparite
  ["aiutanti_miei", "aiutanti_fv", "aiutanti_risparmio"].forEach((k) => {
    if (!c[k] || typeof c[k] !== "object") return;
    const m = {};
    Object.keys(c[k]).forEach((r) => { if (!via.has(c[k][r])) m[r] = c[k][r]; });
    if (Object.keys(m).length) c[k] = m; else delete c[k];
  });
  ["fv_casa", "pannelli", "batteria", "risparmio"].forEach((chi) => {
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
  if (c.ciclo) {
    const ci = { ...c.ciclo };
    ["contatore", "consumo", "durata", "fine", "inizio"].forEach((k) => {
      if (via.has(ci[k])) delete ci[k];
    });
    // l'id dell'automazione non e' un'entita': se l'automazione e' stata
    // cancellata va via anche lui, se no al giro dopo cerco un id che non
    // c'e' piu'
    if (ci.automazione && [...via].some((x) => String(x).startsWith("automation."))) {
      delete ci.automazione;
    }
    if (Object.keys(ci).length) c.ciclo = ci; else delete c.ciclo;
  }
  return c;
}
