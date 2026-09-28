// Le prove dei conti. Non ricopio le formule: importo le funzioni VERE dal
// sorgente e le metto alla frusta. Si lancia con `node strumenti/prove.js`.
//
// Ogni prova dice cosa si aspetta e perche'. Quando una fallisce, stampa il
// numero atteso e quello che e' uscito: e' quello che serve per capire, non
// un "FAIL" secco.

import { numero, unitaBella, giornoBreve, meseBreve, meseLungo, tastiDi } from '../src/elettro-comune.js';
import { coloreScala, aPezzetti, SCALA, PERIODI_GRAFICO } from '../src/elettro-grafico.js';
import { preseDiCasa, contaNelTop, inFinestra } from '../src/elettro-prepara.js';
import { prezziDelKWh, prezzoDellaCasa, INGREDIENTE, idDellaVoce, VOCI_TARIFFA } from '../src/elettro-crea.js';

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

// ===========================================================================
titolo('numero: lo scrive come Home Assistant nella lingua di chi guarda');
// in italiano la virgola. Le due schede prima usavano toFixed, che mette
// sempre il punto: sulla stessa plancia si leggeva "1,2 kW" e "0.29 EUR".
// NB: il raggruppamento delle migliaia dipende dai dati ICU di chi esegue.
// Nel browser viene "1.234,57", con un Node a ICU ridotta "1234,57". Quindi
// qui controllo quello che conta e che non cambia: la VIRGOLA decimale e
// l'arrotondamento. Il punto delle migliaia lo guardo a mano nella pagina.
prova('virgola decimale e due cifre', numero(1234.567, 2).replace('.', ''), '1234,57');
prova('zero decimali, arrotonda', numero(1234.567, 0).replace('.', ''), '1235');
prova('lo zero resta zero', numero(0, 2), '0,00');
prova('un negativo', numero(-3.5, 1), '-3,5');
prova('una schifezza non esplode', numero('cosi', 2), null);

// ===========================================================================
titolo('unitaBella');
prova('kWh resta kWh', unitaBella('kWh'), 'kWh');
prova('niente unita', unitaBella(undefined), '');

// ===========================================================================
titolo('coloreScala: il colore dice quanto');
prova('zero = il primo', coloreScala(0), SCALA[0]);
prova('uno = l\'ultimo', coloreScala(1), SCALA[SCALA.length - 1]);
prova('meta\' = quello di mezzo', coloreScala(0.5), SCALA[2]);
prova('sotto zero non esce dai bordi', coloreScala(-4), SCALA[0]);
prova('sopra uno nemmeno', coloreScala(99), SCALA[SCALA.length - 1]);
prova('una schifezza da il primo', coloreScala('boh'), SCALA[0]);

// ===========================================================================
titolo('aPezzetti: accorpa i punti SENZA perdere i picchi');
// e' la regola che tiene in piedi il grafico: se una fetta contiene un picco
// da 2100 W, quella fetta DEVE valere 2100, non la media.
{
  const t0 = new Date('2026-09-01T00:00:00Z');
  const t1 = new Date('2026-09-01T10:00:00Z');
  const punti = [];
  for (let i = 0; i < 100; i++) {
    punti.push({ t: new Date(t0.getTime() + i * 6 * 60000), y: i === 42 ? 2100 : 10 });
  }
  const fette = aPezzetti(punti, t0, t1, 10);
  prova('quante fette', fette.length, 10);
  prova('il picco sopravvive', Math.max(...fette.map((p) => p.y)), 2100);
  prova('le altre restano basse',
    fette.filter((p) => p.y > 10).length, 1);
  prova('senza punti torna vuoto', aPezzetti([], t0, t1, 10), []);
}

// ===========================================================================
titolo('preseDiCasa: quali prese misurano, e come si chiamano');
{
  const hass = { states: {
    'sensor.lavatrice_power': { state: '1200',
      attributes: { device_class: 'power', unit_of_measurement: 'W', friendly_name: 'Lavatrice Potenza' } },
    'sensor.forno_kw': { state: '2.5',
      attributes: { device_class: 'power', unit_of_measurement: 'kW', friendly_name: 'Forno Power' } },
    'sensor.temperatura': { state: '21',
      attributes: { device_class: 'temperature', unit_of_measurement: 'C', friendly_name: 'Temperatura' } },
    'sensor.rotta': { state: 'unavailable',
      attributes: { device_class: 'power', unit_of_measurement: 'W', friendly_name: 'Rotta' } },
    'sensor.strana': { state: '5',
      attributes: { device_class: 'power', unit_of_measurement: 'A', friendly_name: 'In ampere' } },
  } };
  const prese = preseDiCasa(hass);
  prova('quante ne trova', prese.length, 2);
  prova('i kW diventano W', prese[0].w, 2500);
  prova('ordinate dalla piu\' accesa', prese.map((p) => p.entity),
    ['sensor.forno_kw', 'sensor.lavatrice_power']);
  prova('toglie "Potenza" dal nome', prese[1].nome, 'Lavatrice');
  prova('toglie anche "Power"', prese[0].nome, 'Forno');
}

