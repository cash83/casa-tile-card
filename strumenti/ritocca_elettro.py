# Ritocchi alle schede portate da Simonz82 (vedi porta_elettro.py):
# il tasto "Centro Notifiche" portava a una pagina SUA (/lovelace/centronotifiche).
# Adesso compare solo se la configurazione dice dove andare: notification_path.
for f in ("src/elettro-elettrodomestico.js", "src/elettro-energia.js"):
    s = open(f, encoding="utf8").read()
    bottone = '<button type="button" class="dm-ap-tool dm-ap-notif-center" title="Centro Notifiche">${ICON_NOTIFCENTER}</button>'
    assert s.count(bottone) == 1, f
    s = s.replace(bottone, '${this._config.notification_path ? `' + bottone + '` : ""}')
    vecchio = '''    this._root.querySelector(".dm-ap-notif-center").addEventListener("click", (e) => {
      e.stopPropagation();
      history.pushState(null, "", "/lovelace/centronotifiche");'''
    nuovo = '''    this._root.querySelector(".dm-ap-notif-center")?.addEventListener("click", (e) => {
      e.stopPropagation();
      history.pushState(null, "", this._config.notification_path);'''
    assert s.count(vecchio) == 1, f
    s = s.replace(vecchio, nuovo)
    open(f, "w", encoding="utf8", newline="\n").write(s)
    print("ok", f)
