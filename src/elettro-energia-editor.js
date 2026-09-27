// L'editor a clic di custom:casa-energia.
// Sopra: le impostazioni (ha-form di Home Assistant). Sotto: le righe del
// riquadro Oggi, da accendere/spegnere, trascinare in ordine e rinominare.
// I circuiti si scelgono come elenco di entita': il nome lo prendo dal
// sensore, e chi li ha gia' configurati a mano li ritrova come erano.

import { RIGHE_OGGI } from './elettro-energia.js';
import { VERSIONE } from './versione.js';
import { ConEditor } from './elettro-condivisi.js';
import { tastiDi } from './elettro-comune.js';
import { T, TH, traduciSchema } from './lingua.js';
import { contaNelTop, preseDiCasa } from './elettro-prepara.js';
import { STILE_EDITOR, confermaDoppia, disegnaRighe, disegnaTasti, titoloSez } from './elettro-righe-editor.js';
import { creaFonte, creaRisparmio, ID_TOTALE, prezzoDellaCasa, idDellaVoce, VOCI_TARIFFA, scriviTariffa, INGREDIENTE, creaSensoriBase, prezziDelKWh } from './elettro-crea.js';

// quello che si legge sotto al campo
const AIUTI = {};

// il campo tiene una lista: quello che c'era prima (un'entita' sola) vale uguale
const lista = (v) => (Array.isArray(v) ? v : (v ? [v] : []));

const ETICHETTE = {
  name: "Nome della scheda",
  power_entity: "Potenza della casa (W) - obbligatoria",
  artwork: "Icona",
  interruttore: "Tasto \u23fb nella barra in alto: cosa accende e spegne",
  interruttore_usb: "Secondo tasto per le prese USB (se ci sono)",
  oggi_energia: "Contatore dei kWh di OGGI (aiutante «contatore di utenza», ciclo giornaliero)",
  oggi_costo: "Sensore degli EURO di oggi (i kWh per il prezzo)",
  mese_energia: "Contatore dei kWh del MESE (stesso aiutante, ciclo mensile)",
  mese_costo: "Sensore degli EURO del mese",
  max_power: "Fondo scala della barra (W, es. 3300 con 3 kW)",
  top_auto: "Top consumo automatico (cerca da solo tutte le prese che misurano)",
  top_min_w: "Sotto questi W non e' «top»",
  unmeasured_label: "Nome della voce «Non misurato»",
  top_include: "Prese da contare sempre (anche se escluse qui sotto)",
  top_exclude: "Parole che fanno escludere un sensore (batterie, inverter...)",
  bill_today: "Conto di oggi voce per voce (es. sensor.costi_luce_oggi)",
  bill_month: "Conto del mese voce per voce (es. sensor.costi_luce_mese)",
  bolletta_energia: "Contatore dei kWh del periodo della bolletta (bimestre)",
  bolletta_costo: "Contatore degli euro dello stesso periodo",
  notification_path: "Pagina delle notifiche (facoltativa, es. /lovelace/notifiche)",
  layout: "Disposizione della scheda",
  tema: "Chiaro o scuro (questa scheda soltanto)",
  finestra_apertura: "Come si apre il pop-up",
  finestra_apertura_durata: "Quanto dura l'apertura",
  finestra_largo: "Larghezza del pop-up (vuoto = 560)",
  finestra_immagine: "Foto di sfondo del pop-up (indirizzo)",
  finestra_sfondo: "Pop-up: la tinta della finestra (vuoto = come le schede)",
  finestra_trasparenza: "Pop-up: quanto e' trasparente la finestra",
  finestra_scritta: "Pop-up: il colore delle scritte",
  velo_scuro: "Pop-up: quanto scurisce quello che c'e' dietro",
  velo_sfoca: "Pop-up: quanto sfoca quello che c'e' dietro",
};

const SCHEMA_TUTTO = [
  { name: "name", selector: { text: {} } },
  { name: "power_entity", required: true, selector: { entity: { domain: "sensor", device_class: "power" } } },
  { name: "artwork", selector: { select: { mode: "dropdown", options: [
    { value: "washer", label: "Lavatrice" },
    { value: "dishwasher", label: "Lavastoviglie" },
    { value: "dryer", label: "Asciugatrice" },
    { value: "oven", label: "Forno" },
    { value: "microonde", label: "Microonde" },
    { value: "frigorifero", label: "Frigorifero" },
    { value: "dehumidifier", label: "Deumidificatore" },
    { value: "condizionatore", label: "Condizionatore" },
    { value: "ventilatore", label: "Ventilatore" },
    { value: "boiler", label: "Boiler / scaldabagno" },
    { value: "luce", label: "Luce" },
    { value: "lampada", label: "Lampada" },
    { value: "tv", label: "Televisore" },
    { value: "pc_torre", label: "PC (torre)" },
    { value: "pc_monitor", label: "PC (monitor)" },
    { value: "minipc", label: "Mini PC (Home Assistant)" },
    { value: "presa", label: "Presa smart" },
    { value: "ciabatta", label: "Ciabatta / multipresa" },
    { value: "powerstation", label: "Powerstation" },
    { value: "energy", label: "Contatore della luce" },
    { value: "ups", label: "Gruppo di continuita'" },
    { value: "server", label: "Server" },
    { value: "nas", label: "NAS" },
    { value: "fritzbox", label: "Router" },
    { value: "proxmox", label: "Proxmox" }] } } },
  { name: "g_aspetto", type: "expandable", flatten: true, title: "Aspetto e finestra del pop-up", schema: [
    { name: "layout", selector: { select: { mode: "dropdown", options: [
      { value: "classico", label: "Classico - la foto a sinistra" },
      { value: "centrato", label: "Centrato - la foto in mezzo, i numeri sotto" },
    ] } } },
    { name: "tema", selector: { select: { mode: "dropdown", options: [
      { value: "auto", label: "Automatico - come Home Assistant" },
      { value: "chiaro", label: "Sempre chiaro" },
      { value: "scuro", label: "Sempre scuro" },
    ] } } },
    { name: "notification_path", selector: { text: {} } },
    { name: "finestra_apertura", selector: { select: { mode: "dropdown", options: [
      { value: "sfuma", label: "Sale e sfuma - discreta" },
      { value: "sboccia", label: "Sboccia dal tondino che hai premuto" },
      { value: "basso", label: "Entra dal basso, come un cassetto" },
      { value: "niente", label: "Nessuna animazione" },
    ] } } },
    { name: "finestra_apertura_durata",
      selector: { number: { min: 80, max: 2000, step: 20, mode: "slider", unit_of_measurement: "ms" } } },
    { name: "finestra_largo",
      selector: { number: { min: 400, max: 1400, step: 20, mode: "slider", unit_of_measurement: "px" } } },
    { name: "finestra_immagine", selector: { text: {} } },
    { name: "finestra_sfondo", selector: { color_rgb: {} } },
    { name: "finestra_trasparenza", selector: { number: { min: 0, max: 90, step: 5, mode: "slider", unit_of_measurement: "%" } } },
    { name: "finestra_scritta", selector: { color_rgb: {} } },
    { name: "velo_scuro", selector: { number: { min: 0, max: 100, step: 5, mode: "slider", unit_of_measurement: "%" } } },
    { name: "velo_sfoca", selector: { number: { min: 0, max: 30, step: 1, mode: "slider", unit_of_measurement: "px" } } },
  ] },
];

