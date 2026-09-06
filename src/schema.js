// -*- coding: utf-8 -*-
// Le impostazioni: sezioni, nomi in italiano, chi le vede.

import { segno } from './segni.js';

export const SEZIONI = [
  {
    chiave: "base", titolo: "Base", segno: "⚙", aperta: true,
    gruppi: [
      { schema: [
        { name: "entity", selector: { entity: {} } },
        { name: "name", selector: { text: {} } },
      ] },
      { titolo: "Cosa c'e scritto", schema: [
        { name: "sottotitolo", selector: { text: {} } },
        { name: "sottotitolo_entita", selector: { entity: {} } },
        { name: "nascondi_valore", selector: { boolean: {} } },
        { name: "mostra_da_quanto", selector: { boolean: {} } },
        { name: "info_entita", selector: { entity: { multiple: true } } },
        { name: "info_nomi_auto", selector: { boolean: {} } },
      ] },
      { titolo: "Quando la casella e accesa", schema: [
        { name: "acceso_sempre", selector: { boolean: {} } },
        { name: "acceso_entita", selector: { entity: { multiple: true } } },
        { name: "acceso_se", selector: { text: {} } },
        { name: "soglia", selector: { number: { mode: "box", min: 0, step: 1 } } },
      ] },
    ],
  },
  {
    chiave: "icona", titolo: "Icona", segno: "✦",
    gruppi: [
      { schema: [
        {
          type: "grid", name: "", schema: [
            { name: "mostra_icona", selector: { boolean: {} } },
            { name: "usa_foto", selector: { boolean: {} } },
            { name: "icona_sfondo", selector: { boolean: {} } },
            { name: "icona_sfondo_forza",
              selector: { number: { min: 4, max: 60, step: 2, mode: "slider" } } },
          ],
        },
        { name: "icona_entita", selector: { boolean: {} } },
        { name: "icona_ha", selector: { icon: {} } },
      ] },
      { titolo: "Batteria: carica e scarica", schema: [
        { name: "carica_entita", selector: { entity: { multiple: true } } },
        { name: "scarica_entita", selector: { entity: { multiple: true } } },
      ] },
    ],
  },
  {
    chiave: "aspetto", titolo: "Aspetto", segno: "🎨",
    gruppi: [
      { titolo: "Come e fatta", schema: [
        { name: "disposizione", selector: { select: { mode: "dropdown", options: [
          { value: "classica", label: "Classica - icona in basso, valore a destra" },
          { value: "persona", label: "Persona - foto a sinistra, stato e via accanto" },
          { value: "vinile", label: "Musica - copertina tonda grande e onda del tempo" },
          { value: "ytmusic", label: "Musica - come la tua ytmusic-card" },
        ] } } },
        { name: "grande", selector: { boolean: {} } },
      ] },
      { titolo: "Colore della scritta",
        colori: ["colore_testo", "colore_valore"], schema: [
      ] },
      { titolo: "Effetti", schema: [
        { name: "effetto", selector: { select: { mode: "dropdown", options: [
          { value: "alone", label: "Alone - morbido" },
          { value: "pulsa", label: "Alone - che respira" },
          { value: "bagliore", label: "Alone - diffuso e grande" },
          { value: "doppio", label: "Alone - doppio bordo" },
          { value: "neon", label: "Luce - neon dentro e fuori" },
          { value: "bordo", label: "Luce - che gira sul bordo" },
          { value: "scia", label: "Luce - riflesso che scorre" },
          { value: "spia", label: "Luce - spia lampeggiante" },
          { value: "lampeggio", label: "Luce - lampeggio (per gli avvisi)" },
          { value: "vetro", label: "Superficie - vetro smerigliato" },
          { value: "sfondo", label: "Superficie - sfondo tinto" },
          { value: "sfondo_mosso", label: "Superficie - sfondo che si muove" },
          { value: "incavo", label: "Superficie - incavo" },
          { value: "onda", label: "Movimento - onda che sale" },
          { value: "battito", label: "Movimento - battito" },
          { value: "fluttua", label: "Movimento - icona che fluttua" },
          { value: "icona_pulsa", label: "Movimento - icona che pulsa" },
          { value: "ingrandisce", label: "Al passaggio - si ingrandisce" },
          { value: "inclina", label: "Al passaggio - si inclina" },
          { value: "nessuno", label: "Nessun effetto" },
        ] } } },
        { name: "anima", selector: { select: { mode: "dropdown", options: [
          { value: "attiva", label: "Si muove solo quando e attiva" },
          { value: "sempre", label: "Si muove sempre" },
          { value: "mai", label: "Non si muove mai" },
        ] } } },
        { name: "intensita", selector: { number: { min: 0, max: 100, step: 5, mode: "slider" } } },
        { name: "velocita", selector: { number: { min: 25, max: 300, step: 5, mode: "slider" } } },
      ] },
    ],
  },
  {
    chiave: "sfondo", titolo: "Sfondo", segno: "🖼",
    gruppi: [
      { titolo: "Tinta della casella", colori: ["sfondo_colore"], schema: [
        {
          type: "grid", name: "", schema: [
            { name: "trasparenza",
              selector: { number: { min: 0, max: 100, step: 5, mode: "slider" } } },
          ],
        },
      ] },
      { titolo: "La telecamera in diretta", schema: [
        { name: "camera_diretta", selector: { boolean: {} } },
        { name: "camera_secondi",
          selector: { number: { min: 1, max: 60, step: 1, mode: "slider" } } },
      ] },
      { titolo: "Foto di sfondo", schema: [
        { name: "sfondo_immagine", selector: { text: {} } },
        { name: "sfondo_adatta", selector: { select: { mode: "dropdown", options: [
          { value: "riempi", label: "Riempie la casella (taglia i bordi)" },
          { value: "intera", label: "Tutta intera dentro la casella" },
          { value: "vera", label: "Grandezza vera della foto" },
        ] } } },
        { name: "sfondo_velo",
          selector: { number: { min: 0, max: 90, step: 5, mode: "slider" } } },
      ] },
      { titolo: "La copertina del brano come sfondo", schema: [
        { name: "sfondo_copertina", selector: { boolean: {} } },
        { name: "sfondo_sfocatura",
          selector: { number: { min: 0, max: 24, step: 1, mode: "slider" } } },
      ] },
      { titolo: "Il cielo del meteo", schema: [
        { name: "sfondo_meteo", selector: { boolean: {} } },
        { name: "meteo_forza",
          selector: { number: { min: 0, max: 100, step: 5, mode: "slider" } } },
        { name: "meteo_entita", selector: { entity: { domain: "weather" } } },
      ] },
    ],
  },
  {
    chiave: "comandi", titolo: "Comandi", segno: "🎚",
    gruppi: [
      { titolo: "Barra dentro la casella", schema: [
        { name: "mostra_cursore", selector: { boolean: {} } },
        { name: "nascondi_quanto", selector: { boolean: {} } },
        {
          type: "grid", name: "", schema: [
            { name: "cursore_min", selector: { number: { mode: "box" } } },
            { name: "cursore_max", selector: { number: { mode: "box" } } },
          ],
        },
      ] },
      { titolo: "Tasti rapidi", schema: [
        { name: "comandi_rapidi", selector: { boolean: {} } },
      ] },
      { titolo: "Striscia del colore (luci)", schema: [
        { name: "cursore_colore", selector: { boolean: {} } },
        { name: "colore_striscia", selector: { select: { mode: "dropdown", options: [
          { value: "tinta", label: "Solo la tinta (arcobaleno)" },
          { value: "bianco", label: "Solo il bianco caldo/freddo" },
          { value: "tutte", label: "Tutte e due le strisce" },
        ] } } },
      ] },
    ],
  },
  {
    chiave: "grafico", titolo: "Grafico", segno: "📈",
    gruppi: [
      { colori: ["grafico_colore"], schema: [
        { name: "grafico", selector: { boolean: {} } },
        { name: "grafico_ore",
          selector: { number: { min: 1, max: 168, step: 1, mode: "box" } } },
        { name: "grafico_stile", selector: { select: { mode: "dropdown", options: [
          { value: "area", label: "Area piena" },
          { value: "linea", label: "Solo la linea" },
        ] } } },
      ] },
    ],
  },
  {
    chiave: "musica", titolo: "Musica", segno: "🎵",
    gruppi: [
      { titolo: "Comandi del lettore", schema: [
        { name: "comandi_media", selector: { boolean: {} } },
        { name: "tempo_media", selector: { boolean: {} } },
        { name: "gira_copertina", selector: { boolean: {} } },
        { name: "yt_attrezzi", selector: { boolean: {} } },
        { name: "coda", selector: { boolean: {} } },
        { name: "yt_cuore", selector: { boolean: {} } },
      ] },
      { titolo: "Casse e sorgenti", schema: [
        { name: "lettori", selector: { entity: { domain: "media_player", multiple: true } } },
        { name: "segui_attivo", selector: { boolean: {} } },
        { name: "multiroom", selector: { boolean: {} } },
        { name: "sorgente", selector: { boolean: {} } },
      ] },
      { titolo: "Il riquadro delle casse", colori: ["pannello_sfondo"], schema: [
        { name: "pannello_trasparenza",
          selector: { number: { min: 0, max: 90, step: 5, mode: "slider" } } },
        { name: "riquadri_trasparenza",
          selector: { number: { min: 0, max: 90, step: 5, mode: "slider" } } },
      ] },
    ],
  },
  {
    chiave: "persone", titolo: "Persone", segno: "🧭",
    gruppi: [
      { titolo: "Dove si trova", schema: [
        { name: "mostra_distanza", selector: { boolean: {} } },
        { name: "distanza_entita", selector: { entity: {} } },
      ] },
    ],
  },
  {
    chiave: "tocco", titolo: "Tocco", segno: "👆",
    gruppi: [
      { schema: [
        { name: "azione", selector: { select: { mode: "dropdown", options: [
          { value: "toggle", label: "Accendi / spegni" },
          { value: "servizio", label: "Esegui un servizio (es. imposta un valore)" },
          { value: "more-info", label: "Apri i dettagli" },
          { value: "finestra", label: "Apri un pop-up mio" },
          { value: "mappa", label: "Apri Google Maps sulla posizione" },
          { value: "link", label: "Apri un indirizzo web" },
          { value: "popup", label: "Apri un pop-up bubble-card (#nome)" },
        ] } } },
        { name: "servizio", selector: { text: {} } },
        { name: "servizio_dati", selector: { text: { multiline: true } } },
        { name: "indirizzo_web", selector: { text: {} } },
        { name: "popup", selector: { text: {} } },
      ] },
    ],
  },
  {
    // TUTTO IL POP-UP IN UN POSTO SOLO. Prima meta' stava in "Tocco" e
    // l'elenco delle schede pure: per cambiare due cose dello stesso
    // pop-up bisognava girare fra i gruppi.
    chiave: "popup", titolo: "Pop-up", segno: "🪟",
    gruppi: [
      { schema: [
        { name: "finestra_titolo", selector: { text: {} } },
      ] },
      { titolo: "Come si apre", schema: [
        { name: "finestra_apertura", selector: { select: { mode: "dropdown", options: [
          { value: "sfuma", label: "Sale e sfuma - discreta" },
          { value: "sboccia", label: "Sboccia dalla casella che hai toccato" },
          { value: "basso", label: "Entra dal basso, come un cassetto" },
          { value: "niente", label: "Nessuna animazione" },
        ] } } },
        { name: "finestra_apertura_durata",
          selector: { number: { min: 80, max: 2000, step: 20, mode: "slider" } } },
      ] },
      { titolo: "Quanto e largo il pop-up", schema: [
        { name: "finestra_largo",
          selector: { number: { min: 400, max: 1400, step: 20, mode: "slider" } } },
      ] },
      { titolo: "Come e vestito il pop-up",
        colori: ["finestra_sfondo"], schema: [
        {
          type: "grid", name: "", schema: [
            { name: "finestra_trasparenza",
              selector: { number: { min: 0, max: 90, step: 5, mode: "slider" } } },
          ],
        },
        { name: "finestra_immagine", selector: { text: {} } },
      ] },
    ],
  },
  {
    // "Dove va ogni pezzo" e' un lavoro a se': si prende la casella e si
    // trascinano i pezzi. Appeso in fondo ai colori non lo trovava nessuno.
    chiave: "pezzi", titolo: "Pezzi", segno: "✋",
    gruppi: [],
  },
];

