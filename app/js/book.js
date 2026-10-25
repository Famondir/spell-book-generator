// Seitenplanung und HTML der Buchseiten.
// Umfang: Grad 0 = halbe Seite, Grad n = n Seiten. Jede Seite ist ein festes A5-Blatt.
(function () {
  const T = window.THEORY;
  const e = U.esc;
  const SCHOOL_DE = (m) => m.schoolInfo.de;

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
      <div class="sp-meta">${m.spell.everyday ? "Alltagszauber" : m.level === 0 ? "Fingerübung" : U.ROMAN[m.level] + ". Ordnung"} · ${e(SCHOOL_DE(m))}${m.subschools.length ? " (" + m.subschools.map((s) => T.SUBSCHOOLS[s].de).join(", ") + ")" : ""}</div>
      <h2 class="sp-title">${e(t.title)}</h2>
      <div class="sp-epithet">${e(t.epithet)}</div>
      <div class="sp-rulename">${e(RULES.name(m))}${m.spell.everyday ? ` · nach ${e(RULES.name(window.SPELLS.find((x) => x.name === m.spell.base) || m))}` : ""}</div>
    </header>`;
  }
  const circleBox = (m, t, cls, opts = {}) => `<figure class="circle-box ${cls}">${renderCircle(m, { text: t.formula.band, ...opts })}</figure>`;
  function formulaBlock(t, withTone = true) {
    return `<div class="formula">${t.formula.lines.map((l) => `<div class="fl">${e(l)}</div>`).join("")}${withTone ? `<div class="tone">Vortrag: ${e(t.formula.tone)}.</div>` : ""}</div>`;
  }
  function componentsBlock(m, t) {
    const c = m.components;
    const tags = [c.V && "V", c.S && "S", c.M && "M", c.F && "F", c.DF && "GF"].filter(Boolean).join(" · ");
    return `<div class="comp"><span class="comp-tags">${tags || "—"}</span> <span class="comp-time">${e(m.casting.de)}</span>
      ${t.materials.map((x) => `<div class="mat"><b>${e(x.k)}:</b> ${e(x.t)}${x.orig ? ` <i class="orig">„${e(x.orig)}“</i>` : ""}</div>`).join("")}</div>`;
  }
  const gesturesBlock = (t, n) => `<h4>Gesten</h4><ol class="gest">${t.gestures.slice(0, n || 99).map((g) => `<li>${e(g.replace(/\.?$/, "."))}</li>`).join("")}</ol>`;
  const theoryBlock = (t, heads) =>
    t.theory.filter((p) => !heads || heads.includes(p.h)).map((p) => `<h4>${e(p.h)}</h4><p>${e(p.t)}</p>`).join("");
  const structureBlock = (t) => `<h4>Aufbau des Kreises</h4><dl class="struct">${t.structure.map((s) => `<dt>${e(s.k)}</dt><dd>${e(s.t)}</dd>`).join("")}</dl>`;
  const stepsBlock = (t, compact) =>
    `<h4>Ausführung</h4><div class="steps ${compact ? "compact" : ""}">${t.steps
      .map((p, i) => `<div class="phase"><div class="ph">${U.ROMAN[i + 1]}. ${e(p.h)}</div><ol>${p.items.map((x) => `<li>${e(x.replace(/\.?$/, "."))}</li>`).join("")}</ol></div>`)
      .join("")}</div>`;
  const note = (txt) => (txt ? `<aside class="note">${e(txt)}</aside>` : "");
  function calibrationBlock(t) {
    if (!t.calibration) return "";
    const c = t.calibration;
    return `<h4>Kalibrierung nach Zauberstufe</h4><table class="calib"><tr>${c.cols.map(([, h]) => `<th>${e(h)}</th>`).join("")}</tr>${c.rows
      .map((r) => `<tr>${c.cols.map(([k]) => `<td>${e(r[k] ?? "")}</td>`).join("")}</tr>`)
      .join("")}</table>`;
  }
  function essenceBlock(m) {
    return `<h4>Essenzanalyse</h4><div class="essbars">${m.essences
      .map((x) => {
        const E = T.ESS[x.id];
        return `<div class="essrow">${glyphSVG("essence", x.id, { s: 8, cls: x.id === m.primary ? "accent" : "" })}<span class="essname">${E.latin}</span><span class="essbar"><i style="width:${x.pct}%"></i></span><span class="esspct">${x.pct} %</span></div><p class="esstext">${e(E.text)}</p>`;
      })
      .join("")}</div>`;
  }
  function correspondBlock(t) {
    const c = t.correspond;
    return `<h4>Entsprechungen</h4><table class="corr"><tr><th>Stunde</th><td>${e(c.hour)}</td><th>Gestirn</th><td>${e(c.planet)}</td></tr><tr><th>Farbe</th><td>${e(c.color)}</td><th>Metall</th><td>${e(c.metal)}</td></tr><tr><th>Richtung</th><td>${e(c.dir)}</td><th>Himmel</th><td>${e(c.body)}</td></tr></table>`;
  }
  const failureBlock = (t) => `<h4>Fehlerbilder und Rückschlag</h4><dl class="struct">${t.failure.map((f) => `<dt>${e(f.k)}</dt><dd>${e(f.t)}</dd>`).join("")}</dl>`;
  const counterBlock = (m, t) =>
    `<h4>Gegenformel</h4><div class="counter">${`<figure class="circle-box mini mirror">${renderCircle(m, { layers: ["outer", "signs", "essence", "duration", "core"], zoom: 250 })}</figure>`}<p>${e(t.counter.t)}</p></div>`;
  const practiceBlock = (t) =>
    `<h4>Übungsprotokoll</h4><table class="calib"><tr><th>Datum</th><th>Ort</th><th>Ergebnis</th></tr>${t.practice.map((p) => `<tr><td>${e(p.date)}</td><td>${e(p.place)}</td><td>${e(p.result)}</td></tr>`).join("")}</table>`;
  const longFormulaBlock = (t) =>
    `<h4>Die Formel in Langform</h4><p class="hint">Für das Wirken unter erschwerten Umständen: Anrufung (A) und Antwort (R) wechseln sich ab; die Antwort darf auch gedacht werden.</p><div class="longf">${t.longFormula
      .map((l) => `<div class="lf ${l.k}"><span>${l.k}</span>${e(l.t)}</div>`)
      .join("")}</div>`;
  const learningBlock = (t) => `<h4>Herkunft und Abschrift</h4><p>${e(t.learning)}</p>`;
  // short: nur die deutsche Einordnung; der englische Mythic-Regeltext steht im Regelkasten/-anhang
  // Die mythische Variante als In-Game-Text. Der englische Mythic-Text ist Regeltext und steht nur
  // im Regelkasten bzw. Regelanhang.
  function mythicBlock(m, t, short) {
    if (!m.mythic) return "";
    const txt = m.spell.mythic;
    const aug = [...txt.matchAll(/Augmented \((\d+)(?:st|nd|rd|th)\)/g)].map((x) => +x[1]);
    const two = /(two|2) uses of mythic power/i.test(txt);
    if (short)
      return `<h4>Mythische Resonanz</h4><p>Mit Mythenkraft überladbar: äußerer Ring doppelt, Mythenpunkt im Kern${aug.length ? `; ab dem ${aug[0]}. Mythenrang ein dritter Ring${two ? " für einen zweiten Zug Mythenkraft" : ""}` : ""}.</p>`;
    let p = "Wer den Funken der Mythen trägt, kann diese Formel mit eigener Mythenkraft überladen. Der Kreis bleibt derselbe; nur der äußere Ring wird doppelt gezogen, mit neun Mythenpunkten besetzt, und ein Mythenpunkt in den Kern gesetzt.";
    if (aug.length) p += ` Ab dem ${aug.join(". bzw. ")}. Mythenrang lässt sich die Überladung weiter steigern: Dann wird ein dritter, gestrichelter Ring gezogen${two ? ", und die Formel verlangt einen zweiten Zug Mythenkraft" : ""}.`;
    const fig = short ? "" : `<figure class="circle-box mythic-box">${renderCircle(m, { text: t.formula.band, mythic: aug.length ? "augmented" : true, zoom: 275 })}<figcaption>Mythisch überladener Kreis</figcaption></figure>`;
    return `<h4>Mythische Resonanz</h4><p>${e(p)}</p>${fig}`;
  }
  function annotatedBlock(m, t, h = "Beschrifteter Kreis") {
    const list = circleAnnotations(m);
    return `<h4>${e(h)}</h4><figure class="circle-box annotated-box">${renderCircle(m, { text: t.formula.band, annotate: true })}</figure>
      <ol class="annot-list">${list.map((a) => `<li value="${a.n}"><b>${e(a.k)}:</b> ${e(a.t)}</li>`).join("")}</ol>`;
  }
  function quickBlock(m) {
    return `<h4>Schnellglyphe</h4><div class="quick-row">${quickGlyph(m)}<p>Für das Zeichnen in Eile: ${m.duration.kind === "instant" ? "offener" : "geschlossener"} Kreis, darin ${m.schoolInfo.de === "Universalmagie" ? "das Kreuz" : "die Kurzfigur der " + e(m.schoolInfo.de)} und ${THEORY.ESS[m.primary].latin} im Zentrum${m.level ? `, ${m.level} Punkt${m.level > 1 ? "e" : ""} für die Ordnung` : ""}. Wirkt nur für den, der den vollen Kreis schon einmal gezeichnet hat.</p></div>`;
  }
  function submatricesBlock(m, t) {
    const parts = [
      ["Kern", ["core"], 80],
      ["Essenz & Zeichen", ["essence", "signs"], 150],
      ["Weite & Ordnung", ["range", "order"], 205],
      ["Band & Schwellen", ["outer", "gates", "sr"], 255],
    ];
    return `<h4>Teilmatrizen</h4><p class="hint">Zum Üben werden die Schichten einzeln gezeichnet, bevor der vollständige Kreis gelingt.</p><div class="subm">${parts
      .map(([h, layers, z]) => `<figure class="circle-box sub">${renderCircle(m, { layers, zoom: z + 15, text: t.formula.band })}<figcaption>${e(h)}</figcaption></figure>`)
      .join("")}</div>`;
  }

  function glossaryBlock(t) {
    const words = [];
    for (const l of t.formula.lines) for (const w of l.toLowerCase().replace(/[!,.]/g, "").split(/\s+/)) if (w && !words.includes(w)) words.push(w);
    const rows = words.filter((w) => T.GLOSSARY[w]);
    if (rows.length < 3) return "";
    return `<h4>Wortglossar der Formel</h4><div class="gloss">${rows.map((w) => `<div><b>${e(w)}</b> – ${e(T.GLOSSARY[w])}</div>`).join("")}</div>`;
  }
  function sketchBlock(m, t) {
    const r = U.rng(m.seed ^ 0x9e37);
    const drafts = [
      [["core", "essence", "signs", "outer"], "Dauerring vergessen – die Ladung lief aus."],
      [["core", "duration", "signs", "outer", "range"], "Ohne Essenzring: Der Kern blieb stumm."],
      [["essence", "duration", "signs", "outer", "order"], "Kernsiegel ausgelassen – keine Richtung, kein Verb."],
      [["core", "essence", "duration", "range"], "Schriftband nicht gezogen. Nichts geschah."],
    ];
    const pick = r.sample(drafts, 2);
    return `<h4>Verworfene Entwürfe</h4><div class="sketches">${pick
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
    return `<h4>Verwandte Formeln</h4><ul class="related">${rel.map((o) => `<li>${e(generateTexts(o).title)} <span>(${e(o.name)}, ${o.level === 0 ? "Fingerübung" : U.ROMAN[o.level] + ". Ordnung"})</span></li>`).join("")}</ul>`;
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
      theory2: () => theoryBlock(t, ["Grundsatz der Schule", "Essenzen", "Weite und Dauer"]),
      wirk: () => theoryBlock(t, ["Grundsatz der Schule"]).replace(/<h4>.*?<\/h4>/, "<h4>Wirkprinzip</h4>"),
      struct: () => structureBlock(t),
      detail: () => `<figure class="circle-box detail">${renderCircle(m, { layers: ["core", "essence", "duration", "signs"], zoom: 150 })}<figcaption>Kern, Essenz- und Zeichenring vergrößert</figcaption></figure>`,
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
      p.html += keys.map((k) => `<div class="opt off" data-k="${k}">${B[k]()}</div>`).join("");
      p.spell = m.id;
    }
    return pages;
  }

  // Schriftrolle: Vorderseite Name + großer Kreis, Rückseite Formel, Komponenten, Gesten und Regeln
  // opts.paper = "a4": Rückseite nativ in A4 mit zweispaltigem Regeltext (Vorderseite wird beim Druck skaliert)
  function scrollPages(m, t, opts = {}) {
    const a4 = opts.paper === "a4";
    const front = `<div class="scroll-front">
        <div class="sp-meta">${m.spell.everyday ? "Alltagszauber" : m.level === 0 ? "Fingerübung" : U.ROMAN[m.level] + ". Ordnung"} · ${e(m.schoolInfo.de)}</div>
        <h2 class="sp-title">${e(t.title)}</h2>
        <div class="sp-epithet">${e(t.epithet)}</div>
        <figure class="circle-box scroll-circle">${renderCircle(m, { text: t.formula.band })}</figure>
        <div class="sp-rulename">${e(RULES.name(m))}</div>
      </div>`;
    const back = `${head(m, t, true)}${formulaBlock(t)}${componentsBlock(m, t)}${gesturesBlock(t, 4)}
      ${rulesBox(m)}`;
    return [
      { html: front, spell: m.id, cls: "scroll-page", running: "Schriftrolle" },
      { html: back, spell: m.id, cls: "scroll-page scroll-back flow" + (a4 ? " a4native" : ""), running: "Schriftrolle · Rückseite" },
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
    if (D && src.de) return `<div class="rules-source"><div><b>Quelle</b> ${e(src.de)} · englisch: ${e(src.en)}</div><div><b>Regeltext</b> Open Game Content (OGL 1.0a), deutsch nach dem Deutschen Pathfinder-Referenzdokument (MyPFDB); deutsche Begriffe mit freundlicher Genehmigung von Ulisses Spiele</div></div>`;
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
        <h1>${e(settings.bookTitle)}</h1><div class="tp-owner">${e(settings.owner)}</div><div class="tp-sub">${e(settings.subtitle || "")}</div></div>`,
    });
    // Anatomie eines Kreises (Beispiel: Feuerball oder erster Zauber)
    const sample = analyze(window.SPELLS.find((s) => s.name === "Fireball"));
    const st = generateTexts(sample, { name: settings.owner });
    pages.push({
      html: `<h3>Von der Lesart der Kreise</h3><p>Jede Formel in diesem Buch ist als Kreis notiert. Ein Kreis wird von außen nach innen gelesen und von innen nach außen gezeichnet. Die Lehre folgt drei Sätzen:</p>
      <ol class="laws"><li><b>Der Kreis ist ein Fluss.</b> Was in ihm kreist, bleibt erhalten; was ihn verlässt, wirkt. Geschlossene Ringe halten eine Wirkung über die Zeit, eine offene Matrix gibt sie augenblicklich frei.</li>
      <li><b>Nichts entsteht aus nichts.</b> Jede Wirkung wird bezahlt – mit vorbereiteter Kraft, mit Stoff oder mit dem Wirker selbst.</li>
      <li><b>Erfassen, Lösen, Fügen.</b> Wer eine Formel nicht verstanden hat, kann sie nicht lösen; wer sie nicht löst, kann nichts Neues fügen.</li></ol>
      <figure class="circle-box anatomy">${renderCircle(sample, { text: st.formula.band, annotate: true })}</figure>
      <p class="hint">Beispiel: ${e(st.title)} (Fireball). Die Ziffern werden auf der folgenden Seite erklärt.</p>`,
    });
    pages.push({
      html: `<h3>Erweitertes Beispiel: ${e(st.title)}</h3>
      <p>Der Feuerball ist eine Hervorrufung der III. Ordnung. So liest man seinen Kreis, Schicht für Schicht von außen nach innen:</p>
      <ol class="annot-list">${circleAnnotations(sample).map((a) => `<li value="${a.n}"><b>${e(a.k)}:</b> ${e(a.t)}</li>`).join("")}</ol>
      <p>Zusammen gelesen: <i>Eine gesprochene, gestische Formel mit Schwefel als Preis, in einer Standard-Aktion gewirkt. Sie trägt weit (vier Ringe), entlädt sich augenblicklich (offene Matrix) als Ausbreitung von Ignis, gestützt von Vis. Ein Ziel kann ihr durch Reflex zur Hälfte ausweichen; Zauberresistenz wirkt.</i></p>`,
    });
    pages.push({
      html: `<h3>Die Schichten</h3><dl class="struct">
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
    });
    // Schulen
    pages.push({
      html: `<h3>Die Schulen – das Verb</h3>${LEGEND.grid(LEGEND.schools(14), "schools")}`,
    });
    // Essenzen
    pages.push({
      html: `<h3>Die sechzehn Essenzen – das Substantiv</h3><p class="hint">Acht Gegensatzpaare, abgeleitet aus den Ebenen der Großen Ordnung. Jede Formel trägt einen Anteil mehrerer Essenzen.</p>${LEGEND.grid(LEGEND.essences(9), "ess")}`,
    });
    // Zeichen + Alchemie
    pages.push({
      html: `<h3>Die Zeichen – das Wie</h3>${LEGEND.grid(LEGEND.signs(8), "signs")}`,
    });
    const ex = ["Fireball", "Shield", "Charm Person", "Magic Missile", "Teleport", "Animate Dead"].map((n) => window.SPELLS.find((s) => s.name === n)).filter(Boolean).map(analyze);
    pages.push({
      html: `<h3>Schnellglyphen</h3><p>Am Spieltisch bleibt keine Zeit für den vollen Kreis. Wer eine Formel einmal vollständig gezeichnet hat, kann sie mit ihrer Schnellglyphe abrufen – fünf Striche statt fünfzig:</p>
      ${LEGEND.quickRules()}
      ${LEGEND.grid(LEGEND.quickSchools(), "quick-schools")}
      <div class="quick-ex">${ex.map((m) => `<figure>${quickGlyph(m)}<figcaption>${e(generateTexts(m).title)}<br><span>${e(RULES.name(m))}</span></figcaption></figure>`).join("")}</div>`,
    });
    pages.push({
      html: `<h3>Stoffe und Zeichen der Alchemie</h3>${LEGEND.grid(LEGEND.alchemy(8), "alch")}
        <h3>Benannte Verbindungen</h3><p class="combos">${Object.entries(T.COMBOS).map(([k, v]) => `<span><b>${e(v)}</b> ${k.split("+").map((x) => T.ESS[x].latin).join(" + ")}</span>`).join(" · ")}</p>`,
    });
    // Affinitäten (aus allen Zaubern errechnet)
    const aff = schoolAffinities(allModels);
    const order = T.ESSENCES.map((x) => x.id);
    pages.push({
      html: `<h3>Affinitäten der Schulen</h3><p class="hint">Durchschnittlicher Anteil jeder Essenz in allen ${allModels.length} bekannten Formeln einer Schule, in Prozent.</p>
      <table class="aff"><tr><th></th>${order.map((id) => `<th title="${T.ESS[id].de}">${glyphSVG("essence", id, { s: 6 })}</th>`).join("")}</tr>
      ${Object.entries(aff)
        .sort((a, b) => b[1].n - a[1].n)
        .map(([sc, a]) => `<tr><th>${e((T.SCHOOLS[sc] || T.SCHOOLS.universal).de)}</th>${order.map((id) => {
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
  function canonBlock(t) {
    return `<div class="canon"><h4>Kanon der Kirche <span class="muted">· ${e(t.canon.tone)}</span></h4>${t.canon.lines.map((l) => `<div class="cl ${l.r ? "refrain" : ""}">${l.r ? "<span>℟</span> " : ""}${e(l.t)}</div>`).join("")}</div>`;
  }
  function ownBlock(own) {
    const has = !!(own && own.trim());
    const body = has
      ? own.trim().split(/\n{2,}/).map((p) => `<p>${e(p).replace(/\n/g, "<br>")}</p>`).join("")
      : `<div class="own-lines">${"<i></i>".repeat(5)}</div>`;
    return `<div class="own ${has ? "" : "empty"}"><h4>Eigene Worte</h4><div class="own-text">${body}</div></div>`;
  }
  const SAVE_EFFECT = { negates: "hebt auf", half: "halbiert", partial: "teilweise", disbelief: "Anzweifeln" };
  function prayerPages(m, t, opts = {}) {
    const d = t.deity || window.DEITY;
    const fact = (k, v) => (v ? `<div><b>${k}</b> ${e(v)}</div>` : "");
    const html = `<header class="sp-head pr-head">${refBlock(m, opts.ref)}
        <div class="sp-meta">${foreign(m) ? "Fremdes Gebet" : U.ROMAN[m.level] + ". Grad"} · ${e(m.schoolInfo.de)}</div>
        <h2 class="sp-title">${e(t.title)}</h2>
        <div class="sp-rulename">${e(RULES.name(m))}</div>
      </header>
      <div class="pr-grid">
        <figure class="vt-box">${VITRAIL.render(m, d)}</figure>
        <div class="pr-side">
          <div class="pr-facts">${fact("Gebet", m.casting.de)}${fact("Reichweite", m.range.de)}${fact("Dauer", m.duration.de)}${fact("Rettungswurf", m.save.type !== "none" ? m.save.de + (SAVE_EFFECT[m.save.effect] ? ", " + SAVE_EFFECT[m.save.effect] : "") + (m.save.harmless ? " (harmlos)" : "") : "")}</div>
          ${canonBlock(t)}
        </div>
      </div>
      ${ownBlock(opts.own)}`;
    return [{ html, first: true, spell: m.id }];
  }

  function deityPage(d) {
    if (!d) return `<h3>Gottheit</h3><p class="hint">Keine Gottheit gewählt (Einstellungen → Charakter).</p>`;
    const ep = PRAYER.epithet(d);
    const base = VITRAIL.palette(d)[0];
    const row = (k, v) => (v ? `<dt>${k}</dt><dd>${v}</dd>` : "");
    const de = (list, dict) => list.map((x) => e(dict[x] || dict[String(x).toLowerCase()] || x)).join(", ");
    return `<h3>${e(d.name)}</h3><div class="dt-title">${e(d.title)}${ep ? ` · ${e(ep)}` : ""}</div>
      <figure class="dt-symbol"><svg viewBox="-12 -12 24 24">${VITRAIL.symbolSVG(d.symbol, 0, 0, 10, base)}</svg></figure>
      <dl class="struct">
        ${row("Gesinnung", e(ALIGN_DE[d.align] || d.align))}${row("Pantheon", e(d.pantheon))}
        ${row("Zuständigkeiten", de(d.areas, PRAYER.AREA))}${row("Domänen", de(d.domains, PRAYER.DOMAIN))}
        ${row("Lieblingswaffe", e(d.weapon))}${row("Heiliges Symbol", e(d.symbol))}${row("Heiliges Tier", e(d.animal))}
        ${row("Heilige Farben", d.colors.map((c) => `<span class="swatch" style="background:${c.hex}"></span>${e(c.name)}`).join(" "))}
      </dl>
      <p class="hint dt-legal">Angaben nach Archives of Nethys. Name und Angaben der Gottheit gehören Paizo Inc. und werden beschreibend unter Paizos Community Use Policy verwendet.</p>`;
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
          <h1>${e(settings.bookTitle)}</h1><div class="tp-owner">${e(settings.owner)}</div><div class="tp-sub">${e(settings.subtitle || (d ? "Gebete an " + d.name : ""))}</div></div>`,
      },
      { html: deityPage(d) },
      {
        html: `<h3>${Wd.read}</h3><p>Zu jedem Gebet gehört ein ${Wd.item}. Es wird nicht ${stone ? "gemeißelt" : "gezeichnet"}, um verstanden zu werden, sondern um davor zu knien. Wer es dennoch lesen will, findet darin alles, worum das Gebet bittet:</p>
          <div class="pr-grid"><figure class="vt-box">${VITRAIL.render(sample, d, { annotate: true })}</figure>
          <ol class="annot-list vt-legend">${legend.map((l) => `<li value="${l.n}"><b>${e(l.k)}:</b> ${e(l.t)}</li>`).join("")}</ol></div>
          <p class="hint">Beispiel: ${e(PRAYER.texts(sample, d).title)} (${e(sample.name)}). Die folgenden Seiten zeigen alle Farben und Formen.</p>`,
      },
      { html: glassPage(d) },
      { html: formsPage(d) },
      { html: medallionPage(d) },
      {
        html: `<h3>Vom Gebet</h3>
          <p>Jeden Tag zur selben Stunde verbringt der Streiter eine Stunde in stillem Gebet und Betrachtung. Was er erbittet, wird ihm gewährt, solange er dem Kodex treu bleibt; er muss es nicht verstehen, nur darum bitten.</p>
          <p>Jedes Gebet in diesem Brevier hat zwei Teile. Der <b>Kanon der Kirche</b> ist überliefert: Alle Gläubigen sprechen ihn gleich, und sein Kehrvers kehrt in jedem Gebet wieder. Die <b>Eigenen Worte</b> gehören dem Betenden allein. Wo noch keine stehen, bleiben Linien frei.</p>
          <p>Ein heiliges Symbol in der Hand genügt als Fokus. Rüstung behindert das Gebet nicht.</p>`,
      },
    ]);
  }


  // Legendenseiten des Breviers: alle Gläser und Formen, die ein Fenster tragen kann
  function glassPage(d) {
    const base = VITRAIL.palette(d);
    const stone = VITRAIL.materialFor(d) === "stone";
    const intro = stone
      ? "Jede Essenz hat ihren eigenen Stein. Er erscheint als Akzentstein, so oft wie ihr Anteil am Zauber, und im Medaillon, wenn sie die Hauptessenz ist."
      : "Jede Essenz hat ihr eigenes Glas. Es erscheint als Akzentscheibe, so oft wie ihr Anteil am Zauber, und im Medaillon, wenn sie die Hauptessenz ist.";
    const colors = d && d.colors.length
      ? d.colors.map((c, i) => `<span class="swatch" style="background:${stone ? base[i] : c.hex}"></span>${e(c.name)}${stone ? ` (${e(VITRAIL.colorStoneName(c.name))})` : ""}`).join(" ")
      : d ? "keine überliefert, daher eine Palette nach Gesinnung: " + base.map((c) => `<span class="swatch" style="background:${c}"></span>`).join("") : "";
    return `<h3>${stone ? "Die Steine" : "Die Gläser"}</h3><p class="hint">${intro}</p>
      <div class="legend-grid vt-glass">${T.ESSENCES.map((x) => `<div class="lg">${VITRAIL.essSwatch(x.id)}<div><b>${x.latin}</b> – ${e(x.de.replace(/ \(.*\)$/, ""))}${stone ? ` · <i>${e(VITRAIL.essStoneName(x.id))}</i>` : ""}<br><span>Gegenpol: ${T.ESS[x.opp].latin}</span></div></div>`).join("")}</div>
      <h4>${stone ? "Grundsteine" : "Grundscheiben"}</h4><p>Die übrigen ${stone ? "Steine" : "Scheiben"} tragen die heiligen Farben der Gottheit${d ? ` – bei ${e(d.name)}: ` : ""}${colors}. Die erste Farbe fasst auch das Medaillon und färbt den Grund des ${stone ? "Sechseckfelds" : "Bogenfelds"}.</p>`;
  }
  function formsPage(d) {
    const base = VITRAIL.palette(d);
    const tint = base[0];
    const schools = Object.entries(T.SCHOOLS).filter(([k]) => k !== "universal").concat([["universal", T.SCHOOLS.universal]]);
    const durs = [["instant", "Augenblicklich – schlichtes Band"], ["rounds", "Runden – Quader"], ["minutes", "Minuten – Wellen"], ["hours", "Stunden – zwei Streifen"], ["days", "Tage – Zinnen"], ["permanent", "Permanent – Ringkette"], ["concentration", "Konzentration und Besonderes – Rauten"]];
    const stone = VITRAIL.materialFor(d) === "stone";
    return `<h3>Maßwerk, Zellen und Sockel</h3>
      <h4>${stone ? "Schichten" : "Bahnen"} – der Grad</h4><div class="vt-row">${[1, 2, 3, 4].map((g) => `<figure>${VITRAIL.ornament(g).replace('class="vt-orn"', 'class="vt-orn small"')}<figcaption>${U.ROMAN[g]}. Grad</figcaption></figure>`).join("")}</div>
      <h4>${stone ? "Rauten im Sechseckfeld" : "Pässe im Bogenfeld"} – die Schule</h4><div class="vt-row">${schools.map(([k, sc]) => `<figure>${VITRAIL.foilsMini(VITRAIL.foilCount(k), tint)}<figcaption>${e(sc.de)}<br>${VITRAIL.foilCount(k)} ${stone ? "Rauten" : "Pässe"}</figcaption></figure>`).join("")}</div>
      <h4>Zellen – die Gestalt</h4><div class="vt-row">
        <figure>${VITRAIL.cellsMini("even", base)}<figcaption>gleichmäßig<br>Ziele, Berührung, selbst</figcaption></figure>
        <figure>${VITRAIL.cellsMini("stretched", base)}<figcaption>${stone ? "in Schichtrichtung" : "gestreckt"}<br>Strahl, Linie, Kegel</figcaption></figure>
        <figure>${VITRAIL.cellsMini("radial", base)}<figcaption>in Ringen<br>Explosion, Ausbreitung, Ausströmung</figcaption></figure>
        <figure>${VITRAIL.borderMini(true, base)}<figcaption>Bordüre<br>Rettungswurf</figcaption></figure>
        <figure>${VITRAIL.borderMini(false, base)}<figcaption>ohne Bordüre<br>kein Rettungswurf</figcaption></figure></div>
      <h4>Sockel – die Wirkungsdauer</h4><div class="vt-socles">${durs.map(([k, t]) => `<div>${VITRAIL.socleMini(k, base)}<span>${e(t)}</span></div>`).join("")}</div>`;
  }

  function medallionPage(d) {
    const base = VITRAIL.palette(d);
    return `<h3>Das Medaillon</h3><p class="hint">Die Rosette in der Mitte der ${VITRAIL.materialFor(d) === "stone" ? "Schichten" : "Bahnen"} trägt die Farben der Haupt- und der zweiten Essenz. Ihre Form erzählt, wie das Gebet gesprochen wird:</p>
      <h4>Blätter – die Reichweite</h4><div class="vt-row med">${[[0, "persönlich", false], [4, "Berührung"], [6, "nah"], [8, "mittel"], [12, "weit"], [16, "unbegrenzt", true]].map(([p, t, u]) => `<figure>${VITRAIL.medallionMini({ petals: p, unlimited: !!u }, base)}<figcaption>${t}${p ? `<br>${p} Blätter` : "<br>Scheibe"}</figcaption></figure>`).join("")}</div>
      <h4>Fassung – die Komponenten</h4><div class="vt-row med">${[[0, "keine"], [3, "eine"], [4, "zwei, z. B. V, S"], [5, "drei, z. B. V, S, GF"], [6, "vier"], [7, "fünf"]].map(([c, t]) => `<figure>${VITRAIL.medallionMini({ corners: c }, base)}<figcaption>${t}</figcaption></figure>`).join("")}</div>
      <h4>Blattform und Ring – Zeitaufwand und Zauberresistenz</h4><div class="vt-row med">
        <figure>${VITRAIL.medallionMini({ tip: "pointed" }, base)}<figcaption>spitz<br>schnell, augenblicklich</figcaption></figure>
        <figure>${VITRAIL.medallionMini({ tip: "round" }, base)}<figcaption>rund<br>Standard-Aktion</figcaption></figure>
        <figure>${VITRAIL.medallionMini({ tip: "double" }, base)}<figcaption>zwei Kränze<br>volle Aktion und länger</figcaption></figure>
        <figure>${VITRAIL.medallionMini({ sr: true, corners: 5 }, base)}<figcaption>zweiter Ring<br>Zauberresistenz</figcaption></figure></div>`;
  }

  const DIVINE_TEXT = {
    1: ["Ein Fenster, ein Licht", "Die ersten Gebete sind kurz und nah. Sie bitten um das, was ein Streiter jeden Tag braucht: eine feste Hand, ein klares Auge, ein Wort zur rechten Zeit.", "Wer sie spricht, lernt, dass Gnade nicht verdient, sondern empfangen wird."],
    2: ["Zwei Bahnen", "Mit dem zweiten Grad trägt das Gebet weiter. Es heilt, was der Kampf schlug, und schützt, wer hinter dem Schild steht.", "Die Kunst dieser Stufe ist Geduld: Nicht jede Bitte wird sofort erhört."],
    3: ["Drei Bahnen unter einem Bogen", "Gebete des dritten Grades verändern, was sie berühren. Flüche weichen, Gift verliert seine Macht, und das Licht brennt, wo es gerufen wird.", "Wer hier betet, steht nicht mehr allein vor dem Altar."],
    4: ["Das volle Fenster", "Der vierte Grad ist das Höchste, was einem Streiter gewährt wird. Diese Gebete wenden Schlachten und rufen zurück, was verloren schien.", "Sie werden selten gesprochen und nie ohne Furcht."],
    foreign: ["Aus anderen Händen", "Formeln, die nicht aus dem Kanon dieser Kirche stammen. Sie stehen hier, weil sie einmal wichtig waren.", "Ob die Gottheit sie erhört, ist eine andere Frage."],
  };
  function divineChapterHTML(k, no, cont) {
    const g = /^\d$/.test(k) ? +k : 0;
    const own = (window.PROFILE && PROFILE.chapters && PROFILE.chapters[k]) || null;
    let [sub, ...paras] = own || DIVINE_TEXT[k] || [`${g} Bahnen`, "Gebete höheren Grades."];
    if (!own && VITRAIL.materialFor(window.DEITY) === "stone") sub = { 1: "Ein Stein, ein Licht", 3: "Drei Bahnen unter einem Giebel", 4: "Die volle Tafel" }[k] || sub;
    const title = (k === "foreign" ? "Fremde Gebete" : CLASS.chapter ? CLASS.chapter(g) : `Gebete des ${U.ROMAN[g]}. Grades`) + (cont ? " (Fortsetzung)" : "");
    return `<div class="chapter"><div class="ch-kicker">Kapitel ${U.ROMAN[no] || no}</div><h1 class="ch-title">${e(title)}</h1>${VITRAIL.withMaterial(window.DEITY, () => VITRAIL.ornament(Math.max(1, g || 1)))}<div class="ch-sub">${e(sub)}</div>${paras.map((p) => `<p>${e(p)}</p>`).join("")}</div>`;
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
        const line = `<div class="tp-vol">Band ${U.ROMAN[vol.no] || vol.no}${vol.label ? " · " + e(vol.label) : ""}</div>`;
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
          pendingHalf = { html: block, no: pageNo, running: m.spell.everyday ? "Alltagszauber" : "Fingerübungen", halves: true };
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
        lp.html = `<h3>${divine() ? "Gebete" : "Formeln"} dieses Kapitels${i ? " (Forts.)" : ""}</h3><div class="ch-list">${part.map((x) => `<div class="ch-row"><span class="tq">${quickGlyph(x.m)}</span><span class="ch-nm">${e(x.t.title)}<i>${e(RULES.name(x.m))}</i></span><span class="tp">${x.page}</span></div>`).join("")}</div>`;
      });
    }
    front.forEach((p, i) => pages.push({ ...p, no: i + 1, running: "" }));
    if (settings.frontMatter) {
      for (let i = 0; i < tocPageCount; i++) {
        const chunk = toc.slice(i * PER_TOC, (i + 1) * PER_TOC);
        pages.push({
          no: front.length + i + 1,
          running: "Verzeichnis",
          html: (i === 0 ? `<h3>Verzeichnis der ${divine() ? "Gebete" : "Formeln"}</h3>` : "") +
            `<table class="toc">${chunk.map((x) => `<tr><td class="tq">${quickGlyph(x.m)}</td><td class="tg">${x.m.spell.everyday ? "A" : x.m.level === 0 ? "0" : U.ROMAN[x.m.level]}</td><td>${e(x.t.title)}<span class="tn">${e(RULES.name(x.m))}</span></td><td class="tp">${x.page}</td></tr>`).join("")}</table>`,
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
      return /^\d$/.test(a) && /^\d$/.test(b) ? `${U.ROMAN[+a]}.–${U.ROMAN[+b]}. Grad` : `${nm(a)} – ${nm(b)}`;
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
  const chapterName = (k) => (k === "foreign" ? "Fremde Gebete" : k === "everyday" ? "Alltagszauber" : k === "cantrip" ? "Zaubertricks" : U.ROMAN[+k] + ". Grad");
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
    const own = (window.PROFILE && PROFILE.chapters && PROFILE.chapters[k]) || null;
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
  const fillerHTML = () => `<div class="filler"><svg viewBox="-50 -50 100 100" class="filler-orn"><circle r="44"/><circle r="38" class="thin"/><path d="M0-38L33 19-33 19Z M0 38L33-19-33-19Z" class="thin"/><circle r="6"/></svg><div class="filler-txt">Für Notizen</div></div>`;

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

  window.BOOK = { spellPages, prayerPages, scrollPages, assemble, volumes, rulesBook, rulesIndex, rulesBox, frontMatter, chapterKey, chapterName, rank };
})();
