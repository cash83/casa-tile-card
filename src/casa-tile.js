// -*- coding: utf-8 -*-
// La casella.

import { ONDA_D, PANNELLI_APERTI, PARENTI, PAROLE, RICERCHE, SCHEDA_APERTA, SEGNI_ANTEPRIMA, SPENTI, VELOCITA_TAPPARELLE, daQuanto, fotoDi, nomeAttrezzo, quantoLontano, riempiRiquadro } from './aiuti.js';
import { CIELI, COLORI, METEO, coloreDaGradi, coloreLampada, coloreTemperatura, conAlfa, daRgb, scurisci } from './colori.js';
import { ICONA_METEO, ICONE, aspiraFuori, disegnoAspira, disegnoBatteria, disegnoMdi, disegnoTapparella, disegnoTermometro, iconaAutomatica, indirizzoFoto, tagliaTapparella } from './icone.js';
import { metti, nomeArtista, nomeTasto, segno, valoreScritto } from './segni.js';
import { STILE } from './stile.js';
import { daYaml } from './yaml.js';

export class CasaTile extends HTMLElement {
  static getConfigElement() { return document.createElement("casa-tile-editor"); }

  static getStubConfig() {
    return { type: "custom:casa-tile", icona: "auto", colore: "ambra" };
  }

  setConfig(config) {
    this._base = { icona: "auto", colore: "ambra", azione: "toggle",
                   usa_foto: true, ...config };
    // La disposizione con la sua ytmusic-card incastrata dentro non esiste
    // piu': le caselle che ce l'hanno ancora scritta passano a quella
    // nostra, con i tastini gia' accesi. Cosi' non si svuotano da sole.
    if (this._base.disposizione === "ytcard") {
      this._base = { ...this._base, disposizione: "ytmusic",
        yt_attrezzi: this._base.yt_attrezzi === undefined
          ? true : this._base.yt_attrezzi,
        coda: this._base.coda === undefined ? true : this._base.coda,
        yt_cuore: this._base.yt_cuore === undefined
          ? true : this._base.yt_cuore };
    }
    this._config = this._base;
    // IL SEGNO DELLA COLONNA DI DESTRA. Ogni ritocco ridisegna la casella,
    // che per un attimo e' piu' corta: il browser tronca lo scorrimento e
    // lui perde di vista proprio la scheda che sta modificando. Mi segno
    // dove sta PRIMA che cambi qualcosa.
    // Questo tocca SOLO la colonna dell'anteprima: se non la riconosco
    // (per esempio sulla plancia vera) non fa niente - vedi
    // _scorrevoleAnteprima.
    this._segnoAnteprima();
    this._firmaLettori = null;
    // La cassa ricordata la rimetto SOLO se non ne sto gia' seguendo una.
    // Prima la rimettevo sempre: e siccome l'anteprima delle impostazioni
    // riceve la configurazione da capo a ogni ritocco (e a ogni pezzo che
    // lui sposta), la casella si dimenticava la cassa che stava suonando e
    // tornava a quella scritta - ferma, quindi senza copertina, senza barra
    // del tempo e senza sfondo, proprio mentre lui sistemava i pezzi.
    if (!this._scelto && this._lettori().length > 1) {
      const ricordato = this._leggiScelto();
      if (ricordato && this._lettori().includes(ricordato)) this._scelto = ricordato;
    }
    // NON si rifa' da zero: il contenuto della casella e' sempre lo stesso e
    // rifarlo chiuderebbe i riquadri aperti a ogni ritocco delle impostazioni
    this._render();
  }

  // Home Assistant manda un aggiornamento a TUTTE le caselle ogni volta che
  // una qualsiasi entita' della casa cambia. Con settantasei caselle e
  // migliaia di entita' vuol dire ridisegnare tutto centinaia di volte al
  // minuto per niente: qui guardo solo le entita' che questa casella usa
  // davvero, e se non e' cambiata nessuna non muovo un dito.
  set hass(hass) {
    const prima = this._hass;
    this._hass = hass;
    if (prima && this._costruito && !this._miRiguarda(prima, hass)) return;
    // I valori arrivano a valanga: Home Assistant ne manda anche qualche
    // migliaio al secondo quando in casa c'e' movimento, e a ogni valanga
    // vorrebbe farmi ridisegnare. Non serve a niente: l'occhio ne vede
    // sessanta. Al massimo dieci disegni al secondo, l'ultimo valore non si
    // perde (arriva col disegno in coda).
    const ora = Date.now();
    const passato = ora - (this._ultimoDisegno || 0);
    if (this._costruito && passato < 100) {
      if (!this._disegnoHass) {
        this._disegnoHass = setTimeout(() => {
          this._disegnoHass = 0;
          this._ultimoDisegno = Date.now();
          if (this.isConnected) this._render();
        }, 100 - passato);
      }
      return;
    }
    this._ultimoDisegno = ora;
    this._render();
  }

  _miRiguarda(prima, ora) {
    if (!prima || !ora || !prima.states || !ora.states) return true;
    if (prima.states === ora.states) return false;
    // col pop-up aperto (o un riquadro) dentro ci sono schede di Home
    // Assistant che vogliono sapere tutto: li' ridisegno sempre
    if (this._velo && this._velo.hasAttribute("aperto")) return true;
    if (this._panGruppo && !this._panGruppo.hidden) return true;
    if (this._panFonti && !this._panFonti.hidden) return true;
    if (this._antPopup && !this._antPopup.hidden) return true;
    const quali = this._entitaSeguite();
    if (quali === null) return true;   // non lo so: meglio ridisegnare
    for (let i = 0; i < quali.length; i += 1) {
      if (prima.states[quali[i]] !== ora.states[quali[i]]) return true;
    }
    return false;
  }

  // tutte le entita' che questa casella legge: quelle scritte nelle
  // impostazioni piu' quelle che si e' andata a cercare da sola
  _entitaSeguite() {
    const c = this._config || {};
    const chiave = JSON.stringify([c.entity, c.info_entita, c.acceso_entita,
      c.meteo_entita, c.lettori, c.distanza_entita, c.sottotitolo_entita,
      c.carica_entita, c.scarica_entita, c.finestra_entita]);
    if (this._chiaveSeguite !== chiave) {
      this._chiaveSeguite = chiave;
      const dentro = [];
      const metti = (x) => {
        if (!x) return;
        if (Array.isArray(x)) x.forEach(metti);
        else if (typeof x === "string") dentro.push(x);
      };
      metti(c.entity); metti(c.info_entita); metti(c.acceso_entita);
      metti(c.meteo_entita); metti(c.lettori); metti(c.distanza_entita);
      metti(c.sottotitolo_entita); metti(c.carica_entita); metti(c.scarica_entita);
      metti(c.finestra_entita);
      this._seguite = dentro;
      // una casella della musica senza l'elenco delle casse va a cercarsele
      // da sola fra tutti i lettori: li' non posso fare i furbi
      this._cercaCasse = String(c.entity || "").indexOf("media_player.") === 0
        && !(Array.isArray(c.lettori) && c.lettori.length);
    }
    if (this._cercaCasse) return null;
    const extra = this._lette ? Array.from(this._lette) : [];
    return extra.length ? this._seguite.concat(extra) : this._seguite;
  }

  // Home Assistant mette `preview` sia nel riquadro delle impostazioni
  // sia quando la dashboard e' in modifica; per distinguere c'e'
  // `editMode`, che e' vero SOLO mentre si modifica la pagina.
  set preview(v) {
    this._anteprima = !!v;
    if (this._costruito) this._disegnaAntPopup();
  }

  get preview() { return !!this._anteprima; }

  set editMode(v) {
    this._modifica = !!v;
    if (this._costruito) this._disegnaAntPopup();
  }

  get editMode() { return !!this._modifica; }

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

  // Il riquadro del pop-up si prende tutta la colonna dell'anteprima, non
  // solo il pezzetto che Home Assistant da' alla casella (largo quanto la
  // card sulla plancia: 6 colonne su 12). Lo spazio vero glielo misuro
  // sull'antenato che lo contiene.
  _largoAntPopup() {
    const box = this._antPopup;
    if (!box || box.hidden) return;
    let n = this;
    let largo = 0;
    for (let i = 0; i < 20; i += 1) {
      n = n.parentNode || n.host;
      if (!n) break;
      const cl = (n.classList && n.classList.contains) ? n.classList : null;
      if (String(n.localName || "") === "hui-dialog-edit-card"
        || (cl && cl.contains("element-preview"))) {
        largo = (n.clientWidth || 0) - 6;
        break;
      }
    }
    const mio = this.clientWidth || 0;
    if (largo > 200 && largo > mio + 12) {
      if (box._largo !== largo) { box._largo = largo; box.style.width = largo + "px"; }
    } else if (box._largo) {
      box._largo = 0;
      box.style.width = "";
    }
  }

