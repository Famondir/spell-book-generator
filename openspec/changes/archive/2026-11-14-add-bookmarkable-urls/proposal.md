## Why

Die Adresszeile kennt heute nur den Reiter (`#book`, `#theory`, `#prepare`). Welcher Zauber offen ist, welche Lektion im Lehrheft aufgeschlagen ist oder ob die ausführliche Fassung im Fenster steht, geht beim Neuladen verloren (das Verzeichnis springt immer auf Fireball) und lässt sich nicht als Lesezeichen setzen. Auch der Zurück-Knopf des Browsers verlässt die App, statt zum vorigen Zauber zu führen oder das Fenster zu schließen.

## What Changes

- Die Adresse beschreibt den sichtbaren Ort als Hash: `#<ansicht>[/<id>…][/full]` mit englischen Segmenten (`browse`, `book`, `prepare`, `theory`), z. B. `#browse/fireball`, `#book/fireball/full`, `#theory/primer/v-use`, `#theory/vademecum/a/<lektion>`.
- **Verzeichnis**: der ausgewählte Zauber steht in der Adresse und wird beim Laden ausgewählt.
- **Buch**: die Adresse nennt den Zauber, nicht die Seite; beim Laden wird zur ersten Seite des Zaubers im richtigen Band geblättert. Steht der Zauber nicht im Buch, zeigt die App ihn im Verzeichnis.
- **Lehre**: Anker für Hauptteil (Lehrheft-Teil/-Lektion bzw. „Vom Gebet“) und Vademecum (Hälfte, Teil/Lektion).
- **Fenster**: nur die ausführliche Fassung (+) bekommt ein Adress-Suffix (`/full`); Kreis-, Glasfenster- und Regelfenster bleiben außen vor.
- **Verlauf**: Wechsel von Ansicht, Zauber, Lektion und Öffnen des Fensters legen einen Verlaufseintrag an (pushState); Blättern innerhalb einer Einheit ersetzt nur die Adresse (replaceState). Zurück/Vor stellt den Ort wieder her, Zurück schließt das offene Fenster.
- **Vorrang**: eine Adresse mit Ziel geht beim Laden vor der in localStorage gemerkten Position; ohne Ziel bleibt alles wie bisher.
- Die aktive Figur steht nicht in der Adresse; Druckvorschau ebenfalls nicht.
- Funktioniert gleich über `file://` und GitHub Pages (nur Hash, kein Server-Routing).

## Capabilities

### New Capabilities
- `url-state`: Abbildung des sichtbaren Orts (Ansicht, Zauber, Lehre-Anker, ausführliche Fassung) auf die Hash-Adresse, Wiederherstellung beim Laden und über Zurück/Vor, Rückfallregeln.

### Modified Capabilities
<!-- keine: Blättern, Auswahl und Fenster verhalten sich wie bisher; die Adresse kommt als neue Fähigkeit hinzu -->

## Impact

- `app/js/app.js`: `show()`, `select()`, `openFull()`, Buch-/Lehrheft-/Vademecum-Navigation, Start (`location.hash`-Auswertung am Ende), neuer `popstate`-Handler.
- `app/js/viewer.js`: ggf. Rückmeldung beim Blättern (Einheitswechsel) für replaceState.
- Neues kleines Modul (z. B. `app/js/route.js`) für Lesen/Schreiben der Adresse; Einbindung in `index.html`.
- Keine neuen Abhängigkeiten; localStorage-Schlüssel bleiben unverändert.
