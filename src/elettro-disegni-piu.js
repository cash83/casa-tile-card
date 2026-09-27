// Altri venti disegni per le schede elettrodomestico ed energia.
// Stanno in un file loro perche' elettro-comune.js era gia' lungo: li
// aggiunge a HERO_BUILDERS con un Object.assign, e da fuori non si vede
// nessuna differenza fra i primi e questi.
//
// Le regole, le stesse dei primi: tela 240x240, l'ombra in terra, il corpo
// in acciaio, la targa coi Watt (la scritta con class="dm-e-watt" e' quella
// che la scheda riscrive), e i pezzi che si muovono solo quando la scheda
// ha la classe is-run.

// ---------------------------------------------------------------- i pezzi
// che si ripetono in tutti. `id` e' il numero della scheda: serve perche'
// due schede sulla stessa plancia non si rubino i gradienti.
const ombra = (id) =>
  `<filter id="dmh-blur-${id}" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="5"/></filter>`;

const acciaio = (id) =>
  `<linearGradient id="dmh-steel-${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6f8fb"/><stop offset=".5" stop-color="#dde4ec"/><stop offset="1" stop-color="#aab6c5"/></linearGradient>`;

const piede = (id, cx = 120, cy = 214, rx = 56, ry = 9) =>
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#0f172a" opacity=".16" filter="url(#dmh-blur-${id})"/>`;

// La targa dei Watt: il rettangolino nero col numero azzurro e la W.
// `s` la rimpicciolisce quando deve stare in un posto stretto.
const targa = (cx, cy, s = 1) => {
  const w = 68 * s;
  const h = 26 * s;
  return `<rect x="${cx - w / 2}" y="${cy - h / 2}" width="${w}" height="${h}" rx="${8 * s}" fill="#061020" stroke="#38bdf8" stroke-opacity=".4" stroke-width="1.1"/>
    <text class="dm-e-watt" x="${cx - 8 * s}" y="${cy + 5.5 * s}" text-anchor="middle" font-size="${16 * s}" font-weight="900" fill="#38bdf8" font-family="Roboto, sans-serif">0</text>
    <text x="${cx + 18 * s}" y="${cy + 5.5 * s}" text-anchor="middle" font-size="${9 * s}" font-weight="800" fill="#7f9bb5" font-family="Roboto, sans-serif">W</text>`;
};

const tela = (id, dentro, altriDefs = "") =>
  `<svg width="100%" height="100%" viewBox="0 0 240 240" preserveAspectRatio="xMidYMid meet" role="img" aria-hidden="true">
    <defs>${ombra(id)}${acciaio(id)}${altriDefs}</defs>
    ${dentro}
  </svg>`;

// due sfumature calde/fredde che tornano spesso
const caldo = (id) =>
  `<radialGradient id="dmh-caldo-${id}" cx=".5" cy=".5" r=".7"><stop offset="0" stop-color="#fff7ed"/><stop offset=".45" stop-color="#fdba74"/><stop offset="1" stop-color="#b91c1c"/></radialGradient>`;
const freddo = (id) =>
  `<radialGradient id="dmh-freddo-${id}" cx=".5" cy=".35" r=".8"><stop offset="0" stop-color="#f0f9ff"/><stop offset=".5" stop-color="#bae6fd"/><stop offset="1" stop-color="#0e3a5c"/></radialGradient>`;

const led = (cx, cy, r = 3.2, colore = "#22c55e") =>
  `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${colore}" class="dmh-glow"/>`;

