## ADDED Requirements

### Requirement: Gemeinsame Kernzeilenwahl
Für jeden Zauber, dessen Formelsprache ausgerichtet ist, SHALL die Kernzeile Verb und Essenzwort auf den Plätzen nehmen, die für die lateinische Kernzeile gewählt wurden. Die Ziehfolge der übrigen Formelzeilen MUST dieselbe bleiben wie ohne diese Wahl. Unausgerichtete Sprachen ziehen Verb und Essenzwort weiterhin frei.

#### Scenario: Gleicher Platz in jeder Sprache
- **WENN** die lateinische Kernzeile eines Zaubers das dritte Verb seiner Schule und das zweite Wort seiner Essenz nimmt
- **DANN** nimmt seine hethitische Kernzeile ebenfalls das dritte hethitische Verb dieser Schule und das zweite hethitische Wort dieser Essenz

#### Scenario: Übrige Zeilen stabil
- **WENN** ein fremdsprachiger Zauber durch die gemeinsame Wahl eine neue Kernzeile bekommt
- **DANN** sind alle weiteren Zeilen seiner Formel und die Antworten seiner Langformel dieselben wie vorher

### Requirement: Eindeutige Formeln je Klassenliste
Auf der Zauberliste der aktiven Klasse, einschließlich der Alltagszauber, SHALL kein Zauber dieselbe Kurzformel oder dieselbe Langformel haben wie ein anderer. Bei einzeiligen Formeln MUST die Kernzeile selbst eindeutig sein, auch wenn sich die Zauber in der Dauer unterscheiden. Gesten und Komponenten dürfen sich wiederholen.

#### Scenario: Zaubertricks verschiedener Dauer
- **WENN** zwei Zaubertricks in Schule, Hauptessenz und Gestalt übereinstimmen und sich nur in der Dauer unterscheiden
- **DANN** haben sie verschiedene Kernzeilen, in jeder ausgerichteten Formelsprache

#### Scenario: Prüfung mit Profil
- **WENN** das Prüfwerkzeug für Schnellglyphen mit Profil läuft
- **DANN** meldet es keine zwei Zauber einer Klassenliste mit gleicher Kurz- oder Langformel und gibt die Kennzahlen für Gesten und Komponenten nur zur Kenntnis aus

### Requirement: Fachzeile
Auf der Zauberseite SHALL unter der Formel eines Zaubers, dessen Formelsprache nicht Latein ist, die lateinische Kernzeile als Fachformel stehen, klein und als Fachnotation erkennbar. Bei lateinischen Zaubern MUST sie fehlen.

#### Scenario: Fremdsprachiger Zauber
- **WENN** ein Zauber in Kirrans Buch auf Hethitisch steht
- **DANN** steht unter seiner Formel „Fachformel:“ mit seiner lateinischen Kernzeile, und deren Anfangsbuchstaben von Verb und Essenzwort sind die Buchstaben seiner Schnellglyphe

#### Scenario: Lateinischer Zauber
- **WENN** ein Zauber auf Latein steht
- **DANN** erscheint keine Fachzeile

### Requirement: Brückennotiz zum Kernwort
Brückennotizen SHALL bei fremdsprachigen Zaubern in ausgerichteten Sprachen das Essenzwort der gedruckten Kernzeile mit dem lateinischen Wort auf demselben Platz verbinden, wenn für das Wortpaar ein gemeinsamer Stamm hinterlegt ist; die Notiz MUST den Stamm nennen. Ohne hinterlegten Stamm MUST NOT eine Kernwort-Notiz entstehen. Lehnwörter aus dem Lateinischen bekommen keinen Stamm.

#### Scenario: Verwandte Wörter
- **WENN** ein urindogermanischer Zauber das Kernwort „gno“ auf dem Platz von lateinisch „cogito“ trägt und für das Paar der Stamm \*ǵneh₃- hinterlegt ist
- **DANN** nennt seine Randnotiz beide Wörter und den Stamm

#### Scenario: Kein Stamm
- **WENN** für das Kernwort eines Zaubers kein Stamm hinterlegt ist
- **DANN** erhält er keine Kernwort-Notiz

## MODIFIED Requirements

### Requirement: Brückennotizen
Randnotizen SHALL ein fremdes Formelwort mit einem lateinischen Wort verbinden, wenn beide einen gemeinsamen Stamm haben: als Kernwort-Notiz (siehe „Brückennotiz zum Kernwort“) oder aus einem verwandten Eintrag der Brückentabelle. Ein Tabelleneintrag MUST nur dann eine Notiz ergeben, wenn er als verwandt markiert ist und sein Wort in der gedruckten Formel vorkommt. Brückennotizen MUST nur bei Zaubern erscheinen, deren Sprache nicht Latein ist. Hat ein Zauber eine Brückennotiz, MUST sie an erster Stelle seiner Randnotizen stehen, und der Satz MUST versuchen, sie auf der ersten Seite des Zaubers unterzubringen, damit sie auch in der Normalfassung erscheint. Die Regel „höchstens eine Randnotiz je Seite, keine doppelt“ gilt weiter. Das Hinzufügen der Notiz MUST NOT die Zufallsfolge der übrigen Texte verschieben. Ihr Wortlaut ist neutral; das Profil kann eigene Vorlagen liefern (`cognate`, `coreStem`).

#### Scenario: Brücke
- **WENN** ein hethitischer Zauber das Wort „mekki“ in der Formel trägt und die Brückentabelle mekki–magnus als verwandt führt
- **DANN** steht vorn in seinen Randnotizen eine Notiz, die beide Wörter verbindet

#### Scenario: Wort nicht gedruckt
- **WENN** die Brückentabelle für eine Essenz des Zaubers einen Eintrag hat, dessen Wort in der gedruckten Formel nicht vorkommt
- **DANN** entsteht daraus keine Brückennotiz

#### Scenario: Normalfassung
- **WENN** ein mehrseitiger Zauber eine Brückennotiz hat und sie auf seiner ersten Seite Platz findet
- **DANN** steht sie dort, auch wenn eine andere Seite mehr freien Platz hätte
