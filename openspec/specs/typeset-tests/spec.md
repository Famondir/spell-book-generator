# typeset-tests Specification

## Purpose
TBD - created by archiving change add-typeset-tests. Update Purpose after archive.
## Requirements
### Requirement: Satz-Testlauf ohne Abhängigkeiten
Das Repository SHALL einen Testlauf `tools/test-browser.mjs` enthalten, der mit Node ab Version 22 und einem installierten Chrome oder Chromium ohne `npm install` läuft. Er MUST die App über `index.html` per `file://` laden, alle Testfälle setzen, je Fall eine Zeile mit Ergebnis, Seitenzahl und Dauer ausgeben und mit Exit-Code 0 nur dann enden, wenn alle Fälle bestanden sind. Mit `--only <Muster>` MUST er nur die passenden Fälle laufen lassen. Findet er kein Chrome, MUST er das mit einem Hinweis auf die Umgebungsvariable `CHROME` melden.

#### Scenario: Alles in Ordnung
- **WENN** `node tools/test-browser.mjs` auf einem unveränderten Stand läuft
- **DANN** meldet jede Zeile „ok“, am Ende steht die Zahl der Fälle, und der Exit-Code ist 0

#### Scenario: Ein Fall bricht
- **WENN** eine Seite in einem Fall überläuft
- **DANN** meldet die Zeile dieses Falls den Fehler mit Seitennummer, und der Exit-Code ist 1

#### Scenario: Kein Chrome
- **WENN** weder `google-chrome` noch `chromium` gefunden wird und `CHROME` nicht gesetzt ist
- **DANN** bricht der Lauf mit einer verständlichen Meldung ab, ohne Fälle als bestanden zu zählen

### Requirement: Testfälle
Die Testfälle SHALL in `tools/test-cases.mjs` als Daten stehen: ein Testbuch (Liste von Zaubernamen oder eine benannte Auswahl), Einstellungen, Klasse und Druckauftrag (Buch, Regelband, Schriftrollen, Lehrheft, Prüfbogen). Es MUST mindestens Fälle geben für: leeres, kleines und großes Buch (alle Zaubertricks und Alltagszauber); Papier A5, A4 und A4 quer; Kapitel aus; Beginn links; ausführliche Fassung; Seiten je Band; Lehrheft mit und ohne Lochrand; Paladin mit Gebetbuch. Der Name eines Falls MUST eindeutig und lesbar sein (z. B. `buch-klein-a5`).

#### Scenario: Neuer Fall
- **WENN** in `tools/test-cases.mjs` ein Fall ergänzt wird
- **DANN** läuft er beim nächsten Aufruf mit, und ohne Sollwert meldet der Lauf „neu, kein Sollwert“ statt eines Fehlers

### Requirement: Feste Regeln
Für jeden Fall SHALL der Testlauf unabhängig von Sollwerten prüfen:
- keine Seite läuft über (Inhalt höher als die Seite)
- die Seitenzahlen sind fortlaufend, wo die App fortlaufend zählt
- keine Folgeseite ist leer
- keine Überschrift mit `.keep-next` steht als letztes Element am Seitenende
- im Lehrheft steht jede kleine Formel auf genau einer Seite
- mit Lochrand haben ungerade Seiten den Rand links und gerade rechts, und jede Seite mit `.recto-start` hat eine ungerade Nummer
- mit Seiten je Band hat kein Band mehr Seiten als eingestellt (außer bei einem gemeldeten geteilten Kapitel)

Jede verletzte Regel MUST mit Name der Regel und Seitennummer gemeldet werden.

#### Scenario: Verwaiste Überschrift
- **WENN** eine Lektionsüberschrift allein unten auf Seite 7 steht
- **DANN** meldet der Fall „keep-next: Seite 7“ und gilt als nicht bestanden

### Requirement: Sollwerte und Vergleich
Der Testlauf SHALL je Fall Seitenzahl und Fingerabdruck der Umbrüche mit `tools/test-baseline.json` vergleichen. Der Fingerabdruck MUST je Seite festhalten, womit sie beginnt (Zauber, Lektion oder ein kurzer Textanfang), sodass verschobene Umbrüche erkannt werden. Bei Abweichung MUST die erste abweichende Seite mit Soll und Ist gemeldet werden. Mit `--update` MUST der Lauf die Sollwerte der gelaufenen Fälle überschreiben und das ausgeben; ohne `--update` MUST er die Datei nie ändern. Die Sollwerte MUST die Chrome-Hauptversion festhalten; weicht sie ab, MUST der Lauf darauf hinweisen.

