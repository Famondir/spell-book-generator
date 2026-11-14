# In-game texts in two languages: style note and glossary

This note applies to every text that appears *inside the world*: the spellbook (titles, epithets,
summaries, theory, gestures, steps, failures, marginal notes), the primer („Fibel der Kreise“ /
*Primer of Circles*), everyday spells, the Table of Time, the breviary and the Vademecum.
Interface texts (`data/lang/de.js`, `en.js`) and rules values (`rules-terms.de.js`) are not
covered by it.

## Basic rules (both languages)

- **In-world, never meta.** The texts are written by people in the world: a master teaching an
  apprentice, a wizard annotating their own book, a priest writing for travellers. No word about
  apps, pages being generated, players, rules or game mechanics. „Level“, „DC“, „caster level“
  and similar never appear in in-game prose.
- **Classical arcane learning.** Workshop, quill, ink, parchment, wax, compass and rule, the seven
  wandering stars, the four qualities, the tria prima. No technology, no circuit look.
- **Rich, not compressed.** Atmosphere and flavour come before brevity. A translation keeps every
  sentence, every image, every anecdote and every aside of the original. It may add a short
  clause where English needs it to sound natural; it never summarises or drops material.
- **Latin stays Latin.** Essence names (`lux`, `umbra`, `ignis`, …), the formula text and the
  Latin core line are identical in both languages. Names of the alchemical principles
  (*Sulfur, Mercurius, Sal, tria prima*) stay Latin.
- **Affinity, not nearness.** For assignments of days, months, signs or deities to essences say
  *affinity* (de: Affinität) and *opposite pole* (de: Gegenpol), never „near/far“.
- **Markup is kept exactly.** `[[term]]` marks a red term with a gloss (the English text marks the
  English term, and the gloss key is that English term). `{{lesson:<id>}}` is a cross reference
  and stays untouched. Placeholders like `{name}` stay untouched. Typographic quotes: German
  „…“ and ‚…‘, English “…” and ‘…’. Dashes: German „ – “, English “ – ” (spaced en dash) as well.

## English voice

- **British spelling** (colour, grey, centre, practise as verb, mould, sceptre), as in an old
  handbook printed in Oxford. Date format follows `en-GB`.
- **The master addresses the apprentice as „you“**, directly and plainly, in the imperative for
  tasks: “Smooth your tablet until no line can be seen.” Not “The apprentice should …”.
- **Sentences of a craftsman, not of a scholar showing off.** Concrete nouns, strong verbs, short
  main clauses with the occasional long, balanced sentence. Avoid modern idiom („okay“, „basically“,
  „a lot of“), avoid archaisms („thou“, „‑eth“, „ye olde“). The register is that of a good
  19th-century craft manual or a well-written fantasy novel.
- **Proverbs and sayings** are rendered as proverbs, not as literal translations: short, rhythmic,
  often with parallel halves. „Erst die Hand, dann die Kraft.“ → “First the hand, then the power.”
- **German compounds** are resolved into natural English phrases, using the glossary where a term
  is fixed.
- **Humour** is dry and kept: „Nachweislich hat diese Formel mehr Freundschaften gerettet als jede
  Heilmagie.“ → “This formula has demonstrably saved more friendships than any healing magic.”

## Model sentences by text type

**Primer – reading piece (master to apprentice):**
- “The first surface every apprentice writes on is not a page but the [[wax tablet]]: a board with
  a raised rim, filled with darkly stained wax.”
- “The wax forgives everything, and that is exactly why one begins here.”
- “I have had apprentices who could light a candle after three weeks and still could not close a
  circle after three years.”

**Primer – gloss (definition, no full sentence needed, ends with a full stop):**
- *Stylus:* “A pin of bone, metal or hard wood. The point for writing, the flat end for smoothing.”

**Primer – task (imperative, countable):**
- “Draw twenty straight lines, smooth the wax, draw twenty arcs, smooth again.”
- “Show the master your smoothed tablet: he tests with a fingernail whether the surface is even.”
  (The master in neutral texts may be „he“ only where the German has „er“ for *der Meister*;
  prefer „the master“ or a construction without pronoun where it reads well.)

