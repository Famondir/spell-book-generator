// Formelsprache Archaisches Griechisch – Leihsprache, vereinfacht.
// Sprachstufe: homerisch-archaisch nach den Wörterbüchern; Imperativ 2. Person, Wunschform 3. Person (-to, -stho).
// Satzbau frei, hier Verb zuerst wie im Lateinischen. Umschrift zum Vorlesen: υ → u, χ → kh, φ → ph, θ → th;
// ει und ευ vermieden (sie würden deutsch falsch gelesen), daher teils vereinfachte Formen.
(window.FORMULA_LANGS = window.FORMULA_LANGS || {}).greek = {
  id: "greek",
  name: { de: "Archaisches Griechisch", en: "Archaic Greek" },
  family: "indoeuropean",
  aligned: true,
  script: "greek",
  // Anlaut in griechischer Schrift: ph φ, th θ, kh χ, ps ψ, rh ρ; der Hauchlaut h zählt nicht
  onsets: { ph: "φ", th: "θ", kh: "χ", ps: "ψ", rh: "ρ", h: "" },
  note: "Homerisch-archaisch, vereinfacht; Verb zuerst.",
  lex: {
    // Ausgerichtet: Platz i entspricht dem lateinischen Wort auf Platz i, eigener Anlaut je Liste (griechische Schrift)
    imp: {
      abjuration: ["alexe", "tekhize", "erge", "kolue", "phulasse", "mokhlize"], // wehre ab, ummauere, sperre ein, hindere, bewache, verriegle
      conjuration: ["kale", "ekkale", "plasse", "age", "sure", "oige"], // rufe, rufe heraus, forme, führe, ziehe, öffne
      divination: ["ide", "krine", "phaine", "skope", "anagnothi", "oige"], // sieh, unterscheide, zeige, schau, lies, öffne
      enchantment: ["deson", "anasse", "thelge", "labe", "pethe", "kampte"], // binde, gebiete, bezaubere, nimm, überrede, beuge
      evocation: ["rhexon", "pempe", "phlege", "klason", "balle", "aithe"], // brich, sende, lodere, zerbrich, wirf, brenne
      illusion: ["plasse", "mimou", "skepe", "krupte", "graphe", "apata"], // forme, ahme nach, bedecke, verbirg, male, täusche
      necromancy: ["arue", "egere", "phthine", "ktene", "muze", "thapte"], // schöpfe, erwecke, schwinde, töte, sauge, begrabe
      transmutation: ["allasse", "trepe", "morphou", "plethune", "diaphere", "lue"], // verwandle, wende, forme, mehre, trage hinüber, löse
      universal: ["poie", "graphe", "ekhe", "koreson", "arkhe"], // mache, schreibe, halte, sättige, herrsche
    },
    ess: {
      ignis: ["pur", "phlox", "anthrax", "spinther", "kausos"], // Feuer, Flamme, Kohlenglut, Funke, Brand
      aqua: ["hudor", "kuma", "pagos", "nipha", "psukhos"], // Wasser, Woge, Frost, Schnee, Kälte
      aer: ["aer", "thuella", "keraunos", "bronte", "pnoe"], // Luft, Sturmwind, Blitz, Donner, Hauch
      terra: ["khthon", "petra", "lithos", "oxos", "sideros"], // Erde, Fels, Stein, Essig, Eisen
      vita: ["zoe", "hugia", "sperma", "haima", "rhodon"], // Leben, Gesundheit, Same, Blut, Rose
      mors: ["thanatos", "olethros", "spodos", "phthora", "taphos"], // Tod, Verderben, Asche, Verwesung, Grab
      lux: ["phos", "lampas", "aktis", "selas", "diauges"], // Licht, Fackel, Strahl, Glanz, durchscheinend
      umbra: ["skia", "zophos", "nux", "omikhle", "kaluptra"], // Schatten, Düsternis, Nacht, Nebel, Schleier
      mens: ["nous", "psukhe", "phroneo", "mneme", "onar"], // Geist, Seele, ich denke, Erinnerung, Traum
      vis: ["dunamis", "horme", "kratos", "baros", "megethos"], // Kraft, Ansturm, Stärke, Gewicht, Größe
      ordo: ["kosmos", "nomos", "desmos", "sphragis", "themis"], // Ordnung, Gesetz, Fessel, Siegel, Satzung
      fluxus: ["rhoe", "metabole", "khaos", "dine", "tukhe"], // Strömung, Umschlag, Chaos, Strudel, Zufall
      bonum: ["agathon", "hieros", "kharis", "ouranos", "theosebes"], // das Gute, heilig, Gnade, Himmel, gottesfürchtig
      malum: ["kakon", "asebia", "khasma", "erinues", "hubris"], // das Böse, Frevel, Schlund, Rachegeister, Frevelmut
      spatium: ["khoros", "pule", "horos", "atrapos", "diastema"], // Raum, Tor, Grenze, Pfad, Abstand
      tempus: ["khronos", "hora", "mellesis", "aion", "genea"], // Zeit, Stunde, Zögern, Ewigkeit, Geschlecht
    },
    shape: {
      cone: "konos", line: "gramme", ray: "aktis", burst: "rhexis", spread: "khusis", emanation: "aporrhoe",
      cylinder: "kion", wall: "tekhos", sphere: "sphaira", cube: "kubos", touch: "kher", self: "autos",
      targets: "skopos", object: "khrema", summon: "daimon", sensor: "omma", symbol: "sema", other: "morphe",
    },
    range: ["emoi", "en kheri", "engus", "porro", "tele", "huper horous"],
    rangeTail: ["eis telos", "kata kuklous", "pros skopon", "dia khorou"],
    duration: {
      instant: "autika", rounds: "en kairo", minutes: "ep oligon", hours: "kath horas", days: "kath hemeran",
      permanent: "eis aiona", concentration: "heos noo", special: "hos gegraptai",
    },
    durVerb: ["meneto", "esto", "genestho"],
    conj: ["kai", "sun", "en"],
    dir: { in: "endon", out: "exo" },
    signObj: ["sema", "kuklon", "horon", "grammen"],
    save: { will: "boule", fort: "iskhus", ref: "takhos" },
    saveOpen: "anoikte",
    saveVerb: ["rhageto", "iketo", "pirastho"],
    material: ["hule", "doron", "time"],
    materialVerb: ["dedotai", "lelutai", "dapanetai"],
    seal: ["sphragis", "desmos"],
    sealVerb: ["lelutai", "errhoge"],
    ordWord: ["taxe", "bathmo", "desmo"],
    ord: ["protos", "dewteros", "tritos", "tetartos", "pemptos", "hektos", "hebdomos", "ogdoos", "enatos"],
    close: ["estai", "tetelestai", "houtos esto", "genestho"],
    answer: ["akoue", "elthe", "stethi", "esto"],
  },
  patterns: {
    core: "{imp} {ess}, {shape}!",
    pair: "{ess2} {conj} {ess}",
    range: "{range}, {rangeTail}",
    duration: "{duration} {durVerb}",
    sign: "{imp} {dir} {signObj}",
    save: "{save} {saveVerb}",
    material: "{material} {materialVerb}",
    seal: "{seal} {sealVerb}",
    order: "{ordWord} {ord} {imp}",
    close: "{close}!",
    answer: "{ess}, {imp}[, {answer}].",
  },
  // Gemeinsame Wurzel mit dem lateinischen Wort desselben Platzes (für Brückennotizen); Lehnwörter nicht
  stems: {
    ess: { ignis: [null, "*bʰleg-", null, null, null], aqua: [null, null, null, "*sneygʷʰ-", null], terra: [null, null, null, "*h₂eḱ-", null], vita: ["*gʷih₃-", null, null, null, null], umbra: [null, null, "*nekʷt-", null, null], tempus: [null, null, null, "*h₂eyu-", null], spatium: [null, null, null, null, "*steh₂-"] },
  },
  bridges: {
    mens: { word: "menos", latin: "mens", cognate: true },
    aqua: { word: "hudor", latin: "unda", cognate: true },
    terra: { word: "khthon", latin: "humus", cognate: true },
    umbra: { word: "nux", latin: "nox", cognate: true },
    tempus: { word: "aion", latin: "aevum", cognate: true },
    vita: { word: "bios", latin: "vita", cognate: true },
  },
};
