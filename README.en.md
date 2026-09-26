# Casa Tile Card

An animated tile for Home Assistant: **icons that move only while the thing is actually on**, set up entirely by clicking (no YAML), with a pop-up of its own where you can put any Home Assistant card.

![version](https://img.shields.io/badge/version-2.34.0-blue) ![hacs](https://img.shields.io/badge/HACS-custom-orange)

[🇮🇹 Italiano](README.md) · 🇬🇧 English

---

## What it does

- **Automatic icon**: the card picks it by looking at the entity (light, plug, radiator, camera, battery, vacuum, person, weather…). If you don't like it, pick your own.
- **209 icons**: 63 hand-drawn animated ones plus the whole Home Assistant set, all colourable and searchable. **They move only while the thing is on** — every one of them.
- If the entity already has its own icon in Home Assistant, the card uses that one (like tile and mushroom do); ours stay where the entity has none.
- You can also use **any Home Assistant icon** or **a picture of your own**, from your phone or your PC.
- **A real battery**: the fill follows the percentage, the colour runs green to red, and you can see what it is doing — while charging the missing part fills up (with a bolt), while it is supplying power a dark notch slides to the left, at rest it stays still. It works this out from the power sensors that talk about charge and discharge.
- **Weather**: the icon follows the sky (sun, moon, clouds, rain, snow, storm, fog, wind) and the background becomes the sky of that moment.
- **Real multiroom**: add and remove speakers from the group, and if you remove the one holding the queue it passes to whoever is left (with Music Assistant) instead of stopping the music; the tile follows the speaker that is actually playing.
- **Music**: round cover art, title and artist, a waveform always in step with the track, transport controls, volume with a mute button, speaker picker, multi-room group and source. The cover can also be the background, blurred as much as you like, and on pause the tile stays lit.
- **Lights**: brightness bar and colour strip (rainbow or warm/cold white) inside the tile.
- **Settable values** (`number`): a bar to change them, with a range you can shorten.
- **A history graph** inside the tile (temperatures, watts, any number), over as many hours as you choose: it is drawn behind the text, so it does not change the height of anything. Hover it and it tells you value and time; pick between filled area and plain line.
- **Colour that follows the temperature**: cold blue, mild green, warm orange, hot red.
- Sensors that disappear for a few minutes (Bluetooth) no longer write "Unavailable": they keep the last reading, dimmed.
- **Durations written the way you would say them**: a runtime of 1.5 hours becomes *1 h 30 min*, an uptime of 44555 seconds *12 h 22 min*. And sensors that carry the unit inside the state (*17min*) no longer lose the tail.
- **Names on the readings**: each reading at the bottom can be given the name you want (*Discharge*, *House output*), so two watt sensors are no longer two identical pills with different numbers in them.
- **Live camera**: a camera tile fills with its picture, refreshed by itself every so many seconds.
- **A pop-up of your own**: put as many cards in it as you like — they are Home Assistant cards, with their own settings panels — and dress it how you like: tint, photo and transparency of the window, plus the colour of the cards inside.
- **Effects**: 19 ways of lighting up, adjustable strength and speed, background as tint, photo or weather. They show over a photo or the cover art too, and "never moves" really does stop everything.
- **Two colours**: one for the effects (glow, border, lights) and, if you want, one just for the text.
- The icon can also be removed entirely, leaving only the text.
- **People**: a ring coloured by where they are (home, away, another zone), for how long, how many kilometres from home — as the crow flies, or by road if you have a route sensor (Waze, Google).
- **Quick controls** for blinds (up/stop/down and position), locks and vacuums: glass buttons that lift under your finger, and the one telling you what is happening lights up in the tile's colour (docked, cleaning, fully open, fully closed, or "stopped" while travelling).
- **"For how long"** on any entity: *on for 40 minutes*, *open for 3 hours*.
- **You decide when it counts as on**: always, at an exact value, above a threshold, or **by watching other entities** (as many as you like: one active is enough) — so a battery tile lights up when watts are going out, not because it is charged to 93 %.
- **The weather sky is made of real pieces**: stars of different sizes that twinkle, the moon with its craters and shooting stars, the sun with its rays, multi-lobed clouds, slanted drops, snowflakes that sway.
- **Every piece where you want it, at the size you want**: name, value, icon, bar, buttons and single readings can be picked up and dragged anywhere inside the tile; tap a piece and a little yellow square appears on its corner — hold it and pull to make the piece bigger or smaller (from 40 % to 300 %). You compose inside a frame that has the real size of the card on the dashboard, so what you see is what you get; and the tiles inside the pop-up are arranged from the same frame, just tap them in the preview.
- **Light on its feet**: it redraws at most ten times a second even when the house sends avalanches of updates, keeps three hundred history points in memory instead of tens of thousands, and when it is hidden (pop-up closed, another tab) it really does stand still.
- It adapts by itself to the width of the tile and to your finger, and **never spills out of the box** you give it: if space is tight the content shrinks — the size is yours to decide from the Layout.

## Install with HACS

1. HACS → **Frontend** → menu at the top right → **Custom repositories**
2. Address: `https://github.com/cash83/casa-tile-card` — category: **Lovelace**
3. Look for **Casa Tile Card**, download it, then reload the page (Ctrl+F5).

## Install by hand

1. Copy `dist/casa-tile-card.js` into `config/www/`
2. Settings → Dashboards → menu → **Resources** → add `/local/casa-tile-card.js` as a **JavaScript Module**

## How to use it

Add a card to the dashboard and look for **Casa · animated tile**. Everything after that is clicks:

| Tab | What is in it |
|---|---|
| **Basics** | entity and name; what is written (subtitle, value, "for how long", readings); when the tile counts as on |
| **Icon** | show or hide it, use the entity picture, a Home Assistant icon, the catalogue or an image of your own |
| **Look** | how it is built (layout, big tile), the 19 effects, the tile colour and the text colour, and **"Where each piece goes"**: the frame where you drag name, value, icon and readings |
| **Background** | tint and transparency, background photo, weather sky |
| **Controls** | the bar inside the tile, the quick buttons (blinds, locks, vacuums), the colour strip |
| **Graph** | history graph, how many hours, area or line, minimum and maximum |
| **Music** | controls, cover as background, speakers and sources, look of the speaker panel |
| **People** | distance from home and route sensor (with the **Person** layout) |
| **Tap** | what happens when you tap it: toggle, more-info, your pop-up, map, web address, service |

Tabs that make no sense for that entity disappear on their own: on a sensor you will see neither Music nor Controls, on a person you will see no Graph.

At the top of the editor there is a **search box**: type "weather" or "colour" and it tells you which tab every related setting lives in; one click takes you there.

### Minimal example

```yaml
type: custom:casa-tile
entity: light.living_room
```

### Example with a pop-up

```yaml
type: custom:casa-tile
entity: sensor.house_battery
name: House battery
azione: finestra
finestra_titolo: House battery
finestra_cards:
  - type: custom:power-flow-card-plus
    entities: {}
```

## Energy and appliances

Since 2.19 casa-tile ships **two big cards** as well, made to live inside a
tile's pop-up (or on their own on a dashboard):

- **`custom:casa-energia`** — your home's electricity: Watts right now, today's
  usage and cost, **energy only** and **incl. taxes**, the month's cost, **who is
  using the most** (it finds every power-measuring plug by itself, even the
  ones you add later, and also counts the **"Not measured"** part), **solar
  savings**, circuit bars and **the bill split line by line**.
- **`custom:casa-elettrodomestico`** — washer, dishwasher, oven, dryer, TV,
  boiler: status, **last cycle** (end, duration, energy, cost), number of
  cycles, time and cost for today, yesterday, this month and last month.

They grew out of [Simonz82](https://github.com/Simonz82/smart-home-cards)'s
cards, which are free to reuse: here they live inside casa-tile (no second file
to install) and have been extended. Their labels are in Italian for now.

### How to add them

In the tile editor, **Tap** tab → *What happens when you tap it*:

- **Open the appliance card (sets itself up)**
- **Open the home energy card (sets itself up)**

The card fills itself in from the tile's entity: it finds the power-measuring
plug (even going through the device, if you picked the kWh sensor), the right
drawing from the name (washer, dishwasher, dryer, oven…) and the sensors below,
if they exist. Then the choice turns into "Open my own pop-up" and you tweak the
card in the **Pop-up** tab like any other.

### Which sensors you need

The cards **show** values, they don't compute them: Home Assistant does the
maths. Without sensors you still get the Watts; everything else appears as you
create them.

| Value on the card | Comes from | How to create it |
|---|---|---|
| Watts now, circuit bars, top consumer | power sensors (W) of your plugs | you already have them (Shelly, Tuya, Zigbee…) |
| Today's usage / periods | `sensor.casa_totale_casa_rete_ora` · `_oggi` · `_settimana` · `_mese` | `utility_meter` on your main grid meter in kWh, with **`always_available: true`** |
| Cost incl. taxes, month incl. taxes | `sensor.costo_energia_ora` · `_oggi` · `_ieri` · `_settimana` · `_mese` | template sensors: kWh × price + daily fixed fee |
| Energy only, bill line by line | `sensor.costi_luce_oggi`, `sensor.costi_luce_mese` (attributes `kwh`, `energia`, `rete_e_oneri`, `accise`, `quota_fissa`, `iva`, `risparmio_fotovoltaico`, `risparmio_fotovoltaico_energia`) — also used for the "Without solar" row | template sensors + the `luce.jinja` macro |
| Solar savings | `sensor.risparmio_fotovoltaico` + `_oggi` / `_mese` meters | trigger sensor + `utility_meter` with `net_consumption: true` |
| The price | `input_number.prezzo_luce_energia`, `…_rete_e_oneri`, `…_accise`, `input_number.iva_luce`, `input_number.quota_fissa_energia_giorno` → `input_number.prezzo_energia` (total) | helpers + one automation that recomputes the total |
| Last cycle, cycles, time and cost of an appliance | `sensor.<name>_ciclo`, `sensor.<name>_cicli_oggi`, `sensor.<name>_cicli_mese` (+ `<name>_energia_oggi` / `_mese` meters) | trigger sensors watching the plug's Watts |

**Meters need `always_available: true`.** If the source sensor disappears for a
few minutes (power cut, device reboot), a meter without that option restarts
from the new value and **loses the kWh of the gap**, while the cost sensors
below do recover them — and the two stop matching. To realign one:
`utility_meter.calibrate` with the true value, read from the source sensor's
statistics.

**The shortcut: the "Create the basic sensors" button.** In the
`casa-energia` editor pick your house **kWh** sensor and the price, press the
button, and the card creates the **hour, today, week, month** meters for you
(with `always_available` already on), the **cost** of each period and of
**yesterday**, and the price in euro per kWh. They are ordinary helpers: you
find them under *Settings > Devices & services > Helpers*, they go into the
backup and are deleted from there. Anything already there is reused, so
pressing it twice does no harm. The rest (the bill line by line, solar savings,
appliance cycles) needs trigger templates and macros: copy that from the
example below.

**And for appliances.** The `casa-elettrodomestico` editor has its own
**"Create statistics and costs"** button: you set a threshold in Watts that says
when the appliance *is working*, and from that it builds **how many times it
ran**, **how long it worked** and **how much it cost**, today and this month
(threshold + two `history_stats` + meters + costs; if the plug gives no kWh, it
derives them from Watts with a Riemann integral). The **Last cycle** box comes
from a *trigger* template sensor, which the UI cannot create: that one stays in
the example below.

**Everything is ready in [`esempi/luce/`](esempi/luce/):**

1. copy [`luce.yaml`](esempi/luce/luce.yaml) into `/config/packages/`
   (`configuration.yaml` needs `homeassistant: packages: !include_dir_named packages`);
2. copy [`luce.jinja`](esempi/luce/luce.jinja) into `/config/custom_templates/`;
3. at the top of `luce.yaml` there is the list of names to **search and
   replace** with yours (grid meter, solar, battery, washer plug);
4. restart Home Assistant, then type your prices into the helpers (they're on
   your bill: energy per kWh, network and system charges per kWh, excise per
   kWh, VAT; the daily fixed fee is fixed + power charge incl. VAT, divided by
   the days). The total per kWh is computed for you.

For a second appliance copy the washer block at the end of `luce.yaml` and
change name, plug and threshold: the name must match the tile's, because the
card looks for `sensor.<name>_ciclo`.

**One plug for two machines?** If one plug measures two appliances (say washer
and dryer):

1. start the washer's cycle only while the other one is idle
   (`… > 10 and not is_state('binary_sensor.asciugatrice_in_funzione', 'on')`)
   and give the dryer the same plug's kWh while it runs;
2. create a **"washer net power"** sensor = the plug's Watts while the dryer is
   idle, 0 while it runs (it's already at the end of
   [`luce.yaml`](esempi/luce/luce.yaml), commented out). **No
   `device_class`**, or the top consumer counts the plug twice;
3. in the washer card use that sensor as the plug and the real cycle state,
   so with only the dryer running the washer says "off" and 0 W:

   ```yaml
   power_entity: sensor.lavatrice_potenza_netta
   live:
     state_entity: binary_sensor.lavatrice_in_funzione
   state_map:
     "on": { mode: running, label: RUNNING }
     "off": { mode: "off", label: "OFF" }
   ```

**Dryers that go "paused"** (LG and others): count the pause as running
(`states(...) in ['Running', 'Paused']`), or a few-second pause splits the
cycle in two.

### casa-energia options

| Option | What it does |
|---|---|
| `power_entity` | **required**: home Watts |
| `max_power` | bar full scale (e.g. 3300 with a 3 kW contract) |
| `periods` | rows with `label` / `energy` / `cost`: the 2nd is "Today", the 4th "Month" |
| `periods_prev` | same, for "yesterday" (with `energy_attr: last_period`) |
| `circuits` | bars: `label`, `entity` (W), `max` |
| `top_auto` | `true` = find the top consumer among all power sensors |
| `top_exclude` | bits of entity_id to skip (production, batteries…); a default list is built in |
| `top_include` | entities to count anyway |
| `top_min_w` | below these Watts nothing is "top" (default 5) |
| `unmeasured_label` | name of the "Not measured" entry |
| `bill_today`, `bill_month` | the line-by-line bill sensors (`sensor.costi_luce_oggi` / `_mese`) |
| `settings_sections` | what the gear shows (e.g. the price helpers) |
| `notification_path` | if set, a button takes you to your notifications page |

### casa-elettrodomestico options

| Option | What it does |
|---|---|
| `power_entity` | **required**: the plug's Watts (or another number, see below) |
| `artwork` | `washer`, `dishwasher`, `dryer`, `oven`, `tv`, `boiler` |
| `threshold_run`, `threshold_standby` | Watts above which it's "running" / "standby" |
| `max_power` | bar full scale |
| `power_label`, `power_unit`, `power_decimals` | show something else in the bar (e.g. remaining time in `min`) |
| `live.state_entity` | the appliance's real status (LG, Bosch/Home Connect… integrations) |
| `state_map` | translates states: `Running: {mode: running, label: RUNNING}` |
| `live.extra` | extra rows: `entity`, `label`, `attribute`, `value_map`… |
| `cycle_sensor`, `cycle_attrs` | last cycle: attributes `terminato`, `tempo_ciclo`, `consumo_ciclo`, `costo_ciclo` |
| `period_attrs` | time and cost for today / yesterday / month / last month |
| `stats.cycles_today`, `stats.cycles_month` | how many cycles |

### Home Assistant's Energy dashboard

HA's Energy page has a single "cost" for the grid and knows nothing about fixed
fees. In **Settings → Dashboards → Energy → Grid → cost** choose **"Use an
entity tracking the total costs"** and pick:

- `sensor.costo_rete_bolletta` to see **what you actually pay** (fixed fee
  included, added at midnight), or
- `sensor.costo_energia_pura` to see **energy only**, without taxes.

The full bill, line by line, stays in the casa-energia card.

## What's new in 2.91

The five items left open by the 2.90 pass, all closed.

**The cycle memories and its automation can be deleted.** The *Delete this
card's helpers* button only knew how to throw away config entries: meters,
thresholds, cost sensors. The four last-cycle memories (two `input_number` and
two `input_datetime`) and the automation that fills them stayed for ever, and no
screen ever showed them to you. They now appear in the checkbox list, marked
**memoria** and **automazione**, and each is deleted the way it has to be. The
«… in funzione» threshold is now matched by its **exact** name: before, one name
being contained in another (*forno* inside *forno microonde*) was enough for the
card to offer you another appliance's threshold.

**One copy only.** The two usage cards and their editors were born separate and
had **twenty-five methods with the same name**, one per file: the dialog, the
chart, the settings row, the delete button. Copies drift in silence, and putting
them together turned up two drifts: one wrote `EUR` and the other `€` in the same
row, and the weekday names were written twice with different capitalisation. The
shared part now lives in `elettro-condivisi.js`, like the tile's own mixins:
**twelve** methods stay separate, and those are the ones that really do different
things (one carries a comment explaining why).

**`top_exclude_piu`.** `top_exclude` *replaces* the built-in list of words that
keep a sensor out of Top consumer, so anyone adding one word lost all the others.
The new `top_exclude_piu` **adds** to it. Three words that only concerned the
author's own house left the built-in list.

**The energy card no longer throws a red error.** `casa-energia` without
`power_entity` refused to draw, while its twin `casa-elettrodomestico` shows
itself empty in that case and lets the editor say what is missing. They now
behave the same.

**And English.** Both cards and all three editors were still Italian: anyone
running Home Assistant in English read *Ultimo ciclo*, *Spunta quelle da vedere*,
*Crea statistiche e costi*. That is **287 strings** translated, with the help
paragraphs translated **whole** rather than in pieces (an Italian sentence with
bold words in it, cut into ten fragments, does not come back together in
English). Days, months and times no longer go through the dictionary: the browser
writes them in the reader's language — in Italian *Mar* is both Tuesday and
March, and a dictionary cannot hold both.

## What's new in 2.90

**Power strips: one small button per socket.** A multi-socket strip has three or
four switches and a single button is not enough. With `interruttori` the card
shows a row of small buttons, one per socket, green when they are live:

```yaml
interruttori:
  - entity: switch.strip_socket_1
    label: Modem
  - entity: switch.strip_usb
    label: USB
```

They can also be picked in the editor, under *Tasti di accensione* (this
editor is still Italian only). Without a `label`
they use the name from Home Assistant; an unreachable socket fades out and stops
responding, so you don't press it for nothing.

**"Work it out for me" no longer grabs the neighbour's meters.** It matched
sensors by name similarity, taking every word longer than three letters: two
sockets called *Bed side A* and *bed side B* share "side", and that was
enough for the first to adopt the second's meters — two cards reading the same
counter, invisibly. It now looks at the **device** first, and a socket's meters
live on the socket. The name is only a fallback, and then only the longest word
counts — the one that tells them apart.

**And a pass over every file.** Done file by file with real checks instead of by
eye: the most important result is a brace in the wrong place inside the appliance
editor. Three things that should run when the editor opens — the entity field of
*Work it out for me*, the bar-names box and the tariff total — were running inside
the "row changed" callback instead: **they only worked after ticking a row**. That's
why the field opened empty and without search.

Along with it:

* **button and bar names**: the card wrote them before Home Assistant handed it the
  data, so without a hand-written label you read `switch.socket_one` instead of
  "Modem". The name now arrives when the data does;
* `cicli settimana`: the helper was created and **nobody read it** (the card only
  knew today, month and year). The Week row now shows it;
* the **energy price** helper was created with two different steps depending on which
  button made it: with the coarse one you couldn't even type `0.1657`;
* the **meter-unit warning** looked at the states from *before* the meters were
  created, so it never appeared in the very case it was written for;
* helper names in the "which ones to delete" list went into the HTML **unescaped**:
  a name with an `&` broke the list;
* weekday names were written **twice**, and the same dialog said "Ven 26/09" at the
  top and "ven 26/09" below;
* **dead code**: two twin functions under different names, three methods nobody
  called, an element long gone from the markup and still looked up, 17 icons and a
  table that drew nothing any more, ten imports pulled in for nothing.

## What's new in 2.89

**One message box, always in the same place.** There were three, scattered across
the editor — one under the tariff, one under "work it out for me", one under the
buttons — and each wrote to its own: you pressed *Delete helpers* and the checkbox
list opened half a page further up, where you were not looking. Now there is one,
**stuck to the bottom of the editor** like a status bar: every button uses it, it
scrolls itself into view when something appears, and turns red when something goes
wrong.

**The "Reset counters" button actually works.** The `reset_script` option had
always been there, but the button only passed the script its own name: to know
*what* to reset you needed one script per appliance. Now it also passes **the
entities the card already knows** — today's meter, the month's, the cycle's and the
memories — so a single script covers the whole house:

```yaml
reset_script: script.azzera_conti
```

The script receives `scheda`, `oggi`, `settimana`, `mese`, `ciclo_contatore`,
`ciclo_kwh`, `ciclo_minuti`, `ciclo_fine`: it uses the ones it needs and ignores
the rest.

**The checkboxes state the real numbers.** "Follow the cycles" said *5 helpers*:
true until the start-time memory existed, now it is **6**. And "count how many
times it starts" said *3 per period*: it is **2**, plus the threshold, which is
made once.

## What's new in 2.88.1

**The cards build their own sensors.** You used to prepare a thirty-sensor YAML
package by hand; now two buttons do it, and what they create are ordinary Home
Assistant helpers.

- **The tariff is typed into the card**, item by item as it appears on your bill,
  and it counts for the whole house: appliances and sockets read the price from
  there.
- **Cost no longer needs a sensor**: it is kWh times price, worked out by the card
  as you look at it. One helper less per period.
- **Names fix themselves.** Home Assistant prefixes the source device's name, and
  the new counter loses the old one's history: the card now renames it right after
  creating it.
- **Last cycle without a trigger template**: a threshold, a meter, three memories
  and one automation. It copes with appliances that stop and start again (oven,
  washing machine): the cycle only closes after some minutes of real stillness,
  and the meter is zeroed at the end, not at the start. While it runs you see the
  **cycle in progress**.
- **Panels and battery**: two new rows with the kWh that came from them, today,
  this week and this month. More than one source gets summed.
- **Circuit bars**: as many as you want (no longer four), drag to reorder, and
  **let it pick the bars** — it shows whatever is drawing the most right now, so
  when the oven starts its bar appears by itself.
- **Delete what you choose**: the list of helpers with a checkbox each and the
  value it currently reads, instead of all or nothing. Values are remembered, so
  recreating a counter picks up where it left off.
- **The daily standing charge counts the right days** (from the calendar, not from
  when the counter was born), and the price menu no longer offers the items that
  are merely ingredients of the total.
- The kWh sensor and the panel ones are **searched by typing**, and **Wh** counters
  are accepted too (converted automatically).
- **"The unit has changed" repairs, explained before they happen.** A meter
  created while the appliance is **off** is born without a unit — it only picks one
  up on its first real reading — and when the unit arrives Home Assistant asks you
  to fix the statistics, once per meter. Tested: it cannot be avoided, neither by
  waiting for the source to produce a number nor with `utility_meter.calibrate`. If
  the appliance is running the problem does not arise. So the card now **tells you
  while it creates them**, with the answer to give: "update the unit without
  conversion". It happens once per meter.


## What's new in 2.34

Three new things in the **casa-elettrodomestico** card, plus two numbers that
were hard to read.

- **The running cycle is no longer four dashes.** While the appliance works, the
  "last cycle" box had nothing to say: the real figures come from the cycle
  sensor, and those only land at the end. The appliance, though, is talking all
  along. With the `ciclo_live` block (five fields in the editor: energy, minutes
  done, minutes left, programme, phase) the caption turns into **CYCLE RUNNING**,
  *programme - phase* appears underneath, and the four rows show the expected
  finish time, how long it has been going, the kWh burnt so far and what they
  cost. The cost uses the same price as the end-of-cycle figure, so the number you
  watch growing and the one that stays afterwards agree.
- **A drawing for dehumidifiers**: a tower with an air grille, a fan spinning
  behind the louvres, drops falling into the tank and water swaying inside it.
  Like the others, it only moves while the appliance is working.
- **The second bar is no longer just programme progress**: it takes any number
  from 0 to 100 and now has its own name (`progress_label`). On a dehumidifier
  that is the room humidity, right next to the watts.
- **The Consumption row was being clipped** ("CONSU... 1.02 k..."): the box was
  too narrow for the longest value. Fixed by measuring the text at phone width
  rather than eyeballing it.
- **The cost now uses your locale's decimal separator**, like every other number
  on the card (0,29 € rather than 0.29 €).

## What's new in 2.31

A pass over the whole card, **setting by setting**: each one actually tried, by
drawing the tile without it and with it and looking at whether anything changes.
124 settings across the tile and the two energy cards. Whatever did not add up is
fixed here.

- **Text is readable in light theme too.** Name and value took Home Assistant's
  theme colour, which in light theme is dark: dark on a dark tile. The tile now
  picks the colour only when the theme's own would not stand out enough; otherwise
  it leaves it to the theme.
- **Numbers in your language**: 1,234.5 or 1.234,5 as your locale writes them, and
  the currency symbol instead of the code. This covers `casa-energia` and
  `casa-elettrodomestico` as well.
- **Distance from home** (and the route sensor) is only ever written by the
  **Person layout**: those two settings now show up only there, instead of sitting
  in the editor doing nothing.
- **The chart** is no longer offered where it cannot work (lights, thermostats):
  their state is not a number.
- **The weather sky**: strength and entity show only when the sky is on, like every
  other switch -> detail pair.
- **A colour typed into YAML** (`colore: #ff0000`, unquoted) no longer disappears:
  to YAML that `#` is a comment, so the value came out empty.
- **CSS colour names** (tomato, gold...) no longer turn black when the tile darkens
  them or makes them translucent.
- **The energy alarm threshold** never fired when the sensor was unavailable.
- **The two energy cards**: they tell Home Assistant how tall they are (the Layout
  slider in sections views), they follow Home Assistant's language, and they redraw
  once instead of on every state change in the house.
- **The Consumption dialog warns you** when the plugs add up to more than the house
  total: usually it means one plug is counted twice.
- Small ones: the background-photo preview opened the icon gallery; a pop-up opened
  again left an Esc listener attached to the document forever; in masonry views the
  music tile claimed to be half as tall as it is.

## What's new in 2.30

- **"Create the basic sensors" no longer picks the kWh sensor at random.** The dropdown defaulted to the first one alphabetically (which at home can be a battery: pressing the button would build the meters on the wrong device). Now the first entry is empty and the suggestion comes from the card's own plug (`..._power` → `..._energy`). The price is a dropdown here too, with the values next to it.

- **Yesterday shows up right away** in the week, without waiting for the next midnight: until it lands in the attribute it is read from the "_ieri" fields, the same numbers as the Yesterday row above. And today's cycles come from the counter, not the internal tally: the same dialog used to say 1 above and 0 below.

- **The full week, day by day**, in the appliance statistics: seven rows (today
  and the six days before) with cycles, time and cost. It does not need 28
  entities like the card it came from: it reads a single attribute of the cycle
  sensor (`giorni`, key 0 = Monday), written at midnight with the day that just
  ended. The `esempi/luce` example creates it.
- **"Last cycle" clears when a new one starts**, instead of keeping the previous
  wash's numbers while the appliance is running. The history stays in the statistics.
- **"Reset counters" button**: with a script wired to `reset_script`, the gear
  zeroes last cycle, cycles, times and costs of that appliance (the example fires
  the `casa_tile_azzera` event and recalibrates the meters).

## Older versions

The changelog stops at 2.30. What happened before is in the
[GitHub releases](https://github.com/cash83/casa-tile-card/releases),
together with the code of each version.

## Licence

MIT
