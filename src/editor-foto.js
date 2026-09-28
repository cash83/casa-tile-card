// La riga per scegliere una foto, fatta come quella della casella animata:
// l'anteprima, il tasto che apre la galleria del telefono o le cartelle del
// PC, il campo per scrivere l'indirizzo se la foto sta gia' sul box, e il
// tasto per toglierla. Tutto su una riga sola.
//
// Le due schede dei consumi avevano solo un campo di testo nudo dove andava
// scritto "/local/qualcosa.jpg" a mano: per riempirlo bisognava gia' sapere
// come si carica un file su Home Assistant, che e' esattamente la cosa che il
// tasto risparmia.
//
// Sta qui in mezzo, in un pezzo solo, cosi' non ci sono copie che invecchiano
// ognuna per conto suo.

import { T } from './lingua.js';

export const STILE_FOTO = `
.dm-foto{margin:10px 0 2px}
.dm-foto-riga{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.dm-foto-ant{width:64px;height:44px;border-radius:8px;object-fit:cover;
  border:1px solid var(--divider-color,#444);background:#0003;cursor:pointer}
.dm-foto-ant[hidden]{display:none}
.dm-foto-bt{border:1px solid var(--divider-color,#555);
  background:var(--card-background-color,#1c1c1c);
  color:var(--primary-text-color,#e1e1e1);border-radius:9px;padding:8px 12px;
  font-size:13px;font-weight:600;cursor:pointer}
.dm-foto-bt:hover{border-color:var(--primary-color,#03a9f4)}
.dm-foto-bt[hidden]{display:none}
.dm-foto-via{opacity:.75}
.dm-foto-ind{flex:1;min-width:160px;border-radius:9px;padding:8px 10px;
  border:1px solid var(--divider-color,#555);
  background:var(--card-background-color,#1c1c1c);
  color:var(--primary-text-color,#e1e1e1);font-size:13px}
.dm-foto-nota{flex-basis:100%;font-size:12.5px;
  color:var(--secondary-text-color,#9b9b9b);margin-top:2px;word-break:break-all}
.dm-foto-nota.errore{color:#ff8a80}
`;

// Carica il file dentro a Home Assistant e torna l'indirizzo da salvare.
export async function caricaFoto(hass, file) {
  const dati = new FormData();
  dati.append("file", file);
  const risposta = await fetch("/api/image/upload", {
    method: "POST",
    headers: { Authorization: "Bearer " + hass.auth.data.access_token },
    body: dati,
  });
  if (!risposta.ok) throw new Error("HTTP " + risposta.status);
  const info = await risposta.json();
  return "/api/image/serve/" + info.id + "/original";
}

// La riga intera, pronta da appendere. Torna anche `aggiorna(valore)`, per
// rinfrescarla quando la configurazione cambia da fuori.
//   dammiHass - una funzione: l'hass arriva DOPO che la riga e' gia' fatta
//   scrivi    - lo chiamo con il nuovo indirizzo, o con "" se togli la foto
export function rigaFoto({ dammiHass, valore, tasto, scrivi }) {
  const box = document.createElement("div");
  box.className = "dm-foto";
  const riga = document.createElement("div");
  riga.className = "dm-foto-riga";

  const ant = document.createElement("img");
  ant.className = "dm-foto-ant";
  ant.alt = "";
  ant.title = T("Tocca per scegliere un'altra foto");

  const file = document.createElement("input");
  file.type = "file";
  file.accept = "image/*";
  file.style.display = "none";

  const scegli = document.createElement("button");
  scegli.className = "dm-foto-bt";
  scegli.type = "button";
  scegli.textContent = tasto || T("Usa un'immagine mia (telefono o PC)");

  const indirizzo = document.createElement("input");
  indirizzo.type = "text";
  indirizzo.className = "dm-foto-ind";
  indirizzo.placeholder = T("oppure l'indirizzo: /local/mia.jpg");

  const via = document.createElement("button");
  via.className = "dm-foto-bt dm-foto-via";
  via.type = "button";
  via.textContent = T("Togli la foto");

  const nota = document.createElement("div");
  nota.className = "dm-foto-nota";

  // l'input di QUESTA riga, non il primo della pagina: se no si apre la
  // galleria di un altro campo e la foto finisce nel posto sbagliato
  const apri = () => file.click();
  ant.addEventListener("click", apri);
  scegli.addEventListener("click", apri);

  file.addEventListener("change", async () => {
    const f = file.files && file.files[0];
    if (!f) return;
    nota.className = "dm-foto-nota";
    nota.textContent = T("Sto caricando") + " " + f.name + "...";
    try {
      scrivi(await caricaFoto(dammiHass(), f));
    } catch (e) {
      nota.className = "dm-foto-nota errore";
      nota.textContent = T("Non sono riuscito a caricarla") + ": " + e.message;
    }
  });
  indirizzo.addEventListener("change", () => scrivi(indirizzo.value.trim()));
  via.addEventListener("click", () => scrivi(""));

  riga.append(ant, scegli, file, indirizzo, via, nota);
  box.appendChild(riga);

  const aggiorna = (v) => {
    const c = v || "";
    ant.hidden = !c;
    if (c) ant.src = c;
    via.hidden = !c;
    scegli.textContent = c
      ? T("Scegli un'altra foto")
      : (tasto || T("Usa un'immagine mia (telefono o PC)"));
    if (document.activeElement !== indirizzo) indirizzo.value = c;
    if (!nota.classList.contains("errore")) nota.textContent = "";
  };
  aggiorna(valore);
  box.aggiorna = aggiorna;
  return box;
}

