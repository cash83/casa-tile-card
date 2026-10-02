// -*- coding: utf-8 -*-
// SECONDA PASSATA: i DOPPIONI.
//
// Legge tutti i moduli con un parser vero (acorn, quello che usa gia' rollup)
// e cerca tre cose:
//   1. due funzioni (o due metodi) col CORPO identico, anche in file diversi
//   2. due regole CSS con lo stesso selettore dentro allo stesso foglio
//   3. lo stesso disegno SVG (la `d="..."`) scritto piu' volte
//
//   node strumenti/controlla_doppioni.js
import fs from "fs";
import path from "path";
import { parse } from "acorn";

const SRC = path.join(path.dirname(new URL(import.meta.url).pathname.slice(1)), "..", "src");
const file = fs.readdirSync(SRC).filter((f) => f.endsWith(".js"));

// Il corpo di una funzione, ridotto all'osso: via gli a capo, via i commenti
// (li toglie gia' il parser), via gli spazi doppi. Due corpi uguali cosi'
// sono due corpi uguali davvero.
const nudo = (s) => s.replace(/\s+/g, " ").trim();

const corpi = new Map();
const disegni = new Map();
let righeTotali = 0;

for (const f of file) {
  const testo = fs.readFileSync(path.join(SRC, f), "utf8");
  righeTotali += testo.split("\n").length;
  let albero;
  try {
    albero = parse(testo, { ecmaVersion: 2023, sourceType: "module", locations: true });
  } catch (e) {
    console.log("NON SI LEGGE " + f + ": " + e.message);
    continue;
  }

  // i disegni SVG ripetuti: la `d` di un path
  for (const m of testo.matchAll(/ d="(M[^"]{40,})"/g)) {
    const k = m[1];
    if (!disegni.has(k)) disegni.set(k, []);
    disegni.get(k).push(f);
  }

  // ogni funzione, metodo, freccia
  const gira = (n, dentro) => {
    if (!n || typeof n !== "object") return;
    if (Array.isArray(n)) { n.forEach((x) => gira(x, dentro)); return; }
    const tipi = ["FunctionDeclaration", "FunctionExpression", "ArrowFunctionExpression"];
    if (tipi.includes(n.type) && n.body && n.body.type === "BlockStatement") {
      const righe = n.body.loc.end.line - n.body.loc.start.line;
      if (righe >= 4) {
        const corpo = nudo(testo.slice(n.body.start, n.body.end));
        if (corpo.length > 160) {
          if (!corpi.has(corpo)) corpi.set(corpo, []);
          corpi.get(corpo).push({ f, riga: n.body.loc.start.line, righe, nome: dentro || "" });
        }
      }
    }
    const nome = n.type === "MethodDefinition" || n.type === "Property"
      ? (n.key && (n.key.name || n.key.value)) : dentro;
    for (const k of Object.keys(n)) {
      if (k === "loc" || k === "start" || k === "end" || k === "type") continue;
      gira(n[k], nome);
    }
  };
  gira(albero, "");
}

console.log("moduli: " + file.length + ", righe: " + righeTotali);

console.log("\n--- funzioni col corpo IDENTICO");
let n1 = 0;
for (const [corpo, dove] of corpi) {
  if (dove.length < 2) continue;
  n1++;
  console.log("  " + dove[0].righe + " righe, " + dove.length + " copie  ["
    + dove.map((d) => d.nome + " in " + d.f + ":" + d.riga).join("  |  ") + "]");
  console.log("     " + corpo.slice(0, 110) + "...");
}
if (!n1) console.log("  nessuna");

console.log("\n--- disegni SVG ripetuti");
let n2 = 0;
for (const [d, dove] of disegni) {
  if (dove.length < 2) continue;
  n2++;
  console.log("  " + dove.length + " volte (" + [...new Set(dove)].join(", ") + "): "
    + d.slice(0, 60) + "...");
}
if (!n2) console.log("  nessuno");

// --- i selettori CSS doppi, foglio per foglio
//
// Due accortezze, se no sono tutti falsi allarmi:
//  - quello che sta dentro a un `@media` NON e' un doppione: e' l'apposta
//    per lo schermo stretto. Quindi si conta a che profondita' si sta.
//  - `.then((rows) =>` non e' un selettore CSS: si tengono solo i nomi
//    che potrebbero esserlo davvero.
const PARE_CSS = /^[.#:][A-Za-z][\w-]*([.#:[\]="'\w()>+~, -]*)$/;

console.log("\n--- selettori CSS scritti due volte nello STESSO punto");
let n3 = 0;
for (const f of file) {
  const testo = fs.readFileSync(path.join(SRC, f), "utf8");
  const visti = new Map();
  let dentroMedia = 0;
  const righe = testo.split("\n");
  righe.forEach((r, i) => {
    if (/@media|@supports|@container/.test(r)) dentroMedia++;
    else if (dentroMedia && /^\s*\}\s*$/.test(r)) dentroMedia = Math.max(0, dentroMedia - 1);
    if (dentroMedia) return;
    const m = r.match(/^\s*([.#:][^{}@\n;]{2,90})\{/);
    if (!m) return;
    const sel = m[1].replace(/\s+/g, " ").trim();
    if (!PARE_CSS.test(sel)) return;
    if (!visti.has(sel)) visti.set(sel, []);
    visti.get(sel).push(i + 1);
  });
  const doppi = [...visti].filter(([, q]) => q.length > 1);
  if (doppi.length) {
    n3 += doppi.length;
    console.log("  " + f);
    doppi.forEach(([s, q]) => console.log("     righe " + q.join(", ") + "  " + s));
  }
}
if (!n3) console.log("  nessuno");
