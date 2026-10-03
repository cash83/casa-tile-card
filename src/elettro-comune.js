import { laLocale } from './lingua.js';
import { DISEGNI_PIU } from './elettro-disegni-piu.js';
// Pezzi comuni delle schede energia/elettrodomestico: disegni, icone, stile.
// Nata dalle schede di Simonz82 (github.com/Simonz82/smart-home-cards),
// che le lascia libere: portata qui dentro il 18/09/2026 per non dipendere
// da un secondo file. Da qui in poi e' codice nostro.

const HERO_BUILDERS = {
  dishwasher: (id) => `<svg width="100%" height="100%" viewBox="0 0 240 240" preserveAspectRatio="xMidYMid meet" role="img" aria-hidden="true">
    <defs>
      <filter id="dmh-blur-${id}" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="5"/></filter>
      <linearGradient id="dmh-steel-${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6f8fb"/><stop offset=".5" stop-color="#dde4ec"/><stop offset="1" stop-color="#aab6c5"/></linearGradient>
      <radialGradient id="dmh-cool-${id}" cx=".5" cy=".42" r=".8"><stop offset="0" stop-color="#f0f9ff"/><stop offset=".5" stop-color="#bae6fd"/><stop offset="1" stop-color="#0e3a5c"/></radialGradient>
    </defs>
    <ellipse cx="120" cy="216" rx="70" ry="11" fill="#0f172a" opacity=".14" filter="url(#dmh-blur-${id})"/>
    <rect x="46" y="28" width="148" height="184" rx="14" fill="url(#dmh-steel-${id})" stroke="#8fa0b3" stroke-opacity=".55" stroke-width="1.5"/>
    <rect x="54" y="36" width="132" height="20" rx="7" fill="#eef2f7" stroke="#8fa0b3" stroke-opacity=".55" stroke-width="1.5"/>
    <rect x="100" y="41" width="40" height="11" rx="4.23" fill="#0b1526"/>
    <rect x="105" y="45" width="30" height="3" rx="1.5" fill="#155e75"/>
    <circle cx="66" cy="46" r="2.6" fill="#22c55e"/>
    <rect x="56" y="62" width="128" height="128" rx="9" fill="#0c1930"/>
    <rect x="60" y="66" width="120" height="120" rx="7" fill="url(#dmh-cool-${id})" opacity=".9"/>
    <rect x="60" y="66" width="120" height="120" rx="7" fill="#082033" opacity=".45"/>
    <g stroke="#9fd8f5" stroke-width="2.4" opacity=".8">
      <path d="M70 96h100M70 92c8-6 92-6 100 0" fill="none"/>
      <path d="M70 148h100M70 144c8-6 92-6 100 0" fill="none"/>
    </g>
    <g fill="#cfeefd" opacity=".85">
      <ellipse cx="94" cy="86" rx="12" ry="9"/><ellipse cx="120" cy="84" rx="11" ry="8"/><ellipse cx="145" cy="86" rx="12" ry="9"/>
      <ellipse cx="100" cy="138" rx="11" ry="8"/><ellipse cx="138" cy="138" rx="11" ry="8"/>
    </g>
    <g class="dmh-spin-spray">
      <line x1="94" y1="126" x2="146" y2="126" stroke="#e0f7ff" stroke-width="3" stroke-linecap="round" opacity=".9"/>
      <line x1="120" y1="108" x2="120" y2="144" stroke="#e0f7ff" stroke-width="3" stroke-linecap="round" opacity=".7"/>
      <circle cx="94" cy="126" r="2.2" fill="#8be2ff"/><circle cx="146" cy="126" r="2.2" fill="#8be2ff"/>
      <circle cx="120" cy="108" r="2.2" fill="#8be2ff"/><circle cx="120" cy="144" r="2.2" fill="#8be2ff"/>
    </g>
    <g stroke="#e0f7ff" stroke-linecap="round" fill="none">
      <path d="M120 178c-16-16-24-38-26-58" stroke-width="3.4" opacity=".9"/>
      <path d="M120 178c0-20 0-42 0-60" stroke-width="3.8"/>
      <path d="M120 178c16-16 24-38 26-58" stroke-width="3.4" opacity=".9"/>
      <path d="M120 178c-26-8-38-24-44-40" stroke-width="2.6" opacity=".7"/>
      <path d="M120 178c26-8 38-24 44-40" stroke-width="2.6" opacity=".7"/>
    </g>
    <circle cx="120" cy="178" r="6" fill="#d3e3ef"/>
    <rect x="46" y="196" width="148" height="16" rx="7" fill="#9fadbc"/>
    <rect x="100" y="199" width="40" height="7" rx="3.5" fill="#78899b"/>
  </svg>`,
  dryer: (id) => `<svg width="100%" height="100%" viewBox="0 0 240 240" preserveAspectRatio="xMidYMid meet" role="img" aria-hidden="true">
    <defs>
      <filter id="dmh-blur-${id}" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="5"/></filter>
      <linearGradient id="dmh-steel-${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6f8fb"/><stop offset=".5" stop-color="#dde4ec"/><stop offset="1" stop-color="#aab6c5"/></linearGradient>
      <radialGradient id="dmh-warm-${id}" cx=".5" cy=".42" r=".8"><stop offset="0" stop-color="#fff7ed"/><stop offset=".5" stop-color="#fed7aa"/><stop offset="1" stop-color="#7c2d12"/></radialGradient>
    </defs>
    <ellipse cx="120" cy="216" rx="70" ry="11" fill="#0f172a" opacity=".14" filter="url(#dmh-blur-${id})"/>
    <rect x="46" y="28" width="148" height="184" rx="14" fill="url(#dmh-steel-${id})" stroke="#8fa0b3" stroke-opacity=".55" stroke-width="1.5"/>
    <rect x="54" y="36" width="132" height="20" rx="7" fill="#eef2f7" stroke="#8fa0b3" stroke-opacity=".55" stroke-width="1.5"/>
    <rect x="100" y="41" width="40" height="11" rx="4.23" fill="#0b1526"/>
    <rect x="105" y="45" width="30" height="3" rx="1.5" fill="#c2410c"/>
    <circle cx="66" cy="46" r="2.6" fill="#22c55e"/>
    <circle cx="120" cy="132" r="66" fill="#0c1930"/>
    <circle cx="120" cy="132" r="58" fill="url(#dmh-warm-${id})" opacity=".9" class="dmh-glow"/>
    <circle cx="120" cy="132" r="58" fill="#4a1d0a" opacity=".35"/>
    <circle cx="120" cy="132" r="58" fill="none" stroke="#e7ecf2" stroke-width="5"/>
    <g fill="#ffedd5" opacity=".85" class="dmh-spin-drum">
      <ellipse cx="98" cy="112" rx="13" ry="9" transform="rotate(-18 98 112)"/>
      <ellipse cx="140" cy="120" rx="11" ry="8" transform="rotate(14 140 120)"/>
      <ellipse cx="108" cy="152" rx="12" ry="8" transform="rotate(24 108 152)"/>
      <ellipse cx="142" cy="150" rx="10" ry="7" transform="rotate(-10 142 150)"/>
    </g>
    <path d="M84 132a36 36 0 0 1 66-21" stroke="#ffd9a8" stroke-width="2.4" stroke-linecap="round" fill="none" opacity=".55"/>
    <rect x="46" y="196" width="148" height="16" rx="7" fill="#9fadbc"/>
    <rect x="100" y="199" width="40" height="7" rx="3.5" fill="#78899b"/>
  </svg>`,
  washer: (id) => `<svg width="100%" height="100%" viewBox="0 0 240 240" preserveAspectRatio="xMidYMid meet" role="img" aria-hidden="true">
    <defs>
      <filter id="dmh-blur-${id}" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="5"/></filter>
      <linearGradient id="dmh-steel-${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6f8fb"/><stop offset=".5" stop-color="#dde4ec"/><stop offset="1" stop-color="#aab6c5"/></linearGradient>
      <radialGradient id="dmh-cool-${id}" cx=".5" cy=".42" r=".8"><stop offset="0" stop-color="#f0f9ff"/><stop offset=".5" stop-color="#bae6fd"/><stop offset="1" stop-color="#0e3a5c"/></radialGradient>
    </defs>
    <ellipse cx="120" cy="216" rx="70" ry="11" fill="#0f172a" opacity=".14" filter="url(#dmh-blur-${id})"/>
    <rect x="46" y="28" width="148" height="184" rx="14" fill="url(#dmh-steel-${id})" stroke="#8fa0b3" stroke-opacity=".55" stroke-width="1.5"/>
    <rect x="54" y="36" width="132" height="20" rx="7" fill="#eef2f7" stroke="#8fa0b3" stroke-opacity=".55" stroke-width="1.5"/>
    <rect x="100" y="41" width="40" height="11" rx="4.23" fill="#0b1526"/>
    <rect x="105" y="45" width="30" height="3" rx="1.5" fill="#155e75"/>
    <circle cx="66" cy="46" r="2.6" fill="#22c55e"/>
    <circle cx="120" cy="132" r="66" fill="#0c1930"/>
    <circle cx="120" cy="132" r="58" fill="url(#dmh-cool-${id})" opacity=".9"/>
    <circle cx="120" cy="132" r="58" fill="#082033" opacity=".35"/>
    <circle cx="120" cy="132" r="58" fill="none" stroke="#e7ecf2" stroke-width="5"/>
    <g class="dmh-spin-drum">
      <path d="M92 148c10 14 46 14 56 0" stroke="#cfeefd" stroke-width="3" stroke-linecap="round" fill="none" opacity=".8"/>
      <path d="M88 132c12 10 52 10 64 0" stroke="#9fd8f5" stroke-width="2.4" stroke-linecap="round" fill="none" opacity=".7"/>
      <g fill="#cfeefd" opacity=".8">
        <circle cx="104" cy="110" r="4.5"/><circle cx="122" cy="102" r="3.4"/><circle cx="140" cy="112" r="5.2"/>
      </g>
    </g>
    <rect x="46" y="196" width="148" height="16" rx="7" fill="#9fadbc"/>
    <rect x="100" y="199" width="40" height="7" rx="3.5" fill="#78899b"/>
  </svg>`,
  oven: (id) => `<svg width="100%" height="100%" viewBox="0 0 240 240" preserveAspectRatio="xMidYMid meet" role="img" aria-hidden="true">
    <defs>
      <filter id="dmh-blur-${id}" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="5"/></filter>
      <linearGradient id="dmh-steel-${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6f8fb"/><stop offset=".5" stop-color="#dde4ec"/><stop offset="1" stop-color="#aab6c5"/></linearGradient>
      <radialGradient id="dmh-hot-${id}" cx=".5" cy=".42" r=".8"><stop offset="0" stop-color="#fff1e6"/><stop offset=".5" stop-color="#fca5a5"/><stop offset="1" stop-color="#7f1d1d"/></radialGradient>
    </defs>
    <ellipse cx="120" cy="216" rx="70" ry="11" fill="#0f172a" opacity=".14" filter="url(#dmh-blur-${id})"/>
    <rect x="46" y="28" width="148" height="184" rx="14" fill="url(#dmh-steel-${id})" stroke="#8fa0b3" stroke-opacity=".55" stroke-width="1.5"/>
    <rect x="54" y="36" width="132" height="20" rx="7" fill="#eef2f7" stroke="#8fa0b3" stroke-opacity=".55" stroke-width="1.5"/>
    <rect x="100" y="41" width="40" height="11" rx="4.23" fill="#0b1526"/>
    <rect x="105" y="45" width="30" height="3" rx="1.5" fill="#dc2626"/>
    <circle cx="66" cy="46" r="2.6" fill="#22c55e"/>
    <rect x="56" y="62" width="128" height="128" rx="9" fill="#0c1930"/>
    <rect x="60" y="66" width="120" height="120" rx="7" fill="url(#dmh-hot-${id})" opacity=".9" class="dmh-glow"/>
    <rect x="60" y="66" width="120" height="120" rx="7" fill="#3a0d0d" opacity=".4"/>
    <g stroke="#fecaca" stroke-width="2.6" opacity=".85">
      <path d="M68 100h104M68 154h104" fill="none"/>
    </g>
    <g stroke="#fee2e2" stroke-width="2" opacity=".55">
      <path d="M76 90c8 4 8 12 0 16M92 90c8 4 8 12 0 16M108 90c8 4 8 12 0 16M124 90c8 4 8 12 0 16M140 90c8 4 8 12 0 16M156 90c8 4 8 12 0 16" fill="none"/>
    </g>
    <g class="dmh-spin-spit">
      <line x1="70" y1="126" x2="170" y2="126" stroke="#7f1d1d" stroke-width="2" opacity=".6"/>
      <ellipse cx="120" cy="126" rx="24" ry="15" fill="#b45309"/>
      <ellipse cx="120" cy="126" rx="24" ry="15" fill="#78350f" opacity=".35"/>
      <circle cx="105" cy="121" r="2.6" fill="#92400e"/>
      <circle cx="135" cy="130" r="2.2" fill="#92400e"/>
    </g>
    <rect x="46" y="196" width="148" height="16" rx="7" fill="#9fadbc"/>
    <rect x="100" y="199" width="40" height="7" rx="3.5" fill="#78899b"/>
  </svg>`,
  tv: (id) => `<svg width="100%" height="100%" viewBox="0 0 240 240" preserveAspectRatio="xMidYMid meet" role="img" aria-hidden="true">
    <defs>
      <filter id="dmh-blur-${id}" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="5"/></filter>
      <radialGradient id="dmh-screen-${id}" cx=".5" cy=".4" r=".85"><stop offset="0" stop-color="#dbeafe"/><stop offset=".55" stop-color="#818cf8"/><stop offset="1" stop-color="#1e1b4b"/></radialGradient>
    </defs>
    <ellipse cx="120" cy="196" rx="66" ry="10" fill="#0f172a" opacity=".14" filter="url(#dmh-blur-${id})"/>
    <rect x="30" y="46" width="180" height="112" rx="10" fill="#111827" stroke="#334155" stroke-width="1.5"/>
    <rect x="40" y="55" width="160" height="94" rx="5" fill="url(#dmh-screen-${id})"/>
    <g stroke="#e0e7ff" stroke-linecap="round" opacity=".55">
      <path d="M60 118l26-22 20 14 30-26 30 20" stroke-width="3" fill="none"/>
    </g>
    <circle cx="120" cy="102" r="14" fill="#fef9c3" opacity=".85"/>
    <clipPath id="dmh-screen-clip-${id}"><rect x="40" y="55" width="160" height="94" rx="5"/></clipPath>
    <g class="dmh-flicker" clip-path="url(#dmh-screen-clip-${id})" opacity=".5">
      <rect x="40" y="55" width="34" height="94" fill="#f472b6"/>
      <rect x="82" y="55" width="34" height="94" fill="#facc15"/>
      <rect x="124" y="55" width="34" height="94" fill="#34d399"/>
      <rect x="166" y="55" width="34" height="94" fill="#60a5fa"/>
    </g>
    <rect x="112" y="158" width="16" height="20" fill="#1f2937"/>
    <rect x="76" y="178" width="88" height="10" rx="5" fill="#1f2937"/>
    <circle cx="196" cy="52" r="3" fill="#22c55e"/>
  </svg>`,
  luce: (id) => `<svg width="100%" height="100%" viewBox="0 0 240 240" preserveAspectRatio="xMidYMid meet" role="img" aria-hidden="true">
    <defs>
      <filter id="dmh-blur-${id}" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="5"/></filter>
      <filter id="dmh-luce-${id}" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="16"/></filter>
      <linearGradient id="dmh-vetro-${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff6d8"/><stop offset="1" stop-color="#ffd27a"/></linearGradient>
      <linearGradient id="dmh-met3-${id}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#9fadbc"/><stop offset=".35" stop-color="#e8eef6"/><stop offset="1" stop-color="#8fa0b3"/></linearGradient>
    </defs>
    <g transform="translate(0,4.0)">
    <ellipse cx="120" cy="214" rx="52" ry="9" fill="#0f172a" opacity=".16" filter="url(#dmh-blur-${id})"/>
    <ellipse class="dmh-glow" cx="120" cy="96" rx="62" ry="60" fill="#ffd98a" opacity=".5" filter="url(#dmh-luce-${id})"/>
    <path d="M120 24a52 52 0 0 1 32 93c-6 5-9 11-9 18h-46c0-7-3-13-9-18a52 52 0 0 1 32-93z" fill="url(#dmh-vetro-${id})"/>
    <path d="M100 132c-4-9-11-13-17-20a38 38 0 1 1 74 0c-6 7-13 11-17 20z" fill="#fffaf0" opacity=".45"/>
    <path d="M106 92l8 18 6-26 6 26 8-18" fill="none" stroke="#e0932f" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>
    <rect x="96" y="140" width="48" height="12" rx="4" fill="url(#dmh-met3-${id})"/>
    <rect x="99" y="153" width="42" height="9" rx="3" fill="#b9c5d2"/>
    <rect x="102" y="163" width="36" height="9" rx="3" fill="#9fadbc"/>
    <rect x="86" y="180" width="68" height="30" rx="9" fill="#061020" stroke="#38bdf8" stroke-opacity=".4" stroke-width="1.1"/>
    <text class="dm-e-watt" x="112" y="201" text-anchor="middle" font-size="18" font-weight="900" fill="#38bdf8" font-family="Roboto, sans-serif">0</text>
    <text x="140" y="201" text-anchor="middle" font-size="9.5" font-weight="800" fill="#7f9bb5" font-family="Roboto, sans-serif">W</text>
  </g>
  </svg>`,
  // Condizionatore: lo split a muro, con l'aria che esce quando lavora.
  condizionatore: (id) => `<svg width="100%" height="100%" viewBox="0 0 240 240" preserveAspectRatio="xMidYMid meet" role="img" aria-hidden="true">
    <defs>
      <filter id="dmh-blur-${id}" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="5"/></filter>
      <linearGradient id="dmh-split-${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".6" stop-color="#e6ecf4"/><stop offset="1" stop-color="#b9c5d2"/></linearGradient>
    </defs>
    <g transform="translate(0,-6.0)">
    <ellipse cx="120" cy="212" rx="60" ry="9" fill="#0f172a" opacity=".14" filter="url(#dmh-blur-${id})"/>
    <rect x="30" y="46" width="180" height="68" rx="18" fill="url(#dmh-split-${id})" stroke="#8fa0b3" stroke-opacity=".5" stroke-width="1.4"/>
    <rect x="44" y="96" width="152" height="12" rx="6" fill="#0b1526" opacity=".85"/>
    <circle cx="186" cy="62" r="3.4" fill="#22c55e" class="dmh-glow"/>
    <rect x="128" y="56" width="58" height="22" rx="7" fill="#061020"/>
    <text class="dm-e-watt" x="150" y="72" text-anchor="middle" font-size="15" font-weight="900" fill="#38bdf8" font-family="Roboto, sans-serif">0</text>
    <text x="173" y="72" text-anchor="middle" font-size="8.5" font-weight="800" fill="#7f9bb5" font-family="Roboto, sans-serif">W</text>
    <g class="dmh-aria" fill="none" stroke="#38bdf8" stroke-width="5" stroke-linecap="round" opacity=".75">
      <path d="M74 132c14 10 28 10 42 0"/>
      <path d="M86 156c12 9 24 9 36 0"/>
      <path d="M98 180c10 8 20 8 30 0"/>
    </g>
  </g>
  </svg>`,
  // Frigorifero: due porte, maniglie e il displayino.
  frigorifero: (id) => `<svg width="100%" height="100%" viewBox="0 0 240 240" preserveAspectRatio="xMidYMid meet" role="img" aria-hidden="true">
    <defs>
      <filter id="dmh-blur-${id}" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="5"/></filter>
      <linearGradient id="dmh-frigo-${id}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#cfd8e3"/><stop offset=".25" stop-color="#f4f7fb"/><stop offset="1" stop-color="#aab6c5"/></linearGradient>
    </defs>
    <g transform="translate(0,5.0)">
    <ellipse cx="120" cy="216" rx="56" ry="9" fill="#0f172a" opacity=".16" filter="url(#dmh-blur-${id})"/>
    <rect x="58" y="20" width="124" height="192" rx="16" fill="url(#dmh-frigo-${id})" stroke="#8fa0b3" stroke-opacity=".55" stroke-width="1.5"/>
    <path d="M58 92h124" stroke="#8fa0b3" stroke-opacity=".7" stroke-width="2.4"/>
    <rect x="150" y="40" width="7" height="34" rx="3.5" fill="#8fa0b3"/>
    <rect x="150" y="110" width="7" height="46" rx="3.5" fill="#8fa0b3"/>
    <rect x="72" y="36" width="54" height="24" rx="8" fill="#061020"/>
    <text class="dm-e-watt" x="92" y="53" text-anchor="middle" font-size="15" font-weight="900" fill="#38bdf8" font-family="Roboto, sans-serif">0</text>
    <text x="115" y="53" text-anchor="middle" font-size="8.5" font-weight="800" fill="#7f9bb5" font-family="Roboto, sans-serif">W</text>
    <g fill="#bcd7ea" opacity=".8">
      <rect x="74" y="112" width="60" height="7" rx="3.5"/>
      <rect x="74" y="130" width="46" height="7" rx="3.5"/>
      <rect x="74" y="148" width="54" height="7" rx="3.5"/>
    </g>
    <circle cx="70" cy="30" r="3.2" fill="#22c55e" class="dmh-glow"/>
  </g>
  </svg>`,
  // Ventilatore: le pale girano solo mentre lavora.
  ventilatore: (id) => `<svg width="100%" height="100%" viewBox="0 0 240 240" preserveAspectRatio="xMidYMid meet" role="img" aria-hidden="true">
    <defs>
      <filter id="dmh-blur-${id}" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="5"/></filter>
      <linearGradient id="dmh-vent-${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#eef3f8"/><stop offset="1" stop-color="#a9b6c4"/></linearGradient>
    </defs>
    <g transform="translate(0,-2.0)">
    <ellipse cx="120" cy="214" rx="52" ry="9" fill="#0f172a" opacity=".16" filter="url(#dmh-blur-${id})"/>
    <rect x="114" y="132" width="12" height="52" rx="6" fill="url(#dmh-vent-${id})"/>
    <ellipse cx="120" cy="188" rx="42" ry="11" fill="url(#dmh-vent-${id})"/>
    <circle cx="120" cy="98" r="62" fill="#0b1526" opacity=".08"/>
    <circle cx="120" cy="98" r="60" fill="none" stroke="#9fb4c9" stroke-opacity=".7" stroke-width="3"/>
    <circle cx="120" cy="98" r="44" fill="none" stroke="#9fb4c9" stroke-opacity=".45" stroke-width="2"/>
    <g class="dmh-spin-pala" opacity=".9">
      <g transform="translate(120,98)">
        <path d="M0 0 C -10.4 -18.0, -9.6 -40.0, 2.4 -40.0 C 12.0 -38.4, 10.8 -16.8, 0 0 Z" fill="#8fd5f5" transform="rotate(0)"/>
        <path d="M0 0 C -10.4 -18.0, -9.6 -40.0, 2.4 -40.0 C 12.0 -38.4, 10.8 -16.8, 0 0 Z" fill="#6cc6ee" transform="rotate(120)"/>
        <path d="M0 0 C -10.4 -18.0, -9.6 -40.0, 2.4 -40.0 C 12.0 -38.4, 10.8 -16.8, 0 0 Z" fill="#a6e0f8" transform="rotate(240)"/>
      </g>
    </g>
    <circle cx="120" cy="98" r="9" fill="#e8eef6" stroke="#8fa0b3" stroke-opacity=".6" stroke-width="1.4"/>
    <rect x="86" y="206" width="68" height="26" rx="8" fill="#061020" stroke="#38bdf8" stroke-opacity=".4" stroke-width="1.1"/>
    <text class="dm-e-watt" x="112" y="225" text-anchor="middle" font-size="16" font-weight="900" fill="#38bdf8" font-family="Roboto, sans-serif">0</text>
    <text x="138" y="225" text-anchor="middle" font-size="9" font-weight="800" fill="#7f9bb5" font-family="Roboto, sans-serif">W</text>
  </g>
  </svg>`,
  // Microonde: sportello, tastierino e il piatto che gira.
  microonde: (id) => `<svg width="100%" height="100%" viewBox="0 0 240 240" preserveAspectRatio="xMidYMid meet" role="img" aria-hidden="true">
    <defs>
      <filter id="dmh-blur-${id}" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="5"/></filter>
      <linearGradient id="dmh-micro-${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6f8fb"/><stop offset=".5" stop-color="#dde4ec"/><stop offset="1" stop-color="#aab6c5"/></linearGradient>
    </defs>
    <g transform="translate(0,-4.5)">
    <ellipse cx="120" cy="196" rx="76" ry="10" fill="#0f172a" opacity=".16" filter="url(#dmh-blur-${id})"/>
    <rect x="28" y="58" width="184" height="128" rx="16" fill="url(#dmh-micro-${id})" stroke="#8fa0b3" stroke-opacity=".55" stroke-width="1.5"/>
    <rect x="42" y="72" width="112" height="100" rx="10" fill="#0b1526"/>
    <rect x="50" y="80" width="96" height="84" rx="7" fill="#12233a"/>
    <circle cx="98" cy="122" r="30" fill="none" stroke="#38bdf8" stroke-opacity=".35" stroke-width="2"/>
    <ellipse cx="98" cy="126" rx="22" ry="8" fill="#8fd5f5" opacity=".55"/>
    <rect x="164" y="76" width="36" height="24" rx="7" fill="#061020"/>
    <text class="dm-e-watt" x="182" y="93" text-anchor="middle" font-size="14" font-weight="900" fill="#38bdf8" font-family="Roboto, sans-serif">0</text>
    <g fill="#9fadbc" opacity=".85">
      <rect x="164" y="110" width="14" height="10" rx="3"/><rect x="186" y="110" width="14" height="10" rx="3"/>
      <rect x="164" y="126" width="14" height="10" rx="3"/><rect x="186" y="126" width="14" height="10" rx="3"/>
      <rect x="164" y="142" width="36" height="12" rx="4" fill="#38bdf8" opacity=".9"/>
    </g>
    <circle cx="36" cy="66" r="3" fill="#22c55e" class="dmh-glow"/>
  </g>
  </svg>`,
  // Ciabatta: la multipresa con quattro prese e l'interruttore.
  ciabatta: (id) => `<svg width="100%" height="100%" viewBox="0 0 240 240" preserveAspectRatio="xMidYMid meet" role="img" aria-hidden="true">
    <defs>
      <filter id="dmh-blur-${id}" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="5"/></filter>
      <linearGradient id="dmh-cia-${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f7f9fc"/><stop offset=".55" stop-color="#e2e8f0"/><stop offset="1" stop-color="#a9b6c4"/></linearGradient>
    </defs>
    <g transform="translate(0,-3.5)">
    <ellipse cx="120" cy="188" rx="80" ry="10" fill="#0f172a" opacity=".16" filter="url(#dmh-blur-${id})"/>
    <rect x="28" y="64" width="184" height="112" rx="22" fill="url(#dmh-cia-${id})" stroke="#8fa0b3" stroke-opacity=".55" stroke-width="1.5"/>
    <g>
      <circle cx="72" cy="104" r="19" fill="#eef2f7" stroke="#9fb0c2" stroke-opacity=".6" stroke-width="1.4"/>
      <rect x="64" y="96" width="5" height="14" rx="2.5" fill="#16243a"/><rect x="75" y="96" width="5" height="14" rx="2.5" fill="#16243a"/>
      <circle cx="122" cy="104" r="19" fill="#eef2f7" stroke="#9fb0c2" stroke-opacity=".6" stroke-width="1.4"/>
      <rect x="114" y="96" width="5" height="14" rx="2.5" fill="#16243a"/><rect x="125" y="96" width="5" height="14" rx="2.5" fill="#16243a"/>
      <circle cx="172" cy="104" r="19" fill="#eef2f7" stroke="#9fb0c2" stroke-opacity=".6" stroke-width="1.4"/>
      <rect x="164" y="96" width="5" height="14" rx="2.5" fill="#16243a"/><rect x="175" y="96" width="5" height="14" rx="2.5" fill="#16243a"/>
    </g>
    <rect x="44" y="136" width="60" height="26" rx="8" fill="#061020" stroke="#38bdf8" stroke-opacity=".4" stroke-width="1.1"/>
    <text class="dm-e-watt" x="68" y="155" text-anchor="middle" font-size="16" font-weight="900" fill="#38bdf8" font-family="Roboto, sans-serif">0</text>
    <text x="92" y="155" text-anchor="middle" font-size="9" font-weight="800" fill="#7f9bb5" font-family="Roboto, sans-serif">W</text>
    <rect x="132" y="136" width="64" height="26" rx="9" fill="#dfe6ee" stroke="#9fb0c2" stroke-opacity=".6" stroke-width="1.2"/>
    <rect x="136" y="140" width="28" height="18" rx="6" fill="#22c55e" class="dmh-glow"/>
  </g>
  </svg>`,
  pc_torre: (id) => `<svg width="100%" height="100%" viewBox="0 0 240 240" preserveAspectRatio="xMidYMid meet" role="img" aria-hidden="true">
    <defs>
      <filter id="dmh-blur-${id}" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="5"/></filter>
      <linearGradient id="dmh-tor-${id}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2b3545"/><stop offset=".22" stop-color="#3d4a5e"/><stop offset="1" stop-color="#151c27"/></linearGradient>
    </defs>
    <g transform="translate(0,4.0)">
    <ellipse cx="120" cy="214" rx="58" ry="9" fill="#0f172a" opacity=".18" filter="url(#dmh-blur-${id})"/>
    <rect x="74" y="24" width="92" height="184" rx="12" fill="url(#dmh-tor-${id})" stroke="#0b1220" stroke-opacity=".6" stroke-width="1.2"/>
    <rect x="86" y="36" width="68" height="46" rx="6" fill="#0b1220"/>
    <g fill="#4b5c73" opacity=".8">
      <rect x="92" y="42" width="56" height="3" rx="1.5"/><rect x="92" y="50" width="56" height="3" rx="1.5"/>
      <rect x="92" y="58" width="56" height="3" rx="1.5"/><rect x="92" y="66" width="56" height="3" rx="1.5"/>
    </g>
    <circle cx="120" cy="96" r="9" fill="none" stroke="#38bdf8" stroke-opacity=".7" stroke-width="2.4" class="dmh-glow"/>
    <rect x="118.8" y="89" width="2.4" height="9" rx="1.2" fill="#38bdf8" class="dmh-glow"/>
    <rect x="86" y="118" width="68" height="40" rx="9" fill="#061020" stroke="#38bdf8" stroke-opacity=".4" stroke-width="1.1"/>
    <text class="dm-e-watt" x="120" y="141" text-anchor="middle" font-size="22" font-weight="900" fill="#38bdf8" font-family="Roboto, sans-serif">0</text>
    <text x="120" y="152" text-anchor="middle" font-size="8" font-weight="800" fill="#7f9bb5" letter-spacing="1.2" font-family="Roboto, sans-serif">WATT</text>
    <g fill="#8fa0b3" opacity=".55"><rect x="92" y="170" width="24" height="5" rx="2.5"/><rect x="124" y="170" width="24" height="5" rx="2.5"/></g>
    <g fill="#0b1220" opacity=".8"><rect x="82" y="208" width="14" height="7" rx="3"/><rect x="144" y="208" width="14" height="7" rx="3"/></g>
  </g>
  </svg>`,
  // Monitor da scrivania: i watt SONO quello che c'e' scritto sullo schermo.
  pc_monitor: (id) => `<svg width="100%" height="100%" viewBox="0 0 240 240" preserveAspectRatio="xMidYMid meet" role="img" aria-hidden="true">
    <defs>
      <filter id="dmh-blur-${id}" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="5"/></filter>
      <linearGradient id="dmh-sch-${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0d2137"/><stop offset="1" stop-color="#061020"/></linearGradient>
      <linearGradient id="dmh-met-${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e8eef6"/><stop offset="1" stop-color="#a9b6c4"/></linearGradient>
    </defs>
    <g transform="translate(0,-3.0)">
    <ellipse cx="120" cy="216" rx="68" ry="9" fill="#0f172a" opacity=".16" filter="url(#dmh-blur-${id})"/>
    <rect x="30" y="36" width="180" height="120" rx="12" fill="url(#dmh-met-${id})" stroke="#8fa0b3" stroke-opacity=".5" stroke-width="1.4"/>
    <rect x="40" y="46" width="160" height="94" rx="7" fill="url(#dmh-sch-${id})"/>
    <text class="dm-e-watt" x="120" y="102" text-anchor="middle" font-size="42" font-weight="900" fill="#38bdf8" font-family="Roboto, sans-serif">0</text>
    <text x="120" y="119" text-anchor="middle" font-size="10" font-weight="800" fill="#7f9bb5" letter-spacing="2" font-family="Roboto, sans-serif">WATT</text>
    <circle cx="120" cy="150" r="2.6" fill="#22c55e" class="dmh-glow"/>
    <path d="M104 156h32l6 30h-44z" fill="#c3ccd8"/>
    <rect x="86" y="186" width="68" height="7" rx="3.5" fill="#b3bfcd"/>
    <rect x="62" y="198" width="116" height="14" rx="5" fill="url(#dmh-met-${id})" stroke="#8fa0b3" stroke-opacity=".45" stroke-width="1"/>
    <rect x="70" y="203" width="100" height="2.4" rx="1.2" fill="#8fa0b3" opacity=".55"/>
  </g>
  </svg>`,
  // Lampada del comodino: quando lavora, si accende davvero.
  lampada: (id) => `<svg width="100%" height="100%" viewBox="0 0 240 240" preserveAspectRatio="xMidYMid meet" role="img" aria-hidden="true">
    <defs>
      <filter id="dmh-blur-${id}" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="5"/></filter>
      <filter id="dmh-luce-${id}" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="14"/></filter>
      <linearGradient id="dmh-pal-${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe9b8"/><stop offset="1" stop-color="#f0b352"/></linearGradient>
      <linearGradient id="dmh-met2-${id}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#b9c5d2"/><stop offset=".3" stop-color="#eef3f8"/><stop offset="1" stop-color="#93a2b3"/></linearGradient>
    </defs>
    <g transform="translate(0,-9.5)">
    <ellipse cx="120" cy="212" rx="56" ry="9" fill="#0f172a" opacity=".16" filter="url(#dmh-blur-${id})"/>
    <ellipse class="dmh-glow" cx="120" cy="120" rx="66" ry="56" fill="#ffd27a" opacity=".5" filter="url(#dmh-luce-${id})"/>
    <path d="M78 96l16-52h52l16 52z" fill="url(#dmh-pal-${id})" stroke="#e0a648" stroke-opacity=".6" stroke-width="1.2"/>
    <rect x="76" y="94" width="88" height="7" rx="3.5" fill="#e8b45e"/>
    <rect x="116" y="101" width="8" height="78" rx="4" fill="url(#dmh-met2-${id})"/>
    <ellipse cx="120" cy="182" rx="40" ry="10" fill="url(#dmh-met2-${id})"/>
    <ellipse cx="120" cy="178" rx="40" ry="10" fill="#dee6ef"/>
    <rect x="86" y="199" width="68" height="26" rx="8" fill="#061020" stroke="#38bdf8" stroke-opacity=".4" stroke-width="1.1"/>
    <text class="dm-e-watt" x="112" y="218" text-anchor="middle" font-size="17" font-weight="900" fill="#38bdf8" font-family="Roboto, sans-serif">0</text>
    <text x="140" y="218" text-anchor="middle" font-size="9" font-weight="800" fill="#7f9bb5" font-family="Roboto, sans-serif">W</text>
  </g>
  </svg>`,
  // Powerstation: la scatola con la maniglia, il display e le prese davanti.
  powerstation: (id) => `<svg width="100%" height="100%" viewBox="0 0 240 240" preserveAspectRatio="xMidYMid meet" role="img" aria-hidden="true">
    <defs>
      <filter id="dmh-blur-${id}" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="5"/></filter>
      <linearGradient id="dmh-box-${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3c4758"/><stop offset=".5" stop-color="#27303e"/><stop offset="1" stop-color="#151c27"/></linearGradient>
    </defs>
    <g transform="translate(0,-7)">
    <ellipse cx="120" cy="208" rx="74" ry="10" fill="#0f172a" opacity=".18" filter="url(#dmh-blur-${id})"/>
    <rect x="44" y="52" width="152" height="148" rx="18" fill="url(#dmh-box-${id})" stroke="#0b1220" stroke-opacity=".55" stroke-width="1.4"/>
    <rect x="58" y="66" width="124" height="52" rx="10" fill="#061020" stroke="#38bdf8" stroke-opacity=".45" stroke-width="1.2"/>
    <text class="dm-e-watt" x="120" y="98" text-anchor="middle" font-size="27" font-weight="900" fill="#38bdf8" font-family="Roboto, sans-serif">0</text>
    <text x="120" y="110" text-anchor="middle" font-size="8.5" font-weight="800" fill="#7f9bb5" letter-spacing="1.4" font-family="Roboto, sans-serif">WATT</text>
    <g fill="none" stroke="#9fadbc" stroke-opacity=".75" stroke-width="2.2">
      <circle cx="82" cy="150" r="17"/><circle cx="128" cy="150" r="17"/>
    </g>
    <g fill="#9fadbc" opacity=".85">
      <rect x="78" y="144" width="3.4" height="9" rx="1.7"/><rect x="85" y="144" width="3.4" height="9" rx="1.7"/>
      <rect x="124" y="144" width="3.4" height="9" rx="1.7"/><rect x="131" y="144" width="3.4" height="9" rx="1.7"/>
    </g>
    <rect x="154" y="140" width="28" height="9" rx="3" fill="#0b1220"/>
    <rect x="154" y="154" width="28" height="9" rx="3" fill="#0b1220"/>
    <circle cx="168" cy="176" r="3.4" fill="#22c55e" class="dmh-glow"/>
    <rect x="58" y="176" width="72" height="7" rx="3.5" fill="#0b1220"/>
    <rect x="58" y="176" width="46" height="7" rx="3.5" fill="#22c55e" opacity=".8"/>
  </g>
  </svg>`,
  presa: (id) => `<svg width="100%" height="100%" viewBox="0 0 240 240" preserveAspectRatio="xMidYMid meet" role="img" aria-hidden="true">
    <defs>
      <filter id="dmh-blur-${id}" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="5"/></filter>
      <linearGradient id="dmh-steel-${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fbfcfe"/><stop offset=".5" stop-color="#e4eaf1"/><stop offset="1" stop-color="#a9b6c4"/></linearGradient>
      <radialGradient id="dmh-faccia-${id}" cx=".38" cy=".32" r=".8"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#dce3ec"/></radialGradient>
    </defs>
    <g transform="translate(0,2.5)">
    <ellipse cx="120" cy="214" rx="66" ry="10" fill="#0f172a" opacity=".16" filter="url(#dmh-blur-${id})"/>
    <rect x="52" y="26" width="136" height="180" rx="32" fill="url(#dmh-steel-${id})" stroke="#8fa0b3" stroke-opacity=".55" stroke-width="1.5"/>
    <circle cx="120" cy="96" r="46" fill="url(#dmh-faccia-${id})" stroke="#9fb0c2" stroke-opacity=".5" stroke-width="1.2"/>
    <circle cx="120" cy="96" r="34" fill="none" stroke="#9fb0c2" stroke-opacity=".35" stroke-width="1"/>
    <rect x="101" y="80" width="9" height="24" rx="4.5" fill="#16243a"/>
    <rect x="130" y="80" width="9" height="24" rx="4.5" fill="#16243a"/>
    <rect x="113" y="118" width="14" height="6" rx="3" fill="#16243a" opacity=".65"/>
    <circle cx="166" cy="46" r="3.6" fill="#22c55e" class="dmh-glow"/>
    <rect x="70" y="152" width="100" height="40" rx="11" fill="#061020" stroke="#38bdf8" stroke-opacity=".45" stroke-width="1.2"/>
    <text class="dm-e-watt" x="120" y="176" text-anchor="middle" font-size="23" font-weight="900" fill="#38bdf8" font-family="Roboto, sans-serif">0</text>
    <text x="120" y="187" text-anchor="middle" font-size="8.5" font-weight="800" fill="#7f9bb5" letter-spacing="1.2" font-family="Roboto, sans-serif">WATT</text>
  </g>
  </svg>`,
  minipc: (id) => `<svg width="100%" height="100%" viewBox="0 0 240 240" preserveAspectRatio="xMidYMid meet" role="img" aria-hidden="true">
    <defs>
      <filter id="dmh-blur-${id}" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="5"/></filter>
      <linearGradient id="dmh-steel-${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f7f9fc"/><stop offset=".45" stop-color="#dde4ec"/><stop offset="1" stop-color="#9fadbd"/></linearGradient>
      <linearGradient id="dmh-cielo-${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4fc3f7"/><stop offset="1" stop-color="#0288d1"/></linearGradient>
    </defs>
    <g transform="translate(0,-13.0)">
    <ellipse cx="120" cy="206" rx="74" ry="11" fill="#0f172a" opacity=".16" filter="url(#dmh-blur-${id})"/>
    <path d="M40 86l26-22h108l26 22z" fill="#eef2f7" opacity=".9"/>
    <rect x="40" y="86" width="160" height="106" rx="16" fill="url(#dmh-steel-${id})" stroke="#8fa0b3" stroke-opacity=".55" stroke-width="1.5"/>
    <rect x="52" y="98" width="136" height="82" rx="11" fill="#0b1526"/>
    <circle cx="90" cy="139" r="27" fill="url(#dmh-cielo-${id})" opacity=".16"/>
    <g class="dmh-logo-ha" transform="translate(90 139) scale(1.9) translate(-12 -12)">
      <path d="M21.8,13H20V21H13V17.67L15.79,14.88L16.5,15C17.66,15 18.6,14.06 18.6,12.9C18.6,11.74 17.66,10.8 16.5,10.8A2.1,2.1 0 0,0 14.4,12.9L14.5,13.61L13,15.13V9.65C13.66,9.29 14.1,8.6 14.1,7.8A2.1,2.1 0 0,0 12,5.7A2.1,2.1 0 0,0 9.9,7.8C9.9,8.6 10.34,9.29 11,9.65V15.13L9.5,13.61L9.6,12.9A2.1,2.1 0 0,0 7.5,10.8A2.1,2.1 0 0,0 5.4,12.9A2.1,2.1 0 0,0 7.5,15L8.21,14.88L11,17.67V21H4V13H2.25C1.83,13 1.42,13 1.42,12.79C1.43,12.57 1.85,12.15 2.28,11.72L11,3C11.33,2.67 11.67,2.33 12,2.33C12.33,2.33 12.67,2.67 13,3L17,7V6H19V9L21.78,11.78C22.18,12.18 22.59,12.59 22.6,12.8C22.6,13 22.2,13 21.8,13M7.5,12A0.9,0.9 0 0,1 8.4,12.9A0.9,0.9 0 0,1 7.5,13.8A0.9,0.9 0 0,1 6.6,12.9A0.9,0.9 0 0,1 7.5,12M16.5,12C17,12 17.4,12.4 17.4,12.9C17.4,13.4 17,13.8 16.5,13.8A0.9,0.9 0 0,1 15.6,12.9A0.9,0.9 0 0,1 16.5,12M12,6.9C12.5,6.9 12.9,7.3 12.9,7.8C12.9,8.3 12.5,8.7 12,8.7C11.5,8.7 11.1,8.3 11.1,7.8C11.1,7.3 11.5,6.9 12,6.9Z" fill="url(#dmh-cielo-${id})"/>
    </g>
    <rect x="126" y="118" width="52" height="42" rx="9" fill="#061020" stroke="#38bdf8" stroke-opacity=".45" stroke-width="1.2"/>
    <text class="dm-e-watt" x="152" y="141" text-anchor="middle" font-size="22" font-weight="900" fill="#38bdf8" font-family="Roboto, sans-serif">0</text>
    <text x="152" y="153" text-anchor="middle" font-size="8.5" font-weight="800" fill="#7f9bb5" letter-spacing="1.1" font-family="Roboto, sans-serif">WATT</text>
    <circle cx="61" cy="79" r="3.2" fill="#22c55e" class="dmh-glow"/>
    <g fill="#8c9cad" opacity=".85">
      <rect x="126" y="168" width="18" height="7" rx="2"/>
      <rect x="150" y="168" width="18" height="7" rx="2"/>
      <rect x="60" y="168" width="52" height="4" rx="2" opacity=".6"/>
    </g>
    <g fill="#9fadbc">
      <rect x="54" y="192" width="16" height="9" rx="4"/>
      <rect x="170" y="192" width="16" height="9" rx="4"/>
    </g>
  </g>
  </svg>`,
  energy: (id) => `<svg width="100%" height="100%" viewBox="0 0 240 240" preserveAspectRatio="xMidYMid meet" role="img" aria-hidden="true">
    <defs>
      <filter id="dmh-blur-${id}" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="5"/></filter>
      <linearGradient id="dmh-steel-${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6f8fb"/><stop offset=".5" stop-color="#dde4ec"/><stop offset="1" stop-color="#aab6c5"/></linearGradient>
    </defs>
    <ellipse cx="120" cy="222" rx="70" ry="9" fill="#0f172a" opacity=".14" filter="url(#dmh-blur-${id})"/>
    <rect x="40" y="18" width="160" height="204" rx="14" fill="url(#dmh-steel-${id})" stroke="#8fa0b3" stroke-opacity=".55" stroke-width="1.5"/>
    <rect x="58" y="34" width="124" height="56" rx="8" fill="#0c1930"/>
    <text class="dm-e-watt" x="120" y="70" text-anchor="middle" font-size="30" font-weight="900" fill="#38bdf8" font-family="Roboto, sans-serif">0</text>
    <text x="120" y="84" text-anchor="middle" font-size="10" font-weight="800" fill="#94a3b8" letter-spacing="1" font-family="Roboto, sans-serif">WATT ISTANTANEI</text>
    <rect x="54" y="104" width="24" height="32" rx="3" fill="url(#dmh-steel-${id})" stroke="#8fa0b3" stroke-opacity=".5" stroke-width="1"/>
    <circle cx="66" cy="112" r="2.4" fill="#22c55e" class="dmh-flicker"/>
    <rect x="81" y="104" width="24" height="32" rx="3" fill="url(#dmh-steel-${id})" stroke="#8fa0b3" stroke-opacity=".5" stroke-width="1"/>
    <circle cx="93" cy="112" r="2.4" fill="#38bdf8" class="dmh-flicker" style="animation-delay:.15s"/>
    <rect x="108" y="104" width="24" height="32" rx="3" fill="url(#dmh-steel-${id})" stroke="#8fa0b3" stroke-opacity=".5" stroke-width="1"/>
    <circle cx="120" cy="112" r="2.4" fill="#38bdf8" class="dmh-flicker" style="animation-delay:.3s"/>
    <rect x="135" y="104" width="24" height="32" rx="3" fill="url(#dmh-steel-${id})" stroke="#8fa0b3" stroke-opacity=".5" stroke-width="1"/>
    <circle cx="147" cy="112" r="2.4" fill="#38bdf8" class="dmh-flicker" style="animation-delay:.45s"/>
    <rect x="162" y="104" width="24" height="32" rx="3" fill="url(#dmh-steel-${id})" stroke="#8fa0b3" stroke-opacity=".5" stroke-width="1"/>
    <circle cx="174" cy="112" r="2.4" fill="#38bdf8" class="dmh-flicker" style="animation-delay:.6s"/>
    <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z" fill="#38bdf8" opacity=".85" class="dmh-glow" transform="translate(100 150) scale(1.8)"/>
  </svg>`,
  dehumidifier: (id) => `<svg width="100%" height="100%" viewBox="0 0 240 240" preserveAspectRatio="xMidYMid meet" role="img" aria-hidden="true">
    <defs>
      <filter id="dmh-blur-${id}" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="5"/></filter>
      <linearGradient id="dmh-steel-${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6f8fb"/><stop offset=".5" stop-color="#dde4ec"/><stop offset="1" stop-color="#aab6c5"/></linearGradient>
      <linearGradient id="dmh-acqua-${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7dd3fc"/><stop offset="1" stop-color="#0284c7"/></linearGradient>
      <clipPath id="dmh-tanica-${id}"><rect x="74" y="150" width="92" height="48" rx="8"/></clipPath>
    </defs>
    <g transform="translate(0,3.5)">
    <ellipse cx="120" cy="222" rx="62" ry="10" fill="#0f172a" opacity=".14" filter="url(#dmh-blur-${id})"/>
    <rect x="56" y="16" width="128" height="200" rx="18" fill="url(#dmh-steel-${id})" stroke="#8fa0b3" stroke-opacity=".55" stroke-width="1.5"/>
    <rect x="68" y="26" width="104" height="18" rx="7" fill="#eef2f7" stroke="#8fa0b3" stroke-opacity=".5" stroke-width="1.2"/>
    <circle cx="80" cy="35" r="3.4" fill="#22c55e" class="dmh-glow"/>
    <rect x="96" y="30" width="64" height="10" rx="4" fill="#0b1526"/>
    <path d="M108 31.5c-2.2 3-3.4 4.4-3.4 6a3.4 3.4 0 0 0 6.8 0c0-1.6-1.2-3-3.4-6z" fill="#7dd3fc"/>
    <rect x="118" y="33.5" width="26" height="3" rx="1.5" fill="#38bdf8" opacity=".75"/>
    <rect x="118" y="38" width="16" height="2.4" rx="1.2" fill="#38bdf8" opacity=".45"/>
    <rect x="72" y="54" width="96" height="84" rx="12" fill="#0b1526"/>
    <g class="dmh-spin-fan" opacity=".55">
      <circle cx="120" cy="100" r="30" fill="none" stroke="#38bdf8" stroke-opacity=".35" stroke-width="2"/>
      <path d="M120 100 L120 72 A28 28 0 0 1 144 86 Z" fill="#38bdf8" opacity=".5"/>
      <path d="M120 100 L144 114 A28 28 0 0 1 96 114 Z" fill="#38bdf8" opacity=".5"/>
      <path d="M120 100 L96 86 A28 28 0 0 1 120 72 Z" fill="#38bdf8" opacity=".3"/>
    </g>
    <g stroke="#9fb4c9" stroke-opacity=".65" stroke-width="3" stroke-linecap="round">
      <path d="M84 66v60M96 62v68M108 60v72M132 60v72M144 62v68M156 66v60"/>
    </g>
    <circle cx="120" cy="100" r="5" fill="#cbd5e1" opacity=".9"/>
    <g fill="#7dd3fc">
      <ellipse class="dmh-goccia" cx="104" cy="140" rx="3.2" ry="4.4"/>
      <ellipse class="dmh-goccia dmh-goccia2" cx="120" cy="140" rx="3.2" ry="4.4"/>
      <ellipse class="dmh-goccia dmh-goccia3" cx="136" cy="140" rx="3.2" ry="4.4"/>
    </g>
    <rect x="74" y="150" width="92" height="48" rx="8" fill="#e8eef6" opacity=".55" stroke="#8fa0b3" stroke-opacity=".6" stroke-width="1.4"/>
    <g clip-path="url(#dmh-tanica-${id})">
      <rect class="dmh-onda" x="66" y="176" width="108" height="26" fill="url(#dmh-acqua-${id})" opacity=".9"/>
    </g>
    <rect x="74" y="150" width="92" height="48" rx="8" fill="none" stroke="#8fa0b3" stroke-opacity=".6" stroke-width="1.4"/>
    <rect x="104" y="156" width="32" height="5" rx="2.5" fill="#94a3b8" opacity=".8"/>
    <rect x="66" y="206" width="12" height="12" rx="4" fill="#9fadbc"/>
    <rect x="162" y="206" width="12" height="12" rx="4" fill="#9fadbc"/>
  </g>
  </svg>`,
  boiler: (id) => `<svg width="100%" height="100%" viewBox="0 0 240 240" preserveAspectRatio="xMidYMid meet" role="img" aria-hidden="true">
    <defs>
      <filter id="dmh-blur-${id}" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="5"/></filter>
      <linearGradient id="dmh-steel-${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6f8fb"/><stop offset=".5" stop-color="#dde4ec"/><stop offset="1" stop-color="#aab6c5"/></linearGradient>
      <radialGradient id="dmh-flame-${id}" cx=".5" cy=".55" r=".65"><stop offset="0" stop-color="#fff7ed"/><stop offset=".45" stop-color="#fb923c"/><stop offset="1" stop-color="#c2410c"/></radialGradient>
    </defs>
    <ellipse cx="120" cy="222" rx="66" ry="10" fill="#0f172a" opacity=".14" filter="url(#dmh-blur-${id})"/>
    <rect x="48" y="18" width="144" height="196" rx="16" fill="url(#dmh-steel-${id})" stroke="#8fa0b3" stroke-opacity=".55" stroke-width="1.5"/>
    <rect x="60" y="30" width="120" height="18" rx="6" fill="#eef2f7" stroke="#8fa0b3" stroke-opacity=".5" stroke-width="1.2"/>
    <circle cx="70" cy="39" r="3" fill="#22c55e" class="dmh-glow"/>
    <rect x="88" y="34" width="70" height="9" rx="3.5" fill="#0b1526"/>
    <circle cx="120" cy="104" r="46" fill="#eef2f7" stroke="#8fa0b3" stroke-opacity=".6" stroke-width="2"/>
    <circle cx="120" cy="104" r="38" fill="#0b1526"/>
    <path d="M120 104 L120 76" stroke="#38bdf8" stroke-width="3" stroke-linecap="round" transform="rotate(35 120 104)"/>
    <circle cx="120" cy="104" r="3" fill="#38bdf8"/>
    <g font-size="7" fill="#94a3b8" font-family="sans-serif" text-anchor="middle">
      <text x="120" y="74">bar</text>
    </g>
    <rect x="66" y="160" width="108" height="40" rx="9" fill="#0c1930"/>
    <rect x="74" y="168" width="92" height="24" rx="6" fill="url(#dmh-flame-${id})" opacity=".92" class="dmh-glow dmh-flicker"/>
    <path transform="translate(120,180) scale(.72) translate(-120,-186)" d="M120 172c-6 8-10 12-10 18a10 10 0 0 0 20 0c0-4-2-7-4-10 0 4-3 6-5 5-3-1-3-6-1-9-3 1-6 3-6 6z" fill="#fff7ed" opacity=".9"/>
    <rect x="60" y="204" width="10" height="16" rx="3" fill="#9fadbc"/>
    <rect x="170" y="204" width="10" height="16" rx="3" fill="#9fadbc"/>
    <rect x="52" y="216" width="136" height="10" rx="5" fill="#78899b"/>
  </svg>`,
};

