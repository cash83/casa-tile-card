// L'editor a clic di custom:casa-energia.
// Sopra: le impostazioni (ha-form di Home Assistant). Sotto: le righe del
// riquadro Oggi, da accendere/spegnere, trascinare in ordine e rinominare.
// I circuiti si scelgono come elenco di entita': il nome lo prendo dal
// sensore, e chi li ha gia' configurati a mano li ritrova come erano.

import { RIGHE_OGGI } from './elettro-energia.js';
import { preparaEnergia } from './elettro-prepara.js';
import { STILE_EDITOR, disegnaRighe } from './elettro-righe-editor.js';
import { creaSensoriBase, prezziDelKWh } from './elettro-crea.js';

const ETICHETTE = {
  name: "Nome della scheda",
  power_entity: "Potenza della casa (W) - obbligatoria",
  max_power: "Fondo scala della barra (W, es. 3300 con 3 kW)",
  circuiti: "Circuiti da mostrare con la barra (prese o sensori in W)",
  top_auto: "Top consumo automatico (cerca da solo tutte le prese che misurano)",
  top_min_w: "Sotto questi W non e' «top»",
  unmeasured_label: "Nome della voce «Non misurato»",
  bill_today: "Conto di oggi voce per voce (es. sensor.costi_luce_oggi)",
  bill_month: "Conto del mese voce per voce (es. sensor.costi_luce_mese)",
  notification_path: "Pagina delle notifiche (facoltativa, es. /lovelace/notifiche)",
  finestra_sfondo: "Tinta della finestra del pop-up",
  finestra_trasparenza: "Trasparenza della finestra",
  finestra_scritta: "Colore delle scritte nella finestra",
  velo_scuro: "Quanto scurisce quello che c'e' dietro",
  velo_sfoca: "Quanto sfoca quello che c'e' dietro",
};

