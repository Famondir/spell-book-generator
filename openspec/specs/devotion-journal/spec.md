# devotion-journal Specification

## Purpose
TBD - created by archiving change add-devotion-journal. Update Purpose after archive.
## Requirements
### Requirement: Andachtsbuch
Die App SHALL je Charakter ein Andachtsbuch führen, das mit jedem Spieltag um einen Eintrag wächst: Ingame-Datum, echtes Datum, Morgengebet, Abendgebet und Tagebuch. Es MUST als Buch im Format A5 blätterbar sein (wie die Buchvorschau), älteste Einträge zuerst, und als Ganzes druckbar sein. Probetage MUST NOT darin erscheinen.

#### Scenario: Drei Spieltage
- **WENN** ein Charakter drei Spieltage hatte, einer davon als Probe markiert
- **DANN** enthält das Andachtsbuch zwei Einträge in zeitlicher Reihenfolge

#### Scenario: Leerer Eintrag
- **WENN** für einen Spieltag kein Tagebuchtext vorliegt
- **DANN** zeigt der Eintrag die Seiten wie das Andachtsblatt (Anrufung bzw. ganzes Morgengebet, Fragment, Protokoll falls gewünscht) und ein liniertes Feld für das Tagebuch

### Requirement: Rückschau-Export
Für jeden Spieltag SHALL sich ein Rückschau-Bogen als Datei exportieren lassen. Er enthält Charaktername, Ingame-Datum, echtes Datum, das Protokoll des Tages (vorbereitet, gewirkt, vertauscht, ungenutzt), das Formelfragment der Andacht, das erzeugte Abendgebet, die vorhandenen Tagebuchtexte der letzten drei Spieltage und die Stimme des Tagebuchs aus dem Profil. Das Format MUST sowohl menschenlesbar (Markdown) als auch maschinenlesbar (eingebettetes JSON) sein.

#### Scenario: Export nach der Sitzung
- **WENN** nach einer Sitzung „Rückschau exportieren“ gewählt wird
- **DANN** entsteht eine Datei mit Ingame-Datum im Namen, die alle gewirkten Zauber des Tages und die Stimme des Tagebuchs enthält

### Requirement: Rückschau-Import
Eine Datei mit einem Tagebucheintrag (der auch ein spontanes Gebet enthalten darf; ein Feld `evening` älterer Bögen wird weiter übernommen) SHALL sich zu einem Spieltag importieren lassen; die App MUST den Spieltag über seine Kennung zuordnen, vor dem Überschreiben vorhandener Texte nachfragen und die Texte nur beim Charakter speichern. Die Texte MUST im Charakter-Export enthalten sein.

#### Scenario: Import
- **WENN** eine Rückschau-Datei für den Spieltag vom 12. des dritten Monats importiert wird
- **DANN** zeigen Andachtsbuch und Rückseite des Andachtsblatts dieses Tages den importierten Tagebucheintrag

#### Scenario: Unbekannter Tag
- **WENN** die Datei einen Spieltag nennt, den es beim aktiven Charakter nicht gibt
- **DANN** lehnt die App den Import mit einer Meldung ab und ändert nichts

### Requirement: Tagebuch von Hand
Der Tagebucheintrag eines Spieltages SHALL sich auch direkt in der App schreiben und ändern lassen; ein einziges Feld genügt, auch für ein spontanes Gebet.

#### Scenario: Eintrag schreiben
- **WENN** im Andachtsbuch beim laufenden Tag ein Tagebucheintrag geschrieben wird
- **DANN** ist er nach einem Neuladen noch vorhanden

### Requirement: Einträge des Spielleiters
Die App SHALL Einträge des Spielleiters aus einer Datei importieren. Jeder Eintrag hat eine Kennung und einen **Freigabecode**; Titel und Text MUST mit diesem Code verschlüsselt sein, sodass die App vor der Freigabe weder Titel noch Text kennt. Vor der Freigabe MUST die App nur die Anzahl versiegelter Einträge zeigen. Die Freigabe geschieht spontan: Nennt der Spielleiter am Tisch einen Code („aktiviere Eintrag 7, Code …“) und wird er in der App eingegeben, MUST die App den Eintrag sofort als eigene Seite öffnen, dem laufenden Spieltag zuordnen, im Andachtsbuch zeigen und die Freigabe protokollieren. Freigegebene Einträge MUST in derselben Schrift wie das übrige Andachtsbuch erscheinen.

#### Scenario: Spontane Freigabe
- **WENN** der Spielleiter mitten in der Sitzung den Code eines Eintrags nennt und er eingegeben wird
- **DANN** öffnet die App sofort die Seite mit Titel und Text des Eintrags, und er steht danach im Andachtsbuch beim laufenden Spieltag

#### Scenario: Falscher Code
- **WENN** ein Code eingegeben wird, der zu keinem Eintrag passt
- **DANN** meldet die App das, und kein Eintrag ändert sich

#### Scenario: Versiegelt
- **WENN** drei Einträge importiert und noch keiner freigegeben ist
- **DANN** zeigt die App nur „3 versiegelte Einträge“, ohne Titel oder Text

### Requirement: Liste für den Spielleiter
Die App SHALL eine Statusliste der Einträge des Spielleiters exportieren: Kennung, Status (versiegelt oder freigegeben) und bei freigegebenen Einträgen Ingame-Datum und echtes Datum der Freigabe. Codes und Texte MUST NOT in dieser Liste stehen.

#### Scenario: Liste exportieren
- **WENN** nach zwei Freigaben die Liste exportiert wird
- **DANN** enthält sie alle Kennungen, zwei davon mit Datum der Freigabe, und keinen Code und keinen Text

