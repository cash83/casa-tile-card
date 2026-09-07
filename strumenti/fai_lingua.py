# -*- coding: utf-8 -*-
u"""GENERO src/lingua.js.

La lezione del primo giro: le chiavi NON si riscrivono a mano. Un
apostrofo tipografico al posto di uno dritto e la traduzione non si
aggancia, in silenzio. Quindi le chiavi le prendo dal codice - sono le
stesse stringhe, prese dal file - e le scrivo con json.dumps, che le
sfugge come si deve.

Le traduzioni le indicizzo per CHIAVE DI IMPOSTAZIONE (mostra_icona,
docked, ...) invece che per frase italiana: cosi' anche se la frase
italiana cambia domani, la traduzione resta agganciata.
"""
import io
import json
import os

REPO = r'C:\Users\tarat\Desktop\cloude\casa-tile-card'
QUI = os.path.dirname(os.path.abspath(__file__))
d = json.load(io.open(os.path.join(QUI, 'da_tradurre.json'), encoding='utf-8'))


def comeARuntime(s):
    """nel JSON le stringhe sono come stanno nel CODICE (con gli \\"): a
    runtime JS le vede con le virgolette vere, e le chiavi devono essere
    quelle di runtime, se no non si agganciano"""
    return s.replace('\\"', '"').replace("\'", "'")


d['etichette'] = {k: comeARuntime(v) for k, v in d['etichette'].items()}
d['parole'] = {k: comeARuntime(v) for k, v in d['parole'].items()}
d['titoli'] = [comeARuntime(v) for v in d['titoli']]
d['voci'] = [comeARuntime(v) for v in d['voci']]

# quella di pannello_sfondo nel codice sta su due righe unite col +:
# l'estrattore ne aveva presa solo la prima
d['etichette']['pannello_sfondo'] = (
    'Sfondo del riquadro casse e sorgenti (vuoto = scuro di serie; '
    'le scritte seguono il colore della scritta)')

STATI = {
    'auto': 'Auto', 'charging': 'Charging', 'cleaning': 'Cleaning', 'closed': 'Closed',
    'cool': 'Cooling', 'discharging': 'Discharging', 'disconnected': 'Disconnected',
    'docked': 'Docked', 'error': 'Error', 'full': 'Full', 'heat': 'Heating',
    'home': 'Home', 'idle': 'Idle', 'not_charging': 'Not charging', 'not_home': 'Away',
    'off': 'Off', 'on': 'On', 'open': 'Open', 'paused': 'Paused', 'playing': 'Playing',
    'recording': 'Recording', 'returning': 'Returning', 'standby': 'Standby',
    'streaming': 'Streaming', 'unavailable': 'Unavailable', 'wired': 'Wired',
    'locked': 'Locked', 'unlocked': 'Unlocked',
    # 'none' e 'unknown' sono "-" e "?": simboli, non si traducono
}

