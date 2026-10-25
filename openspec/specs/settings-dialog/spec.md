# settings-dialog Specification

## Purpose
Aufbau und Bedienung des Einstellungsdialogs in Abschnitten.
## Requirements
### Requirement: Abschnitte des Einstellungsdialogs
Der Einstellungsdialog SHALL in die Abschnitte „Charakter“, „Buch“, „Druck“ und „Bestand & Export“ gegliedert sein; es MUST immer genau ein Abschnitt sichtbar sein. Jede bisherige Einstellung MUST genau einem Abschnitt angehören:
- Charakter: Name, Profil, Klasse, Gottheit, Andachtsbild, Nur Zauber der Klassenliste, Charakter anlegen/duplizieren/löschen
- Buch: Besitzer, Buchtitel, Untertitel, Vorspann, Kapitel je Grad, Beginn links, Ausführliche Fassung, Regelverweise
- Druck: Papierformat, Format für Schriftrollen, Pergament-Hintergrund, Seiten je Band
- Bestand & Export: Liste exportieren, Liste importieren, Buch leeren

#### Scenario: Abschnitt wechseln
- **WENN** im geöffneten Dialog „Druck“ gewählt wird
- **DANN** zeigt der Dialog nur Papierformat, Schriftrollen, Hintergrund und Seiten je Band, und „Druck“ ist in der Abschnittsliste hervorgehoben

#### Scenario: Paladin
- **WENN** ein Paladin aktiv ist
- **DANN** fehlen im Abschnitt „Buch“ die nur arkanen Einstellungen (Beginn links, Ausführliche Fassung) wie bisher, und „Charakter“ zeigt Gottheit und Andachtsbild

### Requirement: Navigation wie Buchkapitel
Auf breiten Bildschirmen SHALL die Abschnittsliste links neben dem Inhalt stehen; unterhalb von 640 px Breite MUST sie als Reiterreihe über dem Inhalt erscheinen. Der Dialog MUST eine feste Höhe haben, damit er beim Wechsel nicht springt; nur der Inhalt scrollt, „Fertig“ bleibt immer sichtbar.

#### Scenario: Schmaler Bildschirm
- **WENN** der Dialog auf einem 400 px breiten Bildschirm geöffnet wird
- **DANN** stehen die Abschnitte als Reiter oben, ohne waagerechtes Scrollen der Seite

#### Scenario: Langer Abschnitt
- **WENN** der Abschnitt „Charakter“ eines Paladins höher ist als der Dialog
- **DANN** scrollt nur der Inhaltsbereich, Abschnittsliste und „Fertig“ bleiben stehen

### Requirement: Gemerkter Abschnitt
Der Dialog SHALL beim Öffnen den zuletzt gewählten Abschnitt zeigen (gespeichert im Browser); beim ersten Öffnen MUST „Charakter“ gewählt sein.

#### Scenario: Wieder öffnen
- **WENN** der Dialog im Abschnitt „Druck“ geschlossen und später wieder geöffnet wird
- **DANN** ist „Druck“ gewählt

### Requirement: Unverändertes Übernehmen
Werte SHALL weiterhin beim Schließen des Dialogs übernommen werden, aus allen Abschnitten, auch aus gerade nicht sichtbaren. Beschriftungen MUST NOT „drucken“ sagen, wenn die Einstellung auch die Vorschau ändert.

#### Scenario: Änderungen in zwei Abschnitten
- **WENN** im Abschnitt „Buch“ der Titel und im Abschnitt „Druck“ das Papierformat geändert und dann „Fertig“ geklickt wird
- **DANN** sind beide Änderungen gespeichert

#### Scenario: Vorspann
- **WENN** der Abschnitt „Buch“ angezeigt wird
- **DANN** heißt die Einstellung „Vorspann (Titelblatt, Lehre der Kreise, Verzeichnis)“ und nicht „Vorspann drucken“

