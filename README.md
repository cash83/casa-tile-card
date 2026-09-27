# Casa Tile Card

Tre schede per Home Assistant, tutte **a clic** (niente YAML): una casella animata
per qualsiasi entità, e due schede grandi per la **luce di casa** e per gli
**elettrodomestici**.

![versione](https://img.shields.io/badge/versione-2.92.0-blue) ![hacs](https://img.shields.io/badge/HACS-custom-orange)

🇮🇹 Italiano · [🇬🇧 English](README.en.md)

| | |
|---|---|
| ![casa-tile](immagini/casa-tile.png) | **`custom:casa-tile`** — la casella. Icona animata, barra della luminosità, striscia del colore, «da quanto». |
| ![casa-elettrodomestico](immagini/casa-elettrodomestico.png) | **`custom:casa-elettrodomestico`** — un apparecchio o una presa: ultimo ciclo, consumi e costi. |

![casa-energia](immagini/casa-energia.png)

**`custom:casa-energia`** — la luce di casa: watt adesso, consumi, costi, chi sta
consumando di più e le barre dei circuiti.

---

## Installazione

**Con HACS**: HACS → menù in alto a destra → *Repository personalizzate* →
`https://github.com/cash83/casa-tile-card`, categoria **Lovelace**. Poi cerca
**Casa Tile Card**, scarica e ricarica la pagina (Ctrl+F5).

**A mano**: copia `dist/casa-tile-card.js` in `config/www/` e aggiungilo in
*Impostazioni → Plance → Risorse* come **Modulo JavaScript**.

---

## La casella — `custom:casa-tile`

Aggiungi una scheda e cerca **Casa · casella animata**.

**Icone.** 209 in tutto: 63 disegnate a mano più quelle di Home Assistant, con la
ricerca in italiano («tenda» trova la tapparella). La card ne sceglie una
guardando l'entità; puoi mettere la tua, una foto, o toglierla del tutto.
**Si muovono solo quando la cosa è accesa.**

**Quello che sa fare da sola.** Batteria col riempimento e il colore che seguono
la percentuale (e si vede se sta caricando o dando corrente) · meteo con l'icona
e il cielo del momento · colore che segue la temperatura · durate scritte come le
diresti (*1 h 30 min*) · telecamera in diretta dentro la casella.

**Comandi.** Luminosità e striscia del colore per le luci · tasti rapidi per
tapparelle, serrature e aspirapolvere · barra per i valori impostabili ·
comandi musica con copertina, onda del tempo, volume, casse e **multiroom vero**
(togli la cassa che comanda e la coda passa a chi resta, con Music Assistant).

**Aspetto.** 19 effetti di luce con intensità e velocità · due colori (uno per gli
effetti, uno per la scritta) · sfondo a tinta, foto o cielo del meteo ·
**grafico dell'andamento** dietro alle scritte · **ogni pezzo dove vuoi tu**:
nome, valore, icona, barra e misure si trascinano e si ingrandiscono dentro a un
riquadro che ha la misura vera della card.

**Persone.** Anello colorato secondo dov'è, da quanto, e quanti chilometri da
casa — in linea d'aria o su strada.

**Quando è accesa lo decidi tu**: sempre, a un valore esatto, sopra una soglia, o
guardando altre entità.

**Pop-up tuo**: al tocco si apre una finestra dove metti **qualsiasi scheda di
Home Assistant**, vestita come vuoi.

### Le linguette dell'editor

| Linguetta | Cosa c'è |
|---|---|
| **Base** | entità, nome, cosa c'è scritto, quando la casella è accesa |
| **Icona** | quale icona, foto dell'entità, catalogo o immagine tua |
| **Aspetto** | disposizione, effetti, colori, e «Dove va ogni pezzo» |
| **Sfondo** | tinta, trasparenza, foto, cielo del meteo |
| **Comandi** | barra, tasti rapidi, striscia del colore |
| **Grafico** | andamento, ore, area o linea, minimo e massimo |
| **Musica** | comandi, copertina, casse e sorgenti |
| **Persone** | distanza da casa e sensore del percorso |
| **Tocco** | cosa fa al tocco: accendi, dettagli, pop-up, mappa, servizio |

Le linguette che non servono a quell'entità spariscono da sole. In cima c'è una
**ricerca**: scrivi «meteo» e ti dice in quale linguetta sta ogni impostazione.

```yaml
type: custom:casa-tile
entity: light.salotto
```

---

## Energia ed elettrodomestici

Due schede grandi, da mettere nel pop-up di una casella o da sole su una plancia.
Nascono dalle schede di [Simonz82](https://github.com/Simonz82/smart-home-cards),
portate dentro a casa-tile e ampliate.

### `custom:casa-energia` — la luce di casa

Watt adesso · consumi e costi per periodo (ora, oggi, settimana, mese, bolletta) ·
**sola energia** e **+ tasse** · **chi consuma di più**, trovato da solo fra tutte
le prese che misurano, compreso il **«Non misurato»** · **risparmio del
fotovoltaico** · barre dei circuiti · il **conto voce per voce** come in bolletta.

### `custom:casa-elettrodomestico` — un apparecchio o una presa

Stato (in funzione, standby, spento) · barra della potenza · **ultimo ciclo**:
fine, durata, consumo e costo · consumi e costi di oggi, della settimana e del
mese · **Statistiche**: i periodi, anche **ieri** e il **mese scorso**, più gli
ultimi 7 giorni · **Consumi**: i grafici delle 24 ore, del mese e dell'anno ·
tasti di accensione con il nome, uno per ogni presa · avvisi (oblò aperto,
sovraccarico).

**Il costo mostra due cifre**: prima la **sola energia**, e staccata quanto costa
**in bolletta**, tutto compreso. Il prezzo di bolletta la card se lo trova da
sola, non c'è niente da scegliere.

### I sensori se li fa la scheda

Non serve preparare niente a mano: niente YAML, niente pacchetti da copiare.

**1. La tariffa, una volta sola per tutta la casa.** Nell'editor di `casa-energia`,
riquadro **La tua tariffa**: scrivi le voci come stanno in bolletta — energia,
rete e oneri, accise, IVA, quota fissa al giorno — e premi **Scrivi la tariffa**.
Il totale per kWh lo calcola lei. Da lì in poi ogni apparecchio trova il prezzo
già scelto.

**2. I contatori.** Riquadro **I contatori**: scegli da quale sensore dei kWh
parte la casa e premi il tasto. Nascono i contatori di ora, oggi, settimana, mese
e bolletta, più il costo di ogni periodo con la quota fissa contata sui giorni
giusti. Nello stesso riquadro indichi il sensore dei **pannelli** e quello della
**batteria**.

Sugli apparecchi il tasto si chiama **Crea statistiche e costi** e fa lo stesso in
piccolo: i kWh di oggi e del mese, e se spunti **Segui i cicli** anche la soglia
«sta lavorando», il contatore del ciclo, le memorie dell'ultimo ciclo e
l'automazione che lo chiude. Se la presa non conta i kWh (capita con le Tuya) se
li ricava dai Watt; se li conta in Wh li converte.

**Quello che crea è roba normale di Home Assistant**: la ritrovi in *Impostazioni
→ Dispositivi e servizi → Helper*, entra nel backup, e se un domani togli la card
continua a funzionare. Premere i tasti due volte non fa danni: quello che c'è già
lo riusa.

**Per cancellare** c'è **Cancella gli aiutanti di questa scheda**: ti mostra
l'elenco con una casella per ognuno e butta solo quelli che spunti. I prezzi non
li tocca mai, e prima di cancellare si segna i valori: se li rifai, ripartono da
lì invece che da zero.

> **Il nome conta.** Home Assistant mette davanti ai contatori il nome del
> dispositivo della sorgente: chiedi «Lavatrice energia oggi» e nasce
> `sensor.presa_cucina_lavatrice_energia_oggi`. Con un nome diverso lo storico
> resta orfano. La scheda se ne accorge e **lo rinomina da sola** subito dopo.

### Azzerare i contatori

Nell'editor, riquadro **I contatori**, c'è **Azzera i contatori**. Lo script che
serve lo crea la scheda (`script.casa_tile_azzera`): è **uno solo per tutta la
casa** e riceve le entità dell'apparecchio, quindi un apparecchio nuovo funziona
subito. Azzera oggi, la settimana, il ciclo e le memorie dell'ultimo ciclo; il
mese lo tocca solo se glielo chiedi.

### Come si aggiungono

Nell'editor della casella, linguetta **Tocco** → *Apri la scheda elettrodomestico
(si prepara da sola)* oppure *Apri la scheda energia della casa*. La scheda si
compila partendo dall'entità della casella: trova la presa che misura, il disegno
giusto dal nome e i sensori che ci sono.

Oppure la aggiungi da sola alla plancia, e nel suo editor premi **Compila da
solo** partendo da una qualsiasi entità dell'apparecchio.

---

## Chiavi utili

Quasi tutto si fa a clic; queste servono solo se scrivi il YAML a mano.

| Chiave | Cosa fa |
|---|---|
| `righe` | quali righe si vedono nel riquadro, e in che ordine |
| `nomi_righe` | il nome di una riga (vuoto = quello di serie) |
| `prezzo_entita` | il prezzo in €/kWh: di solito quello della scheda principale |
| `reset_script` | lo script di «Azzera i contatori»; se non ne hai uno lo crea la scheda |
| `period_entities` | i contatori di ogni periodo (li scrive il tasto) |
| `ciclo` | le entità dell'ultimo ciclo (le scrive il tasto) |
| `warn_entities` | gli avvisi in fascia: `{entity, on_state, label}` |
| `tasti` | i tasti di accensione: `{entity, nome, icona}` |

---

## Novità

Il diario di ogni versione sta nelle
[uscite su GitHub](https://github.com/cash83/casa-tile-card/releases), insieme al
codice.

## Licenza

MIT
