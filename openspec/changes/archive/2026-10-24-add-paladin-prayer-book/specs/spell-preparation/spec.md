## MODIFIED Requirements

### Requirement: Zauberplätze
Die App SHALL pro Grad der Klasse (Magier 0–9, Paladin 1–4) eine von Hand eingetragene Anzahl Zauberplätze speichern, je Grad optional einen Sonderplatz mit Freitext-Bedingung. Sie MUST NOT Plätze aus Klasse, Stufe oder Attributen berechnen.

#### Scenario: Plätze eintragen
- **WENN** für Grad 1 vier Plätze eingetragen werden
- **DANN** zeigt die Vorbereitung vier leere Plätze des 1. Grades

#### Scenario: Paladin
- **WENN** ein Paladin aktiv ist
- **DANN** bietet die Vorbereitung nur die Grade I bis IV an

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
