## Context

Die App hat zwei Lehrwerke: die Fibel (Lehrheft, `data/primer.js` + `app/js/primer.js`) für arkane Klassen und „Vom Gebet“ (Vorspann-Seiten des Breviers) für göttliche Klassen. Beide hängen im Reiter „Lehre“ (`showLehre()` in `app.js`). Gebete entstehen in `prayer.js` (Ton nach Gesinnung, Zwiespalt über `DUAL`), Tagesgebete, Formelfragment und Andachtsblatt in `devotion.js`. Das Profil (`profile.local.js`) kennt Gottheit, Andachtsablauf, Feste, Monatsnamen und die Stimmen mit Hand und Tinte; das Lehrheft setzt Randnotizen dieser Stimmen nach Mindeststufe. Satz und Druck laufen über `TYPESET.typeset` und den gemeinsamen Seitenbetrachter `VIEWER.create`.

Das Vademecum ist das dritte Lehrwerk. Sein Inhalt ist im Gegensatz zur Fibel überwiegend gottheitsgebunden und damit privat. Der erste Inhalt (Nethys) ist ein Wendebuch, dessen Umfang sich aus dem Text ergibt (DSA-Vorbild umgerechnet etwa 2 × 40 Seiten A5); die Recherche liegt in `data/research/nethys.md`, der Entwurf in `data/research/vademecum-nethys-entwurf.md`.

## Goals / Non-Goals

**Goals:**
- Ein Band, der für jede Gottheit funktioniert: dünn aus Daten erzeugt, reich mit lokaler Datei
- Wendebuch als allgemeine Mechanik (nicht Nethys-Sonderfall), ausgelöst durch die vorhandene Zwiespalt-Erkennung
- Choräle als erster erzeugter Teil, der Formelsprachen und Lautschrift weiterverwendet
- Randnotizen und seitengenaue Verweise über beide Hälften
- Satz, Betrachter und Druck wie beim Lehrheft wiederverwenden

**Non-Goals:**
- Melodien und Noten (später mit dem Liederbuch des Barden)
- Änderungen an Brevier, Gebeten für den Tag, Andachtsblatt oder Andachtsbuch
- Übersetzung der Vademecum-Inhalte (nur Oberfläche zweisprachig)
- Regelwirkung (keine Werte, keine Gaben-Verwaltung; Kapitel IX ist nur Spielhinweis)

## Decisions

**1. Gerüst neutral, Inhalt lokal, eine Datei für alle Gottheiten.**
`data/vademecum.js` setzt `window.VADEMECUM` mit Kapitel-IDs, Titeln, Zahl der Choräle und den Texten für die dünne Fassung (z. B. Lückensätze für „Vom Wesen“ aus Gottheitsdaten). Die lokale Datei hängt jede Gottheit mit `VADEMECUM.local["nethys"] = {...}` ein und wird in `index.html` mit `onerror="this.remove()"` geladen wie `profile.local.js`. *Alternative:* Inhalt im Profil. Verworfen, weil das Profil charaktergebunden ist und ein Vademecum zur Gottheit gehört (zwei Charaktere desselben Tempels teilen es) und weil zehntausende Wörter das Profil sprengen. **Entscheidung:** eine Datei `data/vademecum.local.js` (gitignored), darin `VADEMECUM.local[<deityId>]`. Das hält `index.html` setting-neutral.

**2. Inhaltsformat wie die Fibel.**
Kapitel bestehen aus Abschnitten `{ id, title, text: [...], box?, epigraph?, aside? }`; `[[Begriff]]` und `glosses` wie im Lehrheft. Gebete und Liturgien als `{ kind: "prayer", title, use, lines: [...] }`, damit der Satz Verse zentriert und den Gebrauchshinweis kursiv davorsetzt (DSA-Muster: Anleitung, dann Text). Jeder Abschnitt hat eine stabile `id` als Ziel für Verweise.

