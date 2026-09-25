// L'editor a clic di custom:casa-elettrodomestico.
// Sopra: le impostazioni. In mezzo: le righe dell'Ultimo ciclo (spunta,
// trascina, rinomina). Sotto: "Prepara da solo", che ricompila la scheda
// partendo dalla presa (o dallo stato) come fa la voce del Tocco.

import { RIGHE_CICLO } from './elettro-elettrodomestico.js';
import { VERSIONE } from './versione.js';
import { preparaElettrodomestico, trovaPerDisegno } from './elettro-prepara.js';
import { quali_cancellare, STILE_EDITOR, disegnaRighe } from './elettro-righe-editor.js';
import { cancellaQuesti, scollegaEntita, creaCicli, prezzoDellaCasa, INGREDIENTE, creaSensoriElettrodomestico, cancellaSensoriElettrodomestico, aiutantiVeri, prezziDelKWh } from './elettro-crea.js';

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
  name: "Nome della scheda",
  artwork: "Disegno",
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
  { name: "g_tasti", type: "expandable", flatten: true, title: "Tasti di accensione", schema: [
    { name: "interruttore", selector: { entity: {} } },
    { name: "interruttore_usb", selector: { entity: {} } },
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
const SCHEMA_SEMPLICE = ["artwork", "power_entity", "interruttore", "name"]
  .map((n) => SCHEMA_TUTTO.find((x) => x.name === n))
  .filter(Boolean);


export class CasaElettrodomesticoEditor extends HTMLElement {
  setConfig(config) {
    this._config = { ...config };
    this._disegna();
  }

  set hass(hass) {
    this._hass = hass;
    if (this._form) this._form.hass = hass;
  }

  _emetti() {
    this.dispatchEvent(new CustomEvent("config-changed", {
      detail: { config: this._config }, bubbles: true, composed: true,
    }));
  }

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
      vivo_fase: (c.ciclo_live && c.ciclo_live.phase_entity) || "" };
  }

  // i colori si scrivono in esadecimale (#1b2430), il selettore di Home
  // Assistant invece parla in tre numeri: qui li traduco avanti e indietro
  _versoHex(v) {
    if (!Array.isArray(v) || v.length < 3) return v || "";
    return "#" + v.slice(0, 3).map((n) => Number(n).toString(16).padStart(2, "0")).join("");
  }

  _versoRgb(v) {
    const m = /^#?([0-9a-f]{6})$/i.exec(String(v || ""));
    if (!m) return undefined;
    const n = parseInt(m[1], 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
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
    const sel = this.querySelector(".ce-capisci-ent");
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
    box.innerHTML = barre.length ? "" : "<div class='ce-aiuto'>Nessuna barra in piu'.</div>";
    barre.forEach((b, i) => {
      const riga = document.createElement("div");
      riga.className = "ce-riga";
      riga.innerHTML = `<span class="ent">${b.entity}</span>`;
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

  // il contatore in kWh dello stesso dispositivo della presa, se c'e'
  _kWhDelDispositivo() {
    const h = this._hass;
    const potenza = this._config.power_entity;
    if (!h || !potenza) return "";
    const reg = h.entities || {};
    const dev = reg[potenza] && reg[potenza].device_id;
    if (!dev) return "";
    return Object.keys(reg).find((k) => reg[k].device_id === dev && k.startsWith("sensor.")
      && ((h.states[k] || {}).attributes || {}).device_class === "energy") || "";
  }

  _disegnaRighe() {
    if (!this._righe) return;
    disegnaRighe(this._righe, RIGHE_CICLO, this._config, (c) => {
      this._config = c;
      this._emetti();
      this._disegnaRighe();
    this._disegnaBarre();
    this.querySelectorAll(".ce-v-energia").forEach((x) => {
      if (x._agganciato) return;
      x._agganciato = true;
      x.addEventListener("input", () => this._aggiornaTotale());
    });
    const sceglitore = this.querySelector(".ce-capisci-ent");
    if (sceglitore) sceglitore.hass = this._hass;
    });
  }

  // le scelte del riquadro "Crea i sensori base" sono configurazione: le scrivo
  // subito, se no Home Assistant non accende il tasto Salva
  _scriviScelta(chiave, valore) {
    const c = { ...this._config };
    if (valore === "" || valore === undefined || valore === null || (typeof valore === "number" && !isFinite(valore))) {
      delete c[chiave];
    } else c[chiave] = valore;
    this._config = c;
    this._emetti();
  }

  _nomeDi(eid) {
    const st = this._hass && this._hass.states[eid];
    return st ? String(st.attributes.friendly_name || eid) : eid;
  }

  // i sensori in kWh che potrebbero essere di questo elettrodomestico
  // la tendina dei prezzi: uno per ogni aiutante in \u20ac/kWh che hai in casa
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

  // Il contrario del tasto qui sopra: butta via gli aiutanti che questa
  // scheda si e' fatta creare. Prima te li fa vedere uno per uno.
  async _cancellaSensori() {
    const elenco = (await aiutantiVeri(this._hass, this._config))
      .filter((x) => !String(x.entity).startsWith("input_number."));
    this._esito.hidden = false;
    this._esito.classList.remove("male");
    if (!elenco.length) {
      this._esito.textContent = "Questa scheda non ha aiutanti da cancellare.";
      return;
    }
    this._esito.textContent = "";
    // il riquadro con le caselline: scegli tu quali buttare
    this._esito.hidden = false;
    quali_cancellare(this._esito, elenco, this._hass, async (scelti) => {
      const tasto = this.querySelector(".ce-cancella");
      if (tasto) tasto.disabled = true;
      this._esito.hidden = false;
      this._esito.textContent = "";
      try {
        const esito = await cancellaQuesti(this._hass, scelti,
          (m) => { this._esito.textContent += m + "\n"; });
        let c = scollegaEntita(this._config, scelti.map((x) => x.entity));
        const memoria = { ...(this._config.helper_memoria || {}), ...(esito.memoria || {}) };
        if (Object.keys(memoria).length) c.helper_memoria = memoria;
        this._config = c;
        this._emetti();
        this._form.data = this._datiForm();
        this._esito.textContent += "Fatto: " + esito.cancellati + " cancellati. "
          + "I valori me li sono segnati: se li rifai ripartono da li'.";
      } catch (e) {
        this._esito.classList.add("male");
        this._esito.textContent = "Non ce l'ho fatta: " + (e && e.message ? e.message : e);
      } finally {
        if (tasto) tasto.disabled = false;
      }
    });
  }

  async _creaSensori() {
    const tasto = this.querySelector(".ce-crea");
    const potenza = this._config.power_entity;
    if (!potenza) { this._dillo("Prima scegli la presa che misura i Watt.", true); return; }
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
      this._form.data = this._datiForm();
      this._dillo("Le statistiche sono agganciate. Salva e chiudi.");
    } catch (e) {
      this._dillo("Non ce l'ho fatta: " + (e && e.message ? e.message : e), true);
    }
    tasto.disabled = false;
  }

  _dillo(testo, male) {
    if (!this._esito) return;
    this._esito.hidden = false;
    if (male) this._esito.classList.add("male");
    this._esito.textContent += (this._esito.textContent ? "\n" : "") + testo;
    // il riquadro sta in fondo e resta attaccato: se sei piu' su, ti ci porto
    try { this._esito.scrollIntoView({ block: "nearest" }); } catch (e) { /* vecchi browser */ }
  }

  _disegna() {
    if (!this._costruito) {
      this._costruito = true;
      this.innerHTML = `<style>${STILE_EDITOR}</style><label class="ce-riga ce-tutto-riga"><input type="checkbox" class="ce-tutto">
          <span>Mostra tutte le impostazioni (soglie, barre, ciclo in corso, colori)</span></label>
        <div class="ce-versione">casa-elettrodomestico \u00b7 casa-tile v${VERSIONE}</div>
        <div class="ce-form"></div>
        <div class="ce-sez">
          <div class="ce-tit">Come si fa, in tre mosse</div>
          <div class="ce-aiuto">
            <b>1.</b> Qui sotto scegli <b>una</b> entita' dell'apparecchio e premi <b>Compila da solo</b>:
            riempio io quello che trovo.<br>
            <b>2.</b> Guarda l'<b>anteprima a destra</b>. Quello che vedi e' quello che avrai. Se un numero
            dice "&mdash;", apri il cassetto che lo riguarda (sono qui sopra, chiusi) e scegli il sensore.<br>
            <b>3.</b> Se i contatori non esistono ancora, in fondo c'e' <b>Crea statistiche e costi</b>:
            te li creo io e poi li aggancio.<br>
            Il resto e' facoltativo: tasti, barre in piu', colori. Se non li tocchi, non compaiono.
          </div>
        </div>
        <div class="ce-sez">
          <div class="ce-tit">1. Capisci da solo l'apparecchio</div>
          <div class="ce-aiuto">Scegli <b>una qualsiasi</b> entita' dell'apparecchio - la presa, l'interruttore,
            lo stato - e premi il tasto. Guardo tutte le altre entita' dello <b>stesso dispositivo</b> e riempio
            io: i <b>watt</b>, lo <b>stato</b>, l'<b>interruttore</b> e quello <b>USB</b>, i sensori del
            <b>ciclo in corso</b> e il <b>disegno</b> che mi sembra giusto dal nome.
            Niente e' definitivo: tutto quello che trovo si cambia qui sotto, disegno compreso.</div>
          <div class="ce-riga"><span class="ent">Entita' da cui partire</span><ha-entity-picker class="ce-capisci-ent" allow-custom-entity></ha-entity-picker></div>
          <button type="button" class="ce-prepara">Compila da solo</button>
        </div>
        
        <details class="ce-sez"><summary class="ce-tit">Due modi di contare: scegli il tuo</summary>
          <div class="ce-aiuto">Questa scheda va bene per <b>tutti e due</b> i casi, e capisce da sola quale
            e' il tuo da quello che compili:<br>
            &bull; <b>Ha dei cicli</b> (lavatrice, lavastoviglie, forno): dagli il <i>sensore dell'ultimo ciclo</i>
            e il riquadro fa vedere <i>fine, durata, consumo e costo</i> dell'ultimo lavaggio.<br>
            &bull; <b>Sta sempre acceso</b> (una presa, un PC, un frigo): lascia stare il ciclo e dagli i
            <i>quattro sensori dei kWh e dei costi</i> qui sopra; il riquadro diventa <b>Consumi</b> e fa
            vedere oggi e il mese. Le righe si spuntano qui sotto.</div>
        </details>
        <details class="ce-sez"><summary class="ce-tit">A cosa servono i tasti di accensione</summary>
          <div class="ce-aiuto">I due campi <b>Tasto \u23fb</b> e <b>USB</b> qui sopra mettono un tastino tondo
            nella barra in alto della scheda, accanto all'ingranaggio. Premuto accende o spegne,
            e resta <b>verde</b> finche' l'apparecchio e' acceso. Lasciali vuoti e il tasto non compare.
            Va bene qualsiasi cosa si accenda: presa, luce, ventola, deumidificatore.</div>
        </details>
        <details class="ce-sez"><summary class="ce-tit">Nomi delle barre in piu'</summary>
          <div class="ce-aiuto">Il nome e il fondo scala (W) di ogni barra che hai scelto nel cassetto
            <i>Seconda barra</i>. Servono per far vedere insieme piu' misure: per esempio quanto prende
            dalla rete e quanto manda a casa.</div>
          <div class="ce-barre"></div>
        </details>
        <div class="ce-sez">
          <div class="ce-tit">Righe dell'«Ultimo ciclo»</div>
          <div class="ce-aiuto">Spunta quelle da vedere, trascinale dalla maniglia ⠿ per metterle
            in ordine e, se vuoi, scrivi il nome e scegli il colore che preferisci (vuoto = quelli di serie; il tasto ↺ rimette il colore originale).</div>
          <div class="ce-righe"></div>
        </div>
        <details class="ce-sez" open><summary class="ce-tit">Crea i sensori base (se non ce li hai)</summary>
          <div class="ce-aiuto">A un apparecchio o a una presa servono <b>due aiutanti</b>: i kWh di oggi
            e i kWh del mese. Il <b>costo non ha un sensore</b>: sono i kWh per il prezzo, e il conto lo fa
            la scheda mentre lo guardi. Il prezzo lo scrivi una volta sola nella scheda <i>Energia Casa</i>,
            che e' la principale: qui vale la <b>sola energia</b>, se no le tasse le paghi due volte.<br>
            Se la presa non conta i kWh da sola ne serve un terzo, che li calcola dai Watt.</div>
          <div class="ce-riga"><span class="ent">Sensore dei kWh</span><ha-entity-picker class="ce-kwh-pick" allow-custom-entity></ha-entity-picker></div>
          <div class="ce-aiuto ce-nota-kwh"></div>
          <div class="ce-riga"><span class="ent ce-soglia-eti">Sopra questi W sta lavorando</span><input type="number" class="ce-soglia max" step="1" min="1" value="10"> <span class="ce-soglia-un">W</span></div>
          <div class="ce-riga"><span class="ent">Prezzo dei sensori che creo</span><select class="ce-prezzo-ent"></select><input type="number" class="ce-prezzo max" step="0.001" min="0" value="0.25" hidden></div>
          <div class="ce-riga ce-voci" hidden><span class="ent">Quanto paghi l'energia, &euro;/kWh</span><input type="number" class="ce-v-energia max" step="0.0001" min="0" placeholder="0.1657"></div>
          <div class="ce-riga ce-voci ce-voci-nota" hidden><span class="ent">Qui va la <b>sola energia</b>. Rete, accise, IVA e quota fissa le conta gia' la scheda grande della casa.</span></div>
          <div class="ce-riga"><label><input type="checkbox" class="ce-cicli">
            <span>Segui i <b>cicli</b>: quando finisce, quanto e' durato, quanto ha consumato
            (6 aiutanti e 1 automazione, una volta sola)</span></label></div>
          <div class="ce-riga"><label><input type="checkbox" class="ce-tempi">
            <span>Conta anche <b>quante volte parte</b> e <b>per quanto</b>
            (2 aiutanti per ogni periodo, piu' la soglia)</span></label></div>
          <div class="ce-riga"><span class="ent">Periodi da creare</span>
            <label><input type="checkbox" class="ce-p-oggi" checked> oggi</label>
            <label><input type="checkbox" class="ce-p-settimana"> settimana</label>
            <label><input type="checkbox" class="ce-p-mese" checked> mese</label></div>
          <button type="button" class="ce-prepara ce-crea">Crea statistiche e costi</button>
          <button type="button" class="ce-prepara ce-cancella">Cancella gli aiutanti di questa scheda</button>
        </details>
        <div class="ce-esito" hidden></div>`;
      const form = document.createElement("ha-form");
      form.schema = this._tutto ? SCHEMA_TUTTO : SCHEMA_SEMPLICE;
      form.computeLabel = (x) => x.title || ETICHETTE[x.name] || x.name;
      const spunta = this.querySelector(".ce-tutto");
      if (spunta) {
        spunta.checked = !!this._tutto;
        spunta.addEventListener("change", () => {
          this._tutto = spunta.checked;
          form.schema = this._tutto ? SCHEMA_TUTTO : SCHEMA_SEMPLICE;
          form.data = this._datiForm();
        });
      }
      form.addEventListener("value-changed", (e) => {
        e.stopPropagation();
        this._cambiatoForm(e.detail.value || {});
      });
      this.querySelector(".ce-form").appendChild(form);
      this._form = form;
      this._righe = this.querySelector(".ce-righe");
      this._esito = this.querySelector(".ce-esito");
      this.querySelector(".ce-crea").addEventListener("click", () => this._creaSensori());
      this.querySelector(".ce-cancella").addEventListener("click", () => this._cancellaSensori());
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
        this._form.data = this._datiForm();
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
        this._form.data = this._datiForm();
        this._disegnaRighe();
        const c = this._config;
        const trovate = ["power_entity", "interruttore", "interruttore_usb", "cycle_sensor"].filter((x) => c[x]);
        if (c.ciclo_live) trovate.push("ciclo in corso");
        if (c.live && c.live.state_entity) trovate.push("stato");
        this._esito.textContent =
          "Trovato: " + trovate.join(", ") + ". Disegno scelto: \u00ab" + c.artwork + "\u00bb.";
      });
    }
    if (this._hass) this._form.hass = this._hass;
    this._disegnaKwh();
    this._disegnaPrezzo();
    this._form.data = this._datiForm();
    this._disegnaRighe();
  }
}
