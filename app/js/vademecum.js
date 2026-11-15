// Vademecum: Andachts- und Lehrband für Charaktere mit Gottheit (Gerüst data/vademecum.js, Texte je Gottheit
// aus data/vademecum.local.js, sonst eine dünne Fassung aus den Gottheitsdaten).
//
// VADEMECUM_BOOK.build({ deity, entries, settings }) →
//   ctx.omit: Kapitel-IDs, die entfallen (Druck ohne Kapitel IX).
//   { title, dual, style, halves: [{ key, name, mark, parts: [{ id, title, lessons, pages }] }], middle }
//   Jede Hälfte wird für sich gesetzt (eigene Seitenzahlen, eigenes Verzeichnis). middle ist die Seite zwischen
//   den Hälften ({ title, page }); die Ansicht hängt sie an beide Hälften (in der zweiten kopfüber).
//   Verweise stehen als <span class="vref" data-ref="<Hälfte>/<Anker>"> im Satz; Ziele tragen data-anchor.
//   Die Seitenzahlen setzt die Ansicht nach dem Satz beider Hälften ein (resolveRefs).
//
// Choräle: Formelverse der Zauber aus dem Buch, je Vers mindestens eine Silbe gestrichen (hymnLines).
(function () {
  const e = U.esc;
  const V = () => window.VADEMECUM;
  // Buchsprache; Profiltexte (Randnotizen, Stimmen, Monatsnamen) kommen aus dem Profil in der Buchsprache
  const EN = () => !!(window.I18N && I18N.lang.book === "en");
  const LANG = () => (EN() ? "en" : "de");
  // in der Sprache des Profils das Profil selbst (live), sonst das neutrale Profil der Buchsprache
  const PB = () => (window.PROFILE && (PROFILE.book && PROFILE.localLang && PROFILE.localLang !== LANG() ? PROFILE.book() : PROFILE)) || {};
  // Beschriftungen des Bandes je Buchsprache
  const TX = {
    de: {
      congregation: "Gemeinde", feasts: "Festkalender", hymn: (r) => `Choral ${r}`, chapter: "Kapitel", toc: "Verzeichnis", and: " und ",
      monthN: (n) => `${n}. Monat`, dayOfMonth: (d, m) => `${d}. Tag des ${m}. Monats`, date: (d, m) => `${d}. ${m}`,
    },
    en: {
      congregation: "Congregation", feasts: "Calendar of Feasts", hymn: (r) => `Hymn ${r}`, chapter: "Chapter", toc: "Contents", and: " and ",
      monthN: (n) => `Month ${n}`, dayOfMonth: (d, m) => `Day ${d} of month ${m}`, date: (d, m) => `${d} ${m}`,
    },
  };
  const tx = () => TX[LANG()];
  // Wert aus data/vademecum.js in der Buchsprache (en-Fassung, sonst deutsch)
  const tv = (k) => (EN() && V().en && V().en[k] != null ? V().en[k] : V()[k]);
  const chTitle = (c) => (EN() && V().en && (V().en.chapters || {})[c.id]) || c.title;
  const chNote = (c) => (EN() && V().en && (V().en.chapterNotes || {})[c.id]) || c.note;
  const schoolName = (x) => (EN() && x && x.en ? x.en.de : x.de);
  // lokaler Vademecum-Inhalt ist ein Profiltext: nur in der Sprache des Profils
  const sameLang = () => !window.PROFILE || !PROFILE.localLang || PROFILE.localLang === LANG();
  const prof = () => PB().vademecum || {};
  const voices = () => ({ ...(PB().primer || {}).voices, ...(prof().voices || {}) });
  // römische Zahl (U.ROMAN reicht nur bis X)
  const ROMAN = (n) => {
    let out = "";
    for (const [v, r] of [[50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]]) while (n >= v) (out += r), (n -= v);
    return out || String(n);
  };

  const entryOf = (deity) => (deity && sameLang() && (V().local || {})[deity.id]) || null;

  // ---------------------------------------------------------------------------
  // Hälften
  // ---------------------------------------------------------------------------
  // Wendebuch, wenn die Gottheit einen Zwiespalt hat oder die lokale Datei zwei Hälften setzt; dual: false schaltet ab.
  function halvesOf(deity, loc) {
    const pair = window.PRAYER && PRAYER.dualPair ? PRAYER.dualPair(deity) : null;
    const lh = (loc && loc.halves) || [];
    const dual = (!loc || loc.dual !== false) && (lh.length === 2 || !!pair);
    if (!dual) return [{ key: "a", name: "", mark: "", schools: [], essences: [], chapters: (loc && (loc.chapters || (lh[0] || {}).chapters)) || {} }];
    const domEss = (window.TIME_DATA && TIME_DATA.domainEss) || {};
    return [0, 1].map((i) => {
      const own = lh[i] || {};
      const k = pair ? pair[i] : null;
      return {
        key: own.key || (k ? k.toLowerCase() : "ab"[i]),
        name: own.name || (k && tv("pairNames")[k]) || (V().marks || "AB")[i],
        mark: own.mark || (V().marks || "AB")[i],
        ownMark: !!own.mark,
        schools: (own.schools || []).map((s) => String(s).toLowerCase()),
        essences: own.essences || (k && domEss[k] ? [domEss[k]] : []),
        title: own.title,
        subtitle: own.subtitle,
        motto: own.motto,
        chapters: own.chapters || {},
      };
    });
  }

  // ---------------------------------------------------------------------------
  // Satzbausteine (wie im Lehrheft)
  // ---------------------------------------------------------------------------
  // {{ref:hälfte/anker}} → Platzhalter mit fester Breite, nach dem Satz aufgelöst (in der anderen Hälfte mit deren
  // Zeichen); {{page:hälfte/anker}} nur die Seitenzahl (wenn der Text die Hälfte selbst nennt); {{anchor:id}} setzt
  // ein Ziel mitten im Text
  const refHTML = (s, key) =>
    s
      .replace(/\{\{(ref|page):([^}]+)\}\}/g, (_, k, r) => `<span class="vref" data-ref="${r}"${k === "page" ? " data-plain" : ""}>☐ 000</span>`)
      .replace(/\{\{anchor:([^}]+)\}\}/g, (_, id) => `<span class="vm-anchor" data-anchor="${key}/${id}"></span>`);
  // einfache Auszeichnung im (schon maskierten) Text: **fett**, *kursiv*
  const inlineMD = (h) => h.replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/\*(.+?)\*/g, "<i>$1</i>");
  // Text mit [[Begriff]] (Glosse beim ersten Vorkommen je Hälfte an den Rand), Auszeichnung und Verweisen
  function richHTML(t, b, glosses) {
    return refHTML(
      inlineMD(
        e(t).replace(/\[\[([^\]]+)\]\]/g, (_, w) => {
          const g = glosses[w];
          let note = "";
          if (g && !b.gloss.has(w)) {
            b.gloss.set(w, g);
            note = `<span class="pr-note"><b>${e(w)}</b> ${e(g)}</span>`;
          }
          return `${note}<b class="term">${e(w)}</b>`;
        }),
      ),
      b.key,
    );
  }
  // Verse: "" = Strophenwechsel
  const verseHTML = (lines, b, gl) => `<div class="vm-verse">${lines.map((l) => (l === "" ? `<div class="vm-stanza"></div>` : `<div class="vm-line">${typeof l === "string" ? richHTML(l, b, gl) : l.html}</div>`)).join("")}</div>`;
  // Absätze: Text oder { verse: [...] }, { list: [...] }, { table: [[...], ...] } (erste Zeile = Kopf)
  function parasHTML(list, b, gl) {
    return [].concat(list || [])
      .map((p) => {
        if (typeof p === "string") return `<div class="par"><p>${richHTML(p, b, gl).replace(/\n/g, "<br>")}</p></div>`;
        if (p.verse) return verseHTML(p.verse, b, gl);
        if (p.list) return `<ul class="vm-list">${p.list.map((x) => `<li>${richHTML(x, b, gl)}</li>`).join("")}</ul>`;
        if (p.table) return `<table class="vm-table"><tr>${p.table[0].map((c) => `<th>${richHTML(c, b, gl)}</th>`).join("")}</tr>${p.table.slice(1).map((r) => `<tr>${r.map((c) => `<td>${richHTML(c, b, gl)}</td>`).join("")}</tr>`).join("")}</table>`;
        return "";
      })
      .join("");
  }
  const boxHTML = (bx, b, gl) => [].concat(bx || []).map((x) => `<div class="pr-world"><b>${e(x.title || "")}</b>${[].concat(x.text || []).map((t) => `<p>${richHTML(t, b, gl)}</p>`).join("")}</div>`).join("");
  const epigraphHTML = (ep, b, gl) => {
    if (!ep) return "";
    const x = typeof ep === "string" ? { text: ep } : ep;
    return `<div class="vm-epigraph"><p>${richHTML(x.text, b, gl).replace(/\n/g, "<br>")}</p>${x.source ? `<div class="vm-src">${e(x.source)}</div>` : ""}</div>`;
  };
  const asideHTML = (a, b, gl) => (a ? `<aside class="vm-aside">${richHTML(a, b, gl).replace(/\n/g, "<br>")}</aside>` : "");

  // Randnotizen der Stimmen: aus dem Profil (PROFILE.vademecum.notes) und aus der lokalen Datei (notes am Eintrag
  // der Gottheit), jeweils unter "<hälfte>/<abschnitt>" (im einfachen Buch auch "<abschnitt>"). Hand und Tinte kommen
  // aus den Stimmen des Profils (Lehrheft oder vademecum.voices); Notizen der lokalen Datei erscheinen nur, wenn das
  // Profil ihre Stimme kennt (sie gehören zu einem Charakter, das Vademecum zur Gottheit). Mindeststufe level;
  // desc: Beschreibung einer Markierung statt Handschrift (z. B. „dick durchgestrichen“).
  function notesHTML(anchor, b) {
    const short = anchor.split("/").slice(1).join("/");
    const pick = (all, own) => [...(all[anchor] || []), ...(!b.dual ? all[short] || [] : [])].filter((n) => own || voices()[n.voice]);
    const list = [...pick(prof().notes || {}, true), ...pick(b.notes || {}, false)];
    return list
      .filter((n) => !n.level || (b.level && b.level >= n.level))
      .map((n) => {
        const v = voices()[n.voice] || {};
        const body = (t) => refHTML(inlineMD(String(t).split("\n").map(e).join("<br>")), b.key);
        const desc = n.desc ? `<span class="mnote-desc">${body(n.desc)}</span>` : "";
        return `<aside class="mnote hand-${e(v.hand || "flowing")}" style="color:${e(v.ink || "#3b4a6b")}">${desc}${n.text ? body(n.text) : ""}${v.label ? `<span class="who">– ${e(v.label)}</span>` : ""}</aside>`;
      })
      .join("");
  }

  // Abschnitt oder Gebet. Jeder trägt einen Anker <hälfte>/<id> als Ziel für Verweise (anchors: weitere Namen).
  function sectionHTML(s, b, gl) {
    const anchor = `${b.key}/${s.id}`;
    const g = { ...gl, ...(s.glosses || {}) };
    const head = s.title ? `<div class="ls-head keep-next">${s.kicker ? `<div class="ls-k">${e(s.kicker)}</div>` : ""}<h4 class="ls-t">${e(s.title)}</h4></div>` : "";
    const more = (s.anchors || []).map((a) => `<span class="vm-anchor" data-anchor="${e(b.key)}/${e(a)}"></span>`).join("");
    const open = `<section class="lesson splittable${s.kind === "prayer" || s.kind === "hymn" ? " keep-whole vm-" + s.kind : ""}" data-lesson="${e(s.id)}" data-anchor="${e(anchor)}">${more}`;
    if (s.kind === "prayer" || s.kind === "hymn") {
      return open + head + notesHTML(anchor, b) +
        (s.head ? `<div class="vm-hymn-k">${e(s.head)}</div>` : "") +
        (s.use ? `<p class="vm-use">${richHTML(s.use, b, g)}</p>` : "") +
        verseHTML(s.html ? s.html.map((h) => (h === "" ? "" : { html: h })) : s.lines || [], b, g) +
        (s.response ? `<p class="vm-response"><b>${e(s.responseLabel || tx().congregation)}:</b> ${richHTML(s.response, b, g)}</p>` : "") +
        parasHTML(s.text, b, g) + `</section>`;
    }
    return open + head + notesHTML(anchor, b) + epigraphHTML(s.epigraph, b, g) + asideHTML(s.aside, b, g) + parasHTML(s.text, b, g) + boxHTML(s.box, b, g) + `</section>`;
  }

  // ---------------------------------------------------------------------------
  // Dünne Fassung aus den Gottheitsdaten
  // ---------------------------------------------------------------------------
  const list = (xs) => (xs.length < 2 ? xs.join("") : xs.slice(0, -1).join(", ") + tx().and + xs[xs.length - 1]);
  function essenceFacts(d) {
    const P = window.PRAYER || {};
    // Zuständigkeiten und Domänen in der Buchsprache (prayer.js: AREA/DOMAIN bzw. AREA_EN/DOMAIN_EN)
    const en = window.I18N && I18N.lang.book === "en";
    const AREA = (en ? P.AREA_EN : P.AREA) || {}, DOMAIN = (en ? P.DOMAIN_EN : P.DOMAIN) || {};
    const areas = (d.areas || []).map((x) => AREA[String(x).toLowerCase()]).filter(Boolean);
    const doms = (d.domains || []).map((x) => DOMAIN[x]).filter(Boolean);
    return {
      name: d.name,
      title: (P.epithet && P.epithet(d)) || "",
      align: tv("align")[d.align] || "",
      areas: list([...new Set(areas)]),
      domains: list([...new Set(doms)]),
      symbol: (P.symbolName && P.symbolName(d)) || "",
    };
  }
  function essenceThin(d) {
    const f = essenceFacts(d);
    const fill = (s) => {
      let ok = true;
      const out = s.replace(/\{(\w+)\}/g, (_, k) => (f[k] ? f[k] : ((ok = false), "")));
      return ok ? out : null;
    };
    return tv("essence").map((s) => [].concat(s).map(fill).find(Boolean)).filter(Boolean);
  }

  // ---------------------------------------------------------------------------
  // Festkalender
  // ---------------------------------------------------------------------------
  // Feste aus der lokalen Datei und dem Profil (Andacht), nach Monat und Tag; am selben Tag gilt das der lokalen
  // Datei (das Profil nennt dasselbe Fest oft anders). Ohne Tag: when beschreibt den Termin im Monat (steht am Ende).
  function feastsOf(loc, halfKey) {
    const own = ((loc && loc.feasts) || []).filter((f) => !f.half || f.half === halfKey);
    const pf = ((PB().devotion || {}).feasts || []).filter((f) => !f.half || f.half === halfKey);
    const seen = new Set();
    return [...own, ...pf]
      .filter((f) => {
        const k = f.d ? `${f.m}|${f.d}` : `${f.m}|${f.name}`;
        return !seen.has(k) && seen.add(k);
      })
      .sort((a, b) => a.m - b.m || (a.d || 99) - (b.d || 99));
  }
  function feastDate(f) {
    const months = (PB().calendar || {}).months || [];
    const mo = months[f.m] || tx().monthN(f.m + 1);
    if (!f.d) return f.when ? `${mo}, ${f.when}` : mo;
    return months[f.m] ? tx().date(f.d, months[f.m]) : tx().dayOfMonth(f.d, f.m + 1);
  }
  function feastsSection(feasts, b) {
    if (!feasts.length) return "";
    const rows = feasts.map((f) => `<div class="vm-feast"><b>${e(feastDate(f))}</b> <span class="vm-feast-n">${e(f.name)}</span>${f.text ? `<div class="vm-feast-t">${e(f.text).replace(/\n/g, "<br>")}</div>` : ""}</div>`).join("");
    return `<section class="lesson splittable" data-lesson="feasts" data-anchor="${e(b.key)}/feasts"><div class="ls-head keep-next"><h4 class="ls-t">${e(tx().feasts)}</h4></div>${notesHTML(b.key + "/feasts", b)}${rows}</section>`;
  }

  // ---------------------------------------------------------------------------
  // Choräle
  // ---------------------------------------------------------------------------
  const VOW = "aeiouyäöüáéíóúàèìòùâêîôûāēīōū";
  const isV = (c) => VOW.includes(c.toLowerCase());
  const DIGRAPH = ["tsch", "sch", "ch", "ph", "th", "sh", "kh", "gh", "ck", "ts", "dsch"];
  // Silben eines Wortes nach Vokalgruppen; von einer Konsonantengruppe zwischen zwei Vokalen geht der erste
  // Laut zur vorigen Silbe (Digraphe bleiben zusammen)
  function syllables(word) {
    const out = [];
    let cur = "";
    for (let i = 0; i < word.length; i++) {
      cur += word[i];
      if (isV(word[i]) && !(word[i + 1] && isV(word[i + 1]))) {
        out.push(cur);
        cur = "";
      }
    }
    if (cur) {
      if (out.length) out[out.length - 1] += cur;
      else out.push(cur);
    }
    for (let i = 1; i < out.length; i++) {
      const lead = out[i].match(new RegExp(`^[^${VOW}]+`, "i"));
      if (!lead || lead[0].length < 2) continue;
      const cl = lead[0].toLowerCase();
      if (DIGRAPH.includes(cl)) continue;
      const di = DIGRAPH.find((g) => cl.startsWith(g) && cl.length > g.length);
      const n = di ? di.length : 1;
      out[i - 1] += out[i].slice(0, n);
      out[i] = out[i].slice(n);
    }
    return out;
  }
  // Ein Vers → Teile [{ t } | { gap }]: deterministisch eine (ab sechs Silben zwei) Silben gestrichen, bevorzugt
  // die längste, nie die erste des Verses (außer der Vers hat nur eine). Satzzeichen bleiben stehen.
  function hymnLine(line, seed) {
    const r = U.rng(seed);
    const toks = String(line).split(/(\s+)/);
    const syl = []; // { w: Tokenindex, i: Silbenindex, s }
    const parts = toks.map((tk, w) => {
      if (/^\s*$/.test(tk)) return [tk];
      const m = tk.match(/^([^\p{L}]*)([\p{L}'’-]*)([^\p{L}]*)$/u) || ["", "", tk, ""];
      const ss = m[2] ? syllables(m[2]) : [];
      ss.forEach((s, i) => syl.push({ w, i, s }));
      return [m[1], ...ss, m[3]];
    });
    if (!syl.length) return [{ t: line }];
    // einsilbiger Vers: nur die zweite Hälfte der Silbe fällt weg, damit er singbar anfängt
    if (syl.length === 1) {
      const { w, s } = syl[0];
      const keep = Math.max(1, Math.ceil(s.length / 2));
      parts[w].splice(1, 1, s.slice(0, keep), s.slice(keep));
      syl[0] = { w, i: 1, s: s.slice(keep) };
    }
    let cand = syl.length === 1 ? syl : syl.slice(1);
    const want = syl.length >= 6 ? 2 : 1;
    const struck = new Set();
    for (let k = 0; k < want && cand.length; k++) {
      const max = Math.max(...cand.map((c) => c.s.replace(/[^\p{L}]/gu, "").length));
      const top = cand.filter((c) => c.s.replace(/[^\p{L}]/gu, "").length >= max - 1);
      const pick = r.pick(top);
      struck.add(pick.w + "|" + pick.i);
      const at = syl.indexOf(pick);
      cand = cand.filter((c) => Math.abs(syl.indexOf(c) - at) > 1);
    }
    const out = [];
    parts.forEach((p, w) => {
      if (p.length === 1) return out.push({ t: p[0] });
      out.push({ t: p[0] });
      p.slice(1, -1).forEach((s, i) => out.push(struck.has(w + "|" + i) ? { gap: true, n: s.length } : { t: s }));
      out.push({ t: p[p.length - 1] });
    });
    // benachbarte Texte zusammenfassen
    return out.reduce((a, x) => {
      const last = a[a.length - 1];
      if (x.t != null && last && last.t != null) last.t += x.t;
      else if (x.t !== "") a.push(x);
      return a;
    }, []);
  }
  const lineText = (parts) => parts.map((p) => (p.gap ? "–" : p.t)).join("");
  const lineHTML = (parts) => parts.map((p) => (p.gap ? `<span class="vm-gap"></span>` : e(p.t))).join("");

  // Zauber auf die Hälften verteilen und je Hälfte die passendsten wählen (Tempelschwerpunkt, Schulen und Essenzen
  // der Hälfte); Gleichstand entscheidet ein fester Zufall je Gottheit und Zauber
  function pickHymns(deity, entries, halves, loc) {
    const focus = (((loc || {}).temple || {}).focus || []).map((s) => String(s).toLowerCase());
    const domEss = new Set(((deity && deity.domains) || []).map((d) => ((window.TIME_DATA || {}).domainEss || {})[d]).filter(Boolean));
    const max = +((loc && loc.hymns) || V().hymns) || 6;
    const tie = (x) => U.hash(`${deity ? deity.id : "-"}|hymn|${x.m.id}`);
    const ess = (x) => (x.m.essences || []).map((y) => y.id);
    const base = (x) => (focus.includes(x.m.spell.school) ? 3 : 0) + (ess(x).some((id) => domEss.has(id)) ? 1 : 0);
    const fit = (x, h) => (h.schools.includes(x.m.spell.school) ? 3 : 0) + (ess(x).some((id) => h.essences.includes(id)) ? 2 : 0);
    const pool = entries.filter((x) => x.m && x.m.spell && !x.m.spell.everyday);
    const by = halves.map(() => []);
    for (const x of pool) {
      const sc = halves.map((h) => fit(x, h));
      const best = Math.max(...sc);
      const at = sc.filter((s) => s === best).length > 1 ? tie(x) % halves.length : sc.indexOf(best);
      by[at].push({ x, score: base(x) + best });
    }
    return by.map((l) => l.sort((a, c) => c.score - a.score || tie(a.x) - tie(c.x)).slice(0, max).map((y) => y.x));
  }
  // Choräle des Kapitels: Rahmen der lokalen Datei (frames: Titel, Anlass, Gemeindeantwort, Schule, Grad) nehmen in ihrer
  // Reihenfolge je einen erzeugten Choral auf, zuerst einen mit gleicher Schule und gleichem Grad, dann einen mit gleicher
  // Schule, Rahmen ohne Schule jeden. Ein Rahmen ohne passenden Zauber behält seine ausgeschriebenen Verse (lines) oder
  // entfällt; fixed: nie ersetzt (z. B. Choräle, die bewusst nicht im Buch stehen). after: Text unter den Versen.
  // Übrige erzeugte Choräle folgen mit dem Anlass ihrer Schule. hymns: feste eigene Choräle davor.
  // Ein Abschnitt { kind: "slot", frames: [Index …] } im Kapitel setzt die Choräle dieser Rahmen an seine Stelle (der erste
  // Platzhalter nimmt auch die übrigen auf); ohne Platzhalter stehen alle Choräle nach den Abschnitten.
  function hymnSections(deity, picks, ch, settings) {
    const frames = (ch && ch.frames) || [];
    const lvlName = (n) => (n ? ROMAN(n) : "0");
    const made = picks.map((x) => {
      const t = generateTexts(x.m, { name: (window.PROFILE && PROFILE.bookValue ? PROFILE.bookValue(settings || {}, "owner") : settings && settings.owner) || "" });
      const lines = t.formula.lines.map((l, k) => hymnLine(l, `${deity ? deity.id : "-"}|hymn|${x.m.id}|${k}`));
      return { x, lines, school: x.m.spell.school, level: x.m.level };
    });
    const free = new Set(made);
    const take = (f) => {
      const sc = f.school ? String(f.school).toLowerCase() : null;
      const pool = [...free];
      const hit = (sc && f.level != null && pool.find((g) => g.school === sc && g.level === +f.level)) || (sc && pool.find((g) => g.school === sc)) || (!sc && pool[0]) || null;
      if (hit) free.delete(hit);
      return hit;
    };
    const gen = (g, fr, i) => ({
      kind: "hymn",
      id: fr.id || "hymn-" + g.x.m.id,
      title: fr.title || tx().hymn(ROMAN(i + 1)),
      head: `${schoolName(g.x.m.schoolInfo)} · ${lvlName(g.level)}`,
      use: fr.use || tv("hymnUse")[g.school] || tv("hymnUse").default,
      response: fr.response,
      text: fr.after,
      html: g.lines.map(lineHTML),
      plain: g.lines.map(lineText),
      spell: g.x.m.id,
    });
    const out = [];
    frames.forEach((f, i) => {
      const g = f.fixed ? null : take(f);
      if (g) out.push({ ...gen(g, f, out.length), frame: i });
      else if (f.lines) out.push({ kind: "hymn", id: f.id || "hymn-frame-" + i, title: f.title, kicker: f.kicker, head: f.head, use: f.use, lines: f.lines, response: f.response, text: f.after, frame: i });
    });
    // übrige erzeugte Choräle: eigene Zählung, mit Rahmen „Weitere Choräle“ wie der erste ohne Rahmen
    let k = frames.length ? 0 : out.length;
    for (const g of made) if (free.has(g)) out.push(gen(g, {}, k++));
    const own = ((ch && ch.hymns) || []).map((h, i) => ({ kind: "hymn", id: h.id || "hymn-own-" + i, title: h.title, use: h.use, lines: h.lines, head: h.head, response: h.response }));
    return [...own, ...out];
  }

  // ---------------------------------------------------------------------------
  // Band zusammensetzen
  // ---------------------------------------------------------------------------
  function build(ctx = {}) {
    const deity = ctx.deity || window.DEITY || null;
    if (!deity) return null;
    const settings = ctx.settings || {};
    const loc = entryOf(deity);
    const halves = halvesOf(deity, loc);
    const omit = new Set(ctx.omit || []); // Kapitel-IDs, die entfallen (z. B. hooks im Druck)
    const dual = halves.length === 2;
    const bind = settings.primerGutter === false ? "" : " bind";
    // Name des Bandes in der Oberfläche; auf dem Titelblatt ohne Gottheit (die steht darunter)
    const title = (loc && loc.title) || `${tv("title")} · ${deity.name}`;
    const picks = pickHymns(deity, ctx.entries || [], halves, loc);
    const gl0 = (loc && loc.glosses) || {};

    const bs = [];
    const out = halves.map((h, hi) => {
      const b = { key: h.key, dual, gloss: new Map(), level: +settings.charLevel || 0, notes: (loc && loc.notes) || {} };
      bs.push(b);
      const parts = [];
      const chapters = [];
      let n = 0;
      for (const c of V().chapters) {
        if (omit.has(c.id)) continue;
        const lc = h.chapters[c.id] || (!dual && loc && loc.chapters && loc.chapters[c.id]) || null;
        let secs = (lc && lc.sections) || [];
        let extra = "";
        if (c.id === "essence" && !secs.length) {
          const thin = essenceThin(deity);
          if (dual) thin.push(EN() && V().en && V().en.dualNote ? V().en.dualNote.replace("{half}", h.name) : `Dieses Buch hat zwei Hälften. Diese gilt ${h.name.replace(/^(Die|Der|Das) /, (m, a) => ({ Die: "der ", Der: "dem ", Das: "dem " })[a])}; wende es, um die andere zu lesen.`);
          if (thin.length) secs = [{ id: "essence", title: "", text: thin }];
        }
        if (c.id === "hymns") {
          const hy = hymnSections(deity, picks[hi] || [], lc, settings);
          const slots = secs.filter((x) => x.kind === "slot");
          if (!slots.length) secs = [...secs, ...hy];
          else {
            const inSlot = (x, sl) => (x.frame != null ? (sl.frames || []).includes(x.frame) : sl === slots[0]);
            secs = secs.flatMap((x) => (x.kind === "slot" ? hy.filter((y) => inSlot(y, x)) : [x]));
            // Choräle ohne passenden Platzhalter ans Ende
            secs.push(...hy.filter((y) => !slots.some((sl) => inSlot(y, sl))));
          }
        }
        if (c.id === "rites") extra = feastsSection(feastsOf(loc, dual ? h.key : null), b);
        if (!secs.length && !extra) continue;
        const roman = c.unnumbered ? "" : ROMAN(++n);
        chapters.push({ c, roman, secs, extra, lc, title: (lc && lc.title) || chTitle(c) });
      }
      // Titelblatt und Verzeichnis
      const tpTitle = h.title || (loc && loc.title) || tv("title");
      const sub = h.subtitle || (loc && loc.subtitle) || tv("subtitle");
      const motto = h.motto || (loc && loc.motto);
      const temple = loc && loc.temple ? [loc.temple.name, loc.temple.place].filter(Boolean).join(" · ") : deity.name;
      const pages = [
        {
          cls: "title-page vm-title" + bind,
          running: "",
          html: `<div class="tp" data-anchor="${e(h.key)}/title"><div class="vm-orn"></div><h1>${e(tpTitle)}</h1>${dual ? `<div class="tp-vol">${h.ownMark ? `<span class="vm-mark">${e(h.mark)}</span> ` : ""}${e(h.name)}</div>` : ""}<div class="tp-owner">${e(sub)}</div><div class="tp-sub">${e(temple)}</div>${loc && loc.author ? `<div class="tp-sub vm-author">${e([loc.author.name, loc.author.office].filter(Boolean).join(", "))}</div>` : ""}${motto ? `<div class="vm-motto"><p>${richHTML(motto.text, b, gl0)}</p>${motto.source ? `<div class="vm-src">${e(motto.source)}</div>` : ""}</div>` : ""}</div>`,
        },
        {
          cls: "primer-page vm-page vm-toc-page flow" + bind,
          running: tx().toc,
          html: `<h3>${e(tx().toc)}</h3><div class="vm-toc">${chapters.map((x) => `<div class="vm-toc-row"><span class="no">${e(x.roman)}</span><span class="nm">${e(x.title)}</span><span class="vref" data-ref="${e(h.key)}/ch-${e(x.c.id)}">☐ 000</span></div>`).join("")}${dual ? `<div class="vm-toc-row"><span class="no"></span><span class="nm">${e((loc && loc.middle && loc.middle.title) || tv("middleTitle"))}</span><span class="vref" data-ref="${e(h.key)}/middle">☐ 000</span></div>` : ""}</div>`,
        },
      ];
      parts.push({ id: "front", title: tpTitle, lessons: [], pages });
      for (const x of chapters) {
        const run = (x.roman ? x.roman + " · " : "") + x.title;
        const head = `<div class="vm-ch keep-next" data-anchor="${e(h.key)}/ch-${e(x.c.id)}">${x.roman ? `<div class="ch-kicker">${e(tx().chapter)} ${e(x.roman)}</div>` : ""}<h3>${e(x.title)}</h3>${x.c.otherworldly ? `<p class="vm-ow">${e((x.lc && x.lc.note) || chNote(x.c) || "")}</p>` : ""}</div>`;
        const html = head + epigraphHTML(x.lc && x.lc.epigraph, b, gl0) + x.secs.map((s) => sectionHTML(s, b, gl0)).join("") + x.extra;
        parts.push({
          id: x.c.id,
          title: run,
          lessons: x.secs.filter((s) => s.title).map((s) => ({ id: s.id, title: s.title, label: "·" })).concat(x.extra ? [{ id: "feasts", title: tx().feasts, label: "·" }] : []),
          pages: [{ cls: `primer-page vm-page flow part-${x.c.id}${bind}${bind ? " recto-start" : ""}${x.c.otherworldly ? " vm-otherworldly" : ""}`, running: run, html }],
        });
      }
      parts.forEach((p) => p.pages.forEach((pg) => (pg.cls += " half-" + h.key)));
      const hy = chapters.find((x) => x.c.id === "hymns");
      return { key: h.key, name: h.name, mark: h.mark, parts, hymns: hy ? hy.secs.filter((s) => s.spell) : [] };
    });

    // Mitte: von beiden Seiten die letzte Seite. Eine gemeinsame Seite (shared) oder je Hälfte eine eigene
    // (middle.halves: [{ title, epigraph, lines, text }, …]), die in der Ansicht der anderen Hälfte kopfüber gegenübersteht.
    let middle = null;
    if (dual) {
      const m = (loc && loc.middle) || {};
      const mt = m.title || tv("middleTitle");
      const page = (part, b) => ({
        cls: "primer-page vm-page vm-middle" + bind,
        running: mt,
        // Inhalt in einem Abschnitt: die Seite ist ein Flex-Container, Randnotizen müssen darin floaten
        html: `<h3>${e(part.title || mt)}</h3><section class="lesson vm-mid-body" data-lesson="middle">${notesHTML(b.key + "/middle", b)}${epigraphHTML(part.epigraph, b, gl0)}${part.lines ? verseHTML(part.lines, b, gl0) : ""}${parasHTML(part.text, b, gl0)}</section>`,
      });
      if (m.halves) middle = { title: mt, shared: false, pages: m.halves.slice(0, 2).map((part, i) => page(part, bs[i])) };
      else {
        const text = m.text || [((window.PRAYER && PRAYER.dual(deity, "dual")) || "")].filter(Boolean);
        const pg = page({ title: mt, text, lines: m.lines, epigraph: m.epigraph }, bs[0]);
        middle = { title: mt, shared: true, pages: [pg, pg] };
      }
    }
    // Tempelfarben (lokale Datei), sonst heilige Farben der Gottheit
    // Schriftfarben nur aus dunklen Tönen (helle wie Gold oder Weiß wären auf Pergament unlesbar), Zierfarbe beliebig
    const col = (loc && loc.colors) || {};
    const dc = (deity.colors || []).map((c) => c.hex).filter((h) => /^#[0-9a-f]{6}$/i.test(h));
    const dark = dc.filter((h) => lum(h) < 0.33).sort((a, c) => lum(a) - lum(c));
    const light = dc.filter((h) => !dark.includes(h) && lum(h) < 0.75); // fast Weiß verschwindet auf Pergament
    const style = {};
    const put = (k, v) => v && (style[k] = v);
    put("--vm-primary", col.primary || dark[0]);
    put("--vm-secondary", col.secondary || dark[1] || dark[0]);
    put("--vm-accent", col.accent || light[0] || dark[1] || dark[0]);
    return { title, deity: deity.id, dual, local: !!loc, style, halves: out, middle };
  }

  // relative Helligkeit eines Hex-Werts (0 schwarz … 1 weiß)
  function lum(hex) {
    const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  // Seitenzahlen der Verweise einsetzen: at(ref) → { mark, no } oder null
  function resolveRefs(root, at) {
    for (const el of root.querySelectorAll(".vref[data-ref]")) {
      const x = at(el.dataset.ref);
      // data-plain ({{page:…}}): der Text nennt die Hälfte schon, nur die Zahl
      el.textContent = x ? (x.mark && !el.hasAttribute("data-plain") ? x.mark + " " : "") + x.no : "–";
    }
  }

  window.VADEMECUM_BOOK = { build, resolveRefs, syllables, hymnLine, lineText, halvesOf, feastsOf, feastDate, essenceThin, pickHymns };
})();
