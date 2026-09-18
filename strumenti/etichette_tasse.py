# casa-energia: "Costo" e "Costo mese" sono tutto compreso (rete, oneri, accise,
# IVA, quota fissa): lo dico nell'etichetta, accanto a "Solo energia".
p = "src/elettro-energia.js"
s = open(p, encoding="utf8").read()
for vecchia, nuova in (("<small>Costo</small>", "<small>Costo + tasse</small>"),
                       ("<small>Costo mese</small>", "<small>Mese + tasse</small>")):
    assert s.count(vecchia) == 1, vecchia
    s = s.replace(vecchia, nuova)
open(p, "w", encoding="utf8", newline="\n").write(s)
print("ok")
