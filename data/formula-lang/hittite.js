// Formelsprache Hethitisch – Leihsprache, stark vereinfacht.
// Sprachstufe: Junghethitisch nach den Wörterbüchern (Wurzeln, Imperativ meist als bloßer Stamm), keine Kasus-Kongruenz.
// Satzbau: Verb am Satzende (SOV). Zahlen ab 5 sind nicht belegt (Keilschrift schreibt Ziffern) und aus dem
// Urindogermanischen ergänzt. Gestaltwörter teils umschrieben (Straße für Linie, Stele für Kegel).
// Umschrift: ḫ → kh, š → sh, z → ts; Langvokale nicht bezeichnet.
(window.FORMULA_LANGS = window.FORMULA_LANGS || {}).hittite = {
  id: "hittite",
  name: { de: "Hethitisch", en: "Hittite" },
  family: "indoeuropean",
  aligned: true,
  script: "cuneiform",
  // Anlaut nach der Keilschrift-Umschrift: kh ḫ, sh š, ts z
  onsets: { kh: "ḫ", sh: "š", ts: "z" },
  note: "Junghethitisch, vereinfacht; Verb am Ende.",
  lex: {
    // Ausgerichtet: Platz i entspricht dem lateinischen Wort auf Platz i, eigener Anlaut je Liste (Keilschrift-Umschrift ḫ š z).
    // Mit * markiert: nicht belegt, als Ableitung (-atar, -war) oder Umschreibung gebildet.
    imp: {
      abjuration: ["tarkh", "dashshanu", "khatk", "mimma", "pakhsh", "ishtap"], // bezwinge, stärke, schließe, verweigere, schütze, verstopfe
      conjuration: ["khalzai", "kallesh", "aniya", "pekhute", "uda", "tarna"], // rufe, lade, erschaffe, führe hin, bring her, lass frei
      divination: ["au", "shakk", "tekkushshanu", "ishtamash", "khalzai", "kinu"], // sieh, wisse, zeige, horche, lies vor, öffne
      enchantment: ["ishkhai", "watarnakh", "malai", "ep", "punush", "khink"], // binde, gebiete, billige, ergreife, befrage, beuge
      evocation: ["arai", "uiya", "lukk", "duwarni", "peshshiya", "warnu"], // erhebe dich, sende, entzünde, zerbrich, wirf, verbrenne
      illusion: ["aniya", "tukk", "kariya", "munnai", "gulsh", "dankunu"], // bilde, scheine, bedecke, verbirg, ritze, verdunkle
      necromancy: ["khuittiya", "arnu", "mer", "kuen", "eku", "takni"], // ziehe heraus, bringe hoch, schwinde, töte, trinke, in die Erde*
      transmutation: ["wakhnu", "nai", "iya", "mekkanu", "pai", "lai"], // wende um, drehe, mache, vermehre*, gib hin, löse
      universal: ["iya", "gulsh", "khark", "shunna", "maniyakh"], // mache, schreibe, halte, fülle, verwalte
    },
    ess: {
      ignis: ["pakhur", "lappiya", "khashsha", "warnumar", "ishtanana"], // Feuer, Flamme, Herd, Brand*, Altar
      aqua: ["watar", "aruna", "ekuna", "nepishwatar", "ikunatar"], // Wasser, Meer, kalt, Himmelswasser*, Kälte*
      aer: ["nepish", "khuwant", "wantemma", "tethima", "ishtantsa"], // Himmel, Wind, Glut, Donner, Seele
      terra: ["tekan", "peruna", "aku", "marshatar", "khapalki"], // Erde, Fels, Stein, Verderbnis*, Eisen
      vita: ["khuishwatar", "takshul", "warwalan", "eshkhar", "alil"], // Leben, Wohl, Nachkomme, Blut, Blume
      mors: ["akkatar", "kuenna", "khashtai", "marshatar", "takni"], // Sterben, Töten, Gebein, Verderbnis*, in der Erde
      lux: ["lalukkima", "tsuppari", "shiwatt", "wantemma", "kharki"], // Licht, Fackel, Tag, Glut, weiß
      umbra: ["dankui", "nekuts", "ishpant", "warshula", "kureshshar"], // dunkel, Abend, Nacht, Dunst, Kopftuch
      mens: ["kardi", "ishtantsa", "shakkhi", "memiyan", "teshkha"], // Herz, Seele, ich weiß, Wort, Traum
      vis: ["innarawatar", "parkhuwar", "tarkhuili", "dashshu", "mekki"], // Kraft, Jagd*, Heldenstärke, schwer, viel
      ordo: ["aniur", "ishkhiul", "khamankatar", "shiyatar", "lingai"], // Ritual, Verpflichtung, Bindung*, Siegelung, Eid
      fluxus: ["khapa", "wakhnumar", "tsakhkhai", "irkhatar", "kishatar"], // Fluss, Wendung*, Schlacht, Umkreisung*, Geschehen*
      bonum: ["ashshu", "shuppi", "kanesh", "nepish", "parkui"], // gut, heilig, Gunst, Himmel, rein
      malum: ["idalu", "washtul", "patteshshar", "khurtai", "alwantsatar"], // böse, Sünde, Grube, Fluch, Zauberei
      spatium: ["dalugatar", "ashka", "irkhash", "palsha", "tuwa"], // Länge*, Tor, Grenze, Weg, fern
      tempus: ["mekhur", "shiwatt", "appan", "karuili", "witt"], // Zeit, Tag, danach, uralt, Jahr
    },
    shape: {
      cone: "khuwashi", line: "palsha", ray: "kalmara", burst: "walkhuwar", spread: "parkhuwar", emanation: "arkha",
      cylinder: "taru", wall: "kutt", sphere: "ishtanu", cube: "peru", touch: "keshshar", self: "apash",
      targets: "kurur", object: "uttar", summon: "khuitar", sensor: "shakuwa", symbol: "gulshuwar", other: "iyawar",
    },
    range: ["ammuk", "keshshari", "kattan", "tuwa", "tuwa tuwa", "arkhash parranda"],
    rangeTail: ["palshi", "parranda", "arkha", "kururi"],
    duration: {
      instant: "kinun", rounds: "kuitman", minutes: "mekhuni", hours: "shiwatti", days: "shiwattash",
      permanent: "khumanti mekhuni", concentration: "kardiyash", special: "kishan",
    },
    durVerb: ["eshtu", "artaru", "tarkhu"],
    conj: ["nu", "kattan", "anda"],
    dir: { in: "anda", out: "arkha" },
    signObj: ["gulshash", "khuwashi", "kutt", "arkhash"],
    save: { will: "ishtantsa", fort: "innarawatar", ref: "khudak" },
    saveOpen: "kheshan",
    saveVerb: ["duwarnai", "kharkdu", "tarkhdu"],
    material: ["piyan", "shippant", "uttar"],
    materialVerb: ["piyant", "shippant", "arkha"],
    seal: ["shiyai", "ishkhiul"],
    sealVerb: ["duwarnan", "parranda"],
    ordWord: ["shakli", "palshi", "ishkhiuli"],
    ord: ["shia", "dan", "teri", "meyu", "penkwe", "sweks", "septm", "okto", "newn"],
    close: ["eshtu", "kishan eshtu", "kishari", "nu kishan kishari"],
    answer: ["ishtamash", "uwa", "eshtu", "arta"],
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
  // Brücken zum lateinischen Fachwort; cognate: echte gemeinsame Wurzel
  bridges: {
    aqua: { word: "watar", latin: "unda", cognate: true },
    terra: { word: "tekan", latin: "humus", cognate: true },
    aer: { word: "nepish", latin: "nebula", cognate: true },
    mens: { word: "kardi", latin: "cor", cognate: true },
    ignis: { word: "pakhur", latin: "ignis", cognate: false },
    umbra: { word: "nekuts", latin: "nox", cognate: true },
    vis: { word: "mekki", latin: "magnus", cognate: true },
    tempus: { word: "witt", latin: "vetus", cognate: true },
  },
};
