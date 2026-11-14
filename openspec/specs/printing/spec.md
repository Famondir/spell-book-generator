# printing Specification

## Purpose
Druck des Buches, einzelner Zauber und von Schriftrollen.
## Requirements
### Requirement: Papierformate
Das Buch SHALL in A5, A4 (A5 hochskaliert) und A4 quer mit zwei A5-Seiten gedruckt werden können.

#### Scenario: A4 quer
- **WENN** „A4 quer“ gewählt ist
- **DANN** stehen je zwei Buchseiten nebeneinander auf einem Blatt

### Requirement: Schriftrollen
Jeder Zauber SHALL als Schriftrolle druckbar sein: vorne Name und großer Kreis, hinten Formel, Komponenten und Regeltext (A4 zweispaltig ohne Skalierung, A5 möglich).

#### Scenario: Alle als Schriftrollen
- **WENN** „Alle als Schriftrollen drucken“ gewählt wird
- **DANN** entstehen für jeden Buchzauber Vorder- und Rückseite

### Requirement: Druckoptionen
Der Pergament-Hintergrund SHALL abschaltbar sein; die Schriften MUST lokal mitgeliefert werden; ein einzelner Zauber MUST für sich druckbar sein.

#### Scenario: Ohne Hintergrund
- **WENN** „Pergament-Hintergrund drucken“ aus ist
- **DANN** ist der Seitenhintergrund weiß

### Requirement: Tageszettel
Die aktuelle Vorbereitung SHALL als A5-Tageszettel im Buchstil druckbar sein: je Zauber Schnellglyphe, Name, Grad und ein Kästchen zum Abhaken.

#### Scenario: Tageszettel drucken
- **WENN** in der Vorbereitung „Tageszettel drucken“ gewählt wird
- **DANN** entsteht eine Seite mit allen vorbereiteten Zaubern nach Grad, jeder mit leerem Kästchen

### Requirement: Regelband
Die App SHALL einen separaten Regelband drucken: Titelblatt und die Regeltexte aller Buchzauber in Buchreihenfolge, jeder mit seiner Nummer aus dem Inhaltsverzeichnis.

#### Scenario: Nebeneinanderlegen
- **WENN** im Buch bei Fireball „Regelband Nr. 57“ steht
- **DANN** findet sich Fireball im Regelband unter Nr. 57

### Requirement: Fortschrittsanzeige
Länger laufende Vorgänge (Druckvorbereitung, Regelband, Schriftrollen, Import) SHALL einen Zähler „erledigt/gesamt“ zeigen und den Browser zwischendurch bedienbar lassen.

#### Scenario: Buch drucken
- **WENN** ein Buch mit 800 Seiten gedruckt wird
- **DANN** zählt die Anzeige die gesetzten Seiten hoch, bis der Druckdialog erscheint

### Requirement: Druck-Cache
Ein unveränderter Druckauftrag MUST beim zweiten Mal ohne erneutes Setzen gedruckt werden.

#### Scenario: Zweiter Druck
- **WENN** das Buch zweimal hintereinander ohne Änderung gedruckt wird
- **DANN** erscheint der Druckdialog beim zweiten Mal sofort

### Requirement: Inhaltsverzeichnis des Regelbands
Der Regelband SHALL nach dem Titelblatt ein Inhaltsverzeichnis enthalten, das jeder Nummer Namen und Seitenzahl zuordnet.

#### Scenario: Nummer nachschlagen
- **WENN** im Zauberbuch „Regelband Nr. 224“ steht
- **DANN** nennt das Inhaltsverzeichnis des Regelbands die Seite von Nr. 224

### Requirement: Druck nach Bänden
Hat das Buch mehr als einen Band, SHALL „Buch drucken“ je Band einen eigenen Druckauftrag erzeugen: der Druckknopf heißt dann „Band II drucken / als PDF“ und druckt den in der Bandwahl gewählten Band; jeder Auftrag MUST nur die Seiten dieses Bandes mit dessen Seitenzahlen enthalten. Der Druck-Cache MUST je Band gelten. Schriftrollen und Regelband MUST unverändert bleiben.