**Primer – box (praise, fear, saying):**
- praise: “‘The quill writes as if it had never done anything else.’”
- fear: “The ink that grew mould overnight in the open pot.”
- saying: “Spare your knife and you won't spare your quills.”

**Spellbook – title / epithet / summary:**
- “Seal of the Unbroken Threshold”, “the Patient Ward”, “A circle that holds the door against what
  comes from outside; it asks much ink and little strength.”

**Spellbook – marginal note (the owner writing for themselves, first person, brief):**
- “Draw the outer ring first, or the ink pools at the cornerstones.”

**Everyday spell – flavour (one sentence in the voice of the book's owner):**
- “Why? Because some people simply prefer to look at green apples.”

**Table of Time – day, month, sign:**
- “The day of gold. One begins nothing new but finishes what the week has started, and lays the
  finished work out in the light.”

**Breviary / Vademecum – prayer and rite:**
- Solemn, plain, rhythmical; second person to the deity where the German addresses it directly.

## Glossary (German → English)

Fixed terms. Use them consistently in every file; where a German term has a gloss in the primer,
the English gloss key is the term in this column.

### Persons, books, places
| Deutsch | English |
|---|---|
| Lehrling | apprentice |
| Meister, Meisterin | master |
| Geselle | journeyman |
| Werkstatt | workshop |
| Haus (die Lehrwerkstatt als Haushalt) | the house |
| Lehrheft | primer |
| Fibel der Kreise | Primer of Circles |
| Erstes Lehrheft | First Primer |
| Arbeitsheft | workbook |
| Reinbuch | fair book |
| Zauberbuch | spellbook |
| Lehrvertrag | indenture |
| Hausordnung | house rules |
| Prüfbogen | examination sheet |
| Prüfscheibe | test disc |
| Vermerk (des Meisters) | the master's mark |
| Gesellenstück | journeyman's piece |
| Brevier | breviary |
| Vademecum | Vademecum |
| Choral, Choräle | hymn, hymns |
| Stimmen am Rand | voices in the margin |
| Randnotiz | marginal note |
| loses Blatt | loose leaf |

### Craft: writing, ink, paper, seals
| Deutsch | English |
|---|---|
| Wachstafel | wax tablet |
| Griffel | stylus |
| Feder | quill |
| Holländern | dutching |
| Federmesser | penknife |
| Spalt (der Feder) | slit |
| Rußtinte | lampblack ink |
| Tusche | Indian ink |
| Eisengallustinte | iron gall ink |
| Galläpfel | oak galls |
| Vitriol | vitriol |
| Tintenfraß | ink corrosion |
| Rubrik | rubric |
| Zinnober | vermilion |
| Zaubertinte | spell ink |
| Grundtinte | base ink |
| Farbstoff | pigment |
| Seife / Lauge / Sieden | soap / lye / boiling |
| Alaun | alum |
| Pergament | parchment |
| Herse | herse |
| Haarseite / Fleischseite | hair side / flesh side |
| Bütte | vat |
| Schöpfform | mould |
| Gautschen | couching |
| Wasserzeichen | watermark |
| Siegel | seal |
| Siegellack | sealing wax |
| Schellack | shellac |
| Petschaft | signet |
| Stechen | pricking |
| Linieren | ruling |
| Zwölfknotenschnur | twelve-knot cord |
| Zauberkreide | spell chalk |
| Lochpause | pounce pattern |
| Zuschnitt | cutting plan |
| Federprobe | pen trial |
| Grundstriche | basic strokes |
| Duktus | ductus |
| Anschwingen | lead-in swing |
| rund / geschlossen / gleichmäßig (Prüfkriterien) | round / closed / even |
| Werkseite | working page |
| Spirale | spiral |
| Strafarbeit | penance chore |
| Ansicht des Meisters | master's view |
| Glossar | glossary |

### Geometry
| Deutsch | English |
|---|---|
| Zirkel / Lineal | compasses / rule |
| Mittelsenkrechte | perpendicular bisector |
| Goldener Schnitt | golden section |
| Näherung | approximation |
| Teilen (des Kreises) | dividing |
| Doppelkreis | double circle |
| Weitenringe | spacing rings |

### Theory of circles and glyphs
| Deutsch | English |
|---|---|
| Kreis | circle |
| Formel | formula |
| Kernzeile | core line |
| Fachformel | formal formula |
| Glyphe | glyph |
| Kern | core |
| Beizeichen | adjunct sign |
| Essenz, Essenzen | essence, essences |
| Hauptessenz | principal essence |
| Nebenessenz | secondary essence |
| Schule | school |
| Kernsiegel | core seal |
| Zeichenring | ring of signs |
| Ecksteine | cornerstones |
| alchemistisches Zeichen | alchemical sign |
| Zeitmarke | time mark |
| Schwellentor | threshold gate |
| Siegelband | seal band |
| Schriftband | script band |
| Umschrift | transliteration |
| Originalschrift | original script |
| Geste | gesture |
| Sigille | sigil |
| Satz der Absicht | statement of intent |
| Absicht | intent |
| Schnellglyphe | quick glyph |
| Vollzeichen / Kurzzeichen | full sign / short sign |
| Gestaltstrich | shape stroke |
| Gradpunkte | degree dots |
| Grad (eines Zaubers, in der Spielwelt) | degree |
| Grundformel | base formula |
| Wirken, wirken | casting, to cast (also „to work“ a formula) |
| Wirker | caster |
| Fehlschlag | miscast |
| Aufbau | construction |
| Lehre der Kreise | Doctrine of Circles |
| Zeitdrill / Blindzeichnung / Luftzeichnung | timed drill / blind drawing / air drawing |
| vor dreien (Prüfung vor drei Zeugen) | before three |
| Affinität | affinity |
| Gegenpol | opposite pole |
| Entsprechungen | correspondences |
| Beimischung | admixture |

### Cosmos, alchemy, time
| Deutsch | English |
|---|---|
| Sulfur, Mercurius, Sal, tria prima | (unchanged) |
| Qualitäten (warm, kalt, feucht, trocken) | qualities (hot, cold, moist, dry) |
| Quintessenz | quintessence |
| Luft, Feuer, Wasser, Erde | air, fire, water, earth |
| Wandelsterne | wandering stars |
| Sonne, Mond, Mars, Merkur, Jupiter, Venus, Saturn | Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn |
| Gold, Silber, Eisen, Quecksilber, Zinn, Kupfer, Blei | gold, silver, iron, quicksilver, tin, copper, lead |
| Kreis, Halbmond, Kreuz (Bausteine der Planetenzeichen) | circle, crescent, cross |
| alte Reihe (chaldäische Ordnung) | the old sequence |
| Siebenstern | heptagram |
| Wochenkreis | circle of the week |
| Tafel der Zeit | Table of Time |
| Jahresring | ring of the year |
| Sternkarte | star chart |
| Tierkreis | zodiac |
| Zeichen (des Tierkreises) | sign |
| Polarstern | pole star |
| Ekliptik | ecliptic |
| Schutzgott, Schutzgottheit | patron deity |
| Fest, Festkalender | feast, calendar of feasts |
| Steinbock, Wassermann, Fische, Widder, Stier, Zwillinge, Krebs, Löwe, Jungfrau, Waage, Skorpion, Schütze | Capricorn, Aquarius, Pisces, Aries, Taurus, Gemini, Cancer, Leo, Virgo, Libra, Scorpio, Sagittarius |

### Schools (in-game names)
The eight schools use their usual English names: Abjuration, Conjuration, Divination,
Enchantment, Evocation, Illusion, Necromancy, Transmutation (and Universal).

### Spells
| Deutsch | English |
|---|---|
| Alltagszauber | everyday spells |
| Sonderform von … | variant of … |
