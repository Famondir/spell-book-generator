## 1. Charakter und Profil

- [x] 1.1 `chars.js`: Schlüssel `journal` in `OWN`; Duplizieren mit leerem `journal`; Export und Import enthalten `journal`
- [x] 1.2 Einstellungen: Schutzgottheit auch für Magier (Liste ohne Gesinnungsfilter, Option „keine“); `window.DEITY` auch für Magier setzen
- [x] 1.3 `profile.js`: neutraler Standard für `devotion`; `profile.local.example.js` mit kommentiertem Beispiel (Ablauf mit Buchschritten, Andachtsform, ein Festtag, Stimme)

## 2. Gebetsbausteine und Zwiespalt

- [x] 2.1 `prayer.js`: Tabelle gegensätzlicher Domänen- und Zuständigkeitspaare; Erkennung „Zwiespalt“, Erzwingen und Abschalten über `devotion.tone`
- [x] 2.2 Doppelverse für den Zwiespalt im Kanon des Breviers; Test mit einer Gottheit mit Paar und einer ohne
- [x] 2.3 Tagesbausteine (Anrufung, Bitte um Klarheit, Dank, Rückgabe, Bitte ums Behalten, Schluss) in allen Gesinnungstönen
- [x] 2.4 Prüfung: keine Sätze aus Quellenbüchern, Eigennamen nur aus `deities.js` oder Profil

## 3. Gebete für den Tag

- [x] 3.1 `app/js/devotion.js`: Morgengebet aus `devotion.morning` (oder Standard), deterministisch je Tageskennung
- [x] 3.2 Abendgebet aus Protokoll des Tages (meistgewirkter Zauber mit Namen, ungenutzte Plätze, „vertauscht“ falls vorhanden), optionaler Studienschritt, Bitte ums Behalten
- [x] 3.3 Anlass-Gebete (Entziffern, misslungener Wurf, Bannen, Abschreiben, Tote, Festtag), höchstens vier Zeilen, eigene Texte aus `devotion.occasions`
- [x] 3.4 Festtage: Abgleich mit Ingame-Datum, Nennung und Festtagsgebet im Morgengebet
- [x] 3.5 Testfälle in `tools/test-cases.mjs` (Bedienungsfälle `ui-andacht-*`, die App braucht den Browser): gleicher Tag gleicher Text, Ruhetag, Festtag, Ablauf ohne Profil

## 4. Protokoll und Reiter „Heute“

- [x] 4.1 `prepare.js`: Ereignisse `devotion` (Fragment-Zauber, abschließender Zauber), `vespers`, `release`; nicht als Wirken zählen
- [x] 4.2 Reiter „Heute“: Zeile „Morgenandacht“ (Fragment ansehen, abschließenden Zauber wählen und nur vermerken, „gehalten“) und „Abendgebet“, nur bei Gottheit
- [x] 4.3 `stats.js`: neue Ereignisse im aufklappbaren Protokoll anzeigen; Verweis auf Andachtsbuch und Rückschau-Export je Tag

## 5. Andachtsblatt

- [x] 5.1 Auswahl des Fragment-Zaubers: Saat aus Tageskennung und Datum, Bevorzugung des älteren Drittels nach letzter Verwendung im Protokoll
- [x] 5.2 Fragmenttext: Titel, Kernzeile, eine abgebrochene Zeile
- [x] 5.3 Teilkreis: `renderCircle` mit `outer`, `core`, `essence` plus angesetzter Bogen des nächsten Rings
- [x] 5.4 Vorderseite (Datum, Festtag, Morgengebet, Andacht, Felder gewirkter Zauber und Unterschrift) und Rückseite (Abendgebet, Rückschau, Tagebuch oder Linien); Andachtsform „prayer“ ohne Fragment
- [x] 5.5 Druck: festes A5, Lochrand vorn links und hinten rechts, Einzelblatt und Folge mehrerer Tage; Hinweis „beidseitig, lange Kante“
- [x] 5.6 Typeset-Test: Seitenfüllung von Vorder- und Rückseite, Lochrandseite im Druck-PDF prüfen

## 6. Andachtsbuch und Tagebuch

- [x] 6.1 Neuer Reiter „Andacht“: Andachtsblatt des Tages, Andachtsbuch, Rückschau, Spielleiter-Einträge
- [x] 6.2 Andachtsbuch im Seitenbetrachter: Doppelseite je Spieltag (ohne Probetage), älteste zuerst, druckbar in A5
- [x] 6.3 Abendgebet und Tagebuch von Hand schreiben und ändern; Speicherung in `journal.days`
- [x] 6.4 `stats.js`: Löschen eines Tages entfernt `journal.days[dayId]` und versiegelt dort freigegebene Spielleiter-Einträge wieder

## 7. Rückschau

- [x] 7.1 Export des Rückschau-Bogens (Markdown mit eingebettetem JSON; Protokoll, Fragment, Abendgebet, letzte drei Einträge, Stimme)
- [x] 7.2 Import aus Markdown-Kommentar oder reiner JSON-Datei; Zuordnung über Tageskennung, Nachfrage vor Überschreiben, Ablehnung bei unbekanntem Tag
- [x] 7.3 Probelauf: Kirrans Tag exportieren, Abendgebet und Tagebucheintrag in seiner Stimme schreiben, importieren, Andachtsblatt und Andachtsbuch prüfen

## 8. Einträge des Spielleiters

- [x] 8.1 `tools/seal-entries.html`: lokales Werkzeug, liest die Vorlage, erzeugt fehlende Codes (sprechbar), verschlüsselt Titel und Text (PBKDF2 + AES-GCM), gibt Spielerdatei und Spickzettel aus; Vorlage `gm-entries.example.json`
- [x] 8.2 Import der Spielerdatei; Anzeige nur der Anzahl versiegelter Einträge; Ersetzen noch versiegelter Einträge gleicher Kennung
- [x] 8.3 Code-Eingabe (Siegel in der Kopfzeile und im Reiter „Andacht“): Code gegen alle versiegelten Einträge prüfen, bei Treffer sofort Seite öffnen, Klartext in `journal` speichern, laufendem Spieltag zuordnen, Ereignis `release`; Meldung bei falschem Code oder fehlendem `crypto.subtle`
- [x] 8.4 Freigegebene Einträge im Andachtsbuch beim Tag der Freigabe, in derselben Schrift
- [x] 8.5 Export der Statusliste (Kennung, Status, Datum der Freigabe) ohne Codes und Texte

## 9. Lehrheft

- [x] 9.1 `primer.js`: Teil „Gebete für den Tag“ hinter dem Anhang, vor den Alltagszaubern (Morgen- und Abendgebet als feste Form, Anlass-Gebete, Festtage), nur bei Gottheit
- [x] 9.2 Inhaltsverzeichnis und Druck des Lehrhefts mit dem neuen Teil prüfen

## 10. Abschluss

- [x] 10.1 i18n-Schlüssel für alle neuen Oberflächentexte (Abstimmung mit `add-bilingual-app`)
- [x] 10.2 README: Abschnitt Andacht und Tagebuch, Rückschau mit Claude, Spielleiter-Einträge, Ablage im gitignorierten Ordner
- [x] 10.3 Kirrans `devotion` in `profile.local.js` eintragen (lokal, nicht im Repo) und mit Nethys als Schutzgottheit durchspielen
