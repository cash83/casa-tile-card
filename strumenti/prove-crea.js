// LE PROVE DI CHI CREA GLI AIUTANTI.
//
// `scriviTariffa` e compagni creano entita' dentro Home Assistant. Non posso
// provarli sulla casa vera - creerebbero roba in casa - quindi qui c'e' un
// Home Assistant FINTO che si comporta come quello vero nel punto che conta:
//
//   QUANDO CREI UN AIUTANTE, L'ENTITA' NON C'E' SUBITO.
//
// Home Assistant registra l'entita' poco dopo, e fino ad allora
// `hass.states[...]` non la trova. Un codice che crea e subito dopo scrive
// il valore, scrive nel vuoto: nessun errore, nessun valore. E' il difetto
// che queste prove cercano.
//
// Si lancia con: node strumenti/prove-crea.js

import { scriviTariffa, VOCI_TARIFFA, ID_TOTALE, prezziDelKWh, prezzoDellaCasa, creaCicli }
  from '../src/elettro-crea.js';

let fatte = 0;
let cadute = 0;

function prova(cosa, avuto, atteso) {
  fatte += 1;
  const a = JSON.stringify(avuto);
  const b = JSON.stringify(atteso);
  if (a !== b) {
    cadute += 1;
    console.log('  X ' + cosa + '\n      atteso: ' + b + '\n      avuto:  ' + a);
  }
}

function titolo(t) { console.log('\n--- ' + t); }

// ---------------------------------------------------------------------------
// L'Home Assistant finto. `ritardo` e' quanti giri dell'orologio ci mette a
// far comparire un'entita' appena creata: 0 = compare subito (il caso
// fortunato), 1 o piu' = come si comporta quello vero.
function faiHass(ritardo = 1) {
  const states = {};
  const fatto = [];
  const inArrivo = [];
  const hass = {
    states,
    fatto,
    async callWS(msg) {
      // l'elenco vero, quello che Home Assistant risponde davvero: ci sono
      // solo gli aiutanti gia' registrati, non quelli appena chiesti
      if (msg.type === 'input_number/list') {
        giro();
        return Object.keys(states)
          .filter((x) => x.startsWith('input_number.'))
          .map((x) => ({ id: x.split('.')[1] }));
      }
      fatto.push('crea ' + msg.type + ' "' + msg.name + '"');
      if (msg.type === 'input_number/create') {
        // come Home Assistant: il nome diventa l'entita', ma non subito
        const id = 'input_number.' + String(msg.name).toLowerCase()
          .normalize('NFD').replace(/[̀-ͯ]/g, '')
          .replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
        // +1 perche' callWS fa scattare un giro appena finisce: senza,
        // l'entita' comparirebbe subito e il ritardo non ritarderebbe
        inArrivo.push({ id, giri: ritardo + 1, attributes: {
          unit_of_measurement: msg.unit_of_measurement } });
      }
      giro();
    },
    async callService(dominio, servizio, dati) {
      fatto.push(dominio + '.' + servizio + ' ' + dati.entity_id
        + ' = ' + dati.value);
      if (dominio === 'input_number' && servizio === 'set_value') {
        // Home Assistant vero: scrivere su un'entita' che non c'e' NON
        // scrive niente. Qui faccio lo stesso invece di essere gentile.
        if (states[dati.entity_id]) {
          states[dati.entity_id].state = String(dati.value);
        } else {
          fatto.push('  !! scritto nel vuoto: ' + dati.entity_id + ' non esiste');
        }
      }
      giro();
    },
  };
  function giro() {
    for (let i = inArrivo.length - 1; i >= 0; i--) {
      if (--inArrivo[i].giri <= 0) {
        const x = inArrivo.splice(i, 1)[0];
        states[x.id] = { state: 'unknown', attributes: x.attributes };
      }
    }
  }
  return hass;
}

