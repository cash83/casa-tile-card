# casa-energia: il conto della luce voce per voce e il risparmio del fotovoltaico.
# Opzioni nuove: bill_today / bill_month = sensori col conto diviso negli
# attributi (kwh, energia, rete_e_oneri, accise, quota_fissa, iva,
# risparmio_fotovoltaico), come sensor.costi_luce_oggi / _mese del package.
p = "src/elettro-energia.js"
s = open(p, encoding="utf8").read()

# 1) riga "Risparmio FV" nel riquadro Oggi, solo se c'e' il conto
top = '<div class="dm-ap-cycle-row dm-ap-cycle-row-b"><span class="dm-ap-cycle-label"><span class="dm-ap-cycle-ic">${ICON_TREND}</span><small>Top consumo</small></span><b class="dm-e-top">\\u2014</b></div>'
assert s.count(top) == 1
fv = ('${this._config.bill_today ? `<div class="dm-ap-cycle-row dm-ap-cycle-row-b"><span class="dm-ap-cycle-label">'
      '<span class="dm-ap-cycle-ic">${ICON_SOLE}</span><small>Risparmio FV</small></span><b class="dm-e-fv">\\u2014</b></div>` : ""}')
s = s.replace(top, top + "\n              " + fv)

# 2) toccando il riquadro Oggi si apre il conto
vecchio = '    this._root.querySelector(".dm-ap-stats").addEventListener("click", (e) => {'
assert s.count(vecchio) == 1
s = s.replace(vecchio, '''    if (this._config.bill_today || this._config.bill_month) {
      const lato = this._root.querySelector(".dm-ap-cycle-side");
      lato.style.cursor = "pointer";
      lato.addEventListener("click", (e) => {
        e.stopPropagation();
        this._openConto();
      });
    }
''' + vecchio)

# 3) il valore sul fronte
vecchio = '    this._root.querySelector(".dm-e-top").textContent = this._topText(hass);'
assert s.count(vecchio) == 1
s = s.replace(vecchio, vecchio + '''
    const fvEl = this._root.querySelector(".dm-e-fv");
    if (fvEl) fvEl.textContent = this._euro(hass.states[cfg.bill_today]?.attributes?.risparmio_fotovoltaico);''')

# 4) i metodi nuovi, prima di _openStats
METODI = r'''  // --- Il conto voce per voce (aggiunta cash83) ------------------------
  _euro(v) {
    const n = Number(v);
    return Number.isFinite(n) ? `${n.toFixed(2)} €` : "—";
  }

  _contoHtml() {
    const cfg = this._config;
    const hass = this._hass;
    const a = (id) => (id && hass.states[id]?.attributes) || {};
    const oggi = a(cfg.bill_today);
    const mese = a(cfg.bill_month);
    const tot = (id) => this._euro(id ? hass.states[id]?.state : null);
    const riga = (label, k, euro = true) => this._statRow2(label,
      euro ? this._euro(oggi[k]) : `${Number(oggi[k] ?? 0).toFixed(2)} kWh`,
      euro ? this._euro(mese[k]) : `${Number(mese[k] ?? 0).toFixed(2)} kWh`);
    return `
      <div class="dm-ap-sec"><div class="dm-ap-sec-cap">Il conto, voce per voce &nbsp;(oggi &middot; mese)</div>
        ${riga("kWh presi dalla rete", "kwh", false)}
        ${riga("Energia", "energia")}
        ${riga("Rete e oneri", "rete_e_oneri")}
        ${riga("Accise", "accise")}
        ${riga("Quota fissa", "quota_fissa")}
        ${riga("IVA", "iva")}
        ${this._statRow2("Totale", tot(cfg.bill_today), tot(cfg.bill_month))}
      </div>
      <div class="dm-ap-sec"><div class="dm-ap-sec-cap">Fotovoltaico</div>
        ${riga("Risparmio (energia che non hai comprato)", "risparmio_fotovoltaico")}
      </div>`;
  }

  _openConto() {
    this._openDialog("Il conto della luce", this._contoHtml());
  }
  // --- fine aggiunta ----------------------------------------------------

  _openStats() {'''
assert s.count("  _openStats() {") == 1
s = s.replace("  _openStats() {", METODI, 1)

# 5) il conto anche in cima alle statistiche
vecchio = '''    this._openDialog("Statistiche", `
      <div class="dm-ap-sec"><div class="dm-ap-sec-cap">Consumi per periodo</div>${periodsHtml}</div>'''
assert s.count(vecchio) == 1
s = s.replace(vecchio, '''    this._openDialog("Statistiche", `
      ${cfg.bill_today || cfg.bill_month ? this._contoHtml() : ""}
      <div class="dm-ap-sec"><div class="dm-ap-sec-cap">Consumi per periodo</div>${periodsHtml}</div>''')

# 6) l'icona del sole
s = s.replace("} from './elettro-comune.js';\n", "} from './elettro-comune.js';\n"
              "const ICON_SOLE = '<svg viewBox=\"0 0 24 24\" width=\"14\" height=\"14\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\"><circle cx=\"12\" cy=\"12\" r=\"4\"/><path d=\"M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4\"/></svg>';\n", 1)
open(p, "w", encoding="utf8", newline="\n").write(s)
print("ok")
