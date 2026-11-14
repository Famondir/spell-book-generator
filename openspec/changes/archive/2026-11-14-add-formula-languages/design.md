## Context

`textgen.js` baut Titel, Beiname, Formel und Langformel aus lateinischen Wortlisten. Diese liegen verstreut:
- `IMPERATIVE`, `PARTICIPLE` und `EPITHET` in `textgen.js`
- `words` je Essenz und `SAVES.latin` in `theory.js`
- `shape.latin`, `range.latin` und `duration.latin` im Modell aus `analyze.js`
- feste Wörter direkt im Generator (`et`, `cum`, `Ordine secundo`, `Fiat`)

Dasselbe Formelband läuft in `circle.js` als SVG-`textPath` um den Kreis.

Die Herkunft der Formeln ist bisher nur ein Freitext aus `PR.learningOrigins`.

Das Explore-Gespräch vom 2026-10-25 hat entschieden:
- Hauptachse ist die Herkunft (wo und von wem gelernt), nicht Schule oder Charakter.
- Umschrift kommt zuerst, Handhabbarkeit geht vor Echtheit, alte Sprachstufen werden vereinfacht.
- Eingecheckt werden nur echte alte Sprachen und eigene Kunstsprachen. Golarion-Namen bleiben lokal.
- Randnotiz-Brücken sind erwünscht.

Recherche und Zuordnung Golarion → Leihsprache stehen in `data/research/lernorte-golarion.md` (gitignored).

## Goals / Non-Goals

**Goals:**
- Sprachmodul mit Lexikon und Satzmustern. Latein zieht verlustfrei um und dient als Referenz.
- Zehn weitere Lexika für die Stationen des privaten Profils, im Repository setting-neutral benannt.
- Lautschrift mit Ausgabe je Lesesprache (de/en).
- Deterministische Verteilung der Zauber auf Stationen mit fester Quote.
- Optionale Hausregel Entziffern: SG je Zauber, beherrschte Sprachen je Charakter.

**Non-Goals:**
- Würfelablauf beim Vorbereiten mit verdecktem Ersatzzauber (Folge-Change)
- Originalschriften (Hieroglyphen, Keilschrift) im Band
- Handschrift im Buch je Leben
- Übersetzung der Titel
- Grammatisch korrekte Sätze in den Leihsprachen

## Decisions

### 1. Ein Modul je Sprache, Daten statt Code

`data/formula-lang/<id>.js` registriert `window.FORMULA_LANGS[id] = { id, name: {de, en}, family, phonetic, lex, patterns, bridges }`.
- `lex` enthält dieselben Schlüssel für alle Sprachen: `imp[school]`, `ess[id]`, `shape[kind]`, `range[tier]`, `duration[kind]`, `save[type]`, `ord[1..9]`, `conj`, `close`, `answer`, `material`, `seal`, `ordWord`, `flow`.
- `patterns` beschreibt die Zeilentypen als Folge von Platzhaltern, z. B. `core: ["IMP", "ESS", ",", "SHAPE", "!"]` für Latein und `["ESS", "SHAPE", "IMP", "!"]` für Verb am Ende.

`app/js/lang.js` setzt die Zeilen zusammen. `textgen.formula()` wählt nur noch aus, *welche* Zeilen vorkommen. Den Inhalt der Zeilen liefert das Modul.

*Alternative:* je Sprache eine eigene Formelfunktion. Verworfen, weil sich Auswahl und Zeilenzahl dann je Sprache auseinanderentwickeln und Tests schwerer werden.

### 2. Latein-Umzug mit Gleichheitstest

Die Zufallsziehungen (`r.pick`, `r.sample`) müssen in gleicher Reihenfolge und Anzahl erfolgen. Sonst verschiebt sich der Seed, und alle Formeln ändern sich.

Darum geht der Umzug in zwei Schritten:
1. **Snapshot vorher:** Formel, Langformel und Band aller Zauber werden als JSON gesichert.
2. **Umzug mit Prüfung:** `lang.js` ruft für Latein exakt dieselbe Ziehfolge auf. Ein Testfall vergleicht danach mit dem Snapshot.

