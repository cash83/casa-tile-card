// -*- coding: utf-8 -*-
// Il riquadro delle impostazioni.

import { T, scegliLingua, traduciSchema } from './lingua.js';
import { SCHEDA_APERTA, nomeAttrezzo, riempiRiquadro } from './aiuti.js';
import { COLORI, coloreLampada, daRgb } from './colori.js';
import { ICONE, MDI_PAROLE, NOMI_ICONE, NOMI_MDI, SINONIMI, disegnoMdi, iconaAutomatica, indirizzoFoto } from './icone.js';
import { DIPENDE, ETICHETTE, SCHEDA_MANO, SCHEDE_ALTRE, SCHEDE_PRONTE, SEZIONI, SOLO_AZIONE, SOLO_PER, STILE_SELETTORE, nomeScheda } from './schema.js';
import { hslARgb, hslATesto, metti, nomeTasto, rgbAHsl, segno } from './segni.js';
import { STILE_EDITOR } from './stile-editor.js';
import { VERSIONE } from './versione.js';
import { aYaml, daYaml } from './yaml.js';

// LA DISPOSIZIONE MESSA DA PARTE. Gli appunti del browser sulla sua
// installazione non ci sono (la pagina e' in http), e passare per la
// casella di testo si rompe appena si cambia casella. Questo cassetto vive
// finche' resta aperta la pagina e non dipende da nessuno.
export let APPUNTI_POSTI = null;

export class CasaTileEditor extends HTMLElement {
  setConfig(config) {
    this._config = { ...config };
    this._ascoltaMisure();
    // dalla v2.3.8 le entita' che decidono l'accensione sono un elenco: se
    // trovo la vecchia forma a testo la converto, se no il campo a scelta
    // multipla non riesce a disegnarsi e sparisce dalle impostazioni
    if (typeof this._config.acceso_entita === "string") {
      this._config.acceso_entita = this._config.acceso_entita
        ? [this._config.acceso_entita] : [];
    }
    if (String(config.entity || "").indexOf("media_player.") === 0) {
      if (this._config.multiroom === undefined) this._config.multiroom = true;
      if (this._config.sorgente === undefined) this._config.sorgente = true;
    }
    // La disposizione con la sua card incastrata dentro non c'e' piu':
    // chi ce l'aveva passa a quella nostra, con i tastini gia' accesi, se no
    // la casella si ritroverebbe spoglia senza aver chiesto niente.
    if (this._config.disposizione === "ytcard") {
      this._config.disposizione = "ytmusic";
      if (this._config.yt_attrezzi === undefined) this._config.yt_attrezzi = true;
      if (this._config.coda === undefined) this._config.coda = true;
      if (this._config.yt_cuore === undefined) this._config.yt_cuore = true;
    }
    // Gli interruttori della SUA card partono tutti accesi (la card fa
    // cosi': quello che non e' scritto e' acceso). Ma un interruttore senza
    // valore Home Assistant lo disegna SPENTO, e allora si vedevano tutti
    // grigi mentre nell'anteprima la roba c'era. Glieli scrivo, cosi' lo
    // sportello dice la verita' su quello che sta guardando.
    this._planciaCercata = null;
    this._planciaSalvata = null;
    this._render();
  }
  set hass(hass) { scegliLingua(hass); this._hass = hass; this._propaga(); }
  set lovelace(lv) { this._lovelace = lv; this._propaga(); }

  _lov() { return this._lovelace || { config: { views: [] }, editMode: true }; }

  // Ripassare i valori ai moduli e agli editor di Home Assistant li fa
  // ridisegnare tutti. Con una casa che manda aggiornamenti in continuazione
  // (e nella scheda "Tocco" ci sono gli editor delle schede del pop-up, che
  // si portano dietro la loro anteprima) e' il conto piu' salato di tutti:
  // lo faccio al massimo una volta al secondo, e l'ultimo giro lo recupero.
  _propaga() {
    const ora = Date.now();
    const passato = ora - (this._quandoPropago || 0);
    // chi non ha ancora ricevuto niente non puo' aspettare: i selettori di
    // Home Assistant senza "hass" si rompono
    const digiuni = (this._forms || []).some((f) => !f._ebbeHass);
    if (!digiuni && passato < 1000) {
      if (!this._propagaDopo) {
        this._propagaDopo = setTimeout(() => {
          this._propagaDopo = 0;
          this._propagaDavvero();
        }, 1000 - passato);
      }
      return;
    }
    this._propagaDavvero();
  }

  _propagaDavvero() {
    const ora = Date.now();
    this._quandoPropago = ora;
    // Ai moduli e agli editor i valori servono per riempire gli elenchi
    // delle entita', non per stare aggiornati al secondo: glieli do la prima
    // volta e poi solo ogni dieci secondi. Gli editor delle schede del pop-up
    // (scheda "Tocco") si portano dietro un'anteprima viva, e ridisegnarla a
    // ogni stato che cambia in casa era tutto il rallentamento.
    const daDare = (el) => {
      if (!el._ebbeHass) return true;
      return ora - (el._quandoHass || 0) > 10000;
    };
    // se i valori non sono ancora arrivati non c'e' niente da dare
    if (!this._hass) return;
    const dai = (el) => {
      el._ebbeHass = true;
      el._quandoHass = ora;
      el.hass = this._hass;
    };
    (this._forms || []).forEach((f) => {
      // il modulo che sta usando adesso non si tocca: ogni assegnazione lo
      // fa ridisegnare, e col selettore del colore aperto e' un disastro
      if (f === this._formInUso) return;
      if (daDare(f)) dai(f);
    });
    const lov = this._lov();
    this.querySelectorAll("hui-card-picker, hui-card-element-editor").forEach((el) => {
      if (daDare(el)) dai(el);
      // il "lovelace" cambia quasi mai: riassegnarlo fa rifare l'editor
      if (el._lovDato !== lov) { el._lovDato = lov; el.lovelace = lov; }
    });
    if (this._edScheda && this._edScheda.isConnected && daDare(this._edScheda)) {
      dai(this._edScheda);
    }
  }

  _schede() {
    const c = this._config;
    if (Array.isArray(c.finestra_cards)) return c.finestra_cards;
    if (c.finestra_card) return [c.finestra_card];
    // configurazioni delle versioni precedenti: le converto in schede vere
    if (c.finestra_scheda || c.finestra_grafico) {
      const entita = (c.finestra_entita && c.finestra_entita.length)
        ? c.finestra_entita : (c.entity ? [c.entity] : []);
      let tipo = c.finestra_scheda || "entities";
      if (tipo === "altra") tipo = (c.finestra_scheda_altra || "entities").trim();
      const MULTI = ["entities", "glance", "history-graph", "statistics-graph",
                     "logbook", "map", "distribution"];
      const fuori = [];
      if (c.finestra_grafico) {
        fuori.push({ type: "history-graph", hours_to_show: 24, entities: entita });
      }
      if (MULTI.includes(tipo)) fuori.push({ type: tipo, entities: entita });
      else entita.forEach((e) => fuori.push({ type: tipo, entity: e }));
      return fuori;
    }
    return [];
  }

  _salvaSchede(lista, ricostruisci) {
    const c = { ...this._config, finestra_cards: lista };
    delete c.finestra_card;
    delete c.finestra_scheda;
    delete c.finestra_scheda_altra;
    delete c.finestra_grafico;
    delete c.finestra_entita;
    this._config = c;
    this._emetti();
    if (ricostruisci) this._costruisciBlocco(true);
  }

  _emetti() {
    this.dispatchEvent(new CustomEvent("config-changed", {
      detail: { config: this._config }, bubbles: true, composed: true,
    }));
  }

  _render() {
    if (!this._costruito) {
      const stile = document.createElement("style");
      stile.textContent = STILE_EDITOR + STILE_SELETTORE;
      this.appendChild(stile);

      this._foto = document.createElement("div");
      this._foto.className = "blocco";
      this._blocco = document.createElement("div");
      this._blocco.className = "blocco";
      this._sensori = document.createElement("div");
      this._sensori.className = "blocco";
      this._nomiMisure = document.createElement("div");
      this._nomiMisure.className = "blocco";
      this._postiBox = document.createElement("div");
      this._postiBox.className = "blocco";
      this._scelte = document.createElement("div");
      this._scelte.className = "scelte";
      this._tinte = document.createElement("div");
      this._tinte.className = "scelte";

      // la ricerca: con quasi sessanta impostazioni, trovarle e' il problema
      this._cerca = document.createElement("input");
      this._cerca.className = "cercaOpz";
      this._cerca.type = "search";
      this._cerca.placeholder = "Cerca un'impostazione: meteo, colore, km...";
      this._trovate = document.createElement("div");
      this._trovate.className = "trovate";
      this._trovate.hidden = true;
      this._cerca.addEventListener("input", () => this._cercaOpzioni());
      this.appendChild(this._cerca);
      this.appendChild(this._trovate);

      this._barra = document.createElement("div");
      this._barra.className = "schede";
      const targa = document.createElement("span");
      targa.className = "targhetta";
      targa.textContent = "v" + VERSIONE;
      targa.title = "Versione della card: se non e' quella che ti aspetti, "
        + "il browser sta ancora usando una copia vecchia (ricarica con Ctrl+F5)";
      this._targa = targa;
      this.appendChild(this._barra);

      this._forms = [];
      this._tasti = [];
      this._gruppi = [];
      this._pannelli = [];
      SEZIONI.forEach((sez, i) => {
        const bottone = document.createElement("button");
        bottone.className = "scheda";
        bottone.type = "button";
        bottone.innerHTML = "<span class='segno'></span><span class='testo'></span>";
        bottone.querySelector(".segno").textContent = sez.segno || "";
        bottone.querySelector(".testo").textContent = T(sez.titolo);
        if (i === 0) bottone.setAttribute("scelta", "");
        bottone.addEventListener("click", () => this._scegliScheda(i));
        this._barra.appendChild(bottone);
        this._tasti.push(bottone);

        const pannello = document.createElement("div");
        pannello.className = "pannello";
        if (i !== 0) pannello.setAttribute("nascosto", "");

        // ogni scheda e' fatta di gruppi: titoletto + campi
        const suoi = [];
        sez.gruppi.forEach((gruppo) => {
          // ogni gruppo dentro al suo riquadro, come quelli fatti a mano:
          // con quaranta impostazioni di fila non si capiva piu' dove
          // finiva una cosa e cominciava l'altra
          const scatola = document.createElement("div");
          scatola.className = "blocco gruppoBox";
          pannello.appendChild(scatola);
          let titolo = null;
          if (gruppo.titolo) {
            titolo = document.createElement("h4");
            titolo.className = "titoloGruppo";
            titolo.textContent = T(gruppo.titolo);
            scatola.appendChild(titolo);
          }
          const form = document.createElement("ha-form");
          // i valori GLIELI DO SUBITO: senza, i selettori di Home Assistant
          // provano a leggere l'elenco delle entita' da un "hass" che non
          // c'e' ancora e si schiantano in continuazione (era il fiume di
          // errori "ha-selector-entity ... reading entities" nel registro)
          form.hass = this._hass;
          form._ebbeHass = !!this._hass;
          form._quandoHass = Date.now();
          form.schema = this._schemaDi(gruppo);
          form._firma = this._firmaSchema(form.schema);
          form.computeLabel = (x) => T(ETICHETTE[x.name]) || x.name;
          form.addEventListener("value-changed", (e) => {
            e.stopPropagation();
            this._formInUso = form;
            clearTimeout(this._scordaForm);
            this._scordaForm = setTimeout(() => { this._formInUso = null; }, 800);
            const prima = this._config.azione;
            // ATTENZIONE: i moduli di Home Assistant tengono in pancia una
            // copia di TUTTA la configurazione e quando muovi un interruttore
            // ti ridanno quella copia con dentro il campo cambiato. Ma la
            // copia gliela do io, e per non ridisegnare quindici moduli a
            // ogni ritocco la rinfresco solo a chi e' cambiato un campo suo.
            // Risultato: il modulo dei "Tasti rapidi" aveva ancora la
            // configurazione di prima, e accendendo i tasti rimetteva com'era
            // la barra - o viceversa. Da qui prendo SOLO i campi che sono
            // suoi, e il resto della configurazione non lo tocca nessuno.
            const suoi = this._nomiSchema(form.schema);
            const dispPrima = this._config.disposizione;
            const c2 = { ...this._config };
            suoi.forEach((nome) => {
              if (nome in e.detail.value) c2[nome] = e.detail.value[nome];
              else delete c2[nome];
            });
            // "come la tua ytmusic-card" e' un vestito completo, non solo
            // la disposizione: la copertina tonda davanti e quella sfocata
            // dietro sono meta' di quello che la fa somigliare alla sua. Se
            // le trovo spente (magari da un'altra disposizione di prima) le
            // riaccendo appena sceglie questa. Poi puo' rispegnerle.
            if (c2.disposizione === "ytmusic" && dispPrima !== "ytmusic") {
              c2.mostra_icona = true;
              c2.usa_foto = true;
              if (c2.sfondo_copertina === undefined) c2.sfondo_copertina = true;
              if (!(Number(c2.sfondo_sfocatura) > 0)) c2.sfondo_sfocatura = 34;
            }
            this._config = c2;
            this._emetti();
            if (prima !== this._config.azione) {
              this._costruisciBlocco(true);
              this._aggiornaSchemi();
            }
            if (["sfondo", "aspetto", "musica", "persone"].includes(sez.chiave)) {
            this._costruisciFoto();
          }
            if (sez.chiave === "base") {
              this._costruisciTrovati();
              this._costruisciNomi();
              this._aggiornaSchemi();
            }
          });
          this._forms.push(form);
          scatola.appendChild(form);
          let boxColori = null;
          if (gruppo.colori && gruppo.colori.length) {
            boxColori = document.createElement("div");
            boxColori.className = "colori-blocco";
            scatola.appendChild(boxColori);
          }
          suoi.push({ gruppo: gruppo, form: form, titolo: titolo,
                      colori: boxColori, scatola: scatola });

          // i riquadri fatti a mano vanno sotto al gruppo che li riguarda
          if (sez.chiave === "base" && gruppo.titolo === "Cosa c'e scritto") {
            pannello.appendChild(this._sensori);
            pannello.appendChild(this._nomiMisure);
          }
          if (sez.chiave === "icona") pannello.appendChild(this._scelte);
          if (sez.chiave === "aspetto" && gruppo.titolo === "Colore della scritta") {
            pannello.appendChild(this._tinte);
          }
          if (sez.chiave === "sfondo" && gruppo.titolo === "Foto di sfondo") {
            pannello.appendChild(this._foto);
          }
          if (sez.chiave === "popup" && gruppo.titolo === "Come si apre") {
            pannello.appendChild(this._provaApertura());
          }
          if (sez.chiave === "popup") pannello.appendChild(this._blocco);
        });
        if (sez.chiave === "pezzi") pannello.appendChild(this._postiBox);
        this._gruppi.push(suoi);

        this._pannelli.push(pannello);
        this.appendChild(pannello);
      });
      this._barra.appendChild(this._targa);
      this._costruito = true;
    }
    // Il selettore del colore manda una modifica a ogni movimento del dito:
    // rifare tutto ogni volta impastava le impostazioni. Quindi rimando il
    // giro al prossimo disegno e ne faccio uno solo.
    // la primissima volta niente attese: deve comparire subito
    if (this._formaOra === undefined) { this._giroCompleto(); return; }
    // aspetto un attimo e ne faccio uno solo: il selettore del colore manda
    // una modifica a ogni movimento del dito. Uso un timer e non il disegno
    // del browser, che in una scheda nascosta non arriverebbe mai.
    clearTimeout(this._attesa);
    this._attesa = setTimeout(() => {
      if (!this._costruito || !this.isConnected) return;
      this._giroCompleto();
    }, 60);
  }

  _giroCompleto() {
    this._conservaPosto(() => {
      // gli schemi cambiano solo se cambia il TIPO di casella, non i valori
      // la disposizione fa parte della forma: cambiandola cambiano anche le
      // impostazioni che hanno senso (il giradischi, per dire, in "come la
      // tua ytmusic-card" non comanda niente e non si fa vedere)
      // ...e ci metto anche gli interruttori da cui dipendono altre voci: se
      // no accendi "grafico" e le sue tre impostazioni non compaiono finche'
      // non riapri la finestra
      const dip = Object.keys(DIPENDE)
        .map((k) => (DIPENDE[k](this._config) ? "1" : "0")).join("");
      const forma = (this._config.entity || "") + "|" + (this._config.azione || "")
        + "|" + (this._config.disposizione || "")
        + "|" + ((this._config.acceso_entita || []).length ? "1" : "0")
        + "|" + dip;
      if (this._formaOra !== forma) {
        this._formaOra = forma;
        this._aggiornaSchemi();
      }
      // e agli altri do i valori solo se i LORO campi sono cambiati: se no
      // ridisegno quindici moduli a ogni movimento del dito sul colore
      this._forms.forEach((f) => {
        if (f === this._formInUso) return;
        const firma = this._firmaValori(f.schema);
        if (f._valori === firma) return;
        f._valori = firma;
        f.data = this._config;
      });
      this._costruisciColori();
      this._costruisciPosti();
      this._costruisciScelte();
      this._costruisciFoto();
      this._costruisciTrovati();
      this._costruisciNomi();
      this._costruisciBlocco();
    });
    requestAnimationFrame(() => this._adattaCatalogo());
  }

  // Home Assistant rifa' le impostazioni a ogni modifica: se in mezzo un
  // riquadro si accorcia, la pagina salta in cima e lui perde di vista
  // proprio l'impostazione che stava provando. Qui mi segno dov'era.
  _conservaPosto(azione) {
    // se sono gia' dentro a un altro "tieni il segno", quello di fuori ha
    // gia' preso la posizione buona: qui dentro rifarlo vorrebbe dire
    // segnarsi una posizione a meta' del lavoro
    if (this._dentroConserva) { azione(); return; }
    this._dentroConserva = true;
    const box = this._scorrevole();
    const dove = box ? box.scrollTop : 0;
    try { azione(); } finally { this._dentroConserva = false; }
    if (!box) return;
    // Rimetto il segno piu' volte: la finestra di Home Assistant si ridisegna
    // a pezzi (l'anteprima della card arriva dopo, e cambia altezza), quindi
    // un solo ripasso non bastava e la pagina risaliva lo stesso.
    const rimetti = () => {
      if (box.isConnected && box.scrollTop !== dove) box.scrollTop = dove;
    };
    rimetti();
    requestAnimationFrame(rimetti);
    clearTimeout(this._rimettiPosto1);
    clearTimeout(this._rimettiPosto2);
    this._rimettiPosto1 = setTimeout(rimetti, 60);
    this._rimettiPosto2 = setTimeout(rimetti, 240);
  }

  // chi e' che scorre davvero: puo' essere un pezzo della finestra di
  // Home Assistant, anche dentro a un'ombra
  _scorrevole() {
    if (this._boxScorr && this._boxScorr.isConnected) return this._boxScorr;
    const su = (x) => (x.parentNode ? x.parentNode : (x.host || null));
    let n = su(this);
    let passi = 0;
    while (n && passi < 30) {
      passi += 1;
      if (n.nodeType === 1 && n.scrollHeight > n.clientHeight + 4) {
        const come = getComputedStyle(n).overflowY;
        if (come === "auto" || come === "scroll") { this._boxScorr = n; return n; }
      }
      n = su(n);
    }
    return null;
  }

