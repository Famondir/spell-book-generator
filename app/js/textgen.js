// Baukasten-Texte. Alles wird aus dem Modell (analyze.js) abgeleitet und mit einem
// Zufallsgenerator variiert, der pro Zauber fest ist – derselbe Zauber ergibt immer denselben Text.
// Handgeschriebene Texte aus data/custom_texts.js ersetzen einzelne Felder.
(function () {
  const T = window.THEORY;

  // ---------------------------------------------------------------------------
  // Kern
  // ---------------------------------------------------------------------------
  // Sprachmodule (app/js/textgen.de.js, textgen.en.js) liefern Sprachmaterial und Sätze; der Kern wählt
  // deterministisch aus Seed und Analyse und legt die Reihenfolge der Zufallszüge fest.
  // Lateinische Partizipien für den Titel (sprachneutral)
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
  const ess = (id) => T.ESS[id];
  // Baukasten der Buchsprache, je Sprache einmal gebaut (Profil der Buchsprache: PROFILE.forLang)
  const built = new Map();
  function LX(lang = (window.I18N && I18N.lang.book) || "de") {
    const make = (window.TEXTGEN_LANG || {})[lang] ? lang : "de";
    if (!built.has(make)) {
      const PR = window.PROFILE.forLang ? window.PROFILE.forLang(make) : window.PROFILE;
      built.set(make, window.TEXTGEN_LANG[make]({ PR, coreChoice }));
    }
    return built.get(make);
  }

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


  // ---------------------------------------------------------------------------
  // Kernzeile als Absicht: Verb und Essenzwort der lateinischen Kernzeile so wählen, dass auf der
  // Liste der aktiven Klasse (mit Alltagszaubern) keine zwei Zauber dieselbe Schnellglyphe haben.
  // Die Anfangsbuchstaben stehen in der Schnellglyphe; Gleiches gilt dort für den Glyphenschlüssel.
  // ---------------------------------------------------------------------------
  const quickKey = (m) => [m.school, m.primary, m.level, m.duration.kind, m.shape.kind, Math.min(m.shape.count, 3)].join("|");
  const latinLex = () => window.FORMULA.get("latin").lex;
  // Wunschpaar aus eigenem Generator, unabhängig von der Ziehfolge der Texte
  function wishPair(m) {
    const X = latinLex(), r = U.rng(m.seed ^ 0x6b1c3e);
    const nImp = (X.imp[m.school] || X.imp.universal).length, nEss = X.ess[m.primary].length;
    return [Math.floor(r() * nImp), Math.floor(r() * nEss)];
  }
  const coreMaps = new Map(); // je Klassenliste
  // Einzeilige Formeln (Zaubertricks) bestehen nur aus der Kernzeile: dort darf sich das Paar
  // auch über die Dauer hinweg nicht wiederholen
  const lineKey = (m) => [m.school, m.primary, m.shape.kind].join("|");
  function buildCoreMap(list) {
    const X = latinLex();
    const groups = new Map(), lines = new Map();
    for (const s of window.SPELLS) {
      if (!(s.everyday || s.levels[list] != null)) continue;
      const m = window.analyze(s), k = quickKey(m);
      if (!groups.has(k)) groups.set(k, []);
      groups.get(k).push(m);
    }
    const map = new Map();
    for (const ms of groups.values()) {
      ms.sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
      const used = new Set();
      for (const m of ms) {
        const single = m.level === 0 ? lines.get(lineKey(m)) || lines.set(lineKey(m), new Set()).get(lineKey(m)) : null;
        const free = (p) => !used.has(p) && !(single && single.has(p));
        const imp = X.imp[m.school] || X.imp.universal, ess = X.ess[m.primary];
        const [i0, j0] = wishPair(m), n = imp.length * ess.length;
        // ab dem Wunschpaar in fester Reihenfolge das erste freie Buchstabenpaar
        let pair = [i0, j0];
        for (let k = 0; k < n; k++) {
          const c = (i0 * ess.length + j0 + k) % n, i = Math.floor(c / ess.length), j = c % ess.length;
          if (free(imp[i][0] + ess[j][0])) { pair = [i, j]; break; }
        }
        used.add(imp[pair[0]][0] + ess[pair[1]][0]);
        if (single) single.add(imp[pair[0]][0] + ess[pair[1]][0]);
        map.set(m.id, pair);
      }
    }
    return { map, groups };
  }
  // Zweiter Durchgang nach Aussehen: Die Absichtszeichen erscheinen in der Schrift der Formelsprache. Lateinische
  // (und nicht ausgerichtete) Zauber behalten ihre Plätze, damit sie nicht vom Buchinhalt abhängen; fremdsprachige
  // Zauber weichen aus, wenn ihre Zeichen in der Glyphengruppe schon gleich aussehen oder ihre einzeilige Formel
  // schon gedruckt wird.
  const visualMaps = new Map(); // je Klassenliste und Buchinhalt
  function buildVisualMap(base) {
    const F = window.FORMULA, S = window.SCRIPTS;
    const map = new Map(base.map), lines = new Map(), used = new Map();
    const words = (lang, m, [i, j]) => [(lang.lex.imp[m.school] || lang.lex.imp.universal)[i], lang.lex.ess[m.primary][j]];
    const vkey = (lang, m, p) => words(lang, m, p).map((w) => S.visualKey(lang, w)).join("|");
    // dieselben Zeichen in Lateinschrift (Einstellung „Lateinschrift“): auch dort eindeutig
    const lat = (lang, m, p) => words(lang, m, p).map((w) => S.latinKey(lang, w)).join("|");
    const lkey = (lang, m, p) => lang.id + ":" + words(lang, m, p).join(" ");
    const lineSet = (m) => lines.get(lineKey(m)) || lines.set(lineKey(m), new Set()).get(lineKey(m));
    const todo = [];
    for (const [k, ms] of base.groups) {
      used.set(k, new Set());
      for (const m of ms) {
        const lang = F.langOf(m), own = lang.id !== "latin" && F.aligned(lang);
        if (own) { todo.push([k, m, lang]); continue; }
        const L = F.get("latin");
        used.get(k).add(vkey(L, m, map.get(m.id)));
        if (m.level === 0) lineSet(m).add(lkey(L, m, map.get(m.id)));
      }
    }
    for (const [k, m, lang] of todo) {
      const imp = lang.lex.imp[m.school] || lang.lex.imp.universal, ess = lang.lex.ess[m.primary];
      const [i0, j0] = map.get(m.id), n = imp.length * ess.length;
      let pair = [i0, j0];
      for (let c = 0; c < n; c++) {
        const x = (i0 * ess.length + j0 + c) % n, p = [Math.floor(x / ess.length), x % ess.length];
        if (!used.get(k).has(vkey(lang, m, p)) && !used.get(k).has(lat(lang, m, p)) && !(m.level === 0 && lineSet(m).has(lkey(lang, m, p)))) { pair = p; break; }
      }
      used.get(k).add(vkey(lang, m, pair)).add(lat(lang, m, pair));
      if (m.level === 0) lineSet(m).add(lkey(lang, m, pair));
      map.set(m.id, pair);
    }
    return map;
  }
  // { imp, ess, letters, slot, marks } der lateinischen Kernzeile; slot = Plätze [Verb, Essenzwort] für ausgerichtete
  // Sprachen, marks = Absichtszeichen der Schnellglyphe in der Schrift der Formelsprache
  function coreChoice(m) {
    const F = window.FORMULA, list = (window.CLASS && CLASS.list) || "wizard";
    if (!coreMaps.has(list)) coreMaps.set(list, buildCoreMap(list));
    const vk = list + "#" + F.bookKey();
    if (!visualMaps.has(vk)) visualMaps.set(vk, buildVisualMap(coreMaps.get(list)));
    const X = latinLex();
    const [i, j] = visualMaps.get(vk).get(m.id) || wishPair(m);
    const imp = (X.imp[m.school] || X.imp.universal)[i], ess = X.ess[m.primary][j];
    const letters = [imp[0].toUpperCase(), ess[0].toUpperCase()];
    const lang = F.langOf(m);
    const own = lang.id !== "latin" && F.aligned(lang);
    const ws = own ? [(lang.lex.imp[m.school] || lang.lex.imp.universal)[i], lang.lex.ess[m.primary][j]] : [imp, ess];
    const L = own ? lang : F.get("latin");
    // marks/keys in der eingestellten Darstellung (Original- oder Lateinschrift); keys: Vergleich nach Aussehen (Prüfwerkzeug)
    return { imp, ess, letters, slot: [i, j], marks: ws.map((w) => SCRIPTS.mark(L, w)), keys: ws.map((w) => SCRIPTS.markKey(L, w)) };
  }

  // Formel in der Sprache der Herkunft (lang.js). Die Ziehfolge ist für alle Sprachen gleich,
  // damit die übrigen Texte eines Zaubers nicht von der Formelsprache abhängen.
  function formula(m, r) {
    const F = window.FORMULA, lang = F.langOf(m), X = lang.lex;
    const imp = X.imp[m.school] || X.imp.universal;
    const words = (id) => X.ess[id];
    // Zeile in Umschrift; die rohe Lautschrift merken, aus ihr entsteht das Band in der Originalschrift
    const raw = new Map(), own = SCRIPTS.shownOf(lang) !== SCRIPTS.LIST.latin;
    const ln = (type, vals) => { const l = F.line(lang, type, vals); if (own) raw.set(l, F.line(lang, type, vals, true)); return l; };
    const lines = [];
    const L = m.level;
    const nLines = L === 0 ? 1 : Math.min(1 + Math.ceil(L * 0.75), 8);
    const prim = m.primary;
    // Kernzeile: Verb – Essenz – Gestalt. Gezogen wird immer (Ziehfolge), Latein nimmt die eindeutige Wahl,
    // ausgerichtete Sprachen die Wörter auf denselben Plätzen
    let core = { imp: r.pick(imp), ess: r.pick(words(prim)) };
    let tech = "";
    if (lang.id === "latin") core = coreChoice(m);
    else {
      const c = coreChoice(m), XL = latinLex();
      if (F.aligned(lang)) core = { imp: imp[c.slot[0]], ess: words(prim)[c.slot[1]] };
      tech = F.line(F.get("latin"), "core", { imp: c.imp, ess: c.ess, shape: XL.shape[m.shape.kind] });
    }
    lines.push(ln("core", { imp: core.imp, ess: core.ess, shape: X.shape[m.shape.kind] }));
    const pool = [];
    m.essences.slice(1).forEach((e) => pool.push(ln("pair", { ess2: r.pick(words(e.id)), conj: r.pick(X.conj), ess: r.pick(words(prim)) })));
    if (m.range.tier > 0) pool.push(ln("range", { range: X.range[m.range.tier], rangeTail: r.pick(X.rangeTail) }));
    pool.push(ln("duration", { duration: X.duration[m.duration.kind], durVerb: r.pick(X.durVerb) }));
    for (const s of m.signs) pool.push(ln("sign", { imp: r.pick(imp), dir: X.dir[s.dir === "in" ? "in" : "out"], signObj: r.pick(X.signObj) }));
    if (m.save.type !== "none") pool.push(ln("save", { save: X.save[m.save.type], saveVerb: m.save.harmless ? X.saveOpen : r.pick(X.saveVerb) }));
    if (m.components.M) pool.push(ln("material", { material: r.pick(X.material), materialVerb: r.pick(X.materialVerb) }));
    if (m.sr.yes) pool.push(ln("seal", { seal: r.pick(X.seal), sealVerb: r.pick(X.sealVerb) }));
    for (let i = 0; i < L; i++) pool.push(ln("order", { ordWord: r.pick(X.ordWord), ord: X.ord[i], imp: r.pick(imp) }));
    // Auswahl zufällig, Reihenfolge aber wie im Aufbau (Ordnungen aufsteigend)
    const extra = r.sample(pool, nLines - 1).sort((a, b) => pool.indexOf(a) - pool.indexOf(b));
    lines.push(...extra);
    // Schlusssiegel
    if (L >= 2) lines.push(ln("close", { close: r.pick(X.close) }));
    const sc = SCRIPTS.shownOf(lang);
    const band = !own ? lines.join(" · ").replace(/[!,]/g, "") : lines.map((l) => SCRIPTS.write(lang, raw.get(l))).join(sc.sep);
    return { lines, tech, tone: LX().tone(m), band, script: own ? lang.script : "latin", lang: lang.id };
  }

  function longFormula(m, r) {
    // Ausführliche Fassung mit Wechselrede zwischen Anrufung (A) und Antwort (R)
    const base = formula(m, U.rng(m.seed ^ 0x55)).lines;
    const out = [];
    const F = window.FORMULA, lang = F.langOf(m), X = lang.lex;
    const imp = X.imp[m.school] || X.imp.universal;
    base.forEach((l, i) => {
      out.push({ k: "A", t: l });
      const ess = r.pick(X.ess[m.essences[i % m.essences.length].id]), im = r.pick(imp);
      out.push({ k: "R", t: F.line(lang, "answer", { ess, imp: im, answer: r.chance(0.5) ? r.pick(X.answer) : "" }) });
    });
    return out;
  }

  // ---------------------------------------------------------------------------
  function generate(m, profile) {
    const X = LX();
    profile = profile || { name: X.owner };
    const r = U.rng(m.seed);
    const L = m.level;
    // Reihenfolge der Aufrufe = Reihenfolge der Zufallszahlen; nicht umstellen
    const title_ = title(m, r), epithet_ = X.epithet(m, r), formula_ = formula(m, r);
    const out = {
      title: title_,
      epithet: epithet_,
      formula: formula_,
      gestures: X.gestures(m, r),
      materials: X.materials(m),
      theory: X.theory(m, r),
      structure: X.structure(m),
      steps: X.steps(m, r),
      notes: X.notes(m, r, profile, 99, formula_.lines),
      calibration: X.calibration(m),
      failure: X.failure(m, r),
      counter: X.counter(m),
      practice: X.practice(m, r, profile, 3 + Math.min(L, 6)),
      longFormula: longFormula(m, r),
      learning: X.learning(m, r),
      correspond: X.CORRESPOND[m.primary],
      ink: X.ink(m),
    };
    out.summary = X.summary(m);
    if (m.spell.everyday) {
      // Alltagszauber: Beschreibung statt Kurzfassung, Flavour als erste Randnotiz
      const ev = X.everyday(m, r);
      out.summary = ev.summary;
      if (ev.flavor) out.notes = Object.assign([ev.flavor, ...out.notes], { lead: out.notes.lead });
      out.learning = ev.learning;
    }
    // origin/lang legen nur die Herkunft fest (lang.js) und zählen nicht als handgeschriebener Text
    const { origin, lang, ...custom } = (window.CUSTOM_TEXTS || {})[m.id] || {};
    if (Object.keys(custom).length) Object.assign(out, custom, { custom: true });
    return out;
  }

  window.generateTexts = generate;
  // CORRESPOND & Co.: deutsche Tafeln (Lehrheft, Tafel der Zeit, Legende); LX(lang) für die Buchsprache
  const DE = () => LX("de");
  window.TEXTGEN = {
    coreChoice, quickKey, LX,
    get CORRESPOND() { return DE().CORRESPOND; },
    get MONTHS() { return DE().MONTHS; },
    get SCHOOL_GESTURE() { return DE().SCHOOL_GESTURE; },
    get PIGMENTS() { return DE().PIGMENTS; },
    get INK_METALS() { return DE().INK_METALS; },
  };
})();
