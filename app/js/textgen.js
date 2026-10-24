// Baukasten-Texte. Alles wird aus dem Modell (analyze.js) abgeleitet und mit einem
// Zufallsgenerator variiert, der pro Zauber fest ist – derselbe Zauber ergibt immer denselben Text.
// Handgeschriebene Texte aus data/custom_texts.js ersetzen einzelne Felder.
(function () {
  const T = window.THEORY;

  // ---------------------------------------------------------------------------
  // Sprachmaterial
  // ---------------------------------------------------------------------------
  const IMPERATIVE = {
    abjuration: ["arce", "muni", "claude", "prohibe", "tuere", "obsera"],
    conjuration: ["voca", "accerse", "crea", "adduc", "trahe", "aperi"],
    divination: ["vide", "cerne", "revela", "intuere", "lege", "aperi"],
    enchantment: ["liga", "iube", "mulce", "cape", "suade", "flecte"],
    evocation: ["erumpe", "emitte", "arde", "frange", "fulmina", "effunde"],
    illusion: ["finge", "simula", "vela", "abde", "pinge", "fallere"],
    necromancy: ["exhauri", "excita", "marcesce", "exanima", "suge", "sepeli"],
    transmutation: ["muta", "verte", "forma", "auge", "transfer", "solve"],
    universal: ["fac", "scribe", "tene", "imple", "rege"],
  };
  const PARTICIPLE = {
    abjuration: ["Arcens", "Muniens", "Claudens", "Tuens"],
    conjuration: ["Vocans", "Accersens", "Creans", "Aperiens"],
    divination: ["Videns", "Cernens", "Revelans", "Legens"],
    enchantment: ["Ligans", "Iubens", "Mulcens", "Flectens"],
    evocation: ["Erumpens", "Ardens", "Frangens", "Fulminans"],
    illusion: ["Fingens", "Simulans", "Velans", "Fallens"],
    necromancy: ["Exhauriens", "Excitans", "Marcescens", "Exanimans"],
    transmutation: ["Mutans", "Vertens", "Formans", "Augens"],
    universal: ["Faciens", "Regens", "Tenens"],
  };
  const EPITHET = {
    abjuration: ["Der Wall", "Das Siegel", "Die Schranke", "Der Schild", "Die Wacht", "Der Riegel"],
    conjuration: ["Das Tor", "Der Ruf", "Die Brücke", "Der Pfad", "Die Schwelle", "Der Griff"],
    divination: ["Das Auge", "Der Blick", "Die Lesung", "Das Zeichen", "Die Spur", "Das Licht"],
    enchantment: ["Die Fessel", "Das Flüstern", "Der Faden", "Der Bann", "Die Stimme", "Der Haken"],
    evocation: ["Der Ausbruch", "Die Entladung", "Der Schlag", "Die Woge", "Der Funke", "Der Sturz"],
    illusion: ["Der Schleier", "Das Trugbild", "Der Spiegel", "Die Maske", "Das Echo", "Der Vorhang"],
    necromancy: ["Der Griff", "Der Hauch", "Die Ernte", "Das Welken", "Die Kälte", "Das Echo"],
    transmutation: ["Die Wandlung", "Die Formung", "Die Gabe", "Der Wechsel", "Das Gefüge", "Die Schmiede"],
    universal: ["Das Werk", "Die Hand", "Der Griffel"],
  };
  const SHAPE_SUFFIX = {
    cone: "im Kegel", line: "in gerader Bahn", ray: "als Strahl", burst: "im Kreis", spread: "in der Woge",
    emanation: "um den Wirker", cylinder: "in der Säule", wall: "als Wall", sphere: "in der Kugel", cube: "im Geviert",
    touch: "durch die Hand", self: "am eigenen Leib", targets: "auf das Ziel", object: "am Ding", summon: "von jenseits",
    sensor: "aus der Ferne", symbol: "im Zeichen", other: "",
  };
  const SHAPE_CASE = {
    cone: ["einen Kegel", "eines Kegels"], line: ["eine Linie", "einer Linie"], ray: ["einen Strahl", "eines Strahls"],
    burst: ["eine Explosion", "einer Explosion"], spread: ["eine Ausbreitung", "einer Ausbreitung"],
    emanation: ["eine Ausströmung", "einer Ausströmung"], cylinder: ["eine Säule", "einer Säule"], wall: ["eine Wand", "einer Wand"],
    sphere: ["eine Kugel", "einer Kugel"], cube: ["einen Würfel", "eines Würfels"], touch: ["eine Berührung", "einer Berührung"],
    self: ["den eigenen Leib", "des eigenen Leibes"], targets: ["ausgewählte Ziele", "ausgewählter Ziele"], object: ["einen Gegenstand", "eines Gegenstands"],
    summon: ["ein Herbeigerufenes", "eines Herbeigerufenen"], sensor: ["ein fernes Auge", "eines fernen Auges"],
    symbol: ["ein Zeichen", "eines Zeichens"], other: ["eine besondere Form", "einer besonderen Form"],
  };
  const TONE = {
    abjuration: "gleichmäßig und tief, jede Silbe gleich lang – wie das Setzen von Steinen",
    conjuration: "rufend, mit offenem Vokal am Zeilenende, als spräche man über eine Entfernung hinweg",
    divination: "leise, beinahe geflüstert, mit Pausen zum Lauschen zwischen den Worten",
    enchantment: "melodisch und weich, die Zischlaute gedehnt, ohne Härte",
    evocation: "scharf und ansteigend; das letzte Wort wird ausgestoßen, nicht gesprochen",
    illusion: "im Wechsel laut und leise, als antworte ein Echo auf die eigene Stimme",
    necromancy: "tonlos und flach, ausatmend, ohne Stimme zu geben",
    transmutation: "rhythmisch, in drei Takten – fassen, lösen, fügen",
    universal: "neutral, präzise, wie ein Diktat",
  };
  const SCHOOL_GESTURE = {
    abjuration: ["die flache Hand senkrecht vor die Brust stellen, Finger geschlossen", "mit beiden Händen ein Quadrat in die Luft legen", "die Fäuste vor dem Körper aneinanderschlagen"],
    conjuration: ["mit gespreizten Fingern ein Fünfeck in die Luft ziehen", "die Hand öffnen, als nähme man etwas entgegen", "mit dem Zeigefinger eine Tür in die Luft zeichnen"],
    divination: ["Daumen und Zeigefinger zu einem Dreieck vor das Auge legen", "die Handflächen nach oben öffnen, lauschend", "zwei Finger an die Schläfe führen"],
    enchantment: ["mit dem Zeigefinger eine langsame Spirale beschreiben", "die Finger wie Fäden durch die Luft ziehen", "die Hand zum Ziel strecken und die Finger einrollen"],
    evocation: ["die Hand zur Faust ballen und ruckartig öffnen", "beide Handflächen nach vorn stoßen", "die Finger spreizen, als bräche etwas aus der Hand"],
    illusion: ["die Hand vor dem Gesicht vorbeiziehen wie einen Schleier", "die Finger spiegelbildlich bewegen, links wie rechts", "eine Form mit den Händen modellieren, die nicht da ist"],
    necromancy: ["die Hand mit der Innenfläche nach unten langsam senken", "die Finger zur Klaue krümmen und zurückziehen", "zwei Kreise mit den Fingerspitzen berühren lassen"],
    transmutation: ["Kreis, Quadrat und Dreieck nacheinander in die Luft zeichnen", "die Hände ineinander drehen, als wringe man etwas aus", "die Finger verschränken und auseinanderziehen"],
    universal: ["mit beiden Händen ein Rad beschreiben", "den Griffel der Formel in der Luft führen"],
  };
  const SHAPE_GESTURE = {
    cone: "die Daumen verschränken und die Finger fächerförmig nach vorn spreizen",
    line: "den Arm gestreckt in Zielrichtung führen, die Hand flach wie eine Klinge",
    ray: "den Zeigefinger auf das Ziel richten, die übrigen Finger eingerollt",
    burst: "die Hände vor der Brust zusammenführen und explosionsartig auseinanderreißen",
    spread: "die Hände mit gespreizten Fingern langsam nach außen streichen",
    emanation: "die Arme langsam ausbreiten, die Handflächen nach außen",
    cylinder: "eine Hand senkrecht von unten nach oben führen",
    wall: "eine waagrechte Linie in Schulterhöhe ziehen und die Hand dann aufrichten",
    sphere: "mit beiden Händen eine Kugel umfassen",
    cube: "mit den Fingerkanten ein Geviert in die Luft setzen",
    touch: "die Fingerspitzen zusammenführen und auf das Ziel legen",
    self: "die Handfläche auf das eigene Herz legen",
    targets: "die Finger einzeln auf die Ziele richten",
    object: "den Gegenstand mit beiden Händen umschließen",
    summon: "die Hand weit ausstrecken und zu sich heranziehen",
    sensor: "zwei Finger vor die Augen halten und dann fortschnippen",
    symbol: "das Zeichen mit der Fingerspitze nachzeichnen",
    other: "die Hände in einer offenen Schale halten",
  };
  const ESSENCE_GESTURE = {
    ignis: "mit Daumen und Mittelfinger einen Funken schnippen", aqua: "die Hand in einer Wellenbewegung senken",
    aer: "flach über die Handfläche blasen", terra: "die Faust schwer nach unten drücken",
    vita: "die Hand vom Herzen nach außen öffnen", mors: "die Finger einzeln einknicken, vom kleinen zum Zeigefinger",
    lux: "die Handfläche ruckartig dem Himmel zuwenden", umbra: "die Hand über die Augen legen",
    mens: "zwei Finger an die Stirn legen", vis: "die offene Hand nach vorn stoßen",
    ordo: "die Finger gerade ausrichten und gleichmäßig spreizen", fluxus: "die Hände gegeneinander drehen",
    bonum: "die Hand nach oben führen", malum: "die Finger in die Handfläche krallen",
    spatium: "eine Hand weit weg, die andere nah halten und dann tauschen", tempus: "mit dem Finger einen Kreis gegen den Uhrzeigersinn ziehen",
  };
  // Entsprechungen; Himmelskörper und Gestirne kommen aus dem Profil
  const CORRESPOND_BASE = {
    ignis: { hour: "Mittag", color: "Zinnoberrot", metal: "Gold", dir: "Süden" },
    aqua: { hour: "Abenddämmerung", color: "Tiefblau", metal: "Silber", dir: "Westen" },
    aer: { hour: "Morgengrauen", color: "Himmelblau", metal: "Kupfer", dir: "Osten" },
    terra: { hour: "Mitternacht", color: "Ocker", metal: "Eisen", dir: "Norden" },
    vita: { hour: "Sonnenaufgang", color: "Grün", metal: "Zinn", dir: "Osten" },
    mors: { hour: "Dritte Nachtstunde", color: "Aschgrau", metal: "Blei", dir: "Westen" },
    lux: { hour: "Mittag", color: "Weißgold", metal: "Gold", dir: "Zenit" },
    umbra: { hour: "Neumondnacht", color: "Schiefer", metal: "Blei", dir: "Nadir" },
    mens: { hour: "Abend", color: "Violett", metal: "Quecksilber", dir: "Innen" },
    vis: { hour: "Vormittag", color: "Stahlblau", metal: "Eisen", dir: "Vorne" },
    ordo: { hour: "Volle Stunde", color: "Weiß", metal: "Platin", dir: "Norden" },
    fluxus: { hour: "Halbe Stunde", color: "Schillernd", metal: "Quecksilber", dir: "Wechselnd" },
    bonum: { hour: "Morgenandacht", color: "Weiß", metal: "Silber", dir: "Oben" },
    malum: { hour: "Mitternacht", color: "Schwarzrot", metal: "Kaltes Eisen", dir: "Unten" },
    spatium: { hour: "Dämmerung", color: "Mitternachtsblau", metal: "Silber", dir: "Jenseits" },
    tempus: { hour: "Sonnenwende", color: "Bernstein", metal: "Gold", dir: "Rückwärts" },
  };
  const PR = window.PROFILE;
  const CORRESPOND = Object.fromEntries(Object.entries(CORRESPOND_BASE).map(([k, v]) => [k, { body: "–", planet: "–", ...v, ...((PR.correspond || {})[k] || {}) }]));
  const MONTHS = PR.calendar.months;
  const PLACES = PR.places;
  const dateStr = (day, month) => `${day}. ${MONTHS[month % MONTHS.length]} ${PR.calendar.year}`;

  const school = (m) => T.SCHOOLS[m.school] || T.SCHOOLS.universal;
  const ess = (id) => T.ESS[id];
  const pctList = (m) => m.essences.map((e) => `${ess(e.id).latin} ${e.pct} %`).join(", ");
  const fmtM = (ft) => {
    const m = Math.round((ft * 0.3) * 10) / 10;
    return (m >= 1000 ? (m / 1000).toLocaleString("de-DE", { maximumFractionDigits: 1 }) + " km" : m.toLocaleString("de-DE") + " m");
  };

  // ---------------------------------------------------------------------------
  // Bausteine
  // ---------------------------------------------------------------------------
  function title(m, r) {
    const e = ess(m.primary);
    const word = U.cap(r.pick(e.words.slice(0, 3)));
    const part = r.pick(PARTICIPLE[m.school] || PARTICIPLE.universal);
    const shapeL = U.cap(m.shape.latin);
    const mod = { greater: "Maior", major: "Maior", improved: "Maior", lesser: "Minor", minor: "Minor", mass: "Multiplex", communal: "Communis" }[m.family.mod];
    // Muster: „Ignis Orbis Erumpens“ oder „Erumpens Ignis“
    let t = r.chance(0.65) ? `${word} ${shapeL} ${part}` : `${part} ${word}`;
    if (mod) t += " " + mod;
    if (m.family.mod && /^(i|ii|iii|iv|v|vi|vii|viii|ix|\d)$/.test(m.family.mod)) t += " " + (/\d/.test(m.family.mod) ? U.ROMAN[+m.family.mod] : m.family.mod.toUpperCase());
    return t;
  }

  function epithet(m, r) {
    const n = r.pick(EPITHET[m.school] || EPITHET.universal);
    const suffix = SHAPE_SUFFIX[m.shape.kind];
    return `${n} ${ess(m.primary).gen}${suffix && r.chance(0.6) ? " " + suffix : ""}`;
  }

  function formula(m, r) {
    const imp = IMPERATIVE[m.school] || IMPERATIVE.universal;
    const words = (id) => ess(id).words;
    const lines = [];
    const L = m.level;
    const nLines = L === 0 ? 1 : Math.min(1 + Math.ceil(L * 0.75), 8);
    const prim = m.primary;
    // Kernzeile: Verb – Essenz – Gestalt
    lines.push(`${U.cap(r.pick(imp))} ${r.pick(words(prim))}, ${m.shape.latin}!`);
    const pool = [];
    m.essences.slice(1).forEach((e) => pool.push(`${U.cap(r.pick(words(e.id)))} ${r.pick(["et", "cum", "in"])} ${r.pick(words(prim))}`));
    if (m.range.tier > 0) pool.push(`${U.cap(m.range.latin)}, ${r.pick(["usque ad finem", "per circulos", "ad scopum", "trans spatium"])}`);
    pool.push(`${U.cap(m.duration.latin)} ${r.pick(["maneat", "fiat", "sit", "duret"])}`);
    for (const s of m.signs) pool.push(`${U.cap(r.pick(imp))} ${s.dir === "in" ? "intra" : "extra"} ${r.pick(["signum", "circulum", "limitem", "orbem"])}`);
    if (m.save.type !== "none") pool.push(`${U.cap(T.SAVES[m.save.type].latin)} ${m.save.harmless ? "aperta" : r.pick(["frangatur", "cedat", "probetur"])}`);
    if (m.components.M) pool.push(`${r.pick(["Materia", "Pretium", "Donum"])} ${r.pick(["datum", "solutum", "consumptum"])} est`);
    if (m.sr.yes) pool.push(`${r.pick(["Sigillum", "Vinculum"])} ${r.pick(["ruptum", "transitum"])}`);
    for (let i = 0; i < L; i++) pool.push(`${r.pick(["Ordine", "Gradu", "Nodo"])} ${["primo", "secundo", "tertio", "quarto", "quinto", "sexto", "septimo", "octavo", "nono"][i]} ${r.pick(imp)}`);
    // Auswahl zufällig, Reihenfolge aber wie im Aufbau (Ordnungen aufsteigend)
    const extra = r.sample(pool, nLines - 1).sort((a, b) => pool.indexOf(a) - pool.indexOf(b));
    lines.push(...extra);
    // Schlusssiegel
    if (L >= 2) lines.push(`${r.pick(["Fiat", "Sic sit", "Clausum est", "Signatum est"])}!`);
    return { lines, tone: TONE[m.school] || TONE.universal, band: lines.join(" · ").replace(/[!,]/g, "") };
  }

  function longFormula(m, r) {
    // Ausführliche Fassung mit Wechselrede zwischen Anrufung (A) und Antwort (R)
    const base = formula(m, U.rng(m.seed ^ 0x55)).lines;
    const out = [];
    const imp = IMPERATIVE[m.school] || IMPERATIVE.universal;
    base.forEach((l, i) => {
      out.push({ k: "A", t: l });
      out.push({ k: "R", t: `${U.cap(r.pick(ess(m.essences[i % m.essences.length].id).words))}, ${r.pick(imp)}${r.chance(0.5) ? ", " + r.pick(["audi", "veni", "esto", "sta"]) : ""}.` });
    });
    return out;
  }

  function gestures(m, r) {
    const L = m.level;
    const n = L === 0 ? 3 : Math.min(2 + Math.ceil(L / 2), 7);
    const g = [];
    g.push(U.cap(r.pick(SCHOOL_GESTURE[m.school] || SCHOOL_GESTURE.universal)));
    for (const e of m.essences.slice(0, 2)) g.push(U.cap(ESSENCE_GESTURE[e.id]));
    g.push(U.cap(SHAPE_GESTURE[m.shape.kind]));
    for (const s of m.signs) g.push(`Das Zeichen ${s.gen} mit der Fingerspitze ${s.dir === "in" ? "zum Körper hin" : "vom Körper weg"} in die Luft setzen`);
    // Reihenfolge: Schule zuerst, Gestalt zuletzt (sie gibt die Entladung frei)
    const first = g[0], last = U.cap(SHAPE_GESTURE[m.shape.kind]);
    const mid = r.sample(g.filter((x) => x !== first && x !== last), Math.max(0, n - 2));
    return [first, ...mid, last].slice(0, n);
  }

  function materials(m) {
    const c = m.components;
    const parts = [];
    if (c.M) {
      const cats = c.materialTags.map((t) => T.ALCHEMY[t.tag].split(" – ")[0]).join(", ");
      const names = c.nouns.length ? `${c.nouns.join(", ")} (${cats})` : cats;
      parts.push({ k: "Stoffopfer", t: names + (c.costly ? ` · ${c.costly.toLocaleString("de-DE")} GM` : ""), orig: c.material || "" });
    }
    if (c.F) parts.push({ k: "Fokus", t: "bleibt erhalten und wird nicht verbraucht", orig: c.focus || "" });
    if (c.DF) parts.push({ k: "Göttlicher Fokus", t: PR.divineFocus, orig: "" });
    return parts;
  }

  function theory(m, r) {
    const sc = school(m);
    const e0 = ess(m.primary);
    const paras = [];
    // 1. Schule
    paras.push({
      h: "Grundsatz der Schule",
      t: `${sc.principle} ${U.cap(sc.de)} ist die Kunst, ${sc.art}. Diese Formel tut dies in Gestalt ${SHAPE_CASE[m.shape.kind][1]}.`,
    });
    // 2. Essenzen
    let et = `Die Ladung der Formel verteilt sich auf ${m.essences.length === 1 ? "eine einzige Essenz" : m.essences.length + " Essenzen"}: ${pctList(m)}. ${e0.text}`;
    if (m.essences[1]) {
      const e1 = ess(m.essences[1].id);
      et += ` Als zweite Essenz wirkt ${e1.latin} (${e1.de}): ${e1.text.split(". ")[0]}.`;
      if (m.combo) et += ` Zusammen bilden ${e0.latin} und ${e1.latin} die Verbindung, die die alten Lehrbücher „${m.combo}“ nennen.`;
    }
    if (m.tension) et += " Die Formel vereint gegensätzliche Essenzen. Solche Spannungsmagie hält nur, wenn der äußere Ring sauber geschlossen ist – jede Unsauberkeit wird zum Riss.";
    paras.push({ h: "Essenzen", t: et });
    // 3. Zeichen
    if (m.signs.length) {
      const directional = !["burst", "spread", "emanation", "sphere", "cube", "self", "touch", "summon", "other", "object", "symbol"].includes(m.shape.kind);
      paras.push({
        h: "Zeichen und Richtung",
        t: m.signs.map((s) => `Das Zeichen ${s.gen} ${s.text}${s.dir === "in" ? "; es ist zum Kern hin ausgerichtet" : ""}.`).join(" ") +
          (directional
            ? " Die Zeichen sind im Norden des Rings gehäuft: Dieses Übergewicht gibt die Wirkrichtung vor. Ein einzelnes Gegenzeichen im Süden verhindert, dass die Formel nach hinten ausschlägt."
            : " Die Zeichen sind gleichmäßig verteilt; ihre Symmetrie lässt die Wirkung nach allen Seiten zugleich austreten."),
      });
    }
    // 4. Weite und Dauer
    let wd = m.range.tier === 0
      ? "Die Formel hat keinen Weitenring – sie verlässt den Wirker nicht."
      : `${["", "Ein Weitenring", "Zwei Weitenringe", "Drei Weitenringe", "Vier Weitenringe", "Fünf Weitenringe"][m.range.tier]} ${m.range.tier === 1 ? "trägt" : "tragen"} die Formel ${m.range.tier === 1 ? "bis zur Fingerspitze" : m.range.tier >= 5 ? "über jede messbare Entfernung hinaus" : "nach außen; je mehr Ringe, desto weiter reicht die Formel und desto mehr Kraft kostet sie"}.`;
    wd += {
      instant: " Der Dauerring ist bewusst gebrochen: eine offene Matrix. Die Energie wird nicht gehalten, sondern freigegeben – die Wirkung ist augenblicklich, ihre Folgen aber bleiben.",
      rounds: " Der Dauerring trägt Zeitmarken. Jede Marke ist ein Herzschlag der Formel; sind sie verbraucht, erlischt sie.",
      minutes: " Der gestrichelte Dauerring hält die Formel für einige Minuten; zwischen den Strichen entweicht die Ladung langsam.",
      hours: " Der doppelte Dauerring schließt die Ladung ein und hält sie über Stunden.",
      days: " Der dreifache Dauerring bindet die Formel über Tage. Er muss mit besonderer Sorgfalt gezogen werden.",
      permanent: " Der Dauerring ist eine Schlange, die sich selbst in den Schwanz beißt: Die Formel speist sich aus sich selbst und vergeht nicht von allein.",
      concentration: " Vom Dauerring führt ein Faden zum Rand – er ist der Geist des Wirkers. Reißt die Konzentration, reißt der Faden.",
      special: " Der Dauerring ist offen gelassen; die Dauer richtet sich nach Umständen, die die Formel selbst bestimmt.",
    }[m.duration.kind];
    if (m.duration.dismissible) wd += " Eine Schlüsselkerbe im Ring erlaubt es, die Formel jederzeit zu lösen.";
    paras.push({ h: "Weite und Dauer", t: wd });
    // 5. Schwellen
    let sw = "";
    if (m.save.type !== "none")
      sw += `Im Schriftband ${m.save.effect === "half" || m.save.effect === "partial" ? "liegen zwei Schwellentore" : "liegt ein Schwellentor"} – das Tor ${T.SAVES[m.save.type].gateGen}. Durch ${m.save.effect === "half" || m.save.effect === "partial" ? "sie" : "es"} kann sich das Ziel mit ${T.SAVES[m.save.type].de} gegen die Formel stemmen${m.save.harmless ? "; das Tor ist offen gezeichnet, denn ein williges Ziel lässt die Formel ein" : ""}.`;
    else sw += "Die Formel hat kein Schwellentor: Ihr kann man sich nicht durch Willen oder Gewandtheit entziehen.";
    sw += m.sr.yes
      ? " Das schraffierte Siegelband dahinter zeigt, dass die Formel gegen Zauberresistenz ankämpfen muss."
      : " Ein Siegelband fehlt – Zauberresistenz greift hier nicht, denn die Wirkung ist, einmal entstanden, gewöhnlicher Stoff oder gewöhnliche Kraft.";
    paras.push({ h: "Schwellen", t: sw });
    // 6. Ausgleich
    if (m.components.M || m.components.F) {
      paras.push({
        h: "Gesetz des Ausgleichs",
        t: `Nichts entsteht aus nichts. ${m.components.M ? `Der Stoff (${(m.components.nouns.length ? m.components.nouns : m.components.materialTags.map((t) => T.ALCHEMY[t.tag].split(" – ")[0])).join(", ")}) ist der Preis, den die Formel verlangt; er wird beim Wirken aufgezehrt.` : ""} ${m.components.F ? "Der Fokus dagegen ist kein Preis, sondern ein Werkzeug: Er richtet die Ladung aus und bleibt erhalten." : ""}${m.components.costly ? ` Je größer die Wirkung, desto höher der Ausgleich – hier ${m.components.costly.toLocaleString("de-DE")} Goldmünzen.` : ""}`,
      });
    }
    return paras;
  }

  function structure(m) {
    const out = [];
    const sc = school(m);
    out.push({ k: "Kernsiegel", t: `${sc.figure} – Schule der ${sc.de}${m.subschools.length ? " (" + m.subschools.map((s) => T.SUBSCHOOLS[s].de).join(", ") + ")" : ""}. Im Zentrum die Hauptessenz ${ess(m.primary).latin}.` });
    out.push({ k: "Essenzring", t: `Segmente nach Anteil: ${pctList(m)}.` });
    out.push({ k: "Dauerring", t: `${m.duration.ring}${m.duration.dismissible ? ", mit Schlüsselkerbe" : ""}.` });
    if (m.signs.length) out.push({ k: "Zeichenring", t: m.signs.map((s) => `${s.de} (${s.dir === "in" ? "nach innen" : "nach außen"})`).join(", ") + "." });
    out.push({ k: "Weitenringe", t: `${m.range.rings} – ${m.range.de}.` });
    out.push({ k: "Ordnungsknoten", t: m.level === 0 ? "Keiner – eine Fingerübung ohne eigene Ordnung." : `${m.level} – eine Formel der ${m.level}. Ordnung.` });
    out.push({ k: "Gestalt", t: `${m.shape.de}: ${m.shape.figure}.` });
    out.push({ k: "Schriftband", t: m.components.V ? "Trägt die gesprochene Formel." : "Stumme Runen – die Formel wird nicht gesprochen." });
    if (m.save.type !== "none") out.push({ k: "Schwellentor", t: `${T.SAVES[m.save.type].gate} (${T.SAVES[m.save.type].de}).` });
    out.push({ k: "Siegelband", t: m.sr.yes ? "Schraffiert – Zauberresistenz wirkt." : "Fehlt – Zauberresistenz wirkt nicht." });
    out.push({ k: "Zeitmarke", t: m.casting.de + "." });
    return out;
  }

  function steps(m, r) {
    const L = m.level;
    const per = L === 0 ? 1 : 1 + Math.floor(L / 3);
    const g = gestures(m, r);
    const sc = school(m);
    const phases = [
      {
        h: "Erfassen",
        items: [
          `Den Kreis vor dem inneren Auge vollständig aufbauen: zuerst das Kernsiegel (${sc.figure}), dann den Essenzring mit ${ess(m.primary).latin} im Zentrum.`,
          m.shape.kind === "self" ? "Den eigenen Körper als Gefäß der Formel begreifen." : `Das Ziel bestimmen: ${SHAPE_CASE[m.shape.kind][0]}, ${m.range.tier === 0 ? "am eigenen Leib" : m.range.de.toLowerCase() + " entfernt"}.`,
          m.level >= 3 ? `Die ${m.level} Ordnungsknoten in der richtigen Reihenfolge abzählen; ein übersprungener Knoten lässt den Stern kollabieren.` : "Den Atem ruhig halten, bis das Bild steht.",
          m.components.M ? "Den Stoff in die linke Hand nehmen und seinen Wert innerlich anerkennen." : "Die Hände frei machen.",
        ],
      },
      {
        h: "Lösen",
        items: [
          m.components.V ? `Die Formel sprechen – ${TONE[m.school] || TONE.universal}.` : "Die Formel stumm denken; nur die Lippen bewegen sich nicht.",
          ...g.slice(0, -1),
          m.components.M ? "Den Stoff zwischen den Fingern zerreiben, zerbrechen oder verbrennen, sobald die vorletzte Silbe fällt." : "Die Ladung im Brustkorb sammeln.",
        ],
      },
      {
        h: "Fügen",
        items: [
          g[g.length - 1] + ".",
          m.duration.kind === "instant" ? "Den Kreis offen lassen: Die Energie muss ungehindert austreten." : "Den äußeren Ring im Geist schließen, bevor die Hand sinkt.",
          m.duration.concentration ? "Den Faden halten – die Aufmerksamkeit bleibt bei der Formel." : "Loslassen. Die Formel trägt sich selbst.",
        ],
      },
    ];
    for (const p of phases) p.items = p.items.filter(Boolean).slice(0, per + 1 + (p.h === "Lösen" ? 1 : 0));
    return phases;
  }

  // Randnotizen im Ton des Besitzers (Profil frei konfigurierbar)
  function notes(m, r, profile, n) {
    const sc = school(m);
    const e0 = ess(m.primary);
    const vars = { owner: profile.name, name: m.name, essence: e0.latin, school: sc.de };
    const pool = [
      `Messung: Bei sauberem Kreis ${r.int(2, 9)} % weniger Restladung im Finger als bei der Vorlage. Die Vorlage war schlampig.`,
      `Der ${m.signs[0] ? "Zeichenring" : "Essenzring"} lässt sich um ${r.int(2, 7)}° drehen, ohne dass die Formel bricht. Toleranz notiert. Möglicher Ansatzpunkt.`,
      `Schwachstelle: Die Formel prüft nicht, ${m.save.type !== "none" ? "wer durch das Schwellentor geht" : "woher die Ladung stammt"}. Das lässt sich ausnutzen.`,
      `Gezeichnet in ${r.int(3, 40) + m.level * 4} Minuten. Ziel: unter ${r.int(2, 9) + m.level * 2}.`,
      `${sc.de}: ${r.pick(["vertraut", "zuverlässig", "noch nicht vollständig verstanden", "eleganter als erwartet", "unnötig kompliziert notiert"])}.`,
      m.tension ? `Gegensätzliche Essenzen (${m.essences.map((e) => ess(e.id).latin).slice(0, 2).join("/")}). Ring doppelt prüfen. Beim letzten Versuch ${r.pick(["versengte Ärmel", "Kopfschmerz", "ein Riss im Pergament", "ein Summen im Schädel"])}.` : `Keine Spannung zwischen den Essenzen. Stabil.`,
      m.essences.some((e) => e.id === "malum" || e.id === "bonum") ? PR.noteAlignment[m.essences.some((e) => e.id === "malum") ? "malum" : "bonum"] : `Im Feld erprobt (${r.pick(PLACES)}). Ergebnis wie berechnet.`,
      m.components.costly ? `Der Ausgleich (${m.components.costly.toLocaleString("de-DE")} GM) ist schmerzhaft. Suche nach einer günstigeren Entsprechung läuft.` : `Kein teurer Stoff nötig. Effizient.`,
      PR.fill(PR.noteOriginalName, vars),
      `Querverweis: ${m.combo ? "Verbindung „" + m.combo + "“ – siehe auch andere Formeln mit dieser Verbindung." : "Reine Essenz, keine benannte Verbindung."}`,
      m.family.mod ? `Gehört zur Familie „${m.family.base}“. Grundaufbau identisch, nur ${/greater|major|improved/.test(m.family.mod) ? "ein zusätzlicher Verstärkungsring" : /lesser|minor/.test(m.family.mod) ? "der äußere Ring ist gelockert" : "weitere Knoten am Rand"}.` : `Keine bekannte Variante. Noch nicht.`,
      `${profile.name}: Siegel geprüft am ${dateStr(r.int(1, 28), r.int(0, 11))}.`,
      `Tinte: ${r.pick(["Eisengallus", "Ruß mit Gummi arabicum", "Sepia", "Zinnober für die Tore", "verdünntes Blut – nicht wiederholen"])}. ${r.pick(["Hält.", "Verläuft bei Feuchtigkeit.", "Gut für feine Linien.", "Zu dick für das Schriftband."])}`,
      `Kontrollfrage an mich selbst: Welche Schicht trägt die Last? Antwort: ${m.level >= 3 ? "die Ordnungsknoten" : "der Essenzring"}.`,
      `${m.duration.kind === "instant" ? "Offene Matrix. Nach dem Wirken prüfen, ob Restladung im Raum hängt." : "Geschlossener Kreis. Vor dem Schlafen prüfen, ob noch Formeln an mir hängen."}`,
      `Der Name „${m.name}“ klingt in der Handelssprache nach weniger, als die Formel ist.`,
      `Nachtrag: ${r.pick(["Mit Kreide auf Stein funktioniert der Kreis ebenfalls, aber schwächer.", "Im Regen das Schriftband enger setzen.", "Die Gesten nicht übertreiben – Präzision schlägt Größe.", "Ein Fehler im Glossar korrigiert."])}`,
      ...(PR.notes || []).map((n) => PR.fill(n, vars)),
    ];
    return r.sample(pool.filter(Boolean), n);
  }

  function calibration(m) {
    const s = m.spell;
    const minCL = Math.max(1, m.level * 2 - 1);
    const levels = [];
    for (let cl = minCL; cl <= 20; cl += cl < 10 ? 2 : 5) levels.push(cl);
    if (!levels.includes(20)) levels.push(20);
    const rows = [];
    const rl = s.range.toLowerCase();
    let rangeFn = null;
    if (/^close|^short/.test(rl)) rangeFn = (cl) => 25 + 5 * Math.floor(cl / 2);
    else if (/^medium/.test(rl)) rangeFn = (cl) => 100 + 10 * cl;
    else if (/^long/.test(rl)) rangeFn = (cl) => 400 + 40 * cl;
    const dm = s.duration.toLowerCase().match(/(\d+)\s*(round|min|hour|day)[a-z.]*\/(\d*)\s*level/);
    const unit = dm && { round: "Rd.", min: "Min.", hour: "Std.", day: "Tage" }[dm[2]];
    const dice = m.dice && m.dice.perLevel ? m.dice : null;
    const cap = dice && s.description.match(/maximum (?:of )?(\d+)d\d+/);
    for (const cl of levels) {
      const row = { cl };
      if (rangeFn) row.range = fmtM(rangeFn(cl));
      if (dm) row.dur = Math.floor(cl / (+dm[3] || 1)) * +dm[1] + " " + unit;
      if (dice) row.dice = Math.min(cl * dice.count, cap ? +cap[1] : 99) + "W" + dice.sides;
      rows.push(row);
    }
    const cols = [["cl", "Zauberstufe"]];
    if (rangeFn) cols.push(["range", "Weite"]);
    if (dm) cols.push(["dur", "Dauer"]);
    if (dice) cols.push(["dice", "Würfel"]);
    return cols.length > 1 ? { cols, rows } : null;
  }

  function failure(m, r) {
    const e0 = ess(m.primary);
    const list = [
      { k: "Schriftband unterbrochen", t: m.components.V ? "Die Formel verstummt mitten im Satz; die Ladung entweicht als Hitze in den Händen." : "Eine Rune fehlt: Die stumme Formel bleibt stumm." },
      { k: "Kernsiegel verzerrt", t: `Die Schule kippt. Statt ${school(m).art.split(",")[0]} geschieht etwas Benachbartes – meist harmlos, selten nicht.` },
      { k: "Essenzring unsauber", t: `${e0.latin} tritt unkontrolliert aus. ${{ ignis: "Funken, versengte Finger.", aqua: "Reif auf der Haut, klamme Gelenke.", aer: "Ein Schlag in den Fingerspitzen, Ohrensausen.", terra: "Schwere in den Gliedern, Staub auf der Zunge.", vita: "Kurzes Fieber, wuchernde Fingernägel.", mors: "Taube Finger, ein Kältefleck auf der Brust.", lux: "Geblendete Augen für einige Atemzüge.", umbra: "Der eigene Schatten bewegt sich einen Herzschlag zu spät.", mens: "Kopfschmerz, ein fremder Gedanke.", vis: "Ein Stoß gegen die eigene Brust.", ordo: "Steife Gelenke, die Formel klemmt.", fluxus: "Eine zufällige, kleine Veränderung am Wirker.", bonum: "Ein Gefühl von Scham.", malum: "Ein bitterer Geschmack und ein Flüstern.", spatium: "Ein Schritt, der woanders ankommt als geplant.", tempus: "Ein verlorener Augenblick." }[m.primary]}` },
      { k: "Ordnungsknoten vertauscht", t: m.level >= 2 ? "Der Stern kollabiert nach innen. Die Formel ist verloren, der Platz im Gedächtnis ebenfalls." : "Bei so niedriger Ordnung kaum möglich." },
      { k: "Dauerring nicht geschlossen", t: m.duration.kind === "instant" ? "Kein Fehler – er ist ohnehin offen." : "Die Wirkung tritt ein, verfliegt aber nach einem Herzschlag." },
      { k: "Rückschlag", t: m.tension ? "Gegensätzliche Essenzen schlagen ineinander. Wer zu viel will, zahlt mit dem eigenen Körper." : "Wer mehr Ladung erzwingt, als der Kreis fasst, bekommt den Überschuss zurück." },
    ];
    return r.sample(list, Math.min(list.length, 2 + Math.floor(m.level / 2)));
  }

  function counter(m) {
    const e0 = ess(m.primary);
    const opp = ess(e0.opp);
    return {
      opp,
      t: `Um diese Formel zu lösen, wird ihr Kreis spiegelverkehrt gezeichnet: alle Zeichen umgekehrt, das Schriftband gegen den Uhrzeigersinn. Im Zentrum steht die Gegenessenz ${opp.latin} (${opp.de}). ${m.duration.kind === "instant" ? "Da die Formel augenblicklich wirkt, kann nur ihr Entstehen verhindert werden, nicht ihre Folgen." : "Eine bestehende Wirkung wird gelöst, indem man ihren Dauerring durchtrennt – mit einem Bannen der Magie oder durch das Gegenzeichen."}`,
    };
  }

  function practice(m, r, profile, n) {
    const out = [];
    let day = r.int(1, 20), month = r.int(0, 11);
    const results = ["gelungen", "gelungen, Linienführung unsauber", "misslungen – Ordnungsknoten vertauscht", "gelungen, schneller als zuvor", "abgebrochen – Störung", "gelungen, Wirkung stärker als erwartet", "misslungen – Schriftband verwischt", "gelungen"];
    for (let i = 0; i < n; i++) {
      out.push({ date: dateStr(day, month), place: r.pick(PLACES), result: i === n - 1 ? "gelungen – Formel sitzt" : r.pick(results) });
      day += r.int(1, 9);
      if (day > 28) (day -= 28), (month = (month + 1) % 12);
    }
    return out;
  }

  function learning(m, r) {
    const src = m.traditions.includes("divine") || m.traditions.includes("nature")
      ? "Die Formel ist auch unter Priestern und Druiden bekannt; die arkane Fassung ersetzt das Gebet durch Geometrie."
      : m.classCount <= 3
        ? "Eine seltene Formel – nur wenige Traditionen kennen sie."
        : "Eine weit verbreitete Formel; fast jede arkane Schule lehrt sie in eigener Notation.";
    const dc = 15 + m.level;
    return `${src} Abschrift aus einem fremden Zauberbuch erfordert Zauberkunde SG ${dc}. Herkunft dieser Fassung: ${r.pick(PR.learningOrigins)}`;
  }

  // ---------------------------------------------------------------------------
  function generate(m, profile = { name: PR.owner }) {
    const r = U.rng(m.seed);
    const L = m.level;
    const out = {
      title: title(m, r),
      epithet: epithet(m, r),
      formula: formula(m, r),
      gestures: gestures(m, r),
      materials: materials(m),
      theory: theory(m, r),
      structure: structure(m),
      steps: steps(m, r),
      notes: notes(m, r, profile, 99),
      calibration: calibration(m),
      failure: failure(m, r),
      counter: counter(m),
      practice: practice(m, r, profile, 3 + Math.min(L, 6)),
      longFormula: longFormula(m, r),
      learning: learning(m, r),
      correspond: CORRESPOND[m.primary],
    };
    // Kurzfassung für Grad 0
    out.summary = `${school(m).de}, ${ess(m.primary).latin}${m.essences[1] ? " mit " + ess(m.essences[1].id).latin : ""}. ${U.cap(SHAPE_CASE[m.shape.kind][0])}, ${m.range.de.toLowerCase()}, ${m.duration.de.toLowerCase()}.`;
    if (m.spell.everyday) {
      // Alltagszauber: Beschreibung statt Kurzfassung, Flavour als erste Randnotiz
      out.summary = m.spell.description;
      if (m.spell.flavor) out.notes = [m.spell.flavor, ...out.notes];
      out.learning = `Eine Alltagsformel, abgeleitet aus ${m.spell.base}. Wer die Grundformel beherrscht, kann sie nach einem Nachmittag Übung wirken; die Abschrift gelingt mit Zauberkunde SG 15. Herkunft: ${r.pick(PR.everydayOrigins)}.`;
    }
    const custom = (window.CUSTOM_TEXTS || {})[m.id];
    if (custom) Object.assign(out, custom, { custom: true });
    return out;
  }

  window.generateTexts = generate;
  window.TEXTGEN = { CORRESPOND, MONTHS };
})();
