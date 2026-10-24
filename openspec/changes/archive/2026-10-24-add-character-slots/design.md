## Context

Speicher heute: `spellbook.settings`, `book`, `bookPos`, `detailView`, `ui`, `prep`, `prepPresets`, `prepLog`. Das Profil wird beim Laden in `profile.js` gemischt; alle Texte entstehen danach.

## Decisions

- **Namensraum je Charakter**: `spellbook.c.<id>.<schlüssel>` für settings, book, bookPos, prep, prepPresets, prepLog. Global bleiben `ui` und `detailView` (Bedienung, kein Spielstand) sowie `spellbook.chars` (Liste) und `spellbook.activeChar`.
- **chars.js vor profile.js**: Es liest den aktiven Charakter und dessen Profilwahl, damit `profile.js` das richtige lokale Profil mischt. Ein Wechsel setzt den aktiven Charakter und lädt neu – einfacher und sicherer als alle Texte im laufenden Betrieb neu zu erzeugen.
- **Profile**: `PROFILE_LOCAL` (bisher) erscheint als Profil „lokal“; zusätzlich `PROFILES_LOCAL = { key: { label, …felder } }`. Profilwahl `null` = neutral.
- **Migration** einmalig: gibt es noch keine Charakterliste, entsteht Charakter `c1` (Name aus dem Besitzer, Profil „lokal“, falls vorhanden) und die alten Schlüssel wandern in seinen Namensraum.
- **Zugriff** über `CHARS.key(k)`; `app.js` und `prepare.js` verwenden ihn statt fester Schlüssel.

## Risks / Trade-offs

- [Neu laden beim Wechsel] → kurz (unter 2 s), und Buchposition/Ansicht bleiben je Charakter gespeichert.
- [Löschen ist endgültig] → Rückfrage, letzter Charakter nicht löschbar; Export vorher empfohlen.
