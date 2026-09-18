# casa-energia: il riquadro Oggi rifatto chiaro, una regola sola ("+ tasse" / "no tasse"):
#   Consumo · Pagato + tasse · Pagato no tasse · Senza FV + tasse · Senza FV no tasse
#   · Risparmio FV (oggi · mese) · Mese + tasse · Top consumo
p = "src/elettro-energia.js"
s = open(p, encoding="utf8").read()
TR = chr(92) + "u2014"
PUNTO = chr(92) + "u00b7"

apre = '            <div class="dm-ap-cycle-list">\n'
i = s.index(apre) + len(apre)
j = s.index("            </div>\n", i)
righe = s[i:j].rstrip("\n").split("\n")

def trova(classe):
    r = [x for x in righe if f'class="{classe}"' in x]
    assert len(r) == 1, classe
    return r[0]

def rinomina(riga, vecchio, nuovo):
    assert f"<small>{vecchio}</small>" in riga, vecchio
    return riga.replace(f"<small>{vecchio}</small>", f"<small>{nuovo}</small>")

consumo = trova("dm-e-today-kwh")
pagato = rinomina(trova("dm-e-today-cost"), "Costo + tasse", "Pagato + tasse")
pagato_no = rinomina(trova("dm-e-solo"), "Solo energia", "Pagato no tasse")
senza = rinomina(trova("dm-e-senzafv"), "Senza FV", "Senza FV + tasse")
senza_no = (senza.replace("<small>Senza FV + tasse</small>", "<small>Senza FV no tasse</small>")
                 .replace('class="dm-e-senzafv"', 'class="dm-e-senzafv-en"')
                 .replace("${ICON_EURO}", "${ICON_BOLT}"))
fv = trova("dm-e-fv")
mese = trova("dm-e-month-cost")
top = trova("dm-e-top")
s = s[:i] + "\n".join([consumo, pagato, pagato_no, senza, senza_no, fv, mese, top]) + "\n" + s[j:]

# i valori: "Senza FV" diviso in due righe, "Risparmio FV" con oggi e mese scritti
vecchio = "senzaEl.textContent = `${this._euro(tot)} + tasse " + PUNTO + " ${this._euro(en)} energia`;"
assert s.count(vecchio) == 1
s = s.replace(vecchio, """senzaEl.textContent = this._euro(tot);
      const senzaEn = this._root.querySelector(".dm-e-senzafv-en");
      if (senzaEn) senzaEn.textContent = this._euro(en);""")
vecchio = "? `${oggi} " + PUNTO + " ${this._euro(hass.states[cfg.bill_month]?.attributes?.risparmio_fotovoltaico)}`"
assert s.count(vecchio) == 1
s = s.replace(vecchio, "? `${oggi} oggi " + PUNTO + " ${this._euro(hass.states[cfg.bill_month]?.attributes?.risparmio_fotovoltaico)} mese`")
open(p, "w", encoding="utf8", newline="\n").write(s)
print("ok")