// gli altri venti, che stanno nel file loro
Object.assign(HERO_BUILDERS, DISEGNI_PIU);


const CHIP_SVGS = {
  echo_dot:
    '<svg viewBox="0 0 96 96" width="27" height="27"><circle cx="48" cy="44" r="30" fill="#5b6875"/><path d="M18 44a30 30 0 0 1 60 0" fill="none" stroke="#f8fafc" stroke-opacity=".35" stroke-width="4"/><ellipse cx="48" cy="74" rx="29" ry="7" fill="none" stroke="#38bdf8" stroke-width="6"/></svg>',
  echo_show:
    '<svg viewBox="0 0 96 96" width="27" height="27"><path d="M14 80l8-22h52l7 22z" fill="#5b6875"/><rect x="12" y="14" width="66" height="48" rx="8" fill="#0f2942"/><rect x="18" y="20" width="54" height="36" rx="5" fill="#08111f"/><g fill="#38bdf8"><rect x="24" y="28" width="28" height="5" rx="2.5"/><rect x="24" y="38" width="40" height="4" rx="2" opacity=".7"/></g><rect x="24" y="74" width="48" height="5" rx="2.5" fill="#38bdf8"/></svg>',
  echo_studio:
    '<svg viewBox="0 0 96 96" width="27" height="27"><rect x="26" y="8" width="44" height="76" rx="21" fill="#5b6875"/><path d="M26 34a22 22 0 0 1 44 0" fill="none" stroke="#f8fafc" stroke-opacity=".3" stroke-width="3.5"/><circle cx="48" cy="46" r="14" fill="#12243c"/><circle cx="48" cy="46" r="6" fill="#4b5d72"/><ellipse cx="48" cy="78" rx="21" ry="5" fill="none" stroke="#38bdf8" stroke-width="5"/></svg>',
  annunci:
    '<svg viewBox="0 0 96 96" width="27" height="27"><rect x="14" y="14" width="44" height="68" rx="12" fill="#0f2942"/><circle cx="36" cy="38" r="13" fill="#f8fafc"/><circle cx="36" cy="38" r="5" fill="#0f2942"/><circle cx="36" cy="64" r="8" fill="#f8fafc"/><g fill="none" stroke="#38bdf8" stroke-width="6" stroke-linecap="round"><path d="M66 44a14 14 0 0 0 0-18"/><path d="M78 52a28 28 0 0 0 0-34"/></g></svg>',
  cucina:
    '<svg viewBox="0 0 96 96" width="27" height="27"><rect x="14" y="10" width="68" height="76" rx="9" fill="#0f2942"/><path d="M20 34 27 20h30l7 14z" fill="#f8fafc"/><rect x="22" y="34" width="40" height="4" rx="2" fill="#ffd27a"/><rect x="68" y="18" width="12" height="60" rx="4" fill="#f8fafc"/><path d="M68 46h12" stroke="#0f2942" stroke-width="2.4"/><rect x="18" y="52" width="44" height="6" rx="3" fill="#f8fafc"/><ellipse cx="30" cy="51" rx="8" ry="3" fill="#f97316"/><ellipse cx="50" cy="51" rx="7" ry="2.6" fill="#38bdf8"/><rect x="18" y="60" width="44" height="20" rx="4" fill="#f8fafc"/><path d="M40 60v20" stroke="#0f2942" stroke-width="2.2"/></svg>',
  dishwasher:
    '<svg viewBox="0 0 96 96" width="27" height="27"><rect x="14" y="10" width="68" height="76" rx="9" fill="#0f2942"/><rect x="20" y="16" width="56" height="14" rx="5" fill="#f8fafc"/><circle cx="28" cy="23" r="3" fill="#0ea5e9"/><rect x="20" y="36" width="56" height="41" rx="6" fill="#f8fafc"/><path fill="none" stroke="#0f2942" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="M27 49h42M30 64h36M33 49v15M44 49v15M55 49v15M66 49v15"/><path fill="#8be2ff" d="M23 67c9-6 16 5 25-2 8-6 14 4 25-1v10H23Z"/></svg>',
  dryer:
    '<svg viewBox="0 0 96 96" width="27" height="27"><rect x="14" y="10" width="68" height="76" rx="9" fill="#0f2942"/><rect x="20" y="16" width="56" height="14" rx="5" fill="#f8fafc"/><circle cx="28" cy="23" r="3" fill="#f97316"/><circle cx="48" cy="56" r="24" fill="#f8fafc"/><circle cx="48" cy="56" r="19" fill="#fed7aa"/><circle cx="48" cy="56" r="19" fill="none" stroke="#0f2942" stroke-width="3"/><path fill="none" stroke="#0f2942" stroke-width="2.6" stroke-linecap="round" d="M37 56a11 11 0 0 1 20-6.5"/></svg>',
  washer:
    '<svg viewBox="0 0 96 96" width="27" height="27"><rect x="14" y="10" width="68" height="76" rx="9" fill="#0f2942"/><rect x="20" y="16" width="56" height="14" rx="5" fill="#f8fafc"/><circle cx="28" cy="23" r="3" fill="#0ea5e9"/><circle cx="48" cy="56" r="24" fill="#f8fafc"/><circle cx="48" cy="56" r="19" fill="#bae6fd"/><circle cx="48" cy="56" r="19" fill="none" stroke="#0f2942" stroke-width="3"/><path fill="none" stroke="#0f2942" stroke-width="2.6" stroke-linecap="round" d="M39 58c4 6 14 6 18 0"/></svg>',
  oven:
    '<svg viewBox="0 0 96 96" width="27" height="27"><rect x="14" y="10" width="68" height="76" rx="9" fill="#0f2942"/><rect x="20" y="16" width="56" height="14" rx="5" fill="#f8fafc"/><circle cx="28" cy="23" r="3" fill="#ef4444"/><rect x="20" y="36" width="56" height="41" rx="6" fill="#f8fafc"/><path fill="none" stroke="#0f2942" stroke-width="3" stroke-linecap="round" d="M28 51h40M28 63h40"/></svg>',
  dehumidifier:
    '<svg viewBox="0 0 96 96" width="27" height="27"><rect x="22" y="8" width="52" height="80" rx="10" fill="#0f2942"/><rect x="28" y="14" width="40" height="10" rx="4" fill="#f8fafc"/><circle cx="34" cy="19" r="2.6" fill="#22c55e"/><rect x="28" y="30" width="40" height="30" rx="6" fill="#f8fafc"/><path fill="none" stroke="#0f2942" stroke-width="3" stroke-linecap="round" d="M35 34v22M43 33v24M53 33v24M61 34v22"/><path d="M48 64c-3 4-4.6 6-4.6 8.2A4.6 4.6 0 0 0 52.6 72c0-2.2-1.6-4.2-4.6-8z" fill="#8be2ff"/><rect x="28" y="70" width="40" height="12" rx="4" fill="#38bdf8"/></svg>',
  boiler:
    '<svg viewBox="0 0 96 96" width="27" height="27"><rect x="14" y="10" width="68" height="76" rx="9" fill="#0f2942"/><circle cx="48" cy="38" r="17" fill="#f8fafc"/><path d="M48 26c-5 7-9 10-9 16a9 9 0 0 0 18 0c0-3-1-6-3-8 0 3-2 5-4 4-2-1-2-5-1-7-3 1-4 3-4 3z" fill="#fb923c"/><rect x="28" y="62" width="40" height="10" rx="4" fill="#38bdf8"/></svg>',
  tv:
    '<svg viewBox="0 0 96 96" width="27" height="27"><rect x="10" y="20" width="76" height="48" rx="6" fill="#0f2942"/><rect x="16" y="26" width="64" height="36" rx="3" fill="#8be2ff"/><rect x="42" y="68" width="12" height="10" fill="#0f2942"/><rect x="30" y="78" width="36" height="6" rx="3" fill="#0f2942"/></svg>',
  luce:
    '<svg viewBox="0 0 96 96" width="27" height="27"><rect x="14" y="10" width="68" height="76" rx="9" fill="#0f2942"/><path d="M48 20a20 20 0 0 1 12 36c-2 2-3 4-3 6H39c0-2-1-4-3-6a20 20 0 0 1 12-36z" fill="#f8fafc"/><path d="M41 38l4 8 3-12 3 12 4-8" fill="none" stroke="#0f2942" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><rect x="40" y="64" width="16" height="5" rx="2.5" fill="#8be2ff"/><rect x="38" y="72" width="20" height="8" rx="3" fill="#38bdf8"/></svg>',
  condizionatore:
    '<svg viewBox="0 0 96 96" width="27" height="27"><g transform="translate(0,-2.9)"><rect x="8" y="20" width="80" height="34" rx="10" fill="#0f2942"/><rect x="15" y="27" width="66" height="12" rx="4" fill="#f8fafc"/><rect x="15" y="44" width="66" height="5" rx="2.5" fill="#8be2ff"/><g fill="none" stroke="#38bdf8" stroke-width="5" stroke-linecap="round"><path d="M28 64c7 6 14 6 21 0"/><path d="M36 78c6 5 12 5 18 0"/></g></g></svg>',
  frigorifero:
    '<svg viewBox="0 0 96 96" width="27" height="27"><rect x="22" y="8" width="52" height="80" rx="10" fill="#0f2942"/><rect x="28" y="14" width="40" height="22" rx="5" fill="#f8fafc"/><rect x="28" y="42" width="40" height="40" rx="5" fill="#f8fafc"/><rect x="58" y="20" width="4" height="10" rx="2" fill="#0f2942"/><rect x="58" y="48" width="4" height="14" rx="2" fill="#0f2942"/><rect x="33" y="66" width="22" height="5" rx="2.5" fill="#38bdf8"/></svg>',
  ventilatore:
    '<svg viewBox="0 0 96 96" width="27" height="27"><rect x="14" y="10" width="68" height="76" rx="9" fill="#0f2942"/><circle cx="48" cy="40" r="24" fill="#f8fafc"/><path d="M48 40c0-11 4-17 11-17 4 0 7 3 7 7 0 6-7 10-18 10z" fill="#38bdf8"/><path d="M48 40c9 6 11 13 8 19-2 4-7 4-10 2-5-3-4-11 2-21z" fill="#0ea5e9"/><path d="M48 40c-9-6-17-5-20 1-2 4 0 8 4 10 5 3 11-2 16-11z" fill="#8be2ff"/><circle cx="48" cy="40" r="4" fill="#0f2942"/><rect x="38" y="70" width="20" height="8" rx="3" fill="#38bdf8"/></svg>',
  microonde:
    '<svg viewBox="0 0 96 96" width="27" height="27"><rect x="8" y="22" width="80" height="52" rx="9" fill="#0f2942"/><rect x="15" y="29" width="46" height="38" rx="5" fill="#f8fafc"/><ellipse cx="38" cy="50" rx="14" ry="6" fill="#8be2ff"/><rect x="66" y="29" width="15" height="10" rx="3" fill="#38bdf8"/><g fill="#f8fafc"><rect x="66" y="44" width="6" height="5" rx="2"/><rect x="75" y="44" width="6" height="5" rx="2"/><rect x="66" y="53" width="6" height="5" rx="2"/><rect x="75" y="53" width="6" height="5" rx="2"/></g></svg>',
  ciabatta:
    '<svg viewBox="0 0 96 96" width="27" height="27"><rect x="8" y="30" width="80" height="36" rx="14" fill="#0f2942"/><circle cx="30" cy="48" r="9" fill="#f8fafc"/><rect x="26" y="44" width="3" height="8" rx="1.5" fill="#0f2942"/><rect x="31" y="44" width="3" height="8" rx="1.5" fill="#0f2942"/><circle cx="54" cy="48" r="9" fill="#f8fafc"/><rect x="50" y="44" width="3" height="8" rx="1.5" fill="#0f2942"/><rect x="55" y="44" width="3" height="8" rx="1.5" fill="#0f2942"/><rect x="68" y="40" width="14" height="16" rx="5" fill="#38bdf8"/></svg>',
  pc_torre:
    '<svg viewBox="0 0 96 96" width="27" height="27"><rect x="24" y="8" width="48" height="80" rx="10" fill="#0f2942"/><rect x="30" y="15" width="36" height="22" rx="5" fill="#f8fafc"/><path fill="none" stroke="#0f2942" stroke-width="3" stroke-linecap="round" d="M36 21h24M36 27h24M36 33h24"/><circle cx="48" cy="46" r="6" fill="none" stroke="#8be2ff" stroke-width="3"/><rect x="30" y="58" width="36" height="20" rx="5" fill="#38bdf8"/></svg>',
  pc_monitor:
    '<svg viewBox="0 0 96 96" width="27" height="27"><rect x="8" y="14" width="80" height="56" rx="10" fill="#0f2942"/><rect x="15" y="21" width="66" height="42" rx="5" fill="#f8fafc"/><rect x="23" y="31" width="50" height="8" rx="4" fill="#38bdf8"/><rect x="23" y="45" width="32" height="8" rx="4" fill="#8be2ff"/><rect x="40" y="70" width="16" height="8" fill="#0f2942"/><rect x="26" y="78" width="44" height="8" rx="4" fill="#0f2942"/></svg>',
  lampada:
    '<svg viewBox="0 0 96 96" width="27" height="27"><rect x="14" y="10" width="68" height="76" rx="9" fill="#0f2942"/><path d="M28 44 37 20h22l9 24z" fill="#f8fafc"/><rect x="26" y="44" width="44" height="6" rx="3" fill="#8be2ff"/><rect x="45" y="50" width="6" height="22" rx="3" fill="#f8fafc"/><rect x="30" y="72" width="36" height="8" rx="4" fill="#38bdf8"/></svg>',
  powerstation:
    '<svg viewBox="0 0 96 96" width="27" height="27"><g transform="translate(0,-5)"><rect x="14" y="22" width="68" height="64" rx="10" fill="#0f2942"/><rect x="21" y="29" width="54" height="22" rx="5" fill="#f8fafc"/><rect x="27" y="36" width="42" height="8" rx="4" fill="#38bdf8"/><circle cx="34" cy="66" r="9" fill="#f8fafc"/><circle cx="34" cy="66" r="4" fill="#0f2942"/><circle cx="58" cy="66" r="9" fill="#f8fafc"/><circle cx="58" cy="66" r="4" fill="#0f2942"/><rect x="70" y="60" width="8" height="12" rx="3" fill="#8be2ff"/></g></svg>',
  presa:
    '<svg viewBox="0 0 96 96" width="27" height="27"><rect x="18" y="8" width="60" height="80" rx="16" fill="#0f2942"/><circle cx="48" cy="38" r="21" fill="#f8fafc"/><rect x="39" y="30" width="6" height="15" rx="3" fill="#0f2942"/><rect x="51" y="30" width="6" height="15" rx="3" fill="#0f2942"/><rect x="42" y="50" width="12" height="4" rx="2" fill="#0f2942"/><rect x="28" y="66" width="40" height="16" rx="5" fill="#38bdf8"/></svg>',
  minipc:
    '<svg viewBox="0 0 96 96" width="27" height="27"><g transform="translate(0,-6.5)"><rect x="10" y="26" width="76" height="48" rx="9" fill="#0f2942"/><g transform="translate(48 50) scale(1.55) translate(-12 -12)"><path d="M21.8,13H20V21H13V17.67L15.79,14.88L16.5,15C17.66,15 18.6,14.06 18.6,12.9C18.6,11.74 17.66,10.8 16.5,10.8A2.1,2.1 0 0,0 14.4,12.9L14.5,13.61L13,15.13V9.65C13.66,9.29 14.1,8.6 14.1,7.8A2.1,2.1 0 0,0 12,5.7A2.1,2.1 0 0,0 9.9,7.8C9.9,8.6 10.34,9.29 11,9.65V15.13L9.5,13.61L9.6,12.9A2.1,2.1 0 0,0 7.5,10.8A2.1,2.1 0 0,0 5.4,12.9A2.1,2.1 0 0,0 7.5,15L8.21,14.88L11,17.67V21H4V13H2.25C1.83,13 1.42,13 1.42,12.79C1.43,12.57 1.85,12.15 2.28,11.72L11,3C11.33,2.67 11.67,2.33 12,2.33C12.33,2.33 12.67,2.67 13,3L17,7V6H19V9L21.78,11.78C22.18,12.18 22.59,12.59 22.6,12.8C22.6,13 22.2,13 21.8,13M7.5,12A0.9,0.9 0 0,1 8.4,12.9A0.9,0.9 0 0,1 7.5,13.8A0.9,0.9 0 0,1 6.6,12.9A0.9,0.9 0 0,1 7.5,12M16.5,12C17,12 17.4,12.4 17.4,12.9C17.4,13.4 17,13.8 16.5,13.8A0.9,0.9 0 0,1 15.6,12.9A0.9,0.9 0 0,1 16.5,12M12,6.9C12.5,6.9 12.9,7.3 12.9,7.8C12.9,8.3 12.5,8.7 12,8.7C11.5,8.7 11.1,8.3 11.1,7.8C11.1,7.3 11.5,6.9 12,6.9Z" fill="#38bdf8"/></g><rect x="22" y="78" width="52" height="5" rx="2.5" fill="#0f2942" opacity=".55"/></g></svg>',
  energy:
    '<svg viewBox="0 0 96 96" width="27" height="27"><rect x="14" y="10" width="68" height="76" rx="9" fill="#0f2942"/><path d="M52 22 30 54h14l-2 20 26-34H54l-2-18z" fill="#38bdf8"/></svg>',
};

