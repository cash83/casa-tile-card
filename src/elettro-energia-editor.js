// L'editor a clic di custom:casa-energia.
// Sopra: le impostazioni (ha-form di Home Assistant). Sotto: le righe del
// riquadro Oggi, da accendere/spegnere, trascinare in ordine e rinominare.
// I circuiti si scelgono come elenco di entita': il nome lo prendo dal
// sensore, e chi li ha gia' configurati a mano li ritrova come erano.

import { RIGHE_OGGI } from './elettro-energia.js';
import { VERSIONE } from './versione.js';
import { ESCLUSI_DI_SERIE } from './elettro-prepara.js';
import { quali_cancellare, STILE_EDITOR, disegnaRighe } from './elettro-righe-editor.js';
import { cancellaQuesti, scollegaEntita, creaFonte, creaRisparmio, ID_TOTALE, prezzoDellaCasa, aiutantiVeri, idDellaVoce, VOCI_TARIFFA, scriviTariffa, INGREDIENTE, creaSensoriBase, prezziDelKWh } from './elettro-crea.js';

// quello che si legge sotto al campo, per i tre che sembrano vuoti e rotti
const AIUTI = {
  top_exclude: "Vuoto = valgono le parole di serie (batterie, inverter, fotovoltaico, solar, grid...): "
    + ESCLUSI_DI_SERIE.slice(0, 8).join(", ") + "...",
  top_include: "Vuoto = nessuna forzatura. Serve solo per una presa che una parola qui sopra escluderebbe.",
  top_min_w: "Vuoto = 5 W. Sotto questa soglia un apparecchio non vale come 'top'.",
  unmeasured_label: "Vuoto = «Non misurato»: quanto consuma la casa fuori dalle prese che misurano.",
};

// il campo tiene una lista: quello che c'era prima (un'entita' sola) vale uguale
const lista = (v) => (Array.isArray(v) ? v : (v ? [v] : []));

const ETICHETTE = {
  name: "Nome della scheda",
  power_entity: "Potenza della casa (W) - obbligatoria",
  artwork: "Disegno",
  interruttore: "Tasto \u23fb nella barra in alto: cosa accende e spegne",
  interruttore_usb: "Secondo tasto per le prese USB (se ci sono)",
  oggi_energia: "Contatore dei kWh di OGGI (aiutante «contatore di utenza», ciclo giornaliero)",
  oggi_costo: "Sensore degli EURO di oggi (i kWh per il prezzo)",
  mese_energia: "Contatore dei kWh del MESE (stesso aiutante, ciclo mensile)",
  mese_costo: "Sensore degli EURO del mese",
  soglia_entity: "Entit\u00e0 con la soglia d'allarme (facoltativa)",
  switches: "Interruttori da mettere nelle impostazioni",
  max_power: "Fondo scala della barra (W, es. 3300 con 3 kW)",
  circuiti: "Circuiti da mostrare con la barra (prese o sensori in W)",
  top_auto: "Top consumo automatico (cerca da solo tutte le prese che misurano)",
  top_min_w: "Sotto questi W non e' «top»",
  unmeasured_label: "Nome della voce «Non misurato»",
  top_include: "Prese da contare sempre (anche se escluse qui sotto)",
  top_exclude: "Parole che fanno escludere un sensore (batterie, inverter...)",
  bill_today: "Conto di oggi voce per voce (es. sensor.costi_luce_oggi)",
  bill_month: "Conto del mese voce per voce (es. sensor.costi_luce_mese)",
  bolletta_energia: "Contatore dei kWh del periodo della bolletta (bimestre)",
  bolletta_costo: "Contatore degli euro dello stesso periodo",
  notification_path: "Pagina delle notifiche (facoltativa, es. /lovelace/notifiche)",
  finestra_sfondo: "Tinta della finestra del pop-up",
  finestra_trasparenza: "Trasparenza della finestra",
  finestra_scritta: "Colore delle scritte nella finestra",
  velo_scuro: "Quanto scurisce quello che c'e' dietro",
  velo_sfoca: "Quanto sfoca quello che c'e' dietro",
};

