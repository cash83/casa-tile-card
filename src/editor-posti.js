// -*- coding: utf-8 -*-
// Dove va ogni pezzo: la pista, le maniglie, i numeri, lo YAML.

import { T } from './lingua.js';
import { nomeAttrezzo } from './aiuti.js';
import { metti, nomeTasto, segno } from './segni.js';
import { aYaml, daYaml } from './yaml.js';

// LA DISPOSIZIONE MESSA DA PARTE. Gli appunti del browser sulla sua
// installazione non ci sono (la pagina e' in http), e passare per la
// casella di testo si rompe appena si cambia casella. Questo cassetto vive
// finche' resta aperta la pagina e non dipende da nessuno.
let APPUNTI_POSTI = null;

export const ConPosti = (Base) => class extends Base {
  // Il riquadro dove si trascinano i pezzi: dentro c'e' una casella vera,
  // in piccolo, della stessa forma dell'anteprima.
  _costruisciPosti() {
    const box = this._postiBox;
    if (!box) return;
    // dentro all'editor di una scheda del pop-up il riquadro non ci va, e
    // non ci va nemmeno un avviso al suo posto: niente roba morta
    if (this._perIlPopup()) {
      if (box.innerHTML) box.innerHTML = "";
      box.hidden = true;
      return;
    }
    if (!box._fatto) {
      box._fatto = true;
      box.innerHTML = "<h4>Dove va ogni pezzo</h4>"
        + "<p class='aiuto'>Prendi il nome, il valore, l'icona o una misura e "
        + "trascinali dove vuoi dentro alla casella qui sotto. Tocca un pezzo "
        + "e sul suo angolo compare un quadratino giallo: tienilo premuto e "
        + "trascina per ingrandirlo o rimpicciolirlo.</p>";
      const pista = document.createElement("div");
      pista.className = "pista";
      const carta = document.createElement("casa-tile");
      carta.setAttribute("solo-casella", "");
      carta.setAttribute("trascinabile", "");
      pista.appendChild(carta);
      box.appendChild(pista);
      this._grandezzaPista(box, pista, carta);
      box.appendChild(this._numeriGrandezza(box));
      box.appendChild(this._numeriPezzo(box));
      const sotto = document.createElement("div");
      sotto.className = "pista-tasti";
      const rimetti = document.createElement("button");
      rimetti.type = "button";
      rimetti.className = "tastoPiatto";
      rimetti.textContent = T("Rimetti tutto a posto");
      // Il tasto butta via tutta la disposizione: una manata per sbaglio
      // gli faceva perdere il lavoro senza modo di tornare indietro. Ora la
      // disposizione la metto da parte e compare il tasto per riprenderla.
      const annulla = document.createElement("button");
      annulla.type = "button";
      annulla.className = "tastoPiatto";
      annulla.textContent = T("Rimetti come prima");
      annulla.hidden = true;
      rimetti.addEventListener("click", () => {
        // e dimentico anche la misura piu' stretta che mi ero segnato: se
        // rifa la disposizione da capo, deve poterla rifare su quella di adesso
        const c0 = this._cfgPista() || {};
        const base = "casa-tile:misura3:" + (c0.entity || "") + "|" + (c0.name || "");
        try {
          localStorage.removeItem(base);
          localStorage.removeItem(base + "|pop");
        } catch (e) { /* pazienza */ }
        const ora = this._cfgPista().posti;
        if (ora && Object.keys(ora).length) box._salvati = ora;
        this._scriviPosti(null);
        this._aggiornaPista();
        annulla.hidden = !box._salvati;
        this._dico("disposizione tolta - puoi riprenderla col tasto qui di fianco");
      });
      annulla.addEventListener("click", () => {
        if (!box._salvati) return;
        this._scriviPosti(box._salvati);
        box._salvati = null;
        annulla.hidden = true;
        this._aggiornaPista();
        this._dico("disposizione ripresa");
      });
      // Il riquadro si stringe per stare nella finestra delle impostazioni,
      // e su una card larga diventa un francobollo: si sposta al buio e ci
      // si accorge di com'e' venuta solo dopo aver salvato. Con questo lo si
      // vede alla misura VERA, e il riquadro scorre.
      const vero = document.createElement("button");
      vero.type = "button";
      vero.className = "tastoPiatto";
      vero.textContent = T("Grandezza vera");
      vero.addEventListener("click", () => {
        box._grande = !box._grande;
        vero.textContent = box._grande ? "Rimpicciolisci per starci" : "Grandezza vera";
        this._formaPista();
        if (box._carta && box._carta._aggiornaManiglia) box._carta._aggiornaManiglia();
      });
      sotto.appendChild(vero);
      sotto.appendChild(rimetti);
      sotto.appendChild(annulla);
      box.appendChild(sotto);
      box.appendChild(this._prendiDa(box));
      box.appendChild(this._codicePosti(box));
      const nota = document.createElement("div");
      nota.className = "pista-nota";
      nota.textContent = T("pronto: tocca un pezzo qui sopra");
      box.appendChild(nota);
      box._nota = nota;
      box._carta = carta;
      // chi sto sistemando: la casella stessa o una scheda del suo pop-up
      const chi = document.createElement("div");
      chi.className = "pista-chi";
      box.insertBefore(chi, pista);
      box._chi = chi;
      this._pistaTrascina(carta);
    }
    this._aggiornaPista();
  }

  // LE DUE CASELLINE DELLA GRANDEZZA. Chi non vuole trascinare scrive il
  // numero e basta: fanno la stessa identica cosa del quadratino giallo.
  _numeriGrandezza(box) {
    const riga = document.createElement("div");
    riga.className = "pista-numeri";
    const eti = document.createElement("span");
    eti.textContent = T("Grandezza");
    const largo = document.createElement("input");
    largo.type = "number";
    largo.min = "40"; largo.max = "2400"; largo.step = "1";
    largo.title = T("Larghezza in punti");
    const per = document.createElement("span");
    per.className = "per";
    per.textContent = "\u00d7";
    const alto = document.createElement("input");
    alto.type = "number";
    alto.min = "40"; alto.max = "2400"; alto.step = "1";
    alto.title = T("Altezza in punti");
    const punti = document.createElement("span");
    punti.className = "per";
    punti.textContent = "punti";
    riga.append(eti, largo, per, alto, punti);

    const manda = () => {
      const w = Math.max(40, Math.min(2400, Math.round(Number(largo.value) || 0)));
      const h = Math.max(40, Math.min(2400, Math.round(Number(alto.value) || 0)));
      if (!w || !h) return;
      const w0 = box._largoVero || w;
      const h0 = box._altoVero || h;
      if (w === Math.round(w0) && h === Math.round(h0)) return;
      box._tirata = { w, h };
      this._salvaGrandezza(w0, h0, w, h, true);
      this._formaPista();
      // la misura puo' essere finita su uno scatto della plancia: le
      // caselline devono dire quella vera, non quella chiesta
      largo.value = String(Math.round(box._largoVero || w));
      alto.value = String(Math.round(box._altoVero || h));
    };
    [largo, alto].forEach((c) => {
      c.addEventListener("change", manda);
      c.addEventListener("keydown", (e) => {
        if (e.key === "Enter") { e.preventDefault(); manda(); }
      });
    });
    box._numeri = { largo, alto };
    return riga;
  }

  // LE CASELLINE DEL PEZZO SCELTO: grandezza e posizione, da scrivere a
  // mano. Compaiono solo quando un pezzo e' scelto - se no sarebbe una
  // riga di campi che non comandano niente.
  _numeriPezzo(box) {
    const riga = document.createElement("div");
    riga.className = "pista-numeri";
    riga.hidden = true;
    const chi = document.createElement("span");
    chi.className = "chi";
    chi.textContent = T("Pezzo");
    const e1 = document.createElement("span");
    e1.textContent = "grande";
    const gr = document.createElement("input");
    gr.type = "number";
    gr.min = "40"; gr.max = "300"; gr.step = "5";
    gr.title = T("Grandezza del pezzo in percentuale");
    const p1 = document.createElement("span");
    p1.className = "per";
    p1.textContent = "%";
    const e2 = document.createElement("span");
    e2.textContent = T("da sinistra");
    const px = document.createElement("input");
    px.type = "number";
    px.min = "0"; px.max = "100"; px.step = "0.5";
    px.title = T("Quanto e' distante dal bordo sinistro, in percentuale");
    const e3 = document.createElement("span");
    e3.textContent = "dall'alto";
    const py = document.createElement("input");
    py.type = "number";
    py.min = "0"; py.max = "100"; py.step = "0.5";
    py.title = T("Quanto e' distante dal bordo di sopra, in percentuale");
    const p2 = document.createElement("span");
    p2.className = "per";
    p2.textContent = "%";
    riga.append(chi, e1, gr, p1, e2, px, e3, py, p2);

    const manda = () => {
      const quale = box._carta && box._carta._pezzoScelto;
      if (!quale) return;
      const posti = { ...((this._cfgPista() || {}).posti || {}) };
      const v = { ...(posti[quale] || {}) };
      const k = Number(gr.value) / 100;
      if (isFinite(k) && k >= 0.4 && k <= 3) {
        if (Math.abs(k - 1) < 0.005) delete v.s;
        else v.s = Math.round(k * 100) / 100;
      }
      const x = Number(px.value);
      const y = Number(py.value);
      if (isFinite(x)) v.x = Math.max(0, Math.min(100, Math.round(x * 10) / 10));
      if (isFinite(y)) v.y = Math.max(0, Math.min(100, Math.round(y * 10) / 10));
      // "dx" e' quanto dista da DESTRA: si ricava dagli altri due - sulla
      // larghezza INGRANDITA, che e' quella che si vede - e senza rifarlo
      // il pezzo attaccato a destra tornerebbe dov'era
      if (isFinite(v.w) && isFinite(v.x)) {
        const k2 = Number(v.s) > 0 ? Number(v.s) : 1;
        v.dx = Math.round((100 - v.x - v.w * k2) * 10) / 10;
      }
      posti[quale] = v;
      this._scriviPosti(posti);
      this._aggiornaPista();
      this._dico("pezzo " + quale + ": " + Math.round((v.s || 1) * 100)
        + "% a " + v.x + "% " + v.y + "%");
    };
    [gr, px, py].forEach((c) => {
      c.addEventListener("change", manda);
      c.addEventListener("keydown", (e) => {
        if (e.key === "Enter") { e.preventDefault(); manda(); }
      });
    });
    box._numeriPezzo = { riga, chi, gr, px, py };
    return riga;
  }

  // IL QUADRATINO DELLA GRANDEZZA. Sta sull'angolo in basso a destra della
  // casellina del riquadro: si tiene premuto e si trascina, come si fa con
  // l'icona o con le scritte. Cambia la misura di quello che stai
  // sistemando: la scheda del pop-up che hai scelto, oppure - se non ne hai
  // scelta nessuna - la casella stessa sulla plancia.
  _grandezzaPista(box, pista, carta) {
    const q = document.createElement("div");
    q.className = "pista-grandezza";
    q.title = T("Tieni premuto e trascina per cambiare la grandezza della casella");
    const targa = document.createElement("div");
    targa.className = "pista-grande-targa";
    targa.hidden = true;
    pista.append(q, targa);
    box._grandezza = q;

    // il quadratino sta sull'angolo della casellina, e la casellina si
    // muove ogni volta che il riquadro cambia forma
    q._sistema = () => {
      if (!carta.isConnected) { q.hidden = true; return; }
      const r = carta.getBoundingClientRect();
      const rp = pista.getBoundingClientRect();
      if (r.width < 20) { q.hidden = true; return; }
      q.hidden = false;
      q.style.left = (r.right - rp.left - 11 + pista.scrollLeft) + "px";
      q.style.top = (r.bottom - rp.top - 11 + pista.scrollTop) + "px";
      targa.style.left = (r.right - rp.left - 24 + pista.scrollLeft) + "px";
      targa.style.top = (r.bottom - rp.top - 34 + pista.scrollTop) + "px";
    };
    q._sistema();
    // e si risistema da solo: cambiando linguetta il riquadro sparisce e
    // ricompare, e mentre era chiuso di misure non ce n'erano - il
    // quadratino restava nascosto o fuori posto
    if (window.ResizeObserver) {
      try {
        const occhio = new ResizeObserver(() => q._sistema());
        occhio.observe(pista);
        occhio.observe(carta);
        box._occhioGrandezza = occhio;
      } catch (e) { /* pazienza */ }
    }

    // Quanto si sposta il bordo per ogni punto di larghezza in piu' non lo
    // do' per scontato: lo misuro mentre trascina (vedi "disegna"). Qui
    // metto solo la misura chiesta, rimpicciolita se non ci sta.
    const applica = (w, h) => {
      const posto = Math.max(190, (box.clientWidth || 420) - 28);
      let lw = w;
      let lh = h;
      if (w > posto && !box._grande) { lh = h * posto / w; lw = posto; }
      carta.style.width = Math.round(lw) + "px";
      carta.style.height = Math.round(lh) + "px";
      box._largoVero = w;
      box._altoVero = h;
      q._sistema();
    };

    let preso = null;
    let inCorso = 0;
    const disegna = () => {
      inCorso = 0;
      if (!preso) return;
      const r = carta.getBoundingClientRect();
      // se il riquadro non e' a video (altra linguetta, pannello chiuso) le
      // misure sono tutte zero: inseguire un angolo che non c'e' vuol dire
      // mandare la grandezza alle stelle
      if (!(r.width > 10) || !(r.height > 10)) return;
      // LA MISURA LA LEGGO SUL POSTO: quant'e' la distanza fra l'angolo di
      // sopra a sinistra della casellina e il dito. Niente indovinelli su
      // quanto si sposta il bordo: se la casellina sta in mezzo al riquadro
      // il conto si aggiusta da solo in due o tre fotogrammi.
      let vogLargo = (preso.px - preso.offX) - r.left;
      let vogAlto = (preso.py - preso.offY) - r.top;
      // LA CALAMITA. La casella si muove libera come vuole il dito, ma
      // quando passa vicino a una misura che la plancia sa dare davvero ci
      // si appoggia da sola. Fra uno scatto e l'altro ci sono trentadue
      // punti: la calamita ne prende dieci, quindi per ventidue punti su
      // trentadue il movimento e' libero e non si sente nessun gradino - e
      // il dito ci finisce sopra da solo, cosi' mollando non salta niente.
      if (preso.sezione > 0) {
        const passo = preso.sezione / 12;
        preso.col = Math.max(1, Math.min(12,
          Math.round(vogLargo * 12 / preso.sezione)));
        preso.righe = Math.max(1, Math.min(20, Math.round((vogAlto + 8) / 64)));
        const suScatto = preso.sezione * preso.col / 12;
        if (Math.abs(vogLargo - suScatto) < Math.min(10, passo * 0.35)) {
          vogLargo = Math.round(suScatto);
        }
        const altoScatto = preso.righe * 56 + (preso.righe - 1) * 8;
        if (Math.abs(vogAlto - altoScatto) < 12) vogAlto = altoScatto;
      }
      // e non oltre il bordo del riquadro: li' la figura verrebbe
      // rimpicciolita e l'angolo scapperebbe via dal dito
      const posto = Math.max(190, (box.clientWidth || 420) - 28);
      const alMuro = !box._grande && vogLargo >= posto;
      // Non piu' di 120 punti di cambiamento per fotogramma. Quando la
      // casellina si stringe molto il contenuto si rimescola di colpo e per
      // un fotogramma le misure che leggo sono senza senso: uno scarto piu'
      // grosso di cosi' e' un errore di lettura, non una richiesta.
      const frena = (voglio, ora) => {
        const d = voglio - ora;
        if (d > 120) return ora + 120;
        if (d < -120) return ora - 120;
        return voglio;
      };
      preso.w = Math.max(60, Math.min(2400,
        frena(alMuro ? posto : vogLargo, preso.w)));
      preso.h = Math.max(40, Math.min(2400, frena(vogAlto, preso.h)));
      preso.nw = Math.round(preso.w);
      preso.nh = Math.round(preso.h);
      box._tirata = { w: preso.nw, h: preso.nh };
      applica(preso.nw, preso.nh);
      targa.textContent = preso.nw + " \u00d7 " + preso.nh
        + (preso.sezione > 0
          ? "  (" + preso.col + " \u00d7 " + preso.righe + ")" : "");
      if (box._nota) {
        box._nota._occupata = true;
        box._nota.textContent = "riquadro " + preso.nw + "x" + preso.nh
          + (preso.sezione > 0
            ? " - sulla plancia sono " + preso.col
              + (preso.col === 1 ? " colonna per " : " colonne per ") + preso.righe
              + (preso.righe === 1 ? " riga" : " righe")
            : "")
          + (alMuro
            ? " - piu' larga non ci sta qui: premi \"Grandezza vera\" "
              + "oppure scrivi il numero qui sotto"
            : " - la stai tirando tu");
      }
    };
    const giu = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const r = carta.getBoundingClientRect();
      const w0 = box._largoVero || r.width;
      const h0 = box._altoVero || r.height;
      preso = {
        x: e.clientX, y: e.clientY, px: e.clientX, py: e.clientY,
        // il dito non e' esattamente sull'angolo: sta in mezzo al
        // quadratino, un dito piu' in dentro. Me lo segno una volta e lo
        // tolgo sempre, se no la casella parte con uno scatto.
        offX: e.clientX - r.right, offY: e.clientY - r.bottom,
        w: w0, h: h0, w0, h0, nw: 0, nh: 0,
        // QUANTO E' LARGA LA SEZIONE dove sta la casella sulla plancia: mi
        // serve per sapere quali misure la plancia sa dare davvero, e
        // agganciarcisi mentre tira invece che dopo. Dentro a un pop-up no:
        // li' la misura e' libera, e la sezione resta a zero.
        sezione: 0, col: 0, righe: 0,
      };
      const perLaPlancia = !(this._sceltaPercorso && this._sceltaPercorso.length);
      if (perLaPlancia) {
        const g0 = (this._config || {}).grid_options || {};
        let col = Number(g0.columns);
        if (!(col >= 1)) {
          try {
            const suo = carta.getGridOptions ? carta.getGridOptions() : null;
            col = Number(suo && suo.columns);
          } catch (e4) { /* pazienza */ }
        }
        if (!(col >= 1)) col = 4;
        preso.sezione = Math.max(120, w0 * 12 / col);
      }
      // E IL RIQUADRO NON SI ACCORCIA FINCHE' TENGO PREMUTO. Accorciando la
      // casella la colonna delle impostazioni ha meno roba da mostrare, il
      // browser fa scendere il contenuto per riempire il vuoto e la casella
      // scivola sotto il dito fermo: il conto legge un accorciamento che non
      // ho fatto io e in mezzo secondo la casella collassa.
      pista.style.minHeight = Math.round(pista.getBoundingClientRect().height) + "px";
      q.classList.add("inmano");
      targa.hidden = false;
      pista.style.userSelect = "none";
      try { q.setPointerCapture(e.pointerId); } catch (x) { /* pazienza */ }
      window.addEventListener("pointermove", muovi, true);
      window.addEventListener("pointerup", su, true);
      window.addEventListener("pointercancel", su, true);
    };
    const muovi = (e) => {
      if (!preso) return;
      e.preventDefault();
      e.stopPropagation();
      // a ogni pixel mi segno solo dov'e' il dito: il disegno si fa una
      // volta per fotogramma, se no si arranca
      preso.px = e.clientX;
      preso.py = e.clientY;
      if (!inCorso) inCorso = requestAnimationFrame(disegna);
    };
    const su = (e) => {
      window.removeEventListener("pointermove", muovi, true);
      window.removeEventListener("pointerup", su, true);
      window.removeEventListener("pointercancel", su, true);
      if (inCorso) cancelAnimationFrame(inCorso);
      inCorso = 0;
      if (preso && e) { preso.px = e.clientX; preso.py = e.clientY; }
      disegna();
      q.classList.remove("inmano");
      targa.hidden = true;
      pista.style.userSelect = "";
      pista.style.minHeight = "";
      if (box._nota) box._nota._occupata = false;
      if (!preso) return;
      const fatto = preso;
      preso = null;
      if (e) { e.preventDefault(); e.stopPropagation(); }
      if (!fatto.nw) return;
      this._salvaGrandezza(fatto.w0, fatto.h0, fatto.nw, fatto.nh);
    };
    q.addEventListener("pointerdown", giu);
    q.addEventListener("click", (e) => { e.preventDefault(); e.stopPropagation(); });
  }

  // e qui la grandezza tirata va a finire dove serve
  _salvaGrandezza(wPrima, hPrima, w, h, scritta) {
    const p = this._sceltaPercorso;
    if (p && p.length && p.length <= 2) {
      // una scheda del pop-up: la larghezza li' e' una percentuale di riga,
      // e quanto ne cambia si sa dal rapporto fra prima e adesso
      const chiave = p.join(".");
      const scheda = this._schedaA(p) || {};
      let quante = 12;
      if (p.length === 2) {
        const madre = this._schedaA([p[0]]) || {};
        quante = Math.max(1, Math.min(12, Math.round(
          Number(madre.columns) > 0 ? Number(madre.columns) : 3)));
      }
      const ora = this._misuraLarga(scheda, quante);
      // Quant'e' larga la riga dove sta? Lo ricavo: e' larga "ora per cento
      // della riga, meno la sua parte di stacco". Girando il conto viene
      // fuori la riga, e da li' la percentuale nuova - esatta, non stimata.
      const g = p.length === 2 ? 8 : 10;
      const riga = (Math.max(20, wPrima) + g) / Math.max(0.01, ora / 100) - g;
      let nuova = Math.max(8, Math.min(100, ((w + g) / (riga + g)) * 100));
      // e se passa vicino a una misura comoda ci si appoggia, come fa il
      // quadratino dell'anteprima - ma solo trascinando: a chi scrive 240
      // va dato 240, non "quasi meta' riga"
      if (!scritta) {
        [100, 75, 200 / 3, 50, 100 / 3, 25, 20].forEach((c) => {
          if (Math.abs(nuova - c) < 2.2) nuova = c;
        });
      }
      this._scriviMisura(chiave, Math.round(nuova * 10) / 10, Math.round(h), quante);
      // la misura buona adesso e' questa: se ne tira un'altra, si riparte
      // da qui e non da quella di quando l'aveva scelta
      this._misuraScelta = { w: Math.round(w), h: Math.round(h) };
      return;
    }
    // la casella stessa sulla plancia: li' comanda la misura di Home
    // Assistant, dodici colonne di larghezza e righe da 56 punti
    const g0 = this._config.grid_options || {};
    let col = Number(g0.columns);
    if (!(col >= 1)) {
      try {
        const box = this._postiBox;
        const suo = box && box._carta && box._carta.getGridOptions
          ? box._carta.getGridOptions() : null;
        col = Number(suo && suo.columns);
      } catch (e) { /* pazienza */ }
    }
    if (!(col >= 1)) col = 4;
    // Quant'e' larga la sezione dove sta? Lo ricavo: e' larga com'e' lei
    // moltiplicata per dodici e divisa per le sue colonne.
    const sezione = Math.max(120, wPrima * 12 / col);
    let nuoveCol = Math.max(1, Math.min(12, Math.round(w * 12 / sezione)));
    let righe = Math.max(1, Math.min(20, Math.round((h + 8) / 64)));
    // SCRIVERE UN NUMERO VUOL DIRE VOLERSI MUOVERE. La larghezza va per
    // dodicesimi: da 362 punti - che sono gia' 12 colonne su 12 - qualunque
    // numero si scriva l'arrotondamento riporta a 12, e sembra che il campo
    // non funzioni. Se il numero scritto e' piu' piccolo, si scende almeno
    // di una colonna; se e' piu' grande, si sale almeno di una.
    let alMassimo = false;
    let alMinimo = false;
    if (scritta) {
      const colOra = Math.max(1, Math.min(12, Math.round(wPrima * 12 / sezione)));
      if (nuoveCol === colOra) {
        if (w < wPrima - 2) {
          if (colOra > 1) nuoveCol = colOra - 1; else alMinimo = true;
        } else if (w > wPrima + 2) {
          if (colOra < 12) nuoveCol = colOra + 1; else alMassimo = true;
        }
      }
      const righeOra = Math.max(1, Math.min(20, Math.round((hPrima + 8) / 64)));
      if (righe === righeOra) {
        if (h < hPrima - 2 && righeOra > 1) righe = righeOra - 1;
        else if (h > hPrima + 2 && righeOra < 20) righe = righeOra + 1;
      }
    }
    const g = { ...g0, columns: nuoveCol, rows: righe };
    this._config = { ...this._config, grid_options: g };
    // E QUESTA E' LA MISURA CHE AVRA' DAVVERO, non quella chiesta: la
    // plancia va a scatti - dodicesimi di larghezza e righe da 56 punti -
    // e mostrare i punti chiesti voleva dire far vedere una figura che poi
    // sulla plancia veniva su diversa.
    w = Math.round(sezione * nuoveCol / 12);
    h = righe * 56 + (righe - 1) * 8;
    const box0 = this._postiBox;
    if (box0) box0._tirata = { w, h };
    // e me la segno come misura vera: l'anteprima di fianco si veste con
    // quella, e senza aggiornarla restava della grandezza di prima
    const c = this._config || {};
    if (c.entity || c.name) {
      const base = "casa-tile:misura3:" + (c.entity || "") + "|" + (c.name || "");
      try {
        localStorage.setItem(base, Math.round(w) + "x" + Math.round(h));
      } catch (e) { /* pazienza */ }
    }
    this._conservaPosto(() => this._emetti());
    if (scritta) {
      this._dico(alMassimo
        ? "e' gia' larga tutta la sezione: 12 colonne su 12, piu' di cosi' non puo'"
        : alMinimo
        ? "e' gia' stretta al minimo: 1 colonna su 12"
        : "sulla plancia sono " + nuoveCol
          + (nuoveCol === 1 ? " colonna per " : " colonne per ") + righe
          + (righe === 1 ? " riga" : " righe") + " - " + Math.round(w)
          + "x" + Math.round(h) + " punti");
    }
    // e glielo dico: l'anteprima e' un'altra casella, appesa da un'altra
    // parte della pagina, e da sola non si accorge di niente
    this.dispatchEvent(new CustomEvent("casa-rivestiti", {
      detail: { config: c }, bubbles: true, composed: true,
    }));
  }

  // quanto e' larga adesso, in percentuale di riga
  _misuraLarga(cfg, base) {
    const c = cfg || {};
    const b = Number(base) >= 1 ? Number(base) : 12;
    const mio = c.casa_misura || {};
    if (Number(mio.largo) > 0) return Number(mio.largo);
    const g = c.grid_options || {};
    const col = g.columns === "full" ? b : Number(g.columns);
    if (isFinite(col) && col >= 1) return (Math.min(col, b) / b) * 100;
    return b === 12 ? 100 : 100 / b;
  }

  // GUARDA COME SI APRE, senza salvare. Apre la finestra dell'anteprima
  // qui e ora, con l'animazione e la velocita' che ha davanti adesso.
  _provaApertura() {
    if (this._provaBox) return this._provaBox;
    const riga = document.createElement("div");
    riga.className = "prendi-da";
    const tasto = document.createElement("button");
    tasto.type = "button";
    tasto.className = "tastoPiatto";
    tasto.textContent = T("Guarda come si apre");
    const dice = document.createElement("span");
    dice.textContent = T("si apre qui di fianco - chiudila con la X o con Esc");
    tasto.addEventListener("click", () => {
      const c = this._config || {};
      if ((c.azione || "toggle") !== "finestra") {
        this._dico("questa casella al tocco non apre un pop-up");
        return;
      }
      window.dispatchEvent(new CustomEvent("casa-prova-apertura", {
        detail: { config: c },
      }));
    });
    riga.append(tasto, dice);
    this._provaBox = riga;
    return riga;
  }

  // PRENDI LA DISPOSIZIONE DA UN'ALTRA CASELLA. Niente copia e incolla: si
  // sceglie da quale e si preme. Arrivano le posizioni dei pezzi, le misure
  // con cui erano state composte e la grandezza; l'entita', il valore, il
  // nome e il servizio restano quelli di questa casella.
  _prendiDa(box) {
    const riga = document.createElement("div");
    riga.className = "prendi-da";
    riga.hidden = true;
    const eti = document.createElement("span");
    eti.textContent = T("Prendi la disposizione da");
    const scelta = document.createElement("select");
    const tasto = document.createElement("button");
    tasto.type = "button";
    tasto.className = "tastoPiatto";
    tasto.textContent = "Prendi";
    riga.append(eti, scelta, tasto);

    // tutte le caselle nostre del pop-up che una disposizione ce l'hanno,
    // piu' la casella grande
    const elenco = () => {
      const fuori = [];
      const mia = (this._sceltaPercorso || []).join(".");
      const c0 = this._config || {};
      if (c0.posti && Object.keys(c0.posti).length && mia !== "") {
        fuori.push({ id: "", nome: "questa casella (quella grande)" });
      }
      const gira = (lista, base) => {
        (lista || []).forEach((c, i) => {
          if (!c) return;
          const qui = base.concat([i]);
          const id = qui.join(".");
          if (String(c.type || "") === "custom:casa-tile"
            && c.posti && Object.keys(c.posti).length && id !== mia) {
            fuori.push({ id, nome: c.name || c.entity || ("scheda " + (i + 1)) });
          }
          if (Array.isArray(c.cards)) gira(c.cards, qui);
        });
      };
      gira(this._schede(), []);
      return fuori;
    };

    const rinfresca = () => {
      const voci = elenco();
      riga.hidden = voci.length === 0;
      const prima = scelta.value;
      scelta.innerHTML = "";
      voci.forEach((v) => {
        const o = document.createElement("option");
        o.value = v.id;
        o.textContent = v.nome;
        scelta.appendChild(o);
      });
      if (voci.some((v) => v.id === prima)) scelta.value = prima;
    };

    tasto.addEventListener("click", () => {
      const da = scelta.value;
      const sorgente = da === ""
        ? this._config
        : this._schedaA(da.split(".").map((n) => Number(n)));
      if (!sorgente || !sorgente.posti) {
        this._dico("quella casella non ha una disposizione");
        return;
      }
      const roba = {};
      ["casa_misura", "posti_largo", "posti_alto", "posti"].forEach((k) => {
        if (sorgente[k] !== undefined) roba[k] = sorgente[k];
      });
      const p = this._sceltaPercorso;
      if (!p || !p.length) {
        this._config = { ...this._config, ...roba };
        this._emetti();
      } else {
        const vecchia = this._schedaA(p);
        if (!vecchia) return;
        this._salvaSchede(this._conScheda(p, { ...vecchia, ...roba }), false);
      }
      this._aggiornaPista();
      this._dico("disposizione presa da \"" + (scelta.selectedOptions[0]
        ? scelta.selectedOptions[0].textContent : da) + "\"");
    });

    box._prendiDa = { riga, rinfresca };
    rinfresca();
    return riga;
  }

  // IL CODICE DELLA DISPOSIZIONE, in YAML. Dove sta ogni pezzo, tutto
  // insieme: da guardare, da correggere al decimale, e soprattutto da
  // COPIARE per portare la stessa disposizione su un'altra card.
  _codicePosti(box) {
    const fuori = document.createElement("div");
    fuori.className = "codice-scheda codice-posti";
    const apri = document.createElement("button");
    apri.className = "bt chiaro";
    apri.type = "button";
    apri.textContent = T("Codice di questa casella (YAML)");
    const dentro = document.createElement("div");
    dentro.hidden = true;
    const esito = document.createElement("div");
    esito.className = "esito";

    // quello che si sta sistemando: la casella, o la scheda scelta
    // Tutti i pezzi, non solo quelli gia' spostati: chi ha una posizione
    // salvata con quella, gli altri con quella che hanno adesso. Se no non
    // li puoi correggere da qui - "manca il valore".
    // TUTTA la configurazione della casella che sta sistemando: la grande,
    // oppure la singola scheda del pop-up che ha scelto - anche se vive
    // dentro a una griglia. Le posizioni dei pezzi le completo con quelle
    // che i pezzi hanno adesso, se no chi non e' mai stato spostato non
    // compare e non lo puoi correggere da qui.
    const roba = () => {
      const c = this._cfgPista() || {};
      const d = { ...c };
      let ora = null;
      try {
        ora = box._carta && box._carta.posizioniAdesso
          ? box._carta.posizioniAdesso() : null;
      } catch (e) { ora = null; }
      const salvati = (c.posti && Object.keys(c.posti).length) ? c.posti : null;
      if (salvati || (ora && Object.keys(ora).length)) {
        d.posti = { ...(ora || {}), ...(salvati || {}) };
      }
      const lw = Number(c.posti_largo) > 0 ? c.posti_largo : box._largoVero;
      const lh = Number(c.posti_alto) > 0 ? c.posti_alto : box._altoVero;
      if (Number(lw) > 40) d.posti_largo = Math.round(lw);
      if (Number(lh) > 40) d.posti_alto = Math.round(lh);
      return d;
    };

    // UNA RIGA PER PEZZO. L'editor di Home Assistant riscriverebbe il
    // codice a modo suo - sei righe per ogni pezzo - e con sei pezzi
    // diventano quaranta righe di numeri incolonnati. Qui il pezzo sta su
    // una riga sola e i numeri sono al decimo, che e' la precisione con cui
    // si lavora (basta con i 69.80000000000001).
    // Tutto in YAML normale, tranne le posizioni dei pezzi: quelle una
    // riga per pezzo, che con sei righe a testa diventavano quaranta righe
    // di numeri incolonnati.
    const inRiga = (d) => {
      const num = (v) => String(Math.round(Number(v) * 10) / 10);
      const senzaPosti = { ...d };
      delete senzaPosti.posti;
      const fuori = [];
      const resto = aYaml(senzaPosti, 0);
      if (resto && resto.trim()) fuori.push(resto.replace(/\n+$/, ""));
      const pz = d.posti || {};
      const nomi = Object.keys(pz);
      if (nomi.length) {
        fuori.push("posti:");
        nomi.forEach((k) => {
          const v = pz[k] || {};
          const parti = [];
          ["x", "y", "w", "h", "dx", "s"].forEach((n) => {
            if (v[n] !== undefined && v[n] !== null && isFinite(v[n])) {
              parti.push(n + ": " + num(v[n]));
            }
          });
          const nome = /^[A-Za-z0-9_]+$/.test(k) ? k : '"' + k + '"';
          fuori.push("  " + nome + ": {" + parti.join(", ") + "}");
        });
      }
      return fuori.join("\n") + "\n";
    };

    let leggi = null;
    let edHa = null;
    const conCasella = () => {
      const area = document.createElement("textarea");
      area.rows = 10;
      area.spellcheck = false;
      area.value = inRiga(roba());
      dentro.appendChild(area);
      leggi = () => daYaml(area.value);
      edHa = area;
    };

    const applica = document.createElement("button");
    applica.className = "bt";
    applica.type = "button";
    applica.textContent = T("Applica il codice");
    applica.hidden = true;
    applica.addEventListener("click", () => {
      try {
        const d = leggi ? leggi() : null;
        if (!d || typeof d !== "object") throw new Error("codice vuoto");
        if (d.posti && typeof d.posti !== "object") {
          throw new Error('"posti" deve essere un elenco di pezzi');
        }
        // CON "type:" si riscrive la casella intera; SENZA si cambiano solo
        // le righe incollate e tutto il resto resta com'e'. E' cosi' che si
        // porta una disposizione da una casella all'altra senza portarsi
        // dietro il valore, l'entita' e il nome.
        const intera = !!d.type;
        const metti = (vecchia) => {
          const c2 = intera ? { ...d } : { ...(vecchia || {}), ...d };
          const puliti = this._postiPuliti(d.posti || null);
          // le due ancore devono dire la stessa cosa: rifaccio "dx" dagli
          // altri numeri, sulla larghezza ingrandita che e' quella che si vede
          if (puliti) {
            Object.keys(puliti).forEach((k) => {
              const v = puliti[k] || {};
              const w = Number(v.w);
              const x = Number(v.x);
              const k2 = Number(v.s) > 0 ? Number(v.s) : 1;
              if (isFinite(w) && isFinite(x)) {
                v.dx = Math.round((100 - x - w * k2) * 10) / 10;
              }
            });
          }
          if (puliti) c2.posti = puliti; else delete c2.posti;
          if (Number(d.posti_largo) > 40) c2.posti_largo = Math.round(d.posti_largo);
          else delete c2.posti_largo;
          if (Number(d.posti_alto) > 40) c2.posti_alto = Math.round(d.posti_alto);
          else delete c2.posti_alto;
          return c2;
        };
        const p = this._sceltaPercorso;
        // com'era prima: se dopo non e' cambiato niente glielo dico, se no
        // "non e' successo niente" e "non funziona" si assomigliano troppo
        let prima = "";
        try { prima = JSON.stringify(this._cfgPista() || {}); } catch (e) { prima = ""; }
        if (!p || !p.length) {
          this._config = metti(this._config);
          this._emetti();
          this._costruisciBlocco(true);
          this._aggiornaSchemi();
        } else {
          const vecchia = this._schedaA(p);
          if (!vecchia) throw new Error("la scheda scelta non c'e' piu'");
          this._salvaSchede(this._conScheda(p, metti(vecchia)), false);
        }
        let dopo = "";
        try { dopo = JSON.stringify(this._cfgPista() || {}); } catch (e) { dopo = "x"; }
        const uguale = prima && dopo && prima === dopo;
        esito.textContent = uguale
          ? "era gia' cosi': non e' cambiato niente" : "";
        this._aggiornaPista();
        this._dico(uguale
          ? "era gia' cosi': non e' cambiato niente"
          : (intera ? "casella riscritta dal codice"
            : "cambiate solo le righe che hai incollato"));
      } catch (e) {
        esito.textContent = T("Codice non valido: ") + e.message;
      }
    });

    // SOLO LA DISPOSIZIONE E LA MISURA: quello che serve per replicare una
    // casella su un'altra senza portarsi dietro entita', valore e nome.
    const copia = document.createElement("button");
    copia.className = "bt chiaro";
    copia.type = "button";
    copia.textContent = T("Copia la disposizione");
    copia.title = T("Mette negli appunti solo la disposizione e la grandezza: "
      + "incollale nel codice di un'altra casella e premi Applica");
    copia.hidden = true;
    copia.addEventListener("click", async () => {
      const tutto = roba();
      const solo = {};
      ["casa_misura", "grid_options", "posti_largo", "posti_alto", "posti"]
        .forEach((k) => { if (tutto[k] !== undefined) solo[k] = tutto[k]; });
      // nel cassetto mio: e' quello che conta, e non dipende dal browser
      APPUNTI_POSTI = {
        roba: solo,
        da: (this._cfgPista() || {}).name || "un'altra casella",
      };
      // e nei suoi appunti veri, se il browser li da' (fuori da https no)
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(inRiga(solo));
        }
      } catch (e) { /* pazienza, il cassetto basta */ }
      vediIncolla();
      esito.textContent = T("disposizione messa da parte: vai sull'altra "
        + "casella e premi \"Incolla la disposizione\"");
    });

    // e il tasto per rimetterla dove serve
    const incolla = document.createElement("button");
    incolla.className = "bt";
    incolla.type = "button";
    incolla.hidden = true;
    incolla.addEventListener("click", () => {
      if (!APPUNTI_POSTI || !APPUNTI_POSTI.roba) return;
      const d = APPUNTI_POSTI.roba;
      const p = this._sceltaPercorso;
      if (!p || !p.length) {
        this._config = { ...this._config, ...d };
        this._emetti();
      } else {
        const vecchia = this._schedaA(p);
        if (!vecchia) return;
        this._salvaSchede(this._conScheda(p, { ...vecchia, ...d }), false);
      }
      this._aggiornaPista();
      esito.textContent = "";
      this._dico("disposizione presa da \"" + APPUNTI_POSTI.da + "\"");
    });
    const vediIncolla = () => {
      const ce = !!(APPUNTI_POSTI && APPUNTI_POSTI.roba);
      incolla.hidden = dentro.hidden || !ce;
      if (ce) {
        incolla.textContent = T("Incolla la disposizione di \"")
          + APPUNTI_POSTI.da + "\"";
      }
    };

    let costruito = false;
    apri.addEventListener("click", async () => {
      if (!costruito) {
        costruito = true;
        conCasella();
      } else if (edHa) {
        // riaprendolo, i numeri devono essere quelli di adesso: nel
        // frattempo puo' aver spostato mezza casella con il dito
        try { edHa.value = inRiga(roba()); } catch (e) { /* pazienza */ }
      }
      const chiuso = dentro.hidden;
      dentro.hidden = !chiuso;
      applica.hidden = !chiuso;
      copia.hidden = !chiuso;
      vediIncolla();
      esito.textContent = chiuso
        ? "Con la riga \"type:\" riscrivi tutta la casella; senza, cambi "
          + "solo le righe che incolli."
        : "";
    });

    fuori.append(apri, dentro, applica, copia, incolla, esito);
    // se il riquadro cambia padrone - un'altra card, un'altra scheda del
    // pop-up - il codice si riscrive da solo. Ma non mentre ci sta
    // scrivendo dentro: sarebbe peggio del male.
    box._codicePosti = {
      apri,
      dentro,
      rinfresca: () => {
        if (dentro.hidden || !edHa) return;
        try {
          if (edHa.ownerDocument.activeElement === edHa) return;
          edHa.value = inRiga(roba());
        } catch (e) { /* pazienza */ }
      },
    };
    return fuori;
  }

  _aggiornaPista() {
    const box = this._postiBox;
    if (!box || !box._carta || !this._hass) return;
    try {
      box._carta.setConfig({ ...this._cfgPista() });
      // LA CASSA CHE SEGUE LA CASELLA VERA. Il riquadro qui dentro e' una
      // casella nuova di zecca: da sola non puo' sapere quale cassa stavo
      // guardando, e ripartiva da quella scritta nella configurazione -
      // spesso ferma, quindi senza copertina, senza sfondo e senza barra del
      // tempo proprio mentre lui sistema i pezzi. Gliela chiedo alla casella
      // vera che sta sulla plancia.
      const vera = this._cartaVera();
      if (vera && vera._scelto) {
        box._carta._scelto = vera._scelto;
        box._carta._suonavano = vera._suonavano;
      }
      // e anche lo STORICO, che il riquadro non chiede mai per non
      // appesantire: senza, il grafico non lo disegna e tu componi sopra
      // una casella che non ha quello che ha la card vera
      if (vera && vera._storia && vera._storia.length) {
        box._carta._storia = vera._storia;
      }
      box._carta.hass = this._hass;
    } catch (e) { /* una configurazione a meta' non deve rompere niente */ }
    this._diciChi();
    if (box._codicePosti && box._codicePosti.rinfresca) {
      box._codicePosti.rinfresca();
    }
    if (box._prendiDa && box._prendiDa.rinfresca) box._prendiDa.rinfresca();
    this._formaPista();
    if (!box._guarda && window.ResizeObserver) {
      const vera0 = this._cartaVera();
      if (vera0) {
        box._guarda = new ResizeObserver(() => this._formaPista());
        box._guarda.observe(vera0);
      }
    }
    clearTimeout(this._ricontrolla);
    this._ricontrolla = setTimeout(() => this._formaPista(), 350);
    clearTimeout(this._ricontrolla2);
    this._ricontrolla2 = setTimeout(() => this._formaPista(), 1200);
    clearTimeout(this._rimedio);
    this._rimedio = setTimeout(() => this._rimediaVecchi(box._carta), 500);
  }

  // Sto sistemando una casella che vive dentro a un pop-up? Lo capisco dal
  // fatto che sopra di me c'e' un altro editor casa-tile: quello della
  // casella che il pop-up ce l'ha.
  _perIlPopup() {
    let n = this;
    for (let i = 0; i < 40; i += 1) {
      n = n.parentNode || n.host;
      if (!n) return false;
      if (n.localName === "casa-tile-editor") return true;
      const cl = (n.classList && n.classList.contains) ? n.classList : null;
      if (cl && (cl.contains("f-corpo") || cl.contains("popup-anteprima"))) return true;
    }
    return false;
  }

  // la casellina del riquadro prende la misura esatta dell'anteprima
  _formaPista() {
    const box = this._postiBox;
    if (!box || !box._carta) return;
    let largo = 0;
    let alto = 0;
    // 1) la misura che la card si e' segnata quando stava sulla plancia
    //    FUORI dalla modifica: e' quella vera, quella che vedra' lui.
    // 0) se sta sistemando una scheda del pop-up: la misura che ha li'
    let daRicordo = false;
    // 00) la misura che ha appena dato lui tirando il quadratino giallo:
    //     comanda su tutto, se no il riquadro tornerebbe indietro
    let daLui = false;
    if (box._tirata && box._tirata.w > 40 && box._tirata.h > 20) {
      largo = box._tirata.w;
      alto = box._tirata.h;
      daRicordo = true;
      daLui = true;
    }
    const scelta = (!largo && this._sceltaPercorso && this._sceltaPercorso.length)
      ? this._misuraScelta : null;
    // Anche se e' piccola: una casella dentro a una griglia e' larga
    // novanta punti scarsi, e scartandola finivo per mostrare (e per
    // misurare) tutt'altra card.
    if (!largo && scelta && scelta.w > 40 && scelta.h > 24) {
      largo = scelta.w;
      alto = scelta.h;
      daRicordo = true;
    }
    const c0 = this._cfgPista() || {};
    if (!largo && (c0.entity || c0.name)) {
      // se sto sistemando una casella del pop-up, la misura buona e' quella
      // che ha DENTRO al pop-up, non quella di una casella sulla plancia
      const base = "casa-tile:misura3:" + (c0.entity || "") + "|" + (c0.name || "");
      const dentroPop = this._perIlPopup()
        || !!(this._sceltaPercorso && this._sceltaPercorso.length);
      const chiavi = dentroPop ? [base + "|pop", base] : [base, base + "|pop"];
      for (let i = 0; i < chiavi.length && !daRicordo; i += 1) {
        try {
          const pezzi = String(localStorage.getItem(chiavi[i]) || "").split("x");
          const w = Number(pezzi[0]);
          const h = Number(pezzi[1]);
          // sotto ai 90px non e' una casella su cui si possa comporre
          // qualcosa: meglio l'anteprima che un francobollo
          if (w > 90 && h > 40) {
            largo = w; alto = h; daRicordo = true;
            this._ricordoDalPopup = chiavi[i].indexOf("|pop") > 0;
          }
        } catch (e) { /* pazienza */ }
      }
    }
    // 2) se non se l'e' segnata, la card com'e' adesso sulla plancia
    const plancia = largo ? null : this._cartaPlancia();
    if (plancia) {
      const q = plancia.getBoundingClientRect();
      if (q.width > 90 && q.height > 40) { largo = q.width; alto = q.height; }
    }
    // 3) se non e' su nessuna plancia (card appena creata), l'anteprima
    const vera = largo ? null : this._cartaVera();
    if (vera) {
      // ATTENZIONE: misuro la CASELLA, non tutto l'elemento: sotto alla
      // casella l'anteprima si porta dietro il riquadro del pop-up, che e'
      // piu' grande, e cosi' la casellina veniva larga il doppio
      const suaCard = vera.shadowRoot && vera.shadowRoot.querySelector("ha-card");
      const q = (suaCard || vera).getBoundingClientRect();
      if (q.width > 40 && q.height > 20) { largo = q.width; alto = q.height; }
    }
    if (!largo) {
      const g = this._config.grid_options || {};
      const col = Number(g.columns) > 0 ? Number(g.columns) : 4;
      const rig = Number(g.rows) > 0 ? Number(g.rows) : 2;
      largo = Math.round(col / 12 * 500);
      alto = rig * 56 + (rig - 1) * 8;
    }
    // Un filo piu' piccola dell'anteprima, ma SEMPRE in proporzione: se
    // stringessi solo la larghezza cambierebbe forma e i pezzi finirebbero
    // in un punto qui e in un altro sulla plancia.
    // ESATTAMENTE la misura dell'anteprima: bastano pochi pixel di
    // differenza e le misure vanno a capo in un modo qui e in un altro la',
    // quindi le due caselle sembrano diverse.
    // l'altezza VERA della casella, prima di rimpicciolirla per farla stare
    // nella finestra: serve a chi compone i pezzi con l'altezza automatica
    box._altoVero = alto;
    box._largoVero = largo;
    const posto = Math.max(190, (box.clientWidth || 420) - 28);
    // NON LE CAMBIO LA MISURA: la guardo da piu' lontano. Rimpicciolirla
    // per davvero voleva dire impaginarla in un altro modo - i tasti del
    // lettore andavano a capo diversi, la scala cambiava - e il riquadro
    // faceva vedere una casella che non era quella.
    const fetta = (largo > posto && !box._grande) ? posto / largo : 1;
    const stretta = fetta < 1;
    const quanto = Math.round(fetta * 100);
    const pista = box.querySelector(".pista");
    if (pista) pista.classList.toggle("larga", !!box._grande && largo > posto);
    box._carta.style.width = Math.round(largo) + "px";
    box._carta.style.height = Math.round(alto) + "px";
    if (stretta) {
      box._carta.style.transformOrigin = "top left";
      box._carta.style.transform = "scale(" + (Math.round(fetta * 1000) / 1000) + ")";
      // rimpicciolendola resta il buco dello spazio che non occupa piu':
      // questi due se lo riprendono
      box._carta.style.marginRight = "-" + Math.round(largo * (1 - fetta)) + "px";
      box._carta.style.marginBottom = "-" + Math.round(alto * (1 - fetta)) + "px";
    } else if (box._carta.style.transform) {
      box._carta.style.transform = "";
      box._carta.style.marginRight = "";
      box._carta.style.marginBottom = "";
    }
    // e la prende ESATTA: la casella ha un'altezza minima sua (116 punti)
    // e il riquadro veniva fuori piu' alto della card vera - erano le due
    // figure che non combaciavano
    box._carta.toggleAttribute("misura-fissa", true);
    if (box._grandezza) box._grandezza._sistema();
    // le due caselline dicono sempre dove si e' arrivati - ma non mentre
    // ci sta scrivendo dentro
    if (box._numeri) {
      const dentro = box._numeri.largo.ownerDocument.activeElement;
      if (dentro !== box._numeri.largo) {
        box._numeri.largo.value = String(Math.round(box._largoVero || 0));
      }
      if (dentro !== box._numeri.alto) {
        box._numeri.alto.value = String(Math.round(box._altoVero || 0));
      }
    }
    // scritto nero su bianco da dove ho preso la misura: se il riquadro non
    // combacia con la plancia, si vede subito da qui il perche'
    if (box._nota && !box._nota._occupata) {
      box._nota.textContent = "riquadro " + Math.round(largo) + "x"
        + Math.round(alto) + (stretta ? " (guardata al " + quanto
          + "%: premi \"Grandezza vera\" per vederla a grandezza naturale)" : "")
        + " - " + (daLui
          ? "la misura che hai dato tu"
          : daRicordo
          ? (this._ricordoDalPopup
            ? "misura vera della casella dentro al pop-up"
            : "misura vera della card sulla plancia")
          : (plancia ? "misura della card mentre la plancia e' in modifica"
            : (vera ? "misura dell'anteprima: la card non l'ho trovata sulla plancia"
              : "misura calcolata dalle colonne del Layout")));
    }
  }

  // La casella vera dell'anteprima. Attenzione: DENTRO la finestra delle
  // impostazioni e basta. Dietro alla finestra c'e' la plancia con tutte le
  // altre caselle, e cercando in tutta la pagina finivo per misurare una di
  // quelle, che e' larga tutt'altro.
  // la finestra delle impostazioni che mi contiene (e la cima, se non c'e')
  _finestraMia() {
    let cima = this;
    let dialogo = null;
    for (let i = 0; i < 60; i += 1) {
      const p = cima.parentNode || cima.host;
      if (!p) break;
      cima = p;
      const nome = String(cima.localName || "");
      if (nome.indexOf("dialog") >= 0 || nome === "hui-dialog-edit-card") {
        dialogo = cima;
        break;
      }
    }
    return { dialogo: dialogo, cima: cima };
  }

  // La stessa casella FUORI dalla finestra: e' quella vera sulla plancia,
  // con la misura che le da' il "Layout" di Home Assistant (colonne e
  // righe). E' quella che deve fare da modello al riquadro, se no lui
  // compone su una forma e poi sulla plancia ne trova un'altra.
  _cartaPlancia() {
    if (this._planciaSalvata && this._planciaSalvata.isConnected) {
      return this._planciaSalvata;
    }
    // Girare tutta la pagina costa: lo faccio UNA volta per ogni casella
    // che sto sistemando. Prima, quando non la trovavo (e' il caso delle
    // caselle che vivono solo dentro ai pop-up), rifacevo il giro a ogni
    // ricontrollo e la finestra delle impostazioni si trascinava.
    const chi = (this._config || {}).entity + "|" + (this._config || {}).name;
    if (this._planciaCercata === chi) return null;
    this._planciaCercata = chi;
    // una scheda che vive dentro al pop-up sulla plancia non c'e': il giro
    // di tutta la pagina sarebbe fatica buttata via
    if (this._perIlPopup()) return null;
    const { dialogo, cima } = this._finestraMia();
    const mia = this._config || {};
    if (!mia.entity && !mia.name) return null;
    // la plancia e' grande: di nodi da girare ce ne vogliono tanti
    let restano = 120000;
    let precisa = null;
    // dentro a un pop-up? allora non e' lei la card sulla plancia
    const dentroUnaltra = (el) => {
      let n = el;
      for (let i = 0; i < 14; i += 1) {
        n = n.parentNode || n.host;
        if (!n) return false;
        if (n.localName === "casa-tile") return true;
      }
      return false;
    };
    const cerca = (n) => {
      if (!n || restano <= 0 || precisa) return;
      if (n === dialogo) return;   // dentro alla finestra non guardo
      restano -= 1;
      if (n.nodeType === 1) {
        if (n.localName === "casa-tile" && !n.hasAttribute("solo-casella")) {
          const suo = n._config || {};
          // nome E entita' uguali: la sola entita' non basta, gli stessi
          // comandi rapidi (0W, 95W, 110W...) la condividono e sono grandi
          // come un francobollo
          if (suo.entity === mia.entity
              && String(suo.name || "") === String(mia.name || "")
              && n.getBoundingClientRect().width > 40
              && !dentroUnaltra(n)) {
            precisa = n;
            return;
          }
        }
        if (n.shadowRoot) cerca(n.shadowRoot);
      }
      const figli = n.children || [];
      for (let i = 0; i < figli.length && !precisa; i += 1) cerca(figli[i]);
    };
    try { cerca(document.body || cima); } catch (e) { /* pazienza */ }
    this._planciaSalvata = precisa;
    this._nodiGirati = 120000 - restano;
    return this._planciaSalvata;
  }

  _cartaVera() {
    if (this._veraSalvata && this._veraSalvata.isConnected) return this._veraSalvata;
    const { dialogo, cima } = this._finestraMia();
    const partenza = dialogo || cima;
    const mia = JSON.stringify(this._config || {});
    let restano = 8000;
    const trovate = [];
    const cerca = (n) => {
      if (!n || restano <= 0) return;
      restano -= 1;
      if (n.nodeType === 1) {
        if (n.localName === "casa-tile" && !n.hasAttribute("solo-casella")) {
          trovate.push(n);
        }
        if (n.shadowRoot) cerca(n.shadowRoot);
      }
      const figli = n.children || [];
      for (let i = 0; i < figli.length; i += 1) cerca(figli[i]);
    };
    try { cerca(partenza); } catch (e) { /* pazienza */ }
    // fra quelle trovate scelgo quella che ha la MIA configurazione
    let vera = trovate.find((c) => {
      try { return JSON.stringify(c._config || {}) === mia; } catch (e) { return false; }
    });
    if (!vera) {
      vera = trovate.find((c) => c._config
        && c._config.entity === (this._config || {}).entity);
    }
    if (!vera && dialogo) vera = trovate[0] || null;
    this._veraSalvata = vera || null;
    return this._veraSalvata;
  }

  // il trascinamento vero e proprio
  // Passando a mano libera ogni pezzo prende la sua misura naturale, che
  // puo' essere piu' larga di quando stavano in fila (in fila si stringono
  // a vicenda). Cosi' due misure possono finire una sull'altra. Questa
  // passata le distanzia, e la faccio UNA volta sola: quando trascina lui
  // il pezzo resta esattamente dove l'ha lasciato.
  _sbrogliaPosti(posti) {
    const fuori = { ...posti };
    const chiavi = Object.keys(fuori).filter((k) => k !== "misure"
      && k !== "_base" && fuori[k]
      && isFinite(fuori[k].x) && isFinite(fuori[k].w) && isFinite(fuori[k].h));
    chiavi.sort((a, b) => (fuori[a].y - fuori[b].y) || (fuori[a].x - fuori[b].x));
    const tocca = (a, b) => a.x < b.x + b.w - 0.6 && a.x + a.w > b.x + 0.6
      && a.y < b.y + b.h - 0.6 && a.y + a.h > b.y + 0.6;
    const messi = [];
    chiavi.forEach((k) => {
      const p = { ...fuori[k] };
      for (let giro = 0; giro < 20; giro += 1) {
        const sotto = messi.find((m) => tocca(p, m));
        if (!sotto) break;
        p.y = Math.round((sotto.y + sotto.h + 1.2) * 10) / 10;
        if (p.y + p.h > 100) { p.y = Math.max(0, Math.round((100 - p.h) * 10) / 10); break; }
      }
      p.dx = Math.round((100 - p.x - p.w) * 10) / 10;
      fuori[k] = p;
      messi.push(p);
    });
    return fuori;
  }

  // le disposizioni salvate prima della 2.4.18 si portavano dietro le
  // larghezze in percentuale: adesso che ogni pezzo prende la sua misura
  // vera si sovrappongono. Le rimetto in ordine una volta sola.
  _rimediaVecchi(carta) {
    if (this._giaSbrogliato) return;
    const posti = this._cfgPista().posti;
    if (!posti || !Object.keys(posti).length) return;
    const daRifare = Object.keys(posti).some((k) => k !== "misure"
      && k !== "_base" && posti[k] && !isFinite(posti[k].dx));
    // se e' gia' a posto non tocco niente: le sue posizioni sono sue
    if (!daRifare) { this._giaSbrogliato = true; return; }
    const veri = carta.posizioniAdesso();
    if (!Object.keys(veri).length) {
      // la casellina non e' ancora impaginata (la scheda "Aspetto" e' chiusa):
      // riprovo, se no il rimedio non parte piu' per tutta la sessione
      this._tentativi = (this._tentativi || 0) + 1;
      if (this._tentativi < 20) {
        clearTimeout(this._rimedio);
        this._rimedio = setTimeout(() => this._rimediaVecchi(carta), 600);
      }
      return;
    }
    this._giaSbrogliato = true;
    const uniti = {};
    Object.keys(posti).forEach((k) => {
      uniti[k] = veri[k] ? { ...posti[k], ...veri[k] } : posti[k];
    });
    this._scriviPosti(this._sbrogliaPosti(uniti));
    this._aggiornaPista();
  }

  // ---- quale casella sto sistemando nel riquadro ----
  // Il riquadro e' UNO SOLO, nella pagina principale. Toccando una casella
  // nell'anteprima del pop-up si sceglie lei: cosi' non serve rifare tutto
  // l'armamentario dentro a ogni scheda.
  _schedaA(percorso) {
    let lista = this._schede();
    let c = null;
    for (let i = 0; i < percorso.length; i += 1) {
      c = lista[percorso[i]];
      if (!c) return null;
      lista = c.cards || [];
    }
    return c;
  }

  _conScheda(percorso, nuova) {
    const clona = (lista, liv) => {
      const fuori = lista.slice();
      const i = percorso[liv];
      if (liv === percorso.length - 1) fuori[i] = nuova;
      else fuori[i] = { ...fuori[i], cards: clona(fuori[i].cards || [], liv + 1) };
      return fuori;
    };
    return clona(this._schede(), 0);
  }

  _trovaPercorso(cfg) {
    const uguale = (a, b) => String(a.type) === String(b.type)
      && String(a.entity || "") === String(b.entity || "")
      && String(a.name || "") === String(b.name || "");
    const cerca = (lista, base) => {
      for (let i = 0; i < lista.length; i += 1) {
        const c = lista[i] || {};
        if (uguale(c, cfg)) return base.concat([i]);
        if (Array.isArray(c.cards)) {
          const giu = cerca(c.cards, base.concat([i]));
          if (giu) return giu;
        }
      }
      return null;
    };
    return cerca(this._schede(), []);
  }

  // la configurazione della casella che il riquadro sta mostrando
  _cfgPista() {
    const p = this._sceltaPercorso;
    if (p && p.length) {
      const c = this._schedaA(p);
      if (c) return c;
    }
    return this._config;
  }

  // Le voci spurie lasciate dal baco dei due nomi confusi: "pezzi" che si
  // chiamano come un'entita'. Un nome di pezzo non ha mai il punto dentro.
  _postiPuliti(posti) {
    if (!posti) return posti;
    const buoni = {};
    let sporchi = 0;
    Object.keys(posti).forEach((k) => {
      const n = String(k);
      // i pezzi che indicano una cosa precisa - un sensore, un tasto, un
      // attrezzo - hanno i due punti davanti: "misura:sensor.batteria",
      // "tasto:play". Quelli vanno tenuti, punto o non punto.
      // Le voci spurie invece erano nomi di entita' NUDI, senza niente
      // davanti: quelli si buttano.
      if (n.indexOf(".") >= 0 && n.indexOf(":") < 0) { sporchi += 1; return; }
      buoni[k] = posti[k];
    });
    if (sporchi) this._dico("tolti " + sporchi + " pezzi che non esistevano");
    return Object.keys(buoni).length ? buoni : null;
  }

  // e dove vanno scritte le posizioni quando lui trascina
  _scriviPosti(posti) {
    posti = this._postiPuliti(posti);
    // Con i pezzi liberi sono tutti staccati dal flusso: la casella non ha
    // piu' niente da misurare e con "Altezza automatica" si accartoccia.
    // Allora mi segno l'altezza che aveva mentre lui componeva, e la casella
    // la usa come altezza minima: le percentuali tornano a voler dire
    // qualcosa. Vedi _mettiAPosto.
    const box = this._postiBox;
    const suo = box && box._altoVero > 40 ? Math.round(box._altoVero) : 0;
    const suoLargo = box && box._largoVero > 40 ? Math.round(box._largoVero) : 0;
    const p = this._sceltaPercorso;
    if (!p || !p.length) {
      const c2 = { ...this._config };
      if (posti) c2.posti = posti; else delete c2.posti;
      if (posti && suo) c2.posti_alto = suo; else delete c2.posti_alto;
      if (posti && suoLargo) c2.posti_largo = suoLargo; else delete c2.posti_largo;
      this._config = c2;
      this._emetti();
      return;
    }
    const vecchia = this._schedaA(p);
    if (!vecchia) return;
    const nuova = { ...vecchia };
    if (posti) nuova.posti = posti; else delete nuova.posti;
    if (posti && suo) nuova.posti_alto = suo; else delete nuova.posti_alto;
    if (posti && suoLargo) nuova.posti_largo = suoLargo; else delete nuova.posti_largo;
    this._salvaSchede(this._conScheda(p, nuova), false);
  }

  _diciChi() {
    const box = this._postiBox;
    if (!box || !box._chi) return;
    box._chi.innerHTML = "";
    const p = this._sceltaPercorso;
    if (!p || !p.length) {
      box._chi.textContent = T("Stai sistemando: questa casella. "
        + "Per una scheda del pop-up, toccala nell'anteprima qui di fianco.");
      return;
    }
    const c = this._schedaA(p) || {};
    const eti = document.createElement("span");
    eti.className = "chi-nome";
    eti.textContent = "Stai sistemando: " + (c.name || c.entity || "una scheda del pop-up");
    const torna = document.createElement("button");
    torna.type = "button";
    torna.className = "tastoPiatto";
    torna.textContent = T("Torna alla casella");
    torna.addEventListener("click", () => {
      this._sceltaPercorso = null;
      this._misuraScelta = null;
      if (box) box._tirata = null;
      this._giaSbrogliato = false;
      this._planciaCercata = null;
      this._planciaSalvata = null;
      this._aggiornaPista();
    });
    box._chi.append(eti, torna);
  }

  _dico(testo) {
    const box = this._postiBox;
    if (!box || !box._nota) return;
    box._nota._occupata = true;
    box._nota.textContent = testo;
  }

  _pistaTrascina(carta) {
    const PEZZI = [
      ["valore", ".valore"],
      ["nome", ".testi"],
      ["extra", ".extra:not([hidden])"],
      ["colori", ".colori:not([hidden])"],
      ["lettori", ".lettori:not([hidden])"],
      ["attrezzi", ".ytattrezzi:not([hidden])"],
      ["cuore", ".ytcuore:not([hidden])"],
      ["tempo", ".tempo:not([hidden])"],
      ["cursore", ".cursore:not([hidden])"],
      ["comandi", ".comandi:not([hidden])"],
      ["icona", "svg.icona,img.ritratto,.iconaHa,.iconaFoto"],
      // il timbro per ultimo: sta dietro a tutto, e chi gli sta sopra deve
      // avere la precedenza sotto il dito
      ["sfondo", "svg.iconafondo:not([hidden]), img.fotofondo:not([hidden])"],
    ];
    // Chi sta sotto al dito? Lo cerco confrontando le posizioni invece di
    // chiedere al browser "cosa c'e' qui": quella strada non risponde se il
    // riquadro e' fuori dallo schermo o dentro a un'ombra.
    const chiSono = (x, y) => {
      const radice = carta.shadowRoot;
      if (!radice) return null;
      const dentro = (el) => {
        if (!el) return false;
        const r = el.getBoundingClientRect();
        return r.width > 0 && x >= r.left - 2 && x <= r.right + 2
          && y >= r.top - 2 && y <= r.bottom + 2;
      };
      // i tasti per primi, poi le misure: sono i pezzi piu' piccoli e
      // stanno sopra agli altri
      const tasti = radice.querySelectorAll(".comandi button");
      for (let i = 0; i < tasti.length; i += 1) {
        const chi = nomeTasto(tasti[i]);
        if (!tasti[i].hidden && chi && dentro(tasti[i])) {
          return { chi: "tasto:" + chi, el: tasti[i] };
        }
      }
      const attrezzi = radice.querySelectorAll(".ytattrezzi button");
      for (let i = 0; i < attrezzi.length; i += 1) {
        const chi = nomeAttrezzo(attrezzi[i]);
        if (!attrezzi[i].hidden && chi && dentro(attrezzi[i])) {
          return { chi: "attrezzo:" + chi, el: attrezzi[i] };
        }
      }
      const misure = radice.querySelectorAll(".chips .metrica");
      for (let i = 0; i < misure.length; i += 1) {
        if (dentro(misure[i]) && misure[i].dataset.eid) {
          return { chi: "misura:" + misure[i].dataset.eid, el: misure[i] };
        }
      }
      for (let i = 0; i < PEZZI.length; i += 1) {
        // querySelector da' SOLO il primo: per l'icona i disegni possibili
        // sono quattro (disegno nostro, icona di Home Assistant, foto tua,
        // copertina del disco) e quello buono e' l'unico acceso. Cercando
        // solo il primo, con la copertina vera non si prendeva niente.
        const tutti = radice.querySelectorAll(PEZZI[i][1]);
        for (let k = 0; k < tutti.length; k += 1) {
          if (dentro(tutti[k])) return { chi: PEZZI[i][0], el: tutti[k] };
        }
      }
      return null;
    };
    let preso = null;

    // Il quadratino giallo con la freccina: si tiene premuto e il pezzo
    // cresce o rimpicciolisce. Sta FUORI dalla casellina (nel riquadro che
    // la contiene) cosi' non finisce dentro alla disposizione salvata.
    const maniglia = document.createElement("div");
    maniglia.className = "pista-maniglia";
    maniglia.hidden = true;
    maniglia.title = T("Tieni premuto e trascina per ingrandire o rimpicciolire");
    maniglia.innerHTML = '<i class="q"><svg viewBox="0 0 24 24" aria-hidden="true">'
      + '<path d="M21,15V21H15V19H17.6L13.5,14.9L14.9,13.5L19,17.6V15H21M9.1,'
      + '10.5L10.5,9.1L6.4,5H9V3H3V9H5V6.4L9.1,10.5Z"></path></svg></i>';
    carta._maniglia = maniglia;

    const pezziDi = (chi) => {
      const radice = carta.shadowRoot;
      if (!radice || !chi) return [];
      if (chi.indexOf("tasto:") === 0) {
        const q = chi.slice(6);
        return [...radice.querySelectorAll(".comandi button")]
          .filter((b) => !b.hidden && [...b.classList].indexOf(q) !== -1);
      }
      if (chi.indexOf("attrezzo:") === 0) {
        const q = chi.slice(9);
        return [...radice.querySelectorAll(".ytattrezzi button")]
          .filter((b) => !b.hidden && nomeAttrezzo(b) === q);
      }
      if (chi.indexOf("misura:") === 0) {
        const eid = chi.slice(7);
        return [...radice.querySelectorAll(".chips .metrica")]
          .filter((e) => e.dataset.eid === eid);
      }
      const mappa = {
        nome: [".testi"], misure: [".chips"], valore: [".valore"],
        icona: ["svg.icona", "img.ritratto", ".iconaHa", ".iconaFoto"],
        cursore: [".cursore"], comandi: [".comandi"],
        attrezzi: [".ytattrezzi"], cuore: [".ytcuore"],
        tempo: [".tempo"], extra: [".extra"], lettori: [".lettori"],
        colori: [".colori"],
        // l'icona grande e sbiadita dietro alle scritte, disegno o foto
        sfondo: ["svg.iconafondo", "img.fotofondo"],
      };
      // su un <svg> ".hidden" non segue l'attributo: qui va chiesto
      // l'attributo, se no un timbro spento sembra acceso
      return (mappa[chi] || []).map((sel) => radice.querySelector(sel))
        .filter((el) => el && !el.hasAttribute("hidden")
          && el.getBoundingClientRect().width);
    };

    // RIAGGANCIA A SINISTRA senza spostarlo: lo lascio dov'e' ma tenuto
    // per l'angolo in alto a sinistra, che e' dove sta la posizione che gli
    // do io. Da quel momento cresce verso destra e sta sotto il dito.
    const perLaSinistra = (chi) => {
      const rc = carta.riquadroCasella();
      if (!rc) return;
      pezziDi(chi).forEach((x2) => {
        try {
          const rr = x2.getBoundingClientRect();
          x2.style.transformOrigin = "top left";
          x2.style.right = "auto";
          x2.style.left = (Math.round((rr.left - rc.left) / rc.width * 1000) / 10) + "%";
          x2.style.top = (Math.round((rr.top - rc.top) / rc.height * 1000) / 10) + "%";
        } catch (e) { /* pazienza */ }
      });
    };

    const scalaDi = (chi) => {
      const posti = (this._cfgPista() || {}).posti || {};
      const v0 = posti[chi] && posti[chi].s;
      return isFinite(v0) && v0 > 0 ? v0 : 1;
    };

    const aggiornaManiglia = () => {
      const chi = carta._pezzoScelto;
      const pezzi = chi ? pezziDi(chi) : [];
      const pista = carta.parentElement;
      const numeri = this._postiBox && this._postiBox._numeriPezzo;
      if (numeri) numeri.riga.hidden = !chi || !pezzi.length;
      if (!chi || !pezzi.length || !pista) {
        maniglia.hidden = true;
        if (carta.shadowRoot) {
          carta.shadowRoot.querySelectorAll(".scelto")
            .forEach((el) => el.classList.remove("scelto"));
        }
        return;
      }
      if (maniglia.parentElement !== pista) pista.appendChild(maniglia);
      // segno il pezzo scelto, se no non si capisce di chi e' il quadratino
      const radice = carta.shadowRoot;
      if (radice) {
        radice.querySelectorAll(".scelto").forEach((el) => {
          if (pezzi.indexOf(el) === -1) el.classList.remove("scelto");
        });
      }
      pezzi.forEach((el) => el.classList.add("scelto"));
      const r = pezzi[0].getBoundingClientRect();
      const rp = pista.getBoundingClientRect();
      maniglia.hidden = false;
      // il quadratino sta in mezzo all'angolo, ma la parte che risponde al
      // dito e' piu' larga di lui: sulle caselle fitte finiva sopra ai tasti
      // e bastava sbagliare di due pixel per prendere il pezzo di sotto
      // SEMPRE IN BASSO A DESTRA, e appoggiato FUORI dal pezzo: stando
      // sopra lo copriva, e sbagliando di un pelo il tocco finiva sul pezzo
      // - che risponde con la manina e si mette a spostarsi invece di
      // crescere. Che poi quell'angolo si muova davvero anche per i pezzi
      // agganciati a destra ci pensa "perLaSinistra", appena lo prendi.
      maniglia.style.left = (r.right - rp.left - 12 + pista.scrollLeft) + "px";
      maniglia.style.top = (r.bottom - rp.top - 12 + pista.scrollTop) + "px";
      // e le caselline dicono dov'e' e quanto e' grande - ma non mentre ci
      // sta scrivendo dentro
      if (numeri) {
        const dove = ((this._cfgPista() || {}).posti || {})[chi] || {};
        const dentro = numeri.gr.ownerDocument.activeElement;
        numeri.chi.textContent = T("Pezzo: ") + chi;
        const metti = (campo, valore) => {
          if (dentro === campo) return;
          campo.value = String(Math.round(valore * 10) / 10);
        };
        metti(numeri.gr, (misuro ? misuro.k : (dove.s > 0 ? dove.s : 1)) * 100);
        metti(numeri.px, isFinite(dove.x) ? dove.x : 0);
        metti(numeri.py, isFinite(dove.y) ? dove.y : 0);
      }
    };
    carta._aggiornaManiglia = aggiornaManiglia;

    // Il pezzo si vede crescere mentre tieni premuto, senza rifare la
    // casella. Il punto fermo e' SEMPRE l'angolo in alto a sinistra: ce
    // l'ha messo "perLaSinistra" appena hai preso il quadratino, e
    // rimettercelo dall'altra parte a ogni fotogramma - com'era prima -
    // voleva dire tenere l'angolo di destra inchiodato mentre il dito
    // andava per conto suo.
    const provaScala = (chi, k) => {
      pezziDi(chi).forEach((el) => {
        el.style.transformOrigin = "top left";
        el.style.transform = k === 1 ? "" : "scale(" + k + ")";
      });
    };

    let misuro = null;
    const avviaMisura = (e) => {
      const chi = carta._pezzoScelto;
      const pezzi = chi ? pezziDi(chi) : [];
      if (!pezzi.length) return false;
      e.preventDefault();
      e.stopPropagation();
      const r = pezzi[0].getBoundingClientRect();
      // Da che angolo cresce il pezzo? Dallo stesso da cui e' attaccato:
      // in alto a sinistra, o in alto a destra se sta a destra della
      // casella. E' la stessa scelta che fa "provaScala".
      // da qui in poi cresce verso destra: cosi' il quadratino, che sta
      // in basso a destra, e' su un angolo che si muove davvero
      perLaSinistra(chi);
      const r2 = pezzi[0].getBoundingClientRect();
      misuro = { chi: chi, x: e.clientX, y: e.clientY,
                 w: r.width, h: r.height, s: scalaDi(chi), k: scalaDi(chi),
                 // dov'e' l'angolo adesso e da dove cresce: da qui in poi
                 // l'angolo deve stare sotto il dito
                 destra0: r2.right, fondo0: r2.bottom,
                 sinistra0: r2.left, cima0: r2.top, aDestra: false };
      maniglia.classList.add("inmano");
      try { maniglia.setPointerCapture(e.pointerId); } catch (e2) { /* pazienza */ }
      return true;
    };
    // Il dito e' sul quadratino? Lo decido dalle POSIZIONI, non chiedendo al
    // browser su cosa ha premuto: dentro alla finestra delle impostazioni il
    // tocco passa per un mucchio di gusci e l'unico modo sicuro di sapere
    // dov'e' finito e' guardare dove sta.
    const sulQuadratino = (x, y) => {
      if (maniglia.hidden || !maniglia.isConnected) return false;
      const r = maniglia.getBoundingClientRect();
      // la zona che risponde e' piu' larga del quadratino: cosi' si prende
      // anche senza mirare
      return r.width > 0 && x >= r.left - 9 && x <= r.right + 9
        && y >= r.top - 9 && y <= r.bottom + 9;
    };
    maniglia.addEventListener("pointerdown", avviaMisura);
    const misuraMuovi = (e) => {
      if (!misuro) return;
      e.preventDefault();
      e.stopPropagation();
      // L'ANGOLO STA SOTTO IL DITO. Il pezzo cresce da un angolo fermo,
      // quindi la grandezza che porta l'angolo di sotto dove sta il dito
      // si sa esattamente: e' la distanza fra i due, divisa per quanto e'
      // grande il pezzo a grandezza uno.
      const largo1 = Math.max(6, misuro.w / Math.max(0.05, misuro.s));
      const alto1 = Math.max(6, misuro.h / Math.max(0.05, misuro.s));
      const voglioY = misuro.fondo0 + (e.clientY - misuro.y);
      const ky = (voglioY - misuro.cima0) / alto1;
      // il pezzo agganciato a destra cresce verso sinistra: l'angolo che si
      // muove e' quello di sotto a SINISTRA, ed e' quello che insegue il dito
      const voglioX = misuro.aDestra
        ? misuro.sinistra0 + (e.clientX - misuro.x)
        : misuro.destra0 + (e.clientX - misuro.x);
      const kx = misuro.aDestra
        ? (misuro.destra0 - voglioX) / largo1
        : (voglioX - misuro.sinistra0) / largo1;
      const k = Math.max(0.4, Math.min(3, (kx + ky) / 2));
      misuro.k = Math.round(k * 100) / 100;
      provaScala(misuro.chi, misuro.k);
      aggiornaManiglia();
      this._dico("grandezza " + Math.round(misuro.k * 100) + "%");
    };
    const misuraLascia = () => {
      if (!misuro) return;
      maniglia.classList.remove("inmano");
      const posti = { ...((this._cfgPista() || {}).posti || {}) };
      const vecchio = { ...(posti[misuro.chi] || {}) };
      const k = misuro.k;
      if (k === 1) delete vecchio.s; else vecchio.s = k;
      // E I DUE AGGANCI DEVONO COMBACIARE. Il pezzo adesso e' grande
      // un'altra cosa: mi riprendo la sua figura e riscrivo sia la
      // distanza da sinistra sia quella da destra su quella. Cosi'
      // comunque la casella decida di tenerlo - a sinistra o a destra -
      // resta dove l'hai visto.
      const rc2 = carta.riquadroCasella();
      const pz2 = pezziDi(misuro.chi)[0];
      if (rc2 && pz2) {
        const rr = pz2.getBoundingClientRect();
        vecchio.x = Math.round((rr.left - rc2.left) / rc2.width * 1000) / 10;
        vecchio.y = Math.round((rr.top - rc2.top) / rc2.height * 1000) / 10;
        vecchio.dx = Math.round((rc2.width - (rr.right - rc2.left))
          / rc2.width * 1000) / 10;
      }
      posti[misuro.chi] = vecchio;
      carta._appenaSpostato = true;
      this._scriviPosti(posti);
      this._dico("grandezza salvata: " + Math.round(k * 100) + "%");
      misuro = null;
      setTimeout(aggiornaManiglia, 60);
    };
    maniglia.addEventListener("pointermove", misuraMuovi);
    maniglia.addEventListener("pointerup", misuraLascia);
    maniglia.addEventListener("pointercancel", misuraLascia);
    carta._misuraMuovi = misuraMuovi;
    carta._misuraLascia = misuraLascia;

    // Ascolto sulla FINESTRA, in cattura: cosi' arrivo prima di chiunque
    // altro. Attaccandomi alla casellina, qualcuno piu' in alto (la
    // finestra delle impostazioni, gli elenchi trascinabili di Home
    // Assistant) poteva fermare il tocco prima che arrivasse a me.
    const giu = (e) => {
      const radice = carta.shadowRoot;
      if (!radice || !carta.isConnected) return;
      const rq = carta.getBoundingClientRect();
      if (!rq.width) return;
      if (e.clientX < rq.left || e.clientX > rq.right
          || e.clientY < rq.top || e.clientY > rq.bottom) return;
      // il quadratino della grandezza viene prima di tutto
      if (e.target === maniglia
        || (e.target && e.target.nodeType && maniglia.contains(e.target))) return;
      if (sulQuadratino(e.clientX, e.clientY) && avviaMisura(e)) return;
      const q = chiSono(e.clientX, e.clientY);
      this._dico(q ? "preso: " + q.chi : "sotto al dito non c'e' nessun pezzo");
      if (!q) {
        carta._pezzoScelto = null;
        aggiornaManiglia();
        return;
      }
      carta._pezzoScelto = q.chi;
      setTimeout(aggiornaManiglia, 0);
      e.preventDefault();
      e.stopPropagation();
      // la prima volta fisso tutti i pezzi dove stanno adesso, se no
      // saltano tutti appena ne muovo uno
      const mia = this._cfgPista();
      if (!mia.posti || !Object.keys(mia.posti).length) {
        const ora = carta.posizioniAdesso();
        if (!Object.keys(ora).length) return;
        this._scriviPosti(ora);
        // la metto subito in modo libero, se no il primo trascinamento
        // partirebbe dalla disposizione automatica
        try { carta.setConfig({ ...this._cfgPista() }); } catch (e2) { /* pazienza */ }
        try { carta.hass = this._hass; } catch (e3) { /* pazienza */ }
        // adesso che sono liberi hanno preso la loro misura vera: rimisuro
        // e li distanzio, se no partono gia' uno sopra l'altro
        const veri = carta.posizioniAdesso();
        if (Object.keys(veri).length) {
          this._giaSbrogliato = true;
          this._scriviPosti(this._sbrogliaPosti(veri));
          try { carta.setConfig({ ...this._cfgPista() }); } catch (e4) { /* pazienza */ }
          try { carta.hass = this._hass; } catch (e5) { /* pazienza */ }
        }
      }
      // Il primo tasto che prende stacca tutta la fila: gli altri li fisso
      // dove sono adesso, se no saltano tutti nell'istante in cui la fila
      // smette di contare come un blocco solo.
      if (q.chi.indexOf("attrezzo:") === 0) {
        const p0 = (this._cfgPista() || {}).posti || {};
        if (!Object.keys(p0).some((k) => k.indexOf("attrezzo:") === 0)) {
          const dove = carta.posizioniAttrezzi ? carta.posizioniAttrezzi() : {};
          if (Object.keys(dove).length) {
            // Rifare la configurazione all'anteprima le fa dimenticare QUALE
            // cassa sta seguendo: tornava a quella scritta nella casella, che
            // magari e' ferma, e sparivano copertina e barra del tempo
            // proprio mentre lui sistemava i pezzi. Me la segno e gliela
            // rimetto.
            const seguiva = carta._scelto;
            const suonavano = carta._suonavano;
            this._scriviPosti({ ...p0, ...dove });
            try { carta.setConfig({ ...this._cfgPista() }); } catch (e8) { /* pazienza */ }
            carta._scelto = seguiva;
            carta._suonavano = suonavano;
            try { carta.hass = this._hass; } catch (e9) { /* pazienza */ }
          }
        }
      }
      if (q.chi.indexOf("tasto:") === 0) {
        const p0 = (this._cfgPista() || {}).posti || {};
        if (!Object.keys(p0).some((k) => k.indexOf("tasto:") === 0)) {
          const dove = carta.posizioniTasti();
          if (Object.keys(dove).length) {
            // Rifare la configurazione all'anteprima le fa dimenticare QUALE
            // cassa sta seguendo: tornava a quella scritta nella casella, che
            // magari e' ferma, e sparivano copertina e barra del tempo
            // proprio mentre lui sistemava i pezzi. Me la segno e gliela
            // rimetto.
            const seguiva = carta._scelto;
            const suonavano = carta._suonavano;
            this._scriviPosti({ ...p0, ...dove });
            try { carta.setConfig({ ...this._cfgPista() }); } catch (e6) { /* pazienza */ }
            carta._scelto = seguiva;
            carta._suonavano = suonavano;
            try { carta.hass = this._hass; } catch (e7) { /* pazienza */ }
          }
        }
      }
      const rc = carta.riquadroCasella();
      if (!rc) return;
      // Lo rimetto dov'e' ma tenuto per l'angolo in alto a sinistra, che e'
      // dove sta la posizione che gli do io: se restasse tenuto per la
      // destra, la sua figura starebbe "quanto e' cresciuto" piu' in la'
      // della posizione che gli do - sul suo attrezzo al 157% erano
      // diciotto punti.
      perLaSinistra(q.chi);
      const re = q.el.getBoundingClientRect();
      preso = {
        chi: q.chi, el: q.el, rc: rc,
        dx: e.clientX - re.left, dy: e.clientY - re.top,
        largo: re.width, alto: re.height,
        // quanto e' ingrandito adesso: da togliere dalle misure che salvo
        k: carta.quantoIngrandito ? carta.quantoIngrandito(q.el) : 1,
      };
      q.el.classList.add("inmano");
      try { carta.setPointerCapture(e.pointerId); } catch (e2) { /* pazienza */ }
    };

    const muovi = (e) => {
      if (!preso) return;
      e.preventDefault();
      e.stopPropagation();
      // LA MISURA DELLA CASELLA ME LA RIPRENDO ADESSO, non quella di
      // quando ho premuto: fra i due momenti la casella puo' essersi
      // mossa o cambiata di misura, e allora la percentuale esce storta.
      const rc = carta.riquadroCasella() || preso.rc;
      const x = (e.clientX - preso.dx - rc.left) / rc.width * 100;
      const y = (e.clientY - preso.dy - rc.top) / rc.height * 100;
      const maxX = 100 - (preso.largo / rc.width * 100);
      const maxY = 100 - (preso.alto / rc.height * 100);
      const px = Math.round(Math.max(0, Math.min(maxX, x)) * 10) / 10;
      const py = Math.round(Math.max(0, Math.min(maxY, y)) * 10) / 10;
      preso.finito = { x: px, y: py };
      this._dico("sposto " + preso.chi + " a " + px + "% " + py + "%");
      // muovo subito il pezzo, senza rifare la casella: cosi' e' liscio
      const quali = preso.chi === "icona"
        ? ["svg.icona", "img.ritratto", ".iconaHa", ".iconaFoto"] : [null];
      if (preso.chi === "icona") {
        quali.forEach((sel) => {
          const el = carta.shadowRoot.querySelector(sel);
          if (el) {
            el.style.right = "auto"; el.style.left = px + "%";
            el.style.top = py + "%";
          }
        });
      } else {
        preso.el.style.right = "auto";
        preso.el.style.left = px + "%";
        preso.el.style.top = py + "%";
      }
      aggiornaManiglia();
    };

    const lascia = () => {
      if (!preso) return;
      preso.rcFine = carta.riquadroCasella() || preso.rc;
      preso.el.classList.remove("inmano");
      this._dico(preso.finito
        ? "salvato " + preso.chi + " a " + preso.finito.x + "% " + preso.finito.y + "%"
        : "lasciato senza spostare " + preso.chi);
      if (preso.finito) {
        carta._appenaSpostato = true;
        const posti = { ...(this._cfgPista().posti || {}) };
        const vecchio = posti[preso.chi] || {};
        // il pezzo resta esattamente dove l'ha lasciato: prima lo scansavo
        // da solo se toccava un altro, ma cosi' non si capiva piu' dove
        // sarebbe finito. Se li vuole uno sopra l'altro, sono affari suoi.
        posti[preso.chi] = {
          ...vecchio,
          x: preso.finito.x,
          y: preso.finito.y,
          // la misura SENZA l'ingrandimento: quello glielo rimette la
          // casella quando disegna, e contarlo due volte faceva crescere
          // il pezzo a ogni tocco
          w: Math.round(preso.largo / preso.k / preso.rcFine.width * 1000) / 10,
          h: Math.round(preso.alto / preso.k / preso.rcFine.height * 1000) / 10,
          // La distanza dal bordo destro invece si conta sulla figura
          // INGRANDITA, che e' quella che si vede: e' quella che serve per
          // riagganciarlo a destra senza spostarlo.
          dx: Math.round((preso.rcFine.width - preso.largo)
            / preso.rcFine.width * 1000) / 10 - preso.finito.x,
        };
        this._scriviPosti(posti);
      }
      preso = null;
      setTimeout(aggiornaManiglia, 60);
    };
    // Mi metto in ascolto sulla FINESTRA, non sulla casellina: se il dito
    // esce dal riquadrino il trascinamento deve continuare lo stesso.
    // (Prima, con l'ascolto sulla casellina, uscire di un pixel lo
    // chiudeva subito e non si salvava niente.)
    // ...ma me li devo anche RIPRENDERE quando la finestra si chiude: ogni
    // volta che apriva le impostazioni ne restavano tre attaccati per
    // sempre, e dopo un po' di aperture ogni movimento del dito faceva
    // lavorare tutti quelli delle volte prima. Di qui il rallentamento
    // che peggiorava a ogni apertura.
    window.addEventListener("pointerdown", giu, true);
    window.addEventListener("pointermove", muovi, true);
    ["pointerup", "pointercancel"].forEach((ev) =>
      window.addEventListener(ev, lascia, true));
    // il quadratino della grandezza ascolta anche lui sulla finestra: se il
    // dito parte da li' ma poi esce dal quadratino, il ridimensionamento
    // deve continuare lo stesso (come per lo spostamento)
    window.addEventListener("pointermove", misuraMuovi, true);
    ["pointerup", "pointercancel"].forEach((ev) =>
      window.addEventListener(ev, misuraLascia, true));
    // e quando lui tocca una casella dentro all'anteprima del pop-up
    const scegli = (e) => {
      const cfg = e.detail && e.detail.config;
      if (!cfg || !this.isConnected) return;
      const p = this._trovaPercorso(cfg);
      const mia = this._config || {};
      const eLaMia = String(cfg.entity || "") === String(mia.entity || "")
        && String(cfg.name || "") === String(mia.name || "");
      if (!p && !eLaMia) return;
      // toccando la casella grande in cima si torna a sistemare lei
      this._sceltaPercorso = p && !eLaMia ? p : null;
      // cambiata la scheda, la misura tirata prima non c'entra piu' niente
      const b0 = this._postiBox;
      if (b0) b0._tirata = null;
      // la misura buona e' quella che ha adesso dentro al pop-up: la prendo
      // dall'elemento che ha toccato (offsetWidth, non il rettangolo sullo
      // schermo, che potrebbe essere rimpicciolito dall'anteprima)
      const chi = e.detail && e.detail.elemento;
      // anche una casella stretta di griglia: la sua misura e' quella
      // buona, e scartandola finivo per prendere quella di un'altra card
      this._misuraScelta = (this._sceltaPercorso && chi && chi.offsetWidth > 24)
        ? { w: chi.offsetWidth, h: chi.offsetHeight } : null;
      this._giaSbrogliato = false;
      this._planciaCercata = null;
      this._planciaSalvata = null;
      this._aggiornaPista();
      const box = this._postiBox;
      if (box) box.scrollIntoView({ block: "nearest" });
    };
    window.addEventListener("casa-scegli-scheda", scegli, true);
    this._ascolti = () => {
      window.removeEventListener("casa-scegli-scheda", scegli, true);
      window.removeEventListener("pointerdown", giu, true);
      window.removeEventListener("pointermove", muovi, true);
      ["pointerup", "pointercancel"].forEach((ev) =>
        window.removeEventListener(ev, lascia, true));
      window.removeEventListener("pointermove", misuraMuovi, true);
      ["pointerup", "pointercancel"].forEach((ev) =>
        window.removeEventListener(ev, misuraLascia, true));
    };
    // e mentre sposto un pezzo la casella non deve fare il suo mestiere
    carta.addEventListener("click", (e) => {
      if (!preso && !carta._appenaSpostato) return;
      e.preventDefault();
      e.stopPropagation();
      carta._appenaSpostato = false;
    }, true);
  }

  // QUANDO LUI TIRA L'ANGOLO DI UNA SCHEDA nell'anteprima del pop-up.
  // L'anteprima e' una casella a se', appesa da un'altra parte della
  // pagina: mi parla per mezzo di un avviso sulla finestra, come fa gia'
  // per dire quale scheda si sta sistemando.
  _ascoltaMisure() {
    if (this._ascoltoMisure) return;
    const preso = (e) => {
      const d = (e && e.detail) || {};
      if (!this.isConnected || !d.chiave) return;
      const mia = this._config || {};
      const suo = d.config || {};
      // solo se e' l'anteprima della MIA casella: nella stessa pagina ce
      // ne possono essere altre aperte
      if (String(suo.entity || "") !== String(mia.entity || "")
        || String(suo.name || "") !== String(mia.name || "")) return;
      if (d.a !== undefined && d.a !== null) this._spostaScheda(d.chiave, d.a);
      else this._scriviMisura(String(d.chiave), d.largo, d.alto, d.quante);
    };
    window.addEventListener("casa-misura-scheda", preso, true);
    window.addEventListener("casa-sposta-scheda", preso, true);
    this._ascoltoMisure = () => {
      window.removeEventListener("casa-misura-scheda", preso, true);
      window.removeEventListener("casa-sposta-scheda", preso, true);
    };
  }

  // e qui la misura viene scritta dove la scrive Home Assistant.
  // La chiave "2" e' la terza scheda, "2.1" la seconda casella della terza
  // scheda quando quella e' una griglia.
  _scriviMisura(chiave, largo, alto, quante) {
    const l = (this._schede() || []).slice();
    const parti = String(chiave).split(".");
    const i = Number(parti[0]);
    if (!isFinite(i) || !l[i]) return;

    // La misura "normale", quella che non serve scrivere: tutta la riga
    // fuori, una colonna sola dentro a una griglia. Se ci si torna, il
    // valore va cancellato invece che scritto uguale al normale.
    const metti = (carta, normale) => {
      const c2 = { ...(carta || {}) };
      const m = { ...(c2.casa_misura || {}) };
      if (largo > 0 && Math.abs(largo - normale) > 0.8) {
        m.largo = Math.round(largo * 10) / 10;
      } else delete m.largo;
      if (alto !== null && alto !== undefined) {
        if (alto > 0) m.alto = Math.round(alto);
        else delete m.alto;
      }
      // adesso comanda questa: la misura a colonne di Home Assistant
      // resterebbe li' a dire un'altra cosa
      delete c2.grid_options;
      if (Object.keys(m).length) c2.casa_misura = m;
      else delete c2.casa_misura;
      return c2;
    };

    if (parti.length === 1) {
      l[i] = metti(l[i], 100);
    } else {
      const k = Number(parti[1]);
      const madre = { ...l[i] };
      const figli = (madre.cards || []).slice();
      if (!figli[k]) return;
      const q = Number(quante) >= 1 ? Number(quante)
        : Math.max(1, Math.min(12, Math.round(
          Number(madre.columns) > 0 ? Number(madre.columns) : 3)));
      figli[k] = metti(figli[k], 100 / q);
      madre.cards = figli;
      l[i] = madre;
    }
    this._config = { ...this._config, finestra_cards: l };
    this._conservaPosto(() => this._emetti());
  }

};
