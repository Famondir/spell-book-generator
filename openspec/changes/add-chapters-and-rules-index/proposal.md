## Why

Das Buch soll sich noch mehr wie ein gebundenes Zauberbuch anfühlen: mit Kapiteln je Grad. Notizseiten vor mehrseitigen Zaubern sind manchmal Verschwendung; schöner wäre, die Lücke mit Inhalt zu füllen. Der Regelband hat bisher kein Inhaltsverzeichnis, die Nummern lassen sich darin also nur durch Blättern finden.

## What Changes

- **Kapitel** je Abschnitt (Zaubertricks, Alltagszauber, I.–IX. Grad): eine Doppelseite, links groß der Kapiteltitel mit Ordnungsfigur und Fluff-Text zur Stufe, rechts die Formeln des Kapitels mit Seitenzahlen. Kapitel beginnen links; am Ende des vorherigen Kapitels kommt bei Bedarf eine Leerseite. Abschaltbar.
- Einstellung **„Mehrseitige Zauber beginnen links“** wird zur Auswahl: *Notizseite einfügen* (bisher), *Umfang des nächsthöheren Grades* (ein Zauber mit ungerader Seitenzahl bekommt den Aufbau des nächsthöheren Grades statt einer Notizseite dahinter), *aus*.
- **Regelband mit Inhaltsverzeichnis**: Nummer, Name, Seite.
- (i) sitzt oben links auf der Seite (an der Stelle des QR-Codes, der nur im Druck zählt).

## Capabilities

### New Capabilities
<!-- keine -->

### Modified Capabilities
- `book-layout`: Kapitel, Ausgleichsmodus für linke Seiten
- `printing`: Inhaltsverzeichnis im Regelband

## Impact

`app/js/book.js` (assemble, spellPages-Option `layout`, Kapitel, Regelband), `app/js/app.js` (Einstellungen, Inhaltsverzeichnis, Regelband-Nachbearbeitung), `index.html`, `app/style.css`, `data/profile.js` (optionale eigene Kapiteltexte).