// campi che compaiono solo con una certa azione al tocco
// Le impostazioni che dipendono da un'altra: finche' l'interruttore
// principale e' spento non servono a niente e stanno solo in mezzo. Se pero'
// un valore c'e' gia' scritto, la voce si vede lo stesso - se no diventerebbe
// roba impostata che non si puo' piu' togliere.
export const DIPENDE = {
  icona_sfondo_forza: (c) => !!c.icona_sfondo,
  camera_secondi: (c) => !!c.camera_diretta,
  sfondo_adatta: (c) => !!c.sfondo_immagine || !!c.camera_diretta,
  sfondo_sfocatura: (c) => !!c.sfondo_copertina,
  finestra_apertura_durata: (c) => (c.finestra_apertura || "sfuma") !== "niente",
  nascondi_quanto: (c) => !!c.mostra_cursore,
  cursore_min: (c) => !!c.mostra_cursore,
  cursore_max: (c) => !!c.mostra_cursore,
  colore_striscia: (c) => !!c.cursore_colore,
  grafico_ore: (c) => !!c.grafico,
  grafico_colore: (c) => !!c.grafico,
  coda: (c) => c.disposizione === "ytmusic",
  yt_attrezzi: (c) => c.disposizione === "ytmusic",
  yt_cuore: (c) => c.disposizione === "ytmusic",
  grafico_stile: (c) => !!c.grafico,
  distanza_entita: (c) => !!c.mostra_distanza,
  info_nomi_auto: (c) => (c.info_entita || []).length > 0,
  segui_attivo: (c) => (c.lettori || []).length > 0 || c.multiroom !== false,
  soglia: (c) => c.acceso_se === "sopra" || c.acceso_se === "sotto"
    || (Array.isArray(c.acceso_entita) ? c.acceso_entita.length : !!c.acceso_entita),
};

