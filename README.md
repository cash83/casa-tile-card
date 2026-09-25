# Casa Tile Card

Casella animata per Home Assistant: **icone che si muovono solo quando la cosa è accesa**, si configura a clic (niente YAML) e ha un pop-up tutto suo dove puoi mettere qualsiasi scheda di Home Assistant.

![versione](https://img.shields.io/badge/versione-2.34.0-blue) ![hacs](https://img.shields.io/badge/HACS-custom-orange)

🇮🇹 Italiano · [🇬🇧 English](README.en.md)

---

## Cosa fa

- **Icona automatica**: la sceglie la card guardando l'entità (luce, presa, termosifone, telecamera, batteria, aspirapolvere, persona, meteo…). Se non ti va, ne scegli una tu.
- **209 icone**: 63 disegnate a mano e animate + quelle del set di Home Assistant, tutte colorate e con la ricerca in italiano («tenda» trova la tapparella, «aspira» il robot, «smartwatch» l'orologio). **Si muovono solo quando la cosa è accesa**, tutte.
- Se l'entità ha già la sua icona in Home Assistant, la card usa quella (come fanno tile e mushroom); le nostre restano dove l'entità non ne ha una.
- Puoi anche usare **una qualsiasi icona di Home Assistant** o **un'immagine tua**, presa dal telefono o dal PC.
- **Batteria vera**: il riempimento segue la percentuale, il colore va da verde a rosso, e si vede cosa sta facendo: in carica il pezzo che manca si riempie (col fulmine), quando sta dando corrente una tacca scura scivola verso sinistra, da ferma sta ferma. Lo capisce dai sensori di potenza che parlano di carica o scarica.
- **Meteo**: l'icona segue il tempo che fa (sole, luna, nuvole, pioggia, neve, temporale, nebbia, vento) e lo sfondo diventa il cielo di quel momento.
- **Multiroom vero**: aggiungi e togli le casse dal gruppo, e se togli quella che comanda la coda passa a chi resta (con Music Assistant) invece di fermare la musica; la casella segue da sola la cassa che sta suonando.
- **Musica**: copertina tonda, titolo e artista, onda del tempo sempre in pari col brano, comandi, volume col tasto del muto, scelta della cassa, gruppo multi-room e sorgente. La copertina può fare anche da sfondo, sfocata quanto vuoi, e in pausa la casella resta accesa.
- **Luci**: barra della luminosità e striscia del colore (arcobaleno o bianco caldo/freddo) dentro la casella.
- **Valori impostabili** (`number`): barra per cambiarli, con la corsa che puoi accorciare.
- **Grafico dell'andamento** dentro la casella (temperature, watt, qualsiasi numero), con le ore che decidi tu: si disegna dietro alle scritte, quindi non cambia l'altezza di niente. Passandoci sopra dice valore e ora, e si sceglie fra area piena e linea.
- **Colore che segue la temperatura**: freddo azzurro, tiepido verde, caldo arancione, molto caldo rosso.
- I sensori che spariscono per qualche minuto (Bluetooth) non scrivono più «Assente»: tengono l'ultimo valore letto, smorzato.
- **Durate scritte come le diresti**: un'autonomia di 1,5 ore diventa *1 h 30 min*, un uptime di 44555 secondi *12 h 22 min*. E i sensori che si portano l'unità dentro allo stato (*17min*) non perdono più il pezzo finale.
- **Nome sulle misure**: a ogni misura in basso puoi dare il nome che vuoi (*Scarica*, *Uscita casa*), così due sensori di watt non sono più due pastiglie uguali con dentro numeri diversi.
- **Telecamera in diretta**: la casella di una telecamera si riempie con la sua immagine, che si rifa da sola ogni tot secondi.
- **Pop-up tuo**: ci metti quante schede vuoi, sono quelle di Home Assistant, con il loro pannello di impostazioni; e lo vesti come vuoi - tinta, foto e trasparenza della finestra, piu il colore delle schede che stanno dentro.
- **Effetti**: 19 modi di illuminarsi, intensità e velocità regolabili, sfondo a tinta, foto o meteo. Si vedono anche sopra a una foto o alla copertina, e «non si muove mai» ferma davvero tutto.
- **Due colori**: uno per gli effetti (alone, bordo, luci) e, se vuoi, uno solo per la scritta.
- L'icona si può anche togliere del tutto, per lasciare solo le scritte.
- **Persone**: anello colorato secondo dove si trova (casa, fuori, un'altra zona), da quanto tempo, quanti chilometri da casa — in linea d'aria o su strada se hai un sensore di percorso (Waze, Google).
- **Comandi rapidi** per tapparelle (su/stop/giù e posizione), serrature e aspirapolvere: tasti di vetro che si alzano al passaggio del dito, e quello che racconta cosa sta succedendo si accende del colore della casella (alla base, sta pulendo, tutta su, tutta giù, oppure «ferma» mentre viaggia).
- **«Da quanto»** per qualsiasi entità: *accesa da 40 minuti*, *aperta da 3 ore*.
- **Quando è accesa lo decidi tu**: sempre, a un valore esatto, sopra una soglia, oppure **guardando altre entità** (quante vuoi: basta che una sia attiva) — così la casella di una batteria si illumina quando escono watt, non perché è carica al 93%.
- **Cielo del meteo** fatto di pezzi veri: stelle di grandezze diverse che luccicano, la luna coi crateri e le stelle cadenti, il sole coi raggi, nuvole a più gobbe, gocce inclinate, fiocchi che ondeggiano.
- **Ogni pezzo dove vuoi tu, e della grandezza che vuoi tu**: nome, valore, icona, barra, tasti e singole misure si prendono col dito e si trascinano dove ti pare dentro alla casella; tocchi un pezzo e sul suo angolo compare un quadratino giallo, lo tieni premuto e lo tiri per ingrandirlo o rimpicciolirlo (dal 40% al 300%). Si compone in un riquadro che ha la misura vera della card sulla plancia, quindi quello che vedi e' quello che ottieni; e le caselle dentro al pop-up si sistemano dallo stesso riquadro, basta toccarle nell'anteprima.
- **Leggera**: si ridisegna al massimo dieci volte al secondo anche quando la casa manda valanghe di aggiornamenti, tiene in memoria trecento punti di storico invece di decine di migliaia, e quando e' nascosta (pop-up chiuso, altra linguetta) sta davvero ferma.
- Si adatta da sola alla larghezza della casella e al dito, e **non esce mai dal riquadro** che le dai: se lo spazio è poco si stringe il contenuto, la misura la decidi tu dal Layout.

## Installazione con HACS

1. HACS → **Frontend** → menù in alto a destra → **Repository personalizzate**
2. Indirizzo: `https://github.com/cash83/casa-tile-card` — categoria: **Lovelace**
3. Cerca **Casa Tile Card**, scaricala, poi ricarica la pagina (Ctrl+F5).

## Installazione a mano

1. Copia `dist/casa-tile-card.js` in `config/www/`
2. Impostazioni → Plance → menù → **Risorse** → aggiungi `/local/casa-tile-card.js` come **Modulo JavaScript**

## Come si usa

Aggiungi una scheda alla dashboard e cerca **Casa · casella animata**. Poi tutto a clic:

| Scheda | Cosa c'è |
|---|---|
| **Base** | entità e nome; cosa c'è scritto (sottotitolo, valore, «da quanto», misure); quando la casella è accesa |
| **Icona** | mostrala o nascondila, usa la foto dell'entità, un'icona di Home Assistant, il catalogo o un'immagine tua |
| **Aspetto** | come è fatta (disposizione, casella grande), i 19 effetti, il colore della casella e quello della scritta, e **«Dove va ogni pezzo»**: il riquadro dove trascini nome, valore, icona e misure |
| **Sfondo** | tinta e trasparenza, foto di sfondo, cielo del meteo |
| **Comandi** | la barra dentro la casella, i tasti rapidi (tapparelle, serrature, aspirapolvere), la striscia del colore |
| **Grafico** | grafico dell'andamento, quante ore, area o linea, minimo e massimo |
| **Musica** | comandi, copertina come sfondo, casse e sorgenti, aspetto del riquadro delle casse |
| **Persone** | distanza da casa e sensore del percorso (con la disposizione **Persona**) |
| **Tocco** | cosa fa quando la tocchi: accendi/spegni, dettagli, pop-up tuo, mappa, indirizzo web, servizio |

Le schede che non servono a quell'entità spariscono da sole: su un sensore non vedrai Musica né Comandi, su una persona non vedrai Grafico.

In cima all'editor c'è una **ricerca**: scrivi «meteo» o «colore» e ti dice in quale scheda sta ogni impostazione che c'entra; un clic e ti porta lì.

### Esempio minimo

```yaml
type: custom:casa-tile
entity: light.salotto
```

### Esempio con pop-up

```yaml
type: custom:casa-tile
entity: sensor.batteria_casa
name: Casa Batteria
azione: finestra
finestra_titolo: Casa Batteria
finestra_cards:
  - type: custom:power-flow-card-plus
    entities: {}
```

## Energia ed elettrodomestici

Dalla 2.19 dentro a casa-tile ci sono **due schede grandi** in più, fatte per
stare nel pop-up di una casella (o da sole su una plancia):

- **`custom:casa-energia`** — la luce di casa: Watt adesso, consumo e costo di
  oggi, **solo energia** e **+ tasse**, costo del mese, **chi consuma di più**
  (trova da sola tutte le prese che misurano, anche quelle che aggiungi dopo, e
  conta anche il **«Non misurato»**), **risparmio del fotovoltaico**, le barre
  dei circuiti e **il conto voce per voce** come in bolletta.
- **`custom:casa-elettrodomestico`** — lavatrice, lavastoviglie, forno,
  asciugatrice, TV, boiler: stato, **ultimo ciclo** (fine, durata, consumo,
  costo), cicli, tempi e costi di oggi, ieri, mese e mese prima.

Nascono dalle schede di [Simonz82](https://github.com/Simonz82/smart-home-cards),
che le lascia libere: qui sono state portate dentro a casa-tile (niente secondo
file da installare) e ampliate.

### Come si aggiungono

Nell'editor della casella, linguetta **Tocco** → *Cosa fa quando la tocchi*:

- **Apri la scheda elettrodomestico (si prepara da sola)**
- **Apri la scheda energia della casa (si prepara da sola)**

La scheda si compila da sola partendo dall'entità della casella: trova la presa
che misura (anche risalendo dal dispositivo, se hai scelto i kWh), il disegno
giusto dal nome (lavatrice, lavastoviglie, asciugatrice, forno…) e i sensori qui
sotto, se ci sono. Poi la voce diventa «Apri un pop-up mio» e la scheda la
ritocchi nella linguetta **Pop-up** come tutte le altre.

### I sensori se li fa la scheda

Dalla **2.87** non serve più preparare niente a mano: gli aiutanti di Home
Assistant li crea la scheda, con due tasti.

**1. La tariffa, una volta sola.** Nell'editor di `casa-energia`, riquadro
**La tua tariffa**: scrivi le voci come stanno in bolletta — energia, rete e
oneri, accise, IVA, quota fissa al giorno — e premi **Scrivi la tariffa**. Il
totale per kWh lo calcola lei. Se gli aiutanti dei prezzi non esistono li crea,
se ci sono riscrive il valore.

Quel prezzo vale **per tutta la casa**: le schede degli apparecchi e delle prese
lo leggono da qui e non te lo richiedono. Su un apparecchio conta la **sola
energia** (tasse e quota fissa si pagano una volta sola, e le conta la scheda
grande: se le mettessi anche lì le pagheresti due volte).

**2. I contatori.** Riquadro **Crea i sensori base**: scegli da quale sensore dei
**kWh** parte la casa e premi **Crea contatori e costi**. Nascono i contatori di
ora, oggi, settimana, mese e **bolletta** (con `always_available` già acceso), più
il costo di ogni periodo — con la **quota fissa** contata sui giorni giusti.
Nello stesso riquadro puoi indicare il **sensore dei pannelli** e quello della
**batteria** (uno o più d'uno: se sono tanti li somma), e avrai i kWh arrivati da
lì, di oggi, della settimana e del mese.

Sulle schede degli apparecchi e delle prese il tasto si chiama **Crea statistiche
e costi** e fa la stessa cosa in piccolo: i kWh di oggi e del mese. Se la presa
non conta i kWh (capita spesso con le Tuya) se li ricava dai Watt; se li conta in
**Wh** li converte.

**Il costo non ha un sensore.** Sono i kWh per il prezzo, e il conto lo fa la
scheda mentre la guardi: un aiutante in meno per ogni periodo, e cambiando la
tariffa si aggiorna tutto da solo.

**Quello che crea è roba normale di Home Assistant**: la ritrovi in *Impostazioni
> Dispositivi e servizi > Helper*, entra nel backup, e da lì si modifica. Premere
i tasti due volte non fa danni: quello che c'è già lo riusa.

**Per cancellare** c'è **Cancella gli aiutanti di questa scheda**: ti mostra
l'elenco con una casella per ognuno e quanto segna adesso, e butta solo quelli che
spunti. I prezzi non li tocca mai. Prima di cancellare si segna i valori: se li
rifai, ripartono da lì invece che da zero.

> **Il nome conta.** Quando Home Assistant crea un contatore gli mette davanti il
> nome del dispositivo della sorgente: chiedi «Lavatrice energia oggi» e nasce
> `sensor.presa_cucina_lavatrice_energia_oggi`. Con un nome diverso lo storico
> resta orfano e il contatore riparte da zero. La scheda se ne accorge e **lo
> rinomina da sola** subito dopo averlo creato — ed è anche il motivo per cui
> cancellando e ricreando un contatore con lo stesso nome i valori tornano al loro
> posto: le statistiche nel database sono legate al nome, non all'aiutante.

### L'ultimo ciclo di un elettrodomestico

Fine, durata, consumo e costo dell'ultimo lavaggio (o dell'ultima infornata) si
accendono spuntando **Segui i cicli** nell'editor. La scheda crea la soglia che
dice quando l'apparecchio sta lavorando, un contatore per il ciclo, tre memorie e
un'automazione che le riempie.

Un template *a trigger* — quello che serviva prima — **dall'interfaccia non si può
creare**, e infatti la stessa cosa si ottiene con pezzi normali. Le due attenzioni
che ci sono volute, e che adesso sono dentro:

- **Forno e lavatrice si fermano e ripartono di continuo** (la resistenza che
  stacca, l'ammollo). Il ciclo si chiude solo dopo **alcuni minuti di fermo vero**,
  e l'ora di fine è quella dello spegnimento, non di quando scade l'attesa.
- **Il contatore si azzera alla fine, non alla partenza**, se no una ripartenza a
  metà ciclo butta via quello che hai già consumato.

Mentre lavora il riquadro diventa **Ciclo in corso** e si muove: quanto è durato
finora, quanti kWh e quanto sono costati.

### Se preferisci farteli a mano

Chi vuole scrivere i sensori nel file YAML trova tutto pronto in
[`esempi/luce/`](esempi/luce/): `luce.yaml` da copiare in `/config/packages/`,
`luce.jinja` in `/config/custom_templates/`, e in cima all'esempio l'elenco dei
nomi da cercare e sostituire con i tuoi. Serve ancora se vuoi il **conto della
bolletta voce per voce** (`sensor.costi_luce_oggi` con gli attributi `energia`,
`rete_e_oneri`, `accise`, `quota_fissa`, `iva`): quello i tasti non lo fanno,
perché un helper template dall'interfaccia non può avere attributi propri.

**I contatori vogliono `always_available: true`.** Se il sensore di partenza
sparisce per qualche minuto (stacco di corrente, riavvio del dispositivo), un
contatore senza quell'opzione riparte dal valore nuovo e **perde i kWh del buco**.
Per rimetterli in pari: `utility_meter.calibrate` col valore vero, che si legge
dalle statistiche del sensore di partenza. I tasti lo accendono da soli.

**Una presa per due macchine?** Se una presa sola misura due macchine (per
esempio lavatrice e asciugatrice), crea un sensore **«Lavatrice potenza netta»** =
i W della presa quando l'altra è ferma, 0 quando lavora (in fondo a
[`luce.yaml`](esempi/luce/luce.yaml) c'è già, commentato). **Senza
`device_class`**, se no il top consumo conta la presa due volte. Poi nella scheda
della lavatrice usi quel sensore come presa.

### Le opzioni di casa-energia

| Opzione | Cosa fa |
|---|---|
| `power_entity` | **obbligatoria**: W della casa |
| `max_power` | fondo scala della barra (es. 3300 con 3 kW) |
| `periods` | righe `label` / `energy` / `cost`: la 2ª è «Oggi», la 4ª «Mese» |
| `periods_prev` | come sopra, per «ieri» (con `energy_attr: last_period`) |
| `circuits` | barre: `label`, `entity` (W), `max` |
| `top_auto` | `true` = chi consuma di più lo trova da sola fra tutti i sensori di potenza |
| `top_exclude` | pezzi di entity_id da non contare (produzione, batterie…); c'è già una lista di serie |
| `top_include` | entità da contare comunque |
| `top_min_w` | sotto questi W non è «top» (di serie 5) |
| `unmeasured_label` | nome della voce «Non misurato» |
| `bill_today`, `bill_month` | i sensori col conto voce per voce (`sensor.costi_luce_oggi` / `_mese`); se mancano, il conto lo fa la scheda con la tariffa |
| `bolletta_energia`, `bolletta_costo` | i kWh e gli euro del periodo della bolletta |
| `pannelli_oggi` · `_settimana` · `_mese` | i kWh arrivati dai pannelli (riga «Dai pannelli») |
| `batteria_oggi` · `_settimana` · `_mese` | i kWh restituiti dalla batteria (riga «Dalla batteria») |
| `risparmio_oggi`, `risparmio_mese` | il risparmio del fotovoltaico in euro |
| `barre_vive` | `true` = le barre non sono un elenco fisso: fa vedere le prese più accese del momento |
| `barre_quante` | quante barre con `barre_vive` (di serie 6) |
| `barre_in_ordine` | `false` = tiene l'ordine che hai messo tu invece di mettere in cima la più accesa |
| `pannelli_entita`, `batteria_entita` | da quali sensori nascono i contatori qui sopra (uno o un elenco) |
| `settings_sections` | cosa c'è nell'ingranaggio (es. gli aiutanti del prezzo) |
| `notification_path` | se c'è, compare il tasto per andare alla tua pagina delle notifiche |

### Le opzioni di casa-elettrodomestico

| Opzione | Cosa fa |
|---|---|
| `power_entity` | **obbligatoria**: W della presa (o un altro numero, vedi sotto) |
| `artwork` | `washer`, `dishwasher`, `dryer`, `oven`, `tv`, `boiler` |
| `threshold_run`, `threshold_standby` | W sopra cui è «in funzione» / «in standby» |
| `max_power` | fondo scala della barra |
| `power_label`, `power_unit`, `power_decimals` | per mostrare nella barra altro dai W (es. `Tempo residuo`, `min`) |
| `live.state_entity` | stato vero dell'apparecchio (integrazioni LG, Bosch/Home Connect…) |
| `state_map` | traduce gli stati: `In funzione: {mode: running, label: IN FUNZIONE}` |
| `live.extra` | righe in più: `entity`, `label`, `attribute`, `value_map`… |
| `cycle_sensor`, `cycle_attrs` | l'ultimo ciclo: attributi `terminato`, `tempo_ciclo`, `consumo_ciclo`, `costo_ciclo` |
| `period_attrs` | tempi e costi per oggi / ieri / mese / mese prima |
| `stats.cycles_today`, `stats.cycles_month` | quanti cicli |
| `ciclo` | l'ultimo ciclo fatto dalla scheda: `fine`, `durata`, `consumo`, `contatore`, `inizio` |
| `soglia_acceso` | il binary_sensor «sta lavorando» che fa da sveglia al ciclo |
| `oggi_energia`, `mese_energia` | i contatori dei kWh (il costo lo calcola la scheda) |
| `prezzo_entita` | il prezzo in €/kWh: di solito quello della scheda principale |
| `periodi` | quali periodi creare col tasto: `["oggi", "mese"]` |

### La pagina Energia di Home Assistant

La pagina Energia di HA ha un solo «costo» per la rete e non sa niente di quote
fisse. In **Impostazioni → Plance → Energia → Rete → costo** puoi scegliere
**«Usa un'entità che tiene traccia dei costi totali»** e mettere:

- `sensor.costo_rete_bolletta` per vedere **quanto paghi davvero** (con la quota
  fissa, che entra a mezzanotte), oppure
- `sensor.costo_energia_pura` per vedere **solo l'energia**, senza tasse.

Il conto completo, diviso nelle voci, resta nella scheda casa-energia.

## Novità della 2.88.1

**Le schede si costruiscono i sensori da sole.** Prima bisognava preparare a mano
un pacchetto YAML di trenta sensori; adesso bastano due tasti, e quello che creano
sono normali aiutanti di Home Assistant.

- **La tariffa si scrive sulla scheda**, voce per voce come in bolletta, e vale per
  tutta la casa: apparecchi e prese leggono il prezzo da lì.
- **Il costo non ha più un sensore**: sono i kWh per il prezzo, e il conto lo fa la
  scheda mentre la guardi. Un aiutante in meno per ogni periodo.
- **I nomi si sistemano da soli.** Home Assistant mette davanti il nome del
  dispositivo e il contatore nuovo perde lo storico del vecchio: adesso la scheda
  lo rinomina subito dopo averlo creato.
- **L'ultimo ciclo senza template a trigger**: soglia, contatore, tre memorie e
  un'automazione. Regge gli apparecchi che si fermano e ripartono (forno,
  lavatrice): il ciclo si chiude solo dopo alcuni minuti di fermo vero e il
  contatore si azzera alla fine, non alla partenza. Mentre lavora si vede il
  **ciclo in corso**.
- **Pannelli e batteria**: due righe nuove con i kWh arrivati da lì, oggi, questa
  settimana e questo mese. Se le sorgenti sono più d'una le somma.
- **Le barre dei circuiti**: quante ne vuoi (non più quattro), si trascinano per
  ordinarle, e c'è **Scegli le barre da sola** — fa vedere le prese più accese del
  momento, così se parte il forno la sua barra compare da sé.
- **Cancella scegliendo**: l'elenco degli aiutanti con una casella per ognuno e il
  valore che segna, invece di prendere o lasciare. Prima di cancellare si segna i
  valori, così ricreandoli ripartono da lì.
- **La quota fissa si conta sui giorni giusti** (dal calendario, non da quando è
  nato il contatore) e il menù dei prezzi non propone più le voci che sono solo
  ingredienti del totale.
- Il sensore dei kWh e quelli dei pannelli **si cercano scrivendo**, e accettano
  anche i contatori in **Wh** (li converte lei).
- **Le riparazioni «l'unità è cambiata», spiegate prima che succedano.** Un
  contatore creato mentre l'apparecchio è **spento** nasce senza unità di misura —
  la prende solo al primo conto vero — e quando l'unità arriva Home Assistant
  chiede di sistemare le statistiche, una richiesta per contatore. Provato: non si
  può evitare, né aspettando che la sorgente dia un numero né con
  `utility_meter.calibrate`. Se l'apparecchio sta lavorando il problema non si pone.
  Quindi adesso la scheda **te lo dice mentre crea**, con la risposta da dare:
  «aggiorna l'unità senza conversione». Succede una volta sola per contatore.


## Novità della 2.34

Tre cose nuove nella scheda **casa-elettrodomestico**, più due numeri che si
leggevano male.

- **Il ciclo in corso non sta più a trattini.** Il riquadro dell'ultimo ciclo,
  mentre l'apparecchio lavora, diceva quattro trattini: i conti veri li fa il
  sensore del ciclo, e quelli arrivano solo alla fine. Ma l'apparecchio, intanto,
  i suoi numeri li dice. Con il blocco `ciclo_live` (cinque campi nell'editor:
  energia, minuti fatti, minuti che mancano, programma, fase) il titolo diventa
  **CICLO IN CORSO**, sotto compare *programma - fase*, e le quattro righe dicono
  l'ora di fine prevista, la durata di adesso, i kWh già consumati e quanto sono
  costati. Il costo usa lo stesso prezzo del conto di fine ciclo, quindi il numero
  che vedi crescere e quello che resta scritto alla fine sono coerenti.
- **Un disegno per il deumidificatore**: torre con la griglia dell'aria, la
  ventola che gira dietro alle lamelle, le gocce che cadono nella tanica e l'acqua
  che ondeggia. Come gli altri, si muove solo mentre l'apparecchio lavora.
- **La seconda barra non è più solo l'avanzamento del programma**: accetta
  qualunque numero da 0 a 100 e adesso ha il suo nome (`progress_label`). Su un
  deumidificatore ci va l'umidità della stanza, accanto ai watt.
- **La riga Consumo veniva tagliata** ("CONSU... 1.02 k..."): il riquadro era
  troppo stretto per il valore più lungo. Corretto misurando il testo alla
  larghezza di un telefono, non a occhio.
- **Il costo ora ha la virgola** della tua lingua, come gli altri numeri della
  scheda (0,29 € e non 0.29 €).

## Novità della 2.31

Un giro di controlli su tutta la scheda, **impostazione per impostazione**: ognuna
provata davvero, disegnando la casella senza e con, e guardando se cambia
qualcosa. 124 impostazioni fra la casella e le due schede dei consumi. Quello che
non tornava è corretto qui.

- **Le scritte si leggono anche in tema chiaro.** Nome e valore prendevano il
  colore del tema di Home Assistant, che in tema chiaro è scuro: veniva scuro su
  fondo scuro. Adesso la casella sceglie il colore solo quando quello del tema non
  staccherebbe abbastanza dal fondo; per il resto lascia fare al tema.
- **I numeri nella tua lingua**: 1.234,5 invece di 1234.5, e il simbolo della
  valuta (EUR -> euro, USD -> dollaro) al posto della sigla. Vale anche per
  `casa-energia` e `casa-elettrodomestico`.
- **I chilometri delle persone** (distanza da casa e sensore del percorso) li
  scrive **solo la disposizione Persona**: adesso le due impostazioni compaiono
  soltanto lì, invece di restare in mezzo senza fare niente.
- **Il grafico** non viene più proposto dove non può funzionare (luci,
  termostati): lì lo stato non è un numero.
- **Il cielo del meteo**: forza e entità compaiono solo se il cielo è acceso,
  come tutte le altre coppie interruttore -> dettaglio.
- **Un colore scritto a mano nello YAML** (`colore: #ff0000`, senza virgolette)
  non sparisce più: per lo YAML quel `#` è un commento e il valore restava vuoto.
- **I nomi dei colori CSS** (tomato, gold...) non diventano più neri quando la
  casella li scurisce o li rende trasparenti.
- **La soglia d'allarme dei consumi** non scattava mai se il sensore era non
  disponibile.
- **Le due schede dei consumi**: dicono a Home Assistant quanto sono alte (il
  cursore del Layout nelle viste a sezioni), seguono la lingua di Home Assistant, e
  si ridisegnano una volta sola invece che a ogni cambio di stato della casa.
- **La finestra Consumi avvisa** quando le prese sommate danno più del totale
  della casa: di solito vuol dire una presa contata due volte.
- Piccole: l'anteprima della foto di sfondo apriva la galleria dell'icona; il
  pop-up riaperto lasciava attaccato per sempre un ascolto del tasto Esc; nelle
  viste vecchie (masonry) la casella del lettore musicale diceva di essere alta
  la metà di quello che è.

## Novità della 2.30

- **«Crea i sensori base» non sceglie più a caso il sensore dei kWh.** La tendina si metteva sul primo in ordine alfabetico (che in casa può essere una batteria: premendo il tasto ti ritrovavi i contatori sull'apparecchio sbagliato). Adesso la prima voce è vuota e il suggerimento arriva dalla presa della scheda (`..._power` → `..._energy`). Anche qui il prezzo è una tendina con i valori scritti accanto.

- **Ieri compare subito** nella settimana, senza aspettare la prossima mezzanotte: finché non è finito nell'attributo lo leggo dai campi «_ieri», cioè gli stessi numeri della riga Ieri qui sopra. E i cicli di oggi li prendo dal contatore, non dal conteggio interno: prima la stessa finestra diceva 1 sopra e 0 sotto.

- **La settimana completa, giorno per giorno**, nelle statistiche
  dell'elettrodomestico: sette righe (oggi e i sei giorni prima) con cicli,
  tempo e costo. Non vuole 28 entità come nella card di partenza: legge un
  attributo solo del sensore del ciclo (`giorni`, chiave 0 = lunedì), scritto a
  mezzanotte col conto del giorno appena finito. L'esempio in `esempi/luce` lo crea.
- **L'«Ultimo ciclo» si svuota quando ne comincia uno nuovo**, invece di tenere
  i numeri del lavaggio prima mentre l'apparecchio lavora. Lo storico resta
  nelle statistiche.
- **Tasto «Reset contatori»**: con uno script legato a `reset_script`, l'ingranaggio
  azzera ultimo ciclo, cicli, tempi e costi di quell'apparecchio (l'esempio manda
  l'evento `casa_tile_azzera` e ricalibra i contatori).

## Novità della 2.29

- **Le prese del «Top consumo» si scelgono a clic.** Due voci nuove nell'editor:
  *Prese da contare sempre* (`top_include`, anche se il loro nome finirebbe negli
  esclusi) e *Parole che fanno escludere un sensore* (`top_exclude`). Prima si
  potevano cambiare solo scrivendo il YAML a mano.

## Novità della 2.28

- **La finestra «Stato» non è più muta** per gli apparecchi che conosci solo dalla presa: mostra i Watt di adesso e se sta lavorando, e spiega che programma, tempo residuo e porta arrivano solo dall'integrazione dell'apparecchio.

- **Il grafico del pop-up adesso parla.** Passandoci sopra col mouse (o tenendo
  premuto col dito e trascinando) compare il mirino con **l'ora e i Watt** di
  quel punto. Prima era un disegno muto.
- **L'ingranaggio non apre più una finestra vuota.** Se la scheda ha un prezzo
  scelto lo mostra (si tocca e si cambia); se non c'è proprio niente, lo dice e
  spiega dove si scelgono le cose, invece di restare muta.

## Novità della 2.27

- **Il «periodo precedente» sa mostrare anche il costo del periodo chiuso** (`cost_attr`, di solito `last_period`): serve alla bolletta, che arriva quando il contatore è già ripartito.

- **Riga nuova: «Bolletta».** I kWh e gli euro del **periodo della bolletta**, che
  non è il mese solare: chi paga ogni due mesi il mese non gli dice niente.
  Vuole due contatori (`utility_meter`) col ciclo **bimestrale**, uno sui kWh e
  uno sul costo, da scegliere nell'editor. Si azzerano da soli quando comincia
  il bimestre nuovo — non quando paghi, quello Home Assistant non lo sa.

## Novità della 2.26

- **Riga nuova: «Consumo mese».** I kWh presi dalla rete da inizio mese, accanto
  a quelli di oggi. Si accende dall'editor come tutte le altre.

## Novità della 2.25

- **La riga «PV + tasse» adesso si chiama «Paghi».** Quel «PV» serviva solo a distinguerla dalla riga «Energia + tasse (senza pannelli)»: da sola non voleva dire niente. Il numero è lo stesso: tutto compreso, coi pannelli già scalati.

- **Le caselle di «Crea i sensori base» adesso si salvano.** Erano solo comandi per il tasto: cambiarle non toccava la configurazione, quindi Home Assistant teneva spento il tasto Salva e la scelta si perdeva riaprendo. Ora il sensore dei kWh, la soglia in Watt e il prezzo da usare sono impostazioni come le altre.

- **Il prezzo con cui si calcolano i costi adesso si sceglie.** Nell'editor
  dell'elettrodomestico c'è una tendina con tutti gli aiutanti in €/kWh che hai
  in casa, ognuno col suo valore scritto accanto: di solito qui si vuole la
  **sola energia, senza tasse**, e il conto completo si guarda nella scheda della
  casa. Prima sceglievo io, e sceglievo sempre il prezzo pieno.

## Novità della 2.24

- **L'elettrodomestico può restare «solo attuale».** Se nell'editor togli la
  spunta a tutte le righe dell'«Ultimo ciclo», adesso sparisce tutto il riquadro:
  restano il disegno, lo stato e la potenza del momento. Prima la colonna
  restava lì vuota col titolo, e togliendo l'ultima spunta tornavano tutte.

## Novità della 2.23

- **La casella del prezzo non inventa più numeri.** Se il prezzo in €/kWh esiste già, la casella fa vedere quello vero (e si cambia da lì); se non c'è, resta un numero qualunque da correggere guardando la bolletta.

- **L'editor visuale delle schede del pop-up non si apre più in YAML.** La misura in punti è roba mia: dentro a una scheda di Home Assistant (una griglia, una tile) faceva dire «la chiave casa_misura non è prevista» e costringeva a lavorare in YAML. Adesso per le schede che non sono mie la misura si scrive nella loro lingua (`grid_options`: colonne e righe), e quelle già fatte si traducono da sole appena apri le impostazioni.

- **«Crea statistiche e costi» anche per gli elettrodomestici.** Dall'editor:
  una soglia in Watt dice quando l'apparecchio lavora, e la scheda crea da sola
  gli helper per cicli, tempo e costo di oggi e del mese. I kWh, se la presa non
  li dà, se li calcola dai Watt.
- Nel pop-up delle statistiche, **tempo e costo si possono leggere da entità
  proprie** (`period_entities`) e non solo dagli attributi del sensore del ciclo.

## Novità della 2.22

- **«Crea i sensori base».** Un tasto nell'editor di `casa-energia`: scegli il
  sensore dei kWh e il prezzo, e crea da solo in Home Assistant i contatori di
  ora/oggi/settimana/mese, il costo di ogni periodo e di ieri, e il prezzo in
  €/kWh. Poi si aggancia tutto da solo alla scheda. Chi c'è già lo riusa.

## Novità della 2.21

- **Il pop-up si veste come vuoi tu.** Nell'editor di `casa-energia` e
  `casa-elettrodomestico` ci sono cinque cose nuove: **tinta della finestra**,
  **quanto è trasparente**, **colore delle scritte**, **quanto scurisce** e
  **quanto sfoca** quello che sta dietro. Vuoi la finestra di vetro sulla foto
  della plancia? Tinta scura, trasparenza 30, sfocatura 12.
- **Il colore di ogni riga lo scegli tu.** Accanto al nome della riga, nella
  lista che gia' si trascinava, c'e' la casellina del colore e il tasto **↺**
  per rimettere quello di serie (`colori_righe`).

## Novità della 2.20.1

- **Il mirino del grafico ora funziona col dito.** Sul telefono il valore compariva e spariva subito e non si poteva trascinare: il browser prendeva il gesto per uno scorrimento della pagina. Adesso sopra al grafico c'è una zona sua, il mirino resta agganciato al dito finché lo tieni giù, il cartellino sparisce appena alzi il dito, e trascinare sul grafico non fa più partire l'azione della casella (un tocco secco invece sì, come prima).

## Novità della 2.20

- **Volume del gruppo di casse, rifatto.** Il cursore del gruppo è suo e non segue più il capogruppo: spostandolo, ogni cassa sale o scende **dello stesso tanto**, ognuna dal suo volume. Una cassa portata a zero e poi rialzata torna dov'era, e chi era zittito apposta resta zittito. Tasti **− e +** per spostarlo di 1, percentuali accanto a ogni cassa, una piccola **vibrazione** al tocco sul telefono. La posizione del cursore è la stessa della ytmusic-card, se le hai aperte tutte e due.
- **Editor a clic** per le schede `casa-energia` e `casa-elettrodomestico`, senza più YAML: impostazioni, circuiti, e **le righe del riquadro si trascinano** dalla maniglia ⠿ per metterle in ordine, si spengono con la spunta e **si rinominano come vuoi** (`righe`, `nomi_righe`). Nell'elettrodomestico c'è anche **«Prepara da solo»**.
- **Riquadro «Oggi» a scontrino**, una riga per colore: Consumo · Energia + tasse (senza pannelli) · Risparmio pannelli (oggi · mese) · PV + tasse (quello che paghi) · Energia attuale · Mese (+ tasse) · Top consumo. Colorati anche l'Ultimo ciclo e il conto voce per voce.
- Nelle righe strette la scritta si accorcia coi puntini e la cifra resta intera; le barre dei circuiti non vanno sotto zero.

## Novità della 2.19

- **Due schede nuove, `casa-energia` e `casa-elettrodomestico`**, dentro allo stesso file: vedi [Energia ed elettrodomestici](#energia-ed-elettrodomestici).
- Nel **Tocco** due voci che preparano da sole il pop-up con la scheda giusta.
- **Top consumo automatico** con la voce «Non misurato», **conto voce per voce**, **solo energia** e **+ tasse**, **risparmio del fotovoltaico** oggi e mese.
- Esempi pronti dei sensori in [`esempi/luce/`](esempi/luce/).

## Novità della 2.18

Le foto e le scritte a pezzi liberi, sistemate dove davano fastidio.

- **Larghezza e altezza della foto, ognuna per conto suo.** Scegliendo un
  pezzo figura (l'icona o il timbro) nel riquadro «Dove va ogni pezzo»
  compaiono due maniglie gialle sui lati: quella a destra allarga o
  stringe, quella sotto alza o abbassa. Tirandole fino al bordo della
  casella c'è una **calamita** che le attacca al bordo. La foto prende
  esattamente il riquadro che disegni, intera.
- **Le foto hanno gli angoli tondi** come la casella, qualunque
  ingrandimento abbiano: prima, ingrandita tre volte, una foto diventava
  quasi un tondo.
- **La foto segue la stessa regola delle scritte.** Sulla plancia la
  casella può avere un'altra misura da quella su cui l'hai composta:
  foto e scritte crescono e calano insieme, e la foto non cambia forma.
- **Le scritte non restano più piccole nei pop-up.** Il pop-up «sboccia»
  nasce a un quinto della sua grandezza, e le caselle dentro si
  misuravano proprio in quell'istante: si credevano minuscole e
  rimpicciolivano le scritte al minimo, per sempre.
- **Una scritta che si allunga resta nel suo spazio.** Se accendi «Scrivi
  da quanto tempo e in questo stato», o «Acceso» diventa «Acceso da 55
  min», la scritta rimpicciolisce quanto basta per stare dove l'avevi
  messa, invece di finire sotto la foto. E se proprio ci arriva addosso,
  sta davanti.
- **Trasparenza dell'icona o della foto**: nuovo cursore nella linguetta
  **Icona**, da 0 a 90%.

## Novità della 2.17.1

**Tieni premuto per aprire i dettagli**, come la tile di Home Assistant.
Il tocco fa quello che hai scelto — accende, apre il tuo pop-up, lancia
un servizio — e tenendo premuto mezzo secondo si apre la finestra dei
dettagli dell'entità: il cursore grande, lo storico, l'ingranaggio delle
impostazioni. Prima ai dettagli ci arrivavi solo se il tocco era «Apri i
dettagli», quindi su una casella che col tocco apre un pop-up non c'era
strada.

- alzando il dito dopo la pressione lunga il tocco **non parte** anche
  lui: niente luce accesa mentre si aprono i dettagli;
- se il dito si sposta stai scorrendo la pagina, e non succede niente;
- sulla barra, sui tasti e nei riquadri resta il comando di sempre;
- nell'anteprima delle impostazioni tenere premuto continua a staccare
  la scheda per spostarla;
- non la vuoi su una casella? **Tocco → «Cosa fa quando la tieni
  premuta» → Niente**.

## Novità della 2.17

Il lettore, rifatto dove serviva — con Music Assistant alla mano.

- **Il volume del gruppo**, in cima al riquadro «Casse». È il volume del
  capogruppo, come lo mostra Music Assistant nella sua schermata, e si
  manda **una volta sola quando lasci il cursore**: mandarlo mentre
  trascini faceva rifare i conti a MA a ogni comando, e i volumi
  rimbalzavano.
- **Il muto per ogni cassa**, accanto alla sua barra, che si accende del
  colore della casella quando è zittita.
- **Barra a 0 = muto**, e rialzandola il muto se ne va. In Home Assistant
  sono due cose separate, ma una cassa a zero che si sente lo stesso non
  se la aspetta nessuno.
- **Il volume è della cassa, non della sessione.** Con le casse unite la
  casella fa vedere il capogruppo — la coda sta lì e i comandi vanno dati
  a lui — ma cursore e muto restano quelli della *sua* cassa. Prima la
  casella della Veranda, ferma a 0, faceva vedere il volume del PC.
- **La casella non salta più su un lettore che non c'entra.** Senza un
  elenco di casse scelto a mano guardava *qualsiasi* media player della
  casa: bastava che partisse la musica da un'altra integrazione e ci
  saltava sopra. Adesso guarda solo le casse della **sua** integrazione.
- **Chi era zittito resta zittito**: Music Assistant, propagando il volume
  del gruppo, toglie il muto alle casse di sua iniziativa (è un difetto
  suo, [support#6334](https://github.com/music-assistant/support/issues/6334)).
  La casella se ne accorge e glielo rimette — e si fa da parte appena sei
  tu a toccare il muto.

## Novità della 2.15.4

**«Sboccia dalla casella» adesso sboccia davvero, tutte le volte.** Il
punto da cui deve nascere la finestra veniva misurato mentre l'animazione
era già partita — ma «sboccia» comincia dalla finestra rimpicciolita al
22 % e spostata, e chiedere a quel punto dov'è la finestra restituisce
quella rimpicciolita. Il punto veniva fuori diverso a ogni apertura
(66 px −474, poi 248 px 289, poi 106 px −306): una volta nasceva dalla
casella, la volta dopo arrivava da fuori schermo — e sembrava l'apertura
normale.

Adesso l'animazione si spegne, la finestra si misura dov'è davvero, e poi
riparte. Cinque aperture di fila danno lo stesso identico punto. E la
prima volta, quando le schede del pop-up si montano e la finestra cresce,
la misura si rifà appena il contenuto c'è.

## Novità della 2.15.3

- **Il pop-up si riapriva senza animazione, o non si apriva proprio.**
  Chiudendo, la finestra resta a schermo il tempo di farsi vedere andare
  via, e un timer la spegne alla fine. Se nel frattempo la riaprivi, quel
  timer partiva lo stesso e te la richiudeva sotto il naso; e il velo non
  era mai passato per «chiuso», quindi il browser non rifaceva
  l'animazione e la finestra compariva di colpo — quella che sembrava
  «stock». Adesso riaprire ferma il timer della chiusura e fa
  ricominciare l'animazione da capo, «sboccia» compresa.
- **Anche i cursori dell'editor si muovono solo dal pallino**: la
  luminosità della ruota dei colori e la trasparenza delle schede del
  pop-up, come quelli della casella. Quelli delle impostazioni numeriche
  (intensità, velocità, ore del grafico…) sono i cursori di Home
  Assistant e restano come sono ovunque in Home Assistant.

## Novità della 2.15.2

**I cursori si muovono solo dal pallino.** Una barra normale salta al
punto dove la tocchi: sul telefono, mentre si scorre la pagina, basta
sfiorarla e il valore cambia senza che uno se ne accorga — una batteria
ritrovata al 5 %. Adesso il tocco che non parte dal pallino non muove
niente e non manda nessun comando. Vale per il cursore della casella
(luce, volume, tapparella, valore impostabile), per i due del colore e
per il volume di ogni cassa nel riquadro del gruppo. Il pallino ha un
dito di margine attorno, trascinarlo funziona come prima, le frecce
della tastiera pure, e la pagina scorre come sempre.

## Novità della 2.15.1

L'inglese della 2.15 era mezzo: provandola con un Home Assistant in
inglese, metà della card restava in italiano.

- **I tastini del lettore, la scocca e i riquadri**: play, pausa, cerca,
  sfoglia, la coda, le casse, la sorgente, schermo intero. Erano scritti
  dentro all'HTML, e la prima passata aveva guardato solo il testo fra i
  tag: quasi tutte quelle scritte sono `title=`, il fumetto che compare
  col dito sopra.
- **I nomi delle 225 icone** nel selettore: *luce* diventa *light*,
  *tapparella* diventa *roller blind*. La chiave scritta nella plancia
  resta quella italiana — se no si romperebbero le configurazioni
  esistenti — e la ricerca funziona in tutte e due le lingue.
- **Il «da quanto»**: *acceso da 40 minuti* diventa *on for 40 min*.
- **I numeri e le date** seguono la lingua di chi guarda: 1,234.5 per un
  inglese, 1.234,5 per un tedesco. Erano fissi all'italiana.
- **La scocca si riscrive se la lingua arriva dopo.** Home Assistant non
  garantisce l'ordine fra `setConfig` e `hass`: se la casella era già
  disegnata quando arriva la lingua, adesso la rifa'.
- **E se la lingua non si sa ancora, non si sceglie**: prima, un `hass`
  non ancora arrivato voleva dire inglese, e le linguette dell'editor
  — che si scrivono una volta sola — restavano inglesi anche a un
  utente italiano.

In italiano non cambia niente: le 525 scritte hanno la frase italiana
come chiave, quindi quello che leggi è esattamente quello di prima,
verificato casella per casella sulla plancia.

## Novità della 2.15

Dentro cambia tutto, fuori niente: la card fa esattamente le stesse cose di prima.

- **Parla anche inglese.** La lingua la prende da Home Assistant: se il tuo HA è
  in italiano non cambia una virgola, altrimenti nomi delle impostazioni, linguette,
  scritte dei pop-up e voci delle tendine passano in inglese — 265 scritte in tutto.
  Le lingue che non conosciamo ricadono sull'inglese.
- **Il codice è diviso in 22 file** invece di uno solo da quindicimila righe: la
  casella, i disegni, il grafico, il lettore, la finestra, i pezzi liberi, e le
  quattro parti dell'editor. Si ricompone in un file unico quando si costruisce,
  quindi in Home Assistant arriva sempre una risorsa sola.
- **Niente più blocco «solo Italia»** nell'elenco di HACS.

## Novità della 2.14.2

Due correzioni sulla grandezza delle icone.

- **Il disegno non gonfia più la casella.** L'icona è alta il 44% della casella: giusto sulla plancia, dove le righe impongono l'altezza, ma dentro a una griglia che si adatta al contenuto quell'altezza gliel'ha data l'icona stessa — icona più grande, casella più alta, icona più grande ancora. Adesso la casella controlla se ha un'altezza sua (mette il disegno al minimo e al massimo e guarda se cambia) e, dove cresce da sola, il disegno sta alla misura normale.
- **Le tre specie di icona seguono la stessa regola.** Il disegno seguiva `--alt-icona`, mentre l'icona di Home Assistant e l'immagine tua restavano fisse a 60 px: due caselle identiche affiancate, una col disegno e una con l'icona di Home Assistant, venivano una il doppio dell'altra. Nella casella bassa erano già allineate, mancava il caso normale.

## Novità della 2.14

Comporre la casella a mano libera, e le figure che seguono lo stato.

- **Ridimensionare i pezzi si fa tirando l'angolo**, come si spostano: niente più scelta della disposizione da un elenco. Vale per il nome, il valore, l'icona, le misure, la barra, i tasti — e per la casella intera, che sulla plancia si aggancia agli scatti della griglia ma in mezzo scorre liscia.
- **Il numero si può anche scrivere**: grandezza della casella e di ogni pezzo, in punti e in percentuale, per quando l'occhio non basta.
- **Il codice YAML della singola casella**, anche quando sta dentro a una griglia, con la possibilità di applicarne solo un pezzo. E tre modi per replicare una disposizione su un'altra casella.
- **Come si apre il pop-up si sceglie**: sale e sfuma, sboccia dalla casella che hai toccato, entra dal basso, o niente. Con il cursore per la velocità e un tasto per vederla subito, senza salvare.
- **Un'immagine tua al posto dell'icona**, e una seconda **per quando è acceso**: così una gif si muove solo mentre l'apparecchio lavora e sta ferma quando non fa niente. Vale anche per il timbro grande dietro alle scritte, che adesso è la stessa figura e si sposta e si ridimensiona come ogni altro pezzo.
- **L'aspirapolvere esce dalla base**: quando parte, il robot lascia la base, va avanti e indietro e la spazzola gira; quando torna, rientra.

### Correzioni

- **Le casse del gruppo**: la casella dava per scontato di comandare lei il gruppo. Adesso riconosce **chi tiene la coda** (`group_members[0]`): agganciare passa sempre da lì, togliere una cassa non tocca la coda, e il trasferimento è rimasto solo il suo tasto — prima partiva da solo con un tempo fisso e, quando falliva, spegneva il lettore.
- **La casella non salta più sulla cassa appena agganciata**: quella attacca a suonare perché è la stessa musica, non una nuova. E se Music Assistant sposta la sessione su un'altra cassa, la casella la segue invece di restare su una cassa ferma.
- **Il tasto “porta qui la coda” aveva il tondo vuoto**: il suo simbolo stava nel catalogo delle icone e non fra quelli dei tasti.
- **Il fumetto del grafico** compariva anche passando sui tasti sotto.
- **La percentuale sulla barra si può nascondere.**

## Novità della 2.13

Il lettore adesso si comanda tutto dalla casella, senza aprire niente d'altro.

- **La fila dei tastini**: lente, cartella, coda e schermo intero. Si accendono dalla scheda Lettore e, come ogni altro pezzo, si possono prendere e portare dove vuoi.
- **Cerca**: scrivi e trovi brani, album, artisti, playlist e radio. Su un risultato scegli se farlo partire subito, metterlo in coda o partire con la radio.
- **Sfoglia**: le tue playlist, gli album, gli artisti, i preferiti e i consigliati, con l'andare avanti e indietro nelle cartelle.
- **La coda**: si apre a tutta casella. Vedi cosa suona adesso, tocchi un brano per saltarci, e ogni riga ha i tasti per spostarla su, giù, subito dopo, o toglierla.
- **Il cuore**: mette e toglie dai preferiti quello che sta suonando.
- **Schermo intero**: la casella si stacca e si prende tutta la pagina, con la copertina grande dietro. Va bene anche sul telefono.
- **Via la disposizione con la card di YouTube Music incastrata dentro**: chi ce l'aveva passa da sola a quella nostra, con i tastini già accesi.
- **Nelle impostazioni i riquadri restano aperti**: prima, girando un cursore, quello che stavi guardando si chiudeva e dovevi riaprirlo per vedere l'effetto. E l'anteprima adesso segue la cassa che sta suonando davvero, non quella scritta nella casella.

## Novità della 2.12

- **I pezzi liberi non si spostano più da soli quando cambia la loro forma**: tasti e file (volume, comandi, onda) restano fermi per il centro, non per l'angolo — così se un tasto diventa più grande resta in riga con gli altri.
- **I pezzi liberi si rimpiccioliscono con la casella**: le posizioni erano in percentuale ma le scritte no, quindi stringendo la finestra il nome finiva addosso alle misure. Adesso, quando la casella è più stretta di quando l'hai composta, tutto si riduce nella stessa proporzione — come un foglio stampato in scala. Le disposizioni fatte prima imparano la misura di riferimento da sole.

## Novità della 2.11

- **La foto di sfondo perdona le sviste**: l'indirizzo copiato da Windows con le barre rovesciate (`\localoto.jpg`) o senza la barra davanti adesso funziona lo stesso. E con una foto dietro, la tinta sopra diventa un velo invece di coprirla del tutto.
- **Via il minimo e il massimo**: su una casella piccola rubavano spazio al disegno senza aggiungere niente. Il grafico resta.
- **Il grafico ha il suo colore**: prima si tingeva per forza come la casella. Ora nella scheda Grafico c'è la sua ruota — vuota, resta com'era.
- **Impostazioni ordinate nei riquadri**: ogni gruppo sta dentro alla sua cornice, come già facevano «Sensori collegati» e «Come si chiamano le misure». Con quaranta voci di fila non si capiva più dove finiva una cosa e cominciava l'altra. I riquadri che restano senza campi spariscono, cornice compresa.

## Novità della 2.10

- **Il termometro si ferma dove dice la temperatura**: la colonnina non sale più all'infinito, parte dal bulbo e si alza quanto serve (da -10 a 60 °C), e prende il colore della scala — azzurro quando è freddo, arancione e rosso quando scotta. I sensori in Fahrenheit vengono convertiti.

- **Meno roba in mezzo nelle impostazioni**: le voci che dipendono da un interruttore spento non si fanno più vedere. Le tre del grafico compaiono quando accendi il grafico, la scelta della striscia quando accendi la striscia, i secondi della telecamera quando accendi la diretta, e così via. Se un valore è già scritto la voce resta visibile lo stesso, così non diventa un'impostazione che non si può più togliere.
- La freccia «porta qui la coda» si vede solo quando c'è davvero qualcosa da portare: a coda vuota Home Assistant rispondeva *«The queue is empty»* e sembrava rotto.

## Novità della 2.9

- **Disposizione «come la tua ytmusic-card»**: copertina tonda, nome della cassa in alto, titolo grande a sinistra con l'artista sotto, onda del tempo con i minuti ai due capi, tasti tondi col play grosso e pieno,.
- **La copertina ondeggia** mentre suona, come nella ytmusic-card: resta tonda ma il bordo si deforma piano, sale e scende e ruota di un paio di gradi. Da ferma sta ferma.
- Scegliendo quella disposizione si accendono da sole la **copertina tonda davanti** e quella **sfocata dietro**: sono metà di quello che le dà quell'aria, e se erano spente da una disposizione precedente non si vedeva la differenza.
- **La copertina del disco si può spostare** come tutti gli altri pezzi: prima non si prendeva col dito, perché fra i quattro disegni possibili (disegno nostro, icona di Home Assistant, foto tua, copertina) si cercava solo il primo — e con la copertina vera il primo è spento.
- Nel pannello **Casse**: la freccia per **portare la coda su un'altra cassa** (fra lettori Music Assistant) e **Svuota la coda** (vale per tutti i lettori che lo sanno fare).
- Via dall'elenco la vecchia «Musica compatta».

## Novità della 2.8

- **Il riquadro si può vedere a grandezza vera**: per stare nella finestra delle impostazioni si rimpicciolisce, e su una card larga diventava un francobollo — ci si accorgeva di com'era venuta solo dopo aver salvato. Il tasto «Grandezza vera» la mostra com'è davvero, e il riquadro scorre.
- **Funziona anche con l'altezza automatica**: a pezzi liberi sono tutti staccati dal flusso, la casella non ha più niente da misurare e si accartocciava. Adesso si ricorda l'altezza che aveva mentre componevi e la usa come minima.
- **Ogni tasto per conto suo**: play, avanti, indietro, stop, su, giù, «torna alla base»… si prendono e si spostano uno alla volta, non più tutti insieme come un blocco. Il primo che sposti stacca la fila e gli altri restano dove sono.
- **Nel lettore musicale i pezzi si spostano anche in verticale**: nelle disposizioni «Musica» e «Persone» la casella è una griglia e ogni pezzo aveva la sua casellina; staccato dal flusso, si muoveva solo dentro a quella — larga quanto la card, alta un dito. Da qui il «riesco a spostarli solo a destra e a sinistra». A pezzi liberi la griglia non fa più da gabbia.

## Novità della 2.6

- **Anche i pezzi del lettore musicale si spostano**: l'onda del tempo, i tasti del gruppo e della sorgente, l'elenco delle casse e la striscia dei colori. Prima restavano piantati in cima uno sopra l'altro e non c'era modo di prenderli.
- **Le schede del pop-up si riordinano trascinandole**: tieni premuto il puntino a sinistra della riga e la porti dove vuoi, con la riga colorata che ti dice dove finirà. Al posto delle due freccette, che per portare una scheda in cima volevano un clic per posizione.
- **Scheda «Manuale» nel pop-up**: nell'elenco delle schede da aggiungere c'è anche *Manuale — incollo il codice YAML*, come in Home Assistant. Nasce col riquadro del codice già aperto: incolli e la scheda diventa quella. Serve per le schede che non stanno nell'elenco (le tue schede della comunità ci sono già tutte, prese da sole).
- **I pezzi si ridimensionano**: tocchi il nome, il valore, l'icona, la barra, i tasti o una singola misura e sul suo angolo compare un quadratino giallo. Lo tieni premuto e lo tiri in diagonale: il pezzo cresce o rimpicciolisce, dal 40% al 300%. Il punto fermo è l'angolo da cui il pezzo è agganciato, così ingrandendolo non scappa dal posto dove l'hai messo, e le scritte non vanno a capo mentre crescono.
- **La casella nasce già a posto**: 6 colonne per 2 righe, e il disegno prende lo spazio che gli resta davvero invece di una fetta fissa dell'altezza. Se il nome è lungo cede lui — una riga sola coi puntini — ma solo quando davvero non c'è alternativa: l'icona non sparisce più.
- **Tasti rapidi rifatti**: vetro invece di dischetti piatti, si alzano al passaggio del dito e si schiacciano al tocco. Simboli nuovi per «torna alla base» (una casetta) e per le tapparelle (freccia contro una barra: si vede dove va a finire). E il tasto che dice cosa sta succedendo adesso si accende.
- **Simboli in mezzo ai tasti**: erano tutti spostati di un pixel e mezzo a destra, perché il browser mette da solo un riempimento dentro ai bottoni. Si vedeva solo sulle caselle basse, dove il tasto è più stretto del simbolo.
- **Le impostazioni non si annullano più a vicenda**: cambiavi un'opzione e quella di prima tornava indietro, perché ogni gruppo di impostazioni teneva in tasca una copia vecchia della configurazione. Adesso da ogni gruppo si prendono solo i campi suoi.

## Novità della 2.5

- **Posizioni libere**: prendi il nome, il valore, l'icona, la barra o una singola misura e le metti dove vuoi. Il riquadro dove componi copia la misura vera della card sulla plancia, e con un tocco sull'anteprima del pop-up scegli quale casella sistemare (anche quelle dentro alle griglie).
- **Batteria a tacche**: cinque blocchi che si riempiono per davvero (90% = quattro blocchi e mezzo), il fulmine quando carica, una tacca che scorre quando eroga.
- **Misure**: nome tuo per ognuna, colore tuo per ognuna, niente più pastiglia grigia dietro.
- **Tapparella**: la percentuale resta ferma dove l'hai messa, si muove solo il disegno, e il comando parte una volta sola quando lasci il dito.
- **Colori**: ruota di colori vera al posto del selettore lento, e due colori separati per il nome e per il valore.
- **Molto più leggera**: massimo dieci disegni al secondo per casella, storico assottigliato, niente lavoro quando la casella è nascosta. Su una plancia carica siamo passati da migliaia di disegni al secondo a meno di dieci.

## Licenza

MIT
