## Why

Die Seiten im Betrachter werden in Originalgröße (A5) gezeigt; auf großen Bildschirmen ist die Schrift dabei oft recht klein. Wer heute die Browser-Vergrößerung nutzt, vergrößert die ganze Oberfläche mit – Filter, Verzeichnis und Blätterleiste werden unnötig groß und nehmen den Seiten den Platz weg. Gebraucht wird eine Vergrößerung nur für die Seiten.

## What Changes

- Neue Zoom-Steuerung in der Blätterleiste des gemeinsamen Seitenbetrachters: kleiner (−), Anzeige der Stufe (Klick setzt zurück), größer (+) und „Einpassen“ (Seiten so groß wie die verfügbare Fläche erlaubt).
- Der Zoom wirkt nur auf die Seiten; Blätterleiste, Seitenleisten und Kopf behalten ihre Größe.
- Die Wahl zwischen Einzel- und Doppelseite berücksichtigt den Zoom: Passt die vergrößerte Doppelseite nicht mehr, zeigt der Betrachter eine Seite. Ist auch eine Seite breiter als die Fläche, lässt sich die Seitenfläche waagrecht verschieben, statt die Oberfläche zu verbreitern.
- Tasten `+`, `-` und `0` zoomen bzw. setzen zurück (nicht in Eingabefeldern und Dialogen).
- Die Zoomstufe wird gemerkt (eine Stufe für alle Ansichten) und überlebt Neuladen und Fenstergrößenänderung.
- Satz, Seitenfüllung und Druck bleiben unverändert: Der Zoom ist reine Anzeige.

## Capabilities

### New Capabilities
<!-- keine -->

### Modified Capabilities
- `page-viewer`: Neue Anforderung „Seitenzoom“; die Anforderung „Gemeinsamer Seitenbetrachter“ (Wahl Einzel-/Doppelseite, Verkleinern auf schmalen Bildschirmen) berücksichtigt künftig die Zoomstufe.

## Impact

- `app/js/viewer.js`: Zoomzustand, Knöpfe in `renderPager`, `size()` und das bisherige Verkleinern auf schmalen Bildschirmen rechnen mit dem Zoom; Tasten.
- `app/style.css`: Zoomknöpfe in `.pager`, waagrechtes Verschieben der Seitenfläche, Druck ohne Zoom.
- `app/js/i18n.js`: Beschriftungen/Titel der Zoomknöpfe (de/en).
- Betroffen sind alle Nutzer des Betrachters: Buch, Lehrheft, Theorie-Seiten, „Vom Gebet“ (`app/js/app.js`, `app/js/devotion.js`) – ohne eigene Änderungen, sofern sie `VIEWER.create` nutzen.
