// Formelsprache Urindogermanisch – rekonstruierte Leihsprache, stark vereinfacht.
// Grundlage: übliche Rekonstruktionen der Wörterbücher (Wurzeln mit Endung, Imperativ als bloßer Stamm,
// Wunschform auf -tu). Laryngale meist weggelassen oder als h, Palatale ohne Zeichen, kʷ → kw, gʷʰ → gwh.
// Satzbau: Verb am Ende (SOV). Als „Mutter“ vieler Formelsprachen hat sie die meisten Brücken zum Lateinischen.
(window.FORMULA_LANGS = window.FORMULA_LANGS || {}).pie = {
  id: "pie",
  name: { de: "Urindogermanisch", en: "Proto-Indo-European" },
  family: "indoeuropean",
  aligned: true,
  script: "proto",
  onsets: { gwh: "gʷʰ", gw: "gʷ", kw: "kʷ", bh: "bʰ", dh: "dʰ", gh: "gʰ" },
  note: "Rekonstruiert, stark vereinfacht; Verb am Ende.",
  lex: {
    // Ausgerichtet: Platz i entspricht dem lateinischen Wort auf Platz i; wo möglich die Wurzel des lateinischen Worts (stems).
    // Anlaut in der wissenschaftlichen Umschrift (kʷ gʷ gʷʰ bʰ dʰ gʰ), da die Sprache keine Schrift hat.
    imp: {
      abjuration: ["ark", "mey", "klaw", "ghebh", "pah", "ser"], // wehre ab, befestige, schließe, halte fern, schütze, verriegle
      conjuration: ["wekw", "ghew", "ker", "dewk", "tregh", "apwer"], // rufe, rufe an, erschaffe, führe, ziehe, öffne
      divination: ["weyd", "krey", "bhah", "spek", "leg", "apwer"], // sieh, sichte, zeige, schau, lies, öffne
      enchantment: ["bhendh", "yewdh", "mel", "kap", "swad", "lenk"], // binde, setze in Gang, besänftige, fasse, mache süß, beuge
      evocation: ["rewp", "sent", "as", "bhreg", "yeh", "ews"], // brich, sende, glühe, zerbrich, wirf, brenne
      illusion: ["dheygh", "sem", "wel", "kel", "peyk", "mey"], // knete, mache gleich, bedecke, verhehle, male, tausche
      necromancy: ["aws", "key", "merk", "nek", "sewg", "bhedh"], // schöpfe, setze in Bewegung, welke, vergehe, sauge, grabe
      transmutation: ["mey", "wert", "dheygh", "awg", "bher", "lew"], // tausche, wende, forme, mehre, trage, löse
      universal: ["dhe", "skreyb", "ten", "pleh", "reg"], // setze, ritze, halte, fülle, richte
    },
    ess: {
      ignis: ["egnis", "bhlegma", "asos", "skintla", "pahur"],
      aqua: ["akwa", "wodr", "gelos", "nigwhs", "srigos"],
      aer: ["awer", "wents", "bhelg", "tenhos", "dhewes"],
      terra: ["ters", "saksom", "grawon", "akros", "isarnom"],
      vita: ["gwiwota", "solwos", "genmen", "krewh", "bhlohs"],
      mors: ["mrtis", "nekis", "kenis", "tabhes", "sepel"],
      lux: ["lewks", "dhegwos", "radyos", "sawel", "bhah"],
      umbra: ["skoh", "temos", "nokwts", "meygh", "welom"],
      mens: ["mntis", "anmos", "gno", "kerd", "swepnos"],
      vis: ["wis", "oros", "seghos", "pondos", "mohlis"],
      ordo: ["artus", "legs", "bhendhos", "sekwnom", "reg"],
      fluxus: ["bhlewos", "meyto", "twer", "wert", "kados"],
      bonum: ["wesu", "sakros", "gwratos", "dyews", "pewos"],
      malum: ["dus", "nebhah", "bhudhmen", "ghwer", "skelos"],
      spatium: ["spatyom", "prtus", "teremn", "weghya", "dwaro"],
      tempus: ["kwel", "yer", "mora", "oyu", "sehtlom"],
    },
    shape: {
      cone: "akris", line: "streyg", ray: "bhahos", burst: "bhregos", spread: "pleth", emanation: "plenos",
      cylinder: "stahos", wall: "dheygh", sphere: "kwekwlos", cube: "domos", touch: "ghesr", self: "swe",
      targets: "ghostis", object: "rehis", summon: "alyos", sensor: "okws", symbol: "sekwnom", other: "kwrep",
    },
    range: ["moy", "ghesri", "per", "dwaro", "dwaro dwaro", "ter eghs"],
    rangeTail: ["en akrom", "per kwekwlos", "en ghostim", "ter rewos"],
    duration: {
      instant: "nu", rounds: "nu nu", minutes: "per kwel", hours: "per dyews", days: "dyews dyews",
      permanent: "en oyu", concentration: "kerdi", special: "swa",
    },
    durVerb: ["estu", "stahtu", "bhutu"],
    conj: ["kwe", "som", "en"],
    dir: { in: "en", out: "eghs" },
    signObj: ["sekwnom", "kwekwlos", "dheygh", "termn"],
    save: { will: "welos", fort: "wis", ref: "oku" },
    saveOpen: "petnos",
    saveVerb: ["bhregtu", "kedtu", "pertu"],
    material: ["donom", "wesnom", "ghutom"],
    materialVerb: ["dotos", "lutos", "dhetos"],
    seal: ["bhendhos", "sekwnom"],
    sealVerb: ["bhregtos", "lutos"],
    ordWord: ["en reg", "per kwekwlos", "en termn"],
    ord: ["prowos", "dwoteros", "tritos", "kwturos", "penkwtos", "sweksos", "septmos", "oktowos", "newnos"],
    close: ["estu", "swa estu", "bhutu", "nu estu"],
    answer: ["klew", "gwem", "stah", "estu"],
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
  // Gemeinsame Wurzel mit dem lateinischen Wort desselben Platzes (für Brückennotizen)
  stems: {
    imp: { abjuration: ["*h₂erk-", "*mey-", "*kleh₂w-", "*gʰeh₁bʰ-", null, "*ser-"], conjuration: ["*wekʷ-", null, "*ḱerh₃-", "*dewk-", "*tregʰ-", "*h₂ep-wer-"], divination: ["*weyd-", "*krey-", null, "*speḱ-", "*leǵ-", "*h₂ep-wer-"], enchantment: [null, "*yewdʰ-", null, "*keh₂p-", "*sweh₂d-", null], evocation: ["*rewp-", null, "*h₂eHs-", "*bʰreg-", "*yeh₁-", "*h₁ews-"], illusion: ["*dʰeyǵʰ-", "*sem-", null, "*ḱel-", "*peyḱ-", null], necromancy: ["*h₂ews-", "*ḱey-", null, "*neḱ-", "*sewg-", "*bʰedʰh₂-"], transmutation: ["*mey-", "*wert-", null, "*h₂ewg-", "*bʰer-", "*lewh₁-"], universal: ["*dʰeh₁-", "*skreybʰ-", "*ten-", "*pleh₁-", "*h₃reǵ-"] },
    ess: { ignis: ["*h₁égʷnis", "*bʰleg-", "*h₂eHs-", null, null], aqua: ["*h₂ekʷeh₂", "*wed-", "*gel-", "*sneygʷʰ-", "*sriHg-"], aer: [null, "*h₂weh₁-", "*bʰelg-", "*(s)tenh₂-", null], terra: ["*ters-", "*sek-", null, "*h₂eḱ-", null], vita: ["*gʷih₃-", "*solh₂-", "*ǵenh₁-", "*krewh₂-", "*bʰleh₃-"], mors: ["*mer-", "*neḱ-", "*ḱenis-", "*teh₂-", null], lux: ["*lewk-", null, null, null, null], umbra: [null, "*temH-", "*nekʷt-", null, null], mens: ["*men-", "*h₂enh₁-", "*ǵneh₃-", "*ḱerd-", "*swep-"], vis: ["*weyh₁-", null, null, "*(s)pend-", null], ordo: ["*h₂er-", "*leǵ-", null, "*sekʷ-", "*h₃reǵ-"], fluxus: ["*bʰlewH-", "*mey-", "*twer-", "*wert-", "*ḱad-"], bonum: [null, "*sak-", "*gʷerH-", null, "*pewH-"], malum: [null, "*bʰeh₂-", "*bʰudʰ-", null, "*skel-"], spatium: ["*speh₁-", "*per-", "*ter-", "*weǵʰ-", null], tempus: [null, null, "*(s)mer-", "*h₂eyu-", "*seh₁-"] },
  },
  bridges: {
    ignis: { word: "egnis", latin: "ignis", cognate: true },
    aqua: { word: "akwa", latin: "aqua", cognate: true },
    mens: { word: "mntis", latin: "mens", cognate: true },
    vis: { word: "wis", latin: "vis", cognate: true },
    umbra: { word: "nokwts", latin: "nox", cognate: true },
    ordo: { word: "yewos", latin: "ius", cognate: true },
    terra: { word: "ters", latin: "terra", cognate: true },
    tempus: { word: "oyu", latin: "aevum", cognate: true },
  },
};
