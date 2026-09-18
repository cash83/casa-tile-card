// Prepara da solo il pop-up con la scheda grande (casa-energia o
// casa-elettrodomestico) partendo dall'entita' della casella.
// Lo usa l'editor quando nel Tocco si sceglie "Apri la scheda
// elettrodomestico" o "Apri la scheda energia": la scelta diventa un
// normale "Apri un pop-up mio" con dentro la scheda gia' compilata, cosi'
// poi si ritocca a clic come tutte le altre schede del pop-up.

import { DEFAULT_STATE_MAP } from './elettro-comune.js';

// Quello che NON e' un consumo di casa: produzione, batterie, inverter...
// Vale per il "Top consumo" automatico quando la scheda non dice altro.
export const ESCLUSI_DI_SERIE = [
  "fotovoltaico", "inverter", "opendtu", "solar", "solare", "_pv", "pv_",
  "battery", "batteria", "grid", "power_production", "produzione",
  "landbook", "hub_1200", "ace_1500", "ab1000", "zendure_manager",
  "test_powerstation", "presa_ha_", "mamma_",
];

// Stati scritti in italiano dalle integrazioni (es. LG in LAN), oltre a
// quelli inglesi che la scheda conosce gia' da sola.
const STATI_ITALIANI = {
  "Spenta": { mode: "off", label: "SPENTA" },
  "Spento": { mode: "off", label: "SPENTO" },
  "Online": { mode: "off", label: "PRONTA" },
  "Pronta": { mode: "off", label: "PRONTA" },
  "In attesa": { mode: "standby", label: "IN ATTESA" },
  "In pausa": { mode: "standby", label: "IN PAUSA" },
  "In funzione": { mode: "running", label: "IN FUNZIONE" },
  "Fine ciclo": { mode: "off", label: "TERMINATO" },
  "Terminato": { mode: "off", label: "TERMINATO" },
  "unavailable": { mode: "unavailable", label: "N/D" },
};

const DISEGNI = [
  ["dishwasher", ["lavastovigli", "dishwasher"]],
  // la lavatrice prima: "lavASCIUGA" contiene "asciuga"
  ["washer", ["lavatric", "lavasciug", "washer", "lavaggio"]],
  ["dryer", ["asciugatric", "dryer", "asciuga"]],
  ["oven", ["forno", "oven", "fornell"]],
  ["tv", ["tv", "televisor"]],
  ["boiler", ["boiler", "scaldabagn", "caldaia"]],
];

const pulisci = (s) => String(s || "").toLowerCase()
  .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  .replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");

function disegnoDi(cfg) {
  const testo = [cfg.icona, cfg.name, cfg.entity].map(pulisci).join(" ");
  for (const [disegno, parole] of DISEGNI) {
    if (parole.some((p) => testo.includes(p))) return disegno;
  }
  return "washer";
}

// le altre entita' dello stesso dispositivo (hass.entities ha device_id)
function fratelli(hass, eid) {
  const reg = (hass && hass.entities) || {};
  const dev = reg[eid] && reg[eid].device_id;
  if (!dev) return [];
  return Object.keys(reg).filter((k) => k !== eid && reg[k].device_id === dev);
}

function classe(hass, eid) {
  const st = hass && hass.states && hass.states[eid];
  return st ? (st.attributes || {}).device_class : undefined;
}

// La presa che misura: l'entita' stessa se e' in Watt, se no una sorella
// dello stesso dispositivo che lo sia.
function potenzaDi(hass, eid) {
  if (!eid) return null;
  if (classe(hass, eid) === "power") return eid;
  return fratelli(hass, eid).find((k) => k.startsWith("sensor.") && classe(hass, k) === "power") || null;
}

// I sensori del ciclo li chiamo <nome>_ciclo, <nome>_cicli_oggi e
// <nome>_cicli_mese: li cerco col nome della casella, parola per parola.
function cicloDi(hass, cfg) {
  const st = (hass && hass.states) || {};
  const nomi = new Set();
  const n = pulisci(cfg.name);
  if (n) nomi.add(n);
  n.split("_").filter((p) => p.length > 3).forEach((p) => nomi.add(p));
  const obj = String(cfg.entity || "").split(".")[1] || "";
  if (obj) nomi.add(obj.split("_")[0]);
  for (const k of nomi) {
    if (st[`sensor.${k}_ciclo`]) return k;
  }
  return null;
}

