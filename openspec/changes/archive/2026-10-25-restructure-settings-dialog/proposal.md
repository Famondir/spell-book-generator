## Why

Der Einstellungsdialog ist über die Zeit zu einem langen Schlauch geworden: Charakterverwaltung, Buchtitel, Aufbau, Druckformate, Regelverweise, Klassenfilter und Import/Export stehen ohne Gliederung untereinander, 520 px breit, und man muss für fast jede Änderung scrollen. Mit den Bänden ist gerade noch ein Feld dazugekommen; weitere (Zaubersprachen, Statistik) stehen im Backlog.

## What Changes

- Der Dialog bekommt Abschnitte wie die Kapitel eines GitBooks: links eine Abschnittsliste, rechts nur der gewählte Abschnitt. Auf schmalen Bildschirmen wird die Liste zu einer Reihe Reiter über dem Inhalt.
- Vier Abschnitte, nach Aufgabe geschnitten:
  - **Charakter**: Name, Profil, Klasse, Gottheit, Andachtsbild, „Nur Zauber der Klassenliste“, Charakter anlegen, duplizieren, löschen.
  - **Buch**: Besitzer, Titel, Untertitel, Vorspann, Kapitel, Beginn links, ausführliche Fassung, Regelverweise. All das gilt für Vorschau *und* Druck.
  - **Druck**: Papierformat, Schriftrollen, Pergament-Hintergrund, Seiten je Band.
  - **Bestand & Export**: Liste exportieren, importieren, Buch leeren.
- Abweichung vom ersten Vorschlag: Es gibt keinen eigenen Abschnitt „Optik digital“. Fast jede Buch-Einstellung wirkt in Vorschau und Druck gleich, eine Trennung würde in die Irre führen. Druck-only ist nur, was ausschließlich das Papier betrifft.
- Beschriftungen, die fälschlich „drucken“ sagen, obwohl sie auch die Vorschau ändern („Vorspann drucken“, „Ausführliche Fassung drucken“), werden korrigiert.
- Der Dialog hat eine feste Höhe; „Fertig“ steht immer sichtbar unten. Der zuletzt gewählte Abschnitt wird gemerkt.
- Verhalten unverändert: Einstellungen werden weiterhin beim Schließen übernommen; alle Feldnamen bleiben gleich (keine Migration).

## Capabilities

### New Capabilities
- `settings-dialog`: Aufbau und Bedienung des Einstellungsdialogs (Abschnitte, Navigation, feste Höhe, gemerkter Abschnitt, Zuordnung der Einstellungen).

### Modified Capabilities
<!-- keine: die Einstellungen selbst und ihr Verhalten bleiben gleich -->

## Impact

- `index.html`: Markup des `#settings`-Dialogs (Abschnitte, Navigation).
- `app/style.css`: Dialog-Layout (zweispaltig, feste Höhe, Reiter bei schmaler Breite).
- `app/js/app.js`: Abschnittswahl, Merken des Abschnitts; Laden/Übernehmen der Werte unverändert.
- Keine Datenänderung, kein Einfluss auf Buch, Druck oder Export.
