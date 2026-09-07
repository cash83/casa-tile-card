// -*- coding: utf-8 -*-
// Il foglio di stile della casella.

export const STILE = `
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
/* Altezza imposta dalla griglia: la casella la riempie esatta e NON si
   difende con un minimo suo, se no il cursore dell'altezza del Layout non
   riesce a scendere (era il difetto: sotto le due righe non si muoveva). */
/* L'ALTEZZA GLIELA DAI TU (hai tirato l'angolo nel pop-up): allora la
   casella non si difende con il suo minimo, la prende esatta e il
   contenuto - icona compresa - si rifa' i conti su quella. */
:host([misura-fissa]) ha-card { min-height: 0; height: 100%; max-height: 100%; }
ha-card:active { transform: scale(.985); }
/* ...ma NON dove si compone. Nel riquadro "Dove va ogni pezzo" la casella
   serve a misurare: se si strizza quando la premi, ogni posizione che
   calcolo mentre trascini e' presa dentro a una casella piu' piccola e
   spostata di tre punti, e quando molli - tornando grande - il pezzo fa il
   salto. */
:host([trascinabile]) ha-card:active,
:host([solo-casella]) ha-card:active { transform: none; }
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
.iconaFoto { width: auto; height: var(--alt-icona, 60px); aspect-ratio: 1; max-height: 100%;
  flex: 0 1 auto; object-fit: contain;
  filter: grayscale(.8) brightness(.62); transition: filter .35s ease; }
:host([acceso]) .iconaFoto { filter: drop-shadow(0 0 9px var(--alone2, transparent)); }
.iconaFoto[hidden] { display: none !important; }
:host([grande]) .iconaFoto { width: auto; height: 92px; }
/* 100% = grande quanto il riquadro che le diamo, cosi' segue tutte le
   disposizioni senza doverle riscrivere una per una */
.iconaHa { --mdc-icon-size: 100%; width: auto; height: var(--alt-icona, 60px); aspect-ratio: 1;
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
/* l'aspirapolvere che esce dalla base e va a spasso. L'uscita si vede una
   volta sola - quando cambia stato il disegno si rifa' da capo, ed e' li'
   che la vuoi vedere - il girovagare invece continua. */
@keyframes casa-aspira-esce {
  from { transform: translate(-23px, -3px) scale(.82); }
  to { transform: none; }
}
@keyframes casa-aspira-gira {
  0%, 100% { transform: translateX(-3px) rotate(-2.5deg); }
  50% { transform: translateX(3px) rotate(2.5deg); }
}
svg .aspiraesce { transform-origin: 42px 44px;
  animation: casa-aspira-esce calc(.95s / var(--vel, 1)) cubic-bezier(.2,.8,.3,1) both; }
svg .rotaspazzola { transform-origin: 42px 50px;
  animation: casa-rota calc(2.2s / var(--vel, 1)) linear infinite; }
svg .aspiragira { transform-origin: 42px 44px;
  animation: casa-aspira-gira calc(3.4s / var(--vel, 1)) ease-in-out infinite; }
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
svg.iconafondo, img.fotofondo {
  position: absolute; right: 3%; bottom: 5%; top: auto; transform: none;
  height: 74%; width: auto; max-width: 44%; z-index: 0; pointer-events: none;
  opacity: var(--fondoico, .14);
}
/* la foto tiene le sue proporzioni: schiacciata sarebbe peggio del disegno */
img.fotofondo { object-fit: contain; object-position: right bottom; }
:host([fondo-giu]) img.fotofondo { object-position: left bottom; }
/* Posato a mano il timbro tiene la misura che gli e' stata data, e non le
   due che gli darebbe il foglio di stile a seconda di dove sta la fotina. */
:host([liberi]) svg.iconafondo, :host([liberi]) img.fotofondo,
:host([fondo-giu][liberi]) svg.iconafondo,
:host([fondo-giu][liberi]) img.fotofondo {
  right: auto; top: auto; max-width: none; }
svg.iconafondo[hidden], img.fotofondo[hidden] { display: none !important; }
/* il numerino in fondo alla barra: spesso e' un doppione della percentuale
   grande in mezzo alla casella, e si puo' spegnere */
:host([senzaquanto]) .cursore .quanto { display: none !important; }
/* se la fotina davanti non c'e', il timbro va in basso a sinistra: prende
   il posto che ha lasciato libero e non copre il numero */
:host([fondo-giu]) svg.iconafondo, :host([fondo-giu]) img.fotofondo {
  right: auto; left: 2%; top: auto; bottom: 4%;
  transform: none; height: 72%; max-width: 48%;
}
:host([fondo-giu][compatta]) svg.iconafondo,
:host([fondo-giu][compatta]) img.fotofondo { height: 62%; }
:host([acceso]) svg.iconafondo, :host([acceso]) img.fotofondo {
  opacity: var(--fondoico-acceso, .2); }

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
:host([liberi]) .lettori, :host([liberi]) .colori,
:host([liberi]) .ytattrezzi,
:host([liberi]) .ytcuore {
  position: absolute; max-width: 88%;
  /* Il margine DEVE sparire: a pezzi liberi il posto lo decide lui, e un
     margine rimasto da un'altra disposizione (il volume del vestito
     ytmusic ne aveva 14px) sposta il pezzo di quei pixel senza motivo.
     Serve "!important" perche' le regole delle disposizioni vengono dopo. */
  margin: 0 !important;
  /* niente casella della griglia: vedi qui sotto */
  grid-area: auto;
}
/* LA GABBIA: nelle disposizioni "Musica", "Persone" e vinile la casella e'
   una griglia e ogni pezzo ha la SUA casellina. Un pezzo staccato dal flusso
   dentro a una griglia si muove solo dentro alla sua casellina: larga quanto
   la card (e infatti di lato si spostava) ma alta un dito. Ecco perche' si
   poteva spostare solo a destra e a sinistra. A pezzi liberi la griglia
   sparisce e ognuno si misura sulla casella intera. */
:host([liberi][disposizione="vinile"]) ha-card,
:host([liberi][disposizione="musica"]) ha-card,
:host([liberi][disposizione="persona"]) ha-card { display: block; }
/* mentre sposti i pezzi la barra non deve rispondere al dito, se no ti
   ritrovi a muovere la tapparella invece della barra */
:host([trascinabile]) .cursore, :host([trascinabile]) .comandi,
:host([trascinabile]) .colori, :host([trascinabile]) .tempo,
:host([trascinabile]) .extra, :host([trascinabile]) .lettori,
:host([trascinabile]) .ytcoda {
  pointer-events: none; }
/* Quando anche un solo tasto ha un posto suo, la fila sparisce dal conto e
   ogni tasto si mette dove gli ha detto lui - come gia' fanno le misure. */
:host([tastiliberi]) ha-card > .comandi { display: contents; }
:host([tastiliberi]) .comandi button { position: absolute; margin: 0; }
/* lo stesso per i tastini delle funzioni: quando anche uno solo ha un posto
   suo, la fila sparisce dal conto e ognuno va dove gli ha detto lui */
:host([attrezziliberi]) ha-card > .ytattrezzi { display: contents; }
:host([attrezziliberi]) .ytattrezzi button { position: absolute; margin: 0; }
:host([liberi]) .chips { display: contents; }
:host([liberi]) .chips .metrica { position: absolute; max-width: 88%; }
:host([liberi]) .valore { margin-left: 0; }
/* un pezzo spostato non deve spezzarsi: "74 %" resta "74 %" anche se la
   casella vera e' piu' stretta dell'anteprima */
:host([liberi]) .valore, :host([liberi]) .chips .metrica { white-space: nowrap; }
/* e se proprio non ci sta, si accorcia con i puntini invece di sbordare
   addosso al pezzo di fianco (succedeva sul telefono, dove le caselle hanno
   una forma diversa da quella su cui lui ha composto) */
:host([liberi]) .testi .nome, :host([liberi]) .testi .sotto,
:host([liberi]) .valore, :host([liberi]) .chips .metrica {
  overflow: hidden; text-overflow: ellipsis; }
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
.lettori, .extra, .pannello, .tempo, .comandi, .colori, .ytcoda,
.ytattrezzi, .ytcuore,
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
  grid-template-areas: "attrezzi attrezzi" "lettori lettori" "art testo" "misure misure" "tempo tempo" "comandi comandi" "cursore cursore" "extra extra";
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

/* Erano due numeretti nudi appiccicati a sinistra, uno sopra all'icona e
   uno sotto: si leggevano male e sporcavano il disegno. Adesso sono due
   pastigliette in alto a destra del grafico, con la freccia che dice quale
   e' il massimo e quale il minimo. */

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
.andamento .riga { fill: none; stroke: var(--c-grafico, var(--c)); stroke-width: 1.6;
  stroke-linejoin: round; stroke-linecap: round; vector-effect: non-scaling-stroke; }
.andamento .pieno { fill: var(--velo-grafico, var(--velo, transparent)); stroke: none; }
:host([grande]) .andamento { height: 44px; }
:host([disposizione="persona"]) .andamento,
:host([disposizione="musica"]) .andamento,
:host([disposizione="vinile"]) .andamento { display: none !important; }

/* --- l'onda del tempo (disposizione vinile) --- */
.ondabox { display: none; position: relative; height: calc(26px * var(--lettore, 1)); }
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
  position: absolute; width: calc(11px * var(--lettore, 1)); height: calc(11px * var(--lettore, 1)); border-radius: 50%; background: #fff;
  transform: translate(-50%, -50%); transition: left .9s linear, top .9s linear;
  box-shadow: 0 0 9px color-mix(in srgb, var(--c) 85%, transparent);
}

/* --- disposizione "vinile": copertina tonda, onda, comandi grandi --- */
:host([disposizione="vinile"]) ha-card {
  display: grid; grid-template-columns: minmax(0, 1fr);
  grid-template-areas: "attrezzi" "lettori" "art" "testo" "misure" "tempo" "comandi" "cursore" "extra";
  justify-items: center; align-content: center; row-gap: 0;
}
:host([disposizione="vinile"]) .riga { display: contents; }
:host([disposizione="vinile"]) .iconaHa,
:host([disposizione="vinile"]) .iconaFoto,
:host([disposizione="vinile"]) svg.icona,
:host([disposizione="vinile"]) img.ritratto {
  grid-area: art; height: auto; aspect-ratio: 1;
  width: clamp(calc(74px * var(--lettore, 1)), 42%, calc(116px * var(--lettore, 1)));
  /* al centro della sua riga e SENZA allungarsi: se no la riga bassa la
     stira e la copertina tonda diventa un'ellisse */
  align-self: center; justify-self: center;
  border-radius: 50%; flex: none; margin: 0;
}
:host([disposizione="vinile"][grande]) .iconaHa,
:host([disposizione="vinile"][grande]) .iconaFoto,
:host([disposizione="vinile"][grande]) svg.icona,
:host([disposizione="vinile"][grande]) img.ritratto {
  width: clamp(calc(94px * var(--lettore, 1)), 46%, calc(148px * var(--lettore, 1))); }
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
  font-size: calc(10.5px * var(--lettore, 1)); font-weight: 600; letter-spacing: .06em; text-transform: uppercase;
  color: var(--testo2, var(--secondary-text-color, #8ea0b8));
}
:host([disposizione="vinile"]) .sotto { display: block; margin-top: 4px; }
:host([disposizione="vinile"]) .sotto .brano {
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
  font-size: calc(15px * var(--lettore, 1)); font-weight: 700; line-height: 1.22;
  color: var(--testo, var(--primary-text-color, #eaf1fb));
}
:host([disposizione="vinile"]) .sotto .artista {
  display: block; margin-top: 2px; font-size: calc(12px * var(--lettore, 1)); font-weight: 500;
  color: var(--testo2, var(--secondary-text-color, #8ea0b8));
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
:host([disposizione="vinile"]) .chips { grid-area: misure; width: 100%;
  justify-content: center; margin-top: 8px; }
:host([disposizione="vinile"]) .tempo { grid-area: tempo; width: 100%; margin-top: 12px;
  flex-direction: column; align-items: stretch; gap: 2px; }
:host([disposizione="vinile"]) .tempo .binario { display: none; }
:host([disposizione="vinile"]) .ondabox { display: block; }
:host([disposizione="vinile"]) .tempo .orologio { text-align: center;
  font-size: calc(10.5px * var(--lettore, 1)); }
:host([disposizione="vinile"]) .comandi { grid-area: comandi;
  gap: calc(10px * var(--lettore, 1)); margin-top: calc(12px * var(--lettore, 1)); }
:host([disposizione="vinile"]) .comandi button {
  width: calc(52px * var(--lettore, 1)); height: calc(34px * var(--lettore, 1));
  border-radius: calc(11px * var(--lettore, 1)); font-size: calc(15px * var(--lettore, 1));
  background: rgba(12,18,28,.55);
}
:host([disposizione="vinile"]) .comandi button.grosso {
  width: calc(64px * var(--lettore, 1)); height: calc(40px * var(--lettore, 1));
  border-radius: calc(13px * var(--lettore, 1)); font-size: calc(18px * var(--lettore, 1));
  background: color-mix(in srgb, var(--c) 55%, rgba(12,18,28,.6));
}
:host([disposizione="vinile"]) .cursore { grid-area: cursore; width: 100%; margin-top: 10px; }

/* --- "come la tua ytmusic-card": il vinile con un altro vestito ---------
   Titolo grande a sinistra, onda rossa con i tempi ai due capi, tasti
   tondi col play grosso in mezzo, e sotto le pastiglie "Casuale" e
   "Ripeti" - che sono comandi veri di Home Assistant, non un disegno. */
:host([ytm]) .testa { justify-items: start; }
:host([ytm]) .testa .testi { text-align: left; width: 100%; }
:host([ytm]) .nome { font-size: calc(10px * var(--lettore, 1)); letter-spacing: .08em; opacity: .75; }
:host([ytm]) .sotto .brano { font-size: calc(20px * var(--lettore, 1)); line-height: 1.15;
  -webkit-line-clamp: 1; text-align: left; }
:host([ytm]) .sotto .artista { font-size: calc(13px * var(--lettore, 1)); text-align: left; }
/* i tempi ai due capi dell'onda, come nella sua card */
:host([ytm]) .tempo { margin-top: 8px; }
:host([ytm]) .tempo .orologio { display: flex; justify-content: space-between;
  letter-spacing: .02em; font-size: 0; }
:host([ytm]) .tempo .orologio::before { content: attr(data-ora);
  font-size: calc(11px * var(--lettore, 1)); }
:host([ytm]) .tempo .orologio::after { content: attr(data-fine);
  font-size: calc(11px * var(--lettore, 1)); }
:host([ytm]) .ondabox path.fatta { stroke-width: 3; }
/* i tasti come nella sua card: rettangoli con gli angoli tondi, non cerchi,
   e quello del play grosso e pieno del colore della casella */
:host([ytm]) .comandi { flex-wrap: wrap; justify-content: center;
  gap: calc(10px * var(--lettore, 1)); margin-top: calc(10px * var(--lettore, 1)); }
:host([ytm]) .comandi button {
  width: calc(58px * var(--lettore, 1)); height: calc(46px * var(--lettore, 1));
  border-radius: calc(13px * var(--lettore, 1)); font-size: calc(15px * var(--lettore, 1));
  background: rgba(255,255,255,.10); border-color: rgba(255,255,255,.06);
  box-shadow: none;
}
:host([ytm]) .comandi button svg {
  width: calc(22px * var(--lettore, 1)); height: calc(22px * var(--lettore, 1)); }
/* i disegnini dentro ai tasti prendono il colore della casella: erano
   bianchi fissi e restavano bianchi qualsiasi colore scegliesse */
:host([ytm]) .comandi button { color: var(--c); }
:host([ytm]) .cursore .muto { color: var(--c); }
/* solo quello del play resta chiaro: sta sopra al pieno del colore */
:host([ytm]) .comandi button.grosso { color: #fff; }
:host([ytm]) .comandi button.grosso {
  width: calc(92px * var(--lettore, 1)); height: calc(56px * var(--lettore, 1));
  border-radius: calc(16px * var(--lettore, 1));
  background: var(--c);
  border-color: color-mix(in srgb, var(--c) 60%, transparent);
  box-shadow: 0 6px 18px color-mix(in srgb, var(--c) 38%, transparent);
}
:host([ytm]) .comandi button.grosso svg {
  width: calc(26px * var(--lettore, 1)); height: calc(26px * var(--lettore, 1)); }
/* La copertina ONDEGGIA mentre suona, come nella sua card: resta tonda ma
   il bordo si deforma piano, sale e scende e ruota di un paio di gradi.
   Sono gli stessi fotogrammi della sua "fp-ondula". Da ferma sta ferma, e
   con "riduci le animazioni" acceso non si muove affatto. */
@keyframes casa-ondula {
  0%   { border-radius: 50%; transform: translateY(0) rotate(0deg) scale(1); }
  25%  { border-radius: 40% 60% 55% 45% / 52% 42% 58% 48%;
         transform: translateY(-11px) rotate(-2.6deg) scale(1.05); }
  50%  { border-radius: 60% 40% 46% 54% / 58% 50% 50% 42%;
         transform: translateY(8px) rotate(2.2deg) scale(.94); }
  75%  { border-radius: 46% 54% 60% 40% / 44% 58% 42% 56%;
         transform: translateY(-6px) rotate(1.8deg) scale(1.03); }
  100% { border-radius: 50%; transform: translateY(0) rotate(0deg) scale(1); }
}
/* i tre attributi servono a battere la regola del giradischi qui sopra:
   in questo vestito la copertina non gira, ondeggia */
:host([ytm][anima][gira]) img.ritratto,
:host([ytm][anima]) img.ritratto, :host([ytm][anima]) .iconaFoto,
:host([ytm][anima]) svg.icona, :host([ytm][anima]) .iconaHa {
  animation: casa-ondula var(--casa-ondula, 6s) ease-in-out infinite;
}
/* nel riquadro delle impostazioni e nelle anteprime sta ferma: sono li'
   per farsi guardare, non per lavorare */
:host([in-anteprima]) img.ritratto, :host([solo-casella]) img.ritratto {
  animation: none !important; }

/* "Casse" e "Sorgente" vestiti come le pastiglie della sua card */
:host([ytm]) .extra { margin-top: calc(12px * var(--lettore, 1)); gap: calc(10px * var(--lettore, 1)); }
:host([ytm]) .extra button {
  height: calc(34px * var(--lettore, 1)); padding: 0 calc(14px * var(--lettore, 1));
  font-size: calc(12.5px * var(--lettore, 1)); border-radius: 99px;
  background: rgba(255,255,255,.10); border-color: rgba(255,255,255,.06);
}
/* il volume: barra grossa e piena, con l'altoparlante a DESTRA come da lui */
:host([ytm]) .cursore { margin-top: calc(14px * var(--lettore, 1)); gap: calc(10px * var(--lettore, 1)); }
:host([ytm]) .cursore .quanto { display: none; }
:host([ytm]) .cursore .muto { order: 2; background: none;
  width: calc(22px * var(--lettore, 1)); height: calc(22px * var(--lettore, 1)); }
:host([ytm]) .cursore .muto svg {
  width: calc(20px * var(--lettore, 1)); height: calc(20px * var(--lettore, 1)); }
:host([ytm]) .cursore input { height: calc(18px * var(--lettore, 1)); border-radius: 99px; }
:host([ytm]) .cursore input::-webkit-slider-thumb {
  width: calc(18px * var(--lettore, 1)); height: calc(18px * var(--lettore, 1));
  box-shadow: 0 1px 4px rgba(0,0,0,.5); }
:host([ytm]) .cursore input::-moz-range-thumb {
  width: calc(18px * var(--lettore, 1)); height: calc(18px * var(--lettore, 1));
  box-shadow: 0 1px 4px rgba(0,0,0,.5); }


/* --- la sua ytmusic-card montata dentro alla casella ------------------ */
/* --- I TASTINI DELLE FUNZIONI: cerca, sfoglia, coda, schermo intero.
   Vestiti come "Casse" e "Sorgente", cioe' come il resto di casa-tile:
   non e' una copia della sua card, sono attrezzi nostri. --- */
.ytattrezzi { display: flex; gap: 6px; flex-wrap: wrap; width: 100%;
  min-width: 0; }
.ytattrezzi[hidden] { display: none !important; }
.ytattrezzi button { all: unset; cursor: pointer;
  width: calc(30px * var(--lettore, 1)); height: calc(30px * var(--lettore, 1));
  display: grid; place-items: center; border-radius: 10px;
  /* fondo scuro suo, non un velo bianco: sopra a una copertina chiara e
     movimentata i tastini sparivano e non si capiva piu' dove fossero */
  background: rgba(10,15,23,.55);
  backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
  border: 1px solid rgba(255,255,255,.16); opacity: .95;
  color: #fff; text-shadow: 0 1px 2px rgba(0,0,0,.6); }
.ytattrezzi button:hover { opacity: 1; background: rgba(255,255,255,.14); }
.ytattrezzi button[aperto] { opacity: 1;
  background: color-mix(in srgb, var(--c) 45%, rgba(12,18,28,.6));
  border-color: color-mix(in srgb, var(--c) 55%, transparent); }
.ytattrezzi ha-icon { --mdc-icon-size: calc(17px * var(--lettore, 1)); display: block; }

/* --- il cuoricino --- */
.ytcuore { all: unset; cursor: pointer; width: 28px; height: 28px;
  display: grid; place-items: center; border-radius: 50%; opacity: .75; }
.ytcuore[hidden] { display: none !important; }
.ytcuore:hover { opacity: 1; background: rgba(255,255,255,.12); }
.ytcuore[acceso] { opacity: 1; color: var(--casa-acceso, var(--c)); }
.ytcuore ha-icon { --mdc-icon-size: 19px; display: block; }

/* le fonti stanno DENTRO al riquadro dello sfogliare, non in facciata */
.pannello.sfoglia .s-fonti { display: flex; gap: 5px; flex-wrap: wrap;
  margin: 4px 0 6px; }
.pannello.sfoglia .s-fonti button { all: unset; cursor: pointer;
  font-size: 11px; padding: 3px 9px; border-radius: 999px;
  background: rgba(255,255,255,.07); }
.pannello.sfoglia .s-fonti button[scelta] { background: #fff; color: #111; }

/* I riquadri nuovi NON prendono la trasparenza che lui ha messo agli altri:
   sono elenchi da leggere, e con il lettore che si vede in mezzo alle righe
   non si capisce piu' niente. Fondo pieno. */
.pannello.cerca, .pannello.sfoglia, .pannello.incoda {
  background: var(--lista-bg, #0e141d);
  backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); }
/* la ricerca e lo sfoglia sono scelte al volo: stanno in basso e non
   coprono quello che sta suonando */
.pannello.cerca, .pannello.sfoglia {
  inset: auto 8px 8px 8px; max-height: min(68%, 330px); }
/* la coda invece e' una schermata a se', come la linguetta "In coda" della
   sua card: si prende tutta la casella e si torna indietro con la X. Deve
   fare cosi', se no in una casella a pezzi liberi finisce sotto o sopra ai
   pezzi sistemati a mano. */
.pannello.incoda { inset: 8px; max-height: none; }

/* Dentro ai riquadri la casella non e' piu' "una cosa da premere": la
   manina resta solo su quello che si preme davvero. Nel campo di ricerca
   ci vuole la barretta del testo. */
.pannello, .pannello *, .menucoda, .menucoda * { cursor: default; }
.pannello button, .pannello button *,
.pannello .voce, .pannello .voce *,
.pannello .esito, .pannello .esito *,
.pannello .coda-riga, .pannello .coda-riga *,
.menucoda button, .menucoda button * { cursor: pointer; }
.pannello input, .pannello .c-testo { cursor: text; }

/* --- il riquadro per sfogliare --- */
.pannello.sfoglia .s-indietro { all: unset; cursor: pointer; width: 22px;
  height: 22px; display: grid; place-items: center; border-radius: 50%;
  font-size: 17px; opacity: .8; }
.pannello.sfoglia .s-indietro[hidden] { display: none; }
.pannello.sfoglia .s-titolo { flex: 1 1 auto; min-width: 0; font-size: 12.5px;
  font-weight: 700; white-space: nowrap; overflow: hidden;
  text-overflow: ellipsis; }
.pannello.sfoglia .s-elenco { overflow: auto; display: flex;
  flex-direction: column; gap: 2px; }
.pannello.sfoglia .voce { display: flex; align-items: center; gap: 8px;
  padding: 4px 6px; border-radius: 9px; cursor: pointer; }
.pannello.sfoglia .voce:hover { background: rgba(255,255,255,.1); }
.pannello.sfoglia .voce img, .pannello.sfoglia .voce i.vuota {
  width: 32px; height: 32px; border-radius: 6px; flex: none; object-fit: cover;
  background: rgba(255,255,255,.08); display: grid; place-items: center; }
.pannello.sfoglia .voce .dati { display: flex; flex-direction: column;
  min-width: 0; flex: 1 1 auto; line-height: 1.15; }
.pannello.sfoglia .voce b { font-size: 12.5px; font-weight: 600;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.pannello.sfoglia .voce i { font-size: 11px; font-style: normal; opacity: .55;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.pannello.sfoglia .voce .piu { all: unset; cursor: pointer; width: 24px;
  height: 24px; flex: none; display: grid; place-items: center;
  border-radius: 50%; opacity: .6; }
.pannello.sfoglia .voce .piu:hover { opacity: 1;
  background: rgba(255,255,255,.16); }
.pannello.sfoglia .s-nota { font-size: 12px; opacity: .6; padding: 8px 4px; }

/* --- il menu "che ne faccio" --- */
.menucoda { position: absolute; inset: auto 10px 10px 10px; z-index: 6;
  display: flex; flex-direction: column; gap: 2px; padding: 6px;
  border-radius: 14px; background: var(--lista-bg, #0e141d);
  border: 1px solid rgba(255,255,255,.12);
  box-shadow: 0 12px 32px rgba(0,0,0,.55); }
.menucoda[hidden] { display: none !important; }
.menucoda button { all: unset; cursor: pointer; display: flex; gap: 9px;
  align-items: center; padding: 7px 9px; border-radius: 9px; font-size: 12.5px; }
.menucoda button:hover { background: rgba(255,255,255,.12); }
.menucoda ha-icon { --mdc-icon-size: 16px; opacity: .8; }

/* --- la ricerca --- */
.pannello.cerca .c-riga { display: flex; gap: 6px; margin: 4px 0 6px; }
.pannello.cerca .c-testo { flex: 1 1 auto; min-width: 0; all: unset;
  box-sizing: border-box; padding: 7px 10px; border-radius: 10px;
  background: rgba(255,255,255,.07); font-size: 13px; color: inherit;
  /* "all: unset" azzera anche il mestiere del campo di testo: senza queste
     righe niente barretta lampeggiante, niente selezione, e il puntatore
     resta la freccia invece di diventare il trattino. Vanno scritte QUI
     dentro, dopo l'azzeramento: da fuori le rimangiava. */
  cursor: text; caret-color: var(--casa-acceso, currentColor);
  user-select: text; -webkit-user-select: text; }
/* anche la fascia intorno al campo: il trattino appena ci arrivi sopra */
.pannello.cerca .c-riga { cursor: text; }
.pannello.cerca .c-testo::placeholder { color: currentColor; opacity: .45; }
.pannello.cerca .c-vai { all: unset; cursor: pointer; width: 32px; height: 32px;
  display: grid; place-items: center; border-radius: 10px;
  background: var(--casa-acceso, var(--c)); color: #fff; }
.pannello.cerca .c-tipi { display: flex; gap: 5px; flex-wrap: wrap;
  margin-bottom: 6px; }
.pannello.cerca .c-tipi button { all: unset; cursor: pointer; font-size: 11px;
  padding: 3px 9px; border-radius: 999px; background: rgba(255,255,255,.07); }
.pannello.cerca .c-tipi button[scelto] { background: #fff; color: #111; }
.pannello.cerca .c-esiti { overflow: auto; display: flex;
  flex-direction: column; gap: 2px; }
.pannello.cerca .esito { display: flex; align-items: center; gap: 8px;
  padding: 4px 6px; border-radius: 9px; cursor: pointer; }
.pannello.cerca .esito:hover { background: rgba(255,255,255,.1); }
.pannello.cerca .esito img, .pannello.cerca .esito i.vuota {
  width: 30px; height: 30px; border-radius: 6px; flex: none; object-fit: cover;
  background: rgba(255,255,255,.08); }
.pannello.cerca .esito .dati { display: flex; flex-direction: column;
  min-width: 0; line-height: 1.15; }
.pannello.cerca .esito b { font-size: 12.5px; font-weight: 600;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.pannello.cerca .esito i { font-size: 11px; font-style: normal; opacity: .55;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.pannello.cerca .c-nota { font-size: 12px; opacity: .6; padding: 8px 4px; }

:host([pienoschermo]) { position: fixed; inset: 0; z-index: 99;
  height: 100% !important; max-height: none !important; }
:host([pienoschermo]) ha-card {
  /* "100dvh" e non "100%": sul telefono la barra degli indirizzi entra e
     esce, e con l'altezza vecchia il lettore sbordava sopra e sotto */
  height: 100dvh !important; max-height: none !important;
  border-radius: 0; padding: clamp(16px, 4vh, 40px);
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; gap: 12px;
  /* niente scorrimento: il lettore e' calcolato per starci dentro, e con
     "auto" comparivano barre e si scendeva su una pagina nera vuota */
  overflow: hidden;
  /* FONDO PIENO. La casella sulla plancia puo' essere trasparente quanto
     vuole - li' dietro c'e' la plancia ed e' bello cosi'. A schermo intero
     no: si vedevano le altre caselle attraverso il lettore. */
  background: #05080d; }
/* la copertina sfocata fa da sfondo, come si conviene */
:host([pienoschermo]) .copertina { display: block !important; inset: 0 !important;
  opacity: 1; z-index: 0; }
/* nessun pezzo si allunga: stanno tutti insieme al centro, senza buchi */
:host([pienoschermo]) ha-card > * { flex: 0 0 auto; }
/* A SCHERMO INTERO LE POSIZIONI LIBERE NON VALGONO. Sono percentuali scelte
   su una casella piccola: su tutto il monitor spalmano i pezzi agli angoli.
   Qui rimetto tutto in colonna, largo al massimo quanto un lettore vero e
   centrato. Le posizioni restano salvate: tornando dalla casella piccola
   sono ancora quelle. */
:host([pienoschermo]) ha-card > .testa,
:host([pienoschermo]) ha-card > .riga { display: flex !important;
  flex-direction: column; align-items: center; }
:host([pienoschermo]) .testi, :host([pienoschermo]) .chips,
:host([pienoschermo]) .valore, :host([pienoschermo]) svg.icona,
:host([pienoschermo]) img.ritratto, :host([pienoschermo]) .iconaHa,
:host([pienoschermo]) .iconaFoto, :host([pienoschermo]) .cursore,
:host([pienoschermo]) .comandi, :host([pienoschermo]) .tempo,
:host([pienoschermo]) .extra, :host([pienoschermo]) .lettori,
:host([pienoschermo]) .colori, :host([pienoschermo]) .ytattrezzi,
:host([pienoschermo]) .ytcuore, :host([pienoschermo]) .comandi button,
:host([pienoschermo]) .ytattrezzi button {
  position: static !important; left: auto !important; top: auto !important;
  right: auto !important; bottom: auto !important;
  width: auto !important; height: auto !important;
  max-width: none !important; max-height: none !important;
  transform: none !important; margin: 0 !important; }
/* la larghezza del lettore vale per i PEZZI, non per gli sfondi: prima la
   davo anche alla copertina, e infatti lo sfondo copriva solo una striscia
   a sinistra invece di tutta la pagina */
:host([pienoschermo]) ha-card > *:not(.copertina):not(.cielo):not(.pannello):not(.menucoda):not(.velo):not(.andamento),
:host([pienoschermo]) .testa,
:host([pienoschermo]) .riga { width: min(760px, 92%); }
:host([pienoschermo]) .copertina { position: absolute !important;
  inset: 0 !important; width: auto !important; height: auto !important; }
/* E L'ORDINE LO DECIDO IO, invece di sperare che i pezzi si dispongano da
   soli: prima i tastini, poi la copertina, il titolo, l'onda del tempo, i
   comandi, il volume e le casse. Senza questo il titolo restava appiccicato
   in cima e in mezzo si apriva un buco. */
:host([pienoschermo]) ha-card > .testa { position: static !important;
  left: auto !important; top: auto !important; right: auto !important;
  display: flex !important; flex-direction: column; align-items: center;
  order: 3; }
:host([pienoschermo]) .ytattrezzi { order: 1; }
:host([pienoschermo]) .ytcuore { order: 4; }
:host([pienoschermo]) ha-card > .riga { order: 2; }
:host([pienoschermo]) .chips { order: 4; }
:host([pienoschermo]) .tempo { order: 5; }
:host([pienoschermo]) .comandi { order: 6; }
:host([pienoschermo]) .cursore { order: 7; }
:host([pienoschermo]) .extra { order: 8; }
:host([pienoschermo]) .lettori { order: 0; }
:host([pienoschermo]) .testi { text-align: center; }
/* la copertina grande, come si conviene a uno schermo intero */
:host([pienoschermo]) svg.icona, :host([pienoschermo]) img.ritratto,
:host([pienoschermo]) .iconaHa, :host([pienoschermo]) .iconaFoto {
  /* La copertina si misura su TUTTE E DUE le dimensioni: sul telefono, alto
     e stretto, il 44% dell'altezza era piu' largo dello schermo e spingeva
     fuori i tastini sopra e le casse sotto. */
  width: min(40vh, 82vw, 470px) !important;
  height: min(40vh, 82vw, 470px) !important; }
/* a schermo intero anche il resto cresce: titolo, tasti e onda */
:host([pienoschermo]) .nome { font-size: clamp(20px, 2.4vw, 30px); }
:host([pienoschermo]) .sotto { font-size: clamp(13px, 1.3vw, 17px); }
/* Le misure vanno con "!important", se no le mangia la regola qui sopra che
   rimette i pezzi in colonna azzerando larghezze e altezze. Era per questo
   che i tasti restavano piccoli come nella casella. */
:host([pienoschermo]) .comandi button { width: 48px !important;
  height: 48px !important; font-size: 20px; }
:host([pienoschermo]) .comandi button.grosso { width: 62px !important;
  height: 62px !important; font-size: 26px; }
/* e i tastini delle funzioni, che erano rimasti tali e quali */
:host([pienoschermo]) .ytattrezzi { gap: 10px; }
:host([pienoschermo]) .ytattrezzi button { width: 44px !important;
  height: 44px !important; border-radius: 13px; }
:host([pienoschermo]) .ytattrezzi ha-icon { --mdc-icon-size: 24px; }
:host([pienoschermo]) .ytcuore { width: 42px !important; height: 42px !important; }
:host([pienoschermo]) .ytcuore ha-icon { --mdc-icon-size: 26px; }
/* il volume piu' spesso, se no su tutto lo schermo e' un filo */
:host([pienoschermo]) .cursore input[type="range"] { height: 22px; }
/* Anche qui serve "!important": la barra del volume e l'onda del tempo
   restavano larghe 165px perche' la regola che rimette i pezzi in colonna
   azzera le larghezze. */
:host([pienoschermo]) .cursore, :host([pienoschermo]) .tempo,
:host([pienoschermo]) .testa, :host([pienoschermo]) .testi {
  width: min(760px, 92%) !important; }

/* --- SUL TELEFONO: schermi alti e stretti, o bassi e larghi. Tutto si
   stringe, se no il lettore non ci sta e viene tagliato ai bordi. --- */
@media (max-width: 620px) {
  :host([pienoschermo]) ha-card { padding: 10px; gap: 8px; }
  :host([pienoschermo]) ha-card > *:not(.copertina):not(.cielo):not(.pannello):not(.menucoda):not(.velo):not(.andamento):not(.ytcuore),
  :host([pienoschermo]) .testa,
  :host([pienoschermo]) .riga,
  :host([pienoschermo]) .cursore, :host([pienoschermo]) .tempo,
  :host([pienoschermo]) .testi { width: 96% !important; }
  :host([pienoschermo]) .comandi button { width: 42px !important;
    height: 42px !important; font-size: 17px; }
  :host([pienoschermo]) .comandi button.grosso { width: 54px !important;
    height: 54px !important; font-size: 22px; }
  :host([pienoschermo]) .ytattrezzi button { width: 40px !important;
    height: 40px !important; }
  :host([pienoschermo]) .ytattrezzi ha-icon { --mdc-icon-size: 21px; }
  :host([pienoschermo]) .ytcuore { width: 36px !important; height: 36px !important; }
  :host([pienoschermo]) .nome { font-size: 19px; }
  :host([pienoschermo]) .sotto { font-size: 13.5px; }
  :host([pienoschermo]) .tempo { transform: none; }
  :host([pienoschermo]) .pannello { width: 94% !important;
    top: 4% !important; bottom: 4% !important; }
}
/* schermi bassi (telefono coricato, tablet piccoli): la copertina cede lei */
@media (max-height: 700px) {
  :host([pienoschermo]) svg.icona, :host([pienoschermo]) img.ritratto,
  :host([pienoschermo]) .iconaHa, :host([pienoschermo]) .iconaFoto {
    width: min(34vh, 70vw, 470px) !important;
    height: min(34vh, 70vw, 470px) !important; }
  :host([pienoschermo]) ha-card { gap: 7px; }
}

/* --- i riquadri a schermo intero: al centro, non larghi come il monitor,
   e con le scritte leggibili da lontano --- */
:host([pienoschermo]) .pannello {
  left: 50% !important; right: auto !important;
  transform: translateX(-50%);
  width: min(760px, 92%) !important;
  top: 7% !important; bottom: 7% !important; max-height: none !important; }
:host([pienoschermo]) .pannello .p-testa { font-size: 15px; padding-bottom: 9px; }
:host([pienoschermo]) .pannello .p-chiudi { width: 34px; height: 34px;
  font-size: 26px; }
:host([pienoschermo]) .coda-riga { padding: 7px 9px; }
:host([pienoschermo]) .coda-riga .cop { width: 42px; height: 42px; }
:host([pienoschermo]) .coda-riga .dati b, :host([pienoschermo]) .voce b,
:host([pienoschermo]) .esito b { font-size: 15.5px; }
:host([pienoschermo]) .coda-riga .dati i, :host([pienoschermo]) .voce i,
:host([pienoschermo]) .esito i { font-size: 13px; }
:host([pienoschermo]) .voce img, :host([pienoschermo]) .voce i.vuota,
:host([pienoschermo]) .esito img, :host([pienoschermo]) .esito i.vuota {
  width: 44px; height: 44px; }
:host([pienoschermo]) .voce, :host([pienoschermo]) .esito { padding: 7px 9px; }
:host([pienoschermo]) .s-fonti button, :host([pienoschermo]) .c-tipi button {
  font-size: 13.5px; padding: 5px 13px; }
:host([pienoschermo]) .pannello.cerca .c-testo { font-size: 15px;
  padding: 10px 13px; }
:host([pienoschermo]) .pannello.cerca .c-vai { width: 40px; height: 40px; }
:host([pienoschermo]) .menucoda button { font-size: 15px; padding: 10px 12px; }
:host([pienoschermo]) .tempo { transform: scale(1.15);
  transform-origin: center; }
:host([pienoschermo]) .comandi { display: flex !important;
  justify-content: center; gap: 12px; }
:host([pienoschermo]) .ytattrezzi { display: flex !important;
  justify-content: center; }

/* LA CODA - l'elenco dei brani che verranno. Stessa aria della sua card:
   fondo scuro appena appoggiato, righe basse, la copertina piccola a
   sinistra e i tre tastini che compaiono quando ci passi sopra. */
.ytcoda { display: flex; flex-direction: column; gap: 4px; min-height: 0;
  width: 100%; overflow: hidden; flex: 1 1 auto; }
.ytcoda[hidden] { display: none; }
/* il titolo lo mette gia' la testata del riquadro */
.coda-testa { display: none; }
.coda-lista { display: flex; flex-direction: column; gap: 2px;
  overflow: auto; scrollbar-width: thin; min-height: 0; }
.coda-vuota { font-size: 12px; opacity: .6; padding: 6px 2px; }
.coda-riga { display: flex; align-items: center; gap: 8px; padding: 4px 6px;
  border-radius: 9px; cursor: pointer; position: relative;
  background: var(--casa-riga, rgba(255,255,255,.04)); }
.coda-riga:hover { background: rgba(255,255,255,.1); }
.coda-riga[adesso] { background: rgba(255,255,255,.14);
  box-shadow: inset 3px 0 0 0 var(--casa-acceso, #ff2d55); }
.coda-riga .cop { width: 30px; height: 30px; border-radius: 6px; flex: none;
  object-fit: cover; background: rgba(255,255,255,.08); display: grid;
  place-items: center; overflow: hidden; }
.coda-riga i.cop ha-icon { --mdc-icon-size: 16px; opacity: .5; }
.coda-riga .suona { --mdc-icon-size: 15px; flex: none; opacity: .85;
  color: var(--casa-acceso, currentColor); }
.coda-riga .dati { display: flex; flex-direction: column; min-width: 0;
  flex: 1 1 auto; line-height: 1.15; }
.coda-riga .dati b { font-size: 12.5px; font-weight: 600;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.coda-riga .dati i { font-size: 11px; font-style: normal; opacity: .6;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
:host([disposizione="musica"]) .ytattrezzi,
:host([disposizione="vinile"]) .ytattrezzi { grid-area: attrezzi;
  width: 100%; justify-content: center; margin-bottom: 8px; }
.coda-riga .tasti { display: flex; gap: 2px; flex: none; opacity: 0;
  transition: opacity .15s; }
.coda-riga:hover .tasti, .coda-riga[adesso] .tasti { opacity: 1; }
.coda-riga .tasti button { all: unset; width: 22px; height: 22px;
  display: grid; place-items: center; border-radius: 50%; cursor: pointer;
  color: inherit; opacity: .75; }
.coda-riga .tasti ha-icon { --mdc-icon-size: 15px; display: block; }
.coda-riga .tasti button:hover { opacity: 1; background: rgba(255,255,255,.16); }
@media (hover: none) { .coda-riga .tasti { opacity: 1; } }

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
/* porta la coda su un'altra cassa, e svuota la coda */
.pannello .voce .tras {
  appearance: none; border: none; padding: 0; flex: none; cursor: pointer;
  width: 26px; height: 26px; border-radius: 50%;
  background: rgba(255,255,255,.08); color: var(--primary-text-color, #eaf1fb);
  display: grid; place-items: center;
}
.pannello .voce .tras svg { width: 15px; height: 15px; fill: currentColor; }
.pannello .voce .tras:hover { background: color-mix(in srgb, var(--c) 40%, rgba(255,255,255,.1)); }
.pannello .voce .tras[hidden] { display: none !important; }
.pannello .svuota-coda {
  appearance: none; border: none; cursor: pointer; font: inherit; font-size: 12px;
  margin-top: 8px; padding: 7px 10px; border-radius: 9px; width: 100%;
  background: rgba(255,255,255,.06); color: var(--primary-text-color, #eaf1fb);
  display: flex; align-items: center; gap: 8px;
}
.pannello .svuota-coda svg { width: 16px; height: 16px; fill: currentColor; flex: none; }
.pannello .svuota-coda:hover { background: rgba(255,255,255,.12); }
.pannello .svuota-coda[hidden] { display: none !important; }
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

/* PEZZI LIBERI: LE SCRITTE NON CRESCONO CON LA CASELLA.
   Le posizioni che lui sceglie sono percentuali, ma i caratteri no: la card
   ha regole che li ingrandiscono quando la casella e' larga. Sul computer
   "Casa Batteria" e' stretta (titolo piccolo, ed e' su quello che ha
   composto); sul telefono la stessa casella e' larga il triplo, il titolo
   cresce e finisce addosso alla misura di fianco. Con i pezzi liberi tengo
   quindi la misura compatta ovunque: la disposizione composta una volta
   vale identica su qualunque schermo. Se un pezzo lo vuole piu' grande, c'e'
   il quadratino giallo. */
/* a schermo intero invece comanda il lettore grande */
:host([pienoschermo]) .nome, :host([pienoschermo]) .sotto,
:host([pienoschermo]) .valore { font-size: revert !important; }

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
  border: 1px dashed var(--casa-border, #33465f);
  /* cosi' l'anteprima mostra il vestito vero del pop-up - tinta, foto e
     trasparenza - invece di restare sempre grigia */
  background: var(--fin-bg-ant, rgba(255,255,255,.03));
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
.popup-anteprima .pa-dentro { display: flex; flex-wrap: wrap; gap: 10px;
  align-items: flex-start; }
/* IL TAGLIO SEGUE GLI ANGOLI. Qui c'e' un "overflow: hidden" che serve
   (una scheda larga sfondava la colonna dell'anteprima e faceva comparire
   e sparire la barra di scorrimento), ma tagliava di squadro: l'alone
   della casella accesa, che sborda apposta, veniva mozzato negli angoli e
   si vedevano quattro sfumature quadrate. Succedeva SOLO qui, nelle
   impostazioni, perche' questa regola vale solo per l'anteprima. Adesso il
   taglio ha gli stessi angoli della casella. */
/* IL QUADRATINO PER TIRARE. Nell'anteprima delle impostazioni ogni scheda
   ha un angolo da prendere e trascinare per allargarla e alzarla, come si
   fa con i pezzi liberi. Si vede quando ci passi sopra. */
.popup-anteprima .vestito, .popup-anteprima .cella-mia { position: relative; }
.popup-anteprima .maniglia {
  position: absolute; right: 2px; bottom: 2px; width: 18px; height: 18px;
  z-index: 4; cursor: nwse-resize; opacity: 0; touch-action: none;
  transition: opacity .15s ease, transform .12s ease;
  border-radius: 5px; background: var(--primary-color, #2b8ee6);
  box-shadow: 0 0 0 2px rgba(0,0,0,.35);
}
.popup-anteprima .vestito:hover > .maniglia,
.popup-anteprima .cella-mia:hover > .maniglia,
.popup-anteprima .maniglia[tirando] { opacity: 1; transform: scale(1.25); }
.popup-anteprima .maniglia::after {
  content: ""; position: absolute; inset: 4px 4px auto auto;
  width: 8px; height: 8px; border-right: 2px solid #fff; border-bottom: 2px solid #fff;
}
.popup-anteprima .vestito[inmano], .popup-anteprima .cella-mia[inmano] {
  opacity: .55; cursor: grabbing;
  outline: 2px dashed var(--primary-color, #2b8ee6); outline-offset: -2px;
  border-radius: var(--casa-radius, 18px);
}
.popup-anteprima .misurino {
  position: absolute; right: 24px; bottom: 2px; z-index: 5;
  background: #0b1220; color: #eaf1fb; font-size: 11px; font-weight: 700;
  padding: 2px 6px; border-radius: 6px; pointer-events: none;
  border: 1px solid var(--primary-color, #2b8ee6);
}
.popup-anteprima .pa-dentro > * { min-width: 0; max-width: 100%; overflow: hidden;
  border-radius: var(--casa-radius, 18px); flex: 0 0 100%; }
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
  /* con piu' colonne serve piu' spazio: la finestra si allarga da sola */
  width: min(var(--fin-max, 560px), 100%); max-height: 84vh; overflow: auto;
  background: var(--fin-bg, var(--casa-popup-bg, #0f1620));
  background-size: cover; background-position: center;
  border: 1px solid var(--casa-border, #1e2b3d);
  border-radius: 26px; padding: 18px;
  box-shadow: 0 30px 80px rgba(0,0,0,.6);
  animation: casa-apre-sfuma var(--fin-dur, 220ms) cubic-bezier(.2,.7,.3,1);
}
/* COME SI APRE. Tre modi piu' il niente, si sceglie dalle impostazioni. */
@keyframes casa-apre-sfuma { from { transform: translateY(12px); opacity: 0; } }
@keyframes casa-apre-sboccia { from { transform: scale(.22); opacity: 0; } }
@keyframes casa-apre-basso { from { transform: translateY(64%); opacity: 0; } }
@keyframes casa-velo-entra { from { opacity: 0; } }
@keyframes casa-chiude { to { transform: translateY(10px); opacity: 0; } }
/* la finestra nasce dal punto dove sta la casella che hai toccato: il punto
   glielo calcolo io quando apro, qui c'e' solo dove metterlo */
:host([apertura="sboccia"]) .finestra {
  animation-name: casa-apre-sboccia;
  transform-origin: var(--nasce, 50% 50%);
}
:host([apertura="basso"]) .finestra {
  animation-name: casa-apre-basso; transform-origin: 50% 100%;
}
:host([apertura="niente"]) .finestra,
:host([apertura="niente"]) .velo[aperto] { animation: none; }
.velo[aperto] { animation: casa-velo-entra var(--fin-dur, 220ms) ease-out; }
/* chiudere deve sembrare piu' svelto che aprire: due terzi del tempo */
:host([chiude]) .finestra {
  animation: casa-chiude calc(var(--fin-dur, 220ms) * .66) ease-in forwards;
}
:host([chiude]) .velo[aperto] {
  animation: casa-velo-entra calc(var(--fin-dur, 220ms) * .66) ease-in reverse forwards;
}
@media (prefers-reduced-motion: reduce) {
  .finestra, .velo[aperto] { animation: none !important; }
}
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
/* LE SCHEDE DEL POP-UP, AFFIANCATE. Quante ne stanno per riga lo decidi
   tu dalle impostazioni; con una sola colonna - com'e' sempre stato -
   restano una sotto l'altra e non cambia niente. Ogni scheda puo' occupare
   piu' di una colonna: quanto, glielo dice "--sua-col". */
/* IN FILA, CHE VA A CAPO DA SOLA. Prima era una griglia a dodici colonne
   e la larghezza poteva essere solo uno scatto su dodici. Cosi' invece
   ognuna e' larga la percentuale che le si e' data - anche il 37% - e
   quando non ci sta piu' si va a capo. Lo stacco fra le schede lo tolgo
   dalla larghezza (vedi _stiliMisura), se no due da meta' non ci stanno. */
.f-corpo { display: flex; flex-wrap: wrap; align-items: flex-start; gap: 10px; }
.f-corpo > * { display: block; min-width: 0; flex: 0 0 100%; max-width: 100%; }
/* Sul telefono la finestra e' larga quanto lo schermo: due schede
   affiancate non ci starebbero, quindi ognuna si prende tutta la riga. */
@media (max-width: 620px) {
  .f-corpo > * { flex-basis: 100% !important; max-width: 100% !important; }
}
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
/* LA BUSTA DEVE AVERE GLI STESSI ANGOLI DELLA CASELLA CHE CONTIENE.
   Aveva 14 punti di raggio mentre la casella ne ha 18: negli angoli
   restava scoperto uno spicchio della busta, che si vedeva come una
   sfumatura quadrata. E "overflow: hidden" tagliava di netto l'alone
   della casella accesa, che sborda apposta: per questo il difetto si
   vedeva sulle caselle accese e non su quelle spente. */
.popup-anteprima .vestito[vestita],
.f-corpo .vestito[vestita] { border-radius: var(--casa-radius, 18px); }
/* IL TAGLIO SEGUE GLI ANGOLI. Dando un'altezza a una scheda, il suo
   riquadro taglia quello che avanza: senza angoli arrotondati mozzava
   l'alone della casella accesa e si vedevano quattro sfumature quadrate.
   Vale per le buste del pop-up e per le caselle dentro alle griglie. */
.f-corpo .vestito, .popup-anteprima .vestito,
.griglia-mia > .cella-mia { border-radius: var(--casa-radius, 18px); }
@media (prefers-reduced-motion: reduce) { svg .an { animation: none !important; } }
`;

// che colore ha una luce bianca di tanti gradi kelvin: serve alle strisce
// che il bianco non ce l'hanno e lo devono mescolare coi colori