ETI = {
    'acceso_entita': 'On when another entity is active - any one of them is enough (e.g. the watts going out instead of the charge)',
    'acceso_se': 'On only when the entity reads exactly this (e.g. 95)',
    'acceso_sempre': 'Always in colour (even when off)',
    'anima': 'When it animates (icon and effects)',
    'azione': 'What happens when you tap it',
    'camera_diretta': 'Fill the tile with the live camera image',
    'camera_secondi': 'How often the image refreshes (seconds)',
    'carica_entita': 'Which entities mean IT IS CHARGING (usually not needed: a sensor named "charge" is enough)',
    'coda': 'Queue list (needs Music Assistant)',
    'colore': 'Colour when on',
    'colore_rgb': 'Custom colour (only applies if you pick "custom" above)',
    'colore_striscia': 'Which strip to show',
    'colore_testo': "Colour of the name and subtitle (empty = the theme's)",
    'colore_valore': 'Colour of the big value (empty = same as the name)',
    'comandi_media': 'Music controls inside the tile',
    'comandi_rapidi': 'Quick buttons (shutters, locks, vacuum)',
    'cursore_colore': 'Colour strip inside the tile',
    'cursore_max': "Slider tops out at (e.g. 800 instead of the entity's 1200)",
    'cursore_min': "Slider starts at (empty = the entity's minimum)",
    'disposizione': 'How the tile is laid out',
    'distanza_entita': 'Route sensor (Waze, Google): if set, uses road distance',
    'effetto': 'Tile effect',
    'entity': 'Entity (leave it empty if the tile only opens the pop-up)',
    'finestra_apertura': 'How the window opens',
    'finestra_apertura_durata': 'How long the opening takes (milliseconds)',
    'finestra_immagine': 'Pop-up background photo - address, e.g. /local/photo.jpg',
    'finestra_largo': 'Pop-up width in pixels (empty = 560, like everyone else)',
    'finestra_sfondo': 'Pop-up window tint (the cards inside have their own, below)',
    'finestra_titolo': 'Pop-up title',
    'finestra_trasparenza': 'Pop-up transparency (%)',
    'gira_copertina': 'Spin the round album art like a record',
    'grafico': 'Show the history chart inside the tile',
    'grafico_colore': 'Chart colour (empty = same as the tile)',
    'grafico_ore': 'How many hours of history (24 by default)',
    'grafico_stile': 'How it is drawn',
    'grande': 'Big tile',
    'icona': 'Animated icon',
    'icona_entita': 'Use the icon the entity already has in Home Assistant, if any',
    'icona_ha': 'Home Assistant icon (search here; beats the one below)',
    'icona_immagine': 'Image instead of the icon',
    'icona_immagine_accesa': 'Image for when it is on (a GIF works too)',
    'icona_sfondo': 'The big faded icon behind the text',
    'icona_sfondo_forza': 'How visible the icon behind is (%)',
    'indirizzo_web': 'Web address to open (for the "Open a web address" action)',
    'info_entita': 'Readings shown at the bottom (add more here)',
    'info_nomi_auto': 'Also label the readings you have not named yourself',
    'intensita': 'Colour strength (%)',
    'lettori': 'Speakers to choose from (the small buttons at the top)',
    'meteo_entita': 'Weather in the corner (pick the weather entity)',
    'meteo_forza': 'How visible the weather scene is (%) - 0 leaves only the colour',
    'mostra_cursore': 'Slider inside the tile (lights, fans, music, values to set)',
    'mostra_da_quanto': 'Show how long it has been in this state',
    'mostra_distanza': 'Distance from home as the crow flies (people)',
    'mostra_icona': 'Show the icon (turn it off to leave only the text)',
    'multiroom': 'Speakers button: group the speakers and set the volumes',
    'name': 'Display name',
    'nascondi_quanto': 'Hide the little number at the end of the slider',
    'nascondi_valore': 'Hide the value',
    'pannello_sfondo': 'Background of the speakers and sources panel (empty = the usual dark; the text follows the text colour)',
    'pannello_trasparenza': 'Transparency of the speakers and sources panel (%)',
    'popup': 'bubble-card pop-up to open (e.g. #lights)',
    'riquadri_trasparenza': 'Transparency of the search, browse and queue panels (%)',
    'scarica_entita': 'Which entities mean IT IS SUPPLYING POWER (usually not needed: a sensor named "discharge" is enough)',
    'segui_attivo': 'Follow whichever speaker is playing',
    'servizio': 'Service to call (e.g. number.set_value)',
    'servizio_dati': 'Service data, in YAML (e.g. value: 95)',
    'sfondo_adatta': 'How the photo fits',
    'sfondo_colore': 'Tile background (tint)',
    'sfondo_copertina': 'Album art as background',
    'sfondo_immagine': 'Background photo - address, e.g. /local/photo.jpg',
    'sfondo_meteo': 'Use the weather as the background of the whole tile',
    'sfondo_sfocatura': 'How much to blur it (0 = sharp)',
    'sfondo_velo': 'Dark veil over the photo or album art (%) - so the text stays readable',
    'soglia': 'On threshold (W)',
    'sorgente': "Source button: pick the player's input",
    'sottotitolo': 'Subtitle you write yourself (optional)',
    'sottotitolo_entita': 'Subtitle taken from another entity (e.g. the address)',
    'tempo_media': 'Track time and progress bar',
    'trasparenza': 'Tile transparency (%)',
    'usa_foto': "Use the entity's own picture, if it has one (people, album art)",
    'velocita': 'Effect speed (%) - 100 is normal',
    'yt_attrezzi': 'Small buttons: search / browse / queue / fullscreen',
    'yt_cuore': 'Favourite heart',
}

