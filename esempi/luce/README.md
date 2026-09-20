# I sensori per casa-energia e casa-elettrodomestico

🇮🇹 Italiano · [🇬🇧 English](#english)

Questi due file creano in Home Assistant tutti i sensori che le schede
`custom:casa-energia` e `custom:casa-elettrodomestico` mostrano: consumi per
periodo, costo **+ tasse**, **solo energia**, il conto voce per voce, il
risparmio del fotovoltaico e i cicli degli elettrodomestici.

## Dove vanno copiati

Nella cartella `config` di Home Assistant, cioè quella dove sta `configuration.yaml`:

| File | Dove va | Diventa |
|---|---|---|
| [`luce.yaml`](luce.yaml) | cartella `packages` | `/config/packages/luce.yaml` |
| [`luce.jinja`](luce.jinja) | cartella `custom_templates` | `/config/custom_templates/luce.jinja` |

Se le cartelle `packages` e `custom_templates` non ci sono, creale.
Ci arrivi con l'app (add-on) **File editor**, **Studio Code Server** oppure
dalla rete con **Samba share**.

## Passo per passo

1. **Attiva i package**, se non l'hai già fatto. In `configuration.yaml` aggiungi:

   ```yaml
   homeassistant:
     packages: !include_dir_named packages
   ```

   (se hai già una riga `homeassistant:`, aggiungi solo `packages: …` sotto di lei).

2. **Copia i due file** come nella tabella qui sopra.

3. **Metti i tuoi sensori.** Apri `luce.yaml`: in cima c'è l'elenco dei nomi da
   **cercare e sostituire** con i tuoi:

   | Nel file | Cosa ci metti |
   |---|---|
   | `sensor.mio_contatore_rete_kwh` | l'energia **presa dalla rete**, in kWh, che sale sempre (contatore generale: Shelly EM, contatore smart…) |
   | `sensor.mio_fotovoltaico_kwh` | l'energia prodotta dai pannelli, in kWh |
   | `sensor.mia_rete_restituita_kwh` | l'energia data alla rete, in kWh |
   | `sensor.mia_batteria_carica_kwh` / `…_scarica_kwh` | quanta ne entra / esce dalla batteria, in kWh |
   | `sensor.lavatrice_potenza` / `sensor.lavatrice_energia` | W e kWh della presa della lavatrice |

   Niente fotovoltaico? Togli il blocco «Risparmio fotovoltaico» e i suoi due
   contatori. Niente batteria? Togli le due righe della batteria.
   **I nomi dei sensori che il file crea non cambiarli**: la scheda li cerca
   proprio così.

4. **Controlla e riavvia.** Strumenti per sviluppatori → YAML → **Verifica
   configurazione**, poi **Riavvia**.

5. **Scrivi i prezzi della bolletta** in Impostazioni → Dispositivi e servizi →
   Aiutanti:

   | Aiutante | Dove lo trovi in bolletta |
   |---|---|
   | Prezzo luce energia | spesa per la vendita di energia ÷ kWh (senza IVA) |
   | Prezzo luce rete e oneri | spese per la rete e gli oneri di sistema ÷ kWh (senza IVA) |
   | Prezzo luce accise | accise ÷ kWh |
   | IVA luce | di solito 10 (%) |
   | Quota fissa energia giorno | (quota fissa + quota potenza) con IVA ÷ giorni della bolletta |

   **Prezzo energia**, cioè il totale per kWh, si calcola da solo.

6. **Metti le schede.** Su una casella casa-tile: Tocco → *Apri la scheda
   energia della casa (si prepara da sola)* oppure *Apri la scheda
   elettrodomestico*. Trovano da sole i sensori creati qui.

## Un altro elettrodomestico

In fondo a `luce.yaml` c'è il blocco della lavatrice. Copialo e cambia
`lavatrice` col nome dell'elettrodomestico (lo stesso che darai alla casella:
la scheda cerca `sensor.<nome>_ciclo`), la presa e la soglia in W. Aggiungi
anche i suoi due contatori `<nome>_energia_oggi` e `<nome>_energia_mese` nella
parte `utility_meter:`.

## La pagina Energia di Home Assistant (facoltativo)

Impostazioni → Plance → Energia → Rete → costo → *Usa un'entità che tiene
traccia dei costi totali*:

- `sensor.costo_rete_bolletta` → quello che paghi davvero (con la quota fissa);
- `sensor.costo_energia_pura` → solo l'energia, senza tasse.

---

## English

These two files create in Home Assistant every sensor the `custom:casa-energia`
and `custom:casa-elettrodomestico` cards show.

**Where they go** — in Home Assistant's `config` folder (where `configuration.yaml` is):

| File | Goes into | Becomes |
|---|---|---|
| [`luce.yaml`](luce.yaml) | the `packages` folder | `/config/packages/luce.yaml` |
| [`luce.jinja`](luce.jinja) | the `custom_templates` folder | `/config/custom_templates/luce.jinja` |

Create the folders if they don't exist (File editor, Studio Code Server or Samba).

**Step by step**

1. Enable packages in `configuration.yaml`:
   ```yaml
   homeassistant:
     packages: !include_dir_named packages
   ```
2. Copy the two files as above.
3. Open `luce.yaml` and **search and replace** the names listed at the top
   (`sensor.mio_contatore_rete_kwh` = energy taken from the grid in kWh,
   solar, battery, the washer's plug). No solar or battery? Remove those parts.
   Don't rename the sensors the file creates: the cards look for those names.
4. Developer tools → YAML → **Check configuration**, then **Restart**.
5. Type your bill's prices into the helpers *Prezzo luce energia*, *… rete e
   oneri*, *… accise*, *IVA luce* (VAT %) and *Quota fissa energia giorno*
   (daily fixed fee incl. VAT). The total per kWh is computed for you.
6. On a casa-tile: Tap → *Open the home energy card* / *Open the appliance card*
   — they find these sensors by themselves.

For another appliance, copy the washer block at the end of `luce.yaml`, rename
`lavatrice` to the tile's name and add its two `utility_meter` entries.

### Costi degli elettrodomestici: con o senza tasse

Nell'esempio i costi dei cicli usano `input_number.prezzo_energia`, cioè il
prezzo **tutto compreso** (energia + rete e oneri + accise + IVA): è quello che
paghi davvero. Se invece nei singoli elettrodomestici vuoi vedere **solo
l'energia** — lasciando il conto completo alla scheda `casa-energia` — sostituisci
in `luce.yaml` `input_number.prezzo_energia` con `input_number.prezzo_luce_energia`
nelle righe dei cicli (non in quelle di `costo_rete_bolletta`, che deve restare
come la bolletta).

Attenzione a una cosa: i totali *già accumulati* non si riscrivono da soli.
Quelli che si calcolano da un contatore (oggi, mese) cambiano al primo
aggiornamento; quelli che si sommano ciclo per ciclo restano misti fino al
cambio di giorno o di mese.
