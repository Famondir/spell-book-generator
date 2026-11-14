// Die magietheoretische Grundlage: Schulen, Essenzen, Zuordnungsregeln.
// Alles hier ist Daten – Anpassungen am Weltbild passieren in dieser Datei.
// Englische Texte: `en`-Unterobjekte an den Einträgen bzw. Tabellen mit Endung _EN (siehe Abschnitt „ENGLISCH“ unten).
(function () {
  // ---------------------------------------------------------------------------
  // SCHULEN – das „Verb“ eines Zaubers. Die Zahl bestimmt das Kernpolygon.
  // ---------------------------------------------------------------------------
  const SCHOOLS = {
    abjuration: {
      de: "Bannmagie", latin: "Ars Arcendi", verb: "abwehren, trennen, versiegeln", art: "abzuwehren, zu trennen und zu versiegeln", number: 4,
      figure: "Drei ineinanderliegende, gedrehte Quadrate",
      verbs: ["arceo", "munio", "claudo", "prohibeo", "tueor", "obsero"],
      principle:
        "Bannmagie zieht Grenzen. Ihr Kernsiegel ist das Quadrat – die Figur, die einen Raum vollständig umschließt und ihn gegen das Außen abgrenzt. Drei Quadrate liegen ineinander, jedes um ein Achtel gedreht: Grenze in Grenze, und keine Ecke fällt auf die der nächsten. Jede Bannformel definiert zuerst, was innen ist, und erst danach, was draußen bleiben muss.",
      essencePrior: { ordo: 0.45, vis: 0.3, lux: 0.15, bonum: 0.1 },
    },
    conjuration: {
      de: "Beschwörung", latin: "Ars Vocandi", verb: "herbeirufen, erschaffen, versetzen", art: "herbeizurufen, zu erschaffen und zu versetzen", number: 5,
      figure: "Pentagramm mit Torkreis",
      verbs: ["voco", "accerso", "creo", "adduco", "traho", "aperio"],
      principle:
        "Beschwörung öffnet Wege. Das Pentagramm ist ein Tor mit fünf Pfosten: vier halten die Öffnung, der fünfte – die Spitze – weist die Richtung, aus der etwas hereingeholt wird. Stoff, Wesen und Orte werden nicht erschaffen, sondern herbeigeholt; daher zählt die Präzision der Adresse mehr als die Menge an Kraft.",
      essencePrior: { spatium: 0.5, vis: 0.25, vita: 0.1, terra: 0.15 },
    },
    divination: {
      de: "Erkenntnis", latin: "Ars Cernendi", verb: "wahrnehmen, erkennen, offenbaren", art: "wahrzunehmen, zu erkennen und zu offenbaren", number: 3,
      figure: "Dreieck mit Auge",
      verbs: ["video", "cerno", "scio", "revelo", "intueor", "lego"],
      principle:
        "Erkenntnismagie verändert nichts außer dem Wissenden. Das Dreieck ist die einfachste stabile Figur: Beobachter, Beobachtetes und die Linie dazwischen. Erkenntnisformeln sind empfangend gebaut – ihre Vektoren zeigen nach innen, zum Wirker hin.",
      essencePrior: { lux: 0.4, mens: 0.35, tempus: 0.15, spatium: 0.1 },
    },
    enchantment: {
      de: "Verzauberung", latin: "Ars Ligandi", verb: "binden, lenken, betören", art: "zu binden, zu lenken und zu betören", number: 7,
      figure: "Siebenstern mit Spirale",
      verbs: ["ligo", "iubeo", "mulceo", "capio", "suadeo", "flecto"],
      principle:
        "Verzauberung greift in den Geist ein. Der Siebenstern lässt sich nicht in einem Zug gleichmäßig zeichnen, ohne die Linie zu kreuzen – so wie ein Gedanke nie geradeaus verläuft. Die Spirale im Herzen des Sterns ist der Haken, der sich im Denken des Ziels verfängt und es nach innen lenkt.",
      essencePrior: { mens: 0.65, ordo: 0.2, fluxus: 0.15 },
    },
    evocation: {
      de: "Hervorrufung", latin: "Ars Evocandi", verb: "entfesseln, entladen, formen", art: "zu entfesseln, zu entladen und zu formen", number: 6,
      figure: "Hexagramm mit Strahlen",
      verbs: ["erumpo", "emitto", "ardeo", "frango", "fulmino", "effundo"],
      principle:
        "Hervorrufung entfesselt Energie aus dem Nichts. Das Hexagramm verschränkt zwei Dreiecke – das aufsteigende der Energie und das absteigende der Form. Wo beide sich decken, entsteht der Entladungspunkt. Je schärfer die Form, desto weniger Kraft geht verloren.",
      essencePrior: { vis: 0.45, lux: 0.2, fluxus: 0.15, ignis: 0.1, aer: 0.1 },
    },
    illusion: {
      de: "Illusion", latin: "Ars Fingendi", verb: "täuschen, verbergen, vorspiegeln", art: "zu täuschen, zu verbergen und vorzuspiegeln", number: 8,
      figure: "Achtstern aus zwei verschobenen Quadraten",
      verbs: ["fingo", "simulo", "velo", "abdo", "mentior", "pingo"],
      principle:
        "Illusion ist Magie der Brechung. Der Achtstern entsteht aus zwei Quadraten, eines um ein Achtel gedreht – dieselbe Figur, nur verschoben, so wie ein Trugbild dieselbe Welt mit einem Versatz zeigt. Illusionsformeln enthalten stets eine Spiegelachse.",
      essencePrior: { umbra: 0.45, lux: 0.3, mens: 0.25 },
    },
    necromancy: {
      de: "Nekromantie", latin: "Ars Exanimandi", verb: "entziehen, beleben, verfallen lassen", art: "zu entziehen, zu beleben und verfallen zu lassen", number: 2,
      figure: "Fischblase über gesenktem Dreieck",
      verbs: ["exhaurio", "excito", "marceo", "exanimo", "sugo", "sepelio"],
      principle:
        "Nekromantie arbeitet mit der Zweiheit von Leben und Tod. Ihr Kernsiegel ist die Fischblase – zwei Kreise, deren Schnittmenge die Schwelle zwischen beiden Zuständen bildet. Das gesenkte Dreieck darunter zeigt die Flussrichtung: abwärts, in die Erde, in das Ende.",
      essencePrior: { mors: 0.65, mens: 0.1, malum: 0.1, vita: 0.15 },
    },
    transmutation: {
      de: "Verwandlung", latin: "Ars Mutandi", verb: "umformen, verstärken, verändern", art: "umzuformen, zu verstärken und zu verändern", number: 12,
      figure: "Quadratur des Kreises",
      verbs: ["muto", "verto", "formo", "augeo", "transfero", "solvo"],
      principle:
        "Verwandlung folgt dem alten alchemistischen Satz: Kreis – Quadrat – Dreieck – Kreis. Der Stoff wird erst verstanden, dann zerlegt, dann neu gefügt. Wer eine Stufe überspringt, zerstört, statt zu verwandeln.",
      essencePrior: { fluxus: 0.55, terra: 0.15, vita: 0.15, vis: 0.15 },
    },
    universal: {
      de: "Universalmagie", latin: "Ars Universa", verb: "Magie selbst bearbeiten", art: "die Magie selbst zu bearbeiten", number: 0,
      figure: "Achtspeichiges Rad",
      verbs: ["facio", "scribo", "teneo", "impleo", "rego"],
      principle:
        "Universalmagie hat kein eigenes Verb – sie bearbeitet das Gewebe der Magie selbst. Ihr Siegel ist das Rad, in dem jede Schule eine Speiche ist.",
      essencePrior: { ordo: 0.25, vis: 0.25, spatium: 0.25, fluxus: 0.25 },
    },
  };

  const SUBSCHOOLS = {
    summoning: { de: "Herbeirufung", ess: { spatium: 2 } },
    calling: { de: "Anrufung", ess: { spatium: 2, ordo: 1 } },
    teleportation: { de: "Versetzung", ess: { spatium: 3 } },
    creation: { de: "Erschaffung", ess: { vis: 1.5, terra: 0.5 } },
    healing: { de: "Heilung", ess: { vita: 3 } },
    scrying: { de: "Ausspähung", ess: { lux: 1, spatium: 1.5 } },
    charm: { de: "Bezauberung", ess: { mens: 2 } },
    compulsion: { de: "Zwang", ess: { mens: 1.5, ordo: 1 } },
    figment: { de: "Einbildung", ess: { lux: 1.5, umbra: 0.5 } },
    glamer: { de: "Sinnestäuschung", ess: { umbra: 1.5, lux: 0.5 } },
    pattern: { de: "Muster", ess: { lux: 1, mens: 1 } },
    phantasm: { de: "Trugbild", ess: { mens: 1.5, umbra: 1 } },
    shadow: { de: "Schatten", ess: { umbra: 2.5, spatium: 0.5 } },
    polymorph: { de: "Gestaltwandel", ess: { fluxus: 2.5, vita: 0.5 } },
    haunted: { de: "Spuk", ess: { mors: 1.5, mens: 1 } },
  };

  // ---------------------------------------------------------------------------
  // ESSENZEN – das „Substantiv“. 16 Essenzen in 8 Gegensatzpaaren,
  // abgeleitet aus einer klassischen Ebenenkosmologie (Namen über das Profil anpassbar).
  // ---------------------------------------------------------------------------
  const ESSENCES = [
    { id: "ignis", latin: "Ignis", de: "Feuer", opp: "aqua", plane: "Ebene des Feuers",
      words: ["ignis", "flamma", "ardor", "scintilla", "pyra"],
      gen: "der Flamme", adj: "glühend",
      text: "Ignis ist verzehrende Bewegung: Energie, die sich an Stoff nährt. Sie verlangt einen Abfluss – ein Ignis-Zauber ohne Gestaltvektor brennt den Wirker." },
    { id: "aqua", latin: "Aqua", de: "Wasser & Kälte", opp: "ignis", plane: "Ebene des Wassers",
      words: ["aqua", "unda", "gelu", "nix", "frigus"],
      gen: "der Tiefe", adj: "kalt",
      text: "Aqua ist die Essenz des Nachgebens und des Erstarrens. Fließend nimmt sie jede Form an; gebunden durch Ordo wird sie zu Eis und Kälte." },
    { id: "aer", latin: "Aer", de: "Luft, Blitz & Schall", opp: "terra", plane: "Ebene der Luft",
      words: ["aer", "ventus", "fulgur", "tonitrus", "spiritus"],
      gen: "des Sturms", adj: "flüchtig",
      text: "Aer ist Spannung und Schwingung. Blitz ist Luft, die ihre Spannung entlädt, Schall ist Luft, die erzittert. Aer-Formeln sind schnell, aber schwer zu halten." },
    { id: "terra", latin: "Terra", de: "Erde, Stein & Säure", opp: "aer", plane: "Ebene der Erde",
      words: ["terra", "saxum", "lapis", "acidum", "ferrum"],
      gen: "des Gesteins", adj: "schwer",
      text: "Terra ist Masse und Beständigkeit. Säure gilt als Terra im Zustand der Auflösung – Erde, die anderes Erdreich frisst." },
    { id: "vita", latin: "Vita", de: "Leben (positive Energie)", opp: "mors", plane: "Positive Energieebene",
      words: ["vita", "salus", "germen", "cruor", "flos"],
      gen: "des Lebens", adj: "lebendig",
      text: "Vita ist positive Energie: das Drängen zu Wachstum, Heilung und Fülle. Im Übermaß sprengt sie, was sie füllt." },
    { id: "mors", latin: "Mors", de: "Tod (negative Energie)", opp: "vita", plane: "Negative Energieebene",
      words: ["mors", "letum", "cinis", "tabes", "sepulcrum"],
      gen: "des Verfalls", adj: "welkend",
      text: "Mors ist negative Energie: Entzug, Erschöpfung, Ende. Sie ist nicht böse, nur hungrig. Untod ist Mors, die einen Körper als Gefäß hält." },
    { id: "lux", latin: "Lux", de: "Licht & Offenbarung", opp: "umbra", plane: "Lichtseite der Materiellen Ebene",
      words: ["lux", "fax", "radius", "splendor", "clarus"],
      gen: "des Lichts", adj: "hell",
      text: "Lux macht sichtbar. Sie trägt Bilder, Wissen und Wahrheit. Erkenntnis und Illusion bedienen sich beide ihrer – die eine, um zu zeigen, die andere, um Falsches zu zeigen." },
    { id: "umbra", latin: "Umbra", de: "Schatten & Verbergen", opp: "lux", plane: "Schattenebene",
      words: ["umbra", "tenebrae", "nox", "caligo", "velum"],
      gen: "des Schattens", adj: "verhüllt",
      text: "Umbra ist die Abwesenheit, die Gestalt annimmt. Die Schattenebene liegt wie ein dunkler Spiegel an der Welt – Umbra-Formeln greifen in diesen Spiegel." },
    { id: "mens", latin: "Mens", de: "Geist & Gedanke", opp: "vis", plane: "Astralebene",
      words: ["mens", "animus", "cogito", "recordatio", "somnium"],
      gen: "des Geistes", adj: "gedankenschwer",
      text: "Mens ist der Stoff, aus dem Gedanken und Gefühle sind; ihre Heimat ist die Astralebene. Mens wirkt nur auf Wesen mit Geist – an Konstrukten und Untoten gleitet sie ab." },
    { id: "vis", latin: "Vis", de: "Kraft & Stoff", opp: "mens", plane: "Ätherebene",
      words: ["vis", "impetus", "robur", "pondus", "moles"],
      gen: "der Kraft", adj: "unnachgiebig",
      text: "Vis ist reine Wirkung ohne Element: Kraft, die stößt, hält und trägt. Kraftfelder sind Vis in Ruhe, Geschosse Vis in Bewegung." },
    { id: "ordo", latin: "Ordo", de: "Ordnung & Bindung", opp: "fluxus", plane: "Ebene der reinen Ordnung",
      words: ["ordo", "lex", "vinculum", "sigillum", "norma"],
      gen: "der Ordnung", adj: "gebunden",
      text: "Ordo bindet, fixiert und erhält. Jede dauerhafte Magie braucht einen Anteil Ordo, sonst zerfällt sie, sobald der Wirker loslässt." },
    { id: "fluxus", latin: "Fluxus", de: "Wandel & Chaos", opp: "ordo", plane: "Ebene des reinen Chaos",
      words: ["fluxus", "mutatio", "turba", "vortex", "casus"],
      gen: "des Wandels", adj: "wandelbar",
      text: "Fluxus ist Veränderung an sich. Sie öffnet, was Ordo verschlossen hat – Verwandlung ist ohne Fluxus undenkbar, aber zu viel Fluxus macht das Ergebnis zufällig." },
    { id: "bonum", latin: "Bonum", de: "Das Gute (Himmel)", opp: "malum", plane: "Die oberen Ebenen",
      words: ["bonum", "sanctus", "gratia", "caelum", "pius"],
      gen: "der Gnade", adj: "geheiligt",
      text: "Bonum ist die Ausrichtung der oberen Ebenen. Für einen arkanen Wirker ist sie ein Werkzeug, kein Glaube – aber ein Werkzeug, das sich gegen Missbrauch sträubt." },
    { id: "malum", latin: "Malum", de: "Das Böse (Abgrund)", opp: "bonum", plane: "Die unteren Ebenen",
      words: ["malum", "nefas", "abyssus", "dirae", "scelus"],
      gen: "des Abgrunds", adj: "verderbt",
      text: "Malum ist die Ausrichtung der unteren Ebenen. Wo Risse zwischen den Welten klaffen, sickert sie ein; wer sie bannen will, muss sie lesen können." },
    { id: "spatium", latin: "Spatium", de: "Raum & Ebenen", opp: "tempus", plane: "Zwischen den Ebenen",
      words: ["spatium", "porta", "limes", "via", "distantia"],
      gen: "der Ferne", adj: "fern",
      text: "Spatium ist die Essenz des Abstands. Wer sie beherrscht, faltet Entfernung, öffnet Tore und verankert Dinge zwischen den Ebenen." },
    { id: "tempus", latin: "Tempus", de: "Zeit & Dauer", opp: "spatium", plane: "Dimension der Zeit",
      words: ["tempus", "hora", "mora", "aevum", "saeculum"],
      gen: "der Stunde", adj: "zeitlos",
      text: "Tempus ist die seltenste Essenz. Sie beschleunigt, verlangsamt und blickt voraus. Tempus-Formeln sind teuer, weil die Zeit sich gegen Störungen wehrt." },
  ];
  // Profil: Ebenennamen und Texte überschreiben
  const P = window.PROFILE || {};
  for (const e of ESSENCES) {
    if (P.planes && P.planes[e.id]) e.plane = P.planes[e.id];
    if (P.essenceText && P.essenceText[e.id]) e.text = P.essenceText[e.id];
  }
  const ESS = Object.fromEntries(ESSENCES.map((e) => [e.id, e]));

  // Deskriptor -> Essenzgewichte
  const DESCRIPTORS = {
    fire: { ignis: 3 }, cold: { aqua: 2, ordo: 1 }, electricity: { aer: 2, vis: 1 },
    acid: { terra: 2, aqua: 0.7 }, sonic: { aer: 2, vis: 1 }, force: { vis: 3 },
    light: { lux: 3 }, darkness: { umbra: 3 }, shadow: { umbra: 2.5, spatium: 0.5 },
    earth: { terra: 3 }, air: { aer: 3 }, water: { aqua: 3 },
    "mind-affecting": { mens: 2.5 }, emotion: { mens: 2, fluxus: 0.5 },
    fear: { mens: 1.5, umbra: 1, malum: 0.4 }, evil: { malum: 1.6 }, good: { bonum: 1.6 },
    lawful: { ordo: 1.6 }, chaotic: { fluxus: 1.6 }, death: { mors: 3 },
    curse: { malum: 1.2, ordo: 1, mors: 0.5 }, poison: { mors: 1.5, terra: 0.5, aqua: 0.5 },
    disease: { mors: 2, fluxus: 0.5 }, pain: { mens: 1, mors: 1 },
    "language-dependent": { mens: 1.5, ordo: 0.5 }, draconic: { ignis: 1, vis: 1 },
    polymorph: { fluxus: 3 }, meditative: { mens: 1, ordo: 1 },
  };

  // Stichworte in Name (zählt doppelt) und Beschreibung. Gewicht pro Treffer, gedeckelt.
  const KEYWORDS = [
    [/\b(?:fire|flame|burn|heat|smoke|ember|magma|lava)/g, { ignis: 1 }],
    [/\b(?:cold|ice|frost|freez|snow|water|wave|rain|mist|drown)/g, { aqua: 1 }],
    [/\b(?:electric|lightning|thunder|wind|air|gust|storm|fly|flight|levitat|sound|sonic|deaf)/g, { aer: 1 }],
    [/\b(?:stone|earth|rock|metal|iron|acid|mud|sand|crystal|dig|burrow)/g, { terra: 1 }],
    [/\b(?:heal|cure|life|living|grow|plant|vigor|restor|regenerat|breath)/g, { vita: 1 }],
    [/\b(?:undead|corpse|death|dead|negative energy|wither|decay|drain|bone|skeleton|zombie|ghoul|necro)/g, { mors: 1 }],
    [/\b(?:light|glow|bright|daylight|reveal|see invisib|true seeing|illuminat|blind)/g, { lux: 1 }],
    [/\b(?:shadow|dark|invisib|hide|hidden|conceal|obscur|disguise|silent)/g, { umbra: 1 }],
    [/\b(?:mind|thought|memor|dream|sleep|charm|confus|command|emotion|fear|telepath|language|insight|know)/g, { mens: 1 }],
    [/\b(?:force|push|shove|bludgeon|barrier|shield|wall|hand|missile|strength|weight|lift)/g, { vis: 1 }],
    [/\b(?:ward|bind|hold|web|net\b|entangl|lock|seal|protect|banish|dispel|anchor|paraly|stun|immobil|prevent)/g, { ordo: 1 }],
    [/\b(?:change|transform|shape|polymorph|random|chaos|alter|enlarge|reduce|warp|mutat)/g, { fluxus: 1 }],
    [/\b(?:holy|celestial|angel|good|bless|sacred|consecrat|purif)/g, { bonum: 1 }],
    [/\b(?:demon|devil|fiend|abyss|evil|curse|corrupt|profane|desecrat|hell)/g, { malum: 1 }],
    [/\b(?:teleport|plane|planar|extradimension|dimension|summon|portal|gate|distance|mile|travel|banish|scry)/g, { spatium: 1 }],
    [/\b(?:time|haste|slow|speed|initiative|delay|future|past|age|aging|temporal|augur|predict)/g, { tempus: 1 }],
  ];

  // Materialkomponenten: konkreter Stoff (englisch -> deutsch) und alchemistische Kategorie.
  // Reihenfolge zählt: Spezifisches vor Allgemeinem. Jeder Treffer ergibt ein deutsches Stoffwort,
  // die Kategorie bestimmt Glyphe und Essenzanteil.
  const MATERIAL_NOUNS = [
    // Edelsteine
    [/jacinth/, "Hyazinth", "lapis"], [/diamond/, "Diamant", "lapis"], [/ruby|rubies/, "Rubin", "lapis"],
    [/sapphire/, "Saphir", "lapis"], [/emerald/, "Smaragd", "lapis"], [/opal/, "Opal", "lapis"],
    [/pearl/, "Perle", "lapis"], [/jade/, "Jade", "lapis"], [/amethyst/, "Amethyst", "lapis"],
    [/agate/, "Achat", "lapis"], [/amber/, "Bernstein", "lapis"], [/topaz/, "Topas", "lapis"],
    [/garnet/, "Granat", "lapis"], [/aquamarine/, "Aquamarin", "lapis"], [/tourmaline/, "Turmalin", "lapis"],
    [/zircon/, "Zirkon", "lapis"], [/peridot|chrysolite/, "Peridot", "lapis"], [/beryl/, "Beryll", "lapis"],
    [/spinel/, "Spinell", "lapis"], [/citrine/, "Citrin", "lapis"], [/carnelian/, "Karneol", "lapis"],
    [/bloodstone/, "Blutstein", "lapis"], [/turquoise/, "Türkis", "lapis"], [/malachite/, "Malachit", "lapis"],
    [/lapis lazuli/, "Lapislazuli", "lapis"], [/moonstone/, "Mondstein", "luna"], [/coral/, "Koralle", "lapis"],
    [/quartz/, "Quarz", "lapis"], [/crystal/, "Kristall", "lapis"], [/mica/, "Glimmer", "lapis"],
    [/\bgem|jewel/, "Edelstein", "lapis"], [/onyx/, "Onyx", "onyx"], [/obsidian/, "Obsidian", "onyx"],
    [/hematite/, "Hämatit", "mars"], [/ivory/, "Elfenbein", "os"],
    // Metalle
    [/platinum/, "Platin", "platina"], [/gold/, "Gold", "sol"], [/silver/, "Silber", "luna"],
    [/copper/, "Kupfer", "venus"], [/brass|bronze/, "Messing", "venus"], [/\biron|steel|nail/, "Eisen", "mars"],
    [/magnet|lodestone/, "Magneteisen", "mars"], [/lead\b/, "Blei", "saturnus"], [/\btin\b|pewter/, "Zinn", "iupiter"],
    [/mercury|quicksilver/, "Quecksilber", "mercurius"], [/adamantine/, "Adamant", "metallum"],
    [/mithral/, "Mithral", "metallum"], [/cold iron/, "Kaltes Eisen", "mars"], [/\bmetal|wire/, "Metall", "metallum"],
    // Alchemie und Mineralien
    [/sulfur|brimstone/, "Schwefel", "sulfur"], [/phosphor/, "Phosphor", "sulfur"], [/guano/, "Fledermausdung", "sulfur"],
    [/saltpeter|niter/, "Salpeter", "sal"], [/\bsalt/, "Salz", "sal"], [/chalk/, "Kreide", "sal"], [/\blime\b/, "Kalk", "sal"],
    [/alchemical|reagent|elixir/, "Alchemistische Reagenzien", "mercurius"], [/charcoal|coal|soot/, "Kohle", "sulfur"],
    [/\bash/, "Asche", "sulfur"], [/\boil/, "Öl", "sulfur"], [/tallow|wax|candle/, "Wachs", "sulfur"], [/incense/, "Weihrauch", "herba"],
    // Erde und Wasser
    [/clay/, "Ton", "terra"], [/sand/, "Sand", "terra"], [/soil|dirt|earth|silt|mud/, "Erde", "terra"],
    [/pebble|stone|rock|marble|granite/, "Stein", "terra"], [/dust/, "Staub", "terra"],
    [/water|rain/, "Wasser", "aqua"], [/\bice\b|snow/, "Eis", "aqua"], [/vinegar/, "Essig", "aqua"],
    [/wine|ale|mead|beer/, "Wein", "aqua"], [/\btear/, "Träne", "aqua"], [/\bdrop/, "Tropfen", "aqua"],
    // Luft
    [/feather|quill/, "Feder", "aer"], [/bellows/, "Blasebalg", "aer"], [/smoke/, "Rauch", "aer"],
    // Körper und Tier
    [/blood/, "Blut", "sanguis"], [/bone|skull|tooth|teeth/, "Knochen", "os"], [/fang/, "Reißzahn", "os"],
    [/corpse|grave|dead/, "Totenstaub", "os"], [/(?:part|piece) of the creature|creature whose form|form you plan/, "Teil des Wesens", "pars"],
    [/hair|fur|whisker/, "Haar", "pars"], [/scale/, "Schuppe", "animalia"], [/hoof|horn/, "Huf", "animalia"],
    [/shell/, "Muschelschale", "animalia"], [/tentacle|octopus|squid/, "Tentakel", "animalia"],
    [/spider|web/, "Spinnennetz", "vinculum"], [/grasshopper|cricket|insect|beetle|firefly|bee\b/, "Insekt", "animalia"],
    [/rabbit|hare/, "Hasenpfote", "animalia"], [/snake|serpent/, "Schlangenhaut", "animalia"], [/urchin/, "Seeigel", "animalia"],
    [/turtle|tortoise/, "Schildkrötenpanzer", "animalia"], [/eye/, "Auge", "oculus"], [/\bear\b/, "Ohr", "oculus"],
    [/leather|hide|skin/, "Leder", "pellis"], [/flesh|meat/, "Fleisch", "animalia"], [/heart/, "Herz", "sanguis"],
    [/\begg/, "Ei", "animalia"], [/milk/, "Milch", "cibus"], [/animal|creature/, "Tierisches", "animalia"],
    // Pflanzen und Speise
    [/mistletoe|holly/, "Mistel", "herba"], [/rose/, "Rose", "mel"], [/honey|sugar|sweet|candy/, "Honig", "mel"],
    [/seed|acorn|nut\b|bean|peas/, "Samen", "herba"], [/leaf|leaves/, "Blatt", "herba"], [/root/, "Wurzel", "herba"],
    [/flower|petal|blossom/, "Blüte", "herba"], [/bark|wood|twig|stick|branch|reed|thorn|tree/, "Holz", "herba"],
    [/herb|plant|seaweed|moss|fungus|mushroom/, "Kraut", "herba"], [/carrot|food|bread|meal|morsel|fruit|apple/, "Speise", "cibus"],
    [/garlic|onion|pepper|spice/, "Gewürz", "cibus"], [/poison|venom|toxin/, "Gift", "venenum"],
    // Gewebe, Schrift, Spiegel
    [/fleece|wool/, "Wolle", "velum"], [/silk|gauze|cloth|veil|garment|cloak|ribbon|fabric/, "Stoff", "velum"],
    [/thread|string|rope|cord|knot|chain/, "Faden", "vinculum"], [/mirror/, "Spiegel", "speculum"],
    [/glass|lens|prism/, "Glas", "speculum"], [/\bink/, "Tinte", "scriptura"], [/parchment|paper|page|scroll|book|text|written|rune|contract/, "Schrift", "scriptura"],
    // Geweihtes, Münzen, Werkzeug, Waffen
    [/holy symbol|reliquary|offering|altar|prayer|sacred|incense/, "Geweihtes", "sacrum"], [/\bcoin|payment/, "Münze", "nummus"],
    [/key\b|lock/, "Schlüssel", "clavis"], [/tuning fork|bell|instrument|whistle|flute|drum/, "Instrument", "instrumentum"],
    [/needle|shovel|pulley|tool|marionette|puppet|glove|hammer|chisel|lever|replica|miniature|figurine|statuette/, "Werkzeug", "instrumentum"],
    [/sword|weapon|blade|dagger|arrow|shield|armor|knife|ammunition|bullet/, "Waffe", "arma"],
    [/laborator|supplies|equipment/, "Laborgerät", "instrumentum"], [/flask|vial|bottle|gourd/, "Phiole", "speculum"],
    [/chess|counter|die|dice|token/, "Spielstein", "instrumentum"], [/wand|staff|rod/, "Stab", "herba"],
    [/butter|lemon|biscuit|noodle|herring|goose|cheese|pickled/, "Speise", "cibus"], [/slime|maggot|locust|butterfly/, "Tierisches", "animalia"],
    [/flint|pumice|brick|meteorite|geode|talc/, "Gestein", "terra"], [/pollen|dandelion|algae|stem/, "Kraut", "herba"],
    [/medallion|bead|crest|coat of arms/, "Abzeichen", "nummus"], [/acid|alkaline/, "Säure", "terra"], [/powder/, "Pulver", "terra"],
    [/lantern|torch/, "Laterne", "sulfur"], [/glue|pitch|rubber|resin/, "Harz", "vinculum"], [/music|gong/, "Instrument", "instrumentum"],
  ];

  // Kategorie -> Essenzgewicht
  const TAG_ESS = {
    sulfur: { ignis: 1 }, sal: { ordo: 1 }, mercurius: { fluxus: 1 }, sol: { lux: 0.6, bonum: 0.4 }, luna: { lux: 0.5, umbra: 0.5 },
    venus: { aer: 1 }, mars: { vis: 0.6, terra: 0.4 }, saturnus: { ordo: 0.6, mors: 0.4 }, iupiter: { ordo: 0.5, vita: 0.5 },
    lapis: { ordo: 0.5, lux: 0.5 }, onyx: { mors: 0.6, umbra: 0.4 }, os: { mors: 1 }, sanguis: { vita: 0.6, mors: 0.4 },
    aer: { aer: 1 }, aqua: { aqua: 1 }, terra: { terra: 1 }, speculum: { lux: 0.6, umbra: 0.4 }, velum: { umbra: 1 },
    mel: { mens: 1 }, vinculum: { ordo: 1 }, herba: { vita: 1 }, oculus: { lux: 0.5, mens: 0.5 }, clavis: { ordo: 1 },
    platina: { ordo: 0.6, lux: 0.4 }, scriptura: { mens: 0.6, ordo: 0.4 }, pellis: { vita: 0.5, vis: 0.5 },
    animalia: { vita: 0.7, fluxus: 0.3 }, metallum: { vis: 0.6, ordo: 0.4 }, sacrum: { bonum: 0.7, ordo: 0.3 },
    nummus: { ordo: 0.6, lux: 0.4 }, arma: { vis: 1 }, cibus: { vita: 1 }, instrumentum: { ordo: 0.5, vis: 0.5 },
    venenum: { mors: 1 }, pars: { fluxus: 0.6, vita: 0.4 }, materia: {},
  };

  // Alchemistische Kategorien (Kurzbeschreibung für die Legende)
  const ALCHEMY = {
    sulfur: "Schwefel – das brennende Prinzip",
    sal: "Salz – das bindende Prinzip",
    mercurius: "Quecksilber – das wandelnde Prinzip",
    sol: "Gold (Sonne)",
    luna: "Silber (Mond)",
    venus: "Kupfer (Venus)",
    mars: "Eisen (Mars)",
    saturnus: "Blei (Saturn)",
    iupiter: "Zinn (Jupiter)",
    platina: "Platin – Sonne und Mond vereint",
    metallum: "Seltenes Metall",
    lapis: "Edelstein",
    onyx: "Dunkler Stein",
    os: "Gebein",
    sanguis: "Blut",
    pars: "Teil eines Wesens",
    animalia: "Tierisches",
    pellis: "Leder & Haut",
    aer: "Luftiges",
    aqua: "Flüssiges",
    terra: "Erdiges",
    speculum: "Spiegel & Glas",
    velum: "Gewebe & Schleier",
    mel: "Süße",
    vinculum: "Faden & Fessel",
    herba: "Kraut & Holz",
    cibus: "Speise",
    venenum: "Gift",
    oculus: "Sinnesorgan",
    clavis: "Schlüssel",
    scriptura: "Schrift & Pergament",
    sacrum: "Geweihtes",
    nummus: "Münze",
    instrumentum: "Werkzeug & Instrument",
    arma: "Waffe & Rüstung",
    materia: "Unbestimmter Stoff",
  };

  // Benannte Verbindungen zweier Essenzen
  const COMBOS = {
    "aqua+ordo": "Eis", "ignis+aer": "Blitzfeuer", "ignis+terra": "Magma", "aqua+terra": "Schlamm",
    "aqua+aer": "Nebel", "ignis+fluxus": "Wildfeuer", "ignis+lux": "Glut", "ignis+vis": "Feuersturm",
    "aer+vis": "Donnerschlag", "terra+ordo": "Bollwerk", "terra+vis": "Felsgewalt",
    "vita+bonum": "Segen", "vita+ordo": "Erhaltung", "vita+fluxus": "Wucherung", "vita+mens": "Beseelung",
    "mors+malum": "Verderbnis", "mors+ordo": "Bannfluch", "mors+mens": "Grabesgeist", "mors+umbra": "Totenschatten",
    "lux+mens": "Einsicht", "lux+spatium": "Fernsicht", "lux+umbra": "Trugbild", "lux+bonum": "Heiliges Licht", "lux+ordo": "Klarheit",
    "umbra+mens": "Albtraum", "umbra+spatium": "Schattenpfad", "umbra+fluxus": "Wandelschatten",
    "mens+ordo": "Befehl", "mens+fluxus": "Wahn", "mens+tempus": "Vorahnung", "mens+malum": "Versuchung",
    "vis+ordo": "Kraftschild", "vis+spatium": "Fernkraft", "vis+fluxus": "Entfesselung",
    "ordo+spatium": "Anker", "ordo+tempus": "Stillstand", "ordo+malum": "Fluchbann", "ordo+bonum": "Weihe",
    "fluxus+spatium": "Riss", "fluxus+tempus": "Zeitsprung", "fluxus+terra": "Umformung", "fluxus+malum": "Verwüstung",
    "spatium+tempus": "Faltung", "bonum+malum": "Urteil",
  };

  function comboName(a, b) {
    return COMBOS[a + "+" + b] || COMBOS[b + "+" + a] || null;
  }

  const SHAPES = {
    cone: { de: "Kegel", latin: "conus", figure: "Keil, der sich vom Zentrum öffnet" },
    line: { de: "Linie", latin: "linea", figure: "Doppellinie durch den Kreis" },
    ray: { de: "Strahl", latin: "radius", figure: "Einzelner Pfeil vom Kern zum Rand" },
    burst: { de: "Explosion", latin: "orbis", figure: "Strahlenkranz aus dem Kern" },
    spread: { de: "Ausbreitung", latin: "diffusio", figure: "Wellenlinien, die nach außen kriechen" },
    emanation: { de: "Ausströmung", latin: "emanatio", figure: "Konzentrische Wellen um den Kern" },
    cylinder: { de: "Säule", latin: "columna", figure: "Kreis mit senkrechter Achse" },
    wall: { de: "Wand", latin: "murus", figure: "Querbalken mit Zinnen" },
    sphere: { de: "Kugel", latin: "sphaera", figure: "Kreis mit Meridianen" },
    cube: { de: "Würfel", latin: "cubus", figure: "Würfel in Schrägsicht" },
    touch: { de: "Berührung", latin: "tactus", figure: "Vier Pfeile, die sich im Kern treffen" },
    self: { de: "Selbst", latin: "ipse", figure: "Schleife, die zum Kern zurückkehrt" },
    targets: { de: "Ziele", latin: "scopus", figure: "Zielknoten mit Verbindungslinien" },
    object: { de: "Gegenstand", latin: "res", figure: "Quadratischer Knoten" },
    summon: { de: "Herbeigerufenes", latin: "advena", figure: "Tor mit eingehendem Pfeil" },
    sensor: { de: "Sensor", latin: "oculus", figure: "Schwebendes Auge" },
    symbol: { de: "Zeichen", latin: "signum", figure: "Eingeschriebene Rune" },
    other: { de: "Besondere Form", latin: "forma", figure: "Offener Bogen" },
  };

  const RANGES = [
    { de: "Persönlich", latin: "in me", rings: 0 },
    { de: "Berührung", latin: "per tactum", rings: 1 },
    { de: "Nah", latin: "prope", rings: 2 },
    { de: "Mittel", latin: "procul", rings: 3 },
    { de: "Weit", latin: "longe", rings: 4 },
    { de: "Unbegrenzt", latin: "ultra fines", rings: 5 },
  ];

  const DURATIONS = {
    instant: { de: "Augenblicklich", latin: "momento", ring: "Gebrochener Ring – die Energie wird freigegeben" },
    rounds: { de: "Runden", latin: "per ictus", ring: "Ring mit Zeitmarken" },
    minutes: { de: "Minuten", latin: "per horulas", ring: "Gestrichelter Ring" },
    hours: { de: "Stunden", latin: "per horas", ring: "Doppelter Ring" },
    days: { de: "Tage", latin: "per dies", ring: "Dreifacher Ring" },
    permanent: { de: "Permanent", latin: "in aeternum", ring: "Geschlossener Schlangenring" },
    concentration: { de: "Konzentration", latin: "dum intendo", ring: "Ring mit Faden zum Wirker" },
    special: { de: "Besonders", latin: "ut scriptum", ring: "Ring mit Lücke" },
  };

  const SAVES = {
    will: { de: "Willen", gate: "Auge", gateGen: "des Auges", latin: "voluntas" },
    fort: { de: "Zähigkeit", gate: "Quader", gateGen: "des Quaders", latin: "robur" },
    ref: { de: "Reflex", gate: "Pfeil", gateGen: "des Pfeils", latin: "celeritas" },
    none: { de: "Keiner", gate: "–", latin: "" },
  };


  // ---------------------------------------------------------------------------
  // ZEICHEN – Modifikatoren am Zeichenring (nach dem Vorbild der „Signs“ aus Witch Hat Atelier).
  // Sie sagen, WIE die Essenz sich bewegt. Ausrichtung: "out" = vom Kern weg, "in" = zum Kern hin.
  // Gleichmäßig verteilte Zeichen wirken radial; Übergewicht auf einer Seite gibt die Richtung vor.
  // ---------------------------------------------------------------------------
  const SIGNS = {
    column: { de: "Säule", gen: "der Säule", text: "lässt die Essenz als Strahl oder Säule aus dem Kreis treten" },
    dispersion: { de: "Ausguss", gen: "des Ausgusses", text: "lässt die Essenz ausfließen und sich verteilen, statt sie zu schießen" },
    levitation: { de: "Schwebe", gen: "der Schwebe", text: "hebt den Träger des Kreises oder die Essenz über den Boden" },
    pull: { de: "Zug", gen: "des Zuges", text: "zieht Gleichartiges zum Kreis hin – umgekehrt gezeichnet: Stoß" },
    crush: { de: "Bruch", gen: "des Bruchs", text: "zerlegt Gefüge in Einzelteile – umgekehrt gezeichnet: Fügung" },
    direction: { de: "Richtung", gen: "der Richtung", text: "weist der Essenz den Weg; alle Richtungszeichen zusammen ergeben die Wirkrichtung" },
    convergence: { de: "Bündelung", gen: "der Bündelung", text: "verdichtet die Wirkung auf einen Punkt und macht Loses fest" },
    window: { de: "Fenster", gen: "des Fensters", text: "beschränkt die Wirkung auf das, worauf der Kreis liegt – den Träger selbst" },
    diamond: { de: "Raute", gen: "der Raute", text: "richtet die Wirkung auf das Umfeld statt auf den Träger" },
    collection: { de: "Sammlung", gen: "der Sammlung", text: "sammelt Stoff oder Kraft aus der Umgebung ein und speist sie dem Kreis zu" },
    radial: { de: "Dämpfung", gen: "der Dämpfung", text: "mindert die Essenz zu einer milden Form – Glut statt Flamme, Kühle statt Frost" },
    bolt: { de: "Geschoss", gen: "des Geschosses", text: "formt die Essenz zu einzelnen Geschossen" },
    repetition: { de: "Wiederkehr", gen: "der Wiederkehr", text: "setzt das Ziel immer wieder auf seinen Ausgangszustand zurück" },
    vision: { de: "Sicht", gen: "der Sicht", text: "greift in das Licht und damit in das, was gesehen wird" },
    weave: { de: "Gewebe", gen: "des Gewebes", text: "spinnt die Essenz zu Fäden, Bändern und Netzen" },
    enlarge: { de: "Maß", gen: "des Maßes", text: "lässt wachsen (Ecken nach außen) oder schrumpfen (Ecken nach innen)" },
    rain: { de: "Regen", gen: "des Regens", text: "lässt die Essenz von oben über ein Gebiet niedergehen" },
    bird: { de: "Bote", gen: "des Boten", text: "gibt der Essenz eine eigene, umherziehende Gestalt" },
  };

  // Regeln: [Regex auf Name+Effekt+Bereich+Beschreibung, Zeichen, Ausrichtung]
  const SIGN_RULES = [
    [/\b(?:pull|draw[s]? (?:the|it|them|creatures)|attract|reel)/, "pull", "in"],
    [/\b(?:push|repel|repuls|shove|hurl|knock(?:ed|s)? back|bull rush)/, "pull", "out"],
    [/\b(?:disintegrat|shatter|crumble|break[s]? |sunder|destroy)/, "crush", "out"],
    [/\b(?:mend|repair|reassembl|make whole)/, "crush", "in"],
    [/\b(?:levitat|fly|flight|float|hover|feather fall)/, "levitation", "out"],
    [/\b(?:absorb|drain|siphon|steal|gather|collect|store)/, "collection", "in"],
    [/\b(?:resist energy|endure elements|protection from energy|reduce[sd]? (?:the )?damage|dampen|suppress)/, "radial", "in"],
    [/\b(?:missile|bolt|arrow|dart|projectile|orb)/, "bolt", "out"],
    [/\b(?:repeat|restor|reset|rewind|again each|regenerat|permanent)/, "repetition", "in"],
    [/\b(?:invisib|see|sight|vision|light|blind|dazzl|illusion|image|figment)/, "vision", "out"],
    [/\b(?:web|net|rope|strand|thread|tentacle|vine|entangl|bind|chain)/, "weave", "out"],
    [/\b(?:enlarge|grow|increase[sd]? (?:in )?size|giant)/, "enlarge", "out"],
    [/\b(?:reduce person|shrink|reduce[sd]? (?:in )?size|diminish)/, "enlarge", "in"],
    [/\b(?:rain|hail|meteor|falling|fall(?:s)? from|downpour|storm)/, "rain", "out"],
    [/\b(?:messenger|sending|animal messenger|courier|familiar|servant|phantom steed|bird)/, "bird", "out"],
  ];


  // Lateinisches Formelvokabular -> Deutsch (für das Wortglossar im Buch)
  const GLOSSARY = {
    arce: "wehre ab", muni: "befestige", claude: "schließe", prohibe: "verwehre", tuere: "schütze", obsera: "verriegle",
    voca: "rufe", evoca: "rufe hervor", crea: "erschaffe", duc: "führe", trahe: "ziehe", aperi: "öffne",
    vide: "sieh", cerne: "erkenne", revela: "enthülle", intuere: "betrachte", lege: "lies",
    liga: "binde", iube: "befiehl", mulce: "besänftige", cape: "ergreife", suade: "überrede", flecte: "beuge",
    erumpe: "brich hervor", mitte: "sende", arde: "brenne", frange: "zerbrich", iacta: "wirf", ure: "verbrenne",
    finge: "forme vor", simula: "täusche vor", vela: "verhülle", abde: "verbirg", pinge: "male", decipe: "täusche",
    hauri: "schöpfe", excita: "erwecke", marcesce: "welke", neca: "töte", suge: "sauge", inhuma: "begrabe",
    muta: "wandle", verte: "wende", forma: "forme / Form", auge: "mehre", transfer: "übertrage", solve: "löse",
    fac: "mache", scribe: "schreibe", tene: "halte", imple: "erfülle", rege: "lenke",
    ignis: "Feuer", flamma: "Flamme", ardor: "Glut", scintilla: "Funke", pyra: "Scheiterhaufen",
    aqua: "Wasser", unda: "Welle", gelu: "Frost", nix: "Schnee", frigus: "Kälte",
    aer: "Luft", ventus: "Wind", fulgur: "Blitz", tonitrus: "Donner", spiritus: "Hauch",
    terra: "Erde", saxum: "Fels", lapis: "Stein", acidum: "Säure", ferrum: "Eisen",
    vita: "Leben", salus: "Heil", germen: "Keim", cruor: "Blut", flos: "Blüte",
    mors: "Tod", letum: "Untergang", cinis: "Asche", tabes: "Verwesung", sepulcrum: "Grab",
    lux: "Licht", fax: "Fackel", radius: "Strahl", splendor: "Glanz", clarus: "hell",
    umbra: "Schatten", tenebrae: "Finsternis", nox: "Nacht", caligo: "Nebel, Dunkel", velum: "Schleier",
    mens: "Geist", animus: "Seele", cogito: "ich denke", recordatio: "Erinnerung", somnium: "Traum",
    vis: "Kraft", impetus: "Ansturm", robur: "Stärke", pondus: "Gewicht", moles: "Masse",
    ordo: "Ordnung", lex: "Gesetz", vinculum: "Fessel", sigillum: "Siegel", norma: "Richtschnur",
    fluxus: "Fluss, Wandel", mutatio: "Veränderung", turba: "Wirbel", vortex: "Strudel", casus: "Zufall",
    bonum: "das Gute", sanctus: "heilig", gratia: "Gnade", caelum: "Himmel", pius: "fromm",
    malum: "das Böse", nefas: "Frevel", abyssus: "Abgrund", dirae: "Flüche", scelus: "Verbrechen",
    spatium: "Raum", porta: "Tor", limes: "Grenze", via: "Weg", distantia: "Entfernung",
    tempus: "Zeit", hora: "Stunde", mora: "Aufschub", aevum: "Ewigkeit", saeculum: "Zeitalter",
    conus: "Kegel", linea: "Linie", orbis: "Kreis", diffusio: "Ausbreitung", emanatio: "Ausströmung", columna: "Säule",
    murus: "Mauer", sphaera: "Kugel", cubus: "Würfel", tactus: "Berührung", ipse: "selbst", scopus: "Ziel",
    res: "Ding", advena: "Ankömmling", oculus: "Auge", signum: "Zeichen",
    in: "in", me: "mich", per: "durch", tactum: "Berührung", prope: "nah", procul: "fern", longe: "weit", ultra: "jenseits", fines: "Grenzen",
    momento: "im Augenblick", ictus: "Schläge", horulas: "Stündchen", horas: "Stunden", dies: "Tage", aeternum: "Ewigkeit",
    dum: "solange", intendo: "ich spanne an", ut: "wie", scriptum: "geschrieben",
    usque: "bis", ad: "zu", finem: "Ende", circulos: "Kreise", trans: "über … hinaus",
    maneat: "es bleibe", fiat: "es geschehe", sit: "es sei", duret: "es dauere", sic: "so",
    intra: "innerhalb", extra: "außerhalb", circulum: "Kreis", limitem: "Grenze", orbem: "Kreis",
    voluntas: "Wille", celeritas: "Schnelligkeit", aperta: "offen", frangatur: "es werde gebrochen", cedat: "es weiche", probetur: "es werde geprüft",
    materia: "Stoff", pretium: "Preis", donum: "Gabe", datum: "gegeben", solutum: "gelöst", consumptum: "verbraucht", est: "ist",
    ruptum: "gebrochen", transitum: "durchschritten", et: "und", cum: "mit",
    ordine: "in der Ordnung", gradu: "auf der Stufe", nodo: "am Knoten",
    primo: "erste", secundo: "zweite", tertio: "dritte", quarto: "vierte", quinto: "fünfte", sexto: "sechste", septimo: "siebte", octavo: "achte", nono: "neunte",
    clausum: "geschlossen", signatum: "besiegelt", audi: "höre", veni: "komm", esto: "sei", sta: "steh",
  };
  // Essenzanteile wie ein Rezept: ein Teil = ein Zehntel; Zwischenwerte mit „knapp“, „gut“, „stark“, „schwach“,
  // gleich lautende Anteile nebeneinander mit „je“ zusammengefasst.
  // Vis 32, Terra 28, Spatium 12, Vita 11, Aqua 9, Ignis 8 → „drei Teile Vis, knapp drei Teile Terra,
  // je ein starkes Teil Spatium und Vita, je ein schwaches Teil Aqua und Ignis“
  const NUM = ["", "ein", "zwei", "drei", "vier", "fünf", "sechs", "sieben", "acht", "neun", "zehn"];
  function partPhrase(pct) {
    pct = Math.round(pct); // ganzzahlig rechnen: d = Abweichung in Zehnteln eines Teils
    if (pct < 4) return "eine Spur";
    if (pct < 7) return "ein halbes Teil";
    const n = Math.round(pct / 10), d = pct - 10 * n;
    if (Math.abs(d) >= 4) {
      const lo = Math.floor(pct / 10);
      return lo === 1 ? "anderthalb Teile" : `${NUM[lo] || lo}einhalb Teile`;
    }
    if (n === 1) return d >= 1 ? "ein starkes Teil" : d <= -1 ? "ein schwaches Teil" : "ein Teil";
    const base = `${NUM[n] || n} Teile`;
    return d <= -2 ? "knapp " + base : d >= 3 ? "gut " + base : base;
  }
  function parts(essences, opts = {}) {
    const name = opts.name || ((id) => ESS[id].latin);
    const list = [...essences].filter((x) => x.pct > 0).sort((a, b) => b.pct - a.pct);
    const groups = [];
    for (const x of list) {
      const ph = partPhrase(x.pct);
      const last = groups[groups.length - 1];
      if (last && last.ph === ph) last.ids.push(x.id);
      else groups.push({ ph, ids: [x.id] });
    }
    return groups
      .map((g) => (g.ids.length > 1 ? `je ${g.ph} ${g.ids.slice(0, -1).map(name).join(", ")} und ${name(g.ids[g.ids.length - 1])}` : `${g.ph} ${name(g.ids[0])}`))
      .join(", ");
  }

  // ===========================================================================
  // ENGLISCH – parallele In-Game-Texte (Stilnotiz und Glossar: data/lang/README.md).
  // Konvention: Jede Tabelle mit deutschem Text bekommt je Eintrag ein Unterobjekt `en`
  // mit denselben Schlüsseln (auch `de`: dort steht dann der englische Name). Reine Stringtabellen
  // (ALCHEMY, COMBOS, GLOSSARY, MATERIAL) haben eine Parallele mit Endung _EN. Lateinisches
  // (latin, verbs, words, Formeltext) und Zahlen gibt es nur einmal. Die en-Objekte werden unten
  // angehängt, damit die deutschen Werte unangetastet bleiben; die Profil-Überschreibung von
  // plane/text oben gilt nur für Deutsch.
  //
  // Satzrahmen (englisch), analog zu den deutschen in textgen.js:
  //   SCHOOLS.en.art   : "<School> is the art of ${art}."   art = Gerundien ohne „of“, z. B. „warding, severing and sealing“;
  //                      der erste Teil (vor dem Komma) steht auch allein: „Instead of ${art.split(",")[0]} …“
  //   SCHOOLS.en.verb  : Aufzählung im Infinitiv ohne „to“: „ward, sever, seal“
  //   SCHOOLS.en.figure: Nominalphrase („Three nested, rotated squares“), steht nach „The core seal shows …“
  //   ESSENCES.en.gen  : „The Seal ${gen}“ → „of the flame“ (präpositionale Phrase, mit Artikel)
  //   ESSENCES.en.adj  : Adjektiv vor einem Nomen („a glowing ring“)
  //   ESSENCES.en.plane: Eigenname der Ebene („Plane of Fire“)
  //   SAVES.en.gate    : Nomen („Eye“); gateGen: „the gate ${gateGen}“ → „of the eye“
  //   SIGNS.en.gen     : „The sign ${gen}“ → „of the column“;
  //                      SIGNS.en.text: Verbphrase in der 3. Person: „The sign of the column ${text}.“ → „lets the essence …“
  // ===========================================================================
  const SCHOOLS_EN = {
    abjuration: {
      de: "Abjuration", verb: "ward, sever, seal", art: "warding, severing and sealing",
      figure: "Three nested, rotated squares",
      principle:
        "Abjuration draws boundaries. Its core seal is the square – the figure that wholly encloses a space and sets it apart from the outside. Three squares lie one within the other, each turned by an eighth: boundary within boundary, and no corner falls upon that of the next. Every ward first defines what is inside, and only afterwards what must be kept out.",
    },
    conjuration: {
      de: "Conjuration", verb: "call forth, create, transport", art: "calling forth, creating and transporting",
      figure: "Pentagram with a gate ring",
      principle:
        "Conjuration opens ways. The pentagram is a gate with five posts: four hold the opening, the fifth – the point – shows the direction from which something is brought in. Matter, creatures and places are not created but fetched; for that reason the precision of the address counts for more than the amount of power.",
    },
    divination: {
      de: "Divination", verb: "perceive, discern, reveal", art: "perceiving, discerning and revealing",
      figure: "Triangle with an eye",
      principle:
        "Divination changes nothing except the one who knows. The triangle is the simplest stable figure: the observer, the observed and the line between them. Divinatory formulas are built to receive – their vectors point inwards, towards the caster.",
    },
    enchantment: {
      de: "Enchantment", verb: "bind, steer, beguile", art: "binding, steering and beguiling",
      figure: "Heptagram with a spiral",
      principle:
        "Enchantment reaches into the mind. The heptagram cannot be drawn evenly in a single stroke without crossing the line – just as a thought never runs straight ahead. The spiral at the heart of the star is the hook that catches in the target's thinking and steers it inwards.",
    },
    evocation: {
      de: "Evocation", verb: "unleash, discharge, shape", art: "unleashing, discharging and shaping",
      figure: "Hexagram with rays",
      principle:
        "Evocation unleashes energy out of nothing. The hexagram interlaces two triangles – the rising one of energy and the descending one of form. Where the two coincide, the point of discharge arises. The sharper the form, the less power is lost.",
    },
    illusion: {
      de: "Illusion", verb: "deceive, conceal, feign", art: "deceiving, concealing and feigning",
      figure: "Octagram of two displaced squares",
      principle:
        "Illusion is the magic of refraction. The octagram arises from two squares, one turned by an eighth – the same figure, merely displaced, just as a phantom shows the same world with an offset. Illusory formulas always contain an axis of reflection.",
    },
    necromancy: {
      de: "Necromancy", verb: "withdraw, quicken, let decay", art: "withdrawing, quickening and letting decay",
      figure: "Vesica piscis above an inverted triangle",
      principle:
        "Necromancy works with the duality of life and death. Its core seal is the vesica piscis – two circles whose overlap forms the threshold between the two states. The inverted triangle beneath it shows the direction of flow: downwards, into the earth, into the end.",
    },
    transmutation: {
      de: "Transmutation", verb: "reshape, strengthen, alter", art: "reshaping, strengthening and altering",
      figure: "Squaring of the circle",
      principle:
        "Transmutation follows the old alchemical saying: circle – square – triangle – circle. The substance is first understood, then taken apart, then joined anew. Whoever skips a stage destroys instead of transforming.",
    },
    universal: {
      de: "Universal", verb: "work upon magic itself", art: "working upon magic itself",
      figure: "Eight-spoked wheel",
      principle:
        "Universal magic has no verb of its own – it works upon the very fabric of magic. Its seal is the wheel, in which every school is a spoke.",
    },
  };

  const SUBSCHOOLS_EN = {
    summoning: "Summoning", calling: "Calling", teleportation: "Teleportation", creation: "Creation", healing: "Healing",
    scrying: "Scrying", charm: "Charm", compulsion: "Compulsion", figment: "Figment", glamer: "Glamer",
    pattern: "Pattern", phantasm: "Phantasm", shadow: "Shadow", polymorph: "Polymorph", haunted: "Haunted",
  };

  const ESSENCES_EN = {
    ignis: { de: "Fire", plane: "Plane of Fire", gen: "of the flame", adj: "glowing",
      text: "Ignis is consuming motion: energy that feeds on matter. It demands an outlet – an Ignis spell without a shape vector burns its caster." },
    aqua: { de: "Water & Cold", plane: "Plane of Water", gen: "of the deep", adj: "cold",
      text: "Aqua is the essence of yielding and of stiffening. Flowing, it takes on any form; bound by Ordo, it becomes ice and cold." },
    aer: { de: "Air, Lightning & Sound", plane: "Plane of Air", gen: "of the storm", adj: "fleeting",
      text: "Aer is tension and vibration. Lightning is air discharging its tension, sound is air that trembles. Aer formulas are quick, but hard to hold." },
    terra: { de: "Earth, Stone & Acid", plane: "Plane of Earth", gen: "of the rock", adj: "heavy",
      text: "Terra is mass and permanence. Acid is counted as Terra in the state of dissolution – earth that devours other earth." },
    vita: { de: "Life (positive energy)", plane: "Positive Energy Plane", gen: "of life", adj: "living",
      text: "Vita is positive energy: the urge towards growth, healing and plenty. In excess it bursts what it fills." },
    mors: { de: "Death (negative energy)", plane: "Negative Energy Plane", gen: "of decay", adj: "withering",
      text: "Mors is negative energy: withdrawal, exhaustion, ending. It is not evil, merely hungry. Undeath is Mors holding a body as a vessel." },
    lux: { de: "Light & Revelation", plane: "Light side of the Material Plane", gen: "of the light", adj: "bright",
      text: "Lux makes visible. It carries images, knowledge and truth. Divination and illusion both make use of it – the one to show, the other to show what is false." },
    umbra: { de: "Shadow & Concealment", plane: "Plane of Shadow", gen: "of the shadow", adj: "veiled",
      text: "Umbra is absence that takes on shape. The Plane of Shadow lies against the world like a dark mirror – Umbra formulas reach into that mirror." },
    mens: { de: "Mind & Thought", plane: "Astral Plane", gen: "of the mind", adj: "heavy with thought",
      text: "Mens is the stuff of which thoughts and feelings are made; its home is the Astral Plane. Mens works only on beings with a mind – on constructs and undead it slides off." },
    vis: { de: "Force & Matter", plane: "Ethereal Plane", gen: "of force", adj: "unyielding",
      text: "Vis is pure effect without element: force that pushes, holds and bears. Force fields are Vis at rest, missiles Vis in motion." },
    ordo: { de: "Order & Binding", plane: "Plane of Pure Order", gen: "of order", adj: "bound",
      text: "Ordo binds, fixes and preserves. All lasting magic needs a share of Ordo, or it falls apart the moment the caster lets go." },
    fluxus: { de: "Change & Chaos", plane: "Plane of Pure Chaos", gen: "of change", adj: "changeable",
      text: "Fluxus is change in itself. It opens what Ordo has closed – transmutation is unthinkable without Fluxus, but too much Fluxus makes the result random." },
    bonum: { de: "The Good (Heaven)", plane: "The Upper Planes", gen: "of grace", adj: "hallowed",
      text: "Bonum is the alignment of the upper planes. For an arcane caster it is a tool, not a creed – but a tool that bristles against misuse." },
    malum: { de: "The Evil (the Abyss)", plane: "The Lower Planes", gen: "of the abyss", adj: "depraved",
      text: "Malum is the alignment of the lower planes. Where rifts gape between the worlds, it seeps in; whoever would banish it must be able to read it." },
    spatium: { de: "Space & Planes", plane: "Between the Planes", gen: "of the distance", adj: "distant",
      text: "Spatium is the essence of distance. Whoever commands it folds distance, opens gates and anchors things between the planes." },
    tempus: { de: "Time & Duration", plane: "Dimension of Time", gen: "of the hour", adj: "timeless",
      text: "Tempus is the rarest essence. It hastens, slows and looks ahead. Tempus formulas are costly, because time resists disturbance." },
  };

  const SHAPES_EN = {
    cone: { de: "Cone", figure: "Wedge opening from the centre" },
    line: { de: "Line", figure: "Double line through the circle" },
    ray: { de: "Ray", figure: "Single arrow from the core to the rim" },
    burst: { de: "Burst", figure: "Ring of rays from the core" },
    spread: { de: "Spread", figure: "Wavy lines creeping outwards" },
    emanation: { de: "Emanation", figure: "Concentric waves around the core" },
    cylinder: { de: "Column", figure: "Circle with a vertical axis" },
    wall: { de: "Wall", figure: "Crossbar with battlements" },
    sphere: { de: "Sphere", figure: "Circle with meridians" },
    cube: { de: "Cube", figure: "Cube in oblique view" },
    touch: { de: "Touch", figure: "Four arrows meeting in the core" },
    self: { de: "Self", figure: "Loop returning to the core" },
    targets: { de: "Targets", figure: "Target knot with connecting lines" },
    object: { de: "Object", figure: "Square knot" },
    summon: { de: "Summoned", figure: "Gate with an incoming arrow" },
    sensor: { de: "Sensor", figure: "Hovering eye" },
    symbol: { de: "Sign", figure: "Inscribed rune" },
    other: { de: "Special shape", figure: "Open arc" },
  };

  // gleiche Reihenfolge wie RANGES
  const RANGES_EN = [{ de: "Personal" }, { de: "Touch" }, { de: "Close" }, { de: "Medium" }, { de: "Long" }, { de: "Unlimited" }];

  const DURATIONS_EN = {
    instant: { de: "Instantaneous", ring: "Broken ring – the energy is released" },
    rounds: { de: "Rounds", ring: "Ring with time marks" },
    minutes: { de: "Minutes", ring: "Dashed ring" },
    hours: { de: "Hours", ring: "Double ring" },
    days: { de: "Days", ring: "Triple ring" },
    permanent: { de: "Permanent", ring: "Closed serpent ring" },
    concentration: { de: "Concentration", ring: "Ring with a thread to the caster" },
    special: { de: "Special", ring: "Ring with a gap" },
  };

  const SAVES_EN = {
    will: { de: "Will", gate: "Eye", gateGen: "of the eye" },
    fort: { de: "Fortitude", gate: "Block", gateGen: "of the block" },
    ref: { de: "Reflex", gate: "Arrow", gateGen: "of the arrow" },
    none: { de: "None", gate: "–" },
  };

  const SIGNS_EN = {
    column: { de: "Column", gen: "of the column", text: "lets the essence step out of the circle as a ray or column" },
    dispersion: { de: "Outpouring", gen: "of the outpouring", text: "lets the essence flow out and spread, instead of shooting it" },
    levitation: { de: "Hover", gen: "of the hover", text: "lifts the bearer of the circle or the essence off the ground" },
    pull: { de: "Pull", gen: "of the pull", text: "draws like things towards the circle – drawn the other way round: a push" },
    crush: { de: "Breaking", gen: "of the breaking", text: "takes structures apart into single pieces – drawn the other way round: a joining" },
    direction: { de: "Direction", gen: "of the direction", text: "shows the essence its way; all direction signs together make up the direction of effect" },
    convergence: { de: "Focusing", gen: "of the focusing", text: "condenses the effect onto a single point and makes loose things firm" },
    window: { de: "Window", gen: "of the window", text: "confines the effect to whatever the circle lies upon – the bearer itself" },
    diamond: { de: "Lozenge", gen: "of the lozenge", text: "directs the effect at the surroundings instead of at the bearer" },
    collection: { de: "Gathering", gen: "of the gathering", text: "gathers matter or force from the surroundings and feeds it to the circle" },
    radial: { de: "Damping", gen: "of the damping", text: "tempers the essence to a mild form – embers instead of flame, coolness instead of frost" },
    bolt: { de: "Missile", gen: "of the missile", text: "shapes the essence into single missiles" },
    repetition: { de: "Recurrence", gen: "of the recurrence", text: "sets the target back to its starting state again and again" },
    vision: { de: "Sight", gen: "of the sight", text: "reaches into the light and thereby into what is seen" },
    weave: { de: "Weave", gen: "of the weave", text: "spins the essence into threads, ribbons and nets" },
    enlarge: { de: "Measure", gen: "of the measure", text: "makes grow (corners outwards) or shrink (corners inwards)" },
    rain: { de: "Rain", gen: "of the rain", text: "lets the essence come down from above over an area" },
    bird: { de: "Messenger", gen: "of the messenger", text: "gives the essence a shape of its own that roams about" },
  };

  const ALCHEMY_EN = {
    sulfur: "Sulfur – the burning principle",
    sal: "Sal – the binding principle",
    mercurius: "Mercurius – the changing principle",
    sol: "Gold (Sun)",
    luna: "Silver (Moon)",
    venus: "Copper (Venus)",
    mars: "Iron (Mars)",
    saturnus: "Lead (Saturn)",
    iupiter: "Tin (Jupiter)",
    platina: "Platinum – Sun and Moon united",
    metallum: "Rare metal",
    lapis: "Gemstone",
    onyx: "Dark stone",
    os: "Bone",
    sanguis: "Blood",
    pars: "Part of a creature",
    animalia: "Animal matter",
    pellis: "Leather & hide",
    aer: "Airy things",
    aqua: "Liquids",
    terra: "Earthy things",
    speculum: "Mirror & glass",
    velum: "Fabric & veil",
    mel: "Sweetness",
    vinculum: "Thread & fetter",
    herba: "Herb & wood",
    cibus: "Food",
    venenum: "Poison",
    oculus: "Sense organ",
    clavis: "Key",
    scriptura: "Script & parchment",
    sacrum: "Hallowed things",
    nummus: "Coin",
    instrumentum: "Tool & instrument",
    arma: "Weapon & armour",
    materia: "Undetermined matter",
  };

  const COMBOS_EN = {
    "aqua+ordo": "Ice", "ignis+aer": "Lightning-fire", "ignis+terra": "Magma", "aqua+terra": "Mud",
    "aqua+aer": "Mist", "ignis+fluxus": "Wildfire", "ignis+lux": "Embers", "ignis+vis": "Firestorm",
    "aer+vis": "Thunderclap", "terra+ordo": "Bulwark", "terra+vis": "Might of Rock",
    "vita+bonum": "Blessing", "vita+ordo": "Preservation", "vita+fluxus": "Overgrowth", "vita+mens": "Ensoulment",
    "mors+malum": "Corruption", "mors+ordo": "Banning Curse", "mors+mens": "Grave Spirit", "mors+umbra": "Death Shadow",
    "lux+mens": "Insight", "lux+spatium": "Farsight", "lux+umbra": "Phantasm", "lux+bonum": "Holy Light", "lux+ordo": "Clarity",
    "umbra+mens": "Nightmare", "umbra+spatium": "Shadow Path", "umbra+fluxus": "Shifting Shadow",
    "mens+ordo": "Command", "mens+fluxus": "Madness", "mens+tempus": "Foreboding", "mens+malum": "Temptation",
    "vis+ordo": "Force Shield", "vis+spatium": "Far Force", "vis+fluxus": "Unleashing",
    "ordo+spatium": "Anchor", "ordo+tempus": "Standstill", "ordo+malum": "Curse-ban", "ordo+bonum": "Consecration",
    "fluxus+spatium": "Rift", "fluxus+tempus": "Time Leap", "fluxus+terra": "Reshaping", "fluxus+malum": "Devastation",
    "spatium+tempus": "Folding", "bonum+malum": "Judgement",
  };
  function comboNameEn(a, b) {
    return COMBOS_EN[a + "+" + b] || COMBOS_EN[b + "+" + a] || null;
  }

  // Deutsches Stoffwort (MATERIAL_NOUNS) -> englisches Stoffwort
  const MATERIAL_EN = {
    Hyazinth: "Jacinth", Diamant: "Diamond", Rubin: "Ruby", Saphir: "Sapphire", Smaragd: "Emerald", Opal: "Opal",
    Perle: "Pearl", Jade: "Jade", Amethyst: "Amethyst", Achat: "Agate", Bernstein: "Amber", Topas: "Topaz",
    Granat: "Garnet", Aquamarin: "Aquamarine", Turmalin: "Tourmaline", Zirkon: "Zircon", Peridot: "Peridot", Beryll: "Beryl",
    Spinell: "Spinel", Citrin: "Citrine", Karneol: "Carnelian", Blutstein: "Bloodstone", "Türkis": "Turquoise", Malachit: "Malachite",
    Lapislazuli: "Lapis lazuli", Mondstein: "Moonstone", Koralle: "Coral", Quarz: "Quartz", Kristall: "Crystal", Glimmer: "Mica",
    Edelstein: "Gemstone", Onyx: "Onyx", Obsidian: "Obsidian", "Hämatit": "Haematite", Elfenbein: "Ivory",
    Platin: "Platinum", Gold: "Gold", Silber: "Silver", Kupfer: "Copper", Messing: "Brass", Eisen: "Iron",
    Magneteisen: "Lodestone", Blei: "Lead", Zinn: "Tin", Quecksilber: "Quicksilver", Adamant: "Adamantine",
    Mithral: "Mithral", "Kaltes Eisen": "Cold iron", Metall: "Metal",
    Schwefel: "Sulphur", Phosphor: "Phosphorus", Fledermausdung: "Bat guano", Salpeter: "Saltpetre", Salz: "Salt", Kreide: "Chalk", Kalk: "Lime",
    "Alchemistische Reagenzien": "Alchemical reagents", Kohle: "Charcoal", Asche: "Ash", "Öl": "Oil", Wachs: "Wax", Weihrauch: "Incense",
    Ton: "Clay", Sand: "Sand", Erde: "Earth", Stein: "Stone", Staub: "Dust",
    Wasser: "Water", Eis: "Ice", Essig: "Vinegar", Wein: "Wine", "Träne": "Tear", Tropfen: "Drop",
    Feder: "Feather", Blasebalg: "Bellows", Rauch: "Smoke",
    Blut: "Blood", Knochen: "Bone", "Reißzahn": "Fang", Totenstaub: "Grave dust", "Teil des Wesens": "Part of the creature",
    Haar: "Hair", Schuppe: "Scale", Huf: "Hoof", Muschelschale: "Shell", Tentakel: "Tentacle",
    Spinnennetz: "Spider web", Insekt: "Insect", Hasenpfote: "Rabbit's foot", Schlangenhaut: "Snakeskin", Seeigel: "Sea urchin",
    "Schildkrötenpanzer": "Turtle shell", Auge: "Eye", Ohr: "Ear", Leder: "Leather", Fleisch: "Flesh", Herz: "Heart",
    Ei: "Egg", Milch: "Milk", Tierisches: "Animal matter",
    Mistel: "Mistletoe", Rose: "Rose", Honig: "Honey", Samen: "Seed", Blatt: "Leaf", Wurzel: "Root",
    "Blüte": "Blossom", Holz: "Wood", Kraut: "Herb", Speise: "Food",
    "Gewürz": "Spice", Gift: "Poison",
    Wolle: "Wool", Stoff: "Fabric", Faden: "Thread", Spiegel: "Mirror",
    Glas: "Glass", Tinte: "Ink", Schrift: "Script",
    Geweihtes: "Hallowed things", "Münze": "Coin", "Schlüssel": "Key", Instrument: "Instrument",
    Werkzeug: "Tool", Waffe: "Weapon",
    "Laborgerät": "Laboratory equipment", Phiole: "Phial", Spielstein: "Gaming piece", Stab: "Staff",
    Gestein: "Rock", Abzeichen: "Badge", "Säure": "Acid", Pulver: "Powder",
    Laterne: "Lantern", Harz: "Resin",
  };

  // Englische Bedeutungen des lateinischen Formelvokabulars (Schlüssel bleiben lateinisch) (lateinisch -> englisch)
  const GLOSSARY_EN = {
    arce: "ward off", muni: "fortify", claude: "close", prohibe: "forbid", tuere: "protect", obsera: "bar",
    voca: "call", evoca: "call forth", crea: "create", duc: "lead", trahe: "draw", aperi: "open",
    vide: "see", cerne: "discern", revela: "reveal", intuere: "behold", lege: "read",
    liga: "bind", iube: "command", mulce: "soothe", cape: "seize", suade: "persuade", flecte: "bend",
    erumpe: "break forth", mitte: "send", arde: "burn", frange: "break", iacta: "hurl", ure: "scorch",
    finge: "fashion falsely", simula: "feign", vela: "veil", abde: "hide", pinge: "paint", decipe: "deceive",
    hauri: "draw off", excita: "awaken", marcesce: "wither", neca: "slay", suge: "suck", inhuma: "bury",
    muta: "change", verte: "turn", forma: "shape / form", auge: "increase", transfer: "transfer", solve: "loosen",
    fac: "make", scribe: "write", tene: "hold", imple: "fulfil", rege: "steer",
    ignis: "fire", flamma: "flame", ardor: "ardour", scintilla: "spark", pyra: "pyre",
    aqua: "water", unda: "wave", gelu: "frost", nix: "snow", frigus: "cold",
    aer: "air", ventus: "wind", fulgur: "lightning", tonitrus: "thunder", spiritus: "breath",
    terra: "earth", saxum: "rock", lapis: "stone", acidum: "acid", ferrum: "iron",
    vita: "life", salus: "health", germen: "seed", cruor: "blood", flos: "blossom",
    mors: "death", letum: "ruin", cinis: "ash", tabes: "wasting", sepulcrum: "grave",
    lux: "light", fax: "torch", radius: "ray", splendor: "splendour", clarus: "bright",
    umbra: "shadow", tenebrae: "darkness", nox: "night", caligo: "mist, gloom", velum: "veil",
    mens: "mind", animus: "soul", cogito: "I think", recordatio: "memory", somnium: "dream",
    vis: "force", impetus: "onslaught", robur: "strength", pondus: "weight", moles: "mass",
    ordo: "order", lex: "law", vinculum: "fetter", sigillum: "seal", norma: "rule",
    fluxus: "flux, change", mutatio: "alteration", turba: "whirl", vortex: "whirlpool", casus: "chance",
    bonum: "the good", sanctus: "holy", gratia: "grace", caelum: "heaven", pius: "devout",
    malum: "the evil", nefas: "outrage", abyssus: "abyss", dirae: "curses", scelus: "crime",
    spatium: "space", porta: "gate", limes: "boundary", via: "way", distantia: "distance",
    tempus: "time", hora: "hour", mora: "delay", aevum: "eternity", saeculum: "age",
    conus: "cone", linea: "line", orbis: "circle", diffusio: "spread", emanatio: "emanation", columna: "column",
    murus: "wall", sphaera: "sphere", cubus: "cube", tactus: "touch", ipse: "self", scopus: "target",
    res: "thing", advena: "newcomer", oculus: "eye", signum: "sign",
    in: "in", me: "me", per: "through", tactum: "touch", prope: "near", procul: "far", longe: "far off", ultra: "beyond", fines: "bounds",
    momento: "in a moment", ictus: "strokes", horulas: "little hours", horas: "hours", dies: "days", aeternum: "eternity",
    dum: "as long as", intendo: "I strain", ut: "as", scriptum: "written",
    usque: "until", ad: "to", finem: "end", circulos: "circles", trans: "beyond",
    maneat: "let it remain", fiat: "let it be done", sit: "let it be", duret: "let it last", sic: "thus",
    intra: "within", extra: "without", circulum: "circle", limitem: "boundary", orbem: "circle",
    voluntas: "will", celeritas: "swiftness", aperta: "open", frangatur: "let it be broken", cedat: "let it yield", probetur: "let it be tested",
    materia: "matter", pretium: "price", donum: "gift", datum: "given", solutum: "loosed", consumptum: "consumed", est: "is",
    ruptum: "broken", transitum: "crossed", et: "and", cum: "with",
    ordine: "in order", gradu: "at the degree", nodo: "at the knot",
    primo: "first", secundo: "second", tertio: "third", quarto: "fourth", quinto: "fifth", sexto: "sixth", septimo: "seventh", octavo: "eighth", nono: "ninth",
    clausum: "closed", signatum: "sealed", audi: "hear", veni: "come", esto: "be", sta: "stand",
  };

  // Essenzanteile wie ein Rezept, englisch: „three parts Vis, just under three parts Terra,
  // a strong part each of Spatium and Vita, a weak part each of Aqua and Ignis“
  const NUM_EN = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];
  function partPhraseEn(pct) {
    pct = Math.round(pct);
    if (pct < 4) return "a trace";
    if (pct < 7) return "half a part";
    const n = Math.round(pct / 10), d = pct - 10 * n;
    if (Math.abs(d) >= 4) {
      const lo = Math.floor(pct / 10);
      return lo === 1 ? "one and a half parts" : `${NUM_EN[lo] || lo} and a half parts`;
    }
    if (n === 1) return d >= 1 ? "a strong part" : d <= -1 ? "a weak part" : "one part";
    const base = `${NUM_EN[n] || n} parts`;
    return d <= -2 ? "just under " + base : d >= 3 ? "a good " + base : base;
  }
  function partsEn(essences, opts = {}) {
    const name = opts.name || ((id) => ESS[id].latin);
    const list = [...essences].filter((x) => x.pct > 0).sort((a, b) => b.pct - a.pct);
    const groups = [];
    for (const x of list) {
      const ph = partPhraseEn(x.pct);
      const last = groups[groups.length - 1];
      if (last && last.ph === ph) last.ids.push(x.id);
      else groups.push({ ph, ids: [x.id] });
    }
    return groups
      .map((g) => (g.ids.length > 1 ? `${g.ph} each of ${g.ids.slice(0, -1).map(name).join(", ")} and ${name(g.ids[g.ids.length - 1])}` : `${g.ph} ${name(g.ids[0])}`))
      .join(", ");
  }

  // en-Objekte an die deutschen Einträge hängen (deutsche Werte bleiben unberührt)
  const attach = (table, map) => { for (const k in map) if (table[k]) table[k].en = map[k]; };
  attach(SCHOOLS, SCHOOLS_EN);
  attach(SHAPES, SHAPES_EN);
  attach(DURATIONS, DURATIONS_EN);
  attach(SAVES, SAVES_EN);
  attach(SIGNS, SIGNS_EN);
  attach(ESS, ESSENCES_EN);
  for (const k in SUBSCHOOLS_EN) if (SUBSCHOOLS[k]) SUBSCHOOLS[k].en = { de: SUBSCHOOLS_EN[k] };
  RANGES.forEach((r, i) => { if (RANGES_EN[i]) r.en = RANGES_EN[i]; });

  window.THEORY = {
    SCHOOLS, SUBSCHOOLS, ESSENCES, ESS, DESCRIPTORS, KEYWORDS, MATERIAL_NOUNS, TAG_ESS, ALCHEMY,
    COMBOS, comboName, SHAPES, RANGES, DURATIONS, SAVES, SIGNS, SIGN_RULES, GLOSSARY, parts, partPhrase,
    ALCHEMY_EN, COMBOS_EN, comboNameEn, MATERIAL_EN, GLOSSARY_EN, NUM_EN, partPhraseEn, partsEn,
  };
})();
