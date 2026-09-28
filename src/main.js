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
  name: "Casa · tuttofare",
  description: "La casella buona per qualunque cosa: luce, tapparella, presa, persona, meteo, cassa. L'icona si muove solo mentre l'entità è attiva, al posto suo ci puoi mettere una foto tua, e i pezzi (nome, valore, icona, misure) li sposti dove vuoi dentro la casella. Si configura a clic, senza YAML.",
  preview: true,
  documentationURL: "https://www.home-assistant.io/dashboards/",
});
}

[
  ["casa-elettrodomestico", "Casa \u00b7 elettrodomestico o presa",
   "Una scheda per elettrodomestici E prese: watt, acceso/spento, ultimo ciclo oppure kWh e costi di oggi e del mese. Capisce da sola le entita' del dispositivo."],
  ["casa-energia", "Casa · energia di tutta la casa",
   "La scheda grande: watt adesso, consumi e costi per ora, oggi, settimana, mese e bolletta, chi consuma di piu', risparmio dei pannelli. Di solito ne basta una."],
].forEach(([type, name, description]) => {
  if (!window.customCards.some((x) => x && x.type === type)) {
    window.customCards.push({ type, name, description, preview: true });
  }
});

console.info("%c CASA-TILE %c v" + VERSIONE + " ", "background:#5ec8ff;color:#0b1220;font-weight:700",
             "background:#111a27;color:#eaf1fb");