#### Scenario: Umbruch verschoben
- **WENN** nach einer Änderung Lektion 21 auf Seite 12 statt 11 beginnt
- **DANN** meldet der Fall „Umbruch ab Seite 11: Soll Lektion 21, Ist Lektion 20 (Forts.)“ und gilt als nicht bestanden

#### Scenario: Bewusst übernehmen
- **WENN** `node tools/test-browser.mjs --update --only lehrheft` läuft
- **DANN** sind danach nur die Sollwerte der Lehrheft-Fälle neu, und der nächste Lauf ohne `--update` besteht

### Requirement: Zeitgrenze
Jeder Fall SHALL eine Zeitgrenze für das Setzen haben (Vorgabe aus dem Fall oder allgemein). Überschreitet ein Fall seine Grenze, MUST der Lauf ihn als nicht bestanden melden, mit gemessener Dauer und Grenze. Die Grenzen MUST großzügig genug sein, dass ein üblicher Rechner sie ohne Last sicher einhält.

#### Scenario: Rückfall beim Tempo
- **WENN** das Setzen von „Kleine Formeln“ wieder 14 Sekunden dauert und die Grenze 5 Sekunden ist
- **DANN** meldet der Fall „zu langsam: 14,0 s (Grenze 5 s)“

### Requirement: Neutrale Umgebung
Der Testlauf SHALL jedes Mal ein frisches, temporäres Browserprofil nutzen und den `localStorage` des Nutzers nicht lesen oder ändern. `data/profile.local.js` MUST ausgeblendet sein, sodass die neutralen Inhalte geprüft werden; mit `--with-profile` MUST das lokale Profil geladen werden, und die Sollwerte MUST dann getrennt geführt werden. Fenstergröße und Pixeldichte MUST fest sein.

#### Scenario: Persönliches Profil vorhanden
- **WENN** `data/profile.local.js` Randnotizen enthält und der Lauf ohne `--with-profile` startet
- **DANN** enthält kein gesetztes Lehrheft diese Notizen, und die Sollwerte gelten auch auf einem Rechner ohne lokales Profil

### Requirement: Bedienungstests
Der Testlauf SHALL neben Satz-Fällen Bedienungsfälle ausführen, die die Oberfläche wie ein Nutzer bedienen (Klicks, Tasten, Eingaben, Fenstergröße) und danach den sichtbaren Zustand prüfen. Es MUST mindestens Fälle geben für: Buch blättern (vor, zurück, Ende, Seitenzahl eingeben, nächster Zauber, Pfeiltasten), Doppelseite mit Seite 1 allein rechts und Einzelseite bei schmalem Fenster, Verzeichnis im Buch (Abschnitt aufklappen, Zauber anklicken), Seitenleisten ein- und ausklappen, Lehrheft (Teil und Lektion im Verzeichnis anklicken, blättern, Verzeichnis folgt), Wechsel zwischen „Lehre der Kreise“ und Lehrheft, Einstellungsdialog (Abschnitt wechseln, Einstellung ändern wirkt auf die Ansicht). Jede fehlgeschlagene Erwartung MUST mit Schritt und erwartetem gegenüber tatsächlichem Wert gemeldet werden. Bedienungsfälle MUST ohne Sollwert-Datei auskommen; ihre Erwartungen stehen im Fall.

#### Scenario: Lehrheft-Verzeichnis
- **WENN** der Bedienungsfall im Lehrheft „Lückenkreise“ im Verzeichnis anklickt
- **DANN** prüft er, dass eine sichtbare Seite Lektion 37 enthält und „VI · Kreise lesen“ hervorgehoben ist

#### Scenario: Erwartung verfehlt
- **WENN** nach „Weiterblättern“ die Blätterleiste weiterhin „Seite 1“ zeigt
- **DANN** meldet der Fall den Schritt „weiterblättern“ mit Soll „Seite 2–3“ und Ist „Seite 1“

### Requirement: Testschnittstelle der App
Die App SHALL `window.APP_TEST` bereitstellen, mit dem ein Testlauf ein Buch (Zaubernamen) und Einstellungen flüchtig setzt, ohne sie zu speichern, und je Druckauftrag die Seitenliste erhält, die der zugehörige Druckknopf erzeugen würde. Die Schnittstelle MUST NOT das Verhalten der App für Nutzer ändern und MUST NOT gespeicherte Daten schreiben.

#### Scenario: Seiten des Buches
- **WENN** ein Test `APP_TEST.load({ book: ["Fireball", "Shield"], settings: { paper: "a4" } })` und danach `APP_TEST.pages("book")` aufruft
- **DANN** erhält er dieselben Seiten wie „Buch drucken“ mit diesem Buch und diesen Einstellungen, und im `localStorage` hat sich nichts geändert

