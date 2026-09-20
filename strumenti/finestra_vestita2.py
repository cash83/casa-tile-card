# Seconda parte di finestra_vestita.py: il colore di ogni riga, scelto a mano
# (opzione colori_righe) e la casellina del colore nell'editor.
MANIGLIA = chr(0x283f)
TORNA = chr(0x21ba)

p = "src/elettro-righe-editor.js"
s = open(p, encoding="utf8").read()

vecchio = """  const { scelte } = ordineRighe(config, elenco);
  const nomi = config.nomi_righe || {};
  return scelte.filter((id) => R[id] !== undefined).map((id) => {
    const nome = nomi[id] && String(nomi[id]).trim();
    return nome ? R[id].replace(/<small>[^<]*<\\/small>/, `<small>${esc(nome)}</small>`) : R[id];
  }).join("\\n              ");"""
assert s.count(vecchio) == 1, "righeInOrdine"
s = s.replace(vecchio, """  const { scelte } = ordineRighe(config, elenco);
  const nomi = config.nomi_righe || {};
  const colori = config.colori_righe || {};
  return scelte.filter((id) => R[id] !== undefined).map((id) => {
    let html = R[id];
    const nome = nomi[id] && String(nomi[id]).trim();
    if (nome) html = html.replace(/<small>[^<]*<\\/small>/, `<small>${esc(nome)}</small>`);
    // il colore scelto a mano prende il posto di quello di serie
    if (colori[id]) html = html.replace(/style="--c:[^"]*"/, `style="--c:${esc(colori[id])}"`);
    return html;
  }).join("\\n              ");""")

vecchio = ('    riga.innerHTML = `<span class="maniglia" title="Trascina per spostare">' + MANIGLIA + '</span>`\n'
           '      + `<label><input type="checkbox" ${accesa ? "checked" : ""}> <span></span></label>`\n'
           '      + `<input type="text" class="nome">`;')
assert s.count(vecchio) == 1, "innerHTML"
s = s.replace(vecchio, '    riga.innerHTML = `<span class="maniglia" title="Trascina per spostare">' + MANIGLIA + '</span>`\n'
              '      + `<label><input type="checkbox" ${accesa ? "checked" : ""}> <span></span></label>`\n'
              '      + `<input type="text" class="nome"><input type="color" class="tinta" title="Colore della riga">`\n'
              '      + `<button type="button" class="pulisci" title="Rimetti il colore di serie">' + TORNA + '</button>`;')

vecchio = '    riga.querySelector("input[type=checkbox]").addEventListener("change", (e) => {'
assert s.count(vecchio) == 1, "checkbox"
s = s.replace(vecchio, """    // il colore della riga: senza scelta resta quello di serie
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

""" + vecchio)

v = "  .ce-riga input.max{"
assert s.count(v) == 1, "css"
s = s.replace(v, "  .ce-riga input.tinta{width:34px;height:28px;padding:0;border:1px solid var(--divider-color,#555);border-radius:7px;background:none;cursor:pointer}\n"
                 "  .ce-riga .pulisci{border:1px solid var(--divider-color,#555);background:none;color:inherit;border-radius:7px;width:28px;height:28px;cursor:pointer;line-height:1}\n" + v)
open(p, "w", encoding="utf8", newline="\n").write(s)
print("ok")