**3. Wendebuch als zwei Folgen von Seiten.**
`vademecum.js` baut `{ halves: [{ key, name, parts }, { key, name, parts }], middle }` oder bei einfachem Buch `{ halves: [{...}] }`. Jede Hälfte wird für sich gesetzt (eigene Seitenzählung, eigenes Verzeichnis); die Mitte hängt an beide an, in der zweiten Hälfte mit Klasse `upside-down`. Der Betrachter bekommt pro Hälfte einen eigenen Zustand (`vademecumPos.<key>`), „Buch wenden“ tauscht nur die angezeigte Folge. *Alternative:* ein einziger fortlaufender Satz mit gedrehter zweiter Hälfte. Verworfen, weil Blättern und Verzeichnis dann gegen die Leserichtung laufen.

**4. Zwiespalt-Erkennung teilen.**
`PRAYER.dual()` liefert heute nur den Vers. Es bekommt eine Schwester `PRAYER.dualPair(d)`, die das Paar (`["Destruction","Protection"]`) liefert. Daraus entstehen Standardnamen der Hälften („Die Zerstörung“, „Der Schutz“) und die Standardaufteilung der Choräle über die Essenzen der Domänen (`TIME_DATA.domainEss`). Die lokale Datei überschreibt Namen, Reihenfolge und Aufteilung.

**5. Verweise nach dem Satz auflösen.**
Notizen und Texte tragen Verweise als `{{ref:half/abschnitt}}`. Beim Satz bleibt ein Platzhalter `<span class="vref" data-ref="...">S. ?</span>`. Nach dem Satz beider Hälften sucht die App die Seite, auf der das Ziel (`[data-anchor]`) steht, und setzt „☉ 23“ bzw. „☾ 23“ (Zeichen der Hälfte aus der lokalen Datei). Da die Ersetzung die Zeilenlänge kaum ändert, reicht ein Durchgang; der Platzhalter ist so breit wie eine dreistellige Zahl.

**6. Choräle aus der Formelmaschine.**
Für jeden gewählten Zauber `generateTexts(model).formula.lines` (wie beim Formelfragment), dann pro Vers deterministisch (Seed `deity|hymn|spellId`) eine oder zwei Silben streichen. Silbentrennung über die vorhandene Lautschrift (Silbenpunkte bzw. Vokalgruppen-Heuristik); gestrichen wird bevorzugt die betonte bzw. längste Silbe, nie die erste eines Verses, damit der Vers singbar anfängt. Lücke als „ – “ mit fester Breite. Auswahl: Zauber des Buches, gewichtet nach Schulen des Tempelschwerpunkts, je Hälfte nach Aufteilung (Entscheidung 4), höchstens `hymns` Stück je Hälfte.

**7. Reiter „Lehre“ mit Auswahl.**
`showLehre()` bekommt eine kleine Umschaltleiste (zwei Knöpfe) über dem Betrachter, nur wenn eine Gottheit gesetzt ist. Die Wahl liegt je Charakter in `store` (`lehreView`). Das Vademecum bekommt eigene Elemente `#vademecum-view`, eigenen Viewer und eigenen Druck-Cache-Schlüssel.

**8. Druck des Wendebuchs.**
Druckfolge: Hälfte A, Mitte, dann Hälfte B rückwärts mit `transform: rotate(180deg)` je Seite. Der Lochrand richtet sich nach der Lage im gebundenen Buch, nicht nach der Seitenzahl der Hälfte: Für gedrehte Seiten wird die Randseite gespiegelt, damit sie nach der Drehung wieder an der Bindung liegt. Leere Ausgleichsseite, wenn die Gesamtzahl ungerade ist.

