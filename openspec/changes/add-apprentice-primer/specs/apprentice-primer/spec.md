## ADDED Requirements

### Requirement: Lehrheft
Die App SHALL für arkane Klassen ein Lehrheft im A5-Format bereitstellen: Vorspann (Titelblatt, Vorrede des Meisters, Lehrvertrag, Hausordnung und Tagesplan, Ausrüstung, Gebrauchsanweisung), die Teile Werkstatt, Hand und Kreis, Glyphen, Zeichen der Stoffe, Schnellglyphen, Kreise lesen, Kleine Formeln und Gesellenstück sowie einen Anhang (Prüfscheibe, Pausblätter, Bewertungsbogen, Versetzungsbogen, Glossar).

#### Scenario: Lehrheft öffnen
- **WENN** ein Magier im Reiter „Lehre“ das Lehrheft wählt
- **DANN** zeigt die App links das Inhaltsverzeichnis mit Vorspann, acht Teilen und Anhang und rechts die Seiten des gewählten Teils, blätterbar wie die Buchvorschau (eine oder zwei Seiten je nach Breite, Pfeiltasten), und die Legende „Lehre der Kreise“ ist ausgeblendet

#### Scenario: Ohne Profil
- **WENN** kein lokales Profil geladen ist
- **DANN** ist das Lehrheft vollständig, nennt „den Meister“ ohne Namen und enthält keine Randnotizen von Stimmen und kein loses Blatt

### Requirement: Aufbau einer Lektion
Jede Lektion SHALL ein Lesestück, eine Aufgabe und Prüfkriterien haben; zeigt sie ein Muster, MUST es als „Ansicht des Meisters“ mit dem Hinweis „nicht nachfahren – abzeichnen“ erscheinen; ganze Kreise (Kleine Formeln, Kreise lesen) MUST so groß stehen, dass man sie ohne Lupe abzeichnen kann; in „Kreise lesen“ SHALL je Seite Platz für zwei Kreise sein, und jede kleine Formel MUST auf genau eine Seite passen (Kreis und Schrift werden dafür gemeinsam verkleinert). Die Prüfvermerke MUST NOT im Heft stehen, sondern gesammelt in einem eigenen Prüfbogen (eigener Druckauftrag, Handzettel des Meisters): je Lektion eine Zeile mit Skala 0–3 je Kriterium und einem Urteil (nondum, probatum, laudandum) mit Feld für Datum und Kürzel. Hervorgehobene Begriffe im Lesestück MUST in Rubrikfarbe stehen und am Rand sowie im Glossar erklärt werden.

#### Scenario: Begriff hervorgehoben
- **WENN** die Lektion „Die Wandelsterne“ den Begriff „Luft“ hervorhebt
- **DANN** steht „Luft“ im Lesestück in Rubrikfarbe, am Rand steht eine kurze Erklärung mit Glyphe und Essenz, und das Glossar verweist auf diese Lektion

### Requirement: Kein Übungsvordruck
Das Lehrheft MUST NOT Flächen mit vorgedruckten Linien zum Nachfahren enthalten. Vorgedruckt SHALL nur werden: Ansichten des Meisters, die Prüfscheibe, Lochpausen mit 12, 6 und 3 Stützpunkten und Bögen zum Ausfüllen.

#### Scenario: Hundert Kreise
- **WENN** die Lektion „Die hundert Kreise“ gedruckt wird
- **DANN** beschreibt sie die Aufgabe für ein eigenes Blatt oder die Wachstafel und verweist auf die Prüfscheibe im Anhang, ohne 100 vorgedruckte Kreise

### Requirement: Erzeugter Lehrstoff
Die Lektionen zu Essenzen, Schulen, Zeichen, Ecksteinen, Zeitmarken, Schnellglyphen, Kreislesen und Stoffzeichen SHALL aus den Daten der App erzeugt werden, sodass sie zu den Kreisen im Zauberbuch passen.

#### Scenario: Essenzen
- **WENN** die Lektion „Die Essenzen“ erzeugt wird
- **DANN** erscheint jede Essenz der Theorie mit derselben Glyphe wie im Essenzring der Kreise, ihrem lateinischen Namen und ihren Entsprechungen

#### Scenario: Lückenkreis
- **WENN** die Lektion „Lückenkreise“ erzeugt wird
- **DANN** steht die Aufgabe vor den Kreisen mit dem Hinweis, dass die Kreise folgen
- **DANN** zeigt sie Kreise mit je einer fehlenden Schicht, und die Lösung steht kopfüber oben auf der nächsten Seite, darunter beginnt die folgende Lektion (die Lösung steht nie allein auf einer Seite)

