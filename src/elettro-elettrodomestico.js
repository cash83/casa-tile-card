// custom:casa-elettrodomestico - lavatrice, lavastoviglie, forno, asciugatrice...
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
  ICON_RESTART,
  ICON_NOTIFCENTER,
  ICON_BOLT,
  ICON_FLAG,
  ICON_TIMER,
  ICON_EURO,
  giornoBreve,
  meseBreve,
  WEEKDAY_FULL_IT,
  DEFAULT_STATE_MAP,
  STYLE,
  esc,
  vestiFinestra,
} from './elettro-comune.js';
import { righeInOrdine } from './elettro-righe-editor.js';
import { ConFinestrelle } from './elettro-condivisi.js';

// Le righe dell'Ultimo ciclo, col nome che si vede nell'editor.
export const RIGHE_CICLO = [
  { id: "fine", nome: "Fine del ciclo (data e ora)", etichetta: "Fine", colore: "#a283f2" },
  { id: "durata", nome: "Durata del ciclo", etichetta: "Durata", colore: "#2fbfb0" },
  { id: "consumo", nome: "Consumo del ciclo (kWh)", etichetta: "Consumo", colore: "#3fb4ea" },
  { id: "costo", nome: "Costo del ciclo", etichetta: "Costo", colore: "#e2ad1c" },
  { id: "oggi", nome: "kWh di oggi (per prese e apparecchi senza ciclo)", etichetta: "Oggi", colore: "#3fb4ea" },
  { id: "costo_oggi", nome: "Costo di oggi", etichetta: "Costo oggi", colore: "#e2ad1c" },
  { id: "settimana", nome: "kWh della settimana", etichetta: "Settimana", colore: "#4fb0d8" },
  { id: "costo_settimana", nome: "Costo della settimana", etichetta: "Costo settimana", colore: "#d8a13c" },
  { id: "mese", nome: "kWh del mese", etichetta: "Mese", colore: "#3f8fea" },
  { id: "costo_mese", nome: "Costo del mese", etichetta: "Costo mese", colore: "#a283f2" },
];

const VUOTO = '<div class="dm-ap-sec"><div class="dm-ap-sec-cap">Niente da impostare</div><div class="dm-ap-reset-note">Qui compaiono i prezzi e gli interruttori che leghi alla scheda: si scelgono nel suo editor, dalla matita della plancia.</div></div>';

