// -*- coding: utf-8 -*-
// I simboli dei tasti, e come si mettono dentro a un bottone.

import { laLocale } from './lingua.js';
import { daRgb } from './colori.js';

export const SEGNI = {
  prec: "M6,18V6H8V18H6M9.5,12L18,6V18L9.5,12Z",
  succ: "M16,18H18V6H16M6,18L14.5,12L6,6V18Z",
  play: "M8,5.14V19.14L19,12.14L8,5.14Z",
  pausa: "M14,19H18V5H14M6,19H10V5H6V19Z",
  stop: "M18,18H6V6H18V18Z",
  svuota: "M2,6V8H14V6H2M2,10V12H11V10H2M14,10.88L12.88,12L15.88,15L12.88,18L14,19.12L17,"
    + "16.12L20,19.12L21.12,18L18.12,15L21.12,12L20,10.88L17,13.88L14,10.88M2,14V16H11V14H2Z",
  // porta qui la coda: le stesse righe di "svuota", con la freccia invece
  // della ics - si leggono in coppia
  trasferisci: "M19,9H2V11H19V9M19,5H2V7H19V5M2,15H15V13H2V15M17,13V19L22,16L17,13Z",
  tavolozza: "M17.5,12A1.5,1.5 0 0,1 16,10.5A1.5,1.5 0 0,1 17.5,9A1.5,1.5 0 0,1 19,10.5A1.5,"
    + "1.5 0 0,1 17.5,12M14.5,8A1.5,1.5 0 0,1 13,6.5A1.5,1.5 0 0,1 14.5,5A1.5,1.5 0 0,1 16,"
    + "6.5A1.5,1.5 0 0,1 14.5,8M9.5,8A1.5,1.5 0 0,1 8,6.5A1.5,1.5 0 0,1 9.5,5A1.5,1.5 0 0,1 "
    + "11,6.5A1.5,1.5 0 0,1 9.5,8M6.5,12A1.5,1.5 0 0,1 5,10.5A1.5,1.5 0 0,1 6.5,9A1.5,1.5 0 "
    + "0,1 8,10.5A1.5,1.5 0 0,1 6.5,12M12,3A9,9 0 0,0 3,12A9,9 0 0,0 12,21A1.5,1.5 0 0,0 "
    + "13.5,19.5C13.5,19.11 13.35,18.76 13.11,18.5C12.88,18.23 12.73,17.88 12.73,17.5A1.5,"
    + "1.5 0 0,1 14.23,16H16A5,5 0 0,0 21,11C21,6.58 16.97,3 12,3Z",
  bianco: "M12,8A4,4 0 0,0 8,12A4,4 0 0,0 12,16A4,4 0 0,0 16,12A4,4 0 0,0 12,8M12,18A6,6 0 "
    + "0,1 6,12A6,6 0 0,1 12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18M20,8.69V4H15.31L12,0.69L8.69,"
    + "4H4V8.69L0.69,12L4,15.31V20H8.69L12,23.31L15.31,20H20V15.31L23.31,12L20,8.69Z",
  volume: "M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,"
    + "19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,"
    + "15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z",
  muto: "M12,4L9.91,6.09L12,8.18M4.27,3L3,4.27L7.73,9H3V15H7L12,20V13.27L16.25,17.53C15.58,"
    + "18.04 14.83,18.46 14,18.7V20.77C15.38,20.45 16.63,19.82 17.68,18.96L19.73,21L21,19.73L12,"
    + "10.73M19,12C19,12.94 18.8,13.82 18.46,14.64L19.97,16.15C20.62,14.91 21,13.5 21,12C21,7.72 "
    + "18,4.14 14,3.23V5.29C16.89,6.15 19,8.83 19,12M16.5,12C16.5,10.23 15.5,8.71 14,7.97V10.18L16.45,"
    + "12.63C16.5,12.43 16.5,12.21 16.5,12Z",
  // tapparelle: freccia CONTRO una barra, cosi' si vede dove va a finire.
  // Le due frecce da sole sembravano il volume di un telecomando
  su: "M4,4H20V6H4V4M12,7L17,12H14V20H10V12H7L12,7Z",
  giu: "M4,20H20V18H4V20M12,17L17,12H14V4H10V12H7L12,17Z",
  serra: "M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17"
    + "M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6"
    + "A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z",
  apri: "M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H15V6"
    + "A3,3 0 0,0 12,3A3,3 0 0,0 9,6H7A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,17"
    + "A2,2 0 0,0 14,15A2,2 0 0,0 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17Z",
  // "torna alla base": la casetta si legge al volo anche a 19px, l'arco
  // della stazione di ricarica a quella misura sembrava un ferro di cavallo
  base: "M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z",
  spegni: "M16.56,5.44L15.11,6.89C16.84,7.94 18,9.83 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12C6,"
    + "9.83 7.16,7.94 8.88,6.88L7.44,5.44C5.36,6.88 4,9.28 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,"
    + "12C20,9.28 18.64,6.88 16.56,5.44M13,3H11V13H13V3Z",
};

