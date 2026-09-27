// L'editor a clic di custom:casa-elettrodomestico.
// Sopra: le impostazioni. In mezzo: le righe dell'Ultimo ciclo (spunta,
// trascina, rinomina). Sotto: "Prepara da solo", che ricompila la scheda
// partendo dalla presa (o dallo stato) come fa la voce del Tocco.

import { RIGHE_CICLO } from './elettro-elettrodomestico.js';
import { VERSIONE } from './versione.js';
import { ConEditor } from './elettro-condivisi.js';
import { tastiDi } from './elettro-comune.js';
import { T, TH, traduciSchema } from './lingua.js';
import { preparaElettrodomestico, trovaPerDisegno } from './elettro-prepara.js';
import { STILE_EDITOR, disegnaRighe, disegnaTasti, titoloSez, vestiSez } from './elettro-righe-editor.js';
import { creaCicli, prezzoDellaCasa, INGREDIENTE, creaSensoriElettrodomestico, prezziDelKWh } from './elettro-crea.js';

const DISEGNI = [
  ["washer", "Lavatrice"],
  ["dishwasher", "Lavastoviglie"],
  ["dryer", "Asciugatrice"],
  ["oven", "Forno"],
  ["microonde", "Microonde"],
  ["frigorifero", "Frigorifero"],
  ["dehumidifier", "Deumidificatore"],
  ["condizionatore", "Condizionatore"],
  ["ventilatore", "Ventilatore"],
  ["boiler", "Boiler / scaldabagno"],
  ["luce", "Luce"],
  ["lampada", "Lampada"],
  ["tv", "Televisore"],
  ["pc_torre", "PC (torre)"],
  ["pc_monitor", "PC (monitor)"],
  ["minipc", "Mini PC (Home Assistant)"],
  ["presa", "Presa smart"],
  ["ciabatta", "Ciabatta / multipresa"],
  ["powerstation", "Powerstation"],
  ["energy", "Contatore della luce"],
  ["ups", "Gruppo di continuita'"],
  ["server", "Server"],
  ["nas", "NAS"],
  ["fritzbox", "Router"],
  ["proxmox", "Proxmox"],
];

const ETICHETTE = {
  interruttori_lista: "Piu' prese (ciabatte): una fila di tastini col loro nome",
  name: "Nome della scheda",
  artwork: "Icona",
  power_entity: "Presa che misura (W) - o un altro numero da mostrare nella barra",
  threshold_run: "Sopra questi W e' «in funzione»",
  threshold_standby: "Sopra questi W e' «in standby»",
  max_power: "Fondo scala della barra",
  power_label: "Nome della barra (vuoto = Potenza attuale)",
  power_unit: "Unita' della barra (vuoto = W)",
  stato: "Stato vero dell'apparecchio (facoltativo: integrazioni LG, Bosch...)",
  interruttore: "Tasto \u23fb nella barra in alto: cosa accende e spegne",
  interruttore_usb: "Secondo tasto per le prese USB (se ci sono)",
  oggi_energia: "kWh di OGGI: il contatore di utenza a ciclo giornaliero",
  oggi_costo: "Euro di oggi: quei kWh per il prezzo",
  mese_energia: "kWh del MESE: lo stesso contatore a ciclo mensile",
  mese_costo: "Euro del mese",
  barre_entita: "Barre in piu' (una per ogni cosa che vuoi vedere in W)",
  cycle_sensor: "Sensore dell'ultimo ciclo (es. sensor.lavatrice_ciclo)",
  avanzamento: "Seconda barra: un numero da 0 a 100 (avanzamento, umidita'...)",
  progress_label: "Nome della seconda barra (vuoto = Avanzamento programma)",
  vivo_energia: "Ciclo in corso: energia gia' consumata (Wh o kWh)",
  vivo_trascorso: "Ciclo in corso: minuti gia' fatti",
  vivo_residuo: "Ciclo in corso: minuti che mancano (per l'ora di fine)",
  vivo_programma: "Ciclo in corso: programma scelto",
  vivo_fase: "Ciclo in corso: fase (asciugatura, risciacquo...)",
  notification_path: "Pagina delle notifiche (facoltativa)",
  finestra_sfondo: "Tinta della finestra del pop-up",
  finestra_trasparenza: "Trasparenza della finestra",
  finestra_scritta: "Colore delle scritte nella finestra",
  velo_scuro: "Quanto scurisce quello che c'e' dietro",
  velo_sfoca: "Quanto sfoca quello che c'e' dietro",
};

