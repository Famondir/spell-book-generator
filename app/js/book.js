// Seitenplanung und HTML der Buchseiten.
// Umfang: Grad 0 = halbe Seite, Grad n = n Seiten. Jede Seite ist ein festes A5-Blatt.
(function () {
  const T = window.THEORY;
  const e = U.esc;
  // Beschriftungen der Zauberseiten in der Buchsprache (data/lang/*.js, Schlüssel „sp.*“)
  const b = (k, v) => I18N.b(k, v);
  const EN = () => I18N.lang.book === "en";
  const enOf = (x) => (EN() && x && x.en) || x;
  const SCHOOL_DE = (m) => (EN() ? (T.SCHOOLS[m.school] || T.SCHOOLS.universal).en.de : m.schoolInfo.de);
  const SUB_DE = (s) => (EN() ? T.SUBSCHOOLS[s].en.de : T.SUBSCHOOLS[s].de);
  // „III. Ordnung“ / „Fingerübung“ / „Alltagszauber“
  const orderLabel = (m) => (m.spell && m.spell.everyday ? b("sp.everyday") : m.level === 0 ? b("sp.cantrip") : b("sp.order", { r: U.ROMAN[m.level] }));
  const tx = (de, en) => (EN() ? en : de);
  const q = (x) => (EN() ? `“${x}”` : `„${x}“`);

  // ---------------------------------------------------------------------------
  // Bausteine
  // ---------------------------------------------------------------------------
  // Regelverweise (optional): Nummer im Regelband, Quellenangabe, QR-Code zur AoN-Seite
  const aonUrl = (s) => "https://www.aonprd.com/SpellDisplay.aspx?ItemName=" + encodeURIComponent(s.everyday ? s.base : s.name);
  function qrSVG(text) {
    if (typeof qrcode !== "function") return "";
    const q = qrcode(0, "L");
    q.addData(text);
    q.make();
    const n = q.getModuleCount();
    let d = "";
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (q.isDark(r, c)) d += `M${c} ${r}h1v1h-1z`;
    return `<svg class="qr" viewBox="-1 -1 ${n + 2} ${n + 2}" shape-rendering="crispEdges"><path d="${d}"/></svg>`;
  }
  function refBlock(m, ref) {
    if (!ref) return "";
    const s = m.spell;
    const src = (x) => String(x || "").replace(/\bpg\. ?/g, "S. ").replace(/^PRPG /, "");
    const parts = [];
    const D = RULES.de();
    if (ref.no) parts.push(`${D ? "Regelband Nr." : "Rules Vol. no."} ${ref.no}`);
    // deutsche Fundstelle (z. B. „GRW 272“), wenn die lokalen Regeldaten sie kennen
    const srcOf = (x) => (D && RULES.source(x).de) || src(x.source);
    const base = s.everyday && window.SPELLS.find((x) => x.name === s.base);
    if (ref.source) parts.push(e(s.everyday ? `${D ? "nach" : "after"} ${RULES.name(base || s)}, ${base ? srcOf(base) : src(s.baseSource)}` : srcOf(s)));
    return (parts.length ? `<div class="sp-ref">${parts.join(" · ")}</div>` : "") + (ref.qr ? `<div class="sp-qr" title="${e(aonUrl(s))}">${qrSVG(aonUrl(s))}</div>` : "");
  }
  function head(m, t, small, ref) {
    return `<header class="sp-head ${small ? "small" : ""}">${quickGlyph(m, { cls: "sp-quick" })}${refBlock(m, ref)}
      <div class="sp-meta">${orderLabel(m)} · ${e(SCHOOL_DE(m))}${m.subschools.length ? " (" + m.subschools.map(SUB_DE).join(", ") + ")" : ""}</div>
      <h2 class="sp-title">${e(t.title)}</h2>
      <div class="sp-epithet">${e(t.epithet)}</div>
      <div class="sp-rulename">${e(RULES.name(m))}${m.spell.everyday ? ` · ${b("sp.after")} ${e(RULES.name(window.SPELLS.find((x) => x.name === m.spell.base) || m))}` : ""}</div>
    </header>`;
  }
  const circleBox = (m, t, cls, opts = {}) => `<figure class="circle-box ${cls}">${renderCircle(m, { text: t.formula.band, ...opts })}</figure>`;
  function formulaBlock(t, withTone = true) {
    const tech = t.formula.tech ? `<div class="tech">${b("sp.tech")}: <i>${e(t.formula.tech)}</i></div>` : "";
    return `<div class="formula">${t.formula.lines.map((l) => `<div class="fl">${e(l)}</div>`).join("")}${tech}${withTone ? `<div class="tone">${b("sp.tone")}: ${e(t.formula.tone)}.</div>` : ""}</div>`;
  }
  function componentsBlock(m, t) {
    const c = m.components;
    const tags = [c.V && "V", c.S && "S", c.M && "M", c.F && "F", c.DF && b("sp.df")].filter(Boolean).join(" · ");
    return `<div class="comp"><span class="comp-tags">${tags || "—"}</span> <span class="comp-time">${e(EN() ? U.cap(m.casting.en) : m.casting.de)}</span>
      ${t.materials.map((x) => `<div class="mat"><b>${e(x.k)}:</b> ${e(x.t)}${x.orig ? ` <i class="orig">${q(e(x.orig))}</i>` : ""}</div>`).join("")}</div>`;
  }
  const gesturesBlock = (t, n) => `<h4>${b("sp.gestures")}</h4><ol class="gest">${t.gestures.slice(0, n || 99).map((g) => `<li>${e(g.replace(/\.?$/, "."))}</li>`).join("")}</ol>`;
  const theoryBlock = (t, heads) =>
    t.theory.filter((p) => !heads || heads.includes(p.id) || heads.includes(p.h)).map((p) => `<h4>${e(p.h)}</h4><p>${e(p.t)}</p>`).join("");
  const structureBlock = (t) => `<h4>${b("sp.struct")}</h4><dl class="struct">${t.structure.map((s) => `<dt>${e(s.k)}</dt><dd>${e(s.t)}</dd>`).join("")}</dl>`;
  const stepsBlock = (t, compact) =>
    `<h4>${b("sp.steps")}</h4><div class="steps ${compact ? "compact" : ""}">${t.steps
      .map((p, i) => `<div class="phase"><div class="ph">${U.ROMAN[i + 1]}. ${e(p.h)}</div><ol>${p.items.map((x) => `<li>${e(x.replace(/\.?$/, "."))}</li>`).join("")}</ol></div>`)
      .join("")}</div>`;
  const note = (txt) => (txt ? `<aside class="note">${e(txt)}</aside>` : "");
  function calibrationBlock(t) {
    if (!t.calibration) return "";
    const c = t.calibration;
    return `<h4>${b("sp.calib")}</h4><table class="calib"><tr>${c.cols.map(([, h]) => `<th>${e(h)}</th>`).join("")}</tr>${c.rows
      .map((r) => `<tr>${c.cols.map(([k]) => `<td>${e(r[k] ?? "")}</td>`).join("")}</tr>`)
      .join("")}</table>`;
  }
  function essenceBlock(m) {
    return `<h4>${b("sp.essence")}</h4><div class="essbars">${m.essences
      .map((x) => {
        const E = T.ESS[x.id];
        return `<div class="essrow">${glyphSVG("essence", x.id, { s: 8, cls: x.id === m.primary ? "accent" : "" })}<span class="essname">${E.latin}</span><span class="essbar"><i style="width:${x.pct}%"></i></span><span class="esspct">${x.pct} %</span></div><p class="esstext">${e(enOf(E).text)}</p>`;
      })
      .join("")}</div>`;
  }
  function correspondBlock(t) {
    const c = t.correspond;
    return `<h4>${b("sp.correspond")}</h4><table class="corr"><tr><th>${b("sp.corr.hour")}</th><td>${e(c.hour)}</td><th>${b("sp.corr.planet")}</th><td>${e(c.planet)}</td></tr><tr><th>${b("sp.corr.color")}</th><td>${e(c.color)}</td><th>${b("sp.corr.metal")}</th><td>${e(c.metal)}</td></tr><tr><th>${b("sp.corr.dir")}</th><td>${e(c.dir)}</td><th>${b("sp.corr.body")}</th><td>${e(c.body)}</td></tr></table>${t.ink ? `<p class="ink"><b>${b("sp.ink")}</b> ${e(t.ink)}</p>` : ""}`;
  }
  const failureBlock = (t) => `<h4>${b("sp.failure")}</h4><dl class="struct">${t.failure.map((f) => `<dt>${e(f.k)}</dt><dd>${e(f.t)}</dd>`).join("")}</dl>`;
  const counterBlock = (m, t) =>
    `<h4>${b("sp.counter")}</h4><div class="counter">${`<figure class="circle-box mini mirror">${renderCircle(m, { layers: ["outer", "signs", "essence", "duration", "core"], zoom: 250 })}</figure>`}<p>${e(t.counter.t)}</p></div>`;
  const practiceBlock = (t) =>
    `<h4>${b("sp.practice")}</h4><table class="calib"><tr><th>${b("sp.practice.date")}</th><th>${b("sp.practice.place")}</th><th>${b("sp.practice.result")}</th></tr>${t.practice.map((p) => `<tr><td>${e(p.date)}</td><td>${e(p.place)}</td><td>${e(p.result)}</td></tr>`).join("")}</table>`;
  const longFormulaBlock = (t) =>
    `<h4>${b("sp.longf")}</h4><p class="hint">${b("sp.longf.hint")}</p><div class="longf">${t.longFormula
      .map((l) => `<div class="lf ${l.k}"><span>${l.k}</span>${e(l.t)}</div>`)
      .join("")}</div>`;
  const learningBlock = (t) => `<h4>${b("sp.learning")}</h4><p>${e(t.learning)}</p>`;
  // short: nur die deutsche Einordnung; der englische Mythic-Regeltext steht im Regelkasten/-anhang
  // Die mythische Variante als In-Game-Text. Der englische Mythic-Text ist Regeltext und steht nur
  // im Regelkasten bzw. Regelanhang.
  function mythicBlock(m, t, short) {
    if (!m.mythic) return "";
    const txt = m.spell.mythic;
    const aug = [...txt.matchAll(/Augmented \((\d+)(?:st|nd|rd|th)\)/g)].map((x) => +x[1]);
    const two = /(two|2) uses of mythic power/i.test(txt);
    const ordEn = (n) => n + (n % 10 === 1 && n !== 11 ? "st" : n % 10 === 2 && n !== 12 ? "nd" : n % 10 === 3 && n !== 13 ? "rd" : "th");
    if (short)
      return EN()
        ? `<h4>${b("sp.mythic")}</h4><p>Can be overcharged with mythic power: outer ring doubled, a mythic point in the core${aug.length ? `; from the ${ordEn(aug[0])} mythic tier a third ring${two ? " for a second draw of mythic power" : ""}` : ""}.</p>`
        : `<h4>${b("sp.mythic")}</h4><p>Mit Mythenkraft überladbar: äußerer Ring doppelt, Mythenpunkt im Kern${aug.length ? `; ab dem ${aug[0]}. Mythenrang ein dritter Ring${two ? " für einen zweiten Zug Mythenkraft" : ""}` : ""}.</p>`;
    let p = EN()
      ? "Whoever bears the spark of myth can overcharge this formula with their own mythic power. The circle stays the same; only the outer ring is drawn double, set with nine mythic points, and a mythic point is placed in the core."
      : "Wer den Funken der Mythen trägt, kann diese Formel mit eigener Mythenkraft überladen. Der Kreis bleibt derselbe; nur der äußere Ring wird doppelt gezogen, mit neun Mythenpunkten besetzt, und ein Mythenpunkt in den Kern gesetzt.";
    if (aug.length) p += EN()
      ? ` From the ${aug.map(ordEn).join(" or ")} mythic tier the overcharge can be raised further: then a third, dashed ring is drawn${two ? ", and the formula demands a second draw of mythic power" : ""}.`
      : ` Ab dem ${aug.join(". bzw. ")}. Mythenrang lässt sich die Überladung weiter steigern: Dann wird ein dritter, gestrichelter Ring gezogen${two ? ", und die Formel verlangt einen zweiten Zug Mythenkraft" : ""}.`;
    const fig = short ? "" : `<figure class="circle-box mythic-box">${renderCircle(m, { text: t.formula.band, mythic: aug.length ? "augmented" : true, zoom: 275 })}<figcaption>${b("sp.mythic.fig")}</figcaption></figure>`;
    return `<h4>${b("sp.mythic")}</h4><p>${e(p)}</p>${fig}`;
  }
  // Beschriftungen des Kreises in der Buchsprache (circle.js)
  const annotList = (m) => circleAnnotations(m);
  function annotatedBlock(m, t, h = b("sp.annotated")) {
    const list = annotList(m);
    return `<h4>${e(h)}</h4><figure class="circle-box annotated-box">${renderCircle(m, { text: t.formula.band, annotate: true })}</figure>
      <ol class="annot-list">${list.map((a) => `<li value="${a.n}"><b>${e(a.k)}:</b> ${e(a.t)}</li>`).join("")}</ol>`;
  }
  const QUICK_RING_DE = { instant: "oben offener Kreis", rounds: "Kreis mit zwei Zeitmarken", minutes: "gestrichelter Kreis", hours: "doppelter Kreis", days: "dreifacher Kreis", permanent: "Kreis mit Schwanz", concentration: "Kreis mit Faden" };
  const QUICK_RING_EN = { instant: "a circle open at the top", rounds: "a circle with two time marks", minutes: "a dashed circle", hours: "a double circle", days: "a triple circle", permanent: "a circle with a tail", concentration: "a circle with a thread" };
  // Absichtszeichen mit Herkunft: Anlaute der gedruckten Kernzeile in der Schrift ihrer Sprache
  const quickLettersDe = (m) => `${quickMarksHTML(m).join(" und ")} aus der Kernzeile`;
  function quickBlock(m) {
    if (EN()) return `<h4>${b("sp.quick")}</h4><div class="quick-row">${quickGlyph(m)}<p>For drawing in haste: ${QUICK_RING_EN[m.duration.kind] || "a circle open to the right"}, within it ${m.school === "universal" ? "the cross" : "the short figure of " + e(SCHOOL_DE(m))} and ${THEORY.ESS[m.primary].latin} at the centre, beside it ${quickMarksHTML(m).join(" and ")} from the core line${m.level ? `, ${m.level} dot${m.level > 1 ? "s" : ""} for the order` : ""}. It works only for one who has drawn the full circle at least once.</p></div>`;
    return `<h4>Schnellglyphe</h4><div class="quick-row">${quickGlyph(m)}<p>Für das Zeichnen in Eile: ${QUICK_RING_DE[m.duration.kind] || "rechts offener Kreis"}, darin ${m.schoolInfo.de === "Universalmagie" ? "das Kreuz" : "die Kurzfigur der " + e(m.schoolInfo.de)} und ${THEORY.ESS[m.primary].latin} im Zentrum, daneben ${quickLettersDe(m)}${m.level ? `, ${m.level} Punkt${m.level > 1 ? "e" : ""} für die Ordnung` : ""}. Wirkt nur für den, der den vollen Kreis schon einmal gezeichnet hat.</p></div>`;
  }
  function submatricesBlock(m, t) {
    const parts = [
      [b("sp.subm.core"), ["core"], 80],
      [b("sp.subm.ess"), ["essence", "signs"], 150],
      [b("sp.subm.range"), ["range", "order"], 205],
      [b("sp.subm.band"), ["outer", "gates", "sr"], 255],
    ];
    return `<h4>${b("sp.subm")}</h4><p class="hint">${b("sp.subm.hint")}</p><div class="subm">${parts
      .map(([h, layers, z]) => `<figure class="circle-box sub">${renderCircle(m, { layers, zoom: z + 15, text: t.formula.band })}<figcaption>${e(h)}</figcaption></figure>`)
      .join("")}</div>`;
  }

  function glossaryBlock(t) {
    const words = [];
    for (const l of t.formula.lines) for (const w of l.toLowerCase().replace(/[!,.]/g, "").split(/\s+/)) if (w && !words.includes(w)) words.push(w);
    const G = EN() && T.GLOSSARY_EN ? T.GLOSSARY_EN : T.GLOSSARY;
    const rows = words.filter((w) => G[w]);
    if (rows.length < 3) return "";
    return `<h4>${b("sp.gloss")}</h4><div class="gloss">${rows.map((w) => `<div><b>${e(w)}</b> – ${e(G[w])}</div>`).join("")}</div>`;
  }
  function sketchBlock(m, t) {
    const r = U.rng(m.seed ^ 0x9e37);
    const drafts = [
      [["core", "essence", "signs", "outer"], b("sp.sketch.1")],
      [["core", "duration", "signs", "outer", "range"], b("sp.sketch.2")],
      [["essence", "duration", "signs", "outer", "order"], b("sp.sketch.3")],
      [["core", "essence", "duration", "range"], b("sp.sketch.4")],
    ];
    const pick = r.sample(drafts, 2);
    return `<h4>${b("sp.sketches")}</h4><div class="sketches">${pick
      .map(([layers, cap]) => `<figure class="circle-box sketch">${renderCircle(m, { layers, zoom: 260, text: t.formula.band })}<figcaption>${e(cap)}</figcaption></figure>`)
      .join("")}</div>`;
  }
  // Verwandte Formeln (gleiche Hauptessenz und Schule, oder gleiche Verbindung)
  let relIndex = null;
  function relatedBlock(m) {
    if (!relIndex) relIndex = window.SPELLS.filter((s) => s.levels.wizard != null).map((s) => analyze(s));
    const rel = relIndex
      .filter((o) => o.id !== m.id && ((o.primary === m.primary && o.school === m.school) || (m.combo && o.combo === m.combo)))
      .sort((a, b) => Math.abs(a.level - m.level) - Math.abs(b.level - m.level))
      .slice(0, 6);
    if (!rel.length) return "";
    return `<h4>${b("sp.related")}</h4><ul class="related">${rel.map((o) => `<li>${e(generateTexts(o).title)} <span>(${e(o.name)}, ${o.level === 0 ? b("sp.cantrip") : b("sp.order", { r: U.ROMAN[o.level] })})</span></li>`).join("")}</ul>`;
  }

  // ---------------------------------------------------------------------------
  // Seitenplanung pro Zauber
  // ---------------------------------------------------------------------------
  // Seiten werden aus benannten Blöcken gebaut. Pflichtblöcke stehen fest; alle übrigen Blöcke
  // werden als optionale Füller (.opt) angehängt und von autofit() nur eingeblendet, solange Platz ist.
  // Jeder Block erscheint pro Zauber höchstens einmal.
  const OPT_ORDER = ["correspond", "gloss", "quick", "learning", "failure", "calib", "related", "essence", "sketch", "practice", "counter", "gest", "struct"];

  // opts.detail: ausführliche Fassung (wie Grad 9 plus beschrifteter Kreis), unabhängig vom Grad
  function spellPages(m, t, opts = {}) {
    // opts.layout: Seitenaufbau eines anderen Grades (z. B. nächsthöherer Grad statt Notizseite)
    const L = opts.detail ? 10 : opts.layout || m.level;
    const n = t.notes;
    const B = {
      head: () => head(m, t, false, opts.ref),
      circle: () => circleBox(m, t, "big"),
      formula: () => formulaBlock(t),
      comp: () => componentsBlock(m, t),
      theory: () => theoryBlock(t),
      theory2: () => theoryBlock(t, ["school", "ess", "reach", "Grundsatz der Schule", "Essenzen", "Weite und Dauer"]),
      wirk: () => theoryBlock(t, ["school", "Grundsatz der Schule"]).replace(/<h4>.*?<\/h4>/, `<h4>${b("sp.wirk")}</h4>`),
      struct: () => structureBlock(t),
      detail: () => `<figure class="circle-box detail">${renderCircle(m, { layers: ["core", "essence", "duration", "signs"], zoom: 150 })}<figcaption>${b("sp.detail")}</figcaption></figure>`,
      gest: () => gesturesBlock(t),
      steps: () => stepsBlock(t),
      stepsC: () => stepsBlock(t, true),
      learning: () => learningBlock(t),
      mythic: () => mythicBlock(m, t, !opts.detail && m.level < 5),
      failure: () => failureBlock(t),
      counter: () => counterBlock(m, t),
      essence: () => essenceBlock(m),
      correspond: () => correspondBlock(t),
      calib: () => calibrationBlock(t),
      practice: () => practiceBlock(t),
      subm: () => submatricesBlock(m, t),
      annot: () => annotatedBlock(m, t),
      quick: () => quickBlock(m),
      longf: () => longFormulaBlock(t),
      gloss: () => glossaryBlock(t),
      sketch: () => sketchBlock(m, t),
      related: () => relatedBlock(m),
    };
    // je zwei Notizen zu einer längeren zusammenfassen (höchstens eine Randnotiz pro Seite, siehe autofit)
    const notePairs = [];
    for (let i = 0; i < n.length; i += 2) notePairs.push(n.slice(i, i + 2).join(" "));
    notePairs.forEach((x, i) => (B["note" + i] = () => note(x)));
    const used = new Set();
    // Pflichtblöcke werden als .blk verpackt, damit autofit() sie zwischen den Seiten verschieben kann.
    // Randnotizen sind nie Pflicht – sie füllen nur freien Platz (siehe Füller unten).
    const use = (...keys) =>
      keys
        .filter((k) => !k.startsWith("note"))
        .map((k) => {
          used.add(k);
          const html = B[k] ? B[k]() : "";
          return html ? `<div class="blk" data-k="${k}">${html}</div>` : "";
        })
        .join("");
    // „steps“ und „stepsC“ sowie „theory“ und „theory2“ sind Varianten desselben Inhalts
    const alias = { stepsC: "steps", theory2: "theory", wirk: "theory" };
    const isUsed = (k) => used.has(k) || [...used].some((u) => alias[u] === k);

    let pages;
    if (opts.detail) {
      pages = [{ html: use("head", "circle", "formula", "comp", "note0"), first: true }];
      pages.push({ html: use("annot") });
      pages.push({ html: use("theory", "note1") });
      pages.push({ html: use("struct", "detail", "note2") });
      pages.push({ html: use("gest", "steps", "learning", "quick", "note3") });
      const extras = [["essence", "correspond"], ["calib", "practice"], ["failure", "counter"], ["subm"], ["longf", "gloss"], ["related", "sketch"]];
      if (m.mythic) extras.splice(1, 0, ["mythic"]);
      extras.forEach((x, i) => pages.push({ html: use(...x, "note" + (4 + i)) }));
    } else if (L === 0) {
      pages = [{
        half: true,
        html: `${use("head")}<div class="half-grid">${circleBox(m, t, "small")}<div>${use("formula")}<p class="summary">${e(t.summary)}</p>${gesturesBlock(t, 3)}${use("comp")}</div></div>${use("note0")}`,
      }];
      used.add("gest");
    } else if (L === 1) {
      pages = [{ html: use("head") + `<div class="l1-grid">${circleBox(m, t, "medium")}<div>${use("formula", "comp")}</div></div>` + use("wirk", "stepsC", "note0") }];
    } else {
      pages = [{ html: use("head", "circle", "formula", "comp", "note0"), first: true }];
      if (L === 2) pages.push({ html: use("theory2", "gest", "stepsC", "note1") });
      else if (L === 3) {
        pages.push({ html: use("theory", "note1") });
        // Fehlerbilder sind bei Grad 3 nur Füller; die mythische Variante steht vorn, damit sie
        // ans Ende der Theorie-Seite nachrücken kann
        pages.push({ html: use(...(m.mythic ? ["mythic"] : []), "struct", "gest", "steps") });
      } else {
        pages.push({ html: use("theory", "note1") });
        pages.push({ html: use("struct", "detail", "note2") });
        pages.push({ html: use("gest", "steps", "learning", ...(L === 4 && m.mythic ? ["mythic"] : []), "note3") });
        const extras = [
          ["essence", "correspond"],
          m.mythic ? ["mythic"] : ["calib", "practice"],
          ["failure", "counter"],
          ["subm"],
          m.mythic ? ["longf", "calib"] : ["longf"],
        ];
        for (let i = 0; pages.length < L; i++) pages.push({ html: use(...extras[i % extras.length], "note" + (4 + i)) });
      }
    }
    // Füller
    const opt = OPT_ORDER.filter((k) => !isUsed(k) && B[k]() !== "");
    const notesLeft = notePairs.map((_, i) => "note" + i).filter((k) => !used.has(k));
    for (const p of pages) {
      const keys = p.first || p.half ? notesLeft : [...opt, ...notesLeft];
      p.html += keys.map((k) => `<div class="opt off" data-k="${k}"${k === "note0" && n.lead ? " data-lead" : ""}>${B[k]()}</div>`).join("");
      p.spell = m.id;
    }
    return pages;
  }

  // Schriftrolle: Vorderseite Name + großer Kreis, Rückseite Formel, Komponenten, Gesten und Regeln
  // opts.paper = "a4": Rückseite nativ in A4 mit zweispaltigem Regeltext (Vorderseite wird beim Druck skaliert)
  function scrollPages(m, t, opts = {}) {
    const a4 = opts.paper === "a4";
    const front = `<div class="scroll-front">
        <div class="sp-meta">${orderLabel(m)} · ${e(SCHOOL_DE(m))}</div>
        <h2 class="sp-title">${e(t.title)}</h2>
        <div class="sp-epithet">${e(t.epithet)}</div>
        <figure class="circle-box scroll-circle">${renderCircle(m, { text: t.formula.band })}</figure>
        <div class="sp-rulename">${e(RULES.name(m))}</div>
      </div>`;
    const back = `${head(m, t, true)}${formulaBlock(t)}${componentsBlock(m, t)}${gesturesBlock(t, 4)}
      ${rulesBox(m)}`;
    return [
      { html: front, spell: m.id, cls: "scroll-page", running: b("sp.scroll") },
      { html: back, spell: m.id, cls: "scroll-page scroll-back flow" + (a4 ? " a4native" : ""), running: b("sp.scrollBack") },
    ];
  }

  // Quellenangabe unter dem Regeltext (in der Regelsprache)
  function sourceBox(s) {
    const via = s.origin === "tsv" ? "d20pfsrd.com" : "Archives of Nethys (aonprd.com)";
    const D = RULES.de();
    if (s.everyday) {
      const insp = s.inspiration
        ? `<div><b>${D ? "Idee" : "Idea"}</b> ${e(s.inspiration.title)}<br><a href="${e(s.inspiration.url)}" target="_blank" rel="noopener">${e(s.inspiration.url)}</a></div>`
        : `<div><b>${D ? "Idee" : "Idea"}</b> ${D ? "eigene Erfindung" : "own invention"}</div>`;
      return D
        ? `<div class="rules-source"><div><b>Quelle</b> Alltagszauber (Hausregel, eigene Formulierung) · Grundlage: ${e(RULES.name(window.SPELLS.find((x) => x.name === s.base) || s))} – ${e(s.baseSource || "")} (Open Game Content, OGL 1.0a)</div>${insp}</div>`
        : `<div class="rules-source"><div><b>Source</b> Everyday spell (house rule, own wording) · based on ${e(s.base)} – ${e(s.baseSource || "")} (Open Game Content, OGL 1.0a)</div>${insp}</div>`;
    }
    const src = RULES.source(s);
    if (D && src.de) return `<div class="rules-source"><div><b>Quelle</b> ${e(src.de)} · englisch: ${e(src.en)}</div><div><b>Regeltext</b> Open Game Content (OGL 1.0a), deutsch nach dem Deutschen Pathfinder-Referenzdokument (prd.5footstep.de, MyPFDB); deutsche Begriffe mit freundlicher Genehmigung von Ulisses Spiele. Dieses Produkt unterliegt keiner Abnahme oder Genehmigung durch Ulisses Spiele.</div></div>`;
    if (D) return `<div class="rules-source"><div><b>Quelle</b> ${e(src.en || "unbekannt")}</div><div><b>Regeltext</b> Open Game Content (OGL 1.0a), englisch, übernommen über ${via}${RULES.hasData() ? "" : " – deutsche Regeltexte lassen sich lokal einbinden (tools/import-rules-de.mjs)"}</div></div>`;
    return `<div class="rules-source"><div><b>Source</b> ${e(src.en || "unknown")}</div><div><b>Rules text</b> Open Game Content (OGL 1.0a), via ${via}</div></div>`;
  }

  function rulesBox(m, no) {
    const s = m.spell;
    const row = ([k, v]) => `<div class="rr"><b>${e(k)}</b> ${e(v)}</div>`;
    const tx = RULES.text(s);
    const alt = RULES.other(s);
    return `<div class="rules splittable" lang="${tx.lang}">
      <div class="rules-title">${no ? `<span class="rb-no">Nr. ${no}</span> ` : ""}${e(RULES.name(s))}${alt ? ` <span class="rules-alt">(${e(alt)})</span>` : ""}</div>
      ${RULES.fields(s).map(row).join("")}
      ${e(tx.text).split(/\n\n+/).map((para) => `<p class="rules-p">${para.replace(/\n/g, "<br>")}</p>`).join("")}
      ${s.mythic ? `<p class="rules-p"><b>Mythic:</b> ${e(s.mythic)}</p>` : ""}
      ${sourceBox(s)}
    </div>`;
  }

  // ---------------------------------------------------------------------------
  // Vorspann: Titel, Lesart der Kreise, Affinitäten
  // ---------------------------------------------------------------------------
  function frontMatter(settings, allModels) {
    return divine() ? prayerFront(settings, window.DEITY, allModels) : arcaneFront(settings, allModels);
  }
  function arcaneFront(settings, allModels) {
    const pages = [];
    pages.push({
      cls: "title-page",
      html: `<div class="tp"><div class="tp-sigil">${renderCircle(analyze(window.SPELLS.find((s) => s.name === "Arcane Mark") || window.SPELLS[0]), { layers: ["outer", "signs", "essence", "duration", "core", "order"], text: "", zoom: 260 })}</div>
        <h1>${e(PROFILE.bookValue(settings, "bookTitle"))}</h1><div class="tp-owner">${e(PROFILE.bookValue(settings, "owner"))}</div><div class="tp-sub">${e(PROFILE.bookValue(settings, "subtitle") || "")}</div></div>`,
    });
    // Anatomie eines Kreises (Beispiel: Feuerball oder erster Zauber)
    const sample = analyze(window.SPELLS.find((s) => s.name === "Fireball"));
    const st = generateTexts(sample, { name: PROFILE.bookValue(settings, "owner") });
    pages.push({
      html: tx(`<h3>Von der Lesart der Kreise</h3><p>Jede Formel in diesem Buch ist als Kreis notiert. Ein Kreis wird von außen nach innen gelesen und von innen nach außen gezeichnet. Die Lehre folgt drei Sätzen:</p>
      <ol class="laws"><li><b>Der Kreis ist ein Fluss.</b> Was in ihm kreist, bleibt erhalten; was ihn verlässt, wirkt. Geschlossene Ringe halten eine Wirkung über die Zeit, eine offene Matrix gibt sie augenblicklich frei.</li>
      <li><b>Nichts entsteht aus nichts.</b> Jede Wirkung wird bezahlt – mit vorbereiteter Kraft, mit Stoff oder mit dem Wirker selbst.</li>
      <li><b>Erfassen, Lösen, Fügen.</b> Wer eine Formel nicht verstanden hat, kann sie nicht lösen; wer sie nicht löst, kann nichts Neues fügen.</li></ol>
      <figure class="circle-box anatomy">${renderCircle(sample, { text: st.formula.band, annotate: true })}</figure>
      <p class="hint">Beispiel: ${e(st.title)} (Fireball). Die Ziffern werden auf der folgenden Seite erklärt.</p>`,
      `<h3>On the Reading of Circles</h3><p>Every formula in this book is written down as a circle. A circle is read from the outside inwards and drawn from the inside outwards. The doctrine follows three laws:</p>
      <ol class="laws"><li><b>The circle is a river.</b> What circulates within it is preserved; what leaves it takes effect. Closed rings hold an effect through time, an open matrix releases it at once.</li>
      <li><b>Nothing comes from nothing.</b> Every effect is paid for – with prepared power, with material or with the caster’s own self.</li>
      <li><b>Grasp, loosen, join.</b> Whoever has not understood a formula cannot loosen it; whoever does not loosen it can join nothing new.</li></ol>
      <figure class="circle-box anatomy">${renderCircle(sample, { text: st.formula.band, annotate: true })}</figure>
      <p class="hint">Example: ${e(st.title)} (Fireball). The numerals are explained on the following page.</p>`),
    });
    pages.push({
      html: tx(`<h3>Erweitertes Beispiel: ${e(st.title)}</h3>
      <p>Der Feuerball ist eine Hervorrufung der III. Ordnung. So liest man seinen Kreis, Schicht für Schicht von außen nach innen:</p>
      <ol class="annot-list">${annotList(sample).map((a) => `<li value="${a.n}"><b>${e(a.k)}:</b> ${e(a.t)}</li>`).join("")}</ol>
      <p>Zusammen gelesen: <i>Eine gesprochene, gestische Formel mit Schwefel als Preis, in einer Standard-Aktion gewirkt. Sie trägt weit (vier Ringe), entlädt sich augenblicklich (offene Matrix) als Ausbreitung von Ignis, gestützt von Vis. Ein Ziel kann ihr durch Reflex zur Hälfte ausweichen; Zauberresistenz wirkt.</i></p>`,
      `<h3>Extended Example: ${e(st.title)}</h3>
      <p>The fireball is an evocation of the third order. This is how its circle is read, layer by layer from the outside inwards:</p>
      <ol class="annot-list">${annotList(sample).map((a) => `<li value="${a.n}"><b>${e(a.k)}:</b> ${e(a.t)}</li>`).join("")}</ol>
      <p>Read together: <i>A spoken, gestured formula with sulfur as its price, cast as a standard action. It carries far (four rings) and discharges at once (open matrix) as a spread of Ignis, supported by Vis. A target can dodge half of it by Reflex; spell resistance applies.</i></p>`),
    });
    pages.push({
      html: tx(`<h3>Die Schichten</h3><dl class="struct">
        <dt>Ecksteine</dt><dd>Komponenten: Stimme (V), Geste (S), Stoff (M, mit alchemistischem Zeichen), Fokus (F) und göttlicher Fokus (GF).</dd>
        <dt>Zeitmarke</dt><dd>Über dem Kreis: wie lange das Wirken dauert – Punkt (Standard), Blitz (schnell), Bogen (volle Aktion), Stundenglas (Ritual).</dd>
        <dt>Schriftband</dt><dd>Die gesprochene Formel. Fehlt die Stimme, stehen dort stumme Runen.</dd>
        <dt>Schwellentore</dt><dd>Rote Tore im Band: Hier kann sich das Ziel wehren. Auge = Willen, Quader = Zähigkeit, Pfeil = Reflex. Zwei Tore: Halbierung oder Teilwirkung. Gestrichelt: harmlos.</dd>
        <dt>Siegelband</dt><dd>Schraffur unter dem Band: Die Formel muss gegen Zauberresistenz bestehen.</dd>
        <dt>Ordnungsknoten</dt><dd>Ein Knoten je Grad. Ab der dritten Ordnung werden sie zu einem Stern verbunden, der die Last trägt.</dd>
        <dt>Weitenringe</dt><dd>Keiner (persönlich) bis fünf (unbegrenzt).</dd>
        <dt>Zeichenring</dt><dd>Modifikatoren, die der Essenz Bewegung geben. Gehäuft im Norden: gerichtete Wirkung. Gleichmäßig verteilt: Wirkung nach allen Seiten.</dd>
        <dt>Essenzring</dt><dd>Die Essenzen der Formel, jede mit ihrem Anteil am Umfang. Die rote ist die Hauptessenz.</dd>
        <dt>Dauerring</dt><dd>Gebrochen (augenblicklich), mit Zeitmarken (Runden), gestrichelt (Minuten), doppelt (Stunden), dreifach (Tage), geschlossene Schlange (permanent), mit Faden (Konzentration). Kerbe: jederzeit lösbar.</dd>
        <dt>Kernsiegel</dt><dd>Die Schule als Figur, darin die Hauptessenz.</dd>
        <dt>Gestaltvektoren</dt><dd>Blass unter allem: Kegel, Linie, Strahl, Explosion, Ausströmung, Wand, Berührung, Selbst, Ziele.</dd></dl>`,
      `<h3>The Layers</h3><dl class="struct">
        <dt>Cornerstones</dt><dd>Components: voice (V), gesture (S), material (M, with an alchemical sign), focus (F) and divine focus (DF).</dd>
        <dt>Time mark</dt><dd>Above the circle: how long the casting takes – dot (standard), flash (swift), arc (full action), hourglass (ritual).</dd>
        <dt>Script band</dt><dd>The spoken formula. Where the voice is missing, silent runes stand in its place.</dd>
        <dt>Threshold gates</dt><dd>Red gates in the band: here the target can resist. Eye = Will, block = Fortitude, arrow = Reflex. Two gates: halving or partial effect. Dashed: harmless.</dd>
        <dt>Seal band</dt><dd>Hatching beneath the band: the formula must prevail against spell resistance.</dd>
        <dt>Knots of order</dt><dd>One knot for each order. From the third order on they are joined into a star that bears the load.</dd>
        <dt>Spacing rings</dt><dd>None (personal) up to five (unlimited).</dd>
        <dt>Ring of signs</dt><dd>Modifiers that give the essence movement. Clustered in the north: a directed effect. Evenly spread: an effect on all sides.</dd>
        <dt>Essence ring</dt><dd>The essences of the formula, each with its share of the circumference. The red one is the principal essence.</dd>
        <dt>Ring of duration</dt><dd>Broken (instantaneous), with time marks (rounds), dashed (minutes), double (hours), triple (days), closed serpent (permanent), with a thread (concentration). Notch: can be dismissed at any time.</dd>
        <dt>Core seal</dt><dd>The school as a figure, with the principal essence at its heart.</dd>
        <dt>Shape vectors</dt><dd>Pale beneath everything: cone, line, ray, burst, emanation, wall, touch, self, targets.</dd></dl>`),
    });
    // Schulen
    pages.push({
      html: `<h3>${tx("Die Schulen – das Verb", "The Schools – the Verb")}</h3>${LEGEND.grid(LEGEND.schools(14), "schools")}`,
    });
    // Essenzen
    pages.push({
      html: `<h3>${tx("Die sechzehn Essenzen – das Substantiv", "The Sixteen Essences – the Noun")}</h3><p class="hint">${tx("Acht Gegensatzpaare, abgeleitet aus den Ebenen der Großen Ordnung. Jede Formel trägt einen Anteil mehrerer Essenzen.", "Eight pairs of opposites, derived from the planes of the Great Order. Every formula carries a share of several essences.")}</p>${LEGEND.grid(LEGEND.essences(9), "ess")}`,
    });
    // Zeichen + Alchemie
    pages.push({
      html: `<h3>${tx("Die Zeichen – das Wie", "The Signs – the How")}</h3>${LEGEND.grid(LEGEND.signs(8), "signs")}`,
    });
    const ex = ["Fireball", "Shield", "Charm Person", "Magic Missile", "Teleport", "Animate Dead"].map((n) => window.SPELLS.find((s) => s.name === n)).filter(Boolean).map(analyze);
    pages.push({
      html: tx(`<h3>Schnellglyphen</h3><p>Am Spieltisch bleibt keine Zeit für den vollen Kreis. Wer eine Formel einmal vollständig gezeichnet hat, kann sie mit ihrer Schnellglyphe abrufen – fünf Striche statt fünfzig:</p>
      ${LEGEND.quickRules()}
      ${ex[0] ? LEGEND.quickSource(ex[0]) : ""}
      <h3>Kreise nach der Dauer</h3>${LEGEND.tiles(LEGEND.quickRings(), 4, "rings")}`,
      `<h3>Quick Glyphs</h3><p>In the press of the moment there is no time for the full circle. Whoever has drawn a formula completely once can call it up again with its quick glyph – five strokes instead of fifty:</p>
      ${LEGEND.quickRules()}
      ${ex[0] ? LEGEND.quickSource(ex[0]) : ""}
      <h3>Circles by Duration</h3>${LEGEND.tiles(LEGEND.quickRings(), 4, "rings")}`),
    });
    pages.push({
      html: `<h3>${tx("Gestaltstriche", "Shape Strokes")}</h3>${LEGEND.tiles(LEGEND.quickShapes(), 4, "shapes")}`,
    });
    pages.push({
      html: `<h3>${tx("Schulfiguren der Schnellglyphen", "School Figures of the Quick Glyphs")}</h3>${LEGEND.grid(LEGEND.quickSchools(), "quick-schools")}
      <div class="quick-ex">${ex.map((m) => `<figure>${quickGlyph(m)}<figcaption>${e(generateTexts(m).title)}<br><span>${e(RULES.name(m))}</span></figcaption></figure>`).join("")}</div>`,
    });
    pages.push({
      html: `<h3>${tx("Stoffe und Zeichen der Alchemie", "Substances and Signs of Alchemy")}</h3>${LEGEND.grid(LEGEND.alchemy(8), "alch")}
        <h3>${tx("Benannte Verbindungen", "Named Combinations")}</h3><p class="combos">${Object.entries(T.COMBOS).map(([k, v]) => `<span><b>${e(EN() && T.COMBOS_EN[k] ? T.COMBOS_EN[k] : v)}</b> ${k.split("+").map((x) => T.ESS[x].latin).join(" + ")}</span>`).join(" · ")}</p>`,
    });
    // Affinitäten (aus allen Zaubern errechnet)
    const aff = schoolAffinities(allModels);
    const order = T.ESSENCES.map((x) => x.id);
    pages.push({
      html: `<h3>${tx("Affinitäten der Schulen", "Affinities of the Schools")}</h3><p class="hint">${tx(`Durchschnittlicher Anteil jeder Essenz in allen ${allModels.length} bekannten Formeln einer Schule, in Prozent.`, `Average share of each essence in all ${allModels.length} known formulas of a school, in percent.`)}</p>
      <table class="aff"><tr><th></th>${order.map((id) => `<th title="${enOf(T.ESS[id]).de}">${glyphSVG("essence", id, { s: 6 })}</th>`).join("")}</tr>
      ${Object.entries(aff)
        .sort((a, b) => b[1].n - a[1].n)
        .map(([sc, a]) => `<tr><th>${e(enOf(T.SCHOOLS[sc] || T.SCHOOLS.universal).de)}</th>${order.map((id) => {
          const v = Math.round(a.ess[id] || 0);
          return `<td style="--v:${Math.min(v, 60) / 60}">${v || ""}</td>`;
        }).join("")}</tr>`)
        .join("")}</table>`,
    });
    return pages;
  }

  // ---------------------------------------------------------------------------
  // Brevier (göttliche Klassen): eine Seite je Zauber mit Andachtsbild, Kanon und Eigenen Worten
  // ---------------------------------------------------------------------------
  const divine = () => !!(window.CLASS && CLASS.tradition === "divine");
  const ALIGN_DE = { LG: "rechtschaffen gut", NG: "neutral gut", CG: "chaotisch gut", LN: "rechtschaffen neutral", N: "neutral", CN: "chaotisch neutral", LE: "rechtschaffen böse", NE: "neutral böse", CE: "chaotisch böse" };
  const ALIGN_EN = { LG: "lawful good", NG: "neutral good", CG: "chaotic good", LN: "lawful neutral", N: "neutral", CN: "chaotic neutral", LE: "lawful evil", NE: "neutral evil", CE: "chaotic evil" };
  function canonBlock(t) {
    return `<div class="canon"><h4>${tx("Kanon der Kirche", "Canon of the Church")} <span class="muted">· ${e(t.canon.tone)}</span></h4>${t.canon.lines.map((l) => `<div class="cl ${l.r ? "refrain" : ""}">${l.r ? "<span>℟</span> " : ""}${e(l.t)}</div>`).join("")}</div>`;
  }
  function ownBlock(own) {
    const has = !!(own && own.trim());
    const body = has
      ? own.trim().split(/\n{2,}/).map((p) => `<p>${e(p).replace(/\n/g, "<br>")}</p>`).join("")
      : `<div class="own-lines">${"<i></i>".repeat(5)}</div>`;
    return `<div class="own ${has ? "" : "empty"}"><h4>${tx("Eigene Worte", "The Petitioner’s Own Words")}</h4><div class="own-text">${body}</div></div>`;
  }
  const SAVE_EFFECT_DE = { negates: "hebt auf", half: "halbiert", partial: "teilweise", disbelief: "Anzweifeln" };
  const SAVE_EFFECT_EN = { negates: "negates", half: "halves", partial: "partial", disbelief: "disbelief" };
  const SAVE_EFFECT = new Proxy({}, { get: (_, k) => (EN() ? SAVE_EFFECT_EN : SAVE_EFFECT_DE)[k] });
  function prayerPages(m, t, opts = {}) {
    const d = t.deity || window.DEITY;
    const fact = (k, v) => (v ? `<div><b>${k}</b> ${e(v)}</div>` : "");
    const html = `<header class="sp-head pr-head">${refBlock(m, opts.ref)}
        <div class="sp-meta">${foreign(m) ? tx("Fremdes Gebet", "Foreign prayer") : tx(U.ROMAN[m.level] + ". Grad", "Degree " + U.ROMAN[m.level])} · ${e(SCHOOL_DE(m))}</div>
        <h2 class="sp-title">${e(t.title)}</h2>
        <div class="sp-rulename">${e(RULES.name(m))}</div>
      </header>
      <div class="pr-grid">
        <figure class="vt-box">${VITRAIL.render(m, d)}</figure>
        <div class="pr-side">
          <div class="pr-facts">${fact(tx("Gebet", "Prayer"), EN() ? U.cap(m.casting.en) : m.casting.de)}${fact(tx("Reichweite", "Reach"), enOf(m.range).de)}${fact(tx("Dauer", "Duration"), enOf(m.duration).de)}${fact(tx("Rettungswurf", "Saving throw"), m.save.type !== "none" ? enOf(m.save).de + (SAVE_EFFECT[m.save.effect] ? ", " + SAVE_EFFECT[m.save.effect] : "") + (m.save.harmless ? tx(" (harmlos)", " (harmless)") : "") : "")}</div>
          ${canonBlock(t)}
        </div>
      </div>
      ${ownBlock(opts.own)}`;
    return [{ html, first: true, spell: m.id }];
  }

  function deityPage(d) {
    if (!d) return `<h3>${tx("Gottheit", "Deity")}</h3><p class="hint">${tx("Keine Gottheit gewählt (Einstellungen → Charakter).", "No deity chosen (Settings → Character).")}</p>`;
    const ep = PRAYER.epithet(d);
    const base = VITRAIL.palette(d)[0];
    const row = (k, v) => (v ? `<dt>${k}</dt><dd>${v}</dd>` : "");
    const de = (list, dict) => list.map((x) => e(EN() ? x : dict[x] || dict[String(x).toLowerCase()] || x)).join(", ");
    const dom = (x) => e(EN() ? x : RULES.domain(x));
    return `<h3>${e(d.name)}</h3><div class="dt-title">${e(d.title)}${ep ? ` · ${e(ep)}` : ""}</div>
      <figure class="dt-symbol"><svg viewBox="-12 -12 24 24">${VITRAIL.symbolSVG(d.symbol, 0, 0, 10, base)}</svg></figure>
      <dl class="struct">
        ${row(tx("Gesinnung", "Alignment"), e((EN() ? ALIGN_EN : ALIGN_DE)[d.align] || d.align))}${row("Pantheon", e(d.pantheon))}
        ${row(tx("Zuständigkeiten", "Spheres of influence"), de(d.areas, PRAYER.AREA))}${row(tx("Domänen", "Domains"), (d.domains || []).map(dom).join(", "))}${row(tx("Unterdomänen", "Subdomains"), (d.subdomains || []).filter((x) => x !== "N/A").map(dom).join(", "))}
        ${row(tx("Lieblingswaffe", "Favoured weapon"), e(d.weapon))}${row(tx("Heiliges Symbol", "Holy symbol"), e(d.symbol))}${row(tx("Heiliges Tier", "Holy animal"), e(d.animal))}
        ${row(tx("Heilige Farben", "Holy colours"), d.colors.map((c) => `<span class="swatch" style="background:${c.hex}"></span>${e(EN() ? c.name : c.de || c.name)}`).join(" "))}
      </dl>
      <p class="hint dt-legal">${tx("Angaben nach Archives of Nethys. Name und Angaben der Gottheit gehören Paizo Inc. und werden beschreibend unter Paizos Community Use Policy verwendet.", "Details after Archives of Nethys. The name and details of the deity belong to Paizo Inc. and are used descriptively under Paizo’s Community Use Policy.")}</p>`;
  }

  function prayerFront(settings, d) {
    // Beispielfenster: zwei Bahnen und eine Bordüre zeigen mehr als ein einbahniges Fenster ohne Rettungswurf
    const own = (s) => s.levels[CLASS.list] != null;
    const pick = window.SPELLS.find((s) => s.name === "Litany Of Righteousness" && own(s)) ||
      window.SPELLS.find((s) => own(s) && s.levels[CLASS.list] === 2 && /^(will|fort|ref)/i.test(s.saving_throw) && !/harmless/i.test(s.saving_throw)) ||
      window.SPELLS.find(own) || window.SPELLS[0];
    const sample = analyze(pick);
    const legend = VITRAIL.legend(sample, d);
    const stone = VITRAIL.materialFor(d) === "stone";
    // Musterbilder und Wörter im Material der Gottheit (Bleiglas oder Steinintarsie)
    return VITRAIL.withMaterial(d, (Wd) => [
      {
        cls: "title-page",
        html: `<div class="tp"><div class="tp-sigil tp-vitrail">${VITRAIL.render(sample, d)}</div>
          <h1>${e(EN() && window.CLASS && CLASS.bookTitleEn && settings.bookTitle === CLASS.bookTitle ? CLASS.bookTitleEn : PROFILE.bookValue(settings, "bookTitle"))}</h1><div class="tp-owner">${e(PROFILE.bookValue(settings, "owner"))}</div><div class="tp-sub">${e(PROFILE.bookValue(settings, "subtitle") || (d ? tx("Gebete an ", "Prayers to ") + d.name : ""))}</div></div>`,
      },
      { html: deityPage(d) },
      {
        html: `<h3>${Wd.read}</h3><p>${tx(`Zu jedem Gebet gehört ein ${Wd.item}. Es wird nicht ${stone ? "gemeißelt" : "gezeichnet"}, um verstanden zu werden, sondern um davor zu knien. Wer es dennoch lesen will, findet darin alles, worum das Gebet bittet:`, `Every prayer has its own ${Wd.item}. It is not ${stone ? "carved" : "drawn"} to be understood, but to be knelt before. Whoever wishes to read it nonetheless will find in it everything the prayer asks for:`)}</p>
          <div class="pr-grid"><figure class="vt-box">${VITRAIL.render(sample, d, { annotate: true })}</figure>
          <ol class="annot-list vt-legend">${legend.map((l) => `<li value="${l.n}"><b>${e(l.k)}:</b> ${e(l.t)}</li>`).join("")}</ol></div>
          <p class="hint">${tx("Beispiel", "Example")}: ${e(PRAYER.texts(sample, d).title)} (${e(sample.name)}). ${tx("Die folgenden Seiten zeigen alle Farben und Formen.", "The following pages show all colours and forms.")}</p>`,
      },
      { html: glassPage(d) },
      { html: formsPage(d) },
      { html: medallionPage(d) },
      {
        html: tx(`<h3>Vom Gebet</h3>
          <p>Jeden Tag zur selben Stunde verbringt der Streiter eine Stunde in stillem Gebet und Betrachtung. Was er erbittet, wird ihm gewährt, solange er dem Kodex treu bleibt; er muss es nicht verstehen, nur darum bitten.</p>
          <p>Jedes Gebet in diesem Brevier hat zwei Teile. Der <b>Kanon der Kirche</b> ist überliefert: Alle Gläubigen sprechen ihn gleich, und sein Kehrvers kehrt in jedem Gebet wieder. Die <b>Eigenen Worte</b> gehören dem Betenden allein. Wo noch keine stehen, bleiben Linien frei.</p>
          <p>Ein heiliges Symbol in der Hand genügt als Fokus. Rüstung behindert das Gebet nicht.</p>`,
          `<h3>On Prayer</h3>
          <p>Every day at the same hour the champion spends an hour in quiet prayer and contemplation. What they ask is granted to them for as long as they remain true to the code; they need not understand it, only ask.</p>
          <p>Every prayer in this breviary has two parts. The <b>Canon of the Church</b> is handed down: all the faithful speak it alike, and its refrain returns in every prayer. The <b>Petitioner’s Own Words</b> belong to the one who prays alone. Where none are written yet, the lines are left empty.</p>
          <p>A holy symbol in the hand is enough as a focus. Armour does not hinder prayer.</p>`),
      },
    ]);
  }


  // Legendenseiten des Breviers: alle Gläser und Formen, die ein Fenster tragen kann
  function glassPage(d) {
    const base = VITRAIL.palette(d);
    const stone = VITRAIL.materialFor(d) === "stone";
    const intro = stone
      ? tx("Jede Essenz hat ihren eigenen Stein. Er erscheint als Akzentstein, so oft wie ihr Anteil am Zauber, und im Medaillon, wenn sie die Hauptessenz ist.", "Every essence has its own stone. It appears as an accent stone as often as its share in the spell, and in the medallion when it is the principal essence.")
      : tx("Jede Essenz hat ihr eigenes Glas. Es erscheint als Akzentscheibe, so oft wie ihr Anteil am Zauber, und im Medaillon, wenn sie die Hauptessenz ist.", "Every essence has its own glass. It appears as an accent pane as often as its share in the spell, and in the medallion when it is the principal essence.");
    const colors = d && d.colors.length
      ? d.colors.map((c, i) => `<span class="swatch" style="background:${stone ? base[i] : c.hex}"></span>${e(EN() ? c.name : c.de || c.name)}${stone ? ` (${e(VITRAIL.colorStoneName(c.name))})` : ""}`).join(" ")
      : d ? tx("keine überliefert, daher eine Palette nach Gesinnung: ", "none handed down, and so a palette by alignment: ") + base.map((c) => `<span class="swatch" style="background:${c}"></span>`).join("") : "";
    return `<h3>${stone ? tx("Die Steine", "The Stones") : tx("Die Gläser", "The Glass")}</h3><p class="hint">${intro}</p>
      <div class="legend-grid vt-glass">${T.ESSENCES.map((x) => `<div class="lg">${VITRAIL.essSwatch(x.id)}<div><b>${x.latin}</b> – ${e(enOf(x).de.replace(/ \(.*\)$/, ""))}${stone ? ` · <i>${e(VITRAIL.essStoneName(x.id))}</i>` : ""}<br><span>${tx("Gegenpol", "Opposite pole")}: ${T.ESS[x.opp].latin}</span></div></div>`).join("")}</div>
      <h4>${stone ? tx("Grundsteine", "Base Stones") : tx("Grundscheiben", "Base Panes")}</h4><p>${tx(`Die übrigen ${stone ? "Steine" : "Scheiben"} tragen die heiligen Farben der Gottheit${d ? ` – bei ${e(d.name)}: ` : ""}${colors}. Die erste Farbe fasst auch das Medaillon und färbt den Grund des ${stone ? "Sechseckfelds" : "Bogenfelds"}.`, `The remaining ${stone ? "stones" : "panes"} bear the holy colours of the deity${d ? ` – for ${e(d.name)}: ` : ""}${colors}. The first colour also frames the medallion and tints the ground of the ${stone ? "hexagon field" : "round window"}.`)}</p>`;
  }
  function formsPage(d) {
    const base = VITRAIL.palette(d);
    const tint = base[0];
    const schools = Object.entries(T.SCHOOLS).filter(([k]) => k !== "universal").concat([["universal", T.SCHOOLS.universal]]);
    const durs = tx([["instant", "Augenblicklich – schlichtes Band"], ["rounds", "Runden – Quader"], ["minutes", "Minuten – Wellen"], ["hours", "Stunden – zwei Streifen"], ["days", "Tage – Zinnen"], ["permanent", "Permanent – Ringkette"], ["concentration", "Konzentration und Besonderes – Rauten"]],
      [["instant", "Instantaneous – plain band"], ["rounds", "Rounds – blocks"], ["minutes", "Minutes – waves"], ["hours", "Hours – two stripes"], ["days", "Days – battlements"], ["permanent", "Permanent – chain of rings"], ["concentration", "Concentration and special – lozenges"]]);
    const stone = VITRAIL.materialFor(d) === "stone";
    const nF = (k) => VITRAIL.foilCount(k);
    return `<h3>${tx("Maßwerk, Zellen und Sockel", "Tracery, Cells and Socles")}</h3>
      <h4>${stone ? tx("Schichten", "Layers") : tx("Bahnen", "Lanes")} – ${tx("der Grad", "the Degree")}</h4><div class="vt-row">${[1, 2, 3, 4].map((g) => `<figure>${VITRAIL.ornament(g).replace('class="vt-orn"', 'class="vt-orn small"')}<figcaption>${tx(U.ROMAN[g] + ". Grad", "Degree " + U.ROMAN[g])}</figcaption></figure>`).join("")}</div>
      <h4>${stone ? tx("Rauten im Sechseckfeld", "Lozenges in the Hexagon Field") : tx("Pässe im Bogenfeld", "Foils in the Round Window")} – ${tx("die Schule", "the School")}</h4><div class="vt-row">${schools.map(([k, sc]) => `<figure>${VITRAIL.foilsMini(VITRAIL.foilCount(k), tint)}<figcaption>${e(enOf(sc).de)}<br>${nF(k)} ${EN() ? (stone ? (nF(k) === 1 ? "lozenge" : "lozenges") : nF(k) === 1 ? "foil" : "foils") : stone ? "Rauten" : "Pässe"}</figcaption></figure>`).join("")}</div>
      <h4>${tx("Zellen – die Gestalt", "Cells – the Shape")}</h4><div class="vt-row">
        <figure>${VITRAIL.cellsMini("even", base)}<figcaption>${tx("gleichmäßig<br>Ziele, Berührung, selbst", "even<br>targets, touch, self")}</figcaption></figure>
        <figure>${VITRAIL.cellsMini("stretched", base)}<figcaption>${tx(stone ? "in Schichtrichtung" : "gestreckt", stone ? "along the layers" : "stretched")}<br>${tx("Strahl, Linie, Kegel", "ray, line, cone")}</figcaption></figure>
        <figure>${VITRAIL.cellsMini("radial", base)}<figcaption>${tx("in Ringen<br>Explosion, Ausbreitung, Ausströmung", "in rings<br>burst, spread, emanation")}</figcaption></figure>
        <figure>${VITRAIL.borderMini(true, base)}<figcaption>${tx("Bordüre<br>Rettungswurf", "border<br>saving throw")}</figcaption></figure>
        <figure>${VITRAIL.borderMini(false, base)}<figcaption>${tx("ohne Bordüre<br>kein Rettungswurf", "no border<br>no saving throw")}</figcaption></figure></div>
      <h4>${tx("Sockel – die Wirkungsdauer", "Socles – the Duration")}</h4><div class="vt-socles">${durs.map(([k, t]) => `<div>${VITRAIL.socleMini(k, base)}<span>${e(t)}</span></div>`).join("")}</div>`;
  }

  function medallionPage(d) {
    const base = VITRAIL.palette(d);
    const stoneM = VITRAIL.materialFor(d) === "stone";
    return `<h3>${tx("Das Medaillon", "The Medallion")}</h3><p class="hint">${tx(`Die Rosette in der Mitte der ${stoneM ? "Schichten" : "Bahnen"} trägt die Farben der Haupt- und der zweiten Essenz. Ihre Form erzählt, wie das Gebet gesprochen wird:`, `The rosette in the middle of the ${stoneM ? "layers" : "lanes"} bears the colours of the principal and the second essence. Its shape tells how the prayer is spoken:`)}</p>
      <h4>${tx("Blätter – die Reichweite", "Petals – the Reach")}</h4><div class="vt-row med">${tx([[0, "persönlich", false], [4, "Berührung"], [6, "nah"], [8, "mittel"], [12, "weit"], [16, "unbegrenzt", true]], [[0, "personal", false], [4, "touch"], [6, "close"], [8, "medium"], [12, "long"], [16, "unlimited", true]]).map(([p, t, u]) => `<figure>${VITRAIL.medallionMini({ petals: p, unlimited: !!u }, base)}<figcaption>${t}${p ? `<br>${p} ${tx("Blätter", "petals")}` : tx("<br>Scheibe", "<br>disc")}</figcaption></figure>`).join("")}</div>
      <h4>${tx("Fassung – die Komponenten", "Setting – the Components")}</h4><div class="vt-row med">${tx([[0, "keine"], [3, "eine"], [4, "zwei, z. B. V, S"], [5, "drei, z. B. V, S, GF"], [6, "vier"], [7, "fünf"]], [[0, "none"], [3, "one"], [4, "two, e.g. V, S"], [5, "three, e.g. V, S, DF"], [6, "four"], [7, "five"]]).map(([c, t]) => `<figure>${VITRAIL.medallionMini({ corners: c }, base)}<figcaption>${t}</figcaption></figure>`).join("")}</div>
      <h4>${tx("Blattform und Ring – Zeitaufwand und Zauberresistenz", "Petal Shape and Ring – Casting Time and Spell Resistance")}</h4><div class="vt-row med">
        <figure>${VITRAIL.medallionMini({ tip: "pointed" }, base)}<figcaption>${tx("spitz<br>schnell, augenblicklich", "pointed<br>swift, instantaneous")}</figcaption></figure>
        <figure>${VITRAIL.medallionMini({ tip: "round" }, base)}<figcaption>${tx("rund<br>Standard-Aktion", "round<br>standard action")}</figcaption></figure>
        <figure>${VITRAIL.medallionMini({ tip: "double" }, base)}<figcaption>${tx("zwei Kränze<br>volle Aktion und länger", "two wreaths<br>full action and longer")}</figcaption></figure>
        <figure>${VITRAIL.medallionMini({ sr: true, corners: 5 }, base)}<figcaption>${tx("zweiter Ring<br>Zauberresistenz", "second ring<br>spell resistance")}</figcaption></figure></div>`;
  }

  const DIVINE_TEXT = {
    1: ["Ein Fenster, ein Licht", "Die ersten Gebete sind kurz und nah. Sie bitten um das, was ein Streiter jeden Tag braucht: eine feste Hand, ein klares Auge, ein Wort zur rechten Zeit.", "Wer sie spricht, lernt, dass Gnade nicht verdient, sondern empfangen wird."],
    2: ["Zwei Bahnen", "Mit dem zweiten Grad trägt das Gebet weiter. Es heilt, was der Kampf schlug, und schützt, wer hinter dem Schild steht.", "Die Kunst dieser Stufe ist Geduld: Nicht jede Bitte wird sofort erhört."],
    3: ["Drei Bahnen unter einem Bogen", "Gebete des dritten Grades verändern, was sie berühren. Flüche weichen, Gift verliert seine Macht, und das Licht brennt, wo es gerufen wird.", "Wer hier betet, steht nicht mehr allein vor dem Altar."],
    4: ["Das volle Fenster", "Der vierte Grad ist das Höchste, was einem Streiter gewährt wird. Diese Gebete wenden Schlachten und rufen zurück, was verloren schien.", "Sie werden selten gesprochen und nie ohne Furcht."],
    foreign: ["Aus anderen Händen", "Formeln, die nicht aus dem Kanon dieser Kirche stammen. Sie stehen hier, weil sie einmal wichtig waren.", "Ob die Gottheit sie erhört, ist eine andere Frage."],
  };
  const DIVINE_TEXT_EN = {
    1: ["One Window, One Light", "The first prayers are short and near. They ask for what a champion needs every day: a steady hand, a clear eye, a word at the right time.", "Whoever speaks them learns that grace is not earned but received."],
    2: ["Two Lanes", "With the second degree the prayer carries further. It heals what the fight has struck and shelters whoever stands behind the shield.", "The art of this stage is patience: not every request is answered at once."],
    3: ["Three Lanes under One Arch", "Prayers of the third degree change what they touch. Curses give way, poison loses its power, and the light burns where it is called.", "Whoever prays here no longer stands alone before the altar."],
    4: ["The Full Window", "The fourth degree is the highest that is granted to a champion. These prayers turn battles and call back what seemed lost.", "They are spoken rarely and never without fear."],
    foreign: ["From Other Hands", "Formulas that do not come from the canon of this church. They stand here because they were once important.", "Whether the deity hears them is another question."],
  };
  function divineChapterHTML(k, no, cont) {
    const g = /^\d$/.test(k) ? +k : 0;
    const PB = window.PROFILE && PROFILE.book ? PROFILE.book() : window.PROFILE;
    const own = (PB && PB.chapters && PB.chapters[k]) || null;
    let [sub, ...paras] = own || tx(DIVINE_TEXT, DIVINE_TEXT_EN)[k] || tx([`${g} Bahnen`, "Gebete höheren Grades."], [`${g} lanes`, "Prayers of a higher degree."]);
    if (!own && VITRAIL.materialFor(window.DEITY) === "stone") sub = tx({ 1: "Ein Stein, ein Licht", 3: "Drei Bahnen unter einem Giebel", 4: "Die volle Tafel" }, { 1: "One Stone, One Light", 3: "Three Layers under One Gable", 4: "The Full Tablet" })[k] || sub;
    const title = EN()
      ? (k === "foreign" ? "Foreign Prayers" : g ? `Prayers of the ${U.cap(ORDINAL_EN[g])} Degree` : chapterName(k)) + (cont ? " (continued)" : "")
      : (k === "foreign" ? "Fremde Gebete" : CLASS.chapter ? CLASS.chapter(g) : `Gebete des ${U.ROMAN[g]}. Grades`) + (cont ? " (Fortsetzung)" : "");
    return `<div class="chapter"><div class="ch-kicker">${tx("Kapitel", "Chapter")} ${U.ROMAN[no] || no}</div><h1 class="ch-title">${e(title)}</h1>${VITRAIL.withMaterial(window.DEITY, () => VITRAIL.ornament(Math.max(1, g || 1)))}<div class="ch-sub">${e(sub)}</div>${paras.map((p) => `<p>${e(p)}</p>`).join("")}</div>`;
  }

  // ---------------------------------------------------------------------------
  // Ganzes Buch zusammensetzen
  // ---------------------------------------------------------------------------
  // ctx.volume (bei mehreren Bänden): { no, total, label, chapterNo: Map Kapitel → Nummer, refOffset, continued }
  // ctx.front: vorab gesetzter Vorspann, ctx.pageCache: Seiten je Zauber (beides für wiederholte Läufe der Bandaufteilung)
  function assemble(entries, settings, allModels, ctx = {}) {
    // entries: [{ m, t }] – sortiert nach Grad, dann Name
    const pages = [];
    const vol = ctx.volume || null;
    let front = vol && vol.no > 1 ? [] : settings.frontMatter ? ctx.front || frontMatter(settings, allModels) : [];
    if (vol && vol.total > 1) {
      // Band I: Bandzeile aufs Titelblatt; weitere Bände: nur Titelblatt (auch ohne Vorspann, damit die Bände unterscheidbar sind)
      const title = vol.no > 1 ? (ctx.front || frontMatter(settings, allModels))[0] : front[0];
      if (title && title.cls === "title-page") {
        const line = `<div class="tp-vol">${tx("Band", "Volume")} ${U.ROMAN[vol.no] || vol.no}${vol.label ? " · " + e(vol.label) : ""}</div>`;
        const t2 = { ...title, html: title.html.replace('<div class="tp-sub">', line + '<div class="tp-sub">') };
        front = vol.no > 1 ? [t2] : [t2, ...front.slice(1)];
      }
    }
    const toc = []; // [{ title, name, level, page }]
    const PER_TOC = 22;
    const tocPageCount = settings.frontMatter ? Math.max(1, Math.ceil(entries.length / PER_TOC)) : 0;
    let pageNo = front.length + tocPageCount + 1;
    const body = [];
    let pendingHalf = null;
    let fillers = 0, expanded = 0;
    const ref = settings.refNo || settings.refQr || settings.refSource;
    // Mehrseitige Zauber links beginnen: "notes" Notizseite, "expand" Aufbau des nächsthöheren Grades, "off" aus
    let mode = settings.leftStart || (settings.startLeft === false ? "off" : "notes");
    if (divine() && mode === "expand") mode = "notes"; // Brevierseiten sind einseitig, es gibt nichts zu erweitern
    const withChapters = settings.chapters !== false;
    const chapters = [];
    let chapter = null, last = null;
    const perChapter = new Map();
    entries.forEach(({ m }) => perChapter.set(chapterKey(m), (perChapter.get(chapterKey(m)) || 0) + 1));
    const refOffset = vol ? vol.refOffset || 0 : 0;
    const optsFor = (m, idx) => ({ detail: !divine() && settings.detailPrint, own: (ctx.prayers || {})[m.id], ref: ref ? { no: settings.refNo && refOffset + idx + 1, qr: settings.refQr, source: settings.refSource } : null });
    // Seiten eines Zaubers hängen nur von Zauber und Optionen ab: bei wiederholten Läufen aus dem Zwischenspeicher
    const pagesFor = (m, t, opts) => {
      if (!ctx.pageCache) return divine() ? prayerPages(m, t, opts) : spellPages(m, t, opts);
      const k = m.id + "|" + JSON.stringify(opts);
      if (!ctx.pageCache.has(k)) ctx.pageCache.set(k, divine() ? prayerPages(m, t, opts) : spellPages(m, t, opts));
      return ctx.pageCache.get(k);
    };
    const spellPageObjs = (m, t, sp, startNo) =>
      sp.map((p, i) => ({ html: p.html, spell: m.id, cls: p.first ? "first-page" : "", no: startNo + i, running: t.title + (sp.length > 1 ? ` · ${i + 1}/${sp.length}` : "") }));
    // nächste Seite auf eine gerade (linke) Seite bringen
    const toLeft = () => {
      if (pageNo % 2 === 0) return;
      if (mode === "expand" && last && last.len % 2 === 1 && last.level < 9 && body.length === last.start + last.len) {
        const sp2 = pagesFor(last.m, last.t, { ...last.opts, layout: last.len + 1 });
        if (sp2.length === last.len + 1) {
          body.splice(last.start, last.len, ...spellPageObjs(last.m, last.t, sp2, body[last.start].no));
          pageNo++;
          expanded++;
          last.len++;
          return;
        }
      }
      body.push({ no: pageNo++, running: "", cls: "filler-page", html: fillerHTML() });
      fillers++;
    };
    entries.forEach(({ m, t }, idx) => {
      const key = chapterKey(m);
      if (!chapter || chapter.key !== key) {
        pendingHalf = null;
        chapter = { key, name: chapterName(key), items: [] };
        chapters.push(chapter);
        if (withChapters) {
          if (mode !== "off") toLeft();
          chapter.page = pageNo;
          const cont = vol && vol.continued === key && chapters.length === 1;
          const no = vol && vol.chapterNo ? vol.chapterNo.get(key) : chapters.length;
          body.push({ no: pageNo++, running: "", cls: "chapter-page", html: chapterHTML(key, no, cont) });
          // Formelliste mit Namen; lange Kapitel bekommen mehrere Listenseiten
          const n = perChapter.get(key);
          chapter.listPages = Array.from({ length: Math.ceil(n / CH_LIST_MAX) }, () => ({ no: pageNo++, running: chapter.name, cls: "chapter-list", html: "" }));
          // gleichmäßig verteilen, mit gerader Zahl je Seite (beide Spalten gleich lang); Rest auf die letzte Seite
          const per = Math.ceil(n / chapter.listPages.length);
          chapter.perList = per + (per % 2);
          body.push(...chapter.listPages);
        }
        last = null;
      }
      const opts = optsFor(m, idx);
      const sp = pagesFor(m, t, opts);
      if (sp.length === 1 && sp[0].half) {
        const block = `<div class="half" data-spell="${e(m.id)}">${sp[0].html}</div>`;
        if (pendingHalf) {
          pendingHalf.html += block;
          toc.push({ t, m, page: pendingHalf.no });
          pendingHalf = null;
        } else {
          pendingHalf = { html: block, no: pageNo, running: m.spell.everyday ? b("sp.everydayPl") : b("sp.cantripPl"), halves: true };
          body.push(pendingHalf);
          toc.push({ t, m, page: pageNo });
          pageNo++;
        }
        chapter.items.push(toc[toc.length - 1]);
        last = null;
        return;
      }
      pendingHalf = null;
      // Mehrseitige Zauber beginnen links (gerade Seite), damit sie aufgeschlagen nebeneinander liegen
      if (mode !== "off" && sp.length > 1) toLeft();
      toc.push({ t, m, page: pageNo });
      chapter.items.push(toc[toc.length - 1]);
      last = { m, t, opts, start: body.length, len: sp.length, level: m.level };
      body.push(...spellPageObjs(m, t, sp, pageNo));
      pageNo += sp.length;
    });
    // Kapitellisten erst jetzt füllen: die Seitenzahlen stehen fest
    for (const c of chapters) {
      (c.listPages || []).forEach((lp, i) => {
        const part = c.items.slice(i * c.perList, (i + 1) * c.perList);
        lp.html = `<h3>${divine() ? tx("Gebete dieses Kapitels", "Prayers of this chapter") : b("book.chList")}${i ? b("book.contShort") : ""}</h3><div class="ch-list">${part.map((x) => `<div class="ch-row"><span class="tq">${quickGlyph(x.m, { marks: false })}</span><span class="ch-nm">${e(x.t.title)}<i>${e(RULES.name(x.m))}</i></span><span class="tp">${x.page}</span></div>`).join("")}</div>`;
      });
    }
    front.forEach((p, i) => pages.push({ ...p, no: i + 1, running: "" }));
    if (settings.frontMatter) {
      for (let i = 0; i < tocPageCount; i++) {
        const chunk = toc.slice(i * PER_TOC, (i + 1) * PER_TOC);
        pages.push({
          no: front.length + i + 1,
          running: divine() && !EN() ? "Verzeichnis" : b("book.tocRunning"),
          html: (i === 0 ? `<h3>${divine() ? tx("Verzeichnis der Gebete", "Index of Prayers") : b("book.tocTitle")}</h3>` : "") +
            `<table class="toc">${chunk.map((x) => `<tr><td class="tq">${quickGlyph(x.m, { marks: false })}</td><td class="tg">${x.m.spell.everyday ? b("book.everydayMark") : x.m.level === 0 ? "0" : U.ROMAN[x.m.level]}</td><td>${e(x.t.title)}<span class="tn">${e(RULES.name(x.m))}</span></td><td class="tp">${x.page}</td></tr>`).join("")}</table>`,
        });
      }
    }
    pages.push(...body);
    const chapterPages = chapters.reduce((a, c) => a + (c.listPages ? 1 + c.listPages.length : 0), 0);
    const spellPagesCount = body.length - fillers - chapterPages;
    return { pages, toc, spellPagesCount, fillers, expanded, chapterPages, chapters: chapters.filter((c) => c.page).map((c) => ({ key: c.key, name: c.name, page: c.page })) };
  }

  // --- Bände ----------------------------------------------------------------------
  // Aufteilung nach Höchstseitenzahl: Schnitte nur an Kapitelgrenzen; ein Kapitel, das allein nicht in einen Band passt,
  // wird an Zaubergrenzen in Stücke geteilt. Gemessen wird mit echtem Satz (assemble), die Seiten der Zauber kommen
  // dabei aus dem Zwischenspeicher. Erst die kleinste Bandzahl bestimmen, dann die Schnitte so wählen,
  // dass der dickste Band möglichst dünn wird.
  function volumes(entries, settings, allModels, ctx = {}) {
    const max = Math.max(0, Math.floor(+settings.maxPages || 0));
    const whole = (r) => ({ vols: [{ ...r, no: 1, label: "", entries, offset: 0 }], warnings: [] });
    if (!max || !entries.length) return whole(assemble(entries, settings, allModels, ctx));
    const base = { ...ctx, pageCache: ctx.pageCache || new Map(), front: ctx.front || frontMatter(settings, allModels) };
    const full = assemble(entries, settings, allModels, base);
    if (full.pages.length <= max) return whole(full);

    const keys = entries.map(({ m }) => chapterKey(m));
    const chapterNo = new Map();
    keys.forEach((k) => chapterNo.has(k) || chapterNo.set(k, chapterNo.size + 1));
    // Bandkontext für den Abschnitt [i, j)
    const volCtx = (i, no, total, label) => ({ no, total, label, chapterNo, refOffset: i, continued: i > 0 && keys[i] === keys[i - 1] ? keys[i] : null });
    const sizes = new Map();
    const size = (i, j) => {
      const k = i + "," + j;
      if (!sizes.has(k)) sizes.set(k, assemble(entries.slice(i, j), settings, allModels, { ...base, volume: volCtx(i, i === 0 ? 1 : 2, 2, "") }).pages.length);
      return sizes.get(k);
    };
    // erlaubte Schnitte innerhalb eines Kapitels: nicht zwischen zwei Hälften derselben Seite
    const pageOf = full.toc.map((x) => x.page);
    const cuttable = (j) => pageOf[j] !== pageOf[j - 1];
    const warnings = [];
    const cuts = [0];
    const splitNames = [];
    let tooSmall = 0;
    // Stücke eines zu großen Kapitels [i, end) mit höchstens limit Seiten, jedes so groß wie möglich
    // (Binärsuche über die erlaubten Schnitte); null, wenn ein einzelner Zauber schon zu groß ist
    const pieces = (i, end, limit) => {
      const out = [];
      while (i < end) {
        const cand = [];
        for (let j = i + 1; j < end; j++) if (cuttable(j)) cand.push(j);
        cand.push(end);
        let lo = 0, hi = cand.length - 1, best = -1;
        while (lo <= hi) {
          const mid = (lo + hi) >> 1;
          if (size(i, cand[mid]) <= limit) (best = mid), (lo = mid + 1);
          else hi = mid - 1;
        }
        if (best < 0) return null;
        out.push((i = cand[best]));
      }
      return out;
    };
    for (let i = 0; i < entries.length; ) {
      let end = i;
      while (end < entries.length && keys[end] === keys[i]) end++;
      if (size(i, end) <= max) {
        cuts.push((i = end));
        continue;
      }
      splitNames.push(chapterName(keys[i]));
      let ps = pieces(i, end, max);
      if (!ps) {
        // nicht einmal ein Zauber passt: jeder Zauber wird ein eigenes Stück und darf die Grenze überschreiten
        ps = [];
        for (let j = i + 1; j <= end; j++) if (j === end || cuttable(j)) ps.push(j);
        tooSmall = Math.max(tooSmall, ...ps.map((j, n) => size(n ? ps[n - 1] : i, j)));
      } else if (ps.length > 1) {
        // gleich viele Stücke, aber ausgeglichen: kleinste Grenze suchen, mit der es nicht mehr Stücke werden
        let lo = Math.ceil(size(i, end) / ps.length), hi = max;
        while (lo < hi) {
          const mid = (lo + hi) >> 1;
          const t = pieces(i, end, mid);
          if (t && t.length <= ps.length) hi = mid;
          else lo = mid + 1;
        }
        ps = pieces(i, end, lo);
      }
      cuts.push(...ps);
      i = end;
    }
    if (splitNames.length) warnings.push(`Größer als ${max} Seiten und deshalb innerhalb des Kapitels auf mehrere Bände geteilt: ${splitNames.join(", ")}.`);
    if (tooSmall) warnings.push(`Die Grenze ist kleiner als ein einzelner Zauber mit Bandvorspann; sinnvoll sind mindestens ${tooSmall} Seiten je Band.`);

    // kleinste Bandzahl (gierig), dann ausgeglichene Schnitte; Abschnitte über der Grenze sind nur als einzelnes Stück erlaubt
    const cost = (a, b) => {
      const n = size(cuts[a], cuts[b]);
      return n <= max || b === a + 1 ? n : Infinity;
    };
    let k = 0;
    for (let a = 0; a < cuts.length - 1; k++) {
      let b = a + 1;
      while (b + 1 < cuts.length && cost(a, b + 1) <= max) b++;
      a = b;
    }
    // best[v][b]: kleinster dickster Band, wenn v Bände bis Schnitt b reichen
    const M = cuts.length - 1;
    const best = Array.from({ length: k + 1 }, () => new Array(M + 1).fill(Infinity));
    const from = Array.from({ length: k + 1 }, () => new Array(M + 1).fill(-1));
    best[0][0] = 0;
    for (let v = 1; v <= k; v++)
      for (let b = 1; b <= M; b++)
        for (let a = b - 1; a >= 0; a--) {
          const c = cost(a, b);
          if (c === Infinity) break; // längere Abschnitte werden nur dicker
          const val = Math.max(best[v - 1][a], c);
          if (val < best[v][b]) (best[v][b] = val), (from[v][b] = a);
        }
    const bounds = [M];
    for (let v = k, b = M; v > 0; v--) bounds.unshift((b = from[v][b]));

    const label = (i, j) => {
      const a = keys[i], b = keys[j - 1];
      const nm = (x) => chapterName(x);
      if (a === b) return nm(a);
      return /^\d$/.test(a) && /^\d$/.test(b) ? (EN() ? `Degrees ${U.ROMAN[+a]}–${U.ROMAN[+b]}` : `${U.ROMAN[+a]}.–${U.ROMAN[+b]}. Grad`) : `${nm(a)} – ${nm(b)}`;
    };
    const vols = [];
    for (let v = 0; v < k; v++) {
      const i = cuts[bounds[v]], j = cuts[bounds[v + 1]];
      const lb = label(i, j);
      const part = entries.slice(i, j);
      vols.push({ ...assemble(part, settings, allModels, { ...base, volume: volCtx(i, v + 1, k, lb) }), no: v + 1, label: lb, entries: part, offset: i });
    }
    return { vols, warnings };
  }

  // --- Kapitel ---------------------------------------------------------------------
  // Einträge je Listenseite: 50 passen in voller Schriftgröße, bis 52 mit leicht kleinerer Schrift;
  // die Einträge werden gleichmäßig und paarweise auf die nötigen Seiten verteilt (86 → 44 + 42)
  const CH_LIST_MAX = 52;
  // Brevier: Zauber außerhalb der Klassenliste (z. B. nach einem Klassenwechsel) landen als „Fremde Gebete“ am Ende
  const foreign = (m) => divine() && (m.spell.everyday || m.spell.levels[CLASS.list] == null);
  const chapterKey = (m) => (foreign(m) ? "foreign" : m.spell.everyday ? "everyday" : m.level === 0 ? "cantrip" : String(m.level));
  const chapterName = (k) => (!EN()
    ? (k === "foreign" ? "Fremde Gebete" : k === "everyday" ? "Alltagszauber" : k === "cantrip" ? "Zaubertricks" : U.ROMAN[+k] + ". Grad")
    : (k === "foreign" ? "Foreign prayers" : k === "everyday" ? "Everyday spells" : k === "cantrip" ? "Cantrips" : "Degree " + U.ROMAN[+k]));
  // Sortierschlüssel der Kapitel (Zaubertricks vor Alltagszaubern, Fremde Gebete zuletzt)
  const rank = (m) => (foreign(m) ? 100 : 0) + m.level + (m.spell.everyday ? 0.5 : 0);
  const ORDINAL = ["", "erste", "zweite", "dritte", "vierte", "fünfte", "sechste", "siebte", "achte", "neunte"];
  const CHAPTER_TEXT = {
    cantrip: ["Fingerübungen", "Kreise ohne Ordnungsknoten: ein Ring, ein Zeichen, ein Kern. Nichts hält diese Formeln fest, also verbrauchen sie sich nicht – sie lassen sich wirken, solange die Hand ruhig bleibt.", "Wer die großen Kreise ziehen will, beginnt hier. Jede Fingerübung lehrt eine einzelne Bewegung, die später in mächtigeren Formeln wiederkehrt."],
    everyday: ["Kleine Künste", "Sonderformen, die in keinem Lehrbuch stehen. Jede nimmt eine bekannte Formel und schneidet sie auf genau einen Zweck zu, bis kaum Kraft übrig bleibt – dafür passt sie in einen Atemzug.", "Gesammelt in Gasthäusern, auf Märkten und aus den Notizbüchern anderer. Nützlich selten, erfreulich fast immer."],
    1: ["Ein Knoten hält den Kreis", "Der erste Ordnungsknoten bindet die Formel an den Wirker. Sie reicht nicht weit und hält nicht lang, aber sie gehorcht.", "Hier lernt man, dass ein Kreis nur so gut ist wie seine schwächste Linie."],
    2: ["Zwei Knoten, eine Achse", "Mit dem zweiten Knoten bekommt der Kreis eine Achse. Kraft lässt sich nun ausrichten, verteilen und eine Weile halten.", "Die meisten Fehler dieser Stufe sind Ungleichgewichte: ein Knoten zieht stärker als der andere."],
    3: ["Das Dreieck trägt", "Drei Knoten bilden die erste stabile Figur. Formeln der dritten Ordnung tragen sich selbst, greifen weit und treffen viele zugleich.", "Was hier gelingt, entscheidet Schlachten. Was misslingt, ebenso."],
    4: ["Das Viereck öffnet", "Vier Knoten spannen ein Feld, das größer ist als der Kreis. Formeln dieser Ordnung reichen in Räume, die der Wirker nicht sieht.", "Ab hier verlangt jede Linie Geduld; ein hastig gezogenes Viereck schließt sich nicht."],
    5: ["Das Pentagramm verbindet", "Fünf Knoten verbinden Orte, Ebenen und Wesen. Die fünfte Ordnung ist die Schwelle zur Meisterschaft.", "Wer sie überschreitet, zeichnet nicht mehr nur Kreise – er verknüpft sie."],
    6: ["Das Hexagon beharrt", "Sechs Knoten geben einer Formel Dauer und Gewicht. Sie überlebt Störungen, die kleinere Kreise zerreißen.", "Die Kunst liegt darin, das Hexagon nicht starr werden zu lassen."],
    7: ["Das Siebeneck greift aus", "Sieben Knoten lassen sich nicht in einem Zug schließen. Formeln dieser Ordnung berühren Ebenen, Zeit und Wirklichkeit selbst.", "Jeder Fehler hier hat Folgen, die länger bleiben als der Zauber."],
    8: ["Das Achteck bindet", "Acht Knoten binden Geist, Gestalt und Schicksal. Was diese Ordnung festhält, bleibt festgehalten.", "Sie wird selten gewirkt und nie leichtfertig."],
    9: ["Neun Knoten, die Grenze", "Die neunte Ordnung ist die Grenze dessen, was ein sterblicher Kreis tragen kann. Darüber hinaus beginnt das Reich der Götter.", "Wer hier zeichnet, hat jede Linie dieses Buches tausendmal gezogen."],
  };
  const ORDINAL_EN = ["", "first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth"];
  const CHAPTER_TEXT_EN = {
    cantrip: ["Finger Exercises", "Circles without knots of order: one ring, one sign, one core. Nothing holds these formulas fast, and so they are never spent – they can be cast for as long as the hand stays steady.", "Whoever wishes to draw the great circles begins here. Every finger exercise teaches a single movement that returns later in mightier formulas."],
    everyday: ["Small Arts", "Variants that stand in no textbook. Each takes a known formula and trims it down to exactly one purpose, until hardly any power is left – and in return it fits into a single breath.", "Gathered in inns, at markets and from other people's notebooks. Seldom useful, almost always a delight."],
    1: ["One Knot Holds the Circle", "The first knot of order binds the formula to the caster. It does not reach far and does not hold long, but it obeys.", "Here one learns that a circle is only as good as its weakest line."],
    2: ["Two Knots, One Axis", "With the second knot the circle gains an axis. Power can now be aimed, spread and held for a while.", "Most faults at this stage are imbalances: one knot pulls harder than the other."],
    3: ["The Triangle Bears", "Three knots form the first stable figure. Formulas of the third order carry themselves, reach far and strike many at once.", "What succeeds here decides battles. So does what fails."],
    4: ["The Square Opens", "Four knots stretch a field larger than the circle. Formulas of this order reach into rooms the caster cannot see.", "From here on every line demands patience; a square drawn in haste will not close."],
    5: ["The Pentagram Connects", "Five knots connect places, planes and beings. The fifth order is the threshold of mastery.", "Whoever crosses it no longer merely draws circles – they bind them together."],
    6: ["The Hexagon Endures", "Six knots give a formula duration and weight. It survives disturbances that tear smaller circles apart.", "The art lies in not letting the hexagon grow rigid."],
    7: ["The Heptagon Reaches Out", "Seven knots cannot be closed in a single stroke. Formulas of this order touch planes, time and reality itself.", "Every fault here has consequences that last longer than the spell."],
    8: ["The Octagon Binds", "Eight knots bind mind, shape and fate. What this order holds stays held.", "It is seldom cast and never lightly."],
    9: ["Nine Knots, the Limit", "The ninth order is the limit of what a mortal circle can bear. Beyond it begins the realm of the gods.", "Whoever draws here has drawn every line of this book a thousand times."],
  };
  function chapterFigure(k) {
    const n = /^\d$/.test(k) ? +k : 0;
    const pt = (i, r) => [Math.sin((2 * Math.PI * i) / n) * r, -Math.cos((2 * Math.PI * i) / n) * r].map((v) => v.toFixed(2)).join(" ");
    let inner = "";
    if (n >= 2) {
      inner += `<path class="thin" d="M${Array.from({ length: n }, (_, i) => pt(i, 40)).join("L")}Z"/>`;
      if (n >= 5) inner += `<path class="thin" d="${Array.from({ length: n }, (_, i) => `M${pt(i, 40)}L${pt(i + Math.floor(n / 2), 40)}`).join("")}"/>`;
      inner += Array.from({ length: n }, (_, i) => `<circle class="node" r="4.5" cx="${pt(i, 40).split(" ")[0]}" cy="${pt(i, 40).split(" ")[1]}"/>`).join("");
    } else if (n === 1) inner += `<circle class="node" r="4.5" cx="0" cy="-40"/>`;
    else if (k === "everyday") inner += `<circle r="3"/><circle r="10" class="thin"/><circle class="node" r="3" cx="0" cy="-22"/><circle class="node" r="3" cx="19" cy="11"/><circle class="node" r="3" cx="-19" cy="11"/>`;
    else inner += `<circle r="4"/>`;
    return `<svg class="ch-fig" viewBox="-56 -56 112 112"><circle r="50"/><circle r="46" class="thin"/><circle r="40" class="thin dash"/>${inner}</svg>`;
  }
  function chapterHTML(k, no, cont) {
    if (divine()) return divineChapterHTML(k, no, cont);
    // eigene Kapiteltexte nur in der Sprache des Profils (PROFILE.forLang)
    const PB = window.PROFILE && PROFILE.book ? PROFILE.book() : window.PROFILE;
    const own = (PB && PB.chapters && PB.chapters[k]) || null;
    if (EN()) {
      const [sub, ...paras] = own || CHAPTER_TEXT_EN[k] || ["", ""];
      const title = (k === "everyday" ? "Everyday Spells" : k === "cantrip" ? "Cantrips" : `Spells of the ${U.cap(ORDINAL_EN[+k])} Degree`) + (cont ? " (continued)" : "");
      const kicker = /^\d$/.test(k) ? `The ${U.cap(ORDINAL_EN[+k])} Order` : k === "cantrip" ? "Without Order" : "Variants";
      return `<div class="chapter"><div class="ch-kicker">Chapter ${U.ROMAN[no] || no} · ${kicker}</div><h1 class="ch-title">${e(title)}</h1>${chapterFigure(k)}<div class="ch-sub">${e(sub)}</div>${paras.map((p) => `<p>${e(p)}</p>`).join("")}</div>`;
    }
    const [sub, ...paras] = own || CHAPTER_TEXT[k] || ["", ""];
    const title = (k === "everyday" ? "Alltagszauber" : k === "cantrip" ? "Zaubertricks" : `Zauber des ${U.ROMAN[+k]}. Grades`) + (cont ? " (Fortsetzung)" : "");
    const kicker = /^\d$/.test(k) ? `Die ${ORDINAL[+k]} Ordnung` : k === "cantrip" ? "Ohne Ordnung" : "Sonderformen";
    return `<div class="chapter"><div class="ch-kicker">Kapitel ${U.ROMAN[no] || no} · ${kicker}</div><h1 class="ch-title">${e(title)}</h1>${chapterFigure(k)}<div class="ch-sub">${e(sub)}</div>${paras.map((p) => `<p>${e(p)}</p>`).join("")}</div>`;
  }

  // Inhaltsverzeichnis des Regelbands: Nummer → Name → Seite, aus den gesetzten Seiten gelesen
  const RB_TOC_ROWS = 76;
  async function rulesIndex(root) {
    const rows = [];
    root.querySelectorAll(":scope > .page").forEach((pg) => {
      const no = pg.querySelector(".page-foot span:last-child")?.textContent;
      pg.querySelectorAll(".rules-title").forEach((t) => {
        if (t.closest(".rules")?.dataset.splitOf) return; // Fortsetzung eines umbrochenen Kastens
        const nr = t.querySelector(".rb-no");
        const alt = t.querySelector(".rules-alt");
        if (nr) rows.push({ nr: nr.textContent.replace("Nr. ", ""), name: t.textContent.replace(nr.textContent, "").replace(alt ? alt.textContent : "", "").trim(), page: no });
      });
    });
    const tocs = [...root.querySelectorAll(":scope > .page.rb-toc")];
    for (let i = 0; i < tocs.length; i++) {
      const chunk = rows.slice(i * RB_TOC_ROWS, (i + 1) * RB_TOC_ROWS);
      const inner = tocs[i].querySelector(".page-inner");
      inner.innerHTML = (i === 0 ? `<h3>${RULES.de() ? "Inhalt" : "Contents"}</h3>` : "") + `<div class="rb-index">${chunk.map((r) => `<div class="rb-row"><span class="rb-nr">${r.nr}</span><span class="rb-nm">${e(r.name)}</span><span class="tp">${r.page}</span></div>`).join("")}</div>`;
      const box = document.createElement("div");
      tocs[i].before(box);
      box.append(tocs[i]);
      TYPESET.fit(box);
      box.replaceWith(tocs[i]);
    }
  }

  // Leere Seite vor einem mehrseitigen Zauber
  const fillerHTML = () => `<div class="filler"><svg viewBox="-50 -50 100 100" class="filler-orn"><circle r="44"/><circle r="38" class="thin"/><path d="M0-38L33 19-33 19Z M0 38L33-19-33-19Z" class="thin"/><circle r="6"/></svg><div class="filler-txt">${b("book.filler")}</div></div>`;

  // Regelband: zweites Buch nur mit Regeltexten, nummeriert wie das Inhaltsverzeichnis des Zauberbuchs
  function rulesBook(entries, settings) {
    const D = RULES.de();
    const pages = [{ cls: "title-page", no: 1, running: "", html: D
      ? `<div class="tp"><h1>Regelband</h1><div class="tp-owner">${e(settings.bookTitle)}</div><div class="tp-sub">Regeltexte aller Formeln in der Reihenfolge des Zauberbuchs · Open Game Content (OGL 1.0a)</div></div>`
      : `<div class="tp"><h1>Rules Volume</h1><div class="tp-owner">${e(settings.bookTitle)}</div><div class="tp-sub">Rules texts of all formulae in the order of the spellbook · Open Game Content (OGL 1.0a)</div></div>` }];
    const groups = new Map();
    entries.forEach(({ m }, i) => {
      const k = D ? (m.spell.everyday ? "Alltagszauber" : m.level === 0 ? "Zaubertricks" : U.ROMAN[m.level] + ". Grad") : (m.spell.everyday ? "Everyday spells" : m.level === 0 ? "Cantrips" : "Level " + m.level);
      if (!groups.has(k)) groups.set(k, []);
      groups.get(k).push(rulesBox(m, i + 1));
    });
    // Platzhalter fürs Inhaltsverzeichnis; rulesIndex() füllt sie nach dem Setzen (dann stehen die Seiten fest)
    for (let i = 0; i < Math.ceil(entries.length / RB_TOC_ROWS); i++) pages.push({ no: 0, running: D ? "Regelband · Inhalt" : "Rules Volume · Contents", cls: "rb-toc", html: "" });
    // je Abschnitt eine fließende Seite; der Umbruch verteilt sie auf Folgeseiten
    for (const [k, boxes] of groups) pages.push({ no: 0, running: (D ? "Regelband · " : "Rules Volume · ") + k, cls: "rules-page flow", html: `<h3>${e(k)}</h3>` + boxes.join("") });
    return pages;
  }

  window.BOOK = { spellPages, prayerPages, scrollPages, assemble, volumes, rulesBook, rulesIndex, rulesBox, frontMatter, chapterKey, chapterName, rank, deityPage };
})();
