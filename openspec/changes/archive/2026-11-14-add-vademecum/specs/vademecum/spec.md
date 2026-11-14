## ADDED Requirements

### Requirement: Vademecum für Charaktere mit Gottheit
Die App SHALL für jeden Charakter mit Gottheit (göttliche Klasse oder arkane Klasse mit Schutzgottheit) ein Vademecum im Format A5 bereitstellen. Ohne Gottheit MUST es kein Vademecum geben.

#### Scenario: Magier mit Schutzgottheit
- **WENN** ein Magier mit der Gottheit Nethys den Reiter „Lehre“ öffnet
- **DANN** kann er zwischen Lehrheft und Vademecum wählen

#### Scenario: Ohne Gottheit
- **WENN** ein Magier ohne Gottheit aktiv ist
- **DANN** gibt es kein Vademecum, und der Reiter „Lehre“ zeigt wie bisher das Lehrheft

### Requirement: Kapitelgerüst
Das Vademecum SHALL das Gerüst aus `data/vademecum.js` haben: Titelblatt, Vorrede, die Kapitel I „Vom Wesen“, II „Gebete“, III „Choräle“, IV „Riten und Feste“, V „Gefolge“, VI „Heilige Werke“, VII „Geschichte des Hauses“, VIII „Vom Rang und vom Tabu“, IX „Anregungen“ (außerweltlich, als solches gekennzeichnet), ein Inhaltsverzeichnis und Vakatseiten. Ein Kapitel ohne Inhalt MUST entfallen, ohne leere Kapitelseiten zu hinterlassen.

#### Scenario: Kapitel ohne Inhalt
- **WENN** für eine Gottheit weder lokale Texte noch erzeugter Stoff zu „Heilige Werke“ vorliegen
- **DANN** fehlt das Kapitel, und die römische Zählung der übrigen Kapitel bleibt lückenlos

### Requirement: Inhaltsquellen
Die Texte SHALL aus dem Eintrag der Gottheit in der lokalen Datei `data/vademecum.local.js` kommen, wenn sie geladen ist: Tempel (Name, Ort, Schwerpunkt), Verfasser, Farben, Vorrede, Kapiteltexte, Feste und Sinnsprüche. Ohne Eintrag MUST das Vademecum nur aus den Gottheitsdaten (Beiname, Gesinnung, Zuständigkeiten, Domänen, Symbol, Farben) und den erzeugten Teilen bestehen. Das Repository MUST NOT Texte enthalten, die an ein bestimmtes Setting gebunden sind; die lokale Datei MUST gitignored sein.

#### Scenario: Ohne lokale Datei
- **WENN** ein Paladin der Iomedae aktiv ist und kein Eintrag für Iomedae existiert
- **DANN** enthält das Vademecum Titelblatt, „Vom Wesen“ aus den Gottheitsdaten, die Choräle und das Verzeichnis

#### Scenario: Mit lokaler Datei
- **WENN** `data/vademecum.local.js` einen Eintrag für Nethys hat und Nethys die Gottheit ist
- **DANN** tragen Titelblatt, Vorrede und Kapitel die Texte dieser Datei

### Requirement: Tempelfarben
Hat die lokale Datei Tempelfarben, SHALL das Vademecum Zierrat, Kapitelköpfe und Initialen in diesen Farben setzen; sonst MUST es die heiligen Farben der Gottheit verwenden.

#### Scenario: Haus am Rande des Jenseits
- **WENN** die lokale Datei Lapis, Indigo und Gold angibt
- **DANN** erscheinen Kapitelköpfe und Initialen in diesen Tönen statt in Schwarz und Weiß

### Requirement: Festkalender
Das Kapitel „Riten und Feste“ SHALL die Feste aus der lokalen Datei und aus dem Profil mit Tag und Monat im Kalender der App (Monatsnamen aus dem Profil, sonst neutral) aufführen, nach Datum geordnet.

#### Scenario: Feste im Monat Neth
- **WENN** die lokale Datei Feste am 8., 18. und 28. des zehnten Monats nennt und das Profil die Monatsnamen enthält
- **DANN** stehen sie als „8. Neth“, „18. Neth“ und „28. Neth“ in dieser Reihenfolge

### Requirement: Randnotizen und Verweise
Das Vademecum SHALL Randnotizen der Profilstimmen zeigen, jede in eigener Hand und Tinte und mit Mindeststufe wie im Lehrheft. Eine Notiz SHALL auf eine Textstelle (auch der anderen Hälfte) verweisen können; die Seitenzahl des Ziels MUST nach dem Satz eingesetzt werden.

#### Scenario: Verweis auf die andere Hälfte
- **WENN** Antalias Notiz in Kapitel I der Hüter-Hälfte auf eine Stelle in Kapitel I der Zerstörer-Hälfte verweist
- **DANN** nennt die Notiz die Seite, auf der diese Stelle im gesetzten Buch steht, mit dem Zeichen der anderen Hälfte

#### Scenario: Stufe zu niedrig
- **WENN** eine Notiz Kirrans Mindeststufe 7 hat und die Charakterstufe 6 ist
- **DANN** erscheint die Notiz nicht

### Requirement: Betrachten und Drucken
Das Vademecum SHALL denselben Seitenbetrachter, ein Inhaltsverzeichnis in der Seitenleiste und den Druck mit Fortschrittsanzeige wie das Lehrheft nutzen, mit Seitenzahlen und Kolumnentiteln, wahlweise mit Lochrand.

#### Scenario: Drucken
- **WENN** „Vademecum drucken“ gewählt wird
- **DANN** entsteht ein A5-Druck aller Seiten mit Seitenzahlen und Kolumnentiteln
