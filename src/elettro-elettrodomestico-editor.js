// L'editor a clic di custom:casa-elettrodomestico.
// Sopra: le impostazioni. In mezzo: le righe dell'Ultimo ciclo (spunta,
// trascina, rinomina). Sotto: "Prepara da solo", che ricompila la scheda
// partendo dalla presa (o dallo stato) come fa la voce del Tocco.

import { RIGHE_CICLO } from './elettro-elettrodomestico.js';
import { preparaElettrodomestico } from './elettro-prepara.js';
import { STILE_EDITOR, disegnaRighe } from './elettro-righe-editor.js';
import { creaSensoriElettrodomestico, prezziDelKWh } from './elettro-crea.js';

const DISEGNI = [
  ["washer", "Lavatrice"], ["dishwasher", "Lavastoviglie"], ["dryer", "Asciugatrice"],
  ["oven", "Forno"], ["tv", "Televisore"], ["boiler", "Boiler / scaldabagno"],
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
  cycle_sensor: "Sensore dell'ultimo ciclo (es. sensor.lavatrice_ciclo)",
  notification_path: "Pagina delle notifiche (facoltativa)",
  finestra_sfondo: "Tinta della finestra del pop-up",
  finestra_trasparenza: "Trasparenza della finestra",
  finestra_scritta: "Colore delle scritte nella finestra",
  velo_scuro: "Quanto scurisce quello che c'e' dietro",
  velo_sfoca: "Quanto sfoca quello che c'e' dietro",
};

