# casa-energia:
# 1) le righe del riquadro Oggi in un ordine deciso dalla configurazione
#    (`righe`: elenco di id; quelle che mancano non si vedono);
# 2) l'editor a clic (getConfigElement -> casa-energia-editor);
# 3) nelle righe strette la scritta si accorcia coi puntini, la cifra resta intera.
p = "src/elettro-energia.js"
s = open(p, encoding="utf8").read()

apre = '            <div class="dm-ap-cycle-list">\n'
i = s.index(apre) + len(apre)
j = s.index("            </div>\n", i)
righe = s[i:j].rstrip("\n").split("\n")
IDS = [("consumo", "dm-e-today-kwh"), ("energia_tasse", "dm-e-senzafv"), ("risparmio", "dm-e-fv"),
       ("pv_tasse", "dm-e-today-cost"), ("energia", "dm-e-solo"), ("mese", "dm-e-month-cost"), ("top", "dm-e-top")]
voci = []
for rid, classe in IDS:
    r = [x for x in righe if f'class="{classe}"' in x]
    assert len(r) == 1, classe
    voci.append(f"      {rid}: `{r[0].strip()}`,")
assert len(righe) == len(IDS), len(righe)
s = s[:i] + "              ${this._righeOggi()}\n" + s[j:]

METODO = '''  // Le righe del riquadro Oggi, nell'ordine della configurazione (`righe`).
  // Una riga che non e' nell'elenco non si vede.
  _righeOggi() {
    const R = {
''' + "\n".join(voci) + '''
    };
    const ordine = Array.isArray(this._config.righe) && this._config.righe.length
      ? this._config.righe : RIGHE_OGGI.map((r) => r.id);
    // i nomi scelti a mano (`nomi_righe: {id: "nome"}`) al posto di quelli di serie
    const nomi = this._config.nomi_righe || {};
    return ordine.filter((id) => R[id] !== undefined).map((id) => {
      const nome = nomi[id] && String(nomi[id]).trim();
      return nome ? R[id].replace(/<small>[^<]*<\\/small>/, `<small>${esc(nome)}</small>`) : R[id];
    }).join("\\n              ");
  }

  static getConfigElement() {
    return document.createElement("casa-energia-editor");
  }

  static getStubConfig(hass) {
    const st = (hass && hass.states) || {};
    const potenza = Object.keys(st).find((k) => k.startsWith("sensor.")
      && (st[k].attributes || {}).device_class === "power") || "";
    return { type: "custom:casa-energia", name: "Energia Casa", power_entity: potenza, top_auto: true };
  }

'''
v = "  setConfig(config) {"
assert s.count(v) == 1
s = s.replace(v, METODO + v, 1)

ELENCO = '''// Le righe che puo' avere il riquadro Oggi, con il nome che si vede nell'editor.
export const RIGHE_OGGI = [
  { id: "consumo", nome: "Consumo (kWh presi dalla rete)", etichetta: "Consumo" },
  { id: "energia_tasse", nome: "Energia + tasse (senza pannelli)", etichetta: "Energia + tasse" },
  { id: "risparmio", nome: "Risparmio pannelli (oggi e mese)", etichetta: "Risparmio pannelli" },
  { id: "pv_tasse", nome: "PV + tasse (quello che paghi)", etichetta: "PV + tasse" },
  { id: "energia", nome: "Energia attuale (senza tasse)", etichetta: "Energia attuale" },
  { id: "mese", nome: "Mese (+ tasse)", etichetta: "Mese (+ tasse)" },
  { id: "top", nome: "Top consumo", etichetta: "Top consumo" },
];

'''
v = "export class CasaEnergia extends HTMLElement {"
assert s.count(v) == 1
s = s.replace(v, ELENCO + v)
open(p, "w", encoding="utf8", newline="\n").write(s)

# --- righe strette: la scritta cede, la cifra no -------------------------------
p = "src/elettro-comune.js"
s = open(p, encoding="utf8").read()
v = ".dm-ap-cycle-label{display:flex;align-items:center;gap:5px;min-width:0}"
assert s.count(v) == 1
s = s.replace(v, ".dm-ap-cycle-label{display:flex;align-items:center;gap:5px;min-width:0;flex:1 1 auto;overflow:hidden}"
                 "\n.dm-ap-cycle-label small{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:0 1 auto}"
                 "\n.dm-ap-cycle-row-b b{flex:0 1 auto;max-width:72%}")
open(p, "w", encoding="utf8", newline="\n").write(s)
print("ok")
