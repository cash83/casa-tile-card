// -*- coding: utf-8 -*-
// IL GRAFICO STORICO delle schede dei consumi: 24 ore, 7 giorni, 30 giorni,
// oppure due date a scelta.
//
// Due cose che sembrano dettagli e non lo sono:
//
// 1. IL PICCO, NON LA MEDIA. Un sensore di potenza sta a 2 W per un'ora e
//    poi tocca 2100 W per dieci minuti. Se per disegnare faccio la media di
//    ogni pezzetto di tempo, quel picco sparisce e il grafico racconta una
//    casa che non consuma niente. Quindi di ogni pezzetto tengo il MASSIMO:
//    e' l'unica cosa che si vede davvero guardando una lavatrice.
// 2. FINO A OTTO GIORNI la cronologia vera ce l'ha ancora il recorder, e si
//    legge punto per punto. Oltre, il recorder ha gia' buttato via il
//    dettaglio e restano le statistiche a lungo termine: li' chiedo il
//    massimo orario, che e' la stessa idea di prima fatta da Home Assistant.

import { esc, mirinoGrafico, numero, numeroVero } from './elettro-comune.js';
import { laLocale, T } from './lingua.js';

export const PERIODI_GRAFICO = [
  { id: "24h", nome: "24 h", ore: 24 },
  { id: "7g", nome: "7 gg", ore: 24 * 7 },
  { id: "30g", nome: "30 gg", ore: 24 * 30 },
  { id: "scelto", nome: "Da… a" },
];

// La scala del colore, dal basso verso l'alto: quando il numero e' piccolo
// la riga e' calma, quando sale si scalda. E' la stessa idea del colore che
// segue la temperatura sulla casella.
export const SCALA = ["#2fbfb0", "#3fb4ea", "#eab308", "#f97316", "#ef4444"];

// Il colore di un valore sulla scala, con `f` da 0 (poco) a 1 (tanto). Serve
// alle barre: la linea usa la stessa scala come sfumatura.
export function coloreScala(f) {
  const n = SCALA.length;
  const i = Math.min(n - 1, Math.max(0, Math.round((Number(f) || 0) * (n - 1))));
  return SCALA[i];
}

// oltre questo la cronologia dettagliata non c'e' piu': si passa alle
// statistiche a lungo termine
const GIORNI_STORIA = 8;
// quanti punti disegnare: piu' di cosi' non si vedono, e il disegno pesa
const PUNTI = 160;

function quandoScrivere(d, giorni) {
  const l = laLocale();
  if (giorni <= 2) return d.toLocaleTimeString(l, { hour: "2-digit", minute: "2-digit" });
  if (giorni <= 40) return d.toLocaleDateString(l, { day: "2-digit", month: "2-digit" });
  return d.toLocaleDateString(l, { month: "short" });
}

// da una fila di letture a `PUNTI` pezzetti, tenendo il massimo di ognuno
export function aPezzetti(punti, inizio, fine, quanti) {
  if (!punti.length) return [];
  const n = Math.max(2, quanti || PUNTI);
  const da = inizio.getTime();
  const passo = Math.max(1, (fine.getTime() - da) / n);
  const cesti = new Array(n).fill(null);
  punti.forEach((p) => {
    const i = Math.min(n - 1, Math.max(0, Math.floor((p.t.getTime() - da) / passo)));
    if (cesti[i] === null || p.y > cesti[i].y) cesti[i] = p;
  });
  // i pezzetti vuoti tengono l'ultimo valore: uno stato resta valido finche'
  // non cambia, e un buco non vuol dire zero
  const fuori = [];
  let ultimo = null;
  for (let i = 0; i < n; i++) {
    if (cesti[i]) ultimo = cesti[i];
    if (ultimo) fuori.push({ t: new Date(da + i * passo), y: ultimo.y });
  }
  return fuori;
}

