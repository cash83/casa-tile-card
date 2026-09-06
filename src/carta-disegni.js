// -*- coding: utf-8 -*-
// Che disegno fare, e quanto grande: batteria, gradi, foto, timbro.

import { T } from './lingua.js';
import { PARENTI, PAROLE, riempiRiquadro } from './aiuti.js';
import { METEO } from './colori.js';
import { ICONA_METEO, ICONE, aspiraFuori, disegnoAspira, disegnoBatteria, disegnoMdi, disegnoTapparella, disegnoTermometro, iconaAutomatica, tagliaTapparella } from './icone.js';
import { segno, valoreScritto } from './segni.js';

export const ConDisegni = (Base) => class extends Base {
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
      return T((METEO[st.state] || [null, st.state])[1]);
    }
    if (dominio === "light") {
      if (st.state !== "on") return T("Spento");
      const b = st.attributes.brightness;
      return b ? Math.round(b / 2.55) + "%" : T("Acceso");
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
    return T(PAROLE[String(st.state).toLowerCase()]) || st.state;
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

};
