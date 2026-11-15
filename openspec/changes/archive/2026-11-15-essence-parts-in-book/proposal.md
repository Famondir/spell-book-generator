## Why

Das Lehrheft schreibt Essenzprofile schon wie ein Rezept („drei Teile Vis, knapp drei Teile Terra …“), das Zauberbuch dagegen noch als Statistik („Vis 32 %, Terra 28 %“). Prozentzahlen klingen nach Messprotokoll, nicht nach Formel. Selbst im Lehrheft steht in der Beschriftung des Kreises noch „Essenzring: Lux 90 %, Vis 10 %“.

## What Changes

- Lauftext der Zauberseite („Die Ladung der Formel verteilt sich auf …“) und die Zeile „Essenzring“ der Aufbauliste nennen die Anteile in Teilen (Deutsch und Englisch).
- Die nummerierte Beschriftung des Kreises („Essenzring“) nennt die Anteile in Teilen. Das betrifft Lehrheft, den beschrifteten Kreis im Buch und den Kreis-Dialog. Die englische Buchausgabe bekommt die englische Fassung statt der deutschen Prozentliste.
- Essenzanalyse auf der Zauberseite: Der Balken bleibt, rechts steht statt „81 %“ die Teile-Angabe der einzelnen Essenz („acht Teile“).
- Lesart des Andachtsbilds (Akzentscheiben) nennt die Anteile in Teilen, mit Steinnamen beim Material Stein (Deutsch und Englisch).
- Unverändert bleiben: Tooltips, Balken und Prozentwerte der App-Oberfläche (Liste, Detail, Dialog-Seitenleiste), die Filterlogik und die Prozentwerte im Modell.
- Der Backlog-Punkt „Essenzen in Teilen statt Prozent“ entfällt.

## Capabilities

### New Capabilities
- `essence-parts`: Essenzanteile in In-Game-Texten des Buchs (Zauberseiten, Kreisbeschriftung, Essenzanalyse, Lesart des Andachtsbilds) als Rezept in Teilen; App-Oberfläche weiter in Prozent.

### Modified Capabilities
<!-- keine: Lehrheft-Anforderung „Essenzen in Teilen“ besteht schon; die Kreisbeschriftung wird ihr hier angeglichen -->

## Impact

- `app/js/textgen.de.js`, `app/js/textgen.en.js` (`pctList`)
- `app/js/circle.js` (Beschriftung Essenzring), `app/js/book.js` (`ANNOT_EN`, `essenceBlock`)
- `app/js/vitrail.js` (Lesart der Akzente, de und en)
- `app/style.css` (`.esspct` ist mit 38 px zu schmal für „achteinhalb Teile“)
- Wiederverwendet: `THEORY.parts`, `THEORY.partPhrase`, `THEORY.partsEn`, `THEORY.partPhraseEn`
- Satz-Sollwerte (`tools/test-baseline*.json`) verschieben sich durch geänderte Textlängen und werden neu übernommen
- `backlog.md`
