/*!
 * Casa · casella animata — scheda Lovelace personalizzata
 * Icone SVG animate + editor visuale: si configura a clic, senza scrivere YAML.
 * v2.4.55
 */

const VERSIONE = "2.6.7";

const COLORI = {
  ambra: "#ffc046", oro: "#ffcf5c", arancio: "#ff9a3c", rosso: "#ff5f5f",
  rosa: "#ff9ec7", viola: "#9b6bff", blu: "#5ec8ff", azzurro: "#7aa7ff",
  verde: "#3fd98a", acqua: "#4fe0c8", lime: "#cddc39", grigio: "#8ab4f8",
};

/* ------------------------------------------------------------------ icone */
const ICONE = {
  luce: `<defs><radialGradient id="g1" cx="50%" cy="40%" r="60%"><stop offset="0" stop-color="#fff6d0"/><stop offset="1" stop-color="#ffc247"/></radialGradient></defs>
<g class="an glow alone"><circle cx="32" cy="27" r="22" fill="#ffcf5c" opacity=".22"/></g>
<path d="M32 8c9.4 0 16 6.6 16 15 0 6-3.4 9.2-5.6 12.2-1.6 2.2-2.4 3.8-2.4 6.3H24c0-2.5-.8-4.1-2.4-6.3C19.4 32.2 16 29 16 23c0-8.4 6.6-15 16-15z" fill="url(#g1)"/>
<rect x="24" y="43" width="16" height="5" rx="2.5" fill="#9aa6b6"/><rect x="26" y="49" width="12" height="4.5" rx="2.2" fill="#7d8896"/>`,

  led: `<g class="an glow alone"><rect x="4" y="20" width="56" height="24" rx="12" fill="#8b5cf6" opacity=".25"/></g>
<rect x="8" y="26" width="48" height="12" rx="6" fill="#1b2233" stroke="#3a4a6b" stroke-width="1.5"/>
<g class="an glow"><circle cx="17" cy="32" r="3.2" fill="#ff5f9e"/><circle cx="27" cy="32" r="3.2" fill="#9b6bff"/><circle cx="37" cy="32" r="3.2" fill="#5ec8ff"/><circle cx="47" cy="32" r="3.2" fill="#4fe0c8"/></g>`,

  presa: `<defs><linearGradient id="g2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff3e0"/><stop offset="1" stop-color="#d9a86a"/></linearGradient></defs>
<g class="an glow alone"><circle cx="32" cy="32" r="26" fill="#ff9a3c" opacity=".2"/></g>
<rect x="12" y="12" width="40" height="40" rx="13" fill="url(#g2)"/><circle cx="32" cy="32" r="14" fill="#f0dcc0"/>
<circle cx="25.5" cy="30" r="3.1" fill="#4a3a28"/><circle cx="38.5" cy="30" r="3.1" fill="#4a3a28"/>
<rect x="29.5" y="38" width="5" height="6" rx="2.5" fill="#4a3a28"/>
<g class="an spark" stroke="#ffd166" stroke-width="2.2" stroke-linecap="round"><path d="M14 20l-6-5"/><path d="M50 20l6-5"/><path d="M12 40l-7 3"/><path d="M52 40l7 3"/></g>`,

  lavatrice: `<defs><linearGradient id="g3" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#dfe9f6"/><stop offset="1" stop-color="#93a6bd"/></linearGradient>
<radialGradient id="g4" cx="50%" cy="40%" r="65%"><stop offset="0" stop-color="#2a4a6b"/><stop offset="1" stop-color="#0d1a29"/></radialGradient></defs>
<g class="an shake"><rect x="9" y="6" width="46" height="52" rx="9" fill="url(#g3)"/><rect x="9" y="6" width="46" height="12" rx="6" fill="#b9c8db"/>
<circle cx="17.5" cy="12" r="2.2" fill="#5b6d84"/><rect x="38" y="9.5" width="12" height="5" rx="2.5" fill="#5b6d84" opacity=".55"/>
<circle cx="32" cy="37" r="16.5" fill="#7d8ea4"/><circle cx="32" cy="37" r="13.5" fill="url(#g4)"/>
<g class="an drum"><circle cx="32" cy="30.5" r="3.1" fill="#4fc9e8"/><circle cx="37.5" cy="40" r="2.5" fill="#f2c14e"/><circle cx="26.5" cy="41" r="2.7" fill="#e8657f"/></g></g>`,

  ventola: `<defs><linearGradient id="g5" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#dff1ff"/><stop offset="1" stop-color="#6f97bd"/></linearGradient></defs>
<circle cx="32" cy="29" r="23.5" fill="#0b1522" stroke="#2b445e" stroke-width="2"/>
<g class="an rotafast"><g fill="url(#g5)"><path d="M32 29c-1.5-9.5 1-16 6.5-16.5 5-.5 7.5 5.5 3 11.5-2.6 3.4-6.6 4.7-9.5 5z"/>
<path d="M32 29c8.6 4.3 12.4 9.8 9.6 14.4-2.6 4.3-9.3 2.6-11.2-4.6-1.1-4.1.4-8 1.6-9.8z"/>
<path d="M32 29c-7.1 5.2-13.4 6.2-16.1 2-2.5-4 1.6-9.6 8.8-8.2 4.1.8 6.4 4.4 7.3 6.2z"/></g>
<circle cx="32" cy="29" r="5" fill="#eaf6ff"/><circle cx="32" cy="29" r="2.1" fill="#3d6289"/></g>
<path d="M24 53h16l-2.5 6h-11z" fill="#7d8ea4"/><rect x="20" y="58" width="24" height="4" rx="2" fill="#5b6d84"/>`,

  batteria: `<defs><linearGradient id="g6" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2fd07a"/><stop offset="1" stop-color="#8ef0b0"/></linearGradient></defs>
<rect x="7" y="18" width="44" height="28" rx="8" fill="#0e1b26" stroke="#3d6b57" stroke-width="2"/>
<rect x="53" y="27" width="5" height="10" rx="2.5" fill="#3d6b57"/>
<g class="an riempi"><rect x="11" y="22" width="36" height="20" rx="5" fill="url(#g6)"/></g>
<g class="an bolt"><path d="M33 20l-10 14h7l-3 11 11-15h-7z" fill="#0b141c" stroke="#eafff2" stroke-width="1.4" stroke-linejoin="round"/></g>`,

  sole: `<defs><radialGradient id="g7" cx="50%" cy="45%" r="60%"><stop offset="0" stop-color="#fff4c4"/><stop offset="1" stop-color="#f7a63b"/></radialGradient></defs>
<g class="an rotalenta" stroke="#ffc65c" stroke-width="3" stroke-linecap="round"><path d="M32 4v7"/><path d="M32 53v7"/><path d="M4 32h7"/><path d="M53 32h7"/>
<path d="M12 12l5 5"/><path d="M47 47l5 5"/><path d="M52 12l-5 5"/><path d="M17 47l-5 5"/></g>
<g class="an glow alone"><circle cx="32" cy="32" r="20" fill="#ffca62" opacity=".22"/></g><circle cx="32" cy="32" r="13.5" fill="url(#g7)"/>`,

  musica: `<rect x="6" y="8" width="52" height="48" rx="13" fill="#180d12" stroke="#4a1f2b" stroke-width="2"/>
<g fill="#ff4d5e"><rect class="an bar" x="15" y="18" width="6" height="28" rx="3"/><rect class="an bar b2" x="24.5" y="18" width="6" height="28" rx="3"/>
<rect class="an bar b3" x="34" y="18" width="6" height="28" rx="3"/><rect class="an bar b4" x="43.5" y="18" width="6" height="28" rx="3"/></g>`,

  termosifone: `<g class="an calore" stroke="#ff8a5c" stroke-width="2.6" stroke-linecap="round"><path d="M22 20v-6"/><path d="M32 20v-6"/><path d="M42 20v-6"/></g>
<rect x="12" y="22" width="40" height="30" rx="6" fill="#20293a" stroke="#3e5570" stroke-width="1.6"/>
<g fill="#e05b3a"><rect x="17" y="25" width="5" height="24" rx="2.5"/><rect x="26" y="25" width="5" height="24" rx="2.5"/>
<rect x="35" y="25" width="5" height="24" rx="2.5"/><rect x="44" y="25" width="5" height="24" rx="2.5"/></g>
<rect x="14" y="52" width="4" height="6" rx="2" fill="#5b6d84"/><rect x="46" y="52" width="4" height="6" rx="2" fill="#5b6d84"/>`,

  termometro: `<defs><linearGradient id="g8" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ff5f5f"/><stop offset="1" stop-color="#ffb35c"/></linearGradient></defs>
<g class="an glow alone"><circle cx="30" cy="46" r="16" fill="#ff6b6b" opacity=".2"/></g>
<rect x="24" y="6" width="12" height="36" rx="6" fill="#1b2433" stroke="#3e5570" stroke-width="1.6"/>
<circle cx="30" cy="46" r="10" fill="#1b2433" stroke="#3e5570" stroke-width="1.6"/>
<g class="an sale"><rect x="27" y="16" width="6" height="30" rx="3" fill="url(#g8)"/></g>
<circle cx="30" cy="46" r="6.5" fill="#ff5f5f"/>
<g stroke="#5f7189" stroke-width="1.6" stroke-linecap="round"><path d="M40 14h5"/><path d="M40 22h5"/><path d="M40 30h5"/></g>`,

  telecamera: `<rect x="8" y="18" width="34" height="24" rx="7" fill="#1c2636" stroke="#3e5570" stroke-width="1.6"/>
<path d="M42 27l12-6v22l-12-6z" fill="#243248" stroke="#3e5570" stroke-width="1.6" stroke-linejoin="round"/>
<circle cx="22" cy="30" r="7.5" fill="#0e1520" stroke="#4a688c" stroke-width="1.4"/>
<circle cx="22" cy="30" r="3.4" fill="#5ec8ff"/><circle cx="19.8" cy="27.8" r="1.2" fill="#dff1ff"/>
<circle class="an rec" cx="35" cy="24" r="2.6" fill="#ff4d5e"/>
<rect x="20" y="44" width="6" height="9" rx="2" fill="#5b6d84"/><rect x="12" y="52" width="22" height="4" rx="2" fill="#48586e"/>`,

  robot: `<g class="an glow alone"><circle cx="32" cy="32" r="26" fill="#4fe0c8" opacity=".16"/></g>
<circle cx="32" cy="32" r="22" fill="#233145" stroke="#41607f" stroke-width="2"/>
<path d="M12 26a22 22 0 0 1 40 0z" fill="#2e4159"/><circle cx="32" cy="24" r="4" fill="#0f1723" stroke="#5ec8ff" stroke-width="1.4"/>
<g class="an rotamedia"><g stroke="#8ef0d8" stroke-width="2.4" stroke-linecap="round"><path d="M32 38v-7"/><path d="M32 38v7"/><path d="M32 38h-7"/><path d="M32 38h7"/></g>
<circle cx="32" cy="38" r="2.4" fill="#8ef0d8"/></g><rect x="24" y="50" width="16" height="4" rx="2" fill="#41607f"/>`,

  pianta: `<path d="M22 52h20l-2 8H24z" fill="#8a5a3b"/><rect x="20" y="46" width="24" height="7" rx="2.5" fill="#a86b45"/>
<g class="an ondeggia"><path d="M32 46V22" stroke="#4f9d5a" stroke-width="2.6" stroke-linecap="round"/>
<path d="M32 30c-9 0-13-5-12-10 6-1 11 3 12 10z" fill="#57b464"/><path d="M32 36c8.5 0 12.5-5 11.5-10-5.7-1-10.5 3-11.5 10z" fill="#3f9a52"/>
<path d="M32 24c-5.5-3-6.5-8-4-11 4 1.5 5.5 6 4 11z" fill="#69c877"/></g>
<g class="an glow"><circle cx="46" cy="20" r="3.4" fill="#5ec8ff"/></g>`,

  televisore: `<rect x="6" y="12" width="52" height="34" rx="6" fill="#161f2e" stroke="#3e5570" stroke-width="1.8"/>
<g class="an glow"><rect x="10" y="16" width="44" height="26" rx="3" fill="#2b6ea8" opacity=".8"/></g>
<rect x="26" y="48" width="12" height="4" rx="2" fill="#5b6d84"/><rect x="18" y="52" width="28" height="4" rx="2" fill="#48586e"/>`,

  altoparlante: `<rect x="16" y="6" width="32" height="52" rx="10" fill="#1a2433" stroke="#3e5570" stroke-width="1.8"/>
<circle cx="32" cy="22" r="8" fill="#0f1723" stroke="#4a688c" stroke-width="1.4"/><circle cx="32" cy="22" r="3.4" fill="#5ec8ff"/>
<g class="an glow"><circle cx="32" cy="44" r="9" fill="#4fe0c8" opacity=".35"/></g>
<circle cx="32" cy="44" r="6.5" fill="#0f1723" stroke="#41607f" stroke-width="1.3"/>`,

  luna: `<g class="an glow alone"><circle cx="34" cy="30" r="20" fill="#cfd8ff" opacity=".18"/></g>
<path d="M40 12a18 18 0 1 0 12 26 20 20 0 0 1-12-26z" fill="#e8eeff"/>
<g class="an spark"><circle cx="18" cy="18" r="1.8" fill="#fff"/><circle cx="24" cy="44" r="1.4" fill="#fff"/></g>`,

  nuvola: `<g class="an nuvolina"><path d="M20 44h25a9.5 9.5 0 0 0 .6-19 13.5 13.5 0 0 0-26 3.6A8.2 8.2 0 0 0 20 44z" fill="#c6d5e8"/>
<path d="M22 40h22a6 6 0 0 0 .4-12 9 9 0 0 0-17 2.4A5.4 5.4 0 0 0 22 40z" fill="#e3ecf7" opacity=".55"/></g>`,

  sole_nuvole: `<g class="an rotalenta"><circle cx="24" cy="24" r="9" fill="#ffcf5c"/>
<g stroke="#ffcf5c" stroke-width="2.6" stroke-linecap="round"><path d="M24 8v4M24 36v4M8 24h4M36 24h4M13 13l3 3M32 32l3 3M35 13l-3 3M16 32l-3 3"/></g></g>
<g class="an nuvolina"><path d="M26 46h22a8.6 8.6 0 0 0 .5-17 12 12 0 0 0-23 3.2A7.4 7.4 0 0 0 26 46z" fill="#c6d5e8"/></g>`,

  pioggia: `<path d="M20 38h25a9.5 9.5 0 0 0 .6-19 13.5 13.5 0 0 0-26 3.6A8.2 8.2 0 0 0 20 38z" fill="#9fb3c9"/>
<g fill="#6fc3ff"><g class="an goccia"><path d="M24 42c0 0 3 4 3 5.6a3 3 0 0 1-6 0C21 46 24 42 24 42z"/></g>
<g class="an goccia g2"><path d="M34 42c0 0 3 4 3 5.6a3 3 0 0 1-6 0C31 46 34 42 34 42z"/></g>
<g class="an goccia g3"><path d="M44 42c0 0 3 4 3 5.6a3 3 0 0 1-6 0C41 46 44 42 44 42z"/></g></g>`,

  neve: `<path d="M20 38h25a9.5 9.5 0 0 0 .6-19 13.5 13.5 0 0 0-26 3.6A8.2 8.2 0 0 0 20 38z" fill="#b9cbdd"/>
<g stroke="#eaf4ff" stroke-width="2" stroke-linecap="round">
<g class="an fiocco"><path d="M24 44v6M21 45.5l6 3M27 45.5l-6 3"/></g>
<g class="an fiocco g2"><path d="M34 44v6M31 45.5l6 3M37 45.5l-6 3"/></g>
<g class="an fiocco g3"><path d="M44 44v6M41 45.5l6 3M47 45.5l-6 3"/></g></g>`,

  temporale: `<path d="M20 36h25a9.5 9.5 0 0 0 .6-19 13.5 13.5 0 0 0-26 3.6A8.2 8.2 0 0 0 20 36z" fill="#8d9fb4"/>
<g class="an bolt"><path d="M33 36l-9 14h7l-3 10 12-16h-7l4-8z" fill="#ffd54a"/></g>`,

  nebbia: `<g class="an nuvolina"><path d="M20 32h25a9.5 9.5 0 0 0 .6-19 13.5 13.5 0 0 0-26 3.6A8.2 8.2 0 0 0 20 32z" fill="#c2ccd6"/></g>
<g stroke="#dbe4ec" stroke-width="3" stroke-linecap="round" opacity=".8">
<path class="an nuvolina" d="M16 40h32"/><path class="an nuvolina g2" d="M20 47h26"/>
<path class="an nuvolina g3" d="M18 54h30"/></g>`,

  vento: `<g stroke="#cfe3f5" stroke-width="3.4" stroke-linecap="round" fill="none">
<path class="an nuvolina" d="M10 24h26a6 6 0 1 0-6-6"/>
<path class="an nuvolina g2" d="M12 34h30a6.5 6.5 0 1 1-6.5 6.5"/>
<path class="an nuvolina g3" d="M16 44h16a5 5 0 1 0-5-5"/></g>`,

  stampante: `<rect x="12" y="14" width="40" height="18" rx="4" fill="#3a4a63"/>
<rect x="16" y="18" width="32" height="10" rx="2" fill="#101827"/>
<g class="an shake"><rect x="27" y="30" width="10" height="7" rx="2" fill="#8ea6c2"/>
<path d="M32 37l3 5h-6l3-5z" fill="#ff8a3d"/></g>
<rect x="10" y="44" width="44" height="6" rx="3" fill="#5b6b84"/>
<rect x="22" y="40" width="20" height="4" rx="2" fill="#c3d3e6"/>`,

  misura: `<path d="M14 40a18 18 0 1 1 36 0" fill="none" stroke="#41607f" stroke-width="5"
 stroke-linecap="round"/>
<path d="M14 40a18 18 0 0 1 12-17" fill="none" stroke="#4fe0c8" stroke-width="5"
 stroke-linecap="round"/>
<g class="an ondeggia"><path d="M32 40l9-11" stroke="#e7f0ff" stroke-width="3.4"
 stroke-linecap="round"/></g>
<circle cx="32" cy="40" r="3.4" fill="#e7f0ff"/>`,

  porta: `<rect x="16" y="10" width="32" height="44" rx="3" fill="#6b4b2a"/>
<rect x="20" y="14" width="24" height="36" rx="2" fill="#8a6236"/>
<g class="an shake"><circle cx="40" cy="33" r="2.6" fill="#ffcf5c"/></g>`,

  finestra: `<rect x="12" y="12" width="40" height="40" rx="4" fill="#2a3a52"/>
<rect x="15" y="15" width="34" height="34" rx="2" fill="#5ec8ff" opacity=".35"/>
<g stroke="#c3d3e6" stroke-width="3"><path d="M32 15v34M15 32h34"/></g>
<g class="an glow"><rect x="17" y="17" width="13" height="13" fill="#eaf4ff" opacity=".25"/></g>`,

  serratura: `<rect x="16" y="28" width="32" height="24" rx="5" fill="#8ea6c2"/>
<path d="M22 28v-7a10 10 0 0 1 20 0v7" fill="none" stroke="#c3d3e6" stroke-width="4"/>
<g class="an glow"><circle cx="32" cy="40" r="4" fill="#0f1723"/></g>`,

  tapparella: `<rect x="12" y="10" width="40" height="8" rx="2" fill="#5b6b84"/>
<g class="an sale"><rect x="14" y="20" width="36" height="5" rx="2" fill="#8ea6c2"/>
<rect x="14" y="27" width="36" height="5" rx="2" fill="#8ea6c2" opacity=".85"/>
<rect x="14" y="34" width="36" height="5" rx="2" fill="#8ea6c2" opacity=".6"/></g>`,

  campanello: `<g class="an ondeggia"><path d="M32 12a12 12 0 0 1 12 12v10l4 6H16l4-6V24a12 12 0 0 1 12-12z" fill="#ffcf5c"/></g>
<circle cx="32" cy="48" r="4" fill="#ffcf5c"/>`,

  movimento: `<circle cx="32" cy="16" r="6" fill="#4fe0c8"/>
<g class="an shake"><path d="M32 24l-9 8 4 6-3 12h5l3-10 5 4v6h5V40l-6-6 3-6 6 4 3-4-8-6z" fill="#7ad8ff"/></g>`,

  acqua: `<g class="an glow"><path d="M32 10c8 12 14 18 14 26a14 14 0 0 1-28 0c0-8 6-14 14-26z" fill="#4fb8ff"/></g>
<path d="M26 38a6 6 0 0 0 6 6" fill="none" stroke="#cfe9ff" stroke-width="3" stroke-linecap="round"/>`,

  fumo: `<g class="an glow alone"><circle cx="32" cy="34" r="16" fill="#ff6b6b" opacity=".25"/></g>
<circle cx="32" cy="34" r="12" fill="#3a4a63"/><circle cx="32" cy="34" r="4" fill="#ff6b6b"/>
<g stroke="#8ea6c2" stroke-width="2.4" stroke-linecap="round"><path d="M32 14v6M14 34h6M44 34h6"/></g>`,

  wifi: `<g stroke="#5ec8ff" stroke-width="4.5" stroke-linecap="round" fill="none">
<path class="an glow" d="M12 26a28 28 0 0 1 40 0"/>
<path class="an glow g2" d="M20 34a17 17 0 0 1 24 0"/></g>
<circle class="an glow g3" cx="32" cy="44" r="4" fill="#5ec8ff"/>`,

  computer: `<rect x="10" y="14" width="44" height="28" rx="3" fill="#3a4a63"/>
<rect x="14" y="18" width="36" height="20" rx="2" fill="#0f1723"/>
<g class="an glow"><rect x="17" y="21" width="20" height="3" rx="1.5" fill="#4fe0c8"/>
<rect x="17" y="27" width="12" height="3" rx="1.5" fill="#5ec8ff"/></g>
<rect x="22" y="46" width="20" height="4" rx="2" fill="#8ea6c2"/>`,

  telefono: `<rect x="20" y="8" width="24" height="48" rx="5" fill="#3a4a63"/>
<rect x="23" y="13" width="18" height="36" rx="2" fill="#0f1723"/>
<g class="an glow"><rect x="26" y="17" width="12" height="2.6" rx="1.3" fill="#4fe0c8"/></g>
<circle cx="32" cy="52" r="2" fill="#8ea6c2"/>`,

  automobile: `<path d="M12 40l4-12a5 5 0 0 1 5-3h22a5 5 0 0 1 5 3l4 12v8h-8v-4H20v4h-8z" fill="#5ec8ff"/>
<g class="an glow"><circle cx="21" cy="40" r="3.4" fill="#0f1723"/><circle cx="43" cy="40" r="3.4" fill="#0f1723"/></g>`,

  garage: `<path d="M10 28L32 12l22 16v26H10z" fill="#5b6b84"/>
<g class="an sale"><rect x="18" y="34" width="28" height="4" rx="2" fill="#c3d3e6"/>
<rect x="18" y="41" width="28" height="4" rx="2" fill="#c3d3e6" opacity=".8"/>
<rect x="18" y="48" width="28" height="4" rx="2" fill="#c3d3e6" opacity=".6"/></g>`,

  caffe: `<path d="M16 20h26v16a13 13 0 0 1-26 0z" fill="#8a6236"/>
<path d="M42 24h5a6 6 0 0 1 0 12h-5" fill="none" stroke="#8ea6c2" stroke-width="3"/>
<rect x="12" y="50" width="34" height="4" rx="2" fill="#5b6b84"/>
<g class="an calore" stroke="#c3d3e6" stroke-width="2.4" stroke-linecap="round">
<path d="M24 16v-4M32 16v-5M40 16v-4"/></g>`,

  frigo: `<rect x="18" y="8" width="28" height="48" rx="4" fill="#c3d3e6"/>
<rect x="18" y="26" width="28" height="2.6" fill="#8ea6c2"/>
<rect x="40" y="16" width="3" height="7" rx="1.5" fill="#5b6b84"/>
<rect x="40" y="32" width="3" height="9" rx="1.5" fill="#5b6b84"/>
<g class="an glow"><circle cx="24" cy="20" r="2" fill="#4fe0c8"/></g>`,

  forno: `<rect x="12" y="14" width="40" height="38" rx="4" fill="#3a4a63"/>
<rect x="17" y="26" width="30" height="20" rx="3" fill="#101827"/>
<g class="an glow"><rect x="19" y="28" width="26" height="16" rx="2" fill="#ff8a3d" opacity=".55"/></g>
<circle cx="21" cy="20" r="2.4" fill="#8ea6c2"/><circle cx="30" cy="20" r="2.4" fill="#8ea6c2"/>`,

  allarme: `<g class="an bolt"><path d="M32 8l22 10v14c0 13-9 20-22 24-13-4-22-11-22-24V18z" fill="#ff6b6b"/></g>
<path d="M24 32l6 6 12-12" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`,

  fulmine: `<defs><linearGradient id="gf1" x1="0" y1="0" x2="0.3" y2="1">
<stop offset="0" stop-color="#fff3c4"/><stop offset=".5" stop-color="#ffc046"/>
<stop offset="1" stop-color="#ff9a3c"/></linearGradient></defs>
<g class="an glow"><path d="M36 6L16 36h12l-4 22 20-30H32l4-22z" fill="#ffc046" opacity=".35"
 transform="translate(0 0) scale(1.18)" transform-origin="32px 32px"/></g>
<path d="M36 6L16 36h12l-4 22 20-30H32l4-22z" fill="url(#gf1)"/>
<path d="M36 6L16 36h12" fill="none" stroke="#fff8dc" stroke-opacity=".55" stroke-width="1.6"/>`,

  persona: `<g class="an eco"><circle cx="32" cy="32" r="26" fill="none" stroke="#5ec8ff" stroke-width="2"/></g>
<circle cx="32" cy="32" r="21" fill="#1d2939" stroke="#41607f" stroke-width="1.8"/>
<circle cx="32" cy="26" r="7.5" fill="#8fc7f0"/><path d="M18.5 46a13.5 13.5 0 0 1 27 0z" fill="#6ea9d6"/>`,

  aspirapolvere: `<defs><radialGradient id="asp1" cx="42%" cy="34%" r="70%">
<stop offset="0" stop-color="#33475f"/><stop offset="1" stop-color="#16202e"/></radialGradient></defs>
<circle cx="32" cy="34" r="24" fill="url(#asp1)" stroke="#41607f" stroke-width="2"/>
<path d="M8 30a24 24 0 0 1 48 0z" fill="#2c3d54"/>
<circle cx="32" cy="18" r="5" fill="#101a27" stroke="#5ec8ff" stroke-width="1.6"/>
<circle cx="32" cy="18" r="1.8" fill="#9fe2ff"/>
<g class="an rotamedia"><g stroke="#8ef0d8" stroke-width="2.6" stroke-linecap="round">
<path d="M32 38v-8"/><path d="M32 38v8"/><path d="M32 38h-8"/><path d="M32 38h8"/></g>
<circle cx="32" cy="38" r="3" fill="#8ef0d8"/></g>
<rect x="12" y="44" width="8" height="4" rx="2" fill="#41607f"/>
<rect x="44" y="44" width="8" height="4" rx="2" fill="#41607f"/>`,
  assistente: `<defs><linearGradient id="ass1" x1="0" y1="0" x2="0" y2="1">
<stop offset="0" stop-color="#33455e"/><stop offset="1" stop-color="#1a2433"/></linearGradient></defs>
<g class="an glow"><ellipse cx="32" cy="16" rx="19" ry="7" fill="#5ec8ff" opacity=".35"/></g>
<path d="M14 20h36v26a10 10 0 0 1-10 10H24a10 10 0 0 1-10-10z" fill="url(#ass1)"
 stroke="#3e5570" stroke-width="1.8"/>
<ellipse cx="32" cy="20" rx="18" ry="7" fill="#2b3d54" stroke="#4a688c" stroke-width="1.6"/>
<ellipse cx="32" cy="19" rx="12" ry="4" fill="#0f1723"/>
<g stroke="#5b6d84" stroke-width="1.6" stroke-linecap="round" opacity=".8">
<path d="M22 34h20"/><path d="M22 40h20"/><path d="M24 46h16"/></g>`,
  display: `<rect x="7" y="12" width="50" height="34" rx="6" fill="#16202e"
 stroke="#3e5570" stroke-width="2"/>
<rect x="11" y="16" width="42" height="26" rx="4" fill="#0f1a28"/>
<g class="an ondeggia"><g stroke="#5ec8ff" stroke-width="3" stroke-linecap="round">
<path d="M22 29v-6"/><path d="M28 29v-11"/><path d="M34 29v-8"/><path d="M40 29v-4"/></g></g>
<rect x="24" y="46" width="16" height="6" rx="2" fill="#3e5570"/>
<rect x="16" y="52" width="32" height="4" rx="2" fill="#4a688c"/>`,
  powerstation: `<defs><linearGradient id="pw1" x1="0" y1="0" x2="0" y2="1">
<stop offset="0" stop-color="#3a4d66"/><stop offset="1" stop-color="#1b2635"/></linearGradient></defs>
<path d="M24 10h16" stroke="#8ea6c2" stroke-width="3" stroke-linecap="round" fill="none"/>
<rect x="8" y="14" width="48" height="40" rx="7" fill="url(#pw1)" stroke="#41607f" stroke-width="2"/>
<rect x="13" y="20" width="22" height="14" rx="3" fill="#0f1723" stroke="#4a688c" stroke-width="1.2"/>
<g class="an riempi"><rect x="15" y="27" width="18" height="5" rx="2.5" fill="#3fd98a"/></g>
<circle cx="46" cy="27" r="7" fill="#0f1723" stroke="#4a688c" stroke-width="1.4"/>
<circle cx="43.6" cy="25.5" r="1.5" fill="#8ea6c2"/><circle cx="48.4" cy="25.5" r="1.5" fill="#8ea6c2"/>
<rect x="44.6" y="29" width="2.8" height="1.6" rx="0.8" fill="#8ea6c2"/>
<g class="an bolt"><path d="M31 38l-6 9h5l-2 7 8-10h-5z" fill="#ffc046"/></g>
<rect x="14" y="48" width="14" height="3" rx="1.5" fill="#41607f"/>`,
  inverter: `<rect x="10" y="10" width="44" height="44" rx="8" fill="#1e2a3a"
 stroke="#41607f" stroke-width="2"/>
<rect x="16" y="16" width="32" height="16" rx="4" fill="#0f1723"/>
<g class="an ondeggia"><path d="M18 24q4-7 8 0t8 0 8 0" fill="none" stroke="#4fe0c8"
 stroke-width="2.6" stroke-linecap="round"/></g>
<g class="an rec"><circle cx="20" cy="40" r="2.6" fill="#3fd98a"/></g>
<circle cx="28" cy="40" r="2.6" fill="#41607f"/><circle cx="36" cy="40" r="2.6" fill="#41607f"/>
<rect x="16" y="46" width="32" height="4" rx="2" fill="#33475f"/>`,
  orologio_polso: `<rect x="24" y="4" width="16" height="12" rx="4" fill="#41607f"/>
<rect x="24" y="48" width="16" height="12" rx="4" fill="#41607f"/>
<rect x="16" y="14" width="32" height="36" rx="10" fill="#16202e" stroke="#5b7794" stroke-width="2"/>
<rect x="20" y="18" width="24" height="28" rx="7" fill="#0d1521"/>
<g class="an spark"><path d="M23 32h5l3-6 4 12 3-6h5" fill="none" stroke="#4fe0c8"
 stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></g>
<rect x="48" y="26" width="3" height="8" rx="1.5" fill="#8ea6c2"/>`,
  asciugatrice: `<defs><linearGradient id="asc1" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="#dfe9f6"/><stop offset="1" stop-color="#93a6bd"/></linearGradient></defs>
<rect x="9" y="6" width="46" height="52" rx="9" fill="url(#asc1)"/>
<rect x="9" y="6" width="46" height="12" rx="6" fill="#b9c8db"/>
<circle cx="17.5" cy="12" r="2.2" fill="#5b6d84"/>
<circle cx="32" cy="37" r="16.5" fill="#7d8ea4"/><circle cx="32" cy="37" r="13.5" fill="#16283c"/>
<g class="an drum"><g stroke="#ffb15c" stroke-width="2.4" stroke-linecap="round" fill="none">
<path d="M32 27v6"/><path d="M32 41v6"/><path d="M25 37h-6"/><path d="M39 37h6"/></g></g>
<g class="an calore"><g stroke="#ff8a3d" stroke-width="2" stroke-linecap="round" fill="none">
<path d="M28 35q3-3 0-6"/><path d="M36 35q3-3 0-6"/></g></g>`,
  lavastoviglie: `<rect x="10" y="6" width="44" height="52" rx="8" fill="#c9d6e6"/>
<rect x="10" y="6" width="44" height="10" rx="5" fill="#aebfd2"/>
<circle cx="17" cy="11" r="2" fill="#5b6d84"/>
<g class="an rec"><circle cx="24" cy="11" r="2" fill="#3fd98a"/></g>
<rect x="15" y="20" width="34" height="32" rx="5" fill="#16283c"/>
<g stroke="#8ea6c2" stroke-width="2" stroke-linecap="round" fill="none">
<path d="M22 26v20"/><path d="M28 26v20"/><path d="M34 26v20"/><path d="M40 26v20"/></g>
<g class="an goccia"><circle cx="32" cy="34" r="3.2" fill="#5ec8ff"/></g>`,
  condizionatore: `<rect x="6" y="12" width="52" height="20" rx="7" fill="#e6eef8"
 stroke="#b6c6d8" stroke-width="1.4"/>
<rect x="6" y="24" width="52" height="8" rx="4" fill="#cfdcea"/>
<g class="an rec"><circle cx="49" cy="19" r="2.2" fill="#3fd98a"/></g>
<g class="an ondeggia"><g stroke="#5ec8ff" stroke-width="2.6" stroke-linecap="round" fill="none">
<path d="M18 40q5-5 10 0t10 0"/><path d="M18 48q5-5 10 0t10 0"/></g></g>
<g class="an sale"><path d="M44 44q4-4 0-8" stroke="#8ef0d8" stroke-width="2.2"
 stroke-linecap="round" fill="none"/></g>`,
  umidificatore: `<path d="M18 26h28v22a10 10 0 0 1-10 10H28a10 10 0 0 1-10-10z"
 fill="#20304a" stroke="#41607f" stroke-width="1.8"/>
<rect x="22" y="34" width="20" height="14" rx="4" fill="#0f1c2c"/>
<g class="an riempi"><rect x="24" y="40" width="16" height="6" rx="3" fill="#5ec8ff" opacity=".85"/></g>
<g class="an sale"><g stroke="#9fe2ff" stroke-width="2.4" stroke-linecap="round" fill="none">
<path d="M26 22q4-5 0-10"/><path d="M32 20q4-6 0-12"/><path d="M38 22q4-5 0-10"/></g></g>`,
  deumidificatore: `<rect x="14" y="10" width="36" height="44" rx="9" fill="#22314a"
 stroke="#41607f" stroke-width="1.8"/>
<rect x="19" y="16" width="26" height="14" rx="4" fill="#0f1c2c"/>
<g class="an goccia"><path d="M32 18c3 4 5 6 5 8.4a5 5 0 0 1-10 0C27 24 29 22 32 18z"
 fill="#5ec8ff"/></g>
<rect x="19" y="34" width="26" height="14" rx="4" fill="#101d2d" stroke="#3e5570" stroke-width="1.2"/>
<g class="an riempi"><rect x="21" y="41" width="22" height="5" rx="2.5" fill="#4fb8ff" opacity=".8"/></g>`,
  purificatore: `<path d="M16 12h32v34a12 12 0 0 1-12 12h-8a12 12 0 0 1-12-12z"
 fill="#233145" stroke="#41607f" stroke-width="1.8"/>
<circle cx="32" cy="30" r="12" fill="#101a27" stroke="#4a688c" stroke-width="1.4"/>
<g class="an rotamedia"><g fill="#8ef0d8" opacity=".92">
<path d="M32 30c0-6 3-9 3-9s4 4 1 8z"/><path d="M32 30c6 0 9 3 9 3s-4 4-8 1z"/>
<path d="M32 30c0 6-3 9-3 9s-4-4-1-8z"/><path d="M32 30c-6 0-9-3-9-3s4-4 8-1z"/></g>
<circle cx="32" cy="30" r="2.4" fill="#dff6ff"/></g>
<g class="an sale"><g stroke="#5ec8ff" stroke-width="2" stroke-linecap="round" fill="none" opacity=".8">
<path d="M25 50h14"/><path d="M28 55h8"/></g></g>`,
  stampante3d: `<rect x="8" y="10" width="48" height="4" rx="2" fill="#5b6d84"/>
<rect x="10" y="10" width="4" height="40" rx="2" fill="#41607f"/>
<rect x="50" y="10" width="4" height="40" rx="2" fill="#41607f"/>
<g class="an shake"><rect x="26" y="16" width="12" height="8" rx="2" fill="#8ea6c2"/>
<path d="M32 24l3 5h-6l3-5z" fill="#ff8a3d"/></g>
<rect x="14" y="34" width="36" height="4" rx="2" fill="#c3d3e6"/>
<path d="M22 34l4-8h12l4 8z" fill="#4fe0c8" opacity=".85"/>
<rect x="8" y="48" width="48" height="6" rx="3" fill="#33475f"/>`,
  console: `<path d="M18 22h28a14 14 0 0 1 13 19l-3 8a7 7 0 0 1-12 1l-4-6H22l-4 6a7 7 0 0 1-12-1l-3-8a14 14 0 0 1 13-19z"
 fill="#243248" stroke="#41607f" stroke-width="1.8"/>
<g stroke="#c3d3e6" stroke-width="3" stroke-linecap="round"><path d="M19 34h8"/><path d="M23 30v8"/></g>
<g class="an rec"><circle cx="43" cy="31" r="3" fill="#ff4d5e"/></g>
<circle cx="49" cy="36" r="3" fill="#5ec8ff"/><circle cx="43" cy="41" r="3" fill="#3fd98a"/>
<circle cx="37" cy="36" r="3" fill="#ffc046"/>`,
  corriere: `<rect x="4" y="22" width="34" height="22" rx="4" fill="#e8eef7"/>
<path d="M38 28h10l10 10v6H38z" fill="#cfdcea"/>
<rect x="42" y="30" width="8" height="7" rx="2" fill="#9fb4cc"/>
<g class="an shake"><rect x="12" y="26" width="14" height="12" rx="2" fill="#ffb15c"/>
<path d="M19 26v12" stroke="#e08a34" stroke-width="1.8"/></g>
<circle cx="16" cy="46" r="6" fill="#1a2433" stroke="#5b6d84" stroke-width="2"/>
<circle cx="46" cy="46" r="6" fill="#1a2433" stroke="#5b6d84" stroke-width="2"/>
<circle cx="16" cy="46" r="1.8" fill="#8ea6c2"/><circle cx="46" cy="46" r="1.8" fill="#8ea6c2"/>`,
  router: `<rect x="8" y="34" width="48" height="16" rx="6" fill="#22314a"
 stroke="#41607f" stroke-width="1.8"/>
<path d="M20 34V18" stroke="#5b7794" stroke-width="3" stroke-linecap="round"/>
<path d="M44 34V18" stroke="#5b7794" stroke-width="3" stroke-linecap="round"/>
<g class="an ondeggia"><g fill="none" stroke="#5ec8ff" stroke-width="2.4" stroke-linecap="round">
<path d="M27 22a10 10 0 0 1 10 0"/><path d="M24 17a17 17 0 0 1 16 0"/></g></g>
<g class="an rec"><circle cx="18" cy="42" r="2.4" fill="#3fd98a"/></g>
<circle cx="26" cy="42" r="2.4" fill="#4fb8ff"/><circle cx="34" cy="42" r="2.4" fill="#41607f"/>`,
  ciabatta: `<rect x="6" y="24" width="52" height="18" rx="7" fill="#e6eef8"
 stroke="#b6c6d8" stroke-width="1.4"/>
<g fill="#0f1723"><circle cx="19" cy="33" r="5"/><circle cx="32" cy="33" r="5"/><circle cx="45" cy="33" r="5"/></g>
<g fill="#8ea6c2"><circle cx="17.4" cy="31.6" r="1.1"/><circle cx="20.6" cy="31.6" r="1.1"/>
<circle cx="30.4" cy="31.6" r="1.1"/><circle cx="33.6" cy="31.6" r="1.1"/>
<circle cx="43.4" cy="31.6" r="1.1"/><circle cx="46.6" cy="31.6" r="1.1"/></g>
<g class="an rec"><rect x="8" y="28" width="4" height="10" rx="2" fill="#3fd98a"/></g>
<path d="M58 33h4" stroke="#8ea6c2" stroke-width="2.6" stroke-linecap="round"/>`,
  gatto: `<path d="M14 26l-2-14 12 7z" fill="#8b7a6b"/><path d="M50 26l2-14-12 7z" fill="#8b7a6b"/>
<ellipse cx="32" cy="36" rx="20" ry="17" fill="#a3907e"/>
<ellipse cx="32" cy="41" rx="10" ry="7" fill="#c9b7a4"/>
<g class="an glow"><g fill="#3fd98a"><ellipse cx="24" cy="33" rx="3.4" ry="4.4"/>
<ellipse cx="40" cy="33" rx="3.4" ry="4.4"/></g></g>
<g fill="#2b2119"><ellipse cx="24" cy="33" rx="1.3" ry="3.4"/><ellipse cx="40" cy="33" rx="1.3" ry="3.4"/></g>
<path d="M32 39l-2.4 2.6h4.8z" fill="#e08a9a"/>
<g stroke="#e8ddd0" stroke-width="1.4" stroke-linecap="round" opacity=".9">
<path d="M20 42h-9"/><path d="M20 45h-8"/><path d="M44 42h9"/><path d="M44 45h8"/></g>`,
  campanello_video: `<rect x="18" y="6" width="28" height="52" rx="12" fill="#22314a"
 stroke="#41607f" stroke-width="2"/>
<circle cx="32" cy="22" r="8" fill="#0d1521" stroke="#4a688c" stroke-width="1.6"/>
<circle cx="32" cy="22" r="3.4" fill="#5ec8ff"/><circle cx="30" cy="20" r="1.2" fill="#dff1ff"/>
<g class="an glow"><circle cx="32" cy="44" r="8" fill="#ffc046" opacity=".35"/></g>
<circle cx="32" cy="44" r="5.5" fill="#ffc046"/>
<g class="an ondeggia"><g fill="none" stroke="#ffd98a" stroke-width="2" stroke-linecap="round">
<path d="M12 40a10 10 0 0 1 0 8"/><path d="M52 40a10 10 0 0 0 0 8"/></g></g>`,
};

// La batteria non e' un disegno fisso: la costruisco con la carica vera.
function disegnoBatteria(perc, carica, scarica) {
  const n = Number(perc);
  const p = isNaN(n) ? 100 : Math.max(0, Math.min(100, n));
  const tinta = p <= 20 ? "#ff4d4d" : (p <= 45 ? "#ffb020" : "#3fd98a");
  const FONDO = "#0b1119";
  // il corpo, con il contorno chiaro e il polo a destra
  const corpo = '<rect x="8" y="19" width="44" height="26" rx="6.5" fill="' + FONDO
    + '" stroke="#dbe7f5" stroke-width="3"/>'
    + '<rect x="52.5" y="26.5" width="5" height="11" rx="2.4" fill="#dbe7f5"/>';
  // dentro: il pieno tagliato a blocchi, come le batterie vere
  const DENTRO = 12;
  const LARGO = 36;
  const pieno = LARGO * p / 100;
  let blocchi = "";
  if (pieno > 0.5) {
    blocchi = '<rect x="' + DENTRO + '" y="23.5" width="' + pieno.toFixed(1)
      + '" height="17" rx="1.6" fill="' + tinta + '"/>'
      + '<rect x="' + DENTRO + '" y="23.5" width="' + pieno.toFixed(1)
      + '" height="6" rx="1.6" fill="#ffffff" opacity=".18"/>';
    // i tagli fra un blocco e l'altro
    for (let k = 1; k < 5; k += 1) {
      const x = DENTRO + LARGO * k / 5;
      if (x < DENTRO + pieno) {
        // tagli un po' piu' larghi: cosi' le cinque tacche si contano
        // anche quando la casella e' piccola
        blocchi += '<rect x="' + (x - 1.2).toFixed(1) + '" y="23.5" width="2.4" '
          + 'height="17" fill="' + FONDO + '"/>';
      }
    }
  }
  // in carica: il fulmine grande, come sulle batterie del telefono
  const fulmine = carica
    ? '<g class="an caricafulmine"><path d="M34 20l-11 15h7.5l-2.5 10 11-15h-7.5z" '
      + 'fill="#eaff8a" stroke="' + FONDO + '" stroke-width="2.4" '
      + 'stroke-linejoin="round"/></g>'
    : "";
  // mentre da' corrente non lampeggia niente: la batteria sta ferma e si
  // legge il livello. Il fulmine c'e' solo quando carica, come sui telefoni.
  return corpo + blocchi + fulmine;
}

// La tapparella si disegna a quanto e' davvero abbassata: 100 = tutta su,
// 0 = tutta giu'. Ferma li', senza muoversi: quello che conta e' vedere
// dov'e' arrivata.
function disegnoTapparella(moto) {
  const CIMA = 17.5;
  const VANO = 40;
  const PASSO = 6.6;
  const SPESSA = 5;
  // le stecche ci sono tutte, sempre: a decidere quante se ne vedono e' il
  // taglio qui sotto. Cosi' per muoverla basta cambiare un numero, e il
  // movimento e' liscio invece che a scatti.
  let stecche = "";
  for (let y = CIMA - PASSO; y < CIMA + VANO + PASSO; y += PASSO) {
    stecche += '<rect x="10.5" y="' + y.toFixed(1) + '" width="43" height="'
      + SPESSA + '" rx="2" fill="#8ea6c2"/>';
  }
  const gruppo = (moto === "su" || moto === "giu")
    ? '<g class="an tappa' + moto + '">' + stecche + "</g>"
    : stecche;
  return '<defs><clipPath id="tagliaTapparella">'
    + '<rect class="taglio" x="9" y="' + (CIMA - 1) + '" width="46" height="0"/>'
    + "</clipPath></defs>"
    + '<rect x="8.5" y="16" width="47" height="43" rx="3.5" fill="#0e1622" '
    + 'stroke="#3e5570" stroke-width="2"/>'
    + '<g clip-path="url(#tagliaTapparella)">' + gruppo + "</g>"
    + '<rect x="5.5" y="5" width="53" height="11.5" rx="3.2" fill="#5b6b84"/>'
    + '<rect x="5.5" y="5" width="53" height="4" rx="3.2" fill="#7f92ad"/>';
}

// quanto della tapparella si vede giu': un numero solo, niente da ridisegnare
function tagliaTapparella(svg, pos) {
  if (!svg) return;
  const taglio = svg.querySelector(".taglio");
  if (!taglio) return;
  const n = Number(pos);
  const p = isNaN(n) ? 0 : Math.max(0, Math.min(100, n));
  const chiuso = 40 * (100 - p) / 100;
  taglio.setAttribute("height", (chiuso + 1).toFixed(2));
}

// Che icona ci vuole per questa entita'? La card lo capisce da sola.
function iconaAutomatica(eid, st) {
  const dominio = String(eid || "").split(".")[0];
  const attr = (st && st.attributes) || {};
  const dc = String(attr.device_class || "").toLowerCase();
  const nome = (String(eid || "") + " " + String(attr.friendly_name || "")).toLowerCase();
  const dice = (...parole) => parole.some((x) => nome.indexOf(x) >= 0);

  if (dominio === "weather") return ICONA_METEO[st && st.state] || "sole";
  if (dominio === "person") return "persona";
  if (dominio === "device_tracker") {
    if (dice("corriere", "consegna", "spedizion", "amazon")) return "corriere";
    if (dice("orologio", "watch")) return "orologio_polso";
    return dice("auto", "macchina", "seat", "car", "veicolo") ? "automobile" : "persona";
  }
  if (dominio === "camera") return dice("campanell", "citofon") ? "campanello_video" : "telecamera";
  if (dominio === "vacuum") return "aspirapolvere";
  if (dominio === "cover") {
    // il device_class di Home Assistant vale piu' del nome
    if (dc === "garage" || dc === "gate") return "garage";
    if (dc === "curtain" || dc === "awning") return "tende";
    if (dc === "door") return "porta_scorrevole";
    if (dc === "window") return "finestra";
    if (dice("garage", "box auto", "cancell", "saracinesc")) return "garage";
    if (dice("serranda")) return "serranda";
    if (dice("tenda", "tende", "curtain", "veneziana")) return "tende";
    if (dice("porta", "door", "scorrevol")) return "porta_scorrevole";
    if (dice("finestra", "window", "velux", "lucernar")) return "finestra";
    return "tapparella";
  }
  if (dominio === "lock") return "serratura";
  if (dominio === "siren") return "allarme";
  if (dominio === "valve") return "acqua";
  if (dominio === "fan") {
    if (dice("purificat", "filtro")) return "purificatore";
    if (dice("deumidific")) return "deumidificatore";
    if (dice("umidific")) return "umidificatore";
    return "ventola";
  }
  if (dominio === "climate" || dominio === "water_heater") {
    return dice("climatizz", "condizion", "split", "aria") ? "condizionatore" : "termosifone";
  }
  if (dominio === "humidifier") {
    return dice("deumidific", "secco") ? "deumidificatore" : "umidificatore";
  }
  if (dominio === "assist_satellite" || dominio === "conversation") return "assistente";
  if (dominio === "media_player") {
    if (dice("tv", "televis", "webos", "chromecast")) return "televisore";
    if (dice("display", "schermo", "plate", "tablet")) return "display";
    if (dice("echo", "alexa", "nest", "cassa", "speaker", "assistente", "jarvis")) {
      return "assistente";
    }
    return "musica";
  }
  if (dominio === "light") return dice("led", "strip", "striscia") ? "led" : "luce";
  if (dominio === "switch" || dominio === "input_boolean" || dominio === "automation"
      || dominio === "script" || dominio === "button" || dominio === "scene") {
    if (dice("ciabatta", "multipresa")) return "ciabatta";
    if (dice("luce", "lamp", "light", "abat-jour", "abatjour", "lampad")) return "luce";
    if (dice("led", "strip")) return "led";
    if (dice("lavastovigl")) return "lavastoviglie";
    if (dice("asciugatric", "dryer", "asciuga")) return "asciugatrice";
    if (dice("lavatric", "lavasciug")) return "lavatrice";
    if (dice("tv", "televis")) return "televisore";
    if (dice("playstation", "ps5", "xbox", "console", "switch nintendo")) return "console";
    if (dice("stampante 3", "anycubic", "kobra", "bambu", "prusa")) return "stampante3d";
    if (dice("router", "modem", "asus", "cudy", "wifi")) return "router";
    if (dice("purificat")) return "purificatore";
    if (dice("deumidific")) return "deumidificatore";
    if (dice("umidific")) return "umidificatore";
    if (dice("condizion", "climatizz")) return "condizionatore";
    if (dice("ventilat", "ventola", "fan")) return "ventola";
    if (dice("campanell", "citofon")) return "campanello_video";
    if (dice("telecam", "camera", "cctv")) return "telecamera";
    if (dice("aspirapolver", "dreame", "roomba", "robot")) return "aspirapolvere";
    if (dice("orologio", "watch", "smartwatch")) return "orologio_polso";
    if (dice("powerstation", "power station", "landbook", "ecoflow")) return "powerstation";
    if (dice("inverter")) return "inverter";
    return "presa";
  }
  if (dominio === "image" || dominio === "event") {
    if (dice("campanell", "citofon", "doorbell")) return "campanello_video";
    if (dice("gatto", "cat")) return "gatto";
    if (dice("cane", "dog")) return "movimento";
    if (dice("corriere", "pacco", "consegna")) return "corriere";
    if (dice("person", "persona")) return "movimento";
    return dominio === "image" ? "telecamera" : "campanello";
  }
  if (dominio === "plant") return "pianta";
  if (dominio === "number" || dominio === "input_number") {
    if (dice("limite", "limit", "soglia", "max", "potenza", "watt")) return "manopola";
  }
  if (dominio === "sensor" || dominio === "binary_sensor" || dominio === "number"
      || dominio === "input_number" || dominio === "select" || dominio === "counter") {
    if (dc === "battery" || dice("batteri", "battery", "soc")) return "batteria";
    if (dc === "temperature" || dice("temperatur", "termo", "gradi")) return "termometro";
    if (dc === "humidity" || dc === "moisture" || dice("umidit")) {
      return dice("pianta", "terreno", "soil", "plant") ? "pianta" : "termometro";
    }
    if (dice("pianta", "soil", "plant", "basilico", "peperonc")) return "pianta";
    if (dice("anycubic", "kobra", "bambu", "prusa", "stampante 3")) return "stampante3d";
    if (dice("stampant", "printer")) return "stampante";
    if (dice("corriere", "consegna", "spedizion", "pacco", "amazon")) return "corriere";
    if (dice("orologio", "watch", "smartwatch")) return "orologio_polso";
    if (dice("powerstation", "power station", "landbook", "ecoflow")) return "powerstation";
    if (dice("inverter")) return "inverter";
    if (dice("aspirapolver", "dreame", "roomba")) return "aspirapolvere";
    if (dice("gatto", "cat ", "micio")) return "gatto";
    if (dice("router", "modem", "asus", "cudy")) return "router";
    // il nome dell'elettrodomestico conta piu' del device_class:
    // "lavasciuga power" e' una lavatrice, non un pannello solare
    if (dice("lavastovigl", "dishwasher")) return "lavastoviglie";
    if (dice("asciugatric", "dryer", "asciuga")) return "asciugatrice";
    if (dice("lavatric", "lavasciug", "washer")) return "lavatrice";
    if (dice("telecam", "camera")) return "telecamera";
    if (dice("frigo", "forno", "microond")) return "presa";
    // il sole solo a chi il sole lo prende davvero
    if (dice("solar", "fotovolt", "pannell", "produzion", "pv ")) return "sole";
    // niente fulmini: per i watt scelgo l'immagine giusta secondo il caso
    if (dice("limite", "limit", "soglia", "max")) return "tachimetro";
    if (dice("rete", "grid", "enel", "traliccio")) return "traliccio";
    if (dice("uscita", "output", "erogaz")) return "traliccio";
    // niente saette nemmeno dentro la casetta: meglio il contatore
    if (dice("casa totale", "consumo casa", "consumo totale")) return "contatore_luce";
    if (dc === "power" || dice("watt", "potenza", "carico", "inverter")) {
      return "contatore_luce";
    }
    // i kWh sono un contatore
    if (dc === "energy" || dice("kwh", "energia", "consumo")) return "contatore";
    if (dice("musica", "brano", "media")) return "musica";
    if (dice("aspirapolv", "dreame", "robot")) return "robot";
    if (dice("meteo", "pioggia", "rain")) return "pioggia";
    if (dice("persona", "presenza", "presence", "casa di")) return "persona";
    // il termometro solo a chi misura davvero i gradi; per il resto
    // un'icona neutra da "misura", non un termometro a caso
    const unita = String(attr.unit_of_measurement || "");
    if (unita === "°C" || unita === "°F") return "termometro";
    return "misura";
  }
  return "presa";
}

// parole con cui si puo' cercare un'icona
const SINONIMI = {
  aspirapolvere: "robot aspira pulizie dreame roomba scopa",
  assistente: "alexa echo google nest cassa vocale altoparlante assistente",
  display: "schermo tablet jarvis pannello touch",
  powerstation: "power station batteria portatile accumulatore landbook ecoflow",
  inverter: "inverter convertitore corrente hoymiles",
  orologio_polso: "smartwatch orologio polso galaxy watch huawei",
  asciugatrice: "asciugatrice asciuga panni dryer",
  lavastoviglie: "lavastoviglie piatti stoviglie",
  umidificatore: "umidificatore vapore umidita",
  deumidificatore: "deumidificatore secco umidita acqua",
  purificatore: "purificatore aria filtro ventola",
  stampante3d: "stampante 3d anycubic kobra filamento",
  console: "console gioco playstation xbox joypad videogiochi",
  corriere: "corriere furgone consegna amazon pacco spedizione",
  router: "router modem wifi rete internet",
  ciabatta: "ciabatta multipresa prese spina",
  gatto: "gatto micio animale",
  campanello_video: "campanello videocitofono porta suona",
  luce: "lampadina lampada luce accendi illuminazione abat jour",
  led: "striscia strip nastro rgb colori",
  presa: "spina corrente ciabatta interruttore switch prese",
  lavatrice: "lavatrice lavasciuga lavastoviglie bucato panni",
  ventola: "ventilatore aria fan pale",
  batteria: "carica accumulatore pila power station soc",
  sole: "solare fotovoltaico pannelli sereno energia produzione",
  musica: "media lettore brano canzone altoparlante casse spotify",
  termosifone: "riscaldamento calorifero termostato caldo clima",
  termometro: "temperatura gradi caldo freddo febbre",
  telecamera: "camera videocamera cctv sorveglianza cortile",
  robot: "aspirapolvere dreame roomba pulizia",
  pianta: "vaso fiore terreno umidita orto basilico",
  televisore: "tv schermo monitor lg televisione",
  altoparlante: "cassa speaker echo alexa assistente audio",
  persona: "utente famiglia chi c'e presenza posizione",
  luna: "notte sereno buio",
  nuvola: "nuvoloso coperto cielo",
  sole_nuvole: "poco nuvoloso variabile",
  pioggia: "piove acqua rovescio",
  neve: "nevica fiocchi ghiaccio",
  temporale: "fulmine lampo tuono",
  nebbia: "foschia",
  vento: "aria raffica",
  stampante: "stampante 3d printer anycubic kobra",
  misura: "sensore valore stato quadrante generico",
  porta: "ingresso uscita apertura chiusa aperta",
  finestra: "vetro apertura serramento",
  serratura: "lucchetto chiave chiusura blocco",
  tapparella: "tenda avvolgibile persiana serranda",
  campanello: "suoneria citofono campana",
  movimento: "presenza sensore pir passaggio",
  acqua: "goccia perdita allagamento rubinetto irrigazione",
  fumo: "incendio allarme rilevatore gas",
  wifi: "rete internet segnale router connessione",
  computer: "pc portatile server",
  telefono: "cellulare smartphone mobile",
  automobile: "auto macchina seat viaggio garage",
  garage: "box cancello serranda",
  caffe: "caffettiera macchina tazza",
  frigo: "frigorifero freezer congelatore",
  forno: "cucina fornello microonde",
  condizionatore: "clima aria condizionata condizionatore climatizzatore split fresco fredda",
  allarme: "sicurezza antifurto protezione",
};

const MDI = {
  traliccio: "M8.28,5.45L6.5,4.55L7.76,2H16.23L17.5,4.55L15.72,5.44L15,4H9L8.28,5.45M18.62,8H14.09L13.3,5H10.7L9.91,8H5.38L4.1,10.55L5.89,11.44L6.62,10H17.38L18.1,11.45L19.89,10.56L18.62,8M17.77,22H15.7L15.46,21.1L12,15.9L8.53,21.1L8.3,22H6.23L9.12,11H11.19L10.83,12.35L12,14.1L13.16,12.35L12.81,11H14.88L17.77,22M11.4,15L10.5,13.65L9.32,18.13L11.4,15M14.68,18.12L13.5,13.64L12.6,15L14.68,18.12Z",
  contatore_luce: "M12 2C7.04 2 3 6.04 3 11C3 14.91 5.5 18.24 9 19.47V22H11V19.94C11.33 20 11.66 20 12 20S12.67 20 13 19.94V22H15V19.47C18.5 18.23 21 14.9 21 11C21 6.04 16.96 2 12 2M14.25 14L11.25 17L9.75 15.5L11 14.25L9.75 13L12.75 10L14.25 11.5L13 12.75L14.25 14M16 9H8V7H16V9Z",
  tachimetro: "M12,16A3,3 0 0,1 9,13C9,11.88 9.61,10.9 10.5,10.39L20.21,4.77L14.68,14.35C14.18,15.33 13.17,16 12,16M12,3C13.81,3 15.5,3.5 16.97,4.32L14.87,5.53C14,5.19 13,5 12,5A8,8 0 0,0 4,13C4,15.21 4.89,17.21 6.34,18.65H6.35C6.74,19.04 6.74,19.67 6.35,20.06C5.96,20.45 5.32,20.45 4.93,20.07V20.07C3.12,18.26 2,15.76 2,13A10,10 0 0,1 12,3M22,13C22,15.76 20.88,18.26 19.07,20.07V20.07C18.68,20.45 18.05,20.45 17.66,20.06C17.27,19.67 17.27,19.04 17.66,18.65V18.65C19.11,17.2 20,15.21 20,13C20,12 19.81,11 19.46,10.1L20.67,8C21.5,9.5 22,11.18 22,13Z",
  casa_corrente: "M12 3L2 12H5V20H19V12H22L12 3M11.5 18V14H9L12.5 7V11H15L11.5 18Z",
  manopola: "M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M13 10H11V4.1C11.3 4 11.7 4 12 4S12.7 4 13 4.1V10Z",
  casa: "M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z",
  stanza: "M10,5V10H9V5H5V13H9V12H10V17H9V14H5V19H12V17H13V19H19V17H21V21H3V3H21V15H19V10H13V15H12V9H19V5H10Z",
  letto: "M19,7H11V14H3V5H1V20H3V17H21V20H23V11A4,4 0 0,0 19,7M7,13A3,3 0 0,0 10,10A3,3 0 0,0 7,7A3,3 0 0,0 4,10A3,3 0 0,0 7,13Z",
  divano: "M12.5 7C12.5 5.89 13.39 5 14.5 5H18C19.1 5 20 5.9 20 7V9.16C18.84 9.57 18 10.67 18 11.97V14H12.5V7M6 11.96V14H11.5V7C11.5 5.89 10.61 5 9.5 5H6C4.9 5 4 5.9 4 7V9.15C5.16 9.56 6 10.67 6 11.96M20.66 10.03C19.68 10.19 19 11.12 19 12.12V15H5V12C5 10.9 4.11 10 3 10S1 10.9 1 12V17C1 18.1 1.9 19 3 19V21H5V19H19V21H21V19C22.1 19 23 18.1 23 17V12C23 10.79 21.91 9.82 20.66 10.03Z",
  cucina: "M11,9H9V2H7V9H5V2H3V9C3,11.12 4.66,12.84 6.75,12.97V22H9.25V12.97C11.34,12.84 13,11.12 13,9V2H11V9M16,6V14H18.5V22H21V2C18.24,2 16,4.24 16,6Z",
  bagno: "M21,14V15C21,16.91 19.93,18.57 18.35,19.41L19,22H17L16.5,20C16.33,20 16.17,20 16,20H8C7.83,20 7.67,20 7.5,20L7,22H5L5.65,19.41C4.07,18.57 3,16.91 3,15V14H2V12H20V5A1,1 0 0,0 19,4C18.5,4 18.12,4.34 18,4.79C18.63,5.33 19,6.13 19,7H13A3,3 0 0,1 16,4C16.06,4 16.11,4 16.17,4C16.58,2.84 17.69,2 19,2A3,3 0 0,1 22,5V14H21V14M19,14H5V15A3,3 0 0,0 8,18H16A3,3 0 0,0 19,15V14Z",
  wc: "M9,22H17V19.5C19.41,17.87 21,15.12 21,12V4A2,2 0 0,0 19,2H15C13.89,2 13,2.9 13,4V12H3C3,15.09 5,18 9,19.5V22M5.29,14H18.71C18.14,15.91 16.77,17.5 15,18.33V20H11V18.33C9,18 5.86,15.91 5.29,14M15,4H19V12H15V4M16,5V8H18V5H16Z",
  scale: "M15,5V9H11V13H7V17H3V20H10V16H14V12H18V8H22V5H15Z",
  chiave: "M7 14C5.9 14 5 13.1 5 12S5.9 10 7 10 9 10.9 9 12 8.1 14 7 14M12.6 10C11.8 7.7 9.6 6 7 6C3.7 6 1 8.7 1 12S3.7 18 7 18C9.6 18 11.8 16.3 12.6 14H16V18H20V14H23V10H12.6Z",
  cassetta_posta: "M17,4H7A5,5 0 0,0 2,9V20H20A2,2 0 0,0 22,18V9A5,5 0 0,0 17,4M10,18H4V9A3,3 0 0,1 7,6A3,3 0 0,1 10,9V18M19,15H17V13H13V11H19V15M9,11H5V9H9V11Z",
  pacco: "M21,16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V7.5C3,7.12 3.21,6.79 3.53,6.62L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.79,6.79 21,7.12 21,7.5V16.5M12,4.15L10.11,5.22L16,8.61L17.96,7.5L12,4.15M6.04,7.5L12,10.85L13.96,9.75L8.08,6.35L6.04,7.5M5,15.91L11,19.29V12.58L5,9.21V15.91M19,15.91V9.21L13,12.58V19.29L19,15.91Z",
  carrello: "M17,18C15.89,18 15,18.89 15,20A2,2 0 0,0 17,22A2,2 0 0,0 19,20C19,18.89 18.1,18 17,18M1,2V4H3L6.6,11.59L5.24,14.04C5.09,14.32 5,14.65 5,15A2,2 0 0,0 7,17H19V15H7.42A0.25,0.25 0 0,1 7.17,14.75C7.17,14.7 7.18,14.66 7.2,14.63L8.1,13H15.55C16.3,13 16.96,12.58 17.3,11.97L20.88,5.5C20.95,5.34 21,5.17 21,5A1,1 0 0,0 20,4H5.21L4.27,2M7,18C5.89,18 5,18.89 5,20A2,2 0 0,0 7,22A2,2 0 0,0 9,20C9,18.89 8.1,18 7,18Z",
  euro: "M15 18.5C12.5 18.5 10.32 17.08 9.24 15H15L16 13H8.58C8.53 12.67 8.5 12.34 8.5 12S8.53 11.33 8.58 11H15L16 9H9.24C10.32 6.92 12.5 5.5 15 5.5C16.61 5.5 18.09 6.09 19.23 7.07L21 5.3C19.41 3.87 17.3 3 15 3C11.08 3 7.76 5.5 6.5 9H3L2 11H6.06C6 11.33 6 11.66 6 12S6 12.67 6.06 13H3L2 15H6.5C7.76 18.5 11.08 21 15 21C17.31 21 19.41 20.13 21 18.7L19.22 16.93C18.09 17.91 16.62 18.5 15 18.5Z",
  calendario: "M19,19H5V8H19M16,1V3H8V1H6V3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3H18V1M17,12H12V17H17V12Z",
  orologio: "M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z",
  sveglia: "M12,20A7,7 0 0,1 5,13A7,7 0 0,1 12,6A7,7 0 0,1 19,13A7,7 0 0,1 12,20M12,4A9,9 0 0,0 3,13A9,9 0 0,0 12,22A9,9 0 0,0 21,13A9,9 0 0,0 12,4M12.5,8H11V14L15.75,16.85L16.5,15.62L12.5,13.25V8M7.88,3.39L6.6,1.86L2,5.71L3.29,7.24L7.88,3.39M22,5.72L17.4,1.86L16.11,3.39L20.71,7.25L22,5.72Z",
  timer: "M12,20A7,7 0 0,1 5,13A7,7 0 0,1 12,6A7,7 0 0,1 19,13A7,7 0 0,1 12,20M19.03,7.39L20.45,5.97C20,5.46 19.55,5 19.04,4.56L17.62,6C16.07,4.74 14.12,4 12,4A9,9 0 0,0 3,13A9,9 0 0,0 12,22C17,22 21,17.97 21,13C21,10.88 20.26,8.93 19.03,7.39M11,14H13V8H11M15,1H9V3H15V1Z",
  campana: "M21,19V20H3V19L5,17V11C5,7.9 7.03,5.17 10,4.29C10,4.19 10,4.1 10,4A2,2 0 0,1 12,2A2,2 0 0,1 14,4C14,4.1 14,4.19 14,4.29C16.97,5.17 19,7.9 19,11V17L21,19M14,21A2,2 0 0,1 12,23A2,2 0 0,1 10,21",
  notifica: "M21,19V20H3V19L5,17V11C5,7.9 7.03,5.17 10,4.29C10,4.19 10,4.1 10,4A2,2 0 0,1 12,2A2,2 0 0,1 14,4C14,4.1 14,4.19 14,4.29C16.97,5.17 19,7.9 19,11V17L21,19M14,21A2,2 0 0,1 12,23A2,2 0 0,1 10,21M19.75,3.19L18.33,4.61C20.04,6.3 21,8.6 21,11H23C23,8.07 21.84,5.25 19.75,3.19M1,11H3C3,8.6 3.96,6.3 5.67,4.61L4.25,3.19C2.16,5.25 1,8.07 1,11Z",
  messaggio: "M20,2H4A2,2 0 0,0 2,4V22L6,18H20A2,2 0 0,0 22,16V4A2,2 0 0,0 20,2M6,9H18V11H6M14,14H6V12H14M18,8H6V6H18",
  email: "M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z",
  chiamata: "M15,12H17A5,5 0 0,0 12,7V9A3,3 0 0,1 15,12M19,12H21C21,7 16.97,3 12,3V5C15.86,5 19,8.13 19,12M20,15.5C18.75,15.5 17.55,15.3 16.43,14.93C16.08,14.82 15.69,14.9 15.41,15.18L13.21,17.38C10.38,15.94 8.06,13.62 6.62,10.79L8.82,8.59C9.1,8.31 9.18,7.92 9.07,7.57C8.7,6.45 8.5,5.25 8.5,4A1,1 0 0,0 7.5,3H4A1,1 0 0,0 3,4A17,17 0 0,0 20,21A1,1 0 0,0 21,20V16.5A1,1 0 0,0 20,15.5Z",
  video: "M17,10.5V7A1,1 0 0,0 16,6H4A1,1 0 0,0 3,7V17A1,1 0 0,0 4,18H16A1,1 0 0,0 17,17V13.5L21,17.5V6.5L17,10.5Z",
  cuffie: "M12,1C7,1 3,5 3,10V17A3,3 0 0,0 6,20H9V12H5V10A7,7 0 0,1 12,3A7,7 0 0,1 19,10V12H15V20H18A3,3 0 0,0 21,17V10C21,5 16.97,1 12,1Z",
  radio: "M20,6A2,2 0 0,1 22,8V20A2,2 0 0,1 20,22H4A2,2 0 0,1 2,20V8C2,7.15 2.53,6.42 3.28,6.13L15.71,1L16.47,2.83L8.83,6H20M20,8H4V12H16V10H18V12H20V8M7,14A3,3 0 0,0 4,17A3,3 0 0,0 7,20A3,3 0 0,0 10,17A3,3 0 0,0 7,14Z",
  microfono: "M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19Z",
  volume: "M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z",
  play: "M8,5.14V19.14L19,12.14L8,5.14Z",
  pausa: "M14,19H18V5H14M6,19H10V5H6V19Z",
  stop: "M18,18H6V6H18V18Z",
  gioco: "M7,6H17A6,6 0 0,1 23,12A6,6 0 0,1 17,18C15.22,18 13.63,17.23 12.53,16H11.47C10.37,17.23 8.78,18 7,18A6,6 0 0,1 1,12A6,6 0 0,1 7,6M6,9V11H4V13H6V15H8V13H10V11H8V9H6M15.5,12A1.5,1.5 0 0,0 14,13.5A1.5,1.5 0 0,0 15.5,15A1.5,1.5 0 0,0 17,13.5A1.5,1.5 0 0,0 15.5,12M18.5,9A1.5,1.5 0 0,0 17,10.5A1.5,1.5 0 0,0 18.5,12A1.5,1.5 0 0,0 20,10.5A1.5,1.5 0 0,0 18.5,9Z",
  playstation: "M9.5,4.27C10.88,4.53 12.9,5.14 14,5.5C16.75,6.45 17.69,7.63 17.69,10.29C17.69,12.89 16.09,13.87 14.05,12.89V8.05C14.05,7.5 13.95,6.97 13.41,6.82C13,6.69 12.76,7.07 12.76,7.63V19.73L9.5,18.69V4.27M13.37,17.62L18.62,15.75C19.22,15.54 19.31,15.24 18.83,15.08C18.34,14.92 17.47,14.97 16.87,15.18L13.37,16.41V14.45L13.58,14.38C13.58,14.38 14.59,14 16,13.87C17.43,13.71 19.17,13.89 20.53,14.4C22.07,14.89 22.25,15.61 21.86,16.1C21.46,16.6 20.5,16.95 20.5,16.95L13.37,19.5V17.62M3.5,17.42C1.93,17 1.66,16.05 2.38,15.5C3.05,15 4.18,14.65 4.18,14.65L8.86,13V14.88L5.5,16.09C4.9,16.3 4.81,16.6 5.29,16.76C5.77,16.92 6.65,16.88 7.24,16.66L8.86,16.08V17.77L8.54,17.83C6.92,18.09 5.2,18 3.5,17.42Z",
  xbox: "M6.43,3.72C6.5,3.66 6.57,3.6 6.62,3.56C8.18,2.55 10,2 12,2C13.88,2 15.64,2.5 17.14,3.42C17.25,3.5 17.54,3.69 17.7,3.88C16.25,2.28 12,5.7 12,5.7C10.5,4.57 9.17,3.8 8.16,3.5C7.31,3.29 6.73,3.5 6.46,3.7M19.34,5.21C19.29,5.16 19.24,5.11 19.2,5.06C18.84,4.66 18.38,4.56 18,4.59C17.61,4.71 15.9,5.32 13.8,7.31C13.8,7.31 16.17,9.61 17.62,11.96C19.07,14.31 19.93,16.16 19.4,18.73C21,16.95 22,14.59 22,12C22,9.38 21,7 19.34,5.21M15.73,12.96C15.08,12.24 14.13,11.21 12.86,9.95C12.59,9.68 12.3,9.4 12,9.1C12,9.1 11.53,9.56 10.93,10.17C10.16,10.94 9.17,11.95 8.61,12.54C7.63,13.59 4.81,16.89 4.65,18.74C4.65,18.74 4,17.28 5.4,13.89C6.3,11.68 9,8.36 10.15,7.28C10.15,7.28 9.12,6.14 7.82,5.35L7.77,5.32C7.14,4.95 6.46,4.66 5.8,4.62C5.13,4.67 4.71,5.16 4.71,5.16C3.03,6.95 2,9.35 2,12A10,10 0 0,0 12,22C14.93,22 17.57,20.74 19.4,18.73C19.4,18.73 19.19,17.4 17.84,15.5C17.53,15.07 16.37,13.69 15.73,12.96Z",
  netflix: "M6.5,2H10.5L13.44,10.83L13.5,2H17.5V22C16.25,21.78 14.87,21.64 13.41,21.58L10.5,13L10.43,21.59C9.03,21.65 7.7,21.79 6.5,22V2Z",
  youtube: "M10,15L15.19,12L10,9V15M21.56,7.17C21.69,7.64 21.78,8.27 21.84,9.07C21.91,9.87 21.94,10.56 21.94,11.16L22,12C22,14.19 21.84,15.8 21.56,16.83C21.31,17.73 20.73,18.31 19.83,18.56C19.36,18.69 18.5,18.78 17.18,18.84C15.88,18.91 14.69,18.94 13.59,18.94L12,19C7.81,19 5.2,18.84 4.17,18.56C3.27,18.31 2.69,17.73 2.44,16.83C2.31,16.36 2.22,15.73 2.16,14.93C2.09,14.13 2.06,13.44 2.06,12.84L2,12C2,9.81 2.16,8.2 2.44,7.17C2.69,6.27 3.27,5.69 4.17,5.44C4.64,5.31 5.5,5.22 6.82,5.16C8.12,5.09 9.31,5.06 10.41,5.06L12,5C16.19,5 18.8,5.16 19.83,5.44C20.73,5.69 21.31,6.27 21.56,7.17Z",
  spotify: "M17.9,10.9C14.7,9 9.35,8.8 6.3,9.75C5.8,9.9 5.3,9.6 5.15,9.15C5,8.65 5.3,8.15 5.75,8C9.3,6.95 15.15,7.15 18.85,9.35C19.3,9.6 19.45,10.2 19.2,10.65C18.95,11 18.35,11.15 17.9,10.9M17.8,13.7C17.55,14.05 17.1,14.2 16.75,13.95C14.05,12.3 9.95,11.8 6.8,12.8C6.4,12.9 5.95,12.7 5.85,12.3C5.75,11.9 5.95,11.45 6.35,11.35C10,10.25 14.5,10.8 17.6,12.7C17.9,12.85 18.05,13.35 17.8,13.7M16.6,16.45C16.4,16.75 16.05,16.85 15.75,16.65C13.4,15.2 10.45,14.9 6.95,15.7C6.6,15.8 6.3,15.55 6.2,15.25C6.1,14.9 6.35,14.6 6.65,14.5C10.45,13.65 13.75,14 16.35,15.6C16.7,15.75 16.75,16.15 16.6,16.45M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z",
  cast: "M21,3H3C1.89,3 1,3.89 1,5V8H3V5H21V19H14V21H21A2,2 0 0,0 23,19V5C23,3.89 22.1,3 21,3M1,10V12A9,9 0 0,1 10,21H12C12,14.92 7.07,10 1,10M19,7H5V8.63C8.96,9.91 12.09,13.04 13.37,17H19M1,14V16A5,5 0 0,1 6,21H8A7,7 0 0,0 1,14M1,18V21H4A3,3 0 0,0 1,18Z",
  antenna: "M12 7.5C12.69 7.5 13.27 7.73 13.76 8.2S14.5 9.27 14.5 10C14.5 11.05 14 11.81 13 12.28V21H11V12.28C10 11.81 9.5 11.05 9.5 10C9.5 9.27 9.76 8.67 10.24 8.2S11.31 7.5 12 7.5M16.69 5.3C17.94 6.55 18.61 8.11 18.7 10C18.7 11.8 18.03 13.38 16.69 14.72L15.5 13.5C16.5 12.59 17 11.42 17 10C17 8.67 16.5 7.5 15.5 6.5L16.69 5.3M6.09 4.08C4.5 5.67 3.7 7.64 3.7 10S4.5 14.3 6.09 15.89L4.92 17.11C3 15.08 2 12.7 2 10C2 7.3 3 4.94 4.92 2.91L6.09 4.08M19.08 2.91C21 4.94 22 7.3 22 10C22 12.8 21 15.17 19.08 17.11L17.91 15.89C19.5 14.3 20.3 12.33 20.3 10S19.5 5.67 17.91 4.08L19.08 2.91M7.31 5.3L8.5 6.5C7.5 7.42 7 8.58 7 10C7 11.33 7.5 12.5 8.5 13.5L7.31 14.72C5.97 13.38 5.3 11.8 5.3 10C5.3 8.2 5.97 6.64 7.31 5.3Z",
  router: "M20.2,5.9L21,5.1C19.6,3.7 17.8,3 16,3C14.2,3 12.4,3.7 11,5.1L11.8,5.9C13,4.8 14.5,4.2 16,4.2C17.5,4.2 19,4.8 20.2,5.9M19.3,6.7C18.4,5.8 17.2,5.3 16,5.3C14.8,5.3 13.6,5.8 12.7,6.7L13.5,7.5C14.2,6.8 15.1,6.5 16,6.5C16.9,6.5 17.8,6.8 18.5,7.5L19.3,6.7M19,13H17V9H15V13H5A2,2 0 0,0 3,15V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V15A2,2 0 0,0 19,13M8,18H6V16H8V18M11.5,18H9.5V16H11.5V18M15,18H13V16H15V18Z",
  server: "M4,1H20A1,1 0 0,1 21,2V6A1,1 0 0,1 20,7H4A1,1 0 0,1 3,6V2A1,1 0 0,1 4,1M4,9H20A1,1 0 0,1 21,10V14A1,1 0 0,1 20,15H4A1,1 0 0,1 3,14V10A1,1 0 0,1 4,9M4,17H20A1,1 0 0,1 21,18V22A1,1 0 0,1 20,23H4A1,1 0 0,1 3,22V18A1,1 0 0,1 4,17M9,5H10V3H9V5M9,13H10V11H9V13M9,21H10V19H9V21M5,3V5H7V3H5M5,11V13H7V11H5M5,19V21H7V19H5Z",
  chip: "M6,4H18V5H21V7H18V9H21V11H18V13H21V15H18V17H21V19H18V20H6V19H3V17H6V15H3V13H6V11H3V9H6V7H3V5H6V4M11,15V18H12V15H11M13,15V18H14V15H13M15,15V18H16V15H15Z",
  usb: "M15,7V11H16V13H13V5H15L12,1L9,5H11V13H8V10.93C8.7,10.56 9.2,9.85 9.2,9C9.2,7.78 8.21,6.8 7,6.8C5.78,6.8 4.8,7.78 4.8,9C4.8,9.85 5.3,10.56 6,10.93V13A2,2 0 0,0 8,15H11V18.05C10.29,18.41 9.8,19.15 9.8,20A2.2,2.2 0 0,0 12,22.2A2.2,2.2 0 0,0 14.2,20C14.2,19.15 13.71,18.41 13,18.05V15H16A2,2 0 0,0 18,13V11H19V7H15Z",
  spina: "M16,7V3H14V7H10V3H8V7H8C7,7 6,8 6,9V14.5L9.5,18V21H14.5V18L18,14.5V9C18,8 17,7 16,7Z",
  fulmine: "M7,2V13H10V22L17,10H13L17,2H7Z",
  contatore: "M4,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20H4A2,2 0 0,1 2,18V6A2,2 0 0,1 4,4M4,6V18H11V6H4M20,18V6H18.76C19,6.54 18.95,7.07 18.95,7.13C18.88,7.8 18.41,8.5 18.24,8.75L15.91,11.3L19.23,11.28L19.24,12.5L14.04,12.47L14,11.47C14,11.47 17.05,8.24 17.2,7.95C17.34,7.67 17.91,6 16.5,6C15.27,6.05 15.41,7.3 15.41,7.3L13.87,7.31C13.87,7.31 13.88,6.65 14.25,6H13V18H15.58L15.57,17.14L16.54,17.13C16.54,17.13 17.45,16.97 17.46,16.08C17.5,15.08 16.65,15.08 16.5,15.08C16.37,15.08 15.43,15.13 15.43,15.95H13.91C13.91,15.95 13.95,13.89 16.5,13.89C19.1,13.89 18.96,15.91 18.96,15.91C18.96,15.91 19,17.16 17.85,17.63L18.37,18H20M8.92,16H7.42V10.2L5.62,10.76V9.53L8.76,8.41H8.92V16Z",
  pannello_solare: "M11.45,2V5.55L15,3.77L11.45,2M10.45,8L8,10.46L11.75,11.71L10.45,8M2,11.45L3.77,15L5.55,11.45H2M10,2H2V10C2.57,10.17 3.17,10.25 3.77,10.25C7.35,10.26 10.26,7.35 10.27,3.75C10.26,3.16 10.17,2.57 10,2M17,22V16H14L19,7V13H22L17,22Z",
  corrente_ac: "M12.43 11C12.28 10.84 10 7 7 7S2.32 10.18 2 11V13H11.57C11.72 13.16 14 17 17 17S21.68 13.82 22 13V11H12.43M7 9C8.17 9 9.18 9.85 10 11H4.31C4.78 10.17 5.54 9 7 9M17 15C15.83 15 14.82 14.15 14 13H19.69C19.22 13.83 18.46 15 17 15Z",
  corrente_dc: "M2,9V11H22V9H2M2,13V15H7V13H2M9,13V15H15V13H9M17,13V15H22V13H17Z",
  interruttore: "M17,7H7A5,5 0 0,0 2,12A5,5 0 0,0 7,17H17A5,5 0 0,0 22,12A5,5 0 0,0 17,7M17,15A3,3 0 0,1 14,12A3,3 0 0,1 17,9A3,3 0 0,1 20,12A3,3 0 0,1 17,15Z",
  regolatore: "M8 13C6.14 13 4.59 14.28 4.14 16H2V18H4.14C4.59 19.72 6.14 21 8 21S11.41 19.72 11.86 18H22V16H11.86C11.41 14.28 9.86 13 8 13M8 19C6.9 19 6 18.1 6 17C6 15.9 6.9 15 8 15S10 15.9 10 17C10 18.1 9.1 19 8 19M19.86 6C19.41 4.28 17.86 3 16 3S12.59 4.28 12.14 6H2V8H12.14C12.59 9.72 14.14 11 16 11S19.41 9.72 19.86 8H22V6H19.86M16 9C14.9 9 14 8.1 14 7C14 5.9 14.9 5 16 5S18 5.9 18 7C18 8.1 17.1 9 16 9Z",
  ombrello: "M12,2A9,9 0 0,1 21,11H13V19A3,3 0 0,1 10,22A3,3 0 0,1 7,19V18H9V19A1,1 0 0,0 10,20A1,1 0 0,0 11,19V11H3A9,9 0 0,1 12,2Z",
  termostato: "M16.95,16.95L14.83,14.83C15.55,14.1 16,13.1 16,12C16,11.26 15.79,10.57 15.43,10L17.6,7.81C18.5,9 19,10.43 19,12C19,13.93 18.22,15.68 16.95,16.95M12,5C13.57,5 15,5.5 16.19,6.4L14,8.56C13.43,8.21 12.74,8 12,8A4,4 0 0,0 8,12C8,13.1 8.45,14.1 9.17,14.83L7.05,16.95C5.78,15.68 5,13.93 5,12A7,7 0 0,1 12,5M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12C22,6.47 17.5,2 12,2Z",
  radiatore: "M7.95,3L6.53,5.19L7.95,7.4H7.94L5.95,10.5L4.22,9.6L5.64,7.39L4.22,5.19L6.22,2.09L7.95,3M13.95,2.89L12.53,5.1L13.95,7.3L13.94,7.31L11.95,10.4L10.22,9.5L11.64,7.3L10.22,5.1L12.22,2L13.95,2.89M20,2.89L18.56,5.1L20,7.3V7.31L18,10.4L16.25,9.5L17.67,7.3L16.25,5.1L18.25,2L20,2.89M2,22V14A2,2 0 0,1 4,12H20A2,2 0 0,1 22,14V22H20V20H4V22H2M6,14A1,1 0 0,0 5,15V17A1,1 0 0,0 6,18A1,1 0 0,0 7,17V15A1,1 0 0,0 6,14M10,14A1,1 0 0,0 9,15V17A1,1 0 0,0 10,18A1,1 0 0,0 11,17V15A1,1 0 0,0 10,14M14,14A1,1 0 0,0 13,15V17A1,1 0 0,0 14,18A1,1 0 0,0 15,17V15A1,1 0 0,0 14,14M18,14A1,1 0 0,0 17,15V17A1,1 0 0,0 18,18A1,1 0 0,0 19,17V15A1,1 0 0,0 18,14Z",
  caldaia: "M8 2C6.89 2 6 2.89 6 4V16C6 17.11 6.89 18 8 18H9V20H6V22H9C10.11 22 11 21.11 11 20V18H13V20C13 21.11 13.89 22 15 22H18V20H15V18H16C17.11 18 18 17.11 18 16V4C18 2.89 17.11 2 16 2H8M12 4.97A2 2 0 0 1 14 6.97A2 2 0 0 1 12 8.97A2 2 0 0 1 10 6.97A2 2 0 0 1 12 4.97M10 14.5H14V16H10V14.5Z",
  pompa: "M2 21V15H3.5C3.18 14.06 3 13.05 3 12C3 7.03 7.03 3 12 3H22V9H20.5C20.82 9.94 21 10.95 21 12C21 16.97 16.97 21 12 21H2M5 12C5 13.28 5.34 14.47 5.94 15.5L9.4 13.5C9.15 13.06 9 12.55 9 12C9 11.35 9.21 10.75 9.56 10.26L6.3 7.93C5.5 9.08 5 10.5 5 12M12 19C14.59 19 16.85 17.59 18.06 15.5L14.6 13.5C14.08 14.4 13.11 15 12 15L11.71 15L11.33 18.97L12 19M12 9C13.21 9 14.26 9.72 14.73 10.76L18.37 9.1C17.27 6.68 14.83 5 12 5V9M12 11C11.45 11 11 11.45 11 12C11 12.55 11.45 13 12 13C12.55 13 13 12.55 13 12C13 11.45 12.55 11 12 11Z",
  irrigazione: "M11 7H13V9H11V7M5 22H9V10H5V22M14 11H16V9H14V11M17 10H19V8H17V10M17 5V7H19V5H17M14 8H16V6H14V8M17 13H19V11H17V13M5 7H5.33L6 9H8L8.67 7H9V6H5V7Z",
  piscina: "M2,15C3.67,14.25 5.33,13.5 7,13.17V5A3,3 0 0,1 10,2C11.31,2 12.42,2.83 12.83,4H10A1,1 0 0,0 9,5V6H14V5A3,3 0 0,1 17,2C18.31,2 19.42,2.83 19.83,4H17A1,1 0 0,0 16,5V14.94C18,14.62 20,13 22,13V15C19.78,15 17.56,17 15.33,17C13.11,17 10.89,15 8.67,15C6.44,15 4.22,16 2,17V15M14,8H9V10H14V8M14,12H9V13C10.67,13.16 12.33,14.31 14,14.79V12M2,19C4.22,18 6.44,17 8.67,17C10.89,17 13.11,19 15.33,19C17.56,19 19.78,17 22,17V19C19.78,19 17.56,21 15.33,21C13.11,21 10.89,19 8.67,19C6.44,19 4.22,20 2,21V19Z",
  fiore: "M3,13A9,9 0 0,0 12,22C12,17 7.97,13 3,13M12,5.5A2.5,2.5 0 0,1 14.5,8A2.5,2.5 0 0,1 12,10.5A2.5,2.5 0 0,1 9.5,8A2.5,2.5 0 0,1 12,5.5M5.6,10.25A2.5,2.5 0 0,0 8.1,12.75C8.63,12.75 9.12,12.58 9.5,12.31C9.5,12.37 9.5,12.43 9.5,12.5A2.5,2.5 0 0,0 12,15A2.5,2.5 0 0,0 14.5,12.5C14.5,12.43 14.5,12.37 14.5,12.31C14.88,12.58 15.37,12.75 15.9,12.75C17.28,12.75 18.4,11.63 18.4,10.25C18.4,9.25 17.81,8.4 16.97,8C17.81,7.6 18.4,6.74 18.4,5.75C18.4,4.37 17.28,3.25 15.9,3.25C15.37,3.25 14.88,3.41 14.5,3.69C14.5,3.63 14.5,3.56 14.5,3.5A2.5,2.5 0 0,0 12,1A2.5,2.5 0 0,0 9.5,3.5C9.5,3.56 9.5,3.63 9.5,3.69C9.12,3.41 8.63,3.25 8.1,3.25A2.5,2.5 0 0,0 5.6,5.75C5.6,6.74 6.19,7.6 7.03,8C6.19,8.4 5.6,9.25 5.6,10.25M12,22A9,9 0 0,0 21,13C16,13 12,17 12,22Z",
  albero: "M11,21V16.74C10.53,16.91 10.03,17 9.5,17C7,17 5,15 5,12.5C5,11.23 5.5,10.09 6.36,9.27C6.13,8.73 6,8.13 6,7.5C6,5 8,3 10.5,3C12.06,3 13.44,3.8 14.25,5C14.33,5 14.41,5 14.5,5A5.5,5.5 0 0,1 20,10.5A5.5,5.5 0 0,1 14.5,16C14,16 13.5,15.93 13,15.79V21H11Z",
  erba: "M12 20H2V18H7.75C7 15.19 4.81 13 2 12.26C2.64 12.1 3.31 12 4 12C8.42 12 12 15.58 12 20M22 12.26C21.36 12.1 20.69 12 20 12C17.07 12 14.5 13.58 13.12 15.93C13.41 16.59 13.65 17.28 13.79 18C13.92 18.65 14 19.32 14 20H22V18H16.24C17 15.19 19.19 13 22 12.26M15.64 11C16.42 8.93 17.87 7.18 19.73 6C15.44 6.16 12 9.67 12 14V14C12.95 12.75 14.2 11.72 15.64 11M11.42 8.85C10.58 6.66 8.88 4.89 6.7 4C8.14 5.86 9 8.18 9 10.71C9 10.92 8.97 11.12 8.96 11.32C9.39 11.56 9.79 11.84 10.18 12.14C10.39 10.96 10.83 9.85 11.42 8.85Z",
  tosaerba: "M1 14V5H13C18.5 5 23 9.5 23 15V17H20.83C20.42 18.17 19.31 19 18 19C16.69 19 15.58 18.17 15.17 17H10C9.09 18.21 7.64 19 6 19C3.24 19 1 16.76 1 14M6 11C4.34 11 3 12.34 3 14C3 15.66 4.34 17 6 17C7.66 17 9 15.66 9 14C9 12.34 7.66 11 6 11M15 10V12H20.25C19.92 11.27 19.5 10.6 19 10H15Z",
  cane: "M18,4C16.29,4 15.25,4.33 14.65,4.61C13.88,4.23 13,4 12,4C11,4 10.12,4.23 9.35,4.61C8.75,4.33 7.71,4 6,4C3,4 1,12 1,14C1,14.83 2.32,15.59 4.14,15.9C4.78,18.14 7.8,19.85 11.5,20V15.72C10.91,15.35 10,14.68 10,14C10,13 12,13 12,13C12,13 14,13 14,14C14,14.68 13.09,15.35 12.5,15.72V20C16.2,19.85 19.22,18.14 19.86,15.9C21.68,15.59 23,14.83 23,14C23,12 21,4 18,4M4.15,13.87C3.65,13.75 3.26,13.61 3,13.5C3.25,10.73 5.2,6.4 6.05,6C6.59,6 7,6.06 7.37,6.11C5.27,8.42 4.44,12.04 4.15,13.87M9,12A1,1 0 0,1 8,11C8,10.46 8.45,10 9,10A1,1 0 0,1 10,11C10,11.56 9.55,12 9,12M15,12A1,1 0 0,1 14,11C14,10.46 14.45,10 15,10A1,1 0 0,1 16,11C16,11.56 15.55,12 15,12M19.85,13.87C19.56,12.04 18.73,8.42 16.63,6.11C17,6.06 17.41,6 17.95,6C18.8,6.4 20.75,10.73 21,13.5C20.75,13.61 20.36,13.75 19.85,13.87Z",
  gatto: "M12,8L10.67,8.09C9.81,7.07 7.4,4.5 5,4.5C5,4.5 3.03,7.46 4.96,11.41C4.41,12.24 4.07,12.67 4,13.66L2.07,13.95L2.28,14.93L4.04,14.67L4.18,15.38L2.61,16.32L3.08,17.21L4.53,16.32C5.68,18.76 8.59,20 12,20C15.41,20 18.32,18.76 19.47,16.32L20.92,17.21L21.39,16.32L19.82,15.38L19.96,14.67L21.72,14.93L21.93,13.95L20,13.66C19.93,12.67 19.59,12.24 19.04,11.41C20.97,7.46 19,4.5 19,4.5C16.6,4.5 14.19,7.07 13.33,8.09L12,8M9,11A1,1 0 0,1 10,12A1,1 0 0,1 9,13A1,1 0 0,1 8,12A1,1 0 0,1 9,11M15,11A1,1 0 0,1 16,12A1,1 0 0,1 15,13A1,1 0 0,1 14,12A1,1 0 0,1 15,11M11,14H13L12.3,15.39C12.5,16.03 13.06,16.5 13.75,16.5A1.5,1.5 0 0,0 15.25,15H15.75A2,2 0 0,1 13.75,17C13,17 12.35,16.59 12,16V16H12C11.65,16.59 11,17 10.25,17A2,2 0 0,1 8.25,15H8.75A1.5,1.5 0 0,0 10.25,16.5C10.94,16.5 11.5,16.03 11.7,15.39L11,14Z",
  pesce: "M12,20L12.76,17C9.5,16.79 6.59,15.4 5.75,13.58C5.66,14.06 5.53,14.5 5.33,14.83C4.67,16 3.33,16 2,16C3.1,16 3.5,14.43 3.5,12.5C3.5,10.57 3.1,9 2,9C3.33,9 4.67,9 5.33,10.17C5.53,10.5 5.66,10.94 5.75,11.42C6.4,10 8.32,8.85 10.66,8.32L9,5C11,5 13,5 14.33,5.67C15.46,6.23 16.11,7.27 16.69,8.38C19.61,9.08 22,10.66 22,12.5C22,14.38 19.5,16 16.5,16.66C15.67,17.76 14.86,18.78 14.17,19.33C13.33,20 12.67,20 12,20M17,11A1,1 0 0,0 16,12A1,1 0 0,0 17,13A1,1 0 0,0 18,12A1,1 0 0,0 17,11Z",
  bambino: "M1,12C1,10.19 2.2,8.66 3.86,8.17C5.29,5.11 8.4,3 12,3C15.6,3 18.71,5.11 20.15,8.17C21.8,8.66 23,10.19 23,12C23,13.81 21.8,15.34 20.15,15.83C18.71,18.89 15.6,21 12,21C8.4,21 5.29,18.89 3.86,15.83C2.2,15.34 1,13.81 1,12M14.5,9.25A1.25,1.25 0 0,0 13.25,10.5A1.25,1.25 0 0,0 14.5,11.75A1.25,1.25 0 0,0 15.75,10.5A1.25,1.25 0 0,0 14.5,9.25M9.5,9.25A1.25,1.25 0 0,0 8.25,10.5A1.25,1.25 0 0,0 9.5,11.75A1.25,1.25 0 0,0 10.75,10.5A1.25,1.25 0 0,0 9.5,9.25M7.5,14C8.26,15.77 10,17 12,17C14,17 15.74,15.77 16.5,14H7.5M3,12C3,12.82 3.5,13.53 4.21,13.84C4.07,13.25 4,12.63 4,12C4,11.37 4.07,10.75 4.21,10.16C3.5,10.47 3,11.18 3,12M21,12C21,11.18 20.5,10.47 19.79,10.16C19.93,10.75 20,11.37 20,12C20,12.63 19.93,13.25 19.79,13.84C20.5,13.53 21,12.82 21,12Z",
  scrivania: "M3 6H21C21.55 6 22 6.45 22 7C22 7.55 21.55 8 21 8V19H19V17H15V19H13V8H5V19H3V8C2.45 8 2 7.55 2 7C2 6.45 2.45 6 3 6M16 10.5V11H18V10.5C18 10.22 17.78 10 17.5 10H16.5C16.22 10 16 10.22 16 10.5M16 14.5V15H18V14.5C18 14.22 17.78 14 17.5 14H16.5C16.22 14 16 14.22 16 14.5Z",
  libro: "M12 21.5C10.65 20.65 8.2 20 6.5 20C4.85 20 3.15 20.3 1.75 21.05C1.65 21.1 1.6 21.1 1.5 21.1C1.25 21.1 1 20.85 1 20.6V6C1.6 5.55 2.25 5.25 3 5C4.11 4.65 5.33 4.5 6.5 4.5C8.45 4.5 10.55 4.9 12 6C13.45 4.9 15.55 4.5 17.5 4.5C18.67 4.5 19.89 4.65 21 5C21.75 5.25 22.4 5.55 23 6V20.6C23 20.85 22.75 21.1 22.5 21.1C22.4 21.1 22.35 21.1 22.25 21.05C20.85 20.3 19.15 20 17.5 20C15.8 20 13.35 20.65 12 21.5M12 8V19.5C13.35 18.65 15.8 18 17.5 18C18.7 18 19.9 18.15 21 18.5V7C19.9 6.65 18.7 6.5 17.5 6.5C15.8 6.5 13.35 7.15 12 8M13 11.5C14.11 10.82 15.6 10.5 17.5 10.5C18.41 10.5 19.26 10.59 20 10.78V9.23C19.13 9.08 18.29 9 17.5 9C15.73 9 14.23 9.28 13 9.84V11.5M17.5 11.67C15.79 11.67 14.29 11.93 13 12.46V14.15C14.11 13.5 15.6 13.16 17.5 13.16C18.54 13.16 19.38 13.24 20 13.4V11.9C19.13 11.74 18.29 11.67 17.5 11.67M20 14.57C19.13 14.41 18.29 14.33 17.5 14.33C15.67 14.33 14.17 14.6 13 15.13V16.82C14.11 16.16 15.6 15.83 17.5 15.83C18.54 15.83 19.38 15.91 20 16.07V14.57Z",
  scuola: "M12,3L1,9L12,15L21,10.09V17H23V9M5,13.18V17.18L12,21L19,17.18V13.18L12,17L5,13.18Z",
  lavoro: "M10,2H14A2,2 0 0,1 16,4V6H20A2,2 0 0,1 22,8V19A2,2 0 0,1 20,21H4C2.89,21 2,20.1 2,19V8C2,6.89 2.89,6 4,6H8V4C8,2.89 8.89,2 10,2M14,6V4H10V6H14Z",
  palestra: "M20.57,14.86L22,13.43L20.57,12L17,15.57L8.43,7L12,3.43L10.57,2L9.14,3.43L7.71,2L5.57,4.14L4.14,2.71L2.71,4.14L4.14,5.57L2,7.71L3.43,9.14L2,10.57L3.43,12L7,8.43L15.57,17L12,20.57L13.43,22L14.86,20.57L16.29,22L18.43,19.86L19.86,21.29L21.29,19.86L19.86,18.43L22,16.29L20.57,14.86Z",
  corsa: "M13.5,5.5C14.59,5.5 15.5,4.58 15.5,3.5C15.5,2.38 14.59,1.5 13.5,1.5C12.39,1.5 11.5,2.38 11.5,3.5C11.5,4.58 12.39,5.5 13.5,5.5M9.89,19.38L10.89,15L13,17V23H15V15.5L12.89,13.5L13.5,10.5C14.79,12 16.79,13 19,13V11C17.09,11 15.5,10 14.69,8.58L13.69,7C13.29,6.38 12.69,6 12,6C11.69,6 11.5,6.08 11.19,6.08L6,8.28V13H8V9.58L9.79,8.88L8.19,17L3.29,16L2.89,18L9.89,19.38Z",
  bici: "M5,20.5A3.5,3.5 0 0,1 1.5,17A3.5,3.5 0 0,1 5,13.5A3.5,3.5 0 0,1 8.5,17A3.5,3.5 0 0,1 5,20.5M5,12A5,5 0 0,0 0,17A5,5 0 0,0 5,22A5,5 0 0,0 10,17A5,5 0 0,0 5,12M14.8,10H19V8.2H15.8L13.86,4.93C13.57,4.43 13,4.1 12.4,4.1C11.93,4.1 11.5,4.29 11.2,4.6L7.5,8.29C7.19,8.6 7,9 7,9.5C7,10.13 7.33,10.66 7.85,10.97L11.2,13V18H13V11.5L10.75,9.85L13.07,7.5M19,20.5A3.5,3.5 0 0,1 15.5,17A3.5,3.5 0 0,1 19,13.5A3.5,3.5 0 0,1 22.5,17A3.5,3.5 0 0,1 19,20.5M19,12A5,5 0 0,0 14,17A5,5 0 0,0 19,22A5,5 0 0,0 24,17A5,5 0 0,0 19,12M16,4.8C17,4.8 17.8,4 17.8,3C17.8,2 17,1.2 16,1.2C15,1.2 14.2,2 14.2,3C14.2,4 15,4.8 16,4.8Z",
  moto: "M17.42,10L13.41,6H9V8H12.59L14.59,10H6.5C4,10 2,12 2,14.5C2,17 4,19 6.5,19C8.72,19 10.56,17.38 10.92,15.27L13.04,14C13,14.17 13,14.33 13,14.5C13,17 15,19 17.5,19C20,19 22,17 22,14.5C22,12 20,10 17.5,10M8.84,15.26C8.5,16.27 7.58,17 6.47,17C5.09,17 3.97,15.88 3.97,14.5C3.97,13.12 5.09,12 6.47,12C7.59,12 8.5,12.74 8.84,13.75H6V15.25L8.84,15.26M17.47,17C16.09,17 14.97,15.88 14.97,14.5C14.97,13.12 16.09,12 17.47,12A2.5,2.5 0 0,1 19.97,14.5A2.5,2.5 0 0,1 17.47,17Z",
  benzina: "M18,10A1,1 0 0,1 17,9A1,1 0 0,1 18,8A1,1 0 0,1 19,9A1,1 0 0,1 18,10M12,10H6V5H12M19.77,7.23L19.78,7.22L16.06,3.5L15,4.56L17.11,6.67C16.17,7 15.5,7.93 15.5,9A2.5,2.5 0 0,0 18,11.5C18.36,11.5 18.69,11.42 19,11.29V18.5A1,1 0 0,1 18,19.5A1,1 0 0,1 17,18.5V14C17,12.89 16.1,12 15,12H14V5C14,3.89 13.1,3 12,3H6C4.89,3 4,3.89 4,5V21H14V13.5H15.5V18.5A2.5,2.5 0 0,0 18,21A2.5,2.5 0 0,0 20.5,18.5V9C20.5,8.31 20.22,7.68 19.77,7.23Z",
  ricarica_auto: "M19.77,7.23L19.78,7.22L16.06,3.5L15,4.56L17.11,6.67C16.17,7.03 15.5,7.93 15.5,9A2.5,2.5 0 0,0 18,11.5C18.36,11.5 18.69,11.42 19,11.29V18.5A1,1 0 0,1 18,19.5A1,1 0 0,1 17,18.5V14A2,2 0 0,0 15,12H14V5A2,2 0 0,0 12,3H6A2,2 0 0,0 4,5V21H14V13.5H15.5V18.5A2.5,2.5 0 0,0 18,21A2.5,2.5 0 0,0 20.5,18.5V9C20.5,8.31 20.22,7.68 19.77,7.23M18,10A1,1 0 0,1 17,9A1,1 0 0,1 18,8A1,1 0 0,1 19,9A1,1 0 0,1 18,10M8,18V13.5H6L10,6V11H12L8,18Z",
  parcheggio: "M13.2,11H10V7H13.2A2,2 0 0,1 15.2,9A2,2 0 0,1 13.2,11M13,3H6V21H10V15H13A6,6 0 0,0 19,9C19,5.68 16.31,3 13,3Z",
  mappa: "M15,19L9,16.89V5L15,7.11M20.5,3C20.44,3 20.39,3 20.34,3L15,5.1L9,3L3.36,4.9C3.15,4.97 3,5.15 3,5.38V20.5A0.5,0.5 0 0,0 3.5,21C3.55,21 3.61,21 3.66,20.97L9,18.9L15,21L20.64,19.1C20.85,19 21,18.85 21,18.62V3.5A0.5,0.5 0 0,0 20.5,3Z",
  posizione: "M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z",
  bussola: "M14.19,14.19L6,18L9.81,9.81L18,6M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,10.9A1.1,1.1 0 0,0 10.9,12A1.1,1.1 0 0,0 12,13.1A1.1,1.1 0 0,0 13.1,12A1.1,1.1 0 0,0 12,10.9Z",
  aereo: "M20.56 3.91C21.15 4.5 21.15 5.45 20.56 6.03L16.67 9.92L18.79 19.11L17.38 20.53L13.5 13.1L9.6 17L9.96 19.47L8.89 20.53L7.13 17.35L3.94 15.58L5 14.5L7.5 14.87L11.37 11L3.94 7.09L5.36 5.68L14.55 7.8L18.44 3.91C19 3.33 20 3.33 20.56 3.91Z",
  treno: "M12,2C8,2 4,2.5 4,6V15.5A3.5,3.5 0 0,0 7.5,19L6,20.5V21H8.23L10.23,19H14L16,21H18V20.5L16.5,19A3.5,3.5 0 0,0 20,15.5V6C20,2.5 16.42,2 12,2M7.5,17A1.5,1.5 0 0,1 6,15.5A1.5,1.5 0 0,1 7.5,14A1.5,1.5 0 0,1 9,15.5A1.5,1.5 0 0,1 7.5,17M11,10H6V6H11V10M13,10V6H18V10H13M16.5,17A1.5,1.5 0 0,1 15,15.5A1.5,1.5 0 0,1 16.5,14A1.5,1.5 0 0,1 18,15.5A1.5,1.5 0 0,1 16.5,17Z",
  autobus: "M18,11H6V6H18M16.5,17A1.5,1.5 0 0,1 15,15.5A1.5,1.5 0 0,1 16.5,14A1.5,1.5 0 0,1 18,15.5A1.5,1.5 0 0,1 16.5,17M7.5,17A1.5,1.5 0 0,1 6,15.5A1.5,1.5 0 0,1 7.5,14A1.5,1.5 0 0,1 9,15.5A1.5,1.5 0 0,1 7.5,17M4,16C4,16.88 4.39,17.67 5,18.22V20A1,1 0 0,0 6,21H7A1,1 0 0,0 8,20V19H16V20A1,1 0 0,0 17,21H18A1,1 0 0,0 19,20V18.22C19.61,17.67 20,16.88 20,16V6C20,2.5 16.42,2 12,2C7.58,2 4,2.5 4,6V16Z",
  valigia: "M17.03 6C18.11 6 19 6.88 19 8V19C19 20.13 18.11 21 17.03 21C17.03 21.58 16.56 22 16 22C15.5 22 15 21.58 15 21H9C9 21.58 8.5 22 8 22C7.44 22 6.97 21.58 6.97 21C5.89 21 5 20.13 5 19V8C5 6.88 5.89 6 6.97 6H9V3C9 2.42 9.46 2 10 2H14C14.54 2 15 2.42 15 3V6H17.03M13.5 6V3.5H10.5V6H13.5M8 9V18H9.5V9H8M14.5 9V18H16V9H14.5M11.25 9V18H12.75V9H11.25Z",
  stella: "M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z",
  cuore: "M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z",
  battito: "M7.5,4A5.5,5.5 0 0,0 2,9.5C2,10 2.09,10.5 2.22,11H6.3L7.57,7.63C7.87,6.83 9.05,6.75 9.43,7.63L11.5,13L12.09,11.58C12.22,11.25 12.57,11 13,11H21.78C21.91,10.5 22,10 22,9.5A5.5,5.5 0 0,0 16.5,4C14.64,4 13,4.93 12,6.34C11,4.93 9.36,4 7.5,4V4M3,12.5A1,1 0 0,0 2,13.5A1,1 0 0,0 3,14.5H5.44L11,20C12,20.9 12,20.9 13,20L18.56,14.5H21A1,1 0 0,0 22,13.5A1,1 0 0,0 21,12.5H13.4L12.47,14.8C12.07,15.81 10.92,15.67 10.55,14.83L8.5,9.5L7.54,11.83C7.39,12.21 7.05,12.5 6.6,12.5H3Z",
  medicina: "M4.22,11.29L11.29,4.22C13.64,1.88 17.43,1.88 19.78,4.22C22.12,6.56 22.12,10.36 19.78,12.71L12.71,19.78C10.36,22.12 6.56,22.12 4.22,19.78C1.88,17.43 1.88,13.64 4.22,11.29M5.64,12.71C4.59,13.75 4.24,15.24 4.6,16.57L10.59,10.59L14.83,14.83L18.36,11.29C19.93,9.73 19.93,7.2 18.36,5.64C16.8,4.07 14.27,4.07 12.71,5.64L5.64,12.71Z",
  bilancia: "M5,2H19A2,2 0 0,1 21,4V20A2,2 0 0,1 19,22H5A2,2 0 0,1 3,20V4A2,2 0 0,1 5,2M12,4A4,4 0 0,0 8,8H11.26L10.85,5.23L12.9,8H16A4,4 0 0,0 12,4M5,10V20H19V10H5Z",
  sonno: "M23,12H17V10L20.39,6H17V4H23V6L19.62,10H23V12M15,16H9V14L12.39,10H9V8H15V10L11.62,14H15V16M7,20H1V18L4.39,14H1V12H7V14L3.62,18H7V20Z",
  occhio: "M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9M12,4.5C17,4.5 21.27,7.61 23,12C21.27,16.39 17,19.5 12,19.5C7,19.5 2.73,16.39 1,12C2.73,7.61 7,4.5 12,4.5M3.18,12C4.83,15.36 8.24,17.5 12,17.5C15.76,17.5 19.17,15.36 20.82,12C19.17,8.64 15.76,6.5 12,6.5C8.24,6.5 4.83,8.64 3.18,12Z",
  lucchetto: "M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z",
  lucchetto_aperto: "M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V10A2,2 0 0,1 6,8H15V6A3,3 0 0,0 12,3A3,3 0 0,0 9,6H7A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,17A2,2 0 0,0 14,15A2,2 0 0,0 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17Z",
  scudo: "M11,13H13V16H16V11H18L12,6L6,11H8V16H11V13M12,1L21,5V11C21,16.55 17.16,21.74 12,23C6.84,21.74 3,16.55 3,11V5L12,1Z",
  sirena: "M6,6.9L3.87,4.78L5.28,3.37L7.4,5.5L6,6.9M13,1V4H11V1H13M20.13,4.78L18,6.9L16.6,5.5L18.72,3.37L20.13,4.78M4.5,10.5V12.5H1.5V10.5H4.5M19.5,10.5H22.5V12.5H19.5V10.5M6,20H18A2,2 0 0,1 20,22H4A2,2 0 0,1 6,20M12,5A6,6 0 0,1 18,11V19H6V11A6,6 0 0,1 12,5Z",
  cctv: "M6.03 12.03L8.03 15.5L5.5 18.68L2 12.62L6.03 12.03M17 18V15.29C17.88 14.9 18.5 14.03 18.5 13C18.5 12.43 18.3 11.9 17.97 11.5L19.94 10.35C20.95 9.76 21.3 8.47 20.71 7.46L19.33 5.06C18.74 4.05 17.45 3.7 16.44 4.28L8.31 9C7.36 9.53 7.03 10.75 7.58 11.71L9.08 14.31C9.63 15.26 10.86 15.59 11.81 15.04L13.69 13.96C13.94 14.55 14.41 15.03 15 15.29V18C15 19.1 15.9 20 17 20H22V18H17Z",
  sensore_movimento: "M10,0.2C9,0.2 8.2,1 8.2,2C8.2,3 9,3.8 10,3.8C11,3.8 11.8,3 11.8,2C11.8,1 11,0.2 10,0.2M15.67,1A7.33,7.33 0 0,0 23,8.33V7A6,6 0 0,1 17,1H15.67M18.33,1C18.33,3.58 20.42,5.67 23,5.67V4.33C21.16,4.33 19.67,2.84 19.67,1H18.33M21,1A2,2 0 0,0 23,3V1H21M7.92,4.03C7.75,4.03 7.58,4.06 7.42,4.11L2,5.8V11H3.8V7.33L5.91,6.67L2,22H3.8L6.67,13.89L9,17V22H10.8V15.59L8.31,11.05L9.04,8.18L10.12,10H15V8.2H11.38L9.38,4.87C9.08,4.37 8.54,4.03 7.92,4.03Z",
  porta_scorrevole: "M10 13H8V11H10V13M16 11H14V13H16V11M21 19V21H3V19H4V5C4 3.9 4.9 3 6 3H18C19.1 3 20 3.9 20 5V19H21M11 5H6V19H11V5M18 5H13V19H18V5Z",
  cancello: "M9 6V11H7V7H5V11H3V9H1V21H3V19H5V21H7V19H9V21H11V19H13V21H15V19H17V21H19V19H21V21H23V9H21V11H19V7H17V11H15V6H13V11H11V6H9M3 13H5V17H3V13M7 13H9V17H7V13M11 13H13V17H11V13M15 13H17V17H15V13M19 13H21V17H19V13Z",
  serranda: "M3 4H21V8H19V20H17V8H7V20H5V8H3V4M8 9H16V11H8V9M8 12H16V14H8V12M8 15H16V17H8V15M8 18H16V20H8V18Z",
  tende: "M23 3H1V1H23V3M2 22H6C6 19 4 17 4 17C10 13 11 4 11 4H2V22M22 4H13C13 4 14 13 20 17C20 17 18 19 18 22H22V4Z",
  finestra_aperta: "M6,8H10V6H14V8H18V4H6V8M18,10H6V15H18V10M6,20H18V17H6V20M6,2H18A2,2 0 0,1 20,4V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V4A2,2 0 0,1 6,2Z",
  ventilatore: "M12,11A1,1 0 0,0 11,12A1,1 0 0,0 12,13A1,1 0 0,0 13,12A1,1 0 0,0 12,11M12.5,2C17,2 17.11,5.57 14.75,6.75C13.76,7.24 13.32,8.29 13.13,9.22C13.61,9.42 14.03,9.73 14.35,10.13C18.05,8.13 22.03,8.92 22.03,12.5C22.03,17 18.46,17.1 17.28,14.73C16.78,13.74 15.72,13.3 14.79,13.11C14.59,13.59 14.28,14 13.88,14.34C15.87,18.03 15.08,22 11.5,22C7,22 6.91,18.42 9.27,17.24C10.25,16.75 10.69,15.71 10.89,14.79C10.4,14.59 9.97,14.27 9.65,13.87C5.96,15.85 2,15.07 2,11.5C2,7 5.56,6.89 6.74,9.26C7.24,10.25 8.29,10.68 9.22,10.87C9.41,10.39 9.73,9.97 10.14,9.65C8.15,5.96 8.94,2 12.5,2Z",
  filtro_aria: "M19,18.31V20A2,2 0 0,1 17,22H7A2,2 0 0,1 5,20V16.3C4.54,16.12 3.95,16 3,16A1,1 0 0,1 2,15A1,1 0 0,1 3,14C3.82,14 4.47,14.08 5,14.21V12.3C4.54,12.12 3.95,12 3,12A1,1 0 0,1 2,11A1,1 0 0,1 3,10C3.82,10 4.47,10.08 5,10.21V8.3C4.54,8.12 3.95,8 3,8A1,1 0 0,1 2,7A1,1 0 0,1 3,6C3.82,6 4.47,6.08 5,6.21V4A2,2 0 0,1 7,2H17A2,2 0 0,1 19,4V6.16C20.78,6.47 21.54,7.13 21.71,7.29C22.1,7.68 22.1,8.32 21.71,8.71C21.32,9.1 20.8,9.09 20.29,8.71V8.71C20.29,8.71 19.25,8 17,8C15.74,8 14.91,8.41 13.95,8.9C12.91,9.41 11.74,10 10,10C9.64,10 9.31,10 9,9.96V7.95C9.3,8 9.63,8 10,8C11.26,8 12.09,7.59 13.05,7.11C14.09,6.59 15.27,6 17,6V4H7V20H17V18C18.5,18 18.97,18.29 19,18.31M17,10C15.27,10 14.09,10.59 13.05,11.11C12.09,11.59 11.26,12 10,12C9.63,12 9.3,12 9,11.95V13.96C9.31,14 9.64,14 10,14C11.74,14 12.91,13.41 13.95,12.9C14.91,12.42 15.74,12 17,12C19.25,12 20.29,12.71 20.29,12.71V12.71C20.8,13.1 21.32,13.1 21.71,12.71C22.1,12.32 22.1,11.69 21.71,11.29C21.5,11.08 20.25,10 17,10M17,14C15.27,14 14.09,14.59 13.05,15.11C12.09,15.59 11.26,16 10,16C9.63,16 9.3,16 9,15.95V17.96C9.31,18 9.64,18 10,18C11.74,18 12.91,17.41 13.95,16.9C14.91,16.42 15.74,16 17,16C19.25,16 20.29,16.71 20.29,16.71V16.71C20.8,17.1 21.32,17.1 21.71,16.71C22.1,16.32 22.1,15.69 21.71,15.29C21.5,15.08 20.25,14 17,14Z",
  purificatore: "M11,9A4,4 0 0,1 15,13A4,4 0 0,1 11,17A4,4 0 0,1 7,13A4,4 0 0,1 11,9M11,11A2,2 0 0,0 9,13A2,2 0 0,0 11,15A2,2 0 0,0 13,13A2,2 0 0,0 11,11M7,4H14A4,4 0 0,1 18,8V9H16V8A2,2 0 0,0 14,6H7A2,2 0 0,0 5,8V20H16V18H18V22H3V8A4,4 0 0,1 7,4M16,11C18.5,11 18.5,9 21,9V11C18.5,11 18.5,13 16,13V11M16,15C18.5,15 18.5,13 21,13V15C18.5,15 18.5,17 16,17V15Z",
  umidificatore: "M11 9C8.79 9 7 10.79 7 13S8.79 17 11 17 15 15.21 15 13 13.21 9 11 9M11 15C9.9 15 9 14.11 9 13S9.9 11 11 11 13 11.9 13 13 12.11 15 11 15M7 4H14C16.21 4 18 5.79 18 8V9H16V8C16 6.9 15.11 6 14 6H7C5.9 6 5 6.9 5 8V20H16V18H18V22H3V8C3 5.79 4.79 4 7 4M19 10.5C19 10.5 21 12.67 21 14C21 15.1 20.1 16 19 16S17 15.1 17 14C17 12.67 19 10.5 19 10.5",
  robot_aspirapolvere: "M12,2C14.65,2 17.19,3.06 19.07,4.93L17.65,6.35C16.15,4.85 14.12,4 12,4C9.88,4 7.84,4.84 6.35,6.35L4.93,4.93C6.81,3.06 9.35,2 12,2M3.66,6.5L5.11,7.94C4.39,9.17 4,10.57 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12C20,10.57 19.61,9.17 18.88,7.94L20.34,6.5C21.42,8.12 22,10.04 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12C2,10.04 2.58,8.12 3.66,6.5M12,6A6,6 0 0,1 18,12C18,13.59 17.37,15.12 16.24,16.24L14.83,14.83C14.08,15.58 13.06,16 12,16C10.94,16 9.92,15.58 9.17,14.83L7.76,16.24C6.63,15.12 6,13.59 6,12A6,6 0 0,1 12,6M12,8A1,1 0 0,0 11,9A1,1 0 0,0 12,10A1,1 0 0,0 13,9A1,1 0 0,0 12,8Z",
  scopa: "M19.36,2.72L20.78,4.14L15.06,9.85C16.13,11.39 16.28,13.24 15.38,14.44L9.06,8.12C10.26,7.22 12.11,7.37 13.65,8.44L19.36,2.72M5.93,17.57C3.92,15.56 2.69,13.16 2.35,10.92L7.23,8.83L14.67,16.27L12.58,21.15C10.34,20.81 7.94,19.58 5.93,17.57Z",
  lavatrice_mdi: "M14.83,11.17C16.39,12.73 16.39,15.27 14.83,16.83C13.27,18.39 10.73,18.39 9.17,16.83L14.83,11.17M6,2H18A2,2 0 0,1 20,4V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V4A2,2 0 0,1 6,2M7,4A1,1 0 0,0 6,5A1,1 0 0,0 7,6A1,1 0 0,0 8,5A1,1 0 0,0 7,4M10,4A1,1 0 0,0 9,5A1,1 0 0,0 10,6A1,1 0 0,0 11,5A1,1 0 0,0 10,4M12,8A6,6 0 0,0 6,14A6,6 0 0,0 12,20A6,6 0 0,0 18,14A6,6 0 0,0 12,8Z",
  asciugatrice: "M6,2H18A2,2 0 0,1 20,4V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V4A2,2 0 0,1 6,2M7,4A1,1 0 0,0 6,5A1,1 0 0,0 7,6A1,1 0 0,0 8,5A1,1 0 0,0 7,4M10,4A1,1 0 0,0 9,5A1,1 0 0,0 10,6A1,1 0 0,0 11,5A1,1 0 0,0 10,4M12,8A6,6 0 0,0 6,14A6,6 0 0,0 12,20A6,6 0 0,0 18,14A6,6 0 0,0 12,8M8.11,10.5H10C9.76,11.88 10,12.67 10.58,13.29C11.68,14.36 12.16,15.71 11.89,17.5H10C10.24,16.12 10,15.33 9.42,14.71C8.32,13.64 7.85,12.29 8.11,10.5M12.11,10.5H14C13.76,11.88 14,12.67 14.58,13.29C15.68,14.36 16.16,15.71 15.89,17.5H14C14.24,16.12 14,15.33 13.42,14.71C12.32,13.64 11.85,12.29 12.11,10.5Z",
  lavastoviglie: "M18,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V4A2,2 0 0,0 18,2M10,4A1,1 0 0,1 11,5A1,1 0 0,1 10,6A1,1 0 0,1 9,5A1,1 0 0,1 10,4M7,4A1,1 0 0,1 8,5A1,1 0 0,1 7,6A1,1 0 0,1 6,5A1,1 0 0,1 7,4M18,20H6V8H18V20M14.67,15.33C14.69,16.03 14.41,16.71 13.91,17.21C12.86,18.26 11.15,18.27 10.09,17.21C9.59,16.71 9.31,16.03 9.33,15.33C9.4,14.62 9.63,13.94 10,13.33C10.37,12.5 10.81,11.73 11.33,11L12,10C13.79,12.59 14.67,14.36 14.67,15.33",
  fornello: "M6,14H8L11,17H9L6,14M4,4H5V3A1,1 0 0,1 6,2H10A1,1 0 0,1 11,3V4H13V3A1,1 0 0,1 14,2H18A1,1 0 0,1 19,3V4H20A2,2 0 0,1 22,6V19A2,2 0 0,1 20,21V22H17V21H7V22H4V21A2,2 0 0,1 2,19V6A2,2 0 0,1 4,4M18,7A1,1 0 0,1 19,8A1,1 0 0,1 18,9A1,1 0 0,1 17,8A1,1 0 0,1 18,7M14,7A1,1 0 0,1 15,8A1,1 0 0,1 14,9A1,1 0 0,1 13,8A1,1 0 0,1 14,7M20,6H4V10H20V6M4,19H20V12H4V19M6,7A1,1 0 0,1 7,8A1,1 0 0,1 6,9A1,1 0 0,1 5,8A1,1 0 0,1 6,7M13,14H15L18,17H16L13,14Z",
  microonde: "M4,5A2,2 0 0,0 2,7V17A2,2 0 0,0 4,19H20A2,2 0 0,0 22,17V7A2,2 0 0,0 20,5H4M4,7H16V17H4V7M19,7A1,1 0 0,1 20,8A1,1 0 0,1 19,9A1,1 0 0,1 18,8A1,1 0 0,1 19,7M13,9V15H15V9H13M19,11A1,1 0 0,1 20,12A1,1 0 0,1 19,13A1,1 0 0,1 18,12A1,1 0 0,1 19,11Z",
  frigorifero: "M7,2H17A2,2 0 0,1 19,4V9H5V4A2,2 0 0,1 7,2M19,19A2,2 0 0,1 17,21V22H15V21H9V22H7V21A2,2 0 0,1 5,19V10H19V19M8,5V7H10V5H8M8,12V15H10V12H8Z",
  macchina_caffe: "M18 6V4H20V2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H20V20H15.97C17.2 19.09 18 17.64 18 16V11H8V16C8 17.64 8.81 19.09 10.03 20H6V4H8V6C8 6.55 8.45 7 9 7H17C17.55 7 18 6.55 18 6M13 8C13.55 8 14 8.45 14 9S13.55 10 13 10 12 9.55 12 9 12.45 8 13 8Z",
  tostapane: "M21 11A2 2 0 0 0 19 9H5A2 2 0 0 0 3 11H2V13H3V20H21V13H22V11M17 15A2 2 0 1 1 19 13A2 2 0 0 1 17 15M18 8H6C6.33 5.75 8.88 4 12 4S17.63 5.75 18 8Z",
  bollitore: "M12.5,3C7.81,3 4,5.69 4,9V9C4,10.19 4.5,11.34 5.44,12.33C4.53,13.5 4,14.96 4,16.5C4,17.64 4,18.83 4,20C4,21.11 4.89,22 6,22H19C20.11,22 21,21.11 21,20C21,18.85 21,17.61 21,16.5C21,15.28 20.66,14.07 20,13L22,11L19,8L16.9,10.1C15.58,9.38 14.05,9 12.5,9C10.65,9 8.95,9.53 7.55,10.41C7.19,9.97 7,9.5 7,9C7,7.21 9.46,5.75 12.5,5.75V5.75C13.93,5.75 15.3,6.08 16.33,6.67L18.35,4.65C16.77,3.59 14.68,3 12.5,3M12.5,11C12.84,11 13.17,11.04 13.5,11.09C10.39,11.57 8,14.25 8,17.5V20H6V17.5A6.5,6.5 0 0,1 12.5,11Z",
  mela: "M20,10C22,13 17,22 15,22C13,22 13,21 12,21C11,21 11,22 9,22C7,22 2,13 4,10C6,7 9,7 11,8V5C5.38,8.07 4.11,3.78 4.11,3.78C4.11,3.78 6.77,0.19 11,5V3H13V8C15,7 18,7 20,10Z",
  pizza: "M12,15A2,2 0 0,1 10,13C10,11.89 10.9,11 12,11A2,2 0 0,1 14,13A2,2 0 0,1 12,15M7,7C7,5.89 7.89,5 9,5A2,2 0 0,1 11,7A2,2 0 0,1 9,9C7.89,9 7,8.1 7,7M12,2C8.43,2 5.23,3.54 3,6L12,22L21,6C18.78,3.54 15.57,2 12,2Z",
  vino: "M15.5,21.27L14.66,21.18C13.9,21.11 13.25,20.6 13,19.87C12.47,17.91 12.47,15.83 13,13.87C15.32,13.4 17,11.37 17,9C17,7 15,2 15,2H9C9,2 7,7 7,9C7,11.38 8.67,13.42 11,13.9C11.53,15.86 11.53,17.94 11,19.9C10.76,20.62 10.12,21.13 9.37,21.21L8.5,21.3C8.5,21.3 8,21.28 8,22H16C16,21.28 15.5,21.27 15.5,21.27M9.44,7L10.44,4H13.56L14.56,7H9.44Z",
  birra: "M4,2H19L17,22H6L4,2M6.2,4L7.8,20H8.8L7.43,6.34C8.5,6 9.89,5.89 11,7C12.56,8.56 15.33,7.69 16.5,7.23L16.8,4H6.2Z",
  goccia: "M12,20A6,6 0 0,1 6,14C6,10 12,3.25 12,3.25C12,3.25 18,10 18,14A6,6 0 0,1 12,20Z",
  fuoco: "M17.66 11.2C17.43 10.9 17.15 10.64 16.89 10.38C16.22 9.78 15.46 9.35 14.82 8.72C13.33 7.26 13 4.85 13.95 3C13 3.23 12.17 3.75 11.46 4.32C8.87 6.4 7.85 10.07 9.07 13.22C9.11 13.32 9.15 13.42 9.15 13.55C9.15 13.77 9 13.97 8.8 14.05C8.57 14.15 8.33 14.09 8.14 13.93C8.08 13.88 8.04 13.83 8 13.76C6.87 12.33 6.69 10.28 7.45 8.64C5.78 10 4.87 12.3 5 14.47C5.06 14.97 5.12 15.47 5.29 15.97C5.43 16.57 5.7 17.17 6 17.7C7.08 19.43 8.95 20.67 10.96 20.92C13.1 21.19 15.39 20.8 17.03 19.32C18.86 17.66 19.5 15 18.56 12.72L18.43 12.46C18.22 12 17.66 11.2 17.66 11.2M14.5 17.5C14.22 17.74 13.76 18 13.4 18.1C12.28 18.5 11.16 17.94 10.5 17.28C11.69 17 12.4 16.12 12.61 15.23C12.78 14.43 12.46 13.77 12.33 13C12.21 12.26 12.23 11.63 12.5 10.94C12.69 11.32 12.89 11.7 13.13 12C13.9 13 15.11 13.44 15.37 14.8C15.41 14.94 15.43 15.08 15.43 15.23C15.46 16.05 15.1 16.95 14.5 17.5H14.5Z",
  bombola: "M16,9V14L16,20A2,2 0 0,1 14,22H10A2,2 0 0,1 8,20V14L8,9C8,7.14 9.27,5.57 11,5.13V4H9V2H15V4H13V5.13C14.73,5.57 16,7.14 16,9Z",
  spazzatura: "M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M9,8H11V17H9V8M13,8H15V17H13V8Z",
  riciclo: "M21.82,15.42L19.32,19.75C18.83,20.61 17.92,21.06 17,21H15V23L12.5,18.5L15,14V16H17.82L15.6,12.15L19.93,9.65L21.73,12.77C22.25,13.54 22.32,14.57 21.82,15.42M9.21,3.06H14.21C15.19,3.06 16.04,3.63 16.45,4.45L17.45,6.19L19.18,5.19L16.54,9.6L11.39,9.69L13.12,8.69L11.71,6.24L9.5,10.09L5.16,7.59L6.96,4.47C7.37,3.64 8.22,3.06 9.21,3.06M5.05,19.76L2.55,15.43C2.06,14.58 2.13,13.56 2.64,12.79L3.64,11.06L1.91,10.06L7.05,10.14L9.7,14.56L7.97,13.56L6.56,16H11V21H7.4C6.47,21.07 5.55,20.61 5.05,19.76Z",
  attrezzi: "M21.71 20.29L20.29 21.71A1 1 0 0 1 18.88 21.71L7 9.85A3.81 3.81 0 0 1 6 10A4 4 0 0 1 2.22 4.7L4.76 7.24L5.29 6.71L6.71 5.29L7.24 4.76L4.7 2.22A4 4 0 0 1 10 6A3.81 3.81 0 0 1 9.85 7L21.71 18.88A1 1 0 0 1 21.71 20.29M2.29 18.88A1 1 0 0 0 2.29 20.29L3.71 21.71A1 1 0 0 0 5.12 21.71L10.59 16.25L7.76 13.42M20 2L16 4V6L13.83 8.17L15.83 10.17L18 8H20L22 4Z",
  martello: "M2 19.63L13.43 8.2L12.72 7.5L14.14 6.07L12 3.89C13.2 2.7 15.09 2.7 16.27 3.89L19.87 7.5L18.45 8.91H21.29L22 9.62L18.45 13.21L17.74 12.5V9.62L16.27 11.04L15.56 10.33L4.13 21.76L2 19.63Z",
  cacciavite: "M18,1.83C17.5,1.83 17,2 16.59,2.41C13.72,5.28 8,11 8,11L9.5,12.5L6,16H4L2,20L4,22L8,20V18L11.5,14.5L13,16C13,16 18.72,10.28 21.59,7.41C22.21,6.5 22.37,5.37 21.59,4.59L19.41,2.41C19,2 18.5,1.83 18,1.83M18,4L20,6L13,13L11,11L18,4Z",
  ingranaggio: "M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z",
  robot_mdi: "M12,2A2,2 0 0,1 14,4C14,4.74 13.6,5.39 13,5.73V7H14A7,7 0 0,1 21,14H22A1,1 0 0,1 23,15V18A1,1 0 0,1 22,19H21V20A2,2 0 0,1 19,22H5A2,2 0 0,1 3,20V19H2A1,1 0 0,1 1,18V15A1,1 0 0,1 2,14H3A7,7 0 0,1 10,7H11V5.73C10.4,5.39 10,4.74 10,4A2,2 0 0,1 12,2M7.5,13A2.5,2.5 0 0,0 5,15.5A2.5,2.5 0 0,0 7.5,18A2.5,2.5 0 0,0 10,15.5A2.5,2.5 0 0,0 7.5,13M16.5,13A2.5,2.5 0 0,0 14,15.5A2.5,2.5 0 0,0 16.5,18A2.5,2.5 0 0,0 19,15.5A2.5,2.5 0 0,0 16.5,13Z",
  script: "M17.8,20C17.4,21.2 16.3,22 15,22H5C3.3,22 2,20.7 2,19V18H5L14.2,18C14.6,19.2 15.7,20 17,20H17.8M19,2C20.7,2 22,3.3 22,5V6H20V5C20,4.4 19.6,4 19,4C18.4,4 18,4.4 18,5V18H17C16.4,18 16,17.6 16,17V16H5V5C5,3.3 6.3,2 8,2H19M8,6V8H15V6H8M8,10V12H14V10H8Z",
  scena: "M17.5,12A1.5,1.5 0 0,1 16,10.5A1.5,1.5 0 0,1 17.5,9A1.5,1.5 0 0,1 19,10.5A1.5,1.5 0 0,1 17.5,12M14.5,8A1.5,1.5 0 0,1 13,6.5A1.5,1.5 0 0,1 14.5,5A1.5,1.5 0 0,1 16,6.5A1.5,1.5 0 0,1 14.5,8M9.5,8A1.5,1.5 0 0,1 8,6.5A1.5,1.5 0 0,1 9.5,5A1.5,1.5 0 0,1 11,6.5A1.5,1.5 0 0,1 9.5,8M6.5,12A1.5,1.5 0 0,1 5,10.5A1.5,1.5 0 0,1 6.5,9A1.5,1.5 0 0,1 8,10.5A1.5,1.5 0 0,1 6.5,12M12,3A9,9 0 0,0 3,12A9,9 0 0,0 12,21A1.5,1.5 0 0,0 13.5,19.5C13.5,19.11 13.35,18.76 13.11,18.5C12.88,18.23 12.73,17.88 12.73,17.5A1.5,1.5 0 0,1 14.23,16H16A5,5 0 0,0 21,11C21,6.58 16.97,3 12,3Z",
  gruppo: "M1,1V5H2V19H1V23H5V22H19V23H23V19H22V5H23V1H19V2H5V1M5,4H19V5H20V19H19V20H5V19H4V5H5M6,6V14H9V18H18V9H14V6M8,8H12V12H8M14,11H16V16H11V14H14",
  aggiornamento: "M21,10.12H14.22L16.96,7.3C14.23,4.6 9.81,4.5 7.08,7.2C4.35,9.91 4.35,14.28 7.08,17C9.81,19.7 14.23,19.7 16.96,17C18.32,15.65 19,14.08 19,12.1H21C21,14.08 20.12,16.65 18.36,18.39C14.85,21.87 9.15,21.87 5.64,18.39C2.14,14.92 2.11,9.28 5.62,5.81C9.13,2.34 14.76,2.34 18.27,5.81L21,3V10.12M12.5,8V12.25L16,14.33L15.28,15.54L11,13V8H12.5Z",
  nuvola_cloud: "M6.5 20Q4.22 20 2.61 18.43 1 16.85 1 14.58 1 12.63 2.17 11.1 3.35 9.57 5.25 9.15 5.88 6.85 7.75 5.43 9.63 4 12 4 14.93 4 16.96 6.04 19 8.07 19 11 20.73 11.2 21.86 12.5 23 13.78 23 15.5 23 17.38 21.69 18.69 20.38 20 18.5 20Z",
  wifi_mdi: "M12,21L15.6,16.2C14.6,15.45 13.35,15 12,15C10.65,15 9.4,15.45 8.4,16.2L12,21M12,3C7.95,3 4.21,4.34 1.2,6.6L3,9C5.5,7.12 8.62,6 12,6C15.38,6 18.5,7.12 21,9L22.8,6.6C19.79,4.34 16.05,3 12,3M12,9C9.3,9 6.81,9.89 4.8,11.4L6.6,13.8C8.1,12.67 9.97,12 12,12C14.03,12 15.9,12.67 17.4,13.8L19.2,11.4C17.19,9.89 14.7,9 12,9Z",
  bluetooth: "M14.88,16.29L13,18.17V14.41M13,5.83L14.88,7.71L13,9.58M17.71,7.71L12,2H11V9.58L6.41,5L5,6.41L10.59,12L5,17.58L6.41,19L11,14.41V22H12L17.71,16.29L13.41,12L17.71,7.71Z",
  zigbee: "M4.06,6.15C3.97,6.17 3.88,6.22 3.8,6.28C2.66,7.9 2,9.87 2,12A10,10 0 0,0 12,22C15,22 17.68,20.68 19.5,18.6L17,18.85C14.25,19.15 11.45,19.19 8.66,18.96C7.95,18.94 7.24,18.76 6.59,18.45C5.73,18.06 5.15,17.23 5.07,16.29C5.06,16.13 5.12,16 5.23,15.87L7.42,13.6L15.03,5.7V5.6H10.84C8.57,5.64 6.31,5.82 4.06,6.15M20.17,17.5C20.26,17.47 20.35,17.44 20.43,17.39C21.42,15.83 22,14 22,12A10,10 0 0,0 12,2C9.22,2 6.7,3.13 4.89,4.97H5.17C8.28,4.57 11.43,4.47 14.56,4.65C15.5,4.64 16.45,4.82 17.33,5.17C18.25,5.53 18.89,6.38 19,7.37C19,7.53 18.93,7.7 18.82,7.82L9.71,17.19L9,17.95V18.06H13.14C15.5,18 17.84,17.81 20.17,17.5Z",
  qr: "M3,11H5V13H3V11M11,5H13V9H11V5M9,11H13V15H11V13H9V11M15,11H17V13H19V11H21V13H19V15H21V19H19V21H17V19H13V21H11V17H15V15H17V13H15V11M19,19V15H17V19H19M15,3H21V9H15V3M17,5V7H19V5H17M3,3H9V9H3V3M5,5V7H7V5H5M3,15H9V21H3V15M5,17V19H7V17H5Z",
  stampante_3d: "M19,6A1,1 0 0,0 20,5A1,1 0 0,0 19,4A1,1 0 0,0 18,5A1,1 0 0,0 19,6M19,2A3,3 0 0,1 22,5V11H18V7H6V11H2V5A3,3 0 0,1 5,2H19M18,18.25C18,18.63 17.79,18.96 17.47,19.13L12.57,21.82C12.4,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L6.53,19.13C6.21,18.96 6,18.63 6,18.25V13C6,12.62 6.21,12.29 6.53,12.12L11.43,9.68C11.59,9.56 11.79,9.5 12,9.5C12.21,9.5 12.4,9.56 12.57,9.68L17.47,12.12C17.79,12.29 18,12.62 18,13V18.25M12,11.65L9.04,13L12,14.6L14.96,13L12,11.65M8,17.66L11,19.29V16.33L8,14.71V17.66M16,17.66V14.71L13,16.33V19.29L16,17.66Z",
  pc_fisso: "M8,2H16A2,2 0 0,1 18,4V20A2,2 0 0,1 16,22H8A2,2 0 0,1 6,20V4A2,2 0 0,1 8,2M8,4V6H16V4H8M16,8H8V10H16V8M16,18H14V20H16V18Z",
  portatile: "M4,6H20V16H4M20,18A2,2 0 0,0 22,16V6C22,4.89 21.1,4 20,4H4C2.89,4 2,4.89 2,6V16A2,2 0 0,0 4,18H0V20H24V18H20Z",
  tablet: "M19,18H5V6H19M21,4H3C1.89,4 1,4.89 1,6V18A2,2 0 0,0 3,20H21A2,2 0 0,0 23,18V6C23,4.89 22.1,4 21,4Z",
  tv_mdi: "M21,17H3V5H21M21,3H3A2,2 0 0,0 1,5V17A2,2 0 0,0 3,19H8V21H16V19H21A2,2 0 0,0 23,17V5A2,2 0 0,0 21,3Z",
  telecomando: "M9,2C7.89,2 7,2.89 7,4V20C7,21.11 7.89,22 9,22H15C16.11,22 17,21.11 17,20V4C17,2.89 16.11,2 15,2H13V4H11V2H9M11,6H13V8H15V10H13V12H11V10H9V8H11V6M9,14H11V16H9V14M13,14H15V16H13V14M9,18H11V20H9V18M13,18H15V20H13V18Z",
  lampadina_accesa: "M12,6A6,6 0 0,1 18,12C18,14.22 16.79,16.16 15,17.2V19A1,1 0 0,1 14,20H10A1,1 0 0,1 9,19V17.2C7.21,16.16 6,14.22 6,12A6,6 0 0,1 12,6M14,21V22A1,1 0 0,1 13,23H11A1,1 0 0,1 10,22V21H14M20,11H23V13H20V11M1,11H4V13H1V11M13,1V4H11V1H13M4.92,3.5L7.05,5.64L5.63,7.05L3.5,4.93L4.92,3.5M16.95,5.63L19.07,3.5L20.5,4.93L18.37,7.05L16.95,5.63Z",
  faretti: "M6,1V3H9V6.4L4.11,4.38L1.43,10.84L6.97,13.14L11.94,16.82L13.79,17.59L17.62,8.35L15.77,7.58L11,6.87V3H14V1H6M21.81,6.29L19.5,7.25L20.26,9.1L22.57,8.14L21.81,6.29M19.78,13.57L19,15.42L21.79,16.57L22.55,14.72L19.78,13.57M16.19,18.93L14.34,19.69L15.3,22L17.15,21.23L16.19,18.93Z",
  lampione: "M15 22H13C11.9 22 11 21.1 11 20V15H17V20C17 21.1 16.1 22 15 22M7 14H21L15 9.71V6C15 4.39 13.94 2 11 2S7 4.39 7 6C7 6.45 6.81 7 6 7H5V3H3V12H5V9H6C8.2 9 9 7.21 9 6C9 5.67 9.1 4 11 4C12.83 4 13 5.54 13 6V9.71L7 14Z",
  candela: "M12.5,2C10.84,2 9.5,5.34 9.5,7A3,3 0 0,0 12.5,10A3,3 0 0,0 15.5,7C15.5,5.34 14.16,2 12.5,2M12.5,6.5A1,1 0 0,1 13.5,7.5A1,1 0 0,1 12.5,8.5A1,1 0 0,1 11.5,7.5A1,1 0 0,1 12.5,6.5M10,11A1,1 0 0,0 9,12V20H7A1,1 0 0,1 6,19V18A1,1 0 0,0 5,17A1,1 0 0,0 4,18V19A3,3 0 0,0 7,22H19A1,1 0 0,0 20,21A1,1 0 0,0 19,20H16V12A1,1 0 0,0 15,11H10Z",
  striscia_led: "M2.95 3L2 6.91L19.34 11.25L20.29 7.34L2.95 3M6.09 6.89L4.16 6.41L4.64 4.46L6.57 4.94L6.09 6.89M9.94 7.86L8 7.38L8.5 5.42L10.42 5.91L9.94 7.86M13.8 8.82L11.87 8.34L12.35 6.39L14.27 6.87L13.8 8.82M17.65 9.79L15.72 9.31L16.2 7.35L18.13 7.84L17.65 9.79M4.66 12.75L3.71 16.66L21.05 21L22 17.1L4.66 12.75M7.8 16.65L5.88 16.16L6.35 14.21L8.28 14.69L7.8 16.65M11.65 17.61L9.73 17.13L10.2 15.18L12.13 15.66L11.65 17.61M15.5 18.58L13.58 18.09L14.06 16.14L16 16.62L15.5 18.58M19.36 19.54L17.43 19.06L17.91 17.11L19.84 17.59L19.36 19.54M6.25 12.11L11 10.2L17.75 11.89L13 13.8L6.25 12.11Z",
  ascensore: "M7,2L11,6H8V10H6V6H3L7,2M17,10L13,6H16V2H18V6H21L17,10M7,12H17A2,2 0 0,1 19,14V20A2,2 0 0,1 17,22H7A2,2 0 0,1 5,20V14A2,2 0 0,1 7,12M7,14V20H17V14H7Z",
  chiave_inglese: "M22.7,19L13.6,9.9C14.5,7.6 14,4.9 12.1,3C10.1,1 7.1,0.6 4.7,1.7L9,6L6,9L1.6,4.7C0.4,7.1 0.9,10.1 2.9,12.1C4.8,14 7.5,14.5 9.8,13.6L18.9,22.7C19.3,23.1 19.9,23.1 20.3,22.7L22.6,20.4C23.1,20 23.1,19.3 22.7,19Z",
  info: "M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z",
  attenzione: "M13 14H11V9H13M13 18H11V16H13M1 21H23L12 2L1 21Z",
  ok: "M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z",
  errore: "M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z",
};

const MDI_PAROLE = {
  traliccio: "rete elettrica enel corrente linea",
  contatore_luce: "contatore corrente lettura consumo",
  tachimetro: "velocita misura limite",
  casa_corrente: "casa consumo corrente",
  manopola: "regolazione limite manopola",
  casa: "abitazione home appartamento home",
  stanza: "piantina planimetria camera floorplan",
  letto: "camera dormire notte bed",
  divano: "salotto soggiorno sofa",
  cucina: "posate mangiare pranzo cena silverwareforkknife",
  bagno: "doccia lavarsi shower",
  wc: "gabinetto bagno water toilet",
  scale: "gradini piano stairs",
  chiave: "serratura apri key",
  cassetta_posta: "posta lettere mailbox",
  pacco: "amazon consegna corriere spedizione packagevariantclosed",
  carrello: "spesa negozio cart",
  euro: "soldi costo bolletta prezzo currencyeur",
  calendario: "giorno data appuntamento calendar",
  orologio: "ora tempo clockoutline",
  sveglia: "allarme mattina alarm",
  timer: "conto alla rovescia minuti timeroutline",
  campana: "avviso notifica bell",
  notifica: "avviso suona bellring",
  messaggio: "sms chat messagetext",
  email: "posta mail email",
  chiamata: "telefonata phoneintalk",
  video: "filmato registrazione video",
  cuffie: "audio ascolto headphones",
  radio: "stazione fm radio",
  microfono: "voce assistente registra microphone",
  volume: "audio suono volumehigh",
  play: "riproduci avvia play",
  pausa: "ferma pause",
  stop: "ferma spegni stop",
  gioco: "console videogioco joystick gamepadvariant",
  playstation: "ps5 console sonyplaystation",
  xbox: "console microsoftxbox",
  netflix: "film serie netflix",
  youtube: "video musica youtube",
  spotify: "musica spotify",
  cast: "chromecast trasmetti castconnected",
  antenna: "segnale radio antenna",
  router: "internet rete modem routerwireless",
  server: "nas macchina server",
  chip: "processore scheda chip",
  usb: "chiavetta porta usb",
  spina: "presa corrente powerplug",
  fulmine: "energia potenza watt flash",
  contatore: "consumo lettura counter",
  pannello_solare: "fotovoltaico sole energia solarpower",
  corrente_ac: "inverter alternata currentac",
  corrente_dc: "continua batteria currentdc",
  interruttore: "accendi spegni switch toggleswitch",
  regolatore: "dimmer regola cursori tunevariant",
  ombrello: "pioggia meteo umbrella",
  termostato: "clima temperatura thermostat",
  radiatore: "termosifone riscaldamento radiator",
  caldaia: "boiler acqua calda waterboiler",
  pompa: "acqua motore pump",
  irrigazione: "giardino acqua innaffia sprinkler",
  piscina: "acqua nuoto pool",
  fiore: "pianta giardino flower",
  albero: "giardino verde tree",
  erba: "prato giardino grass",
  tosaerba: "prato robot giardino robotmower",
  cane: "animale dog",
  gatto: "animale cat",
  pesce: "acquario animale fish",
  bambino: "bimbo neonato babyface",
  scrivania: "ufficio studio desk",
  libro: "lettura studio bookopenvariant",
  scuola: "studio lezione school",
  lavoro: "ufficio valigetta briefcase",
  palestra: "pesi sport dumbbell",
  corsa: "sport camminata passi run",
  bici: "bicicletta bike",
  moto: "motocicletta scooter motorbike",
  benzina: "carburante distributore gasstation",
  ricarica_auto: "colonnina elettrica auto evstation",
  parcheggio: "posto auto parking",
  mappa: "cartina posizione map",
  posizione: "gps dove indirizzo mapmarker",
  bussola: "direzione nord compass",
  aereo: "volo viaggio airplane",
  treno: "stazione viaggio train",
  autobus: "fermata viaggio bus",
  valigia: "viaggio vacanza bagsuitcase",
  stella: "preferito star",
  cuore: "preferito salute heart",
  battito: "salute polso heartpulse",
  medicina: "pillola farmaco pill",
  bilancia: "peso scalebathroom",
  sonno: "dormire notte sleep",
  occhio: "guarda visibile eyeoutline",
  lucchetto: "chiuso sicurezza lock",
  lucchetto_aperto: "aperto sicurezza lockopen",
  scudo: "sicurezza allarme protezione shieldhome",
  sirena: "allarme lampeggiante alarmlight",
  cctv: "telecamera sorveglianza cctv",
  sensore_movimento: "presenza pir motionsensor",
  porta_scorrevole: "portafinestra apertura doorsliding",
  cancello: "ingresso automatico gate",
  serranda: "tapparella avvolgibile windowshutter",
  tende: "tendaggi finestra curtains",
  finestra_aperta: "apertura aria windowopen",
  ventilatore: "aria pale fan",
  filtro_aria: "purificatore aria airfilter",
  purificatore: "aria pulita airpurifier",
  umidificatore: "umidita vapore airhumidifier",
  robot_aspirapolvere: "dreame pulizia robotvacuum",
  scopa: "pulizia broom",
  lavatrice_mdi: "bucato panni washingmachine",
  asciugatrice: "bucato asciuga tumbledryer",
  lavastoviglie: "piatti cucina dishwasher",
  fornello: "cucina forno stove",
  microonde: "cucina scalda microwave",
  frigorifero: "freezer congelatore fridge",
  macchina_caffe: "caffe espresso coffeemaker",
  tostapane: "colazione pane toaster",
  bollitore: "the acqua calda kettle",
  mela: "cibo frutta foodapple",
  pizza: "cibo cena pizza",
  vino: "bicchiere cena glasswine",
  birra: "bicchiere beer",
  goccia: "acqua umidita perdita water",
  fuoco: "fiamma caldo incendio fire",
  bombola: "gas metano gascylinder",
  spazzatura: "rifiuti cestino trashcan",
  riciclo: "differenziata rifiuti recycle",
  attrezzi: "strumenti riparazione tools",
  martello: "lavori riparazione hammer",
  cacciavite: "riparazione screwdriver",
  ingranaggio: "impostazioni configura cog",
  robot_mdi: "automazione robot",
  script: "programma comando scripttext",
  scena: "colori scena palette",
  gruppo: "insieme group",
  aggiornamento: "versione nuovo update",
  nuvola_cloud: "internet online cloud",
  wifi_mdi: "rete segnale wifi",
  bluetooth: "collegamento bluetooth",
  zigbee: "rete casa zigbee",
  qr: "codice qrcode",
  stampante_3d: "anycubic stampa printer3d",
  pc_fisso: "computer torre desktoptower",
  portatile: "computer notebook laptop",
  tablet: "schermo tablet",
  tv_mdi: "televisore schermo television",
  telecomando: "comando tv remotetv",
  lampadina_accesa: "luce accesa lightbulbon",
  faretti: "luci binario tracklight",
  lampione: "esterno giardino luce outdoorlamp",
  candela: "luce fiamma candle",
  striscia_led: "led rgb ledstripvariant",
  ascensore: "piano elevator",
  chiave_inglese: "manutenzione wrench",
  info: "informazione dettagli information",
  attenzione: "avviso problema alert",
  ok: "fatto confermato checkcircle",
  errore: "problema guasto closecircle",
};

const MDI_TINTA = {
  traliccio: "#7aa7ff",
  contatore_luce: "#4fe0c8",
  tachimetro: "#7aa7ff",
  casa_corrente: "#ffc046",
  manopola: "#9b6bff",
  casa: "#9b6bff",
  stanza: "#9b6bff",
  letto: "#9b6bff",
  divano: "#9b6bff",
  cucina: "#ff9a3c",
  bagno: "#4fb8ff",
  wc: "#4fb8ff",
  scale: "#9b6bff",
  chiave: "#7aa7ff",
  cassetta_posta: "#cddc39",
  pacco: "#cddc39",
  carrello: "#cddc39",
  euro: "#ffc046",
  calendario: "#ffcf5c",
  orologio: "#ffcf5c",
  sveglia: "#ffcf5c",
  timer: "#ffcf5c",
  campana: "#ffcf5c",
  notifica: "#ffcf5c",
  messaggio: "#ffcf5c",
  email: "#ffcf5c",
  chiamata: "#ffcf5c",
  video: "#ff9ec7",
  cuffie: "#ff9ec7",
  radio: "#ff9ec7",
  microfono: "#ff9ec7",
  volume: "#ff9ec7",
  play: "#ff9ec7",
  pausa: "#ff9ec7",
  stop: "#ff9ec7",
  gioco: "#ff9ec7",
  playstation: "#ff9ec7",
  xbox: "#ff9ec7",
  netflix: "#ff9ec7",
  youtube: "#ff9ec7",
  spotify: "#ff9ec7",
  cast: "#7aa7ff",
  antenna: "#7aa7ff",
  router: "#7aa7ff",
  server: "#7aa7ff",
  chip: "#7aa7ff",
  usb: "#7aa7ff",
  spina: "#ffc046",
  fulmine: "#ffc046",
  contatore: "#ffc046",
  pannello_solare: "#ffc046",
  corrente_ac: "#ffc046",
  corrente_dc: "#ffc046",
  interruttore: "#ffc046",
  regolatore: "#ffc046",
  ombrello: "#cddc39",
  termostato: "#cddc39",
  radiatore: "#cddc39",
  caldaia: "#4fb8ff",
  pompa: "#4fb8ff",
  irrigazione: "#4fb8ff",
  piscina: "#4fb8ff",
  fiore: "#3fd98a",
  albero: "#3fd98a",
  erba: "#3fd98a",
  tosaerba: "#3fd98a",
  cane: "#cddc39",
  gatto: "#cddc39",
  pesce: "#cddc39",
  bambino: "#ffcf5c",
  scrivania: "#ffcf5c",
  libro: "#ffcf5c",
  scuola: "#ffcf5c",
  lavoro: "#ffcf5c",
  palestra: "#4fe0c8",
  corsa: "#4fe0c8",
  bici: "#4fe0c8",
  moto: "#4fe0c8",
  benzina: "#ff9a3c",
  ricarica_auto: "#4fe0c8",
  parcheggio: "#4fe0c8",
  mappa: "#4fe0c8",
  posizione: "#4fe0c8",
  bussola: "#4fe0c8",
  aereo: "#4fe0c8",
  treno: "#4fe0c8",
  autobus: "#4fe0c8",
  valigia: "#4fe0c8",
  stella: "#ffc046",
  cuore: "#ff5f5f",
  battito: "#ff5f5f",
  medicina: "#ff5f5f",
  bilancia: "#4fe0c8",
  sonno: "#9b6bff",
  occhio: "#ffcf5c",
  lucchetto: "#ff5f5f",
  lucchetto_aperto: "#cddc39",
  scudo: "#ff5f5f",
  sirena: "#ff5f5f",
  cctv: "#ff5f5f",
  sensore_movimento: "#ff5f5f",
  porta_scorrevole: "#9b6bff",
  cancello: "#9b6bff",
  serranda: "#9b6bff",
  tende: "#9b6bff",
  finestra_aperta: "#9b6bff",
  ventilatore: "#4fb8ff",
  filtro_aria: "#4fb8ff",
  purificatore: "#4fb8ff",
  umidificatore: "#4fb8ff",
  robot_aspirapolvere: "#cddc39",
  scopa: "#4fb8ff",
  lavatrice_mdi: "#4fb8ff",
  asciugatrice: "#4fb8ff",
  lavastoviglie: "#4fb8ff",
  fornello: "#ff9a3c",
  microonde: "#ff9a3c",
  frigorifero: "#cddc39",
  macchina_caffe: "#ff9a3c",
  tostapane: "#ff9a3c",
  bollitore: "#4fb8ff",
  mela: "#3fd98a",
  pizza: "#ff9a3c",
  vino: "#cddc39",
  birra: "#ff9a3c",
  goccia: "#4fb8ff",
  fuoco: "#ff9a3c",
  bombola: "#ff9a3c",
  spazzatura: "#3fd98a",
  riciclo: "#3fd98a",
  attrezzi: "#7aa7ff",
  martello: "#7aa7ff",
  cacciavite: "#7aa7ff",
  ingranaggio: "#7aa7ff",
  robot_mdi: "#7aa7ff",
  script: "#7aa7ff",
  scena: "#7aa7ff",
  gruppo: "#7aa7ff",
  aggiornamento: "#7aa7ff",
  nuvola_cloud: "#4fb8ff",
  wifi_mdi: "#7aa7ff",
  bluetooth: "#7aa7ff",
  zigbee: "#7aa7ff",
  qr: "#7aa7ff",
  stampante_3d: "#7aa7ff",
  pc_fisso: "#7aa7ff",
  portatile: "#7aa7ff",
  tablet: "#7aa7ff",
  tv_mdi: "#7aa7ff",
  telecomando: "#7aa7ff",
  lampadina_accesa: "#ffc046",
  faretti: "#ffc046",
  lampione: "#ffc046",
  candela: "#ffc046",
  striscia_led: "#ffc046",
  ascensore: "#9b6bff",
  chiave_inglese: "#7aa7ff",
  info: "#7aa7ff",
  attenzione: "#ff5f5f",
  ok: "#7aa7ff",
  errore: "#ff5f5f",
};

// Le icone di Home Assistant vestite come le nostre: dischetto di vetro,
// alone che respira e sagoma con la sfumatura chiaro->colore. `tinta`
// serve nell'editor, dove il colore della casella non c'e'.
let contaMdi = 0;
function disegnoMdi(nome, tinta) {
  const d = MDI[nome];
  if (!d) return null;
  const c = MDI_TINTA[nome] || tinta || "#8ab4f8";
  contaMdi += 1;
  const id = "mdig" + contaMdi;
  // grande come le nostre (riempie il riquadro), col suo colore e la
  // sfumatura dall'alto: niente pastiglia, se no il simbolo resta piccolo
  return '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="0.35" y2="1">'
    + '<stop offset="0" stop-color="#ffffff" stop-opacity=".96"/>'
    + '<stop offset=".55" stop-color="' + c + '"/>'
    + '<stop offset="1" stop-color="' + c + '" stop-opacity=".82"/></linearGradient></defs>'
    + '<g class="an glow"><g transform="translate(6.4 6.4) scale(2.13)">'
    + '<path d="' + d + '" fill="' + c + '" opacity=".38"'
    + ' transform="translate(0 1.2)"/></g></g>'
    + '<g transform="translate(6.4 6.4) scale(2.13)">'
    + '<path d="' + d + '" fill="url(#' + id + ')"/></g>';
}

const NOMI_ICONE = Object.keys(ICONE);
// se un disegno nostro ha lo stesso nome, quello di Home Assistant non si
// mostra nel catalogo (verrebbe doppio): il nostro vince comunque
const NOMI_MDI = Object.keys(MDI).filter((n) => !ICONE[n]);

// che icona ci vuole per il tempo che fa
const ICONA_METEO = {
  sunny: "sole", "clear-night": "luna", partlycloudy: "sole_nuvole", cloudy: "nuvola",
  rainy: "pioggia", pouring: "pioggia", lightning: "temporale",
  "lightning-rainy": "temporale", snowy: "neve", "snowy-rainy": "neve", hail: "neve",
  fog: "nebbia", windy: "vento", "windy-variant": "vento", exceptional: "sole",
};

const STILE = `
:host { display: block; container-type: inline-size; height: 100%; }
ha-card {
  position: relative; overflow: hidden; cursor: pointer;
  /* mai piu' alta di quanto la plancia le concede: la misura la decidi tu
     dal "Layout" della scheda, il contenuto si stringe da solo */
  height: 100%; max-height: 100%; box-sizing: border-box;
  padding: 14px; border-radius: var(--casa-radius, 18px);
  background: var(--card-bg, linear-gradient(160deg,#111a27 0%,#0d1420 100%));
  border: 1px solid var(--casa-border, #1e2b3d);
  display: flex; flex-direction: column; gap: 10px;
  min-height: var(--casa-min-height, 116px);
  transition: border-color .3s ease, box-shadow .3s ease, transform .12s ease;
}
ha-card:active { transform: scale(.985); }
ha-card:focus-visible { outline: 2px solid var(--c); outline-offset: 2px; }
:host([acceso]) ha-card {
  border-color: var(--bordo, var(--c));
  box-shadow: 0 0 0 1px var(--alone1, transparent),
              0 14px 38px var(--alone2, transparent);
}
ha-card::after {
  content: ""; position: absolute; inset: auto -30% -60% -30%; height: 70%;
  background: radial-gradient(50% 100% at 50% 100%, var(--velo, transparent), transparent 70%);
  opacity: 0; transition: opacity .35s ease; pointer-events: none;
}
:host([acceso]) ha-card::after { opacity: 1; }
.testa { display: flex; align-items: flex-start; gap: 8px; }
.nome { font-size: 13.5px; font-weight: 600; line-height: 1.25;
  color: var(--testo, var(--primary-text-color, #eaf1fb)); }
.sotto {
  font-size: 11.5px; color: var(--testo2, var(--secondary-text-color, #6d8099)); margin-top: 2px;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
  overflow: hidden; line-height: 1.3;
}
:host([acceso]) .sotto {
  color: var(--testo2, color-mix(in srgb, var(--c) 32%, var(--secondary-text-color, #a9b6c7))); }
.riga { display: flex; align-items: flex-end; gap: 10px; margin-top: auto; }
.iconaFoto { width: auto; height: 60px; aspect-ratio: 1; max-height: 100%;
  flex: 0 1 auto; object-fit: contain;
  filter: grayscale(.8) brightness(.62); transition: filter .35s ease; }
:host([acceso]) .iconaFoto { filter: drop-shadow(0 0 9px var(--alone2, transparent)); }
.iconaFoto[hidden] { display: none !important; }
:host([grande]) .iconaFoto { width: auto; height: 92px; }
/* 100% = grande quanto il riquadro che le diamo, cosi' segue tutte le
   disposizioni senza doverle riscrivere una per una */
.iconaHa { --mdc-icon-size: 100%; width: auto; height: 60px; aspect-ratio: 1;
  max-height: 100%; flex: 0 1 auto;
  display: grid; place-items: center; color: var(--c);
  filter: grayscale(.8) brightness(.62); transition: filter .35s ease; }
:host([acceso]) .iconaHa { filter: drop-shadow(0 0 10px var(--alone2, transparent)); }
.iconaHa[hidden] { display: none !important; }
:host([grande]) .iconaHa { width: auto; height: 92px; }
.misuratore, .misuratore * { animation: none !important; transition: none !important; }
svg.icona { overflow: visible; width: auto; height: var(--alt-icona, 60px);
  aspect-ratio: 1; max-height: 100%; min-height: 18px; flex: 0 1 auto;
  filter: grayscale(.8) brightness(.62); transition: filter .35s ease; }
:host([acceso]) svg.icona { filter: none; }
img.ritratto {
  width: auto; height: var(--alt-icona, 54px); aspect-ratio: 1; max-height: 100%;
  flex: 0 1 auto;
  border-radius: 50%; object-fit: cover;
  border: 2px solid rgba(255,255,255,.14); background: rgba(255,255,255,.06);
  filter: grayscale(.75) brightness(.7); transition: filter .35s ease, border-color .35s ease;
}
:host([acceso]) img.ritratto { filter: none; border-color: var(--bordo, var(--c)); }
:host([grande]) img.ritratto { width: 82px; height: 82px; flex: 0 0 82px; border-width: 3px; }
.meteo {
  margin-left: auto; text-align: right; display: flex; flex-direction: column;
  align-items: flex-end; gap: 2px; flex: none;
  cursor: pointer; border-radius: 10px; padding: 2px 4px;
  transition: background .2s ease;
}
.meteo:hover { background: rgba(255,255,255,.09); }
.meteo:focus-visible { outline: 2px solid var(--c); outline-offset: 1px; }
.meteo .gradi {
  font-family: inherit; font-size: 21px; font-weight: 700; line-height: 1;
  letter-spacing: -.02em; color: var(--primary-text-color, #eaf1fb);
  font-variant-numeric: tabular-nums; opacity: .92;
}
.meteo .gradi small { font-size: .5em; font-weight: 600; opacity: .7; margin-left: 1px; }
.meteo .cond {
  font-size: 10.5px; color: var(--secondary-text-color, #8b98ab);
  display: flex; align-items: center; gap: 4px; white-space: nowrap;
}
:host([grande]) .meteo .gradi { font-size: 26px; }
/* nessun pezzo si gonfia: l'altezza la comanda la plancia */
.testa, .chips, .tempo, .comandi, .cursore, .colori, .extra { flex: none; }
/* la riga dell'icona e' l'unica elastica: se il posto e' poco si stringe
   lei, cosi' le misure in basso non vengono mai tagliate */
.riga { flex: 0 1 auto; min-height: 0; overflow: hidden; }
/* le misure in piu' stanno in alto a destra, accanto al nome: cosi' non
   rubano altezza e la casella resta della misura che le hai dato */
.chips {
  display: flex; flex-wrap: wrap; justify-content: flex-end; align-items: center;
  gap: 4px 6px; margin-left: auto; max-width: 68%; min-width: 0;
}
/* nella casella delle persone l'indirizzo viene prima: le pastiglie
   vanno a capo, sotto al nome, dove c'e' spazio */
:host([disposizione="persona"]) .testa { flex-wrap: wrap; align-items: flex-start; }
:host([disposizione="persona"]) .testi { flex: 1 1 auto; min-width: 0; }
:host([disposizione="persona"]) .meteo { order: 2; }
:host([disposizione="persona"]) .chips {
  order: 3; width: 100%; max-width: 100%;
  justify-content: flex-start; margin: 7px 0 0;
}
.chips:empty { display: none; }
/* casella bassa: si stringe tutto invece di tagliare qualcosa */
/* anche nella casella bassa la riga dell'icona sta IN FONDO: con
   "margin-top: 6px" restava appesa sotto al nome e sembrava che l'icona
   salisse ogni volta che si toglieva una misura */
:host([compatta]) .riga { margin-top: auto; }
:host([compatta]) svg.icona, :host([compatta]) img.ritratto,
:host([compatta]) .iconaHa, :host([compatta]) .iconaFoto {
  /* niente minimo alto: in una casella bassa e piena (nome su due righe +
     tasti) il disegno deve poter rimpicciolire, se no esce dal riquadro */
  height: var(--alt-icona, 46px); min-height: 18px; }
/* Nella casella bassa si stringe anche la cornice: riempimento e spazi
   fra i pezzi. Con 14px di bordo e 10px fra un pezzo e l'altro, in una
   casella da due righe restavano 21px per il disegno - e sembrava sparito.
   Gli spazi li fa la cornice (gap), quindi qui i margini vanno a zero,
   se no si sommano e contano il doppio. */
:host([compatta]) ha-card { padding: 7px 11px; gap: 4px; }
:host([compatta]) .comandi { margin-top: 0; gap: 4px; }
:host([compatta]) .comandi button { width: 30px; height: 28px; font-size: 13px; }
:host([compatta]) .comandi button.grosso { width: 38px; height: 30px; }
:host([compatta]) .cursore { margin-top: 0; }
:host([compatta]) .colori { margin-top: 0; }
:host([compatta]) .colori .scambio { width: 30px; height: 30px; }
:host([compatta]) .colori .scambio svg { width: 17px; height: 17px; }
:host([compatta]) .valore { font-size: 17px; }
/* Nella casella bassa le misure si stringono per bene: ogni riga di
   pastiglie che si risparmia e' spazio che va all'icona. */
:host([compatta]) .chips .metrica { padding: 0 4px 0 3px; gap: 2px; }
:host([compatta]) .metrica .simbolo { font-size: 10.5px; }
:host([compatta]) .metrica .num { font-size: 10px; }
:host([compatta]) .chips { gap: 2px 3px; max-width: 76%; }
:host([compatta]) .sotto { -webkit-line-clamp: 1; }
/* casella bassa e nome lungo: il nome sta su una riga sola, con i puntini.
   Lo spazio che si risparmia va al disegno, che cosi' non sparisce mai. */
:host([nomecorto]) .nome {
  display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical;
  overflow: hidden; }
.metrica {
  display: flex; flex-direction: row; align-items: center; gap: 4px; min-width: 0;
  cursor: pointer; border-radius: 99px; padding: 2px 7px 2px 5px;
  transition: background .2s ease;
}
/* niente pastiglia sotto alle scritte: si vede solo passandoci sopra */
.metrica:hover { background: rgba(255,255,255,.08); }
.metrica:focus-visible { outline: 2px solid var(--c); outline-offset: 1px; }
.metrica .simbolo { font-size: 12.5px; line-height: 1; opacity: .95; }
.metrica .num {
  font-size: 11.5px; font-weight: 700; line-height: 1.2; font-variant-numeric: tabular-nums;
  color: var(--secondary-text-color, #9fb0c6); white-space: nowrap;
}
:host([acceso]) .metrica .num { color: var(--c); }
/* una misura puo' avere il colore che vuole lui, staccato dagli effetti */
.metrica.suacolore .num, :host([acceso]) .metrica.suacolore .num,
.metrica.suacolore .eti, :host([acceso]) .metrica.suacolore .eti {
  color: var(--tinta-mia);
}
.metrica .eti { display: none; font-size: 9.5px; font-weight: 700;
  letter-spacing: .05em; text-transform: uppercase; white-space: nowrap;
  color: var(--secondary-text-color, #9fb0c6); opacity: .8; }
.metrica.connome .eti { display: inline; }
:host([acceso]) .metrica.connome .eti { opacity: .95; }
:host([compatta]) .metrica .eti { font-size: 8px; letter-spacing: .02em; }
.cursore { margin-top: 10px; display: flex; align-items: center; gap: 10px; }
.cursore .muto { appearance: none; border: none; cursor: pointer; flex: none; padding: 0;
  width: 30px; height: 30px; border-radius: 50%; display: grid; place-items: center;
  background: rgba(12,18,28,.55); color: var(--primary-text-color, #eaf1fb); }
.cursore .muto svg { width: 17px; height: 17px; fill: currentColor; pointer-events: none; }
.cursore .muto[hidden] { display: none !important; }
.cursore .muto[zitto] { background: color-mix(in srgb, var(--c) 34%, rgba(12,18,28,.6));
  color: #fff; }
.cursore[hidden] { display: none !important; }
.cursore input, .pannello .vol {
  flex: 1; -webkit-appearance: none; appearance: none; height: 6px; border-radius: 99px;
  cursor: pointer; background: rgba(10,15,24,.55); outline: none;
  box-shadow: 0 0 0 1px rgba(255,255,255,.10);
  background-image: linear-gradient(var(--c), var(--c));
  background-size: var(--riempito, 0%) 100%; background-repeat: no-repeat;
}
.cursore input::-webkit-slider-thumb, .pannello .vol::-webkit-slider-thumb {
  -webkit-appearance: none; width: 15px; height: 15px; border-radius: 50%;
  background: #fff; border: 2px solid var(--c); cursor: pointer;
  box-shadow: 0 1px 4px rgba(0,0,0,.5);
}
.cursore input::-moz-range-thumb, .pannello .vol::-moz-range-thumb {
  width: 13px; height: 13px; border-radius: 50%; background: #fff;
  border: 2px solid var(--c); cursor: pointer;
}
.cursore .quanto { font-size: 11.5px; min-width: 34px; text-align: right;
  color: var(--secondary-text-color, #9fb0c6); font-variant-numeric: tabular-nums; }
.valore.parola { font-size: 14.5px; font-weight: 600; letter-spacing: 0; }
:host([grande]) .valore.parola { font-size: 17px; }
.valore {
  margin-left: auto; font-size: 20px; font-weight: 700; line-height: 1;
  letter-spacing: -.02em; font-variant-numeric: tabular-nums;
  color: var(--testo-val, var(--testo2, var(--disabled-text-color, #7b8ba3)));
}
:host([acceso]) .valore { color: var(--testo-val, var(--testo, var(--c))); }
/* valore vecchio, perche' il sensore adesso non risponde */
:host([assente]) .valore { opacity: .45; }
:host([assente]) .valore::after { content: " ·"; }
:host([grande]) svg.icona { width: auto; height: 92px; }
:host([grande]) .valore { font-size: 27px; }
:host([grande]) ha-card { min-height: 152px; }
:host([grande]) .nome { font-size: 15px; }

@keyframes casa-rota { to { transform: rotate(360deg); } }
@keyframes casa-scuoti { 0%,100% { transform: translateY(0); } 50% { transform: translateY(1.5px); } }
@keyframes casa-scintilla { 0%,72%,100% { opacity: 0; } 78% { opacity: 1; } 84% { opacity: .25; } 90% { opacity: .9; } }
@keyframes casa-riempi { 0% { transform: scaleX(.35); } 100% { transform: scaleX(.72); } }
@keyframes casa-bolt { 0%,100% { opacity: .8; transform: scale(.99); } 50% { opacity: 1; transform: scale(1.02); } }
@keyframes casa-glow { 0%,100% { opacity: .72; } 50% { opacity: .95; } }
@keyframes casa-eq { 0%,100% { transform: scaleY(1); } 45% { transform: scaleY(.3); } }
@keyframes casa-sale { 0% { transform: translateY(4px); opacity: 0; } 40% { opacity: .9; } 100% { transform: translateY(-11px); opacity: 0; } }
@keyframes casa-rec { 0%,100% { opacity: 1; } 50% { opacity: .15; } }
@keyframes casa-onda { 0%,100% { transform: rotate(-4deg); } 50% { transform: rotate(4deg); } }
@keyframes casa-eco { 0% { transform: scale(.6); opacity: .9; } 100% { transform: scale(1.5); opacity: 0; } }
svg .rotafast { transform-origin: 32px 29px; animation: casa-rota calc(.55s / var(--vel, 1)) linear infinite; }
svg .rotalenta { transform-origin: 32px 32px; animation: casa-rota calc(9s / var(--vel, 1)) linear infinite; }
svg .rotamedia { transform-origin: 32px 38px; animation: casa-rota calc(2.4s / var(--vel, 1)) linear infinite; }
svg .drum { transform-origin: 32px 37px; animation: casa-rota calc(3.4s / var(--vel, 1)) linear infinite; }
svg .shake { animation: casa-scuoti calc(.45s / var(--vel, 1)) ease-in-out infinite; }
svg .spark { animation: casa-scintilla calc(2.2s / var(--vel, 1)) ease-in-out infinite; }
svg .riempi { transform-origin: 11px 32px; animation: casa-riempi calc(2.4s / var(--vel, 1)) ease-in-out infinite alternate; }
svg .sale { transform-origin: 30px 46px; animation: casa-sale calc(3s / var(--vel, 1)) ease-out infinite; }
svg .bolt { transform-origin: 32px 32px; animation: casa-bolt calc(3.4s / var(--vel, 1)) ease-in-out infinite; }
svg .glow { animation: casa-glow calc(5s / var(--vel, 1)) ease-in-out infinite; }
/* niente alone tondo dietro al disegno: si illumina gia' il disegno stesso,
   il cerchio era solo un cerchio appiccicato dietro */
svg .alone { display: none; }
@keyframes casa-caricafulmine { 0%, 100% { opacity: .82; } 50% { opacity: 1; } }
svg .caricafulmine { animation: casa-caricafulmine calc(2.6s / var(--vel, 1)) ease-in-out infinite; }
/* la tapparella che si muove davvero: le stecche scorrono nel vano */
@keyframes casa-tappagiu { from { transform: translateY(0); } to { transform: translateY(6.6px); } }
@keyframes casa-tappasu { from { transform: translateY(0); } to { transform: translateY(-6.6px); } }
svg .tappagiu { animation: casa-tappagiu calc(.9s / var(--vel, 1)) linear infinite; }
svg .tappasu { animation: casa-tappasu calc(.9s / var(--vel, 1)) linear infinite; }
svg .bar { transform-origin: 50% 100%; animation: casa-eq calc(.9s / var(--vel, 1)) ease-in-out infinite; }
svg .b2 { animation-delay: .15s; } svg .b3 { animation-delay: .3s; } svg .b4 { animation-delay: .45s; }
svg .calore { animation: casa-sale calc(2.2s / var(--vel, 1)) ease-out infinite; }
svg .rec { animation: casa-rec calc(1.4s / var(--vel, 1)) steps(1,end) infinite; }
svg .ondeggia { transform-origin: 32px 46px; animation: casa-onda calc(3s / var(--vel, 1)) ease-in-out infinite; }
svg .eco { transform-origin: 32px 32px; animation: casa-eco calc(2s / var(--vel, 1)) ease-out infinite; }
@keyframes casa-gocciaicona { 0% { transform: translateY(-4px); opacity: 0; } 20% { opacity: 1; }
  100% { transform: translateY(11px); opacity: 0; } }
svg .goccia { animation: casa-gocciaicona calc(1.5s / var(--vel, 1)) linear infinite; }
@keyframes casa-fioccoicona { 0% { transform: translateY(-3px) rotate(0deg); opacity: 0; }
  20% { opacity: 1; } 100% { transform: translateY(10px) rotate(160deg); opacity: 0; } }
svg .fiocco { transform-origin: center; animation: casa-fioccoicona calc(2.8s / var(--vel, 1)) linear infinite; }
@keyframes casa-nuvolina { 0%, 100% { transform: translateX(-1.6px); } 50% { transform: translateX(1.6px); } }
svg .nuvolina { animation: casa-nuvolina calc(4.5s / var(--vel, 1)) ease-in-out infinite; }
svg .g2 { animation-delay: .5s; } svg .g3 { animation-delay: 1s; }

/* acceso ma fermo (un termosifone che non sta scaldando): tinta si',
   alone no, e l'icona sta ferma */
:host([acceso][fermo]) ha-card { box-shadow: 0 0 0 1px var(--alone1, transparent); }
:host([acceso][fermo]) ha-card::after { opacity: .35; }
:host([fermo]) svg .an { animation-play-state: paused; }

/* --- effetti della casella --- */
:host([effetto="nessuno"][acceso]) ha-card { box-shadow: none; }
:host([effetto="nessuno"]) ha-card::after { display: none; }

@keyframes casa-respiro {
  0%, 100% { box-shadow: 0 0 0 1px var(--alone1), 0 10px 26px var(--alone2); }
  50% { box-shadow: 0 0 0 3px var(--alone1), 0 20px 50px var(--alone2); }
}
:host([effetto="pulsa"][acceso]) ha-card { animation: casa-respiro calc(2.8s / var(--vel, 1)) ease-in-out infinite; }

:host([effetto="neon"][acceso]) ha-card {
  border-color: var(--c);
  box-shadow: 0 0 24px var(--alone2), 0 16px 44px var(--alone2);
}
:host([effetto="neon"][acceso]) ha-card::before {
  content: ""; position: absolute; inset: 0; pointer-events: none; border-radius: inherit;
  box-shadow: inset 0 0 24px var(--alone1), inset 0 0 0 1px var(--alone1);
}
:host([effetto="neon"][acceso]) .nome { text-shadow: 0 0 14px var(--alone2); }

:host([effetto="vetro"]) ha-card {
  border-color: rgba(255,255,255,.22);
  box-shadow: 0 12px 34px rgba(0,0,0,.4);
}
:host([effetto="vetro"]) ha-card::before {
  content: ""; position: absolute; inset: 0; pointer-events: none; border-radius: inherit;
  background: linear-gradient(160deg, rgba(255,255,255,.16), rgba(255,255,255,.05));
  backdrop-filter: blur(16px) saturate(1.4); -webkit-backdrop-filter: blur(16px) saturate(1.4);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.25);
}

@keyframes casa-scia {
  0% { transform: translateX(-110%); }
  55%, 100% { transform: translateX(110%); }
}
:host([effetto="scia"][acceso]) ha-card::before {
  content: ""; position: absolute; inset: 0; pointer-events: none;
  background: linear-gradient(100deg, transparent 35%, var(--velo) 50%, transparent 65%);
  animation: casa-scia calc(3.4s / var(--vel, 1)) ease-in-out infinite;
}

@keyframes casa-salita {
  0% { transform: translateY(6px); opacity: 0; }
  30% { opacity: 1; }
  100% { transform: translateY(-8px); opacity: 0; }
}
:host([effetto="fluttua"][acceso]) .iconaHa,
:host([effetto="fluttua"][acceso]) .iconaFoto,
:host([effetto="fluttua"][acceso]) svg.icona,
:host([effetto="fluttua"][acceso]) img.ritratto { animation: casa-salita calc(3.2s / var(--vel, 1)) ease-in-out infinite; }

@media (prefers-reduced-motion: reduce) {
  :host([effetto]) ha-card, :host([effetto]) ha-card::before,
  :host([effetto]) ha-card::after, :host([effetto]) svg.icona {
    animation: none !important;
    transform: none !important;
  }
}

/* "Quando si muove l'icona" vale per tutta la casella: se dice di no,
   si fermano anche gli effetti, non solo l'icona */
:host(:not([anima])) ha-card,
:host(:not([anima])) ha-card::before,
:host(:not([anima])) ha-card::after,
:host(:not([anima])) img.ritratto,
:host(:not([anima])) .cielo * { animation: none !important; }

/* --- alone grande e sfocato dietro la casella --- */
@keyframes casa-respiro-lento { 0%,100% { opacity: .55; } 50% { opacity: 1; } }
:host([effetto="bagliore"][acceso]) ha-card {
  box-shadow: 0 0 44px 6px var(--alone2), 0 0 0 1px var(--alone1);
  animation: casa-respiro-lento calc(4s / var(--vel, 1)) ease-in-out infinite;
}

/* --- luce che gira lungo il bordo --- */
@keyframes casa-gira { to { transform: rotate(360deg); } }
:host([effetto="bordo"][acceso]) ha-card::before {
  content: ""; position: absolute; inset: -60%; pointer-events: none; z-index: 1;
  background: conic-gradient(transparent 0 62%, var(--c) 80%, transparent 100%);
  opacity: .7; animation: casa-gira calc(4s / var(--vel, 1)) linear infinite;
  filter: blur(2px);
}
:host([effetto="bordo"][acceso]) .testa,
:host([effetto="bordo"][acceso]) .riga { position: relative; z-index: 1; }

/* --- sfondo tinto del colore --- */
:host([effetto="sfondo"][acceso]) ha-card::before {
  content: ""; position: absolute; inset: 0; pointer-events: none; border-radius: inherit;
  background: linear-gradient(155deg, var(--alone2), var(--velo) 45%, transparent 85%);
}

/* --- sfondo che si muove piano --- */
@keyframes casa-sfondo { 0% { background-position: 0% 50%; } 100% { background-position: 100% 50%; } }
:host([effetto="sfondo_mosso"][acceso]) ha-card::before {
  content: ""; position: absolute; inset: 0; pointer-events: none; border-radius: inherit;
  background: linear-gradient(110deg, transparent, var(--velo) 25%, transparent 50%,
              var(--velo) 75%, transparent);
  background-size: 320% 100%;
  animation: casa-sfondo calc(7s / var(--vel, 1)) linear infinite alternate;
}

/* --- onda che sale dal basso --- */
@keyframes casa-onda-su {
  0% { transform: translateY(30%); opacity: .25; }
  50% { transform: translateY(-6%); opacity: 1; }
  100% { transform: translateY(30%); opacity: .25; }
}
:host([effetto="onda"][acceso]) ha-card::after {
  animation: casa-onda-su calc(3.6s / var(--vel, 1)) ease-in-out infinite;
}

/* --- battito --- */
@keyframes casa-battito {
  0%, 62%, 100% { transform: scale(1); }
  8% { transform: scale(1.035); }
  16% { transform: scale(1); }
  24% { transform: scale(1.022); }
}
:host([effetto="battito"][acceso]) ha-card { animation: casa-battito calc(2.4s / var(--vel, 1)) ease-in-out infinite; }

/* --- icona che pulsa --- */
@keyframes casa-icona-pulsa {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.12); }
}
:host([effetto="icona_pulsa"][acceso]) .iconaHa,
:host([effetto="icona_pulsa"][acceso]) .iconaFoto,
:host([effetto="icona_pulsa"][acceso]) svg.icona,
:host([effetto="icona_pulsa"][acceso]) img.ritratto {
  animation: casa-icona-pulsa calc(2.2s / var(--vel, 1)) ease-in-out infinite;
}

/* --- spia lampeggiante nell'angolo --- */
@keyframes casa-spia { 0%, 100% { opacity: 1; box-shadow: 0 0 8px var(--c); } 50% { opacity: .2; box-shadow: none; } }
:host([effetto="spia"][acceso]) ha-card::before {
  content: ""; position: absolute; top: 12px; right: 12px; width: 8px; height: 8px;
  border-radius: 50%; background: var(--c); pointer-events: none;
  animation: casa-spia calc(1.6s / var(--vel, 1)) ease-in-out infinite;
}

/* --- doppio bordo --- */
:host([effetto="doppio"][acceso]) ha-card {
  box-shadow: 0 0 0 1px var(--c), 0 0 0 5px var(--alone1), 0 12px 32px var(--alone2);
}

/* --- incavo, come premuta dentro --- */
:host([effetto="incavo"][acceso]:not([sfondo-foto])) ha-card {
  background: linear-gradient(160deg, #0b111b 0%, #0e1622 100%);
}
:host([effetto="incavo"][acceso]) ha-card::before {
  content: ""; position: absolute; inset: 0; pointer-events: none; border-radius: inherit;
  box-shadow: inset 0 6px 18px rgba(0,0,0,.75), inset 0 -3px 0 var(--alone1),
              inset 0 0 0 1px var(--alone1);
}

/* --- reazioni al passaggio del dito o del mouse --- */
@keyframes casa-sbuffo {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.045); }
}
:host([effetto="ingrandisce"]) ha-card { transition: transform .25s ease, box-shadow .3s ease; }
:host([effetto="ingrandisce"]) ha-card:hover,
:host([effetto="ingrandisce"]) ha-card:active { transform: scale(1.05); }
:host([effetto="ingrandisce"][acceso]) ha-card {
  animation: casa-sbuffo calc(3.4s / var(--vel, 1)) ease-in-out infinite;
}
@keyframes casa-dondolo {
  0%, 100% { transform: perspective(700px) rotateY(-3deg); }
  50% { transform: perspective(700px) rotateY(3deg); }
}
:host([effetto="inclina"]) ha-card { transition: transform .3s ease, box-shadow .3s ease; }
:host([effetto="inclina"]) ha-card:hover,
:host([effetto="inclina"]) ha-card:active {
  transform: perspective(700px) rotateX(6deg) rotateY(-5deg) translateY(-3px);
}
:host([effetto="inclina"][acceso]) ha-card {
  animation: casa-dondolo calc(5s / var(--vel, 1)) ease-in-out infinite;
}

/* --- lampeggio, per le cose che devono farsi notare --- */
@keyframes casa-lampeggio { 0%, 100% { opacity: 1; } 50% { opacity: .45; } }
:host([effetto="lampeggio"][acceso]) ha-card {
  animation: casa-lampeggio calc(1.4s / var(--vel, 1)) ease-in-out infinite;
}

/* la foto di sfondo ha la precedenza su qualsiasi effetto */
:host([sfondo-foto]) ha-card { background: var(--card-bg) !important; }

/* --- disposizione "persona": foto a sinistra, testo accanto --- */
:host([disposizione="persona"]) ha-card {
  display: grid; grid-template-columns: auto 1fr;
  grid-template-areas: "foto testo" "misure misure" "cursore cursore";
  align-items: center; column-gap: 13px; row-gap: 0;
}
:host([disposizione="persona"]) .riga { display: contents; }
:host([disposizione="persona"]) .testa { grid-area: testo; align-items: flex-start; }
:host([disposizione="persona"]) .testi { min-width: 0; }
.testa .testi { min-width: 0; flex: 1 1 auto; }
:host([disposizione="persona"]) svg.icona,
:host([disposizione="persona"]) .iconaHa,
:host([disposizione="persona"]) .iconaFoto,
:host([disposizione="persona"]) img.ritratto { grid-area: foto; width: 54px; height: 54px; flex: none; }
/* l'anello attorno alla foto dice dove si trova: casa, fuori, un'altra zona */
:host([dove]) img.ritratto {
  border: 2.5px solid var(--zona, var(--c));
  box-shadow: 0 0 0 2px rgba(0,0,0,.25), 0 0 14px var(--zona, var(--c));
}
.sotto .quando { display: block; margin-top: 1px; font-size: 10.5px;
  color: var(--disabled-text-color, #7b8ba3); }
:host([disposizione="persona"][grande]) .iconaHa,
:host([disposizione="persona"][grande]) .iconaFoto,
:host([disposizione="persona"][grande]) svg.icona,
:host([disposizione="persona"][grande]) img.ritratto { width: 66px; height: 66px; }
:host([disposizione="persona"]) img.ritratto { border-width: 2px; }
:host([disposizione="persona"]) .valore { display: none; }
:host([disposizione="persona"]) .cursore { grid-area: cursore; }
:host([disposizione="persona"]) .nome { font-size: 15px; }
:host([disposizione="persona"]) .sotto { -webkit-line-clamp: 3; }
.sotto .stato { color: var(--testo, var(--c)); font-weight: 600; }
:host(:not([acceso])) .sotto .stato { color: var(--secondary-text-color, #8b98ab); }
.sotto .via { display: block; margin-top: 2px; }

/* --- la copertina del disco come sfondo sfocato --- */
.copertina {
  position: absolute; inset: -14%; z-index: 0; pointer-events: none;
  background-size: cover; background-position: center;
  filter: blur(var(--sfoca, 8px)) saturate(1.2) brightness(var(--luce-cop, .62));
  transform: scale(1.04);
  transition: background-image .5s ease;
}
.copertina[hidden] { display: none !important; }
/* gli effetti sono disegnati con ::before e ::after: devono restare
   sopra la copertina (i contenuti, che stanno a z-index 1 e vengono
   dopo nel documento, restano comunque sopra tutti e due) */
ha-card::before, ha-card::after { z-index: 1; }

/* --- il meteo come sfondo --- */
.cielo {
  position: absolute; inset: 0; overflow: hidden; pointer-events: none; z-index: 0;
  opacity: var(--forza-cielo, .6);
}
.cielo[hidden] { display: none; }
.cielo::after {
  content: ""; position: absolute; inset: 0; pointer-events: none;
  background: radial-gradient(130% 100% at 50% -12%, rgba(0,0,0,0) 48%, rgba(0,0,0,.30) 100%);
}
/* l'icona in grande dietro a tutto: un timbro, non un disegno da guardare */
svg.iconafondo {
  position: absolute; right: 3%; bottom: 5%; top: auto; transform: none;
  height: 74%; width: auto; max-width: 44%; z-index: 0; pointer-events: none;
  opacity: var(--fondoico, .14);
}
svg.iconafondo[hidden] { display: none !important; }
/* se la fotina davanti non c'e', il timbro va in basso a sinistra: prende
   il posto che ha lasciato libero e non copre il numero */
:host([fondo-giu]) svg.iconafondo {
  right: auto; left: 2%; top: auto; bottom: 4%;
  transform: none; height: 72%; max-width: 48%;
}
:host([fondo-giu][compatta]) svg.iconafondo { height: 62%; }
:host([acceso]) svg.iconafondo { opacity: var(--fondoico-acceso, .2); }

/* A mano libera: ogni pezzo sta dove l'ha messo lui. I contenitori
   spariscono dal conto (display:contents) e i pezzi si posano da soli. */
:host([liberi]) ha-card { position: relative; }
/* ATTENZIONE al nome: ".riga" e' la fila con icona e valore, ma anche la
   LINEA del grafico dentro all'<svg>. Senza "ha-card >" facevo sparire pure
   quella, e con "Solo la linea" il grafico non si vedeva piu'. */
:host([liberi]) ha-card > .testa,
:host([liberi]) ha-card > .riga { display: contents; }
:host([liberi]) .testi, :host([liberi]) .chips, :host([liberi]) .valore,
:host([liberi]) svg.icona, :host([liberi]) img.ritratto,
:host([liberi]) .iconaHa, :host([liberi]) .iconaFoto,
:host([liberi]) .cursore, :host([liberi]) .comandi,
:host([liberi]) .tempo, :host([liberi]) .extra,
:host([liberi]) .lettori, :host([liberi]) .colori {
  position: absolute; margin: 0; max-width: 88%;
}
/* mentre sposti i pezzi la barra non deve rispondere al dito, se no ti
   ritrovi a muovere la tapparella invece della barra */
:host([trascinabile]) .cursore, :host([trascinabile]) .comandi,
:host([trascinabile]) .colori, :host([trascinabile]) .tempo,
:host([trascinabile]) .extra, :host([trascinabile]) .lettori {
  pointer-events: none; }
:host([liberi]) .chips { display: contents; }
:host([liberi]) .chips .metrica { position: absolute; max-width: 88%; }
:host([liberi]) .valore { margin-left: 0; }
/* un pezzo spostato non deve spezzarsi: "74 %" resta "74 %" anche se la
   casella vera e' piu' stretta dell'anteprima */
:host([liberi]) .valore, :host([liberi]) .chips .metrica { white-space: nowrap; }
/* La casellina del riquadro sta ferma: e' una copia di servizio, non ha
   senso che consumi per animarsi mentre lui sposta i pezzi. E lo stesso
   vale per TUTTE le caselle disegnate dentro alla finestra delle
   impostazioni (anteprima e contenuto del pop-up): sono li' per farsi
   guardare, non per lavorare - e con una ventina di caselle che si animano
   la finestra si trascina. */
:host([solo-casella]) svg .an, :host([solo-casella]) svg .caricafulmine,
:host([solo-casella]) .metrica, :host([solo-casella]) .cursore,
:host([in-anteprima]) svg .an, :host([in-anteprima]) svg .caricafulmine,
:host([in-anteprima]) .cielo, :host([in-anteprima]) .andamento,
:host([in-anteprima]) .copertina {
  animation-play-state: paused !important; }
:host([in-anteprima]) *, :host([in-anteprima]) *::before,
:host([in-anteprima]) *::after { transition: none !important; }
/* mentre si spostano i pezzi la casella non si seleziona e non scorre */
:host([trascinabile]) ha-card { user-select: none; -webkit-user-select: none;
  touch-action: none; cursor: grab; }
:host([trascinabile]) .cartellino, :host([trascinabile]) .mirino {
  display: none !important; }
/* mentre lo sposti si vede cosa stai prendendo */
:host([liberi]) .inmano { outline: 2px dashed var(--c); outline-offset: 3px;
  border-radius: 6px; cursor: grab; }
/* e il pezzo scelto resta segnato anche dopo che l'hai lasciato: se no non
   si capisce a chi appartiene il quadratino della grandezza */
:host([trascinabile]) .scelto { outline: 1px dashed rgba(240,180,41,.8);
  outline-offset: 2px; border-radius: 5px; }

.testa, .chips, .cursore, svg.icona, img.ritratto, .valore,
.lettori, .extra, .pannello, .tempo, .comandi, .colori,
.iconaHa, .iconaFoto { position: relative; z-index: 1; }

/* --- il cielo del meteo, fatto di pezzi veri --- */

/* nuvole: ogni nuvola e' un gruppo di gobbe che passa piano */
@keyframes casa-nube { from { transform: translateX(-14%); } to { transform: translateX(14%); } }
.cielo .nube { position: absolute; animation: casa-nube 34s ease-in-out infinite alternate; }
.cielo .nube i {
  position: absolute; bottom: 0; border-radius: 50%;
  background: rgba(255,255,255,.30); filter: blur(7px);
}
.cielo .nube.lenta { animation-duration: 52s; animation-direction: alternate-reverse; }
.cielo .nube.scura i { background: rgba(196,208,224,.34); }

/* stelle: grandezze, luminosita' e tempi tutti diversi */
@keyframes casa-luccica {
  0%, 100% { opacity: .25; transform: scale(.85); }
  50% { opacity: 1; transform: scale(1); }
}
.cielo .stella {
  position: absolute; border-radius: 50%; background: #fff;
  animation: casa-luccica 3.4s ease-in-out infinite;
}
@keyframes casa-cadente {
  0% { transform: translate(0, 0) scaleX(1); opacity: 0; }
  4% { opacity: 1; }
  16% { transform: translate(120px, 70px) scaleX(1); opacity: 0; }
  100% { transform: translate(120px, 70px); opacity: 0; }
}
.cielo .cadente {
  position: absolute; width: 44px; height: 1.4px; border-radius: 99px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.95));
  transform-origin: left center; rotate: 30deg;
  animation: casa-cadente 9s linear infinite;
}

/* luna con i crateri */
@keyframes casa-luna { 0%, 100% { filter: brightness(1); } 50% { filter: brightness(1.12); } }
.cielo .luna {
  position: absolute; border-radius: 50%;
  background: radial-gradient(circle at 34% 32%, #fdf7e2, #e8dfc0 62%, #cdc3a2);
  box-shadow: 0 0 22px 6px rgba(240,236,205,.35), inset -6px -4px 0 rgba(0,0,0,.10);
  animation: casa-luna 6s ease-in-out infinite;
}
.cielo .luna i {
  position: absolute; border-radius: 50%; background: rgba(150,142,116,.35);
}

/* sole: nucleo, alone che respira e raggi */
@keyframes casa-alone { 0%, 100% { transform: scale(1); opacity: .55; } 50% { transform: scale(1.08); opacity: .85; } }
@keyframes casa-raggi { to { transform: rotate(360deg); } }
.cielo .sole { position: absolute; }
.cielo .sole .cuore {
  position: absolute; inset: 26%; border-radius: 50%;
  background: radial-gradient(circle at 40% 38%, #fff6d0, #ffd257 55%, #ffab35);
  box-shadow: 0 0 26px 10px rgba(255,196,84,.45);
}
.cielo .sole .alone {
  position: absolute; inset: 0; border-radius: 50%;
  background: radial-gradient(circle, rgba(255,214,132,.55), rgba(255,190,90,0) 66%);
  animation: casa-alone 6s ease-in-out infinite;
}
.cielo .sole .raggi { position: absolute; inset: -14%; animation: casa-raggi 90s linear infinite; }
.cielo .sole .raggi i {
  position: absolute; left: 50%; top: 50%; width: 2px; border-radius: 99px;
  background: linear-gradient(180deg, rgba(255,222,140,.55), rgba(255,222,140,0));
  transform-origin: top center;
}

/* pioggia: gocce inclinate, ognuna con la sua velocita' */
@keyframes casa-goccia {
  0% { transform: translate(0, -20%); opacity: 0; }
  10% { opacity: .9; }
  100% { transform: translate(-16px, 130%); opacity: 0; }
}
.cielo .goccia {
  position: absolute; top: -10%; width: 1.4px; border-radius: 99px;
  background: linear-gradient(180deg, rgba(200,228,255,0), rgba(210,235,255,.95));
  animation: casa-goccia 1.1s linear infinite;
}
.cielo .schizzo {
  position: absolute; bottom: 2px; width: 7px; height: 2px; border-radius: 50%;
  background: rgba(200,228,255,.5); opacity: 0;
  animation: casa-schizzo 1.1s linear infinite;
}
@keyframes casa-schizzo {
  0%, 84% { opacity: 0; transform: scaleX(.4); }
  92% { opacity: .7; transform: scaleX(1); }
  100% { opacity: 0; transform: scaleX(1.4); }
}

/* neve: fiocchi che ondeggiano scendendo */
@keyframes casa-fiocco {
  0% { transform: translate(0, -20%) rotate(0deg); opacity: 0; }
  10% { opacity: 1; }
  50% { transform: translate(10px, 55%) rotate(180deg); }
  100% { transform: translate(-8px, 130%) rotate(360deg); opacity: .1; }
}
.cielo .fiocco {
  position: absolute; top: -10%; border-radius: 50%; background: #fff;
  box-shadow: 0 0 4px rgba(255,255,255,.8);
  animation: casa-fiocco 7s linear infinite;
}

/* temporale */
@keyframes casa-lampo {
  0%, 88%, 100% { opacity: 0; }
  89% { opacity: .85; }
  91% { opacity: .05; }
  93% { opacity: .55; }
  95% { opacity: 0; }
}
.cielo .lampo {
  position: absolute; inset: 0;
  background: radial-gradient(120% 80% at 60% 0, rgba(236,244,255,.95), rgba(236,244,255,0) 70%);
  animation: casa-lampo 7s linear infinite;
}

/* nebbia: bande morbide che scorrono */
@keyframes casa-banda { from { transform: translateX(-12%); } to { transform: translateX(12%); } }
.cielo .banda {
  position: absolute; left: -20%; right: -20%; height: 22%; border-radius: 50%;
  background: linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,.34), rgba(255,255,255,0));
  filter: blur(6px); animation: casa-banda 22s ease-in-out infinite alternate;
}

/* vento */
@keyframes casa-soffio {
  0% { transform: translateX(-30%); opacity: 0; }
  20% { opacity: .7; }
  100% { transform: translateX(130%); opacity: 0; }
}
.cielo .soffio {
  position: absolute; height: 1.6px; border-radius: 99px;
  background: linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,.7), rgba(255,255,255,0));
  animation: casa-soffio 4.5s linear infinite;
}

@media (prefers-reduced-motion: reduce) { .cielo * { animation: none !important; } }

.tempo { margin-top: 10px; display: flex; align-items: center; gap: 9px; }
.tempo[hidden] { display: none !important; }
.tempo .binario { flex: 1; height: 4px; border-radius: 99px; background: rgba(255,255,255,.16); overflow: hidden; }
.tempo .binario i { display: block; height: 100%; border-radius: 99px; background: var(--c);
  transition: width .9s linear; }
.tempo .orologio { font-size: 11px; color: var(--testo2, var(--secondary-text-color, #9fb0c6));
  font-variant-numeric: tabular-nums; white-space: nowrap; }
.comandi { display: flex; align-items: center; justify-content: center; gap: 6px; margin-top: 10px; }
.comandi[hidden] { display: none !important; }
.comandi button {
  appearance: none; cursor: pointer; font: inherit; font-size: 15px;
  width: 34px; height: 34px; border-radius: 50%; line-height: 1;
  /* Il riempimento se lo mette il browser da solo (1px 6px): con la
     casella bassa il tasto scende a 30px e dentro restano 16px per un
     simbolo che ne vuole 19, cosi' sbordava a destra e i simboli si
     vedevano tutti spostati di un pixel e mezzo. Zero, e stanno in mezzo. */
  padding: 0;
  /* vetro: chiaro sopra e scuro sotto, con il filo di luce sul bordo alto.
     Prima erano dischetti piatti e si vedeva */
  background: linear-gradient(180deg, rgba(255,255,255,.13), rgba(8,13,21,.55));
  color: rgba(255,255,255,.94);
  border: 1px solid rgba(255,255,255,.13);
  box-shadow: 0 1px 3px rgba(0,0,0,.38), inset 0 1px 0 rgba(255,255,255,.13);
  backdrop-filter: blur(4px);
  display: grid; place-items: center;
  transition: transform .12s ease, background .2s ease,
    box-shadow .2s ease, border-color .2s ease;
}
.comandi button:hover {
  transform: translateY(-1px);
  border-color: color-mix(in srgb, var(--c) 55%, rgba(255,255,255,.18));
  box-shadow: 0 4px 12px rgba(0,0,0,.42), 0 0 12px var(--alone1, transparent),
    inset 0 1px 0 rgba(255,255,255,.18);
}
.comandi button:active { transform: scale(.92); }
.comandi button:focus-visible { outline: 2px solid var(--c); outline-offset: 2px; }
.comandi button[hidden] { display: none !important; }
/* il tasto che dice cosa sta facendo adesso si accende del colore della
   casella: cosi' si legge lo stato senza cercarlo nella scritta */
.comandi button[acceso] {
  background: linear-gradient(180deg,
    color-mix(in srgb, var(--c) 76%, transparent),
    color-mix(in srgb, var(--c) 44%, rgba(12,18,28,.6)));
  border-color: color-mix(in srgb, var(--c) 62%, transparent);
  color: #fff;
  box-shadow: 0 0 14px var(--alone2, transparent),
    inset 0 1px 0 rgba(255,255,255,.28);
}
.comandi button:disabled { opacity: .35; cursor: default; }
.colori { margin-top: 9px; display: grid; gap: 7px;
  grid-template-columns: 1fr auto; align-items: center; }
.colori input { grid-column: 1; }
.colori .scambio { grid-column: 2; grid-row: 1 / -1; appearance: none; border: none;
  cursor: pointer; width: 38px; height: 38px; border-radius: 50%; padding: 0;
  background: rgba(255,255,255,.10); color: var(--primary-text-color, #eaf1fb);
  display: grid; place-items: center; }
.colori .scambio svg { width: 21px; height: 21px; fill: currentColor; pointer-events: none; }
.colori .scambio[acceso] { background: rgba(255,255,255,.85); color: #0b1220; }
.colori .scambio[hidden] { display: none !important; }
.colori[hidden] { display: none !important; }
.colori input {
  -webkit-appearance: none; appearance: none; width: 100%; height: 12px;
  border-radius: 99px; cursor: pointer; outline: none; border: 1px solid rgba(255,255,255,.12);
}
.colori input.tinta {
  background: linear-gradient(90deg, #ff4d4d, #ffe14d, #4dff77, #4de1ff, #4d6bff, #e14dff, #ff4d4d);
}
.colori input.calore {
  background: linear-gradient(90deg, #ffb163, #ffd7a8, #fff6e8, #eaf2ff, #cfe0ff);
}
.colori input::-webkit-slider-thumb {
  -webkit-appearance: none; width: 16px; height: 16px; border-radius: 50%;
  background: #fff; border: 2px solid rgba(0,0,0,.35); cursor: pointer;
  box-shadow: 0 1px 4px rgba(0,0,0,.5);
}
.colori input::-moz-range-thumb {
  width: 14px; height: 14px; border-radius: 50%; background: #fff;
  border: 2px solid rgba(0,0,0,.35); cursor: pointer;
}
.colori input[hidden] { display: none !important; }
.comandi button svg { width: 19px; height: 19px; fill: currentColor; pointer-events: none; }
.comandi button.grosso svg { width: 23px; height: 23px; }
.comandi button:hover { background: rgba(255,255,255,.18); }
.comandi button.grosso { width: 40px; height: 40px; font-size: 17px;
  background: color-mix(in srgb, var(--c) 55%, rgba(12,18,28,.6));
  border-color: color-mix(in srgb, var(--c) 60%, transparent); }

/* --- disposizione "musica": copertina, titolo, comandi incolonnati --- */
:host([disposizione="musica"]) ha-card {
  display: grid; grid-template-columns: auto 1fr;
  grid-template-areas: "lettori lettori" "art testo" "misure misure" "tempo tempo" "comandi comandi" "cursore cursore" "extra extra";
  column-gap: 13px; row-gap: 0; align-items: center;
}
:host([disposizione="musica"]) .riga { display: contents; }
:host([disposizione="musica"]) .iconaHa,
:host([disposizione="musica"]) .iconaFoto,
:host([disposizione="musica"]) svg.icona,
:host([disposizione="musica"]) img.ritratto {
  grid-area: art; width: 62px; height: 62px; flex: none; border-radius: 12px;
}
:host([disposizione="musica"][grande]) .iconaHa,
:host([disposizione="musica"][grande]) .iconaFoto,
:host([disposizione="musica"][grande]) svg.icona,
:host([disposizione="musica"][grande]) img.ritratto { width: 78px; height: 78px; }
:host([disposizione="musica"]) img.ritratto { border-width: 1px; object-fit: cover; }
:host([disposizione="musica"]) .testa { grid-area: testo; align-items: flex-start; }
:host([disposizione="musica"]) .valore { display: none; }
:host([disposizione="musica"]) .tempo { grid-area: tempo; }
:host([disposizione="musica"]) .comandi { grid-area: comandi; }
:host([disposizione="musica"]) .cursore { grid-area: cursore; }
:host([disposizione="musica"]) .nome {
  font-size: 11.5px; font-weight: 600; letter-spacing: .04em; text-transform: uppercase;
  color: var(--testo2, var(--secondary-text-color, #8ea0b8));
}
:host([disposizione="musica"]) .sotto {
  font-size: 14.5px; font-weight: 600; line-height: 1.25; margin-top: 3px;
  color: var(--testo, var(--primary-text-color, #eaf1fb)); -webkit-line-clamp: 2;
}
:host([disposizione="musica"]) .comandi { margin-top: 12px; }
:host([disposizione="musica"]) .cursore { margin-top: 8px; }

/* minimo e massimo del periodo, piccoli agli estremi */
.estremi { position: absolute; left: 0; right: 0; bottom: 0; height: 46%;
  min-height: 24px; max-height: 72px; z-index: 1; pointer-events: none;
  font-size: 9.5px; font-variant-numeric: tabular-nums;
  color: var(--testo2, var(--secondary-text-color, #8ea0b8)); }
.estremi[hidden] { display: none !important; }
.estremi .alto { position: absolute; top: 0; left: 2px; }
.estremi .basso { position: absolute; bottom: 0; left: 2px; }

/* --- il mirino sul grafico: dice quanto e quando --- */
.mirino { position: absolute; left: 0; right: 0; bottom: 0; height: 46%;
  min-height: 24px; max-height: 72px; z-index: 2; pointer-events: none; }
.mirino[hidden] { display: none !important; }
.mirino .mira { position: absolute; top: 0; bottom: 0; width: 1px;
  background: color-mix(in srgb, var(--c) 70%, transparent); }
.mirino .palla { position: absolute; width: 8px; height: 8px; border-radius: 50%;
  background: #fff; box-shadow: 0 0 8px var(--c); transform: translate(-50%, -50%); }
/* il cartellino sta appena sopra al grafico e segue il dito */
.cartellino { position: absolute; bottom: calc(46% + 6px); left: 50%;
  transform: translateX(-50%);
  z-index: 3; pointer-events: none; white-space: nowrap;
  background: rgba(8,12,20,.92); border: 1px solid rgba(255,255,255,.14);
  border-radius: 8px; padding: 3px 8px; font-size: 11px; line-height: 1.35;
  color: var(--primary-text-color, #eaf1fb); box-shadow: 0 6px 18px rgba(0,0,0,.5); }
.cartellino b { color: var(--c); font-variant-numeric: tabular-nums; }
.cartellino span { color: var(--secondary-text-color, #9fb0c6); margin-left: 6px; }
.cartellino[hidden] { display: none !important; }

/* --- il grafichino dell'andamento --- */
/* il grafico non ruba spazio: sta sul fondo della casella, dietro alle
   scritte, quindi non cambia l'altezza di niente e si vede sempre */
.andamento { position: absolute; left: 0; right: 0; bottom: 0;
  width: 100%; height: 46%; min-height: 24px; max-height: 72px;
  z-index: 0; pointer-events: none; opacity: .8; }
.andamento[hidden] { display: none !important; }
/* Il grafico sta dietro alle scritte: senza aiuto i numeri ci si perdono
   dentro. Un alone scuro attorno alle lettere e un velo morbido sotto al
   numero grande bastano a staccarli, senza coprire il grafico. */
:host([congrafico]) .nome, :host([congrafico]) .sotto,
:host([congrafico]) .metrica .num, :host([congrafico]) .metrica .eti {
  text-shadow: 0 1px 2px rgba(6,10,16,.85);
}
:host([congrafico]) .andamento { opacity: .68; }
.andamento .riga { fill: none; stroke: var(--c); stroke-width: 1.6;
  stroke-linejoin: round; stroke-linecap: round; vector-effect: non-scaling-stroke; }
.andamento .pieno { fill: var(--velo, transparent); stroke: none; }
:host([grande]) .andamento { height: 44px; }
:host([disposizione="persona"]) .andamento,
:host([disposizione="musica"]) .andamento,
:host([disposizione="vinile"]) .andamento { display: none !important; }

/* --- l'onda del tempo (disposizione vinile) --- */
.ondabox { display: none; position: relative; height: 26px; }
.ondabox svg { display: block; width: 100%; height: 100%; overflow: visible; }
/* NIENTE vector-effect qui: con la riga stirata farebbe contare i trattini
   in pixel di schermo mentre pathLength li conta nel disegno, e il pezzo
   colorato resterebbe indietro rispetto al pallino */
.ondabox path { fill: none; stroke-width: 2.4; stroke-linecap: round; }
.ondabox path.fondo { stroke: rgba(255,255,255,.17); }
.ondabox path.fatta { stroke: url(#grOnda); transition: stroke-dasharray .9s linear; }
.ondabox .s1 { stop-color: var(--c); }
.ondabox .s2 { stop-color: color-mix(in srgb, var(--c) 45%, #ffffff); }
.ondabox .pallino {
  position: absolute; width: 11px; height: 11px; border-radius: 50%; background: #fff;
  transform: translate(-50%, -50%); transition: left .9s linear, top .9s linear;
  box-shadow: 0 0 9px color-mix(in srgb, var(--c) 85%, transparent);
}

/* --- disposizione "vinile": copertina tonda, onda, comandi grandi --- */
:host([disposizione="vinile"]) ha-card {
  display: grid; grid-template-columns: minmax(0, 1fr);
  grid-template-areas: "lettori" "art" "testo" "misure" "tempo" "comandi" "cursore" "extra";
  justify-items: center; align-content: center; row-gap: 0;
}
:host([disposizione="vinile"]) .riga { display: contents; }
:host([disposizione="vinile"]) .iconaHa,
:host([disposizione="vinile"]) .iconaFoto,
:host([disposizione="vinile"]) svg.icona,
:host([disposizione="vinile"]) img.ritratto {
  grid-area: art; width: clamp(74px, 42%, 116px); height: auto; aspect-ratio: 1;
  border-radius: 50%; flex: none; margin: 0;
}
:host([disposizione="vinile"][grande]) .iconaHa,
:host([disposizione="vinile"][grande]) .iconaFoto,
:host([disposizione="vinile"][grande]) svg.icona,
:host([disposizione="vinile"][grande]) img.ritratto { width: clamp(94px, 46%, 148px); }
:host([disposizione="vinile"]) img.ritratto {
  object-fit: cover; border: 3px solid rgba(255,255,255,.10);
  box-shadow: 0 7px 24px rgba(0,0,0,.45), 0 0 30px color-mix(in srgb, var(--c) 34%, transparent);
}
@keyframes casa-giradischi { to { transform: rotate(360deg); } }
:host([disposizione="vinile"][anima][gira]) img.ritratto {
  animation: casa-giradischi calc(26s / var(--vel, 1)) linear infinite;
}
:host([disposizione="vinile"]) .valore { display: none; }
:host([disposizione="vinile"]) .testa { grid-area: testo; width: 100%; margin-top: 11px; }
:host([disposizione="vinile"]) .testa .testi { text-align: center; }
:host([disposizione="vinile"]) .nome {
  font-size: 10.5px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase;
  color: var(--testo2, var(--secondary-text-color, #8ea0b8));
}
:host([disposizione="vinile"]) .sotto { display: block; margin-top: 4px; }
:host([disposizione="vinile"]) .sotto .brano {
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
  font-size: 15px; font-weight: 700; line-height: 1.22;
  color: var(--testo, var(--primary-text-color, #eaf1fb));
}
:host([disposizione="vinile"]) .sotto .artista {
  display: block; margin-top: 2px; font-size: 12px; font-weight: 500;
  color: var(--testo2, var(--secondary-text-color, #8ea0b8));
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
:host([disposizione="vinile"]) .chips { grid-area: misure; width: 100%;
  justify-content: center; margin-top: 8px; }
:host([disposizione="vinile"]) .tempo { grid-area: tempo; width: 100%; margin-top: 12px;
  flex-direction: column; align-items: stretch; gap: 2px; }
:host([disposizione="vinile"]) .tempo .binario { display: none; }
:host([disposizione="vinile"]) .ondabox { display: block; }
:host([disposizione="vinile"]) .tempo .orologio { text-align: center; font-size: 10.5px; }
:host([disposizione="vinile"]) .comandi { grid-area: comandi; gap: 10px; margin-top: 12px; }
:host([disposizione="vinile"]) .comandi button {
  width: 52px; height: 34px; border-radius: 11px; font-size: 15px;
  background: rgba(12,18,28,.55);
}
:host([disposizione="vinile"]) .comandi button.grosso {
  width: 64px; height: 40px; border-radius: 13px; font-size: 18px;
  background: color-mix(in srgb, var(--c) 55%, rgba(12,18,28,.6));
}
:host([disposizione="vinile"]) .cursore { grid-area: cursore; width: 100%; margin-top: 10px; }

/* --- scelta della cassa (come nella card della musica) --- */
.lettori {
  display: flex; flex-wrap: wrap; justify-content: center;
  gap: 5px 6px; margin-bottom: 9px;
}
.lettori::-webkit-scrollbar { display: none; }
.lettori[hidden] { display: none !important; }
.lettori button {
  flex: none; appearance: none; border: none; cursor: pointer; font: inherit;
  font-size: 10.5px; font-weight: 600; padding: 4px 9px; border-radius: 99px;
  display: inline-flex; align-items: center; gap: 5px; white-space: nowrap;
  max-width: 100%; background: rgba(255,255,255,.07);
  color: var(--secondary-text-color, #8ea0b8);
}
.lettori button .chi { overflow: hidden; text-overflow: ellipsis; }
.lettori button .spia { width: 5px; height: 5px; border-radius: 50%;
  background: transparent; flex: none; }
.lettori button[suona] .spia { background: var(--c);
  box-shadow: 0 0 6px color-mix(in srgb, var(--c) 80%, transparent); }
.lettori button[scelto] { color: var(--primary-text-color, #eaf1fb);
  background: color-mix(in srgb, var(--c) 26%, rgba(255,255,255,.06)); }
:host([disposizione="vinile"]) .lettori { grid-area: lettori; min-width: 0; width: 100%; }
:host([disposizione="musica"]) .lettori { grid-area: lettori; min-width: 0; width: 100%; }

/* --- tastini "Casse" e "Sorgente" con i loro pannelli --- */
.extra { display: flex; gap: 8px; justify-content: center; margin-top: 10px; flex-wrap: wrap; }
.extra[hidden] { display: none !important; }
.extra button {
  appearance: none; cursor: pointer; font: inherit; font-size: 11.5px;
  font-weight: 600; padding: 6px 12px; border-radius: 99px;
  /* fondo scuro come i comandi: sopra a una copertina chiara si devono
     leggere lo stesso */
  background: rgba(12,18,28,.55); color: var(--testo, #eaf1fb);
  border: 1px solid rgba(255,255,255,.14);
  backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);
  display: inline-flex; align-items: center; gap: 6px;
}
.extra button[hidden] { display: none !important; }
.extra button .freccia { font-size: 9px; transition: transform .18s; }
.extra button[aperto] {
  background: color-mix(in srgb, var(--c) 26%, rgba(255,255,255,.06));
  color: var(--testo, var(--primary-text-color, #eaf1fb));
}
.extra button[aperto] .freccia { transform: rotate(180deg); }
.pannello {
  position: absolute; inset: auto 8px 8px 8px; max-height: calc(100% - 16px);
  z-index: 4; display: flex; flex-direction: column;
  padding: 8px 10px; border-radius: 14px;
  /* pieno, non trasparente: dietro puo' esserci una copertina chiara.
     --pan-bg lo mette lui dalle impostazioni, se vuole */
  background: var(--pan-bg, linear-gradient(160deg, #141d2b 0%, #0a1019 100%));
  backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
  border: 1px solid color-mix(in srgb, var(--c) 22%, rgba(255,255,255,.10));
  box-shadow: 0 12px 32px rgba(0,0,0,.55);
}
.pannello[hidden] { display: none !important; }
.pannello .p-testa { display: flex; align-items: center; gap: 8px; padding-bottom: 6px;
  border-bottom: 1px solid rgba(255,255,255,.08); margin-bottom: 4px; }
.pannello .p-testa span { flex: 1; font-size: 11px; font-weight: 700;
  letter-spacing: .05em; text-transform: uppercase;
  color: var(--testo2, var(--secondary-text-color, #8ea0b8)); }
.pannello .p-chiudi {
  appearance: none; border: none; cursor: pointer; font: inherit; font-size: 15px;
  width: 26px; height: 26px; border-radius: 50%; line-height: 1;
  background: rgba(255,255,255,.08);
  color: var(--testo, var(--primary-text-color, #eaf1fb));
  display: grid; place-items: center;
}
/* su una casella larga le casse stanno in piu' colonne, cosi' non resta
   mezzo riquadro vuoto; su una stretta tornano in fila da sole */
.pannello .p-corpo { overflow-y: auto; flex: 1; display: grid; align-content: start;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 0 18px; }
.pannello .voce { display: flex; align-items: center; gap: 9px; padding: 5px 0; }
.pannello .voce .chi { flex: 1; min-width: 0; font-size: 12px; white-space: nowrap;
  overflow: hidden; text-overflow: ellipsis;
  color: var(--testo, var(--primary-text-color, #eaf1fb)); }
.pannello .voce .vol { flex: none; width: 92px; }
.pannello .voce .vol[hidden] { display: none !important; }
.pannello .voce .sw {
  appearance: none; border: none; padding: 0; flex: none; cursor: pointer;
  position: relative; width: 34px; height: 19px; border-radius: 99px;
  background: rgba(255,255,255,.15);
}
.pannello .voce .sw::after {
  content: ""; position: absolute; top: 2px; left: 2px; width: 15px; height: 15px;
  border-radius: 50%; background: #fff; transition: left .18s;
}
.pannello .voce .sw[on] { background: var(--c); }
.pannello .voce .sw[on]::after { left: 17px; }
.pannello .voce .sw:disabled { opacity: .35; cursor: default; }
.pannello .voce[spento] .chi { opacity: .5; }
@keyframes casa-attesa { 0%, 100% { opacity: 1; } 50% { opacity: .4; } }
.pannello .voce[attesa] .sw { animation: casa-attesa 1.1s ease-in-out infinite; }
@keyframes casa-nope { 0%, 100% { background: transparent; }
  25%, 75% { background: rgba(255,95,95,.22); } }
.pannello .voce[nope] { animation: casa-nope .7s ease; border-radius: 8px; }
.pannello.fonti .p-corpo { display: flex; flex-wrap: wrap; gap: 6px;
  align-content: flex-start; padding-top: 4px; }
.pannello.fonti .p-corpo button {
  appearance: none; border: none; cursor: pointer; font: inherit; font-size: 11px;
  font-weight: 600; padding: 5px 10px; border-radius: 99px; max-width: 100%;
  background: rgba(255,255,255,.07);
  color: var(--testo2, var(--secondary-text-color, #8ea0b8));
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.pannello.fonti .p-corpo button[scelto] {
  background: color-mix(in srgb, var(--c) 26%, rgba(255,255,255,.06));
  color: var(--primary-text-color, #eaf1fb);
}
:host([disposizione="vinile"]) .extra,
:host([disposizione="musica"]) .extra { grid-area: extra; width: 100%; }

/* ================= la casella si adatta alla sua larghezza ============= */

/* --- stretta: telefono con due caselle affiancate, o colonne strette --- */
@container (max-width: 245px) {
  ha-card { padding: 11px; gap: 8px; }
  .nome { font-size: 12.5px; }
  .lettori { gap: 4px; margin-bottom: 7px; }
  .lettori button { font-size: 9.5px; padding: 3px 7px; gap: 4px; }
  .tempo .orologio { font-size: 9.5px; }
  .cursore .quanto { display: none; }
  .comandi { gap: 4px; }
  .extra { gap: 6px; margin-top: 8px; }
  .extra button { font-size: 10px; padding: 5px 9px; }
  .pannello { inset: auto 6px 6px 6px; max-height: calc(100% - 12px); padding: 7px 8px; }
  .pannello .voce { gap: 6px; padding: 4px 0; }
  .pannello .voce .chi { font-size: 11px; }
  .pannello .voce .vol { width: 62px; }
  :host([disposizione="vinile"]) svg.icona,
  :host([disposizione="vinile"]) .iconaHa,
  :host([disposizione="vinile"]) .iconaFoto,
  :host([disposizione="vinile"]) img.ritratto { width: clamp(58px, 46%, 92px); }
  :host([disposizione="vinile"]) .testa { margin-top: 8px; }
  :host([disposizione="vinile"]) .sotto .brano { font-size: 13px; }
  :host([disposizione="vinile"]) .sotto .artista { font-size: 10.5px; }
  :host([disposizione="vinile"]) .comandi button { width: 42px; height: 30px; font-size: 13px; }
  :host([disposizione="vinile"]) .comandi button.grosso { width: 52px; height: 34px; font-size: 15px; }
  :host([disposizione="musica"]) svg.icona,
  :host([disposizione="musica"]) .iconaHa,
  :host([disposizione="musica"]) .iconaFoto,
  :host([disposizione="musica"]) img.ritratto { width: 50px; height: 50px; }
}

/* --- strettissima: i quattro comandi non ci stanno in fila --- */
@container (max-width: 205px) {
  .comandi { flex-wrap: wrap; gap: 4px; }
  .lettori { gap: 4px; }
  :host([disposizione="vinile"]) .comandi button { width: 38px; height: 29px; font-size: 12px; }
  :host([disposizione="vinile"]) .comandi button.grosso { width: 46px; height: 33px; font-size: 14px; }
  :host([disposizione="vinile"]) .testa { margin-top: 7px; }
  .extra button { padding: 4px 8px; }
}

/* --- larga: casella a tutta pagina sul telefono o su tablet --- */
@container (min-width: 340px) {
  ha-card { padding: 16px; }
  :host([disposizione="vinile"]) svg.icona,
  :host([disposizione="vinile"]) .iconaHa,
  :host([disposizione="vinile"]) .iconaFoto,
  :host([disposizione="vinile"]) img.ritratto { width: clamp(112px, 34%, 152px); }
  :host([disposizione="vinile"]) .sotto .brano { font-size: 16.5px; }
  :host([disposizione="vinile"]) .sotto .artista { font-size: 12.5px; }
  :host([disposizione="vinile"]) .comandi { gap: 12px; }
  :host([disposizione="vinile"]) .comandi button { width: 58px; height: 38px; font-size: 16px; }
  :host([disposizione="vinile"]) .comandi button.grosso { width: 72px; height: 44px; font-size: 19px; }
  .lettori button { font-size: 11.5px; padding: 5px 11px; }
  .tempo .orologio { font-size: 11.5px; }
}

/* --- col dito ci vuole piu' spazio che col mouse --- */
@media (pointer: coarse) {
  .comandi { flex-wrap: wrap; }
  .comandi button { min-width: 40px; min-height: 38px; }
  .lettori button { min-height: 30px; }
  .extra button { min-height: 34px; }
  .colori .scambio { width: 42px; height: 42px; }
  .colori .scambio svg { width: 23px; height: 23px; }
  .cursore input, .pannello .vol { height: 8px; }
  .cursore input::-webkit-slider-thumb,
  .pannello .vol::-webkit-slider-thumb { width: 19px; height: 19px; }
  .pannello .voce .sw { width: 40px; height: 23px; }
  .pannello .voce .sw::after { width: 19px; height: 19px; }
  .pannello .voce .sw[on]::after { left: 19px; }
  .pannello .p-chiudi { width: 32px; height: 32px; }
}

/* --- il pop-up su schermi piccoli --- */
@media (max-width: 480px) {
  .velo { padding: 8px; }
  .finestra { border-radius: 20px; padding: 14px; max-height: 88vh; }
  .f-icona { width: 32px; height: 32px; flex: 0 0 32px; }
}
/* --- contenuto del pop-up mostrato nell'anteprima delle impostazioni --- */
.popup-anteprima { margin-top: 10px; padding: 12px; border-radius: 18px;
  /* Niente "max-width: 100%": il riquadro puo' essere piu' largo della
     casella (che HA tiene stretta quanto sulla plancia) e prendersi tutta
     la colonna. Overflow tagliato per non far comparire barre. */
  overflow: hidden;
  border: 1px dashed var(--casa-border, #33465f); background: rgba(255,255,255,.03);
  display: grid; gap: 10px;
  /* mai piu' larga della colonna che la ospita, se no viene tagliata */
  width: 100%; box-sizing: border-box; }
.popup-anteprima[hidden] { display: none !important; }
.popup-anteprima .titoletto { font-size: 11px; letter-spacing: .06em; text-transform: uppercase;
  color: var(--secondary-text-color, #8ea0b8); }
.popup-anteprima > * { display: block; }
/* le schede del pop-up, una sotto l'altra, larghe quanto la colonna:
   provato a disegnarle alla larghezza vera del pop-up e a rimpicciolirle,
   ma con la finestra stretta veniva o minuscolo o tagliato. */
/* minmax(0,1fr) e non "1fr": se no una scheda larga (il power-flow) si
   allarga la colonna e sfonda il riquadro, e da li' il taglio a destra e
   la barra di scorrimento che va e viene facendo sfarfallare tutto */
.popup-anteprima .pa-dentro { display: grid; gap: 10px;
  grid-template-columns: minmax(0, 1fr); }
.popup-anteprima .pa-dentro > * { min-width: 0; max-width: 100%; overflow: hidden; }
.cartellino-anteprima { display: flex; align-items: center; gap: 8px;
  padding: 14px; border-radius: 14px; font-size: 12px;
  color: var(--secondary-text-color, #8ea0b8);
  border: 1px dashed var(--casa-border, #33465f); background: rgba(255,255,255,.02); }
.cartellino-anteprima .segno { font-size: 18px; }

svg .an { animation-play-state: paused; }
:host([anima]) svg .an { animation-play-state: running; }
/* la batteria che carica o che da corrente si muove sempre: sta lavorando
   davvero, e non ha senso fermarla perche' la casella e' spenta */
svg .caricafulmine { animation-play-state: running; }
:host([fermo]) svg .caricafulmine { animation-play-state: paused; }

.velo {
  position: fixed; inset: 0; z-index: 9; display: none;
  background: rgba(4,7,12,.72); backdrop-filter: blur(6px);
  align-items: center; justify-content: center; padding: 16px;
}
.velo[aperto] { display: flex; }
.finestra {
  width: min(560px, 100%); max-height: 84vh; overflow: auto;
  background: var(--fin-bg, var(--casa-popup-bg, #0f1620));
  background-size: cover; background-position: center;
  border: 1px solid var(--casa-border, #1e2b3d);
  border-radius: 26px; padding: 18px;
  box-shadow: 0 30px 80px rgba(0,0,0,.6);
  animation: casa-entra calc(.22s / var(--vel, 1)) ease-out;
}
@keyframes casa-entra { from { transform: translateY(14px) scale(.97); opacity: 0; } }
.f-testa { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
.f-icona { width: 38px; height: 38px; flex: 0 0 38px; }
.f-titolo { font-size: 18px; font-weight: 700; letter-spacing: -.01em;
  color: var(--primary-text-color, #eaf1fb); }
.f-chiudi {
  margin-left: auto; width: 34px; height: 34px; border-radius: 50%; border: none;
  background: rgba(255,255,255,.08); color: var(--primary-text-color, #eaf1fb);
  font-size: 18px; line-height: 1; cursor: pointer;
}
.f-chiudi:hover { background: rgba(255,255,255,.16); }
.f-corpo > * { margin-bottom: 10px; display: block; }
/* Le schede dentro al pop-up NON devono ereditare i colori di questa
   casella: ognuna ha i suoi. I colori viaggiano da soli da padre a figlio,
   quindi qui li azzero e ogni scheda si mette i propri. */
.f-corpo, .popup-anteprima {
  --c: initial; --testo: initial; --testo2: initial; --bordo: initial;
  --alone1: initial; --alone2: initial; --velo: initial; --card-bg: initial;
  --vel: initial; --sfoca: initial; --luce-cop: initial;
  --forza-cielo: initial; --pan-bg: initial;
  --fondoico: initial; --fondoico-acceso: initial;
  --fin-bg: initial; --fin-sch-bg: initial; --fin-sch-bordo: initial;
}

/* ogni scheda dentro al pop-up sta nella sua busta, che le da il colore */
.f-corpo .vestito, .popup-anteprima .vestito { display: block; }
.popup-anteprima .vestito[vestita] { border-radius: 14px; overflow: hidden; }
.f-corpo .vestito[vestita] { border-radius: 14px; overflow: hidden; }
@media (prefers-reduced-motion: reduce) { svg .an { animation: none !important; } }
`;

// che colore ha una luce bianca di tanti gradi kelvin: serve alle strisce
// che il bianco non ce l'hanno e lo devono mescolare coi colori
function coloreDaGradi(k) {
  const t = Math.max(1000, Math.min(12000, Number(k) || 4000)) / 100;
  const dentro = (x) => Math.max(0, Math.min(255, Math.round(x)));
  let r; let g; let b;
  if (t <= 66) {
    r = 255;
    g = 99.47 * Math.log(t) - 161.12;
    b = t <= 19 ? 0 : 138.52 * Math.log(t - 10) - 305.04;
  } else {
    r = 329.7 * Math.pow(t - 60, -0.1332);
    g = 288.12 * Math.pow(t - 60, -0.0755);
    b = 255;
  }
  return [dentro(r), dentro(g), dentro(b)];
}

// dal freddo al caldo: azzurro, verde, ambra, arancio, rosso
const SCALA_TERMICA = [
  [-5, [79, 139, 255]], [8, [79, 184, 255]], [15, [79, 224, 200]],
  [19, [63, 217, 138]], [23, [255, 207, 92]], [27, [255, 154, 60]],
  [32, [255, 95, 95]],
];

function coloreTemperatura(t) {
  const n = Number(t);
  if (isNaN(n)) return null;
  let a = SCALA_TERMICA[0];
  let b = SCALA_TERMICA[SCALA_TERMICA.length - 1];
  if (n <= a[0]) return daRgb(a[1]);
  if (n >= b[0]) return daRgb(b[1]);
  for (let i = 0; i < SCALA_TERMICA.length - 1; i += 1) {
    if (n >= SCALA_TERMICA[i][0] && n <= SCALA_TERMICA[i + 1][0]) {
      a = SCALA_TERMICA[i];
      b = SCALA_TERMICA[i + 1];
      break;
    }
  }
  const q = (n - a[0]) / (b[0] - a[0]);
  return daRgb([0, 1, 2].map((k) => Math.round(a[1][k] + (b[1][k] - a[1][k]) * q)));
}

// Come fa Mushroom: il colore della lampada va corretto, se no i bianchi
// e i colori slavati non si vedono sul fondo scuro.
function coloreLampada(rgb) {
  const r = rgb[0] / 255;
  const g = rgb[1] / 255;
  const b = rgb[2] / 255;
  const max = Math.max(r, g, b);
  const delta = max - Math.min(r, g, b);
  let h = 0;
  if (delta) {
    if (max === r) h = (g - b) / delta;
    else if (max === g) h = 2 + (b - r) / delta;
    else h = 4 + (r - g) / delta;
  }
  h = 60 * (h < 0 ? h + 6 : h);
  let sat = max ? delta / max : 0;
  let val = max * 255;
  if (sat < 0.4) {
    if (sat < 0.1) val = 225;      // quasi bianca: la faccio brillare
    else sat = 0.4;                // slavata: le do' un po' di tinta
  }
  const canale = (n) => {
    const k = (n + h / 60) % 6;
    return Math.round(val - val * sat * Math.max(Math.min(k, 4 - k, 1), 0));
  };
  return [canale(5), canale(3), canale(1)];
}

function daRgb(rgb) {
  if (!Array.isArray(rgb) || rgb.length < 3) return null;
  return "#" + rgb.slice(0, 3)
    .map((x) => Math.max(0, Math.min(255, Math.round(x))).toString(16).padStart(2, "0"))
    .join("");
}

// lo stesso colore, ma piu' scuro (quanto: 1 = uguale, 0 = nero)
function scurisci(colore, quanto) {
  const h = String(colore || "").replace("#", "");
  const pieno = h.length === 3 ? h.split("").map((x) => x + x).join("") : h;
  if (pieno.length !== 6) return colore;
  const n = parseInt(pieno, 16);
  const r = Math.round(((n >> 16) & 255) * quanto);
  const g = Math.round(((n >> 8) & 255) * quanto);
  const b = Math.round((n & 255) * quanto);
  return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
}

function conAlfa(colore, a) {
  const h = String(colore || "").replace("#", "");
  const pieno = h.length === 3 ? h.split("").map((x) => x + x).join("") : h;
  if (pieno.length !== 6) return colore;
  const alfa = Math.round(Math.max(0, Math.min(1, a)) * 255).toString(16).padStart(2, "0");
  return "#" + pieno + alfa;
}

const METEO = {
  "clear-night": ["\uD83C\uDF19", "Sereno"],
  cloudy: ["\u2601\uFE0F", "Nuvoloso"],
  fog: ["\uD83C\uDF2B\uFE0F", "Nebbia"],
  hail: ["\uD83C\uDF28\uFE0F", "Grandine"],
  lightning: ["\u26C8\uFE0F", "Temporale"],
  "lightning-rainy": ["\u26C8\uFE0F", "Temporale"],
  partlycloudy: ["\u26C5", "Parz. nuvoloso"],
  pouring: ["\uD83C\uDF27\uFE0F", "Pioggia forte"],
  rainy: ["\uD83C\uDF27\uFE0F", "Pioggia"],
  snowy: ["\u2744\uFE0F", "Neve"],
  "snowy-rainy": ["\uD83C\uDF28\uFE0F", "Nevischio"],
  sunny: ["\u2600\uFE0F", "Sereno"],
  windy: ["\uD83D\uDCA8", "Vento"],
  "windy-variant": ["\uD83D\uDCA8", "Vento"],
  exceptional: ["\u26A0\uFE0F", "Attenzione"],
};

const CIELI = {
  sunny: [
    "radial-gradient(115% 80% at 84% -14%, rgba(255,216,140,.95), rgba(255,216,140,0) 58%),"
    + "linear-gradient(168deg, #1668b8 0%, #3f97dd 42%, #8cc6ee 74%, #f2b877 100%)", "sole"],
  "clear-night": [
    "radial-gradient(90% 70% at 74% 10%, rgba(190,206,255,.30), rgba(190,206,255,0) 62%),"
    + "linear-gradient(168deg, #060b1e 0%, #101c48 55%, #22366e 100%)", "stelle"],
  partlycloudy: [
    "radial-gradient(110% 80% at 78% -10%, rgba(255,226,170,.55), rgba(255,226,170,0) 55%),"
    + "linear-gradient(168deg, #1f5a94 0%, #5b8fc4 55%, #a8c4dc 100%)", "sole_nuvole"],
  cloudy: [
    "radial-gradient(110% 75% at 30% -12%, rgba(226,236,246,.35), rgba(226,236,246,0) 60%),"
    + "linear-gradient(168deg, #33445a 0%, #566a80 60%, #7b8b9d 100%)", "nuvole"],
  rainy: [
    "radial-gradient(100% 70% at 22% -12%, rgba(150,180,205,.45), rgba(150,180,205,0) 60%),"
    + "linear-gradient(168deg, #17222f 0%, #2b3c4e 55%, #3c5468 100%)", "pioggia"],
  pouring: [
    "radial-gradient(100% 70% at 22% -12%, rgba(140,170,200,.4), rgba(140,170,200,0) 58%),"
    + "linear-gradient(168deg, #101923 0%, #22303f 55%, #33475b 100%)", "pioggia"],
  lightning: [
    "radial-gradient(95% 65% at 68% -8%, rgba(200,180,255,.42), rgba(200,180,255,0) 60%),"
    + "linear-gradient(168deg, #12172a 0%, #2b2745 55%, #453a63 100%)", "lampo"],
  "lightning-rainy": [
    "radial-gradient(95% 65% at 68% -8%, rgba(200,180,255,.42), rgba(200,180,255,0) 60%),"
    + "linear-gradient(168deg, #12172a 0%, #2b2745 55%, #453a63 100%)", "lampo"],
  snowy: [
    "radial-gradient(110% 80% at 50% -14%, rgba(255,255,255,.5), rgba(255,255,255,0) 60%),"
    + "linear-gradient(168deg, #46596e 0%, #778fa6 55%, #b3c6d6 100%)", "neve"],
  "snowy-rainy": [
    "radial-gradient(110% 80% at 50% -14%, rgba(255,255,255,.42), rgba(255,255,255,0) 60%),"
    + "linear-gradient(168deg, #3d5062 0%, #6b8196 55%, #a3b7c8 100%)", "neve"],
  hail: [
    "radial-gradient(110% 80% at 50% -14%, rgba(255,255,255,.42), rgba(255,255,255,0) 60%),"
    + "linear-gradient(168deg, #3d5062 0%, #6b8196 55%, #a3b7c8 100%)", "neve"],
  fog: [
    "radial-gradient(120% 90% at 50% 40%, rgba(235,240,245,.35), rgba(235,240,245,0) 65%),"
    + "linear-gradient(168deg, #46505c 0%, #6d7883 55%, #98a2ab 100%)", "nebbia"],
  windy: [
    "radial-gradient(110% 80% at 76% -10%, rgba(200,235,245,.4), rgba(200,235,245,0) 58%),"
    + "linear-gradient(168deg, #24596c 0%, #4a8399 55%, #86b3c4 100%)", "sole_nuvole"],
  "windy-variant": [
    "radial-gradient(110% 80% at 76% -10%, rgba(200,235,245,.4), rgba(200,235,245,0) 58%),"
    + "linear-gradient(168deg, #24596c 0%, #4a8399 55%, #86b3c4 100%)", "sole_nuvole"],
  exceptional: [
    "radial-gradient(110% 80% at 50% -14%, rgba(255,190,150,.45), rgba(255,190,150,0) 58%),"
    + "linear-gradient(168deg, #4d2424 0%, #7c4034 55%, #a76a4f 100%)", ""],
};

const PAROLE = {
  docked: "Alla base", cleaning: "Pulisce", returning: "Rientra",
  paused: "In pausa", idle: "Fermo", error: "Errore", unavailable: "Assente",
  unknown: "?", home: "In casa", not_home: "Fuori casa", playing: "In riproduzione",
  standby: "In attesa", heat: "Riscalda", cool: "Raffredda", auto: "Auto",
  streaming: "In diretta", recording: "Registra",
  charging: "In carica", discharging: "In scarica", not_charging: "Ferma", full: "Carica",
  open: "Aperta", closed: "Chiusa", locked: "Chiusa", unlocked: "Aperta",
  on: "Acceso", off: "Spento", none: "-", wired: "Via cavo", disconnected: "Scollegato",
};

// da quanto tempo dura questo stato, detto come lo direbbe uno
function daQuanto(quando) {
  const t = Date.parse(quando);
  if (isNaN(t)) return "";
  const sec = Math.max(0, (Date.now() - t) / 1000);
  if (sec < 60) return "da poco";
  const min = Math.round(sec / 60);
  if (min < 60) return "da " + min + " min";
  const ore = Math.floor(min / 60);
  const resto = min % 60;
  if (ore < 24) return "da " + ore + " h" + (resto ? " " + resto : "");
  const giorni = Math.round(ore / 24);
  return giorni === 1 ? "da un giorno" : "da " + giorni + " giorni";
}

// quanto e' lontano, in linea d'aria (formula dell'emisenoverso)
function quantoLontano(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const g = Math.PI / 180;
  const dLat = (lat2 - lat1) * g;
  const dLon = (lon2 - lon1) * g;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
    + Math.cos(lat1 * g) * Math.cos(lat2 * g)
    * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// la foto dell'entita': meglio quella che passa da Home Assistant
// (`entity_picture_local`), perche' l'altra puo' essere un indirizzo che
// da fuori casa non si raggiunge o che il browser blocca se e' http
function fotoDi(st) {
  if (!st || !st.attributes) return null;
  return st.attributes.entity_picture_local || st.attributes.entity_picture || null;
}

// quale riquadro (casse / sorgenti) era aperto, per entita'. Sta fuori
// dall'elemento apposta: serve a ritrovarlo se Home Assistant, mentre si
// modificano le impostazioni, rifa' la casella da zero.
const PANNELLI_APERTI = new Map();

// quanto ci mette ogni tapparella per un punto percentuale: si impara
// guardando quanto ci mette davvero, cosi' il movimento disegnato va
// alla stessa velocita' di quella vera
const VELOCITA_TAPPARELLE = {};

// le entita' "parenti" di una casella (stesso inizio di nome) che parlano di
// carica e scarica: si cercano una volta sola per tutta la pagina
const PARENTI = {};

// quanto occupa davvero ogni disegno: si misura una volta sola
const MISURE_ICONA = {};   // rifatte dalla v2.3.6 (aria = spessore del tratto)

// stringe il riquadro attorno al disegno, cosi' riempie il suo spazio come
// fanno le icone di Home Assistant
function riempiRiquadro(svg, chiave) {
  if (!svg || !chiave) return;
  const gia = MISURE_ICONA[chiave];
  if (gia !== undefined) {
    svg.setAttribute("viewBox", gia || "0 0 64 64");
    return;
  }
  if (!svg.isConnected) return;
  // misuro una copia ferma: gli aloni che si muovono falserebbero il conto
  let b = null;
  const copia = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  copia.setAttribute("viewBox", "0 0 64 64");
  copia.setAttribute("fill", "none");
  copia.setAttribute("style", "position:absolute;left:-9999px;top:0;"
    + "width:64px;height:64px;visibility:hidden");
  copia.classList.add("misuratore");
  copia.innerHTML = svg.innerHTML;
  (svg.parentNode || document.body).appendChild(copia);
  try { b = copia.getBBox(); } catch (e) { b = null; }
  copia.remove();
  if (!b || b.width < 4 || b.height < 4) return;
  const lato = Math.max(b.width, b.height);
  let box = null;
  if (lato < 62 && lato > 64 / 2.5) {
    // getBBox non conta lo spessore delle linee: senza questo, le icone
    // disegnate a tratto (il tachimetro) restano tagliate
    let tratto = 0;
    const dentro = svg.innerHTML || "";
    const spessori = dentro.match(/stroke-width="([0-9.]+)"/g) || [];
    spessori.forEach((x) => {
      const n2 = parseFloat(x.replace(/[^0-9.]/g, ""));
      if (!isNaN(n2) && n2 > tratto) tratto = n2;
    });
    // un filo d'aria in piu' anche per i disegni che dondolano (il campanello)
    const aria = Math.max(lato * 0.045, tratto / 2 + 0.8);
    const cx = b.x + b.width / 2;
    const cy = b.y + b.height / 2;
    const mezzo = lato / 2 + aria;
    box = [(cx - mezzo).toFixed(1), (cy - mezzo).toFixed(1),
           (mezzo * 2).toFixed(1), (mezzo * 2).toFixed(1)].join(" ");
  }
  MISURE_ICONA[chiave] = box;
  svg.setAttribute("viewBox", box || "0 0 64 64");
}

const SPENTI = ["off", "unavailable", "unknown", "not_home", "idle", "docked",
                "standby", "paused", "closed", "disarmed", "none"];

// una riga ondulata larga 300 unita': 4 gobbe complete
const ONDA_D = "M0 13" + " q18.75 -14 37.5 0 q18.75 14 37.5 0".repeat(4);

// --- YAML: giusto quel tanto che serve alle schede di Lovelace -------

function yamlScalare(v) {
  if (v === null || v === undefined) return "";
  if (typeof v === "boolean" || typeof v === "number") return String(v);
  const t = String(v);
  if (t === "") return '""';
  if (t.indexOf("\n") >= 0) return JSON.stringify(t);
  const delicato = /^[\s]|[\s]$|^[-?:,[\]{}#&*!|>'"%@`]|:\s|\s#/.test(t)
    || /^(true|false|null|yes|no|on|off|~)$/i.test(t)
    || /^-?\d+(\.\d+)?$/.test(t);
  return delicato ? JSON.stringify(t) : t;
}

function aYaml(valore, livello) {
  const liv = livello || 0;
  const pad = "  ".repeat(liv);
  if (Array.isArray(valore)) {
    if (!valore.length) return pad + "[]";
    return valore.map((v) => {
      if (v !== null && typeof v === "object") {
        const righe = aYaml(v, liv + 1).split("\n");
        const prima = pad + "- " + righe[0].trim();
        return righe.length > 1 ? prima + "\n" + righe.slice(1).join("\n") : prima;
      }
      return pad + "- " + yamlScalare(v);
    }).join("\n");
  }
  if (valore !== null && typeof valore === "object") {
    const chiavi = Object.keys(valore);
    if (!chiavi.length) return pad + "{}";
    return chiavi.map((k) => {
      const v = valore[k];
      if (v !== null && typeof v === "object" && (Array.isArray(v) ? v.length : Object.keys(v).length)) {
        return pad + k + ":\n" + aYaml(v, liv + 1);
      }
      if (v !== null && typeof v === "object") {
        return pad + k + ": " + (Array.isArray(v) ? "[]" : "{}");
      }
      return pad + k + ": " + yamlScalare(v);
    }).join("\n");
  }
  return pad + yamlScalare(valore);
}

function yamlPezzo(t) {
  const testo = String(t).trim();
  if (testo === "" || testo === "~" || testo === "null") return null;
  if (/^(true|yes|on)$/i.test(testo)) return true;
  if (/^(false|no|off)$/i.test(testo)) return false;
  if (/^-?\d+$/.test(testo)) return parseInt(testo, 10);
  if (/^-?\d*\.\d+$/.test(testo)) return parseFloat(testo);
  const q = testo[0];
  if ((q === '"' || q === "'") && testo[testo.length - 1] === q && testo.length > 1) {
    const dentro = testo.slice(1, -1);
    return q === '"' ? dentro.replace(/\\"/g, '"').replace(/\\n/g, "\n")
                     : dentro.replace(/''/g, "'");
  }
  if (q === "[" && testo[testo.length - 1] === "]") {
    const corpo = testo.slice(1, -1).trim();
    if (!corpo) return [];
    return yamlDividi(corpo).map((x) => yamlPezzo(x));
  }
  if (q === "{" && testo[testo.length - 1] === "}") {
    const corpo = testo.slice(1, -1).trim();
    const fuori = {};
    if (!corpo) return fuori;
    yamlDividi(corpo).forEach((pezzo) => {
      const i = yamlDuePunti(pezzo);
      if (i < 0) return;
      fuori[yamlPezzo(pezzo.slice(0, i))] = yamlPezzo(pezzo.slice(i + 1));
    });
    return fuori;
  }
  return testo;
}

// divide "a, b, [c, d]" senza rompere parentesi e virgolette
function yamlDividi(testo) {
  const fuori = [];
  let liv = 0, virg = null, pezzo = "";
  for (let i = 0; i < testo.length; i += 1) {
    const c = testo[i];
    if (virg) {
      pezzo += c;
      if (c === virg) virg = null;
      continue;
    }
    if (c === '"' || c === "'") { virg = c; pezzo += c; continue; }
    if (c === "[" || c === "{") liv += 1;
    if (c === "]" || c === "}") liv -= 1;
    if (c === "," && liv === 0) { fuori.push(pezzo); pezzo = ""; continue; }
    pezzo += c;
  }
  if (pezzo.trim() !== "") fuori.push(pezzo);
  return fuori.map((x) => x.trim());
}

// posizione dei due punti che separano chiave e valore
function yamlDuePunti(riga) {
  let virg = null;
  for (let i = 0; i < riga.length; i += 1) {
    const c = riga[i];
    if (virg) { if (c === virg) virg = null; continue; }
    if (c === '"' || c === "'") { virg = c; continue; }
    if (c === ":" && (i + 1 >= riga.length || /\s/.test(riga[i + 1]))) return i;
  }
  return -1;
}

function yamlRighe(testo) {
  const fuori = [];
  String(testo).replace(/\r/g, "").split("\n").forEach((riga) => {
    if (/^\s*#/.test(riga) || /^\s*$/.test(riga)) return;
    let pulita = riga;
    // toglie il commento a fine riga, ma non un # dentro le virgolette
    let virg = null;
    for (let i = 0; i < pulita.length; i += 1) {
      const c = pulita[i];
      if (virg) { if (c === virg) virg = null; continue; }
      if (c === '"' || c === "'") { virg = c; continue; }
      if (c === "#" && i > 0 && /\s/.test(pulita[i - 1])) { pulita = pulita.slice(0, i); break; }
    }
    if (!pulita.trim()) return;
    fuori.push({ testo: pulita.trim(), rientro: pulita.match(/^\s*/)[0].length, grezza: pulita });
  });
  return fuori;
}

let yamlProblemi = [];

function yamlBlocco(righe, stato, rientro) {
  const prima = righe[stato.i];
  if (!prima) return null;
  if (prima.testo.indexOf("- ") === 0 || prima.testo === "-") {
    const elenco = [];
    while (stato.i < righe.length && righe[stato.i].rientro >= rientro
           && (righe[stato.i].testo.indexOf("- ") === 0 || righe[stato.i].testo === "-")) {
      if (righe[stato.i].rientro > rientro) break;
      const r = righe[stato.i];
      const resto = r.testo === "-" ? "" : r.testo.slice(2).trim();
      if (!resto) {
        stato.i += 1;
        elenco.push(stato.i < righe.length && righe[stato.i].rientro > r.rientro
          ? yamlBlocco(righe, stato, righe[stato.i].rientro) : null);
        continue;
      }
      const dp = yamlDuePunti(resto);
      if (dp < 0) { elenco.push(yamlPezzo(resto)); stato.i += 1; continue; }
      // "- chiave: valore": la voce e' una mappa, rientrata di 2
      const finto = righe.slice();
      finto[stato.i] = { testo: resto, rientro: r.rientro + 2, grezza: resto };
      const dentro = { i: stato.i };
      elenco.push(yamlBlocco(finto, dentro, r.rientro + 2));
      stato.i = dentro.i;
    }
    return elenco;
  }
  const mappa = {};
  while (stato.i < righe.length && righe[stato.i].rientro >= rientro) {
    if (righe[stato.i].rientro > rientro) {
      yamlProblemi.push(righe[stato.i].testo);
      stato.i += 1;
      continue;
    }
    const r = righe[stato.i];
    const dp = yamlDuePunti(r.testo);
    if (dp < 0) { yamlProblemi.push(r.testo); stato.i += 1; continue; }
    const chiave = yamlPezzo(r.testo.slice(0, dp));
    const resto = r.testo.slice(dp + 1).trim();
    stato.i += 1;
    if (resto === "|" || resto === ">" || resto === "|-" || resto === ">-") {
      const pezzi = [];
      while (stato.i < righe.length && righe[stato.i].rientro > r.rientro) {
        pezzi.push(righe[stato.i].grezza.slice(r.rientro + 2));
        stato.i += 1;
      }
      mappa[chiave] = pezzi.join(resto[0] === ">" ? " " : "\n");
      continue;
    }
    if (resto !== "") { mappa[chiave] = yamlPezzo(resto); continue; }
    if (stato.i < righe.length && righe[stato.i].rientro > r.rientro) {
      mappa[chiave] = yamlBlocco(righe, stato, righe[stato.i].rientro);
    } else {
      mappa[chiave] = null;
    }
  }
  return mappa;
}

function daYaml(testo) {
  const t = String(testo).trim();
  if (!t) return null;
  if (t[0] === "{" || t[0] === "[") {
    try { return JSON.parse(t); } catch (e) { /* provo con lo yaml */ }
  }
  const righe = yamlRighe(t);
  if (!righe.length) return null;
  yamlProblemi = [];
  const fuori = yamlBlocco(righe, { i: 0 }, righe[0].rientro);
  if (yamlProblemi.length) {
    throw new Error("non ho capito la riga: " + yamlProblemi[0].slice(0, 40));
  }
  return fuori;
}

// disegni dei comandi della musica (i caratteri speciali su Android non ci sono)
const SEGNI = {
  prec: "M6,18V6H8V18H6M9.5,12L18,6V18L9.5,12Z",
  succ: "M16,18H18V6H16M6,18L14.5,12L6,6V18Z",
  play: "M8,5.14V19.14L19,12.14L8,5.14Z",
  pausa: "M14,19H18V5H14M6,19H10V5H6V19Z",
  stop: "M18,18H6V6H18V18Z",
  svuota: "M2,6V8H14V6H2M2,10V12H11V10H2M14,10.88L12.88,12L15.88,15L12.88,18L14,19.12L17,"
    + "16.12L20,19.12L21.12,18L18.12,15L21.12,12L20,10.88L17,13.88L14,10.88M2,14V16H11V14H2Z",
  tavolozza: "M17.5,12A1.5,1.5 0 0,1 16,10.5A1.5,1.5 0 0,1 17.5,9A1.5,1.5 0 0,1 19,10.5A1.5,"
    + "1.5 0 0,1 17.5,12M14.5,8A1.5,1.5 0 0,1 13,6.5A1.5,1.5 0 0,1 14.5,5A1.5,1.5 0 0,1 16,"
    + "6.5A1.5,1.5 0 0,1 14.5,8M9.5,8A1.5,1.5 0 0,1 8,6.5A1.5,1.5 0 0,1 9.5,5A1.5,1.5 0 0,1 "
    + "11,6.5A1.5,1.5 0 0,1 9.5,8M6.5,12A1.5,1.5 0 0,1 5,10.5A1.5,1.5 0 0,1 6.5,9A1.5,1.5 0 "
    + "0,1 8,10.5A1.5,1.5 0 0,1 6.5,12M12,3A9,9 0 0,0 3,12A9,9 0 0,0 12,21A1.5,1.5 0 0,0 "
    + "13.5,19.5C13.5,19.11 13.35,18.76 13.11,18.5C12.88,18.23 12.73,17.88 12.73,17.5A1.5,"
    + "1.5 0 0,1 14.23,16H16A5,5 0 0,0 21,11C21,6.58 16.97,3 12,3Z",
  bianco: "M12,8A4,4 0 0,0 8,12A4,4 0 0,0 12,16A4,4 0 0,0 16,12A4,4 0 0,0 12,8M12,18A6,6 0 "
    + "0,1 6,12A6,6 0 0,1 12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18M20,8.69V4H15.31L12,0.69L8.69,"
    + "4H4V8.69L0.69,12L4,15.31V20H8.69L12,23.31L15.31,20H20V15.31L23.31,12L20,8.69Z",
  volume: "M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,"
    + "19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,"
    + "15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z",
  muto: "M12,4L9.91,6.09L12,8.18M4.27,3L3,4.27L7.73,9H3V15H7L12,20V13.27L16.25,17.53C15.58,"
    + "18.04 14.83,18.46 14,18.7V20.77C15.38,20.45 16.63,19.82 17.68,18.96L19.73,21L21,19.73L12,"
    + "10.73M19,12C19,12.94 18.8,13.82 18.46,14.64L19.97,16.15C20.62,14.91 21,13.5 21,12C21,7.72 "
    + "18,4.14 14,3.23V5.29C16.89,6.15 19,8.83 19,12M16.5,12C16.5,10.23 15.5,8.71 14,7.97V10.18L16.45,"
    + "12.63C16.5,12.43 16.5,12.21 16.5,12Z",
  // tapparelle: freccia CONTRO una barra, cosi' si vede dove va a finire.
  // Le due frecce da sole sembravano il volume di un telecomando
  su: "M4,4H20V6H4V4M12,7L17,12H14V20H10V12H7L12,7Z",
  giu: "M4,20H20V18H4V20M12,17L17,12H14V4H10V12H7L12,17Z",
  serra: "M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17"
    + "M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6"
    + "A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z",
  apri: "M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H15V6"
    + "A3,3 0 0,0 12,3A3,3 0 0,0 9,6H7A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,17"
    + "A2,2 0 0,0 14,15A2,2 0 0,0 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17Z",
  // "torna alla base": la casetta si legge al volo anche a 19px, l'arco
  // della stazione di ricarica a quella misura sembrava un ferro di cavallo
  base: "M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z",
  spegni: "M16.56,5.44L15.11,6.89C16.84,7.94 18,9.83 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12C6,"
    + "9.83 7.16,7.94 8.88,6.88L7.44,5.44C5.36,6.88 4,9.28 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,"
    + "12C20,9.28 18.64,6.88 16.56,5.44M13,3H11V13H13V3Z",
};

// YouTube Music chiama gli artisti "Tizio - Topic": la coda non serve a nessuno
const nomeArtista = (chi) => String(chi || "").replace(/\s*-\s*Topic\s*$/i, "").trim();

// tinta/pienezza/luce <-> rosso/verde/blu: servono alla ruota dei colori
function rgbAHsl(r, g, b) {
  const r2 = r / 255; const g2 = g / 255; const b2 = b / 255;
  const alto = Math.max(r2, g2, b2); const basso = Math.min(r2, g2, b2);
  const d = alto - basso;
  let h = 0;
  if (d) {
    if (alto === r2) h = ((g2 - b2) / d) % 6;
    else if (alto === g2) h = (b2 - r2) / d + 2;
    else h = (r2 - g2) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  const l = (alto + basso) / 2;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  return [Math.round(h), Math.round(s * 100), Math.round(l * 100)];
}

function hslARgb(h, s, l) {
  const h0 = isFinite(h) ? h : 0;
  const s2 = Math.max(0, Math.min(100, isFinite(s) ? s : 0)) / 100;
  const l2 = Math.max(0, Math.min(100, isFinite(l) ? l : 50)) / 100;
  const c = (1 - Math.abs(2 * l2 - 1)) * s2;
  const x = c * (1 - Math.abs(((h0 / 60) % 2) - 1));
  const m = l2 - c / 2;
  let p = [0, 0, 0];
  const g = Math.floor(((h0 % 360) + 360) % 360 / 60);
  if (g === 0) p = [c, x, 0];
  else if (g === 1) p = [x, c, 0];
  else if (g === 2) p = [0, c, x];
  else if (g === 3) p = [0, x, c];
  else if (g === 4) p = [x, 0, c];
  else p = [c, 0, x];
  return p.map((v) => Math.round((v + m) * 255));
}

const hslATesto = (h, s, l) => daRgb(hslARgb(h, s, l));

// Parecchi simboli non stanno in mezzo al loro quadrato: il triangolo del
// play, per dire, sta un'unita' e mezza a destra. Dentro un tasto tondo si
// vede eccome, sembrano storti. Invece di una tabella scritta a mano che
// prima o poi non torna piu', la prima volta li misuro e me lo segno.
const SCARTI = {};
let LAVAGNA = null;
const NS_SVG = "http://www.w3.org/2000/svg";
function scartoDi(nome) {
  if (nome in SCARTI) return SCARTI[nome];
  let d = [0, 0];
  try {
    if (!LAVAGNA) {
      LAVAGNA = document.createElementNS(NS_SVG, "svg");
      LAVAGNA.setAttribute("viewBox", "0 0 24 24");
      LAVAGNA.style.cssText = "position:absolute;left:-999px;top:0;width:24px;"
        + "height:24px;opacity:0;pointer-events:none";
      (document.body || document.documentElement).appendChild(LAVAGNA);
    }
    const p = document.createElementNS(NS_SVG, "path");
    p.setAttribute("d", SEGNI[nome]);
    LAVAGNA.appendChild(p);
    const b = p.getBBox();
    p.remove();
    if (b.width && b.height) {
      const arr = (v) => Math.round(v * 100) / 100;
      d = [arr(12 - (b.x + b.width / 2)), arr(12 - (b.y + b.height / 2))];
      // il triangolo fa eccezione: messo nel mezzo esatto l'occhio lo vede
      // spostato a sinistra, e allora gli si lascia mezza unita' a destra
      if (nome === "play") d[0] = arr(d[0] + 0.5);
    }
  } catch (_) { d = [0, 0]; }
  SCARTI[nome] = d;
  return d;
}

const segno = (nome) => {
  if (!SEGNI[nome]) return "";
  const d = scartoDi(nome);
  const spost = (d[0] || d[1])
    ? ' transform="translate(' + d[0] + ' ' + d[1] + ')"' : "";
  return '<svg viewBox="0 0 24 24" aria-hidden="true"><path'
    + spost + ' d="' + SEGNI[nome] + '"></path></svg>';
};

// mette il simbolo dentro il tasto solo se e' cambiato davvero: rifare il
// disegnino a ogni giro (una volta al secondo, con la musica) e' sprecato
const metti = (el, nome) => {
  if (!el || el.dataset.segno === nome) return;
  el.dataset.segno = nome;
  el.innerHTML = segno(nome);
};

// Quanto dura, scritto come lo direbbe una persona: 135 minuti sono
// "2 h 15 min", non "135". Prende il numero e l'unita di partenza.
// solo unita' che non si confondono con altro: "m" sarebbe metri, non minuti
const SECONDI_DI = { s: 1, sec: 1, min: 60, h: 3600, d: 86400 };
// unita' che accetto quando sono appiccicate dentro allo stato ("17min").
// Scritte come si scrivono davvero: cosi' "3D" (una stampante) resta "3D"
// e non diventa "3 giorni".
const UNITA_NOTE = ["s", "min", "h", "d", "%", "W", "kW", "Wh", "kWh",
  "V", "A", "Hz", "km", "m", "mm", "cm", "kg", "g", "L", "l", "ml", "GB", "MB",
  "°C", "°F", "°", "lx", "ppm", "hPa", "mbar", "dB", "dBm"];

function durataBella(numero, unita) {
  const passo = SECONDI_DI[String(unita || "").toLowerCase()];
  if (!passo || !isFinite(numero)) return null;
  // zero non si traduce: "0 h" dice piu' di "0 s"
  if (numero === 0) return "0 " + unita;
  let sec = Math.round(Math.abs(numero) * passo);
  const segno = numero < 0 ? "-" : "";
  if (sec < 60) return segno + sec + " s";
  const g = Math.floor(sec / 86400); sec -= g * 86400;
  const h = Math.floor(sec / 3600); sec -= h * 3600;
  const m = Math.floor(sec / 60);
  if (g) return segno + g + " g" + (h ? " " + h + " h" : "");
  if (h) return segno + h + " h" + (m ? " " + m + " min" : "");
  return segno + m + " min";
}

// Certi sensori si scrivono il pezzo dentro allo stato ("17min", "3 h"):
// il numero da solo non dice niente, quindi lo tengo intero.
function numeroEUnita(stato) {
  const testo = String(stato).trim();
  const pezzi = testo.match(/^(-?\d+(?:[.,]\d+)?)\s*([a-zA-Z%°]{1,6})$/);
  if (!pezzi) return null;
  if (!UNITA_NOTE.includes(pezzi[2])) return null;
  return { n: parseFloat(pezzi[1].replace(",", ".")), u: pezzi[2] };
}

// il valore da mostrare: numero + unita, e le durate scritte per bene.
// Restituisce null se lo stato non e' un numero (nemmeno con l'unita
// appiccicata dentro), cosi' chi chiama scrive il testo cosi' com'e'.
function valoreScritto(st) {
  const grezzo = String(st.state).trim();
  let n = Number(grezzo);
  let u = st.attributes ? st.attributes.unit_of_measurement : "";
  if (grezzo === "" || isNaN(n)) {
    const dentro = numeroEUnita(grezzo);
    if (!dentro) return null;
    n = dentro.n;
    if (!u) u = dentro.u;
  }
  const dc = st.attributes ? st.attributes.device_class : "";
  if (dc === "duration" || SECONDI_DI[String(u || "").toLowerCase()]) {
    const bella = durataBella(n, u);
    if (bella) return bella;
  }
  return (Math.round(n * 10) / 10).toLocaleString("it-IT") + (u ? " " + u : "");
}

class CasaTile extends HTMLElement {
  static getConfigElement() { return document.createElement("casa-tile-editor"); }

  static getStubConfig() {
    return { type: "custom:casa-tile", icona: "auto", colore: "ambra" };
  }

  setConfig(config) {
    this._base = { icona: "auto", colore: "ambra", azione: "toggle",
                   usa_foto: true, ...config };
    this._config = this._base;
    this._firmaLettori = null;
    if (this._lettori().length > 1) {
      const ricordato = this._leggiScelto();
      if (ricordato && this._lettori().includes(ricordato)) this._scelto = ricordato;
    }
    // NON si rifa' da zero: il contenuto della casella e' sempre lo stesso e
    // rifarlo chiuderebbe i riquadri aperti a ogni ritocco delle impostazioni
    this._render();
  }

  // Home Assistant manda un aggiornamento a TUTTE le caselle ogni volta che
  // una qualsiasi entita' della casa cambia. Con settantasei caselle e
  // migliaia di entita' vuol dire ridisegnare tutto centinaia di volte al
  // minuto per niente: qui guardo solo le entita' che questa casella usa
  // davvero, e se non e' cambiata nessuna non muovo un dito.
  set hass(hass) {
    const prima = this._hass;
    this._hass = hass;
    if (prima && this._costruito && !this._miRiguarda(prima, hass)) return;
    // I valori arrivano a valanga: Home Assistant ne manda anche qualche
    // migliaio al secondo quando in casa c'e' movimento, e a ogni valanga
    // vorrebbe farmi ridisegnare. Non serve a niente: l'occhio ne vede
    // sessanta. Al massimo dieci disegni al secondo, l'ultimo valore non si
    // perde (arriva col disegno in coda).
    const ora = Date.now();
    const passato = ora - (this._ultimoDisegno || 0);
    if (this._costruito && passato < 100) {
      if (!this._disegnoHass) {
        this._disegnoHass = setTimeout(() => {
          this._disegnoHass = 0;
          this._ultimoDisegno = Date.now();
          if (this.isConnected) this._render();
        }, 100 - passato);
      }
      return;
    }
    this._ultimoDisegno = ora;
    this._render();
  }

  _miRiguarda(prima, ora) {
    if (!prima || !ora || !prima.states || !ora.states) return true;
    if (prima.states === ora.states) return false;
    // col pop-up aperto (o un riquadro) dentro ci sono schede di Home
    // Assistant che vogliono sapere tutto: li' ridisegno sempre
    if (this._velo && this._velo.hasAttribute("aperto")) return true;
    if (this._panGruppo && !this._panGruppo.hidden) return true;
    if (this._panFonti && !this._panFonti.hidden) return true;
    if (this._antPopup && !this._antPopup.hidden) return true;
    const quali = this._entitaSeguite();
    if (quali === null) return true;   // non lo so: meglio ridisegnare
    for (let i = 0; i < quali.length; i += 1) {
      if (prima.states[quali[i]] !== ora.states[quali[i]]) return true;
    }
    return false;
  }

  // tutte le entita' che questa casella legge: quelle scritte nelle
  // impostazioni piu' quelle che si e' andata a cercare da sola
  _entitaSeguite() {
    const c = this._config || {};
    const chiave = JSON.stringify([c.entity, c.info_entita, c.acceso_entita,
      c.meteo_entita, c.lettori, c.distanza_entita, c.sottotitolo_entita,
      c.carica_entita, c.scarica_entita, c.finestra_entita]);
    if (this._chiaveSeguite !== chiave) {
      this._chiaveSeguite = chiave;
      const dentro = [];
      const metti = (x) => {
        if (!x) return;
        if (Array.isArray(x)) x.forEach(metti);
        else if (typeof x === "string") dentro.push(x);
      };
      metti(c.entity); metti(c.info_entita); metti(c.acceso_entita);
      metti(c.meteo_entita); metti(c.lettori); metti(c.distanza_entita);
      metti(c.sottotitolo_entita); metti(c.carica_entita); metti(c.scarica_entita);
      metti(c.finestra_entita);
      this._seguite = dentro;
      // una casella della musica senza l'elenco delle casse va a cercarsele
      // da sola fra tutti i lettori: li' non posso fare i furbi
      this._cercaCasse = String(c.entity || "").indexOf("media_player.") === 0
        && !(Array.isArray(c.lettori) && c.lettori.length);
    }
    if (this._cercaCasse) return null;
    const extra = this._lette ? Array.from(this._lette) : [];
    return extra.length ? this._seguite.concat(extra) : this._seguite;
  }

  // Home Assistant mette `preview` sia nel riquadro delle impostazioni
  // sia quando la dashboard e' in modifica; per distinguere c'e'
  // `editMode`, che e' vero SOLO mentre si modifica la pagina.
  set preview(v) {
    this._anteprima = !!v;
    if (this._costruito) this._disegnaAntPopup();
  }

  get preview() { return !!this._anteprima; }

  set editMode(v) {
    this._modifica = !!v;
    if (this._costruito) this._disegnaAntPopup();
  }

  get editMode() { return !!this._modifica; }

  // Dove mi trovo? Invece di cercare il nome del riquadro di anteprima
  // (cambia da una versione all'altra di Home Assistant) controllo il
  // contrario: se sopra di me NON c'e' una pagina vera, allora sono in
  // un'anteprima. Cosi' funziona con qualsiasi versione.
  // Sono nel riquadro delle impostazioni? Il segno sicuro e' che sopra
  // di me c'e' una FINESTRA (un "dialog"): la dashboard, anche mentre la
  // modifichi, non sta mai dentro una finestra. Le proprieta' `preview` e
  // `editMode` non bastano: Home Assistant mette `preview` anche in
  // modifica, e dentro il dialogo disegna una finta sezione.
  _dentroAnteprima() {
    const PAGINA = ["hui-view", "hui-sections-view", "hui-masonry-view",
                    "hui-panel-view", "hui-sidebar-view", "hui-view-container"];
    let n = this.parentNode;
    let giri = 0;
    const strada = [];
    while (n && giri < 60) {
      if (n.nodeType === 11 && n.host) { n = n.host; continue; }
      const l = (n.localName || "").toLowerCase();
      if (l) strada.push(l);
      if (l.indexOf("dialog") >= 0 || l === "hui-card-preview"
          || l === "hui-card-picker") { this._strada = strada; return true; }
      if (PAGINA.includes(l)) { this._strada = strada; return false; }
      n = n.parentNode;
      giri += 1;
    }
    this._strada = strada;
    return false;
  }

  // Sono una casella disegnata DENTRO all'anteprima del pop-up di
  // un'altra? Allora la mia anteprima del pop-up non la faccio: se no
  // ogni finestra di impostazioni si mette a costruire pop-up dentro
  // pop-up, telecamere comprese, e la pagina si blocca.
  _dentroUnAltraAnteprima() {
    if (this._annidata !== undefined) return this._annidata;
    let n = this;
    let dentro = false;
    for (let i = 0; i < 40; i += 1) {
      n = n.parentNode || n.host;
      if (!n) break;
      const cl = (n.classList && n.classList.contains) ? n.classList : null;
      if (cl && (cl.contains("popup-anteprima") || cl.contains("f-corpo"))) {
        dentro = true;
        break;
      }
      const nome = String(n.localName || "");
      // anche l'anteprima di una scheda che sto sistemando dentro
      // all'elenco "Schede dentro il pop-up": li' costruire tutto il suo
      // pop-up (telecamere comprese) e' solo peso inutile
      if (nome === "casa-tile-editor") { dentro = true; break; }
      if (nome === "hui-dialog-edit-card"
        || (cl && cl.contains("element-preview"))) break;
    }
    this._annidata = dentro;
    return dentro;
  }

  // Il riquadro del pop-up si prende tutta la colonna dell'anteprima, non
  // solo il pezzetto che Home Assistant da' alla casella (largo quanto la
  // card sulla plancia: 6 colonne su 12). Lo spazio vero glielo misuro
  // sull'antenato che lo contiene.
  _largoAntPopup() {
    const box = this._antPopup;
    if (!box || box.hidden) return;
    let n = this;
    let largo = 0;
    for (let i = 0; i < 20; i += 1) {
      n = n.parentNode || n.host;
      if (!n) break;
      const cl = (n.classList && n.classList.contains) ? n.classList : null;
      if (String(n.localName || "") === "hui-dialog-edit-card"
        || (cl && cl.contains("element-preview"))) {
        largo = (n.clientWidth || 0) - 6;
        break;
      }
    }
    const mio = this.clientWidth || 0;
    if (largo > 200 && largo > mio + 12) {
      if (box._largo !== largo) { box._largo = largo; box.style.width = largo + "px"; }
    } else if (box._largo) {
      box._largo = 0;
      box.style.width = "";
    }
  }

  // Roba che nell'anteprima non va costruita per davvero: le telecamere
  // accendono lo stream (e in una finestra di impostazioni aperta e chiusa
  // dieci volte diventano gigabyte di video in memoria). Nell'anteprima
  // basta un cartellino con il nome.
  _pesante(cfg) {
    const t = String((cfg && cfg.type) || "").toLowerCase();
    // le nostre caselle si costruiscono sempre: sono leggere, e la diretta
    // gliela spengo qui sotto
    if (t === "custom:casa-tile") return false;
    if (t.indexOf("camera") >= 0 || t.indexOf("webrtc") >= 0
      || t.indexOf("frigate") >= 0 || t.indexOf("stream") >= 0) return true;
    if (cfg && (cfg.camera_entity || cfg.cameras)) return true;
    if (cfg && String(cfg.entity || "").indexOf("camera.") === 0) return true;
    return false;
  }

  _cartellino(cfg) {
    const d = document.createElement("div");
    d.className = "cartellino-anteprima";
    const t = String((cfg && cfg.type) || "").replace("custom:", "");
    d.innerHTML = "<span class='segno'>&#128247;</span><span></span>";
    d.querySelector("span:last-child").textContent =
      t + " - anteprima spenta per non tenere accesa la telecamera";
    d.setConfig = () => {};
    return d;
  }

  async _disegnaAntPopup() {
    const box = this._antPopup;
    if (!box) return;
    const c = this._config || {};
    const schede = c.finestra_cards || (c.finestra_card ? [c.finestra_card] : null);
    // nel riquadro dove si trascinano i pezzi voglio SOLO la casella:
    // il contenuto del pop-up li' dentro non c'entra niente
    const mostra = !this.hasAttribute("solo-casella")
      && this._dentroAnteprima() && !this._dentroUnAltraAnteprima()
      && c.azione === "finestra"
      && !!schede && schede.length > 0;
    box.hidden = !mostra;
    if (!mostra) { box.innerHTML = ""; this._firmaAnt = null; return; }

    const firma = JSON.stringify(schede);
    if (this._firmaAnt === firma) {
      // I valori glieli do UNA volta sola: e' un'anteprima, serve a far
      // vedere com'e' fatto il pop-up, non a tenerlo aggiornato. Prima
      // ripassavo power-flow, griglie e venti caselle a ogni stato che
      // cambiava in casa, e la finestra si trascinava. (A chi e' nato
      // prima che arrivassero i valori glieli do adesso, se no resta
      // vuoto per sempre.)
      if (this._hass) {
        (this._anteprimaSchede || []).forEach((el) => {
          if (el._ebbeValori) return;
          el._ebbeValori = true;
          try { el.hass = this._hass; } catch (e) { /* pazienza */ }
        });
      }
      box.querySelectorAll(".vestito").forEach((b) =>
        this._vestiScheda(b, Number(b.dataset.n) || 0));
      this._largoAntPopup();
      return;
    }
    this._firmaAnt = firma;
    box.innerHTML = "<div class='titoletto'>Contenuto del pop-up</div>";
    const dentro = document.createElement("div");
    dentro.className = "pa-dentro";
    box.appendChild(dentro);
    this._anteprimaSchede = [];
    try {
      const aiuti = await window.loadCardHelpers();
      schede.forEach((cfg, i) => {
        try {
          // nell'anteprima niente diretta della telecamera: e' la cosa che
          // mangia piu' memoria di tutte
          const suo = { ...cfg };
          if (suo.camera_diretta) delete suo.camera_diretta;
          const el = this._pesante(suo)
            ? this._cartellino(suo)
            : aiuti.createCardElement(suo);
          el.hass = this._hass;
          el._ebbeValori = !!this._hass;
          const busta = document.createElement("div");
          busta.className = "vestito";
          busta.dataset.n = String(i);
          this._vestiScheda(busta, i);
          busta.appendChild(el);
          dentro.appendChild(busta);
          this._anteprimaSchede.push(el);
        } catch (e) { /* una scheda che non va non ferma le altre */ }
      });
    } catch (e) { /* niente aiuti: pazienza */ }
    this._largoAntPopup();
    // toccando una casella qui dentro si sceglie quale sistemare nel
    // riquadro "Dove va ogni pezzo": cosi' basta un riquadro solo, nella
    // pagina principale, invece di rifare tutto dentro ogni scheda
    dentro.addEventListener("click", (e) => {
      const via = e.composedPath ? e.composedPath() : [];
      let scelta = null;
      for (let i = 0; i < via.length; i += 1) {
        if (via[i] === dentro) break;
        if (via[i] && via[i].localName === "casa-tile") { scelta = via[i]; break; }
      }
      if (!scelta || !scelta._config) return;
      e.preventDefault();
      e.stopPropagation();
      this.dispatchEvent(new CustomEvent("casa-scegli-scheda", {
        detail: { config: scelta._config, elemento: scelta },
        bubbles: true, composed: true,
      }));
    }, true);
  }

  // Il pop-up vero e' largo 560px (meno i suoi bordi): l'anteprima nelle
  // impostazioni ne ha molti meno. Disegno il contenuto alla larghezza VERA
  // e poi rimpicciolisco tutto insieme, cosi' le schede stanno come
  // staranno davvero invece di stringersi e andare a capo per conto loro.
  getCardSize() { return this._config && this._config.grande ? 3 : 2; }
  getGridOptions() {
    const c = this._config || {};
    const dominio = c.entity ? c.entity.split(".")[0] : "";
    const modo = c.disposizione || (dominio === "media_player" ? "vinile" : "");
    if (modo === "vinile") {
      return c.grande
        ? { columns: 8, rows: 8, min_columns: 6, min_rows: 1, max_rows: 12 }
        : { columns: 6, rows: 7, min_columns: 4, min_rows: 1, max_rows: 12 };
    }
    // Quanto spazio chiedere appena nasce: sei colonne (mezza sezione
    // stretta, un sesto di una larga) e DUE righe per tutti. Avevo provato a
    // dare una riga in piu' a chi ha i tasti rapidi, la barra o il grafico,
    // ma le sue caselle vere - tapparella con barra, consumo con grafico -
    // stanno benissimo in due righe: chiedere di piu' le faceva nascere
    // troppo alte. Solo la "casella grande" ne chiede tre.
    // "min_rows: 1": se no Home Assistant prende queste righe come minimo e
    // il cursore del Layout risale da solo quando lui lo abbassa.
    const righe = c.grande ? 3 : 2;
    return { columns: 6, rows: righe, min_columns: 4, min_rows: 1, max_rows: 12 };
  }

  _costruisci() {
    const root = this.attachShadow ? (this.shadowRoot || this.attachShadow({ mode: "open" })) : this;
    root.innerHTML = `<style>${STILE}</style>
      <ha-card tabindex="0">
        <div class="cielo" hidden></div>
        <svg class="iconafondo" viewBox="0 0 64 64" fill="none" aria-hidden="true" hidden></svg>
        <div class="copertina" hidden></div>
        <div class="lettori" hidden></div>
        <div class="testa"><div class="testi"><div class="nome"></div><div class="sotto"></div></div><div class="chips"></div><div class="meteo" hidden><div class="gradi"></div><div class="cond"></div></div></div>
        <div class="riga"><svg class="icona" viewBox="0 0 64 64" fill="none"></svg><ha-icon class="iconaHa" hidden></ha-icon><img class="iconaFoto" alt="" hidden><img class="ritratto" alt="" hidden><div class="valore"></div></div>
        <svg class="andamento" viewBox="0 0 100 30" preserveAspectRatio="none" hidden>
          <defs><linearGradient class="scala" x1="0" y1="1" x2="0" y2="0"></linearGradient></defs>
          <path class="pieno"></path><path class="riga"></path>
        </svg>
        <div class="estremi" hidden><span class="alto"></span><span class="basso"></span></div>
        <div class="mirino" hidden><i class="mira"></i><b class="palla"></b></div>
        <div class="cartellino" hidden></div>
        <div class="tempo" hidden>
          <div class="binario"><i></i></div>
          <div class="ondabox">
            <svg class="onda" viewBox="0 0 300 26" preserveAspectRatio="none">
              <defs><linearGradient id="grOnda" x1="0" y1="0" x2="1" y2="0">
                <stop class="s1" offset="0"></stop><stop class="s2" offset="1"></stop>
              </linearGradient></defs>
              <path class="fondo" d="${ONDA_D}" pathLength="100"></path>
              <path class="fatta" d="${ONDA_D}" pathLength="100" stroke-dasharray="0 100"></path>
            </svg>
            <span class="pallino"></span>
          </div>
          <span class="orologio"></span>
        </div>
        <div class="comandi" hidden>
          <button class="prec" title="Precedente">${segno("prec")}</button>
          <button class="play grosso" title="Play / pausa">${segno("play")}</button>
          <button class="succ" title="Successivo">${segno("succ")}</button>
          <button class="stop" title="Ferma">${segno("stop")}</button>
          <button class="su" title="Apri">${segno("su")}</button>
          <button class="fermo" title="Ferma">${segno("stop")}</button>
          <button class="giu" title="Chiudi">${segno("giu")}</button>
          <button class="chiudi" title="Chiudi a chiave">${segno("serra")}</button>
          <button class="sblocca" title="Apri">${segno("apri")}</button>
          <button class="via" title="Avvia">${segno("play")}</button>
          <button class="sosta" title="Pausa">${segno("pausa")}</button>
          <button class="casa" title="Torna alla base">${segno("base")}</button>
        </div>
        <div class="cursore" hidden><button class="muto" type="button" hidden></button><input type="range" min="0" max="100" step="1"><span class="quanto"></span></div>
        <div class="colori" hidden>
          <input class="tinta" type="range" min="0" max="360" step="1">
          <input class="calore" type="range" min="2000" max="6500" step="50">
          <button class="scambio" type="button" title="Colori o bianco"></button>
        </div>
        <div class="extra" hidden>
          <button class="b-gruppo" type="button">Casse<span class="freccia">\u25BC</span></button>
          <button class="b-fonte" type="button">Sorgente<span class="freccia">\u25BC</span></button>
        </div>
        <div class="pannello gruppo" hidden>
          <div class="p-testa"><span>Casse del gruppo</span><button class="p-chiudi" type="button">&times;</button></div>
          <div class="p-corpo"></div>
        </div>
        <div class="pannello fonti" hidden>
          <div class="p-testa"><span>Sorgente</span><button class="p-chiudi" type="button">&times;</button></div>
          <div class="p-corpo"></div>
        </div>
      </ha-card>
      <div class="popup-anteprima" hidden></div>
      <div class="velo" part="velo">
        <div class="finestra">
          <div class="f-testa">
            <svg class="f-icona" viewBox="0 0 64 64" fill="none"></svg>
            <div class="f-titolo"></div>
            <button class="f-chiudi" title="Chiudi">&times;</button>
          </div>
          <div class="f-corpo"></div>
        </div>
      </div>`;
    this._card = root.querySelector("ha-card");
    this._nome = root.querySelector(".nome");
    this._sotto = root.querySelector(".sotto");
    this._meteo = root.querySelector(".meteo");
    this._cielo = root.querySelector(".cielo");
    this._copertina = root.querySelector(".copertina");
    const apriMeteo = (e) => {
      const eid = this._config.meteo_entita;
      if (!eid) return;
      e.stopPropagation();
      this.dispatchEvent(new CustomEvent("hass-more-info", {
        detail: { entityId: eid }, bubbles: true, composed: true,
      }));
    };
    this._meteo.tabIndex = 0;
    this._meteo.title = "Tocca per le previsioni";
    this._meteo.addEventListener("click", apriMeteo);
    this._meteo.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); apriMeteo(e); }
    });
    this._gradi = root.querySelector(".meteo .gradi");
    this._cond = root.querySelector(".meteo .cond");
    this._svg = root.querySelector("svg.icona");
    this._svgFondo = root.querySelector("svg.iconafondo");
    this._svgHa = root.querySelector(".iconaHa");
    this._svgFoto = root.querySelector(".iconaFoto");
    this._ritratto = root.querySelector("img.ritratto");
    this._valore = root.querySelector(".valore");
    this._chips = root.querySelector(".chips");
    this._firmaChips = null;
    this._andamento = root.querySelector(".andamento");
    this._mirino = root.querySelector(".mirino");
    this._estremi = root.querySelector(".estremi");
    this._scala = root.querySelector(".andamento .scala");
    this._cartellino = root.querySelector(".cartellino");
    const card0 = root.querySelector("ha-card");
    ["pointermove", "pointerdown"].forEach((ev) =>
      card0.addEventListener(ev, (e) => this._muoviMirino(e)));
    ["pointerleave", "pointercancel", "pointerup"].forEach((ev) =>
      card0.addEventListener(ev, () => this._nascondiMirino()));
    this._tempo = root.querySelector(".tempo");
    this._binario = root.querySelector(".tempo .binario i");
    this._fatta = root.querySelector(".ondabox path.fatta");
    this._pallino = root.querySelector(".ondabox .pallino");
    this._orologio = root.querySelector(".tempo .orologio");
    this._comandi = root.querySelector(".comandi");
    ["click", "pointerdown"].forEach((ev) =>
      this._comandi.addEventListener(ev, (e) => e.stopPropagation()));
    const suona = (servizio) => {
      if (this._hass && this._config.entity) {
        this._hass.callService("media_player", servizio, { entity_id: this._config.entity });
      }
    };
    this._comandi.querySelector(".prec").addEventListener("click", () => suona("media_previous_track"));
    this._comandi.querySelector(".play").addEventListener("click", () => suona("media_play_pause"));
    this._comandi.querySelector(".succ").addEventListener("click", () => suona("media_next_track"));
    this._comandi.querySelector(".stop").addEventListener("click", (e) => {
      const quali = e.currentTarget._servizi || ["media_stop"];
      quali.forEach((servizio) => suona(servizio));
    });
    this._lettoriBox = root.querySelector(".lettori");
    ["click", "pointerdown"].forEach((ev) =>
      this._lettoriBox.addEventListener(ev, (e) => e.stopPropagation()));
    this._colori = root.querySelector(".colori");
    this._tinta = root.querySelector(".colori .tinta");
    this._calore = root.querySelector(".colori .calore");
    ["click", "pointerdown"].forEach((ev) =>
      this._colori.addEventListener(ev, (e) => e.stopPropagation()));
    const mandaColore = (quale) => {
      if (!this._hass || !this._config.entity) return;
      const dati = { entity_id: this._config.entity };
      if (quale === "tinta") {
        const st = this._hass.states[this._config.entity];
        const hs = st && st.attributes.hs_color;
        const sat = Array.isArray(hs) && hs[1] > 12 ? hs[1] : 100;
        dati.hs_color = [Number(this._tinta.value), sat];
      } else if (this._calore._finto) {
        // niente lampadine bianche: il bianco lo mescolo coi colori
        dati.rgb_color = coloreDaGradi(Number(this._calore.value));
      } else {
        dati.color_temp_kelvin = Number(this._calore.value);
      }
      this._hass.callService("light", "turn_on", dati);
    };
    [["tinta", this._tinta], ["calore", this._calore]].forEach(([nome, el]) => {
      ["pointerdown", "touchstart", "mousedown", "keydown"].forEach((ev) =>
        el.addEventListener(ev, () => { this._trascinoColore = true; }));
      el.addEventListener("input", () => {
        this._trascinoColore = true;
        clearTimeout(this._frenoColore);
        this._frenoColore = setTimeout(() => mandaColore(nome), 250);
      });
      ["pointerup", "touchend", "mouseup", "keyup"].forEach((ev) =>
        el.addEventListener(ev, () => {
          if (!this._trascinoColore) return;
          mandaColore(nome);
          setTimeout(() => { this._trascinoColore = false; }, 900);
        }));
      el.addEventListener("blur", () => { this._trascinoColore = false; });
    });
    this._scambio = root.querySelector(".colori .scambio");
    this._scambio.addEventListener("click", (e) => {
      e.stopPropagation();
      // lampade con il bianco "secco" (modo white): il tastino non cambia
      // striscia, rimette proprio la luce bianca
      if (this._scambio._soloBianco) {
        const st = this._hass ? this._hass.states[this._config.entity] : null;
        if (!st) return;
        if (st.attributes.color_mode === "white") {
          // e' bianca: la coloro con la tinta che sta sulla striscia
          const hs = st.attributes.hs_color;
          const tono = Number(this._tinta.value)
            || (Array.isArray(hs) ? hs[0] : 30);
          this._hass.callService("light", "turn_on",
            { entity_id: this._config.entity, hs_color: [tono, 100] });
        } else {
          const lum = st.attributes.brightness || 255;
          this._hass.callService("light", "turn_on",
            { entity_id: this._config.entity, white: lum });
        }
        return;
      }
      this._modoColore = this._modoColore === "bianco" ? "tinta" : "bianco";
      this._render();
    });
    this._extra = root.querySelector(".extra");
    this._bGruppo = root.querySelector(".b-gruppo");
    this._bFonte = root.querySelector(".b-fonte");
    this._panGruppo = root.querySelector(".pannello.gruppo");
    this._panFonti = root.querySelector(".pannello.fonti");
    [this._extra, this._panGruppo, this._panFonti].forEach((el) =>
      ["click", "pointerdown"].forEach((ev) =>
        el.addEventListener(ev, (e) => e.stopPropagation())));
    root.querySelectorAll(".p-chiudi").forEach((b) =>
      b.addEventListener("click", () => this._chiudiPannelli()));
    // i comandi rapidi: ogni tasto il suo servizio
    const rapido = (classe, dominio, servizio) => {
      const b = root.querySelector(".comandi ." + classe);
      if (!b) return;
      b.addEventListener("click", (e) => {
        e.stopPropagation();
        if (!this._hass || !this._config.entity) return;
        if (dominio === "cover") {
          if (servizio === "open_cover") this._viaggia(100);
          else if (servizio === "close_cover") this._viaggia(0);
          else this._fermaViaggio(true);
        }
        this._hass.callService(dominio, servizio, { entity_id: this._config.entity });
      });
    };
    rapido("su", "cover", "open_cover");
    rapido("fermo", "cover", "stop_cover");
    rapido("giu", "cover", "close_cover");
    rapido("chiudi", "lock", "lock");
    rapido("sblocca", "lock", "unlock");
    rapido("via", "vacuum", "start");
    rapido("sosta", "vacuum", "pause");
    rapido("casa", "vacuum", "return_to_base");

    this._bGruppo.addEventListener("click", () => this._apriPannello("gruppo"));
    this._bFonte.addEventListener("click", () => this._apriPannello("fonti"));
    this._cursore = root.querySelector(".cursore");
    this._muto = root.querySelector(".cursore .muto");
    ["click", "pointerdown"].forEach((ev) =>
      this._muto.addEventListener(ev, (e) => e.stopPropagation()));
    this._muto.addEventListener("click", () => {
      const st = this._hass ? this._hass.states[this._config.entity] : null;
      if (!st) return;
      this._hass.callService("media_player", "volume_mute", {
        entity_id: this._config.entity,
        is_volume_muted: !st.attributes.is_volume_muted,
      });
    });
    this._range = root.querySelector(".cursore input");
    this._quanto = root.querySelector(".cursore .quanto");
    ["click", "pointerdown", "touchstart"].forEach((ev) =>
      this._cursore.addEventListener(ev, (e) => e.stopPropagation()));
    const soloAllaFine = () => {
      const dom = this._config && this._config.entity
        ? this._config.entity.split(".")[0] : "";
      // un valore impostabile va scritto una volta sola, quando lasci.
      // Le tapparelle uguale: mandare comandi mentre trascini vuol dire
      // farla partire e fermare dieci volte.
      return dom === "number" || dom === "input_number" || dom === "cover";
    };
    const mostra = () => {
      const val = Number(this._range.value);
      if (soloAllaFine()) {
        const st = this._hass ? this._hass.states[this._config.entity] : null;
        const u = (st && st.attributes.unit_of_measurement) || "";
        const min = Number(this._range.min || 0);
        const max = Number(this._range.max || 100);
        const quota = max > min ? ((val - min) / (max - min)) * 100 : 0;
        this._quanto.textContent = val + (u ? " " + u : "");
        this._range.style.setProperty("--riempito", quota.toFixed(1) + "%");
        this._seguiIlDito(val);
        return;
      }
      this._quanto.textContent = this._range.value + "%";
      this._range.style.setProperty("--riempito", this._range.value + "%");
      this._seguiIlDito(val);
    };
    ["pointerdown", "touchstart", "mousedown", "keydown"].forEach((ev) =>
      this._range.addEventListener(ev, () => {
        this._trascino = true;
        this._fermaViaggio(false);
      }));
    ["pointerup", "touchend", "mouseup", "keyup"].forEach((ev) =>
      this._range.addEventListener(ev, () => {
        // solo se stavo davvero trascinando io: se no, toccando altro
        // (o chiudendo il pop-up) partiva un comando da solo
        if (!this._trascino) return;
        // il comando "a meta' strada" che stava per partire non serve piu':
        // se no arriva subito dopo e l'apparecchio fa due bip
        clearTimeout(this._freno);
        this._regola(Number(this._range.value));
        setTimeout(() => { this._trascino = false; }, 900);
      }));
    this._range.addEventListener("blur", () => { this._trascino = false; });
    this._range.addEventListener("input", () => {
      this._trascino = true;
      mostra();
      if (soloAllaFine()) return;   // niente comandi mentre trascini
      // luci e volume: mando mentre trascini, ma non piu' di uno ogni 250 ms
      clearTimeout(this._freno);
      this._freno = setTimeout(() => this._regola(Number(this._range.value)), 250);
    });
    this._range.addEventListener("change", () => {
      mostra();
      if (!this._trascino) return;
      clearTimeout(this._freno);
      this._regola(Number(this._range.value));
    });
    this._antPopup = root.querySelector(".popup-anteprima");
    this._velo = root.querySelector(".velo");
    this._fIcona = root.querySelector(".f-icona");
    this._fTitolo = root.querySelector(".f-titolo");
    this._fCorpo = root.querySelector(".f-corpo");
    this._velo.addEventListener("click", (e) => {
      if (e.target === this._velo) this._chiudiFinestra();
    });
    root.querySelector(".f-chiudi").addEventListener("click", () => this._chiudiFinestra());
    const azione = () => this._azione();
    this._card.addEventListener("click", azione);
    this._card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); azione(); }
    });
    this._costruito = true;
  }

  _azione() {
    // Se sono l'anteprima della finestra delle impostazioni, toccarmi non
    // deve aprire il pop-up: deve dire "sistema ME" al riquadro qui sotto.
    // (Prima era l'unica casella che non si riusciva a scegliere.)
    if (!this.hasAttribute("solo-casella") && this._sonoAnteprima
      && !this._dentroUnAltraAnteprima()) {
      this.dispatchEvent(new CustomEvent("casa-scegli-scheda", {
        detail: { config: this._config, elemento: this },
        bubbles: true, composed: true,
      }));
      return;
    }
    const c = this._config;
    const schede = c.finestra_cards || (c.finestra_card ? [c.finestra_card] : null);
    // senza entita' l'unica cosa sensata e' aprire il pop-up
    if (!c.entity) {
      if (c.azione === "servizio") { this._chiamaServizio(); return; }
    if (c.azione === "mappa") { this._apriMappa(); return; }
      if (c.azione === "link" && c.indirizzo_web) {
        window.open(c.indirizzo_web, "_blank", "noopener");
        return;
      }
      if (c.azione === "popup" && c.popup) {
        window.history.pushState(null, "", c.popup);
        window.dispatchEvent(new Event("location-changed"));
      } else if ((schede && schede.length) || c.azione === "finestra") {
        this._apriFinestra();
      }
      return;
    }
    if (!this._hass) return;
    if (c.azione === "servizio") { this._chiamaServizio(); return; }
    if (c.azione === "toggle") {
      const dominio = c.entity.split(".")[0];
      const servizio = ["light", "switch", "fan", "input_boolean", "automation", "humidifier", "siren"].includes(dominio)
        ? "homeassistant" : null;
      if (servizio) { this._hass.callService("homeassistant", "toggle", { entity_id: c.entity }); return; }
    }
    if (c.azione === "finestra") { this._apriFinestra(); return; }
    if (c.azione === "mappa") { this._apriMappa(); return; }
    if (c.azione === "link" && c.indirizzo_web) {
      window.open(c.indirizzo_web, "_blank", "noopener");
      return;
    }
    if (c.azione === "popup" && c.popup) {
      window.history.pushState(null, "", c.popup);
      window.dispatchEvent(new Event("location-changed"));
      return;
    }
    this.dispatchEvent(new CustomEvent("hass-more-info", {
      detail: { entityId: c.entity }, bubbles: true, composed: true,
    }));
  }

  _chiamaServizio() {
    const c = this._config;
    const pezzi = String(c.servizio || "").trim().split(".");
    if (!this._hass || pezzi.length !== 2 || !pezzi[0] || !pezzi[1]) return;
    let dati = {};
    try {
      const letti = c.servizio_dati ? daYaml(c.servizio_dati) : null;
      if (letti && typeof letti === "object") dati = { ...letti };
    } catch (e) { /* dati scritti male: mando il comando senza */ }
    if (c.entity && !dati.entity_id && !dati.target && !dati.device_id && !dati.area_id) {
      dati.entity_id = c.entity;
    }
    this._hass.callService(pezzi[0], pezzi[1], dati);
  }

  _apriMappa() {
    const c = this._config;
    const st = this._hass ? this._hass.states[c.entity] : null;
    let dove = null;
    if (st && st.attributes.latitude !== undefined && st.attributes.longitude !== undefined) {
      dove = st.attributes.latitude + "," + st.attributes.longitude;
    } else if (c.sottotitolo_entita && this._hass) {
      const alt = this._hass.states[c.sottotitolo_entita];
      if (alt && alt.state && alt.state.length > 4) dove = alt.state;
    } else if (st && st.state && st.state.length > 4) {
      dove = st.state;
    }
    if (!dove) {
      this._fTitolo && (this._fTitolo.textContent = "");
      window.alert("Questa entita non dice dove si trova: non ha ne le coordinate "
        + "ne un indirizzo. Scegli un'entita con la posizione, oppure indica "
        + "l'entita dell'indirizzo nel campo del sottotitolo.");
      return;
    }
    window.open("https://www.google.com/maps/search/?api=1&query="
      + encodeURIComponent(dove), "_blank", "noopener");
  }

  // I pezzi che ha spostato lui: li poso dove ha detto, in percentuale
  // sulla casella, cosi' vanno bene a qualsiasi misura.
  _mettiAPosto() {
    const posti = this._config.posti;
    const liberi = !!posti && Object.keys(posti).length > 0;
    if (!liberi && !this.hasAttribute("liberi")) return;
    this.toggleAttribute("liberi", liberi);
    const pezzi = {
      nome: [".testi"],
      misure: [".chips"],
      valore: [".valore"],
      icona: ["svg.icona", "img.ritratto", ".iconaHa", ".iconaFoto"],
      cursore: [".cursore"],
      comandi: [".comandi"],
      // i pezzi del lettore musicale: l'onda del tempo, i tasti del gruppo
      // e della sorgente, l'elenco delle casse, la striscia dei colori.
      // Senza questi, in una casella a pezzi liberi restavano piantati in
      // cima uno sopra l'altro, e non c'era modo di prenderli.
      tempo: [".tempo"],
      extra: [".extra"],
      lettori: [".lettori"],
      colori: [".colori"],
    };
    // la barra e i tasti tengono la loro larghezza in percentuale: non sono
    // scritte, allargarli o stringerli e' proprio quello che vuole
    const larghi = { cursore: 1, comandi: 1, tempo: 1, colori: 1, lettori: 1 };
    // Ogni pezzo si porta scritto addosso l'ultima disposizione che gli ho
    // dato: se non e' cambiata non riscrivo niente. Serve, perche' qui si
    // passa due volte per ogni ridisegno di ogni casella.
    // la firma la calcolo solo quando cambia la configurazione, e la
    // appiccico ai pezzi come proprieta' (scrivere un attributo lungo su
    // ogni pezzo a ogni giro costa piu' del lavoro che risparmia)
    if (this._firmaPostiDi !== posti) {
      this._firmaPostiDi = posti;
      this._firmaPosti = liberi ? JSON.stringify(posti) : "-";
    }
    const firma = this._firmaPosti;
    // se non e' cambiato niente - ne la disposizione, ne le misure che
    // vengono rifatte a ogni valore nuovo - non c'e' niente da rimettere
    // a posto: qui ci si passa due volte per ogni ridisegno.
    if (this._postiFatti === firma && this._chipsViste === this._firmaChips) return;
    this._postiFatti = firma;
    this._chipsViste = this._firmaChips;
    Object.keys(pezzi).forEach((chi) => {
      const dove = liberi ? posti[chi] : null;
      pezzi[chi].forEach((sel) => {
        const el = this.shadowRoot.querySelector(sel);
        if (!el) return;
        if (el._posato === firma) return;
        el._posato = firma;
        if (dove && isFinite(dove.x) && isFinite(dove.y)) {
          this._posaPezzo(el, dove, chi === "icona", larghi[chi]);
        } else {
          el.style.left = "";
          el.style.top = "";
          el.style.right = "";
          el.style.width = "";
          el.style.maxWidth = "";
          el.style.height = "";
          el.style.maxHeight = "";
          el.style.transform = "";
          el.style.transformOrigin = "";
        }
      });
    });
    // e ogni misura per conto suo: si spostano una per una
    const base = (liberi && posti.misure) ? posti.misure : { x: 58, y: 8 };
    this.shadowRoot.querySelectorAll(".chips .metrica").forEach((el, i) => {
      if (el._posato === firma) return;
      el._posato = firma;
      const suo = liberi ? posti["misura:" + el.dataset.eid] : null;
      if (!liberi) {
        el.style.left = ""; el.style.top = ""; el.style.width = "";
        el.style.transform = ""; el.style.transformOrigin = "";
        return;
      }
      const dove = (suo && isFinite(suo.x)) ? suo
        : { x: base.x, y: base.y + i * 13 };
      this._posaPezzo(el, dove, false);
    });
  }

  // Poso un pezzo. Due accortezze imparate a spese sue:
  // - la larghezza NON la fisso in percentuale. La casella vera puo' essere
  //   piu' stretta dell'anteprima, e le scritte non rimpiccioliscono con
  //   lei: una larghezza in percentuale mandava "74 %" a capo, col numero
  //   sopra e il segno sotto. Gli lascio la sua misura naturale.
  // - se il pezzo sta nella meta' destra lo attacco al bordo DESTRO. Cosi'
  //   su una casella piu' stretta resta al suo posto invece di scivolare
  //   verso il centro.
  _posaPezzo(el, dove, eIcona, eLargo) {
    const w = isFinite(dove.w) ? dove.w : 0;
    const aDestra = isFinite(dove.dx) && (dove.x + w / 2) > 50;
    if (aDestra) {
      el.style.left = "auto";
      el.style.right = dove.dx + "%";
    } else {
      el.style.right = "auto";
      el.style.left = dove.x + "%";
    }
    el.style.top = dove.y + "%";
    // la grandezza scelta a mano. Ingrandisco col "transform" e non con la
    // misura del carattere: cosi' funziona uguale per una scritta, per un
    // disegno, per la barra e per i tasti, e il pezzo non va a capo mentre
    // cresce. Il punto fermo e' l'angolo da cui e' attaccato, se no
    // ingrandendo scapperebbe via dal posto dove l'ha messo.
    const k = isFinite(dove.s) && dove.s > 0 ? dove.s : 1;
    if (k !== 1) {
      el.style.transformOrigin = aDestra ? "top right" : "top left";
      el.style.transform = "scale(" + k + ")";
    } else {
      el.style.transform = "";
      el.style.transformOrigin = "";
    }
    if (eIcona) {
      if (isFinite(dove.h)) {
        el.style.height = dove.h + "%";
        el.style.maxHeight = "none";
      }
      return;
    }
    if (eLargo && w > 0) {
      el.style.width = w + "%";
      el.style.maxWidth = "none";
      return;
    }
    el.style.width = "max-content";
    const spazio = aDestra ? (dove.x + w) : (100 - dove.x);
    el.style.maxWidth = "calc(" + Math.max(15, Math.round(spazio)) + "% - 6px)";
  }

  // Sto dentro alla plancia in modifica? In modifica Home Assistant mi
  // avvolge in "hui-card-options" e la plancia e' un po' diversa da come
  // sara' davvero (compare la colonna dei "+"), quindi quella misura non
  // vale come modello.
  // Dove mi trovo? "prova" = un posto che NON vale come misura vera (le
  // anteprime e la plancia in modifica), "pop" = dentro a un pop-up,
  // "" = sulla plancia per davvero.
  _dovesto() {
    // costa il giro di tutti gli antenati: lo faccio una volta sola, tanto
    // finche' resto attaccato qui il posto non cambia
    if (this._postoSalvato) return this._postoSalvato;
    let n = this;
    let pop = false;
    // profondo: una casella dentro a una griglia dentro al pop-up sta
    // sotto a un bel po' di gusci, e fermandomi troppo presto la contavo
    // come casella della plancia
    for (let i = 0; i < 40; i += 1) {
      n = n.parentNode || n.host;
      if (!n) break;
      const nome = String(n.localName || "");
      const cl = (n.classList && n.classList.contains) ? n.classList : null;
      if (nome === "hui-card-options" || nome === "hui-card-edit-mode"
        || nome === "hui-dialog-edit-card" || nome === "hui-dialog-more-info"
        || (cl && (cl.contains("element-preview") || cl.contains("popup-anteprima")
          || cl.contains("pista")))) {
        this._postoSalvato = "prova";
        return "prova";
      }
      // sopra di me c'e' un'altra casella: sono dentro al SUO pop-up
      if (cl && cl.contains("f-corpo")) pop = true;
      if (nome === "casa-tile") pop = true;
      if (nome === "hui-view" || nome === "hui-sections-view"
        || nome === "hui-masonry-view" || nome === "hui-panel-view") break;
    }
    this._postoSalvato = pop ? "pop" : "";
    return this._postoSalvato;
  }

  _inModifica() { return this._dovesto() === "prova"; }

  // Sono l'anteprima dentro alla finestra delle impostazioni? Allora mi
  // metto della misura che ho davvero sulla plancia: guardare un'anteprima
  // larga il doppio e poi trovarsi la casella stretta e' il modo migliore
  // per comporre una disposizione che poi non ci sta.
  _vestiAnteprima() {
    if (this.hasAttribute("solo-casella")) return;
    // dentro alla finestra delle impostazioni sto fermo: niente animazioni
    this.toggleAttribute("in-anteprima", this._dentroAnteprima());
    // la risposta e' sempre la stessa finche' sto dove sto: me la segno,
    // se no rifaccio il giro degli antenati a ogni ridisegno di ogni
    // casella e la plancia si trascina
    if (this._sonoAnteprima === false) return;
    // SOLO l'anteprima della finestra "Configurazione scheda": non le
    // caselle dentro ai pop-up, che stanno anche loro dentro a una finestra
    // ma non c'entrano niente e non vanno ridimensionate.
    let dentro = false;
    let n = this;
    for (let i = 0; i < 40; i += 1) {
      n = n.parentNode || n.host;
      if (!n) break;
      const nome = String(n.localName || "");
      if (nome === "hui-card-options" || nome === "hui-card-edit-mode"
        || nome === "casa-tile" || nome === "hui-dialog-more-info") {
        this._sonoAnteprima = false;
        return;
      }
      const classi = (n.classList && n.classList.contains) ? n.classList : null;
      if (classi && (classi.contains("f-corpo") || classi.contains("popup-anteprima"))) {
        this._sonoAnteprima = false;
        return;
      }
      if (nome === "hui-dialog-edit-card"
          || (classi && classi.contains("element-preview"))) {
        dentro = true;
        break;
      }
    }
    this._sonoAnteprima = dentro;
    if (!dentro) return;
    // la chiave me la faccio qui: `_chiaveMisura()` di proposito non risponde
    // dentro alle anteprime (li' la misura non va SCRITTA), ma io la devo
    // LEGGERE - ed e' proprio questo il posto dove serve
    const c = this._config || {};
    if (!c.entity && !c.name) return;
    const base = "casa-tile:misura3:" + (c.entity || "") + "|" + (c.name || "");
    let detta = "";
    try {
      detta = localStorage.getItem(base) || localStorage.getItem(base + "|pop") || "";
    } catch (e) { /* pazienza */ }
    const pezzi = String(detta).split("x");
    const w = Number(pezzi[0]);
    const h = Number(pezzi[1]);
    if (!(w > 90) || !(h > 40)) return;
    if (this._anteprimaVestita === detta) return;
    const card = this.shadowRoot && this.shadowRoot.querySelector("ha-card");
    if (!card) return;
    this._anteprimaVestita = detta;
    // La misura la do alla CASELLA, non a tutto l'elemento: sotto alla
    // casella ci sta il riquadro "Contenuto del pop-up", e stringendo tutto
    // stringevo anche quello (e il pop-up non c'entra niente con quanto e'
    // larga la casella sulla plancia).
    this.style.maxWidth = "";
    this.style.height = "";
    card.style.maxWidth = Math.round(w) + "px";
    card.style.height = Math.round(h) + "px";
    this._largoAntPopup();
  }

  _chiaveMisura() {
    const c = this._config || {};
    if (!c.entity && !c.name) return "";
    const dove = this._dovesto();
    if (dove === "prova") return "";
    return "casa-tile:misura3:" + (c.entity || "") + "|" + (c.name || "")
      + (dove === "pop" ? "|pop" : "");
  }

  // me la segno: e' quella che il riquadro delle impostazioni deve copiare
  _ricordaMisura(w, h) {
    if (!w || !h || this.hasAttribute("solo-casella")) return;
    const detta = Math.round(w) + "x" + Math.round(h);
    if (this._misuraDetta === detta) return;
    if (this._inModifica()) return;
    const k = this._chiaveMisura();
    if (!k) return;
    this._misuraDetta = detta;
    // Mi segno la misura di ADESSO. Avevo provato a tenere la piu' stretta
    // mai vista (la casella e' larga diversa con la barra laterale di Home
    // Assistant aperta o chiusa), ma cosi' il riquadro restava per sempre
    // piu' piccolo del vero e lui vedeva la casella "ristretta".
    try { localStorage.setItem(k, detta); } catch (e) { /* pazienza */ }
  }

  // Il riquadro DENTRO al bordo della casella. Sembra un dettaglio da
  // nulla ma non lo e': un pezzo messo a "left: 50%" parte da dentro il
  // bordo, non da fuori. Misurando il bordo esterno sbagliavo di un paio
  // di pixel ogni volta, ed era il motivo per cui i pezzi non si posavano
  // esattamente dove li lasciava.
  riquadroCasella() {
    const card = this.shadowRoot && this.shadowRoot.querySelector("ha-card");
    if (!card) return null;
    const r = card.getBoundingClientRect();
    if (!r.width || !r.height) return null;
    const st = getComputedStyle(card);
    const bs = parseFloat(st.borderLeftWidth) || 0;
    const ba = parseFloat(st.borderTopWidth) || 0;
    return {
      left: r.left + bs,
      top: r.top + ba,
      width: card.clientWidth || r.width,
      height: card.clientHeight || r.height,
    };
  }

  // dove sta adesso ogni pezzo, in percentuale: serve a partire dalla
  // posizione vera quando si comincia a trascinare
  posizioniAdesso() {
    const q = this.riquadroCasella();
    if (!q) return {};
    const pezzi = {
      nome: ".testi", misure: ".chips", valore: ".valore",
      icona: "svg.icona:not([hidden]), img.ritratto:not([hidden]), "
        + ".iconaHa:not([hidden]), .iconaFoto:not([hidden])",
      cursore: ".cursore:not([hidden])",
      comandi: ".comandi:not([hidden])",
      tempo: ".tempo:not([hidden])",
      extra: ".extra:not([hidden])",
      lettori: ".lettori:not([hidden])",
      colori: ".colori:not([hidden])",
    };
    const fuori = {};
    const segna = (chi, el) => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      if (!r.width) return;
      fuori[chi] = {
        x: Math.round((r.left - q.left) / q.width * 1000) / 10,
        y: Math.round((r.top - q.top) / q.height * 1000) / 10,
        w: Math.round(r.width / q.width * 1000) / 10,
        h: Math.round(r.height / q.height * 1000) / 10,
        // quanto dista dal bordo destro: serve ai pezzi di destra
        dx: Math.round((q.left + q.width - r.right) / q.width * 1000) / 10,
      };
    };
    Object.keys(pezzi).forEach((chi) =>
      segna(chi, this.shadowRoot.querySelector(pezzi[chi])));
    this.shadowRoot.querySelectorAll(".chips .metrica").forEach((el) =>
      segna("misura:" + el.dataset.eid, el));
    return fuori;
  }

  _vestiFinestra() {
    const c = this._config;
    const tinta = Array.isArray(c.finestra_sfondo) ? daRgb(c.finestra_sfondo) : null;
    const opaco = 1 - (c.finestra_trasparenza === undefined
      ? 0 : Number(c.finestra_trasparenza)) / 100;
    const foto = String(c.finestra_immagine || "").trim();
    if (tinta || opaco < 1 || foto) {
      const alto = tinta || "#111a26";
      const basso = tinta ? scurisci(tinta, 0.62) : "#0a1019";
      let fondo = "linear-gradient(160deg, " + conAlfa(alto, opaco) + " 0%, "
        + conAlfa(basso, opaco) + " 100%)";
      if (foto) fondo += ', url("' + foto + '") center/cover no-repeat';
      this.style.setProperty("--fin-bg", fondo);
    } else {
      this.style.removeProperty("--fin-bg");
    }

    // e ogni scheda dentro si rimette il suo vestito
    if (this._fCorpo) {
      this._fCorpo.querySelectorAll(".vestito").forEach((b) =>
        this._vestiScheda(b, Number(b.dataset.n) || 0));
    }
    if (this._antPopup) {
      this._antPopup.querySelectorAll(".vestito").forEach((b) =>
        this._vestiScheda(b, Number(b.dataset.n) || 0));
    }
  }

  async _apriFinestra() {
    const c = this._config;
    // qui lo stato me lo prendo da solo: non arriva da fuori
    const suoStato = (this._hass && c.entity) ? this._hass.states[c.entity] : null;
    this._fTitolo.textContent = c.finestra_titolo || this._nome.textContent;
    const nomeIco = this._nomeIcona(suoStato);
    this._fIcona.innerHTML = nomeIco === "batteria"
      ? (() => { const b = this._datiBatteria(suoStato);
                 return disegnoBatteria(b.perc, b.carica, b.scarica); })()
      : (ICONE[nomeIco] || disegnoMdi(nomeIco) || ICONE.luce);
    riempiRiquadro(this._fIcona, nomeIco);
    this._velo.toggleAttribute("aperto", true);
    document.addEventListener("keydown", this._esc = (e) => {
      if (e.key === "Escape") this._chiudiFinestra();
    });
    if (this._fCorpo.childElementCount) { this._aggiornaFinestra(); return; }

    const scelte = c.finestra_cards || (c.finestra_card ? [c.finestra_card] : null);
    const elenco = (c.finestra_entita && c.finestra_entita.length)
      ? c.finestra_entita : (c.entity ? [c.entity] : []);
    let tipo = c.finestra_scheda || "entities";
    if (tipo === "altra") tipo = (c.finestra_scheda_altra || "entities").trim();

    const schede = [];
    if (scelte && scelte.length) { return this._montaSchede(scelte); }
    if (!elenco.length) { return this._montaSchede([]); }
    if (c.finestra_grafico) {
      schede.push({ type: "history-graph", hours_to_show: 24, entities: elenco });
    }
    // alcune schede vogliono la lista di entita', le altre una per volta
    const MULTI = ["entities", "glance", "history-graph", "statistics-graph",
                   "logbook", "map", "distribution"];
    if (MULTI.includes(tipo)) {
      schede.push({ type: tipo, entities: elenco });
    } else {
      elenco.forEach((e) => schede.push({ type: tipo, entity: e }));
    }

    return this._montaSchede(schede);
  }

  // che colore ha la scheda numero i: prima il suo, poi quello generale
  _vestiScheda(busta, i) {
    const c = this._config;
    const suoi = Array.isArray(c.finestra_schede_stile) ? c.finestra_schede_stile : [];
    const mio = suoi[i] || {};
    const tinta = Array.isArray(mio.sfondo) ? daRgb(mio.sfondo)
      : (Array.isArray(c.finestra_schede_sfondo) ? daRgb(c.finestra_schede_sfondo) : null);
    const via = mio.trasparenza !== undefined && mio.trasparenza !== null
      ? Number(mio.trasparenza)
      : (c.finestra_schede_trasparenza === undefined
        ? null : Number(c.finestra_schede_trasparenza));
    if (!tinta && (via === null || via === 0)) {
      busta.removeAttribute("style");
      busta.toggleAttribute("vestita", false);
      return;
    }
    const opaco = 1 - (via === null ? 0 : via) / 100;
    const base = tinta || "#141d2b";
    busta.style.setProperty("--ha-card-background", conAlfa(base, opaco));
    busta.style.setProperty("--card-background-color", conAlfa(base, opaco));
    busta.style.setProperty("--ha-card-border-color",
      conAlfa(base, Math.min(1, opaco + 0.18)));
    busta.style.setProperty("--ha-card-box-shadow", "none");
    busta.toggleAttribute("vestita", true);
  }

  async _montaSchede(schede) {
    try {
      const helpers = await window.loadCardHelpers();
      this._schede = [];
      schede.forEach((cfg, i) => {
        try {
          const el = helpers.createCardElement(cfg);
          el.hass = this._hass;
          // ogni scheda dentro il pop-up si veste per conto suo
          const busta = document.createElement("div");
          busta.className = "vestito";
          busta.dataset.n = String(i);
          this._vestiScheda(busta, i);
          busta.appendChild(el);
          this._fCorpo.appendChild(busta);
          this._schede.push(el);
        } catch (err) {
          const avviso = document.createElement("div");
          avviso.style.cssText = "color:#ff9a9a;font-size:13px";
          avviso.textContent = 'La scheda "' + cfg.type + '" non funziona con questa entita.';
          this._fCorpo.appendChild(avviso);
        }
      });
    } catch (err) {
      this._fCorpo.textContent = "Non riesco a creare il contenuto della finestra.";
    }
  }

  _chiudiFinestra() {
    this._velo.toggleAttribute("aperto", false);
    if (this._esc) { document.removeEventListener("keydown", this._esc); this._esc = null; }
  }

  _aggiornaFinestra() {
    if (this._schede) this._schede.forEach((el) => { el.hass = this._hass; });
  }

  _simbolo(st, eid) {
    const dc = (st.attributes && st.attributes.device_class) || "";
    const id = eid.toLowerCase();
    if (dc === "battery" || id.includes("battery") || id.includes("batteria")) return "\uD83D\uDD0B";
    if (dc === "signal_strength" || id.includes("wi_fi") || id.includes("wifi")
        || id.includes("linkquality")) return "\uD83D\uDCF6";
    if (dc === "temperature") return "\uD83C\uDF21";
    if (dc === "humidity" || dc === "moisture") return "\uD83D\uDCA7";
    if (dc === "power" || dc === "energy" || dc === "current" || dc === "voltage") return "\u26A1";
    if (dc === "connectivity" || id.startsWith("device_tracker.")) return "\uD83D\uDCE1";
    if (id.startsWith("person.")) return "\uD83D\uDC64";
    if (dc === "timestamp" || id.includes("time")) return "\u23F1";
    return "\u2022";
  }

  // il nome che si vede sulla caselletta: prima quello scritto da lui,
  // poi (se lo chiede) quello automatico. Senza nessuno dei due resta solo
  // il numero, come e' sempre stato.
  _nomeMisura(st, eid) {
    const suo = (this._config.info_nomi || {})[eid];
    if (suo !== undefined && suo !== null && String(suo).trim() !== "") {
      return String(suo).trim().slice(0, 14);
    }
    if (this._config.info_nomi_auto) return this._etichetta(st, eid);
    return "";
  }

  _etichetta(st, eid) {
    const dc = (st.attributes && st.attributes.device_class) || "";
    const id = (eid + " " + ((st.attributes && st.attributes.friendly_name) || ""))
      .toLowerCase().replace(/[\s-]+/g, "_");
    if (dc === "battery" || id.includes("battery_level")) return "BATTERIA";
    if (id.includes("battery_state") || id.includes("charger")) return "CARICA";
    if (id.includes("wi_fi") || id.includes("wifi") || dc === "signal_strength"
        || id.includes("linkquality")) return "RETE";
    if (dc === "temperature") return "TEMP.";
    if (dc === "humidity") return "UMIDITA";
    if (dc === "moisture") return "TERRENO";
    if (dc === "power") return "POTENZA";
    if (dc === "energy") return "ENERGIA";
    if (id.includes("geocoded")) return "DOVE";
    if (id.startsWith("device_tracker.")) return "POSIZIONE";
    const nome = String((st.attributes && st.attributes.friendly_name) || eid.split(".")[1]);
    const pezzi = nome.split(" ");
    return pezzi[pezzi.length - 1].toUpperCase().slice(0, 10);
  }

  _disegnaCielo(tipo) {
    if (!this._cielo) return;
    if (!tipo) {
      this._cielo.hidden = true;
      this._cielo.innerHTML = "";
      this._cieloOra = null;
      return;
    }
    this._cielo.hidden = false;
    if (this._cieloOra === tipo) return;
    this._cieloOra = tipo;
    this._cielo.innerHTML = "";

    const caso = (min, max) => min + Math.random() * (max - min);
    const metti = (classe, stile, dentro) => {
      const d = document.createElement("div");
      d.className = classe;
      if (stile) d.setAttribute("style", stile);
      if (dentro) d.innerHTML = dentro;
      this._cielo.appendChild(d);
      return d;
    };

    // una nuvola e' un gruppo di gobbe: cosi' sembra una nuvola vera
    const nuvola = (x, y, largo, classe) => {
      const alto = largo * 0.42;
      const gobbe = [
        [0, 0, largo * 0.52, alto * 0.72],
        [largo * 0.26, -alto * 0.34, largo * 0.56, alto],
        [largo * 0.58, -alto * 0.12, largo * 0.46, alto * 0.82],
      ].map((g) => '<i style="left:' + g[0].toFixed(0) + "px;bottom:"
        + (-g[1]).toFixed(0) + "px;width:" + g[2].toFixed(0) + "px;height:"
        + g[3].toFixed(0) + 'px"></i>').join("");
      metti("nube" + (classe ? " " + classe : ""),
        "left:" + x + "%;top:" + y + "%;width:" + largo + "px;height:"
        + alto.toFixed(0) + "px;animation-delay:" + caso(-20, 0).toFixed(1) + "s",
        gobbe);
    };

    const stelle = (quante, altezzaMax) => {
      for (let i = 0; i < quante; i += 1) {
        const d = caso(1, 2.4);
        metti("stella", "left:" + caso(2, 97).toFixed(1) + "%;top:"
          + caso(3, altezzaMax).toFixed(1) + "%;width:" + d.toFixed(1)
          + "px;height:" + d.toFixed(1) + "px;opacity:" + caso(.35, 1).toFixed(2)
          + ";box-shadow:0 0 " + (d * 2.4).toFixed(1)
          + "px rgba(214,226,255,.9);animation-delay:" + caso(0, 4).toFixed(1)
          + "s;animation-duration:" + caso(2.4, 5.2).toFixed(1) + "s");
      }
    };

    const luna = () => {
      const d = 30;
      const crateri = [[30, 26, 8], [52, 52, 6], [24, 58, 5]]
        .map((c) => '<i style="left:' + c[0] + "%;top:" + c[1] + "%;width:"
          + c[2] + "px;height:" + c[2] + 'px"></i>').join("");
      metti("luna", "right:9%;top:10%;width:" + d + "px;height:" + d + "px", crateri);
    };

    const pioggia = (quante, velocita) => {
      for (let i = 0; i < quante; i += 1) {
        const x = caso(-4, 100);
        metti("goccia", "left:" + x.toFixed(1) + "%;height:"
          + caso(9, 17).toFixed(0) + "px;animation-duration:"
          + caso(velocita * 0.75, velocita * 1.3).toFixed(2)
          + "s;animation-delay:" + caso(-2, 0).toFixed(2) + "s;opacity:"
          + caso(.5, 1).toFixed(2));
      }
    };

    if (tipo === "stelle") {
      stelle(26, 82);
      luna();
      metti("cadente", "left:8%;top:14%;animation-delay:3s");
      metti("cadente", "left:52%;top:6%;animation-delay:11s;animation-duration:13s");
    } else if (tipo === "sole") {
      const raggi = [];
      for (let i = 0; i < 12; i += 1) {
        raggi.push('<i style="height:' + caso(16, 30).toFixed(0)
          + "px;transform:rotate(" + (i * 30) + "deg) translate(-50%, 26px)"
          + ";opacity:" + caso(.25, .6).toFixed(2) + '"></i>');
      }
      metti("sole", "right:-6%;top:-26%;width:150px;height:150px",
        '<div class="alone"></div><div class="raggi">' + raggi.join("")
        + '</div><div class="cuore"></div>');
      nuvola(-12, 62, 74, "lenta");
    } else if (tipo === "sole_nuvole") {
      const raggi = [];
      for (let i = 0; i < 10; i += 1) {
        raggi.push('<i style="height:' + caso(14, 26).toFixed(0)
          + "px;transform:rotate(" + (i * 36) + "deg) translate(-50%, 22px)"
          + ";opacity:" + caso(.2, .5).toFixed(2) + '"></i>');
      }
      metti("sole", "right:2%;top:-30%;width:120px;height:120px",
        '<div class="alone"></div><div class="raggi">' + raggi.join("")
        + '</div><div class="cuore"></div>');
      nuvola(-14, 30, 96);
      nuvola(46, 52, 70, "lenta");
    } else if (tipo === "nuvole") {
      nuvola(-16, 18, 104, "scura");
      nuvola(38, 40, 84, "lenta scura");
      nuvola(12, 64, 62, "scura");
    } else if (tipo === "pioggia") {
      nuvola(-14, 2, 108, "scura");
      nuvola(44, 12, 80, "lenta scura");
      pioggia(26, 1.1);
      for (let i = 0; i < 5; i += 1) {
        metti("schizzo", "left:" + caso(6, 92).toFixed(1)
          + "%;animation-delay:" + caso(-1, 0).toFixed(2) + "s");
      }
    } else if (tipo === "lampo") {
      nuvola(-14, 0, 112, "scura");
      nuvola(42, 10, 86, "lenta scura");
      pioggia(34, 0.85);
      metti("lampo");
    } else if (tipo === "neve") {
      nuvola(-12, 2, 100, "scura");
      for (let i = 0; i < 20; i += 1) {
        const d = caso(2, 4.2);
        metti("fiocco", "left:" + caso(0, 98).toFixed(1) + "%;width:"
          + d.toFixed(1) + "px;height:" + d.toFixed(1) + "px;animation-duration:"
          + caso(5, 11).toFixed(1) + "s;animation-delay:" + caso(-6, 0).toFixed(1)
          + "s;opacity:" + caso(.6, 1).toFixed(2));
      }
    } else if (tipo === "nebbia") {
      metti("banda", "top:12%");
      metti("banda", "top:42%;animation-duration:30s;animation-direction:alternate-reverse");
      metti("banda", "top:70%;animation-duration:26s");
      nuvola(-10, 30, 90, "lenta");
    } else if (tipo === "vento") {
      nuvola(-14, 16, 92, "lenta");
      for (let i = 0; i < 6; i += 1) {
        metti("soffio", "top:" + caso(12, 88).toFixed(1) + "%;left:"
          + caso(-10, 20).toFixed(1) + "%;width:" + caso(30, 70).toFixed(0)
          + "px;animation-delay:" + caso(-4, 0).toFixed(1)
          + "s;animation-duration:" + caso(3.2, 6).toFixed(1) + "s");
      }
    }
  }

  // quanti km da casa, se l'entita' dice dove si trova
  _quantoLontanoDaCasa(st) {
    const c = this._config;
    if (c.mostra_distanza === false) return "";
    if (!st || !this._hass) return "";
    // a casa la distanza non serve: Waze risponderebbe 0 km e 0 minuti
    if (String(st.state).toLowerCase() === "home") return "";
    // se ha un sensore del percorso (Waze, Google) vince quello: sono i
    // chilometri veri su strada, non quelli in linea d'aria
    if (c.distanza_entita) {
      const suo = this._hass.states[c.distanza_entita];
      if (suo && !["unknown", "unavailable"].includes(String(suo.state))) {
        const pezzi = [];
        // Waze e Google: i km stanno negli attributi, i minuti nello stato
        const km = parseFloat(suo.attributes.distance);
        if (!isNaN(km) && km < 0.3) return "";
        if (!isNaN(km)) {
          pezzi.push((km < 100 ? (Math.round(km * 10) / 10) : Math.round(km))
            .toLocaleString("it-IT") + " km");
        }
        const n2 = parseFloat(suo.state);
        const u2 = suo.attributes.unit_of_measurement || "";
        if (!isNaN(n2) && u2 === "min") {
          const ore = Math.floor(n2 / 60);
          const min = Math.round(n2 % 60);
          pezzi.push(ore ? ore + " h" + (min ? " " + (min < 10 ? "0" : "") + min : "")
            : min + " min");
        } else if (!isNaN(n2)) {
          pezzi.push((Math.round(n2 * 10) / 10).toLocaleString("it-IT")
            + (u2 ? " " + u2 : ""));
        } else {
          pezzi.push(suo.state);
        }
        return pezzi.join(" · ") + " da casa";
      }
    }
    const lat = st.attributes.latitude;
    const lon = st.attributes.longitude;
    if (lat === undefined || lon === undefined) return "";
    const casa = this._hass.states["zone.home"];
    if (!casa || casa.attributes.latitude === undefined) return "";
    const km = quantoLontano(lat, lon, casa.attributes.latitude,
      casa.attributes.longitude);
    if (!isFinite(km)) return "";
    if (km < 0.15) return "";
    if (km < 1) return Math.round(km * 1000) + " m da casa";
    // sopra i 30 km la differenza con la strada si sente: lo dico
    const numero = km < 100
      ? (Math.round(km * 10) / 10).toLocaleString("it-IT")
      : Math.round(km).toLocaleString("it-IT");
    return numero + " km da casa" + (km > 30 ? " in linea d’aria" : "");
  }

  // La telecamera a tutta casella. L'immagine di Home Assistant e' uno
  // scatto: per farla sembrare una diretta le cambio la coda ogni tot
  // secondi, cosi' il browser la richiede di nuovo. La carico di nascosto
  // prima di metterla, se no si vedrebbe il buco mentre arriva.
  _immagineDiretta(st) {
    const c = this._config;
    const dominio = c.entity ? c.entity.split(".")[0] : "";
    const puo = (dominio === "camera" || dominio === "image") && !!c.camera_diretta
      && !c.sfondo_immagine;
    if (!puo || !st) { this._fermaDiretta(); return null; }
    const base = fotoDi(st);
    if (!base) { this._fermaDiretta(); return null; }
    this._avviaDiretta();
    const scatto = this._scattoDiretta || 0;
    return base + (base.indexOf("?") === -1 ? "?" : "&") + "_ct=" + scatto;
  }

  _avviaDiretta() {
    const c = this._config;
    const ogni = Math.max(1, Math.min(120,
      Number(c.camera_secondi) > 0 ? Number(c.camera_secondi) : 5)) * 1000;
    if (this._direttaId && this._direttaOgni === ogni) return;
    this._fermaDiretta();
    this._direttaOgni = ogni;
    if (this._scattoDiretta === undefined) this._scattoDiretta = Date.now();
    this._direttaId = setInterval(() => {
      if (!this.isConnected || document.hidden) return;
      const st = this._hass ? this._hass.states[this._config.entity] : null;
      const base = st ? fotoDi(st) : null;
      if (!base) return;
      const adesso = Date.now();
      const prossima = base + (base.indexOf("?") === -1 ? "?" : "&") + "_ct=" + adesso;
      // la scarico prima: se non arriva, tengo quella di adesso
      const prova = new Image();
      prova.onload = () => {
        this._scattoDiretta = adesso;
        if (this.isConnected) this._render();
      };
      prova.src = prossima;
    }, ogni);
  }

  _fermaDiretta() {
    if (this._direttaId) { clearInterval(this._direttaId); this._direttaId = null; }
    this._direttaOgni = 0;
  }

  // il "da quanto" va rinfrescato ogni tanto, se no resta fermo
  _avviaTicchettio(serve) {
    if (!serve) {
      if (this._ticchettio) { clearInterval(this._ticchettio); this._ticchettio = null; }
      return;
    }
    if (this._ticchettio) return;
    this._ticchettio = setInterval(() => {
      if (!this.isConnected) return;
      const st = this._hass ? this._hass.states[this._config.entity] : null;
      if (st) this._render();
    }, 30000);
  }

  _mmss(secondi) {
    const t = Math.max(0, Math.round(secondi));
    const h = Math.floor(t / 3600);
    const m = Math.floor((t % 3600) / 60);
    const sec = t % 60;
    const due = (n) => (n < 10 ? "0" + n : String(n));
    return h ? h + ":" + due(m) + ":" + due(sec) : m + ":" + due(sec);
  }

  _disegnaTempo(st) {
    const c = this._config;
    const ok = !!c.tempo_media && !!st && !!c.entity
      && c.entity.split(".")[0] === "media_player"
      && st.attributes.media_duration > 0;
    this._tempo.hidden = !ok;
    if (!ok) { this._fermaOrologio(); return; }

    const totale = st.attributes.media_duration;
    let dove = st.attributes.media_position || 0;
    if (st.state === "playing" && st.attributes.media_position_updated_at) {
      const da = new Date(st.attributes.media_position_updated_at).getTime();
      if (!isNaN(da)) dove += (Date.now() - da) / 1000;
    }
    dove = Math.min(Math.max(dove, 0), totale);
    const fatto = dove / totale * 100;
    this._binario.style.width = fatto.toFixed(1) + "%";
    if (this._fatta) {
      this._fatta.setAttribute("stroke-dasharray", fatto.toFixed(2) + " 100");
      // il pallino va messo dove finisce davvero la riga colorata: glielo
      // chiedo alla riga stessa, cosi' i due non litigano mai
      let x = fatto * 3;
      let y = 13 - 7 * Math.sin(2 * Math.PI * (fatto * 3) / 75);
      try {
        const lung = this._fatta.getTotalLength();
        if (lung > 0) {
          const punto = this._fatta.getPointAtLength(lung * fatto / 100);
          x = punto.x;
          y = punto.y;
        }
      } catch (e) { /* certi browser non ce la fanno: resta il conto a mano */ }
      this._pallino.style.left = (x / 300 * 100).toFixed(2) + "%";
      this._pallino.style.top = (y / 26 * 100).toFixed(2) + "%";
    }
    this._orologio.textContent = this._mmss(dove) + " / " + this._mmss(totale);

    if (st.state === "playing") this._avviaOrologio();
    else this._fermaOrologio();
  }

  _avviaOrologio() {
    if (this._orologioId) return;
    this._orologioId = setInterval(() => {
      const st = this._hass ? this._hass.states[this._config.entity] : null;
      if (!st) { this._fermaOrologio(); return; }
      this._disegnaTempo(st);
    }, 1000);
  }

  _fermaOrologio() {
    if (this._orologioId) { clearInterval(this._orologioId); this._orologioId = null; }
  }

  disconnectedCallback() {
    clearTimeout(this._riMisuro);
    this._riMisuro = 0;
    clearTimeout(this._disegnoDopo);
    clearTimeout(this._disegnoHass);
    this._disegnoDopo = 0;
    this._disegnoHass = 0;
    // la scorciatoia dell'Esc restava attaccata al documento
    if (this._esc) { document.removeEventListener("keydown", this._esc); this._esc = null; }
    this._fermaOrologio();
    this._fermaDiretta();
    this._fermaOrologioTappa();
    if (this._ticchettio) { clearInterval(this._ticchettio); this._ticchettio = null; }
    if (this._osserva) { this._osserva.disconnect(); this._osserva = null; }
    this._cartaOsservata = null;
  }

  // guardo quanto sono alta davvero: sotto una certa misura passo al modo
  // compatto, cosi' non serve ne' crescere ne' tagliare
  _controllaMisura() {
    const card = this.shadowRoot && this.shadowRoot.querySelector("ha-card");
    if (!card) return;
    // l'osservatore va attaccato appena la casella esiste per davvero:
    // quando mi attacco alla pagina spesso non c'e' ancora, e prima restavo
    // per sempre senza misura (era il caso della casellina del riquadro,
    // che veniva grande mentre l'anteprima era compatta)
    if (this._osserva && this._cartaOsservata !== card) {
      try { this._osserva.observe(card); this._cartaOsservata = card; } catch (e) { /* pazienza */ }
    }
    const q = card.getBoundingClientRect();
    const h = q.height;
    if (!h) {
      // Niente misura. Due casi: non sono ancora impaginato (fra un attimo
      // ci sono) oppure sono NASCOSTO - pop-up chiuso, altra linguetta - e
      // allora di altezza non ne avro' mai.
      // Qui c'era il mostro: riprovavo con il fotogramma E con la sveglia,
      // e ogni tentativo ne faceva partire due. Uno, due, quattro, otto...
      // in pochi secondi la pagina si bloccava e la memoria volava a
      // gigabyte. Ora: una sola sveglia per volta, al massimo otto
      // tentativi, e se sono nascosto non ci provo nemmeno - quando
      // ricompaio ci pensa il sorvegliante delle misure.
      if (this._riMisuro) return;
      if (this.offsetParent === null) return;
      this._tentativiMisura = (this._tentativiMisura || 0) + 1;
      if (this._tentativiMisura > 8) return;
      this._riMisuro = setTimeout(() => {
        this._riMisuro = 0;
        if (this.isConnected) this._controllaMisura();
      }, 120);
      return;
    }
    this._tentativiMisura = 0;
    this._altezzaVista = h;
    this._quandoMisura = Date.now();
    // mi segno la misura del POSTO che la plancia mi da', non della casella
    // disegnata: e' quella che il riquadro delle impostazioni deve copiare.
    // Solo quando cambia qualcosa: chiedere la misura a ogni ridisegno
    // costava piu' di tutto il resto messo insieme.
    // ...e anche quando cambia la LARGHEZZA: la stessa casella e' piu'
    // stretta con la barra laterale di Home Assistant aperta, e quella
    // misura li' e' proprio quella che mi serve ricordare
    if (this._altaPrima !== h || this._largaPrima !== q.width) {
      this._altaPrima = h;
      this._largaPrima = q.width;
      const mio = this.getBoundingClientRect();
      this._ricordaMisura(mio.width, mio.height);
      this._vestiAnteprima();
    }
    this._decidiCompatta();
  }

  // la stessa decisione ma con l'altezza gia' saputa: il disegno passa di
  // qui ogni secondo mentre suona la musica e misurare costa caro
  _decidiCompatta() {
    const h = this._altezzaVista;
    if (!h) return;
    // quanto spazio serve davvero: dipende da cosa c'e' dentro la casella
    let soglia = 128;
    const c0 = (el) => !!el && !el.hidden;
    if (c0(this._comandi)) soglia += 46;
    if (c0(this._cursore)) soglia += 34;
    if (c0(this._colori)) soglia += 34;
    if (c0(this._extra)) soglia += 34;
    if (c0(this._tempo)) soglia += 28;
    // Attenzione al cane che si morde la coda: dentro al pop-up la casella
    // si alza da sola sul contenuto, e passare a compatto la abbassa. Se
    // l'altezza sta sul filo della soglia si va avanti a rimbalzare -
    // ed e' lo sfarfallio velocissimo che si vedeva. Due paracadute: una
    // fascia morta di 14px, e uno stop se rimbalza lo stesso.
    const era = this.hasAttribute("compatta");
    const vuole = era ? (h < soglia + 14) : (h < soglia);
    if (vuole !== era) {
      const ora = Date.now();
      if (ora - (this._daQuandoBalla || 0) > 1500) {
        this._daQuandoBalla = ora;
        this._balli = 0;
      }
      this._balli = (this._balli || 0) + 1;
      if (this._balli <= 4) this.toggleAttribute("compatta", vuole);
    }
    // Quanto spazio resta DAVVERO al disegno: l'altezza della casella meno
    // il bordo, il nome (che con un nome lungo va a capo e ruba una riga) e
    // tutto quello che sta sotto - tasti rapidi, barra, colori. Prima
    // prendevo una fetta fissa dell'altezza e con la casella bassa l'icona
    // usciva dal riquadro e veniva tagliata. A scatti di 4px: se la seguo
    // al pixel, l'icona fa alzare la casella che la fa crescere di nuovo.
    // Nella casella a pezzi liberi le misure le comanda lui: qui non tocco
    // niente, se no il disegno si muove da solo sotto le sue mani.
    if (this.hasAttribute("liberi")) return;
    if (!this._testa) this._testa = this.shadowRoot.querySelector(".testa");
    if (!this._rigaIcona) this._rigaIcona = this.shadowRoot.querySelector("ha-card > .riga");
    if (!this._rigaIcona) return;
    const altoDi = (el) => (el && !el.hidden && el.offsetHeight) ? el.offsetHeight : 0;
    // rifaccio i conti solo se e' cambiato qualcosa: qui ci si passa a ogni
    // disegno, anche una volta al secondo mentre suona la musica
    const firma = h + "|" + altoDi(this._testa) + "|" + altoDi(this._comandi)
      + "|" + altoDi(this._cursore) + "|" + altoDi(this._colori)
      + "|" + altoDi(this._extra) + "|" + altoDi(this._tempo)
      + "|" + (this.hasAttribute("compatta") ? 1 : 0);
    if (this._firmaSpazio === firma) return;
    this._firmaSpazio = firma;
    // Quanto spazio resta al disegno non lo calcolo: lo CHIEDO alla casella.
    // Gli do' una misura esagerata e guardo quanta gliene concede - dentro
    // ci sono gia' bordi, riempimenti, spazi fra i pezzi e margini, che a
    // contarli a mano si sbaglia (e infatti si sbagliava di 24px).
    const chiedi = () => {
      this.style.setProperty("--alt-icona", "999px");
      const q = this._rigaIcona.offsetHeight;
      return q;
    };
    let libero = chiedi();
    // Se il posto non basta, la prima cosa che cede e' il nome: una riga
    // sola con i puntini invece di due. Cosi' il disegno resta. Prima
    // toglievo il disegno, e la casella nuova nasceva senza icona:
    // sbagliato, l'icona e' il pezzo che si guarda per primo.
    // La decisione la prendo sempre sul nome INTERO, non su quello gia'
    // accorciato: se no si accorcia, avanza posto, si riallunga, e si va
    // avanti a rimbalzare.
    if (this._nome) {
      const risparmio = Math.max(0, this._nome.scrollHeight - this._nome.offsetHeight);
      const eraCorto = this.hasAttribute("nomecorto");
      // Il nome per intero vale piu' di qualche pixel di disegno: lo taglio
      // solo se tenendolo il disegno resterebbe sotto i 26px, cioe' quando
      // non si capirebbe piu' cosa raffigura.
      const vuoleCorto = (libero - risparmio) < 26;
      if (vuoleCorto !== eraCorto) {
        this.toggleAttribute("nomecorto", vuoleCorto);
        libero = chiedi();                     // la testa ha cambiato altezza
      }
    }
    const quota = Math.min(h * 0.44, libero > 0 ? libero : h * 0.44);
    const ico = Math.max(18, Math.min(160, Math.round(quota / 4) * 4));
    this._icoDetta = ico;
    this.style.setProperty("--alt-icona", ico + "px");
  }

  connectedCallback() {
    // cambiato posto: le risposte che mi ero segnato non valgono piu'
    this._postoSalvato = null;
    this._sonoAnteprima = undefined;
    this._anteprimaVestita = null;
    this._largaPrima = null;
    this._annidata = undefined;
    this._altaPrima = null;
    // solo ora posso sapere se sto dentro il riquadro di anteprima
    if (this._costruito) this._disegnaAntPopup();
    // Solo ora sono attaccato alla pagina, quindi solo ora posso sapere se
    // sono nell'anteprima delle impostazioni: rifaccio il giro completo, che
    // rimette in moto l'orologio della musica e riapre il riquadro che era
    // aperto prima che Home Assistant rifacesse la casella.
    if (this._costruito && this._hass && this._config) this._render();
    if (!this._osserva && window.ResizeObserver) {
      this._osserva = new ResizeObserver(() => this._controllaMisura());
      this._cartaOsservata = null;
    }
    this._controllaMisura();
  }

  _disegnaComandi(st) {
    const c = this._config;
    const dom = c.entity ? c.entity.split(".")[0] : "";
    const rapidi = ["cover", "lock", "vacuum"].includes(dom)
      && !!st && c.comandi_rapidi !== false;
    // i tasti giusti per il tipo di apparecchio
    const mostra = {
      prec: false, play: false, succ: false, stop: false,
      su: false, fermo: false, giu: false,
      chiudi: false, sblocca: false, via: false, sosta: false, casa: false,
    };
    if (rapidi) {
      if (dom === "cover") {
        mostra.su = true;
        mostra.fermo = true;
        mostra.giu = true;
      } else if (dom === "lock") {
        mostra.chiudi = true;
        mostra.sblocca = true;
      } else {
        mostra.via = true;
        mostra.sosta = true;
        mostra.casa = true;
      }
      Object.keys(mostra).forEach((k) => {
        const b = this._comandi.querySelector("." + k);
        if (b) b.hidden = !mostra[k];
      });
      this._comandi.hidden = false;
      // La tapparella accende il tasto di dove si trova: tutta su, tutta
      // giu', oppure il tasto "ferma" mentre sta viaggiando. Prima li
      // SPEGNEVO a fine corsa, e col vetro nuovo un tasto spento sembra
      // rotto invece che "sei gia' arrivato".
      if (dom === "cover") {
        const dove = st.attributes.current_position;
        const q = String(st.state).toLowerCase();
        const muove = q === "opening" || q === "closing";
        const tasto = (k) => this._comandi.querySelector("." + k);
        tasto("su").disabled = false;
        tasto("giu").disabled = false;
        tasto("su").toggleAttribute("acceso", !muove
          && (dove === 100 || (q === "open" && dove === undefined)));
        tasto("giu").toggleAttribute("acceso", !muove
          && (dove === 0 || (q === "closed" && dove === undefined)));
        tasto("fermo").toggleAttribute("acceso", muove);
      }
      if (dom === "lock") {
        const chiusa = st.state === "locked";
        this._comandi.querySelector(".chiudi").toggleAttribute("acceso", chiusa);
        this._comandi.querySelector(".sblocca").toggleAttribute("acceso", !chiusa);
      }
      if (dom === "vacuum") {
        // niente tasti spenti a meta': si accende quello che racconta cosa
        // sta facendo, gli altri restano pronti
        const q = String(st.state).toLowerCase();
        this._comandi.querySelector(".via")
          .toggleAttribute("acceso", ["cleaning", "on"].includes(q));
        this._comandi.querySelector(".sosta")
          .toggleAttribute("acceso", q === "paused");
        this._comandi.querySelector(".casa")
          .toggleAttribute("acceso", ["docked", "returning"].includes(q));
      }
      return;
    }
    ["su", "fermo", "giu", "chiudi", "sblocca", "via", "sosta", "casa"]
      .forEach((k) => {
        const b = this._comandi.querySelector("." + k);
        if (b) b.hidden = true;
      });

    const ok = !!c.comandi_media && !!c.entity
      && dom === "media_player" && !!st;
    this._comandi.hidden = !ok;
    if (!ok) return;
    ["prec", "play", "succ", "stop"].forEach((k) => {
      const b = this._comandi.querySelector("." + k);
      if (b) b.hidden = false;
    });

    // cosa sa fare questo lettore (0 = non lo dice, mostriamo tutto)
    const puo = Number(st.attributes.supported_features) || 0;
    const suona = st.state === "playing";

    const bPlay = this._comandi.querySelector(".play");
    metti(bPlay, suona ? "pausa" : "play");
    bPlay.title = suona ? "Pausa" : "Riproduci";

    this._comandi.querySelector(".prec").hidden = !!puo && !(puo & 16);
    this._comandi.querySelector(".succ").hidden = !!puo && !(puo & 32);

    const bStop = this._comandi.querySelector(".stop");
    const puoSvuotare = !puo || (puo & 8192);
    if (!puo || (puo & 4096)) {
      metti(bStop, "stop");
      bStop.title = puoSvuotare ? "Ferma e svuota la coda" : "Ferma";
      bStop._servizi = puoSvuotare ? ["media_stop", "clear_playlist"] : ["media_stop"];
      bStop.hidden = false;
    } else if (puo & 8192) {
      metti(bStop, "svuota");
      bStop.title = "Svuota la coda";
      bStop._servizi = ["clear_playlist"];
      bStop.hidden = false;
    } else if (puo & 256) {
      metti(bStop, "spegni");
      bStop.title = "Spegni";
      bStop._servizi = ["turn_off"];
      bStop.hidden = false;
    } else {
      bStop.hidden = true;
    }
  }

  // --- multi-room e sorgente -------------------------------------------
  _apriPannello(quale) {
    const gruppo = quale === "gruppo";
    const eraAperto = gruppo ? !this._panGruppo.hidden : !this._panFonti.hidden;
    this._panGruppo.hidden = gruppo ? eraAperto : true;
    this._panFonti.hidden = gruppo ? true : eraAperto;
    this._bGruppo.toggleAttribute("aperto", !this._panGruppo.hidden);
    this._bFonte.toggleAttribute("aperto", !this._panFonti.hidden);
    this._ricordaPannello();
    this._render();
  }

  // me lo segno fuori dall'elemento, cosi' sopravvive a un rifacimento
  _ricordaPannello() {
    const chi = (this._config && this._config.entity) || "";
    const quale = !this._panGruppo.hidden
      ? "gruppo" : (!this._panFonti.hidden ? "fonti" : null);
    if (quale) PANNELLI_APERTI.set(chi, quale);
    else PANNELLI_APERTI.delete(chi);
  }

  _chiudiPannelli() {
    this._panGruppo.hidden = true;
    this._panFonti.hidden = true;
    PANNELLI_APERTI.delete((this._config && this._config.entity) || "");
    this._bGruppo.removeAttribute("aperto");
    this._bFonte.removeAttribute("aperto");
    this._render();
  }

  _casseCandidate(padrone) {
    let lista = this._lettori();
    if (!lista.length) {
      const stati = this._hass ? this._hass.states : {};
      lista = Object.keys(stati).filter((e) => e.indexOf("media_player.") === 0
        && Array.isArray(stati[e].attributes.group_members)).slice(0, 14);
    }
    lista = lista.filter((e) => e !== padrone);
    lista.unshift(padrone);
    return lista;
  }

  _cambiaGruppo(eid, riga) {
    const padrone = this._config.entity;
    const st = this._hass ? this._hass.states[padrone] : null;
    if (!st) return;
    const membri = Array.isArray(st.attributes.group_members)
      ? st.attributes.group_members : [];
    const altri = membri.filter((e) => e !== padrone);

    // il comando puo' non riuscire (cassa spenta, lettore che non sa unirsi):
    // in quel caso la riga lampeggia invece di non fare niente in silenzio
    const prova = (servizio, dati, dominio) => {
      let esito;
      try { esito = this._hass.callService(dominio || "media_player", servizio, dati); }
      catch (e) { esito = Promise.reject(e); }
      if (esito && typeof esito.catch === "function") {
        esito.catch(() => {
          if (!riga) return;
          riga._attesa = undefined;
          riga.removeAttribute("attesa");
          clearTimeout(riga._sveglia);
          riga.setAttribute("nope", "");
          setTimeout(() => {
            riga.removeAttribute("nope");
            this._render();
          }, 750);
        });
      }
    };

    const dentroOra = eid === padrone || membri.includes(eid);
    if (riga) {
      // l'interruttore va subito dove l'ho messo io e ci resta finche'
      // il lettore non risponde (o per 10 secondi)
      riga._attesa = !dentroOra;
      riga._attesaFino = Date.now() + 10000;
      const sw = riga.querySelector(".sw");
      sw.toggleAttribute("on", !dentroOra);
      riga.setAttribute("attesa", "");
      clearTimeout(riga._sveglia);
      riga._sveglia = setTimeout(() => {
        riga._attesa = undefined;
        riga.removeAttribute("attesa");
        this._render();
      }, 10100);
    }

    if (eid === padrone) {
      // stacca chi comanda: la musica deve restare a chi era in gruppo
      if (!altri.length) return;
      const erede = altri[0];
      // con Music Assistant staccare il capo scioglie la sessione e dopo
      // qualche secondo tace anche l'altra cassa: prima le passo la coda
      const conMA = String(st.attributes.app_id || "").includes("music_assistant")
        || String(st.attributes.active_queue || "") !== "";
      if (conMA) {
        prova("transfer_queue",
          { entity_id: erede, source_player: padrone, auto_play: true },
          "music_assistant");
        setTimeout(() => prova("unjoin", { entity_id: padrone }), 1200);
      } else {
        prova("unjoin", { entity_id: padrone });
      }
      this._scelto = erede;
      if (this._lettori().includes(erede)) this._ricordaScelto(erede);
      return;
    }
    if (membri.includes(eid)) {
      prova("unjoin", { entity_id: eid });
    } else {
      const insieme = altri.slice();
      insieme.push(eid);
      prova("join", { entity_id: padrone, group_members: insieme });
    }
  }

  _disegnaColori(st) {
    const c = this._config;
    const box = this._colori;
    if (!box) return;
    const dom = c.entity ? c.entity.split(".")[0] : "";
    const modi = (st && st.attributes.supported_color_modes) || [];
    const conTinta = modi.some((m) => ["hs", "rgb", "rgbw", "rgbww", "xy"].includes(m));
    const conCaloreVero = modi.includes("color_temp");
    // strisce coi soli colori: il caldo/freddo lo mescoliamo noi
    const caloreFinto = !conCaloreVero && !modi.includes("white")
      && modi.some((m) => ["rgb", "rgbw", "rgbww", "hs", "xy"].includes(m));
    const conCalore = conCaloreVero || caloreFinto;
    this._calore._finto = caloreFinto;
    // certe lampade non hanno le gradazioni di bianco: hanno un bianco solo
    const conBianco = modi.includes("white");
    // le strisce si vedono anche a luce spenta: muovendole si accende
    // gia' del colore scelto (come fa Home Assistant)
    const mostra = !!c.cursore_colore && dom === "light" && !!st
      && (conTinta || conCalore || conBianco);
    box.hidden = !mostra;
    if (!mostra) return;

    // una sola striscia: la tinta se la lampada ha i colori, altrimenti
    // il caldo/freddo. Tutte e due solo se lo chiede lui.
    const quale = c.colore_striscia || "tinta";
    const dueStrisce = quale === "tutte";
    if (!this._modoColore) this._modoColore = quale === "bianco" ? "bianco" : "tinta";
    // se la lampada sa fare solo una delle due cose, quella e'
    const modo = !conTinta ? "bianco" : (!conCalore ? "tinta" : this._modoColore);
    this._tinta.hidden = !conTinta || (!dueStrisce && modo !== "tinta");
    this._calore.hidden = !conCalore || (!dueStrisce && modo !== "bianco");
    // il tastino c'e' se la lampada fa colori E bianco (a gradazioni o
    // secco). Col bianco secco non c'e' niente da scambiare: rimette il bianco.
    const soloBianco = conTinta && !conCaloreVero && conBianco;
    this._scambio._soloBianco = soloBianco;
    this._scambio.hidden = !(conTinta && (conCalore || conBianco)) || dueStrisce;
    if (!this._scambio.hidden) {
      if (soloBianco) {
        const eBianca = st.attributes.color_mode === "white";
        // l'icona dice cosa succede al prossimo tocco
        metti(this._scambio, eBianca ? "tavolozza" : "bianco");
        this._scambio.toggleAttribute("acceso", eBianca);
        this._scambio.title = eBianca
          ? "Adesso e bianca: toccami per colorarla"
          : "Torna alla luce bianca";
      } else {
        this._scambio.removeAttribute("acceso");
        metti(this._scambio, modo === "tinta" ? "bianco" : "tavolozza");
        this._scambio.title = modo === "tinta"
          ? "Passa al bianco caldo/freddo" : "Passa ai colori";
      }
    }
    if (conCalore) {
      const min = conCaloreVero ? (st.attributes.min_color_temp_kelvin || 2000) : 2200;
      const max = conCaloreVero ? (st.attributes.max_color_temp_kelvin || 6500) : 6500;
      this._calore.min = String(min);
      this._calore.max = String(max);
    }
    if (this._trascinoColore) return;
    const hs = st.attributes.hs_color;
    if (conTinta && Array.isArray(hs)) this._tinta.value = String(Math.round(hs[0]));
    const k = st.attributes.color_temp_kelvin;
    if (conCaloreVero && k) this._calore.value = String(k);
  }

  _disegnaExtra(st) {
    const c = this._config;
    const media = !!c.entity && c.entity.split(".")[0] === "media_player" && !!st;
    const puo = media ? (Number(st.attributes.supported_features) || 0) : 0;
    const conGruppo = media && c.multiroom !== false
      && (!!(puo & 524288) || Array.isArray(st.attributes.group_members));
    const conFonti = media && c.sorgente !== false
      && Array.isArray(st.attributes.source_list) && st.attributes.source_list.length > 0;

    this._bGruppo.hidden = !conGruppo;
    this._bFonte.hidden = !conFonti;
    this._extra.hidden = !conGruppo && !conFonti;
    if (!conGruppo && !this._panGruppo.hidden) {
      this._panGruppo.hidden = true;
      this._bGruppo.removeAttribute("aperto");
    }
    if (!conFonti && !this._panFonti.hidden) {
      this._panFonti.hidden = true;
      this._bFonte.removeAttribute("aperto");
    }
    // nell'anteprima delle impostazioni la casella viene rifatta in
    // continuazione: rimetto aperto il riquadro che stava aperto, se no
    // a ogni ritocco si chiude e tocca riaprirlo
    if (this._dentroAnteprima()) {
      const quale = PANNELLI_APERTI.get(c.entity) || null;
      this._panGruppo.hidden = !(quale === "gruppo" && conGruppo);
      this._panFonti.hidden = !(quale === "fonti" && conFonti);
      this._bGruppo.toggleAttribute("aperto", !this._panGruppo.hidden);
      this._bFonte.toggleAttribute("aperto", !this._panFonti.hidden);
    }
    if (!this._panGruppo.hidden) this._disegnaGruppo(st);
    if (!this._panFonti.hidden) this._disegnaFonti(st);
  }

  _disegnaGruppo(st) {
    const box = this._panGruppo.querySelector(".p-corpo");
    const padrone = this._config.entity;
    const stati = this._hass ? this._hass.states : {};
    const membri = Array.isArray(st.attributes.group_members)
      ? st.attributes.group_members : [padrone];
    const lista = this._casseCandidate(padrone);
    const firma = lista.join("|");
    if (box._firma !== firma) {
      box._firma = firma;
      box.innerHTML = "";
      lista.forEach((eid) => {
        const r = document.createElement("div");
        r.className = "voce";
        r.dataset.eid = eid;
        r.innerHTML = '<button class="sw" type="button"></button>'
          + '<span class="chi"></span>'
          + '<input class="vol" type="range" min="0" max="100" step="1">';
        r.querySelector(".sw").addEventListener("click", () => this._cambiaGruppo(eid, r));
        const vol = r.querySelector(".vol");
        const manda = () => {
          if (!this._hass) return;
          this._hass.callService("media_player", "volume_set",
            { entity_id: eid, volume_level: Number(vol.value) / 100 });
        };
        vol.addEventListener("input", () => {
          r._trascino = true;
          vol.style.setProperty("--riempito", vol.value + "%");
          clearTimeout(r._freno);
          r._freno = setTimeout(manda, 250);
        });
        ["pointerup", "touchend", "mouseup", "keyup"].forEach((ev) =>
          vol.addEventListener(ev, () => {
            if (!r._trascino) return;
            manda();
            setTimeout(() => { r._trascino = false; }, 900);
          }));
        vol.addEventListener("blur", () => { r._trascino = false; });
        box.appendChild(r);
      });
    }
    Array.from(box.children).forEach((r) => {
      const eid = r.dataset.eid;
      const suo = stati[eid];
      const dentro = eid === padrone || membri.includes(eid);
      const spento = !suo || suo.state === "unavailable" || suo.state === "unknown";
      const altri = membri.filter((e) => e !== padrone);
      const nome = (suo && suo.attributes.friendly_name) || eid.split(".")[1];
      r.toggleAttribute("spento", spento);
      r.querySelector(".chi").textContent = nome
        + (eid === padrone ? " \u2022 questa" : (spento ? " \u2022 non disponibile" : ""));
      const sw = r.querySelector(".sw");
      // finche' aspetto la risposta del lettore tengo la posizione chiesta
      let inAttesa = r._attesa !== undefined && Date.now() < r._attesaFino;
      if (inAttesa && r._attesa === dentro) {
        inAttesa = false;
        r._attesa = undefined;
        clearTimeout(r._sveglia);
      }
      r.toggleAttribute("attesa", inAttesa);
      sw.toggleAttribute("on", inAttesa ? r._attesa : dentro);
      sw.disabled = spento || (eid === padrone && altri.length === 0 && !inAttesa);
      sw.title = spento ? "Altoparlante spento o non raggiungibile"
        : (eid === padrone
            ? (altri.length ? "Togli questa cassa e lascia suonare le altre"
                            : "E' la cassa che comanda il gruppo")
            : (dentro ? "Togli dal gruppo" : "Unisci al gruppo"));
      const vol = r.querySelector(".vol");
      vol.hidden = !dentro || !suo || suo.attributes.volume_level === undefined;
      if (!vol.hidden && !r._trascino) {
        const liv = Math.round(suo.attributes.volume_level * 100);
        vol.value = String(liv);
        vol.style.setProperty("--riempito", liv + "%");
      }
    });
  }

  _disegnaFonti(st) {
    const box = this._panFonti.querySelector(".p-corpo");
    const lista = Array.isArray(st.attributes.source_list) ? st.attributes.source_list : [];
    const firma = lista.join("|");
    if (box._firma !== firma) {
      box._firma = firma;
      box.innerHTML = "";
      lista.forEach((nome) => {
        const b = document.createElement("button");
        b.type = "button";
        b.textContent = nome;
        b.addEventListener("click", () => {
          if (!this._hass) return;
          this._hass.callService("media_player", "select_source",
            { entity_id: this._config.entity, source: nome });
        });
        box.appendChild(b);
      });
    }
    Array.from(box.children).forEach((b) =>
      b.toggleAttribute("scelto", b.textContent === st.attributes.source));
  }

  // --- scelta della cassa ---------------------------------------------
  _lettori() {
    const l = this._base ? this._base.lettori : null;
    if (Array.isArray(l)) return l.filter(Boolean);
    return l ? [l] : [];
  }

  _entitaAttiva() {
    const base = this._base || this._config;
    const stati = this._hass ? this._hass.states : {};
    let lista = this._lettori();
    // ATTENZIONE: solo le caselle della musica cercano la cassa che suona.
    // Senza questo controllo ogni casella (meteo, luci, sensori) diventa
    // il lettore appena una cassa attacca a suonare.
    const suaEntita = String(base.entity || "");
    if (!lista.length && suaEntita.indexOf("media_player.") !== 0) {
      return base.entity;
    }
    if (!lista.length) {
      // nessun elenco scelto da lui: guardo tutte le casse dell'impianto,
      // le stesse che vede nel riquadro del gruppo. Cosi' la card ritrova la
      // musica anche dopo aver ricaricato la pagina.
      lista = this._casseCandidate(base.entity);
      if (lista.length < 2) return base.entity;
    }
    const segui = base.segui_attivo !== false;
    const oraSuona = lista.filter((e) => stati[e] && stati[e].state === "playing");
    const prima = this._suonavano;
    this._suonavano = oraSuona;
    if (segui) {
      // al primo giro, e ogni volta che una cassa ATTACCA a suonare, la si segue;
      // per il resto comanda quello che ha toccato l'utente
      const nuovo = prima === undefined
        ? oraSuona[0] : oraSuona.find((e) => !prima.includes(e));
      if (nuovo) this._scelto = nuovo;
    }
    if (this._scelto && lista.includes(this._scelto)) {
      const suo = stati[this._scelto];
      const viva = suo && ["playing", "paused", "buffering", "on"]
        .includes(String(suo.state).toLowerCase());
      const casa = stati[base.entity];
      const casaViva = casa && String(casa.state).toLowerCase() === "playing";
      // se quella che seguivo ha smesso e la sua e' ripartita, torno alla sua
      if (!viva && casaViva) this._scelto = base.entity;
      return this._scelto;
    }
    return lista.find((e) => !!stati[e]) || lista[0] || base.entity;
  }

  // "Assistente Veranda", "Assistente Cucina" -> "Veranda", "Cucina":
  // tolgo le prime parole che hanno tutte in comune
  _nomiCasse(lista) {
    const stati = this._hass ? this._hass.states : {};
    const interi = lista.map((eid) => {
      const st = stati[eid];
      return String((st && st.attributes.friendly_name)
        || eid.split(".")[1] || eid).replace(/_/g, " ").trim();
    });
    const pezzi = interi.map((n) => n.split(/\s+/));
    let comuni = 0;
    while (pezzi.length > 1 && pezzi.every((p) => p.length > comuni + 1)
        && pezzi.every((p) => p[comuni].toLowerCase() === pezzi[0][comuni].toLowerCase())) {
      comuni += 1;
    }
    const corti = pezzi.map((p) => p.slice(comuni).join(" "));
    const fuori = {};
    lista.forEach((eid, i) => { fuori[eid] = corti[i] || interi[i]; });
    return fuori;
  }

  _chiaveMemoria() { return "casa-tile:cassa:" + this._lettori().join("|"); }

  _ricordaScelto(eid) {
    try { localStorage.setItem(this._chiaveMemoria(), eid); } catch (e) { /* niente */ }
  }

  _leggiScelto() {
    try { return localStorage.getItem(this._chiaveMemoria()); } catch (e) { return null; }
  }

  _disegnaLettori() {
    const lista = this._lettori();
    const mostra = lista.length > 1;
    this._lettoriBox.hidden = !mostra;
    if (!mostra) { this._lettoriBox.innerHTML = ""; this._firmaLettori = null; return; }
    const firma = lista.join("|");
    if (this._firmaLettori !== firma) {
      this._firmaLettori = firma;
      this._lettoriBox.innerHTML = "";
      lista.forEach((eid) => {
        const b = document.createElement("button");
        b.type = "button";
        b.dataset.eid = eid;
        b.innerHTML = '<span class="spia"></span><span class="chi"></span>';
        b.addEventListener("click", (e) => {
          e.stopPropagation();
          this._scelto = eid;
          this._ricordaScelto(eid);
          this._render();
        });
        this._lettoriBox.appendChild(b);
      });
    }
    const attiva = this._config.entity;
    const nomi = this._nomiCasse(lista);
    Array.from(this._lettoriBox.children).forEach((b) => {
      const st = this._hass ? this._hass.states[b.dataset.eid] : null;
      b.querySelector(".chi").textContent = nomi[b.dataset.eid] || b.dataset.eid;
      b.title = (st && st.attributes.friendly_name) || b.dataset.eid;
      b.toggleAttribute("scelto", b.dataset.eid === attiva);
      b.toggleAttribute("suona", !!st && st.state === "playing");
    });
  }

  _disegnaMeteo() {
    const eid = this._config.meteo_entita;
    // se la casella E' gia' quel meteo, l'angolino ripeterebbe le stesse cose
    if (eid && eid === this._config.entity) { this._meteo.hidden = true; return; }
    const st = (eid && this._hass) ? this._hass.states[eid] : null;
    if (!st) { this._meteo.hidden = true; return; }
    this._meteo.hidden = false;
    const t = st.attributes.temperature;
    const u = st.attributes.temperature_unit || "\u00B0C";
    const gradi = (t === undefined || t === null)
      ? "" : Math.round(t) + "<small>" + u + "</small>";
    if (this._gradi.dataset.gradi !== gradi) {
      this._gradi.dataset.gradi = gradi;
      this._gradi.innerHTML = gradi;
    }
    const voce = METEO[st.state] || ["\u2022", st.state];
    if (this._cond.dataset.voce !== st.state) {
      this._cond.dataset.voce = st.state;
      this._cond.innerHTML = "";
      const simbolo = document.createElement("span");
      simbolo.textContent = voce[0];
      const parola = document.createElement("span");
      parola.textContent = voce[1];
      this._cond.append(simbolo, parola);
    }
  }

  // il grafichino: chiedo la storia a Home Assistant e la disegno
  _disegnaAndamento(st) {
    const c = this._config;
    const box = this._andamento;
    if (!box) return;
    const numerico = !!st && !isNaN(parseFloat(st.state));
    const vuole = !!c.grafico && !!c.entity && (numerico || !!this._storia);
    // attenzione: su un <svg> la proprieta' .hidden non si riflette
    // sull'attributo, quindi va messo e tolto a mano
    box.toggleAttribute("hidden", !vuole);
    // col grafico dietro le scritte si confondono: lo dico al foglio di
    // stile, che gli mette un'ombra e un velo scuro sotto
    this.toggleAttribute("congrafico", vuole);
    if (!vuole || !this._hass) return;

    const ore = Number(c.grafico_ore) > 0 ? Number(c.grafico_ore) : 24;
    const chiave = c.entity + "|" + ore;
    const adesso = Date.now();
    // la storia si chiede una volta ogni cinque minuti, non a ogni disegno
    if (this._chiaveStoria !== chiave || !this._quandoStoria
        || adesso - this._quandoStoria > 300000) {
      this._chiaveStoria = chiave;
      this._quandoStoria = adesso;
      const da = new Date(adesso - ore * 3600000).toISOString();
      const a = new Date(adesso).toISOString();
      this._chiediStoria(c.entity, da, a);
    }
    this._disegnaLinea(st);
  }

  // due strade per lo storico: prima il websocket, poi l'indirizzo normale
  // (su certe installazioni la prima non risponde)
  // Lo storico di un sensore che cambia ogni secondo sono decine di
  // migliaia di punti: la casella se li teneva TUTTI in pancia e a ogni
  // disegno se li ricopiava per tirarci una linea da 120 punti. Erano i
  // gigabyte e i blocchi della pagina. Quindi appena arriva lo assottiglio
  // a trecento punti, tenendomi il piu' basso e il piu' alto (servono per
  // le scritte del minimo e del massimo) e sempre l'ultimo.
  _assottiglia(punti) {
    const max = 300;
    if (!punti || punti.length <= max) return punti;
    let basso = punti[0];
    let alto = punti[0];
    for (let i = 1; i < punti.length; i += 1) {
      if (punti[i].v < basso.v) basso = punti[i];
      if (punti[i].v > alto.v) alto = punti[i];
    }
    const passo = punti.length / (max - 3);
    const fuori = [];
    for (let i = 0; i < punti.length; i += passo) {
      fuori.push(punti[Math.floor(i)]);
    }
    const ultimo = punti[punti.length - 1];
    if (fuori[fuori.length - 1] !== ultimo) fuori.push(ultimo);
    if (fuori.indexOf(basso) < 0) fuori.push(basso);
    if (fuori.indexOf(alto) < 0) fuori.push(alto);
    fuori.sort((x, y) => x.t - y.t);
    return fuori;
  }

  async _chiediStoria(chi, da, a) {
    // la casellina del riquadro non chiede lo storico: e' li' solo per
    // farsi spostare i pezzi, non le serve il grafico vero
    if (this.hasAttribute("solo-casella")) return [];
    // di ogni lettura tengo il valore E il momento
    const numeri = (righe) => righe.map((r) => {
      const g = r || {};
      const v = parseFloat(g.s !== undefined ? g.s : g.state);
      let t = g.lu !== undefined ? g.lu * 1000
        : (g.last_updated || g.last_changed || null);
      if (typeof t === "string") t = Date.parse(t);
      return { v: v, t: Number(t) || 0 };
    }).filter((x) => !isNaN(x.v));

    try {
      const risposta = await this._hass.callWS({
        type: "history/history_during_period",
        start_time: da,
        end_time: a,
        entity_ids: [chi],
        minimal_response: true,
        no_attributes: true,
        significant_changes_only: false,
      });
      const righe = (risposta && risposta[chi]) || [];
      if (righe.length) {
        this._storia = this._assottiglia(numeri(righe));
        this._disegnaLinea();
        return;
      }
    } catch (e) { /* pazienza: ci provo con l'altra strada */ }

    try {
      const indirizzo = "history/period/" + encodeURIComponent(da)
        + "?filter_entity_id=" + encodeURIComponent(chi)
        + "&end_time=" + encodeURIComponent(a)
        + "&minimal_response&no_attributes";
      const risposta = await this._hass.callApi("GET", indirizzo);
      const righe = (Array.isArray(risposta) && risposta[0]) || [];
      this._storia = this._assottiglia(numeri(righe));
      this._disegnaLinea();
      if (!this._storia.length) this._niente("lo storico e vuoto");
      return;
    } catch (e) {
      this._storia = null;
      this._niente(e && e.message ? e.message : "storico non raggiungibile");
    }
  }

  _niente(perche) {
    if (this._andamento) {
      this._andamento.setAttribute("title",
        "Grafico: " + perche + " (entita: " + this._config.entity + ")");
    }
    if (!this._giaDetto) {
      this._giaDetto = true;
      console.warn("[casa-tile] grafico senza dati:", this._config.entity, perche);
    }
  }

  _disegnaLinea(st) {
    const box = this._andamento;
    if (!box) return;
    const storia = this._storia || [];
    const adesso = (st && !isNaN(parseFloat(st.state)))
      ? { v: parseFloat(st.state), t: Date.now() } : null;
    // niente copia dell'array: con lo storico lungo era il conto piu' caro
    // di tutto il disegno
    const punti = adesso ? storia.concat([adesso]) : storia;
    if (punti.length < 2) { box.toggleAttribute("hidden", true); return; }
    box.toggleAttribute("hidden", false);
    // ne bastano un centinaio: se sono di piu' li assottiglio
    const max = 120;
    const scelti = punti.length <= max ? punti
      : punti.filter((x, i) => i % Math.ceil(punti.length / max) === 0);
    const valori = scelti.map((x) => x.v);
    const basso = Math.min.apply(null, valori);
    const alto = Math.max.apply(null, valori);
    const campo = alto - basso || 1;
    const passo = 100 / (scelti.length - 1);
    const coord = scelti.map((x, i) =>
      [i * passo, 28 - ((x.v - basso) / campo) * 26]);
    // me li tengo da parte: servono al mirino
    this._disegnati = scelti;
    this._coord = coord;
    const riga = coord.map((xy, i) =>
      (i ? "L" : "M") + xy[0].toFixed(2) + " " + xy[1].toFixed(2)).join(" ");
    box.querySelector(".riga").setAttribute("d", riga);
    const pieno = box.querySelector(".pieno");
    pieno.setAttribute("d", riga + " L100 30 L0 30 Z");
    // area piena o solo la riga
    const soloRiga = this._config.grafico_stile === "linea";
    pieno.style.display = soloRiga ? "none" : "";

    // sulle temperature la riga cambia colore col valore
    const suoSt = this._hass ? this._hass.states[this._config.entity] : null;
    const aTemperatura = this._config.colore === "termometro"
      || (!!suoSt && suoSt.attributes.device_class === "temperature");
    if (this._scala) {
      if (aTemperatura) {
        const passi = 5;
        let dentro = "";
        for (let i = 0; i <= passi; i += 1) {
          const q = i / passi;
          const tinta = coloreTemperatura(basso + campo * q) || "currentColor";
          dentro += '<stop offset="' + (q * 100).toFixed(0) + '%" stop-color="'
            + tinta + '"></stop>';
        }
        if (this._scala.innerHTML !== dentro) this._scala.innerHTML = dentro;
        if (!this._scala.id) this._scala.id = "scala-" + Math.random().toString(36).slice(2, 8);
        box.querySelector(".riga").style.stroke = "url(#" + this._scala.id + ")";
      } else {
        this._scala.innerHTML = "";
        box.querySelector(".riga").style.stroke = "";
      }
    }

    // minimo e massimo del periodo
    if (this._estremi) {
      const vuole = !!this._config.grafico_estremi;
      this._estremi.hidden = !vuole;
      if (vuole) {
        const u = suoSt ? (suoSt.attributes.unit_of_measurement || "") : "";
        const scrivi = (n2) => (Math.round(n2 * 10) / 10).toLocaleString("it-IT")
          + (u ? " " + u : "");
        this._estremi.querySelector(".alto").textContent = scrivi(alto);
        this._estremi.querySelector(".basso").textContent = scrivi(basso);
      }
    }
    box.title = "Ultime " + (Number(this._config.grafico_ore) > 0
      ? Number(this._config.grafico_ore) : 24) + " ore: da "
      + (Math.round(basso * 10) / 10) + " a " + (Math.round(alto * 10) / 10);
  }

  // il mirino segue il dito o il mouse sopra al grafico
  _muoviMirino(e) {
    if (this.hasAttribute("solo-casella")) return;
    if (this.hasAttribute("trascinabile")) return;
    if (!this._mirino || !this._andamento || this._andamento.hasAttribute("hidden")
        || !this._coord || !this._coord.length) return;
    const q = this._andamento.getBoundingClientRect();
    const x = e.clientX - q.left;
    if (x < 0 || x > q.width || !q.width) { this._nascondiMirino(); return; }
    const quota = (x / q.width) * 100;
    let vicino = 0;
    for (let i = 1; i < this._coord.length; i += 1) {
      if (Math.abs(this._coord[i][0] - quota)
          < Math.abs(this._coord[vicino][0] - quota)) vicino = i;
    }
    const punto = this._disegnati[vicino];
    const xy = this._coord[vicino];
    this._mirino.hidden = false;
    this._mirino.querySelector(".mira").style.left = xy[0] + "%";
    const palla = this._mirino.querySelector(".palla");
    palla.style.left = xy[0] + "%";
    palla.style.top = (xy[1] / 30 * 100) + "%";

    const u = this._hass && this._config.entity
      && this._hass.states[this._config.entity]
      ? (this._hass.states[this._config.entity].attributes.unit_of_measurement || "")
      : "";
    const quando = punto.t
      ? new Date(punto.t).toLocaleString("it-IT",
          { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })
      : "";
    this._cartellino.hidden = false;
    this._cartellino.style.left = Math.min(85, Math.max(15, xy[0])) + "%";
    this._cartellino.innerHTML = "<b>" + (Math.round(punto.v * 10) / 10)
      .toLocaleString("it-IT") + (u ? " " + u : "") + "</b>"
      + (quando ? "<span>" + quando + "</span>" : "");
  }

  _nascondiMirino() {
    if (this._mirino) this._mirino.hidden = true;
    if (this._cartellino) this._cartellino.hidden = true;
  }

  _disegnaChips() {
    const gia = this._viaUsata;
    const lista = (this._config.info_entita || [])
      .filter((eid) => eid !== gia)
      .slice(0, 6);
    if (!this._hass || !lista.length) {
      if (this._firmaChips !== "") { this._chips.innerHTML = ""; this._firmaChips = ""; }
      return;
    }
    const pezzi = [];
    lista.forEach((eid) => {
      const st = this._hass.states[eid];
      if (!st) return;
      if (st.state === "unavailable" || st.state === "unknown") return;
      const scritto = valoreScritto(st);
      const testo = scritto !== null
        ? scritto
        : (PAROLE[String(st.state).toLowerCase()] || st.state);
      pezzi.push({
        eid: eid, st: st, testo: String(testo).slice(0, 26),
        etichetta: this._nomeMisura(st, eid),
        tinta: Array.isArray((this._config.info_colori || {})[eid])
          ? daRgb(this._config.info_colori[eid]) : "",
        simbolo: this._simbolo(st, eid),
        mappa: this._eUnPosto(st, eid),
        nome: st.attributes.friendly_name || eid,
      });
    });
    // rifaccio le caselline solo se e' cambiato qualcosa: durante la musica
    // il disegno passa di qui una volta al secondo
    const firma = pezzi.map((m) =>
      [m.eid, m.testo, m.etichetta, m.simbolo, m.tinta, m.mappa ? 1 : 0].join("~")).join("|");
    if (firma === this._firmaChips) return;
    this._firmaChips = firma;

    this._chips.innerHTML = "";
    pezzi.forEach((m) => {
      const casella = document.createElement("div");
      casella.className = "metrica";
      casella.dataset.eid = m.eid;
      casella.tabIndex = 0;
      const mappa = m.mappa;
      casella.title = m.nome
        + (mappa ? " - tocca per aprire Google Maps" : " - tocca per i dettagli");
      casella.innerHTML =
        '<span class="simbolo"></span><span class="eti"></span><span class="num"></span>';
      casella.querySelector(".simbolo").textContent = m.simbolo;
      casella.querySelector(".num").textContent = m.testo;
      casella.querySelector(".eti").textContent = m.etichetta;
      if (m.etichetta) casella.classList.add("connome");
      // il colore suo, se gliel'ha dato lui
      if (m.tinta) {
        casella.style.setProperty("--tinta-mia", m.tinta);
        casella.classList.add("suacolore");
      }

      const apri = (e) => {
        e.stopPropagation();
        if (mappa) { this._apriMappaDi(m.st, m.eid); return; }
        this.dispatchEvent(new CustomEvent("hass-more-info", {
          detail: { entityId: m.eid }, bubbles: true, composed: true,
        }));
      };
      casella.addEventListener("click", apri);
      casella.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); apri(e); }
      });
      this._chips.appendChild(casella);
    });
  }

  _entitaIndirizzo() {
    const c = this._config;
    if (c.sottotitolo_entita) return c.sottotitolo_entita;
    if (c.disposizione !== "persona" || !this._hass) return null;
    const candidati = c.info_entita || [];
    const buono = candidati.find((eid) => {
      const id = eid.toLowerCase();
      if (!(id.includes("geocoded") || id.includes("location")
            || id.includes("indirizzo") || id.includes("address"))) return false;
      const st = this._hass.states[eid];
      return st && typeof st.state === "string" && st.state.length > 6
        && st.state !== "unknown" && st.state !== "unavailable";
    });
    return buono || null;
  }

  _eUnPosto(st, eid) {
    const id = eid.toLowerCase();
    if (id.includes("geocoded") || id.includes("location") || id.includes("indirizzo")) return true;
    if (eid.startsWith("device_tracker.")) return true;
    if (st.attributes && st.attributes.latitude !== undefined) return true;
    return false;
  }

  _apriMappaDi(st, eid) {
    let dove = null;
    if (st.attributes && st.attributes.latitude !== undefined
        && st.attributes.longitude !== undefined) {
      dove = st.attributes.latitude + "," + st.attributes.longitude;
    } else if (st.state && st.state.length > 4) {
      dove = st.state;
    }
    if (!dove) {
      this.dispatchEvent(new CustomEvent("hass-more-info", {
        detail: { entityId: eid }, bubbles: true, composed: true,
      }));
      return;
    }
    window.open("https://www.google.com/maps/search/?api=1&query="
      + encodeURIComponent(dove), "_blank", "noopener");
  }

  _regola(valore) {
    const c = this._config;
    if (!this._hass || !c.entity) return;
    // Quando lasci il cursore il browser manda DUE segnali (pointerup e
    // change): senza questo controllo l'apparecchio riceve due volte lo
    // stesso comando e fa due bip.
    const adesso = Date.now();
    const gia = this._giaMandato;
    if (gia && gia.valore === valore && adesso - gia.quando < 900) return;
    this._giaMandato = { valore: valore, quando: adesso };
    const dominio = c.entity.split(".")[0];
    if (dominio === "light") {
      this._hass.callService("light", "turn_on",
        { entity_id: c.entity, brightness_pct: valore });
    } else if (dominio === "fan") {
      this._hass.callService("fan", "set_percentage",
        { entity_id: c.entity, percentage: valore });
    } else if (dominio === "media_player") {
      this._hass.callService("media_player", "volume_set",
        { entity_id: c.entity, volume_level: valore / 100 });
    } else if (dominio === "number" || dominio === "input_number") {
      this._hass.callService(dominio, "set_value",
        { entity_id: c.entity, value: valore });
    } else if (dominio === "cover") {
      // una tapparella ci mette dei secondi ad arrivare: fino a quando non
      // e' arrivata mostro dove l'ho mandata, se no il numero tornerebbe
      // indietro all'ultima posizione e poi salterebbe avanti
      this._viaggia(valore);
      this._hass.callService("cover", "set_cover_position",
        { entity_id: c.entity, position: valore });
    }
  }

  // il numero grande (e la tapparella disegnata) seguono il cursore mentre
  // lo muovi, senza aspettare che l'apparecchio risponda
  _seguiIlDito(val) {
    const c = this._config;
    const dom = c.entity ? c.entity.split(".")[0] : "";
    if (dom !== "cover" || c.nascondi_valore) return;
    this._valore.textContent = Math.round(val) + " %";
    this._valore.classList.toggle("parola", false);
    if (this._svg && !this._svg.hidden) {
      tagliaTapparella(this._svg, val);
      if (this._svgFondo && !this._svgFondo.hasAttribute("hidden")) {
        tagliaTapparella(this._svgFondo, val);
      }
    }
  }

  _disegnaCursore(st) {
    const c = this._config;
    const dominio = c.entity ? c.entity.split(".")[0] : "";
    const buono = ["light", "fan", "media_player", "number", "input_number", "cover"]
      .includes(dominio);
    const mostra = !!c.mostra_cursore && buono && !!st;
    this._cursore.hidden = !mostra;
    if (!mostra) return;

    // i valori impostabili hanno i loro limiti e la loro unita'
    if (dominio === "number" || dominio === "input_number") {
      let min = Number(st.attributes.min !== undefined ? st.attributes.min : 0);
      let max = Number(st.attributes.max !== undefined ? st.attributes.max : 100);
      // se lui ha detto fin dove deve arrivare, comanda lui
      if (c.cursore_min !== undefined && c.cursore_min !== null && c.cursore_min !== "") {
        min = Math.max(min, Number(c.cursore_min));
      }
      if (c.cursore_max !== undefined && c.cursore_max !== null && c.cursore_max !== "") {
        max = Math.min(max, Number(c.cursore_max));
      }
      const passo = Number(st.attributes.step || 1);
      this._range.min = String(min);
      this._range.max = String(max);
      this._range.step = String(passo);
      const ora = Number(st.state);
      if (!this._trascino && !isNaN(ora)) {
        this._range.value = String(ora);
        const u = st.attributes.unit_of_measurement || "";
        this._quanto.textContent = (Math.round(ora * 10) / 10) + (u ? " " + u : "");
        const quota = max > min ? ((ora - min) / (max - min)) * 100 : 0;
        this._range.style.setProperty("--riempito", quota.toFixed(1) + "%");
      }
      return;
    }
    this._range.min = "0";
    this._range.max = "100";
    this._range.step = "1";

    // il tasto del muto sta accanto al volume, solo per la musica
    const puoMuto = dominio === "media_player"
      && (!st.attributes.supported_features
          || (Number(st.attributes.supported_features) & 8));
    this._muto.hidden = !puoMuto;
    if (puoMuto) {
      const zitto = !!st.attributes.is_volume_muted;
      this._muto.toggleAttribute("zitto", zitto);
      metti(this._muto, zitto ? "muto" : "volume");
      this._muto.title = zitto ? "Riattiva l'audio" : "Silenzia";
    }

    let valore = 0;
    if (dominio === "cover") {
      if (st.attributes.current_position === undefined) {
        this._cursore.hidden = true;
        return;
      }
      // anche il cursore resta dove l'ho messo finche' non e' arrivata
      const dove = this._posizioneMostrata(st);
      if (!this._trascino && dove !== null) {
        this._range.value = String(Math.round(dove));
        this._quanto.textContent = Math.round(dove) + "%";
        this._range.style.setProperty("--riempito", Math.round(dove) + "%");
      }
      return;
    }
    if (dominio === "light") {
      valore = st.attributes.brightness ? Math.round(st.attributes.brightness / 2.55) : 0;
    } else if (dominio === "fan") {
      valore = Math.round(st.attributes.percentage || 0);
    } else {
      valore = Math.round((st.attributes.volume_level || 0) * 100);
    }
    if (!this._trascino) {
      this._range.value = String(valore);
      this._quanto.textContent = valore + "%";
      this._range.style.setProperty("--riempito", valore + "%");
    }
  }

  // quanto e' carica e se sta caricando: lo chiedo all'entita' e a quelle
  // che le stanno intorno (batteria dello stesso dispositivo, stato, presa)
  // quanto far vedere: mentre trascini vale il cursore, se no l'apparecchio.
  // Cosi' un aggiornamento che arriva a meta' trascinamento non ti riporta
  // indietro il numero sotto le dita.
  // Quando le dico di andare da 13 a 50, lei ci mette dei secondi e Home
  // Assistant intanto continua a dire 13. Allora me lo conto io: parto da
  // dove sta, vado verso dove le ho detto, e disegno il pezzo di strada
  // fatto. La velocita' me la imparo guardando quanto ci mette davvero.
  _viaggia(dove) {
    const st = this._hass ? this._hass.states[this._config.entity] : null;
    const da = this._quantoAperta(st);
    if (da === null) return;
    this._meta = { da: da, dove: dove, quando: Date.now() };
    // il comando e' partito: da qui in poi comanda il viaggio, non il dito
    // (se no per un attimo si vedrebbe gia' arrivata)
    this._trascino = false;
    this._fermaOrologioTappa();
    // il disegno riparte da dove sta davvero, non da dove arrivera'
    tagliaTapparella(this._svg, da);
    if (this._svgFondo && !this._svgFondo.hasAttribute("hidden")) {
      tagliaTapparella(this._svgFondo, da);
    }
    if (Math.abs(dove - da) < 1) { this._meta = null; return; }
    // ridisegno spesso, se no il movimento va a scatti
    // si muove solo il disegno: il numero e il cursore restano dove li ha
    // messi lui, se no sembrano impazziti
    const passo = () => {
      if (!this.isConnected || !this._meta) { this._fermaOrologioTappa(); return; }
      const st2 = this._hass ? this._hass.states[this._config.entity] : null;
      const dove2 = this._posizioneDisegno(st2);
      tagliaTapparella(this._svg, dove2);
      if (this._svgFondo && !this._svgFondo.hasAttribute("hidden")) {
        tagliaTapparella(this._svgFondo, dove2);
      }
      this._passoId = requestAnimationFrame(passo);
    };
    this._passoId = requestAnimationFrame(passo);
    // rete di sicurezza: se il disegno non arriva (scheda nascosta) il
    // viaggio deve finire lo stesso
    this._tappaId = setInterval(() => {
      if (!this.isConnected || !this._meta) { this._fermaOrologioTappa(); return; }
      this._render();
    }, 1000);
  }

  _fermaOrologioTappa() {
    if (this._tappaId) { clearInterval(this._tappaId); this._tappaId = null; }
    if (this._passoId) { cancelAnimationFrame(this._passoId); this._passoId = null; }
  }

  // quanto ci mette per ogni punto percentuale: di serie un quarto di
  // secondo (venticinque secondi per tutta la corsa), poi impara
  _secondiPerPunto() {
    const eid = this._config.entity || "";
    return VELOCITA_TAPPARELLE[eid] || 0.25;
  }

  _imparaVelocita() {
    const m = this._meta;
    if (!m || !m.quando) return;
    const punti = Math.abs(m.dove - m.da);
    if (punti < 15) return;   // troppo corto per fidarsi
    const secondi = (Date.now() - m.quando) / 1000;
    const ognuno = secondi / punti;
    if (ognuno < 0.02 || ognuno > 3) return;   // roba strana, lascio stare
    const eid = this._config.entity || "";
    const prima = VELOCITA_TAPPARELLE[eid];
    // media con quello che sapevo gia', cosi' non balla a ogni corsa
    VELOCITA_TAPPARELLE[eid] = prima ? (prima * 2 + ognuno) / 3 : ognuno;
  }

  _fermaViaggio(imparato) {
    if (imparato) this._imparaVelocita();
    this._meta = null;
    this._fermaOrologioTappa();
  }

  _posizioneMostrata(st) {
    const suo = this._config.entity && this._config.entity.split(".")[0] === "cover";
    if (this._trascino && this._range && this._cursore && !this._cursore.hidden && suo) {
      const v = Number(this._range.value);
      if (!isNaN(v)) return Math.max(0, Math.min(100, v));
    }
    const vera = this._quantoAperta(st);
    // sto ancora andando dove le ho detto io? Allora il numero e il cursore
    // dicono gia' dove arrivera': quello e' il valore che ha scelto lui
    const m = this._meta;
    if (suo && m) {
      const arrivata = vera !== null && Math.abs(vera - m.dove) <= 2;
      const scaduta = Date.now() - m.quando > 180000;
      if (arrivata) { this._fermaViaggio(true); return vera; }
      if (scaduta) { this._fermaViaggio(false); return vera; }
      return m.dove;
    }
    return vera;
  }

  // dove sta il disegno mentre viaggia: questa e' l'unica cosa che si muove
  _posizioneDisegno(st) {
    const m = this._meta;
    const vera = this._quantoAperta(st);
    if (!m) return this._posizioneMostrata(st);
    const punti = Math.abs(m.dove - m.da) || 1;
    const quanto = (Date.now() - m.quando) / 1000 / this._secondiPerPunto();
    let mia = m.da + (m.dove > m.da ? 1 : -1) * Math.min(quanto, punti);
    // se l'apparecchio dice di essere piu' avanti, gli credo
    if (vera !== null) {
      const avanti = m.dove > m.da ? Math.max(mia, vera) : Math.min(mia, vera);
      if (m.dove > m.da ? avanti <= m.dove : avanti >= m.dove) mia = avanti;
    }
    return Math.max(0, Math.min(100, mia));
  }

  // quanto e' aperta una tapparella: null se non lo sa dire
  _quantoAperta(st) {
    const c = this._config;
    if (!st || !c.entity || c.entity.split(".")[0] !== "cover") return null;
    const dove = st.attributes.current_position;
    if (dove === undefined || dove === null) return null;
    const n = Number(dove);
    return isNaN(n) ? null : Math.max(0, Math.min(100, n));
  }

  _datiBatteria(st) {
    const c = this._config;
    const stati = this._hass ? this._hass.states : {};
    let perc = NaN;
    if (st) {
      const n = parseFloat(st.state);
      const u = st.attributes.unit_of_measurement;
      if (!isNaN(n) && (u === "%" || /batter|livello|level|soc/i.test(c.entity || ""))) {
        perc = n;
      } else if (st.attributes.battery_level !== undefined) {
        perc = parseFloat(st.attributes.battery_level);
      }
    }

    const dice = (valore) => {
      const t = String(valore === true ? "charging" : (valore || "")).toLowerCase();
      if (!t) return false;
      if (["not_charging", "discharging", "non in carica", "scarica", "none",
           "off", "unplugged"].some((x) => t.indexOf(x) >= 0)) return false;
      return ["charging", "in carica", "carica", "ac", "usb", "wireless",
              "plugged", "on", "full"].some((x) => t.indexOf(x) >= 0);
    };

    let carica = false;
    if (st) {
      const a = st.attributes;
      if (a.is_charging === true || a.charging === true) carica = true;
      if (!carica && (a.battery_state || a.charger_type)) {
        carica = dice(a.battery_state || a.charger_type);
      }
    }
    // entita' vicine: stesso nome con un'altra coda
    if (!carica && c.entity) {
      const radice = String(c.entity).replace(
        /_(battery_level|battery|livello_batteria|soc|charge)$/, "");
      const code = ["_battery_state", "_stato_della_batteria", "_is_charging",
                    "_charging", "_battery_charging", "_charger_type", "_in_carica"];
      code.forEach((coda) => {
        if (carica) return;
        ["sensor", "binary_sensor"].forEach((dom) => {
          const eid = radice.replace(/^[a-z_]+\./, dom + ".") + coda;
          const alt = stati[eid];
          if (alt && dice(alt.state)) carica = true;
        });
      });
    }
    // e le misure che ha aggiunto lui alla casella
    if (!carica && Array.isArray(c.info_entita)) {
      c.info_entita.forEach((eid) => {
        const alt = stati[eid];
        if (!alt) return;
        const dc = alt.attributes.device_class || "";
        if (dc === "battery_charging" && alt.state === "on") carica = true;
        if (/charg|carica/i.test(eid) && dice(alt.state)) carica = true;
        // anche se il NOME non parla di carica, il suo stato puo' dirlo
        // ("In carica", "Charging"): qui pero' solo parole esplicite
        const t = String(alt.state).toLowerCase();
        if (t.indexOf("scarica") < 0 && t.indexOf("non in carica") < 0
            && (t.indexOf("in carica") >= 0 || t.indexOf("charging") >= 0
                || t.indexOf("plugged") >= 0)) {
          carica = true;
        }
      });
    }
    let scarica = false;

    // Prima di tutto: se lui ha detto quali entita' vogliono dire "sta
    // caricando" e "sta scaricando", comandano quelle e basta. Serve
    // perche' su certe centraline i watt che escono vengono dai pannelli,
    // non dalla batteria: dal nome non si capisce, lo sa solo lui.
    const attiva = (eid) => {
      const alt = stati[eid];
      if (!alt) return false;
      const n2 = parseFloat(alt.state);
      if (!isNaN(n2)) return n2 > 0;
      const t = String(alt.state).toLowerCase();
      if (["off", "unavailable", "unknown", "idle", "standby"].includes(t)) return false;
      return t === "on" || t.indexOf("charg") >= 0 || t.indexOf("carica") >= 0;
    };
    const elenco = (x) => (Array.isArray(x) ? x : (x ? [x] : []));
    const suoiCarica = elenco(c.carica_entita);
    const suoiScarica = elenco(c.scarica_entita);
    if (suoiCarica.length || suoiScarica.length) {
      carica = suoiCarica.some(attiva);
      scarica = !carica && suoiScarica.some(attiva);
      // se nessuna di quelle sta lavorando non mi fermo qui: provo lo
      // stesso a capirlo da solo, se no la casella resta muta
      if (carica || scarica) return { perc: perc, carica: carica, scarica: scarica };
    }

    // Se non me l'ha detto, provo a capirlo: un sensore di potenza che nel
    // nome parla di carica (o di scarica) e segna piu' di zero dice cosa
    // sta facendo la batteria. "Uscita" no: quella puo' venire dal sole.
    const guarda = (eid) => {
      const alt = stati[eid];
      if (!alt || String(alt.attributes.device_class || "") !== "power") return;
      // me la segno: e' una che devo tenere d'occhio anche in futuro
      if (!this._lette) this._lette = new Set();
      this._lette.add(eid);
      const n2 = parseFloat(alt.state);
      if (isNaN(n2) || n2 <= 0) return;
      // il nome che gli ha dato LUI sulla caselletta vale piu' di tutto:
      // se ha scritto "carica" su una misura, quella e' la carica, anche
      // se l'entita' si chiama "PV Input Power"
      const suo = String((c.info_nomi || {})[eid] || "").toLowerCase();
      if (suo) {
        if (/scaric|discharg/.test(suo)) { scarica = true; return; }
        if (/caric|charg/.test(suo)) { carica = true; return; }
      }
      const chi = (eid + " " + (alt.attributes.friendly_name || "")).toLowerCase();
      if (/discharg|scaric/.test(chi)) scarica = true;
      else if (/charg|carica/.test(chi)) carica = true;
    };
    // certi apparecchi hanno un sensore che lo dice a parole: "In carica",
    // "In scarica", "Charging". Vale piu' di qualsiasi indovinello sui watt.
    const aParole = (eid) => {
      const alt = stati[eid];
      if (!alt) return;
      const t = String(alt.state).toLowerCase();
      if (t.indexOf("in scarica") >= 0 || t.indexOf("discharging") >= 0) scarica = true;
      else if (t.indexOf("in carica") >= 0
               || (t.indexOf("charging") >= 0 && t.indexOf("not") < 0)) carica = true;
    };
    (Array.isArray(c.info_entita) ? c.info_entita : []).forEach(aParole);
    (Array.isArray(c.info_entita) ? c.info_entita : []).forEach(guarda);
    (Array.isArray(c.acceso_entita) ? c.acceso_entita : []).forEach(guarda);
    // le vicine: stesso inizio di nome, dal piu' preciso al piu' largo
    if (c.entity) {
      // l'elenco delle vicine si fa una volta sola: rifrugare fra tutte le
      // entita' della casa a ogni disegno costava carissimo
      if (PARENTI[c.entity] === undefined) {
        const trovate = [];
        const pezzi = String(c.entity).split(".")[1].split("_");
        for (let i = pezzi.length - 1; i >= 1 && !trovate.length; i -= 1) {
          const radice2 = pezzi.slice(0, i).join("_");
          if (radice2.length < 2) break;
          const inizio = "sensor." + radice2 + "_";
          Object.keys(stati).forEach((eid) => {
            if (eid.indexOf(inizio) !== 0) return;
            const alt = stati[eid];
            if (!alt || String(alt.attributes.device_class || "") !== "power") return;
            const chi = (eid + " " + (alt.attributes.friendly_name || "")).toLowerCase();
            if (/charg|caric|scaric/.test(chi)) trovate.push(eid);
          });
        }
        PARENTI[c.entity] = trovate;
      }
      PARENTI[c.entity].forEach(guarda);
    }
    // in carica vince: se la batteria sta prendendo corrente, quella che
    // esce dalla presa la stanno dando i pannelli, non lei
    if (carica) scarica = false;
    return { perc: perc, carica: carica, scarica: scarica };
  }

  // per il meteo l'icona segue il tempo che fa
  _nomeIcona(st) {
    const c = this._config;
    const dominio = c.entity ? c.entity.split(".")[0] : "";
    // il meteo comanda sempre lui
    if (dominio === "weather" && st && ICONA_METEO[st.state]) {
      return ICONA_METEO[st.state];
    }
    // nessuna scelta = la sceglie la card guardando l'entita'
    if (!c.icona || c.icona === "auto") {
      return c.entity ? iconaAutomatica(c.entity, st) : "luce";
    }
    return c.icona;
  }

  _valoreDi(st) {
    const c = this._config;
    if (!st) return this._ultimoBuono || "—";
    // i sensori via Bluetooth spariscono ogni tanto: invece di scrivere
    // "Assente" tengo l'ultimo valore che avevano
    if (["unavailable", "unknown"].includes(String(st.state).toLowerCase())
        && this._ultimoBuono) {
      return this._ultimoBuono;
    }
    const dominio = c.entity.split(".")[0];
    if (dominio === "weather") {
      const t = st.attributes.temperature;
      if (t !== undefined && t !== null) {
        const u = st.attributes.temperature_unit || "°C";
        return Math.round(t) + " " + u;
      }
      return (METEO[st.state] || [null, st.state])[1];
    }
    if (dominio === "light") {
      if (st.state !== "on") return "Spento";
      const b = st.attributes.brightness;
      return b ? Math.round(b / 2.55) + "%" : "Acceso";
    }
    if (dominio === "climate") {
      const t = st.attributes.current_temperature;
      return t !== undefined ? Math.round(t * 10) / 10 + "°" : st.state;
    }
    if (dominio === "cover") {
      const dove = this._posizioneMostrata(st);
      if (dove !== null) return Math.round(dove) + " %";
    }
    const scritto = valoreScritto(st);
    if (scritto !== null) return scritto;
    return PAROLE[String(st.state).toLowerCase()] || st.state;
  }

  _accesoSuValore(st) {
    const atteso = this._config.acceso_se;
    if (atteso === undefined || atteso === null || atteso === "") return null;
    if (!st) return false;
    const a = String(st.state).trim();
    const b = String(atteso).trim();
    if (a === b) return true;
    const na = Number(a);
    const nb = Number(b);
    return !isNaN(na) && !isNaN(nb) && na === nb;
  }

  // chi decide se la casella e' accesa: di solito la sua entita', ma si puo'
  // dire "guarda queste altre". Serve per esempio a una batteria: la carica
  // (93%) non dice niente, quello che conta e' se stanno uscendo watt - e i
  // watt possono passare da piu' sensori (scarica, uscita verso casa...),
  // quindi ne accetto quanti ne vuole: basta che ne "lavori" uno.
  _riferimenti(st) {
    const chi = this._config.acceso_entita;
    const elenco = (Array.isArray(chi) ? chi : [chi]).filter(Boolean);
    if (!elenco.length || !this._hass) {
      return [{ eid: this._config.entity, st: st }];
    }
    return elenco.map((eid) => ({ eid: eid, st: this._hass.states[eid] || null }));
  }

  _acceso(st) {
    return this._riferimenti(st).some((rif) => {
      const suValore = this._accesoSuValore(rif.st);
      if (suValore !== null) return suValore;
      return this._accesoNormale(rif.st, rif.eid);
    });
  }

  _accesoNormale(st, quale) {
    const c = this._config;
    const eid = quale || c.entity;
    // senza entita' la casella e' un pulsante: sempre a colori, ferma
    if (!eid) return c.acceso_sempre !== false;
    if (!st) return false;
    if (c.acceso_sempre) return true;
    const n = parseFloat(st.state);
    if (!isNaN(n) && st.state.trim() !== "" && !["light", "switch", "fan"].includes(eid.split(".")[0])) {
      return n > (c.soglia !== undefined && c.soglia !== null ? Number(c.soglia) : 0);
    }
    // un termosifone (o un condizionatore) e' "acceso" quando sta lavorando
    // davvero: se la stanza e' gia' calda l'apparecchio e' fermo, e la
    // casella deve stare grigia anche se il modo e' "riscaldamento"
    if (eid.split(".")[0] === "climate") {
      const modi = st.attributes.hvac_modes || [];
      const cosaFa = st.attributes.hvac_action;
      // certi termostati non hanno il modo "spento" (il termo del bagno ha
      // solo "riscaldamento"): li' l'unica cosa che cambia e' se sta
      // scaldando o no, altrimenti la casella resterebbe accesa per sempre
      if (modi.length && !modi.includes("off") && cosaFa) {
        return !["idle", "off"].includes(String(cosaFa).toLowerCase());
      }
      return String(st.state).toLowerCase() !== "off";
    }

    // la musica in pausa e' comunque accesa: il brano c'e' ancora, quindi
    // bordo, alone ed effetti devono restare. Spenta solo se e' davvero
    // spenta, ferma o non raggiungibile.
    if (eid.split(".")[0] === "media_player") {
      return ["playing", "paused", "buffering", "on"]
        .includes(String(st.state).toLowerCase());
    }
    return !SPENTI.includes(String(st.state).toLowerCase());
  }

  _render() {
    if (!this._config) return;
    // conto quante volte si ridisegna: se qualcosa gira a vuoto si vede
    // subito dal conto sulla targhetta
    const adessoR = Date.now();
    if (adessoR - (this._daQuandoR || 0) > 250) {
      this._daQuandoR = adessoR;
      this._quantiR = 0;
    }
    this._quantiR = (this._quantiR || 0) + 1;
    // PARACADUTE: nessuno ha bisogno di ridisegnarsi cento volte in un
    // quarto di secondo. Oltre le trenta volte metto il disegno in coda e
    // ne faccio uno solo: chi gira a vuoto smette di bruciare la macchina
    // (l'occhio non se ne accorge, sono sessanta disegni al secondo).
    if (this._quantiR > 40) {
      if (!this._disegnoDopo) {
        this._disegnoDopo = setTimeout(() => {
          this._disegnoDopo = 0;
          this._quantiR = 0;
          this._daQuandoR = 0;
          if (this.isConnected) this._render();
        }, 250);
      }
      return;
    }
    if (!this._costruito) this._costruisci();
    // se ci sono piu' casse, la card lavora su quella scelta / che suona
    if (this._base) {
      const attiva = this._entitaAttiva();
      this._config = attiva === this._base.entity
        ? this._base : { ...this._base, entity: attiva };
    }
    const c = this._config;
    const st = this._hass ? this._hass.states[c.entity] : null;
    const acceso = this._acceso(st);

    const dominioTinta = (c.entity || "").split(".")[0];
    let col = COLORI[c.colore] || COLORI.ambra;
    if (c.colore === "personalizzato" && Array.isArray(c.colore_rgb)) {
      col = daRgb(c.colore_rgb) || col;
    }
    if (c.colore === "termometro") {
      const quanto = st
        ? (st.attributes.current_temperature !== undefined
            ? st.attributes.current_temperature
            : (st.attributes.temperature !== undefined && dominioTinta === "weather"
                ? st.attributes.temperature : st.state))
        : null;
      col = coloreTemperatura(quanto) || col;
    }
    if (c.colore === "luce") {
      // il colore vero della lampada, se ce l'ha acceso
      const rgb = st && (st.attributes.rgb_color || st.attributes.rgbw_color);
      if (Array.isArray(rgb) && rgb.length >= 3) {
        col = daRgb(coloreLampada([rgb[0], rgb[1], rgb[2]])) || col;
      } else if (st && st.attributes.color_temp_kelvin) {
        // bianco caldo/freddo: lo avvicino a un colore
        const k = Number(st.attributes.color_temp_kelvin);
        col = k < 3200 ? "#ffbe63" : (k < 4500 ? "#ffe0b0" : "#dcecff");
      } else {
        col = COLORI.ambra;
      }
    }

    // lo sfondo del riquadro delle casse/sorgenti, se l'ha scelto lui
    const panTinta = Array.isArray(c.pannello_sfondo) ? daRgb(c.pannello_sfondo) : null;
    const panOpaco = 1 - (c.pannello_trasparenza === undefined
      ? 0 : Number(c.pannello_trasparenza)) / 100;
    if (panTinta || panOpaco < 1) {
      const alto = panTinta || "#141d2b";
      const basso = panTinta ? scurisci(panTinta, 0.62) : "#0a1019";
      this.style.setProperty("--pan-bg", "linear-gradient(160deg, "
        + conAlfa(alto, panOpaco) + " 0%, " + conAlfa(basso, panOpaco) + " 100%)");
    } else {
      this.style.removeProperty("--pan-bg");
    }

    // il vestito del pop-up: tinta, foto e trasparenza della finestra, e
    // i colori che passano alle schede di Home Assistant che stanno dentro
    this._vestiFinestra();
    this._mettiAPosto();
    // Le misure e l'icona nascono piu' avanti nel disegno: qui non ci sono
    // ancora, e restavano ammucchiate in alto a sinistra sopra al nome
    // finche' non si rifaceva la casella. Ci ripasso appena finito il giro,
    // prima che il browser dipinga: cosi' non si vede nessun saltello.
    if (!this._ripassoPosti) {
      this._ripassoPosti = true;
      Promise.resolve().then(() => {
        this._ripassoPosti = false;
        if (this._config && this._costruito) this._mettiAPosto();
      });
    }

    // la scritta puo' avere un colore suo, staccato da quello degli effetti
    const scritta = Array.isArray(c.colore_testo) ? daRgb(c.colore_testo) : null;
    if (scritta) {
      this.style.setProperty("--testo", scritta);
      this.style.setProperty("--testo2", conAlfa(scritta, 0.72));
    } else {
      this.style.removeProperty("--testo");
      this.style.removeProperty("--testo2");
    }
    // e il numero grande puo' averne uno tutto suo, diverso dal nome
    const numero = Array.isArray(c.colore_valore) ? daRgb(c.colore_valore) : null;
    if (numero) this.style.setProperty("--testo-val", numero);
    else this.style.removeProperty("--testo-val");

    // sfondo della casella: tinta, foto o quello di serie, con trasparenza
    const opaco = 1 - (c.trasparenza === undefined ? 0 : Number(c.trasparenza)) / 100;
    const tinta = Array.isArray(c.sfondo_colore) ? daRgb(c.sfondo_colore) : null;
    let fondo = tinta
      ? "linear-gradient(160deg, " + conAlfa(tinta, opaco) + ", "
        + conAlfa(tinta, Math.max(0, opaco - 0.25)) + ")"
      : "linear-gradient(160deg, " + conAlfa("#111a27", opaco) + " 0%, "
        + conAlfa("#0d1420", opaco) + " 100%)";
    // se la casella e' gia' un meteo, il cielo lo prende da se stessa
    const suoDominio = c.entity ? c.entity.split(".")[0] : "";
    const meteoSt = (c.meteo_entita && this._hass)
      ? this._hass.states[c.meteo_entita]
      : (suoDominio === "weather" ? st : null);
    const cieloVoluto = c.sfondo_meteo === undefined
      ? suoDominio === "weather" : !!c.sfondo_meteo;
    const conCielo = cieloVoluto && !!meteoSt && !c.sfondo_immagine;
    if (conCielo) {
      const cielo = CIELI[meteoSt.state] || CIELI.cloudy;
      const velo = (c.sfondo_velo === undefined ? 18 : Number(c.sfondo_velo)) / 100;
      fondo = "linear-gradient(rgba(6,9,14," + (velo * 0.5) + "), rgba(6,9,14,"
        + (velo + 0.12) + ")), " + cielo[0];
    }
    if (c.sfondo_immagine) {
      const velo = (c.sfondo_velo === undefined ? 45 : Number(c.sfondo_velo)) / 100;
      // come si adatta: riempie tagliando, ci sta tutta, o grandezza vera
      const adatta = c.sfondo_adatta === "intera" ? "center/contain"
        : (c.sfondo_adatta === "vera" ? "center/auto" : "center/cover");
      fondo = "linear-gradient(rgba(6,9,14," + velo + "), rgba(6,9,14," + velo + ")), "
        + 'url("' + c.sfondo_immagine + '") ' + adatta + ' no-repeat';
    }
    // la telecamera a tutta casella: l'immagine si rifa' da sola, cosi' e'
    // una diretta e non lo scatto di quando hai aperto la pagina
    const diretta = this._immagineDiretta(st);
    if (diretta) {
      const velo = (c.sfondo_velo === undefined ? 28 : Number(c.sfondo_velo)) / 100;
      const adatta = c.sfondo_adatta === "intera" ? "center/contain"
        : (c.sfondo_adatta === "vera" ? "center/auto" : "center/cover");
      fondo = "linear-gradient(rgba(6,9,14," + (velo * 0.5).toFixed(2)
        + "), rgba(6,9,14," + Math.min(0.92, velo + 0.14).toFixed(2) + ")), "
        + 'url("' + diretta + '") ' + adatta + ' no-repeat';
    }
    const forza = (c.meteo_forza === undefined || c.meteo_forza === null
      ? 92 : Number(c.meteo_forza)) / 100;
    this.style.setProperty("--forza-cielo", String(forza));
    this._disegnaCielo(conCielo && forza > 0
      ? (CIELI[meteoSt.state] || CIELI.cloudy)[1] : null);
    this.style.setProperty("--card-bg", fondo);
    this.toggleAttribute("sfondo-foto", !!c.sfondo_immagine || !!diretta);
    this.toggleAttribute("diretta", !!diretta);
    const vel = (c.velocita === undefined || c.velocita === null ? 100 : Number(c.velocita)) / 100;
    this.style.setProperty("--vel", String(Math.max(0.1, vel)));
    const k = (c.intensita === undefined || c.intensita === null
      ? 60 : Number(c.intensita)) / 100;
    this.style.setProperty("--c", col);
    this.style.setProperty("--bordo", conAlfa(col, 0.22 + 0.66 * k));
    this.style.setProperty("--alone1", conAlfa(col, 0.06 + 0.30 * k));
    this.style.setProperty("--alone2", conAlfa(col, 0.06 + 0.38 * k));
    this.style.setProperty("--velo", conAlfa(col, 0.05 + 0.38 * k));
    this.setAttribute("effetto", c.effetto || "alone");
    this.toggleAttribute("acceso", acceso);
    const quando = c.anima || (c.entity ? "attiva" : "mai");
    this.toggleAttribute("anima",
      quando === "sempre" ? true : quando === "mai" ? false : acceso);
    this.toggleAttribute("grande", !!c.grande);
    // termosifoni e condizionatori: acceso e' una cosa, stare lavorando
    // un'altra. Da fermo la casella resta sobria.
    const cosaFa = st && st.attributes ? st.attributes.hvac_action : null;
    this.toggleAttribute("fermo", !!cosaFa
      && ["idle", "off"].includes(String(cosaFa).toLowerCase()));
    // la copertina tonda gira solo se lo vuole (di serie si')
    this.toggleAttribute("gira", c.gira_copertina !== false);

    this._nome.textContent =
      c.name || (st ? st.attributes.friendly_name : c.entity) || "Casella";
    let sotto = c.sottotitolo || "";
    if (!sotto && !c.sottotitolo_entita && st && c.entity
        && c.entity.split(".")[0] === "weather" && METEO[st.state]) {
      sotto = METEO[st.state][1];
    }
    if (!sotto && !c.sottotitolo_entita && st && c.entity
        && c.entity.split(".")[0] === "media_player") {
      const brano = st.attributes.media_title;
      const chi = nomeArtista(st.attributes.media_artist)
        || st.attributes.media_album_name;
      if (brano) sotto = brano + (chi ? " - " + chi : "");
    }
    this._viaUsata = this._entitaIndirizzo();
    if (this._viaUsata && this._hass) {
      const alt = this._hass.states[this._viaUsata];
      if (alt) {
        const grezzo = alt.state;
        const u = alt.attributes.unit_of_measurement;
        sotto = (grezzo === "unknown" || grezzo === "unavailable")
          ? "" : grezzo + (u ? " " + u : "");
        if (c.sottotitolo) sotto = c.sottotitolo + " " + sotto;
      }
    }
    const dominio = c.entity ? c.entity.split(".")[0] : "";
    let modo = c.disposizione;
    if (!modo && dominio === "media_player") modo = "vinile";
    const comePersona = modo === "persona";
    if (["persona", "musica", "vinile"].includes(modo)) this.setAttribute("disposizione", modo);
    else this.removeAttribute("disposizione");

    if (modo === "vinile") {
      const brano = st ? st.attributes.media_title : "";
      const chi = st
        ? (nomeArtista(st.attributes.media_artist) || st.attributes.media_album_name)
        : "";
      // le due scritte le rifaccio solo se cambia la forma, se no basta il testo
      const forma = brano ? "due" : "una";
      if (this._sotto.dataset.forma !== forma) {
        this._sotto.dataset.forma = forma;
        this._sotto.innerHTML = brano
          ? '<span class="brano"></span><span class="artista"></span>'
          : '<span class="brano"></span>';
      }
      if (brano) {
        this._sotto.querySelector(".brano").textContent = brano;
        this._sotto.querySelector(".artista").textContent = chi || "";
      } else {
        this._sotto.querySelector(".brano").textContent = sotto || this._valoreDi(st);
      }
      this._sotto.style.display = "";
    } else if (modo === "musica") {
      this._sotto.textContent = sotto;
      this._sotto.style.display = sotto ? "" : "none";
    } else if (comePersona) {
      const parti = [];
      if (st) {
        const quanto = c.mostra_da_quanto === false ? "" : daQuanto(st.last_changed);
        const via = this._quantoLontanoDaCasa(st);
        parti.push('<span class="stato">' + this._valoreDi(st) + "</span>");
        const extra = [quanto, via].filter(Boolean).join(" \u00b7 ");
        if (extra) {
          parti.push('<span class="quando" title="Distanza in linea d’aria dal '
            + 'punto che Home Assistant considera casa: su strada e sempre di piu">'
            + extra + "</span>");
        }
      }
      if (sotto) parti.push('<span class="via">\uD83D\uDCCD ' + sotto + "</span>");
      this._sotto.innerHTML = parti.join("");
      this._sotto.style.display = parti.length ? "" : "none";
    } else {
      this._sotto.textContent = sotto;
      this._sotto.style.display = sotto ? "" : "none";
    }
    // l'anello attorno alla foto dice dove si trova
    if (comePersona && st) {
      const dove = String(st.state).toLowerCase();
      const zona = dove === "home" ? "#3fd98a"
        : (dove === "not_home" ? "#ffc046" : "#5ec8ff");
      this.style.setProperty("--zona", zona);
      this.setAttribute("dove", dove === "home" ? "casa"
        : (dove === "not_home" ? "fuori" : "zona"));
    } else {
      this.removeAttribute("dove");
    }

    // "da quanto" sotto al nome, per qualsiasi entita'
    if (!comePersona && c.mostra_da_quanto && st && modo !== "vinile") {
      const quanto = daQuanto(st.last_changed);
      if (quanto) {
        const pezzi = [this._valoreDi(st) + " " + quanto];
        if (sotto) pezzi.push(sotto);
        this._sotto.textContent = pezzi.join(" \u00b7 ");
        this._sotto.style.display = "";
      }
    }
    this._avviaTicchettio(!!(c.mostra_da_quanto || comePersona));

    const scritto = (c.nascondi_valore || !c.entity) ? "" : this._valoreDi(st);
    const sparito = !!st
      && ["unavailable", "unknown"].includes(String(st.state).toLowerCase());
    if (!sparito && st && !isNaN(parseFloat(st.state))) this._ultimoBuono = scritto;
    this.toggleAttribute("assente", sparito && !!this._ultimoBuono);
    this._valore.title = sparito && this._ultimoBuono
      ? "Ultimo valore letto: adesso il sensore non risponde" : "";
    this._valore.textContent = scritto;
    const numerico = /^[0-9.,\-]/.test(String(scritto).trim());
    this._valore.classList.toggle("parola", !!scritto && !numerico);
    if (this._velo && this._velo.hasAttribute("aperto")) this._aggiornaFinestra();
    this._disegnaTempo(st);
    this._disegnaComandi(st);
    this._disegnaLettori();
    this._disegnaExtra(st);
    this._disegnaColori(st);
    this._disegnaAntPopup();
    if (this._copertina) {
      const suaCop = fotoDi(st);
      const cop = c.sfondo_copertina && !!suaCop && !c.sfondo_immagine;
      this._copertina.hidden = !cop;
      if (cop) {
        const quanto = (c.sfondo_sfocatura === undefined || c.sfondo_sfocatura === null)
          ? 8 : Number(c.sfondo_sfocatura);
        this.style.setProperty("--sfoca", quanto + "px");
        // niente doppio scurimento: a scurire ci pensa solo il velo qui sotto
        this.style.setProperty("--luce-cop", "0.95");
        // quanto scurirla lo decide lui con "Velo scuro sulla foto"
        const velo = (c.sfondo_velo === undefined ? 30 : Number(c.sfondo_velo)) / 100;
        // il velo sta nella stessa proprieta' della foto: cosi' viene sfocato
        // insieme a lei e il titolo resta leggibile
        const url = "linear-gradient(180deg, rgba(8,12,20," + (velo * 0.7).toFixed(2)
          + "), rgba(8,12,20," + Math.min(0.92, velo + 0.16).toFixed(2) + ")), "
          + 'url("' + suaCop + '")';
        if (this._copertina.style.backgroundImage !== url) {
          this._copertina.style.backgroundImage = url;
        }
      }
    }
    this._disegnaMeteo();
    this._disegnaChips();
    this._disegnaAndamento(st);
    // misurare costa una passata di conti al browser: la faccio al massimo
    // una volta al secondo, in mezzo mi basta la decisione con l'altezza nota
    if (this._altezzaVista && Date.now() - (this._quandoMisura || 0) < 1000) {
      this._decidiCompatta();
    } else {
      this._controllaMisura();
    }
    this._disegnaCursore(st);
    // il timbro va deciso prima: vale anche se la fotina davanti non c'e'
    this._timbro(st);
    const foto = fotoDi(st);
    // se non la vuole, via l'icona in tutte le sue forme
    if (c.mostra_icona === false) {
      this._ritratto.hidden = true;
      this._svg.style.display = "none";
      if (this._svgHa) this._svgHa.hidden = true;
      if (this._svgFoto) this._svgFoto.hidden = true;
      return;
    }
    const usaFoto = foto && c.usa_foto !== false;
    this._ritratto.hidden = !usaFoto;
    this._svg.style.display = usaFoto ? "none" : "";
    if (usaFoto && this._ritratto.getAttribute("src") !== foto) {
      this._ritratto.src = foto;
    }
    // attenzione: il confronto va fatto sull'icona VERA (per il meteo
    // cambia da sola col tempo), non su quella scritta nelle impostazioni
    // un'icona sua, presa dal telefono o dal PC, viene prima di tutto
    const suaFoto = c.icona_immagine;
    if (this._svgFoto) {
      this._svgFoto.hidden = !suaFoto || usaFoto;
      if (suaFoto && this._svgFoto.getAttribute("src") !== suaFoto) {
        this._svgFoto.src = suaFoto;
      }
    }
    if (suaFoto && !usaFoto) {
      this._svg.style.display = "none";
      if (this._svgHa) this._svgHa.hidden = true;
      return;
    }

    // se ha scelto un'icona di Home Assistant, comanda quella; se non ha
    // scelto niente ma l'entita' ha gia' la sua (impostata in Home Assistant
    // o dall'integrazione), usiamo quella: e' quello che fanno le altre schede
    const sceltaSua = c.icona && c.icona !== "auto";
    const dellEntita = (!sceltaSua && c.icona_entita !== false && st)
      ? st.attributes.icon : null;
    const suaIcona = c.icona_ha || dellEntita;
    const conIconaHa = !!suaIcona && !usaFoto && !!customElements.get("ha-icon");
    if (this._svgHa) {
      this._svgHa.hidden = !conIconaHa;
      if (conIconaHa && this._svgHa.getAttribute("icon") !== suaIcona) {
        this._svgHa.setAttribute("icon", suaIcona);
      }
    }
    if (conIconaHa) { this._svg.style.display = "none"; return; }

    const q = this._disegnoDi(st);
    if (this._svg.dataset.icona !== q.chiave) {
      this._svg.innerHTML = q.disegno;
      this._svg.dataset.icona = q.chiave;
    }
    // la misura va ritentata finche' non riesce: il primo giro puo' capitare
    // prima che la casella sia attaccata alla pagina, e li' non si puo'
    // misurare niente. Quando e' gia' saputa costa solo scrivere un numero.
    this._adattaDisegno(q.forma);
    if (q.taglia !== null) tagliaTapparella(this._svg, q.taglia);
  }

  // quale disegno ci vuole, con la sua chiave (per non rifarlo inutilmente)
  // e la sua "forma" (per non rimisurare il riquadro a ogni numero)
  _disegnoDi(st) {
    const nomeIcona = this._nomeIcona(st);
    let disegno = ICONE[nomeIcona] || disegnoMdi(nomeIcona) || ICONE.luce;
    let chiave = nomeIcona;
    let forma = nomeIcona;
    let taglia = null;
    if (nomeIcona === "batteria") {
      const b = this._datiBatteria(st);
      disegno = disegnoBatteria(b.perc, b.carica, b.scarica);
      chiave = "batteria|" + (isNaN(b.perc) ? "-" : Math.round(b.perc))
        + "|" + (b.carica ? "c" : "f");
      // solo il fulmine cambia l'ingombro
      forma = b.carica ? "batteria|c" : "batteria|-";
    }
    const dove = this._posizioneMostrata(st);
    if (nomeIcona === "tapparella" && dove !== null) {
      // si muove se lo dice Home Assistant o se lo sto ancora portando io
      let moto = (st && st.state === "opening") ? "su"
        : ((st && st.state === "closing") ? "giu" : "");
      if (!moto && this._meta) moto = this._meta.dove > this._meta.da ? "su" : "giu";
      disegno = disegnoTapparella(moto);
      chiave = "tapparella|" + moto;
      forma = "tapparella|pos";
      taglia = this._posizioneDisegno(st);
    }
    return { disegno: disegno, chiave: chiave, forma: forma, taglia: taglia };
  }

  // l'icona in grande dietro alle scritte: e' lo stesso disegno, sbiadito.
  // Vale anche se la fotina davanti l'ha tolta: anzi, e' proprio il bello.
  _timbro(st) {
    const box = this._svgFondo;
    if (!box) return;
    const c = this._config;
    if (!c.icona_sfondo || !c.entity) {
      this.toggleAttribute("fondo-giu", false);
      if (!box.hasAttribute("hidden")) {
        box.toggleAttribute("hidden", true);
        box.innerHTML = "";
        box.dataset.icona = "";
      }
      return;
    }
    box.toggleAttribute("hidden", false);
    // se la fotina piccola l'ha tolta, il timbro scende a sinistra da solo:
    // non c'e' niente da impostare, lo decide la card
    this.toggleAttribute("fondo-giu", c.mostra_icona === false);
    const forza = (c.icona_sfondo_forza === undefined || c.icona_sfondo_forza === null
      ? 20 : Number(c.icona_sfondo_forza)) / 100;
    this.style.setProperty("--fondoico", String(Math.max(0, forza * 0.7)));
    this.style.setProperty("--fondoico-acceso", String(Math.max(0, forza)));
    const q = this._disegnoDi(st);
    if (box.dataset.icona !== q.chiave) {
      box.innerHTML = q.disegno;
      box.dataset.icona = q.chiave;
    }
    riempiRiquadro(box, q.forma);
    if (q.taglia !== null) tagliaTapparella(box, q.taglia);
  }

  // il disegno riempie il suo quadrato: misuro quanto occupa davvero e
  // stringo il riquadro attorno, cosi' le nostre icone si vedono grandi
  // come quelle di Home Assistant
  _adattaDisegno(chiave) {
    riempiRiquadro(this._svg, chiave);
  }

}

/* ----------------------------------------------------------------- editor */
const SEZIONI = [
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
          { value: "musica", label: "Musica compatta - copertina piccola di lato" },
        ] } } },
        { name: "grande", selector: { boolean: {} } },
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
      { titolo: "Colore della scritta",
        colori: ["colore_testo", "colore_valore"], schema: [
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
      { schema: [
        { name: "grafico", selector: { boolean: {} } },
        { name: "grafico_ore",
          selector: { number: { min: 1, max: 168, step: 1, mode: "box" } } },
        { name: "grafico_stile", selector: { select: { mode: "dropdown", options: [
          { value: "area", label: "Area piena" },
          { value: "linea", label: "Solo la linea" },
        ] } } },
        { name: "grafico_estremi", selector: { boolean: {} } },
      ] },
    ],
  },
  {
    chiave: "musica", titolo: "Musica", segno: "🎵",
    gruppi: [
      { titolo: "Comandi", schema: [
        { name: "comandi_media", selector: { boolean: {} } },
        { name: "tempo_media", selector: { boolean: {} } },
        { name: "gira_copertina", selector: { boolean: {} } },
      ] },
      { titolo: "La copertina come sfondo", schema: [
        { name: "sfondo_copertina", selector: { boolean: {} } },
        { name: "sfondo_sfocatura",
          selector: { number: { min: 0, max: 24, step: 1, mode: "slider" } } },
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
        { name: "finestra_titolo", selector: { text: {} } },
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
];

// campi che compaiono solo con una certa azione al tocco
const SOLO_AZIONE = {
  servizio: "servizio", servizio_dati: "servizio",
  indirizzo_web: "link", popup: "popup", finestra_titolo: "finestra",
  finestra_sfondo: "finestra", finestra_trasparenza: "finestra",
  finestra_immagine: "finestra", finestra_schede_sfondo: "finestra",
  finestra_schede_trasparenza: "finestra",
};

// quali impostazioni hanno senso per quale tipo di entita'
const SOLO_PER = {
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
  comandi_rapidi: ["cover", "lock", "vacuum"],
  grafico: ["sensor", "number", "input_number", "counter", "climate", "light"],
  grafico_ore: ["sensor", "number", "input_number", "counter", "climate", "light"],
  grafico_stile: ["sensor", "number", "input_number", "counter", "climate", "light"],
  grafico_estremi: ["sensor", "number", "input_number", "counter", "climate", "light"],
  gira_copertina: ["media_player"],
  segui_attivo: ["media_player"],
  multiroom: ["media_player"],
  sorgente: ["media_player"],
  soglia: ["sensor", "number", "input_number", "counter"],
  acceso_sempre: ["sensor", "binary_sensor", "weather", "number", "input_number",
                  "counter", "media_player"],
};

const ETICHETTE = {
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
  comandi_rapidi: "Tasti rapidi (tapparelle, serrature, aspirapolvere)",
  grafico: "Mostra il grafico dell'andamento dentro la casella",
  grafico_ore: "Quante ore di storia (di serie 24)",
  grafico_stile: "Come si disegna",
  grafico_estremi: "Scrivi il minimo e il massimo del periodo",
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
  finestra_sfondo: "Tinta della finestra del pop-up (le schede dentro hanno la loro, qui sotto)",
  finestra_trasparenza: "Trasparenza del pop-up (%)",
  finestra_immagine: "Foto di sfondo del pop-up - indirizzo, es. /local/foto.jpg",
  // finestra_schede_sfondo / finestra_schede_trasparenza: non si scelgono
  // piu' da qui (ogni scheda ha la sua riga), ma se c'erano gia' valgono
  // ancora come valore di partenza
};

const SCHEDE_PRONTE = [
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

const SCHEDE_ALTRE = [
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
const SCHEDA_MANO = "__amano__";

// il nome per esteso di una scheda (quello che si vede nell'elenco di HA)
const NOMI_HA = {
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

function nomeScheda(tipo) {
  const pulito = String(tipo || "").replace("custom:", "");
  if (NOMI_HA[pulito]) return NOMI_HA[pulito];
  const elenco = window.customCards || [];
  for (let i = 0; i < elenco.length; i += 1) {
    const c = elenco[i];
    if (c && (c.type === pulito || c.type === tipo)) return c.name || pulito;
  }
  return pulito.replace(/-/g, " ").replace(/card/gi, "").trim() || pulito;
}

const STILE_SELETTORE = `
.scelta-riga { display: flex; gap: 8px; align-items: center; margin-top: 6px; }
.tendina { flex: 1; padding: 10px 12px; border-radius: 10px; font: inherit; font-size: 14px;
  border: 1px solid var(--divider-color, #555);
  background: var(--card-background-color, #1c1c1c); color: var(--primary-text-color, #fff); }
.tendina optgroup { color: var(--secondary-text-color, #aaa); }
.tendina option { color: var(--primary-text-color, #fff);
  background: var(--card-background-color, #1c1c1c); }
`;

const STILE_EDITOR = `
.targhetta { margin-left: auto; align-self: center; font-size: 10.5px;
  color: var(--secondary-text-color, #8ea0b8); opacity: .7;
  font-variant-numeric: tabular-nums; letter-spacing: .02em; }
.cercaOpz {
  width: 100%; box-sizing: border-box; margin: 0 0 8px; padding: 9px 12px;
  border-radius: 12px; font: inherit; font-size: 13px;
  border: 1px solid var(--divider-color, #2a3a4f);
  background: var(--secondary-background-color, #16202c);
  color: var(--primary-text-color, #eaf1fb);
}
.trovate { display: grid; gap: 4px; margin-bottom: 10px; }
.trovate[hidden] { display: none !important; }
.trovata {
  appearance: none; text-align: left; cursor: pointer; font: inherit;
  border: 1px solid var(--divider-color, #2a3a4f); border-radius: 10px;
  background: var(--secondary-background-color, #16202c); padding: 7px 10px;
  color: var(--primary-text-color, #eaf1fb); display: grid; gap: 1px;
}
.trovata b { font-size: 12.5px; font-weight: 600; }
.trovata span { font-size: 11px; color: var(--secondary-text-color, #8ea0b8); }
.trovata.niente { cursor: default; color: var(--secondary-text-color, #8ea0b8);
  font-size: 12px; }
ha-form[acceso] { outline: 2px solid var(--primary-color, #5ec8ff);
  outline-offset: 4px; border-radius: 10px; }
.titoloGruppo { margin: 16px 0 2px; font-size: 12px; font-weight: 700;
  letter-spacing: .05em; text-transform: uppercase;
  color: var(--secondary-text-color, #8ea0b8); }
.titoloGruppo[hidden] { display: none !important; }
.pannello > ha-form[hidden] { display: none !important; }
.pannello > .titoloGruppo:first-child { margin-top: 4px; }
.schede { display: flex; flex-wrap: wrap; gap: 2px 4px; margin-bottom: 12px;
  border-bottom: 1px solid var(--divider-color, #444); }
.scheda { appearance: none; background: none; border: none; cursor: pointer; font: inherit;
  font-size: 13.5px; font-weight: 600; padding: 11px 13px; white-space: nowrap;
  color: var(--secondary-text-color, #9aa5b1); border-bottom: 2px solid transparent;
  display: flex; align-items: center; gap: 6px; }
.scheda:hover { color: var(--primary-text-color, #fff); }
.scheda[scelta] { color: var(--primary-color, #03a9f4);
  border-bottom-color: var(--primary-color, #03a9f4); }
.scheda .segno { font-size: 15px; line-height: 1; }
.pannello[nascosto] { display: none; }
.blocco { margin-top: 16px; padding: 14px; border-radius: 12px;
  border: 1px solid var(--divider-color, #444); }
.blocco h4 { margin: 0 0 4px; font-size: 15px; }
.blocco p.aiuto { margin: 0 0 12px; font-size: 13px; color: var(--secondary-text-color); }
.riga-scheda { display: flex; align-items: center; gap: 6px; padding: 8px 10px;
  border: 1px solid var(--divider-color, #444); border-radius: 10px; margin-bottom: 8px; }
.riga-scheda.aperta { border-color: var(--primary-color); }
.riga-scheda .num { opacity: .6; font-size: 12px; min-width: 18px; }
.riga-scheda .tipo { display: flex; flex-direction: column; min-width: 0;
  overflow: hidden; }
.riga-scheda .tipo .chiaro { font-weight: 600; font-size: 14px; overflow: hidden;
  text-overflow: ellipsis; white-space: nowrap; }
.riga-scheda .tipo .piccolo { font-size: 11px; opacity: .55; overflow: hidden;
  text-overflow: ellipsis; white-space: nowrap; }
.riga-scheda .spinta { margin-left: auto; display: flex; gap: 2px; }
/* la manina per riordinare: si tiene premuta e si trascina */
.riga-scheda .presa { cursor: grab; touch-action: none; user-select: none;
  opacity: .45; font-size: 15px; line-height: 1; padding: 2px 4px;
  margin-left: -4px; flex: none; }
.riga-scheda .presa:hover { opacity: .95; }
.riga-scheda.inmano { position: relative; z-index: 3; cursor: grabbing;
  box-shadow: 0 6px 18px rgba(0,0,0,.55); opacity: .95; }
.riga-scheda.segnaSopra { box-shadow: inset 0 2px 0 var(--primary-color, #f0b429); }
.riga-scheda.segnaSotto { box-shadow: inset 0 -2px 0 var(--primary-color, #f0b429); }
.editor-scheda { margin: 0 0 14px; padding: 12px; border-radius: 10px;
  border: 1px dashed var(--divider-color, #444); }
.vuoto { font-size: 13px; color: var(--secondary-text-color); margin-bottom: 10px; }
.codice-scheda { margin-top: 12px; border-top: 1px solid var(--divider-color, #444);
  padding-top: 10px; }
.codice-scheda ha-yaml-editor { display: block; margin: 8px 0; }
.codice-scheda textarea { width: 100%; box-sizing: border-box; margin: 8px 0;
  font-family: ui-monospace, Consolas, monospace; font-size: 12px; line-height: 1.45;
  border-radius: 8px; padding: 8px; resize: vertical;
  border: 1px solid var(--divider-color, #444);
  background: var(--card-background-color, #16202c); color: var(--primary-text-color, #eaf1fb); }
.codice-scheda .esito { font-size: 12px; color: #ff8a8a; }
.trovati { display: flex; flex-direction: column; gap: 2px; max-height: 260px; overflow: auto; }
.trovato { display: flex; align-items: center; gap: 10px; padding: 7px 8px; border-radius: 8px;
  cursor: pointer; }
.trovato:hover { background: rgba(127,127,127,.12); }
.trovato input { width: 18px; height: 18px; accent-color: var(--primary-color, #03a9f4);
  flex: 0 0 18px; }
/* il quadratino giallo con la freccina: si tiene premuto e il pezzo cresce */
.pista-maniglia {
  position: absolute; width: 28px; height: 28px; padding: 0; border: none;
  background: none; display: grid; place-items: center;
  cursor: nwse-resize; touch-action: none; z-index: 9;
}
.pista-maniglia .q {
  width: 15px; height: 15px; border-radius: 4px;
  background: #f0b429; border: 1px solid rgba(0,0,0,.45);
  box-shadow: 0 1px 4px rgba(0,0,0,.55);
  display: grid; place-items: center; pointer-events: none;
  transition: transform .12s ease;
}
.pista-maniglia svg { width: 11px; height: 11px; fill: #241a02; }
.pista-maniglia:hover .q { transform: scale(1.15); }
.pista-maniglia.inmano .q { transform: scale(1.3); }
.pista-maniglia[hidden] { display: none !important; }
.pista { position: relative; padding: 26px 14px 16px; border-radius: 12px; touch-action: none;
  background: var(--secondary-background-color, rgba(255,255,255,.04));
  display: flex; justify-content: center; }
.pista casa-tile { display: block; cursor: grab; }
.pista-tasti { display: flex; justify-content: flex-end; margin-top: 8px; }
.pista-chi { display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
  font-size: 12px; color: var(--secondary-text-color, #8ea0b8); margin: 2px 0 8px; }
.pista-chi .chi-nome { flex: 1 1 auto; }
.pista-nota { margin-top: 6px; font-size: 12px; font-family: monospace;
  color: var(--secondary-text-color, #9fb0c6); }
.tastoPiatto { border: 1px solid var(--divider-color, rgba(255,255,255,.14));
  background: none; color: var(--primary-text-color, #eaf1fb); cursor: pointer;
  font: inherit; font-size: 13px; padding: 7px 12px; border-radius: 9px; }
.tastoPiatto:hover { background: rgba(255,255,255,.08); }
.colori-blocco { display: flex; flex-direction: column; gap: 6px; margin: 2px 0 10px; }
.colori-blocco[hidden] { display: none; }
.riga-colore { display: flex; align-items: center; gap: 10px;
  padding: 8px 10px; border-radius: 10px;
  background: var(--secondary-background-color, rgba(255,255,255,.04)); }
.riga-colore .eti { flex: 1; min-width: 0; font-size: 13px;
  color: var(--primary-text-color, #eaf1fb); }
.riga-colore .bolla { flex: none; width: 34px; height: 34px; border-radius: 50%;
  cursor: pointer; padding: 0;
  border: 2px solid var(--divider-color, rgba(255,255,255,.18));
  background-image: linear-gradient(45deg, rgba(255,255,255,.12) 25%, transparent 25%,
    transparent 75%, rgba(255,255,255,.12) 75%), linear-gradient(45deg,
    rgba(255,255,255,.12) 25%, transparent 25%, transparent 75%, rgba(255,255,255,.12) 75%);
  background-size: 10px 10px; background-position: 0 0, 5px 5px; }
/* la ruota dei colori: e' tutta CSS, si apre di colpo */
.ruota-cassetto { display: flex; flex-direction: column; align-items: center; gap: 10px;
  padding: 12px 10px 14px; margin: -4px 0 10px; border-radius: 0 0 12px 12px;
  background: var(--secondary-background-color, rgba(255,255,255,.04)); }
.ruota-cassetto[hidden] { display: none; }
.ruota { position: relative; width: 168px; height: 168px; border-radius: 50%;
  cursor: crosshair; touch-action: none;
  background:
    radial-gradient(circle closest-side, #fff, rgba(255,255,255,0) 78%),
    conic-gradient(from 90deg, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00);
  box-shadow: inset 0 0 0 1px rgba(255,255,255,.14), 0 4px 14px rgba(0,0,0,.35); }
.ruota .mira { position: absolute; width: 16px; height: 16px; border-radius: 50%;
  transform: translate(-50%, -50%); pointer-events: none;
  border: 2px solid #fff; box-shadow: 0 0 0 1px rgba(0,0,0,.5), 0 2px 6px rgba(0,0,0,.5); }
.ruota-cassetto .luce { width: 168px; cursor: pointer; -webkit-appearance: none;
  appearance: none; height: 12px; border-radius: 99px; outline: none;
  background: linear-gradient(90deg, #000, #808080, #fff);
  box-shadow: inset 0 0 0 1px rgba(255,255,255,.14); }
.ruota-cassetto .luce::-webkit-slider-thumb { -webkit-appearance: none; width: 18px;
  height: 18px; border-radius: 50%; background: #fff; border: 2px solid #4b5c74;
  box-shadow: 0 1px 4px rgba(0,0,0,.5); cursor: pointer; }
.ruota-cassetto .luce::-moz-range-thumb { width: 16px; height: 16px; border-radius: 50%;
  background: #fff; border: 2px solid #4b5c74; cursor: pointer; }
.riga-colore .togli { flex: none; width: 28px; height: 28px; border-radius: 50%;
  border: none; cursor: pointer; font-size: 13px; line-height: 1;
  background: rgba(255,255,255,.08); color: var(--primary-text-color, #eaf1fb); }
.riga-colore .togli[hidden] { display: none; }
.riga-colore .togli:hover { background: rgba(255,255,255,.16); }
.vestito-riga { display: flex; align-items: center; gap: 8px; margin: 0 0 8px;
  padding: 6px 10px; border-radius: 10px;
  background: var(--secondary-background-color, rgba(255,255,255,.04)); }
.vestito-riga .eti { flex: 1; min-width: 0; font-size: 12px;
  color: var(--secondary-text-color, #9fb0c6);
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.vestito-riga input[type=color] { flex: none; width: 34px; height: 26px; padding: 0;
  border: 1px solid var(--divider-color, rgba(255,255,255,.14));
  border-radius: 7px; background: none; cursor: pointer; }
.vestito-riga input[type=range] { flex: none; width: 96px; cursor: pointer; }
.vestito-riga .quanto { flex: none; width: 38px; text-align: right; font-size: 11.5px;
  color: var(--secondary-text-color, #9fb0c6); font-variant-numeric: tabular-nums; }
.nomiMisure { display: flex; flex-direction: column; gap: 6px; }
.nomeMisura { display: flex; align-items: center; gap: 8px; }
.nomeMisura .chi { flex: 1; min-width: 0; font-size: 12.5px;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  color: var(--secondary-text-color, #9fb0c6); }
.nomeMisura .bolla { flex: none; width: 28px; height: 28px; border-radius: 50%;
  cursor: pointer; padding: 0;
  border: 2px solid var(--divider-color, rgba(255,255,255,.18)); }
.nomeMisura .togli { flex: none; width: 24px; height: 24px; border-radius: 50%;
  border: none; cursor: pointer; font-size: 12px; line-height: 1;
  background: rgba(255,255,255,.08); color: var(--primary-text-color, #eaf1fb); }
.nomeMisura .togli[hidden] { display: none; }
.nomiMisure .ruota-cassetto { margin: 0 0 8px; border-radius: 12px; }
.nomeMisura input { flex: none; width: 110px; font: inherit; font-size: 13px;
  padding: 6px 8px; border-radius: 8px; box-sizing: border-box;
  color: var(--primary-text-color, #eaf1fb);
  background: var(--secondary-background-color, rgba(255,255,255,.06));
  border: 1px solid var(--divider-color, rgba(255,255,255,.12)); }
.nomeMisura input:focus { outline: 2px solid var(--primary-color, #03a9f4);
  outline-offset: 1px; }
.trovato .nome { font-size: 13.5px; overflow: hidden; text-overflow: ellipsis;
  white-space: nowrap; }
.trovato .val { margin-left: auto; font-size: 12.5px; color: var(--secondary-text-color);
  white-space: nowrap; }
.foto-riga { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
.foto-anteprima { width: 64px; height: 44px; border-radius: 8px; object-fit: cover;
  border: 1px solid var(--divider-color, #555); }
.foto-nota { font-size: 12.5px; color: var(--secondary-text-color); margin-top: 8px; }
.foto-nota.errore { color: #ff8a80; }
.bt { appearance: none; border: none; cursor: pointer; font: inherit; font-weight: 600;
  font-size: 14px; padding: 10px 16px; border-radius: 10px;
  background: var(--primary-color, #03a9f4); color: var(--text-primary-color, #fff); }
.bt:hover { filter: brightness(1.1); }
.bt.chiaro { background: transparent; color: var(--primary-color, #03a9f4);
  border: 1px solid var(--divider-color, #555); }
.bt-icona { appearance: none; border: none; cursor: pointer; font-size: 15px;
  width: 32px; height: 32px; border-radius: 8px; line-height: 1;
  background: transparent; color: var(--secondary-text-color, #aaa); }
.bt-icona:hover { background: rgba(127,127,127,.18); color: var(--primary-text-color, #fff); }
.scelte h4 { margin: 16px 0 8px; font-size: 14px; }
.scelte .aiuto { margin: 0 0 8px; font-size: 12.5px; color: var(--secondary-text-color); }
.cercaIcona { width: 100%; box-sizing: border-box; margin: 0 0 8px; padding: 9px 12px;
  border-radius: 10px; font: inherit; font-size: 14px;
  border: 1px solid var(--divider-color, #444);
  background: var(--card-background-color, #16202c); color: var(--primary-text-color, #eaf1fb); }
.iconePicker { display: grid; gap: 5px; max-height: 300px; overflow-y: auto;
  padding-right: 4px; grid-template-columns: repeat(auto-fill, minmax(58px, 1fr)); }
.sceltaIcona { appearance: none; cursor: pointer; font: inherit; font-size: 9.5px;
  border: 1px solid var(--divider-color, #444); background: transparent;
  border-radius: 10px; padding: 6px 2px; display: flex; flex-direction: column;
  align-items: center; gap: 2px; color: var(--secondary-text-color, #9aa5b1);
  line-height: 1.1; }
.sceltaIcona svg { width: 27px; height: 27px; }
.sceltaAuto { border-style: dashed; }
.sceltaAuto .segnoAuto { font-size: 20px; line-height: 27px; height: 27px;
  display: block; }
.sceltaAuto .segnoAuto svg { width: 27px; height: 27px; }
.sceltaIcona .nome { overflow: hidden; text-overflow: ellipsis; max-width: 100%;
  white-space: nowrap; }
.sceltaIcona[hidden] { display: none !important; }
.sceltaIcona[scelta] { border-color: var(--primary-color, #03a9f4);
  background: rgba(3,169,244,.14); color: var(--primary-text-color, #fff); }
.coloriPicker { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
.sceltaColore { appearance: none; padding: 0; cursor: pointer; width: 32px; height: 32px;
  border-radius: 50%; border: 2px solid transparent; position: relative; }
.sceltaColore[scelta] { border-color: #fff;
  box-shadow: 0 0 0 3px var(--primary-color, #03a9f4); }
.coloreLampada { color: #fff; font-size: 15px; display: grid; place-items: center;
  text-shadow: 0 1px 3px rgba(0,0,0,.6); }
.coloreLampada[hidden] { display: none !important; }
.coloreTermo { background: linear-gradient(135deg, #4f8bff, #3fd98a, #ffcf5c, #ff5f5f); }
.coloreTermo[hidden] { display: none !important; }
.coloreLibero { overflow: hidden;
  background: conic-gradient(#ff5f5f, #ffc046, #3fd98a, #4fe0c8, #5ec8ff, #9b6bff, #ff5f5f); }
.scelte .ruota-cassetto { margin: 10px 0 2px; border-radius: 12px; }

/* ============== le impostazioni su schermo piccolo ============== */
@media (max-width: 620px) {
  .scheda { flex: 1 1 auto; justify-content: center; padding: 10px 10px; font-size: 13px; }
  .blocco { padding: 12px 10px; }
  .riga-scheda { flex-wrap: wrap; padding: 8px; }
  .riga-scheda .tipo { flex: 1 1 auto; min-width: 0; }
  .editor-scheda { padding: 10px 8px; }
  .codice-scheda textarea { font-size: 13px; }
  .foto-riga { gap: 6px; }
}

/* ============== col dito ci vuole piu' spazio ============== */
@media (pointer: coarse) {
  .scheda { padding: 12px 12px; }
  .bt { min-height: 44px; padding: 12px 18px; }
  .bt-icona { width: 40px; height: 40px; font-size: 17px; }
  .tendina { min-height: 44px; font-size: 15px; }
  .trovato { padding: 11px 8px; }
  .trovato input { width: 22px; height: 22px; flex: 0 0 22px; }
  .riga-scheda { padding: 10px; }
  .codice-scheda textarea { min-height: 220px; }
}
`;

class CasaTileEditor extends HTMLElement {
  setConfig(config) {
    this._config = { ...config };
    // dalla v2.3.8 le entita' che decidono l'accensione sono un elenco: se
    // trovo la vecchia forma a testo la converto, se no il campo a scelta
    // multipla non riesce a disegnarsi e sparisce dalle impostazioni
    if (typeof this._config.acceso_entita === "string") {
      this._config.acceso_entita = this._config.acceso_entita
        ? [this._config.acceso_entita] : [];
    }
    if (String(config.entity || "").indexOf("media_player.") === 0) {
      if (this._config.multiroom === undefined) this._config.multiroom = true;
      if (this._config.sorgente === undefined) this._config.sorgente = true;
    }
    this._planciaCercata = null;
    this._planciaSalvata = null;
    this._render();
  }
  set hass(hass) { this._hass = hass; this._propaga(); }
  set lovelace(lv) { this._lovelace = lv; this._propaga(); }

  _lov() { return this._lovelace || { config: { views: [] }, editMode: true }; }

  // Ripassare i valori ai moduli e agli editor di Home Assistant li fa
  // ridisegnare tutti. Con una casa che manda aggiornamenti in continuazione
  // (e nella scheda "Tocco" ci sono gli editor delle schede del pop-up, che
  // si portano dietro la loro anteprima) e' il conto piu' salato di tutti:
  // lo faccio al massimo una volta al secondo, e l'ultimo giro lo recupero.
  _propaga() {
    const ora = Date.now();
    const passato = ora - (this._quandoPropago || 0);
    // chi non ha ancora ricevuto niente non puo' aspettare: i selettori di
    // Home Assistant senza "hass" si rompono
    const digiuni = (this._forms || []).some((f) => !f._ebbeHass);
    if (!digiuni && passato < 1000) {
      if (!this._propagaDopo) {
        this._propagaDopo = setTimeout(() => {
          this._propagaDopo = 0;
          this._propagaDavvero();
        }, 1000 - passato);
      }
      return;
    }
    this._propagaDavvero();
  }

  _propagaDavvero() {
    const ora = Date.now();
    this._quandoPropago = ora;
    // Ai moduli e agli editor i valori servono per riempire gli elenchi
    // delle entita', non per stare aggiornati al secondo: glieli do la prima
    // volta e poi solo ogni dieci secondi. Gli editor delle schede del pop-up
    // (scheda "Tocco") si portano dietro un'anteprima viva, e ridisegnarla a
    // ogni stato che cambia in casa era tutto il rallentamento.
    const daDare = (el) => {
      if (!el._ebbeHass) return true;
      return ora - (el._quandoHass || 0) > 10000;
    };
    // se i valori non sono ancora arrivati non c'e' niente da dare
    if (!this._hass) return;
    const dai = (el) => {
      el._ebbeHass = true;
      el._quandoHass = ora;
      el.hass = this._hass;
    };
    (this._forms || []).forEach((f) => {
      // il modulo che sta usando adesso non si tocca: ogni assegnazione lo
      // fa ridisegnare, e col selettore del colore aperto e' un disastro
      if (f === this._formInUso) return;
      if (daDare(f)) dai(f);
    });
    const lov = this._lov();
    this.querySelectorAll("hui-card-picker, hui-card-element-editor").forEach((el) => {
      if (daDare(el)) dai(el);
      // il "lovelace" cambia quasi mai: riassegnarlo fa rifare l'editor
      if (el._lovDato !== lov) { el._lovDato = lov; el.lovelace = lov; }
    });
    if (this._edScheda && this._edScheda.isConnected && daDare(this._edScheda)) {
      dai(this._edScheda);
    }
  }

  _schede() {
    const c = this._config;
    if (Array.isArray(c.finestra_cards)) return c.finestra_cards;
    if (c.finestra_card) return [c.finestra_card];
    // configurazioni delle versioni precedenti: le converto in schede vere
    if (c.finestra_scheda || c.finestra_grafico) {
      const entita = (c.finestra_entita && c.finestra_entita.length)
        ? c.finestra_entita : (c.entity ? [c.entity] : []);
      let tipo = c.finestra_scheda || "entities";
      if (tipo === "altra") tipo = (c.finestra_scheda_altra || "entities").trim();
      const MULTI = ["entities", "glance", "history-graph", "statistics-graph",
                     "logbook", "map", "distribution"];
      const fuori = [];
      if (c.finestra_grafico) {
        fuori.push({ type: "history-graph", hours_to_show: 24, entities: entita });
      }
      if (MULTI.includes(tipo)) fuori.push({ type: tipo, entities: entita });
      else entita.forEach((e) => fuori.push({ type: tipo, entity: e }));
      return fuori;
    }
    return [];
  }

  _salvaSchede(lista, ricostruisci) {
    const c = { ...this._config, finestra_cards: lista };
    delete c.finestra_card;
    delete c.finestra_scheda;
    delete c.finestra_scheda_altra;
    delete c.finestra_grafico;
    delete c.finestra_entita;
    this._config = c;
    this._emetti();
    if (ricostruisci) this._costruisciBlocco(true);
  }

  _emetti() {
    this.dispatchEvent(new CustomEvent("config-changed", {
      detail: { config: this._config }, bubbles: true, composed: true,
    }));
  }

  _render() {
    if (!this._costruito) {
      const stile = document.createElement("style");
      stile.textContent = STILE_EDITOR + STILE_SELETTORE;
      this.appendChild(stile);

      this._foto = document.createElement("div");
      this._foto.className = "blocco";
      this._blocco = document.createElement("div");
      this._blocco.className = "blocco";
      this._sensori = document.createElement("div");
      this._sensori.className = "blocco";
      this._nomiMisure = document.createElement("div");
      this._nomiMisure.className = "blocco";
      this._postiBox = document.createElement("div");
      this._postiBox.className = "blocco";
      this._scelte = document.createElement("div");
      this._scelte.className = "scelte";
      this._tinte = document.createElement("div");
      this._tinte.className = "scelte";

      // la ricerca: con quasi sessanta impostazioni, trovarle e' il problema
      this._cerca = document.createElement("input");
      this._cerca.className = "cercaOpz";
      this._cerca.type = "search";
      this._cerca.placeholder = "Cerca un'impostazione: meteo, colore, km...";
      this._trovate = document.createElement("div");
      this._trovate.className = "trovate";
      this._trovate.hidden = true;
      this._cerca.addEventListener("input", () => this._cercaOpzioni());
      this.appendChild(this._cerca);
      this.appendChild(this._trovate);

      this._barra = document.createElement("div");
      this._barra.className = "schede";
      const targa = document.createElement("span");
      targa.className = "targhetta";
      targa.textContent = "v" + VERSIONE;
      targa.title = "Versione della card: se non e' quella che ti aspetti, "
        + "il browser sta ancora usando una copia vecchia (ricarica con Ctrl+F5)";
      this._targa = targa;
      this.appendChild(this._barra);

      this._forms = [];
      this._tasti = [];
      this._gruppi = [];
      this._pannelli = [];
      SEZIONI.forEach((sez, i) => {
        const bottone = document.createElement("button");
        bottone.className = "scheda";
        bottone.type = "button";
        bottone.innerHTML = "<span class='segno'></span><span class='testo'></span>";
        bottone.querySelector(".segno").textContent = sez.segno || "";
        bottone.querySelector(".testo").textContent = sez.titolo;
        if (i === 0) bottone.setAttribute("scelta", "");
        bottone.addEventListener("click", () => this._scegliScheda(i));
        this._barra.appendChild(bottone);
        this._tasti.push(bottone);

        const pannello = document.createElement("div");
        pannello.className = "pannello";
        if (i !== 0) pannello.setAttribute("nascosto", "");

        // ogni scheda e' fatta di gruppi: titoletto + campi
        const suoi = [];
        sez.gruppi.forEach((gruppo) => {
          let titolo = null;
          if (gruppo.titolo) {
            titolo = document.createElement("h4");
            titolo.className = "titoloGruppo";
            titolo.textContent = gruppo.titolo;
            pannello.appendChild(titolo);
          }
          const form = document.createElement("ha-form");
          // i valori GLIELI DO SUBITO: senza, i selettori di Home Assistant
          // provano a leggere l'elenco delle entita' da un "hass" che non
          // c'e' ancora e si schiantano in continuazione (era il fiume di
          // errori "ha-selector-entity ... reading entities" nel registro)
          form.hass = this._hass;
          form._ebbeHass = !!this._hass;
          form._quandoHass = Date.now();
          form.schema = this._schemaDi(gruppo);
          form._firma = this._firmaSchema(form.schema);
          form.computeLabel = (x) => ETICHETTE[x.name] || x.name;
          form.addEventListener("value-changed", (e) => {
            e.stopPropagation();
            this._formInUso = form;
            clearTimeout(this._scordaForm);
            this._scordaForm = setTimeout(() => { this._formInUso = null; }, 800);
            const prima = this._config.azione;
            // ATTENZIONE: i moduli di Home Assistant tengono in pancia una
            // copia di TUTTA la configurazione e quando muovi un interruttore
            // ti ridanno quella copia con dentro il campo cambiato. Ma la
            // copia gliela do io, e per non ridisegnare quindici moduli a
            // ogni ritocco la rinfresco solo a chi e' cambiato un campo suo.
            // Risultato: il modulo dei "Tasti rapidi" aveva ancora la
            // configurazione di prima, e accendendo i tasti rimetteva com'era
            // la barra - o viceversa. Da qui prendo SOLO i campi che sono
            // suoi, e il resto della configurazione non lo tocca nessuno.
            const suoi = this._nomiSchema(form.schema);
            const c2 = { ...this._config };
            suoi.forEach((nome) => {
              if (nome in e.detail.value) c2[nome] = e.detail.value[nome];
              else delete c2[nome];
            });
            this._config = c2;
            this._emetti();
            if (prima !== this._config.azione) {
              this._costruisciBlocco(true);
              this._aggiornaSchemi();
            }
            if (["sfondo", "aspetto", "musica", "persone"].includes(sez.chiave)) {
            this._costruisciFoto();
          }
            if (sez.chiave === "base") {
              this._costruisciTrovati();
              this._costruisciNomi();
              this._aggiornaSchemi();
            }
          });
          this._forms.push(form);
          pannello.appendChild(form);
          let boxColori = null;
          if (gruppo.colori && gruppo.colori.length) {
            boxColori = document.createElement("div");
            boxColori.className = "colori-blocco";
            pannello.appendChild(boxColori);
          }
          suoi.push({ gruppo: gruppo, form: form, titolo: titolo, colori: boxColori });

          // i riquadri fatti a mano vanno sotto al gruppo che li riguarda
          if (sez.chiave === "base" && gruppo.titolo === "Cosa c'e scritto") {
            pannello.appendChild(this._sensori);
            pannello.appendChild(this._nomiMisure);
          }
          if (sez.chiave === "icona") pannello.appendChild(this._scelte);
          if (sez.chiave === "aspetto" && gruppo.titolo === "Colore della scritta") {
            pannello.appendChild(this._tinte);
            pannello.appendChild(this._postiBox);
          }
          if (sez.chiave === "sfondo" && gruppo.titolo === "Foto di sfondo") {
            pannello.appendChild(this._foto);
          }
          if (sez.chiave === "tocco") pannello.appendChild(this._blocco);
        });
        this._gruppi.push(suoi);

        this._pannelli.push(pannello);
        this.appendChild(pannello);
      });
      this._barra.appendChild(this._targa);
      this._costruito = true;
    }
    // Il selettore del colore manda una modifica a ogni movimento del dito:
    // rifare tutto ogni volta impastava le impostazioni. Quindi rimando il
    // giro al prossimo disegno e ne faccio uno solo.
    // la primissima volta niente attese: deve comparire subito
    if (this._formaOra === undefined) { this._giroCompleto(); return; }
    // aspetto un attimo e ne faccio uno solo: il selettore del colore manda
    // una modifica a ogni movimento del dito. Uso un timer e non il disegno
    // del browser, che in una scheda nascosta non arriverebbe mai.
    clearTimeout(this._attesa);
    this._attesa = setTimeout(() => {
      if (!this._costruito || !this.isConnected) return;
      this._giroCompleto();
    }, 60);
  }

  _giroCompleto() {
    this._conservaPosto(() => {
      // gli schemi cambiano solo se cambia il TIPO di casella, non i valori
      const forma = (this._config.entity || "") + "|" + (this._config.azione || "")
        + "|" + ((this._config.acceso_entita || []).length ? "1" : "0");
      if (this._formaOra !== forma) {
        this._formaOra = forma;
        this._aggiornaSchemi();
      }
      // e agli altri do i valori solo se i LORO campi sono cambiati: se no
      // ridisegno quindici moduli a ogni movimento del dito sul colore
      this._forms.forEach((f) => {
        if (f === this._formInUso) return;
        const firma = this._firmaValori(f.schema);
        if (f._valori === firma) return;
        f._valori = firma;
        f.data = this._config;
      });
      this._costruisciColori();
      this._costruisciPosti();
      this._costruisciScelte();
      this._costruisciFoto();
      this._costruisciTrovati();
      this._costruisciNomi();
      this._costruisciBlocco();
    });
    requestAnimationFrame(() => this._adattaCatalogo());
  }

  // Home Assistant rifa' le impostazioni a ogni modifica: se in mezzo un
  // riquadro si accorcia, la pagina salta in cima e lui perde di vista
  // proprio l'impostazione che stava provando. Qui mi segno dov'era.
  _conservaPosto(azione) {
    const box = this._scorrevole();
    const dove = box ? box.scrollTop : 0;
    azione();
    if (!box || box.scrollTop === dove) return;
    box.scrollTop = dove;
    // e ancora dopo il disegno, che certe altezze arrivano tardi
    requestAnimationFrame(() => {
      if (box.isConnected && box.scrollTop !== dove) box.scrollTop = dove;
    });
  }

  // chi e' che scorre davvero: puo' essere un pezzo della finestra di
  // Home Assistant, anche dentro a un'ombra
  _scorrevole() {
    if (this._boxScorr && this._boxScorr.isConnected) return this._boxScorr;
    const su = (x) => (x.parentNode ? x.parentNode : (x.host || null));
    let n = su(this);
    let passi = 0;
    while (n && passi < 30) {
      passi += 1;
      if (n.nodeType === 1 && n.scrollHeight > n.clientHeight + 4) {
        const come = getComputedStyle(n).overflowY;
        if (come === "auto" || come === "scroll") { this._boxScorr = n; return n; }
      }
      n = su(n);
    }
    return null;
  }

  // icona e colore si scelgono guardandoli
  _costruisciScelte() {
    const box = this._scelte;
    const tin = this._tinte;
    if (!box) return;
    if (!box._fatto) {
      box._fatto = true;
      box.innerHTML = "<h4>Icona</h4>"
        + "<p class='aiuto notaMeteo' hidden>Per il meteo non serve sceglierla: "
        + "l'icona la decide il tempo che fa (sole, nuvole, pioggia, neve, "
        + "temporale, nebbia, vento) e cambia da sola.</p>"
        + "<input class='cercaIcona' type='search' placeholder='Cerca l&apos;icona: luce, presa, porta, auto...'>"
        + "<div class='iconePicker'></div>";

      const griglia = box.querySelector(".iconePicker");
      // del meteo ne basta una: tanto poi la sceglie il tempo che fa
      const METEOICONE = ["luna", "nuvola", "sole_nuvole", "pioggia", "neve",
                          "temporale", "nebbia", "vento"];
      const elenco = ["auto"]
        .concat(NOMI_ICONE.filter((x) => METEOICONE.indexOf(x) < 0))
        .concat(NOMI_MDI);
      elenco.forEach((nome, k) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "sceltaIcona";
        b.dataset.nome = nome;
        if (nome === "auto") {
          b.classList.add("sceltaAuto");
          b.innerHTML = '<span class="segnoAuto">\u2726</span>'
            + '<span class="nome">Automatica</span>';
          b.title = "La sceglie la card guardando l'entita";
          b.addEventListener("click", () => {
            this._config = { ...this._config, icona: "auto" };
            this._emetti();
            this._costruisciScelte();
          });
          griglia.appendChild(b);
          return;
        }
        // gli id dentro l'SVG vanno resi unici, altrimenti si pestano i piedi
        const tintaEditor = (COLORI[(this._config || {}).colore] || COLORI.ambra);
        const dentro = String(ICONE[nome] || disegnoMdi(nome, tintaEditor) || "")
          .replace(/id="([a-z0-9]+)"/g, 'id="$1_p' + k + '"')
          .replace(/url\(#([a-z0-9]+)\)/g, "url(#$1_p" + k + ")");
        b.innerHTML = '<svg viewBox="0 0 64 64" fill="none">' + dentro
          + '</svg><span class="nome"></span>';
        b.querySelector(".nome").textContent = nome;
        b.addEventListener("click", () => {
          this._config = { ...this._config, icona: nome };
          this._emetti();
          this._costruisciScelte();
        });
        griglia.appendChild(b);
      });

      tin.innerHTML = "<h4>Colore quando e accesa</h4>"
        + "<p class='aiuto'>Tocca la ruota per scegliere il colore che vuoi: "
        + "e' quello dell'alone, del bordo e di tutti gli effetti.</p>"
        + "<div class='coloriPicker'></div>";
      const fila = tin.querySelector(".coloriPicker");
      // niente piu' pallini fissi: bastano la ruota e "come la lampada"
      [].forEach((nome) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "sceltaColore";
        b.dataset.nome = nome;
        b.title = nome;
        b.style.background = COLORI[nome];
        b.addEventListener("click", () => {
          this._config = { ...this._config, colore: nome };
          delete this._config.colore_rgb;
          this._emetti();
          this._costruisciScelte();
        });
        fila.appendChild(b);
      });
      const lampada = document.createElement("button");
      lampada.type = "button";
      lampada.className = "sceltaColore coloreLampada";
      lampada.dataset.nome = "luce";
      lampada.title = "Come la lampada (colore vero della luce)";
      lampada.innerHTML = '<span class="segno">\u25C9</span>';
      lampada.addEventListener("click", () => {
        this._config = { ...this._config, colore: "luce" };
        delete this._config.colore_rgb;
        this._emetti();
        this._costruisciScelte();
      });
      fila.appendChild(lampada);
      tin._lampada = lampada;

      const termo = document.createElement("button");
      termo.type = "button";
      termo.className = "sceltaColore coloreTermo";
      termo.dataset.nome = "termometro";
      termo.title = "Segue la temperatura (freddo azzurro, caldo rosso)";
      termo.addEventListener("click", () => {
        this._config = { ...this._config, colore: "termometro" };
        delete this._config.colore_rgb;
        this._emetti();
        this._costruisciScelte();
      });
      fila.appendChild(termo);
      tin._termo = termo;

      const libero = document.createElement("button");
      libero.type = "button";
      libero.className = "sceltaColore coloreLibero";
      libero.dataset.nome = "personalizzato";
      libero.title = "Un colore qualsiasi";
      // niente finestra dei colori del computer: la ruota, che si apre subito
      const scelta = this._sceltaColore(this._config.colore_rgb, (rgb) => {
        this._config = { ...this._config, colore: "personalizzato", colore_rgb: rgb };
        this._emetti();
      });
      libero.addEventListener("click", scelta.apriChiudi);
      fila.appendChild(libero);
      fila.after(scelta.cassetto);
      tin._libero = libero;
      tin._scelta = scelta;

      // un'icona tutta sua, presa dal telefono o dal PC
      const suaRiga = document.createElement("div");
      suaRiga.className = "foto-riga suaIcona";
      const scegliIco = document.createElement("button");
      scegliIco.className = "bt chiaro";
      scegliIco.type = "button";
      scegliIco.textContent = "Usa un'immagine mia (telefono o PC)";
      const fileIco = document.createElement("input");
      fileIco.type = "file";
      fileIco.accept = "image/*";
      fileIco.style.display = "none";
      scegliIco.addEventListener("click", () => fileIco.click());
      fileIco.addEventListener("change", () => {
        if (fileIco.files && fileIco.files[0]) this._caricaIcona(fileIco.files[0]);
      });
      const viaIco = document.createElement("button");
      viaIco.className = "bt chiaro";
      viaIco.type = "button";
      viaIco.textContent = "Togli l'immagine";
      viaIco.addEventListener("click", () => {
        const c2 = { ...this._config };
        delete c2.icona_immagine;
        this._config = c2;
        this._emetti();
        this._costruisciScelte();
      });
      const antIco = document.createElement("img");
      antIco.className = "foto-anteprima";
      const notaIco = document.createElement("div");
      notaIco.className = "foto-nota";
      suaRiga.append(antIco, scegliIco, fileIco, viaIco, notaIco);
      box.appendChild(suaRiga);
      box._suaIcona = { riga: suaRiga, ant: antIco, via: viaIco, nota: notaIco };

      const cerca = box.querySelector(".cercaIcona");
      cerca.addEventListener("input", () => {
        const q = cerca.value.trim().toLowerCase();
        box.querySelectorAll(".sceltaIcona").forEach((b) => {
          const nome = b.dataset.nome || "";
          const parole = (SINONIMI[nome] || MDI_PAROLE[nome] || "") + " " + nome;
          b.hidden = !!q && nome !== "auto"
            && parole.toLowerCase().replace(/_/g, " ").indexOf(q) < 0;
        });
      });
    }

    const c = this._config || {};
    // sul meteo l'icona e' automatica: la griglia delle icone non serve
    const suoDominio = String(c.entity || "").split(".")[0];
    const nota = box.querySelector(".notaMeteo");
    const griglia = box.querySelector(".iconePicker");
    if (nota && griglia) {
      nota.hidden = suoDominio !== "weather";
      griglia.hidden = suoDominio === "weather";
    }
    if (tin && tin._termo) {
      const dom = String(c.entity || "").split(".")[0];
      const st2 = this._hass ? this._hass.states[c.entity] : null;
      const daTemperatura = dom === "climate" || dom === "weather"
        || (!!st2 && st2.attributes.device_class === "temperature");
      tin._termo.hidden = !daTemperatura;
    }
    if (tin && tin._lampada) {
      const dom = String(c.entity || "").split(".")[0];
      const st = this._hass ? this._hass.states[c.entity] : null;
      const modi = st ? (st.attributes.supported_color_modes || []) : [];
      const aColori = dom === "light" && modi.some((m) =>
        ["rgb", "rgbw", "rgbww", "hs", "xy", "color_temp"].includes(m));
      tin._lampada.hidden = !aColori;
      const rgb = st && st.attributes.rgb_color;
      tin._lampada.style.background = Array.isArray(rgb)
        ? daRgb(coloreLampada(rgb))
        : "linear-gradient(135deg, #ff5f5f, #ffc046, #5ec8ff)";
    }
    if (box._suaIcona) {
      const mia = c.icona_immagine;
      box._suaIcona.ant.hidden = !mia;
      box._suaIcona.via.hidden = !mia;
      if (mia && box._suaIcona.ant.getAttribute("src") !== mia) {
        box._suaIcona.ant.src = mia;
      }
    }
    const sceltaIcona = c.icona || "auto";
    box.querySelectorAll(".sceltaIcona").forEach((b) =>
      b.toggleAttribute("scelta", b.dataset.nome === sceltaIcona));
    // sul tasto "Automatica" mostro quale verrebbe scelta adesso
    const tastoAuto = box.querySelector(".sceltaAuto .segnoAuto");
    if (tastoAuto && c.entity && this._hass) {
      const quale = iconaAutomatica(c.entity, this._hass.states[c.entity]);
      const tintaAuto = COLORI[c.colore] || COLORI.ambra;
      tastoAuto.innerHTML = '<svg viewBox="0 0 64 64" fill="none">'
        + String(ICONE[quale] || disegnoMdi(quale, tintaAuto) || ICONE.luce)
          .replace(/id="([a-z0-9]+)"/g, 'id="$1_auto"')
          .replace(/url\(#([a-z0-9]+)\)/g, "url(#$1_auto)")
        + "</svg>";
    }
    if (tin) {
      tin.querySelectorAll(".sceltaColore").forEach((b) =>
        b.toggleAttribute("scelta", b.dataset.nome === (c.colore || "ambra")));
    }
    if (Array.isArray(c.colore_rgb) && tin && tin._libero) {
      const tinta = daRgb(c.colore_rgb);
      if (tinta) {
        tin._libero.style.background = tinta;
        if (tin._scelta && tin._scelta.aggiorna) tin._scelta.aggiorna(c.colore_rgb);
      }
    } else if (tin && tin._libero) {
      tin._libero.style.background =
        "conic-gradient(#ff5f5f, #ffc046, #3fd98a, #4fe0c8, #5ec8ff, #9b6bff, #ff5f5f)";
    }
  }

  _trovaSensori() {
    const c = this._config;
    if (!this._hass || !c.entity) return [];
    const st = this._hass.states[c.entity];
    if (!st) return [];
    const registro = this._hass.entities || {};
    const dispositivi = new Set();
    (st.attributes.device_trackers || []).concat([c.entity]).forEach((eid) => {
      const voce = registro[eid];
      if (voce && voce.device_id) dispositivi.add(voce.device_id);
    });

    let trovati = [];
    if (dispositivi.size) {
      trovati = Object.keys(registro).filter((eid) => {
        const voce = registro[eid];
        return voce && dispositivi.has(voce.device_id)
          && (eid.startsWith("sensor.") || eid.startsWith("binary_sensor."));
      });
    }
    if (!trovati.length) {
      const radice = c.entity.split(".")[1];
      trovati = Object.keys(this._hass.states).filter(
        (eid) => eid.startsWith("sensor." + radice + "_")
          || eid.startsWith("binary_sensor." + radice + "_"));
    }
    return trovati.filter((eid) => {
      const x = this._hass.states[eid];
      return x && x.state !== "unavailable" && x.state !== "unknown";
    }).sort();
  }

  // dai un nome tuo a ogni misura: "Scarica", "Uscita casa"... senza questo
  // due sensori di watt sono due caselline uguali con dentro numeri diversi
  // I selettori di colore di Home Assistant sono pesantissimi: aprirli
  // fermava tutta la pagina. Qui basta il colore del sistema, che si apre
  // di colpo, piu' una X per toglierlo.
  _costruisciColori() {
    (this._gruppi || []).forEach((suoi) => {
      suoi.forEach((g) => {
        if (!g.colori) return;
        const campi = g.gruppo.colori;
        // la firma NON guarda i colori scelti: se no la ruota si richiude
        // in faccia ogni volta che ne tocchi uno
        const firma = campi.join(",");
        if (g.colori._firma === firma) {
          g.colori.hidden = g.form.hidden && !campi.length;
          g.colori.childNodes.forEach((n2) => { if (n2._aggiorna) n2._aggiorna(); });
          return;
        }
        g.colori._firma = firma;
        g.colori.innerHTML = "";
        campi.forEach((campo) => g.colori.appendChild(this._rigaColore(campo)));
      });
    });
  }

  // La ruota dei colori: la uso sia per le tinte della casella sia per le
  // schede del pop-up. Restituisce la pastiglia da toccare, il cassetto che
  // si apre, e un modo per rimetterla in pari.
  _sceltaColore(iniziale, quandoCambia) {
    const bolla = document.createElement("button");
    bolla.type = "button";
    bolla.className = "bolla";
    bolla.title = "Scegli il colore";

    const cassetto = document.createElement("div");
    cassetto.className = "ruota-cassetto";
    cassetto.hidden = true;
    const ruota = document.createElement("div");
    ruota.className = "ruota";
    const mira = document.createElement("i");
    mira.className = "mira";
    ruota.appendChild(mira);
    const luce = document.createElement("input");
    luce.type = "range";
    luce.className = "luce";
    luce.min = "0"; luce.max = "100"; luce.step = "1";

    let H = 210; let S2 = 60;
    const metti = (rgb) => {
      if (Array.isArray(rgb)) {
        const [h2, s3, l2] = rgbAHsl(rgb[0], rgb[1], rgb[2]);
        H = h2; S2 = s3; luce.value = String(Math.round(l2));
        bolla.style.background = daRgb(rgb);
      } else {
        luce.value = "50";
        bolla.style.background = "transparent";
      }
    };
    metti(iniziale);

    const mettiMira = () => {
      const r = (S2 / 100) * 46;
      const a2 = H * Math.PI / 180;
      mira.style.left = (50 + Math.cos(a2) * r) + "%";
      mira.style.top = (50 + Math.sin(a2) * r) + "%";
      mira.style.background = hslATesto(H, S2, Number(luce.value));
    };
    const mostra = () => {
      bolla.style.background = hslATesto(H, S2, Number(luce.value));
      mettiMira();
    };
    const manda = () => quandoCambia(hslARgb(H, S2, Number(luce.value)));

    const prendi = (e) => {
      const q = ruota.getBoundingClientRect();
      if (!q.width || !q.height) return;
      const dx = (e.clientX - q.left) / q.width * 2 - 1;
      const dy = (e.clientY - q.top) / q.height * 2 - 1;
      const r = Math.min(1, Math.sqrt(dx * dx + dy * dy));
      const h2 = (Math.atan2(dy, dx) * 180 / Math.PI + 360) % 360;
      if (!isFinite(h2) || !isFinite(r)) return;
      H = h2;
      S2 = Math.round(r * 100);
      mostra();
    };
    ruota.addEventListener("pointerdown", (e) => {
      ruota.setPointerCapture(e.pointerId);
      ruota._giu = true;
      prendi(e);
    });
    ruota.addEventListener("pointermove", (e) => { if (ruota._giu) prendi(e); });
    ["pointerup", "pointercancel"].forEach((ev) =>
      ruota.addEventListener(ev, () => { ruota._giu = false; manda(); }));
    luce.addEventListener("input", mostra);
    luce.addEventListener("change", manda);
    const apriChiudi = () => {
      cassetto.hidden = !cassetto.hidden;
      if (!cassetto.hidden) mettiMira();
    };
    bolla.addEventListener("click", apriChiudi);

    cassetto.append(ruota, luce);
    return {
      bolla: bolla, cassetto: cassetto, aggiorna: metti,
      apriChiudi: apriChiudi, aperto: () => !cassetto.hidden,
    };
  }

  _rigaColore(campo) {
    const riga = document.createElement("div");
    riga.className = "riga-colore";
    const eti = document.createElement("span");
    eti.className = "eti";
    eti.textContent = ETICHETTE[campo] || campo;

    const via = document.createElement("button");
    via.type = "button";
    via.className = "togli";
    via.textContent = "✕";
    via.title = "Togli il colore";
    via.hidden = !Array.isArray(this._config[campo]);
    via.addEventListener("click", () => {
      const c2 = { ...this._config };
      delete c2[campo];
      this._config = c2;
      this._emetti();
      this._costruisciColori();
    });

    const scelta = this._sceltaColore(this._config[campo], (rgb) => {
      this._config = { ...this._config, [campo]: rgb };
      via.hidden = false;
      this._emetti();
    });

    riga.append(eti, scelta.bolla, via);
    const fuori = document.createElement("div");
    fuori.className = "colore-riga-fuori";
    fuori.append(riga, scelta.cassetto);
    fuori._aggiorna = () => {
      const ora = this._config[campo];
      scelta.aggiorna(ora);
      via.hidden = !Array.isArray(ora);
    };
    return fuori;
  }



  // Il riquadro dove si trascinano i pezzi: dentro c'e' una casella vera,
  // in piccolo, della stessa forma dell'anteprima.
  _costruisciPosti() {
    const box = this._postiBox;
    if (!box) return;
    // dentro all'editor di una scheda del pop-up il riquadro non ci va, e
    // non ci va nemmeno un avviso al suo posto: niente roba morta
    if (this._perIlPopup()) {
      if (box.innerHTML) box.innerHTML = "";
      box.hidden = true;
      return;
    }
    if (!box._fatto) {
      box._fatto = true;
      box.innerHTML = "<h4>Dove va ogni pezzo</h4>"
        + "<p class='aiuto'>Prendi il nome, il valore, l'icona o una misura e "
        + "trascinali dove vuoi dentro alla casella qui sotto. Tocca un pezzo "
        + "e sul suo angolo compare un quadratino giallo: tienilo premuto e "
        + "trascina per ingrandirlo o rimpicciolirlo.</p>";
      const pista = document.createElement("div");
      pista.className = "pista";
      const carta = document.createElement("casa-tile");
      carta.setAttribute("solo-casella", "");
      carta.setAttribute("trascinabile", "");
      pista.appendChild(carta);
      box.appendChild(pista);
      const sotto = document.createElement("div");
      sotto.className = "pista-tasti";
      const rimetti = document.createElement("button");
      rimetti.type = "button";
      rimetti.className = "tastoPiatto";
      rimetti.textContent = "Rimetti tutto a posto";
      // Il tasto butta via tutta la disposizione: una manata per sbaglio
      // gli faceva perdere il lavoro senza modo di tornare indietro. Ora la
      // disposizione la metto da parte e compare il tasto per riprenderla.
      const annulla = document.createElement("button");
      annulla.type = "button";
      annulla.className = "tastoPiatto";
      annulla.textContent = "Rimetti come prima";
      annulla.hidden = true;
      rimetti.addEventListener("click", () => {
        // e dimentico anche la misura piu' stretta che mi ero segnato: se
        // rifa la disposizione da capo, deve poterla rifare su quella di adesso
        const c0 = this._cfgPista() || {};
        const base = "casa-tile:misura3:" + (c0.entity || "") + "|" + (c0.name || "");
        try {
          localStorage.removeItem(base);
          localStorage.removeItem(base + "|pop");
        } catch (e) { /* pazienza */ }
        const ora = this._cfgPista().posti;
        if (ora && Object.keys(ora).length) box._salvati = ora;
        this._scriviPosti(null);
        this._aggiornaPista();
        annulla.hidden = !box._salvati;
        this._dico("disposizione tolta - puoi riprenderla col tasto qui di fianco");
      });
      annulla.addEventListener("click", () => {
        if (!box._salvati) return;
        this._scriviPosti(box._salvati);
        box._salvati = null;
        annulla.hidden = true;
        this._aggiornaPista();
        this._dico("disposizione ripresa");
      });
      sotto.appendChild(rimetti);
      sotto.appendChild(annulla);
      box.appendChild(sotto);
      const nota = document.createElement("div");
      nota.className = "pista-nota";
      nota.textContent = "pronto: tocca un pezzo qui sopra";
      box.appendChild(nota);
      box._nota = nota;
      box._carta = carta;
      // chi sto sistemando: la casella stessa o una scheda del suo pop-up
      const chi = document.createElement("div");
      chi.className = "pista-chi";
      box.insertBefore(chi, pista);
      box._chi = chi;
      this._pistaTrascina(carta);
    }
    this._aggiornaPista();
  }

  _aggiornaPista() {
    const box = this._postiBox;
    if (!box || !box._carta || !this._hass) return;
    try {
      box._carta.setConfig({ ...this._cfgPista() });
      box._carta.hass = this._hass;
    } catch (e) { /* una configurazione a meta' non deve rompere niente */ }
    this._diciChi();
    this._formaPista();
    if (!box._guarda && window.ResizeObserver) {
      const vera0 = this._cartaVera();
      if (vera0) {
        box._guarda = new ResizeObserver(() => this._formaPista());
        box._guarda.observe(vera0);
      }
    }
    clearTimeout(this._ricontrolla);
    this._ricontrolla = setTimeout(() => this._formaPista(), 350);
    clearTimeout(this._ricontrolla2);
    this._ricontrolla2 = setTimeout(() => this._formaPista(), 1200);
    clearTimeout(this._rimedio);
    this._rimedio = setTimeout(() => this._rimediaVecchi(box._carta), 500);
  }




  // Sto sistemando una casella che vive dentro a un pop-up? Lo capisco dal
  // fatto che sopra di me c'e' un altro editor casa-tile: quello della
  // casella che il pop-up ce l'ha.
  _perIlPopup() {
    let n = this;
    for (let i = 0; i < 40; i += 1) {
      n = n.parentNode || n.host;
      if (!n) return false;
      if (n.localName === "casa-tile-editor") return true;
      const cl = (n.classList && n.classList.contains) ? n.classList : null;
      if (cl && (cl.contains("f-corpo") || cl.contains("popup-anteprima"))) return true;
    }
    return false;
  }

  // la casellina del riquadro prende la misura esatta dell'anteprima
  _formaPista() {
    const box = this._postiBox;
    if (!box || !box._carta) return;
    let largo = 0;
    let alto = 0;
    // 1) la misura che la card si e' segnata quando stava sulla plancia
    //    FUORI dalla modifica: e' quella vera, quella che vedra' lui.
    // 0) se sta sistemando una scheda del pop-up: la misura che ha li'
    let daRicordo = false;
    const scelta = this._sceltaPercorso && this._sceltaPercorso.length
      ? this._misuraScelta : null;
    if (scelta && scelta.w > 90 && scelta.h > 40) {
      largo = scelta.w;
      alto = scelta.h;
      daRicordo = true;
    }
    const c0 = this._cfgPista() || {};
    if (!largo && (c0.entity || c0.name)) {
      // se sto sistemando una casella del pop-up, la misura buona e' quella
      // che ha DENTRO al pop-up, non quella di una casella sulla plancia
      const base = "casa-tile:misura3:" + (c0.entity || "") + "|" + (c0.name || "");
      const dentroPop = this._perIlPopup()
        || !!(this._sceltaPercorso && this._sceltaPercorso.length);
      const chiavi = dentroPop ? [base + "|pop", base] : [base, base + "|pop"];
      for (let i = 0; i < chiavi.length && !daRicordo; i += 1) {
        try {
          const pezzi = String(localStorage.getItem(chiavi[i]) || "").split("x");
          const w = Number(pezzi[0]);
          const h = Number(pezzi[1]);
          // sotto ai 90px non e' una casella su cui si possa comporre
          // qualcosa: meglio l'anteprima che un francobollo
          if (w > 90 && h > 40) {
            largo = w; alto = h; daRicordo = true;
            this._ricordoDalPopup = chiavi[i].indexOf("|pop") > 0;
          }
        } catch (e) { /* pazienza */ }
      }
    }
    // 2) se non se l'e' segnata, la card com'e' adesso sulla plancia
    const plancia = largo ? null : this._cartaPlancia();
    if (plancia) {
      const q = plancia.getBoundingClientRect();
      if (q.width > 90 && q.height > 40) { largo = q.width; alto = q.height; }
    }
    // 3) se non e' su nessuna plancia (card appena creata), l'anteprima
    const vera = largo ? null : this._cartaVera();
    if (vera) {
      // ATTENZIONE: misuro la CASELLA, non tutto l'elemento: sotto alla
      // casella l'anteprima si porta dietro il riquadro del pop-up, che e'
      // piu' grande, e cosi' la casellina veniva larga il doppio
      const suaCard = vera.shadowRoot && vera.shadowRoot.querySelector("ha-card");
      const q = (suaCard || vera).getBoundingClientRect();
      if (q.width > 40 && q.height > 20) { largo = q.width; alto = q.height; }
    }
    if (!largo) {
      const g = this._config.grid_options || {};
      const col = Number(g.columns) > 0 ? Number(g.columns) : 4;
      const rig = Number(g.rows) > 0 ? Number(g.rows) : 2;
      largo = Math.round(col / 12 * 500);
      alto = rig * 56 + (rig - 1) * 8;
    }
    // Un filo piu' piccola dell'anteprima, ma SEMPRE in proporzione: se
    // stringessi solo la larghezza cambierebbe forma e i pezzi finirebbero
    // in un punto qui e in un altro sulla plancia.
    // ESATTAMENTE la misura dell'anteprima: bastano pochi pixel di
    // differenza e le misure vanno a capo in un modo qui e in un altro la',
    // quindi le due caselle sembrano diverse.
    const posto = Math.max(190, (box.clientWidth || 420) - 28);
    let stretta = false;
    if (largo > posto) {
      alto = alto * posto / largo;
      largo = posto;
      stretta = true;
    }
    box._carta.style.width = Math.round(largo) + "px";
    box._carta.style.height = Math.round(alto) + "px";
    // scritto nero su bianco da dove ho preso la misura: se il riquadro non
    // combacia con la plancia, si vede subito da qui il perche'
    if (box._nota && !box._nota._occupata) {
      box._nota.textContent = "riquadro " + Math.round(largo) + "x"
        + Math.round(alto) + (stretta ? " (rimpicciolita per starci)" : "")
        + " - " + (daRicordo
          ? (this._ricordoDalPopup
            ? "misura vera della casella dentro al pop-up"
            : "misura vera della card sulla plancia")
          : (plancia ? "misura della card mentre la plancia e' in modifica"
            : (vera ? "misura dell'anteprima: la card non l'ho trovata sulla plancia"
              : "misura calcolata dalle colonne del Layout")));
    }
  }

  // La casella vera dell'anteprima. Attenzione: DENTRO la finestra delle
  // impostazioni e basta. Dietro alla finestra c'e' la plancia con tutte le
  // altre caselle, e cercando in tutta la pagina finivo per misurare una di
  // quelle, che e' larga tutt'altro.
  // la finestra delle impostazioni che mi contiene (e la cima, se non c'e')
  _finestraMia() {
    let cima = this;
    let dialogo = null;
    for (let i = 0; i < 60; i += 1) {
      const p = cima.parentNode || cima.host;
      if (!p) break;
      cima = p;
      const nome = String(cima.localName || "");
      if (nome.indexOf("dialog") >= 0 || nome === "hui-dialog-edit-card") {
        dialogo = cima;
        break;
      }
    }
    return { dialogo: dialogo, cima: cima };
  }

  // La stessa casella FUORI dalla finestra: e' quella vera sulla plancia,
  // con la misura che le da' il "Layout" di Home Assistant (colonne e
  // righe). E' quella che deve fare da modello al riquadro, se no lui
  // compone su una forma e poi sulla plancia ne trova un'altra.
  _cartaPlancia() {
    if (this._planciaSalvata && this._planciaSalvata.isConnected) {
      return this._planciaSalvata;
    }
    // Girare tutta la pagina costa: lo faccio UNA volta per ogni casella
    // che sto sistemando. Prima, quando non la trovavo (e' il caso delle
    // caselle che vivono solo dentro ai pop-up), rifacevo il giro a ogni
    // ricontrollo e la finestra delle impostazioni si trascinava.
    const chi = (this._config || {}).entity + "|" + (this._config || {}).name;
    if (this._planciaCercata === chi) return null;
    this._planciaCercata = chi;
    // una scheda che vive dentro al pop-up sulla plancia non c'e': il giro
    // di tutta la pagina sarebbe fatica buttata via
    if (this._perIlPopup()) return null;
    const { dialogo, cima } = this._finestraMia();
    const mia = this._config || {};
    if (!mia.entity && !mia.name) return null;
    // la plancia e' grande: di nodi da girare ce ne vogliono tanti
    let restano = 120000;
    let precisa = null;
    // dentro a un pop-up? allora non e' lei la card sulla plancia
    const dentroUnaltra = (el) => {
      let n = el;
      for (let i = 0; i < 14; i += 1) {
        n = n.parentNode || n.host;
        if (!n) return false;
        if (n.localName === "casa-tile") return true;
      }
      return false;
    };
    const cerca = (n) => {
      if (!n || restano <= 0 || precisa) return;
      if (n === dialogo) return;   // dentro alla finestra non guardo
      restano -= 1;
      if (n.nodeType === 1) {
        if (n.localName === "casa-tile" && !n.hasAttribute("solo-casella")) {
          const suo = n._config || {};
          // nome E entita' uguali: la sola entita' non basta, gli stessi
          // comandi rapidi (0W, 95W, 110W...) la condividono e sono grandi
          // come un francobollo
          if (suo.entity === mia.entity
              && String(suo.name || "") === String(mia.name || "")
              && n.getBoundingClientRect().width > 40
              && !dentroUnaltra(n)) {
            precisa = n;
            return;
          }
        }
        if (n.shadowRoot) cerca(n.shadowRoot);
      }
      const figli = n.children || [];
      for (let i = 0; i < figli.length && !precisa; i += 1) cerca(figli[i]);
    };
    try { cerca(document.body || cima); } catch (e) { /* pazienza */ }
    this._planciaSalvata = precisa;
    this._nodiGirati = 120000 - restano;
    return this._planciaSalvata;
  }

  _cartaVera() {
    if (this._veraSalvata && this._veraSalvata.isConnected) return this._veraSalvata;
    const { dialogo, cima } = this._finestraMia();
    const partenza = dialogo || cima;
    const mia = JSON.stringify(this._config || {});
    let restano = 8000;
    const trovate = [];
    const cerca = (n) => {
      if (!n || restano <= 0) return;
      restano -= 1;
      if (n.nodeType === 1) {
        if (n.localName === "casa-tile" && !n.hasAttribute("solo-casella")) {
          trovate.push(n);
        }
        if (n.shadowRoot) cerca(n.shadowRoot);
      }
      const figli = n.children || [];
      for (let i = 0; i < figli.length; i += 1) cerca(figli[i]);
    };
    try { cerca(partenza); } catch (e) { /* pazienza */ }
    // fra quelle trovate scelgo quella che ha la MIA configurazione
    let vera = trovate.find((c) => {
      try { return JSON.stringify(c._config || {}) === mia; } catch (e) { return false; }
    });
    if (!vera) {
      vera = trovate.find((c) => c._config
        && c._config.entity === (this._config || {}).entity);
    }
    if (!vera && dialogo) vera = trovate[0] || null;
    this._veraSalvata = vera || null;
    return this._veraSalvata;
  }



  // il trascinamento vero e proprio
  // Passando a mano libera ogni pezzo prende la sua misura naturale, che
  // puo' essere piu' larga di quando stavano in fila (in fila si stringono
  // a vicenda). Cosi' due misure possono finire una sull'altra. Questa
  // passata le distanzia, e la faccio UNA volta sola: quando trascina lui
  // il pezzo resta esattamente dove l'ha lasciato.
  _sbrogliaPosti(posti) {
    const fuori = { ...posti };
    const chiavi = Object.keys(fuori).filter((k) => k !== "misure"
      && k !== "_base" && fuori[k]
      && isFinite(fuori[k].x) && isFinite(fuori[k].w) && isFinite(fuori[k].h));
    chiavi.sort((a, b) => (fuori[a].y - fuori[b].y) || (fuori[a].x - fuori[b].x));
    const tocca = (a, b) => a.x < b.x + b.w - 0.6 && a.x + a.w > b.x + 0.6
      && a.y < b.y + b.h - 0.6 && a.y + a.h > b.y + 0.6;
    const messi = [];
    chiavi.forEach((k) => {
      const p = { ...fuori[k] };
      for (let giro = 0; giro < 20; giro += 1) {
        const sotto = messi.find((m) => tocca(p, m));
        if (!sotto) break;
        p.y = Math.round((sotto.y + sotto.h + 1.2) * 10) / 10;
        if (p.y + p.h > 100) { p.y = Math.max(0, Math.round((100 - p.h) * 10) / 10); break; }
      }
      p.dx = Math.round((100 - p.x - p.w) * 10) / 10;
      fuori[k] = p;
      messi.push(p);
    });
    return fuori;
  }

  // le disposizioni salvate prima della 2.4.18 si portavano dietro le
  // larghezze in percentuale: adesso che ogni pezzo prende la sua misura
  // vera si sovrappongono. Le rimetto in ordine una volta sola.
  _rimediaVecchi(carta) {
    if (this._giaSbrogliato) return;
    const posti = this._cfgPista().posti;
    if (!posti || !Object.keys(posti).length) return;
    const daRifare = Object.keys(posti).some((k) => k !== "misure"
      && k !== "_base" && posti[k] && !isFinite(posti[k].dx));
    // se e' gia' a posto non tocco niente: le sue posizioni sono sue
    if (!daRifare) { this._giaSbrogliato = true; return; }
    const veri = carta.posizioniAdesso();
    if (!Object.keys(veri).length) {
      // la casellina non e' ancora impaginata (la scheda "Aspetto" e' chiusa):
      // riprovo, se no il rimedio non parte piu' per tutta la sessione
      this._tentativi = (this._tentativi || 0) + 1;
      if (this._tentativi < 20) {
        clearTimeout(this._rimedio);
        this._rimedio = setTimeout(() => this._rimediaVecchi(carta), 600);
      }
      return;
    }
    this._giaSbrogliato = true;
    const uniti = {};
    Object.keys(posti).forEach((k) => {
      uniti[k] = veri[k] ? { ...posti[k], ...veri[k] } : posti[k];
    });
    this._scriviPosti(this._sbrogliaPosti(uniti));
    this._aggiornaPista();
  }

  // ---- quale casella sto sistemando nel riquadro ----
  // Il riquadro e' UNO SOLO, nella pagina principale. Toccando una casella
  // nell'anteprima del pop-up si sceglie lei: cosi' non serve rifare tutto
  // l'armamentario dentro a ogni scheda.
  _schedaA(percorso) {
    let lista = this._schede();
    let c = null;
    for (let i = 0; i < percorso.length; i += 1) {
      c = lista[percorso[i]];
      if (!c) return null;
      lista = c.cards || [];
    }
    return c;
  }

  _conScheda(percorso, nuova) {
    const clona = (lista, liv) => {
      const fuori = lista.slice();
      const i = percorso[liv];
      if (liv === percorso.length - 1) fuori[i] = nuova;
      else fuori[i] = { ...fuori[i], cards: clona(fuori[i].cards || [], liv + 1) };
      return fuori;
    };
    return clona(this._schede(), 0);
  }

  _trovaPercorso(cfg) {
    const uguale = (a, b) => String(a.type) === String(b.type)
      && String(a.entity || "") === String(b.entity || "")
      && String(a.name || "") === String(b.name || "");
    const cerca = (lista, base) => {
      for (let i = 0; i < lista.length; i += 1) {
        const c = lista[i] || {};
        if (uguale(c, cfg)) return base.concat([i]);
        if (Array.isArray(c.cards)) {
          const giu = cerca(c.cards, base.concat([i]));
          if (giu) return giu;
        }
      }
      return null;
    };
    return cerca(this._schede(), []);
  }

  // la configurazione della casella che il riquadro sta mostrando
  _cfgPista() {
    const p = this._sceltaPercorso;
    if (p && p.length) {
      const c = this._schedaA(p);
      if (c) return c;
    }
    return this._config;
  }

  // e dove vanno scritte le posizioni quando lui trascina
  _scriviPosti(posti) {
    const p = this._sceltaPercorso;
    if (!p || !p.length) {
      const c2 = { ...this._config };
      if (posti) c2.posti = posti; else delete c2.posti;
      this._config = c2;
      this._emetti();
      return;
    }
    const vecchia = this._schedaA(p);
    if (!vecchia) return;
    const nuova = { ...vecchia };
    if (posti) nuova.posti = posti; else delete nuova.posti;
    this._salvaSchede(this._conScheda(p, nuova), false);
  }

  _diciChi() {
    const box = this._postiBox;
    if (!box || !box._chi) return;
    box._chi.innerHTML = "";
    const p = this._sceltaPercorso;
    if (!p || !p.length) {
      box._chi.textContent = "Stai sistemando: questa casella. "
        + "Per una scheda del pop-up, toccala nell'anteprima qui di fianco.";
      return;
    }
    const c = this._schedaA(p) || {};
    const eti = document.createElement("span");
    eti.className = "chi-nome";
    eti.textContent = "Stai sistemando: " + (c.name || c.entity || "una scheda del pop-up");
    const torna = document.createElement("button");
    torna.type = "button";
    torna.className = "tastoPiatto";
    torna.textContent = "Torna alla casella";
    torna.addEventListener("click", () => {
      this._sceltaPercorso = null;
      this._misuraScelta = null;
      this._giaSbrogliato = false;
      this._planciaCercata = null;
      this._planciaSalvata = null;
      this._aggiornaPista();
    });
    box._chi.append(eti, torna);
  }

  _dico(testo) {
    const box = this._postiBox;
    if (!box || !box._nota) return;
    box._nota._occupata = true;
    box._nota.textContent = testo;
  }

  _pistaTrascina(carta) {
    const PEZZI = [
      ["valore", ".valore"],
      ["nome", ".testi"],
      ["extra", ".extra:not([hidden])"],
      ["colori", ".colori:not([hidden])"],
      ["lettori", ".lettori:not([hidden])"],
      ["tempo", ".tempo:not([hidden])"],
      ["cursore", ".cursore:not([hidden])"],
      ["comandi", ".comandi:not([hidden])"],
      ["icona", "svg.icona,img.ritratto,.iconaHa,.iconaFoto"],
    ];
    // Chi sta sotto al dito? Lo cerco confrontando le posizioni invece di
    // chiedere al browser "cosa c'e' qui": quella strada non risponde se il
    // riquadro e' fuori dallo schermo o dentro a un'ombra.
    const chiSono = (x, y) => {
      const radice = carta.shadowRoot;
      if (!radice) return null;
      const dentro = (el) => {
        if (!el) return false;
        const r = el.getBoundingClientRect();
        return r.width > 0 && x >= r.left - 2 && x <= r.right + 2
          && y >= r.top - 2 && y <= r.bottom + 2;
      };
      // le misure per prime: sono le piu' piccole e stanno sopra le altre
      const misure = radice.querySelectorAll(".chips .metrica");
      for (let i = 0; i < misure.length; i += 1) {
        if (dentro(misure[i]) && misure[i].dataset.eid) {
          return { chi: "misura:" + misure[i].dataset.eid, el: misure[i] };
        }
      }
      for (let i = 0; i < PEZZI.length; i += 1) {
        const el = radice.querySelector(PEZZI[i][1]);
        if (dentro(el)) return { chi: PEZZI[i][0], el: el };
      }
      return null;
    };
    let preso = null;

    // Il quadratino giallo con la freccina: si tiene premuto e il pezzo
    // cresce o rimpicciolisce. Sta FUORI dalla casellina (nel riquadro che
    // la contiene) cosi' non finisce dentro alla disposizione salvata.
    const maniglia = document.createElement("div");
    maniglia.className = "pista-maniglia";
    maniglia.hidden = true;
    maniglia.title = "Tieni premuto e trascina per ingrandire o rimpicciolire";
    maniglia.innerHTML = '<i class="q"><svg viewBox="0 0 24 24" aria-hidden="true">'
      + '<path d="M21,15V21H15V19H17.6L13.5,14.9L14.9,13.5L19,17.6V15H21M9.1,'
      + '10.5L10.5,9.1L6.4,5H9V3H3V9H5V6.4L9.1,10.5Z"></path></svg></i>';
    carta._maniglia = maniglia;

    const pezziDi = (chi) => {
      const radice = carta.shadowRoot;
      if (!radice || !chi) return [];
      if (chi.indexOf("misura:") === 0) {
        const eid = chi.slice(7);
        return [...radice.querySelectorAll(".chips .metrica")]
          .filter((e) => e.dataset.eid === eid);
      }
      const mappa = {
        nome: [".testi"], misure: [".chips"], valore: [".valore"],
        icona: ["svg.icona", "img.ritratto", ".iconaHa", ".iconaFoto"],
        cursore: [".cursore"], comandi: [".comandi"],
      };
      return (mappa[chi] || []).map((sel) => radice.querySelector(sel))
        .filter((el) => el && !el.hidden && el.getBoundingClientRect().width);
    };

    const scalaDi = (chi) => {
      const posti = (this._cfgPista() || {}).posti || {};
      const v0 = posti[chi] && posti[chi].s;
      return isFinite(v0) && v0 > 0 ? v0 : 1;
    };

    const aggiornaManiglia = () => {
      const chi = carta._scelto;
      const pezzi = chi ? pezziDi(chi) : [];
      const pista = carta.parentElement;
      if (!chi || !pezzi.length || !pista) {
        maniglia.hidden = true;
        if (carta.shadowRoot) {
          carta.shadowRoot.querySelectorAll(".scelto")
            .forEach((el) => el.classList.remove("scelto"));
        }
        return;
      }
      if (maniglia.parentElement !== pista) pista.appendChild(maniglia);
      // segno il pezzo scelto, se no non si capisce di chi e' il quadratino
      const radice = carta.shadowRoot;
      if (radice) {
        radice.querySelectorAll(".scelto").forEach((el) => {
          if (pezzi.indexOf(el) === -1) el.classList.remove("scelto");
        });
      }
      pezzi.forEach((el) => el.classList.add("scelto"));
      const r = pezzi[0].getBoundingClientRect();
      const rp = pista.getBoundingClientRect();
      maniglia.hidden = false;
      // il quadratino sta in mezzo all'angolo, ma la parte che risponde al
      // dito e' piu' larga di lui: sulle caselle fitte finiva sopra ai tasti
      // e bastava sbagliare di due pixel per prendere il pezzo di sotto
      maniglia.style.left = (r.right - rp.left - 14) + "px";
      maniglia.style.top = (r.bottom - rp.top - 14) + "px";
    };
    carta._aggiornaManiglia = aggiornaManiglia;

    // il pezzo si vede crescere mentre tieni premuto, senza rifare la casella
    const provaScala = (chi, k) => {
      const posti = (this._cfgPista() || {}).posti || {};
      const dove = posti[chi] || {};
      const w = isFinite(dove.w) ? dove.w : 0;
      const aDestra = isFinite(dove.dx) && (dove.x + w / 2) > 50;
      pezziDi(chi).forEach((el) => {
        el.style.transformOrigin = aDestra ? "top right" : "top left";
        el.style.transform = k === 1 ? "" : "scale(" + k + ")";
      });
    };

    let misuro = null;
    const avviaMisura = (e) => {
      const chi = carta._scelto;
      const pezzi = chi ? pezziDi(chi) : [];
      if (!pezzi.length) return false;
      e.preventDefault();
      e.stopPropagation();
      const r = pezzi[0].getBoundingClientRect();
      misuro = { chi: chi, x: e.clientX, y: e.clientY,
                 w: r.width, h: r.height, s: scalaDi(chi), k: scalaDi(chi) };
      maniglia.classList.add("inmano");
      try { maniglia.setPointerCapture(e.pointerId); } catch (e2) { /* pazienza */ }
      return true;
    };
    // Il dito e' sul quadratino? Lo decido dalle POSIZIONI, non chiedendo al
    // browser su cosa ha premuto: dentro alla finestra delle impostazioni il
    // tocco passa per un mucchio di gusci e l'unico modo sicuro di sapere
    // dov'e' finito e' guardare dove sta.
    const sulQuadratino = (x, y) => {
      if (maniglia.hidden || !maniglia.isConnected) return false;
      const r = maniglia.getBoundingClientRect();
      return r.width > 0 && x >= r.left - 3 && x <= r.right + 3
        && y >= r.top - 3 && y <= r.bottom + 3;
    };
    maniglia.addEventListener("pointerdown", avviaMisura);
    const misuraMuovi = (e) => {
      if (!misuro) return;
      e.preventDefault();
      e.stopPropagation();
      // tiri in diagonale: quanto cresce di lato piu' quanto cresce in alto,
      // diviso quanto e' grande adesso. Viene naturale come prendere
      // l'angolo di una finestra.
      const cresce = ((e.clientX - misuro.x) + (e.clientY - misuro.y))
        / Math.max(24, misuro.w + misuro.h);
      const k = Math.max(0.4, Math.min(3, misuro.s * (1 + cresce)));
      misuro.k = Math.round(k * 100) / 100;
      provaScala(misuro.chi, misuro.k);
      aggiornaManiglia();
      this._dico("grandezza " + Math.round(misuro.k * 100) + "%");
    };
    const misuraLascia = () => {
      if (!misuro) return;
      maniglia.classList.remove("inmano");
      const posti = { ...((this._cfgPista() || {}).posti || {}) };
      const vecchio = posti[misuro.chi] || {};
      const k = misuro.k;
      if (k === 1) delete vecchio.s; else vecchio.s = k;
      posti[misuro.chi] = { ...vecchio };
      carta._appenaSpostato = true;
      this._scriviPosti(posti);
      this._dico("grandezza salvata: " + Math.round(k * 100) + "%");
      misuro = null;
      setTimeout(aggiornaManiglia, 60);
    };
    maniglia.addEventListener("pointermove", misuraMuovi);
    maniglia.addEventListener("pointerup", misuraLascia);
    maniglia.addEventListener("pointercancel", misuraLascia);
    carta._misuraMuovi = misuraMuovi;
    carta._misuraLascia = misuraLascia;

    // Ascolto sulla FINESTRA, in cattura: cosi' arrivo prima di chiunque
    // altro. Attaccandomi alla casellina, qualcuno piu' in alto (la
    // finestra delle impostazioni, gli elenchi trascinabili di Home
    // Assistant) poteva fermare il tocco prima che arrivasse a me.
    const giu = (e) => {
      const radice = carta.shadowRoot;
      if (!radice || !carta.isConnected) return;
      const rq = carta.getBoundingClientRect();
      if (!rq.width) return;
      if (e.clientX < rq.left || e.clientX > rq.right
          || e.clientY < rq.top || e.clientY > rq.bottom) return;
      // il quadratino della grandezza viene prima di tutto
      if (e.target === maniglia
        || (e.target && e.target.nodeType && maniglia.contains(e.target))) return;
      if (sulQuadratino(e.clientX, e.clientY) && avviaMisura(e)) return;
      const q = chiSono(e.clientX, e.clientY);
      this._dico(q ? "preso: " + q.chi : "sotto al dito non c'e' nessun pezzo");
      if (!q) {
        carta._scelto = null;
        aggiornaManiglia();
        return;
      }
      carta._scelto = q.chi;
      setTimeout(aggiornaManiglia, 0);
      e.preventDefault();
      e.stopPropagation();
      // la prima volta fisso tutti i pezzi dove stanno adesso, se no
      // saltano tutti appena ne muovo uno
      const mia = this._cfgPista();
      if (!mia.posti || !Object.keys(mia.posti).length) {
        const ora = carta.posizioniAdesso();
        if (!Object.keys(ora).length) return;
        this._scriviPosti(ora);
        // la metto subito in modo libero, se no il primo trascinamento
        // partirebbe dalla disposizione automatica
        try { carta.setConfig({ ...this._cfgPista() }); } catch (e2) { /* pazienza */ }
        try { carta.hass = this._hass; } catch (e3) { /* pazienza */ }
        // adesso che sono liberi hanno preso la loro misura vera: rimisuro
        // e li distanzio, se no partono gia' uno sopra l'altro
        const veri = carta.posizioniAdesso();
        if (Object.keys(veri).length) {
          this._giaSbrogliato = true;
          this._scriviPosti(this._sbrogliaPosti(veri));
          try { carta.setConfig({ ...this._cfgPista() }); } catch (e4) { /* pazienza */ }
          try { carta.hass = this._hass; } catch (e5) { /* pazienza */ }
        }
      }
      const rc = carta.riquadroCasella();
      if (!rc) return;
      const re = q.el.getBoundingClientRect();
      preso = {
        chi: q.chi, el: q.el, rc: rc,
        dx: e.clientX - re.left, dy: e.clientY - re.top,
        largo: re.width, alto: re.height,
      };
      q.el.classList.add("inmano");
      try { carta.setPointerCapture(e.pointerId); } catch (e2) { /* pazienza */ }
    };

    const muovi = (e) => {
      if (!preso) return;
      e.preventDefault();
      e.stopPropagation();
      const x = (e.clientX - preso.dx - preso.rc.left) / preso.rc.width * 100;
      const y = (e.clientY - preso.dy - preso.rc.top) / preso.rc.height * 100;
      const maxX = 100 - (preso.largo / preso.rc.width * 100);
      const maxY = 100 - (preso.alto / preso.rc.height * 100);
      const px = Math.round(Math.max(0, Math.min(maxX, x)) * 10) / 10;
      const py = Math.round(Math.max(0, Math.min(maxY, y)) * 10) / 10;
      preso.finito = { x: px, y: py };
      this._dico("sposto " + preso.chi + " a " + px + "% " + py + "%");
      // muovo subito il pezzo, senza rifare la casella: cosi' e' liscio
      const quali = preso.chi === "icona"
        ? ["svg.icona", "img.ritratto", ".iconaHa", ".iconaFoto"] : [null];
      if (preso.chi === "icona") {
        quali.forEach((sel) => {
          const el = carta.shadowRoot.querySelector(sel);
          if (el) {
            el.style.right = "auto"; el.style.left = px + "%";
            el.style.top = py + "%";
          }
        });
      } else {
        preso.el.style.right = "auto";
        preso.el.style.left = px + "%";
        preso.el.style.top = py + "%";
      }
      aggiornaManiglia();
    };

    const lascia = () => {
      if (!preso) return;
      preso.el.classList.remove("inmano");
      this._dico(preso.finito
        ? "salvato " + preso.chi + " a " + preso.finito.x + "% " + preso.finito.y + "%"
        : "lasciato senza spostare " + preso.chi);
      if (preso.finito) {
        carta._appenaSpostato = true;
        const posti = { ...(this._cfgPista().posti || {}) };
        const vecchio = posti[preso.chi] || {};
        // il pezzo resta esattamente dove l'ha lasciato: prima lo scansavo
        // da solo se toccava un altro, ma cosi' non si capiva piu' dove
        // sarebbe finito. Se li vuole uno sopra l'altro, sono affari suoi.
        posti[preso.chi] = {
          ...vecchio,
          x: preso.finito.x,
          y: preso.finito.y,
          w: Math.round(preso.largo / preso.rc.width * 1000) / 10,
          h: Math.round(preso.alto / preso.rc.height * 1000) / 10,
          dx: Math.round((preso.rc.width - preso.largo)
            / preso.rc.width * 1000) / 10 - preso.finito.x,
        };
        this._scriviPosti(posti);
      }
      preso = null;
      setTimeout(aggiornaManiglia, 60);
    };
    // Mi metto in ascolto sulla FINESTRA, non sulla casellina: se il dito
    // esce dal riquadrino il trascinamento deve continuare lo stesso.
    // (Prima, con l'ascolto sulla casellina, uscire di un pixel lo
    // chiudeva subito e non si salvava niente.)
    // ...ma me li devo anche RIPRENDERE quando la finestra si chiude: ogni
    // volta che apriva le impostazioni ne restavano tre attaccati per
    // sempre, e dopo un po' di aperture ogni movimento del dito faceva
    // lavorare tutti quelli delle volte prima. Di qui il rallentamento
    // che peggiorava a ogni apertura.
    window.addEventListener("pointerdown", giu, true);
    window.addEventListener("pointermove", muovi, true);
    ["pointerup", "pointercancel"].forEach((ev) =>
      window.addEventListener(ev, lascia, true));
    // il quadratino della grandezza ascolta anche lui sulla finestra: se il
    // dito parte da li' ma poi esce dal quadratino, il ridimensionamento
    // deve continuare lo stesso (come per lo spostamento)
    window.addEventListener("pointermove", misuraMuovi, true);
    ["pointerup", "pointercancel"].forEach((ev) =>
      window.addEventListener(ev, misuraLascia, true));
    // e quando lui tocca una casella dentro all'anteprima del pop-up
    const scegli = (e) => {
      const cfg = e.detail && e.detail.config;
      if (!cfg || !this.isConnected) return;
      const p = this._trovaPercorso(cfg);
      const mia = this._config || {};
      const eLaMia = String(cfg.entity || "") === String(mia.entity || "")
        && String(cfg.name || "") === String(mia.name || "");
      if (!p && !eLaMia) return;
      // toccando la casella grande in cima si torna a sistemare lei
      this._sceltaPercorso = p && !eLaMia ? p : null;
      // la misura buona e' quella che ha adesso dentro al pop-up: la prendo
      // dall'elemento che ha toccato (offsetWidth, non il rettangolo sullo
      // schermo, che potrebbe essere rimpicciolito dall'anteprima)
      const chi = e.detail && e.detail.elemento;
      this._misuraScelta = (this._sceltaPercorso && chi && chi.offsetWidth > 60)
        ? { w: chi.offsetWidth, h: chi.offsetHeight } : null;
      this._giaSbrogliato = false;
      this._planciaCercata = null;
      this._planciaSalvata = null;
      this._aggiornaPista();
      const box = this._postiBox;
      if (box) box.scrollIntoView({ block: "nearest" });
    };
    window.addEventListener("casa-scegli-scheda", scegli, true);
    this._ascolti = () => {
      window.removeEventListener("casa-scegli-scheda", scegli, true);
      window.removeEventListener("pointerdown", giu, true);
      window.removeEventListener("pointermove", muovi, true);
      ["pointerup", "pointercancel"].forEach((ev) =>
        window.removeEventListener(ev, lascia, true));
      window.removeEventListener("pointermove", misuraMuovi, true);
      ["pointerup", "pointercancel"].forEach((ev) =>
        window.removeEventListener(ev, misuraLascia, true));
    };
    // e mentre sposto un pezzo la casella non deve fare il suo mestiere
    carta.addEventListener("click", (e) => {
      if (!preso && !carta._appenaSpostato) return;
      e.preventDefault();
      e.stopPropagation();
      carta._appenaSpostato = false;
    }, true);
  }

  // se Home Assistant mi stacca e mi riattacca (cambio di linguetta) gli
  // ascoltatori del trascinamento vanno rimessi
  connectedCallback() {
    const box = this._postiBox;
    if (box && box._carta && !this._ascolti) this._pistaTrascina(box._carta);
  }

  // La finestra delle impostazioni si chiude: mi riprendo tutto quello che
  // avevo lasciato in giro, se no si accumula apertura dopo apertura.
  disconnectedCallback() {
    if (this._ascolti) { this._ascolti(); this._ascolti = null; }
    clearTimeout(this._propagaDopo);
    this._propagaDopo = 0;
    const box = this._postiBox;
    if (box && box._guarda) { box._guarda.disconnect(); box._guarda = null; }
    clearTimeout(this._ricontrolla);
    clearTimeout(this._ricontrolla2);
    clearTimeout(this._rimedio);
    clearTimeout(this._scordaForm);
    clearTimeout(this._ripassoAnt);
    this._planciaSalvata = null;
    this._veraSalvata = null;
  }

  _costruisciNomi(forza) {
    const box = this._nomiMisure;
    if (!box) return;
    const scelte = this._config.info_entita || [];
    // se l'elenco e' lo stesso non tocco niente: rifare il riquadro fa
    // saltare la pagina in cima e perdere il campo dove sta scrivendo
    const firma = scelte.join(",");
    if (!forza && box._firma === firma) return;
    box._firma = firma;
    box.innerHTML = "";
    if (!scelte.length || !this._hass) return;
    const titolo = document.createElement("h4");
    titolo.textContent = "Come si chiamano le misure";
    box.appendChild(titolo);
    const nota = document.createElement("p");
    nota.className = "aiuto";
    nota.textContent = "Il nome compare accanto al numero. Lascia vuoto per "
      + "non scrivere niente.";
    box.appendChild(nota);

    const elenco = document.createElement("div");
    elenco.className = "nomiMisure";
    scelte.forEach((eid) => {
      const st = this._hass.states[eid];
      const riga = document.createElement("div");
      riga.className = "nomeMisura";
      const chi = document.createElement("span");
      chi.className = "chi";
      chi.textContent = String((st && st.attributes.friendly_name) || eid);
      chi.title = eid;
      const campo = document.createElement("input");
      campo.type = "text";
      campo.maxLength = 14;
      campo.placeholder = st ? this._nomeSuggerito(st, eid) : "nome";
      campo.value = (this._config.info_nomi || {})[eid] || "";
      const salva = () => {
        const nomi = { ...(this._config.info_nomi || {}) };
        const val = campo.value.trim();
        if (val) nomi[eid] = val;
        else delete nomi[eid];
        this._config = { ...this._config, info_nomi: nomi };
        this._emetti();
      };
      campo.addEventListener("change", salva);
      campo.addEventListener("blur", salva);

      // e il colore suo, staccato da quello degli effetti
      const suoColore = (this._config.info_colori || {})[eid];
      const via = document.createElement("button");
      via.type = "button";
      via.className = "togli";
      via.textContent = "✕";
      via.title = "Torna al colore della casella";
      via.hidden = !Array.isArray(suoColore);
      const scelta = this._sceltaColore(suoColore, (rgb) => {
        const tinte = { ...(this._config.info_colori || {}) };
        tinte[eid] = rgb;
        this._config = { ...this._config, info_colori: tinte };
        via.hidden = false;
        this._emetti();
      });
      scelta.bolla.title = "Colore di questa misura";
      via.addEventListener("click", () => {
        const tinte = { ...(this._config.info_colori || {}) };
        delete tinte[eid];
        this._config = { ...this._config, info_colori: tinte };
        this._emetti();
        this._costruisciNomi(true);
      });

      riga.append(chi, campo, scelta.bolla, via);
      elenco.appendChild(riga);
      elenco.appendChild(scelta.cassetto);
    });
    box.appendChild(elenco);
  }

  // il nome che ci metterebbe la card da sola: lo uso come suggerimento
  _nomeSuggerito(st, eid) {
    const mio = this._hass.states[this._config.entity];
    const nome = String((st.attributes && st.attributes.friendly_name) || eid.split(".")[1]);
    // tolgo la parte in comune col nome dell'apparecchio: "Hub 1200 Battery
    // Discharge Power" accanto a "Hub 1200 ..." diventa "Battery Discharge Power"
    const suo = String((mio && mio.attributes.friendly_name) || "").split(" ");
    const pezzi = nome.split(" ");
    let i = 0;
    while (i < pezzi.length - 1 && i < suo.length
           && pezzi[i].toLowerCase() === suo[i].toLowerCase()) i += 1;
    // taglio a parole intere: "Discharge Powe" non e' un suggerimento
    const resto = pezzi.slice(i);
    let fuori = resto[0] || "";
    for (let k = 1; k < resto.length; k += 1) {
      if ((fuori + " " + resto[k]).length > 14) break;
      fuori += " " + resto[k];
    }
    return fuori.slice(0, 14);
  }

  _costruisciTrovati() {
    const box = this._sensori;
    const trovati = this._trovaSensori();
    const scelti0 = this._config.info_entita || [];
    // stessi sensori e stesse spunte: aggiorno solo i numeri, senza rifare
    // il riquadro (se no la pagina salta in cima a ogni modifica)
    const firma = (this._config.entity || "") + "|" + trovati.join(",")
      + "|" + scelti0.join(",");
    if (box._firma === firma) {
      box.querySelectorAll(".trovato").forEach((riga) => {
        const eid = riga.dataset.eid;
        const st2 = this._hass ? this._hass.states[eid] : null;
        if (!st2) return;
        const u2 = st2.attributes.unit_of_measurement;
        const val = riga.querySelector(".val");
        const testo = String(st2.state).slice(0, 18) + (u2 ? " " + u2 : "");
        if (val && val.textContent !== testo) val.textContent = testo;
      });
      return;
    }
    box._firma = firma;
    box.innerHTML = "<h4>Sensori collegati a questa entita</h4>";
    if (!this._config.entity) {
      const vuoto = document.createElement("div");
      vuoto.className = "vuoto";
      vuoto.textContent = "Scegli prima un'entita nella scheda Base.";
      box.appendChild(vuoto);
      return;
    }
    if (!trovati.length) {
      const vuoto = document.createElement("div");
      vuoto.className = "vuoto";
      vuoto.textContent = "Non ho trovato sensori collegati. Puoi comunque "
        + "aggiungerne a mano qui sopra.";
      box.appendChild(vuoto);
      return;
    }
    const nota = document.createElement("p");
    nota.className = "aiuto";
    nota.textContent = "Spunta quelli che vuoi vedere in basso nella casella.";
    box.appendChild(nota);

    const elenco = document.createElement("div");
    elenco.className = "trovati";
    const scelti = this._config.info_entita || [];
    trovati.forEach((eid) => {
      const st = this._hass.states[eid];
      const riga = document.createElement("label");
      riga.className = "trovato";
      riga.dataset.eid = eid;
      const spunta = document.createElement("input");
      spunta.type = "checkbox";
      spunta.checked = scelti.includes(eid);
      spunta.addEventListener("change", () => {
        const ora = (this._config.info_entita || []).slice();
        const dove = ora.indexOf(eid);
        if (spunta.checked && dove === -1) ora.push(eid);
        if (!spunta.checked && dove !== -1) ora.splice(dove, 1);
        this._config = { ...this._config, info_entita: ora };
        this._emetti();
        this._forms.forEach((f) => { f.data = this._config; });
        this._costruisciNomi();
      });
      const nome = document.createElement("span");
      nome.className = "nome";
      nome.textContent = String(st.attributes.friendly_name || eid.split(".")[1])
        .replace(/_/g, " ");
      const val = document.createElement("span");
      val.className = "val";
      const u = st.attributes.unit_of_measurement;
      val.textContent = String(st.state).slice(0, 18) + (u ? " " + u : "");
      riga.append(spunta, nome, val);
      elenco.appendChild(riga);
    });
    box.appendChild(elenco);
  }

  _schemaDi(gruppo) {
    const dominio = (this._config.entity || "").split(".")[0];
    const azione = this._config.azione || "toggle";
    const vale = (nome) => {
      if (SOLO_AZIONE[nome] && SOLO_AZIONE[nome] !== azione) return false;
      // le due della batteria si vedono solo dove c'e' davvero una batteria
      if (nome === "carica_entita" || nome === "scarica_entita") {
        if (this._config.icona === "batteria") return true;
        if (this._config.icona && this._config.icona !== "auto") return false;
        const st0 = (this._hass && this._config.entity)
          ? this._hass.states[this._config.entity] : null;
        return iconaAutomatica(this._config.entity, st0) === "batteria";
      }
      // se l'accensione la decidono altre entita', la soglia serve sempre
      const rif = this._config.acceso_entita;
      if (nome === "soglia" && (Array.isArray(rif) ? rif.length : !!rif)) return true;
      const ammessi = SOLO_PER[nome];
      if (!ammessi) return true;
      if (!dominio) return false;
      return ammessi.includes(dominio);
    };
    const setaccia = (elenco) => elenco.map((voce) => {
      if (voce.type === "grid" && Array.isArray(voce.schema)) {
        const dentro = setaccia(voce.schema);
        return dentro.length ? { ...voce, schema: dentro } : null;
      }
      return vale(voce.name) ? voce : null;
    }).filter(Boolean);
    return setaccia(gruppo.schema);
  }

  // la firma serve a capire se lo schema e' cambiato davvero
  // com'e' messo adesso un modulo: solo i campi che ha davvero dentro
  _firmaValori(elenco) {
    const c = this._config;
    const dentro = [];
    const gira = (lista) => (lista || []).forEach((v) => {
      if (v.schema) { gira(v.schema); return; }
      if (!v.name) return;
      const x = c[v.name];
      dentro.push(v.name + "=" + (x === undefined ? "" : JSON.stringify(x)));
    });
    gira(elenco);
    return dentro.join("|");
  }

  // I nomi dei campi di un modulo, anche quelli dentro alle griglie
  _nomiSchema(elenco) {
    const nomi = [];
    const gira = (lista) => (lista || []).forEach((v) => {
      if (v.schema) { gira(v.schema); return; }
      if (v.name) nomi.push(v.name);
    });
    gira(elenco);
    return nomi;
  }

  _firmaSchema(elenco) {
    return JSON.stringify(elenco.map((v) => v.name
      || (v.schema || []).map((x) => x.name).join("+")));
  }

  _quantiCampi(elenco) {
    return elenco.reduce((n, v) => n + (v.schema ? v.schema.length : 1), 0);
  }

  _aggiornaSchemi() {
    if (!this._gruppi) return;
    let primaValida = -1;
    SEZIONI.forEach((sez, i) => {
      const suoi = this._gruppi[i] || [];
      let campi = 0;
      suoi.forEach((g) => {
        const nuovo = this._schemaDi(g.gruppo);
        const firma = this._firmaSchema(nuovo);
        if (g.form._firma !== firma) {
          g.form.schema = nuovo;
          g.form._firma = firma;
        }
        let quanti = this._quantiCampi(nuovo);
        // il modulo puo' essere vuoto ma il gruppo avere i suoi colori
        const conColori = !!(g.gruppo.colori && g.gruppo.colori.length
          && (!g.gruppo.soloAzione
              || g.gruppo.soloAzione === (this._config.azione || "toggle")));
        g.form.hidden = quanti === 0;
        if (conColori) quanti += g.gruppo.colori.length;
        campi += quanti;
        // il titoletto sparisce insieme ai suoi campi
        if (g.titolo) g.titolo.hidden = quanti === 0;
        if (g.colori) g.colori.hidden = quanti === 0;
      });
      // certe schede hanno anche i riquadri fatti a mano, quindi restano
      const conBlocchi = ["icona", "sfondo", "tocco", "aspetto"].includes(sez.chiave);
      if (sez.chiave === "grafico" || sez.chiave === "persone") {
        // queste due valgono solo dove hanno senso: se non hanno campi,
        // la scheda sparisce del tutto
        if (campi === 0) {
          const b0 = this._tasti[i];
          if (b0) b0.style.display = "none";
          this._pannelli[i].setAttribute("nascosto", "");
          return;
        }
      }
      const utile = campi > 0 || conBlocchi;
      const bottone = this._tasti[i];
      if (bottone) bottone.style.display = utile ? "" : "none";
      if (!utile) this._pannelli[i].setAttribute("nascosto", "");
      else if (primaValida === -1) primaValida = i;
    });
    const scelta = this._tasti.findIndex(
      (b) => b.hasAttribute("scelta") && b.style.display !== "none");
    if (scelta === -1 && primaValida !== -1) this._scegliScheda(primaValida);
  }

  // cerca fra tutte le impostazioni e dice dove stanno
  _cercaOpzioni() {
    const q = (this._cerca.value || "").trim().toLowerCase();
    this._trovate.innerHTML = "";
    this._trovate.hidden = q.length < 2;
    if (q.length < 2) return;
    const senzaAccenti = (t) => String(t).toLowerCase()
      .replace(/[\u00e0\u00e1]/g, "a").replace(/[\u00e8\u00e9]/g, "e")
      .replace(/[\u00ec\u00ed]/g, "i").replace(/[\u00f2\u00f3]/g, "o")
      .replace(/[\u00f9\u00fa]/g, "u");
    const parola = senzaAccenti(q);
    let quante = 0;
    SEZIONI.forEach((sez, i) => {
      const tasto = this._tasti[i];
      if (tasto && tasto.style.display === "none") return;
      (this._gruppi[i] || []).forEach((g) => {
        if (g.form.hidden) return;
        const dentro = [];
        const guarda = (elenco) => elenco.forEach((voce) => {
          if (voce.schema) { guarda(voce.schema); return; }
          if (!voce.name) return;
          const eti = ETICHETTE[voce.name] || voce.name;
          if (senzaAccenti(eti + " " + voce.name).includes(parola)) dentro.push(eti);
        });
        guarda(g.form.schema || []);
        dentro.forEach((eti) => {
          quante += 1;
          const riga = document.createElement("button");
          riga.type = "button";
          riga.className = "trovata";
          riga.innerHTML = "<b></b><span></span>";
          riga.querySelector("b").textContent = eti;
          riga.querySelector("span").textContent = sez.titolo
            + (g.gruppo.titolo ? " \u203a " + g.gruppo.titolo : "");
          riga.addEventListener("click", () => {
            this._scegliScheda(i);
            this._cerca.value = "";
            this._trovate.hidden = true;
            this._trovate.innerHTML = "";
            const dove = g.titolo || g.form;
            if (dove && dove.scrollIntoView) {
              dove.scrollIntoView({ block: "center", behavior: "smooth" });
            }
            g.form.setAttribute("acceso", "");
            setTimeout(() => g.form.removeAttribute("acceso"), 1400);
          });
          this._trovate.appendChild(riga);
        });
      });
    });
    if (!quante) {
      const vuoto = document.createElement("div");
      vuoto.className = "trovata niente";
      vuoto.textContent = "Nessuna impostazione con \u00ab" + q + "\u00bb";
      this._trovate.appendChild(vuoto);
    }
  }

  // le icone del catalogo riempiono il loro quadratino: si misurano quando
  // la scheda e' aperta davvero (da nascosta misurerebbero zero)
  _adattaCatalogo() {
    const griglia = this._scelte && this._scelte.querySelector(".iconePicker");
    if (!griglia || griglia.hidden || !griglia.isConnected) return;
    if (!griglia.getBoundingClientRect().height) return;
    griglia.querySelectorAll(".sceltaIcona").forEach((b) => {
      const dis = b.querySelector("svg");
      if (dis && b.dataset.nome) riempiRiquadro(dis, b.dataset.nome);
    });
  }

  _scegliScheda(i) {
    // Le linguette non si buttano via, si nascondono: l'editor della scheda
    // che aveva aperto in "Tocco" restava vivo per sempre - con la sua
    // anteprima - e continuava a lavorare anche stando su un'altra
    // linguetta. Uscendo da "Tocco" lo chiudo.
    let tocco = -1;
    SEZIONI.forEach((s, k) => { if (s.chiave === "tocco") tocco = k; });
    if (tocco >= 0 && i !== tocco
      && (this._apertaIdx !== null && this._apertaIdx !== undefined)) {
      this._apertaIdx = null;
      this._pickerAperto = false;
      this._costruisciBlocco(true);
    }
    this._tasti.forEach((b, k) => {
      if (k === i) b.setAttribute("scelta", "");
      else b.removeAttribute("scelta");
    });
    this._pannelli.forEach((pa, k) => {
      if (k === i) pa.removeAttribute("nascosto");
      else pa.setAttribute("nascosto", "");
    });
    requestAnimationFrame(() => this._adattaCatalogo());
  }



  _costruisciFoto() {
    const box = this._foto;
    const firma = String(this._config.sfondo_immagine || "");
    if (box._firma === firma) return;
    box._firma = firma;
    box.innerHTML = "<h4>Foto di sfondo</h4>";
    const riga = document.createElement("div");
    riga.className = "foto-riga";

    if (this._config.sfondo_immagine) {
      const img = document.createElement("img");
      img.className = "foto-anteprima";
      img.src = this._config.sfondo_immagine;
      img.alt = "";
      img.title = "Tocca per scegliere un'altra foto";
      img.style.cursor = "pointer";
      img.addEventListener("click", () => this.querySelector("input[type=file]").click());
      riga.appendChild(img);
    }

    const scegli = document.createElement("button");
    scegli.className = "bt";
    scegli.type = "button";
    scegli.textContent = this._config.sfondo_immagine
      ? "Scegli un'altra foto"
      : "Scegli una foto dal telefono o dal PC";

    const file = document.createElement("input");
    file.type = "file";
    file.accept = "image/*";
    file.style.display = "none";
    scegli.addEventListener("click", () => file.click());
    file.addEventListener("change", () => {
      if (file.files && file.files[0]) this._caricaFoto(file.files[0]);
    });

    riga.append(scegli, file);

    if (this._config.sfondo_immagine) {
      const via = document.createElement("button");
      via.className = "bt chiaro";
      via.type = "button";
      via.textContent = "Togli la foto";
      via.addEventListener("click", () => {
        const c = { ...this._config };
        delete c.sfondo_immagine;
        this._config = c;
        this._emetti();
        this._render();
      });
      riga.appendChild(via);
    }
    box.appendChild(riga);

    const tinte = document.createElement("div");
    tinte.className = "foto-riga";
    // i tastini per togliere non servono piu': ogni riga del colore ha la sua X
    if (tinte.children.length) box.appendChild(tinte);
    // in fondo alla scheda Sfondo, che e' dove uno li va a cercare

    this._notaFoto = document.createElement("div");
    this._notaFoto.className = "foto-nota";
    this._notaFoto.textContent = this._config.sfondo_immagine
      ? this._config.sfondo_immagine
      : "Premi il pulsante: si apre la galleria del telefono o le cartelle del PC. "
        + "In alternativa scrivi l'indirizzo nel campo qui sopra (es. /local/foto.jpg).";
    box.appendChild(this._notaFoto);
  }

  async _caricaIcona(file) {
    const nota = this._scelte && this._scelte._suaIcona
      ? this._scelte._suaIcona.nota : null;
    if (nota) {
      nota.className = "foto-nota";
      nota.textContent = "Sto caricando " + file.name + "...";
    }
    try {
      const dati = new FormData();
      dati.append("file", file);
      const risposta = await fetch("/api/image/upload", {
        method: "POST",
        headers: { Authorization: "Bearer " + this._hass.auth.data.access_token },
        body: dati,
      });
      if (!risposta.ok) throw new Error("HTTP " + risposta.status);
      const info = await risposta.json();
      this._config = {
        ...this._config,
        icona_immagine: "/api/image/serve/" + info.id + "/original",
      };
      if (nota) nota.textContent = "";
      this._emetti();
      this._costruisciScelte();
    } catch (err) {
      if (nota) {
        nota.className = "foto-nota errore";
        nota.textContent = "Non sono riuscito a caricarla (" + err.message
          + "). Mettila in config/www/ e scrivi /local/nomefile.png nel codice.";
      }
    }
  }

  async _caricaFoto(file) {
    this._notaFoto.className = "foto-nota";
    this._notaFoto.textContent = "Sto caricando " + file.name + "...";
    try {
      const dati = new FormData();
      dati.append("file", file);
      const risposta = await fetch("/api/image/upload", {
        method: "POST",
        headers: { Authorization: "Bearer " + this._hass.auth.data.access_token },
        body: dati,
      });
      if (!risposta.ok) throw new Error("HTTP " + risposta.status);
      const info = await risposta.json();
      this._config = {
        ...this._config,
        sfondo_immagine: "/api/image/serve/" + info.id + "/original",
      };
      this._emetti();
      this._render();
    } catch (err) {
      this._notaFoto.className = "foto-nota errore";
      this._notaFoto.textContent =
        "Non sono riuscito a caricarla (" + err.message + "). "
        + "Mettila in config/www/ e scrivi /local/nomefoto.jpg nel campo qui sopra.";
    }
  }

  _bottone(simbolo, titolo, azione) {
    const b = document.createElement("button");
    b.className = "bt-icona";
    b.type = "button";
    b.title = titolo;
    b.textContent = simbolo;
    b.addEventListener("click", azione);
    return b;
  }

  // aspetta che un tag sia registrato, ma non all'infinito
  _attendiTag(nome, ms) {
    if (customElements.get(nome)) return Promise.resolve(true);
    return Promise.race([
      customElements.whenDefined(nome).then(() => true),
      new Promise((ok) => setTimeout(() => ok(false), ms || 2500)),
    ]);
  }

  // la classe della scheda, sia per le custom che per quelle di serie
  async _classeScheda(tipo) {
    try {
      if (tipo.indexOf("custom:") === 0) {
        const nome = tipo.slice(7);
        await this._attendiTag(nome, 2500);
        return customElements.get(nome) || null;
      }
      const atteso = "hui-" + tipo + "-card";
      if (customElements.get(atteso)) return customElements.get(atteso);
      if (window.loadCardHelpers) {
        const aiuti = await window.loadCardHelpers();
        let nome = atteso;
        try {
          const provino = aiuti.createCardElement({ type: tipo });
          if (provino && provino.localName) nome = provino.localName;
        } catch (e) { /* alcune schede si lamentano se la config e' vuota */ }
        await this._attendiTag(nome, 2500);
        return customElements.get(nome) || null;
      }
    } catch (e) { /* niente */ }
    return null;
  }

  // la configurazione di esempio della scheda: senza, molti pannelli
  // di impostazioni restano bianchi
  async _configDiPartenza(tipo, classe) {
    const base = { type: tipo };
    try {
      const cls = classe || await this._classeScheda(tipo);
      if (!cls || typeof cls.getStubConfig !== "function") return base;
      const tutte = this._hass ? Object.keys(this._hass.states) : [];
      const stub = await cls.getStubConfig(this._hass, tutte, tutte);
      if (stub && typeof stub === "object") return { ...stub, type: tipo };
    } catch (e) { /* niente */ }
    return base;
  }

  _haDisegnato(ed) {
    if (!ed) return false;
    if (ed.shadowRoot && ed.shadowRoot.childElementCount > 0) return true;
    return ed.childElementCount > 0;
  }

  // chiede alla scheda il SUO pannello di impostazioni, quello vero
  async _editorNativo(card, aggiorna, box) {
    try {
      const tipo = String(card.type || "");
      const classe = await this._classeScheda(tipo);
      if (!classe || typeof classe.getConfigElement !== "function") return false;
      const ed = await classe.getConfigElement();
      if (!ed) return false;
      ed.hass = this._hass;
      try { ed.lovelace = this._lov(); } catch (e) { /* non tutte lo vogliono */ }
      ed.addEventListener("config-changed", (e) => {
        e.stopPropagation();
        if (e.detail && e.detail.config) aggiorna(e.detail.config);
      });
      box.appendChild(ed);
      try {
        if (typeof ed.setConfig === "function") ed.setConfig({ ...card });
      } catch (e) { /* la scheda si lamenta della configurazione */ }
      // certi pannelli ci mettono qualche decimo di secondo a comparire
      // (caricano da soli i pezzi di Home Assistant che gli servono)
      for (let giro = 0; giro < 16 && !this._haDisegnato(ed); giro += 1) {
        await new Promise((ok) => setTimeout(ok, 70));
      }
      if (!this._haDisegnato(ed)) {
        try { box.removeChild(ed); } catch (e) { /* gia' tolto */ }
        return false;
      }
      this._edScheda = ed;
      return true;
    } catch (e) {
      return false;
    }
  }

  // "nuda" = ha solo il tipo (ed eventualmente l'entita' che ci metto io)
  _schedaNuda(card) {
    const proprie = Object.keys(card || {}).filter(
      (k) => k !== "type" && k !== "entity" && k !== "entities");
    return proprie.length === 0;
  }

  _riempiEditorScheda(box, card, aggiorna, indice) {
    box.innerHTML = "";
    const attesa = document.createElement("div");
    attesa.className = "vuoto";
    attesa.textContent = "Carico le impostazioni della scheda...";
    // il contenitore va attaccato SUBITO: un elemento staccato dal
    // documento non si disegna mai, e sembrerebbe un pannello vuoto
    // l'anteprima della scheda si vede gia' nel riquadro a destra,
    // dentro "Contenuto del pop-up": qui sarebbe solo un doppione
    const dentro = document.createElement("div");
    box.append(attesa, dentro);

    const pronta = this._schedaNuda(card)
      ? this._configDiPartenza(String(card.type || "")).then((base) => {
          if (Object.keys(base).length <= 1) return card;
          const unita = { ...base, ...card };
          // la salvo dopo, quando il pannello e' gia' in piedi
          setTimeout(() => aggiorna(unita), 500);
          return unita;
        })
      : Promise.resolve(card);

    pronta.then((carta) => this._editorNativo(carta, aggiorna, dentro)).then((fatto) => {
      if (!box.isConnected) return;
      if (!fatto && customElements.get("hui-card-element-editor")) {
        const ed = document.createElement("hui-card-element-editor");
        ed.hass = this._hass;
        ed.lovelace = this._lov();
        dentro.appendChild(ed);
        ed.value = card;
        ed.addEventListener("config-changed", (e) => {
          e.stopPropagation();
          if (e.detail && e.detail.config) aggiorna(e.detail.config);
        });
        fatto = true;
      }
      if (!fatto) dentro.appendChild(this._moduloSemplice(card, aggiorna));
      attesa.remove();
      // la scheda "Manuale" nasce col riquadro del codice gia' aperto:
      // e' l'unica cosa che c'e' da fare, farlo cercare non ha senso
      // il pannello viene rifatto un paio di volte di fila appena la scheda
      // arriva: se dimenticassi subito il segno, la prima costruzione se lo
      // mangerebbe e quella che resta a video nascerebbe chiusa
      const subito = this._apriCodicePer !== undefined
        && this._apriCodicePer !== null && this._apriCodicePer === indice;
      if (subito) {
        clearTimeout(this._scordaCodice);
        this._scordaCodice = setTimeout(() => { this._apriCodicePer = null; }, 2500);
      }
      box.appendChild(this._codiceScheda(card, aggiorna, subito));
    });
  }

  // il codice della scheda, in YAML come in Home Assistant
  _codiceScheda(card, aggiorna, subito) {
    const box = document.createElement("div");
    box.className = "codice-scheda";
    const apri = document.createElement("button");
    apri.className = "bt chiaro";
    apri.type = "button";
    apri.textContent = "Codice della scheda (YAML)";
    const dentro = document.createElement("div");
    dentro.hidden = true;
    const esito = document.createElement("div");
    esito.className = "esito";
    let leggi = null;

    const conEditorHa = () => {
      const ed = document.createElement("ha-yaml-editor");
      ed.hass = this._hass;
      dentro.appendChild(ed);
      ed.defaultValue = card;
      let ultimo = card;
      let buono = true;
      ed.addEventListener("value-changed", (e) => {
        e.stopPropagation();
        buono = e.detail.isValid !== false;
        if (buono) ultimo = e.detail.value;
        esito.textContent = buono ? "" : "YAML non valido";
      });
      leggi = () => (buono ? ultimo : null);
    };

    const conCasella = () => {
      const area = document.createElement("textarea");
      area.rows = 12;
      area.spellcheck = false;
      area.value = aYaml(card, 0);
      dentro.appendChild(area);
      leggi = () => daYaml(area.value);
    };

    const applica = document.createElement("button");
    applica.className = "bt";
    applica.type = "button";
    applica.textContent = "Applica il codice";
    applica.hidden = true;
    applica.addEventListener("click", () => {
      try {
        const nuova = leggi ? leggi() : null;
        if (!nuova || typeof nuova !== "object") throw new Error("codice vuoto o non valido");
        if (!nuova.type) throw new Error('manca la riga "type:"');
        esito.textContent = "";
        aggiorna(nuova);
      } catch (e) {
        esito.textContent = "Codice non valido: " + e.message;
      }
    });

    let costruito = false;
    apri.addEventListener("click", async () => {
      if (!costruito) {
        costruito = true;
        const c_e = await this._attendiTag("ha-yaml-editor", 1200);
        if (c_e) conEditorHa(); else conCasella();
      }
      const chiuso = dentro.hidden;
      dentro.hidden = !chiuso;
      applica.hidden = !chiuso;
      esito.textContent = "";
    });

    box.append(apri, dentro, applica, esito);
    if (subito) setTimeout(() => apri.click(), 0);
    return box;
  }

  // Tieni premuta la manina e trascini la scheda dove la vuoi. Non sposto
  // niente nel documento mentre trascini: alzo solo la riga e segno con una
  // riga colorata dove andra' a finire. L'ordine vero lo scrivo quando molli.
  _riordinaCol(presa, riga, indice) {
    let tira = null;
    const pulisci = () => {
      if (!this._blocco) return;
      this._blocco.querySelectorAll(".riga-scheda").forEach((r) => {
        r.classList.remove("segnaSopra", "segnaSotto");
      });
    };
    const muovi = (e) => {
      if (!tira) return;
      e.preventDefault();
      riga.style.transform = "translateY(" + (e.clientY - tira.y0) + "px)";
      let a = 0;
      tira.righe.forEach((x, k) => {
        if (k === tira.da) return;
        if (e.clientY > x.r.top + x.r.height / 2) a += 1;
      });
      tira.a = a;
      pulisci();
      // la riga colorata dove finira': sopra a quella che verra' spinta giu',
      // o sotto all'ultima se la stai portando in fondo
      const altre = tira.righe.filter((x, k) => k !== tira.da);
      if (altre.length) {
        if (a < altre.length) altre[a].el.classList.add("segnaSopra");
        else altre[altre.length - 1].el.classList.add("segnaSotto");
      }
    };
    const su = () => {
      if (!tira) return;
      window.removeEventListener("pointermove", muovi, true);
      window.removeEventListener("pointerup", su, true);
      window.removeEventListener("pointercancel", su, true);
      riga.classList.remove("inmano");
      riga.style.transform = "";
      pulisci();
      const da = tira.da;
      const a = tira.a;
      tira = null;
      if (a === da) return;
      const l = this._schede().slice();
      l.splice(a, 0, l.splice(da, 1)[0]);
      this._apertaIdx = null;
      this._salvaSchede(l, true);
    };
    presa.addEventListener("pointerdown", (e) => {
      if (!this._blocco) return;
      e.preventDefault();
      e.stopPropagation();
      const righe = [...this._blocco.querySelectorAll(".riga-scheda")];
      tira = {
        y0: e.clientY, da: indice, a: indice,
        righe: righe.map((r) => ({ el: r, r: r.getBoundingClientRect() })),
      };
      riga.classList.add("inmano");
      // ascolto sulla finestra: il dito esce quasi subito dalla manina
      window.addEventListener("pointermove", muovi, true);
      window.addEventListener("pointerup", su, true);
      window.addEventListener("pointercancel", su, true);
    });
  }

  _moduloSemplice(card, aggiorna) {
    const MULTI = ["entities", "glance", "history-graph", "statistics-graph",
                   "logbook", "map", "distribution"];
    const multi = MULTI.includes(card.type) || Array.isArray(card.entities);
    const form = document.createElement("ha-form");
    form.hass = this._hass;
    form._ebbeHass = !!this._hass;
    form._quandoHass = Date.now();
    form.schema = [
      multi
        ? { name: "entities", selector: { entity: { multiple: true } } }
        : { name: "entity", selector: { entity: {} } },
      { name: "title", selector: { text: {} } },
      { name: "name", selector: { text: {} } },
    ];
    form.computeLabel = (x) => ({
      entity: "Entita", entities: "Entita", title: "Titolo (facoltativo)",
      name: "Nome (facoltativo)",
    })[x.name] || x.name;
    form.data = card;
    form.addEventListener("value-changed", (e) => {
      e.stopPropagation();
      const nuova = { ...card, ...e.detail.value };
      Object.keys(nuova).forEach((k) => {
        if (nuova[k] === "" || nuova[k] === undefined) delete nuova[k];
      });
      aggiorna(nuova);
    });
    return form;
  }

  _costruisciTendina() {
    const riga = document.createElement("div");
    riga.className = "scelta-riga";
    const sel = document.createElement("select");
    sel.className = "tendina";

    const gruppo = (titolo, voci) => {
      if (!voci.length) return;
      const g = document.createElement("optgroup");
      g.label = titolo;
      voci.forEach(([tipo, nome]) => {
        const o = document.createElement("option");
        o.value = tipo;
        o.textContent = nome;
        g.appendChild(o);
      });
      sel.appendChild(g);
    };

    const mie = (window.customCards || [])
      .filter((c) => c.type && c.type !== "casa-tile")
      .map((c) => ["custom:" + c.type, c.name || c.type]);

    gruppo("Le piu' usate", SCHEDE_PRONTE);
    gruppo("Altre schede di Home Assistant", SCHEDE_ALTRE);
    gruppo("Le tue schede aggiuntive", mie);
    gruppo("Scrivo io", [[SCHEDA_MANO, "Manuale - incollo il codice YAML"]]);

    const ok = document.createElement("button");
    ok.className = "bt";
    ok.type = "button";
    ok.textContent = "Aggiungi";
    ok.addEventListener("click", () => this._scegli(sel.value));
    riga.append(sel, ok);
    return riga;
  }

  _scegli(tipo) {
    // "Manuale": metto una scheda di testo con le istruzioni dentro e apro
    // subito il riquadro del codice. Da li' incolla quello che vuole e la
    // scheda diventa quella - come fa Home Assistant con la voce "Manuale".
    if (tipo === SCHEDA_MANO) {
      const l0 = this._schede().slice();
      const posto0 = l0.length;
      l0.push({ type: "markdown",
        content: "Apri **Codice della scheda (YAML)** qui sotto e incolla il "
          + "codice della scheda che vuoi: questa riga sparisce e al suo "
          + "posto arriva quella." });
      this._pickerAperto = false;
      this._apertaIdx = posto0;
      this._apriCodicePer = posto0;
      this._salvaSchede(l0, true);
      return;
    }
    const MULTI = ["entities", "glance", "history-graph", "statistics-graph",
                   "logbook", "map", "distribution"];
    const mia = {};
    if (this._config.entity) {
      if (MULTI.includes(tipo)) mia.entities = [this._config.entity];
      else mia.entity = this._config.entity;
    } else if (MULTI.includes(tipo)) {
      mia.entities = [];
    }
    // metto subito una riga provvisoria, cosi' si vede che e' arrivata,
    // poi le do la configurazione di partenza della scheda
    const l = this._schede().slice();
    const posto = l.length;
    l.push({ type: tipo, ...mia });
    this._pickerAperto = false;
    this._apertaIdx = posto;
    this._salvaSchede(l, true);

    this._configDiPartenza(tipo).then((base) => {
      if (Object.keys(base).length <= 1) return;
      const ora = this._schede().slice();
      if (!ora[posto] || ora[posto].type !== tipo) return;
      ora[posto] = { ...base, ...ora[posto] };
      this._salvaSchede(ora, true);
    });
  }

  // il vestito della singola scheda: tinta e trasparenza sue, non di tutte
  _vestitoScheda(i) {
    const riga = document.createElement("div");
    riga.className = "vestito-riga";
    const suoi = Array.isArray(this._config.finestra_schede_stile)
      ? this._config.finestra_schede_stile.slice() : [];
    const mio = suoi[i] || {};
    const salva = (dati) => {
      const l = (Array.isArray(this._config.finestra_schede_stile)
        ? this._config.finestra_schede_stile.slice() : []);
      while (l.length <= i) l.push({});
      l[i] = { ...(l[i] || {}), ...dati };
      // se non ha piu' niente addosso lo tolgo
      if (l[i].sfondo === null) delete l[i].sfondo;
      if (l[i].trasparenza === null) delete l[i].trasparenza;
      this._config = { ...this._config, finestra_schede_stile: l };
      this._emetti();
    };

    const eti = document.createElement("span");
    eti.className = "eti";
    eti.textContent = "Sfondo di questa scheda";

    const scelta = this._sceltaColore(mio.sfondo, (rgb) => salva({ sfondo: rgb }));

    const barra = document.createElement("input");
    barra.type = "range";
    barra.min = "0"; barra.max = "100"; barra.step = "5";
    barra.title = "Quanto e trasparente";
    barra.value = String(mio.trasparenza === undefined ? 0 : mio.trasparenza);
    const quanto = document.createElement("span");
    quanto.className = "quanto";
    quanto.textContent = barra.value + "%";
    barra.addEventListener("input", () => { quanto.textContent = barra.value + "%"; });
    barra.addEventListener("change", () => salva({ trasparenza: Number(barra.value) }));

    const via = this._bottone("✕", "Togli il vestito a questa scheda", () => {
      const l = (Array.isArray(this._config.finestra_schede_stile)
        ? this._config.finestra_schede_stile.slice() : []);
      if (l[i]) l[i] = {};
      this._config = { ...this._config, finestra_schede_stile: l };
      this._emetti();
      this._costruisciBlocco(true);
    });

    riga.append(eti, scelta.bolla, barra, quanto, via);
    const fuori = document.createElement("div");
    fuori.className = "colore-riga-fuori";
    fuori.append(riga, scelta.cassetto);
    return fuori;
  }

  _costruisciBlocco(forza) {
    const mostra = this._config.azione === "finestra";
    this._blocco.style.display = mostra ? "" : "none";
    if (!mostra) {
      this._blocco.innerHTML = "";
      this._firmaBlocco = null;
      return;
    }

    const lista = this._schede();
    // se cambiano solo i VALORI di una scheda non rifaccio l'elenco:
    // altrimenti il pannello aperto si richiude ad ogni tocco
    const firma = JSON.stringify(lista.map((c) => (c || {}).type))
      + "|" + this._apertaIdx + "|" + (this._pickerAperto ? 1 : 0)
      + "|" + JSON.stringify(this._config.finestra_schede_stile || []);
    if (!forza && this._firmaBlocco === firma) return;
    this._firmaBlocco = firma;
    this._blocco.innerHTML =
      "<h4>Schede dentro il pop-up</h4>" +
      "<p class='aiuto'>Aggiungi tutte le schede che vuoi: sono le stesse di Home Assistant, " +
      "e le puoi modificare quando vuoi. Per riordinarle tieni premuto il "
      + "puntino a sinistra e trascinale.</p>";

    if (!lista.length) {
      const vuoto = document.createElement("div");
      vuoto.className = "vuoto";
      vuoto.textContent = "Ancora nessuna scheda: il pop-up mostrera l'elenco dell'entita. Premi qui sotto per sceglierne una.";
      this._blocco.appendChild(vuoto);
    }

    lista.forEach((card, i) => {
      const riga = document.createElement("div");
      riga.className = "riga-scheda" + (this._apertaIdx === i ? " aperta" : "");
      const num = document.createElement("span");
      num.className = "num";
      num.textContent = (i + 1) + ".";
      const tipo = document.createElement("span");
      tipo.className = "tipo";
      const tecnico = String(card.type || "?");
      tipo.innerHTML = '<span class="chiaro"></span><span class="piccolo"></span>';
      tipo.querySelector(".chiaro").textContent = nomeScheda(tecnico);
      tipo.querySelector(".piccolo").textContent = tecnico.replace("custom:", "");
      const spinta = document.createElement("span");
      spinta.className = "spinta";
      spinta.append(
        this._bottone("\u270e", "Modifica", () => {
          this._apertaIdx = this._apertaIdx === i ? null : i;
          this._costruisciBlocco(true);
        }),
        this._bottone("\u2715", "Elimina", () => {
          const l = lista.slice();
          l.splice(i, 1);
          this._apertaIdx = null;
          this._salvaSchede(l, true);
        })
      );
      // per riordinare si tiene premuto qui e si trascina, invece delle due
      // frecce: con piu' di tre schede portarne una in cima erano cinque clic
      const presa = document.createElement("span");
      presa.className = "presa";
      presa.textContent = "\u283f";
      presa.title = "Tieni premuto e trascina per riordinare";
      this._riordinaCol(presa, riga, i);
      riga.append(presa, num, tipo, spinta);
      this._blocco.appendChild(riga);
      this._blocco.appendChild(this._vestitoScheda(i));

      if (this._apertaIdx === i) {
        const box = document.createElement("div");
        box.className = "editor-scheda";
        const aggiorna = (nuova) => {
          const l = this._schede().slice();
          l[i] = nuova;
          const tec = String(nuova.type || "?");
      tipo.querySelector(".chiaro").textContent = nomeScheda(tec);
      tipo.querySelector(".piccolo").textContent = tec.replace("custom:", "");
          this._salvaSchede(l, false);
        };
        this._riempiEditorScheda(box, card, aggiorna, i);
        this._blocco.appendChild(box);
      }
    });

    if (this._pickerAperto) {
      this._blocco.appendChild(this._costruisciTendina());
      const annulla = document.createElement("button");
      annulla.className = "bt chiaro";
      annulla.type = "button";
      annulla.textContent = "Annulla";
      annulla.addEventListener("click", () => {
        this._pickerAperto = false;
        this._costruisciBlocco(true);
      });
      this._blocco.appendChild(annulla);
    } else {
      const aggiungi = document.createElement("button");
      aggiungi.className = "bt";
      aggiungi.type = "button";
      aggiungi.textContent = "+ Aggiungi scheda";
      aggiungi.addEventListener("click", () => {
        this._pickerAperto = true;
        this._costruisciBlocco(true);
      });
      this._blocco.appendChild(aggiungi);
    }
  }
}

// se il file viene caricato due volte (vecchia risorsa /local rimasta
// insieme a quella di HACS) il secondo giro non deve buttare giu' la plancia
if (!customElements.get("casa-tile")) {
  customElements.define("casa-tile", CasaTile);
}
if (!customElements.get("casa-tile-editor")) {
  customElements.define("casa-tile-editor", CasaTileEditor);
}

// Se il file viene caricato due volte (per esempio una risorsa aggiunta a
// mano e quella che HACS si mette da sola) la casella comparirebbe DUE volte
// nella ricerca delle schede. Mi presento una volta sola.
window.customCards = window.customCards || [];
if (!window.customCards.some((x) => x && x.type === "casa-tile")) {
window.customCards.push({
  type: "casa-tile",
  name: "Casa · casella animata",
  description: "Casella con icona animata: si muove solo quando l'entità è attiva. Si configura a moduli, senza YAML.",
  preview: true,
  documentationURL: "https://www.home-assistant.io/dashboards/",
});
}

console.info("%c CASA-TILE %c v" + VERSIONE + " ", "background:#5ec8ff;color:#0b1220;font-weight:700",
             "background:#111a27;color:#eaf1fb");
