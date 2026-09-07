# Casa Tile Card

Casella animata per Home Assistant: **icone che si muovono solo quando la cosa è accesa**, si configura a clic (niente YAML) e ha un pop-up tutto suo dove puoi mettere qualsiasi scheda di Home Assistant.

![versione](https://img.shields.io/badge/versione-2.16.3-blue) ![hacs](https://img.shields.io/badge/HACS-custom-orange)

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

## Novità della 2.16.3

**Il volume del gruppo lo tiene Music Assistant, e adesso è il suo.** La
Veranda segnava zero e si sentiva lo stesso: dentro a un gruppo di Music
Assistant il `volume_level` della singola cassa non è quello che decide
cosa esce. Il volume del gruppo ce l'ha Music Assistant, e si chiede e si
cambia con due servizi suoi (`mass_queue.get_group_volume` e
`set_group_volume`).

La riga «Tutte le casse» adesso passa di lì: legge il numero vero quando
apri il riquadro e scrive quello. Sul suo impianto la differenza si vede:
Music Assistant dice 12, la media delle casse direbbe 6.

Per i lettori delle altre integrazioni, che un volume di gruppo non ce
l'hanno, resta com'era: le sposta tutte dello stesso tanto, ognuna dal
suo. E il volume della singola cassa non cambia strada, né qui né nella
casella.

## Novità della 2.16.2

**Ogni cassa il suo volume.** Nella 2.16 la barra della casella era
diventata il volume del gruppo, e non andava bene: la casella della
Veranda, ferma a 0, faceva vedere 25 — la media con le altre, un numero
che non era di nessuno. E muovendola muoveva tutto.

- **La barra della casella è di nuovo il volume della sua cassa.** Anche
  quando la casella fa vedere il capogruppo (la coda sta lì, e i comandi
  vanno dati a lui), volume e muto restano quelli della cassa della
  casella.
- **Il generale sposta tutte dello stesso tanto**, ognuna partendo dal
  suo: alzandolo di dieci, chi era a 50 va a 60, chi era a 0 va a 10.
  Prima spostava in proporzione, e una cassa a zero restava a zero per
  sempre — zero per qualsiasi cosa fa zero.

Il volume di tutte insieme sta dove serve: in cima al riquadro «Casse»,
sopra a quelle delle singole.

## Novità della 2.16.1

**Il volume generale anche dentro al riquadro delle Casse**, in cima
all'elenco: la barra della casella fa già questo, ma con il riquadro
aperto sta sotto e non si vede. La riga «Tutte le casse» compare solo
quando le casse unite sono più d'una, e ognuna resta comandabile per
conto suo, come prima.

## Novità della 2.16

- **Il volume del gruppo, come in Music Assistant.** Con le casse unite la
  barra della casella muoveva solo quella che comanda, e le altre restavano
  dov'erano. Adesso mostra la media e le muove tutte insieme, ognuna
  tenendo la sua differenza: da 60-30-90 portandola a metà vengono
  30-15-45. Il volume della singola cassa resta dov'era, nel riquadro
  «Casse».
- **La casella non salta più su un lettore che non c'entra.** Senza un
  elenco di casse scelto a mano, guardava *qualsiasi* media player della
  casa: bastava che partisse la musica da un'altra integrazione e ci
  saltava sopra. Così la casella di ytube_music_player faceva vedere il
  lettore di Music Assistant mentre il suo era spento. Adesso guarda solo
  le casse della **sua** integrazione — unire casse di integrazioni diverse
  non si può fare comunque, quindi non erano candidate nemmeno prima. Se
  vuoi che ne segua altre, l'elenco a mano continua a comandare lui.

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