LIBERE = {
    'Volume del gruppo': 'Group volume',
    "Riattiva l'audio": 'Unmute',
    'Silenzia': 'Mute',
    'Alza e abbassa tutte insieme, ognuna dal suo volume': 'Raises and lowers them together, each from its own volume',
    'Tutte le casse': 'All the speakers',
    'Volume di tutte le casse del gruppo': 'Volume of every speaker in the group',
    'pausa': 'pause',
    'acqua': 'water',
    'aereo': 'plane',
    'aggiornamento': 'update',
    'albero': 'tree',
    'allarme': 'alarm',
    'altoparlante': 'speaker',
    'ascensore': 'lift',
    'asciugatrice': 'tumble dryer',
    'aspirapolvere': 'vacuum',
    'assistente': 'assistant',
    'attenzione': 'warning',
    'attrezzi': 'tools',
    'autobus': 'bus',
    'automobile': 'car',
    'bagno': 'bathroom',
    'bambino': 'child',
    'batteria': 'battery',
    'battito': 'heartbeat',
    'benzina': 'petrol',
    'bici': 'bike',
    'bilancia': 'scales',
    'birra': 'beer',
    'bollitore': 'kettle',
    'bombola': 'gas bottle',
    'bussola': 'compass',
    'cacciavite': 'screwdriver',
    'caffe': 'coffee',
    'caldaia': 'boiler',
    'calendario': 'calendar',
    'campana': 'bell',
    'campanello': 'doorbell',
    'campanello_video': 'video doorbell',
    'cancello': 'gate',
    'candela': 'candle',
    'cane': 'dog',
    'carrello': 'trolley',
    'casa': 'house',
    'casa_corrente': 'house power',
    'cassetta_posta': 'letterbox',
    'chiamata': 'call',
    'chiave': 'key',
    'chiave_inglese': 'spanner',
    'ciabatta': 'power strip',
    'condizionatore': 'air conditioner',
    'contatore': 'meter',
    'contatore_luce': 'electricity meter',
    'corrente_ac': 'AC power',
    'corrente_dc': 'DC power',
    'corriere': 'courier',
    'corsa': 'running',
    'cucina': 'kitchen',
    'cuffie': 'headphones',
    'cuore': 'heart',
    'deumidificatore': 'dehumidifier',
    'divano': 'sofa',
    'erba': 'grass',
    'faretti': 'spotlights',
    'filtro_aria': 'air filter',
    'finestra_aperta': 'open window',
    'fiore': 'flower',
    'fornello': 'hob',
    'forno': 'oven',
    'frigo': 'fridge',
    'frigorifero': 'fridge',
    'fulmine': 'lightning',
    'fumo': 'smoke',
    'fuoco': 'fire',
    'gatto': 'cat',
    'gioco': 'game',
    'goccia': 'drop',
    'gruppo': 'group',
    'ingranaggio': 'cog',
    'interruttore': 'switch',
    'irrigazione': 'irrigation',
    'lampadina_accesa': 'bulb on',
    'lampione': 'street lamp',
    'lavastoviglie': 'dishwasher',
    'lavatrice': 'washing machine',
    'lavatrice_mdi': 'washing machine (mdi)',
    'lavoro': 'work',
    'led': 'LED',
    'letto': 'bed',
    'libro': 'book',
    'lucchetto': 'padlock',
    'lucchetto_aperto': 'open padlock',
    'luce': 'light',
    'luna': 'moon',
    'macchina_caffe': 'coffee machine',
    'manopola': 'knob',
    'mappa': 'map',
    'martello': 'hammer',
    'medicina': 'medicine',
    'mela': 'apple',
    'messaggio': 'message',
    'microfono': 'microphone',
    'microonde': 'microwave',
    'misura': 'gauge',
    'moto': 'motorbike',
    'movimento': 'motion',
    'musica': 'music',
    'nebbia': 'fog',
    'neve': 'snow',
    'notifica': 'notification',
    'nuvola': 'cloud',
    'nuvola_cloud': 'cloud',
    'occhio': 'eye',
    'ombrello': 'umbrella',
    'orologio': 'clock',
    'orologio_polso': 'watch',
    'pacco': 'parcel',
    'palestra': 'gym',
    'pannello_solare': 'solar panel',
    'parcheggio': 'parking',
    'pc_fisso': 'desktop PC',
    'persona': 'person',
    'pesce': 'fish',
    'pianta': 'plant',
    'pioggia': 'rain',
    'piscina': 'pool',
    'pompa': 'pump',
    'porta': 'door',
    'porta_scorrevole': 'sliding door',
    'portatile': 'laptop',
    'posizione': 'location',
    'powerstation': 'power station',
    'presa': 'socket',
    'purificatore': 'air purifier',
    'radiatore': 'radiator',
    'regolatore': 'dimmer',
    'ricarica_auto': 'car charger',
    'riciclo': 'recycling',
    'robot_aspirapolvere': 'robot vacuum',
    'robot_mdi': 'robot (mdi)',
    'scale': 'stairs',
    'scena': 'scene',
    'scopa': 'broom',
    'scrivania': 'desk',
    'scudo': 'shield',
    'scuola': 'school',
    'sensore_movimento': 'motion sensor',
    'serranda': 'shutter',
    'serratura': 'lock',
    'sirena': 'siren',
    'sole': 'sun',
    'sole_nuvole': 'sun and clouds',
    'sonno': 'sleep',
    'spazzatura': 'rubbish',
    'spina': 'plug',
    'stampante': 'printer',
    'stampante3d': '3D printer',
    'stampante_3d': '3D printer (mdi)',
    'stanza': 'room',
    'stella': 'star',
    'striscia_led': 'LED strip',
    'sveglia': 'alarm clock',
    'tachimetro': 'speedometer',
    'tapparella': 'roller blind',
    'telecamera': 'camera',
    'telecomando': 'remote',
    'telefono': 'phone',
    'televisore': 'TV',
    'temporale': 'storm',
    'tende': 'curtains',
    'termometro': 'thermometer',
    'termosifone': 'radiator',
    'termostato': 'thermostat',
    'tosaerba': 'lawn mower',
    'tostapane': 'toaster',
    'traliccio': 'pylon',
    'trasferisci': 'transfer',
    'treno': 'train',
    'tv_mdi': 'TV (mdi)',
    'umidificatore': 'humidifier',
    'valigia': 'suitcase',
    'ventilatore': 'fan',
    'vento': 'wind',
    'ventola': 'fan',
    'vino': 'wine',
    'wc': 'toilet',
    'wifi_mdi': 'wifi (mdi)',
    "Immagine di quando e' acceso (anche una gif)": 'Image for when it is on (a GIF works too)',
    'Pausa': 'Pause',
    "Premi il pulsante: si apre la galleria del telefono o le cartelle del PC. In alternativa scrivi l'indirizzo nel campo qui sopra (es. /local/foto.jpg).": 'Press the button: your phone gallery or your PC folders open. Or type the address in the field above (e.g. /local/photo.jpg).',
    'Riproduci': 'Play',
    "Scegli un'altra foto": 'Pick another photo',
    'Scegli una foto dal telefono o dal PC': 'Pick a photo from your phone or PC',
    "Usa un'immagine mia (telefono o PC)": 'Use a picture of mine (phone or PC)',
    'si vede solo mentre lavora: alla base torna quella di sopra': 'it shows only while it is working: back on the dock the one above returns',
    '" non funziona con questa entita.': '" does not work with this entity.',
    'Acceso': 'On',
    'Album': 'Albums',
    'Apri': 'Open',
    'Apri la serratura': 'Unlock',
    'Artisti': 'Artists',
    'Brani': 'Tracks',
    'Brani, album, artisti...': 'Tracks, albums, artists...',
    'Che ne faccio': 'What do I do with it',
    'Chiudi': 'Close',
    'Chiudi a chiave': 'Lock',
    'Consigliati': 'Recommended',
    'Distanza in linea d’aria dal punto che Home Assistant considera casa: su strada e sempre di piu': 'Straight-line distance from the point Home Assistant calls home: by road it is always more',
    'Eccezionale': 'Exceptional',
    'Grandine': 'Hail',
    'La scheda "': 'The card "',
    'Libreria': 'Library',
    'Mostra la coda': 'Show the queue',
    'Nebbia': 'Fog',
    'Neve': 'Snow',
    'Nevischio': 'Sleet',
    'Nuvoloso': 'Cloudy',
    'Parz. nuvoloso': 'Partly cloudy',
    'Pioggia': 'Rain',
    'Pioggia forte': 'Heavy rain',
    'Play / pausa': 'Play / pause',
    'Playlist': 'Playlists',
    'Porta qui la coda che sta suonando': 'Bring the playing queue here',
    'Precedente': 'Previous',
    'Preferito': 'Favourite',
    'Radio': 'Radio',
    'Recenti': 'Recent',
    'Schermo intero': 'Full screen',
    'Sereno': 'Clear',
    'Sfoglia la musica': 'Browse the music',
    'Spento': 'Off',
    'Successivo': 'Next',
    'Temporale': 'Storm',
    'Torna alla base': 'Back to the dock',
    'Tutto': 'Everything',
    'Vento': 'Windy',
    'Ventoso': 'Windy',
    'da poco': 'just now',
    'da un giorno': 'for a day',
    'da {n} giorni': 'for {n} days',
    'da {n} h': 'for {n} h',
    'da {n} h {m}': 'for {n} h {m}',
    'da {n} min': 'for {n} min',
    'Aggiungi tutte le schede che vuoi: sono le stesse di Home Assistant, e le puoi modificare quando vuoi. Per riordinarle tieni premuto il puntino a sinistra e trascinale.': 'Add as many cards as you like: they are the Home Assistant ones, and you can change them whenever you want. To reorder them hold the dot on the left and drag.',
    'Automatica': 'Automatic',
    'Casse': 'Speakers',
    'Casse del gruppo': 'Speakers in the group',
    'Cerca': 'Search',
    "Cerca l'icona: luce, presa, porta, auto...": 'Search the icon: light, plug, door, car...',
    'Colore quando e accesa': 'Colour when on',
    'Contenuto del pop-up': 'Pop-up contents',
    'Dove va ogni pezzo': 'Where each piece goes',
    'In coda': 'Queue',
    'La ricerca ha bisogno di Music Assistant: qui non lo trovo.': 'Search needs Music Assistant: I cannot find it here.',
    'La ricerca non ha risposto (': 'The search did not answer (',
    "Non c'e' niente in coda": 'The queue is empty',
    'Non ho trovato niente.': 'I found nothing.',
    'Non riesco a leggere la coda': 'I cannot read the queue',
    'Non risponde (': 'No answer (',
    "Per il meteo non serve sceglierla: l'icona la decide il tempo che fa (sole, nuvole, pioggia, neve, temporale, nebbia, vento) e cambia da sola.": 'For weather you do not need to pick one: the icon follows the sky (sun, clouds, rain, snow, storm, fog, wind) and changes by itself.',
    "Prendi il nome, il valore, l'icona o una misura e trascinali dove vuoi dentro alla casella qui sotto. Tocca un pezzo e sul suo angolo compare un quadratino giallo: tienilo premuto e trascina per ingrandirlo o rimpicciolirlo.": 'Pick up the name, the value, the icon or a reading and drag them wherever you like inside the tile below. Tap a piece and a little yellow square appears on its corner: hold it and drag to make it bigger or smaller.',
    "Qui non c'e niente.": 'Nothing here.',
    'Schede dentro il pop-up': 'Cards inside the pop-up',
    'Sensori collegati a questa entita': 'Sensors related to this entity',
    'Sorgente': 'Source',
    'Sto cercando...': 'Searching...',
    "Tocca la ruota per scegliere il colore che vuoi: e' quello dell'alone, del bordo e di tutti gli effetti.": 'Tap the wheel to pick the colour you want: it is the one of the glow, the border and every effect.',
    'Un attimo...': 'One moment...',
    'errore': 'error',
    ' - tocca per aprire Google Maps': ' - tap to open Google Maps',
    ' - tocca per i dettagli': ' - tap for the details',
    "Stai sistemando: questa casella. Per una scheda del pop-up, toccala nell'anteprima qui di fianco.": 'You are arranging: this tile. For a card in the pop-up, tap it in the preview beside.',
    'Il nome compare accanto al numero. Lascia vuoto per non scrivere niente.': 'The name shows next to the number. Leave it empty to show nothing.',
    'Le impostazioni di questa scheda non si sono caricate. Il codice lo trovi qui sotto.': 'The settings for this card did not load. You will find the code below.',
    "Mette negli appunti solo la disposizione e la grandezza: incollale nel codice di un'altra casella e premi Applica": 'Copies only the layout and the size: paste them into the code of another tile and press Apply',
    'disposizione messa da parte: vai sull\'altra casella e premi "Incolla la disposizione"': 'layout copied: go to the other tile and press "Paste the layout"',
    "Versione della card: se non e' quella che ti aspetti, il browser sta ancora usando una copia vecchia (ricarica con Ctrl+F5)": 'Card version: if it is not the one you expect, the browser is still using an old copy (reload with Ctrl+F5)',
    "Ancora nessuna scheda: il pop-up mostrera l'elenco dell'entita. Premi qui sotto per sceglierne una.": 'No cards yet: the pop-up will show the entity list. Press below to pick one.',
    'Sto caricando ': 'Uploading ',
    'Codice non valido: ': 'Invalid code: ',
    'Pezzo: ': 'Piece: ',
    'Incolla la disposizione di "': 'Paste the layout of "',
    '+ Aggiungi scheda': '+ Add a card',
    'Aggiungi': 'Add',
    'Altezza in punti': 'Height in pixels',
    "Ancora nessuna scheda: il pop-up mostrera l'elenco dell'entita. Premi qui sotto per aggiungerne una.": 'No cards yet: the pop-up will show the entity list. Press below to add one.',
    'Annulla': 'Cancel',
    'Applica il codice': 'Apply the code',
    'Carico le impostazioni della scheda...': 'Loading the card settings...',
    "Cerca un'impostazione: meteo, colore, km...": 'Search a setting: weather, colour, km...',
    'Codice della scheda (YAML)': 'Card code (YAML)',
    'Codice di questa casella (YAML)': 'Code of this tile (YAML)',
    'Codice non valido:': 'Invalid code:',
    'Colore di questa misura': 'Colour of this reading',
    'Come la lampada (colore vero della luce)': 'Like the lamp (the light real colour)',
    'Come si chiamano le misure': 'What the readings are called',
    'Copia la disposizione': 'Copy the layout',
    'Grandezza': 'Size',
    'Grandezza del pezzo in percentuale': 'Piece size, as a percentage',
    'Grandezza vera': 'Actual size',
    'Guarda come si apre': 'See how it opens',
    'Il nome compare accanto al numero. Lascia vuoto per usare quello di Home Assistant.': 'The name shows next to the number. Leave empty to use the Home Assistant one.',
    'Incolla la disposizione di “': 'Paste the layout of “',
    "La sceglie la card guardando l'entita": 'The card picks it by looking at the entity',
    'Larghezza in punti': 'Width in pixels',
    'Le impostazioni di questa scheda non si sono aperte. Usa il codice qui sotto.': 'This card settings did not open. Use the code below.',
    "Mette negli appunti solo la disposizione e la grandezza: il valore e l'entita restano quelli della casella dove la incolli": 'Copies only the layout and the size: the value and the entity stay those of the tile you paste it into',
    'Nessuna impostazione con «': 'No setting with «',
    'Non ho trovato sensori collegati. Puoi comunque aggiungerne a mano qui sopra.': 'I found no related sensors. You can still add some by hand above.',
    'Non riesco a creare il contenuto della finestra.': 'I cannot build the contents of the window.',
    'Non sono riuscito a caricarla (': 'I could not upload it (',
    'Pezzo': 'Piece',
    'Pezzo:': 'Piece:',
    'Prendi la disposizione da': 'Take the layout from',
    'Quanto e trasparente': 'How transparent it is',
    "Quanto e' distante dal bordo di sopra, in percentuale": 'Distance from the top edge, as a percentage',
    "Quanto e' distante dal bordo sinistro, in percentuale": 'Distance from the left edge, as a percentage',
    'Rimetti come prima': 'Put it back',
    'Rimetti tutto a posto': 'Reset everything',
    'Scegli il colore': 'Pick the colour',
    "Scegli prima un'entita nella scheda Base.": 'Pick an entity in the Basics tab first.',
    'Segue la temperatura (freddo azzurro, caldo rosso)': 'Follows the temperature (cold blue, warm red)',
    'Sfondo di questa scheda': 'Background of this card',
    'Spunta quelli che vuoi vedere in basso nella casella.': 'Tick the ones you want to see at the bottom of the tile.',
    'Stai sistemando:': 'You are arranging:',
    'Stai sistemando: questa casella.': 'You are arranging: this tile.',
    'Sto caricando': 'Uploading',
    'Svuota la coda': 'Clear the queue',
    'Tieni premuto e trascina per cambiare la grandezza della casella': 'Press and drag to change the size of the tile',
    'Tieni premuto e trascina per cambiare la misura di questa scheda': 'Press and drag to change the size of this card',
    'Tieni premuto e trascina per ingrandire o rimpicciolire': 'Press and drag to make it bigger or smaller',
    'Tieni premuto e trascina per riordinare': 'Press and drag to reorder',
    'Tocca per le previsioni': 'Tap for the forecast',
    "Tocca per scegliere un'altra foto": 'Tap to pick another photo',
    'Togli il colore': 'Remove the colour',
    "Togli l'immagine": 'Remove the image',
    'Togli la foto': 'Remove the photo',
    'Torna al colore della casella': 'Back to the tile colour',
    'Torna alla casella': 'Back to the tile',
    'Un colore qualsiasi': 'Any colour',
    "Versione della card: se non e' quella che ti aspetti, la pagina sta ancora usando una copia vecchia (ricarica con Ctrl+Shift+R)": 'Card version: if it is not the one you expect, the page is still using an old copy (reload with Ctrl+Shift+R)',
    'da sinistra': 'from the left',
    "disposizione messa da parte: vai sull'altra casella e premi Incolla": 'layout copied: go to the other tile and press Paste',
    "oppure l'indirizzo: /local/mia.gif": 'or the address: /local/mine.gif',
    'pronto: tocca un pezzo qui sopra': 'ready: tap a piece above',
    'si apre qui di fianco - chiudila con la X o con Esc': 'it opens right here - close it with the X or with Esc',
}

