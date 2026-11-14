## Why

Ein Magier, der einer Gottheit folgt, betet anders als ein Paladin: Er bittet nicht um Zauber, sondern um Klarheit beim Studium. Viele Gläubige halten zudem eine tägliche Andacht mit Regelwirkung (Deific Obedience). Bisher kennt die App Gebete nur je Zauber im Brevier. Der Spieltag dagegen hat schon Ingame-Datum und Protokoll, aber weder Morgen- noch Abendgebet und keinen Ort, an dem festgehalten wird, was der Charakter an diesem Tag erlebt und verstanden hat. Das ergänzt dieser Change: Gebete für den Tag, ein druckbares Andachtsblatt je Spieltag und ein Tagebuch, das nach jeder Sitzung wächst. Auch der Spielleiter kann Einträge beisteuern, die erst zur rechten Zeit erscheinen.

## What Changes

- **Gottheit auch für Magier:** Ein arkaner Charakter kann eine Schutzgottheit haben. Sie ändert weder Buch noch Kreise, sondern liefert nur die Gebete.
- **Ton „Zwiespalt“:** Gottheiten mit gegensätzlichen Zuständigkeiten (z. B. Zerstörung und Schutz) erhalten Gebete in Doppelversen, die beide Seiten anrufen. Das gilt auch im Brevier.
- **Morgen- und Abendgebet:** Das Morgengebet folgt dem Ablauf des Tages (Anrufung, Buch holen, Andacht, Vorbereitung, Buch zurücksenden, Schluss). Das Abendgebet blickt auf das Tagesprotokoll zurück (gewirkt, vertauscht, ungenutzt) und bittet ums Behalten. Optional wird das Buch zum Studium noch einmal geholt. Die Schritte kommen aus dem Profil; ohne Profilangaben gilt ein neutraler Ablauf.
- **Anlass-Gebete:** kurze Gebete zum Entziffern, nach einem misslungenen Wurf, vor dem Bannen, beim Abschreiben, für die Toten, an Festtagen. Festtage (Tag, Monat, Name, Anlass) stehen im Profil.
- **Gebete für den Tag im Lehrheft:** ein neuer Teil mit Morgen-, Abend- und Anlass-Gebeten, sobald der Charakter eine Gottheit hat.
- **Andachtsblatt:** je Spieltag ein A5-Blatt mit Lochrand für den Ringordner. Die Vorderseite trägt den Morgen: Segen, ein **abgebrochenes Formelfragment** aus einem Zauber des Buches mit unvollständigem Kreis sowie Felder für den gewirkten Zauber und die Unterschrift. Die Rückseite trägt den Abend: Abendgebet, Rückschau und Tagebuch. Das Blatt ist deterministisch je Spieltag. Die Andachtsform „Formelfragment“ wählt das Profil.
- **Andachtsbuch (Tagebuch):** digital wachsend, ein Eintrag je Spieltag, im Format A5 lesbar und druckbar. Ohne eigenen Text erzeugt die App einen schlichten Standardtext, und das Tagebuch bleibt liniert.
- **Rückschau nach der Sitzung:** Ein Spieltag lässt sich als Rückschau-Bogen exportieren (Datum, Protokoll, Andacht, Hinweise zur Stimme des Tagebuchs). Abendgebet und Tagebucheintrag, außerhalb der App geschrieben, etwa mit Claude, lassen sich als Datei wieder importieren. Die Texte bleiben beim Charakter und gelangen nie ins Repository.
- **Einträge des Spielleiters:** Der Spielleiter kann Einträge beisteuern (Erinnerungen, aufgetauchte Notizen). Sie sind verschlüsselt und versiegelt; die App zeigt nur ihre Anzahl. Freigegeben wird spontan am Tisch: Der Spielleiter nennt einen Code, er wird eingegeben, und die Seite öffnet sich sofort. Eine Statusliste ohne Codes und Texte zeigt ihm, was schon freigegeben ist.
- **Protokoll:** Morgenandacht, Abendgebet und Freigaben werden als Ereignisse des Spieltages protokolliert.

## Capabilities

### New Capabilities
- `devotion-texts`: Morgen-, Abend- und Anlass-Gebete aus Gottheit, Profilablauf und Tagesprotokoll; Festtage aus dem Profil
- `devotion-sheet`: tägliches Andachtsblatt (A5, Vorder- und Rückseite, Lochrand), Formelfragment mit unvollständigem Kreis, deterministisch je Spieltag
- `devotion-journal`: Andachtsbuch mit Tagebuch je Spieltag, Rückschau-Export und -Import, versiegelte Einträge des Spielleiters mit Freigabe

### Modified Capabilities
- `character-slots`: Gottheit auch für arkane Klassen (optional); neue Datenkategorie `journal` in Speicherung, Duplizieren und Export
- `prayer-texts`: Ton nach Gesinnung um „Zwiespalt“ für Gottheiten mit gegensätzlichen Zuständigkeiten erweitert
- `spell-preparation`: Protokoll kennt Morgenandacht, Abendgebet und Freigabe als Ereignisse
- `usage-statistics`: Löschen eines Probetages löscht auch dessen Tagebucheintrag; der Verlauf verweist auf den Tageseintrag
- `apprentice-primer`: neuer Teil „Gebete für den Tag“ bei Charakteren mit Gottheit

## Impact

- Neu: `app/js/devotion.js` (Gebete für den Tag, Andachtsblatt, Andachtsbuch), Ansicht „Andacht“ in `index.html`, Druckstile für A5 mit Lochrand in `style.css`
- Geändert: `prayer.js` (Zwiespalt-Ton, Bausteine für Tagesgebete), `chars.js` (`journal`, Gottheit für Magier), Einstellungen (Gottheit bei Magiern), `prepare.js` (Ereignisse, Schaltflächen Morgenandacht und Abendgebet), `stats.js` (Probetag löschen, Verweis), `primer.js` (Teil „Gebete für den Tag“), `textgen.js`/`circle.js` (Formelfragment und Teilkreis über bestehende Funktionen)
- Profil: neue optionale Felder `devotion` (Ablauf Morgen und Abend, Andachtsform, Festtage, Stimme des Tagebuchs) in `profile.js`, Beispiel in `profile.local.example.js`. Kirrans Texte stehen nur in `profile.local.js`.
- Daten: Gottheitsnamen weiterhin nur beschreibend aus `deities.js`; Gehorsamsrituale aus Quellenbüchern werden nicht übernommen, die Andachtsform ist eine eigene, neutrale Beschreibung.
- Abhängigkeit: `add-bilingual-app` ist in Arbeit. Neue Texte werden deutsch angelegt und so gebaut, dass sie später übersetzbar sind.
- Keine neuen Bibliotheken. Für die Freigabecodes wird WebCrypto genutzt (AES-GCM, PBKDF2).
