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
