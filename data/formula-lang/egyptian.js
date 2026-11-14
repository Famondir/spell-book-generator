// Formelsprache Mittelägyptisch – Leihsprache, vereinfacht.
// Sprachstufe: Mittelägyptisch nach den Wörterbüchern; Aussprache nach ägyptologischer Schulkonvention
// (zwischen die Konsonanten ein e, ꜣ und ꜥ meist als a). Satzbau: Verb zuerst (VSO), keine Flexion.
// Umschrift: ḏ → dj, ṯ → tj, ḫ/ẖ → kh, š → sh, ḥ → h.
(window.FORMULA_LANGS = window.FORMULA_LANGS || {}).egyptian = {
  id: "egyptian",
  name: { de: "Mittelägyptisch", en: "Middle Egyptian" },
  family: "egyptian",
  aligned: true,
  script: "hieroglyphs",
  // feste Schreibungen im Schriftband (sonst Einkonsonantenzeichen)
  scriptWords: { ankh: "𓋹", maat: "𓁦", nefer: "𓄤", djed: "𓊽" },
  // Anlaut nach der ägyptologischen Umschrift: dj ḏ, tj ṯ, kh ḫ, sh š
  onsets: { dj: "ḏ", tj: "ṯ", kh: "ḫ", sh: "š" },
  note: "Mittelägyptisch, Schulaussprache; Verb zuerst.",
  lex: {
    // Ausgerichtet: Platz i entspricht dem lateinischen Wort auf Platz i, eigener Anlaut je Liste (Umschrift ḏ ṯ ḫ š).
    // Mit * markiert: Umschreibung, kein belegtes Einzelwort.
    imp: {
      abjuration: ["sheni", "rudj", "khetem", "tem", "meki", "semen"], // beschwöre fort, festige, versiegle, nicht!, schütze, mache fest
      conjuration: ["nis", "peri", "qema", "seshem", "itjeh", "wen"], // rufe, komm hervor, erschaffe, führe, schleppe, öffne
      divination: ["maa", "rekh", "sekhaa", "degi", "shedi", "wen"], // sieh, erkenne, lass erscheinen, blick, lies, öffne
      enchantment: ["tjes", "wedj", "hetep", "itj", "djed", "ksi"], // knüpfe, gebiete, besänftige, ergreife, sprich, beuge dich
      evocation: ["peri", "hab", "rekeh", "sed", "wedi", "neser"], // brich hervor, sende, brenne, zerbrich, wirf, flamme
      illusion: ["qed", "kheper", "hebes", "imen", "sesh", "gereg"], // bilde, werde zu, kleide, verbirg, male, lüge
      necromancy: ["setj", "nehes", "wesher", "mut", "am", "qeres"], // gieße, erwecke, dörre, töte, verschlucke, begrabe
      transmutation: ["kheper", "pekher", "qema", "sewer", "djai", "weha"], // werde, wende, erschaffe, mache groß, setze über, löse
      universal: ["iri", "sesh", "khefa", "meh", "heqa"], // mache, schreibe, packe, fülle, herrsche
    },
    ess: {
      ignis: ["khet", "sedjet", "neser", "tjeka", "rekeh"], // Feuer, Flamme, Lohe, Fackelflamme, Glutbrand
      aqua: ["mu", "nun", "kebeh", "hedjmu", "qeb"], // Wasser, Urflut, kühles Wasser, weißes Wasser*, Kühle
      aer: ["shu", "tjau", "seshed", "kherew", "nef"], // Luft, Atemwind, Blitz, Getöse, Hauch
      terra: ["ta", "djew", "iner", "hemedj", "bia"], // Erde, Berg, Stein, Essig, Eisen
      vita: ["ankh", "seneb", "wadj", "desher", "hereret"], // Leben, Gesundheit, grün, rot, Blume
      mors: ["mut", "hedj", "takhet", "khat", "imentet"], // Tod, Zerstörung, Feuererde*, Leichnam, Westen
      lux: ["iakhu", "tjeka", "setut", "akh", "hedj"], // Sonnenlicht, Fackel, Strahlen, Verklärung, weiß
      umbra: ["shut", "keku", "gereh", "iadet", "hebes"], // Schatten, Finsternis, Nacht, Tau, Gewand
      mens: ["ib", "ba", "kai", "sekha", "resut"], // Herz, Ba-Seele, ersinnen, Erinnerung, Traum
      vis: ["sekhem", "peri", "nakht", "deben", "aa"], // Macht, Ausfall, stark, Gewicht, groß
      ordo: ["maat", "hep", "tjes", "khetem", "tephesb"], // Ordnung, Gesetz, Knoten, Siegel, rechte Rechnung
      fluxus: ["hapi", "kheperu", "isfet", "qerert", "shai"], // Flut, Werden, Chaos, Höhlenwirbel, Schicksal
      bonum: ["nefer", "djeser", "hesi", "pet", "imakh"], // gut, heilig, Gunst, Himmel, ehrwürdig
      malum: ["dju", "bin", "duat", "shenet", "gereg"], // böse, schlecht, Unterwelt, Bann, Lüge
      spatium: ["akhet", "sba", "tash", "wat", "hery"], // Horizont, Tür, Grenze, Weg, fern
      tempus: ["at", "wenut", "khet", "heh", "rek"], // Augenblick, Stunde, danach, Ewigkeit, Ära
    },
    shape: {
      cone: "benben", line: "wat", ray: "setut", burst: "pesedj", spread: "pesesh", emanation: "weben",
      cylinder: "djed", wall: "sebti", sphere: "iten", cube: "hut", touch: "djeret", self: "djes",
      targets: "kheftiu", object: "ikhet", summon: "shemsu", sensor: "iret", symbol: "tit", other: "iru",
    },
    range: ["eri", "em djeret", "kher", "wa", "er wa", "her djeru"],
    rangeTail: ["er akhet", "er djeru", "her wat", "er kheftiu"],
    duration: {
      instant: "em at", rounds: "em atu", minutes: "em unut nedjes", hours: "em unut", days: "em heru",
      permanent: "er heh", concentration: "em ib", special: "mi sesh",
    },
    durVerb: ["wen", "men", "kheper"],
    conj: ["hena", "em", "her"],
    dir: { in: "er khenu", out: "er bener" },
    signObj: ["tit", "shenu", "djeru", "iten"],
    save: { will: "ib", fort: "nakht", ref: "khakh" },
    saveOpen: "wen",
    saveVerb: ["sedj", "seher", "wedja"],
    material: ["hetep", "debhu", "ikhet"],
    materialVerb: ["redi", "wah", "iri"],
    seal: ["khetem", "shenu"],
    sealVerb: ["sedj", "wen"],
    ordWord: ["em", "her sesh", "em tjes"],
    ord: ["tepi", "senu", "khemtu", "fedu", "diu", "sisu", "sefekh", "khemenu", "pesdj"],
    close: ["kheper", "men er heh", "djed medu", "nefer wen"],
    answer: ["sedjem", "mi", "wen", "aha"],
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
    order: "{ordWord} {ord}, {imp}",
    close: "{close}!",
    answer: "{ess}, {imp}[, {answer}].",
  },
  // keine gemeinsame Wurzel mit dem Lateinischen; Entsprechungen der Seelenlehre
  bridges: {
    vita: { word: "ka", latin: "Vita", cognate: false },
    mens: { word: "ba", latin: "Mens", cognate: false },
    ordo: { word: "maat", latin: "Ordo", cognate: false },
    tempus: { word: "heh", latin: "aevum", cognate: false },
  },
};
