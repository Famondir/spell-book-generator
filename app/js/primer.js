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
  const P = () => window.PRIMER;
  const prof = () => (window.PROFILE && PROFILE.primer) || {};
  // Beinamen aus dem Profil (z. B. Namen der eigenen Welt), in Klammern hinter dem irdischen Namen
  const alias = (k) => { const a = (prof().aliases || {})[k]; return a ? ` <span class="alias">(${e(a)})</span>` : ""; };

  // ---------------------------------------------------------------------------
  // Bausteine
  // ---------------------------------------------------------------------------
  // Raster in einzelnen Zeilen: der Seitenumbruch kann zwischen Zeilen teilen
  const rows = (items, n) => {
    const out = [];
    for (let i = 0; i < items.length; i += n) out.push(`<div class="pr-grid g${n}">${items.slice(i, i + n).join("")}</div>`);
    return out.join("");
  };
  const svg = (inner, vb = "-50 -50 100 100", cls = "") => `<svg class="pr-svg ${cls}" viewBox="${vb}" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
  const mview = (inner, cls = "") => `<figure class="mview ${cls}">${inner}<figcaption>Ansicht des Meisters · nicht nachfahren – abzeichnen</figcaption></figure>`;

  // Lesestück: [[Begriff]] → Rubrik; Glosse beim ersten Vorkommen im ganzen Heft an den Rand
  function readHTML(L, b) {
    return (L.read || [])
      .map((p) => {
        const asides = [];
        const html = e(p).replace(/\[\[([^\]]+)\]\]/g, (_, w) => {
          const g = (L.glosses || {})[w];
          if (g && !b.gloss.has(w)) {
            b.gloss.set(w, { text: g, lesson: b.label(L) });
            asides.push(`<aside class="pr-note"><b>${e(w)}</b> ${e(g)}</aside>`);
          }
          return `<b class="term">${e(w)}</b>`;
        });
        return `<div class="par">${asides.join("")}<p>${html}</p></div>`;
      })
      .join("");
  }
  // Abhakkästchen am Ende einer Aufgabe stehen zusammen auf einer eigenen Zeile
  const tickLine = (t) => { const m = t.match(/^(.*?)\s*((?:☐\s*)+)$/); return m ? `${e(m[1])}<br><span class="ticks">${e(m[2].trim())}</span>` : e(t); };
  // note: Verweis unter der Aufgabe, wenn sie vor dem Stoff steht (taskFirst)
  const taskHTML = (list, note) => (list && list.length ? `<div class="task"><h4>Aufgabe</h4><ol>${list.map((t) => `<li>${tickLine(t)}</li>`).join("")}</ol>${note ? `<p class="hint">${e(note)}</p>` : ""}</div>` : "");
  // Prüfbogen: eine Zeile je Lektion (Kriterien mit Skala 0–3, Urteil, Datum, Zeichen)
  const checkRow = (c, pg) =>
    `<div class="pb-row"><div class="pb-l">${pg ? `<span class="pb-pg">S. ${e(pg)}</span>` : ""}${c.kicker ? `<span class="rn">${e(c.kicker.replace(/^Lektion /, "L "))}</span> ` : ""}${e(c.title)}</div><div class="pb-c">${c.crit.map((k) => `<span>${e(k)} <i>0 1 2 3</i></span>`).join("")}</div><div class="pb-u">☐ n ☐ p ☐ l · Datum _______ · Zeichen ____</div></div>`;

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
  const RITUAL_FIELDS = [["school", "Schule"], ["level", "Grad"], ["time", "Wirkzeit"], ["components", "Komponenten"], ["checks", "Fertigkeitswürfe"], ["backlash", "Rückschlag"], ["failure", "Misslingen"], ["effect", "Wirkung"]];
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
      `<dl>${RITUAL_FIELDS.filter(([k]) => r[k]).map(([k, l]) => `<dt>${l}</dt><dd>${e(r[k])}</dd>`).join("")}</dl>` +
      (v.label ? `<span class="who">– ${e(v.label)}</span>` : "") +
      (strike ? `<svg class="leaf-x" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M4,6 L96,94 M95,5 L5,95" style="stroke:${ink(strike)}"/></svg>` : "") + `</div>` +
      (strike ? `<div class="leaf-strike hand-${e(strike.hand || "flowing")}" style="color:${ink(strike)}">${e(lf.strike.text).replace(/\n/g, "<br>")}${strike.label ? `<span class="who">– ${e(strike.label)}</span>` : ""}</div>` : "") +
      `</div>${notes.join("")}`;
  }

  // Weltinfo-Kasten einer Lektion
  const worldBox = (bx) => (bx ? `<div class="pr-world"><b>${e(bx.title)}</b>${(bx.text || []).map((t) => `<p>${e(t)}</p>`).join("")}</div>` : "");
  function boxHTML(part) {
    const bx = { ...(P().boxes || {}), ...(prof().boxes || {}) }[part];
    if (!bx) return "";
    return `<div class="pr-box"><div><b>Höchstes Lob des Meisters</b> ${e(bx.praise)}</div><div><b>Größte Furcht der Lehrlinge</b> ${e(bx.fear)}</div><div><b>Redensart der Werkstatt</b> ${e(bx.saying)}</div></div>`;
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
  const CASTING_DE = { standard: "Standard-Aktion · Punkt", swift: "Schnelle Aktion · Blitz", immediate: "Augenblick · Doppelblitz", fullround: "Volle Aktion · Bogen", round: "Eine Runde · Zeiger", minutes: "Minuten · Stundenglas", hours: "Stunden · doppeltes Stundenglas" };
  const COMP_DE = { V: "Stimme (V): die Formel wird gesprochen", S: "Geste (S): die Hände führen", F: "Fokus (F): ein Werkzeug, das bleibt", DF: "Göttlicher Fokus (GF): ein heiliges Zeichen" };
  const PLANETS = [
    ["sol", "Sonne", "Gold"], ["luna", "Mond", "Silber"], ["mercurius", "Merkur", "Quecksilber"], ["venus", "Venus", "Kupfer"],
    ["mars", "Mars", "Eisen"], ["iupiter", "Jupiter", "Zinn"], ["saturnus", "Saturn", "Blei"],
  ];
  const tagParts = (tag) => T.parts(Object.entries(T.TAG_ESS[tag] || {}).map(([id, w]) => ({ id, pct: Math.round(w * 100) })));

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
    hundred: () => mview(svg(`<circle r="30" class="hand-circle"/><circle r="1.5" class="fill"/>`, "-40 -40 80 80", "small"), "inline") + `<p class="hint">Prüfscheibe: Anhang A.</p>`,
    orders: () => rows([1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => `<figure>${svg(orderFig(n), "-52 -52 104 104")}<figcaption>${U.ROMAN[n]}</figcaption></figure>`), 5),
    pounce: () => {
      const inner = G.SCHOOL.abjuration(40);
      return mview(svg(pounce(inner, "-50 -50 100 100", 12), "-50 -50 100 100", "small"), "inline");
    },
    essences: () => LEGEND.table(LEGEND.essences(9, "corr"), "ess"),
    schools: () => LEGEND.table(LEGEND.schools(12)),
    signs: () => LEGEND.table(LEGEND.signs(8)),
    components: () =>
      `<div class="pr-table">${Object.entries(COMP_DE).map(([k, d]) => `<div class="pr-row">${glyphSVG("component", k, { s: 8 })}<div>${e(d)}</div></div>`).join("")}` +
      `<div class="pr-row">${glyphSVG("alch", "sulfur", { s: 8 })}<div>Stoff (M): steht als alchemistisches Zeichen, hier Schwefel</div></div></div>`,
    casting: () => `<div class="pr-table">${Object.entries(CASTING_DE).map(([k, d]) => `<div class="pr-row">${glyphSVG("casting", k, { s: 8 })}<div>${e(d)}</div></div>`).join("")}</div>`,
    gates: () => {
      const s = byName("Fireball") || window.SPELLS.find((x) => x.saving_throw && /reflex/i.test(x.saving_throw));
      const m = analyze(s);
      return mview(renderCircle(m, { layers: ["outer", "band", "gates", "sr"], text: generateTexts(m).formula.band }), "medium");
    },
    gestures: () => {
      const SG = (window.TEXTGEN && TEXTGEN.SCHOOL_GESTURE) || {};
      return `<dl class="pr-dl">${Object.entries(T.SCHOOLS).map(([k, s]) => `<dt>${e(s.de)}</dt><dd>${(SG[k] || []).map(e).join("; ")}</dd>`).join("")}</dl>`;
    },
    planets: () => {
      const blocks = svg(`<circle cx="-30" cy="0" r="9"/><path d="M8,-10 A10,10 0 1 0 8,10 A7.5,7.5 0 1 1 8,-10Z"/><line x1="40" y1="-11" x2="40" y2="11"/><line x1="29" y1="0" x2="51" y2="0"/>`, "-45 -16 105 32", "blocks");
      return `<figure class="mview inline">${blocks}<figcaption>Kreis · Halbmond · Kreuz</figcaption></figure>` +
        `<div class="pr-table">${PLANETS.map(([k, pl, met]) => `<div class="pr-row">${glyphSVG("alch", k, { s: 9 })}<div><b>${pl}</b>${alias(pl)} – ${met}<br><span class="corr">${e(tagParts(k))}</span></div></div>`).join("")}</div>`;
    },
    materials: (L, b) => {
      const seen = new Set();
      const rows = [];
      const pool = [...b.small, ...b.entries, ...["Fireball", "Grease", "Sleep", "Web", "Stone Shape", "Silent Image", "Shield", "Comprehend Languages"].map(byName).filter(Boolean).map(modelOf)];
      for (const x of pool) {
        for (const tg of x.m.components.materialTags || []) {
          if (seen.has(tg.tag) || tg.tag === "materia" || rows.length >= 8) continue;
          seen.add(tg.tag);
          rows.push(`<tr><td>${e(tg.noun || (x.m.components.material || "").replace(/\.$/, "").slice(0, 60))}<br><span class="rn">${e(RULES.name(x.m))}</span></td><td>${glyphSVG("alch", tg.tag, { s: 8 })}</td><td>${e(T.ALCHEMY[tg.tag] || tg.tag)}<br><span class="corr">${e(tagParts(tg.tag))}</span></td></tr>`);
        }
      }
      return `<table class="pr-mat"><tr><th>Stoff</th><th>Zeichen</th><th>Art und Essenz</th></tr>${rows.join("")}</table>`;
    },
    mixtures: (L, b) => `<dl class="pr-dl">${b.small.slice(0, 5).map((x) => `<dt>${smallTitle(x)} ${essRow(x.m.essences)}</dt><dd>${e(U.cap(T.parts(x.m.essences)))}.</dd>`).join("")}</dl>`,
    quickderive: (L, b) => {
      const x = b.small[0];
      const core = svg(`<g class="quick-g">${S.circle(0, 0, 50)}${(QUICK_SCHOOL[x.m.school] || QUICK_SCHOOL.universal)()}<g class="accent">${G.ESSENCE[x.m.primary](0, 0, 11)}</g></g>`, "-75 -75 150 150", "quick");
      return `<div class="pr-steps"><figure>${renderCircle(x.m, { text: x.t.formula.band })}<figcaption>1 · voller Kreis</figcaption></figure><span>→</span><figure>${core}<figcaption>2 · Kern: Schule und Hauptessenz</figcaption></figure><span>→</span><figure>${quickGlyph(x.m)}<figcaption>3 · Schnellglyphe</figcaption></figure></div><p class="hint">${smallTitle(x)}</p>` +
        `<h4>Was die Striche sagen</h4>${LEGEND.quickRules()}` +
        `<h4 class="keep-next">Schlüssel der Schulfiguren</h4>` +
        rows(LEGEND.quickSchools(12).map((x) => `<figure class="qkey">${x.full}<span>→</span>${x.glyph}<figcaption>${e(x.name)}</figcaption></figure>`), 3);
    },
    quicklist: (L, b) => rows(b.small.map((x) => `<figure>${quickGlyph(x.m)}<figcaption>${e(x.t.title)}<br><span class="rn">${e(RULES.name(x.m))}</span></figcaption></figure>`), 4),
    anatomy: (L, b) => {
      const x = b.small.find((y) => y.m.components.V) || b.small[0];
      return mview(renderCircle(x.m, { text: x.t.formula.band, annotate: true }), "duo") + `<p class="hint">${smallTitle(x)}</p><ol class="annot-list">${circleAnnotations(x.m).map((a) => `<li value="${a.n}"><b>${e(a.k)}:</b> ${e(a.t)}</li>`).join("")}</ol>`;
    },
    gaps: (L, b) => {
      const drop = [["essence", "Essenzring"], ["core", "Kernsiegel"], ["signs", "Zeichenring"], ["components", "Ecksteine"]];
      const items = b.small.slice(0, 4).map((x, i) => {
        const [layer, nm] = drop[i % drop.length];
        return { x, nm, html: renderCircle(x.m, { layers: CIRCLE_LAYERS.filter((l) => l !== layer), text: x.t.formula.band }) };
      });
      return `${items.map((it, i) => `<figure class="mview duo">${it.html}<figcaption>${i + 1} · ${e(it.x.t.title)}</figcaption></figure>`).join("")}<div class="solution">Lösungen: ${items.map((it, i) => `${i + 1} ${e(it.nm)}`).join(" · ")}</div>`;
    },
    compare: (L, b) => {
      const pool = b.small;
      let pair = null;
      for (let i = 0; i < pool.length && !pair; i++) for (let j = i + 1; j < pool.length; j++) if (pool[i].m.school === pool[j].m.school) { pair = [pool[i], pool[j]]; break; }
      pair = pair || pool.slice(0, 2);
      return pair.map((x) => `<figure class="mview duo">${renderCircle(x.m, { text: x.t.formula.band })}<figcaption>${smallTitle(x)}</figcaption></figure>`).join("");
    },
    // --- Vorspann: Unterschrift, Formulare ---
    signature: (L, b) => `<p class="sig">${b.master ? e(b.master) : "Der Meister"}</p>`,
    contract: (L, b) => {
      const f = (k, v = "") => `<dt>${k}</dt><dd>${v}</dd>`;
      return `<dl class="pr-form">${f("Lehrling")}${f("Herkunft")}${f("Meister", b.master ? e(b.master) : "")}${f("Werkstatt, Ort")}${f("Beginn der Lehre")}${f("Dauer", '<span class="pr-gap"></span>Jahre')}${f("Gegenleistung", "☐ Lehrgeld ☐ Dienst im Haus ☐ beides")}</dl>` +
        `<div class="pr-cols"><div><h4>Der Meister verpflichtet sich</h4><ol><li>den Lehrling alles zu lehren, was in diesem Heft steht, und nichts davon zurückzuhalten, sobald er es tragen kann;</li><li>ihn mit Kost, Kammer, Licht und Werkzeug zu versehen;</li><li>ihn vor Gefahren der Werkstatt zu warnen, bevor er ihnen begegnet;</li><li>seine Arbeit ehrlich zu prüfen.</li></ol></div>` +
        `<div><h4>Der Lehrling verpflichtet sich</h4><ol><li>zu lernen, zu üben und zu fragen;</li><li>die Hausordnung zu halten;</li><li>nichts aus Büchern und Schubladen des Meisters zu nehmen, was ihm nicht gegeben wurde;</li><li>keine Formel zu wirken, die der Meister nicht freigegeben hat;</li><li>Fremden nicht zu zeigen, was er hier lernt.</li></ol></div></div>` +
        `<dl class="pr-form sign">${f("Lehrling")}${f("Meister")}${f("Zeuge")}${f("Siegel")}</dl>`;
    },
    schedule: () => {
      const rows = [
        ["Erste Glocke", "Aufstehen, Wasser holen, Feuer anfachen, Werkstatt fegen"],
        ["Stille Stunde", "Vorbereitung: Meister und Lehrling studieren ihre Bücher, kein Wort"],
        ["Zweite Glocke", "Lektion beim Meister: Lesestück, Ansicht, Aufgabe"],
        ["Mittag", "Essen, danach eine halbe Stunde frei"],
        ["Dritte Glocke", "Werkstatt: Tinte, Federn, Papier, Übungsblätter"],
        ["Vesper", "Botengänge, Hausdienst, Strafarbeit"],
        ["Abendglocke", "Abendessen; danach Sprechstunde des Meisters: Fragen, Prüfung der Tagesarbeit"],
        ["Nachtglocke", "Licht aus. Wer noch liest, liest im Dunkeln."],
      ];
      return `<table class="pr-sched">${rows.map(([k, v]) => `<tr><th>${e(k)}</th><td>${e(v)}</td></tr>`).join("")}</table><p class="hint">Der siebte Tag ist frei. Die stille Stunde gilt auch an ihm.</p><p class="left">Strafarbeiten dieses Jahr: ${"☐ ".repeat(10)}</p>`;
    },
    kit: () => {
      const groups = [
        ["Zum Schreiben", ["Wachstafel und Griffel", "drei Gänsefedern", "eine Rabenfeder", "Federmesser und Abziehstein", "Tintenhorn mit Deckel", "Sandstreuer", "Tuch zum Abwischen"]],
        ["Zum Zeichnen", ["Zirkel mit festem Gelenk", "Lineal aus Holz", "Winkeleisen", "Schnur und Pflock", "Bleigriffel", "Ahle zum Stechen", "Prüfscheibe (Anhang A)"]],
        ["Zum Bewahren", ["Abfallpapier, ein Stapel", "zwei Bögen Pergament", "Bimsstein und Kreide", "Schachtel für Stoffe", "dieses Heft"]],
      ];
      // zwei Spalten, bei ungerader Zahl links ein Eintrag mehr
      const col = (l) => `<ul>${l.map((x) => `<li>☐ ${e(x)}</li>`).join("")}</ul>`;
      return groups.map(([h, l]) => { const k = Math.ceil(l.length / 2); return `<h4>${e(h)}</h4><div class="pr-checklist">${col(l.slice(0, k))}${col(l.slice(k))}</div>`; }).join("");
    },
    // --- Werkstatt ---
    pageSetup: () => {
      const holes = [0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => S.dot(-27, -36 + i * 8, 0.8) + S.dot(27, -36 + i * 8, 0.8)).join("");
      const lines = [0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => S.line(-24, -36 + i * 8, 24, -36 + i * 8, "thin")).join("");
      return mview(svg(`<rect x="-32" y="-44" width="64" height="88" class="thin"/>${holes}${lines}`, "-36 -48 72 96", "small"), "inline") + `<p class="hint">Stichlöcher am Rand, Linien dazwischen.</p>`;
    },
    groundCircle: () => {
      const good = S.circle(0, 0, 30) + S.dot(0, 0, 2) + S.line(0, 0, 21, -21, "thin");
      let d = "";
      for (let i = 0; i <= 60; i++) { const a = (i / 60) * 2 * Math.PI, r = 30 - i * 0.12; d += (i ? "L" : "M") + G.f(r * Math.sin(a)) + "," + G.f(-r * Math.cos(a)); }
      const bad = S.path(d) + S.dot(0, 0, 2);
      return rows([`<figure>${svg(good, "-40 -40 80 80")}<figcaption>Ring um den Pflock: der Kreis schließt</figcaption></figure>`, `<figure>${svg(bad, "-40 -40 80 80")}<figcaption>Schnur aufgewickelt: Spirale</figcaption></figure>`], 2);
    },
    // --- Hand und Kreis ---
    strokes: () => {
      const items = [
        ["Senkrechte", S.line(0, -18, 0, 16) + S.arrowHead(0, 18, 180, 4)],
        ["Waagerechte", S.line(-18, 0, 16, 0) + S.arrowHead(18, 0, 90, 4)],
        ["Bogen", S.arc(0, 4, 18, 270, 90) + S.arrowHead(...polar(0, 4, 18, 90), 180, 4)],
        ["Haken", S.path("M0,-18 L0,8 Q0,16 -8,16")],
        ["Öse", S.path("M-10,10 Q-10,-18 0,-18 Q10,-18 10,0 Q10,14 -4,8")],
      ];
      return rows(items.map(([n, g]) => `<figure>${svg(g, "-24 -24 48 48")}<figcaption>${n}</figcaption></figure>`), 5);
    },
    construct1: () => {
      const R = 30, six = poly(0, 0, R, 6);
      const arcs = six.map((pt) => S.arc(pt[0], pt[1], R, 0, 360, "faint")).join("");
      const hex = S.circle(0, 0, R) + six.map((pt) => S.dot(pt[0], pt[1], 1.4)).join("") + S.polygon(six, "thin") + S.polygon([six[0], six[2], six[4]]) + S.polygon([six[1], six[3], six[5]]);
      const cross = S.circle(0, 0, R) + S.line(-R, 0, R, 0) + S.arc(-R, 0, R * 1.3, 20, 160, "faint") + S.arc(R, 0, R * 1.3, 200, 340, "faint") + S.line(0, -R - 6, 0, R + 6);
      return rows([`<figure>${svg(cross, "-46 -46 92 92")}<figcaption>Kreuz: Mittelsenkrechte aus zwei Zirkelschlägen</figcaption></figure>`, `<figure>${svg(hex + arcs, "-46 -46 92 92")}<figcaption>Sechsteilung: der Radius sechsmal abgetragen</figcaption></figure>`], 2);
    },
    construct2: () => {
      const R = 30;
      const sq = S.circle(0, 0, R) + S.line(-R, 0, R, 0, "thin") + S.line(0, -R, 0, R, "thin") + S.polygon(poly(0, 0, R, 4)) + S.polygon(poly(0, 0, R, 8, 22.5), "thin");
      const top = [0, -R], mid = [R / 2, 0], r2 = Math.hypot(mid[0] - top[0], mid[1] - top[1]), x = mid[0] - r2;
      const pent = S.circle(0, 0, R) + S.line(-R, 0, R, 0, "thin") + S.dot(mid[0], mid[1], 1.4) + S.arc(mid[0], mid[1], r2, 270, 340, "faint") + S.line(x, 0, top[0], top[1], "thin") + S.star(0, 0, R, 5, 2);
      return rows([`<figure>${svg(sq, "-40 -40 80 80")}<figcaption>Viereck und Achteck aus dem Kreuz</figcaption></figure>`, `<figure>${svg(pent, "-40 -40 80 80")}<figcaption>Fünfeckseite über den halben Radius</figcaption></figure>`], 2);
    },
    rings: () => {
      const figs = [1, 2, 3].map((n) => `<figure>${svg(S.circle(0, 0, 18) + S.circle(0, 0, 14) + Array.from({ length: n }, (_, i) => S.circle(0, 0, 22 + i * 4, "thin")).join(""), "-36 -36 72 72")}<figcaption>Doppelkreis, ${n} Weitenring${n > 1 ? "e" : ""}</figcaption></figure>`);
      return rows(figs, 3);
    },
    // --- Zeichen der Stoffe ---
    tria: () => {
      const t = [["sulfur", "Sulfur · Flamme"], ["mercurius", "Mercurius · Rauch"], ["sal", "Sal · Asche"]];
      return rows(t.map(([k, n]) => `<figure>${glyphSVG("alch", k, { s: 12 })}<figcaption>${n}</figcaption></figure>`), 3) +
        `<div class="solution">Lösung: Wachs – Sulfur · Salz – Sal · Quecksilber – Mercurius · Kohle – Sulfur · Kreide – Sal · Weingeist – Mercurius</div>`;
    },
    elements: () => {
      const els = [["ignis", "Feuer"], ["aer", "Luft"], ["aqua", "Wasser"], ["terra", "Erde"]];
      const cross = S.line(-34, 0, 34, 0, "thin") + S.line(0, -34, 0, 34, "thin") +
        S.text(0, -38, "heiß", "lbl", 6) + S.text(0, 43, "kalt", "lbl", 6) + S.text(-48, 0, "trocken", "lbl", 6) + S.text(47, 0, "feucht", "lbl", 6) +
        `<g>${G.ESSENCE.ignis(-17, -17, 6)}${G.ESSENCE.aer(17, -17, 6)}${G.ESSENCE.aqua(17, 17, 6)}${G.ESSENCE.terra(-17, 17, 6)}</g>`;
      return rows(els.map(([k, n]) => `<figure>${glyphSVG("essence", k, { s: 10 })}<figcaption>${n}</figcaption></figure>`), 4) + mview(svg(cross, "-56 -50 112 100"), "medium");
    },
    week: () => {
      // alte Reihe auf den Ecken, der Siebenstern {7/2} führt zur Woche
      const order = ["saturnus", "iupiter", "mars", "sol", "venus", "mercurius", "luna"];
      const pts = poly(0, 0, 36, 7);
      const star = S.circle(0, 0, 44, "thin") + S.polygon(pts, "faint") + pts.map((a, i) => S.line(a[0], a[1], ...pts[(i + 3) % 7], "thin")).join("");
      const signs = pts.map((a, i) => { const q = polar(0, 0, 44, (360 / 7) * i); return `<circle cx="${G.f(q[0])}" cy="${G.f(q[1])}" r="7" class="bg"/>` + G.ALCH[order[i]](q[0], q[1], 4.5); }).join("");
      const days = ["Sonntag ☉", "Montag ☽", "Dienstag ♂", "Mittwoch ☿", "Donnerstag ♃", "Freitag ♀", "Samstag ♄"];
      return mview(svg(star + signs, "-54 -54 108 108"), "medium") + `<p class="hint">${days.join(" · ")}</p>`;
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
      // Vergleich in den Begriffen der Lehre (deutsch), nicht in den Regelwerten
      const dur = (m) => m.duration.de + (m.duration.perLevel ? " je Grad" : "");
      const rng = (m) => m.range.de + (m.range.ft ? ` (${m.range.ft} Fuß)` : "");
      const ess = (m) => T.ESS[m.primary].latin;
      const KEYS = [["Gestalt", (m) => m.shape.de], ["Weite", rng], ["Dauer", dur], ["Wirkzeit", (m) => m.casting.de], ["Schule", (m) => m.schoolInfo.de], ["Hauptessenz", ess]];
      const rowsHTML = KEYS.filter(([, g]) => g(base) !== g(x.m)).map(([n, g]) => `<tr><td>${n}</td><td>${e(g(base))}</td><td>${e(g(x.m))}</td></tr>`).join("");
      return `<table class="pr-mat"><tr><th></th><th>Grundformel<br><span class="rn">${e(generateTexts(base).title)}</span></th><th>Zuschnitt<br><span class="rn">${e(RULES.name(x.m))}</span></th></tr>${rowsHTML || `<tr><td colspan="3">Nur der Zweck ist enger.</td></tr>`}</table>` +
        (x.m.spell.description ? `<p class="hint">${e(x.m.spell.description)}</p>` : "");
    },
    firstpage: () => {
      const page = `<rect x="-30" y="-42" width="60" height="84" class="thin"/><rect x="-24" y="-36" width="48" height="6" class="faint"/>` + S.circle(0, -12, 14) + S.circle(0, -12, 10, "thin") +
        [0, 1, 2, 3, 4].map((i) => S.line(-24, 10 + i * 5, 24, 10 + i * 5, "thin")).join("") + S.text(0, -32, "Kopf", "lbl", 4) + S.text(0, 38, "Formel · Ecksteine · Geste", "lbl", 3.5);
      return mview(svg(page, "-36 -48 72 96"), "small") + `<p class="hint">Entwurf: Kopf, Kreis, Textblock, Rand.</p>`;
    },
    finalExam: (L, b) => {
      const items = ["Hundert Kreise, Probe von zehn mit der Prüfscheibe", "Fünf Glyphen aus dem Gedächtnis, vom Prüfer gerufen", "Ein Kreis, laut gelesen, Schicht für Schicht", "Eine kleine Formel, dreimal in Folge gewirkt", "Das Gesellenstück: die erste Seite im Reinbuch"];
      return `<table class="pr-grade"><tr><th>Prüfstück</th><th>bestanden</th><th>nicht</th></tr>${items.map((x) => `<tr><td>${e(x)}</td><td></td><td></td></tr>`).join("")}</table>` +
        `<dl class="pr-form sign"><dt>Prüfer</dt><dd></dd><dt>Aufsicht</dt><dd></dd><dt>Schreiber</dt><dd></dd><dt>Ort, Datum</dt><dd></dd></dl><p class="left">☐ bestanden: das zweite Heft darf aufgeschlagen werden ☐ Wiederholung nach einem halben Jahr</p>`;
    },
    first: () => `<dl class="pr-form">${["Datum", "Ort", "Zeuge", "Formel", "Was geschah", "Was ich fühlte"].map((k) => `<dt>${k}</dt><dd></dd>`).join("")}</dl>`,
    // Anhang
    disc: () => {
      const rings = [[30, "weit"], [34, "mittel"], [37, "eng"], [43, "eng"], [46, "mittel"], [50, "weit"]].map(([r, k]) => `<circle r="${r}" class="ring ${k}"/>`).join("");
      return `<p>Auf dünnes Pauspapier übertragen oder ausschneiden. Die Mitte auf den Mittelpunkt des geprüften Kreises legen: Liegt die Linie zwischen den engen Ringen, gibt es 3 Punkte, zwischen den mittleren 2, zwischen den weiten 1, sonst 0.</p>` +
        `<figure class="disc">${svg(`${rings}<circle r="40" class="target"/><line x1="-54" y1="0" x2="54" y2="0" class="thin"/><line x1="0" y1="-54" x2="0" y2="54" class="thin"/>`, "-56 -56 112 112")}</figure>`;
    },
    pounceSheets: () => {
      const figs = [["Kernsiegel der Bannmagie", G.SCHOOL.abjuration(40)], ["Ignis", G.ESSENCE.ignis(0, 0, 40)], ["Sol", G.ALCH.sol(0, 0, 40)], ["Fünfstern", S.star(0, 0, 40, 5, 2)]];
      return figs.map(([nm, inner]) => `<h4 class="keep-next">${e(nm)}</h4>` + rows([12, 6, 3].map((n) => `<figure>${svg(pounce(inner, "-50 -50 100 100", n), "-50 -50 100 100", "pounce")}<figcaption>${n} Punkte</figcaption></figure>`), 3)).join("");
    },
    gradeSheet: () => {
      const crit = ["Rundheit / Formtreue", "Schluss der Linie", "Strich", "Verhältnisse", "Sauberkeit", "Tempo (Schnellglyphen)"];
      return `<table class="pr-grade"><tr><th>Kriterium</th><th>0</th><th>1</th><th>2</th><th>3</th></tr>${crit.map((c) => `<tr><td>${e(c)}</td><td></td><td></td><td></td><td></td></tr>`).join("")}</table><p class="left">Summe ______ · Urteil ☐ nondum ☐ probatum ☐ laudandum · Datum ________ · Zeichen des Meisters ______</p><p class="left">Nächste Übung: __________________________________________</p>`;
    },
    promoteSheet: () => {
      const subj = ["Werkstatt", "Grundstriche und Kreise", "Konstruktion", "Glyphen", "Gesten", "Zeichen der Stoffe", "Schnellglyphen", "Kreise lesen", "Kleine Formeln"];
      return `<table class="pr-grade"><tr><th>Fach</th><th>Vermerk</th><th>Datum</th><th>Zeichen</th></tr>${subj.map((s) => `<tr><td>${e(s)}</td><td></td><td></td><td></td></tr>`).join("")}</table><p class="left">☐ versetzt in das zweite Lehrjahr ☐ wiederholt · Ort, Datum ________________ · Siegel</p>`;
    },
    glossary: (L, b) => [...b.gloss.entries()].sort((a, c) => a[0].localeCompare(c[0], "de")).map(([w, g]) => `<div class="pr-gl"><b>${e(w)}</b> <span class="rn">${e(g.lesson)}</span> – ${e(g.text)}</div>`).join(""),
  };

  // Lektion zu einer kleinen Formel (Teil VII)
  function formulaLesson(x, i, b, tpl) {
    const m = x.m, t = x.t;
    const mat = m.components.materialTags || [];
    const body =
      mview(renderCircle(m, { text: t.formula.band }), "fit") +
      `<h4>Die Formel</h4>${clozePasses(t.formula.lines.join(" "))}` +
      `<h4>Geste</h4><p>${(t.gestures || []).map(e).join(" · ") || "Keine Geste."}</p>` +
      (m.components.M ? `<h4>Stoff</h4><p>${mat.length ? mat.map((g) => `${glyphSVG("alch", g.tag, { s: 6 })} ${e(g.noun)}`).join(" · ") : e(m.components.material || "")}</p>` : "") +
      `<h4>Mischung</h4><p>${essRow(m.essences)} ${e(U.cap(T.parts(m.essences)))}.</p>` +
      `<div class="ladder"><span>☐ mit Buch</span><span>☐ aus dem Gedächtnis</span><span>☐ unter Ablenkung</span><span class="thrice">dreimal in Folge ☐ ☐ ☐</span></div>`;
    const L = { ...tpl, id: "f-" + m.id, title: t.title };
    return section(L, `Kleine Formel ${i + 1}`, `<div class="ls-sub">${e(RULES.name(m))} · ${m.spell.everyday ? "Alltagszauber" : "Zaubertrick"}</div>` + readHTML(i === 0 ? tpl : {}, b) + body, b, tpl.check);
  }

  function section(L, kicker, inner, b, check, tail = "") {
    // Prüfvermerke stehen nicht im Heft, sondern gesammelt im Prüfbogen
    const crit = check || L.check;
    if (crit && crit.length && !b.checks.some((c) => c.id === L.id)) b.checks.push({ id: L.id, part: b.part, kicker, title: L.title, crit });
    return `<section class="lesson splittable ${L._cls || ""}" data-lesson="${e(L.id)}"><div class="ls-head keep-next"><div class="ls-k">${e(kicker)}</div><h4 class="ls-t">${e(L.title)}</h4></div>${notesHTML(L.id, b)}${inner}${L.taskFirst ? "" : taskHTML(L.task)}${tail}</section>`;
  }

  function lessonHTML(L, b) {
    const kicker = L.unnumbered ? "" : `Lektion ${L.id.replace(/^l/, "")}`;
    let inner = readHTML(L, b) + worldBox(L.box) + (L.taskFirst ? taskHTML(L.task, L.taskFirst) : "");
    if (L.text && !L.read) inner += `<p class="hint">Dieser Abschnitt wird noch geschrieben.</p>`;
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
      label: (L) => (L.unnumbered ? L.title : `Lektion ${L.id.replace(/^l/, "")}`),
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
    for (const pt of P().parts) {
      b.part = pt.id === "V" ? pt.title : pt.id === "A" ? "Anhang" : `Teil ${roman(pt)} · ${pt.title}`;
      const lessons = lessonsOf(pt.id);
      const pages = [];
      if (pt.id === "V") {
        pages.push({ cls: "title-page primer-title" + bind, running: "", html: `<div class="tp"><div class="tp-sigil pr-sigil">${svg(orderFig(7, 34) + S.circle(0, 0, 46) + S.circle(0, 0, 12, "thin"), "-52 -52 104 104")}</div><h1>${e(title)}</h1><div class="tp-owner">${e(pr.subtitle || P().subtitle)}</div><div class="tp-sub">${master ? "aus der Werkstatt " + e(master) : ""}</div></div>` });
        if (pr.handover && (!pr.handover.level || b.level >= pr.handover.level)) pages.push({ cls: "primer-page flow handover" + bind, running: "An den, der nach mir liest", html: voiceHTML({ voice: pr.handover.voice, text: (pr.handover.text || []).join("\n\n") }, "handover-text") });
      }
      const running = pt.id === "V" ? "Vorspann" : pt.id === "A" ? "Anhang" : `Teil ${roman(pt)} · ${pt.title}`;
      let html = pt.id === "V" ? "" : `<h3>${pt.id === "A" ? "Anhang" : `Teil ${roman(pt)} · ${e(pt.title)}`}</h3>${boxHTML(pt.id)}`;
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
          small.forEach((x, i) => pages.push({ cls: "primer-page formula-page" + bind, spell: "f-" + x.m.id, running, html: formulaLesson(x, i, b, tpl) }));
          html = "";
        }
      }
      if (html) pages.push({ cls: "primer-page flow" + bind, running, html });
      pages.forEach((pg) => (pg.cls += " part-" + pt.id));
      // mit Lochrand beginnt jeder Teil wie im Buch auf einer rechten Seite
      if (pages[0] && bind) pages[0].cls += " recto-start";
      parts.push({ id: pt.id, title: pt.id === "V" ? pt.title : pt.id === "A" ? "Anhang" : `${roman(pt)} · ${pt.title}`, lessons: lessons.map((L) => ({ id: L.id, title: L.title, label: L.unnumbered ? "" : L.id.replace(/^l/, "") })).concat(pt.id === "VII" ? small.map((x, i) => ({ id: "f-" + x.m.id, title: x.t.title, label: "·" })) : []), pages });
    }
    // das Glossar kennt erst jetzt alle Begriffe: Anhang neu erzeugen
    const A = parts.find((p) => p.id === "A");
    if (A) {
      let html = `<h3>Anhang</h3>`;
      for (const L of lessonsOf("A")) html += lessonHTML(L, b);
      A.pages = [{ cls: "primer-page flow part-A" + (bind && " recto-start") + bind, running: "Anhang", html }];
      // loses Blatt (Profil): liegt schräg eingelegt hinter dem Anhang
      const lf = pr.looseLeaf;
      if (lf && (!lf.level || b.level >= lf.level)) A.pages.push({ cls: "primer-page loose-page part-A" + bind, running: "", html: looseLeafHTML(lf) });
    }
    // Prüfbogen als eigener Handzettel (nicht im Heft), nach Teilen gegliedert;
    // pageOf(id) liefert die Seite der Lektion im gesetzten Heft (falls bekannt)
    const checks = b.checks;
    const sheet = (pageOf = () => "") => {
      let html = `<h3>Prüfbogen</h3><p class="pb-key">Skala: 0 fehlt · 1 erkennbar · 2 sauber · 3 meisterlich. Urteil: n nondum · p probatum · l laudandum.</p>`;
      // je Teil ein teilbarer Abschnitt: die Überschrift bleibt nie allein am Seitenende
      const parts = [...new Set(checks.map((c) => c.part))];
      html += parts.map((pt) => `<section class="pb-sec splittable"><h4 class="pb-part keep-next">${e(pt)}</h4>${checks.filter((c) => c.part === pt).map((c) => checkRow(c, pageOf(c.id))).join("")}</section>`).join("");
      return [{ cls: "pb-page flow", running: "Prüfbogen" + (master ? " · Werkstatt " + master : ""), html }];
    };
    return { title, parts, sheet };
  }

  window.PRIMER_BOOK = { build };
})();
