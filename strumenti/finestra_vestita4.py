# I campi del vestito del pop-up nei due editor (tinta, trasparenza, velo).
CAMPI = """  { name: "finestra_sfondo", selector: { color_rgb: {} } },
  { name: "finestra_trasparenza", selector: { number: { min: 0, max: 90, step: 5, mode: "slider", unit_of_measurement: "%" } } },
  { name: "finestra_scritta", selector: { color_rgb: {} } },
  { name: "velo_scuro", selector: { number: { min: 0, max: 100, step: 5, mode: "slider", unit_of_measurement: "%" } } },
  { name: "velo_sfoca", selector: { number: { min: 0, max: 30, step: 1, mode: "slider", unit_of_measurement: "px" } } },
"""
ETICHETTE = """  finestra_sfondo: "Tinta della finestra del pop-up",
  finestra_trasparenza: "Trasparenza della finestra",
  finestra_scritta: "Colore delle scritte nella finestra",
  velo_scuro: "Quanto scurisce quello che c'e' dietro",
  velo_sfoca: "Quanto sfoca quello che c'e' dietro",
"""
AIUTI = '''  // i colori si scrivono in esadecimale (#1b2430), il selettore di Home
  // Assistant invece parla in tre numeri: qui li traduco avanti e indietro
  _versoHex(v) {
    if (!Array.isArray(v) || v.length < 3) return v || "";
    return "#" + v.slice(0, 3).map((n) => Number(n).toString(16).padStart(2, "0")).join("");
  }

  _versoRgb(v) {
    const m = /^#?([0-9a-f]{6})$/i.exec(String(v || ""));
    if (!m) return undefined;
    const n = parseInt(m[1], 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }

'''

for p in ("src/elettro-energia-editor.js", "src/elettro-elettrodomestico-editor.js"):
    s = open(p, encoding="utf8").read()
    assert "finestra_sfondo" not in s, p + ": gia' fatto"

    v = '  { name: "notification_path", selector: { text: {} } },\n'
    assert s.count(v) == 1, p + ": schema"
    s = s.replace(v, v + CAMPI)

    i = s.index('  notification_path: "')
    j = s.index("\n", i) + 1
    s = s[:j] + ETICHETTE + s[j:]

    v = "  _cambiatoForm(v) {\n"
    assert s.count(v) == 1, p + ": cambiatoForm"
    s = s.replace(v, AIUTI + v + "    // le terne del selettore tornano esadecimali\n"
                     '    ["finestra_sfondo", "finestra_scritta"].forEach((k) => {\n'
                     "      if (k in v) v[k] = this._versoHex(v[k]);\n"
                     "    });\n")

    v = "  _datiForm() {\n    const c = this._config;\n    return { ...c,"
    assert s.count(v) == 1, p + ": datiForm"
    s = s.replace(v, "  _datiForm() {\n    const c = this._config;\n    return { ...c,\n"
                     "      finestra_sfondo: this._versoRgb(c.finestra_sfondo),\n"
                     "      finestra_scritta: this._versoRgb(c.finestra_scritta),")
    open(p, "w", encoding="utf8", newline="\n").write(s)
print("ok")
