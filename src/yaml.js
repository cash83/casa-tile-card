// -*- coding: utf-8 -*-
// Leggere e scrivere lo YAML della singola casella.

export function yamlScalare(v) {
  if (v === null || v === undefined) return "";
  if (typeof v === "boolean" || typeof v === "number") return String(v);
  const t = String(v);
  if (t === "") return '""';
  if (t.indexOf("\n") >= 0) return JSON.stringify(t);
  const delicato = /^[\s]|[\s]$|^[-?:,[\]{}#&*!|>'"%@`]|:\s|\s#/.test(t)
    || /^(true|false|null|yes|no|on|off|~)$/i.test(t)
    || /^-?\d+(\.\d+)?$/.test(t);
  return delicato ? JSON.stringify(t) : t;
}

export function aYaml(valore, livello) {
  const liv = livello || 0;
  const pad = "  ".repeat(liv);
  if (Array.isArray(valore)) {
    if (!valore.length) return pad + "[]";
    return valore.map((v) => {
      if (v !== null && typeof v === "object") {
        const righe = aYaml(v, liv + 1).split("\n");
        const prima = pad + "- " + righe[0].trim();
        return righe.length > 1 ? prima + "\n" + righe.slice(1).join("\n") : prima;
      }
      return pad + "- " + yamlScalare(v);
    }).join("\n");
  }
  if (valore !== null && typeof valore === "object") {
    const chiavi = Object.keys(valore);
    if (!chiavi.length) return pad + "{}";
    return chiavi.map((k) => {
      const v = valore[k];
      if (v !== null && typeof v === "object" && (Array.isArray(v) ? v.length : Object.keys(v).length)) {
        return pad + k + ":\n" + aYaml(v, liv + 1);
      }
      if (v !== null && typeof v === "object") {
        return pad + k + ": " + (Array.isArray(v) ? "[]" : "{}");
      }
      return pad + k + ": " + yamlScalare(v);
    }).join("\n");
  }
  return pad + yamlScalare(valore);
}

export function yamlPezzo(t) {
  const testo = String(t).trim();
  if (testo === "" || testo === "~" || testo === "null") return null;
  if (/^(true|yes|on)$/i.test(testo)) return true;
  if (/^(false|no|off)$/i.test(testo)) return false;
  if (/^-?\d+$/.test(testo)) return parseInt(testo, 10);
  if (/^-?\d*\.\d+$/.test(testo)) return parseFloat(testo);
  const q = testo[0];
  if ((q === '"' || q === "'") && testo[testo.length - 1] === q && testo.length > 1) {
    const dentro = testo.slice(1, -1);
    return q === '"' ? dentro.replace(/\\"/g, '"').replace(/\\n/g, "\n")
                     : dentro.replace(/''/g, "'");
  }
  if (q === "[" && testo[testo.length - 1] === "]") {
    const corpo = testo.slice(1, -1).trim();
    if (!corpo) return [];
    return yamlDividi(corpo).map((x) => yamlPezzo(x));
  }
  if (q === "{" && testo[testo.length - 1] === "}") {
    const corpo = testo.slice(1, -1).trim();
    const fuori = {};
    if (!corpo) return fuori;
    yamlDividi(corpo).forEach((pezzo) => {
      const i = yamlDuePunti(pezzo);
      if (i < 0) return;
      fuori[yamlPezzo(pezzo.slice(0, i))] = yamlPezzo(pezzo.slice(i + 1));
    });
    return fuori;
  }
  return testo;
}

// divide "a, b, [c, d]" senza rompere parentesi e virgolette
export function yamlDividi(testo) {
  const fuori = [];
  let liv = 0, virg = null, pezzo = "";
  for (let i = 0; i < testo.length; i += 1) {
    const c = testo[i];
    if (virg) {
      pezzo += c;
      if (c === virg) virg = null;
      continue;
    }
    if (c === '"' || c === "'") { virg = c; pezzo += c; continue; }
    if (c === "[" || c === "{") liv += 1;
    if (c === "]" || c === "}") liv -= 1;
    if (c === "," && liv === 0) { fuori.push(pezzo); pezzo = ""; continue; }
    pezzo += c;
  }
  if (pezzo.trim() !== "") fuori.push(pezzo);
  return fuori.map((x) => x.trim());
}

// posizione dei due punti che separano chiave e valore
export function yamlDuePunti(riga) {
  let virg = null;
  for (let i = 0; i < riga.length; i += 1) {
    const c = riga[i];
    if (virg) { if (c === virg) virg = null; continue; }
    if (c === '"' || c === "'") { virg = c; continue; }
    if (c === ":" && (i + 1 >= riga.length || /\s/.test(riga[i + 1]))) return i;
  }
  return -1;
}

export function yamlRighe(testo) {
  const fuori = [];
  String(testo).replace(/\r/g, "").split("\n").forEach((riga) => {
    if (/^\s*#/.test(riga) || /^\s*$/.test(riga)) return;
    let pulita = riga;
    // toglie il commento a fine riga, ma non un # dentro le virgolette
    let virg = null;
    for (let i = 0; i < pulita.length; i += 1) {
      const c = pulita[i];
      if (virg) { if (c === virg) virg = null; continue; }
      if (c === '"' || c === "'") { virg = c; continue; }
      if (c === "#" && i > 0 && /\s/.test(pulita[i - 1])) { pulita = pulita.slice(0, i); break; }
    }
    if (!pulita.trim()) return;
    fuori.push({ testo: pulita.trim(), rientro: pulita.match(/^\s*/)[0].length, grezza: pulita });
  });
  return fuori;
}

export let yamlProblemi = [];

export function yamlBlocco(righe, stato, rientro) {
  const prima = righe[stato.i];
  if (!prima) return null;
  if (prima.testo.indexOf("- ") === 0 || prima.testo === "-") {
    const elenco = [];
    while (stato.i < righe.length && righe[stato.i].rientro >= rientro
           && (righe[stato.i].testo.indexOf("- ") === 0 || righe[stato.i].testo === "-")) {
      if (righe[stato.i].rientro > rientro) break;
      const r = righe[stato.i];
      const resto = r.testo === "-" ? "" : r.testo.slice(2).trim();
      if (!resto) {
        stato.i += 1;
        elenco.push(stato.i < righe.length && righe[stato.i].rientro > r.rientro
          ? yamlBlocco(righe, stato, righe[stato.i].rientro) : null);
        continue;
      }
      const dp = yamlDuePunti(resto);
      if (dp < 0) { elenco.push(yamlPezzo(resto)); stato.i += 1; continue; }
      // "- chiave: valore": la voce e' una mappa, rientrata di 2
      const finto = righe.slice();
      finto[stato.i] = { testo: resto, rientro: r.rientro + 2, grezza: resto };
      const dentro = { i: stato.i };
      elenco.push(yamlBlocco(finto, dentro, r.rientro + 2));
      stato.i = dentro.i;
    }
    return elenco;
  }
  const mappa = {};
  while (stato.i < righe.length && righe[stato.i].rientro >= rientro) {
    if (righe[stato.i].rientro > rientro) {
      yamlProblemi.push(righe[stato.i].testo);
      stato.i += 1;
      continue;
    }
    const r = righe[stato.i];
    const dp = yamlDuePunti(r.testo);
    if (dp < 0) { yamlProblemi.push(r.testo); stato.i += 1; continue; }
    const chiave = yamlPezzo(r.testo.slice(0, dp));
    const resto = r.testo.slice(dp + 1).trim();
    stato.i += 1;
    if (resto === "|" || resto === ">" || resto === "|-" || resto === ">-") {
      const pezzi = [];
      while (stato.i < righe.length && righe[stato.i].rientro > r.rientro) {
        pezzi.push(righe[stato.i].grezza.slice(r.rientro + 2));
        stato.i += 1;
      }
      mappa[chiave] = pezzi.join(resto[0] === ">" ? " " : "\n");
      continue;
    }
    if (resto !== "") { mappa[chiave] = yamlPezzo(resto); continue; }
    if (stato.i < righe.length && righe[stato.i].rientro > r.rientro) {
      mappa[chiave] = yamlBlocco(righe, stato, righe[stato.i].rientro);
    } else {
      mappa[chiave] = null;
    }
  }
  return mappa;
}

export function daYaml(testo) {
  const t = String(testo).trim();
  if (!t) return null;
  if (t[0] === "{" || t[0] === "[") {
    try { return JSON.parse(t); } catch (e) { /* provo con lo yaml */ }
  }
  const righe = yamlRighe(t);
  if (!righe.length) return null;
  yamlProblemi = [];
  const fuori = yamlBlocco(righe, { i: 0 }, righe[0].rientro);
  if (yamlProblemi.length) {
    throw new Error("non ho capito la riga: " + yamlProblemi[0].slice(0, 40));
  }
  return fuori;
}

// disegni dei comandi della musica (i caratteri speciali su Android non ci sono)
