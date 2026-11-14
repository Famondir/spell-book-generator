// Formelsprache „Klangsprache mit Bantu-Lautbild“ – eigene Kunstsprache, keine echte Sprache.
// Erfundener Wortschatz mit dem Lautbild vieler Bantusprachen: offene Silben, Nominalklassen-Präfixe
// (mu-, ki-, ma-, lu-, n-), pränasalierte Konsonanten (mb, nd, ng), Verben auf -a, Wunschform auf i-…-e.
// Ähnlichkeiten mit echten Wörtern sind zufällig; nur die Zahlwörter folgen den üblichen urbantu-ähnlichen Formen.
// Satzbau: Verb zuerst. Umschrift: y → j, ch → tsch, sh → sch (deutsch).
(window.FORMULA_LANGS = window.FORMULA_LANGS || {}).bantu = {
  id: "bantu",
  name: { de: "Klangsprache (Bantu-Lautbild)", en: "Sound language (Bantu-like)" },
  family: "constructed-bantu",
  aligned: true,
  // Anlaute: sh, ch und ny sind eigene Laute, nicht s, c und n
  onsets: { sh: "š", ch: "č", ny: "ɲ" },
  note: "Erfundene Klangsprache; offene Silben, Klassenpräfixe; Verb zuerst.",
  lex: {
    // Ausgerichtet: Platz i entspricht dem lateinischen Wort auf Platz i (Bedeutung im Kommentar), eigener Anlaut je Liste
    imp: {
      abjuration: ["zitika", "kumbela", "fundeya", "lekanya", "tetela", "pingila"], // wehre ab, befestige, schließe, verbiete, schütze, verriegle
      conjuration: ["yitana", "tumbula", "pandula", "letela", "kokola", "jondela"], // rufe, rufe hervor, erschaffe, führe, ziehe, öffne
      divination: ["onelela", "sikanya", "temboka", "lingila", "bazanga", "fukula"], // sieh, unterscheide, enthülle, schau hin, lies, öffne
      enchantment: ["bandisa", "longela", "zungela", "kwatila", "sembeza", "pindama"], // binde, befiehl, besänftige, fasse, überrede, beuge
      evocation: ["tupaka", "mbumba", "chandula", "vunzula", "kumbanya", "zoleka"], // brich hervor, sende, brenne, zerbrich, wirf, verbrenne
      illusion: ["fichanya", "zimbela", "lungwa", "bisandila", "penda", "kenganya"], // forme vor, täusche vor, verhülle, verbirg, male, täusche
      necromancy: ["tekela", "zukula", "wumba", "fwisa", "yamwa", "kandamba"], // schöpfe, erwecke, welke, töte, sauge, begrabe
      transmutation: ["galuza", "pindula", "umbanya", "kongeza", "hamisa", "sanduka"], // wandle, wende, forme, mehre, übertrage, löse
      universal: ["tenda", "yandika", "shikola", "izula", "longola"], // mache, schreibe, halte, erfülle, lenke
    },
    ess: {
      ignis: ["mozandi", "lumbiko", "ngazo", "kipele", "bwando"], // Feuer, Flamme, Glut, Funke, Scheiterhaufen
      aqua: ["mazinda", "lubela", "kifuyo", "tandala", "zizima"], // Wasser, Welle, Frost, Schnee, Kälte
      aer: ["mupepe", "luvundu", "shaliko", "ngumba", "kipumu"], // Luft, Wind, Blitz, Donner, Hauch
      terra: ["ndolo", "mabwe", "kitandu", "lukali", "chumbu"], // Erde, Fels, Stein, Säure, Eisen
      vita: ["moyandi", "kizima", "lumbu", "ngazi", "tuluva"], // Leben, Heil, Keim, Blut, Blüte
      mors: ["kifundu", "ndulo", "mazimba", "bolelo", "lukumbi"], // Tod, Untergang, Asche, Verwesung, Grab
      lux: ["mwela", "kizali", "langa", "ngeleza", "tenela"], // Licht, Fackel, Strahl, Glanz, hell
      umbra: ["muzizo", "kivunda", "ndimba", "lufunzi", "chinga"], // Schatten, Finsternis, Nacht, Nebel, Schleier
      mens: ["moyolo", "nzela", "kikalo", "lukumbu", "bilota"], // Geist, Seele, ich denke, Erinnerung, Traum
      vis: ["ngundu", "twaluka", "makoma", "kibando", "lundu"], // Kraft, Ansturm, Stärke, Gewicht, Masse
      ordo: ["ndandi", "mwandu", "kifungo", "lusimbo", "tondelo"], // Ordnung, Gesetz, Fessel, Siegel, Richtschnur
      fluxus: ["mavulo", "kizunda", "ngelu", "lupindi", "bahazi"], // Fluss, Veränderung, Wirbel, Strudel, Zufall
      bonum: ["mbela", "kilanga", "luswelo", "zulunga", "tumbilo"], // das Gute, heilig, Gnade, Himmel, fromm
      malum: ["mabiko", "kitunzi", "ndalazi", "lupizo", "zambiko"], // das Böse, Frevel, Abgrund, Flüche, Verbrechen
      spatium: ["pandazi", "kiluvo", "mupaka", "ndila", "lutali"], // Raum, Tor, Grenze, Weg, Entfernung
      tempus: ["mukala", "ndalo", "kisiku", "lelelo", "zamandi"], // Zeit, Stunde, Aufschub, Ewigkeit, Zeitalter
    },
    shape: {
      cone: "kiswela", line: "mulongo", ray: "lusembo", burst: "mbuluka", spread: "katazi", emanation: "mpumo",
      cylinder: "mulunda", wall: "lukomo", sphere: "kipula", cube: "kitende", touch: "mukondo", self: "kenyezi",
      targets: "mbadu", object: "kindu", summon: "nkuvu", sensor: "kiliso", symbol: "ndembo", other: "ngala",
    },
    range: ["kwami", "mu mukondo", "papipi", "kutali", "kutali kutali", "pambali ya ndila"],
    rangeTail: ["mpaka ndila", "kuzungula", "kwa mbadu", "pa ngala"],
    duration: {
      instant: "sasala", rounds: "kapindi", minutes: "kakala", hours: "mazawa", days: "masiku",
      permanent: "milelo", concentration: "mu moyolo", special: "ngati yandiko",
    },
    durVerb: ["ikale", "ibe", "ilame"],
    conj: ["na", "pamo", "mu"],
    dir: { in: "mukati", out: "panze" },
    signObj: ["ndembo", "kipula", "lukomo", "ngala"],
    save: { will: "moyolo", fort: "ngundu", ref: "lubilo" },
    saveOpen: "ilekelwa",
    saveVerb: ["ivunde", "itinde", "ipime"],
    material: ["kipo", "luzawo", "mtengo"],
    materialVerb: ["yapewa", "yalika", "yamala"],
    seal: ["ndembo", "kifungo"],
    sealVerb: ["yavunda", "yapita"],
    ordWord: ["mu ndandi", "pa ngazi", "ku lukomo"],
    ord: ["wa mozi", "wa bili", "wa tatu", "wa nayi", "wa tano", "wa tandatu", "wa sambo", "wa nana", "wa kenda"],
    close: ["ibe ivyo", "imalike", "nanga", "kwisa"],
    answer: ["yuva", "iza", "imila", "ibe"],
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
    order: "{ordWord} {ord}, {imp}",
    close: "{close}!",
    answer: "{ess}, {imp}[, {answer}].",
  },
  bridges: {
    mens: { word: "moyolo", latin: "Mens", cognate: false },
    vita: { word: "moyandi", latin: "Vita", cognate: false },
  },
};
