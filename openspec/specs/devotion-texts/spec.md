# devotion-texts Specification

## Purpose
TBD - created by archiving change add-devotion-journal. Update Purpose after archive.
## Requirements
### Requirement: Morgengebet
Für jeden Spieltag eines Charakters mit Gottheit SHALL die App ein Morgengebet erzeugen, das dem Ablauf des Morgens folgt: Anrufung, optional Buch holen, Andacht, Vorbereitung, optional Buch zurücksenden, Schluss. Die Schritte und ihre Texte MUST aus dem Profil kommen können; ohne Profilangaben MUST ein neutraler Ablauf ohne Buchschritte gelten. Das Gebet MUST deterministisch je Spieltag sein.

#### Scenario: Ablauf aus dem Profil
- **WENN** das Profil die Schritte „Buch holen“ und „Buch zurücksenden“ mit eigenen Texten festlegt
- **DANN** enthält das Morgengebet diese Schritte in dieser Reihenfolge, zwischen ihnen die Andacht und die Vorbereitung

#### Scenario: Ohne Profil
- **WENN** kein lokales Profil geladen ist und der Charakter eine Gottheit hat
- **DANN** besteht das Morgengebet aus Anrufung, Bitte um Klarheit beim Vorbereiten und Schluss, ohne Buchschritte

#### Scenario: Gleicher Tag, gleicher Text
- **WENN** das Morgengebet desselben Spieltages zweimal erzeugt wird
- **DANN** ist der Text beide Male gleich

### Requirement: Abendgebet aus der Rückschau
Das Abendgebet SHALL auf das Protokoll des Spieltages Bezug nehmen: auf gewirkte Zauber (mindestens den meistgewirkten mit Namen), auf ungenutzte Plätze und, wenn das Protokoll es vermerkt, auf vertauschte Zauber. Es MUST mit einer Bitte ums Behalten des Gelernten schließen. Ein Profilschritt „Buch zum Studium“ MUST als optionaler Teil erscheinen können.

#### Scenario: Tag mit Wirkungen
- **WENN** am Spieltag Magic Missile zweimal und Shield einmal gewirkt wurde
- **DANN** nennt das Abendgebet Magic Missile und dankt für das Gewirkte

#### Scenario: Ruhiger Tag
- **WENN** am Spieltag kein Zauber gewirkt wurde
- **DANN** spricht das Abendgebet von ungenutzten Formeln, die zurückgegeben werden, und bittet ums Behalten

#### Scenario: Studium am Abend
- **WENN** das Profil den Abendschritt „Buch zum Studium“ festlegt
- **DANN** enthält das Abendgebet diesen Schritt vor der Bitte ums Behalten

### Requirement: Anlass-Gebete
Die App SHALL kurze Gebete zu festen Anlässen erzeugen: vor dem Entziffern, nach einem misslungenen Wurf, vor dem Bannen, beim Abschreiben eines Zaubers, für die Toten und an Festtagen. Jedes MUST aus höchstens vier Zeilen bestehen und die Gottheit beim Namen oder Beinamen anrufen. Das Profil MUST einzelne Anlass-Gebete durch eigene Texte ersetzen können.

#### Scenario: Entziffern
- **WENN** das Anlass-Gebet „vor dem Entziffern“ erzeugt wird
- **DANN** ruft es die Gottheit an und bittet darum, die alte Schrift zu lesen

#### Scenario: Eigener Text
- **WENN** das Profil für „für die Toten“ einen eigenen Text festlegt
- **DANN** erscheint dieser Text statt des erzeugten

### Requirement: Festtage
Festtage SHALL im Profil mit Tag, Monat (aus dem Profilkalender), Name und Anlass stehen können. Fällt ein Spieltag auf einen Festtag, MUST das Morgengebet den Festtag nennen und das Festtagsgebet enthalten.

#### Scenario: Festtag
- **WENN** das Profil am 8. Tag des neunten Monats einen Festtag der Schutzmagie festlegt und der Spieltag auf dieses Datum fällt
- **DANN** nennt das Morgengebet den Festtag und enthält dessen Gebet

#### Scenario: Gewöhnlicher Tag
- **WENN** der Spieltag auf keinen Festtag fällt
- **DANN** enthält das Morgengebet kein Festtagsgebet

### Requirement: Gebete ohne Paizo-Texte
Alle erzeugten Gebete MUST aus eigenen Bausteinen und den beschreibenden Feldern der Gottheit entstehen; Gehorsamsrituale, Gebete oder Aphorismen aus Quellenbüchern MUST NOT übernommen werden.

#### Scenario: Prüfung der Bausteine
- **WENN** die Bausteine der Tagesgebete durchgesehen werden
- **DANN** enthält keiner einen Satz aus einem Quellenbuch, und Eigennamen stammen nur aus `deities.js` oder dem lokalen Profil

