## Context

Was es schon gibt:
- **Spieltage:** `prepare.js` führt `days` (`{ ingame: {d, m, y}, test }` je Kennung `st.day`) und ein Protokoll `log` mit Einträgen `{ t, ev, id, g, d }`. Verlauf, Probetage und Statistik stehen in `stats.js` (usage-statistics).
- **Gebete:** `prayer.js` erzeugt den Kanon je Zauber aus Gottheit (`deities.js`) und Zauberanalyse, im Ton nach Gesinnung. Die Gottheit gibt es bisher nur bei göttlichen Klassen (`CLASSES[cls].deity`).
- **Formel und Kreis:** `textgen.js` liefert `formula(m, r).lines`, `circle.js` rendert mit `opts.layers` eine beliebige Teilmenge der Ebenen (`CIRCLE_LAYERS`).
- **A5-Satz:** Buch und Lehrheft setzen A5-Seiten (`@page { size: A5 }`, Skalierung für A4) über den gemeinsamen Seitenbetrachter und Druckweg.
- **Profil:** Kalender (Monate, Tage), Orte, Stimmen und Lehrheft-Texte. Persönliches nur in `profile.local.js`.

Anlass ist Kirran: ein Magier, der Nethys folgt und täglich eine Andacht hält. Morgens holt er den Codex von einer anderen Ebene, bereitet vor und sendet ihn zurück; abends holt er ihn manchmal noch einmal zum Studium. Nach jeder Sitzung soll ein Tagebucheintrag in seiner Stimme entstehen (Ich-Form, ein Android, der Gefühle erst lernt). Der Spielleiter soll Erinnerungen beisteuern können, die erst zur rechten Zeit auftauchen.

## Goals / Non-Goals

**Goals:**
- Gebete für den Tag (Morgen, Abend, Anlässe, Festtage) für jeden Charakter mit Gottheit, auch für Magier.
- Ein druckbares Andachtsblatt je Spieltag (A5, beidseitig, Ringordner) mit echtem, abgebrochenem Formelfragment.
- Ein wachsendes Andachtsbuch mit Tagebuch, gefüllt über einen Rückschau-Export und -Import.
- Versiegelte Einträge des Spielleiters mit Freigabe.
- Alles setting-neutral im Repository; Kirrans Ablauf, Festtage und Stimme nur im lokalen Profil.

**Non-Goals:**
- Die Sprachenkunde-Hausregel (Würfe beim Vorbereiten, verdeckt vertauschte Zauber). Das Abendgebet nutzt „vertauscht“ nur, wenn das Protokoll es eines Tages kennt.
- Texterzeugung durch ein Sprachmodell in der App. Die App ruft keinen Dienst auf; die Rückschau mit Claude geschieht außerhalb über Export und Import.
- Kleriker-Brevier für Nethys oder andere Gottheiten (Strang explore-class-books).
- Regelwirkung der Andacht berechnen (Bonus auf Konzentration o. Ä.). Die App vermerkt nur, dass sie gehalten wurde.
- Echter Schutz vor neugierigen Spielern: Die Versiegelung schützt vor versehentlichem Lesen, nicht vor jemandem, der den Speicher durchsucht (siehe Risiken).

## Decisions

### 1. Ein Modul `devotion.js`, Bausteine in `prayer.js`
`prayer.js` bekommt die Tagesbausteine (Anrufung, Bitte um Klarheit, Dank, Rückgabe, Bitte ums Behalten, Schluss) und den Ton „Zwiespalt“. `devotion.js` setzt daraus Morgen-, Abend- und Anlass-Gebete zusammen, baut das Andachtsblatt und das Andachtsbuch und kümmert sich um Export, Import und Freigaben.
- *Warum:* Der Ton gehört zur Gottheit und wirkt auch im Brevier; Ablauf und Tageslogik gehören zum Spieltag.
- *Verworfen:* alles in `prayer.js` (wird zu groß, mischt Zauber- und Tageslogik); alles in `prepare.js` (dort ist schon die Vorbereitung).

