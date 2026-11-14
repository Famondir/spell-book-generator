# character-profile Specification

## Purpose
Trennung von neutralem Standard und persönlicher Backstory.
## Requirements
### Requirement: Profile
`data/profile.js` SHALL ein neutrales Profil enthalten; `data/profile.local.js` (gitignored) MUST einzelne Felder überschreiben, ohne dass die App ohne diese Datei bricht.

#### Scenario: Ohne lokales Profil
- **WENN** `data/profile.local.js` fehlt
- **DANN** läuft die App mit dem neutralen Profil

### Requirement: Platzhalter
Profiltexte SHALL die Platzhalter {owner}, {name}, {essence} und {school} unterstützen.

#### Scenario: Randnotiz
- **WENN** eine Profilnotiz {essence} enthält
- **DANN** steht dort die Hauptessenz des Zaubers

### Requirement: Eigene Alltagszauber
Das Profil SHALL Alltagszauber ergänzen, ausblenden und ihren Flavour-Text ersetzen können.

#### Scenario: Ausblenden
- **WENN** ein Name in `everyday.remove` steht
- **DANN** fehlt dieser Alltagszauber im Verzeichnis

### Requirement: Mehrere lokale Profile
`data/profile.local.js` SHALL neben `PROFILE_LOCAL` mehrere Profile als `PROFILES_LOCAL = { schlüssel: { label, … } }` registrieren können; jeder Charakter MUST eines davon oder das neutrale Profil wählen können.

#### Scenario: Profil wählen
- **WENN** ein Charakter das Profil „mirla“ wählt
- **DANN** erscheinen nach dem Neuladen Randnotizen, Kalender und Kosmologie aus diesem Profil

### Requirement: Lehrheft im Profil
Das Profil SHALL unter `primer` den Titel des Lehrhefts, Name und Vorrede des Meisters, ein Übergabeschreiben, Stimmen (Kürzel, Handschrift, Tinte), Randnotizen je Lektion mit optionaler Mindeststufe, eigene Randkästen und ein loses Blatt festlegen können. Ein im Profil gesetzter Name des Meisters MUST nur gelten, solange in den Einstellungen keiner eingetragen ist.

#### Scenario: Meister aus dem Profil
- **WENN** das Profil den Meister „Meisterin Varia Schildglanz“ nennt und in den Einstellungen kein Name steht
- **DANN** unterschreibt die Vorrede mit diesem Namen

#### Scenario: Beispielprofil
- **WENN** jemand `data/profile.local.example.js` öffnet
- **DANN** findet er ein neutrales Beispiel für `primer` mit einer Stimme, zwei Randnotizen und einem kurzen losen Blatt

### Requirement: Formelsprachen im Profil
Das Profil SHALL optional festlegen: Stationen, Bezeichnungen der Sprachen im Spiel (Zuordnung Leihsprache → Name), Zuschläge je Hand, tote Sprachen, voreingestellte beherrschte Sprachen und das Einschalten der Hausregel „Entziffern“. Setting-eigene Namen MUST nur in `data/profile.local.js` stehen; `profile.local.example.js` MUST ein neutrales Beispiel zeigen.

#### Scenario: Lokale Bezeichnung
- **WENN** das lokale Profil Mittelägyptisch einen eigenen Namen gibt
- **DANN** erscheint überall dieser Name, im Repository aber nur die irdische Bezeichnung

### Requirement: Zeitrechnung im Profil
Das Profil SHALL im Feld `calendar` optional zusätzliche Angaben für die Tafel der Zeit zulassen: `dayNames` (sieben Tagesnamen in der Folge Sonntag bis Samstag), `signs` (Liste von Zeichen mit Id, Name, Beginn und Ende als Monat und Tag sowie optional Bild und Essenzen), `poleStar` (Name des Polarsterns auf der Sternkarte), `patrons` (zwölf Gottheits-Ids aus `data/deities.js`, in der Folge der Monate), `dayTexts` (Brauch je Tag), `monthTexts` (Text je Monat), `seasons` (Jahreszeit je Monat) und `feastHand` (Stimme aus `primer.voices`, die die Festtage nachträglich in den Jahresring gepunktet hat). Zeichen DÜRFEN weiche Trennstellen (`\u00ad`) für den Umbruch im Ring enthalten. Fehlende Felder MUST auf die neutralen Vorgaben zurückfallen; setting-eigene Werte MUST nur in `data/profile.local.js` stehen, `profile.local.example.js` MUST ein neutrales Beispiel zeigen.

#### Scenario: Lokale Zeichen
- **WENN** das lokale Profil 13 Zeichen mit Daten angibt
- **DANN** zeigen Ring und Karte diese 13 und nicht den irdischen Tierkreis

#### Scenario: Teilangaben
- **WENN** das Profil nur `patrons` setzt
- **DANN** nutzt die Tafel die Tagesnamen und den Tierkreis der Vorgaben und zeigt die Patrone