const SCHEMA_TUTTO = [
  { name: "name", selector: { text: {} } },
  { name: "power_entity", required: true, selector: { entity: { domain: "sensor", device_class: "power" } } },
  { name: "artwork", selector: { select: { mode: "dropdown", options: [
    { value: "washer", label: "Lavatrice" },
    { value: "dishwasher", label: "Lavastoviglie" },
    { value: "dryer", label: "Asciugatrice" },
    { value: "oven", label: "Forno" },
    { value: "microonde", label: "Microonde" },
    { value: "frigorifero", label: "Frigorifero" },
    { value: "dehumidifier", label: "Deumidificatore" },
    { value: "condizionatore", label: "Condizionatore" },
    { value: "ventilatore", label: "Ventilatore" },
    { value: "boiler", label: "Boiler / scaldabagno" },
    { value: "luce", label: "Luce" },
    { value: "lampada", label: "Lampada" },
    { value: "tv", label: "Televisore" },
    { value: "pc_torre", label: "PC (torre)" },
    { value: "pc_monitor", label: "PC (monitor)" },
    { value: "minipc", label: "Mini PC (Home Assistant)" },
    { value: "presa", label: "Presa smart" },
    { value: "ciabatta", label: "Ciabatta / multipresa" },
    { value: "powerstation", label: "Powerstation" },
    { value: "energy", label: "Contatore della luce" },
    { value: "ups", label: "Gruppo di continuita'" },
    { value: "server", label: "Server" },
    { value: "nas", label: "NAS" },
    { value: "fritzbox", label: "Router" },
    { value: "proxmox", label: "Proxmox" }] } } },
  { name: "g_tasti", type: "expandable", flatten: true, title: "Tasti e interruttori", schema: [
    { name: "interruttore", selector: { entity: {} } },
    { name: "interruttore_usb", selector: { entity: {} } },
    { name: "switches", selector: { entity: { multiple: true } } },
    { name: "soglia_entity", selector: { entity: {} } },
  ] },
  { name: "g_barre", type: "expandable", flatten: true, title: "Barre dei circuiti", schema: [
    { name: "circuiti", selector: { entity: { multiple: true, domain: "sensor", device_class: "power" } } },
    { name: "max_power", selector: { number: { min: 500, max: 30000, step: 100, mode: "box", unit_of_measurement: "W" } } },
  ] },
  { name: "g_top", type: "expandable", flatten: true, title: "Top consumo (chi consuma di piu')", schema: [
    { name: "top_auto", selector: { boolean: {} } },
    { name: "top_min_w", selector: { number: { min: 0, max: 1000, step: 1, mode: "box", unit_of_measurement: "W" } } },
    { name: "top_include", selector: { entity: { multiple: true, domain: "sensor" } } },
    { name: "top_exclude", selector: { text: { multiple: true } } },
    { name: "unmeasured_label", selector: { text: {} } },
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

// appena apri vedi solo l'essenziale; il resto con l'interruttore
const SCHEMA_SEMPLICE = ["name", "power_entity", "artwork"]
  .map((n) => SCHEMA_TUTTO.find((x) => x.name === n))
  .filter(Boolean);


export class CasaEnergiaEditor extends HTMLElement {
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

  // i quattro sensori dei conti stanno dentro `periods`: li tiro fuori per
  // nome, cosi' l'ordine nell'elenco non conta
  _periodo(nome) {
    return (this._config.periods || []).find(
      (x) => String(x.label || "").trim().toLowerCase() === nome) || {};
  }

  _datiForm() {
    const c = this._config;
    return { ...c,
      oggi_energia: this._periodo("oggi").energy || "",
      oggi_costo: this._periodo("oggi").cost || "",
      mese_energia: this._periodo("mese").energy || "",
      mese_costo: this._periodo("mese").cost || "",
      finestra_sfondo: this._versoRgb(c.finestra_sfondo),
      finestra_scritta: this._versoRgb(c.finestra_scritta), top_auto: c.top_auto !== false && c.top_auto !== undefined ? c.top_auto : false,
      switches: (c.switches || []).map((x) => x && x.entity).filter(Boolean),
      circuiti: (c.circuits || []).map((x) => x && x.entity).filter(Boolean) };
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
    const n = st ? String(st.attributes.friendly_name || eid) : eid;
    return n.replace(/\s+(potenza|power)\s*$/i, "").replace(/\s{2,}/g, " ").trim();
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

  // rimette i quattro sensori dentro periods/periods_prev. "Ieri" e "mese
  // scorso" non sono altri sensori: sono l'attributo last_period di questi.
  _rimettiPeriodi(c, v) {
    const chiavi = ["oggi_energia", "oggi_costo", "mese_energia", "mese_costo"];
    if (!chiavi.some((k) => k in v)) return;
    const val = (k) => (k in v ? v[k] : (this._periodo(k.split("_")[0])[k.split("_")[1] === "energia" ? "energy" : "cost"] || ""));
    const oggiE = val("oggi_energia"), oggiC = val("oggi_costo");
    const meseE = val("mese_energia"), meseC = val("mese_costo");
    const periodi = [];
    if (oggiE || oggiC) periodi.push({ label: "Oggi", energy: oggiE, cost: oggiC });
    if (meseE || meseC) periodi.push({ label: "Mese", energy: meseE, cost: meseC });
    const prima = [];
    if (oggiE || oggiC) prima.push({ label: "Ieri", energy: oggiE, energy_attr: "last_period", cost: oggiC, cost_attr: "last_period" });
    if (meseE || meseC) prima.push({ label: "Mese scorso", energy: meseE, energy_attr: "last_period", cost: meseC, cost_attr: "last_period" });
    // gli altri periodi che l'utente si e' scritto a mano restano dove sono
    const suoi = (c.periods || []).filter((x) => !["oggi", "mese"].includes(String(x.label || "").trim().toLowerCase()));
    const suoiPrima = (c.periods_prev || []).filter((x) => !["ieri", "mese scorso"].includes(String(x.label || "").trim().toLowerCase()));
    if (periodi.length) c.periods = periodi.concat(suoi); else delete c.periods;
    if (prima.length) c.periods_prev = prima.concat(suoiPrima); else delete c.periods_prev;
    ["oggi_energia", "oggi_costo", "mese_energia", "mese_costo"].forEach((k) => delete c[k]);
  }

  _cambiatoForm(v) {
    // le terne del selettore tornano esadecimali
    ["finestra_sfondo", "finestra_scritta"].forEach((k) => {
      if (k in v) v[k] = this._versoHex(v[k]);
    });
    const c = { ...this._config };
    Object.keys(v).forEach((k) => {
      if (k === "circuiti" || k === "switches") return;
      if (v[k] === "" || v[k] === undefined || v[k] === null) delete c[k];
      else c[k] = v[k];
    });
    // i circuiti: tengo quelli gia' configurati (nome e fondo scala scelti a
    // mano), aggiungo i nuovi col nome del sensore
    const prima = {};
    (this._config.circuits || []).forEach((x) => { if (x && x.entity) prima[x.entity] = x; });
    c.circuits = (v.circuiti || []).map((eid) => prima[eid] || { label: this._nomeDi(eid), entity: eid, max: 2500 });
    // gli interruttori del pop-up: la scheda li vuole come {entity, label}
    const primaSw = {};
    (this._config.switches || []).forEach((x) => { if (x && x.entity) primaSw[x.entity] = x; });
    if (v.switches && v.switches.length) {
      c.switches = v.switches.map((eid) => primaSw[eid] || { label: this._nomeDi(eid), entity: eid });
    } else delete c.switches;
    this._rimettiPeriodi(c, v);
    this._config = c;
    this._emetti();
  }

  _disegnaRighe() {
    if (!this._righe) return;
    disegnaRighe(this._righe, RIGHE_OGGI, this._config, (c) => {
      this._config = c;
      this._emetti();
      this._disegnaRighe();
    });
    { const v = this.querySelector(".ce-barre-vive");
      if (v) v.checked = !!this._config.barre_vive;
      const q = this.querySelector(".ce-barre-quante");
      if (q && !q.dataset.tocco) q.value = this._config.barre_quante || 6;
      this._mostraQuante(); }
    { const sc = this.querySelector(".ce-barra-nuova");
      if (sc && this._hass) {
        sc.hass = this._hass;
        sc.includeDomains = ["sensor"];
        sc.entityFilter = (e) => {
          const id = typeof e === "string" ? e : e.entity_id;
          const a = ((this._hass.states[id] || {}).attributes) || {};
          const u = String(a.unit_of_measurement || "").toLowerCase();
          return a.device_class === "power" && (u === "w" || u === "kw");
        };
      } }
    { const o = this.querySelector(".ce-barre-ordine");
      if (o) o.checked = this._config.barre_in_ordine !== false; }
    this._disegnaCircuiti();
  }

  // i nomi e il fondo scala delle barre dei circuiti
  _disegnaCircuiti() {
    const box = this._circuiti;
    if (!box) return;
    const circ = this._config.circuits || [];
    box.innerHTML = circ.length ? "" : "<div class='ce-aiuto'>Nessun circuito: sceglili qui sopra.</div>";
    circ.forEach((c, k) => {
      const riga = document.createElement("div");
      riga.className = "ce-riga";
      riga.draggable = true;
      riga.innerHTML = `<span class="ce-presa" title="Trascina per spostarla">\u2807</span>`
        + `<span class="ent"></span><input type="text" class="nome"><input type="number" class="max" min="100" step="100" title="Fondo scala (W)"> W`
        + `<button type="button" class="ce-via" title="Togli questa barra">\u00d7</button>`;
      riga.querySelector(".ent").textContent = this._nomeDi(c.entity);
      // trascinare per cambiare l'ordine
      riga.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", String(k));
        riga.classList.add("ce-presa-su");
      });
      riga.addEventListener("dragend", () => riga.classList.remove("ce-presa-su"));
      riga.addEventListener("dragover", (e) => e.preventDefault());
      riga.addEventListener("drop", (e) => {
        e.preventDefault();
        const da = Number(e.dataTransfer.getData("text/plain"));
        if (!Number.isFinite(da) || da === k) return;
        const n = [...(this._config.circuits || [])];
        const [preso] = n.splice(da, 1);
        n.splice(k, 0, preso);
        this._config = { ...this._config, circuits: n };
        this._emetti();
        this._disegnaCircuiti();
      });
      riga.querySelector(".ce-via").addEventListener("click", () => {
        const n = [...(this._config.circuits || [])];
        n.splice(k, 1);
        this._config = { ...this._config, circuits: n };
        this._emetti();
        this._disegnaCircuiti();
      });
      const nome = riga.querySelector(".nome");
      nome.value = c.label || "";
      nome.placeholder = this._nomeDi(c.entity);
      const max = riga.querySelector(".max");
      max.value = c.max || 2500;
      const scrivi = () => {
        const n = [...(this._config.circuits || [])];
        n[k] = { ...n[k], label: nome.value.trim() || this._nomeDi(c.entity), max: Number(max.value) || 2500 };
        this._config = { ...this._config, circuits: n };
        this._emetti();
      };
      nome.addEventListener("change", scrivi);
      max.addEventListener("change", scrivi);
      box.appendChild(riga);
    });
  }

  // la tendina con i sensori dei kWh (energia) che ci sono in casa
  // il prezzo in €/kWh che c'e' gia' in casa: e' lui che comanda
  // la tendina dei prezzi in \u20ac/kWh che hai in casa (il totale per primo:
  // la casa paga tutto compreso, gli elettrodomestici di solito no)
  _disegnaPrezzo() {
    const sel = this.querySelector(".ce-prezzo-ent");
    const campo = this.querySelector(".ce-prezzo");
    if (!sel || !campo) return;
    const elenco = prezziDelKWh(this._hass);
    const scelto = sel.value;
    sel.hidden = !elenco.length;
    campo.hidden = !!elenco.length;
    sel.innerHTML = "";
    elenco.filter((id) => !INGREDIENTE.test(id)).forEach((id) => {
      const st = this._hass.states[id];
      const o = document.createElement("option");
      o.value = id;
      const tutto = Number(st.state) >= 0.20;
      o.textContent = (st.attributes.friendly_name || id) + " \u2014 " + st.state + " \u20ac/kWh"
        + (tutto ? "  (tutto compreso \u2014 questo)" : "  (sola energia)");
      sel.appendChild(o);
    });
    const mio = this._config.prezzo_entita;
    if (scelto && elenco.includes(scelto)) sel.value = scelto;
    else if (mio && elenco.includes(mio)) sel.value = mio;
  }

  _kWhPossibili() {
    const st = (this._hass && this._hass.states) || {};
    return Object.keys(st).filter((id) => {
      if (!id.startsWith("sensor.")) return false;
      const a = st[id].attributes || {};
      return a.device_class === "energy" && String(a.unit_of_measurement || "").toLowerCase() === "kwh"
        && (a.state_class === "total" || a.state_class === "total_increasing");
    }).sort();
  }

  // I pannelli: va bene sia un sensore in kWh sia uno in Watt (i kWh me li
  // calcolo io). Metto davanti quelli che sembrano solari.
  _disegnaBatteria() {
    const sel = this.querySelector(".ce-batteria-pick");
    if (!sel || !this._hass) return;
    sel.hass = this._hass;
    const st = this._hass.states;
    sel.includeDomains = ["sensor"];
    sel.entityFilter = (e) => {
      const id = typeof e === "string" ? e : e.entity_id;
      const a = (st[id] || {}).attributes || {};
      const u = String(a.unit_of_measurement || "").toLowerCase();
      return (a.device_class === "power" && (u === "w" || u === "kw"))
        || (a.device_class === "energy" && (u === "kwh" || u === "wh"));
    };
    if (!sel._agganciato) {
      sel._agganciato = true;
      sel.addEventListener("value-changed", (ev) => {
        ev.stopPropagation();
        this._scriviScelta("batteria_entita", ev.detail.value || "");
      });
    }
    sel.value = lista(this._config.batteria_entita);
  }

  _disegnaPannelli() {
    const sel = this.querySelector(".ce-pannelli-pick");
    if (!sel || !this._hass) return;
    sel.hass = this._hass;
    const st = this._hass.states;
    const buono = (id) => {
      const a = (st[id] || {}).attributes || {};
      const u = String(a.unit_of_measurement || "").toLowerCase();
      return (a.device_class === "power" && (u === "w" || u === "kw"))
        || (a.device_class === "energy" && (u === "kwh" || u === "wh"));
    };
    sel.includeDomains = ["sensor"];
    sel.entityFilter = (e) => buono(typeof e === "string" ? e : e.entity_id);
    if (!sel._agganciato) {
      sel._agganciato = true;
      sel.addEventListener("value-changed", (ev) => {
        ev.stopPropagation();
        this._scriviScelta("pannelli_entita", ev.detail.value || "");
      });
    }
    sel.value = lista(this._config.pannelli_entita);
  }

  _disegnaKwh() {
    const sel = this.querySelector(".ce-kwh-pick");
    if (!sel) return;
    if (this._hass) sel.hass = this._hass;
    const buoni = this._kWhPossibili();
    sel.includeDomains = ["sensor"];
    sel.entityFilter = (e) => buoni.includes(typeof e === "string" ? e : e.entity_id);
    if (!sel._agganciato) {
      sel._agganciato = true;
      sel.addEventListener("value-changed", (ev) => {
        ev.stopPropagation();
        this._scriviScelta("energia_kwh", ev.detail.value || "");
      });
    }
    const mio = this._config.energia_kwh;
    const dallaPresa = String(this._config.power_entity || "")
      .replace(/_power$/, "_energy").replace(/_potenza$/, "_energia");
    sel.value = mio || (buoni.includes(dallaPresa) ? dallaPresa : "");
  }

  // i campi della tariffa partono da quello che gli aiutanti dicono adesso:
  // cosi' vedi il prezzo che stai usando e lo puoi riscrivere a mano
  _disegnaTariffa() {
    VOCI_TARIFFA.forEach((v) => {
      const campo = this.querySelector(".ce-t-" + v.chiave);
      if (!campo || campo.dataset.tocco) return;
      const st = this._hass && this._hass.states[idDellaVoce(this._hass, v)];
      if (st && !["unknown", "unavailable"].includes(st.state)) campo.value = Number(st.state);
      campo.addEventListener("input", () => { campo.dataset.tocco = "1"; }, { once: true });
    });
    this._totaleTariffa();
  }

  _totaleTariffa() {
    const n = (c) => Number((this.querySelector(".ce-t-" + c) || {}).value) || 0;
    const t = this.querySelector(".ce-t-totale");
    if (!t) return 0;
    const v = Math.round((n("energia") + n("rete") + n("accise")) * (1 + n("iva") / 100) * 10000) / 10000;
    t.textContent = v ? v.toFixed(4) + " \u20ac/kWh" : "\u2014";
    return v;
  }

  async _scriviTariffa() {
    const esito = this.querySelector(".ce-esito-tariffa");
    const n = (c) => Number((this.querySelector(".ce-t-" + c) || {}).value);
    esito.hidden = false;
    esito.classList.remove("male");
    esito.textContent = "";
    const dillo = (t) => { esito.textContent += (esito.textContent ? "\n" : "") + t; };
    if (!(n("energia") > 0)) {
      esito.classList.add("male");
      esito.textContent = "Scrivi almeno il prezzo dell'energia.";
      return;
    }
    try {
      await scriviTariffa(this._hass, { energia: n("energia"), rete: n("rete"), accise: n("accise"), iva: n("iva"), quota: n("quota") }, dillo);
      dillo("Fatto: adesso tutte le schede leggono questi prezzi.");
      this._disegnaPrezzo();
    } catch (e) {
      esito.classList.add("male");
      dillo("Non ce l'ho fatta: " + (e && e.message ? e.message : e));
    }
  }

  // Butta via i contatori e i costi che questa scheda si e' fatta creare. I
  // prezzi NON si toccano: quelli sono la tariffa, e la usano tutte le schede.
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

  // Le quattro barre proposte guardando la casa: sensori di potenza veri,
  // senza le parole che escludono (le stesse del "top consumo").
  // con "le piu' accese" l'elenco a mano non serve: lo nascondo
  _mostraQuante() {
    const acceso = !!(this.querySelector(".ce-barre-vive") || {}).checked;
    const q = this.querySelector(".ce-quante");
    if (q) q.hidden = !acceso;
    [".ce-barra-nuova", ".ce-barre-ordine", ".ce-barre-auto", ".ce-circuiti"].forEach((sel) => {
      const el = this.querySelector(sel);
      const riga = el && (el.closest(".ce-riga") || el);
      if (riga) riga.style.display = acceso ? "none" : "";
    });
  }

  _proponiBarre() {
    const st = (this._hass || {}).states || {};
    const escl = (this._config.top_exclude || ESCLUSI_DI_SERIE).map((x) => String(x).toLowerCase());
    const buoni = Object.keys(st).filter((id) => {
      if (!id.startsWith("sensor.") || id === this._config.power_entity) return false;
      const a = st[id].attributes || {};
      if (a.device_class !== "power") return false;
      const u = String(a.unit_of_measurement || "").toLowerCase();
      if (u !== "w" && u !== "kw") return false;
      return !escl.some((x) => id.toLowerCase().includes(x));
    });
    if (!buoni.length) {
      window.alert("Non ho trovato prese che misurano i Watt, a parte quelle escluse.");
      return;
    }
    // il fondo scala: il massimo visto di recente, arrotondato in su
    const scala = (v) => {
      const n = Math.max(500, Math.ceil((Number(v) || 0) * 1.3 / 500) * 500);
      return Math.min(3500, n);
    };
    const barre = buoni
      .map((id) => ({
        entity: id,
        live: Number(st[id].state) || 0,
        label: String(st[id].attributes.friendly_name || id)
          .replace(/\s+(potenza|power)\s*$/i, "").replace(/\s{2,}/g, " ").trim(),
      }))
      .sort((a, b) => b.live - a.live)
      .slice(0, 6)
      .map((x) => ({ label: x.label, entity: x.entity, max: scala(x.live || 1000) }));
    this._config = { ...this._config, circuits: barre };
    this._emetti();
    this._disegnaCircuiti();
  }

  async _creaSensori() {
    const tasto = this.querySelector(".ce-crea");
    const sorgente = (this.querySelector(".ce-kwh-pick") || {}).value || this._config.energia_kwh;
    if (!sorgente) { this._dillo("Scegli il sensore dei kWh.", true); return; }
    if (!window.confirm("Creo in Home Assistant i contatori (ora, oggi, settimana, mese) e i costi "
      + "sopra a " + this._nomeDi(sorgente) + "." + "\n" + "Quelli che ci sono gia' li riuso. Vado?")) return;
    tasto.disabled = true;
    this._esito.hidden = false;
    this._esito.classList.remove("male");
    this._esito.textContent = "";
    try {
      const patch = await creaSensoriBase(this._hass, {
        sorgente,
        memoria: this._config.helper_memoria || {},
        // il prezzo e' quello della tariffa qui sopra: per la casa vale il TOTALE,
        // che e' quello che paghi davvero in bolletta
        prezzo_entita: (this._hass.states[ID_TOTALE] ? ID_TOTALE : prezzoDellaCasa(this._hass))
          || this._config.prezzo_entita,
        prezzo: this._totaleTariffa(),
      }, (t) => this._dillo(t));
      this._config = { ...this._config, ...patch };
      // la memoria dei valori, se e' stata usata, si butta (patch la mette a null)
      if (patch.helper_memoria === null) delete this._config.helper_memoria;
      this._emetti();
      this._form.data = this._datiForm();
      // i kWh delle due fonti: pannelli e batteria
      for (const [chiave, sel, nome] of [["pannelli", ".ce-pannelli-pick", "Pannelli energia"],
        ["batteria", ".ce-batteria-pick", "Batteria energia"]]) {
        const ent = lista((this.querySelector(sel) || {}).value || this._config[chiave + "_entita"]);
        if (!ent.length) continue;
        const p = await creaFonte(this._hass, { entita: ent, nome }, (t) => this._dillo(t));
        this._config = { ...this._config, [chiave + "_oggi"]: p.oggi,
          [chiave + "_settimana"]: p.settimana, [chiave + "_mese"]: p.mese,
          [chiave + "_entita"]: ent };
        this._emetti();
      }
      const pannelli = (this.querySelector(".ce-pannelli-pick") || {}).value || this._config.pannelli_entita;
      if (pannelli) {
        const piu = await creaRisparmio(this._hass, {
          pannelli,
          prezzo_entita: this._hass.states[ID_TOTALE] ? ID_TOTALE : prezzoDellaCasa(this._hass),
        }, (t) => this._dillo(t));
        this._config = { ...this._config, ...piu, pannelli_entita: pannelli };
        this._emetti();
      }
      this._dillo("La scheda e' agganciata ai sensori nuovi. Salva e chiudi.");
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
  }

  _disegna() {
    if (!this._costruito) {
      this._costruito = true;
      this.innerHTML = `<style>${STILE_EDITOR}</style><label class="ce-riga ce-tutto-riga"><input type="checkbox" class="ce-tutto">
          <span>Mostra tutte le impostazioni</span></label>
        <div class="ce-versione">casa-energia \u00b7 casa-tile v${VERSIONE}</div>
        <div class="ce-form"></div>
        <div class="ce-sez">
          <div class="ce-tit">I sensori dei conti</div>
          <div class="ce-aiuto">I quattro campi <b>kWh di oggi / euro di oggi / kWh del mese / euro del mese</b>
            vogliono i sensori fatti con gli aiutanti: i due <b>contatori di utenza</b> (uno a ciclo
            <i>giornaliero</i>, uno <i>mensile</i>) sopra al kWh dell'apparecchio, e i due sensori che
            moltiplicano quei kWh per il prezzo. <b>Ieri</b> e <b>mese scorso</b> non vanno messi:
            li legge da solo dal periodo appena chiuso degli stessi contatori.</div>
        </div>
        <div class="ce-sez">
          <div class="ce-tit">Tasti di accensione</div>
          <div class="ce-aiuto">I due campi <b>Tasto \u23fb</b> e <b>USB</b> qui sopra mettono un tastino tondo
            nella barra in alto della scheda, accanto all'ingranaggio. Premuto accende o spegne,
            e resta <b>verde</b> finche' l'apparecchio e' acceso. Lasciali vuoti e il tasto non compare.
            Va bene qualsiasi cosa si accenda: presa, luce, ventola, deumidificatore.</div>
        </div>
        <div class="ce-sez">
          <div class="ce-tit">Righe del riquadro «Oggi»</div>
          <div class="ce-aiuto">Spunta quelle da vedere, trascinale dalla maniglia ⠿ per metterle in ordine e, se vuoi,
            scrivi il nome e scegli il colore che preferisci (vuoto = quelli di serie; il tasto ↺ rimette il colore originale).</div>
          <div class="ce-righe"></div>
        </div>
        <div class="ce-sez">
          <div class="ce-tit">Nomi dei circuiti</div>
          <div class="ce-aiuto">Le barre sotto la scheda. Se non sai quali mettere, <b>Proponi da solo</b>
            guarda le prese di casa e ti mette le quattro che consumano di piu' (batterie, inverter e
            pannelli restano fuori). Poi cambi nome e fondo scala come vuoi.</div>
          <button type="button" class="ce-prepara ce-barre-auto">Proponi da solo</button>
          <div class="ce-aiuto">Il nome e il fondo scala (W) di ogni barra.</div>
          <div class="ce-riga"><span class="ent">Aggiungi una barra</span><ha-entity-picker class="ce-barra-nuova" allow-custom-entity></ha-entity-picker></div>
          <label class="ce-riga"><input type="checkbox" class="ce-barre-vive">
            <span><b>Scegli le barre da sola</b>: fa vedere le prese piu' accese del momento. Se parte
            il forno, il forno compare. L'elenco qui sotto non serve piu'.</span></label>
          <div class="ce-riga ce-quante" hidden><span class="ent">Quante barre</span>
            <input type="number" class="ce-barre-quante max" min="2" max="10" step="1" value="6"></div>
          <label class="ce-riga"><input type="checkbox" class="ce-barre-ordine" checked>
            <span>Mettile in fila da sole, la piu' accesa in cima (se la togli resta l'ordine di qui sotto)</span></label>
          <div class="ce-circuiti"></div>
        </div>
        <div class="ce-sez">
          <div class="ce-tit">La tua tariffa</div>
          <div class="ce-aiuto">Questa e' la scheda <b>principale</b>: il prezzo si scrive qui, una volta
            sola. Gli apparecchi, le prese e le luci lo leggono da qui, non lo richiedono.<br>
            Scrivi le voci come stanno in bolletta: il totale lo faccio io, ed e' quello che uso per la spesa
            della casa. Sugli apparecchi invece vale la <b>sola energia</b>, se no le tasse le paghi due volte.</div>
          <div class="ce-riga"><span class="ent">Energia &euro;/kWh</span><input type="number" class="ce-t-energia max" step="0.0001" min="0" placeholder="0.1657"></div>
          <div class="ce-riga"><span class="ent">Rete e oneri &euro;/kWh</span><input type="number" class="ce-t-rete max" step="0.0001" min="0" placeholder="0.045"></div>
          <div class="ce-riga"><span class="ent">Accise &euro;/kWh</span><input type="number" class="ce-t-accise max" step="0.0001" min="0" placeholder="0.0093"></div>
          <div class="ce-riga"><span class="ent">IVA %</span><input type="number" class="ce-t-iva max" step="1" min="0" placeholder="10"></div>
          <div class="ce-riga"><span class="ent">Quota fissa &euro; al giorno</span><input type="number" class="ce-t-quota max" step="0.0001" min="0" placeholder="0.542"></div>
          <div class="ce-riga"><span class="ent">Totale della bolletta</span><b class="ce-t-totale">&mdash;</b></div>
          <button type="button" class="ce-prepara ce-scrivi-tariffa">Scrivi la tariffa</button>
          <div class="ce-esito ce-esito-tariffa" hidden></div>
        </div>
        <div class="ce-sez">
          <div class="ce-tit">Crea i sensori base</div>
          <div class="ce-aiuto">Il prezzo l'hai gia' scritto qui sopra: qui scegli solo <b>da quale
            sensore dei kWh</b> parte la casa. Creo io i contatori (ora, oggi, settimana, mese e ieri) e il
            costo di ogni periodo, e li aggancio alla scheda; quelli che ci sono gia' li riuso.<br>
            Il conto voce per voce della bolletta, i cicli degli elettrodomestici e il risparmio del
            fotovoltaico non si fanno da qui: stanno nella guida, in <i>esempi/luce</i>.</div>
          <div class="ce-riga"><span class="ent">Sensore dei kWh</span><ha-entity-picker class="ce-kwh-pick" allow-custom-entity></ha-entity-picker></div>
          <div class="ce-riga"><span class="ent">Sensore dei pannelli (se ce l'hai)</span><ha-entities-picker class="ce-pannelli-pick"></ha-entities-picker></div>
          <button type="button" class="ce-prepara ce-pannelli-tutti">Prendile tutte</button>
          <div class="ce-riga"><span class="ent">Sensore della batteria (se ce l'hai)</span><ha-entities-picker class="ce-batteria-pick"></ha-entities-picker></div>
          <button type="button" class="ce-prepara ce-batteria-tutti">Prendile tutte</button>
          <div class="ce-aiuto">Dei pannelli e della batteria faccio i kWh di oggi e del mese, e li metto
            nelle righe <i>Dai pannelli</i> e <i>Dalla batteria</i> (spuntale qui sopra). Va bene sia un
            sensore in kWh sia uno in Watt. Per la batteria scegli quello che dice <b>quanto ha dato alla
            casa</b> (la scarica), non la percentuale.</div>
          <button type="button" class="ce-prepara ce-crea">Crea contatori e costi</button>
          <button type="button" class="ce-prepara ce-cancella">Cancella gli aiutanti di questa scheda</button>
          <div class="ce-esito" hidden></div>
        </div>
`;
      const form = document.createElement("ha-form");
      form.schema = this._tutto ? SCHEMA_TUTTO : SCHEMA_SEMPLICE;
      form.computeLabel = (x) => x.title || ETICHETTE[x.name] || x.name;
      form.computeHelper = (x) => AIUTI[x.name] || "";
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
      this._circuiti = this.querySelector(".ce-circuiti");
      this._esito = this.querySelector(".ce-esito");
      this.querySelector(".ce-crea").addEventListener("click", () => this._creaSensori());
      this.querySelector(".ce-scrivi-tariffa").addEventListener("click", () => this._scriviTariffa());
      this.querySelector(".ce-barre-auto").addEventListener("click", () => this._proponiBarre());
      [["pannelli", /solar|fotovolt|pv/i], ["batteria", /discharg|scaric/i]].forEach(([chi, come]) => {
        const b = this.querySelector(".ce-" + chi + "-tutti");
        if (!b) return;
        b.addEventListener("click", () => {
          const st = (this._hass || {}).states || {};
          const trovati = Object.keys(st).filter((id) => {
            const a = st[id].attributes || {};
            const u = String(a.unit_of_measurement || "").toLowerCase();
            return id.startsWith("sensor.") && a.device_class === "energy"
              && (u === "kwh" || u === "wh") && come.test(id)
              && !/_returned|restituit|forecast|previs/i.test(id);
          });
          if (!trovati.length) {
            window.alert("Non ho trovato contatori che sembrino " + chi + ".");
            return;
          }
          this._scriviScelta(chi + "_entita", trovati);
          const sel = this.querySelector(".ce-" + chi + "-pick");
          if (sel) sel.value = trovati;
          window.alert("Presi " + trovati.length + ":\n" + trovati.join("\n")
            + "\n\nSe ne aggiungi un altro in futuro, torna qui e ripremi.");
        });
      });
      const scegli = this.querySelector(".ce-barra-nuova");
      if (scegli) {
        scegli.addEventListener("value-changed", (ev) => {
          ev.stopPropagation();
          const id = ev.detail.value;
          if (!id) return;
          const n = [...(this._config.circuits || [])];
          if (!n.some((x) => x.entity === id)) {
            const w = Number((this._hass.states[id] || {}).state) || 0;
            n.push({ label: this._nomeDi(id), entity: id,
              max: Math.min(3500, Math.max(500, Math.ceil(w * 1.3 / 500) * 500)) });
            this._config = { ...this._config, circuits: n };
            this._emetti();
            this._disegnaCircuiti();
          }
          scegli.value = "";
        });
      }
      const vive = this.querySelector(".ce-barre-vive");
      if (vive) {
        vive.addEventListener("change", () => {
          this._scriviScelta("barre_vive", vive.checked ? true : "");
          this._mostraQuante();
        });
      }
      const quante = this.querySelector(".ce-barre-quante");
      if (quante) {
        quante.addEventListener("change", () =>
          this._scriviScelta("barre_quante", Number(quante.value) || 6));
      }
      const ordine = this.querySelector(".ce-barre-ordine");
      if (ordine) {
        ordine.addEventListener("change", () =>
          this._scriviScelta("barre_in_ordine", ordine.checked ? "" : false));
      }
      this.querySelector(".ce-cancella").addEventListener("click", () => this._cancellaSensori());
      this.querySelectorAll(".ce-t-energia, .ce-t-rete, .ce-t-accise, .ce-t-iva, .ce-t-quota").forEach((x) =>
        x.addEventListener("input", () => this._totaleTariffa()));
    }
    if (this._hass) this._form.hass = this._hass;
    this._disegnaKwh();
    this._disegnaPannelli();
    this._disegnaBatteria();
    this._disegnaPrezzo();
    this._disegnaTariffa();
    this._form.data = this._datiForm();
    this._disegnaRighe();
  }
}
