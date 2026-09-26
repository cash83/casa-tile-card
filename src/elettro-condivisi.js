// -*- coding: utf-8 -*-
// Quello che le DUE schede dei consumi (casa-energia e casa-elettrodomestico)
// e i loro DUE editor facevano uguale, ognuno con la sua copia.
//
// Erano nate come due schede separate (dal lavoro di Simonz82) e ognuna si
// portava dietro la sua finestrella, il suo grafico, la sua riga delle
// impostazioni. Venticinque metodi con lo stesso nome in due file: e le copie
// derapano in silenzio. Due esempi veri, trovati mentre le mettevo assieme:
// una scriveva "EUR" e l'altra "€" nella stessa riga di impostazioni, e i
// giorni della settimana erano scritti due volte con le maiuscole diverse.
//
// Qui dentro c'e' una copia sola, sotto forma di mixin - come fa gia' la
// casella (ConMusica(ConPezzi(...))). Quello che le due schede fanno davvero
// in modo diverso (le loro finestre, i loro conti) resta nei loro file.

import { esc, unitaBella, ICON_CLOSE } from './elettro-comune.js';
import { scegliLingua, T, TH } from './lingua.js';
import { aiutantiVeri, cancellaQuesti, scollegaEntita } from './elettro-crea.js';
import { quali_cancellare } from './elettro-righe-editor.js';

// ---------------------------------------------------------------- le schede
export const ConFinestrelle = (Base) => class extends Base {
  // una riga "nome ..... valore" dentro a una finestrella
  _row(label, valueHtml) {
    return `<div class="dm-ap-row"><span class="dm-ap-row-label">${esc(label)}</span>${valueHtml}</div>`;
  }

  // la finestrella sopra alla scheda: una sola, si riempie e si riapre
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
    // qui passa il contenuto di TUTTE le finestrelle delle due schede: il
    // titolo e le scritte dentro si traducono in un punto solo
    overlay.innerHTML = `<div class="dm-ap-dialog">
      <div class="dm-ap-dialog-head"><h3>${esc(T(title))}</h3><button type="button" class="dm-ap-dialog-close">${ICON_CLOSE}</button></div>
      <div class="dm-ap-dialog-body">${TH(bodyHtml)}</div>
    </div>`;
    overlay.querySelector(".dm-ap-dialog-close").addEventListener("click", () => {
      overlay.hidden = true;
    });
    overlay.hidden = false;
    return overlay;
  }

  // una riga delle impostazioni: un interruttore se si accende, se no il
  // valore che si apre nel pop-up di Home Assistant
  _settingsRowHtml(hass, row) {
    const st = hass.states[row.entity];
    if (!st) return this._row(row.label, `<span class="dm-ap-row-val">${T("n/d")}</span>`);
    const domain = row.entity.split(".")[0];
    if (["input_boolean", "automation", "switch"].includes(domain)) {
      const on = st.state === "on";
      return this._row(
        row.label,
        `<button type="button" class="dm-ap-switch${on ? " on" : ""}" data-entity="${esc(row.entity)}" aria-pressed="${on}"></button>`,
      );
    }
    // il simbolo al posto del codice della moneta (EUR -> €), come fa HA
    const unit = unitaBella(st.attributes?.unit_of_measurement);
    return `<div class="dm-ap-row" data-open-entity="${esc(row.entity)}" style="cursor:pointer">
      <span class="dm-ap-row-label">${esc(row.label)}</span>
      <span class="dm-ap-row-val">${esc(st.state)}${unit ? " " + esc(unit) : ""}</span>
    </div>`;
  }

  // -- i grafici, disegnati a mano: nessuna libreria ------------------------
  _fmtAxis(v) {
    if (!Number.isFinite(v)) return "0";
    const s = Math.abs(v) >= 10 ? v.toFixed(0) : v.toFixed(1);
    return s.endsWith(".0") ? s.slice(0, -2) : s;
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

  // la linea addolcita: mezzo punto per volta, con le curve di Bezier
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

  // La scheda dice se vuole la linea morbida (energia) o spigolosa
  // (elettrodomestico: i Watt saltano, e addolcirli direbbe una bugia).
  get _morbida() { return false; }

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
    const coords = points.map((p, i) => [plotX0 + i * stepX, height - ((p.y - min) / range) * (height - 6) - 3]);
    let linea;
    let area;
    if (this._morbida) {
      linea = this._smoothPath(coords);
      area = `${linea} L ${coords[coords.length - 1][0].toFixed(1)},${height} L ${coords[0][0].toFixed(1)},${height} Z`;
    } else {
      const punti = coords.map((c) => `${c[0].toFixed(1)},${c[1].toFixed(1)}`).join(" ");
      linea = `M ${punti.split(" ").join(" L ")}`;
      area = `${linea} L ${coords[coords.length - 1][0].toFixed(1)},${height} L ${coords[0][0].toFixed(1)},${height} Z`;
    }
    return `<svg viewBox="0 0 ${width} ${height}" class="dm-ap-chart-svg" preserveAspectRatio="none">
      <line x1="${plotX0}" y1="3" x2="${plotX0}" y2="${height - 3}" stroke="#94a3b840" stroke-width="1"/>
      <text x="${plotX0 - 4}" y="8" text-anchor="end" font-size="10" font-weight="800" fill="#94a3b8">${this._fmtAxis(max)}</text>
      <text x="${plotX0 - 4}" y="${height - 3}" text-anchor="end" font-size="10" font-weight="800" fill="#94a3b8">${this._fmtAxis(min)}</text>
      <path d="${area}" fill="${color}" opacity="0.14"/>
      <path d="${linea}" fill="none" stroke="${color}" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"/>
    </svg>`;
  }

  // Lo storico di un'entita' nelle ultime `ore`, come punti {t, y}. Le tre
  // copie di prima chiedevano la stessa cosa con tre pezzi di codice uguali.
  async _storia(entityId, ore) {
    if (!entityId) return [];
    const fine = new Date();
    const inizio = new Date(fine.getTime() - ore * 3600 * 1000);
    const esito = await this._hass.connection.sendMessagePromise({
      type: "history/history_during_period",
      start_time: inizio.toISOString(),
      end_time: fine.toISOString(),
      entity_ids: [entityId],
      minimal_response: true,
      no_attributes: true,
    });
    const righe = esito?.[entityId] || [];
    return righe
      .map((r) => ({ t: new Date((r.lu || r.last_updated_ts) * 1000 || r.last_updated), y: Number(r.s ?? r.state) }))
      .filter((p) => Number.isFinite(p.y));
  }

  // Quanto spazio chiede nella griglia delle viste a sezioni. Senza questo
  // Home Assistant decide da solo e il cursore del Layout si comporta a modo
  // suo: la casella e' alta, va detto.
  getGridOptions() {
    // "auto": l'altezza la misura Home Assistant sul contenuto vero. Con un
    // numero fisso (era 7) le schede corte lasciavano un buco sotto, e in una
    // vista a sezioni il buco si vede tutto.
    return { columns: 12, rows: "auto", min_columns: 6, max_columns: 12, min_rows: 3, max_rows: 20 };
  }

  getCardSize() {
    return 7;
  }
};

