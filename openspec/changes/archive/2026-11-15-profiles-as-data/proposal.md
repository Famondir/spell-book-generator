## Why

Das persönliche Profil (`data/profile.local.js`) und die lokalen Vademecum-Texte (`data/vademecum.local.js`) sind Dateien neben der `index.html` und deshalb gitignored. Auf GitHub Pages und damit in jeder installierten Fassung der App (Change `installable-app`) fehlen sie. Der Charakter-Export enthält nur den Schlüssel des Profils, nicht seinen Inhalt. Wer Kirran auf dem Handy öffnet, bekommt Buch und Vorbereitung, aber das neutrale Profil und ein dünnes Vademecum. Profile müssen deshalb Daten im Browser werden, die man zwischen Geräten mitnehmen kann. Weiterhin gilt: kein Server, keine Konten, nichts Persönliches im Repository.

## What Changes

- Neues **Profilpaket** als JSON (`*.profil.json`): Profil und Vademecum-Einträge, mit Format- und Versionsangabe. Es enthält nur Daten und wird beim Import nie als Code ausgeführt.
- **Profil exportieren**: Die App schreibt ein geladenes Profil, ob aus der Datei oder aus dem Speicher, samt den geladenen Vademecum-Einträgen als Profilpaket. Der Arbeitsablauf bleibt: am Laptop `profile.local.js` bearbeiten, neu laden, exportieren.
- **Profil laden**: Ein Profilpaket wird im Browser gespeichert (`localStorage`, Präfix `spellbook.`) und steht danach in der Profilauswahl der Charaktere wie ein Profil aus der Datei. Ein erneuter Import desselben Profils **ersetzt** das gespeicherte, statt ein zweites anzulegen.
- **Gespeicherte Profile verwalten**: Liste in den Einstellungen mit Herkunft (Datei oder gespeichert), Stand, Exportieren und Entfernen.
- **Gespeicherte Vademecum-Einträge** werden je Gottheit wie Einträge aus `vademecum.local.js` behandelt. Bei gleicher Gottheit geht die Datei vor.
- **Charakter-Export** enthält zusätzlich das Profilpaket des Charakters: sein Profil und den Vademecum-Eintrag seiner Gottheit. Der Import legt das Profil an oder ersetzt es und verbindet den Charakter damit. Eine einzige Datei überträgt also einen ganzen Charakter auf ein anderes Gerät.
- Beim Import einer `.js`-Profildatei verweist die App auf den Weg über „Profil exportieren“ (kein Ausführen fremden Codes).

## Capabilities

### New Capabilities
- `profile-transfer`: Profilpaket (Format, Inhalt), Export, Import, Speicherung im Browser, Verwaltung, Vorrang zwischen Datei und Speicher.

### Modified Capabilities
- `character-profile`: Profile kommen aus der lokalen Datei **oder** aus dem Browserspeicher. Die App läuft weiterhin ohne beides.
- `character-slots`: Der Export und Import je Charakter enthält das Profilpaket.
- `vademecum`: Die Inhaltsquellen umfassen auch gespeicherte Vademecum-Einträge.

## Impact

- `app/js/chars.js` (`profiles()` um gespeicherte Profile ergänzen), `app/js/profile.js` (unverändertes Mischen, neue Quelle)
- Neu `app/js/profile-store.js` (Paket, Speicher, `vademecumEntry`), vor `chars.js` geladen; `app/js/vademecum.js` und `app/js/time.js` fragen Vademecum-Einträge darüber ab
- `index.html`: Block „Profile“ im Einstellungsdialog (Abschnitt Charakter)
- `app/js/app.js`: Charakter-Export und -Import (`#btn-export`, `#file-import`), Profilauswahl `#char-profile`
- `data/lang/de.js`, `data/lang/en.js`: Oberflächentexte
- `docs/GUIDE.md`, README: Profil auf ein anderes Gerät bringen
- Tests in `tools/test-browser.mjs` / `tools/test-cases.mjs`
- Speicherbedarf: Kirrans Profil ~52 KB, das Nethys-Vademecum ~190 KB. Das liegt weit unter dem üblichen Limit für `localStorage` (~5 MB je Herkunft).
- Voraussetzung für `installable-app`
