# casa-energia: la riga "Risparmio FV" fa vedere oggi e mese insieme ("0.08 € · 7.42 €").
p = "src/elettro-energia.js"
s = open(p, encoding="utf8").read()
v = '    if (fvEl) fvEl.textContent = this._euro(hass.states[cfg.bill_today]?.attributes?.risparmio_fotovoltaico);'
assert s.count(v) == 1
s = s.replace(v, '''    if (fvEl) {
      const oggi = this._euro(hass.states[cfg.bill_today]?.attributes?.risparmio_fotovoltaico);
      fvEl.textContent = cfg.bill_month
        ? `${oggi} \\u00b7 ${this._euro(hass.states[cfg.bill_month]?.attributes?.risparmio_fotovoltaico)}`
        : oggi;
    }''')
open(p, "w", encoding="utf8", newline="\n").write(s)
print("ok")
