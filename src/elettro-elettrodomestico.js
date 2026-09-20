// custom:casa-elettrodomestico - lavatrice, lavastoviglie, forno, asciugatrice...
// Nata dalle schede di Simonz82 (github.com/Simonz82/smart-home-cards),
// che le lascia libere: portata qui dentro il 18/09/2026 per non dipendere
// da un secondo file. Da qui in poi e' codice nostro.

import { mirinoGrafico } from './elettro-comune.js';
import {
  HERO_BUILDERS,
  CHIP_SVGS,
  ICON_GEAR,
  ICON_CHART,
  ICON_CLOSE,
  ICON_RESTART,
  ICON_NOTIFCENTER,
  ICON_BOLT,
  ICON_FLAG,
  ICON_TIMER,
  ICON_EURO,
  WEEKDAY_FULL_IT,
  WEEKDAY_ABBR_IT,
  DEFAULT_STATE_MAP,
  STYLE,
  esc,
  vestiFinestra,
} from './elettro-comune.js';
import { righeInOrdine } from './elettro-righe-editor.js';

// Le righe dell'Ultimo ciclo, col nome che si vede nell'editor.
export const RIGHE_CICLO = [
  { id: "fine", nome: "Fine del ciclo (data e ora)", etichetta: "Fine", colore: "#a283f2" },
  { id: "durata", nome: "Durata del ciclo", etichetta: "Durata", colore: "#2fbfb0" },
  { id: "consumo", nome: "Consumo del ciclo (kWh)", etichetta: "Consumo", colore: "#3fb4ea" },
  { id: "costo", nome: "Costo del ciclo", etichetta: "Costo", colore: "#e2ad1c" },
];

const VUOTO = '<div class="dm-ap-sec"><div class="dm-ap-sec-cap">Niente da impostare</div><div class="dm-ap-reset-note">Qui compaiono i prezzi e gli interruttori che leghi alla scheda: si scelgono nel suo editor, dalla matita della plancia.</div></div>';

export class CasaElettrodomestico extends HTMLElement {
  // Le righe dell'Ultimo ciclo, nell'ordine e coi nomi della configurazione.
  _righeCiclo() {
    const R = {
      fine: `<div class="dm-ap-cycle-row dm-ap-cycle-row-b dm-colore" style="--c:#a283f2"><span class="dm-ap-cycle-label"><span class="dm-ap-cycle-ic">${ICON_FLAG}</span><small>Fine</small></span><b class="dm-c-end">\u2014</b></div>`,
      durata: `<div class="dm-ap-cycle-row dm-ap-cycle-row-b dm-colore" style="--c:#2fbfb0"><span class="dm-ap-cycle-label"><span class="dm-ap-cycle-ic">${ICON_TIMER}</span><small>Durata</small></span><b class="dm-c-duration">\u2014</b></div>`,
      consumo: `<div class="dm-ap-cycle-row dm-ap-cycle-row-b dm-colore" style="--c:#3fb4ea"><span class="dm-ap-cycle-label"><span class="dm-ap-cycle-ic">${ICON_BOLT}</span><small>Consumo</small></span><b class="dm-c-energy">\u2014</b></div>`,
      costo: `<div class="dm-ap-cycle-row dm-ap-cycle-row-b dm-colore" style="--c:#e2ad1c"><span class="dm-ap-cycle-label"><span class="dm-ap-cycle-ic">${ICON_EURO}</span><small>Costo</small></span><b class="dm-c-cost">\u2014</b></div>`,
    };
    return righeInOrdine(this._config, RIGHE_CICLO, R, esc);
  }

  static getConfigElement() {
    return document.createElement("casa-elettrodomestico-editor");
  }

  static getStubConfig(hass) {
    const st = (hass && hass.states) || {};
    const potenza = Object.keys(st).find((k) => k.startsWith("sensor.")
      && (st[k].attributes || {}).device_class === "power") || "";
    return { type: "custom:casa-elettrodomestico", name: "Lavatrice", artwork: "washer", power_entity: potenza };
  }

