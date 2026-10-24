# everyday-spells Specification

## Purpose
Kleine, harmlose Alltagszauber (im Stil von Frieren) als Hausregel-Sonderformen niedriggradiger Zauber.

## Requirements

### Requirement: Sonderform eines Basiszaubers
Jeder Alltagszauber SHALL einen Basiszauber nennen und fehlende Regelfelder (Zauberzeit, Komponenten, Reichweite, Dauer, Rettungswurf, Zauberresistenz) von ihm erben.

#### Scenario: Ohne eigene Reichweite
- **WENN** ein Alltagszauber keine Reichweite angibt
- **DANN** gilt die Reichweite des Basiszaubers

### Requirement: Quellenangabe
Der Quellenkasten eines Alltagszaubers SHALL „Hausregel“, den Basiszauber mit Quelle und den Ideengeber mit Link nennen.

#### Scenario: Idee aus einem Forum
- **WENN** ein Alltagszauber aus einem Forenthread stammt
- **DANN** verlinkt der Quellenkasten diesen Thread