const TARIFFA = { energia: 0.1657, rete: 0.045, accise: 0.0093, iva: 10, quota: 0.542 };

// ===========================================================================
titolo('il conto della tariffa');
{
  // 0,1657 + 0,045 + 0,0093 = 0,22; piu' IVA 10% = 0,242
  const hass = faiHass(0);
  const out = await scriviTariffa(hass, TARIFFA);
  prova('il totale della bolletta', out.totale, 0.242);
  prova('la sola energia resta a parte', out.energia, 0.1657);
}

// ===========================================================================
titolo('li crea tutti e sei?');
{
  const hass = faiHass(0);
  await scriviTariffa(hass, TARIFFA);
  const creati = hass.fatto.filter((x) => x.startsWith('crea ')).length;
  prova('sei aiutanti creati (le 5 voci + il totale)', creati, 6);
  VOCI_TARIFFA.forEach((v) => {
    prova('esiste ' + v.chiave, !!hass.states[v.id], true);
  });
  prova('esiste il totale', !!hass.states[ID_TOTALE], true);
}

// ===========================================================================
titolo('e i valori ci finiscono davvero dentro?');
{
  const hass = faiHass(0);
  await scriviTariffa(hass, TARIFFA);
  prova('energia', hass.states['input_number.prezzo_luce_energia'].state, '0.1657');
  prova('rete', hass.states['input_number.prezzo_luce_rete_e_oneri'].state, '0.045');
  prova('accise', hass.states['input_number.prezzo_luce_accise'].state, '0.0093');
  prova('IVA', hass.states['input_number.iva_luce'].state, '10');
  prova('quota fissa', hass.states['input_number.quota_fissa_energia_giorno'].state, '0.542');
  prova('totale', hass.states[ID_TOTALE].state, '0.242');
}

// ===========================================================================
titolo('LA PROVA VERA: Home Assistant ci mette un attimo a registrarli');
{
  // questo e' il caso reale. Se il codice crea e scrive subito, scrive nel
  // vuoto e i valori restano "unknown" - senza un errore che lo dica.
  const hass = faiHass(1);
  await scriviTariffa(hass, TARIFFA);
  const nelVuoto = hass.fatto.filter((x) => x.includes('scritto nel vuoto'));
  prova('nessun valore scritto nel vuoto', nelVuoto, []);
  prova('energia ci e\' arrivata',
    (hass.states['input_number.prezzo_luce_energia'] || {}).state, '0.1657');
  prova('totale ci e\' arrivato', (hass.states[ID_TOTALE] || {}).state, '0.242');
}

// ===========================================================================
titolo('se gli aiutanti ci sono gia\', non ne crea di nuovi');
{
  const hass = faiHass(0);
  await scriviTariffa(hass, TARIFFA);
  const primoGiro = hass.fatto.filter((x) => x.startsWith('crea ')).length;
  hass.fatto.length = 0;
  await scriviTariffa(hass, { ...TARIFFA, energia: 0.2 });
  const secondoGiro = hass.fatto.filter((x) => x.startsWith('crea ')).length;
  prova('la prima volta li crea', primoGiro, 6);
  prova('la seconda no', secondoGiro, 0);
  prova('ma riscrive il valore nuovo',
    hass.states['input_number.prezzo_luce_energia'].state, '0.2');
  // 0,2 + 0,045 + 0,0093 = 0,2543; per 1,10 fa 0,27973 -> 0,2797
  prova('e rifa\' il totale', hass.states[ID_TOTALE].state, '0.2797');
}

// ===========================================================================
titolo('le voci storte non rompono niente');
{
  const hass = faiHass(0);
  const out = await scriviTariffa(hass, { energia: 0.1657, rete: 'boh', accise: -1, iva: 10 });
  prova('rete non numerica: saltata',
    !!hass.states['input_number.prezzo_luce_rete_e_oneri'], false);
  prova('accise negative: saltate',
    !!hass.states['input_number.prezzo_luce_accise'], false);
  prova('il totale usa solo quelle buone', out.totale, 0.1823);
}