TITOLI = {
    'Base': 'Basics', "Cosa c'e scritto": 'What it says',
    'Quando la casella e accesa': 'When the tile counts as on', 'Icona': 'Icon',
    'Batteria: carica e scarica': 'Battery: charging and discharging', 'Aspetto': 'Looks',
    'Come e fatta': 'Shape', 'Colore della scritta': 'Text colour', 'Effetti': 'Effects',
    'Sfondo': 'Background', 'Tinta della casella': 'Tile tint',
    'La telecamera in diretta': 'Live camera', 'Foto di sfondo': 'Background photo',
    'La copertina del brano come sfondo': 'Album art as background',
    'Il cielo del meteo': 'Weather sky', 'Comandi': 'Controls',
    'Barra dentro la casella': 'Slider inside the tile', 'Tasti rapidi': 'Quick buttons',
    'Striscia del colore (luci)': 'Colour strip (lights)', 'Grafico': 'Chart',
    'Musica': 'Music', 'Comandi del lettore': 'Player controls',
    'Casse e sorgenti': 'Speakers and sources', 'Il riquadro delle casse': 'The speakers panel',
    'Persone': 'People', 'Dove si trova': 'Where they are', 'Tocco': 'Tap',
    'Pop-up': 'Pop-up', 'Come si apre': 'How it opens',
    'Quanto e largo il pop-up': 'Pop-up width', 'Come e vestito il pop-up': 'Pop-up looks',
    'Pezzi': 'Pieces', 'finestra': 'window',
    'Sottotitolo scritto da te (facoltativo)': 'Subtitle you write yourself (optional)',
    'Titolo del pop-up': 'Pop-up title',
}

