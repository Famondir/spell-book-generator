## Why

Die Randnotizen der Stimmen standen am Anfang jeder Lektion und schoben die Glossen weit von ihren Begriffen weg. Glossen erklären den Text und gehören neben ihren Begriff; die Notizen sind Beiwerk und müssen sich nach ihnen richten.

## What Changes

- Glossen stehen in der Zeile ihres Begriffs, nicht mehr am Absatzanfang.
- Randnotizen stehen an der frühesten Stelle ihrer Lektion, an der sie keine Glosse verdrängen; die Reihenfolge aus dem Profil bleibt.
- Die Handschriften der Randnotizen werden vor dem Messen geladen, damit der Satz nicht nachträglich springt.
- Neuer Browser-Test `ui-lehrheft-glossenabstand`.

Die Umsetzung ist bereits erfolgt (Commit `b824f19`); dieser Change zieht die Spezifikation nach.

## Capabilities

### New Capabilities
<!-- keine -->

### Modified Capabilities
- `apprentice-primer`: Die Anforderung „Stimmen am Rand“ regelt den Vorrang der Glossen vor den Randnotizen.

## Impact

- `app/js/primer.js` (Glosse als Float vor dem Begriff), `app/js/typeset.js` (`placeNotes`, `noteFonts`), `tools/test-cases.mjs`.
