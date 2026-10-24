# magic-circle Specification

## Purpose
Klassisch-arkane Magierkreise als SVG, abgeleitet aus dem Modell der Magietheorie.

## Requirements

### Requirement: Kreisschichten
Der Kreis SHALL aus Schichten bestehen: Grundform, äußeres Band mit Text, Schwellentore (Rettungswurf), Siegelband (Zauberresistenz), Ordnungsknoten (Grad), Reichweitenringe, Zeichenring, Essenzring, Dauerring, Kernsigille, Komponenten- und Zauberzeitmarken.

#### Scenario: Grad sichtbar
- **WENN** ein Zauber des 3. Grades gezeichnet wird
- **DANN** trägt der Ordnungsring drei Knoten

### Requirement: Lesbares Band
Schwellentore MUST den Bandtext aussparen; der Text MUST ohne Unterstreichung und an Wortgrenzen gekürzt erscheinen.

#### Scenario: Tor im Band
- **WENN** ein Zauber einen Rettungswurf hat
- **DANN** wird der Bandtext an den Toren geteilt und kein Tor überdeckt Buchstaben

### Requirement: Großansicht und Export
Ein Klick auf einen Kreis SHALL ihn in einem großen Fenster zeigen, mit umschaltbarer nummerierter Beschriftung (ohne Überlappungen) und SVG-Export.

#### Scenario: SVG speichern
- **WENN** im Fenster „Als SVG speichern“ gewählt wird
- **DANN** wird eine eigenständige SVG-Datei mit eingebetteten Stilen gespeichert

### Requirement: Schnellglyphen
Jeder Zauber SHALL eine einfache Schnellglyphe haben, die sich am Spieltisch in Sekunden zeichnen lässt.

#### Scenario: Verzeichnis
- **WENN** die Zauberliste angezeigt wird
- **DANN** steht neben jedem Zauber seine Schnellglyphe

### Requirement: Mythische Schicht
Für mythisch verstärkbare Zauber SHALL eine mythische Kreisvariante (doppelter Außenring, Mythenpunkt im Kern) verfügbar sein.

#### Scenario: Mythischer Zauber
- **WENN** ein Zauber eine mythische Fassung hat
- **DANN** kann der Kreis mit mythischer Schicht gezeichnet werden
