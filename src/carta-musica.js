// -*- coding: utf-8 -*-
// Il lettore: cerca, sfoglia, coda, casse del gruppo, sorgenti.

import { T, TH } from './lingua.js';
import { RICERCHE, soloDalPallino } from './aiuti.js';
import { segno } from './segni.js';

export const ConMusica = (Base) => class extends Base {
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
      b.textContent = T(coppia[1]);
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
    pan.querySelector(".s-titolo").textContent = T(titolo);
    elenco.innerHTML = TH('<div class="s-nota">Un attimo...</div>');
    const eid = this._entitaAttiva ? this._entitaAttiva() : this._config.entity;
    const finita = (voci) => this._scriviSfoglia(voci, titolo);
    const male = (e) => {
      elenco.innerHTML = '<div class="s-nota">' + T("Non risponde (")
        + ((e && e.message) || T("errore")) + ")</div>";
    };
    this._collegamentoMA(eid).then((cfg) => {
    if (chiave === "library") {
      if (!cfg) { male(new Error("serve Music Assistant")); return; }
      finita([["playlist", "Playlist"], ["album", "Album"],
        ["artist", "Artisti"], ["track", "Brani"], ["radio", "Radio"]]
        .map((coppia) => ({ nome: T(coppia[1]), cartella: true,
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
    pan.querySelector(".s-titolo").textContent = T(titolo);
    pan.querySelector(".s-indietro").hidden = !(this._pila || []).length;
    elenco.innerHTML = "";
    if (!voci || !voci.length) {
      elenco.innerHTML = TH('<div class="s-nota">Qui non c-e niente.</div>'
        .replace("c-e", "c" + String.fromCharCode(39) + "e"));
      return;
    }
    if (!indietro) this._ultimeVoci = { voci, titolo };
    const eid = this._entitaAttiva ? this._entitaAttiva() : this._config.entity;
    voci.forEach((v) => {
      const riga = document.createElement("div");
      riga.className = "voce";
      riga.innerHTML = TH((v.foto ? '<img alt="">' : '<i class="vuota"></i>')
        + '<span class="dati"><b></b><i></i></span>'
        + (v.cartella ? ""
          : '<button class="piu" type="button" title="Che ne faccio">'
            + '<ha-icon icon="mdi:dots-vertical"></ha-icon></button>'));
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
    elenco.innerHTML = TH('<div class="s-nota">Un attimo...</div>');
    this._hass.callWS({ type: "call_service", domain: v.carica.domain,
      service: v.carica.service, service_data: v.carica.service_data,
      return_response: true,
    }).then((r) => {
      const dentro = (r || {}).response || {};
      this._scriviSfoglia(this._vociDa(dentro.items || dentro), v.nome);
    }).catch((e) => {
      elenco.innerHTML = '<div class="s-nota">' + T("Non risponde (")
        + ((e && e.message) || T("errore")) + ")</div>";
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
        b.textContent = T(nome);
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
    esiti.innerHTML = TH('<div class="c-nota">Sto cercando...</div>');
    this._collegamentoMA(eid).then((collegamento) => {
    if (!collegamento) {
      esiti.innerHTML = TH('<div class="c-nota">La ricerca ha bisogno di Music '
        + "Assistant: qui non lo trovo.</div>");
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
      esiti.innerHTML = '<div class="c-nota">' + T("La ricerca non ha risposto (")
        + ((e && e.message) || T("errore")) + ")</div>";
    });
    });
  }

  _scriviEsiti(elenco, eid) {
    const esiti = this._panCerca.querySelector(".c-esiti");
    esiti.innerHTML = "";
    if (!elenco.length) {
      esiti.innerHTML = TH('<div class="c-nota">Non ho trovato niente.</div>');
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
      box.innerHTML = TH('<div class="coda-testa">In coda</div><div class="coda-lista"></div>');
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
      lista.innerHTML = '<div class="coda-vuota">' + T("Non riesco a leggere la coda")
        + (errore ? " (" + errore + ")" : "") + "</div>";
      return;
    }
    if (!elenco.length) {
      lista.innerHTML = TH('<div class="coda-vuota">Non c\'e\' niente in coda</div>');
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

  // I VOLUMI DELLE CASSE UNITE. Torna niente se non c'e' gruppo, o se le
  // casse che sanno dire il loro volume sono meno di due: in quel caso il
  // volume del gruppo non vorrebbe dire niente.
  _volumiDelGruppo(st) {
    const membri = st && Array.isArray(st.attributes.group_members)
      ? st.attributes.group_members : [];
    if (membri.length < 2) return null;
    const stati = this._hass ? this._hass.states : {};
    const dentro = membri.map((e) => stati[e])
      .filter((s) => s && s.attributes.volume_level !== undefined);
    if (dentro.length < 2) return null;
    const somma = dentro.reduce((t, s) => t + Number(s.attributes.volume_level || 0), 0);
    return { media: Math.round((somma / dentro.length) * 100),
      casse: dentro.map((s) => s.entity_id) };
  }

  // Muovere il gruppo: ogni cassa si sposta IN PROPORZIONE, cosi' chi era
  // piu' bassa resta piu' bassa - e' quello che uno si aspetta e quello che
  // fa Music Assistant. Se erano tutte a zero vanno tutte al valore
  // chiesto, se no da li' non si muoverebbero mai piu'.
  _mandaVolumeGruppo(gruppo, valore) {
    if (!this._hass) return;
    const stati = this._hass.states;
    const vuole = Math.max(0, Math.min(100, Number(valore))) / 100;
    const media = gruppo.media / 100;
    gruppo.casse.forEach((eid) => {
      const s = stati[eid];
      if (!s) return;
      const ora = Number(s.attributes.volume_level || 0);
      const nuovo = media > 0 ? ora * (vuole / media) : vuole;
      this._hass.callService("media_player", "volume_set",
        { entity_id: eid,
          volume_level: Math.max(0, Math.min(1, Math.round(nuovo * 1000) / 1000)) });
    });
  }

  _casseCandidate(padrone) {
    let lista = this._lettori();
    if (!lista.length) {
      const stati = this._hass ? this._hass.states : {};
      const reg = (this._hass && this._hass.entities) || {};
      // SOLO LE CASSE DELLA SUA INTEGRAZIONE. Prima guardava qualsiasi
      // media_player della casa: bastava che partisse la musica su un
      // lettore di un'altra integrazione e la casella ci saltava sopra,
      // facendo vedere una cosa che non era la sua. E unire casse di
      // integrazioni diverse non si puo' fare comunque.
      const sua = (reg[padrone] || {}).platform;
      lista = Object.keys(stati).filter((e) => e.indexOf("media_player.") === 0
        && Array.isArray(stati[e].attributes.group_members)
        && (!sua || (reg[e] || {}).platform === sua)).slice(0, 14);
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
        r.innerHTML = TH('<button class="sw" type="button"></button>'
          + '<span class="chi"></span>'
          + '<input class="vol" type="range" min="0" max="100" step="1">'
          + '<button class="tras" type="button" hidden title="Porta qui la coda '
          + 'che sta suonando">') + segno("trasferisci") + "</button>";
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
        soloDalPallino(vol);
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
    // IN CIMA: il volume di TUTTE le casse insieme. La barra della casella
    // fa gia' questo, ma col riquadro aperto sta sotto e non si vede.
    let tutte = box.querySelector(".tutte-le-casse");
    if (!tutte) {
      tutte = document.createElement("div");
      tutte.className = "voce tutte-le-casse";
      tutte.innerHTML = TH('<span class="chi">Tutte le casse</span>'
        + '<input class="vol" type="range" min="0" max="100" step="1">');
      const volT = tutte.querySelector(".vol");
      soloDalPallino(volT);
      const mandaT = () => {
        const suo = this._hass && this._hass.states[this._config.entity];
        const gr = this._volumiDelGruppo(suo);
        if (gr) this._mandaVolumeGruppo(gr, Number(volT.value));
      };
      volT.addEventListener("input", () => {
        tutte._trascino = true;
        volT.style.setProperty("--riempito", volT.value + "%");
        clearTimeout(tutte._freno);
        tutte._freno = setTimeout(mandaT, 250);
      });
      ["pointerup", "touchend", "mouseup", "keyup"].forEach((ev) =>
        volT.addEventListener(ev, () => {
          if (!tutte._trascino) return;
          mandaT();
          setTimeout(() => { tutte._trascino = false; }, 900);
        }));
      volT.addEventListener("blur", () => { tutte._trascino = false; });
    }
    if (tutte.parentNode !== box) box.insertBefore(tutte, box.firstChild);
    const insieme = this._volumiDelGruppo(st);
    tutte.hidden = !insieme;
    if (insieme && !tutte._trascino) {
      const volT = tutte.querySelector(".vol");
      volT.value = String(insieme.media);
      volT.style.setProperty("--riempito", insieme.media + "%");
    }

    // in fondo, "svuota la coda": e' un comando di serie di Home Assistant
    // (clear_playlist), quindi vale per Music Assistant come per yTube
    let via = box.querySelector(".svuota-coda");
    const puoSvuotare = (Number(st.attributes.supported_features || 0) & 8192) > 0;
    if (puoSvuotare && !via) {
      via = document.createElement("button");
      via.className = "svuota-coda";
      via.type = "button";
      via.innerHTML = segno("svuota") + TH("<span>Svuota la coda</span>");
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

};
