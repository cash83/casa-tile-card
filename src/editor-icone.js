// -*- coding: utf-8 -*-
// Il selettore delle icone, i nomi suggeriti e le immagini.

import { riempiRiquadro } from './aiuti.js';
import { COLORI, coloreLampada, daRgb } from './colori.js';
import { ICONE, MDI_PAROLE, NOMI_ICONE, NOMI_MDI, SINONIMI, disegnoMdi, iconaAutomatica, indirizzoFoto } from './icone.js';
import { T, TH } from './lingua.js';
import { ETICHETTE, SEZIONI } from './schema.js';
import { segno } from './segni.js';

export const ConIcone = (Base) => class extends Base {
  // icona e colore si scelgono guardandoli
  _costruisciScelte() {
    const box = this._scelte;
    const tin = this._tinte;
    if (!box) return;
    if (!box._fatto) {
      box._fatto = true;
      box.innerHTML = TH("<h4>Icona</h4>"
        + "<p class='aiuto notaMeteo' hidden>Per il meteo non serve sceglierla: "
        + "l'icona la decide il tempo che fa (sole, nuvole, pioggia, neve, "
        + "temporale, nebbia, vento) e cambia da sola.</p>"
        + "<input class='cercaIcona' type='search' placeholder='Cerca l&apos;icona: luce, presa, porta, auto...'>"
        + "<div class='iconePicker'></div>");
      // il placeholder e' un attributo: TH() traduce quello che sta FRA i
      // tag, quindi questo lo scrivo da qui.
      box.querySelector(".cercaIcona").placeholder =
        T("Cerca l'icona: luce, presa, porta, auto...");

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
          b.innerHTML = TH('<span class="segnoAuto">\u2726</span>'
            + '<span class="nome">Automatica</span>');
          b.title = T("La sceglie la card guardando l'entita");
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
        // il nome scritto sotto e' tradotto, la chiave che finisce
        // nella plancia (`dataset.nome`) resta quella italiana
        b.querySelector(".nome").textContent = T(nome);
        b.addEventListener("click", () => {
          this._config = { ...this._config, icona: nome };
          this._emetti();
          this._costruisciScelte();
        });
        griglia.appendChild(b);
      });

      tin.innerHTML = TH("<h4>Colore quando e accesa</h4>"
        + "<p class='aiuto'>Tocca la ruota per scegliere il colore che vuoi: "
        + "e' quello dell'alone, del bordo e di tutti gli effetti.</p>"
        + "<div class='coloriPicker'></div>");
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
      lampada.title = T("Come la lampada (colore vero della luce)");
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
      termo.title = T("Segue la temperatura (freddo azzurro, caldo rosso)");
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
      libero.title = T("Un colore qualsiasi");
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
        T("Usa un'immagine mia (telefono o PC)"), "");
      box._suaAccesa = this._rigaImmagine(box, "icona_immagine_accesa",
        T("Immagine di quando e' acceso (anche una gif)"),
        T("si vede solo mentre lavora: alla base torna quella di sopra"));

      const cerca = box.querySelector(".cercaIcona");
      cerca.addEventListener("input", () => {
        const q = cerca.value.trim().toLowerCase();
        box.querySelectorAll(".sceltaIcona").forEach((b) => {
          const nome = b.dataset.nome || "";
          const parole = (SINONIMI[nome] || MDI_PAROLE[nome] || "")
            + " " + nome + " " + T(nome);
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
    titolo.textContent = T("Come si chiamano le misure");
    box.appendChild(titolo);
    const nota = document.createElement("p");
    nota.className = "aiuto";
    nota.textContent = T("Il nome compare accanto al numero. Lascia vuoto per "
      + "non scrivere niente.");
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
      via.title = T("Torna al colore della casella");
      via.hidden = !Array.isArray(suoColore);
      const scelta = this._sceltaColore(suoColore, (rgb) => {
        const tinte = { ...(this._config.info_colori || {}) };
        tinte[eid] = rgb;
        this._config = { ...this._config, info_colori: tinte };
        via.hidden = false;
        this._emetti();
      });
      scelta.bolla.title = T("Colore di questa misura");
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
    box.innerHTML = TH("<h4>Sensori collegati a questa entita</h4>");
    if (!this._config.entity) {
      const vuoto = document.createElement("div");
      vuoto.className = "vuoto";
      vuoto.textContent = T("Scegli prima un'entita nella scheda Base.");
      box.appendChild(vuoto);
      return;
    }
    if (!trovati.length) {
      const vuoto = document.createElement("div");
      vuoto.className = "vuoto";
      vuoto.textContent = T("Non ho trovato sensori collegati. Puoi comunque "
        + "aggiungerne a mano qui sopra.");
      box.appendChild(vuoto);
      return;
    }
    const nota = document.createElement("p");
    nota.className = "aiuto";
    nota.textContent = T("Spunta quelli che vuoi vedere in basso nella casella.");
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
      vuoto.textContent = T("Nessuna impostazione con \u00ab") + q + "\u00bb";
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

  _costruisciFoto() {
    const box = this._foto;
    const firma = String(this._config.sfondo_immagine || "");
    if (box._firma === firma) return;
    box._firma = firma;
    box.innerHTML = TH("<h4>Foto di sfondo</h4>");
    const riga = document.createElement("div");
    riga.className = "foto-riga";

    if (this._config.sfondo_immagine) {
      const img = document.createElement("img");
      img.className = "foto-anteprima";
      img.src = this._config.sfondo_immagine;
      img.alt = "";
      img.title = T("Tocca per scegliere un'altra foto");
      img.style.cursor = "pointer";
      img.addEventListener("click", () => this.querySelector("input[type=file]").click());
      riga.appendChild(img);
    }

    const scegli = document.createElement("button");
    scegli.className = "bt";
    scegli.type = "button";
    scegli.textContent = this._config.sfondo_immagine
      ? T("Scegli un'altra foto")
      : T("Scegli una foto dal telefono o dal PC");

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
      via.textContent = T("Togli la foto");
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
      : T("Premi il pulsante: si apre la galleria del telefono o le cartelle "
        + "del PC. In alternativa scrivi l'indirizzo nel campo qui sopra "
        + "(es. /local/foto.jpg).");
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
    indirizzo.placeholder = T("oppure l'indirizzo: /local/mia.gif");
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
    via.textContent = T("Togli l'immagine");
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
      nota.textContent = T("Sto caricando ") + file.name + "...";
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
        nota.textContent = T("Non sono riuscito a caricarla (") + err.message
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
        T("Non sono riuscito a caricarla (") + err.message + "). "
        + "Mettila in config/www/ e scrivi /local/nomefoto.jpg nel campo qui sopra.";
    }
  }

};
