## Context

- Die Lexika in `data/formula-lang/*.js` stehen in einer vereinfachten Lautschrift, `spell()` in `app/js/lang.js` macht daraus die deutsche oder englische Umschrift. Seit `align-formula-lexicons` hat jede Sprache `onsets` (Lautschrift → Zeichen der Originalschrift), und jede Liste hat eigene Anlaute.
- Das Band (`bandLayer` in `app/js/circle.js`) setzt `formula.band` in Großbuchstaben auf `textPath`, teilt an den Toren, kürzt an Wortgrenzen und schätzt die Breite mit 9,2 Einheiten je Zeichen. Bei Formeln ohne Stimme (V) zeigt es ein Runenband.
- `quickLetters` setzt die beiden Buchstaben aus `TEXTGEN.coreChoice(m).letters` (lateinisch) als Text neben die Schulfigur.
- `buildCoreMap` vergibt je Glyphengruppe Plätze mit verschiedenen lateinischen Buchstabenpaaren, für einzeilige Formeln zusätzlich je Schule, Essenz und Gestalt.
- Die Schriften liegen als woff2 unter `app/fonts/` und werden per `@font-face` in `app/style.css` geladen. `fonttools` ist auf dem Rechner nicht installiert.

## Goals / Non-Goals

**Goals:**
- Band und Absichtszeichen in der Schrift der Formelsprache, aus der vorhandenen Lautschrift erzeugt. Die Lexika müssen dafür nicht doppelt gepflegt werden.
- Schnellglyphen bleiben je Klassenliste eindeutig, und zwar nach dem Aussehen.
- Alles läuft offline mit kleinen Schriftdateien, auch im Druck und im SVG-Export.

**Non-Goals:**
- Philologisch richtige Schreibungen. Keilschrift wird silbisch geschrieben, ohne Logogramme und Determinative. Die Hieroglyphen sind meist alphabetisch. Das ist eine Leihschrift wie die Leihsprache.
- Formeltext auf der Seite in Originalschrift. Er bleibt Lautschrift zum Vorlesen.
- Eigene Schriften für Kymrisch, Bantu-Lautbild und Technik.
- Rechts-nach-links-Schreibung oder Zeilenrichtung je Schrift. Alle Bänder laufen im Uhrzeigersinn ab Norden.

## Decisions

### 1. Ein Modul `app/js/scripts.js` mit einer Schrift je Sprache

`SCRIPTS[id] = { font, case, advance, tokens, render }`, die Sprache verweist mit `script: "cuneiform"` darauf. Ohne Angabe gilt `latin`. Die Schnittstelle:
- `SCRIPTS.write(lang, text)` liefert eine Zeichenfolge, bei der Ursprache eine Folge von Zeichen-IDs.
- `SCRIPTS.onsetGlyph(lang, word)` liefert das Absichtszeichen.
- `SCRIPTS.visualKey(lang, word)` liefert den Vergleichsschlüssel für die Eindeutigkeit.

Die Übertragung arbeitet auf der Lautschrift des Lexikons, nicht auf der Umschrift. Deshalb ist das Ergebnis unabhängig von der Lesesprache.

*Alternative:* eine zweite Schreibung je Wort im Lexikon. Das wären 1330 Einträge doppelt gepflegt. Verworfen, nur Ausnahmen kommen ins Lexikon (Entscheidung 3).

### 2. Keilschrift silbisch

Die Lautschrift wird in Laute zerlegt, über die `onsets`-Tabelle der Sprache (kh → ḫ, sh → š, ts → z) und mit Langvokalen als einfache Vokale. Dann wird silbisch geschrieben:
- Konsonant mit Vokal ergibt ein CV-Zeichen.
- Ein Konsonant am Silbenende wird als VC-Zeichen mit dem Vokal der Silbe geschrieben (pa-aḫ).
- Ein Konsonant ohne folgenden Vokal am Wortende oder vor einem weiteren Konsonanten bekommt ein CV-Zeichen mit Stützvokal i (pakhsh → pa-aḫ-ši). Das ist die übliche hethitische Praxis.
- CVC-Zeichen werden genutzt, wo die Tabelle sie hat und kein Vokal verloren geht (optional, für kürzere Bänder).

