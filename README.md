# Casa Tile Card

Casella animata per Home Assistant: **icone che si muovono solo quando la cosa è accesa**, si configura a clic (niente YAML) e ha un pop-up tutto suo dove puoi mettere qualsiasi scheda di Home Assistant.

![versione](https://img.shields.io/badge/versione-2.11.8-blue) ![hacs](https://img.shields.io/badge/HACS-custom-orange)

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
| **Persone** | distanza da casa e sensore del percorso |
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