VOCI = {
    'Classica - icona in basso, valore a destra': 'Classic - icon bottom left, value right',
    'Persona - foto a sinistra, stato e via accanto': 'Person - photo left, state beside it',
    'Musica - copertina tonda grande e onda del tempo': 'Music - big round album art and a waveform',
    'Musica - come la tua ytmusic-card': 'Music - like the ytmusic-card',
    'Alone - morbido': 'Glow - soft', 'Alone - che respira': 'Glow - breathing',
    'Alone - diffuso e grande': 'Glow - wide and soft', 'Alone - doppio bordo': 'Glow - double border',
    'Luce - neon dentro e fuori': 'Light - neon inside and out',
    'Luce - che gira sul bordo': 'Light - running around the border',
    'Luce - riflesso che scorre': 'Light - sweeping reflection',
    'Luce - spia lampeggiante': 'Light - blinking indicator',
    'Luce - lampeggio (per gli avvisi)': 'Light - flashing (for alerts)',
    'Superficie - vetro smerigliato': 'Surface - frosted glass',
    'Superficie - sfondo tinto': 'Surface - tinted background',
    'Superficie - sfondo che si muove': 'Surface - moving background',
    'Superficie - incavo': 'Surface - inset',
    'Movimento - onda che sale': 'Motion - rising wave',
    'Movimento - battito': 'Motion - heartbeat',
    'Movimento - icona che fluttua': 'Motion - floating icon',
    'Movimento - icona che pulsa': 'Motion - pulsing icon',
    'Al passaggio - si ingrandisce': 'On hover - grows',
    'Al passaggio - si inclina': 'On hover - tilts',
    'Nessun effetto': 'No effect',
    'Si muove solo quando e attiva': 'Only while the entity is active',
    'Si muove sempre': 'Always', 'Non si muove mai': 'Never',
    'Riempie la casella (taglia i bordi)': 'Fills the tile (crops the edges)',
    'Tutta intera dentro la casella': 'The whole photo inside the tile',
    'Grandezza vera della foto': 'Actual photo size',
    'Solo la tinta (arcobaleno)': 'Colour only (rainbow)',
    'Solo il bianco caldo/freddo': 'Warm/cool white only',
    'Tutte e due le strisce': 'Both strips', 'Area piena': 'Filled area',
    'Solo la linea': 'Line only', 'Accendi / spegni': 'Toggle',
    'Esegui un servizio (es. imposta un valore)': 'Call a service (e.g. set a value)',
    'Apri i dettagli': 'Open more-info', 'Apri un pop-up mio': 'Open my own pop-up',
    'Apri Google Maps sulla posizione': 'Open Google Maps at the location',
    'Apri un indirizzo web': 'Open a web address',
    'Apri un pop-up bubble-card (#nome)': 'Open a bubble-card pop-up (#name)',
    'Sale e sfuma - discreta': 'Rises and fades - discreet',
    'Sboccia dalla casella che hai toccato': 'Blooms from the tile you tapped',
    'Entra dal basso, come un cassetto': 'Slides up from the bottom, like a drawer',
    'Nessuna animazione': 'No animation',
}