export const SOLO_AZIONE = {
  servizio: "servizio", servizio_dati: "servizio",
  indirizzo_web: "link", popup: "popup", finestra_titolo: "finestra",
  finestra_apertura: "finestra", finestra_apertura_durata: "finestra",
  finestra_largo: "finestra",
  finestra_sfondo: "finestra", finestra_trasparenza: "finestra",
  finestra_immagine: "finestra", finestra_schede_sfondo: "finestra",
  finestra_schede_trasparenza: "finestra",
};

// quali impostazioni hanno senso per quale tipo di entita'
export const SOLO_PER = {
  disposizione: ["person", "device_tracker", "media_player"],
  usa_foto: ["person", "device_tracker", "media_player", "camera"],
  mostra_distanza: ["person", "device_tracker"],
  distanza_entita: ["person", "device_tracker"],
  mostra_cursore: ["light", "fan", "media_player", "number", "input_number", "cover"],
  cursore_colore: ["light"],
  sfondo_copertina: ["media_player"],
  sfondo_sfocatura: ["media_player"],
  cursore_min: ["number", "input_number"],
  cursore_max: ["number", "input_number"],
  colore_striscia: ["light"],
  comandi_media: ["media_player"],
  tempo_media: ["media_player"],
  lettori: ["media_player"],
  camera_diretta: ["camera", "image"],
  camera_secondi: ["camera", "image"],
  pannello_sfondo: ["media_player"],
  pannello_trasparenza: ["media_player"],
  riquadri_trasparenza: ["media_player"],
  comandi_rapidi: ["cover", "lock", "vacuum"],
  grafico: ["sensor", "number", "input_number", "counter", "climate", "light"],
  grafico_colore: ["sensor", "number", "input_number", "counter", "climate", "light"],
  grafico_ore: ["sensor", "number", "input_number", "counter", "climate", "light"],
  grafico_stile: ["sensor", "number", "input_number", "counter", "climate", "light"],
  gira_copertina: ["media_player"],
  coda: ["media_player"], yt_attrezzi: ["media_player"],
  yt_cuore: ["media_player"],
  segui_attivo: ["media_player"],
  multiroom: ["media_player"],
  sorgente: ["media_player"],
  soglia: ["sensor", "number", "input_number", "counter"],
  acceso_sempre: ["sensor", "binary_sensor", "weather", "number", "input_number",
                  "counter", "media_player"],
};