Titel und Beiname bleiben vorerst in `textgen.js`, weil sie nicht der Sprache folgen.

### 3. Lautschrift

Das Inventar ist bewusst klein und ASCII-nah:

```
a e i o u   aa ee ii oo uu (lang)   ə→e
sh  ch(tʃ)  j(dʒ)  kh(x)  gh(ɣ)  y(j)  v  w  ts  th(θ)  q  ʔ→'
```

`spell(word, lang)` ersetzt längste Treffer zuerst. Deutsch: `sh→sch`, `ch→tsch`, `j→dsch`, `kh→ch`, `y→j`, `v→w`, `w→u`/`w` nach Vokal, `ts→z`. Englisch: weitgehend unverändert, `kh→kh`.

Latein hat `phonetic: false` und wird nie umgeschrieben.

*Alternative:* echte Transliteration (ḥ, š, ṭ). Verworfen, weil sie nicht vorlesbar ist und Schriftarten auf dem Pfad strapaziert.

### 4. Stationen und Verteilung

`profile.formulaOrigins = [{ id, label, lang, hand, share, levels: [min, max], schools: {abjuration: 2, …}, essences: {…}, hints: { sources: […], name: […] } }]`

Ablauf:
1. `lang.assign(book, origins, overrides)` rechnet je Zauber und Station eine Punktzahl: Schulgewicht + Summe(Essenzgewicht × Anteil) + Hinweis-Bonus. Außerhalb des Gradfensters gibt es −∞.
2. Die Quoten werden nach größtem Rest auf die Buchgröße gerundet. Festgelegte Zauber zählen vorab mit.
3. Vergeben wird gierig: Die Paare (Zauber, Station) werden absteigend nach Vorsprung sortiert, also Punktzahl minus beste andere Punktzahl. Dann wird gefüllt, bis die Quoten erschöpft sind. Gleichstände entscheidet der Seed des Zaubers, damit das Ergebnis deterministisch bleibt.
4. Das Ergebnis wird je Buchinhalt zwischengespeichert. Ändert sich das Buch, wird neu verteilt.

Dass sich die Herkunft einzelner Zauber ändert, wenn das Buch wächst, ist gewollt: Die Quote soll stimmen. Wer einen Zauber festhalten will, nutzt `custom_texts`.

*Alternative:* Zufall je Zauber mit Gewichten. Verworfen, weil die Anteile dann schwanken und die Zuordnung inhaltlich weniger stimmig wäre.

### 5. Sprachbezeichnung

Lexika tragen irdische Namen (`{de: "Mittelägyptisch", en: "Middle Egyptian"}`). `profile.formulaLangNames = { egyptian: "…" }` überschreibt sie für Anzeige und Herkunftszeile. Golarion-Namen liegen damit nur in `profile.local.js`.

### 6. Hausregel Entziffern

`profile.decipher = { enabled, base: {known: 10, related: 15, foreign: 20, dead: 25}, hands: {roderik: 2}, dead: [ids], known: [ids] }`.

Die beherrschten Sprachen je Charakter liegen in den Charakter-Einstellungen (`chars.js`, Schlüssel `knownLangs`) und haben Vorrang vor `profile.decipher.known`.

```
Verhältnis = known      wenn lang ∈ knownLangs
           = dead       sonst, wenn lang ∈ dead
           = related    sonst, wenn eine bekannte Sprache dieselbe family hat
           = foreign    sonst
SG = base[Verhältnis] + Grad + hands[station.hand]
```

Der SG ist reine Anzeige in Detailansicht und „Heute vorbereitet“, nicht im Druck.

### 7. Brückennotizen

