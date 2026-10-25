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

import { scriviTariffa, VOCI_TARIFFA, ID_TOTALE, prezziDelKWh, prezzoDellaCasa, creaCicli,
  creaSensoriBase, aiutantiDellaScheda }
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
titolo('la quota fissa conta i giorni dal calendario, non dal contatore');
{
  // `last_reset` dice quando il contatore e' stato AZZERATO, non quando e'
  // cominciato il periodo. Un contatore nato - o rinominato - a meta' periodo
  // porta una data che col calendario non c'entra: il bimestre di casa diceva
  // 14 giorni invece di 34, e la bolletta 69,37 invece di 80,21 euro.
  //
  // Per vedere le formule del costo bisogna che i contatori NASCANO davvero:
  // il finto Home Assistant qui sotto li registra come fa quello vero, se no
  // `creaSensoriBase` non arriva nemmeno a scrivere i costi.
  const scritti = [];
  const voci = [];
  const reg = [];
  const states = {
    'sensor.q_kwh': { state: '100', attributes: { unit_of_measurement: 'kWh',
      device_class: 'energy', state_class: 'total_increasing',
      friendly_name: 'Casa' } },
    'input_number.prezzo_energia': { state: '0.242', attributes: {} },
    'input_number.quota_fissa_energia_giorno': { state: '0.542', attributes: {} },
  };
  let n = 0;
  const hass = {
    states,
    async callWS(msg) {
      if (msg.type === 'config_entries/get') return voci;
      if (msg.type === 'config/entity_registry/list') return reg;
      return [];
    },
    async callApi(metodo, strada, corpo) {
      if (String(strada) === 'config/config_entries/flow') {
        return { type: 'form', flow_id: 'f', data_schema: [
          { name: 'name' }, { name: 'state' }, { name: 'unit_of_measurement' },
          { name: 'device_class' }, { name: 'state_class' },
          { name: 'source' }, { name: 'cycle' },
        ] };
      }
      if (String(strada).startsWith('config/config_entries/flow/')) {
        n += 1;
        const id = 'e' + n;
        const eid = 'sensor.finto_' + n;
        voci.push({ entry_id: id, domain: cheTipo(corpo), title: corpo.name });
        reg.push({ config_entry_id: id, entity_id: eid });
        states[eid] = { state: '10', attributes: { unit_of_measurement: 'kWh' } };
        if (corpo.state) scritti.push(corpo.state);
        return { type: 'create_entry', result: { entry_id: id } };
      }
      return {};
    },
    async callService() {},
  };
  // che tipo di aiutante e': lo dice la forma di quello che gli si manda
  function cheTipo(c) { return c && c.cycle ? 'utility_meter' : 'template'; }

  await creaSensoriBase(hass, { sorgente: 'sensor.q_kwh',
    prezzo_entita: 'input_number.prezzo_energia',
    periodi: ['ora', 'oggi', 'settimana', 'mese', 'bimestre'] }, () => {});

  const tutte = scritti.join('\n');
  prova('i costi sono stati scritti', scritti.length > 3, true);
  prova('nessuna formula guarda piu last_reset', tutte.includes('last_reset'), false);
  prova('la settimana parte da lunedi', tutte.includes('now().weekday() + 1'), true);
  prova('il mese dal primo', tutte.includes('now().day'), true);
  prova('il bimestre dal primo dei mesi dispari',
    tutte.includes('now().month % 2 == 1'), true);
  // sull'ora la quota non c'entra: si paga a giorno, non a ora
  const ora = scritti.find((x) => x.includes('quota_fissa') === false);
  prova('qualche formula senza quota c e (l ora)', !!ora, true);
}

