# Casa Tile Card

An animated tile for Home Assistant: **icons that move only while the thing is actually on**, set up entirely by clicking (no YAML), with a pop-up of its own where you can put any Home Assistant card.

![version](https://img.shields.io/badge/version-2.19.5-blue) ![hacs](https://img.shields.io/badge/HACS-custom-orange)

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
| **People** | distance from home and route sensor |
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
| Today's usage / periods | `sensor.casa_totale_casa_rete_ora` · `_oggi` · `_settimana` · `_mese` | `utility_meter` on your main grid meter in kWh |
| Cost incl. taxes, month incl. taxes | `sensor.costo_energia_ora` · `_oggi` · `_ieri` · `_settimana` · `_mese` | template sensors: kWh × price + daily fixed fee |
| Energy only, bill line by line | `sensor.costi_luce_oggi`, `sensor.costi_luce_mese` (attributes `kwh`, `energia`, `rete_e_oneri`, `accise`, `quota_fissa`, `iva`, `risparmio_fotovoltaico`) | template sensors + the `luce.jinja` macro |
| Solar savings | `sensor.risparmio_fotovoltaico` + `_oggi` / `_mese` meters | trigger sensor + `utility_meter` with `net_consumption: true` |
| The price | `input_number.prezzo_luce_energia`, `…_rete_e_oneri`, `…_accise`, `input_number.iva_luce`, `input_number.quota_fissa_energia_giorno` → `input_number.prezzo_energia` (total) | helpers + one automation that recomputes the total |
| Last cycle, cycles, time and cost of an appliance | `sensor.<name>_ciclo`, `sensor.<name>_cicli_oggi`, `sensor.<name>_cicli_mese` (+ `<name>_energia_oggi` / `_mese` meters) | trigger sensors watching the plug's Watts |

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
and dryer), start the washer's cycle only while the other one is idle
(`… > 10 and not is_state('binary_sensor.asciugatrice_in_funzione', 'on')`) and
give the dryer the same plug's kWh while it runs.

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

## What's new in 2.19

