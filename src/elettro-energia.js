// custom:casa-energia - consumo della casa, costi, circuiti, top consumo automatico.
// Nata dalle schede di Simonz82 (github.com/Simonz82/smart-home-cards),
// che le lascia libere: portata qui dentro il 18/09/2026 per non dipendere
// da un secondo file. Da qui in poi e' codice nostro.

import { laLingua, laLocale, scegliLingua, T, TH } from './lingua.js';
import {
  mirinoGrafico,
  numero,
  unitaBella,
  HERO_BUILDERS,
  CHIP_SVGS,
  ICON_GEAR,
  ICON_CHART,
  ICON_POWER,
  ICON_USB,
  ICON_NOTIFCENTER,
  ICON_BOLT,
  ICON_EURO,
  ICON_TREND,
  STYLE,
  esc,
  meterSeverityColor,
  vestiFinestra,
} from './elettro-comune.js';
const ICON_SOLE = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
import { ESCLUSI_DI_SERIE } from './elettro-prepara.js';
import { righeInOrdine } from './elettro-righe-editor.js';
import { ConFinestrelle } from './elettro-condivisi.js';

// Le righe che puo' avere il riquadro Oggi, con il nome che si vede nell'editor.
export const RIGHE_OGGI = [
  { id: "consumo", nome: "Consumo (kWh presi dalla rete)", etichetta: "Consumo", colore: "#3fb4ea" },
  { id: "consumo_mese", nome: "Consumo del mese (kWh)", etichetta: "Consumo mese", colore: "#3f8fea" },
  { id: "energia_tasse", nome: "Energia + tasse (senza pannelli)", etichetta: "Energia + tasse", colore: "#f28c3c" },
  { id: "risparmio", nome: "Risparmio pannelli (oggi e mese)", etichetta: "Risparmio pannelli", colore: "#43b86a" },
  { id: "pv_tasse", nome: "Quello che paghi (tutto compreso)", etichetta: "Paghi", colore: "#e2ad1c" },
  { id: "energia", nome: "Energia attuale (senza tasse)", etichetta: "Energia attuale", colore: "#2fbfb0" },
  { id: "mese", nome: "Mese (+ tasse)", etichetta: "Mese (+ tasse)", colore: "#a283f2" },
  { id: "bolletta", nome: "Bolletta (il bimestre, kWh e €)", etichetta: "Bolletta", colore: "#e07b39" },
  { id: "pannelli", nome: "kWh dai pannelli (oggi e mese)", etichetta: "Dai pannelli", colore: "#f2c53c" },
  { id: "batteria", nome: "kWh dalla batteria (oggi e mese)", etichetta: "Dalla batteria", colore: "#7ecf6a" },
  { id: "top", nome: "Top consumo", etichetta: "Top consumo", colore: "#f06e82" },
];

const VUOTO = '<div class="dm-ap-sec"><div class="dm-ap-sec-cap">Niente da impostare</div><div class="dm-ap-reset-note">Qui compaiono i prezzi e gli interruttori che leghi alla scheda: si scelgono nel suo editor, dalla matita della plancia.</div></div>';

export class CasaEnergia extends ConFinestrelle(HTMLElement) {
  // Le righe del riquadro Oggi, nell'ordine della configurazione (`righe`).
  // Una riga che non e' nell'elenco non si vede.
  _righeOggi() {
    const R = {
      consumo: `<div class="dm-ap-cycle-row dm-ap-cycle-row-b dm-colore" style="--c:#3fb4ea"><span class="dm-ap-cycle-label"><span class="dm-ap-cycle-ic">${ICON_BOLT}</span><small>Consumo</small></span><b class="dm-e-today-kwh">\u2014</b></div>`,
      consumo_mese: `<div class="dm-ap-cycle-row dm-ap-cycle-row-b dm-colore" style="--c:#3f8fea"><span class="dm-ap-cycle-label"><span class="dm-ap-cycle-ic">${ICON_BOLT}</span><small>Consumo mese</small></span><b class="dm-e-month-kwh">—</b></div>`,
      energia_tasse: `${this._config.bill_today || (this._config.periods || []).length ? `<div class="dm-ap-cycle-row dm-ap-cycle-row-b dm-colore" style="--c:#f28c3c"><span class="dm-ap-cycle-label"><span class="dm-ap-cycle-ic">${ICON_EURO}</span><small>Energia + tasse</small></span><b class="dm-e-senzafv">\u2014</b></div>` : ""}`,
      risparmio: `${this._config.bill_today || this._config.risparmio_oggi || (this._config.periods || []).length ? `<div class="dm-ap-cycle-row dm-ap-cycle-row-b dm-colore" style="--c:#43b86a"><span class="dm-ap-cycle-label"><span class="dm-ap-cycle-ic">${ICON_SOLE}</span><small>Risparmio pannelli</small></span><b class="dm-e-fv">\u2014</b></div>` : ""}`,
      pv_tasse: `<div class="dm-ap-cycle-row dm-ap-cycle-row-b dm-colore dm-forte" style="--c:#e2ad1c"><span class="dm-ap-cycle-label"><span class="dm-ap-cycle-ic">${ICON_EURO}</span><small>Paghi</small></span><b class="dm-e-today-cost">\u2014</b></div>`,
      energia: `${this._config.bill_today || (this._config.periods || []).length ? `<div class="dm-ap-cycle-row dm-ap-cycle-row-b dm-colore" style="--c:#2fbfb0"><span class="dm-ap-cycle-label"><span class="dm-ap-cycle-ic">${ICON_BOLT}</span><small>Energia attuale</small></span><b class="dm-e-solo">\u2014</b></div>` : ""}`,
      mese: `<div class="dm-ap-cycle-row dm-ap-cycle-row-b dm-colore" style="--c:#a283f2"><span class="dm-ap-cycle-label"><span class="dm-ap-cycle-ic">${ICON_EURO}</span><small>Mese (+ tasse)</small></span><b class="dm-e-month-cost">\u2014</b></div>`,
      bolletta: `${this._config.bolletta_energia || this._config.bolletta_costo ? `<div class="dm-ap-cycle-row dm-ap-cycle-row-b dm-colore" style="--c:#e07b39"><span class="dm-ap-cycle-label"><span class="dm-ap-cycle-ic">${ICON_EURO}</span><small>Bolletta</small></span><b class="dm-e-bolletta">\u2014</b></div>` : ""}`,
      pannelli: `${`<div class="dm-ap-cycle-row dm-ap-cycle-row-b dm-colore" style="--c:#f2c53c"><span class="dm-ap-cycle-label"><span class="dm-ap-cycle-ic">${ICON_SOLE}</span><small>Dai pannelli</small></span><b class="dm-e-pannelli">\u2014</b></div>`}`,
      batteria: `${`<div class="dm-ap-cycle-row dm-ap-cycle-row-b dm-colore" style="--c:#7ecf6a"><span class="dm-ap-cycle-label"><span class="dm-ap-cycle-ic">${ICON_BOLT}</span><small>Dalla batteria</small></span><b class="dm-e-batteria">\u2014</b></div>`}`,
      top: `<div class="dm-ap-cycle-row dm-ap-cycle-row-b dm-colore" style="--c:#f06e82"><span class="dm-ap-cycle-label"><span class="dm-ap-cycle-ic">${ICON_TREND}</span><small>Top consumo</small></span><b class="dm-e-top">\u2014</b></div>`,
    };
    return righeInOrdine(this._config, RIGHE_OGGI, R, esc);
  }

