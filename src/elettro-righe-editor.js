// Il pezzo comune degli editor di casa-energia e casa-elettrodomestico:
// l'elenco delle righe di un riquadro, da accendere/spegnere con la spunta,
// mettere in ordine TRASCINANDO la maniglia (mouse o dito) e rinominare.
// In configurazione: `righe` (gli id accesi, in ordine) e `nomi_righe`
// ({id: "nome"}; vuoto = nome di serie).

export const STILE_EDITOR = `
  .ce-sez{margin-top:18px;padding:12px;border-radius:12px;border:1px solid var(--divider-color,#444)}
  .ce-tit{font-weight:600;margin-bottom:4px}
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
  .ce-esito{margin-top:10px;font-size:12.5px;white-space:pre-wrap;color:var(--secondary-text-color)}
  .ce-esito.male{color:var(--error-color,#e46)}
  .ce-riga select{flex:1 1 40%;min-width:0;padding:5px 7px;border-radius:7px;border:1px solid var(--divider-color,#555);background:var(--card-background-color,#111);color:inherit;font:inherit;font-size:13px}
  .ce-prepara{margin-top:10px;border:1px solid var(--primary-color);background:none;color:var(--primary-color);border-radius:9px;padding:7px 12px;cursor:pointer}
`;

// ordine delle righe accese e quelle spente, dalla configurazione
export function ordineRighe(config, elenco) {
  const tutte = elenco.map((r) => r.id);
  const scelte = Array.isArray(config.righe) && config.righe.length
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
    riga.querySelector("label span").textContent = voce.nome;

    // il nome che si vede sulla scheda: vuoto = quello di serie
    const nome = riga.querySelector(".nome");
    nome.placeholder = voce.etichetta;
    nome.title = "Nome sulla scheda (vuoto = " + voce.etichetta + ")";
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
