// -*- coding: utf-8 -*-
// TERZA PASSATA: il CODICE MORTO.
//
// Tre cose che restano in giro quando si cambia idea e non si pulisce:
//   1. roba ESPORTATA che nessun altro modulo importa
//   2. classi CSS scritte nei fogli di stile e mai messe su niente
//   3. metodi `_qualcosa()` di una classe che nessuno chiama
//
// Le voci del dizionario NON si controllano qui: per quelle c'e'
// `controlla_scritte.py`, che guarda il verso che conta (scritte senza
// traduzione). L'elenco contrario - "chiavi che non servono piu'" - e'
// sempre pieno di falsi allarmi, perche' mezze scritte si compongono a
// pezzi e il dizionario non puo' saperlo.
//
//   node strumenti/controlla_morto.js
import fs from "fs";
import path from "path";

const QUI = path.dirname(new URL(import.meta.url).pathname.slice(1));
const SRC = path.join(QUI, "..", "src");
const file = fs.readdirSync(SRC).filter((f) => f.endsWith(".js"));
const testo = {};
file.forEach((f) => { testo[f] = fs.readFileSync(path.join(SRC, f), "utf8"); });
const tutto = Object.values(testo).join("\n");

// ---------------------------------------------------------------- 1) esporti
console.log("--- esportati e mai importati da nessuno");
const esportati = [];
for (const f of file) {
  for (const m of testo[f].matchAll(/^export (?:async )?(?:function|const|class|let) ([A-Za-z_$][\w$]*)/gm)) {
    esportati.push({ f, nome: m[1] });
  }
  for (const m of testo[f].matchAll(/^export \{([^}]*)\}/gm)) {
    m[1].split(",").map((x) => x.trim().split(/\s+as\s+/)[0]).filter(Boolean)
      .forEach((nome) => esportati.push({ f, nome }));
  }
}
// Chi importa: anche i banchi di prova in strumenti/, se no risultano morte
// meta' delle funzioni che le prove usano eccome.
const daProve = fs.readdirSync(QUI).filter((f) => f.endsWith(".js"))
  .map((f) => fs.readFileSync(path.join(QUI, f), "utf8")).join("\n");
const importati = new Set();
for (const t of [...file.map((f) => testo[f]), daProve]) {
  for (const m of t.matchAll(/import\s+(?:(\w+)\s*,\s*)?\{([^}]*)\}\s*from/g)) {
    if (m[1]) importati.add(m[1]);
    m[2].split(",").map((x) => x.trim().split(/\s+as\s+/)[0]).filter(Boolean)
      .forEach((n) => importati.add(n));
  }
  for (const m of t.matchAll(/import\s+(\w+)\s+from/g)) importati.add(m[1]);
}
let n1 = 0;
for (const e of esportati) {
  if (importati.has(e.nome)) continue;
  // le tre schede e i loro editor li registra `main.js` con customElements
  if (new RegExp("customElements\\.define\\([^)]*" + e.nome).test(tutto)) continue;
  n1++;
  console.log("  " + e.f + ": " + e.nome);
}
if (!n1) console.log("  nessuno");

// ------------------------------------------------------------- 2) classi CSS
//
// I fogli di stile sono i template literal attaccati a un nome che contiene
// STILE o CSS. Guardare TUTTO il file non funziona: `.map(` e `.length` hanno
// la stessa forma di un selettore, e vengono fuori ottanta falsi allarmi.
console.log("\n--- classi CSS scritte nei fogli e mai messe su niente");
const fogli = {};
let fuoriDaiFogli = "";
for (const f of file) {
  let resto = testo[f];
  for (const m of testo[f].matchAll(/(?:const|let|var)\s+(\w*(?:STILE|CSS|Stile)\w*)\s*=\s*`/g)) {
    const da = m.index + m[0].length;
    let i = da, graffe = 0;
    while (i < testo[f].length) {
      const c = testo[f][i];
      if (c === "\\") { i += 2; continue; }
      if (c === "$" && testo[f][i + 1] === "{") graffe++;
      if (c === "}" && graffe) graffe--;
      else if (c === "`" && !graffe) break;
      i++;
    }
    const foglio = testo[f].slice(da, i);
    fogli[f] = (fogli[f] || "") + "\n" + foglio;
    resto = resto.replace(foglio, "");
  }
  fuoriDaiFogli += "\n" + resto;
}
const orfane = [];
for (const f of Object.keys(fogli)) {
  const classi = new Set();
  for (const m of fogli[f].matchAll(/\.(-?[a-zA-Z_][\w-]+)(?=[\s,:.{>+~)[\]])/g)) classi.add(m[1]);
  for (const c of [...classi].sort()) {
    const dove = new RegExp("[\"'`\\s.>]" + c.replace(/[-]/g, "\\-") + "\\b");
    if (!dove.test(fuoriDaiFogli)) orfane.push(f + ": ." + c);
  }
}
console.log(orfane.length ? orfane.map((x) => "  " + x).join("\n") : "  nessuna");

// ---------------------------------------------------------------- 3) metodi
console.log("\n--- metodi _qualcosa() che nessuno chiama");
const metodi = [];
for (const f of file) {
  for (const m of testo[f].matchAll(/^ {2}(?:async )?(_[A-Za-z]\w*)\s*\(/gm)) {
    metodi.push({ f, nome: m[1] });
  }
}
let n3 = 0;
for (const { f, nome } of metodi) {
  const quante = (tutto.match(new RegExp("[.\\[\"']" + nome + "\\b", "g")) || []).length;
  if (quante === 0) { n3++; console.log("  " + f + ": " + nome + "()"); }
}
if (!n3) console.log("  nessuno");