const ICON_CHART =
  '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="5" y1="20" x2="5" y2="12"/><line x1="12" y1="20" x2="12" y2="5"/><line x1="19" y1="20" x2="19" y2="9"/></svg>';
const ICON_CLOSE =
  '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><line x1="5" y1="5" x2="19" y2="19"/><line x1="19" y1="5" x2="5" y2="19"/></svg>';
const ICON_BOLT =
  '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z"/></svg>';
const ICON_FLAG =
  '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 21V4"/><path d="M4 4h11l-2 4 2 4H4"/></svg>';
const ICON_TIMER =
  '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2"/><path d="M9 2h6"/></svg>';
const ICON_EURO =
  '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 6.5a6.5 6.5 0 1 0 0 11"/><path d="M5.5 10h9"/><path d="M5.5 14h8"/></svg>';
const ICON_TREND =
  '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17l6-6 4 4 8-8"/><path d="M15 6h6v6"/></svg>';

// Icone per le righe "gruppo" del dialog Impostazioni (stile vecchia card).

const WEEKDAY_FULL_IT = ["Domenica", "Luned\u00ec", "Marted\u00ec", "Mercoled\u00ec", "Gioved\u00ec", "Venerd\u00ec", "Sabato"];
const WEEKDAY_ABBR_IT = ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"];