// ===========================================================================
titolo('prezzoDellaCasa sceglie la SOLA energia, non il totale');
{
  const hass = faiHass(0);
  await scriviTariffa(hass, TARIFFA);
  prova('quale prezzo usano le schede', prezzoDellaCasa(hass),
    'input_number.prezzo_luce_energia');
  const inEuroKWh = prezziDelKWh(hass);
  prova('il totale e\' il primo dell\'elenco', inEuroKWh[0], ID_TOTALE);
  prova('quanti prezzi in €/kWh', inEuroKWh.length, 4);
}

// ===========================================================================
titolo('il ciclo fantasma: una briciola non deve lasciare il ciclo aperto');
{
  // L'automazione dei cicli la scrive `creaCicli` con una POST. Qui me la
  // faccio dare e la guardo: quello che conta e' il ramo "finisce".
  let scritta = null;
  let nati = 0;
  const hass = {
    states: {
      'sensor.prova_kwh': { state: '12', attributes: { unit_of_measurement: 'kWh',
        device_class: 'energy', state_class: 'total_increasing' } },
      'sensor.prova_watt': { state: '0', attributes: { unit_of_measurement: 'W',
        device_class: 'power' } },
    },
    async callWS(msg) {
      // le liste che `creaCicli` interroga: qui la casa e' vuota, cosi'
      // crea tutto da zero
      if (msg.type === 'config_entries/get') return [];
      if (msg.type && String(msg.type).endsWith('/list')) return [];
      return [];
    },
    async callApi(metodo, strada, corpo) {
      if (String(strada).includes('automation/config')) { scritta = corpo; return {}; }
      // il flusso che crea un helper: Home Assistant apre un flow, chiede i
      // campi, poi crea. Qui dico subito di si'.
      if (String(strada) === 'config/config_entries/flow') {
        return { type: 'form', flow_id: 'f1', data_schema: [] };
      }
      if (String(strada).startsWith('config/config_entries/flow/')) {
        nati += 1;
        return { type: 'create_entry', result: { entry_id: 'e' + nati } };
      }
      if (String(strada).includes('entity_registry')) return [];
      return {};
    },
    async callService() {},
  };
  await creaCicli(hass, { nome: 'Prova', potenza: 'sensor.prova_watt',
    energia: 'sensor.prova_kwh', attesa: 100 }, () => {});

  const rami = scritta && scritta.actions && scritta.actions[0] && scritta.actions[0].choose;
  const fine = (rami || []).find((r) => JSON.stringify(r.conditions).includes('finisce'));
  const quando = fine && fine.sequence && fine.sequence[0];
  prova('il ramo "finisce" c\'e\'', !!quando, true);
  prova('sotto la briciola non scrive il ciclo', !!(quando && quando.if), true);
  prova('ma CANCELLA la partenza', !!(quando && quando.else), true);
  const annulla = JSON.stringify((quando && quando.else) || []);
  prova('rimettendola sulla fine', annulla.includes('_ciclo_iniziato')
    && annulla.includes('_ultimo_ciclo_fine'), true);
  // e la fine, se non c'e' mai stata, diventa una data vera: se no la
  // scheda conta il ciclo aperto comunque (`!fine || via > fine`)
  prova('e mettendo a posto una fine mai scritta', annulla.includes('unknown'), true);
  // il contatore si azzera sempre, briciola o no
  prova('il contatore si azzera lo stesso',
    JSON.stringify(fine.sequence).includes('utility_meter.calibrate'), true);
}

// ===========================================================================
console.log('\n' + '='.repeat(60));
console.log(cadute === 0
  ? 'Tutte a posto: ' + fatte + ' prove.'
  : cadute + ' cadute su ' + fatte + '.');
process.exit(cadute ? 1 : 0);