# ------------------------------------------------- costruisco il dizionario
coppie = []          # (italiano dal codice, inglese)
mancanti = []
for k, it in sorted(d['etichette'].items()):
    en = ETI.get(k)
    if en:
        coppie.append((it, en))
    else:
        mancanti.append('etichetta ' + k)
for k, it in sorted(d['parole'].items()):
    en = STATI.get(k)
    if en:
        coppie.append((it, en))
    elif it not in ('-', '?'):
        mancanti.append('stato ' + k)
for it in d['titoli']:
    en = TITOLI.get(it)
    if en:
        coppie.append((it, en))
    else:
        mancanti.append('titolo ' + it)
for it in d['voci']:
    en = VOCI.get(it)
    if en:
        coppie.append((it, en))
    else:
        mancanti.append('voce ' + it)

for it, en in LIBERE.items():
    coppie.append((it, en))

visti = {}
righe = []
for it, en in coppie:
    if it in visti:
        continue
    visti[it] = en
    righe.append('  %s: %s,' % (json.dumps(it, ensure_ascii=False),
                                json.dumps(en, ensure_ascii=False)))

TESTA = u'''// -*- coding: utf-8 -*-
// La lingua della casella.
//
// Schema: l'ITALIANO fa da chiave. Il codice resta scritto in italiano,
// leggibile com'era, e qui c'e' solo la traduzione. Due vantaggi che
// contano davvero: le chiavi non si inventano (sono la frase stessa), e
// una scritta non ancora tradotta resta in italiano invece di sparire o
// di mostrare un codice tipo "eti.mostra_icona".
//
// ATTENZIONE: le chiavi della CONFIGURAZIONE non si toccano mai - `icona`,
// `colore`, `posti`, `mostra_cursore` e compagnia stanno scritte dentro
// alle plance di chi usa la casella, e tradurle vorrebbe dire rompere ogni
// installazione esistente. Qui si traduce solo quello che si LEGGE.
//
// Questo file lo genera uno script dalle stringhe vere del codice: le
// chiavi non si scrivono a mano. Un apostrofo tipografico al posto di uno
// dritto e la traduzione non si aggancia piu', in silenzio.

let LINGUA = 'it';
// La lingua vera, per come si scrivono numeri e date: un tedesco legge le
// scritte in inglese ma i numeri li vuole coi suoi punti.
let LOCALE = 'it-IT';
let LOCALE_BUONA = null;

// Che lingua parla l'utente lo sa gia' Home Assistant: gliela chiedo.
// Tutto quello che non e' italiano prende l'inglese.
export function scegliLingua(hass) {
  const l = String((hass && ((hass.locale && hass.locale.language) || hass.language)) || '')
    .toLowerCase();
  // Se non lo so ancora NON decido: `setConfig` puo' arrivare prima di
  // `hass`, e mettere 'en' li' vorrebbe dire scrivere le linguette in
  // inglese a un utente italiano - si scrivono una volta sola, quindi
  // non si rimedia piu'.
  if (!l) return LINGUA;
  LOCALE = l;
  LOCALE_BUONA = null;
  LINGUA = l.indexOf('it') === 0 ? 'it' : 'en';
  return LINGUA;
}

export function laLingua() { return LINGUA; }

// Per toLocaleString: numeri e date nel formato di chi guarda. La sigla
// arriva da Home Assistant e potrebbe non piacere a Intl: la provo una
// volta sola, perche' un errore qui lascerebbe la casella bianca.
export function laLocale() {
  if (LOCALE_BUONA === null) {
    try {
      (0).toLocaleString(LOCALE);
      LOCALE_BUONA = LOCALE;
    } catch (e) {
      LOCALE_BUONA = LINGUA === 'it' ? 'it-IT' : 'en-GB';
    }
  }
  return LOCALE_BUONA;
}

// Se la scritta non c'e' nel dizionario torna com'era: meglio una frase in
// italiano che un buco.
export function T(testo) {
  if (LINGUA === 'it' || !testo) return testo;
  const t = EN[testo];
  return t === undefined ? testo : t;
}

// Le voci delle tendine passano dritte a ha-form dentro allo schema: le
// traduco qui, quando lo schema esce, invece di tenere la tabella delle
// sezioni in due lingue. La firma dello schema guarda i nomi, non le
// scritte, quindi tradurle non fa ricostruire niente.
export function traduciSchema(elenco) {
  if (LINGUA === 'it') return elenco;
  return (elenco || []).map((voce) => {
    if (voce && Array.isArray(voce.schema)) {
      return { ...voce, schema: traduciSchema(voce.schema) };
    }
    const opz = voce && voce.selector && voce.selector.select
      && voce.selector.select.options;
    if (!Array.isArray(opz)) return voce;
    return { ...voce,
      selector: { ...voce.selector,
        select: { ...voce.selector.select,
          options: opz.map((o) => (o && o.label ? { ...o, label: T(o.label) } : o)) } } };
  });
}

// Le scritte dentro a un pezzo di HTML scritto a mano (innerHTML): traduco
// quello che sta FRA i tag e non tocco i tag. Il testo che non e' nel
// dizionario resta com'e', come in T(). Serve una passata sola per blocco,
// e i blocchi si costruiscono una volta sola.
export function TH(html) {
  if (LINGUA === 'it' || !html) return html;
  return String(html)
    .replace(/>([^<>]+)</g, (tutto, dentro) => {
      const pulito = dentro.trim();
      if (!pulito) return tutto;
      const t = EN[pulito];
      return t === undefined ? tutto : '>' + dentro.replace(pulito, t) + '<';
    })
    // meta' della scocca sono `title=`: i tastini del lettore non hanno
    // scritte, solo il fumetto che dice cosa fanno.
    .replace(/(title|placeholder|aria-label)="([^"<>]+)"/g, (tutto, att, dentro) => {
      const t = EN[dentro.trim()];
      return t === undefined ? tutto : att + '="' + t + '"';
    })
    .replace(/(title|placeholder|aria-label)='([^'<>]+)'/g, (tutto, att, dentro) => {
      const t = EN[dentro.trim()];
      return t === undefined ? tutto : att + "='" + t + "'";
    });
}

export const EN = {
'''

io.open(os.path.join(REPO, 'src', 'lingua.js'), 'w', encoding='utf-8', newline='\n').write(
    TESTA + '\n'.join(righe) + '\n};\n')

print('scritte tradotte: %d' % len(righe))
print('senza traduzione: %d' % len(mancanti))
for x in mancanti:
    print('   ', x)