const DEFAULT_STATE_MAP = {
  run: { mode: "running", label: "IN FUNZIONE" },
  delayedstart: { mode: "standby", label: "AVVIO RITARDATO" },
  pause: { mode: "standby", label: "IN PAUSA" },
  actionrequired: { mode: "standby", label: "AZIONE RICHIESTA" },
  finished: { mode: "off", label: "TERMINATO" },
  ready: { mode: "off", label: "PRONTA" },
  inactive: { mode: "off", label: "SPENTA" },
  error: { mode: "unavailable", label: "ERRORE" },
  aborting: { mode: "standby", label: "INTERRUZIONE" },
};

const STYLE = `
:host{display:block;--dm-blue:#0ea5e9;--dm-blue-deep:#0369a1;--dm-dim:var(--secondary-text-color,#64748b);--dm-card:var(--card-background-color,#ffffff);--dm-border:var(--divider-color,#e6ecf4);--dm-soft:rgba(148,163,184,.10);--dm-text:var(--primary-text-color,#0f172a)}
/* Chiaro o scuro per questa scheda soltanto. Senza attributo non si scrive
   niente e restano le variabili di Home Assistant, cioe' il suo tema. I colori
   sono quelli dei temi di serie di HA, cosi' una scheda forzata non stona
   accanto alle altre. */
:host([data-tema="chiaro"]){--dm-card:#ffffff;--dm-text:#0f172a;--dm-dim:#64748b;--dm-border:#e6ecf4}
:host([data-tema="scuro"]){--dm-card:#1c1c1c;--dm-text:#e1e1e1;--dm-dim:#9b9b9b;--dm-border:rgba(225,225,225,.12)}
:host([data-tema]){color:var(--dm-text)}
.dm-ap-card{position:relative;display:flex;flex-direction:column;border:1px solid var(--dm-border);border-radius:22px;background:var(--dm-card);box-shadow:0 12px 30px rgba(15,23,42,.06);overflow:hidden}
.dm-ap-card.is-run{border-color:rgba(34,197,94,.28)}
.dm-ap-card.has-alarm{border-color:rgba(239,68,68,.4)}
.dm-ap-top{display:flex;align-items:center;gap:7px;padding:12px 12px 9px}
/* l'icona in cima alla scheda: NUDA. Aveva dietro un riquadrino azzurrino,
   e si vedeva come un cerchietto dietro all'icona. La misura resta 34x34 per
   non spostare il titolo di fianco. */
.dm-ap-chip{width:34px;height:34px;flex:0 0 34px;display:grid;place-items:center}
.dm-ap-chip svg{width:27px;height:27px}
.dm-ap-headings{display:flex;flex-direction:column;min-width:0;flex:1;gap:1px}
.dm-ap-name{font-size:14.5px;font-weight:900;letter-spacing:-.2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--dm-text)}
.dm-ap-badge{display:inline-flex;align-items:center;gap:4px;flex:0 0 auto;padding:4px 7px;border-radius:999px;font-size:9.5px;font-weight:900;letter-spacing:.4px;text-transform:uppercase;white-space:nowrap}
.dm-ap-badge.run{background:#dcfce7;color:#15803d}
.dm-ap-badge.standby{background:#dbeafe;color:#2563eb}
.dm-ap-badge.off{background:#f1f5f9;color:#64748b}
.dm-ap-badge.unavailable{background:#fee2e2;color:#b91c1c}
[data-theme-dark] .dm-ap-badge.off,:host-context([data-theme="dark"]) .dm-ap-badge.off,:host([data-tema="scuro"]) .dm-ap-badge.off{background:rgba(148,163,184,.16);color:#94a3b8}
.dm-ap-dot{width:7px;height:7px;border-radius:50%;background:currentColor}
.dm-ap-tools{display:flex;gap:4px;flex:0 0 auto}
.dm-ap-tool{width:37px;height:37px;display:grid;place-items:center;border:1px solid var(--dm-border);border-radius:11px;background:var(--dm-card);color:var(--dm-dim);cursor:pointer}
.dm-ap-tool svg{width:19px;height:19px}
.dm-ap-tool:hover{border-color:#bae6fd;color:var(--dm-blue-deep)}
.dm-ap-prese{display:flex;flex-wrap:wrap;gap:6px;margin:0 12px 8px}
.dm-ap-presa{font:inherit;font-size:11.5px;font-weight:700;letter-spacing:.2px;cursor:pointer;
  display:inline-flex;align-items:center;gap:5px;
  padding:4px 10px;border-radius:999px;border:1px solid var(--divider-color);
  background:rgba(127,127,127,.10);color:var(--secondary-text-color);line-height:1.5}
.dm-ap-presa.acceso{color:#16a34a;border-color:#86efac;background:rgba(34,197,94,.14)}
.dm-ap-presa.assente{opacity:.45;cursor:default}
/* il tasto che sta chiedendo "sta lavorando: premi ancora" */
.dm-ap-presa.chiede{color:#b45309;border-color:#fcd34d;background:rgba(251,191,36,.18)}
.dm-ap-presa:active{transform:scale(.97)}
.dm-ap-presa svg{flex:0 0 auto}
.dm-ap-tool.acceso{color:#16a34a;border-color:#86efac;background:rgba(34,197,94,.12)}
.dm-ap-top-row{display:flex;align-items:stretch;gap:10px;margin:0 13px}
.dm-ap-hero{cursor:pointer;position:relative;flex:1 1 50%;min-width:0;display:grid;place-items:center;height:182px;margin:0;border-radius:18px;background:radial-gradient(120% 90% at 50% 8%,rgba(224,242,254,.65),rgba(241,245,249,.35) 60%,transparent);overflow:hidden}
.dm-ap-card.is-run .dm-ap-hero{background:radial-gradient(120% 90% at 50% 8%,rgba(186,230,253,.85),rgba(224,242,254,.35) 62%,transparent)}
.dm-ap-hero svg{width:100%;height:100%;display:block}
/* una foto tua al posto del disegno: riempie il riquadro come farebbe l'SVG */
.dm-ap-hero img{width:100%;height:100%;display:block;object-fit:contain}
.dm-ap-chip img{width:100%;height:100%;object-fit:contain;border-radius:7px}
/* spenta o non raggiungibile: sbiadisce il DISEGNO, non il riquadro.
   Prima il filtro stava sul riquadro e si portava via anche l'alone,
   cosi' la scheda spenta era un rettangolo grigio e piatto. */
.dm-ap-card.is-off .dm-ap-hero>svg,.dm-ap-card.is-unavailable .dm-ap-hero>svg{filter:grayscale(.55) opacity(.62)}
.dm-ap-card.is-standby .dm-ap-hero>svg{filter:saturate(.85)}
@keyframes dmh-spin{to{transform:rotate(360deg)}}
@keyframes dmh-glow{0%,100%{opacity:.55}50%{opacity:1}}
@keyframes dmh-flicker{0%,100%{opacity:.85}30%{opacity:.5}55%{opacity:1}80%{opacity:.6}}
.dmh-spin-drum,.dmh-spin-spray,.dmh-spin-spit{transform-box:view-box;transform-origin:120px 130px}
.dm-ap-card.is-run .dmh-spin-drum{animation:dmh-spin 2.6s linear infinite}
.dm-ap-card.is-run .dmh-spin-spray{animation:dmh-spin 1.3s linear infinite}
.dm-ap-card.is-run .dmh-spin-spit{animation:dmh-spin 3.4s linear infinite}
@keyframes dmh-drip{0%{opacity:0;transform:translateY(0)}12%{opacity:.95}80%{opacity:.95}100%{opacity:0;transform:translateY(38px)}}
@keyframes dmh-onda{0%,100%{transform:translateX(-4px)}50%{transform:translateX(4px)}}
.dmh-spin-fan{transform-box:view-box;transform-origin:120px 100px}
.dmh-goccia{opacity:0}
.dm-ap-card.is-run .dmh-spin-fan{animation:dmh-spin 1.6s linear infinite}
.dmh-spin-pala{transform-box:view-box;transform-origin:120px 98px}
.dm-ap-card.is-run .dmh-spin-pala{animation:dmh-spin 1.1s linear infinite}
.dm-ap-card.is-run .dmh-aria{animation:dmh-glow 2.2s ease-in-out infinite}
.dm-ap-card.is-run .dmh-goccia{animation:dmh-drip 1.9s linear infinite}
.dm-ap-card.is-run .dmh-logo-ha{animation:dmh-glow 2.6s ease-in-out infinite;transform-box:view-box}
/* Le onde della cassa che annuncia: ferme e quasi trasparenti a riposo,
   escono a ondate mentre parla. Il ritardo diverso fra le tre fa sembrare
   che il suono si allontani. */
.dmh-onde path{opacity:.18}
.dm-ap-card.is-run .dmh-onde path{animation:dmh-onda-esce 1.6s ease-out infinite}
.dm-ap-card.is-run .dmh-onde path:nth-child(2){animation-delay:.25s}
.dm-ap-card.is-run .dmh-onde path:nth-child(3){animation-delay:.5s}
@keyframes dmh-onda-esce{0%{opacity:0}25%{opacity:.95}100%{opacity:0}}
/* L'anello degli Echo: quello che li fa riconoscere. Spento quando la
   scheda e' a riposo, respira mentre parla. */
.dmh-anello,.dmh-anello-b{opacity:.14}
.dm-ap-card.is-run .dmh-anello,.dm-ap-card.is-run .dmh-anello-b{
  animation:dmh-glow 1.8s ease-in-out infinite}
.dm-ap-card.is-run .dmh-goccia2{animation-delay:.6s}
.dm-ap-card.is-run .dmh-goccia3{animation-delay:1.2s}
.dm-ap-card.is-run .dmh-onda{animation:dmh-onda 3.4s ease-in-out infinite}
.dm-ap-card.is-run .dmh-glow{animation:dmh-glow 1.7s ease-in-out infinite}
.dm-ap-card.is-run .dmh-flicker{animation:dmh-flicker 1.5s ease-in-out infinite}
/* Il mirino del grafico: la riga verticale che segue il dito o il mouse, col
   cartellino del valore. Vive in mirinoGrafico(), che sta piu' sotto in questo
   stesso file - per questo il controllo delle classi morte non lo vedeva. */
.dm-ap-mirino-box{position:relative;touch-action:none}
.dm-ap-mirino{position:absolute;top:0;bottom:0;width:0;pointer-events:none;opacity:0;transition:opacity .08s}
.dm-ap-mirino.si{opacity:1}
.dm-ap-mirino i{position:absolute;top:0;bottom:0;left:-1px;width:2px;background:var(--dm-dim,#94a3b8);opacity:.6}
.dm-ap-mirino-barre i{opacity:.28}
.dm-ap-mirino b{position:absolute;top:2px;transform:translateX(-50%);white-space:nowrap;font-size:11px;font-weight:800;padding:2px 6px;border-radius:7px;background:var(--dm-finestra,var(--dm-card,#fff));color:var(--dm-finestra-testo,var(--dm-text,#0f172a));border:1px solid var(--dm-border,#cbd5e1);box-shadow:0 4px 14px rgba(15,23,42,.18)}
/* la ruota libera: il centro lo dice il disegno con uno style="", cosi' una
   sola regola va bene per la ventola, la girante e la spazzola del robot */
.dmh-gira{transform-box:view-box}
.dm-ap-card.is-run .dmh-gira{animation:dmh-spin 1.8s linear infinite}
.dm-ap-card.is-run .dmh-gira-piano{animation-duration:4.2s}
@keyframes dmh-vapore{0%{opacity:0;transform:translateY(6px) scale(.9)}30%{opacity:.85}100%{opacity:0;transform:translateY(-18px) scale(1.2)}}
.dmh-vapore{opacity:0;transform-box:view-box}
.dm-ap-card.is-run .dmh-vapore{animation:dmh-vapore 2.4s ease-out infinite}
.dm-ap-card.is-run .dmh-vapore2{animation-delay:.8s}
.dm-ap-card.is-run .dmh-vapore3{animation-delay:1.6s}
@keyframes dmh-bolla{0%{opacity:0;transform:translateY(0)}15%{opacity:.9}100%{opacity:0;transform:translateY(-44px)}}
.dmh-bolla{opacity:0;transform-box:view-box}
.dm-ap-card.is-run .dmh-bolla{animation:dmh-bolla 2.8s linear infinite}
.dm-ap-card.is-run .dmh-bolla2{animation-delay:.9s}
.dm-ap-card.is-run .dmh-bolla3{animation-delay:1.8s}
.dm-ap-cycle-side{flex:1 1 50%;min-width:0;display:flex;flex-direction:column;padding:11px 10px;border-radius:16px;background:var(--dm-soft)}
.dm-ap-cycle-cap{display:flex;align-items:center;gap:6px;margin-top:-3px;margin-bottom:15px;font-size:11px;font-weight:900;letter-spacing:1.4px;text-transform:uppercase;color:var(--dm-dim)}
.dm-ap-cycle-sub{margin-top:-11px;margin-bottom:11px;font-size:11.5px;font-weight:600;color:var(--dm-text);opacity:.72;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dm-ap-cycle-side.ha-sub .dm-ap-cycle-cap{margin-bottom:6px}
.dm-ap-cycle-list{display:flex;flex-direction:column;flex:1;justify-content:flex-start;gap:4px}
/* CENTRATO: la foto si mette in mezzo, larga quanto la scheda, e i numeri
   le vanno sotto su due colonne. E' la stessa scheda, cambia la
   disposizione - si sceglie dall'editor, riquadro Aspetto. */
/* Nell'elenco «aggiungi scheda» la scheda si fa piccola: li' e' un
   figurino, non una scheda da usare. Fuori di li' non cambia niente. */
:host(.in-anteprima){zoom:.48}
.dm-ap-card.centrato .dm-ap-top-row{flex-direction:column;gap:12px}
.dm-ap-card.centrato .dm-ap-hero{flex:0 0 auto;width:100%;height:196px}
.dm-ap-card.centrato .dm-ap-cycle-side{flex:0 0 auto;width:100%}
/* DUE COLONNE, RIEMPITE UNA ALLA VOLTA. Si scende lungo la sinistra e,
   finita, si passa alla destra. Quante voci per colonna lo dice la variabile
   --righe, che la scheda calcola: la meta' arrotondata per eccesso, cosi' la
   sinistra e' sempre piena e l'eventuale vuoto resta in fondo a destra.
   Due strade gia' scartate: la griglia normale riempie per RIGHE (prima voce
   a sinistra, seconda a destra) e l'ordine si legge a zigzag; le colonne
   della stampa (columns) le bilancia il browser per ALTEZZA, quindi il punto
   dove si spezza cambia se una riga va a capo.
   QUI DENTRO NIENTE BACKTICK: questo foglio sta in un template literal, e un
   backtick lo chiude a meta'. */
.dm-ap-card.centrato .dm-ap-cycle-list{display:grid;grid-auto-flow:column;
  grid-template-rows:repeat(var(--righe,1),auto);
  grid-auto-columns:minmax(0,1fr);align-content:start;gap:4px 8px}
@media (max-width:480px){
  .dm-ap-card.centrato .dm-ap-cycle-list{grid-auto-flow:row;
    grid-template-rows:none;grid-template-columns:1fr}
}
.dm-ap-cycle-row{display:flex;align-items:baseline;justify-content:space-between;gap:5px;min-width:0}
.dm-ap-cycle-row small{flex:0 0 auto;font-size:10.5px;font-weight:900;letter-spacing:.7px;text-transform:uppercase;color:var(--dm-dim)}
.dm-ap-cycle-row b{min-width:0;text-align:right;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13.5px;font-weight:400;letter-spacing:-.1px;color:var(--dm-text)}
.dm-ap-cycle-row-b{padding:4px 6px;border-radius:9px;border:1px solid var(--dm-border);background:var(--dm-card);align-items:center}
.dm-ap-cycle-label{display:flex;align-items:center;gap:5px;min-width:0;flex:1 1 auto;overflow:hidden}
.dm-ap-cycle-label small{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:0 1 auto}
/* il numero non si accorcia: a stringere e' il nome, che si legge
   comunque. Con due cifre nella riga del costo il valore finiva in
   "0,52 . 0,7..." su una colonna stretta */
.dm-ap-cycle-row-b b{flex:0 0 auto;max-width:none}
.dm-ap-cycle-ic{display:flex;align-items:center;flex:0 0 auto;color:var(--dm-blue)}
.dm-colore{border-left:3px solid var(--c)!important;border-radius:4px 9px 9px 4px!important}
.dm-colore small,.dm-colore b,.dm-colore .dm-ap-cycle-ic,.dm-colore .dm-ap-row-label,.dm-colore .dm-ap-row-val{color:var(--c)!important}
.dm-colore.dm-forte b,.dm-colore.dm-forte .dm-ap-row-val{font-size:15.5px;font-weight:700}
/* la seconda cifra e' un numero come il primo: stessa grandezza, stesso
   colore. A separarle basta lo spazio. */
.dm-ap-due{margin-left:10px}
.dm-ap-panel{display:flex;align-items:center;gap:14px;margin:10px 13px 13px;padding:13px 14px;border-radius:16px;background:var(--dm-soft)}
.dm-ap-meters{flex:1;min-width:0;display:flex;flex-direction:column;gap:10px}
.dm-c-meter-clickable{cursor:pointer;border-radius:8px;transition:background .12s ease}
.dm-c-meter-clickable:active{background:rgba(148,163,184,.18)}
.dm-ap-meter-row{display:flex;align-items:baseline;justify-content:space-between;gap:10px}
.dm-ap-meter-row span{font-size:13px;font-weight:750;color:var(--dm-dim)}
.dm-ap-meter-row strong{font-size:16px;font-weight:950;letter-spacing:-.2px;color:var(--dm-text)}
.dm-ap-bar{position:relative;display:flex;align-items:center;height:8px;margin-top:7px}
.dm-ap-bar::before{content:"";position:absolute;inset:0;border-radius:999px;background:rgba(148,163,184,.22)}
.dm-ap-bar i{position:relative;z-index:1;display:block;height:100%;border-radius:999px;background:linear-gradient(90deg,#fb923c,#ef4444);min-width:0;transition:width .6s cubic-bezier(.4,0,.2,1)}
.dm-ap-bar i.dm-ap-progress-bar{background:linear-gradient(90deg,#4ade80,#16a34a)}
.dm-ap-power-open{cursor:pointer}
.dm-ap-power-open:hover{filter:brightness(1.04)}
.dm-ap-chart-svg{width:100%;height:auto;display:block;overflow:visible}
/* le scritte non si spalmano: ognuna sta alla frazione del suo punto */
.dm-ap-chart-labels{position:relative;height:13px;margin-top:4px;font-size:10px;font-weight:800;color:var(--dm-dim)}
.dm-ap-chart-labels span{position:absolute;top:0;white-space:nowrap;transform:translateX(-50%)}
/* LA FINESTRA DEL GRAFICO: le pastiglie dei periodi, le date a scelta, i
   chip delle curve e la riga minimo/media/massimo. Su telefono le pastiglie
   scorrono invece di andare a capo, e le date vanno una sotto l'altra. */
.dm-ap-periodi{display:flex;gap:6px;margin:0 0 10px;overflow-x:auto;
  scrollbar-width:none;-webkit-overflow-scrolling:touch}
.dm-ap-periodi::-webkit-scrollbar{display:none}
.dm-ap-per{flex:0 0 auto;font:inherit;font-size:12px;font-weight:700;cursor:pointer;
  padding:5px 13px;border-radius:999px;border:1px solid var(--divider-color);
  background:rgba(127,127,127,.10);color:var(--secondary-text-color)}
.dm-ap-per.scelto{color:#0284c7;border-color:#7dd3fc;background:rgba(14,165,233,.14)}
/* display:flex batte [hidden]: la riga delle date resta visibile anche
   quando non sei su "Da... a". Stessa trappola gia' pagata sulle righe. */
.dm-ap-date[hidden]{display:none}
.dm-ap-date{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:0 0 10px;
  font-size:12px;color:var(--secondary-text-color)}
.dm-ap-date input{font:inherit;padding:4px 7px;border-radius:8px;
  border:1px solid var(--divider-color);background:var(--dm-card);color:var(--dm-text)}
.dm-ap-applica{font:inherit;font-size:12px;font-weight:700;cursor:pointer;padding:5px 12px;
  border-radius:9px;border:1px solid #7dd3fc;background:rgba(14,165,233,.14);color:#0284c7}
.dm-ap-chip-riga{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 10px}
.dm-ap-chipc{display:inline-flex;align-items:center;gap:6px;font:inherit;font-size:11.5px;
  font-weight:700;cursor:pointer;padding:4px 10px;border-radius:999px;
  border:1px solid var(--divider-color);background:rgba(127,127,127,.10);
  color:var(--secondary-text-color);opacity:.55}
.dm-ap-chipc i{width:9px;height:9px;border-radius:50%;flex:0 0 auto}
.dm-ap-chipc.scelto{opacity:1;border-color:#bae6fd;background:rgba(14,165,233,.12);
  color:var(--dm-text)}
.dm-ap-mmm-posto{min-height:82px}
.dm-ap-mmm-chi{display:flex;align-items:center;gap:6px;margin:10px 0 -4px;min-height:14px;font-size:11px;font-weight:900;letter-spacing:.6px;text-transform:uppercase;color:var(--dm-dim)}
.dm-ap-mmm-chi i{width:8px;height:8px;border-radius:50%;flex:0 0 auto}
.dm-ap-mmm-chi em{font-style:normal;font-weight:700;letter-spacing:.2px;text-transform:none;opacity:.7}
.dm-ap-mmm{display:flex;gap:8px;margin:10px 0 2px}
.dm-ap-mmm>div{flex:1 1 0;min-width:0;text-align:center;padding:7px 4px;border-radius:11px;
  border:1px solid var(--divider-color);background:rgba(127,127,127,.06)}
.dm-ap-mmm small{display:block;font-size:10px;font-weight:900;letter-spacing:.6px;
  text-transform:uppercase;color:var(--dm-dim)}
.dm-ap-mmm b{font-size:13.5px;font-weight:700;color:var(--dm-text)}
@media (max-width:480px){
  .dm-ap-date{flex-direction:column;align-items:stretch}
  .dm-ap-date label{display:flex;justify-content:space-between;gap:8px;align-items:center}
  .dm-ap-mmm b{font-size:12.5px}
}
.dm-ap-chart-empty{padding:20px;text-align:center;font-size:13px;font-weight:700;color:var(--dm-dim)}
.dm-ap-graf{transition:opacity .14s ease}
.dm-ap-graf.caricando{opacity:.32}
.dm-ap-chart-loading{padding:20px;text-align:center;font-size:13px;font-weight:700;color:var(--dm-dim)}
.dm-ap-warn{display:flex;align-items:center;gap:6px;margin:0 13px 12px;padding:9px 12px;border-radius:13px;background:#fee2e2;color:#b91c1c;font-size:13px;font-weight:800}
.dm-ap-warn[hidden]{display:none}
.dm-test-flag{position:absolute;top:10px;right:10px;z-index:2;font-size:11px;font-weight:900;letter-spacing:.5px;text-transform:uppercase;color:#0369a1;background:rgba(14,165,233,.14);border-radius:8px;padding:4px 8px}

.dm-ap-overlay{position:fixed;inset:0;overscroll-behavior:contain;z-index:2147483000;background:var(--dm-velo,transparent);display:flex;align-items:center;justify-content:center;padding:18px;backdrop-filter:blur(var(--dm-velo-sfoca,0px))}
.dm-ap-overlay[hidden]{display:none}
.dm-ap-dialog{width:min(var(--dm-fin-largo,560px),100%);max-height:84vh;overflow:auto;box-sizing:border-box;overscroll-behavior:contain;
  background:var(--dm-finestra,var(--dm-card));color:var(--dm-finestra-testo,var(--dm-text));
  border:1px solid var(--dm-border);
  border-radius:26px;padding:18px;box-shadow:0 30px 80px rgba(0,0,0,.6);
  background-size:cover;background-position:center;
  animation:dm-ap-sfuma var(--dm-fin-dur,220ms) cubic-bezier(.2,.7,.3,1)}
/* COME SI APRE: gli stessi quattro modi della casella. "Sboccia" parte dal
   punto dove sta il tondino che hai premuto, e quel punto glielo calcolo
   quando apro: qui c'e' solo dove metterlo. */
@keyframes dm-ap-sfuma{from{transform:translateY(12px);opacity:0}}
@keyframes dm-ap-sboccia{from{transform:scale(.22);opacity:0}}
@keyframes dm-ap-basso{from{transform:translateY(64%);opacity:0}}
@keyframes dm-ap-velo{from{opacity:0}}
@keyframes dm-ap-chiude{to{transform:translateY(10px);opacity:0}}
.dm-ap-overlay[apertura="sboccia"] .dm-ap-dialog{
  animation-name:dm-ap-sboccia;transform-origin:var(--dm-nasce,50% 50%)}
.dm-ap-overlay[apertura="basso"] .dm-ap-dialog{
  animation-name:dm-ap-basso;transform-origin:50% 100%}
.dm-ap-overlay[apertura="niente"] .dm-ap-dialog,
.dm-ap-overlay[apertura="niente"]{animation:none}
.dm-ap-overlay{animation:dm-ap-velo var(--dm-fin-dur,220ms) ease-out}
/* chiudere deve sembrare piu' svelto che aprire: due terzi del tempo */
.dm-ap-overlay[chiude] .dm-ap-dialog{
  animation:dm-ap-chiude calc(var(--dm-fin-dur,220ms) * .66) ease-in forwards}
.dm-ap-overlay[chiude]{
  animation:dm-ap-velo calc(var(--dm-fin-dur,220ms) * .66) ease-in reverse forwards}
@media (prefers-reduced-motion: reduce){
  .dm-ap-dialog,.dm-ap-overlay{animation:none !important}
}
.dm-ap-dialog-head{position:sticky;top:0;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:16px 16px 10px;background:var(--dm-finestra,var(--dm-card));border-bottom:1px solid var(--dm-border);z-index:1}
.dm-ap-dialog-head h3{margin:0;font-size:17px;font-weight:900}
.dm-ap-dialog-close{width:30px;height:30px;flex:0 0 auto;display:grid;place-items:center;border:0;border-radius:10px;background:var(--dm-soft);color:var(--dm-dim);cursor:pointer}
.dm-ap-dialog-body{padding:12px 16px 18px;display:flex;flex-direction:column;gap:16px}
.dm-ap-sec-cap{font-size:11.5px;font-weight:900;letter-spacing:1px;text-transform:uppercase;color:var(--dm-blue-deep);margin:0 0 8px;padding-bottom:5px;border-bottom:2px solid var(--dm-border)}
.dm-ap-sec-nota{margin:-6px 0 8px;font-size:11.5px;line-height:1.35;color:var(--dm-dim)}
.dm-ap-vuoto{padding:10px 2px;font-size:12.5px;color:var(--dm-dim)}
.dm-ap-sec{display:flex;flex-direction:column;gap:6px}
.dm-ap-row{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:9px 11px;border-radius:13px;background:var(--dm-soft)}
.dm-ap-row-label{font-size:14.5px;font-weight:750;color:var(--dm-text);display:flex;flex-direction:column;gap:1px}
/* da quando conta quel contatore, sotto al nome del periodo */
.dm-ap-row-nota{font-size:10.5px;font-weight:600;letter-spacing:.2px;color:var(--dm-dim);opacity:.85}
.dm-ap-row-val{font-size:14.5px;font-weight:500;color:var(--dm-dim)}
/* CON UNA FOTO DIETRO. Il colore delle scritte si fermava alla finestra: le
   righe restavano del colore di sempre e sopra a una foto non si leggevano.
   Qui dentro al pop-up seguono quello che hai scelto, e i riquadri hanno il
   loro comando di trasparenza, staccato da quello della finestra. */
.dm-ap-dialog .dm-ap-row,
.dm-ap-dialog .dm-ap-stat{background:var(--dm-righe,var(--dm-soft))}
.dm-ap-dialog .dm-ap-row-label,
.dm-ap-dialog .dm-ap-cycle-label{color:var(--dm-finestra-testo,var(--dm-text))}
.dm-ap-dialog .dm-ap-row-val,
.dm-ap-dialog .dm-ap-stat small{color:var(--dm-finestra-fioco,var(--dm-dim))}
.dm-ap-dialog .dm-ap-sec-cap{color:var(--dm-finestra-testo,var(--dm-blue-deep))}
.dm-ap-action-btn{flex:0 0 auto;border:0;border-radius:10px;padding:0 14px;height:26px;background:var(--dm-blue);color:#fff;font-size:13px;font-weight:850;cursor:pointer}
.dm-ap-action-btn:active{filter:brightness(.92)}
.dm-ap-stat{display:flex;flex-direction:column;gap:2px;padding:9px 10px;border-radius:13px;background:var(--dm-soft)}
.dm-ap-stat small{font-size:10px;font-weight:900;letter-spacing:.6px;text-transform:uppercase;color:var(--dm-dim)}
.dm-ap-stat b{font-size:15px;font-weight:900;color:var(--dm-text)}
.dm-ap-week-list{display:flex;flex-direction:column;gap:7px}
.dm-ap-week-row{display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid var(--dm-border)}
.dm-ap-week-row:last-child{border-bottom:0}
.dm-ap-week-day{flex:0 0 60px;font-size:13px;font-weight:850;color:var(--dm-text);display:flex;flex-direction:column;gap:1px}
.dm-ap-week-stats{flex:1;display:grid;grid-template-columns:repeat(4,1fr);gap:4px;min-width:0}
.dm-ap-week-stats.cols3{grid-template-columns:repeat(3,1fr)}
.dm-ap-week-stat{display:flex;flex-direction:column;align-items:center;gap:0;min-width:0}
.dm-ap-week-stat small{font-size:9px;font-weight:900;letter-spacing:.4px;text-transform:uppercase;color:var(--dm-dim)}
.dm-ap-week-stat b{font-size:13px;font-weight:850;color:var(--dm-text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:100%}
.dm-ap-reset-note{font-size:12px;color:var(--dm-dim);text-align:center;margin-top:4px}

/* Sul telefono resta la stessa finestra del PC, solo coi margini piu'
   stretti: e' quello che fa la casella. Prima diventava un cassetto alto
   quanto lo schermo, cioe' un altro pop-up per la stessa scheda. */
@media (max-width:480px){
  .dm-ap-overlay{padding:8px}
  .dm-ap-dialog{border-radius:20px;padding:14px;max-height:88vh}
}
`;