// ===========================================================================
titolo('contaNelTop: la spunta a mano vince sulle parole');
{
  const cfg = {
    top_include: ['sensor.presa_ha_power'],
    top_exclude: ['fotovoltaico', 'batteria'],
    top_exclude_entita: ['sensor.misuratore_power_ab'],
  };
  prova('una presa qualunque conta', contaNelTop(cfg, 'sensor.lavatrice_power'), true);
  prova('una parola esclusa non conta', contaNelTop(cfg, 'sensor.fotovoltaico_power'), false);
  prova('ma se l\'hai spuntata a mano, conta',
    contaNelTop({ ...cfg, top_include: ['sensor.fotovoltaico_power'] }, 'sensor.fotovoltaico_power'), true);
  prova('tolta a mano non conta', contaNelTop(cfg, 'sensor.misuratore_power_ab'), false);
}

// ===========================================================================
titolo('prezzoDellaCasa: la SOLA energia, non il totale di bolletta');
{
  const conTutto = { states: {
    'input_number.prezzo_luce_energia': { state: '0.1657', attributes: {} },
    'input_number.prezzo_energia': { state: '0.242', attributes: {} },
  } };
  prova('sceglie la sola energia', prezzoDellaCasa(conTutto), 'input_number.prezzo_luce_energia');
  prova('senza niente torna vuoto', prezzoDellaCasa({ states: {} }), '');
}

// ===========================================================================
titolo('INGREDIENTE: rete, accise, IVA e quota NON sono un prezzo da scegliere');
prova('rete', INGREDIENTE.test('input_number.prezzo_luce_rete_e_oneri'), true);
prova('accise', INGREDIENTE.test('input_number.prezzo_luce_accise'), true);
prova('IVA', INGREDIENTE.test('input_number.iva_luce'), true);
prova('quota fissa', INGREDIENTE.test('input_number.quota_fissa_energia_giorno'), true);
prova('la sola energia SI\'', INGREDIENTE.test('input_number.prezzo_luce_energia'), false);
prova('il totale bolletta SI\'', INGREDIENTE.test('input_number.prezzo_energia'), false);

// ===========================================================================
titolo('tastiDi: i tasti di accensione, vecchio e nuovo modo insieme');
prova('nessun tasto', tastiDi({}), []);
prova('il modo vecchio (interruttore)',
  tastiDi({ interruttore: 'switch.uno' }).map((t) => t.entity), ['switch.uno']);
prova('vecchio + USB',
  tastiDi({ interruttore: 'switch.uno', interruttore_usb: 'switch.usb' }).map((t) => t.entity),
  ['switch.uno', 'switch.usb']);
prova('il modo nuovo (elenco)',
  tastiDi({ tasti: [{ entity: 'switch.a', nome: 'A' }] }).map((t) => t.nome), ['A']);

// ===========================================================================
titolo('i periodi del grafico');
prova('sono quattro', PERIODI_GRAFICO.length, 4);
prova('i nomi', PERIODI_GRAFICO.map((p) => p.id), ['24h', '7g', '30g', 'scelto']);
prova('24h vuol dire 24 ore', PERIODI_GRAFICO[0].ore, 24);
prova('7 giorni', PERIODI_GRAFICO[1].ore, 24 * 7);
prova('30 giorni', PERIODI_GRAFICO[2].ore, 24 * 30);

// ===========================================================================
titolo('le date scritte in italiano');
{
  const d = new Date(2026, 8, 24); // giovedi 24 settembre 2026
  prova('giorno breve', giornoBreve(d).toLowerCase().startsWith('gio'), true);
  prova('mese breve', meseBreve(d).toLowerCase().startsWith('set'), true);
  prova('mese lungo', meseLungo(d).toLowerCase().startsWith('sett'), true);
}

// ===========================================================================
console.log('\n' + '='.repeat(60));
console.log(cadute === 0
  ? 'Tutte a posto: ' + fatte + ' prove.'
  : cadute + ' cadute su ' + fatte + '.');
process.exit(cadute ? 1 : 0);