**9. Ergänzungen aus der Umsetzung (Nethys-Text).**
- *Mitte je Hälfte:* Der Text hat zwei verschiedene Mittelseiten (dieselben Zeilen in umgekehrter Folge). `middle.halves` gibt jeder Hälfte ihre eigene Mitte; sie steht auf einer geraden Seite (sonst Vakatseite davor), die der anderen Hälfte steht im Betrachter kopfüber gegenüber. Ohne `halves` bleibt es bei einer gemeinsamen Seite.
- *Choral-Rahmen:* Die geschriebenen Choräle sind Rahmen (Titel, Schule, Grad, Anlass, Gemeindeantwort). Jeder nimmt einen erzeugten Choral aus dem Buch auf (gleiche Schule und Grad, sonst gleiche Schule); ohne passenden Zauber bleiben die geschriebenen Verse stehen. `fixed` für Choräle, die bewusst nicht im Buch stehen (Choräle der Seher). Platzhalter `kind: "slot"` halten die Reihenfolge des Textes.
- *Randnotizen in der lokalen Datei:* Statt in `profile.local.js` stehen die Notizen von Roderik, Antalia und Kirran unter `notes` im Eintrag der Gottheit, erzeugt aus den „Am Rand“-Blöcken des Textes. Sie erscheinen nur, wenn das aktive Profil die Stimme kennt; Hand und Tinte kommen weiter aus dem Profil. So bleibt der Text die einzige Quelle, und ein anderer Charakter desselben Tempels sieht sie nicht. Notizen im Profil (`PROFILE.vademecum.notes`) gelten zusätzlich.
- *Erzeugung:* `data/research/vademecum-local-build.py` (privat) erzeugt `data/vademecum.local.js` aus `data/research/vademecum-nethys-text.md`; nach Textänderungen neu ausführen.
- *Offene Fragen entschieden:* Zeichen der Hälften aus der lokalen Datei (○/●), sonst „A“/„B“ (auf dem Titelblatt nur eigene Zeichen). Die Mitte wird mitgezählt (letzte Seite jeder Hälfte). Kapitel IX trägt je Hälfte eigenen Titel (Anregungen / Regelskizzen).

## Risks / Trade-offs

- [Umfang des Inhalts: grob 20 000 Wörter Nethys-Text] → Schreibspur getrennt von der Technik. Die App wird zuerst mit dem Entwurf (Gliederung + Kapitel I) getestet; Kapitel kommen nacheinander hinzu.
- [Verweise verschieben den Satz] → Platzhalter mit fester Breite; Test, der nach dem Auflösen prüft, dass keine Seite überläuft.
- [Silbenstreichung bei Sprachen ohne Lautschrift-Silben] → Rückfall auf Vokalgruppen-Heuristik; mindestens eine Lücke je Vers ist im Test geprüft.
- [Gedrehte Seiten im Browserdruck] → In Chrome headless als PDF prüfen (Seitenreihenfolge, Drehung, Lochrand).
- [Paizo-Inhalte] → Lokale Texte sind eigene Erfindung, paraphrasieren nur Fakten; Recherche-Zitate bleiben in `data/research/`.
- [Zwei Lehrwerke im Reiter verwirren] → Auswahl nur sichtbar, wenn eine Gottheit gesetzt ist; die Wahl wird gemerkt.

## Migration Plan

Keine Datenmigration. Ohne `data/vademecum.local.js` funktioniert alles; für bestehende Charaktere mit Gottheit erscheint nur die neue Auswahl im Reiter „Lehre“. `.gitignore` erhält `data/vademecum.local.js`. Auf dem Branch `public` ist nur die neutrale Fassung sichtbar.

## Open Questions

- Zeichen der Hälften für Verweise (☉/☾, Hand/Auge, weiß/schwarz)? Vorschlag in der lokalen Datei, Standard „A“/„B“.
- Soll die Mitte gezählt werden (Seite 81 beider Hälften) oder ungezählt bleiben?
- Kapitel IX „Anregungen“ nur in einer Hälfte oder gespiegelt in beiden? Entwurf: Hüter = Spielhinweise, Zerstörer = Regelskizzen.
