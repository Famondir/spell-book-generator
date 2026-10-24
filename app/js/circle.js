// Erzeugt den Zauberkreis als SVG aus dem analysierten Modell.
// Aufbau von außen nach innen:
//   Ecksteine (Komponenten) · Zeitmarke · Schriftband (Formel) · Schwellentore (Rettungswurf)
//   · Siegelband (ZR) · Ordnungsknoten (Grad) · Weitenringe (Reichweite) · Zeichenring
//   · Essenzring · Dauerring · Kernsiegel (Schule) mit Hauptessenz · Gestaltvektoren (darunter)
(function () {
  const { S, polar, poly, f, ESSENCE, SCHOOL, SIGN, ALCH, COMPONENT, CASTING, rune } = window.G;

  // bandText = Grundlinie der Schrift; darunter bleibt Luft bis bandIn
  const R = {
    outer: 246, bandText: 218, gate: 226, bandIn: 211, sr: 203, order: 184, orderR: 13,
    range0: 164, rangeStep: 7, signs: 126, ess: 100, dur: 79, core: 61,
  };
  const ALL = ["shape", "outer", "band", "gates", "sr", "order", "range", "signs", "essence", "duration", "core", "components", "casting", "family"];
  let uid = 0;

  const RADIAL = new Set(["burst", "spread", "emanation", "sphere", "cube", "self", "touch", "summon", "other", "object", "symbol"]);

  function shapeLayer(m) {
    const k = m.shape.kind;
    const out = [];
    const reach = 199;
    const L = Math.max(m.level, 1);
    switch (k) {
      case "cone": {
        const w = 26;
        out.push(S.line(0, 0, ...polar(0, 0, reach, -w)), S.line(0, 0, ...polar(0, 0, reach, w)));
        for (const r of [120, 160, 196]) out.push(S.arc(0, 0, r, -w, w));
        out.push(S.arrowHead(...polar(0, 0, reach, 0), 0, 9));
        break;
      }
      case "line":
        out.push(S.line(-7, reach, -7, -reach), S.line(7, reach, 7, -reach), S.arrowHead(0, -reach - 4, 0, 11));
        break;
      case "ray":
        out.push(S.line(0, 0, 0, -reach), S.arrowHead(0, -reach, 0, 10));
        for (let i = 1; i <= Math.min(m.dice && m.dice.count > 1 ? 3 : 1, 3); i++) if (i > 1) out.push(S.line(0, 0, ...polar(0, 0, reach * 0.9, (i - 1) * 14 * (i % 2 ? 1 : -1))));
        break;
      case "burst":
      case "spread": {
        const n = 8 + (L >= 5 ? 4 : 0);
        for (let i = 0; i < n; i++) {
          const a = (360 / n) * i;
          const p1 = polar(0, 0, R.dur + 4, a), p2 = polar(0, 0, reach, a);
          if (k === "burst") out.push(S.line(...p1, ...p2), S.arrowHead(...p2, a, 8));
          else {
            let d = "";
            for (let t = 0; t <= 20; t++) {
              const r = R.dur + 4 + ((reach - R.dur - 4) * t) / 20;
              const [x, y] = polar(0, 0, r, a + Math.sin(t * 0.9) * 3.5);
              d += (t ? "L" : "M") + f(x) + "," + f(y);
            }
            out.push(S.path(d));
          }
        }
        break;
      }
      case "emanation":
        for (let i = 0; i < 6; i++) for (const r of [112, 146, 180]) out.push(S.arc(0, 0, r, i * 60 + 10, i * 60 + 50));
        break;
      case "cylinder":
        out.push(S.line(0, -reach, 0, reach), `<ellipse cx="0" cy="${-reach + 22}" rx="90" ry="20"/>`, `<ellipse cx="0" cy="${reach - 22}" rx="90" ry="20" class="dash"/>`);
        out.push(S.line(-90, -reach + 22, -90, reach - 22, "dash"), S.line(90, -reach + 22, 90, reach - 22, "dash"));
        break;
      case "wall": {
        const y = -150;
        out.push(S.line(-150, y, 150, y), S.line(-150, y + 10, 150, y + 10));
        for (let x = -140; x <= 140; x += 28) out.push(S.polyline([[x, y], [x, y - 9], [x + 14, y - 9], [x + 14, y]]));
        break;
      }
      case "sphere":
        out.push(S.circle(0, 0, 150), `<ellipse cx="0" cy="0" rx="150" ry="52"/>`, `<ellipse cx="0" cy="0" rx="52" ry="150"/>`);
        break;
      case "cube": {
        const a = 105, b = 52;
        out.push(S.polygon([[-a, -a + b], [0, -a], [a, -a + b], [0, -a + 2 * b]]), S.polyline([[-a, -a + b], [-a, a - b], [0, a], [a, a - b], [a, -a + b]]), S.line(0, -a + 2 * b, 0, a));
        break;
      }
      case "touch":
        for (const a of [45, 135, 225, 315]) {
          const p1 = polar(0, 0, reach, a), p2 = polar(0, 0, R.dur + 6, a);
          out.push(S.line(...p1, ...p2), S.arrowHead(...p2, a + 180, 9));
        }
        break;
      case "self":
        out.push(S.arc(0, 0, 112, 20, 340), S.arrowHead(...polar(0, 0, 112, 20), 110, 10));
        break;
      case "targets": {
        const n = m.shape.count;
        for (let i = 0; i < n; i++) {
          const a = n === 1 ? 0 : -60 + (120 / (n - 1)) * i;
          const p = polar(0, 0, 196, a);
          out.push(S.line(0, 0, ...polar(0, 0, 186, a)), S.circle(...p, 7), S.dot(...p, 2.5));
        }
        break;
      }
      case "object": {
        const [x, y] = polar(0, 0, 196, 0);
        out.push(S.line(0, 0, x, y + 9), S.polygon([[x - 9, y - 9], [x + 9, y - 9], [x + 9, y + 9], [x - 9, y + 9]]));
        break;
      }
      case "summon":
        out.push(S.path(`M-26,-170 L-26,-200 A26,26 0 0 1 26,-200 L26,-170`), S.line(0, -192, 0, -R.dur - 8), S.arrowHead(0, -R.dur - 6, 180, 10));
        break;
      case "sensor":
        out.push(S.line(0, 0, 0, -176, "dash"), S.path(`M-20,-192 Q0,-208 20,-192 Q0,-176 -20,-192Z`), S.dot(0, -192, 4));
        break;
      case "symbol":
        out.push(rune(0, -190, 12, m.seed % 997), S.circle(0, -190, 20));
        break;
      default:
        out.push(S.arc(0, 0, 150, 200, 520 % 360 || 160));
    }
    return `<g class="layer-shape">${out.join("")}</g>`;
  }

  function gateAngles(m) {
    if (m.save.type === "none") return [];
    return m.save.effect === "partial" || m.save.effect === "half" ? [150, 210] : [180];
  }

  // Bogenpfad im Uhrzeigersinn (für Text)
  function arcPath(id, r, a1, a2) {
    const [x1, y1] = polar(0, 0, r, a1), [x2, y2] = polar(0, 0, r, a2);
    const large = a2 - a1 > 180 ? 1 : 0;
    return `<path id="${id}" d="M${f(x1)},${f(y1)} A${r},${r} 0 ${large} 1 ${f(x2)},${f(y2)}" class="guide"/>`;
  }

  function bandLayer(m, text, id) {
    const out = [S.circle(0, 0, R.outer), S.circle(0, 0, R.outer - 5), S.circle(0, 0, R.bandIn)];
    // Schwellentore unterbrechen das Band: Text und Runen lassen dort eine Lücke
    const gates = gateAngles(m);
    const GAP = 8;
    const segs = [];
    if (!gates.length) segs.push([0, 360]);
    else
      gates.forEach((g, i) => {
        const next = gates[(i + 1) % gates.length] + (i + 1 === gates.length ? 360 : 0);
        segs.push([g + GAP, next - GAP]);
      });
    if (m.components.V && text) {
      const base = text.toUpperCase().trim() + " · ";
      segs.forEach(([a1, a2], i) => {
        const pid = `${id}-${i}`;
        const len = ((a2 - a1) / 360) * 2 * Math.PI * R.bandText;
        let t = base;
        while (t.length * 9.2 < len) t += base;
        // auf ganze Zeichenzahl kürzen, die in den Bogen passt
        // auf ganze Wörter kürzen, damit an Lücken kein Wortrest stehen bleibt
        const max = Math.max(4, Math.floor(len / 9.2));
        if (t.length > max) {
          t = t.slice(0, max);
          const cut = t.lastIndexOf(" ");
          if (cut > max * 0.6) t = t.slice(0, cut);
        }
        t = t.replace(/[\s·]+$/, "");
        if (segs.length === 1 && a2 - a1 >= 360) out.push(`<path id="${pid}" d="M0,${-R.bandText} A${R.bandText},${R.bandText} 0 1 1 -0.01,${-R.bandText}Z" class="guide"/>`);
        else out.push(arcPath(pid, R.bandText, a1, a2));
        // fast voller Bogen: auf Länge strecken; kurzer Rest: mittig in normaler Laufweite
        if (t.length * 9.2 >= len * 0.85) out.push(`<text class="band-text" font-size="13"><textPath href="#${pid}" textLength="${f(len - 6)}" lengthAdjust="spacing">${U.esc(t)}</textPath></text>`);
        else out.push(`<text class="band-text" font-size="13" text-anchor="middle"><textPath href="#${pid}" startOffset="50%">${U.esc(t)}</textPath></text>`);
      });
    } else {
      // stumme Formel: Runenband
      const n = 64;
      for (let i = 0; i < n; i++) {
        const a = (360 / n) * i;
        if (gates.some((g) => Math.abs(((a - g + 540) % 360) - 180) < GAP)) continue;
        const [x, y] = polar(0, 0, R.gate, a);
        out.push(S.group(rune(0, 0, 4.2, (m.seed + i * 31) % 4093), x, y, a));
      }
    }
    return `<g class="layer-band">${out.join("")}</g>`;
  }

  function gatesLayer(m) {
    const out = [];
    for (const a of gateAngles(m)) {
      const [x, y] = polar(0, 0, R.gate, a);
      let g = S.circle(0, 0, 12, "knock " + (m.save.harmless ? "dash" : ""));
      if (m.save.type === "will") g += S.path(`M-8,0 Q0,-7 8,0 Q0,7 -8,0Z`) + S.dot(0, 0, 2.3);
      if (m.save.type === "fort") g += S.polygon([[-6, -6], [6, -6], [6, 6], [-6, 6]]) + S.line(-6, -6, 6, 6);
      if (m.save.type === "ref") g += S.line(0, 7, 0, -5) + S.arrowHead(0, -8, 0, 5.5);
      out.push(S.group(g, x, y, a + 180, "accent"));
    }
    return `<g class="layer-gates">${out.join("")}</g>`;
  }

  function srLayer(m) {
    if (!m.sr.yes) return "";
    const out = [S.circle(0, 0, R.sr)];
    const n = 120;
    for (let i = 0; i < n; i++) {
      const a = (360 / n) * i;
      out.push(S.line(...polar(0, 0, R.sr, a), ...polar(0, 0, R.bandIn, a + 2)));
    }
    return `<g class="layer-sr ${m.sr.harmless ? "faint" : ""}">${out.join("")}</g>`;
  }

  function orderLayer(m) {
    const L = m.level;
    const out = [];
    if (L === 0) {
      out.push(S.dot(...polar(0, 0, R.order, 0), 3));
      return `<g class="layer-order">${out.join("")}</g>`;
    }
    out.push(S.circle(0, 0, R.order, "faint"));
    const pts = poly(0, 0, R.order, L, 0);
    // Sehnen zwischen den Ordnungsknoten: ab Grad 3 entsteht ein Sternmuster
    if (L >= 3) {
      const k = Math.max(1, Math.floor((L - 1) / 2));
      for (let i = 0; i < L; i++) {
        const a = pts[i], b = pts[(i + k) % L];
        out.push(S.line(a[0], a[1], b[0], b[1], "thin"));
      }
    } else if (L === 2) out.push(S.line(...pts[0], ...pts[1], "thin"));
    const n = m.schoolInfo.number || 8;
    pts.forEach(([x, y], i) => {
      let g = S.circle(0, 0, R.orderR, "knock") + S.circle(0, 0, R.orderR - 3);
      g += S.polygon(poly(0, 0, R.orderR - 5, Math.max(3, Math.min(n, 8)), 0));
      g += S.text(0, 0.5, U.ROMAN[i + 1], "order-num", 6.5);
      out.push(S.group(g, x, y, (360 / L) * i));
    });
    return `<g class="layer-order">${out.join("")}</g>`;
  }

  function rangeLayer(m) {
    const out = [];
    const tier = m.range.tier;
    for (let i = 0; i < tier; i++) {
      const r = R.range0 - i * R.rangeStep;
      out.push(S.circle(0, 0, r, i === tier - 1 ? "" : "thin"));
    }
    if (tier >= 5) {
      // unbegrenzt: Unendlichkeitsschleifen auf dem äußersten Weitenring
      for (const a of [90, 270]) {
        const [x, y] = polar(0, 0, R.range0 - 14, a);
        out.push(S.path(`M${f(x)},${f(y)} c6,-7 12,-7 12,0 c0,7 -6,7 -12,0 c-6,-7 -12,-7 -12,0 c0,7 6,7 12,0`, "knock"));
      }
    }
    if (tier > 0) {
      // Distanzrunen auf dem innersten Weitenring
      const r = R.range0 - (tier - 1) * R.rangeStep - 9;
      const n = 6 * tier;
      for (let i = 0; i < n; i++) out.push(S.group(rune(0, 0, 2.6, (m.familySeed + i * 17) % 3001), ...polar(0, 0, r, (360 / n) * i + 7), (360 / n) * i + 7));
    }
    return `<g class="layer-range">${out.join("")}</g>`;
  }

  function signSlots(m) {
    const signs = m.signs;
    if (!signs.length) return [];
    const slots = [];
    if (!RADIAL.has(m.shape.kind)) {
      // Übergewicht nach Norden: die Wirkrichtung
      const n = Math.min(signs.length * 2 + 1, 9);
      for (let i = 0; i < n; i++) slots.push({ a: -64 + (128 / (n - 1)) * i, s: signs[i % signs.length] });
      slots.push({ a: 180, s: signs[0], small: true }); // Gegengewicht im Süden, kleiner
    } else {
      const per = m.level >= 6 ? 3 : 2;
      const n = signs.length * per;
      for (let i = 0; i < n; i++) slots.push({ a: (360 / n) * i + 180 / n, s: signs[i % signs.length] });
    }
    return slots;
  }

  function signsLayer(m) {
    const out = [S.circle(0, 0, R.signs - 14, "dash thin"), S.circle(0, 0, R.signs + 14, "dash thin")];
    for (const sl of signSlots(m)) {
      const [x, y] = polar(0, 0, R.signs, sl.a);
      const rot = sl.a + (sl.s.dir === "in" ? 180 : 0);
      const size = sl.small ? 6.5 : 9;
      out.push(S.group(S.circle(0, 0, size + 3, "knock") + SIGN[sl.s.id](size), x, y, rot));
    }
    return `<g class="layer-signs">${out.join("")}</g>`;
  }

  function essenceLayer(m) {
    const out = [S.circle(0, 0, R.ess - 9, "thin"), S.circle(0, 0, R.ess + 9, "thin")];
    let a = 0;
    const gap = 3;
    for (const e of m.essences) {
      const span = (e.pct / 100) * 360;
      out.push(S.arc(0, 0, R.ess, a + gap / 2, a + span - gap / 2, "ess-seg" + (e.id === m.primary ? " accent" : "")));
      const mid = a + span / 2;
      const [x, y] = polar(0, 0, R.ess, mid);
      const s = 5 + Math.min(e.pct, 60) / 12;
      out.push(S.circle(x, y, s + 3.5, "knock") + `<g class="${e.id === m.primary ? "accent" : ""}">${ESSENCE[e.id](x, y, s)}</g>`);
      a += span;
    }
    return `<g class="layer-essence">${out.join("")}</g>`;
  }

  function durationLayer(m) {
    const d = m.duration;
    const r = R.dur;
    const out = [];
    switch (d.kind) {
      case "instant":
        // offene Matrix: die Energie wird freigegeben, nicht gehalten
        for (let i = 0; i < 8; i++) out.push(S.arc(0, 0, r, i * 45 + 8, i * 45 + 37));
        break;
      case "rounds": {
        out.push(S.circle(0, 0, r));
        const n = d.perLevel ? 12 : 6;
        for (let i = 0; i < n; i++) out.push(S.line(...polar(0, 0, r, (360 / n) * i), ...polar(0, 0, r + 6, (360 / n) * i)));
        break;
      }
      case "minutes":
        out.push(S.circle(0, 0, r, "dash"));
        break;
      case "hours":
        out.push(S.circle(0, 0, r), S.circle(0, 0, r - 4));
        break;
      case "days":
        out.push(S.circle(0, 0, r), S.circle(0, 0, r - 4), S.circle(0, 0, r - 8));
        break;
      case "permanent":
        out.push(S.circle(0, 0, r, "thick"), S.polygon([polar(0, 0, r, -6), polar(0, 0, r + 7, 4), polar(0, 0, r - 7, 4)], "fill"));
        break;
      case "concentration":
        out.push(S.circle(0, 0, r), S.path(`M0,${r} C14,${r + 40} -14,${r + 80} 0,${R.bandIn}`, "dash"));
        break;
      default:
        out.push(S.arc(0, 0, r, 20, 340));
    }
    if (d.concentration && d.kind !== "concentration") out.push(S.path(`M0,${r} C14,${r + 40} -14,${r + 80} 0,${R.bandIn}`, "dash"));
    if (d.dismissible) {
      const [x, y] = polar(0, 0, r, 180);
      out.push(S.circle(x, y, 4.5, "knock"), S.line(x, y + 1, x, y + 5));
    }
    if (d.discharge) out.push(S.arrowHead(...polar(0, 0, r + 1, 90), 90, 7));
    return `<g class="layer-duration">${out.join("")}</g>`;
  }

  function coreLayer(m) {
    const sig = SCHOOL[m.school] || SCHOOL.universal;
    let out = `<circle cx="0" cy="0" r="${R.core + 4}" class="knock"/>` + sig(R.core);
    // Hauptessenz im Zentrum
    out += `<circle cx="0" cy="0" r="17" class="knock"/><g class="accent">${ESSENCE[m.primary](0, 0, 11)}</g>`;
    // Unterschulen als kleine Marken unten im Siegel
    m.subschools.slice(0, 2).forEach((sub, i) => {
      const [x, y] = polar(0, 0, R.core * 0.72, 180 + (i ? 28 : -28) * (m.subschools.length > 1 ? 1 : 0));
      out += S.circle(x, y, 7, "knock") + rune(x, y, 3.6, U.hash(sub) % 5000);
    });
    return `<g class="layer-core">${out}</g>`;
  }

  function componentsLayer(m) {
    const c = m.components;
    const out = [];
    const C = 262;
    const corner = (x, y, inner, label, gilded) => {
      out.push(`<g class="corner ${gilded ? "gilded" : ""}">` + S.circle(x, y, 22, "knock") + S.circle(x, y, 22) + inner + S.text(x, y + 32, label, "corner-label", 10) + "</g>");
      out.push(S.line(...polar(0, 0, R.outer, Math.atan2(x, -y) * 180 / Math.PI), x - Math.sign(x) * 16, y - Math.sign(y) * 16, "thin"));
    };
    if (c.V) corner(-C + 22, -C + 22, COMPONENT.V(-C + 26, -C + 22, 11), "V", false);
    if (c.S) corner(C - 22, -C + 22, COMPONENT.S(C - 22, -C + 22, 12), "S", false);
    if (c.M) {
      const tags = c.materialTags.slice(0, 3);
      const n = tags.length;
      let inner = "";
      tags.forEach((t, i) => {
        const s = n === 1 ? 10 : 6.5;
        const dx = n === 1 ? 0 : (i - (n - 1) / 2) * 13;
        inner += (ALCH[t.tag] || ALCH.materia)(-C + 22 + dx, C - 22, s);
      });
      corner(-C + 22, C - 22, inner, c.costly ? "M · " + c.costly + " GM" : "M", c.costly > 0);
    }
    if (c.F || c.DF) {
      const inner = (c.F ? COMPONENT.F(C - 22 - (c.DF ? 7 : 0), C - 22, c.DF ? 8 : 12) : "") + (c.DF ? COMPONENT.DF(C - 22 + (c.F ? 8 : 0), C - 22, c.F ? 7 : 11) : "");
      corner(C - 22, C - 22, inner, [c.F && "F", c.DF && "GF"].filter(Boolean).join("/"), false);
    }
    return `<g class="layer-components">${out.join("")}</g>`;
  }

  function castingLayer(m) {
    const fn = CASTING[m.casting.kind] || CASTING.standard;
    return `<g class="layer-casting">${S.circle(0, -R.outer - 13, 11, "knock")}${fn(0, -R.outer - 13, 8)}</g>`;
  }

  function familyLayer(m) {
    const mod = m.family.mod;
    if (!mod) return "";
    const out = [];
    if (/greater|major|improved/.test(mod)) out.push(S.circle(0, 0, R.outer + 6, "thin"));
    if (/lesser|minor/.test(mod)) for (let i = 0; i < 36; i++) out.push(S.arc(0, 0, R.outer + 6, i * 10, i * 10 + 4));
    if (/mass/.test(mod)) for (const a of [160, 180, 200]) out.push(S.circle(...polar(0, 0, R.outer + 10, a), 4));
    if (/communal/.test(mod)) for (const a of [170, 190]) out.push(S.circle(...polar(0, 0, R.outer + 8, a), 6));
    if (/^(i|ii|iii|iv|v|vi|vii|viii|ix|\d)$/.test(mod)) {
      const n = /\d/.test(mod) ? +mod : U.ROMAN.indexOf(mod.toUpperCase());
      for (let i = 0; i < n; i++) out.push(S.dot(...polar(0, 0, R.outer + 8, 180 + (i - (n - 1) / 2) * 6), 2.5));
    }
    return `<g class="layer-family">${out.join("")}</g>`;
  }

  // opts: { text, layers: [...], zoom: Radius des sichtbaren Ausschnitts, cls }
  function circle(m, opts = {}) {
    const layers = new Set(opts.layers || ALL);
    const id = "band" + ++uid;
    const parts = [];
    const has = (l) => layers.has(l);
    if (has("shape")) parts.push(shapeLayer(m));
    if (has("outer") || has("band")) parts.push(bandLayer(m, opts.text, id));
    if (has("sr")) parts.push(srLayer(m));
    if (has("order")) parts.push(orderLayer(m));
    if (has("range")) parts.push(rangeLayer(m));
    if (has("signs")) parts.push(signsLayer(m));
    if (has("essence")) parts.push(essenceLayer(m));
    if (has("duration")) parts.push(durationLayer(m));
    if (has("core")) parts.push(coreLayer(m));
    if (has("gates")) parts.push(gatesLayer(m));
    if (has("family")) parts.push(familyLayer(m));
    if (has("casting")) parts.push(castingLayer(m));
    if (has("components")) parts.push(componentsLayer(m));
    if (opts.annotate) parts.push(annotationLayer(m));
    const z = opts.zoom || 290;
    return `<svg class="circle ${opts.cls || ""} ${opts.annotate ? "annotated" : ""}" viewBox="${-z} ${-z} ${2 * z} ${2 * z}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Zauberkreis ${U.esc(m.name)}">${parts.join("")}</svg>`;
  }

  // ---------------------------------------------------------------------------
  // Beschriftung: nummerierte Marken auf jeder Schicht (für das erweiterte Beispiel und den Detailmodus)
  // ---------------------------------------------------------------------------
  function annotations(m) {
    const T = window.THEORY;
    const sc = m.schoolInfo;
    const list = [];
    const add = (pos, k, t) => list.push({ n: list.length + 1, x: pos[0], y: pos[1], k, t });
    const C = 262 - 22;
    if (m.components.V) add([-C + 16, -C - 16], "Eckstein Stimme (V)", "Die Formel wird gesprochen; ihr Wortlaut steht im Schriftband.");
    if (m.components.S) add([C - 16, -C - 16], "Eckstein Geste (S)", "Die Hände führen die Formel; die Gesten stehen im Text.");
    if (m.components.M) add([-C + 16, C - 28], "Eckstein Stoff (M)", `Alchemistisches Zeichen des Stoffes: ${(m.components.nouns || []).join(", ") || "unbestimmt"}.`);
    if (m.components.F || m.components.DF) add([C - 16, C - 28], "Eckstein Fokus", "Raute = Fokus, Auge = göttlicher Fokus. Wird nicht verbraucht.");
    add([18, -R.outer - 13], "Zeitmarke", `${m.casting.de}.`);
    add(polar(0, 0, R.outer + 14, 300), "Schriftband", m.components.V ? "Die gesprochene Formel, im Uhrzeigersinn ab Norden zu lesen." : "Stumme Runen – die Formel hat keine Stimme.");
    const gates = gateAngles(m);
    if (gates.length) add(polar(0, 0, R.outer + 16, gates[0]), "Schwellentor", `${T.SAVES[m.save.type].gate} für ${T.SAVES[m.save.type].de}${gates.length > 1 ? "; zwei Tore: halbe oder teilweise Wirkung" : ""}${m.save.harmless ? "; gestrichelt: harmlos" : ""}.`);
    // Siegelband-Marke zwischen zwei Ordnungsknoten, damit sie nicht mit einem Knoten verwechselt wird
    const nodeGap = m.level > 0 ? 360 / m.level : 360;
    const srAngle = m.level > 0 ? Math.round((225 - nodeGap / 2) / nodeGap) * nodeGap + nodeGap / 2 : 225;
    if (m.sr.yes) add(polar(0, 0, (R.sr + R.bandIn) / 2, srAngle), "Siegelband", "Schraffur: Die Formel muss Zauberresistenz überwinden.");
    if (m.level > 0) add(polar(0, 0, R.order, Math.min(16, nodeGap / 3)), "Ordnungsknoten", `${m.level} Knoten für die ${m.level}. Ordnung${m.level >= 3 ? ", als Stern verbunden" : ""}.`);
    if (m.range.tier > 0) add(polar(0, 0, R.range0 - ((m.range.tier - 1) * R.rangeStep) / 2, 42), "Weitenringe", `${m.range.tier} Ring${m.range.tier > 1 ? "e" : ""}: ${m.range.de}.`);
    const slots = signSlots(m);
    if (slots.length) add(polar(0, 0, R.signs + 20, slots[0].a - 8), "Zeichenring", m.signs.map((x) => `${x.de} (${x.dir === "in" ? "nach innen" : "nach außen"})`).join(", ") + ".");
    add(polar(0, 0, R.ess + 16, 200), "Essenzring", m.essences.map((e) => `${T.ESS[e.id].latin} ${e.pct} %`).join(", ") + ".");
    add(polar(0, 0, R.dur, 135), "Dauerring", `${m.duration.ring}.`);
    add(polar(0, 0, R.core * 0.85, 250), "Kernsiegel", `${sc.figure} – ${sc.de}.`);
    add([22, 20], "Hauptessenz", `${T.ESS[m.primary].latin} (${T.ESS[m.primary].de}).`);
    const shapePos = { self: [112, 100], touch: [170, 45], cone: [150, 26], line: [150, 4], ray: [140, 3], targets: [196, 0], object: [196, 0], summon: [185, 0], sensor: [192, 0], symbol: [190, 0], wall: [150, -40], emanation: [146, 110], sphere: [150, 90], cylinder: [170, 10], cube: [110, 60] }[m.shape.kind] || [142, 86];
    add(polar(0, 0, shapePos[0], shapePos[1]), "Gestaltvektoren", `${m.shape.de}: ${m.shape.figure}.`);
    // Marken, die sich überlappen, auf ihrem Ring weiterdrehen (Ecksteine und Zeitmarke bleiben stehen)
    for (let i = 0; i < list.length; i++) {
      const a = list[i];
      const r = Math.hypot(a.x, a.y);
      if (r > R.outer + 20 || r < 1) continue;
      for (let tries = 0; tries < 24 && list.some((b, j) => j < i && Math.hypot(a.x - b.x, a.y - b.y) < 27); tries++) {
        const ang = (Math.atan2(a.x, -a.y) * 180) / Math.PI + 9;
        [a.x, a.y] = polar(0, 0, r, ang);
      }
    }
    return list;
  }
  function annotationLayer(m) {
    return `<g class="layer-annot">${annotations(m)
      .map((a) => `<g class="annot"><circle cx="${f(a.x)}" cy="${f(a.y)}" r="12"/><text x="${f(a.x)}" y="${f(a.y + 0.5)}" font-size="13" text-anchor="middle" dominant-baseline="middle">${a.n}</text></g>`)
      .join("")}</g>`;
  }

  // ---------------------------------------------------------------------------
  // Schnellglyphe: in wenigen Strichen von Hand zu zeichnen (Spieltisch, Eile)
  //   Kreis (offen = augenblicklich) · Schulfigur · Hauptessenz · ein Gestaltstrich · Gradpunkte
  // ---------------------------------------------------------------------------
  const QUICK_SCHOOL = {
    abjuration: () => S.polygon(poly(0, 0, 30, 4, 45)),
    conjuration: () => S.star(0, 0, 32, 5, 2),
    divination: () => S.path("M-30,0 Q0,-24 30,0 Q0,24 -30,0Z"),
    enchantment: () => { let d = ""; for (let i = 0; i <= 40; i++) { const t = i / 40, a = t * Math.PI * 4.6, r = 31 * t; d += (i ? "L" : "M") + f(r * Math.cos(a)) + "," + f(r * Math.sin(a)); } return S.path(d); },
    evocation: () => [0, 60, 120].map((a) => S.line(...polar(0, 0, 31, a), ...polar(0, 0, 31, a + 180))).join(""),
    illusion: () => S.circle(-11, 0, 20) + S.circle(11, 0, 20),
    necromancy: () => S.polygon(G.tri(0, -2, 28, false)) + S.line(-26, 26, 26, 26),
    transmutation: () => S.polygon(G.tri(0, 4, 31, true)),
    universal: () => S.line(-30, 0, 30, 0) + S.line(0, -30, 0, 30),
  };
  function quickShape(m) {
    switch (m.shape.kind) {
      case "cone": return S.line(0, -50, -16, -66) + S.line(0, -50, 16, -66);
      case "line": return S.line(-4, -50, -4, -68) + S.line(4, -50, 4, -68);
      case "ray": case "targets": return S.line(0, -50, 0, -66) + S.arrowHead(0, -68, 0, 6);
      case "burst": case "spread": case "sphere": case "cube": case "cylinder": return [0, 90, 180, 270].map((a) => S.line(...polar(0, 0, 50, a + 45), ...polar(0, 0, 62, a + 45))).join("");
      case "emanation": return S.arc(0, 0, 58, 300, 60);
      case "touch": return [45, 135, 225, 315].map((a) => S.line(...polar(0, 0, 64, a), ...polar(0, 0, 54, a))).join("");
      case "self": return S.arc(0, -58, 7, 0, 300);
      case "wall": return S.line(-16, -58, 16, -58);
      case "summon": return S.path("M-8,-52 L-8,-62 A8,8 0 0 1 8,-62 L8,-52");
      default: return "";
    }
  }
  function quickGlyph(m, opts = {}) {
    const ring = m.duration.kind === "instant" ? S.arc(0, 0, 50, 25, 335) : S.circle(0, 0, 50) + (m.duration.kind === "permanent" ? S.circle(0, 0, 45) : "");
    const lv = m.level;
    const dots = Array.from({ length: lv }, (_, i) => S.dot(...polar(0, 0, 50, 180 + (i - (lv - 1) / 2) * 14), 3.2)).join("");
    const core = (QUICK_SCHOOL[m.school] || QUICK_SCHOOL.universal)();
    const ess = `<g class="accent">${ESSENCE[m.primary](0, 0, 11)}</g>`;
    return `<svg class="quick ${opts.cls || ""}" viewBox="-75 -75 150 150" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Schnellglyphe ${U.esc(m.name)}"><g class="quick-g">${ring}${core}${ess}${quickShape(m)}${dots}</g></svg>`;
  }

  // Einzelglyphe als kleines SVG (für Legenden und Tabellen)
  function glyphSVG(kind, id, opts = {}) {
    const s = opts.s || 10;
    let inner = "";
    if (kind === "essence") inner = ESSENCE[id](0, 0, s);
    else if (kind === "school") inner = SCHOOL[id](s * 1.6);
    else if (kind === "sign") inner = SIGN[id](s);
    else if (kind === "alch") inner = (ALCH[id] || ALCH.materia)(0, 0, s);
    else if (kind === "component") inner = COMPONENT[id](0, 0, s);
    else if (kind === "casting") inner = CASTING[id](0, 0, s);
    const z = s * 2.2;
    return `<svg class="glyph ${opts.cls || ""}" viewBox="${-z} ${-z} ${2 * z} ${2 * z}" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
  }

  window.renderCircle = circle;
  window.circleAnnotations = annotations;
  window.quickGlyph = quickGlyph;
  window.QUICK_SCHOOL = QUICK_SCHOOL;
  window.glyphSVG = glyphSVG;
  window.CIRCLE_LAYERS = ALL;
  window.CIRCLE_R = R;
})();