const SCHEMA_TUTTO = [
  // in vista solo l'essenziale: come si chiama, che faccia ha, cosa misura
  { name: "name", selector: { text: {} } },
  { name: "artwork", selector: { select: { mode: "dropdown", options: DISEGNI.map(([value, label]) => ({ value, label })) } } },
  { name: "power_entity", selector: { entity: { domain: "sensor" } } },
  // il resto in cassetti, che si aprono solo se servono
  { name: "g_acceso", type: "expandable", flatten: true, title: "Quando e' acceso (soglie e barra)", schema: [
    { name: "threshold_run", selector: { number: { min: 0, max: 3000, step: 1, mode: "box", unit_of_measurement: "W" } } },
    { name: "threshold_standby", selector: { number: { min: 0, max: 500, step: 0.5, mode: "box", unit_of_measurement: "W" } } },
    { name: "max_power", selector: { number: { min: 1, max: 10000, step: 1, mode: "box" } } },
    { name: "power_label", selector: { text: {} } },
    { name: "power_unit", selector: { text: {} } },
    { name: "stato", selector: { entity: {} } },
  ] },
  { name: "g_conti", type: "expandable", flatten: true, title: "Sensore dell'ultimo ciclo", schema: [
    { name: "cycle_sensor", selector: { entity: { domain: "sensor" } } },
  ] },
  { name: "g_vivo", type: "expandable", flatten: true, title: "Ciclo in corso (mentre lavora)", schema: [
    { name: "vivo_energia", selector: { entity: { domain: "sensor" } } },
    { name: "vivo_trascorso", selector: { entity: { domain: "sensor" } } },
    { name: "vivo_residuo", selector: { entity: { domain: "sensor" } } },
    { name: "vivo_programma", selector: { entity: { domain: "sensor" } } },
    { name: "vivo_fase", selector: { entity: { domain: "sensor" } } },
  ] },
  { name: "g_barre", type: "expandable", flatten: true, title: "Seconda barra", schema: [
    { name: "barre_entita", selector: { entity: { multiple: true, domain: "sensor" } } },
    { name: "avanzamento", selector: { entity: {} } },
    { name: "progress_label", selector: { text: {} } },
  ] },
  { name: "g_aspetto", type: "expandable", flatten: true, title: "Aspetto e finestra del pop-up", schema: [
    { name: "notification_path", selector: { text: {} } },
    { name: "finestra_sfondo", selector: { color_rgb: {} } },
    { name: "finestra_trasparenza", selector: { number: { min: 0, max: 90, step: 5, mode: "slider", unit_of_measurement: "%" } } },
    { name: "finestra_scritta", selector: { color_rgb: {} } },
    { name: "velo_scuro", selector: { number: { min: 0, max: 100, step: 5, mode: "slider", unit_of_measurement: "%" } } },
    { name: "velo_sfoca", selector: { number: { min: 0, max: 30, step: 1, mode: "slider", unit_of_measurement: "px" } } },
  ] },
];

// Quello che si vede appena apri: tre campi e due cassetti. Il resto sta in
// SCHEMA_TUTTO e compare solo con l'interruttore "mostra tutto".
// Appena apri vedi questi tre. Ogni altro cassetto diventa un riquadro suo,
// coi campi lisci dentro: cosi' stanno tutti in riga invece di vestirsi da
// soli come fa l'ha-form.
// Come si riconosce ogni tendina quando e' chiusa: l'icona, la striscia di
// colore a sinistra e una riga che dice in poche parole cosa c'e' dentro.
// Chiuse erano otto rettangoli col titolo, e per trovarne una le aprivi tutte.
const VESTITO = {
  capisci: ["bacchetta", "#7cc4ff", "parti da un'entita' e riempio io il resto"],
  contatori: ["contatore", "#2fbfb0", "i kWh, il prezzo, i cicli e l'azzeramento"],
  tasti: ["accensione", "#43b86a", "le prese e le luci che accendi dalla scheda"],
  righe: ["lista", "#e2ad1c", "quali numeri si vedono nel riquadro, e in che ordine"],
  barre: ["barre", "#4fb0d8", "il nome e il fondo scala delle barre in piu'"],
  g_acceso: ["tachimetro", "#f28c3c", "sopra quanti watt sta lavorando, e il fondo scala",
    "Sopra quanti watt la scheda dice <b>in funzione</b>, e sotto quanti <b>in standby</b>. Qui c'e' anche il fondo scala della barra e il suo nome. Se l'apparecchio ha una sua integrazione che dice lo stato vero, mettila in fondo: comanda quella e le soglie non servono piu'."],
  g_conti: ["contatore", "#a283f2", "se un'integrazione ti da' gia' il ciclo finito",
    "Serve solo se un'integrazione o un pacchetto ti da' <b>gia' pronto</b> un sensore con dentro l'ultimo ciclo (fine, durata e consumo negli attributi). In quel caso la scheda legge quello invece dei contatori che si crea da sola. Se non ce l'hai, lascia vuoto."],
  g_vivo: ["clessidra", "#3fb4ea", "programma, tempo e fase mentre sta lavorando",
    "Le entita' che parlano <b>mentre l'apparecchio lavora</b>: quanto ha gia' consumato, da quanto va, quanto manca, il programma e la fase. Sono quelle che riempiono il riquadro <i>Ciclo in corso</i>. Anche queste le da' l'integrazione dell'apparecchio, non la presa."],
  g_barre: ["barre", "#4fb0d8", "un'altra misura sotto alla potenza",
    "Una seconda barra sotto a quella della potenza: un'altra misura in watt, oppure un avanzamento da 0 a 100 (il programma, l'umidita'...). Il nome e il fondo scala di ognuna si scrivono nella tendina <i>Nomi delle barre in piu'</i>."],
  g_aspetto: ["tavolozza", "#f06e82", "colori, trasparenza e velo della finestrella",
    "Come si veste la finestrella che si apre dai tondini: tinta, trasparenza, colore delle scritte, e quanto scurisce e sfoca quello che c'e' dietro. In piu' la pagina delle notifiche, se ne hai una."],
};

const SEMPLICI = ["name", "power_entity", "artwork"];
const SCHEMA_SEMPLICE = SEMPLICI
  .map((n) => SCHEMA_TUTTO.find((x) => x.name === n))
  .filter(Boolean);
const GRUPPI = SCHEMA_TUTTO
  .filter((x) => Array.isArray(x.schema))
  .map((x) => ({ chiave: x.name, titolo: x.title, schema: x.schema }));