  // Roba che nell'anteprima non va costruita per davvero: le telecamere
  // accendono lo stream (e in una finestra di impostazioni aperta e chiusa
  // dieci volte diventano gigabyte di video in memoria). Nell'anteprima
  // basta un cartellino con il nome.
  _pesante(cfg) {
    const t = String((cfg && cfg.type) || "").toLowerCase();
    // le nostre caselle si costruiscono sempre: sono leggere, e alla
    // telecamera qui sotto rallento la diretta (uno scatto ogni due minuti)
    if (t === "custom:casa-tile") return false;
    if (t.indexOf("camera") >= 0 || t.indexOf("webrtc") >= 0
      || t.indexOf("frigate") >= 0 || t.indexOf("stream") >= 0) return true;
    if (cfg && (cfg.camera_entity || cfg.cameras)) return true;
    if (cfg && String(cfg.entity || "").indexOf("camera.") === 0) return true;
    return false;
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

  async _disegnaAntPopup() {
    const box = this._antPopup;
    if (!box) return;
    // MENTRE TIRA L'ANGOLO NON SI TOCCA NIENTE. Se no arriva un valore da
    // casa, rifaccio il giro delle schede, ognuna si riprende la misura
    // scritta nelle impostazioni - che e' ancora quella vecchia - e la
    // scheda torna indietro sotto le sue dita.
    if (this._tirando) return;
    const c = this._config || {};
    const schede = c.finestra_cards || (c.finestra_card ? [c.finestra_card] : null);
    // nel riquadro dove si trascinano i pezzi voglio SOLO la casella:
    // il contenuto del pop-up li' dentro non c'entra niente
    const mostra = !this.hasAttribute("solo-casella")
      && this._dentroAnteprima() && !this._dentroUnAltraAnteprima()
      && c.azione === "finestra"
      && !!schede && schede.length > 0;
    box.hidden = !mostra;
    if (!mostra) { box.innerHTML = ""; this._firmaAnt = null; return; }

    // LA MISURA NON CONTA NELLA FIRMA. Se cambia solo il layout di una
    // scheda - ed e' quello che succede a ogni scatto mentre trascini il
    // cursore - non c'e' niente da rifare: basta rivestire le schede che
    // ci sono gia'. Rifacendo tutto, il contenuto spariva per un attimo a
    // ogni scatto e la colonna saltava in cima.
    // LA MISURA NON ENTRA NELLA FIRMA, nemmeno quella delle caselle dentro
    // a una griglia: se no tirando l'angolo di una casella rifacevo tutto
    // il pop-up a ogni scatto, con il lampeggio e la colonna che salta.
    const senzaMisura = (c) => {
      const x = { ...(c || {}) };
      delete x.grid_options;
      if (Array.isArray(x.cards)) x.cards = x.cards.map(senzaMisura);
      return x;
    };
    const firma = JSON.stringify(schede.map(senzaMisura));
    if (this._firmaAnt === firma) {
      // I valori glieli do UNA volta sola: e' un'anteprima, serve a far
      // vedere com'e' fatto il pop-up, non a tenerlo aggiornato. Prima
      // ripassavo power-flow, griglie e venti caselle a ogni stato che
      // cambiava in casa, e la finestra si trascinava. (A chi e' nato
      // prima che arrivassero i valori glieli do adesso, se no resta
      // vuoto per sempre.)
      if (this._hass) {
        (this._anteprimaSchede || []).forEach((el) => {
          if (el._ebbeValori) return;
          el._ebbeValori = true;
          try { el.hass = this._hass; } catch (e) { /* pazienza */ }
        });
      }
      this._misureFinestra(box.querySelector(".pa-dentro"));
      box.querySelectorAll(".vestito").forEach((b) =>
        this._vestiScheda(b, Number(b.dataset.n) || 0));
      this._rimisuraCelle(box);
      this._largoAntPopup();
      return;
    }
    this._firmaAnt = firma;
    this._segnoAnteprima();
    box.innerHTML = "<div class='titoletto'>Contenuto del pop-up</div>";
    const dentro = document.createElement("div");
    dentro.className = "pa-dentro";
    this._misureFinestra(dentro);
    box.appendChild(dentro);
    this._anteprimaSchede = [];
    try {
      const aiuti = await window.loadCardHelpers();
      this._pezziFinestra().forEach((pezzo) => {
        const cfg = pezzo.cfg;
        const i = pezzo.chiave;
        try {
          // LA TELECAMERA VA IN DIRETTA ANCHE NELL'ANTEPRIMA, esattamente
          // come nella casella vera. Prima gliela spegnevo (la diretta e' la
          // cosa che mangia piu' memoria, e qui dentro di caselle ce ne
          // possono essere venti) e la sua casella veniva fuori vuota: non
          // si capiva nemmeno cosa ci sarebbe stato. Adesso non le tocco
          // niente - se il riquadro delle impostazioni si appesantisce con
          // molte telecamere, il posto dove rimediare e' questo.
          const suo = { ...cfg };
          const el = this._eGriglia(suo)
            ? this._costruisciGriglia(suo, aiuti, this._anteprimaSchede)
            : (this._pesante(suo) ? this._cartellino(suo)
              : aiuti.createCardElement(suo));
          el.hass = this._hass;
          el._ebbeValori = !!this._hass;
          const busta = document.createElement("div");
          busta.className = "vestito";
          busta.dataset.n = String(i);
          this._vestiScheda(busta, i);
          busta.appendChild(el);
          dentro.appendChild(busta);
          this._anteprimaSchede.push(el);
          // il quadratino per tirare: alla scheda intera e, se e' una
          // griglia, a ognuna delle sue caselle
          // il quadratino della misura solo a chi nel riquadro "Dove va
          // ogni pezzo" non ci puo' andare: le caselle nostre si toccano e
          // si sistemano di la', grandezza compresa
          const nostra = (x) => String((x || {}).type || "") === "custom:casa-tile";
          if (!nostra(suo)) this._attaccaManiglia(busta, String(i), 12, dentro, 10);
          this._attaccaSposta(busta, String(i), dentro, "vestito");
          busta.querySelectorAll(".griglia-mia > .cella-mia").forEach((cella) => {
            const g = cella.parentElement;
            const k = Number(cella.dataset.k);
            if (!nostra((suo.cards || [])[k])) {
              this._attaccaManiglia(cella, i + "." + cella.dataset.k,
                Math.max(1, Number(g.dataset.colonne) || 3), g, 8);
            }
            this._attaccaSposta(cella, i + "." + cella.dataset.k, g, "cella-mia");
          });
        } catch (e) { /* una scheda che non va non ferma le altre */ }
      });
    } catch (e) { /* niente aiuti: pazienza */ }
    this._largoAntPopup();
    // toccando una casella qui dentro si sceglie quale sistemare nel
    // riquadro "Dove va ogni pezzo": cosi' basta un riquadro solo, nella
    // pagina principale, invece di rifare tutto dentro ogni scheda
    dentro.addEventListener("click", (e) => {
      const via = e.composedPath ? e.composedPath() : [];
      let scelta = null;
      for (let i = 0; i < via.length; i += 1) {
        if (via[i] === dentro) break;
        if (via[i] && via[i].localName === "casa-tile") { scelta = via[i]; break; }
      }
      if (!scelta || !scelta._config) return;
      e.preventDefault();
      e.stopPropagation();
      // se ho appena lasciato una scheda spostata, quel click e' la coda
      // dello spostamento: non deve anche cambiare la scheda scelta
      if (this._appenaSpostato && Date.now() - this._appenaSpostato < 500) return;
      this.dispatchEvent(new CustomEvent("casa-scegli-scheda", {
        detail: { config: scelta._config, elemento: scelta },
        bubbles: true, composed: true,
      }));
    }, true);
  }

  // Il pop-up vero e' largo 560px (meno i suoi bordi): l'anteprima nelle
  // impostazioni ne ha molti meno. Disegno il contenuto alla larghezza VERA
  // e poi rimpicciolisco tutto insieme, cosi' le schede stanno come
  // staranno davvero invece di stringersi e andare a capo per conto loro.
  getCardSize() { return this._config && this._config.grande ? 3 : 2; }
  // CHI COMANDA L'ALTEZZA. Home Assistant, quando la casella dichiara un
  // NUMERO di righe, mette al contenitore un'altezza precisa
  //   height: calc(righe * (altezza_riga + spazio) - spazio)
  // e si aspetta che la casella ci stia dentro. Quando invece le righe sono
  // "auto" (che e' anche il valore di partenza se non le dichiaro) non
  // impone niente: alta quanto il contenuto.
  // Quindi: righe a numero -> nessun minimo mio, se no il cursore del
  // Layout non riesce a scendere; righe automatiche -> il minimo serve, se
  // no una casella vuota si accartoccia.
  getGridOptions() {
    const c = this._config || {};
    const dominio = c.entity ? c.entity.split(".")[0] : "";
    const modo = c.disposizione || (dominio === "media_player" ? "vinile" : "");
    if (modo === "vinile" || modo === "ytmusic") {
      return c.grande
        ? { columns: 8, rows: 8, min_columns: 4, max_columns: 12,
            min_rows: 1, max_rows: 12 }
        : { columns: 6, rows: 7, min_columns: 3, max_columns: 12,
            min_rows: 1, max_rows: 12 };
    }
    // Quanto spazio chiedere appena nasce: sei colonne (mezza sezione
    // stretta, un sesto di una larga) e DUE righe per tutti. Avevo provato a
    // dare una riga in piu' a chi ha i tasti rapidi, la barra o il grafico,
    // ma le sue caselle vere - tapparella con barra, consumo con grafico -
    // stanno benissimo in due righe: chiedere di piu' le faceva nascere
    // troppo alte. Solo la "casella grande" ne chiede tre.
    // "min_rows: 1": se no Home Assistant prende queste righe come minimo e
    // il cursore del Layout risale da solo quando lui lo abbassa.
    // E i limiti li scrivo tutti e quattro: quelli che non dico se li
    // inventa Home Assistant, e il cursore del Layout si ferma dove vuole lui.
    const righe = c.grande ? 3 : 2;
    return { columns: 6, rows: righe, min_columns: 3, max_columns: 12,
             min_rows: 1, max_rows: 12 };
  }

  _costruisci() {
    const root = this.attachShadow ? (this.shadowRoot || this.attachShadow({ mode: "open" })) : this;
    root.innerHTML = `<style>${STILE}</style>
      <ha-card tabindex="0">
        <div class="cielo" hidden></div>
        <svg class="iconafondo" viewBox="0 0 64 64" fill="none" aria-hidden="true" hidden></svg>
        <img class="fotofondo" alt="" aria-hidden="true" hidden>
        <div class="copertina" hidden></div>
        <div class="lettori" hidden></div>
        <div class="ytattrezzi" hidden>
          <button class="t-cerca" type="button" title="Cerca"><ha-icon icon="mdi:magnify"></ha-icon></button>
          <button class="t-sfoglia" type="button" title="Sfoglia la musica"><ha-icon icon="mdi:folder-music"></ha-icon></button>
          <button class="t-coda" type="button" title="Mostra la coda"><ha-icon icon="mdi:playlist-music"></ha-icon></button>
          <button class="t-pieno" type="button" title="Schermo intero"><ha-icon icon="mdi:fullscreen"></ha-icon></button>
        </div>
        <button class="ytcuore" type="button" hidden title="Preferito"><ha-icon icon="mdi:heart-outline"></ha-icon></button>
        <div class="pannello incoda" hidden>
          <div class="p-testa"><span>In coda</span><button class="p-chiudi" type="button">&times;</button></div>
          <div class="ytcoda"></div>
        </div>
        <div class="pannello sfoglia" hidden>
          <div class="p-testa"><button class="s-indietro" type="button" hidden>&#8249;</button><span class="s-titolo"></span><button class="p-chiudi" type="button">&times;</button></div>
          <div class="s-fonti"></div>
          <div class="p-corpo s-elenco"></div>
        </div>
        <div class="menucoda" hidden></div>
        <div class="pannello cerca" hidden>
          <div class="p-testa"><span>Cerca</span><button class="p-chiudi" type="button">&times;</button></div>
          <div class="c-riga">
            <input class="c-testo" type="search" placeholder="Brani, album, artisti...">
            <button class="c-vai" type="button"><ha-icon icon="mdi:magnify"></ha-icon></button>
          </div>
          <div class="c-tipi"></div>
          <div class="p-corpo c-esiti"></div>
        </div>
        <div class="testa"><div class="testi"><div class="nome"></div><div class="sotto"></div></div><div class="chips"></div><div class="meteo" hidden><div class="gradi"></div><div class="cond"></div></div></div>
        <div class="riga"><svg class="icona" viewBox="0 0 64 64" fill="none"></svg><ha-icon class="iconaHa" hidden></ha-icon><img class="iconaFoto" alt="" hidden><img class="ritratto" alt="" hidden><div class="valore"></div></div>
        <svg class="andamento" viewBox="0 0 100 30" preserveAspectRatio="none" hidden>
          <defs><linearGradient class="scala" x1="0" y1="1" x2="0" y2="0"></linearGradient></defs>
          <path class="pieno"></path><path class="riga"></path>
        </svg>
        <div class="mirino" hidden><i class="mira"></i><b class="palla"></b></div>
        <div class="cartellino" hidden></div>
        <div class="tempo" hidden>
          <div class="binario"><i></i></div>
          <div class="ondabox">
            <svg class="onda" viewBox="0 0 300 26" preserveAspectRatio="none">
              <defs><linearGradient id="grOnda" x1="0" y1="0" x2="1" y2="0">
                <stop class="s1" offset="0"></stop><stop class="s2" offset="1"></stop>
              </linearGradient></defs>
              <path class="fondo" d="${ONDA_D}" pathLength="100"></path>
              <path class="fatta" d="${ONDA_D}" pathLength="100" stroke-dasharray="0 100"></path>
            </svg>
            <span class="pallino"></span>
          </div>
          <span class="orologio"></span>
        </div>
        <div class="comandi" hidden>
          <button class="prec" title="Precedente">${segno("prec")}</button>
          <button class="play grosso" title="Play / pausa">${segno("play")}</button>
          <button class="succ" title="Successivo">${segno("succ")}</button>
          <button class="stop" title="Ferma">${segno("stop")}</button>
          <button class="su" title="Apri">${segno("su")}</button>
          <button class="fermo" title="Ferma">${segno("stop")}</button>
          <button class="giu" title="Chiudi">${segno("giu")}</button>
          <button class="chiudi" title="Chiudi a chiave">${segno("serra")}</button>
          <button class="sblocca" title="Apri">${segno("apri")}</button>
          <button class="via" title="Avvia">${segno("play")}</button>
          <button class="sosta" title="Pausa">${segno("pausa")}</button>
          <button class="casa" title="Torna alla base">${segno("base")}</button>
        </div>
        <div class="cursore" hidden><button class="muto" type="button" hidden></button><input type="range" min="0" max="100" step="1"><span class="quanto"></span></div>
        <div class="colori" hidden>
          <input class="tinta" type="range" min="0" max="360" step="1">
          <input class="calore" type="range" min="2000" max="6500" step="50">
          <button class="scambio" type="button" title="Colori o bianco"></button>
        </div>
        <div class="extra" hidden>
          <button class="b-gruppo" type="button">Casse<span class="freccia">\u25BC</span></button>
          <button class="b-fonte" type="button">Sorgente<span class="freccia">\u25BC</span></button>
        </div>
        <div class="pannello gruppo" hidden>
          <div class="p-testa"><span>Casse del gruppo</span><button class="p-chiudi" type="button">&times;</button></div>
          <div class="p-corpo"></div>
        </div>
        <div class="pannello fonti" hidden>
          <div class="p-testa"><span>Sorgente</span><button class="p-chiudi" type="button">&times;</button></div>
          <div class="p-corpo"></div>
        </div>
      </ha-card>
      <div class="popup-anteprima" hidden></div>
      <div class="velo" part="velo">
        <div class="finestra">
          <div class="f-testa">
            <svg class="f-icona" viewBox="0 0 64 64" fill="none"></svg>
            <div class="f-titolo"></div>
            <button class="f-chiudi" title="Chiudi">&times;</button>
          </div>
          <div class="f-corpo"></div>
        </div>
      </div>`;
    this._card = root.querySelector("ha-card");
    this._nome = root.querySelector(".nome");
    this._sotto = root.querySelector(".sotto");
    this._meteo = root.querySelector(".meteo");
    this._cielo = root.querySelector(".cielo");
    this._copertina = root.querySelector(".copertina");
    const apriMeteo = (e) => {
      const eid = this._config.meteo_entita;
      if (!eid) return;
      e.stopPropagation();
      this.dispatchEvent(new CustomEvent("hass-more-info", {
        detail: { entityId: eid }, bubbles: true, composed: true,
      }));
    };
    this._meteo.tabIndex = 0;
    this._meteo.title = "Tocca per le previsioni";
    this._meteo.addEventListener("click", apriMeteo);
    this._meteo.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); apriMeteo(e); }
    });
    this._gradi = root.querySelector(".meteo .gradi");
    this._cond = root.querySelector(".meteo .cond");
    this._svg = root.querySelector("svg.icona");
    this._svgFondo = root.querySelector("svg.iconafondo");
    this._fotoFondo = root.querySelector("img.fotofondo");
    this._svgHa = root.querySelector(".iconaHa");
    this._svgFoto = root.querySelector(".iconaFoto");
    this._ritratto = root.querySelector("img.ritratto");
    this._valore = root.querySelector(".valore");
    this._chips = root.querySelector(".chips");
    this._firmaChips = null;
    this._andamento = root.querySelector(".andamento");
    this._mirino = root.querySelector(".mirino");
    this._scala = root.querySelector(".andamento .scala");
    this._cartellino = root.querySelector(".cartellino");
    const card0 = root.querySelector("ha-card");
    ["pointermove", "pointerdown"].forEach((ev) =>
      card0.addEventListener(ev, (e) => this._muoviMirino(e)));
    ["pointerleave", "pointercancel", "pointerup"].forEach((ev) =>
      card0.addEventListener(ev, () => this._nascondiMirino()));
    this._tempo = root.querySelector(".tempo");
    this._binario = root.querySelector(".tempo .binario i");
    this._fatta = root.querySelector(".ondabox path.fatta");
    this._pallino = root.querySelector(".ondabox .pallino");
    this._orologio = root.querySelector(".tempo .orologio");
    this._comandi = root.querySelector(".comandi");
    ["click", "pointerdown"].forEach((ev) =>
      this._comandi.addEventListener(ev, (e) => e.stopPropagation()));
    const suona = (servizio) => {
      if (this._hass && this._config.entity) {
        this._hass.callService("media_player", servizio, { entity_id: this._config.entity });
      }
    };
    this._comandi.querySelector(".prec").addEventListener("click", () => suona("media_previous_track"));
    this._comandi.querySelector(".play").addEventListener("click", () => suona("media_play_pause"));
    this._comandi.querySelector(".succ").addEventListener("click", () => suona("media_next_track"));
    this._comandi.querySelector(".stop").addEventListener("click", (e) => {
      const quali = e.currentTarget._servizi || ["media_stop"];
      quali.forEach((servizio) => suona(servizio));
    });
    this._lettoriBox = root.querySelector(".lettori");
    this._codaBox = root.querySelector(".ytcoda");
    this._panCoda = root.querySelector(".pannello.incoda");
    this._attrezziYt = root.querySelector(".ytattrezzi");
    this._panCerca = root.querySelector(".pannello.cerca");
    this._pastiglie = root.querySelector(".pannello.sfoglia .s-fonti");
    this._cuore = root.querySelector(".ytcuore");
    this._panSfoglia = root.querySelector(".pannello.sfoglia");
    this._menuCoda = root.querySelector(".menucoda");
    // "keydown" compreso: la casella prende Invio e Spazio come "mi hanno
    // premuto" e apriva la finestra mentre lui scriveva nella ricerca.
    if (this._panCoda) {
      this._panCoda.querySelector(".p-chiudi")
        .addEventListener("click", () => this._apriCoda(false));
    }
    [this._pastiglie, this._cuore, this._panSfoglia, this._menuCoda,
      this._panCerca, this._attrezziYt, this._panCoda].forEach((el) => {
        if (!el) return;
        ["click", "pointerdown", "keydown", "keyup"].forEach((ev) =>
          el.addEventListener(ev, (e) => e.stopPropagation()));
      });
    if (this._cuore) {
      this._cuore.addEventListener("click", () => this._cambiaCuore());
    }
    if (this._panSfoglia) {
      this._panSfoglia.querySelector(".p-chiudi")
        .addEventListener("click", () => this._apriSfoglia(false));
      this._panSfoglia.querySelector(".s-indietro")
        .addEventListener("click", () => this._sfogliaIndietro());
    }
    if (this._attrezziYt) {
      this._attrezziYt.querySelector(".t-cerca")
        .addEventListener("click", () => this._apriCerca());
      this._attrezziYt.querySelector(".t-sfoglia")
        .addEventListener("click", () => this._apriSfoglia(
          this._panSfoglia && this._panSfoglia.hidden, "recommendations",
          "Consigliati"));
      this._attrezziYt.querySelector(".t-coda")
        .addEventListener("click", () => this._apriCoda());
      this._attrezziYt.querySelector(".t-pieno")
        .addEventListener("click", () => this._schermoPieno());
    }
    if (this._panCerca) {
      this._panCerca.querySelector(".p-chiudi")
        .addEventListener("click", () => this._apriCerca(false));
      this._panCerca.querySelector(".c-vai")
        .addEventListener("click", () => this._cerca());
      this._panCerca.querySelector(".c-testo")
        .addEventListener("keydown", (e) => {
          e.stopPropagation();
          if (e.key === "Enter") { e.preventDefault(); this._cerca(); }
        });
    }
    if (this._codaBox) {
      ["click", "pointerdown"].forEach((ev) =>
        this._codaBox.addEventListener(ev, (e) => e.stopPropagation()));
    }
    ["click", "pointerdown"].forEach((ev) =>
      this._lettoriBox.addEventListener(ev, (e) => e.stopPropagation()));
    this._colori = root.querySelector(".colori");
    this._tinta = root.querySelector(".colori .tinta");
    this._calore = root.querySelector(".colori .calore");
    ["click", "pointerdown"].forEach((ev) =>
      this._colori.addEventListener(ev, (e) => e.stopPropagation()));
    const mandaColore = (quale) => {
      if (!this._hass || !this._config.entity) return;
      const dati = { entity_id: this._config.entity };
      if (quale === "tinta") {
        const st = this._hass.states[this._config.entity];
        const hs = st && st.attributes.hs_color;
        const sat = Array.isArray(hs) && hs[1] > 12 ? hs[1] : 100;
        dati.hs_color = [Number(this._tinta.value), sat];
      } else if (this._calore._finto) {
        // niente lampadine bianche: il bianco lo mescolo coi colori
        dati.rgb_color = coloreDaGradi(Number(this._calore.value));
      } else {
        dati.color_temp_kelvin = Number(this._calore.value);
      }
      this._hass.callService("light", "turn_on", dati);
    };
    [["tinta", this._tinta], ["calore", this._calore]].forEach(([nome, el]) => {
      ["pointerdown", "touchstart", "mousedown", "keydown"].forEach((ev) =>
        el.addEventListener(ev, () => { this._trascinoColore = true; }));
      el.addEventListener("input", () => {
        this._trascinoColore = true;
        clearTimeout(this._frenoColore);
        this._frenoColore = setTimeout(() => mandaColore(nome), 250);
      });
      ["pointerup", "touchend", "mouseup", "keyup"].forEach((ev) =>
        el.addEventListener(ev, () => {
          if (!this._trascinoColore) return;
          mandaColore(nome);
          setTimeout(() => { this._trascinoColore = false; }, 900);
        }));
      el.addEventListener("blur", () => { this._trascinoColore = false; });
    });
    this._scambio = root.querySelector(".colori .scambio");
    this._scambio.addEventListener("click", (e) => {
      e.stopPropagation();
      // lampade con il bianco "secco" (modo white): il tastino non cambia
      // striscia, rimette proprio la luce bianca
      if (this._scambio._soloBianco) {
        const st = this._hass ? this._hass.states[this._config.entity] : null;
        if (!st) return;
        if (st.attributes.color_mode === "white") {
          // e' bianca: la coloro con la tinta che sta sulla striscia
          const hs = st.attributes.hs_color;
          const tono = Number(this._tinta.value)
            || (Array.isArray(hs) ? hs[0] : 30);
          this._hass.callService("light", "turn_on",
            { entity_id: this._config.entity, hs_color: [tono, 100] });
        } else {
          const lum = st.attributes.brightness || 255;
          this._hass.callService("light", "turn_on",
            { entity_id: this._config.entity, white: lum });
        }
        return;
      }
      this._modoColore = this._modoColore === "bianco" ? "tinta" : "bianco";
      this._render();
    });
    this._extra = root.querySelector(".extra");
    this._bGruppo = root.querySelector(".b-gruppo");
    this._bFonte = root.querySelector(".b-fonte");
    this._panGruppo = root.querySelector(".pannello.gruppo");
    this._panFonti = root.querySelector(".pannello.fonti");
    [this._extra, this._panGruppo, this._panFonti].forEach((el) =>
      ["click", "pointerdown"].forEach((ev) =>
        el.addEventListener(ev, (e) => e.stopPropagation())));
    root.querySelectorAll(".pannello.gruppo .p-chiudi, .pannello.fonti .p-chiudi")
      .forEach((b) => b.addEventListener("click", () => this._chiudiPannelli()));
    // i comandi rapidi: ogni tasto il suo servizio
    const rapido = (classe, dominio, servizio) => {
      const b = root.querySelector(".comandi ." + classe);
      if (!b) return;
      b.addEventListener("click", (e) => {
        e.stopPropagation();
        if (!this._hass || !this._config.entity) return;
        if (dominio === "cover") {
          if (servizio === "open_cover") this._viaggia(100);
          else if (servizio === "close_cover") this._viaggia(0);
          else this._fermaViaggio(true);
        }
        this._hass.callService(dominio, servizio, { entity_id: this._config.entity });
      });
    };
    rapido("su", "cover", "open_cover");
    rapido("fermo", "cover", "stop_cover");
    rapido("giu", "cover", "close_cover");
    rapido("chiudi", "lock", "lock");
    rapido("sblocca", "lock", "unlock");
    rapido("via", "vacuum", "start");
    rapido("sosta", "vacuum", "pause");
    rapido("casa", "vacuum", "return_to_base");

    this._bGruppo.addEventListener("click", () => this._apriPannello("gruppo"));
    this._bFonte.addEventListener("click", () => this._apriPannello("fonti"));
    this._cursore = root.querySelector(".cursore");
    this._muto = root.querySelector(".cursore .muto");
    ["click", "pointerdown"].forEach((ev) =>
      this._muto.addEventListener(ev, (e) => e.stopPropagation()));
    this._muto.addEventListener("click", () => {
      const st = this._hass ? this._hass.states[this._config.entity] : null;
      if (!st) return;
      this._hass.callService("media_player", "volume_mute", {
        entity_id: this._config.entity,
        is_volume_muted: !st.attributes.is_volume_muted,
      });
    });
    this._range = root.querySelector(".cursore input");
    this._quanto = root.querySelector(".cursore .quanto");
    ["click", "pointerdown", "touchstart"].forEach((ev) =>
      this._cursore.addEventListener(ev, (e) => e.stopPropagation()));
    const soloAllaFine = () => {
      const dom = this._config && this._config.entity
        ? this._config.entity.split(".")[0] : "";
      // un valore impostabile va scritto una volta sola, quando lasci.
      // Le tapparelle uguale: mandare comandi mentre trascini vuol dire
      // farla partire e fermare dieci volte.
      return dom === "number" || dom === "input_number" || dom === "cover";
    };
    const mostra = () => {
      const val = Number(this._range.value);
      if (soloAllaFine()) {
        const st = this._hass ? this._hass.states[this._config.entity] : null;
        const u = (st && st.attributes.unit_of_measurement) || "";
        const min = Number(this._range.min || 0);
        const max = Number(this._range.max || 100);
        const quota = max > min ? ((val - min) / (max - min)) * 100 : 0;
        this._quanto.textContent = val + (u ? " " + u : "");
        this._range.style.setProperty("--riempito", quota.toFixed(1) + "%");
        this._seguiIlDito(val);
        return;
      }
      this._quanto.textContent = this._range.value + "%";
      this._range.style.setProperty("--riempito", this._range.value + "%");
      this._seguiIlDito(val);
    };
    ["pointerdown", "touchstart", "mousedown", "keydown"].forEach((ev) =>
      this._range.addEventListener(ev, () => {
        this._trascino = true;
        this._fermaViaggio(false);
      }));
    ["pointerup", "touchend", "mouseup", "keyup"].forEach((ev) =>
      this._range.addEventListener(ev, () => {
        // solo se stavo davvero trascinando io: se no, toccando altro
        // (o chiudendo il pop-up) partiva un comando da solo
        if (!this._trascino) return;
        // il comando "a meta' strada" che stava per partire non serve piu':
        // se no arriva subito dopo e l'apparecchio fa due bip
        clearTimeout(this._freno);
        this._regola(Number(this._range.value));
        setTimeout(() => { this._trascino = false; }, 900);
      }));
    this._range.addEventListener("blur", () => { this._trascino = false; });
    this._range.addEventListener("input", () => {
      this._trascino = true;
      mostra();
      if (soloAllaFine()) return;   // niente comandi mentre trascini
      // luci e volume: mando mentre trascini, ma non piu' di uno ogni 250 ms
      clearTimeout(this._freno);
      this._freno = setTimeout(() => this._regola(Number(this._range.value)), 250);
    });
    this._range.addEventListener("change", () => {
      mostra();
      if (!this._trascino) return;
      clearTimeout(this._freno);
      this._regola(Number(this._range.value));
    });
    this._antPopup = root.querySelector(".popup-anteprima");
    this._velo = root.querySelector(".velo");
    this._fIcona = root.querySelector(".f-icona");
    this._fTitolo = root.querySelector(".f-titolo");
    this._fCorpo = root.querySelector(".f-corpo");
    this._finestra = root.querySelector(".finestra");
    this._velo.addEventListener("click", (e) => {
      if (e.target === this._velo) this._chiudiFinestra();
    });
    root.querySelector(".f-chiudi").addEventListener("click", () => this._chiudiFinestra());
    // I comandi nostri (tastini, riquadri, cuoricino) fermano gia' il clic
    // per conto loro, ma qui controllo comunque DA DOVE arriva: se viene da
    // uno di quelli, la casella non deve fare la sua azione. Bastava un
    // pezzo aggiunto domani senza il fermo, e si riapriva la finestra a
    // ogni tocco.
    const nostro = (e) => {
      const strada = e && e.composedPath ? e.composedPath() : [];
      return strada.some((el) => el && el.classList && (
        el.classList.contains("ytattrezzi") || el.classList.contains("ytcuore")
        || el.classList.contains("pannello") || el.classList.contains("menucoda")));
    };
    const azione = (e) => { if (!nostro(e)) this._azione(); };
    this._card.addEventListener("click", azione);
    this._card.addEventListener("keydown", (e) => {
      if (nostro(e)) return;
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); this._azione(); }
    });
    this._costruito = true;
  }

  _azione() {
    // ho appena chiuso il riquadro delle casse toccando fuori: quel tocco
    // serviva a chiudere, non a fare quello che fa la casella
    if (this._nonToccare && Date.now() - this._nonToccare < 400) {
      this._nonToccare = 0;
      return;
    }
    // Se sono l'anteprima della finestra delle impostazioni, toccarmi non
    // deve aprire il pop-up: deve dire "sistema ME" al riquadro qui sotto.
    // (Prima era l'unica casella che non si riusciva a scegliere.)
    if (!this.hasAttribute("solo-casella") && this._sonoAnteprima
      && !this._dentroUnAltraAnteprima()) {
      this.dispatchEvent(new CustomEvent("casa-scegli-scheda", {
        detail: { config: this._config, elemento: this },
        bubbles: true, composed: true,
      }));
      return;
    }
    const c = this._config;
    const schede = c.finestra_cards || (c.finestra_card ? [c.finestra_card] : null);
    // senza entita' l'unica cosa sensata e' aprire il pop-up
    if (!c.entity) {
      if (c.azione === "servizio") { this._chiamaServizio(); return; }
    if (c.azione === "mappa") { this._apriMappa(); return; }
      if (c.azione === "link" && c.indirizzo_web) {
        window.open(c.indirizzo_web, "_blank", "noopener");
        return;
      }
      if (c.azione === "popup" && c.popup) {
        window.history.pushState(null, "", c.popup);
        window.dispatchEvent(new Event("location-changed"));
      } else if ((schede && schede.length) || c.azione === "finestra") {
        this._apriFinestra();
      }
      return;
    }
    if (!this._hass) return;
    if (c.azione === "servizio") { this._chiamaServizio(); return; }
    if (c.azione === "toggle") {
      const dominio = c.entity.split(".")[0];
      const servizio = ["light", "switch", "fan", "input_boolean", "automation", "humidifier", "siren"].includes(dominio)
        ? "homeassistant" : null;
      if (servizio) { this._hass.callService("homeassistant", "toggle", { entity_id: c.entity }); return; }
    }
    if (c.azione === "finestra") { this._apriFinestra(); return; }
    if (c.azione === "mappa") { this._apriMappa(); return; }
    if (c.azione === "link" && c.indirizzo_web) {
      window.open(c.indirizzo_web, "_blank", "noopener");
      return;
    }
    if (c.azione === "popup" && c.popup) {
      window.history.pushState(null, "", c.popup);
      window.dispatchEvent(new Event("location-changed"));
      return;
    }
    this.dispatchEvent(new CustomEvent("hass-more-info", {
      detail: { entityId: c.entity }, bubbles: true, composed: true,
    }));
  }

  _chiamaServizio() {
    const c = this._config;
    const pezzi = String(c.servizio || "").trim().split(".");
    if (!this._hass || pezzi.length !== 2 || !pezzi[0] || !pezzi[1]) return;
    let dati = {};
    try {
      const letti = c.servizio_dati ? daYaml(c.servizio_dati) : null;
      if (letti && typeof letti === "object") dati = { ...letti };
    } catch (e) { /* dati scritti male: mando il comando senza */ }
    if (c.entity && !dati.entity_id && !dati.target && !dati.device_id && !dati.area_id) {
      dati.entity_id = c.entity;
    }
    this._hass.callService(pezzi[0], pezzi[1], dati);
  }

  _apriMappa() {
    const c = this._config;
    const st = this._hass ? this._hass.states[c.entity] : null;
    let dove = null;
    if (st && st.attributes.latitude !== undefined && st.attributes.longitude !== undefined) {
      dove = st.attributes.latitude + "," + st.attributes.longitude;
    } else if (c.sottotitolo_entita && this._hass) {
      const alt = this._hass.states[c.sottotitolo_entita];
      if (alt && alt.state && alt.state.length > 4) dove = alt.state;
    } else if (st && st.state && st.state.length > 4) {
      dove = st.state;
    }
    if (!dove) {
      this._fTitolo && (this._fTitolo.textContent = "");
      window.alert("Questa entita non dice dove si trova: non ha ne le coordinate "
        + "ne un indirizzo. Scegli un'entita con la posizione, oppure indica "
        + "l'entita dell'indirizzo nel campo del sottotitolo.");
      return;
    }
    window.open("https://www.google.com/maps/search/?api=1&query="
      + encodeURIComponent(dove), "_blank", "noopener");
  }

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

  _vestiFinestra() {
    const c = this._config;
    const tinta = Array.isArray(c.finestra_sfondo) ? daRgb(c.finestra_sfondo) : null;
    const opaco = 1 - (c.finestra_trasparenza === undefined
      ? 0 : Number(c.finestra_trasparenza)) / 100;
    const foto = indirizzoFoto(c.finestra_immagine);
    if (tinta || opaco < 1 || foto) {
      const alto = tinta || "#111a26";
      const basso = tinta ? scurisci(tinta, 0.62) : "#0a1019";
      // con la foto dietro, la tinta sopra diventa un VELO: se restasse
      // piena la coprirebbe del tutto e sembrerebbe che la foto non funzioni
      const q = foto ? Math.min(opaco, 0.5) : opaco;
      let fondo = "linear-gradient(160deg, " + conAlfa(alto, q) + " 0%, "
        + conAlfa(basso, q) + " 100%)";
      if (foto) fondo += ', url("' + foto + '") center/cover no-repeat';
      this.style.setProperty("--fin-bg", fondo);
      // lo stesso vestito serve al riquadro dell'anteprima dentro alle
      // impostazioni, ma li' "--fin-bg" viene azzerato apposta (se no le
      // caselle dentro se lo prendevano tutte). Da qui il secondo nome.
      this.style.setProperty("--fin-bg-ant", fondo);
    } else {
      this.style.removeProperty("--fin-bg");
      this.style.removeProperty("--fin-bg-ant");
    }

    // e ogni scheda dentro si rimette il suo vestito
    if (this._fCorpo) {
      this._fCorpo.querySelectorAll(".vestito").forEach((b) =>
        this._vestiScheda(b, Number(b.dataset.n) || 0));
    }
    if (this._antPopup) {
      this._antPopup.querySelectorAll(".vestito").forEach((b) =>
        this._vestiScheda(b, Number(b.dataset.n) || 0));
    }
  }

  async _apriFinestra() {
    const c = this._config;
    // qui lo stato me lo prendo da solo: non arriva da fuori
    const suoStato = (this._hass && c.entity) ? this._hass.states[c.entity] : null;
    this._fTitolo.textContent = c.finestra_titolo || this._nome.textContent;
    const nomeIco = this._nomeIcona(suoStato);
    this._fIcona.innerHTML = nomeIco === "batteria"
      ? (() => { const b = this._datiBatteria(suoStato);
                 return disegnoBatteria(b.perc, b.carica, b.scarica); })()
      : (nomeIco === "aspirapolvere"
        ? disegnoAspira(aspiraFuori(suoStato))
        : (ICONE[nomeIco] || disegnoMdi(nomeIco) || ICONE.luce));
    riempiRiquadro(this._fIcona, nomeIco);
    this._vestiApertura();
    this.removeAttribute("chiude");
    this._velo.toggleAttribute("aperto", true);
    // "sboccia dalla casella" ha bisogno di sapere DOVE sta la casella:
    // glielo dico adesso, che la finestra e' appena comparsa e la sua
    // posizione si puo' misurare
    if (this.getAttribute("apertura") === "sboccia") this._puntoDiNascita();
    document.addEventListener("keydown", this._esc = (e) => {
      if (e.key === "Escape") this._chiudiFinestra();
    });
    if (this._fCorpo.childElementCount) { this._aggiornaFinestra(); return; }

    const scelte = c.finestra_cards || (c.finestra_card ? [c.finestra_card] : null);
    const elenco = (c.finestra_entita && c.finestra_entita.length)
      ? c.finestra_entita : (c.entity ? [c.entity] : []);
    let tipo = c.finestra_scheda || "entities";
    if (tipo === "altra") tipo = (c.finestra_scheda_altra || "entities").trim();

    const schede = [];
    if (scelte && scelte.length) { return this._montaSchede(scelte); }
    if (!elenco.length) { return this._montaSchede([]); }
    if (c.finestra_grafico) {
      schede.push({ type: "history-graph", hours_to_show: 24, entities: elenco });
    }
    // alcune schede vogliono la lista di entita', le altre una per volta
    const MULTI = ["entities", "glance", "history-graph", "statistics-graph",
                   "logbook", "map", "distribution"];
    if (MULTI.includes(tipo)) {
      schede.push({ type: tipo, entities: elenco });
    } else {
      elenco.forEach((e) => schede.push({ type: tipo, entity: e }));
    }

    return this._montaSchede(schede);
  }

  // le schede del pop-up, cosi' come stanno scritte
  _schedeFinestra() {
    const c = this._config || {};
    return c.finestra_cards || (c.finestra_card ? [c.finestra_card] : []) || [];
  }

  // LA GRIGLIA LA DISEGNO IO, CON LE SUE COLONNE.
  // La griglia di Home Assistant fa le caselle tutte uguali e la misura dei
  // figli la ignora: non c'e' verso di dare a una casella una misura sua.
  // Allora la rifaccio: stesse colonne che ha lei (cinque restano cinque,
  // la disposizione non cambia di un pelo), ma ogni casella puo' prendersi
  // piu' di una colonna. La misura la scrivo in dodicesimi come dappertutto
  // e qui la riporto sulle colonne che ci sono: con cinque colonne, 12 = 5,
  // 6 = 2, 3 = 1.
  _costruisciGriglia(cfg, aiuti, figli) {
    // Se la griglia non dice quante colonne vuole, Home Assistant ne fa
    // TRE: se ne mettessi due la disposizione cambierebbe da sola.
    const quante = Math.max(1, Math.min(12,
      Math.round(Number(cfg.columns) > 0 ? Number(cfg.columns) : 3)));
    const g = document.createElement("div");
    g.className = "griglia-mia";
    g.dataset.colonne = String(quante);
    // in fila che va a capo, non a colonne fisse: cosi' una casella puo'
    // essere larga quanto le pare, non solo uno scatto su cinque
    g.style.display = "flex";
    g.style.flexWrap = "wrap";
    g.style.gap = "8px";
    // OGNUNA ALTA QUANTO VUOLE LEI. In una griglia le caselle di una riga
    // si allungano tutte insieme: alzandone una si alzavano anche le altre
    // quattro, che non e' quello che uno chiede quando cambia l'altezza di
    // UNA casella. Cosi' invece ognuna tiene la sua.
    g.style.alignItems = "flex-start";
    (cfg.cards || []).forEach((c, k) => {
      const cc = c || {};
      let el = null;
      try {
        el = this._pesante(cc) ? this._cartellino(cc) : aiuti.createCardElement(cc);
      } catch (e) { return; }
      try { el.hass = this._hass; } catch (e) { /* pazienza */ }
      // Dentro a una griglia la misura si conta nelle SUE colonne: 1 vuol
      // dire una colonna (il normale, come fa Home Assistant), 5 su una
      // griglia da cinque vuol dire tutta la riga.
      const cella = document.createElement("div");
      cella.className = "cella-mia";
      cella.dataset.k = String(k);
      cella.style.minWidth = "0";
      const mis = this._misuraDi(cc, quante);
      this._stiliMisura(cella, mis.largo, mis.alto, 8);
      // LA CASELLA RIEMPIE LA SUA CELLA. Prima alzavo la cella e la casella
      // restava piccola in cima, col buco sotto: l'altezza deve prenderla
      // lei, non il vuoto intorno.
      cella.appendChild(el);
      this._riempiBusta(cella);
      g.appendChild(cella);
      if (figli) figli.push(el);
    });
    return g;
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
    m.title = "Tieni premuto e trascina per cambiare la misura di questa scheda";
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

  // che colore ha la scheda numero i: prima il suo, poi quello generale
  _vestiScheda(busta, i) {
    const c = this._config;
    // la tinta si puo' rimettere sempre, la MISURA no: mentre tira e'
    // sua e nessuno gliela deve cambiare
    const tira = !!this._tirando;
    const suoi = Array.isArray(c.finestra_schede_stile) ? c.finestra_schede_stile : [];
    const mio = suoi[i] || {};
    // La misura viene PRIMA del colore: una scheda senza tinta esce di qui
    // subito, e se la mettessi dopo resterebbe della misura sbagliata.
    if (!tira) {
      const m = this._misuraPezzo(i);
      this._stiliMisura(busta, m.largo, m.alto, 10);
      this._riempiBusta(busta);
    }
    // L'ALTEZZA A RIGHE E' UN MINIMO, NON UNA GABBIA. Prima le davo la
    // misura esatta e tagliavo quello che avanzava (come fa la plancia):
    // risultato, mettendo poche righe la scheda spariva mezza. Qui dentro
    // e' meglio che cresca: le righe la fanno alta almeno tanto, e se il
    // contenuto ne vuole di piu' se le prende invece di essere nascosto.
    const tinta = Array.isArray(mio.sfondo) ? daRgb(mio.sfondo)
      : (Array.isArray(c.finestra_schede_sfondo) ? daRgb(c.finestra_schede_sfondo) : null);
    const via = mio.trasparenza !== undefined && mio.trasparenza !== null
      ? Number(mio.trasparenza)
      : (c.finestra_schede_trasparenza === undefined
        ? null : Number(c.finestra_schede_trasparenza));
    if (!tinta && (via === null || via === 0)) {
      // Qui c'era "removeAttribute(style)": buttava via TUTTO, compresa la
      // misura appena scritta due righe sopra, e le schede senza tinta
      // restavano tutte della stessa larghezza. Tolgo solo i colori.
      ["--ha-card-background", "--card-background-color",
        "--ha-card-border-color", "--ha-card-box-shadow", "--card-bg"]
        .forEach((k) => busta.style.removeProperty(k));
      busta.toggleAttribute("vestita", false);
      return;
    }
    const opaco = 1 - (via === null ? 0 : via) / 100;
    const base = tinta || "#141d2b";
    busta.style.setProperty("--ha-card-background", conAlfa(base, opaco));
    busta.style.setProperty("--card-background-color", conAlfa(base, opaco));
    // le caselle nostre disegnano il fondo con "--card-bg": se ne hanno uno
    // loro vince quello (se lo scrivono addosso), se no prendono questo
    busta.style.setProperty("--card-bg", conAlfa(base, opaco));
    busta.style.setProperty("--ha-card-border-color",
      conAlfa(base, Math.min(1, opaco + 0.18)));
    busta.style.setProperty("--ha-card-box-shadow", "none");
    busta.toggleAttribute("vestita", true);
  }

  async _montaSchede(schede) {
    try {
      const helpers = await window.loadCardHelpers();
      this._misureFinestra(this._fCorpo);
      if (this._finestra) this._misureFinestra(this._finestra);
      this._schede = [];
      // le griglie si aprono: le loro caselle diventano pezzi a se', cosi'
      // ognuna puo' avere la sua misura (vedi _pezziFinestra)
      this._pezziFinestra().forEach((pezzo) => {
        const cfg = pezzo.cfg;
        const i = pezzo.chiave;
        try {
          const el = this._eGriglia(cfg)
            ? this._costruisciGriglia(cfg, helpers, this._schede)
            : helpers.createCardElement(cfg);
          el.hass = this._hass;
          // ogni scheda dentro il pop-up si veste per conto suo
          const busta = document.createElement("div");
          busta.className = "vestito";
          busta.dataset.n = String(i);
          this._vestiScheda(busta, i);
          busta.appendChild(el);
          this._fCorpo.appendChild(busta);
          this._schede.push(el);
        } catch (err) {
          const avviso = document.createElement("div");
          avviso.style.cssText = "color:#ff9a9a;font-size:13px";
          avviso.textContent = 'La scheda "' + cfg.type + '" non funziona con questa entita.';
          this._fCorpo.appendChild(avviso);
        }
      });
    } catch (err) {
      this._fCorpo.textContent = "Non riesco a creare il contenuto della finestra.";
    }
  }

  _chiudiFinestra() {
    if (this._esc) { document.removeEventListener("keydown", this._esc); this._esc = null; }
    const modo = this.getAttribute("apertura") || "";
    let dura = 0;
    if (modo && modo !== "niente") {
      const n = Number((this._config || {}).finestra_apertura_durata);
      dura = Math.round((isFinite(n) && n >= 60 ? n : 220) * 0.66);
    }
    clearTimeout(this._chiusuraDopo);
    if (!dura) {
      this.removeAttribute("chiude");
      this._velo.toggleAttribute("aperto", false);
      return;
    }
    // il tempo di far vedere la chiusura, poi si spegne davvero
    this.setAttribute("chiude", "");
    this._chiusuraDopo = setTimeout(() => {
      this.removeAttribute("chiude");
      this._velo.toggleAttribute("aperto", false);
    }, dura + 20);
  }

  // il modo e la velocita' scelti, dati al foglio di stile
  _vestiApertura() {
    const c = this._config || {};
    const modo = ["sfuma", "sboccia", "basso", "niente"]
      .indexOf(c.finestra_apertura) >= 0 ? c.finestra_apertura : "sfuma";
    this.setAttribute("apertura", modo);
    const n = Number(c.finestra_apertura_durata);
    this.style.setProperty("--fin-dur",
      Math.round(isFinite(n) && n >= 60 ? Math.min(2000, n) : 220) + "ms");
  }

  // DOVE NASCE LA FINESTRA: il centro della casella che ha toccato, contato
  // dentro alla finestra. Cosi' crescendo sembra che venga da li'.
  _puntoDiNascita() {
    try {
      const card = this.shadowRoot && this.shadowRoot.querySelector("ha-card");
      const fin = this._finestra;
      if (!card || !fin) return;
      const r = card.getBoundingClientRect();
      const f = fin.getBoundingClientRect();
      if (!r.width || !f.width) return;
      const x = Math.round(r.left + r.width / 2 - f.left);
      const y = Math.round(r.top + r.height / 2 - f.top);
      this.style.setProperty("--nasce", x + "px " + y + "px");
    } catch (e) { /* pazienza: nasce dal centro */ }
  }

  _aggiornaFinestra() {
    this._misureFinestra(this._fCorpo);
    if (this._finestra) this._misureFinestra(this._finestra);
    if (this._fCorpo) {
      this._fCorpo.querySelectorAll(".vestito").forEach((b) =>
        this._vestiScheda(b, Number(b.dataset.n) || 0));
    }
    if (this._schede) this._schede.forEach((el) => { el.hass = this._hass; });
  }

  _simbolo(st, eid) {
    const dc = (st.attributes && st.attributes.device_class) || "";
    const id = eid.toLowerCase();
    if (dc === "battery" || id.includes("battery") || id.includes("batteria")) return "\uD83D\uDD0B";
    if (dc === "signal_strength" || id.includes("wi_fi") || id.includes("wifi")
        || id.includes("linkquality")) return "\uD83D\uDCF6";
    if (dc === "temperature") return "\uD83C\uDF21";
    if (dc === "humidity" || dc === "moisture") return "\uD83D\uDCA7";
    if (dc === "power" || dc === "energy" || dc === "current" || dc === "voltage") return "\u26A1";
    if (dc === "connectivity" || id.startsWith("device_tracker.")) return "\uD83D\uDCE1";
    if (id.startsWith("person.")) return "\uD83D\uDC64";
    if (dc === "timestamp" || id.includes("time")) return "\u23F1";
    return "\u2022";
  }

  // il nome che si vede sulla caselletta: prima quello scritto da lui,
  // poi (se lo chiede) quello automatico. Senza nessuno dei due resta solo
  // il numero, come e' sempre stato.
  _nomeMisura(st, eid) {
    const suo = (this._config.info_nomi || {})[eid];
    if (suo !== undefined && suo !== null && String(suo).trim() !== "") {
      return String(suo).trim().slice(0, 14);
    }
    if (this._config.info_nomi_auto) return this._etichetta(st, eid);
    return "";
  }

  _etichetta(st, eid) {
    const dc = (st.attributes && st.attributes.device_class) || "";
    const id = (eid + " " + ((st.attributes && st.attributes.friendly_name) || ""))
      .toLowerCase().replace(/[\s-]+/g, "_");
    if (dc === "battery" || id.includes("battery_level")) return "BATTERIA";
    if (id.includes("battery_state") || id.includes("charger")) return "CARICA";
    if (id.includes("wi_fi") || id.includes("wifi") || dc === "signal_strength"
        || id.includes("linkquality")) return "RETE";
    if (dc === "temperature") return "TEMP.";
    if (dc === "humidity") return "UMIDITA";
    if (dc === "moisture") return "TERRENO";
    if (dc === "power") return "POTENZA";
    if (dc === "energy") return "ENERGIA";
    if (id.includes("geocoded")) return "DOVE";
    if (id.startsWith("device_tracker.")) return "POSIZIONE";
    const nome = String((st.attributes && st.attributes.friendly_name) || eid.split(".")[1]);
    const pezzi = nome.split(" ");
    return pezzi[pezzi.length - 1].toUpperCase().slice(0, 10);
  }

  _disegnaCielo(tipo) {
    if (!this._cielo) return;
    if (!tipo) {
      this._cielo.hidden = true;
      this._cielo.innerHTML = "";
      this._cieloOra = null;
      return;
    }
    this._cielo.hidden = false;
    if (this._cieloOra === tipo) return;
    this._cieloOra = tipo;
    this._cielo.innerHTML = "";

    const caso = (min, max) => min + Math.random() * (max - min);
    const metti = (classe, stile, dentro) => {
      const d = document.createElement("div");
      d.className = classe;
      if (stile) d.setAttribute("style", stile);
      if (dentro) d.innerHTML = dentro;
      this._cielo.appendChild(d);
      return d;
    };

    // una nuvola e' un gruppo di gobbe: cosi' sembra una nuvola vera
    const nuvola = (x, y, largo, classe) => {
      const alto = largo * 0.42;
      const gobbe = [
        [0, 0, largo * 0.52, alto * 0.72],
        [largo * 0.26, -alto * 0.34, largo * 0.56, alto],
        [largo * 0.58, -alto * 0.12, largo * 0.46, alto * 0.82],
      ].map((g) => '<i style="left:' + g[0].toFixed(0) + "px;bottom:"
        + (-g[1]).toFixed(0) + "px;width:" + g[2].toFixed(0) + "px;height:"
        + g[3].toFixed(0) + 'px"></i>').join("");
      metti("nube" + (classe ? " " + classe : ""),
        "left:" + x + "%;top:" + y + "%;width:" + largo + "px;height:"
        + alto.toFixed(0) + "px;animation-delay:" + caso(-20, 0).toFixed(1) + "s",
        gobbe);
    };

    const stelle = (quante, altezzaMax) => {
      for (let i = 0; i < quante; i += 1) {
        const d = caso(1, 2.4);
        metti("stella", "left:" + caso(2, 97).toFixed(1) + "%;top:"
          + caso(3, altezzaMax).toFixed(1) + "%;width:" + d.toFixed(1)
          + "px;height:" + d.toFixed(1) + "px;opacity:" + caso(.35, 1).toFixed(2)
          + ";box-shadow:0 0 " + (d * 2.4).toFixed(1)
          + "px rgba(214,226,255,.9);animation-delay:" + caso(0, 4).toFixed(1)
          + "s;animation-duration:" + caso(2.4, 5.2).toFixed(1) + "s");
      }
    };

    const luna = () => {
      const d = 30;
      const crateri = [[30, 26, 8], [52, 52, 6], [24, 58, 5]]
        .map((c) => '<i style="left:' + c[0] + "%;top:" + c[1] + "%;width:"
          + c[2] + "px;height:" + c[2] + 'px"></i>').join("");
      metti("luna", "right:9%;top:10%;width:" + d + "px;height:" + d + "px", crateri);
    };

    const pioggia = (quante, velocita) => {
      for (let i = 0; i < quante; i += 1) {
        const x = caso(-4, 100);
        metti("goccia", "left:" + x.toFixed(1) + "%;height:"
          + caso(9, 17).toFixed(0) + "px;animation-duration:"
          + caso(velocita * 0.75, velocita * 1.3).toFixed(2)
          + "s;animation-delay:" + caso(-2, 0).toFixed(2) + "s;opacity:"
          + caso(.5, 1).toFixed(2));
      }
    };

    if (tipo === "stelle") {
      stelle(26, 82);
      luna();
      metti("cadente", "left:8%;top:14%;animation-delay:3s");
      metti("cadente", "left:52%;top:6%;animation-delay:11s;animation-duration:13s");
    } else if (tipo === "sole") {
      const raggi = [];
      for (let i = 0; i < 12; i += 1) {
        raggi.push('<i style="height:' + caso(16, 30).toFixed(0)
          + "px;transform:rotate(" + (i * 30) + "deg) translate(-50%, 26px)"
          + ";opacity:" + caso(.25, .6).toFixed(2) + '"></i>');
      }
      metti("sole", "right:-6%;top:-26%;width:150px;height:150px",
        '<div class="alone"></div><div class="raggi">' + raggi.join("")
        + '</div><div class="cuore"></div>');
      nuvola(-12, 62, 74, "lenta");
    } else if (tipo === "sole_nuvole") {
      const raggi = [];
      for (let i = 0; i < 10; i += 1) {
        raggi.push('<i style="height:' + caso(14, 26).toFixed(0)
          + "px;transform:rotate(" + (i * 36) + "deg) translate(-50%, 22px)"
          + ";opacity:" + caso(.2, .5).toFixed(2) + '"></i>');
      }
      metti("sole", "right:2%;top:-30%;width:120px;height:120px",
        '<div class="alone"></div><div class="raggi">' + raggi.join("")
        + '</div><div class="cuore"></div>');
      nuvola(-14, 30, 96);
      nuvola(46, 52, 70, "lenta");
    } else if (tipo === "nuvole") {
      nuvola(-16, 18, 104, "scura");
      nuvola(38, 40, 84, "lenta scura");
      nuvola(12, 64, 62, "scura");
    } else if (tipo === "pioggia") {
      nuvola(-14, 2, 108, "scura");
      nuvola(44, 12, 80, "lenta scura");
      pioggia(26, 1.1);
      for (let i = 0; i < 5; i += 1) {
        metti("schizzo", "left:" + caso(6, 92).toFixed(1)
          + "%;animation-delay:" + caso(-1, 0).toFixed(2) + "s");
      }
    } else if (tipo === "lampo") {
      nuvola(-14, 0, 112, "scura");
      nuvola(42, 10, 86, "lenta scura");
      pioggia(34, 0.85);
      metti("lampo");
    } else if (tipo === "neve") {
      nuvola(-12, 2, 100, "scura");
      for (let i = 0; i < 20; i += 1) {
        const d = caso(2, 4.2);
        metti("fiocco", "left:" + caso(0, 98).toFixed(1) + "%;width:"
          + d.toFixed(1) + "px;height:" + d.toFixed(1) + "px;animation-duration:"
          + caso(5, 11).toFixed(1) + "s;animation-delay:" + caso(-6, 0).toFixed(1)
          + "s;opacity:" + caso(.6, 1).toFixed(2));
      }
    } else if (tipo === "nebbia") {
      metti("banda", "top:12%");
      metti("banda", "top:42%;animation-duration:30s;animation-direction:alternate-reverse");
      metti("banda", "top:70%;animation-duration:26s");
      nuvola(-10, 30, 90, "lenta");
    } else if (tipo === "vento") {
      nuvola(-14, 16, 92, "lenta");
      for (let i = 0; i < 6; i += 1) {
        metti("soffio", "top:" + caso(12, 88).toFixed(1) + "%;left:"
          + caso(-10, 20).toFixed(1) + "%;width:" + caso(30, 70).toFixed(0)
          + "px;animation-delay:" + caso(-4, 0).toFixed(1)
          + "s;animation-duration:" + caso(3.2, 6).toFixed(1) + "s");
      }
    }
  }

  // quanti km da casa, se l'entita' dice dove si trova
  _quantoLontanoDaCasa(st) {
    const c = this._config;
    if (c.mostra_distanza === false) return "";
    if (!st || !this._hass) return "";
    // a casa la distanza non serve: Waze risponderebbe 0 km e 0 minuti
    if (String(st.state).toLowerCase() === "home") return "";
    // se ha un sensore del percorso (Waze, Google) vince quello: sono i
    // chilometri veri su strada, non quelli in linea d'aria
    if (c.distanza_entita) {
      const suo = this._hass.states[c.distanza_entita];
      if (suo && !["unknown", "unavailable"].includes(String(suo.state))) {
        const pezzi = [];
        // Waze e Google: i km stanno negli attributi, i minuti nello stato
        const km = parseFloat(suo.attributes.distance);
        if (!isNaN(km) && km < 0.3) return "";
        if (!isNaN(km)) {
          pezzi.push((km < 100 ? (Math.round(km * 10) / 10) : Math.round(km))
            .toLocaleString("it-IT") + " km");
        }
        const n2 = parseFloat(suo.state);
        const u2 = suo.attributes.unit_of_measurement || "";
        if (!isNaN(n2) && u2 === "min") {
          const ore = Math.floor(n2 / 60);
          const min = Math.round(n2 % 60);
          pezzi.push(ore ? ore + " h" + (min ? " " + (min < 10 ? "0" : "") + min : "")
            : min + " min");
        } else if (!isNaN(n2)) {
          pezzi.push((Math.round(n2 * 10) / 10).toLocaleString("it-IT")
            + (u2 ? " " + u2 : ""));
        } else {
          pezzi.push(suo.state);
        }
        return pezzi.join(" · ") + " da casa";
      }
    }
    const lat = st.attributes.latitude;
    const lon = st.attributes.longitude;
    if (lat === undefined || lon === undefined) return "";
    const casa = this._hass.states["zone.home"];
    if (!casa || casa.attributes.latitude === undefined) return "";
    const km = quantoLontano(lat, lon, casa.attributes.latitude,
      casa.attributes.longitude);
    if (!isFinite(km)) return "";
    if (km < 0.15) return "";
    if (km < 1) return Math.round(km * 1000) + " m da casa";
    // sopra i 30 km la differenza con la strada si sente: lo dico
    const numero = km < 100
      ? (Math.round(km * 10) / 10).toLocaleString("it-IT")
      : Math.round(km).toLocaleString("it-IT");
    return numero + " km da casa" + (km > 30 ? " in linea d’aria" : "");
  }

  // La telecamera a tutta casella. L'immagine di Home Assistant e' uno
  // scatto: per farla sembrare una diretta le cambio la coda ogni tot
  // secondi, cosi' il browser la richiede di nuovo. La carico di nascosto
  // prima di metterla, se no si vedrebbe il buco mentre arriva.
  _immagineDiretta(st) {
    const c = this._config;
    const dominio = c.entity ? c.entity.split(".")[0] : "";
    const puo = (dominio === "camera" || dominio === "image") && !!c.camera_diretta
      && !c.sfondo_immagine;
    if (!puo || !st) { this._fermaDiretta(); return null; }
    const base = fotoDi(st);
    if (!base) { this._fermaDiretta(); return null; }
    this._avviaDiretta();
    const scatto = this._scattoDiretta || 0;
    return base + (base.indexOf("?") === -1 ? "?" : "&") + "_ct=" + scatto;
  }

  _avviaDiretta() {
    const c = this._config;
    const ogni = Math.max(1, Math.min(120,
      Number(c.camera_secondi) > 0 ? Number(c.camera_secondi) : 5)) * 1000;
    if (this._direttaId && this._direttaOgni === ogni) return;
    this._fermaDiretta();
    this._direttaOgni = ogni;
    if (this._scattoDiretta === undefined) this._scattoDiretta = Date.now();
    this._direttaId = setInterval(() => {
      if (!this.isConnected || document.hidden) return;
      const st = this._hass ? this._hass.states[this._config.entity] : null;
      const base = st ? fotoDi(st) : null;
      if (!base) return;
      const adesso = Date.now();
      const prossima = base + (base.indexOf("?") === -1 ? "?" : "&") + "_ct=" + adesso;
      // la scarico prima: se non arriva, tengo quella di adesso
      const prova = new Image();
      prova.onload = () => {
        this._scattoDiretta = adesso;
        if (this.isConnected) this._render();
      };
      prova.src = prossima;
    }, ogni);
  }

  _fermaDiretta() {
    if (this._direttaId) { clearInterval(this._direttaId); this._direttaId = null; }
    this._direttaOgni = 0;
  }

  // il "da quanto" va rinfrescato ogni tanto, se no resta fermo
  _avviaTicchettio(serve) {
    if (!serve) {
      if (this._ticchettio) { clearInterval(this._ticchettio); this._ticchettio = null; }
      return;
    }
    if (this._ticchettio) return;
    this._ticchettio = setInterval(() => {
      if (!this.isConnected) return;
      const st = this._hass ? this._hass.states[this._config.entity] : null;
      if (st) this._render();
    }, 30000);
  }

  _mmss(secondi) {
    const t = Math.max(0, Math.round(secondi));
    const h = Math.floor(t / 3600);
    const m = Math.floor((t % 3600) / 60);
    const sec = t % 60;
    const due = (n) => (n < 10 ? "0" + n : String(n));
    return h ? h + ":" + due(m) + ":" + due(sec) : m + ":" + due(sec);
  }

  _disegnaTempo(st) {
    const c = this._config;
    const ok = !!c.tempo_media && !!st && !!c.entity
      && c.entity.split(".")[0] === "media_player"
      && st.attributes.media_duration > 0;
    this._tempo.hidden = !ok;
    if (!ok) { this._fermaOrologio(); return; }

    const totale = st.attributes.media_duration;
    let dove = st.attributes.media_position || 0;
    if (st.state === "playing" && st.attributes.media_position_updated_at) {
      const da = new Date(st.attributes.media_position_updated_at).getTime();
      if (!isNaN(da)) dove += (Date.now() - da) / 1000;
    }
    dove = Math.min(Math.max(dove, 0), totale);
    const fatto = dove / totale * 100;
    this._binario.style.width = fatto.toFixed(1) + "%";
    if (this._fatta) {
      this._fatta.setAttribute("stroke-dasharray", fatto.toFixed(2) + " 100");
      // il pallino va messo dove finisce davvero la riga colorata: glielo
      // chiedo alla riga stessa, cosi' i due non litigano mai
      let x = fatto * 3;
      let y = 13 - 7 * Math.sin(2 * Math.PI * (fatto * 3) / 75);
      try {
        const lung = this._fatta.getTotalLength();
        if (lung > 0) {
          const punto = this._fatta.getPointAtLength(lung * fatto / 100);
          x = punto.x;
          y = punto.y;
        }
      } catch (e) { /* certi browser non ce la fanno: resta il conto a mano */ }
      this._pallino.style.left = (x / 300 * 100).toFixed(2) + "%";
      this._pallino.style.top = (y / 26 * 100).toFixed(2) + "%";
    }
    this._orologio.textContent = this._mmss(dove) + " / " + this._mmss(totale);
    // nel vestito "ytmusic-card" i due tempi stanno ai capi dell'onda, uno
    // per parte: li appiccico come dati e li scrive il foglio di stile
    this._orologio.dataset.ora = this._mmss(dove);
    this._orologio.dataset.fine = this._mmss(totale);

    if (st.state === "playing") this._avviaOrologio();
    else this._fermaOrologio();
  }

  _avviaOrologio() {
    if (this._orologioId) return;
    this._orologioId = setInterval(() => {
      const st = this._hass ? this._hass.states[this._config.entity] : null;
      if (!st) { this._fermaOrologio(); return; }
      this._disegnaTempo(st);
    }, 1000);
  }

  _fermaOrologio() {
    if (this._orologioId) { clearInterval(this._orologioId); this._orologioId = null; }
  }

  disconnectedCallback() {
    // l'ascolto del rivestimento sta sulla finestra: me lo riprendo, se no
    // se ne accumula uno a ogni casella che passa di qui
    if (this._ascoltoVesti) { this._ascoltoVesti(); this._ascoltoVesti = null; }
    if (this._ascoltoProve) { this._ascoltoProve(); this._ascoltoProve = null; }
    clearTimeout(this._ancoraLettore);
    this._ancoraLettore = 0;
    clearTimeout(this._riMisuro);
    this._riMisuro = 0;
    clearTimeout(this._disegnoDopo);
    clearTimeout(this._disegnoHass);
    this._disegnoDopo = 0;
    this._disegnoHass = 0;
    // la scorciatoia dell'Esc restava attaccata al documento
    if (this._esc) { document.removeEventListener("keydown", this._esc); this._esc = null; }
    this._fermaOrologio();
    this._fermaDiretta();
    this._fermaOrologioTappa();
    if (this._ticchettio) { clearInterval(this._ticchettio); this._ticchettio = null; }
    if (this._osserva) { this._osserva.disconnect(); this._osserva = null; }
    this._cartaOsservata = null;
  }

  // guardo quanto sono alta davvero: sotto una certa misura passo al modo
  // compatto, cosi' non serve ne' crescere ne' tagliare
  _controllaMisura() {
    const card = this.shadowRoot && this.shadowRoot.querySelector("ha-card");
    if (!card) return;
    // l'osservatore va attaccato appena la casella esiste per davvero:
    // quando mi attacco alla pagina spesso non c'e' ancora, e prima restavo
    // per sempre senza misura (era il caso della casellina del riquadro,
    // che veniva grande mentre l'anteprima era compatta)
    if (this._osserva && this._cartaOsservata !== card) {
      try { this._osserva.observe(card); this._cartaOsservata = card; } catch (e) { /* pazienza */ }
    }
    const q = card.getBoundingClientRect();
    const h = q.height;
    if (!h) {
      // Niente misura. Due casi: non sono ancora impaginato (fra un attimo
      // ci sono) oppure sono NASCOSTO - pop-up chiuso, altra linguetta - e
      // allora di altezza non ne avro' mai.
      // Qui c'era il mostro: riprovavo con il fotogramma E con la sveglia,
      // e ogni tentativo ne faceva partire due. Uno, due, quattro, otto...
      // in pochi secondi la pagina si bloccava e la memoria volava a
      // gigabyte. Ora: una sola sveglia per volta, al massimo otto
      // tentativi, e se sono nascosto non ci provo nemmeno - quando
      // ricompaio ci pensa il sorvegliante delle misure.
      if (this._riMisuro) return;
      if (this.offsetParent === null) return;
      this._tentativiMisura = (this._tentativiMisura || 0) + 1;
      if (this._tentativiMisura > 8) return;
      this._riMisuro = setTimeout(() => {
        this._riMisuro = 0;
        if (this.isConnected) this._controllaMisura();
      }, 120);
      return;
    }
    this._tentativiMisura = 0;
    this._altezzaVista = h;
    this._quandoMisura = Date.now();
    // mi segno la misura del POSTO che la plancia mi da', non della casella
    // disegnata: e' quella che il riquadro delle impostazioni deve copiare.
    // Solo quando cambia qualcosa: chiedere la misura a ogni ridisegno
    // costava piu' di tutto il resto messo insieme.
    // ...e anche quando cambia la LARGHEZZA: la stessa casella e' piu'
    // stretta con la barra laterale di Home Assistant aperta, e quella
    // misura li' e' proprio quella che mi serve ricordare
    if (this._altaPrima !== h || this._largaPrima !== q.width) {
      this._altaPrima = h;
      this._largaPrima = q.width;
      this._giriLettore = 0;
      this._scalaLettore();
      const mio = this.getBoundingClientRect();
      this._ricordaMisura(mio.width, mio.height);
      this._vestiAnteprima();
      // la casella ha cambiato larghezza: a pezzi liberi va rifatta la
      // proporzione, se no le scritte si accavallano quando si stringe
      if (this.hasAttribute("liberi")) this._mettiAPosto();
    }
    this._decidiCompatta();
  }

  // IL LETTORE SI FA DELLA MISURA CHE GLI DAI.
  // Niente misura di riferimento inventata: guardo quanto posto c'e' nella
  // casella e quanto ne vuole il contenuto, e aggiusto la scala finche' i
  // due numeri combaciano. Casella piu' alta, lettore piu' grande; casella
  // bassa, lettore piu' piccolo ma tutto dentro invece che tagliato a
  // meta'. Con l'altezza automatica il posto e' esattamente quello che
  // serve, quindi non c'e' niente da aggiustare e non tocco niente.
  _scalaLettore() {
    const c = this._config || {};
    const dominio = c.entity ? c.entity.split(".")[0] : "";
    const modo = c.disposizione || (dominio === "media_player" ? "vinile" : "");
    // "vinile" e "ytmusic" sono lo stesso lettore con due vestiti diversi
    if (modo !== "vinile" && modo !== "ytmusic") {
      if (this._lettoreScala) {
        this._lettoreScala = 0;
        this.style.removeProperty("--lettore");
      }
      return;
    }
    const card = this.shadowRoot && this.shadowRoot.querySelector("ha-card");
    if (!card) return;
    const posto = card.clientHeight;
    // Dove comincia il primo pezzo e dove finisce l'ultimo. I pezzi
    // staccati dal flusso - la copertina di sfondo, il cielo, il velo -
    // non contano: stanno dietro e non chiedono posto.
    let su = Infinity;
    let giu = -Infinity;
    Array.prototype.forEach.call(card.children, (f) => {
      if (f.hidden) return;
      let st = null;
      try { st = getComputedStyle(f); } catch (e) { return; }
      if (!st || st.display === "none") return;
      if (st.position === "absolute" || st.position === "fixed") return;
      const r = f.getBoundingClientRect();
      if (!(r.height > 0)) return;
      if (r.top < su) su = r.top;
      if (r.bottom > giu) giu = r.bottom;
    });
    if (!isFinite(su) || !isFinite(giu)) return;
    const vuole = (giu - su) + 28;
    if (!(posto > 40) || !(vuole > 40)) return;
    const ora = this._lettoreScala || 1;
    const quanto = posto / vuole;
    // ci sta gia' come si deve: non c'e' niente da fare
    if (quanto > 0.97 && quanto < 1.03) { this._giriLettore = 0; return; }
    // con calma: un pezzo per volta, se no si mette a rimbalzare fra
    // troppo grande e troppo piccolo
    let s = ora + (ora * quanto - ora) * 0.6;
    s = Math.max(0.45, Math.min(1.8, Math.round(s * 20) / 20));
    if (s === ora) { this._giriLettore = 0; return; }
    this._lettoreScala = s;
    this.style.setProperty("--lettore", String(s));
    // Cambiando la scala cambia quanto posto vuole il contenuto, ma la
    // casella resta grande uguale: nessuno mi richiamerebbe. Mi do' io un
    // altro giro, e non piu' di dieci: se dopo dieci non ci siamo, meglio
    // fermarsi che ballare per sempre.
    this._giriLettore = (this._giriLettore || 0) + 1;
    if (this._giriLettore > 10) return;
    clearTimeout(this._ancoraLettore);
    this._ancoraLettore = setTimeout(() => {
      this._ancoraLettore = 0;
      if (this.isConnected) this._scalaLettore();
    }, 60);
  }

  // la stessa decisione ma con l'altezza gia' saputa: il disegno passa di
  // qui ogni secondo mentre suona la musica e misurare costa caro
  _decidiCompatta() {
    const h = this._altezzaVista;
    if (!h) return;
    // quanto spazio serve davvero: dipende da cosa c'e' dentro la casella
    let soglia = 128;
    const c0 = (el) => !!el && !el.hidden;
    if (c0(this._comandi)) soglia += 46;
    if (c0(this._cursore)) soglia += 34;
    if (c0(this._colori)) soglia += 34;
    if (c0(this._extra)) soglia += 34;
    if (c0(this._tempo)) soglia += 28;
    // Attenzione al cane che si morde la coda: dentro al pop-up la casella
    // si alza da sola sul contenuto, e passare a compatto la abbassa. Se
    // l'altezza sta sul filo della soglia si va avanti a rimbalzare -
    // ed e' lo sfarfallio velocissimo che si vedeva. Due paracadute: una
    // fascia morta di 14px, e uno stop se rimbalza lo stesso.
    const era = this.hasAttribute("compatta");
    const vuole = era ? (h < soglia + 14) : (h < soglia);
    if (vuole !== era) {
      const ora = Date.now();
      if (ora - (this._daQuandoBalla || 0) > 1500) {
        this._daQuandoBalla = ora;
        this._balli = 0;
      }
      this._balli = (this._balli || 0) + 1;
      if (this._balli <= 4) this.toggleAttribute("compatta", vuole);
    }
    // Quanto spazio resta DAVVERO al disegno: l'altezza della casella meno
    // il bordo, il nome (che con un nome lungo va a capo e ruba una riga) e
    // tutto quello che sta sotto - tasti rapidi, barra, colori. Prima
    // prendevo una fetta fissa dell'altezza e con la casella bassa l'icona
    // usciva dal riquadro e veniva tagliata. A scatti di 4px: se la seguo
    // al pixel, l'icona fa alzare la casella che la fa crescere di nuovo.
    // Nella casella a pezzi liberi le misure le comanda lui: qui non tocco
    // niente, se no il disegno si muove da solo sotto le sue mani.
    if (this.hasAttribute("liberi")) return;
    if (!this._testa) this._testa = this.shadowRoot.querySelector(".testa");
    if (!this._rigaIcona) this._rigaIcona = this.shadowRoot.querySelector("ha-card > .riga");
    if (!this._rigaIcona) return;
    const altoDi = (el) => (el && !el.hidden && el.offsetHeight) ? el.offsetHeight : 0;
    // rifaccio i conti solo se e' cambiato qualcosa: qui ci si passa a ogni
    // disegno, anche una volta al secondo mentre suona la musica
    const firma = h + "|" + altoDi(this._testa) + "|" + altoDi(this._comandi)
      + "|" + altoDi(this._cursore) + "|" + altoDi(this._colori)
      + "|" + altoDi(this._extra) + "|" + altoDi(this._tempo)
      + "|" + (this.hasAttribute("compatta") ? 1 : 0);
    if (this._firmaSpazio === firma) return;
    this._firmaSpazio = firma;
    // Quanto spazio resta al disegno non lo calcolo: lo CHIEDO alla casella.
    // Gli do' una misura esagerata e guardo quanta gliene concede - dentro
    // ci sono gia' bordi, riempimenti, spazi fra i pezzi e margini, che a
    // contarli a mano si sbaglia (e infatti si sbagliava di 24px).
    const chiedi = () => {
      this.style.setProperty("--alt-icona", "999px");
      const q = this._rigaIcona.offsetHeight;
      return q;
    };
    // La casella ha un'altezza sua, o cresce per stare dietro a quello che
    // ci metto dentro? Non lo indovino: provo il disegno al minimo e al
    // massimo e guardo se la CASELLA cambia. Se cambia, l'altezza gliel'ha
    // data il disegno, e prenderne il 44% vuol dire rincorrersi.
    this.style.setProperty("--alt-icona", "18px");
    const bassaCosi = this.offsetHeight;
    let libero = chiedi();
    const cresceDaSola = (this.offsetHeight - bassaCosi) > 8;
    // Se il posto non basta, la prima cosa che cede e' il nome: una riga
    // sola con i puntini invece di due. Cosi' il disegno resta. Prima
    // toglievo il disegno, e la casella nuova nasceva senza icona:
    // sbagliato, l'icona e' il pezzo che si guarda per primo.
    // La decisione la prendo sempre sul nome INTERO, non su quello gia'
    // accorciato: se no si accorcia, avanza posto, si riallunga, e si va
    // avanti a rimbalzare.
    if (this._nome) {
      const risparmio = Math.max(0, this._nome.scrollHeight - this._nome.offsetHeight);
      const eraCorto = this.hasAttribute("nomecorto");
      // Il nome per intero vale piu' di qualche pixel di disegno: lo taglio
      // solo se tenendolo il disegno resterebbe sotto i 26px, cioe' quando
      // non si capirebbe piu' cosa raffigura.
      const vuoleCorto = (libero - risparmio) < 26;
      if (vuoleCorto !== eraCorto) {
        this.toggleAttribute("nomecorto", vuoleCorto);
        libero = chiedi();                     // la testa ha cambiato altezza
      }
    }
    // dove la casella cresce da sola il disegno sta alla misura normale:
    // il 44% lo uso solo quando l'altezza gliel'ha data qualcun altro
    const suo = this.hasAttribute("compatta") ? 46 : 60;
    const tetto = cresceDaSola ? suo : h * 0.44;
    const quota = Math.min(tetto, libero > 0 ? libero : tetto);
    const ico = Math.max(18, Math.min(160, Math.round(quota / 4) * 4));
    this._icoDetta = ico;
    this.style.setProperty("--alt-icona", ico + "px");
  }

  connectedCallback() {
    // Appena sono nella pagina rimetto la colonna dell'anteprima dove
    // stava: e' il momento buono, prima ero staccato e non avevo nessuna
    // colonna sotto di me.
    try { this._tornaDovEravamo(); } catch (e) { /* pazienza */ }
    // cambiato posto: le risposte che mi ero segnato non valgono piu'
    this._postoSalvato = null;
    this._inSportello = undefined;
    if (this.hasAttribute("pienoschermo")) {
      this.removeAttribute("pienoschermo");
      try { document.body.style.overflow = this._scorrimentoPrima || ""; }
      catch (e) { /* pazienza */ }
    }
    this._sonoAnteprima = undefined;
    this._anteprimaVestita = null;
    this._ascoltaRivestiti();
    this._ascoltaProve();
    this._largaPrima = null;
    this._annidata = undefined;
    this._altaPrima = null;
    // solo ora posso sapere se sto dentro il riquadro di anteprima
    if (this._costruito) this._disegnaAntPopup();
    // Solo ora sono attaccato alla pagina, quindi solo ora posso sapere se
    // sono nell'anteprima delle impostazioni: rifaccio il giro completo, che
    // rimette in moto l'orologio della musica e riapre il riquadro che era
    // aperto prima che Home Assistant rifacesse la casella.
    if (this._costruito && this._hass && this._config) this._render();
    if (!this._osserva && window.ResizeObserver) {
      this._osserva = new ResizeObserver(() => this._controllaMisura());
      this._cartaOsservata = null;
    }
    this._controllaMisura();
  }

  // La sua ytmusic-card, viva, dentro alla casella. Non la riscrivo: la
  // monto. Cosi' quando lui la aggiorna, la casella si aggiorna da sola, e
  // non ci sono due copie della stessa cosa da tenere buone.
  // I tastini delle funzioni. Non e' una copia della sua card: e' una fila
  // di attrezzi nostri, vestiti come "Casse" e "Sorgente".
  _disegnaAttrezzi() {
    const attr = this._attrezziYt;
    if (!attr) return;
    const c = this._config;
    attr.hidden = !(this.hasAttribute("ytm") && c.yt_attrezzi);
    if (attr.hidden) return;
    attr.querySelector(".t-coda").hidden = !c.coda;
    attr.querySelector(".t-coda").toggleAttribute("aperto",
      !!(this._panCoda && !this._panCoda.hidden));
    attr.querySelector(".t-cerca").toggleAttribute("aperto",
      !!(this._panCerca && !this._panCerca.hidden));
    attr.querySelector(".t-sfoglia").toggleAttribute("aperto",
      !!(this._panSfoglia && !this._panSfoglia.hidden));
    attr.querySelector(".t-pieno").toggleAttribute("aperto",
      this.hasAttribute("pienoschermo"));
  }

  // --- LE PASTIGLIE E IL RIQUADRO PER SFOGLIARE ----------------------
  // Stessa logica della sua card: "Consigliati" arriva da
  // mass_queue.get_recommendations, "Recenti" da music_assistant.get_library
  // ordinato per ultimo ascolto, "Libreria" sono le cartelle per tipo.
  _disegnaPastiglie() {
    const dove = this._pastiglie;
    if (!dove || dove._fatto) return;
    dove._fatto = true;
    [["recommendations", "Consigliati"], ["recent", "Recenti"],
      ["library", "Libreria"]].forEach(function (coppia) {
      const b = document.createElement("button");
      b.type = "button";
      b.dataset.chiave = coppia[0];
      b.textContent = coppia[1];
      b.addEventListener("click", () =>
        this._caricaFonte(coppia[0], coppia[1]));
      dove.appendChild(b);
    }, this);
  }

  // cambio fonte restando dentro al riquadro
  _caricaFonte(chiave, nome) {
    this._pila = [];
    if (this._pastiglie) {
      Array.from(this._pastiglie.children).forEach((b) =>
        b.toggleAttribute("scelta", b.dataset.chiave === chiave));
    }
    this._caricaSfoglia(chiave, nome);
  }

  _apriSfoglia(vuole, chiave, nome) {
    const pan = this._panSfoglia;
    if (!pan) return;
    const apri = vuole === undefined ? pan.hidden : !!vuole;
    pan.hidden = !apri;
    if (this._menuCoda) this._menuCoda.hidden = true;
    if (!apri) { this._render(); return; }
    this._disegnaPastiglie();
    if (this._pastiglie) {
      Array.from(this._pastiglie.children).forEach((b) =>
        b.toggleAttribute("scelta", b.dataset.chiave === chiave));
    }
    if (this._panCerca) this._panCerca.hidden = true;
    this._pila = [];
    this._caricaSfoglia(chiave, nome || "Sfoglia");
    this._ricordaPannello();
    this._guardaFuori();
    this._render();
  }

  _sfogliaIndietro() {
    const prima = (this._pila || []).pop();
    if (!prima) { this._apriSfoglia(false); return; }
    this._scriviSfoglia(prima.voci, prima.titolo, true);
  }

  _caricaSfoglia(chiave, titolo) {
    const pan = this._panSfoglia;
    const elenco = pan.querySelector(".s-elenco");
    pan.querySelector(".s-titolo").textContent = titolo;
    elenco.innerHTML = '<div class="s-nota">Un attimo...</div>';
    const eid = this._entitaAttiva ? this._entitaAttiva() : this._config.entity;
    const finita = (voci) => this._scriviSfoglia(voci, titolo);
    const male = (e) => {
      elenco.innerHTML = '<div class="s-nota">Non risponde ('
        + ((e && e.message) || "errore") + ")</div>";
    };
    this._collegamentoMA(eid).then((cfg) => {
    if (chiave === "library") {
      if (!cfg) { male(new Error("serve Music Assistant")); return; }
      finita([["playlist", "Playlist"], ["album", "Album"],
        ["artist", "Artisti"], ["track", "Brani"], ["radio", "Radio"]]
        .map((coppia) => ({ nome: coppia[1], cartella: true,
          carica: { domain: "music_assistant", service: "get_library",
            service_data: { config_entry_id: cfg, media_type: coppia[0],
              limit: 300 } } })));
      return;
    }
    if (chiave === "recent") {
      if (!cfg) { male(new Error("serve Music Assistant")); return; }
      this._hass.callWS({ type: "call_service", domain: "music_assistant",
        service: "get_library", return_response: true,
        service_data: { config_entry_id: cfg, media_type: "track",
          order_by: "last_played_desc", limit: 100 },
      }).then((r) => finita(this._vociDa(((r || {}).response || {}).items)))
        .catch(male);
      return;
    }
    this._hass.callWS({ type: "call_service", domain: "mass_queue",
      service: "get_recommendations", service_data: { entity: eid },
      return_response: true,
    }).then((r) => {
      const dentro = (r && r.response) || {};
      const roba = dentro.response || dentro;
      const gruppi = Array.isArray(roba) ? roba : [];
      finita(gruppi.map((g) => ({
        nome: g.name || "", cartella: true,
        foto: g.image || ((g.items || [])[0] || {}).image || "",
        voci: this._vociDa(g.items),
      })));
    }).catch(male);
    });
  }

  _vociDa(roba) {
    return (Array.isArray(roba) ? roba : []).map((v) => {
      const chi = Array.isArray(v.artists)
        ? v.artists.map((a) => a && a.name).filter(Boolean).join(", ") : "";
      return { nome: v.name || v.title || "", chi, foto: v.image || "",
        uri: v.uri || v.media_content_id, tipo: v.media_type || "track" };
    });
  }

  _scriviSfoglia(voci, titolo, indietro) {
    const pan = this._panSfoglia;
    const elenco = pan.querySelector(".s-elenco");
    pan.querySelector(".s-titolo").textContent = titolo;
    pan.querySelector(".s-indietro").hidden = !(this._pila || []).length;
    elenco.innerHTML = "";
    if (!voci || !voci.length) {
      elenco.innerHTML = '<div class="s-nota">Qui non c-e niente.</div>'
        .replace("c-e", "c" + String.fromCharCode(39) + "e");
      return;
    }
    if (!indietro) this._ultimeVoci = { voci, titolo };
    const eid = this._entitaAttiva ? this._entitaAttiva() : this._config.entity;
    voci.forEach((v) => {
      const riga = document.createElement("div");
      riga.className = "voce";
      riga.innerHTML = (v.foto ? '<img alt="">' : '<i class="vuota"></i>')
        + '<span class="dati"><b></b><i></i></span>'
        + (v.cartella ? ""
          : '<button class="piu" type="button" title="Che ne faccio">'
            + '<ha-icon icon="mdi:dots-vertical"></ha-icon></button>');
      if (v.foto) riga.querySelector("img").src = v.foto;
      riga.querySelector("b").textContent = v.nome;
      riga.querySelector(".dati i").textContent = v.chi
        || (v.cartella ? "" : String(v.tipo || ""));
      riga.addEventListener("click", (e) => {
        if (e.target.closest && e.target.closest(".piu")) return;
        if (v.cartella) { this._entraCartella(v, titolo); return; }
        this._mandaInAscolto(eid, v, "play");
      });
      const piu = riga.querySelector(".piu");
      if (piu) {
        piu.addEventListener("click", (e) => {
          e.stopPropagation();
          this._apriMenuCoda(eid, v);
        });
      }
      elenco.appendChild(riga);
    });
  }

  _entraCartella(v) {
    this._pila = this._pila || [];
    if (this._ultimeVoci) {
      this._pila.push({ voci: this._ultimeVoci.voci,
        titolo: this._ultimeVoci.titolo });
    }
    if (v.voci) { this._scriviSfoglia(v.voci, v.nome); return; }
    if (!v.carica) return;
    const elenco = this._panSfoglia.querySelector(".s-elenco");
    elenco.innerHTML = '<div class="s-nota">Un attimo...</div>';
    this._hass.callWS({ type: "call_service", domain: v.carica.domain,
      service: v.carica.service, service_data: v.carica.service_data,
      return_response: true,
    }).then((r) => {
      const dentro = (r || {}).response || {};
      this._scriviSfoglia(this._vociDa(dentro.items || dentro), v.nome);
    }).catch((e) => {
      elenco.innerHTML = '<div class="s-nota">Non risponde ('
        + ((e && e.message) || "errore") + ")</div>";
    });
  }

  // --- che ne faccio: subito, dopo, in fondo, radio ------------------
  _apriMenuCoda(eid, v) {
    const menu = this._menuCoda;
    if (!menu) return;
    menu.innerHTML = "";
    [["play", "mdi:play", "Riproduci ora"],
      ["next", "mdi:playlist-play", "Riproduci dopo"],
      ["add", "mdi:playlist-plus", "Aggiungi in coda"],
      ["replace", "mdi:playlist-remove", "Riproduci e svuota la coda"],
      ["radio", "mdi:radio-tower", "Fai partire la radio"]]
      .forEach((riga) => {
        const b = document.createElement("button");
        b.type = "button";
        b.innerHTML = '<ha-icon icon="' + riga[1] + '"></ha-icon><span></span>';
        b.querySelector("span").textContent = riga[2];
        b.addEventListener("click", () => {
          this._mandaInAscolto(eid, v, riga[0]);
          menu.hidden = true;
        });
        menu.appendChild(b);
      });
    menu.hidden = false;
  }

  _mandaInAscolto(eid, v, come) {
    if (!v.uri || !this._hass) return;
    const dati = { entity_id: eid, media_id: v.uri,
      media_type: v.tipo || "track" };
    if (come === "radio") dati.radio_mode = true;
    else if (come && come !== "play") dati.enqueue = come;
    this._hass.callService("music_assistant", "play_media", dati);
    if (come === "play" || come === "replace") this._apriSfoglia(false);
    setTimeout(() => this._chiediCoda(eid), 1400);
  }

  // --- il cuoricino ---------------------------------------------------
  _disegnaCuore(st) {
    const cuore = this._cuore;
    if (!cuore) return;
    const c = this._config;
    cuore.hidden = !(this.hasAttribute("ytm") && c.yt_cuore && st);
    if (cuore.hidden) return;
    const acceso = !!this._preferito;
    cuore.toggleAttribute("acceso", acceso);
    const icona = cuore.querySelector("ha-icon");
    const vuole = acceso ? "mdi:heart" : "mdi:heart-outline";
    if (icona.getAttribute("icon") !== vuole) icona.setAttribute("icon", vuole);
  }

  _collegamentoCoda() {
    if (this._cfgCoda !== undefined) return Promise.resolve(this._cfgCoda);
    if (!this._hass || !this._hass.callWS) return Promise.resolve(null);
    return this._hass.callWS({ type: "config_entries/get",
      domain: "mass_queue" }).then((r) => {
      const uno = (Array.isArray(r) ? r : []).find((x) => x && x.entry_id);
      this._cfgCoda = uno ? uno.entry_id : null;
      return this._cfgCoda;
    }).catch(() => { this._cfgCoda = null; return null; });
  }

  _cambiaCuore() {
    const eid = this._entitaAttiva ? this._entitaAttiva() : this._config.entity;
    const st = this._hass && this._hass.states[eid];
    const roba = st && st.attributes.media_content_id;
    if (!roba) return;
    const prima = !!this._preferito;
    this._preferito = !prima;
    this._disegnaCuore(st);
    this._collegamentoCoda().then((cfg) => {
      if (!cfg) { this._preferito = prima; this._disegnaCuore(st); return; }
      // Aggiungere e togliere non si fanno allo stesso modo: per aggiungere
      // basta l'indirizzo del brano, per togliere ci vuole il numero che ha
      // in libreria. Presa pari pari dalla sua card.
      if (!prima) {
        this._hass.callService("mass_queue", "send_command", {
          config_entry_id: cfg, command: "music/favorites/add_item",
          data: { item: roba } });
        return;
      }
      const dentro = String(roba || "");
      const numero = dentro.indexOf("library://") === 0
        ? dentro.split("/").pop() : null;
      if (!numero) return;
      this._hass.callService("mass_queue", "send_command", {
        config_entry_id: cfg, command: "music/favorites/remove_item",
        data: { media_type: "track", library_item_id: numero } });
    });
  }

  _apriCoda(vuole) {
    const pan = this._panCoda;
    if (!pan) return;
    const apri = vuole === undefined ? pan.hidden : !!vuole;
    pan.hidden = !apri;
    if (apri) {
      if (this._panCerca) this._panCerca.hidden = true;
      if (this._panSfoglia) this._panSfoglia.hidden = true;
      const eid = this._entitaAttiva ? this._entitaAttiva() : this._config.entity;
      if (eid) this._chiediCoda(eid);
    }
    this._ricordaPannello();
    this._guardaFuori();
    this._render();
  }

  // schermo intero: la casella si stacca e copre la pagina. Niente finestre
  // nuove, niente card doppie - e' sempre la stessa, solo piu' grande.
  _schermoPieno() {
    const acceso = this.hasAttribute("pienoschermo");
    this.toggleAttribute("pienoschermo", !acceso);
    // e blocco anche la pagina sotto: la casella copre tutto, ma la plancia
    // dietro continuava a scorrere e ci si ritrovava sul nero
    try {
      const corpo = document.body;
      if (!acceso) {
        this._scorrimentoPrima = corpo.style.overflow;
        corpo.style.overflow = "hidden";
      } else {
        corpo.style.overflow = this._scorrimentoPrima || "";
        this._scorrimentoPrima = null;
      }
    } catch (e) { /* pazienza */ }
    if (!acceso) {
      this._viaDaPieno = (e) => {
        if (e.key === "Escape") this._schermoPieno();
      };
      document.addEventListener("keydown", this._viaDaPieno);
    } else if (this._viaDaPieno) {
      document.removeEventListener("keydown", this._viaDaPieno);
      this._viaDaPieno = null;
    }
    this._render();
  }

  _apriCerca(vuole) {
    const pan = this._panCerca;
    if (!pan) return;
    const apri = vuole === undefined ? pan.hidden : !!vuole;
    pan.hidden = !apri;
    if (apri) {
      if (this._panGruppo) this._panGruppo.hidden = true;
      if (this._panFonti) this._panFonti.hidden = true;
      this._disegnaTipiCerca();
      setTimeout(() => {
        const campo = pan.querySelector(".c-testo");
        if (campo) campo.focus();
      }, 60);
    }
    this._ricordaPannello();
    this._guardaFuori();
    this._render();
  }

  _disegnaTipiCerca() {
    const dove = this._panCerca.querySelector(".c-tipi");
    if (dove._fatto) {
      Array.from(dove.children).forEach((b) =>
        b.toggleAttribute("scelto", b.dataset.tipo === (this._tipoCerca || "")));
      return;
    }
    dove._fatto = true;
    dove.innerHTML = "";
    [["", "Tutto"], ["track", "Brani"], ["album", "Album"],
      ["artist", "Artisti"], ["playlist", "Playlist"], ["radio", "Radio"]]
      .forEach(([tipo, nome]) => {
        const b = document.createElement("button");
        b.type = "button";
        b.dataset.tipo = tipo;
        b.textContent = nome;
        b.toggleAttribute("scelto", tipo === (this._tipoCerca || ""));
        b.addEventListener("click", () => {
          this._tipoCerca = tipo;
          this._disegnaTipiCerca();
          if ((this._panCerca.querySelector(".c-testo").value || "").trim()) {
            this._cerca();
          }
        });
        dove.appendChild(b);
      });
  }

  // il codice del collegamento a Music Assistant: sta nel registro delle
  // entita', ed e' quello che i suoi comandi vogliono come "config_entry_id"
  // Il codice del collegamento a Music Assistant. Sta nel registro delle
  // entita', ma Home Assistant non sempre lo mette li' dentro: quando manca
  // lo si chiede al server, com'e' costretta a fare anche la sua card.
  _collegamentoMA(eid) {
    if (this._cfgMA) return Promise.resolve(this._cfgMA);
    const h = this._hass;
    const dal = h && h.entities && h.entities[eid]
      && h.entities[eid].config_entry_id;
    if (dal) { this._cfgMA = dal; return Promise.resolve(dal); }
    if (!h || !h.callWS) return Promise.resolve(null);
    return h.callWS({ type: "config_entries/get", domain: "music_assistant" })
      .then((r) => {
        const elenco = Array.isArray(r) ? r : (r && (r.entries || r.data)) || [];
        const uno = elenco.find((x) => x && x.domain === "music_assistant")
          || elenco[0];
        this._cfgMA = uno && (uno.entry_id || uno.entryId || uno.id);
        return this._cfgMA || null;
      }).catch(() => null);
  }

  _cerca() {
    const pan = this._panCerca;
    if (!pan || !this._hass) return;
    const esiti = pan.querySelector(".c-esiti");
    const testo = (pan.querySelector(".c-testo").value || "").trim();
    if (!testo) { esiti.innerHTML = ""; return; }
    const eid = this._entitaAttiva ? this._entitaAttiva() : this._config.entity;
    esiti.innerHTML = '<div class="c-nota">Sto cercando...</div>';
    this._collegamentoMA(eid).then((collegamento) => {
    if (!collegamento) {
      esiti.innerHTML = '<div class="c-nota">La ricerca ha bisogno di Music '
        + "Assistant: qui non lo trovo.</div>";
      return;
    }
    const dati = { config_entry_id: collegamento, name: testo, limit: 20 };
    if (this._tipoCerca) dati.media_type = [this._tipoCerca];
    return this._hass.callWS({
      type: "call_service", domain: "music_assistant", service: "search",
      service_data: dati, return_response: true,
    }).then((r) => {
      const roba = (r && r.response) || {};
      const mappa = { track: "tracks", album: "albums", artist: "artists",
        playlist: "playlists", radio: "radio" };
      const gruppi = this._tipoCerca ? [mappa[this._tipoCerca]]
        : ["tracks", "artists", "albums", "playlists", "radio"];
      const trovati = [];
      gruppi.forEach((g) => {
        (roba[g] || []).forEach((v) => {
          const chi = Array.isArray(v.artists)
            ? v.artists.map((a) => a && a.name).filter(Boolean).join(", ") : "";
          trovati.push({ nome: v.name || "", chi,
            foto: v.image || "", uri: v.uri, tipo: v.media_type });
        });
      });
      RICERCHE.set((this._config && this._config.entity) || "",
        { testo, tipo: this._tipoCerca || "", trovati });
      this._scriviEsiti(trovati, eid);
    }).catch((e) => {
      esiti.innerHTML = '<div class="c-nota">La ricerca non ha risposto ('
        + ((e && e.message) || "errore") + ")</div>";
    });
    });
  }

  _scriviEsiti(elenco, eid) {
    const esiti = this._panCerca.querySelector(".c-esiti");
    esiti.innerHTML = "";
    if (!elenco.length) {
      esiti.innerHTML = '<div class="c-nota">Non ho trovato niente.</div>';
      return;
    }
    elenco.forEach((v) => {
      const riga = document.createElement("div");
      riga.className = "esito";
      riga.innerHTML = (v.foto ? '<img alt="">' : '<i class="vuota"></i>')
        + '<span class="dati"><b></b><i></i></span>';
      if (v.foto) riga.querySelector("img").src = v.foto;
      riga.querySelector("b").textContent = v.nome;
      riga.querySelector(".dati i").textContent = v.chi
        || (v.tipo ? String(v.tipo) : "");
      riga.addEventListener("click", () => {
        if (!v.uri) return;
        this._hass.callService("music_assistant", "play_media",
          { entity_id: eid, media_id: v.uri, media_type: v.tipo || "track" });
        this._apriCerca(false);
        setTimeout(() => this._chiediCoda(eid), 1200);
      });
      esiti.appendChild(riga);
    });
  }

  // LA CODA, quella vera di Music Assistant. Non un elenco finto: i brani
  // arrivano da "mass_queue.get_queue_items" e i tasti chiamano i suoi
  // comandi - suona questo, spostalo su, spostalo giu', toglilo.
  _disegnaCoda(st) {
    const box = this._codaBox;
    if (!box) return;
    const c = this._config;
    const eid = this._entitaAttiva ? this._entitaAttiva() : c.entity;
    const pan = this._panCoda;
    const vuole = !!c.coda && !!eid && this.hasAttribute("ytm");
    if (pan && !vuole) pan.hidden = true;
    // l'elenco lo riempio solo quando la finestra e' aperta: non ha senso
    // interrogare il server per una cosa che nessuno sta guardando
    if (!vuole || (pan && pan.hidden)) return;
    if (!box._fatto) {
      box._fatto = true;
      box.innerHTML = '<div class="coda-testa">In coda</div><div class="coda-lista"></div>';
      box._lista = box.querySelector(".coda-lista");
    }
    // la ricarico quando cambia il brano, e comunque non piu' di una volta
    // ogni due secondi: e' una chiamata al server, non un attributo.
    // Il segno di "gia' chiesta" lo metto solo quando la domanda parte
    // davvero: al primo giro la casella esiste ma Home Assistant non le ha
    // ancora dato i dati, e segnandolo li' la coda restava vuota.
    const chi = (st && st.attributes.media_title) || "";
    // col lettore yt il titolo puo' restare uguale mentre cambia il posto
    // nella fila: ci metto dentro anche quello
    const dove = (st && st.attributes.current_track !== undefined)
      ? "#" + st.attributes.current_track : "";
    this._chiediCoda(eid, eid + "|" + chi + dove);
  }

  _chiediCoda(eid, quale) {
    const box = this._codaBox;
    if (!box || !this._hass || !this._hass.callWS) return;
    const ora = Date.now();
    if (quale !== undefined) {
      if (box._perChi === quale || ora - (box._quando || 0) < 2000) return;
      box._perChi = quale;
    }
    box._quando = ora;
    const st = this._hass.states[eid];
    if (!st || st.state === "off" || st.state === "unavailable") {
      this._scriviCoda([], eid);
      return;
    }
    // Due lettori, due code diverse. Music Assistant la tiene lui e la da'
    // per intero (con i numeri dei brani, quindi si possono spostare);
    // ytube_music_player invece la fa vedere sfogliando la playlist in
    // corso, e li' si puo' solo saltare al brano.
    if (this._codaDiYt(st)) {
      this._hass.callWS({
        type: "media_player/browse_media", entity_id: eid,
        media_content_type: "cur_playlists", media_content_id: "",
      }).then((r) => {
        const figli = (r && r.children) || [];
        this._scriviCoda(figli.map((v) => ({
          titolo: this._senzaPrefisso(v.title),
          chi: "",
          foto: v.thumbnail || (v.media_content_id ? "" : ""),
          id: v.media_content_id,
          cid: null,
        })), eid, null, false, "yt");
      }).catch((e) => {
        this._scriviCoda(null, eid, e && e.message ? e.message : "non risponde");
      });
      return;
    }
    // Prima la strada buona: "mass_queue" da' la coda INTERA, con il numero
    // di ogni brano - quello che serve per spostarli e toglierli. Se non
    // c'e' (non tutte le casse hanno quell'aggiunta) ripiego su Music
    // Assistant, che pero' sa dire solo "questo e il prossimo".
    this._hass.callWS({
      type: "call_service", domain: "mass_queue", service: "get_queue_items",
      service_data: { entity: eid, limit_before: 3, limit_after: 400 },
      return_response: true,
    }).then((r) => {
      const roba = (r && r.response) ? (r.response[eid] || r.response) : null;
      if (!Array.isArray(roba)) throw new Error("coda vuota");
      this._scriviCoda(roba.map((v) => ({
        titolo: v.media_title || v.name || "",
        chi: v.media_artist || "",
        foto: v.local_image_encoded || v.media_image || "",
        id: v.queue_item_id,
        cid: v.media_content_id,
      })), eid, null, true, "ma");
    }).catch(() => {
      this._hass.callWS({
        type: "call_service", domain: "music_assistant", service: "get_queue",
        target: { entity_id: eid }, return_response: true,
      }).then((r) => {
        const q = (r && r.response) ? r.response[eid] : null;
        const due = [q && q.current_item, q && q.next_item].filter(Boolean);
        this._scriviCoda(due.map((v) => {
          const m = v.media_item || {};
          const art = (m.artists && m.artists[0] && m.artists[0].name) || "";
          return { titolo: m.name || v.name || "", chi: art,
            foto: m.image || "", id: undefined, cid: undefined };
        }), eid, null, false, "ma");
      }).catch((e) => {
        this._scriviCoda(null, eid, e && e.message ? e.message : "non risponde");
      });
    });
  }

  // il lettore della vecchia integrazione YouTube Music si riconosce dalle
  // sue cose: il numero del brano in corso e il codice del video
  _codaDiYt(st) {
    if (!st) return false;
    const a = st.attributes || {};
    if (a.app_id === "music_assistant") return false;
    return a.current_track !== undefined || a.videoId !== undefined;
  }

  // i titoli della playlist arrivano come "Brano: Tizio - Cosa"
  _senzaPrefisso(t) {
    return String(t || "").replace(
      /^(Track|Album|Artist|Playlist|Radio|Video|Brano|Artista|Brani):\s*/i, "");
  }

  // Il brano che suona adesso lo riconosco dal media_content_id, come fa
  // la sua card: il titolo puo' ripetersi, quel codice no.
  _scriviCoda(elenco, eid, errore, comandabile, tipo) {
    const box = this._codaBox;
    if (!box || !box._lista) return;
    const lista = box._lista;
    if (!elenco) {
      lista.innerHTML = '<div class="coda-vuota">Non riesco a leggere la coda'
        + (errore ? " (" + errore + ")" : "") + "</div>";
      return;
    }
    if (!elenco.length) {
      lista.innerHTML = '<div class="coda-vuota">Non c\'e\' niente in coda</div>';
      return;
    }
    const st = this._hass && this._hass.states[eid];
    const ora = st ? st.attributes.media_content_id : null;
    let adesso = -1;
    if (tipo === "yt") {
      // qui il posto nella fila lo dice il lettore stesso
      const n = st ? Number(st.attributes.current_track) : NaN;
      if (!isNaN(n)) adesso = n;
    }
    if (adesso < 0) adesso = elenco.findIndex((v) => v.cid && v.cid === ora);
    if (adesso < 0 && st && st.attributes.media_title) {
      adesso = elenco.findIndex((v) => v.titolo === st.attributes.media_title);
    }
    lista.innerHTML = "";
    elenco.forEach((v, n) => {
      const riga = document.createElement("div");
      riga.className = "coda-riga";
      riga.toggleAttribute("adesso", n === adesso);
      const foto = v.foto
        ? '<img class="cop" alt="">'
        : '<i class="cop"><ha-icon icon="mdi:music"></ha-icon></i>';
      // i tastini solo sui brani che devono ancora venire: su quelli gia'
      // passati non servono a niente, e sul brano che suona nemmeno
      const puo = !!(comandabile && v.id !== undefined && adesso >= 0 && n > adesso);
      const tasto = (cosa, titolo, icona) =>
        '<button data-fa="' + cosa + '" title="' + titolo + '">'
        + '<ha-icon icon="' + icona + '"></ha-icon></button>';
      riga.innerHTML = foto
        + '<span class="dati"><b></b><i></i></span>'
        + (n === adesso ? '<ha-icon class="suona" icon="mdi:volume-high"></ha-icon>' : "")
        + (puo ? '<span class="tasti">'
          + tasto("move_queue_item_next", "Riproduci dopo", "mdi:playlist-play")
          + (n > adesso + 1
            ? tasto("move_queue_item_up", "Su", "mdi:arrow-up") : "")
          + tasto("move_queue_item_down", "Giu", "mdi:arrow-down")
          + tasto("remove_queue_item", "Rimuovi", "mdi:close")
          + "</span>" : "");
      if (v.foto) riga.querySelector("img.cop").src = v.foto;
      riga.querySelector(".dati b").textContent = v.titolo || "(senza titolo)";
      riga.querySelector(".dati i").textContent = v.chi || "";
      if (!v.chi) riga.querySelector(".dati i").hidden = true;
      riga.addEventListener("click", (e) => {
        if (e.target.closest && e.target.closest(".tasti")) return;
        if (!this._hass) return;
        if (tipo === "yt") {
          this._hass.callService("ytube_music_player", "call_method",
            { entity_id: eid, command: "goto_track", parameters: n + 1 });
          setTimeout(() => this._chiediCoda(eid), 1200);
          return;
        }
        if (v.id === undefined) return;
        this._hass.callService("mass_queue", "play_queue_item",
          { entity: eid, queue_item_id: v.id });
        setTimeout(() => this._chiediCoda(eid), 1000);
      });
      riga.querySelectorAll(".tasti button").forEach((b) => {
        b.addEventListener("click", (e) => {
          e.stopPropagation();
          this._hass.callService("mass_queue", b.dataset.fa,
            { entity: eid, queue_item_id: v.id });
          setTimeout(() => this._chiediCoda(eid), 400);
        });
      });
      lista.appendChild(riga);
    });
    // la riga che suona la porto sotto gli occhi, senza scossoni
    const q = lista.querySelector(".coda-riga[adesso]");
    if (q && q.offsetParent) {
      lista.scrollTop = Math.max(0, q.offsetTop - 6);
    }
  }

  _disegnaComandi(st) {
    const c = this._config;
    const dom = c.entity ? c.entity.split(".")[0] : "";
    const rapidi = ["cover", "lock", "vacuum"].includes(dom)
      && !!st && c.comandi_rapidi !== false;
    // i tasti giusti per il tipo di apparecchio
    const mostra = {
      prec: false, play: false, succ: false, stop: false,
      su: false, fermo: false, giu: false,
      chiudi: false, sblocca: false, via: false, sosta: false, casa: false,
    };
    if (rapidi) {
      if (dom === "cover") {
        mostra.su = true;
        mostra.fermo = true;
        mostra.giu = true;
      } else if (dom === "lock") {
        mostra.chiudi = true;
        mostra.sblocca = true;
      } else {
        mostra.via = true;
        mostra.sosta = true;
        mostra.casa = true;
      }
      Object.keys(mostra).forEach((k) => {
        const b = this._comandi.querySelector("." + k);
        if (b) b.hidden = !mostra[k];
      });
      this._comandi.hidden = false;
      // La tapparella accende il tasto di dove si trova: tutta su, tutta
      // giu', oppure il tasto "ferma" mentre sta viaggiando. Prima li
      // SPEGNEVO a fine corsa, e col vetro nuovo un tasto spento sembra
      // rotto invece che "sei gia' arrivato".
      if (dom === "cover") {
        const dove = st.attributes.current_position;
        const q = String(st.state).toLowerCase();
        const muove = q === "opening" || q === "closing";
        const tasto = (k) => this._comandi.querySelector("." + k);
        tasto("su").disabled = false;
        tasto("giu").disabled = false;
        tasto("su").toggleAttribute("acceso", !muove
          && (dove === 100 || (q === "open" && dove === undefined)));
        tasto("giu").toggleAttribute("acceso", !muove
          && (dove === 0 || (q === "closed" && dove === undefined)));
        tasto("fermo").toggleAttribute("acceso", muove);
      }
      if (dom === "lock") {
        const chiusa = st.state === "locked";
        this._comandi.querySelector(".chiudi").toggleAttribute("acceso", chiusa);
        this._comandi.querySelector(".sblocca").toggleAttribute("acceso", !chiusa);
      }
      if (dom === "vacuum") {
        // niente tasti spenti a meta': si accende quello che racconta cosa
        // sta facendo, gli altri restano pronti
        const q = String(st.state).toLowerCase();
        this._comandi.querySelector(".via")
          .toggleAttribute("acceso", ["cleaning", "on"].includes(q));
        this._comandi.querySelector(".sosta")
          .toggleAttribute("acceso", q === "paused");
        this._comandi.querySelector(".casa")
          .toggleAttribute("acceso", ["docked", "returning"].includes(q));
      }
      return;
    }
    ["su", "fermo", "giu", "chiudi", "sblocca", "via", "sosta", "casa"]
      .forEach((k) => {
        const b = this._comandi.querySelector("." + k);
        if (b) b.hidden = true;
      });

    const ok = !!c.comandi_media && !!c.entity
      && dom === "media_player" && !!st;
    this._comandi.hidden = !ok;
    if (!ok) return;
    ["prec", "play", "succ", "stop"].forEach((k) => {
      const b = this._comandi.querySelector("." + k);
      if (b) b.hidden = false;
    });

    // cosa sa fare questo lettore (0 = non lo dice, mostriamo tutto)
    const puo = Number(st.attributes.supported_features) || 0;
    const suona = st.state === "playing";

    const bPlay = this._comandi.querySelector(".play");
    metti(bPlay, suona ? "pausa" : "play");
    bPlay.title = suona ? "Pausa" : "Riproduci";

    this._comandi.querySelector(".prec").hidden = !!puo && !(puo & 16);
    this._comandi.querySelector(".succ").hidden = !!puo && !(puo & 32);

    const bStop = this._comandi.querySelector(".stop");
    const puoSvuotare = !puo || (puo & 8192);
    if (!puo || (puo & 4096)) {
      metti(bStop, "stop");
      bStop.title = puoSvuotare ? "Ferma e svuota la coda" : "Ferma";
      bStop._servizi = puoSvuotare ? ["media_stop", "clear_playlist"] : ["media_stop"];
      bStop.hidden = false;
    } else if (puo & 8192) {
      metti(bStop, "svuota");
      bStop.title = "Svuota la coda";
      bStop._servizi = ["clear_playlist"];
      bStop.hidden = false;
    } else if (puo & 256) {
      metti(bStop, "spegni");
      bStop.title = "Spegni";
      bStop._servizi = ["turn_off"];
      bStop.hidden = false;
    } else {
      bStop.hidden = true;
    }
  }

  // --- multi-room e sorgente -------------------------------------------
  _apriPannello(quale) {
    const gruppo = quale === "gruppo";
    const eraAperto = gruppo ? !this._panGruppo.hidden : !this._panFonti.hidden;
    this._panGruppo.hidden = gruppo ? eraAperto : true;
    this._panFonti.hidden = gruppo ? true : eraAperto;
    this._bGruppo.toggleAttribute("aperto", !this._panGruppo.hidden);
    this._bFonte.toggleAttribute("aperto", !this._panFonti.hidden);
    this._ricordaPannello();
    this._guardaFuori();
    this._render();
  }

  // Il riquadro delle casse (e quello delle sorgenti) si chiude anche
  // toccando fuori, non solo con la X: e' quello che uno si aspetta da una
  // finestrella. Ascolto in cattura sul documento, cosi' arrivo prima di
  // chiunque altro, e mi levo di mezzo appena si chiude.
  // tutti i riquadri della casella, non solo quelli vecchi
  _tuttiIRiquadri() {
    return [this._panGruppo, this._panFonti, this._panCerca, this._panSfoglia,
      this._panCoda, this._menuCoda].filter(Boolean);
  }

  _chiudiTuttiIRiquadri() {
    let cambiato = false;
    this._tuttiIRiquadri().forEach((pan) => {
      if (!pan.hidden) { pan.hidden = true; cambiato = true; }
    });
    if (this._bGruppo) this._bGruppo.removeAttribute("aperto");
    if (this._bFonte) this._bFonte.removeAttribute("aperto");
    PANNELLI_APERTI.delete((this._config && this._config.entity) || "");
    if (cambiato) {
      this._guardaFuori();
      this._render();
    }
  }

  // Sto dentro alla finestra "Configurazione scheda"? Me lo guardo da solo
  // risalendo i genitori: mi appoggiavo a un controllo fatto altrove, che
  // pero' non e' sempre gia' stato eseguito quando serve qui.
  _dentroSportello() {
    if (this._inSportello !== undefined) return this._inSportello;
    let n = this;
    this._inSportello = false;
    for (let i = 0; i < 40; i += 1) {
      n = n.parentNode || n.host;
      if (!n) break;
      const nome = String(n.localName || "");
      const classi = n.classList;
      // i nomi con cui Home Assistant chiama l'anteprima delle
      // impostazioni cambiano di versione in versione: li accetto tutti
      if (nome === "hui-dialog-edit-card" || nome === "hui-card-preview"
          || nome === "hui-card-element-editor" || nome === "ha-dialog"
          || (classi && classi.contains && classi.contains("element-preview"))) {
        this._inSportello = true;
        break;
      }
    }
    return this._inSportello;
  }

  _guardaFuori() {
    // Nell'anteprima delle impostazioni NON si chiude niente da soli: li'
    // ogni clic (su un cursore, su un interruttore) e' fuori dalla casella,
    // e il riquadro si chiudeva prima ancora che lui potesse leggere il
    // valore che stava cambiando.
    const inAnteprima = this._dentroAnteprima();
    const aperto = !inAnteprima
      && this._tuttiIRiquadri().some((pan) => !pan.hidden);
    if (!aperto) {
      if (this._fuori) {
        document.removeEventListener("pointerdown", this._fuori, true);
        this._fuori = null;
      }
      return;
    }
    if (this._fuori) return;
    this._fuori = (e) => {
      if (!this.isConnected) {
        document.removeEventListener("pointerdown", this._fuori, true);
        this._fuori = null;
        return;
      }
      const strada = e.composedPath ? e.composedPath() : [];
      const suoi = this._tuttiIRiquadri()
        .concat([this._bGruppo, this._bFonte, this._attrezziYt].filter(Boolean));
      if (strada.some((n) => suoi.indexOf(n) !== -1)) return;
      // Se il tocco arriva da una FINESTRA di Home Assistant - quella delle
      // impostazioni, il dettaglio dell'entita', qualunque altra - non e'
      // roba nostra: non si chiude niente. Prima cercavo di indovinare come
      // si chiamasse l'anteprima, versione per versione; cosi' invece il
      // problema non si pone: la finestra si riconosce da sola, ovunque
      // stia la casella. Cosi' lui puo' girare i cursori e vedere l'effetto
      // sul riquadro aperto, senza doverlo riaprire ogni volta.
      const daUnaFinestra = strada.some((n) => {
        const nome = n && n.localName ? String(n.localName) : "";
        return nome.indexOf("dialog") !== -1
          || nome === "hui-card-preview" || nome === "hui-card-element-editor"
          || nome === "casa-tile-editor";
      });
      if (daUnaFinestra) return;
      // se il tocco e' sulla casella, il riquadro si chiude e basta: non
      // deve anche partire quello che fa la casella quando la tocchi
      if (strada.indexOf(this) !== -1) this._nonToccare = Date.now();
      this._chiudiTuttiIRiquadri();
    };
    document.addEventListener("pointerdown", this._fuori, true);
  }

  // me lo segno fuori dall'elemento, cosi' sopravvive a un rifacimento
  _ricordaPannello() {
    const chi = (this._config && this._config.entity) || "";
    let quale = null;
    if (!this._panGruppo.hidden) quale = "gruppo";
    else if (!this._panFonti.hidden) quale = "fonti";
    else if (this._panCerca && !this._panCerca.hidden) quale = "cerca";
    else if (this._panSfoglia && !this._panSfoglia.hidden) quale = "sfoglia";
    else if (this._panCoda && !this._panCoda.hidden) quale = "coda";
    if (quale) PANNELLI_APERTI.set(chi, quale);
    else PANNELLI_APERTI.delete(chi);
  }

  _chiudiPannelli() {
    this._panGruppo.hidden = true;
    this._panFonti.hidden = true;
    PANNELLI_APERTI.delete((this._config && this._config.entity) || "");
    this._bGruppo.removeAttribute("aperto");
    this._bFonte.removeAttribute("aperto");
    this._guardaFuori();
    this._render();
  }

  _casseCandidate(padrone) {
    let lista = this._lettori();
    if (!lista.length) {
      const stati = this._hass ? this._hass.states : {};
      lista = Object.keys(stati).filter((e) => e.indexOf("media_player.") === 0
        && Array.isArray(stati[e].attributes.group_members)).slice(0, 14);
    }
    lista = lista.filter((e) => e !== padrone);
    lista.unshift(padrone);
    return lista;
  }

  // CHI COMANDA IL GRUPPO. Non e' detto che sia questa casella: in Music
  // Assistant (e in Home Assistant in generale) il capo e' il primo della
  // lista, ed e' l'unico che tiene la coda - le casse agganciate hanno la
  // loro coda vuota. Dare per scontato di comandare e' esattamente quello
  // che rompeva il trasferimento.
  _capoGruppo(st) {
    const membri = st && Array.isArray(st.attributes.group_members)
      ? st.attributes.group_members : [];
    return membri.length ? membri[0] : this._config.entity;
  }

  _cambiaGruppo(eid, riga) {
    const padrone = this._config.entity;
    const st = this._hass ? this._hass.states[padrone] : null;
    if (!st) return;
    const membri = Array.isArray(st.attributes.group_members)
      ? st.attributes.group_members : [];

    // il comando puo' non riuscire (cassa spenta, lettore che non sa unirsi):
    // in quel caso la riga lampeggia invece di non fare niente in silenzio
    const prova = (servizio, dati, dominio) => {
      let esito;
      try { esito = this._hass.callService(dominio || "media_player", servizio, dati); }
      catch (e) { esito = Promise.reject(e); }
      if (esito && typeof esito.catch === "function") {
        esito.catch(() => {
          if (!riga) return;
          riga._attesa = undefined;
          riga.removeAttribute("attesa");
          clearTimeout(riga._sveglia);
          riga.setAttribute("nope", "");
          setTimeout(() => {
            riga.removeAttribute("nope");
            this._render();
          }, 750);
        });
      }
    };

    const capo = this._capoGruppo(st);
    const dentroOra = eid === padrone || membri.includes(eid);
    // la riga di se stessi quando comando io non fa niente: sciogliere il
    // gruppo da li' non se lo aspetta nessuno (e' anche quello che fanno la
    // card yt e quella ufficiale di Music Assistant)
    if (eid === padrone && capo === padrone) return;
    if (riga) {
      // l'interruttore va subito dove l'ho messo io e ci resta finche'
      // il lettore non risponde (o per 10 secondi)
      riga._attesa = !dentroOra;
      riga._attesaFino = Date.now() + 10000;
      const sw = riga.querySelector(".sw");
      sw.toggleAttribute("on", !dentroOra);
      riga.setAttribute("attesa", "");
      clearTimeout(riga._sveglia);
      riga._sveglia = setTimeout(() => {
        riga._attesa = undefined;
        riga.removeAttribute("attesa");
        this._render();
      }, 10100);
    }

    if (eid === padrone) {
      // sono una delle agganciate: mi sfilo e basta. La coda non e' mia, e
      // chiedere di spostarla farebbe solo fallire il comando
      prova("unjoin", { entity_id: padrone });
      return;
    }
    if (membri.includes(eid)) {
      prova("unjoin", { entity_id: eid });
    } else {
      // agganciare passa sempre da chi comanda, anche quando la casella e'
      // una delle agganciate: e' li' che sta la coda
      const conLui = membri.filter((e) => e !== capo);
      conLui.push(eid);
      prova("join", { entity_id: capo, group_members: conLui });
    }
  }

  _disegnaColori(st) {
    const c = this._config;
    const box = this._colori;
    if (!box) return;
    const dom = c.entity ? c.entity.split(".")[0] : "";
    const modi = (st && st.attributes.supported_color_modes) || [];
    const conTinta = modi.some((m) => ["hs", "rgb", "rgbw", "rgbww", "xy"].includes(m));
    const conCaloreVero = modi.includes("color_temp");
    // strisce coi soli colori: il caldo/freddo lo mescoliamo noi
    const caloreFinto = !conCaloreVero && !modi.includes("white")
      && modi.some((m) => ["rgb", "rgbw", "rgbww", "hs", "xy"].includes(m));
    const conCalore = conCaloreVero || caloreFinto;
    this._calore._finto = caloreFinto;
    // certe lampade non hanno le gradazioni di bianco: hanno un bianco solo
    const conBianco = modi.includes("white");
    // le strisce si vedono anche a luce spenta: muovendole si accende
    // gia' del colore scelto (come fa Home Assistant)
    const mostra = !!c.cursore_colore && dom === "light" && !!st
      && (conTinta || conCalore || conBianco);
    box.hidden = !mostra;
    if (!mostra) return;

    // una sola striscia: la tinta se la lampada ha i colori, altrimenti
    // il caldo/freddo. Tutte e due solo se lo chiede lui.
    const quale = c.colore_striscia || "tinta";
    const dueStrisce = quale === "tutte";
    if (!this._modoColore) this._modoColore = quale === "bianco" ? "bianco" : "tinta";
    // se la lampada sa fare solo una delle due cose, quella e'
    const modo = !conTinta ? "bianco" : (!conCalore ? "tinta" : this._modoColore);
    this._tinta.hidden = !conTinta || (!dueStrisce && modo !== "tinta");
    this._calore.hidden = !conCalore || (!dueStrisce && modo !== "bianco");
    // il tastino c'e' se la lampada fa colori E bianco (a gradazioni o
    // secco). Col bianco secco non c'e' niente da scambiare: rimette il bianco.
    const soloBianco = conTinta && !conCaloreVero && conBianco;
    this._scambio._soloBianco = soloBianco;
    this._scambio.hidden = !(conTinta && (conCalore || conBianco)) || dueStrisce;
    if (!this._scambio.hidden) {
      if (soloBianco) {
        const eBianca = st.attributes.color_mode === "white";
        // l'icona dice cosa succede al prossimo tocco
        metti(this._scambio, eBianca ? "tavolozza" : "bianco");
        this._scambio.toggleAttribute("acceso", eBianca);
        this._scambio.title = eBianca
          ? "Adesso e bianca: toccami per colorarla"
          : "Torna alla luce bianca";
      } else {
        this._scambio.removeAttribute("acceso");
        metti(this._scambio, modo === "tinta" ? "bianco" : "tavolozza");
        this._scambio.title = modo === "tinta"
          ? "Passa al bianco caldo/freddo" : "Passa ai colori";
      }
    }
    if (conCalore) {
      const min = conCaloreVero ? (st.attributes.min_color_temp_kelvin || 2000) : 2200;
      const max = conCaloreVero ? (st.attributes.max_color_temp_kelvin || 6500) : 6500;
      this._calore.min = String(min);
      this._calore.max = String(max);
    }
    if (this._trascinoColore) return;
    const hs = st.attributes.hs_color;
    if (conTinta && Array.isArray(hs)) this._tinta.value = String(Math.round(hs[0]));
    const k = st.attributes.color_temp_kelvin;
    if (conCaloreVero && k) this._calore.value = String(k);
  }

  _disegnaExtra(st) {
    const c = this._config;
    const media = !!c.entity && c.entity.split(".")[0] === "media_player" && !!st;
    const puo = media ? (Number(st.attributes.supported_features) || 0) : 0;
    const conGruppo = media && c.multiroom !== false
      && (!!(puo & 524288) || Array.isArray(st.attributes.group_members));
    const conFonti = media && c.sorgente !== false
      && Array.isArray(st.attributes.source_list) && st.attributes.source_list.length > 0;

    this._bGruppo.hidden = !conGruppo;
    this._bFonte.hidden = !conFonti;
    this._extra.hidden = !conGruppo && !conFonti;
    if (!conGruppo && !this._panGruppo.hidden) {
      this._panGruppo.hidden = true;
      this._bGruppo.removeAttribute("aperto");
    }
    if (!conFonti && !this._panFonti.hidden) {
      this._panFonti.hidden = true;
      this._bFonte.removeAttribute("aperto");
    }
    // nell'anteprima delle impostazioni la casella viene rifatta in
    // continuazione: rimetto aperto il riquadro che stava aperto, se no
    // a ogni ritocco si chiude e tocca riaprirlo
    if (this._dentroAnteprima()) {
      const quale = PANNELLI_APERTI.get(c.entity) || null;
      this._panGruppo.hidden = !(quale === "gruppo" && conGruppo);
      this._panFonti.hidden = !(quale === "fonti" && conFonti);
      this._bGruppo.toggleAttribute("aperto", !this._panGruppo.hidden);
      this._bFonte.toggleAttribute("aperto", !this._panFonti.hidden);
      // stessa cosa per i riquadri nuovi: nell'anteprima la casella viene
      // rifatta a ogni ritocco, e senza questo si chiudevano da soli
      if (this._panCerca) {
        this._panCerca.hidden = quale !== "cerca";
        // le pastiglie dei tipi le disegnavo solo all'apertura col tastino:
        // riaprendosi da solo il riquadro restava senza
        if (!this._panCerca.hidden) {
          const prima = RICERCHE.get(c.entity);
          if (prima) this._tipoCerca = prima.tipo;
          this._disegnaTipiCerca();
          if (prima) {
            const campo = this._panCerca.querySelector(".c-testo");
            if (campo && !campo.value) campo.value = prima.testo;
            const esiti = this._panCerca.querySelector(".c-esiti");
            if (esiti && !esiti.children.length) {
              this._scriviEsiti(prima.trovati, c.entity);
            }
          }
        }
      }
      if (this._panSfoglia) this._panSfoglia.hidden = quale !== "sfoglia";
      if (this._panCoda) this._panCoda.hidden = quale !== "coda";
      if (quale === "sfoglia" && this._panSfoglia
          && !this._panSfoglia.querySelector(".s-elenco").children.length) {
        this._caricaFonte("recommendations", "Consigliati");
      }
    }
    if (!this._panGruppo.hidden) this._disegnaGruppo(st);
    if (!this._panFonti.hidden) this._disegnaFonti(st);
  }

  // Music Assistant o no? Il trasferimento della coda e' roba sua: su un
  // lettore di un'altra integrazione il servizio non esiste nemmeno.
  _daMusicAssistant(eid) {
    const reg = this._hass && this._hass.entities ? this._hass.entities[eid] : null;
    return !!reg && reg.platform === "music_assistant";
  }

  _disegnaGruppo(st) {
    const box = this._panGruppo.querySelector(".p-corpo");
    const padrone = this._config.entity;
    const stati = this._hass ? this._hass.states : {};
    const membri = Array.isArray(st.attributes.group_members)
      ? st.attributes.group_members : [padrone];
    const lista = this._casseCandidate(padrone);
    const firma = lista.join("|");
    if (box._firma !== firma) {
      box._firma = firma;
      box.innerHTML = "";
      lista.forEach((eid) => {
        const r = document.createElement("div");
        r.className = "voce";
        r.dataset.eid = eid;
        r.innerHTML = '<button class="sw" type="button"></button>'
          + '<span class="chi"></span>'
          + '<input class="vol" type="range" min="0" max="100" step="1">'
          + '<button class="tras" type="button" hidden title="Porta qui la coda '
          + 'che sta suonando">' + segno("trasferisci") + "</button>";
        r.querySelector(".sw").addEventListener("click", () => this._cambiaGruppo(eid, r));
        // porta la coda su un'altra cassa: e' un servizio di Music Assistant,
        // quindi si vede solo fra lettori di Music Assistant
        r.querySelector(".tras").addEventListener("click", (e) => {
          e.stopPropagation();
          if (!this._hass) return;
          // la coda la prendo da chi ce l'ha davvero: se questa casella e'
          // agganciata a un'altra, la sua e' vuota e il comando fallirebbe
          const suo = this._hass.states[padrone];
          this._hass.callService("music_assistant", "transfer_queue",
            { entity_id: eid, source_player: this._capoGruppo(suo),
              auto_play: true });
          // e da adesso seguo la cassa dove l'ho mandata
          this._scelto = eid;
          if (this._lettori().includes(eid)) this._ricordaScelto(eid);
          this._chiudiPannelli();
        });
        const vol = r.querySelector(".vol");
        const manda = () => {
          if (!this._hass) return;
          this._hass.callService("media_player", "volume_set",
            { entity_id: eid, volume_level: Number(vol.value) / 100 });
        };
        vol.addEventListener("input", () => {
          r._trascino = true;
          vol.style.setProperty("--riempito", vol.value + "%");
          clearTimeout(r._freno);
          r._freno = setTimeout(manda, 250);
        });
        ["pointerup", "touchend", "mouseup", "keyup"].forEach((ev) =>
          vol.addEventListener(ev, () => {
            if (!r._trascino) return;
            manda();
            setTimeout(() => { r._trascino = false; }, 900);
          }));
        vol.addEventListener("blur", () => { r._trascino = false; });
        box.appendChild(r);
      });
    }
    // in fondo, "svuota la coda": e' un comando di serie di Home Assistant
    // (clear_playlist), quindi vale per Music Assistant come per yTube
    let via = box.querySelector(".svuota-coda");
    const puoSvuotare = (Number(st.attributes.supported_features || 0) & 8192) > 0;
    if (puoSvuotare && !via) {
      via = document.createElement("button");
      via.className = "svuota-coda";
      via.type = "button";
      via.innerHTML = segno("svuota") + "<span>Svuota la coda</span>";
      via.addEventListener("click", (e) => {
        e.stopPropagation();
        if (!this._hass) return;
        this._hass.callService("media_player", "clear_playlist",
          { entity_id: this._config.entity });
        this._chiudiPannelli();
      });
      box.appendChild(via);
    }
    if (via) via.hidden = !puoSvuotare;
    Array.from(box.children).forEach((r) => {
      if (!r.dataset.eid) return;
      const eid = r.dataset.eid;
      const suo = stati[eid];
      const dentro = eid === padrone || membri.includes(eid);
      const spento = !suo || suo.state === "unavailable" || suo.state === "unknown";
      const altri = membri.filter((e) => e !== padrone);
      const nome = (suo && suo.attributes.friendly_name) || eid.split(".")[1];
      r.toggleAttribute("spento", spento);
      // chi comanda si legge: e' quello che tiene la coda, e quando non sono
      // io il mio interruttore serve a sfilarmi, non a sciogliere il gruppo
      const capoOra = this._capoGruppo(st);
      const inGruppo = membri.length > 1;
      r.toggleAttribute("comanda", inGruppo && eid === capoOra);
      r.toggleAttribute("fisso", eid === padrone && capoOra === padrone);
      const eti = [];
      if (eid === padrone) eti.push("questa");
      if (inGruppo && eid === capoOra) eti.push("comanda");
      if (spento && eid !== padrone) eti.push("non disponibile");
      r.querySelector(".chi").textContent = nome
        + (eti.length ? " \u2022 " + eti.join(" \u2022 ") : "");
      const tras = r.querySelector(".tras");
      // La freccia si vede solo se c'e' davvero qualcosa da portare: a coda
      // vuota Home Assistant risponde "The queue is empty" e sembra rotto.
      const inCoda = ["playing", "paused", "buffering"]
        .includes(String(st.state).toLowerCase());
      if (tras) tras.hidden = eid === padrone || spento || !inCoda
        || !this._daMusicAssistant(eid)
        || !this._daMusicAssistant(this._capoGruppo(st));
      const sw = r.querySelector(".sw");
      // finche' aspetto la risposta del lettore tengo la posizione chiesta
      let inAttesa = r._attesa !== undefined && Date.now() < r._attesaFino;
      if (inAttesa && r._attesa === dentro) {
        inAttesa = false;
        r._attesa = undefined;
        clearTimeout(r._sveglia);
      }
      r.toggleAttribute("attesa", inAttesa);
      sw.toggleAttribute("on", inAttesa ? r._attesa : dentro);
      // sulla propria riga: se comando io non c'e' niente da fare (la coda
      // e' qui, sciogliere il gruppo da qui non se lo aspetta nessuno); se
      // sono agganciato serve a sfilarmi
      const ioComando = capoOra === padrone;
      sw.disabled = spento || (eid === padrone && ioComando && !inAttesa);
      sw.title = spento ? "Altoparlante spento o non raggiungibile"
        : (eid === padrone
            ? (ioComando
                ? (altri.length ? "E' questa che comanda: spegni le altre casse"
                                : "E' la cassa che comanda il gruppo")
                : "Sfila questa cassa dal gruppo")
            : (dentro ? "Togli dal gruppo" : "Unisci al gruppo"));
      const vol = r.querySelector(".vol");
      vol.hidden = !dentro || !suo || suo.attributes.volume_level === undefined;
      if (!vol.hidden && !r._trascino) {
        const liv = Math.round(suo.attributes.volume_level * 100);
        vol.value = String(liv);
        vol.style.setProperty("--riempito", liv + "%");
      }
    });
  }

  _disegnaFonti(st) {
    const box = this._panFonti.querySelector(".p-corpo");
    const lista = Array.isArray(st.attributes.source_list) ? st.attributes.source_list : [];
    const firma = lista.join("|");
    if (box._firma !== firma) {
      box._firma = firma;
      box.innerHTML = "";
      lista.forEach((nome) => {
        const b = document.createElement("button");
        b.type = "button";
        b.textContent = nome;
        b.addEventListener("click", () => {
          if (!this._hass) return;
          this._hass.callService("media_player", "select_source",
            { entity_id: this._config.entity, source: nome });
        });
        box.appendChild(b);
      });
    }
    Array.from(box.children).forEach((b) =>
      b.toggleAttribute("scelto", b.textContent === st.attributes.source));
  }

  // --- scelta della cassa ---------------------------------------------
  _lettori() {
    const l = this._base ? this._base.lettori : null;
    if (Array.isArray(l)) return l.filter(Boolean);
    return l ? [l] : [];
  }

  _entitaAttiva() {
    const base = this._base || this._config;
    const stati = this._hass ? this._hass.states : {};
    let lista = this._lettori();
    // ATTENZIONE: solo le caselle della musica cercano la cassa che suona.
    // Senza questo controllo ogni casella (meteo, luci, sensori) diventa
    // il lettore appena una cassa attacca a suonare.
    const suaEntita = String(base.entity || "");
    if (!lista.length && suaEntita.indexOf("media_player.") !== 0) {
      return base.entity;
    }
    if (!lista.length) {
      // nessun elenco scelto da lui: guardo tutte le casse dell'impianto,
      // le stesse che vede nel riquadro del gruppo. Cosi' la card ritrova la
      // musica anche dopo aver ricaricato la pagina.
      lista = this._casseCandidate(base.entity);
      if (lista.length < 2) return base.entity;
    }
    const segui = base.segui_attivo !== false;
    const oraSuona = lista.filter((e) => stati[e] && stati[e].state === "playing");
    const prima = this._suonavano;
    this._suonavano = oraSuona;
    // due casse nello stesso gruppo stanno suonando la STESSA cosa
    const insieme = (a, b) => {
      if (!a || !b || a === b) return a === b;
      const g = stati[a] && stati[a].attributes.group_members;
      return Array.isArray(g) && g.indexOf(b) >= 0;
    };
    if (segui) {
      // al primo giro, e ogni volta che una cassa ATTACCA a suonare, la si segue;
      // per il resto comanda quello che ha toccato l'utente.
      // ATTENZIONE: una cassa che attacca perche' l'ho appena agganciata al
      // gruppo NON e' musica nuova - e' la stessa, su piu' casse. Se la
      // seguissi, la card salterebbe sulla cassa appena aggiunta e resterebbe
      // li' quando poi la tolgo: sembrerebbe che il lettore si sia spento.
      const nuovo = prima === undefined
        ? oraSuona[0]
        : oraSuona.find((e) => !prima.includes(e)
            && !insieme(e, this._scelto) && !insieme(e, base.entity));
      if (nuovo) {
        this._scelto = nuovo;
        // e me la segno: l'anteprima delle impostazioni e' una casella NUOVA
        // ogni volta, e l'unico modo che ha di sapere cosa stavo seguendo e'
        // trovarselo scritto qui. Senza, tornava alla cassa della
        // configurazione - ferma - e restava senza copertina e senza barra.
        this._ricordaScelto(nuovo);
      }
    }
    if (this._scelto && lista.includes(this._scelto)) {
      const suo = stati[this._scelto];
      const viva = suo && ["playing", "paused", "buffering", "on"]
        .includes(String(suo.state).toLowerCase());
      const casa = stati[base.entity];
      const casaViva = casa && String(casa.state).toLowerCase() === "playing";
      if (!viva) {
        // Music Assistant adesso, quando togli dal gruppo la cassa che
        // suonava, sposta la sessione sulle altre. Quindi se quella che
        // seguivo si e' fermata ma la musica c'e' ancora da un'altra parte,
        // seguo la musica invece di restare appiccicato a una cassa ferma.
        const altra = oraSuona.find((e) => e !== this._scelto);
        if (altra) {
          this._scelto = altra;
          this._ricordaScelto(altra);
          return altra;
        }
        if (casaViva) this._scelto = base.entity;
      }
      // se quella che seguo e' agganciata a un'altra, comanda chi tiene la
      // coda: la sessione sta li', e i comandi vanno dati a lui
      const g = suo && suo.attributes.group_members;
      if (Array.isArray(g) && g.length > 1 && g[0] !== this._scelto
        && stati[g[0]]) return g[0];
      return this._scelto;
    }
    return lista.find((e) => !!stati[e]) || lista[0] || base.entity;
  }

  // "Assistente Veranda", "Assistente Cucina" -> "Veranda", "Cucina":
  // tolgo le prime parole che hanno tutte in comune
  _nomiCasse(lista) {
    const stati = this._hass ? this._hass.states : {};
    const interi = lista.map((eid) => {
      const st = stati[eid];
      return String((st && st.attributes.friendly_name)
        || eid.split(".")[1] || eid).replace(/_/g, " ").trim();
    });
    const pezzi = interi.map((n) => n.split(/\s+/));
    let comuni = 0;
    while (pezzi.length > 1 && pezzi.every((p) => p.length > comuni + 1)
        && pezzi.every((p) => p[comuni].toLowerCase() === pezzi[0][comuni].toLowerCase())) {
      comuni += 1;
    }
    const corti = pezzi.map((p) => p.slice(comuni).join(" "));
    const fuori = {};
    lista.forEach((eid, i) => { fuori[eid] = corti[i] || interi[i]; });
    return fuori;
  }

  _chiaveMemoria() { return "casa-tile:cassa:" + this._lettori().join("|"); }

  _ricordaScelto(eid) {
    try { localStorage.setItem(this._chiaveMemoria(), eid); } catch (e) { /* niente */ }
  }

  _leggiScelto() {
    try { return localStorage.getItem(this._chiaveMemoria()); } catch (e) { return null; }
  }

  _disegnaLettori() {
    const lista = this._lettori();
    const mostra = lista.length > 1;
    this._lettoriBox.hidden = !mostra;
    if (!mostra) { this._lettoriBox.innerHTML = ""; this._firmaLettori = null; return; }
    const firma = lista.join("|");
    if (this._firmaLettori !== firma) {
      this._firmaLettori = firma;
      this._lettoriBox.innerHTML = "";
      lista.forEach((eid) => {
        const b = document.createElement("button");
        b.type = "button";
        b.dataset.eid = eid;
        b.innerHTML = '<span class="spia"></span><span class="chi"></span>';
        b.addEventListener("click", (e) => {
          e.stopPropagation();
          this._scelto = eid;
          this._ricordaScelto(eid);
          this._render();
        });
        this._lettoriBox.appendChild(b);
      });
    }
    const attiva = this._config.entity;
    const nomi = this._nomiCasse(lista);
    Array.from(this._lettoriBox.children).forEach((b) => {
      const st = this._hass ? this._hass.states[b.dataset.eid] : null;
      b.querySelector(".chi").textContent = nomi[b.dataset.eid] || b.dataset.eid;
      b.title = (st && st.attributes.friendly_name) || b.dataset.eid;
      b.toggleAttribute("scelto", b.dataset.eid === attiva);
      b.toggleAttribute("suona", !!st && st.state === "playing");
    });
  }

  _disegnaMeteo() {
    const eid = this._config.meteo_entita;
    // se la casella E' gia' quel meteo, l'angolino ripeterebbe le stesse cose
    if (eid && eid === this._config.entity) { this._meteo.hidden = true; return; }
    const st = (eid && this._hass) ? this._hass.states[eid] : null;
    if (!st) { this._meteo.hidden = true; return; }
    this._meteo.hidden = false;
    const t = st.attributes.temperature;
    const u = st.attributes.temperature_unit || "\u00B0C";
    const gradi = (t === undefined || t === null)
      ? "" : Math.round(t) + "<small>" + u + "</small>";
    if (this._gradi.dataset.gradi !== gradi) {
      this._gradi.dataset.gradi = gradi;
      this._gradi.innerHTML = gradi;
    }
    const voce = METEO[st.state] || ["\u2022", st.state];
    if (this._cond.dataset.voce !== st.state) {
      this._cond.dataset.voce = st.state;
      this._cond.innerHTML = "";
      const simbolo = document.createElement("span");
      simbolo.textContent = voce[0];
      const parola = document.createElement("span");
      parola.textContent = voce[1];
      this._cond.append(simbolo, parola);
    }
  }

  // il grafichino: chiedo la storia a Home Assistant e la disegno
  _disegnaAndamento(st) {
    const c = this._config;
    const box = this._andamento;
    if (!box) return;
    const numerico = !!st && !isNaN(parseFloat(st.state));
    const vuole = !!c.grafico && !!c.entity && (numerico || !!this._storia);
    // attenzione: su un <svg> la proprieta' .hidden non si riflette
    // sull'attributo, quindi va messo e tolto a mano
    box.toggleAttribute("hidden", !vuole);
    // col grafico dietro le scritte si confondono: lo dico al foglio di
    // stile, che gli mette un'ombra e un velo scuro sotto
    this.toggleAttribute("congrafico", vuole);
    if (!vuole || !this._hass) return;

    const ore = Number(c.grafico_ore) > 0 ? Number(c.grafico_ore) : 24;
    const chiave = c.entity + "|" + ore;
    const adesso = Date.now();
    // la storia si chiede una volta ogni cinque minuti, non a ogni disegno
    if (this._chiaveStoria !== chiave || !this._quandoStoria
        || adesso - this._quandoStoria > 300000) {
      this._chiaveStoria = chiave;
      this._quandoStoria = adesso;
      const da = new Date(adesso - ore * 3600000).toISOString();
      const a = new Date(adesso).toISOString();
      this._chiediStoria(c.entity, da, a);
    }
    this._disegnaLinea(st);
  }

  // due strade per lo storico: prima il websocket, poi l'indirizzo normale
  // (su certe installazioni la prima non risponde)
  // Lo storico di un sensore che cambia ogni secondo sono decine di
  // migliaia di punti: la casella se li teneva TUTTI in pancia e a ogni
  // disegno se li ricopiava per tirarci una linea da 120 punti. Erano i
  // gigabyte e i blocchi della pagina. Quindi appena arriva lo assottiglio
  // a trecento punti, tenendomi il piu' basso e il piu' alto (servono per
  // le scritte del minimo e del massimo) e sempre l'ultimo.
  _assottiglia(punti) {
    const max = 300;
    if (!punti || punti.length <= max) return punti;
    let basso = punti[0];
    let alto = punti[0];
    for (let i = 1; i < punti.length; i += 1) {
      if (punti[i].v < basso.v) basso = punti[i];
      if (punti[i].v > alto.v) alto = punti[i];
    }
    const passo = punti.length / (max - 3);
    const fuori = [];
    for (let i = 0; i < punti.length; i += passo) {
      fuori.push(punti[Math.floor(i)]);
    }
    const ultimo = punti[punti.length - 1];
    if (fuori[fuori.length - 1] !== ultimo) fuori.push(ultimo);
    if (fuori.indexOf(basso) < 0) fuori.push(basso);
    if (fuori.indexOf(alto) < 0) fuori.push(alto);
    fuori.sort((x, y) => x.t - y.t);
    return fuori;
  }

  async _chiediStoria(chi, da, a) {
    // la casellina del riquadro non chiede lo storico: e' li' solo per
    // farsi spostare i pezzi, non le serve il grafico vero
    if (this.hasAttribute("solo-casella")) return [];
    // di ogni lettura tengo il valore E il momento
    const numeri = (righe) => righe.map((r) => {
      const g = r || {};
      const v = parseFloat(g.s !== undefined ? g.s : g.state);
      let t = g.lu !== undefined ? g.lu * 1000
        : (g.last_updated || g.last_changed || null);
      if (typeof t === "string") t = Date.parse(t);
      return { v: v, t: Number(t) || 0 };
    }).filter((x) => !isNaN(x.v));

    try {
      const risposta = await this._hass.callWS({
        type: "history/history_during_period",
        start_time: da,
        end_time: a,
        entity_ids: [chi],
        minimal_response: true,
        no_attributes: true,
        significant_changes_only: false,
      });
      const righe = (risposta && risposta[chi]) || [];
      if (righe.length) {
        this._storia = this._assottiglia(numeri(righe));
        this._disegnaLinea();
        return;
      }
    } catch (e) { /* pazienza: ci provo con l'altra strada */ }

    try {
      const indirizzo = "history/period/" + encodeURIComponent(da)
        + "?filter_entity_id=" + encodeURIComponent(chi)
        + "&end_time=" + encodeURIComponent(a)
        + "&minimal_response&no_attributes";
      const risposta = await this._hass.callApi("GET", indirizzo);
      const righe = (Array.isArray(risposta) && risposta[0]) || [];
      this._storia = this._assottiglia(numeri(righe));
      this._disegnaLinea();
      if (!this._storia.length) this._niente("lo storico e vuoto");
      return;
    } catch (e) {
      this._storia = null;
      this._niente(e && e.message ? e.message : "storico non raggiungibile");
    }
  }

  _niente(perche) {
    if (this._andamento) {
      this._andamento.setAttribute("title",
        "Grafico: " + perche + " (entita: " + this._config.entity + ")");
    }
    if (!this._giaDetto) {
      this._giaDetto = true;
      console.warn("[casa-tile] grafico senza dati:", this._config.entity, perche);
    }
  }

  _disegnaLinea(st) {
    const box = this._andamento;
    if (!box) return;
    const storia = this._storia || [];
    const adesso = (st && !isNaN(parseFloat(st.state)))
      ? { v: parseFloat(st.state), t: Date.now() } : null;
    // niente copia dell'array: con lo storico lungo era il conto piu' caro
    // di tutto il disegno
    const punti = adesso ? storia.concat([adesso]) : storia;
    if (punti.length < 2) { box.toggleAttribute("hidden", true); return; }
    box.toggleAttribute("hidden", false);
    // ne bastano un centinaio: se sono di piu' li assottiglio
    const max = 120;
    const scelti = punti.length <= max ? punti
      : punti.filter((x, i) => i % Math.ceil(punti.length / max) === 0);
    const valori = scelti.map((x) => x.v);
    const basso = Math.min.apply(null, valori);
    const alto = Math.max.apply(null, valori);
    const campo = alto - basso || 1;
    const passo = 100 / (scelti.length - 1);
    const coord = scelti.map((x, i) =>
      [i * passo, 28 - ((x.v - basso) / campo) * 26]);
    // me li tengo da parte: servono al mirino
    this._disegnati = scelti;
    this._coord = coord;
    const riga = coord.map((xy, i) =>
      (i ? "L" : "M") + xy[0].toFixed(2) + " " + xy[1].toFixed(2)).join(" ");
    box.querySelector(".riga").setAttribute("d", riga);
    const pieno = box.querySelector(".pieno");
    pieno.setAttribute("d", riga + " L100 30 L0 30 Z");
    // area piena o solo la riga
    const soloRiga = this._config.grafico_stile === "linea";
    pieno.style.display = soloRiga ? "none" : "";

    // sulle temperature la riga cambia colore col valore
    const suoSt = this._hass ? this._hass.states[this._config.entity] : null;
    const aTemperatura = this._config.colore === "termometro"
      || (!!suoSt && suoSt.attributes.device_class === "temperature");
    if (this._scala) {
      if (aTemperatura) {
        const passi = 5;
        let dentro = "";
        for (let i = 0; i <= passi; i += 1) {
          const q = i / passi;
          const tinta = coloreTemperatura(basso + campo * q) || "currentColor";
          dentro += '<stop offset="' + (q * 100).toFixed(0) + '%" stop-color="'
            + tinta + '"></stop>';
        }
        if (this._scala.innerHTML !== dentro) this._scala.innerHTML = dentro;
        if (!this._scala.id) this._scala.id = "scala-" + Math.random().toString(36).slice(2, 8);
        box.querySelector(".riga").style.stroke = "url(#" + this._scala.id + ")";
      } else {
        this._scala.innerHTML = "";
        box.querySelector(".riga").style.stroke = "";
      }
    }
    box.title = "Ultime " + (Number(this._config.grafico_ore) > 0
      ? Number(this._config.grafico_ore) : 24) + " ore: da "
      + (Math.round(basso * 10) / 10) + " a " + (Math.round(alto * 10) / 10);
  }

  // il mirino segue il dito o il mouse sopra al grafico
  _muoviMirino(e) {
    if (this.hasAttribute("solo-casella")) return;
    if (this.hasAttribute("trascinabile")) return;
    if (!this._mirino || !this._andamento || this._andamento.hasAttribute("hidden")
        || !this._coord || !this._coord.length) return;
    const q = this._andamento.getBoundingClientRect();
    const x = e.clientX - q.left;
    // e ANCHE il su e giu': il grafico e' largo quanto la casella, quindi
    // guardando solo di lato "dentro al grafico" voleva dire dappertutto -
    // bastava passare su una misura e usciva il cartellino del grafico.
    // Sei punti di tolleranza sopra: la striscia e' alta trentotto e
    // mirarla al pixel non e' un piacere.
    const y = e.clientY - q.top;
    if (x < 0 || x > q.width || !q.width
      || y < -6 || y > q.height + 2) { this._nascondiMirino(); return; }
    const quota = (x / q.width) * 100;
    let vicino = 0;
    for (let i = 1; i < this._coord.length; i += 1) {
      if (Math.abs(this._coord[i][0] - quota)
          < Math.abs(this._coord[vicino][0] - quota)) vicino = i;
    }
    const punto = this._disegnati[vicino];
    const xy = this._coord[vicino];
    this._mirino.hidden = false;
    this._mirino.querySelector(".mira").style.left = xy[0] + "%";
    const palla = this._mirino.querySelector(".palla");
    palla.style.left = xy[0] + "%";
    palla.style.top = (xy[1] / 30 * 100) + "%";

    const u = this._hass && this._config.entity
      && this._hass.states[this._config.entity]
      ? (this._hass.states[this._config.entity].attributes.unit_of_measurement || "")
      : "";
    const quando = punto.t
      ? new Date(punto.t).toLocaleString("it-IT",
          { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })
      : "";
    this._cartellino.hidden = false;
    this._cartellino.style.left = Math.min(85, Math.max(15, xy[0])) + "%";
    this._cartellino.innerHTML = "<b>" + (Math.round(punto.v * 10) / 10)
      .toLocaleString("it-IT") + (u ? " " + u : "") + "</b>"
      + (quando ? "<span>" + quando + "</span>" : "");
  }

  _nascondiMirino() {
    if (this._mirino) this._mirino.hidden = true;
    if (this._cartellino) this._cartellino.hidden = true;
  }

  _disegnaChips() {
    const gia = this._viaUsata;
    const lista = (this._config.info_entita || [])
      .filter((eid) => eid !== gia)
      .slice(0, 6);
    if (!this._hass || !lista.length) {
      if (this._firmaChips !== "") { this._chips.innerHTML = ""; this._firmaChips = ""; }
      return;
    }
    const pezzi = [];
    lista.forEach((eid) => {
      const st = this._hass.states[eid];
      if (!st) return;
      if (st.state === "unavailable" || st.state === "unknown") return;
      const scritto = valoreScritto(st);
      const testo = scritto !== null
        ? scritto
        : (PAROLE[String(st.state).toLowerCase()] || st.state);
      pezzi.push({
        eid: eid, st: st, testo: String(testo).slice(0, 26),
        etichetta: this._nomeMisura(st, eid),
        tinta: Array.isArray((this._config.info_colori || {})[eid])
          ? daRgb(this._config.info_colori[eid]) : "",
        simbolo: this._simbolo(st, eid),
        mappa: this._eUnPosto(st, eid),
        nome: st.attributes.friendly_name || eid,
      });
    });
    // rifaccio le caselline solo se e' cambiato qualcosa: durante la musica
    // il disegno passa di qui una volta al secondo
    const firma = pezzi.map((m) =>
      [m.eid, m.testo, m.etichetta, m.simbolo, m.tinta, m.mappa ? 1 : 0].join("~")).join("|");
    if (firma === this._firmaChips) return;
    this._firmaChips = firma;

    this._chips.innerHTML = "";
    pezzi.forEach((m) => {
      const casella = document.createElement("div");
      casella.className = "metrica";
      casella.dataset.eid = m.eid;
      casella.tabIndex = 0;
      const mappa = m.mappa;
      casella.title = m.nome
        + (mappa ? " - tocca per aprire Google Maps" : " - tocca per i dettagli");
      casella.innerHTML =
        '<span class="simbolo"></span><span class="eti"></span><span class="num"></span>';
      casella.querySelector(".simbolo").textContent = m.simbolo;
      casella.querySelector(".num").textContent = m.testo;
      casella.querySelector(".eti").textContent = m.etichetta;
      if (m.etichetta) casella.classList.add("connome");
      // il colore suo, se gliel'ha dato lui
      if (m.tinta) {
        casella.style.setProperty("--tinta-mia", m.tinta);
        casella.classList.add("suacolore");
      }

      const apri = (e) => {
        e.stopPropagation();
        if (mappa) { this._apriMappaDi(m.st, m.eid); return; }
        this.dispatchEvent(new CustomEvent("hass-more-info", {
          detail: { entityId: m.eid }, bubbles: true, composed: true,
        }));
      };
      casella.addEventListener("click", apri);
      casella.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); apri(e); }
      });
      this._chips.appendChild(casella);
    });
  }

  _entitaIndirizzo() {
    const c = this._config;
    if (c.sottotitolo_entita) return c.sottotitolo_entita;
    if (c.disposizione !== "persona" || !this._hass) return null;
    const candidati = c.info_entita || [];
    const buono = candidati.find((eid) => {
      const id = eid.toLowerCase();
      if (!(id.includes("geocoded") || id.includes("location")
            || id.includes("indirizzo") || id.includes("address"))) return false;
      const st = this._hass.states[eid];
      return st && typeof st.state === "string" && st.state.length > 6
        && st.state !== "unknown" && st.state !== "unavailable";
    });
    return buono || null;
  }

  _eUnPosto(st, eid) {
    const id = eid.toLowerCase();
    if (id.includes("geocoded") || id.includes("location") || id.includes("indirizzo")) return true;
    if (eid.startsWith("device_tracker.")) return true;
    if (st.attributes && st.attributes.latitude !== undefined) return true;
    return false;
  }

  _apriMappaDi(st, eid) {
    let dove = null;
    if (st.attributes && st.attributes.latitude !== undefined
        && st.attributes.longitude !== undefined) {
      dove = st.attributes.latitude + "," + st.attributes.longitude;
    } else if (st.state && st.state.length > 4) {
      dove = st.state;
    }
    if (!dove) {
      this.dispatchEvent(new CustomEvent("hass-more-info", {
        detail: { entityId: eid }, bubbles: true, composed: true,
      }));
      return;
    }
    window.open("https://www.google.com/maps/search/?api=1&query="
      + encodeURIComponent(dove), "_blank", "noopener");
  }

  _regola(valore) {
    const c = this._config;
    if (!this._hass || !c.entity) return;
    // Quando lasci il cursore il browser manda DUE segnali (pointerup e
    // change): senza questo controllo l'apparecchio riceve due volte lo
    // stesso comando e fa due bip.
    const adesso = Date.now();
    const gia = this._giaMandato;
    if (gia && gia.valore === valore && adesso - gia.quando < 900) return;
    this._giaMandato = { valore: valore, quando: adesso };
    const dominio = c.entity.split(".")[0];
    if (dominio === "light") {
      this._hass.callService("light", "turn_on",
        { entity_id: c.entity, brightness_pct: valore });
    } else if (dominio === "fan") {
      this._hass.callService("fan", "set_percentage",
        { entity_id: c.entity, percentage: valore });
    } else if (dominio === "media_player") {
      this._hass.callService("media_player", "volume_set",
        { entity_id: c.entity, volume_level: valore / 100 });
    } else if (dominio === "number" || dominio === "input_number") {
      this._hass.callService(dominio, "set_value",
        { entity_id: c.entity, value: valore });
    } else if (dominio === "cover") {
      // una tapparella ci mette dei secondi ad arrivare: fino a quando non
      // e' arrivata mostro dove l'ho mandata, se no il numero tornerebbe
      // indietro all'ultima posizione e poi salterebbe avanti
      this._viaggia(valore);
      this._hass.callService("cover", "set_cover_position",
        { entity_id: c.entity, position: valore });
    }
  }

  // il numero grande (e la tapparella disegnata) seguono il cursore mentre
  // lo muovi, senza aspettare che l'apparecchio risponda
  _seguiIlDito(val) {
    const c = this._config;
    const dom = c.entity ? c.entity.split(".")[0] : "";
    if (dom !== "cover" || c.nascondi_valore) return;
    this._valore.textContent = Math.round(val) + " %";
    this._valore.classList.toggle("parola", false);
    if (this._svg && !this._svg.hidden) {
      tagliaTapparella(this._svg, val);
      if (this._svgFondo && !this._svgFondo.hasAttribute("hidden")) {
        tagliaTapparella(this._svgFondo, val);
      }
    }
  }

  _disegnaCursore(st) {
    const c = this._config;
    const dominio = c.entity ? c.entity.split(".")[0] : "";
    const buono = ["light", "fan", "media_player", "number", "input_number", "cover"]
      .includes(dominio);
    const mostra = !!c.mostra_cursore && buono && !!st;
    this._cursore.hidden = !mostra;
    // il numerino in fondo alla barra: spesso e' un doppione della
    // percentuale grande in mezzo alla casella
    this.toggleAttribute("senzaquanto", !!c.nascondi_quanto);
    if (!mostra) return;

    // i valori impostabili hanno i loro limiti e la loro unita'
    if (dominio === "number" || dominio === "input_number") {
      let min = Number(st.attributes.min !== undefined ? st.attributes.min : 0);
      let max = Number(st.attributes.max !== undefined ? st.attributes.max : 100);
      // se lui ha detto fin dove deve arrivare, comanda lui
      if (c.cursore_min !== undefined && c.cursore_min !== null && c.cursore_min !== "") {
        min = Math.max(min, Number(c.cursore_min));
      }
      if (c.cursore_max !== undefined && c.cursore_max !== null && c.cursore_max !== "") {
        max = Math.min(max, Number(c.cursore_max));
      }
      const passo = Number(st.attributes.step || 1);
      this._range.min = String(min);
      this._range.max = String(max);
      this._range.step = String(passo);
      const ora = Number(st.state);
      if (!this._trascino && !isNaN(ora)) {
        this._range.value = String(ora);
        const u = st.attributes.unit_of_measurement || "";
        this._quanto.textContent = (Math.round(ora * 10) / 10) + (u ? " " + u : "");
        const quota = max > min ? ((ora - min) / (max - min)) * 100 : 0;
        this._range.style.setProperty("--riempito", quota.toFixed(1) + "%");
      }
      return;
    }
    this._range.min = "0";
    this._range.max = "100";
    this._range.step = "1";

    // il tasto del muto sta accanto al volume, solo per la musica
    const puoMuto = dominio === "media_player"
      && (!st.attributes.supported_features
          || (Number(st.attributes.supported_features) & 8));
    this._muto.hidden = !puoMuto;
    if (puoMuto) {
      const zitto = !!st.attributes.is_volume_muted;
      this._muto.toggleAttribute("zitto", zitto);
      metti(this._muto, zitto ? "muto" : "volume");
      this._muto.title = zitto ? "Riattiva l'audio" : "Silenzia";
    }

    let valore = 0;
    if (dominio === "cover") {
      if (st.attributes.current_position === undefined) {
        this._cursore.hidden = true;
        return;
      }
      // anche il cursore resta dove l'ho messo finche' non e' arrivata
      const dove = this._posizioneMostrata(st);
      if (!this._trascino && dove !== null) {
        this._range.value = String(Math.round(dove));
        this._quanto.textContent = Math.round(dove) + "%";
        this._range.style.setProperty("--riempito", Math.round(dove) + "%");
      }
      return;
    }
    if (dominio === "light") {
      valore = st.attributes.brightness ? Math.round(st.attributes.brightness / 2.55) : 0;
    } else if (dominio === "fan") {
      valore = Math.round(st.attributes.percentage || 0);
    } else {
      valore = Math.round((st.attributes.volume_level || 0) * 100);
    }
    if (!this._trascino) {
      this._range.value = String(valore);
      this._quanto.textContent = valore + "%";
      this._range.style.setProperty("--riempito", valore + "%");
    }
  }

  // quanto e' carica e se sta caricando: lo chiedo all'entita' e a quelle
  // che le stanno intorno (batteria dello stesso dispositivo, stato, presa)
  // quanto far vedere: mentre trascini vale il cursore, se no l'apparecchio.
  // Cosi' un aggiornamento che arriva a meta' trascinamento non ti riporta
  // indietro il numero sotto le dita.
  // Quando le dico di andare da 13 a 50, lei ci mette dei secondi e Home
  // Assistant intanto continua a dire 13. Allora me lo conto io: parto da
  // dove sta, vado verso dove le ho detto, e disegno il pezzo di strada
  // fatto. La velocita' me la imparo guardando quanto ci mette davvero.
  _viaggia(dove) {
    const st = this._hass ? this._hass.states[this._config.entity] : null;
    const da = this._quantoAperta(st);
    if (da === null) return;
    this._meta = { da: da, dove: dove, quando: Date.now() };
    // il comando e' partito: da qui in poi comanda il viaggio, non il dito
    // (se no per un attimo si vedrebbe gia' arrivata)
    this._trascino = false;
    this._fermaOrologioTappa();
    // il disegno riparte da dove sta davvero, non da dove arrivera'
    tagliaTapparella(this._svg, da);
    if (this._svgFondo && !this._svgFondo.hasAttribute("hidden")) {
      tagliaTapparella(this._svgFondo, da);
    }
    if (Math.abs(dove - da) < 1) { this._meta = null; return; }
    // ridisegno spesso, se no il movimento va a scatti
    // si muove solo il disegno: il numero e il cursore restano dove li ha
    // messi lui, se no sembrano impazziti
    const passo = () => {
      if (!this.isConnected || !this._meta) { this._fermaOrologioTappa(); return; }
      const st2 = this._hass ? this._hass.states[this._config.entity] : null;
      const dove2 = this._posizioneDisegno(st2);
      tagliaTapparella(this._svg, dove2);
      if (this._svgFondo && !this._svgFondo.hasAttribute("hidden")) {
        tagliaTapparella(this._svgFondo, dove2);
      }
      this._passoId = requestAnimationFrame(passo);
    };
    this._passoId = requestAnimationFrame(passo);
    // rete di sicurezza: se il disegno non arriva (scheda nascosta) il
    // viaggio deve finire lo stesso
    this._tappaId = setInterval(() => {
      if (!this.isConnected || !this._meta) { this._fermaOrologioTappa(); return; }
      this._render();
    }, 1000);
  }

  _fermaOrologioTappa() {
    if (this._tappaId) { clearInterval(this._tappaId); this._tappaId = null; }
    if (this._passoId) { cancelAnimationFrame(this._passoId); this._passoId = null; }
  }

  // quanto ci mette per ogni punto percentuale: di serie un quarto di
  // secondo (venticinque secondi per tutta la corsa), poi impara
  _secondiPerPunto() {
    const eid = this._config.entity || "";
    return VELOCITA_TAPPARELLE[eid] || 0.25;
  }

  _imparaVelocita() {
    const m = this._meta;
    if (!m || !m.quando) return;
    const punti = Math.abs(m.dove - m.da);
    if (punti < 15) return;   // troppo corto per fidarsi
    const secondi = (Date.now() - m.quando) / 1000;
    const ognuno = secondi / punti;
    if (ognuno < 0.02 || ognuno > 3) return;   // roba strana, lascio stare
    const eid = this._config.entity || "";
    const prima = VELOCITA_TAPPARELLE[eid];
    // media con quello che sapevo gia', cosi' non balla a ogni corsa
    VELOCITA_TAPPARELLE[eid] = prima ? (prima * 2 + ognuno) / 3 : ognuno;
  }

  _fermaViaggio(imparato) {
    if (imparato) this._imparaVelocita();
    this._meta = null;
    this._fermaOrologioTappa();
  }

  _posizioneMostrata(st) {
    const suo = this._config.entity && this._config.entity.split(".")[0] === "cover";
    if (this._trascino && this._range && this._cursore && !this._cursore.hidden && suo) {
      const v = Number(this._range.value);
      if (!isNaN(v)) return Math.max(0, Math.min(100, v));
    }
    const vera = this._quantoAperta(st);
    // sto ancora andando dove le ho detto io? Allora il numero e il cursore
    // dicono gia' dove arrivera': quello e' il valore che ha scelto lui
    const m = this._meta;
    if (suo && m) {
      const arrivata = vera !== null && Math.abs(vera - m.dove) <= 2;
      const scaduta = Date.now() - m.quando > 180000;
      if (arrivata) { this._fermaViaggio(true); return vera; }
      if (scaduta) { this._fermaViaggio(false); return vera; }
      return m.dove;
    }
    return vera;
  }

  // dove sta il disegno mentre viaggia: questa e' l'unica cosa che si muove
  _posizioneDisegno(st) {
    const m = this._meta;
    const vera = this._quantoAperta(st);
    if (!m) return this._posizioneMostrata(st);
    const punti = Math.abs(m.dove - m.da) || 1;
    const quanto = (Date.now() - m.quando) / 1000 / this._secondiPerPunto();
    let mia = m.da + (m.dove > m.da ? 1 : -1) * Math.min(quanto, punti);
    // se l'apparecchio dice di essere piu' avanti, gli credo
    if (vera !== null) {
      const avanti = m.dove > m.da ? Math.max(mia, vera) : Math.min(mia, vera);
      if (m.dove > m.da ? avanti <= m.dove : avanti >= m.dove) mia = avanti;
    }
    return Math.max(0, Math.min(100, mia));
  }

  // quanto e' aperta una tapparella: null se non lo sa dire
  _quantoAperta(st) {
    const c = this._config;
    if (!st || !c.entity || c.entity.split(".")[0] !== "cover") return null;
    const dove = st.attributes.current_position;
    if (dove === undefined || dove === null) return null;
    const n = Number(dove);
    return isNaN(n) ? null : Math.max(0, Math.min(100, n));
  }

  _datiBatteria(st) {
    const c = this._config;
    const stati = this._hass ? this._hass.states : {};
    let perc = NaN;
    if (st) {
      const n = parseFloat(st.state);
      const u = st.attributes.unit_of_measurement;
      if (!isNaN(n) && (u === "%" || /batter|livello|level|soc/i.test(c.entity || ""))) {
        perc = n;
      } else if (st.attributes.battery_level !== undefined) {
        perc = parseFloat(st.attributes.battery_level);
      }
    }

    const dice = (valore) => {
      const t = String(valore === true ? "charging" : (valore || "")).toLowerCase();
      if (!t) return false;
      if (["not_charging", "discharging", "non in carica", "scarica", "none",
           "off", "unplugged"].some((x) => t.indexOf(x) >= 0)) return false;
      return ["charging", "in carica", "carica", "ac", "usb", "wireless",
              "plugged", "on", "full"].some((x) => t.indexOf(x) >= 0);
    };

    let carica = false;
    if (st) {
      const a = st.attributes;
      if (a.is_charging === true || a.charging === true) carica = true;
      if (!carica && (a.battery_state || a.charger_type)) {
        carica = dice(a.battery_state || a.charger_type);
      }
    }
    // entita' vicine: stesso nome con un'altra coda
    if (!carica && c.entity) {
      const radice = String(c.entity).replace(
        /_(battery_level|battery|livello_batteria|soc|charge)$/, "");
      const code = ["_battery_state", "_stato_della_batteria", "_is_charging",
                    "_charging", "_battery_charging", "_charger_type", "_in_carica"];
      code.forEach((coda) => {
        if (carica) return;
        ["sensor", "binary_sensor"].forEach((dom) => {
          const eid = radice.replace(/^[a-z_]+\./, dom + ".") + coda;
          const alt = stati[eid];
          if (alt && dice(alt.state)) carica = true;
        });
      });
    }
    // e le misure che ha aggiunto lui alla casella
    if (!carica && Array.isArray(c.info_entita)) {
      c.info_entita.forEach((eid) => {
        const alt = stati[eid];
        if (!alt) return;
        const dc = alt.attributes.device_class || "";
        if (dc === "battery_charging" && alt.state === "on") carica = true;
        if (/charg|carica/i.test(eid) && dice(alt.state)) carica = true;
        // anche se il NOME non parla di carica, il suo stato puo' dirlo
        // ("In carica", "Charging"): qui pero' solo parole esplicite
        const t = String(alt.state).toLowerCase();
        if (t.indexOf("scarica") < 0 && t.indexOf("non in carica") < 0
            && (t.indexOf("in carica") >= 0 || t.indexOf("charging") >= 0
                || t.indexOf("plugged") >= 0)) {
          carica = true;
        }
      });
    }
    let scarica = false;

    // Prima di tutto: se lui ha detto quali entita' vogliono dire "sta
    // caricando" e "sta scaricando", comandano quelle e basta. Serve
    // perche' su certe centraline i watt che escono vengono dai pannelli,
    // non dalla batteria: dal nome non si capisce, lo sa solo lui.
    const attiva = (eid) => {
      const alt = stati[eid];
      if (!alt) return false;
      const n2 = parseFloat(alt.state);
      if (!isNaN(n2)) return n2 > 0;
      const t = String(alt.state).toLowerCase();
      if (["off", "unavailable", "unknown", "idle", "standby"].includes(t)) return false;
      return t === "on" || t.indexOf("charg") >= 0 || t.indexOf("carica") >= 0;
    };
    const elenco = (x) => (Array.isArray(x) ? x : (x ? [x] : []));
    const suoiCarica = elenco(c.carica_entita);
    const suoiScarica = elenco(c.scarica_entita);
    if (suoiCarica.length || suoiScarica.length) {
      carica = suoiCarica.some(attiva);
      scarica = !carica && suoiScarica.some(attiva);
      // se nessuna di quelle sta lavorando non mi fermo qui: provo lo
      // stesso a capirlo da solo, se no la casella resta muta
      if (carica || scarica) return { perc: perc, carica: carica, scarica: scarica };
    }

    // Se non me l'ha detto, provo a capirlo: un sensore di potenza che nel
    // nome parla di carica (o di scarica) e segna piu' di zero dice cosa
    // sta facendo la batteria. "Uscita" no: quella puo' venire dal sole.
    const guarda = (eid) => {
      const alt = stati[eid];
      if (!alt || String(alt.attributes.device_class || "") !== "power") return;
      // me la segno: e' una che devo tenere d'occhio anche in futuro
      if (!this._lette) this._lette = new Set();
      this._lette.add(eid);
      const n2 = parseFloat(alt.state);
      if (isNaN(n2) || n2 <= 0) return;
      // il nome che gli ha dato LUI sulla caselletta vale piu' di tutto:
      // se ha scritto "carica" su una misura, quella e' la carica, anche
      // se l'entita' si chiama "PV Input Power"
      const suo = String((c.info_nomi || {})[eid] || "").toLowerCase();
      if (suo) {
        if (/scaric|discharg/.test(suo)) { scarica = true; return; }
        if (/caric|charg/.test(suo)) { carica = true; return; }
      }
      const chi = (eid + " " + (alt.attributes.friendly_name || "")).toLowerCase();
      if (/discharg|scaric/.test(chi)) scarica = true;
      else if (/charg|carica/.test(chi)) carica = true;
    };
    // certi apparecchi hanno un sensore che lo dice a parole: "In carica",
    // "In scarica", "Charging". Vale piu' di qualsiasi indovinello sui watt.
    const aParole = (eid) => {
      const alt = stati[eid];
      if (!alt) return;
      const t = String(alt.state).toLowerCase();
      if (t.indexOf("in scarica") >= 0 || t.indexOf("discharging") >= 0) scarica = true;
      else if (t.indexOf("in carica") >= 0
               || (t.indexOf("charging") >= 0 && t.indexOf("not") < 0)) carica = true;
    };
    (Array.isArray(c.info_entita) ? c.info_entita : []).forEach(aParole);
    (Array.isArray(c.info_entita) ? c.info_entita : []).forEach(guarda);
    (Array.isArray(c.acceso_entita) ? c.acceso_entita : []).forEach(guarda);
    // le vicine: stesso inizio di nome, dal piu' preciso al piu' largo
    if (c.entity) {
      // l'elenco delle vicine si fa una volta sola: rifrugare fra tutte le
      // entita' della casa a ogni disegno costava carissimo
      if (PARENTI[c.entity] === undefined) {
        const trovate = [];
        const pezzi = String(c.entity).split(".")[1].split("_");
        for (let i = pezzi.length - 1; i >= 1 && !trovate.length; i -= 1) {
          const radice2 = pezzi.slice(0, i).join("_");
          if (radice2.length < 2) break;
          const inizio = "sensor." + radice2 + "_";
          Object.keys(stati).forEach((eid) => {
            if (eid.indexOf(inizio) !== 0) return;
            const alt = stati[eid];
            if (!alt || String(alt.attributes.device_class || "") !== "power") return;
            const chi = (eid + " " + (alt.attributes.friendly_name || "")).toLowerCase();
            if (/charg|caric|scaric/.test(chi)) trovate.push(eid);
          });
        }
        PARENTI[c.entity] = trovate;
      }
      PARENTI[c.entity].forEach(guarda);
    }
    // in carica vince: se la batteria sta prendendo corrente, quella che
    // esce dalla presa la stanno dando i pannelli, non lei
    if (carica) scarica = false;
    return { perc: perc, carica: carica, scarica: scarica };
  }

  // per il meteo l'icona segue il tempo che fa
  _nomeIcona(st) {
    const c = this._config;
    const dominio = c.entity ? c.entity.split(".")[0] : "";
    // il meteo comanda sempre lui
    if (dominio === "weather" && st && ICONA_METEO[st.state]) {
      return ICONA_METEO[st.state];
    }
    // nessuna scelta = la sceglie la card guardando l'entita'
    if (!c.icona || c.icona === "auto") {
      return c.entity ? iconaAutomatica(c.entity, st) : "luce";
    }
    return c.icona;
  }

  _valoreDi(st) {
    const c = this._config;
    if (!st) return this._ultimoBuono || "—";
    // i sensori via Bluetooth spariscono ogni tanto: invece di scrivere
    // "Assente" tengo l'ultimo valore che avevano
    if (["unavailable", "unknown"].includes(String(st.state).toLowerCase())
        && this._ultimoBuono) {
      return this._ultimoBuono;
    }
    const dominio = c.entity.split(".")[0];
    if (dominio === "weather") {
      const t = st.attributes.temperature;
      if (t !== undefined && t !== null) {
        const u = st.attributes.temperature_unit || "°C";
        return Math.round(t) + " " + u;
      }
      return (METEO[st.state] || [null, st.state])[1];
    }
    if (dominio === "light") {
      if (st.state !== "on") return "Spento";
      const b = st.attributes.brightness;
      return b ? Math.round(b / 2.55) + "%" : "Acceso";
    }
    if (dominio === "climate") {
      const t = st.attributes.current_temperature;
      return t !== undefined ? Math.round(t * 10) / 10 + "°" : st.state;
    }
    if (dominio === "cover") {
      const dove = this._posizioneMostrata(st);
      if (dove !== null) return Math.round(dove) + " %";
    }
    const scritto = valoreScritto(st);
    if (scritto !== null) return scritto;
    return PAROLE[String(st.state).toLowerCase()] || st.state;
  }

  _accesoSuValore(st) {
    const atteso = this._config.acceso_se;
    if (atteso === undefined || atteso === null || atteso === "") return null;
    if (!st) return false;
    const a = String(st.state).trim();
    const b = String(atteso).trim();
    if (a === b) return true;
    const na = Number(a);
    const nb = Number(b);
    return !isNaN(na) && !isNaN(nb) && na === nb;
  }

  // chi decide se la casella e' accesa: di solito la sua entita', ma si puo'
  // dire "guarda queste altre". Serve per esempio a una batteria: la carica
  // (93%) non dice niente, quello che conta e' se stanno uscendo watt - e i
  // watt possono passare da piu' sensori (scarica, uscita verso casa...),
  // quindi ne accetto quanti ne vuole: basta che ne "lavori" uno.
  _riferimenti(st) {
    const chi = this._config.acceso_entita;
    const elenco = (Array.isArray(chi) ? chi : [chi]).filter(Boolean);
    if (!elenco.length || !this._hass) {
      return [{ eid: this._config.entity, st: st }];
    }
    return elenco.map((eid) => ({ eid: eid, st: this._hass.states[eid] || null }));
  }

  _acceso(st) {
    return this._riferimenti(st).some((rif) => {
      const suValore = this._accesoSuValore(rif.st);
      if (suValore !== null) return suValore;
      return this._accesoNormale(rif.st, rif.eid);
    });
  }

  _accesoNormale(st, quale) {
    const c = this._config;
    const eid = quale || c.entity;
    // senza entita' la casella e' un pulsante: sempre a colori, ferma
    if (!eid) return c.acceso_sempre !== false;
    if (!st) return false;
    if (c.acceso_sempre) return true;
    const n = parseFloat(st.state);
    if (!isNaN(n) && st.state.trim() !== "" && !["light", "switch", "fan"].includes(eid.split(".")[0])) {
      return n > (c.soglia !== undefined && c.soglia !== null ? Number(c.soglia) : 0);
    }
    // un termosifone (o un condizionatore) e' "acceso" quando sta lavorando
    // davvero: se la stanza e' gia' calda l'apparecchio e' fermo, e la
    // casella deve stare grigia anche se il modo e' "riscaldamento"
    if (eid.split(".")[0] === "climate") {
      const modi = st.attributes.hvac_modes || [];
      const cosaFa = st.attributes.hvac_action;
      // certi termostati non hanno il modo "spento" (il termo del bagno ha
      // solo "riscaldamento"): li' l'unica cosa che cambia e' se sta
      // scaldando o no, altrimenti la casella resterebbe accesa per sempre
      if (modi.length && !modi.includes("off") && cosaFa) {
        return !["idle", "off"].includes(String(cosaFa).toLowerCase());
      }
      return String(st.state).toLowerCase() !== "off";
    }

    // la musica in pausa e' comunque accesa: il brano c'e' ancora, quindi
    // bordo, alone ed effetti devono restare. Spenta solo se e' davvero
    // spenta, ferma o non raggiungibile.
    if (eid.split(".")[0] === "media_player") {
      return ["playing", "paused", "buffering", "on"]
        .includes(String(st.state).toLowerCase());
    }
    return !SPENTI.includes(String(st.state).toLowerCase());
  }

  _render() {
    if (!this._config) return;
    // conto quante volte si ridisegna: se qualcosa gira a vuoto si vede
    // subito dal conto sulla targhetta
    const adessoR = Date.now();
    if (adessoR - (this._daQuandoR || 0) > 250) {
      this._daQuandoR = adessoR;
      this._quantiR = 0;
    }
    this._quantiR = (this._quantiR || 0) + 1;
    // PARACADUTE: nessuno ha bisogno di ridisegnarsi cento volte in un
    // quarto di secondo. Oltre le trenta volte metto il disegno in coda e
    // ne faccio uno solo: chi gira a vuoto smette di bruciare la macchina
    // (l'occhio non se ne accorge, sono sessanta disegni al secondo).
    if (this._quantiR > 40) {
      if (!this._disegnoDopo) {
        this._disegnoDopo = setTimeout(() => {
          this._disegnoDopo = 0;
          this._quantiR = 0;
          this._daQuandoR = 0;
          if (this.isConnected) this._render();
        }, 250);
      }
      return;
    }
    if (!this._costruito) this._costruisci();
    // se ci sono piu' casse, la card lavora su quella scelta / che suona
    if (this._base) {
      const attiva = this._entitaAttiva();
      this._config = attiva === this._base.entity
        ? this._base : { ...this._base, entity: attiva };
    }
    const c = this._config;
    const st = this._hass ? this._hass.states[c.entity] : null;
    const acceso = this._acceso(st);

    const dominioTinta = (c.entity || "").split(".")[0];
    let col = COLORI[c.colore] || COLORI.ambra;
    if (c.colore === "personalizzato" && Array.isArray(c.colore_rgb)) {
      col = daRgb(c.colore_rgb) || col;
    }
    if (c.colore === "termometro") {
      const quanto = st
        ? (st.attributes.current_temperature !== undefined
            ? st.attributes.current_temperature
            : (st.attributes.temperature !== undefined && dominioTinta === "weather"
                ? st.attributes.temperature : st.state))
        : null;
      col = coloreTemperatura(quanto) || col;
    }
    if (c.colore === "luce") {
      // il colore vero della lampada, se ce l'ha acceso
      const rgb = st && (st.attributes.rgb_color || st.attributes.rgbw_color);
      if (Array.isArray(rgb) && rgb.length >= 3) {
        col = daRgb(coloreLampada([rgb[0], rgb[1], rgb[2]])) || col;
      } else if (st && st.attributes.color_temp_kelvin) {
        // bianco caldo/freddo: lo avvicino a un colore
        const k = Number(st.attributes.color_temp_kelvin);
        col = k < 3200 ? "#ffbe63" : (k < 4500 ? "#ffe0b0" : "#dcecff");
      } else {
        col = COLORI.ambra;
      }
    }

    // lo sfondo del riquadro delle casse/sorgenti, se l'ha scelto lui
    const panTinta = Array.isArray(c.pannello_sfondo) ? daRgb(c.pannello_sfondo) : null;
    const panOpaco = 1 - (c.pannello_trasparenza === undefined
      ? 0 : Number(c.pannello_trasparenza)) / 100;
    if (panTinta || panOpaco < 1) {
      const alto = panTinta || "#141d2b";
      const basso = panTinta ? scurisci(panTinta, 0.62) : "#0a1019";
      this.style.setProperty("--pan-bg", "linear-gradient(160deg, "
        + conAlfa(alto, panOpaco) + " 0%, " + conAlfa(basso, panOpaco) + " 100%)");
    } else {
      this.style.removeProperty("--pan-bg");
    }

    // I riquadri lunghi (ricerca, sfoglia, coda) hanno una trasparenza loro,
    // che parte da ZERO: sono elenchi da leggere, e con il lettore che si
    // vede attraverso le righe non si capisce niente. Ma la manopola c'e',
    // se lui la vuole trasparente la fa trasparente.
    const listaOpaco = 1 - (c.riquadri_trasparenza === undefined
      ? 0 : Number(c.riquadri_trasparenza)) / 100;
    const listaAlto = panTinta || "#111926";
    const listaBasso = panTinta ? scurisci(panTinta, 0.62) : "#0a0f17";
    this.style.setProperty("--lista-bg", "linear-gradient(160deg, "
      + conAlfa(listaAlto, listaOpaco) + " 0%, "
      + conAlfa(listaBasso, listaOpaco) + " 100%)");

    // il vestito del pop-up: tinta, foto e trasparenza della finestra, e
    // i colori che passano alle schede di Home Assistant che stanno dentro
    this._vestiFinestra();
    this._mettiAPosto();
    // Le misure e l'icona nascono piu' avanti nel disegno: qui non ci sono
    // ancora, e restavano ammucchiate in alto a sinistra sopra al nome
    // finche' non si rifaceva la casella. Ci ripasso appena finito il giro,
    // prima che il browser dipinga: cosi' non si vede nessun saltello.
    if (!this._ripassoPosti) {
      this._ripassoPosti = true;
      Promise.resolve().then(() => {
        this._ripassoPosti = false;
        if (this._config && this._costruito) this._mettiAPosto();
      });
    }

    // la scritta puo' avere un colore suo, staccato da quello degli effetti
    const scritta = Array.isArray(c.colore_testo) ? daRgb(c.colore_testo) : null;
    if (scritta) {
      this.style.setProperty("--testo", scritta);
      this.style.setProperty("--testo2", conAlfa(scritta, 0.72));
    } else {
      this.style.removeProperty("--testo");
      this.style.removeProperty("--testo2");
    }
    // e il numero grande puo' averne uno tutto suo, diverso dal nome
    const numero = Array.isArray(c.colore_valore) ? daRgb(c.colore_valore) : null;
    if (numero) this.style.setProperty("--testo-val", numero);
    else this.style.removeProperty("--testo-val");

    // sfondo della casella: tinta, foto o quello di serie, con trasparenza
    const opaco = 1 - (c.trasparenza === undefined ? 0 : Number(c.trasparenza)) / 100;
    const tinta = Array.isArray(c.sfondo_colore) ? daRgb(c.sfondo_colore) : null;
    let fondo = tinta
      ? "linear-gradient(160deg, " + conAlfa(tinta, opaco) + ", "
        + conAlfa(tinta, Math.max(0, opaco - 0.25)) + ")"
      : "linear-gradient(160deg, " + conAlfa("#111a27", opaco) + " 0%, "
        + conAlfa("#0d1420", opaco) + " 100%)";
    // se la casella e' gia' un meteo, il cielo lo prende da se stessa
    const suoDominio = c.entity ? c.entity.split(".")[0] : "";
    const meteoSt = (c.meteo_entita && this._hass)
      ? this._hass.states[c.meteo_entita]
      : (suoDominio === "weather" ? st : null);
    const cieloVoluto = c.sfondo_meteo === undefined
      ? suoDominio === "weather" : !!c.sfondo_meteo;
    const conCielo = cieloVoluto && !!meteoSt && !c.sfondo_immagine;
    if (conCielo) {
      const cielo = CIELI[meteoSt.state] || CIELI.cloudy;
      const velo = (c.sfondo_velo === undefined ? 18 : Number(c.sfondo_velo)) / 100;
      fondo = "linear-gradient(rgba(6,9,14," + (velo * 0.5) + "), rgba(6,9,14,"
        + (velo + 0.12) + ")), " + cielo[0];
    }
    const suaFoto0 = indirizzoFoto(c.sfondo_immagine);
    if (suaFoto0) {
      const velo = (c.sfondo_velo === undefined ? 45 : Number(c.sfondo_velo)) / 100;
      // come si adatta: riempie tagliando, ci sta tutta, o grandezza vera
      const adatta = c.sfondo_adatta === "intera" ? "center/contain"
        : (c.sfondo_adatta === "vera" ? "center/auto" : "center/cover");
      fondo = "linear-gradient(rgba(6,9,14," + velo + "), rgba(6,9,14," + velo + ")), "
        + 'url("' + suaFoto0 + '") ' + adatta + ' no-repeat';
    }
    // la telecamera a tutta casella: l'immagine si rifa' da sola, cosi' e'
    // una diretta e non lo scatto di quando hai aperto la pagina
    const diretta = this._immagineDiretta(st);
    if (diretta) {
      const velo = (c.sfondo_velo === undefined ? 28 : Number(c.sfondo_velo)) / 100;
      const adatta = c.sfondo_adatta === "intera" ? "center/contain"
        : (c.sfondo_adatta === "vera" ? "center/auto" : "center/cover");
      fondo = "linear-gradient(rgba(6,9,14," + (velo * 0.5).toFixed(2)
        + "), rgba(6,9,14," + Math.min(0.92, velo + 0.14).toFixed(2) + ")), "
        + 'url("' + diretta + '") ' + adatta + ' no-repeat';
    }
    const forza = (c.meteo_forza === undefined || c.meteo_forza === null
      ? 92 : Number(c.meteo_forza)) / 100;
    this.style.setProperty("--forza-cielo", String(forza));
    this._disegnaCielo(conCielo && forza > 0
      ? (CIELI[meteoSt.state] || CIELI.cloudy)[1] : null);
    this.style.setProperty("--card-bg", fondo);
    this.toggleAttribute("sfondo-foto", !!c.sfondo_immagine || !!diretta);
    this.toggleAttribute("diretta", !!diretta);
    const vel = (c.velocita === undefined || c.velocita === null ? 100 : Number(c.velocita)) / 100;
    this.style.setProperty("--vel", String(Math.max(0.1, vel)));
    const k = (c.intensita === undefined || c.intensita === null
      ? 60 : Number(c.intensita)) / 100;
    this.style.setProperty("--c", col);
    this.style.setProperty("--bordo", conAlfa(col, 0.22 + 0.66 * k));
    this.style.setProperty("--alone1", conAlfa(col, 0.06 + 0.30 * k));
    this.style.setProperty("--alone2", conAlfa(col, 0.06 + 0.38 * k));
    this.style.setProperty("--velo", conAlfa(col, 0.05 + 0.38 * k));
    // anche il grafico puo' avere il suo colore: prima si tingeva per forza
    // come la casella, e su una batteria che sta sul verde si vedeva poco
    const suoGrafico = Array.isArray(c.grafico_colore) ? daRgb(c.grafico_colore) : null;
    if (suoGrafico) {
      this.style.setProperty("--c-grafico", suoGrafico);
      this.style.setProperty("--velo-grafico", conAlfa(suoGrafico, 0.05 + 0.38 * k));
    } else {
      this.style.removeProperty("--c-grafico");
      this.style.removeProperty("--velo-grafico");
    }
    this.setAttribute("effetto", c.effetto || "alone");
    this.toggleAttribute("acceso", acceso);
    const quando = c.anima || (c.entity ? "attiva" : "mai");
    this.toggleAttribute("anima",
      quando === "sempre" ? true : quando === "mai" ? false : acceso);
    this.toggleAttribute("grande", !!c.grande);
    // termosifoni e condizionatori: acceso e' una cosa, stare lavorando
    // un'altra. Da fermo la casella resta sobria.
    const cosaFa = st && st.attributes ? st.attributes.hvac_action : null;
    this.toggleAttribute("fermo", !!cosaFa
      && ["idle", "off"].includes(String(cosaFa).toLowerCase()));
    // la copertina tonda gira solo se lo vuole (di serie si')
    this.toggleAttribute("gira", c.gira_copertina !== false);

    this._nome.textContent =
      c.name || (st ? st.attributes.friendly_name : c.entity) || "Casella";
    let sotto = c.sottotitolo || "";
    if (!sotto && !c.sottotitolo_entita && st && c.entity
        && c.entity.split(".")[0] === "weather" && METEO[st.state]) {
      sotto = METEO[st.state][1];
    }
    if (!sotto && !c.sottotitolo_entita && st && c.entity
        && c.entity.split(".")[0] === "media_player") {
      const brano = st.attributes.media_title;
      const chi = nomeArtista(st.attributes.media_artist)
        || st.attributes.media_album_name;
      if (brano) sotto = brano + (chi ? " - " + chi : "");
    }
    this._viaUsata = this._entitaIndirizzo();
    if (this._viaUsata && this._hass) {
      const alt = this._hass.states[this._viaUsata];
      if (alt) {
        const grezzo = alt.state;
        const u = alt.attributes.unit_of_measurement;
        sotto = (grezzo === "unknown" || grezzo === "unavailable")
          ? "" : grezzo + (u ? " " + u : "");
        if (c.sottotitolo) sotto = c.sottotitolo + " " + sotto;
      }
    }
    const dominio = c.entity ? c.entity.split(".")[0] : "";
    let modo = c.disposizione;
    if (!modo && dominio === "media_player") modo = "vinile";
    // "come la ytmusic-card" e' il vinile vestito a festa: stessa ossatura,
    // solo un altro vestito. Cosi' non c'e' una seconda disposizione da
    // tenere buona in tutti i pezzi del codice.
    const ytm = modo === "ytmusic";
    if (ytm) modo = "vinile";
    this.toggleAttribute("ytm", ytm);
    const comePersona = modo === "persona";
    if (["persona", "musica", "vinile"].includes(modo)) this.setAttribute("disposizione", modo);
    else this.removeAttribute("disposizione");

    if (modo === "vinile") {
      const brano = st ? st.attributes.media_title : "";
      const chi = st
        ? (nomeArtista(st.attributes.media_artist) || st.attributes.media_album_name)
        : "";
      // le due scritte le rifaccio solo se cambia la forma, se no basta il testo
      const forma = brano ? "due" : "una";
      if (this._sotto.dataset.forma !== forma) {
        this._sotto.dataset.forma = forma;
        this._sotto.innerHTML = brano
          ? '<span class="brano"></span><span class="artista"></span>'
          : '<span class="brano"></span>';
      }
      if (brano) {
        this._sotto.querySelector(".brano").textContent = brano;
        this._sotto.querySelector(".artista").textContent = chi || "";
      } else {
        this._sotto.querySelector(".brano").textContent = sotto || this._valoreDi(st);
      }
      this._sotto.style.display = "";
    } else if (modo === "musica") {
      this._sotto.textContent = sotto;
      this._sotto.style.display = sotto ? "" : "none";
    } else if (comePersona) {
      const parti = [];
      if (st) {
        const quanto = c.mostra_da_quanto === false ? "" : daQuanto(st.last_changed);
        const via = this._quantoLontanoDaCasa(st);
        parti.push('<span class="stato">' + this._valoreDi(st) + "</span>");
        const extra = [quanto, via].filter(Boolean).join(" \u00b7 ");
        if (extra) {
          parti.push('<span class="quando" title="Distanza in linea d’aria dal '
            + 'punto che Home Assistant considera casa: su strada e sempre di piu">'
            + extra + "</span>");
        }
      }
      if (sotto) parti.push('<span class="via">\uD83D\uDCCD ' + sotto + "</span>");
      this._sotto.innerHTML = parti.join("");
      this._sotto.style.display = parti.length ? "" : "none";
    } else {
      this._sotto.textContent = sotto;
      this._sotto.style.display = sotto ? "" : "none";
    }
    // l'anello attorno alla foto dice dove si trova
    if (comePersona && st) {
      const dove = String(st.state).toLowerCase();
      const zona = dove === "home" ? "#3fd98a"
        : (dove === "not_home" ? "#ffc046" : "#5ec8ff");
      this.style.setProperty("--zona", zona);
      this.setAttribute("dove", dove === "home" ? "casa"
        : (dove === "not_home" ? "fuori" : "zona"));
    } else {
      this.removeAttribute("dove");
    }

    // "da quanto" sotto al nome, per qualsiasi entita'
    if (!comePersona && c.mostra_da_quanto && st && modo !== "vinile") {
      const quanto = daQuanto(st.last_changed);
      if (quanto) {
        const pezzi = [this._valoreDi(st) + " " + quanto];
        if (sotto) pezzi.push(sotto);
        this._sotto.textContent = pezzi.join(" \u00b7 ");
        this._sotto.style.display = "";
      }
    }
    this._avviaTicchettio(!!(c.mostra_da_quanto || comePersona));

    const scritto = (c.nascondi_valore || !c.entity) ? "" : this._valoreDi(st);
    const sparito = !!st
      && ["unavailable", "unknown"].includes(String(st.state).toLowerCase());
    if (!sparito && st && !isNaN(parseFloat(st.state))) this._ultimoBuono = scritto;
    this.toggleAttribute("assente", sparito && !!this._ultimoBuono);
    this._valore.title = sparito && this._ultimoBuono
      ? "Ultimo valore letto: adesso il sensore non risponde" : "";
    this._valore.textContent = scritto;
    const numerico = /^[0-9.,\-]/.test(String(scritto).trim());
    this._valore.classList.toggle("parola", !!scritto && !numerico);
    if (this._velo && this._velo.hasAttribute("aperto")) this._aggiornaFinestra();
    this._disegnaTempo(st);
    this._disegnaComandi(st);
    this._disegnaAttrezzi();
    this._disegnaPastiglie();
    this._disegnaCuore(st);
    this._disegnaCoda(st);
    this._disegnaLettori();
    this._disegnaExtra(st);
    this._disegnaColori(st);
    this._disegnaAntPopup();
    if (this._copertina) {
      const suaCop = fotoDi(st);
      const cop = c.sfondo_copertina && !!suaCop && !c.sfondo_immagine;
      this._copertina.hidden = !cop;
      if (cop) {
        const quanto = (c.sfondo_sfocatura === undefined || c.sfondo_sfocatura === null)
          ? 8 : Number(c.sfondo_sfocatura);
        this.style.setProperty("--sfoca", quanto + "px");
        // niente doppio scurimento: a scurire ci pensa solo il velo qui sotto
        this.style.setProperty("--luce-cop", "0.95");
        // quanto scurirla lo decide lui con "Velo scuro sulla foto"
        const velo = (c.sfondo_velo === undefined ? 30 : Number(c.sfondo_velo)) / 100;
        // il velo sta nella stessa proprieta' della foto: cosi' viene sfocato
        // insieme a lei e il titolo resta leggibile
        const url = "linear-gradient(180deg, rgba(8,12,20," + (velo * 0.7).toFixed(2)
          + "), rgba(8,12,20," + Math.min(0.92, velo + 0.16).toFixed(2) + ")), "
          + 'url("' + suaCop + '")';
        if (this._copertina.style.backgroundImage !== url) {
          this._copertina.style.backgroundImage = url;
        }
      }
    }
    this._disegnaMeteo();
    this._disegnaChips();
    this._disegnaAndamento(st);
    // misurare costa una passata di conti al browser: la faccio al massimo
    // una volta al secondo, in mezzo mi basta la decisione con l'altezza nota
    if (this._altezzaVista && Date.now() - (this._quandoMisura || 0) < 1000) {
      this._decidiCompatta();
    } else {
      this._controllaMisura();
    }
    this._disegnaCursore(st);
    // il timbro va deciso prima: vale anche se la fotina davanti non c'e'
    this._timbro(st);
    const foto = fotoDi(st);
    // se non la vuole, via l'icona in tutte le sue forme
    if (c.mostra_icona === false) {
      this._ritratto.hidden = true;
      this._svg.style.display = "none";
      if (this._svgHa) this._svgHa.hidden = true;
      if (this._svgFoto) this._svgFoto.hidden = true;
      return;
    }
    const usaFoto = foto && c.usa_foto !== false;
    this._ritratto.hidden = !usaFoto;
    this._svg.style.display = usaFoto ? "none" : "";
    if (usaFoto && this._ritratto.getAttribute("src") !== foto) {
      this._ritratto.src = foto;
    }
    // attenzione: il confronto va fatto sull'icona VERA (per il meteo
    // cambia da sola col tempo), non su quella scritta nelle impostazioni
    // un'icona sua, presa dal telefono o dal PC, viene prima di tutto. Se ne
    // ha messa una anche per "quando e' acceso" (di solito una gif), quella
    // vince finche' la casella e' accesa: e' cosi' che una figura animata
    // si muove solo mentre l'apparecchio lavora.
    const suaFoto = this._fotoSua(st);
    if (this._svgFoto) {
      this._svgFoto.hidden = !suaFoto || usaFoto;
      if (suaFoto && this._svgFoto.getAttribute("src") !== suaFoto) {
        this._svgFoto.src = suaFoto;
      }
    }
    if (suaFoto && !usaFoto) {
      this._svg.style.display = "none";
      if (this._svgHa) this._svgHa.hidden = true;
      return;
    }

    // se ha scelto un'icona di Home Assistant, comanda quella; se non ha
    // scelto niente ma l'entita' ha gia' la sua (impostata in Home Assistant
    // o dall'integrazione), usiamo quella: e' quello che fanno le altre schede
    const sceltaSua = c.icona && c.icona !== "auto";
    const dellEntita = (!sceltaSua && c.icona_entita !== false && st)
      ? st.attributes.icon : null;
    const suaIcona = c.icona_ha || dellEntita;
    const conIconaHa = !!suaIcona && !usaFoto && !!customElements.get("ha-icon");
    if (this._svgHa) {
      this._svgHa.hidden = !conIconaHa;
      if (conIconaHa && this._svgHa.getAttribute("icon") !== suaIcona) {
        this._svgHa.setAttribute("icon", suaIcona);
      }
    }
    if (conIconaHa) { this._svg.style.display = "none"; return; }

    const q = this._disegnoDi(st);
    if (this._svg.dataset.icona !== q.chiave) {
      this._svg.innerHTML = q.disegno;
      this._svg.dataset.icona = q.chiave;
    }
    // la misura va ritentata finche' non riesce: il primo giro puo' capitare
    // prima che la casella sia attaccata alla pagina, e li' non si puo'
    // misurare niente. Quando e' gia' saputa costa solo scrivere un numero.
    this._adattaDisegno(q.forma);
    if (q.taglia !== null) tagliaTapparella(this._svg, q.taglia);
  }

  // quale disegno ci vuole, con la sua chiave (per non rifarlo inutilmente)
  // e la sua "forma" (per non rimisurare il riquadro a ogni numero)
  _disegnoDi(st) {
    const nomeIcona = this._nomeIcona(st);
    let disegno = ICONE[nomeIcona] || disegnoMdi(nomeIcona) || ICONE.luce;
    let chiave = nomeIcona;
    let forma = nomeIcona;
    let taglia = null;
    if (nomeIcona === "batteria") {
      const b = this._datiBatteria(st);
      disegno = disegnoBatteria(b.perc, b.carica, b.scarica);
      chiave = "batteria|" + (isNaN(b.perc) ? "-" : Math.round(b.perc))
        + "|" + (b.carica ? "c" : "f");
      // solo il fulmine cambia l'ingombro
      forma = b.carica ? "batteria|c" : "batteria|-";
    }
    if (nomeIcona === "termometro") {
      const gradi = this._gradiDi(st);
      if (gradi !== null) {
        disegno = disegnoTermometro(gradi);
        // il disegno cambia col grado, ma l'ingombro no: cosi' non si
        // rimisura il riquadro a ogni mezzo grado
        chiave = "termometro|" + Math.round(gradi);
        forma = "termometro";
      }
    }
    const dove = this._posizioneMostrata(st);
    if (nomeIcona === "aspirapolvere") {
      const fuori = aspiraFuori(st);
      disegno = disegnoAspira(fuori);
      chiave = "aspira|" + (fuori ? "fuori" : "base");
      forma = "aspirapolvere";
    }
    if (nomeIcona === "tapparella" && dove !== null) {
      // si muove se lo dice Home Assistant o se lo sto ancora portando io
      let moto = (st && st.state === "opening") ? "su"
        : ((st && st.state === "closing") ? "giu" : "");
      if (!moto && this._meta) moto = this._meta.dove > this._meta.da ? "su" : "giu";
      disegno = disegnoTapparella(moto);
      chiave = "tapparella|" + moto;
      forma = "tapparella|pos";
      taglia = this._posizioneDisegno(st);
    }
    return { disegno: disegno, chiave: chiave, forma: forma, taglia: taglia };
  }

  // quanti gradi segna, in centigradi: se il sensore parla in Fahrenheit lo
  // converto, se no la colonnina andrebbe sempre a fondo scala
  _gradiDi(st) {
    if (!st) return null;
    const n = parseFloat(st.state);
    if (!isFinite(n)) return null;
    const u = String(st.attributes.unit_of_measurement || "");
    if (u.indexOf("F") !== -1 && u.indexOf("C") === -1) return (n - 32) * 5 / 9;
    return n;
  }

  // QUALE IMMAGINE SUA: quella normale, o quella di quando e' acceso se ce
  // l'ha messa. La usano in due - la fotina davanti e il timbro grande
  // dietro - e devono dire la stessa cosa.
  _fotoSua(st) {
    const c = this._config || {};
    const accesa = c.icona_immagine_accesa;
    if (accesa && this._acceso(st)) return accesa;
    return c.icona_immagine || accesa || null;
  }

  // l'icona in grande dietro alle scritte: e' lo stesso disegno, sbiadito.
  // Vale anche se la fotina davanti l'ha tolta: anzi, e' proprio il bello.
  _timbro(st) {
    const box = this._svgFondo;
    if (!box) return;
    const c = this._config;
    const suaFoto = this._fotoSua(st);
    const spegni = () => {
      if (!box.hasAttribute("hidden")) {
        box.toggleAttribute("hidden", true);
        box.innerHTML = "";
        box.dataset.icona = "";
      }
    };
    if (!c.icona_sfondo || !c.entity) {
      this.toggleAttribute("fondo-giu", false);
      spegni();
      if (this._fotoFondo) this._fotoFondo.toggleAttribute("hidden", true);
      return;
    }
    // se ha messo una sua immagine, il timbro e' quella: se no dietro c'e'
    // il disegno e davanti la foto, due figure diverse per la stessa cosa
    if (this._fotoFondo) {
      this._fotoFondo.toggleAttribute("hidden", !suaFoto);
      if (suaFoto && this._fotoFondo.getAttribute("src") !== suaFoto) {
        this._fotoFondo.src = suaFoto;
      }
    }
    if (suaFoto) {
      this.toggleAttribute("fondo-giu", c.mostra_icona === false);
      const forza0 = (c.icona_sfondo_forza === undefined
        || c.icona_sfondo_forza === null ? 20 : Number(c.icona_sfondo_forza)) / 100;
      this.style.setProperty("--fondoico", String(Math.max(0, forza0 * 0.7)));
      this.style.setProperty("--fondoico-acceso", String(Math.max(0, forza0)));
      spegni();
      return;
    }
    box.toggleAttribute("hidden", false);
    // se la fotina piccola l'ha tolta, il timbro scende a sinistra da solo:
    // non c'e' niente da impostare, lo decide la card
    this.toggleAttribute("fondo-giu", c.mostra_icona === false);
    const forza = (c.icona_sfondo_forza === undefined || c.icona_sfondo_forza === null
      ? 20 : Number(c.icona_sfondo_forza)) / 100;
    this.style.setProperty("--fondoico", String(Math.max(0, forza * 0.7)));
    this.style.setProperty("--fondoico-acceso", String(Math.max(0, forza)));
    const q = this._disegnoDi(st);
    if (box.dataset.icona !== q.chiave) {
      box.innerHTML = q.disegno;
      box.dataset.icona = q.chiave;
    }
    riempiRiquadro(box, q.forma);
    if (q.taglia !== null) tagliaTapparella(box, q.taglia);
  }

  // il disegno riempie il suo quadrato: misuro quanto occupa davvero e
  // stringo il riquadro attorno, cosi' le nostre icone si vedono grandi
  // come quelle di Home Assistant
  _adattaDisegno(chiave) {
    riempiRiquadro(this._svg, chiave);
  }

}

/* ----------------------------------------------------------------- editor */
