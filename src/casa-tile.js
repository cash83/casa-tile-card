// -*- coding: utf-8 -*-
// La casella.

import { ConAnteprima } from './carta-anteprima.js';
import { ConDisegni } from './carta-disegni.js';
import { ConFinestra } from './carta-finestra.js';
import { ConGrafici } from './carta-grafici.js';
import { ConMusica } from './carta-musica.js';
import { ConPezzi } from './carta-pezzi.js';
import { ONDA_D, PANNELLI_APERTI, SPENTI, daQuanto, fotoDi } from './aiuti.js';
import { CIELI, COLORI, METEO, coloreDaGradi, coloreLampada, coloreTemperatura, conAlfa, daRgb, scurisci } from './colori.js';
import { indirizzoFoto, tagliaTapparella } from './icone.js';
import { metti, nomeArtista, segno } from './segni.js';
import { STILE } from './stile.js';
import { daYaml } from './yaml.js';



export class CasaTile extends ConMusica(ConPezzi(ConFinestra(ConAnteprima(ConGrafici(ConDisegni(HTMLElement)))))) {
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






}

/* ----------------------------------------------------------------- editor */
