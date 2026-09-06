// -*- coding: utf-8 -*-
// La finestra che si apre al tocco, e le schede che ci stanno dentro.

import { T, TH } from './lingua.js';
import { riempiRiquadro } from './aiuti.js';
import { conAlfa, daRgb, scurisci } from './colori.js';
import { ICONE, aspiraFuori, disegnoAspira, disegnoBatteria, disegnoMdi, indirizzoFoto } from './icone.js';

export const ConFinestra = (Base) => class extends Base {
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
    box.innerHTML = TH("<div class='titoletto'>Contenuto del pop-up</div>");
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
          avviso.textContent = T('La scheda "') + cfg.type
            + T('" non funziona con questa entita.');
          this._fCorpo.appendChild(avviso);
        }
      });
    } catch (err) {
      this._fCorpo.textContent = T("Non riesco a creare il contenuto della finestra.");
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

};
