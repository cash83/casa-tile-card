// -*- coding: utf-8 -*-
// Aiuti di servizio: tempi, misure, parole, memorie condivise.

import { segno } from './segni.js';

// come si chiama un tastino delle funzioni: "cerca", "sfoglia", "coda",
// "pieno". Serve per dargli un posto suo nella disposizione.
export const nomeAttrezzo = (b) => {
  const trovato = [...b.classList].find((k) => k.indexOf("t-") === 0);
  return trovato ? trovato.slice(2) : "";
};

export const PAROLE = {
  docked: "Alla base", cleaning: "Pulisce", returning: "Rientra",
  paused: "In pausa", idle: "Fermo", error: "Errore", unavailable: "Assente",
  unknown: "?", home: "In casa", not_home: "Fuori casa", playing: "In riproduzione",
  standby: "In attesa", heat: "Riscalda", cool: "Raffredda", auto: "Auto",
  streaming: "In diretta", recording: "Registra",
  charging: "In carica", discharging: "In scarica", not_charging: "Ferma", full: "Carica",
  open: "Aperta", closed: "Chiusa", locked: "Chiusa", unlocked: "Aperta",
  on: "Acceso", off: "Spento", none: "-", wired: "Via cavo", disconnected: "Scollegato",
};

// da quanto tempo dura questo stato, detto come lo direbbe uno
export function daQuanto(quando) {
  const t = Date.parse(quando);
  if (isNaN(t)) return "";
  const sec = Math.max(0, (Date.now() - t) / 1000);
  if (sec < 60) return "da poco";
  const min = Math.round(sec / 60);
  if (min < 60) return "da " + min + " min";
  const ore = Math.floor(min / 60);
  const resto = min % 60;
  if (ore < 24) return "da " + ore + " h" + (resto ? " " + resto : "");
  const giorni = Math.round(ore / 24);
  return giorni === 1 ? "da un giorno" : "da " + giorni + " giorni";
}

// quanto e' lontano, in linea d'aria (formula dell'emisenoverso)
export function quantoLontano(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const g = Math.PI / 180;
  const dLat = (lat2 - lat1) * g;
  const dLon = (lon2 - lon1) * g;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
    + Math.cos(lat1 * g) * Math.cos(lat2 * g)
    * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// la foto dell'entita': meglio quella che passa da Home Assistant
// (`entity_picture_local`), perche' l'altra puo' essere un indirizzo che
// da fuori casa non si raggiunge o che il browser blocca se e' http
export function fotoDi(st) {
  if (!st || !st.attributes) return null;
  return st.attributes.entity_picture_local || st.attributes.entity_picture || null;
}

// quale riquadro (casse / sorgenti) era aperto, per entita'. Sta fuori
// dall'elemento apposta: serve a ritrovarlo se Home Assistant, mentre si
// modificano le impostazioni, rifa' la casella da zero.
export const PANNELLI_APERTI = new Map();

// DOVE ERAVAMO ARRIVATI NELLA COLONNA DELL'ANTEPRIMA.
// Quando si cambia un'impostazione, Home Assistant non aggiorna la casella:
// la butta e ne fa una nuova (tutte quante, anche quelle dentro al pop-up).
// La nuova nasce staccata dalla pagina, quindi da sola non puo' sapere
// niente. Il segno va tenuto qui fuori, legato alla colonna: quella non
// cambia mai, e cosi' sopravvive al ricambio.
export const SEGNI_ANTEPRIMA = new WeakMap();

// QUALE SCHEDA DEL POP-UP STA MODIFICANDO. Serve a tenere ferma LEI mentre
// cambia misura: se si sta allargando l'ultima e uno e' scorso in fondo,
// rimpicciolendola il contenuto si accorcia proprio sotto di lui e il fondo
// pagina gli viene incontro. Tenendo ferma la scheda che ha in mano, invece,
// si muove solo quello che le sta sotto.
export const SCHEDA_APERTA = { indice: null };
// L'ultima ricerca fatta, per casella: nell'anteprima delle impostazioni la
// casella viene rifatta da capo a ogni ritocco, e senza questo il riquadro
// si riapriva sì, ma vuoto - parola cancellata e risultati spariti.
export const RICERCHE = new Map();

// quanto ci mette ogni tapparella per un punto percentuale: si impara
// guardando quanto ci mette davvero, cosi' il movimento disegnato va
// alla stessa velocita' di quella vera
export const VELOCITA_TAPPARELLE = {};

// le entita' "parenti" di una casella (stesso inizio di nome) che parlano di
// carica e scarica: si cercano una volta sola per tutta la pagina
export const PARENTI = {};

// quanto occupa davvero ogni disegno: si misura una volta sola
export const MISURE_ICONA = {};   // rifatte dalla v2.3.6 (aria = spessore del tratto)

// stringe il riquadro attorno al disegno, cosi' riempie il suo spazio come
// fanno le icone di Home Assistant
export function riempiRiquadro(svg, chiave) {
  if (!svg || !chiave) return;
  const gia = MISURE_ICONA[chiave];
  if (gia !== undefined) {
    svg.setAttribute("viewBox", gia || "0 0 64 64");
    return;
  }
  if (!svg.isConnected) return;
  // misuro una copia ferma: gli aloni che si muovono falserebbero il conto
  let b = null;
  const copia = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  copia.setAttribute("viewBox", "0 0 64 64");
  copia.setAttribute("fill", "none");
  copia.setAttribute("style", "position:absolute;left:-9999px;top:0;"
    + "width:64px;height:64px;visibility:hidden");
  copia.classList.add("misuratore");
  copia.innerHTML = svg.innerHTML;
  (svg.parentNode || document.body).appendChild(copia);
  try { b = copia.getBBox(); } catch (e) { b = null; }
  copia.remove();
  if (!b || b.width < 4 || b.height < 4) return;
  const lato = Math.max(b.width, b.height);
  let box = null;
  if (lato < 62 && lato > 64 / 2.5) {
    // getBBox non conta lo spessore delle linee: senza questo, le icone
    // disegnate a tratto (il tachimetro) restano tagliate
    let tratto = 0;
    const dentro = svg.innerHTML || "";
    const spessori = dentro.match(/stroke-width="([0-9.]+)"/g) || [];
    spessori.forEach((x) => {
      const n2 = parseFloat(x.replace(/[^0-9.]/g, ""));
      if (!isNaN(n2) && n2 > tratto) tratto = n2;
    });
    // un filo d'aria in piu' anche per i disegni che dondolano (il campanello)
    const aria = Math.max(lato * 0.045, tratto / 2 + 0.8);
    const cx = b.x + b.width / 2;
    const cy = b.y + b.height / 2;
    const mezzo = lato / 2 + aria;
    box = [(cx - mezzo).toFixed(1), (cy - mezzo).toFixed(1),
           (mezzo * 2).toFixed(1), (mezzo * 2).toFixed(1)].join(" ");
  }
  MISURE_ICONA[chiave] = box;
  svg.setAttribute("viewBox", box || "0 0 64 64");
}

export const SPENTI = ["off", "unavailable", "unknown", "not_home", "idle", "docked",
                "standby", "paused", "closed", "disarmed", "none"];

// una riga ondulata larga 300 unita': 4 gobbe complete
export const ONDA_D = "M0 13" + " q18.75 -14 37.5 0 q18.75 14 37.5 0".repeat(4);

// --- YAML: giusto quel tanto che serve alle schede di Lovelace -------
