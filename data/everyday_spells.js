// Alltagszauber: winzige, hochspezifische Sonderformen niedrigstufiger Zauber – wie sie Frieren sammelt.
// Jeder Eintrag erbt alle Regelfelder vom Basiszauber (`base`, englischer Name) und überschreibt nur, was er angibt.
// Alle Alltagszauber gelten als Grad 0 (halbe Seite).
//
// Felder: name (deutsch), base, description (Regeltext, deutsch), flavor (ein Satz im Ton des Buchs),
//   ess: Essenz-Hinweis { essenz: Gewicht }, signs: [[zeichen, "in"|"out"], …],
//   inspiration: Schlüssel aus EVERYDAY_SOURCES (Ideengeber), optional
//   optional: school, subschool, descriptors, casting_time, components, range, target, area, effect,
//   duration, saving_throw, spell_resistance
// Ideengeber (nur Anregungen – Regeltexte, Beschreibungen und Flavour sind eigene Formulierungen)
window.EVERYDAY_SOURCES = {
  frieren: { title: "Frieren – Beyond Journey's End: Magie-Übersicht", url: "https://frieren-anime.jp/special/magic/" },
  reddit: { title: "r/Frieren: „Come up with a mundane spell that would be absolutely irresistible to Frieren“", url: "https://www.reddit.com/r/Frieren/comments/1rialip/come_up_with_a_mundane_spell_that_would_be/" },
  spacebattles: { title: "„Fear Not The Elf Who Knows 10,000 Spells“ von Silver W. King (SpaceBattles)", url: "https://forums.spacebattles.com/threads/fear-not-the-elf-who-knows-10-000-spells-frieren-beyond-journeys-end-self-insert.1225442/" },
};