Die Zeichentabelle (Lautwert → Unicode, Block 12000–123FF) deckt die Konsonanten b d g ḫ k l m n p q r s š t z w y × die Vokale a e i u ab, jeweils als CV und VC, dazu die reinen Vokale. Fehlende Werte nimmt der nächste Lautwert (e → i, w → u, ṣ/ṭ sind in der Lautschrift schon s/t). Sumerisch und Akkadisch benutzen dieselbe Tabelle.

### 3. Hieroglyphen alphabetisch mit festen Schreibungen

Einkonsonantenzeichen nach der ägyptologischen Liste (G1 ꜣ, M17 j, D36 ꜥ, G43 w, D58 b, Q3 p, I9 f, G17 m, N35 n, D21 r, O4 h, V28 ḥ, Aa1 ḫ, F32 ẖ, O34 s, N37 š, N29 q, V31 k, W11 g, X1 t, V13 ṯ, D46 d, I10 ḏ). Die Lautschrift verliert Unterschiede. Daher gilt: a am Wortanfang → ꜣ, sonst wird der Schulvokal e weggelassen, kh → ḫ, h → h. `lex.scriptWords` darf feste Schreibungen für einzelne Wörter vorgeben, etwa *ankh* → 𓋹 (S34), *maat* → 𓁦, *nefer* → 𓄤, *djed* → 𓊽. Das Absichtszeichen ist immer das erste Einkonsonantenzeichen des Anlauts und folgt nicht der festen Schreibung. So bleibt es aus der Lautschrift ablesbar.

### 4. Griechisch und Ogham Buchstabe für Buchstabe

- **Griechisch:** ph φ, th θ, kh χ, ps ψ, rh ῥ, h am Wortanfang → Spiritus asper auf dem Vokal, e → ε, o → ο, u → υ, s am Wortende → ς. Im Band in Großbuchstaben (wie bisher bei Latein), als Absichtszeichen in Kleinbuchstaben, damit sie sich von lateinischen Großbuchstaben unterscheiden.
- **Ogham:** b ᚁ, l ᚂ, f/v ᚃ, s/sh ᚄ, n ᚅ, h ᚆ, d/th ᚇ, t ᚈ, c/k/kh ᚉ, q ᚊ, m ᚋ, g ᚌ, ng ᚍ, z ᚎ, r ᚏ, a ᚐ, o ᚑ, u ᚒ, e ᚓ, i ᚔ. Doppelte Vokale werden zu einem, das Wort steht zwischen ᚛ und ᚜, Wortabstand ist U+1680.

### 5. Ursprache als SVG-Zeichen

Eine Strichschrift mit einem Zeichen je Laut der Lautschrift: a e i o u, p b bʰ t d dʰ k g gʰ kʷ gʷ gʷʰ s m n l r w y h. Es sind etwa 25 Zeichen auf einem 10×14-Raster, aus 2 bis 4 Strichen, im Stil der Runen des Runenbands, aber senkrecht gebaut. Die Zeichen stehen in `scripts.js` als Pfaddaten. Das Band setzt sie einzeln entlang des Bogens (Position und Drehung je Zeichen, wie das Runenband) statt über `textPath`. Tore, Lücken und Wortgrenzen arbeiten auf der Zeichenfolge.

*Alternative:* eine eigene Schriftdatei bauen. Das wäre mehr Werkzeug, und es gibt keinen Gewinn, weil die Zeichen nur im Band und in der Glyphe vorkommen.

### 6. Band: Laufweite je Zeichen statt 9,2

`tools/subset-fonts.py` schreibt neben die Schriften `app/fonts/widths.js` mit der Laufweite jedes benutzten Zeichens (aus `hmtx`). Das Band misst damit die Zeichenfolge genau, statt einen Mittelwert zu schätzen. Das ist nötig, weil Keilschriftzeichen zwischen 0,7 und 1,9 Geviert breit sind und kurze Bogenstücke sonst gestaucht würden. Ohne Tabelle (Lateinschrift, Ursprache) gilt `advance` je Schrift. Keilschrift (14) und Hieroglyphen (15) stehen im Band etwas größer als Latein (13). Kürzen an Wortgrenzen bleibt, gezählt wird in Codepunkten (Keilschrift liegt außerhalb der BMP). `toUpperCase()` gilt nur für Schriften mit Großbuchstaben.

