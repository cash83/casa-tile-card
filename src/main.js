/*!
 * Casa · casella animata — scheda Lovelace personalizzata
 * Icone SVG animate + editor visuale: si configura a clic, senza scrivere YAML.
 * v2.4.55
 */





/* ------------------------------------------------------------------ icone */

import { CasaTileEditor } from './casa-tile-editor.js';
import { CasaTile } from './casa-tile.js';
import { VERSIONE } from './versione.js';
import { CasaEnergia } from './elettro-energia.js';
import { CasaElettrodomestico } from './elettro-elettrodomestico.js';

if (!customElements.get("casa-tile")) {
  customElements.define("casa-tile", CasaTile);
}
if (!customElements.get("casa-tile-editor")) {
  customElements.define("casa-tile-editor", CasaTileEditor);
}
// Le due schede grandi che vanno dentro al pop-up: energia della casa ed
// elettrodomestico (nate dal lavoro di Simonz82, adesso vivono qui).
if (!customElements.get("casa-energia")) {
  customElements.define("casa-energia", CasaEnergia);
}
if (!customElements.get("casa-elettrodomestico")) {
  customElements.define("casa-elettrodomestico", CasaElettrodomestico);
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

[
  ["casa-energia", "Casa · energia", "Consumo della casa, costi per periodo, circuiti e chi consuma di più (trova da sola le prese che misurano)."],
  ["casa-elettrodomestico", "Casa · elettrodomestico", "Lavatrice, lavastoviglie, forno, asciugatrice: stato, ultimo ciclo, tempi e costi."],
].forEach(([type, name, description]) => {
  if (!window.customCards.some((x) => x && x.type === type)) {
    window.customCards.push({ type, name, description });
  }
});

console.info("%c CASA-TILE %c v" + VERSIONE + " ", "background:#5ec8ff;color:#0b1220;font-weight:700",
             "background:#111a27;color:#eaf1fb");