window.EVERYDAY_SPELLS = [
  // --- Küche ---------------------------------------------------------------------
  {
    name: "Apfelwandel", inspiration: "frieren", base: "Prestidigitation", school: "transmutation",
    target: "one apple touched", range: "touch", duration: "permanent",
    ess: { fluxus: 2, vita: 1 }, signs: [["window", "in"]],
    description: "Ein berührter roter Apfel wird grün oder ein grüner rot. Nur die Schale ändert sich; Geschmack, Reife und Nährwert bleiben gleich. Funktioniert nicht bei gelben Äpfeln.",
    flavor: "Wozu? Weil manche Leute grüne Äpfel einfach lieber sehen.",
  },
  {
    name: "Pfannkuchenwende", inspiration: "frieren", base: "Mage Hand",
    target: "one pancake in a pan within range", duration: "instantaneous",
    ess: { vis: 2, aer: 0.5 }, signs: [["levitation", "out"], ["convergence", "in"]],
    description: "Ein Pfannkuchen hebt sich, dreht sich um genau 180° und landet mittig in derselben Pfanne. Er reißt dabei nicht. Bei Pfannkuchen über 30 cm Durchmesser misslingt der Zauber zuverlässig.",
    flavor: "Die einzige Formel in diesem Buch, die ich vor Zeugen wirke.",
  },
  {
    name: "Salzentzug", base: "Purify Food and Drink",
    target: "one dish of food (one portion)", range: "touch",
    ess: { ordo: 2, terra: 1 }, signs: [["collection", "in"]],
    description: "Zieht überschüssiges Salz aus einer Portion Essen (etwa einer Pilzpfanne). Das Salz sammelt sich als Kruste am Rand des Gefäßes. Die Speise ist danach genau richtig gesalzen – nach dem Geschmack des Wirkers.",
    flavor: "Nachweislich hat diese Formel mehr Freundschaften gerettet als jede Heilmagie.",
  },
  {
    name: "Traubensäure", inspiration: "frieren", base: "Prestidigitation", school: "transmutation",
    target: "one bunch of grapes touched", range: "touch", duration: "permanent",
    ess: { fluxus: 1.5, vita: 1, aqua: 0.5 }, signs: [["window", "in"]],
    description: "Macht süße Weintrauben sauer. Nur in diese Richtung – der umgekehrte Weg ist nicht bekannt. Wirkt nicht auf Wein.",
    flavor: "Abgeschrieben aus der Sammlung einer Elfe, die angeblich tausend solcher Formeln besaß. Wozu? Unbekannt. Ich wirke sie trotzdem.",
  },
  {
    name: "Teewärme", inspiration: "reddit", base: "Prestidigitation", school: "transmutation",
    target: "one cup of tea touched", range: "touch", duration: "1 hour",
    ess: { ignis: 1.5, ordo: 1.5 }, signs: [["radial", "in"], ["repetition", "in"]],
    description: "Bringt eine Tasse Tee auf angenehme Trinktemperatur und hält sie dort eine Stunde lang. Wird der Tee umgegossen, endet der Zauber.",
    flavor: "Ordo hält die Wärme, Ignis gibt nur so viel, wie verloren geht. Ein Regelkreis.",
  },
  {
    name: "Ein Eiswürfel", base: "Create Water", school: "conjuration",
    effect: "one ice cube", duration: "instantaneous",
    ess: { aqua: 2, ordo: 1 }, signs: [["convergence", "in"]],
    description: "Erschafft einen einzigen, kristallklaren Eiswürfel direkt in einem Gefäß in Reichweite. Der Würfel schmilzt normal.",
    flavor: "Kälter als nötig. Ich habe den Ordo-Anteil absichtlich nicht korrigiert.",
  },
  {
    name: "Krustenknack", base: "Mending",
    target: "one slice of bread touched", range: "touch",
    ess: { ignis: 1, fluxus: 1, vita: 0.5 }, signs: [["repetition", "in"]],
    description: "Eine Scheibe altbackenes Brot wird wieder frisch und knusprig, als käme sie gerade aus dem Ofen. Verschimmeltes Brot bleibt verschimmelt.",
  },
  {
    name: "Gerechter Kuchen", base: "Arcane Mark", school: "divination",
    target: "one cake or pie touched", range: "touch", duration: "1 minute",
    ess: { ordo: 2, lux: 1 }, signs: [["direction", "out"]],
    description: "Feine Lichtlinien zeigen auf einem Kuchen, wie er in eine genannte Anzahl (2–12) exakt gleich großer Stücke zu schneiden ist. Streusel werden berücksichtigt.",
    flavor: "Ausnahmsweise eine Formel, die Streit verhindert, statt ihn zu gewinnen.",
  },
  {
    name: "Kochstellen-Pfiff", base: "Alarm", school: "abjuration",
    target: "one kettle touched", range: "touch", duration: "8 hours",
    ess: { ordo: 1.5, aer: 1, ignis: 0.5 }, signs: [["radial", "in"]],
    description: "Ein Wasserkessel gibt einen hellen Pfiff von sich, sobald sein Inhalt kocht – auch wenn er gar keine Pfeife hat.",
  },

  // --- Haushalt und Schreibstube ------------------------------------------------
  {
    name: "Klecksrückruf", base: "Mage Hand",
    target: "one fresh ink blot", range: "close (25 ft. + 5 ft./2 levels)", duration: "instantaneous",
    ess: { aqua: 1, ordo: 1.5, tempus: 0.5 }, signs: [["pull", "in"], ["collection", "in"]],
    description: "Ein frischer Tintenklecks (höchstens einige Herzschläge alt) hebt sich vom Pergament und fließt zurück ins Tintenfass. Getrocknete Tinte bleibt, wo sie ist.",
    flavor: "Für Kalligraphen unbezahlbar. Ich habe sie vor allen anderen gelernt.",
  },
  {
    name: "Federkielschliff", base: "Mending",
    target: "one quill touched", range: "touch",
    ess: { terra: 1, ordo: 1.5 }, signs: [["convergence", "in"]],
    description: "Schärft einen Federkiel zu einer perfekten Schreibspitze, wahlweise breit oder fein.",
  },
  {
    name: "Eselsohrglätter", inspiration: "reddit", base: "Mending",
    target: "one book or scroll touched", range: "touch",
    ess: { ordo: 2, terra: 0.5 }, signs: [["repetition", "in"], ["window", "in"]],
    description: "Entfernt alle Knicke, Eselsohren und Wellen aus den Seiten eines Buches oder einer Schriftrolle. Risse und Wasserflecken bleiben.",
    flavor: "Jedes Buch hat ihn verdient.",
  },
  {
    name: "Regalfinder", base: "Locate Object", level: 0,
    range: "30 ft.", area: "30-ft.-radius emanation centered on you", duration: "1 minute",
    ess: { lux: 1, mens: 1, spatium: 1 }, signs: [["direction", "out"], ["vision", "out"]],
    description: "Der Wirker nennt einen Buchtitel. Steht ein Buch mit genau diesem Titel innerhalb von 9 m, leuchtet sein Rücken kurz auf. Abweichende Schreibweisen findet der Zauber nicht.",
  },
  {
    name: "Schleifenbinder", base: "Open/Close",
    target: "one pair of laces or one ribbon", duration: "instantaneous",
    ess: { ordo: 1.5, vis: 1 }, signs: [["weave", "out"]],
    description: "Bindet Schnürsenkel oder ein Band zu einer festen Doppelschleife – oder löst einen beliebig verknoteten Knoten aus solchem Band.",
  },
  {
    name: "Sockenpaar", base: "Know Direction", school: "divination",
    target: "one sock touched", duration: "1 round",
    ess: { spatium: 1.5, ordo: 1 }, signs: [["direction", "out"]],
    description: "Der Wirker weiß, in welcher Richtung die zu einer berührten Socke passende Socke liegt, sofern sie sich innerhalb von 30 m befindet.",
    flavor: "Die Formel ist die einzige mir bekannte, die mit Paaren statt mit Einzelheiten rechnet. Theoretisch interessant.",
  },
  {
    name: "Wäscheduft", inspiration: "frieren", base: "Prestidigitation", school: "transmutation",
    target: "one set of clothing touched", range: "touch", duration: "1 day",
    ess: { aer: 1.5, vita: 1 }, signs: [["dispersion", "out"]],
    description: "Kleidung riecht einen Tag lang wie frisch gewaschen und in der Sonne getrocknet. Sie wird dabei nicht sauberer.",
  },
  {
    name: "Rostlöser", inspiration: "frieren", base: "Mending",
    target: "one bronze or iron object touched (up to 1 cu. ft.)", range: "touch",
    ess: { terra: 1.5, fluxus: 1, tempus: 0.5 }, signs: [["crush", "in"], ["repetition", "in"]],
    description: "Entfernt Rost oder Grünspan von einem Metallgegenstand und lässt ihn glänzen wie am Tag seiner Fertigung. Dient nicht zur Reparatur von Konstrukten.",
    flavor: "Eine alte Magierin soll damit jahrzehntelang die Statue eines Helden poliert haben.",
  },

  // --- Kleine Streiche ------------------------------------------------------------
  {
    name: "Teppichfunke", base: "Jolt",
    target: "one creature touched", range: "touch", saving_throw: "none", spell_resistance: "no",
    ess: { aer: 2, fluxus: 0.5 }, signs: [["convergence", "in"]],
    description: "Eine harmlose statische Entladung, genau wie nach dem Schlurfen über einen Wollteppich. Kein Schaden, keine Mali – nur ein hörbares Knistern und ein empörtes Zucken.",
    flavor: "Am Feldwebel erprobt. Ergebnis: Er weiß es bis heute nicht.",
  },
  {
    name: "Niesreiz", base: "Daze", descriptors: [],
    target: "one living creature", saving_throw: "Fortitude negates", duration: "instantaneous",
    ess: { aer: 1, vita: 1, mens: 0.5 }, signs: [["convergence", "in"]],
    description: "Das Ziel niest einmal kräftig. Es verliert keine Aktion und erleidet keine Mali. Kreaturen ohne Nase sind immun.",
  },
  {
    name: "Rückwärtsecho", base: "Ghost Sound",
    duration: "1 round",
    ess: { aer: 1.5, tempus: 1 }, signs: [["repetition", "in"]],
    description: "Die letzten drei Sekunden an Geräuschen im Umkreis von 3 m erklingen noch einmal – rückwärts.",
  },
  {
    name: "Bartzwirbel", base: "Prestidigitation", school: "transmutation",
    target: "one creature touched", range: "touch", duration: "1 hour", saving_throw: "Will negates (harmless)",
    ess: { fluxus: 1.5, vis: 0.5 }, signs: [["weave", "out"]],
    description: "Der Bart des Ziels zwirbelt sich zu zwei eleganten Spitzen und bleibt eine Stunde lang so. Bei Bartlosen erscheinen kurz zwei gezwirbelte Schatten auf der Oberlippe.",
  },

  // --- Natur und Wohlbefinden ----------------------------------------------------
  {
    name: "Blumenfeld", inspiration: "frieren", base: "Prestidigitation", school: "transmutation",
    area: "one 10-ft. square of grassland", range: "close (25 ft. + 5 ft./2 levels)", duration: "1 day",
    ess: { vita: 2.5, lux: 0.5 }, signs: [["dispersion", "out"], ["diamond", "out"]],
    description: "Auf einer Fläche von 3 m × 3 m Wiese öffnen sich für einen Tag Blüten in einer Farbe nach Wahl des Wirkers. Auf Stein, Schnee oder verdorbenem Boden wächst nichts.",
    flavor: "Völlig nutzlos. Ich habe sie dreimal gewirkt.",
  },
  {
    name: "Ein bestimmtes Unkraut", base: "Mage Hand",
    area: "one 5-ft. square of garden", duration: "instantaneous",
    ess: { vita: 1, vis: 1, ordo: 0.5 }, signs: [["pull", "in"]],
    description: "Zieht samt Wurzel alle Pflanzen einer genannten Art (z. B. Löwenzahn) aus einem Beet von 1,5 m × 1,5 m. Alle anderen Pflanzen bleiben unberührt.",
  },
  {
    name: "Mückenkreis", inspiration: "reddit", base: "Prestidigitation", school: "abjuration",
    area: "5-ft.-radius emanation centered on you", range: "personal", duration: "1 hour",
    ess: { ordo: 1.5, aer: 1 }, signs: [["radial", "in"], ["diamond", "out"]],
    description: "Mücken und Stechfliegen meiden einen Umkreis von 1,5 m um den Wirker. Größeres Ungeziefer und Schwärme ignorieren den Zauber.",
  },
  {
    name: "Schluckaufstille", base: "Stabilize",
    target: "one living creature touched", duration: "instantaneous",
    ess: { vita: 1.5, ordo: 1.5 }, signs: [["radial", "in"]],
    description: "Beendet sofort einen Schluckauf.",
    flavor: "Wirkt zuverlässiger als jedes Hausmittel. Und schneller als Erschrecken.",
  },
  {
    name: "Warme Zehen", inspiration: "reddit", base: "Endure Elements", level: 0,
    target: "one creature touched", duration: "8 hours",
    ess: { ignis: 1.5, ordo: 1 }, signs: [["window", "in"]],
    description: "Die Füße des Ziels bleiben acht Stunden lang angenehm warm. Schützt nicht vor Kälteschaden und nicht vor Witterung am restlichen Körper.",
  },
  {
    name: "Katzenschoß", base: "Charm Animal", level: 0,
    target: "one cat within range", duration: "1 minute", saving_throw: "Will negates",
    ess: { mens: 2, vita: 0.5 }, signs: [["pull", "in"]],
    description: "Eine Hauskatze kommt herüber und rollt sich eine Minute lang auf dem Schoß des Wirkers ein. Danach geht sie, wie Katzen eben gehen.",
  },
  {
    name: "Stiller Magen", base: "Ghost Sound", school: "illusion",
    target: "you", range: "personal", duration: "10 minutes",
    ess: { umbra: 1.5, aer: 0.5 }, signs: [["radial", "in"]],
    description: "Magenknurren des Wirkers ist zehn Minuten lang nicht zu hören. Für Ratssitzungen und Hinterhalte gleichermaßen geeignet.",
  },

  // --- Spürsinne ------------------------------------------------------------------
  {
    name: "Mondschattenspur", inspiration: "frieren", base: "Detect Poison",
    target: "one elf", duration: "instantaneous",
    ess: { lux: 1, mors: 1, mens: 0.5 }, signs: [["vision", "out"], ["convergence", "in"]],
    description: "Der Wirker erkennt, ob ein Elf in Reichweite Mondschattentinktur im Körper hat – ein seltenes elfisches Schlafgift. Andere Gifte und andere Völker zeigt der Zauber nicht an.",
    flavor: "Warum jemand diese Formel erfunden hat, steht nirgends. Das beunruhigt mich mehr als das Gift.",
  },
  {
    name: "Reifeprobe", base: "Detect Poison", school: "divination",
    target: "one fruit or vegetable", duration: "instantaneous",
    ess: { vita: 1.5, lux: 1 }, signs: [["vision", "out"]],
    description: "Zeigt an, ob eine Frucht oder ein Gemüse in Reichweite unreif, reif oder überreif ist.",
  },
  {
    name: "Namensschatten", base: "Memorize Page", level: 0,
    target: "you", range: "personal", duration: "instantaneous",
    ess: { mens: 2, tempus: 1 }, signs: [["collection", "in"]],
    description: "Der Wirker erinnert sich an den Namen einer Person, die vor ihm steht, sofern er den Namen innerhalb der letzten Woche mindestens einmal gehört hat.",
    flavor: "Peinliche Momente auf Empfängen: seither deutlich seltener.",
  },

  // --- Licht und Zier -------------------------------------------------------------
  {
    name: "Dochtsauberkeit", base: "Spark",
    target: "one candle or lamp wick", duration: "instantaneous",
    ess: { ignis: 1.5, ordo: 1 }, signs: [["convergence", "in"]],
    description: "Entzündet eine Kerze oder Lampe so, dass sie völlig rauchfrei brennt, bis sie gelöscht wird.",
  },
  {
    name: "Runder Kreidekreis", base: "Arcane Mark", school: "universal",
    target: "one chalk line touched", range: "touch", duration: "instantaneous",
    ess: { ordo: 2.5 }, signs: [["repetition", "in"], ["diamond", "out"]],
    description: "Eine von Hand gezogene Kreidelinie in Kreisform rundet sich zu einem geometrisch perfekten Kreis. Gibt keinen Bonus auf Rituale – aber es sieht besser aus.",
    flavor: "Die einzige Formel, die ich für eitel halte. Ich benutze sie täglich.",
  },
  {
    name: "Beschlagbild", base: "Ray of Frost", school: "evocation",
    target: "one pane of glass", range: "close (25 ft. + 5 ft./2 levels)", duration: "1 minute", saving_throw: "none", spell_resistance: "no",
    ess: { aqua: 1.5, lux: 0.5, fluxus: 0.5 }, signs: [["weave", "out"]],
    description: "Eine Glasscheibe beschlägt mit Eisblumen, die ein vom Wirker gedachtes Bild formen. Kein Schaden.",
  },

  // --- Aus der Sammlung der Elfe (Frieren-Liste) --------------------------------
  {
    name: "Schneeschale", inspiration: "frieren", base: "Ray of Frost",
    target: "one bowl of water touched", range: "touch", duration: "instantaneous", saving_throw: "none", spell_resistance: "no",
    ess: { aqua: 2, ordo: 1, aer: 0.3 }, signs: [["crush", "out"], ["dispersion", "out"]],
    description: "Verwandelt das Wasser in einer Schale in lockeren, feinen Rasierschnee. Sirup muss man selbst mitbringen.",
    flavor: "An einem heißen Tag im Feldlager beliebter als jede Kampfformel.",
  },
  {
    name: "Ölfleckenlöser", inspiration: "frieren", base: "Prestidigitation", school: "transmutation",
    target: "one stain on cloth or wood touched", range: "touch", duration: "instantaneous",
    ess: { ordo: 1.5, ignis: 0.5, aqua: 0.5 }, signs: [["collection", "in"], ["crush", "out"]],
    description: "Entfernt einen hartnäckigen Öl- oder Fettfleck vollständig. Gewöhnliche Prestidigitation scheitert an solchen Flecken; diese Formel kann nichts anderes.",
  },
  {
    name: "Schmuckspur", inspiration: "frieren", base: "Locate Object",
    target: "one piece of jewelry you have worn", range: "100 ft.", duration: "1 minute",
    ess: { spatium: 1.5, lux: 1, ordo: 0.5 }, signs: [["direction", "out"], ["pull", "in"]],
    description: "Zeigt die Richtung zu einem verlorenen Schmuckstück, das der Wirker selbst getragen hat, sofern es innerhalb von 30 m liegt. Fremder Schmuck bleibt unauffindbar.",
    flavor: "Eine Elfe soll damit einen Ring gesucht haben, der ihr wichtiger war als ein Drachenhort.",
  },
  {
    name: "Vogelfang", inspiration: "frieren", base: "Charm Animal",
    target: "one small wild bird within range", duration: "1 round", saving_throw: "Will negates",
    ess: { mens: 1.5, aer: 1, vita: 0.5 }, signs: [["pull", "in"], ["bird", "out"]],
    description: "Ein kleiner Wildvogel landet für eine Runde auf dem ausgestreckten Finger des Wirkers und lässt sich sanft festhalten. Danach fliegt er davon, ohne Schaden.",
  },
  {
    name: "Rückenkratzer", inspiration: "frieren", base: "Mage Hand",
    target: "you", range: "personal", duration: "1 minute",
    ess: { vis: 1.5, vita: 0.5, ordo: 0.5 }, signs: [["convergence", "in"], ["window", "in"]],
    description: "Eine unsichtbare Hand kratzt genau die Stelle am Rücken, die gerade juckt – auch die, an die man selbst nicht herankommt. Nach einer Minute ist die Stelle beruhigt.",
    flavor: "Die meistgewünschte Formel, wann immer ich sie vorführe.",
  },
  {
    name: "Schalenwacht", inspiration: "frieren", base: "Prestidigitation", school: "abjuration",
    target: "one egg touched", range: "touch", duration: "1 round",
    ess: { ordo: 2, vita: 0.5 }, signs: [["radial", "in"], ["window", "in"]],
    description: "Wird das berührte Ei aufgeschlagen, fällt kein einziges Stück Schale in die Schüssel. Die Splitter bleiben in der Hand des Wirkers.",
  },
  {
    name: "Silberader", inspiration: "frieren", base: "Detect Metal",
    area: "60-ft. cone", duration: "concentration, up to 1 minute",
    ess: { lux: 1, terra: 1.5, spatium: 0.5 }, signs: [["direction", "out"], ["vision", "out"]],
    description: "Zeigt an, ob sich im Kegel Silbererz befindet, und wenn ja, in welcher Richtung die stärkste Ader liegt. Bearbeitetes Silber und andere Metalle bleiben unsichtbar.",
  },
  {
    name: "Zungenschliff", inspiration: "frieren", base: "Guidance", school: "divination",
    target: "you", range: "personal", duration: "1 minute",
    ess: { mens: 1.5, ordo: 1, aer: 0.5 }, signs: [["convergence", "in"]],
    description: "Der Wirker kann eine Minute lang beliebige Zungenbrecher fehlerfrei und schnell aufsagen. Für Zauberformeln gibt es keinen Bonus – der Zauber ist bewusst so eng gefasst.",
    flavor: "Ich verhaspele mich nicht. Die Struktur der Formel ist dennoch lehrreich: Ordo auf den Lauten, nicht auf dem Geist.",
  },
  {
    name: "Stabholzflick", inspiration: "frieren", base: "Mending",
    target: "one broken wand or staff touched", range: "touch",
    ess: { vita: 1, ordo: 1.5, terra: 0.5 }, signs: [["crush", "in"], ["repetition", "in"]],
    description: "Fügt das Holz eines zerbrochenen Zauberstabs oder Stockes nahtlos zusammen. Verlorene Magie kehrt dadurch nicht zurück – aber der Stab sieht wieder aus wie neu.",
  },
  {
    name: "Zopfzauber", inspiration: "frieren", base: "Mage Hand", school: "transmutation",
    target: "your own hair", range: "personal", duration: "1 day",
    ess: { vis: 1, ordo: 1, fluxus: 0.5 }, signs: [["weave", "out"]],
    description: "Das eigene Haar flicht sich zu einer Frisur nach Wahl und hält einen Tag lang, auch bei Wind und Regen.",
  },

  // --- Wünsche aus der Taverne (Reddit-Sammlung) ---------------------------------
  {
    name: "Kartoffelschäler", inspiration: "reddit", base: "Mage Hand", school: "transmutation",
    target: "one potato touched", range: "touch", duration: "instantaneous",
    ess: { vis: 1, fluxus: 1, terra: 0.5 }, signs: [["crush", "out"], ["window", "in"]],
    description: "Eine Kartoffel wird in einem Atemzug hauchdünn geschält. Die Schale fällt als ein einziges, langes Band herab.",
    flavor: "Küchendienst im Lager: plötzlich war ich sehr beliebt.",
  },
  {
    name: "Wein zu Wasser", inspiration: "reddit", base: "Purify Food and Drink",
    target: "one cup of wine touched", range: "touch", duration: "1 hour",
    ess: { aqua: 2, ordo: 1 }, signs: [["collection", "in"]],
    description: "Ein Becher Wein wird für eine Stunde zu klarem Wasser – danach wieder zu Wein. Besonders wirksam bei Priestern, die ihr eigenes Wunder erwarten.",
    flavor: "Für den Kaplan der Garnison. Er hat es bis heute nicht verziehen.",
  },
  {
    name: "Trockene Socken", inspiration: "reddit", base: "Prestidigitation", school: "abjuration",
    target: "one pair of socks touched", range: "touch", duration: "1 day",
    ess: { ordo: 1.5, aer: 1, ignis: 0.3 }, signs: [["radial", "in"], ["window", "in"]],
    description: "Ein Paar Socken bleibt einen Tag lang trocken – bei Regen, beim Durchwaten eines Baches, sogar im Stiefel eines Kriegers.",
    flavor: "Die nützlichste Formel dieses Buches. Ich stehe dazu.",
  },
  {
    name: "Kühles Kissen", inspiration: "reddit", base: "Ray of Frost", school: "abjuration",
    target: "one pillow touched", range: "touch", duration: "8 hours", saving_throw: "none", spell_resistance: "no",
    ess: { aqua: 1.5, ordo: 1.5 }, signs: [["radial", "in"], ["repetition", "in"]],
    description: "Beide Seiten eines Kissens bleiben die ganze Nacht angenehm kühl.",
  },
  {
    name: "Kissenschüttler", inspiration: "reddit", base: "Mage Hand",
    target: "one pillow or blanket within range", duration: "instantaneous",
    ess: { vis: 1, aer: 1 }, signs: [["levitation", "out"], ["dispersion", "out"]],
    description: "Schüttelt ein Kissen oder eine Decke perfekt auf. Daunen verteilen sich gleichmäßig.",
  },
  {
    name: "Brotweiche", inspiration: "reddit", base: "Mending", school: "transmutation",
    target: "one loaf of bread touched", range: "touch",
    ess: { vita: 1, aqua: 1, fluxus: 0.5 }, signs: [["repetition", "in"]],
    description: "Macht hartes Brot wieder weich und fluffig. Das Gegenstück zum Krustenknack.",
  },
  {
    name: "Steinbrot", inspiration: "reddit", base: "Prestidigitation", school: "transmutation",
    target: "one loaf of bread touched", range: "touch", duration: "1 day",
    ess: { terra: 1.5, ordo: 1 }, signs: [["convergence", "in"]],
    description: "Weiches, frisches Brot wird hart wie ein Ziegel – für einen Tag. Warum man das wollen sollte, verrät die Vorlage nicht.",
    flavor: "Brauchbar als Wurfgeschoss. Das war vermutlich nicht der Zweck.",
  },
  {
    name: "Sirupquell", inspiration: "reddit", base: "Create Water",
    effect: "one cup of sweet syrup", duration: "instantaneous",
    ess: { aqua: 1.5, mens: 1, vita: 0.5 }, signs: [["dispersion", "out"]],
    description: "Erschafft einen Becher süßen Fruchtsirup in einer Sorte nach Wahl. Gehört zur Schneeschale wie die Kirsche zum Kuchen.",
  },
  {
    name: "Reibeisenrein", inspiration: "reddit", base: "Prestidigitation",
    target: "one cheese grater touched", range: "touch", duration: "instantaneous",
    ess: { ordo: 1.5, vis: 0.5 }, signs: [["collection", "in"]],
    description: "Säubert eine Käsereibe vollständig, jede einzelne Öse. Gewöhnliche Prestidigitation scheitert regelmäßig daran.",
  },
  {
    name: "Weckruf", inspiration: "reddit", base: "Alarm",
    target: "you", range: "personal", duration: "8 hours",
    ess: { tempus: 1.5, ordo: 1, aer: 0.5 }, signs: [["repetition", "in"]],
    description: "Weckt den Wirker zu einer vorher festgelegten Stunde mit einem leisen Glockenton, den nur er hört.",
    flavor: "Pünktlich zur Wachablösung. Die anderen danken es mir selten.",
  },
  {
    name: "Schimmelblick", inspiration: "reddit", base: "Detect Poison", school: "divination",
    target: "one loaf of bread or one cheese", duration: "instantaneous",
    ess: { lux: 1, mors: 1, vita: 0.5 }, signs: [["vision", "out"]],
    description: "Zeigt an, ob in einem Brot oder Käse versteckter Schimmel steckt und wo genau.",
  },
  {
    name: "Garnentwirrer", inspiration: "reddit", base: "Mage Hand",
    target: "one tangled string, chain or necklace within range", duration: "1 round",
    ess: { ordo: 1.5, vis: 1 }, signs: [["weave", "in"], ["pull", "out"]],
    description: "Entwirrt einen verknoteten Faden, eine Kette oder ein Halsband in einer Runde, ohne dass etwas reißt.",
  },
  {
    name: "Bettenmacher", inspiration: "reddit", base: "Unseen Servant",
    target: "one bed within range", duration: "1 minute",
    ess: { vis: 1, ordo: 1.5 }, signs: [["weave", "out"]],
    description: "Ein Bett macht sich selbst: Laken straff, Decke gefaltet, Kissen ausgerichtet.",
  },
  {
    name: "Käsereife", inspiration: "reddit", base: "Prestidigitation", school: "transmutation",
    target: "one cheese touched", range: "touch", duration: "permanent",
    ess: { fluxus: 1.5, vita: 1, tempus: 0.5 }, signs: [["repetition", "out"]],
    description: "Lässt einen milden Käse um einige Monate nachreifen: würziger, kräftiger, deutlich stärker riechend.",
  },
  {
    name: "Kordelretter", inspiration: "reddit", base: "Mage Hand",
    target: "one drawstring within a garment", range: "touch", duration: "instantaneous",
    ess: { vis: 1, ordo: 1 }, signs: [["pull", "in"]],
    description: "Zieht eine in den Saum gerutschte Kordel wieder heraus und gleicht beide Enden aus.",
  },
  {
    name: "Wasserwaage", inspiration: "reddit", base: "Know Direction",
    area: "one floor or tabletop within 30 ft.", duration: "1 round",
    ess: { ordo: 2, terra: 0.5 }, signs: [["direction", "out"]],
    description: "Zeigt, ob ein Boden oder Tisch exakt waagrecht ist, und wenn nicht, wo er abfällt.",
  },
  {
    name: "Kieselfort", inspiration: "reddit", base: "Mage Hand",
    target: "one pebble in your shoe", range: "personal", duration: "instantaneous",
    ess: { vis: 1, terra: 0.5 }, signs: [["pull", "out"]],
    description: "Entfernt ein Steinchen aus dem eigenen Schuh, ohne dass man ihn ausziehen muss.",
  },
  {
    name: "Heiße Suppe, kalte Schale", inspiration: "reddit", base: "Prestidigitation",
    target: "one bowl of food touched", range: "touch", duration: "10 minutes",
    ess: { ignis: 1.5, ordo: 1 }, signs: [["window", "in"], ["radial", "in"]],
    description: "Erwärmt das Essen in einer Schale, die Schale selbst bleibt kühl genug zum Halten.",
  },
  {
    name: "Regalordnung", inspiration: "reddit", base: "Unseen Servant",
    target: "one shelf of books within range", duration: "1 minute",
    ess: { ordo: 2, mens: 0.5 }, signs: [["direction", "out"], ["weave", "out"]],
    description: "Die Bücher eines Regalbretts sortieren sich nach Titel, Größe, Farbe oder Thema – nach Wahl des Wirkers.",
    flavor: "Sortiert nach Schule und Ordnung. Selbstverständlich.",
  },
  {
    name: "Dämonenjucken", inspiration: "reddit", base: "Itching Curse", level: 0,
    target: "one outsider with the demon subtype", duration: "1 round", saving_throw: "Will negates",
    ess: { malum: 1, mens: 1, fluxus: 0.5 }, signs: [["convergence", "in"]],
    description: "Ein Dämon verspürt eine Runde lang ein heftiges Jucken an einer unerreichbaren Stelle. Keine Mali – nur Würdeverlust.",
    flavor: "Wer gegen Dämonen kämpft, braucht Humor.",
  },
  {
    name: "Leichtgepäck", inspiration: "reddit", base: "Ant Haul", level: 0,
    target: "one backpack touched", range: "touch", duration: "8 hours",
    ess: { vis: 1, aer: 1, ordo: 0.5 }, signs: [["levitation", "out"]],
    description: "Ein Rucksack wiegt acht Stunden lang ein Zehntel weniger. Genug, um es auf dem Marsch zu merken, zu wenig, um darüber zu reden.",
  },

  // --- Volkszauber der Bergleute (Ideen nach „Fear Not The Elf Who Knows 10,000 Spells“) -------------------------------------------------
  {
    name: "Heißtee", inspiration: "spacebattles", base: "Create Water", school: "transmutation",
    target: "one cup of water touched", range: "touch", duration: "instantaneous",
    ess: { ignis: 1, vita: 1, aqua: 1 }, signs: [["window", "in"]],
    description: "Verwandelt einen Becher Wasser in heißen Kräutertee nach einem Rezept, das der Wirker kennt.",
    flavor: "Der älteste Volkszauber, den ich gefunden habe. Er hat jede Kälte überlebt.",
  },
  {
    name: "Wildprobe", inspiration: "spacebattles", base: "Detect Poison", school: "divination",
    target: "one carcass or piece of meat", duration: "instantaneous",
    ess: { vita: 1, mors: 1, lux: 0.5 }, signs: [["vision", "out"]],
    description: "Zeigt an, ob ein Stück Fleisch oder Wild krank, verdorben oder unbedenklich ist.",
  },
  {
    name: "Seilfeste", inspiration: "spacebattles", base: "Mending", school: "transmutation",
    target: "one rope touched (up to 50 ft.)", range: "touch", duration: "1 hour",
    ess: { ordo: 1.5, vis: 1, vita: 0.3 }, signs: [["weave", "out"], ["repetition", "in"]],
    description: "Ein Seil reißt eine Stunde lang nicht und erhält +2 auf seinen Bruchwert. Knoten lösen sich nicht von selbst.",
  },
  {
    name: "Lagerfeuerfunke", inspiration: "spacebattles", base: "Spark",
    target: "one pile of firewood, even if damp", duration: "instantaneous",
    ess: { ignis: 2, aer: 0.5 }, signs: [["convergence", "in"]],
    description: "Entzündet einen Haufen Feuerholz zuverlässig, auch wenn es feucht ist. Die Glut bleibt eine Nacht lang warm.",
  },
  {
    name: "Morgenguss", inspiration: "spacebattles", base: "Create Water", school: "conjuration",
    target: "you", range: "personal", duration: "1 round",
    ess: { aqua: 2, ignis: 0.5 }, signs: [["rain", "out"]],
    description: "Ein kurzer, warmer Wasserguss wäscht den Wirker von Kopf bis Fuß. Das Wasser verschwindet danach spurlos.",
  },
  {
    name: "Proviantfrische", inspiration: "spacebattles", base: "Preserve",
    target: "one day's rations touched", range: "touch", duration: "1 month",
    ess: { ordo: 1.5, mors: 0.5, tempus: 1 }, signs: [["repetition", "in"]],
    description: "Eine Tagesration bleibt einen Monat lang frisch, als wäre sie gerade erst zubereitet.",
  },
];
