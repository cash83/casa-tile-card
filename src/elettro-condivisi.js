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

import { esc, numero, tastiDi, ICON_CLOSE } from './elettro-comune.js';
import { ICONE, disegnoMdi } from './icone.js';
import { scegliLingua, T, TH } from './lingua.js';
import { aiutantiVeri, cancellaQuesti, scollegaEntita, ID_TOTALE } from './elettro-crea.js';
import { quali_cancellare } from './elettro-righe-editor.js';

// ---------------------------------------------------------------- le schede
// Il disegno di un tasto: l'icona scelta (le stesse della casella). Se non
// ne hai scelta una non metto niente: il tasto e' il suo nome e basta.
function svgTasto(icona) {
  const dentro = icona ? (ICONE[icona] || disegnoMdi(icona) || "") : "";
  if (!dentro) return "";
  return '<svg viewBox="0 0 64 64" width="14" height="14">' + dentro + "</svg>";
}

export const ConFinestrelle = (Base) => class extends Base {
  // La fila dei tasti, uguale per le due schede: si disegna una volta, si
  // accende e si spegne al clic. Si leggono per nome - i tondini muti in
  // alto erano indovinelli, e chi aveva le prese le vedeva pure due volte.
  _tastiHtml() {
    const lista = tastiDi(this._config);
    if (!lista.length) return "";
    return `<div class="dm-ap-prese">` + lista.map((t, i) => `<button type="button"
      class="dm-ap-presa dm-ap-tasto" data-tasto="${i}"
      title="${esc(t.nome || t.entity)}">${svgTasto(t.icona)}<span
      class="dm-ap-tasto-nome">${esc(t.nome || t.entity)}</span></button>`).join("") + `</div>`;
  }

  _tastiAggancia() {
    tastiDi(this._config).forEach((t, i) => {
      const b = this._root.querySelector(`.dm-ap-tasto[data-tasto="${i}"]`);
      if (!b || b._agganciato) return;
      b._agganciato = true;
      b.addEventListener("click", (e) => {
        e.stopPropagation();
        this._hass?.callService(t.entity.split(".")[0], "toggle", { entity_id: t.entity });
      });
    });
  }

  _tastiAggiorna(hass) {
    tastiDi(this._config).forEach((t, i) => {
      const b = this._root.querySelector(`.dm-ap-tasto[data-tasto="${i}"]`);
      if (!b) return;
      const stato = hass.states[t.entity] || {};
      const st = stato.state;
      // il nome vero. A setConfig `hass` non c'era ancora e restava l'id
      if (!t.nome) {
        const nome = (stato.attributes || {}).friendly_name || t.entity;
        if (b.title !== nome) b.title = nome;
        const eti = b.querySelector(".dm-ap-tasto-nome");
        if (eti && eti.textContent !== nome) eti.textContent = nome;
      }
      b.classList.toggle("acceso", !!st && !["off", "unavailable", "unknown"].includes(st));
      b.classList.toggle("assente", !st || ["unavailable", "unknown"].includes(st));
    });
  }

  // Il prezzo PIENO della bolletta - energia piu' rete, accise e IVA. Non si
  // configura: la scheda grande lo scrive sempre nello stesso aiutante, ed e'
  // la convenzione con cui in questo progetto le schede si passano la tariffa.
  // Se non c'e', o se e' lo stesso di quello della sola energia, non c'e'
  // niente da far vedere in piu' e la riga del costo resta com'era.
  _prezzoPieno(hass) {
    const p = Number((hass.states[ID_TOTALE] || {}).state);
    const solo = Number((hass.states[this._config.prezzo_entita] || {}).state);
    if (!Number.isFinite(p) || p <= 0) return 0;
    if (Number.isFinite(solo) && Math.abs(p - solo) < 0.0005) return 0;
    return p;
  }

  // Il costo su una riga sola: la sola energia e, staccata, quanto ti costa
  // in bolletta. Due righe per dire due numeri erano troppe, ma attaccate
  // sembravano un numero lungo: la seconda va piu' piccola e piu' chiara.
  _scriviCosto(el, solo, pieno) {
    if (!el) return;
    el.textContent = Number.isFinite(Number(solo))
      ? `${numero(Number(solo), 2)} \u20ac` : "\u2014";
    if (Number.isFinite(Number(solo)) && Number.isFinite(Number(pieno)) && Number(pieno) > 0) {
      const due = document.createElement("span");
      due.className = "dm-ap-due";
      due.textContent = `${numero(Number(pieno), 2)} \u20ac`;
      el.appendChild(due);
      el.title = T("prima la sola energia, poi quanto costa in bolletta");
    } else {
      el.removeAttribute("title");
    }
  }

  // una riga "nome ..... valore" dentro a una finestrella
  _row(label, valueHtml) {
    return `<div class="dm-ap-row"><span class="dm-ap-row-label">${esc(label)}</span>${valueHtml}</div>`;
  }

  // la finestrella sopra alla scheda: una sola, si riempie e si riapre
  // Chiude come la casella: prima l'animazione all'indietro, poi sparisce.
  // Spegnerla e basta faceva sparire la finestra di colpo.
  _chiudiDialog(overlay) {
    if (!overlay || overlay.hidden) return;
    clearTimeout(this._chiusuraDopo);
    if (this._escDialog) {
      document.removeEventListener("keydown", this._escDialog);
      this._escDialog = null;
    }
    if ((this._config.finestra_apertura || "sfuma") === "niente") {
      overlay.hidden = true;
      return;
    }
    overlay.setAttribute("chiude", "");
    const dura = Number(this._config.finestra_apertura_durata);
    const ms = (Number.isFinite(dura) && dura > 0 ? Math.min(2000, Math.max(80, dura)) : 220) * 0.66;
    this._chiusuraDopo = setTimeout(() => {
      overlay.hidden = true;
      overlay.removeAttribute("chiude");
    }, ms + 20);
    if (this._escDialog) {
      document.removeEventListener("keydown", this._escDialog);
      this._escDialog = null;
    }
  }

  // Da dove sboccia: il punto dove sta il tondino che hai premuto, in
  // percentuale sullo schermo. Se non si riesce a misurare, dal centro.
  _puntoDiNascita(overlay, partenza) {
    if (!partenza || !partenza.getBoundingClientRect) {
      overlay.style.removeProperty("--dm-nasce");
      return;
    }
    const q = partenza.getBoundingClientRect();
    if (!q.width && !q.height) {
      overlay.style.removeProperty("--dm-nasce");
      return;
    }
    const x = ((q.left + q.width / 2) / (window.innerWidth || 1)) * 100;
    const y = ((q.top + q.height / 2) / (window.innerHeight || 1)) * 100;
    overlay.style.setProperty("--dm-nasce", x.toFixed(1) + "% " + y.toFixed(1) + "%");
  }

  _openDialog(title, bodyHtml, partenza) {
    let overlay = this._root.querySelector(".dm-ap-overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.className = "dm-ap-overlay";
      overlay.hidden = true;
      // Guardo DOVE hai premuto, non su cosa: bastava un pixel di
      // qualcos'altro sotto al dito e la finestra non si chiudeva.
      overlay.addEventListener("pointerdown", (e) => {
        const f = overlay.querySelector(".dm-ap-dialog");
        if (!f) return;
        const q = f.getBoundingClientRect();
        const fuori = e.clientX < q.left || e.clientX > q.right
          || e.clientY < q.top || e.clientY > q.bottom;
        if (fuori) this._chiudiDialog(overlay);
      });
      this._root.appendChild(overlay);
    }
    clearTimeout(this._chiusuraDopo);
    overlay.removeAttribute("chiude");
    const modo = ["sfuma", "sboccia", "basso", "niente"]
      .includes(this._config.finestra_apertura) ? this._config.finestra_apertura : "sfuma";
    overlay.setAttribute("apertura", modo);
    // la foto di sfondo della finestra, come sulla casella
    const foto = this._config.finestra_immagine;
    // qui passa il contenuto di TUTTE le finestrelle delle due schede: il
    // titolo e le scritte dentro si traducono in un punto solo
    overlay.innerHTML = `<div class="dm-ap-dialog">
      <div class="dm-ap-dialog-head"><h3>${esc(T(title))}</h3><button type="button" class="dm-ap-dialog-close">${ICON_CLOSE}</button></div>
      <div class="dm-ap-dialog-body">${TH(bodyHtml)}</div>
    </div>`;
    const finestra = overlay.querySelector(".dm-ap-dialog");
    finestra.style.backgroundImage = foto ? `url("${String(foto).replace(/"/g, "%22")}")` : "";
    overlay.querySelector(".dm-ap-dialog-close").addEventListener("click", () => {
      this._chiudiDialog(overlay);
    });
    overlay.hidden = false;
    // Esc chiude, come su qualunque finestra. L'ascolto vecchio si toglie:
    // se no, riaprendo, ne restava uno attaccato al documento per sempre.
    if (this._escDialog) document.removeEventListener("keydown", this._escDialog);
    document.addEventListener("keydown", this._escDialog = (e) => {
      if (e.key === "Escape") this._chiudiDialog(overlay);
    });
    if (modo === "sboccia") this._puntoDiNascita(overlay, partenza || this._ultimoTasto);
    return overlay;
  }

  // -- i grafici, disegnati a mano: nessuna libreria ------------------------
  _fmtAxis(v) {
    if (!Number.isFinite(v)) return "0";
    // da mille in su si accorcia: "2,5k" sta nel margine, "2500" no
    if (Math.abs(v) >= 1000) {
      const k = v / 1000;
      const s = (Math.abs(k) >= 10 ? k.toFixed(0) : k.toFixed(1)).replace(".", ",");
      return (s.endsWith(",0") ? s.slice(0, -2) : s) + "k";
    }
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
    const plotX0 = 30;
    const plotW = width - plotX0;
    const values = points.map((p) => p.y);
    // Con una scala fissa (basata sul picco storico reale) il minimo resta
    // sempre 0: cosi' il rumore di standby appiattisce vicino al fondo del
    // grafico invece di essere "gonfiato" da un auto-scale sul range minimo
    // dei dati del giorno, e un consumo vero resta comunque ben visibile.
    const min = fixedMax ? 0 : Math.min(...values, 0);
    const max = fixedMax ? Math.max(fixedMax, ...values) : Math.max(...values, min + 1);
    const range = max - min || 1;
    const alt = (y) => height - ((y - min) / range) * (height - 6) - 3;
    // un punto solo (sensore fermo da ore): e' una riga dritta per tutta la
    // larghezza, non un disegno vuoto
    const coords = points.length > 1
      ? points.map((p, i) => [plotX0 + (i * plotW) / (points.length - 1), alt(p.y)])
      : [[plotX0, alt(points[0].y)], [width, alt(points[0].y)]];
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
    return `<svg viewBox="0 0 ${width} ${height}" class="dm-ap-chart-svg">
      <line x1="${plotX0}" y1="3" x2="${plotX0}" y2="${height - 3}" stroke="#94a3b840" stroke-width="1"/>
      <text x="${plotX0 - 4}" y="8" text-anchor="end" font-size="7" font-weight="800" fill="#94a3b8">${this._fmtAxis(max)}</text>
      <text x="${plotX0 - 4}" y="${height - 3}" text-anchor="end" font-size="7" font-weight="800" fill="#94a3b8">${this._fmtAxis(min)}</text>
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
    const primo = !this._hass;
    this._hass = hass;
    // la lingua la chiedo io: un editor si puo' aprire prima che una scheda
    // sia stata disegnata, e li' nessuno l'avrebbe ancora scelta
    scegliLingua(hass);
    // a TUTTI i moduli, non solo a quello in cima: un ha-form senza `hass`
    // non disegna un bel niente, e il cassetto si apriva vuoto
    (this._moduli || (this._form ? [this._form] : [])).forEach((f) => { f.hass = hass; });
    // se `hass` arriva dopo la configurazione, gli elenchi che si leggono da
    // casa (i kWh, i prezzi, i tasti, il sceglitore) erano rimasti vuoti
    if (primo && this._costruito) this._disegna();
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
