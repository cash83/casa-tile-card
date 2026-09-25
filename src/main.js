/*!
 * Casa · casella animata — scheda Lovelace personalizzata
 * Icone SVG animate + editor visuale: si configura a clic, senza scrivere YAML.
 * (la versione vera sta in versione.js)
 */





/* ------------------------------------------------------------------ icone */

import { CasaTileEditor } from './casa-tile-editor.js';
import { CasaTile } from './casa-tile.js';
import { VERSIONE } from './versione.js';
import { CasaEnergia } from './elettro-energia.js';
import { CasaEnergiaEditor } from './elettro-energia-editor.js';
import { CasaElettrodomesticoEditor } from './elettro-elettrodomestico-editor.js';
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
if (!customElements.get("casa-energia-editor")) {
  customElements.define("casa-energia-editor", CasaEnergiaEditor);
}
if (!customElements.get("casa-elettrodomestico-editor")) {
  customElements.define("casa-elettrodomestico-editor", CasaElettrodomesticoEditor);
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
  ["casa-elettrodomestico", "Casa \u00b7 consumi",
   "Una scheda per elettrodomestici E prese: watt, acceso/spento, ultimo ciclo oppure kWh e costi di oggi e del mese. Capisce da sola le entita' del dispositivo."],
  // casa-energia resta viva per le schede gia' in giro (la grande della casa,
  // con bolletta e top consumo) ma non si propone piu' nell'elenco: una sola.
].forEach(([type, name, description]) => {
  if (!window.customCards.some((x) => x && x.type === type)) {
    window.customCards.push({ type, name, description });
  }
});

console.info("%c CASA-TILE %c v" + VERSIONE + " ", "background:#5ec8ff;color:#0b1220;font-weight:700",
             "background:#111a27;color:#eaf1fb");