  setConfig(config) {
    if (!config.power_entity) throw new Error("power_entity \u00e8 obbligatorio");
    this._config = {
      name: "Elettrodomestico",
      artwork: "dishwasher",
      threshold_run: 5,
      threshold_standby: 1,
      max_power: 2200,
      label: "",
      state_map: DEFAULT_STATE_MAP,
      settings_sections: [],
      warn_entities: [],
      period_labels: {
        today: "Oggi",
        yesterday: "Ieri",
        month: "Mese",
        month_prev: "Mese Precedente",
        year: "Anno",
        year_prev: "Anno Precedente",
      },
      ...config,
    };
    this._activePeriod = "today";
    vestiFinestra(this, this._config);
    this._root = this._root || this.attachShadow({ mode: "open" });
    this._heroId = "dw" + Math.random().toString(36).slice(2, 8);
    const hero = (HERO_BUILDERS[this._config.artwork] || HERO_BUILDERS.dishwasher)(this._heroId);
    // niente righe accese = niente riquadro: resta solo l'attuale
    const righe = this._righeCiclo();

    const chip = CHIP_SVGS[this._config.artwork] || CHIP_SVGS.dishwasher;
    this._root.innerHTML = `<style>${STYLE}</style>
      <article class="dm-ap-card">
        ${this._config.label ? `<span class="dm-test-flag">${esc(this._config.label)}</span>` : ""}
        <div class="dm-ap-top">
          <span class="dm-ap-chip">${chip}</span>
          <span class="dm-ap-headings">
            <span class="dm-ap-name"></span>
            <span class="dm-ap-room" hidden></span>
          </span>
          <span class="dm-ap-badge"><i class="dm-ap-dot"></i><span class="dm-ap-badge-label"></span></span>
          <span class="dm-ap-tools">
            ${this._config.notification_path ? `<button type="button" class="dm-ap-tool dm-ap-notif-center" title="Centro Notifiche">${ICON_NOTIFCENTER}</button>` : ""}
            <button type="button" class="dm-ap-tool dm-ap-settings" title="Impostazioni">${ICON_GEAR}</button>
            <button type="button" class="dm-ap-tool dm-ap-stats" title="Statistiche">${ICON_CHART}</button>
          </span>
        </div>
        <div class="dm-ap-top-row">
          <div class="dm-ap-hero">${hero}</div>
          ${righe ? `<div class="dm-ap-cycle-side">
            <span class="dm-ap-cycle-cap">Ultimo ciclo</span>
            <div class="dm-ap-cycle-list">
              ${righe}
            </div>
          </div>` : ""}
        </div>
        <div class="dm-ap-warn" hidden></div>
        <div class="dm-ap-panel dm-ap-power-open" role="button" tabindex="0">
          <div class="dm-ap-meters">
            <div class="dm-ap-meter">
              <div class="dm-ap-meter-row"><span>${esc(this._config.power_label || "Potenza attuale")}</span><strong class="dm-ap-power-val">0 W</strong></div>
              <div class="dm-ap-bar"><i style="width:0%"></i></div>
            </div>
            ${
              this._config.live?.progress_entity
                ? `<div class="dm-ap-meter">
              <div class="dm-ap-meter-row"><span>Avanzamento programma</span><strong class="dm-ap-progress-val">\u2014</strong></div>
              <div class="dm-ap-bar"><i class="dm-ap-progress-bar" style="width:0%"></i></div>
            </div>`
                : ""
            }
          </div>
        </div>
      </article>`;
    this._root.querySelector(".dm-ap-name").textContent = this._config.name;
    if (this._config.room) {
      const room = this._root.querySelector(".dm-ap-room");
      room.hidden = false;
      room.textContent = this._config.room;
    }
    this._root.querySelector(".dm-ap-notif-center")?.addEventListener("click", (e) => {
      e.stopPropagation();
      history.pushState(null, "", this._config.notification_path);
      window.dispatchEvent(new CustomEvent("location-changed", { bubbles: true, composed: true }));
    });
    this._root.querySelector(".dm-ap-settings").addEventListener("click", (e) => {
      e.stopPropagation();
      this._openSettings();
    });
    this._root.querySelector(".dm-ap-stats").addEventListener("click", (e) => {
      e.stopPropagation();
      this._openStats();
    });
    const heroEl = this._root.querySelector(".dm-ap-hero");
    if (heroEl) {
      heroEl.addEventListener("click", (e) => {
        e.stopPropagation();
        this._openWeek();
      });
    }
    const powerEl = this._root.querySelector(".dm-ap-power-open");
    if (powerEl) {
      powerEl.addEventListener("click", (e) => {
        e.stopPropagation();
        this._openPowerHistory();
      });
    }
  }

