// Formelsprache Akkadisch – Leihsprache, vereinfacht.
// Sprachstufe: Alt-/Jungbabylonisch nach den Wörterbüchern; Imperativ 2. Person, Wunschform mit lu/li-,
// Zustandsform für „gegeben, versiegelt“. Satzbau: Verb am Ende. Kasusendungen vereinfacht.
// Umschrift: š → sh, ḫ → kh, ṣ → s, ṭ → t, q bleibt; Langvokale nur bei Einsilblern (muu).
(window.FORMULA_LANGS = window.FORMULA_LANGS || {}).akkadian = {
  id: "akkadian",
  name: { de: "Akkadisch", en: "Akkadian" },
  family: "semitic",
  aligned: true,
  script: "cuneiform",
  // Anlaut nach der Keilschrift-Umschrift: sh š, kh ḫ
  onsets: { sh: "š", kh: "ḫ" },
  note: "Babylonisch, vereinfacht; Verb am Ende.",
  lex: {
    // Ausgerichtet: Platz i entspricht dem lateinischen Wort auf Platz i, eigener Anlaut je Liste (Umschrift š ḫ)
    imp: {
      abjuration: ["turud", "dunnin", "edil", "kala", "usur", "sikir"], // vertreibe, stärke, verriegle, halte zurück, bewache, sperre
      conjuration: ["shisi", "alka", "bini", "redi", "nusukh", "pite"], // rufe, komm her, erschaffe, führe, reiß heraus, öffne
      divination: ["amur", "biri", "kullim", "naplis", "shitassi", "pite"], // sieh, schau die Zeichen, zeige, blick hin, lies, öffne
      enchantment: ["rukus", "shupur", "nukh", "sabat", "qibi", "kunnish"], // binde, gebiete, beruhige, ergreife, sprich, beuge
      evocation: ["mahas", "turud", "qumi", "khipi", "idi", "shurup"], // schlage, sende fort, verbrenne, zerbrich, wirf, verbrenne ganz
      illusion: ["esir", "shunni", "kutum", "puzur", "lipit", "surrir"], // zeichne, verstelle, bedecke, verbirg, bestreiche, lüge
      necromancy: ["dili", "tebi", "abil", "ner", "iniq", "qibir"], // schöpfe, erhebe dich, vertrockne, töte, sauge, begrabe
      transmutation: ["nukkir", "turra", "bini", "ruppish", "shubil", "pushur"], // verändere, wende, bilde, weite, sende hinüber, löse
      universal: ["epush", "shutur", "kil", "mulli", "redi"], // mache, schreibe, halte, fülle, lenke
    },
    ess: {
      ignis: ["ishatu", "nablu", "khimtu", "girra", "kinunu"], // Feuer, Flamme, Brand, Feuer, Kohlenbecken
      aqua: ["muu", "agu", "khalpu", "shalgu", "kussu"], // Wasser, Woge, Frost, Schnee, Kälte
      aer: ["zaqiqu", "sharu", "birqu", "rigmu", "napishtu"], // Hauch, Wind, Blitz, Donnerhall, Atem
      terra: ["ersetu", "kapu", "abnu", "marru", "parzillu"], // Erde, Fels, Stein, bitter, Eisen
      vita: ["balatu", "shulmu", "zeru", "damu", "sippatu"], // Leben, Wohl, Same, Blut, Blüte
      mors: ["mutu", "khulqu", "tikmennu", "bushanu", "qebru"], // Tod, Untergang, Asche, Gestank, Grab
      lux: ["nuru", "diparu", "sharuru", "melammu", "ebbu"], // Licht, Fackel, Strahlen, Glanz, hell
      umbra: ["sillu", "ekletu", "mushu", "imbaru", "kutummu"], // Schatten, Finsternis, Nacht, Nebel, Hülle
      mens: ["temu", "libbu", "akhsus", "khissatu", "shuttu"], // Verstand, Herz, ich bedachte, Erinnerung, Traum
      vis: ["emuqu", "tibu", "dannu", "kabtu", "rabu"], // Kraft, Angriff, stark, schwer, groß
      ordo: ["parsu", "dinu", "riksu", "kunukku", "misharu"], // Ordnung, Recht, Band, Siegel, Gerechtigkeit
      fluxus: ["naru", "shunnu", "eshitu", "abubu", "ittu"], // Fluss, Wandel, Wirrnis, Sintflut, Vorzeichen
      bonum: ["damqu", "ellu", "remu", "shamuu", "nadu"], // gut, rein, Erbarmen, Himmel, fromm
      malum: ["lemnu", "ikkibu", "apsu", "mamitu", "khititu"], // böse, Tabu, Urwassertiefe, Eidfluch, Frevel
      spatium: ["kibratu", "babu", "misru", "kharranu", "ruqu"], // Weltgegenden, Tor, Grenze, Weg, fern
      tempus: ["adanu", "beru", "ukhkhuru", "dariatu", "palu"], // Frist, Doppelstunde, Verzug, Ewigkeit, Ära
    },
    shape: {
      cone: "qarnu", line: "quu", ray: "sharuru", burst: "tibu", spread: "rapshu", emanation: "melammu",
      cylinder: "dimtu", wall: "duru", sphere: "kippatu", cube: "libittu", touch: "qatu", self: "ramanu",
      targets: "ayabu", object: "mimmu", summon: "shedu", sensor: "inu", symbol: "ittu", other: "binutu",
    },
    range: ["ana yashi", "ina qati", "itti", "ruqu", "ruqish", "eli kibrati"],
    rangeTail: ["ana kibrati", "ina kharrani", "ana ayabi", "ana babi"],
    duration: {
      instant: "ina ishteni", rounds: "ina qerbi", minutes: "ina beri", hours: "ina beri u beri", days: "ina ume",
      permanent: "ana dariati", concentration: "ina libbi", special: "kima shatri",
    },
    durVerb: ["lu", "likun", "lishlim"],
    conj: ["u", "itti", "ina"],
    dir: { in: "ana libbi", out: "ana kidi" },
    signObj: ["ittu", "kippatu", "kisurru", "usurtu"],
    save: { will: "temu", fort: "dunnu", ref: "khamtu" },
    saveOpen: "petu",
    saveVerb: ["lishshebir", "lippatir", "libbalkit"],
    material: ["niqu", "qishtu", "maqlu"],
    materialVerb: ["nadin", "qalu", "shakin"],
    seal: ["kunukku", "riksu"],
    sealVerb: ["patir", "shebir"],
    ordWord: ["ina", "ana", "ina riksi"],
    ord: ["mahru", "shanu", "shalshu", "rebu", "khamshu", "sheshu", "sebu", "samnu", "tishu"],
    close: ["lu kittu", "lishlim", "likun", "kima qibiti"],
    answer: ["shime", "alka", "izziz", "lu"],
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
    order: "{ordWord} {ord} {imp}",
    close: "{close}!",
    answer: "{ess}[ {answer}] {imp}.",
  },
  bridges: {
    vita: { word: "napishtu", latin: "Vita", cognate: false },
    mens: { word: "temu", latin: "Mens", cognate: false },
    ordo: { word: "kittu", latin: "Ordo", cognate: false },
    malum: { word: "utukku", latin: "Malum", cognate: false },
  },
};
