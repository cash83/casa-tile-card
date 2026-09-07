// -*- coding: utf-8 -*-
// Cielo, meteo, grafico, misure, barra e tapparella in viaggio.

import { T, laLocale } from './lingua.js';
import { PANNELLI_APERTI, PAROLE, RICERCHE, VELOCITA_TAPPARELLE, fotoDi, quantoLontano } from './aiuti.js';
import { METEO, coloreTemperatura, daRgb } from './colori.js';
import { tagliaTapparella } from './icone.js';
import { metti, valoreScritto } from './segni.js';

export const ConGrafici = (Base) => class extends Base {
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
            .toLocaleString(laLocale()) + " km");
        }
        const n2 = parseFloat(suo.state);
        const u2 = suo.attributes.unit_of_measurement || "";
        if (!isNaN(n2) && u2 === "min") {
          const ore = Math.floor(n2 / 60);
          const min = Math.round(n2 % 60);
          pezzi.push(ore ? ore + " h" + (min ? " " + (min < 10 ? "0" : "") + min : "")
            : min + " min");
        } else if (!isNaN(n2)) {
          pezzi.push((Math.round(n2 * 10) / 10).toLocaleString(laLocale())
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
      ? (Math.round(km * 10) / 10).toLocaleString(laLocale())
      : Math.round(km).toLocaleString(laLocale());
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
      parola.textContent = T(voce[1]);
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
      ? new Date(punto.t).toLocaleString(laLocale(),
          { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })
      : "";
    this._cartellino.hidden = false;
    this._cartellino.style.left = Math.min(85, Math.max(15, xy[0])) + "%";
    this._cartellino.innerHTML = "<b>" + (Math.round(punto.v * 10) / 10)
      .toLocaleString(laLocale()) + (u ? " " + u : "") + "</b>"
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
        : (T(PAROLE[String(st.state).toLowerCase()]) || st.state);
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
        + T(mappa ? " - tocca per aprire Google Maps" : " - tocca per i dettagli");
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
      const chi = this._cassaDelVolume();
      this._hass.callService("media_player", "volume_set",
        { entity_id: chi, volume_level: valore / 100 });
      this._zeroVuolDireMuto(chi, valore / 100);
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

    // il tasto del muto sta accanto al volume, solo per la musica.
    // Volume e muto sono della cassa della casella, anche quando quello
    // che si vede e' il capogruppo (vedi _cassaDelVolume).
    const stVol = dominio === "media_player"
      ? (this._hass.states[this._cassaDelVolume()] || st) : st;
    const puoMuto = dominio === "media_player"
      && (!stVol.attributes.supported_features
          || (Number(stVol.attributes.supported_features) & 8));
    this._muto.hidden = !puoMuto;
    if (puoMuto) {
      const zitto = !!stVol.attributes.is_volume_muted;
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
      // Il volume della cassa che sto mostrando, il suo e basta. Farlo
      // diventare la media del gruppo voleva dire che la casella della
      // Veranda, ferma a zero, faceva vedere 25 - un numero che non era
      // di nessuno. Il volume di tutte insieme sta in cima al riquadro
      // delle Casse, dove si vedono anche le singole.
      valore = Math.round((stVol.attributes.volume_level || 0) * 100);
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

};