export const DISEGNI_PIU = {
  // La cucina intera, vista da davanti: la cappa, il piano cottura sul banco
  // e il frigorifero di fianco. Non e' un apparecchio, e' una linea - la usa
  // chi misura tutto il circuito della cucina con una pinza.
  cucina: (id) => tela(id, `
    ${piede(id, 118, 212, 92, 10)}
    <!-- il frigorifero -->
    <rect x="152" y="58" width="64" height="150" rx="13" fill="url(#dmh-steel-${id})" stroke="#8fa0b3" stroke-opacity=".55" stroke-width="1.5"/>
    <path d="M152 112h64" stroke="#8fa0b3" stroke-opacity=".7" stroke-width="2"/>
    <g fill="#8fa0b3">
      <rect x="158" y="82" width="5" height="22" rx="2.5"/><rect x="158" y="122" width="5" height="30" rx="2.5"/>
    </g>
    ${led(207, 68, 3)}
    <!-- la cappa -->
    <rect x="70" y="20" width="20" height="26" rx="6" fill="#c8d3e0" stroke="#8fa0b3" stroke-opacity=".5" stroke-width="1.2"/>
    <path d="M26 86 44 46h72l18 40z" fill="url(#dmh-steel-${id})" stroke="#8fa0b3" stroke-opacity=".5" stroke-width="1.4"/>
    <rect x="26" y="86" width="108" height="12" rx="5" fill="#c8d3e0" stroke="#8fa0b3" stroke-opacity=".5" stroke-width="1.1"/>
    <rect x="44" y="89" width="72" height="6" rx="3" fill="#fff4cf" opacity=".9" class="dmh-glow"/>
    <!-- il vapore che sale dal fuoco acceso -->
    <g fill="none" stroke="#dbe4ee" stroke-width="4.5" stroke-linecap="round">
      <path d="M58 118c-9-7 3-13-3-20" class="dmh-vapore"/>
      <path d="M72 114c-9-7 3-13-3-20" class="dmh-vapore dmh-vapore2"/>
    </g>
    <!-- il banco col piano cottura -->
    <rect x="18" y="126" width="124" height="11" rx="5" fill="#e6ecf4" stroke="#8fa0b3" stroke-opacity=".5" stroke-width="1.2"/>
    <ellipse cx="56" cy="126" rx="15" ry="5.4" fill="url(#dmh-caldo-${id})" class="dmh-glow"/>
    <ellipse cx="56" cy="126" rx="15" ry="5.4" fill="none" stroke="#f97316" stroke-opacity=".8" stroke-width="1.6"/>
    <ellipse cx="96" cy="126" rx="13" ry="4.6" fill="#1d2739" opacity=".85"/>
    <!-- i mobili sotto -->
    <rect x="22" y="137" width="118" height="71" rx="9" fill="url(#dmh-steel-${id})" stroke="#8fa0b3" stroke-opacity=".55" stroke-width="1.5"/>
    <path d="M82 137v71" stroke="#8fa0b3" stroke-opacity=".5" stroke-width="1.6"/>
    <g fill="#9fadbc">
      <rect x="66" y="150" width="7" height="22" rx="3.5"/><rect x="91" y="150" width="7" height="22" rx="3.5"/>
    </g>
    ${targa(80, 66, 0.78)}
  `, caldo(id)),

  // Piano cottura a induzione, visto da sopra: il vetro nero, le quattro
  // zone e i tastini. La zona davanti a sinistra si accende.
  piano_cottura: (id) => tela(id, `
    ${piede(id, 120, 216, 74, 10)}
    <rect x="30" y="40" width="180" height="156" rx="16" fill="#0b1220" stroke="#8fa0b3" stroke-opacity=".45" stroke-width="1.5"/>
    <rect x="36" y="46" width="168" height="144" rx="12" fill="#101a2c"/>
    <g fill="none" stroke="#3b4a63" stroke-width="2.2">
      <circle cx="82" cy="86" r="26"/><circle cx="158" cy="88" r="21"/><circle cx="158" cy="146" r="26"/>
    </g>
    <circle cx="82" cy="146" r="30" fill="url(#dmh-caldo-${id})" opacity=".85" class="dmh-glow"/>
    <circle cx="82" cy="146" r="30" fill="none" stroke="#fda4af" stroke-opacity=".7" stroke-width="2.4"/>
    <g fill="none" stroke="#f97316" stroke-width="2" opacity=".8">
      <circle cx="82" cy="146" r="19"/><circle cx="82" cy="146" r="9"/>
    </g>
    <g fill="#233448">
      <rect x="52" y="174" width="14" height="6" rx="3"/><rect x="74" y="174" width="14" height="6" rx="3"/>
      <rect x="96" y="174" width="14" height="6" rx="3"/><rect x="118" y="174" width="14" height="6" rx="3"/>
    </g>
    ${led(48, 56)}
    ${targa(170, 177, 0.8)}
  `, caldo(id)),

  // Cappa aspirante: la cannuccia, il cappello e l'aria che sale.
  cappa: (id) => tela(id, `
    ${piede(id, 120, 210, 46, 8)}
    <rect x="100" y="16" width="40" height="52" rx="8" fill="url(#dmh-steel-${id})" stroke="#8fa0b3" stroke-opacity=".5" stroke-width="1.4"/>
    <path d="M30 116 58 66h124l28 50z" fill="url(#dmh-steel-${id})" stroke="#8fa0b3" stroke-opacity=".5" stroke-width="1.5"/>
    <rect x="30" y="116" width="180" height="18" rx="7" fill="#c8d3e0" stroke="#8fa0b3" stroke-opacity=".5" stroke-width="1.2"/>
    <rect x="62" y="122" width="116" height="7" rx="3.5" fill="#fff4cf" opacity=".9" class="dmh-glow"/>
    <g class="dmh-aria" fill="none" stroke="#38bdf8" stroke-width="5" stroke-linecap="round" opacity=".7">
      <path d="M78 186c14-10 14-22 0-32"/>
      <path d="M120 194c14-10 14-24 0-34"/>
      <path d="M162 186c14-10 14-22 0-32"/>
    </g>
    ${led(190, 125, 3)}
    ${targa(120, 92, 0.95)}
  `),

  // Macchina del caffe': il gruppo, la tazzina e il caffe' che cola.
  caffe: (id) => tela(id, `
    ${piede(id, 120, 218, 54, 9)}
    <rect x="58" y="26" width="124" height="180" rx="18" fill="url(#dmh-steel-${id})" stroke="#8fa0b3" stroke-opacity=".55" stroke-width="1.5"/>
    <rect x="70" y="36" width="100" height="30" rx="9" fill="#0b1526"/>
    ${targa(120, 51, 0.86)}
    <rect x="86" y="80" width="68" height="16" rx="6" fill="#9fadbc"/>
    <rect x="104" y="96" width="32" height="14" rx="4" fill="#78899b"/>
    <g fill="#5b3a1d">
      <rect x="112" y="110" width="4" height="26" rx="2" class="dmh-goccia"/>
      <rect x="124" y="110" width="4" height="26" rx="2" class="dmh-goccia dmh-goccia2"/>
    </g>
    <path d="M100 152h40v18a20 20 0 0 1-40 0z" fill="#ffffff" stroke="#c3cdda" stroke-width="1.4"/>
    <path d="M104 156h32v6a16 16 0 0 1-32 0z" fill="#6b4423"/>
    <path d="M140 156c12 0 12 16 0 16" fill="none" stroke="#c3cdda" stroke-width="3"/>
    <rect x="86" y="186" width="68" height="8" rx="4" fill="#9fadbc"/>
    ${led(72, 44)}
  `),

  // Bollitore: il beccuccio, il manico e il vapore.
  bollitore: (id) => tela(id, `
    ${piede(id, 120, 208, 50, 9)}
    <path d="M78 74h84l10 108a16 16 0 0 1-16 18H84a16 16 0 0 1-16-18z" fill="url(#dmh-steel-${id})" stroke="#8fa0b3" stroke-opacity=".55" stroke-width="1.5"/>
    <rect x="74" y="62" width="92" height="16" rx="7" fill="#c8d3e0" stroke="#8fa0b3" stroke-opacity=".5" stroke-width="1.2"/>
    <rect x="104" y="50" width="32" height="14" rx="6" fill="#9fadbc"/>
    <path d="M78 96 52 62" fill="none" stroke="#b9c5d2" stroke-width="10" stroke-linecap="round"/>
    <path d="M166 92c26 8 26 52 0 62" fill="none" stroke="#33415a" stroke-width="11" stroke-linecap="round"/>
    <rect x="86" y="118" width="20" height="62" rx="9" fill="url(#dmh-freddo-${id})" opacity=".75"/>
    <g fill="none" stroke="#e2e8f0" stroke-width="5" stroke-linecap="round">
      <path d="M46 46c-10-10 4-18-4-28" class="dmh-vapore"/>
      <path d="M62 38c-10-10 4-18-4-28" class="dmh-vapore dmh-vapore2"/>
    </g>
    <rect x="66" y="194" width="108" height="14" rx="7" fill="#9fadbc"/>
    ${led(94, 168, 3)}
    ${targa(146, 148, 0.8)}
  `, freddo(id)),

  // Tostapane: le due fette che spuntano e le resistenze accese.
  tostapane: (id) => tela(id, `
    ${piede(id, 120, 202, 66, 10)}
    <g class="dmh-glow" opacity=".8">
      <rect x="82" y="46" width="30" height="42" rx="6" fill="#e2b877" stroke="#b5813c" stroke-width="1.6"/>
      <rect x="126" y="52" width="30" height="36" rx="6" fill="#d8a460" stroke="#a9722f" stroke-width="1.6"/>
    </g>
    <rect x="44" y="86" width="152" height="100" rx="18" fill="url(#dmh-steel-${id})" stroke="#8fa0b3" stroke-opacity=".55" stroke-width="1.5"/>
    <g fill="#0b1526">
      <rect x="78" y="82" width="38" height="12" rx="5"/><rect x="124" y="82" width="38" height="12" rx="5"/>
    </g>
    <g stroke="#f97316" stroke-width="2.2" opacity=".85" class="dmh-glow">
      <path d="M82 88h30M128 88h30" fill="none"/>
    </g>
    <rect x="178" y="98" width="12" height="52" rx="6" fill="#78899b"/>
    <circle cx="184" cy="152" r="8" fill="#c8d3e0" stroke="#8fa0b3" stroke-width="1.4"/>
    <circle cx="62" cy="132" r="13" fill="#e8eef6" stroke="#8fa0b3" stroke-opacity=".6" stroke-width="1.6"/>
    <path d="M62 124v8" stroke="#33415a" stroke-width="2.6" stroke-linecap="round"/>
    <g fill="#9fadbc">
      <rect x="58" y="186" width="14" height="10" rx="4"/><rect x="168" y="186" width="14" height="10" rx="4"/>
    </g>
    ${targa(122, 148, 0.92)}
  `),

  // Friggitrice ad aria: il cassetto col manico e l'aria calda che gira.
  friggitrice: (id) => tela(id, `
    ${piede(id, 120, 216, 54, 9)}
    <path d="M70 34h100a14 14 0 0 1 14 14v158H56V48a14 14 0 0 1 14-14z" fill="url(#dmh-steel-${id})" stroke="#8fa0b3" stroke-opacity=".55" stroke-width="1.5"/>
    <rect x="70" y="44" width="100" height="34" rx="10" fill="#0b1526"/>
    ${targa(120, 60, 0.88)}
    <rect x="62" y="92" width="116" height="66" rx="12" fill="#12233a"/>
    <g class="dmh-aria" fill="none" stroke="#f97316" stroke-width="4.6" stroke-linecap="round" opacity=".8">
      <path d="M82 116c12-9 24-9 36 0s24 9 36 0"/>
      <path d="M82 138c12-9 24-9 36 0s24 9 36 0"/>
    </g>
    <rect x="56" y="162" width="128" height="44" rx="12" fill="#c8d3e0" stroke="#8fa0b3" stroke-opacity=".55" stroke-width="1.4"/>
    <rect x="86" y="176" width="68" height="12" rx="6" fill="#78899b"/>
    ${led(166, 88)}
  `),

  // Congelatore a pozzetto: il coperchio, la maniglia e il fiocco di neve.
  congelatore: (id) => tela(id, `
    ${piede(id, 120, 208, 72, 10)}
    <rect x="34" y="96" width="172" height="102" rx="12" fill="url(#dmh-steel-${id})" stroke="#8fa0b3" stroke-opacity=".55" stroke-width="1.5"/>
    <rect x="30" y="74" width="180" height="24" rx="10" fill="#eef2f7" stroke="#8fa0b3" stroke-opacity=".55" stroke-width="1.5"/>
    <rect x="96" y="100" width="48" height="9" rx="4.5" fill="#8fa0b3"/>
    <g stroke="#38bdf8" stroke-width="4" stroke-linecap="round" opacity=".9" class="dmh-glow">
      <path d="M68 150v-28M54 136h28M60 128l16 16M76 128l-16 16" fill="none"/>
    </g>
    <g fill="#bcd7ea" opacity=".75">
      <rect x="100" y="128" width="54" height="7" rx="3.5"/>
      <rect x="100" y="146" width="42" height="7" rx="3.5"/>
    </g>
    ${led(190, 86, 3)}
    ${targa(140, 178, 0.86)}
  `),

  // Termoventilatore: la griglia che gira e l'aria calda.
  termoventilatore: (id) => tela(id, `
    ${piede(id, 120, 212, 52, 9)}
    <rect x="52" y="78" width="136" height="118" rx="20" fill="url(#dmh-steel-${id})" stroke="#8fa0b3" stroke-opacity=".55" stroke-width="1.5"/>
    <circle cx="120" cy="130" r="44" fill="#0b1526"/>
    <circle cx="120" cy="130" r="38" fill="url(#dmh-caldo-${id})" opacity=".55" class="dmh-glow"/>
    <g class="dmh-gira" style="transform-origin:120px 130px" opacity=".9">
      <g transform="translate(120,130)">
        <path d="M0 0 C -8.3 -14.4, -7.7 -32.0, 1.9 -32.0 C 9.6 -30.7, 8.6 -13.4, 0 0 Z" fill="#fdba74" transform="rotate(0)"/>
        <path d="M0 0 C -8.3 -14.4, -7.7 -32.0, 1.9 -32.0 C 9.6 -30.7, 8.6 -13.4, 0 0 Z" fill="#fb923c" transform="rotate(120)"/>
        <path d="M0 0 C -8.3 -14.4, -7.7 -32.0, 1.9 -32.0 C 9.6 -30.7, 8.6 -13.4, 0 0 Z" fill="#fed7aa" transform="rotate(240)"/>
      </g>
    </g>
    <circle cx="120" cy="130" r="7" fill="#e8eef6" stroke="#8fa0b3" stroke-opacity=".6" stroke-width="1.3"/>
    <g class="dmh-aria" fill="none" stroke="#fb923c" stroke-width="4.4" stroke-linecap="round" opacity=".8">
      <path d="M84 62c12-9 24-9 36 0s24 9 36 0"/>
      <path d="M96 40c9-7 18-7 27 0"/>
    </g>
    <rect x="66" y="180" width="108" height="12" rx="6" fill="#9fadbc"/>
    ${led(170, 92)}
    ${targa(120, 208, 0.82)}
  `, caldo(id)),

  // Pompa di calore: il motore fuori, la ventola grande e le alette.
  pompa_calore: (id) => tela(id, `
    ${piede(id, 120, 210, 76, 10)}
    <rect x="26" y="58" width="188" height="136" rx="16" fill="url(#dmh-steel-${id})" stroke="#8fa0b3" stroke-opacity=".55" stroke-width="1.5"/>
    <rect x="34" y="66" width="106" height="120" rx="12" fill="#0e1a2c"/>
    <circle cx="87" cy="126" r="50" fill="#12233a"/>
    <g class="dmh-gira" style="transform-origin:87px 126px" opacity=".92">
      <g transform="translate(87,126)">
        <path d="M0 0 C -9.9 -17.1, -9.1 -38.0, 2.3 -38.0 C 11.4 -36.5, 10.3 -16.0, 0 0 Z" fill="#8fd5f5" transform="rotate(0)"/>
        <path d="M0 0 C -9.9 -17.1, -9.1 -38.0, 2.3 -38.0 C 11.4 -36.5, 10.3 -16.0, 0 0 Z" fill="#6cc6ee" transform="rotate(120)"/>
        <path d="M0 0 C -9.9 -17.1, -9.1 -38.0, 2.3 -38.0 C 11.4 -36.5, 10.3 -16.0, 0 0 Z" fill="#a6e0f8" transform="rotate(240)"/>
      </g>
    </g>
    <circle cx="87" cy="126" r="8" fill="#e8eef6" stroke="#8fa0b3" stroke-opacity=".6" stroke-width="1.3"/>
    <g stroke="#9fb4c9" stroke-width="2" opacity=".5" fill="none">
      <circle cx="87" cy="126" r="46"/><circle cx="87" cy="126" r="30"/>
    </g>
    <g fill="#c8d3e0">
      <rect x="150" y="76" width="56" height="7" rx="3.5"/><rect x="150" y="90" width="56" height="7" rx="3.5"/>
      <rect x="150" y="104" width="56" height="7" rx="3.5"/><rect x="150" y="118" width="56" height="7" rx="3.5"/>
    </g>
    ${targa(178, 152, 0.86)}
    ${led(200, 68)}
    <g fill="#9fadbc">
      <rect x="44" y="194" width="16" height="12" rx="4"/><rect x="180" y="194" width="16" height="12" rx="4"/>
    </g>
  `),

  // Stufa a pellet: il vetro con la fiamma e la tramoggia sopra.
  pellet: (id) => tela(id, `
    ${piede(id, 120, 214, 50, 9)}
    <rect x="66" y="34" width="108" height="172" rx="16" fill="url(#dmh-steel-${id})" stroke="#8fa0b3" stroke-opacity=".55" stroke-width="1.5"/>
    <rect x="80" y="42" width="80" height="18" rx="7" fill="#c8d3e0"/>
    <rect x="76" y="72" width="88" height="92" rx="10" fill="#0b1526"/>
    <rect x="80" y="76" width="80" height="84" rx="8" fill="url(#dmh-caldo-${id})" opacity=".8" class="dmh-glow"/>
    <rect x="80" y="76" width="80" height="84" rx="8" fill="#3a0d0d" opacity=".35"/>
    <path d="M120 150c-16 0-24-11-24-22 0-14 14-18 12-32 10 5 14 13 14 20 4-3 6-8 6-13 12 9 16 19 16 27 0 11-8 20-24 20z" fill="#fdba74" class="dmh-flicker"/>
    <path d="M120 150c-8 0-12-6-12-12 0-8 8-10 7-19 8 6 17 15 17 21 0 6-4 10-12 10z" fill="#fff7ed" opacity=".9" class="dmh-flicker"/>
    <g fill="#9fadbc" opacity=".9">
      <rect x="82" y="172" width="34" height="8" rx="4"/><rect x="124" y="172" width="34" height="8" rx="4"/>
    </g>
    <g fill="#78899b">
      <rect x="76" y="206" width="14" height="14" rx="4"/><rect x="150" y="206" width="14" height="14" rx="4"/>
    </g>
    ${led(158, 51)}
    ${targa(120, 190, 0.82)}
  `, caldo(id)),

  // Radiatore elettrico: gli elementi, il caldo dietro e la manopola.
  radiatore: (id) => tela(id, `
    ${piede(id, 120, 210, 66, 9)}
    <ellipse cx="120" cy="124" rx="70" ry="52" fill="url(#dmh-caldo-${id})" opacity=".16" class="dmh-glow"/>
    <rect x="44" y="66" width="152" height="12" rx="6" fill="#c8d3e0" stroke="#8fa0b3" stroke-opacity=".5" stroke-width="1.2"/>
    <rect x="44" y="172" width="152" height="12" rx="6" fill="#c8d3e0" stroke="#8fa0b3" stroke-opacity=".5" stroke-width="1.2"/>
    <g fill="url(#dmh-steel-${id})" stroke="#8fa0b3" stroke-opacity=".45" stroke-width="1.2">
      <rect x="50" y="72" width="17" height="106" rx="8"/><rect x="73" y="72" width="17" height="106" rx="8"/>
      <rect x="96" y="72" width="17" height="106" rx="8"/><rect x="119" y="72" width="17" height="106" rx="8"/>
      <rect x="142" y="72" width="17" height="106" rx="8"/><rect x="165" y="72" width="17" height="106" rx="8"/>
    </g>
    <circle cx="196" cy="150" r="14" fill="#e8eef6" stroke="#8fa0b3" stroke-opacity=".6" stroke-width="1.5"/>
    <path d="M196 141v9" stroke="#33415a" stroke-width="2.8" stroke-linecap="round"/>
    <g fill="#9fadbc">
      <rect x="54" y="184" width="14" height="14" rx="4"/><rect x="164" y="184" width="14" height="14" rx="4"/>
    </g>
    ${led(50, 60)}
    ${targa(120, 212, 0.84)}
  `, caldo(id)),

  // Scaldasalviette: i tubi, l'asciugamano appoggiato e il calduccio.
  scaldasalviette: (id) => tela(id, `
    ${piede(id, 120, 214, 44, 8)}
    <ellipse cx="120" cy="116" rx="56" ry="64" fill="url(#dmh-caldo-${id})" opacity=".14" class="dmh-glow"/>
    <g fill="url(#dmh-steel-${id})" stroke="#8fa0b3" stroke-opacity=".5" stroke-width="1.3">
      <rect x="70" y="26" width="14" height="178" rx="7"/><rect x="156" y="26" width="14" height="178" rx="7"/>
      <rect x="70" y="42" width="100" height="12" rx="6"/><rect x="70" y="72" width="100" height="12" rx="6"/>
      <rect x="70" y="132" width="100" height="12" rx="6"/><rect x="70" y="162" width="100" height="12" rx="6"/>
    </g>
    <path d="M78 98h84v12h-84z" fill="#c8d3e0" stroke="#8fa0b3" stroke-opacity=".5" stroke-width="1.3"/>
    <path d="M96 104h52v54a8 8 0 0 1-8 8h-36a8 8 0 0 1-8-8z" fill="#bae6fd" stroke="#7dd3fc" stroke-width="1.4"/>
    <g stroke="#7dd3fc" stroke-width="2" opacity=".8" fill="none">
      <path d="M96 122h52M96 138h52"/>
    </g>
    <g fill="#9fadbc">
      <rect x="66" y="204" width="22" height="10" rx="5"/><rect x="152" y="204" width="22" height="10" rx="5"/>
    </g>
    ${led(184, 36)}
    ${targa(120, 224, 0.8)}
  `, caldo(id)),

  // Robot aspirapolvere, visto da sopra: il paraurti, la torretta e la
  // spazzola che gira.
  robot: (id) => tela(id, `
    ${piede(id, 120, 202, 66, 10)}
    <circle cx="120" cy="116" r="76" fill="url(#dmh-steel-${id})" stroke="#8fa0b3" stroke-opacity=".55" stroke-width="1.6"/>
    <path d="M44 116a76 76 0 0 1 152 0z" fill="#e6ecf4" opacity=".7"/>
    <path d="M44 116a76 76 0 0 1 152 0" fill="none" stroke="#8fa0b3" stroke-opacity=".5" stroke-width="2"/>
    <circle cx="120" cy="116" r="60" fill="none" stroke="#c3cdda" stroke-width="1.6"/>
    <g class="dmh-gira dmh-gira-piano" style="transform-origin:120px 116px" fill="none" stroke="#8fa0b3" stroke-width="4" stroke-linecap="round" opacity=".8">
      <path d="M120 74v-14M120 158v14M78 116h-14M162 116h14"/>
    </g>
    <circle cx="120" cy="86" r="17" fill="#0b1526"/>
    <circle cx="120" cy="86" r="11" fill="#12233a" stroke="#38bdf8" stroke-opacity=".5" stroke-width="1.6"/>
    ${led(120, 86, 4, "#38bdf8")}
    <rect x="86" y="126" width="68" height="24" rx="9" fill="#0b1526"/>
    ${targa(120, 138, 0.82)}
    <g fill="#9fadbc">
      <rect x="66" y="104" width="12" height="24" rx="6"/><rect x="162" y="104" width="12" height="24" rx="6"/>
    </g>
  `),

  // Asciugacapelli: la canna inclinata, il manico e l'aria.
  asciugacapelli: (id) => tela(id, `
    ${piede(id, 130, 212, 46, 8)}
    <g transform="rotate(-18 120 120)">
      <rect x="86" y="72" width="104" height="52" rx="26" fill="url(#dmh-steel-${id})" stroke="#8fa0b3" stroke-opacity=".55" stroke-width="1.5"/>
      <path d="M86 78h-16a8 8 0 0 0-8 8v24a8 8 0 0 0 8 8h16z" fill="#c8d3e0" stroke="#8fa0b3" stroke-opacity=".5" stroke-width="1.3"/>
      <rect x="182" y="78" width="12" height="40" rx="6" fill="#9fadbc"/>
      <path d="M124 124h40l-10 74a14 14 0 0 1-14 12h-2a14 14 0 0 1-14-12z" fill="url(#dmh-steel-${id})" stroke="#8fa0b3" stroke-opacity=".5" stroke-width="1.4"/>
      <rect x="130" y="146" width="28" height="10" rx="5" fill="#78899b"/>
      <rect x="130" y="162" width="28" height="10" rx="5" fill="#78899b"/>
      ${led(172, 84)}
    </g>
    <g class="dmh-aria" fill="none" stroke="#fb923c" stroke-width="4.6" stroke-linecap="round" opacity=".8">
      <path d="M44 66c-12 8-12 18 0 26"/>
      <path d="M26 54c-12 10-12 24 0 34"/>
    </g>
    ${targa(168, 200, 0.82)}
  `),

  // Ferro da stiro di fianco: la punta a sinistra, il serbatoio, il manico
  // a D e il vapore che esce davanti.
  ferro: (id) => tela(id, `
    ${piede(id, 122, 208, 74, 9)}
    <path d="M26 182c0-16 14-28 34-31l122-18c16-2 32 10 32 26v15a8 8 0 0 1-8 8H34a8 8 0 0 1-8-8z" fill="url(#dmh-steel-${id})" stroke="#8fa0b3" stroke-opacity=".55" stroke-width="1.5"/>
    <path d="M34 190h176v6a8 8 0 0 1-8 8H42a8 8 0 0 1-8-8z" fill="#78899b"/>
    <rect x="84" y="158" width="56" height="20" rx="8" fill="#bae6fd" opacity=".9"/>
    <path d="M84 168h56" stroke="#7dd3fc" stroke-width="2" opacity=".8"/>
    <path d="M80 150C80 110 104 94 134 94s52 18 52 46" fill="none" stroke="#33415a" stroke-width="15" stroke-linecap="round"/>
    <rect x="104" y="120" width="56" height="9" rx="4.5" fill="#4b5b74"/>
    <circle cx="66" cy="172" r="7" fill="#e8eef6" stroke="#8fa0b3" stroke-opacity=".6" stroke-width="1.3"/>
    <g fill="none" stroke="#dbe4ee" stroke-width="5" stroke-linecap="round">
      <path d="M46 150c-12-6 2-16-8-24" class="dmh-vapore"/>
      <path d="M28 162c-12-6 2-16-8-24" class="dmh-vapore dmh-vapore2"/>
      <path d="M62 140c-12-6 2-16-8-24" class="dmh-vapore dmh-vapore3"/>
    </g>
    ${led(196, 160, 3)}
    ${targa(172, 172, 0.72)}
  `),

  // Pompa dell'acqua: il motore, la girante e i tubi.
  pompa: (id) => tela(id, `
    ${piede(id, 120, 206, 70, 10)}
    <rect x="34" y="92" width="112" height="72" rx="36" fill="url(#dmh-steel-${id})" stroke="#8fa0b3" stroke-opacity=".55" stroke-width="1.5"/>
    <g stroke="#8fa0b3" stroke-opacity=".45" stroke-width="2" fill="none">
      <path d="M56 96v64M72 94v68M88 94v68M104 94v68M120 96v64"/>
    </g>
    <circle cx="170" cy="128" r="38" fill="#c8d3e0" stroke="#8fa0b3" stroke-opacity=".55" stroke-width="1.5"/>
    <circle cx="170" cy="128" r="28" fill="#0e1a2c"/>
    <g class="dmh-gira" style="transform-origin:170px 128px" fill="none" stroke="#8fd5f5" stroke-width="4" stroke-linecap="round">
      <path d="M170 106c8 8 8 16 0 22M170 150c-8-8-8-16 0-22M148 128c8-8 16-8 22 0M192 128c-8 8-16 8-22 0"/>
    </g>
    <circle cx="170" cy="128" r="6" fill="#e8eef6"/>
    <rect x="160" y="52" width="20" height="42" rx="6" fill="#9fb4c9" stroke="#8fa0b3" stroke-opacity=".5" stroke-width="1.2"/>
    <rect x="150" y="44" width="40" height="12" rx="6" fill="#78899b"/>
    <rect x="160" y="162" width="20" height="34" rx="6" fill="#9fb4c9" stroke="#8fa0b3" stroke-opacity=".5" stroke-width="1.2"/>
    <rect x="150" y="192" width="40" height="12" rx="6" fill="#78899b"/>
    ${led(44, 100)}
    ${targa(84, 128, 0.88)}
  `),

  // Acquario: l'acqua, i pesci e le bollicine.
  acquario: (id) => tela(id, `
    ${piede(id, 120, 208, 76, 9)}
    <rect x="30" y="58" width="180" height="140" rx="10" fill="url(#dmh-freddo-${id})" opacity=".8"/>
    <rect x="30" y="58" width="180" height="140" rx="10" fill="none" stroke="#8fa0b3" stroke-opacity=".6" stroke-width="3"/>
    <rect x="26" y="44" width="188" height="18" rx="8" fill="url(#dmh-steel-${id})" stroke="#8fa0b3" stroke-opacity=".5" stroke-width="1.3"/>
    <rect x="52" y="58" width="136" height="6" rx="3" fill="#fff4cf" opacity=".85" class="dmh-glow"/>
    <g class="dmh-onda" fill="none" stroke="#e0f7ff" stroke-width="3" opacity=".7">
      <path d="M36 80c14-6 28 6 42 0s28 6 42 0 28 6 42 0 28 6 42 0"/>
    </g>
    <path d="M30 174h180v14a10 10 0 0 1-10 10H40a10 10 0 0 1-10-10z" fill="#c8b18a"/>
    <g fill="#38bdf8">
      <path d="M92 118c14-10 30-10 40 0-10 10-26 10-40 0z" opacity=".95"/>
      <path d="M92 118l-14-10v20z"/>
    </g>
    <g fill="#fb923c">
      <path d="M140 152c11-8 24-8 32 0-8 8-21 8-32 0z" opacity=".95"/>
      <path d="M140 152l-11-8v16z"/>
    </g>
    <g fill="#e0f7ff">
      <circle cx="64" cy="164" r="5" class="dmh-bolla"/>
      <circle cx="74" cy="168" r="3.6" class="dmh-bolla dmh-bolla2"/>
      <circle cx="58" cy="170" r="3" class="dmh-bolla dmh-bolla3"/>
    </g>
    <g fill="#22c55e" opacity=".8">
      <path d="M182 174c-8-16-4-32 2-42 2 16 6 28 10 42z"/>
      <path d="M166 174c-6-12-2-24 2-32 2 12 4 22 8 32z"/>
    </g>
    ${targa(120, 216, 0.86)}
  `, freddo(id)),

  // Stampante 3D: il telaio, il piano e l'ugello che sta stampando.
  stampante3d: (id) => tela(id, `
    ${piede(id, 120, 214, 70, 9)}
    <g fill="#9fb4c9" stroke="#8fa0b3" stroke-opacity=".5" stroke-width="1.2">
      <rect x="40" y="30" width="16" height="170" rx="6"/><rect x="184" y="30" width="16" height="170" rx="6"/>
      <rect x="40" y="30" width="160" height="14" rx="6"/>
    </g>
    <rect x="56" y="76" width="128" height="14" rx="6" fill="#c8d3e0" stroke="#8fa0b3" stroke-opacity=".5" stroke-width="1.2"/>
    <rect x="104" y="88" width="32" height="24" rx="6" fill="#33415a"/>
    <path d="M114 112h12l-6 12z" fill="#f97316" class="dmh-glow"/>
    <rect x="118" y="126" width="4" height="26" rx="2" fill="#38bdf8" class="dmh-goccia"/>
    <rect x="52" y="168" width="136" height="12" rx="5" fill="#0e1a2c"/>
    <rect x="56" y="164" width="128" height="6" rx="3" fill="#4b5b74"/>
    <g fill="#38bdf8" opacity=".9">
      <path d="M100 164h40v-22h-40z"/>
      <path d="M100 142h40l-20-12-20 12z" opacity=".7"/>
    </g>
    <circle cx="156" cy="58" r="15" fill="none" stroke="#c8d3e0" stroke-width="7"/>
    <circle cx="156" cy="58" r="4" fill="#9fb4c9"/>
    <rect x="46" y="186" width="60" height="18" rx="7" fill="#0b1526"/>
    ${targa(76, 195, 0.7)}
    ${led(168, 190)}
  `),

  // Console da gioco: il pad, i tasti e la lucina.
  console: (id) => tela(id, `
    ${piede(id, 120, 202, 70, 10)}
    <path d="M84 74h72c30 0 54 24 54 54 0 22-12 40-30 40-14 0-22-10-36-10H96c-14 0-22 10-36 10-18 0-30-18-30-40 0-30 24-54 54-54z" fill="url(#dmh-steel-${id})" stroke="#8fa0b3" stroke-opacity=".55" stroke-width="1.6"/>
    <g fill="#33415a">
      <rect x="62" y="110" width="34" height="11" rx="5"/><rect x="73.5" y="98.5" width="11" height="34" rx="5"/>
    </g>
    <g fill="#38bdf8">
      <circle cx="160" cy="100" r="8"/><circle cx="180" cy="116" r="8"/>
      <circle cx="160" cy="132" r="8"/><circle cx="140" cy="116" r="8"/>
    </g>
    <circle cx="100" cy="150" r="14" fill="#0e1a2c" stroke="#8fa0b3" stroke-opacity=".5" stroke-width="1.4"/>
    <circle cx="100" cy="150" r="8" fill="#4b5b74"/>
    <circle cx="142" cy="158" r="14" fill="#0e1a2c" stroke="#8fa0b3" stroke-opacity=".5" stroke-width="1.4"/>
    <circle cx="142" cy="158" r="8" fill="#4b5b74"/>
    <rect x="102" y="74" width="36" height="7" rx="3.5" fill="#38bdf8" opacity=".9" class="dmh-glow"/>
    <g fill="#9fadbc">
      <rect x="62" y="62" width="28" height="12" rx="6"/><rect x="150" y="62" width="28" height="12" rx="6"/>
    </g>
    ${targa(120, 196, 0.9)}
  `),

  // Colonnina di ricarica: il palo, lo schermo, il cavo e la spina.
  colonnina: (id) => tela(id, `
    ${piede(id, 108, 216, 50, 9)}
    <rect x="70" y="26" width="76" height="184" rx="20" fill="url(#dmh-steel-${id})" stroke="#8fa0b3" stroke-opacity=".55" stroke-width="1.5"/>
    <rect x="80" y="38" width="56" height="44" rx="10" fill="#0b1526"/>
    ${targa(108, 60, 0.8)}
    <path d="M104 96l-14 30h14l-6 24 22-34h-14l8-20z" fill="#38bdf8" class="dmh-glow"/>
    <rect x="82" y="156" width="52" height="40" rx="10" fill="#c8d3e0" stroke="#8fa0b3" stroke-opacity=".5" stroke-width="1.3"/>
    <rect x="94" y="168" width="28" height="7" rx="3.5" fill="#78899b"/>
    <path d="M146 130c40 6 52 34 46 62" fill="none" stroke="#33415a" stroke-width="9" stroke-linecap="round"/>
    <g transform="translate(184 188)">
      <rect x="-14" y="0" width="28" height="30" rx="9" fill="#0e1a2c" stroke="#8fa0b3" stroke-opacity=".5" stroke-width="1.3"/>
      <g fill="#38bdf8"><circle cx="-5" cy="12" r="3.4"/><circle cx="5" cy="12" r="3.4"/><circle cx="0" cy="21" r="3.4"/></g>
    </g>
    <rect x="62" y="204" width="92" height="14" rx="7" fill="#9fadbc"/>
    ${led(136, 36)}
  `),
};
