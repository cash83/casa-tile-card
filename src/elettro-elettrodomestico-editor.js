// L'editor a clic di custom:casa-elettrodomestico.
// Sopra: le impostazioni. In mezzo: le righe dell'Ultimo ciclo (spunta,
// trascina, rinomina). Sotto: "Prepara da solo", che ricompila la scheda
// partendo dalla presa (o dallo stato) come fa la voce del Tocco.

import { RIGHE_CICLO } from './elettro-elettrodomestico.js';
import { preparaElettrodomestico } from './elettro-prepara.js';
import { STILE_EDITOR, disegnaRighe } from './elettro-righe-editor.js';

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
    this._form.data = this._datiForm();
    this._disegnaRighe();
  }
}
