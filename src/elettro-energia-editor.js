// L'editor a clic di custom:casa-energia.
// Sopra: le impostazioni (ha-form di Home Assistant). Sotto: le righe del
// riquadro Oggi, da accendere/spegnere, trascinare in ordine e rinominare.
// I circuiti si scelgono come elenco di entita': il nome lo prendo dal
// sensore, e chi li ha gia' configurati a mano li ritrova come erano.

import { RIGHE_OGGI } from './elettro-energia.js';
import { preparaEnergia } from './elettro-prepara.js';

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
];

const STILE = `
  .ce-sez{margin-top:18px;padding:12px;border-radius:12px;border:1px solid var(--divider-color,#444)}
  .ce-tit{font-weight:600;margin-bottom:4px}
  .ce-aiuto{font-size:12.5px;color:var(--secondary-text-color);margin-bottom:10px}
  .ce-riga{display:flex;align-items:center;gap:8px;padding:6px 8px;border-radius:9px;margin-bottom:4px;background:var(--secondary-background-color,#222)}
  .ce-riga.spenta{opacity:.5}
  .ce-riga label{flex:1 1 45%;min-width:0;display:flex;align-items:center;gap:8px;cursor:pointer}
  .ce-riga .ent{flex:1 1 35%;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13px}
  .ce-riga input.nome{flex:1 1 40%;min-width:0;padding:5px 7px;border-radius:7px;border:1px solid var(--divider-color,#555);background:var(--card-background-color,#111);color:inherit;font:inherit;font-size:13px}
  .ce-riga input.max{width:72px;padding:5px 6px;border-radius:7px;border:1px solid var(--divider-color,#555);background:var(--card-background-color,#111);color:inherit;font:inherit;font-size:13px}
  .ce-riga .maniglia{cursor:grab;touch-action:none;user-select:none;font-size:18px;line-height:1;padding:2px 4px;color:var(--secondary-text-color)}
  .ce-riga.trascino{outline:2px solid var(--primary-color);opacity:.85}
  .ce-riga button{border:1px solid var(--divider-color,#555);background:none;color:inherit;border-radius:7px;width:30px;height:28px;cursor:pointer;font-size:14px}
  .ce-riga button:disabled{opacity:.3;cursor:default}
  .ce-prepara{margin-top:10px;border:1px solid var(--primary-color);background:none;color:var(--primary-color);border-radius:9px;padding:7px 12px;cursor:pointer}
`;

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
    return { ...c, top_auto: c.top_auto !== false && c.top_auto !== undefined ? c.top_auto : false,
      circuiti: (c.circuits || []).map((x) => x && x.entity).filter(Boolean) };
  }

  _nomeDi(eid) {
    const st = this._hass && this._hass.states[eid];
    const n = st ? String(st.attributes.friendly_name || eid) : eid;
    return n.replace(/\s+(potenza|power)\s*$/i, "").replace(/\s{2,}/g, " ").trim();
  }

  _cambiatoForm(v) {
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

  _ordine() {
    const scelte = Array.isArray(this._config.righe) && this._config.righe.length
      ? this._config.righe.filter((id) => RIGHE_OGGI.some((r) => r.id === id))
      : RIGHE_OGGI.map((r) => r.id);
    const spente = RIGHE_OGGI.map((r) => r.id).filter((id) => !scelte.includes(id));
    return { scelte, spente };
  }

  _scriviRighe(scelte) {
    this._config = { ...this._config, righe: scelte };
    this._emetti();
    this._disegnaRighe();
  }

  _disegnaRighe() {
    const box = this._righe;
    if (!box) return;
    const { scelte, spente } = this._ordine();
    box.innerHTML = "";
    [...scelte, ...spente].forEach((id) => {
      const accesa = scelte.includes(id);
      const voce = RIGHE_OGGI.find((r) => r.id === id);
      const riga = document.createElement("div");
      riga.className = "ce-riga" + (accesa ? "" : " spenta");
      riga.innerHTML = `<span class="maniglia" title="Trascina per spostare">⠿</span><label><input type="checkbox" ${accesa ? "checked" : ""}> <span></span></label>
        <input type="text" class="nome">
        `;
      riga.querySelector("label span").textContent = voce.nome;
      // il nome che si vede sulla scheda: vuoto = quello di serie
      const nome = riga.querySelector(".nome");
      nome.placeholder = voce.etichetta;
      nome.title = "Nome sulla scheda (vuoto = " + voce.etichetta + ")";
      nome.value = (this._config.nomi_righe || {})[id] || "";
      nome.addEventListener("change", () => {
        const nomi = { ...(this._config.nomi_righe || {}) };
        const t = nome.value.trim();
        if (t) nomi[id] = t; else delete nomi[id];
        this._config = { ...this._config, nomi_righe: nomi };
        if (!Object.keys(nomi).length) delete this._config.nomi_righe;
        this._emetti();
      });
      riga.dataset.id = id;
      if (accesa) riga.classList.add("accesa");
      riga.querySelector("input").addEventListener("change", (e) => {
        const n = scelte.filter((x) => x !== id);
        if (e.target.checked) n.push(id);
        this._scriviRighe(n);
      });
      // SI SPOSTA TRASCINANDO LA MANIGLIA, col mouse o col dito (pointer
      // events: il drag and drop nativo sul telefono non funziona). La riga
      // si sposta mentre trascini; l'ordine si scrive quando lasci.
      const maniglia = riga.querySelector(".maniglia");
      if (!accesa) maniglia.style.visibility = "hidden";
      maniglia.addEventListener("pointerdown", (e) => {
        if (!accesa) return;
        e.preventDefault();
        try { maniglia.setPointerCapture(e.pointerId); } catch (err) { /* pazienza */ }
        riga.classList.add("trascino");
        const muovi = (ev) => {
          const altre = [...box.querySelectorAll(".ce-riga.accesa")].filter((r) => r !== riga);
          const prima = altre.find((r) => {
            const q = r.getBoundingClientRect();
            return ev.clientY < q.top + q.height / 2;
          });
          if (prima) box.insertBefore(riga, prima);
          else {
            // in fondo alle accese, prima delle spente
            const spenta = box.querySelector(".ce-riga.spenta");
            box.insertBefore(riga, spenta || null);
          }
        };
        const lascia = () => {
          window.removeEventListener("pointermove", muovi);
          window.removeEventListener("pointerup", lascia);
          window.removeEventListener("pointercancel", lascia);
          riga.classList.remove("trascino");
          const nuovo = [...box.querySelectorAll(".ce-riga.accesa")].map((r) => r.dataset.id);
          if (nuovo.join() !== scelte.join()) this._scriviRighe(nuovo);
        };
        window.addEventListener("pointermove", muovi);
        window.addEventListener("pointerup", lascia);
        window.addEventListener("pointercancel", lascia);
      });
      box.appendChild(riga);
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

  _disegna() {
    if (!this._costruito) {
      this._costruito = true;
      this.innerHTML = `<style>${STILE}</style><div class="ce-form"></div>
        <div class="ce-sez">
          <div class="ce-tit">Righe del riquadro «Oggi»</div>
          <div class="ce-aiuto">Spunta quelle da vedere, trascinale dalla maniglia ⠿ per metterle in ordine e, se vuoi,
            scrivi il nome che preferisci (vuoto = quello di serie).</div>
          <div class="ce-righe"></div>
        </div>
        <div class="ce-sez">
          <div class="ce-tit">Nomi dei circuiti</div>
          <div class="ce-aiuto">Il nome e il fondo scala (W) di ogni barra.</div>
          <div class="ce-circuiti"></div>
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
    this._form.data = this._datiForm();
    this._disegnaRighe();
  }
}
