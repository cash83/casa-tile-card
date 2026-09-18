# Porta dentro casa-tile le due schede "energia" ed "elettrodomestico" nate
# dal lavoro di Simonz82 (github.com/Simonz82/smart-home-cards, licenza libera:
# "usatele, modificatele, ridistribuitele"). Si lancia UNA volta: da qui in
# poi i tre file in src/ sono nostri e si modificano a mano.
#   python strumenti/porta_elettro.py <smart-home-cards.js gia' con la patch del top consumo>
import sys

src = open(sys.argv[1], encoding="utf8").read()
righe = src.split("\n")

def tra(a, b):
    i = src.index(a)
    j = src.index(b, i)
    return src[i:j]

INTESTA = ("// {titolo}\n"
           "// Nata dalle schede di Simonz82 (github.com/Simonz82/smart-home-cards),\n"
           "// che le lascia libere: portata qui dentro il 18/09/2026 per non dipendere\n"
           "// da un secondo file. Da qui in poi e' codice nostro.\n\n")

# --- pezzi comuni: disegni, icone, stile, funzioni di servizio ----------------
comune = src[src.index("const HERO_BUILDERS = {"):src.index("class DmApplianceCloneCard extends HTMLElement")]
nomi = []
for r in comune.split("\n"):
    for pre in ("const ", "function "):
        if r.startswith(pre):
            nome = r[len(pre):].split(" ")[0].split("(")[0].split("=")[0].strip()
            nomi.append(nome)
comune = INTESTA.format(titolo="Pezzi comuni delle schede energia/elettrodomestico: disegni, icone, stile.") \
    + comune.rstrip() + "\n\nexport {\n  " + ",\n  ".join(nomi) + ",\n};\n"

def classe(nome_vecchio, nome_nuovo, fine):
    c = tra(f"class {nome_vecchio} extends HTMLElement", fine).rstrip() + "\n"
    return c.replace(f"class {nome_vecchio} ", f"class {nome_nuovo} ", 1)

elettro = classe("DmApplianceCloneCard", "CasaElettrodomestico", 'customElements.define("dm-appliance-clone-card"')
energia = classe("DmEnergyCard", "CasaEnergia", 'customElements.define("dm-energy-card"')

def usati(testo):
    return [n for n in nomi if n in testo]

def modulo(titolo, testo, nome):
    imp = "import {\n  " + ",\n  ".join(usati(testo)) + ",\n} from './elettro-comune.js';\n\n"
    return INTESTA.format(titolo=titolo) + imp + "export " + testo

open("src/elettro-comune.js", "w", encoding="utf8", newline="\n").write(comune)
open("src/elettro-elettrodomestico.js", "w", encoding="utf8", newline="\n").write(
    modulo("custom:casa-elettrodomestico - lavatrice, lavastoviglie, forno, asciugatrice...", elettro, "CasaElettrodomestico"))
open("src/elettro-energia.js", "w", encoding="utf8", newline="\n").write(
    modulo("custom:casa-energia - consumo della casa, costi, circuiti, top consumo automatico.", energia, "CasaEnergia"))
print("nomi comuni:", len(nomi))
print("elettrodomestico usa:", usati(elettro))
print("energia usa:", usati(energia))