  // icona e colore si scelgono guardandoli
  _costruisciScelte() {
    const box = this._scelte;
    const tin = this._tinte;
    if (!box) return;
    if (!box._fatto) {
      box._fatto = true;
      box.innerHTML = "<h4>Icona</h4>"
        + "<p class='aiuto notaMeteo' hidden>Per il meteo non serve sceglierla: "
        + "l'icona la decide il tempo che fa (sole, nuvole, pioggia, neve, "
        + "temporale, nebbia, vento) e cambia da sola.</p>"
        + "<input class='cercaIcona' type='search' placeholder='Cerca l&apos;icona: luce, presa, porta, auto...'>"
        + "<div class='iconePicker'></div>";

      const griglia = box.querySelector(".iconePicker");
      // del meteo ne basta una: tanto poi la sceglie il tempo che fa
      const METEOICONE = ["luna", "nuvola", "sole_nuvole", "pioggia", "neve",
                          "temporale", "nebbia", "vento"];
      const elenco = ["auto"]
        .concat(NOMI_ICONE.filter((x) => METEOICONE.indexOf(x) < 0))
        .concat(NOMI_MDI);
      elenco.forEach((nome, k) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "sceltaIcona";
        b.dataset.nome = nome;
        if (nome === "auto") {
          b.classList.add("sceltaAuto");
          b.innerHTML = '<span class="segnoAuto">\u2726</span>'
            + '<span class="nome">Automatica</span>';
          b.title = "La sceglie la card guardando l'entita";
          b.addEventListener("click", () => {
            this._config = { ...this._config, icona: "auto" };
            this._emetti();
            this._costruisciScelte();
          });
          griglia.appendChild(b);
          return;
        }
        // gli id dentro l'SVG vanno resi unici, altrimenti si pestano i piedi
        const tintaEditor = (COLORI[(this._config || {}).colore] || COLORI.ambra);
        const dentro = String(ICONE[nome] || disegnoMdi(nome, tintaEditor) || "")
          .replace(/id="([a-z0-9]+)"/g, 'id="$1_p' + k + '"')
          .replace(/url\(#([a-z0-9]+)\)/g, "url(#$1_p" + k + ")");
        b.innerHTML = '<svg viewBox="0 0 64 64" fill="none">' + dentro
          + '</svg><span class="nome"></span>';
        b.querySelector(".nome").textContent = nome;
        b.addEventListener("click", () => {
          this._config = { ...this._config, icona: nome };
          this._emetti();
          this._costruisciScelte();
        });
        griglia.appendChild(b);
      });

      tin.innerHTML = "<h4>Colore quando e accesa</h4>"
        + "<p class='aiuto'>Tocca la ruota per scegliere il colore che vuoi: "
        + "e' quello dell'alone, del bordo e di tutti gli effetti.</p>"
        + "<div class='coloriPicker'></div>";
      const fila = tin.querySelector(".coloriPicker");
      // niente piu' pallini fissi: bastano la ruota e "come la lampada"
      [].forEach((nome) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "sceltaColore";
        b.dataset.nome = nome;
        b.title = nome;
        b.style.background = COLORI[nome];
        b.addEventListener("click", () => {
          this._config = { ...this._config, colore: nome };
          delete this._config.colore_rgb;
          this._emetti();
          this._costruisciScelte();
        });
        fila.appendChild(b);
      });
      const lampada = document.createElement("button");
      lampada.type = "button";
      lampada.className = "sceltaColore coloreLampada";
      lampada.dataset.nome = "luce";
      lampada.title = "Come la lampada (colore vero della luce)";
      lampada.innerHTML = '<span class="segno">\u25C9</span>';
      lampada.addEventListener("click", () => {
        this._config = { ...this._config, colore: "luce" };
        delete this._config.colore_rgb;
        this._emetti();
        this._costruisciScelte();
      });
      fila.appendChild(lampada);
      tin._lampada = lampada;

      const termo = document.createElement("button");
      termo.type = "button";
      termo.className = "sceltaColore coloreTermo";
      termo.dataset.nome = "termometro";
      termo.title = "Segue la temperatura (freddo azzurro, caldo rosso)";
      termo.addEventListener("click", () => {
        this._config = { ...this._config, colore: "termometro" };
        delete this._config.colore_rgb;
        this._emetti();
        this._costruisciScelte();
      });
      fila.appendChild(termo);
      tin._termo = termo;

      const libero = document.createElement("button");
      libero.type = "button";
      libero.className = "sceltaColore coloreLibero";
      libero.dataset.nome = "personalizzato";
      libero.title = "Un colore qualsiasi";
      // niente finestra dei colori del computer: la ruota, che si apre subito
      const scelta = this._sceltaColore(this._config.colore_rgb, (rgb) => {
        this._config = { ...this._config, colore: "personalizzato", colore_rgb: rgb };
        this._emetti();
      });
      libero.addEventListener("click", scelta.apriChiudi);
      fila.appendChild(libero);
      fila.after(scelta.cassetto);
      tin._libero = libero;
      tin._scelta = scelta;

      // un'icona tutta sua, presa dal telefono o dal PC - e la sua gemella
      // per quando e' acceso
      box._suaIcona = this._rigaImmagine(box, "icona_immagine",
        "Usa un'immagine mia (telefono o PC)", "");
      box._suaAccesa = this._rigaImmagine(box, "icona_immagine_accesa",
        "Immagine di quando e' acceso (anche una gif)",
        "si vede solo mentre lavora: alla base torna quella di sopra");

      const cerca = box.querySelector(".cercaIcona");
      cerca.addEventListener("input", () => {
        const q = cerca.value.trim().toLowerCase();
        box.querySelectorAll(".sceltaIcona").forEach((b) => {
          const nome = b.dataset.nome || "";
          const parole = (SINONIMI[nome] || MDI_PAROLE[nome] || "") + " " + nome;
          b.hidden = !!q && nome !== "auto"
            && parole.toLowerCase().replace(/_/g, " ").indexOf(q) < 0;
        });
      });
    }

    const c = this._config || {};
    // sul meteo l'icona e' automatica: la griglia delle icone non serve
    const suoDominio = String(c.entity || "").split(".")[0];
    const nota = box.querySelector(".notaMeteo");
    const griglia = box.querySelector(".iconePicker");
    if (nota && griglia) {
      nota.hidden = suoDominio !== "weather";
      griglia.hidden = suoDominio === "weather";
    }
    if (tin && tin._termo) {
      const dom = String(c.entity || "").split(".")[0];
      const st2 = this._hass ? this._hass.states[c.entity] : null;
      const daTemperatura = dom === "climate" || dom === "weather"
        || (!!st2 && st2.attributes.device_class === "temperature");
      tin._termo.hidden = !daTemperatura;
    }
    if (tin && tin._lampada) {
      const dom = String(c.entity || "").split(".")[0];
      const st = this._hass ? this._hass.states[c.entity] : null;
      const modi = st ? (st.attributes.supported_color_modes || []) : [];
      const aColori = dom === "light" && modi.some((m) =>
        ["rgb", "rgbw", "rgbww", "hs", "xy", "color_temp"].includes(m));
      tin._lampada.hidden = !aColori;
      const rgb = st && st.attributes.rgb_color;
      tin._lampada.style.background = Array.isArray(rgb)
        ? daRgb(coloreLampada(rgb))
        : "linear-gradient(135deg, #ff5f5f, #ffc046, #5ec8ff)";
    }
    [box._suaIcona, box._suaAccesa].forEach((r) => {
      if (!r) return;
      const mia = c[r.chiave];
      r.ant.hidden = !mia;
      r.via.hidden = !mia;
      if (mia && r.ant.getAttribute("src") !== mia) r.ant.src = mia;
      // mentre ci sta scrivendo dentro non gliela cambio sotto le mani
      if (document.activeElement !== r.campo) r.campo.value = mia || "";
      if (r.nota && !r.fisso) r.nota.textContent = "";
    });
    // la seconda ha senso solo se c'e' la prima: se no non si torna indietro
    if (box._suaAccesa) {
      box._suaAccesa.riga.hidden = !c.icona_immagine && !c.icona_immagine_accesa;
    }
    const sceltaIcona = c.icona || "auto";
    box.querySelectorAll(".sceltaIcona").forEach((b) =>
      b.toggleAttribute("scelta", b.dataset.nome === sceltaIcona));
    // sul tasto "Automatica" mostro quale verrebbe scelta adesso
    const tastoAuto = box.querySelector(".sceltaAuto .segnoAuto");
    if (tastoAuto && c.entity && this._hass) {
      const quale = iconaAutomatica(c.entity, this._hass.states[c.entity]);
      const tintaAuto = COLORI[c.colore] || COLORI.ambra;
      tastoAuto.innerHTML = '<svg viewBox="0 0 64 64" fill="none">'
        + String(ICONE[quale] || disegnoMdi(quale, tintaAuto) || ICONE.luce)
          .replace(/id="([a-z0-9]+)"/g, 'id="$1_auto"')
          .replace(/url\(#([a-z0-9]+)\)/g, "url(#$1_auto)")
        + "</svg>";
    }
    if (tin) {
      tin.querySelectorAll(".sceltaColore").forEach((b) =>
        b.toggleAttribute("scelta", b.dataset.nome === (c.colore || "ambra")));
    }
    if (Array.isArray(c.colore_rgb) && tin && tin._libero) {
      const tinta = daRgb(c.colore_rgb);
      if (tinta) {
        tin._libero.style.background = tinta;
        if (tin._scelta && tin._scelta.aggiorna) tin._scelta.aggiorna(c.colore_rgb);
      }
    } else if (tin && tin._libero) {
      tin._libero.style.background =
        "conic-gradient(#ff5f5f, #ffc046, #3fd98a, #4fe0c8, #5ec8ff, #9b6bff, #ff5f5f)";
    }
  }

  _trovaSensori() {
    const c = this._config;
    if (!this._hass || !c.entity) return [];
    const st = this._hass.states[c.entity];
    if (!st) return [];
    const registro = this._hass.entities || {};
    const dispositivi = new Set();
    (st.attributes.device_trackers || []).concat([c.entity]).forEach((eid) => {
      const voce = registro[eid];
      if (voce && voce.device_id) dispositivi.add(voce.device_id);
    });

    let trovati = [];
    if (dispositivi.size) {
      trovati = Object.keys(registro).filter((eid) => {
        const voce = registro[eid];
        return voce && dispositivi.has(voce.device_id)
          && (eid.startsWith("sensor.") || eid.startsWith("binary_sensor."));
      });
    }
    if (!trovati.length) {
      const radice = c.entity.split(".")[1];
      trovati = Object.keys(this._hass.states).filter(
        (eid) => eid.startsWith("sensor." + radice + "_")
          || eid.startsWith("binary_sensor." + radice + "_"));
    }
    return trovati.filter((eid) => {
      const x = this._hass.states[eid];
      return x && x.state !== "unavailable" && x.state !== "unknown";
    }).sort();
  }

  // dai un nome tuo a ogni misura: "Scarica", "Uscita casa"... senza questo
  // due sensori di watt sono due caselline uguali con dentro numeri diversi
  // I selettori di colore di Home Assistant sono pesantissimi: aprirli
  // fermava tutta la pagina. Qui basta il colore del sistema, che si apre
  // di colpo, piu' una X per toglierlo.
  // quali ruote di colore hanno senso adesso: le stesse regole dei campi
  // normali (tipo di entita', azione, e l'interruttore da cui dipendono)
  _coloriDi(gruppo) {
    const dom = (this._config.entity || "").split(".")[0];
    const azione = this._config.azione || "toggle";
    return (gruppo.colori || []).filter((nome) => {
      if (SOLO_AZIONE[nome] && SOLO_AZIONE[nome] !== azione) return false;
      const amm = SOLO_PER[nome];
      if (amm && (!dom || !amm.includes(dom))) return false;
      if (DIPENDE[nome] && !DIPENDE[nome](this._config)) {
        const ora = this._config[nome];
        const scritto = ora !== undefined && ora !== null && ora !== ""
          && !(Array.isArray(ora) && !ora.length);
        if (!scritto) return false;
      }
      return true;
    });
  }

  _costruisciColori() {
    (this._gruppi || []).forEach((suoi) => {
      suoi.forEach((g) => {
        if (!g.colori) return;
        const campi = this._coloriDi(g.gruppo);
        // la firma NON guarda i colori scelti: se no la ruota si richiude
        // in faccia ogni volta che ne tocchi uno
        const firma = campi.join(",");
        if (g.colori._firma === firma) {
          g.colori.hidden = g.form.hidden && !campi.length;
          g.colori.childNodes.forEach((n2) => { if (n2._aggiorna) n2._aggiorna(); });
          return;
        }
        g.colori._firma = firma;
        g.colori.innerHTML = "";
        campi.forEach((campo) => g.colori.appendChild(this._rigaColore(campo)));
      });
    });
  }

  // La ruota dei colori: la uso sia per le tinte della casella sia per le
  // schede del pop-up. Restituisce la pastiglia da toccare, il cassetto che
  // si apre, e un modo per rimetterla in pari.
  _sceltaColore(iniziale, quandoCambia) {
    const bolla = document.createElement("button");
    bolla.type = "button";
    bolla.className = "bolla";
    bolla.title = "Scegli il colore";

    const cassetto = document.createElement("div");
    cassetto.className = "ruota-cassetto";
    cassetto.hidden = true;
    const ruota = document.createElement("div");
    ruota.className = "ruota";
    const mira = document.createElement("i");
    mira.className = "mira";
    ruota.appendChild(mira);
    const luce = document.createElement("input");
    luce.type = "range";
    luce.className = "luce";
    luce.min = "0"; luce.max = "100"; luce.step = "1";

    let H = 210; let S2 = 60;
    const metti = (rgb) => {
      if (Array.isArray(rgb)) {
        const [h2, s3, l2] = rgbAHsl(rgb[0], rgb[1], rgb[2]);
        H = h2; S2 = s3; luce.value = String(Math.round(l2));
        bolla.style.background = daRgb(rgb);
      } else {
        luce.value = "50";
        bolla.style.background = "transparent";
      }
    };
    metti(iniziale);

    const mettiMira = () => {
      const r = (S2 / 100) * 46;
      const a2 = H * Math.PI / 180;
      mira.style.left = (50 + Math.cos(a2) * r) + "%";
      mira.style.top = (50 + Math.sin(a2) * r) + "%";
      mira.style.background = hslATesto(H, S2, Number(luce.value));
    };
    const mostra = () => {
      bolla.style.background = hslATesto(H, S2, Number(luce.value));
      mettiMira();
    };
    const manda = () => quandoCambia(hslARgb(H, S2, Number(luce.value)));

    const prendi = (e) => {
      const q = ruota.getBoundingClientRect();
      if (!q.width || !q.height) return;
      const dx = (e.clientX - q.left) / q.width * 2 - 1;
      const dy = (e.clientY - q.top) / q.height * 2 - 1;
      const r = Math.min(1, Math.sqrt(dx * dx + dy * dy));
      const h2 = (Math.atan2(dy, dx) * 180 / Math.PI + 360) % 360;
      if (!isFinite(h2) || !isFinite(r)) return;
      H = h2;
      S2 = Math.round(r * 100);
      mostra();
    };
    ruota.addEventListener("pointerdown", (e) => {
      ruota.setPointerCapture(e.pointerId);
      ruota._giu = true;
      prendi(e);
    });
    ruota.addEventListener("pointermove", (e) => { if (ruota._giu) prendi(e); });
    ["pointerup", "pointercancel"].forEach((ev) =>
      ruota.addEventListener(ev, () => { ruota._giu = false; manda(); }));
    luce.addEventListener("input", mostra);
    luce.addEventListener("change", manda);
    const apriChiudi = () => {
      cassetto.hidden = !cassetto.hidden;
      if (!cassetto.hidden) mettiMira();
    };
    bolla.addEventListener("click", apriChiudi);

    cassetto.append(ruota, luce);
    return {
      bolla: bolla, cassetto: cassetto, aggiorna: metti,
      apriChiudi: apriChiudi, aperto: () => !cassetto.hidden,
    };
  }

  _rigaColore(campo) {
    const riga = document.createElement("div");
    riga.className = "riga-colore";
    const eti = document.createElement("span");
    eti.className = "eti";
    eti.textContent = T(ETICHETTE[campo]) || campo;

    const via = document.createElement("button");
    via.type = "button";
    via.className = "togli";
    via.textContent = "✕";
    via.title = "Togli il colore";
    via.hidden = !Array.isArray(this._config[campo]);
    via.addEventListener("click", () => {
      const c2 = { ...this._config };
      delete c2[campo];
      this._config = c2;
      this._emetti();
      this._costruisciColori();
    });

    const scelta = this._sceltaColore(this._config[campo], (rgb) => {
      this._config = { ...this._config, [campo]: rgb };
      via.hidden = false;
      this._emetti();
    });

    riga.append(eti, scelta.bolla, via);
    const fuori = document.createElement("div");
    fuori.className = "colore-riga-fuori";
    fuori.append(riga, scelta.cassetto);
    fuori._aggiorna = () => {
      const ora = this._config[campo];
      scelta.aggiorna(ora);
      via.hidden = !Array.isArray(ora);
    };
    return fuori;
  }



  // Il riquadro dove si trascinano i pezzi: dentro c'e' una casella vera,
  // in piccolo, della stessa forma dell'anteprima.
  _costruisciPosti() {
    const box = this._postiBox;
    if (!box) return;
    // dentro all'editor di una scheda del pop-up il riquadro non ci va, e
    // non ci va nemmeno un avviso al suo posto: niente roba morta
    if (this._perIlPopup()) {
      if (box.innerHTML) box.innerHTML = "";
      box.hidden = true;
      return;
    }
    if (!box._fatto) {
      box._fatto = true;
      box.innerHTML = "<h4>Dove va ogni pezzo</h4>"
        + "<p class='aiuto'>Prendi il nome, il valore, l'icona o una misura e "
        + "trascinali dove vuoi dentro alla casella qui sotto. Tocca un pezzo "
        + "e sul suo angolo compare un quadratino giallo: tienilo premuto e "
        + "trascina per ingrandirlo o rimpicciolirlo.</p>";
      const pista = document.createElement("div");
      pista.className = "pista";
      const carta = document.createElement("casa-tile");
      carta.setAttribute("solo-casella", "");
      carta.setAttribute("trascinabile", "");
      pista.appendChild(carta);
      box.appendChild(pista);
      this._grandezzaPista(box, pista, carta);
      box.appendChild(this._numeriGrandezza(box));
      box.appendChild(this._numeriPezzo(box));
      const sotto = document.createElement("div");
      sotto.className = "pista-tasti";
      const rimetti = document.createElement("button");
      rimetti.type = "button";
      rimetti.className = "tastoPiatto";
      rimetti.textContent = "Rimetti tutto a posto";
      // Il tasto butta via tutta la disposizione: una manata per sbaglio
      // gli faceva perdere il lavoro senza modo di tornare indietro. Ora la
      // disposizione la metto da parte e compare il tasto per riprenderla.
      const annulla = document.createElement("button");
      annulla.type = "button";
      annulla.className = "tastoPiatto";
      annulla.textContent = "Rimetti come prima";
      annulla.hidden = true;
      rimetti.addEventListener("click", () => {
        // e dimentico anche la misura piu' stretta che mi ero segnato: se
        // rifa la disposizione da capo, deve poterla rifare su quella di adesso
        const c0 = this._cfgPista() || {};
        const base = "casa-tile:misura3:" + (c0.entity || "") + "|" + (c0.name || "");
        try {
          localStorage.removeItem(base);
          localStorage.removeItem(base + "|pop");
        } catch (e) { /* pazienza */ }
        const ora = this._cfgPista().posti;
        if (ora && Object.keys(ora).length) box._salvati = ora;
        this._scriviPosti(null);
        this._aggiornaPista();
        annulla.hidden = !box._salvati;
        this._dico("disposizione tolta - puoi riprenderla col tasto qui di fianco");
      });
      annulla.addEventListener("click", () => {
        if (!box._salvati) return;
        this._scriviPosti(box._salvati);
        box._salvati = null;
        annulla.hidden = true;
        this._aggiornaPista();
        this._dico("disposizione ripresa");
      });
      // Il riquadro si stringe per stare nella finestra delle impostazioni,
      // e su una card larga diventa un francobollo: si sposta al buio e ci
      // si accorge di com'e' venuta solo dopo aver salvato. Con questo lo si
      // vede alla misura VERA, e il riquadro scorre.
      const vero = document.createElement("button");
      vero.type = "button";
      vero.className = "tastoPiatto";
      vero.textContent = "Grandezza vera";
      vero.addEventListener("click", () => {
        box._grande = !box._grande;
        vero.textContent = box._grande ? "Rimpicciolisci per starci" : "Grandezza vera";
        this._formaPista();
        if (box._carta && box._carta._aggiornaManiglia) box._carta._aggiornaManiglia();
      });
      sotto.appendChild(vero);
      sotto.appendChild(rimetti);
      sotto.appendChild(annulla);
      box.appendChild(sotto);
      box.appendChild(this._prendiDa(box));
      box.appendChild(this._codicePosti(box));
      const nota = document.createElement("div");
      nota.className = "pista-nota";
      nota.textContent = "pronto: tocca un pezzo qui sopra";
      box.appendChild(nota);
      box._nota = nota;
      box._carta = carta;
      // chi sto sistemando: la casella stessa o una scheda del suo pop-up
      const chi = document.createElement("div");
      chi.className = "pista-chi";
      box.insertBefore(chi, pista);
      box._chi = chi;
      this._pistaTrascina(carta);
    }
    this._aggiornaPista();
  }

  // LE DUE CASELLINE DELLA GRANDEZZA. Chi non vuole trascinare scrive il
  // numero e basta: fanno la stessa identica cosa del quadratino giallo.
  _numeriGrandezza(box) {
    const riga = document.createElement("div");
    riga.className = "pista-numeri";
    const eti = document.createElement("span");
    eti.textContent = "Grandezza";
    const largo = document.createElement("input");
    largo.type = "number";
    largo.min = "40"; largo.max = "2400"; largo.step = "1";
    largo.title = "Larghezza in punti";
    const per = document.createElement("span");
    per.className = "per";
    per.textContent = "\u00d7";
    const alto = document.createElement("input");
    alto.type = "number";
    alto.min = "40"; alto.max = "2400"; alto.step = "1";
    alto.title = "Altezza in punti";
    const punti = document.createElement("span");
    punti.className = "per";
    punti.textContent = "punti";
    riga.append(eti, largo, per, alto, punti);

    const manda = () => {
      const w = Math.max(40, Math.min(2400, Math.round(Number(largo.value) || 0)));
      const h = Math.max(40, Math.min(2400, Math.round(Number(alto.value) || 0)));
      if (!w || !h) return;
      const w0 = box._largoVero || w;
      const h0 = box._altoVero || h;
      if (w === Math.round(w0) && h === Math.round(h0)) return;
      box._tirata = { w, h };
      this._salvaGrandezza(w0, h0, w, h, true);
      this._formaPista();
      // la misura puo' essere finita su uno scatto della plancia: le
      // caselline devono dire quella vera, non quella chiesta
      largo.value = String(Math.round(box._largoVero || w));
      alto.value = String(Math.round(box._altoVero || h));
    };
    [largo, alto].forEach((c) => {
      c.addEventListener("change", manda);
      c.addEventListener("keydown", (e) => {
        if (e.key === "Enter") { e.preventDefault(); manda(); }
      });
    });
    box._numeri = { largo, alto };
    return riga;
  }

  // LE CASELLINE DEL PEZZO SCELTO: grandezza e posizione, da scrivere a
  // mano. Compaiono solo quando un pezzo e' scelto - se no sarebbe una
  // riga di campi che non comandano niente.
  _numeriPezzo(box) {
    const riga = document.createElement("div");
    riga.className = "pista-numeri";
    riga.hidden = true;
    const chi = document.createElement("span");
    chi.className = "chi";
    chi.textContent = "Pezzo";
    const e1 = document.createElement("span");
    e1.textContent = "grande";
    const gr = document.createElement("input");
    gr.type = "number";
    gr.min = "40"; gr.max = "300"; gr.step = "5";
    gr.title = "Grandezza del pezzo in percentuale";
    const p1 = document.createElement("span");
    p1.className = "per";
    p1.textContent = "%";
    const e2 = document.createElement("span");
    e2.textContent = "da sinistra";
    const px = document.createElement("input");
    px.type = "number";
    px.min = "0"; px.max = "100"; px.step = "0.5";
    px.title = "Quanto e' distante dal bordo sinistro, in percentuale";
    const e3 = document.createElement("span");
    e3.textContent = "dall'alto";
    const py = document.createElement("input");
    py.type = "number";
    py.min = "0"; py.max = "100"; py.step = "0.5";
    py.title = "Quanto e' distante dal bordo di sopra, in percentuale";
    const p2 = document.createElement("span");
    p2.className = "per";
    p2.textContent = "%";
    riga.append(chi, e1, gr, p1, e2, px, e3, py, p2);

    const manda = () => {
      const quale = box._carta && box._carta._pezzoScelto;
      if (!quale) return;
      const posti = { ...((this._cfgPista() || {}).posti || {}) };
      const v = { ...(posti[quale] || {}) };
      const k = Number(gr.value) / 100;
      if (isFinite(k) && k >= 0.4 && k <= 3) {
        if (Math.abs(k - 1) < 0.005) delete v.s;
        else v.s = Math.round(k * 100) / 100;
      }
      const x = Number(px.value);
      const y = Number(py.value);
      if (isFinite(x)) v.x = Math.max(0, Math.min(100, Math.round(x * 10) / 10));
      if (isFinite(y)) v.y = Math.max(0, Math.min(100, Math.round(y * 10) / 10));
      // "dx" e' quanto dista da DESTRA: si ricava dagli altri due - sulla
      // larghezza INGRANDITA, che e' quella che si vede - e senza rifarlo
      // il pezzo attaccato a destra tornerebbe dov'era
      if (isFinite(v.w) && isFinite(v.x)) {
        const k2 = Number(v.s) > 0 ? Number(v.s) : 1;
        v.dx = Math.round((100 - v.x - v.w * k2) * 10) / 10;
      }
      posti[quale] = v;
      this._scriviPosti(posti);
      this._aggiornaPista();
      this._dico("pezzo " + quale + ": " + Math.round((v.s || 1) * 100)
        + "% a " + v.x + "% " + v.y + "%");
    };
    [gr, px, py].forEach((c) => {
      c.addEventListener("change", manda);
      c.addEventListener("keydown", (e) => {
        if (e.key === "Enter") { e.preventDefault(); manda(); }
      });
    });
    box._numeriPezzo = { riga, chi, gr, px, py };
    return riga;
  }

  // IL QUADRATINO DELLA GRANDEZZA. Sta sull'angolo in basso a destra della
  // casellina del riquadro: si tiene premuto e si trascina, come si fa con
  // l'icona o con le scritte. Cambia la misura di quello che stai
  // sistemando: la scheda del pop-up che hai scelto, oppure - se non ne hai
  // scelta nessuna - la casella stessa sulla plancia.
  _grandezzaPista(box, pista, carta) {
    const q = document.createElement("div");
    q.className = "pista-grandezza";
    q.title = "Tieni premuto e trascina per cambiare la grandezza della casella";
    const targa = document.createElement("div");
    targa.className = "pista-grande-targa";
    targa.hidden = true;
    pista.append(q, targa);
    box._grandezza = q;

    // il quadratino sta sull'angolo della casellina, e la casellina si
    // muove ogni volta che il riquadro cambia forma
    q._sistema = () => {
      if (!carta.isConnected) { q.hidden = true; return; }
      const r = carta.getBoundingClientRect();
      const rp = pista.getBoundingClientRect();
      if (r.width < 20) { q.hidden = true; return; }
      q.hidden = false;
      q.style.left = (r.right - rp.left - 11 + pista.scrollLeft) + "px";
      q.style.top = (r.bottom - rp.top - 11 + pista.scrollTop) + "px";
      targa.style.left = (r.right - rp.left - 24 + pista.scrollLeft) + "px";
      targa.style.top = (r.bottom - rp.top - 34 + pista.scrollTop) + "px";
    };
    q._sistema();
    // e si risistema da solo: cambiando linguetta il riquadro sparisce e
    // ricompare, e mentre era chiuso di misure non ce n'erano - il
    // quadratino restava nascosto o fuori posto
    if (window.ResizeObserver) {
      try {
        const occhio = new ResizeObserver(() => q._sistema());
        occhio.observe(pista);
        occhio.observe(carta);
        box._occhioGrandezza = occhio;
      } catch (e) { /* pazienza */ }
    }

    // Quanto si sposta il bordo per ogni punto di larghezza in piu' non lo
    // do' per scontato: lo misuro mentre trascina (vedi "disegna"). Qui
    // metto solo la misura chiesta, rimpicciolita se non ci sta.
    const applica = (w, h) => {
      const posto = Math.max(190, (box.clientWidth || 420) - 28);
      let lw = w;
      let lh = h;
      if (w > posto && !box._grande) { lh = h * posto / w; lw = posto; }
      carta.style.width = Math.round(lw) + "px";
      carta.style.height = Math.round(lh) + "px";
      box._largoVero = w;
      box._altoVero = h;
      q._sistema();
    };

    let preso = null;
    let inCorso = 0;
    const disegna = () => {
      inCorso = 0;
      if (!preso) return;
      const r = carta.getBoundingClientRect();
      // se il riquadro non e' a video (altra linguetta, pannello chiuso) le
      // misure sono tutte zero: inseguire un angolo che non c'e' vuol dire
      // mandare la grandezza alle stelle
      if (!(r.width > 10) || !(r.height > 10)) return;
      // LA MISURA LA LEGGO SUL POSTO: quant'e' la distanza fra l'angolo di
      // sopra a sinistra della casellina e il dito. Niente indovinelli su
      // quanto si sposta il bordo: se la casellina sta in mezzo al riquadro
      // il conto si aggiusta da solo in due o tre fotogrammi.
      let vogLargo = (preso.px - preso.offX) - r.left;
      let vogAlto = (preso.py - preso.offY) - r.top;
      // LA CALAMITA. La casella si muove libera come vuole il dito, ma
      // quando passa vicino a una misura che la plancia sa dare davvero ci
      // si appoggia da sola. Fra uno scatto e l'altro ci sono trentadue
      // punti: la calamita ne prende dieci, quindi per ventidue punti su
      // trentadue il movimento e' libero e non si sente nessun gradino - e
      // il dito ci finisce sopra da solo, cosi' mollando non salta niente.
      if (preso.sezione > 0) {
        const passo = preso.sezione / 12;
        preso.col = Math.max(1, Math.min(12,
          Math.round(vogLargo * 12 / preso.sezione)));
        preso.righe = Math.max(1, Math.min(20, Math.round((vogAlto + 8) / 64)));
        const suScatto = preso.sezione * preso.col / 12;
        if (Math.abs(vogLargo - suScatto) < Math.min(10, passo * 0.35)) {
          vogLargo = Math.round(suScatto);
        }
        const altoScatto = preso.righe * 56 + (preso.righe - 1) * 8;
        if (Math.abs(vogAlto - altoScatto) < 12) vogAlto = altoScatto;
      }
      // e non oltre il bordo del riquadro: li' la figura verrebbe
      // rimpicciolita e l'angolo scapperebbe via dal dito
      const posto = Math.max(190, (box.clientWidth || 420) - 28);
      const alMuro = !box._grande && vogLargo >= posto;
      // Non piu' di 120 punti di cambiamento per fotogramma. Quando la
      // casellina si stringe molto il contenuto si rimescola di colpo e per
      // un fotogramma le misure che leggo sono senza senso: uno scarto piu'
      // grosso di cosi' e' un errore di lettura, non una richiesta.
      const frena = (voglio, ora) => {
        const d = voglio - ora;
        if (d > 120) return ora + 120;
        if (d < -120) return ora - 120;
        return voglio;
      };
      preso.w = Math.max(60, Math.min(2400,
        frena(alMuro ? posto : vogLargo, preso.w)));
      preso.h = Math.max(40, Math.min(2400, frena(vogAlto, preso.h)));
      preso.nw = Math.round(preso.w);
      preso.nh = Math.round(preso.h);
      box._tirata = { w: preso.nw, h: preso.nh };
      applica(preso.nw, preso.nh);
      targa.textContent = preso.nw + " \u00d7 " + preso.nh
        + (preso.sezione > 0
          ? "  (" + preso.col + " \u00d7 " + preso.righe + ")" : "");
      if (box._nota) {
        box._nota._occupata = true;
        box._nota.textContent = "riquadro " + preso.nw + "x" + preso.nh
          + (preso.sezione > 0
            ? " - sulla plancia sono " + preso.col
              + (preso.col === 1 ? " colonna per " : " colonne per ") + preso.righe
              + (preso.righe === 1 ? " riga" : " righe")
            : "")
          + (alMuro
            ? " - piu' larga non ci sta qui: premi \"Grandezza vera\" "
              + "oppure scrivi il numero qui sotto"
            : " - la stai tirando tu");
      }
    };
    const giu = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const r = carta.getBoundingClientRect();
      const w0 = box._largoVero || r.width;
      const h0 = box._altoVero || r.height;
      preso = {
        x: e.clientX, y: e.clientY, px: e.clientX, py: e.clientY,
        // il dito non e' esattamente sull'angolo: sta in mezzo al
        // quadratino, un dito piu' in dentro. Me lo segno una volta e lo
        // tolgo sempre, se no la casella parte con uno scatto.
        offX: e.clientX - r.right, offY: e.clientY - r.bottom,
        w: w0, h: h0, w0, h0, nw: 0, nh: 0,
        // QUANTO E' LARGA LA SEZIONE dove sta la casella sulla plancia: mi
        // serve per sapere quali misure la plancia sa dare davvero, e
        // agganciarcisi mentre tira invece che dopo. Dentro a un pop-up no:
        // li' la misura e' libera, e la sezione resta a zero.
        sezione: 0, col: 0, righe: 0,
      };
      const perLaPlancia = !(this._sceltaPercorso && this._sceltaPercorso.length);
      if (perLaPlancia) {
        const g0 = (this._config || {}).grid_options || {};
        let col = Number(g0.columns);
        if (!(col >= 1)) {
          try {
            const suo = carta.getGridOptions ? carta.getGridOptions() : null;
            col = Number(suo && suo.columns);
          } catch (e4) { /* pazienza */ }
        }
        if (!(col >= 1)) col = 4;
        preso.sezione = Math.max(120, w0 * 12 / col);
      }
      // E IL RIQUADRO NON SI ACCORCIA FINCHE' TENGO PREMUTO. Accorciando la
      // casella la colonna delle impostazioni ha meno roba da mostrare, il
      // browser fa scendere il contenuto per riempire il vuoto e la casella
      // scivola sotto il dito fermo: il conto legge un accorciamento che non
      // ho fatto io e in mezzo secondo la casella collassa.
      pista.style.minHeight = Math.round(pista.getBoundingClientRect().height) + "px";
      q.classList.add("inmano");
      targa.hidden = false;
      pista.style.userSelect = "none";
      try { q.setPointerCapture(e.pointerId); } catch (x) { /* pazienza */ }
      window.addEventListener("pointermove", muovi, true);
      window.addEventListener("pointerup", su, true);
      window.addEventListener("pointercancel", su, true);
    };
    const muovi = (e) => {
      if (!preso) return;
      e.preventDefault();
      e.stopPropagation();
      // a ogni pixel mi segno solo dov'e' il dito: il disegno si fa una
      // volta per fotogramma, se no si arranca
      preso.px = e.clientX;
      preso.py = e.clientY;
      if (!inCorso) inCorso = requestAnimationFrame(disegna);
    };
    const su = (e) => {
      window.removeEventListener("pointermove", muovi, true);
      window.removeEventListener("pointerup", su, true);
      window.removeEventListener("pointercancel", su, true);
      if (inCorso) cancelAnimationFrame(inCorso);
      inCorso = 0;
      if (preso && e) { preso.px = e.clientX; preso.py = e.clientY; }
      disegna();
      q.classList.remove("inmano");
      targa.hidden = true;
      pista.style.userSelect = "";
      pista.style.minHeight = "";
      if (box._nota) box._nota._occupata = false;
      if (!preso) return;
      const fatto = preso;
      preso = null;
      if (e) { e.preventDefault(); e.stopPropagation(); }
      if (!fatto.nw) return;
      this._salvaGrandezza(fatto.w0, fatto.h0, fatto.nw, fatto.nh);
    };
    q.addEventListener("pointerdown", giu);
    q.addEventListener("click", (e) => { e.preventDefault(); e.stopPropagation(); });
  }

  // e qui la grandezza tirata va a finire dove serve
  _salvaGrandezza(wPrima, hPrima, w, h, scritta) {
    const p = this._sceltaPercorso;
    if (p && p.length && p.length <= 2) {
      // una scheda del pop-up: la larghezza li' e' una percentuale di riga,
      // e quanto ne cambia si sa dal rapporto fra prima e adesso
      const chiave = p.join(".");
      const scheda = this._schedaA(p) || {};
      let quante = 12;
      if (p.length === 2) {
        const madre = this._schedaA([p[0]]) || {};
        quante = Math.max(1, Math.min(12, Math.round(
          Number(madre.columns) > 0 ? Number(madre.columns) : 3)));
      }
      const ora = this._misuraLarga(scheda, quante);
      // Quant'e' larga la riga dove sta? Lo ricavo: e' larga "ora per cento
      // della riga, meno la sua parte di stacco". Girando il conto viene
      // fuori la riga, e da li' la percentuale nuova - esatta, non stimata.
      const g = p.length === 2 ? 8 : 10;
      const riga = (Math.max(20, wPrima) + g) / Math.max(0.01, ora / 100) - g;
      let nuova = Math.max(8, Math.min(100, ((w + g) / (riga + g)) * 100));
      // e se passa vicino a una misura comoda ci si appoggia, come fa il
      // quadratino dell'anteprima - ma solo trascinando: a chi scrive 240
      // va dato 240, non "quasi meta' riga"
      if (!scritta) {
        [100, 75, 200 / 3, 50, 100 / 3, 25, 20].forEach((c) => {
          if (Math.abs(nuova - c) < 2.2) nuova = c;
        });
      }
      this._scriviMisura(chiave, Math.round(nuova * 10) / 10, Math.round(h), quante);
      // la misura buona adesso e' questa: se ne tira un'altra, si riparte
      // da qui e non da quella di quando l'aveva scelta
      this._misuraScelta = { w: Math.round(w), h: Math.round(h) };
      return;
    }
    // la casella stessa sulla plancia: li' comanda la misura di Home
    // Assistant, dodici colonne di larghezza e righe da 56 punti
    const g0 = this._config.grid_options || {};
    let col = Number(g0.columns);
    if (!(col >= 1)) {
      try {
        const box = this._postiBox;
        const suo = box && box._carta && box._carta.getGridOptions
          ? box._carta.getGridOptions() : null;
        col = Number(suo && suo.columns);
      } catch (e) { /* pazienza */ }
    }
    if (!(col >= 1)) col = 4;
    // Quant'e' larga la sezione dove sta? Lo ricavo: e' larga com'e' lei
    // moltiplicata per dodici e divisa per le sue colonne.
    const sezione = Math.max(120, wPrima * 12 / col);
    let nuoveCol = Math.max(1, Math.min(12, Math.round(w * 12 / sezione)));
    let righe = Math.max(1, Math.min(20, Math.round((h + 8) / 64)));
    // SCRIVERE UN NUMERO VUOL DIRE VOLERSI MUOVERE. La larghezza va per
    // dodicesimi: da 362 punti - che sono gia' 12 colonne su 12 - qualunque
    // numero si scriva l'arrotondamento riporta a 12, e sembra che il campo
    // non funzioni. Se il numero scritto e' piu' piccolo, si scende almeno
    // di una colonna; se e' piu' grande, si sale almeno di una.
    let alMassimo = false;
    let alMinimo = false;
    if (scritta) {
      const colOra = Math.max(1, Math.min(12, Math.round(wPrima * 12 / sezione)));
      if (nuoveCol === colOra) {
        if (w < wPrima - 2) {
          if (colOra > 1) nuoveCol = colOra - 1; else alMinimo = true;
        } else if (w > wPrima + 2) {
          if (colOra < 12) nuoveCol = colOra + 1; else alMassimo = true;
        }
      }
      const righeOra = Math.max(1, Math.min(20, Math.round((hPrima + 8) / 64)));
      if (righe === righeOra) {
        if (h < hPrima - 2 && righeOra > 1) righe = righeOra - 1;
        else if (h > hPrima + 2 && righeOra < 20) righe = righeOra + 1;
      }
    }
    const g = { ...g0, columns: nuoveCol, rows: righe };
    this._config = { ...this._config, grid_options: g };
    // E QUESTA E' LA MISURA CHE AVRA' DAVVERO, non quella chiesta: la
    // plancia va a scatti - dodicesimi di larghezza e righe da 56 punti -
    // e mostrare i punti chiesti voleva dire far vedere una figura che poi
    // sulla plancia veniva su diversa.
    w = Math.round(sezione * nuoveCol / 12);
    h = righe * 56 + (righe - 1) * 8;
    const box0 = this._postiBox;
    if (box0) box0._tirata = { w, h };
    // e me la segno come misura vera: l'anteprima di fianco si veste con
    // quella, e senza aggiornarla restava della grandezza di prima
    const c = this._config || {};
    if (c.entity || c.name) {
      const base = "casa-tile:misura3:" + (c.entity || "") + "|" + (c.name || "");
      try {
        localStorage.setItem(base, Math.round(w) + "x" + Math.round(h));
      } catch (e) { /* pazienza */ }
    }
    this._conservaPosto(() => this._emetti());
    if (scritta) {
      this._dico(alMassimo
        ? "e' gia' larga tutta la sezione: 12 colonne su 12, piu' di cosi' non puo'"
        : alMinimo
        ? "e' gia' stretta al minimo: 1 colonna su 12"
        : "sulla plancia sono " + nuoveCol
          + (nuoveCol === 1 ? " colonna per " : " colonne per ") + righe
          + (righe === 1 ? " riga" : " righe") + " - " + Math.round(w)
          + "x" + Math.round(h) + " punti");
    }
    // e glielo dico: l'anteprima e' un'altra casella, appesa da un'altra
    // parte della pagina, e da sola non si accorge di niente
    this.dispatchEvent(new CustomEvent("casa-rivestiti", {
      detail: { config: c }, bubbles: true, composed: true,
    }));
  }

  // quanto e' larga adesso, in percentuale di riga
  _misuraLarga(cfg, base) {
    const c = cfg || {};
    const b = Number(base) >= 1 ? Number(base) : 12;
    const mio = c.casa_misura || {};
    if (Number(mio.largo) > 0) return Number(mio.largo);
    const g = c.grid_options || {};
    const col = g.columns === "full" ? b : Number(g.columns);
    if (isFinite(col) && col >= 1) return (Math.min(col, b) / b) * 100;
    return b === 12 ? 100 : 100 / b;
  }

  // GUARDA COME SI APRE, senza salvare. Apre la finestra dell'anteprima
  // qui e ora, con l'animazione e la velocita' che ha davanti adesso.
  _provaApertura() {
    if (this._provaBox) return this._provaBox;
    const riga = document.createElement("div");
    riga.className = "prendi-da";
    const tasto = document.createElement("button");
    tasto.type = "button";
    tasto.className = "tastoPiatto";
    tasto.textContent = "Guarda come si apre";
    const dice = document.createElement("span");
    dice.textContent = "si apre qui di fianco - chiudila con la X o con Esc";
    tasto.addEventListener("click", () => {
      const c = this._config || {};
      if ((c.azione || "toggle") !== "finestra") {
        this._dico("questa casella al tocco non apre un pop-up");
        return;
      }
      window.dispatchEvent(new CustomEvent("casa-prova-apertura", {
        detail: { config: c },
      }));
    });
    riga.append(tasto, dice);
    this._provaBox = riga;
    return riga;
  }

  // PRENDI LA DISPOSIZIONE DA UN'ALTRA CASELLA. Niente copia e incolla: si
  // sceglie da quale e si preme. Arrivano le posizioni dei pezzi, le misure
  // con cui erano state composte e la grandezza; l'entita', il valore, il
  // nome e il servizio restano quelli di questa casella.
  _prendiDa(box) {
    const riga = document.createElement("div");
    riga.className = "prendi-da";
    riga.hidden = true;
    const eti = document.createElement("span");
    eti.textContent = "Prendi la disposizione da";
    const scelta = document.createElement("select");
    const tasto = document.createElement("button");
    tasto.type = "button";
    tasto.className = "tastoPiatto";
    tasto.textContent = "Prendi";
    riga.append(eti, scelta, tasto);

    // tutte le caselle nostre del pop-up che una disposizione ce l'hanno,
    // piu' la casella grande
    const elenco = () => {
      const fuori = [];
      const mia = (this._sceltaPercorso || []).join(".");
      const c0 = this._config || {};
      if (c0.posti && Object.keys(c0.posti).length && mia !== "") {
        fuori.push({ id: "", nome: "questa casella (quella grande)" });
      }
      const gira = (lista, base) => {
        (lista || []).forEach((c, i) => {
          if (!c) return;
          const qui = base.concat([i]);
          const id = qui.join(".");
          if (String(c.type || "") === "custom:casa-tile"
            && c.posti && Object.keys(c.posti).length && id !== mia) {
            fuori.push({ id, nome: c.name || c.entity || ("scheda " + (i + 1)) });
          }
          if (Array.isArray(c.cards)) gira(c.cards, qui);
        });
      };
      gira(this._schede(), []);
      return fuori;
    };

    const rinfresca = () => {
      const voci = elenco();
      riga.hidden = voci.length === 0;
      const prima = scelta.value;
      scelta.innerHTML = "";
      voci.forEach((v) => {
        const o = document.createElement("option");
        o.value = v.id;
        o.textContent = v.nome;
        scelta.appendChild(o);
      });
      if (voci.some((v) => v.id === prima)) scelta.value = prima;
    };

    tasto.addEventListener("click", () => {
      const da = scelta.value;
      const sorgente = da === ""
        ? this._config
        : this._schedaA(da.split(".").map((n) => Number(n)));
      if (!sorgente || !sorgente.posti) {
        this._dico("quella casella non ha una disposizione");
        return;
      }
      const roba = {};
      ["casa_misura", "posti_largo", "posti_alto", "posti"].forEach((k) => {
        if (sorgente[k] !== undefined) roba[k] = sorgente[k];
      });
      const p = this._sceltaPercorso;
      if (!p || !p.length) {
        this._config = { ...this._config, ...roba };
        this._emetti();
      } else {
        const vecchia = this._schedaA(p);
        if (!vecchia) return;
        this._salvaSchede(this._conScheda(p, { ...vecchia, ...roba }), false);
      }
      this._aggiornaPista();
      this._dico("disposizione presa da \"" + (scelta.selectedOptions[0]
        ? scelta.selectedOptions[0].textContent : da) + "\"");
    });

    box._prendiDa = { riga, rinfresca };
    rinfresca();
    return riga;
  }

  // IL CODICE DELLA DISPOSIZIONE, in YAML. Dove sta ogni pezzo, tutto
  // insieme: da guardare, da correggere al decimale, e soprattutto da
  // COPIARE per portare la stessa disposizione su un'altra card.
  _codicePosti(box) {
    const fuori = document.createElement("div");
    fuori.className = "codice-scheda codice-posti";
    const apri = document.createElement("button");
    apri.className = "bt chiaro";
    apri.type = "button";
    apri.textContent = "Codice di questa casella (YAML)";
    const dentro = document.createElement("div");
    dentro.hidden = true;
    const esito = document.createElement("div");
    esito.className = "esito";

    // quello che si sta sistemando: la casella, o la scheda scelta
    // Tutti i pezzi, non solo quelli gia' spostati: chi ha una posizione
    // salvata con quella, gli altri con quella che hanno adesso. Se no non
    // li puoi correggere da qui - "manca il valore".
    // TUTTA la configurazione della casella che sta sistemando: la grande,
    // oppure la singola scheda del pop-up che ha scelto - anche se vive
    // dentro a una griglia. Le posizioni dei pezzi le completo con quelle
    // che i pezzi hanno adesso, se no chi non e' mai stato spostato non
    // compare e non lo puoi correggere da qui.
    const roba = () => {
      const c = this._cfgPista() || {};
      const d = { ...c };
      let ora = null;
      try {
        ora = box._carta && box._carta.posizioniAdesso
          ? box._carta.posizioniAdesso() : null;
      } catch (e) { ora = null; }
      const salvati = (c.posti && Object.keys(c.posti).length) ? c.posti : null;
      if (salvati || (ora && Object.keys(ora).length)) {
        d.posti = { ...(ora || {}), ...(salvati || {}) };
      }
      const lw = Number(c.posti_largo) > 0 ? c.posti_largo : box._largoVero;
      const lh = Number(c.posti_alto) > 0 ? c.posti_alto : box._altoVero;
      if (Number(lw) > 40) d.posti_largo = Math.round(lw);
      if (Number(lh) > 40) d.posti_alto = Math.round(lh);
      return d;
    };

    // UNA RIGA PER PEZZO. L'editor di Home Assistant riscriverebbe il
    // codice a modo suo - sei righe per ogni pezzo - e con sei pezzi
    // diventano quaranta righe di numeri incolonnati. Qui il pezzo sta su
    // una riga sola e i numeri sono al decimo, che e' la precisione con cui
    // si lavora (basta con i 69.80000000000001).
    // Tutto in YAML normale, tranne le posizioni dei pezzi: quelle una
    // riga per pezzo, che con sei righe a testa diventavano quaranta righe
    // di numeri incolonnati.
    const inRiga = (d) => {
      const num = (v) => String(Math.round(Number(v) * 10) / 10);
      const senzaPosti = { ...d };
      delete senzaPosti.posti;
      const fuori = [];
      const resto = aYaml(senzaPosti, 0);
      if (resto && resto.trim()) fuori.push(resto.replace(/\n+$/, ""));
      const pz = d.posti || {};
      const nomi = Object.keys(pz);
      if (nomi.length) {
        fuori.push("posti:");
        nomi.forEach((k) => {
          const v = pz[k] || {};
          const parti = [];
          ["x", "y", "w", "h", "dx", "s"].forEach((n) => {
            if (v[n] !== undefined && v[n] !== null && isFinite(v[n])) {
              parti.push(n + ": " + num(v[n]));
            }
          });
          const nome = /^[A-Za-z0-9_]+$/.test(k) ? k : '"' + k + '"';
          fuori.push("  " + nome + ": {" + parti.join(", ") + "}");
        });
      }
      return fuori.join("\n") + "\n";
    };

    let leggi = null;
    let edHa = null;
    const conCasella = () => {
      const area = document.createElement("textarea");
      area.rows = 10;
      area.spellcheck = false;
      area.value = inRiga(roba());
      dentro.appendChild(area);
      leggi = () => daYaml(area.value);
      edHa = area;
    };

    const applica = document.createElement("button");
    applica.className = "bt";
    applica.type = "button";
    applica.textContent = "Applica il codice";
    applica.hidden = true;
    applica.addEventListener("click", () => {
      try {
        const d = leggi ? leggi() : null;
        if (!d || typeof d !== "object") throw new Error("codice vuoto");
        if (d.posti && typeof d.posti !== "object") {
          throw new Error('"posti" deve essere un elenco di pezzi');
        }
        // CON "type:" si riscrive la casella intera; SENZA si cambiano solo
        // le righe incollate e tutto il resto resta com'e'. E' cosi' che si
        // porta una disposizione da una casella all'altra senza portarsi
        // dietro il valore, l'entita' e il nome.
        const intera = !!d.type;
        const metti = (vecchia) => {
          const c2 = intera ? { ...d } : { ...(vecchia || {}), ...d };
          const puliti = this._postiPuliti(d.posti || null);
          // le due ancore devono dire la stessa cosa: rifaccio "dx" dagli
          // altri numeri, sulla larghezza ingrandita che e' quella che si vede
          if (puliti) {
            Object.keys(puliti).forEach((k) => {
              const v = puliti[k] || {};
              const w = Number(v.w);
              const x = Number(v.x);
              const k2 = Number(v.s) > 0 ? Number(v.s) : 1;
              if (isFinite(w) && isFinite(x)) {
                v.dx = Math.round((100 - x - w * k2) * 10) / 10;
              }
            });
          }
          if (puliti) c2.posti = puliti; else delete c2.posti;
          if (Number(d.posti_largo) > 40) c2.posti_largo = Math.round(d.posti_largo);
          else delete c2.posti_largo;
          if (Number(d.posti_alto) > 40) c2.posti_alto = Math.round(d.posti_alto);
          else delete c2.posti_alto;
          return c2;
        };
        const p = this._sceltaPercorso;
        // com'era prima: se dopo non e' cambiato niente glielo dico, se no
        // "non e' successo niente" e "non funziona" si assomigliano troppo
        let prima = "";
        try { prima = JSON.stringify(this._cfgPista() || {}); } catch (e) { prima = ""; }
        if (!p || !p.length) {
          this._config = metti(this._config);
          this._emetti();
          this._costruisciBlocco(true);
          this._aggiornaSchemi();
        } else {
          const vecchia = this._schedaA(p);
          if (!vecchia) throw new Error("la scheda scelta non c'e' piu'");
          this._salvaSchede(this._conScheda(p, metti(vecchia)), false);
        }
        let dopo = "";
        try { dopo = JSON.stringify(this._cfgPista() || {}); } catch (e) { dopo = "x"; }
        const uguale = prima && dopo && prima === dopo;
        esito.textContent = uguale
          ? "era gia' cosi': non e' cambiato niente" : "";
        this._aggiornaPista();
        this._dico(uguale
          ? "era gia' cosi': non e' cambiato niente"
          : (intera ? "casella riscritta dal codice"
            : "cambiate solo le righe che hai incollato"));
      } catch (e) {
        esito.textContent = "Codice non valido: " + e.message;
      }
    });

    // SOLO LA DISPOSIZIONE E LA MISURA: quello che serve per replicare una
    // casella su un'altra senza portarsi dietro entita', valore e nome.
    const copia = document.createElement("button");
    copia.className = "bt chiaro";
    copia.type = "button";
    copia.textContent = "Copia la disposizione";
    copia.title = "Mette negli appunti solo la disposizione e la grandezza: "
      + "incollale nel codice di un'altra casella e premi Applica";
    copia.hidden = true;
    copia.addEventListener("click", async () => {
      const tutto = roba();
      const solo = {};
      ["casa_misura", "grid_options", "posti_largo", "posti_alto", "posti"]
        .forEach((k) => { if (tutto[k] !== undefined) solo[k] = tutto[k]; });
      // nel cassetto mio: e' quello che conta, e non dipende dal browser
      APPUNTI_POSTI = {
        roba: solo,
        da: (this._cfgPista() || {}).name || "un'altra casella",
      };
      // e nei suoi appunti veri, se il browser li da' (fuori da https no)
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(inRiga(solo));
        }
      } catch (e) { /* pazienza, il cassetto basta */ }
      vediIncolla();
      esito.textContent = "disposizione messa da parte: vai sull'altra "
        + "casella e premi \"Incolla la disposizione\"";
    });

