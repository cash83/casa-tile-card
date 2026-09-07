# Casa Tile Card

An animated tile for Home Assistant: **icons that move only while the thing is actually on**, set up entirely by clicking (no YAML), with a pop-up of its own where you can put any Home Assistant card.

![version](https://img.shields.io/badge/version-2.16.3-blue) ![hacs](https://img.shields.io/badge/HACS-custom-orange)

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

## What's new in 2.16.3

**Music Assistant owns the group volume, and now the card uses it.** The
Veranda read zero and could still be heard: inside a Music Assistant
group a single speaker's `volume_level` is not what decides what comes
out. The group volume belongs to Music Assistant, and is read and written
with two of its own services (`mass_queue.get_group_volume` and
`set_group_volume`).

The "All the speakers" row now goes through them: it reads the real number
when you open the panel, and writes that one. On a real system the
difference shows: Music Assistant says 12 where the average of the
speakers would say 6.

For players from other integrations, which have no group volume, nothing
changes: they all move by the same amount, each from its own. And a single
speaker's volume takes the same road as before, here and on the tile.

## What's new in 2.16.2

**Each speaker its own volume.** In 2.16 the tile slider had become the
group volume, and that was wrong: the Veranda tile, sitting at 0, showed
25 — the average with the others, a number belonging to nobody. And
moving it moved everything.

- **The tile slider is its own speaker's volume again.** Even when the
  tile is showing the group leader (that is where the queue lives, and
  where commands must go), volume and mute stay the tile speaker's.
- **The overall one moves them all by the same amount**, each from its
  own: raise it by ten and a speaker at 50 goes to 60, one at 0 goes to
  10. It used to scale proportionally, and a speaker at zero stayed at
  zero forever — zero times anything is zero.

The volume for all of them sits where it is useful: at the top of the
"Speakers" panel, above the individual ones.

## What's new in 2.16.1

**The overall volume inside the Speakers panel too**, at the top of the
list: the tile slider already does this, but with the panel open it sits
underneath and you cannot see it. The "All the speakers" row only shows
when more than one speaker is joined, and each one stays controllable on
its own, as before.

## What's new in 2.16

- **Group volume, the way Music Assistant does it.** With speakers joined,
  the tile slider only moved the one in charge and left the others where
  they were. Now it shows the average and moves them together, each keeping
  its own difference: 60-30-90 taken to half becomes 30-15-45. Each
  speaker's own volume stays where it was, in the "Speakers" panel.
- **The tile no longer jumps to an unrelated player.** With no hand-picked
  speaker list, it watched *any* media player in the house: music starting
  on another integration was enough for it to jump there. That is why a
  tile for ytube_music_player showed the Music Assistant player while its
  own was off. Now it only watches speakers from **its own** integration —
  joining speakers across integrations is not possible anyway. A
  hand-picked list still wins.

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