- **Two new cards, `casa-energia` and `casa-elettrodomestico`**, in the same file: see [Energy and appliances](#energy-and-appliances).
- Two new **Tap** choices that set up the pop-up with the right card by themselves.
- **Automatic top consumer** with a "Not measured" entry, **the bill line by line**, **energy only** and **incl. taxes**, **solar savings** for today and the month.
- Ready-made sensor examples in [`esempi/luce/`](esempi/luce/).

## What's new in 2.18

Photos and text in free layout, fixed where they got in the way.

- **Photo width and height, each on its own.** When you pick a figure
  piece (the icon or the stamp) in the "Where each piece goes" panel, two
  yellow handles appear on its sides: the right one makes it wider or
  narrower, the bottom one taller or shorter. Drag them to the edge of the
  tile and a **magnet** snaps them to it. The photo fills exactly the box
  you draw, whole.
- **Photos have rounded corners** like the tile, whatever their scale:
  before, a photo scaled three times turned almost into a circle.
- **The photo follows the same rule as the text.** On the dashboard the
  tile can have a different size from the one you composed it on: photo
  and text grow and shrink together, and the photo keeps its shape.
- **Text no longer stays tiny inside pop-ups.** The "bloom" pop-up starts
  at a fifth of its size, and the tiles inside measured themselves right
  at that moment: they thought they were tiny and shrank their text to
  the minimum, for good.
- **Text that gets longer stays in its space.** Turn on "Show how long it
  has been in this state", or "On" becomes "On for 55 min", and the text
  shrinks just enough to stay where you put it instead of sliding under
  the photo. And if it does reach it, it stays in front.
- **Icon or photo transparency**: a new slider in the **Icon** tab, from
  0 to 90%.

## What's new in 2.17.1

**Press and hold to open more-info**, like Home Assistant's tile. A tap
does what you chose — toggle, open your pop-up, call a service — and
holding for half a second opens the entity's more-info dialog: the big
slider, the history, the settings cog. Before, you could only reach it
if the tap itself was set to "Open more-info", so a tile whose tap opens
a pop-up had no way there.

- lifting your finger after the long press does **not** fire the tap as
  well: no light switching on while more-info opens;
- if the finger moves you are scrolling the page, and nothing happens;
- on the slider, the buttons and the panels you keep the usual control;
- in the settings preview, holding still detaches a card to move it;
- don't want it on a tile? **Tap → "What it does when you press and
  hold" → Nothing**.

## What's new in 2.17

The player, redone where it needed it — with Music Assistant in hand.

- **The group volume**, at the top of the "Speakers" panel. It is the
  leader's volume, the way Music Assistant shows it on its own player bar,
  and it is sent **once, when you let go of the slider**: sending it while
  dragging made MA redo its sums on every command and the volumes bounced.
- **A mute button for each speaker**, next to its slider, lit in the tile
  colour when that speaker is silenced.
- **Slider at 0 means muted**, and raising it lifts the mute. In Home
  Assistant the two are separate, but nobody expects a speaker at zero to
  still be audible.
- **Volume belongs to the speaker, not to the session.** With speakers
  joined, the tile shows the group leader — the queue lives there, and
  that is where commands must go — but the slider and the mute stay its
  own speaker's.
- **The tile no longer jumps to an unrelated player.** With no hand-picked
  speaker list it watched *any* media player in the house. Now it only
  watches speakers from its **own** integration.
- **Whoever was muted stays muted**: while propagating the group volume,
  Music Assistant unmutes speakers on its own initiative (their bug,
  [support#6334](https://github.com/music-assistant/support/issues/6334)).
  The tile notices and puts the mute back — and steps aside as soon as you
  touch the mute yourself.

## What's new in 2.15.4

**"Bloom from the tile" now really blooms, every time.** The point the
window should be born from was measured while the animation had already
started — but "bloom" starts from the window scaled down to 22 % and
displaced, so asking where the window is at that moment returns the
shrunken one. The point came out different at every opening (66px −474,
then 248px 289, then 106px −306): once it grew out of the tile, the next
time it flew in from off-screen — and looked like the plain opening.

Now the animation is switched off, the window is measured where it really
is, and then it starts. Five openings in a row give the very same point.
And the first time, when the pop-up cards mount and the window grows, the
measurement is redone as soon as the content is there.

## What's new in 2.15.3

- **The pop-up reopened without its animation, or did not open at all.**
  On closing, the window stays on screen long enough to be seen leaving,
  and a timer switches it off at the end. If you reopened it meanwhile,
  that timer fired anyway and shut it in your face; and the veil never
  went through "closed", so the browser did not replay the animation and
  the window just appeared — the one that looked "stock". Reopening now
  stops the closing timer and restarts the animation, "bloom" included.
- **The editor sliders only move by the knob too**: the lightness on the
  colour wheel and the transparency of the pop-up cards, like the ones on
  the tile. The numeric settings (strength, speed, graph hours…) use Home
  Assistant's own sliders and stay as they are everywhere in HA.

## What's new in 2.15.2

**Sliders only move by the knob.** A plain slider jumps to wherever you
touch it: on a phone, while scrolling the page, brushing against one is
enough to change the value without noticing — a battery found at 5 %.
Now a touch that does not start on the knob moves nothing and sends no
command. It applies to the tile slider (light, volume, blind, settable
value), to the two colour ones and to each speaker's volume in the group
panel. The knob has a finger of margin around it, dragging it works as
before, so do the arrow keys, and the page scrolls as always.

## What's new in 2.15.1

The English in 2.15 was half done: with Home Assistant set to English,
half the card was still Italian.

- **The player buttons, the shell and the panels**: play, pause, search,
  browse, the queue, the speakers, the source, full screen. They live
  inside hand-written HTML, and the first pass only looked at the text
  between tags — almost all of those strings are `title=` tooltips.
- **The names of the 225 icons** in the picker: *luce* is now *light*,
  *tapparella* is now *roller blind*. The key written into your dashboard
  stays the Italian one — otherwise every existing configuration would
  break — and the search works in both languages.
- **"For how long"**: *acceso da 40 minuti* is now *on for 40 min*.
- **Numbers and dates** follow the viewer's language: 1,234.5 for an
  English reader, 1.234,5 for a German one. They were hard-coded Italian.
- **The shell is rewritten if the language arrives late.** Home Assistant
  does not guarantee the order of `setConfig` and `hass`: if the tile was
  already drawn when the language arrives, it is now redrawn.
- **And when the language is not known yet, nothing is decided**: before,
  a `hass` that had not arrived meant English, and the editor tabs —
  written once and never again — stayed English for an Italian user.

Nothing changes in Italian: the 525 strings use the Italian sentence as
the key, so what you read is exactly what you read before, checked tile
by tile.

## What's new in 2.15

Everything changes inside, nothing outside: the card does exactly what it did before.

- **It speaks English too.** It takes the language from Home Assistant: if your HA is in Italian nothing changes at all, otherwise setting names, tabs, pop-up text and drop-down entries switch to English — 265 strings in all. Languages we do not know fall back to English.
- **The code is split across 22 files** instead of a single fifteen-thousand-line one: the tile, the drawings, the graph, the player, the window, the free pieces, and the four parts of the editor. It is bundled back into one file at build time, so Home Assistant always gets a single resource.
- **No more "Italy only" lock** in the HACS list.

## What's new in 2.14

Composing the tile freehand, and figures that follow the state.

- **Resizing pieces is done by pulling the corner**, the same way you move them: no more picking a layout from a list. It works for the name, the value, the icon, the readings, the bar, the buttons — and for the whole tile, which snaps to the dashboard grid but slides smoothly in between.
- **The number can be typed too**: size of the tile and of each piece, in pixels and as a percentage, for when the eye is not enough.
- **The YAML of the single tile**, even when it sits inside a grid, with the option of applying only part of it. And three ways to replicate a layout onto another tile.
- **You choose how the pop-up opens**: rise and fade, bloom out of the tile you tapped, come up from the bottom, or nothing. With a slider for the speed and a button to see it straight away, without saving.
- **A picture of your own instead of the icon**, and a second one **for when it is on**: so a GIF moves only while the appliance is working and stands still when it is not. The same goes for the big stamp behind the text, which is now the same figure and moves and resizes like every other piece.
- **The vacuum leaves its dock**: when it starts, the robot leaves the dock, goes back and forth and the brush spins; when it returns, it goes back in.

### Fixes

- **Group speakers**: the tile assumed it was the one running the group. Now it works out **who holds the queue** (`group_members[0]`): joining always goes through it, removing a speaker does not touch the queue, and transferring is left to its own button — before, it fired by itself on a fixed timer and, when it failed, switched the player off.
- **The tile no longer jumps to a speaker that has just joined**: that one starts playing because it is the same music, not a new session. And if Music Assistant moves the session to another speaker, the tile follows it instead of sitting on a stopped one.
- **The "bring the queue here" button had an empty circle**: its glyph lived in the icon catalogue, not among the button ones.
- **The graph tooltip** appeared when hovering the buttons underneath too.
- **The percentage on the bar can be hidden.**

## Licence

MIT
