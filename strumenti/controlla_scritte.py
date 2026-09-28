# -*- coding: utf-8 -*-
u"""OGNI T("...") DEL CODICE HA LA SUA RIGA NEL DIZIONARIO?

`controlla_lingua.py` guarda solo `schema.js` e `aiuti.js`: sono i due file
da cui nasce `da_tradurre.json`. Tutto il resto - le tre schede dei consumi,
il centro annunci, gli editor - non lo guardava nessuno, e diceva "0 senza
traduzione" anche con venti scritte nuove appena aggiunte. Dava sicurezza
falsa, che e' peggio di nessun controllo.

Questo prende le scritte dal CODICE VERO: cerca ogni `T("...")` in `src/` e
controlla che la frase italiana stia fra le chiavi di `EN`. Se manca, in
inglese resta in italiano e nessuno se ne accorge.

Si lancia con:  python strumenti/controlla_scritte.py
"""
import io
import os
import re
import sys

QUI = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(os.path.dirname(QUI), "src")

# le chiavi del dizionario, prese dal file vero
testo = io.open(os.path.join(SRC, "lingua.js"), encoding="utf-8").read()
corpo = testo[testo.index("export const EN = {"):]
chiavi = set()
for m in re.finditer(r"^  '((?:[^'\\]|\\.)*)':", corpo, re.M):
    chiavi.add(m.group(1).replace("\\'", "'"))
for m in re.finditer(r'^  "((?:[^"\\]|\\.)*)":', corpo, re.M):
    chiavi.add(m.group(1).replace('\\"', '"'))


def come_a_runtime(s):
    u"""nel codice la scritta ha le fughe (\\u00e0, \\"): a runtime JS le
    vede gia' sciolte, e le chiavi devono essere quelle di runtime."""
    s = s.replace('\\"', '"').replace("\\'", "'")
    return re.sub(r"\\u([0-9a-fA-F]{4})", lambda m: chr(int(m.group(1), 16)), s)


mancano = {}
quante = 0
for nome in sorted(os.listdir(SRC)):
    if not nome.endswith(".js") or nome == "lingua.js":
        continue
    s = io.open(os.path.join(SRC, nome), encoding="utf-8").read()
    # T("...") e T('...'), su una riga sola: quelle spezzate le monta il
    # codice a pezzi e non si possono leggere da fuori
    for virg, pat in (('"', r'\bT\(\s*"((?:[^"\\]|\\.)+)"\s*\)'),
                      ("'", r"\bT\(\s*'((?:[^'\\]|\\.)+)'\s*\)")):
        for m in re.finditer(pat, s):
            k = come_a_runtime(m.group(1))
            quante += 1
            if k not in chiavi:
                mancano.setdefault(nome, set()).add(k)

print("chiavi nel dizionario:  %d" % len(chiavi))
print("scritte nel codice:     %d" % quante)
senza = sum(len(v) for v in mancano.values())
print("SENZA traduzione:       %d" % senza)
for f in sorted(mancano):
    print("\n  " + f)
    for k in sorted(mancano[f]):
        print("     " + k[:96])
sys.exit(1 if senza else 0)
