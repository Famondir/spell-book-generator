// Formelsprache Altirisch – Leihsprache, vereinfacht.
// Sprachstufe: Altirisch (Glossen-Zeit) nach den Wörterbüchern, aber in Lautschrift statt in der irischen
// Rechtschreibung (Lenition ausgeschrieben: bh → v, ch → kh, dh/th → th). Imperativ als bloßer Stamm.
// Satzbau: Verb zuerst (VSO).
(window.FORMULA_LANGS = window.FORMULA_LANGS || {}).oldirish = {
  id: "oldirish",
  name: { de: "Altirisch", en: "Old Irish" },
  family: "indoeuropean",
  aligned: true,
  script: "ogham",
  // Anlaut nach irischer Schreibung: k und kh sind c, sh ist s
  onsets: { kh: "c", k: "c", sh: "s" },
  note: "Altirisch in Lautschrift; Verb zuerst.",
  lex: {
    // Ausgerichtet: Platz i entspricht dem lateinischen Wort auf Platz i, eigener Anlaut je Liste (irische Schreibung)
    imp: {
      abjuration: ["ingair", "kumdaig", "duun", "tairmishk", "anaig", "glas"], // hüte ab, befestige, schließe, hindere, schütze, verriegle
      conjuration: ["gair", "togair", "kruthaig", "feth", "sreng", "oslag"], // rufe, rufe herbei, erschaffe, führe, ziehe, öffne
      divination: ["deega", "airig", "foilsig", "shella", "leg", "oslag"], // schau, nimm wahr, offenbare, blick hin, lies, öffne
      enchantment: ["nask", "forkongair", "maethaig", "gav", "avair", "kroom"], // binde, gebiete, erweiche, nimm, sprich zu, beuge
      evocation: ["maith", "foith", "aith", "brish", "telg", "loshk"], // brich auf, sende, entfache, zerbrich, wirf, verbrenne
      illusion: ["delvaig", "samlaig", "fortug", "kel", "liig", "breegag"], // forme, gleiche an, bedecke, verbirg, färbe, täusche
      necromancy: ["iv", "duushig", "kriin", "marv", "suug", "adnaik"], // trink, erwecke, welke, töte, sauge, begrabe
      transmutation: ["klaikhlag", "soi", "delvaig", "meedaig", "aistrig", "fuasluik"], // verwandle, wende, forme, mehre, übertrage, löse
      universal: ["deen", "skriiv", "kongaiv", "liin", "riig"], // mache, schreibe, halte, fülle, herrsche
    },
    ess: {
      ignis: ["tene", "lassar", "gor", "oivell", "breo"], // Feuer, Flamme, Glut, Funke, Brand
      aqua: ["ishke", "tonn", "reoth", "snekhta", "uar"], // Wasser, Welle, Frost, Schnee, kalt
      aer: ["nev", "gaeth", "saignen", "torann", "anaal"], // Himmel, Wind, Blitz, Donner, Atem
      terra: ["talam", "ail", "klokh", "goirt", "iarn"], // Erde, Fels, Stein, bitter, Eisen
      vita: ["bethu", "slaan", "geen", "fuil", "lus"], // Leben, heil, Keim, Blut, Kraut
      mors: ["baas", "eeg", "luath", "morgath", "fert"], // Tod, Sterben, Asche, Fäulnis, Grabhügel
      lux: ["solus", "kaindel", "ruithen", "lassar", "glan"], // Licht, Kerze, Strahl, Glanz, rein
      umbra: ["skaath", "dorkhe", "adakh", "keo", "brat"], // Schatten, Dunkel, Nacht, Nebel, Mantel
      mens: ["menme", "anim", "imraadim", "kuvne", "brinn"], // Geist, Seele, ich bedenke, Erinnerung, Traum
      vis: ["nert", "ruathar", "brig", "trome", "meed"], // Kraft, Ansturm, Stärke, Schwere, Größe
      ordo: ["ord", "rekht", "kuimrekh", "seela", "fiir"], // Ordnung, Gesetz, Fessel, Siegel, wahr
      fluxus: ["sruth", "klaikhlo", "buaire", "tuile", "daan"], // Strom, Wandel, Wirrnis, Flut, Los
      bonum: ["math", "noev", "rath", "flaithes", "kraibdekh"], // gut, heilig, Gnade, Himmelreich, fromm
      malum: ["olk", "kol", "duvaigen", "mallakht", "anfolath"], // böse, Frevel, Abgrund, Fluch, Unrecht
      spatium: ["fairshinge", "dorus", "kriikh", "seed", "imkian"], // Weite, Tür, Grenze, Weg, ringsum fern
      tempus: ["aimser", "uair", "maill", "braath", "saegal"], // Zeit, Stunde, Aufschub, Weltende, Zeitalter
    },
    shape: {
      cone: "benn", line: "liine", ray: "ga", burst: "madm", spread: "lethath", emanation: "gal",
      cylinder: "tuur", wall: "muur", sphere: "kruinne", cube: "ail", touch: "laav", self: "feen",
      targets: "navad", object: "nii", summon: "sluag", sensor: "suul", symbol: "ogam", other: "delv",
    },
    range: ["dom", "fom laav", "okus", "kian", "i keen", "tar kriich"],
    rangeTail: ["ko forkenn", "tar sliav", "ko navad", "tar muir"],
    duration: {
      instant: "fo khedoir", rounds: "fri tamall", minutes: "fri ree", hours: "ko adkhi", days: "ko kenn lathe",
      permanent: "ko braath", concentration: "fri menvan", special: "amal skriivthar",
    },
    durVerb: ["rove", "bith", "mared"],
    conj: ["okus", "la", "i"],
    dir: { in: "isin", out: "imakh" },
    signObj: ["ogam", "kruinne", "kriich", "delv"],
    save: { will: "tol", fort: "nert", ref: "luas" },
    saveOpen: "oslagthe",
    saveVerb: ["brister", "techeth", "frovthar"],
    material: ["edbart", "daan", "loog"],
    materialVerb: ["tugath", "loskath", "fothlath"],
    seal: ["sigel", "naiv"],
    sealVerb: ["brisi", "tarvthekht"],
    ordWord: ["isin graad", "fon ord", "isin kheev"],
    ord: ["keedne", "taanishe", "tres", "kethravath", "kooigeth", "sheseth", "shekhtvath", "okhtvath", "noovath"],
    close: ["rove", "is avlath", "deenta", "ro iathath"],
    answer: ["kluin", "tair", "rove", "airis"],
  },
  patterns: {
    core: "{imp} {ess}, {shape}!",
    pair: "{ess2} {conj} {ess}",
    range: "{range}, {rangeTail}",
    duration: "{duration} {durVerb}",
    sign: "{imp} {dir} {signObj}",
    save: "{save} {saveVerb}",
    material: "{materialVerb} {material}",
    seal: "{sealVerb} {seal}",
    order: "{imp} {ordWord} {ord}",
    close: "{close}!",
    answer: "{ess}, {imp}[, {answer}].",
  },
  // Gemeinsame Wurzel mit dem lateinischen Wort desselben Platzes (für Brückennotizen); Lehnwörter nicht
  stems: {
    ess: { aqua: [null, null, null, "*sneygʷʰ-", null], vita: ["*gʷih₃-", "*solh₂-", "*ǵenh₁-", null, null], mens: ["*men-", null, null, null, null] },
  },
  bridges: {
    vita: { word: "bethu", latin: "vita", cognate: true },
    terra: { word: "talam", latin: "tellus", cognate: true },
    mens: { word: "menme", latin: "mens", cognate: true },
    aqua: { word: "muir", latin: "mare", cognate: true },
    ordo: { word: "fiir", latin: "verus", cognate: true },
    bonum: { word: "dia", latin: "deus", cognate: true },
  },
};
