// custom:casa-energia - consumo della casa, costi, circuiti, top consumo automatico.
// Nata dalle schede di Simonz82 (github.com/Simonz82/smart-home-cards),
// che le lascia libere: portata qui dentro il 18/09/2026 per non dipendere
// da un secondo file. Da qui in poi e' codice nostro.

import {
  HERO_BUILDERS,
  CHIP_SVGS,
  ICON_GEAR,
  ICON_CHART,
  ICON_CLOSE,
  ICON_NOTIFCENTER,
  ICON_BOLT,
  ICON_EURO,
  ICON_TREND,
  STYLE,
  esc,
  meterSeverityColor,
} from './elettro-comune.js';
const ICON_SOLE = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
import { ESCLUSI_DI_SERIE } from './elettro-prepara.js';

export class CasaEnergia extends HTMLElement {
  setConfig(config) {
    if (!config.power_entity) throw new Error("power_entity \u00e8 obbligatorio");
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
    this._root = this._root || this.attachShadow({ mode: "open" });
    this._heroId = "en" + Math.random().toString(36).slice(2, 8);
    const hero = (HERO_BUILDERS[this._config.artwork] || HERO_BUILDERS.energy)(this._heroId);
    const chip = CHIP_SVGS[this._config.artwork] || CHIP_SVGS.energy;
    this._root.innerHTML = `<style>${STYLE}</style>
      <article class="dm-ap-card is-run">
        <div class="dm-ap-top">
          <span class="dm-ap-chip">${chip}</span>
          <span class="dm-ap-headings">
            <span class="dm-ap-name"></span>
          </span>
          <span class="dm-ap-badge run"><i class="dm-ap-dot"></i><span class="dm-ap-badge-label">ONLINE</span></span>
          <span class="dm-ap-tools">
            ${this._config.notification_path ? `<button type="button" class="dm-ap-tool dm-ap-notif-center" title="Centro Notifiche">${ICON_NOTIFCENTER}</button>` : ""}
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
              <div class="dm-ap-cycle-row dm-ap-cycle-row-b dm-colore" style="--c:#3fb4ea"><span class="dm-ap-cycle-label"><span class="dm-ap-cycle-ic">${ICON_BOLT}</span><small>Consumo</small></span><b class="dm-e-today-kwh">\u2014</b></div>
              ${this._config.bill_today ? `<div class="dm-ap-cycle-row dm-ap-cycle-row-b dm-colore" style="--c:#f28c3c"><span class="dm-ap-cycle-label"><span class="dm-ap-cycle-ic">${ICON_EURO}</span><small>Energia + tasse</small></span><b class="dm-e-senzafv">\u2014</b></div>` : ""}
              ${this._config.bill_today ? `<div class="dm-ap-cycle-row dm-ap-cycle-row-b dm-colore" style="--c:#43b86a"><span class="dm-ap-cycle-label"><span class="dm-ap-cycle-ic">${ICON_SOLE}</span><small>Risparmio pannelli</small></span><b class="dm-e-fv">\u2014</b></div>` : ""}
              <div class="dm-ap-cycle-row dm-ap-cycle-row-b dm-colore dm-forte" style="--c:#e2ad1c"><span class="dm-ap-cycle-label"><span class="dm-ap-cycle-ic">${ICON_EURO}</span><small>Paghi (+ tasse)</small></span><b class="dm-e-today-cost">\u2014</b></div>
              ${this._config.bill_today ? `<div class="dm-ap-cycle-row dm-ap-cycle-row-b dm-colore" style="--c:#2fbfb0"><span class="dm-ap-cycle-label"><span class="dm-ap-cycle-ic">${ICON_BOLT}</span><small>Energia attuale</small></span><b class="dm-e-solo">\u2014</b></div>` : ""}
              <div class="dm-ap-cycle-row dm-ap-cycle-row-b dm-colore" style="--c:#a283f2"><span class="dm-ap-cycle-label"><span class="dm-ap-cycle-ic">${ICON_EURO}</span><small>Mese (+ tasse)</small></span><b class="dm-e-month-cost">\u2014</b></div>
              <div class="dm-ap-cycle-row dm-ap-cycle-row-b dm-colore" style="--c:#f06e82"><span class="dm-ap-cycle-label"><span class="dm-ap-cycle-ic">${ICON_TREND}</span><small>Top consumo</small></span><b class="dm-e-top">\u2014</b></div>
            </div>
          </div>
        </div>
        <div class="dm-ap-warn" hidden></div>
        <div class="dm-ap-panel">
          <div class="dm-ap-meters"></div>
        </div>
      </article>`;
    this._root.querySelector(".dm-ap-name").textContent = this._config.name;

    // Le prime 4 voci di "circuits" (Generale/Prese/Luce/Cantina nel setup
    // reale) diventano le barre sul fronte, come CPU/RAM sulle altre card;
    // il resto compare solo nel popup Circuiti - stesso split usato per
    // Volume1/Volume2/USB sulla card NAS.
    const metersEl = this._root.querySelector(".dm-ap-meters");
    (this._config.circuits || []).slice(0, 4).forEach((c, i) => {
      const div = document.createElement("div");
      div.className = "dm-ap-meter dm-c-meter-clickable";
      div.dataset.circuitIndex = i;
      div.innerHTML = `<div class="dm-ap-meter-row"><span>${esc(c.label)}</span><strong class="dm-e-c-val">0 W</strong></div>
        <div class="dm-ap-bar"><i class="dm-e-c-bar" style="width:0%"></i></div>`;
      div.addEventListener("click", (e) => {
        e.stopPropagation();
        this._openMeterChart(c.entity, c.label, "#38bdf8");
      });
      metersEl.appendChild(div);
    });

    this._root.querySelector(".dm-ap-notif-center")?.addEventListener("click", (e) => {
      e.stopPropagation();
      history.pushState(null, "", this._config.notification_path);
      window.dispatchEvent(new CustomEvent("location-changed", { bubbles: true, composed: true }));
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

  _row(label, valueHtml) {
    return `<div class="dm-ap-row"><span class="dm-ap-row-label">${esc(label)}</span>${valueHtml}</div>`;
  }

  _openDialog(title, bodyHtml) {
    let overlay = this._root.querySelector(".dm-ap-overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.className = "dm-ap-overlay";
      overlay.hidden = true;
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) overlay.hidden = true;
      });
      this._root.appendChild(overlay);
    }
    overlay.innerHTML = `<div class="dm-ap-dialog">
      <div class="dm-ap-dialog-head"><h3>${esc(title)}</h3><button type="button" class="dm-ap-dialog-close">${ICON_CLOSE}</button></div>
      <div class="dm-ap-dialog-body">${bodyHtml}</div>
    </div>`;
    overlay.querySelector(".dm-ap-dialog-close").addEventListener("click", () => {
      overlay.hidden = true;
    });
    overlay.hidden = false;
    return overlay;
  }

