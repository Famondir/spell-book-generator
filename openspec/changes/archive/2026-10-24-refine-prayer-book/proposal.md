## Why

Rückmeldung zum ersten Brevier:
- Die Gottheitssuche fand je nach Browser nur Beinamen („The Sea Dreamer“), nicht den Namen („Torag“).
- „Vom Lesen der Fenster“ erklärte nur das Beispielfenster, nicht welche Farben und Formen es überhaupt gibt, und es war unklar, was Medaillon und Bogenfeld im Bild sind.
- Gebetstitel wiederholten sich oft (122 verschiedene bei 291 Zaubern), weil sie nur aus Schule und Essenz entstanden.
- Mehrere Schulen hatten gleich viele Pässe und waren im Bild nicht unterscheidbar.

## What Changes

- Gottheitssuche: Vorschläge tragen Namen, Gesinnung und Beinamen in der Beschriftung, damit alle Browser nach dem Namen suchen.
- Andachtsbild mit nummerierter Beschriftung (wie beim Magierkreis); im Dialog per „Beschriftung“ umschaltbar, im Vorspann fest.
- Legende als nummerierte Liste mit Erklärung jedes Elements (Bogenfeld = Rundfenster mit Symbol und Pässen, Medaillon = Rosette der Essenzen).
- Zwei neue Vorspannseiten: „Die Gläser“ (16 Essenzgläser, Grundscheiben der Gottheit) und „Maßwerk, Zellen und Sockel“ (Bahnen je Grad, Pässe je Schule, Zellmuster je Gestalt, Bordüre, Sockel je Dauer).
- Pässe = Zahl der Schule ohne Begrenzung (Nekromantie 2 … Verwandlung 12, Universalmagie 10): jede Schule eindeutig.
- Gebetstitel: Thema aus Stichwörtern im Zaubernamen („Weihe der Waffe“, „Wehr wider das Böse“), sonst eine tragende Essenz (219 verschiedene Titel).

## Capabilities

### Modified Capabilities
- `deity-profiles`: Suche nach Name in allen Browsern
- `devotional-image`: eindeutige Pässe, Beschriftung
- `divine-prayer-book`: Legendenseiten im Vorspann
- `prayer-texts`: Titel aus dem Zaubernamen

## Impact

`app/js/vitrail.js`, `app/js/prayer.js`, `app/js/book.js`, `app/js/app.js`, `app/style.css`. Magierbuch unberührt.