// COME SI VESTE IL POP-UP. Tinta e trasparenza della finestra, e quanto il
// velo dietro scurisce e sfoca. Tutto attraverso variabili di stile, cosi'
// non tocco il foglio: se un'opzione non c'e' resta il vestito di serie.
// IL MIRINO DEL GRAFICO DEL POP-UP. `box` e' il riquadro che contiene l'svg,
// `punti` i dati disegnati, `scrivi(punto)` la scritta del cartellino.
// L'svg ha viewBox 0 0 300 90 e riempie la larghezza del riquadro, quindi la
// x in punti-svg e' la stessa frazione della larghezza vera: i dati cominciano
// dopo l'asse (30 su 300) e arrivano in fondo. Col mouse basta passarci sopra, col
// dito si tiene premuto e si trascina (touch-action: none), e alzandolo va via.
export function mirinoGrafico(box, punti, scrivi) {
  if (!box || !punti || punti.length < 2) return;
  box.classList.add("dm-ap-mirino-box");
  const mirino = document.createElement("div");
  mirino.className = "dm-ap-mirino";
  mirino.innerHTML = "<i></i><b></b>";
  box.appendChild(mirino);
  const cartellino = mirino.querySelector("b");
  const ASSE = 30 / 300;

  const muovi = (ev) => {
    const q = box.getBoundingClientRect();
    if (!q.width) return;
    const frazione = Math.min(1, Math.max(0, ((ev.clientX - q.left) / q.width - ASSE) / (1 - ASSE)));
    const i = Math.min(punti.length - 1, Math.max(0, Math.round(frazione * (punti.length - 1))));
    mirino.style.left = ((ASSE + (i / (punti.length - 1)) * (1 - ASSE)) * q.width) + "px";
    cartellino.textContent = scrivi(punti[i], i);
    // il cartellino non deve uscire dal riquadro
    cartellino.style.transform = "translateX(-50%)";
    const b = cartellino.getBoundingClientRect();
    if (b.left < q.left) cartellino.style.transform = "translateX(0)";
    else if (b.right > q.right) cartellino.style.transform = "translateX(-100%)";
    mirino.classList.add("si");
  };
  const via = () => mirino.classList.remove("si");

  box.addEventListener("pointerdown", (ev) => {
    try { box.setPointerCapture(ev.pointerId); } catch (e) { /* pazienza */ }
    muovi(ev);
  });
  box.addEventListener("pointermove", (ev) => {
    if (ev.pointerType === "mouse" || ev.buttons || ev.pressure > 0) muovi(ev);
  });
  box.addEventListener("pointerup", via);
  box.addEventListener("pointercancel", via);
  box.addEventListener("pointerleave", via);
}

