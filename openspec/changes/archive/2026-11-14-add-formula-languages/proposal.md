## Why

Bisher spricht jede Formel Latein. Das passt zu einem Magier aus der Gemeinsprach-Tradition, aber nicht zu einem Zauberbuch, das über mehrere Leben und viele Lernorte gewachsen ist. Dort sollte man einer Formel ansehen, wo und von wem sie gelernt wurde. Mit der Hausregel zur Sprachenkunde bekommt die Sprache zusätzlich eine Regelwirkung: Sie bestimmt, wie schwer der Charakter die eigenen alten Aufzeichnungen entziffert.

## What Changes

- **Formelsprache als austauschbares Modul:** Jede Sprache besteht aus einem Lexikon und eigenen Satzmustern. Zum Lexikon gehören Imperative je Schule, Wörter je Essenz, Gestalt, Weite, Dauer, Rettung, Ordnungszahlen, Bindewörter und Schlussformeln. Das Latein zieht unverändert in dieses Modul um, die bisherigen Formeln bleiben Zeichen für Zeichen gleich.
- **Weitere Leihsprachen im Repository:** Eingecheckt werden nur echte alte Sprachstufen und eigene Kunstsprachen, jeweils vereinfacht. Handhabbarkeit geht vor Echtheit. Die erste Welle umfasst Hethitisch, Mittelägyptisch, Akkadisch, Sumerisch, Altirisch, archaisches Griechisch, Urindogermanisch, Mittelkymrisch, eine technische Kunstsprache und eine Klangsprache mit Bantu-Lautbild. Lexika geschützter Kunstsprachen (Tolkien, Klingonisch) sind nur als lokale Dateien (`*.local.js`) möglich und landen nie im Repository.
- **Umschrift zum Vorlesen:** Die Lexika speichern eine einfache eigene Lautschrift. Die Ausgabe schreibt sie je Lesesprache aus, deutsch (`dschwala`) oder englisch (`jvala`). Latein behält als Fachsprache seine klassische Schreibung. Andere Schriften sind nicht Teil dieses Changes.
- **Nur das Gesprochene folgt der Sprache:** Betroffen sind Kernzeile, Formelzeilen, Schlussformel, Langformel und das Schriftband im Kreis. Titel, Beiname, Essenz- und Schulnamen bleiben lateinisch. Unter „Herkunft“ steht eine Zeile, in welcher Fassung die Formel notiert ist.
- **Herkünfte (Stationen):** Das Profil kann Stationen festlegen. Jede Station hat eine Bezeichnung, eine Sprache, ein Leben bzw. eine Hand, einen Anteil am Buch, ein Gradfenster, Gewichte für Schulen und Essenzen sowie Hinweise aus Quelle oder Name. Die App verteilt die Zauber deterministisch mit fester Quote nach größtem Rest auf die Stationen, jeweils an die passendste. Ein Eintrag in `custom_texts` legt Station oder Sprache für einzelne Zauber fest. Das neutrale Profil hat eine einzige lateinische Station, sodass sich ohne lokales Profil nichts ändert.
- **Hausregel Entziffern (optional, aus im neutralen Profil):** Der Charakter führt eine Liste beherrschter Sprachen, voreingestellt aus dem Profil und änderbar je Charakter in den Einstellungen. Daraus berechnet die App je Zauber einen Sprachenkunde-SG aus Sprachverhältnis (beherrscht, verwandt, fremd, tot), Grad und Hand. Der SG erscheint in der Detailansicht und in „Heute vorbereitet“. Lernt der Charakter eine neue Sprache, ändert sich nur der SG, das Buch bleibt gleich.
- **Randnotiz-Brücken:** Ab und zu verbindet eine Randnotiz ein fremdes Wort mit dem lateinischen Fachwort, belegt durch echte Wortgeschichte, etwa *agni* zu *ignis* oder *manas* zu *mens*. Dafür hat jedes Lexikon eine kleine Brückentabelle. Die Notizen halten sich an die bestehende Regel: höchstens eine je Seite, keine doppelt.
- **Nicht in diesem Change:** der Würfelablauf beim Vorbereiten mit verdecktem Ersatzzauber (eigener Folge-Change, Backlog „Hausregel Sprachenkunde“), Originalschriften im Schriftband und die Zuordnung der Handschrift im Buch je Leben.

## Capabilities

### New Capabilities
- `formula-languages`: Sprachmodule (Lexikon, Satzmuster, Brückentabelle), Lautschrift mit Ausgabe je Lesesprache, mitgelieferte Leihsprachen, lokale Zusatzlexika
- `formula-origins`: Stationen im Profil, deterministische Verteilung der Zauber mit fester Quote, Festlegung je Zauber, Herkunftszeile
- `decipher-rule`: optionale Hausregel Entziffern mit beherrschten Sprachen je Charakter, Sprachverwandtschaft und SG je Zauber

### Modified Capabilities
- `spell-texts`: Formel, Langformel und Schlussformel entstehen in der Sprache der Herkunft; Herkunft nennt die Fassung; Randnotiz-Brücken
- `magic-circle`: Das Schriftband trägt die Formel in der Umschrift ihrer Sprache
- `character-profile`: neue optionale Felder für Stationen, Sprachzuordnung und Hausregel; neutrales Profil mit einer lateinischen Station
- `settings-dialog`: beherrschte Sprachen je Charakter, wenn die Hausregel aktiv ist

## Impact

- Neu: `app/js/lang.js` (Sprachmodul, Umschrift, Verteilung auf Stationen), `data/formula-lang/*.js` (ein Lexikon je Sprache, Latein zuerst)
- Geändert: `textgen.js` (Formel, Langformel und Herkunft über das Sprachmodul, Brückennotizen), `circle.js` (Band), `app.js` und `prepare.js` (SG-Anzeige), Einstellungsdialog, `profile.js` und `profile.local.example.js`, `index.html` (Skripte laden, lokale Lexika mit `onerror`)
- Privat: Golarion-Namen und die Zuordnung Kultur → Leihsprache stehen nur in `profile.local.js`, Recherche in `data/research/lernorte-golarion.md`
- `add-bilingual-app`: Der Satz „Formeltext bleibt in beiden Sprachen gleich“ wird präzisiert. Die Wörter bleiben gleich, die Umschrift folgt der Lesesprache.
- Tests: Bestehende Ausgaben des neutralen Profils bleiben unverändert (Baselines). Neue Fälle decken Sprachwechsel, Quotenverteilung, Umschrift de/en und SG ab.
- Keine neuen Bibliotheken, keine neuen Schriftarten.
