# casa-energia: "Senza FV" scritto per esteso: "2,14 € + tasse · 1,10 € energia".
p = "src/elettro-energia.js"
s = open(p, encoding="utf8").read()
PUNTO = chr(92) + "u00b7"
vecchio = "senzaEl.textContent = `${this._euro(tot)} " + PUNTO + " en. ${this._euro(en)}`;"
assert s.count(vecchio) == 1
s = s.replace(vecchio, "senzaEl.textContent = `${this._euro(tot)} + tasse " + PUNTO + " ${this._euro(en)} energia`;")
open(p, "w", encoding="utf8", newline="\n").write(s)
print("ok")
