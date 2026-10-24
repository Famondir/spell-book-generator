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
