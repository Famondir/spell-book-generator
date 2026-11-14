// Formelsprache „Technisch“ – eigene Kunstsprache.
// Klingt nach Gerät und Protokoll: Befehle auf -ek, Essenzen als Fachwörter aus griechisch-lateinischen
// Stämmen, Ordnungen als zweistellige Ziffern. Satzbau: Verb – Gestalt – Essenz, Doppelpunkt statt Komma.
// Keine Umschrift (phonetic: false): Die Schreibung gilt für alle Lesesprachen.
(window.FORMULA_LANGS = window.FORMULA_LANGS || {}).technic = {
  id: "technic",
  name: { de: "Technische Kunstsprache", en: "Technical constructed language" },
  family: "constructed-technic",
  phonetic: false,
  aligned: true,
  note: "Kunstsprache mit Befehlsformen; Verb – Gestalt – Essenz.",
  lex: {
    // Ausgerichtet: Platz i entspricht dem lateinischen Wort auf Platz i, eigener Anlaut je Liste
    imp: {
      abjuration: ["deflektek", "fortifek", "klosek", "blokek", "skudek", "lokek"], // wehre ab, befestige, schließe, verbiete, schütze, verriegle
      conjuration: ["invokek", "evokek", "kompilek", "routek", "lodek", "portek"], // rufe, rufe hervor, erschaffe, führe, ziehe, öffne
      divination: ["skanek", "filterek", "dekodek", "monitorek", "parsek", "unzipek"], // sieh, unterscheide, enthülle, schau hin, lies, öffne
      enchantment: ["linkek", "komandek", "dampek", "grabek", "promptek", "bendek"], // binde, befiehl, besänftige, fasse, überrede, beuge
      evocation: ["burstek", "emittek", "ignek", "krashek", "launchek", "overlodek"], // brich hervor, sende, brenne, zerbrich, wirf, verbrenne
      illusion: ["renderek", "simulek", "maskek", "hidek", "pixelek", "fakek"], // forme vor, täusche vor, verhülle, verbirg, male, täusche
      necromancy: ["extraktek", "rebutek", "dekayek", "haltek", "absorbek", "bunkerek"], // schöpfe, erwecke, welke, töte, sauge, begrabe
      transmutation: ["konvertek", "flipek", "transformek", "upskalek", "migrek", "dissolvek"], // wandle, wende, forme, mehre, übertrage, löse
      universal: ["runek", "writek", "holdek", "fillek", "exekut"], // mache, schreibe, halte, erfülle, lenke
    },
    ess: {
      ignis: ["pyrax", "flammon", "therm", "sparkit", "kalorit"], // Feuer, Flamme, Glut, Funke, Scheiterhaufen
      aqua: ["hydrax", "undon", "kryon", "nivit", "frigax"], // Wasser, Welle, Frost, Schnee, Kälte
      aer: ["pnevax", "anemon", "volton", "brontax", "spiron"], // Luft, Wind, Blitz, Donner, Hauch
      terra: ["geon", "petrax", "lithax", "azidit", "ferron"], // Erde, Fels, Stein, Säure, Eisen
      vita: ["biox", "sanon", "zelit", "hemax", "florit"], // Leben, Heil, Keim, Blut, Blüte
      mors: ["nekrax", "thanon", "zindrax", "lysit", "kryptax"], // Tod, Untergang, Asche, Verwesung, Grab
      lux: ["fotax", "torchon", "radit", "lumon", "klarit"], // Licht, Fackel, Strahl, Glanz, hell
      umbra: ["skotax", "darkon", "nokton", "hazit", "velon"], // Schatten, Finsternis, Nacht, Nebel, Schleier
      mens: ["kognax", "psykon", "noeton", "memit", "oniron"], // Geist, Seele, ich denke, Erinnerung, Traum
      vis: ["dynax", "impulsit", "kraton", "gravit", "massax"], // Kraft, Ansturm, Stärke, Gewicht, Masse
      ordo: ["taxon", "nomax", "bindon", "sigit", "algorit"], // Ordnung, Gesetz, Fessel, Siegel, Richtschnur
      fluxus: ["fluxon", "deltax", "entrax", "vortax", "randit"], // Fluss, Veränderung, Wirbel, Strudel, Zufall
      bonum: ["optax", "hagion", "gratit", "zelestax", "benon"], // das Gute, heilig, Gnade, Himmel, fromm
      malum: ["maltax", "korrupt", "abyssax", "hexon", "virex"], // das Böse, Frevel, Abgrund, Flüche, Verbrechen
      spatium: ["vektax", "portalon", "limitax", "routon", "distanzit"], // Raum, Tor, Grenze, Weg, Entfernung
      tempus: ["kronax", "sekundit", "latenz", "eonax", "zyklon"], // Zeit, Stunde, Aufschub, Ewigkeit, Zeitalter
    },
    shape: {
      cone: "konvek", line: "vektor", ray: "laserin", burst: "nova", spread: "difuz", emanation: "radial",
      cylinder: "kolumn", wall: "barier", sphere: "sfera", cube: "kubik", touch: "kontakt", self: "lokal",
      targets: "target", object: "objekt", summon: "instanz", sensor: "sensor", symbol: "glyf", other: "matrix",
    },
    range: ["lokal", "kontakt", "prox", "medial", "distal", "global"],
    rangeTail: ["ad nul", "per zyklus", "ad target", "trans grid"],
    duration: {
      instant: "instant", rounds: "tik", minutes: "zyklus", hours: "orbit", days: "rotat",
      permanent: "persist", concentration: "loop", special: "per spek",
    },
    durVerb: ["aktiv", "stabil", "persist"],
    conj: ["plus", "kom", "in"],
    dir: { in: "intern", out: "extern" },
    signObj: ["glyf", "grid", "limit", "ring"],
    save: { will: "kognit", fort: "integrit", ref: "latenz" },
    saveOpen: "bypass",
    saveVerb: ["kollaps", "breshek", "verifik"],
    material: ["input", "ressurs", "kredit"],
    materialVerb: ["konsumt", "alokat", "transfert"],
    seal: ["kripto", "lok"],
    sealVerb: ["krakt", "bypast"],
    ordWord: ["level", "nod", "rang"],
    ord: ["01", "02", "03", "04", "05", "06", "07", "08", "09"],
    close: ["exekut", "kommit", "halt", "status nul"],
    answer: ["ack", "synk", "redi", "ok"],
  },
  patterns: {
    core: "{imp} {shape}: {ess}!",
    pair: "{ess2} {conj} {ess}",
    range: "{range}, {rangeTail}",
    duration: "{duration} {durVerb}",
    sign: "{imp} {dir} {signObj}",
    save: "{save} {saveVerb}",
    material: "{material} {materialVerb}",
    seal: "{seal} {sealVerb}",
    order: "{ordWord} {ord}: {imp}",
    close: "{close}!",
    answer: "{ess}: {imp}[, {answer}].",
  },
  bridges: {
    ignis: { word: "pyrax", latin: "ignis", cognate: false },
    tempus: { word: "kronax", latin: "tempus", cognate: false },
  },
};
