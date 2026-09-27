// Il pezzo comune degli editor di casa-energia e casa-elettrodomestico:
// l'elenco delle righe di un riquadro, da accendere/spegnere con la spunta,
// mettere in ordine TRASCINANDO la maniglia (mouse o dito) e rinominare.
// In configurazione: `righe` (gli id accesi, in ordine) e `nomi_righe`
// ({id: "nome"}; vuoto = nome di serie).

import { T, TH } from './lingua.js';
import { ICONE, MDI_PAROLE, NOMI_ICONE, NOMI_MDI, SINONIMI, disegnoMdi } from './icone.js';

// Sette disegni a tratto, che prendono il colore della striscia. Quelli
// della casella sono colorati e sfumati: a 18 pixel dentro a un titolo
// diventano una macchia.
const TRATTI = {
  bacchetta: '<path d="M4 20 14 10"/><path d="M16 4v4M20 8h-4"/><path d="M18 12l1.6 1.6"/><path d="M15 7l2 2"/>',
  contatore: '<circle cx="12" cy="12" r="8"/><path d="M12 7v5l3 2"/>',
  accensione: '<path d="M12 3v8"/><path d="M17.5 6.5a8 8 0 1 1-11 0"/>',
  lista: '<path d="M8 6h12M8 12h12M8 18h12"/><path d="M4 6h.01M4 12h.01M4 18h.01"/>',
  barre: '<path d="M5 19V11M10 19V6M15 19v-5M20 19v-9"/>',
  clessidra: '<path d="M7 3h10M7 21h10"/><path d="M8 3v3.2a4 4 0 0 0 1.6 3.2L12 12l-2.4 2.6A4 4 0 0 0 8 17.8V21"/><path d="M16 3v3.2a4 4 0 0 1-1.6 3.2L12 12l2.4 2.6a4 4 0 0 1 1.6 3.2V21"/>',
  tachimetro: '<path d="M4 17a8 8 0 1 1 16 0"/><path d="M12 17l4-5"/>',
  tavolozza: '<path d="M12 3a9 9 0 0 0 0 18c1.2 0 1.8-.8 1.8-1.6 0-1.6 1-2.2 2.2-2.2H18a3 3 0 0 0 3-3A9 9 0 0 0 12 3z"/><circle cx="8" cy="10" r="1.1" fill="currentColor" stroke="none"/><circle cx="12" cy="7.6" r="1.1" fill="currentColor" stroke="none"/><circle cx="15.8" cy="10" r="1.1" fill="currentColor" stroke="none"/>',
};

// il titolo di una tendina: icona, nome, riassunto e riga di spiegazione
// Conferma senza window.confirm. Quella e' una finestrella del browser, e
// non c'e' dappertutto: dentro a un riquadro incorporato viene soppressa e
// la funzione torna "annulla" da sola. Cosi' invece il tasto si trasforma
// nella domanda e aspetta il secondo clic; dopo sei secondi si rassegna.
export function confermaDoppia(tasto, domanda) {
  if (!tasto) return true;
  if (tasto._chiesto) {
    clearTimeout(tasto._attesa);
    tasto._chiesto = false;
    tasto.textContent = tasto._primaDiceva;
    tasto.classList.remove("ce-conferma");
    return true;
  }
  tasto._primaDiceva = tasto.textContent;
  tasto._chiesto = true;
  tasto.textContent = domanda;
  tasto.classList.add("ce-conferma");
  tasto._attesa = setTimeout(() => {
    tasto._chiesto = false;
    tasto.textContent = tasto._primaDiceva;
    tasto.classList.remove("ce-conferma");
  }, 6000);
  return false;
}

export function titoloSez(v, testo) {
  v = v || [];
  return icoSez(v[0]) + '<span class="ce-sez-testo">' + testo
    + '<span class="ce-riassunto"></span>'
    + (v[2] ? '<small class="ce-sotto">' + T(v[2]) + "</small>" : "")
    + "</span>";
}