export class CasaElettrodomestico extends ConFinestrelle(HTMLElement) {
  // Le righe dell'Ultimo ciclo, nell'ordine e coi nomi della configurazione.
  _righeCiclo() {
    const R = {
      fine: `<div class="dm-ap-cycle-row dm-ap-cycle-row-b dm-colore" style="--c:#a283f2"><span class="dm-ap-cycle-label"><span class="dm-ap-cycle-ic">${ICON_FLAG}</span><small>Fine</small></span><b class="dm-c-end">\u2014</b></div>`,
      durata: `<div class="dm-ap-cycle-row dm-ap-cycle-row-b dm-colore" style="--c:#2fbfb0"><span class="dm-ap-cycle-label"><span class="dm-ap-cycle-ic">${ICON_TIMER}</span><small>Durata</small></span><b class="dm-c-duration">\u2014</b></div>`,
      consumo: `<div class="dm-ap-cycle-row dm-ap-cycle-row-b dm-colore" style="--c:#3fb4ea"><span class="dm-ap-cycle-label"><span class="dm-ap-cycle-ic">${ICON_BOLT}</span><small>Consumo</small></span><b class="dm-c-energy">\u2014</b></div>`,
      costo: `<div class="dm-ap-cycle-row dm-ap-cycle-row-b dm-colore" style="--c:#e2ad1c"><span class="dm-ap-cycle-label"><span class="dm-ap-cycle-ic">${ICON_EURO}</span><small>Costo</small></span><b class="dm-c-cost">\u2014</b></div>`,
      oggi: `<div class="dm-ap-cycle-row dm-ap-cycle-row-b dm-colore" style="--c:#3fb4ea"><span class="dm-ap-cycle-label"><span class="dm-ap-cycle-ic">${ICON_BOLT}</span><small>Oggi</small></span><b class="dm-c-oggi">\u2014</b></div>`,
      costo_oggi: `<div class="dm-ap-cycle-row dm-ap-cycle-row-b dm-colore dm-forte" style="--c:#e2ad1c"><span class="dm-ap-cycle-label"><span class="dm-ap-cycle-ic">${ICON_EURO}</span><small>Costo oggi</small></span><b class="dm-c-costo-oggi">\u2014</b></div>`,
      settimana: `<div class="dm-ap-cycle-row dm-ap-cycle-row-b dm-colore" style="--c:#4fb0d8"><span class="dm-ap-cycle-label"><span class="dm-ap-cycle-ic">${ICON_BOLT}</span><small>Settimana</small></span><b class="dm-c-settimana">\u2014</b></div>`,
      costo_settimana: `<div class="dm-ap-cycle-row dm-ap-cycle-row-b dm-colore" style="--c:#d8a13c"><span class="dm-ap-cycle-label"><span class="dm-ap-cycle-ic">${ICON_EURO}</span><small>Costo settimana</small></span><b class="dm-c-costo-settimana">\u2014</b></div>`,
      mese: `<div class="dm-ap-cycle-row dm-ap-cycle-row-b dm-colore" style="--c:#3f8fea"><span class="dm-ap-cycle-label"><span class="dm-ap-cycle-ic">${ICON_BOLT}</span><small>Mese</small></span><b class="dm-c-mese">\u2014</b></div>`,
      costo_mese: `<div class="dm-ap-cycle-row dm-ap-cycle-row-b dm-colore" style="--c:#a283f2"><span class="dm-ap-cycle-label"><span class="dm-ap-cycle-ic">${ICON_EURO}</span><small>Costo mese</small></span><b class="dm-c-costo-mese">\u2014</b></div>`,
    };
    const c = this._config;
    const pe0 = c.period_entities || {};
    const haCicli = !!(c.cycle_sensor || c.ciclo);
    const haPeriodi = !!(c.oggi_energia || c.oggi_costo || c.mese_energia || c.mese_costo
      || (pe0.today || {}).energy || (pe0.month || {}).energy);
    const daCiclo = ["fine", "durata", "consumo", "costo"];
    const daPresa = ["oggi", "costo_oggi", "mese", "costo_mese"];
    // se hai scelto tu le righe comandi tu; se no ti do quelle che sai riempire
    const elenco = c.righe ? RIGHE_CICLO
      : RIGHE_CICLO.filter((r) => (haPeriodi && !haCicli ? daPresa : daCiclo).includes(r.id));
    return righeInOrdine(c, elenco, R, esc);
  }

  // Le barre in piu': un elenco {entita', nome, fondo scala}. Accetto anche la
  // vecchia forma a barra singola, cosi' chi ce l'ha non si accorge di niente.
  _barreExtra() {
    const c = this._config || {};
    const elenco = Array.isArray(c.barre) ? c.barre.slice() : [];
    if (c.barra2_entita && !elenco.some((b) => b && b.entity === c.barra2_entita)) {
      elenco.unshift({ entity: c.barra2_entita, label: c.barra2_nome, max: c.barra2_max });
    }
    return elenco.filter((b) => b && b.entity).map((b) => ({
      entity: b.entity,
      label: b.label || this._nomeEntita(b.entity),
      max: Number(b.max) || c.max_power || 1000,
    }));
  }

  _nomeEntita(eid) {
    const st = this._hass && this._hass.states && this._hass.states[eid];
    return (st && st.attributes && st.attributes.friendly_name) || eid;
  }

  static getConfigElement() {
    return document.createElement("casa-elettrodomestico-editor");
  }

  // Niente entita' scelte da me: la scheda nasce vuota e la riempi tu (o la
  // fai riempire dal tasto "Capisci da solo").
  static getStubConfig() {
    return { type: "custom:casa-elettrodomestico", name: "", artwork: "washer" };
  }