const SCHEMA = [
  { name: "name", selector: { text: {} } },
  { name: "artwork", selector: { select: { mode: "dropdown", options: DISEGNI.map(([value, label]) => ({ value, label })) } } },
  { name: "power_entity", required: true, selector: { entity: { domain: "sensor" } } },
  { name: "threshold_run", selector: { number: { min: 0, max: 3000, step: 1, mode: "box", unit_of_measurement: "W" } } },
  { name: "threshold_standby", selector: { number: { min: 0, max: 500, step: 0.5, mode: "box", unit_of_measurement: "W" } } },
  { name: "max_power", selector: { number: { min: 1, max: 10000, step: 1, mode: "box" } } },
  { name: "power_label", selector: { text: {} } },
  { name: "power_unit", selector: { text: {} } },
  { name: "stato", selector: { entity: {} } },
  { name: "cycle_sensor", selector: { entity: { domain: "sensor" } } },
  { name: "notification_path", selector: { text: {} } },
  { name: "finestra_sfondo", selector: { color_rgb: {} } },
  { name: "finestra_trasparenza", selector: { number: { min: 0, max: 90, step: 5, mode: "slider", unit_of_measurement: "%" } } },
  { name: "finestra_scritta", selector: { color_rgb: {} } },
  { name: "velo_scuro", selector: { number: { min: 0, max: 100, step: 5, mode: "slider", unit_of_measurement: "%" } } },
  { name: "velo_sfoca", selector: { number: { min: 0, max: 30, step: 1, mode: "slider", unit_of_measurement: "px" } } },
];

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
      finestra_sfondo: this._versoRgb(c.finestra_sfondo),
      finestra_scritta: this._versoRgb(c.finestra_scritta), stato: (c.live && c.live.state_entity) || "" };
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
    // le terne del selettore tornano esadecimali
    ["finestra_sfondo", "finestra_scritta"].forEach((k) => {
      if (k in v) v[k] = this._versoHex(v[k]);
    });
    const c = { ...this._config };
    Object.keys(v).forEach((k) => {
      if (k === "stato") return;
      if (v[k] === "" || v[k] === undefined || v[k] === null) delete c[k];
      else c[k] = v[k];
    });
    const live = { ...(c.live || {}) };
    if (v.stato) live.state_entity = v.stato; else delete live.state_entity;
    if (Object.keys(live).length) c.live = live; else delete c.live;
    this._config = c;
    this._emetti();
  }

  _disegnaRighe() {
    if (!this._righe) return;
    disegnaRighe(this._righe, RIGHE_CICLO, this._config, (c) => {
      this._config = c;
      this._emetti();
      this._disegnaRighe();
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
    sel.hidden = !elenco.length;
    campo.hidden = !!elenco.length;
    sel.innerHTML = "";
    elenco.forEach((id) => {
      const st = this._hass.states[id];
      const o = document.createElement("option");
      o.value = id;
      o.textContent = (st.attributes.friendly_name || id) + " \u2014 " + st.state + " \u20ac/kWh";
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
      return a.device_class === "energy" && String(a.unit_of_measurement || "").toLowerCase() === "kwh";
    }).sort();
  }

  _disegnaKwh() {
    const sel = this.querySelector(".ce-kwh");
    if (!sel) return;
    const scelto = sel.value;
    sel.innerHTML = "<option value=''>\u2014 calcolalo dai Watt \u2014</option>";
    this._kWhPossibili().forEach((id) => {
      const o = document.createElement("option");
      o.value = id;
      o.textContent = this._nomeDi(id);
      sel.appendChild(o);
    });
    const mio = this._config.energia_kwh;
    if (scelto) sel.value = scelto;
    else if (mio && this._kWhPossibili().includes(mio)) sel.value = mio;
    const soglia = this.querySelector(".ce-soglia");
    if (soglia && !soglia.dataset.tocco && this._config.threshold_run) {
      soglia.value = this._config.threshold_run;
    }
  }

  async _creaSensori() {
    const tasto = this.querySelector(".ce-crea");
    const potenza = this._config.power_entity;
    if (!potenza) { this._dillo("Prima scegli la presa che misura i Watt.", true); return; }
    const kwh = (this.querySelector(".ce-kwh") || {}).value || this._config.energia_kwh;
    if (!window.confirm("Creo in Home Assistant gli helper delle statistiche di "
      + (this._config.name || "questo elettrodomestico") + "." + "\n"
      + "Quelli che ci sono gia' li riuso. Vado?")) return;
    tasto.disabled = true;
    this._esito.hidden = false;
    this._esito.classList.remove("male");
    this._esito.textContent = "";
    try {
      const patch = await creaSensoriElettrodomestico(this._hass, {
        potenza, energia: kwh || null, nome: this._config.name,
        soglia: Number((this.querySelector(".ce-soglia") || {}).value),
        prezzo_entita: (this.querySelector(".ce-prezzo-ent") || {}).value || this._config.prezzo_entita,
        prezzo: Number((this.querySelector(".ce-prezzo") || {}).value),
        stats: this._config.stats,
      }, (t) => this._dillo(t));
      this._config = { ...this._config, ...patch };
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
  }

  _disegna() {
    if (!this._costruito) {
      this._costruito = true;
      this.innerHTML = `<style>${STILE_EDITOR}</style><div class="ce-form"></div>
        <div class="ce-sez">
          <div class="ce-tit">Righe dell'«Ultimo ciclo»</div>
          <div class="ce-aiuto">Spunta quelle da vedere, trascinale dalla maniglia ⠿ per metterle
            in ordine e, se vuoi, scrivi il nome e scegli il colore che preferisci (vuoto = quelli di serie; il tasto ↺ rimette il colore originale).</div>
          <div class="ce-righe"></div>
        </div>
        <div class="ce-sez">
          <div class="ce-tit">Crea i sensori base</div>
          <div class="ce-aiuto">Creo io gli helper di Home Assistant per le <b>statistiche</b>:
            quante volte e' partito, quanto ha lavorato e quanto e' costato, oggi e questo mese.
            Per il costo scegli <b>con quale prezzo</b>: di solito qui si vuole la sola energia, senza tasse, e il conto completo si guarda nella scheda della casa. Il riquadro <i>Ultimo ciclo</i> non si fa da qui: quello vuole un sensore template a
            trigger, che sta nella guida (<i>esempi/luce</i>).</div>
          <div class="ce-riga"><span class="ent">Sensore dei kWh</span><select class="ce-kwh"></select></div>
          <div class="ce-riga"><span class="ent">Sopra questi W sta lavorando</span><input type="number" class="ce-soglia max" step="1" min="1" value="10"> W</div>
          <div class="ce-riga"><span class="ent">Prezzo da usare</span><select class="ce-prezzo-ent"></select><input type="number" class="ce-prezzo max" step="0.001" min="0" value="0.25" hidden></div>
          <button type="button" class="ce-prepara ce-crea">Crea statistiche e costi</button>
          <div class="ce-esito" hidden></div>
        </div>
        <div class="ce-sez">
          <div class="ce-tit">Prepara da solo</div>
          <div class="ce-aiuto">Ricompila la scheda partendo dalla presa: disegno dal nome, soglie,
            stato, sensori del ciclo e dei costi (se li hai creati coi nomi dell'esempio
            <i>esempi/luce</i>). Nome, righe e nomi delle righe restano come li hai scelti.</div>
          <button type="button" class="ce-prepara">Prepara da solo</button>
        </div>`;
      const form = document.createElement("ha-form");
      form.schema = SCHEMA;
      form.computeLabel = (x) => ETICHETTE[x.name] || x.name;
      form.addEventListener("value-changed", (e) => {
        e.stopPropagation();
        this._cambiatoForm(e.detail.value || {});
      });
      this.querySelector(".ce-form").appendChild(form);
      this._form = form;
      this._righe = this.querySelector(".ce-righe");
      this._esito = this.querySelector(".ce-esito");
      this.querySelector(".ce-crea").addEventListener("click", () => this._creaSensori());
      this.querySelector(".ce-kwh").addEventListener("change", (e) =>
        this._scriviScelta("energia_kwh", e.target.value));
      this.querySelector(".ce-prezzo-ent").addEventListener("change", (e) =>
        this._scriviScelta("prezzo_entita", e.target.value));
      this.querySelector(".ce-soglia").addEventListener("change", (e) => {
        this._scriviScelta("threshold_run", Number(e.target.value));
        this._form.data = this._datiForm();
      });
      this.querySelector(".ce-prepara").addEventListener("click", () => {
        const c0 = this._config;
        const entita = (c0.live && c0.live.state_entity) || c0.power_entity;
        const pronta = preparaElettrodomestico(this._hass, { entity: entita, name: c0.name, icona: c0.artwork });
        const tieni = {};
        ["name", "righe", "nomi_righe", "notification_path", "grid_options", "casa_misura"].forEach((k) => {
          if (c0[k] !== undefined) tieni[k] = c0[k];
        });
        this._config = { type: c0.type, ...pronta, ...tieni };
        this._emetti();
        this._form.data = this._datiForm();
        this._disegnaRighe();
      });
    }
    if (this._hass) this._form.hass = this._hass;
    this._disegnaKwh();
    this._disegnaPrezzo();
    this._form.data = this._datiForm();
    this._disegnaRighe();
  }
}
