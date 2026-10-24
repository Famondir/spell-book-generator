## ADDED Requirements

### Requirement: Zauberplätze
Die App SHALL pro Grad 0–9 eine von Hand eingetragene Anzahl Zauberplätze speichern, je Grad optional einen Sonderplatz mit Freitext-Bedingung. Sie MUST NOT Plätze aus Klasse, Stufe oder Attributen berechnen.

#### Scenario: Plätze eintragen
- **WENN** für Grad 1 vier Plätze eingetragen werden
- **DANN** zeigt die Vorbereitung vier leere Plätze des 1. Grades

### Requirement: Vorbereiten
Plätze SHALL nur mit Zaubern aus dem eigenen Buch belegt werden, deren Grad höchstens dem Platzgrad entspricht; derselbe Zauber MUST mehrfach vorbereitet werden können.

#### Scenario: Doppelt vorbereitet
- **WENN** Magic Missile in zwei Plätze des 1. Grades gelegt wird
- **DANN** erscheint er zweimal und jede Kopie lässt sich einzeln abstreichen

#### Scenario: Zauber nicht im Buch
- **WENN** ein Zauber nicht im Buch steht
- **DANN** wird er bei der Vorbereitung nicht angeboten

### Requirement: Abstreichen
Ein vorbereiteter Zauber SHALL per Klick als gewirkt markiert und wieder freigegeben werden können; Zaubertricks MUST unbegrenzt nutzbar bleiben.

#### Scenario: Gewirkt
- **WENN** auf das Kästchen eines vorbereiteten Zaubers geklickt wird
- **DANN** erscheint er durchgestrichen, und die Zahl der freien Plätze seines Grades sinkt um eins

### Requirement: Neuer Tag
„Neuer Tag“ SHALL alle Abstriche zurücksetzen und die Vorbereitung behalten.

#### Scenario: Rast
- **WENN** „Neuer Tag“ gewählt wird
- **DANN** sind alle vorbereiteten Zauber wieder verfügbar

### Requirement: Gespeicherte Vorbereitungen
Die aktuelle Vorbereitung SHALL unter einem Namen gespeichert und später geladen werden können.

#### Scenario: Vorlage laden
- **WENN** die gespeicherte Vorbereitung „Dungeon“ geladen wird
- **DANN** sind die Plätze mit deren Zaubern belegt und nichts ist abgestrichen

### Requirement: Dauerhaftigkeit
Plätze, Vorbereitung, Abstriche und Vorlagen MUST einen Neustart des Browsers überstehen und im json-Export enthalten sein.

#### Scenario: Export
- **WENN** die Liste exportiert und auf einem anderen Gerät importiert wird
- **DANN** sind dort auch Plätze und Vorbereitung vorhanden