    // e il tasto per rimetterla dove serve
    const incolla = document.createElement("button");
    incolla.className = "bt";
    incolla.type = "button";
    incolla.hidden = true;
    incolla.addEventListener("click", () => {
      if (!APPUNTI_POSTI || !APPUNTI_POSTI.roba) return;
      const d = APPUNTI_POSTI.roba;
      const p = this._sceltaPercorso;
      if (!p || !p.length) {
        this._config = { ...this._config, ...d };
        this._emetti();
      } else {
        const vecchia = this._schedaA(p);
        if (!vecchia) return;
        this._salvaSchede(this._conScheda(p, { ...vecchia, ...d }), false);
      }
      this._aggiornaPista();
      esito.textContent = "";
      this._dico("disposizione presa da \"" + APPUNTI_POSTI.da + "\"");
    });
    const vediIncolla = () => {
      const ce = !!(APPUNTI_POSTI && APPUNTI_POSTI.roba);
      incolla.hidden = dentro.hidden || !ce;
      if (ce) {
        incolla.textContent = "Incolla la disposizione di \""
          + APPUNTI_POSTI.da + "\"";
      }
    };

    let costruito = false;
    apri.addEventListener("click", async () => {
      if (!costruito) {
        costruito = true;
        conCasella();
      } else if (edHa) {
        // riaprendolo, i numeri devono essere quelli di adesso: nel
        // frattempo puo' aver spostato mezza casella con il dito
        try { edHa.value = inRiga(roba()); } catch (e) { /* pazienza */ }
      }
      const chiuso = dentro.hidden;
      dentro.hidden = !chiuso;
      applica.hidden = !chiuso;
      copia.hidden = !chiuso;
      vediIncolla();
      esito.textContent = chiuso
        ? "Con la riga \"type:\" riscrivi tutta la casella; senza, cambi "
          + "solo le righe che incolli."
        : "";
    });

