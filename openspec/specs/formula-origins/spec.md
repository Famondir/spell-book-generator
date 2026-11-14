# formula-origins Specification

## Purpose
TBD - created by archiving change add-formula-languages. Update Purpose after archive.
## Requirements
### Requirement: Stationen
Das Profil SHALL eine Liste von Stationen festlegen können. Jede Station hat Kennung, Bezeichnung, Sprache, Hand (Leben) und Anteil, optional ein Gradfenster, Gewichte für Schulen und Essenzen sowie Hinweise (Quellbuch, Wortteile im Namen). Ohne Stationen im Profil MUST genau eine lateinische Station mit Anteil 100 % gelten.

#### Scenario: Neutrales Profil
- **WENN** kein lokales Profil geladen ist
- **DANN** stammen alle Zauber aus einer lateinischen Station und das Buch bleibt unverändert

### Requirement: Verteilung mit fester Quote
Die App SHALL die Zauber des Buches deterministisch so auf die Stationen verteilen, dass jede Station nach größtem Rest genau ihren Anteil erhält, und jeder Zauber an die Station geht, zu der er am besten passt (Punktzahl aus Schul- und Essenzgewicht, Gradfenster und Hinweisen). Gleiche Eingaben MUST dieselbe Verteilung ergeben. Die Verteilung MUST über das ganze Buch erfolgen, nicht je Zauber per Zufall.

#### Scenario: Quote
- **WENN** das Buch 269 Zauber hat und eine Station 12 % Anteil
- **DANN** erhält diese Station 32 Zauber

#### Scenario: Gewicht
- **WENN** eine Station Bannmagie stark gewichtet und kein anderer Wert dagegen spricht
- **DANN** gehen ihr bevorzugt Zauber der Bannmagie zu

#### Scenario: Gradfenster
- **WENN** eine Station das Fenster Grad 0–2 hat
- **DANN** erhält sie keinen Zauber des 3. oder höheren Grades

### Requirement: Festlegung je Zauber
Ein Eintrag in `data/custom_texts.js` SHALL Station oder Sprache eines Zaubers festlegen können. Festgelegte Zauber MUST auf die Quote ihrer Station angerechnet werden.

#### Scenario: Override
- **WENN** für einen Zauber die Station `osiris` festgelegt ist
- **DANN** steht seine Formel in deren Sprache, und die Station erhält einen Zauber weniger über die Verteilung

### Requirement: Herkunftszeile
Der Abschnitt „Herkunft“ SHALL bei Stationen mit anderer Sprache als Latein die Fassung nennen, mit der Sprachbezeichnung aus dem Profil (sonst der irdischen Bezeichnung). Bei Latein MUST die Zeile entfallen.

#### Scenario: Fremde Fassung
- **WENN** ein Zauber aus einer Station mit Mittelägyptisch stammt und das Profil die Sprache anders benennt
- **DANN** nennt die Herkunft die Fassung mit der Bezeichnung aus dem Profil

