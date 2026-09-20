# Il mirino del grafico anche col dito: una zona di tocco sopra al grafico con
# touch-action:none (se no il browser prende il gesto per uno scorrimento e lo
# annulla), il mirino agganciato al dito finche' lo tieni giu', il cartellino
# che resta ancora due secondi e mezzo dopo, e il trascinamento che NON fa
# partire l'azione della casella.

# 1) la zona, nella scocca
p = "src/casa-tile.js"
s = open(p, encoding="utf8").read()
v = '        <div class="mirino" hidden><i class="mira"></i><b class="palla"></b></div>\n'
assert s.count(v) == 1
s = s.replace(v, v + '        <div class="tocco-grafico" hidden></div>\n')

v = '    this._mirino = root.querySelector(".mirino");\n'
assert s.count(v) == 1
s = s.replace(v, v + '    this._toccoGrafico = root.querySelector(".tocco-grafico");\n')

vecchio = """    const card0 = root.querySelector("ha-card");
    ["pointermove", "pointerdown"].forEach((ev) =>
      card0.addEventListener(ev, (e) => this._muoviMirino(e)));
    ["pointerleave", "pointercancel", "pointerup"].forEach((ev) =>
      card0.addEventListener(ev, () => this._nascondiMirino()));
"""
assert s.count(vecchio) == 1
s = s.replace(vecchio, """    const card0 = root.querySelector("ha-card");
    this._ascoltaMirino(card0);
""")
open(p, "w", encoding="utf8", newline="\n").write(s)

# 2) gli ascolti
p = "src/carta-grafici.js"
s = open(p, encoding="utf8").read()
METODO = '''  // CHI MUOVE IL MIRINO. Col mouse basta passare sopra la casella. Col dito
  // no: il browser prende il gesto per uno scorrimento della pagina e dopo un
  // attimo lo annulla (pointercancel), e il mirino spariva. Percio' sopra al
  // grafico c'e' una zona sua con touch-action:none, che si prende il dito
  // (setPointerCapture) e lo tiene finche' non lo alzi.
  _ascoltaMirino(card0) {
    ["pointermove", "pointerdown"].forEach((ev) => card0.addEventListener(ev, (e) => {
      if (e.pointerType !== "touch") this._muoviMirino(e);
    }));
    ["pointerleave", "pointercancel", "pointerup"].forEach((ev) =>
      card0.addEventListener(ev, (e) => {
        if (e && e.pointerType === "touch") return;
        this._nascondiMirino();
      }));

    const zona = this._toccoGrafico;
    if (!zona) return;
    zona.addEventListener("pointerdown", (e) => {
      clearTimeout(this._mirinoVia);
      this._muoviMirino(e);
      if (!this._mirino || this._mirino.hidden) return;
      this._ditoMirino = e.pointerId;
      this._mirinoMosso = false;
      try { zona.setPointerCapture(e.pointerId); } catch (err) { /* pazienza */ }
    });
    zona.addEventListener("pointermove", (e) => {
      if (this._ditoMirino !== e.pointerId) return;
      this._mirinoMosso = true;
      this._muoviMirino(e);
    });
    const lascia = (e) => {
      if (this._ditoMirino !== e.pointerId) return;
      this._ditoMirino = null;
      // se hai trascinato, il clic che arriva subito dopo non deve fare
      // l'azione della casella (accendere, aprire il pop-up...)
      if (this._mirinoMosso) this._premutoLungo = true;
      // e il cartellino resta ancora un momento, il tempo di leggerlo
      clearTimeout(this._mirinoVia);
      this._mirinoVia = setTimeout(() => this._nascondiMirino(),
        e.pointerType === "touch" ? 2500 : 0);
    };
    ["pointerup", "pointercancel"].forEach((ev) => zona.addEventListener(ev, lascia));
  }

'''
v = "  // il mirino segue il dito o il mouse sopra al grafico\n"
assert s.count(v) == 1
s = s.replace(v, METODO + v)

# la zona compare e sparisce col grafico
for vecchio, nuovo in (
    ('    box.toggleAttribute("hidden", !vuole);\n',
     '    box.toggleAttribute("hidden", !vuole);\n'
     '    if (this._toccoGrafico) this._toccoGrafico.toggleAttribute("hidden", !vuole);\n'),
    ('    if (punti.length < 2) { box.toggleAttribute("hidden", true); return; }\n'
     '    box.toggleAttribute("hidden", false);\n',
     '    if (punti.length < 2) {\n'
     '      box.toggleAttribute("hidden", true);\n'
     '      if (this._toccoGrafico) this._toccoGrafico.toggleAttribute("hidden", true);\n'
     '      return;\n'
     '    }\n'
     '    box.toggleAttribute("hidden", false);\n'
     '    if (this._toccoGrafico) this._toccoGrafico.toggleAttribute("hidden", false);\n')):
    assert s.count(vecchio) == 1, vecchio[:40]
    s = s.replace(vecchio, nuovo)
open(p, "w", encoding="utf8", newline="\n").write(s)

# 3) lo stile della zona
p = "src/stile.js"
s = open(p, encoding="utf8").read()
v = ".mirino[hidden] { display: none !important; }"
assert s.count(v) == 1
s = s.replace(v, v + """
/* la zona che si prende il dito sopra al grafico: sta sopra al disegno ma
   sotto a barre, tasti e riquadri, che restano comandabili */
.tocco-grafico { position: absolute; left: 0; right: 0; bottom: 0; height: 46%;
  min-height: 24px; max-height: 72px; z-index: 1; touch-action: none; }
.tocco-grafico[hidden] { display: none !important; }
:host([trascinabile]) .tocco-grafico, :host([solo-casella]) .tocco-grafico {
  display: none !important; }""")
open(p, "w", encoding="utf8", newline="\n").write(s)
print("ok")
