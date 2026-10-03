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

import { esc, numero, tastiDi, ICON_CLOSE, HERO_BUILDERS, CHIP_SVGS, giornoBreve, meseBreve } from './elettro-comune.js';
import { ICONE, disegnoMdi } from './icone.js';
import { scegliLingua, T, TH, laLocale } from './lingua.js';
import { aiutantiVeri, cancellaQuesti, scollegaEntita, ID_TOTALE } from './elettro-crea.js';
import { quali_cancellare } from './elettro-righe-editor.js';
import { rigaFoto, sceltaDisegno } from './editor-foto.js';

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
        // Spegnere la presa mentre l'apparecchio lavora vuol dire fermare il
        // lavaggio a meta'. Quindi la prima premuta chiede e la seconda fa.
        if (!this._chiediPrima(b, t.entity)) return;
        this._hass?.callService(t.entity.split(".")[0], "toggle", { entity_id: t.entity });
      });
    });
  }

  // La domanda la fa il tasto stesso, com'e' gia' nell'editor: la premuta
  // chiede, quella dopo spegne, e dopo sei secondi si dimentica da se'.
  //
  // Non la fa mai da sola: la si accende nell'editor, scheda per scheda
  // (`chiedi_prima`). Serve alla lavatrice, non al PC della scrivania ne'
  // alle luci - li' due premute per spegnere sono solo una seccatura.
  // E anche dove e' accesa chiede SOLO per spegnere (accendere non rompe
  // niente) e SOLO mentre l'apparecchio lavora, cioe' quando la scheda ha
  // messo `_staLavorando`: la scheda di casa non lo mette mai.
  _chiediPrima(b, entity) {
    if (b._chiesto) {
      this._scordaDomanda(b);
      return true;
    }
    if (!this._config.chiedi_prima) return true;
    const st = ((this._hass || {}).states[entity] || {}).state;
    const acceso = !!st && !["off", "unavailable", "unknown"].includes(st);
    if (!this._staLavorando || !acceso) return true;
    const eti = b.querySelector(".dm-ap-tasto-nome");
    b._chiesto = true;
    b._primaDiceva = eti ? eti.textContent : "";
    if (eti) eti.textContent = T("Sta lavorando: premi ancora");
    b.classList.add("chiede");
    b._attesa = setTimeout(() => this._scordaDomanda(b), 6000);
    return false;
  }

  _scordaDomanda(b) {
    if (!b || !b._chiesto) return;
    clearTimeout(b._attesa);
    b._chiesto = false;
    b.classList.remove("chiede");
    const eti = b.querySelector(".dm-ap-tasto-nome");
    if (eti) eti.textContent = b._primaDiceva;
  }

  _tastiAggiorna(hass) {
    tastiDi(this._config).forEach((t, i) => {
      const b = this._root.querySelector(`.dm-ap-tasto[data-tasto="${i}"]`);
      if (!b) return;
      const stato = hass.states[t.entity] || {};
      const st = stato.state;
      // il nome vero. A setConfig `hass` non c'era ancora e restava l'id.
      // Mentre il tasto sta chiedendo no: gli cancellerebbe la domanda.
      if (!t.nome && !b._chiesto) {
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
  // ATTENZIONE a Number(): Number(null) fa 0, e zero e' un numero buono.
  // Percio' un costo che NON C'E' finiva scritto "0,00 \u20ac" accanto a tre
  // righe col trattino - la lavastoviglie senza nessun ciclo registrato.
  // Un numero e' un numero; niente, e' niente.
  _scriviCosto(el, solo, pieno) {
    if (!el) return;
    const conto = (v) => (v === null || v === undefined || v === "" ? NaN : Number(v));
    const uno = conto(solo);
    const inBolletta = conto(pieno);
    el.textContent = Number.isFinite(uno) ? `${numero(uno, 2)} \u20ac` : "\u2014";
    if (Number.isFinite(uno) && Number.isFinite(inBolletta) && inBolletta > 0) {
      const due = document.createElement("span");
      due.className = "dm-ap-due";
      due.textContent = `${numero(inBolletta, 2)} \u20ac`;
      el.appendChild(due);
      el.title = T("prima la sola energia, poi quanto costa in bolletta");
    } else {
      el.removeAttribute("title");
    }
  }

  // una riga "nome ..... valore" dentro a una finestrella
  _row(label, valueHtml, nota) {
    const sotto = nota ? `<small class="dm-ap-row-nota">${esc(nota)}</small>` : "";
    return `<div class="dm-ap-row"><span class="dm-ap-row-label">${esc(label)}${sotto}</span>${valueHtml}</div>`;
  }

  // Da quando conta un contatore. Lo dice il suo `last_reset`, e serve a
  // capire a colpo d'occhio una cosa che sembra uno sbaglio e non lo e':
  // a inizio mese la SETTIMANA puo' essere piu' grande del MESE, perche' e'
  // partita il lunedi' prima, dentro al mese passato. Scritto sotto al nome
  // - "da lun 28 set" contro "da gio 1" - si vede subito perche'.
  // Il mese si scrive solo quando non e' questo: se no e' rumore.
  _daQuando(entityId) {
    const st = entityId ? ((this._hass || {}).states || {})[entityId] : null;
    const grezzo = st && st.attributes ? st.attributes.last_reset : null;
    if (!grezzo) return "";
    const da = new Date(grezzo);
    if (isNaN(da.getTime())) return "";
    const ora = new Date();
    if (da > ora) return "";
    const stessoGiorno = da.toDateString() === ora.toDateString();
    if (stessoGiorno) {
      // il contatore dell'ora: l'ora e' l'unica cosa che lo distingue
      if (da.getHours() || da.getMinutes()) {
        let q;
        try {
          q = da.toLocaleTimeString(laLocale(), { hour: "2-digit", minute: "2-digit" });
        } catch (e) { q = da.getHours() + ":00"; }
        return T("dalle") + " " + q;
      }
      return T("da stanotte");
    }
    // in mezzo a una frase il mese va minuscolo: "da lun 28 set", non "Set"
    const mese = da.getMonth() !== ora.getMonth()
      ? " " + meseBreve(da).toLowerCase() : "";
    return T("da") + " " + giornoBreve(da).toLowerCase() + " " + da.getDate() + mese;
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

  // "Andamento" da solo non dice di chi e'. Ci attacco il nome della scheda,
  // a meno che non ci sia gia' dentro (il grafico di una barra si chiama gia'
  // col nome di quella presa).
  _titoloConNome(title) {
    const t = T(title);
    const nome = (this._config || {}).name;
    if (!nome || !t) return t;
    if (t.toLowerCase().includes(String(nome).toLowerCase())) return t;
    return t + " · " + nome;
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
      <div class="dm-ap-dialog-head"><h3>${esc(this._titoloConNome(title))}</h3><button type="button" class="dm-ap-dialog-close">${ICON_CLOSE}</button></div>
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
  // Le scritte sotto al grafico, messe ognuna sotto al SUO punto. Il disegno
  // comincia dopo l'asse (30 su 300, cioe' un decimo), quindi spalmarle su
  // tutta la larghezza le spostava a sinistra - e lo scarto cresceva verso
  // destra. `barre: true` le centra sulla fetta della barra, se no le mette
  // sul punto della linea.
  _labelSpans(items, count, formatFn, opzioni) {
    if (!items.length) return "";
    const ASSE = 10;
    const barre = !!(opzioni && opzioni.barre);
    const n = Math.min(count, items.length);
    const idxs = [];
    for (let i = 0; i < n; i++) {
      idxs.push(n === 1 ? 0 : Math.round((i * (items.length - 1)) / (n - 1)));
    }
    const seen = new Set();
    const unique = idxs.filter((i) => (seen.has(i) ? false : (seen.add(i), true)));
    const dove = (i) => (barre
      ? ASSE + ((i + 0.5) / items.length) * (100 - ASSE)
      : ASSE + (items.length > 1 ? i / (items.length - 1) : 0.5) * (100 - ASSE));
    return `<div class="dm-ap-chart-labels">${unique.map((i) => `<span style="left:${dove(i).toFixed(2)}%">${formatFn(items[i], i)}</span>`).join("")}</div>`;
  }

  // La scheda dice se vuole la linea morbida (energia) o spigolosa
  // (elettrodomestico: i Watt saltano, e addolcirli direbbe una bugia).
  get _morbida() { return false; }

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

  // LA SCELTA DEL DISEGNO, al posto della tendina. La griglia, il filtro, e
  // sotto le due foto tue: quella di sempre e quella di quando lavora (che
  // puo' essere una gif). Come sulla casella animata.
  _attaccaDisegno(dove, elenco, diSerie) {
    if (!dove || this._grigliaDisegni) return;
    const eti = document.createElement("div");
    eti.className = "ce-aiuto";
    eti.textContent = T("Il disegno della scheda");
    this._grigliaDisegni = sceltaDisegno({
      elenco,
      // l'anteprima: il tondino del disegno se ce l'ha, se no il disegno
      // grande rimpicciolito dal vestito
      disegna: (k) => CHIP_SVGS[k]
        || (HERO_BUILDERS[k] ? HERO_BUILDERS[k]("g" + k) : ""),
      scelto: (this._config || {}).artwork || diSerie,
      scrivi: (k) => this._scriviScelta("artwork", k),
    });
    const etiFoto = document.createElement("div");
    etiFoto.className = "ce-aiuto";
    etiFoto.textContent = T("Oppure una foto tua al posto del disegno");
    this._fotoDisegno = rigaFoto({
      dammiHass: () => this._hass,
      valore: (this._config || {}).disegno_immagine,
      scrivi: (v) => {
        this._scriviScelta("disegno_immagine", v);
        this._fotoDisegno.aggiorna(v);
      },
    });
    this._fotoAccesa = rigaFoto({
      dammiHass: () => this._hass,
      valore: (this._config || {}).disegno_immagine_accesa,
      tasto: T("Immagine di quando lavora (anche una gif)"),
      scrivi: (v) => {
        this._scriviScelta("disegno_immagine_accesa", v);
        this._fotoAccesa.aggiorna(v);
      },
    });
    const nota = document.createElement("div");
    nota.className = "ce-aiuto";
    nota.textContent = T("La seconda si vede solo mentre lavora: a riposo torna quella di sopra.");
    dove.append(eti, this._grigliaDisegni, etiFoto, this._fotoDisegno,
      this._fotoAccesa, nota);
  }

  // La foto di sfondo del pop-up: non un campo dove scrivere "/local/x.jpg"
  // a mano - per riempirlo bisognava gia' sapere come si carica un file su
  // Home Assistant - ma la riga con il tasto, come nella casella animata.
  // Le due schede dei consumi la chiamano una volta, quando si costruiscono.
  _attaccaFoto(dove) {
    if (!dove || this._rigaFoto) return;
    const eti = document.createElement("div");
    eti.className = "ce-aiuto";
    eti.textContent = T("Foto di sfondo del pop-up");
    this._rigaFoto = rigaFoto({
      dammiHass: () => this._hass,
      valore: (this._config || {}).finestra_immagine,
      scrivi: (v) => {
        this._scriviScelta("finestra_immagine", v);
        this._rigaFoto.aggiorna(v);
      },
    });
    dove.append(eti, this._rigaFoto);
  }

  // quando la configurazione arriva da fuori, la riga si rimette a posto
  _rinfrescaFoto() {
    const c = this._config || {};
    if (this._rigaFoto) this._rigaFoto.aggiorna(c.finestra_immagine);
    if (this._fotoDisegno) this._fotoDisegno.aggiorna(c.disegno_immagine);
    if (this._fotoAccesa) this._fotoAccesa.aggiorna(c.disegno_immagine_accesa);
    if (this._grigliaDisegni) this._grigliaDisegni.aggiorna(c.artwork);
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

// Sono dentro all'elenco «aggiungi scheda»? Letto nel codice di Home
// Assistant (hui-card-picker._renderCardElement): la scheda vera la infila
// dentro a <div class="preview"> nell'ombra di `hui-card-picker`, quindi il
// padrone della mia ombra e' lui. Li' basta un figurino e mi rimpicciolisco.
// Nelle versioni vecchie c'era un `hui-card-element-preview`: guardo tutti e
// due, e se un domani cambia ancora non si rompe niente - resto grande.
// Sono dentro all'elenco «aggiungi scheda»? Home Assistant ci mette la
// scheda VERA, a grandezza naturale, dentro a `hui-card-element-preview`.
// Li' basta un figurino, quindi mi rimpicciolisco. Se quel pezzo un giorno
// cambiasse nome non si rompe niente: resto grande come prima.
export function guardaSeAnteprima(el) {
  try {
    const radice = el.getRootNode();
    const chi = radice && radice.host ? String(radice.host.tagName || "") : "";
    if (/CARD-PICKER|CARD-ELEMENT-PREVIEW/i.test(chi)) el.classList.add("in-anteprima");
  } catch (e) { /* in un posto strano: pazienza, resta grande */ }
}
