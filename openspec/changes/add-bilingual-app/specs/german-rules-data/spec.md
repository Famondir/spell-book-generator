## ADDED Requirements

### Requirement: Lokaler Import deutscher Zauberdaten
Ein Werkzeug (`tools/import-rules-de.mjs`) SHALL aus lokal vorliegenden deutschen Zauberlisten (MyPFDB-PDFs in `spells/`) Einträge mit Name, Quelle, Schule, Graden, Zeitaufwand, Komponenten, Reichweite, Ziel/Bereich/Effekt, Wirkungsdauer, Rettungswurf, Zauberresistenz und Regeltext gewinnen. Es MUST eine gitignorierte Datei `data/rules.de.local.js` und eine gitignorierte Prüfliste schreiben.

#### Scenario: Import
- **WENN** `node tools/import-rules-de.mjs` mit den PDFs in `spells/` läuft
- **DANN** entsteht `data/rules.de.local.js`, und die Ausgabe nennt die Zahl der eindeutig, mehrdeutig und gar nicht zugeordneten Einträge

### Requirement: Zuordnung per Fingerabdruck
Deutsche Einträge SHALL englischen Zaubern über einen Fingerabdruck aus Schule, Unterschule, Graden je Klasse, Komponenten, Zeitaufwand, Reichweite, Dauer, Rettungswurf, Zauberresistenz und Quellbuch zugeordnet werden. Nur eindeutige Treffer (über einer Schwelle und mit Abstand zum zweiten) MUST übernommen werden; mehrdeutige und fehlende MUST in der Prüfliste stehen. Handzuordnungen aus dem lokalen Profil MUST Vorrang haben.

#### Scenario: Mehrdeutiger Treffer
- **WENN** zwei englische Zauber gleich gut zu einem deutschen Eintrag passen
- **DANN** wird keiner übernommen, und beide stehen mit Punktzahl in der Prüfliste

#### Scenario: Handzuordnung
- **WENN** das lokale Profil `rulesDe.overrides: { "Magisches Geschoss": "magic-missile" }` enthält
- **DANN** gilt diese Zuordnung unabhängig von der Punktzahl

### Requirement: Deutsche Regeldaten in der App
Liegt `data/rules.de.local.js` vor und gilt `rulesLang = de`, SHALL die App deutsche Zaubernamen, Werte und Regeltexte zeigen (Regeltext auf Abruf, Regelband, Suche). Fehlt ein Zauber in den deutschen Daten, MUST die Begriffsübersetzung mit englischem Regeltext erscheinen. Ohne die Datei MUST die App unverändert laufen.

#### Scenario: Feuerball auf Deutsch
- **WENN** deutsche Regeldaten vorliegen, `rulesLang = de` gilt und der Regeltext von Fireball aufgerufen wird
- **DANN** erscheinen „Feuerball“, die deutschen Werte und der deutsche Regeltext mit Quellangabe

#### Scenario: Ohne Datei
- **WENN** `data/rules.de.local.js` fehlt und `rulesLang = de` gilt
- **DANN** erscheinen übersetzte Begriffe mit englischem Regeltext und ein Hinweis, wie deutsche Regeltexte eingebunden werden

### Requirement: Übersetzte Regelbegriffe
Ohne deutsche Regeldaten SHALL `rulesLang = de` die Werte der englischen Daten regelbasiert übersetzen: Schulen, Unterschulen, Deskriptoren, Zeitaufwand, Komponenten-Kürzel, Reichweiten, Bereiche, Dauer, Rettungswurf und ZR. Nicht erkannte Werte MUST englisch bleiben und gezählt werden; über alle Zauber MUST die Abdeckung mindestens 95 % der Werte betragen.

#### Scenario: Rettungswurf
- **WENN** ein Zauber den Rettungswurf „Will negates (harmless)“ hat
- **DANN** erscheint „Willen, keine Wirkung (harmlos)“