// IL MIRINO DEGLI ISTOGRAMMI. Come quello della linea, ma le barre non sono
// punti: ognuna occupa una fetta di larghezza, quindi la fetta si trova con un
// troncamento e non con un arrotondamento, e il cartellino va sopra al centro
// della barra. `scrivi(barra, i)` decide cosa c'e' scritto.
export function mirinoBarre(box, barre, scrivi) {
  if (!box || !barre || !barre.length) return;
  box.classList.add("dm-ap-mirino-box");
  const mirino = document.createElement("div");
  mirino.className = "dm-ap-mirino dm-ap-mirino-barre";
  mirino.innerHTML = "<i></i><b></b>";
  box.appendChild(mirino);
  const cartellino = mirino.querySelector("b");
  const ASSE = 30 / 300;
  const n = barre.length;

  const muovi = (ev) => {
    const q = box.getBoundingClientRect();
    if (!q.width) return;
    const f = Math.min(0.999, Math.max(0, ((ev.clientX - q.left) / q.width - ASSE) / (1 - ASSE)));
    const i = Math.min(n - 1, Math.floor(f * n));
    // il centro della fetta, non il bordo
    mirino.style.left = ((ASSE + ((i + 0.5) / n) * (1 - ASSE)) * q.width) + "px";
    cartellino.textContent = scrivi(barre[i], i);
    cartellino.style.transform = "translateX(-50%)";
    const b = cartellino.getBoundingClientRect();
    if (b.left < q.left) cartellino.style.transform = "translateX(0)";
    else if (b.right > q.right) cartellino.style.transform = "translateX(-100%)";
    mirino.classList.add("si");
  };
  const via = () => mirino.classList.remove("si");

  box.addEventListener("pointerdown", (ev) => {
    try { box.setPointerCapture(ev.pointerId); } catch (e) { /* pazienza */ }
    muovi(ev);
  });
  box.addEventListener("pointermove", (ev) => {
    if (ev.pointerType === "mouse" || ev.buttons || ev.pressure > 0) muovi(ev);
  });
  box.addEventListener("pointerup", via);
  box.addEventListener("pointercancel", via);
  box.addEventListener("pointerleave", via);
}