export function icoSez(nome) {
  const d = TRATTI[nome];
  if (!d) return "";
  return '<span class="ce-sez-ico"><svg viewBox="0 0 24 24" fill="none"'
    + ' stroke="currentColor" stroke-width="1.9" stroke-linecap="round"'
    + ' stroke-linejoin="round">' + d + "</svg></span>";
}

// la striscia di colore a sinistra della tendina
export function vestiSez(box, veste) {
  if (!box || !veste || !veste[1]) return;
  box.dataset.c = "1";
  box.style.setProperty("--c", veste[1]);
}

export const STILE_EDITOR = `
/* display:flex batte [hidden]: senza questa riga tutto quello che l'editor
   nasconde resta li' a vedersi. */
[hidden]{display:none !important}
.ce-conferma{border-color:#f0a020;color:#f0a020;font-weight:800}
.ce-esito{position:sticky;bottom:0;z-index:2;background:var(--card-background-color,#1c1c1c);
  border:1px solid var(--divider-color);border-radius:10px;padding:8px 10px;margin-top:10px;
  white-space:pre-wrap;font-size:12.5px;box-shadow:0 -6px 12px -8px rgba(0,0,0,.6)}
.ce-esito.male{border-color:var(--error-color,#e05b5b)}

.ce-scelta{margin-top:8px;border:1px solid var(--divider-color);border-radius:10px;padding:8px}
.ce-scelta label{display:flex;gap:8px;align-items:center;padding:3px 2px;font-size:13px}
.ce-scelta .dett{color:var(--secondary-text-color);font-size:11px;margin-left:auto}
.ce-scelta .barra{display:flex;gap:8px;margin-top:8px;align-items:center}
.ce-scelta .tutti{font-size:12px;color:var(--primary-color);cursor:pointer;text-decoration:underline}

.ce-presa{cursor:grab;opacity:.55;font-size:16px;line-height:1;padding:0 2px;user-select:none}
.ce-presa:active{cursor:grabbing}
.ce-presa-su{opacity:.5;outline:1px dashed var(--primary-color);border-radius:8px}
.ce-via{background:none;border:0;color:var(--secondary-text-color);font-size:18px;cursor:pointer;line-height:1;padding:0 4px}
.ce-via:hover{color:var(--error-color,#e05b5b)}

  .ce-sez{margin-top:18px;padding:12px;border-radius:12px;border:1px solid var(--divider-color,#444)}
  .ce-tit{font-weight:600;margin-bottom:4px}
  /* ogni tendina si riconosce: la sua striscia, la sua icona, la sua riga
     di spiegazione sotto al titolo. Chiuse erano otto rettangoli uguali. */
  .ce-sez[data-c]{border-left:3px solid var(--c)}
  details.ce-sez>summary.ce-tit{display:flex;align-items:flex-start;gap:8px}
  .ce-sez-ico{flex:0 0 auto;width:18px;height:18px;margin-top:1px;color:var(--c,var(--secondary-text-color))}
  .ce-sez-ico svg{width:18px;height:18px;display:block}
  .ce-sez-testo{min-width:0;flex:1 1 auto}
  .ce-sotto{display:block;font-weight:400;font-size:12px;line-height:1.35;
    color:var(--secondary-text-color);margin-top:1px}
  details.ce-sez[open] .ce-sotto{display:none}
  .ce-aiuto{font-size:12.5px;color:var(--secondary-text-color);margin-bottom:10px}
  .ce-riga{display:flex;align-items:center;gap:8px;padding:6px 8px;border-radius:9px;margin-bottom:4px;background:var(--secondary-background-color,#222)}
  .ce-riga.spenta{opacity:.5}
  .ce-riga label{flex:1 1 45%;min-width:0;display:flex;align-items:center;gap:8px;cursor:pointer}
  .ce-riga .ent{flex:1 1 35%;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13px}
  .ce-riga input.nome{flex:1 1 40%;min-width:0;padding:5px 7px;border-radius:7px;border:1px solid var(--divider-color,#555);background:var(--card-background-color,#111);color:inherit;font:inherit;font-size:13px}
  .ce-riga input.tinta{width:34px;height:28px;padding:0;border:1px solid var(--divider-color,#555);border-radius:7px;background:none;cursor:pointer}
  .ce-riga .pulisci{border:1px solid var(--divider-color,#555);background:none;color:inherit;border-radius:7px;width:28px;height:28px;cursor:pointer;line-height:1}
  .ce-riga input.max{width:72px;padding:5px 6px;border-radius:7px;border:1px solid var(--divider-color,#555);background:var(--card-background-color,#111);color:inherit;font:inherit;font-size:13px}
  .ce-riga .maniglia{cursor:grab;touch-action:none;user-select:none;font-size:18px;line-height:1;padding:2px 4px;color:var(--secondary-text-color)}
  .ce-riga.trascino{outline:2px solid var(--primary-color);opacity:.85}
  .ce-versione{font-size:11px;opacity:.55;letter-spacing:.3px;margin:2px 0 8px}
  .ce-tutto-riga{cursor:pointer;margin:6px 0 10px;gap:10px;font-size:13px}
  details.ce-sez>summary{cursor:pointer;list-style:none}
  details.ce-sez>summary::-webkit-details-marker{display:none}
  details.ce-sez>summary:before{content:'\\25b8 ';opacity:.6;flex:0 0 auto}
  details.ce-sez[open]>summary:before{content:'\\25be ';opacity:.6}
  .ce-esito{margin-top:10px;font-size:12.5px;white-space:pre-wrap;color:var(--secondary-text-color)}
  .ce-esito.male{color:var(--error-color,#e46)}
  .ce-riga select{flex:1 1 40%;min-width:0;padding:5px 7px;border-radius:7px;border:1px solid var(--divider-color,#555);background:var(--card-background-color,#111);color:inherit;font:inherit;font-size:13px}
  .ce-tasto{display:flex;align-items:center;gap:8px;margin:6px 0}
  .ce-tasto .chi{flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13px}
  .ce-tasto button{border:1px solid var(--divider-color,#555);background:none;color:inherit;border-radius:9px;cursor:pointer;padding:3px}
  .ce-tasto .icona{width:38px;height:38px;display:grid;place-items:center}
  .ce-tasto .icona svg{width:30px;height:30px}
  .ce-tasto .via{width:30px;height:30px;opacity:.7;font-size:15px}
  .ce-catalogo{margin:4px 0 10px;padding:8px;border:1px solid var(--divider-color,#555);border-radius:10px}
  .ce-catalogo input{width:100%;box-sizing:border-box;padding:6px 8px;border-radius:8px;
    border:1px solid var(--divider-color,#555);background:var(--card-background-color,#111);color:inherit;font:inherit}
  .ce-icone{display:grid;grid-template-columns:repeat(auto-fill,minmax(46px,1fr));gap:4px;margin-top:8px;
    max-height:240px;overflow:auto}
  .ce-icone button{border:1px solid transparent;background:none;border-radius:8px;cursor:pointer;padding:3px}
  .ce-icone button:hover{border-color:var(--primary-color)}
  .ce-icone button.scelta{border-color:var(--primary-color);background:rgba(127,127,127,.15)}
  .ce-icone svg{width:34px;height:34px;display:block}
  .ce-prepara{margin-top:10px;border:1px solid var(--primary-color);background:none;color:var(--primary-color);border-radius:9px;padding:7px 12px;cursor:pointer}
`;

