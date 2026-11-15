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
      // Schrift der Formelsprache (scripts.js): Laufweite, Großbuchstaben, Trenner; gezählt in Zeichen, nicht UTF-16-Einheiten
      const sc = window.SCRIPTS ? SCRIPTS.shownOf(window.FORMULA && FORMULA.langOf(m)) : { upper: true, size: 13, advance: 9.2, sep: " · ", cls: "" };
      const adv = sc.advance;
      const base = [...((sc.upper ? text.toUpperCase() : text).trim() + sc.sep)];
      const gap = (c) => c === " " || c === "\u1680";
      segs.forEach(([a1, a2], i) => {
        const pid = `${id}-${i}`;
        const len = ((a2 - a1) / 360) * 2 * Math.PI * R.bandText;
        const width = (x) => (window.SCRIPTS ? SCRIPTS.bandWidth(sc, x) : x.length * adv);
        let t = base.slice();
        while (width(t) < len) t = t.concat(base);
        // auf ganze Zeichenzahl kürzen, die in den Bogen passt
        // auf ganze Wörter kürzen, damit an Lücken kein Wortrest stehen bleibt
        let max = t.length;
        while (max > 4 && width(t.slice(0, max)) > len) max--;
        if (t.length > max) {
          t = t.slice(0, max);
          let cut = t.length - 1;
          while (cut > 0 && !gap(t[cut])) cut--;
          if (cut > max * 0.6) t = t.slice(0, cut);
        }
        while (t.length && (gap(t[t.length - 1]) || t[t.length - 1] === "·")) t.pop();
        if (sc.glyphs) {
          // Ursprache: Strichzeichen einzeln entlang des Bogens, Mitte des Rests auf die Mitte des Bogens
          const step = (adv / (2 * Math.PI * R.bandText)) * 360;
          const a0 = (a1 + a2) / 2 - (step * (t.length - 1)) / 2;
          t.forEach((c, k) => {
            const d = SCRIPTS.protoPath(c);
            if (!d) return;
            const [x, y] = polar(0, 0, R.bandText + 4.5, a0 + k * step);
            out.push(S.group(`<path class="band-glyph" d="${d}" transform="translate(-3,-5)"/>`, x, y, a0 + k * step));
          });
          return;
        }
        const str = t.join("");
        if (segs.length === 1 && a2 - a1 >= 360) out.push(`<path id="${pid}" d="M0,${-R.bandText} A${R.bandText},${R.bandText} 0 1 1 -0.01,${-R.bandText}Z" class="guide"/>`);
        else out.push(arcPath(pid, R.bandText, a1, a2));
        // fast voller Bogen: auf Länge strecken; kurzer Rest: mittig in normaler Laufweite
        const cls = `band-text ${sc.cls}`.trim();
        if (width(t) >= len * 0.85) out.push(`<text class="${cls}" font-size="${sc.size}"><textPath href="#${pid}" textLength="${f(len - 6)}" lengthAdjust="spacing">${U.esc(str)}</textPath></text>`);
        else out.push(`<text class="${cls}" font-size="${sc.size}" text-anchor="middle"><textPath href="#${pid}" startOffset="50%">${U.esc(str)}</textPath></text>`);
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

  // Mythische Überladung: doppelter Außenring (bei „Augmented“ ein dritter) und Mythenpunkt im Kern
  function mythicLayer(m, level) {
    const out = [S.circle(0, 0, R.outer + 7, "accent"), S.circle(0, 0, 7, "accent fill")];
    if (level === "augmented") out.push(S.circle(0, 0, R.outer + 13, "accent dash"));
    for (let i = 0; i < 9; i++) out.push(S.dot(...polar(0, 0, R.outer + 7, i * 40), 2.4));
    return `<g class="layer-mythic accent">${out.join("")}</g>`;
  }

  // opts: { text, layers: [...], zoom: Radius des sichtbaren Ausschnitts, cls, mythic: true|"augmented" }
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
    if (opts.mythic) parts.push(mythicLayer(m, opts.mythic));
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
    add(polar(0, 0, R.ess + 16, 200), "Essenzring", T.parts(m.essences) + ".");
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
  // Gestaltstrich außen oben, ab dem äußersten Ring b; Ziele: ein bis drei Striche mit Knoten
  function quickShape(m, b) {
    const up = (d) => -b - d;
    switch (m.shape.kind) {
      case "ray": return S.line(0, up(0), 0, up(16)) + S.arrowHead(0, up(18), 0, 6);
      case "touch": return S.line(0, up(18), 0, up(4)) + S.arrowHead(0, up(0), 180, 6);
      case "targets": {
        const n = Math.min(m.shape.count, 3), angs = [[0], [-12, 12], [-20, 0, 20]][n - 1];
        return angs.map((a) => { const [x1, y1] = polar(0, 0, b, a), [x2, y2] = polar(0, 0, b + 13, a), [x3, y3] = polar(0, 0, b + 16.5, a); return S.line(x1, y1, x2, y2) + S.dot(x3, y3, 3.2); }).join("");
      }
      case "cone": return S.line(0, up(0), -16, up(16)) + S.line(0, up(0), 16, up(16));
      case "line": return S.line(-4, up(0), -4, up(18)) + S.line(4, up(0), 4, up(18));
      case "burst": return [45, 135, 225, 315].map((a) => S.line(...polar(0, 0, b, a), ...polar(0, 0, b + 12, a))).join("");
      case "spread": return S.path(`M-15,${up(9)} q3.75,-7 7.5,0 t7.5,0 t7.5,0 t7.5,0`);
      case "emanation": return S.arc(0, 0, b + 8, 300, 60);
      case "cylinder": return S.line(0, up(0), 0, up(16)) + S.line(-8, up(16), 8, up(16));
      case "wall": return S.line(-16, up(8), 16, up(8));
      case "sphere": return S.circle(0, up(11), 7) + S.line(-7, up(11), 7, up(11));
      case "cube": return S.polygon([[-6, up(5)], [6, up(5)], [6, up(17)], [-6, up(17)]]);
      case "object": return S.polygon([[-6, up(5)], [6, up(5)], [6, up(17)], [-6, up(17)]], "fill");
      case "self": return S.arc(0, up(8), 7, 0, 300);
      case "summon": return S.path(`M-8,${up(2)} L-8,${up(12)} A8,8 0 0 1 8,${up(12)} L8,${up(2)}`);
      case "sensor": return S.path(`M-11,${up(10)} Q0,${up(19)} 11,${up(10)} Q0,${up(1)} -11,${up(10)}Z`) + S.dot(0, up(10), 2.4);
      case "symbol": return S.line(0, up(0), 0, up(18)) + S.line(0, up(8), -7, up(15)) + S.line(0, up(8), 7, up(15));
      default: return S.path(`M-9,${up(18)} Q-9,${up(5)} 0,${up(5)} Q9,${up(5)} 9,${up(18)}`); // besondere Form: offene Schale
    }
  }
  // Kreis nach Dauer: vereinfachter Dauerring; zusätzliche Ringe liegen außen. Rückgabe: [SVG, äußerer Radius]
  function quickRing(m) {
    const R = 50, extra = (n) => Array.from({ length: n }, (_, i) => S.circle(0, 0, R + 6 * (i + 1), "thin")).join("");
    switch (m.duration.kind) {
      case "instant": return [S.arc(0, 0, R, 25, 335), R];
      case "rounds": return [S.circle(0, 0, R) + S.line(R, 0, R + 8, 0) + S.line(-R, 0, -R - 8, 0), R];
      case "minutes": return [S.circle(0, 0, R, "dash"), R];
      case "hours": return [S.circle(0, 0, R) + extra(1), R + 6];
      case "days": return [S.circle(0, 0, R) + extra(2), R + 12];
      case "permanent": return [S.circle(0, 0, R) + S.arc(0, 0, R + 6, 55, 110) + S.dot(...polar(0, 0, R + 6, 110), 3), R];
      case "concentration": return [S.circle(0, 0, R) + S.line(...polar(0, 0, R, 245), ...polar(0, 0, R + 14, 252)) + S.dot(...polar(0, 0, R + 17, 253), 2.6), R];
      default: return [S.arc(0, 0, R, 105, 75), R]; // besonders: Lücke rechts
    }
  }
  // Absichtszeichen: Anlaute von Verb und Essenzwort der gedruckten Kernzeile in der Schrift ihrer Sprache, neben der Schulfigur
  const QL_WIDTH = 16, QL_MIN = 11; // größte Breite und Mindestgröße eines Absichtszeichens (Lücke Figur–Ring)
  const QL_GAP = 40.5, QL_LENGTH = 22; // gedrehte Zeichen (Ogham): Mitte der Lücke, größte Länge entlang des Rings
  const QUICK_LETTERS = { divination: [[0, -36], [0, 35]], illusion: [[0, -36], [0, 35]], universal: [[-25, -25], [25, -25]] };
  function quickLetters(m) {
    const marks = window.TEXTGEN ? TEXTGEN.coreChoice(m).marks : ["", ""];
    const sc = window.SCRIPTS ? SCRIPTS.shownOf(window.FORMULA && FORMULA.langOf(m)) : {};
    const [p, q] = QUICK_LETTERS[m.school] || [[-36.5, 1], [36.5, 1]];
    const one = ([x, y], c) => {
      // Ogham steht wie auf den Steinen senkrecht (liest von unten nach oben): an den seitlichen Plätzen um −90° gedreht,
      // die Stammlinie tangential, mittig in der Lücke zwischen Figur (r≈31) und Ring (r=50)
      const rot = sc.qlRotate && Math.abs(x) > Math.abs(y);
      if (rot) { const r = Math.hypot(x, y), k = QL_GAP / r; x *= k; y *= k; }
      if (sc.glyphs) return `<path class="ql-proto" d="${SCRIPTS.protoPath(c) || ""}" transform="translate(${f(x - 4.5)},${f(y - 12.5)}) scale(1.5)"/>`;
      // breite Zeichen (Keilschrift, manche Hieroglyphen) zwischen Figur und Ring einpassen: erst kleiner, ab der
      // Mindestgröße schmaler gezogen
      const w = ((window.SCRIPT_WIDTHS || {})[sc.key] || {})[c];
      const max = sc.qlRotate ? QL_LENGTH : QL_WIDTH;
      const size = w ? Math.min(sc.mark || 16, Math.max(QL_MIN, max / w)) : sc.mark || 16;
      let t = S.text(x, y, c, `ql ${sc.cls || ""}`.trim(), f(size));
      if (w && w * size > max) t = t.replace("<text ", `<text textLength="${max}" lengthAdjust="spacingAndGlyphs" `);
      return rot ? t.replace("<text ", `<text transform="rotate(-90 ${f(x)} ${f(y)})" `) : t;
    };
    return one(p, marks[0]) + one(q, marks[1]);
  }
  // Vorschauen für die Legende: nur der Kreis einer Dauer, nur ein Gestaltstrich auf einem Ringstück
  const QUICK_PART = {
    ring: (kind) => `<svg class="quick" viewBox="-68 -68 136 136" xmlns="http://www.w3.org/2000/svg">${quickRing({ duration: { kind } })[0]}</svg>`,
    shape: (kind, count = 1) => `<svg class="quick" viewBox="-56 -82 112 50" xmlns="http://www.w3.org/2000/svg">${S.arc(0, 0, 50, 316, 44, "thin")}${quickShape({ shape: { kind, count } }, 50)}</svg>`,
  };
  // opts.marks === false: verkürzte Form ohne Absichtszeichen (Verzeichnis, Kapitellisten; dort winzig klein)
  function quickGlyph(m, opts = {}) {
    const [ring, outer] = quickRing(m);
    const lv = m.level;
    const dots = Array.from({ length: lv }, (_, i) => S.dot(...polar(0, 0, 50, 180 + (i - (lv - 1) / 2) * 14), 3.2)).join("");
    const core = (QUICK_SCHOOL[m.school] || QUICK_SCHOOL.universal)();
    const ess = `<g class="accent">${ESSENCE[m.primary](0, 0, 11)}</g>`;
    return `<svg class="quick ${opts.cls || ""}" viewBox="-80 -80 160 160" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Schnellglyphe ${U.esc(m.name)}"><g class="quick-g">${ring}${core}${ess}${quickShape(m, outer)}${dots}${opts.marks === false ? "" : quickLetters(m)}</g></svg>`;
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
  // Beschriftungen in der Buchsprache: im englischen Buch über den (stabilen) deutschen Schlüssel neu gebildet;
  // die Lage der Marken bleibt dieselbe
  const EN = () => window.I18N && I18N.lang.book === "en";
  const enOf = (x) => (x && x.en) || x;
  const ORDINAL_EN = ["", "first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth"];
  const ANNOT_EN = {
    "Eckstein Stimme (V)": () => ["Cornerstone Voice (V)", "The formula is spoken; its wording stands in the script band."],
    "Eckstein Geste (S)": () => ["Cornerstone Gesture (S)", "The hands guide the formula; the gestures are given in the text."],
    "Eckstein Stoff (M)": (m) => ["Cornerstone Material (M)", `Alchemical sign of the material: ${(m.components.nouns || []).map((n) => window.THEORY.MATERIAL_EN[n] || n).join(", ") || "unspecified"}.`],
    "Eckstein Fokus": () => ["Cornerstone Focus", "Lozenge = focus, eye = divine focus. It is not used up."],
    Zeitmarke: (m) => ["Time mark", U.cap(m.casting.en) + "."],
    Schriftband: (m) => ["Script band", m.components.V ? "The spoken formula, to be read clockwise from the north." : "Silent runes – the formula has no voice."],
    Schwellentor: (m, a) => ["Threshold gate", `${window.THEORY.SAVES[m.save.type].en.gate} for ${window.THEORY.SAVES[m.save.type].en.de}${/zwei Tore/.test(a.t) ? "; two gates: half or partial effect" : ""}${m.save.harmless ? "; dashed: harmless" : ""}.`],
    Siegelband: () => ["Seal band", "Hatching: the formula must overcome spell resistance."],
    Ordnungsknoten: (m) => ["Knots of order", `${m.level} knot${m.level > 1 ? "s" : ""} for the ${ORDINAL_EN[m.level]} order${m.level >= 3 ? ", joined into a star" : ""}.`],
    Weitenringe: (m) => ["Spacing rings", `${m.range.tier} ring${m.range.tier > 1 ? "s" : ""}: ${["personal", "touch", "close range", "medium range", "long range", "unlimited range"][m.range.tier]}.`],
    Zeichenring: (m) => ["Ring of signs", m.signs.map((x) => `${enOf(x).de} (${x.dir === "in" ? "inwards" : "outwards"})`).join(", ") + "."],
    Essenzring: (m) => ["Essence ring", window.THEORY.partsEn(m.essences) + "."],
    Dauerring: (m) => ["Ring of duration", `${enOf(m.duration).ring}.`],
    Kernsiegel: (m) => { const sc = enOf(window.THEORY.SCHOOLS[m.school] || window.THEORY.SCHOOLS.universal); return ["Core seal", `${sc.figure} – ${sc.de}.`]; },
    Hauptessenz: (m) => ["Principal essence", `${window.THEORY.ESS[m.primary].latin} (${enOf(window.THEORY.ESS[m.primary]).de}).`],
    Gestaltvektoren: (m) => ["Shape vectors", `${enOf(m.shape).de}: ${enOf(m.shape).figure}.`],
  };
  window.circleAnnotations = (m) => {
    const list = annotations(m);
    return EN() ? list.map((a) => { const f = ANNOT_EN[a.k]; const [k, t] = f ? f(m, a) : [a.k, a.t]; return { ...a, k, t }; }) : list;
  };
  window.quickGlyph = quickGlyph;
  // Absichtszeichen für den Fließtext: Zeichen in der Formelschrift, Ursprache als kleines Strichbild
  window.quickMarksHTML = (m) => {
    const sc = SCRIPTS.shownOf(FORMULA.langOf(m));
    return TEXTGEN.coreChoice(m).marks.map((c) =>
      sc.glyphs ? `<svg class="mark-proto" viewBox="-1 -1 8 12"><path d="${SCRIPTS.protoPath(c) || ""}"/></svg>` : `<b class="mark ${sc.cls}">${U.esc(c)}</b>`);
  };
  window.QUICK_PART = QUICK_PART;
  window.QUICK_SCHOOL = QUICK_SCHOOL;
  window.glyphSVG = glyphSVG;
  window.CIRCLE_LAYERS = ALL;
  window.CIRCLE_R = R;
})();
