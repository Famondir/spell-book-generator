# spell-preparation Specification

## Purpose
TBD - created by archiving change add-spell-preparation. Update Purpose after archive.
## Requirements
### Requirement: Zauberplätze
Die App SHALL pro Grad der Klasse (Magier 0–9, Paladin 1–4) eine von Hand eingetragene Anzahl Zauberplätze speichern, je Grad optional einen Sonderplatz mit Freitext-Bedingung. Sie MUST NOT Plätze aus Klasse, Stufe oder Attributen berechnen.

#### Scenario: Plätze eintragen
- **WENN** für Grad 1 vier Plätze eingetragen werden
- **DANN** zeigt die Vorbereitung vier leere Plätze des 1. Grades

#### Scenario: Paladin
- **WENN** ein Paladin aktiv ist
- **DANN** bietet die Vorbereitung nur die Grade I bis IV an

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

### Requirement: Joker-Platz
Die App SHALL für Magier optional Joker-Plätze mit Höchstgrad anbieten; beim Wirken MUST ein beliebiger Buchzauber bis zu diesem Grad gewählt werden können, der den Joker verbraucht. Für andere Klassen MUST NOT ein Joker angeboten werden.

#### Scenario: Arkane Verbindung
- **WENN** ein Joker-Platz mit Höchstgrad 3 frei ist und Fireball gewirkt wird
- **DANN** ist der Joker verbraucht und Fireball im Tagesverlauf vermerkt

### Requirement: Neuer Tag
„Neuer Tag“ SHALL alle Abstriche und Joker zurücksetzen und die Vorbereitung behalten; bei göttlichen Klassen MUST die Schaltfläche „Gebetsstunde“ heißen und dasselbe tun.

#### Scenario: Rast
- **WENN** „Neuer Tag“ gewählt wird
- **DANN** sind alle vorbereiteten Zauber wieder verfügbar

### Requirement: Gespeicherte Vorbereitungen
Die aktuelle Vorbereitung SHALL unter einem Namen gespeichert und später geladen werden können.

#### Scenario: Vorlage laden
- **WENN** die gespeicherte Vorbereitung „Dungeon“ geladen wird
- **DANN** sind die Plätze mit deren Zaubern belegt und nichts ist abgestrichen

### Requirement: Nutzungsprotokoll
Die App SHALL jedes Vorbereiten, Entfernen, Wirken, Zurücknehmen und jeden Tageswechsel mit Zeitstempel, Zauber und Platzgrad protokollieren; auch Zaubertricks und Joker MUST beim Wirken protokolliert werden.

#### Scenario: Zaubertrick gewirkt
- **WENN** bei einem vorbereiteten Zaubertrick „gewirkt“ gewählt wird
- **DANN** entsteht ein Protokolleintrag, und der Zaubertrick bleibt verfügbar

#### Scenario: Abstrich zurückgenommen
- **WENN** ein Abstrich wieder entfernt wird
- **DANN** protokolliert die App eine Rücknahme, sodass der Zauber nicht als gewirkt zählt

### Requirement: Dauerhaftigkeit
Plätze, Vorbereitung, Abstriche, Vorlagen und Protokoll MUST einen Neustart des Browsers überstehen und im json-Export enthalten sein.

#### Scenario: Export
- **WENN** die Liste exportiert und auf einem anderen Gerät importiert wird
- **DANN** sind dort auch Plätze und Vorbereitung vorhanden

### Requirement: Ingame-Datum
Jeder Spieltag SHALL ein Ingame-Datum aus Tag, Monat (Namen aus dem Profilkalender) und Jahr haben können; „Neuer Tag“ MUST es um einen Tag weiterzählen, mit Monatslängen aus dem Profil.

#### Scenario: Monatswechsel
- **WENN** der Tag auf „31. Arodus 4713 AR“ steht und „Neuer Tag“ gewählt wird
- **DANN** steht der neue Tag auf „1. Rova 4713 AR“

#### Scenario: Jahreswechsel
- **WENN** der Tag auf dem letzten Tag des letzten Monats steht und „Neuer Tag“ gewählt wird
- **DANN** beginnt der erste Monat und die erste Zahl im Jahr erhöht sich um eins

### Requirement: Tageskennung im Protokoll
Jedes Protokollereignis SHALL die Kennung seines Spieltages tragen; ältere Ereignisse ohne Kennung MUST beim Laden anhand der Tageswechsel zugeordnet werden.

#### Scenario: Altes Protokoll
- **WENN** ein Protokoll aus der Zeit vor diesem Change geladen wird
- **DANN** erscheinen seine Ereignisse im Verlauf unter den richtigen Tagen

