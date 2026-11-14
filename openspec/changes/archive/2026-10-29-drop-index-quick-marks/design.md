## Context

`quickGlyph(m, opts)` in `app/js/circle.js` zeichnet die Schnellglyphe aus Kreis, Schulfigur, Hauptessenz, Gestaltstrich, Gradpunkten und den Absichtszeichen (`quickLetters`). Dieselbe Funktion wird überall genutzt: Zauberkopf, Zauberseite, Vorspann-Erklärung, Lehrheft, App-Listen, Vorbereitung, Tageszettel, Verzeichnis der Formeln (`table.toc .tq`, 7 mm) und Kapitellisten (`.ch-row .tq`, 4,5 mm). In den beiden letzten Listen sind die Zeichen bei dieser Größe nur ein Fleck.

## Goals / Non-Goals

**Goals:**
- Verzeichnis und Kapitellisten zeigen die Glyphe ohne Absichtszeichen.
- Die übrige Glyphe bleibt Strich für Strich gleich, damit sie dieselbe Glyphe wie am Zauberkopf ist.

**Non-Goals:**
- Keine Änderung an App-Listen, Vorbereitung oder Tageszettel (eigene Größen, dort helfen die Zeichen beim Unterscheiden).
- Keine Änderung an Kernzeilen, Wortschatz oder Prüfwerkzeug; die Eindeutigkeit gilt weiter für die volle Form.
- Keine neue Größe oder Strichstärke für die Index-Glyphe.

## Decisions

- **Option statt zweiter Funktion:** `quickGlyph(m, { marks: false })` lässt `quickLetters(m)` weg. Standard bleibt `marks: true`, sodass alle anderen Aufrufer unverändert bleiben. Eine eigene Funktion `quickGlyphPlain` würde den Aufbau doppeln.
- **Gleicher viewBox:** Der viewBox bleibt `-80 -80 160 160`. Die Glyphe sitzt dann an derselben Stelle und in derselben Größe wie bisher, und die Spalten von Verzeichnis und Kapitelliste verschieben sich nicht. Ein engerer Rahmen ist nicht nötig, weil die Zeichen innerhalb des Kreises liegen.
- **Aufrufer in `book.js`:** Nur die zwei Stellen in `build` (Kapitellisten und Verzeichnis) übergeben `{ marks: false }`.
- **Kein `coreChoice` ohne Zeichen:** Ohne Zeichen ruft die Glyphe `TEXTGEN.coreChoice` nicht auf. Das spart beim Verzeichnis ein paar Aufrufe, auch wenn sie zwischengespeichert sind.

## Risks / Trade-offs

- [Zwei Zauber sehen im Verzeichnis gleich aus] → Gewollt; Titel, Regelname und Seitenzahl stehen daneben.
- [Bildvergleiche in der Test-Baseline schlagen bei Verzeichnis- und Kapitelseiten an] → Baseline nach Sichtprüfung neu sichern.
