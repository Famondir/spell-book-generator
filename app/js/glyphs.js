// SVG-Grundformen und alle Glyphen. Jede Glyphe ist eine Funktion (x, y, s) -> SVG-String,
// s = halbe Kantenlänge. Gezeichnet wird mit currentColor, damit Druck und Bildschirm passen.
(function () {
  const f = (n) => Math.round(n * 100) / 100;
  const P = (pts) => pts.map(([x, y]) => f(x) + "," + f(y)).join(" ");
  const polar = (cx, cy, r, deg) => {
    const a = ((deg - 90) * Math.PI) / 180; // 0° = Norden
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  };
  const poly = (cx, cy, r, n, rot = 0) => Array.from({ length: n }, (_, i) => polar(cx, cy, r, rot + (360 / n) * i));

  const S = {
    circle: (x, y, r, cls = "") => `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" class="${cls}"/>`,
    dot: (x, y, r) => `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" class="fill"/>`,
    line: (x1, y1, x2, y2, cls = "") => `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" class="${cls}"/>`,
    polygon: (pts, cls = "") => `<polygon points="${P(pts)}" class="${cls}"/>`,
    polyline: (pts, cls = "") => `<polyline points="${P(pts)}" class="${cls}"/>`,
    path: (d, cls = "") => `<path d="${d}" class="${cls}"/>`,
    // Sternpolygon {n/k}
    star: (cx, cy, r, n, k, rot = 0, cls = "") => {
      const pts = poly(cx, cy, r, n, rot);
      if (n % k === 0 || gcd(n, k) > 1) {
        // zusammengesetzter Stern: mehrere Polygone
        const parts = [];
        const g = gcd(n, k);
        for (let o = 0; o < g; o++) {
          const sub = [];
          for (let i = 0; i < n / g; i++) sub.push(pts[(o + i * k) % n]);
          parts.push(S.polygon(sub, cls));
        }
        return parts.join("");
      }
      const seq = [];
      for (let i = 0; i < n; i++) seq.push(pts[(i * k) % n]);
      return S.polygon(seq, cls);
    },
    arc: (cx, cy, r, a1, a2, cls = "") => {
      const [x1, y1] = polar(cx, cy, r, a1);
      const [x2, y2] = polar(cx, cy, r, a2);
      const large = (a2 - a1 + 360) % 360 > 180 ? 1 : 0;
      return `<path d="M${f(x1)},${f(y1)} A${f(r)},${f(r)} 0 ${large} 1 ${f(x2)},${f(y2)}" class="${cls}"/>`;
    },
    arrowHead: (x, y, deg, s = 6, cls = "fill") => {
      const tip = polar(x, y, 0, 0);
      const l = polar(x, y, s, deg + 180 - 25);
      const r = polar(x, y, s, deg + 180 + 25);
      return S.polygon([tip, l, r], cls);
    },
    text: (x, y, t, cls = "", size = 10) =>
      `<text x="${f(x)}" y="${f(y)}" class="${cls}" font-size="${size}" text-anchor="middle" dominant-baseline="middle">${U.esc(t)}</text>`,
    group: (inner, x = 0, y = 0, rot = 0, cls = "") =>
      `<g transform="translate(${f(x)},${f(y)}) rotate(${f(rot)})" class="${cls}">${inner}</g>`,
  };
  function gcd(a, b) {
    return b ? gcd(b, a % b) : a;
  }

  const tri = (x, y, s, up = true) =>
    up ? [[x, y - s], [x + s * 0.92, y + s * 0.7], [x - s * 0.92, y + s * 0.7]] : [[x, y + s], [x + s * 0.92, y - s * 0.7], [x - s * 0.92, y - s * 0.7]];

  // --- Essenzglyphen ------------------------------------------------------------
  const ESSENCE = {
    ignis: (x, y, s) => S.polygon(tri(x, y, s, true)),
    aqua: (x, y, s) => S.polygon(tri(x, y, s, false)),
    aer: (x, y, s) => S.polygon(tri(x, y, s, true)) + S.line(x - s * 0.95, y + s * 0.05, x + s * 0.95, y + s * 0.05),
    terra: (x, y, s) => S.polygon(tri(x, y, s, false)) + S.line(x - s * 0.95, y - s * 0.05, x + s * 0.95, y - s * 0.05),
    vita: (x, y, s) =>
      S.line(x, y + s, x, y - s * 0.3) +
      S.path(`M${f(x)},${f(y - s * 0.1)} Q${f(x - s)},${f(y - s * 0.3)} ${f(x - s * 0.8)},${f(y - s)} Q${f(x - s * 0.2)},${f(y - s * 0.8)} ${f(x)},${f(y - s * 0.1)}`) +
      S.path(`M${f(x)},${f(y + s * 0.25)} Q${f(x + s)},${f(y + s * 0.05)} ${f(x + s * 0.8)},${f(y - s * 0.65)} Q${f(x + s * 0.2)},${f(y - s * 0.45)} ${f(x)},${f(y + s * 0.25)}`),
    mors: (x, y, s) => S.circle(x, y, s * 0.85) + S.line(x - s * 0.6, y - s * 0.6, x + s * 0.6, y + s * 0.6) + S.line(x + s * 0.6, y - s * 0.6, x - s * 0.6, y + s * 0.6),
    lux: (x, y, s) =>
      S.circle(x, y, s * 0.45) + S.dot(x, y, s * 0.12) +
      poly(x, y, 1, 8).map((_, i) => { const a = polar(x, y, s * 0.62, i * 45), b = polar(x, y, s, i * 45); return S.line(a[0], a[1], b[0], b[1]); }).join(""),
    umbra: (x, y, s) =>
      S.path(`M${f(x + s * 0.2)},${f(y - s)} A${f(s)},${f(s)} 0 1 0 ${f(x + s * 0.2)},${f(y + s)} A${f(s * 0.75)},${f(s * 0.75)} 0 1 1 ${f(x + s * 0.2)},${f(y - s)}Z`, "fill"),
    mens: (x, y, s) => {
      let d = "";
      for (let i = 0; i <= 40; i++) {
        const t = i / 40, a = t * Math.PI * 4.2, r = s * t;
        d += (i ? "L" : "M") + f(x + r * Math.cos(a)) + "," + f(y + r * Math.sin(a));
      }
      return S.path(d);
    },
    vis: (x, y, s) =>
      S.polygon([[x, y - s * 0.9], [x + s * 0.7, y], [x, y + s * 0.9], [x - s * 0.7, y]]) +
      S.line(x, y + s, x, y - s * 1.05) + S.arrowHead(x, y - s * 1.05, 0, s * 0.45),
    ordo: (x, y, s) => S.polygon([[x - s * 0.8, y - s * 0.8], [x + s * 0.8, y - s * 0.8], [x + s * 0.8, y + s * 0.8], [x - s * 0.8, y + s * 0.8]]) + S.line(x - s * 0.8, y, x + s * 0.8, y) + S.line(x, y - s * 0.8, x, y + s * 0.8),
    fluxus: (x, y, s) =>
      poly(x, y, 1, 8).map((_, i) => { const b = polar(x, y, s, i * 45); return S.line(x, y, b[0], b[1]) + (i % 2 === 0 ? S.arrowHead(b[0], b[1], i * 45, s * 0.35) : ""); }).join("") + S.dot(x, y, s * 0.18),
    bonum: (x, y, s) => S.circle(x, y - s * 0.55, s * 0.35) + S.polyline([[x - s * 0.8, y + s * 0.8], [x, y], [x + s * 0.8, y + s * 0.8]]) + S.line(x, y, x, y + s),
    malum: (x, y, s) => S.circle(x, y + s * 0.3, s * 0.55) + S.path(`M${f(x - s * 0.95)},${f(y - s * 0.9)} Q${f(x - s * 0.6)},${f(y - s * 0.05)} ${f(x)},${f(y - s * 0.25)} Q${f(x + s * 0.6)},${f(y - s * 0.05)} ${f(x + s * 0.95)},${f(y - s * 0.9)}`),
    spatium: (x, y, s) => S.path(`M${f(x - s * 0.75)},${f(y + s)} L${f(x - s * 0.75)},${f(y - s * 0.2)} A${f(s * 0.75)},${f(s * 0.75)} 0 0 1 ${f(x + s * 0.75)},${f(y - s * 0.2)} L${f(x + s * 0.75)},${f(y + s)}`) + S.line(x - s, y + s, x + s, y + s) + S.dot(x, y + s * 0.15, s * 0.18),
    tempus: (x, y, s) => S.polygon([[x - s * 0.75, y - s], [x + s * 0.75, y - s], [x, y], [x + s * 0.75, y + s], [x - s * 0.75, y + s], [x, y]]) + S.line(x - s * 0.95, y - s, x + s * 0.95, y - s) + S.line(x - s * 0.95, y + s, x + s * 0.95, y + s),
  };

  // --- Schulsiegel (Kernsiegel) --------------------------------------------------
  const SCHOOL = {
    abjuration: (R) => S.circle(0, 0, R) + S.polygon(poly(0, 0, R, 4, 45)) + S.polygon(poly(0, 0, R * 0.707, 4, 0)) + S.polygon(poly(0, 0, R * 0.5, 4, 45)) + S.circle(0, 0, R * 0.36),
    conjuration: (R) => S.circle(0, 0, R) + S.star(0, 0, R, 5, 2) + S.polygon(poly(0, 0, R * 0.38, 5, 36)) + S.circle(0, 0, R * 0.3),
    divination: (R) =>
      S.circle(0, 0, R) + S.polygon(poly(0, 0, R, 3)) + S.polygon(poly(0, 0, R * 0.5, 3, 60)) +
      S.path(`M${-R * 0.42},0 Q0,${-R * 0.3} ${R * 0.42},0 Q0,${R * 0.3} ${-R * 0.42},0Z`),
    enchantment: (R) => S.circle(0, 0, R) + S.star(0, 0, R, 7, 3) + S.star(0, 0, R * 0.62, 7, 2, 180 / 7) + S.circle(0, 0, R * 0.33),
    evocation: (R) =>
      S.circle(0, 0, R) + S.star(0, 0, R, 6, 2) + S.polygon(poly(0, 0, R * 0.577, 6, 30)) +
      poly(0, 0, 1, 12).map((_, i) => { const a = polar(0, 0, R, i * 30 + 15), b = polar(0, 0, R * 1.14, i * 30 + 15); return S.line(a[0], a[1], b[0], b[1]); }).join(""),
    illusion: (R) => S.circle(0, 0, R) + S.star(0, 0, R, 8, 3, 22.5) + S.circle(0, 0, R * 0.38) + S.line(0, -R, 0, R, "dash"),
    necromancy: (R) =>
      S.circle(0, 0, R) + S.circle(-R * 0.3, -R * 0.08, R * 0.55) + S.circle(R * 0.3, -R * 0.08, R * 0.55) +
      S.polygon(tri(0, R * 0.25, R * 0.75, false)) + S.line(-R * 0.86, R * 0.5, R * 0.86, R * 0.5),
    transmutation: (R) => S.circle(0, 0, R) + S.polygon(poly(0, 0, R, 3)) + S.polygon(poly(0, 0, R * 0.5, 4, 45)) + S.circle(0, 0, R * 0.35) + S.polygon(poly(0, 0, R * 0.707, 4, 45), "faint"),
    universal: (R) => S.circle(0, 0, R) + S.circle(0, 0, R * 0.3) + poly(0, 0, 1, 8).map((_, i) => { const a = polar(0, 0, R * 0.3, i * 45), b = polar(0, 0, R, i * 45); return S.line(a[0], a[1], b[0], b[1]); }).join(""),
  };

  // --- Zeichen (Modifikatoren). Gezeichnet mit „oben“ = Wirkrichtung --------------
  const SIGN = {
    column: (s) => S.line(-s * 0.35, s, -s * 0.35, -s * 0.6) + S.line(s * 0.35, s, s * 0.35, -s * 0.6) + S.line(-s * 0.7, -s, s * 0.7, -s),
    dispersion: (s) => S.line(0, s, -s * 0.8, -s) + S.line(0, s, 0, -s) + S.line(0, s, s * 0.8, -s) + S.dot(0, s, s * 0.15),
    levitation: (s) => S.polyline([[-s * 0.7, -s * 0.1], [0, -s * 0.8], [s * 0.7, -s * 0.1]]) + S.line(-s * 0.8, s * 0.6, s * 0.8, s * 0.6),
    pull: (s) => S.line(0, s, 0, -s * 0.5) + S.arrowHead(0, -s, 0, s * 0.55) + S.line(-s * 0.6, s, s * 0.6, s),
    crush: (s) => S.polyline([[-s, s * 0.2], [-s * 0.5, -s * 0.6], [0, s * 0.4], [s * 0.5, -s * 0.6], [s, s * 0.2]]) + S.line(-s * 0.8, s * 0.8, s * 0.8, s * 0.8),
    direction: (s) => S.polyline([[-s * 0.8, s * 0.3], [0, -s * 0.6], [s * 0.8, s * 0.3]]) + S.polyline([[-s * 0.8, s * 0.9], [0, 0], [s * 0.8, s * 0.9]]),
    convergence: (s) => S.polygon([[0, -s], [s * 0.8, s * 0.7], [-s * 0.8, s * 0.7]]) + S.dot(0, -s * 0.15, s * 0.15),
    window: (s) => S.polygon([[-s * 0.7, -s * 0.7], [s * 0.7, -s * 0.7], [s * 0.7, s * 0.7], [-s * 0.7, s * 0.7]]) + S.line(0, -s * 0.7, 0, s * 0.7) + S.line(-s * 0.7, 0, s * 0.7, 0),
    diamond: (s) => S.polygon([[0, -s], [s * 0.65, 0], [0, s], [-s * 0.65, 0]]) + S.dot(0, 0, s * 0.15),
    collection: (s) => S.path(`M${-s * 0.75},${-s * 0.7} L${-s * 0.75},${s * 0.1} A${s * 0.75},${s * 0.75} 0 0 0 ${s * 0.75},${s * 0.1} L${s * 0.75},${-s * 0.7}`) + S.dot(0, -s * 0.1, s * 0.15),
    radial: (s) => S.circle(0, 0, s * 0.45) + poly(0, 0, 1, 6).map((_, i) => { const a = polar(0, 0, s * 0.6, i * 60), b = polar(0, 0, s, i * 60); return S.line(a[0], a[1], b[0], b[1]); }).join(""),
    bolt: (s) => S.line(0, s, 0, -s * 0.5) + S.arrowHead(0, -s, 0, s * 0.5) + S.line(0, s * 0.6, -s * 0.45, s) + S.line(0, s * 0.6, s * 0.45, s) + S.line(0, s * 0.2, -s * 0.45, s * 0.6) + S.line(0, s * 0.2, s * 0.45, s * 0.6),
    repetition: (s) => S.arc(0, 0, s * 0.75, 30, 330) + S.arrowHead(...polar(0, 0, s * 0.75, 330), 240, s * 0.45),
    vision: (s) => S.path(`M${-s},0 Q0,${-s * 0.85} ${s},0 Q0,${s * 0.85} ${-s},0Z`) + S.dot(0, 0, s * 0.25),
    weave: (s) => S.path(`M${-s},${-s * 0.3} Q${-s * 0.5},${-s} 0,${-s * 0.3} T${s},${-s * 0.3}`) + S.path(`M${-s},${s * 0.4} Q${-s * 0.5},${-s * 0.3} 0,${s * 0.4} T${s},${s * 0.4}`),
    enlarge: (s) =>
      S.polygon([[-s * 0.5, -s * 0.5], [s * 0.5, -s * 0.5], [s * 0.5, s * 0.5], [-s * 0.5, s * 0.5]]) +
      [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, b]) => S.line(a * s * 0.5, b * s * 0.5, a * s, b * s)).join(""),
    rain: (s) => [-0.6, 0, 0.6].map((x) => S.line(x * s, -s, x * s, -s * 0.3) + S.line(x * s, s * 0.05, x * s, s * 0.7)).join("") + S.line(-s, -s, s, -s),
    bird: (s) => S.path(`M${-s},${-s * 0.2} Q${-s * 0.5},${-s * 0.8} 0,${s * 0.2} Q${s * 0.5},${-s * 0.8} ${s},${-s * 0.2}`) + S.dot(0, s * 0.45, s * 0.15),
  };

  // --- Alchemistische Symbole für Materialkomponenten -----------------------------
  const ALCH = {
    sulfur: (x, y, s) => S.polygon(tri(x, y - s * 0.35, s * 0.6, true)) + S.line(x, y + s * 0.1, x, y + s) + S.line(x - s * 0.45, y + s * 0.55, x + s * 0.45, y + s * 0.55),
    sal: (x, y, s) => S.circle(x, y, s * 0.8) + S.line(x - s * 0.8, y, x + s * 0.8, y),
    mercurius: (x, y, s) => S.circle(x, y - s * 0.15, s * 0.4) + S.arc(x, y - s * 0.75, s * 0.35, 100, 260) + S.line(x, y + s * 0.25, x, y + s) + S.line(x - s * 0.35, y + s * 0.65, x + s * 0.35, y + s * 0.65),
    sol: (x, y, s) => S.circle(x, y, s * 0.8) + S.dot(x, y, s * 0.18),
    luna: (x, y, s) => S.path(`M${f(x)},${f(y - s * 0.85)} A${f(s * 0.85)},${f(s * 0.85)} 0 1 0 ${f(x)},${f(y + s * 0.85)} A${f(s * 0.6)},${f(s * 0.6)} 0 1 1 ${f(x)},${f(y - s * 0.85)}Z`),
    venus: (x, y, s) => S.circle(x, y - s * 0.35, s * 0.5) + S.line(x, y + s * 0.15, x, y + s) + S.line(x - s * 0.4, y + s * 0.55, x + s * 0.4, y + s * 0.55),
    mars: (x, y, s) => S.circle(x - s * 0.2, y + s * 0.2, s * 0.5) + S.line(x + s * 0.15, y - s * 0.15, x + s * 0.85, y - s * 0.85) + S.arrowHead(x + s * 0.85, y - s * 0.85, 45, s * 0.4),
    saturnus: (x, y, s) => S.line(x - s * 0.3, y - s, x - s * 0.3, y + s * 0.2) + S.line(x - s * 0.7, y - s * 0.55, x + s * 0.2, y - s * 0.55) + S.path(`M${f(x - s * 0.3)},${f(y + s * 0.2)} Q${f(x + s * 0.6)},${f(y - s * 0.2)} ${f(x + s * 0.3)},${f(y + s)}`),
    iupiter: (x, y, s) => S.path(`M${f(x - s * 0.7)},${f(y - s * 0.6)} Q${f(x)},${f(y - s * 1.1)} ${f(x - s * 0.2)},${f(y + s * 0.3)} L${f(x + s * 0.8)},${f(y + s * 0.3)}`) + S.line(x + s * 0.4, y - s * 0.6, x + s * 0.4, y + s),
    lapis: (x, y, s) => S.polygon([[x, y - s], [x + s * 0.7, y - s * 0.2], [x, y + s], [x - s * 0.7, y - s * 0.2]]) + S.line(x - s * 0.7, y - s * 0.2, x + s * 0.7, y - s * 0.2),
    onyx: (x, y, s) => S.polygon([[x, y - s], [x + s * 0.7, y], [x, y + s], [x - s * 0.7, y]], "fill"),
    os: (x, y, s) => S.line(x - s * 0.7, y - s * 0.7, x + s * 0.7, y + s * 0.7) + S.line(x + s * 0.7, y - s * 0.7, x - s * 0.7, y + s * 0.7) + [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, b]) => S.circle(x + a * s * 0.8, y + b * s * 0.8, s * 0.18)).join(""),
    sanguis: (x, y, s) => S.path(`M${f(x)},${f(y - s)} Q${f(x + s * 0.9)},${f(y + s * 0.2)} ${f(x)},${f(y + s * 0.9)} Q${f(x - s * 0.9)},${f(y + s * 0.2)} ${f(x)},${f(y - s)}Z`, "fill"),
    aer: (x, y, s) => ESSENCE.aer(x, y, s * 0.85),
    aqua: (x, y, s) => ESSENCE.aqua(x, y, s * 0.85),
    terra: (x, y, s) => ESSENCE.terra(x, y, s * 0.85),
    speculum: (x, y, s) => S.circle(x, y - s * 0.25, s * 0.6) + S.line(x - s * 0.3, y - s * 0.55, x + s * 0.3, y + s * 0.05) + S.line(x, y + s * 0.35, x, y + s),
    velum: (x, y, s) => [-0.5, 0, 0.5].map((o) => S.path(`M${f(x - s)},${f(y + o * s)} Q${f(x - s * 0.5)},${f(y + o * s - s * 0.35)} ${f(x)},${f(y + o * s)} T${f(x + s)},${f(y + o * s)}`)).join(""),
    mel: (x, y, s) => S.polygon(poly(x, y, s * 0.85, 6, 30)) + S.polygon(poly(x, y, s * 0.4, 6, 30)),
    vinculum: (x, y, s) => S.circle(x - s * 0.35, y, s * 0.45) + S.circle(x + s * 0.35, y, s * 0.45),
    herba: (x, y, s) => ESSENCE.vita(x, y, s * 0.9),
    oculus: (x, y, s) => S.path(`M${f(x - s)},${f(y)} Q${f(x)},${f(y - s * 0.85)} ${f(x + s)},${f(y)} Q${f(x)},${f(y + s * 0.85)} ${f(x - s)},${f(y)}Z`) + S.dot(x, y, s * 0.25),
    clavis: (x, y, s) => S.circle(x - s * 0.5, y, s * 0.35) + S.line(x - s * 0.15, y, x + s, y) + S.line(x + s * 0.6, y, x + s * 0.6, y + s * 0.4) + S.line(x + s * 0.9, y, x + s * 0.9, y + s * 0.3),
    platina: (x, y, s) => S.circle(x, y, s * 0.8) + S.path(`M${f(x)},${f(y - s * 0.55)} A${f(s * 0.55)},${f(s * 0.55)} 0 1 0 ${f(x)},${f(y + s * 0.55)} A${f(s * 0.38)},${f(s * 0.38)} 0 1 1 ${f(x)},${f(y - s * 0.55)}Z`),
    metallum: (x, y, s) => S.polygon([[x - s * 0.7, y - s * 0.45], [x + s * 0.7, y - s * 0.45], [x + s * 0.9, y + s * 0.45], [x - s * 0.9, y + s * 0.45]]) + S.line(x - s * 0.5, y, x + s * 0.5, y),
    pars: (x, y, s) => S.circle(x, y - s * 0.55, s * 0.35, "dash") + S.path(`M${f(x - s * 0.7)},${f(y + s)} Q${f(x)},${f(y - s * 0.3)} ${f(x + s * 0.7)},${f(y + s)}`, "dash"),
    animalia: (x, y, s) => S.circle(x, y + s * 0.3, s * 0.45) + [-0.6, 0, 0.6].map((o) => S.dot(x + o * s, y - s * 0.55 - (o ? 0 : s * 0.2), s * 0.17)).join(""),
    pellis: (x, y, s) => S.polygon([[x - s * 0.5, y - s], [x + s * 0.5, y - s], [x + s * 0.9, y - s * 0.3], [x + s * 0.5, y + s], [x - s * 0.5, y + s], [x - s * 0.9, y - s * 0.3]]),
    cibus: (x, y, s) => S.path(`M${f(x - s)},${f(y - s * 0.1)} A${f(s)},${f(s * 0.9)} 0 0 0 ${f(x + s)},${f(y - s * 0.1)}Z`) + S.line(x - s * 0.4, y + s * 0.8, x + s * 0.4, y + s * 0.8),
    venenum: (x, y, s) => S.path(`M${f(x)},${f(y - s)} Q${f(x + s * 0.9)},${f(y + s * 0.2)} ${f(x)},${f(y + s * 0.9)} Q${f(x - s * 0.9)},${f(y + s * 0.2)} ${f(x)},${f(y - s)}Z`) + S.line(x - s * 0.3, y + s * 0.05, x + s * 0.3, y + s * 0.55) + S.line(x + s * 0.3, y + s * 0.05, x - s * 0.3, y + s * 0.55),
    scriptura: (x, y, s) => S.polygon([[x - s * 0.7, y - s], [x + s * 0.7, y - s], [x + s * 0.7, y + s], [x - s * 0.7, y + s]]) + [-0.45, 0, 0.45].map((o) => S.line(x - s * 0.4, y + o * s, x + s * 0.4, y + o * s)).join(""),
    sacrum: (x, y, s) => S.circle(x, y - s * 0.55, s * 0.35) + S.polygon([[x - s * 0.8, y + s], [x + s * 0.8, y + s], [x + s * 0.5, y], [x - s * 0.5, y]]),
    nummus: (x, y, s) => S.circle(x, y, s * 0.85) + S.circle(x, y, s * 0.55) + S.dot(x, y, s * 0.15),
    instrumentum: (x, y, s) => S.line(x, y - s * 0.3, x, y + s) + S.polygon([[x - s * 0.8, y - s], [x + s * 0.8, y - s], [x + s * 0.8, y - s * 0.4], [x - s * 0.8, y - s * 0.4]]),
    arma: (x, y, s) => S.line(x - s * 0.8, y + s * 0.8, x + s * 0.8, y - s * 0.8) + S.line(x + s * 0.8, y + s * 0.8, x - s * 0.8, y - s * 0.8) + S.line(x - s * 0.6, y + s * 0.2, x - s * 0.2, y + s * 0.6) + S.line(x + s * 0.6, y + s * 0.2, x + s * 0.2, y + s * 0.6),
    materia: (x, y, s) => S.polygon([[x - s * 0.6, y - s * 0.6], [x + s * 0.6, y - s * 0.6], [x + s * 0.6, y + s * 0.6], [x - s * 0.6, y + s * 0.6]]) + S.dot(x, y, s * 0.15),
  };

  // --- Komponenten-Ecksteine ------------------------------------------------------
  const COMPONENT = {
    V: (x, y, s) => S.circle(x - s * 0.45, y, s * 0.25) + S.arc(x - s * 0.45, y, s * 0.6, 50, 130) + S.arc(x - s * 0.45, y, s * 0.95, 55, 125) + S.arc(x - s * 0.45, y, s * 1.3, 60, 120),
    S: (x, y, s) =>
      S.path(`M${f(x - s * 0.55)},${f(y + s)} L${f(x - s * 0.55)},${f(y)} Q${f(x - s * 0.55)},${f(y + s * 0.2)} ${f(x + s * 0.55)},${f(y + s * 0.2)} L${f(x + s * 0.55)},${f(y + s)}`) +
      [-0.55, -0.18, 0.18, 0.55].map((o, i) => S.line(x + o * s, y + (i === 0 ? 0 : s * 0.2), x + o * s, y - s * (i === 0 ? 0.35 : 0.9 - Math.abs(o) * 0.4))).join(""),
    F: (x, y, s) => S.polygon([[x, y - s], [x + s * 0.65, y], [x, y + s], [x - s * 0.65, y]]) + S.polygon([[x, y - s * 0.45], [x + s * 0.3, y], [x, y + s * 0.45], [x - s * 0.3, y]]),
    // Göttlicher Fokus: ein Auge im Kreis
    DF: (x, y, s) => S.circle(x, y, s) + S.path(`M${f(x - s * 0.75)},${f(y)} Q${f(x)},${f(y - s * 0.6)} ${f(x + s * 0.75)},${f(y)} Q${f(x)},${f(y + s * 0.6)} ${f(x - s * 0.75)},${f(y)}Z`) + S.dot(x, y, s * 0.2),
  };

  // --- Zeitaufwand-Marke ----------------------------------------------------------
  const CASTING = {
    standard: (x, y, s) => S.circle(x, y, s * 0.6) + S.dot(x, y, s * 0.2),
    swift: (x, y, s) => S.polyline([[x - s * 0.3, y - s], [x + s * 0.2, y - s * 0.1], [x - s * 0.2, y + s * 0.1], [x + s * 0.3, y + s]]),
    immediate: (x, y, s) => CASTING.swift(x - s * 0.35, y, s) + CASTING.swift(x + s * 0.35, y, s),
    fullround: (x, y, s) => S.arc(x, y, s * 0.7, 270, 90) + S.line(x - s * 0.7, y, x + s * 0.7, y),
    round: (x, y, s) => S.circle(x, y, s * 0.7) + S.line(x, y, x, y - s * 0.7),
    minutes: (x, y, s) => S.circle(x, y, s) + ESSENCE.tempus(x, y, s * 0.6),
    hours: (x, y, s) => S.circle(x, y, s) + S.circle(x, y, s * 1.2) + ESSENCE.tempus(x, y, s * 0.6),
  };

  // --- Prozedurale Runen (stumme Formeln, Zierschrift) ----------------------------
  // Jedes Zeichen aus 2–4 Strichen auf einem 3x3-Raster, deterministisch aus dem Zeichencode.
  function rune(x, y, s, code) {
    const r = U.rng(code * 7919 + 13);
    const grid = [];
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) grid.push([x + (j - 1) * s * 0.8, y + (i - 1) * s]);
    let out = S.line(grid[1][0], grid[1][1], grid[7][0], grid[7][1]); // Stamm
    const n = r.int(1, 3);
    for (let k = 0; k < n; k++) {
      const a = grid[r.int(0, 8)], b = grid[r.int(0, 8)];
      if (a !== b) out += S.line(a[0], a[1], b[0], b[1]);
    }
    if (r.chance(0.3)) out += S.dot(...grid[r.pick([0, 2, 6, 8])], s * 0.15);
    return out;
  }

  window.G = { S, P, polar, poly, tri, f, ESSENCE, SCHOOL, SIGN, ALCH, COMPONENT, CASTING, rune };
})();