  static getConfigElement() {
    return document.createElement("casa-energia-editor");
  }

  static getStubConfig(hass) {
    const st = (hass && hass.states) || {};
    const potenza = Object.keys(st).find((k) => k.startsWith("sensor.")
      && (st[k].attributes || {}).device_class === "power") || "";
    return { type: "custom:casa-energia", name: "Energia Casa", power_entity: potenza, top_auto: true };
  }

  setConfig(config) {
    // senza la presa la scheda NON si rompe: si fa vedere coi watt a zero e
    // l'editor dice cosa manca. Prima buttava un errore rosso in faccia, e la
    // gemella (casa-elettrodomestico) non lo fa.
    this._config = {
      name: "Energia Casa",
      artwork: "energy",
      max_power: 4500,
      periods: [],
      periods_prev: [],
      weekdays: {},
      circuits: [],
      switches: [],
      actions: [],
      settings_sections: [],
      ...config,
    };
    vestiFinestra(this, this._config);
    this._root = this._root || this.attachShadow({ mode: "open" });
    this._heroId = "en" + Math.random().toString(36).slice(2, 8);
    const hero = (HERO_BUILDERS[this._config.artwork] || HERO_BUILDERS.energy)(this._heroId);
    const chip = CHIP_SVGS[this._config.artwork] || CHIP_SVGS.energy;
    this._root.innerHTML = `<style>${STYLE}</style>` + TH(`
      <article class="dm-ap-card is-run">
        <div class="dm-ap-top">
          <span class="dm-ap-chip">${chip}</span>
          <span class="dm-ap-headings">
            <span class="dm-ap-name"></span>
          </span>
          <span class="dm-ap-badge run"><i class="dm-ap-dot"></i><span class="dm-ap-badge-label">ONLINE</span></span>
          <span class="dm-ap-tools">
            ${this._config.notification_path ? `<button type="button" class="dm-ap-tool dm-ap-notif-center" title="Centro Notifiche">${ICON_NOTIFCENTER}</button>` : ""}
            ${this._config.interruttore ? `<button type="button" class="dm-ap-tool dm-ap-power" title="Accendi / spegni">${ICON_POWER}</button>` : ""}
            ${this._config.interruttore_usb ? `<button type="button" class="dm-ap-tool dm-ap-usb" title="USB">${ICON_USB}</button>` : ""}
            <button type="button" class="dm-ap-tool dm-ap-settings" title="Impostazioni">${ICON_GEAR}</button>
            <button type="button" class="dm-ap-tool dm-ap-stats" title="Statistiche">${ICON_CHART}</button>
            <button type="button" class="dm-ap-tool dm-ap-consumi" title="Circuiti">${ICON_BOLT}</button>
          </span>
        </div>
        <div class="dm-ap-top-row">
          <div class="dm-ap-hero">${hero}</div>
          <div class="dm-ap-cycle-side">
            <span class="dm-ap-cycle-cap">Oggi</span>
            <div class="dm-ap-cycle-list">
              ${this._righeOggi()}
            </div>
          </div>
        </div>
        <div class="dm-ap-warn" hidden></div>
        <div class="dm-ap-panel">
          <div class="dm-ap-meters"></div>
        </div>
      </article>`);
    this._root.querySelector(".dm-ap-name").textContent = this._config.name;

    // Le prime 4 voci di "circuits" (Generale/Prese/Luce/Cantina nel setup
    // reale) diventano le barre sul fronte, come CPU/RAM sulle altre card;
    // il resto compare solo nel popup Circuiti - stesso split usato per
    // Volume1/Volume2/USB sulla card NAS.
    const metersEl = this._root.querySelector(".dm-ap-meters");
    (this._config.circuits || []).forEach((c, i) => {
      const div = document.createElement("div");
      div.className = "dm-ap-meter dm-c-meter-clickable";
      div.dataset.circuitIndex = i;
      div.innerHTML = `<div class="dm-ap-meter-row"><span class="dm-e-c-name">${esc(c.label)}</span><strong class="dm-e-c-val">0 W</strong></div>
        <div class="dm-ap-bar"><i class="dm-e-c-bar" style="width:0%"></i></div>`;
      div.addEventListener("click", (e) => {
        e.stopPropagation();
        // quale barra sia questa lo dico al momento del clic: l'ordine cambia
        const q = div._circuito || c;
        this._openMeterChart(q.entity, q.label, "#38bdf8");
      });
      metersEl.appendChild(div);
    });

    this._root.querySelector(".dm-ap-notif-center")?.addEventListener("click", (e) => {
      e.stopPropagation();
      history.pushState(null, "", this._config.notification_path);
      window.dispatchEvent(new CustomEvent("location-changed", { bubbles: true, composed: true }));
    });
    // i due interruttori della presa: quello grande e quello delle USB
    [[".dm-ap-power", "interruttore"], [".dm-ap-usb", "interruttore_usb"]].forEach(([sel, chiave]) => {
      this._root.querySelector(sel)?.addEventListener("click", (e) => {
        e.stopPropagation();
        const eid = this._config[chiave];
        this._hass?.callService(eid.split(".")[0], "toggle", { entity_id: eid });
      });
    });
    this._root.querySelector(".dm-ap-settings").addEventListener("click", (e) => {
      e.stopPropagation();
      if (this._config.legacy_settings_popup) {
        const event = new Event("ll-custom", { bubbles: true, composed: true });
        event.detail = { browser_mod: this._config.legacy_settings_popup };
        this.dispatchEvent(event);
      } else {
        this._openSettings();
      }
    });
    if (this._config.bill_today || this._config.bill_month) {
      const lato = this._root.querySelector(".dm-ap-cycle-side");
      lato.style.cursor = "pointer";
      lato.addEventListener("click", (e) => {
        e.stopPropagation();
        this._openConto();
      });
    }
    this._root.querySelector(".dm-ap-stats").addEventListener("click", (e) => {
      e.stopPropagation();
      this._openStats();
    });
    this._root.querySelector(".dm-ap-consumi").addEventListener("click", (e) => {
      e.stopPropagation();
      this._openConsumi();
    });
    this._root.querySelector(".dm-ap-hero").addEventListener("click", (e) => {
      e.stopPropagation();
      this._openConsumi();
    });
  }