export const ETICHETTE = {
  entity: "Entita (lasciala vuota se la casella serve solo ad aprire il pop-up)",
  name: "Nome mostrato", sottotitolo: "Sottotitolo scritto da te (facoltativo)",
  sottotitolo_entita: "Sottotitolo preso da un'altra entita (es. l'indirizzo)",
  meteo_entita: "Meteo nell'angolo (scegli l'entita del meteo)",
  indirizzo_web: "Indirizzo web da aprire (per l'azione \"Apri un indirizzo web\")",
  icona: "Icona animata", colore: "Colore quando e accesa",
  icona_sfondo: "L'icona in grande dietro alle scritte",
  icona_sfondo_forza: "Quanto si vede l'icona dietro (%)",
  carica_entita: "Quali entita vogliono dire che STA CARICANDO (di solito non serve: basta chiamare carica una misura)",
  scarica_entita: "Quali entita vogliono dire che STA DANDO CORRENTE (di solito non serve: basta chiamare scarica una misura)",
  disposizione: "Come e disposta la casella",
  azione: "Cosa fa quando la tocchi", anima: "Quando si muove l'icona",
  effetto: "Effetto della casella", intensita: "Intensita del colore (%)",
  anima: "Quando si muove (icona ed effetti)",
  coda: "Elenco In coda (serve Music Assistant)",
  yt_attrezzi: "Tastini cerca / sfoglia / coda / schermo intero",
  yt_cuore: "Cuoricino dei preferiti",
  grafico_colore: "Colore del grafico (vuoto = come la casella)",
  colore_testo: "Colore del nome e del sottotitolo (vuoto = quello del tema)",
  colore_valore: "Colore del valore, quello grande (vuoto = come il nome)",
  colore_rgb: "Colore personalizzato (vale solo scegliendo \"personalizzato\" qui sopra)",
  sfondo_colore: "Sfondo della casella (tinta)",
  trasparenza: "Trasparenza della casella (%)",
  sfondo_meteo: "Usa il meteo come sfondo di tutta la casella",
  meteo_forza: "Quanto si vede la scena meteo (%) - 0 lascia solo il colore",
  camera_diretta: "Riempi la casella con l'immagine della telecamera, viva",
  camera_secondi: "Ogni quanti secondi si rifa l'immagine",
  sfondo_immagine: "Foto di sfondo - indirizzo, es. /local/foto.jpg",
  sfondo_adatta: "Come si adatta la foto",
  sfondo_copertina: "Copertina del disco come sfondo",
  sfondo_sfocatura: "Quanto sfocarla (0 = nitida)",
  sfondo_velo: "Velo scuro sulla foto o sulla copertina (%) - serve a leggere il testo",
  velocita: "Velocita dell'effetto (%) - 100 e normale",
  popup: "Pop-up bubble-card da aprire (es. #luci)",
  info_entita: "Misure mostrate in basso (aggiungine altre da qui)",
  info_nomi_auto: "Scrivi un nome anche sulle misure che non hai chiamato tu",
  mostra_cursore: "Barra dentro la casella (luci, ventole, musica, valori da impostare)",
  nascondi_quanto: "Nascondi il numerino in fondo alla barra",
  cursore_colore: "Striscia del colore dentro la casella",
  colore_striscia: "Quale striscia mostrare",
  cursore_min: "La barra parte da (lascia vuoto = minimo dell'entita)",
  cursore_max: "La barra arriva a (es. 800, invece dei 1200 dell'entita)",
  comandi_media: "Comandi della musica dentro la casella",
  tempo_media: "Tempo del brano e barra di avanzamento",
  lettori: "Casse tra cui scegliere (i tastini in alto nella casella)",
  pannello_sfondo: "Sfondo del riquadro casse e sorgenti (vuoto = scuro di serie; "
    + "le scritte seguono il colore della scritta)",
  pannello_trasparenza: "Trasparenza del riquadro casse e sorgenti (%)",
  riquadri_trasparenza: "Trasparenza dei riquadri ricerca, sfoglia e coda (%)",
  comandi_rapidi: "Tasti rapidi (tapparelle, serrature, aspirapolvere)",
  grafico: "Mostra il grafico dell'andamento dentro la casella",
  grafico_ore: "Quante ore di storia (di serie 24)",
  grafico_stile: "Come si disegna",
  gira_copertina: "Fai girare la copertina tonda come un disco",
  segui_attivo: "Passa da sola alla cassa che sta suonando",
  multiroom: "Tasto Casse: unisci gli altoparlanti e regola i volumi",
  sorgente: "Tasto Sorgente: scegli l'ingresso del lettore",
  grande: "Casella grande",
  mostra_icona: "Mostra l'icona (toglila per lasciare solo le scritte)",
  icona_entita: "Usa l'icona che l'entita ha gia in Home Assistant, se ce l'ha",
  usa_foto: "Usa la foto dell'entita, se ce l'ha (persone, copertine)",
  acceso_sempre: "Sempre a colori (anche da spenta)",
  acceso_entita: "Si accende in base ad altre entita: basta che una sia attiva (es. i watt che escono invece della carica)",
  icona_ha: "Icona di Home Assistant (cercala qui; vince su quella sotto)",
  mostra_da_quanto: "Scrivi da quanto tempo e in questo stato",
  mostra_distanza: "Quanti chilometri da casa, in linea d'aria (persone)",
  distanza_entita: "Sensore del percorso (Waze, Google): se c'e, usa i km su strada",
  nascondi_valore: "Nascondi il valore", soglia: "Soglia di accensione (W)",
  acceso_se: "Si accende solo quando l'entita' vale esattamente (es. 95)",
  servizio: "Servizio da chiamare (es. number.set_value)",
  servizio_dati: "Dati del servizio, in YAML (es. value: 95)",
  finestra_titolo: "Titolo del pop-up",
  icona_immagine: "Immagine al posto dell'icona",
  icona_immagine_accesa: "Immagine di quando e acceso (anche una gif)",
  finestra_apertura: "Come si apre la finestra",
  finestra_apertura_durata: "Quanto dura l'apertura (millesimi di secondo)",
  finestra_largo: "Larghezza del pop-up in punti (vuoto = 560, come tutti gli altri)",
  finestra_sfondo: "Tinta della finestra del pop-up (le schede dentro hanno la loro, qui sotto)",
  finestra_trasparenza: "Trasparenza del pop-up (%)",
  finestra_immagine: "Foto di sfondo del pop-up - indirizzo, es. /local/foto.jpg",
  // finestra_schede_sfondo / finestra_schede_trasparenza: non si scelgono
  // piu' da qui (ogni scheda ha la sua riga), ma se c'erano gia' valgono
  // ancora come valore di partenza
};