#### Scenario: Band II drucken
- **WENN** das Buch drei Bände hat, Band II gewählt ist und „Band II drucken / als PDF“ geklickt wird
- **DANN** enthält der Druckauftrag genau die Seiten von Band II, beginnend mit seiner Titelseite als Seite 1

#### Scenario: Ein Band
- **WENN** keine Seitengrenze gesetzt ist
- **DANN** druckt „Buch drucken / als PDF“ wie bisher das ganze Buch in einem Auftrag

### Requirement: Lehrheft als Druckauftrag
Neben Buch, Regelband und Schriftrollen SHALL das Lehrheft ein eigener Druckauftrag sein, im eingestellten Papierformat, mit Fortschrittsanzeige und Druck-Cache.

#### Scenario: Zweiter Druck
- **WENN** das Lehrheft zweimal ohne Änderung gedruckt wird
- **DANN** erscheint der Druckdialog beim zweiten Mal sofort

### Requirement: Lochrand im Lehrheft
Das Lehrheft SHALL ab Werk mit Lochrand gesetzt werden: Die Bindungsseite ist breiter, auf ungeraden Seiten links, auf geraden rechts; die Satzbreite MUST gleich bleiben, damit Umbruch und Überlaufprüfung in Ansicht und Druck übereinstimmen. Die Randspalte für Glossen und Notizen MUST immer außen liegen, also gegenüber dem Lochrand, und jeder Teil MUST auf einer ungeraden Seite beginnen (nötigenfalls mit einer Leerseite davor), damit die Seitenlage in der Ansicht eines Teils und im Druck übereinstimmt. Abschaltbar im Abschnitt „Druck“; ohne Lochrand gibt es keine Leerseiten.

#### Scenario: Ringbuch
- **WENN** das Lehrheft mit Lochrand auf A4 gedruckt wird
- **DANN** liegt der breitere Rand auf Seite 1 links und auf Seite 2 rechts, die Randspalte jeweils auf der anderen Seite, jeder Teil beginnt auf einer ungeraden Seite, und keine Seite läuft über

#### Scenario: Doppelseite in der Ansicht
- **WENN** das Lehrheft breit genug für zwei Seiten angezeigt wird
- **DANN** steht Seite 1 allein rechts, danach folgen 2|3, 4|5, und der Lochrand liegt jeweils innen

### Requirement: Satz des Lehrhefts
Die Druck-Einstellungen SHALL für das Lehrheft drei Satzarten bieten: „ausgewogen“ (ab Werk), „jede Lektion auf neuer Seite“ und „dicht“. Ausgewogen MUST eine Lektion, die nicht mehr auf die angefangene Seite passt, ganz auf die nächste Seite setzen und nur dann teilen, wenn sie auch auf einer leeren Seite nicht passt oder die angefangene Seite sonst überwiegend leer bliebe (die Lektion beginnt im oberen Drittel, etwa unter einer Teilüberschrift oder einer Lösung); im Vorspann und in der Werkstatt MUST jeder Eintrag auf einer neuen Seite beginnen. Dicht MUST fortlaufend setzen.

#### Scenario: Kurze Glyphenlektionen
- **WENN** im ausgewogenen Satz zwei kurze Lektionen zusammen auf eine Seite passen
- **DANN** stehen beide auf derselben Seite; eine dritte, die nicht mehr ganz passt, beginnt auf der nächsten

#### Scenario: Lehrvertrag
- **WENN** das Lehrheft ausgewogen gesetzt wird
- **DANN** beginnt der Lehrvertrag auf einer eigenen Seite

#### Scenario: Erste Seite eines Teils
- **WENN** auf Teilüberschrift und Randkasten eine lange Lektion folgt
- **DANN** beginnt die Lektion noch auf dieser Seite und wird geteilt, statt die Seite leer zu lassen