export const ConGrafico = (Base) => class extends Base {
  // la cronologia vera, punto per punto
  async _storiaFra(entityId, inizio, fine) {
    const esito = await this._hass.connection.sendMessagePromise({
      type: "history/history_during_period",
      start_time: inizio.toISOString(),
      end_time: fine.toISOString(),
      entity_ids: [entityId],
      minimal_response: true,
      no_attributes: true,
    });
    const righe = esito?.[entityId] || [];
    return righe
      .map((r) => ({
        t: new Date((r.lu || r.last_updated_ts) * 1000 || r.last_updated),
        y: numeroVero(r.s ?? r.state),
      }))
      .filter((p) => Number.isFinite(p.y) && !Number.isNaN(p.t.getTime()));
  }

  // le statistiche a lungo termine: il massimo di ogni ora
  async _statisticheFra(entityId, inizio, fine) {
    const esito = await this._hass.connection.sendMessagePromise({
      type: "recorder/statistics_during_period",
      start_time: inizio.toISOString(),
      end_time: fine.toISOString(),
      statistic_ids: [entityId],
      period: "hour",
      types: ["max", "mean"],
    });
    const righe = esito?.[entityId] || [];
    return righe
      .map((r) => ({ t: new Date(r.start), y: Number(r.max ?? r.mean) }))
      .filter((p) => Number.isFinite(p.y));
  }

  // il pezzo giusto a seconda di quanto indietro si guarda
  async _datiGrafico(entityId, inizio, fine) {
    const giorni = (fine.getTime() - inizio.getTime()) / 86400000;
    const punti = giorni <= GIORNI_STORIA
      ? await this._storiaFra(entityId, inizio, fine)
      : await this._statisticheFra(entityId, inizio, fine);
    return aPezzetti(punti, inizio, fine, PUNTI);
  }

  // ------------------------------------------------------------ il disegno
  // Piu' curve nello stesso riquadro: quelle con la stessa unita' si
  // sovrappongono, e la scala e' quella della piu' alta.
  _grafico(serie, giorni) {
    const vive = serie.filter((s) => s.punti && s.punti.length);
    if (!vive.length) return `<div class="dm-ap-chart-empty">${T("Nessun dato nel periodo")}</div>`;
    const larg = 300;
    const alt = 110;
    const x0 = 30;
    const plotW = larg - x0;
    let max = 0;
    let min = Infinity;
    vive.forEach((s) => s.punti.forEach((p) => {
      if (p.y > max) max = p.y;
      if (p.y < min) min = p.y;
    }));
    if (!Number.isFinite(min)) min = 0;
    if (min > 0) min = 0;
    const campo = (max - min) || 1;
    // Una curva sola: la riga prende il colore dall'altezza. Piu' curve: ognuna
    // tiene il suo, se no non si capisce piu' quale e' quale.
    const sola = vive.length === 1;
    const id = "sc" + Math.random().toString(36).slice(2, 8);
    const scala = sola ? `<defs>
      <linearGradient id="${id}" x1="0" y1="1" x2="0" y2="0">
        ${SCALA.map((c, i) => `<stop offset="${((i / (SCALA.length - 1)) * 100).toFixed(0)}%" stop-color="${c}"/>`).join("")}
      </linearGradient>
      <linearGradient id="${id}f" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${SCALA[SCALA.length - 1]}" stop-opacity=".34"/>
        <stop offset="55%" stop-color="${SCALA[1]}" stop-opacity=".12"/>
        <stop offset="100%" stop-color="${SCALA[0]}" stop-opacity="0"/>
      </linearGradient>
    </defs>` : "";
    const linee = vive.map((s) => {
      const n = s.punti.length;
      const coppie = s.punti.map((p, i) => {
        const x = x0 + (n > 1 ? (i * plotW) / (n - 1) : plotW / 2);
        const y = alt - ((p.y - min) / campo) * (alt - 8) - 4;
        return x.toFixed(1) + "," + y.toFixed(1);
      });
      // da punto a punto: una punta resta una punta. A gradini i picchi
      // diventavano blocchi larghi e l'andamento spariva
      const d = coppie.map((c, i) => (i ? "L " : "M ") + c).join(" ");
      const sotto = d + " L " + coppie[coppie.length - 1].split(",")[0] + "," + alt
        + " L " + coppie[0].split(",")[0] + "," + alt + " Z";
      const tinta = sola ? `url(#${id})` : s.colore;
      const pieno = sola ? `url(#${id}f)` : s.colore;
      return `<path d="${sotto}" fill="${pieno}"${sola ? "" : ' opacity=".1"'}/>
        <path d="${d}" fill="none" stroke="${tinta}" stroke-width="1.2"
          stroke-linejoin="round" stroke-linecap="round"/>`;
    }).join("");
    const asse = `<line x1="${x0}" y1="3" x2="${x0}" y2="${alt - 3}" stroke="#94a3b840" stroke-width="1"/>
      <text x="${x0 - 4}" y="9" text-anchor="end" font-size="7" font-weight="800" fill="#94a3b8">${this._fmtAxis(max)}</text>
      <text x="${x0 - 4}" y="${alt - 3}" text-anchor="end" font-size="7" font-weight="800" fill="#94a3b8">${this._fmtAxis(min)}</text>`;
    const quante = giorni <= 2 ? 6 : 5;
    const primi = vive[0].punti;
    const etichette = this._labelSpans(primi, quante, (p) => quandoScrivere(p.t, giorni));
    return `<svg viewBox="0 0 ${larg} ${alt}" class="dm-ap-chart-svg">${scala}${asse}${linee}</svg>${etichette}`;
  }

  // minimo, media e massimo del periodo, come li scriveresti
  _minMedMax(punti, unita, curva) {
    if (!punti || !punti.length) return "";
    let min = Infinity;
    let max = -Infinity;
    let somma = 0;
    punti.forEach((p) => {
      if (p.y < min) min = p.y;
      if (p.y > max) max = p.y;
      somma += p.y;
    });
    // qui il numero si scrive per intero: 2100 W, non 2,1k. L'asse si
    // accorcia perche' non ha spazio, questa riga ce l'ha
    const scrivi = (v) => numero(v, Number.isInteger(v) || Math.abs(v) >= 10 ? 0 : 1) + (unita ? " " + unita : "");
    return `${this._chiEDiChi(curva)}<div class="dm-ap-mmm">
      <div><small>${T("Minimo")}</small><b>${esc(scrivi(min))}</b></div>
      <div><small>${T("Media")}</small><b>${esc(scrivi(somma / punti.length))}</b></div>
      <div><small>${T("Massimo")}</small><b>${esc(scrivi(max))}</b></div>
    </div>`;
  }
  // I TRE NUMERI SOTTO AL GRAFICO: oggi, questa settimana, questo mese.
  // Minimo/media/massimo parlavano solo del pezzo di tempo disegnato e non si
  // potevano confrontare con niente. Questi sono i kWh della curva accesa,
  // negli stessi periodi del riquadro della scheda, e cambiano col chip.
  // Di chi sono i numeri qui sotto. Sta in un pezzo suo perche' lo mettono
  // TUTTI E DUE i riquadri: se lo avesse solo uno, passando dall'altro la
  // riga comparirebbe o sparirebbe e spingerebbe su e giu' il resto.
  _chiEDiChi(curva) {
    if (!curva || !curva.nome) return `<div class="dm-ap-mmm-chi"></div>`;
    // la nota dice COSA sono questi kWh quando non e' ovvio: sul Generale
    // sono rete piu' fotovoltaico, mentre la linea disegnata e' la sola rete
    const nota = curva.nota ? `<em>${esc(curva.nota)}</em>` : "";
    return `<div class="dm-ap-mmm-chi"><i style="background:${curva.colore || "#94a3b8"}"></i>${esc(curva.nome)}${nota}</div>`;
  }

  _trePeriodi(kwh, curva) {
    const k = kwh || {};
    const scrivi = (v) => (Number.isFinite(v) ? numero(v, 2) + " kWh" : "\u2014");
    return `${this._chiEDiChi(curva)}<div class="dm-ap-mmm">
      <div><small>${T("Oggi")}</small><b>${esc(scrivi(k.oggi))}</b></div>
      <div><small>${T("Settimana")}</small><b>${esc(scrivi(k.settimana))}</b></div>
      <div><small>${T("Mese")}</small><b>${esc(scrivi(k.mese))}</b></div>
    </div>`;
  }

  // Il sensore dei kWh di una curva. La scheda me lo puo' dire lei (`energia`);
  // se no lo cerco accanto a quello dei Watt: Home Assistant chiama le due
  // misure della stessa presa <nome>_power e <nome>_energy.
  _sensoreEnergia(curva) {
    const st = (this._hass || {}).states || {};
    if (curva.energia && st[curva.energia]) return curva.energia;
    const nudo = String(curva.entity || "").replace(/^sensor\./, "");
    const radice = nudo.replace(/_(power|potenza|watt)$/i, "");
    if (radice === nudo) return null;
    for (const coda of ["_energy", "_energia", "_kwh"]) {
      const c = "sensor." + radice + coda;
      const s = st[c];
      if (s && String((s.attributes || {}).device_class || "") === "energy") return c;
    }
    return null;
  }

  // Quanti kWh ha fatto questa curva oggi, questa settimana e questo mese.
  // Due strade: i contatori che la scheda ha gia' (esatti, e sono gli stessi
  // numeri che si leggono nel riquadro), o le statistiche a lungo termine del
  // sensore che sale sempre. Se non c'e' ne' l'uno ne' l'altro torna null e
  // sotto al grafico restano minimo/media/massimo.
  async _kwhDellaCurva(curva) {
    const st = (this._hass || {}).states || {};
    const leggi = (e) => {
      const x = e ? st[e] : null;
      const v = x && !["unknown", "unavailable"].includes(x.state) ? numeroVero(x.state) : NaN;
      return Number.isFinite(v) ? v : NaN;
    };
    // un periodo puo' avere PIU' contatori da sommare (la rete e il
    // fotovoltaico che arriva in casa): sommo quelli che esistono davvero,
    // cosi' chi ha solo la rete legge la rete e basta
    const sommaContatori = (v) => {
      const quali = (Array.isArray(v) ? v : [v]).filter(Boolean);
      const numeri = quali.map(leggi).filter(Number.isFinite);
      return numeri.length ? numeri.reduce((a, b) => a + b, 0) : NaN;
    };
    const c = curva.contatori || {};
    if (c.oggi || c.settimana || c.mese) {
      return { oggi: sommaContatori(c.oggi), settimana: sommaContatori(c.settimana),
        mese: sommaContatori(c.mese) };
    }
    const eid = this._sensoreEnergia(curva);
    if (!eid) return null;
    const ora = new Date();
    const mezzanotte = new Date(ora.getFullYear(), ora.getMonth(), ora.getDate());
    const primoDelMese = new Date(ora.getFullYear(), ora.getMonth(), 1);
    // la settimana comincia di lunedi', come i contatori di Home Assistant
    const lunedi = new Date(mezzanotte.getTime()
      - ((mezzanotte.getDay() + 6) % 7) * 86400000);
    const da = new Date(Math.min(primoDelMese.getTime(), lunedi.getTime()));
    let risposta;
    try {
      risposta = await this._hass.callWS({
        type: "recorder/statistics_during_period",
        start_time: da.toISOString(),
        statistic_ids: [eid],
        period: "day",
        types: ["change"],
      });
    } catch (e) { return null; }
    const giorni = (risposta || {})[eid] || [];
    if (!giorni.length) return null;
    const somma = (dalle) => {
      let t = null;
      giorni.forEach((g) => {
        const q = typeof g.start === "number" ? g.start : Date.parse(g.start);
        const v = Number(g.change);
        if (q >= dalle && Number.isFinite(v)) t = (t === null ? 0 : t) + v;
      });
      return t === null ? NaN : t;
    };
    return { oggi: somma(mezzanotte.getTime()),
      settimana: somma(lunedi.getTime()),
      mese: somma(primoDelMese.getTime()) };
  }

  // ---------------------------------------------------------- la finestra
  // `curve` = [{nome, entity, colore, unita}]. La prima e' accesa, le altre
  // si accendono coi chip. Non c'e' niente da configurare: sono le entita'
  // che la scheda gia' conosce.
  _apriGrafico(curve, titolo) {
    const buone = (curve || []).filter((c) => c && c.entity && this._hass.states[c.entity]);
    if (!buone.length) {
      this._openDialog(titolo || "Andamento",
        `<div class="dm-ap-chart-empty">${T("Non c'e' nessun sensore da disegnare")}</div>`);
      return;
    }
    this._curve = buone.map((c, i) => ({ ...c, accesa: i === 0 }));
    this._curvaScelta = this._curve[0];
    this._graficoQuando = this._graficoQuando || { id: "24h" };
    const chip = buone.length > 1
      ? `<div class="dm-ap-chip-riga">${buone.map((c, i) => `<button type="button"
          class="dm-ap-chipc" data-curva="${i}"><i style="background:${c.colore}"></i>${esc(c.nome)}</button>`).join("")}</div>`
      : "";
    this._openDialog(titolo || "Andamento", `
      <div class="dm-ap-periodi">${PERIODI_GRAFICO.map((x) => `<button type="button"
        class="dm-ap-per" data-per="${x.id}">${esc(T(x.nome))}</button>`).join("")}</div>
      <div class="dm-ap-date" hidden>
        <label>${T("Da")} <input type="datetime-local" class="dm-ap-da"></label>
        <label>${T("A")} <input type="datetime-local" class="dm-ap-a"></label>
        <button type="button" class="dm-ap-applica">${T("Applica")}</button>
      </div>
      ${chip}
      <div class="dm-ap-graf"><div class="dm-ap-chart-loading">${T("Caricamento...")}</div></div>
      <div class="dm-ap-mmm-posto"></div>
      <div class="dm-ap-piu-grafici"></div>
    `);
    const dove = this._root.querySelector(".dm-ap-overlay");
    // se la scheda ha altri grafici da mettere sotto (gli istogrammi dei kWh)
    // se li disegna lei: qui non si sa, e non serve saperlo
    if (this._graficiInPiu) this._graficiInPiu(dove.querySelector(".dm-ap-piu-grafici"));
    dove.querySelectorAll(".dm-ap-per").forEach((b) => {
      b.addEventListener("click", () => {
        const id = b.dataset.per;
        const riga = dove.querySelector(".dm-ap-date");
        riga.hidden = id !== "scelto";
        if (id === "scelto") {
          const fine = new Date();
          const da = new Date(fine.getTime() - 86400000);
          const scrivi = (d) => new Date(d.getTime() - d.getTimezoneOffset() * 60000)
            .toISOString().slice(0, 16);
          const a1 = dove.querySelector(".dm-ap-da");
          const a2 = dove.querySelector(".dm-ap-a");
          if (!a1.value) a1.value = scrivi(da);
          if (!a2.value) a2.value = scrivi(fine);
          this._graficoQuando = { id, da: new Date(a1.value), a: new Date(a2.value) };
        } else {
          this._graficoQuando = { id };
        }
        this._disegnaGrafico();
      });
    });
    dove.querySelector(".dm-ap-applica").addEventListener("click", () => {
      const a1 = dove.querySelector(".dm-ap-da").value;
      const a2 = dove.querySelector(".dm-ap-a").value;
      if (!a1 || !a2) return;
      this._graficoQuando = { id: "scelto", da: new Date(a1), a: new Date(a2) };
      this._disegnaGrafico();
    });
    dove.querySelectorAll(".dm-ap-chipc").forEach((b) => {
      b.addEventListener("click", () => {
        const c = this._curve[Number(b.dataset.curva)];
        // UNA ALLA VOLTA. Prima si sommavano: premevi Forno e restava acceso
        // anche Generale - due linee sovrapposte, e i numeri sotto di una
        // sola delle due. Premere un chip adesso spegne gli altri; premere
        // quello gia' acceso non lo spegne, se no il grafico resterebbe vuoto.
        this._curve.forEach((x) => { x.accesa = x === c; });
        this._curvaScelta = c;
        this._disegnaGrafico();
      });
    });
    this._disegnaGrafico();
  }

  _quandoGrafico() {
    const q = this._graficoQuando || { id: "24h" };
    if (q.id === "scelto" && q.da && q.a && q.a > q.da) return { inizio: q.da, fine: q.a };
    const p = PERIODI_GRAFICO.find((x) => x.id === q.id) || PERIODI_GRAFICO[0];
    const fine = new Date();
    return { inizio: new Date(fine.getTime() - (p.ore || 24) * 3600000), fine };
  }

  async _disegnaGrafico() {
    const dove = this._root.querySelector(".dm-ap-overlay");
    if (!dove) return;
    const q = this._graficoQuando || { id: "24h" };
    dove.querySelectorAll(".dm-ap-per").forEach((b) => {
      b.classList.toggle("scelto", b.dataset.per === q.id);
    });
    dove.querySelectorAll(".dm-ap-chipc").forEach((b) => {
      b.classList.toggle("scelto", !!(this._curve[Number(b.dataset.curva)] || {}).accesa);
    });
    const posto = dove.querySelector(".dm-ap-graf");
    const sotto = dove.querySelector(".dm-ap-mmm-posto");
    if (!posto) return;
    const { inizio, fine } = this._quandoGrafico();
    const giorni = (fine - inizio) / 86400000;
    const accese = this._curve.filter((c) => c.accesa);
    // se nel frattempo premi un altro periodo, il giro vecchio non deve
    // scrivere sopra a quello nuovo
    const mio = {};
    this._giroGrafico = mio;
    // NON butto via il disegno che c'e'. Prima lo sostituivo con
    // "Caricamento...", alto una riga: il grafico spariva, la scritta saltava
    // in cima e poi il grafico tornava - un rimbalzo a ogni cambio di curva.
    // Adesso quello vecchio resta li' sbiadito, e la scritta si vede solo la
    // prima volta, quando non c'e' ancora niente da tenere.
    const gia = posto.querySelector("svg");
    const altezzaPrima = posto.offsetHeight;
    if (altezzaPrima > 60) posto.style.minHeight = altezzaPrima + "px";
    if (gia) posto.classList.add("caricando");
    else posto.innerHTML = `<div class="dm-ap-chart-loading">${T("Caricamento...")}</div>`;
    try {
      for (const c of accese) c.punti = await this._datiGrafico(c.entity, inizio, fine);
    } catch (e) {
      if (this._giroGrafico === mio) {
        posto.classList.remove("caricando");
        posto.innerHTML = `<div class="dm-ap-chart-empty">${T("Errore caricamento dati")}</div>`;
      }
      return;
    }
    if (this._giroGrafico !== mio) return;
    posto.classList.remove("caricando");
    posto.innerHTML = this._grafico(accese, giorni);
    const prima = accese.includes(this._curvaScelta) ? this._curvaScelta : accese[0];
    // La struttura e' subito quella definitiva - riga del nome e tre riquadri,
    // coi trattini - e i numeri ci entrano dentro quando arrivano. Prima
    // disegnavo minimo/media/massimo e poi ci mettevo sopra i tre periodi, che
    // hanno una riga in piu': su "Generale" non si vedeva (i suoi numeri sono
    // gia' in casa), sugli altri arrivano dalle statistiche e il riquadro
    // saltava di un pelo.
    if (sotto) {
      sotto.innerHTML = this._trePeriodi(null, prima);
      this._kwhDellaCurva(prima).then((k) => {
        if (this._giroGrafico !== mio) return;
        // niente kWh per questa curva (non e' energia, o non c'e' il sensore):
        // ripiego su minimo/media/massimo, che e' alto uguale
        if (!k || ![k.oggi, k.settimana, k.mese].some(Number.isFinite)) {
          sotto.innerHTML = this._minMedMax(prima.punti, prima.unita, prima);
          return;
        }
        sotto.innerHTML = this._trePeriodi(k, prima);
      }).catch(() => {
        if (this._giroGrafico === mio) {
          sotto.innerHTML = this._minMedMax(prima.punti, prima.unita, prima);
        }
      });
    }
    if (prima && prima.punti && prima.punti.length > 1) {
      // prima QUANDO, poi QUANTO: muovendo il dito stai navigando il tempo,
      // la data e' la domanda e il valore la risposta. Le barre lo facevano
      // gia' cosi', la linea al contrario.
      mirinoGrafico(posto, prima.punti, (pt) => pt.t.toLocaleString(laLocale(), giorni <= 2
        ? { hour: "2-digit", minute: "2-digit" }
        : { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })
        + "  ·  " + this._fmtAxis(pt.y) + (prima.unita ? " " + prima.unita : ""));
    }
  }
};
