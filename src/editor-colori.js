// -*- coding: utf-8 -*-
// Il cerchio dei colori e le righe che li scelgono.

import { daRgb } from './colori.js';
import { T } from './lingua.js';
import { DIPENDE, ETICHETTE, SOLO_AZIONE, SOLO_PER } from './schema.js';
import { hslARgb, hslATesto, metti, rgbAHsl } from './segni.js';

export const ConColori = (Base) => class extends Base {
  // dai un nome tuo a ogni misura: "Scarica", "Uscita casa"... senza questo
  // due sensori di watt sono due caselline uguali con dentro numeri diversi
  // I selettori di colore di Home Assistant sono pesantissimi: aprirli
  // fermava tutta la pagina. Qui basta il colore del sistema, che si apre
  // di colpo, piu' una X per toglierlo.
  // quali ruote di colore hanno senso adesso: le stesse regole dei campi
  // normali (tipo di entita', azione, e l'interruttore da cui dipendono)
  _coloriDi(gruppo) {
    const dom = (this._config.entity || "").split(".")[0];
    const azione = this._config.azione || "toggle";
    return (gruppo.colori || []).filter((nome) => {
      if (SOLO_AZIONE[nome] && SOLO_AZIONE[nome] !== azione) return false;
      const amm = SOLO_PER[nome];
      if (amm && (!dom || !amm.includes(dom))) return false;
      if (DIPENDE[nome] && !DIPENDE[nome](this._config)) {
        const ora = this._config[nome];
        const scritto = ora !== undefined && ora !== null && ora !== ""
          && !(Array.isArray(ora) && !ora.length);
        if (!scritto) return false;
      }
      return true;
    });
  }

  _costruisciColori() {
    (this._gruppi || []).forEach((suoi) => {
      suoi.forEach((g) => {
        if (!g.colori) return;
        const campi = this._coloriDi(g.gruppo);
        // la firma NON guarda i colori scelti: se no la ruota si richiude
        // in faccia ogni volta che ne tocchi uno
        const firma = campi.join(",");
        if (g.colori._firma === firma) {
          g.colori.hidden = g.form.hidden && !campi.length;
          g.colori.childNodes.forEach((n2) => { if (n2._aggiorna) n2._aggiorna(); });
          return;
        }
        g.colori._firma = firma;
        g.colori.innerHTML = "";
        campi.forEach((campo) => g.colori.appendChild(this._rigaColore(campo)));
      });
    });
  }

  // La ruota dei colori: la uso sia per le tinte della casella sia per le
  // schede del pop-up. Restituisce la pastiglia da toccare, il cassetto che
  // si apre, e un modo per rimetterla in pari.
  _sceltaColore(iniziale, quandoCambia) {
    const bolla = document.createElement("button");
    bolla.type = "button";
    bolla.className = "bolla";
    bolla.title = T("Scegli il colore");

    const cassetto = document.createElement("div");
    cassetto.className = "ruota-cassetto";
    cassetto.hidden = true;
    const ruota = document.createElement("div");
    ruota.className = "ruota";
    const mira = document.createElement("i");
    mira.className = "mira";
    ruota.appendChild(mira);
    const luce = document.createElement("input");
    luce.type = "range";
    luce.className = "luce";
    luce.min = "0"; luce.max = "100"; luce.step = "1";

    let H = 210; let S2 = 60;
    const metti = (rgb) => {
      if (Array.isArray(rgb)) {
        const [h2, s3, l2] = rgbAHsl(rgb[0], rgb[1], rgb[2]);
        H = h2; S2 = s3; luce.value = String(Math.round(l2));
        bolla.style.background = daRgb(rgb);
      } else {
        luce.value = "50";
        bolla.style.background = "transparent";
      }
    };
    metti(iniziale);

    const mettiMira = () => {
      const r = (S2 / 100) * 46;
      const a2 = H * Math.PI / 180;
      mira.style.left = (50 + Math.cos(a2) * r) + "%";
      mira.style.top = (50 + Math.sin(a2) * r) + "%";
      mira.style.background = hslATesto(H, S2, Number(luce.value));
    };
    const mostra = () => {
      bolla.style.background = hslATesto(H, S2, Number(luce.value));
      mettiMira();
    };
    const manda = () => quandoCambia(hslARgb(H, S2, Number(luce.value)));

    const prendi = (e) => {
      const q = ruota.getBoundingClientRect();
      if (!q.width || !q.height) return;
      const dx = (e.clientX - q.left) / q.width * 2 - 1;
      const dy = (e.clientY - q.top) / q.height * 2 - 1;
      const r = Math.min(1, Math.sqrt(dx * dx + dy * dy));
      const h2 = (Math.atan2(dy, dx) * 180 / Math.PI + 360) % 360;
      if (!isFinite(h2) || !isFinite(r)) return;
      H = h2;
      S2 = Math.round(r * 100);
      mostra();
    };
    ruota.addEventListener("pointerdown", (e) => {
      ruota.setPointerCapture(e.pointerId);
      ruota._giu = true;
      prendi(e);
    });
    ruota.addEventListener("pointermove", (e) => { if (ruota._giu) prendi(e); });
    ["pointerup", "pointercancel"].forEach((ev) =>
      ruota.addEventListener(ev, () => { ruota._giu = false; manda(); }));
    luce.addEventListener("input", mostra);
    luce.addEventListener("change", manda);
    const apriChiudi = () => {
      cassetto.hidden = !cassetto.hidden;
      if (!cassetto.hidden) mettiMira();
    };
    bolla.addEventListener("click", apriChiudi);

    cassetto.append(ruota, luce);
    return {
      bolla: bolla, cassetto: cassetto, aggiorna: metti,
      apriChiudi: apriChiudi, aperto: () => !cassetto.hidden,
    };
  }

  _rigaColore(campo) {
    const riga = document.createElement("div");
    riga.className = "riga-colore";
    const eti = document.createElement("span");
    eti.className = "eti";
    eti.textContent = T(ETICHETTE[campo]) || campo;

    const via = document.createElement("button");
    via.type = "button";
    via.className = "togli";
    via.textContent = "✕";
    via.title = T("Togli il colore");
    via.hidden = !Array.isArray(this._config[campo]);
    via.addEventListener("click", () => {
      const c2 = { ...this._config };
      delete c2[campo];
      this._config = c2;
      this._emetti();
      this._costruisciColori();
    });

    const scelta = this._sceltaColore(this._config[campo], (rgb) => {
      this._config = { ...this._config, [campo]: rgb };
      via.hidden = false;
      this._emetti();
    });

    riga.append(eti, scelta.bolla, via);
    const fuori = document.createElement("div");
    fuori.className = "colore-riga-fuori";
    fuori.append(riga, scelta.cassetto);
    fuori._aggiorna = () => {
      const ora = this._config[campo];
      scelta.aggiorna(ora);
      via.hidden = !Array.isArray(ora);
    };
    return fuori;
  }

  // UNA CASELLA NOSTRA IL FONDO SE LO DISEGNA DA SOLA, e se lo scrive
  // addosso: quello che le passo dalla busta non lo guarda nemmeno. Quindi
  // per lei (e per le caselle nostre dentro a una griglia o a una pila) il
  // colore va scritto nelle SUE impostazioni. Torna indietro null se li'
  // dentro di caselle nostre non ce n'e' nessuna: allora vale la busta.
  _tingiDentro(cfg, dati) {
    if (!cfg || typeof cfg !== "object") return null;
    if (String(cfg.type || "") === "custom:casa-tile") {
      const c2 = { ...cfg };
      if ("sfondo" in dati) {
        if (dati.sfondo) c2.sfondo_colore = dati.sfondo;
        else delete c2.sfondo_colore;
      }
      if ("trasparenza" in dati) {
        if (dati.trasparenza) c2.trasparenza = dati.trasparenza;
        else delete c2.trasparenza;
      }
      return c2;
    }
    let cambiato = false;
    const c2 = { ...cfg };
    if (Array.isArray(cfg.cards)) {
      const l = cfg.cards.map((x) => {
        const y = this._tingiDentro(x, dati);
        if (y) cambiato = true;
        return y || x;
      });
      if (cambiato) c2.cards = l;
    }
    if (cfg.card) {
      const y = this._tingiDentro(cfg.card, dati);
      if (y) { c2.card = y; cambiato = true; }
    }
    return cambiato ? c2 : null;
  }

  // e che colore ha adesso: la prima casella nostra che trovo li' dentro
  _tintaDentro(cfg) {
    if (!cfg || typeof cfg !== "object") return null;
    if (String(cfg.type || "") === "custom:casa-tile") {
      return { sfondo: cfg.sfondo_colore, trasparenza: cfg.trasparenza };
    }
    const figli = (Array.isArray(cfg.cards) ? cfg.cards : [])
      .concat(cfg.card ? [cfg.card] : []);
    for (let i = 0; i < figli.length; i += 1) {
      const t = this._tintaDentro(figli[i]);
      if (t) return t;
    }
    return null;
  }

};