// Un numero scritto come lo scrive Home Assistant nella lingua di chi guarda:
// in italiano la virgola decimale. Le due schede dei consumi usavano toFixed,
// che mette sempre il punto, e sulla stessa plancia si leggeva "1,2 kW" da una
// parte e "0.29 €" dall'altra.
// Il simbolo al posto del codice della moneta, come fa Home Assistant.
const SIMBOLI = { EUR: "\u20ac", USD: "$", GBP: "\u00a3", CHF: "CHF" };
// I tasti di accensione della scheda, da qualunque forma vengano.
// `tasti` e' quella nuova (entita' + icona); `interruttori` era la fila di
// tastini col nome; `interruttore`/`interruttore_usb` i due campi di prima.
// Le metto tutte in un elenco solo, cosi' la scheda ha una strada sola.
export function tastiDi(cfg) {
  const c = cfg || {};
  const fuori = [];
  const metti = (entity, icona, nome) => {
    if (!entity || fuori.some((x) => x.entity === entity)) return;
    fuori.push({ entity, icona: icona || "", nome: nome || "" });
  };
  (c.tasti || []).forEach((t) => metti(t && t.entity, t && t.icona, t && t.nome));
  (c.interruttori || []).forEach((t) => metti(t && t.entity, t && t.icona, t && t.label));
  metti(c.interruttore, "", "");
  metti(c.interruttore_usb, "usb", "");
  return fuori;
}

