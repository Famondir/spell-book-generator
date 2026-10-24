## Why

Mit einem großen Buch (269 Zauber, über 800 Seiten) baut „Mein Buch“ alle Seiten auf einmal auf und passt jede einzeln an. Firefox meldet „Diese Seite verlangsamt Firefox“, Klicks reagieren kaum. Die Zauber oben als Hunderte Pillen sind zudem unübersichtlich.

## What Changes

- Die Buchvorschau zeigt je nach Breite **eine oder zwei Seiten** und lässt sich **blättern** (intern werden alle Seiten der betroffenen Zauber gesetzt, damit die Seitenfüllung stimmt): vor, zurück, Anfang, Ende, Sprung zu einer Seitenzahl.
- Statt der Pillen eine **Inhaltsliste** neben der Vorschau: Schnellglyphe, Grad, Name, Titel, Seite; filterbar wie das Verzeichnis (Suche, Grad, Schule, Essenz, Herkunft) und in derselben Zeilenform; Klick springt zur Seite, **−** entfernt den Zauber aus dem Buch.
- Die Filterleiste (Verzeichnis und Buch) lässt sich **nach links einklappen**; rechts in der Buchansicht ein **ausklappbares Inhaltsverzeichnis** mit Seitenzahlen.
- Das zusammengesetzte Buch wird zwischengespeichert und nur neu gebaut, wenn sich Buch oder Einstellungen ändern.
- Schließen der Einstellungen erzeugt die Texte nur neu, wenn sich der Besitzer geändert hat.
- Der Druck des ganzen Buches bleibt vollständig; während der Vorbereitung zeigt der Knopf einen Hinweis.

## Capabilities

### New Capabilities
<!-- keine -->

### Modified Capabilities
- `book-layout`: Vorschau blätterbar, Inhaltsliste mit Filter und Entfernen

## Impact

`app/js/app.js` (renderBook, Einstellungen), `index.html` (Buchansicht), `app/style.css`. Kein Einfluss auf Seitenplanung, Druckergebnis oder Texte.
