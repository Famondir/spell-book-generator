## Context

Zwei Entsprechungstafeln existieren nebeneinander:

- `CORRESPOND_BASE` in `app/js/textgen.js`: je Essenz Stunde, Farbe, Metall, Richtung (Ignis: Mittag, Zinnoberrot, Gold, Süden). Diese Werte stehen im Zauberbuch (`correspondBlock`) und in der Legende; das Profil kann sie überschreiben (`PROFILE.correspond`).
- `TAG_ESS` und die Stoffliste in `app/js/theory.js`: liest Materialkomponenten als Essenzen (Gold → Sol → Lux und Bonum; Kupfer → Venus → Aer; Schwefel → Ignis).

Die beiden widersprechen sich an Stellen (Gold gehört in der Entsprechung zu Ignis, als Stoff zu Lux). Das Backlog fragt nach Zusätzen „für Effektverstärkungen und Harmonien“, etwa Gold und Kupfer für Ignis. Entscheidung des Nutzers: keine Regelwirkung.

## Goals / Non-Goals

**Goals:**
- Jede Formel hat eine Tinte, deterministisch aus Zauber-Id und Essenzen.
- Die Tinte passt zu dem, was auf derselben Seite steht (Farbe und Metall der Entsprechungen).
- Die Beimischung ist begründet, und die Begründung klingt nach Lehrlingslogik, nicht nach Gesetz („Luft facht die Flamme an“).

**Non-Goals:**
- Keine Regelwirkung, keine Kosten, keine Kaufliste.
- Keine farbige Darstellung der Kreise in der Tintenfarbe (Druck bleibt wie er ist).
- Kein Abgleich von `CORRESPOND_BASE` und `TAG_ESS` (eigener Backlog-Punkt, falls gewünscht).

## Decisions

**Quelle ist `CORRESPOND`, nicht `TAG_ESS`.** Die Tinte soll mit der Tabelle auf derselben Seite übereinstimmen. Für Ignis ergibt das Zinnoberrot und Goldstaub, wie im Backlog gedacht.

**Aufbau einer Tinte:**

```
Formel ─▶ Essenzen (pct) ─┬─ Hauptessenz ──▶ Farbe ─▶ Farbstoff   (Zinnoberrot → Zinnober)
                          │                └─ Metall ─▶ Metallstaub (Gold → Goldstaub)
                          └─ zweite Essenz ─▶ Metall ─▶ Beimischung (Aer → Kupfer)
                                                         + Begründung
Grundtinte: Eisengallus (Reinbuch)      Tag: Wandelstern des Hauptmetalls (optional)
```

Beispiel Feuerball (Ignis, Vis): „Eisengallus, mit Zinnober gefärbt, Goldstaub; eine Messerspitze Eisenfeilspan, weil Kraft die Flamme vorwärts treibt. Am Tag der Sonne anreiben.“

Hat die Formel nur eine Essenz oder dasselbe Metall zweimal, entfällt die Beimischung.

**Farbstoff-Tafel** (Farbe der Entsprechung → historischer Farbstoff, Gift ja/nein), im Code als Tabelle, über das Profil ersetzbar:

| Farbe | Farbstoff | Gift |
|---|---|---|
| Zinnoberrot | Zinnober | ja |
| Tiefblau | Ultramarin aus Lapislazuli | nein |
| Himmelblau | Azurit | nein |
| Ocker | Gelber Ocker | nein |
| Grün | Grünspan | ja |
| Aschgrau | Beinschwarz, mit Kreide gebrochen | nein |
| Weißgold | Muschelgold | nein |
| Schiefer | Schieferschwarz | nein |
| Violett | Folium (Tournesol) | nein |
| Stahlblau | Indigo mit Ruß | nein |
| Weiß | Kreideweiß | nein |
| Schillernd | Perlmuttstaub | nein |
| Schwarzrot | Drachenblut (Harz) | nein |
| Mitternachtsblau | Indigo | nein |
| Bernstein | Safran in Eiweiß | nein |

Metalle: Gold, Silber, Kupfer, Eisen, Zinn, Platin als Staub oder Feilspan; Blei als Bleiweiß (Gift); Quecksilber als Amalgam mit Zinn (Gift); Kaltes Eisen als Schmiedezunder.

**Begründungen.** Je Essenz gibt es zwei bis drei kurze Wirkungssätze, wie die zweite Essenz der ersten dient („Luft facht die Flamme an“, „Ordnung hält das Wasser in der Form“). Gewählt wird deterministisch per Seed. Gibt es für das Paar einen Namen in der Kombinationstafel (`ignis+aer` → „Blitzfeuer“), darf die Begründung ihn nennen. Die Sätze sind ausdrücklich Werkstattwissen, keine Gesetze; der Lehrling „muss kreativ werden“.

**Warnvermerk.** Bei giftigem Farbstoff oder Metall folgt ein kurzer Satz im Ton des Kastens „Das Gift im Tintenfass“ („nur mit eigenem Pinsel, nach der Arbeit waschen“). Kein Totenkopf-Symbol, um den Satz ruhig zu halten.

**Ort im Zauberbuch.** Eine Zeile „Tinte“ unter der Tabelle der Entsprechungen, so weit gefasst, wie die Entsprechungen erscheinen (höhere Grade). Zaubertricks bekommen keine Tinte, weil ihre halbe Seite voll ist.

**Lektion im Lehrheft.** „Tinten nach der Mischung“ (`l-inks`), Teil IV nach „Mischungen in Teilen“. Lesestück: die Grundtinte bleibt immer Eisengallus, Farbe und Metall kommen aus der Hauptessenz, und die Beimischung muss man begründen können. Beispiel aus dem Werkstattbuch eines Lehrlings, der einer Feuerformel Kupfer gibt, weil Luft das Feuer heißer macht; Randbemerkung des Meisters, dass die Begründung zählt, nicht die Zutat. Generator: Tafel Essenz → Farbe, Farbstoff, Metall, Gift. Aufgabe: Tinte für die eigene Formel aus Lektion „Mein erster Zauber“ ableiten und begründen.

## Risks / Trade-offs

- [Begründungen wiederholen sich über viele Zauber] → mehrere Sätze je Essenz, Auswahl per Seed; Begründung kurz halten.
- [Widerspruch zwischen den Tafeln fällt Lesern auf] → die Lektion erwähnt, dass Stoffe im Eckstein anders gelesen werden als Entsprechungen; Abgleich als Backlog-Punkt.
- [Platz auf der Zauberseite] → Tinte als eine Zeile; Mess-Seite prüft, dass keine Formel auf eine neue Seite rutscht.

**Randnotizen.** Die Lektion „Tinten nach der Mischung“ trägt Randnotizen der Profil-Stimmen wie jede Lektion (`primer.notes["l-inks"]`). Die Zeile „Tinte“ im Zauberbuch bekommt keine eigenen Kommentare; die Randnotizen der Zauberseiten nehmen auf die Tinte keinen Bezug.

## Open Questions

- keine
