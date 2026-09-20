// Il tasto "Crea i sensori base" dell'editor di casa-energia.
//
// Crea in Home Assistant, al posto tuo, la parte noiosa: i contatori
// (ora/oggi/settimana/mese) sopra al sensore dei kWh della casa e i sensori del
// costo di ogni periodo, piu' il prezzo in euro al kWh. Sono gli stessi helper
// che faresti a mano da Impostazioni > Dispositivi e servizi > Helper: stanno
// in .storage, quindi entrano nel backup e da li' si cancellano.
//
// Quello che questa scorciatoia NON fa: il conto voce per voce, i cicli degli
// elettrodomestici, il risparmio del fotovoltaico. Quella roba vuole i template
// a trigger e le macro, e resta nella guida (esempi/luce).
//
// Chi c'e' gia' non si tocca: riconosco i miei helper dal NOME della voce di
// configurazione (il contatore non dice piu' da quale sensore nasce, quindi
// l'attributo "source" non si puo' guardare), e se lo trovo lo riuso.

const PERIODI = [
  ["Ora", "ora", "hourly"],
  ["Oggi", "oggi", "daily"],
  ["Settimana", "settimana", "weekly"],
  ["Mese", "mese", "monthly"],
];

// il nome del sensore, senza la coda "energia"/"totale"
function nomeSorgente(hass, eid) {
  const st = hass.states[eid];
  const n = st ? String(st.attributes.friendly_name || eid) : eid;
  return n.replace(/\s+(energia|energy|totale|total)\s*$/i, "").replace(/\s{2,}/g, " ").trim() || "Casa";
}

// tutte le voci di configurazione (helper compresi): WebSocket, e se non va, REST
async function vociDiConfigurazione(hass) {
  try {
    return await hass.callWS({ type: "config_entries/get" });
  } catch (e) {
    return await hass.callApi("GET", "config/config_entries/entry");
  }
}

// da voce di configurazione a entita': serve il registro
async function registro(hass) {
  return hass.callWS({ type: "config/entity_registry/list" });
}

function entitaDellaVoce(reg, idVoce) {
  const v = reg.find((e) => e.config_entry_id === idVoce);
  return v ? v.entity_id : null;
}

// apre un flusso di configurazione e lo porta fino in fondo
async function flusso(hass, handler, passi) {
  let r = await hass.callApi("POST", "config/config_entries/flow",
    { handler, show_advanced_options: true });
  for (const dati of passi) {
    if (r.type === "create_entry" || r.type === "abort") break;
    r = await hass.callApi("POST", "config/config_entries/flow/" + r.flow_id, dati);
  }
  if (r.type !== "create_entry") {
    const perche = (r.errors && JSON.stringify(r.errors)) || r.reason || r.type || "?";
    throw new Error("Home Assistant non ha creato l'helper (" + perche + ")");
  }
  return (r.result && (r.result.entry_id || r.result)) || null;
}

async function creaContatore(hass, nome, sorgente, ciclo) {
  return flusso(hass, "utility_meter", [{
    name: nome, source: sorgente, cycle: ciclo, offset: 0, tariffs: [],
    net_consumption: false, delta_values: false, periodically_resetting: true,
    always_available: true,
  }]);
}

async function creaCosto(hass, nome, stato) {
  // il flusso dei template parte da un menu: prima dico che voglio un sensore
  return flusso(hass, "template", [
    { next_step_id: "sensor" },
    { name: nome, state: stato, unit_of_measurement: "€", device_class: "monetary", state_class: "total" },
  ]);
}

/**
 * Crea (o ritrova) contatori e costi. `dillo(testo)` racconta cosa sta facendo.
 * Torna il pezzo di configurazione da mettere nella scheda.
 */
