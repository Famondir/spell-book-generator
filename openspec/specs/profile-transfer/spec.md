# profile-transfer Specification

## Purpose
Profile und Vademecum-Texte als Daten im Browser, damit sie ohne Server auf andere Geräte und in die Online-Fassung mitreisen.
## Requirements
### Requirement: Profilpaket
Ein Profilpaket SHALL eine JSON-Datei mit den Feldern `format` („spellbook-profile“), `version`, `key`, `label`, `exported`, `profile` und optional `vademecum` (Einträge je Gottheits-Id) sein. Die App MUST ein Profilpaket nur mit `JSON.parse` lesen und MUST NOT Inhalte aus importierten Dateien als Code ausführen. Pakete mit anderem `format` oder höherer `version`, als die App kennt, MUST die App mit einer Meldung abweisen.

#### Scenario: Fremdes Format
- **WENN** eine JSON-Datei ohne `format: "spellbook-profile"` als Profil geladen wird
- **DANN** meldet die App, dass es kein Profilpaket ist, und ändert nichts

#### Scenario: JavaScript-Datei
- **WENN** `profile.local.js` im Dialog „Profil laden“ gewählt wird
- **DANN** wird die Datei nicht ausgeführt, und die App erklärt, dass man das Profil am Rechner in der App öffnen und dort exportieren soll

### Requirement: Profil exportieren
Die App SHALL jedes geladene Profil, ob aus `data/profile.local.js` oder aus dem Browserspeicher, als Profilpaket herunterladen können. Das Paket MUST alle zu diesem Zeitpunkt geladenen lokalen Vademecum-Einträge enthalten.

#### Scenario: Kirran am Laptop
- **WENN** die App über file:// mit `data/profile.local.js` und `data/vademecum.local.js` läuft und „Exportieren“ beim Profil „Kirran“ gewählt wird
- **DANN** entsteht eine Datei `kirran.profil.json` mit Kirrans Profil und dem Vademecum-Eintrag für Nethys

### Requirement: Profil laden und speichern
Ein geladenes Profilpaket SHALL im Browser unter dem Präfix `spellbook.` gespeichert werden und MUST nach dem Neuladen in der Profilauswahl jedes Charakters erscheinen und dort wie ein Profil aus der Datei wirken. Seine Vademecum-Einträge MUST je Gottheit gespeichert werden und wie Einträge aus `data/vademecum.local.js` wirken.

#### Scenario: Profil auf der Online-Fassung
- **WENN** auf der GitHub-Page `kirran.profil.json` geladen und für den Charakter „Kirran“ gewählt wird
- **DANN** tragen Buch, Randnotizen, Kalender und Formelherkunft Kirrans Profil, und das Vademecum der Nethys trägt die Texte des Hauses am Rande des Jenseits

#### Scenario: Speicher voll
- **WENN** der Browserspeicher das Paket nicht mehr aufnehmen kann
- **DANN** meldet die App das mit der Größe des Pakets, und vorhandene Profile bleiben unverändert

### Requirement: Ersetzen statt Verdoppeln
Lädt man ein Profilpaket, dessen Schlüssel schon gespeichert ist, SHALL die App nach Rückfrage mit altem und neuem Exportdatum das gespeicherte Profil ersetzen. Charaktere mit diesem Profil MUST danach den neuen Stand zeigen. Weicht das Label ab, MUST die Rückfrage zusätzlich anbieten, das Paket unter einem neuen Schlüssel anzulegen.

#### Scenario: Neuer Stand vom Laptop
- **WENN** auf dem Handy Kirrans Profil vom 1.11. gespeichert ist und ein Paket vom 15.11. mit demselben Schlüssel geladen und bestätigt wird
- **DANN** gibt es weiterhin genau ein Profil „Kirran“, und es hat den Stand vom 15.11.

### Requirement: Datei vor Speicher
Gibt es ein Profil oder einen Vademecum-Eintrag mit gleichem Schlüssel sowohl in einer lokalen Datei als auch im Browserspeicher, SHALL die Datei gelten. Die Verwaltung MUST das gespeicherte Profil dann als überdeckt kennzeichnen.

#### Scenario: Alter Stand am Laptop
- **WENN** am Laptop versehentlich ein älteres Paket von Kirran gespeichert wurde und `data/profile.local.js` geladen ist
- **DANN** nutzt die App die Datei, und die Verwaltung zeigt das gespeicherte Profil als „von Datei überdeckt“

### Requirement: Profile verwalten
Der Einstellungsdialog SHALL alle verfügbaren Profile mit Herkunft (Datei oder gespeichert) und bei gespeicherten mit Exportdatum auflisten und je Profil Exportieren anbieten, bei gespeicherten zusätzlich Entfernen. Entfernen MUST Charaktere, die das Profil nutzen, auf das neutrale Profil zurückfallen lassen, ohne ihr Buch zu ändern.

#### Scenario: Profil entfernen
- **WENN** das gespeicherte Profil „Mirla“ entfernt wird, während ein Charakter es nutzt
- **DANN** zeigt dieser Charakter nach dem Neuladen das neutrale Profil und hat dasselbe Buch wie vorher