const SCHEMA = [
  { name: "name", selector: { text: {} } },
  { name: "power_entity", required: true, selector: { entity: { domain: "sensor", device_class: "power" } } },
  { name: "max_power", selector: { number: { min: 500, max: 30000, step: 100, mode: "box", unit_of_measurement: "W" } } },
  { name: "circuiti", selector: { entity: { multiple: true, domain: "sensor", device_class: "power" } } },
  { name: "top_auto", selector: { boolean: {} } },
  { name: "top_min_w", selector: { number: { min: 0, max: 1000, step: 1, mode: "box", unit_of_measurement: "W" } } },
  { name: "unmeasured_label", selector: { text: {} } },
  { name: "bill_today", selector: { entity: { domain: "sensor" } } },
  { name: "bill_month", selector: { entity: { domain: "sensor" } } },
  { name: "notification_path", selector: { text: {} } },
  { name: "finestra_sfondo", selector: { color_rgb: {} } },
  { name: "finestra_trasparenza", selector: { number: { min: 0, max: 90, step: 5, mode: "slider", unit_of_measurement: "%" } } },
  { name: "finestra_scritta", selector: { color_rgb: {} } },
  { name: "velo_scuro", selector: { number: { min: 0, max: 100, step: 5, mode: "slider", unit_of_measurement: "%" } } },
  { name: "velo_sfoca", selector: { number: { min: 0, max: 30, step: 1, mode: "slider", unit_of_measurement: "px" } } },
];


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

  _datiForm() {
    const c = this._config;
    return { ...c,
      finestra_sfondo: this._versoRgb(c.finestra_sfondo),
      finestra_scritta: this._versoRgb(c.finestra_scritta), top_auto: c.top_auto !== false && c.top_auto !== undefined ? c.top_auto : false,
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

  _cambiatoForm(v) {
    // le terne del selettore tornano esadecimali
    ["finestra_sfondo", "finestra_scritta"].forEach((k) => {
      if (k in v) v[k] = this._versoHex(v[k]);
    });
    const c = { ...this._config };
    Object.keys(v).forEach((k) => {
      if (k === "circuiti") return;
      if (v[k] === "" || v[k] === undefined || v[k] === null) delete c[k];
      else c[k] = v[k];
    });
    // i circuiti: tengo quelli gia' configurati (nome e fondo scala scelti a
    // mano), aggiungo i nuovi col nome del sensore
    const prima = {};
    (this._config.circuits || []).forEach((x) => { if (x && x.entity) prima[x.entity] = x; });
    c.circuits = (v.circuiti || []).map((eid) => prima[eid] || { label: this._nomeDi(eid), entity: eid, max: 2500 });
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
      riga.innerHTML = `<span class="ent"></span><input type="text" class="nome"><input type="number" class="max" min="100" step="100" title="Fondo scala (W)"> W`;
      riga.querySelector(".ent").textContent = this._nomeDi(c.entity);
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
  _prezzoDiCasa() {
    // il totale (energia + tasse) viene per primo: e' quello che serve alla casa
    return prezziDelKWh(this._hass)[0];
  }

  _disegnaPrezzo() {
    const campo = this.querySelector(".ce-prezzo");
    if (!campo || campo.dataset.tocco) return;
    const gia = this._prezzoDiCasa();
    if (gia) {
      const st = this._hass.states[gia];
      campo.value = st.state;
      campo.disabled = true;
      campo.title = "Il prezzo ce l'hai gi\u00e0 (" + gia + "): si cambia da l\u00ec.";
    } else {
      campo.disabled = false;
      campo.title = "Lo scrivo nel prezzo nuovo che creo: guarda la bolletta.";
    }
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

  _disegnaKwh() {
    const sel = this.querySelector(".ce-kwh");
    if (!sel) return;
    const elenco = this._kWhPossibili();
    const scelto = sel.value;
    sel.innerHTML = elenco.length ? "" : "<option value=''>nessun sensore in kWh trovato</option>";
    elenco.forEach((id) => {
      const o = document.createElement("option");
      o.value = id;
      o.textContent = this._nomeDi(id);
      sel.appendChild(o);
    });
    // se c'e' un contatore gia' agganciato, parto dalla sua sorgente
    const primo = (this._config.periods || [])[0];
    const sorg = primo && this._hass && this._hass.states[primo.energy]
      && this._hass.states[primo.energy].attributes.source;
    const mio = this._config.energia_kwh;
    if (scelto && elenco.includes(scelto)) sel.value = scelto;
    else if (mio && elenco.includes(mio)) sel.value = mio;
    else if (sorg && elenco.includes(sorg)) sel.value = sorg;
  }

  async _creaSensori() {
    const tasto = this.querySelector(".ce-crea");
    const sorgente = (this.querySelector(".ce-kwh") || {}).value || this._config.energia_kwh;
    if (!sorgente) { this._dillo("Scegli il sensore dei kWh.", true); return; }
    if (!window.confirm("Creo in Home Assistant i contatori (ora, oggi, settimana, mese) e i costi "
      + "sopra a " + this._nomeDi(sorgente) + "." + "\n" + "Quelli che ci sono gia' li riuso. Vado?")) return;
    tasto.disabled = true;
    this._esito.hidden = false;
    this._esito.classList.remove("male");
    this._esito.textContent = "";
    try {
      const patch = await creaSensoriBase(this._hass, {
        sorgente, prezzo: Number((this.querySelector(".ce-prezzo") || {}).value),
      }, (t) => this._dillo(t));
      this._config = { ...this._config, ...patch };
      this._emetti();
      this._form.data = this._datiForm();
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
      this.innerHTML = `<style>${STILE_EDITOR}</style><div class="ce-form"></div>
        <div class="ce-sez">
          <div class="ce-tit">Righe del riquadro «Oggi»</div>
          <div class="ce-aiuto">Spunta quelle da vedere, trascinale dalla maniglia ⠿ per metterle in ordine e, se vuoi,
            scrivi il nome e scegli il colore che preferisci (vuoto = quelli di serie; il tasto ↺ rimette il colore originale).</div>
          <div class="ce-righe"></div>
        </div>
        <div class="ce-sez">
          <div class="ce-tit">Nomi dei circuiti</div>
          <div class="ce-aiuto">Il nome e il fondo scala (W) di ogni barra.</div>
          <div class="ce-circuiti"></div>
        </div>
        <div class="ce-sez">
          <div class="ce-tit">Crea i sensori base</div>
          <div class="ce-aiuto">Non hai ancora i contatori? Scegli il sensore dei <b>kWh</b> della casa
            e il prezzo: creo io gli helper di Home Assistant per ora, oggi, settimana, mese e ieri,
            con il costo di ogni periodo, e li aggancio alla scheda. Il conto voce per voce, i cicli
            degli elettrodomestici e il risparmio del fotovoltaico non si fanno da qui: quelli stanno
            nella guida, in <i>esempi/luce</i>.</div>
          <div class="ce-riga"><span class="ent">Sensore dei kWh</span><select class="ce-kwh"></select></div>
          <div class="ce-riga"><span class="ent">Prezzo (&euro;/kWh)</span><input type="number" class="ce-prezzo max" step="0.001" min="0" value="0.25"></div>
          <button type="button" class="ce-prepara ce-crea">Crea contatori e costi</button>
          <div class="ce-esito" hidden></div>
        </div>
        <div class="ce-sez">
          <div class="ce-tit">Periodi e costi</div>
          <div class="ce-aiuto">Aggancia da soli i contatori (ora, oggi, settimana, mese, ieri), i costi,
            il conto voce per voce e i prezzi della bolletta, se li hai creati coi nomi dell'esempio
            <i>esempi/luce</i>. Quello che c'e' gia' viene sostituito.</div>
          <button type="button" class="ce-prepara">Prepara periodi e costi da soli</button>
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
      this._circuiti = this.querySelector(".ce-circuiti");
      this._esito = this.querySelector(".ce-esito");
      this.querySelector(".ce-crea").addEventListener("click", () => this._creaSensori());
      this.querySelector(".ce-kwh").addEventListener("change", (e) =>
        this._scriviScelta("energia_kwh", e.target.value));
      this.querySelector(".ce-prepara").addEventListener("click", () => {
        const pronta = preparaEnergia(this._hass, { entity: this._config.power_entity, name: this._config.name });
        const c = { ...this._config };
        ["periods", "periods_prev", "settings_sections", "bill_today", "bill_month"].forEach((k) => {
          if (pronta[k] !== undefined) c[k] = pronta[k];
        });
        this._config = c;
        this._emetti();
        this._form.data = this._datiForm();
      });
    }
    if (this._hass) this._form.hass = this._hass;
    this._disegnaKwh();
    this._disegnaPrezzo();
    this._form.data = this._datiForm();
    this._disegnaRighe();
  }
}
