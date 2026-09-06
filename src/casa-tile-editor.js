// -*- coding: utf-8 -*-
// Il riquadro delle impostazioni.

import { ConColori } from './editor-colori.js';
import { ConIcone } from './editor-icone.js';
import { ConPosti } from './editor-posti.js';
import { ConSchede } from './editor-schede.js';
import { iconaAutomatica } from './icone.js';
import { T, laLingua, scegliLingua, traduciSchema } from './lingua.js';
import { DIPENDE, ETICHETTE, SEZIONI, SOLO_AZIONE, SOLO_PER, STILE_SELETTORE } from './schema.js';
import { segno } from './segni.js';
import { STILE_EDITOR } from './stile-editor.js';
import { VERSIONE } from './versione.js';




export class CasaTileEditor extends ConPosti(ConColori(ConIcone(ConSchede(HTMLElement)))) {
  setConfig(config) {
    // le linguette si scrivono una volta sola: la lingua deve essere gia'
    // decisa. Home Assistant passa `hass` prima di qui, ma non costa niente
    // assicurarsene.
    scegliLingua(this._hass);
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



  _emetti() {
    this.dispatchEvent(new CustomEvent("config-changed", {
      detail: { config: this._config }, bubbles: true, composed: true,
    }));
  }

  _render() {
    // le linguette si scrivono una volta sola: se la lingua e' arrivata
    // dopo, butto via quello che c'e' e riscrivo.
    if (this._costruito && this._linguaScocca !== laLingua()) {
      this.innerHTML = "";
      this._costruito = false;
      this._formaOra = undefined;
      this._pannelli = [];
    }
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
      this._cerca.placeholder = T("Cerca un'impostazione: meteo, colore, km...");
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
      targa.title = T("Versione della card: se non e' quella che ti aspetti, "
        + "il browser sta ancora usando una copia vecchia (ricarica con Ctrl+F5)");
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
      this._linguaScocca = laLingua();
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








































  // se Home Assistant mi stacca e mi riattacca (cambio di linguetta) gli
  // ascoltatori del trascinamento vanno rimessi
  connectedCallback() {
    const box = this._postiBox;
    if (box && box._carta && !this._ascolti) this._pistaTrascina(box._carta);
    this._ascoltaMisure();
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



























}

// se il file viene caricato due volte (vecchia risorsa /local rimasta
// insieme a quella di HACS) il secondo giro non deve buttare giu' la plancia
