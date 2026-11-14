## Context

Glossen (`.pr-note`) und Randnotizen (`.mnote`) sind Floats in derselben Randspalte (`float` mit `clear`). Floats stapeln sich in Quellreihenfolge: Ein Float kann nicht über einem früheren stehen. Die Notizen standen im Quelltext am Anfang der Lektion und kamen damit vor jeder Glosse.

## Goals / Non-Goals

**Goals:** Glossen so nah wie möglich am Begriff; Notizen füllen den freien Platz der Randspalte.

**Non-Goals:** Notizen über Lektionsgrenzen verschieben; Glossen untereinander umordnen.

## Decisions

- **Glosse im Absatz verankert.** Die Glosse ist ein `<span class="pr-note">` direkt vor dem Begriff (ein `<aside>` würde den Absatz schließen). Der Float steht damit in der Zeile des Begriffs.
- **Messdurchgang vor dem Umbruch.** `TYPESET.placeNotes` nimmt je Lektion die Notizen heraus, merkt sich die Lage aller Glossen der Seite und probiert die Einfügestellen nach dem Kopf von oben nach unten. Genommen wird die erste Stelle ohne Verschiebung einer Glosse, sonst die mit der geringsten. Gemessen wird mit `--fit: 0.95` wie beim Umbruch fließender Seiten.
- **Schriften vorher laden.** `document.fonts.ready` wartet nicht auf Schriften, die noch niemand angefordert hat; `noteFonts` lädt die Handschriften der Notizen ausdrücklich.

## Risks / Trade-offs

- [Lektion voller Glossen] → die Notiz landet unter der letzten und kann über das Lektionsende hinausragen.
- [Messaufwand] → je Notiz einige Layout-Messungen; bei wenigen Notizen je Lektion vernachlässigbar.
