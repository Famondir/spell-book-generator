// Lehrheft („Fibel der Kreise“): Seiten aus dem Lehrplan in data/primer.js, ergänzt um erzeugten
// Lehrstoff (Glyphen, Kreise, Stoffe, die kleinen Formeln des Buches) und – aus dem lokalen Profil –
// Meister, Stimmen am Rand, Übergabe und loses Blatt.
// Jeder Teil ist eine fließende Seite; die Lektionen darin sind teilbare Abschnitte (.splittable),
// Glossen und Randnotizen stehen in der Randspalte.
(function () {
  const e = U.esc;
  const T = window.THEORY;
  const G = window.G;
  const { S, polar, poly } = G;
  // Lehrplan in der Buchsprache: Struktur aus data/primer.js, Texte aus data/primer.en.js (gleiche Ids);
  // fehlende englische Felder bleiben deutsch und werden in I18N.untranslated gezählt
  const TEXT_FIELDS = ["title", "read", "glosses", "task", "check", "box", "sentences"];
  let enCache = null;
  function primerEn() {
    const D = window.PRIMER, E = window.PRIMER_EN || { lessons: {} };
    if (enCache && enCache.src === D) return enCache.val;
    const pick = (de, en, where) => I18N.pick(de, en, "primer:" + where);
    const val = {
      ...D,
      title: pick(D.title, E.title, "title"),
      subtitle: pick(D.subtitle, E.subtitle, "subtitle"),
      parts: D.parts.map((p) => ({ ...p, title: pick(p.title, (E.parts || {})[p.id], "part." + p.id) })),
      boxes: Object.fromEntries(Object.entries(D.boxes || {}).map(([k, b]) => [k, Object.fromEntries(Object.entries(b).map(([f, v]) => [f, pick(v, ((E.boxes || {})[k] || {})[f], `box.${k}.${f}`)]))])),
      lessons: D.lessons.map((L) => {
        const x = (E.lessons || {})[L.id] || {};
        const out = { ...L };
        for (const f of TEXT_FIELDS) if (L[f] != null) out[f] = pick(L[f], x[f], `${L.id}.${f}`);
        if (typeof L.taskFirst === "string") out.taskFirst = pick(L.taskFirst, x.taskFirst, `${L.id}.taskFirst`);
        return out;
      }),
    };
    enCache = { src: D, val };
    return val;
  }
  const P = () => (I18N.lang.book === "en" ? primerEn() : window.PRIMER);
  const EN = () => I18N.lang.book === "en";
  // Profiltexte sind einsprachig: das Profil der Buchsprache (ein deutsches lokales Profil liefert im englischen Buch das neutrale englische)
  // (in der Sprache des Profils ist das PROFILE selbst, sonst das Profil der Buchsprache)
  const BP = () => (window.PROFILE && PROFILE.book && I18N.lang.book !== PROFILE.localLang ? PROFILE.book() : window.PROFILE) || {};
  const prof = () => BP().primer || {};
  // Beinamen aus dem Profil (z. B. Namen der eigenen Welt), in Klammern hinter dem irdischen Namen;
  // der Schlüssel ist der deutsche Name, in englischen Profilen auch der englische
  const alias = (k, k2) => { const A = prof().aliases || {}; const a = A[k] || (k2 && A[k2]); return a ? ` <span class="alias">(${e(a)})</span>` : ""; };

  // ---------------------------------------------------------------------------
  // Beschriftungen des erzeugten Lehrstoffs je Buchsprache (Prosa des Lehrplans: data/primer.js und primer.en.js)
  // ---------------------------------------------------------------------------
  const TX = {
    de: {
      mview: "Ansicht des Meisters · nicht nachfahren – abzeichnen",
      lesson: "Lektion", lessonShort: "L ", page: "S.", task: "Aufgabe", part: "Teil",
      verdict: "☐ n ☐ p ☐ l · Datum _______ · Zeichen ____",
      ritual: [["school", "Schule"], ["level", "Grad"], ["time", "Wirkzeit"], ["components", "Komponenten"], ["checks", "Fertigkeitswürfe"], ["backlash", "Rückschlag"], ["failure", "Misslingen"], ["effect", "Wirkung"]],
      praise: "Höchstes Lob des Meisters", fear: "Größte Furcht der Lehrlinge", saying: "Redensart der Werkstatt",
      discHint: "Prüfscheibe: Anhang A.",
      comp: { V: "Stimme (V): die Formel wird gesprochen", S: "Geste (S): die Hände führen", F: "Fokus (F): ein Werkzeug, das bleibt", DF: "Göttlicher Fokus (GF): ein heiliges Zeichen" },
      compM: "Stoff (M): steht als alchemistisches Zeichen, hier Schwefel",
      casting: { standard: "Standard-Aktion · Punkt", swift: "Schnelle Aktion · Blitz", immediate: "Augenblick · Doppelblitz", fullround: "Volle Aktion · Bogen", round: "Eine Runde · Zeiger", minutes: "Minuten · Stundenglas", hours: "Stunden · doppeltes Stundenglas" },
      planets: [["sol", "Sonne", "Gold"], ["luna", "Mond", "Silber"], ["mercurius", "Merkur", "Quecksilber"], ["venus", "Venus", "Kupfer"], ["mars", "Mars", "Eisen"], ["iupiter", "Jupiter", "Zinn"], ["saturnus", "Saturn", "Blei"]],
      blocks: "Kreis · Halbmond · Kreuz",
      matHead: ["Stoff", "Zeichen", "Art und Essenz"],
      quick: ["1 · voller Kreis", "2 · Kern: Schule und Hauptessenz", "3 · Schnellglyphe", "Was die Striche sagen", "Kreise nach der Dauer", "Gestaltstriche", "Schlüssel der Schulfiguren"],
      gapLayers: [["essence", "Essenzring"], ["core", "Kernsiegel"], ["signs", "Zeichenring"], ["components", "Ecksteine"]],
      solutions: "Lösungen:",
      master: "Der Meister",
      contract: {
        fields: ["Lehrling", "Herkunft", "Meister", "Werkstatt, Ort", "Beginn der Lehre", "Dauer", "Gegenleistung"],
        years: "Jahre", consideration: "☐ Lehrgeld ☐ Dienst im Haus ☐ beides",
        masterH: "Der Meister verpflichtet sich",
        master: ["den Lehrling alles zu lehren, was in diesem Heft steht, und nichts davon zurückzuhalten, sobald er es tragen kann;", "ihn mit Kost, Kammer, Licht und Werkzeug zu versehen;", "ihn vor Gefahren der Werkstatt zu warnen, bevor er ihnen begegnet;", "seine Arbeit ehrlich zu prüfen."],
        apprH: "Der Lehrling verpflichtet sich",
        appr: ["zu lernen, zu üben und zu fragen;", "die Hausordnung zu halten;", "nichts aus Büchern und Schubladen des Meisters zu nehmen, was ihm nicht gegeben wurde;", "keine Formel zu wirken, die der Meister nicht freigegeben hat;", "Fremden nicht zu zeigen, was er hier lernt."],
        sign: ["Lehrling", "Meister", "Zeuge", "Siegel"],
      },
      schedule: [
        ["Erste Glocke", "Aufstehen, Wasser holen, Feuer anfachen, Werkstatt fegen"],
        ["Stille Stunde", "Vorbereitung: Meister und Lehrling studieren ihre Bücher, kein Wort"],
        ["Zweite Glocke", "Lektion beim Meister: Lesestück, Ansicht, Aufgabe"],
        ["Mittag", "Essen, danach eine halbe Stunde frei"],
        ["Dritte Glocke", "Werkstatt: Tinte, Federn, Papier, Übungsblätter"],
        ["Vesper", "Botengänge, Hausdienst, Strafarbeit"],
        ["Abendglocke", "Abendessen; danach Sprechstunde des Meisters: Fragen, Prüfung der Tagesarbeit"],
        ["Nachtglocke", "Licht aus. Wer noch liest, liest im Dunkeln."],
      ],
      scheduleHint: "Der siebte Tag ist frei. Die stille Stunde gilt auch an ihm.", penance: "Strafarbeiten dieses Jahr:",
      kit: [
        ["Zum Schreiben", ["Wachstafel und Griffel", "drei Gänsefedern", "eine Rabenfeder", "Federmesser und Abziehstein", "Tintenhorn mit Deckel", "Sandstreuer", "Tuch zum Abwischen"]],
        ["Zum Zeichnen", ["Zirkel mit festem Gelenk", "Lineal aus Holz", "Winkeleisen", "Schnur und Pflock", "Bleigriffel", "Ahle zum Stechen", "Prüfscheibe (Anhang A)"]],
        ["Zum Bewahren", ["Abfallpapier, ein Stapel", "zwei Bögen Pergament", "Bimsstein und Kreide", "Schachtel für Stoffe", "dieses Heft"]],
      ],
      pageSetupHint: "Stichlöcher am Rand, Linien dazwischen.",
      ground: ["Ring um den Pflock: der Kreis schließt", "Schnur aufgewickelt: Spirale"],
      strokes: ["Senkrechte", "Waagerechte", "Bogen", "Haken", "Öse"],
      construct1: ["Kreuz: Mittelsenkrechte aus zwei Zirkelschlägen", "Sechsteilung: der Radius sechsmal abgetragen"],
      construct2: ["Viereck und Achteck aus dem Kreuz", "Fünfeckseite über den halben Radius"],
      ring: (n) => `Doppelkreis, ${n} Weitenring${n > 1 ? "e" : ""}`,
      seal: ["Entwurf des eigenen Zeichens", "Abdruck · gesiegelt am __________"],
      inkHead: ["Essenz", "Farbe", "Farbstoff", "Metall", "Gift"],
      tria: [["sulfur", "Sulfur · Flamme"], ["mercurius", "Mercurius · Rauch"], ["sal", "Sal · Asche"]],
      triaSol: "Lösung: Wachs – Sulfur · Salz – Sal · Quecksilber – Mercurius · Kohle – Sulfur · Kreide – Sal · Weingeist – Mercurius · Seife – Sulfur und Sal zu gleichen Teilen · Siegellack – Sulfur",
      elements: [["ignis", "Feuer"], ["aer", "Luft"], ["aqua", "Wasser"], ["terra", "Erde"]],
      qual: { hot: "heiß", cold: "kalt", dry: "trocken", moist: "feucht" },
      days: ["Sonntag ☉", "Montag ☽", "Dienstag ♂", "Mittwoch ☿", "Donnerstag ♃", "Freitag ♀", "Samstag ♄"],
      yearIntro: "So liest man den Ring: Suche außen den Monat und gehe nach innen. Dort steht, welches Zeichen in diesem Teil des Monats regiert. Weil der Himmel sich nicht nach dem Kalender der Menschen richtet, wechselt das Zeichen fast immer mitten im Monat. Die Monate selbst, mit ihren Schutzgöttern und Farben:",
      skyIntro: "Jedes Zeichen hat ein Bild, und jedes Bild eine Geschichte. Hier sind sie in der Folge, in der die Sonne sie durchwandert, mit ihrer Zeit im Jahr und dem, wozu sie nach altem Brauch neigen.",
      tailor: { keys: ["Gestalt", "Weite", "Dauer", "Wirkzeit", "Schule", "Hauptessenz"], perLevel: " je Grad", ft: (n) => ` (${n} Fuß)`, base: "Grundformel", cut: "Zuschnitt", only: "Nur der Zweck ist enger." },
      firstpage: { head: "Kopf", foot: "Formel · Ecksteine · Geste", hint: "Entwurf: Kopf, Kreis, Textblock, Rand." },
      exam: { items: ["Hundert Kreise, Probe von zehn mit der Prüfscheibe", "Fünf Glyphen aus dem Gedächtnis, vom Prüfer gerufen", "Ein Kreis, laut gelesen, Schicht für Schicht", "Eine kleine Formel, dreimal in Folge gewirkt", "Das Gesellenstück: die erste Seite im Reinbuch"], head: ["Prüfstück", "bestanden", "nicht"], sign: ["Prüfer", "Aufsicht", "Schreiber", "Ort, Datum"], foot: "☐ bestanden: das zweite Heft darf aufgeschlagen werden ☐ Wiederholung nach einem halben Jahr" },
      first: ["Datum", "Ort", "Zeuge", "Formel", "Was geschah", "Was ich fühlte"],
      disc: "Auf dünnes Pauspapier übertragen oder ausschneiden. Die Mitte auf den Mittelpunkt des geprüften Kreises legen: Liegt die Linie zwischen den engen Ringen, gibt es 3 Punkte, zwischen den mittleren 2, zwischen den weiten 1, sonst 0.",
      pounce: { figs: ["Kernsiegel der Bannmagie", "Ignis", "Sol", "Fünfstern"], pts: (n) => `${n} Punkte` },
      grade: { crit: ["Rundheit / Formtreue", "Schluss der Linie", "Strich", "Verhältnisse", "Sauberkeit", "Tempo (Schnellglyphen)"], head: "Kriterium", foot1: "Summe ______ · Urteil ☐ nondum ☐ probatum ☐ laudandum · Datum ________ · Zeichen des Meisters ______", foot2: "Nächste Übung: __________________________________________" },
      promote: { subj: ["Werkstatt", "Grundstriche und Kreise", "Konstruktion", "Glyphen", "Gesten", "Zeichen der Stoffe", "Schnellglyphen", "Kreise lesen", "Kleine Formeln"], head: ["Fach", "Vermerk", "Datum", "Zeichen"], foot: "☐ versetzt in das zweite Lehrjahr ☐ wiederholt · Ort, Datum ________________ · Siegel" },
      sortLocale: "de",
      formula: { kicker: "Kleine Formel", everyday: "Alltagszauber", quick: "Schnellglyphe", formula: "Die Formel", gesture: "Geste", noGesture: "Keine Geste.", material: "Stoff", mixture: "Mischung", ladder: ["☐ mit Buch", "☐ aus dem Gedächtnis", "☐ unter Ablenkung", "dreimal in Folge ☐ ☐ ☐"], everydayTag: "Alltagszauber", cantrip: "Zaubertrick" },
      unwritten: "Dieser Abschnitt wird noch geschrieben.",
      workshopOf: "aus der Werkstatt ", handover: "An den, der nach mir liest",
      houseFormulas: "Eigene Formeln des Hauses, keine Zaubertricks des Regelwerks. Sie werden wie diese gelernt: dreimal, mit wachsenden Lücken.",
      sheet: { title: "Prüfbogen", key: "Skala: 0 fehlt · 1 erkennbar · 2 sauber · 3 meisterlich. Urteil: n nondum · p probatum · l laudandum.", workshop: " · Werkstatt " },
      prayers: { title: "Gebete für den Tag", morning: "Am Morgen", evening: "Am Abend", occasion: "Zum Anlass", feasts: "Festtage", year: "Im Jahr", optional: "(wenn Zeit bleibt)", intro: (d) => `Gebete an ${d} für den Morgen, den Abend und besondere Anlässe. Am Morgen und am Abend gilt die feste Form; das Andachtsblatt des Tages füllt sie mit dem, was der Tag bringt.`, feastDay: (d, mo) => `${d}. ${mo}` },
    },
    en: {
      mview: "Master’s view · do not trace – copy",
      lesson: "Lesson", lessonShort: "L ", page: "p.", task: "Task", part: "Part",
      verdict: "☐ n ☐ p ☐ l · Date _______ · Initials ____",
      ritual: [["school", "School"], ["level", "Degree"], ["time", "Casting time"], ["components", "Components"], ["checks", "Trials of skill"], ["backlash", "Backlash"], ["failure", "Failure"], ["effect", "Effect"]],
      praise: "The master’s highest praise", fear: "The apprentices’ greatest fear", saying: "Saying of the workshop",
      discHint: "Test disc: Appendix A.",
      comp: { V: "Voice (V): the formula is spoken", S: "Gesture (S): the hands guide", F: "Focus (F): a tool that remains", DF: "Divine focus (DF): a holy sign" },
      compM: "Substance (M): written as an alchemical sign, here sulfur",
      casting: { standard: "Standard action · dot", swift: "Swift action · bolt", immediate: "Instant · double bolt", fullround: "Full action · arc", round: "One round · pointer", minutes: "Minutes · hourglass", hours: "Hours · double hourglass" },
      planets: [["sol", "Sun", "gold"], ["luna", "Moon", "silver"], ["mercurius", "Mercury", "quicksilver"], ["venus", "Venus", "copper"], ["mars", "Mars", "iron"], ["iupiter", "Jupiter", "tin"], ["saturnus", "Saturn", "lead"]],
      blocks: "Circle · Crescent · Cross",
      matHead: ["Substance", "Sign", "Kind and essence"],
      quick: ["1 · full circle", "2 · core: school and principal essence", "3 · quick glyph", "What the strokes say", "Circles by duration", "Shape strokes", "Key to the school figures"],
      gapLayers: [["essence", "Essence ring"], ["core", "Core seal"], ["signs", "Ring of signs"], ["components", "Cornerstones"]],
      solutions: "Solutions:",
      master: "The Master",
      contract: {
        fields: ["Apprentice", "Origin", "Master", "Workshop, place", "Start of the apprenticeship", "Term", "Consideration"],
        years: "years", consideration: "☐ Premium ☐ Service in the house ☐ Both",
        masterH: "The master undertakes",
        master: ["to teach the apprentice everything that stands in this primer, and to withhold none of it once it can be borne;", "to provide board, chamber, light and tools;", "to warn the apprentice of the dangers of the workshop before they are met;", "to examine the apprentice’s work honestly."],
        apprH: "The apprentice undertakes",
        appr: ["to learn, to practise and to ask;", "to keep the house rules;", "to take nothing from the master’s books and drawers that has not been given;", "to cast no formula that the master has not released;", "to show strangers nothing of what is learned here."],
        sign: ["Apprentice", "Master", "Witness", "Seal"],
      },
      schedule: [
        ["First bell", "Rise, fetch water, stir up the fire, sweep the workshop"],
        ["Quiet hour", "Preparation: master and apprentice study their books, not a word spoken"],
        ["Second bell", "Lesson with the master: reading piece, master’s view, task"],
        ["Noon", "Meal, then half an hour free"],
        ["Third bell", "Workshop: ink, quills, paper, practice sheets"],
        ["Vespers", "Errands, house duties, penance chores"],
        ["Evening bell", "Supper; then the master’s hour for questions: examination of the day’s work"],
        ["Night bell", "Lights out. Whoever still reads, reads in the dark."],
      ],
      scheduleHint: "The seventh day is free. The quiet hour is kept on it too.", penance: "Penance chores this year:",
      kit: [
        ["For writing", ["Wax tablet and stylus", "three goose quills", "a raven quill", "Penknife and whetstone", "Inkhorn with lid", "Sand shaker", "Cloth for wiping"]],
        ["For drawing", ["Compasses with a firm joint", "Wooden rule", "Square", "Cord and peg", "Lead stylus", "Awl for pricking", "Test disc (Appendix A)"]],
        ["For keeping", ["Waste paper, one stack", "two sheets of parchment", "Pumice and chalk", "Box for substances", "this primer"]],
      ],
      pageSetupHint: "Prick holes in the margin, ruled lines between them.",
      ground: ["Ring about the peg: the circle closes", "Cord wound up: a spiral"],
      strokes: ["Vertical", "Horizontal", "Arc", "Hook", "Loop"],
      construct1: ["Cross: perpendicular bisector from two strokes of the compasses", "Dividing into six: the radius stepped off six times"],
      construct2: ["Square and octagon from the cross", "Side of the pentagon across half the radius"],
      ring: (n) => `Double circle, ${n} spacing ring${n > 1 ? "s" : ""}`,
      seal: ["Design of your own sign", "Impression · sealed on __________"],
      inkHead: ["Essence", "Colour", "Pigment", "Metal", "Poison"],
      tria: [["sulfur", "Sulfur · Flame"], ["mercurius", "Mercurius · Smoke"], ["sal", "Sal · Ash"]],
      triaSol: "Solution: Wax – Sulfur · Salt – Sal · Quicksilver – Mercurius · Charcoal – Sulfur · Chalk – Sal · Spirits of wine – Mercurius · Soap – Sulfur and Sal in equal parts · Sealing wax – Sulfur",
      elements: [["ignis", "Fire"], ["aer", "Air"], ["aqua", "Water"], ["terra", "Earth"]],
      qual: { hot: "hot", cold: "cold", dry: "dry", moist: "moist" },
      days: ["Sunday ☉", "Monday ☽", "Tuesday ♂", "Wednesday ☿", "Thursday ♃", "Friday ♀", "Saturday ♄"],
      yearIntro: "This is how the ring is read: find the month on the outside and go inward. There it is written which sign governs in that part of the month. Because the heavens do not keep the calendar of men, the sign almost always changes in the middle of a month. The months themselves, with their patron deities and colours:",
      skyIntro: "Every sign has an image, and every image a story. Here they stand in the order in which the sun passes through them, with their time of the year and what, by old custom, they incline to.",
      tailor: { keys: ["Shape", "Range", "Duration", "Casting time", "School", "Principal essence"], perLevel: " per degree", ft: (n) => ` (${n} ft)`, base: "Base formula", cut: "Cutting plan", only: "Only the purpose is narrower." },
      firstpage: { head: "Heading", foot: "Formula · cornerstones · gesture", hint: "Draft: heading, circle, block of text, margin." },
      exam: { items: ["A hundred circles, a sample of ten checked with the test disc", "Five glyphs from memory, called out by the examiner", "One circle, read aloud, layer by layer", "One small formula, cast three times in succession", "The journeyman’s piece: the first page in the fair book"], head: ["Piece examined", "passed", "not passed"], sign: ["Examiner", "Overseer", "Scribe", "Place, date"], foot: "☐ passed: the Second Primer may be opened ☐ to be repeated after half a year" },
      first: ["Date", "Place", "Witness", "Formula", "What happened", "What I felt"],
      disc: "Transfer onto thin tracing paper or cut out. Lay the centre on the centre point of the circle being tested: if the line lies between the narrow rings it earns 3 points, between the middle rings 2, between the wide rings 1, otherwise 0.",
      pounce: { figs: ["Core seal of Abjuration", "Ignis", "Sol", "Five-pointed star"], pts: (n) => `${n} points` },
      grade: { crit: ["Roundness / truth of form", "Closing of the line", "Stroke", "Proportions", "Cleanliness", "Pace (quick glyphs)"], head: "Criterion", foot1: "Total ______ · Verdict ☐ nondum ☐ probatum ☐ laudandum · Date ________ · Master’s initials ______", foot2: "Next exercise: __________________________________________" },
      promote: { subj: ["Workshop", "Basic strokes and circles", "Construction", "Glyphs", "Gestures", "Signs of the substances", "Quick glyphs", "Reading circles", "Small formulas"], head: ["Subject", "Master’s mark", "Date", "Initials"], foot: "☐ promoted to the second year ☐ repeated · Place, date ________________ · Seal" },
      sortLocale: "en",
      formula: { kicker: "Small Formula", everyday: "Everyday Spell", quick: "Quick glyph", formula: "The formula", gesture: "Gesture", noGesture: "No gesture.", material: "Substance", mixture: "Mixture", ladder: ["☐ with the book", "☐ from memory", "☐ under distraction", "three times in a row ☐ ☐ ☐"], everydayTag: "Everyday spell", cantrip: "Cantrip" },
      unwritten: "This section is still being written.",
      workshopOf: "from the workshop of ", handover: "To the one who reads after me",
      houseFormulas: "Formulas of the house’s own, not cantrips of the rulebook. They are learned as those are: three times, with growing gaps.",
      sheet: { title: "Examination sheet", key: "Scale: 0 missing · 1 recognisable · 2 clean · 3 masterly. Verdict: n nondum · p probatum · l laudandum.", workshop: " · Workshop of " },
      prayers: { title: "Prayers for the Day", morning: "In the Morning", evening: "In the Evening", occasion: "For the Occasion", feasts: "Feast Days", year: "In the Year", optional: "(if time allows)", intro: (d) => `Prayers to ${d} for the morning, the evening and special occasions. For morning and evening the fixed form applies; the devotion sheet of the day fills it with whatever the day brings.`, feastDay: (d, mo) => `${d} ${mo}` },
    },
  };
  const X = () => TX[EN() ? "en" : "de"];
  // Schule, Dauer, Weite … in der Buchsprache (THEORY: deutsche Felder, englische im Unterobjekt en)
  const enOf = (x) => (EN() && x && x.en) || x;
  const schoolName = (k) => enOf(T.SCHOOLS[k]).de;
  // Essenzanteile als Rezept in der Buchsprache
  const partsB = (ess) => (EN() ? T.partsEn(ess) : T.parts(ess));

  // ---------------------------------------------------------------------------
  // Bausteine
  // ---------------------------------------------------------------------------
  // Raster in einzelnen Zeilen: der Seitenumbruch kann zwischen Zeilen teilen
  const rows = (items, n) => {
    const out = [];
    for (let i = 0; i < items.length; i += n) out.push(`<div class="pr-grid g${n}">${items.slice(i, i + n).join("")}</div>`);
    return out.join("");
  };
  // Tafel der Schnellglyphen-Teile (Kreise, Gestaltstriche): kleine Vorschau mit Name und Strichname
  const qparts = (items, n) => rows(items.map((x) => `<figure>${x.glyph}<figcaption>${e(x.name)}<br><span class="rn">${e(x.sub)}</span></figcaption></figure>`), n).replace(/class="pr-grid /g, 'class="pr-grid qparts ');
  const svg = (inner, vb = "-50 -50 100 100", cls = "") => `<svg class="pr-svg ${cls}" viewBox="${vb}" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
  const mview = (inner, cls = "") => `<figure class="mview ${cls}">${inner}<figcaption>${X().mview}</figcaption></figure>`;

  // Lektionsnummern: Stelle unter den nummerierten Lektionen in der Reihenfolge der Teile (die Ids
  // bleiben fest, damit Randnotizen und Ersatz im Profil an ihrer Lektion bleiben)
  let NUM = new Map();
  function numberLessons() {
    NUM = new Map();
    let n = 0;
    for (const pt of P().parts) for (const L of P().lessons) if (L.part === pt.id && !L.unnumbered && !L.template) NUM.set(L.id, ++n);
  }
  const lessonNo = (L) => (L.unnumbered ? "" : String(NUM.get(L.id) || ""));
  // Verweis {{lesson:<id>}} im Text → „Lektion <Nummer>“
  const refs = (t) => String(t).replace(/\{\{lesson:([\w-]+)\}\}/g, (m, id) => {
    if (!NUM.has(id)) { console.warn("Lehrheft: unbekannter Lektionsverweis", id); return m; }
    return `${X().lesson} ${NUM.get(id)}`;
  });

  // Lesestück: [[Begriff]] → Rubrik; Glosse beim ersten Vorkommen im ganzen Heft an den Rand, verankert
  // in der Zeile des Begriffs (Float vor dem Begriff). Randnotizen der Stimmen weichen ihr aus (TYPESET.placeNotes).
  function readHTML(L, b) {
    return (L.read || [])
      .map((p) => (typeof p === "function" ? p() : p))
      .map((p) => {
        const html = e(refs(p)).replace(/\[\[([^\]]+)\]\]/g, (_, w) => {
          const g = (L.glosses || {})[w];
          let note = "";
          if (g && !b.gloss.has(w)) {
            b.gloss.set(w, { text: g, lesson: b.label(L) });
            note = `<span class="pr-note"><b>${e(w)}</b> ${e(g)}</span>`;
          }
          return `${note}<b class="term">${e(w)}</b>`;
        });
        return `<div class="par"><p>${html}</p></div>`;
      })
      .join("");
  }
  // Abhakkästchen am Ende einer Aufgabe stehen zusammen auf einer eigenen Zeile
  const tickLine = (t) => { t = refs(t); const m = t.match(/^(.*?)\s*((?:☐\s*)+)$/); return m ? `${e(m[1])}<br><span class="ticks">${e(m[2].trim())}</span>` : e(t); };
  // note: Verweis unter der Aufgabe, wenn sie vor dem Stoff steht (taskFirst)
  const taskHTML = (list, note) => (list && list.length ? `<div class="task"><h4>${X().task}</h4><ol>${list.map((t) => `<li>${tickLine(t)}</li>`).join("")}</ol>${note ? `<p class="hint">${e(note)}</p>` : ""}</div>` : "");
  // Prüfbogen: eine Zeile je Lektion (Kriterien mit Skala 0–3, Urteil, Datum, Zeichen)
  const checkRow = (c, pg) =>
    `<div class="pb-row"><div class="pb-l">${pg ? `<span class="pb-pg">${X().page} ${e(pg)}</span>` : ""}${c.kicker ? `<span class="rn">${e(c.kicker.replace(new RegExp("^" + X().lesson + " "), X().lessonShort))}</span> ` : ""}${e(c.title)}</div><div class="pb-c">${c.crit.map((k) => `<span>${e(k)} <i>0 1 2 3</i></span>`).join("")}</div><div class="pb-u">${X().verdict}</div></div>`;

  // Randnotizen der Stimmen (Profil), gefiltert nach Charakterstufe
  function notesHTML(id, b) {
    const p = prof();
    const list = ((p.notes || {})[id] || []).filter((n) => !n.level || (b.level && b.level >= n.level));
    return list.map((n) => voiceHTML(n, "mnote")).join("");
  }
  function voiceHTML(n, cls) {
    const v = (prof().voices || {})[n.voice] || {};
    return `<aside class="${cls} hand-${e(v.hand || "flowing")}" style="color:${e(v.ink || "#3b4a6b")}">${n.text.split("\n").map(e).join("<br>")}${v.label ? `<span class="who">– ${e(v.label)}</span>` : ""}</aside>`;
  }
  // Loses Blatt im Aufbau eines okkulten Rituals, mit Streichung und Notizen anderer Stimmen
    function looseLeafHTML(lf) {
    const V = prof().voices || {};
    const v = V[lf.voice] || {};
    const r = lf.ritual || {};
    const ink = (x) => e(x.ink || "#3b4a6b");
    const strike = lf.strike ? V[lf.strike.voice] || {} : null;
    const notes = (lf.notes || []).map((n) => voiceHTML(n, "leaf-note"));
    return `<div class="leaf hand-${e(v.hand || "flowing")}" style="color:${ink(v)}"><div class="leaf-body">` +
      (r.title ? `<div class="leaf-t">${e(r.title)}</div>` : "") +
      (r.text || []).map((t) => `<p>${e(t)}</p>`).join("") +
      `<dl>${X().ritual.filter(([k]) => r[k]).map(([k, l]) => `<dt>${l}</dt><dd>${e(r[k])}</dd>`).join("")}</dl>` +
      (v.label ? `<span class="who">– ${e(v.label)}</span>` : "") +
      (strike ? `<svg class="leaf-x" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M4,6 L96,94 M95,5 L5,95" style="stroke:${ink(strike)}"/></svg>` : "") + `</div>` +
      (strike ? `<div class="leaf-strike hand-${e(strike.hand || "flowing")}" style="color:${ink(strike)}">${e(lf.strike.text).replace(/\n/g, "<br>")}${strike.label ? `<span class="who">– ${e(strike.label)}</span>` : ""}</div>` : "") +
      `</div>${notes.join("")}`;
  }

  // Weltinfo-Kasten einer Lektion
  const worldBox = (bx) => (bx ? `<div class="pr-world"><b>${e(bx.title)}</b>${(bx.text || []).map((t) => `<p>${e(refs(t))}</p>`).join("")}</div>` : "");
  // eine Lektion kann einen oder mehrere Kästen tragen
  const worldBoxes = (bx) => [].concat(bx || []).map(worldBox).join("");
  function boxHTML(part) {
    const bx = { ...(P().boxes || {}), ...(prof().boxes || {}) }[part];
    if (!bx) return "";
    return `<div class="pr-box"><div><b>${X().praise}</b> ${e(bx.praise)}</div><div><b>${X().fear}</b> ${e(bx.fear)}</div><div><b>${X().saying}</b> ${e(bx.saying)}</div></div>`;
  }

  // Figur einer Ordnung (n Knoten, ab 5 als Stern verbunden) – wie die Kapitelfigur im Buch
  function orderFig(n, R = 40) {
    const pts = poly(0, 0, R, n);
    let s = S.circle(0, 0, R + 6, "thin");
    if (n >= 2) s += S.polygon(pts, "thin");
    if (n >= 5) s += pts.map((a, i) => S.line(a[0], a[1], ...pts[(i + Math.floor(n / 2)) % n], "thin")).join("");
    s += pts.map((a) => S.circle(a[0], a[1], 4, "node")).join("");
    return s;
  }

  // Lochpause: n Stützpunkte gleichmäßig entlang aller Linien einer Figur (im Browser gemessen)
  function pounce(inner, vb, n) {
    const NS = "http://www.w3.org/2000/svg";
    const host = document.createElementNS(NS, "svg");
    host.setAttribute("viewBox", vb);
    host.style.cssText = "position:absolute;left:-9999px;width:200px;height:200px";
    host.innerHTML = inner;
    document.body.appendChild(host);
    const els = [...host.querySelectorAll("path,line,circle,polygon,polyline,ellipse")].filter((x) => x.getTotalLength && x.getTotalLength() > 0);
    const lens = els.map((x) => x.getTotalLength());
    const total = lens.reduce((a, b) => a + b, 0);
    const dots = [];
    // je Linie mindestens ein Punkt, der Rest nach Länge verteilt
    els.forEach((x, i) => {
      const k = Math.max(1, Math.round((n * lens[i]) / total));
      for (let j = 0; j < k; j++) {
        const p = x.getPointAtLength(((j + 0.5) / k) * lens[i]);
        dots.push(`<circle cx="${G.f(p.x)}" cy="${G.f(p.y)}" r="1.6" class="fill"/>`);
      }
    });
    host.remove();
    return dots.join("");
  }

  // ---------------------------------------------------------------------------
  // Erzeugter Lehrstoff
  // ---------------------------------------------------------------------------
  const BASE_SMALL = ["Light", "Detect Magic", "Prestidigitation", "Mage Hand", "Message", "Read Magic"];
  const byName = (n) => window.SPELLS.find((s) => s.name === n);
  const modelOf = (s) => {
    const m = analyze(s);
    return { m, t: generateTexts(m) };
  };
  const smallTitle = (x) => `${e(x.t.title)} <span class="rn">${e(RULES.name(x.m))}</span>`;
  const essRow = (essences) => essences.map((x) => `<span class="ess-g">${glyphSVG("essence", x.id, { s: 7 })}</span>`).join("");
  const tagParts = (tag) => partsB(Object.entries(T.TAG_ESS[tag] || {}).map(([id, w]) => ({ id, pct: Math.round(w * 100) })));

  // Strichbuchstaben für Sigillen: Großbuchstaben aus Geraden und Bögen im Feld 8 × 12
  const O_ = "M4,0 Q0,0 0,6 Q0,12 4,12 Q8,12 8,6 Q8,0 4,0Z", P_ = "M0,12 L0,0 L5,0 Q8,0 8,3.5 Q8,7 5,7 L0,7";
  const STROKE = {
    A: "M0,12 L4,0 L8,12 M1.5,7.5 L6.5,7.5", B: "M0,12 L0,0 L5,0 Q8,0 8,3 Q8,6 5,6 L0,6 M5,6 Q8,6 8,9 Q8,12 5,12 L0,12",
    C: "M8,2 Q6,0 4,0 Q0,0 0,6 Q0,12 4,12 Q6,12 8,10", D: "M0,0 L0,12 L4,12 Q8,12 8,6 Q8,0 4,0Z",
    E: "M8,0 L0,0 L0,12 L8,12 M0,6 L6,6", F: "M8,0 L0,0 L0,12 M0,6 L6,6", G: "M8,2 Q6,0 4,0 Q0,0 0,6 Q0,12 4,12 Q8,12 8,7 L4.5,7",
    H: "M0,0 L0,12 M8,0 L8,12 M0,6 L8,6", I: "M4,0 L4,12", J: "M8,0 L8,9 Q8,12 4,12 Q1,12 0,9", K: "M0,0 L0,12 M8,0 L0,7 M3,4.5 L8,12",
    L: "M0,0 L0,12 L8,12", M: "M0,12 L0,0 L4,7 L8,0 L8,12", N: "M0,12 L0,0 L8,12 L8,0", O: O_, P: P_, Q: O_ + " M5,9 L8,12", R: P_ + " M4,7 L8,12",
    S: "M8,1.5 Q6.5,0 4,0 Q0,0 0,3 Q0,6 4,6 Q8,6 8,9 Q8,12 4,12 Q1.5,12 0,10.5", T: "M0,0 L8,0 M4,0 L4,12",
    U: "M0,0 L0,8 Q0,12 4,12 Q8,12 8,8 L8,0", V: "M0,0 L4,12 L8,0", W: "M0,0 L2,12 L4,5 L6,12 L8,0", X: "M0,0 L8,12 M8,0 L0,12",
    Y: "M0,0 L4,6 L8,0 M4,6 L4,12", Z: "M0,0 L8,0 L0,12 L8,12",
  };
  const BASE = { Ä: "A", Ö: "O", Ü: "U", ß: "S" };
  const VOWELS = new Set(["A", "E", "I", "O", "U", "Y"]);
  // Streichschritte: wiederholte Buchstaben, dann Vokale; Rest = Buchstaben der Sigille
  function sigilSteps(sentence) {
    const up = sentence.toUpperCase();
    const seen = new Set();
    const s1 = [...up].map((ch) => {
      const c = BASE[ch] || ch;
      if (!STROKE[c]) return e(ch);
      if (seen.has(c)) return `<s>${e(ch)}</s>`;
      seen.add(c);
      return e(ch);
    }).join("");
    const uniq = [...seen];
    const s2 = uniq.map((c) => (VOWELS.has(c) ? `<s>${c}</s>` : c)).join(" ");
    const rest = uniq.filter((c) => !VOWELS.has(c));
    return { s1, s2, rest };
  }

  // Formel in drei Durchgängen mit wachsenden Lücken
  function clozePasses(text) {
    const words = text.split(/\s+/);
    const gap = (w) => `<span class="gap">${"_".repeat(Math.max(3, w.replace(/[^\p{L}]/gu, "").length))}</span>${/[,!.]$/.test(w) ? w.slice(-1) : ""}`;
    const p1 = words.map(e).join(" ");
    const p2 = words.map((w, i) => (i % 2 === 1 ? gap(w) : e(w))).join(" ");
    const p3 = words.map((w, i) => (i === 0 ? e(w[0]) + gap(w.slice(1)) : gap(w))).join(" ");
    return `<ol class="cloze"><li>${p1}</li><li>${p2}</li><li>${p3}</li></ol>`;
  }

  const GEN = {
    hundred: () => mview(svg(`<circle r="30" class="hand-circle"/><circle r="1.5" class="fill"/>`, "-40 -40 80 80", "small"), "inline") + `<p class="hint">${X().discHint}</p>`,
    orders: () => rows([1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => `<figure>${svg(orderFig(n), "-52 -52 104 104")}<figcaption>${U.ROMAN[n]}</figcaption></figure>`), 5),
    pounce: () => {
      const inner = G.SCHOOL.abjuration(40);
      return mview(svg(pounce(inner, "-50 -50 100 100", 12), "-50 -50 100 100", "small"), "inline");
    },
    essences: () => LEGEND.table(LEGEND.essences(9, "corr"), "ess"),
    schools: () => LEGEND.table(LEGEND.schools(12)),
    signs: () => LEGEND.table(LEGEND.signs(8)),
    components: () =>
      `<div class="pr-table">${Object.entries(X().comp).map(([k, d]) => `<div class="pr-row">${glyphSVG("component", k, { s: 8 })}<div>${e(d)}</div></div>`).join("")}` +
      `<div class="pr-row">${glyphSVG("alch", "sulfur", { s: 8 })}<div>${X().compM}</div></div></div>`,
    casting: () => `<div class="pr-table">${Object.entries(X().casting).map(([k, d]) => `<div class="pr-row">${glyphSVG("casting", k, { s: 8 })}<div>${e(d)}</div></div>`).join("")}</div>`,
    gates: () => {
      const s = byName("Fireball") || window.SPELLS.find((x) => x.saving_throw && /reflex/i.test(x.saving_throw));
      const m = analyze(s);
      return mview(renderCircle(m, { layers: ["outer", "band", "gates", "sr"], text: generateTexts(m).formula.band }), "medium");
    },
    gestures: () => {
      const SG = (window.TEXTGEN && TEXTGEN.LX(I18N.lang.book).SCHOOL_GESTURE) || {};
      return `<dl class="pr-dl">${Object.entries(T.SCHOOLS).map(([k, s]) => `<dt>${e(schoolName(k))}</dt><dd>${(SG[k] || []).map(e).join("; ")}</dd>`).join("")}</dl>`;
    },
    planets: () => {
      const blocks = svg(`<circle cx="-30" cy="0" r="9"/><path d="M8,-10 A10,10 0 1 0 8,10 A7.5,7.5 0 1 1 8,-10Z"/><line x1="40" y1="-11" x2="40" y2="11"/><line x1="29" y1="0" x2="51" y2="0"/>`, "-45 -16 105 32", "blocks");
      return `<figure class="mview inline">${blocks}<figcaption>${X().blocks}</figcaption></figure>` +
        `<div class="pr-table">${X().planets.map(([k, pl, met], i) => `<div class="pr-row">${glyphSVG("alch", k, { s: 9 })}<div><b>${pl}</b>${alias(TX.de.planets[i][1], pl)} – ${met}<br><span class="corr">${e(tagParts(k))}</span></div></div>`).join("")}</div>`;
    },
    materials: (L, b) => {
      const seen = new Set();
      const rows = [];
      const pool = [...b.small, ...b.entries, ...["Fireball", "Grease", "Sleep", "Web", "Stone Shape", "Silent Image", "Shield", "Comprehend Languages"].map(byName).filter(Boolean).map(modelOf)];
      for (const x of pool) {
        for (const tg of x.m.components.materialTags || []) {
          if (seen.has(tg.tag) || tg.tag === "materia" || rows.length >= 8) continue;
          seen.add(tg.tag);
          rows.push(`<tr><td>${e((EN() ? (T.MATERIAL_EN || {})[tg.noun] || tg.noun : tg.noun) || (x.m.components.material || "").replace(/\.$/, "").slice(0, 60))}<br><span class="rn">${e(RULES.name(x.m))}</span></td><td>${glyphSVG("alch", tg.tag, { s: 8 })}</td><td>${e((EN() ? T.ALCHEMY_EN : T.ALCHEMY)[tg.tag] || tg.tag)}<br><span class="corr">${e(tagParts(tg.tag))}</span></td></tr>`);
        }
      }
      return `<table class="pr-mat"><tr>${X().matHead.map((h) => `<th>${h}</th>`).join("")}</tr>${rows.join("")}</table>`;
    },
    mixtures: (L, b) => `<dl class="pr-dl">${b.small.slice(0, 5).map((x) => `<dt>${smallTitle(x)} ${essRow(x.m.essences)}</dt><dd>${e(U.cap(partsB(x.m.essences)))}.</dd>`).join("")}</dl>`,
    quickderive: (L, b) => {
      const x = b.small[0];
      const core = svg(`<g class="quick-g">${S.circle(0, 0, 50)}${(QUICK_SCHOOL[x.m.school] || QUICK_SCHOOL.universal)()}<g class="accent">${G.ESSENCE[x.m.primary](0, 0, 11)}</g></g>`, "-80 -80 160 160", "quick");
      return `<div class="pr-steps"><figure>${renderCircle(x.m, { text: x.t.formula.band })}<figcaption>${X().quick[0]}</figcaption></figure><span>→</span><figure>${core}<figcaption>${X().quick[1]}</figcaption></figure><span>→</span><figure>${quickGlyph(x.m)}<figcaption>${X().quick[2]}</figcaption></figure></div><p class="hint">${smallTitle(x)}</p>` +
        `<h4 class="keep-next">${X().quick[3]}</h4>${LEGEND.quickRules(true)}${LEGEND.quickSource(x.m)}` +
        `<h4 class="keep-next">${X().quick[4]}</h4>` + qparts(LEGEND.quickRings(), 4) +
        `<h4 class="keep-next">${X().quick[5]}</h4>` + qparts(LEGEND.quickShapes(), 5) +
        `<h4 class="keep-next">${X().quick[6]}</h4>` +
        rows(LEGEND.quickSchools(12).map((x) => `<figure class="qkey">${x.full}<span>→</span>${x.glyph}<figcaption>${e(x.name)}</figcaption></figure>`), 3);
    },
    quicklist: (L, b) => rows(b.tricks.map((x) => `<figure>${quickGlyph(x.m)}<figcaption>${e(x.t.title)}<br><span class="rn">${e(RULES.name(x.m))}</span></figcaption></figure>`), 4),
    anatomy: (L, b) => {
      const x = b.small.find((y) => y.m.components.V) || b.small[0];
      return mview(renderCircle(x.m, { text: x.t.formula.band, annotate: true }), "duo") + `<p class="hint">${smallTitle(x)}</p><ol class="annot-list">${circleAnnotations(x.m).map((a) => `<li value="${a.n}"><b>${e(a.k)}:</b> ${e(a.t)}</li>`).join("")}</ol>`;
    },
    gaps: (L, b) => {
      const drop = X().gapLayers;
      const items = b.small.slice(0, 4).map((x, i) => {
        const [layer, nm] = drop[i % drop.length];
        return { x, nm, html: renderCircle(x.m, { layers: CIRCLE_LAYERS.filter((l) => l !== layer), text: x.t.formula.band }) };
      });
      return `${items.map((it, i) => `<figure class="mview duo">${it.html}<figcaption>${i + 1} · ${e(it.x.t.title)}</figcaption></figure>`).join("")}<div class="solution">${X().solutions} ${items.map((it, i) => `${i + 1} ${e(it.nm)}`).join(" · ")}</div>`;
    },
    compare: (L, b) => {
      const pool = b.small;
      let pair = null;
      for (let i = 0; i < pool.length && !pair; i++) for (let j = i + 1; j < pool.length; j++) if (pool[i].m.school === pool[j].m.school) { pair = [pool[i], pool[j]]; break; }
      pair = pair || pool.slice(0, 2);
      return pair.map((x) => `<figure class="mview duo">${renderCircle(x.m, { text: x.t.formula.band })}<figcaption>${smallTitle(x)}</figcaption></figure>`).join("");
    },
    // --- Vorspann: Unterschrift, Formulare ---
    signature: (L, b) => `<p class="sig">${b.master ? e(b.master) : X().master}</p>`,
    contract: (L, b) => {
      const C = X().contract, F = C.fields;
      const f = (k, v = "") => `<dt>${k}</dt><dd>${v}</dd>`;
      const li = (l) => l.map((t) => `<li>${t}</li>`).join("");
      return `<dl class="pr-form">${f(F[0])}${f(F[1])}${f(F[2], b.master ? e(b.master) : "")}${f(F[3])}${f(F[4])}${f(F[5], `<span class="pr-gap"></span>${C.years}`)}${f(F[6], C.consideration)}</dl>` +
        `<div class="pr-cols"><div><h4>${C.masterH}</h4><ol>${li(C.master)}</ol></div>` +
        `<div><h4>${C.apprH}</h4><ol>${li(C.appr)}</ol></div></div>` +
        `<dl class="pr-form sign">${C.sign.map((k) => f(k)).join("")}</dl>`;
    },
    schedule: () => {
      const rows = X().schedule;
      return `<table class="pr-sched">${rows.map(([k, v]) => `<tr><th>${e(k)}</th><td>${e(v)}</td></tr>`).join("")}</table><p class="hint">${X().scheduleHint}</p><p class="left">${X().penance} ${"☐ ".repeat(10)}</p>`;
    },
    kit: () => {
      const groups = X().kit;
      // zwei Spalten, bei ungerader Zahl links ein Eintrag mehr
      const col = (l) => `<ul>${l.map((x) => `<li>☐ ${e(x)}</li>`).join("")}</ul>`;
      return groups.map(([h, l]) => { const k = Math.ceil(l.length / 2); return `<h4>${e(h)}</h4><div class="pr-checklist">${col(l.slice(0, k))}${col(l.slice(k))}</div>`; }).join("");
    },
    // --- Werkstatt ---
    pageSetup: () => {
      const holes = [0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => S.dot(-27, -36 + i * 8, 0.8) + S.dot(27, -36 + i * 8, 0.8)).join("");
      const lines = [0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => S.line(-24, -36 + i * 8, 24, -36 + i * 8, "thin")).join("");
      return mview(svg(`<rect x="-32" y="-44" width="64" height="88" class="thin"/>${holes}${lines}`, "-36 -48 72 96", "small"), "inline") + `<p class="hint">${X().pageSetupHint}</p>`;
    },
    groundCircle: () => {
      const good = S.circle(0, 0, 30) + S.dot(0, 0, 2) + S.line(0, 0, 21, -21, "thin");
      let d = "";
      for (let i = 0; i <= 60; i++) { const a = (i / 60) * 2 * Math.PI, r = 30 - i * 0.12; d += (i ? "L" : "M") + G.f(r * Math.sin(a)) + "," + G.f(-r * Math.cos(a)); }
      const bad = S.path(d) + S.dot(0, 0, 2);
      return rows([`<figure>${svg(good, "-40 -40 80 80")}<figcaption>${X().ground[0]}</figcaption></figure>`, `<figure>${svg(bad, "-40 -40 80 80")}<figcaption>${X().ground[1]}</figcaption></figure>`], 2);
    },
    // --- Hand und Kreis ---
    strokes: () => {
      const N = X().strokes;
      const items = [
        [N[0], S.line(0, -18, 0, 16) + S.arrowHead(0, 18, 180, 4)],
        [N[1], S.line(-18, 0, 16, 0) + S.arrowHead(18, 0, 90, 4)],
        [N[2], S.arc(0, 4, 18, 270, 90) + S.arrowHead(...polar(0, 4, 18, 90), 180, 4)],
        [N[3], S.path("M0,-18 L0,8 Q0,16 -8,16")],
        [N[4], S.path("M-10,10 Q-10,-18 0,-18 Q10,-18 10,0 Q10,14 -4,8")],
      ];
      return rows(items.map(([n, g]) => `<figure>${svg(g, "-24 -24 48 48")}<figcaption>${n}</figcaption></figure>`), 5);
    },
    construct1: () => {
      const R = 30, six = poly(0, 0, R, 6);
      const arcs = six.map((pt) => S.arc(pt[0], pt[1], R, 0, 360, "faint")).join("");
      const hex = S.circle(0, 0, R) + six.map((pt) => S.dot(pt[0], pt[1], 1.4)).join("") + S.polygon(six, "thin") + S.polygon([six[0], six[2], six[4]]) + S.polygon([six[1], six[3], six[5]]);
      const cross = S.circle(0, 0, R) + S.line(-R, 0, R, 0) + S.arc(-R, 0, R * 1.3, 20, 160, "faint") + S.arc(R, 0, R * 1.3, 200, 340, "faint") + S.line(0, -R - 6, 0, R + 6);
      return rows([`<figure>${svg(cross, "-46 -46 92 92")}<figcaption>${X().construct1[0]}</figcaption></figure>`, `<figure>${svg(hex + arcs, "-46 -46 92 92")}<figcaption>${X().construct1[1]}</figcaption></figure>`], 2);
    },
    construct2: () => {
      const R = 30;
      const sq = S.circle(0, 0, R) + S.line(-R, 0, R, 0, "thin") + S.line(0, -R, 0, R, "thin") + S.polygon(poly(0, 0, R, 4)) + S.polygon(poly(0, 0, R, 8, 22.5), "thin");
      const top = [0, -R], mid = [R / 2, 0], r2 = Math.hypot(mid[0] - top[0], mid[1] - top[1]), x = mid[0] - r2;
      const pent = S.circle(0, 0, R) + S.line(-R, 0, R, 0, "thin") + S.dot(mid[0], mid[1], 1.4) + S.arc(mid[0], mid[1], r2, 270, 340, "faint") + S.line(x, 0, top[0], top[1], "thin") + S.star(0, 0, R, 5, 2);
      return rows([`<figure>${svg(sq, "-40 -40 80 80")}<figcaption>${X().construct2[0]}</figcaption></figure>`, `<figure>${svg(pent, "-40 -40 80 80")}<figcaption>${X().construct2[1]}</figcaption></figure>`], 2);
    },
    rings: () => {
      const figs = [1, 2, 3].map((n) => `<figure>${svg(S.circle(0, 0, 18) + S.circle(0, 0, 14) + Array.from({ length: n }, (_, i) => S.circle(0, 0, 22 + i * 4, "thin")).join(""), "-36 -36 72 72")}<figcaption>${X().ring(n)}</figcaption></figure>`);
      return rows(figs, 3);
    },
    // --- Zeichen der Stoffe ---
    sealBlank: () => {
      const seal = svg(S.circle(0, 0, 40) + S.circle(0, 0, 34, "thin"), "-44 -44 88 88", "seal");
      return rows([`<figure>${seal}<figcaption>${X().seal[0]}</figcaption></figure>`, `<figure>${seal}<figcaption>${X().seal[1]}</figcaption></figure>`], 2);
    },
    sigil: (L) => {
      const list = (L.sentences || []).slice(0, 3);
      return list.map((t, i) => {
        const st = sigilSteps(t);
        const steps = `<ol class="sigil-steps"><li>${st.s1}</li><li>${st.s2}</li><li>${st.rest.join(" ")}</li></ol>`;
        if (i > 0) return `<div class="sigil-row"><h4>${e(t)}</h4>${steps}<div class="sigil-blank"></div></div>`;
        const fig = svg(`<g class="sigil-g">${st.rest.map((c) => `<path d="${STROKE[c]}"/>`).join("")}</g>`, "-2 -2 12 16", "sigil");
        return `<div class="sigil-row"><h4>${e(t)}</h4>${steps}${mview(fig, "inline")}</div>`;
      }).join("");
    },
    inks: () => {
      const TG = (window.TEXTGEN && TEXTGEN.LX(I18N.lang.book)) || {};
      const rows = T.ESSENCES.map((x) => {
        const c = TG.CORRESPOND[x.id], pg = TG.PIGMENTS[c.color] || { name: c.color }, mt = TG.INK_METALS[c.metal] || {};
        const gift = [pg.poison && pg.name, mt.poison].filter(Boolean).join(", ");
        return `<tr><td>${glyphSVG("essence", x.id, { s: 7 })}</td><td>${e(x.latin)}</td><td>${e(c.color)}</td><td>${e(pg.name)}</td><td>${e(c.metal)}</td><td class="gift">${e(gift)}</td></tr>`;
      });
      return `<table class="pr-mat pr-inks"><tr><th></th>${X().inkHead.map((h) => `<th>${h}</th>`).join("")}</tr>${rows.join("")}</table>`;
    },
    tria: () => {
      const t = X().tria;
      return rows(t.map(([k, n]) => `<figure>${glyphSVG("alch", k, { s: 12 })}<figcaption>${n}</figcaption></figure>`), 3) +
        `<div class="solution">${X().triaSol}</div>`;
    },
    elements: () => {
      const els = X().elements, Q = X().qual;
      const cross = S.line(-34, 0, 34, 0, "thin") + S.line(0, -34, 0, 34, "thin") +
        S.text(0, -38, Q.hot, "lbl", 6) + S.text(0, 43, Q.cold, "lbl", 6) + S.text(-48, 0, Q.dry, "lbl", 6) + S.text(47, 0, Q.moist, "lbl", 6) +
        `<g>${G.ESSENCE.ignis(-17, -17, 6)}${G.ESSENCE.aer(17, -17, 6)}${G.ESSENCE.aqua(17, 17, 6)}${G.ESSENCE.terra(-17, 17, 6)}</g>`;
      return rows(els.map(([k, n]) => `<figure>${glyphSVG("essence", k, { s: 10 })}<figcaption>${n}</figcaption></figure>`), 4) + mview(svg(cross, "-56 -50 112 100"), "medium");
    },
    week: () => {
      // alte Reihe auf den Ecken, der Siebenstern {7/2} führt zur Woche
      const order = ["saturnus", "iupiter", "mars", "sol", "venus", "mercurius", "luna"];
      const pts = poly(0, 0, 36, 7);
      const star = S.circle(0, 0, 44, "thin") + S.polygon(pts, "faint") + pts.map((a, i) => S.line(a[0], a[1], ...pts[(i + 3) % 7], "thin")).join("");
      const signs = pts.map((a, i) => { const q = polar(0, 0, 44, (360 / 7) * i); return `<circle cx="${G.f(q[0])}" cy="${G.f(q[1])}" r="7" class="bg"/>` + G.ALCH[order[i]](q[0], q[1], 4.5); }).join("");
      const days = X().days;
      return mview(svg(star + signs, "-54 -54 108 108"), "medium") + `<p class="hint">${days.join(" · ")}</p>`;
    },
    // --- Tafel der Zeit: Tage, Jahr mit Monaten und Festen, Himmel; zwischen Bild und Einträgen steht Text ---
    timeWeek: () => window.TIME.weekEntries().join(""),
    timeYear: () => {
      const TM = window.TIME;
      return mview(svg(TM.yearRing(), "-104 -104 208 208", "ring"), "ring") +
        `<div class="par"><p>${X().yearIntro}</p></div>` +
        TM.monthEntries().join("");
    },
    timeSky: () => {
      const TM = window.TIME;
      return mview(svg(TM.starMap(), "-118 -112 236 224", "ring"), "ring") +
        `<div class="par"><p>${X().skyIntro}</p></div>` +
        TM.signEntries().join("");
    },
    // --- Gesellenstück ---
    tailor: (L, b) => {
      const pool = [...b.entries, ...b.small].filter((x) => x.m.spell.everyday);
      let x = pool[0];
      if (!x) {
        const sp = window.SPELLS.find((y) => y.everyday);
        if (!sp) return "";
        x = modelOf(sp);
      }
      const bs = byName(x.m.spell.base);
      if (!bs) return "";
      const base = analyze(bs);
      // Vergleich in den Begriffen der Lehre (Buchsprache), nicht in den Regelwerten
      const TL = X().tailor;
      const dur = (m) => enOf(m.duration).de + (m.duration.perLevel ? TL.perLevel : "");
      const rng = (m) => enOf(m.range).de + (m.range.ft ? TL.ft(m.range.ft) : "");
      const ess = (m) => T.ESS[m.primary].latin;
      const KEYS = [[TL.keys[0], (m) => enOf(m.shape).de], [TL.keys[1], rng], [TL.keys[2], dur], [TL.keys[3], (m) => (EN() ? U.cap(m.casting.en) : m.casting.de)], [TL.keys[4], (m) => enOf(m.schoolInfo).de], [TL.keys[5], ess]];
      const rowsHTML = KEYS.filter(([, g]) => g(base) !== g(x.m)).map(([n, g]) => `<tr><td>${n}</td><td>${e(g(base))}</td><td>${e(g(x.m))}</td></tr>`).join("");
      return `<table class="pr-mat"><tr><th></th><th>${TL.base}<br><span class="rn">${e(generateTexts(base).title)}</span></th><th>${TL.cut}<br><span class="rn">${e(RULES.name(x.m))}</span></th></tr>${rowsHTML || `<tr><td colspan="3">${TL.only}</td></tr>`}</table>` +
        (x.m.spell.description ? `<p class="hint">${e(I18N.pick(x.m.spell.description, (x.m.spell.en || {}).description, x.m.spell.fromProfile ? null : `primer:everyday:${x.m.spell.name}.description`))}</p>` : "");
    },
    firstpage: () => {
      const page = `<rect x="-30" y="-42" width="60" height="84" class="thin"/><rect x="-24" y="-36" width="48" height="6" class="faint"/>` + S.circle(0, -12, 14) + S.circle(0, -12, 10, "thin") +
        [0, 1, 2, 3, 4].map((i) => S.line(-24, 10 + i * 5, 24, 10 + i * 5, "thin")).join("") + S.text(0, -32, X().firstpage.head, "lbl", 4) + S.text(0, 38, X().firstpage.foot, "lbl", 3.5);
      return mview(svg(page, "-36 -48 72 96"), "small") + `<p class="hint">${X().firstpage.hint}</p>`;
    },
    finalExam: (L, b) => {
      const Ex = X().exam;
      return `<table class="pr-grade"><tr><th>${Ex.head[0]}</th><th>${Ex.head[1]}</th><th>${Ex.head[2]}</th></tr>${Ex.items.map((x) => `<tr><td>${e(x)}</td><td></td><td></td></tr>`).join("")}</table>` +
        `<dl class="pr-form sign">${Ex.sign.map((k) => `<dt>${k}</dt><dd></dd>`).join("")}</dl><p class="left">${Ex.foot}</p>`;
    },
    first: () => `<dl class="pr-form">${X().first.map((k) => `<dt>${k}</dt><dd></dd>`).join("")}</dl>`,
    // Anhang
    disc: () => {
      const rings = [[30, "weit"], [34, "mittel"], [37, "eng"], [43, "eng"], [46, "mittel"], [50, "weit"]].map(([r, k]) => `<circle r="${r}" class="ring ${k}"/>`).join("");
      return `<p>${X().disc}</p>` +
        `<figure class="disc">${svg(`${rings}<circle r="40" class="target"/><line x1="-54" y1="0" x2="54" y2="0" class="thin"/><line x1="0" y1="-54" x2="0" y2="54" class="thin"/>`, "-56 -56 112 112")}</figure>`;
    },
    pounceSheets: () => {
      const PF = X().pounce.figs, figs = [[PF[0], G.SCHOOL.abjuration(40)], [PF[1], G.ESSENCE.ignis(0, 0, 40)], [PF[2], G.ALCH.sol(0, 0, 40)], [PF[3], S.star(0, 0, 40, 5, 2)]];
      return figs.map(([nm, inner]) => `<h4 class="keep-next">${e(nm)}</h4>` + rows([12, 6, 3].map((n) => `<figure>${svg(pounce(inner, "-50 -50 100 100", n), "-50 -50 100 100", "pounce")}<figcaption>${X().pounce.pts(n)}</figcaption></figure>`), 3)).join("");
    },
    gradeSheet: () => {
      const Gd = X().grade, crit = Gd.crit;
      return `<table class="pr-grade"><tr><th>${Gd.head}</th><th>0</th><th>1</th><th>2</th><th>3</th></tr>${crit.map((c) => `<tr><td>${e(c)}</td><td></td><td></td><td></td><td></td></tr>`).join("")}</table><p class="left">${Gd.foot1}</p><p class="left">${Gd.foot2}</p>`;
    },
    promoteSheet: () => {
      const Pm = X().promote, subj = Pm.subj;
      return `<table class="pr-grade"><tr>${Pm.head.map((h) => `<th>${h}</th>`).join("")}</tr>${subj.map((s) => `<tr><td>${e(s)}</td><td></td><td></td><td></td></tr>`).join("")}</table><p class="left">${Pm.foot}</p>`;
    },
    glossary: (L, b) => [...b.gloss.entries()].sort((a, c) => a[0].localeCompare(c[0], X().sortLocale)).map(([w, g]) => `<div class="pr-gl"><b>${e(w)}</b> <span class="rn">${e(g.lesson)}</span> – ${e(g.text)}</div>`).join(""),
  };

  // Lektion zu einer kleinen Formel (Teil VII)
  function formulaLesson(x, i, b, tpl, kicker = X().formula.kicker, withGlyph = false) {
    const FL = X().formula;
    const m = x.m, t = x.t;
    const mat = m.components.materialTags || [];
    // Alltagszauber: die Schnellglyphe steht neben dem Kreis (kommt in der Schnellglyphen-Übersicht nicht vor)
    const side = withGlyph ? `<figure class="qside">${quickGlyph(m)}<figcaption>${FL.quick}</figcaption></figure>` : "";
    const body =
      mview(renderCircle(m, { text: t.formula.band }) + side, "fit") +
      `<h4>${FL.formula}</h4>${clozePasses(t.formula.lines.join(" "))}` +
      `<h4>${FL.gesture}</h4><p>${(t.gestures || []).map(e).join(" · ") || FL.noGesture}</p>` +
      (m.components.M ? `<h4>${FL.material}</h4><p>${mat.length ? mat.map((g) => `${glyphSVG("alch", g.tag, { s: 6 })} ${e(EN() ? (T.MATERIAL_EN || {})[g.noun] || g.noun : g.noun)}`).join(" · ") : e(m.components.material || "")}</p>` : "") +
      `<h4>${FL.mixture}</h4><p>${essRow(m.essences)} ${e(U.cap(partsB(m.essences)))}.</p>` +
      `<div class="ladder"><span>${FL.ladder[0]}</span><span>${FL.ladder[1]}</span><span>${FL.ladder[2]}</span><span class="thrice">${FL.ladder[3]}</span></div>`;
    const L = { ...tpl, id: "f-" + m.id, title: t.title };
    return section(L, `${kicker} ${i + 1}`, `<div class="ls-sub">${e(RULES.name(m))} · ${m.spell.everyday ? FL.everydayTag : FL.cantrip}</div>` + readHTML(i === 0 ? tpl : {}, b) + body, b, tpl.check);
  }

  function section(L, kicker, inner, b, check, tail = "") {
    // Prüfvermerke stehen nicht im Heft, sondern gesammelt im Prüfbogen
    const crit = check || L.check;
    if (crit && crit.length && !b.checks.some((c) => c.id === L.id)) b.checks.push({ id: L.id, part: b.part, kicker, title: L.title, crit });
    return `<section class="lesson splittable ${L._cls || ""}" data-lesson="${e(L.id)}"><div class="ls-head keep-next"><div class="ls-k">${e(kicker)}</div><h4 class="ls-t">${e(L.title)}</h4></div>${notesHTML(L.id, b)}${inner}${L.taskFirst ? "" : taskHTML(L.task)}${tail}</section>`;
  }

  function lessonHTML(L, b) {
    const kicker = L.unnumbered ? "" : `${X().lesson} ${lessonNo(L)}`;
    let inner = readHTML(L, b) + worldBoxes(L.box) + (L.taskFirst ? taskHTML(L.task, L.taskFirst) : "");
    if (L.text && !L.read) inner += `<p class="hint">${X().unwritten}</p>`;
    let tail = "";
    if (L.gen && GEN[L.gen]) {
      // Lösungen ans Ende der Lektion, auf die nächste Seite (nicht beim Arbeiten im Blick); die folgende
      // Lektion beginnt darunter, sodass die Lösung nie allein steht (seitenweise und am Teilende: ohne Umbruch)
      const [body, sol] = GEN[L.gen](L, b).split(/(?=<div class="solution">)/);
      inner += body;
      if (sol) tail = L._solBreak ? sol.replace('class="solution"', 'class="solution break-before"') : sol;
    }
    return section(L, kicker, inner, b, null, tail);
  }

  // ---------------------------------------------------------------------------
  // Heft zusammensetzen
  // ---------------------------------------------------------------------------
  // ctx: { entries: [{ m, t }] (Buch), settings }
  function build(ctx = {}) {
    numberLessons();
    const settings = ctx.settings || {};
    const pr = prof();
    const entries = ctx.entries || [];
    let small = entries.filter((x) => x.m.level === 0 || x.m.spell.everyday);
    if (!small.length) small = BASE_SMALL.map(byName).filter(Boolean).map(modelOf);
    const b = {
      gloss: new Map(),
      level: +settings.charLevel || 0,
      entries,
      small,
      checks: [],
      label: (L) => (L.unnumbered ? L.title : `${X().lesson} ${lessonNo(L)}`),
    };
    const master = (settings.primerMaster || (pr.master && pr.master.name) || "").trim();
    b.master = master;
    // das lokale Profil kann einzelne Lektionen ganz oder teilweise ersetzen (z. B. Bezüge zur eigenen Welt)
    const over = pr.lessons || {};
    const lessonsOf = (part) => P().lessons.filter((L) => L.part === part && !L.template).map((L) => ({ ...L, ...(over[L.id] || {}) }));
    const title = pr.title || P().title;
    const bind = settings.primerGutter === false ? "" : " bind";
    const parts = [];
    const roman = (pt) => pt.roman || pt.id;
    // Zaubertricks (offizieller Kanon) stehen in Teil VII, Alltagszauber als eigener Abschnitt hinter dem Anhang
    let tricks = small.filter((x) => !x.m.spell.everyday);
    if (!tricks.length) tricks = BASE_SMALL.map(byName).filter(Boolean).map(modelOf);
    b.tricks = tricks;
    const everyday = small.filter((x) => x.m.spell.everyday);
    const tail = (pt) => pt.id === "A" || pt.id === "W";
    for (const pt of P().parts) {
      if (pt.id === "W" && !everyday.length) continue;
      b.part = pt.id === "V" ? pt.title : tail(pt) ? pt.title : `${X().part} ${roman(pt)} · ${pt.title}`;
      const lessons = lessonsOf(pt.id);
      const pages = [];
      if (pt.id === "V") {
        pages.push({ cls: "title-page primer-title" + bind, running: "", html: `<div class="tp"><div class="tp-sigil pr-sigil">${svg(orderFig(7, 34) + S.circle(0, 0, 46) + S.circle(0, 0, 12, "thin"), "-52 -52 104 104")}</div><h1>${e(title)}</h1><div class="tp-owner">${e(pr.subtitle || P().subtitle)}</div><div class="tp-sub">${master ? X().workshopOf + e(master) : ""}</div></div>` });
        if (pr.handover && (!pr.handover.level || b.level >= pr.handover.level)) pages.push({ cls: "primer-page flow handover" + bind, running: X().handover, html: voiceHTML({ voice: pr.handover.voice, text: (pr.handover.text || []).join("\n\n") }, "handover-text") });
      }
      const running = pt.id === "V" ? pt.title : tail(pt) ? pt.title : `${X().part} ${roman(pt)} · ${pt.title}`;
      let html = pt.id === "V" ? "" : `<h3>${tail(pt) ? e(pt.title) : `${X().part} ${roman(pt)} · ${e(pt.title)}`}</h3>${boxHTML(pt.id)}`;
      // Satz: dicht (fortlaufend), ausgewogen (Lektion möglichst ganz auf einer Seite; Vorspann und
      // Werkstatt je Lektion eine neue Seite) oder seitenweise (jede Lektion auf neuer Seite)
      const layout = settings.primerLayout || "balanced";
      const newPage = layout === "pages" || (layout === "balanced" && pt.pageEach);
      lessons.forEach((L, i) => {
        L._cls = [layout !== "dense" && "keep-whole", newPage && i > 0 && "break-before"].filter(Boolean).join(" ");
        L._solBreak = !newPage && i < lessons.length - 1;
      });
      for (const L of lessons) {
        // Vorrede: aus dem Profil, sonst Platzhalter
        if (L.id === "v-preface" && pr.master && pr.master.preface) html += section(L, "", pr.master.preface.map((p) => `<p>${e(p)}</p>`).join("") + (master ? `<p class="sig">${e(master)}</p>` : ""), b);
        else html += lessonHTML(L, b);
        if (pt.id === "VII" && L.id === "l39") {
          // jede kleine Formel auf genau einer Seite: feste Seite, die sich wie eine Zauberseite einpasst
          const tpl = P().lessons.find((x) => x.template);
          pages.push({ cls: "primer-page flow" + bind, running, html });
          tricks.forEach((x, i) => pages.push({ cls: "primer-page formula-page" + bind, spell: "f-" + x.m.id, running, html: formulaLesson(x, i, b, tpl) }));
          html = "";
        }
      }
      if (pt.id === "W") {
        // Hausformeln des Buches: jede auf einer Seite wie die Zaubertricks, der Abschnitt kann wachsen
        const tpl = P().lessons.find((x) => x.template);
        html += `<p>${X().houseFormulas}</p>`;
        pages.push({ cls: "primer-page flow" + bind, running, html });
        everyday.forEach((x, i) => pages.push({ cls: "primer-page formula-page" + bind, spell: "f-" + x.m.id, running, html: formulaLesson(x, i, b, { ...tpl, read: [] }, X().formula.everyday, true) }));
        html = "";
      }
      if (html) pages.push({ cls: "primer-page flow" + bind, running, html });
      pages.forEach((pg) => (pg.cls += " part-" + pt.id));
      // mit Lochrand beginnt jeder Teil wie im Buch auf einer rechten Seite
      if (pages[0] && bind) pages[0].cls += " recto-start";
      parts.push({ id: pt.id, title: pt.id === "V" ? pt.title : tail(pt) ? pt.title : `${roman(pt)} · ${pt.title}`, lessons: lessons.map((L) => ({ id: L.id, title: L.title, label: lessonNo(L) })).concat(pt.id === "VII" ? tricks.map((x) => ({ id: "f-" + x.m.id, title: x.t.title, label: "·" })) : pt.id === "W" ? everyday.map((x) => ({ id: "f-" + x.m.id, title: x.t.title, label: "·" })) : []), pages });
    }
    // eigene Ergänzung, kein Teil des klassischen Lehrhefts: hinter dem Anhang, vor den Alltagszaubern
    if (window.DEVOTION && DEVOTION.enabled()) {
      const at = parts.findIndex((p) => p.id === "A");
      parts.splice(at < 0 ? parts.length : at + 1, 0, prayersPart(bind));
    }
    // das Glossar kennt erst jetzt alle Begriffe: Anhang neu erzeugen
    const A = parts.find((p) => p.id === "A");
    if (A) {
      const appx = P().parts.find((p) => p.id === "A").title;
      let html = `<h3>${e(appx)}</h3>`;
      for (const L of lessonsOf("A")) html += lessonHTML(L, b);
      A.pages = [{ cls: "primer-page flow part-A" + (bind && " recto-start") + bind, running: appx, html }];
      // loses Blatt (Profil): liegt schräg eingelegt hinter dem Anhang
      const lf = pr.looseLeaf;
      if (lf && (!lf.level || b.level >= lf.level)) A.pages.push({ cls: "primer-page loose-page part-A" + bind, running: "", html: looseLeafHTML(lf) });
    }
    // Prüfbogen als eigener Handzettel (nicht im Heft), nach Teilen gegliedert;
    // pageOf(id) liefert die Seite der Lektion im gesetzten Heft (falls bekannt)
    const checks = b.checks;
    const sheet = (pageOf = () => "") => {
      let html = `<h3>${X().sheet.title}</h3><p class="pb-key">${X().sheet.key}</p>`;
      // je Teil ein teilbarer Abschnitt: die Überschrift bleibt nie allein am Seitenende
      const parts = [...new Set(checks.map((c) => c.part))];
      html += parts.map((pt) => `<section class="pb-sec splittable"><h4 class="pb-part keep-next">${e(pt)}</h4>${checks.filter((c) => c.part === pt).map((c) => checkRow(c, pageOf(c.id))).join("")}</section>`).join("");
      return [{ cls: "pb-page flow", running: X().sheet.title + (master ? X().sheet.workshop + master : ""), html }];
    };
    return { title, parts, sheet };
  }

  // Teil „Gebete für den Tag“ (nur mit Gottheit bzw. Schutzgottheit): Morgen- und Abendgebet als feste Form,
  // Anlass-Gebete und Festtage aus dem Profil; steht hinter dem Anhang
  function prayersPart(bind) {
    const PY = X().prayers, G_TITLE = PY.title;
    const sec = (id, kicker, title, inner) => `<section class="lesson splittable keep-whole" data-lesson="${e(id)}"><div class="ls-head keep-next"><div class="ls-k">${e(kicker)}</div><h4 class="ls-t">${e(title)}</h4></div>${inner}</section>`;
    const steps = (P) => P.steps.map((s) => `<div class="dv-step"><h5>${e(s.label)}${s.optional ? ` <i>${PY.optional}</i>` : ""}</h5><p>${s.lines.map(e).join("<br>")}</p></div>`).join("");
    const M = DEVOTION.morning(null), E = DEVOTION.evening(null);
    const occ = DEVOTION.OCCASIONS.map((k) => DEVOTION.occasion(k));
    const months = (BP().calendar || {}).months || [];
    const feasts = DEVOTION.cfg().feasts || [];
    const lessons = [
      { id: "g-morning", title: M.title, kicker: PY.morning, html: steps(M) },
      { id: "g-evening", title: E.title, kicker: PY.evening, html: steps(E) },
      ...occ.map((o) => ({ id: "g-" + o.kind, title: o.title, kicker: PY.occasion, html: `<p>${o.lines.map(e).join("<br>")}</p>` })),
      ...(feasts.length ? [{ id: "g-feasts", title: PY.feasts, kicker: PY.year, html: `<ul>${feasts.map((f) => `<li><b>${e(PY.feastDay(f.d, months[f.m] || ""))}</b> · ${e(f.name)}</li>`).join("")}</ul>` }] : []),
    ];
    const deity = window.DEITY ? window.DEITY.name : "";
    const html = `<h3>${e(G_TITLE)}</h3><p class="hint">${e(PY.intro(deity))}</p>` +
      lessons.map((L) => sec(L.id, L.kicker, L.title, L.html)).join("");
    return {
      id: "G",
      title: G_TITLE,
      lessons: lessons.map((L) => ({ id: L.id, title: L.title, label: "·" })),
      pages: [{ cls: "primer-page flow part-G" + bind + (bind ? " recto-start" : ""), running: G_TITLE, html }],
    };
  }

  window.PRIMER_BOOK = { build };
})();
