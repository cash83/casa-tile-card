# casa-elettrodomestico: righe dell'Ultimo ciclo in ordine dalla configurazione
# (righe / nomi_righe), editor a clic, scritture protette se una riga e' spenta.
p = "src/elettro-elettrodomestico.js"
s = open(p, encoding="utf8").read()

apre = '            <div class="dm-ap-cycle-list">\n'
i = s.index(apre) + len(apre)
j = s.index("            </div>\n", i)
righe = s[i:j].rstrip("\n").split("\n")
IDS = [("fine", "dm-c-end"), ("durata", "dm-c-duration"), ("consumo", "dm-c-energy"), ("costo", "dm-c-cost")]
assert len(righe) == len(IDS), len(righe)
voci = []
for rid, classe in IDS:
    r = [x for x in righe if f'class="{classe}"' in x]
    assert len(r) == 1, classe
    voci.append(f"      {rid}: `{r[0].strip()}`,")
s = s[:i] + "              ${this._righeCiclo()}\n" + s[j:]

METODO = '''  // Le righe dell'Ultimo ciclo, nell'ordine e coi nomi della configurazione.
  _righeCiclo() {
    const R = {
''' + "\n".join(voci) + '''
    };
    return righeInOrdine(this._config, RIGHE_CICLO, R, esc);
  }

  static getConfigElement() {
    return document.createElement("casa-elettrodomestico-editor");
  }

  static getStubConfig(hass) {
    const st = (hass && hass.states) || {};
    const potenza = Object.keys(st).find((k) => k.startsWith("sensor.")
      && (st[k].attributes || {}).device_class === "power") || "";
    return { type: "custom:casa-elettrodomestico", name: "Lavatrice", artwork: "washer", power_entity: potenza };
  }

'''
v = "  setConfig(config) {"
assert s.count(v) == 1
s = s.replace(v, METODO + v, 1)

ELENCO = '''// Le righe dell'Ultimo ciclo, col nome che si vede nell'editor.
export const RIGHE_CICLO = [
  { id: "fine", nome: "Fine del ciclo (data e ora)", etichetta: "Fine" },
  { id: "durata", nome: "Durata del ciclo", etichetta: "Durata" },
  { id: "consumo", nome: "Consumo del ciclo (kWh)", etichetta: "Consumo" },
  { id: "costo", nome: "Costo del ciclo", etichetta: "Costo" },
];

'''
v = "export class CasaElettrodomestico extends HTMLElement {"
assert s.count(v) == 1
s = s.replace(v, ELENCO + v)
s = s.replace("} from './elettro-comune.js';\n",
              "} from './elettro-comune.js';\nimport { righeInOrdine } from './elettro-righe-editor.js';\n", 1)

# scritture protette: una riga spenta non c'e'
for classe in ("dm-c-end", "dm-c-duration", "dm-c-energy", "dm-c-cost"):
    v = f'    this._root.querySelector(".{classe}").textContent = '
    assert s.count(v) == 1, classe
    k = s.index(v)
    fine = s.index(";\n", k)
    corpo = s[k + len(v):fine]
    s = s[:k] + f'    {{ const x = this._root.querySelector(".{classe}"); if (x) x.textContent = {corpo}; }}' + s[fine + 1:]
open(p, "w", encoding="utf8", newline="\n").write(s)
print("ok")