// Appena apri vedi solo questi tre. Il resto sta in fondo, dietro a "Mostra
// tutte le impostazioni": e' un secondo modulo, cosi' i tre di sopra non si
// muovono e non si perde di vista quello che conta.
const SEMPLICI = ["name", "power_entity", "artwork"];
const SCHEMA_SEMPLICE = SEMPLICI
  .map((n) => SCHEMA_TUTTO.find((x) => x.name === n))
  .filter(Boolean);
// i campi lisci, senza il cassetto dell'ha-form: il cassetto lo faccio io,
// cosi' sta in riga con gli altri riquadri invece di vestirsi da solo
const SCHEMA_RESTO = SCHEMA_TUTTO
  .filter((x) => !SEMPLICI.includes(x.name))
  .flatMap((x) => (Array.isArray(x.schema) ? x.schema : [x]));


// Come si riconosce ogni tendina quando e' chiusa: icona, striscia di colore
// e una riga che dice cosa c'e' dentro. Le stesse regole dell'editor degli
// elettrodomestici: i disegni e il titolo li fa `elettro-righe-editor.js`.
const VESTITO = {
  tariffa: ["contatore", "#2fbfb0", "quanto paghi la luce, voce per voce"],
  contatori: ["contatore", "#7cc4ff", "i kWh della casa, e i costi che ne vengono"],
  tasti: ["accensione", "#43b86a", "le prese e le luci che accendi dalla scheda"],
  righe: ["lista", "#e2ad1c", "quali numeri si vedono nel riquadro, e in che ordine"],
  top: ["tachimetro", "#f06e82", "chi sta consumando di piu' in questo momento"],
  barre: ["barre", "#4fb0d8", "le barre dei circuiti sotto alla scheda"],
  aspetto: ["tavolozza", "#f06e82", "colori, trasparenza e velo della finestrella"],
};

export class CasaEnergiaEditor extends ConEditor(HTMLElement) {
  // i quattro sensori dei conti stanno dentro `periods`: li tiro fuori per
  // nome, cosi' l'ordine nell'elenco non conta
  _periodo(nome) {
    return (this._config.periods || []).find(
      (x) => String(x.label || "").trim().toLowerCase() === nome) || {};
  }

  _datiForm() {
    const c = this._config;
    return { ...c,
      oggi_energia: this._periodo("oggi").energy || "",
      oggi_costo: this._periodo("oggi").cost || "",
      mese_energia: this._periodo("mese").energy || "",
      mese_costo: this._periodo("mese").cost || "",
      finestra_sfondo: this._versoRgb(c.finestra_sfondo),
      finestra_scritta: this._versoRgb(c.finestra_scritta),
      top_auto: c.top_auto !== false && c.top_auto !== undefined ? c.top_auto : false };
  }

  // rimette i quattro sensori dentro periods/periods_prev. "Ieri" e "mese
  // scorso" non sono altri sensori: sono l'attributo last_period di questi.
  _rimettiPeriodi(c, v) {
    const chiavi = ["oggi_energia", "oggi_costo", "mese_energia", "mese_costo"];
    if (!chiavi.some((k) => k in v)) return;
    const val = (k) => (k in v ? v[k] : (this._periodo(k.split("_")[0])[k.split("_")[1] === "energia" ? "energy" : "cost"] || ""));
    const oggiE = val("oggi_energia"), oggiC = val("oggi_costo");
    const meseE = val("mese_energia"), meseC = val("mese_costo");
    const periodi = [];
    if (oggiE || oggiC) periodi.push({ label: "Oggi", energy: oggiE, cost: oggiC });
    if (meseE || meseC) periodi.push({ label: "Mese", energy: meseE, cost: meseC });
    const prima = [];
    if (oggiE || oggiC) prima.push({ label: "Ieri", energy: oggiE, energy_attr: "last_period", cost: oggiC, cost_attr: "last_period" });
    if (meseE || meseC) prima.push({ label: "Mese scorso", energy: meseE, energy_attr: "last_period", cost: meseC, cost_attr: "last_period" });
    // gli altri periodi che l'utente si e' scritto a mano restano dove sono
    const suoi = (c.periods || []).filter((x) => !["oggi", "mese"].includes(String(x.label || "").trim().toLowerCase()));
    const suoiPrima = (c.periods_prev || []).filter((x) => !["ieri", "mese scorso"].includes(String(x.label || "").trim().toLowerCase()));
    if (periodi.length) c.periods = periodi.concat(suoi); else delete c.periods;
    if (prima.length) c.periods_prev = prima.concat(suoiPrima); else delete c.periods_prev;
    ["oggi_energia", "oggi_costo", "mese_energia", "mese_costo"].forEach((k) => delete c[k]);
  }