### 7. Eindeutigkeit nach Aussehen in `buildCoreMap`

Statt des lateinischen Buchstabenpaars sperrt `buildCoreMap` den Schlüssel `visualKey(langOf(m), imp[i]) + visualKey(langOf(m), ess[j])`. Der Schlüssel ist das angezeigte Zeichen, normalisiert über eine Verwechslungstabelle: Griechisch ο ≈ O, Ogham und Ursprache als eigene Schrift-Präfixe, Lateinschrift-Sprachen als Großbuchstabe ohne Präfix, damit Latein, Kymrisch, Bantu und Technik gemeinsam gesperrt werden. Die zweite Sperrmenge für einzeilige Formeln bleibt (dort zählt das gedruckte Wortpaar). Die Reihenfolge (nach ID, ab Wunschpaar) bleibt.

Zauber, die nur Latein tragen, behalten dieselbe Wahl. Neu vergeben werden nur Plätze, wo zwei Sprachen mit gleicher Schrift in einer Gruppe zusammentreffen. Ohne Profil ändert sich also nichts.

`coreChoice(m).letters` liefert weiter die lateinischen Buchstaben (für die Fachzeile). Neu ist `coreChoice(m).marks` mit den Absichtszeichen der eigenen Sprache.

### 8. Schriftdateien kürzen

`tools/subset-fonts.py` liest die Zeichenliste, die `tools/script-check.mjs --chars` aus allen mitgelieferten Lexika erzeugt, und kürzt die Originalschriften mit `fontTools.subset` zu woff2. Die Originale liegen nicht im Repo, das Werkzeug lädt sie von den Noto-Quellen (`notofonts` auf GitHub) in einen Cache. Gebraucht wird es nur, wenn sich Lexika ändern. `pip install fonttools brotli` steht in der Kopfzeile des Werkzeugs. Erwartete Größe: je Schrift 5–40 KB.

### 9. SVG-Export

Die App läuft auch über `file://`, wo `fetch` auf lokale Dateien scheitert. Deshalb enthält `app/fonts/widths.js` die gekürzten Schriften zusätzlich als data-URL (`SCRIPT_FONTS`, zusammen etwa 45 KB). Der Export liest die Schrift am Bandtext ab (`script-…`) und bettet nur diese als `@font-face` ein. Die Ursprache braucht keine Schrift.

## Risks / Trade-offs

- **Keilschrift silbisch statt logografisch:** Fachleute sähen sumerische Wörter als Logogramme (IZI 𒉈). → Silbisch ist eine bewusste Leihschrift. Später sind feste Schreibungen wie bei den Hieroglyphen möglich (`scriptWords`).
- **Laufweite der Keilschrift:** Keilschriftzeichen sind breit, Bänder werden kürzer. → `advance` messen, bei Bedarf Schriftgröße im Band je Schrift.
- **Druck:** Fehlt eine Schrift beim Drucken, erscheinen Kästchen. → `font-display: block` für die Formelschriften und Test im Satz (PDF der Testfälle).
- **Verwechslungstabelle unvollständig:** Zwei Zeichen könnten sich ähnlicher sehen als die Tabelle weiß. → Die Tabelle beginnt mit den Paaren Griechisch/Latein und wird bei Funden ergänzt. Die anderen Schriften sind optisch weit entfernt.
- **Ursprache als Gestaltungsarbeit:** 25 Zeichen müssen sich in 18 mm großen Glyphen unterscheiden. → Mess-Seite mit allen Zeichen in Bandgröße und Glyphengröße.

## Migration Plan

1. `scripts.js` mit Griechisch und Ogham (einfach), dazu Prüfwerkzeug. Band und Glyphe stellen um, der Rest bleibt Latein.
2. Keilschrift-Tabelle, dann Hieroglyphen, dann Ursprache.
3. `buildCoreMap` nach Aussehen, Erklärtexte, Export.
4. Schriften kürzen, einbinden, Snapshots und Baselines neu sichern.

Rücknahme: `script` aus einem Lexikon entfernen, dann gilt dort Lateinschrift.

## Open Questions

- Soll das Band bei Keilschrift kleiner gesetzt werden, damit mehr Formel hineinpasst, oder lieber nur Teile der Formel zeigen? Vorschlag: Das wird bei der Feinabstimmung am Bild entschieden.