export const SCHEDE_PRONTE = [
  ["entities", "Elenco con i comandi"],
  ["tile", "Riquadri"],
  ["glance", "Colpo d'occhio"],
  ["light", "Luce (rotella luminosita)"],
  ["thermostat", "Termostato"],
  ["media-control", "Lettore musicale"],
  ["picture-entity", "Telecamera / immagine"],
  ["map", "Mappa"],
  ["gauge", "Indicatore a lancetta"],
  ["history-graph", "Grafico storico"],
];

export const SCHEDE_ALTRE = [
  ["button", "Pulsante"],
  ["sensor", "Sensore con grafico"],
  ["statistics-graph", "Grafico statistiche"],
  ["humidifier", "Umidificatore"],
  ["picture-glance", "Immagine con icone"],
  ["weather-forecast", "Meteo"],
  ["calendar", "Calendario"],
  ["todo-list", "Lista cose da fare"],
  ["markdown", "Testo libero"],
  ["alarm-panel", "Antifurto"],
  ["logbook", "Registro"],
  ["area", "Area"],
  ["grid", "Griglia di schede"],
  ["vertical-stack", "Pila verticale"],
  ["horizontal-stack", "Pila orizzontale"],
  ["iframe", "Pagina web"],
  ["picture", "Solo un'immagine"],
  ["conditional", "Condizionale (si vede solo se...)"],
  ["entity-filter", "Elenco filtrato"],
  ["statistic", "Statistica (un numero solo)"],
];