  _cambiatoForm(v) {
    // le terne del selettore tornano esadecimali
    ["finestra_sfondo", "finestra_scritta"].forEach((k) => {
      if (k in v) v[k] = this._versoHex(v[k]);
    });
    const c = { ...this._config };
    Object.keys(v).forEach((k) => {
      if (v[k] === "" || v[k] === undefined || v[k] === null) delete c[k];
      else c[k] = v[k];
    });
    // gli interruttori del pop-up: la scheda li vuole come {entity, label}
    this._rimettiPeriodi(c, v);
    this._config = c;
    this._emetti();
  }

  _disegnaRighe() {
    if (!this._righe) return;
    disegnaRighe(this._righe, RIGHE_OGGI, this._config, (c) => {
      this._config = c;
      this._emetti();
      this._disegnaRighe();
      this._riassunti();
    });
    { const v = this.querySelector(".ce-barre-vive");
      if (v) v.checked = !!this._config.barre_vive;
      const q = this.querySelector(".ce-barre-quante");
      if (q && !q.dataset.tocco) q.value = this._config.barre_quante || 6;
      this._mostraQuante(); }
    { const sc = this.querySelector(".ce-barra-nuova");
      if (sc && this._hass) {
        sc.hass = this._hass;
        sc.includeDomains = ["sensor"];
        sc.entityFilter = (e) => {
          const id = typeof e === "string" ? e : e.entity_id;
          const a = ((this._hass.states[id] || {}).attributes) || {};
          const u = String(a.unit_of_measurement || "").toLowerCase();
          return a.device_class === "power" && (u === "w" || u === "kw");
        };
      } }
    { const o = this.querySelector(".ce-barre-ordine");
      if (o) o.checked = this._config.barre_in_ordine !== false; }
    this._disegnaCircuiti();
  }