### 2. Zwiespalt aus Daten, nicht aus Namen
Eine kleine Tabelle gegensätzlicher Paare von Domänen und Zuständigkeiten (Zerstörung/Schutz, Leben/Tod, Ordnung/Chaos, Wissen/Wahnsinn …) entscheidet. Trifft ein Paar zu, wechseln sich die Verse beider Seiten ab, und mindestens ein Doppelvers verbindet sie („der du zerstörst / der du bewahrst“).
- *Warum:* gilt für jede Gottheit mit solchen Paaren, nicht nur für Nethys; kein Eigenname im Code.
- Das Profil kann den Ton erzwingen (`devotion.tone: "zwiespalt"`), falls die Daten ihn nicht hergeben.

### 3. Profilfeld `devotion`
```js
devotion: {
  morning: [ { step: "invoke" }, { step: "fetchBook", text }, { step: "obedience" },
             { step: "prepare" }, { step: "returnBook", text }, { step: "close" } ],
  evening: [ { step: "invoke" }, { step: "studyBook", text, optional: true },
             { step: "review" }, { step: "keep" }, { step: "close" } ],
  obedience: "fragment" | "prayer",          // Andachtsform
  feasts: [ { d, m, name, text } ],          // Monat als Index in calendar.months
  occasions: { decipher, failedRoll, banish, copy, dead, feast },  // eigene Texte, optional
  voice: "Ich-Form; …",                       // Stimme des Tagebuchs (nur für die Rückschau)
}
```
Fehlt `devotion`, gilt ein neutraler Standard: `invoke, prepare, close` bzw. `invoke, review, keep, close`, `obedience: "prayer"`, keine Festtage. Jeder Schritt hat einen erzeugten Standardtext; `text` überschreibt ihn.
- *Warum:* Kirrans Codex auf einer anderen Ebene ist Charakterwissen und gehört nicht in den Code.

### 4. Formelfragment und Teilkreis
- Auswahl: Zauber aus dem Buch des Charakters, Saat aus der Tageskennung und dem Ingame-Datum. Die Kandidaten werden nach „zuletzt als Fragment gezeigt“ sortiert (aus den Andacht-Ereignissen im Protokoll), dann wird aus dem älteren Drittel gezogen. So wiederholt sich innerhalb einer Woche nichts, solange das Buch groß genug ist.
- Text: Titel, Kernzeile von `formula()`, dann höchstens eine weitere Zeile, gekürzt an einer zufälligen Wortgrenze mit Gedankenstrich oder mitten im Wort („Ordine secundo inv—“).
- Kreis: `renderCircle(m, { layers: ["outer", "core", "essence"] })` plus ein angesetzter, nach 60–120° abbrechender Bogen des nächsten Rings als eigener Pfad. Kein Schriftband, keine Weitenringe, keine Dauer.
- *Warum:* Das Fragment soll aus dem echten Buch stammen und zugleich nie ein vollständiger Zauber sein.

### 5. Andachtsblatt als zwei A5-Seiten
Das Blatt besteht aus zwei Seiten im bestehenden Seitensatz mit der Klasse `.sheet-front` bzw. `.sheet-back`. Der Lochrand (14 mm) liegt vorn links und hinten rechts, damit der Duplexdruck lange Kante passt. Gedruckt wird über den bestehenden Druckweg, aber mit festem `@page { size: A5 }`, unabhängig vom Buchformat. Mehrere Tage ergeben eine Folge von Seitenpaaren.
- *Verworfen:* eigenes PDF in JS (neue Bibliothek, anderer Satz als Buch und Lehrheft).

### 6. Andachtsbuch über den Seitenbetrachter
Je Spieltag (ohne Probetage) eine Doppelseite: links Morgen (Datum, Festtag, Morgengebet, Andacht mit Fragment), rechts Abend (Abendgebet, Rückschau in Stichpunkten aus dem Protokoll, Tagebuch oder Linien, danach freigegebene Einträge des Spielleiters als eigener Abschnitt in derselben Schrift). Der Betrachter ist derselbe wie bei Buch und Lehrheft (generalize-page-viewer); Druck A5.