// ===========================================================================
// LA CASA FINTA PER I CICLI. Qui non basta l'Home Assistant finto di sopra:
// `creaCicli` apre flussi di configurazione, legge il registro delle entita'
// e scrive automazioni. Questo ne fa abbastanza perche' il giro arrivi in
// fondo, e tiene il conto di quello che ha creato - che e' la cosa che le tre
// prove qui sotto guardano.
function faiCasa() {
  const states = {};
  const voci = [];          // le voci di configurazione (soglia, contatore...)
  const reg = [];           // il registro delle entita'
  const automazioni = {};   // id -> corpo
  const creati = [];        // la cronaca di cosa ha creato
  let nFlusso = 0;
  let inCorso = null;

  const metti = (eid, nome) => {
    states[eid] = { entity_id: eid, state: '0', attributes: { friendly_name: nome } };
  };

  const hass = {
    states, voci, reg, automazioni, creati,
    async callWS(msg) {
      if (msg.type === 'config_entries/get') return voci.map((v) => ({ ...v }));
      if (msg.type === 'config/entity_registry/list') return reg.map((e) => ({ ...e }));
      if (msg.type === 'config/entity_registry/update') {
        const e = reg.find((x) => x.entity_id === msg.entity_id);
        if (e) {
          const vecchio = e.entity_id;
          e.entity_id = msg.new_entity_id;
          states[msg.new_entity_id] = states[vecchio];
          delete states[vecchio];
        }
        return {};
      }
      if (msg.type === 'input_number/create' || msg.type === 'input_datetime/create') {
        const dominio = msg.type.split('/')[0];
        // come Home Assistant: lo slug viene dal nome, e se e' occupato ci
        // appende _2. E' proprio il caso che prima si indovinava sbagliato.
        const base = String(msg.name).toLowerCase()
          .normalize('NFD').replace(/[̀-ͯ]/g, '')
          .replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
        let id = base;
        let n = 2;
        while (states[dominio + '.' + id]) { id = base + '_' + n; n += 1; }
        metti(dominio + '.' + id, msg.name);
        creati.push(dominio + '.' + id);
        return { id };     // <- la risposta vera di Home Assistant
      }
      throw new Error('callWS non previsto: ' + msg.type);
    },
    async callApi(metodo, percorso, corpo) {
      if (percorso === 'config/config_entries/flow') {
        nFlusso += 1;
        inCorso = { handler: corpo.handler, flow_id: 'f' + nFlusso };
        return { type: 'form', flow_id: inCorso.flow_id,
          data_schema: [{ name: 'name' }, { name: 'entity_id' }, { name: 'source' },
            { name: 'upper' }, { name: 'hysteresis' }, { name: 'cycle' }] };
      }
      if (percorso.startsWith('config/config_entries/flow/')) {
        const entry_id = 'e' + nFlusso;
        const eid = (inCorso.handler === 'threshold' ? 'binary_sensor.' : 'sensor.')
          + String(slugFinto(corpo.name)).toLowerCase();
        voci.push({ entry_id, domain: inCorso.handler, title: corpo.name });
        reg.push({ entity_id: eid, config_entry_id: entry_id });
        metti(eid, corpo.name);
        creati.push(eid);
        return { type: 'create_entry', result: { entry_id } };
      }
      if (percorso.startsWith('config/automation/config/')) {
        const id = percorso.split('/').pop();
        const nuova = !automazioni[id];
        automazioni[id] = corpo;
        const eid = 'automation.' + slugFinto(corpo.alias);
        if (nuova) creati.push(eid);
        metti(eid, corpo.alias);
        states[eid].attributes.id = id;
        return {};
      }
      throw new Error('callApi non previsto: ' + percorso);
    },
  };
  function slugFinto(nome) {
    return String(nome).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
  }
  return hass;
}

const PEZZI = { potenza: 'sensor.forno_potenza', energia: 'sensor.forno_kwh', soglia: 10 };

// ===========================================================================
titolo("l'indirizzo della memoria lo dice Home Assistant, non lo indovino io");
{
  const hass = faiCasa();
  hass.states[PEZZI.potenza] = { state: '0', attributes: {} };
  hass.states[PEZZI.energia] = { state: '0', attributes: {} };
  // quell'indirizzo e' GIA' occupato da una cosa tua, che si chiama in un
  // altro modo: prima la scheda ci scriveva dentro come se fosse sua
  hass.states['input_number.forno_ultimo_ciclo_kwh'] = {
    state: '42', attributes: { friendly_name: 'Una cosa mia che ho fatto a mano' } };

  const out = await creaCicli(hass, { ...PEZZI, nome: 'Forno' });

  prova('non si prende quello di qualcun altro',
    out.ciclo.consumo === 'input_number.forno_ultimo_ciclo_kwh', false);
  prova("usa l'indirizzo che gli ha dato Home Assistant",
    out.ciclo.consumo, 'input_number.forno_ultimo_ciclo_kwh_2');
  prova('quello di prima e rimasto intatto',
    hass.states['input_number.forno_ultimo_ciclo_kwh'].state, '42');
  prova('le altre tre memorie nascono normali', [
    out.ciclo.durata, out.ciclo.fine, out.ciclo.inizio,
  ], [
    'input_number.forno_ultimo_ciclo_minuti',
    'input_datetime.forno_ultimo_ciclo_fine',
    'input_datetime.forno_ciclo_iniziato',
  ]);
}

