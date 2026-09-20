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
  fritzbox: (id) => `<svg width="100%" height="100%" viewBox="0 0 240 240" preserveAspectRatio="xMidYMid meet" role="img" aria-hidden="true">
    <defs>
      <filter id="dmh-blur-${id}" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="5"/></filter>
    </defs>
    <ellipse cx="120" cy="222" rx="80" ry="9" fill="#0f172a" opacity=".14" filter="url(#dmh-blur-${id})"/>
    <g class="dmh-glow" opacity=".7" stroke="#38bdf8" stroke-linecap="round" stroke-width="2.6" fill="none">
      <path d="M111 42c3-3 15-3 18 0"/>
      <path d="M103 36c8-7 26-7 34 0"/>
      <path d="M95 30c13-11 37-11 50 0"/>
    </g>
    <circle cx="120" cy="44" r="2.6" fill="#38bdf8"/>
    <image href="/local/foto-pkg/fritz-box.png" x="-44.43" y="1" width="328.86" height="260.82" preserveAspectRatio="xMidYMid meet"/>
  </svg>`,
  server: (id) => `<svg width="100%" height="100%" viewBox="0 0 240 240" preserveAspectRatio="xMidYMid meet" role="img" aria-hidden="true">
    <defs>
      <filter id="dmh-blur-${id}" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="5"/></filter>
    </defs>
    <ellipse cx="120" cy="216" rx="66" ry="10" fill="#0f172a" opacity=".14" filter="url(#dmh-blur-${id})"/>
    <image href="/local/foto-pkg/ha_logo.gif" x="21.33" y="16.3" width="197.34" height="197.34" preserveAspectRatio="xMidYMid meet"/>
  </svg>`,
  proxmox: (id) => `<svg width="100%" height="100%" viewBox="0 0 240 240" preserveAspectRatio="xMidYMid meet" role="img" aria-hidden="true">
    <defs>
      <filter id="dmh-blur-${id}" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="5"/></filter>
    </defs>
    <ellipse cx="120" cy="216" rx="66" ry="10" fill="#0f172a" opacity=".14" filter="url(#dmh-blur-${id})"/>
    <image href="/local/foto-pkg/proxmox-logo.svg" x="-1" y="10" width="242" height="193.6" preserveAspectRatio="xMidYMid meet"/>
  </svg>`,
  nas: (id) => `<svg width="100%" height="100%" viewBox="0 0 240 240" preserveAspectRatio="xMidYMid meet" role="img" aria-hidden="true">
    <defs>
      <filter id="dmh-blur-${id}" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="5"/></filter>
    </defs>
    <ellipse cx="120" cy="222" rx="70" ry="9" fill="#0f172a" opacity=".14" filter="url(#dmh-blur-${id})"/>
    <image href="/local/foto-pkg/synology-ds925.png" x="-1" y="-7" width="242" height="242" preserveAspectRatio="xMidYMid meet"/>
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
  ups: (id) => `<svg width="100%" height="100%" viewBox="0 0 240 240" preserveAspectRatio="xMidYMid meet" role="img" aria-hidden="true">
    <defs>
      <filter id="dmh-blur-${id}" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="5"/></filter>
    </defs>
    <ellipse cx="120" cy="222" rx="60" ry="9" fill="#0f172a" opacity=".14" filter="url(#dmh-blur-${id})"/>
    <image href="/local/foto-pkg/apc-ups.png" x="17.15" y="14" width="205.7" height="211.75" preserveAspectRatio="xMidYMid meet"/>
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
    <path d="M120 172c-6 8-10 12-10 18a10 10 0 0 0 20 0c0-4-2-7-4-10 0 4-3 6-5 5-3-1-3-6-1-9-3 1-6 3-6 6z" fill="#fff7ed" opacity=".9"/>
    <rect x="60" y="204" width="10" height="16" rx="3" fill="#9fadbc"/>
    <rect x="170" y="204" width="10" height="16" rx="3" fill="#9fadbc"/>
    <rect x="52" y="216" width="136" height="10" rx="5" fill="#78899b"/>
  </svg>`,
};

const CHIP_SVGS = {
  dishwasher:
    '<svg viewBox="0 0 96 96" width="27" height="27"><rect x="14" y="10" width="68" height="76" rx="9" fill="#0f2942"/><rect x="20" y="16" width="56" height="14" rx="5" fill="#f8fafc"/><circle cx="28" cy="23" r="3" fill="#0ea5e9"/><rect x="20" y="36" width="56" height="41" rx="6" fill="#f8fafc"/><path fill="none" stroke="#0f2942" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="M27 49h42M30 64h36M33 49v15M44 49v15M55 49v15M66 49v15"/><path fill="#8be2ff" d="M23 67c9-6 16 5 25-2 8-6 14 4 25-1v10H23Z"/></svg>',
  dryer:
    '<svg viewBox="0 0 96 96" width="27" height="27"><rect x="14" y="10" width="68" height="76" rx="9" fill="#0f2942"/><rect x="20" y="16" width="56" height="14" rx="5" fill="#f8fafc"/><circle cx="28" cy="23" r="3" fill="#f97316"/><circle cx="48" cy="56" r="24" fill="#f8fafc"/><circle cx="48" cy="56" r="19" fill="#fed7aa"/><circle cx="48" cy="56" r="19" fill="none" stroke="#0f2942" stroke-width="3"/><path fill="none" stroke="#0f2942" stroke-width="2.6" stroke-linecap="round" d="M37 56a11 11 0 0 1 20-6.5"/></svg>',
  washer:
    '<svg viewBox="0 0 96 96" width="27" height="27"><rect x="14" y="10" width="68" height="76" rx="9" fill="#0f2942"/><rect x="20" y="16" width="56" height="14" rx="5" fill="#f8fafc"/><circle cx="28" cy="23" r="3" fill="#0ea5e9"/><circle cx="48" cy="56" r="24" fill="#f8fafc"/><circle cx="48" cy="56" r="19" fill="#bae6fd"/><circle cx="48" cy="56" r="19" fill="none" stroke="#0f2942" stroke-width="3"/><path fill="none" stroke="#0f2942" stroke-width="2.6" stroke-linecap="round" d="M39 58c4 6 14 6 18 0"/></svg>',
  oven:
    '<svg viewBox="0 0 96 96" width="27" height="27"><rect x="14" y="10" width="68" height="76" rx="9" fill="#0f2942"/><rect x="20" y="16" width="56" height="14" rx="5" fill="#f8fafc"/><circle cx="28" cy="23" r="3" fill="#ef4444"/><rect x="20" y="36" width="56" height="41" rx="6" fill="#f8fafc"/><path fill="none" stroke="#0f2942" stroke-width="3" stroke-linecap="round" d="M28 51h40M28 63h40"/></svg>',
  boiler:
    '<svg viewBox="0 0 96 96" width="27" height="27"><rect x="14" y="10" width="68" height="76" rx="9" fill="#0f2942"/><circle cx="48" cy="38" r="17" fill="#f8fafc"/><path d="M48 26c-5 7-9 10-9 16a9 9 0 0 0 18 0c0-3-1-6-3-8 0 3-2 5-4 4-2-1-2-5-1-7-3 1-4 3-4 3z" fill="#fb923c"/><rect x="28" y="62" width="40" height="10" rx="4" fill="#38bdf8"/></svg>',
  tv:
    '<svg viewBox="0 0 96 96" width="27" height="27"><rect x="10" y="20" width="76" height="48" rx="6" fill="#0f2942"/><rect x="16" y="26" width="64" height="36" rx="3" fill="#8be2ff"/><rect x="42" y="68" width="12" height="10" fill="#0f2942"/><rect x="30" y="78" width="36" height="6" rx="3" fill="#0f2942"/></svg>',
  fritzbox:
    '<svg viewBox="0 0 96 96" width="27" height="27"><rect x="10" y="34" width="76" height="30" rx="8" fill="#0f2942"/><circle cx="26" cy="49" r="3" fill="#22c55e"/><circle cx="38" cy="49" r="3" fill="#38bdf8"/><circle cx="50" cy="49" r="3" fill="#38bdf8"/><path d="M48 30c-10-10-10-24 0-34" stroke="#38bdf8" stroke-width="3" fill="none" stroke-linecap="round" transform="translate(0 8)"/><path d="M48 30c-4-4-4-10 0-14" stroke="#38bdf8" stroke-width="3" fill="none" stroke-linecap="round" transform="translate(0 8)"/></svg>',
  server:
    '<svg viewBox="0 0 96 96" width="27" height="27"><rect x="14" y="10" width="68" height="76" rx="9" fill="#0f2942"/><rect x="20" y="16" width="56" height="16" rx="4" fill="#0b1526"/><circle cx="28" cy="24" r="2.6" fill="#22c55e"/><circle cx="36" cy="24" r="2.6" fill="#38bdf8"/><rect x="44" y="21.5" width="26" height="5" rx="2.5" fill="#38bdf8" opacity=".6"/><rect x="20" y="36" width="56" height="16" rx="4" fill="#0b1526"/><circle cx="28" cy="44" r="2.6" fill="#22c55e"/><circle cx="36" cy="44" r="2.6" fill="#38bdf8"/><rect x="44" y="41.5" width="26" height="5" rx="2.5" fill="#38bdf8" opacity=".6"/><rect x="20" y="56" width="56" height="16" rx="4" fill="#0b1526"/><circle cx="28" cy="64" r="2.6" fill="#22c55e"/><circle cx="36" cy="64" r="2.6" fill="#38bdf8"/><rect x="44" y="61.5" width="26" height="5" rx="2.5" fill="#38bdf8" opacity=".6"/></svg>',
  nas:
    '<svg viewBox="0 0 96 96" width="27" height="27"><rect x="30" y="8" width="36" height="80" rx="6" fill="#0f2942"/><rect x="36" y="16" width="24" height="10" rx="2" fill="#0b1526"/><circle cx="42" cy="21" r="2" fill="#22c55e"/><rect x="36" y="30" width="24" height="10" rx="2" fill="#0b1526"/><circle cx="42" cy="35" r="2" fill="#38bdf8"/><rect x="36" y="44" width="24" height="10" rx="2" fill="#0b1526"/><circle cx="42" cy="49" r="2" fill="#38bdf8"/><rect x="36" y="58" width="24" height="10" rx="2" fill="#0b1526"/><circle cx="42" cy="63" r="2" fill="#38bdf8"/></svg>',
  energy:
    '<svg viewBox="0 0 96 96" width="27" height="27"><rect x="14" y="10" width="68" height="76" rx="9" fill="#0f2942"/><path d="M52 22 30 54h14l-2 20 26-34H54l-2-18z" fill="#38bdf8"/></svg>',
  ups:
    '<svg viewBox="0 0 96 96" width="27" height="27"><rect x="24" y="8" width="48" height="80" rx="8" fill="#0f2942"/><rect x="34" y="20" width="28" height="46" rx="4" fill="none" stroke="#8be2ff" stroke-width="3"/><rect x="38" y="26" width="20" height="34" rx="2" fill="#38bdf8"/><circle cx="48" cy="76" r="3" fill="#22c55e"/></svg>',
};

const ICON_GEAR =
  '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>';
const ICON_CHART =
  '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="5" y1="20" x2="5" y2="12"/><line x1="12" y1="20" x2="12" y2="5"/><line x1="19" y1="20" x2="19" y2="9"/></svg>';
const ICON_CLOSE =
  '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><line x1="5" y1="5" x2="19" y2="19"/><line x1="19" y1="5" x2="5" y2="19"/></svg>';
const ICON_RESTART =
  '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-3-6.7"/><path d="M21 3v6h-6"/></svg>';
const ICON_BELL =
  '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>';
const ICON_NOTIFCENTER =
  '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11v2a1 1 0 0 0 1 1h3l4 4V6l-4 4H4a1 1 0 0 0-1 1z"/><path d="M16 8a5 5 0 0 1 0 8"/><path d="M19 5a9 9 0 0 1 0 14"/></svg>';
const ICON_SPEED =
  '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 14l3-3"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg>';
const ICON_BOLT =
  '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z"/></svg>';
const ICON_FLAG =
  '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 21V4"/><path d="M4 4h11l-2 4 2 4H4"/></svg>';
const ICON_TIMER =
  '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2"/><path d="M9 2h6"/></svg>';
const ICON_EURO =
  '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 6.5a6.5 6.5 0 1 0 0 11"/><path d="M5.5 10h9"/><path d="M5.5 14h8"/></svg>';
const ICON_GLOBE =
  '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a14 14 0 0 1 0 18a14 14 0 0 1 0-18z"/></svg>';
const ICON_DOWNLOAD =
  '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v13"/><path d="M6 11l6 6 6-6"/><path d="M4 21h16"/></svg>';
const ICON_UPLOAD =
  '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21V8"/><path d="M6 13l6-6 6 6"/><path d="M4 21h16"/></svg>';
const ICON_TAG =
  '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.6 12.6 12 21.2 2.8 12 11.4 3.4H20.6z"/><circle cx="16.3" cy="7.7" r="1.15" fill="currentColor" stroke="none"/></svg>';
const ICON_SHIELD =
  '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 4 5v6c0 5 3.5 8.5 8 11 4.5-2.5 8-6 8-11V5l-8-3z"/></svg>';
const ICON_BOX =
  '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8l-9-5-9 5 9 5 9-5z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/></svg>';
const ICON_TREND =
  '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17l6-6 4 4 8-8"/><path d="M15 6h6v6"/></svg>';
const ICON_PULSE =
  '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h4l2 7 4-14 2 7h6"/></svg>';
const ICON_BATTERY =
  '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="17" height="10" rx="2"/><path d="M22 10v4"/><path d="M6 10v4"/></svg>';
const ICON_PLUG =
  '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 2v5"/><path d="M15 2v5"/><path d="M6 7h12v4a6 6 0 0 1-12 0V7z"/><path d="M12 17v5"/></svg>';
const ICON_CUBE =
  '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8l-9-5-9 5v8l9 5 9-5z"/><path d="M3.3 7.6 12 12l8.7-4.4"/><path d="M12 22V12"/></svg>';
const ICON_MONITOR =
  '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="13" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/></svg>';
const ICON_ALERT =
  '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 2 20h20L12 3z"/><path d="M12 10v4"/><circle cx="12" cy="17.5" r=".2" fill="currentColor"/></svg>';
const ICON_SAVE =
  '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M7 3v5h9V3"/><path d="M7 21v-8h10v8"/></svg>';
const ICON_CALENDAR =
  '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/></svg>';
const ICON_BACK =
  '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>';

// Icone per le righe "gruppo" del dialog Impostazioni (stile vecchia card).
const SETTINGS_GROUP_ICONS = {
  report: ICON_CHART,
  notifiche: ICON_BELL,
  update: ICON_DOWNLOAD,
  alert: ICON_ALERT,
  backup: ICON_SAVE,
  restart: ICON_RESTART,
  euro: ICON_EURO,
};

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
.dm-ap-card{position:relative;display:flex;flex-direction:column;border:1px solid var(--dm-border);border-radius:22px;background:var(--dm-card);box-shadow:0 12px 30px rgba(15,23,42,.06);overflow:hidden}
.dm-ap-card.is-run{border-color:rgba(34,197,94,.28)}
.dm-ap-card.has-alarm{border-color:rgba(239,68,68,.4)}
.dm-ap-top{display:flex;align-items:center;gap:7px;padding:12px 12px 9px}
.dm-ap-chip{width:34px;height:34px;flex:0 0 34px;display:grid;place-items:center;border-radius:11px;background:#eff6ff;box-shadow:inset 0 0 0 1px rgba(59,130,246,.10)}
.dm-ap-chip svg{width:27px;height:27px}
.dm-ap-headings{display:flex;flex-direction:column;min-width:0;flex:1;gap:1px}
.dm-ap-name{font-size:14.5px;font-weight:900;letter-spacing:-.2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--dm-text)}
.dm-ap-room{font-size:11px;font-weight:750;color:var(--dm-dim);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dm-ap-badge{display:inline-flex;align-items:center;gap:4px;flex:0 0 auto;padding:4px 7px;border-radius:999px;font-size:9.5px;font-weight:900;letter-spacing:.4px;text-transform:uppercase;white-space:nowrap}
.dm-ap-badge.run{background:#dcfce7;color:#15803d}
.dm-ap-badge.standby{background:#dbeafe;color:#2563eb}
.dm-ap-badge.off{background:#f1f5f9;color:#64748b}
.dm-ap-badge.unavailable{background:#fee2e2;color:#b91c1c}
[data-theme-dark] .dm-ap-badge.off,:host-context([data-theme="dark"]) .dm-ap-badge.off{background:rgba(148,163,184,.16);color:#94a3b8}
.dm-ap-dot{width:7px;height:7px;border-radius:50%;background:currentColor}
.dm-ap-tools{display:flex;gap:4px;flex:0 0 auto}
.dm-ap-tool{width:37px;height:37px;display:grid;place-items:center;border:1px solid var(--dm-border);border-radius:11px;background:var(--dm-card);color:var(--dm-dim);cursor:pointer}
.dm-ap-tool svg{width:19px;height:19px}
.dm-ap-tool:hover{border-color:#bae6fd;color:var(--dm-blue-deep)}
.dm-ap-top-row{display:flex;align-items:stretch;gap:10px;margin:0 13px}
.dm-ap-hero{position:relative;flex:1 1 50%;min-width:0;display:grid;place-items:center;height:182px;margin:0;border-radius:18px;background:radial-gradient(120% 90% at 50% 8%,rgba(224,242,254,.65),rgba(241,245,249,.35) 60%,transparent);overflow:hidden}
.dm-ap-card.is-run .dm-ap-hero{background:radial-gradient(120% 90% at 50% 8%,rgba(186,230,253,.85),rgba(224,242,254,.35) 62%,transparent)}
.dm-ap-hero svg{width:100%;height:100%;display:block}
.dm-ap-card.is-off .dm-ap-hero,.dm-ap-card.is-unavailable .dm-ap-hero{filter:grayscale(.55) opacity(.62)}
.dm-ap-card.is-standby .dm-ap-hero{filter:saturate(.85)}
@keyframes dmh-spin{to{transform:rotate(360deg)}}
@keyframes dmh-glow{0%,100%{opacity:.55}50%{opacity:1}}
@keyframes dmh-flicker{0%,100%{opacity:.85}30%{opacity:.5}55%{opacity:1}80%{opacity:.6}}
.dmh-spin-drum,.dmh-spin-spray,.dmh-spin-spit{transform-box:view-box;transform-origin:120px 130px}
.dm-ap-card.is-run .dmh-spin-drum{animation:dmh-spin 2.6s linear infinite}
.dm-ap-card.is-run .dmh-spin-spray{animation:dmh-spin 1.3s linear infinite}
.dm-ap-card.is-run .dmh-spin-spit{animation:dmh-spin 3.4s linear infinite}
.dm-ap-card.is-run .dmh-glow{animation:dmh-glow 1.7s ease-in-out infinite}
.dm-ap-card.is-run .dmh-flicker{animation:dmh-flicker 1.5s ease-in-out infinite}
.dm-ap-cycle-side{flex:1 1 50%;min-width:0;display:flex;flex-direction:column;padding:11px 13px;border-radius:16px;background:var(--dm-soft)}
.dm-ap-cycle-cap{display:flex;align-items:center;gap:6px;margin-top:-3px;margin-bottom:15px;font-size:11px;font-weight:900;letter-spacing:1.4px;text-transform:uppercase;color:var(--dm-dim)}
.dm-ap-cycle-list{display:flex;flex-direction:column;flex:1;justify-content:flex-start;gap:4px}
.dm-ap-cycle-row{display:flex;align-items:baseline;justify-content:space-between;gap:8px;min-width:0}
.dm-ap-cycle-row small{flex:0 0 auto;font-size:10.5px;font-weight:900;letter-spacing:.7px;text-transform:uppercase;color:var(--dm-dim)}
.dm-ap-cycle-row b{min-width:0;text-align:right;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13.5px;font-weight:400;letter-spacing:-.1px;color:var(--dm-text)}
.dm-ap-cycle-row-b{padding:4px 8px;border-radius:9px;border:1px solid var(--dm-border);background:var(--dm-card);align-items:center}
.dm-ap-cycle-label{display:flex;align-items:center;gap:5px;min-width:0;flex:1 1 auto;overflow:hidden}
.dm-ap-cycle-label small{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:0 1 auto}
.dm-ap-cycle-row-b b{flex:0 1 auto;max-width:72%}
.dm-ap-cycle-ic{display:flex;align-items:center;flex:0 0 auto;color:var(--dm-blue)}
.dm-colore{border-left:3px solid var(--c)!important;border-radius:4px 9px 9px 4px!important}
.dm-colore small,.dm-colore b,.dm-colore .dm-ap-cycle-ic,.dm-colore .dm-ap-row-label,.dm-colore .dm-ap-row-val{color:var(--c)!important}
.dm-colore.dm-forte b,.dm-colore.dm-forte .dm-ap-row-val{font-size:15.5px;font-weight:700}
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
.dm-ap-chart-svg{width:100%;height:100px;display:block}
.dm-ap-chart-labels{display:flex;justify-content:space-between;margin-top:4px;font-size:10px;font-weight:800;color:var(--dm-dim)}
.dm-ap-chart-labels span{flex:1;text-align:center;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dm-ap-mirino-box{position:relative;touch-action:none}
.dm-ap-mirino{position:absolute;top:0;bottom:0;width:0;pointer-events:none;opacity:0;transition:opacity .08s}
.dm-ap-mirino.si{opacity:1}
.dm-ap-mirino i{position:absolute;top:0;bottom:0;left:-1px;width:2px;background:var(--dm-dim,#94a3b8);opacity:.6}
.dm-ap-mirino b{position:absolute;top:2px;transform:translateX(-50%);white-space:nowrap;font-size:11px;font-weight:800;padding:2px 6px;border-radius:7px;background:var(--dm-finestra,var(--dm-card,#fff));color:var(--dm-finestra-testo,var(--dm-text,#0f172a));border:1px solid var(--dm-border,#cbd5e1);box-shadow:0 4px 14px rgba(15,23,42,.18)}
.dm-ap-chart-empty{padding:20px;text-align:center;font-size:13px;font-weight:700;color:var(--dm-dim)}
.dm-ap-chart-loading{padding:20px;text-align:center;font-size:13px;font-weight:700;color:var(--dm-dim)}
.dm-ap-warn{display:flex;align-items:center;gap:6px;margin:0 13px 12px;padding:9px 12px;border-radius:13px;background:#fee2e2;color:#b91c1c;font-size:13px;font-weight:800}
.dm-ap-warn[hidden]{display:none}
.dm-test-flag{position:absolute;top:10px;right:10px;z-index:2;font-size:11px;font-weight:900;letter-spacing:.5px;text-transform:uppercase;color:#0369a1;background:rgba(14,165,233,.14);border-radius:8px;padding:4px 8px}

.dm-ap-overlay{position:fixed;inset:0;z-index:2147483000;background:var(--dm-velo,rgba(15,23,42,.55));display:flex;align-items:center;justify-content:center;padding:18px;backdrop-filter:blur(var(--dm-velo-sfoca,6px))}
.dm-ap-overlay[hidden]{display:none}
.dm-ap-dialog{width:min(440px,100%);max-height:min(84vh,720px);overflow:auto;background:var(--dm-finestra,var(--dm-card));color:var(--dm-finestra-testo,var(--dm-text));border:1px solid var(--dm-border);border-radius:22px;box-shadow:0 24px 70px rgba(15,23,42,.3)}
.dm-ap-dialog-head{position:sticky;top:0;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:16px 16px 10px;background:var(--dm-finestra,var(--dm-card));border-bottom:1px solid var(--dm-border);z-index:1}
.dm-ap-dialog-head h3{margin:0;font-size:17px;font-weight:900}
.dm-ap-dialog-close{width:30px;height:30px;flex:0 0 auto;display:grid;place-items:center;border:0;border-radius:10px;background:var(--dm-soft);color:var(--dm-dim);cursor:pointer}
.dm-ap-dialog-body{padding:12px 16px 18px;display:flex;flex-direction:column;gap:16px}
.dm-ap-sec-cap{font-size:11.5px;font-weight:900;letter-spacing:1px;text-transform:uppercase;color:var(--dm-blue-deep);margin:0 0 8px;padding-bottom:5px;border-bottom:2px solid var(--dm-border)}
.dm-ap-sec{display:flex;flex-direction:column;gap:6px}
.dm-ap-row{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:9px 11px;border-radius:13px;background:var(--dm-soft)}
.dm-ap-row-label{font-size:14.5px;font-weight:750;color:var(--dm-text)}
.dm-ap-row-val{font-size:14.5px;font-weight:500;color:var(--dm-dim)}
.dm-ap-switch{position:relative;width:38px;height:22px;flex:0 0 auto;border-radius:999px;border:0;background:#cbd5e1;cursor:pointer;transition:background .15s ease}
.dm-ap-switch::after{content:"";position:absolute;top:2px;left:2px;width:18px;height:18px;border-radius:50%;background:#fff;transition:transform .15s ease;box-shadow:0 1px 3px rgba(0,0,0,.3)}
.dm-ap-switch.on{background:#22c55e}
.dm-ap-row-group{display:flex;flex-direction:column;gap:9px;padding:10px 12px;border-radius:13px;background:var(--dm-soft)}
.dm-ap-row-group-top{display:flex;align-items:center;justify-content:space-between;gap:10px}
.dm-ap-row-group-label{display:flex;align-items:center;gap:8px;min-width:0;font-size:14.5px;font-weight:750;color:var(--dm-text)}
.dm-ap-row-group-ic{flex:0 0 auto;display:flex;align-items:center;color:var(--dm-blue)}
.dm-ap-row-chips{display:flex;flex-wrap:wrap;gap:6px}
.dm-ap-chip{display:inline-flex;align-items:center;gap:4px;font-size:11px;font-weight:800;letter-spacing:.2px;padding:5px 10px;border-radius:999px;background:var(--dm-card);border:1px solid var(--dm-border);color:var(--dm-dim);cursor:pointer;line-height:1}
.dm-ap-chip svg{flex:0 0 auto}
.dm-ap-chip b{color:var(--dm-text);font-weight:800}
.dm-ap-chip.on{background:#dcfce7;border-color:#86efac;color:#15803d}
.dm-ap-chip-action{background:var(--dm-blue);border-color:var(--dm-blue);color:#fff}
.dm-ap-sub-back{display:flex;align-items:center;gap:5px;font-size:12.5px;font-weight:800;color:var(--dm-blue);cursor:pointer;margin:0 0 10px}
.dm-ap-switch.on::after{transform:translateX(16px)}
.dm-ap-action-btn{flex:0 0 auto;border:0;border-radius:10px;padding:0 14px;height:26px;background:var(--dm-blue);color:#fff;font-size:13px;font-weight:850;cursor:pointer}
.dm-ap-action-btn:active{filter:brightness(.92)}
.dm-ap-stat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.dm-ap-stat-grid.cols4{grid-template-columns:repeat(4,1fr)}
.dm-ap-stat{display:flex;flex-direction:column;gap:2px;padding:9px 10px;border-radius:13px;background:var(--dm-soft)}
.dm-ap-stat small{font-size:10px;font-weight:900;letter-spacing:.6px;text-transform:uppercase;color:var(--dm-dim)}
.dm-ap-stat b{font-size:15px;font-weight:900;color:var(--dm-text)}
.dm-ap-week-list{display:flex;flex-direction:column;gap:7px}
.dm-ap-week-row{display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid var(--dm-border)}
.dm-ap-week-row:last-child{border-bottom:0}
.dm-ap-week-day{flex:0 0 60px;font-size:13px;font-weight:850;color:var(--dm-text)}
.dm-ap-week-stats{flex:1;display:grid;grid-template-columns:repeat(4,1fr);gap:4px;min-width:0}
.dm-ap-week-stats.cols3{grid-template-columns:repeat(3,1fr)}
.dm-ap-week-stat{display:flex;flex-direction:column;align-items:center;gap:0;min-width:0}
.dm-ap-week-stat small{font-size:9px;font-weight:900;letter-spacing:.4px;text-transform:uppercase;color:var(--dm-dim)}
.dm-ap-week-stat b{font-size:13px;font-weight:850;color:var(--dm-text);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:100%}
.dm-ap-hero{cursor:pointer}
.dm-ap-reset-btn{display:flex;align-items:center;justify-content:center;gap:7px;width:100%;padding:10px;border:0;border-radius:13px;background:var(--dm-blue);color:#fff;font-size:14px;font-weight:850;cursor:pointer}
.dm-ap-reset-note{font-size:12px;color:var(--dm-dim);text-align:center;margin-top:4px}

@media (max-width:600px){
  .dm-ap-overlay{align-items:flex-end;padding:0;backdrop-filter:blur(var(--dm-velo-sfoca,4px))}
  .dm-ap-dialog{width:100%;max-width:100%;height:94vh;max-height:94vh;border-radius:22px 22px 0 0;display:flex;flex-direction:column}
  .dm-ap-dialog-body{flex:1}
}
`;

