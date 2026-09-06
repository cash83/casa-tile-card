// -*- coding: utf-8 -*-
// I disegni delle icone e il catalogo MDI.

import { coloreTemperatura } from './colori.js';

export const ICONE = {
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
export function disegnoBatteria(perc, carica, scarica) {
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
// Il termometro col liquido che si ferma dove dice la temperatura, invece
// della colonnina che sale all'infinito: la colonna parte dal bulbo e si
// alza quanto serve, e prende il colore della scala (azzurro freddo,
// arancione caldo). Sotto ai -10 e sopra ai 60 resta attaccata agli estremi.
// L'indirizzo di una foto scritto a mano sbaglia sempre nello stesso modo:
// le barre rovesciate copiate da Windows ("\local\foto.jpg") e la barra
// davanti che manca. Invece di non far niente in silenzio, lo raddrizzo.
export function indirizzoFoto(x) {
  let v = String(x || "").trim().split("\\").join("/");
  if (!v) return "";
  if (/^(https?:|data:|\/)/.test(v)) return v;
  return "/" + v.replace(/^\/+/, "");
}

export function disegnoTermometro(gradi) {
  const n = Number(gradi);
  if (!isFinite(n)) return ICONE.termometro;
  // il vetro si vede da y=6 a y=42: il liquido deve riempire QUELLO, se no
  // a meta' scala sembra un terzo. Parte dentro al bulbo (y=46) e la sua
  // cima va da 40 (vuoto) a 8 (pieno).
  const q = Math.max(0.04, Math.min(1, (n + 10) / 70));
  const su = Math.round((40 - 32 * q) * 10) / 10;
  const alto = Math.round((46 - su) * 10) / 10;
  const tinta = coloreTemperatura(n) || "#ff5f5f";
  return '<g class="an glow alone"><circle cx="30" cy="46" r="16" fill="' + tinta
    + '" opacity=".2"/></g>'
    + '<rect x="24" y="6" width="12" height="36" rx="6" fill="#1b2433" '
    + 'stroke="#3e5570" stroke-width="1.6"/>'
    + '<circle cx="30" cy="46" r="10" fill="#1b2433" stroke="#3e5570" stroke-width="1.6"/>'
    + '<rect x="27" y="' + su + '" width="6" height="' + alto + '" rx="3" fill="'
    + tinta + '"/>'
    + '<circle cx="30" cy="46" r="6.5" fill="' + tinta + '"/>'
    + '<g stroke="#5f7189" stroke-width="1.6" stroke-linecap="round">'
    + '<path d="M40 14h5"/><path d="M40 22h5"/><path d="M40 30h5"/></g>';
}

export function disegnoTapparella(moto) {
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

// L'ASPIRAPOLVERE, con la sua base. Quando pulisce il robot sta fuori e
// gira; quando e' in carica sta dentro alla base, fermo.
// e' fuori a lavorare, o sta attaccato alla base? "docked" e' l'unico
// stato in cui sta davvero fermo dentro; il resto (spento, sconosciuto)
// non e' un lavoro, quindi sta fermo anche quello
export function aspiraFuori(st) {
  const q = st ? String(st.state) : "";
  return !!q && q !== "docked" && q !== "unavailable"
    && q !== "unknown" && q !== "off";
}

export function disegnoAspira(fuori) {
  // l'ingombro non deve cambiare quando il robot esce: se no la casella
  // rimisura il riquadro e l'icona fa un saltino proprio mentre parte
  // l'animazione. Questo rettangolo non si vede e tiene ferma la misura.
  const fermo = '<rect x="3" y="4" width="57" height="55" '
    + 'fill="none" stroke="none"/>';
  // la sfumatura del disco se la porta dietro il disegno: nel disegno
  // vecchio non ci arrivo piu'
  const tinta = '<defs><radialGradient id="asp1" cx="42%" cy="34%" r="70%">'
    + '<stop offset="0" stop-color="#33475f"/>'
    + '<stop offset="1" stop-color="#16202e"/></radialGradient></defs>';
  // la base: la torre chiara con la finestra del serbatoio e il piano su
  // cui il robot ci sale
  const torre = '<rect x="6" y="4" width="22" height="41" rx="5" '
    + 'fill="#e6ebf2" stroke="#9fb0c4" stroke-width="1.6"/>'
    + '<rect x="10" y="13" width="14" height="12" rx="2.4" fill="#b9c5d4"/>'
    + '<rect x="3" y="43" width="28" height="6.5" rx="3" '
    + 'fill="#cfd8e4" stroke="#9fb0c4" stroke-width="1.4"/>';
  // il robot: disco, paraurti, la torretta con l'occhio e la spazzola
  const robot = '<circle cx="42" cy="44" r="15" fill="url(#asp1)" '
    + 'stroke="#41607f" stroke-width="2"/>'
    + '<path d="M27 42a15 15 0 0 1 30 0z" fill="#2c3d54"/>'
    + '<rect x="33.5" y="37" width="17" height="7.5" rx="2.6" fill="#101a27" '
    + 'stroke="#5ec8ff" stroke-width="1.3"/>'
    + '<circle cx="42" cy="40.8" r="1.8" fill="#9fe2ff"/>'
    + '<g class="an rotaspazzola">'
    + '<g stroke="#8ef0d8" stroke-width="2.2" stroke-linecap="round">'
    + '<path d="M42 50v-4.5"/><path d="M42 50v4.5"/>'
    + '<path d="M42 50h-4.5"/><path d="M42 50h4.5"/></g>'
    + '<circle cx="42" cy="50" r="2.4" fill="#8ef0d8"/></g>';
  // attaccato alla base: spostato sulla base e un filo piu' piccolo. Il
  // conto e' gia' fatto attorno al suo centro (42,44), lo stesso punto da
  // cui parte l'animazione: le due cose combaciano e non si vede scatto.
  if (!fuori) {
    return tinta + fermo + torre
      + '<g transform="translate(-15.44,4.92) scale(.82)" opacity=".95">'
      + robot + '</g>';
  }
  // fuori: scivola via dalla base una volta sola, poi va avanti e indietro
  return tinta + fermo + torre
    + '<g class="an aspiraesce"><g class="an aspiragira">'
    + robot + "</g></g>";
}

// nella tendina delle icone e ovunque si peschi il disegno "a nome", faccio
// vedere il robot fuori dalla base: e' quello che si riconosce a colpo
// d'occhio. La casella e il pop-up poi ci mettono lo stato vero.
ICONE.aspirapolvere = disegnoAspira(true);

// quanto della tapparella si vede giu': un numero solo, niente da ridisegnare
export function tagliaTapparella(svg, pos) {
  if (!svg) return;
  const taglio = svg.querySelector(".taglio");
  if (!taglio) return;
  const n = Number(pos);
  const p = isNaN(n) ? 0 : Math.max(0, Math.min(100, n));
  const chiuso = 40 * (100 - p) / 100;
  taglio.setAttribute("height", (chiuso + 1).toFixed(2));
}

// Che icona ci vuole per questa entita'? La card lo capisce da sola.
export function iconaAutomatica(eid, st) {
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
export const SINONIMI = {
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

export const MDI = {
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
  trasferisci: "M8,5V9H2V15H8V19L14,12M20,5V19H17V5H20Z",
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

export const MDI_PAROLE = {
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

export const MDI_TINTA = {
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
export let contaMdi = 0;
export function disegnoMdi(nome, tinta) {
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

export const NOMI_ICONE = Object.keys(ICONE);
// se un disegno nostro ha lo stesso nome, quello di Home Assistant non si
// mostra nel catalogo (verrebbe doppio): il nostro vince comunque
export const NOMI_MDI = Object.keys(MDI).filter((n) => !ICONE[n]);

// che icona ci vuole per il tempo che fa
export const ICONA_METEO = {
  sunny: "sole", "clear-night": "luna", partlycloudy: "sole_nuvole", cloudy: "nuvola",
  rainy: "pioggia", pouring: "pioggia", lightning: "temporale",
  "lightning-rainy": "temporale", snowy: "neve", "snowy-rainy": "neve", hail: "neve",
  fog: "nebbia", windy: "vento", "windy-variant": "vento", exceptional: "sole",
};
