// -*- coding: utf-8 -*-
// I conti sui colori: gradi, lampade, sfumature, meteo.

export const COLORI = {
  ambra: "#ffc046", oro: "#ffcf5c", arancio: "#ff9a3c", rosso: "#ff5f5f",
  rosa: "#ff9ec7", viola: "#9b6bff", blu: "#5ec8ff", azzurro: "#7aa7ff",
  verde: "#3fd98a", acqua: "#4fe0c8", lime: "#cddc39", grigio: "#8ab4f8",
};

export function coloreDaGradi(k) {
  const t = Math.max(1000, Math.min(12000, Number(k) || 4000)) / 100;
  const dentro = (x) => Math.max(0, Math.min(255, Math.round(x)));
  let r; let g; let b;
  if (t <= 66) {
    r = 255;
    g = 99.47 * Math.log(t) - 161.12;
    b = t <= 19 ? 0 : 138.52 * Math.log(t - 10) - 305.04;
  } else {
    r = 329.7 * Math.pow(t - 60, -0.1332);
    g = 288.12 * Math.pow(t - 60, -0.0755);
    b = 255;
  }
  return [dentro(r), dentro(g), dentro(b)];
}

// dal freddo al caldo: azzurro, verde, ambra, arancio, rosso
export const SCALA_TERMICA = [
  [-5, [79, 139, 255]], [8, [79, 184, 255]], [15, [79, 224, 200]],
  [19, [63, 217, 138]], [23, [255, 207, 92]], [27, [255, 154, 60]],
  [32, [255, 95, 95]],
];

export function coloreTemperatura(t) {
  const n = Number(t);
  if (isNaN(n)) return null;
  let a = SCALA_TERMICA[0];
  let b = SCALA_TERMICA[SCALA_TERMICA.length - 1];
  if (n <= a[0]) return daRgb(a[1]);
  if (n >= b[0]) return daRgb(b[1]);
  for (let i = 0; i < SCALA_TERMICA.length - 1; i += 1) {
    if (n >= SCALA_TERMICA[i][0] && n <= SCALA_TERMICA[i + 1][0]) {
      a = SCALA_TERMICA[i];
      b = SCALA_TERMICA[i + 1];
      break;
    }
  }
  const q = (n - a[0]) / (b[0] - a[0]);
  return daRgb([0, 1, 2].map((k) => Math.round(a[1][k] + (b[1][k] - a[1][k]) * q)));
}

// Come fa Mushroom: il colore della lampada va corretto, se no i bianchi
// e i colori slavati non si vedono sul fondo scuro.
export function coloreLampada(rgb) {
  const r = rgb[0] / 255;
  const g = rgb[1] / 255;
  const b = rgb[2] / 255;
  const max = Math.max(r, g, b);
  const delta = max - Math.min(r, g, b);
  let h = 0;
  if (delta) {
    if (max === r) h = (g - b) / delta;
    else if (max === g) h = 2 + (b - r) / delta;
    else h = 4 + (r - g) / delta;
  }
  h = 60 * (h < 0 ? h + 6 : h);
  let sat = max ? delta / max : 0;
  let val = max * 255;
  if (sat < 0.4) {
    if (sat < 0.1) val = 225;      // quasi bianca: la faccio brillare
    else sat = 0.4;                // slavata: le do' un po' di tinta
  }
  const canale = (n) => {
    const k = (n + h / 60) % 6;
    return Math.round(val - val * sat * Math.max(Math.min(k, 4 - k, 1), 0));
  };
  return [canale(5), canale(3), canale(1)];
}

export function daRgb(rgb) {
  if (!Array.isArray(rgb) || rgb.length < 3) return null;
  return "#" + rgb.slice(0, 3)
    .map((x) => Math.max(0, Math.min(255, Math.round(x))).toString(16).padStart(2, "0"))
    .join("");
}

// lo stesso colore, ma piu' scuro (quanto: 1 = uguale, 0 = nero)
export function scurisci(colore, quanto) {
  const h = String(colore || "").replace("#", "");
  const pieno = h.length === 3 ? h.split("").map((x) => x + x).join("") : h;
  if (pieno.length !== 6) return colore;
  const n = parseInt(pieno, 16);
  const r = Math.round(((n >> 16) & 255) * quanto);
  const g = Math.round(((n >> 8) & 255) * quanto);
  const b = Math.round((n & 255) * quanto);
  return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
}

export function conAlfa(colore, a) {
  const h = String(colore || "").replace("#", "");
  const pieno = h.length === 3 ? h.split("").map((x) => x + x).join("") : h;
  if (pieno.length !== 6) return colore;
  const alfa = Math.round(Math.max(0, Math.min(1, a)) * 255).toString(16).padStart(2, "0");
  return "#" + pieno + alfa;
}