// ordine delle righe accese e quelle spente, dalla configurazione
export function ordineRighe(config, elenco) {
  const tutte = elenco.map((r) => r.id);
  // un elenco scritto comanda anche quando e' VUOTO: vuol dire "nessuna riga",
  // e il riquadro sparisce. Senza elenco, invece, si vedono tutte.
  const scelte = Array.isArray(config.righe)
    ? config.righe.filter((id) => tutte.includes(id)) : tutte;
  return { scelte, spente: tutte.filter((id) => !scelte.includes(id)) };
}

// Disegna l'elenco in `box`. `scrivi(config)` riceve la configurazione nuova.
export function disegnaRighe(box, elenco, config, scrivi) {
  const { scelte, spente } = ordineRighe(config, elenco);
  box.innerHTML = "";
  [...scelte, ...spente].forEach((id) => {
    const accesa = scelte.includes(id);
    const voce = elenco.find((r) => r.id === id);
    const riga = document.createElement("div");
    riga.className = "ce-riga" + (accesa ? " accesa" : " spenta");
    riga.dataset.id = id;
    riga.innerHTML = `<span class="maniglia" title="Trascina per spostare">⠿</span>`
      + `<label><input type="checkbox" ${accesa ? "checked" : ""}> <span></span></label>`
      + `<input type="text" class="nome"><input type="color" class="tinta" title="Colore della riga">`
      + `<button type="button" class="pulisci" title="Rimetti il colore di serie">↺</button>`;
    riga.querySelector("label span").textContent = T(voce.nome);

    // il nome che si vede sulla scheda: vuoto = quello di serie
    const nome = riga.querySelector(".nome");
    nome.placeholder = T(voce.etichetta);
    nome.title = T("Nome sulla scheda (vuoto =") + " " + T(voce.etichetta) + ")";
    nome.value = (config.nomi_righe || {})[id] || "";
    nome.addEventListener("change", () => {
      const nomi = { ...(config.nomi_righe || {}) };
      const t = nome.value.trim();
      if (t) nomi[id] = t; else delete nomi[id];
      const c = { ...config, nomi_righe: nomi };
      if (!Object.keys(nomi).length) delete c.nomi_righe;
      scrivi(c);
    });

    // il colore della riga: senza scelta resta quello di serie
    const tinta = riga.querySelector(".tinta");
    tinta.value = (config.colori_righe || {})[id] || voce.colore || "#888888";
    const scriviColore = (valore) => {
      const colori = { ...(config.colori_righe || {}) };
      if (valore) colori[id] = valore; else delete colori[id];
      const c2 = { ...config, colori_righe: colori };
      if (!Object.keys(colori).length) delete c2.colori_righe;
      scrivi(c2);
    };
    tinta.addEventListener("change", () => scriviColore(tinta.value));
    riga.querySelector(".pulisci").addEventListener("click", () => scriviColore(null));

    riga.querySelector("input[type=checkbox]").addEventListener("change", (e) => {
      const n = scelte.filter((x) => x !== id);
      if (e.target.checked) n.push(id);
      scrivi({ ...config, righe: n });
    });

    // SI SPOSTA TRASCINANDO LA MANIGLIA (pointer events, ascoltati su tutta
    // la finestra: il drag and drop nativo sul telefono non va, e senza
    // "cattura" il rilascio fuori dalla maniglia si perdeva). La riga si
    // sposta mentre trascini, l'ordine si scrive quando lasci.
    const maniglia = riga.querySelector(".maniglia");
    if (!accesa) maniglia.style.visibility = "hidden";
    maniglia.addEventListener("pointerdown", (e) => {
      if (!accesa) return;
      e.preventDefault();
      try { maniglia.setPointerCapture(e.pointerId); } catch (err) { /* pazienza */ }
      riga.classList.add("trascino");
      const muovi = (ev) => {
        const altre = [...box.querySelectorAll(".ce-riga.accesa")].filter((r) => r !== riga);
        const prima = altre.find((r) => {
          const q = r.getBoundingClientRect();
          return ev.clientY < q.top + q.height / 2;
        });
        if (prima) box.insertBefore(riga, prima);
        else box.insertBefore(riga, box.querySelector(".ce-riga.spenta") || null);
      };
      const lascia = () => {
        window.removeEventListener("pointermove", muovi);
        window.removeEventListener("pointerup", lascia);
        window.removeEventListener("pointercancel", lascia);
        riga.classList.remove("trascino");
        const nuovo = [...box.querySelectorAll(".ce-riga.accesa")].map((r) => r.dataset.id);
        if (nuovo.join() !== scelte.join()) scrivi({ ...config, righe: nuovo });
      };
      window.addEventListener("pointermove", muovi);
      window.addEventListener("pointerup", lascia);
      window.addEventListener("pointercancel", lascia);
    });
    box.appendChild(riga);
  });
}