export class CasaElettrodomesticoEditor extends ConEditor(HTMLElement) {
  // "stato" nel modulo e' live.state_entity nella configurazione
  _datiForm() {
    const c = this._config;
    return { ...c,
      barre_entita: (c.barre || []).map((x) => x && x.entity).filter(Boolean),
      finestra_sfondo: this._versoRgb(c.finestra_sfondo),
      finestra_scritta: this._versoRgb(c.finestra_scritta), stato: (c.live && c.live.state_entity) || "",
      avanzamento: (c.live && c.live.progress_entity) || "",
      vivo_energia: (c.ciclo_live && c.ciclo_live.energy_entity) || "",
      vivo_trascorso: (c.ciclo_live && c.ciclo_live.elapsed_entity) || "",
      vivo_residuo: (c.ciclo_live && c.ciclo_live.remaining_entity) || "",
      vivo_programma: (c.ciclo_live && c.ciclo_live.program_entity) || "",
      vivo_fase: (c.ciclo_live && c.ciclo_live.phase_entity) || "",
      // le prese di una ciabatta: nel form sono un semplice elenco di entita'
      interruttori_lista: (c.interruttori || []).map((x) => x && x.entity).filter(Boolean) };
  }

  _cambiatoForm(v) {
    // hai cambiato il disegno? allora vado a cercare l'apparecchio che gli
    // somiglia. Lo PROPONGO e basta: la scheda non si compila da sola.
    if ("artwork" in v && v.artwork && v.artwork !== this._config.artwork) {
      this._proponiDalDisegno(v.artwork);
    }
    // le terne del selettore tornano esadecimali
    ["finestra_sfondo", "finestra_scritta"].forEach((k) => {
      if (k in v) v[k] = this._versoHex(v[k]);
    });
    if ("interruttori_lista" in v) {
      const prima = {};
      (this._config.interruttori || []).forEach((x) => { if (x && x.entity) prima[x.entity] = x.label; });
      const lista = (v.interruttori_lista || []).map((e) => ({ entity: e, label: prima[e] || "" }));
      v = { ...v };
      delete v.interruttori_lista;
      v.interruttori = lista.length ? lista : "";
    }
    const c = { ...this._config };
    Object.keys(v).forEach((k) => {
      if (k === "stato" || k === "avanzamento" || k.startsWith("vivo_")) return;
      if (v[k] === "" || v[k] === undefined || v[k] === null) delete c[k];
      else c[k] = v[k];
    });
    const live = { ...(c.live || {}) };
    if (v.stato) live.state_entity = v.stato; else delete live.state_entity;
    if ("avanzamento" in v) {
      if (v.avanzamento) live.progress_entity = v.avanzamento; else delete live.progress_entity;
    }
    if (Object.keys(live).length) c.live = live; else delete c.live;
    const vivo = {};
    const CHIAVI = { vivo_energia: "energy_entity", vivo_trascorso: "elapsed_entity",
      vivo_residuo: "remaining_entity", vivo_programma: "program_entity", vivo_fase: "phase_entity" };
    Object.keys(CHIAVI).forEach((k) => {
      const vecchio = (this._config.ciclo_live || {})[CHIAVI[k]];
      const nuovo = k in v ? v[k] : vecchio;
      if (nuovo) vivo[CHIAVI[k]] = nuovo;
    });
    if (Object.keys(vivo).length) c.ciclo_live = vivo; else delete c.ciclo_live;
    // le barre in piu': tengo nome e fondo scala di quelle che c'erano gia'
    if ("barre_entita" in v) {
      const prima = {};
      (this._config.barre || []).forEach((x) => { if (x && x.entity) prima[x.entity] = x; });
      const elenco = (v.barre_entita || []).map((eid) => prima[eid]
        || { label: this._nomeDi(eid), entity: eid, max: 1000 });
      if (elenco.length) c.barre = elenco; else delete c.barre;
      delete c.barre_entita;
      ["barra2_entita", "barra2_nome", "barra2_max"].forEach((k) => delete c[k]);
    }
    this._config = c;
    this._emetti();
  }

  // cerca in casa un apparecchio che somigli al disegno scelto
  _proponiDalDisegno(disegno) {
    const esito = this._esito;
    if (esito) { esito.hidden = false; esito.classList.remove("male"); }
    if (!esito || !this._hass) return;
    const trovati = trovaPerDisegno(this._hass, disegno);
    if (!trovati.length) {
      esito.textContent = "Per questo disegno non ho trovato niente che si chiami cosi'. Scegli tu l'entita' qui sopra.";
      return;
    }
    // il candidato lo NOMINO soltanto: la casella la riempi tu
    // NON compilo mai da solo: propongo il candidato, decidi tu
    esito.textContent = "Per questo disegno ci sarebbe " + this._nomeDi(trovati[0])
      + (trovati.length > 1 ? " (e altri " + (trovati.length - 1) + ")" : "")
      + ": premi il tasto qui sotto se lo vuoi. Non ho toccato niente.";
  }

  // nome e fondo scala di ogni barra in piu'
  _disegnaBarre() {
    const box = this.querySelector(".ce-barre");
    if (!box) return;
    const barre = this._config.barre || [];
    // niente barre in piu' = niente cassetto: era un riquadro che diceva
    // solo "qui non c'e' niente"
    const cassetto = box.closest(".ce-sez");
    if (cassetto) cassetto.hidden = !barre.length;
    box.innerHTML = "";
    barre.forEach((b, i) => {
      const riga = document.createElement("div");
      riga.className = "ce-riga";
      riga.innerHTML = "";
      const ent = document.createElement("span");
      ent.className = "ent";
      ent.textContent = b.entity;
      riga.appendChild(ent);
      const nome = document.createElement("input");
      nome.className = "nome";
      nome.placeholder = "nome della barra";
      nome.value = b.label || "";
      const max = document.createElement("input");
      max.type = "number";
      max.className = "max";
      max.style.maxWidth = "90px";
      max.value = b.max || 1000;
      const scrivi = () => {
        const c = { ...this._config, barre: barre.map((x, k) => k !== i ? x
          : { ...x, label: nome.value.trim() || this._nomeDi(x.entity), max: Number(max.value) || 1000 }) };
        this._config = c;
        this._emetti();
      };
      nome.addEventListener("change", scrivi);
      max.addEventListener("change", scrivi);
      riga.append(nome, max, document.createTextNode(" W"));
      box.appendChild(riga);
    });
  }