// ---------------------------------------------------------------- gli editor
export const ConEditor = (Base) => class extends Base {
  setConfig(config) {
    this._config = { ...config };
    this._disegna();
  }

  set hass(hass) {
    this._hass = hass;
    // la lingua la chiedo io: un editor si puo' aprire prima che una scheda
    // sia stata disegnata, e li' nessuno l'avrebbe ancora scelta
    scegliLingua(hass);
    if (this._form) this._form.hass = hass;
  }

  _emetti() {
    this.dispatchEvent(new CustomEvent("config-changed", {
      detail: { config: this._config }, bubbles: true, composed: true,
    }));
  }

  // le scelte dei riquadri sono configurazione: le scrivo subito, se no Home
  // Assistant non accende il tasto Salva
  _scriviScelta(chiave, valore) {
    const c = { ...this._config };
    if (valore === "" || valore === undefined || valore === null
        || (typeof valore === "number" && !isFinite(valore))) {
      delete c[chiave];
    } else c[chiave] = valore;
    this._config = c;
    this._emetti();
  }

  // il nome di un'entita' senza la coda "potenza": e' quella che si vede
  // scritta sulle barre e nei messaggi
  _nomeDi(eid) {
    const st = this._hass && this._hass.states[eid];
    const n = st ? String(st.attributes.friendly_name || eid) : eid;
    return n.replace(/\s+(potenza|power)\s*$/i, "").replace(/\s{2,}/g, " ").trim();
  }

  _dillo(testo, male) {
    if (!this._esito) return;
    this._esito.hidden = false;
    if (male) this._esito.classList.add("male");
    this._esito.textContent += (this._esito.textContent ? "\n" : "") + testo;
    // il riquadro sta in fondo e resta attaccato: se sei piu' su, ti ci porto
    try { this._esito.scrollIntoView({ block: "nearest" }); } catch (e) { /* vecchi browser */ }
  }

  // i colori si scrivono in esadecimale (#1b2430), il selettore di Home
  // Assistant parla in terne rgb: traduco nei due versi
  _versoHex(v) {
    if (!Array.isArray(v)) return v;
    return "#" + v.map((n) => Math.max(0, Math.min(255, Number(n) || 0)).toString(16).padStart(2, "0")).join("");
  }

  _versoRgb(v) {
    const m = /^#?([0-9a-f]{6})$/i.exec(String(v || ""));
    if (!m) return undefined;
    const n = parseInt(m[1], 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }

  // Il contrario di "crea": butta via gli aiutanti che questa scheda si e'
  // fatta creare. Prima te li fa vedere uno per uno, con le caselline.
  async _cancellaSensori() {
    const elenco = await aiutantiVeri(this._hass, this._config);
    this._esito.hidden = false;
    this._esito.classList.remove("male");
    if (!elenco.length) {
      this._esito.textContent = T("Questa scheda non ha aiutanti da cancellare.");
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
        this._esito.textContent += T("Fatto:") + " " + esito.cancellati + " "
          + T("cancellati.") + " "
          + T("I valori me li sono segnati: se li rifai ripartono da li'.");
      } catch (e) {
        this._esito.classList.add("male");
        this._esito.textContent = T("Non ce l'ho fatta:") + " " + (e && e.message ? e.message : e);
      } finally {
        if (tasto) tasto.disabled = false;
      }
    });
  }
};
