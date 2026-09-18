# casa-energia:
# 1) riga "Senza FV" nel riquadro Oggi: quanto avresti speso senza pannelli,
#    tutto compreso e solo energia (costo + risparmio del fotovoltaico);
# 2) le barre dei circuiti non vanno sotto zero (un sensore che misura
#    produzione da' qualche W negativo quando e' fermo).
p = "src/elettro-energia.js"
s = open(p, encoding="utf8").read()
TRATTINO = chr(92) + "u2014"
PUNTO = chr(92) + "u00b7"

fv = ('<small>Risparmio FV</small></span><b class="dm-e-fv">' + TRATTINO + '</b></div>` : ""}')
assert s.count(fv) == 1
riga = ('\n              ${this._config.bill_today ? `<div class="dm-ap-cycle-row dm-ap-cycle-row-b"><span class="dm-ap-cycle-label">'
        '<span class="dm-ap-cycle-ic">${ICON_EURO}</span><small>Senza FV</small></span><b class="dm-e-senzafv">' + TRATTINO + '</b></div>` : ""}')
s = s.replace(fv, fv + riga)

v = '    const soloEl = this._root.querySelector(".dm-e-solo");'
assert s.count(v) == 1
s = s.replace(v, '''    const senzaEl = this._root.querySelector(".dm-e-senzafv");
    if (senzaEl) {
      const b = hass.states[cfg.bill_today];
      const a = b?.attributes || {};
      const tot = Number(b?.state) + Number(a.risparmio_fotovoltaico || 0);
      const en = Number(a.energia || 0) + Number(a.risparmio_fotovoltaico_energia || 0);
      senzaEl.textContent = `${this._euro(tot)} ''' + PUNTO + ''' en. ${this._euro(en)}`;
    }
''' + v)

# barre dei circuiti: mai sotto zero
vecchio = "      const vVal = Number.isFinite(v) ? v : 0;"
assert s.count(vecchio) == 1, s.count(vecchio)
s = s.replace(vecchio, "      const vVal = Number.isFinite(v) ? Math.max(0, v) : 0;")
open(p, "w", encoding="utf8", newline="\n").write(s)
print("ok")