  // Il prezzo dei sensori che creo: o il numero secco del menu, o la tariffa
  // della sola energia scritta a mano. Il conto della bolletta sta altrove.
  _prezzoScritto() {
    const n = (c) => Number((this.querySelector(c) || {}).value) || 0;
    const energia = n(".ce-v-energia");
    if (energia > 0) return Math.round(energia * 10000) / 10000;
    // se hai detto "scrivo io" valgono SOLO le voci: niente numeri di scorta
    const sel = this.querySelector(".ce-prezzo-ent");
    if (sel && sel.value === "__mia__") return 0;
    return Number((this.querySelector(".ce-prezzo") || {}).value) || 0;
  }

  _aggiornaTotale() {
    const t = this.querySelector(".ce-v-totale");
    if (!t) return;
    const v = this._prezzoScritto();
    t.textContent = v ? v.toFixed(4) + " \u20ac/kWh" : "\u2014";
  }

  // il nome buono e' quello del dispositivo ("Lavatrice"), non del sensore
  // ("Lavatrice Potenza"): se no gli aiutanti si chiamano tutti "... Potenza ..."
  _nomeDispositivo(eid) {
    const h = this._hass;
    if (!h || !eid) return "";
    const voce = (h.entities || {})[eid];
    const dev = voce && voce.device_id && (h.devices || {})[voce.device_id];
    if (dev && (dev.name_by_user || dev.name)) return dev.name_by_user || dev.name;
    const st = h.states[eid];
    return (st && st.attributes && st.attributes.friendly_name) || "";
  }

  // i dati a tutti i moduli (quello in cima e i cassetti)
  _datiAiModuli() {
    const dati = this._datiForm();
    (this._moduli || []).forEach((f) => { f.data = dati; });
  }

  // i tasti: la lista con "Aggiungi" e l'icona di ognuno
  // Azzera i contatori chiamando lo script che dice la configurazione, e
  // gli passa quali contatori sono: cosi' basta uno script per tutta la casa.
  _azzera() {
    const cfg = this._config;
    const pe = cfg.period_entities || {};
    const ci = cfg.ciclo || {};
    if (!cfg.reset_script) return;
    if (!window.confirm(T("Azzero i contatori di questa scheda. Vado?"))) return;
    this._hass.callService("script", "turn_on", {
      entity_id: cfg.reset_script,
      variables: {
        scheda: cfg.name || "",
        oggi: cfg.oggi_energia || (pe.today || {}).energy || "",
        settimana: cfg.settimana_energia || (pe.week || {}).energy || "",
        mese: cfg.mese_energia || (pe.month || {}).energy || "",
        ciclo_contatore: ci.contatore || "",
        ciclo_kwh: ci.consumo || "",
        ciclo_minuti: ci.durata || "",
        ciclo_fine: ci.fine || "",
      },
    });
    this._dillo(T("Azzerati."));
  }

  _disegnaTasti() {
    const box = this.querySelector(".ce-tasti");
    if (!box) return;
    disegnaTasti(box, tastiDi(this._config), this._hass, (elenco) => {
      const c = { ...this._config, tasti: elenco };
      delete c.interruttore;
      delete c.interruttore_usb;
      delete c.interruttori;
      if (!elenco.length) delete c.tasti;
      this._config = c;
      this._emetti();
      this._disegnaTasti();
      this._riassunti();
    });
  }

  // quello che si legge su ogni tendina chiusa
  _riassunti() {
    const metti = (sel, testo) => {
      const x = this.querySelector(sel + " .ce-riassunto");
      if (x) x.textContent = testo ? " \u00b7 " + testo : "";
    };
    const c = this._config;
    metti(".ce-sez-capisci", c.power_entity ? this._nomeDi(c.power_entity) : T("da fare"));
    const pe = c.period_entities || {};
    const quanti = Object.keys(pe).filter((k) => (pe[k] || {}).energy).length
      || [c.oggi_energia, c.mese_energia].filter(Boolean).length;
    metti(".ce-sez-contatori", quanti ? quanti + " " + T(quanti === 1 ? "agganciato" : "agganciati") : T("da fare"));
    const tasti = tastiDi(c).length;
    metti(".ce-sez-tasti", tasti ? tasti + " " + T(tasti === 1 ? "tasto" : "tasti") : T("nessuno"));
    const righe = Array.isArray(c.righe) ? c.righe.length : this._righeDaOffrire().length;
    metti(".ce-sez-righe", righe + " " + T(righe === 1 ? "accesa" : "accese"));
    const barre = (c.barre || []).length;
    metti(".ce-sez-barre", barre ? barre + " " + T(barre === 1 ? "barra" : "barre") : T("nessuna"));
  }

  // Le righe che ha senso proporre. Se la scheda segue i cicli, "kWh di oggi"
  // e "Costo di oggi" ripetono il ciclo ogni volta che di cicli ne fai uno al
  // giorno, e il totale del giorno sta comunque nelle Statistiche. Quindi non
  // le propongo - a meno che tu non le abbia gia' accese, se no non potresti
  // piu' toglierle.
  _righeDaOffrire() {
    const c = this._config || {};
    const haCicli = !!(c.cycle_sensor || c.ciclo || c.ciclo_live);
    if (!haCicli) return RIGHE_CICLO;
    const accese = Array.isArray(c.righe) ? c.righe : [];
    return RIGHE_CICLO.filter((r) => !(["oggi", "costo_oggi"].includes(r.id)
      && !accese.includes(r.id)));
  }