// Il giorno e il mese scritti nella lingua di chi guarda: "Mar" in italiano
// e' sia martedi' sia marzo, quindi nel dizionario non ci starebbero entrambi -
// e comunque il browser lo sa fare meglio.
export function giornoBreve(d) {
  try {
    const t = d.toLocaleDateString(laLocale(), { weekday: "short" });
    return t.charAt(0).toUpperCase() + t.slice(1).replace(/\.$/, "");
  } catch (e) { return WEEKDAY_ABBR_IT[d.getDay()]; }
}

export function meseBreve(d) {
  try {
    const t = d.toLocaleDateString(laLocale(), { month: "short" });
    return t.charAt(0).toUpperCase() + t.slice(1).replace(/\.$/, "");
  } catch (e) { return String(d.getMonth() + 1); }
}

export function meseLungo(d) {
  try {
    const t = d.toLocaleDateString(laLocale(), { month: "long" });
    return t.charAt(0).toUpperCase() + t.slice(1);
  } catch (e) { return String(d.getMonth() + 1); }
}

export function unitaBella(u) {
  const t = String(u || "").trim();
  return SIMBOLI[t.toUpperCase()] || t;
}

// Il numero che c'e' DAVVERO dentro a uno stato.
//
// `Number("")` fa 0. `Number(null)` fa 0. `Number("  ")` fa 0. E `isFinite(0)`
// e' vero, quindi il controllo passa e la scheda scrive "0,00 kWh" dove la
// verita' era "non lo so". Un contatore appena creato, un template che non ha
// ancora reso niente, un'entita' sparita: tutti casi veri, tutti bugie.
//
// Qui invece torna NaN tutto quello che non e' un numero scritto, e chi legge
// se ne accorge con il solito `Number.isFinite`.
export function numeroVero(v) {
  if (v === null || v === undefined || typeof v === "boolean") return NaN;
  const t = String(v).trim();
  if (t === "" || t === "unknown" || t === "unavailable" || t === "none") return NaN;
  const n = Number(t);
  return Number.isFinite(n) ? n : NaN;
}

export function numero(v, decimali) {
  const n = Number(v);
  if (!Number.isFinite(n)) return null;
  const d = Number.isFinite(Number(decimali)) ? Number(decimali) : 0;
  try {
    return n.toLocaleString(laLocale(), { minimumFractionDigits: d, maximumFractionDigits: d });
  } catch (e) {
    return n.toFixed(d);
  }
}

// Il disegno della scheda: quello del catalogo, oppure una FOTO TUA se l'hai
// messa. Un posto solo, cosi' le due schede dei consumi non possono
// comportarsi in modo diverso - e la foto di "quando lavora" (anche una gif)
// funziona come sulla casella animata.
//   acceso - true quando la scheda sta lavorando
// I disegni con il loro nome, in ordine di catalogo. Sta qui, accanto ai
// disegni veri, perche' l'elenco della scheda della casa era una copia a
// parte: aveva cinque voci - UPS, Server, NAS, Router, Proxmox - che un
// disegno non ce l'hanno mai avuto. Con la tendina si sceglievano e usciva
// il disegno di ripiego senza dire niente; con la griglia si vedevano cinque
// quadretti vuoti. Un elenco solo, e il caso non si ripresenta.
export const NOMI_DISEGNI = [
  ["annunci", "Annunci vocali"],
  ["echo_dot", "Echo Dot"],
  ["echo_show", "Echo con schermo"],
  ["echo_studio", "Echo colonna"],
  ["cucina", "Cucina (tutta la linea)"],
  ["washer", "Lavatrice"],
  ["dishwasher", "Lavastoviglie"],
  ["dryer", "Asciugatrice"],
  ["oven", "Forno"],
  ["microonde", "Microonde"],
  ["piano_cottura", "Piano cottura a induzione"],
  ["cappa", "Cappa aspirante"],
  ["caffe", "Macchina del caffe'"],
  ["bollitore", "Bollitore"],
  ["tostapane", "Tostapane"],
  ["friggitrice", "Friggitrice ad aria"],
  ["congelatore", "Congelatore"],
  ["frigorifero", "Frigorifero"],
  ["dehumidifier", "Deumidificatore"],
  ["condizionatore", "Condizionatore"],
  ["ventilatore", "Ventilatore"],
  ["boiler", "Boiler / scaldabagno"],
  ["termoventilatore", "Termoventilatore"],
  ["pompa_calore", "Pompa di calore"],
  ["pellet", "Stufa a pellet"],
  ["radiatore", "Radiatore elettrico"],
  ["scaldasalviette", "Scaldasalviette"],
  ["luce", "Luce"],
  ["lampada", "Lampada"],
  ["tv", "Televisore"],
  ["pc_torre", "PC (torre)"],
  ["pc_monitor", "PC (monitor)"],
  ["minipc", "Mini PC (Home Assistant)"],
  ["presa", "Presa smart"],
  ["ciabatta", "Ciabatta / multipresa"],
  ["robot", "Robot aspirapolvere"],
  ["asciugacapelli", "Asciugacapelli"],
  ["ferro", "Ferro da stiro"],
  ["pompa", "Pompa dell'acqua"],
  ["acquario", "Acquario"],
  ["stampante3d", "Stampante 3D"],
  ["console", "Console da gioco"],
  ["colonnina", "Colonnina di ricarica"],
  ["powerstation", "Powerstation"],
  ["energy", "Contatore della luce"],
];

export function disegnoDiScheda(cfg, id, disegnoDiSerie, acceso) {
  const c = cfg || {};
  const mia = (acceso && c.disegno_immagine_accesa) || c.disegno_immagine;
  if (mia) {
    const src = String(mia).replace(/"/g, "%22");
    return { hero: `<img src="${src}" alt="">`, chip: `<img src="${src}" alt="">` };
  }
  const quale = HERO_BUILDERS[c.artwork] ? c.artwork : disegnoDiSerie;
  return {
    hero: HERO_BUILDERS[quale](id),
    chip: CHIP_SVGS[quale] || CHIP_SVGS[disegnoDiSerie] || "",
  };
}

export function vestiFinestra(host, cfg) {
  const c = cfg || {};
  // chiaro o scuro: senza attributo comanda il tema di Home Assistant
  if (c.tema === "chiaro" || c.tema === "scuro") host.setAttribute("data-tema", c.tema);
  else host.removeAttribute("data-tema");
  const metti = (nome, valore) => {
    if (valore === null || valore === undefined || valore === "") host.style.removeProperty(nome);
    else host.style.setProperty(nome, valore);
  };
  const quanta = (v, difetto) => {
    const n = Number(v);
    return Number.isFinite(n) ? Math.min(100, Math.max(0, n)) : difetto;
  };
  // la finestra: tinta scelta, resa trasparente quanto dice finestra_trasparenza
  // senza una tinta scelta si parte da quella di serie della scheda, se no
  // il cursore della trasparenza non faceva niente e non si capiva perche'
  const t = quanta(c.finestra_trasparenza, 0);
  const tinta = c.finestra_sfondo || "var(--dm-card)";
  if (c.finestra_sfondo || t > 0) {
    metti("--dm-finestra", t > 0
      ? `color-mix(in srgb, ${tinta} ${100 - t}%, transparent)`
      : tinta);
  } else metti("--dm-finestra", null);
  metti("--dm-finestra-testo", c.finestra_scritta || null);
  // il colore "fioco" dei numeri: lo stesso, un po' piu' spento. Se no con
  // una scritta chiara su una foto scura i valori restavano grigi e illeggibili
  metti("--dm-finestra-fioco", c.finestra_scritta
    ? `color-mix(in srgb, ${c.finestra_scritta} 78%, transparent)` : null);
  // i riquadri delle scritte dentro al pop-up: quanto coprono la foto.
  // 100 = pieni, 0 = si vede la foto attraverso. Il colore e' quello della
  // finestra, se l'hai scelto.
  const r = c.finestra_righe;
  if (r !== undefined && r !== null && r !== "") {
    const q = quanta(r, 100);
    const fondo = c.finestra_sfondo || "var(--dm-card)";
    metti("--dm-righe", q >= 100 ? fondo
      : `color-mix(in srgb, ${fondo} ${q}%, transparent)`);
  } else metti("--dm-righe", null);
  // il velo dietro: nero quanto dice velo_scuro (0 = niente velo)
  if (c.velo_scuro !== undefined && c.velo_scuro !== null && c.velo_scuro !== "") {
    metti("--dm-velo", `rgba(15,23,42,${quanta(c.velo_scuro, 55) / 100})`);
  } else metti("--dm-velo", null);
  if (c.velo_sfoca !== undefined && c.velo_sfoca !== null && c.velo_sfoca !== "") {
    metti("--dm-velo-sfoca", `${Math.min(30, Math.max(0, Number(c.velo_sfoca) || 0))}px`);
  } else metti("--dm-velo-sfoca", null);
  // quanto e' larga e quanto dura l'apertura: le stesse chiavi della casella
  const largo = Number(c.finestra_largo);
  metti("--dm-fin-largo", Number.isFinite(largo) && largo > 0 ? largo + "px" : null);
  const dura = Number(c.finestra_apertura_durata);
  metti("--dm-fin-dur", Number.isFinite(dura) && dura > 0
    ? Math.min(2000, Math.max(80, dura)) + "ms" : null);
}

function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function meterSeverityColor(pct) {
  if (pct >= 85) return "#ef4444";
  if (pct >= 70) return "#f97316";
  if (pct >= 50) return "#eab308";
  if (pct >= 30) return "#22c55e";
  return "#38bdf8";
}

export {
  HERO_BUILDERS,
  CHIP_SVGS,
  ICON_CHART,
  ICON_CLOSE,
  ICON_BOLT,
  ICON_FLAG,
  ICON_TIMER,
  ICON_EURO,
  ICON_TREND,
  WEEKDAY_FULL_IT,
  DEFAULT_STATE_MAP,
  STYLE,
  esc,
  meterSeverityColor,
};
