// Formelsprache Mittelkymrisch – Leihsprache, vereinfacht.
// Sprachstufe: Mittelkymrisch nach den Wörterbüchern, in Lautschrift statt walisischer Rechtschreibung
// (ll → hl, dd → th, f → v, ff → f, ch → kh, w/y als u/i bzw. e). Anlautmutationen nur in festen Wendungen.
// Satzbau: Verb zuerst (VSO).
(window.FORMULA_LANGS = window.FORMULA_LANGS || {}).welsh = {
  id: "welsh",
  name: { de: "Mittelkymrisch", en: "Middle Welsh" },
  family: "indoeuropean",
  aligned: true,
  // Anlaut im walisischen Alphabet: hl ll, hr rh, kh ch, k c; Lautschrift v ist f, f ist ff
  onsets: { hl: "ll", hr: "rh", kh: "ch", k: "c", v: "f", f: "ff", th: "th", ph: "ph", ng: "ng" },
  note: "Mittelkymrisch in Lautschrift; Verb zuerst.",
  lex: {
    // Ausgerichtet: Platz i entspricht dem lateinischen Wort auf Platz i, eigener Anlaut je Liste (walisisches Alphabet)
    imp: {
      abjuration: ["amthivin", "nertha", "kai", "hluthia", "gwarkhod", "sikra"], // verteidige, stärke, schließe, hindere, behüte, sichere
      conjuration: ["galu", "erkhi", "kreu", "tuis", "hlusgo", "agor"], // rufe, fordere, erschaffe, führe, schleife, öffne
      divination: ["gwel", "kanvod", "datguthia", "edrikh", "hriva", "agor"], // sieh, nimm wahr, enthülle, schau, zähle, öffne
      enchantment: ["hruim", "gorkhimin", "dovi", "kafel", "huda", "pluga"], // binde, gebiete, zähme, ergreife, verlocke, beuge
      evocation: ["tori", "anvon", "hlosg", "drulha", "buru", "esu"], // brich, sende, brenne, zerschmettere, wirf, verzehre
      illusion: ["hlunia", "fugia", "gorkhutha", "kuthia", "painta", "tuihla"], // forme, täusche vor, bedecke, verbirg, male, täusche
      necromancy: ["tunnu", "devro", "gwiwa", "hlath", "sugna", "klathu"], // zieh heraus, erwache, welke, töte, sauge, begrabe
      transmutation: ["newid", "tro", "hlunia", "amlha", "kluda", "datod"], // verändere, wende, forme, mehre, trage, löse
      universal: ["gwna", "esgrivenna", "dal", "hlanw", "hreoli"], // mache, schreibe, halte, fülle, lenke
    },
    ess: {
      ignis: ["taan", "flam", "marwor", "ivel", "koelkerth"], // Feuer, Flamme, Glut, Funke, Freudenfeuer
      aqua: ["duur", "tonn", "hrew", "eira", "oir"], // Wasser, Welle, Frost, Schnee, kalt
      aer: ["awir", "gwint", "mehlt", "taran", "khwith"], // Luft, Wind, Blitz, Donner, Hauch
      terra: ["daiar", "kraig", "main", "surni", "haiarn"], // Erde, Fels, Steine, Säure, Eisen
      vita: ["buwid", "iekhid", "egin", "gwaid", "flur"], // Leben, Gesundheit, Keim, Blut, Blüte
      mors: ["angai", "diva", "hluthu", "puthreth", "beth"], // Tod, Vernichtung, Asche, Fäulnis, Grab
      lux: ["golai", "fagl", "pelidr", "hlewirkh", "disglair"], // Licht, Fackel, Strahl, Glanz, hell
      umbra: ["kesgod", "tewihl", "nos", "muug", "hlen"], // Schatten, Dunkel, Nacht, Rauch, Schleier
      mens: ["methul", "enaid", "tubiav", "kov", "breithwid"], // Geist, Seele, ich meine, Gedächtnis, Traum
      vis: ["nerth", "hruthr", "kadarn", "puis", "maint"], // Kraft, Ansturm, stark, Gewicht, Größe
      ordo: ["trevn", "kevraith", "hruim", "sel", "mesur"], // Ordnung, Gesetz, Fessel, Siegel, Maß
      fluxus: ["hliv", "newid", "anhrevn", "trobuhl", "damwain"], // Strom, Wandel, Unordnung, Strudel, Zufall
      bonum: ["da", "sant", "gras", "nev", "futhlon"], // gut, heilig, Gnade, Himmel, treu
      malum: ["drug", "kamweth", "afuis", "mehltith", "trosseth"], // böse, Unrecht, Abgrund, Fluch, Vergehen
      spatium: ["govod", "drus", "tervin", "forth", "pehlter"], // Raum, Tür, Grenze, Weg, Ferne
      tempus: ["amser", "orig", "gohir", "tragwith", "kenhethlaeth"], // Zeit, Weile, Aufschub, Ewigkeit, Geschlecht
    },
    shape: {
      cone: "korn", line: "hlinehl", ray: "pelidr", burst: "torri", spread: "hled", emanation: "anadl",
      cylinder: "kolovn", wall: "muur", sphere: "peel", cube: "kist", touch: "hlau", self: "hiin",
      targets: "gelin", object: "peth", summon: "esbrid", sensor: "hlegad", symbol: "aruith", other: "firv",
    },
    range: ["imi", "en ve hlau", "agos", "pehl", "pehl behl", "tros e fiin"],
    rangeTail: ["hiid e diweth", "dros e moor", "at e gelin", "truir biid"],
    duration: {
      instant: "ar inwaith", rounds: "am ennid", minutes: "am ekhedig", hours: "am oriai", days: "am thethiai",
      permanent: "en dragwithol", concentration: "tra methiliav", special: "vel er esgrivenwid",
    },
    durVerb: ["bethed", "arhosed", "parhaid"],
    conj: ["a", "gida", "en"],
    dir: { in: "i mewn", out: "ahlan" },
    signObj: ["aruith", "kilkh", "fiin", "nod"],
    save: { will: "ewihlis", fort: "nerth", ref: "keflimder" },
    saveOpen: "agored",
    saveVerb: ["torred", "ildied", "prover"],
    material: ["hroth", "aberth", "priis"],
    materialVerb: ["a rothwid", "a losgwid", "a dalwid"],
    seal: ["seel", "hruim"],
    sealVerb: ["a dorwid", "a groiswid"],
    ordWord: ["en e rath", "truir drevn", "ar e griis"],
    ord: ["kintav", "ail", "tredith", "pedwerith", "pimed", "khwekhed", "saithved", "uithved", "nauved"],
    close: ["bethed", "vehli bethed", "darvi", "gwnaid"],
    answer: ["kliu", "tird", "saav", "bethed"],
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
    order: "{imp} {ordWord}, {ord}",
    close: "{close}!",
    answer: "{ess}, {imp}[, {answer}].",
  },
  // Gemeinsame Wurzel mit dem lateinischen Wort desselben Platzes (für Brückennotizen); Lehnwörter nicht
  stems: {
    ess: { vita: ["*gʷih₃-", null, null, null, null], umbra: [null, null, "*nekʷt-", null, null], mens: [null, "*h₂enh₁-", null, null, null] },
  },
  bridges: {
    umbra: { word: "nos", latin: "nox", cognate: true },
    aqua: { word: "moor", latin: "mare", cognate: true },
    bonum: { word: "diu", latin: "deus", cognate: true },
    vita: { word: "buwid", latin: "vita", cognate: true },
  },
};
