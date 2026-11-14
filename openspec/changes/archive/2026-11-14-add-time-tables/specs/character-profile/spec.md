## ADDED Requirements

### Requirement: Zeitrechnung im Profil
Das Profil SHALL im Feld `calendar` optional zusätzliche Angaben für die Tafel der Zeit zulassen: `dayNames` (sieben Tagesnamen in der Folge Sonntag bis Samstag), `signs` (Liste von Zeichen mit Id, Name, Beginn und Ende als Monat und Tag sowie optional Bild und Essenzen), `poleStar` (Name des Polarsterns auf der Sternkarte), `patrons` (zwölf Gottheits-Ids aus `data/deities.js`, in der Folge der Monate), `dayTexts` (Brauch je Tag), `monthTexts` (Text je Monat), `seasons` (Jahreszeit je Monat) und `feastHand` (Stimme aus `primer.voices`, die die Festtage nachträglich in den Jahresring gepunktet hat). Zeichen DÜRFEN weiche Trennstellen (`\u00ad`) für den Umbruch im Ring enthalten. Fehlende Felder MUST auf die neutralen Vorgaben zurückfallen; setting-eigene Werte MUST nur in `data/profile.local.js` stehen, `profile.local.example.js` MUST ein neutrales Beispiel zeigen.

#### Scenario: Lokale Zeichen
- **WENN** das lokale Profil 13 Zeichen mit Daten angibt
- **DANN** zeigen Ring und Karte diese 13 und nicht den irdischen Tierkreis

#### Scenario: Teilangaben
- **WENN** das Profil nur `patrons` setzt
- **DANN** nutzt die Tafel die Tagesnamen und den Tierkreis der Vorgaben und zeigt die Patrone
