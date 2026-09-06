# -*- coding: utf-8 -*-
u"""OGNI SCRITTA TROVA LA SUA TRADUZIONE?

Con lo schema "l'italiano fa da chiave" il rischio e' uno solo: una chiave
scritta anche solo con un apostrofo diverso non traduce niente e nessuno se
ne accorge - la frase resta in italiano e sembra che manchi la traduzione.
Quindi lo verifico a macchina invece che a occhio.
"""
import io
import json
import os
import re

REPO = r'C:\Users\tarat\Desktop\cloude\casa-tile-card'
QUI = os.path.dirname(os.path.abspath(__file__))

# le chiavi del dizionario inglese, prese dal file vero
t = io.open(os.path.join(REPO, 'src', 'lingua.js'), encoding='utf-8').read()
corpo = t[t.index('export const EN = {'):]
chiavi = set()
for m in re.finditer(r"^  '((?:[^'\\]|\\.)*)':", corpo, re.M):
    chiavi.add(m.group(1).replace("\\'", "'"))
for m in re.finditer(r'^  "((?:[^"\\]|\\.)*)":', corpo, re.M):
    chiavi.add(m.group(1).replace('\\"', '"'))
print('chiavi nel dizionario: %d' % len(chiavi))

d = json.load(io.open(os.path.join(QUI, 'da_tradurre.json'), encoding='utf-8'))
d['etichette']['pannello_sfondo'] = (
    'Sfondo del riquadro casse e sorgenti (vuoto = scuro di serie; '
    'le scritte seguono il colore della scritta)')
tutte = []
tutte += [('etichetta ' + k, v) for k, v in d['etichette'].items()]
tutte += [('stato ' + k, v) for k, v in d['parole'].items()]
tutte += [('titolo', v) for v in d['titoli']]
tutte += [('voce', v) for v in d['voci']]

# le scritte nel codice hanno gli \" della sorgente: li tolgo come farebbe JS
def comeARuntime(s):
    return s.replace('\\"', '"').replace("\\'", "'").replace('\\\\', '\\')


senza = []
for tipo, s in tutte:
    if comeARuntime(s) not in chiavi:
        senza.append((tipo, s))

print('scritte in tutto: %d' % len(tutte))
print('SENZA traduzione: %d' % len(senza))
for tipo, s in senza:
    print('   [%s] %s' % (tipo, s[:96]))

# e il contrario: chiavi che non corrispondono a nessuna scritta (typo mie)
vive = set(comeARuntime(s) for _, s in tutte)
orfane = [k for k in chiavi if k not in vive]
print('\nchiavi che non servono a niente (probabile mio errore di battitura): %d' % len(orfane))
for k in orfane:
    print('   ', k[:96])