// La voce per chi vuole scrivere il codice a mano: e' la stessa cosa che
// Home Assistant chiama "Manuale". Serve per le schede che non stanno
// nell'elenco - le sue schede della comunita' ci sono gia' tutte, ma di
// schede di Home Assistant ce ne sono anche di rare, e senza questa voce
// non c'era modo di metterle.
export const SCHEDA_MANO = "__amano__";

// il nome per esteso di una scheda (quello che si vede nell'elenco di HA)
export const NOMI_HA = {
  entities: "Entita", glance: "Colpo d'occhio", tile: "Casella", button: "Pulsante",
  gauge: "Indicatore", "history-graph": "Grafico storico", map: "Mappa",
  "statistics-graph": "Grafico statistiche", sensor: "Sensore con grafico",
  thermostat: "Termostato", light: "Luce", markdown: "Testo", picture: "Immagine",
  "picture-entity": "Immagine con entita", "media-control": "Lettore multimediale",
  "weather-forecast": "Meteo", grid: "Griglia", "vertical-stack": "Pila verticale",
  "horizontal-stack": "Pila orizzontale", area: "Stanza", logbook: "Registro",
  calendar: "Calendario", energy: "Energia", iframe: "Pagina web", todo: "Cose da fare",
  humidifier: "Umidificatore", alarm: "Allarme", "alarm-panel": "Allarme",
  distribution: "Distribuzione", heading: "Titolo",
};

export function nomeScheda(tipo) {
  const pulito = String(tipo || "").replace("custom:", "");
  if (NOMI_HA[pulito]) return NOMI_HA[pulito];
  const elenco = window.customCards || [];
  for (let i = 0; i < elenco.length; i += 1) {
    const c = elenco[i];
    if (c && (c.type === pulito || c.type === tipo)) return c.name || pulito;
  }
  return pulito.replace(/-/g, " ").replace(/card/gi, "").trim() || pulito;
}

export const STILE_SELETTORE = `
.scelta-riga { display: flex; gap: 8px; align-items: center; margin-top: 6px; }
.tendina { flex: 1; padding: 10px 12px; border-radius: 10px; font: inherit; font-size: 14px;
  border: 1px solid var(--divider-color, #555);
  background: var(--card-background-color, #1c1c1c); color: var(--primary-text-color, #fff); }
.tendina optgroup { color: var(--secondary-text-color, #aaa); }
.tendina option { color: var(--primary-text-color, #fff);
  background: var(--card-background-color, #1c1c1c); }
`;