// Le righe della scheda nell'ordine della configurazione, coi nomi scelti.
// `R` = {id: html della riga}; la scritta sta nel primo <small>.
export function righeInOrdine(config, elenco, R, esc) {
  const { scelte } = ordineRighe(config, elenco);
  const nomi = config.nomi_righe || {};
  const colori = config.colori_righe || {};
  return scelte.filter((id) => R[id] !== undefined).map((id) => {
    let html = R[id];
    const nome = nomi[id] && String(nomi[id]).trim();
    if (nome) html = html.replace(/<small>[^<]*<\/small>/, `<small>${esc(nome)}</small>`);
    // il colore scelto a mano prende il posto di quello di serie
    if (colori[id]) html = html.replace(/style="--c:[^"]*"/, `style="--c:${esc(colori[id])}"`);
    return html;
  }).join("\n              ");
}


/**
 * Fa scegliere QUALI aiutanti cancellare, invece di prendere o lasciare.
 * `elenco` sono {entity, entry_id, titolo}; chiama `poi(scelti)` col sottoinsieme.
 */
export function quali_cancellare(box, elenco, hass, poi) {
  // i nomi arrivano da Home Assistant: nell'HTML si mettono ripuliti
  const esc = (x) => String(x ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  // che razza di aiutante e': una memoria e l'automazione del ciclo si
  // cancellano in un altro modo, e chi guarda deve saperlo
  const razza = (a) => (a.tipo === "memoria" ? "memoria · "
    : a.tipo === "automazione" ? "automazione · " : "");
  const valore = (e) => {
    const st = hass && hass.states[e];
    if (!st || ["unknown", "unavailable"].includes(st.state)) return "";
    const u = st.attributes.unit_of_measurement ? " " + st.attributes.unit_of_measurement : "";
    return st.state + u;
  };
  box.innerHTML = TH(`<div class="ce-scelta">
    <div class="ce-aiuto">${T("Spunta quelli da buttare. Lo storico che hanno raccolto si perde; la presa e i sensori del dispositivo non si toccano. Ci sono anche le <b>memorie dell'ultimo ciclo</b> e l'<b>automazione</b> che le riempie: se butti quelle, il riquadro dell'ultimo ciclo resta vuoto.")}</div>
    ${elenco.map((a, i) => `<label><input type="checkbox" data-i="${i}" checked>
      <span>${esc(a.titolo)}</span><span class="dett">${esc(razza(a))}${esc(valore(a.entity))}</span></label>`).join("")}
    <div class="barra">
      <span class="tutti" data-tutti="1">tutti</span>
      <span class="tutti" data-tutti="0">nessuno</span>
      <button type="button" class="ce-prepara ce-fai-cancella">Cancella i selezionati</button>
      <button type="button" class="ce-prepara ce-lascia">Lascia stare</button>
    </div>
  </div>`);
  const spunte = [...box.querySelectorAll("input[type=checkbox]")];
  box.querySelectorAll("[data-tutti]").forEach((t) => t.addEventListener("click", () => {
    spunte.forEach((x) => { x.checked = t.dataset.tutti === "1"; });
  }));
  box.querySelector(".ce-lascia").addEventListener("click", () => { box.innerHTML = ""; });
  box.querySelector(".ce-fai-cancella").addEventListener("click", () => {
    const scelti = spunte.filter((x) => x.checked).map((x) => elenco[Number(x.dataset.i)]);
    box.innerHTML = "";
    if (scelti.length) poi(scelti);
  });
}

// ---------------------------------------------------------------- i tasti
// Il catalogo delle icone, lo stesso della casella: quelle disegnate piu'
// tutte le MDI. Si cerca per nome e per sinonimo ("spina" trova la presa).
function catalogo(cerca) {
  const tutte = NOMI_ICONE.concat(NOMI_MDI);
  const q = String(cerca || "").trim().toLowerCase();
  if (!q) return tutte.slice(0, 160);
  const parole = (n) => (n + " " + (SINONIMI[n] || "") + " " + (MDI_PAROLE[n] || "")).toLowerCase();
  return tutte.filter((n) => parole(n).includes(q)).slice(0, 160);
}

function disegnaCatalogo(box, scelta, poi) {
  box.innerHTML = "";
  const cerca = document.createElement("input");
  cerca.type = "search";
  cerca.placeholder = T("Cerca l'icona: presa, luce, spina...");
  const griglia = document.createElement("div");
  griglia.className = "ce-icone";
  box.appendChild(cerca);
  box.appendChild(griglia);
  const riempi = () => {
    griglia.innerHTML = catalogo(cerca.value).map((n) => `<button type="button" data-n="${n}"
      class="${n === scelta ? "scelta" : ""}" title="${n}"><svg viewBox="0 0 64 64">${
      ICONE[n] || disegnoMdi(n) || ""}</svg></button>`).join("");
  };
  riempi();
  cerca.addEventListener("input", riempi);
  griglia.addEventListener("click", (e) => {
    const b = e.target.closest("button[data-n]");
    if (b) poi(b.dataset.n);
  });
  setTimeout(() => cerca.focus(), 0);
}

/**
 * Il riquadro dei tasti di accensione: una riga per tasto (icona, nome,
 * cestino) e in fondo "Aggiungi". `scrivi(elenco)` riceve l'elenco nuovo.
 */
export function disegnaTasti(box, elenco, hass, scrivi) {
  const nome = (eid) => {
    const st = hass && hass.states[eid];
    return (st && st.attributes && st.attributes.friendly_name) || eid;
  };
  box.innerHTML = "";
  (elenco || []).forEach((t, i) => {
    const riga = document.createElement("div");
    riga.className = "ce-tasto";
    riga.innerHTML = `<button type="button" class="icona" title="${T("Scegli l'icona")}">
        <svg viewBox="0 0 64 64">${ICONE[t.icona] || disegnoMdi(t.icona) || ICONE.presa || ""}</svg>
      </button><span class="chi"></span>
      <button type="button" class="via" title="${T("Togli questo tasto")}">\u00d7</button>`;
    riga.querySelector(".chi").textContent = nome(t.entity);
    const sotto = document.createElement("div");
    sotto.className = "ce-catalogo";
    sotto.hidden = true;
    riga.querySelector(".icona").addEventListener("click", () => {
      if (!sotto.hidden) { sotto.hidden = true; return; }
      sotto.hidden = false;
      disegnaCatalogo(sotto, t.icona, (scelto) => {
        const n = (elenco || []).map((x, k) => (k === i ? { ...x, icona: scelto } : x));
        scrivi(n);
      });
    });
    riga.querySelector(".via").addEventListener("click", () => {
      scrivi((elenco || []).filter((x, k) => k !== i));
    });
    box.appendChild(riga);
    box.appendChild(sotto);
  });
  const riga = document.createElement("div");
  riga.className = "ce-riga";
  riga.innerHTML = `<span class="ent">${T("Aggiungi un tasto")}</span>`;
  const sceglitore = document.createElement("ha-entity-picker");
  sceglitore.allowCustomEntity = true;
  if (hass) sceglitore.hass = hass;
  sceglitore.includeDomains = ["switch", "light", "input_boolean", "fan", "humidifier", "script"];
  sceglitore.addEventListener("value-changed", (ev) => {
    ev.stopPropagation();
    const id = ev.detail.value;
    sceglitore.value = "";
    if (!id || (elenco || []).some((x) => x.entity === id)) return;
    scrivi((elenco || []).concat([{ entity: id, icona: "" }]));
  });
  riga.appendChild(sceglitore);
  box.appendChild(riga);
}