    fuori.append(apri, dentro, applica, copia, incolla, esito);
    // se il riquadro cambia padrone - un'altra card, un'altra scheda del
    // pop-up - il codice si riscrive da solo. Ma non mentre ci sta
    // scrivendo dentro: sarebbe peggio del male.
    box._codicePosti = {
      apri,
      dentro,
      rinfresca: () => {
        if (dentro.hidden || !edHa) return;
        try {
          if (edHa.ownerDocument.activeElement === edHa) return;
          edHa.value = inRiga(roba());
        } catch (e) { /* pazienza */ }
      },
    };
    return fuori;
  }

  _aggiornaPista() {
    const box = this._postiBox;
    if (!box || !box._carta || !this._hass) return;
    try {
      box._carta.setConfig({ ...this._cfgPista() });
      // LA CASSA CHE SEGUE LA CASELLA VERA. Il riquadro qui dentro e' una
      // casella nuova di zecca: da sola non puo' sapere quale cassa stavo
      // guardando, e ripartiva da quella scritta nella configurazione -
      // spesso ferma, quindi senza copertina, senza sfondo e senza barra del
      // tempo proprio mentre lui sistema i pezzi. Gliela chiedo alla casella
      // vera che sta sulla plancia.
      const vera = this._cartaVera();
      if (vera && vera._scelto) {
        box._carta._scelto = vera._scelto;
        box._carta._suonavano = vera._suonavano;
      }
      // e anche lo STORICO, che il riquadro non chiede mai per non
      // appesantire: senza, il grafico non lo disegna e tu componi sopra
      // una casella che non ha quello che ha la card vera
      if (vera && vera._storia && vera._storia.length) {
        box._carta._storia = vera._storia;
      }
      box._carta.hass = this._hass;
    } catch (e) { /* una configurazione a meta' non deve rompere niente */ }
    this._diciChi();
    if (box._codicePosti && box._codicePosti.rinfresca) {
      box._codicePosti.rinfresca();
    }
    if (box._prendiDa && box._prendiDa.rinfresca) box._prendiDa.rinfresca();
    this._formaPista();
    if (!box._guarda && window.ResizeObserver) {
      const vera0 = this._cartaVera();
      if (vera0) {
        box._guarda = new ResizeObserver(() => this._formaPista());
        box._guarda.observe(vera0);
      }
    }
    clearTimeout(this._ricontrolla);
    this._ricontrolla = setTimeout(() => this._formaPista(), 350);
    clearTimeout(this._ricontrolla2);
    this._ricontrolla2 = setTimeout(() => this._formaPista(), 1200);
    clearTimeout(this._rimedio);
    this._rimedio = setTimeout(() => this._rimediaVecchi(box._carta), 500);
  }




  // Sto sistemando una casella che vive dentro a un pop-up? Lo capisco dal
  // fatto che sopra di me c'e' un altro editor casa-tile: quello della
  // casella che il pop-up ce l'ha.
  _perIlPopup() {
    let n = this;
    for (let i = 0; i < 40; i += 1) {
      n = n.parentNode || n.host;
      if (!n) return false;
      if (n.localName === "casa-tile-editor") return true;
      const cl = (n.classList && n.classList.contains) ? n.classList : null;
      if (cl && (cl.contains("f-corpo") || cl.contains("popup-anteprima"))) return true;
    }
    return false;
  }

  // la casellina del riquadro prende la misura esatta dell'anteprima
  _formaPista() {
    const box = this._postiBox;
    if (!box || !box._carta) return;
    let largo = 0;
    let alto = 0;
    // 1) la misura che la card si e' segnata quando stava sulla plancia
    //    FUORI dalla modifica: e' quella vera, quella che vedra' lui.
    // 0) se sta sistemando una scheda del pop-up: la misura che ha li'
    let daRicordo = false;
    // 00) la misura che ha appena dato lui tirando il quadratino giallo:
    //     comanda su tutto, se no il riquadro tornerebbe indietro
    let daLui = false;
    if (box._tirata && box._tirata.w > 40 && box._tirata.h > 20) {
      largo = box._tirata.w;
      alto = box._tirata.h;
      daRicordo = true;
      daLui = true;
    }
    const scelta = (!largo && this._sceltaPercorso && this._sceltaPercorso.length)
      ? this._misuraScelta : null;
    // Anche se e' piccola: una casella dentro a una griglia e' larga
    // novanta punti scarsi, e scartandola finivo per mostrare (e per
    // misurare) tutt'altra card.
    if (!largo && scelta && scelta.w > 40 && scelta.h > 24) {
      largo = scelta.w;
      alto = scelta.h;
      daRicordo = true;
    }
    const c0 = this._cfgPista() || {};
    if (!largo && (c0.entity || c0.name)) {
      // se sto sistemando una casella del pop-up, la misura buona e' quella
      // che ha DENTRO al pop-up, non quella di una casella sulla plancia
      const base = "casa-tile:misura3:" + (c0.entity || "") + "|" + (c0.name || "");
      const dentroPop = this._perIlPopup()
        || !!(this._sceltaPercorso && this._sceltaPercorso.length);
      const chiavi = dentroPop ? [base + "|pop", base] : [base, base + "|pop"];
      for (let i = 0; i < chiavi.length && !daRicordo; i += 1) {
        try {
          const pezzi = String(localStorage.getItem(chiavi[i]) || "").split("x");
          const w = Number(pezzi[0]);
          const h = Number(pezzi[1]);
          // sotto ai 90px non e' una casella su cui si possa comporre
          // qualcosa: meglio l'anteprima che un francobollo
          if (w > 90 && h > 40) {
            largo = w; alto = h; daRicordo = true;
            this._ricordoDalPopup = chiavi[i].indexOf("|pop") > 0;
          }
        } catch (e) { /* pazienza */ }
      }
    }
    // 2) se non se l'e' segnata, la card com'e' adesso sulla plancia
    const plancia = largo ? null : this._cartaPlancia();
    if (plancia) {
      const q = plancia.getBoundingClientRect();
      if (q.width > 90 && q.height > 40) { largo = q.width; alto = q.height; }
    }
    // 3) se non e' su nessuna plancia (card appena creata), l'anteprima
    const vera = largo ? null : this._cartaVera();
    if (vera) {
      // ATTENZIONE: misuro la CASELLA, non tutto l'elemento: sotto alla
      // casella l'anteprima si porta dietro il riquadro del pop-up, che e'
      // piu' grande, e cosi' la casellina veniva larga il doppio
      const suaCard = vera.shadowRoot && vera.shadowRoot.querySelector("ha-card");
      const q = (suaCard || vera).getBoundingClientRect();
      if (q.width > 40 && q.height > 20) { largo = q.width; alto = q.height; }
    }
    if (!largo) {
      const g = this._config.grid_options || {};
      const col = Number(g.columns) > 0 ? Number(g.columns) : 4;
      const rig = Number(g.rows) > 0 ? Number(g.rows) : 2;
      largo = Math.round(col / 12 * 500);
      alto = rig * 56 + (rig - 1) * 8;
    }
    // Un filo piu' piccola dell'anteprima, ma SEMPRE in proporzione: se
    // stringessi solo la larghezza cambierebbe forma e i pezzi finirebbero
    // in un punto qui e in un altro sulla plancia.
    // ESATTAMENTE la misura dell'anteprima: bastano pochi pixel di
    // differenza e le misure vanno a capo in un modo qui e in un altro la',
    // quindi le due caselle sembrano diverse.
    // l'altezza VERA della casella, prima di rimpicciolirla per farla stare
    // nella finestra: serve a chi compone i pezzi con l'altezza automatica
    box._altoVero = alto;
    box._largoVero = largo;
    const posto = Math.max(190, (box.clientWidth || 420) - 28);
    // NON LE CAMBIO LA MISURA: la guardo da piu' lontano. Rimpicciolirla
    // per davvero voleva dire impaginarla in un altro modo - i tasti del
    // lettore andavano a capo diversi, la scala cambiava - e il riquadro
    // faceva vedere una casella che non era quella.
    const fetta = (largo > posto && !box._grande) ? posto / largo : 1;
    const stretta = fetta < 1;
    const quanto = Math.round(fetta * 100);
    const pista = box.querySelector(".pista");
    if (pista) pista.classList.toggle("larga", !!box._grande && largo > posto);
    box._carta.style.width = Math.round(largo) + "px";
    box._carta.style.height = Math.round(alto) + "px";
    if (stretta) {
      box._carta.style.transformOrigin = "top left";
      box._carta.style.transform = "scale(" + (Math.round(fetta * 1000) / 1000) + ")";
      // rimpicciolendola resta il buco dello spazio che non occupa piu':
      // questi due se lo riprendono
      box._carta.style.marginRight = "-" + Math.round(largo * (1 - fetta)) + "px";
      box._carta.style.marginBottom = "-" + Math.round(alto * (1 - fetta)) + "px";
    } else if (box._carta.style.transform) {
      box._carta.style.transform = "";
      box._carta.style.marginRight = "";
      box._carta.style.marginBottom = "";
    }
    // e la prende ESATTA: la casella ha un'altezza minima sua (116 punti)
    // e il riquadro veniva fuori piu' alto della card vera - erano le due
    // figure che non combaciavano
    box._carta.toggleAttribute("misura-fissa", true);
    if (box._grandezza) box._grandezza._sistema();
    // le due caselline dicono sempre dove si e' arrivati - ma non mentre
    // ci sta scrivendo dentro
    if (box._numeri) {
      const dentro = box._numeri.largo.ownerDocument.activeElement;
      if (dentro !== box._numeri.largo) {
        box._numeri.largo.value = String(Math.round(box._largoVero || 0));
      }
      if (dentro !== box._numeri.alto) {
        box._numeri.alto.value = String(Math.round(box._altoVero || 0));
      }
    }
    // scritto nero su bianco da dove ho preso la misura: se il riquadro non
    // combacia con la plancia, si vede subito da qui il perche'
    if (box._nota && !box._nota._occupata) {
      box._nota.textContent = "riquadro " + Math.round(largo) + "x"
        + Math.round(alto) + (stretta ? " (guardata al " + quanto
          + "%: premi \"Grandezza vera\" per vederla a grandezza naturale)" : "")
        + " - " + (daLui
          ? "la misura che hai dato tu"
          : daRicordo
          ? (this._ricordoDalPopup
            ? "misura vera della casella dentro al pop-up"
            : "misura vera della card sulla plancia")
          : (plancia ? "misura della card mentre la plancia e' in modifica"
            : (vera ? "misura dell'anteprima: la card non l'ho trovata sulla plancia"
              : "misura calcolata dalle colonne del Layout")));
    }
  }

  // La casella vera dell'anteprima. Attenzione: DENTRO la finestra delle
  // impostazioni e basta. Dietro alla finestra c'e' la plancia con tutte le
  // altre caselle, e cercando in tutta la pagina finivo per misurare una di
  // quelle, che e' larga tutt'altro.
  // la finestra delle impostazioni che mi contiene (e la cima, se non c'e')
  _finestraMia() {
    let cima = this;
    let dialogo = null;
    for (let i = 0; i < 60; i += 1) {
      const p = cima.parentNode || cima.host;
      if (!p) break;
      cima = p;
      const nome = String(cima.localName || "");
      if (nome.indexOf("dialog") >= 0 || nome === "hui-dialog-edit-card") {
        dialogo = cima;
        break;
      }
    }
    return { dialogo: dialogo, cima: cima };
  }

  // La stessa casella FUORI dalla finestra: e' quella vera sulla plancia,
  // con la misura che le da' il "Layout" di Home Assistant (colonne e
  // righe). E' quella che deve fare da modello al riquadro, se no lui
  // compone su una forma e poi sulla plancia ne trova un'altra.
  _cartaPlancia() {
    if (this._planciaSalvata && this._planciaSalvata.isConnected) {
      return this._planciaSalvata;
    }
    // Girare tutta la pagina costa: lo faccio UNA volta per ogni casella
    // che sto sistemando. Prima, quando non la trovavo (e' il caso delle
    // caselle che vivono solo dentro ai pop-up), rifacevo il giro a ogni
    // ricontrollo e la finestra delle impostazioni si trascinava.
    const chi = (this._config || {}).entity + "|" + (this._config || {}).name;
    if (this._planciaCercata === chi) return null;
    this._planciaCercata = chi;
    // una scheda che vive dentro al pop-up sulla plancia non c'e': il giro
    // di tutta la pagina sarebbe fatica buttata via
    if (this._perIlPopup()) return null;
    const { dialogo, cima } = this._finestraMia();
    const mia = this._config || {};
    if (!mia.entity && !mia.name) return null;
    // la plancia e' grande: di nodi da girare ce ne vogliono tanti
    let restano = 120000;
    let precisa = null;
    // dentro a un pop-up? allora non e' lei la card sulla plancia
    const dentroUnaltra = (el) => {
      let n = el;
      for (let i = 0; i < 14; i += 1) {
        n = n.parentNode || n.host;
        if (!n) return false;
        if (n.localName === "casa-tile") return true;
      }
      return false;
    };
    const cerca = (n) => {
      if (!n || restano <= 0 || precisa) return;
      if (n === dialogo) return;   // dentro alla finestra non guardo
      restano -= 1;
      if (n.nodeType === 1) {
        if (n.localName === "casa-tile" && !n.hasAttribute("solo-casella")) {
          const suo = n._config || {};
          // nome E entita' uguali: la sola entita' non basta, gli stessi
          // comandi rapidi (0W, 95W, 110W...) la condividono e sono grandi
          // come un francobollo
          if (suo.entity === mia.entity
              && String(suo.name || "") === String(mia.name || "")
              && n.getBoundingClientRect().width > 40
              && !dentroUnaltra(n)) {
            precisa = n;
            return;
          }
        }
        if (n.shadowRoot) cerca(n.shadowRoot);
      }
      const figli = n.children || [];
      for (let i = 0; i < figli.length && !precisa; i += 1) cerca(figli[i]);
    };
    try { cerca(document.body || cima); } catch (e) { /* pazienza */ }
    this._planciaSalvata = precisa;
    this._nodiGirati = 120000 - restano;
    return this._planciaSalvata;
  }

  _cartaVera() {
    if (this._veraSalvata && this._veraSalvata.isConnected) return this._veraSalvata;
    const { dialogo, cima } = this._finestraMia();
    const partenza = dialogo || cima;
    const mia = JSON.stringify(this._config || {});
    let restano = 8000;
    const trovate = [];
    const cerca = (n) => {
      if (!n || restano <= 0) return;
      restano -= 1;
      if (n.nodeType === 1) {
        if (n.localName === "casa-tile" && !n.hasAttribute("solo-casella")) {
          trovate.push(n);
        }
        if (n.shadowRoot) cerca(n.shadowRoot);
      }
      const figli = n.children || [];
      for (let i = 0; i < figli.length; i += 1) cerca(figli[i]);
    };
    try { cerca(partenza); } catch (e) { /* pazienza */ }
    // fra quelle trovate scelgo quella che ha la MIA configurazione
    let vera = trovate.find((c) => {
      try { return JSON.stringify(c._config || {}) === mia; } catch (e) { return false; }
    });
    if (!vera) {
      vera = trovate.find((c) => c._config
        && c._config.entity === (this._config || {}).entity);
    }
    if (!vera && dialogo) vera = trovate[0] || null;
    this._veraSalvata = vera || null;
    return this._veraSalvata;
  }



  // il trascinamento vero e proprio
  // Passando a mano libera ogni pezzo prende la sua misura naturale, che
  // puo' essere piu' larga di quando stavano in fila (in fila si stringono
  // a vicenda). Cosi' due misure possono finire una sull'altra. Questa
  // passata le distanzia, e la faccio UNA volta sola: quando trascina lui
  // il pezzo resta esattamente dove l'ha lasciato.
  _sbrogliaPosti(posti) {
    const fuori = { ...posti };
    const chiavi = Object.keys(fuori).filter((k) => k !== "misure"
      && k !== "_base" && fuori[k]
      && isFinite(fuori[k].x) && isFinite(fuori[k].w) && isFinite(fuori[k].h));
    chiavi.sort((a, b) => (fuori[a].y - fuori[b].y) || (fuori[a].x - fuori[b].x));
    const tocca = (a, b) => a.x < b.x + b.w - 0.6 && a.x + a.w > b.x + 0.6
      && a.y < b.y + b.h - 0.6 && a.y + a.h > b.y + 0.6;
    const messi = [];
    chiavi.forEach((k) => {
      const p = { ...fuori[k] };
      for (let giro = 0; giro < 20; giro += 1) {
        const sotto = messi.find((m) => tocca(p, m));
        if (!sotto) break;
        p.y = Math.round((sotto.y + sotto.h + 1.2) * 10) / 10;
        if (p.y + p.h > 100) { p.y = Math.max(0, Math.round((100 - p.h) * 10) / 10); break; }
      }
      p.dx = Math.round((100 - p.x - p.w) * 10) / 10;
      fuori[k] = p;
      messi.push(p);
    });
    return fuori;
  }

  // le disposizioni salvate prima della 2.4.18 si portavano dietro le
  // larghezze in percentuale: adesso che ogni pezzo prende la sua misura
  // vera si sovrappongono. Le rimetto in ordine una volta sola.
  _rimediaVecchi(carta) {
    if (this._giaSbrogliato) return;
    const posti = this._cfgPista().posti;
    if (!posti || !Object.keys(posti).length) return;
    const daRifare = Object.keys(posti).some((k) => k !== "misure"
      && k !== "_base" && posti[k] && !isFinite(posti[k].dx));
    // se e' gia' a posto non tocco niente: le sue posizioni sono sue
    if (!daRifare) { this._giaSbrogliato = true; return; }
    const veri = carta.posizioniAdesso();
    if (!Object.keys(veri).length) {
      // la casellina non e' ancora impaginata (la scheda "Aspetto" e' chiusa):
      // riprovo, se no il rimedio non parte piu' per tutta la sessione
      this._tentativi = (this._tentativi || 0) + 1;
      if (this._tentativi < 20) {
        clearTimeout(this._rimedio);
        this._rimedio = setTimeout(() => this._rimediaVecchi(carta), 600);
      }
      return;
    }
    this._giaSbrogliato = true;
    const uniti = {};
    Object.keys(posti).forEach((k) => {
      uniti[k] = veri[k] ? { ...posti[k], ...veri[k] } : posti[k];
    });
    this._scriviPosti(this._sbrogliaPosti(uniti));
    this._aggiornaPista();
  }

  // ---- quale casella sto sistemando nel riquadro ----
  // Il riquadro e' UNO SOLO, nella pagina principale. Toccando una casella
  // nell'anteprima del pop-up si sceglie lei: cosi' non serve rifare tutto
  // l'armamentario dentro a ogni scheda.
  _schedaA(percorso) {
    let lista = this._schede();
    let c = null;
    for (let i = 0; i < percorso.length; i += 1) {
      c = lista[percorso[i]];
      if (!c) return null;
      lista = c.cards || [];
    }
    return c;
  }

  _conScheda(percorso, nuova) {
    const clona = (lista, liv) => {
      const fuori = lista.slice();
      const i = percorso[liv];
      if (liv === percorso.length - 1) fuori[i] = nuova;
      else fuori[i] = { ...fuori[i], cards: clona(fuori[i].cards || [], liv + 1) };
      return fuori;
    };
    return clona(this._schede(), 0);
  }

  _trovaPercorso(cfg) {
    const uguale = (a, b) => String(a.type) === String(b.type)
      && String(a.entity || "") === String(b.entity || "")
      && String(a.name || "") === String(b.name || "");
    const cerca = (lista, base) => {
      for (let i = 0; i < lista.length; i += 1) {
        const c = lista[i] || {};
        if (uguale(c, cfg)) return base.concat([i]);
        if (Array.isArray(c.cards)) {
          const giu = cerca(c.cards, base.concat([i]));
          if (giu) return giu;
        }
      }
      return null;
    };
    return cerca(this._schede(), []);
  }

  // la configurazione della casella che il riquadro sta mostrando
  _cfgPista() {
    const p = this._sceltaPercorso;
    if (p && p.length) {
      const c = this._schedaA(p);
      if (c) return c;
    }
    return this._config;
  }

  // Le voci spurie lasciate dal baco dei due nomi confusi: "pezzi" che si
  // chiamano come un'entita'. Un nome di pezzo non ha mai il punto dentro.
  _postiPuliti(posti) {
    if (!posti) return posti;
    const buoni = {};
    let sporchi = 0;
    Object.keys(posti).forEach((k) => {
      const n = String(k);
      // i pezzi che indicano una cosa precisa - un sensore, un tasto, un
      // attrezzo - hanno i due punti davanti: "misura:sensor.batteria",
      // "tasto:play". Quelli vanno tenuti, punto o non punto.
      // Le voci spurie invece erano nomi di entita' NUDI, senza niente
      // davanti: quelli si buttano.
      if (n.indexOf(".") >= 0 && n.indexOf(":") < 0) { sporchi += 1; return; }
      buoni[k] = posti[k];
    });
    if (sporchi) this._dico("tolti " + sporchi + " pezzi che non esistevano");
    return Object.keys(buoni).length ? buoni : null;
  }

  // e dove vanno scritte le posizioni quando lui trascina
  _scriviPosti(posti) {
    posti = this._postiPuliti(posti);
    // Con i pezzi liberi sono tutti staccati dal flusso: la casella non ha
    // piu' niente da misurare e con "Altezza automatica" si accartoccia.
    // Allora mi segno l'altezza che aveva mentre lui componeva, e la casella
    // la usa come altezza minima: le percentuali tornano a voler dire
    // qualcosa. Vedi _mettiAPosto.
    const box = this._postiBox;
    const suo = box && box._altoVero > 40 ? Math.round(box._altoVero) : 0;
    const suoLargo = box && box._largoVero > 40 ? Math.round(box._largoVero) : 0;
    const p = this._sceltaPercorso;
    if (!p || !p.length) {
      const c2 = { ...this._config };
      if (posti) c2.posti = posti; else delete c2.posti;
      if (posti && suo) c2.posti_alto = suo; else delete c2.posti_alto;
      if (posti && suoLargo) c2.posti_largo = suoLargo; else delete c2.posti_largo;
      this._config = c2;
      this._emetti();
      return;
    }
    const vecchia = this._schedaA(p);
    if (!vecchia) return;
    const nuova = { ...vecchia };
    if (posti) nuova.posti = posti; else delete nuova.posti;
    if (posti && suo) nuova.posti_alto = suo; else delete nuova.posti_alto;
    if (posti && suoLargo) nuova.posti_largo = suoLargo; else delete nuova.posti_largo;
    this._salvaSchede(this._conScheda(p, nuova), false);
  }

  _diciChi() {
    const box = this._postiBox;
    if (!box || !box._chi) return;
    box._chi.innerHTML = "";
    const p = this._sceltaPercorso;
    if (!p || !p.length) {
      box._chi.textContent = "Stai sistemando: questa casella. "
        + "Per una scheda del pop-up, toccala nell'anteprima qui di fianco.";
      return;
    }
    const c = this._schedaA(p) || {};
    const eti = document.createElement("span");
    eti.className = "chi-nome";
    eti.textContent = "Stai sistemando: " + (c.name || c.entity || "una scheda del pop-up");
    const torna = document.createElement("button");
    torna.type = "button";
    torna.className = "tastoPiatto";
    torna.textContent = "Torna alla casella";
    torna.addEventListener("click", () => {
      this._sceltaPercorso = null;
      this._misuraScelta = null;
      if (box) box._tirata = null;
      this._giaSbrogliato = false;
      this._planciaCercata = null;
      this._planciaSalvata = null;
      this._aggiornaPista();
    });
    box._chi.append(eti, torna);
  }

  _dico(testo) {
    const box = this._postiBox;
    if (!box || !box._nota) return;
    box._nota._occupata = true;
    box._nota.textContent = testo;
  }

  _pistaTrascina(carta) {
    const PEZZI = [
      ["valore", ".valore"],
      ["nome", ".testi"],
      ["extra", ".extra:not([hidden])"],
      ["colori", ".colori:not([hidden])"],
      ["lettori", ".lettori:not([hidden])"],
      ["attrezzi", ".ytattrezzi:not([hidden])"],
      ["cuore", ".ytcuore:not([hidden])"],
      ["tempo", ".tempo:not([hidden])"],
      ["cursore", ".cursore:not([hidden])"],
      ["comandi", ".comandi:not([hidden])"],
      ["icona", "svg.icona,img.ritratto,.iconaHa,.iconaFoto"],
      // il timbro per ultimo: sta dietro a tutto, e chi gli sta sopra deve
      // avere la precedenza sotto il dito
      ["sfondo", "svg.iconafondo:not([hidden]), img.fotofondo:not([hidden])"],
    ];
    // Chi sta sotto al dito? Lo cerco confrontando le posizioni invece di
    // chiedere al browser "cosa c'e' qui": quella strada non risponde se il
    // riquadro e' fuori dallo schermo o dentro a un'ombra.
    const chiSono = (x, y) => {
      const radice = carta.shadowRoot;
      if (!radice) return null;
      const dentro = (el) => {
        if (!el) return false;
        const r = el.getBoundingClientRect();
        return r.width > 0 && x >= r.left - 2 && x <= r.right + 2
          && y >= r.top - 2 && y <= r.bottom + 2;
      };
      // i tasti per primi, poi le misure: sono i pezzi piu' piccoli e
      // stanno sopra agli altri
      const tasti = radice.querySelectorAll(".comandi button");
      for (let i = 0; i < tasti.length; i += 1) {
        const chi = nomeTasto(tasti[i]);
        if (!tasti[i].hidden && chi && dentro(tasti[i])) {
          return { chi: "tasto:" + chi, el: tasti[i] };
        }
      }
      const attrezzi = radice.querySelectorAll(".ytattrezzi button");
      for (let i = 0; i < attrezzi.length; i += 1) {
        const chi = nomeAttrezzo(attrezzi[i]);
        if (!attrezzi[i].hidden && chi && dentro(attrezzi[i])) {
          return { chi: "attrezzo:" + chi, el: attrezzi[i] };
        }
      }
      const misure = radice.querySelectorAll(".chips .metrica");
      for (let i = 0; i < misure.length; i += 1) {
        if (dentro(misure[i]) && misure[i].dataset.eid) {
          return { chi: "misura:" + misure[i].dataset.eid, el: misure[i] };
        }
      }
      for (let i = 0; i < PEZZI.length; i += 1) {
        // querySelector da' SOLO il primo: per l'icona i disegni possibili
        // sono quattro (disegno nostro, icona di Home Assistant, foto tua,
        // copertina del disco) e quello buono e' l'unico acceso. Cercando
        // solo il primo, con la copertina vera non si prendeva niente.
        const tutti = radice.querySelectorAll(PEZZI[i][1]);
        for (let k = 0; k < tutti.length; k += 1) {
          if (dentro(tutti[k])) return { chi: PEZZI[i][0], el: tutti[k] };
        }
      }
      return null;
    };
    let preso = null;

    // Il quadratino giallo con la freccina: si tiene premuto e il pezzo
    // cresce o rimpicciolisce. Sta FUORI dalla casellina (nel riquadro che
    // la contiene) cosi' non finisce dentro alla disposizione salvata.
    const maniglia = document.createElement("div");
    maniglia.className = "pista-maniglia";
    maniglia.hidden = true;
    maniglia.title = "Tieni premuto e trascina per ingrandire o rimpicciolire";
    maniglia.innerHTML = '<i class="q"><svg viewBox="0 0 24 24" aria-hidden="true">'
      + '<path d="M21,15V21H15V19H17.6L13.5,14.9L14.9,13.5L19,17.6V15H21M9.1,'
      + '10.5L10.5,9.1L6.4,5H9V3H3V9H5V6.4L9.1,10.5Z"></path></svg></i>';
    carta._maniglia = maniglia;

    const pezziDi = (chi) => {
      const radice = carta.shadowRoot;
      if (!radice || !chi) return [];
      if (chi.indexOf("tasto:") === 0) {
        const q = chi.slice(6);
        return [...radice.querySelectorAll(".comandi button")]
          .filter((b) => !b.hidden && [...b.classList].indexOf(q) !== -1);
      }
      if (chi.indexOf("attrezzo:") === 0) {
        const q = chi.slice(9);
        return [...radice.querySelectorAll(".ytattrezzi button")]
          .filter((b) => !b.hidden && nomeAttrezzo(b) === q);
      }
      if (chi.indexOf("misura:") === 0) {
        const eid = chi.slice(7);
        return [...radice.querySelectorAll(".chips .metrica")]
          .filter((e) => e.dataset.eid === eid);
      }
      const mappa = {
        nome: [".testi"], misure: [".chips"], valore: [".valore"],
        icona: ["svg.icona", "img.ritratto", ".iconaHa", ".iconaFoto"],
        cursore: [".cursore"], comandi: [".comandi"],
        attrezzi: [".ytattrezzi"], cuore: [".ytcuore"],
        tempo: [".tempo"], extra: [".extra"], lettori: [".lettori"],
        colori: [".colori"],
        // l'icona grande e sbiadita dietro alle scritte, disegno o foto
        sfondo: ["svg.iconafondo", "img.fotofondo"],
      };
      // su un <svg> ".hidden" non segue l'attributo: qui va chiesto
      // l'attributo, se no un timbro spento sembra acceso
      return (mappa[chi] || []).map((sel) => radice.querySelector(sel))
        .filter((el) => el && !el.hasAttribute("hidden")
          && el.getBoundingClientRect().width);
    };

    // RIAGGANCIA A SINISTRA senza spostarlo: lo lascio dov'e' ma tenuto
    // per l'angolo in alto a sinistra, che e' dove sta la posizione che gli
    // do io. Da quel momento cresce verso destra e sta sotto il dito.
    const perLaSinistra = (chi) => {
      const rc = carta.riquadroCasella();
      if (!rc) return;
      pezziDi(chi).forEach((x2) => {
        try {
          const rr = x2.getBoundingClientRect();
          x2.style.transformOrigin = "top left";
          x2.style.right = "auto";
          x2.style.left = (Math.round((rr.left - rc.left) / rc.width * 1000) / 10) + "%";
          x2.style.top = (Math.round((rr.top - rc.top) / rc.height * 1000) / 10) + "%";
        } catch (e) { /* pazienza */ }
      });
    };

    const scalaDi = (chi) => {
      const posti = (this._cfgPista() || {}).posti || {};
      const v0 = posti[chi] && posti[chi].s;
      return isFinite(v0) && v0 > 0 ? v0 : 1;
    };

    const aggiornaManiglia = () => {
      const chi = carta._pezzoScelto;
      const pezzi = chi ? pezziDi(chi) : [];
      const pista = carta.parentElement;
      const numeri = this._postiBox && this._postiBox._numeriPezzo;
      if (numeri) numeri.riga.hidden = !chi || !pezzi.length;
      if (!chi || !pezzi.length || !pista) {
        maniglia.hidden = true;
        if (carta.shadowRoot) {
          carta.shadowRoot.querySelectorAll(".scelto")
            .forEach((el) => el.classList.remove("scelto"));
        }
        return;
      }
      if (maniglia.parentElement !== pista) pista.appendChild(maniglia);
      // segno il pezzo scelto, se no non si capisce di chi e' il quadratino
      const radice = carta.shadowRoot;
      if (radice) {
        radice.querySelectorAll(".scelto").forEach((el) => {
          if (pezzi.indexOf(el) === -1) el.classList.remove("scelto");
        });
      }
      pezzi.forEach((el) => el.classList.add("scelto"));
      const r = pezzi[0].getBoundingClientRect();
      const rp = pista.getBoundingClientRect();
      maniglia.hidden = false;
      // il quadratino sta in mezzo all'angolo, ma la parte che risponde al
      // dito e' piu' larga di lui: sulle caselle fitte finiva sopra ai tasti
      // e bastava sbagliare di due pixel per prendere il pezzo di sotto
      // SEMPRE IN BASSO A DESTRA, e appoggiato FUORI dal pezzo: stando
      // sopra lo copriva, e sbagliando di un pelo il tocco finiva sul pezzo
      // - che risponde con la manina e si mette a spostarsi invece di
      // crescere. Che poi quell'angolo si muova davvero anche per i pezzi
      // agganciati a destra ci pensa "perLaSinistra", appena lo prendi.
      maniglia.style.left = (r.right - rp.left - 12 + pista.scrollLeft) + "px";
      maniglia.style.top = (r.bottom - rp.top - 12 + pista.scrollTop) + "px";
      // e le caselline dicono dov'e' e quanto e' grande - ma non mentre ci
      // sta scrivendo dentro
      if (numeri) {
        const dove = ((this._cfgPista() || {}).posti || {})[chi] || {};
        const dentro = numeri.gr.ownerDocument.activeElement;
        numeri.chi.textContent = "Pezzo: " + chi;
        const metti = (campo, valore) => {
          if (dentro === campo) return;
          campo.value = String(Math.round(valore * 10) / 10);
        };
        metti(numeri.gr, (misuro ? misuro.k : (dove.s > 0 ? dove.s : 1)) * 100);
        metti(numeri.px, isFinite(dove.x) ? dove.x : 0);
        metti(numeri.py, isFinite(dove.y) ? dove.y : 0);
      }
    };
    carta._aggiornaManiglia = aggiornaManiglia;

    // Il pezzo si vede crescere mentre tieni premuto, senza rifare la
    // casella. Il punto fermo e' SEMPRE l'angolo in alto a sinistra: ce
    // l'ha messo "perLaSinistra" appena hai preso il quadratino, e
    // rimettercelo dall'altra parte a ogni fotogramma - com'era prima -
    // voleva dire tenere l'angolo di destra inchiodato mentre il dito
    // andava per conto suo.
    const provaScala = (chi, k) => {
      pezziDi(chi).forEach((el) => {
        el.style.transformOrigin = "top left";
        el.style.transform = k === 1 ? "" : "scale(" + k + ")";
      });
    };

    let misuro = null;
    const avviaMisura = (e) => {
      const chi = carta._pezzoScelto;
      const pezzi = chi ? pezziDi(chi) : [];
      if (!pezzi.length) return false;
      e.preventDefault();
      e.stopPropagation();
      const r = pezzi[0].getBoundingClientRect();
      // Da che angolo cresce il pezzo? Dallo stesso da cui e' attaccato:
      // in alto a sinistra, o in alto a destra se sta a destra della
      // casella. E' la stessa scelta che fa "provaScala".
      // da qui in poi cresce verso destra: cosi' il quadratino, che sta
      // in basso a destra, e' su un angolo che si muove davvero
      perLaSinistra(chi);
      const r2 = pezzi[0].getBoundingClientRect();
      misuro = { chi: chi, x: e.clientX, y: e.clientY,
                 w: r.width, h: r.height, s: scalaDi(chi), k: scalaDi(chi),
                 // dov'e' l'angolo adesso e da dove cresce: da qui in poi
                 // l'angolo deve stare sotto il dito
                 destra0: r2.right, fondo0: r2.bottom,
                 sinistra0: r2.left, cima0: r2.top, aDestra: false };
      maniglia.classList.add("inmano");
      try { maniglia.setPointerCapture(e.pointerId); } catch (e2) { /* pazienza */ }
      return true;
    };
    // Il dito e' sul quadratino? Lo decido dalle POSIZIONI, non chiedendo al
    // browser su cosa ha premuto: dentro alla finestra delle impostazioni il
    // tocco passa per un mucchio di gusci e l'unico modo sicuro di sapere
    // dov'e' finito e' guardare dove sta.
    const sulQuadratino = (x, y) => {
      if (maniglia.hidden || !maniglia.isConnected) return false;
      const r = maniglia.getBoundingClientRect();
      // la zona che risponde e' piu' larga del quadratino: cosi' si prende
      // anche senza mirare
      return r.width > 0 && x >= r.left - 9 && x <= r.right + 9
        && y >= r.top - 9 && y <= r.bottom + 9;
    };
    maniglia.addEventListener("pointerdown", avviaMisura);
    const misuraMuovi = (e) => {
      if (!misuro) return;
      e.preventDefault();
      e.stopPropagation();
      // L'ANGOLO STA SOTTO IL DITO. Il pezzo cresce da un angolo fermo,
      // quindi la grandezza che porta l'angolo di sotto dove sta il dito
      // si sa esattamente: e' la distanza fra i due, divisa per quanto e'
      // grande il pezzo a grandezza uno.
      const largo1 = Math.max(6, misuro.w / Math.max(0.05, misuro.s));
      const alto1 = Math.max(6, misuro.h / Math.max(0.05, misuro.s));
      const voglioY = misuro.fondo0 + (e.clientY - misuro.y);
      const ky = (voglioY - misuro.cima0) / alto1;
      // il pezzo agganciato a destra cresce verso sinistra: l'angolo che si
      // muove e' quello di sotto a SINISTRA, ed e' quello che insegue il dito
      const voglioX = misuro.aDestra
        ? misuro.sinistra0 + (e.clientX - misuro.x)
        : misuro.destra0 + (e.clientX - misuro.x);
      const kx = misuro.aDestra
        ? (misuro.destra0 - voglioX) / largo1
        : (voglioX - misuro.sinistra0) / largo1;
      const k = Math.max(0.4, Math.min(3, (kx + ky) / 2));
      misuro.k = Math.round(k * 100) / 100;
      provaScala(misuro.chi, misuro.k);
      aggiornaManiglia();
      this._dico("grandezza " + Math.round(misuro.k * 100) + "%");
    };
    const misuraLascia = () => {
      if (!misuro) return;
      maniglia.classList.remove("inmano");
      const posti = { ...((this._cfgPista() || {}).posti || {}) };
      const vecchio = { ...(posti[misuro.chi] || {}) };
      const k = misuro.k;
      if (k === 1) delete vecchio.s; else vecchio.s = k;
      // E I DUE AGGANCI DEVONO COMBACIARE. Il pezzo adesso e' grande
      // un'altra cosa: mi riprendo la sua figura e riscrivo sia la
      // distanza da sinistra sia quella da destra su quella. Cosi'
      // comunque la casella decida di tenerlo - a sinistra o a destra -
      // resta dove l'hai visto.
      const rc2 = carta.riquadroCasella();
      const pz2 = pezziDi(misuro.chi)[0];
      if (rc2 && pz2) {
        const rr = pz2.getBoundingClientRect();
        vecchio.x = Math.round((rr.left - rc2.left) / rc2.width * 1000) / 10;
        vecchio.y = Math.round((rr.top - rc2.top) / rc2.height * 1000) / 10;
        vecchio.dx = Math.round((rc2.width - (rr.right - rc2.left))
          / rc2.width * 1000) / 10;
      }
      posti[misuro.chi] = vecchio;
      carta._appenaSpostato = true;
      this._scriviPosti(posti);
      this._dico("grandezza salvata: " + Math.round(k * 100) + "%");
      misuro = null;
      setTimeout(aggiornaManiglia, 60);
    };
    maniglia.addEventListener("pointermove", misuraMuovi);
    maniglia.addEventListener("pointerup", misuraLascia);
    maniglia.addEventListener("pointercancel", misuraLascia);
    carta._misuraMuovi = misuraMuovi;
    carta._misuraLascia = misuraLascia;

    // Ascolto sulla FINESTRA, in cattura: cosi' arrivo prima di chiunque
    // altro. Attaccandomi alla casellina, qualcuno piu' in alto (la
    // finestra delle impostazioni, gli elenchi trascinabili di Home
    // Assistant) poteva fermare il tocco prima che arrivasse a me.
    const giu = (e) => {
      const radice = carta.shadowRoot;
      if (!radice || !carta.isConnected) return;
      const rq = carta.getBoundingClientRect();
      if (!rq.width) return;
      if (e.clientX < rq.left || e.clientX > rq.right
          || e.clientY < rq.top || e.clientY > rq.bottom) return;
      // il quadratino della grandezza viene prima di tutto
      if (e.target === maniglia
        || (e.target && e.target.nodeType && maniglia.contains(e.target))) return;
      if (sulQuadratino(e.clientX, e.clientY) && avviaMisura(e)) return;
      const q = chiSono(e.clientX, e.clientY);
      this._dico(q ? "preso: " + q.chi : "sotto al dito non c'e' nessun pezzo");
      if (!q) {
        carta._pezzoScelto = null;
        aggiornaManiglia();
        return;
      }
      carta._pezzoScelto = q.chi;
      setTimeout(aggiornaManiglia, 0);
      e.preventDefault();
      e.stopPropagation();
      // la prima volta fisso tutti i pezzi dove stanno adesso, se no
      // saltano tutti appena ne muovo uno
      const mia = this._cfgPista();
      if (!mia.posti || !Object.keys(mia.posti).length) {
        const ora = carta.posizioniAdesso();
        if (!Object.keys(ora).length) return;
        this._scriviPosti(ora);
        // la metto subito in modo libero, se no il primo trascinamento
        // partirebbe dalla disposizione automatica
        try { carta.setConfig({ ...this._cfgPista() }); } catch (e2) { /* pazienza */ }
        try { carta.hass = this._hass; } catch (e3) { /* pazienza */ }
        // adesso che sono liberi hanno preso la loro misura vera: rimisuro
        // e li distanzio, se no partono gia' uno sopra l'altro
        const veri = carta.posizioniAdesso();
        if (Object.keys(veri).length) {
          this._giaSbrogliato = true;
          this._scriviPosti(this._sbrogliaPosti(veri));
          try { carta.setConfig({ ...this._cfgPista() }); } catch (e4) { /* pazienza */ }
          try { carta.hass = this._hass; } catch (e5) { /* pazienza */ }
        }
      }
      // Il primo tasto che prende stacca tutta la fila: gli altri li fisso
      // dove sono adesso, se no saltano tutti nell'istante in cui la fila
      // smette di contare come un blocco solo.
      if (q.chi.indexOf("attrezzo:") === 0) {
        const p0 = (this._cfgPista() || {}).posti || {};
        if (!Object.keys(p0).some((k) => k.indexOf("attrezzo:") === 0)) {
          const dove = carta.posizioniAttrezzi ? carta.posizioniAttrezzi() : {};
          if (Object.keys(dove).length) {
            // Rifare la configurazione all'anteprima le fa dimenticare QUALE
            // cassa sta seguendo: tornava a quella scritta nella casella, che
            // magari e' ferma, e sparivano copertina e barra del tempo
            // proprio mentre lui sistemava i pezzi. Me la segno e gliela
            // rimetto.
            const seguiva = carta._scelto;
            const suonavano = carta._suonavano;
            this._scriviPosti({ ...p0, ...dove });
            try { carta.setConfig({ ...this._cfgPista() }); } catch (e8) { /* pazienza */ }
            carta._scelto = seguiva;
            carta._suonavano = suonavano;
            try { carta.hass = this._hass; } catch (e9) { /* pazienza */ }
          }
        }
      }
      if (q.chi.indexOf("tasto:") === 0) {
        const p0 = (this._cfgPista() || {}).posti || {};
        if (!Object.keys(p0).some((k) => k.indexOf("tasto:") === 0)) {
          const dove = carta.posizioniTasti();
          if (Object.keys(dove).length) {
            // Rifare la configurazione all'anteprima le fa dimenticare QUALE
            // cassa sta seguendo: tornava a quella scritta nella casella, che
            // magari e' ferma, e sparivano copertina e barra del tempo
            // proprio mentre lui sistemava i pezzi. Me la segno e gliela
            // rimetto.
            const seguiva = carta._scelto;
            const suonavano = carta._suonavano;
            this._scriviPosti({ ...p0, ...dove });
            try { carta.setConfig({ ...this._cfgPista() }); } catch (e6) { /* pazienza */ }
            carta._scelto = seguiva;
            carta._suonavano = suonavano;
            try { carta.hass = this._hass; } catch (e7) { /* pazienza */ }
          }
        }
      }
      const rc = carta.riquadroCasella();
      if (!rc) return;
      // Lo rimetto dov'e' ma tenuto per l'angolo in alto a sinistra, che e'
      // dove sta la posizione che gli do io: se restasse tenuto per la
      // destra, la sua figura starebbe "quanto e' cresciuto" piu' in la'
      // della posizione che gli do - sul suo attrezzo al 157% erano
      // diciotto punti.
      perLaSinistra(q.chi);
      const re = q.el.getBoundingClientRect();
      preso = {
        chi: q.chi, el: q.el, rc: rc,
        dx: e.clientX - re.left, dy: e.clientY - re.top,
        largo: re.width, alto: re.height,
        // quanto e' ingrandito adesso: da togliere dalle misure che salvo
        k: carta.quantoIngrandito ? carta.quantoIngrandito(q.el) : 1,
      };
      q.el.classList.add("inmano");
      try { carta.setPointerCapture(e.pointerId); } catch (e2) { /* pazienza */ }
    };

    const muovi = (e) => {
      if (!preso) return;
      e.preventDefault();
      e.stopPropagation();
      // LA MISURA DELLA CASELLA ME LA RIPRENDO ADESSO, non quella di
      // quando ho premuto: fra i due momenti la casella puo' essersi
      // mossa o cambiata di misura, e allora la percentuale esce storta.
      const rc = carta.riquadroCasella() || preso.rc;
      const x = (e.clientX - preso.dx - rc.left) / rc.width * 100;
      const y = (e.clientY - preso.dy - rc.top) / rc.height * 100;
      const maxX = 100 - (preso.largo / rc.width * 100);
      const maxY = 100 - (preso.alto / rc.height * 100);
      const px = Math.round(Math.max(0, Math.min(maxX, x)) * 10) / 10;
      const py = Math.round(Math.max(0, Math.min(maxY, y)) * 10) / 10;
      preso.finito = { x: px, y: py };
      this._dico("sposto " + preso.chi + " a " + px + "% " + py + "%");
      // muovo subito il pezzo, senza rifare la casella: cosi' e' liscio
      const quali = preso.chi === "icona"
        ? ["svg.icona", "img.ritratto", ".iconaHa", ".iconaFoto"] : [null];
      if (preso.chi === "icona") {
        quali.forEach((sel) => {
          const el = carta.shadowRoot.querySelector(sel);
          if (el) {
            el.style.right = "auto"; el.style.left = px + "%";
            el.style.top = py + "%";
          }
        });
      } else {
        preso.el.style.right = "auto";
        preso.el.style.left = px + "%";
        preso.el.style.top = py + "%";
      }
      aggiornaManiglia();
    };

    const lascia = () => {
      if (!preso) return;
      preso.rcFine = carta.riquadroCasella() || preso.rc;
      preso.el.classList.remove("inmano");
      this._dico(preso.finito
        ? "salvato " + preso.chi + " a " + preso.finito.x + "% " + preso.finito.y + "%"
        : "lasciato senza spostare " + preso.chi);
      if (preso.finito) {
        carta._appenaSpostato = true;
        const posti = { ...(this._cfgPista().posti || {}) };
        const vecchio = posti[preso.chi] || {};
        // il pezzo resta esattamente dove l'ha lasciato: prima lo scansavo
        // da solo se toccava un altro, ma cosi' non si capiva piu' dove
        // sarebbe finito. Se li vuole uno sopra l'altro, sono affari suoi.
        posti[preso.chi] = {
          ...vecchio,
          x: preso.finito.x,
          y: preso.finito.y,
          // la misura SENZA l'ingrandimento: quello glielo rimette la
          // casella quando disegna, e contarlo due volte faceva crescere
          // il pezzo a ogni tocco
          w: Math.round(preso.largo / preso.k / preso.rcFine.width * 1000) / 10,
          h: Math.round(preso.alto / preso.k / preso.rcFine.height * 1000) / 10,
          // La distanza dal bordo destro invece si conta sulla figura
          // INGRANDITA, che e' quella che si vede: e' quella che serve per
          // riagganciarlo a destra senza spostarlo.
          dx: Math.round((preso.rcFine.width - preso.largo)
            / preso.rcFine.width * 1000) / 10 - preso.finito.x,
        };
        this._scriviPosti(posti);
      }
      preso = null;
      setTimeout(aggiornaManiglia, 60);
    };
    // Mi metto in ascolto sulla FINESTRA, non sulla casellina: se il dito
    // esce dal riquadrino il trascinamento deve continuare lo stesso.
    // (Prima, con l'ascolto sulla casellina, uscire di un pixel lo
    // chiudeva subito e non si salvava niente.)
    // ...ma me li devo anche RIPRENDERE quando la finestra si chiude: ogni
    // volta che apriva le impostazioni ne restavano tre attaccati per
    // sempre, e dopo un po' di aperture ogni movimento del dito faceva
    // lavorare tutti quelli delle volte prima. Di qui il rallentamento
    // che peggiorava a ogni apertura.
    window.addEventListener("pointerdown", giu, true);
    window.addEventListener("pointermove", muovi, true);
    ["pointerup", "pointercancel"].forEach((ev) =>
      window.addEventListener(ev, lascia, true));
    // il quadratino della grandezza ascolta anche lui sulla finestra: se il
    // dito parte da li' ma poi esce dal quadratino, il ridimensionamento
    // deve continuare lo stesso (come per lo spostamento)
    window.addEventListener("pointermove", misuraMuovi, true);
    ["pointerup", "pointercancel"].forEach((ev) =>
      window.addEventListener(ev, misuraLascia, true));
    // e quando lui tocca una casella dentro all'anteprima del pop-up
    const scegli = (e) => {
      const cfg = e.detail && e.detail.config;
      if (!cfg || !this.isConnected) return;
      const p = this._trovaPercorso(cfg);
      const mia = this._config || {};
      const eLaMia = String(cfg.entity || "") === String(mia.entity || "")
        && String(cfg.name || "") === String(mia.name || "");
      if (!p && !eLaMia) return;
      // toccando la casella grande in cima si torna a sistemare lei
      this._sceltaPercorso = p && !eLaMia ? p : null;
      // cambiata la scheda, la misura tirata prima non c'entra piu' niente
      const b0 = this._postiBox;
      if (b0) b0._tirata = null;
      // la misura buona e' quella che ha adesso dentro al pop-up: la prendo
      // dall'elemento che ha toccato (offsetWidth, non il rettangolo sullo
      // schermo, che potrebbe essere rimpicciolito dall'anteprima)
      const chi = e.detail && e.detail.elemento;
      // anche una casella stretta di griglia: la sua misura e' quella
      // buona, e scartandola finivo per prendere quella di un'altra card
      this._misuraScelta = (this._sceltaPercorso && chi && chi.offsetWidth > 24)
        ? { w: chi.offsetWidth, h: chi.offsetHeight } : null;
      this._giaSbrogliato = false;
      this._planciaCercata = null;
      this._planciaSalvata = null;
      this._aggiornaPista();
      const box = this._postiBox;
      if (box) box.scrollIntoView({ block: "nearest" });
    };
    window.addEventListener("casa-scegli-scheda", scegli, true);
    this._ascolti = () => {
      window.removeEventListener("casa-scegli-scheda", scegli, true);
      window.removeEventListener("pointerdown", giu, true);
      window.removeEventListener("pointermove", muovi, true);
      ["pointerup", "pointercancel"].forEach((ev) =>
        window.removeEventListener(ev, lascia, true));
      window.removeEventListener("pointermove", misuraMuovi, true);
      ["pointerup", "pointercancel"].forEach((ev) =>
        window.removeEventListener(ev, misuraLascia, true));
    };
    // e mentre sposto un pezzo la casella non deve fare il suo mestiere
    carta.addEventListener("click", (e) => {
      if (!preso && !carta._appenaSpostato) return;
      e.preventDefault();
      e.stopPropagation();
      carta._appenaSpostato = false;
    }, true);
  }

  // se Home Assistant mi stacca e mi riattacca (cambio di linguetta) gli
  // ascoltatori del trascinamento vanno rimessi
  connectedCallback() {
    const box = this._postiBox;
    if (box && box._carta && !this._ascolti) this._pistaTrascina(box._carta);
    this._ascoltaMisure();
  }

  // QUANDO LUI TIRA L'ANGOLO DI UNA SCHEDA nell'anteprima del pop-up.
  // L'anteprima e' una casella a se', appesa da un'altra parte della
  // pagina: mi parla per mezzo di un avviso sulla finestra, come fa gia'
  // per dire quale scheda si sta sistemando.
  _ascoltaMisure() {
    if (this._ascoltoMisure) return;
    const preso = (e) => {
      const d = (e && e.detail) || {};
      if (!this.isConnected || !d.chiave) return;
      const mia = this._config || {};
      const suo = d.config || {};
      // solo se e' l'anteprima della MIA casella: nella stessa pagina ce
      // ne possono essere altre aperte
      if (String(suo.entity || "") !== String(mia.entity || "")
        || String(suo.name || "") !== String(mia.name || "")) return;
      if (d.a !== undefined && d.a !== null) this._spostaScheda(d.chiave, d.a);
      else this._scriviMisura(String(d.chiave), d.largo, d.alto, d.quante);
    };
    window.addEventListener("casa-misura-scheda", preso, true);
    window.addEventListener("casa-sposta-scheda", preso, true);
    this._ascoltoMisure = () => {
      window.removeEventListener("casa-misura-scheda", preso, true);
      window.removeEventListener("casa-sposta-scheda", preso, true);
    };
  }

  // e qui la misura viene scritta dove la scrive Home Assistant.
  // La chiave "2" e' la terza scheda, "2.1" la seconda casella della terza
  // scheda quando quella e' una griglia.
  _scriviMisura(chiave, largo, alto, quante) {
    const l = (this._schede() || []).slice();
    const parti = String(chiave).split(".");
    const i = Number(parti[0]);
    if (!isFinite(i) || !l[i]) return;

    // La misura "normale", quella che non serve scrivere: tutta la riga
    // fuori, una colonna sola dentro a una griglia. Se ci si torna, il
    // valore va cancellato invece che scritto uguale al normale.
    const metti = (carta, normale) => {
      const c2 = { ...(carta || {}) };
      const m = { ...(c2.casa_misura || {}) };
      if (largo > 0 && Math.abs(largo - normale) > 0.8) {
        m.largo = Math.round(largo * 10) / 10;
      } else delete m.largo;
      if (alto !== null && alto !== undefined) {
        if (alto > 0) m.alto = Math.round(alto);
        else delete m.alto;
      }
      // adesso comanda questa: la misura a colonne di Home Assistant
      // resterebbe li' a dire un'altra cosa
      delete c2.grid_options;
      if (Object.keys(m).length) c2.casa_misura = m;
      else delete c2.casa_misura;
      return c2;
    };

    if (parti.length === 1) {
      l[i] = metti(l[i], 100);
    } else {
      const k = Number(parti[1]);
      const madre = { ...l[i] };
      const figli = (madre.cards || []).slice();
      if (!figli[k]) return;
      const q = Number(quante) >= 1 ? Number(quante)
        : Math.max(1, Math.min(12, Math.round(
          Number(madre.columns) > 0 ? Number(madre.columns) : 3)));
      figli[k] = metti(figli[k], 100 / q);
      madre.cards = figli;
      l[i] = madre;
    }
    this._config = { ...this._config, finestra_cards: l };
    this._conservaPosto(() => this._emetti());
  }

  // E QUANDO LUI SPOSTA UNA SCHEDA tenendola premuta: la tira via da dov'e'
  // e la rimette al posto nuovo. Dentro a una griglia si muove fra le
  // caselle della griglia, fuori fra le schede del pop-up.
  _spostaScheda(da, a) {
    const l = (this._schede() || []).slice();
    const p1 = String(da).split(".");
    const p2 = String(a).split(".");
    if (p1.length !== p2.length) return;
    const i = Number(p1[0]);
    if (p1.length === 1) {
      const j = Number(p2[0]);
      if (!isFinite(i) || !isFinite(j) || !l[i] || i === j) return;
      const fuori = l.splice(i, 1)[0];
      l.splice(Math.max(0, Math.min(l.length, j)), 0, fuori);
    } else {
      if (Number(p2[0]) !== i || !l[i]) return;
      const madre = { ...l[i] };
      const figli = (madre.cards || []).slice();
      const k1 = Number(p1[1]);
      const k2 = Number(p2[1]);
      if (!isFinite(k1) || !isFinite(k2) || !figli[k1] || k1 === k2) return;
      const fuori = figli.splice(k1, 1)[0];
      figli.splice(Math.max(0, Math.min(figli.length, k2)), 0, fuori);
      madre.cards = figli;
      l[i] = madre;
    }
    this._config = { ...this._config, finestra_cards: l };
    this._emetti();
    this._costruisciBlocco(true);
  }

  // La finestra delle impostazioni si chiude: mi riprendo tutto quello che
  // avevo lasciato in giro, se no si accumula apertura dopo apertura.
  disconnectedCallback() {
    if (this._ascolti) { this._ascolti(); this._ascolti = null; }
    if (this._ascoltoMisure) { this._ascoltoMisure(); this._ascoltoMisure = null; }
    clearTimeout(this._propagaDopo);
    this._propagaDopo = 0;
    const box = this._postiBox;
    if (box && box._guarda) { box._guarda.disconnect(); box._guarda = null; }
    clearTimeout(this._ricontrolla);
    clearTimeout(this._ricontrolla2);
    clearTimeout(this._rimedio);
    clearTimeout(this._scordaForm);
    clearTimeout(this._ripassoAnt);
    this._planciaSalvata = null;
    this._veraSalvata = null;
  }

  _costruisciNomi(forza) {
    const box = this._nomiMisure;
    if (!box) return;
    const scelte = this._config.info_entita || [];
    // se l'elenco e' lo stesso non tocco niente: rifare il riquadro fa
    // saltare la pagina in cima e perdere il campo dove sta scrivendo
    const firma = scelte.join(",");
    if (!forza && box._firma === firma) return;
    box._firma = firma;
    box.innerHTML = "";
    // niente misure, niente riquadro: se no resta una cornice vuota in mezzo
    box.hidden = !scelte.length || !this._hass;
    if (box.hidden) return;
    const titolo = document.createElement("h4");
    titolo.textContent = "Come si chiamano le misure";
    box.appendChild(titolo);
    const nota = document.createElement("p");
    nota.className = "aiuto";
    nota.textContent = "Il nome compare accanto al numero. Lascia vuoto per "
      + "non scrivere niente.";
    box.appendChild(nota);

    const elenco = document.createElement("div");
    elenco.className = "nomiMisure";
    scelte.forEach((eid) => {
      const st = this._hass.states[eid];
      const riga = document.createElement("div");
      riga.className = "nomeMisura";
      const chi = document.createElement("span");
      chi.className = "chi";
      chi.textContent = String((st && st.attributes.friendly_name) || eid);
      chi.title = eid;
      const campo = document.createElement("input");
      campo.type = "text";
      campo.maxLength = 14;
      campo.placeholder = st ? this._nomeSuggerito(st, eid) : "nome";
      campo.value = (this._config.info_nomi || {})[eid] || "";
      const salva = () => {
        const nomi = { ...(this._config.info_nomi || {}) };
        const val = campo.value.trim();
        if (val) nomi[eid] = val;
        else delete nomi[eid];
        this._config = { ...this._config, info_nomi: nomi };
        this._emetti();
      };
      campo.addEventListener("change", salva);
      campo.addEventListener("blur", salva);

      // e il colore suo, staccato da quello degli effetti
      const suoColore = (this._config.info_colori || {})[eid];
      const via = document.createElement("button");
      via.type = "button";
      via.className = "togli";
      via.textContent = "✕";
      via.title = "Torna al colore della casella";
      via.hidden = !Array.isArray(suoColore);
      const scelta = this._sceltaColore(suoColore, (rgb) => {
        const tinte = { ...(this._config.info_colori || {}) };
        tinte[eid] = rgb;
        this._config = { ...this._config, info_colori: tinte };
        via.hidden = false;
        this._emetti();
      });
      scelta.bolla.title = "Colore di questa misura";
      via.addEventListener("click", () => {
        const tinte = { ...(this._config.info_colori || {}) };
        delete tinte[eid];
        this._config = { ...this._config, info_colori: tinte };
        this._emetti();
        this._costruisciNomi(true);
      });

      riga.append(chi, campo, scelta.bolla, via);
      elenco.appendChild(riga);
      elenco.appendChild(scelta.cassetto);
    });
    box.appendChild(elenco);
  }

  // il nome che ci metterebbe la card da sola: lo uso come suggerimento
  _nomeSuggerito(st, eid) {
    const mio = this._hass.states[this._config.entity];
    const nome = String((st.attributes && st.attributes.friendly_name) || eid.split(".")[1]);
    // tolgo la parte in comune col nome dell'apparecchio: "Hub 1200 Battery
    // Discharge Power" accanto a "Hub 1200 ..." diventa "Battery Discharge Power"
    const suo = String((mio && mio.attributes.friendly_name) || "").split(" ");
    const pezzi = nome.split(" ");
    let i = 0;
    while (i < pezzi.length - 1 && i < suo.length
           && pezzi[i].toLowerCase() === suo[i].toLowerCase()) i += 1;
    // taglio a parole intere: "Discharge Powe" non e' un suggerimento
    const resto = pezzi.slice(i);
    let fuori = resto[0] || "";
    for (let k = 1; k < resto.length; k += 1) {
      if ((fuori + " " + resto[k]).length > 14) break;
      fuori += " " + resto[k];
    }
    return fuori.slice(0, 14);
  }

  _costruisciTrovati() {
    const box = this._sensori;
    const trovati = this._trovaSensori();
    const scelti0 = this._config.info_entita || [];
    // Stessi sensori: non rifaccio il riquadro, aggiorno solo i numeri e le
    // spunte. Le spunte NON stanno nella firma apposta: mettendocele, ogni
    // volta che ne spuntavi una l'elenco si rifaceva da capo e la pagina
    // saltava in cima - proprio mentre stavi spuntando la voce dopo.
    const firma = (this._config.entity || "") + "|" + trovati.join(",");
    if (box._firma === firma) {
      box.querySelectorAll(".trovato").forEach((riga) => {
        const eid = riga.dataset.eid;
        const spunta = riga.querySelector("input");
        if (spunta) spunta.checked = scelti0.includes(eid);
        const st2 = this._hass ? this._hass.states[eid] : null;
        if (!st2) return;
        const u2 = st2.attributes.unit_of_measurement;
        const val = riga.querySelector(".val");
        const testo = String(st2.state).slice(0, 18) + (u2 ? " " + u2 : "");
        if (val && val.textContent !== testo) val.textContent = testo;
      });
      return;
    }
    box._firma = firma;
    box.innerHTML = "<h4>Sensori collegati a questa entita</h4>";
    if (!this._config.entity) {
      const vuoto = document.createElement("div");
      vuoto.className = "vuoto";
      vuoto.textContent = "Scegli prima un'entita nella scheda Base.";
      box.appendChild(vuoto);
      return;
    }
    if (!trovati.length) {
      const vuoto = document.createElement("div");
      vuoto.className = "vuoto";
      vuoto.textContent = "Non ho trovato sensori collegati. Puoi comunque "
        + "aggiungerne a mano qui sopra.";
      box.appendChild(vuoto);
      return;
    }
    const nota = document.createElement("p");
    nota.className = "aiuto";
    nota.textContent = "Spunta quelli che vuoi vedere in basso nella casella.";
    box.appendChild(nota);

    const elenco = document.createElement("div");
    elenco.className = "trovati";
    const scelti = this._config.info_entita || [];
    trovati.forEach((eid) => {
      const st = this._hass.states[eid];
      const riga = document.createElement("label");
      riga.className = "trovato";
      riga.dataset.eid = eid;
      const spunta = document.createElement("input");
      spunta.type = "checkbox";
      spunta.checked = scelti.includes(eid);
      spunta.addEventListener("change", () => {
        const ora = (this._config.info_entita || []).slice();
        const dove = ora.indexOf(eid);
        if (spunta.checked && dove === -1) ora.push(eid);
        if (!spunta.checked && dove !== -1) ora.splice(dove, 1);
        this._config = { ...this._config, info_entita: ora };
        this._emetti();
        this._forms.forEach((f) => { f.data = this._config; });
        this._costruisciNomi();
      });
      const nome = document.createElement("span");
      nome.className = "nome";
      nome.textContent = String(st.attributes.friendly_name || eid.split(".")[1])
        .replace(/_/g, " ");
      const val = document.createElement("span");
      val.className = "val";
      const u = st.attributes.unit_of_measurement;
      val.textContent = String(st.state).slice(0, 18) + (u ? " " + u : "");
      riga.append(spunta, nome, val);
      elenco.appendChild(riga);
    });
    box.appendChild(elenco);
  }

  _schemaDi(gruppo) {
    const dominio = (this._config.entity || "").split(".")[0];
    const azione = this._config.azione || "toggle";
    const vale = (nome) => {
      if (SOLO_AZIONE[nome] && SOLO_AZIONE[nome] !== azione) return false;
      // le due della batteria si vedono solo dove c'e' davvero una batteria
      if (nome === "carica_entita" || nome === "scarica_entita") {
        if (this._config.icona === "batteria") return true;
        if (this._config.icona && this._config.icona !== "auto") return false;
        const st0 = (this._hass && this._config.entity)
          ? this._hass.states[this._config.entity] : null;
        return iconaAutomatica(this._config.entity, st0) === "batteria";
      }
      // nel vestito "come la tua ytmusic-card" la copertina ondeggia e non
      // gira: l'interruttore del giradischi non comanderebbe niente, e un
      // interruttore che non fa niente e' peggio che non averlo
      if (nome === "gira_copertina" && this._config.disposizione === "ytmusic") {
        return false;
      }
      // le voci che dipendono da un interruttore spento non si fanno vedere,
      // a meno che non abbiano gia' un valore scritto
      if (DIPENDE[nome] && !DIPENDE[nome](this._config)) {
        const ora = this._config[nome];
        const scritto = ora !== undefined && ora !== null && ora !== ""
          && !(Array.isArray(ora) && !ora.length);
        if (!scritto) return false;
      }
      const ammessi = SOLO_PER[nome];
      if (!ammessi) return true;
      if (!dominio) return false;
      return ammessi.includes(dominio);
    };
    const setaccia = (elenco) => elenco.map((voce) => {
      if (voce.type === "grid" && Array.isArray(voce.schema)) {
        const dentro = setaccia(voce.schema);
        return dentro.length ? { ...voce, schema: dentro } : null;
      }
      return vale(voce.name) ? voce : null;
    }).filter(Boolean);
    return traduciSchema(setaccia(gruppo.schema));
  }

  // la firma serve a capire se lo schema e' cambiato davvero
  // com'e' messo adesso un modulo: solo i campi che ha davvero dentro
  _firmaValori(elenco) {
    const c = this._config;
    const dentro = [];
    const gira = (lista) => (lista || []).forEach((v) => {
      if (v.schema) { gira(v.schema); return; }
      if (!v.name) return;
      const x = c[v.name];
      dentro.push(v.name + "=" + (x === undefined ? "" : JSON.stringify(x)));
    });
    gira(elenco);
    return dentro.join("|");
  }

  // I nomi dei campi di un modulo, anche quelli dentro alle griglie
  _nomiSchema(elenco) {
    const nomi = [];
    const gira = (lista) => (lista || []).forEach((v) => {
      if (v.schema) { gira(v.schema); return; }
      if (v.name) nomi.push(v.name);
    });
    gira(elenco);
    return nomi;
  }

  _firmaSchema(elenco) {
    return JSON.stringify(elenco.map((v) => v.name
      || (v.schema || []).map((x) => x.name).join("+")));
  }

  _quantiCampi(elenco) {
    return elenco.reduce((n, v) => n + (v.schema ? v.schema.length : 1), 0);
  }

  _aggiornaSchemi() {
    if (!this._gruppi) return;
    let primaValida = -1;
    SEZIONI.forEach((sez, i) => {
      const suoi = this._gruppi[i] || [];
      let campi = 0;
      suoi.forEach((g) => {
        const nuovo = this._schemaDi(g.gruppo);
        const firma = this._firmaSchema(nuovo);
        if (g.form._firma !== firma) {
          g.form.schema = nuovo;
          g.form._firma = firma;
        }
        let quanti = this._quantiCampi(nuovo);
        // il modulo puo' essere vuoto ma il gruppo avere i suoi colori
        const suoiColori = this._coloriDi(g.gruppo);
        const conColori = !!(suoiColori.length
          && (!g.gruppo.soloAzione
              || g.gruppo.soloAzione === (this._config.azione || "toggle")));
        g.form.hidden = quanti === 0;
        if (conColori) quanti += suoiColori.length;
        campi += quanti;
        // il titoletto sparisce insieme ai suoi campi
        if (g.titolo) g.titolo.hidden = quanti === 0;
        if (g.colori) g.colori.hidden = quanti === 0;
        // il riquadro sparisce con quello che c'e' dentro, se no restano
        // cornici vuote in mezzo alle impostazioni
        if (g.scatola) g.scatola.hidden = quanti === 0;
      });
      // certe schede hanno anche i riquadri fatti a mano, quindi restano
      const conBlocchi = ["icona", "sfondo", "tocco", "aspetto",
        "popup"].includes(sez.chiave);
      // "Pezzi" c'e' sempre, tranne dentro all'editor di una scheda del
      // pop-up: li' i pezzi non si spostano e resterebbe una linguetta vuota
      if (sez.chiave === "pezzi") {
        const serve = !this._perIlPopup();
        const b1 = this._tasti[i];
        if (b1) b1.style.display = serve ? "" : "none";
        if (!serve) this._pannelli[i].setAttribute("nascosto", "");
        else if (primaValida === -1) primaValida = i;
        return;
      }
      // il Pop-up si vede solo se al tocco apre davvero un pop-up
      if (sez.chiave === "popup" && (this._config.azione || "toggle") !== "finestra") {
        const b2 = this._tasti[i];
        if (b2) b2.style.display = "none";
        this._pannelli[i].setAttribute("nascosto", "");
        return;
      }
      if (sez.chiave === "grafico" || sez.chiave === "persone") {
        // queste due valgono solo dove hanno senso: se non hanno campi,
        // la scheda sparisce del tutto
        if (campi === 0) {
          const b0 = this._tasti[i];
          if (b0) b0.style.display = "none";
          this._pannelli[i].setAttribute("nascosto", "");
          return;
        }
      }
      const utile = campi > 0 || conBlocchi;
      const bottone = this._tasti[i];
      if (bottone) bottone.style.display = utile ? "" : "none";
      if (!utile) this._pannelli[i].setAttribute("nascosto", "");
      else if (primaValida === -1) primaValida = i;
    });
    const scelta = this._tasti.findIndex(
      (b) => b.hasAttribute("scelta") && b.style.display !== "none");
    if (scelta === -1 && primaValida !== -1) this._scegliScheda(primaValida);
  }

  // cerca fra tutte le impostazioni e dice dove stanno
  _cercaOpzioni() {
    const q = (this._cerca.value || "").trim().toLowerCase();
    this._trovate.innerHTML = "";
    this._trovate.hidden = q.length < 2;
    if (q.length < 2) return;
    const senzaAccenti = (t) => String(t).toLowerCase()
      .replace(/[\u00e0\u00e1]/g, "a").replace(/[\u00e8\u00e9]/g, "e")
      .replace(/[\u00ec\u00ed]/g, "i").replace(/[\u00f2\u00f3]/g, "o")
      .replace(/[\u00f9\u00fa]/g, "u");
    const parola = senzaAccenti(q);
    let quante = 0;
    SEZIONI.forEach((sez, i) => {
      const tasto = this._tasti[i];
      if (tasto && tasto.style.display === "none") return;
      (this._gruppi[i] || []).forEach((g) => {
        if (g.form.hidden) return;
        const dentro = [];
        const guarda = (elenco) => elenco.forEach((voce) => {
          if (voce.schema) { guarda(voce.schema); return; }
          if (!voce.name) return;
          const eti = T(ETICHETTE[voce.name]) || voce.name;
          if (senzaAccenti(eti + " " + voce.name).includes(parola)) dentro.push(eti);
        });
        guarda(g.form.schema || []);
        dentro.forEach((eti) => {
          quante += 1;
          const riga = document.createElement("button");
          riga.type = "button";
          riga.className = "trovata";
          riga.innerHTML = "<b></b><span></span>";
          riga.querySelector("b").textContent = eti;
          riga.querySelector("span").textContent = sez.titolo
            + (g.gruppo.titolo ? " \u203a " + g.gruppo.titolo : "");
          riga.addEventListener("click", () => {
            this._scegliScheda(i);
            this._cerca.value = "";
            this._trovate.hidden = true;
            this._trovate.innerHTML = "";
            const dove = g.titolo || g.form;
            if (dove && dove.scrollIntoView) {
              dove.scrollIntoView({ block: "center", behavior: "smooth" });
            }
            g.form.setAttribute("acceso", "");
            setTimeout(() => g.form.removeAttribute("acceso"), 1400);
          });
          this._trovate.appendChild(riga);
        });
      });
    });
    if (!quante) {
      const vuoto = document.createElement("div");
      vuoto.className = "trovata niente";
      vuoto.textContent = "Nessuna impostazione con \u00ab" + q + "\u00bb";
      this._trovate.appendChild(vuoto);
    }
  }

  // le icone del catalogo riempiono il loro quadratino: si misurano quando
  // la scheda e' aperta davvero (da nascosta misurerebbero zero)
  _adattaCatalogo() {
    const griglia = this._scelte && this._scelte.querySelector(".iconePicker");
    if (!griglia || griglia.hidden || !griglia.isConnected) return;
    if (!griglia.getBoundingClientRect().height) return;
    griglia.querySelectorAll(".sceltaIcona").forEach((b) => {
      const dis = b.querySelector("svg");
      if (dis && b.dataset.nome) riempiRiquadro(dis, b.dataset.nome);
    });
  }

  _scegliScheda(i) {
    // Le linguette non si buttano via, si nascondono: l'editor della scheda
    // che aveva aperto in "Tocco" restava vivo per sempre - con la sua
    // anteprima - e continuava a lavorare anche stando su un'altra
    // linguetta. Uscendo da "Tocco" lo chiudo.
    let tocco = -1;
    SEZIONI.forEach((s, k) => { if (s.chiave === "popup") tocco = k; });
    if (tocco >= 0 && i !== tocco
      && (this._apertaIdx !== null && this._apertaIdx !== undefined)) {
      this._apertaIdx = null;
      this._pickerAperto = false;
      this._costruisciBlocco(true);
    }
    this._tasti.forEach((b, k) => {
      if (k === i) b.setAttribute("scelta", "");
      else b.removeAttribute("scelta");
    });
    this._pannelli.forEach((pa, k) => {
      if (k === i) pa.removeAttribute("nascosto");
      else pa.setAttribute("nascosto", "");
    });
    requestAnimationFrame(() => this._adattaCatalogo());
  }



  _costruisciFoto() {
    const box = this._foto;
    const firma = String(this._config.sfondo_immagine || "");
    if (box._firma === firma) return;
    box._firma = firma;
    box.innerHTML = "<h4>Foto di sfondo</h4>";
    const riga = document.createElement("div");
    riga.className = "foto-riga";

    if (this._config.sfondo_immagine) {
      const img = document.createElement("img");
      img.className = "foto-anteprima";
      img.src = this._config.sfondo_immagine;
      img.alt = "";
      img.title = "Tocca per scegliere un'altra foto";
      img.style.cursor = "pointer";
      img.addEventListener("click", () => this.querySelector("input[type=file]").click());
      riga.appendChild(img);
    }

    const scegli = document.createElement("button");
    scegli.className = "bt";
    scegli.type = "button";
    scegli.textContent = this._config.sfondo_immagine
      ? "Scegli un'altra foto"
      : "Scegli una foto dal telefono o dal PC";

    const file = document.createElement("input");
    file.type = "file";
    file.accept = "image/*";
    file.style.display = "none";
    scegli.addEventListener("click", () => file.click());
    file.addEventListener("change", () => {
      if (file.files && file.files[0]) this._caricaFoto(file.files[0]);
    });

    riga.append(scegli, file);

    if (this._config.sfondo_immagine) {
      const via = document.createElement("button");
      via.className = "bt chiaro";
      via.type = "button";
      via.textContent = "Togli la foto";
      via.addEventListener("click", () => {
        const c = { ...this._config };
        delete c.sfondo_immagine;
        this._config = c;
        this._emetti();
        this._render();
      });
      riga.appendChild(via);
    }
    box.appendChild(riga);

    const tinte = document.createElement("div");
    tinte.className = "foto-riga";
    // i tastini per togliere non servono piu': ogni riga del colore ha la sua X
    if (tinte.children.length) box.appendChild(tinte);
    // in fondo alla scheda Sfondo, che e' dove uno li va a cercare

    this._notaFoto = document.createElement("div");
    this._notaFoto.className = "foto-nota";
    this._notaFoto.textContent = this._config.sfondo_immagine
      ? this._config.sfondo_immagine
      : "Premi il pulsante: si apre la galleria del telefono o le cartelle del PC. "
        + "In alternativa scrivi l'indirizzo nel campo qui sopra (es. /local/foto.jpg).";
    box.appendChild(this._notaFoto);
  }

  // UNA RIGA "IMMAGINE": anteprima, il pulsante per pescarla dal telefono o
  // dal PC, il campo per scrivere l'indirizzo se sta gia' in config/www, e
  // il pulsante per toglierla. Ne servono due uguali (quella normale e
  // quella di quando e' acceso), quindi la faccio una volta sola.
  _rigaImmagine(box, chiave, titolo, sottotitolo) {
    const riga = document.createElement("div");
    riga.className = "foto-riga suaIcona";
    const scegli = document.createElement("button");
    scegli.className = "bt chiaro";
    scegli.type = "button";
    scegli.textContent = titolo;
    const file = document.createElement("input");
    file.type = "file";
    file.accept = "image/*";
    file.style.display = "none";
    scegli.addEventListener("click", () => file.click());
    file.addEventListener("change", () => {
      if (file.files && file.files[0]) this._caricaIcona(file.files[0], chiave);
    });
    // se l'immagine e' gia' sul box non ha senso ricaricarla: basta l'indirizzo
    const indirizzo = document.createElement("input");
    indirizzo.type = "text";
    indirizzo.className = "indirizzoFoto";
    indirizzo.placeholder = "oppure l'indirizzo: /local/mia.gif";
    indirizzo.addEventListener("change", () => {
      const v = indirizzo.value.trim();
      const c2 = { ...this._config };
      if (v) c2[chiave] = v; else delete c2[chiave];
      this._config = c2;
      this._emetti();
      this._costruisciScelte();
    });
    const via = document.createElement("button");
    via.className = "bt chiaro";
    via.type = "button";
    via.textContent = "Togli l'immagine";
    via.addEventListener("click", () => {
      const c2 = { ...this._config };
      delete c2[chiave];
      this._config = c2;
      this._emetti();
      this._costruisciScelte();
    });
    const ant = document.createElement("img");
    ant.className = "foto-anteprima";
    const nota = document.createElement("div");
    nota.className = "foto-nota";
    if (sottotitolo) nota.textContent = sottotitolo;
    riga.append(ant, scegli, file, indirizzo, via, nota);
    box.appendChild(riga);
    return { riga: riga, ant: ant, via: via, nota: nota, campo: indirizzo,
             chiave: chiave, fisso: sottotitolo || "" };
  }

  async _caricaIcona(file, chiave) {
    const dove = chiave || "icona_immagine";
    const riga = this._scelte
      ? (dove === "icona_immagine_accesa" ? this._scelte._suaAccesa
        : this._scelte._suaIcona) : null;
    const nota = riga ? riga.nota : null;
    if (nota) {
      nota.className = "foto-nota";
      nota.textContent = "Sto caricando " + file.name + "...";
    }
    try {
      const dati = new FormData();
      dati.append("file", file);
      const risposta = await fetch("/api/image/upload", {
        method: "POST",
        headers: { Authorization: "Bearer " + this._hass.auth.data.access_token },
        body: dati,
      });
      if (!risposta.ok) throw new Error("HTTP " + risposta.status);
      const info = await risposta.json();
      this._config = {
        ...this._config,
        [dove]: "/api/image/serve/" + info.id + "/original",
      };
      if (nota) nota.textContent = "";
      this._emetti();
      this._costruisciScelte();
    } catch (err) {
      if (nota) {
        nota.className = "foto-nota errore";
        nota.textContent = "Non sono riuscito a caricarla (" + err.message
          + "). Mettila in config/www/ e scrivi /local/nomefile.png nel codice.";
      }
    }
  }

  async _caricaFoto(file) {
    this._notaFoto.className = "foto-nota";
    this._notaFoto.textContent = "Sto caricando " + file.name + "...";
    try {
      const dati = new FormData();
      dati.append("file", file);
      const risposta = await fetch("/api/image/upload", {
        method: "POST",
        headers: { Authorization: "Bearer " + this._hass.auth.data.access_token },
        body: dati,
      });
      if (!risposta.ok) throw new Error("HTTP " + risposta.status);
      const info = await risposta.json();
      this._config = {
        ...this._config,
        sfondo_immagine: "/api/image/serve/" + info.id + "/original",
      };
      this._emetti();
      this._render();
    } catch (err) {
      this._notaFoto.className = "foto-nota errore";
      this._notaFoto.textContent =
        "Non sono riuscito a caricarla (" + err.message + "). "
        + "Mettila in config/www/ e scrivi /local/nomefoto.jpg nel campo qui sopra.";
    }
  }

  _bottone(simbolo, titolo, azione) {
    const b = document.createElement("button");
    b.className = "bt-icona";
    b.type = "button";
    b.title = titolo;
    b.textContent = simbolo;
    b.addEventListener("click", azione);
    return b;
  }

  // aspetta che un tag sia registrato, ma non all'infinito
  _attendiTag(nome, ms) {
    if (customElements.get(nome)) return Promise.resolve(true);
    return Promise.race([
      customElements.whenDefined(nome).then(() => true),
      new Promise((ok) => setTimeout(() => ok(false), ms || 2500)),
    ]);
  }

  // la classe della scheda, sia per le custom che per quelle di serie
  async _classeScheda(tipo) {
    try {
      if (tipo.indexOf("custom:") === 0) {
        const nome = tipo.slice(7);
        await this._attendiTag(nome, 2500);
        return customElements.get(nome) || null;
      }
      const atteso = "hui-" + tipo + "-card";
      if (customElements.get(atteso)) return customElements.get(atteso);
      if (window.loadCardHelpers) {
        const aiuti = await window.loadCardHelpers();
        let nome = atteso;
        try {
          const provino = aiuti.createCardElement({ type: tipo });
          if (provino && provino.localName) nome = provino.localName;
        } catch (e) { /* alcune schede si lamentano se la config e' vuota */ }
        await this._attendiTag(nome, 2500);
        return customElements.get(nome) || null;
      }
    } catch (e) { /* niente */ }
    return null;
  }

  // la configurazione di esempio della scheda: senza, molti pannelli
  // di impostazioni restano bianchi
  async _configDiPartenza(tipo, classe) {
    const base = { type: tipo };
    try {
      const cls = classe || await this._classeScheda(tipo);
      if (!cls || typeof cls.getStubConfig !== "function") return base;
      const tutte = this._hass ? Object.keys(this._hass.states) : [];
      const stub = await cls.getStubConfig(this._hass, tutte, tutte);
      if (stub && typeof stub === "object") return { ...stub, type: tipo };
    } catch (e) { /* niente */ }
    return base;
  }

  _haDisegnato(ed) {
    if (!ed) return false;
    if (ed.shadowRoot && ed.shadowRoot.childElementCount > 0) return true;
    return ed.childElementCount > 0;
  }

  // chiede alla scheda il SUO pannello di impostazioni, quello vero
  async _editorNativo(card, aggiorna, box) {
    try {
      const tipo = String(card.type || "");
      const classe = await this._classeScheda(tipo);
      if (!classe || typeof classe.getConfigElement !== "function") return false;
      const ed = await classe.getConfigElement();
      if (!ed) return false;
      ed.hass = this._hass;
      try { ed.lovelace = this._lov(); } catch (e) { /* non tutte lo vogliono */ }
      ed.addEventListener("config-changed", (e) => {
        e.stopPropagation();
        if (e.detail && e.detail.config) aggiorna(e.detail.config);
      });
      box.appendChild(ed);
      try {
        if (typeof ed.setConfig === "function") ed.setConfig({ ...card });
      } catch (e) { /* la scheda si lamenta della configurazione */ }
      // certi pannelli ci mettono qualche decimo di secondo a comparire
      // (caricano da soli i pezzi di Home Assistant che gli servono)
      for (let giro = 0; giro < 16 && !this._haDisegnato(ed); giro += 1) {
        await new Promise((ok) => setTimeout(ok, 70));
      }
      if (!this._haDisegnato(ed)) {
        try { box.removeChild(ed); } catch (e) { /* gia' tolto */ }
        return false;
      }
      this._edScheda = ed;
      return true;
    } catch (e) {
      return false;
    }
  }

  // "nuda" = ha solo il tipo (ed eventualmente l'entita' che ci metto io)
  _schedaNuda(card) {
    const proprie = Object.keys(card || {}).filter(
      (k) => k !== "type" && k !== "entity" && k !== "entities");
    return proprie.length === 0;
  }

  // IL LAYOUT, QUELLO DI HOME ASSISTANT. Uso il suo stesso comando: la
  // griglia da trascinare con i due cursori. Se per qualche motivo non e'
  // ancora stato caricato dal frontend, metto due tendine che fanno la
  // stessa cosa, cosi' la misura si puo' cambiare lo stesso.
  _riempiEditorScheda(box, card, aggiorna, indice) {
    box.innerHTML = "";
    const attesa = document.createElement("div");
    attesa.className = "vuoto";
    attesa.textContent = "Carico le impostazioni della scheda...";
    // il contenitore va attaccato SUBITO: un elemento staccato dal
    // documento non si disegna mai, e sembrerebbe un pannello vuoto
    // l'anteprima della scheda si vede gia' nel riquadro a destra,
    // dentro "Contenuto del pop-up": qui sarebbe solo un doppione
    const dentro = document.createElement("div");
    // IL LAYOUT VA SOPRA, NON SOTTO. Sotto finiva in fondo all'editor della
    // scheda, che ha le sue linguette (Base, Comandi, Grafico, Tocco...):
    // qualunque linguetta guardassi, il Layout compariva li' in fondo e
    // sembrava far parte di quella. Sopra invece sta insieme alle altre
    // cose che riguardano la scheda INTERA - il suo sfondo, la sua misura -
    // e si vede subito, senza scorrere tutte le sue impostazioni.
    // Se la scheda e' una GRIGLIA il suo Layout qui non lo metto: nel
    // pop-up la griglia viene aperta e le sue caselle vanno per conto loro
    // (vedi _pezziFinestra), quindi una misura della griglia non vorrebbe
    // dire niente. Il Layout compare invece dentro all'editor di ogni
    // casella, dove uno se lo aspetta - ci pensa _seguiFigli.
    // Una casella NOSTRA ha la sua linguetta "Layout" nelle sue
    // impostazioni, qui sotto: un secondo riquadro sciolto sarebbe un
    // doppione. Per tutte le altre schede - che le impostazioni le fa
    // Home Assistant - il riquadro serve, ed e' qui.
    box.append(attesa, dentro);

    const pronta = this._schedaNuda(card)
      ? this._configDiPartenza(String(card.type || "")).then((base) => {
          if (Object.keys(base).length <= 1) return card;
          const unita = { ...base, ...card };
          // la salvo dopo, quando il pannello e' gia' in piedi
          setTimeout(() => aggiorna(unita), 500);
          return unita;
        })
      : Promise.resolve(card);

    pronta.then((carta) => this._editorNativo(carta, aggiorna, dentro)).then((fatto) => {
      if (!box.isConnected) return;
      if (!fatto && customElements.get("hui-card-element-editor")) {
        const ed = document.createElement("hui-card-element-editor");
        ed.hass = this._hass;
        ed.lovelace = this._lov();
        dentro.appendChild(ed);
        ed.value = card;
        // me lo segno: quando cambio la misura di una casella dentro alla
        // griglia devo dirglielo, se no lui tiene in mano la griglia
        // VECCHIA e alla prima occasione la rimanda indietro cancellando
        // quello che ho appena scritto (era il rimbalzo)
        box._edHA = ed;
        ed.addEventListener("config-changed", (e) => {
          e.stopPropagation();
          if (e.detail && e.detail.config) aggiorna(e.detail.config);
        });
        fatto = true;
      }
      if (!fatto) dentro.appendChild(this._moduloSemplice(card, aggiorna));
      attesa.remove();
      // la scheda "Manuale" nasce col riquadro del codice gia' aperto:
      // e' l'unica cosa che c'e' da fare, farlo cercare non ha senso
      // il pannello viene rifatto un paio di volte di fila appena la scheda
      // arriva: se dimenticassi subito il segno, la prima costruzione se lo
      // mangerebbe e quella che resta a video nascerebbe chiusa
      const subito = this._apriCodicePer !== undefined
        && this._apriCodicePer !== null && this._apriCodicePer === indice;
      if (subito) {
        clearTimeout(this._scordaCodice);
        this._scordaCodice = setTimeout(() => { this._apriCodicePer = null; }, 2500);
      }
      box.appendChild(this._codiceScheda(card, aggiorna, subito));
    }).catch(() => {
      // SE L'EDITOR DELLA SCHEDA NON SI CARICA (una card di HACS che non
      // risponde, una configurazione a meta', un errore suo) il Layout deve
      // esserci lo stesso: prima moriva tutta la catena e restavi senza
      // Layout e senza il riquadro del codice, senza capire perche'.
      if (!box.isConnected) return;
      attesa.textContent = "Le impostazioni di questa scheda non si sono "
        + "caricate. Il codice lo trovi qui sotto.";
      if (!box.querySelector(".codice-scheda")) {
        box.appendChild(this._codiceScheda(card, aggiorna, false));
      }
    });
  }

  // il codice della scheda, in YAML come in Home Assistant
  _codiceScheda(card, aggiorna, subito) {
    const box = document.createElement("div");
    box.className = "codice-scheda";
    const apri = document.createElement("button");
    apri.className = "bt chiaro";
    apri.type = "button";
    apri.textContent = "Codice della scheda (YAML)";
    const dentro = document.createElement("div");
    dentro.hidden = true;
    const esito = document.createElement("div");
    esito.className = "esito";
    let leggi = null;

    const conEditorHa = () => {
      const ed = document.createElement("ha-yaml-editor");
      ed.hass = this._hass;
      dentro.appendChild(ed);
      ed.defaultValue = card;
      let ultimo = card;
      let buono = true;
      ed.addEventListener("value-changed", (e) => {
        e.stopPropagation();
        buono = e.detail.isValid !== false;
        if (buono) ultimo = e.detail.value;
        esito.textContent = buono ? "" : "YAML non valido";
      });
      leggi = () => (buono ? ultimo : null);
    };

    const conCasella = () => {
      const area = document.createElement("textarea");
      area.rows = 12;
      area.spellcheck = false;
      area.value = aYaml(card, 0);
      dentro.appendChild(area);
      leggi = () => daYaml(area.value);
    };

    const applica = document.createElement("button");
    applica.className = "bt";
    applica.type = "button";
    applica.textContent = "Applica il codice";
    applica.hidden = true;
    applica.addEventListener("click", () => {
      try {
        const nuova = leggi ? leggi() : null;
        if (!nuova || typeof nuova !== "object") throw new Error("codice vuoto o non valido");
        if (!nuova.type) throw new Error('manca la riga "type:"');
        esito.textContent = "";
        aggiorna(nuova);
      } catch (e) {
        esito.textContent = "Codice non valido: " + e.message;
      }
    });

    let costruito = false;
    apri.addEventListener("click", async () => {
      if (!costruito) {
        costruito = true;
        const c_e = await this._attendiTag("ha-yaml-editor", 1200);
        if (c_e) conEditorHa(); else conCasella();
      }
      const chiuso = dentro.hidden;
      dentro.hidden = !chiuso;
      applica.hidden = !chiuso;
      esito.textContent = "";
    });

    box.append(apri, dentro, applica, esito);
    if (subito) setTimeout(() => apri.click(), 0);
    return box;
  }

  // Tieni premuta la manina e trascini la scheda dove la vuoi. Non sposto
  // niente nel documento mentre trascini: alzo solo la riga e segno con una
  // riga colorata dove andra' a finire. L'ordine vero lo scrivo quando molli.
  _riordinaCol(presa, riga, indice) {
    let tira = null;
    const pulisci = () => {
      if (!this._blocco) return;
      this._blocco.querySelectorAll(".riga-scheda").forEach((r) => {
        r.classList.remove("segnaSopra", "segnaSotto");
      });
    };
    const muovi = (e) => {
      if (!tira) return;
      e.preventDefault();
      riga.style.transform = "translateY(" + (e.clientY - tira.y0) + "px)";
      let a = 0;
      tira.righe.forEach((x, k) => {
        if (k === tira.da) return;
        if (e.clientY > x.r.top + x.r.height / 2) a += 1;
      });
      tira.a = a;
      pulisci();
      // la riga colorata dove finira': sopra a quella che verra' spinta giu',
      // o sotto all'ultima se la stai portando in fondo
      const altre = tira.righe.filter((x, k) => k !== tira.da);
      if (altre.length) {
        if (a < altre.length) altre[a].el.classList.add("segnaSopra");
        else altre[altre.length - 1].el.classList.add("segnaSotto");
      }
    };
    const su = () => {
      if (!tira) return;
      window.removeEventListener("pointermove", muovi, true);
      window.removeEventListener("pointerup", su, true);
      window.removeEventListener("pointercancel", su, true);
      riga.classList.remove("inmano");
      riga.style.transform = "";
      pulisci();
      const da = tira.da;
      const a = tira.a;
      tira = null;
      if (a === da) return;
      const l = this._schede().slice();
      l.splice(a, 0, l.splice(da, 1)[0]);
      this._apertaIdx = null;
      this._salvaSchede(l, true);
    };
    presa.addEventListener("pointerdown", (e) => {
      if (!this._blocco) return;
      e.preventDefault();
      e.stopPropagation();
      const righe = [...this._blocco.querySelectorAll(".riga-scheda")];
      tira = {
        y0: e.clientY, da: indice, a: indice,
        righe: righe.map((r) => ({ el: r, r: r.getBoundingClientRect() })),
      };
      riga.classList.add("inmano");
      // ascolto sulla finestra: il dito esce quasi subito dalla manina
      window.addEventListener("pointermove", muovi, true);
      window.addEventListener("pointerup", su, true);
      window.addEventListener("pointercancel", su, true);
    });
  }

  _moduloSemplice(card, aggiorna) {
    const MULTI = ["entities", "glance", "history-graph", "statistics-graph",
                   "logbook", "map", "distribution"];
    const multi = MULTI.includes(card.type) || Array.isArray(card.entities);
    const form = document.createElement("ha-form");
    form.hass = this._hass;
    form._ebbeHass = !!this._hass;
    form._quandoHass = Date.now();
    form.schema = [
      multi
        ? { name: "entities", selector: { entity: { multiple: true } } }
        : { name: "entity", selector: { entity: {} } },
      { name: "title", selector: { text: {} } },
      { name: "name", selector: { text: {} } },
    ];
    form.computeLabel = (x) => ({
      entity: "Entita", entities: "Entita", title: "Titolo (facoltativo)",
      name: "Nome (facoltativo)",
    })[x.name] || x.name;
    form.data = card;
    form.addEventListener("value-changed", (e) => {
      e.stopPropagation();
      const nuova = { ...card, ...e.detail.value };
      Object.keys(nuova).forEach((k) => {
        if (nuova[k] === "" || nuova[k] === undefined) delete nuova[k];
      });
      aggiorna(nuova);
    });
    return form;
  }

  _costruisciTendina() {
    const riga = document.createElement("div");
    riga.className = "scelta-riga";
    const sel = document.createElement("select");
    sel.className = "tendina";

    const gruppo = (titolo, voci) => {
      if (!voci.length) return;
      const g = document.createElement("optgroup");
      g.label = titolo;
      voci.forEach(([tipo, nome]) => {
        const o = document.createElement("option");
        o.value = tipo;
        o.textContent = nome;
        g.appendChild(o);
      });
      sel.appendChild(g);
    };

    const mie = (window.customCards || [])
      .filter((c) => c.type && c.type !== "casa-tile")
      .map((c) => ["custom:" + c.type, c.name || c.type]);

    gruppo("Le piu' usate", SCHEDE_PRONTE);
    gruppo("Altre schede di Home Assistant", SCHEDE_ALTRE);
    gruppo("Le tue schede aggiuntive", mie);
    gruppo("Scrivo io", [[SCHEDA_MANO, "Manuale - incollo il codice YAML"]]);

    const ok = document.createElement("button");
    ok.className = "bt";
    ok.type = "button";
    ok.textContent = "Aggiungi";
    ok.addEventListener("click", () => this._scegli(sel.value));
    riga.append(sel, ok);
    return riga;
  }

  _scegli(tipo) {
    // "Manuale": metto una scheda di testo con le istruzioni dentro e apro
    // subito il riquadro del codice. Da li' incolla quello che vuole e la
    // scheda diventa quella - come fa Home Assistant con la voce "Manuale".
    if (tipo === SCHEDA_MANO) {
      const l0 = this._schede().slice();
      const posto0 = l0.length;
      l0.push({ type: "markdown",
        content: "Apri **Codice della scheda (YAML)** qui sotto e incolla il "
          + "codice della scheda che vuoi: questa riga sparisce e al suo "
          + "posto arriva quella." });
      this._pickerAperto = false;
      this._apertaIdx = posto0;
      this._apriCodicePer = posto0;
      this._salvaSchede(l0, true);
      return;
    }
    const MULTI = ["entities", "glance", "history-graph", "statistics-graph",
                   "logbook", "map", "distribution"];
    const mia = {};
    if (this._config.entity) {
      if (MULTI.includes(tipo)) mia.entities = [this._config.entity];
      else mia.entity = this._config.entity;
    } else if (MULTI.includes(tipo)) {
      mia.entities = [];
    }
    // metto subito una riga provvisoria, cosi' si vede che e' arrivata,
    // poi le do la configurazione di partenza della scheda
    const l = this._schede().slice();
    const posto = l.length;
    l.push({ type: tipo, ...mia });
    this._pickerAperto = false;
    this._apertaIdx = posto;
    this._salvaSchede(l, true);

    this._configDiPartenza(tipo).then((base) => {
      if (Object.keys(base).length <= 1) return;
      const ora = this._schede().slice();
      if (!ora[posto] || ora[posto].type !== tipo) return;
      ora[posto] = { ...base, ...ora[posto] };
      this._salvaSchede(ora, true);
    });
  }

  // UNA CASELLA NOSTRA IL FONDO SE LO DISEGNA DA SOLA, e se lo scrive
  // addosso: quello che le passo dalla busta non lo guarda nemmeno. Quindi
  // per lei (e per le caselle nostre dentro a una griglia o a una pila) il
  // colore va scritto nelle SUE impostazioni. Torna indietro null se li'
  // dentro di caselle nostre non ce n'e' nessuna: allora vale la busta.
  _tingiDentro(cfg, dati) {
    if (!cfg || typeof cfg !== "object") return null;
    if (String(cfg.type || "") === "custom:casa-tile") {
      const c2 = { ...cfg };
      if ("sfondo" in dati) {
        if (dati.sfondo) c2.sfondo_colore = dati.sfondo;
        else delete c2.sfondo_colore;
      }
      if ("trasparenza" in dati) {
        if (dati.trasparenza) c2.trasparenza = dati.trasparenza;
        else delete c2.trasparenza;
      }
      return c2;
    }
    let cambiato = false;
    const c2 = { ...cfg };
    if (Array.isArray(cfg.cards)) {
      const l = cfg.cards.map((x) => {
        const y = this._tingiDentro(x, dati);
        if (y) cambiato = true;
        return y || x;
      });
      if (cambiato) c2.cards = l;
    }
    if (cfg.card) {
      const y = this._tingiDentro(cfg.card, dati);
      if (y) { c2.card = y; cambiato = true; }
    }
    return cambiato ? c2 : null;
  }

  // e che colore ha adesso: la prima casella nostra che trovo li' dentro
  _tintaDentro(cfg) {
    if (!cfg || typeof cfg !== "object") return null;
    if (String(cfg.type || "") === "custom:casa-tile") {
      return { sfondo: cfg.sfondo_colore, trasparenza: cfg.trasparenza };
    }
    const figli = (Array.isArray(cfg.cards) ? cfg.cards : [])
      .concat(cfg.card ? [cfg.card] : []);
    for (let i = 0; i < figli.length; i += 1) {
      const t = this._tintaDentro(figli[i]);
      if (t) return t;
    }
    return null;
  }

  _vestitoScheda(i) {
    const riga = document.createElement("div");
    riga.className = "vestito-riga";
    const suoi = Array.isArray(this._config.finestra_schede_stile)
      ? this._config.finestra_schede_stile.slice() : [];
    const carta = (this._schede() || [])[i] || {};
    const daSola = this._tintaDentro(carta);
    const mio = daSola || suoi[i] || {};
    const salva = (dati) => {
      // se li' dentro ci sono caselle nostre, il colore si scrive nelle
      // loro impostazioni: e' l'unico che guardano
      if (daSola) {
        const nuova = this._tingiDentro((this._schede() || [])[i] || {}, dati);
        if (nuova) {
          const l = (this._schede() || []).slice();
          l[i] = nuova;
          this._conservaPosto(() => this._salvaSchede(l, false));
          return;
        }
      }
      const l = (Array.isArray(this._config.finestra_schede_stile)
        ? this._config.finestra_schede_stile.slice() : []);
      while (l.length <= i) l.push({});
      l[i] = { ...(l[i] || {}), ...dati };
      // se non ha piu' niente addosso lo tolgo
      if (l[i].sfondo === null) delete l[i].sfondo;
      if (l[i].trasparenza === null) delete l[i].trasparenza;
      this._config = { ...this._config, finestra_schede_stile: l };
      // il cursore lo sta trascinando lui: la pagina deve restare ferma
      this._conservaPosto(() => this._emetti());
    };

    const eti = document.createElement("span");
    eti.className = "eti";
    eti.textContent = "Sfondo di questa scheda";

    const scelta = this._sceltaColore(mio.sfondo, (rgb) => salva({ sfondo: rgb }));

    const barra = document.createElement("input");
    barra.type = "range";
    barra.min = "0"; barra.max = "100"; barra.step = "5";
    barra.title = "Quanto e trasparente";
    barra.value = String(mio.trasparenza === undefined ? 0 : mio.trasparenza);
    const quanto = document.createElement("span");
    quanto.className = "quanto";
    quanto.textContent = barra.value + "%";
    barra.addEventListener("input", () => { quanto.textContent = barra.value + "%"; });
    barra.addEventListener("change", () => salva({ trasparenza: Number(barra.value) }));

    const via = this._bottone("✕", "Togli il vestito a questa scheda", () => {
      if (daSola) {
        const nuova = this._tingiDentro((this._schede() || [])[i] || {},
          { sfondo: null, trasparenza: null });
        if (nuova) {
          const l0 = (this._schede() || []).slice();
          l0[i] = nuova;
          this._salvaSchede(l0, true);
          return;
        }
      }
      const l = (Array.isArray(this._config.finestra_schede_stile)
        ? this._config.finestra_schede_stile.slice() : []);
      if (l[i]) l[i] = {};
      this._config = { ...this._config, finestra_schede_stile: l };
      this._emetti();
      this._costruisciBlocco(true);
    });

    riga.append(eti, scelta.bolla, barra, quanto, via);
    const fuori = document.createElement("div");
    fuori.className = "colore-riga-fuori";
    fuori.append(riga, scelta.cassetto);
    return fuori;
  }

  _costruisciBlocco(forza) {
    const mostra = this._config.azione === "finestra";
    this._blocco.style.display = mostra ? "" : "none";
    if (!mostra) {
      this._blocco.innerHTML = "";
      this._firmaBlocco = null;
      return;
    }

    const lista = this._schede();
    // se cambiano solo i VALORI di una scheda non rifaccio l'elenco:
    // altrimenti il pannello aperto si richiude ad ogni tocco
    // Il vestito delle schede NON sta nella firma: muovendo il cursore la
    // lista si rifaceva da capo e la pagina risaliva in cima, proprio
    // mentre lo stavi trascinando.
    // la casella dell'anteprima deve sapere quale scheda ha in mano, per
    // tenerla ferma mentre ne cambia la misura
    SCHEDA_APERTA.indice = (this._apertaIdx === null
      || this._apertaIdx === undefined) ? null : this._apertaIdx;
    const firma = JSON.stringify(lista.map((c) => (c || {}).type))
      + "|" + this._apertaIdx + "|" + (this._pickerAperto ? 1 : 0);
    if (!forza && this._firmaBlocco === firma) return;
    this._firmaBlocco = firma;
    this._blocco.innerHTML =
      "<h4>Schede dentro il pop-up</h4>" +
      "<p class='aiuto'>Aggiungi tutte le schede che vuoi: sono le stesse di Home Assistant, " +
      "e le puoi modificare quando vuoi. Per riordinarle tieni premuto il "
      + "puntino a sinistra e trascinale.</p>";

    if (!lista.length) {
      const vuoto = document.createElement("div");
      vuoto.className = "vuoto";
      vuoto.textContent = "Ancora nessuna scheda: il pop-up mostrera l'elenco dell'entita. Premi qui sotto per sceglierne una.";
      this._blocco.appendChild(vuoto);
    }

    lista.forEach((card, i) => {
      const riga = document.createElement("div");
      riga.className = "riga-scheda" + (this._apertaIdx === i ? " aperta" : "");
      const num = document.createElement("span");
      num.className = "num";
      num.textContent = (i + 1) + ".";
      const tipo = document.createElement("span");
      tipo.className = "tipo";
      const tecnico = String(card.type || "?");
      tipo.innerHTML = '<span class="chiaro"></span><span class="piccolo"></span>';
      tipo.querySelector(".chiaro").textContent = nomeScheda(tecnico);
      tipo.querySelector(".piccolo").textContent = tecnico.replace("custom:", "");
      const spinta = document.createElement("span");
      spinta.className = "spinta";
      spinta.append(
        this._bottone("\u270e", "Modifica", () => {
          this._apertaIdx = this._apertaIdx === i ? null : i;
          this._costruisciBlocco(true);
        }),
        this._bottone("\u2715", "Elimina", () => {
          const l = lista.slice();
          l.splice(i, 1);
          this._apertaIdx = null;
          this._salvaSchede(l, true);
        })
      );
      // per riordinare si tiene premuto qui e si trascina, invece delle due
      // frecce: con piu' di tre schede portarne una in cima erano cinque clic
      const presa = document.createElement("span");
      presa.className = "presa";
      presa.textContent = "\u283f";
      presa.title = "Tieni premuto e trascina per riordinare";
      this._riordinaCol(presa, riga, i);
      riga.append(presa, num, tipo, spinta);
      this._blocco.appendChild(riga);
      // Lo sfondo si puo' dare a QUALUNQUE scheda. Prima lo saltavo per le
      // caselle nostre e per quelle che ne contengono altre (griglia, pile):
      // ma il colore lo do alla busta, e da li' scende dentro - la griglia
      // tinge le caselle che ha dentro, e la casella nostra lo usa solo se
      // non ne ha gia' uno suo.
      this._blocco.appendChild(this._vestitoScheda(i));

      if (this._apertaIdx === i) {
        const box = document.createElement("div");
        box.className = "editor-scheda";
        const aggiorna = (nuova) => {
          const l = this._schede().slice();
          l[i] = nuova;
          const tec = String(nuova.type || "?");
      tipo.querySelector(".chiaro").textContent = nomeScheda(tec);
      tipo.querySelector(".piccolo").textContent = tec.replace("custom:", "");
          this._salvaSchede(l, false);
        };
        this._riempiEditorScheda(box, card, aggiorna, i);
        this._blocco.appendChild(box);
      }
    });

    // IN FONDO ALL'ELENCO: o il tasto "+ Aggiungi scheda", o la tendina da
    // cui scegliere. Sta in un pezzo suo, e premendo si rifa' SOLO quello:
    // tutto il resto - comprese le schede che ha aperto - non si tocca e
    // non si muove di un pelo.
    const coda = document.createElement("div");
    coda.className = "coda-blocco";
    this._codaBlocco = coda;
    this._blocco.appendChild(coda);
    this._riempiCoda();
  }

  _riempiCoda() {
    const coda = this._codaBlocco;
    if (!coda) return;
    coda.innerHTML = "";
    if (this._pickerAperto) {
      coda.appendChild(this._costruisciTendina());
      const annulla = document.createElement("button");
      annulla.className = "bt chiaro";
      annulla.type = "button";
      annulla.textContent = "Annulla";
      annulla.addEventListener("click", () => {
        this._pickerAperto = false;
        this._riempiCoda();
      });
      coda.appendChild(annulla);
    } else {
      const aggiungi = document.createElement("button");
      aggiungi.className = "bt";
      aggiungi.type = "button";
      aggiungi.textContent = "+ Aggiungi scheda";
      aggiungi.addEventListener("click", () => {
        this._pickerAperto = true;
        this._riempiCoda();
      });
      coda.appendChild(aggiungi);
    }
  }
}

// se il file viene caricato due volte (vecchia risorsa /local rimasta
// insieme a quella di HACS) il secondo giro non deve buttare giu' la plancia