### 7. Speicherung: Schlüssel `journal`
`CHARS.OWN` erhält `journal`:
```js
{ days: { [dayId]: { evening?: text, diary?: text, imported?: iso } },
  gm:   [ { id, salt, iv, cipher, released?: { day, t, title, text } } ] }
```
Beim Duplizieren leer, im Charakter-Export enthalten. Das Löschen eines Spieltages entfernt `journal.days[dayId]` und setzt `released` von Einträgen dieses Tages zurück.

### 8. Rückschau-Bogen: Markdown mit eingebettetem JSON
Export als `rueckschau-<charakter>-<jahr>-<monat>-<tag>.md`:
```
# Rückschau – Kirran – 12. <Monat> <Jahr>
Stimme: …
## Protokoll   (vorbereitet, gewirkt ×n, ungenutzt)
## Andacht     (Fragment: Titel, Kernzeile)
## Abendgebet (erzeugt)
## Letzte Einträge  (drei vorherige Tagebuchtexte)
## Antwort
<!-- devotion-review {"character":"Kirran","day":"…","evening":"","diary":""} -->
```
Der Import liest den JSON-Kommentar (oder eine reine JSON-Datei mit denselben Feldern). Leere Felder bleiben unverändert. Gibt es schon Text, fragt die App vor dem Überschreiben.
- *Warum:* Der Bogen ist für Menschen (und Claude) lesbar; die Antwort lässt sich in denselben Kommentar schreiben und zurück importieren, ohne dass ein Parser für Freitext nötig ist.
- Ablageort für die Dateien: der Nutzer wählt ihn selbst. Die README empfiehlt einen gitignorierten Ordner (z. B. `character/`).

### 9. Einträge des Spielleiters: spontan per Code
- Der Spielleiter schreibt seine Einträge in eine Vorlage (`gm-entries.example.json`: `id`, `title`, `text`, optional `code`) und versiegelt sie mit dem lokalen Werkzeug `tools/seal-entries.html`. Fehlt ein Code, erzeugt das Werkzeug einen gut sprechbaren (zwei Silbenwörter und eine Zahl, z. B. „asker-molin-7“). Ausgegeben werden zwei Dateien: eine für den Spieler (`id`, `salt`, `iv`, `cipher`, Titel und Text sind verschlüsselt) und eine Spickzettel-Liste für den Spielleiter (`id`, Titel, Code).
- Schlüssel: PBKDF2 (SHA-256, 200 000 Runden) aus dem Code, AES-GCM. Die App probiert einen eingegebenen Code gegen alle versiegelten Einträge; das Authentifizierungsmerkmal von GCM zeigt, ob er passt. Ein eigener Hash ist nicht nötig.
- Vor der Freigabe kennt die App nur Anzahl und Kennungen. Nach der Freigabe speichert sie den Klartext im `journal` und vermerkt Spieltag und Zeit.
- Freigabe öffnet sofort eine eigene Seite (Dialog im Seitenstil des Andachtsbuchs) und legt den Eintrag beim laufenden Spieltag ab. Gleiche Schrift wie das Andachtsbuch, keine eigene Handschrift.
- Statusliste für den Spielleiter: Kennung, Status, Ingame- und echtes Datum der Freigabe; ohne Codes und Texte.
- *Warum spontan statt terminiert:* Der Spielleiter will Erinnerungen dann auslösen, wenn es am Tisch passt („aktiviere Eintrag 7 und lies die Seite“), nicht nach Stufe oder Datum. Bedingungen lassen sich später ergänzen.
- *Verworfen:* Klartext mit Ehrensache (Titel und Text wären vorab lesbar); Hash ohne Verschlüsselung (Text stünde in der Datei); Freigabe nur über die Kennung (die Kennungen sind sichtbar und leicht zu raten).

