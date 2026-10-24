## ADDED Requirements

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