export const METEO = {
  "clear-night": ["\uD83C\uDF19", "Sereno"],
  cloudy: ["\u2601\uFE0F", "Nuvoloso"],
  fog: ["\uD83C\uDF2B\uFE0F", "Nebbia"],
  hail: ["\uD83C\uDF28\uFE0F", "Grandine"],
  lightning: ["\u26C8\uFE0F", "Temporale"],
  "lightning-rainy": ["\u26C8\uFE0F", "Temporale"],
  partlycloudy: ["\u26C5", "Parz. nuvoloso"],
  pouring: ["\uD83C\uDF27\uFE0F", "Pioggia forte"],
  rainy: ["\uD83C\uDF27\uFE0F", "Pioggia"],
  snowy: ["\u2744\uFE0F", "Neve"],
  "snowy-rainy": ["\uD83C\uDF28\uFE0F", "Nevischio"],
  sunny: ["\u2600\uFE0F", "Sereno"],
  windy: ["\uD83D\uDCA8", "Vento"],
  "windy-variant": ["\uD83D\uDCA8", "Vento"],
  exceptional: ["\u26A0\uFE0F", "Attenzione"],
};

export const CIELI = {
  sunny: [
    "radial-gradient(115% 80% at 84% -14%, rgba(255,216,140,.95), rgba(255,216,140,0) 58%),"
    + "linear-gradient(168deg, #1668b8 0%, #3f97dd 42%, #8cc6ee 74%, #f2b877 100%)", "sole"],
  "clear-night": [
    "radial-gradient(90% 70% at 74% 10%, rgba(190,206,255,.30), rgba(190,206,255,0) 62%),"
    + "linear-gradient(168deg, #060b1e 0%, #101c48 55%, #22366e 100%)", "stelle"],
  partlycloudy: [
    "radial-gradient(110% 80% at 78% -10%, rgba(255,226,170,.55), rgba(255,226,170,0) 55%),"
    + "linear-gradient(168deg, #1f5a94 0%, #5b8fc4 55%, #a8c4dc 100%)", "sole_nuvole"],
  cloudy: [
    "radial-gradient(110% 75% at 30% -12%, rgba(226,236,246,.35), rgba(226,236,246,0) 60%),"
    + "linear-gradient(168deg, #33445a 0%, #566a80 60%, #7b8b9d 100%)", "nuvole"],
  rainy: [
    "radial-gradient(100% 70% at 22% -12%, rgba(150,180,205,.45), rgba(150,180,205,0) 60%),"
    + "linear-gradient(168deg, #17222f 0%, #2b3c4e 55%, #3c5468 100%)", "pioggia"],
  pouring: [
    "radial-gradient(100% 70% at 22% -12%, rgba(140,170,200,.4), rgba(140,170,200,0) 58%),"
    + "linear-gradient(168deg, #101923 0%, #22303f 55%, #33475b 100%)", "pioggia"],
  lightning: [
    "radial-gradient(95% 65% at 68% -8%, rgba(200,180,255,.42), rgba(200,180,255,0) 60%),"
    + "linear-gradient(168deg, #12172a 0%, #2b2745 55%, #453a63 100%)", "lampo"],
  "lightning-rainy": [
    "radial-gradient(95% 65% at 68% -8%, rgba(200,180,255,.42), rgba(200,180,255,0) 60%),"
    + "linear-gradient(168deg, #12172a 0%, #2b2745 55%, #453a63 100%)", "lampo"],
  snowy: [
    "radial-gradient(110% 80% at 50% -14%, rgba(255,255,255,.5), rgba(255,255,255,0) 60%),"
    + "linear-gradient(168deg, #46596e 0%, #778fa6 55%, #b3c6d6 100%)", "neve"],
  "snowy-rainy": [
    "radial-gradient(110% 80% at 50% -14%, rgba(255,255,255,.42), rgba(255,255,255,0) 60%),"
    + "linear-gradient(168deg, #3d5062 0%, #6b8196 55%, #a3b7c8 100%)", "neve"],
  hail: [
    "radial-gradient(110% 80% at 50% -14%, rgba(255,255,255,.42), rgba(255,255,255,0) 60%),"
    + "linear-gradient(168deg, #3d5062 0%, #6b8196 55%, #a3b7c8 100%)", "neve"],
  fog: [
    "radial-gradient(120% 90% at 50% 40%, rgba(235,240,245,.35), rgba(235,240,245,0) 65%),"
    + "linear-gradient(168deg, #46505c 0%, #6d7883 55%, #98a2ab 100%)", "nebbia"],
  windy: [
    "radial-gradient(110% 80% at 76% -10%, rgba(200,235,245,.4), rgba(200,235,245,0) 58%),"
    + "linear-gradient(168deg, #24596c 0%, #4a8399 55%, #86b3c4 100%)", "sole_nuvole"],
  "windy-variant": [
    "radial-gradient(110% 80% at 76% -10%, rgba(200,235,245,.4), rgba(200,235,245,0) 58%),"
    + "linear-gradient(168deg, #24596c 0%, #4a8399 55%, #86b3c4 100%)", "sole_nuvole"],
  exceptional: [
    "radial-gradient(110% 80% at 50% -14%, rgba(255,190,150,.45), rgba(255,190,150,0) 58%),"
    + "linear-gradient(168deg, #4d2424 0%, #7c4034 55%, #a76a4f 100%)", ""],
};
