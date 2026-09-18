# casa-energia: riga "Solo energia" nel riquadro Oggi (kWh x prezzo della sola
# energia, come la pagina Energia di HA). Legge l'attributo "energia" di bill_today.
p = "src/elettro-energia.js"
s = open(p, encoding="utf8").read()
TRATTINO = chr(92) + "u2014"  # la sequenza — cosi' com'e' scritta nel sorgente JS
costo = ('<div class="dm-ap-cycle-row dm-ap-cycle-row-b"><span class="dm-ap-cycle-label"><span class="dm-ap-cycle-ic">${ICON_EURO}</span>'
         '<small>Costo</small></span><b class="dm-e-today-cost">' + TRATTINO + '</b></div>')
assert s.count(costo) == 1
riga = ('${this._config.bill_today ? `<div class="dm-ap-cycle-row dm-ap-cycle-row-b"><span class="dm-ap-cycle-label">'
        '<span class="dm-ap-cycle-ic">${ICON_BOLT}</span><small>Solo energia</small></span><b class="dm-e-solo">' + TRATTINO + '</b></div>` : ""}')
s = s.replace(costo, costo + "\n              " + riga)
v = '    if (fvEl) fvEl.textContent = this._euro(hass.states[cfg.bill_today]?.attributes?.risparmio_fotovoltaico);'
assert s.count(v) == 1
s = s.replace(v, v + '''
    const soloEl = this._root.querySelector(".dm-e-solo");
    if (soloEl) soloEl.textContent = this._euro(hass.states[cfg.bill_today]?.attributes?.energia);''')
open(p, "w", encoding="utf8", newline="\n").write(s)
print("ok")