  _settingsRowHtml(hass, row) {
    const st = hass.states[row.entity];
    if (!st) return this._row(row.label, `<span class="dm-ap-row-val">n/d</span>`);
    const domain = row.entity.split(".")[0];
    if (["input_boolean", "automation", "switch"].includes(domain)) {
      const on = st.state === "on";
      return this._row(
        row.label,
        `<button type="button" class="dm-ap-switch${on ? " on" : ""}" data-entity="${esc(row.entity)}" aria-pressed="${on}"></button>`,
      );
    }
    const unit = st.attributes?.unit_of_measurement || "";
    return `<div class="dm-ap-row" data-open-entity="${esc(row.entity)}" style="cursor:pointer">
      <span class="dm-ap-row-label">${esc(row.label)}</span>
      <span class="dm-ap-row-val">${esc(st.state)}${unit ? " " + esc(unit) : ""}</span>
    </div>`;
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
      .map(
        (sec) => `<div class="dm-ap-sec">
          <div class="dm-ap-sec-cap">${esc(sec.title)}</div>
          ${sec.rows.map((row) => this._settingsRowHtml(hass, row)).join("")}
        </div>`,
      )
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

    const overlay = this._openDialog(
      "Impostazioni",
      `${sections}${switchesHtml ? `<div class="dm-ap-sec"><div class="dm-ap-sec-cap">Interruttori</div>${switchesHtml}</div>` : ""}${actionsHtml}`,
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
    const unit = st.attributes?.unit_of_measurement || "";
    const num = Number.isFinite(n) && digits != null ? n.toFixed(digits) : raw;
    return `${num}${unit ? " " + unit : ""}`;
  }

  _fmtAxis(v) {
    if (!Number.isFinite(v)) return "0";
    const s = Math.abs(v) >= 10 ? v.toFixed(0) : v.toFixed(1);
    return s.endsWith(".0") ? s.slice(0, -2) : s;
  }

  _smoothPath(coords) {
    if (coords.length < 3) {
      return `M ${coords.map((c) => `${c[0].toFixed(1)},${c[1].toFixed(1)}`).join(" L ")}`;
    }
    let d = `M ${coords[0][0].toFixed(1)},${coords[0][1].toFixed(1)}`;
    for (let i = 1; i < coords.length - 1; i++) {
      const [x0, y0] = coords[i];
      const [x1, y1] = coords[i + 1];
      const mx = (x0 + x1) / 2;
      const my = (y0 + y1) / 2;
      d += ` Q ${x0.toFixed(1)},${y0.toFixed(1)} ${mx.toFixed(1)},${my.toFixed(1)}`;
    }
    const last = coords[coords.length - 1];
    d += ` L ${last[0].toFixed(1)},${last[1].toFixed(1)}`;
    return d;
  }

  _lineChartSvg(points, color, fixedMax) {
    if (!points.length) return `<div class="dm-ap-chart-empty">Nessun dato</div>`;
    const width = 300;
    const height = 90;
    const plotX0 = 24;
    const plotW = width - plotX0;
    const values = points.map((p) => p.y);
    const min = fixedMax ? 0 : Math.min(...values, 0);
    const max = fixedMax ? Math.max(fixedMax, ...values) : Math.max(...values, min + 1);
    const range = max - min || 1;
    const stepX = points.length > 1 ? plotW / (points.length - 1) : 0;
    const coords = points.map((p, i) => [plotX0 + i * stepX, height - ((p.y - min) / range) * (height - 6) - 3]);
    const lineD = this._smoothPath(coords);
    const areaD = `${lineD} L ${coords[coords.length - 1][0].toFixed(1)},${height} L ${coords[0][0].toFixed(1)},${height} Z`;
    return `<svg viewBox="0 0 ${width} ${height}" class="dm-ap-chart-svg" preserveAspectRatio="none">
      <line x1="${plotX0}" y1="3" x2="${plotX0}" y2="${height - 3}" stroke="#94a3b840" stroke-width="1"/>
      <text x="${plotX0 - 4}" y="8" text-anchor="end" font-size="10" font-weight="800" fill="#94a3b8">${this._fmtAxis(max)}</text>
      <text x="${plotX0 - 4}" y="${height - 3}" text-anchor="end" font-size="10" font-weight="800" fill="#94a3b8">${this._fmtAxis(min)}</text>
      <path d="${areaD}" fill="${color}" opacity="0.14"/>
      <path d="${lineD}" fill="none" stroke="${color}" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"/>
    </svg>`;
  }

  _labelSpans(items, count, formatFn) {
    if (!items.length) return "";
    const n = Math.min(count, items.length);
    const idxs = [];
    for (let i = 0; i < n; i++) {
      idxs.push(n === 1 ? 0 : Math.round((i * (items.length - 1)) / (n - 1)));
    }
    const seen = new Set();
    const unique = idxs.filter((i) => (seen.has(i) ? false : (seen.add(i), true)));
    return `<div class="dm-ap-chart-labels">${unique.map((i) => `<span>${formatFn(items[i], i)}</span>`).join("")}</div>`;
  }

  async _fetchHistory6h(entityId) {
    const end = new Date();
    const start = new Date(end.getTime() - 6 * 3600 * 1000);
    const result = await this._hass.connection.sendMessagePromise({
      type: "history/history_during_period",
      start_time: start.toISOString(),
      end_time: end.toISOString(),
      entity_ids: [entityId],
      minimal_response: true,
      no_attributes: true,
    });
    const rows = result?.[entityId] || [];
    return rows
      .map((r) => ({ t: new Date((r.lu || r.last_updated_ts) * 1000 || r.last_updated), y: Number(r.s ?? r.state) }))
      .filter((p) => Number.isFinite(p.y));
  }

  _openMeterChart(entityId, title, color) {
    if (!entityId) return;
    this._openDialog(
      title,
      `<div class="dm-ap-sec"><div class="dm-ap-sec-cap">Ultime 6 ore</div><div class="dm-ap-chart-loading" data-chart="6h">Caricamento...</div></div>`,
    );
    const overlay = this._root.querySelector(".dm-ap-overlay");
    const slot = overlay?.querySelector('[data-chart="6h"]');
    this._fetchHistory6h(entityId)
      .then((points) => {
        const el = overlay?.querySelector('[data-chart="6h"]');
        if (!el) return;
        const labels = this._labelSpans(points, 7, (p) => p.t.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" }));
        el.outerHTML = `<div data-chart="6h">${this._lineChartSvg(points, color)}${labels}</div>`;
      })
      .catch(() => {
        if (slot) slot.textContent = "Errore caricamento dati";
      });
  }

  _openPowerHistory() {
    const cfg = this._config;
    this._openDialog(
      "Andamento potenza",
      `<div class="dm-ap-sec"><div class="dm-ap-sec-cap">Ultime 24 ore</div><div class="dm-ap-chart-loading" data-chart="24h">Caricamento...</div></div>`,
    );
    const overlay = this._root.querySelector(".dm-ap-overlay");
    const slot = overlay?.querySelector('[data-chart="24h"]');
    (async () => {
      const end = new Date();
      const start = new Date(end.getTime() - 24 * 3600 * 1000);
      const result = await this._hass.connection.sendMessagePromise({
        type: "history/history_during_period",
        start_time: start.toISOString(),
        end_time: end.toISOString(),
        entity_ids: [cfg.power_entity],
        minimal_response: true,
        no_attributes: true,
      });
      const rows = result?.[cfg.power_entity] || [];
      return rows
        .map((r) => ({ t: new Date((r.lu || r.last_updated_ts) * 1000 || r.last_updated), y: Number(r.s ?? r.state) }))
        .filter((p) => Number.isFinite(p.y));
    })()
      .then((points) => {
        const el = overlay?.querySelector('[data-chart="24h"]');
        if (!el) return;
        const labels = this._labelSpans(points, 7, (p) => p.t.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" }));
        el.outerHTML = `<div data-chart="24h">${this._lineChartSvg(points, "#0ea5e9", this._config.max_power)}${labels}</div>`;
      })
      .catch(() => {
        if (slot) slot.textContent = "Errore caricamento dati";
      });
  }

  // --- Il conto voce per voce (aggiunta cash83) ------------------------
  _euro(v) {
    const n = Number(v);
    return Number.isFinite(n) ? `${n.toFixed(2)} €` : "—";
  }

  _contoHtml() {
    const cfg = this._config;
    const hass = this._hass;
    const a = (id) => (id && hass.states[id]?.attributes) || {};
    const oggi = a(cfg.bill_today);
    const mese = a(cfg.bill_month);
    const tot = (id) => this._euro(id ? hass.states[id]?.state : null);
    const riga = (label, k, euro = true, colore = null, forte = false) => this._statRow2c(colore, forte, label,
      euro ? this._euro(oggi[k]) : `${Number(oggi[k] ?? 0).toFixed(2)} kWh`,
      euro ? this._euro(mese[k]) : `${Number(mese[k] ?? 0).toFixed(2)} kWh`);
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
      .map((p) => this._statRow2(p.label, val(p.energy, 2, p.energy_attr), val(p.cost, 2)))
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
    const excl = (cfg.top_exclude || ESCLUSI_DI_SERIE).map((p) => String(p).toLowerCase());
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
    return { loads, non, tot };
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
    const { loads, non, tot } = this._autoLoads(hass);
    const righe = loads.slice();
    if (non !== null) righe.push({ label: cfg.unmeasured_label || "Non misurato", live: non, non: true });
    righe.sort((x, y) => y.live - x.live);
    const rows = righe.map((c) => this._statRow(c.label, `${c.live.toFixed(0)} W`)).join("");
    this._openDialog("Consumi", `
      <div class="dm-ap-sec"><div class="dm-ap-sec-cap">In evidenza</div>${this._statRow("Top consumo", this._topText(hass))}${Number.isFinite(tot) ? this._statRow("Totale casa", `${tot.toFixed(0)} W`) : ""}</div>
      <div class="dm-ap-sec"><div class="dm-ap-sec-cap">Tutte le prese e i sensori (live)</div>${rows}</div>
    `);
  }
  // --- fine aggiunta ----------------------------------------------------

  _openConsumiOriginale() {
    const hass = this._hass;
    const cfg = this._config;
    const circuits = (cfg.circuits || [])
      .map((c) => ({ ...c, live: Number(hass.states[c.entity]?.state) || 0 }))
      .sort((a, b) => b.live - a.live);

    const rows = circuits.map((c) => this._statRow(c.label, `${c.live.toFixed(0)} W`)).join("");
    const topSt = cfg.top_entity ? hass.states[cfg.top_entity]?.state : null;

    this._openDialog("Circuiti", `
      ${topSt ? `<div class="dm-ap-sec"><div class="dm-ap-sec-cap">In evidenza</div>${this._statRow("Top consumo", topSt)}</div>` : ""}
      <div class="dm-ap-sec"><div class="dm-ap-sec-cap">Tutti i circuiti (live)</div>${rows}</div>
    `);
  }

  set hass(hass) {
    this._hass = hass;
    if (!this._config) return;
    const cfg = this._config;

    const watt = Number(hass.states[cfg.power_entity]?.state);
    const wattVal = Number.isFinite(watt) ? Math.max(0, watt) : 0;
    const wattText = this._root.querySelector(".dm-e-watt");
    if (wattText) wattText.textContent = wattVal.toFixed(0);

    if (cfg.periods?.[1]) {
      this._root.querySelector(".dm-e-today-kwh").textContent = this._val(hass, cfg.periods[1].energy, 2);
      this._root.querySelector(".dm-e-today-cost").textContent = this._val(hass, cfg.periods[1].cost, 2);
    }
    if (cfg.periods?.[3]) {
      this._root.querySelector(".dm-e-month-cost").textContent = this._val(hass, cfg.periods[3].cost, 2);
    }
    this._root.querySelector(".dm-e-top").textContent = this._topText(hass);
    const fvEl = this._root.querySelector(".dm-e-fv");
    if (fvEl) {
      const oggi = this._euro(hass.states[cfg.bill_today]?.attributes?.risparmio_fotovoltaico);
      fvEl.textContent = cfg.bill_month
        ? `\u2212 ${oggi} \u00b7 ${this._euro(hass.states[cfg.bill_month]?.attributes?.risparmio_fotovoltaico)} mese`
        : oggi;
    }
    const senzaEl = this._root.querySelector(".dm-e-senzafv");
    if (senzaEl) {
      const b = hass.states[cfg.bill_today];
      const a = b?.attributes || {};
      const tot = Number(b?.state) + Number(a.risparmio_fotovoltaico || 0);
      const en = Number(a.energia || 0) + Number(a.risparmio_fotovoltaico_energia || 0);
      senzaEl.textContent = this._euro(tot);
      const senzaEn = this._root.querySelector(".dm-e-senzafv-en");
      if (senzaEn) senzaEn.textContent = this._euro(en);
    }
    const soloEl = this._root.querySelector(".dm-e-solo");
    if (soloEl) soloEl.textContent = this._euro(hass.states[cfg.bill_today]?.attributes?.energia);

    (cfg.circuits || []).slice(0, 4).forEach((c, i) => {
      const el = this._root.querySelector(`[data-circuit-index="${i}"]`);
      if (!el) return;
      const v = Number(hass.states[c.entity]?.state);
      const vVal = Number.isFinite(v) ? Math.max(0, v) : 0;
      el.querySelector(".dm-e-c-val").textContent = `${vVal.toFixed(0)} W`;
      const pct = c.max ? Math.min(100, (vVal / c.max) * 100) : 0;
      const bar = el.querySelector(".dm-e-c-bar");
      bar.style.width = `${pct}%`;
      bar.style.background = meterSeverityColor(pct);
    });

    const warnEl = this._root.querySelector(".dm-ap-warn");
    const soglia = cfg.soglia_entity ? Number(hass.states[cfg.soglia_entity]?.state) : null;
    const card = this._root.querySelector(".dm-ap-card");
    if (soglia != null && wattVal > soglia) {
      warnEl.hidden = false;
      warnEl.textContent = `\u26a0 Soglia superata: ${wattVal.toFixed(0)} W (limite ${soglia.toFixed(0)} W)`;
      card.classList.add("has-alarm");
    } else {
      warnEl.hidden = true;
      card.classList.remove("has-alarm");
    }
  }

  getCardSize() {
    return 7;
  }
}
