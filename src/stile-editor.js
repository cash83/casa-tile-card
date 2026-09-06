// -*- coding: utf-8 -*-
// Il foglio di stile del riquadro delle impostazioni.

export const STILE_EDITOR = `
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
.gruppoBox { margin-top: 12px; }
.gruppoBox[hidden] { display: none !important; }
.gruppoBox > .titoloGruppo { margin: 0 0 6px; }
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
/* IL QUADRATINO DELLA GRANDEZZA DELLA CASELLA. Stesso giallo di quello
   dei pezzi, ma un filo piu' grosso: quello cambia un pezzo, questo
   cambia tutta la casella. */
.pista-grandezza {
  position: absolute; z-index: 6; width: 22px; height: 22px;
  border-radius: 7px; background: #ffc400; cursor: nwse-resize;
  touch-action: none;
  box-shadow: 0 2px 7px rgba(0,0,0,.55), 0 0 0 2px rgba(0,0,0,.35);
  display: grid; place-items: center; transition: transform .12s ease;
}
.pista-grandezza::after { content: ""; width: 9px; height: 9px;
  margin: -2px -2px 0 0;
  border-right: 2.5px solid #241a02; border-bottom: 2.5px solid #241a02; }
.pista-grandezza:hover { transform: scale(1.15); }
.pista-grandezza.inmano { transform: scale(1.3); }
.pista-grandezza[hidden] { display: none !important; }
.pista-grande-targa {
  position: absolute; z-index: 7; pointer-events: none;
  background: #0b1220; color: #ffc400; font-size: 11px; font-weight: 700;
  padding: 2px 6px; border-radius: 6px; border: 1px solid #ffc400;
}
.pista-maniglia {
  position: absolute; width: 34px; height: 34px; padding: 0; border: none;
  background: none; display: grid; place-items: center;
  cursor: nwse-resize !important; touch-action: none; z-index: 9;
}
.pista-maniglia .q {
  width: 17px; height: 17px; border-radius: 5px;
  background: #f0b429; border: 1px solid rgba(0,0,0,.45);
  box-shadow: 0 1px 4px rgba(0,0,0,.55);
  display: grid; place-items: center; pointer-events: none;
  transition: transform .12s ease;
}
.pista-maniglia svg { width: 11px; height: 11px; fill: #241a02; }
.pista-maniglia:hover .q { transform: scale(1.15); }
.pista-maniglia.inmano .q { transform: scale(1.3); }
.pista-maniglia[hidden] { display: none !important; }
.pista.larga { overflow: auto; }
.pista { position: relative; padding: 26px 14px 16px; border-radius: 12px; touch-action: none;
  background: var(--secondary-background-color, rgba(255,255,255,.04));
  display: flex; justify-content: center; }
.pista casa-tile { display: block; cursor: grab; flex: none; }
/* mentre si tira la grandezza la casellina non deve animare niente: ogni
   transizione la fa arrivare in ritardo sul dito */
.pista casa-tile { transition: none; }
.pista-tasti { display: flex; justify-content: flex-end; margin-top: 8px; }
.pista-numeri { display: flex; align-items: center; gap: 8px; margin-top: 10px;
  font-size: 12.5px; color: var(--secondary-text-color, #9fb0c6); flex-wrap: wrap; }
.pista-numeri input {
  width: 74px; font: inherit; font-size: 13px; padding: 5px 8px;
  border-radius: 9px; text-align: right;
  border: 1px solid var(--divider-color, rgba(255,255,255,.16));
  background: var(--card-background-color, rgba(255,255,255,.04));
  color: var(--primary-text-color, #eaf1fb);
}
.pista-numeri input:focus { outline: none; border-color: #ffc400; }
.pista-numeri .per { opacity: .6; }
.codice-posti { margin-top: 10px; }
.prendi-da { display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
  margin-top: 10px; font-size: 12.5px;
  color: var(--secondary-text-color, #9fb0c6); }
.prendi-da[hidden] { display: none !important; }
.prendi-da select { font: inherit; padding: 5px 8px; border-radius: 9px;
  max-width: 200px; cursor: pointer;
  border: 1px solid var(--divider-color, rgba(255,255,255,.16));
  background: var(--card-background-color, rgba(255,255,255,.04));
  color: var(--primary-text-color, #eaf1fb); }
.pista-numeri[hidden] { display: none !important; }
.pista-numeri .chi { font-weight: 600;
  color: var(--primary-text-color, #eaf1fb); }
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
.indirizzoFoto { flex: 1 1 160px; min-width: 0; box-sizing: border-box;
  padding: 8px 11px; border-radius: 10px; font: inherit; font-size: 13px;
  border: 1px solid var(--divider-color, #444);
  background: var(--card-background-color, #16202c);
  color: var(--primary-text-color, #eaf1fb); }
.suaIcona + .suaIcona { margin-top: 10px; }
/* la riga di chi comanda quando e' questa casella: l'interruttore non fa
   niente apposta, quindi non deve nemmeno sembrare che lo faccia */
.voce[fisso] .sw { opacity: .55; cursor: default; }
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