### Requirement: Kleine Formeln als Tagesbuch
Teil „Kleine Formeln“ SHALL jeden Zaubertrick und Alltagszauber aus dem Buch des Charakters enthalten: Kreis als Ansicht des Meisters, die Formel dreimal mit wachsenden Lücken, Geste, Stoffe mit Essenzen in Teilen, Übungsleiter (mit Buch, aus dem Gedächtnis, unter Ablenkung), drei Kästchen „dreimal in Folge“ und Prüfvermerk. Enthält das Buch keine Zaubertricks, MUST eine kleine Grundauswahl erscheinen.

#### Scenario: Zaubertrick im Buch
- **WENN** „Prestidigitation“ im Buch steht
- **DANN** hat das Lehrheft eine Lektion zu Prestidigitation mit Formel in drei Durchgängen mit wachsenden Lücken

#### Scenario: Leeres Buch
- **WENN** das Buch keinen Zaubertrick enthält
- **DANN** enthält „Kleine Formeln“ die Grundauswahl (Light, Detect Magic, Prestidigitation, Mage Hand, Message, Read Magic)

### Requirement: Essenzen in Teilen
Im Lehrheft MUST jedes Essenzprofil als Rezept in Teilen stehen, mit „knapp“, „stark“ und „schwach“ für Zwischenwerte und zusammengefassten gleichen Anteilen, nicht in Prozent.

#### Scenario: Profil als Rezept
- **WENN** ein Zauber Vis 32 %, Terra 28 %, Spatium 12 %, Vita 11 %, Aqua 9 %, Ignis 8 % hat
- **DANN** steht im Lehrheft „drei Teile Vis, knapp drei Teile Terra, je ein starkes Teil Spatium und Vita, je ein schwaches Teil Aqua und Ignis“

### Requirement: Stimmen am Rand
Das Lehrheft SHALL Randnotizen mehrerer Stimmen aus dem lokalen Profil neben den Lektionen zeigen, jede Stimme in eigener Handschrift und Tintenfarbe. Eine Notiz mit Mindeststufe MUST erst erscheinen, wenn die eingetragene Charakterstufe mindestens so hoch ist; ohne eingetragene Stufe erscheinen nur Notizen ohne Mindeststufe.

#### Scenario: Drei Stimmen
- **WENN** das Profil zur Lektion „Die hundert Kreise“ Notizen von drei Stimmen enthält
- **DANN** stehen sie in der Reihenfolge des Profils am Rand, in drei unterscheidbaren Handschriften und Tinten

#### Scenario: Freischalten
- **WENN** eine Notiz Mindeststufe 7 hat und die Charakterstufe 6 ist
- **DANN** fehlt die Notiz; nach Eintragen von Stufe 7 erscheint sie

### Requirement: Übergabe und loses Blatt
Das Profil SHALL ein Übergabeschreiben einer Stimme („An den, der nach mir liest“) direkt nach dem Titelblatt und ein loses Blatt am Ende des Anhangs setzen können. Das lose Blatt MUST als eingelegtes Blatt gestaltet sein, den Aufbau eines okkulten Rituals haben (Schule, Grad, Wirkzeit, Komponenten mit Nebenwirkern, Fertigkeitswürfe, Rückschlag, Misslingen, Wirkung) und Streichungen und Notizen anderer Stimmen tragen können; es SHALL ebenfalls eine Mindeststufe haben können.

#### Scenario: Loses Blatt mit Streichung
- **WENN** das Profil ein loses Blatt mit Mindeststufe 7 und einer Streichung durch eine zweite Stimme enthält und die Charakterstufe 7 ist
- **DANN** liegt am Ende des Anhangs das Ritualblatt schräg eingelegt, durchgestrichen, mit der Notiz der zweiten Stimme darüber

### Requirement: Lehrheft drucken
Das Lehrheft SHALL vollständig druckbar sein (alle Teile, mit Seitenzahlen und Kolumnentiteln), über den bestehenden Druckweg mit Fortschrittsanzeige und Druck-Cache.

#### Scenario: Drucken
- **WENN** „Lehrheft drucken“ geklickt wird
- **DANN** zählt die Fortschrittsanzeige die gesetzten Seiten hoch, und der Druckdialog zeigt das ganze Lehrheft im gewählten Papierformat

#### Scenario: Prüfbogen
- **WENN** „Prüfbogen drucken“ gewählt wird
- **DANN** entsteht ein eigener Druck mit einer Zeile je Lektion mit Prüfkriterien (auch je kleiner Formel), und im Lehrheft selbst steht kein Prüfkasten
