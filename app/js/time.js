// Tafel der Zeit: Tage, Monate und Zeichen des Himmels aus Profil und data/time.js, dazu die Zeichnungen
// (Jahresring mit zwei Ebenen, Sternkarte des nördlichen Himmels). Die Affinität zu Essenzen und Schulen ist
// reine Erzählung: nichts hier verändert eine Zahl der Regeln.
(function () {
  const e = U.esc;
  const T = window.THEORY;
  const { S, polar, f } = window.G;
  const D = () => window.TIME_DATA;
  // Buchsprache und Profil in der Buchsprache (Profiltexte wie Monatsnamen; fremdsprachig: neutrales Profil)
  const EN = () => !!(window.I18N && I18N.lang.book === "en");
  const LANG = () => (EN() ? "en" : "de");
  // in der Sprache des Profils das Profil selbst (live), sonst das neutrale Profil der Buchsprache
  const PB = () => (window.PROFILE && (PROFILE.book && PROFILE.localLang && PROFILE.localLang !== LANG() ? PROFILE.book() : PROFILE)) || {};
  const cal = () => PB().calendar || {};
  // Beschriftungen der Tafel je Buchsprache
  const TX = {
    de: { aff: "Affinität", opp: "Gegenpol", and: " und ", days: (n) => `${n} Tage`, custom: "Brauch:", patron: "Schutzgott:", pole: "Polarstern", date: (d, m) => `${d}. ${m}` },
    en: { aff: "Affinity", opp: "Opposite pole", and: " and ", days: (n) => `${n} days`, custom: "Custom:", patron: "Patron god:", pole: "Pole Star", date: (d, m) => `${d} ${m}` },
  };
  const tx = () => TX[LANG()];
  // Farbstoffe der Gottheiten (deity-colors.js nennt deutsche Namen): englische Namen für die Farbstreifen der Monate
  const PIGMENT_EN = {
    Ultramarin: "ultramarine", Azurit: "azurite", Indigo: "indigo", Smalte: "smalt", Waid: "woad", Kornblumenblau: "cornflower blue",
    Zinnober: "cinnabar", Krapprot: "madder red", Mennige: "red lead", Drachenblut: "dragon’s blood", Karmin: "carmine", Rötel: "red ochre", Kermes: "kermes",
    Beinschwarz: "bone black", Rebschwarz: "vine black", Lampenruß: "lamp black", Eisengallustinte: "iron gall ink",
    Grünspan: "verdigris", Malachit: "malachite", Saftgrün: "sap green", "Grüne Erde": "green earth",
    Bleiweiß: "lead white", Kreideweiß: "chalk white", Muschelweiß: "shell white", Kalkweiß: "lime white", Knochenweiß: "bone white",
    Blattgold: "leaf gold", Muschelgold: "shell gold", Goldocker: "gold ochre", Feingold: "fine gold",
    Auripigment: "orpiment", Safran: "saffron", Schüttgelb: "stil de grain", Umbra: "umber", Sepia: "sepia", Siena: "sienna",
    Schiefergrau: "slate grey", Aschgrau: "ash grey", Zinngrau: "pewter grey", Silber: "silver", Zinn: "tin", Realgar: "realgar",
  };
  const colorName = (c) => (EN() ? PIGMENT_EN[c.de] || String(c.name || c.de || "").replace(/gray/g, "grey") : c.de || c.name);
  const DEFAULT_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  // ---------------------------------------------------------------------------
  // Zeitachse: Tage im Jahr
  // ---------------------------------------------------------------------------
  const monthNames = () => cal().months || [];
  function monthDays() {
    const n = monthNames().length;
    const d = cal().days;
    return Array.from({ length: n }, (_, i) => +(d && d[i]) || (n === 12 ? DEFAULT_DAYS[i] : 30));
  }
  const total = () => monthDays().reduce((a, b) => a + b, 0);
  // Tag im Jahr (0-basiert) für Monat m (ab 0) und Tag d (ab 1)
  function doy(m, d) {
    const md = monthDays();
    let n = 0;
    for (let i = 0; i < m && i < md.length; i++) n += md[i];
    return n + (+d || 1) - 1;
  }
  // Winkel in Grad vom Jahresanfang oben, im Uhrzeigersinn
  const deg = (day) => (day / total()) * 360;
  // Winkelbereich einer Spanne [von, bis] inklusive des letzten Tages; über die Jahresnaht wird bis > 360
  function span(from, to) {
    const a0 = deg(doy(from.m, from.d));
    let a1 = deg(doy(to.m, to.d) + 1);
    if (a1 <= a0) a1 += 360;
    return [a0, a1];
  }

  // ---------------------------------------------------------------------------
  // Tage
  // ---------------------------------------------------------------------------
  // Felder eines Wochentags in der Buchsprache (data/time.js: week[i].en)
  const wk = (w) => (EN() && w.en ? { ...w, ...w.en } : w);
  function dayName(i) {
    const n = cal().dayNames;
    return (Array.isArray(n) && n.length === 7 && n[i]) || wk(D().week[i]).day;
  }
  // Entsprechungen in der Buchsprache (Planeten- und Farbnamen der Sprache)
  const corr = () => (window.TEXTGEN && (TEXTGEN.LX ? TEXTGEN.LX(LANG()).CORRESPOND : TEXTGEN.CORRESPOND)) || {};
  // Essenzen eines Wandelsterns: die, deren Entsprechung im Profil auf ihn zeigt
  function planetEssences(planetName) {
    const C = corr();
    return T.ESSENCES.filter((x) => C[x.id] && C[x.id].planet === planetName).map((x) => x.id);
  }
  // Essenzen aus den Entsprechungen des Profils; nennen sie keinen der sieben Wandelsterne (eigene Planeten
  // der Spielwelt), gilt die Zuordnung aus data/time.js
  function week() {
    const C = corr();
    const own = D().week.some((w) => planetEssences(wk(w).name).length);
    const customs = cal().dayTexts || [];
    return D().week.map((w0, i) => {
      const w = wk(w0);
      const ess = own ? planetEssences(w.name) : w.ess || [];
      return { day: dayName(i), planet: w.planet, name: w.name, metal: w.metal, ess, color: ess[0] && C[ess[0]] ? C[ess[0]].color : "", text: w.text || "", custom: customs[i] || "" };
    });
  }

  // ---------------------------------------------------------------------------
  // Affinität zu Essenzen und Schulen
  // ---------------------------------------------------------------------------
  // Schule, die eine Essenz am stärksten vorzieht (aus den Vorgaben der Schulen)
  function schoolOf(essId) {
    let best = null, w = 0;
    for (const [id, s] of Object.entries(T.SCHOOLS)) if ((s.essencePrior || {})[essId] > w) { w = s.essencePrior[essId]; best = id; }
    return best;
  }
  function affinity(ess) {
    const near = (ess || []).filter((x) => T.ESS[x]);
    if (!near.length) return null;
    const schools = [...new Set(near.map(schoolOf).filter(Boolean))];
    // Gegenpol der ersten Essenz, deren Gegenpol nicht selbst zur Affinität gehört
    const far = near.map((x) => T.ESS[x].opp).find((x) => !near.includes(x)) || T.ESS[near[0]].opp;
    return { near, far, schools };
  }
  const schoolName = (s) => (EN() && T.SCHOOLS[s].en ? T.SCHOOLS[s].en.de : T.SCHOOLS[s].de);
  const affinityText = (a) => (a ? `${a.near.map((x) => T.ESS[x].latin).join(tx().and)}${a.schools.length ? " · " + a.schools.map(schoolName).join(", ") : ""} · ${tx().opp} ${T.ESS[a.far].latin}` : "");

  // ---------------------------------------------------------------------------
  // Monate und Schutzgottheiten
  // ---------------------------------------------------------------------------
  const deityOf = (id) => (id && window.DEITIES ? window.DEITIES.find((d) => d.id === id) : null) || null;
  // die zwei häufigsten Essenzen aus den Domänen einer Gottheit (bei Gleichstand in Reihenfolge der Domänen)
  function deityEss(d) {
    if (!d) return [];
    const cnt = new Map();
    for (const dom of d.domains || []) {
      const x = D().domainEss[dom];
      if (x) cnt.set(x, (cnt.get(x) || 0) + 1);
    }
    return [...cnt.entries()].sort((a, b) => b[1] - a[1]).slice(0, 2).map(([x]) => x);
  }
  const seasonOf = (i) => (cal().seasons || [])[i] || (monthNames().length === 12 ? (EN() ? D().seasonsEn : D().seasons)[i] : "");
  function months() {
    const names = monthNames(), earth = cal().earth || [], patrons = cal().patrons || [], texts = cal().monthTexts || [], md = monthDays();
    const P = names.map((_, i) => deityOf(patrons[i]));
    let day = 0;
    return names.map((name, i) => {
      const a0 = deg(day);
      day += md[i];
      const patron = P[i];
      return {
        i, name, earth: earth[i] && earth[i] !== name ? earth[i] : "", days: md[i], a0, a1: deg(day), patron, colors: patron ? patron.colors || [] : [],
        aff: affinity(deityEss(patron)), season: seasonOf(i), text: texts[i] || (names.length === 12 ? (EN() ? D().monthLoreEn : D().monthLore)[i] : ""),
      };
    });
  }

  // ---------------------------------------------------------------------------
  // Festtage: aus dem Vademecum der eigenen Gottheit (lokale Datei, beide Hälften) und aus der Andacht im Profil;
  // am selben Tag gilt das Vademecum. Das Lehrheft nennt sie nicht (es stammt aus der Werkstatt des Meisters);
  // nur wenn das Profil eine Stimme nennt (calendar.feastHand), hat diese sie nachträglich als Punkte im Ring eingetragen.
  // ---------------------------------------------------------------------------
  function feasts() {
    const deity = window.DEITY;
    // lokale Vademecum-Feste sind Profiltexte: nur in der Sprache des Profils
    const sameLang = !window.PROFILE || !PROFILE.localLang || PROFILE.localLang === LANG();
    const vm = (sameLang && deity && window.VADEMECUM && (VADEMECUM.local || {})[deity.id]) || null;
    const own = ((vm && vm.feasts) || []).map((f) => ({ ...f, deity: deity.name }));
    const pf = (PB().devotion || {}).feasts || [];
    // derselbe Tag: Name aus dem Vademecum, fehlender Text aus der Andacht (dort steht das Gebet des Tages)
    const byKey = new Map();
    for (const f of [...own, ...pf]) {
      const k = f.d ? `${f.m}|${f.d}` : `${f.m}|${f.name}`;
      const had = byKey.get(k);
      if (!had) byKey.set(k, { ...f });
      else if (!had.text && f.text) had.text = f.text;
    }
    return [...byKey.values()].sort((a, b) => a.m - b.m || (a.d || 99) - (b.d || 99));
  }

  // ---------------------------------------------------------------------------
  // Zeichen des Himmels
  // ---------------------------------------------------------------------------
  const ownSigns = () => Array.isArray(cal().signs) && cal().signs.length;
  const signList = () => (ownSigns() ? cal().signs : D().zodiac.map((z) => (EN() && z.en ? { ...z, ...z.en } : z)));
  function signs() {
    return signList().map((s) => {
      const [a0, a1] = span(s.from, s.to);
      return { id: s.id, name: s.name, a0, a1, ess: s.ess || [], aff: affinity(s.ess), fig: s.fig || null, dated: s.from, until: s.to, text: s.text || "" };
    });
  }
  const festDot = (r, f_) => { const [x, y] = polar(0, 0, r, deg(doy(f_.m, f_.d))); return S.circle(x, y, 1.1, "rub"); };

  // ---------------------------------------------------------------------------
  // Zeichnungen
  // ---------------------------------------------------------------------------
  const sector = (r1, r2, a0, a1, cls = "") => {
    const p = (r, a) => polar(0, 0, r, a).map(f);
    const large = a1 - a0 > 180 ? 1 : 0;
    const [x1, y1] = p(r2, a0), [x2, y2] = p(r2, a1), [x3, y3] = p(r1, a1), [x4, y4] = p(r1, a0);
    return `<path d="M${x1},${y1} A${r2},${r2} 0 ${large} 1 ${x2},${y2} L${x3},${y3} A${r1},${r1} 0 ${large} 0 ${x4},${y4}Z" class="${cls}"/>`;
  };
  // Text entlang des Rings (tangential) oder entlang des Halbmessers, stets lesbar von unten
  function ringText(r, a, t, size, mode, cls = "lbl") {
    const [x, y] = polar(0, 0, r, a);
    const n = ((a % 360) + 360) % 360;
    const rot = mode === "radial" ? (n < 180 ? n - 90 : n + 90) : n > 90 && n < 270 ? n + 180 : n;
    return `<text transform="translate(${f(x)},${f(y)}) rotate(${f(rot)})" class="${cls}" font-size="${size}" text-anchor="middle" dominant-baseline="middle">${e(t)}</text>`;
  }
  const flipped = (a) => { const n = ((a % 360) + 360) % 360; return n > 90 && n < 270; };
  // Name in Zeilen von höchstens max Einheiten: Umbruch an Leerzeichen, sonst an weichen Trennstellen (\u00ad) mit
  // Trennstrich, sonst vor dem Mitlaut zwischen zwei Selbstlauten nahe der Wortmitte. Breite grob: Zeichen × 0,5 × Größe.
  const SHY = "\u00ad";
  const width = (t, size) => t.length * size * 0.5;
  function hyphenate(w) {
    if (w.includes(SHY)) return w.split(SHY);
    // Trennstelle vor dem letzten Mitlaut einer Gruppe zwischen Selbstlauten; „ch“, „ck“, „sch“ und Anlaute wie
    // „tr“, „bl“ bleiben zusammen
    const V = /[aeiouäöüy]/i, mid = w.length / 2, ONSET = /^(sch|ch|ck|[bcdfgkpt][rl]|ph|th)/i;
    let best = -1;
    for (let i = 1; i < w.length - 2; i++) {
      if (!V.test(w[i - 1]) || V.test(w[i])) continue;
      let j = i;
      while (j < w.length && !V.test(w[j])) j++;
      if (j >= w.length) break;
      const cl = w.slice(i, j);
      let k = j - 1;
      for (const len of [3, 2]) if (cl.length >= len && ONSET.test(cl.slice(-len))) { k = j - len; break; }
      if (k < 2 || w.length - k < 3) continue;
      if (best < 0 || Math.abs(k - mid) < Math.abs(best - mid)) best = k;
    }
    return best < 0 ? [w] : [w.slice(0, best), w.slice(best)];
  }
  function wrapName(name, size, max) {
    const plain = name.replace(/\u00ad/g, "");
    if (width(plain, size) <= max) return [plain];
    const lines = [];
    let cur = "";
    for (const word of name.split(" ")) {
      const parts = width(word.replace(/\u00ad/g, ""), size) > max || word.includes(SHY) ? hyphenate(word) : [word];
      parts.forEach((p, i) => {
        const piece = (i === 0 && cur ? " " : "") + p;
        if (cur && width(cur + piece + (i < parts.length - 1 ? "-" : ""), size) > max) {
          lines.push(i > 0 ? cur + "-" : cur);
          cur = p;
        } else cur += piece;
      });
    }
    if (cur) lines.push(cur);
    return lines;
  }
  // mehrzeiliger Ringtext (Zeilen im eigenen Koordinatensystem der Schrift gestapelt)
  function ringLines(r, a, lines, size, mode, cls = "lbl") {
    if (lines.length === 1) return ringText(r, a, lines[0], size, mode, cls);
    const [x, y] = polar(0, 0, r, a);
    const n = ((a % 360) + 360) % 360;
    const rot = mode === "radial" ? (n < 180 ? n - 90 : n + 90) : n > 90 && n < 270 ? n + 180 : n;
    const lh = 1.1, first = -((lines.length - 1) * lh) / 2;
    const spans = lines.map((t, i) => `<tspan x="0" dy="${i ? lh : first}em">${e(t)}</tspan>`).join("");
    return `<text transform="translate(${f(x)},${f(y)}) rotate(${f(rot)})" class="${cls}" font-size="${size}" text-anchor="middle" dominant-baseline="middle">${spans}</text>`;
  }

  // Jahresring: außen Monate mit Schutzgottheit, innen Zeichen; beide nach Tagen im Jahr geteilt
  function yearRing() {
    const M = months(), Z = signs();
    let out = "", stripes = false;
    const R = { mo: 96, mi: 79, so: 76, si: 52 };
    out += S.circle(0, 0, R.mo, "thin") + S.circle(0, 0, R.mi, "thin") + S.circle(0, 0, R.so, "thin") + S.circle(0, 0, R.si, "thin");
    for (const m of M) {
      // heilige Farben als zwei Streifen am Rand (bei einer Farbe ein breiter)
      const cs = m.colors || [];
      if (cs[0]) out += sector(R.mo, R.mo + (cs[1] ? 1.6 : 2.6), m.a0, m.a1).replace("<path", `<path fill="${e(cs[0].hex)}" stroke="none"`);
      if (cs[1]) out += sector(R.mo + 1.6, R.mo + 3.2, m.a0, m.a1).replace("<path", `<path fill="${e(cs[1].hex)}" stroke="none"`);
      if (cs.length) stripes = true;
      const [x1, y1] = polar(0, 0, R.mi, m.a0), [x2, y2] = polar(0, 0, R.mo, m.a0);
      out += S.line(x1, y1, x2, y2, "thin");
      const mid = (m.a0 + m.a1) / 2, fl = flipped(mid);
      const sub = m.patron ? m.patron.name : m.earth;
      out += ringText(sub ? (fl ? 84.5 : 90) : 87.5, mid, m.name, 5.2, "tangent");
      if (sub) out += ringText(fl ? 90 : 84.5, mid, sub, 3.5, "tangent", "lbl faint-l");
    }
    for (const z of Z) {
      const [x1, y1] = polar(0, 0, R.si, z.a0), [x2, y2] = polar(0, 0, R.so, z.a0);
      out += S.line(x1, y1, x2, y2, "thin");
      // Zeichen: radial in der Zelle (Breite = Ringdicke); lange Namen kleiner und zweizeilig
      const one = width(z.name.replace(/\u00ad/g, ""), 4.2) <= R.so - R.si - 3;
      const size = one ? 4.2 : 3.7;
      out += ringLines((R.so + R.si) / 2, (z.a0 + z.a1) / 2, one ? [z.name.replace(/\u00ad/g, "")] : wrapName(z.name, size, R.so - R.si - 3), size, "radial");
    }
    // dünner Außenkreis um die Farbstreifen: helle Farben heben sich so vom Papier ab
    if (stripes) out += S.circle(0, 0, R.mo + 3.4, "hair");
    // Festtage nur als nachträgliche Punkte einer Stimme (in ihrer Tinte)
    const hand = cal().feastHand, ink = hand && ((((window.PROFILE && PB().primer) || {}).voices || {})[hand] || {}).ink;
    if (hand) for (const fe of feasts()) if (fe.d) out += festDot(R.mi + 1.8, fe).replace('class="rub"', `class="hand-dot" fill="${e(ink || "#4a3220")}"`);
    // Mitte: Polarstern und Jahr
    out += `<g class="accent">${S.circle(0, 0, 2, "fill")}</g>` + (cal().year ? S.text(0, 10, cal().year.replace(/^(im|in)\s+/i, ""), "lbl", 4) : "");
    return out;
  }

  // Sternkarte des nördlichen Himmels: Polarstern in der Mitte, Himmelsäquator gestrichelt, Ekliptik als Schleife
  // (wahre Bahn der Sonne: Länge λ → Rektaszension α und Deklination δ; Neigung 23,44°). Die Zeichen liegen
  // dort, wo die Sonne in ihrer Zeit steht. Abstand vom Pol linear in 90° − δ, ein Viertel Pol–Äquator-Rand frei.
  function starMap() {
    const EPS = (23.44 * Math.PI) / 180, K = 0.84; // Maßstab: Grad vom Pol → Einheiten
    const R2D = 180 / Math.PI;
    const at = (lam) => {
      const l = (lam * Math.PI) / 180;
      const dec = Math.asin(Math.sin(EPS) * Math.sin(l));
      const ra = Math.atan2(Math.cos(EPS) * Math.sin(l), Math.cos(l));
      return polar(0, 0, (90 - dec * R2D) * K, -ra * R2D); // Himmelsrichtung gespiegelt: Osten links
    };
    // Frühlingspunkt auf dem Tag im Jahr (ungefähr 20. März bei 12 Monaten, sonst Jahresviertel)
    const spring = total() * (79 / 365);
    const lamOf = (a) => ((a / 360) * total() - spring) / total() * 360;
    let out = "";
    // Gitter: Äquator, Wendekreise der Ekliptik
    out += S.circle(0, 0, 90 * K, "thin dash") + S.circle(0, 0, (90 - 23.44) * K, "faint") + S.circle(0, 0, (90 + 23.44) * K, "faint");
    // Hintergrundsterne, fest aus einem einfachen Zahlenfolge-Generator
    let s = 7;
    const rnd = () => ((s = (s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
    for (let i = 0; i < 70; i++) {
      const r = Math.sqrt(rnd()) * 100, a = rnd() * 360, [x, y] = polar(0, 0, r, a);
      out += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(0.3 + rnd() * 0.5)}" class="fill dim"/>`;
    }
    // Ekliptik
    const pts = Array.from({ length: 73 }, (_, i) => at(i * 5));
    out += S.polyline(pts, "ecl");
    // Monatsmarken auf der Ekliptik
    for (const m of months()) {
      const [x, y] = at(lamOf(m.a0));
      out += S.circle(x, y, 1, "fill");
    }
    // Zeichen mit Figuren
    for (const z of signs()) {
      const mid = (z.a0 + z.a1) / 2, [cx, cy] = at(lamOf(mid));
      if (z.fig && z.fig.pts) {
        const k = 1.05, P = z.fig.pts.map(([x, y]) => [cx + x * k, cy + y * k]);
        out += (z.fig.links || []).map(([a, b]) => S.line(...P[a], ...P[b], "thin fig")).join("") + P.map(([x, y]) => `<circle cx="${f(x)}" cy="${f(y)}" r="0.9" class="fill"/>`).join("");
      } else out += S.circle(cx, cy, 1.4, "fill");
      // Beschriftung nach innen, wo die Bahn dem Rand nah ist, sonst nach außen
      const r = Math.hypot(cx, cy) || 1, off = r > 76 ? -15 : 15;
      out += S.text(cx + (cx / r) * off, cy + (cy / r) * off, z.name.replace(/\u00ad/g, ""), "lbl", 4.6);
    }
    // Pol
    out += `<g class="accent">${S.circle(0, 0, 1.6, "fill")}${S.line(-4, 0, 4, 0, "thin")}${S.line(0, -4, 0, 4, "thin")}</g>`;
    out += S.text(0, 9, cal().poleStar || tx().pole, "lbl", 4.2);
    return out;
  }

  // Tagestabelle als HTML
  // Einträge als einzelne Blöcke (der Satz darf zwischen ihnen umbrechen): Kopfzeile, darunter die Überlieferung
  const essGlyphs = (ess) => ess.map((x) => `<span class="ess-g">${glyphSVG("essence", x, { s: 6 })}</span>`).join("");
  const entry = (head, body) => `<div class="tt-entry"><div class="tt-head">${head}</div>${body.filter(Boolean).map((t) => `<p>${t}</p>`).join("")}</div>`;
  const affLine = (a) => (a ? `<span class="tt-aff">${tx().aff}: ${e(affinityText(a))}</span>` : "");

  function weekEntries() {
    return week().map((w) => entry(
      `${glyphSVG("alch", w.planet, { s: 7 })} <b>${e(w.day)}</b> <span class="rn">${e(w.name)} · ${e(w.metal)}${w.color ? " · " + e(w.color) : ""}</span> ${essGlyphs(w.ess)}`,
      [e(w.text), w.custom && `<i>${tx().custom}</i> ${e(w.custom)}`],
    ));
  }

  function monthEntries() {
    return months().map((m) => {
      const swatch = (m.colors || []).map((c) => `<span class="tt-sw" style="background:${e(c.hex)}"></span>${e(colorName(c))}`).join(" · ");
      return entry(
        `<b>${e(m.name)}</b> <span class="rn">${[m.earth, m.season, tx().days(m.days)].filter(Boolean).map(e).join(" · ")}</span>`,
        [m.patron && `<i>${tx().patron}</i> ${e(m.patron.name)}${swatch ? ` · ${swatch}` : ""}`, e(m.text), affLine(m.aff)],
      );
    });
  }
  function signEntries() {
    const mo = monthNames();
    return signs().map((z) => entry(
      `<b>${e(z.name)}</b> <span class="rn">${e(tx().date(z.dated.d, mo[z.dated.m] || ""))} – ${e(tx().date(z.until.d, mo[z.until.m] || ""))}</span> ${essGlyphs(z.ess)}`,
      [e(z.text), affLine(z.aff)],
    ));
  }


  window.TIME = { wrapName, doy, total, span, week, months, signs, feasts, affinity, affinityText, deityEss, weekEntries, monthEntries, signEntries, yearRing, starMap, dayName };
})();
