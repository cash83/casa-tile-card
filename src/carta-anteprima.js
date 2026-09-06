// -*- coding: utf-8 -*-
// La casella dentro al riquadro delle impostazioni.

import { SCHEDA_APERTA, SEGNI_ANTEPRIMA } from './aiuti.js';
import { segno } from './segni.js';

export const ConAnteprima = (Base) => class extends Base {
  // Dove mi trovo? Invece di cercare il nome del riquadro di anteprima
  // (cambia da una versione all'altra di Home Assistant) controllo il
  // contrario: se sopra di me NON c'e' una pagina vera, allora sono in
  // un'anteprima. Cosi' funziona con qualsiasi versione.
  // Sono nel riquadro delle impostazioni? Il segno sicuro e' che sopra
  // di me c'e' una FINESTRA (un "dialog"): la dashboard, anche mentre la
  // modifichi, non sta mai dentro una finestra. Le proprieta' `preview` e
  // `editMode` non bastano: Home Assistant mette `preview` anche in
  // modifica, e dentro il dialogo disegna una finta sezione.
  _dentroAnteprima() {
    const PAGINA = ["hui-view", "hui-sections-view", "hui-masonry-view",
                    "hui-panel-view", "hui-sidebar-view", "hui-view-container"];
    let n = this.parentNode;
    let giri = 0;
    const strada = [];
    while (n && giri < 60) {
      if (n.nodeType === 11 && n.host) { n = n.host; continue; }
      const l = (n.localName || "").toLowerCase();
      if (l) strada.push(l);
      if (l.indexOf("dialog") >= 0 || l === "hui-card-preview"
          || l === "hui-card-picker") { this._strada = strada; return true; }
      if (PAGINA.includes(l)) { this._strada = strada; return false; }
      n = n.parentNode;
      giri += 1;
    }
    this._strada = strada;
    return false;
  }

  // Sono una casella disegnata DENTRO all'anteprima del pop-up di
  // un'altra? Allora la mia anteprima del pop-up non la faccio: se no
  // ogni finestra di impostazioni si mette a costruire pop-up dentro
  // pop-up, telecamere comprese, e la pagina si blocca.
  _dentroUnAltraAnteprima() {
    if (this._annidata !== undefined) return this._annidata;
    let n = this;
    let dentro = false;
    for (let i = 0; i < 40; i += 1) {
      n = n.parentNode || n.host;
      if (!n) break;
      const cl = (n.classList && n.classList.contains) ? n.classList : null;
      if (cl && (cl.contains("popup-anteprima") || cl.contains("f-corpo"))) {
        dentro = true;
        break;
      }
      const nome = String(n.localName || "");
      // anche l'anteprima di una scheda che sto sistemando dentro
      // all'elenco "Schede dentro il pop-up": li' costruire tutto il suo
      // pop-up (telecamere comprese) e' solo peso inutile
      if (nome === "casa-tile-editor") { dentro = true; break; }
      if (nome === "hui-dialog-edit-card"
        || (cl && cl.contains("element-preview"))) break;
    }
    this._annidata = dentro;
    return dentro;
  }

  _cartellino(cfg) {
    const d = document.createElement("div");
    d.className = "cartellino-anteprima";
    const t = String((cfg && cfg.type) || "").replace("custom:", "");
    d.innerHTML = "<span class='segno'>&#128247;</span><span></span>";
    d.querySelector("span:last-child").textContent =
      t + " - anteprima spenta per non tenere accesa la telecamera";
    d.setConfig = () => {};
    return d;
  }

  // LA COLONNA DELL'ANTEPRIMA, E SOLO QUELLA. Quando rifaccio il contenuto
  // del pop-up quella colonna si accorcia e risale in cima, e lui perde di
  // vista proprio la scheda che sta modificando.
  // ATTENZIONE: qui va preso il contenitore dell'ANTEPRIMA, non il primo
  // che scorre. Il primo che scorre puo' essere quello che tiene TUTTE E
  // DUE le colonne, e allora tirandolo sposto anche le impostazioni - era
  // il difetto di prima, saltavano tutte e due. Se non riconosco la colonna
  // dell'anteprima non faccio niente: meglio fermo che storto.
  _scorrevoleAnteprima() {
    if (this._boxAnt && this._boxAnt.isConnected) return this._boxAnt;
    // La cerco PER NOME salendo: nella finestra di Home Assistant la
    // colonna dell'anteprima si chiama "element-preview". Prima pretendevo
    // anche che risultasse scorrevole nel momento in cui guardavo, e se in
    // quell'istante il contenuto ci stava dentro la lasciavo perdere per
    // sempre. Adesso basta il nome: e' lei, e nessun'altra.
    const su = (x) => (x.parentNode ? x.parentNode : (x.host || null));
    let n = su(this);
    for (let i = 0; i < 30 && n; i += 1) {
      const cl = n.nodeType === 1 ? n.classList : null;
      if (cl && (cl.contains("element-preview") || cl.contains("card-preview")
        || cl.contains("preview-container"))) {
        this._boxAnt = n;
        this._spiaLaColonna(n);
        return n;
      }
      n = su(n);
    }
    // Rete di sicurezza: se il nome non lo trovo (versioni diverse di Home
    // Assistant), prendo il primo contenitore che scorre - ma SOLO se
    // dentro non ci sono anche le impostazioni. Se le contiene e' quello
    // condiviso dalle due colonne, e tirarlo sposterebbe anche loro: quello
    // lo tiene gia' l'editor per conto suo.
    n = su(this);
    for (let i = 0; i < 30 && n; i += 1) {
      if (n.nodeType === 1 && n.scrollHeight > n.clientHeight + 4) {
        const come = getComputedStyle(n).overflowY;
        if (come === "auto" || come === "scroll") {
          if (this._contieneImpostazioni(n)) return null;
          this._boxAnt = n;
          this._spiaLaColonna(n);
          return n;
        }
      }
      n = su(n);
    }
    return null;
  }

  // LA COLONNA SI SEGNA DA SOLA DOVE STA. Non posso aspettare che la
  // casella se ne vada per chiederglielo: quando se ne accorge, il browser
  // ha gia' azzerato lo scorrimento (il contenuto e' sparito e quel posto
  // non esiste piu'). Allora e' la colonna a tenere il conto, mentre lui
  // scorre. E le posizioni che arrivano mentre il contenuto e' accorciato
  // non contano: quelle sono il salto, non una sua scelta.
  // dove sta, dentro al contenuto, la scheda che sta modificando
  _ancoraScheda(box) {
    const carta = box.__casaCarta;
    const i = SCHEDA_APERTA.indice;
    if (!carta || !carta.shadowRoot || i === null || i === undefined) return null;
    const b = carta.shadowRoot.querySelector(
      '.pa-dentro .vestito[data-n="' + i + '"]');
    if (!b) return null;
    const rb = b.getBoundingClientRect();
    const rx = box.getBoundingClientRect();
    if (!rb.height) return null;
    return Math.round(rb.top - rx.top + box.scrollTop);
  }

  _spiaLaColonna(box) {
    if (!box || box.__casaSpia) return;
    box.__casaSpia = true;
    SEGNI_ANTEPRIMA.set(box, { dove: box.scrollTop, pieno: box.scrollHeight });
    box.addEventListener("scroll", () => {
      const m = SEGNI_ANTEPRIMA.get(box) || { dove: 0, pieno: 0 };
      if (box.scrollHeight > m.pieno) m.pieno = box.scrollHeight;
      // Mentre sto rimettendo a posto non do retta a niente: gli
      // spostamenti di questi istanti sono il salto e i miei stessi
      // ripassi, non una scelta sua. Senza questo mi segnavo lo zero del
      // salto e da li' in poi rimettevo lo zero.
      if (box.__casaFino && Date.now() < box.__casaFino) return;
      if (box.scrollHeight >= m.pieno * 0.9) {
        m.dove = box.scrollTop;
        m.ancora = this._ancoraScheda(box);
        // stava guardando proprio il FONDO? Allora il punto fermo e' il
        // fondo, non il numero: sotto l'ultima scheda non c'e' niente che
        // tenga su la pagina, e ogni volta che quella cambia misura il
        // fondo gli viene incontro. Restando incollati al fondo, invece,
        // non si muove niente.
        m.alFondo = box.scrollTop >= box.scrollHeight - box.clientHeight - 6;
        m.quando = Date.now();
      }
      SEGNI_ANTEPRIMA.set(box, m);
    }, { passive: true });
  }

  // c'e' dentro anche il riquadro delle impostazioni? (guarda anche dentro
  // ai gusci, ma senza esagerare: e' una risposta che si da' una volta sola)
  _contieneImpostazioni(box) {
    let visti = 0;
    const cerca = (radice) => {
      const roba = radice.querySelectorAll ? radice.querySelectorAll("*") : [];
      for (let i = 0; i < roba.length; i += 1) {
        visti += 1;
        if (visti > 3000) return true;
        const el = roba[i];
        if (el.localName === "casa-tile-editor"
          || el.localName === "hui-card-element-editor") return true;
        if (el.shadowRoot && cerca(el.shadowRoot)) return true;
      }
      return false;
    };
    try { return cerca(box); } catch (e) { return true; }
  }

  _tornaDovEravamo() {
    const box = this._scorrevoleAnteprima();
    if (!box) return;
    // da adesso la casella buona per le misure sono io
    box.__casaCarta = this;
    // quello che la colonna si e' segnata mentre lui scorreva. Se e' zero
    // vuol dire che sta guardando l'inizio: non c'e' niente da rimettere.
    const segno = SEGNI_ANTEPRIMA.get(box);
    if (!segno || !(segno.dove > 4)) return;
    // ATTENZIONE: in questo istante lo scorrimento e' ANCORA dov'era - il
    // browser lo azzera un attimo dopo, quando rifa i conti. Qui prima
    // controllavo "e' gia' a posto?" e buttavo via il segno: e infatti non
    // rimetteva mai niente. Il ripasso va messo in piedi comunque.
    const dove = segno.dove;
    const inizio = Date.now();
    box.__casaFino = Date.now() + 1400;
    let mollato = false;
    const molla = () => { mollato = true; box.__casaFino = 0; };
    ["wheel", "touchmove", "keydown"].forEach((ev) =>
      box.addEventListener(ev, molla, { passive: true, once: true }));
    const rimetti = () => {
      if (mollato || !box.isConnected) return;
      // Se sta modificando una scheda, e' LEI il punto fermo: la rimetto
      // dove stava sullo schermo, invece di rimettere il numero dello
      // scorrimento. Cosi' allargandola e stringendola non gli si muove
      // sotto gli occhi quello che sta guardando.
      let mira = dove;
      if (segno.alFondo) {
        mira = Math.max(0, box.scrollHeight - box.clientHeight);
      } else {
        const ora = this._ancoraScheda(box);
        if (segno.ancora !== null && segno.ancora !== undefined && ora !== null) {
          mira = Math.max(0, dove + (ora - segno.ancora));
        }
      }
      const fondo = box.scrollHeight - box.clientHeight;
      if (mira > fondo) {
        // quel posto non c'e' (ancora?). Per i primi istanti aspetto: il
        // contenuto si sta ancora ricostruendo e fra poco si allunga. Dopo,
        // vuol dire che la scheda si e' proprio accorciata: allora lo
        // porto al fondo, che e' il piu' vicino possibile a dov'era. Senza
        // questo, rimpicciolendo la scheda restava piantato in cima.
        if (Date.now() - inizio < 400) return;
        mira = Math.max(0, fondo);
      }
      if (box.scrollTop !== mira) box.scrollTop = mira;
    };
    rimetti();
    requestAnimationFrame(rimetti);
    (this._segni || []).forEach((t) => clearTimeout(t));
    this._segni = [60, 150, 300, 500, 800, 1200]
      .map((quando) => setTimeout(rimetti, quando));
    this._segni.push(setTimeout(() => {
      ["wheel", "touchmove", "keydown"].forEach((ev) =>
        box.removeEventListener(ev, molla));
    }, 1400));
  }

  _segnoAnteprima() {
    let box = null;
    try { box = this._scorrevoleAnteprima(); } catch (e) { box = null; }
    if (!box) return;
    if (box.scrollHeight <= box.clientHeight + 4) return;
    const dove = box.scrollTop;
    if (!dove) return;
    const rimetti = () => {
      if (!box.isConnected) return;
      // finche' il contenuto non e' tornato lungo quel posto non esiste:
      // aspetto il giro dopo invece di sbattere in fondo
      if (dove > box.scrollHeight - box.clientHeight) return;
      if (box.scrollTop !== dove) box.scrollTop = dove;
    };
    rimetti();
    requestAnimationFrame(rimetti);
    // Le schede del pop-up si ricostruiscono una per una e ci mettono un
    // po': con venti caselle mezzo secondo non basta.
    (this._segni || []).forEach((t) => clearTimeout(t));
    this._segni = [60, 150, 300, 500, 800, 1200]
      .map((quando) => setTimeout(rimetti, quando));
  }

  _inModifica() { return this._dovesto() === "prova"; }

  // La PLANCIA e' in modifica? Li' le sezioni sono piu' strette (c'e' il
  // tasto "+" che ruba spazio) e le caselle si misurano diverse dal vero.
  // Una misura presa in quel momento non va segnata, se no il riquadro
  // "Dove va ogni pezzo" ti fa comporre su una casella che non esiste.
  // Sono l'anteprima dentro alla finestra delle impostazioni? Allora mi
  // metto della misura che ho davvero sulla plancia: guardare un'anteprima
  // larga il doppio e poi trovarsi la casella stretta e' il modo migliore
  // per comporre una disposizione che poi non ci sta.
  // Dalle impostazioni mi chiedono di far vedere come si apre: apro la
  // finestra qui, con quello che c'e' scritto adesso nelle impostazioni -
  // senza aspettare che salvi.
  _ascoltaProve() {
    if (this._ascoltoProve) return;
    const preso = (e) => {
      const suo = (e && e.detail && e.detail.config) || {};
      const mia = this._config || {};
      if (!this.isConnected || !this._dentroAnteprima()) return;
      if (this._dentroUnAltraAnteprima()) return;
      if (String(suo.entity || "") !== String(mia.entity || "")
        || String(suo.name || "") !== String(mia.name || "")) return;
      try {
        this._config = { ...this._config, ...suo };
        this._apriFinestra();
      } catch (er) { /* pazienza */ }
    };
    window.addEventListener("casa-prova-apertura", preso, true);
    this._ascoltoProve = () =>
      window.removeEventListener("casa-prova-apertura", preso, true);
  }

  // Qualcuno ha cambiato la mia grandezza dal riquadro delle impostazioni:
  // la misura segnata e' cambiata e io mi devo rivestire.
  _ascoltaRivestiti() {
    if (this._ascoltoVesti) return;
    const preso = (e) => {
      const d = (e && e.detail && e.detail.config) || {};
      const mia = this._config || {};
      if (String(d.entity || "") !== String(mia.entity || "")
        || String(d.name || "") !== String(mia.name || "")) return;
      this._anteprimaVestita = null;
      this._vestiAnteprima();
    };
    window.addEventListener("casa-rivestiti", preso, true);
    this._ascoltoVesti = () =>
      window.removeEventListener("casa-rivestiti", preso, true);
  }

  _vestiAnteprima() {
    if (this.hasAttribute("solo-casella")) return;
    // dentro alla finestra delle impostazioni sto fermo: niente animazioni
    this.toggleAttribute("in-anteprima", this._dentroAnteprima());
    // la risposta e' sempre la stessa finche' sto dove sto: me la segno,
    // se no rifaccio il giro degli antenati a ogni ridisegno di ogni
    // casella e la plancia si trascina
    if (this._sonoAnteprima === false) return;
    // SOLO l'anteprima della finestra "Configurazione scheda": non le
    // caselle dentro ai pop-up, che stanno anche loro dentro a una finestra
    // ma non c'entrano niente e non vanno ridimensionate.
    let dentro = false;
    let n = this;
    for (let i = 0; i < 40; i += 1) {
      n = n.parentNode || n.host;
      if (!n) break;
      const nome = String(n.localName || "");
      if (nome === "hui-card-options" || nome === "hui-card-edit-mode"
        || nome === "casa-tile" || nome === "hui-dialog-more-info") {
        this._sonoAnteprima = false;
        return;
      }
      const classi = (n.classList && n.classList.contains) ? n.classList : null;
      if (classi && (classi.contains("f-corpo") || classi.contains("popup-anteprima"))) {
        this._sonoAnteprima = false;
        return;
      }
      if (nome === "hui-dialog-edit-card"
          || (classi && classi.contains("element-preview"))) {
        dentro = true;
        break;
      }
    }
    this._sonoAnteprima = dentro;
    if (!dentro) return;
    // la chiave me la faccio qui: `_chiaveMisura()` di proposito non risponde
    // dentro alle anteprime (li' la misura non va SCRITTA), ma io la devo
    // LEGGERE - ed e' proprio questo il posto dove serve
    const c = this._config || {};
    if (!c.entity && !c.name) return;
    const base = "casa-tile:misura3:" + (c.entity || "") + "|" + (c.name || "");
    let detta = "";
    try {
      detta = localStorage.getItem(base) || localStorage.getItem(base + "|pop") || "";
    } catch (e) { /* pazienza */ }
    const pezzi = String(detta).split("x");
    const w = Number(pezzi[0]);
    const h = Number(pezzi[1]);
    if (!(w > 90) || !(h > 40)) return;
    if (this._anteprimaVestita === detta) return;
    const card = this.shadowRoot && this.shadowRoot.querySelector("ha-card");
    if (!card) return;
    this._anteprimaVestita = detta;
    // La misura la do alla CASELLA, non a tutto l'elemento: sotto alla
    // casella ci sta il riquadro "Contenuto del pop-up", e stringendo tutto
    // stringevo anche quello (e il pop-up non c'entra niente con quanto e'
    // larga la casella sulla plancia).
    this.style.maxWidth = "";
    this.style.height = "";
    card.style.maxWidth = Math.round(w) + "px";
    card.style.height = Math.round(h) + "px";
    this._largoAntPopup();
  }

};