// ===========================================================================
titolo('rinominando la scheda NON nasce una seconda automazione del ciclo');
{
  const hass = faiCasa();
  hass.states[PEZZI.potenza] = { state: '0', attributes: {} };
  hass.states[PEZZI.energia] = { state: '0', attributes: {} };

  const primo = await creaCicli(hass, { ...PEZZI, nome: 'Forno' });
  const autoPrima = Object.keys(hass.automazioni);
  prova('la prima volta una automazione la crea', autoPrima.length, 1);

  // adesso la scheda si chiama in un altro modo, ma le sue entita' sono
  // sempre quelle: e' quello che succede quando rinomini la scheda
  const dopo = await creaCicli(hass, {
    ...PEZZI, nome: 'Forno cucina',
    ciclo: primo.ciclo, soglia_acceso: primo.soglia_acceso,
  });
  prova('la seconda volta NON ne crea un altra', Object.keys(hass.automazioni).length, 1);
  prova("e' la stessa automazione di prima", Object.keys(hass.automazioni)[0], autoPrima[0]);
  prova('col nome nuovo', hass.automazioni[autoPrima[0]].alias, 'Forno cucina: segna il ciclo');
  prova('e scrive sempre nelle stesse memorie', dopo.ciclo.consumo, primo.ciclo.consumo);
  prova('non rifa la soglia col nome nuovo', dopo.soglia_acceso, primo.soglia_acceso);
  prova('ne il contatore del ciclo', dopo.ciclo.contatore, primo.ciclo.contatore);
  prova('e non lascia in giro memorie orfane',
    hass.creati.filter((x) => x.startsWith('input_')).length, 4);
}

// ===========================================================================
titolo('la cancellazione propone solo roba fatta dalla scheda');
{
  // una scheda che non si ricorda la sua soglia: prima, dal NOME, si tirava
  // dietro "binary_sensor.forno_in_funzione" - che poteva essere tuo
  const senzaSoglia = { name: 'Forno', ciclo: {
    consumo: 'input_number.forno_ultimo_ciclo_kwh',
    durata: 'input_number.forno_ultimo_ciclo_minuti' } };
  const elenco = aiutantiDellaScheda({ states: {} }, senzaSoglia);
  prova('non indovina piu la soglia dal nome',
    elenco.includes('binary_sensor.forno_in_funzione'), false);
  prova('le memorie del ciclo restano', elenco.length, 2);

  // quella che la scheda si e' fatta creare invece c e, perche' e scritta
  const conSoglia = { ...senzaSoglia, soglia_acceso: 'binary_sensor.forno_in_funzione' };
  prova('la soglia scritta nella configurazione si',
    aiutantiDellaScheda({ states: {} }, conSoglia).includes('binary_sensor.forno_in_funzione'), true);

  // un costo che la scheda ha solo RICONOSCIUTO non e roba sua
  const conCosto = {
    name: 'Forno',
    period_entities: { today: { energy: 'sensor.forno_energia_oggi', cost: 'sensor.costo_forno_oggi' } },
    costi_adottati: ['sensor.costo_forno_oggi'],
  };
  const e2 = aiutantiDellaScheda({ states: {} }, conCosto);
  prova('il costo adottato non si propone', e2.includes('sensor.costo_forno_oggi'), false);
  prova('il contatore suo invece si', e2.includes('sensor.forno_energia_oggi'), true);
}

// ===========================================================================
console.log('\n' + '='.repeat(60));
console.log(cadute === 0
  ? 'Tutte a posto: ' + fatte + ' prove.'
  : cadute + ' cadute su ' + fatte + '.');
process.exit(cadute ? 1 : 0);
