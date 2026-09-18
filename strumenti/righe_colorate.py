# Righe colorate (barretta a sinistra, scritta e cifra dello stesso colore) e
# riquadro Oggi di casa-energia a scontrino:
#   Consumo · Energia + tasse · Risparmio pannelli (oggi · mese)
#   · Paghi (+ tasse) · Energia attuale · Mese (+ tasse) · Top consumo
# Colorate anche le righe dell'Ultimo ciclo (casa-elettrodomestico) e il conto
# voce per voce.
import re

TR = chr(92) + "u2014"
PUNTO = chr(92) + "u00b7"
MENO = chr(92) + "u2212"
AZZURRO, ARANCIO, VERDE, GIALLO = "#3fb4ea", "#f28c3c", "#43b86a", "#e2ad1c"
TURCHESE, VIOLA, ROSA, GRIGIO = "#2fbfb0", "#a283f2", "#f06e82", "#8e98a4"

# --- stile comune ------------------------------------------------------------
p = "src/elettro-comune.js"
s = open(p, encoding="utf8").read()
ancora = ".dm-ap-cycle-ic{display:flex;align-items:center;flex:0 0 auto;color:var(--dm-blue)}\n"
assert s.count(ancora) == 1
s = s.replace(ancora, ancora +
    ".dm-colore{border-left:3px solid var(--c)!important;border-radius:4px 9px 9px 4px!important}\n"
    ".dm-colore small,.dm-colore b,.dm-colore .dm-ap-cycle-ic,.dm-colore .dm-ap-row-label,.dm-colore .dm-ap-row-val{color:var(--c)!important}\n"
    ".dm-colore.dm-forte b,.dm-colore.dm-forte .dm-ap-row-val{font-size:15.5px;font-weight:700}\n")
open(p, "w", encoding="utf8", newline="\n").write(s)

CLASSE = 'class="dm-ap-cycle-row dm-ap-cycle-row-b"'
def colora(riga, colore, forte=False):
    assert riga.count(CLASSE) == 1
    extra = " dm-forte" if forte else ""
    return riga.replace(CLASSE, f'class="dm-ap-cycle-row dm-ap-cycle-row-b dm-colore{extra}" style="--c:{colore}"')

def rinomina(riga, vecchio, nuovo):
    assert f"<small>{vecchio}</small>" in riga, vecchio
    return riga.replace(f"<small>{vecchio}</small>", f"<small>{nuovo}</small>")

# --- casa-energia: il riquadro Oggi ------------------------------------------
p = "src/elettro-energia.js"
s = open(p, encoding="utf8").read()
apre = '            <div class="dm-ap-cycle-list">\n'
i = s.index(apre) + len(apre)
j = s.index("            </div>\n", i)
righe = s[i:j].rstrip("\n").split("\n")
def trova(classe):
    r = [x for x in righe if f'class="{classe}"' in x]
    assert len(r) == 1, classe
    return r[0]
nuove = [
    colora(trova("dm-e-today-kwh"), AZZURRO),
    colora(rinomina(trova("dm-e-senzafv"), "Senza FV + tasse", "Energia + tasse"), ARANCIO),
    colora(rinomina(trova("dm-e-fv"), "Risparmio FV", "Risparmio pannelli"), VERDE),
    colora(rinomina(trova("dm-e-today-cost"), "Pagato + tasse", "Paghi (+ tasse)"), GIALLO, forte=True),
    colora(rinomina(trova("dm-e-solo"), "Pagato no tasse", "Energia attuale"), TURCHESE),
    colora(rinomina(trova("dm-e-month-cost"), "Mese + tasse", "Mese (+ tasse)"), VIOLA),
    colora(trova("dm-e-top"), ROSA),
]
s = s[:i] + "\n".join(nuove) + "\n" + s[j:]
# il risparmio si toglie: "− 0,19 € · 7,54 € mese"
vecchio = "? `${oggi} oggi " + PUNTO + " ${this._euro(hass.states[cfg.bill_month]?.attributes?.risparmio_fotovoltaico)} mese`"
assert s.count(vecchio) == 1
s = s.replace(vecchio, "? `" + MENO + " ${oggi} " + PUNTO + " ${this._euro(hass.states[cfg.bill_month]?.attributes?.risparmio_fotovoltaico)} mese`")
vecchio = "      fvEl.textContent = cfg.bill_month\n"
assert s.count(vecchio) == 1

# il conto voce per voce, colorato
vecchio = "    const riga = (label, k, euro = true) => this._statRow2(label,"
assert s.count(vecchio) == 1
s = s.replace(vecchio, "    const riga = (label, k, euro = true, colore = null, forte = false) => this._statRow2c(colore, forte, label,")
for label, colore in (('"kWh presi dalla rete", "kwh", false', AZZURRO), ('"Energia", "energia"', TURCHESE),
                      ('"Rete e oneri", "rete_e_oneri"', ARANCIO), ('"Accise", "accise"', VIOLA),
                      ('"Quota fissa", "quota_fissa"', ROSA), ('"IVA", "iva"', GRIGIO),
                      ('"Risparmio (energia che non hai comprato)", "risparmio_fotovoltaico"', VERDE)):
    v = "${riga(" + label + ")}"
    assert s.count(v) == 1, label
    extra = "" if "false" in label else ", true"
    s = s.replace(v, "${riga(" + label + extra + ', "' + colore + '")}')
v = '${this._statRow2("Totale", tot(cfg.bill_today), tot(cfg.bill_month))}'
assert s.count(v) == 1
s = s.replace(v, '${this._statRow2c("' + GIALLO + '", true, "Totale", tot(cfg.bill_today), tot(cfg.bill_month))}')
v = "  _statRow2(label, aVal, bVal) {"
assert s.count(v) == 1
s = s.replace(v, '''  // come _statRow2, ma con la barretta e le scritte del colore della riga
  _statRow2c(colore, forte, label, aVal, bVal) {
    const html = this._statRow2(label, aVal, bVal);
    if (!colore) return html;
    return html.replace('class="dm-ap-row"', `class="dm-ap-row dm-colore${forte ? " dm-forte" : ""}" style="--c:${colore}"`);
  }

''' + v)
open(p, "w", encoding="utf8", newline="\n").write(s)

# --- casa-elettrodomestico: l'ultimo ciclo -------------------------------------
p = "src/elettro-elettrodomestico.js"
s = open(p, encoding="utf8").read()
for classe, colore in (("dm-c-end", VIOLA), ("dm-c-duration", TURCHESE), ("dm-c-energy", AZZURRO), ("dm-c-cost", GIALLO)):
    r = [x for x in s.split("\n") if f'class="{classe}"' in x and CLASSE in x]
    assert len(r) == 1, classe
    s = s.replace(r[0], colora(r[0], colore))
open(p, "w", encoding="utf8", newline="\n").write(s)
print("ok")