// YouTube Music chiama gli artisti "Tizio - Topic": la coda non serve a nessuno
export const nomeArtista = (chi) => String(chi || "").replace(/\s*-\s*Topic\s*$/i, "").trim();

// tinta/pienezza/luce <-> rosso/verde/blu: servono alla ruota dei colori
export function rgbAHsl(r, g, b) {
  const r2 = r / 255; const g2 = g / 255; const b2 = b / 255;
  const alto = Math.max(r2, g2, b2); const basso = Math.min(r2, g2, b2);
  const d = alto - basso;
  let h = 0;
  if (d) {
    if (alto === r2) h = ((g2 - b2) / d) % 6;
    else if (alto === g2) h = (b2 - r2) / d + 2;
    else h = (r2 - g2) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  const l = (alto + basso) / 2;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  return [Math.round(h), Math.round(s * 100), Math.round(l * 100)];
}

export function hslARgb(h, s, l) {
  const h0 = isFinite(h) ? h : 0;
  const s2 = Math.max(0, Math.min(100, isFinite(s) ? s : 0)) / 100;
  const l2 = Math.max(0, Math.min(100, isFinite(l) ? l : 50)) / 100;
  const c = (1 - Math.abs(2 * l2 - 1)) * s2;
  const x = c * (1 - Math.abs(((h0 / 60) % 2) - 1));
  const m = l2 - c / 2;
  let p = [0, 0, 0];
  const g = Math.floor(((h0 % 360) + 360) % 360 / 60);
  if (g === 0) p = [c, x, 0];
  else if (g === 1) p = [x, c, 0];
  else if (g === 2) p = [0, c, x];
  else if (g === 3) p = [0, x, c];
  else if (g === 4) p = [x, 0, c];
  else p = [c, 0, x];
  return p.map((v) => Math.round((v + m) * 255));
}

export const hslATesto = (h, s, l) => daRgb(hslARgb(h, s, l));

// Parecchi simboli non stanno in mezzo al loro quadrato: il triangolo del
// play, per dire, sta un'unita' e mezza a destra. Dentro un tasto tondo si
// vede eccome, sembrano storti. Invece di una tabella scritta a mano che
// prima o poi non torna piu', la prima volta li misuro e me lo segno.
export const SCARTI = {};
export let LAVAGNA = null;
export const NS_SVG = "http://www.w3.org/2000/svg";
export function scartoDi(nome) {
  if (nome in SCARTI) return SCARTI[nome];
  let d = [0, 0];
  try {
    if (!LAVAGNA) {
      LAVAGNA = document.createElementNS(NS_SVG, "svg");
      LAVAGNA.setAttribute("viewBox", "0 0 24 24");
      LAVAGNA.style.cssText = "position:absolute;left:-999px;top:0;width:24px;"
        + "height:24px;opacity:0;pointer-events:none";
      (document.body || document.documentElement).appendChild(LAVAGNA);
    }
    const p = document.createElementNS(NS_SVG, "path");
    p.setAttribute("d", SEGNI[nome]);
    LAVAGNA.appendChild(p);
    const b = p.getBBox();
    p.remove();
    if (b.width && b.height) {
      const arr = (v) => Math.round(v * 100) / 100;
      d = [arr(12 - (b.x + b.width / 2)), arr(12 - (b.y + b.height / 2))];
      // il triangolo fa eccezione: messo nel mezzo esatto l'occhio lo vede
      // spostato a sinistra, e allora gli si lascia mezza unita' a destra
      if (nome === "play") d[0] = arr(d[0] + 0.5);
    }
  } catch (_) { d = [0, 0]; }
  SCARTI[nome] = d;
  return d;
}

// come si chiama un tasto: la sua classe (play, prec, su, casa...). "grosso"
// dice solo che e' piu' grande degli altri, non e' il suo nome.
export const nomeTasto = (b) => [...b.classList].filter((c) => c !== "grosso")[0] || "";

export const segno = (nome) => {
  if (!SEGNI[nome]) return "";
  const d = scartoDi(nome);
  const spost = (d[0] || d[1])
    ? ' transform="translate(' + d[0] + ' ' + d[1] + ')"' : "";
  return '<svg viewBox="0 0 24 24" aria-hidden="true"><path'
    + spost + ' d="' + SEGNI[nome] + '"></path></svg>';
};

// mette il simbolo dentro il tasto solo se e' cambiato davvero: rifare il
// disegnino a ogni giro (una volta al secondo, con la musica) e' sprecato
export const metti = (el, nome) => {
  if (!el || el.dataset.segno === nome) return false;
  el.dataset.segno = nome;
  el.innerHTML = segno(nome);
  return true;
};

// Quanto dura, scritto come lo direbbe una persona: 135 minuti sono
// "2 h 15 min", non "135". Prende il numero e l'unita di partenza.
// solo unita' che non si confondono con altro: "m" sarebbe metri, non minuti
export const SECONDI_DI = { s: 1, sec: 1, min: 60, h: 3600, d: 86400 };
// unita' che accetto quando sono appiccicate dentro allo stato ("17min").
// Scritte come si scrivono davvero: cosi' "3D" (una stampante) resta "3D"
// e non diventa "3 giorni".
export const UNITA_NOTE = ["s", "min", "h", "d", "%", "W", "kW", "Wh", "kWh",
  "V", "A", "Hz", "km", "m", "mm", "cm", "kg", "g", "L", "l", "ml", "GB", "MB",
  "°C", "°F", "°", "lx", "ppm", "hPa", "mbar", "dB", "dBm"];

export function durataBella(numero, unita) {
  const passo = SECONDI_DI[String(unita || "").toLowerCase()];
  if (!passo || !isFinite(numero)) return null;
  // zero non si traduce: "0 h" dice piu' di "0 s"
  if (numero === 0) return "0 " + unita;
  let sec = Math.round(Math.abs(numero) * passo);
  const segno = numero < 0 ? "-" : "";
  if (sec < 60) return segno + sec + " s";
  const g = Math.floor(sec / 86400); sec -= g * 86400;
  const h = Math.floor(sec / 3600); sec -= h * 3600;
  const m = Math.floor(sec / 60);
  if (g) return segno + g + " g" + (h ? " " + h + " h" : "");
  if (h) return segno + h + " h" + (m ? " " + m + " min" : "");
  return segno + m + " min";
}

// Certi sensori si scrivono il pezzo dentro allo stato ("17min", "3 h"):
// il numero da solo non dice niente, quindi lo tengo intero.
export function numeroEUnita(stato) {
  const testo = String(stato).trim();
  const pezzi = testo.match(/^(-?\d+(?:[.,]\d+)?)\s*([a-zA-Z%°]{1,6})$/);
  if (!pezzi) return null;
  if (!UNITA_NOTE.includes(pezzi[2])) return null;
  return { n: parseFloat(pezzi[1].replace(",", ".")), u: pezzi[2] };
}

// il valore da mostrare: numero + unita, e le durate scritte per bene.
// Restituisce null se lo stato non e' un numero (nemmeno con l'unita
// appiccicata dentro), cosi' chi chiama scrive il testo cosi' com'e'.
export function valoreScritto(st) {
  const grezzo = String(st.state).trim();
  let n = Number(grezzo);
  let u = st.attributes ? st.attributes.unit_of_measurement : "";
  if (grezzo === "" || isNaN(n)) {
    const dentro = numeroEUnita(grezzo);
    if (!dentro) return null;
    n = dentro.n;
    if (!u) u = dentro.u;
  }
  const dc = st.attributes ? st.attributes.device_class : "";
  if (dc === "duration" || SECONDI_DI[String(u || "").toLowerCase()]) {
    const bella = durataBella(n, u);
    if (bella) return bella;
  }
  return (Math.round(n * 10) / 10).toLocaleString(laLocale()) + (u ? " " + u : "");
}
