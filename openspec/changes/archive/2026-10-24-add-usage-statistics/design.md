## Context

Protokoll (`prepLog`, je Charakter): `{t, ev, id, g}` mit ev ∈ prep, unprep, cast, uncast, day. Ein `day`-Ereignis schließt einen Spieltag ab und enthält die IDs aller an diesem Tag vorbereiteten Zauber. Der laufende Tag beginnt bei `prep.day`.

## Decisions

- **Ein Tag = Zeitraum zwischen zwei „Neuer Tag“.** Jedes neue Ereignis bekommt `d` = Kennung des laufenden Tages (sein Startzeitpunkt). Alte Ereignisse ohne `d` werden beim Laden anhand der `day`-Ereignisse zugeordnet. Löschen eines Tages entfernt alle Ereignisse mit dieser Kennung; beim laufenden Tag werden zusätzlich die Abstriche zurückgesetzt.
- **Tagesdaten** in `prepDays[d] = { ingame: {d, m, y}, test }` statt im Protokoll, damit Protokoll-Einträge unverändert bleiben.
- **Ingame-Datum strukturiert** (Tag, Monat, Jahrestext), Monatsnamen aus `PROFILE.calendar.months`, Monatslängen aus `PROFILE.calendar.days` (Standard 31/28/31/…). „Neuer Tag“ zählt weiter; nach dem letzten Monat erhöht sich die erste Zahl im Jahrestext („4713 AR“ → „4714 AR“).
- **Zählweise der Statistik**: *gewirkt* = cast − uncast je Zauber (Joker zählen mit); *vorbereitet* = Anzahl Tage, an denen der Zauber vorbereitet war (aus den `day`-Schnappschüssen plus laufender Tag). Probetage zählen nirgends.
- **Darstellung** ohne Bibliothek: Balken als CSS-Breiten, Schnellglyphen wie im Verzeichnis.

## Risks / Trade-offs

- [Zeitzonen beim echten Datum] → Anzeige in lokaler Zeit des Browsers.
- [Sehr lange Protokolle] → einige hundert Ereignisse je Monat Spielzeit; Auswertung in Millisekunden.
