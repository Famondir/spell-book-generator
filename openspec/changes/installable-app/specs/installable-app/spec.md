## ADDED Requirements

### Requirement: Installierbar
Die Online-Fassung SHALL ein Web-App-Manifest mit Name, Kurzname, relativem `start_url` und `scope`, `display: "standalone"` und Symbolen in 192 und 512 Pixeln sowie einer maskierbaren Fassung ausliefern und einen Service Worker registrieren. Unter `file://` MUST die App keinen Service Worker registrieren und sich verhalten wie bisher.

#### Scenario: Android
- **WENN** die GitHub-Page in Chrome auf Android geöffnet und „Zum Startbildschirm hinzufügen“ gewählt wird
- **DANN** erscheint ein Symbol mit Zauberkreis, und die App startet ohne Browserleiste

#### Scenario: Doppelklick
- **WENN** `index.html` über `file://` geöffnet wird
- **DANN** ist kein Service Worker registriert, und alle Bedienungstests laufen wie vorher

### Requirement: Offline nach dem ersten Besuch
Nach dem ersten Besuch mit Netz SHALL die App ohne Netz vollständig nutzbar sein: Verzeichnis, Buch, Lehrheft, Vademecum, Heute vorbereitet, Drucken und alle Schriften der Formelsprachen. Das MUST auch für Teile gelten, die beim ersten Besuch nicht geöffnet wurden.

#### Scenario: Flugmodus
- **WENN** die App einmal online geöffnet und dann im Flugmodus neu gestartet wird
- **DANN** zeigt sie das Buch des aktiven Charakters, und eine akkadische Zauberseite zeigt die Keilschrift

### Requirement: Aktualisierung beim Start
Mit Netz SHALL die App bei jedem Start die aktuellen Dateien der Online-Fassung verwenden, ohne dass Caches von Hand geleert werden müssen.

#### Scenario: Neue Fassung
- **WENN** eine neue Fassung von `app/js/book.js` veröffentlicht wurde und die installierte App mit Netz neu gestartet wird
- **DANN** läuft die neue Fassung

### Requirement: Lokale Dateien bleiben außen vor
Der Service Worker MUST NOT Dateien mit `.local.` im Namen sowie Dateien unter `docs/`, `tools/` und `openspec/` cachen. Offline MUST er nur Seitenaufrufe mit `index.html` beantworten, nicht Skripte oder andere Dateien.

#### Scenario: Fehlendes lokales Profil offline
- **WENN** die installierte App offline startet und `data/profile.local.js` anfragt
- **DANN** schlägt die Anfrage fehl, das Skript-Element wird entfernt, und es gibt keinen Syntaxfehler in der Konsole

### Requirement: Vollständige Vorladeliste
Die Vorladeliste des Service Workers SHALL genau die ausgelieferten Dateien aus `app/` und `data/` (ohne `*.local.js`) sowie `index.html` und das Manifest enthalten. Ein Prüfwerkzeug MUST Abweichungen melden.

#### Scenario: Neue Formelsprache vergessen
- **WENN** eine neue Datei `data/formula-lang/gothic.js` in `index.html` eingebunden, aber nicht in die Vorladeliste eingetragen wird
- **DANN** meldet das Prüfwerkzeug die fehlende Datei als Fehler

### Requirement: Dauerhafter Speicher
Läuft die App installiert, SHALL sie den Browser einmal um dauerhaften Speicher bitten.

#### Scenario: Erster Start installiert
- **WENN** die App zum ersten Mal im Modus `standalone` startet
- **DANN** hat sie `navigator.storage.persist()` aufgerufen

### Requirement: Installationshinweis
Die Einstellungen SHALL „Als App installieren“ anbieten, wenn der Browser eine Installation anbietet, und sonst einen kurzen Hinweis für das jeweilige System zeigen. Unter `file://` MUST stattdessen ein Verweis auf die Online-Fassung stehen. Die Anleitung MUST erklären, dass auf iOS Profil und Charakter in der installierten App selbst geladen werden müssen.

#### Scenario: Chrome am Desktop
- **WENN** Chrome die Installation anbietet und die Einstellungen geöffnet werden
- **DANN** gibt es den Knopf „Als App installieren“, und ein Klick öffnet den Installationsdialog des Browsers

#### Scenario: Safari auf dem iPhone
- **WENN** die Einstellungen in Safari auf iOS geöffnet werden
- **DANN** steht dort der Hinweis „Teilen → Zum Home-Bildschirm“
