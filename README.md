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

Dalla **2.88** non serve più preparare niente a mano: gli aiutanti di Home
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

**Sugli apparecchi e sulle prese il costo non ha un sensore.** Sono i kWh per il
prezzo, e il conto lo fa la scheda mentre la guardi: un aiutante in meno per ogni
periodo, e cambiando la tariffa si aggiorna tutto da solo. Sulla scheda della casa
invece i costi sono sensori veri, perché lì servono a un contatore (quello della
bolletta, che deve sommare giorno dopo giorno) e perché ci entra la quota fissa.

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
dice quando l'apparecchio sta lavorando, un contatore per il ciclo, quattro
memorie (kWh, minuti, ora di fine e ora di partenza) e un'automazione che le
riempie: sei aiutanti in tutto.

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
| `reset_script` | lo script del tasto «Reset contatori»: riceve le entità della scheda, quindi uno solo basta per tutte |
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

## Novità della 2.89

**Un riquadro dei messaggi solo, sempre nello stesso posto.** Erano tre, sparsi
per l'editor — uno sotto la tariffa, uno sotto «Capisci da solo», uno sotto i
tasti — e ognuno scriveva nel suo: premevi *Cancella gli aiutanti* e l'elenco con
le caselline si apriva a mezza pagina più su, dove non stavi guardando. Adesso ce
n'è uno, **incollato in fondo all'editor** come una barra di stato: lo usano tutti
i tasti, si porta da solo nella vista quando compare qualcosa, e diventa rosso se
va storto.

**Il tasto «Reset contatori» funziona davvero.** L'opzione `reset_script` c'era da
sempre, ma il tasto passava allo script solo il proprio nome: per sapere *cosa*
azzerare serviva uno script per ogni apparecchio. Adesso gli passa anche **le
entità che la scheda già conosce** — contatore di oggi, del mese, del ciclo e le
memorie — così un solo script vale per tutta la casa:

```yaml
reset_script: script.azzera_conti
```

Lo script riceve `scheda`, `oggi`, `settimana`, `mese`, `ciclo_contatore`,
`ciclo_kwh`, `ciclo_minuti`, `ciclo_fine`: usa quelle che gli servono e lascia
stare le altre.

**Le spunte dicono i numeri veri.** «Segui i cicli» diceva *5 aiutanti*: erano
giusti finché la memoria della partenza non è esistita, adesso sono **6**. E
«conta quante volte parte» diceva *3 per periodo*: sono **2**, più la soglia che
si fa una volta sola.

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

## Le versioni di prima

Il diario si ferma alla 2.30. Quello che e' successo prima sta nelle
[uscite su GitHub](https://github.com/cash83/casa-tile-card/releases),
insieme al codice di ogni versione.

## Licenza

MIT
