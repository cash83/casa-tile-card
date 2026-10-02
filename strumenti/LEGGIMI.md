# Gli strumenti della lingua

La card e' scritta in italiano e resta leggibile in italiano. L'inglese sta
tutto in `src/lingua.js`, dove **la frase italiana fa da chiave**.

Perche' cosi': le chiavi non si inventano (sono la frase stessa), e una
scritta non ancora tradotta **resta in italiano** invece di sparire o di
mostrare un codice tipo `eti.mostra_icona`.

## Il giro, quando si aggiungono o si cambiano delle scritte

1. `python strumenti/estrai_scritte.py` — rilegge dal codice le etichette,
   gli stati, i titoli delle sezioni e le voci delle tendine, e li scrive in
   `strumenti/da_tradurre.json`.
2. si aggiunge la traduzione dentro a `strumenti/fai_lingua.py`, indicizzata
   per **chiave di impostazione** (`mostra_icona`, `docked`, ...), non per
   frase: cosi' se domani la frase italiana cambia, la traduzione resta
   agganciata.
3. `python strumenti/fai_lingua.py` — rigenera `src/lingua.js`.
4. `python strumenti/controlla_lingua.py` — **questo e' quello che conta**:
   dice se qualche scritta e' rimasta senza traduzione, e se qualche chiave
   del dizionario non corrisponde a nessuna scritta vera.

## Le schede dei consumi: due dizionari a parte

`estrai_scritte.py` guarda **solo** `schema.js` e `aiuti.js`, cioe' le scritte
della casella. Le scritte delle due schede dei consumi (`casa-energia`,
`casa-elettrodomestico`) e dei loro tre editor stanno nei file `elettro-*`, e
percio' non passano dall'estrattore: le tengo a mano in due dizionari dentro a
`fai_lingua.py`, indicizzati per **frase italiana** come le `LIBERE`.

* `ELETTRO` &mdash; i tre editor: nomi dei campi, titoli dei cassetti, tasti e i
  paragrafi di aiuto. I paragrafi sono tradotti **interi**, col grassetto dentro:
  una frase italiana spezzata in dieci frammenti in inglese non torna. Per
  questo nel codice sono avvolti in `T("...")` invece di lasciarli a `TH()`.
* `ELETTRO_SCHEDE` &mdash; le due schede: righe, finestrelle, avvisi.

Giorni, mesi e ore **non** stanno nei dizionari: li scrive il browser nella
lingua di chi guarda (`giornoBreve`, `meseBreve`, `laLocale()`). In italiano
*Mar* e' sia martedi' sia marzo, e una chiave non puo' valere due cose.

**Da sapere**: siccome l'estrattore non vede queste scritte, il conto di
`controlla_lingua.py` («chiavi che non servono a niente») elenca anche loro.
Quell'elenco NON e' affidabile: dice ~350 chiavi inutili che in realta' sono
usate tutte.

## La trappola, gia' pagata

Le chiavi **non si scrivono a mano**. Un apostrofo tipografico (') al posto
di uno dritto (') e la traduzione non si aggancia piu', in silenzio: la
frase resta in italiano e sembra solo che manchi. Per questo `lingua.js` lo
genera uno script a partire dalle stringhe vere del codice.

## Quello che non si traduce, mai

Le **chiavi della configurazione** — `icona`, `colore`, `posti`,
`mostra_cursore`, `finestra_*` — stanno scritte dentro alle plance di chi
usa la card. Tradurle vorrebbe dire rompere ogni installazione esistente.
Qui si traduce solo quello che si LEGGE.

## Le prove

Due pezzi, perche' provano due cose diverse.

**`prove.js`** - i conti. Importa le funzioni VERE dal sorgente (niente
formule ricopiate) e le mette alla frusta: il numero scritto all'italiana,
il colore della scala, l'accorpamento dei punti del grafico che NON deve
perdere i picchi, quali prese contano nel top, quale prezzo e' quello giusto.

```
node strumenti/prove.js
```

**`prove-schede.html`** - le schede montate. Costruisce `casa-tile`,
`casa-energia` e `casa-elettrodomestico` con un `hass` finto e guarda cosa
scrivono davvero dentro al loro guscio: le soglie dei watt, la barra della
potenza, i kWh e i costi dei periodi (numero per numero), l'ultimo ciclo, il
ciclo in corso, i periodi che si ricava da sola, tutti i pop-up e dove
finiscono le scritte sotto al grafico.

```
npm run build
python -m http.server 8781
```
e poi `http://127.0.0.1:8781/strumenti/prove-schede.html`.

Due trappole che costano un'ora se non le sai:

- la scheda **accorpa** i cambi di stato che arrivano insieme e ridisegna
  dopo 150 ms. Fra un valore e il prossimo bisogna aspettare, se no si legge
  quello di prima e sembra che la soglia non funzioni;
- le righe che si vedono le decide `righe`. Se una riga non e' nell'elenco il
  suo pezzo non esiste nel guscio, e `querySelector` torna `null`: non e' un
  difetto, e' che quella riga non l'hai chiesta.

## I tre controlli automatici

```
npm run controlla
```

Fa tre passate, e nessuna delle tre guarda se il codice e' bello: guardano
solo se c'e' qualcosa che non va.

**1. `eslint`** - con le regole scritte in `eslint.config.mjs`. Non impone uno
stile: cerca i nomi che non esistono, le chiavi scritte due volte nello stesso
oggetto (quella e' la piu' cattiva: vince la seconda e la prima sparisce in
silenzio), il codice che non si raggiunge, gli `import` che nessuno usa.

**2. `controlla_doppioni.js`** - legge i moduli col parser vero e cerca due
funzioni col corpo identico, lo stesso disegno SVG scritto piu' volte, e lo
stesso selettore CSS dichiarato due volte nello stesso foglio. Salta quello
che sta dentro a un `@media`: li' due regole uguali sono apposta.

**3. `controlla_morto.js`** - roba esportata che nessuno importa (nemmeno le
prove), classi CSS nei fogli e mai messe su niente, metodi `_qualcosa()` che
nessuno chiama.

Le voci del dizionario NON si controllano con questi: per quelle c'e'
`controlla_scritte.py`, che guarda il verso che conta (scritte senza
traduzione). L'elenco contrario - "chiavi che non servono piu'" - e' sempre
pieno di falsi allarmi, perche' mezze scritte si compongono a pezzi.