// ---------------------------------------------------------------------------
// LA SCELTA DEL DISEGNO: la griglia, non la tendina.
//
// Una tendina fa leggere venticinque nomi uno per volta per cercare una cosa
// che si riconosce a colpo d'occhio. La griglia li fa vedere tutti insieme,
// col filtro per scriverci dentro, e in fondo il tasto per usare una foto tua
// al posto del disegno - piu' quella di quando la scheda lavora, che puo'
// essere anche una gif. E' la stessa scelta della casella animata.

export const STILE_DISEGNI = `
.dm-dis{margin:8px 0 2px}
.dm-dis-cerca{width:100%;box-sizing:border-box;border-radius:9px;padding:9px 11px;
  margin-bottom:8px;border:1px solid var(--divider-color,#555);
  background:var(--card-background-color,#1c1c1c);
  color:var(--primary-text-color,#e1e1e1);font-size:13px}
.dm-dis-griglia{display:grid;grid-template-columns:repeat(auto-fill,minmax(66px,1fr));
  gap:6px;max-height:268px;overflow:auto;padding:2px;border-radius:10px}
.dm-dis-uno{display:flex;flex-direction:column;align-items:center;gap:3px;
  padding:6px 3px 5px;border-radius:10px;cursor:pointer;
  border:1px solid transparent;background:var(--secondary-background-color,#222);
  color:var(--primary-text-color,#e1e1e1)}
.dm-dis-uno:hover{border-color:var(--divider-color,#666)}
.dm-dis-uno.scelto{border-color:var(--primary-color,#03a9f4);
  box-shadow:0 0 0 1px var(--primary-color,#03a9f4) inset}
.dm-dis-uno svg,.dm-dis-uno img{width:34px;height:34px;display:block;object-fit:contain}
.dm-dis-uno b{font-size:10px;font-weight:600;line-height:1.15;text-align:center;
  max-width:62px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dm-dis-vuoto{font-size:12.5px;color:var(--secondary-text-color,#9b9b9b);padding:8px 2px}
`;

// elenco = [[chiave, nome], ...]   disegna(chiave) -> l'HTML dell'anteprima
export function sceltaDisegno({ elenco, disegna, scelto, scrivi }) {
  const box = document.createElement("div");
  box.className = "dm-dis";

  const cerca = document.createElement("input");
  cerca.type = "search";
  cerca.className = "dm-dis-cerca";
  cerca.placeholder = T("Cerca il disegno: lavatrice, forno, presa...");

  const griglia = document.createElement("div");
  griglia.className = "dm-dis-griglia";
  const vuoto = document.createElement("div");
  vuoto.className = "dm-dis-vuoto";
  vuoto.hidden = true;
  vuoto.textContent = T("Nessun disegno con questo nome.");

  let qualeScelto = scelto;
  const tasti = elenco.map(([chiave, nome]) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "dm-dis-uno";
    b.title = nome;
    b.dataset.chiave = chiave;
    // il nome sta nel dizionario, il disegno e' nostro: niente da proteggere
    b.innerHTML = disegna(chiave) + "<b></b>";
    b.querySelector("b").textContent = T(nome);
    b.addEventListener("click", () => {
      qualeScelto = chiave;
      tasti.forEach((x) => x.classList.toggle("scelto", x.dataset.chiave === chiave));
      scrivi(chiave);
    });
    griglia.appendChild(b);
    return b;
  });

  const filtra = () => {
    const q = cerca.value.trim().toLowerCase();
    let visti = 0;
    tasti.forEach((b) => {
      const ok = !q || b.title.toLowerCase().includes(q)
        || b.dataset.chiave.includes(q);
      b.hidden = !ok;
      if (ok) visti += 1;
    });
    vuoto.hidden = visti > 0;
  };
  cerca.addEventListener("input", filtra);

  box.append(cerca, griglia, vuoto);

  box.aggiorna = (v) => {
    qualeScelto = v;
    tasti.forEach((x) => x.classList.toggle("scelto", x.dataset.chiave === v));
  };
  box.aggiorna(qualeScelto);
  return box;
}