  _disegnaRighe() {
    if (!this._righe) return;
    disegnaRighe(this._righe, this._righeDaOffrire(), this._config, (c) => {
      this._config = c;
      this._emetti();
      this._disegnaRighe();
    });
    this._disegnaBarre();
    this.querySelectorAll(".ce-v-energia").forEach((x) => {
      if (x._agganciato) return;
      x._agganciato = true;
      x.addEventListener("input", () => this._aggiornaTotale());
    });
    // il sceglitore di "Compila da solo" senza `hass` resta vuoto e non cerca
    const sceglitore = this.querySelector(".ce-capisci-ent");
    if (sceglitore) sceglitore.hass = this._hass;
  }

  _disegnaPrezzo() {
    const sel = this.querySelector(".ce-prezzo-ent");
    const campo = this.querySelector(".ce-prezzo");
    if (!sel || !campo) return;
    const elenco = prezziDelKWh(this._hass);
    const scelto = sel.value;
    sel.hidden = false;
    campo.hidden = true;
    sel.innerHTML = "";
    // niente di preselezionato: il prezzo lo scegli tu
    const vuoto = document.createElement("option");
    vuoto.value = "";
    vuoto.textContent = "\u2014 scegli il prezzo \u2014";
    sel.appendChild(vuoto);
    // quello che tiene la scheda principale: e' il caso normale
    const dallaCasa = prezzoDellaCasa(this._hass);
    // gli aiutanti in \u20ac/kWh che hai gia' in casa (li ha fatti Home Assistant,
    // non io: sono gli input_number con unita' \u20ac/kWh)
    elenco.filter((id) => !INGREDIENTE.test(id)).forEach((id) => {
      const st = this._hass.states[id];
      const o = document.createElement("option");
      o.value = id;
      o.textContent = (st.attributes.friendly_name || id) + " \u2014 " + st.state + " \u20ac/kWh"
        + (id === dallaCasa ? "  (dalla scheda principale)" : "");
      sel.appendChild(o);
    });
    const mia = document.createElement("option");
    mia.value = "__mia__";
    mia.textContent = elenco.length ? "\u2014 scrivo io la mia tariffa \u2014" : "\u2014 scrivo io la mia tariffa (non ne hai) \u2014";
    sel.appendChild(mia);
    const mio = this._config.prezzo_entita;
    // ripesco quello che hai scelto tu; se non hai scelto niente vale quello
    // della scheda principale, che e' dove la tariffa si scrive
    if (scelto && (scelto === "__mia__" || elenco.includes(scelto))) sel.value = scelto;
    else if (mio && elenco.includes(mio)) sel.value = mio;
    else if (dallaCasa && elenco.includes(dallaCasa)) sel.value = dallaCasa;
    else sel.value = "";
    if (!sel._agganciato) {
      sel._agganciato = true;
      sel.addEventListener("change", () => this._mostraVoci());
    }
    this._mostraVoci();
  }

  // le voci della bolletta si vedono solo se hai detto "scrivo io"
  _mostraVoci() {
    const sel = this.querySelector(".ce-prezzo-ent");
    const mia = sel && sel.value === "__mia__";
    this.querySelectorAll(".ce-voci").forEach((x) => { x.hidden = !mia; });
    this._aggiornaTotale();
  }

  // DIVERSA DI PROPOSITO da quella della scheda energia: qui vanno bene anche
  // i contatori in Wh (una presa spesso conta in Wh), li porto in kWh io
  _kWhPossibili() {
    const st = (this._hass && this._hass.states) || {};
    return Object.keys(st).filter((id) => {
      if (!id.startsWith("sensor.")) return false;
      const a = st[id].attributes || {};
      const u = String(a.unit_of_measurement || "").toLowerCase();
      return a.device_class === "energy" && (u === "kwh" || u === "wh");
    }).sort();
  }

  _disegnaKwh() {
    const sel = this.querySelector(".ce-kwh-pick");
    if (!sel) return;
    if (this._hass) sel.hass = this._hass;
    // gli faccio vedere solo i contatori di energia: cosi' la ricerca non
    // pesca lampadine e termometri
    const buoni = this._kWhPossibili();
    sel.includeDomains = ["sensor"];
    sel.entityFilter = (e) => buoni.includes(typeof e === "string" ? e : e.entity_id);
    if (!sel._agganciato) {
      sel._agganciato = true;
      sel.addEventListener("value-changed", (ev) => {
        ev.stopPropagation();
        this._scriviScelta("energia_kwh", ev.detail.value || "");
        this._disegnaKwh();
      });
    }
    const mio = this._config.energia_kwh;
    // se il dispositivo ha gia' il suo contatore in kWh lo scelgo io: creare
    // un integrale sopra a un contatore vero sarebbe lavoro (e helper) sprecato
    sel.value = mio || "";
    // la soglia si misura con l'unita' del sensore scelto: se al posto dei Watt
    // c'e' il tempo residuo della lavatrice, sono minuti
    const un = String((((this._hass || {}).states || {})[this._config.power_entity] || {}).attributes
      ?.unit_of_measurement || "W");
    const eti = this.querySelector(".ce-soglia-eti");
    const unEl = this.querySelector(".ce-soglia-un");
    if (eti) eti.textContent = "Sopra questi " + un + " sta lavorando";
    if (unEl) unEl.textContent = un;
    // rimetto le spunte come le avevi lasciate
    const scelti = this._config.periodi;
    if (Array.isArray(scelti)) {
      ["oggi", "settimana", "mese"].forEach((k) => {
        const c = this.querySelector(".ce-p-" + k);
        if (c) c.checked = scelti.includes(k);
      });
    }
    const nota = this.querySelector(".ce-nota-kwh");
    if (nota) {
      const u = sel.value ? String(((this._hass.states[sel.value] || {}).attributes || {})
        .unit_of_measurement || "") : "";
      nota.innerHTML = sel.value
        ? ("Bene: i kWh li conta gia' il dispositivo"
          + (u.toLowerCase() === "wh" ? ", e visto che sono in <b>Wh</b> li porto in kWh da solo." : ", li uso e basta."))
        : "Questo dispositivo <b>non conta i kWh</b>, dice solo i Watt: me li calcolo io, minuto per minuto. E' un aiutante in piu', ma e' l'unico modo.";
    }
    const soglia = this.querySelector(".ce-soglia");
    if (soglia && !soglia.dataset.tocco && this._config.threshold_run) {
      soglia.value = this._config.threshold_run;
    }
  }

