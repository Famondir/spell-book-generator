## ADDED Requirements

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
