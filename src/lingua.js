// -*- coding: utf-8 -*-
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

// Che lingua parla l'utente lo sa gia' Home Assistant: gliela chiedo.
// Tutto quello che non e' italiano prende l'inglese.
export function scegliLingua(hass) {
  const l = String((hass && ((hass.locale && hass.locale.language) || hass.language)) || '')
    .toLowerCase();
  LINGUA = l.indexOf('it') === 0 ? 'it' : 'en';
  return LINGUA;
}

export function laLingua() { return LINGUA; }

// Se la scritta non c'e' nel dizionario torna com'era: meglio una frase in
// italiano che un buco.
export function T(testo) {
  if (LINGUA === 'it' || !testo) return testo;
  const t = EN[testo];
  return t === undefined ? testo : t;
}

// Le voci delle tendine passano dritte a ha-form dentro allo schema: le
// traduco qui, quando lo schema esce, invece di duplicare la tabella delle
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

export const EN = {
  "Si accende in base ad altre entita: basta che una sia attiva (es. i watt che escono invece della carica)": "On when another entity is active - any one of them is enough (e.g. the watts going out instead of the charge)",
  "Si accende solo quando l'entita' vale esattamente (es. 95)": "On only when the entity reads exactly this (e.g. 95)",
  "Sempre a colori (anche da spenta)": "Always in colour (even when off)",
  "Quando si muove (icona ed effetti)": "When it animates (icon and effects)",
  "Cosa fa quando la tocchi": "What happens when you tap it",
  "Riempi la casella con l'immagine della telecamera, viva": "Fill the tile with the live camera image",
  "Ogni quanti secondi si rifa l'immagine": "How often the image refreshes (seconds)",
  "Quali entita vogliono dire che STA CARICANDO (di solito non serve: basta chiamare carica una misura)": "Which entities mean IT IS CHARGING (usually not needed: a sensor named \"charge\" is enough)",
  "Elenco In coda (serve Music Assistant)": "Queue list (needs Music Assistant)",
  "Colore quando e accesa": "Colour when on",
  "Colore personalizzato (vale solo scegliendo \"personalizzato\" qui sopra)": "Custom colour (only applies if you pick \"custom\" above)",
  "Quale striscia mostrare": "Which strip to show",
  "Colore del nome e del sottotitolo (vuoto = quello del tema)": "Colour of the name and subtitle (empty = the theme's)",
  "Colore del valore, quello grande (vuoto = come il nome)": "Colour of the big value (empty = same as the name)",
  "Comandi della musica dentro la casella": "Music controls inside the tile",
  "Tasti rapidi (tapparelle, serrature, aspirapolvere)": "Quick buttons (shutters, locks, vacuum)",
  "Striscia del colore dentro la casella": "Colour strip inside the tile",
  "La barra arriva a (es. 800, invece dei 1200 dell'entita)": "Slider tops out at (e.g. 800 instead of the entity's 1200)",
  "La barra parte da (lascia vuoto = minimo dell'entita)": "Slider starts at (empty = the entity's minimum)",
  "Come e disposta la casella": "How the tile is laid out",
  "Sensore del percorso (Waze, Google): se c'e, usa i km su strada": "Route sensor (Waze, Google): if set, uses road distance",
  "Effetto della casella": "Tile effect",
  "Entita (lasciala vuota se la casella serve solo ad aprire il pop-up)": "Entity (leave it empty if the tile only opens the pop-up)",
  "Come si apre la finestra": "How the window opens",
  "Quanto dura l'apertura (millesimi di secondo)": "How long the opening takes (milliseconds)",
  "Foto di sfondo del pop-up - indirizzo, es. /local/foto.jpg": "Pop-up background photo - address, e.g. /local/photo.jpg",
  "Larghezza del pop-up in punti (vuoto = 560, come tutti gli altri)": "Pop-up width in pixels (empty = 560, like everyone else)",
  "Tinta della finestra del pop-up (le schede dentro hanno la loro, qui sotto)": "Pop-up window tint (the cards inside have their own, below)",
  "Titolo del pop-up": "Pop-up title",
  "Trasparenza del pop-up (%)": "Pop-up transparency (%)",
  "Fai girare la copertina tonda come un disco": "Spin the round album art like a record",
  "Mostra il grafico dell'andamento dentro la casella": "Show the history chart inside the tile",
  "Colore del grafico (vuoto = come la casella)": "Chart colour (empty = same as the tile)",
  "Quante ore di storia (di serie 24)": "How many hours of history (24 by default)",
  "Come si disegna": "How it is drawn",
  "Casella grande": "Big tile",
  "Icona animata": "Animated icon",
  "Usa l'icona che l'entita ha gia in Home Assistant, se ce l'ha": "Use the icon the entity already has in Home Assistant, if any",
  "Icona di Home Assistant (cercala qui; vince su quella sotto)": "Home Assistant icon (search here; beats the one below)",
  "Immagine al posto dell'icona": "Image instead of the icon",
  "Immagine di quando e acceso (anche una gif)": "Image for when it is on (a GIF works too)",
  "L'icona in grande dietro alle scritte": "The big faded icon behind the text",
  "Quanto si vede l'icona dietro (%)": "How visible the icon behind is (%)",
  "Indirizzo web da aprire (per l'azione \"Apri un indirizzo web\")": "Web address to open (for the \"Open a web address\" action)",
  "Misure mostrate in basso (aggiungine altre da qui)": "Readings shown at the bottom (add more here)",
  "Scrivi un nome anche sulle misure che non hai chiamato tu": "Also label the readings you have not named yourself",
  "Intensita del colore (%)": "Colour strength (%)",
  "Casse tra cui scegliere (i tastini in alto nella casella)": "Speakers to choose from (the small buttons at the top)",
  "Meteo nell'angolo (scegli l'entita del meteo)": "Weather in the corner (pick the weather entity)",
  "Quanto si vede la scena meteo (%) - 0 lascia solo il colore": "How visible the weather scene is (%) - 0 leaves only the colour",
  "Barra dentro la casella (luci, ventole, musica, valori da impostare)": "Slider inside the tile (lights, fans, music, values to set)",
  "Scrivi da quanto tempo e in questo stato": "Show how long it has been in this state",
  "Quanti chilometri da casa, in linea d'aria (persone)": "Distance from home as the crow flies (people)",
  "Mostra l'icona (toglila per lasciare solo le scritte)": "Show the icon (turn it off to leave only the text)",
  "Tasto Casse: unisci gli altoparlanti e regola i volumi": "Speakers button: group the speakers and set the volumes",
  "Nome mostrato": "Display name",
  "Nascondi il numerino in fondo alla barra": "Hide the little number at the end of the slider",
  "Nascondi il valore": "Hide the value",
  "Sfondo del riquadro casse e sorgenti (vuoto = scuro di serie; le scritte seguono il colore della scritta)": "Background of the speakers and sources panel (empty = the usual dark; the text follows the text colour)",
  "Trasparenza del riquadro casse e sorgenti (%)": "Transparency of the speakers and sources panel (%)",
  "Pop-up bubble-card da aprire (es. #luci)": "bubble-card pop-up to open (e.g. #lights)",
  "Trasparenza dei riquadri ricerca, sfoglia e coda (%)": "Transparency of the search, browse and queue panels (%)",
  "Quali entita vogliono dire che STA DANDO CORRENTE (di solito non serve: basta chiamare scarica una misura)": "Which entities mean IT IS SUPPLYING POWER (usually not needed: a sensor named \"discharge\" is enough)",
  "Passa da sola alla cassa che sta suonando": "Follow whichever speaker is playing",
  "Servizio da chiamare (es. number.set_value)": "Service to call (e.g. number.set_value)",
  "Dati del servizio, in YAML (es. value: 95)": "Service data, in YAML (e.g. value: 95)",
  "Come si adatta la foto": "How the photo fits",
  "Sfondo della casella (tinta)": "Tile background (tint)",
  "Copertina del disco come sfondo": "Album art as background",
  "Foto di sfondo - indirizzo, es. /local/foto.jpg": "Background photo - address, e.g. /local/photo.jpg",
  "Usa il meteo come sfondo di tutta la casella": "Use the weather as the background of the whole tile",
  "Quanto sfocarla (0 = nitida)": "How much to blur it (0 = sharp)",
  "Velo scuro sulla foto o sulla copertina (%) - serve a leggere il testo": "Dark veil over the photo or album art (%) - so the text stays readable",
  "Soglia di accensione (W)": "On threshold (W)",
  "Tasto Sorgente: scegli l'ingresso del lettore": "Source button: pick the player's input",
  "Sottotitolo scritto da te (facoltativo)": "Subtitle you write yourself (optional)",
  "Sottotitolo preso da un'altra entita (es. l'indirizzo)": "Subtitle taken from another entity (e.g. the address)",
  "Tempo del brano e barra di avanzamento": "Track time and progress bar",
  "Trasparenza della casella (%)": "Tile transparency (%)",
  "Usa la foto dell'entita, se ce l'ha (persone, copertine)": "Use the entity's own picture, if it has one (people, album art)",
  "Velocita dell'effetto (%) - 100 e normale": "Effect speed (%) - 100 is normal",
  "Tastini cerca / sfoglia / coda / schermo intero": "Small buttons: search / browse / queue / fullscreen",
  "Cuoricino dei preferiti": "Favourite heart",
  "Auto": "Auto",
  "In carica": "Charging",
  "Pulisce": "Cleaning",
  "Chiusa": "Closed",
  "Raffredda": "Cooling",
  "In scarica": "Discharging",
  "Scollegato": "Disconnected",
  "Alla base": "Docked",
  "Errore": "Error",
  "Carica": "Full",
  "Riscalda": "Heating",
  "In casa": "Home",
  "Fermo": "Idle",
  "Ferma": "Not charging",
  "Fuori casa": "Away",
  "Spento": "Off",
  "Acceso": "On",
  "Aperta": "Open",
  "In pausa": "Paused",
  "In riproduzione": "Playing",
  "Registra": "Recording",
  "Rientra": "Returning",
  "In attesa": "Standby",
  "In diretta": "Streaming",
  "Assente": "Unavailable",
  "Via cavo": "Wired",
  "Base": "Basics",
  "Cosa c'e scritto": "What it says",
  "Quando la casella e accesa": "When the tile counts as on",
  "Icona": "Icon",
  "Batteria: carica e scarica": "Battery: charging and discharging",
  "Aspetto": "Looks",
  "Come e fatta": "Shape",
  "Colore della scritta": "Text colour",
  "Effetti": "Effects",
  "Sfondo": "Background",
  "Tinta della casella": "Tile tint",
  "La telecamera in diretta": "Live camera",
  "Foto di sfondo": "Background photo",
  "La copertina del brano come sfondo": "Album art as background",
  "Il cielo del meteo": "Weather sky",
  "Comandi": "Controls",
  "Barra dentro la casella": "Slider inside the tile",
  "Tasti rapidi": "Quick buttons",
  "Striscia del colore (luci)": "Colour strip (lights)",
  "Grafico": "Chart",
  "Musica": "Music",
  "Comandi del lettore": "Player controls",
  "Casse e sorgenti": "Speakers and sources",
  "Il riquadro delle casse": "The speakers panel",
  "Persone": "People",
  "Dove si trova": "Where they are",
  "Tocco": "Tap",
  "Pop-up": "Pop-up",
  "Come si apre": "How it opens",
  "Quanto e largo il pop-up": "Pop-up width",
  "Come e vestito il pop-up": "Pop-up looks",
  "Pezzi": "Pieces",
  "finestra": "window",
  "Classica - icona in basso, valore a destra": "Classic - icon bottom left, value right",
  "Persona - foto a sinistra, stato e via accanto": "Person - photo left, state beside it",
  "Musica - copertina tonda grande e onda del tempo": "Music - big round album art and a waveform",
  "Musica - come la tua ytmusic-card": "Music - like the ytmusic-card",
  "Alone - morbido": "Glow - soft",
  "Alone - che respira": "Glow - breathing",
  "Alone - diffuso e grande": "Glow - wide and soft",
  "Alone - doppio bordo": "Glow - double border",
  "Luce - neon dentro e fuori": "Light - neon inside and out",
  "Luce - che gira sul bordo": "Light - running around the border",
  "Luce - riflesso che scorre": "Light - sweeping reflection",
  "Luce - spia lampeggiante": "Light - blinking indicator",
  "Luce - lampeggio (per gli avvisi)": "Light - flashing (for alerts)",
  "Superficie - vetro smerigliato": "Surface - frosted glass",
  "Superficie - sfondo tinto": "Surface - tinted background",
  "Superficie - sfondo che si muove": "Surface - moving background",
  "Superficie - incavo": "Surface - inset",
  "Movimento - onda che sale": "Motion - rising wave",
  "Movimento - battito": "Motion - heartbeat",
  "Movimento - icona che fluttua": "Motion - floating icon",
  "Movimento - icona che pulsa": "Motion - pulsing icon",
  "Al passaggio - si ingrandisce": "On hover - grows",
  "Al passaggio - si inclina": "On hover - tilts",
  "Nessun effetto": "No effect",
  "Si muove solo quando e attiva": "Only while the entity is active",
  "Si muove sempre": "Always",
  "Non si muove mai": "Never",
  "Riempie la casella (taglia i bordi)": "Fills the tile (crops the edges)",
  "Tutta intera dentro la casella": "The whole photo inside the tile",
  "Grandezza vera della foto": "Actual photo size",
  "Solo la tinta (arcobaleno)": "Colour only (rainbow)",
  "Solo il bianco caldo/freddo": "Warm/cool white only",
  "Tutte e due le strisce": "Both strips",
  "Area piena": "Filled area",
  "Solo la linea": "Line only",
  "Accendi / spegni": "Toggle",
  "Esegui un servizio (es. imposta un valore)": "Call a service (e.g. set a value)",
  "Apri i dettagli": "Open more-info",
  "Apri un pop-up mio": "Open my own pop-up",
  "Apri Google Maps sulla posizione": "Open Google Maps at the location",
  "Apri un indirizzo web": "Open a web address",
  "Apri un pop-up bubble-card (#nome)": "Open a bubble-card pop-up (#name)",
  "Sale e sfuma - discreta": "Rises and fades - discreet",
  "Sboccia dalla casella che hai toccato": "Blooms from the tile you tapped",
  "Entra dal basso, come un cassetto": "Slides up from the bottom, like a drawer",
  "Nessuna animazione": "No animation",
};
