## Why

Am Spieltisch liegt meist das Handy oder Tablet bereit, nicht der Laptop. Die App läuft schon als GitHub Page, aber nur mit Netz, ohne eigenes Symbol, und jeder Start geht über den Browser. Tex-Tricorder (`~/Documents/PnP/Star Trek Adventures/Tex-Tricorder`) zeigt, dass eine statische Seite mit Manifest und Service Worker ohne Build-Schritt als App auf den Startbildschirm kommt und offline läuft. Mit `profiles-as-data` reist auch Kirrans Profil mit, und erst damit lohnt sich die Installation.

## What Changes

- `manifest.webmanifest` im Wurzelverzeichnis: Name, Kurzname, `start_url`/`scope` relativ (`./`), Farben passend zum Pergament, Symbole (192, 512, maskable 512)
- App-Symbole als PNG, erzeugt aus einem Zauberkreis der App selbst mit einem Werkzeug (`tools/make-icons.mjs`), keine fremden Grafiken
- `sw.js`: Netzwerk zuerst (Updates kommen sofort an), Cache als Offline-Fallback, nach dem Muster von Tex-Tricorder. Dazu kommt das **Vorladen aller App- und Datendateien** beim Installieren, damit auch selten genutzte Teile (Schriften für Keilschrift, Hieroglyphen, Ogham) offline da sind.
- Lokale optionale Dateien (`*.local.js`) und `docs/` nimmt der Service Worker nicht in den Cache, und er beantwortet sie offline nicht mit `index.html`
- Registrierung nur außerhalb von `file://`. Die Doppelklick-Fassung bleibt unverändert.
- Meta-Angaben für iOS (`apple-touch-icon`, `theme-color`)
- Bei installierter App bittet die App den Browser um dauerhaften Speicher (`navigator.storage.persist()`), damit Profile und Bücher nicht aufgeräumt werden
- In den Einstellungen: „Als App installieren“, wo der Browser das anbietet, sonst ein kurzer Hinweis je System. Dazu ein Abschnitt in der Anleitung.

## Capabilities

### New Capabilities
- `installable-app`: Manifest, Symbole, Service Worker mit Vorladen und Offline-Betrieb, Ausnahmen für lokale Dateien, dauerhafter Speicher, Installationshinweis

### Modified Capabilities
<!-- keine: Verhalten unter file:// und alle bestehenden Anforderungen bleiben gleich -->

## Impact

- Neu: `manifest.webmanifest`, `sw.js`, `app/icons/*.png`, `tools/make-icons.mjs`
- `index.html`: `<link rel="manifest">`, Meta-Angaben, Registrierung des Service Workers
- `app/js/app.js`: Installationsknopf und Hinweis in den Einstellungen, `storage.persist()`
- `data/lang/de.js`, `data/lang/en.js`, `docs/GUIDE.md`, README
- Tests: Vorladeliste gegen die tatsächlich ausgelieferten Dateien prüfen; Offline-Test im headless Chrome gegen einen lokalen HTTP-Server
- Offline-Cache etwa 10 MB (73 Dateien in `app/` und `data/`)
- Hängt ab von `profiles-as-data`