`bridges` ordnet je Essenz ein fremdes Wort mit Bedeutung zu, optional mit dem Vermerk `cognate: true` für echte Verwandtschaft (*agni*/*ignis*). Die Notizvorlagen sind neutral, etwa:
- „‚{word}‘ – {latin}. Derselbe Stamm.“
- „‚{word}‘ heißt {latin}. Klingt verwandt.“

Das Profil kann über `notes` eigene Vorlagen liefern. Die Platzwahl läuft über die bestehende Notizverteilung, sodass höchstens eine Notiz je Seite steht und keine doppelt vorkommt.

### 8. Erste Welle der Lexika

| id | Sprache | Familie | Satzbau Kernzeile |
|---|---|---|---|
| latin | Latein | indogermanisch | Verb – Essenz – Gestalt |
| hittite | Hethitisch | indogermanisch | Essenz – Gestalt – Verb |
| pie | Urindogermanisch | indogermanisch | Essenz – Gestalt – Verb |
| greek | Archaisches Griechisch | indogermanisch | Verb – Essenz – Gestalt |
| oldirish | Altirisch | indogermanisch | Verb – Essenz – Gestalt |
| welsh | Mittelkymrisch | indogermanisch | Verb – Essenz – Gestalt |
| egyptian | Mittelägyptisch | afroasiatisch | Verb – Essenz – Gestalt |
| akkadian | Akkadisch | semitisch (afroasiatisch) | Essenz – Gestalt – Verb |
| sumerian | Sumerisch | für sich | Essenz – Gestalt – Verb |
| technic | Kunstsprache, technisch | Kunstsprache | Verb – Gestalt – Essenz |
| bantu | Klangsprache, Bantu-Lautbild | Kunstsprache | Verb – Essenz – Gestalt |

Ägyptisch und Akkadisch sind beide afroasiatisch. Ob sie als „verwandt“ gelten sollen, legt `family` fest. Vorgabe: unterschiedliche Familien `egyptian` und `semitic`, denn die Verwandtschaft ist entfernt.

Je Lexikon sind es etwa 165 Lexeme. Die Wörter sind echt, wo die Sprache belegt ist, und stammen aus allgemeinem Wortschatz. Liturgische Texte werden nicht zitiert. Fehlt ein Begriff, wird umschrieben (z. B. „Feuer-Wort“) statt erfunden.

## Risks / Trade-offs

- **[Ziehfolge verschiebt Seeds]** → Snapshot-Test vor dem Umzug, Umzug erst bei Gleichheit.
- **[Philologische Fehler]** → Kopfkommentar „vereinfacht, Leihsprache“; Handhabbarkeit ist gewollt; Fachwörter aus Standardwörterbüchern, keine erfundenen Grammatikformen.
- **[Heikle Sprachen (lebende Religion, Bantu)]** → keine liturgischen Formeln; Bantu nur als Klangsprache mit eigenem Wortschatz, nicht als reale Sprache ausgegeben.
- **[Buch wächst, Zuordnung springt]** → bewusst; Festlegung je Zauber über `custom_texts`; Liste „Herkunft je Zauber“ in der Detailansicht macht es sichtbar.
- **[Bandlänge]** → Fremde Wörter sind oft länger. Die bestehende Kürzung an Wortgrenzen greift. Geprüft wird über die Kreis-Screenshots.
- **[Umfang ×10 Lexika]** → Lexika einzeln einchecken und testen. Die Vollständigkeitsprüfung läuft automatisch über alle Schulen, Essenzen und Gestalten.

## Migration Plan

1. Snapshot-Werkzeug, dann Latein-Umzug (keine sichtbare Änderung).
2. Lautschrift und `lang.js`, Stationen mit lateinischer Vorgabestation (keine sichtbare Änderung).
3. Lexika einzeln. Das neutrale Profil nutzt sie nicht, Sichtprüfung über ein Testprofil.
4. Hausregel und Einstellungen.
5. Lokales Profil (Kirran) befüllen und Bericht über die Verteilung erstellen.

Rückweg: Ohne `formulaOrigins` im Profil gilt Latein, also lässt sich jede Stufe einzeln abschalten.

## Open Questions

- Handschrift im Buch je Station/Leben: Sollen Randnotizen eines Zaubers die Hand seiner Station tragen? (vorerst nein)
- Gilt der Zuschlag der Hand auch für Randnotizen, oder nur für die Formel?
- Gotisch/Zwergisch, Biblisches Hebräisch, Altpersisch, Vedisches Sanskrit: zweite Welle, wenn die Zauberlisten je Station stehen.
- Das Spielleiter-Einverständnis zur Hausregel steht noch aus. Die Werte sind darum Profilvorgaben, nicht fest verdrahtet.