### 10. Protokollereignisse
Neue `ev`-Werte: `devotion` (`id` = Fragment-Zauber, `extra.cast` = abschließender Zauber), `vespers` (Abendgebet gehalten), `release` (`id` = Kennung des Spielleiter-Eintrags). Statistik und Verlauf zählen sie nicht als Wirken. Der Verlauf zeigt sie im aufklappbaren Protokoll.

### 11. Oberfläche
- Reiter „Heute“: bei Charakteren mit Gottheit oben eine Zeile „Morgenandacht“ (Fragment ansehen, abschließenden Zauber aus der Vorbereitung wählen, „gehalten“) und unten „Abendgebet“. Der abschließende Zauber wird nur vermerkt, nicht abgestrichen; ein Zaubertrick genügt und bleibt ohnehin verfügbar.
- Kopfzeile: ein kleines Siegel-Symbol „Eintrag freigeben“ (nur wenn versiegelte Einträge vorhanden sind), damit der Code mitten in der Sitzung ohne Reiterwechsel eingegeben werden kann.
- Neuer Reiter „Andacht“ neben Heute, Verlauf und Statistik: Andachtsblatt des Tages, Andachtsbuch, Rückschau exportieren/importieren, Spielleiter-Einträge (Import, Freigabewort, Liste exportieren).
- Einstellungen: Auswahl der Schutzgottheit auch für Magier (gleiche Liste wie beim Paladin, ohne Gesinnungsfilter, mit „keine“).

## Risks / Trade-offs

- [Code verlegt oder falsch notiert] → der Spickzettel des Spielleiters ist die einzige Quelle; das Werkzeug kann aus seiner Vorlage jederzeit neu versiegeln (neue Codes), die App ersetzt beim Import Einträge gleicher Kennung, die noch versiegelt sind.
- [WebCrypto unter `file://`] → Chrome und Firefox behandeln `file://` als sicheren Kontext, `crypto.subtle` ist dort verfügbar. Fehlt es doch, zeigt die App eine Meldung und bietet keine Entschlüsselung an; das Werkzeug zum Versiegeln läuft ebenfalls lokal.
- [Zwiespalt-Erkennung zu grob oder zu eifrig] → nur feste Paare, und das Profil kann den Ton erzwingen oder abschalten; Test mit mehreren Gottheiten (mit und ohne Paar).
- [Andachtsblatt doppelseitig falsch ausgerichtet] → Testdruck in `typeset-tests` mit Prüfung der Lochrandseite; Hinweis „lange Kante“ im Druckdialog.
- [Große Tagebücher im localStorage] → Textmengen sind klein (wenige KB je Tag); bei sehr vielen Tagen bleibt man weit unter der Grenze. Der Export sichert alles.
- [Paizo-Texte aus Gewohnheit übernommen] → Bausteine werden neu geschrieben; Gehorsamsritual, Feiertage und Aphorismen der Quellen stehen höchstens als Beschreibung im lokalen Profil.
- [Parallele Changes (`add-bilingual-app`, `add-spell-inks`, `add-workshop-lessons`) berühren dieselben Dateien] → neue Texte über die vorhandenen i18n-Schlüssel anlegen; kleine, getrennte Commits.

## Migration Plan

- Bestehende Charaktere haben keinen Schlüssel `journal`; er entsteht beim ersten Schreiben. Ohne Gottheit ändert sich nichts.
- Magier ohne Gottheit sehen weder den Reiter „Andacht“ noch den Teil „Gebete für den Tag“.
- Für Kirran: Schutzgottheit Nethys in den Einstellungen setzen und `devotion` in `profile.local.js` ergänzen (Ablauf mit Codex, Andachtsform „fragment“, Festtage, Stimme).

## Open Questions

- Keine offenen Fragen. Entschieden: Der abschließende Zauber der Andacht wird nur vermerkt; Spielleiter-Einträge erscheinen ohne eigene Handschrift; Freigabe spontan per Code statt nach Stufe oder Datum.
