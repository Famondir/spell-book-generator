// Andachtsbild: Zauber als Lanzettfenster in Bleiglas oder als Steinintarsie (für göttliche Klassen).
// Aus derselben Analyse wie die Magierkreise, aber in eigener Bildsprache:
//   Grad → Bahnen · Schule → Maßwerk im Bogenfeld · Hauptessenz → Medaillon · Essenzanteile → Akzentscheiben
//   heilige Farben → Grundscheiben · Gestalt → Zellrichtung · Dauer → Sockel · Rettungswurf → Bordüre
// Das SVG kommt ohne <defs> und IDs aus (alle Zellen sind geometrisch beschnitten), damit Vorschau und Druck
// dieselbe Zeichenkette mehrfach im Dokument verwenden können.
window.VITRAIL = (function () {
  const W = 120, H = 280, Y0 = 8, R = W * 0.8; // Fensterbreite, -höhe, Scheitel, Bogenradius
  const HB = Math.sqrt(R * R - (R - W / 2) ** 2); // Höhe des Spitzbogens
  const YS = Y0 + HB, YB = H - 6; // Kämpferlinie, Unterkante
  const LEAD = "#2b2622", STONE = "#d8cfbb", STONE_EDGE = "#8b8172";

  // Glasfarben der Essenzen
  const ESS_GLASS = {
    ignis: "#c8361e", aqua: "#2f63b5", aer: "#8fc4e0", terra: "#8a5a2b", vita: "#4f9d3a", mors: "#3b3346",
    lux: "#f0d24a", umbra: "#3c3f6e", mens: "#8a4fb0", vis: "#b0732a", ordo: "#6f86a8", fluxus: "#c24f8a",
    bonum: "#f5edd0", malum: "#6b1a1a", spatium: "#1f3f7a", tempus: "#b59a3a",
  };
  // Palette nach Gesinnung, wenn die Gottheit keine heiligen Farben hat
  const ALIGN_GLASS = {
    LG: ["#d4a21c", "#f2ecdc", "#2552a3"], NG: ["#2f7d3b", "#f2ecdc", "#d4a21c"], CG: ["#2f7d3b", "#d9701c", "#6ea6d8"],
    LN: ["#5c5f63", "#2552a3", "#c7cbd0"], N: ["#6e4524", "#2f7d3b", "#c09a68"], CN: ["#6a2c8c", "#d9701c", "#2f7d3b"],
    LE: ["#26201c", "#9e1030", "#5c5f63"], NE: ["#26201c", "#3b3346", "#6e4524"], CE: ["#9e1030", "#26201c", "#d9701c"],
  };

  // --- Steinintarsie (Pietra dura) -----------------------------------------------------
  // Steinsorten: Grundfarbe c, Musterung tex (vein = Adern, speck = Sprenkel, band = Bänder, metal = Glanz), Musterfarbe tc
  const STONES = {
    marble: { de: "Marmor", c: "#e9e3d6", tex: "vein", tc: "#a39b8f" },
    granite: { de: "Granit", c: "#8b8883", tex: "speck", tc: "#3e3b38" },
    slate: { de: "Schiefer", c: "#4a4f59", tex: "band", tc: "#5f6571" },
    basalt: { de: "Basalt", c: "#33302e", tex: "speck", tc: "#4d4945" },
    obsidian: { de: "Obsidian", c: "#221f23", tex: "metal", tc: "#6a6470" },
    jasper: { de: "roter Jaspis", c: "#933329", tex: "band", tc: "#b25a4c" },
    porphyry: { de: "Porphyr", c: "#6a2430", tex: "speck", tc: "#c9a49a" },
    bloodjasper: { de: "Blutjaspis", c: "#5a1d1f", tex: "speck", tc: "#1f1414" },
    carnelian: { de: "Karneol", c: "#b8482c", tex: "vein", tc: "#dc8a66" },
    brownjasper: { de: "brauner Jaspis", c: "#7d4f2e", tex: "band", tc: "#a06e48" },
    sandstone: { de: "Sandstein", c: "#b88a5a", tex: "speck", tc: "#8a6440" },
    amber: { de: "Bernstein", c: "#c07a26", tex: "vein", tc: "#e6b260" },
    tigereye: { de: "Tigerauge", c: "#9c7130", tex: "band", tc: "#d1a75a" },
    citrine: { de: "Citrin", c: "#d9b13d", tex: "vein", tc: "#f1dd8a" },
    gold: { de: "Goldeinlage", c: "#c99a32", tex: "metal", tc: "#f3dc93" },
    silver: { de: "Silbereinlage", c: "#b8bcc1", tex: "metal", tc: "#f2f4f6" },
    bronze: { de: "Bronzeeinlage", c: "#a8693a", tex: "metal", tc: "#e3ab7c" },
    malachite: { de: "Malachit", c: "#2e7a52", tex: "band", tc: "#6fbf8f" },
    jade: { de: "Jade", c: "#8cbf95", tex: "vein", tc: "#c4e2c9" },
    aquamarine: { de: "Aquamarin", c: "#5f9ea6", tex: "vein", tc: "#a9d3d6" },
    chalcedony: { de: "Chalcedon", c: "#9db6c4", tex: "vein", tc: "#d4e2ea" },
    lapis: { de: "Lapislazuli", c: "#29438a", tex: "speck", tc: "#d9b24a" },
    sodalite: { de: "Sodalith", c: "#2e3f7a", tex: "vein", tc: "#c9d0e6" },
    amethyst: { de: "Amethyst", c: "#6f4a8e", tex: "band", tc: "#a483c2" },
    rhodonite: { de: "Rhodonit", c: "#b45a78", tex: "speck", tc: "#3a2a2e" },
    rosequartz: { de: "Rosenquarz", c: "#d7a3a8", tex: "vein", tc: "#efd0d2" },
    ivory: { de: "Bein", c: "#eadfc4", tex: "band", tc: "#d3c5a4" },
  };
  const ESS_STONE = {
    ignis: "carnelian", aqua: "aquamarine", aer: "chalcedony", terra: "brownjasper", vita: "malachite", mors: "obsidian",
    lux: "citrine", umbra: "slate", mens: "amethyst", vis: "amber", ordo: "granite", fluxus: "rhodonite",
    bonum: "marble", malum: "bloodjasper", spatium: "lapis", tempus: "tigereye",
  };
  // heilige Farben (Namen aus data/deities.js) → Stein
  const COLOR_STONE = {
    red: "jasper", crimson: "porphyry", black: "basalt", green: "malachite", "dark green": "malachite", "pale green": "jade", greed: "malachite",
    white: "marble", ivory: "ivory", blue: "lapis", "dark blue": "sodalite", "midnight blue": "sodalite", "light blue": "chalcedony",
    "icy blue": "chalcedony", "ice blue": "chalcedony", crystal: "chalcedony", brown: "brownjasper", tan: "sandstone", gold: "gold",
    bronze: "bronze", gray: "granite", grey: "granite", "light gray": "granite", "iron gray": "slate", "lead gray": "slate", "dark gray": "slate",
    yellow: "citrine", "pale yellow": "citrine", orange: "carnelian", silver: "silver", pink: "rosequartz", purple: "amethyst", violet: "amethyst",
  };
  const ALIGN_STONE = {
    LG: ["gold", "marble", "lapis"], NG: ["malachite", "marble", "gold"], CG: ["malachite", "carnelian", "chalcedony"],
    LN: ["slate", "lapis", "silver"], N: ["brownjasper", "malachite", "sandstone"], CN: ["amethyst", "carnelian", "malachite"],
    LE: ["basalt", "porphyry", "slate"], NE: ["basalt", "obsidian", "brownjasper"], CE: ["porphyry", "basalt", "carnelian"],
  };
  const STONE_BY_HEX = new Map(Object.values(STONES).map((x) => [x.c, x]));

  // Material: Bleiglas oder Steinintarsie. Die Hilfsfunktionen lesen die Farben aus MAT; render() setzt es je Bild.
  const MATS = {
    glass: { id: "glass", ink: LEAD, frame: STONE, edge: STONE_EDGE, inlay: "#f4e8c6", red: "#b3202a", symbol: "#f4e8c6" },
    stone: { id: "stone", ink: "#3a322b", frame: "#a39c90", edge: "#5f584f", inlay: "#e9e3d6", red: "#933329", symbol: "#c99a32" },
  };
  let MAT = MATS.glass;
  let SETTING = "auto"; // „auto“, „glass“ oder „stone“ (Einstellung des Charakters)
  const isDwarven = (d) => !!d && (d.id === "torag" || /dwarven/i.test(d.pantheon || ""));
  const materialFor = (d) => (SETTING === "stone" || (SETTING === "auto" && isDwarven(d)) ? "stone" : "glass");
  const use = (id) => (MAT = MATS[id] || MATS.glass);
  const stoneOf = (key) => STONES[key] || STONES.granite;
  const essColor = (id) => (MAT.id === "stone" ? stoneOf(ESS_STONE[id]).c : ESS_GLASS[id]);
  // Wörter je Material (Legende, Vorspann)
  const WORDS = {
    glass: { item: "Fenster", items: "Fenster", piece: "Scheibe", pieces: "Scheiben", accent: "Akzentscheiben", base: "Grundscheiben", tym: "Rundfenster", read: "Vom Lesen der Fenster", stones: "Die Gläser", border: "Rote und helle Gläser am Rand" },
    stone: { item: "Steinbild", items: "Steinbilder", piece: "Stein", pieces: "Steine", accent: "Akzentsteine", base: "Grundsteine", tym: "Rundfeld", read: "Vom Lesen der Steinbilder", stones: "Die Steine", border: "Rote und weiße Steine am Rand" },
  };

  // --- Geometrie ---------------------------------------------------------------------
  const f1 = (v) => Math.round(v * 10) / 10;
  const poly = (pts) => "M" + pts.map((p) => f1(p[0]) + " " + f1(p[1])).join("L") + "Z";
  // Spitzbogen-Fenster als konvexes Polygon: Rechteck [x0, x0+w] × [ys, yb] mit Bogen der Höhe aus r = 0.8 w
  function arch(x0, w, ys, yb, seg = 14) {
    const r = w * 0.8, cx = x0 + w / 2;
    const h = Math.sqrt(r * r - (r - w / 2) ** 2);
    const pts = [[x0, yb], [x0, ys]];
    // linker Bogen: Mittelpunkt rechts auf der Kämpferlinie
    const cL = x0 + r;
    const a0 = Math.PI, a1 = Math.PI - Math.asin(h / r);
    for (let i = 1; i <= seg; i++) {
      const a = a0 + ((a1 - a0) * i) / seg;
      pts.push([cL + r * Math.cos(a), ys - r * Math.sin(a)]);
    }
    pts[pts.length - 1] = [cx, ys - h];
    const cR = x0 + w - r;
    for (let i = seg - 1; i >= 0; i--) {
      const a = (Math.asin(h / r) * i) / seg;
      pts.push([cR + r * Math.cos(a), ys - r * Math.sin(a)]);
    }
    pts.push([x0 + w, yb]);
    return { pts, apex: ys - h };
  }
  // Giebel (Steinintarsie): gerade Schrägen bis zur gleichen Scheitelhöhe wie der Spitzbogen
  function gable(x0, w, ys, yb) {
    const h = w * Math.sqrt(0.55);
    return { pts: [[x0, yb], [x0, ys], [x0 + w / 2, ys - h], [x0 + w, ys], [x0 + w, yb]], apex: ys - h };
  }
  const archOf = () => (MAT.id === "stone" ? gable : arch);
  // Abstand eines Punkts zum Rand eines konvexen Polygons
  function edgeDist(pts, x, y) {
    let d = Infinity;
    for (let i = 0; i < pts.length; i++) {
      const [ax, ay] = pts[i], [bx, by] = pts[(i + 1) % pts.length];
      const len = Math.hypot(bx - ax, by - ay) || 1;
      d = Math.min(d, Math.abs((bx - ax) * (ay - y) - (ax - x) * (by - ay)) / len);
    }
    return d;
  }
  // konvexes Polygon an Halbebene a·p ≤ c beschneiden (Sutherland-Hodgman)
  function clipHalf(pts, ax, ay, c) {
    const out = [];
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i], q = pts[(i + 1) % pts.length];
      const dp = ax * p[0] + ay * p[1] - c, dq = ax * q[0] + ay * q[1] - c;
      if (dp <= 0) out.push(p);
      if ((dp < 0) !== (dq < 0) && dp !== dq) {
        const t = dp / (dp - dq);
        out.push([p[0] + t * (q[0] - p[0]), p[1] + t * (q[1] - p[1])]);
      }
    }
    return out;
  }
  // konvexes Polygon an konvexem Polygon (gegen den Uhrzeigersinn egal: Orientierung wird geprüft)
  function clipPoly(pts, clip) {
    let area = 0;
    for (let i = 0; i < clip.length; i++) {
      const p = clip[i], q = clip[(i + 1) % clip.length];
      area += p[0] * q[1] - q[0] * p[1];
    }
    const s = area > 0 ? 1 : -1;
    let out = pts;
    for (let i = 0; i < clip.length && out.length; i++) {
      const p = clip[i], q = clip[(i + 1) % clip.length];
      // Innen liegt links (bzw. rechts) der Kante p→q
      const ax = s * (q[1] - p[1]), ay = -s * (q[0] - p[0]);
      out = clipHalf(out, ax, ay, ax * p[0] + ay * p[1]);
    }
    return out;
  }
  // Voronoi-Zellen der Punkte innerhalb des Polygons (Nachbarn nur im Umkreis)
  function voronoi(points, region, reach) {
    const xs = region.map((p) => p[0]), ys = region.map((p) => p[1]);
    const box = [[Math.min(...xs) - 1, Math.min(...ys) - 1], [Math.max(...xs) + 1, Math.min(...ys) - 1], [Math.max(...xs) + 1, Math.max(...ys) + 1], [Math.min(...xs) - 1, Math.max(...ys) + 1]];
    const r2 = reach * reach;
    return points.map((p, i) => {
      let cell = box;
      for (let j = 0; j < points.length && cell.length; j++) {
        if (j === i) continue;
        const q = points[j];
        const dx = q[0] - p[0], dy = q[1] - p[1];
        if (dx * dx + dy * dy > r2) continue;
        // näher an p als an q: (q-p)·x ≤ (|q|²-|p|²)/2
        cell = clipHalf(cell, dx, dy, (q[0] * q[0] + q[1] * q[1] - p[0] * p[0] - p[1] * p[1]) / 2);
      }
      return { p, cell: clipPoly(cell, region) };
    }).filter((c) => c.cell.length > 2);
  }

  // --- Farben ------------------------------------------------------------------------
  const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const hex = (c) => "#" + c.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("");
  const shade = (h, f) => hex(rgb(h).map((v) => (f >= 1 ? v + (255 - v) * (f - 1) : v * f)));
  function palette(deity) {
    if (MAT.id === "stone") {
      const keys = (deity && deity.colors || []).map((c) => COLOR_STONE[c.name] || "granite");
      return (keys.length ? keys : ALIGN_STONE[(deity && deity.align) || "LG"] || ALIGN_STONE.LG).map((k) => stoneOf(k).c);
    }
    const own = (deity && deity.colors || []).map((c) => c.hex);
    return own.length ? own : ALIGN_GLASS[(deity && deity.align) || "LG"] || ALIGN_GLASS.LG;
  }
  const weighted = (r, items) => {
    const tot = items.reduce((a, x) => a + x.w, 0);
    let v = r() * tot;
    for (const x of items) if ((v -= x.w) <= 0) return x.c;
    return items[items.length - 1].c;
  };

  // --- Motive für das heilige Symbol (Einheitsfeld -10…10) ----------------------------
  const starPts = (n, r1, r2) => Array.from({ length: n * 2 }, (_, i) => {
    const a = (Math.PI * i) / n - Math.PI / 2, r = i % 2 ? r2 : r1;
    return [r * Math.cos(a), r * Math.sin(a)];
  });
  const circ = (cx, cy, r) => `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0Z`;
  const MOTIFS = {
    sword: "M0-10L1.4-7.5V4H-1.4V-7.5Z M-5 4H5V5.8H-5Z M-.9 5.8H.9V8.6H-.9Z" + circ(0, 9.6, 1.2),
    sun: circ(0, 0, 4.2) + Array.from({ length: 12 }, (_, i) => {
      const a = (Math.PI * i) / 6, b = 0.18;
      const p = (r, d) => f1(r * Math.cos(a + d)) + " " + f1(r * Math.sin(a + d));
      return `M${p(5.2, -b)}L${p(9.5, 0)}L${p(5.2, b)}Z`;
    }).join(""),
    hammer: "M-6.5-8.5H6.5V-3H-6.5Z M-1.1-3H1.1V9.5H-1.1Z",
    anvil: "M-9-4H5C7.5-4 9-5 9.5-6.5V-3C9.5-1 7-.2 4-.2H3V3L6 6.5H-6L-3 3V-.2H-4C-7-.2-9-1.6-9-4Z",
    flame: "M0-9.5C4-5 6.5-1 4.6 4.2 3.6 7.6-3.6 7.6-4.6 4.2-6.2-.6-2.5-3 0-9.5Z M0-2C1.6.2 2.4 2 1.6 4 1 5.4-1 5.4-1.6 4-2.2 2.4-1 .6 0-2Z",
    shield: "M-7.5-8.5H7.5V-1.5C7.5 5 0 9.5 0 9.5S-7.5 5-7.5-1.5Z",
    scales: "M-.8-9H.8V7H-.8Z M-9-6.5H9V-5H-9Z M-4 8H4V9.5H-4Z M-9.5-1A3.5 2.6 0 0 0-2.5-1Z M2.5-1A3.5 2.6 0 0 0 9.5-1Z M-6.4-5L-9.5-1H-2.5Z M6.4-5L2.5-1H9.5Z",
    eye: "M-9.5 0Q0-8.5 9.5 0Q0 8.5-9.5 0Z" + circ(0, 0, 3.2),
    star: poly(starPts(5, 9.5, 3.9)),
    crown: "M-8.5 6.5V-4.5L-4.2 1 0-7 4.2 1 8.5-4.5V6.5Z",
    moon: "M2-9.5A9.5 9.5 0 1 0 2 9.5 7.4 7.4 0 1 1 2-9.5Z",
    key: circ(0, -6, 3.4) + "M-1-2.8H1V9.5H-1Z M1 5H4.5V6.6H1Z M1 7.8H3.6V9.5H1Z",
    tree: "M-1.2 2H1.2V9.5H-1.2Z" + circ(0, -3, 6) + circ(-4.5, 1, 3.6) + circ(4.5, 1, 3.6),
    feather: "M6-9.5C-2-7-6 0-6.5 7L-8 9.5-7 9.8-5.5 7.5C1 6 6.5-1 6-9.5Z",
    rose: Array.from({ length: 5 }, (_, i) => circ(f1(5 * Math.cos((2 * Math.PI * i) / 5 - Math.PI / 2)), f1(5 * Math.sin((2 * Math.PI * i) / 5 - Math.PI / 2)), 4)).join("") + circ(0, 0, 2.6),
    rosette: poly(starPts(8, 9, 5.5)) + circ(0, 0, 3),
  };
  // Stichwörter der Symbolbeschreibung → Motiv (Tabelle, damit später leicht ergänzbar)
  const MOTIF_WORDS = [
    [/sword|blade|longsword/, "sword"], [/\bsun|sunburst|sunrise|dawn/, "sun"], [/hammer/, "hammer"], [/anvil|forge/, "anvil"],
    [/flame|fire|torch|candle|smok|burning/, "flame"], [/shield/, "shield"], [/scale/, "scales"], [/\beye/, "eye"],
    [/star/, "star"], [/crown|tiara|diadem/, "crown"], [/moon|crescent/, "moon"], [/\bkey/, "key"],
    [/tree|oak|leaf|branch/, "tree"], [/feather|quill|wing/, "feather"], [/rose|flower|lotus|blossom/, "rose"],
  ];
  const BACK = new Set(["sun", "star", "moon", "rose"]);
  function symbolMotifs(text) {
    const t = String(text || "").toLowerCase();
    const hits = MOTIF_WORDS.map(([re, k]) => ({ k, i: t.search(re) })).filter((h) => h.i >= 0).sort((a, b) => a.i - b.i).map((h) => h.k);
    const uniq = [...new Set(hits)].slice(0, 2);
    if (!uniq.length) return { front: "rosette", back: null };
    if (uniq.length === 1) return { front: uniq[0], back: null };
    const [a, b] = uniq;
    return BACK.has(a) && !BACK.has(b) ? { front: b, back: a } : { front: a, back: b };
  }
  function symbolSVG(text, cx, cy, size, tint) {
    const { front, back } = symbolMotifs(text);
    const s = size / 10;
    const g = (k, sc, fill) => `<path transform="translate(${f1(cx)} ${f1(cy)}) scale(${(s * sc).toFixed(3)})" d="${MOTIFS[k]}" fill="${fill}" stroke="${MAT.ink}" stroke-width="${(1 / (s * sc)).toFixed(2)}" fill-rule="nonzero"/>`;
    return (back ? g(back, 1.05, shade(tint, 1.35)) : "") + g(front, back ? 0.8 : 0.95, MAT.symbol);
  }

  // --- Fenster -----------------------------------------------------------------------
  function render(m, deity, opts = {}) {
    const prev = MAT;
    use(opts.material || materialFor(deity));
    try {
      return draw(m, deity, opts);
    } finally {
      MAT = prev;
    }
  }
  function draw(m, deity, opts) {
    const stone = MAT.id === "stone";
    const arc = archOf();
    const r = U.rng(U.hash(m.id + "|" + ((deity && deity.id) || "")));
    const tr = U.rng(U.hash(m.id + "|tex"));
    const base = palette(deity);
    const baseW = base.map((c, i) => ({ c, w: [0.55, 0.3, 0.15][i] || 0.1 }));
    const ess = m.essences.map((x) => ({ c: essColor(x.id) || "#888888", w: x.pct }));
    const n = Math.max(1, Math.min(9, m.level || 1));
    const out = [];
    const A = {}; // Ankerpunkte für die Beschriftung (opts.annotate)
    const groups = new Map(); // Farbe → Pfaddaten (eine <path> je Farbe hält das SVG klein)
    const tex = new Map(); // Musterung der Steine: "fill|Farbe" oder "stroke|Farbe" → Pfaddaten
    const addTex = (k, d) => tex.set(k, (tex.get(k) || "") + d);
    const addCell = (pts, color, raw) => {
      groups.set(color, (groups.get(color) || "") + poly(pts));
      if (stone) texture(pts, STONE_BY_HEX.get(raw), tr, addTex);
    };
    const flush = (width) => {
      for (const [c, d] of groups) out.push(`<path d="${d}" fill="${c}" stroke="${MAT.ink}" stroke-width="${stone ? 0.55 : width}" stroke-linejoin="round"/>`);
      for (const [k, d] of tex) {
        const [mode, c] = k.split("|");
        out.push(mode === "fill" ? `<path d="${d}" fill="${c}" stroke="none"/>` : `<path d="${d}" fill="none" stroke="${c}" stroke-width=".5" stroke-linecap="round"/>`);
      }
      groups.clear();
      tex.clear();
    };
    // Licht: Mitte heller, Ränder dunkler (ohne Verlauf-Definitionen)
    const light = (x, y) => 1.08 - 0.25 * Math.min(1, Math.hypot(x / (W / 2), (y - H * 0.45) / (H * 0.6)));
    const glass = (c, x, y) => {
      const f = stone ? 0.9 + 0.16 * r() : light(x, y) * (0.88 + 0.24 * r()); // Stein: kein Durchlicht
      const q = Math.round(f * 8) / 8; // auf Stufen runden, damit wenige Pfade entstehen
      return shade(c, q);
    };

    // Rahmen aus Stein und Fensteröffnung
    const outer = arc(-W / 2 - 7, W + 14, YS, YB + 6).pts;
    const inner = arc(-W / 2, W, YS, YB).pts;
    out.push(`<path d="${poly(outer)}" fill="${MAT.frame}" stroke="${MAT.edge}" stroke-width="1.2"/>`);
    if (stone) out.push(ashlar(inner, 7));

    // Bahnen
    const mw = n > 1 ? 5 : 0;
    const lw = (W - (n - 1) * mw) / n;
    const yl = n === 1 ? YS + 52 : YS + 10;
    const lanes = Array.from({ length: n }, (_, i) => {
      const x0 = -W / 2 + i * (lw + mw);
      return n === 1 ? { x0, w: W, pts: inner, apex: Y0 } : { x0, w: lw, ...arc(x0, lw, yl, YB) };
    });
    const laneTop = Math.min(...lanes.map((l) => l.apex));

    // Bogenfeld: Medaillon für das heilige Symbol – so groß, wie es zwischen Bogen und Bahnen passt
    const limitY = n === 1 ? YS + 28 : laneTop;
    let oc = { y: 0, r: 0 };
    for (let y = Y0 + 12; y < limitY - 8; y += 1) {
      const rr = Math.min(stone ? edgeDist(inner, 0, y) - 3 : R - Math.hypot(R - W / 2, YS - y) - 3, limitY - 4 - y, 34);
      if (rr > oc.r) oc = { y, r: rr };
    }

    // Glas des Bogenfelds (größere Scheiben)
    const tymPts = [];
    if (stone) hexGrid(tymPts, -W / 2, Y0 - 6, W / 2, limitY + 8, 12, r);
    else for (let y = Y0; y < limitY + 6; y += 12) for (let x = -W / 2; x <= W / 2; x += 12) tymPts.push([x + (r() - 0.5) * 8, y + (r() - 0.5) * 8]);
    for (const c of voronoi(tymPts, clipPoly(inner, [[-W, Y0 - 5], [W, Y0 - 5], [W, limitY + 8], [-W, limitY + 8]]), 30)) {
      const raw = weighted(r, baseW.slice().reverse());
      addCell(c.cell, glass(raw, c.p[0], c.p[1]), raw);
    }
    flush(1.1);

    // Scheiben der Bahnen; Gestalt bestimmt die Anordnung der Zellen
    const kind = (m.shape && m.shape.kind) || "other";
    const radial = ["burst", "spread", "emanation", "sphere", "cylinder"].includes(kind);
    const stretched = ["ray", "line", "cone"].includes(kind);
    const hz = Math.min(26, (YB - yl) * 0.12); // Sockelhöhe
    const md = { x: 0, y: (yl + YB - hz) / 2 + 6, r: n === 1 ? 22 : n % 2 ? Math.min(22, lw / 2 - 3) : Math.min(22, lw * 0.85) };
    const s = n === 1 ? 11 : Math.max(7.5, Math.min(10, lw / 3.4));
    const cand = []; // Zellen unterhalb des Medaillons, aus denen die Beispielscheiben gewählt werden
    for (const ln of lanes) {
      const region = clipPoly(ln.pts, [[-W, -10], [W, -10], [W, YB - hz], [-W, YB - hz]]);
      const pts = [];
      if (radial) {
        for (let rad = s * 0.8; rad < H; rad += s) {
          const k = Math.max(6, Math.round((2 * Math.PI * rad) / s));
          for (let i = 0; i < k; i++) {
            const a = (2 * Math.PI * (i + (r() - 0.5) * 0.3)) / k, rr = rad + (r() - 0.5) * s * 0.12;
            const x = md.x + Math.cos(a) * rr, y = md.y + Math.sin(a) * rr;
            if (x > ln.x0 - s && x < ln.x0 + ln.w + s && y > ln.apex - s && y < YB) pts.push([x, y]);
          }
        }
      } else if (stone && !stretched) {
        hexGrid(pts, ln.x0 - s, ln.apex - s, ln.x0 + ln.w + s, YB - hz + s, s, r); // Basaltsäulen: fast regelmäßige Sechsecke
      } else {
        const sx = stretched ? s * 0.75 : s, sy = stretched ? s * 1.7 : s;
        for (let y = ln.apex - sy / 2; y < YB - hz + sy; y += sy) for (let x = ln.x0 - sx / 2; x < ln.x0 + ln.w + sx; x += sx) pts.push([x + (r() - 0.5) * sx * 0.8, y + (r() - 0.5) * sy * 0.8]);
      }
      for (const c of voronoi(pts, region, s * 3.2)) {
        const acc = r() < 0.32;
        const raw = acc ? weighted(r, ess) : weighted(r, baseW);
        addCell(c.cell, glass(raw, c.p[0], c.p[1]), raw);
        // Beispielzellen für die Beschriftung: in der letzten Bahn, abseits des Medaillons
        const [px, py] = c.p;
        if (Math.hypot(px - md.x, py - md.y) > md.r + 9 && py > md.y - md.r && py < YB - hz - 6) cand.push({ p: c.p, acc });
        if (ln === lanes[0] && !A.cells && py > (n === 1 ? YS + 30 : yl + 24) && py < md.y - md.r - 10 && px > ln.x0 + 4 && px < ln.x0 + ln.w - 4) A.cells = c.p;
      }
      flush(n > 2 ? 0.9 : 1.1);
      // Sockel nach Wirkungsdauer
      out.push(socle(m.duration && m.duration.kind, ln.x0, ln.w, YB - hz, hz, base));
      // Bordüre bei Rettungswurf: rote und helle Gläser am Rand
      if (m.save && m.save.type && m.save.type !== "none") {
        const b = arc(ln.x0 + 2, ln.w - 4, n === 1 ? YS : yl, YB - hz).pts;
        out.push(`<path d="${poly(b)}" fill="none" stroke="${MAT.inlay}" stroke-width="3"/><path d="${poly(b)}" fill="none" stroke="${MAT.red}" stroke-width="3" stroke-dasharray="3 3"/>`);
      }
      out.push(`<path d="${poly(ln.pts)}" fill="none" stroke="${MAT.ink}" stroke-width="${stone ? 1.2 : 2}"/>`);
    }
    const tracery = [];
    // Pfosten zwischen den Bahnen
    for (let i = 1; i < n; i++) {
      const x = -W / 2 + i * (lw + mw) - mw;
      out.push(`<path d="M${f1(x)} ${f1(YB)}V${f1(yl)}H${f1(x + mw)}V${f1(YB)}Z" fill="${MAT.frame}" stroke="${MAT.edge}" stroke-width=".8"/>`);
      if (stone) for (let y = YB - 14; y > yl + 4; y -= 14) out.push(`<path d="M${f1(x)} ${f1(y)}h${mw}" stroke="${MAT.edge}" stroke-width=".6"/>`);
    }
    // Maßwerk im Bogenfeld: Pässe nach der Zahl der Schule
    const foils = foilCount(m.school);
    const ocBg = shade(base[0], 0.42);
    tracery.push(`<circle cx="0" cy="${f1(oc.y)}" r="${f1(oc.r + 2.5)}" fill="${MAT.frame}" stroke="${MAT.edge}" stroke-width="1"/>`);
    tracery.push(`<circle cx="0" cy="${f1(oc.y)}" r="${f1(oc.r)}" fill="${ocBg}" stroke="${MAT.ink}" stroke-width="1.3"/>`);
    const [fd, fr] = foilGeom(foils, oc.r);
    for (let i = 0; i < foils; i++) {
      const a = (2 * Math.PI * i) / foils - Math.PI / 2;
      tracery.push(`<circle cx="${f1(fd * Math.cos(a))}" cy="${f1(oc.y + fd * Math.sin(a))}" r="${f1(fr)}" fill="${shade(ocBg, 1.25)}" stroke="${MAT.frame}" stroke-width="1.6"/>`);
    }
    tracery.push(symbolSVG(deity && deity.symbol, 0, oc.y, oc.r * 0.78, base[0]));

    out.push(...tracery);
    // Beispielscheiben: nächste Akzentzelle rechts, nächste Grundzelle links neben dem Medaillon
    const near = (acc, tx, ty) => cand.filter((c) => c.acc === acc).sort((a, b) => Math.hypot(a.p[0] - tx, a.p[1] - ty) - Math.hypot(b.p[0] - tx, b.p[1] - ty))[0];
    A.accent = (near(true, W * 0.32, md.y + 6) || {}).p;
    A.base = (near(false, -W * 0.32, md.y + 6) || {}).p;
    A.lanes = [lanes[0].x0 + lanes[0].w / 2, n === 1 ? YS + 18 : yl + 4];
    A.tym = [oc.r * 0.72, oc.y - oc.r * 0.72];
    A.md = [md.x + md.r * 0.62, md.y - md.r * 0.62];
    A.socle = [lanes[lanes.length - 1].x0 + lanes[lanes.length - 1].w / 2, YB - hz / 2];
    if (m.save && m.save.type && m.save.type !== "none") A.border = [lanes[0].x0 + 2, (md.y + YB - hz) / 2];
    // Medaillon der Hauptessenz: Farben aus Haupt- und zweiter Essenz, Form aus Reichweite, Komponenten, Zeitaufwand, Zauberresistenz
    const e1 = essColor(m.primary) || base[0], e2 = essColor((m.essences[1] || {}).id) || shade(e1, 1.4);
    out.push(medallion(md.x, md.y, md.r, medallionSpec(m), e1, e2, base[0]));
    out.push(`<path d="${poly(inner)}" fill="none" stroke="${MAT.ink}" stroke-width="${stone ? 1.4 : 2.4}"/>`);
    // Beschriftung: rote Nummern wie bei den Magierkreisen (Reihenfolge = legend())
    if (opts.annotate)
      ANNOT_ORDER.forEach((k, i) => {
        const a = A[k];
        if (!a) return;
        out.push(`<g class="vt-annot"><circle cx="${f1(a[0])}" cy="${f1(a[1])}" r="6.5" fill="#8b1e1e" stroke="#f3e9d2" stroke-width="1.4"/><text x="${f1(a[0])}" y="${f1(a[1] + 3.2)}" text-anchor="middle" font-size="9" font-family="Arial,sans-serif" font-weight="700" fill="#fff">${i + 1}</text></g>`);
      });

    const cls = "vitrail" + (opts.cls ? " " + opts.cls : "");
    return `<svg class="${cls}" viewBox="${-W / 2 - 9} 0 ${W + 18} ${H + 2}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Andachtsbild">${out.join("")}</svg>`;
  }

  // Sechseckgitter mit wenig Versatz (Steinintarsie)
  function hexGrid(pts, x0, y0, x1, y1, s, r) {
    const dy = s * 0.866;
    for (let y = y0, row = 0; y < y1; y += dy, row++)
      for (let x = x0 + (row % 2) * (s / 2); x < x1; x += s) pts.push([x + (r() - 0.5) * s * 0.18, y + (r() - 0.5) * s * 0.18]);
  }
  // Musterung einer Steinzelle; alle Punkte liegen innerhalb der (konvexen) Zelle
  function texture(pts, st, r, add) {
    if (!st || !st.tex) return;
    const cx = pts.reduce((a, p) => a + p[0], 0) / pts.length, cy = pts.reduce((a, p) => a + p[1], 0) / pts.length;
    const at = (p, t) => [cx + (p[0] - cx) * t, cy + (p[1] - cy) * t];
    const pick = () => pts[Math.floor(r() * pts.length)];
    if (st.tex === "vein") {
      const a = at(pick(), 0.85), b = at(pts[(pts.indexOf(pick()) + Math.floor(pts.length / 2)) % pts.length], 0.85), m = at([cx + (r() - 0.5) * 6, cy + (r() - 0.5) * 6], 1);
      add("stroke|" + st.tc, `M${f1(a[0])} ${f1(a[1])}Q${f1(m[0])} ${f1(m[1])} ${f1(b[0])} ${f1(b[1])}`);
    } else if (st.tex === "band") {
      for (const t of [0.68, 0.38]) add("stroke|" + st.tc, poly(pts.map((p) => at(p, t))));
    } else if (st.tex === "speck") {
      for (let i = 0; i < 4; i++) {
        const q = at(pick(), 0.15 + 0.55 * r()), rad = 0.35 + 0.35 * r();
        add("fill|" + st.tc, `M${f1(q[0] - rad)} ${f1(q[1])}a${f1(rad)} ${f1(rad)} 0 1 0 ${f1(2 * rad)} 0a${f1(rad)} ${f1(rad)} 0 1 0 ${f1(-2 * rad)} 0Z`);
      }
    } else if (st.tex === "metal") {
      const a = at(pick(), 0.6);
      add("stroke|" + st.tc, `M${f1(a[0])} ${f1(a[1])}L${f1(cx)} ${f1(cy)}`);
    }
  }
  // Quaderfugen im Rahmen: kurze Fugen quer zum Rand, etwa alle 15 Einheiten
  function ashlar(inner, w) {
    let d = "";
    for (let i = 0; i < inner.length; i++) {
      const [ax, ay] = inner[i], [bx, by] = inner[(i + 1) % inner.length];
      const len = Math.hypot(bx - ax, by - ay);
      if (ay >= YB - 0.1 && by >= YB - 0.1) continue; // keine Fugen an der Unterkante
      const nx = (by - ay) / len, ny = -(bx - ax) / len; // Normale nach außen
      for (let t = 15; t < len - 4; t += 15) {
        const px = ax + ((bx - ax) * t) / len, py = ay + ((by - ay) * t) / len;
        d += `M${f1(px)} ${f1(py)}l${f1(nx * w * 0.95)} ${f1(ny * w * 0.95)}`;
      }
    }
    return `<path d="${d}" stroke="${MAT.edge}" stroke-width=".7" fill="none"/>`;
  }


  // --- Medaillon -----------------------------------------------------------------------
  // Blätter = Reichweite, Ecken der Fassung = Komponenten (+2), Blattform = Zeitaufwand, zweiter Ring = Zauberresistenz
  const PETALS = [0, 4, 6, 8, 12, 16]; // persönlich, Berührung, nah, mittel, weit, unbegrenzt
  const COMP_KEYS = ["V", "S", "M", "F", "DF"];
  function medallionSpec(m) {
    const comps = COMP_KEYS.filter((k) => m.components && m.components[k]).length;
    const ck = m.casting && m.casting.kind;
    return {
      petals: PETALS[(m.range && m.range.tier) || 0],
      unlimited: m.range && m.range.tier === 5,
      corners: comps ? comps + 2 : 0,
      tip: ck === "swift" || ck === "immediate" ? "pointed" : ck === "standard" || !ck ? "round" : "double",
      sr: !!(m.sr && m.sr.yes),
    };
  }
  function medallion(cx, cy, r, spec, e1, e2, frame) {
    const o = [];
    const P = (a, rr) => f1(cx + rr * Math.cos(a)) + " " + f1(cy + rr * Math.sin(a));
    const k = spec.corners;
    // Fassung: Vieleck mit k Ecken (Inkreis = Medaillon), ohne Komponenten ein Kreis
    const fr = r + 2.4;
    const R0 = k ? Math.min(fr / Math.cos(Math.PI / k), fr * 1.55) : fr;
    const inr = k ? R0 * Math.cos(Math.PI / k) : fr; // nutzbarer Innenradius
    const rr = Math.min(r, inr - 1.6);
    if (spec.unlimited) for (let i = 0; i < 16; i++) {
      const a = (2 * Math.PI * i) / 16 - Math.PI / 2;
      o.push(`<path d="M${P(a - 0.09, R0 - 1)}L${P(a, R0 + 7)}L${P(a + 0.09, R0 - 1)}Z" fill="${MAT.inlay}" stroke="${MAT.ink}" stroke-width=".8"/>`);
    }
    // Zauberresistenz: zweiter Rahmen aus hellem Glas hinter der Fassung (einfarbig, damit kein Glas durchscheint)
    const RING = MAT.inlay, rw = 3.6;
    if (spec.sr) o.push(k ? `<path d="M${Array.from({ length: k }, (_, i) => P((2 * Math.PI * i) / k - Math.PI / 2, R0 + rw / Math.cos(Math.PI / k))).join("L")}Z" fill="${RING}" stroke="${MAT.ink}" stroke-width="1.2" stroke-linejoin="round"/>` : `<circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(fr + rw)}" fill="${RING}" stroke="${MAT.ink}" stroke-width="1.2"/>`);
    o.push(k ? `<path d="M${Array.from({ length: k }, (_, i) => P((2 * Math.PI * i) / k - Math.PI / 2, R0)).join("L")}Z" fill="${frame}" stroke="${MAT.ink}" stroke-width="1.6" stroke-linejoin="round"/>` : `<circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(fr)}" fill="${frame}" stroke="${MAT.ink}" stroke-width="1.6"/>`);
    const n = spec.petals, ri = rr * 0.32;
    if (!n) {
      // persönlich: geschlossene Scheibe, innen die zweite Essenz
      o.push(`<circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(rr)}" fill="${shade(e1, 1.05)}" stroke="${MAT.ink}" stroke-width="1"/>`);
      o.push(`<circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(rr * 0.55)}" fill="${shade(e2, 1.05)}" stroke="${MAT.ink}" stroke-width="1"/>`);
    } else {
      const ring = (n2, rIn, rOut, off, shape) => {
        for (let i = 0; i < n2; i++) {
          const a0 = (2 * Math.PI * (i + off)) / n2 - Math.PI / 2, a1 = (2 * Math.PI * (i + 1 + off)) / n2 - Math.PI / 2, am = (a0 + a1) / 2;
          const d = shape === "pointed"
            ? `M${P(a0, rIn)}L${P(a0, rIn + (rOut - rIn) * 0.55)}L${P(am, rOut)}L${P(a1, rIn + (rOut - rIn) * 0.55)}L${P(a1, rIn)}Z`
            : `M${P(a0, rIn)}L${P(a0, rOut * 0.86)}Q${P(am, rOut * 1.12)} ${P(a1, rOut * 0.86)}L${P(a1, rIn)}Z`;
          o.push(`<path d="${d}" fill="${shade(i % 2 ? e2 : e1, 1.02 + 0.06 * (i % 3))}" stroke="${MAT.ink}" stroke-width="1" stroke-linejoin="round"/>`);
        }
      };
      ring(n, ri, rr, 0, spec.tip === "pointed" ? "pointed" : "round");
      // lange Gebete: ein zweiter, innerer Blattkranz, um ein halbes Blatt versetzt
      if (spec.tip === "double") ring(n, ri, rr * 0.62, 0.5, "round");
    }
    o.push(`<circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(ri)}" fill="#f6eed3" stroke="${MAT.ink}" stroke-width="1"/>`);
    return o.join("");
  }
  // Musterbild eines Medaillons für die Legende
  function medallionMini(spec, base) {
    const e1 = essColor("lux"), e2 = essColor("bonum");
    return `<svg class="vt-mini" viewBox="-24 -24 48 48" xmlns="http://www.w3.org/2000/svg">${medallion(0, 0, 14, { petals: 8, corners: 0, tip: "round", sr: false, ...spec }, e1, e2, base[0])}</svg>`;
  }

  // Sockel: ein Band unter den Scheiben, Muster nach Wirkungsdauer
  function socle(kind, x0, w, y, h, base) {
    const c1 = shade(base[0], 0.8), c2 = base[1] ? base[1] : shade(base[0], 1.4);
    const st = `stroke="${MAT.ink}" stroke-width=".9"`;
    const rect = (x, yy, ww, hh, c) => `<path d="M${f1(x)} ${f1(yy)}h${f1(ww)}v${f1(hh)}h${f1(-ww)}Z" fill="${c}" ${st}/>`;
    let o = rect(x0, y, w, h, c1);
    const k = Math.max(3, Math.round(w / 9));
    const step = w / k;
    if (kind === "rounds") for (let i = 0; i < k; i++) o += rect(x0 + i * step + step * 0.2, y + h * 0.3, step * 0.6, h * 0.4, c2);
    else if (kind === "minutes") {
      let d = `M${f1(x0)} ${f1(y + h / 2)}`;
      for (let i = 0; i < k; i++) d += `q${f1(step / 2)} ${f1(-h * 0.45)} ${f1(step)} 0`;
      o += `<path d="${d}V${f1(y + h)}H${f1(x0)}Z" fill="${c2}" ${st}/>`;
    } else if (kind === "hours") o += rect(x0, y + h * 0.2, w, h * 0.22, c2) + rect(x0, y + h * 0.58, w, h * 0.22, c2);
    else if (kind === "days") {
      let d = `M${f1(x0)} ${f1(y + h)}`;
      for (let i = 0; i < k; i++) d += `V${f1(y + h * 0.25)}h${f1(step / 2)}V${f1(y + h * 0.6)}h${f1(step / 2)}`;
      o += `<path d="${d}V${f1(y + h)}Z" fill="${c2}" ${st}/>`;
    } else if (kind === "permanent") for (let i = 0; i < k; i++) o += `<circle cx="${f1(x0 + (i + 0.5) * step)}" cy="${f1(y + h / 2)}" r="${f1(Math.min(step, h) * 0.38)}" fill="${c2}" ${st}/>`;
    else if (kind !== "instant") for (let i = 0; i < k; i++) o += `<path d="M${f1(x0 + (i + 0.5) * step)} ${f1(y + h * 0.15)}l${f1(step * 0.35)} ${f1(h * 0.35)}l${f1(-step * 0.35)} ${f1(h * 0.35)}l${f1(-step * 0.35)} ${f1(-h * 0.35)}Z" fill="${c2}" ${st}/>`;
    return o;
  }

  // Kapitelornament: leeres Fenster mit n Bahnen (nur Stein und Blei)
  function ornament(n) {
    const out = [];
    const arc = archOf();
    out.push(`<path d="${poly(arc(-W / 2 - 7, W + 14, YS, YB + 6).pts)}" fill="none" stroke="currentColor" stroke-width="2"/>`);
    out.push(`<path d="${poly(arc(-W / 2, W, YS, YB).pts)}" fill="none" stroke="currentColor" stroke-width="1"/>`);
    const mw = n > 1 ? 5 : 0, lw = (W - (n - 1) * mw) / n, yl = n === 1 ? YS + 52 : YS + 10;
    for (let i = 0; i < n && n > 1; i++) out.push(`<path d="${poly(arc(-W / 2 + i * (lw + mw), lw, yl, YB).pts)}" fill="none" stroke="currentColor" stroke-width="1"/>`);
    out.push(`<circle cx="0" cy="${f1(Y0 + HB * 0.55)}" r="${f1(Math.min(24, HB * 0.3))}" fill="none" stroke="currentColor" stroke-width="1"/>`);
    return `<svg class="vt-orn" viewBox="${-W / 2 - 9} 0 ${W + 18} ${H + 2}">${out.join("")}</svg>`;
  }

  // Kleine Musterbilder für die Legendenseiten im Vorspann
  const mini = (vb, body, cls = "vt-mini") => `<svg class="${cls}" viewBox="${vb}" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
  // Muster einer Essenz im aktuellen Material (Glasstück oder gemusterter Stein)
  function essSwatch(id) {
    if (MAT.id !== "stone") return glassSwatch(ESS_GLASS[id]);
    const st = stoneOf(ESS_STONE[id]);
    const cells = [[[1, 1], [14, 1], [11, 12], [1, 9]], [[14, 1], [23, 1], [23, 14], [11, 12]], [[1, 9], [11, 12], [9, 23], [1, 23]], [[11, 12], [23, 14], [23, 23], [9, 23]]];
    const r = U.rng("swatch|" + id), t = new Map();
    let o = "";
    cells.forEach((c, i) => { o += `<path d="${poly(c)}" fill="${shade(st.c, 0.92 + 0.05 * i)}" stroke="${MAT.ink}" stroke-width=".5"/>`; texture(c, st, r, (k, d) => t.set(k, (t.get(k) || "") + d)); });
    for (const [k, d] of t) { const [mode, c] = k.split("|"); o += mode === "fill" ? `<path d="${d}" fill="${c}"/>` : `<path d="${d}" fill="none" stroke="${c}" stroke-width=".5"/>`; }
    return mini("0 0 24 24", o + `<path d="M1 1H23V23H1Z" fill="none" stroke="${MAT.ink}" stroke-width="1"/>`);
  }
  const essStoneName = (id) => stoneOf(ESS_STONE[id]).de;
  function glassSwatch(c) {
    return mini("0 0 24 24", `<path d="M1 1H23V23H1Z" fill="${c}" stroke="${MAT.ink}" stroke-width="1.6"/><path d="M1 9L12 13L23 6M12 13L9 23" fill="none" stroke="${MAT.ink}" stroke-width="1.2"/><path d="M3 3H10L5 7Z" fill="#fff" opacity=".25"/>`);
  }
  function foilsMini(count, tint) {
    const bg = shade(tint, 0.42), rr = 20, [fd, fr] = foilGeom(count, rr);
    let o = `<circle r="${rr + 2.5}" fill="${MAT.frame}" stroke="${MAT.edge}"/><circle r="${rr}" fill="${bg}" stroke="${MAT.ink}" stroke-width="1.3"/>`;
    for (let i = 0; i < count; i++) {
      const a = (2 * Math.PI * i) / count - Math.PI / 2;
      o += `<circle cx="${f1(fd * Math.cos(a))}" cy="${f1(fd * Math.sin(a))}" r="${f1(fr)}" fill="${shade(bg, 1.25)}" stroke="${MAT.frame}" stroke-width="1.6"/>`;
    }
    return mini("-25 -25 50 50", o);
  }
  function socleMini(kind, base) {
    return mini("-1 -1 62 18", socle(kind, 0, 60, 0, 16, base), "vt-mini wide");
  }
  // Zellmuster: gleichmäßig, gestreckt oder strahlenförmig
  function cellsMini(mode, base) {
    // Muster nach aktuellem Material
    const r = U.rng("cells|" + mode), w = 40, h = 60, s = 8;
    const region = [[0, 0], [w, 0], [w, h], [0, h]], pts = [];
    if (mode === "radial") for (let rad = s * 0.8; rad < 50; rad += s) {
      const k = Math.max(6, Math.round((2 * Math.PI * rad) / s));
      for (let i = 0; i < k; i++) { const a = (2 * Math.PI * (i + (r() - 0.5) * 0.3)) / k; pts.push([w / 2 + Math.cos(a) * rad, h / 2 + Math.sin(a) * rad]); }
    } else if (mode === "even" && MAT.id === "stone") hexGrid(pts, -s, -s, w + s, h + s, s, r);
    else {
      const sx = mode === "stretched" ? s * 0.75 : s, sy = mode === "stretched" ? s * 1.7 : s;
      for (let y = -sy / 2; y < h + sy; y += sy) for (let x = -sx / 2; x < w + sx; x += sx) pts.push([x + (r() - 0.5) * sx * 0.8, y + (r() - 0.5) * sy * 0.8]);
    }
    const body = voronoi(pts, region, s * 3.2).map((c, i) => `<path d="${poly(c.cell)}" fill="${shade(base[i % base.length], 0.85 + 0.3 * r())}" stroke="${MAT.ink}" stroke-width="1"/>`).join("");
    return mini("-1 -1 42 62", body + `<path d="M0 0H40V60H0Z" fill="none" stroke="${MAT.ink}" stroke-width="2"/>`, "vt-mini tall");
  }
  function borderMini(on, base) {
    const a = archOf()(0, 30, 22, 66).pts, b = archOf()(2, 26, 22, 66).pts;
    return mini("-2 -2 34 70", `<path d="${poly(a)}" fill="${shade(base[0], 0.9)}" stroke="${MAT.ink}" stroke-width="1"/>` + (on ? `<path d="${poly(b)}" fill="none" stroke="${MAT.inlay}" stroke-width="3"/><path d="${poly(b)}" fill="none" stroke="${MAT.red}" stroke-width="3" stroke-dasharray="3 3"/>` : "") + `<path d="${poly(a)}" fill="none" stroke="${MAT.ink}" stroke-width="2"/>`, "vt-mini tall");
  }
  // Zahl der Pässe = Zahl der Schule (Nekromantie 2 … Verwandlung 12), Universalmagie 10 – jede Schule eindeutig
  function foilCount(school) {
    const n = (window.THEORY.SCHOOLS[school] || window.THEORY.SCHOOLS.universal).number;
    return n >= 2 ? Math.min(12, n) : 10;
  }
  // Abstand und Radius der Pässe: bei vielen Pässen kleiner, damit sie sich nur leicht überlappen
  const foilGeom = (n, r) => [r * (n > 6 ? 0.64 : 0.56), r * Math.min(0.42, 0.75 * Math.sin(Math.PI / n))];

  // Lesart eines Fensters (für Dialog und Vorspann); Reihenfolge = Nummern der Beschriftung
  const CORNER_DE = { 3: "Dreieck", 4: "Viereck", 5: "Fünfeck", 6: "Sechseck", 7: "Siebeneck" };
  const ANNOT_ORDER = ["lanes", "tym", "md", "accent", "base", "cells", "socle", "border"];
  function legend(m, deity) {
    const prev = MAT;
    use(materialFor(deity));
    try {
      return legendItems(m, deity);
    } finally {
      MAT = prev;
    }
  }
  function legendItems(m, deity) {
    const T = window.THEORY;
    const Wd = WORDS[MAT.id];
    const stoneNames = (keys) => (MAT.id === "stone" ? ` (${keys.map((k) => stoneOf(k).de).join(", ")})` : "");
    const { front, back } = symbolMotifs(deity && deity.symbol);
    const MOT = { sword: "Schwert", sun: "Sonne", hammer: "Hammer", anvil: "Amboss", flame: "Flamme", shield: "Schild", scales: "Waage", eye: "Auge", star: "Stern", crown: "Krone", moon: "Mond", key: "Schlüssel", tree: "Baum", feather: "Feder", rose: "Rose", rosette: "Rosette" };
    const ed = (id) => T.ESS[id].de.replace(/ \(.*\)$/, "");
    const kind = m.shape && m.shape.kind;
    const cellMode = ["ray", "line", "cone"].includes(kind) ? "senkrecht gestreckt" : ["burst", "spread", "emanation", "sphere", "cylinder"].includes(kind) ? "in Ringen um das Medaillon" : MAT.id === "stone" ? "gleichmäßige Sechsecke" : "gleichmäßig";
    const items = [
      { k: "Bahnen", key: "lanes", t: `${Math.max(1, m.level)} Bahn${m.level > 1 ? "en" : ""} – ${m.level ? U.ROMAN[m.level] + ". Grad" : "ohne Grad"}. Je höher der Grad, desto mehr Bahnen nebeneinander.` },
      { k: "Bogenfeld", key: "tym", t: `${Wd.tym} oben mit dem heiligen Symbol (${deity ? deity.symbol + " → " : ""}${MOT[front]}${back ? " vor " + MOT[back] : ""}). Die ${foilCount(m.school)} Kreise darum sind die Pässe des Maßwerks; ihre Zahl zeigt die Schule (${m.schoolInfo.de}).` },
      { k: "Medaillon", key: "md", t: (() => {
        const sp = medallionSpec(m);
        const comps = COMP_KEYS.filter((c) => m.components && m.components[c]).map((c) => (c === "DF" ? "GF" : c)).join(", ");
        const blatt = sp.petals ? `${sp.petals} Blätter für die Reichweite (${m.range.de})${sp.unlimited ? " mit Strahlen" : ""}, ${sp.tip === "pointed" ? "spitz: ein schnelles Gebet" : sp.tip === "double" ? "zwei Blattkränze: ein langes Gebet" : "rund: Standard-Aktion"}` : `eine geschlossene Scheibe für die Reichweite ${m.range.de}`;
        return `Rosette in der Mitte der Bahnen, abwechselnd in der Farbe der Hauptessenz ${T.ESS[m.primary].latin} (${ed(m.primary)})${m.essences[1] ? " und der zweiten Essenz " + T.ESS[m.essences[1].id].latin : ""}: ${blatt}. Die Fassung ist ${sp.corners ? `ein ${CORNER_DE[sp.corners]} für ${comps.split(", ").length} Komponenten (${comps})` : "rund: keine Komponenten"}${sp.sr ? "; der zweite Ring zeigt Zauberresistenz" : ""}.`;
      })() },
      { k: Wd.accent, key: "accent", t: `Etwa jede dritte ${Wd.piece} trägt eine Essenzfarbe, so oft wie ihr Anteil: ${m.essences.map((x) => `${T.ESS[x.id].latin}${MAT.id === "stone" ? " (" + essStoneName(x.id) + ")" : ""} ${x.pct} %`).join(", ")}.` },
      { k: Wd.base, key: "base", t: deity && deity.colors.length ? `Die übrigen ${Wd.pieces} in den heiligen Farben ${deity.name}s: ${deity.colors.map((c) => c.name).join(", ")}${stoneNames(deity.colors.map((c) => COLOR_STONE[c.name] || "granite"))}.` : `Die übrigen ${Wd.pieces} in einer Palette nach Gesinnung (die Gottheit hat keine heiligen Farben)${stoneNames(ALIGN_STONE[(deity && deity.align) || "LG"] || ALIGN_STONE.LG)}.` },
      { k: "Zellen", key: "cells", t: `Form der ${Wd.pieces} nach der Gestalt (${kind && T.SHAPES[kind] ? T.SHAPES[kind].de : "frei"}): ${cellMode}.` },
      { k: "Sockel", key: "socle", t: `Band am Fuß jeder Bahn nach der Wirkungsdauer: ${m.duration ? m.duration.de : "–"}.` },
      { k: "Bordüre", key: "border", t: m.save && m.save.type !== "none" ? `${Wd.border}: Das Ziel kann sich wehren (${m.save.de}).` : "Keine Bordüre: kein Rettungswurf." },
    ];
    return items.map((x, i) => ({ ...x, n: i + 1 }));
  }

  // Einstellung des Charakters und Material für eine Gottheit; withMaterial setzt MAT für Musterbilder im Vorspann
  const setMaterial = (v) => (SETTING = ["glass", "stone"].includes(v) ? v : "auto");
  const withMaterial = (d, fn) => {
    const prev = MAT;
    use(materialFor(d));
    try {
      return fn(WORDS[MAT.id]);
    } finally {
      MAT = prev;
    }
  };
  const colorStoneName = (name) => stoneOf(COLOR_STONE[name] || "granite").de;
  return { render, ornament, legend, setMaterial, materialFor, withMaterial, isDwarven, essSwatch, essStoneName, essColor, colorStoneName, symbolMotifs, symbolSVG, palette, glassSwatch, medallionMini, foilsMini, socleMini, cellsMini, borderMini, foilCount, ESS_GLASS, MOTIFS };
})();
