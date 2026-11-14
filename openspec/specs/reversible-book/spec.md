# reversible-book Specification

## Purpose
Wendebuch für Gottheiten mit Zwiespalt: zwei Hälften mit gleichem Kapitelgerüst und eigener Seitenzählung, eine Mitte, Wenden im Betrachter und eine Druckfolge, in der die zweite Hälfte kopfüber und rückwärts steht, sodass gebunden jede Hälfte von ihrem Umschlag aus liest.

## Requirements
### Requirement: Wendebuch bei Zwiespalt
Hat die Gottheit einen Zwiespalt (dieselbe Erkennung wie bei den Gebeten: gegensätzliche Domänen oder Zuständigkeiten, oder der Profilton „dual“), SHALL das Vademecum ein Wendebuch sein: zwei Hälften mit demselben Kapitelgerüst und eine Mitte. Die lokale Datei MUST die Namen der Hälften setzen können (z. B. „Hüter“, „Zerstörer“); ohne Angabe MUST die App sie aus dem Paar des Zwiespalts bilden. Die lokale Datei MUST das Wendebuch auch abschalten können.

#### Scenario: Nethys
- **WENN** Nethys (Zerstörung und Schutz) die Gottheit ist
- **DANN** hat das Vademecum zwei Hälften mit gleichen Kapiteltiteln und eine Mitte

#### Scenario: Ohne Zwiespalt
- **WENN** Iomedae die Gottheit ist
- **DANN** ist das Vademecum ein einfaches Buch

### Requirement: Wenden im Betrachter
Der Betrachter SHALL immer eine Hälfte zeigen und einen Knopf „Buch wenden“ haben, der zur anderen Hälfte wechselt und dort die zuletzt gelesene Seite öffnet. Die Mitte MUST von beiden Hälften aus als letzte Seite erreichbar sein und in der Ansicht der jeweils anderen Hälfte kopfüber erscheinen.

#### Scenario: Wenden
- **WENN** auf Seite 12 der Hüter-Hälfte „Buch wenden“ gedrückt wird und zuvor Seite 30 der Zerstörer-Hälfte offen war
- **DANN** erscheint Seite 30 der Zerstörer-Hälfte

### Requirement: Seitenzählung je Hälfte
Jede Hälfte SHALL eigene Seitenzahlen ab 1 haben, und Verweise MUST die Hälfte kenntlich machen (Zeichen oder Kurzname der Hälfte vor der Seitenzahl). Das Inhaltsverzeichnis jeder Hälfte MUST nur ihre eigenen Kapitel und die Mitte enthalten.

#### Scenario: Verzeichnis
- **WENN** die Zerstörer-Hälfte offen ist
- **DANN** zeigt die Seitenleiste nur deren Kapitel und die Mitte

### Requirement: Druckfolge
Der Druck SHALL wahlweise das ganze Wendebuch oder eine Hälfte ausgeben. Im ganzen Wendebuch MUST erst die erste Hälfte, dann die Mitte, dann die zweite Hälfte in umgekehrter Folge und um 180° gedreht stehen, sodass gebunden jede Hälfte von ihrem Umschlag aus richtig liest. Ein Lochrand MUST bei den gedrehten Seiten auf der Bindungsseite des gebundenen Buches bleiben. Auf ungerade Gesamtzahl MUST eine Vakatseite ergänzen.

#### Scenario: Ganzes Wendebuch
- **WENN** das ganze Wendebuch mit Lochrand gedruckt wird
- **DANN** liegt nach dem Binden der Lochrand aller Seiten an derselben Kante, und die letzte gedruckte Seite ist das Titelblatt der zweiten Hälfte, kopfüber

