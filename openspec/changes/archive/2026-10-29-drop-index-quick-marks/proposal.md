## Why

Im Verzeichnis der Formeln (7 mm) und in den Kapitellisten (4,5 mm) sind die Schnellglyphen so klein, dass die beiden Absichtszeichen neben der Schulfigur das Bild überladen und zu einem Fleck verschwimmen. Im Verzeichnis muss die Glyphe nicht eindeutig sein: Titel, Regelname und Seitenzahl stehen daneben, und Kreis, Schulfigur, Hauptessenz, Gestaltstrich und Gradpunkte zeigen auch ohne Buchstaben, wohin die Formel wirkt.

## What Changes

- **Verzeichnis ohne Absichtszeichen:** Im Verzeichnis der Formeln (Vorspann und Bandverzeichnis) wird die Schnellglyphe ohne Absichtszeichen gezeichnet, also nur mit Kreis, Schulfigur, Hauptessenz, Gestaltstrich und Gradpunkten.
- **Kapitellisten ebenso:** Die Formellisten auf den Kapiteldoppelseiten zeigen die Glyphe ebenfalls ohne Absichtszeichen.
- **Sonst unverändert:** Die volle Schnellglyphe mit Absichtszeichen bleibt am Zauberkopf, im Abschnitt „Schnellglyphe“ der Zauberseite, in Legende, Vorspann-Erklärung und Lehrheft, in der Buchliste der App, in der Vorbereitung und auf dem Tageszettel. Die Eindeutigkeit auf der Klassenliste gilt weiter für die volle Glyphe.

## Capabilities

### New Capabilities
<!-- keine -->

### Modified Capabilities
- `magic-circle`: Die Anforderung „Schnellglyphen“ erlaubt eine verkürzte Form ohne Absichtszeichen für Verzeichnis und Kapitellisten; die Eindeutigkeit bezieht sich auf die volle Glyphe.
- `book-layout`: Die Anforderungen „Vorspann“ (Verzeichnis der Formeln) und „Kapitel“ (Formelliste des Kapitels) zeigen die Schnellglyphe ohne Absichtszeichen.

## Impact

- Geändert: `app/js/circle.js` (Option für `quickGlyph`, die Absichtszeichen wegzulassen), `app/js/book.js` (Verzeichnis und Kapitellisten nutzen sie).
- Unverändert: Prüfwerkzeug `tools/quick-glyph-check.mjs`, Formeln, Kernzeilen, Formel-Snapshot.
- Die Test-Baseline kann sich bei den Verzeichnis- und Kapitelseiten ändern, falls sie Bildvergleiche enthält.