  // i nomi e il fondo scala delle barre dei circuiti
  _disegnaCircuiti() {
    const box = this._circuiti;
    if (!box) return;
    const circ = this._config.circuits || [];
    box.innerHTML = circ.length ? "" : "<div class='ce-aiuto'>Nessun circuito: sceglili qui sopra.</div>";
    circ.forEach((c, k) => {
      const riga = document.createElement("div");
      riga.className = "ce-riga";
      riga.draggable = true;
      riga.innerHTML = `<span class="ce-presa" title="Trascina per spostarla">\u2807</span>`
        + `<span class="ent"></span><input type="text" class="nome"><input type="number" class="max" min="100" step="100" title="Fondo scala (W)"> W`
        + `<button type="button" class="ce-via" title="Togli questa barra">\u00d7</button>`;
      riga.querySelector(".ent").textContent = this._nomeDi(c.entity);
      // trascinare per cambiare l'ordine
      riga.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", String(k));
        riga.classList.add("ce-presa-su");
      });
      riga.addEventListener("dragend", () => riga.classList.remove("ce-presa-su"));
      riga.addEventListener("dragover", (e) => e.preventDefault());
      riga.addEventListener("drop", (e) => {
        e.preventDefault();
        const da = Number(e.dataTransfer.getData("text/plain"));
        if (!Number.isFinite(da) || da === k) return;
        const n = [...(this._config.circuits || [])];
        const [preso] = n.splice(da, 1);
        n.splice(k, 0, preso);
        this._config = { ...this._config, circuits: n };
        this._emetti();
        this._disegnaCircuiti();
      });
      riga.querySelector(".ce-via").addEventListener("click", () => {
        const n = [...(this._config.circuits || [])];
        n.splice(k, 1);
        this._config = { ...this._config, circuits: n };
        this._emetti();
        this._disegnaCircuiti();
      });
      const nome = riga.querySelector(".nome");
      nome.value = c.label || "";
      nome.placeholder = this._nomeDi(c.entity);
      const max = riga.querySelector(".max");
      max.value = c.max || 2500;
      const scrivi = () => {
        const n = [...(this._config.circuits || [])];
        n[k] = { ...n[k], label: nome.value.trim() || this._nomeDi(c.entity), max: Number(max.value) || 2500 };
        this._config = { ...this._config, circuits: n };
        this._emetti();
      };
      nome.addEventListener("change", scrivi);
      max.addEventListener("change", scrivi);
      box.appendChild(riga);
    });
  }

  // la tendina con i sensori dei kWh (energia) che ci sono in casa
  // il prezzo in €/kWh che c'e' gia' in casa: e' lui che comanda
  // la tendina dei prezzi in \u20ac/kWh che hai in casa (il totale per primo:
  // la casa paga tutto compreso, gli elettrodomestici di solito no)
  _disegnaPrezzo() {
    const sel = this.querySelector(".ce-prezzo-ent");
    const campo = this.querySelector(".ce-prezzo");
    if (!sel || !campo) return;
    const elenco = prezziDelKWh(this._hass);
    const scelto = sel.value;
    sel.hidden = !elenco.length;
    campo.hidden = !!elenco.length;
    sel.innerHTML = "";
    elenco.filter((id) => !INGREDIENTE.test(id)).forEach((id) => {
      const st = this._hass.states[id];
      const o = document.createElement("option");
      o.value = id;
      const tutto = Number(st.state) >= 0.20;
      o.textContent = (st.attributes.friendly_name || id) + " \u2014 " + st.state + " \u20ac/kWh"
        + (tutto ? "  (tutto compreso \u2014 questo)" : "  (sola energia)");
      sel.appendChild(o);
    });
    const mio = this._config.prezzo_entita;
    if (scelto && elenco.includes(scelto)) sel.value = scelto;
    else if (mio && elenco.includes(mio)) sel.value = mio;
  }

  // DIVERSA DI PROPOSITO da quella dell'elettrodomestico: per la casa voglio
  // solo contatori in kWh e che siano un totale (total / total_increasing)
  _kWhPossibili() {
    const st = (this._hass && this._hass.states) || {};
    return Object.keys(st).filter((id) => {
      if (!id.startsWith("sensor.")) return false;
      const a = st[id].attributes || {};
      return a.device_class === "energy" && String(a.unit_of_measurement || "").toLowerCase() === "kwh"
        && (a.state_class === "total" || a.state_class === "total_increasing");
    }).sort();
  }

  // I pannelli: va bene sia un sensore in kWh sia uno in Watt (i kWh me li
  // calcolo io). Metto davanti quelli che sembrano solari.
  _disegnaBatteria() {
    const sel = this.querySelector(".ce-batteria-pick");
    if (!sel || !this._hass) return;
    sel.hass = this._hass;
    const st = this._hass.states;
    sel.includeDomains = ["sensor"];
    sel.entityFilter = (e) => {
      const id = typeof e === "string" ? e : e.entity_id;
      const a = (st[id] || {}).attributes || {};
      const u = String(a.unit_of_measurement || "").toLowerCase();
      return (a.device_class === "power" && (u === "w" || u === "kw"))
        || (a.device_class === "energy" && (u === "kwh" || u === "wh"));
    };
    if (!sel._agganciato) {
      sel._agganciato = true;
      sel.addEventListener("value-changed", (ev) => {
        ev.stopPropagation();
        this._scriviScelta("batteria_entita", ev.detail.value || "");
      });
    }
    sel.value = lista(this._config.batteria_entita);
  }

  // Il Top consumo: una riga di parole (separate da virgola) invece di
  // diciotto caselle, piu' due elenchi di prese - una per lasciarle fuori,
  // una per contarle comunque.
  // i tasti: la lista con "Aggiungi" e l'icona di ognuno
  _disegnaTasti() {
    const box = this.querySelector(".ce-tasti");
    if (!box) return;
    disegnaTasti(box, tastiDi(this._config), this._hass, (elenco) => {
      const c = { ...this._config, tasti: elenco };
      // le tre vecchie strade non servono piu': adesso e' una sola
      delete c.interruttore;
      delete c.interruttore_usb;
      delete c.interruttori;
      if (!elenco.length) delete c.tasti;
      this._config = c;
      this._emetti();
      this._disegnaTasti();
      this._riassunti();
    });
  }

  // L'elenco delle prese trovate, con la spunta. Togliere la spunta vuol
  // dire "non contarla": la metto fra quelle da saltare. Rimetterla a una che
  // una parola escluderebbe vuol dire "questa pero' contala": la metto fra
  // quelle da contare sempre, che vincono sulle parole.
  _disegnaPrese() {
    const box = this.querySelector(".ce-prese");
    if (!box || !this._hass) return;
    const auto = this.querySelector(".ce-top-auto");
    if (auto) {
      if (!auto._agganciato) {
        auto._agganciato = true;
        auto.addEventListener("change", () => {
          this._scriviScelta("top_auto", auto.checked);
          this._disegnaPrese();
          this._riassunti();
        });
      }
      auto.checked = this._config.top_auto !== false;
    }
    box.hidden = this._config.top_auto === false;
    const prese = preseDiCasa(this._hass);
    box.innerHTML = "";
    // la scritta della tendina chiusa: quante ne conta su quante ne ha trovate
    const quante = this.querySelector(".ce-quante-prese");
    if (quante) {
      const contate = prese.filter((x) => contaNelTop(this._config, x.entity)).length;
      quante.textContent = T("Prese contate") + ": " + contate + " " + T("su") + " " + prese.length;
    }
    prese.forEach((x) => {
      // il totale della casa non si spunta: conterebbe due volte se stesso
      const casa = x.entity === this._config.power_entity;
      const conta = contaNelTop(this._config, x.entity);
      const riga = document.createElement("label");
      riga.className = "ce-riga ce-presa";
      riga.innerHTML = `<input type="checkbox" ${conta ? "checked" : ""} ${casa ? "disabled" : ""}>
        <span class="chi"></span><span class="dett">${casa ? T("il totale della casa")
          : Math.round(x.w) + " W"}</span>`;
      riga.querySelector(".chi").textContent = x.nome;
      if (!casa) {
        riga.querySelector("input").addEventListener("change", (e) => {
          this._scegliPresa(x.entity, e.target.checked);
        });
      }
      box.appendChild(riga);
    });
    if (!prese.length) {
      box.innerHTML = `<div class="ce-aiuto">${T("Non ho trovato nessuna presa che misuri i Watt.")}</div>`;
    }
    const sceglitore = this.querySelector(".ce-presa-nuova");
    if (sceglitore) {
      sceglitore.hass = this._hass;
      if (!sceglitore._agganciato) {
        sceglitore._agganciato = true;
        sceglitore.includeDomains = ["sensor"];
        sceglitore.addEventListener("value-changed", (ev) => {
          ev.stopPropagation();
          const id = ev.detail.value;
          sceglitore.value = "";
          if (id) this._scegliPresa(id, true);
        });
      }
    }
  }

  _scegliPresa(id, conta) {
    const c = { ...this._config };
    const senza = (k) => (c[k] || []).filter((x) => x !== id);
    if (conta) {
      c.top_exclude_entita = senza("top_exclude_entita");
      c.top_include = senza("top_include");
      // se una parola la escluderebbe, la metto fra quelle da contare sempre
      if (!contaNelTop(c, id)) c.top_include = c.top_include.concat([id]);
    } else {
      c.top_include = senza("top_include");
      c.top_exclude_entita = senza("top_exclude_entita").concat([id]);
    }
    ["top_include", "top_exclude_entita"].forEach((k) => {
      if (!c[k] || !c[k].length) delete c[k];
    });
    this._config = c;
    this._emetti();
    this._disegnaPrese();
  }

  _disegnaPannelli() {
    const sel = this.querySelector(".ce-pannelli-pick");
    if (!sel || !this._hass) return;
    sel.hass = this._hass;
    const st = this._hass.states;
    const buono = (id) => {
      const a = (st[id] || {}).attributes || {};
      const u = String(a.unit_of_measurement || "").toLowerCase();
      return (a.device_class === "power" && (u === "w" || u === "kw"))
        || (a.device_class === "energy" && (u === "kwh" || u === "wh"));
    };
    sel.includeDomains = ["sensor"];
    sel.entityFilter = (e) => buono(typeof e === "string" ? e : e.entity_id);
    if (!sel._agganciato) {
      sel._agganciato = true;
      sel.addEventListener("value-changed", (ev) => {
        ev.stopPropagation();
        this._scriviScelta("pannelli_entita", ev.detail.value || "");
      });
    }
    sel.value = lista(this._config.pannelli_entita);
  }

  _disegnaKwh() {
    const sel = this.querySelector(".ce-kwh-pick");
    if (!sel) return;
    if (this._hass) sel.hass = this._hass;
    const buoni = this._kWhPossibili();
    sel.includeDomains = ["sensor"];
    sel.entityFilter = (e) => buoni.includes(typeof e === "string" ? e : e.entity_id);
    if (!sel._agganciato) {
      sel._agganciato = true;
      sel.addEventListener("value-changed", (ev) => {
        ev.stopPropagation();
        this._scriviScelta("energia_kwh", ev.detail.value || "");
      });
    }
    const mio = this._config.energia_kwh;
    const dallaPresa = String(this._config.power_entity || "")
      .replace(/_power$/, "_energy").replace(/_potenza$/, "_energia");
    sel.value = mio || (buoni.includes(dallaPresa) ? dallaPresa : "");
  }

  // i campi della tariffa partono da quello che gli aiutanti dicono adesso:
  // cosi' vedi il prezzo che stai usando e lo puoi riscrivere a mano
  _disegnaTariffa() {
    VOCI_TARIFFA.forEach((v) => {
      const campo = this.querySelector(".ce-t-" + v.chiave);
      if (!campo || campo.dataset.tocco) return;
      const st = this._hass && this._hass.states[idDellaVoce(this._hass, v)];
      if (st && !["unknown", "unavailable"].includes(st.state)) campo.value = Number(st.state);
      campo.addEventListener("input", () => { campo.dataset.tocco = "1"; }, { once: true });
    });
    this._totaleTariffa();
  }

  // quello che si legge su ogni tendina CHIUSA, senza doverla aprire
  _riassunti() {
    const metti = (sel, testo) => {
      const x = this.querySelector(sel + " .ce-riassunto");
      if (x) x.textContent = testo ? " \u00b7 " + testo : "";
    };
    const t = (this.querySelector(".ce-t-totale") || {}).textContent || "";
    metti(".ce-sez-tariffa", t && t !== "\u2014" ? t : "");
    const quanti = (this._config.periods || []).filter((x) => x && x.energy).length;
    metti(".ce-sez-contatori", quanti ? quanti + " " + T(quanti === 1 ? "agganciato" : "agganciati") : T("da fare"));
    const tasti = tastiDi(this._config).length;
    metti(".ce-sez-tasti", tasti ? tasti + " " + T(tasti === 1 ? "tasto" : "tasti") : T("nessuno"));
    // le righe accese: dalla configurazione, non dal disegno (il disegno
    // potrebbe non esserci ancora)
    const accese = Array.isArray(this._config.righe)
      ? this._config.righe.length : RIGHE_OGGI.length;
    metti(".ce-sez-righe", accese + " " + T(accese === 1 ? "accesa" : "accese"));
    if (this._hass) {
      const prese = preseDiCasa(this._hass);
      const contate = prese.filter((x) => contaNelTop(this._config, x.entity)).length;
      metti(".ce-sez-top", this._config.top_auto === false ? T("spento")
        : contate + " " + T("su") + " " + prese.length);
    }
    const barre = this._config.barre_vive
      ? T("le piu' accese") : ((this._config.circuits || []).length + " "
        + T((this._config.circuits || []).length === 1 ? "barra" : "barre"));
    metti(".ce-sez-barre", barre);
  }

  _totaleTariffa() {
    const n = (c) => Number((this.querySelector(".ce-t-" + c) || {}).value) || 0;
    const t = this.querySelector(".ce-t-totale");
    if (!t) return 0;
    const v = Math.round((n("energia") + n("rete") + n("accise")) * (1 + n("iva") / 100) * 10000) / 10000;
    t.textContent = v ? v.toFixed(4) + " \u20ac/kWh" : "\u2014";
    this._riassunti();
    return v;
  }

  async _scriviTariffa() {
    const esito = this._esito;
    if (esito) { esito.hidden = false; esito.classList.remove("male"); }
    const n = (c) => Number((this.querySelector(".ce-t-" + c) || {}).value);
    esito.hidden = false;
    esito.classList.remove("male");
    esito.textContent = "";
    const dillo = (t) => { esito.textContent += (esito.textContent ? "\n" : "") + t; };
    if (!(n("energia") > 0)) {
      esito.classList.add("male");
      esito.textContent = "Scrivi almeno il prezzo dell'energia.";
      return;
    }
    try {
      await scriviTariffa(this._hass, { energia: n("energia"), rete: n("rete"), accise: n("accise"), iva: n("iva"), quota: n("quota") }, dillo);
      dillo("Fatto: adesso tutte le schede leggono questi prezzi.");
      this._disegnaPrezzo();
    } catch (e) {
      esito.classList.add("male");
      dillo("Non ce l'ho fatta: " + (e && e.message ? e.message : e));
    }
  }

  // Le quattro barre proposte guardando la casa: sensori di potenza veri,
  // senza le parole che escludono (le stesse del "top consumo").
  // con "le piu' accese" l'elenco a mano non serve: lo nascondo
  _mostraQuante() {
    const acceso = !!(this.querySelector(".ce-barre-vive") || {}).checked;
    const q = this.querySelector(".ce-quante");
    if (q) q.hidden = !acceso;
    [".ce-barra-nuova", ".ce-barre-ordine", ".ce-barre-auto", ".ce-circuiti"].forEach((sel) => {
      const el = this.querySelector(sel);
      const riga = el && (el.closest(".ce-riga") || el);
      if (riga) riga.style.display = acceso ? "none" : "";
    });
  }

  _proponiBarre() {
    // le quattro prese piu' accese, con la stessa ricerca del Top consumo
    const buoni = preseDiCasa(this._hass)
      .filter((x) => contaNelTop(this._config, x.entity))
      .slice(0, 4);
    if (!buoni.length) {
      this._dillo("Non ho trovato prese che misurino i Watt.", true);
      return;
    }
    const scala = (w) => Math.min(3500, Math.max(500, Math.ceil((w || 0) * 1.3 / 500) * 500));
    this._config = { ...this._config,
      circuits: buoni.map((x) => ({ label: x.nome, entity: x.entity, max: scala(x.w) })) };
    this._emetti();
    this._disegnaCircuiti();
    this._dillo("Messe " + buoni.length + " barre: " + buoni.map((x) => x.nome).join(", ")
      + ". Nome e fondo scala si cambiano qui sotto.");
  }

  async _creaSensori() {
    const tasto = this.querySelector(".ce-crea");
    const sorgente = (this.querySelector(".ce-kwh-pick") || {}).value || this._config.energia_kwh;
    if (!sorgente) { this._dillo("Scegli il sensore dei kWh.", true); return; }
    // la conferma la chiede il tasto: premilo due volte
    if (!confermaDoppia(tasto, T("Creo i contatori: premi di nuovo"))) return;
    tasto.disabled = true;
    this._esito.hidden = false;
    this._esito.classList.remove("male");
    this._esito.textContent = "";
    try {
      const patch = await creaSensoriBase(this._hass, {
        sorgente,
        memoria: this._config.helper_memoria || {},
        // il prezzo e' quello della tariffa qui sopra: per la casa vale il TOTALE,
        // che e' quello che paghi davvero in bolletta
        prezzo_entita: (this._hass.states[ID_TOTALE] ? ID_TOTALE : prezzoDellaCasa(this._hass))
          || this._config.prezzo_entita,
        prezzo: this._totaleTariffa(),
      }, (t) => this._dillo(t));
      this._config = { ...this._config, ...patch };
      // la memoria dei valori, se e' stata usata, si butta (patch la mette a null)
      if (patch.helper_memoria === null) delete this._config.helper_memoria;
      this._emetti();
      this._form.data = this._datiForm();
    if (this._formTutto) this._formTutto.data = this._datiForm();
      // i kWh delle due fonti: pannelli e batteria
      for (const [chiave, sel, nome] of [["pannelli", ".ce-pannelli-pick", "Pannelli energia"],
        ["batteria", ".ce-batteria-pick", "Batteria energia"]]) {
        const ent = lista((this.querySelector(sel) || {}).value || this._config[chiave + "_entita"]);
        if (!ent.length) continue;
        const p = await creaFonte(this._hass, { entita: ent, nome }, (t) => this._dillo(t));
        this._config = { ...this._config, [chiave + "_oggi"]: p.oggi,
          [chiave + "_settimana"]: p.settimana, [chiave + "_mese"]: p.mese,
          [chiave + "_entita"]: ent };
        this._emetti();
      }
      const pannelli = (this.querySelector(".ce-pannelli-pick") || {}).value || this._config.pannelli_entita;
      if (pannelli) {
        const piu = await creaRisparmio(this._hass, {
          pannelli,
          prezzo_entita: this._hass.states[ID_TOTALE] ? ID_TOTALE : prezzoDellaCasa(this._hass),
        }, (t) => this._dillo(t));
        this._config = { ...this._config, ...piu, pannelli_entita: pannelli };
        this._emetti();
      }
      this._dillo("La scheda e' agganciata ai sensori nuovi. Salva e chiudi.");
    } catch (e) {
      this._dillo("Non ce l'ho fatta: " + (e && e.message ? e.message : e), true);
    }
    tasto.disabled = false;
  }

  _disegna() {
    if (!this._costruito) {
      this._costruito = true;
      this.innerHTML = `<style>${STILE_EDITOR}</style>` + TH(`<div class="ce-versione">casa-energia \u00b7 casa-tile v${VERSIONE}</div>
        <div class="ce-form"></div>
        <details class="ce-sez ce-tendina ce-sez-tariffa" data-c="1" style="--c:#2fbfb0">
          <summary class="ce-tit">${titoloSez(VESTITO.tariffa, T("La tua tariffa"))}</summary>
          <div class="ce-aiuto">${T("Scrivi i prezzi come stanno in bolletta: il totale lo faccio io. Si scrive qui una volta sola - gli apparecchi, le prese e le luci lo leggono da qui.")}</div>
          <div class="ce-riga"><span class="ent">Energia &euro;/kWh</span><input type="number" class="ce-t-energia max" step="0.0001" min="0" placeholder="0.1657"></div>
          <div class="ce-riga"><span class="ent">Rete e oneri &euro;/kWh</span><input type="number" class="ce-t-rete max" step="0.0001" min="0" placeholder="0.045"></div>
          <div class="ce-riga"><span class="ent">Accise &euro;/kWh</span><input type="number" class="ce-t-accise max" step="0.0001" min="0" placeholder="0.0093"></div>
          <div class="ce-riga"><span class="ent">IVA %</span><input type="number" class="ce-t-iva max" step="1" min="0" placeholder="10"></div>
          <div class="ce-riga"><span class="ent">Quota fissa &euro; al giorno</span><input type="number" class="ce-t-quota max" step="0.0001" min="0" placeholder="0.542"></div>
          <div class="ce-riga"><span class="ent">Totale della bolletta</span><b class="ce-t-totale">&mdash;</b></div>
          <button type="button" class="ce-prepara ce-scrivi-tariffa">Scrivi la tariffa</button>
        </details>
        <details class="ce-sez ce-tendina ce-sez-contatori" data-c="1" style="--c:#7cc4ff">
          <summary class="ce-tit">${titoloSez(VESTITO.contatori, T("I contatori"))}</summary>
          <div class="ce-aiuto">${T("Dimmi da quale sensore dei kWh parte la casa e faccio io il resto: i contatori di ora, oggi, settimana, mese e ieri, e il costo di ognuno. Quelli che ci sono gia' li riuso.")}</div>
          <div class="ce-riga"><span class="ent">Sensore dei kWh</span><ha-entity-picker class="ce-kwh-pick" allow-custom-entity></ha-entity-picker></div>
          <div class="ce-aiuto">${T("Pannelli e batteria sono facoltativi: se li metti faccio anche i loro kWh di oggi e del mese, e le righe <i>Dai pannelli</i> e <i>Dalla batteria</i>. Della batteria scegli il sensore che dice <b>quanto ha dato alla casa</b>, non la percentuale.")}</div>
          <div class="ce-riga"><span class="ent">Sensore dei pannelli (se ce l'hai)</span><ha-entities-picker class="ce-pannelli-pick"></ha-entities-picker></div>
          <button type="button" class="ce-prepara ce-pannelli-tutti">Prendile tutte</button>
          <div class="ce-riga"><span class="ent">Sensore della batteria (se ce l'hai)</span><ha-entities-picker class="ce-batteria-pick"></ha-entities-picker></div>
          <button type="button" class="ce-prepara ce-batteria-tutti">Prendile tutte</button>
          <button type="button" class="ce-prepara ce-crea">Crea contatori e costi</button>
          <button type="button" class="ce-prepara ce-cancella">Cancella gli aiutanti di questa scheda</button>
        </details>
        <div class="ce-esito" hidden></div>
        <label class="ce-riga ce-tutto-riga"><input type="checkbox" class="ce-tutto">
          <span>Mostra altre impostazioni</span></label>
        <div class="ce-avanzate" hidden>
          <details class="ce-sez ce-tendina ce-sez-tasti" data-c="1" style="--c:#43b86a">
            <summary class="ce-tit">${titoloSez(VESTITO.tasti, T("Tasti di accensione"))}</summary>
            <div class="ce-aiuto">${T("Ogni tasto e' un tondino nella barra in alto della scheda: premuto accende o spegne, e resta verde finche' e' acceso. Aggiungi quello che vuoi - una presa, una luce, una ventola - e scegli la sua icona.")}</div>
            <div class="ce-tasti"></div>
          </details>
          <details class="ce-sez ce-tendina ce-sez-righe" data-c="1" style="--c:#e2ad1c">
            <summary class="ce-tit">${titoloSez(VESTITO.righe, T("Righe del riquadro \u00abOggi\u00bb"))}</summary>
            <div class="ce-aiuto">${T("Spunta quelle da vedere e trascinale dalla maniglia \u283f per metterle in ordine. Nome e colore sono facoltativi (vuoto = quelli di serie).")}</div>
            <div class="ce-righe"></div>
          </details>
          <details class="ce-sez ce-tendina ce-sez-top" data-c="1" style="--c:#f06e82">
            <summary class="ce-tit">${titoloSez(VESTITO.top, T("Top consumo"))}</summary>
            <div class="ce-aiuto">${T("La riga che dice chi sta consumando di piu' in questo momento.")}</div>
            <label class="ce-riga"><input type="checkbox" class="ce-top-auto">
              <span>${T("Cerca da sola tutte le prese che misurano")}</span></label>
            <div class="ce-aiuto">${T("Queste sono quelle che ha trovato: togli la spunta a quelle che non vuoi contare.")}</div>
            <div class="ce-prese"></div>
            <div class="ce-riga"><span class="ent">${T("Non l'ha trovata? Aggiungila")}</span><ha-entity-picker class="ce-presa-nuova" allow-custom-entity></ha-entity-picker></div>
          </details>
          <details class="ce-sez ce-tendina ce-sez-barre" data-c="1" style="--c:#4fb0d8">
            <summary class="ce-tit">${titoloSez(VESTITO.barre, T("Le barre sotto la scheda"))}</summary>
            <div class="ce-aiuto">${T("Se non sai quali mettere, <b>Proponi da solo</b> guarda le prese di casa e ti mette le quattro che consumano di piu'.")}</div>
            <button type="button" class="ce-prepara ce-barre-auto">Proponi da solo</button>
            <div class="ce-riga"><span class="ent">Aggiungi una barra</span><ha-entity-picker class="ce-barra-nuova" allow-custom-entity></ha-entity-picker></div>
            <label class="ce-riga"><input type="checkbox" class="ce-barre-vive">
              <span>${T("<b>Scegli le barre da sola</b>: fa vedere le prese piu' accese del momento. Se parte il forno, il forno compare. L'elenco qui sotto non serve piu'.")}</span></label>
            <div class="ce-riga ce-quante" hidden><span class="ent">Quante barre</span>
              <input type="number" class="ce-barre-quante max" min="2" max="10" step="1" value="6"></div>
            <label class="ce-riga"><input type="checkbox" class="ce-barre-ordine" checked>
              <span>Mettile in fila da sole, la piu' accesa in cima (se la togli resta l'ordine di qui sotto)</span></label>
            <div class="ce-circuiti"></div>
            <div class="ce-riga"><span class="ent">${T("Fondo scala di serie (W)")}</span>
              <input type="number" class="ce-barre-max max" min="500" max="30000" step="100" placeholder="4500"></div>
            <div class="ce-aiuto">${T("Quanto vale la barra piena, per le barre che non hanno un fondo scala loro.")}</div>
          </details>
          <details class="ce-sez ce-tendina" data-c="1" style="--c:#f06e82"><summary class="ce-tit">${titoloSez(VESTITO.aspetto, T("Aspetto e finestra del pop-up"))}</summary>
            <div class="ce-form-tutto"></div>
          </details>
        </div>`);
      // due moduli: quello di sopra ha sempre e solo i tre campi che contano,
      // quello di sotto tutto il resto e si vede solo con la spunta
      const faiModulo = (schema, dove) => {
        const f = document.createElement("ha-form");
        f.schema = traduciSchema(schema);
        f.computeLabel = (x) => T(x.title || ETICHETTE[x.name] || x.name);
        f.computeHelper = (x) => T(AIUTI[x.name] || "");
        f.addEventListener("value-changed", (e) => {
          e.stopPropagation();
          this._cambiatoForm(e.detail.value || {});
        });
        this.querySelector(dove).appendChild(f);
        return f;
      };
      const form = faiModulo(SCHEMA_SEMPLICE, ".ce-form");
      const formTutto = faiModulo(SCHEMA_RESTO, ".ce-form-tutto");
      this._avanzate = this.querySelector(".ce-avanzate");
      const spunta = this.querySelector(".ce-tutto");
      if (spunta) {
        spunta.checked = !!this._tutto;
        this._avanzate.hidden = !this._tutto;
        spunta.addEventListener("change", () => {
          this._tutto = spunta.checked;
          this._avanzate.hidden = !this._tutto;
          formTutto.data = this._datiForm();
        });
      }
      this._form = form;
      this._formTutto = formTutto;
      this._righe = this.querySelector(".ce-righe");
      this._circuiti = this.querySelector(".ce-circuiti");
      this._esito = this.querySelector(".ce-esito");
      this.querySelector(".ce-crea").addEventListener("click", () => this._creaSensori());
      this.querySelector(".ce-scrivi-tariffa").addEventListener("click", () => this._scriviTariffa());
      this.querySelector(".ce-barre-auto").addEventListener("click", () => this._proponiBarre());
      [["pannelli", /solar|fotovolt|pv/i], ["batteria", /discharg|scaric/i]].forEach(([chi, come]) => {
        const b = this.querySelector(".ce-" + chi + "-tutti");
        if (!b) return;
        b.addEventListener("click", () => {
          const st = (this._hass || {}).states || {};
          const trovati = Object.keys(st).filter((id) => {
            const a = st[id].attributes || {};
            const u = String(a.unit_of_measurement || "").toLowerCase();
            return id.startsWith("sensor.") && a.device_class === "energy"
              && (u === "kwh" || u === "wh") && come.test(id)
              && !/_returned|restituit|forecast|previs/i.test(id);
          });
          if (!trovati.length) {
            window.alert("Non ho trovato contatori che sembrino " + chi + ".");
            return;
          }
          this._scriviScelta(chi + "_entita", trovati);
          const sel = this.querySelector(".ce-" + chi + "-pick");
          if (sel) sel.value = trovati;
          window.alert("Presi " + trovati.length + ":\n" + trovati.join("\n")
            + "\n\nSe ne aggiungi un altro in futuro, torna qui e ripremi.");
        });
      });
      const scegli = this.querySelector(".ce-barra-nuova");
      if (scegli) {
        scegli.addEventListener("value-changed", (ev) => {
          ev.stopPropagation();
          const id = ev.detail.value;
          if (!id) return;
          const n = [...(this._config.circuits || [])];
          if (!n.some((x) => x.entity === id)) {
            const w = Number((this._hass.states[id] || {}).state) || 0;
            n.push({ label: this._nomeDi(id), entity: id,
              max: Math.min(3500, Math.max(500, Math.ceil(w * 1.3 / 500) * 500)) });
            this._config = { ...this._config, circuits: n };
            this._emetti();
            this._disegnaCircuiti();
          }
          scegli.value = "";
        });
      }
      const vive = this.querySelector(".ce-barre-vive");
      if (vive) {
        vive.addEventListener("change", () => {
          this._scriviScelta("barre_vive", vive.checked ? true : "");
          this._mostraQuante();
        });
      }
      const quante = this.querySelector(".ce-barre-quante");
      if (quante) {
        quante.addEventListener("change", () =>
          this._scriviScelta("barre_quante", Number(quante.value) || 6));
      }
      const ordine = this.querySelector(".ce-barre-ordine");
      if (ordine) {
        ordine.addEventListener("change", () =>
          this._scriviScelta("barre_in_ordine", ordine.checked ? "" : false));
      }
      this.querySelector(".ce-cancella").addEventListener("click", () => this._cancellaSensori());
      this.querySelectorAll(".ce-t-energia, .ce-t-rete, .ce-t-accise, .ce-t-iva, .ce-t-quota").forEach((x) =>
        x.addEventListener("input", () => this._totaleTariffa()));
    }
    if (this._hass) this._form.hass = this._hass;
    this._disegnaKwh();
    this._riassunti();
    this._disegnaTasti();
    this._disegnaPrese();
    this._disegnaPannelli();
    this._disegnaBatteria();
    this._disegnaPrezzo();
    this._disegnaTariffa();
    this._form.data = this._datiForm();
    if (this._formTutto) this._formTutto.data = this._datiForm();
    this._disegnaRighe();
  }
}