  // Guarda l'entita' della potenza prima di creare qualunque cosa: vera se
  // adesso e' un numero E se e' una misura in Watt (device_class `power`,
  // oppure l'unita' W/kW - la stessa regola con cui la scheda cerca le prese
  // di casa). Un'entita' non disponibile non blocca niente: e' solo un
  // apparecchio staccato in questo momento, non un errore di chi configura.
  _potenzaVera(potenza) {
    const st = ((this._hass || {}).states || {})[potenza];
    if (!st) return true;
    const a = st.attributes || {};
    const nome = "«" + this._nomeDi(potenza) + "»";
    if (["unavailable", "unknown", ""].includes(String(st.state))) return true;
    if (!Number.isFinite(Number(st.state))) {
      this._dillo(nome + " adesso vale «" + st.state + "», che non e' un numero."
        + " Qui va la presa che misura i Watt.", true);
      return false;
    }
    const u = String(a.unit_of_measurement || "");
    if (a.device_class !== "power" && u !== "W" && u !== "kW") {
      this._dillo(nome + " non misura in Watt" + (u ? " (è in " + u + ")" : "") + "."
        + " La soglia «sta lavorando» e i kWh nascono da li': con un'altra cosa"
        + " restano bloccati senza dirlo. Se l'apparecchio non ha una presa che misura,"
        + " qui non c'e' niente da creare.", true);
      return false;
    }
    return true;
  }

  async _creaSensori() {
    const tasto = this.querySelector(".ce-crea");
    const potenza = this._config.power_entity;
    if (!potenza) { this._dillo("Prima scegli la presa che misura i Watt.", true); return; }
    if (!this._potenzaVera(potenza)) return;
    const kwh = (this.querySelector(".ce-kwh-pick") || {}).value || this._config.energia_kwh;
    const prezzoScelto = (this.querySelector(".ce-prezzo-ent") || {}).value;
    if (!prezzoScelto) {
      this._esito.hidden = false;
      this._esito.classList.add("male");
      this._esito.textContent = "Scegli prima il prezzo: o un aiutante che hai gia', o \u00abscrivo io la mia tariffa\u00bb.";
      return;
    }
    if (prezzoScelto === "__mia__" && !this._prezzoScritto()) {
      this._esito.hidden = false;
      this._esito.classList.add("male");
      this._esito.textContent = "Hai detto \u00abscrivo io\u00bb ma le voci della tariffa sono vuote.";
      return;
    }
    if (!window.confirm("Creo in Home Assistant gli helper delle statistiche di "
      + (this._config.name || "questo elettrodomestico") + "." + "\n"
      + "Quelli che ci sono gia' li riuso. Vado?")) return;
    tasto.disabled = true;
    this._esito.hidden = false;
    this._esito.classList.remove("male");
    this._esito.textContent = "";
    try {
      const patch = await creaSensoriElettrodomestico(this._hass, {
        memoria: this._config.helper_memoria || {},
        reset_script: this._config.reset_script,
        // i contatori che la scheda gia' usa: quelli si riusano, non si rifanno
        gia: {
          oggi: this._config.oggi_energia || ((this._config.period_entities || {}).today || {}).energy,
          settimana: this._config.settimana_energia || ((this._config.period_entities || {}).week || {}).energy,
          mese: this._config.mese_energia || ((this._config.period_entities || {}).month || {}).energy,
        },
        nome: this._config.name || this._nomeDispositivo(kwh || potenza),
        potenza, energia: kwh || null,
        soglia: Number((this.querySelector(".ce-soglia") || {}).value),
        prezzo_entita: (() => {
          const v = (this.querySelector(".ce-prezzo-ent") || {}).value;
          return v === "__mia__" ? "" : (v || this._config.prezzo_entita);
        })(),
        prezzo: this._prezzoScritto(),
        tempi: !!(this.querySelector(".ce-tempi") || {}).checked,
        periodi: ["oggi", "settimana", "mese"].filter((k) =>
          ((this.querySelector(".ce-p-" + k) || {}).checked)),
        stats: this._config.stats,
      }, (t) => this._dillo(t));
      this._config = { ...this._config, ...patch };
      // la memoria dei valori, se e' stata usata, si butta (patch la mette a null)
      if (patch.helper_memoria === null) delete this._config.helper_memoria;
      if ((this.querySelector(".ce-cicli") || {}).checked) {
        const kwhVero = (patch.energy_stat_entity || kwh
          || ((patch.period_entities || {}).today || {}).energy);
        const piu = await creaCicli(this._hass, {
          potenza, energia: kwhVero, nome: this._config.name,
          soglia: Number((this.querySelector(".ce-soglia") || {}).value),
        }, (t) => this._dillo(t));
        this._config = { ...this._config, ...piu };
      }
      this._emetti();
      this._datiAiModuli();
      this._dillo("Le statistiche sono agganciate. Salva e chiudi.");
    } catch (e) {
      this._dillo("Non ce l'ho fatta: " + (e && e.message ? e.message : e), true);
    }
    tasto.disabled = false;
  }