  _fireMoreInfo(entityId) {
    const e = new Event("hass-more-info", { bubbles: true, composed: true });
    e.detail = { entityId };
    this.dispatchEvent(e);
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

  _row(label, valueHtml) {
    return `<div class="dm-ap-row"><span class="dm-ap-row-label">${esc(label)}</span>${valueHtml}</div>`;
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

    const resetBtn = this._config.reset_script
      ? `<div class="dm-ap-sec">
           <div class="dm-ap-sec-cap">Manutenzione</div>
           <button type="button" class="dm-ap-reset-btn" data-reset-script="${esc(this._config.reset_script)}">${ICON_RESTART} Reset contatori</button>
           ${this._config.reset_date_entity ? `<div class="dm-ap-reset-note">Ultimo reset: ${esc(hass.states[this._config.reset_date_entity]?.state || "\u2014")}</div>` : ""}
         </div>`
      : "";

    // il prezzo scelto per i costi: e' l'unica impostazione che questa scheda
    // ha sempre, e senza di lei l'ingranaggio apriva una finestra vuota
    const prezzo = this._config.prezzo_entita && hass.states[this._config.prezzo_entita]
      ? `<div class="dm-ap-sec"><div class="dm-ap-sec-cap">Prezzo dei costi</div>`
        + this._settingsRowHtml(hass, { entity: this._config.prezzo_entita,
          label: hass.states[this._config.prezzo_entita].attributes.friendly_name || "Prezzo (\u20ac/kWh)" })
        + `</div>`
      : "";
    const dentro = `${sections}${prezzo}${resetBtn}`;
    const overlay = this._openDialog("Impostazioni", dentro.trim() ? dentro : VUOTO);

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
      row.addEventListener("click", () => this._fireMoreInfo(row.dataset.openEntity));
    });
    const reset = overlay.querySelector("[data-reset-script]");
    if (reset) {
      reset.addEventListener("click", () => {
        hass.callService("script", "turn_on", { entity_id: reset.dataset.resetScript });
        overlay.hidden = true;
      });
    }
  }

  _fmtNum(v, digits = 1) {
    const n = Number(v);
    return Number.isFinite(n) ? n.toFixed(digits) : "\u2014";
  }

  _cycleAttr(hass, key) {
    const cfg = this._config;
    if (!cfg.cycle_sensor || !cfg.cycle_attrs?.[key]) return null;
    const st = hass.states[cfg.cycle_sensor];
    return st ? st.attributes?.[cfg.cycle_attrs[key]] : null;
  }

  // Il tempo: dal sensore "history_stats" sono ore con la virgola (1.25),
  // dagli attributi dell'esempio e' gia' una scritta ("1h 15m"). Qui le porto
  // tutte e due alla stessa faccia.
  _tempoLeggibile(st) {
    if (!st) return "\u2014";
    const n = Number(st.state);
    if (!Number.isFinite(n)) return st.state || "\u2014";
    const unita = String(st.attributes.unit_of_measurement || "h").toLowerCase();
    const minuti = Math.round(unita.startsWith("min") ? n : n * 60);
    if (minuti < 60) return minuti + " min";
    return Math.floor(minuti / 60) + "h " + String(minuti % 60).padStart(2, "0") + "m";
  }

  _renderPeriodRow(hass, periodKey) {
    const cfg = this._config;
    const st = cfg.cycle_sensor ? hass.states[cfg.cycle_sensor] : null;
    const attrs = st?.attributes || {};
    const pAttrs = cfg.period_attrs?.[periodKey] || {};
    const s = cfg.stats || {};
    // "ieri"/"mese precedente"/"anno precedente" non sono entita' separate: sono
    // l'attributo "last_period" che i contatori utility_meter (cicli_oggi/mese/anno)
    // popolano da soli al rollover del periodo - stesso dato che usava la vecchia card.
    const CYCLE_SOURCE = {
      today: [s.cycles_today, null],
      yesterday: [s.cycles_today, "last_period"],
      month: [s.cycles_month, null],
      month_prev: [s.cycles_month, "last_period"],
      year: [s.cycles_year, null],
      year_prev: [s.cycles_year, "last_period"],
    };
    const [cyclesEnt, cyclesAttr] = CYCLE_SOURCE[periodKey] || [null, null];
    const cyclesSt = cyclesEnt ? hass.states[cyclesEnt] : null;
    const cycles = cyclesSt ? (cyclesAttr ? (cyclesSt.attributes?.[cyclesAttr] ?? "\u2014") : cyclesSt.state) : "\u2014";
    // se la scheda ha entita' sue per questo periodo (tempo, costo), comandano
    // quelle: sono gli helper che crea il tasto "Crea i sensori base"
    const pEnt = cfg.period_entities?.[periodKey] || {};
    const time = pEnt.time ? this._tempoLeggibile(hass.states[pEnt.time])
      : (pAttrs.time ? attrs[pAttrs.time] ?? "\u2014" : "\u2014");
    const cost = pEnt.cost ? hass.states[pEnt.cost]?.state
      : (pAttrs.cost ? attrs[pAttrs.cost] : null);
    const costTxt = Number.isFinite(Number(cost)) ? `${Number(cost).toFixed(2)} \u20ac` : "\u2014";
    const label = cfg.period_labels[periodKey] || periodKey;
    return `<div class="dm-ap-week-row">
      <div class="dm-ap-week-day">${esc(label)}</div>
      <div class="dm-ap-week-stats cols3">
        <div class="dm-ap-week-stat"><small>Cicli</small><b>${esc(cycles)}</b></div>
        <div class="dm-ap-week-stat"><small>Tempo</small><b>${esc(time)}</b></div>
        <div class="dm-ap-week-stat"><small>Costo</small><b>${costTxt}</b></div>
      </div>
    </div>`;
  }

  _openStats() {
    const hass = this._hass;
    const live = this._config.live || {};

    let liveHtml = "";
    if (live.state_entity) {
      const raw = hass.states[live.state_entity]?.state;
      const mapped = this._config.state_map[raw];
      liveHtml += this._row("Stato apparecchio", `<span class="dm-ap-row-val">${esc(mapped?.label || raw || "n/d")}</span>`);
    }
    if (live.progress_entity) {
      const st = hass.states[live.progress_entity];
      const val = st && st.state !== "unavailable" && st.state !== "unknown" ? `${st.state}%` : "n/d";
      liveHtml += this._row("Avanzamento programma", `<span class="dm-ap-row-val">${esc(val)}</span>`);
    }
    if (live.remaining_entity) {
      const st = hass.states[live.remaining_entity];
      const val = st && st.state !== "unavailable" && st.state !== "unknown" ? new Date(st.state).toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" }) : "n/d";
      liveHtml += this._row("Fine prevista", `<span class="dm-ap-row-val">${esc(val)}</span>`);
    }
    if (live.salt_entity) {
      const st = hass.states[live.salt_entity]?.state;
      liveHtml += this._row("Sale", `<span class="dm-ap-row-val">${st === "off" ? "OK" : "In esaurimento"}</span>`);
    }
    if (live.rinse_entity) {
      const st = hass.states[live.rinse_entity]?.state;
      liveHtml += this._row("Brillantante", `<span class="dm-ap-row-val">${st === "off" ? "OK" : "In esaurimento"}</span>`);
    }
    // Righe extra generiche per apparecchi con sensori/attributi che non
    // rientrano nei campi fissi sopra (es. fase ciclo di un'asciugatrice,
    // blocco bambini, volume/sorgente di una TV...).
    (live.extra || []).forEach((row) => {
      const st = hass.states[row.entity];
      if (!st) return;
      const raw = row.attribute ? st.attributes?.[row.attribute] : st.state;
      let val;
      if (raw === undefined || raw === null || raw === "") {
        val = "n/d";
      } else if (row.value_map) {
        val = row.value_map[raw] ?? row.fallback_label ?? raw;
      } else if (row.boolean) {
        val = raw === (row.on_state ?? "on") ? row.on_label || "Attivo" : row.off_label || "OK";
      } else if (row.format === "percent") {
        const n = Number(raw);
        val = Number.isFinite(n) ? `${Math.round(n * 100)}%` : "n/d";
      } else if (row.format === "time") {
        const d = new Date(raw);
        val = Number.isFinite(d.getTime()) ? d.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" }) : raw;
      } else {
        val = row.unit ? `${raw}${row.unit}` : raw;
      }
      liveHtml += this._row(row.label, `<span class="dm-ap-row-val">${esc(val)}</span>`);
    });

    // Se l'apparecchio non racconta niente di se' (nessuna integrazione sua,
    // solo la presa che misura), invece di una finestra muta dico quello che
    // so davvero: i Watt di adesso e se sta lavorando.
    const suoi = !!liveHtml;   // l'apparecchio racconta qualcosa di se'?
    if (!liveHtml) {
      const cfg = this._config;
      const st = cfg.power_entity ? hass.states[cfg.power_entity] : null;
      if (st) {
        const unita = cfg.power_unit || st.attributes.unit_of_measurement || "W";
        liveHtml += this._row(cfg.power_label || "Potenza attuale",
          `<span class="dm-ap-row-val">${esc(st.state)} ${esc(unita)}</span>`);
        const n = Number(st.state);
        const soglia = Number(cfg.threshold_run);
        if (Number.isFinite(n) && Number.isFinite(soglia)) {
          liveHtml += this._row("Sta lavorando",
            `<span class="dm-ap-row-val">${n > soglia ? "Sì" : "No"} (sopra ${soglia} ${esc(unita)})</span>`);
        }
      }
    }

    this._openDialog("Stato", `
      ${liveHtml ? `<div class="dm-ap-sec"><div class="dm-ap-sec-cap">In tempo reale</div>${liveHtml}</div>` : ""}
      ${suoi ? "" : `<div class="dm-ap-reset-note">Programma, tempo residuo, porta: compaiono
        solo se l'apparecchio è collegato con la sua integrazione. Misurato solo dalla presa,
        Home Assistant ne conosce i Watt e basta.</div>`}
    `);
  }

  // Le caselle "week_rows" sono 7 contenitori fissi per nome del giorno
  // (Lunedi..Domenica), riscritti dal package uno alla volta quando quel
  // giorno della settimana si conclude - non una finestra "ultimi 7 giorni"
  // gia' in ordine. Qui li riordiniamo partendo da ieri e andando indietro,
  // cosi' l'elenco corrisponde davvero agli ultimi 7 giorni di calendario
  // (se oggi e' venerdi: giovedi, mercoledi, ... venerdi scorso), con la
  // data accanto per togliere ogni ambiguita'.
  // I SETTE GIORNI, presi dall'attributo `giorni` del sensore del ciclo:
  // {"0": {c: cicli, m: minuti, e: euro}, ...} con 0 = lunedi. Il giorno di
  // oggi non e' ancora dentro (ci va a mezzanotte): lo leggo dal vivo.
  _settimanaDaAttributo(hass) {
    const cfg = this._config;
    const st = cfg.cycle_sensor ? hass.states[cfg.cycle_sensor] : null;
    if (!st) return "";
    const giorni = st.attributes?.[cfg.week_attr || "giorni"] || {};
    const min2txt = (v) => {
      const n = Math.round(Number(v) || 0);
      if (!n) return "0 min";
      return n < 60 ? n + " min" : Math.floor(n / 60) + "h " + String(n % 60).padStart(2, "0") + "m";
    };
    const oggi = new Date();
    const righe = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(oggi);
      d.setDate(d.getDate() - i);
      const lun0 = (d.getDay() + 6) % 7;          // 0 = lunedi, come in Python
      const dato = i === 0
        ? { c: st.attributes?.cicli_oggi, m: st.attributes?.min_oggi, e: st.attributes?.costo_oggi }
        : giorni[String(lun0)];
      const etichetta = `${WEEKDAY_ABBR_IT[d.getDay()]} ${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
      const vuoto = !dato || (dato.c === undefined && dato.m === undefined && dato.e === undefined);
      const costo = Number(dato?.e);
      righe.push(`<div class="dm-ap-week-row">
        <div class="dm-ap-week-day">${esc(etichetta)}${i === 0 ? " (oggi)" : ""}</div>
        <div class="dm-ap-week-stats cols3">
          <div class="dm-ap-week-stat"><small>Cicli</small><b>${vuoto ? "\u2014" : esc(String(Number(dato.c) || 0))}</b></div>
          <div class="dm-ap-week-stat"><small>Tempo</small><b>${vuoto ? "\u2014" : esc(min2txt(dato.m))}</b></div>
          <div class="dm-ap-week-stat"><small>Costo</small><b>${vuoto || !Number.isFinite(costo) ? "\u2014" : costo.toFixed(2) + " \u20ac"}</b></div>
        </div>
      </div>`);
    }
    return righe.join("");
  }

  _orderedWeekRows() {
    const rows = this._config.week_rows || [];
    const byDay = {};
    rows.forEach((r) => {
      byDay[r.day] = r;
    });
    const today = new Date();
    const ordered = [];
    for (let i = 1; i <= 7; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dow = d.getDay();
      const row = byDay[WEEKDAY_FULL_IT[dow]];
      if (!row) continue;
      const dd = String(d.getDate()).padStart(2, "0");
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      ordered.push({ ...row, _label: `${WEEKDAY_ABBR_IT[dow]} ${dd}/${mm}` });
    }
    return ordered;
  }

  _openWeek() {
    const hass = this._hass;
    const periods = Object.keys({ ...(this._config.period_attrs || {}),
      ...(this._config.period_entities || {}) });
    const periodRows = periods.map((p) => this._renderPeriodRow(hass, p)).join("");

    const daAttributo = this._settimanaDaAttributo(hass);
    const rows = this._orderedWeekRows();
    const body = rows
      .map((row) => {
        const cicli = hass.states[row.cicli]?.state ?? "\u2014";
        const tempo = hass.states[row.tempo]?.state ?? "\u2014";
        const consumoNum = Number(hass.states[row.consumo]?.state);
        const consumo = Number.isFinite(consumoNum) ? `${consumoNum.toFixed(2)} kWh` : "\u2014";
        const costoNum = Number(hass.states[row.costo]?.state);
        const costo = Number.isFinite(costoNum) ? `${costoNum.toFixed(2)} \u20ac` : "\u2014";
        return `<div class="dm-ap-week-row">
          <div class="dm-ap-week-day">${esc(row._label)}</div>
          <div class="dm-ap-week-stats">
            <div class="dm-ap-week-stat"><small>Cicli</small><b>${esc(cicli)}</b></div>
            <div class="dm-ap-week-stat"><small>Tempo</small><b>${esc(tempo)}</b></div>
            <div class="dm-ap-week-stat"><small>Consumo</small><b>${consumo}</b></div>
            <div class="dm-ap-week-stat"><small>Costo</small><b>${costo}</b></div>
          </div>
        </div>`;
      })
      .join("");

    this._openDialog("Statistiche", `
      ${periodRows ? `<div class="dm-ap-sec"><div class="dm-ap-sec-cap">Consumi per periodo</div><div class="dm-ap-week-list">${periodRows}</div></div>` : ""}
      <div class="dm-ap-sec">
        <div class="dm-ap-sec-cap">Ultimi 7 giorni</div>
        <div class="dm-ap-week-list">${daAttributo || body || `<div class="dm-ap-row-val">Nessun dato configurato</div>`}</div>
      </div>
    `);
  }

  // -- grafici potenza (linea 24h + istogrammi mese/anno) ------------------
  // Nessuna libreria esterna: SVG disegnato a mano, dati presi dalla cronologia
  // e dalle statistiche a lungo termine di Home Assistant via WebSocket.

  _fmtAxis(v) {
    if (!Number.isFinite(v)) return "0";
    const s = Math.abs(v) >= 10 ? v.toFixed(0) : v.toFixed(1);
    return s.endsWith(".0") ? s.slice(0, -2) : s;
  }

  _lineChartSvg(points, color, fixedMax) {
    if (!points.length) return `<div class="dm-ap-chart-empty">Nessun dato</div>`;
    const width = 300;
    const height = 90;
    // asse sinistro: riserva spazio per i valori min/max, riferimento comune ai 3 grafici
    const plotX0 = 24;
    const plotW = width - plotX0;
    const values = points.map((p) => p.y);
    // Con una scala fissa (basata sul picco storico reale) il minimo resta
    // sempre 0: cosi' il rumore di standby appiattisce vicino al fondo del
    // grafico invece di essere "gonfiato" da un auto-scale sul range minimo
    // dei dati del giorno, e un consumo vero resta comunque ben visibile.
    const min = fixedMax ? 0 : Math.min(...values, 0);
    const max = fixedMax ? Math.max(fixedMax, ...values) : Math.max(...values, min + 1);
    const range = max - min || 1;
    const stepX = points.length > 1 ? plotW / (points.length - 1) : 0;
    const coords = points.map((p, i) => {
      const x = (plotX0 + i * stepX).toFixed(1);
      const y = (height - ((p.y - min) / range) * (height - 6) - 3).toFixed(1);
      return `${x},${y}`;
    });
    const area = `${plotX0},${height} ${coords.join(" ")} ${width},${height}`;
    return `<svg viewBox="0 0 ${width} ${height}" class="dm-ap-chart-svg" preserveAspectRatio="none">
      <line x1="${plotX0}" y1="3" x2="${plotX0}" y2="${height - 3}" stroke="#94a3b840" stroke-width="1"/>
      <text x="${plotX0 - 4}" y="8" text-anchor="end" font-size="10" font-weight="800" fill="#94a3b8">${this._fmtAxis(max)}</text>
      <text x="${plotX0 - 4}" y="${height - 3}" text-anchor="end" font-size="10" font-weight="800" fill="#94a3b8">${this._fmtAxis(min)}</text>
      <polygon points="${area}" fill="${color}" opacity="0.14"/>
      <polyline points="${coords.join(" ")}" fill="none" stroke="${color}" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"/>
    </svg>`;
  }

  _barChartSvg(bars, color) {
    if (!bars.length) return `<div class="dm-ap-chart-empty">Nessun dato</div>`;
    const width = 300;
    const height = 90;
    const plotX0 = 24;
    const plotW = width - plotX0;
    // Spazio riservato in alto per il valore numerico, ruotato di 90 gradi
    // (si legge inclinando la testa/il monitor verso destra), come chiesto.
    const labelSpace = 22;
    const barAreaH = height - labelSpace;
    const max = Math.max(...bars.map((b) => b.value), 0.01);
    const gap = 3;
    const barW = (plotW - gap * (bars.length - 1)) / bars.length;
    const fmt = (v) => {
      if (!(v > 0)) return "";
      const s = v.toFixed(1);
      return s.endsWith(".0") ? s.slice(0, -2) : s;
    };
    const parts = bars
      .map((b, i) => {
        const h = Math.max(1, (b.value / max) * (barAreaH - 2));
        const x = (plotX0 + i * (barW + gap)).toFixed(1);
        const y = (height - h).toFixed(1);
        const cx = (plotX0 + i * (barW + gap) + barW / 2).toFixed(1);
        const labelY = (height - h - 4).toFixed(1);
        const label = fmt(b.value);
        const text = label
          ? `<text x="${cx}" y="${labelY}" transform="rotate(-90 ${cx} ${labelY})" text-anchor="start" font-size="10" font-weight="800" fill="#94a3b8">${label}</text>`
          : "";
        return `<rect x="${x}" y="${y}" width="${barW.toFixed(1)}" height="${h.toFixed(1)}" rx="2" fill="${color}"/>${text}`;
      })
      .join("");
    const axis = `<line x1="${plotX0}" y1="${labelSpace}" x2="${plotX0}" y2="${height}" stroke="#94a3b840" stroke-width="1"/>
      <text x="${plotX0 - 4}" y="${labelSpace + 6}" text-anchor="end" font-size="10" font-weight="800" fill="#94a3b8">${this._fmtAxis(max)}</text>
      <text x="${plotX0 - 4}" y="${height - 1}" text-anchor="end" font-size="10" font-weight="800" fill="#94a3b8">0</text>`;
    return `<svg viewBox="0 0 ${width} ${height}" class="dm-ap-chart-svg" preserveAspectRatio="none">${axis}${parts}</svg>`;
  }

  async _fetchHistory24h(entityId) {
    const end = new Date();
    const start = new Date(end.getTime() - 24 * 3600 * 1000);
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

  async _fetchStats(entityId, period, start, end) {
    const result = await this._hass.connection.sendMessagePromise({
      type: "recorder/statistics_during_period",
      start_time: start.toISOString(),
      end_time: end.toISOString(),
      statistic_ids: [entityId],
      period,
    });
    const rows = result?.[entityId] || [];
    return rows.map((r) => ({ t: new Date(r.start), value: Math.max(0, Number(r.change ?? 0)) }));
  }

  // Sceglie fino a "count" indici distribuiti in modo uniforme (incluso il
  // primo e l'ultimo) per non affollare l'asse con un'etichetta per ogni
  // singolo punto/barra.
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

  async _openPowerHistory() {
    const cfg = this._config;
    const powerEntity = cfg.power_history_entity || cfg.power_entity;
    const energyEntity = cfg.energy_stat_entity;

    this._openDialog(
      "Andamento potenza",
      `<div class="dm-ap-sec"><div class="dm-ap-sec-cap">Ultime 24 ore</div><div class="dm-ap-chart-loading" data-chart="24h">Caricamento...</div></div>
       ${energyEntity ? `<div class="dm-ap-sec"><div class="dm-ap-sec-cap">Questo mese</div><div class="dm-ap-chart-loading" data-chart="month">Caricamento...</div></div>` : ""}
       ${energyEntity ? `<div class="dm-ap-sec"><div class="dm-ap-sec-cap">Quest'anno</div><div class="dm-ap-chart-loading" data-chart="year">Caricamento...</div></div>` : ""}`,
    );
    const overlay = this._root.querySelector(".dm-ap-overlay");
    const slot = (name) => overlay?.querySelector(`[data-chart="${name}"]`);

    if (powerEntity) {
      this._fetchHistory24h(powerEntity)
        .then((points) => {
          const el = slot("24h");
          if (!el) return;
          const labels = this._labelSpans(points, 7, (p) => p.t.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" }));
          // Scala fissa sul picco storico (cfg.max_power, un po' sopra il
          // massimo osservato negli ultimi mesi): il rumore di standby resta
          // vicino allo zero e un consumo vero si vede comunque bene, senza
          // nascondere il dato reale come faceva l'azzeramento.
          el.outerHTML = `<div data-chart="24h">${this._lineChartSvg(points, "#0ea5e9", cfg.max_power)}${labels}</div>`;
          mirinoGrafico(overlay.querySelector('[data-chart="24h"]'), points,
            (p) => p.t.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" }) + "  " + (Math.round(p.y * 10) / 10) + " W");
        })
        .catch(() => {
          const el = slot("24h");
          if (el) el.textContent = "Errore caricamento dati";
        });
    }

    if (energyEntity) {
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      this._fetchStats(energyEntity, "day", monthStart, now)
        .then((rows) => {
          const el = slot("month");
          if (!el) return;
          const bars = rows.map((r) => ({ value: r.value }));
          const dayLabels = this._labelSpans(rows, 8, (r) => r.t.getDate());
          el.outerHTML = `<div data-chart="month">${this._barChartSvg(bars, "#0ea5e9")}${dayLabels}</div>`;
        })
        .catch(() => {
          const el = slot("month");
          if (el) el.textContent = "Errore caricamento dati";
        });

      const yearStart = new Date(now.getFullYear(), 0, 1);
      const MONTH_ABBR = ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"];
      this._fetchStats(energyEntity, "month", yearStart, now)
        .then((rows) => {
          const el = slot("year");
          if (!el) return;
          const bars = rows.map((r) => ({ value: r.value }));
          const labels = `<div class="dm-ap-chart-labels">${rows.map((r) => `<span>${MONTH_ABBR[r.t.getMonth()]}</span>`).join("")}</div>`;
          el.outerHTML = `<div data-chart="year">${this._barChartSvg(bars, "#0ea5e9")}${labels}</div>`;
        })
        .catch(() => {
          const el = slot("year");
          if (el) el.textContent = "Errore caricamento dati";
        });
    }
  }

  set hass(hass) {
    this._hass = hass;
    if (!this._config) return;
    const cfg = this._config;

    const powerState = hass.states[cfg.power_entity];
    const watts = powerState ? Number(powerState.state) : null;
    const powerUnavailable = !powerState || ["unavailable", "unknown"].includes(powerState.state);

    let mode = "off";
    let label = "SPENTO";
    const liveStateEntity = cfg.live?.state_entity;
    const rawState = liveStateEntity ? hass.states[liveStateEntity]?.state : null;
    const mapped = rawState && cfg.state_map[rawState];
    if (mapped) {
      mode = mapped.mode;
      label = mapped.label;
    } else if (powerUnavailable) {
      mode = "unavailable";
      label = "N/D";
    } else if (watts >= cfg.threshold_run) {
      mode = "running";
      label = "IN FUNZIONE";
    } else if (watts >= cfg.threshold_standby) {
      mode = "standby";
      label = "STANDBY";
    }

    const card = this._root.querySelector(".dm-ap-card");
    card.classList.remove("is-run", "is-standby", "is-off", "is-unavailable", "has-alarm");
    card.classList.add(`is-${mode === "running" ? "run" : mode}`);

    const badge = this._root.querySelector(".dm-ap-badge");
    badge.classList.remove("run", "standby", "off", "unavailable");
    badge.classList.add(mode === "running" ? "run" : mode);
    this._root.querySelector(".dm-ap-badge-label").textContent = label;

    const powerVal = Number.isFinite(watts) ? Math.max(0, watts) : 0;
    const powerUnit = cfg.power_unit || "W";
    if (powerUnit === "W") {
      this._root.querySelector(".dm-ap-power-val").textContent =
        powerVal >= 1000 ? `${(powerVal / 1000).toFixed(1)} kW` : `${Math.round(powerVal)} W`;
    } else {
      const powerDecimals = cfg.power_decimals ?? 1;
      this._root.querySelector(".dm-ap-power-val").textContent = `${powerVal.toFixed(powerDecimals)} ${powerUnit}`;
    }
    this._root.querySelector(".dm-ap-bar i").style.width =
      `${Math.min(100, Math.round((powerVal / cfg.max_power) * 100))}%`;

    const progressEntity = cfg.live?.progress_entity;
    const progressBar = this._root.querySelector(".dm-ap-progress-bar");
    if (progressEntity && progressBar) {
      const pState = hass.states[progressEntity];
      const pVal = pState && !["unavailable", "unknown"].includes(pState.state) ? Number(pState.state) : NaN;
      let valText = Number.isFinite(pVal) ? `${Math.round(pVal)}%` : "\u2014";
      const remainingEntity = cfg.live?.remaining_entity;
      const remState = remainingEntity ? hass.states[remainingEntity] : null;
      if (remState && !["unavailable", "unknown"].includes(remState.state)) {
        const finishMs = new Date(remState.state).getTime();
        const diffMin = Math.round((finishMs - Date.now()) / 60000);
        if (Number.isFinite(diffMin) && diffMin > 0) {
          const h = Math.floor(diffMin / 60);
          const m = diffMin % 60;
          valText += ` \u00b7 manca ${h > 0 ? `${h}h ${m}m` : `${m} min`}`;
        }
      }
      this._root.querySelector(".dm-ap-progress-val").textContent = valText;
      progressBar.style.width = `${Number.isFinite(pVal) ? Math.min(100, Math.max(0, pVal)) : 0}%`;
    }

    const end = this._cycleAttr(hass, "end");
    const duration = this._cycleAttr(hass, "duration");
    const energy = this._cycleAttr(hass, "energy");
    const cost = this._cycleAttr(hass, "cost");
    { const x = this._root.querySelector(".dm-c-end"); if (x) x.textContent = end ?? "\u2014"; }
    { const x = this._root.querySelector(".dm-c-duration"); if (x) x.textContent = duration ?? "\u2014"; }
    { const x = this._root.querySelector(".dm-c-energy"); if (x) x.textContent = energy ?? "\u2014"; }
    { const x = this._root.querySelector(".dm-c-cost"); if (x) x.textContent = Number.isFinite(Number(cost)) ? `${Number(cost).toFixed(2)} \u20ac` : "\u2014"; }

    const warnEl = this._root.querySelector(".dm-ap-warn");
    const activeWarnings = (cfg.warn_entities || [])
      .filter((w) => hass.states[w.entity]?.state === w.on_state)
      .map((w) => w.label);
    if (activeWarnings.length) {
      warnEl.hidden = false;
      warnEl.textContent = "\u26a0 " + activeWarnings.join(" \u00b7 ");
      card.classList.add("has-alarm");
    } else {
      warnEl.hidden = true;
    }
  }

  getCardSize() {
    return 7;
  }
}