export function preparaElettrodomestico(hass, cfg) {
  const scheda = {
    type: "custom:casa-elettrodomestico",
    name: cfg.name || "Elettrodomestico",
    artwork: disegnoDi(cfg),
  };
  const potenza = potenzaDi(hass, cfg.entity);
  if (potenza) {
    scheda.power_entity = potenza;
    scheda.max_power = scheda.artwork === "dishwasher" ? 2200 : 2500;
    scheda.threshold_run = scheda.artwork === "oven" ? 100 : 10;
    scheda.threshold_standby = 1;
  } else {
    // niente presa che misura (es. l'asciugatrice LG): la barra fa vedere
    // l'entita' della casella cosi' com'e', e lo stato lo prende da li'
    scheda.live = { state_entity: cfg.entity };
    scheda.state_map = { ...DEFAULT_STATE_MAP, ...STATI_ITALIANI };
    const residuo = fratelli(hass, cfg.entity)
      .find((k) => k.startsWith("sensor.") && /residu|remaining|rimanent/.test(k));
    if (residuo) {
      scheda.power_entity = residuo;
      scheda.power_label = "Tempo residuo";
      scheda.power_unit = "min";
      scheda.power_decimals = 0;
      scheda.max_power = 180;
    } else {
      scheda.power_entity = cfg.entity;
    }
  }
  const k = cicloDi(hass, cfg);
  if (k) {
    scheda.cycle_sensor = `sensor.${k}_ciclo`;
    scheda.cycle_attrs = { end: "terminato", duration: "tempo_ciclo", energy: "consumo_ciclo", cost: "costo_ciclo" };
    scheda.period_attrs = {
      today: { time: "tempo_oggi", cost: "costo_oggi" },
      yesterday: { time: "tempo_ieri", cost: "costo_ieri" },
      month: { time: "tempo_mese", cost: "costo_mese" },
      month_prev: { time: "tempo_mese_prec", cost: "costo_mese_prec" },
    };
    scheda.stats = { cycles_today: `sensor.${k}_cicli_oggi`, cycles_month: `sensor.${k}_cicli_mese` };
  }
  return scheda;
}

export function preparaEnergia(hass, cfg) {
  const st = (hass && hass.states) || {};
  const scheda = {
    type: "custom:casa-energia",
    name: cfg.name || "Energia Casa",
    power_entity: potenzaDi(hass, cfg.entity) || cfg.entity,
    max_power: 3300,
    top_auto: true,
    top_min_w: 5,
    unmeasured_label: "Non misurato",
  };
  // periodi: se ci sono i contatori e i costi della casa, li aggancio
  const periodi = [["Ora", "ora"], ["Oggi", "oggi"], ["Settimana", "settimana"], ["Mese", "mese"]]
    .map(([label, k]) => ({ label, energy: `sensor.casa_totale_casa_rete_${k}`, cost: `sensor.costo_energia_${k}` }));
  if (periodi.every((p) => st[p.energy])) {
    scheda.periods = periodi;
    scheda.periods_prev = [{ label: "Ieri", energy: "sensor.casa_totale_casa_rete_oggi", energy_attr: "last_period", cost: "sensor.costo_energia_ieri" }];
  }
  if (st["input_number.prezzo_energia"]) {
    const righe = [{ entity: "input_number.prezzo_energia", label: "Prezzo energia (€/kWh)" }];
    if (st["input_number.quota_fissa_energia_giorno"]) {
      righe.push({ entity: "input_number.quota_fissa_energia_giorno", label: "Quota fissa (€/giorno)" });
    }
    scheda.settings_sections = [{ title: "Costi", rows: righe }];
  }
  return scheda;
}

// Dall'editor: "elettrodomestico"/"energia" diventano un pop-up vero.
// Se nel pop-up c'e' gia' una scheda dello stesso tipo la sostituisco,
// il resto (grafici messi a mano) resta dov'e'.
export function inFinestra(hass, cfg) {
  const scheda = cfg.azione === "energia" ? preparaEnergia(hass, cfg) : preparaElettrodomestico(hass, cfg);
  const altre = (cfg.finestra_cards || []).filter((c) => !c || c.type !== scheda.type);
  const c2 = { ...cfg, azione: "finestra", finestra_cards: [scheda, ...altre] };
  if (!c2.finestra_titolo && cfg.name) c2.finestra_titolo = cfg.name;
  return c2;
}
