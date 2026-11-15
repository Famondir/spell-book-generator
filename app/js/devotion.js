// Andacht für Charaktere mit Gottheit (göttliche Klassen) oder Schutzgottheit (arkane Klassen):
//   Gebete für den Tag (Morgen, Abend, Anlässe, Festtage) nach dem Ablauf im Profil (PROFILE.devotion),
//   Andachtsblatt je Spieltag (A5, Vorderseite Morgen, Rückseite Abend, Lochrand für den Ringordner),
//   Andachtsbuch mit Tagebuch je Spieltag, Rückschau-Bogen (Export/Import) und versiegelte Einträge des Spielleiters.
// Alles deterministisch je Spieltag; Texte nur aus eigenen Bausteinen und den beschreibenden Feldern der Gottheit.
// Speicher je Charakter: spellbook.c.<id>.journal = { days: { [Tageskennung]: { frag, evening, diary, imported } },
//   gm: [{ id, salt, iv, cipher, released?: { day, t, title, text } }] }
window.DEVOTION = (function () {
  const e = U.esc;
  const t = (k, v) => I18N.t(k, v);
  const ARCANE = () => !window.CLASS || CLASS.tradition !== "divine";
  const enabled = () => !!window.DEITY;
  // Buchsprache: Texte der Andacht stehen in TX (de/en); Profiltexte (Feste, Anlässe, Stimme, eigener Schritttext)
  // gibt es nur in der Sprache des Profils, in der anderen Buchsprache gelten die des Profils dieser Sprache
  const BL = () => (I18N.lang.book === "en" ? "en" : "de");
  const foreign = () => !!(window.PROFILE && PROFILE.forLang && BL() !== (PROFILE.localLang || "de"));
  const X = () => TX[BL()];
  const cfg = () => {
    const base = { morning: [], evening: [], obedience: "prayer", feasts: [], occasions: {}, voice: "", tone: "", log: false, ...((window.PROFILE && PROFILE.devotion) || {}) };
    if (!foreign()) return base;
    const o = PROFILE.forLang(BL()).devotion || {};
    return { ...base, feasts: o.feasts || [], occasions: o.occasions || {}, voice: o.voice || "" };
  };
  const TX = {
    de: {
      label: {
        invoke: "Anrufung", fetchBook: "Das Buch holen", obedience: "Andacht", prepare: "Vorbereitung", returnBook: "Das Buch zurücksenden",
        studyBook: "Das Buch zum Studium", review: "Rückschau", keep: "Bitte ums Behalten", close: "Schluss", feast: "Festtag",
      },
      maskPair: "Die helle Seite deiner Maske hat den Tag gesehen, die dunkle sieht die Nacht.",
      pair: [
        "Am Morgen das Licht, am Abend der Schatten – beides kommt von dir.",
        "Der Tag hat gesprochen, die Nacht schweigt; du hörst beide.",
        "Was der Tag aufgedeckt hat, deckt die Nacht zu; beides ist dein.",
      ],
      fetchBook: "Ich hole das Buch aus seiner Verwahrung und schlage es auf.",
      returnBook: "Ich schließe das Buch und gebe es zurück in seine Verwahrung.",
      studyBook: "Ich hole das Buch noch einmal – nicht um zu wirken, sondern um zu lernen.",
      fragment: ["Ich schreibe, was nicht vollendet werden soll: ein Bruchstück für den, der nach mir liest.", "Zum Abschluss wirke ich eine Formel, damit das Geschriebene nicht nur Tinte bleibt."],
      obey: ["Ich halte inne und richte meine Gedanken auf dich.", "Ich schweige einen Atemzug lang und höre.", "Ich lege meine Hände still und denke an dich."],
      prepArcane: ["Lass mich lesen, was geschrieben steht, und behalten, was ich heute brauche.", "Ordne meine Gedanken, wie die Zeichen im Kreis geordnet sind.", "Mach meinen Blick klar für die Formeln dieses Tages."],
      prepDivine: ["Gib mir heute, was ich brauche, und nicht mehr.", "Lass mich empfangen, was du mir heute anvertraust.", "Fülle meine Hände für diesen Tag."],
      keep: ["Lass mich morgen noch wissen, was ich heute gelernt habe.", "Nimm mir nicht, was ich heute verstanden habe.", "Was ich heute gelernt habe, lass mich behalten."],
      night: ["Behüte die Nacht.", "Lass den Schlaf ruhig sein.", "Wache, während ich schlafe."],
      reviewFixed: ["Was ich heute gewirkt habe, lege ich vor dich.", "Was ungenutzt blieb, gebe ich dir zurück."],
      thanks: (name, n, more) => `Ich danke dir für ${name}${n > 1 ? ` (${n}-mal)` : ""}${more ? ` und ${more === 1 ? "eine weitere Formel" : more + " weitere Formeln"}` : ""}.`,
      unusedCast: (k) => `${k === 1 ? "Eine Formel blieb" : k + " Formeln blieben"} ungenutzt; ich gebe sie dir zurück.`,
      rest: ["Heute habe ich nichts gewirkt.", "Heute ruhten meine Hände."],
      unusedRest: (k) => (k ? `Die ${k === 1 ? "Formel, die ich gelesen habe, gebe ich" : k + " Formeln, die ich gelesen habe, gebe ich"} dir ungenutzt zurück.` : "Die Formeln, die ich gelesen habe, gebe ich dir ungenutzt zurück."),
      swapped: (name) => `Eine Formel war nicht die, die ich gelesen zu haben glaubte: ${name}. Du weißt, warum.`,
      morning: "Morgengebet", evening: "Abendgebet",
      today: (name) => `Heute ist ${name}.`,
      occTitle: { decipher: "Vor dem Entziffern", failedRoll: "Nach einem misslungenen Wurf", banish: "Vor dem Bannen", copy: "Beim Abschreiben", dead: "Für die Toten", feast: "An Festtagen" },
      occ: (v) => ({
        decipher: [`${v.call} öffne mir die alte Schrift.`, "Lass mich lesen, was eine andere Hand geschrieben hat,", "und verstehen, was sie gemeint hat."],
        failedRoll: [`${v.name}, ich habe falsch gelesen.`, "Was ich heute in der Hand halte, ist nicht, was ich wollte.", "Lehre mich, mit dem zu wirken, was ich habe."],
        banish: [`${v.call} schließe, was nicht offen sein darf.`, "Was hierher nicht gehört, schicke zurück.", v.dual || "Gib meinem Kreis Bestand."],
        copy: [`${v.call} führe meine Feder.`, "Kein Zeichen zu viel, keines zu wenig.", "Was ich abschreibe, soll halten wie das Original."],
        dead: [`${v.call} nimm sie auf, die vor mir gegangen sind.`, "Was sie wussten, ist nicht verloren, solange einer liest.", "Ich erinnere mich an sie, so gut ich kann."],
        feast: [`${v.call} heute ist dein Tag.`, v.praise, "Ich halte inne und danke dir."],
      }),
      optional: "(wenn Zeit bleibt)", castEnd: "Zum Abschluss gewirkt:", fragK: "Formelfragment",
      log: { title: "Protokoll", diary: "Tagebuch", prepared: "Vorbereitet", cast: "Gewirkt", load: "Auslastung", formulas: "Formeln", unused: "Ungenutzt", swapped: "Vertauscht", devotion: "Andacht", close: "Abschluss",
        prepVal: (n, k) => `${n} · ab Grad 1: ${k}`, castVal: (a, b) => `${a} ${a === 1 ? "Wirkung" : "Wirkungen"} · ${b} ${b === 1 ? "Formel" : "Formeln"}`, fragVal: (n) => `Formelfragment aus „${n}“` },
      rv: { real: "Echtes Datum", deity: "Gottheit", voice: "Stimme des Tagebuchs", log: "Protokoll", prepared: "Vorbereitet", cast: "Gewirkt", unused: "Ungenutzt", swapped: "Vertauscht",
        morning: "Morgenandacht", held: "gehalten", closing: ", zum Abschluss ", none: "nicht vermerkt", vespers: "Abendgebet", devotion: "Andacht",
        frag: (n, t) => `Formelfragment aus ${n} („${t}“):`, gen: "Abendgebet (erzeugt)", last: "Letzte Einträge", answer: "Antwort",
        howto: "Den Tagebucheintrag (darf auch ein spontanes Gebet enthalten) in das JSON unten schreiben, dann in der App importieren." },
      gm: { released: "freigegeben", sealed: "versiegelt", cols: "| Kennung | Status | Ingame | Datum |" },
    },
    en: {
      label: {
        invoke: "Invocation", fetchBook: "Fetching the book", obedience: "Devotion", prepare: "Preparation", returnBook: "Returning the book",
        studyBook: "The book for study", review: "Review", keep: "Prayer to remember", close: "Closing", feast: "Feast day",
      },
      maskPair: "The bright side of your mask has seen the day; the dark side sees the night.",
      pair: [
        "Light in the morning, shadow in the evening – both come from you.",
        "The day has spoken, the night is silent; you hear them both.",
        "What the day has uncovered, the night covers; both are yours.",
      ],
      fetchBook: "I take the book from its keeping and open it.",
      returnBook: "I close the book and give it back into its keeping.",
      studyBook: "I take the book once more – not to cast, but to learn.",
      fragment: ["I write what is not meant to be finished: a fragment for whoever reads after me.", "To close, I cast one formula, so that what is written is more than ink."],
      obey: ["I pause and turn my thoughts to you.", "I keep silence for one breath and listen.", "I lay my hands still and think of you."],
      prepArcane: ["Let me read what is written, and keep what I need today.", "Set my thoughts in order, as the signs in the circle are set in order.", "Make my eye clear for the formulas of this day."],
      prepDivine: ["Give me today what I need, and no more.", "Let me receive what you entrust to me today.", "Fill my hands for this day."],
      keep: ["Let me still know tomorrow what I have learned today.", "Do not take from me what I have understood today.", "What I have learned today, let me keep."],
      night: ["Watch over the night.", "Let sleep be quiet.", "Keep watch while I sleep."],
      reviewFixed: ["What I have cast today, I lay before you.", "What went unused, I give back to you."],
      thanks: (name, n, more) => `I thank you for ${name}${n > 1 ? ` (${n} times)` : ""}${more ? ` and ${more === 1 ? "one other formula" : more + " other formulas"}` : ""}.`,
      unusedCast: (k) => `${k === 1 ? "One formula remained" : k + " formulas remained"} unused; I give ${k === 1 ? "it" : "them"} back to you.`,
      rest: ["Today I have cast nothing.", "Today my hands were at rest."],
      unusedRest: (k) => (k ? `${k === 1 ? "The formula I read, I give" : "The " + k + " formulas I read, I give"} back to you unused.` : "The formulas I read, I give back to you unused."),
      swapped: (name) => `One formula was not the one I believed I had read: ${name}. You know why.`,
      morning: "Morning prayer", evening: "Evening prayer",
      today: (name) => `Today is ${name}.`,
      occTitle: { decipher: "Before deciphering", failedRoll: "After a failed attempt", banish: "Before banishing", copy: "While copying", dead: "For the dead", feast: "On feast days" },
      occ: (v) => ({
        decipher: [`${v.call} open the old writing to me.`, "Let me read what another hand has written,", "and understand what it meant."],
        failedRoll: [`${v.name}, I have read wrongly.`, "What I hold in my hand today is not what I wanted.", "Teach me to work with what I have."],
        banish: [`${v.call} close what must not stand open.`, "Send back what does not belong here.", v.dual || "Give my circle lasting strength."],
        copy: [`${v.call} guide my quill.`, "No sign too many, none too few.", "What I copy shall hold as the original holds."],
        dead: [`${v.call} take them in, who have gone before me.`, "What they knew is not lost while one still reads.", "I remember them as well as I can."],
        feast: [`${v.call} today is your day.`, v.praise, "I pause and give you thanks."],
      }),
      optional: "(if time allows)", castEnd: "Cast at the close:", fragK: "Formula fragment",
      log: { title: "Log", diary: "Journal", prepared: "Prepared", cast: "Cast", load: "Utilisation", formulas: "Formulas", unused: "Unused", swapped: "Swapped", devotion: "Devotion", close: "Closing",
        prepVal: (n, k) => `${n} · from degree 1: ${k}`, castVal: (a, b) => `${a} ${a === 1 ? "casting" : "castings"} · ${b} ${b === 1 ? "formula" : "formulas"}`, fragVal: (n) => `Formula fragment from “${n}”` },
      rv: { real: "Real date", deity: "Deity", voice: "Voice of the journal", log: "Log", prepared: "Prepared", cast: "Cast", unused: "Unused", swapped: "Swapped",
        morning: "Morning devotion", held: "held", closing: ", closing with ", none: "not recorded", vespers: "Evening prayer", devotion: "Devotion",
        frag: (n, t) => `Formula fragment from ${n} (“${t}”):`, gen: "Evening prayer (generated)", last: "Latest entries", answer: "Reply",
        howto: "Write the journal entry (which may also contain a spontaneous prayer) into the JSON below, then import it in the app." },
      gm: { released: "released", sealed: "sealed", cols: "| ID | Status | In-game | Date |" },
    },
  };
  let ctx = null, api = null;

  // --- Speicher -----------------------------------------------------------------------
  const KEY = () => CHARS.key("journal");
  function load() {
    try {
      const v = localStorage.getItem(KEY());
      const j = v ? JSON.parse(v) : {};
      return { days: j.days && typeof j.days === "object" ? j.days : {}, gm: Array.isArray(j.gm) ? j.gm : [] };
    } catch (_) {
      return { days: {}, gm: [] };
    }
  }
  let J = load();
  function save() {
    try {
      localStorage.setItem(KEY(), JSON.stringify(J));
    } catch (_) { /* privater Modus o. Ä. */ }
  }
  const rec = (id) => (J.days[id] = J.days[id] || {});

  // --- Spieltage ----------------------------------------------------------------------
  const days = () => (api ? api.dayList() : []);
  const dayById = (id) => days().find((d) => d.id === id) || null;
  const currentDay = () => days().find((d) => d.current) || null;
  const realDate = (iso) => new Date(iso).toLocaleDateString(I18N.lang.book === "de" ? "de-DE" : "en-GB", { day: "numeric", month: "long", year: "numeric" });
  const dateText = (d) => (d ? d.ingameText || realDate(d.start || d.id) : "");
  function feastOf(d) {
    const ig = d && d.meta && d.meta.ingame;
    if (!ig || !ig.d) return null;
    return cfg().feasts.find((f) => +f.d === +ig.d && +f.m === +ig.m) || null;
  }
  const spellName = (id) => {
    const x = ctx && ctx.byId.get(id);
    return x ? RULES.name(x.s) : String(id);
  };
  // Wirken je Zauber an einem Tag (cast − uncast), ungenutzte vorbereitete Zauber, vertauschte (falls protokolliert)
  function dayFacts(d) {
    const casts = new Map();
    for (const x of (d && d.events) || []) {
      if (x.ev === "cast") casts.set(x.id, (casts.get(x.id) || 0) + 1);
      if (x.ev === "uncast") casts.set(x.id, (casts.get(x.id) || 0) - 1);
    }
    for (const [k, v] of casts) if (v <= 0) casts.delete(k);
    const level = (id) => {
      const x = ctx && ctx.byId.get(id);
      return x ? (x.s.everyday ? 0 : ctx.model(x).level) : 0;
    };
    const unused = ((d && d.prepared) || []).filter((id) => level(id) > 0 && !casts.has(id));
    const swapped = ((d && d.events) || []).filter((x) => x.ev === "swap").map((x) => x.id);
    const held = ((d && d.events) || []).filter((x) => x.ev === "devotion").pop() || null;
    const vespers = ((d && d.events) || []).some((x) => x.ev === "vespers");
    return { casts, unused, swapped, held, vespers, prepared: (d && d.prepared) || [] };
  }

  // --- Gebete für den Tag ---------------------------------------------------------------
  const lines = (s) => String(s).split("\n").map((x) => x.trim()).filter(Boolean);
  const DEFAULT = {
    morning: [{ step: "invoke" }, { step: "prepare" }, { step: "close" }],
    evening: [{ step: "invoke" }, { step: "review" }, { step: "keep" }, { step: "close" }],
  };
  // Abend: zwei Gegensätze wie der Doppelvers am Morgen; ein zweifarbiges Maskensymbol gibt die eigene Fassung
  function eveningPair(v) {
    if (/mask/i.test((v.d && v.d.symbol) || "") && /two|half|black|white/i.test(v.d.symbol)) return X().maskPair;
    return v.r.pick(X().pair);
  }
  // Ein Schritt → { step, label, lines, optional }
  function step(s, v, part, d, frag) {
    const r = v.r;
    const own = s.text && !foreign() ? lines(s.text) : null;
    const T = X();
    const out = (ls) => ({ step: s.step, label: T.label[s.step] || s.step, lines: own || ls, optional: !!s.optional });
    switch (s.step) {
      case "invoke":
        return out(part === "morning"
          ? [v.call, v.praise, ...(v.dual ? [v.dual] : [])]
          : [v.call, eveningPair(v), ...(v.dual ? [v.dual] : [])]);
      case "fetchBook":
        return out([T.fetchBook]);
      case "returnBook":
        return out([T.returnBook]);
      case "studyBook":
        return out([T.studyBook]);
      case "obedience":
        return out(frag || cfg().obedience === "fragment"
          ? T.fragment
          : [r.pick(T.obey)]);
      case "prepare":
        return out([ARCANE()
          ? r.pick(T.prepArcane)
          : r.pick(T.prepDivine)]);
      case "review":
        return out(review(d, r));
      case "keep":
        return out([r.pick(T.keep)]);
      case "close":
        return out(part === "morning" ? [v.close, v.amen] : [r.pick(T.night), v.amen]);
      default:
        return out([]);
    }
  }
  // Rückschau des Abends aus dem Protokoll; ohne Tag (Lehrheft) als feste Form
  function review(d, r) {
    const T = X();
    if (!d) return T.reviewFixed;
    const f = dayFacts(d);
    const out = [];
    if (f.casts.size) {
      const [top, n] = [...f.casts].sort((a, b) => b[1] - a[1] || String(a[0]).localeCompare(String(b[0])))[0];
      const more = f.casts.size - 1;
      out.push(T.thanks(spellName(top), n, more));
      if (f.unused.length) out.push(T.unusedCast(f.unused.length));
    } else {
      out.push(r.pick(T.rest));
      out.push(T.unusedRest(f.unused.length));
    }
    if (f.swapped.length) out.push(T.swapped(spellName(f.swapped[0])));
    return out;
  }
  function prayer(part, d) {
    const v = PRAYER.voice(window.DEITY, (d ? d.id : "form") + "|" + part);
    const list = (cfg()[part] && cfg()[part].length ? cfg()[part] : DEFAULT[part]).filter((s) => s && s.step).slice();
    const frag = part === "morning" && d ? fragment(d) : null;
    // Andachtsform „Formelfragment“ ohne eigenen Schritt im Ablauf: Andacht vor der Vorbereitung einfügen
    if (part === "morning" && cfg().obedience === "fragment" && !list.some((s) => s.step === "obedience")) {
      const at = list.findIndex((s) => s.step === "prepare");
      list.splice(at < 0 ? Math.min(1, list.length) : at, 0, { step: "obedience" });
    }
    const steps = list.map((s) => step(s, v, part, d, frag));
    // Festtag: nach der Anrufung
    const fe = part === "morning" ? feastOf(d) : null;
    if (fe) {
      const at = steps.findIndex((s) => s.step === "invoke") + 1;
      steps.splice(at, 0, { step: "feast", label: fe.name, lines: [X().today(fe.name), ...(fe.text ? lines(fe.text) : occasion("feast").lines.slice(1))] });
    }
    return { part, title: part === "morning" ? X().morning : X().evening, feast: fe, steps, frag };
  }
  const morning = (d) => prayer("morning", d);
  const evening = (d) => prayer("evening", d);

  // Anlass-Gebete: höchstens vier Zeilen, mit Anrede der Gottheit; das Profil kann sie ersetzen
  const OCCASIONS = ["decipher", "failedRoll", "banish", "copy", "dead", "feast"];
  function occasion(kind) {
    const v = PRAYER.voice(window.DEITY, "occasion|" + kind);
    const own = cfg().occasions && cfg().occasions[kind];
    const gen = X().occ(v)[kind] || [];
    return { kind, title: X().occTitle[kind] || kind, lines: (own ? lines(own) : gen).slice(0, 4) };
  }

  // --- Formelfragment -----------------------------------------------------------------------
  // Zauber aus dem Buch, je Spieltag fest gespeichert. Bevorzugt Zauber, die noch nie oder am längsten nicht
  // Fragment waren: erst alle unbenutzten, dann das ältere Drittel.
  function fragmentSpell(d) {
    if (!ctx) return null;
    const book = [...ctx.book()].map((id) => ctx.byId.get(id)).filter(Boolean);
    if (!book.length) return null;
    const have = J.days[d.id] && J.days[d.id].frag;
    if (have && ctx.byId.get(have) && ctx.book().has(have)) return ctx.byId.get(have);
    const last = new Map();
    for (const [did, r] of Object.entries(J.days)) if (r.frag && did < d.id && (!last.has(r.frag) || last.get(r.frag) < did)) last.set(r.frag, did);
    const order = book.slice().sort((a, b) => (last.get(a.s.id) || "").localeCompare(last.get(b.s.id) || "") || a.s.id.localeCompare(b.s.id));
    const fresh = order.filter((x) => !last.has(x.s.id));
    const pool = fresh.length ? fresh : order.slice(0, Math.max(1, Math.ceil(order.length / 3)));
    const ig = (d.meta && d.meta.ingame) || {};
    const pick = U.rng(`${d.id}|${ig.d || ""}.${ig.m || ""}.${ig.y || ""}|frag`).pick(pool);
    rec(d.id).frag = pick.s.id;
    save();
    return pick;
  }
  function fragment(d) {
    if (cfg().obedience !== "fragment" || !d) return null;
    const x = fragmentSpell(d);
    if (!x) return null;
    const m = ctx.model(x);
    const tx = generateTexts(m, { name: ctx.owner ? ctx.owner() : "" });
    const r = U.rng(d.id + "|frag-cut|" + x.s.id);
    const all = tx.formula.lines;
    const core = all[0];
    const next = all[1] || all[0];
    const w = next.replace(/[!.,]+$/, "").split(" ");
    let cut;
    if (w.length < 2) cut = w[0].slice(0, Math.max(2, Math.ceil(w[0].length / 2))) + "—";
    else {
      const k = r.int(1, w.length - 1);
      cut = w.slice(0, k).join(" ") + (r.chance(0.5) ? " —" : " " + w[k].slice(0, Math.max(1, Math.ceil(w[k].length / 2))) + "—");
    }
    return { id: x.s.id, title: tx.title, name: RULES.name(x.s), lines: [core, cut], svg: partCircle(m, r) };
  }
  // Teilkreis: Außenring ohne Schrift, Kernsiegel und Essenzring; der nächste Ring nur angesetzt
  function partCircle(m, r) {
    const svg = renderCircle(m, { layers: ["outer", "core", "essence"], text: "", cls: "dv-circle", zoom: ((window.CIRCLE_R || {}).outer || 246) + 8 });
    const R = (window.CIRCLE_R || {}).order || 184;
    const a0 = r.int(0, 359), a1 = a0 + r.int(60, 120);
    const pt = (a) => [R * Math.sin((a * Math.PI) / 180), -R * Math.cos((a * Math.PI) / 180)].map((n) => Math.round(n * 10) / 10);
    const [x0, y0] = pt(a0), [x1, y1] = pt(a1);
    return svg.replace(/<\/svg>$/, `<path class="dv-stub" d="M${x0},${y0} A${R},${R} 0 0 1 ${x1},${y1}"/></svg>`);
  }

  // --- Seiten ------------------------------------------------------------------------------
  const stepHTML = (s) => `<div class="dv-step${s.optional ? " opt-step" : ""}"><h4>${e(s.label)}${s.optional ? ` <span class="dv-opt">${X().optional}</span>` : ""}</h4><p>${s.lines.map(e).join("<br>")}</p></div>`;
  function fragHTML(f) {
    return f ? `<div class="dv-frag"><figure>${f.svg}</figure><div><div class="dv-frag-k">${X().fragK} · ${e(f.name)}</div><b>${e(f.title)}</b><p class="dv-formula">${f.lines.map(e).join("<br>")}</p></div></div>` : "";
  }
  // Vollständiges Gebet (zum Lesen am Tisch, Reiter „Heute“)
  const fullHTML = (P) => P.steps.map((s) => (s.step === "obedience" ? stepHTML(s) + fragHTML(P.frag) : stepHTML(s))).join("");
  // Das ganze Gebet steht als feste Form im Lehrheft; auf dem Blatt nur die Anrufung und, was zum Tag gehört (Festtag)
  const invokeHTML = (P) => P.steps.filter((s) => s.step === "invoke").map((s) => `<p class="dv-invoke">${s.lines.map(e).join("<br>")}</p>`).join("") + P.steps.filter((s) => s.step === "feast").map(stepHTML).join("");
  function castField(d) {
    const held = d ? dayFacts(d).held : null;
    const cast = held && held.x && held.x.cast ? spellName(held.x.cast) : "";
    return `<div class="dv-fields"><div>${X().castEnd} <span class="dv-line">${e(cast)}</span></div></div>`;
  }
  // Vorderseite: mit Fragment Verweis auf die feste Form und großer Kreis; ohne Fragment das ganze Gebet
  function morningHTML(d, P) {
    if (!P.frag) return fullHTML(P) + castField(d);
    const f = P.frag;
    return `${invokeHTML(P)}<div class="dv-frag-big"><div class="dv-frag-k">${X().fragK} · ${e(f.name)}</div><b>${e(f.title)}</b><figure>${f.svg}</figure><p class="dv-formula">${f.lines.map(e).join("<br>")}</p></div>${castField(d)}`;
  }
  const ruled = (n) => `<div class="dv-lines">${"<i></i>".repeat(n)}</div>`;
  const paras = (s) => String(s).split(/\n\s*\n/).map((p) => `<p>${e(p.trim()).replace(/\n/g, "<br>")}</p>`).join("");
  // Protokoll (Profil devotion.log): nüchterne Zahlen des Tages zum Auswerten
  function logHTML(d) {
    const f = dayFacts(d);
    const slots = f.prepared.filter((id) => { const x = ctx && ctx.byId.get(id); return x && !x.s.everyday && ctx.model(x).level > 0; }).length;
    const casts = [...f.casts].sort((a, b) => b[1] - a[1] || String(a[0]).localeCompare(String(b[0])));
    const total = casts.reduce((a, [, n]) => a + n, 0);
    const names = (ids) => ids.map((id) => e(spellName(id))).join(", ") || "–";
    const held = f.held;
    const L = X().log;
    const rows = [
      [L.prepared, L.prepVal(f.prepared.length, slots)],
      [L.cast, L.castVal(total, casts.length)],
      [L.load, slots ? `${Math.round((100 * (slots - f.unused.length)) / slots)} %` : "–"],
      [L.formulas, casts.map(([id, n]) => `${e(spellName(id))} ×${n}`).join(", ") || "–"],
      [L.unused, names(f.unused)],
      ...(f.swapped.length ? [[L.swapped, names(f.swapped)]] : []),
      ...(J.days[d.id] && J.days[d.id].frag ? [[L.devotion, L.fragVal(e(spellName(J.days[d.id].frag)))]] : []),
      [L.close, held && held.x && held.x.cast ? e(spellName(held.x.cast)) : "–"],
    ];
    return `<table class="dv-log">${rows.map(([k, v]) => `<tr><th>${k}</th><td>${v}</td></tr>`).join("")}</table>`;
  }
  const releasedOn = (id) => J.gm.filter((g) => g.released && g.released.day === id);
  function gmHTML(id) {
    return releasedOn(id).map((g) => `<div class="dv-gm"><h4>${e(g.released.title || g.id)}</h4>${paras(g.released.text || "")}</div>`).join("");
  }
  // Rückseite: Verweis auf die feste Form (oder ein früher eigens geschriebenes Abendgebet), Protokoll, Tagebuch
  function eveningHTML(d, P, lined = 22) {
    const r = (d && J.days[d.id]) || {};
    const log = d && cfg().log;
    return `${r.evening ? `<div class="dv-step dv-own">${paras(r.evening)}</div>` : invokeHTML(P)}
      ${log ? `<div class="dv-step"><h4>${X().log.title}</h4>${logHTML(d)}</div>` : ""}
      <div class="dv-step dv-diary"><h4>${X().log.diary}</h4>${r.diary ? paras(r.diary) : ruled(log ? lined - 6 : lined)}</div>
      ${d ? gmHTML(d.id) : ""}`;
  }
  const head = (d, P) => `<div class="dv-head"><div class="dv-date">${e(dateText(d))}</div>${P.feast ? `<div class="dv-feast">${e(P.feast.name)}</div>` : ""}<h3>${e(P.title)}</h3></div>`;
  // Andachtsblatt eines Tages: zwei A5-Seiten (Vorderseite ungerade, Rückseite gerade → Lochrand vorn links, hinten rechts)
  function sheetPages(d, no = 1) {
    const M = morning(d), E = evening(d);
    return [
      { cls: "devotion-page sheet-front bind", running: `${I18N.b("dv.sheet")} · ${dateText(d)}`, no, html: head(d, M) + morningHTML(d, M) },
      { cls: "devotion-page sheet-back bind", running: `${I18N.b("dv.sheet")} · ${dateText(d)}`, no: no + 1, html: head(d, E) + eveningHTML(d, E) },
    ];
  }
  // ganzes Gebet als eine Seite (Lesen am Tisch)
  const prayerPage = (d, P) => ({ cls: "devotion-page", running: `${P.title} · ${dateText(d)}`, no: 1, html: head(d, P) + fullHTML(P) });
  const bookDays = () => days().filter((d) => !d.meta.test).sort((a, b) => (a.start < b.start ? -1 : 1));
  // Andachtsbuch: Titelseite, dann je Spieltag eine Doppelseite (links Morgen, rechts Abend), älteste zuerst
  function bookPages() {
    const owner = ctx && ctx.owner ? ctx.owner() : "";
    const pages = [{ cls: "devotion-page title-page dv-title", running: "", html: `<div class="tp"><h1>${e(I18N.b("dv.bookTitle"))}</h1><div class="tp-owner">${e(owner)}</div><div class="tp-sub">${e(window.DEITY ? window.DEITY.name : "")}</div></div>` }];
    for (const d of bookDays()) {
      const M = morning(d), E = evening(d);
      pages.push({ cls: "devotion-page dv-morning break-before", running: dateText(d), html: head(d, M) + morningHTML(d, M), day: d.id });
      pages.push({ cls: "devotion-page dv-evening flow", running: dateText(d), html: head(d, E) + eveningHTML(d, E), day: d.id });
    }
    pages.forEach((p, i) => (p.no = i + 1));
    return pages;
  }

  // --- Rückschau: Export und Import ---------------------------------------------------------
  const slug = (s) => String(s || "").toLowerCase().replace(/[^a-z0-9äöüß]+/g, "-").replace(/^-|-$/g, "");
  function reviewText(d) {
    const ch = CHARS.current();
    const f = dayFacts(d);
    const E = evening(d);
    const prev = bookDays().filter((x) => x.start < d.start && J.days[x.id] && J.days[x.id].diary).slice(-3);
    const fr = fragment(d);
    const R = X().rv;
    const md = [
      `# ${I18N.b("dv.review")} – ${ch.name} – ${dateText(d)}`,
      "",
      `- ${R.real}: ${realDate(d.start)}`,
      `- ${R.deity}: ${window.DEITY ? window.DEITY.name : "–"}`,
      `- ${R.voice}: ${cfg().voice || "–"}`,
      "",
      `## ${R.log}`,
      `- ${R.prepared}: ${f.prepared.map(spellName).join(", ") || "–"}`,
      `- ${R.cast}: ${[...f.casts].map(([id, n]) => spellName(id) + (n > 1 ? " ×" + n : "")).join(", ") || "–"}`,
      `- ${R.unused}: ${f.unused.map(spellName).join(", ") || "–"}`,
      ...(f.swapped.length ? [`- ${R.swapped}: ${f.swapped.map(spellName).join(", ")}`] : []),
      `- ${R.morning}: ${f.held ? R.held + (f.held.x && f.held.x.cast ? R.closing + spellName(f.held.x.cast) : "") : R.none}`,
      `- ${R.vespers}: ${f.vespers ? R.held : R.none}`,
      "",
      ...(fr ? [`## ${R.devotion}`, R.frag(fr.name, fr.title), "", ...fr.lines.map((l) => "> " + l), ""] : []),
      `## ${R.gen}`,
      ...E.steps.flatMap((s) => s.lines),
      "",
      `## ${R.last}`,
      ...(prev.length ? prev.flatMap((x) => [`### ${dateText(x)}`, J.days[x.id].diary, ""]) : ["–", ""]),
      `## ${R.answer}`,
      R.howto,
      "",
      `<!-- devotion-review ${JSON.stringify({ character: ch.name, day: d.id, date: dateText(d), diary: "" })} -->`,
      "",
    ];
    return md.join("\n");
  }
  function download(name, text, type = "text/markdown") {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([text], { type }));
    a.download = name;
    a.click();
  }
  function exportReview(id) {
    const d = dayById(id);
    if (!d) return;
    const ig = d.meta.ingame;
    const date = ig && ig.d ? `${String(ig.y || "").replace(/\D+/g, "") || "x"}-${(+ig.m || 0) + 1}-${ig.d}` : d.start.slice(0, 10);
    download(`rueckschau-${slug(CHARS.current().name)}-${date}.md`, reviewText(d));
  }
  // Text der Datei → { day, evening, diary } (Markdown mit Kommentar oder reines JSON)
  function parseReview(text) {
    const m = String(text).match(/<!--\s*devotion-review\s+([\s\S]*?)\s*-->/);
    const data = JSON.parse(m ? m[1] : text);
    if (!data || typeof data !== "object" || !data.day) throw new Error(t("dv.reviewBad"));
    return data;
  }
  // Ergebnis: "ok" | "unknown" | "cancel"
  function importReview(text, ask = (msg) => confirm(msg)) {
    const data = parseReview(text);
    const d = dayById(data.day);
    if (!d) return "unknown";
    const r = J.days[d.id] || {};
    const fields = ["evening", "diary"].filter((k) => typeof data[k] === "string" && data[k].trim());
    if (fields.some((k) => r[k] && r[k] !== data[k]) && !ask(t("dv.reviewOverwrite", { date: dateText(d) }))) return "cancel";
    const w = rec(d.id);
    for (const k of fields) w[k] = data[k].trim();
    w.imported = new Date().toISOString();
    save();
    return "ok";
  }
  function setText(id, field, text) {
    const w = rec(id);
    if (text && text.trim()) w[field] = text.trim();
    else delete w[field];
    save();
  }

  // --- Einträge des Spielleiters: verschlüsselt (PBKDF2 + AES-GCM), Freigabe per Code -----------------------
  const ITER = 200000;
  const b64 = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf)));
  const unb64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
  const normCode = (c) => String(c || "").trim().toLowerCase().replace(/\s+/g, "-");
  const hasCrypto = () => !!(window.crypto && crypto.subtle);
  async function keyOf(code, salt) {
    const base = await crypto.subtle.importKey("raw", new TextEncoder().encode(normCode(code)), "PBKDF2", false, ["deriveKey"]);
    return crypto.subtle.deriveKey({ name: "PBKDF2", salt, iterations: ITER, hash: "SHA-256" }, base, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
  }
  // auch vom Werkzeug tools/seal-entries.html (gleiches Verfahren) und von den Tests genutzt
  async function seal(entry, code) {
    const salt = crypto.getRandomValues(new Uint8Array(16)), iv = crypto.getRandomValues(new Uint8Array(12));
    const data = new TextEncoder().encode(JSON.stringify({ title: entry.title || "", text: entry.text || "" }));
    const cipher = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, await keyOf(code, salt), data);
    return { id: String(entry.id), salt: b64(salt), iv: b64(iv), cipher: b64(cipher) };
  }
  async function open(entry, code) {
    try {
      const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv: unb64(entry.iv) }, await keyOf(code, unb64(entry.salt)), unb64(entry.cipher));
      return JSON.parse(new TextDecoder().decode(plain));
    } catch (_) {
      return null; // falscher Code: das GCM-Merkmal passt nicht
    }
  }
  const sealed = () => J.gm.filter((g) => !g.released);
  // Spielerdatei importieren: neue Einträge anfügen, noch versiegelte gleicher Kennung ersetzen, freigegebene behalten
  function importGM(data) {
    const list = (data && (data.entries || data)) || [];
    if (!Array.isArray(list) || list.some((x) => !x || !x.id || !x.cipher || !x.iv || !x.salt)) throw new Error(t("dv.gmBad"));
    let added = 0;
    for (const x of list) {
      const i = J.gm.findIndex((g) => g.id === String(x.id));
      const entry = { id: String(x.id), salt: x.salt, iv: x.iv, cipher: x.cipher };
      if (i < 0) (J.gm.push(entry), added++);
      else if (!J.gm[i].released) J.gm[i] = entry;
    }
    save();
    return added;
  }
  // Code gegen alle versiegelten Einträge prüfen; Treffer wird dem laufenden Spieltag zugeordnet
  async function release(code) {
    if (!hasCrypto()) throw new Error(t("dv.noCrypto"));
    for (const g of sealed()) {
      const plain = await open(g, code);
      if (!plain) continue;
      const day = currentDay();
      g.released = { day: day ? day.id : null, t: new Date().toISOString(), title: plain.title || g.id, text: plain.text || "" };
      save();
      if (api) api.record("release", g.id, null);
      return g;
    }
    return null;
  }
  function statusText() {
    const rows = J.gm.map((g) => {
      const d = g.released && dayById(g.released.day);
      return `| ${g.id} | ${g.released ? X().gm.released : X().gm.sealed} | ${g.released ? (d ? dateText(d) : "–") : ""} | ${g.released ? realDate(g.released.t) : ""} |`;
    });
    return [`# ${t("dv.gmStatus")} – ${CHARS.current().name}`, "", X().gm.cols, "|---|---|---|---|", ...rows, ""].join("\n");
  }

  // Tag gelöscht (Verlauf): Tagebuch fort, dort freigegebene Einträge wieder versiegelt
  function forgetDay(id) {
    delete J.days[id];
    for (const g of J.gm) if (g.released && g.released.day === id) delete g.released;
    save();
  }

  // --- Oberfläche ------------------------------------------------------------------------------
  // Zeilen im Reiter „Heute“: Morgenandacht und Abendgebet
  function todayHTML() {
    if (!enabled()) return "";
    const d = currentDay();
    const f = dayFacts(d);
    const P = morning(d);
    const items = (ctx ? [...new Set(d.prepared)] : []).map((id) => `<option value="${e(id)}" ${f.held && f.held.x && f.held.x.cast === id ? "selected" : ""}>${e(spellName(id))}</option>`).join("");
    const time = (x) => new Date(x.t).toLocaleTimeString(I18N.locale(), { hour: "2-digit", minute: "2-digit" });
    const vt = d.events.filter((x) => x.ev === "vespers").pop();
    return `<div class="dv-today">
      <div class="dv-row"><b>${t("dv.morning")}</b>
        ${P.frag ? `<span class="muted">${t("dv.fragOf", { name: e(P.frag.name) })}</span>` : ""}
        <button data-dv="show-morning">${t("dv.read")}</button>
        <label>${t("dv.castAtEnd")} <select data-dv="cast"><option value="">–</option>${items}</select></label>
        <button data-dv="held" class="${f.held ? "on" : ""}">${f.held ? t("dv.heldAt", { time: time(f.held) }) : t("dv.held")}</button></div>
      <div class="dv-row"><b>${t("dv.evening")}</b>
        <button data-dv="show-evening">${t("dv.read")}</button>
        <button data-dv="vespers" class="${vt ? "on" : ""}">${vt ? t("dv.heldAt", { time: time(vt) }) : t("dv.held")}</button></div>
    </div>`;
  }
  // Dialog mit gesetzten Seiten (Gebet lesen, freigegebener Eintrag)
  function showPages(pages, title) {
    let dlg = document.getElementById("dv-dialog");
    if (!dlg) {
      dlg = document.createElement("dialog");
      dlg.id = "dv-dialog";
      dlg.className = "dv-dialog";
      document.body.appendChild(dlg);
      dlg.addEventListener("click", (ev) => { if (ev.target === dlg || ev.target.closest(".dv-close")) dlg.close(); });
    }
    dlg.innerHTML = `<h3>${e(title)}</h3><div class="pages dv-pages"></div><div class="row end"><button class="dv-close primary">${t("common.close")}</button></div>`;
    dlg.showModal();
    return TYPESET.typeset(dlg.querySelector(".dv-pages"), pages);
  }
  function onTodayClick(ev) {
    const b = ev.target.closest("[data-dv]");
    if (!b || b.tagName === "SELECT") return false;
    const d = currentDay();
    const k = b.dataset.dv;
    if (k === "show-morning") showPages([prayerPage(d, morning(d))], t("dv.morning"));
    else if (k === "show-evening") showPages([prayerPage(d, evening(d))], t("dv.evening"));
    else if (k === "held") {
      const P = morning(d);
      const cast = document.querySelector('#prep [data-dv="cast"]')?.value || "";
      api.record("devotion", P.frag ? P.frag.id : null, null, cast ? { cast } : undefined);
      api.refresh();
    } else if (k === "vespers") {
      api.record("vespers", null, null);
      api.refresh();
    } else return false;
    return true;
  }

  // Reiter „Andacht“: Tag wählen, Andachtsblatt, Andachtsbuch, Tagebuch, Rückschau, Spielleiter
  let sel = null, mode = "sheet";
  function panelHTML() {
    const list = days().slice().sort((a, b) => (a.start < b.start ? 1 : -1));
    if (!sel || !list.some((d) => d.id === sel)) sel = (list.find((d) => d.current) || list[0] || {}).id;
    const r = J.days[sel] || {};
    const n = sealed().length;
    // schmale Seitenleiste: je Abschnitt eine Überschrift, Knöpfe untereinander bzw. paarweise
    return `<div class="dv-panel">
      <section><h4>${t("dv.day")}</h4><select data-dvp="day">${list.map((d) => `<option value="${e(d.id)}" ${d.id === sel ? "selected" : ""}>${e(dateText(d))}${d.current ? " · " + t("stats.today") : ""}${d.meta.test ? " · " + t("stats.test") : ""}</option>`).join("")}</select></section>
      <section><h4>${t("dv.view")}</h4><div class="dv-seg">
        <button data-dvp="view-sheet" class="${mode === "sheet" ? "on" : ""}">${t("dv.sheet")}</button>
        <button data-dvp="view-book" class="${mode === "book" ? "on" : ""}">${t("dv.bookTitle")}</button></div></section>
      <section><h4>${t("dv.print")}</h4><div class="dv-col">
        <button data-dvp="print-sheet">${t("dv.printSheet")}</button>
        <button data-dvp="print-sheets">${t("dv.printSheets")}</button>
        <button data-dvp="print-book">${t("dv.printBook")}</button></div>
        <p class="muted">${t("dv.duplexNote")}</p></section>
      <section><details class="dv-edit"><summary>${t("dv.write")}</summary>
        <textarea data-dvp="diary" rows="12" placeholder="${e(t("dv.diaryPh"))}">${e(r.diary || "")}</textarea>
        <button data-dvp="save" class="primary">${t("dv.save")}</button>
      </details></section>
      <section><h4>${t("dv.review")}</h4><div class="dv-col">
        <button data-dvp="review-export">${t("dv.reviewExport")}</button>
        <label class="filebtn">${t("dv.reviewImport")} <input type="file" data-dvp="review-import" accept=".md,.json,.txt" hidden></label></div></section>
      <section><h4>${t("dv.gm")} <span class="muted">${t("dv.sealedN", { n })}</span></h4>
        <div class="dv-code"><input data-dvp="code" placeholder="${e(t("dv.codePh"))}"><button data-dvp="release">${t("dv.release")}</button></div>
        <div class="dv-col">
        <label class="filebtn">${t("dv.gmImport")} <input type="file" data-dvp="gm-import" accept=".json" hidden></label>
        <button data-dvp="gm-status">${t("dv.gmStatusExport")}</button></div></section>
    </div>`;
  }
  // Andachtsbuch/-blatt im festen Betrachter unter dem Reiter (#devotion-view in index.html)
  let viewer = null, viewKey = null, viewEls = [];
  function viewEnsure() {
    const key = mode + "|" + sel + "|" + JSON.stringify(J) + "|" + (api ? JSON.stringify(api.dayList().map((d) => [d.id, d.events.length, d.meta])) : "");
    if (viewKey === key) return null;
    viewKey = key;
    const root = document.getElementById("devotion-pages");
    const d = dayById(sel);
    const pages = mode === "book" ? bookPages() : d ? sheetPages(d) : [];
    root.classList.add("fitting");
    return TYPESET.typeset(root, pages).then(() => {
      root.classList.remove("fitting");
      viewEls = [...root.querySelectorAll(":scope > .page")];
    });
  }
  function showView(go) {
    const box = document.getElementById("devotion-view");
    if (!box) return;
    box.hidden = false;
    if (!viewer)
      viewer = VIEWER.create({
        root: document.getElementById("devotion-pages"),
        pager: document.getElementById("devotion-pager"),
        name: "devotion",
        active: () => !box.hidden && document.getElementById("view-prepare").classList.contains("active"),
        count: () => viewEls.length,
        pageNo: (i) => i + 1,
        flat: () => mode === "sheet",
        ensure: viewEnsure,
      });
    if (go != null) viewer.pos = go;
    viewer.show();
  }
  const hideView = () => {
    const box = document.getElementById("devotion-view");
    if (box) box.hidden = true;
  };
  function renderPanel(root) {
    root.innerHTML = panelHTML();
    root.onclick = onPanelClick;
    root.onchange = onPanelChange;
    root.onkeydown = (ev) => {
      if (ev.key === "Enter" && ev.target.dataset.dvp === "code") ev.target.nextElementSibling.click();
    };
    // im Buch zur Doppelseite des gewählten Tages blättern
    const at = mode === "book" ? Math.max(0, bookDays().findIndex((d) => d.id === sel) * 2 + 1) : 0;
    showView(at);
  }
  async function readFile(input) {
    const f = input.files[0];
    input.value = "";
    return f ? f.text() : null;
  }
  async function onPanelChange(ev) {
    const k = ev.target.dataset.dvp;
    if (k === "day") {
      sel = ev.target.value;
      api.refresh();
    } else if (k === "review-import") {
      const text = await readFile(ev.target);
      if (!text) return;
      try {
        const res = importReview(text);
        if (res === "unknown") alert(t("dv.reviewUnknown"));
        else if (res === "ok") {
          sel = parseReview(text).day;
          alert(t("dv.reviewDone"));
        }
      } catch (err) {
        alert(t("dv.reviewBad") + " " + err.message);
      }
      api.refresh();
    } else if (k === "gm-import") {
      const text = await readFile(ev.target);
      if (!text) return;
      try {
        alert(t("dv.gmImported", { n: importGM(JSON.parse(text)) }));
      } catch (err) {
        alert(t("dv.gmBad") + " " + err.message);
      }
      api.refresh();
      updateSeal();
    }
  }
  async function onPanelClick(ev) {
    const b = ev.target.closest("button[data-dvp]");
    if (!b) return;
    const k = b.dataset.dvp;
    const d = dayById(sel);
    if (k === "view-sheet" || k === "view-book") {
      mode = k === "view-book" ? "book" : "sheet";
      api.refresh();
    } else if (k === "print-sheet" && d) ctx.printPages(sheetPages(d), "a5", t("dv.sheet"));
    else if (k === "print-sheets") ctx.printPages(bookDays().flatMap((x, i) => sheetPages(x, 2 * i + 1)), "a5", t("dv.sheet"));
    else if (k === "print-book") ctx.printPages(bookPages(), "a5", t("dv.bookTitle"));
    else if (k === "save" && d) {
      const root = b.closest(".dv-panel");
      setText(d.id, "diary", root.querySelector('[data-dvp="diary"]').value);
      api.refresh();
    } else if (k === "review-export" && d) exportReview(d.id);
    else if (k === "gm-status") download(`spielleiter-status-${slug(CHARS.current().name)}.md`, statusText());
    else if (k === "release") {
      const input = b.closest(".dv-code").querySelector('[data-dvp="code"]');
      await askRelease(input.value);
      input.value = "";
    }
  }
  // Code prüfen und bei Treffer die Seite sofort öffnen
  async function askRelease(code) {
    if (!code || !code.trim()) return;
    try {
      const g = await release(code);
      if (!g) return alert(t("dv.codeWrong"));
      updateSeal();
      if (api) api.refresh();
      await showPages([{ cls: "devotion-page dv-gm-page", running: g.released.title, no: "", html: `<div class="dv-gm"><h3>${e(g.released.title)}</h3>${paras(g.released.text)}</div>` }], t("dv.released"));
    } catch (err) {
      alert(err.message);
    }
  }
  // Siegel in der Kopfzeile: nur sichtbar, wenn versiegelte Einträge da sind
  function updateSeal() {
    const btn = document.getElementById("btn-seal");
    if (!btn) return;
    btn.hidden = !enabled() || !sealed().length;
    btn.title = t("dv.sealTitle", { n: sealed().length });
  }

  // Verweis aus dem Verlauf: Andachtsbuch beim Tag öffnen
  function openDay(id) {
    sel = id;
    mode = "book";
    api.open("andacht");
  }

  function init(c, a) {
    ctx = c;
    api = a;
    const btn = document.getElementById("btn-seal");
    if (btn) btn.onclick = () => askRelease(prompt(t("dv.codePrompt")));
    updateSeal();
  }

  return {
    init, enabled, cfg,
    morning, evening, occasion, OCCASIONS, fragment, dayFacts,
    sheetPages, bookPages,
    todayHTML, onTodayClick, renderPanel, hideView, openDay,
    reviewText, parseReview, importReview, exportReview, setText,
    seal, importGM, release, sealed, statusText, forgetDay, hasCrypto,
    exportData: () => J,
    importData(j) {
      J = { days: (j && j.days) || {}, gm: (j && j.gm) || [] };
      save();
    },
    reload() {
      J = load();
    },
    get journal() { return J; },
  };
})();
