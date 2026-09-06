// -*- coding: utf-8 -*-
// Le schede del pop-up: sceglierle, ordinarle, vestirle.

import { T, TH } from './lingua.js';
import { SCHEDA_APERTA } from './aiuti.js';
import { SCHEDA_MANO, SCHEDE_ALTRE, SCHEDE_PRONTE, SEZIONI, nomeScheda } from './schema.js';
import { segno } from './segni.js';
import { aYaml, daYaml } from './yaml.js';

export const ConSchede = (Base) => class extends Base {
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
    attesa.textContent = T("Carico le impostazioni della scheda...");
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
      attesa.textContent = T("Le impostazioni di questa scheda non si sono "
        + "caricate. Il codice lo trovi qui sotto.");
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
    apri.textContent = T("Codice della scheda (YAML)");
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
    applica.textContent = T("Applica il codice");
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
    ok.textContent = T("Aggiungi");
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
    eti.textContent = T("Sfondo di questa scheda");

    const scelta = this._sceltaColore(mio.sfondo, (rgb) => salva({ sfondo: rgb }));

    const barra = document.createElement("input");
    barra.type = "range";
    barra.min = "0"; barra.max = "100"; barra.step = "5";
    barra.title = T("Quanto e trasparente");
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
    this._blocco.innerHTML = TH(
      "<h4>Schede dentro il pop-up</h4>" +
      "<p class='aiuto'>Aggiungi tutte le schede che vuoi: sono le stesse di Home Assistant, " +
      "e le puoi modificare quando vuoi. Per riordinarle tieni premuto il "
      + "puntino a sinistra e trascinale.</p>");

    if (!lista.length) {
      const vuoto = document.createElement("div");
      vuoto.className = "vuoto";
      vuoto.textContent = T("Ancora nessuna scheda: il pop-up mostrera l'elenco dell'entita. Premi qui sotto per sceglierne una.");
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
      presa.title = T("Tieni premuto e trascina per riordinare");
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
      annulla.textContent = T("Annulla");
      annulla.addEventListener("click", () => {
        this._pickerAperto = false;
        this._riempiCoda();
      });
      coda.appendChild(annulla);
    } else {
      const aggiungi = document.createElement("button");
      aggiungi.className = "bt";
      aggiungi.type = "button";
      aggiungi.textContent = T("+ Aggiungi scheda");
      aggiungi.addEventListener("click", () => {
        this._pickerAperto = true;
        this._riempiCoda();
      });
      coda.appendChild(aggiungi);
    }
  }

};