// COME SI VESTE IL POP-UP. Tinta e trasparenza della finestra, e quanto il
// velo dietro scurisce e sfoca. Tutto attraverso variabili di stile, cosi'
// non tocco il foglio: se un'opzione non c'e' resta il vestito di serie.
// IL MIRINO DEL GRAFICO DEL POP-UP. `box` e' il riquadro che contiene l'svg,
// `punti` i dati disegnati, `scrivi(punto)` la scritta del cartellino.
// L'svg ha viewBox 0 0 300 90 e preserveAspectRatio="none", quindi la x in
// punti-svg e' la stessa frazione della larghezza vera: i dati cominciano dopo
// l'asse (24 su 300) e arrivano in fondo. Col mouse basta passarci sopra, col
// dito si tiene premuto e si trascina (touch-action: none), e alzandolo va via.
export function mirinoGrafico(box, punti, scrivi) {
  if (!box || !punti || punti.length < 2) return;
  box.classList.add("dm-ap-mirino-box");
  const mirino = document.createElement("div");
  mirino.className = "dm-ap-mirino";
  mirino.innerHTML = "<i></i><b></b>";
  box.appendChild(mirino);
  const cartellino = mirino.querySelector("b");
  const ASSE = 24 / 300;

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

export function vestiFinestra(host, cfg) {
  const c = cfg || {};
  const metti = (nome, valore) => {
    if (valore === null || valore === undefined || valore === "") host.style.removeProperty(nome);
    else host.style.setProperty(nome, valore);
  };
  const quanta = (v, difetto) => {
    const n = Number(v);
    return Number.isFinite(n) ? Math.min(100, Math.max(0, n)) : difetto;
  };
  // la finestra: tinta scelta, resa trasparente quanto dice finestra_trasparenza
  if (c.finestra_sfondo) {
    const t = quanta(c.finestra_trasparenza, 0);
    metti("--dm-finestra", t > 0
      ? `color-mix(in srgb, ${c.finestra_sfondo} ${100 - t}%, transparent)`
      : c.finestra_sfondo);
  } else metti("--dm-finestra", null);
  metti("--dm-finestra-testo", c.finestra_scritta || null);
  // il velo dietro: nero quanto dice velo_scuro (0 = niente velo)
  if (c.velo_scuro !== undefined && c.velo_scuro !== null && c.velo_scuro !== "") {
    metti("--dm-velo", `rgba(15,23,42,${quanta(c.velo_scuro, 55) / 100})`);
  } else metti("--dm-velo", null);
  if (c.velo_sfoca !== undefined && c.velo_sfoca !== null && c.velo_sfoca !== "") {
    metti("--dm-velo-sfoca", `${Math.min(30, Math.max(0, Number(c.velo_sfoca) || 0))}px`);
  } else metti("--dm-velo-sfoca", null);
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

// Inverso di meterSeverityColor: per grandezze dove ALTO e' un bene (es.
// carica batteria) invece che un problema (es. carico/CPU/disco).
function inverseSeverityColor(pct) {
  if (pct <= 15) return "#ef4444";
  if (pct <= 30) return "#f97316";
  if (pct <= 60) return "#eab308";
  return "#22c55e";
}

export {
  HERO_BUILDERS,
  CHIP_SVGS,
  ICON_GEAR,
  ICON_CHART,
  ICON_CLOSE,
  ICON_RESTART,
  ICON_BELL,
  ICON_NOTIFCENTER,
  ICON_SPEED,
  ICON_BOLT,
  ICON_FLAG,
  ICON_TIMER,
  ICON_EURO,
  ICON_GLOBE,
  ICON_DOWNLOAD,
  ICON_UPLOAD,
  ICON_TAG,
  ICON_SHIELD,
  ICON_BOX,
  ICON_TREND,
  ICON_PULSE,
  ICON_BATTERY,
  ICON_PLUG,
  ICON_CUBE,
  ICON_MONITOR,
  ICON_ALERT,
  ICON_SAVE,
  ICON_CALENDAR,
  ICON_BACK,
  SETTINGS_GROUP_ICONS,
  WEEKDAY_FULL_IT,
  WEEKDAY_ABBR_IT,
  DEFAULT_STATE_MAP,
  STYLE,
  esc,
  meterSeverityColor,
  inverseSeverityColor,
};
