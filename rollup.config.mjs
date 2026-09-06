// Mette insieme i moduli di src/ in un file solo, che e' quello che
// Home Assistant carica. Non minimizzo apposta: i commenti sono in
// italiano e servono a chi ci rimette le mani - compreso me fra sei mesi.
export default {
  input: 'src/main.js',
  output: {
    file: 'dist/casa-tile-card.js',
    format: 'es',
    // niente banner ne' sourcemap: il file deve restare leggibile e uno solo
    generatedCode: { constBindings: true },
  },
  // nessuna dipendenza esterna: la card e' e resta senza librerie
  treeshake: false,
};
