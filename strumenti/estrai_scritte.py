# -*- coding: utf-8 -*-
u"""Tiro fuori le scritte da tradurre, cosi' come sono nel codice."""
import io
import json
import os
import re

REPO = r'C:\Users\tarat\Desktop\cloude\casa-tile-card'
QUI = os.path.dirname(os.path.abspath(__file__))

STRINGA = r'"((?:[^"\\]|\\.)*)"'


def leggi(f):
    return io.open(os.path.join(REPO, 'src', f), encoding='utf-8').read()


def tabella(f, nome):
    t = leggi(f)
    m = re.search(r'export const ' + nome + r' = \{(.*?)\n\};', t, re.S)
    if not m:
        return {}
    return dict(re.findall(r'([A-Za-z0-9_]+):\s*' + STRINGA, m.group(1)))


eti = tabella('schema.js', 'ETICHETTE')
par = tabella('aiuti.js', 'PAROLE')
sch = leggi('schema.js')
titoli = re.findall(r'titolo:\s*' + STRINGA, sch)
voci = re.findall(r'label:\s*' + STRINGA, sch)

print('ETICHETTE %d   PAROLE %d   titoli %d   voci %d'
      % (len(eti), len(par), len(titoli), len(voci)))

io.open(os.path.join(QUI, 'da_tradurre.json'), 'w', encoding='utf-8').write(
    json.dumps({'etichette': eti, 'parole': par,
                'titoli': titoli, 'voci': voci}, ensure_ascii=False, indent=1))

print('\n--- PAROLE (gli stati che si leggono sulla casella) ---')
for k, v in sorted(par.items()):
    print('  %-24s %s' % (k, v))
print('\n--- titoli di sezione (%d) ---' % len(titoli))
for x in titoli:
    print('  ', x)
print('\n--- voci degli elenchi (%d) ---' % len(voci))
for x in voci:
    print('  ', x)