  setConfig(config) {
    // senza entita' la scheda non si rompe: si fa vedere vuota, e l'editor
    // dice cosa manca. Prima buttava un errore rosso in faccia.
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
    this._root.innerHTML = `<style>${STYLE}</style>` + TH(`
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
            ${this._config.interruttore ? `<button type="button" class="dm-ap-tool dm-ap-power" title="Accendi / spegni">${ICON_POWER}</button>` : ""}
            ${this._config.interruttore_usb ? `<button type="button" class="dm-ap-tool dm-ap-usb" title="USB">${ICON_USB}</button>` : ""}
            <button type="button" class="dm-ap-tool dm-ap-settings" title="Impostazioni">${ICON_GEAR}</button>
            <button type="button" class="dm-ap-tool dm-ap-stats" title="Statistiche">${ICON_CHART}</button>
          </span>
        </div>
        ${(this._config.interruttori || []).length ? `<div class="dm-ap-prese">
          ${(this._config.interruttori || []).map((x, i) => `<button type="button"
             class="dm-ap-presa" data-presa="${i}" title="${esc(x.entity)}">${esc(x.label
             || this._nomeEntita(x.entity))}</button>`).join("")}
        </div>` : ""}
        <div class="dm-ap-top-row">
          <div class="dm-ap-hero">${hero}</div>
          ${righe ? `<div class="dm-ap-cycle-side">
            <span class="dm-ap-cycle-cap"><span class="dm-c-cap">Ultimo ciclo</span></span>
            <span class="dm-ap-cycle-sub" hidden></span>
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
            ${this._barreExtra().map((b, i) => `<div class="dm-ap-meter">
              <div class="dm-ap-meter-row"><span class="dm-ap-extra-name" data-b="${i}">${esc(b.label)}</span><strong class="dm-ap-extra-val" data-b="${i}">0 W</strong></div>
              <div class="dm-ap-bar"><i class="dm-ap-extra-bar" data-b="${i}" style="width:0%"></i></div>
            </div>`).join("")}
            ${
              this._config.live?.progress_entity
                ? `<div class="dm-ap-meter">
              <div class="dm-ap-meter-row"><span>${esc(this._config.progress_label || "Avanzamento programma")}</span><strong class="dm-ap-progress-val">\u2014</strong></div>
              <div class="dm-ap-bar"><i class="dm-ap-progress-bar" style="width:0%"></i></div>
            </div>`
                : ""
            }
          </div>
        </div>
      </article>`);
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
    // i tastini delle prese di una ciabatta
    (this._config.interruttori || []).forEach((x, i) => {
      const b = this._root.querySelector(`.dm-ap-presa[data-presa="${i}"]`);
      if (!b || b._agganciato) return;
      b._agganciato = true;
      b.addEventListener("click", (e) => {
        e.stopPropagation();
        this._hass?.callService(x.entity.split(".")[0], "toggle", { entity_id: x.entity });
      });
    });
    // i due interruttori: quello grande e quello delle USB
    [[".dm-ap-power", "interruttore"], [".dm-ap-usb", "interruttore_usb"]].forEach(([sel, chiave]) => {
      this._root.querySelector(sel)?.addEventListener("click", (e) => {
        e.stopPropagation();
        const eid = this._config[chiave];
        this._hass?.callService(eid.split(".")[0], "toggle", { entity_id: eid });
      });
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
        const cfg = this._config;
        const pe = cfg.period_entities || {};
        const ci = cfg.ciclo || {};
        // quello che lo script deve azzerare glielo dico io: cosi' basta uno
        // script solo per tutta la casa, non uno per apparecchio
        const variables = {
          scheda: cfg.name || "",
          oggi: cfg.oggi_energia || (pe.today || {}).energy || "",
          settimana: cfg.settimana_energia || (pe.week || {}).energy || "",
          mese: cfg.mese_energia || (pe.month || {}).energy || "",
          ciclo_contatore: ci.contatore || "",
          ciclo_kwh: ci.consumo || "",
          ciclo_minuti: ci.durata || "",
          ciclo_fine: ci.fine || "",
        };
        hass.callService("script", "turn_on",
          { entity_id: reset.dataset.resetScript, variables });
        overlay.hidden = true;
      });
    }
  }

  _cycleAttr(hass, key) {
    const cfg = this._config;
    if (cfg.cycle_sensor && cfg.cycle_attrs?.[key]) {
      const st = hass.states[cfg.cycle_sensor];
      return st ? st.attributes?.[cfg.cycle_attrs[key]] : null;
    }
    // niente sensore del ciclo: allora sono le tre memorie che riempie
    // l'automazione fatta dalla scheda (fine, minuti, kWh)
    return this._cicloDaMemorie(hass, key);
  }

  // Le tre memorie dell'ultimo ciclo, gia' scritte come vanno lette.
  _cicloDaMemorie(hass, key) {
    const c = this._config.ciclo;
    if (!c) return null;
    // niente ciclo ancora registrato: meglio un trattino che un falso 00:00
    const kWh = Number((hass.states[c.consumo] || {}).state);
    const min = Number((hass.states[c.durata] || {}).state);
    if (!(kWh > 0) && !(min > 0)) return null;
    const leggi = (eid) => {
      const st = eid ? hass.states[eid] : null;
      return st && !["unknown", "unavailable", ""].includes(st.state) ? st.state : null;
    };
    if (key === "end") {
      const v = leggi(c.fine);
      if (!v) return null;
      const d = new Date(v.replace(" ", "T"));
      if (isNaN(d)) return v;
      const ora = String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
      const oggi = new Date();
      const stessoGiorno = d.toDateString() === oggi.toDateString();
      const ieri = new Date(oggi.getTime() - 86400000).toDateString() === d.toDateString();
      if (stessoGiorno) return ora;
      if (ieri) return T("ieri") + " " + ora;
      return String(d.getDate()).padStart(2, "0") + "/" + String(d.getMonth() + 1).padStart(2, "0") + " " + ora;
    }
    if (key === "duration") {
      const m = Number(leggi(c.durata));
      if (!Number.isFinite(m) || m <= 0) return null;
      const h = Math.floor(m / 60);
      return h ? h + "h " + String(Math.round(m % 60)).padStart(2, "0") + "m" : Math.round(m) + " min";
    }
    if (key === "energy") {
      const k = Number(leggi(c.consumo));
      return Number.isFinite(k) && k > 0 ? numero(k, 2) + " kWh" : null;
    }
    if (key === "cost") {
      const k = Number(leggi(c.consumo));
      const p = Number((hass.states[this._config.prezzo_entita] || {}).state);
      if (!Number.isFinite(k) || !Number.isFinite(p) || p <= 0) return null;
      return k * p;
    }
    return null;
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

  // Mentre il ciclo gira il riquadro resta a trattini: il conto vero lo fa il
  // sensore a fine ciclo. Ma l'apparecchio, intanto, i suoi numeri li dice
  // (energia, minuti fatti, minuti che mancano, che fase sta facendo): qui li
  // traduco nelle stesse quattro righe, cosi' il riquadro parla anche adesso.
  // Il ciclo in corso ricavato dai pezzi che crea la scheda: il contatore
  // azzerato alla partenza e la soglia "sta lavorando".
  _cicloVivoDaiNostri(hass) {
    const c = this._config.ciclo;
    if (!c || !c.contatore) return null;
    const out = {};
    const st = hass.states[c.contatore];
    if (st && !["unknown", "unavailable"].includes(st.state)) {
      const k = Number(st.state);
      if (Number.isFinite(k)) {
        out.energy = `${numero(k, 2)} kWh`;
        const p = Number(hass.states[this._config.prezzo_entita]?.state);
        if (Number.isFinite(p) && p > 0) out.cost = k * p;
      }
    }
    // da quanto va: dalla partenza segnata, se c'e' (regge le intermittenze),
    // se no da quando la soglia si e' accesa
    const via = c.inizio ? hass.states[c.inizio] : null;
    const scritta = via && !["unknown", "unavailable"].includes(via.state)
      && !/[ T]00:00:00$/.test(String(via.state)) ? via.state : null;
    const daVia = scritta ? new Date(scritta.replace(" ", "T")) : null;
    const sg = this._config.soglia_acceso ? hass.states[this._config.soglia_acceso] : null;
    const quando = daVia && !isNaN(daVia) ? daVia
      : (sg && sg.state === "on" && sg.last_changed ? new Date(sg.last_changed) : null);
    if (quando) {
      const min = Math.max(0, Math.round((Date.now() - quando.getTime()) / 60000));
      const h = Math.floor(min / 60);
      out.duration = h ? h + "h " + String(min % 60).padStart(2, "0") + "m" : min + " min";
    }
    out.end = T("in corso");
    return Object.keys(out).length ? out : null;
  }

  _cicloVivo(hass) {
    const c = this._config.ciclo_live;
    if (!c) return this._cicloVivoDaiNostri(hass);
    const buono = (e) => {
      const st = e && hass.states[e];
      return st && !["unavailable", "unknown"].includes(st.state) ? st : null;
    };
    const out = {};
    const en = buono(c.energy_entity);
    if (en && Number.isFinite(Number(en.state))) {
      const unita = String(en.attributes.unit_of_measurement || "kWh").toLowerCase();
      const kwh = unita === "wh" ? Number(en.state) / 1000 : Number(en.state);
      out.energy = `${numero(kwh, 2)} kWh`;
      const prezzo = Number(hass.states[this._config.prezzo_entita]?.state);
      if (Number.isFinite(prezzo)) out.cost = kwh * prezzo;
    }
    const tr = buono(c.elapsed_entity);
    if (tr) out.duration = this._tempoLeggibile(tr);
    const res = buono(c.remaining_entity);
    const mancano = res ? Number(res.state) : NaN;
    if (Number.isFinite(mancano) && mancano >= 0) {
      out.end = new Date(Date.now() + mancano * 60000)
        .toLocaleTimeString(laLocale(), { hour: "2-digit", minute: "2-digit" });
    }
    out.sub = [buono(c.program_entity), buono(c.phase_entity)]
      .map((st) => st && st.state).filter(Boolean).join(" · ");
    return out;
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
      week: [s.cycles_week, null],
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
    const kwhNum = pEnt.energy ? Number(hass.states[pEnt.energy]?.state) : NaN;
    const kwhTxt = Number.isFinite(kwhNum) ? `${numero(kwhNum, 2)} kWh` : "\u2014";
    let cost = pEnt.cost ? hass.states[pEnt.cost]?.state
      : (pAttrs.cost ? attrs[pAttrs.cost] : null);
    // senza un sensore del costo il conto lo faccio qui: kWh per il prezzo.
    // Attenzione: Number(null) vale 0, quindi "manca" va chiesto per bene.
    const manca = cost === null || cost === undefined || cost === ""
      || !Number.isFinite(Number(cost));
    if (manca && Number.isFinite(kwhNum)) {
      const p = Number(hass.states[cfg.prezzo_entita]?.state);
      if (Number.isFinite(p) && p > 0) cost = kwhNum * p;
    }
    const costTxt = Number.isFinite(Number(cost)) ? `${numero(cost, 2)} \u20ac` : "\u2014";
    const NOMI = { today: "Oggi", yesterday: "Ieri", week: "Settimana", month: "Mese",
      month_prev: "Mese scorso", year: "Anno", year_prev: "Anno scorso" };
    const label = (cfg.period_labels || {})[periodKey] || NOMI[periodKey] || periodKey;
    // le colonne vuote non si mostrano: su una presa i cicli non esistono
    const celle = [];
    if (cycles !== "\u2014") celle.push(["Cicli", esc(cycles)]);
    if (time !== "\u2014") celle.push(["Tempo", esc(time)]);
    if (Number.isFinite(kwhNum)) celle.push(["Consumo", kwhTxt]);
    celle.push(["Costo", costTxt]);
    return `<div class="dm-ap-week-row">
      <div class="dm-ap-week-day">${esc(label)}</div>
      <div class="dm-ap-week-stats${celle.length <= 3 ? " cols3" : ""}">
        ${celle.map(([n, val]) => `<div class="dm-ap-week-stat"><small>${n}</small><b>${val}</b></div>`).join("")}
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
      const val = st && st.state !== "unavailable" && st.state !== "unknown" ? new Date(st.state).toLocaleTimeString(laLocale(), { hour: "2-digit", minute: "2-digit" }) : "n/d";
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
        val = Number.isFinite(d.getTime()) ? d.toLocaleTimeString(laLocale(), { hour: "2-digit", minute: "2-digit" }) : raw;
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
        const unita = cfg.power_unit || unitaBella(st.attributes.unit_of_measurement) || "W";
        liveHtml += this._row(cfg.power_label || "Potenza attuale",
          `<span class="dm-ap-row-val">${esc(st.state)} ${esc(unita)}</span>`);
        const n = Number(st.state);
        const soglia = Number(cfg.threshold_run);
        if (Number.isFinite(n) && Number.isFinite(soglia)) {
          liveHtml += this._row("Sta lavorando",
            `<span class="dm-ap-row-val">${n > soglia ? T("S\u00ec") : T("No")} (${T("sopra")} ${soglia} ${esc(unita)})</span>`);
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
      // oggi dal vivo; ieri, finche' non e' ancora finito nell'attributo, lo
      // prendo dai campi "_ieri" (sono gli stessi numeri della riga Ieri qui
      // sopra: se no la stessa finestra direbbe due cose diverse)
      const contaOggi = cfg.stats && cfg.stats.cycles_today
        ? hass.states[cfg.stats.cycles_today] : null;
      let dato;
      if (i === 0) {
        dato = { c: contaOggi ? contaOggi.state : st.attributes?.cicli_oggi,
          m: st.attributes?.min_oggi, e: st.attributes?.costo_oggi };
      } else {
        dato = giorni[String(lun0)];
        if (!dato && i === 1 && st.attributes?.min_ieri !== undefined) {
          dato = { c: contaOggi ? contaOggi.attributes?.last_period : undefined,
            m: st.attributes.min_ieri, e: st.attributes.costo_ieri };
        }
      }
      const etichetta = `${giornoBreve(d)} ${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
      const vuoto = !dato || (dato.c === undefined && dato.m === undefined && dato.e === undefined);
      const costo = Number(dato?.e);
      righe.push(`<div class="dm-ap-week-row">
        <div class="dm-ap-week-day">${esc(etichetta)}${i === 0 ? " " + T("(oggi)") : ""}</div>
        <div class="dm-ap-week-stats cols3">
          <div class="dm-ap-week-stat"><small>Cicli</small><b>${vuoto ? "\u2014" : esc(String(Number(dato.c) || 0))}</b></div>
          <div class="dm-ap-week-stat"><small>Tempo</small><b>${vuoto ? "\u2014" : esc(min2txt(dato.m))}</b></div>
          <div class="dm-ap-week-stat"><small>Costo</small><b>${vuoto || !Number.isFinite(costo) ? "\u2014" : numero(costo, 2) + " \u20ac"}</b></div>
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
      ordered.push({ ...row, _label: `${giornoBreve(d)} ${dd}/${mm}` });
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
        const consumo = Number.isFinite(consumoNum) ? `${numero(consumoNum, 2)} kWh` : "\u2014";
        const costoNum = Number(hass.states[row.costo]?.state);
        const costo = Number.isFinite(costoNum) ? `${numero(costoNum, 2)} \u20ac` : "\u2014";
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

    const conta = ((this._config.period_entities || {}).today || {}).energy
      || this._config.oggi_energia || this._config.energy_stat_entity;
    const vuoto = !daAttributo && !body;
    this._openDialog("Statistiche", `
      ${periodRows ? `<div class="dm-ap-sec"><div class="dm-ap-sec-cap">Consumi per periodo</div><div class="dm-ap-week-list">${periodRows}</div></div>` : ""}
      <div class="dm-ap-sec">
        <div class="dm-ap-sec-cap">Ultimi 7 giorni</div>
        <div class="dm-ap-week-list" data-sette>${daAttributo || body
          || (conta ? `<div class="dm-ap-row-val">Guardo nello storico...</div>`
            : `<div class="dm-ap-row-val">Nessun dato configurato</div>`)}</div>
      </div>
    `);
    if (vuoto && conta) this._settimanaDalloStorico(conta);
  }

  // -- grafici potenza (linea 24h + istogrammi mese/anno) ------------------
  // Nessuna libreria esterna: SVG disegnato a mano, dati presi dalla cronologia
  // e dalle statistiche a lungo termine di Home Assistant via WebSocket.

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

  // I sette giorni presi dallo storico del contatore: una riga per giorno,
  // i kWh consumati e quanto sono costati al prezzo di adesso.
  async _settimanaDalloStorico(conta) {
    const box = this._root.querySelector("[data-sette]");
    if (!box) return;
    const fine = new Date();
    const inizio = new Date(fine.getTime() - 7 * 86400000);
    inizio.setHours(0, 0, 0, 0);
    try {
      const punti = await this._fetchStats(conta, "day", inizio, fine);
      if (!punti.length) {
        box.innerHTML = `<div class="dm-ap-row-val">Ancora niente: lo storico comincia adesso.</div>`;
        return;
      }
      const p = Number(this._hass.states[this._config.prezzo_entita]?.state);
      const chiave = (d) => d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
      const trovati = {};
      punti.forEach((x) => { trovati[chiave(x.t)] = (trovati[chiave(x.t)] || 0) + x.value; });
      const giorni = [];
      for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setHours(12, 0, 0, 0);
        d.setDate(d.getDate() - i);
        giorni.push({ t: d, value: trovati[chiave(d)] || 0 });
      }
      box.innerHTML = giorni.map((x) => {
        const d = x.t;
        const etichetta = giornoBreve(d) + " " + String(d.getDate()).padStart(2, "0")
          + "/" + String(d.getMonth() + 1).padStart(2, "0");
        const costo = Number.isFinite(p) && p > 0 ? `${numero(x.value * p, 2)} \u20ac` : "\u2014";
        return `<div class="dm-ap-week-row">
          <div class="dm-ap-week-day">${esc(etichetta)}</div>
          <div class="dm-ap-week-stats cols3">
            <div class="dm-ap-week-stat"><small>Consumo</small><b>${numero(x.value, 2)} kWh</b></div>
            <div class="dm-ap-week-stat"><small>Costo</small><b>${costo}</b></div>
          </div>
        </div>`;
      }).join("");
    } catch (e) {
      box.innerHTML = `<div class="dm-ap-row-val">Lo storico non risponde.</div>`;
    }
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
      this._storia(powerEntity, 24)
        .then((points) => {
          const el = slot("24h");
          if (!el) return;
          const labels = this._labelSpans(points, 7, (p) => p.t.toLocaleTimeString(laLocale(), { hour: "2-digit", minute: "2-digit" }));
          // Scala fissa sul picco storico (cfg.max_power, un po' sopra il
          // massimo osservato negli ultimi mesi): il rumore di standby resta
          // vicino allo zero e un consumo vero si vede comunque bene, senza
          // nascondere il dato reale come faceva l'azzeramento.
          el.outerHTML = `<div data-chart="24h">${this._lineChartSvg(points, "#0ea5e9", cfg.max_power)}${labels}</div>`;
          mirinoGrafico(overlay.querySelector('[data-chart="24h"]'), points,
            (p) => p.t.toLocaleTimeString(laLocale(), { hour: "2-digit", minute: "2-digit" }) + "  " + (Math.round(p.y * 10) / 10) + " W");
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

      this._fetchStats(energyEntity, "month", yearStart, now)
        .then((rows) => {
          const el = slot("year");
          if (!el) return;
          const bars = rows.map((r) => ({ value: r.value }));
          const labels = `<div class="dm-ap-chart-labels">${rows.map((r) => `<span>${meseBreve(r.t)}</span>`).join("")}</div>`;
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
    this._root.querySelector(".dm-ap-badge-label").textContent = T(label);

    const powerVal = Number.isFinite(watts) ? Math.max(0, watts) : 0;
    const powerUnit = cfg.power_unit || "W";
    // Se l'entita' della barra non e' un numero (e' lo STATO: "in funzione",
    // "finito"...) scrivere "0 W" e' peggio che non scrivere niente: diceva
    // zero watt accanto a un badge acceso. Meglio la parola che c'e' davvero.
    const nonNumerica = powerState && !Number.isFinite(watts) && !powerUnavailable;
    if (nonNumerica) {
      const scritta = (cfg.state_map && cfg.state_map[powerState.state] || {}).label
        || powerState.state;
      // textContent non interpreta l'HTML: passarci esc() farebbe vedere "&amp;"
      this._root.querySelector(".dm-ap-power-val").textContent = String(scritta);
    } else if (powerUnit === "W") {
      this._root.querySelector(".dm-ap-power-val").textContent =
        powerVal >= 1000 ? `${numero(powerVal / 1000, 1)} kW` : `${numero(powerVal, 0)} W`;
    } else {
      const powerDecimals = cfg.power_decimals ?? 1;
      this._root.querySelector(".dm-ap-power-val").textContent = `${numero(powerVal, powerDecimals)} ${powerUnit}`;
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

    let end = this._cycleAttr(hass, "end");
    let duration = this._cycleAttr(hass, "duration");
    let energy = this._cycleAttr(hass, "energy");
    let cost = this._cycleAttr(hass, "cost");
    const sogliaOn = cfg.soglia_acceso
      && hass.states[cfg.soglia_acceso]?.state === "on";
    const vivo = (mode === "running" || sogliaOn) ? this._cicloVivo(hass) : null;
    const cap = this._root.querySelector(".dm-c-cap");
    const sub = this._root.querySelector(".dm-ap-cycle-sub");
    if (cap) cap.textContent = T(vivo ? "Ciclo in corso" : "Ultimo ciclo");
    if (sub) {
      sub.hidden = !(vivo && vivo.sub);
      sub.textContent = (vivo && vivo.sub) || "";
    }
    const lato = this._root.querySelector(".dm-ap-cycle-side");
    if (lato) lato.classList.toggle("ha-sub", !!(vivo && vivo.sub));
    if (vivo) {
      if (vivo.end !== undefined) end = vivo.end;
      if (vivo.duration !== undefined) duration = vivo.duration;
      if (vivo.energy !== undefined) energy = vivo.energy;
      if (vivo.cost !== undefined) cost = vivo.cost;
    }
    { const x = this._root.querySelector(".dm-c-end"); if (x) x.textContent = end ?? "\u2014"; }
    { const x = this._root.querySelector(".dm-c-duration"); if (x) x.textContent = duration ?? "\u2014"; }
    { const x = this._root.querySelector(".dm-c-energy"); if (x) x.textContent = energy ?? "\u2014"; }
    { const x = this._root.querySelector(".dm-c-cost"); if (x) x.textContent = Number.isFinite(Number(cost)) ? `${numero(Number(cost), 2)} \u20ac` : "\u2014"; }

    (cfg.interruttori || []).forEach((x, i) => {
      const b = this._root.querySelector(`.dm-ap-presa[data-presa="${i}"]`);
      if (!b) return;
      // il nome vero: a setConfig `hass` non c'era ancora e restava l'id
      if (!x.label) {
        const nome = this._nomeEntita(x.entity);
        if (b.textContent !== nome) b.textContent = nome;
      }
      const st = hass.states[x.entity]?.state;
      b.classList.toggle("acceso", st === "on");
      b.classList.toggle("assente", !st || ["unavailable", "unknown"].includes(st));
    });
    [[".dm-ap-power", "interruttore"], [".dm-ap-usb", "interruttore_usb"]].forEach(([sel, chiave]) => {
      const t = this._root.querySelector(sel);
      if (!t) return;
      const st = hass.states[cfg[chiave]]?.state;
      t.classList.toggle("acceso", !!st && !["off", "unavailable", "unknown"].includes(st));
    });

    // le quattro righe "da presa": kWh e costo di oggi e del mese
    const numeroDi = (eid, unita, dec) => {
      const st = eid ? hass.states[eid] : null;
      if (!st || ["unavailable", "unknown"].includes(st.state)) return "\u2014";
      const n = Number(st.state);
      return Number.isFinite(n) ? `${numero(n, dec)}${unita}` : st.state;
    };
    // i quattro sensori: quelli scelti a mano, oppure quelli creati dal tasto
    // "Crea statistiche e costi", che li scrive dentro period_entities
    const pe = cfg.period_entities || {};
    // Il costo non ha bisogno di un sensore suo: e' i kWh per il prezzo, e il
    // prezzo lo tiene la scheda principale. Se un sensore del costo c'e' lo uso
    // (magari l'hai fatto tu), se no il conto lo faccio qui e non creo niente.
    const prezzo = Number((hass.states[cfg.prezzo_entita] || {}).state);
    const costoDa = (eidCosto, eidKwh) => {
      if (eidCosto && hass.states[eidCosto]) return numeroDi(eidCosto, " \u20ac", 2);
      const st = eidKwh ? hass.states[eidKwh] : null;
      if (!st || ["unavailable", "unknown"].includes(st.state)) return "\u2014";
      const k = Number(st.state);
      if (!Number.isFinite(k) || !Number.isFinite(prezzo) || prezzo <= 0) return "\u2014";
      return `${numero(k * prezzo, 2)} \u20ac`;
    };
    const kwhOggi = cfg.oggi_energia || (pe.today || {}).energy;
    const kwhSett = cfg.settimana_energia || (pe.week || {}).energy;
    const kwhMese = cfg.mese_energia || (pe.month || {}).energy;
    const periodi = [
      [".dm-c-oggi", kwhOggi, " kWh", 2],
      [".dm-c-settimana", kwhSett, " kWh", 2],
      [".dm-c-mese", kwhMese, " kWh", 2],
    ];
    let hoPeriodi = false;
    periodi.forEach(([sel, eid, unita, dec]) => {
      const x = this._root.querySelector(sel);
      if (!x) return;
      if (eid) hoPeriodi = true;
      x.textContent = numeroDi(eid, unita, dec);
    });
    [[".dm-c-costo-oggi", cfg.oggi_costo || (pe.today || {}).cost, kwhOggi],
     [".dm-c-costo-settimana", cfg.settimana_costo || (pe.week || {}).cost, kwhSett],
     [".dm-c-costo-mese", cfg.mese_costo || (pe.month || {}).cost, kwhMese]].forEach(([sel, eidCosto, eidKwh]) => {
      const x = this._root.querySelector(sel);
      if (!x) return;
      if (eidCosto || eidKwh) hoPeriodi = true;
      x.textContent = costoDa(eidCosto, eidKwh);
    });
    if (cap && !vivo && !cfg.cycle_sensor && !cfg.ciclo && hoPeriodi) cap.textContent = T("Consumi");

    this._barreExtra().forEach((b, i) => {
      const barra = this._root.querySelector(`.dm-ap-extra-bar[data-b="${i}"]`);
      const scritta = this._root.querySelector(`.dm-ap-extra-val[data-b="${i}"]`);
      if (!barra || !scritta) return;
      // anche qui il nome arriva solo adesso, se non l'hai scritto tu
      const nomeEl = this._root.querySelector(`.dm-ap-extra-name[data-b="${i}"]`);
      if (nomeEl && nomeEl.textContent !== b.label) nomeEl.textContent = b.label;
      const st2 = hass.states[b.entity];
      const w2 = st2 && !["unavailable", "unknown"].includes(st2.state) ? Number(st2.state) : NaN;
      const val2 = Number.isFinite(w2) ? Math.max(0, w2) : 0;
      scritta.textContent = val2 >= 1000 ? `${numero(val2 / 1000, 1)} kW` : `${numero(val2, 0)} W`;
      barra.style.width = `${Math.min(100, Math.round((val2 / b.max) * 100))}%`;
    });

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

}
