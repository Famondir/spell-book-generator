## ADDED Requirements

### Requirement: Gebete für den Tag
Hat der Charakter eine Gottheit, SHALL das Lehrheft hinter dem Anhang und vor den Alltagszaubern einen Teil „Gebete für den Tag“ enthalten (eigene Ergänzung, nicht Teil des klassischen Lehrhefts): Morgengebet und Abendgebet als feste Form (ohne Bezug auf einen bestimmten Spieltag), die Anlass-Gebete und, falls im Profil vorhanden, die Festtage mit Datum. Ohne Gottheit MUST der Teil fehlen.

#### Scenario: Magier mit Schutzgottheit
- **WENN** ein Magier mit Schutzgottheit das Lehrheft öffnet
- **DANN** enthält das Inhaltsverzeichnis den Teil „Gebete für den Tag“ mit Morgen-, Abend- und Anlass-Gebeten

#### Scenario: Ohne Gottheit
- **WENN** ein Magier ohne Gottheit das Lehrheft öffnet
- **DANN** gibt es keinen Teil „Gebete für den Tag“
