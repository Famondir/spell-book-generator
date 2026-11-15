## MODIFIED Requirements

### Requirement: Inhaltsquellen
Die Texte SHALL aus dem Eintrag der Gottheit in der lokalen Datei `data/vademecum.local.js` kommen, wenn sie geladen ist, sonst aus einem im Browser gespeicherten Vademecum-Eintrag dieser Gottheit (siehe `profile-transfer`): Tempel (Name, Ort, Schwerpunkt), Verfasser, Farben, Vorrede, Kapiteltexte, Feste und Sinnsprüche. Ohne Eintrag MUST das Vademecum nur aus den Gottheitsdaten (Beiname, Gesinnung, Zuständigkeiten, Domänen, Symbol, Farben) und den erzeugten Teilen bestehen. Das Repository MUST NOT Texte enthalten, die an ein bestimmtes Setting gebunden sind; die lokale Datei MUST gitignored sein.

#### Scenario: Ohne lokale Datei
- **WENN** ein Paladin der Iomedae aktiv ist und kein Eintrag für Iomedae existiert
- **DANN** enthält das Vademecum Titelblatt, „Vom Wesen“ aus den Gottheitsdaten, die Choräle und das Verzeichnis

#### Scenario: Mit lokaler Datei
- **WENN** `data/vademecum.local.js` einen Eintrag für Nethys hat und Nethys die Gottheit ist
- **DANN** tragen Titelblatt, Vorrede und Kapitel die Texte dieser Datei

#### Scenario: Gespeicherter Eintrag
- **WENN** `data/vademecum.local.js` fehlt, aber ein Vademecum-Eintrag für Nethys gespeichert ist und Nethys die Gottheit ist
- **DANN** tragen Titelblatt, Vorrede und Kapitel die Texte des gespeicherten Eintrags
