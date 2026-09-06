// -*- coding: utf-8 -*-
// Dove va ogni pezzo: prendere, spostare, ridimensionare, misurare.

import { T } from './lingua.js';
import { nomeAttrezzo } from './aiuti.js';
import { nomeTasto, segno } from './segni.js';

export const ConPezzi = (Base) => class extends Base {
  // I pezzi che ha spostato lui: li poso dove ha detto, in percentuale
  // sulla casella, cosi' vanno bene a qualsiasi misura.
  _mettiAPosto() {
    const posti = this._config.posti;
    // a schermo intero comanda il foglio di stile: le posizioni salvate le
    // lascio dove sono, ma non le applico
    const liberi = !this.hasAttribute("pienoschermo")
      && !!posti && Object.keys(posti).length > 0;
    if (!liberi && !this.hasAttribute("liberi")) return;
    this.toggleAttribute("liberi", liberi);
    // niente da misurare quando sono tutti staccati: con l'altezza
    // automatica la casella si accartoccerebbe e i pezzi finirebbero uno
    // sopra l'altro. L'altezza di quando li ha messi a posto se l'e' segnata
    // il riquadro delle impostazioni.
    const altoSuo = Number(this._config.posti_alto);
    if (liberi && altoSuo > 40) {
      this.style.setProperty("--casa-min-height", Math.round(altoSuo) + "px");
    } else if (this.style.getPropertyValue("--casa-min-height")) {
      this.style.removeProperty("--casa-min-height");
    }
    const pezzi = {
      nome: [".testi"],
      misure: [".chips"],
      valore: [".valore"],
      icona: ["svg.icona", "img.ritratto", ".iconaHa", ".iconaFoto"],
      cursore: [".cursore"],
      comandi: [".comandi"],
      // i pezzi del lettore musicale: l'onda del tempo, i tasti del gruppo
      // e della sorgente, l'elenco delle casse, la striscia dei colori.
      // Senza questi, in una casella a pezzi liberi restavano piantati in
      // cima uno sopra l'altro, e non c'era modo di prenderli.
      tempo: [".tempo"],
      extra: [".extra"],
      lettori: [".lettori"],
      colori: [".colori"],
      attrezzi: [".ytattrezzi"],
      cuore: [".ytcuore"],
      // l'icona grande e sbiadita dietro alle scritte: era l'unica che non
      // si poteva prendere. Puo' essere un disegno o una sua foto: e' lo
      // stesso pezzo, ne vive uno alla volta
      sfondo: ["svg.iconafondo", "img.fotofondo"],
    };
    // la barra e i tasti tengono la loro larghezza in percentuale: non sono
    // scritte, allargarli o stringerli e' proprio quello che vuole
    const larghi = { cursore: 1, comandi: 1, tempo: 1, colori: 1, lettori: 1,
      attrezzi: 1 };
    // Ogni pezzo si porta scritto addosso l'ultima disposizione che gli ho
    // dato: se non e' cambiata non riscrivo niente. Serve, perche' qui si
    // passa due volte per ogni ridisegno di ogni casella.
    // la firma la calcolo solo quando cambia la configurazione, e la
    // appiccico ai pezzi come proprieta' (scrivere un attributo lungo su
    // ogni pezzo a ogni giro costa piu' del lavoro che risparmia)
    if (this._firmaPostiDi !== posti) {
      this._firmaPostiDi = posti;
      this._firmaPosti = liberi ? JSON.stringify(posti) : "-";
    }
    // A pezzi liberi le posizioni sono in percentuale, ma le SCRITTE non
    // rimpiccioliscono con la casella: stringendo la finestra il nome
    // finiva addosso alle misure. Se la casella e' piu' stretta di quando
    // lui li ha sistemati, rimpicciolisco tutto della stessa proporzione -
    // come farebbe un foglio stampato in scala.
    let zoom = 1;
    if (liberi) {
      const q = this.getBoundingClientRect().width;
      // la larghezza di riferimento: quella salvata quando li ha sistemati,
      // o - per le caselle sistemate prima che me la segnassi - la piu'
      // larga che le ho mai visto addosso, che se la impara da sola
      const largo0 = Number(this._config.posti_largo) > 40
        ? Number(this._config.posti_largo) : this._largaMaiVista(q);
      if (largo0 > 40 && q > 40) {
        zoom = Math.max(0.55, Math.min(1, q / largo0));
      }
    }
    zoom = Math.round(zoom * 100) / 100;
    this._zoomPosti = zoom;
    // Anche la MISURA dei tasti entra nella firma: la prima volta il foglio
    // di stile puo' non aver ancora dato al play la sua forma piu' grande,
    // e senza questo il ripasso si fermava sul "gia' fatto" lasciandolo
    // storto rispetto agli altri.
    let firmaTasti = "";
    if (liberi) {
      this.shadowRoot.querySelectorAll(".comandi button").forEach((b) => {
        if (!b.hidden) firmaTasti += b.offsetWidth + "x" + b.offsetHeight + ",";
      });
      // e l'altezza delle file intere (volume, tasti, onda, casse): anche
      // quelle possono cambiare forma e vanno rimesse in mezzo
      [".cursore", ".comandi", ".tempo", ".extra", ".lettori", ".colori"]
        .forEach((sel) => {
          const el = this.shadowRoot.querySelector(sel);
          firmaTasti += (el ? el.offsetHeight : 0) + ";";
        });
    }
    const firma = this._firmaPosti + "|" + zoom + "|" + firmaTasti;
    let rcFile = null;
    // se non e' cambiato niente - ne la disposizione, ne le misure che
    // vengono rifatte a ogni valore nuovo - non c'e' niente da rimettere
    // a posto: qui ci si passa due volte per ogni ridisegno.
    if (this._postiFatti === firma && this._chipsViste === this._firmaChips) return;
    this._postiFatti = firma;
    this._chipsViste = this._firmaChips;
    Object.keys(pezzi).forEach((chi) => {
      const dove = liberi ? posti[chi] : null;
      pezzi[chi].forEach((sel) => {
        const el = this.shadowRoot.querySelector(sel);
        if (!el) return;
        if (el._posato === firma) return;
        el._posato = firma;
        if (dove && isFinite(dove.x) && isFinite(dove.y)) {
          // Le file (volume, tasti, onda, casse) le tengo ferme per il
          // centro: se cambio la loro forma - come e' successo alla barra
          // del volume, diventata piu' alta - ancorandole all'angolo si
          // spostano da sole. Il centro invece resta dove l'ha messo lui.
          let qui = dove;
          if (larghi[chi] && isFinite(dove.h) && el.offsetHeight) {
            const rc2 = rcFile || (rcFile = this.riquadroCasella());
            if (rc2 && rc2.height > 10) {
              // misurato come e' salvato: sul video e senza l'ingrandimento
              const altoOra = (el.getBoundingClientRect().height
                / this.quantoIngrandito(el)) / rc2.height * 100;
              qui = { ...dove, y: dove.y + (dove.h - altoOra) / 2, h: altoOra };
            }
          }
          // il timbro e' un disegno quadrato come l'icona: stessa regola
          this._posaPezzo(el, qui, chi === "icona" || chi === "sfondo",
            larghi[chi]);
        } else {
          el.style.left = "";
          el.style.top = "";
          el.style.right = "";
          el.style.width = "";
          el.style.maxWidth = "";
          el.style.height = "";
          el.style.maxHeight = "";
          el.style.transform = "";
          el.style.transformOrigin = "";
          // A pezzi liberi la regola stacca dal flusso TUTTI i pezzi, anche
          // quelli a cui lui non ha ancora dato un posto: quelli finiscono
          // impilati nello stesso punto e l'ultimo si prende i clic degli
          // altri (era il caso dei tastini, coperti dall'elenco della coda).
          // Chi non ha un posto suo torna in fila con gli altri.
          el.style.position = liberi ? "static" : "";
        }
      });
    });
    // e ogni tasto per conto suo, se lui gliene ha dato uno
    const tastiSuoi = liberi
      && Object.keys(posti).some((k) => k.indexOf("tasto:") === 0);
    this.toggleAttribute("tastiliberi", !!tastiSuoi);
    const attrezziSuoi = liberi
      && Object.keys(posti).some((k) => k.indexOf("attrezzo:") === 0);
    this.toggleAttribute("attrezziliberi", !!attrezziSuoi);
    // I tastini delle funzioni: STESSO trattamento dei tasti del lettore.
    // Li tengo fermi per il CENTRO e con la loro misura vera, e non passo
    // dal rimpicciolimento delle scritte - era quello a farli diventare
    // stretti e a spostarli da soli appena ne toccavo uno.
    const rcA = attrezziSuoi ? this.riquadroCasella() : null;
    this.shadowRoot.querySelectorAll(".ytattrezzi button").forEach((b) => {
      const suo = attrezziSuoi ? posti["attrezzo:" + nomeAttrezzo(b)] : null;
      if (!suo || !isFinite(suo.x)) {
        b.style.left = ""; b.style.top = ""; b.style.right = "";
        b.style.transform = ""; b.style.transformOrigin = "";
        b.style.position = attrezziSuoi ? "static" : "";
        return;
      }
      b.style.position = "";
      let dove = suo;
      if (rcA && rcA.width > 10 && rcA.height > 10
        && isFinite(suo.w) && isFinite(suo.h) && b.offsetWidth) {
        const largoOra = b.offsetWidth * zoom / rcA.width * 100;
        const altoOra = b.offsetHeight * zoom / rcA.height * 100;
        const dx2 = (suo.w - largoOra) / 2;
        const dy2 = (suo.h - altoOra) / 2;
        dove = { ...suo, x: suo.x + dx2, y: suo.y + dy2,
                 dx: isFinite(suo.dx) ? suo.dx + dx2 : suo.dx,
                 w: largoOra, h: altoOra };
      }
      this._posaPezzo(b, dove, false, false, true);
    });
    // I tasti li tengo fermi per il CENTRO, non per l'angolo in alto a
    // sinistra: sono di misure diverse fra loro (il play e' piu' grande) e
    // se un giorno cambio la loro forma, ancorandoli all'angolo si
    // spostano tutti. Cosi' invece restano allineati dove li ha messi.
    const rcT = tastiSuoi ? this.riquadroCasella() : null;
    this.shadowRoot.querySelectorAll(".comandi button").forEach((b) => {
      const suo = tastiSuoi ? posti["tasto:" + nomeTasto(b)] : null;
      if (!suo || !isFinite(suo.x)) {
        if (b._posato === firma) return;
        b._posato = firma;
        b._misuraPosata = "";
        b.style.left = ""; b.style.top = ""; b.style.right = "";
        b.style.transform = ""; b.style.transformOrigin = "";
        return;
      }
      // ATTENZIONE: il tasto puo' essere misurato PRIMA che il foglio di
      // stile gli abbia dato la sua forma (il play e' piu' grande degli
      // altri). Se mi fermassi al solito "gia' fatto" resterebbe posato
      // sulla misura sbagliata: guardo anche quanto e' grande adesso.
      const m = b.offsetWidth + "x" + b.offsetHeight;
      if (b._posato === firma && b._misuraPosata === m) return;
      b._posato = firma;
      b._misuraPosata = m;
      let dove = suo;
      if (rcT && rcT.width > 10 && rcT.height > 10
        && isFinite(suo.w) && isFinite(suo.h) && b.offsetWidth) {
        // la misura che conta e' quella dopo il rimpicciolimento, se no il
        // centro finisce da un'altra parte quando la casella e' stretta
        const largoOra = b.offsetWidth * zoom / rcT.width * 100;
        const altoOra = b.offsetHeight * zoom / rcT.height * 100;
        const dx2 = (suo.w - largoOra) / 2;
        const dy2 = (suo.h - altoOra) / 2;
        dove = { ...suo, x: suo.x + dx2, y: suo.y + dy2,
                 dx: isFinite(suo.dx) ? suo.dx + dx2 : suo.dx,
                 w: largoOra, h: altoOra };
      }
      this._posaPezzo(b, dove, false, false, true);
    });
    // e ogni misura per conto suo: si spostano una per una
    const base = (liberi && posti.misure) ? posti.misure : { x: 58, y: 8 };
    this.shadowRoot.querySelectorAll(".chips .metrica").forEach((el, i) => {
      if (el._posato === firma) return;
      el._posato = firma;
      const suo = liberi ? posti["misura:" + el.dataset.eid] : null;
      if (!liberi) {
        el.style.left = ""; el.style.top = ""; el.style.width = "";
        el.style.transform = ""; el.style.transformOrigin = "";
        return;
      }
      const dove = (suo && isFinite(suo.x)) ? suo
        : { x: base.x, y: base.y + i * 13 };
      this._posaPezzo(el, dove, false);
    });
  }

  // Poso un pezzo. Due accortezze imparate a spese sue:
  // - la larghezza NON la fisso in percentuale. La casella vera puo' essere
  //   piu' stretta dell'anteprima, e le scritte non rimpiccioliscono con
  //   lei: una larghezza in percentuale mandava "74 %" a capo, col numero
  //   sopra e il segno sotto. Gli lascio la sua misura naturale.
  // - se il pezzo sta nella meta' destra lo attacco al bordo DESTRO. Cosi'
  //   su una casella piu' stretta resta al suo posto invece di scivolare
  //   verso il centro.
  _posaPezzo(el, dove, eIcona, eLargo, soloPosto) {
    if (el.style.position === "static") el.style.position = "";

    const w = isFinite(dove.w) ? dove.w : 0;
    const aDestra = isFinite(dove.dx) && (dove.x + w / 2) > 50;
    if (aDestra) {
      el.style.left = "auto";
      el.style.right = dove.dx + "%";
    } else {
      el.style.right = "auto";
      el.style.left = dove.x + "%";
    }
    el.style.top = dove.y + "%";
    // la grandezza scelta a mano. Ingrandisco col "transform" e non con la
    // misura del carattere: cosi' funziona uguale per una scritta, per un
    // disegno, per la barra e per i tasti, e il pezzo non va a capo mentre
    // cresce. Il punto fermo e' l'angolo da cui e' attaccato, se no
    // ingrandendo scapperebbe via dal posto dove l'ha messo.
    // Il rimpicciolimento serve solo a quello che NON si adatta da solo:
    // le scritte e i tastini, che sono grandi quanto il loro carattere.
    // La barra, l'onda e il disegno hanno gia' la misura in percentuale
    // della casella: rimpicciolirli ancora li faceva scappare di lato.
    const suoZoom = (eIcona || eLargo) ? 1
      : (this._zoomPosti > 0 ? this._zoomPosti : 1);
    const k = (isFinite(dove.s) && dove.s > 0 ? dove.s : 1) * suoZoom;
    if (k !== 1) {
      el.style.transformOrigin = aDestra ? "top right" : "top left";
      el.style.transform = "scale(" + k + ")";
    } else {
      el.style.transform = "";
      el.style.transformOrigin = "";
    }
    // i tasti tondi tengono la loro misura: se gli tocco la larghezza
    // diventano ovali
    if (soloPosto) return;
    if (eIcona) {
      if (isFinite(dove.h)) {
        el.style.height = dove.h + "%";
        el.style.maxHeight = "none";
        // e LARGA QUANTO E' ALTA. L'altezza e' una percentuale della
        // casella, la larghezza la decideva il foglio di stile: due numeri
        // che vanno per conto loro, e appena la casella cambia forma il
        // tondo diventa un ovale. Con "auto" la larghezza esce dall'altezza
        // (i disegni sono tutti quadrati) e resta tonda comunque.
        el.style.width = "auto";
        el.style.maxWidth = "none";
      }
      return;
    }
    if (eLargo && w > 0) {
      el.style.width = w + "%";
      el.style.maxWidth = "none";
      return;
    }
    el.style.width = "max-content";
    const spazio = aDestra ? (dove.x + w) : (100 - dove.x);
    el.style.maxWidth = "calc(" + Math.max(15, Math.round(spazio)) + "% - 6px)";
  }

  // DI QUANTO E' INGRANDITO QUESTO PEZZO. Serve per togliere
  // l'ingrandimento dalle misure: se no lo salvo dentro alla misura e poi
  // me lo ritrovo applicato una seconda volta sopra.
  quantoIngrandito(el) {
    try {
      const m = getComputedStyle(el).transform;
      if (!m || m === "none") return 1;
      const n = m.match(/matrix\(\s*([-\d.]+)/);
      const k = n ? Math.abs(parseFloat(n[1])) : 1;
      return (isFinite(k) && k > 0.05) ? k : 1;
    } catch (e) { return 1; }
  }

  // Sto dentro alla plancia in modifica? In modifica Home Assistant mi
  // avvolge in "hui-card-options" e la plancia e' un po' diversa da come
  // sara' davvero (compare la colonna dei "+"), quindi quella misura non
  // vale come modello.
  // Dove mi trovo? "prova" = un posto che NON vale come misura vera (le
  // anteprime e la plancia in modifica), "pop" = dentro a un pop-up,
  // "" = sulla plancia per davvero.
  _dovesto() {
    // costa il giro di tutti gli antenati: lo faccio una volta sola, tanto
    // finche' resto attaccato qui il posto non cambia
    if (this._postoSalvato) return this._postoSalvato;
    let n = this;
    let pop = false;
    // profondo: una casella dentro a una griglia dentro al pop-up sta
    // sotto a un bel po' di gusci, e fermandomi troppo presto la contavo
    // come casella della plancia
    for (let i = 0; i < 40; i += 1) {
      n = n.parentNode || n.host;
      if (!n) break;
      const nome = String(n.localName || "");
      const cl = (n.classList && n.classList.contains) ? n.classList : null;
      if (nome === "hui-card-options" || nome === "hui-card-edit-mode"
        || nome === "hui-dialog-edit-card" || nome === "hui-dialog-more-info"
        || (cl && (cl.contains("element-preview") || cl.contains("popup-anteprima")
          || cl.contains("pista")))) {
        this._postoSalvato = "prova";
        return "prova";
      }
      // sopra di me c'e' un'altra casella: sono dentro al SUO pop-up
      if (cl && cl.contains("f-corpo")) pop = true;
      if (nome === "casa-tile") pop = true;
      if (nome === "hui-view" || nome === "hui-sections-view"
        || nome === "hui-masonry-view" || nome === "hui-panel-view") break;
    }
    this._postoSalvato = pop ? "pop" : "";
    return this._postoSalvato;
  }

  _chiaveMisura() {
    const c = this._config || {};
    if (!c.entity && !c.name) return "";
    const dove = this._dovesto();
    if (dove === "prova") return "";
    return "casa-tile:misura3:" + (c.entity || "") + "|" + (c.name || "")
      + (dove === "pop" ? "|pop" : "");
  }

  // La casella piu' larga che ho mai visto: serve alle disposizioni fatte a
  // mano prima che mi segnassi la larghezza di quando le ha composte. Cosi'
  // la proporzione se la impara da sola, senza toccare la configurazione.
  _largaMaiVista(ora) {
    if (this._inModifica() || this.hasAttribute("solo-casella")) return 0;
    const k = this._chiaveMisura();
    if (!k) return 0;
    const chiave = k.replace("misura3:", "largo0:");
    if (this._largoMax === undefined) {
      let letto = 0;
      try { letto = Number(localStorage.getItem(chiave)) || 0; } catch (e) { letto = 0; }
      this._largoMax = letto;
    }
    if (ora > this._largoMax + 2) {
      this._largoMax = Math.round(ora);
      try { localStorage.setItem(chiave, String(this._largoMax)); } catch (e) { /* pazienza */ }
    }
    return this._largoMax;
  }

  // me la segno: e' quella che il riquadro delle impostazioni deve copiare
  _ricordaMisura(w, h) {
    if (!w || !h || this.hasAttribute("solo-casella")) return;
    const detta = Math.round(w) + "x" + Math.round(h);
    if (this._misuraDetta === detta) return;
    if (this._inModifica()) return;
    const k = this._chiaveMisura();
    if (!k) return;
    this._misuraDetta = detta;
    // Mi segno la misura di ADESSO. Avevo provato a tenere la piu' stretta
    // mai vista (la casella e' larga diversa con la barra laterale di Home
    // Assistant aperta o chiusa), ma cosi' il riquadro restava per sempre
    // piu' piccolo del vero e lui vedeva la casella "ristretta".
    try { localStorage.setItem(k, detta); } catch (e) { /* pazienza */ }
  }

  // Il riquadro DENTRO al bordo della casella. Sembra un dettaglio da
  // nulla ma non lo e': un pezzo messo a "left: 50%" parte da dentro il
  // bordo, non da fuori. Misurando il bordo esterno sbagliavo di un paio
  // di pixel ogni volta, ed era il motivo per cui i pezzi non si posavano
  // esattamente dove li lasciava.
  riquadroCasella() {
    const card = this.shadowRoot && this.shadowRoot.querySelector("ha-card");
    if (!card) return null;
    const r = card.getBoundingClientRect();
    if (!r.width || !r.height) return null;
    const st = getComputedStyle(card);
    const bs = parseFloat(st.borderLeftWidth) || 0;
    const ba = parseFloat(st.borderTopWidth) || 0;
    // DI QUANTO E' RIMPICCIOLITA. Il riquadro delle impostazioni puo' far
    // vedere la casella piu' piccola di com'e' (la guarda da lontano): le
    // misure prese sullo schermo sono ridotte, quelle dell'impaginazione
    // no. Mescolarle vuol dire sbagliare ogni percentuale del tanto di cui
    // e' ridotta - ed e' quello che succedeva.
    const f = card.offsetWidth > 0 ? r.width / card.offsetWidth : 1;
    return {
      left: r.left + bs * f,
      top: r.top + ba * f,
      width: (card.clientWidth || r.width) * f,
      height: (card.clientHeight || r.height) * f,
    };
  }

  // dove sta adesso ogni pezzo, in percentuale: serve a partire dalla
  // posizione vera quando si comincia a trascinare
  posizioniAdesso() {
    const q = this.riquadroCasella();
    if (!q) return {};
    const pezzi = {
      nome: ".testi", misure: ".chips", valore: ".valore",
      icona: "svg.icona:not([hidden]), img.ritratto:not([hidden]), "
        + ".iconaHa:not([hidden]), .iconaFoto:not([hidden])",
      cursore: ".cursore:not([hidden])",
      comandi: ".comandi:not([hidden])",
      tempo: ".tempo:not([hidden])",
      extra: ".extra:not([hidden])",
      lettori: ".lettori:not([hidden])",
      colori: ".colori:not([hidden])",
      attrezzi: ".ytattrezzi:not([hidden])",
      cuore: ".ytcuore:not([hidden])",
      sfondo: "svg.iconafondo:not([hidden]), img.fotofondo:not([hidden])",
    };
    const fuori = {};
    const segna = (chi, el) => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      if (!r.width) return;
      fuori[chi] = {
        x: Math.round((r.left - q.left) / q.width * 1000) / 10,
        y: Math.round((r.top - q.top) / q.height * 1000) / 10,
        w: Math.round(r.width / q.width * 1000) / 10,
        h: Math.round(r.height / q.height * 1000) / 10,
        // quanto dista dal bordo destro: serve ai pezzi di destra
        dx: Math.round((q.left + q.width - r.right) / q.width * 1000) / 10,
      };
    };
    Object.keys(pezzi).forEach((chi) =>
      segna(chi, this.shadowRoot.querySelector(pezzi[chi])));
    this.shadowRoot.querySelectorAll(".chips .metrica").forEach((el) =>
      segna("misura:" + el.dataset.eid, el));
    this.shadowRoot.querySelectorAll(".ytattrezzi button").forEach((el) => {
      const chi = nomeAttrezzo(el);
      if (chi) segna("attrezzo:" + chi, el);
    });
    return fuori;
  }

  // Dove stanno adesso i tasti, uno per uno. Serve al riquadro: appena lui
  // ne prende uno fisso anche gli altri dove sono, se no la fila si sfascia
  // nel momento in cui smette di contare come un blocco solo.
  // dove stanno adesso i tastini delle funzioni: serve a fissarli tutti
  // quando lui ne prende uno, se no gli altri saltano via
  posizioniAttrezzi() {
    const q = this.riquadroCasella();
    if (!q) return {};
    const fuori = {};
    this.shadowRoot.querySelectorAll(".ytattrezzi button").forEach((b) => {
      if (b.hidden) return;
      const r = b.getBoundingClientRect();
      const chi = nomeAttrezzo(b);
      if (!r.width || !chi) return;
      fuori["attrezzo:" + chi] = {
        x: Math.round((r.left - q.left) / q.width * 1000) / 10,
        y: Math.round((r.top - q.top) / q.height * 1000) / 10,
        w: Math.round(r.width / q.width * 1000) / 10,
        h: Math.round(r.height / q.height * 1000) / 10,
        dx: Math.round((q.left + q.width - r.right) / q.width * 1000) / 10,
      };
    });
    return fuori;
  }

  posizioniTasti() {
    const q = this.riquadroCasella();
    if (!q) return {};
    const fuori = {};
    this.shadowRoot.querySelectorAll(".comandi button").forEach((b) => {
      if (b.hidden) return;
      const r = b.getBoundingClientRect();
      const chi = nomeTasto(b);
      if (!r.width || !chi) return;
      fuori["tasto:" + chi] = {
        x: Math.round((r.left - q.left) / q.width * 1000) / 10,
        y: Math.round((r.top - q.top) / q.height * 1000) / 10,
        w: Math.round(r.width / q.width * 1000) / 10,
        h: Math.round(r.height / q.height * 1000) / 10,
        dx: Math.round((q.left + q.width - r.right) / q.width * 1000) / 10,
      };
    });
    return fuori;
  }

  // IL QUADRATINO PER TIRARE.
  // Nell'anteprima del pop-up ogni scheda ha il suo, nell'angolo in basso a
  // destra: si tiene premuto e si trascina, verso destra per allargarla e
  // verso il basso per alzarla. Mentre si trascina la scheda si muove
  // subito (se no sembra che non risponda) e alla fine la misura viene
  // scritta nelle impostazioni, che ci pensa l'editor.
  // "chiave" dice a chi appartiene: "2" e' la terza scheda, "2.1" la
  // seconda casella della terza scheda quando quella e' una griglia.
  _attaccaManiglia(cella, chiave, quante, contenitore, stacco) {
    if (!cella || cella._maniglia) return;
    const m = document.createElement("div");
    m.className = "maniglia";
    m.title = T("Tieni premuto e trascina per cambiare la misura di questa scheda");
    const targa = document.createElement("div");
    targa.className = "misurino";
    cella._maniglia = m;
    cella.appendChild(m);
    const g = Number(stacco) || 10;

    // Le misure comode: mezza riga, un terzo, un quarto... Se il dito
    // passa a un pelo da una di queste ci si appoggia, cosi' allineare due
    // schede non e' un lavoro di precisione. Per tutto il resto la misura
    // e' quella che si vede: 37%, 62%, quello che gli pare.
    const COMODE = [100, 75, 200 / 3, 50, 100 / 3, 25, 20];
    const appoggia = (q) => {
      for (let i = 0; i < COMODE.length; i += 1) {
        if (Math.abs(q - COMODE[i]) < 2.2) return COMODE[i];
      }
      return q;
    };

    let preso = null;
    let inCorso = 0;
    // a ogni pixel mi segno solo dov'e' il dito; il disegno si fa una volta
    // per fotogramma, se no si arranca
    const disegna = () => {
      inCorso = 0;
      if (!preso) return;
      const dx = preso.px - preso.x;
      const dy = preso.py - preso.y;
      if (Math.abs(dy) > 8) preso.mossoY = true;
      // la larghezza in percentuale di riga: la scheda e' larga
      // "percentuale meno la sua parte di stacco", quindi il conto si
      // rigira cosi'
      const largo = Math.max(8, Math.min(100,
        ((preso.w + dx + g) / (preso.cw + g)) * 100));
      preso.largo = appoggia(largo);
      preso.alto = Math.max(40, Math.min(4000, Math.round(preso.h + dy)));
      this._stiliMisura(cella, preso.largo,
        preso.mossoY ? preso.alto : 0, g);
      this._riempiBusta(cella);
      targa.textContent = Math.round(preso.largo) + "%"
        + (preso.mossoY ? " \u00d7 " + preso.alto : "");
    };
    const giu = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const r = cella.getBoundingClientRect();
      const cont = contenitore || cella.parentElement;
      preso = {
        x: e.clientX, y: e.clientY, px: e.clientX, py: e.clientY,
        w: r.width, h: r.height,
        cw: (cont && cont.clientWidth) || r.width,
        largo: 0, alto: 0, mossoY: false,
      };
      m.setAttribute("tirando", "");
      this._tirando = String(chiave);
      cella.appendChild(targa);
      try { m.setPointerCapture(e.pointerId); } catch (x) { /* pazienza */ }
      window.addEventListener("pointermove", muovi, true);
      window.addEventListener("pointerup", su, true);
      window.addEventListener("pointercancel", su, true);
    };
    const muovi = (e) => {
      if (!preso) return;
      e.preventDefault();
      e.stopPropagation();
      preso.px = e.clientX;
      preso.py = e.clientY;
      if (!inCorso) inCorso = requestAnimationFrame(disegna);
    };
    const su = (e) => {
      window.removeEventListener("pointermove", muovi, true);
      window.removeEventListener("pointerup", su, true);
      window.removeEventListener("pointercancel", su, true);
      // un ultimo giro con la posizione buona: se lascio il dito fra un
      // fotogramma e l'altro, l'ultimo tratto non si deve perdere
      if (inCorso) cancelAnimationFrame(inCorso);
      inCorso = 0;
      if (preso && e) { preso.px = e.clientX; preso.py = e.clientY; }
      disegna();
      m.removeAttribute("tirando");
      if (targa.parentElement) targa.remove();
      // Il fermo lo tolgo un attimo dopo: la misura nuova deve prima fare
      // il giro delle impostazioni e tornare indietro, se no l'ultimo
      // rivestimento la cancella sul filo di lana.
      clearTimeout(this._scordaTiro);
      this._scordaTiro = setTimeout(() => {
        this._tirando = null;
        // e le schede si rimettono la misura che c'e' scritta adesso
        this._disegnaAntPopup();
      }, 700);
      if (!preso) return;
      const fatto = preso;
      preso = null;
      if (e) { e.preventDefault(); e.stopPropagation(); }
      if (!fatto.largo) return;
      this.dispatchEvent(new CustomEvent("casa-misura-scheda", {
        detail: {
          chiave: String(chiave),
          largo: Math.round(fatto.largo * 10) / 10,
          alto: fatto.mossoY ? fatto.alto : null,
          quante,
          config: this._config,
        },
        bubbles: true,
        composed: true,
      }));
    };
    m.addEventListener("pointerdown", giu);
    // un tocco sul quadratino non deve anche scegliere la scheda
    m.addEventListener("click", (e) => { e.preventDefault(); e.stopPropagation(); });
  }

  // TIENI PREMUTO E SPOSTA, come si fa con i pezzi dentro alla casella.
  // Si tiene premuto un attimo su una scheda dell'anteprima: si stacca, e
  // trascinandola fra le altre si mette dove la si lascia. Fuori si muove
  // fra le schede del pop-up, dentro a una griglia fra le sue caselle.
  // Il quadratino della misura resta fuori da questo giro: li' si tira, non
  // si sposta.
  _attaccaSposta(cella, chiave, contenitore, classe) {
    if (!cella || cella._sposta) return;
    cella._sposta = true;
    let attesa = 0;
    let preso = null;
    let partito = null;
    let inCorso = 0;
    const dito = { x: 0, y: 0 };

    const fratelli = () => Array.prototype.filter.call(contenitore.children,
      (x) => x.classList && x.classList.contains(classe));

    // La selezione del testo, spenta e riaccesa. La spengo dove serve
    // davvero: sulla pagina intera, perche' trascinando si passa sopra a
    // tutto, non solo sopra alle schede.
    let primaSel = null;
    const selezione = (accesa) => {
      const corpo = document.body;
      if (!accesa) {
        if (primaSel === null && corpo) primaSel = corpo.style.userSelect || "";
        if (corpo) {
          corpo.style.userSelect = "none";
          corpo.style.webkitUserSelect = "none";
        }
        contenitore.style.userSelect = "none";
        contenitore.style.webkitUserSelect = "none";
        try {
          const sel = (cella.getRootNode() || document).getSelection
            ? (cella.getRootNode()).getSelection() : window.getSelection();
          if (sel && sel.removeAllRanges) sel.removeAllRanges();
        } catch (e) { /* pazienza */ }
        return;
      }
      if (corpo) {
        corpo.style.userSelect = primaSel === null ? "" : primaSel;
        corpo.style.webkitUserSelect = "";
      }
      primaSel = null;
      contenitore.style.userSelect = "";
      contenitore.style.webkitUserSelect = "";
    };

    // il tocco finale di uno spostamento non deve fare altro
    const inghiotti = (e) => {
      e.preventDefault();
      e.stopPropagation();
      cella.removeEventListener("click", inghiotti, true);
    };

    const molla = () => {
      clearTimeout(attesa);
      attesa = 0;
      if (inCorso) { cancelAnimationFrame(inCorso); inCorso = 0; }
      window.removeEventListener("pointermove", muovi, true);
      window.removeEventListener("pointerup", su, true);
      window.removeEventListener("pointercancel", su, true);
    };

    const giu = (e) => {
      // sul quadratino della misura non si sposta: li' si tira
      const via = e.composedPath ? e.composedPath() : [];
      for (let i = 0; i < via.length; i += 1) {
        if (via[i] === cella) break;
        if (via[i] && via[i].classList && via[i].classList.contains("maniglia")) return;
        // c'e' una scheda piu' dentro (una casella di una griglia): tocca
        // a lei, non a me che la contengo
        if (via[i] && via[i]._sposta) return;
      }
      partito = {
        x: e.clientX, y: e.clientY, id: e.pointerId,
        mouse: String(e.pointerType || "mouse") === "mouse",
      };
      preso = null;
      window.addEventListener("pointermove", muovi, true);
      window.addEventListener("pointerup", su, true);
      window.addEventListener("pointercancel", su, true);
      // Col DITO ci vuole un attimo di attesa: se no ogni scorrimento
      // della pagina diventerebbe uno spostamento. Col mouse no: si preme
      // e si trascina subito, e la presa parte al primo movimento (vedi
      // "muovi"). L'attesa la lascio comunque, per chi tiene premuto fermo.
      attesa = setTimeout(prendi, partito.mouse ? 220 : 260);
    };

    // la scheda si stacca e da qui in poi il tocco e' mio
    const prendi = () => {
      clearTimeout(attesa);
      attesa = 0;
      if (preso || !partito) return;
      preso = true;
      this._tirando = "sposto";
      cella.setAttribute("inmano", "");
      cella.style.touchAction = "none";
      // e niente selezione del testo: trascinando, il mouse evidenziava di
      // blu tutte le scritte che incontrava per strada
      selezione(false);
      cella.addEventListener("click", inghiotti, true);
      // quando lo mollo non deve anche premere il pulsante della scheda
      // che ho in mano
      // e il tocco lo prendo davvero: cosi' il cursore sotto le dita non
      // si muove mentre porto in giro la scheda
      try { cella.setPointerCapture(partito.id); } catch (x) { /* pazienza */ }
    };

    const muovi = (e) => {
      if (!partito) return;
      // se si muove prima che sia passato l'attimo, era solo uno
      // scorrimento della pagina: lascio perdere
      if (attesa) {
        const dx = Math.abs(e.clientX - partito.x);
        const dy = Math.abs(e.clientY - partito.y);
        if (dx < 6 && dy < 6) return;
        // col mouse muoversi VUOL DIRE spostare: si parte subito
        if (partito.mouse) { prendi(); } else {
          // col dito invece era solo uno scorrimento della pagina
          clearTimeout(attesa); attesa = 0; molla(); partito = null;
          return;
        }
      }
      if (!preso) return;
      e.preventDefault();
      e.stopPropagation();
      dito.x = e.clientX;
      dito.y = e.clientY;
      if (!inCorso) inCorso = requestAnimationFrame(sistema);
    };

    // e il rimescolamento si fa una volta per fotogramma: chiedere la
    // misura di tutte le schede a ogni pixel faceva scattare il
    // trascinamento
    const sistema = () => {
      inCorso = 0;
      if (!preso) return;
      let dove = null;
      fratelli().forEach((f) => {
        if (f === cella) return;
        const r = f.getBoundingClientRect();
        if (dito.x >= r.left && dito.x <= r.right
          && dito.y >= r.top && dito.y <= r.bottom) dove = f;
      });
      if (!dove) return;
      const r = dove.getBoundingClientRect();
      // le schede larghe stanno una sotto l'altra: li' conta l'alto e il
      // basso, non la destra e la sinistra
      const larga = r.width > (contenitore.clientWidth || 1) * 0.8;
      const dopo = larga
        ? (dito.y - r.top) > r.height / 2
        : (dito.x - r.left) > r.width / 2;
      contenitore.insertBefore(cella, dopo ? dove.nextSibling : dove);
    };

    const su = (e) => {
      const eraPreso = preso;
      if (eraPreso && e) { dito.x = e.clientX; dito.y = e.clientY; sistema(); }
      molla();
      partito = null;
      preso = null;
      cella.removeAttribute("inmano");
      cella.style.touchAction = "";
      selezione(true);
      // se il tocco finale non arriva (dito uscito dalla scheda) me lo
      // tolgo di mezzo da solo, se no il prossimo tocco sparisce
      setTimeout(() => cella.removeEventListener("click", inghiotti, true), 400);
      clearTimeout(this._scordaTiro);
      this._scordaTiro = setTimeout(() => {
        this._tirando = null;
        // l'ordine e' cambiato: il pop-up va rifatto da capo, se no le
        // schede restano dove le ho lasciate a mano e i loro numeri non
        // corrispondono piu' a quello che c'e' scritto nelle impostazioni
        this._firmaAnt = null;
        this._disegnaAntPopup();
      }, 400);
      if (!eraPreso) return;
      if (e) { e.preventDefault(); e.stopPropagation(); }
      // e adesso non deve anche "scegliere" la scheda che ho lasciato
      this._appenaSpostato = Date.now();
      const dove = fratelli().indexOf(cella);
      if (dove < 0) return;
      const parti = String(chiave).split(".");
      const nuova = parti.length === 1 ? String(dove) : parti[0] + "." + dove;
      if (nuova === String(chiave)) return;
      this.dispatchEvent(new CustomEvent("casa-sposta-scheda", {
        detail: { chiave: String(chiave), a: nuova, config: this._config },
        bubbles: true,
        composed: true,
      }));
    };

    // ASCOLTO PER PRIMO, mentre il tocco scende. Molte schede se lo
    // prendono e non lo lasciano passare oltre (un pulsante, un cursore):
    // stando sotto al loro, su quelle non partivo mai.
    cella.addEventListener("pointerdown", giu, true);
  }

  // LA SCHEDA RIEMPIE LA SUA BUSTA. Alzando la busta, la scheda restava
  // piccola in cima e sotto veniva fuori un vuoto: l'altezza in piu' deve
  // prendersela lei.
  _riempiBusta(busta) {
    if (!busta) return;
    const alta = !!(busta.style.height || busta.style.minHeight);
    // le caselle di una griglia stanno in colonna sempre, anche senza
    // un'altezza data: e' cosi' che la scheda dentro riempie la sua cella
    const inColonna = alta || busta.classList.contains("cella-mia");
    busta.style.display = inColonna ? "flex" : "";
    busta.style.flexDirection = inColonna ? "column" : "";
    const dentro = busta.firstElementChild;
    if (!dentro || dentro.classList.contains("maniglia")
      || dentro.classList.contains("misurino")) return;
    dentro.style.flex = inColonna ? "1 1 auto" : "";
    dentro.style.minHeight = inColonna ? "0" : "";
    // e se e' una casella nostra le dico di non difendersi con la sua
    // altezza minima: se no resta alta com'era e viene solo tagliata
    if (dentro.localName === "casa-tile") {
      dentro.toggleAttribute("misura-fissa", alta);
    }
  }

  // Ripassa la misura delle caselle dentro alle griglie: serve quando
  // cambia solo la misura e il pop-up non viene rifatto da capo.
  _rimisuraCelle(dove) {
    if (!dove || this._tirando) return;
    dove.querySelectorAll(".vestito[data-n]").forEach((busta) => {
      this._riempiBusta(busta);
      const pezzo = this._pezzoDi(busta.dataset.n);
      const cfg = (pezzo && pezzo.cfg) || {};
      if (!Array.isArray(cfg.cards)) return;
      const g = busta.querySelector(".griglia-mia");
      if (!g) return;
      const quante = Math.max(1, Math.min(12, Math.round(
        Number(cfg.columns) > 0 ? Number(cfg.columns) : 3)));
      g.querySelectorAll(":scope > .cella-mia").forEach((cella) => {
        const suo = (cfg.cards || [])[Number(cella.dataset.k)] || {};
        const mis = this._misuraDi(suo, quante);
        this._stiliMisura(cella, mis.largo, mis.alto, 8);
        this._riempiBusta(cella);
      });
    });
  }

  // e' una griglia con roba dentro?
  _eGriglia(cfg) {
    return String((cfg || {}).type || "") === "grid"
      && Array.isArray(cfg.cards) && cfg.cards.length > 0;
  }

  // COSA VA DAVVERO DENTRO AL POP-UP, pezzo per pezzo.
  // Una GRIGLIA non la faccio disegnare a lei: le tolgo il guscio e metto
  // le sue caselle direttamente nella griglia del pop-up, una per una.
  // Sembra identico - stessa quantita' per riga - ma cosi' ognuna puo'
  // avere la SUA misura, cosa che dentro alla griglia di Home Assistant e'
  // impossibile (lei le fa tutte uguali e la misura dei figli la ignora).
  // La chiave "3.2" vuol dire: terza scheda, la sua terza casella.
  // Una scheda, un pezzo. Avevo provato ad APRIRE le griglie - togliere il
  // guscio e mettere le loro caselle una per una nella griglia del pop-up,
  // per dare a ognuna la sua misura - ma cosi' la disposizione cambia: le
  // dodici colonne non si dividono per cinque, e le cinque prese in fila
  // diventavano sei per riga. La griglia la disegna Home Assistant, come
  // ha sempre fatto, e le sue caselle restano come lui le ha messe.
  _pezziFinestra() {
    return this._schedeFinestra().map((cfg, i) => ({
      cfg: cfg || {}, chiave: String(i), base: 12,
    }));
  }

  // la configurazione di un pezzo, data la sua chiave
  _pezzoDi(chiave) {
    const p = String(chiave === undefined || chiave === null ? "" : chiave);
    const pezzi = this._pezziFinestra();
    for (let i = 0; i < pezzi.length; i += 1) {
      if (pezzi[i].chiave === p) return pezzi[i];
    }
    return null;
  }

  // QUANTO E' GRANDE UNA SCHEDA, in percentuale di riga e in punti.
  // "base" e' quante ne stanno in fila quando nessuno dice niente: dodici
  // per il pop-up (una scheda si prende tutta la riga), le colonne della
  // griglia quando la scheda sta dentro a una.
  // Le misure vecchie di Home Assistant continuano a valere: 4 colonne su
  // 12 sono un terzo di riga, 3 righe sono 184 punti.
  _misuraDi(cfg, base) {
    const c = cfg || {};
    const b = Number(base) >= 1 ? Number(base) : 12;
    const mio = c.casa_misura || {};
    let largo = Number(mio.largo);
    let alto = Number(mio.alto);
    if (!(largo > 0)) {
      const g = c.grid_options || {};
      const col = g.columns === "full" ? b : Number(g.columns);
      largo = (isFinite(col) && col >= 1)
        ? (Math.min(col, b) / b) * 100
        : (b === 12 ? 100 : 100 / b);
    }
    if (!(alto > 0)) {
      const r = Number((c.grid_options || {}).rows);
      if ((c.grid_options || {}).rows !== "auto" && isFinite(r) && r >= 1) {
        alto = r * 56 + (r - 1) * 8;
      }
    }
    return {
      largo: Math.max(4, Math.min(100, largo)),
      alto: alto > 0 ? Math.round(alto) : 0,
    };
  }

  // e qui la misura diventa stile. Lo stacco fra le schede lo tolgo dalla
  // larghezza: se no due da meta' riga non ci stanno in fila e vanno a
  // capo (meta' piu' meta' piu' lo stacco fa piu' di una riga).
  _stiliMisura(el, largo, alto, stacco) {
    if (!el) return;
    const q = Math.max(4, Math.min(100, Number(largo) || 100));
    const g = Number(stacco) || 10;
    const tolgo = Math.round(g * (1 - q / 100) * 100) / 100;
    const quanto = "calc(" + (Math.round(q * 100) / 100) + "% - " + tolgo + "px)";
    el.style.flex = "0 0 " + quanto;
    el.style.maxWidth = quanto;
    const a = Number(alto) || 0;
    el.style.height = a > 0 ? a + "px" : "";
    // un pezzo in fila non si stringe sotto al suo contenuto se non
    // glielo si dice: senza questo l'altezza veniva ignorata
    el.style.minHeight = a > 0 ? "0" : "";
    el.style.overflow = a > 0 ? "hidden" : "";
  }

  // la misura della scheda numero i del pop-up
  _misuraPezzo(i) {
    const pezzo = this._pezzoDi(i);
    const m = this._misuraDi((pezzo && pezzo.cfg) || {}, 12);
    if (m.largo === 100 && !m.alto) {
      // le impostazioni delle versioni vecchie, per chi le aveva gia'
      const suoi = Array.isArray((this._config || {}).finestra_schede_stile)
        ? this._config.finestra_schede_stile : [];
      const v = suoi[Number(i)] || {};
      const l = Number(v.largo);
      if (isFinite(l) && l >= 1 && l < 12) m.largo = (l / 12) * 100;
      const a = Number(v.alto);
      if (a > 0) m.alto = Math.round(a);
    }
    return m;
  }

  // QUANTO E' LARGA LA FINESTRA. La decide lui, dalle impostazioni: di
  // suo sono 560 punti, uguali per tutti i pop-up. Prima la allargavo da
  // sola quando le schede stavano affiancate, e quel pop-up veniva fuori
  // diverso da tutti gli altri senza che nessuno l'avesse chiesto.
  _misureFinestra(dove) {
    if (!dove) return;
    const suo = Number((this._config || {}).finestra_largo);
    const larga = (isFinite(suo) && suo >= 320) ? Math.min(1600, suo) : 560;
    dove.style.setProperty("--fin-max", Math.round(larga) + "px");
  }

};