export async function creaSensoriBase(hass, opzioni, dillo) {
  const sorgente = opzioni.sorgente;
  if (!sorgente || !hass.states[sorgente]) throw new Error("Scegli il sensore dei kWh della casa.");
  const base = nomeSorgente(hass, sorgente);
  const conto = { creati: 0, riusati: 0 };

  let voci = await vociDiConfigurazione(hass);
  let reg = await registro(hass);
  // cerca una voce di configurazione gia' fatta, per dominio e nome
  const gia = (dominio, nome) => {
    const v = voci.find((x) => x.domain === dominio
      && String(x.title || "").toLowerCase() === nome.toLowerCase());
    return v ? entitaDellaVoce(reg, v.entry_id) : null;
  };

  // 1. il prezzo in euro al kWh
  let prezzo = Object.keys(hass.states).find((id) => id.startsWith("input_number.")
    && String(hass.states[id].attributes.unit_of_measurement || "").replace(/\s/g, "") === "€/kWh");
  if (prezzo) {
    dillo("Prezzo: uso quello che c'era gia' (" + prezzo + ").");
    conto.riusati++;
  } else {
    dillo("Creo il prezzo in €/kWh...");
    await hass.callWS({
      type: "input_number/create", name: "Prezzo energia", min: 0, max: 5, step: 0.001,
      mode: "box", unit_of_measurement: "€/kWh", icon: "mdi:currency-eur",
    });
    prezzo = "input_number.prezzo_energia";
    conto.creati++;
    const v = Number(opzioni.prezzo);
    if (Number.isFinite(v) && v > 0) {
      try {
        await hass.callService("input_number", "set_value", { entity_id: prezzo, value: v });
      } catch (e) { dillo("Il prezzo lo scrivi tu nel pop-up della scheda."); }
    }
  }

  // 2. i contatori: uno per periodo
  const contatori = {};
  const nuovi = [];
  for (const [etichetta, chiave, ciclo] of PERIODI) {
    const nome = base + " " + chiave;
    const vecchio = gia("utility_meter", nome);
    if (vecchio) {
      contatori[chiave] = vecchio;
      conto.riusati++;
      dillo(etichetta + ": c'era gia' (" + vecchio + ").");
    } else {
      dillo("Creo il contatore di " + etichetta.toLowerCase() + "...");
      nuovi.push([chiave, await creaContatore(hass, nome, sorgente, ciclo)]);
      conto.creati++;
    }
  }
  if (nuovi.length) {
    reg = await registro(hass);
    nuovi.forEach(([chiave, id]) => {
      const e = entitaDellaVoce(reg, id);
      if (e) contatori[chiave] = e;
    });
  }

  // 3. i costi: i kWh del periodo per il prezzo
  const costi = {};
  const nuoviCosti = [];
  const perPrezzo = (entita) => "{{ (states('" + entita + "') | float(0) * states('"
    + prezzo + "') | float(0)) | round(2) }}";
  voci = await vociDiConfigurazione(hass);
  for (const [etichetta, chiave] of PERIODI.map((p) => [p[0], p[1]])) {
    if (!contatori[chiave]) continue;
    const nome = "Costo " + base.toLowerCase() + " " + chiave;
    const vecchio = gia("template", nome);
    if (vecchio) {
      costi[chiave] = vecchio;
      conto.riusati++;
    } else {
      dillo("Creo il costo di " + etichetta.toLowerCase() + "...");
      nuoviCosti.push([chiave, await creaCosto(hass, nome, perPrezzo(contatori[chiave]))]);
      conto.creati++;
    }
  }
  // e il costo di ieri, dal periodo chiuso del contatore di oggi
  if (contatori.oggi) {
    const nome = "Costo " + base.toLowerCase() + " ieri";
    const vecchio = gia("template", nome);
    if (vecchio) { costi.ieri = vecchio; conto.riusati++; } else {
      dillo("Creo il costo di ieri...");
      const stato = "{{ (state_attr('" + contatori.oggi + "', 'last_period') | float(0) * states('"
        + prezzo + "') | float(0)) | round(2) }}";
      nuoviCosti.push(["ieri", await creaCosto(hass, nome, stato)]);
      conto.creati++;
    }
  }
  if (nuoviCosti.length) {
    reg = await registro(hass);
    nuoviCosti.forEach(([chiave, id]) => {
      const e = entitaDellaVoce(reg, id);
      if (e) costi[chiave] = e;
    });
  }

  // 4. il pezzo di configurazione per la scheda
  const periods = PERIODI.filter((p) => contatori[p[1]]).map(([etichetta, chiave]) => {
    const riga = { label: etichetta, energy: contatori[chiave] };
    if (costi[chiave]) riga.cost = costi[chiave];
    return riga;
  });
  const patch = { periods };
  if (contatori.oggi) {
    const ieri = { label: "Ieri", energy: contatori.oggi, energy_attr: "last_period" };
    if (costi.ieri) ieri.cost = costi.ieri;
    patch.periods_prev = [ieri];
  }
  patch.settings_sections = [{ title: "Costi", rows: [{ entity: prezzo, label: "Prezzo energia (€/kWh)" }] }];
  dillo("Fatto: " + conto.creati + " creati, " + conto.riusati + " c'erano gia'.");
  return patch;
}
