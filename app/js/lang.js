// Formelsprachen: Lexika (data/formula-lang/*.js), Satzmuster, Umschrift je Lesesprache,
// Herkunft der Zauber (Stationen aus dem Profil) und die optionale Hausregel „Entziffern“.
// Der Generator (textgen.js) bestimmt, welche Zeilen eine Formel hat und zieht die Zufallswerte;
// dieses Modul liefert die Wörter und setzt die Zeilen nach dem Muster der Sprache zusammen.
(function () {
  const LANGS = window.FORMULA_LANGS || {};
  const PR = window.PROFILE || {};
  const T = window.THEORY;

  // Schlüssel, die jedes Lexikon füllen muss (geprüft von tools/formula-lang-check.mjs)
  const LEX_KEYS = ["imp", "ess", "shape", "range", "rangeTail", "duration", "durVerb", "conj", "dir", "signObj", "save", "saveOpen", "saveVerb",
    "material", "materialVerb", "seal", "sealVerb", "ordWord", "ord", "close", "answer"];
  const PATTERN_KEYS = ["core", "pair", "range", "duration", "sign", "save", "material", "seal", "order", "close", "answer"];

  // ---------------------------------------------------------------------------
  // Umschrift: Lexika außer Latein speichern eine einfache Lautschrift, die Ausgabe schreibt sie je Lesesprache aus.
  //   sh ʃ · ch tʃ · j dʒ · dj/tj (ägyptisch ḏ/ṯ) · kh x (Bach) · gh ɣ · y j (ja) · v · w · ts · th θ · z (stimmhaftes s) · q · ' (Knacklaut)
  //   Langvokale doppelt: aa ee ii oo uu; Doppel-sh wird beim Ausschreiben einfach
  // ---------------------------------------------------------------------------
  const SPELL = {
    de: [["shsh", "sch"], ["sh", "sch"], ["dj", "dsch"], ["tj", "tsch"], ["ch", "tsch"], ["kh", "ch"], ["ts", "z"], ["ii", "ie"], ["uu", "uh"], ["ei", "ej"], ["j", "dsch"], ["y", "j"], ["v", "w"], ["z", "s"]],
    en: [["shsh", "sh"], ["aa", "ah"], ["ee", "eh"], ["ii", "ee"], ["oo", "oh"], ["uu", "oo"]],
  };
  const spellCache = {};
  function spell(text, read = "de") {
    const rules = SPELL[read] || SPELL.de;
    const key = read + "|" + text;
    if (spellCache[key]) return spellCache[key];
    // längste Treffer zuerst, in einem Durchgang (keine Doppelersetzung)
    const re = spellCache[read] || (spellCache[read] = new RegExp(rules.map((r) => r[0]).sort((a, b) => b.length - a.length).join("|"), "g"));
    const map = Object.fromEntries(rules);
    return (spellCache[key] = text.replace(re, (m) => map[m]));
  }

  // ---------------------------------------------------------------------------
  // Sprachen
  // ---------------------------------------------------------------------------
  const missing = new Set();
  function get(id) {
    if (LANGS[id]) return LANGS[id];
    if (id && !missing.has(id)) {
      missing.add(id);
      console.warn(`Formelsprache „${id}“ fehlt – Formeln dieser Herkunft erscheinen lateinisch.`);
    }
    return LANGS.latin;
  }
  // Ausgerichtet: Lexikon erklärt aligned und hat je Schule und Essenz so viele Wörter wie Latein (Platz i = Bedeutung i)
  const alignedCache = new Map();
  function aligned(lang) {
    if (lang.id === "latin") return true;
    if (!lang.aligned) return false;
    if (alignedCache.has(lang.id)) return alignedCache.get(lang.id);
    const L = LANGS.latin.lex, X = lang.lex;
    const same = (k) => Object.keys(L[k]).every((x) => (X[k][x] || []).length === L[k][x].length);
    const ok = same("imp") && same("ess");
    alignedCache.set(lang.id, ok);
    return ok;
  }
  // Anlaut in der Originalschrift: mehrbuchstabige Anlaute der Lautschrift nach lang.onsets, sonst der erste Buchstabe
  function onset(lang, word) {
    const w = String(word).toLowerCase();
    const o = Object.entries(lang.onsets || {}).sort((a, b) => b[0].length - a[0].length).find(([k]) => w.startsWith(k));
    if (!o) return w[0];
    return o[1] === "" ? onset(lang, w.slice(o[0].length)) : o[1];
  }
  const readLang = () => (window.I18N && I18N.lang.book) || "de";
  // Anzeigename: Profil (Name im Spiel) vor irdischer Bezeichnung. Ein einfacher Name im Profil gilt nur in dessen
  // Sprache (Profiltexte sind einsprachig); in der anderen Sprache steht der Name der Tabelle { de, en } oder des Lexikons.
  function name(id, read = readLang()) {
    const own = (PR.formulaLangNames || {})[id];
    if (own) {
      if (typeof own === "string") { if (!PR.localLang || read === PR.localLang) return own; }
      else if (own[read] || !PR.localLang || read === PR.localLang) return own[read] || own.de;
    }
    const l = LANGS[id];
    return l ? l.name[read] || l.name.de : id;
  }

  // Eine Zeile nach dem Muster der Sprache: {schlüssel} ersetzen, [Teil] entfällt, wenn ein Platzhalter darin leer ist
  // raw: Lautschrift des Lexikons ohne Umschrift in die Lesesprache (für die Originalschrift im Band)
  function line(lang, type, vals, raw = false) {
    let s = lang.patterns[type];
    s = s.replace(/\[([^\]]*)\]/g, (_, part) => (/\{(\w+)\}/.test(part) && [...part.matchAll(/\{(\w+)\}/g)].some((m) => !vals[m[1]]) ? "" : part));
    s = s.replace(/\{(\w+)\}/g, (_, k) => vals[k] || "").replace(/\s+/g, " ").trim();
    if (lang.phonetic !== false && !raw) s = spell(s, readLang());
    return U.cap(s);
  }

  // ---------------------------------------------------------------------------
  // Herkunft: Stationen aus dem Profil, Verteilung des Buches mit fester Quote
  // ---------------------------------------------------------------------------
  const DEFAULT_STATION = { id: "base", label: "", lang: "latin", hand: "", share: 100 };
  const stations = () => (PR.formulaOrigins && PR.formulaOrigins.length ? PR.formulaOrigins : [DEFAULT_STATION]);

  // Punktzahl eines Zaubers für eine Station; −Infinity außerhalb des Gradfensters
  function score(st, m) {
    if (st.levels && (m.level < st.levels[0] || m.level > st.levels[1])) return -Infinity;
    let p = (st.schools || {})[m.school] || 0;
    for (const e of m.essences) p += ((st.essences || {})[e.id] || 0) * e.pct / 100;
    const h = st.hints || {};
    const src = String(m.spell.source || "");
    if ((h.sources || []).some((x) => src.includes(x))) p += 5;
    const nm = String(m.spell.name || "").toLowerCase();
    if ((h.name || []).some((x) => nm.includes(String(x).toLowerCase()))) p += 5;
    return p;
  }

  // Festlegung je Zauber aus custom_texts: origin (Station) oder lang (nur Sprache)
  function fixed(id) {
    const c = (window.CUSTOM_TEXTS || {})[id];
    return c && (c.origin || c.lang) ? c : null;
  }

  // Quoten nach größtem Rest
  function quotas(list, n) {
    const total = list.reduce((a, s) => a + (s.share || 0), 0) || 1;
    const raw = list.map((s) => (n * (s.share || 0)) / total);
    const q = raw.map(Math.floor);
    let rest = n - q.reduce((a, b) => a + b, 0);
    raw.map((x, i) => [x - Math.floor(x), i]).sort((a, b) => b[0] - a[0] || a[1] - b[1]).forEach(([, i]) => { if (rest > 0) (q[i]++, rest--); });
    return q;
  }

  // models: Modelle aller Zauber des Buches → Map id → Station
  function assign(models) {
    const list = stations();
    const byId = Object.fromEntries(list.map((s) => [s.id, s]));
    const out = new Map();
    const q = quotas(list, models.length);
    const free = [];
    for (const m of models) {
      const f = fixed(m.id);
      const st = f && f.origin && byId[f.origin];
      if (st) (out.set(m.id, st), q[list.indexOf(st)]--);
      else free.push(m);
    }
    // gierig nach Vorsprung: Punktzahl minus beste andere Punktzahl; Gleichstand nach Seed
    const pairs = [];
    for (const m of free) {
      const sc = list.map((s) => score(s, m));
      list.forEach((s, i) => {
        if (sc[i] === -Infinity) return;
        const other = Math.max(-1e9, ...sc.filter((_, j) => j !== i).map((x) => (x === -Infinity ? -1e9 : x)));
        pairs.push({ m, i, lead: sc[i] - other, seed: (m.seed ^ (i * 0x9e3779b1)) >>> 0 });
      });
    }
    pairs.sort((a, b) => b.lead - a.lead || a.seed - b.seed);
    for (const p of pairs) {
      if (out.has(p.m.id) || q[p.i] <= 0) continue;
      out.set(p.m.id, list[p.i]), q[p.i]--;
    }
    // Rest (Quoten durch Gradfenster nicht erfüllbar): im Verhältnis der Anteile auf Stationen mit passendem Fenster
    const count = list.map((s) => [...out.values()].filter((x) => x === s).length);
    for (const m of free.filter((x) => !out.has(x.id)).sort((a, b) => (a.seed >>> 0) - (b.seed >>> 0))) {
      let bi = -1, bv = Infinity, bs = -Infinity;
      list.forEach((s, i) => {
        const sc = score(s, m);
        if (sc === -Infinity || !s.share) return;
        const v = (count[i] + 1) / s.share;
        if (v < bv || (v === bv && sc > bs)) (bi = i), (bv = v), (bs = sc);
      });
      const st = bi >= 0 ? list[bi] : best(m);
      out.set(m.id, st);
      if (bi >= 0) count[bi]++;
    }
    return out;
  }

  // beste Station je Zauber, gemerkt je Stationsliste (wechselt mit dem Profil)
  const bestMemo = new WeakMap();
  function best(m) {
    const list = stations();
    const memo = bestMemo.get(list) || bestMemo.set(list, new Map()).get(list);
    if (memo.has(m.id)) return memo.get(m.id);
    let b = list[0], bs = -Infinity;
    for (const s of list) {
      const sc = score(s, m);
      if (sc > bs) (b = s), (bs = sc);
    }
    memo.set(m.id, b);
    return b;
  }

  // Das Buch liefert die App (setBook); Zwischenspeicher je Buchinhalt
  let bookFn = () => [];
  let cacheKey = "", cache = new Map();
  // Buchinhalt mit Schlüssel, gemerkt bis zum Ende der laufenden Aufgabe: Beim Erzeugen aller Texte fragen tausende
  // Aufrufe danach; ändern kann sich das Buch nur in einem späteren Ereignis
  let book = null;
  function bookNow() {
    if (!book) {
      const models = bookFn();
      book = { models, key: models.map((x) => x.id).join("|") };
      Promise.resolve().then(() => (book = null));
    }
    return book;
  }
  function setBook(fn) { bookFn = fn; book = null; cacheKey = ""; }
  // Schlüssel des Buchinhalts, von dem die Sprachzuordnung abhängt (leer bei nur einer Station)
  const bookKey = () => (stations().length === 1 ? "" : bookNow().key);
  function originOf(m) {
    const list = stations();
    if (list.length === 1 && !fixed(m.id)) return list[0];
    const f = fixed(m.id);
    if (f && f.origin) return list.find((s) => s.id === f.origin) || list[0];
    const { models, key } = bookNow();
    if (key !== cacheKey) (cache = assign(models)), (cacheKey = key);
    return cache.get(m.id) || best(m);
  }
  // Sprache eines Zaubers: Festlegung „lang“ vor Station
  function langOf(m) {
    const f = fixed(m.id);
    return get((f && f.lang) || originOf(m).lang || "latin");
  }

  // ---------------------------------------------------------------------------
  // Hausregel „Entziffern“: SG = Basis (beherrscht/verwandt/fremd/tot) + Grad + Zuschlag der Hand
  // ---------------------------------------------------------------------------
  const DEC = { enabled: false, base: { known: 10, related: 15, foreign: 20, dead: 25 }, hands: {}, dead: [], known: ["latin"] };
  const decipherCfg = () => ({ ...DEC, ...(PR.decipher || {}), base: { ...DEC.base, ...((PR.decipher || {}).base || {}) } });
  function relation(langId, known) {
    const c = decipherCfg();
    if (known.includes(langId)) return "known";
    if (c.dead.includes(langId)) return "dead";
    const fam = (LANGS[langId] || {}).family;
    if (fam && known.some((k) => (LANGS[k] || {}).family === fam)) return "related";
    return "foreign";
  }
  // known: beherrschte Sprachen des Charakters (Einstellungen), sonst Profilvorgabe
  function decipher(m, known) {
    const c = decipherCfg();
    if (!c.enabled) return null;
    const lang = langOf(m);
    const st = originOf(m);
    const k = known || c.known;
    const rel = relation(lang.id, k);
    return { dc: c.base[rel] + m.level + ((c.hands || {})[st.hand] || 0), rel, lang: lang.id, name: name(lang.id) };
  }

  window.FORMULA = { LEX_KEYS, PATTERN_KEYS, LANGS, get, aligned, onset, name, line, spell, stations, score, quotas, assign, setBook, bookKey, originOf, langOf, relation, decipher, decipherCfg, readLang };
})();
