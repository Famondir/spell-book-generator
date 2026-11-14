// Formelsprache Sumerisch – Leihsprache, stark vereinfacht.
// Sprachstufe: Altsumerisch/Neusumerisch nach den Zeichenlisten; Verben als einfacher Stamm mit -a,
// Wunschform mit he- (hegal „es sei“), Ordnungszahlen mit -kam. Satzbau: Verb am Ende.
// Umschrift: š → sh, ĝ → g, ḫ → h; Indexziffern der Zeichen entfallen.
(window.FORMULA_LANGS = window.FORMULA_LANGS || {}).sumerian = {
  id: "sumerian",
  name: { de: "Sumerisch", en: "Sumerian" },
  family: "sumerian",
  aligned: true,
  script: "cuneiform",
  // Anlaut nach der Keilschrift-Umschrift: sh ist š
  onsets: { sh: "š" },
  note: "Sumerisch, stark vereinfacht; Verb am Ende, Wunschform he-.",
  lex: {
    // Ausgerichtet: Platz i entspricht dem lateinischen Wort auf Platz i, eigener Anlaut je Liste (Umschrift š).
    // Mit * markiert: Umschreibung, kein belegtes Einzelwort.
    imp: {
      abjuration: ["gubba", "kalaga", "tagga", "bara", "urua", "dula"], // steh fest, stärke, befestige, nicht!, bewache, bedecke
      conjuration: ["gude", "ea", "dima", "laha", "tumma", "bada"], // rufe, lass hervorgehen, erschaffe, führe, bring, öffne
      divination: ["igibara", "zua", "pada", "geshtuga", "shida", "bada"], // blicke, wisse, finde, horche, zähle, öffne
      enchantment: ["keshda", "inimgara", "sedda", "daba", "shaduga", "gurra"], // binde, setze das Wort*, kühle, fasse, versüße das Herz*, beuge
      evocation: ["ziga", "kingia", "bila", "gaza", "shuba", "izila"], // erhebe dich, sende, brenne, zerschlage, wirf, entzünde*
      illusion: ["dima", "lula", "tuga", "gissua", "sara", "nigerima"], // forme, lüge, kleide, beschatte*, zeichne, tu Falsches*
      necromancy: ["dea", "tila", "hada", "gaza", "naga", "kia"], // gieße, belebe, dörre, erschlage, trink, in die Erde*
      transmutation: ["kura", "gurra", "dima", "taha", "laha", "bura"], // verändere, wende, forme, füge hinzu, bring, löse
      universal: ["aka", "sara", "daba", "gala", "ena"], // tu, schreibe, halte, sei da, herrsche*
    },
    ess: {
      ignis: ["izi", "gibil", "ne", "mul", "bil"], // Feuer, Flamme, Glut, Funkeln, Brand
      aqua: ["a", "engur", "shed", "kurshed", "sedda"], // Wasser, Wassertiefe, Kälte, Bergkälte*, kühl
      aer: ["lil", "im", "nimgir", "gu", "zi"], // Luft, Wind, Blitz, Stimme, Atem
      terra: ["ki", "hursag", "na", "mun", "anbar"], // Erde, Gebirge, Stein, Salz, Eisen
      vita: ["zi", "silim", "numun", "mud", "gurun"], // Leben, Heil, Same, Blut, Frucht
      mors: ["namush", "halga", "sahar", "gig", "kimah"], // Tod, Vernichtung, Staub, Krankheit, Grab
      lux: ["zalag", "gishbil", "dalla", "melam", "babbar"], // Licht, Fackel, Strahlen, Schreckensglanz, weiß
      umbra: ["gissu", "kukku", "udgig", "dungu", "tugdul"], // Schatten, Finsternis, Nacht, Wolke, Decke
      mens: ["geshtug", "shag", "dimma", "igizu", "mamud"], // Weisheit, Herz, Entschluss, Augenwissen*, Traum
      vis: ["usu", "ziga", "kalag", "dugud", "gal"], // Kraft, Aufbruch, stark, schwer, groß
      ordo: ["me", "di", "esh", "kishib", "nigsisa"], // göttliche Ordnung, Urteil, Seil, Siegel, Gerechtigkeit
      fluxus: ["id", "bal", "suh", "amaru", "giskim"], // Fluss, Wechsel, Wirrnis, Flut, Omen
      bonum: ["dug", "kug", "nigba", "an", "sizkur"], // gut, heilig, Gabe, Himmel, Gebet
      malum: ["hul", "nigerim", "abzu", "udug", "lul"], // böse, Frevel, Urwasser, Dämon, Lüge
      spatium: ["anki", "kagal", "zag", "harran", "sud"], // Himmel und Erde, Stadttor, Grenze, Straße, fern
      tempus: ["mu", "danna", "egir", "udulia", "bala"], // Jahr, Doppelstunde, danach, Urzeit, Regierungszeit
    },
    shape: {
      cone: "si", line: "esh", ray: "mul", burst: "dalla", spread: "dagal", emanation: "melam",
      cylinder: "dim", wall: "bad", sphere: "gur", cube: "sig", touch: "shu", self: "ni",
      targets: "luerim", object: "nig", summon: "galla", sensor: "igi", symbol: "gishhur", other: "alan",
    },
    range: ["gae", "shua", "da", "sud", "sudda", "kurbar"],
    rangeTail: ["kaskalla", "kurshe", "luerimshe", "anki"],
    duration: {
      instant: "udbia", rounds: "udtur", minutes: "danna tur", hours: "danna", days: "udud",
      permanent: "udulia", concentration: "shagga", special: "gim sar",
    },
    durVerb: ["hegal", "hegub", "heti"],
    conj: ["bida", "da", "ta"],
    dir: { in: "shagshe", out: "barshe" },
    signObj: ["gishhur", "gur", "bad", "me"],
    save: { will: "shag", fort: "usu", ref: "kas" },
    saveOpen: "gala",
    saveVerb: ["hegaz", "heba", "hebal"],
    material: ["nidba", "sizkur", "nigba"],
    materialVerb: ["ba", "sum", "gar"],
    seal: ["kishib", "esh"],
    sealVerb: ["gaz", "bala"],
    ordWord: ["kia", "mea", "gurra"],
    ord: ["dishkam", "minkam", "eshkam", "limmukam", "iakam", "ashkam", "iminkam", "ussukam", "ilimmukam"],
    close: ["tuen", "hegal", "zi an hepad", "zi ki hepad"],
    answer: ["gena", "gubba", "hegal", "zua"],
  },
  patterns: {
    core: "{ess}, {shape} {imp}!",
    pair: "{ess2} {conj} {ess}",
    range: "{range}, {rangeTail}",
    duration: "{duration} {durVerb}",
    sign: "{signObj} {dir} {imp}",
    save: "{save} {saveVerb}",
    material: "{material} {materialVerb}",
    seal: "{seal} {sealVerb}",
    order: "{ord} {ordWord} {imp}",
    close: "{close}!",
    answer: "{ess}[ {answer}] {imp}.",
  },
  bridges: {
    ordo: { word: "me", latin: "Ordo", cognate: false },
    vita: { word: "zi", latin: "Vita", cognate: false },
    spatium: { word: "anki", latin: "mundus", cognate: false },
    mens: { word: "geshtug", latin: "Mens", cognate: false },
  },
};