  _actionRowHtml(row) {
    const target = row.service ? row.service : row.entity;
    return `<div class="dm-ap-row">
      <span class="dm-ap-row-label">${esc(row.label)}</span>
      <button type="button" class="dm-ap-action-btn" data-action-target="${esc(target)}" data-action-kind="${row.service ? "service" : "script"}" data-confirm="${esc(row.confirm || "")}">Esegui</button>
    </div>`;
  }

  _openSettings() {
    const hass = this._hass;
    const sections = (this._config.settings_sections || [])
      .map((sec) => {
        const righe = (sec.rows || []).map((row) => this._settingsRowHtml(hass, row)).join("");
        if ((sec.rows || []).length <= 3 && !sec.chiuso) {
          return `<div class="dm-ap-sec"><div class="dm-ap-sec-cap">${esc(sec.title)}</div>${righe}</div>`;
        }
        // il numero da mettere nel titolo: l'ultima riga (di solito il totale)
        const ultima = sec.rows[sec.rows.length - 1];
        const st = ultima && hass.states[ultima.entity];
        const valore = st ? `${st.state}${st.attributes.unit_of_measurement ? " " + st.attributes.unit_of_measurement : ""}` : "";
        return `<details class="dm-ap-sec dm-ap-sec-chiusa">
          <summary class="dm-ap-sec-cap">${esc(sec.title)}${valore ? ` \u00b7 <b>${esc(valore)}</b>` : ""}</summary>
          ${righe}
        </details>`;
      })
      .join("");

    const switchesHtml = (this._config.switches || [])
      .map((s) => this._settingsRowHtml(hass, s))
      .join("");

    const actions = this._config.actions || [];
    const actionsHtml = actions.length
      ? `<div class="dm-ap-sec">
           <div class="dm-ap-sec-cap">Strumenti</div>
           ${actions.map((a) => this._actionRowHtml(a)).join("")}
         </div>`
      : "";

    const dentro = `${sections}${switchesHtml ? `<div class="dm-ap-sec"><div class="dm-ap-sec-cap">Interruttori</div>${switchesHtml}</div>` : ""}${actionsHtml}`;
    const overlay = this._openDialog(
      "Impostazioni",
      dentro.trim() ? dentro : VUOTO,
    );

    overlay.querySelectorAll("[data-entity]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const entity = btn.dataset.entity;
        const domain = entity.split(".")[0];
        hass.callService(domain, "toggle", { entity_id: entity });
        setTimeout(() => this._openSettings(), 200);
      });
    });
    overlay.querySelectorAll("[data-open-entity]").forEach((row) => {
      row.addEventListener("click", () => {
        const e = new Event("hass-more-info", { bubbles: true, composed: true });
        e.detail = { entityId: row.dataset.openEntity };
        this.dispatchEvent(e);
      });
    });
    overlay.querySelectorAll("[data-action-target]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const confirmText = btn.dataset.confirm;
        if (confirmText && !window.confirm(confirmText)) return;
        if (btn.dataset.actionKind === "service") {
          const [domain, service] = btn.dataset.actionTarget.split(".");
          hass.callService(domain, service, {});
        } else {
          hass.callService("script", "turn_on", { entity_id: btn.dataset.actionTarget });
        }
      });
    });
  }

  // questa scheda addolcisce la linea del grafico
  get _morbida() { return true; }

  _statRow(label, value) {
    return this._row(label, `<span class="dm-ap-row-val">${esc(value)}</span>`);
  }

  // come _statRow2, ma con la barretta e le scritte del colore della riga
  _statRow2c(colore, forte, label, aVal, bVal) {
    const html = this._statRow2(label, aVal, bVal);
    if (!colore) return html;
    return html.replace('class="dm-ap-row"', `class="dm-ap-row dm-colore${forte ? " dm-forte" : ""}" style="--c:${colore}"`);
  }

  _statRow2(label, aVal, bVal) {
    return this._row(label, `<span class="dm-ap-row-val">${esc(aVal)}&nbsp;&nbsp;\u00b7&nbsp;&nbsp;${esc(bVal)}</span>`);
  }

  _val(hass, entityId, digits, attr) {
    const st = entityId ? hass.states[entityId] : null;
    if (!st) return "\u2014";
    const raw = attr ? st.attributes?.[attr] : st.state;
    const n = Number(raw);
    const unit = unitaBella(st.attributes?.unit_of_measurement);
    // se l'attributo non c'e' ancora (contatore appena creato) meglio una
    // lineetta che la scritta "undefined"
    if (raw === undefined || raw === null || raw === "") return "\u2014";
    const num = Number.isFinite(n) && digits != null ? (numero(n, digits) ?? n.toFixed(digits)) : raw;
    return `${num}${unit ? " " + unit : ""}`;
  }

  _openMeterChart(entityId, title, color) {
    if (!entityId) return;
    this._openDialog(
      title,
      `<div class="dm-ap-sec"><div class="dm-ap-sec-cap">Ultime 6 ore</div><div class="dm-ap-chart-loading" data-chart="6h">Caricamento...</div></div>`,
    );
    const overlay = this._root.querySelector(".dm-ap-overlay");
    const slot = overlay?.querySelector('[data-chart="6h"]');
    this._storia(entityId, 6)
      .then((points) => {
        const el = overlay?.querySelector('[data-chart="6h"]');
        if (!el) return;
        const labels = this._labelSpans(points, 7, (p) => p.t.toLocaleTimeString(laLocale(), { hour: "2-digit", minute: "2-digit" }));
        el.outerHTML = `<div data-chart="6h">${this._lineChartSvg(points, color)}${labels}</div>`;
      })
      .catch(() => {
        if (slot) slot.textContent = "Errore caricamento dati";
      });
  }

  _openPowerHistory() {
    const cfg = this._config;
    if (!cfg.power_entity) {
      this._openDialog("Andamento potenza",
        '<div class="dm-ap-reset-note">Manca la presa che misura i Watt: si sceglie nel suo editor.</div>');
      return;
    }
    this._openDialog(
      "Andamento potenza",
      `<div class="dm-ap-sec"><div class="dm-ap-sec-cap">Ultime 24 ore</div><div class="dm-ap-chart-loading" data-chart="24h">Caricamento...</div></div>`,
    );
    const overlay = this._root.querySelector(".dm-ap-overlay");
    const slot = overlay?.querySelector('[data-chart="24h"]');
    this._storia(cfg.power_entity, 24)
      .then((points) => {
        const el = overlay?.querySelector('[data-chart="24h"]');
        if (!el) return;
        const labels = this._labelSpans(points, 7, (p) => p.t.toLocaleTimeString(laLocale(), { hour: "2-digit", minute: "2-digit" }));
        el.outerHTML = `<div data-chart="24h">${this._lineChartSvg(points, "#0ea5e9", this._config.max_power)}${labels}</div>`;
        mirinoGrafico(overlay.querySelector('[data-chart="24h"]'), points,
          (p) => p.t.toLocaleTimeString(laLocale(), { hour: "2-digit", minute: "2-digit" }) + "  " + (Math.round(p.y * 10) / 10) + " W");
      })
      .catch(() => {
        if (slot) slot.textContent = "Errore caricamento dati";
      });
  }

  // --- Il conto voce per voce (aggiunta cash83) ------------------------
  _euro(v) {
    const n = Number(v);
    return Number.isFinite(n) ? `${numero(n, 2)} €` : "—";
  }

  _contoHtml() {
    const cfg = this._config;
    const hass = this._hass;
    const a = (id) => (id && hass.states[id]?.attributes) || {};
    const oggi = a(cfg.bill_today);
    const mese = a(cfg.bill_month);
    const tot = (id) => this._euro(id ? hass.states[id]?.state : null);
    const riga = (label, k, euro = true, colore = null, forte = false) => this._statRow2c(colore, forte, label,
      euro ? this._euro(oggi[k]) : `${numero(oggi[k] ?? 0, 2)} kWh`,
      euro ? this._euro(mese[k]) : `${numero(mese[k] ?? 0, 2)} kWh`);
    return `
      <div class="dm-ap-sec"><div class="dm-ap-sec-cap">Il conto, voce per voce &nbsp;(oggi &middot; mese)</div>
        ${riga("kWh presi dalla rete", "kwh", false, "#3fb4ea")}
        ${riga("Energia", "energia", true, "#2fbfb0")}
        ${riga("Rete e oneri", "rete_e_oneri", true, "#f28c3c")}
        ${riga("Accise", "accise", true, "#a283f2")}
        ${riga("Quota fissa", "quota_fissa", true, "#f06e82")}
        ${riga("IVA", "iva", true, "#8e98a4")}
        ${this._statRow2c("#e2ad1c", true, "Totale", tot(cfg.bill_today), tot(cfg.bill_month))}
      </div>
      <div class="dm-ap-sec"><div class="dm-ap-sec-cap">Fotovoltaico</div>
        ${riga("Risparmio (energia che non hai comprato)", "risparmio_fotovoltaico", true, "#43b86a")}
      </div>`;
  }

  _openConto() {
    this._openDialog("Il conto della luce", this._contoHtml());
  }
  // --- fine aggiunta ----------------------------------------------------

  _openStats() {
    const hass = this._hass;
    const cfg = this._config;
    const val = (id, digits, attr) => this._val(hass, id, digits, attr);

    const periodsHtml = (cfg.periods || [])
      .map((p) => this._statRow2(p.label, val(p.energy, 2), val(p.cost, 2)))
      .join("");

    const prevHtml = (cfg.periods_prev || [])
      .map((p) => this._statRow2(p.label, val(p.energy, 2, p.energy_attr), val(p.cost, 2, p.cost_attr)))
      .join("");

    const weekEntries = Object.entries(cfg.weekdays || {});
    const weekHtml = weekEntries.map(([label, entity]) => this._statRow(label, val(entity, 2))).join("");
    const mediaHtml = cfg.media_entity ? this._statRow("Media settimanale", val(cfg.media_entity, 1)) : "";

    this._openDialog("Statistiche", `
      ${cfg.bill_today || cfg.bill_month ? this._contoHtml() : ""}
      <div class="dm-ap-sec"><div class="dm-ap-sec-cap">Consumi per periodo</div>${periodsHtml}</div>
      ${prevHtml ? `<div class="dm-ap-sec"><div class="dm-ap-sec-cap">Periodo precedente</div>${prevHtml}</div>` : ""}
      ${weekHtml ? `<div class="dm-ap-sec"><div class="dm-ap-sec-cap">Ultimi 7 giorni</div>${weekHtml}${mediaHtml}</div>` : ""}
    `);
    const overlay = this._root.querySelector(".dm-ap-overlay");
    const chartBtn = document.createElement("button");
    chartBtn.type = "button";
    chartBtn.className = "dm-ap-action-btn";
    chartBtn.style.width = "100%";
    chartBtn.style.marginTop = "2px";
    chartBtn.textContent = "Andamento potenza (24h)";
    chartBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      this._openPowerHistory();
    });
    overlay.querySelector(".dm-ap-dialog-body").appendChild(chartBtn);
  }

  // --- Top consumo automatico (aggiunta cash83) -----------------------
  // Tutti i sensori con device_class "power" in W/kW, tranne il totale casa e
  // quelli che contengono una delle parole di top_exclude (produzione, batterie...).
  _autoLoads(hass) {
    const cfg = this._config;
    // `top_exclude` SOSTITUISCE l'elenco di serie; `top_exclude_piu` ci si
    // aggiunge, che e' quasi sempre quello che uno vuole
    const excl = (cfg.top_exclude || ESCLUSI_DI_SERIE)
      .concat(cfg.top_exclude_piu || [])
      .map((p) => String(p).toLowerCase());
    const incl = new Set(cfg.top_include || []);
    const loads = [];
    Object.values(hass.states).forEach((st) => {
      const id = st.entity_id;
      if (!id.startsWith("sensor.") || id === cfg.power_entity) return;
      const a = st.attributes || {};
      if (!incl.has(id)) {
        if (a.device_class !== "power") return;
        if (excl.some((p) => id.toLowerCase().includes(p))) return;
      }
      let w = Number(st.state);
      if (!Number.isFinite(w)) return;
      const unit = String(a.unit_of_measurement || "W");
      if (unit === "kW") w *= 1000;
      else if (unit !== "W") return;
      const label = String(a.friendly_name || id)
        .replace(/\s+(potenza|power)\s*$/i, "").replace(/\s{2,}/g, " ").trim();
      loads.push({ label, entity: id, live: Math.max(0, w) });
    });
    loads.sort((x, y) => y.live - x.live);
    const tot = Number(hass.states[cfg.power_entity]?.state);
    const misurato = loads.reduce((t, l) => t + l.live, 0);
    const non = Number.isFinite(tot) ? Math.max(0, tot - misurato) : null;
    // Se le prese sommate superano la casa, da qualche parte c'e' un doppione:
    // quasi sempre un sensore che e' il TOTALE di altri gia' contati. Non posso
    // saperlo da solo (nessuno me lo dice), ma posso dirlo invece di far finta
    // che il non misurato sia zero.
    const doppione = Number.isFinite(tot) && misurato > tot + Math.max(20, tot * 0.05);
    return { loads, non, tot, doppione, misurato };
  }

  // Quali barre far vedere adesso: o quelle scritte nell'editor, o - se hai
  // scelto "le piu' accese" - le prime della casa in questo momento.
  // le scatole delle barre, quante ne servono
  _rifaiBarre(quante) {
    const metersEl = this._root.querySelector(".dm-ap-meters");
    if (!metersEl) return;
    metersEl.innerHTML = "";
    for (let i = 0; i < quante; i++) {
      const div = document.createElement("div");
      div.className = "dm-ap-meter dm-c-meter-clickable";
      div.dataset.circuitIndex = i;
      div.innerHTML = `<div class="dm-ap-meter-row"><span class="dm-e-c-name"></span><strong class="dm-e-c-val">0 W</strong></div>
        <div class="dm-ap-bar"><i class="dm-e-c-bar" style="width:0%"></i></div>`;
      div.addEventListener("click", (e) => {
        e.stopPropagation();
        const q = div._circuito;
        if (q) this._openMeterChart(q.entity, q.label, "#38bdf8");
      });
      metersEl.appendChild(div);
    }
  }

  _barre(hass) {
    const cfg = this._config;
    if (cfg.barre_vive) {
      const quante = Number(cfg.barre_quante) || 6;
      const { loads } = this._autoLoads(hass);
      const scala = (w) => Math.min(3500, Math.max(500, Math.ceil((w || 0) * 1.3 / 500) * 500));
      // il fondo scala me lo ricordo: se no la barra si riscala mentre guardi
      this._scale = this._scale || {};
      return loads.slice(0, quante).map((l, ordine) => {
        const m = Math.max(this._scale[l.entity] || 0, scala(l.live));
        this._scale[l.entity] = m;
        return { c: { label: l.label, entity: l.entity, max: m }, ordine, live: l.live };
      });
    }
    const lista = (cfg.circuits || []).map((c, ordine) => {
      const v = Number(hass.states[c.entity]?.state);
      return { c, ordine, live: Number.isFinite(v) ? Math.max(0, v) : 0 };
    });
    if (cfg.barre_in_ordine !== false) lista.sort((a, b) => b.live - a.live || a.ordine - b.ordine);
    return lista;
  }

  _topText(hass) {
    const cfg = this._config;
    if (!cfg.top_auto) return cfg.top_entity ? (hass.states[cfg.top_entity]?.state ?? "—") : "—";
    const { loads, non } = this._autoLoads(hass);
    const min = cfg.top_min_w ?? 5;
    let best = loads[0] && loads[0].live >= min ? loads[0] : null;
    if (non !== null && non >= min && (!best || non > best.live)) {
      best = { label: cfg.unmeasured_label || "Non misurato", live: non };
    }
    return best ? `${best.label}: ${Math.round(best.live)} W` : "Nessuno";
  }

  _openConsumi() {
    const cfg = this._config;
    if (!cfg.top_auto) return this._openConsumiOriginale();
    const hass = this._hass;
    const { loads, non, tot, doppione, misurato } = this._autoLoads(hass);
    const righe = loads.slice();
    if (non !== null) righe.push({ label: cfg.unmeasured_label || "Non misurato", live: non, non: true });
    righe.sort((x, y) => y.live - x.live);
    const rows = righe.map((c) => this._statRow(c.label, `${numero(c.live, 0)} W`)).join("");
    // se le prese sommate superano la casa c'e' un doppione (di solito un
    // sensore che e' gia' la somma di altri): dirlo, invece di mostrare un
    // "Non misurato" schiacciato a zero che sembra giusto e non lo e'
    const avviso = doppione
      ? `<div class="dm-ap-reset-note">Le prese sommate fanno ${Math.round(misurato)} W ma la casa
         ne misura ${Math.round(tot)}: qualcuna è contata due volte, di solito un sensore che
         è già la somma di altri. Si toglie dall'editor, in
         «Parole che fanno escludere un sensore».</div>`
      : "";
    this._openDialog("Consumi", `
      <div class="dm-ap-sec"><div class="dm-ap-sec-cap">In evidenza</div>${this._statRow("Top consumo", this._topText(hass))}${Number.isFinite(tot) ? this._statRow("Totale casa", `${tot.toFixed(0)} W`) : ""}</div>
      <div class="dm-ap-sec"><div class="dm-ap-sec-cap">Tutte le prese e i sensori (live)</div>${rows}${avviso}</div>
    `);
  }
  // --- fine aggiunta ----------------------------------------------------

  _openConsumiOriginale() {
    const hass = this._hass;
    const cfg = this._config;
    const circuits = (cfg.circuits || [])
      .map((c) => ({ ...c, live: Number(hass.states[c.entity]?.state) || 0 }))
      .sort((a, b) => b.live - a.live);

    const rows = circuits.map((c) => this._statRow(c.label, `${numero(c.live, 0)} W`)).join("");
    const topSt = cfg.top_entity ? hass.states[cfg.top_entity]?.state : null;

    this._openDialog("Circuiti", `
      ${topSt ? `<div class="dm-ap-sec"><div class="dm-ap-sec-cap">In evidenza</div>${this._statRow("Top consumo", topSt)}</div>` : ""}
      <div class="dm-ap-sec"><div class="dm-ap-sec-cap">Tutti i circuiti (live)</div>${rows}</div>
    `);
  }

  set hass(hass) {
    this._hass = hass;
    scegliLingua(hass);
    if (!this._config) return;
    // Il disegno lo facciamo in setConfig, che Home Assistant chiama PRIMA di
    // darci hass: la prima volta la lingua non la sapevamo ancora. Adesso la
    // sappiamo: se non e' quella di prima, rifaccio il disegno una volta sola.
    if (this._linguaDisegnata !== laLingua()) {
      this._linguaDisegnata = laLingua();
      this.setConfig(this._config);
    }
    // Home Assistant passa di qui a ogni cambio di stato di TUTTA la casa.
    // Invece di rifare tutto il disegno per ognuno, i cambi che arrivano
    // insieme li raggruppo: disegno una volta sola, con l'ultimo valore.
    const adesso = Date.now();
    if (this._ultimoGiro && adesso - this._ultimoGiro < 150) {
      if (!this._giroDopo) {
        this._giroDopo = setTimeout(() => {
          this._giroDopo = 0;
          if (this.isConnected || this._root) this.hass = this._hass;
        }, 150);
      }
      return;
    }
    this._ultimoGiro = adesso;

    const cfg = this._config;

    const watt = Number(hass.states[cfg.power_entity]?.state);
    const wattVal = Number.isFinite(watt) ? Math.max(0, watt) : 0;
    // La tariffa: gli aiutanti hanno un nome fisso, li creo io dal riquadro
    // "La tua tariffa". Servono a fare i conti qui, senza sensori in mezzo.
    const tariffa = (() => {
      const n = (id) => Number((hass.states[id] || {}).state);
      return {
        energia: n("input_number.prezzo_luce_energia"),
        totale: n("input_number.prezzo_energia"),
        quota: n("input_number.quota_fissa_energia_giorno"),
      };
    })();
    const wattText = this._root.querySelector(".dm-e-watt");
    if (wattText) wattText.textContent = numero(wattVal, 0);

    // I periodi si cercano per NOME: se l'elenco ne ha meno di quattro (un
    // contatore cancellato, uno non creato) le posizioni slittano e la
    // casella mostrerebbe la settimana chiamandola "oggi".
    const periodo = (nome, posto) => {
      const l = cfg.periods || [];
      return l.find((p) => String(p.label || "").trim().toLowerCase() === nome) || l[posto];
    };
    const pOggi = periodo("oggi", 1);
    const pMese = periodo("mese", 3);
    if (pOggi) {
      { const x = this._root.querySelector(".dm-e-today-kwh"); if (x) x.textContent = this._val(hass, pOggi.energy, 2); }
      { const x = this._root.querySelector(".dm-e-today-cost");
        if (x) {
          const k = Number((hass.states[pOggi.energy] || {}).state);
          x.textContent = hass.states[pOggi.cost] ? this._val(hass, pOggi.cost, 2)
            : (Number.isFinite(k) && tariffa.totale > 0
              ? this._euro(k * tariffa.totale + (tariffa.quota || 0)) : "\u2014");
        } }
    }
    if (pMese) {
      { const x = this._root.querySelector(".dm-e-month-cost");
        if (x) {
          const k = Number((hass.states[pMese.energy] || {}).state);
          x.textContent = hass.states[pMese.cost] ? this._val(hass, pMese.cost, 2)
            : (Number.isFinite(k) && tariffa.totale > 0
              ? this._euro(k * tariffa.totale + (tariffa.quota || 0) * new Date().getDate()) : "\u2014");
        } }
      { const x = this._root.querySelector(".dm-e-month-kwh"); if (x) x.textContent = this._val(hass, pMese.energy, 2); }
    }
    {
      // la riga della bolletta: il bimestre, kWh e euro insieme
      const x = this._root.querySelector(".dm-e-bolletta");
      if (x) {
        const kwh = cfg.bolletta_energia ? this._val(hass, cfg.bolletta_energia, 1) : "";
        // il contatore degli euro si chiama "EUR": lo scrivo col simbolo
        let euro = cfg.bolletta_costo && hass.states[cfg.bolletta_costo]
          ? this._euro(hass.states[cfg.bolletta_costo].state) : "";
        if (!euro && cfg.bolletta_energia && tariffa.totale > 0) {
          const st = hass.states[cfg.bolletta_energia];
          const k = Number(st?.state);
          const da = st?.attributes?.last_reset ? new Date(st.attributes.last_reset) : null;
          const gg = da ? Math.max(1, Math.floor((Date.now() - da.getTime()) / 86400000) + 1) : 1;
          if (Number.isFinite(k)) euro = this._euro(k * tariffa.totale + (tariffa.quota || 0) * gg);
        }
        x.textContent = [kwh, euro].filter(Boolean).join(" \u00b7 ") || "\u2014";
      }
    }
    { const x = this._root.querySelector(".dm-e-top"); if (x) x.textContent = this._topText(hass); }
    // i kWh arrivati dai pannelli e dalla batteria: oggi / mese, come il risparmio
    // oggi / settimana / mese: faccio vedere i periodi che esistono davvero
    [[".dm-e-pannelli", "pannelli"], [".dm-e-batteria", "batteria"]].forEach(([sel, chi]) => {
      const x = this._root.querySelector(sel);
      if (!x) return;
      const n = (e) => {
        const st = e ? hass.states[e] : null;
        const v = st ? Number(st.state) : NaN;
        return Number.isFinite(v) ? numero(v, 2) : null;
      };
      const quali = [["oggi", n(cfg[chi + "_oggi"])], ["settimana", n(cfg[chi + "_settimana"])],
        ["mese", n(cfg[chi + "_mese"])]].filter(([, v]) => v !== null);
      x.textContent = quali.length ? quali.map(([, v]) => v).join(" / ") + " kWh" : "\u2014";
      x.title = quali.map(([k]) => k).join(" / ");
    });
    const fvEl = this._root.querySelector(".dm-e-fv");
    if (fvEl) {
      // due numeri in una riga stretta: un simbolo solo e la barra a dividerli
      // (prima era "- 0,37 EUR . 9,58 EUR mese" e non ci stava mai)
      const n = (v) => numero(Number(v) || 0, 2);
      // prima i contatori del risparmio, se la scheda ce li ha; se no gli
      // attributi del conto della bolletta, come si faceva prima
      const daContatore = cfg.risparmio_oggi || cfg.risparmio_mese;
      const oggiFv = daContatore ? hass.states[cfg.risparmio_oggi]?.state
        : hass.states[cfg.bill_today]?.attributes?.risparmio_fotovoltaico;
      const meseFv = daContatore ? hass.states[cfg.risparmio_mese]?.state
        : hass.states[cfg.bill_month]?.attributes?.risparmio_fotovoltaico;
      fvEl.textContent = (daContatore ? cfg.risparmio_mese : cfg.bill_month)
        ? `− ${n(oggiFv)} / ${n(meseFv)} €`
        : this._euro(oggiFv);
      fvEl.title = T("risparmio di oggi / del mese");
    }
    const kwhOggi = pOggi ? Number((hass.states[pOggi.energy] || {}).state) : NaN;
    const senzaEl = this._root.querySelector(".dm-e-senzafv");
    if (senzaEl) {
      const b = hass.states[cfg.bill_today];
      if (b) {
        const a = b.attributes || {};
        senzaEl.textContent = this._euro(Number(b.state) + Number(a.risparmio_fotovoltaico || 0));
      } else if (Number.isFinite(kwhOggi) && tariffa.totale > 0) {
        // quello che pagheresti oggi se i pannelli non ci fossero
        const risp = Number((hass.states[cfg.risparmio_oggi] || {}).state) || 0;
        senzaEl.textContent = this._euro(kwhOggi * tariffa.totale + (tariffa.quota || 0) + risp);
      } else senzaEl.textContent = "\u2014";
    }
    const soloEl = this._root.querySelector(".dm-e-solo");
    if (soloEl) {
      const b = hass.states[cfg.bill_today];
      soloEl.textContent = b ? this._euro(b.attributes?.energia)
        : (Number.isFinite(kwhOggi) && tariffa.energia > 0 ? this._euro(kwhOggi * tariffa.energia) : "\u2014");
    }

    // Le barre si riordinano da sole: chi consuma di piu' sta in cima. A parita'
    // resta l'ordine che hai messo tu nell'editor, se no ballerebbero a vuoto.
    const barre = this._barre(hass);
    const metersEl = this._root.querySelector(".dm-ap-meters");
    if (metersEl && metersEl.children.length !== barre.length) this._rifaiBarre(barre.length);
    barre.forEach(({ c, live }, i) => {
      const el = this._root.querySelector(`[data-circuit-index="${i}"]`);
      if (!el) return;
      el._circuito = c;
      const nome = el.querySelector(".dm-e-c-name");
      if (nome && nome.textContent !== c.label) nome.textContent = c.label;
      el.querySelector(".dm-e-c-val").textContent = `${numero(live, 0)} W`;
      const pct = c.max ? Math.min(100, (live / c.max) * 100) : 0;
      const bar = el.querySelector(".dm-e-c-bar");
      bar.style.width = `${pct}%`;
      bar.style.background = meterSeverityColor(pct);
    });

    [[".dm-ap-power", "interruttore"], [".dm-ap-usb", "interruttore_usb"]].forEach(([sel, chiave]) => {
      const t = this._root.querySelector(sel);
      if (!t) return;
      const st = hass.states[cfg[chiave]]?.state;
      t.classList.toggle("acceso", !!st && !["off", "unavailable", "unknown"].includes(st));
    });

    const warnEl = this._root.querySelector(".dm-ap-warn");
    const soglia = cfg.soglia_entity ? Number(hass.states[cfg.soglia_entity]?.state) : null;
    const card = this._root.querySelector(".dm-ap-card");
    // un sensore non disponibile da' NaN: "NaN != null" e' vero e il
    // confronto sotto e' sempre falso, cosi' l'avviso non sarebbe mai scattato
    if (Number.isFinite(soglia) && wattVal > soglia) {
      warnEl.hidden = false;
      warnEl.textContent = `\u26a0 Soglia superata: ${numero(wattVal, 0)} W (limite ${numero(soglia, 0)} W)`;
      card.classList.add("has-alarm");
    } else {
      warnEl.hidden = true;
      card.classList.remove("has-alarm");
    }
  }

}
