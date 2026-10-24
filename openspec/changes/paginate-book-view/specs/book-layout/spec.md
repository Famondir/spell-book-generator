## ADDED Requirements

### Requirement: Blätterbare Buchvorschau
Die Buchvorschau SHALL je nach verfügbarer Breite eine oder zwei Seiten zeigen und blättern lassen (vor, zurück, Anfang, Ende, Seitenzahl); Blättern MUST um so viele Seiten weitergehen, wie angezeigt werden. Intern MUST die Vorschau alle Seiten der betroffenen Zauber setzen, damit die Seitenfüllung dem Druck entspricht.

#### Scenario: Großes Buch öffnen
- **WENN** ein Buch mit 269 Zaubern geöffnet wird
- **DANN** baut die Vorschau nur den ersten Ausschnitt auf, und die Oberfläche bleibt bedienbar

#### Scenario: Doppelseite
- **WENN** Platz für zwei Seiten ist und weitergeblättert wird
- **DANN** erscheinen die nächsten zwei Seiten

### Requirement: Inhaltsliste des Buches
Neben der Vorschau SHALL eine Liste aller Buchzauber mit Schnellglyphe, Grad, Name, Titel und Seitenzahl stehen, filterbar wie das Verzeichnis (Suche, Grad, Schule, Essenz, Herkunft) und in derselben Zeilenform. Ein Klick MUST zur Seite des Zaubers blättern; der Knopf − MUST ihn aus dem Buch entfernen.

#### Scenario: Zauber entfernen
- **WENN** beim Zauber „Grease“ − geklickt wird
- **DANN** ist Grease nicht mehr im Buch, und Liste und Seitenzahlen sind aktualisiert

#### Scenario: Springen
- **WENN** in der Liste „Fireball“ angeklickt wird
- **DANN** zeigt die Vorschau den Ausschnitt mit den Seiten von Fireball

### Requirement: Einklappbare Seitenleisten
Die Filterleiste im Verzeichnis und in der Buchansicht SHALL sich nach links einklappen lassen; das Inhaltsverzeichnis der Buchansicht SHALL rechts ein- und ausklappbar sein. Der Zustand MUST erhalten bleiben.

#### Scenario: Filterleiste einklappen
- **WENN** die Filterleiste eingeklappt wird
- **DANN** bleibt nur ein schmaler Streifen mit Ausklapp-Knopf, und die Vorschau nutzt die Breite

#### Scenario: Inhaltsverzeichnis ausklappen
- **WENN** rechts das Inhaltsverzeichnis ausgeklappt und ein Eintrag angeklickt wird
- **DANN** blättert die Vorschau zur Seite dieses Eintrags
