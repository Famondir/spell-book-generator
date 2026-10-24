## Why

Der Paladin der Gruppe ist vermutlich ein Zwerg. Bleiglasfenster passen zu menschlichen Kirchen; zwergische Heiligtümer sind aus Stein gehauen. Schon in `explore-class-books` war eine Materialvariante „Steinintarsie“ desselben Renderers vorgesehen.

## What Changes

- Zweites Material für das Andachtsbild: **Steinintarsie** (Pietra dura). Gleiche Bedeutung aller Elemente wie beim Bleiglas, andere Ausführung:
  - Giebel statt Spitzbogen, Rahmen aus Quadern mit Fugen
  - feine Steinfugen statt Bleiruten, kein Durchlicht
  - gleichmäßige Zellen als fast regelmäßige Sechsecke (Basaltsäulen)
  - Steinsorten mit Musterung (Marmor geädert, Granit gesprenkelt, Malachit gebändert, Lapislazuli mit Goldflecken), Gold- und Silbereinlagen
  - jede Essenz als eigener Stein (Ignis Karneol, Vita Malachit, Lux Citrin …)
- Einstellung je Charakter „Andachtsbild“: automatisch, Bleiglas oder Steinintarsie. Automatisch = Stein für Torag und das Pantheon „Dwarven Deities“, sonst Glas.
- Brevier-Texte nach Material: „Vom Lesen der Steinbilder“, „Die Steine“, Grund- und Akzentsteine, Kapitelornament als Giebel.
- Bleiglas bleibt unverändert.

## Capabilities

### Modified Capabilities
- `devotional-image`: Materialien Bleiglas und Steinintarsie, Wahl automatisch nach Gottheit oder von Hand
- `divine-prayer-book`: Legendenseiten und Texte nach Material

## Impact

`app/js/vitrail.js`, `app/js/book.js`, `app/js/app.js`, `index.html`, `app/style.css`, README.