  _disegna() {
    if (!this._costruito) {
      this._costruito = true;
      this.innerHTML = `<style>${STILE_EDITOR}</style>` + TH(`<div class="ce-versione">casa-elettrodomestico \u00b7 casa-tile v${VERSIONE}</div>
        <div class="ce-form"></div>
        <details class="ce-sez ce-tendina ce-sez-capisci" data-c="1" style="--c:#7cc4ff">
          <summary class="ce-tit">${titoloSez(VESTITO.capisci, T("Capisci da solo l\u0027apparecchio"))}</summary>
          <div class="ce-aiuto">${T("Scegli <b>una qualsiasi</b> entita\u0027 dell\u0027apparecchio - la presa, l\u0027interruttore, lo stato - e premi il tasto. Guardo tutte le altre entita\u0027 dello <b>stesso dispositivo</b> e riempio io quello che trovo. Niente e\u0027 definitivo: si cambia tutto qui sotto.")}</div>
          <div class="ce-riga"><span class="ent">${T("Entita\u0027 da cui partire")}</span><ha-entity-picker class="ce-capisci-ent" allow-custom-entity></ha-entity-picker></div>
          <button type="button" class="ce-prepara">Compila da solo</button>
        </details>
        <details class="ce-sez ce-tendina ce-sez-contatori" data-c="1" style="--c:#2fbfb0">
          <summary class="ce-tit">${titoloSez(VESTITO.contatori, T("I contatori"))}</summary>
          <div class="ce-aiuto">${T("A un apparecchio o a una presa servono <b>due aiutanti</b>: i kWh di oggi e i kWh del mese. Il <b>costo non ha un sensore</b>: sono i kWh per il prezzo, e il conto lo fa la scheda mentre lo guardi. Il prezzo si scrive una volta sola nella scheda <i>Energia Casa</i>: qui vale la <b>sola energia</b>, se no le tasse le paghi due volte.")}</div>
          <div class="ce-riga"><span class="ent">${T("Sensore dei kWh")}</span><ha-entity-picker class="ce-kwh-pick" allow-custom-entity></ha-entity-picker></div>
          <div class="ce-aiuto ce-nota-kwh"></div>
          <div class="ce-riga"><span class="ent ce-soglia-eti">Sopra questi W sta lavorando</span><input type="number" class="ce-soglia max" step="1" min="1" value="10"> <span class="ce-soglia-un">W</span></div>
          <div class="ce-riga"><span class="ent">${T("Prezzo dei sensori che creo")}</span><select class="ce-prezzo-ent"></select><input type="number" class="ce-prezzo max" step="0.001" min="0" value="0.25" hidden></div>
          <div class="ce-riga ce-voci" hidden><span class="ent">Quanto paghi l'energia, &euro;/kWh</span><input type="number" class="ce-v-energia max" step="0.0001" min="0" placeholder="0.1657"></div>
          <div class="ce-riga ce-voci ce-voci-nota" hidden><span class="ent">${T("Qui va la <b>sola energia</b>. Rete, accise, IVA e quota fissa le conta gia\u0027 la scheda grande della casa.")}</span></div>
          <div class="ce-riga"><label><input type="checkbox" class="ce-cicli">
            <span>${T("Segui i <b>cicli</b>: quando finisce, quanto e\u0027 durato, quanto ha consumato (6 aiutanti e 1 automazione, una volta sola)")}</span></label></div>
          <div class="ce-riga"><label><input type="checkbox" class="ce-tempi">
            <span>${T("Conta anche <b>quante volte parte</b> e <b>per quanto</b> (2 aiutanti per ogni periodo, piu\u0027 la soglia)")}</span></label></div>
          <div class="ce-riga"><span class="ent">${T("Periodi da creare")}</span>
            <label><input type="checkbox" class="ce-p-oggi" checked> oggi</label>
            <label><input type="checkbox" class="ce-p-settimana"> settimana</label>
            <label><input type="checkbox" class="ce-p-mese" checked> mese</label></div>
          <button type="button" class="ce-prepara ce-crea">Crea statistiche e costi</button>
          <button type="button" class="ce-prepara ce-azzera" hidden>${T("Azzera i contatori")}</button>
          <button type="button" class="ce-prepara ce-cancella">Cancella gli aiutanti di questa scheda</button>
        </details>
        <div class="ce-esito" hidden></div>
        <label class="ce-riga ce-tutto-riga"><input type="checkbox" class="ce-tutto">
          <span>Mostra altre impostazioni</span></label>
        <div class="ce-avanzate" hidden>
          <details class="ce-sez ce-tendina ce-sez-tasti" data-c="1" style="--c:#43b86a">
            <summary class="ce-tit">${titoloSez(VESTITO.tasti, T("Tasti di accensione"))}</summary>
            <div class="ce-aiuto">${T("Ogni tasto e\u0027 un tondino nella barra in alto della scheda: premuto accende o spegne, e resta verde finche\u0027 e\u0027 acceso. Aggiungi quello che vuoi - una presa, una luce, una ventola - e scegli la sua icona.")}</div>
            <div class="ce-tasti"></div>
          </details>
          <details class="ce-sez ce-tendina ce-sez-righe" data-c="1" style="--c:#e2ad1c">
            <summary class="ce-tit">${titoloSez(VESTITO.righe, T("Righe dell\u0027\u00abUltimo ciclo\u00bb"))}</summary>
            <div class="ce-aiuto">${T("Spunta quelle da vedere e trascinale dalla maniglia \u283f per metterle in ordine. Nome e colore sono facoltativi (vuoto = quelli di serie).")}</div>
            <div class="ce-righe"></div>
          </details>
          <details class="ce-sez ce-tendina ce-sez-barre" data-c="1" style="--c:#4fb0d8">
            <summary class="ce-tit">${titoloSez(VESTITO.barre, T("Nomi delle barre in piu\u0027"))}</summary>
            <div class="ce-aiuto">${T("Il nome e il fondo scala (W) di ogni barra che hai scelto nel cassetto <i>Seconda barra</i>.")}</div>
            <div class="ce-barre"></div>
          </details>
          <div class="ce-gruppi"></div>
        </div>`);
      // un modulo per i tre campi di sempre, e uno per ogni cassetto: cosi'
      // ogni cassetto e' un riquadro come gli altri invece di vestirsi da solo
      const faiModulo = (schema, dove) => {
        const f = document.createElement("ha-form");
        f.schema = traduciSchema(schema);
        f.computeLabel = (x) => T(x.title || ETICHETTE[x.name] || x.name);
        f.addEventListener("value-changed", (e) => {
          e.stopPropagation();
          this._cambiatoForm(e.detail.value || {});
        });
        dove.appendChild(f);
        return f;
      };
      const form = faiModulo(SCHEMA_SEMPLICE, this.querySelector(".ce-form"));
      this._form = form;
      this._moduli = [form];
      const cassetti = this.querySelector(".ce-gruppi");
      GRUPPI.forEach((g) => {
        const box = document.createElement("details");
        box.className = "ce-sez ce-tendina";
        const veste = VESTITO[g.chiave] || [];
        vestiSez(box, veste);
        const cap = document.createElement("summary");
        cap.className = "ce-tit";
        // il titolo e' del dizionario, la spiegazione anche: niente da proteggere
        cap.innerHTML = titoloSez(veste, T(g.titolo));
        box.appendChild(cap);
        // la spiegazione lunga: aperta, ogni tendina dice cosa fa, come le altre
        if (veste[3]) {
          const aiuto = document.createElement("div");
          aiuto.className = "ce-aiuto";
          aiuto.innerHTML = TH(veste[3]);
          box.appendChild(aiuto);
        }
        cassetti.appendChild(box);
        this._moduli.push(faiModulo(g.schema, box));
      });
      this._avanzate = this.querySelector(".ce-avanzate");
      const spunta = this.querySelector(".ce-tutto");
      if (spunta) {
        spunta.checked = !!this._tutto;
        this._avanzate.hidden = !this._tutto;
        spunta.addEventListener("change", () => {
          this._tutto = spunta.checked;
          this._avanzate.hidden = !this._tutto;
          this._datiAiModuli();
        });
      }
      this._righe = this.querySelector(".ce-righe");
      this._esito = this.querySelector(".ce-esito");
      this.querySelector(".ce-crea").addEventListener("click", () => this._creaSensori());
      this.querySelector(".ce-cancella").addEventListener("click", () => this._cancellaSensori());
      // l'azzeramento: stava nell'ingranaggio della scheda, adesso e' qui
      this.querySelector(".ce-azzera").addEventListener("click", () => this._azzera());
      ["oggi", "settimana", "mese"].forEach((k) => {
        const c = this.querySelector(".ce-p-" + k);
        if (!c) return;
        c.addEventListener("change", () => this._scriviScelta("periodi",
          ["oggi", "settimana", "mese"].filter((x) =>
            (this.querySelector(".ce-p-" + x) || {}).checked)));
      });
      const spuntaCicli = this.querySelector(".ce-cicli");
      if (spuntaCicli) {
        spuntaCicli.checked = !!this._config.ciclo;
        spuntaCicli.addEventListener("change", () => {
          if (!spuntaCicli.checked) this._scriviScelta("ciclo", "");
        });
      }
      this.querySelector(".ce-prezzo-ent").addEventListener("change", (e) =>
        this._scriviScelta("prezzo_entita", e.target.value));
      this.querySelector(".ce-soglia").addEventListener("change", (e) => {
        this._scriviScelta("threshold_run", Number(e.target.value));
        this._datiAiModuli();
      });
      this.querySelector(".ce-prepara").addEventListener("click", () => {
        const c0 = this._config;
        const scelta = this.querySelector(".ce-capisci-ent");
        const entita = (scelta && scelta.value) || (c0.live && c0.live.state_entity) || c0.power_entity;
        if (!entita) {
          this._esito.textContent = "Scegli prima un'entita' dell'apparecchio.";
          return;
        }
        const pronta = preparaElettrodomestico(this._hass, { entity: entita, name: c0.name, icona: c0.artwork });
        const tieni = {};
        ["name", "righe", "nomi_righe", "notification_path", "grid_options", "casa_misura"].forEach((k) => {
          if (c0[k] !== undefined) tieni[k] = c0[k];
        });
        this._config = { type: c0.type, ...pronta, ...tieni };
        this._emetti();
        this._datiAiModuli();
        this._disegnaRighe();
        const c = this._config;
        const trovate = ["power_entity", "interruttore", "interruttore_usb", "cycle_sensor"].filter((x) => c[x]);
        if (c.ciclo_live) trovate.push("ciclo in corso");
        if (c.live && c.live.state_entity) trovate.push("stato");
        this._esito.textContent =
          "Trovato: " + trovate.join(", ") + ". Disegno scelto: \u00ab" + c.artwork + "\u00bb.";
      });
    }
    if (this._hass) (this._moduli || []).forEach((f) => { f.hass = this._hass; });
    const azzera = this.querySelector(".ce-azzera");
    if (azzera) azzera.hidden = !this._config.reset_script;
    this._disegnaKwh();
    this._disegnaPrezzo();
    this._disegnaTasti();
    this._datiAiModuli();
    this._disegnaRighe();
    this._riassunti();
  }
}
