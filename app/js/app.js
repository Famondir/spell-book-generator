// Oberfläche: Verzeichnis durchsuchen, Zauber ansehen, Buch zusammenstellen, drucken.
(function () {
  const T = window.THEORY;
  const $ = (s, el = document) => el.querySelector(s);
  const e = U.esc;
  const $t = I18N.t, $tn = I18N.tn;

  // --- Zustand (lokal im Browser gespeichert) -----------------------------------
  const DEFAULTS = {
    owner: PROFILE.owner,
    bookTitle: (CLASS.bookTitle && !(PROFILE.cls === CLASS.id)) ? CLASS.bookTitle : PROFILE.bookTitle,
    subtitle: PROFILE.subtitle,
    leftStart: "notes",
    chapters: true,
    refNo: false,
    refQr: false,
    refSource: false,
    frontMatter: true,
    scriptMode: "original", // Schriftband und Absichtszeichen: original (Schrift der Formelsprache) | latin
    onlyClass: true,
    material: "auto", // Andachtsbild: auto (nach Gottheit), glass, stone
    paper: "a5",
    scrollPaper: "a4",
    printBackground: true,
    detailPrint: false,
    maxPages: "", // Höchstseitenzahl je Band (leer = ein Band)
    primerGutter: true, // Lehrheft mit Lochrand fürs Ringbuch
    primerLayout: "balanced", // Lehrheft: dense | balanced | pages
    charLevel: "", // Charakterstufe: schaltet Randnotizen im Lehrheft frei (leer: nur Notizen ohne Stufe)
    primerMaster: "", // Name des Meisters im Lehrheft (leer: aus dem Profil, sonst „der Meister“)
    knownLangs: null, // Hausregel Entziffern: beherrschte Formelsprachen (null: Vorgabe aus dem Profil)
    // Sprachen: Oberfläche, Buch (In-Game-Texte), Regeln; Maßeinheit (leer: nach Regelsprache)
    uiLang: I18N.browser,
    bookLang: I18N.browser,
    rulesLang: I18N.browser,
    units: "",
  };
  const store = {
    get(k, d) {
      try {
        const v = localStorage.getItem(CHARS.key(k));
        return v ? JSON.parse(v) : d;
      } catch (_) {
        return d;
      }
    },
    set(k, v) {
      try {
        localStorage.setItem(CHARS.key(k), JSON.stringify(v));
      } catch (_) { /* privater Modus o. Ä. */ }
    },
  };
  const state = {
    settings: (() => {
      const st = { ...DEFAULTS, ...store.get("settings", {}) };
      if (st.startLeft === false && !store.get("settings", {}).leftStart) st.leftStart = "off"; // alte Einstellung
      delete st.startLeft;
      if ("onlyWizard" in st) st.onlyClass = st.onlyWizard; // alte Einstellung: nur Magierliste → nur Klassenliste
      delete st.onlyWizard;
      // Zustand aus der Zeit vor der Sprachwahl: alles bleibt Deutsch
      const saved = store.get("settings", null);
      if (saved && !("uiLang" in saved)) Object.assign(st, { uiLang: "de", bookLang: "de", rulesLang: "de" });
      return st;
    })(),
    book: new Set(store.get("book", [])),
    selected: null,
    view: "browse",
    detailView: store.get("detailView", false),
    ui: { browseLeft: false, bookLeft: false, toc: false, ...store.get("ui", {}) },
    prayers: store.get("prayers", {}), // eigene Gebete je Zauber (göttliche Klassen)
  };
  I18N.configure(state.settings);
  I18N.apply();
  SCRIPTS.setMode(state.settings.scriptMode);
  const DIVINE = CLASS.tradition === "divine";
  VITRAIL.setMaterial(state.settings.material);
  document.body.classList.add(DIVINE ? "divine" : "arcane");
  const save = () => {
    store.set("settings", state.settings);
    store.set("book", [...state.book]);
    // Formelsprache hängt bei mehreren Stationen von der Verteilung über das ganze Buch ab
    if (FORMULA.stations().length > 1) ALL.forEach((x) => (x.t = null));
  };

  // --- Daten vorbereiten -----------------------------------------------------------
  const ALL = window.SPELLS.map((s) => ({ s, m: null, t: null }));
  const byId = new Map(ALL.map((x) => [x.s.id, x]));
  const model = (x) => (x.m = x.m || analyze(x.s));
  // Texte je Darstellung (Original-/Lateinschrift: nur das Band unterscheidet sich), damit das Zurückschalten nichts neu erzeugt.
  // x.t ist die Fassung der aktuellen Darstellung; x.t = null verwirft alle Fassungen.
  const texts = (x) => {
    const k = SCRIPTS.mode();
    if (!x.t) x.tc = null;
    else if (x.tk !== k) ((x.tc = { ...x.tc, [x.tk]: x.t }), (x.t = x.tc[k] || null));
    x.tk = k;
    return (x.t = x.t || (DIVINE ? PRAYER.texts(model(x), window.DEITY) : generateTexts(model(x), { name: PROFILE.bookValue(state.settings, "owner") })));
  };
  FORMULA.setBook(() => ALL.filter((x) => state.book.has(x.s.id)).map(model));
  ALL.forEach(model);
  ALL.forEach((x) => (x.title = texts(x).title));
  // Alltagszauber gehören zum Magierbuch, nicht zu einer Klassenliste: bei Magiern immer sichtbar, sonst nie
  const visible = () => ALL.filter((x) => (x.s.everyday ? CLASS.everyday : !state.settings.onlyClass || x.s.levels[CLASS.list] != null));

  // --- Filter ---------------------------------------------------------------------
  // Filterleisten: Verzeichnis (Präfix "") und Buch (Präfix "b")
  function initFilters() {
    for (const p of ["", "b"]) {
      const lv = $(`#${p}f-level`);
      for (const i of CLASS.grades) lv.insertAdjacentHTML("beforeend", `<option value="${i}">${$t("prep.grade", { g: i })}</option>`);
      if (!CLASS.everyday) $(`#${p}f-origin`).closest("select").hidden = true;
      const sc = $(`#${p}f-school`);
      for (const [k, v] of Object.entries(T.SCHOOLS)) sc.insertAdjacentHTML("beforeend", `<option value="${k}">${e(I18N.school(k))}</option>`);
      const es = $(`#${p}f-essence`);
      for (const x of T.ESSENCES) es.insertAdjacentHTML("beforeend", `<option value="${x.id}">${x.latin}${I18N.lang.ui === "de" ? " – " + x.de : ""}</option>`);
    }
    for (const id of ["#q", "#f-level", "#f-school", "#f-essence", "#f-inbook", "#f-origin"]) $(id).addEventListener("input", renderList);
    for (const id of ["#bq", "#bf-level", "#bf-school", "#bf-essence", "#bf-origin"]) $(id).addEventListener("input", renderBookList);
  }

  const readFilters = (p) => ({
    q: $(`#${p}q`).value.trim().toLowerCase(),
    lv: $(`#${p}f-level`).value,
    sc: $(`#${p}f-school`).value,
    es: $(`#${p}f-essence`).value,
    ib: $(`#${p}f-inbook`)?.value || "",
    og: $(`#${p}f-origin`).value,
  });

  function filterItems(list, f) {
    return list
      .filter((x) => {
        const m = x.m;
        if (f.lv !== "" && m.level !== +f.lv) return false;
        if (f.og && !!x.s.everyday !== (f.og === "everyday")) return false;
        if (f.sc && m.school !== f.sc) return false;
        if (f.es && !m.essences.some((y) => y.id === f.es && y.pct >= 15)) return false;
        if (f.ib !== "" && state.book.has(x.s.id) !== (f.ib === "1")) return false;
        if (f.q) {
          const hay = (x.s.name + " " + RULES.name(x.s) + " " + RULES.other(x.s) + " " + (x.s.base || "") + (x.s.everyday ? " alltag everyday" : "") + " " + x.title + " " + m.essences.map((y) => T.ESS[y.id].latin).join(" ") + " " + m.schoolInfo.de + " " + (m.combo || "")).toLowerCase();
          if (!f.q.split(/\s+/).every((w) => hay.includes(w))) return false;
        }
        return true;
      })
      .sort((a, b) => a.m.level - b.m.level || !!a.s.everyday - !!b.s.everyday || RULES.name(a.s).localeCompare(RULES.name(b.s), "de"));
  }
  const filtered = () => filterItems(visible(), readFilters(""));

  function listRow(x, opt = {}) {
    const m = x.m;
    const on = opt.remove || state.book.has(x.s.id);
    const btn = opt.remove
      ? `<button class="add on" title="${$t(DIVINE ? "list.removeBrev" : "list.remove")}">−</button>`
      : `<button class="add ${on ? "on" : ""}" title="${on ? $t(DIVINE ? "list.removeBrev" : "list.remove") : $t(DIVINE ? "list.addBrev" : "list.add")}">${on ? "✓" : "+"}</button>`;
    return `<li data-id="${x.s.id}" class="${state.selected === x.s.id && !opt.remove ? "sel" : ""}">
          <span class="lvl">${x.s.everyday ? "A" : m.level}</span>
          <span class="nm"><b>${e(RULES.name(x.s))}</b><i>${e(x.title)}</i></span>
          ${opt.page ? `<span class="pg" title="${$t("list.pageTitle")}">${$t("list.pageShort")} ${opt.page}</span>` : ""}
          <span class="ess" title="${e(m.essences.map((y) => T.ESS[y.id].latin + " " + y.pct + " %").join(", "))}">${quickGlyph(m)}</span>
          ${btn}
        </li>`;
  }

  function renderList() {
    const items = filtered();
    $("#list-info").textContent = $tn("list.count", items.length);
    const ul = $("#list");
    ul.innerHTML = items
      .slice(0, 600)
      .map((x) => listRow(x))
      .join("") + (items.length > 600 ? `<li class="more muted">${$t("list.more", { n: items.length - 600 })}</li>` : "");
  }

  $("#list").addEventListener("click", (ev) => {
    const li = ev.target.closest("li[data-id]");
    if (!li) return;
    const id = li.dataset.id;
    if (ev.target.closest(".add")) {
      toggleBook(id);
      return;
    }
    select(id);
    ROUTE.push(currentRoute());
  });

  // Formelsprache und Herkunft, bei aktiver Hausregel der Sprachenkunde-SG (nur in der App, nicht im Druck)
  function formulaFact(m) {
    const st = FORMULA.originOf(m), lang = FORMULA.langOf(m), dec = FORMULA.decipher(m, state.settings.knownLangs);
    if (lang.id === "latin" && FORMULA.stations().length < 2 && !dec) return "";
    const where = st.label ? ` <span class="muted">· ${e(st.label)}</span>` : "";
    return `<div class="formula-fact"><b>${$t("detail.formula")}</b> ${e(FORMULA.name(lang.id, I18N.lang.ui))}${where}${dec ? `<div class="decipher">${$t("detail.decipher", { dc: dec.dc })}</div>` : ""}</div>`;
  }

  function toggleBook(id) {
    if (state.book.has(id)) state.book.delete(id);
    else state.book.add(id);
    save();
    renderList();
    updateCount();
    if (state.selected === id) renderDetail();
  }

  function updateCount() {
    const n = state.book.size;
    $("#book-count").textContent = n ? `(${n})` : "";
  }

  // --- Detailansicht --------------------------------------------------------------
  function select(id) {
    state.selected = id;
    renderList();
    renderDetail();
  }

  function pageCount(m) {
    return m.level === 0 ? 0.5 : m.level;
  }

  function renderDetail() {
    const x = byId.get(state.selected);
    if (!x) return;
    if (DIVINE) return renderPrayerDetail(x);
    const m = model(x), t = texts(x);
    const inBook = state.book.has(x.s.id);
    const sp = BOOK.spellPages(m, t, { detail: state.detailView });
    const pages = sp.map((p, i) =>
      TYPESET.pageHTML({ html: p.half ? `<div class="half">${p.html}</div>` : p.html, spell: m.id, cls: p.first ? "first-page" : "", halves: p.half, no: "", running: t.title + (sp.length > 1 ? ` · ${i + 1}/${sp.length}` : "") })
    );
    $("#detail").innerHTML = `
      <div class="detail-head">
        <div>
          <h2>${e(RULES.name(x.s))}</h2>
          <div class="muted">${e(t.title)} · ${e(t.epithet)}${t.custom ? ` · <span class="badge">${$t("detail.custom")}</span>` : ""}</div>
        </div>
        <div class="row">
          <button id="d-add" class="${inBook ? "" : "primary"}">${inBook ? $t("list.remove") : $t("list.add")}</button>
          <label class="check toggle"><input type="checkbox" id="d-detail" ${state.detailView ? "checked" : ""}> ${$t("detail.detailView")}</label>
          <button id="d-print">${$t("detail.printOne")}</button>
          <button id="d-scroll">${$t("detail.printScroll")}</button>
        </div>
      </div>
      <div class="detail-grid">
        <div class="detail-side">
          <div class="facts">
            <div><b>${$t("detail.size")}</b> ${pageCount(m) === 0.5 ? $t("detail.half") : $tn("detail.pages", pageCount(m))}${state.detailView ? ` <span class="muted">(${$t("detail.detailPages", { n: sp.length })})</span>` : ""}</div>
            ${formulaFact(m)}
            <div><b>${$t("detail.essences")}</b></div>
            ${m.essences.map((y) => `<div class="essrow">${glyphSVG("essence", y.id, { s: 7, cls: y.id === m.primary ? "accent" : "" })}<span class="essname">${T.ESS[y.id].latin}</span><span class="essbar"><i style="width:${y.pct}%"></i></span><span class="esspct">${y.pct} %</span></div>`).join("")}
            ${m.combo ? `<div><b>${$t("detail.combo")}</b> ${e(m.combo)}</div>` : ""}
            ${m.signs.length ? `<div><b>${$t("detail.signs")}</b> ${m.signs.map((s) => e(s.de) + (s.dir === "in" ? " ↘" : " ↗")).join(", ")}</div>` : ""}
            <details class="why"><summary>${$t("detail.why")}</summary>${m.essences.map((y) => `<div><b>${T.ESS[y.id].latin}</b>: ${e(y.sources.join(", "))}</div>`).join("")}</details>
          </div>
          ${BOOK.rulesBox(m)}
        </div>
        <div class="pages preview">${pages.join("")}</div>
      </div>`;
    $("#d-add").onclick = () => toggleBook(x.s.id);
    $("#d-detail").onchange = (ev) => {
      state.detailView = ev.target.checked;
      store.set("detailView", state.detailView);
      renderDetail();
    };
    $("#d-print").onclick = () => printPages(pages.join(""), null, undefined, null, t.title);
    $("#d-scroll").onclick = () => printPages(BOOK.scrollPages(m, t, { paper: state.settings.scrollPaper }).map(TYPESET.pageHTML).join(""), state.settings.scrollPaper, undefined, null, $t("file.scroll") + " " + t.title);
    TYPESET.autofit($("#detail")); // kein (i): der Regelblock steht in der Verzeichnisansicht schon links daneben
  }

  // Detailansicht für göttliche Klassen: Brevierseite, Eigene Worte bearbeiten
  function renderPrayerDetail(x) {
    const m = model(x), t = texts(x);
    const inBook = state.book.has(x.s.id);
    const own = state.prayers[x.s.id] || "";
    const pages = BOOK.prayerPages(m, t, { own }).map((p) => TYPESET.pageHTML({ ...p, cls: "first-page", no: "", running: t.title }));
    $("#detail").innerHTML = `
      <div class="detail-head">
        <div>
          <h2>${e(RULES.name(x.s))}</h2>
          <div class="muted">${e(t.title)} · ${e(t.epithet)}${own ? ` · <span class="badge">${$t("detail.ownWords")}</span>` : ""}</div>
        </div>
        <div class="row">
          <button id="d-add" class="${inBook ? "" : "primary"}">${inBook ? $t("list.removeBrev") : $t("list.addBrev")}</button>
          <button id="d-print">${$t("detail.printPrayer")}</button>
        </div>
      </div>
      <div class="detail-grid">
        <div class="detail-side">
          <div class="facts">
            <div><b>${$t("set.char.deity")}</b> ${window.DEITY ? e(window.DEITY.name) : $t("detail.noDeity")}</div>
            <div><b>${$t("detail.essences")}</b></div>
            ${m.essences.map((y) => `<div class="essrow"><span class="swatch" style="background:${VITRAIL.withMaterial(window.DEITY, () => VITRAIL.essColor(y.id))}"></span><span class="essname">${T.ESS[y.id].latin}</span><span class="essbar"><i style="width:${y.pct}%"></i></span><span class="esspct">${y.pct} %</span></div>`).join("")}
            <details class="why"><summary>${$t("detail.why")} <span class="muted">(${$t("detail.whyFaith")})</span></summary>
              <p class="muted">${$t("detail.whyDeity", { deity: window.DEITY ? e(window.DEITY.name) : $t("detail.theDeity") })}</p>
              ${m.essences.map((y) => `<div><b>${T.ESS[y.id].latin}</b>: ${e(y.sources.join(", "))}</div>`).join("")}
            </details>
          </div>
          <label class="own-edit"><b>${$t("detail.ownWordsH")}</b> <span class="muted">(${$t("detail.ownWordsNote")})</span>
            <textarea id="d-own" rows="6" placeholder="${$t("detail.ownWordsPh")}">${e(own)}</textarea></label>
          ${BOOK.rulesBox(m)}
        </div>
        <div class="pages preview">${pages.join("")}</div>
      </div>`;
    $("#d-add").onclick = () => toggleBook(x.s.id);
    $("#d-print").onclick = () => printPages(pages.join(""), null, undefined, null, t.title);
    $("#d-own").onchange = (ev) => {
      const v = ev.target.value.replace(/\s+$/, "");
      if (v) state.prayers[x.s.id] = v;
      else delete state.prayers[x.s.id];
      store.set("prayers", state.prayers);
      renderDetail();
    };
    TYPESET.autofit($("#detail")); // kein (i): der Regelblock steht in der Verzeichnisansicht schon links daneben
  }

  // --- Buchansicht ----------------------------------------------------------------
  // Das ganze Buch wird nur zusammengesetzt (HTML-Strings), aber nie komplett gerendert:
  // Die Vorschau baut nur die Seiten der gerade sichtbaren Zauber auf und blättert in 1er- oder 2er-Schritten.
  function bookEntries() {
    return [...state.book]
      .map((id) => byId.get(id))
      .filter(Boolean)
      .sort((a, b) => BOOK.rank(a.m) - BOOK.rank(b.m) || a.title.localeCompare(b.title))
      .map((x) => ({ m: model(x), t: texts(x) }));
  }

  // Bände: bookAll() setzt alle Bände (bei einer Seitengrenze), bookData() liefert den gewählten Band
  // letzte Sätze je Schlüssel behalten (höchstens zwei, ältester fällt heraus)
  const keep = (map, c) => {
    map.delete(c.key);
    map.set(c.key, c);
    while (map.size > 2) map.delete(map.keys().next().value);
  };
  // bookCache: aktueller Satz; bookKeep hält die letzten (Umschalten der Schrift und zurück ohne Neusatz)
  let bookCache = null;
  const bookKeep = new Map();
  function bookAll() {
    const key = [...state.book].sort().join(",") + "|" + JSON.stringify(state.settings) + (DIVINE ? "|" + JSON.stringify(state.prayers) : "");
    if (bookCache && bookCache.key === key) return bookCache;
    if (bookCache) keep(bookKeep, bookCache);
    if (bookKeep.has(key)) {
      bookCache = bookKeep.get(key);
      view.rendered = null;
      return bookCache;
    }
    const entries = bookEntries();
    const { vols, warnings } = BOOK.volumes(entries, state.settings, visible().map((x) => x.m), { prayers: state.prayers });
    const strip = (h) => h.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
    const pageBySpell = new Map(); // id → { vol, page }
    const volumes = vols.map((r, vi) => {
      // Einheiten: alle Seiten eines Zaubers gehören zusammen (Seitenfüllung verschiebt Blöcke zwischen ihnen)
      const units = [];
      r.pages.forEach((p, i) => {
        const last = units[units.length - 1];
        if (p.spell && last && last.spell === p.spell) last.n++;
        else units.push({ spell: p.spell || null, start: i, n: 1 });
      });
      r.toc.forEach((x) => pageBySpell.set(x.m.id, { vol: vi, page: x.page }));
      // Vorspann fürs Inhaltsverzeichnis: Titel jeder Seite bis zur ersten Formel (Fortsetzungsseiten zusammengefasst)
      const front = [];
      for (const p of r.pages) {
        if (p.spell || p.halves || /chapter-page|chapter-list/.test(p.cls || "")) break; // Kapitel gehören nicht zum Vorspann
        const h = /<h[123][^>]*>([\s\S]*?)<\/h[123]>/.exec(p.html);
        const title = /title-page/.test(p.cls || "") ? I18N.b("book.titlePage") : h ? strip(h[1]) : null;
        if (title && title !== front[front.length - 1]?.title) front.push({ title, page: p.no });
      }
      const idxByNo = new Map(r.pages.map((p, i) => [p.no, i]));
      // Seitenindizes, an denen ein Zauber beginnt (für „vorheriger/nächster Zauber“)
      const starts = [...new Set(r.toc.map((x) => idxByNo.get(x.page)))].filter((i) => i != null).sort((x, y) => x - y);
      return { ...r, vi, units, front, starts, idxByNo };
    });
    bookCache = { key, entries, volumes, warnings, pageBySpell };
    view.rendered = null;
    return bookCache;
  }
  function bookData() {
    const all = bookAll();
    if (view.vol >= all.volumes.length) view.vol = all.volumes.length - 1;
    return all.volumes[view.vol];
  }
  // Seitenangabe mit Band, sobald es mehrere gibt („II·34“)
  const volPage = (vi, page) => (bookAll().volumes.length > 1 ? `${U.ROMAN[vi + 1]}·${page}` : String(page));
  function selectVol(vi) {
    if (vi === view.vol) return;
    view.vol = vi;
    bookViewer.pos = 0;
    view.rendered = null;
    store.set("bookVol", vi);
    renderBook();
  }

  // Position: g = Index der ersten sichtbaren Seite (über alle Seiten, der Regelanhang zählt nach dem Rendern mit)
  const view = { g: store.get("bookPos", 0), vol: store.get("bookVol", 0), rendered: null, nav: null };
  const unitAt = (d, g) => {
    for (let i = d.units.length - 1; i >= 0; i--) if (g >= d.units[i].start) return i;
    return 0;
  };

  function renderBook() {
    const all = bookAll(), vols = all.volumes;
    bookData(); // gewählten Band begrenzen
    // Summen über alle Bände
    const sum = (k) => vols.reduce((a, v) => a + (v[k] || 0), 0);
    const d = { spellPagesCount: sum("spellPagesCount"), chapterPages: sum("chapterPages"), fillers: sum("fillers"), expanded: sum("expanded"), pages: vols.reduce((a, v) => a + v.pages.length, 0) };
    const byLevel = {};
    const lvKey = (m) => (BOOK.chapterKey(m) === "foreign" ? "F" : m.spell.everyday ? "A" : m.level);
    all.entries.forEach(({ m }) => (byLevel[lvKey(m)] = (byLevel[lvKey(m)] || 0) + 1));
    $("#book-stats").innerHTML = all.entries.length
      ? `${$t(DIVINE ? "stats.bookPrayers" : "stats.bookFormulae", { n: all.entries.length, p: d.spellPagesCount })}${d.chapterPages ? " · " + $t("stats.bookChapters", { n: d.chapterPages }) : ""}${d.fillers ? " · " + $tn("stats.bookFillers", d.fillers) : ""}${d.expanded ? " · " + $t("stats.bookExpanded", { n: d.expanded }) : ""} · ${$t("stats.bookTotal", { n: d.pages })}
         ${DIVINE ? "" : `<span class="muted">(${$t("stats.bookCompare")})</span>`}
         ${vols.length > 1 ? `<div>${$t("stats.bookVols", { n: vols.length, list: vols.map((v) => `${U.ROMAN[v.no]} ${v.pages.length}`).join(" · ") })}</div>` : ""}
         ${all.warnings.map((w) => `<div class="warn">${e(w)}</div>`).join("")}
         <div class="muted">${Object.entries(byLevel).map(([l, n]) => (l === "A" ? $t("stats.everyday") : l === "F" ? $t("stats.foreign") : $t("prep.grade", { g: l })) + ": " + n).join(" · ")}</div>`
      : $t(DIVINE ? "stats.brevEmpty" : "stats.bookEmpty");
    // Bandwahl über der Vorschau, nur bei mehreren Bänden
    const tabs = $("#book-vols");
    tabs.hidden = vols.length < 2;
    tabs.innerHTML = vols.length < 2 ? "" : vols.map((v, i) => `<button data-vol="${i}" class="${i === view.vol ? "on" : ""}" title="${e(v.label)} · ${$tn("detail.pages", v.pages.length)}">${$t("book.vol", { r: U.ROMAN[v.no] })}<span class="muted">${e(v.label)}</span></button>`).join("");
    $("#btn-print-book").textContent = vols.length > 1 ? $t("book.printVol", { r: U.ROMAN[view.vol + 1] }) : $t("book.print");
    renderBookList();
    renderBookToc();
    showSpread();
  }

  // Vorschau über den gemeinsamen Seitenbetrachter: gesetzt werden nur die Zauber um die aktuelle Position
  // (alle Seiten eines Zaubers, damit die Seitenfüllung dem Druck entspricht)
  function bookEnsure(a, b) {
    const d = bookData();
    const root = $("#book-pages");
    if (!d.pages.length) {
      root.innerHTML = "";
      view.rendered = null;
      return null;
    }
    const u0 = unitAt(d, a), u1 = unitAt(d, b);
    const want = view.vol + ":" + u0 + "-" + u1;
    if (view.rendered === want) return null;
    view.rendered = want;
    const start = d.units[u0].start;
    root.innerHTML = d.pages.slice(start, d.units[u1].start + d.units[u1].n).map((p, i) => TYPESET.pageHTML(p).replace("<section ", `<section data-idx="${start + i}" `)).join("");
    root.classList.add("fitting");
    return TYPESET.autofit(root).then(() => {
      if (view.rendered !== want) return;
      root.classList.remove("fitting");
      addRulesButtons(root);
    });
  }
  const bookViewer = VIEWER.create({
    root: $("#book-pages"),
    pager: $("#book-pager"),
    name: "book",
    active: () => state.view === "book",
    count: () => bookData().pages.length,
    pageNo: (i) => bookData().pages[i]?.no || i + 1,
    indexOfNo: (no) => bookData().pages.findIndex((p) => p.no === no),
    units: () => ({ starts: bookData().starts, prev: $t("pager.prevSpell"), next: $t("pager.nextSpell") }),
    ensure: bookEnsure,
    pos: { get: () => view.g, set: (v) => ((view.g = v), store.set("bookPos", v)) },
    onShow: () => state.view === "book" && viewWrite(),
    extra: () => `<button id="book-toc-toggle" class="${state.ui.toc ? "on" : ""}" title="${$t("side.tocRight")}">${$t("book.toc")}</button>`,
  });
  const showSpread = () => bookViewer.show();
  $("#book-pager").addEventListener("click", (ev) => {
    if (ev.target.closest("#book-toc-toggle")) toggleSide("toc");
  });
  function gotoPageNo(no, vol = view.vol) {
    const switching = vol !== view.vol;
    if (switching) {
      view.vol = vol;
      view.rendered = null;
      store.set("bookVol", vol);
    }
    const d = bookData();
    const i = d.pages.findIndex((p) => p.no === no);
    bookViewer.pos = i >= 0 ? i : no > (d.pages[d.pages.length - 1]?.no || 0) ? d.pages.length - 1 : 0;
    switching ? renderBook() : bookViewer.show();
  }

  // Filterbare Liste der Buchzauber (wie das Verzeichnis, mit − statt +)
  function renderBookList() {
    const all = bookAll();
    const items = filterItems([...state.book].map((id) => byId.get(id)).filter(Boolean), readFilters("b"));
    $("#book-list-info").textContent = $t(DIVINE ? "list.ofBrev" : "list.ofBook", { a: items.length, b: all.entries.length });
    const pg = (id) => {
      const p = all.pageBySpell.get(id);
      return p && volPage(p.vol, p.page);
    };
    $("#book-list").innerHTML = items.map((x) => listRow(x, { remove: true, page: pg(x.s.id) })).join("");
  }
  $("#book-list").addEventListener("click", (ev) => {
    const li = ev.target.closest("li[data-id]");
    if (!li) return;
    const id = li.dataset.id;
    if (ev.target.closest(".add")) {
      state.book.delete(id);
      save();
      updateCount();
      renderList();
      renderBook();
      return;
    }
    const p = bookAll().pageBySpell.get(id);
    if (!p) return;
    ROUTE.mark();
    gotoPageNo(p.page, p.vol);
  });

  // Inhaltsverzeichnis rechts: Akkordeon, Abschnitte zu Beginn eingeklappt
  const tocOpen = new Set();
  function renderBookToc() {
    const all = bookAll(), many = all.volumes.length > 1;
    const groups = [];
    const add = (name, li) => {
      if (!groups.length || groups[groups.length - 1].name !== name) groups.push({ name, items: [] });
      groups[groups.length - 1].items.push(li);
    };
    for (const d of all.volumes) {
      const at = (page) => `data-vol="${d.vi}" data-page="${page}"`;
      const pg = (page) => volPage(d.vi, page);
      const frontName = many ? `${$t("book.vol", { r: U.ROMAN[d.no] })} · ${d.no === 1 ? $t("toc.front") : $t("toc.title")}` : $t("toc.front");
      d.front.forEach((x) => add(frontName, `<li ${at(x.page)}><span class="q"></span><span class="nm"><b>${e(x.title)}</b></span><span class="pg">${pg(x.page)}</span></li>`));
      const chapterPage = new Map((d.chapters || []).map((c) => [c.name, c.page]));
      let first = true;
      d.toc.forEach((x) => {
        const gr = BOOK.chapterName(BOOK.chapterKey(x.m));
        if (chapterPage.has(gr) && (first || groups[groups.length - 1].name !== gr))
          add(gr, `<li ${at(chapterPage.get(gr))} class="toc-chapter"><span class="q"></span><span class="nm"><b>${$t("toc.chapterPage")}${many && first && d.no > 1 && groups.some((g) => g.name === gr) ? ` (${$t("toc.cont")})` : ""}</b></span><span class="pg">${pg(chapterPage.get(gr))}</span></li>`);
        first = false;
        add(gr, `<li ${at(x.page)}><span class="q">${quickGlyph(x.m)}</span><span class="nm"><b>${e(x.t.title)}</b><i>${e(RULES.name(x.m))}</i></span><span class="pg">${pg(x.page)}</span></li>`);
      });
    }
    $("#book-toc-list").innerHTML = groups.map((g) => `<li class="toc-group ${tocOpen.has(g.name) ? "open" : ""}" data-grp="${e(g.name)}">
        <button class="toc-grade"><span>${e(g.name)}</span><span class="muted">${g.items.filter((x) => !x.includes("toc-chapter")).length}</span></button>
        <ul>${g.items.join("")}</ul></li>`).join("");
  }
  $("#book-toc-list").addEventListener("click", (ev) => {
    const head = ev.target.closest(".toc-grade");
    if (head) {
      const grp = head.parentElement;
      grp.classList.toggle("open");
      grp.classList.contains("open") ? tocOpen.add(grp.dataset.grp) : tocOpen.delete(grp.dataset.grp);
      return;
    }
    const li = ev.target.closest("li[data-page]");
    if (!li) return;
    ROUTE.mark();
    gotoPageNo(+li.dataset.page, +(li.dataset.vol || 0));
  });

  // Regeltext auf Abruf: (i) an jedem Zauberkopf der Vorschau
  function addRulesButtons(root) {
    root.querySelectorAll(".sp-head").forEach((h) => {
      const id = h.closest("[data-spell]")?.dataset.spell;
      if (!id || h.querySelector(".rules-i")) return;
      h.insertAdjacentHTML("beforeend", `<button class="rules-i" data-spell="${e(id)}" title="${$t("book.showRules")}">i</button>`);
      tintToPage(h.querySelector(".rules-i"));
      // ausführliche Fassung dieses Zaubers, wenn das Buch in der kurzen gesetzt ist
      if (!DIVINE && !state.settings.detailPrint) {
        h.insertAdjacentHTML("beforeend", `<button class="rules-i full-i" data-spell="${e(id)}" title="${$t("book.showFull")}">+</button>`);
        tintToPage(h.querySelector(".full-i"));
      }
    });
  }

  // Hinterlegung des (i) mit gleichem Farbabstand zur Umgebung, egal wo auf der Seite:
  // lokale Pergamentfarbe aus dem Verlauf berechnen und einen festen Versatz im Lab-Raum addieren.
  const hex = (c) => (c = c.trim().replace("#", ""), [0, 2, 4].map((i) => parseInt(c.slice(i, i + 2), 16)));
  const lin = (v) => ((v /= 255) <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  const unlin = (v) => 255 * (v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055);
  const WHITE = [0.95047, 1, 1.08883];
  function toLab(rgb) {
    const [r, g, b] = rgb.map(lin);
    const xyz = [0.4124 * r + 0.3576 * g + 0.1805 * b, 0.2126 * r + 0.7152 * g + 0.0722 * b, 0.0193 * r + 0.1192 * g + 0.9505 * b];
    const [fx, fy, fz] = xyz.map((v, i) => ((v /= WHITE[i]) > 216 / 24389 ? Math.cbrt(v) : (24389 / 27 * v + 16) / 116));
    return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
  }
  function fromLab([L, a, bb]) {
    const fy = (L + 16) / 116, fx = fy + a / 500, fz = fy - bb / 200;
    const [x, y, z] = [fx, fy, fz].map((f, i) => (f ** 3 > 216 / 24389 ? f ** 3 : (116 * f - 16) / (24389 / 27)) * WHITE[i]);
    const rgb = [3.2406 * x - 1.5372 * y - 0.4986 * z, -0.9689 * x + 1.8758 * y + 0.0415 * z, 0.0557 * x - 0.204 * y + 1.057 * z];
    return rgb.map((v) => Math.round(Math.max(0, Math.min(255, unlin(v)))));
  }
  // Farbe des Seitenhintergrunds an Position (u, v) ∈ [0,1]²: radial-gradient(ellipse at center, transparent 60%, edge 100%)
  function parchAt(page, u, v) {
    const cs = getComputedStyle(page);
    const base = hex(cs.getPropertyValue("--parch")), edge = hex(cs.getPropertyValue("--parch-edge"));
    const t = Math.hypot((u - 0.5) / (0.5 * Math.SQRT2), (v - 0.5) / (0.5 * Math.SQRT2)); // Ellipse „farthest-corner“
    const f = Math.max(0, Math.min(1, (t - 0.6) / 0.4));
    return base.map((c, i) => c + f * (edge[i] - c));
  }
  let tintOffset = null;
  function tintToPage(btn) {
    const page = btn.closest(".page");
    if (!page) return;
    if (!tintOffset) {
      // Vorbild: das (i) oben links auf einer ganzen Seite mit der Pergamentfarbe als Hintergrund
      const ref = toLab(parchAt(page, 15.4 / 148, 14.6 / 210)), want = toLab(hex(getComputedStyle(page).getPropertyValue("--parch")));
      tintOffset = want.map((x, i) => x - ref[i]);
    }
    const pr = page.getBoundingClientRect(), br = btn.getBoundingClientRect();
    if (!pr.width || !br.width) return;
    const local = toLab(parchAt(page, (br.left + br.width / 2 - pr.left) / pr.width, (br.top + br.height / 2 - pr.top) / pr.height));
    btn.style.background = `rgb(${fromLab(local.map((x, i) => x + tintOffset[i])).join(",")})`;
  }
  document.addEventListener("click", (ev) => {
    const b = ev.target.closest(".full-i");
    if (!b) return;
    const x = byId.get(b.dataset.spell);
    if (x) openFull(x);
  });
  // Ausführliche Fassung eines Zaubers im Fenster (wie Detailansicht im Katalog), ohne das Buch umzustellen
  function openFull(x) {
    const m = model(x), t = texts(x);
    const sp = BOOK.spellPages(m, t, { detail: true });
    const pages = sp.map((p, i) =>
      TYPESET.pageHTML({ html: p.half ? `<div class="half">${p.html}</div>` : p.html, spell: m.id, cls: p.first ? "first-page" : "", halves: p.half, no: "", running: t.title + (sp.length > 1 ? ` · ${i + 1}/${sp.length}` : "") })
    );
    const dlg = $("#full-modal");
    dlg.querySelector(".fm-head").innerHTML = `<h3>${e(t.title)}</h3><div class="muted">${e(t.epithet)} · ${e(RULES.name(x.s))} · ${$tn("detail.pages", sp.length)}</div>`;
    dlg.querySelector(".fm-print").onclick = () => { dlg.close(); printPages(pages.join(""), null, undefined, null, t.title); };
    const root = $("#full-pages");
    root.innerHTML = pages.join("");
    root.classList.add("fitting");
    dlg.style.width = "";
    if (!dlg.open) dlg.showModal();
    // Adresse …/<id>/full; der Eintrag merkt sich, dass die App ihn angelegt hat (Schließen = Zurück)
    fullId = x.s.id;
    ROUTE.push(currentRoute(), { full: true });
    // Satz bei voller Größe, danach blättern wie im Buch (Vorder- und Rückseite nebeneinander)
    TYPESET.autofit(root).then(() => {
      root.classList.remove("fitting");
      fullViewer.show(0);
    });
  }
  const fullViewer = VIEWER.create({
    root: $("#full-pages"),
    pager: $("#full-pager"),
    name: "full",
    active: () => $("#full-modal").open,
    count: () => $("#full-pages").querySelectorAll(":scope > .page").length,
    pageNo: (i) => i + 1,
    flat: () => true,
    // Fenster nicht breiter als die gezeigten Seiten (eine oder zwei)
    onShow: () => {
      const dlg = $("#full-modal"), root = $("#full-pages");
      const vis = [...root.querySelectorAll(":scope > .page:not(.offstage), :scope > .page-ghost")].map((p) => p.getBoundingClientRect());
      if (!vis.length) return;
      const w = Math.max(...vis.map((r) => r.right)) - Math.min(...vis.map((r) => r.left));
      const need = Math.ceil(w + (dlg.offsetWidth - root.clientWidth) + 24);
      if (need < dlg.offsetWidth) dlg.style.width = need + "px";
    },
  });
  // Schließen (✕, Escape, Drucken): selbst angelegten Verlaufseintrag zurücknehmen, sonst nur /full streichen.
  // Hat die Adresse das Fenster geschlossen (Zurück), bleibt der Verlauf, wie er ist.
  $("#full-modal").addEventListener("close", () => {
    fullId = null;
    if (fullRouteClose) return void (fullRouteClose = false);
    if (history.state && history.state.full) history.back();
    else ROUTE.write(currentRoute());
  });
  // vor Zoom und Größenänderung volle Breite, damit der Betrachter neu entscheidet, ob zwei Seiten passen
  $("#full-pager").addEventListener("click", () => ($("#full-modal").style.width = ""), true);
  window.addEventListener("resize", () => ($("#full-modal").style.width = ""));
  document.addEventListener("click", (ev) => {
    const b = ev.target.closest(".rules-i");
    if (!b || b.classList.contains("full-i")) return;
    const x = byId.get(b.dataset.spell);
    if (!x) return;
    const dlg = $("#rules-modal");
    dlg.querySelector(".rm-body").innerHTML = BOOK.rulesBox(model(x));
    dlg.showModal();
  });

  $("#btn-legal").addEventListener("click", () => $("#legal-modal").showModal());

  // Ein- und ausklappbare Seitenleisten
  function applySides() {
    $("#view-browse .filters").classList.toggle("collapsed", !!state.ui.browseLeft);
    $("#book-side").classList.toggle("collapsed", !!state.ui.bookLeft);
    $("#book-toc").classList.toggle("collapsed", !state.ui.toc);
    $("#book-toc-toggle")?.classList.toggle("on", !!state.ui.toc);
    $("#primer-side").classList.toggle("collapsed", !!state.ui.primerTocOff);
    $("#vm-side").classList.toggle("collapsed", !!state.ui.primerTocOff);
    $("#prep-side").classList.toggle("collapsed", !!state.ui.devotionLeft);
  }
  function toggleSide(k) {
    state.ui[k] = !state.ui[k];
    store.set("ui", state.ui);
    applySides();
    if (state.view === "book") showSpread();
    if (state.view === "theory") showLehre();
    if (state.view === "prepare") PREP.render();
  }
  document.querySelectorAll(".side-toggle").forEach((b) => (b.onclick = () => toggleSide(b.dataset.side)));

  // „Vom Gebet“ (göttliche Klassen): Theorie-Seiten im Seitenbetrachter. Bei Magiern stehen sie im Buch-Vorspann.
  const theoryViewer = VIEWER.create({
    root: $("#theory-pages"),
    pager: $("#theory-pager"),
    name: "theory",
    active: () => state.view === "theory" && !$("#theory-view").hidden,
    count: () => $("#theory-pages").querySelectorAll(":scope > .page").length,
    pageNo: (i) => i + 1,
    ensure: () => {
      const root = $("#theory-pages");
      if (root.innerHTML) return null;
      const pages = BOOK.frontMatter(state.settings, visible().map((x) => x.m)).slice(1);
      root.innerHTML = pages.map((p, i) => TYPESET.pageHTML({ ...p, no: i + 1, running: I18N.b("book.onPrayer") })).join("");
      root.classList.add("fitting");
      return TYPESET.autofit(root).then(() => root.classList.remove("fitting"));
    },
    pos: { get: () => store.get("theoryPos", 0), set: (v) => store.set("theoryPos", v) },
    onShow: () => state.view === "theory" && viewWrite(),
  });

  // --- Lehrheft (Reiter „Lehre“) ---------------------------------------------------
  let primerCache = null, primerRendered = null;
  const primerKeep = new Map();
  function primerData() {
    const key = [...state.book].sort().join(",") + "|" + JSON.stringify(state.settings);
    if (primerCache && primerCache.key === key) return primerCache;
    if (primerCache) keep(primerKeep, primerCache);
    if (primerKeep.has(key)) return (primerCache = primerKeep.get(key));
    primerCache = { key, ...PRIMER_BOOK.build({ entries: bookEntries(), settings: state.settings }) };
    return primerCache;
  }
  // Reiter „Lehre“: Magier sehen direkt das Lehrheft, göttliche Klassen „Vom Gebet“. Mit Gottheit wählt eine
  // Umschaltleiste zwischen diesem und dem Vademecum (je Charakter gemerkt).
  const hasVm = () => !!(window.DEITY && window.VADEMECUM_BOOK);
  function showLehre() {
    const vm = hasVm() && store.get("lehreView", "main") === "vademecum";
    const sw = $("#lehre-switch");
    sw.hidden = !hasVm();
    sw.querySelector('[data-lehre="main"]').textContent = $t(DIVINE ? "lehre.mainDivine" : "lehre.main");
    sw.querySelectorAll("button").forEach((b) => b.classList.toggle("on", (b.dataset.lehre === "vademecum") === vm));
    $("#vademecum-view").hidden = !vm;
    // Ziel aus der Adresse (Teil/Lektion), nur einmal
    const go = lehreGo || {};
    lehreGo = null;
    if (vm) {
      $("#theory-view").hidden = $("#primer-view").hidden = true;
      return renderVm(go);
    }
    const primer = !DIVINE && !!window.PRIMER_BOOK;
    $("#theory-view").hidden = primer;
    $("#primer-view").hidden = !primer;
    primer ? renderPrimer(go) : theoryViewer.show();
  }
  $("#lehre-switch").addEventListener("click", (ev) => {
    const b = ev.target.closest("button[data-lehre]");
    if (!b) return;
    ROUTE.mark();
    store.set("lehreView", b.dataset.lehre);
    showLehre();
  });
  // Gesetzt wird das ganze Heft auf einmal: fortlaufende Seitenzahlen und Seitenlage wie im Druck
  const primerEls = { pages: [], starts: [], lessons: [] };
  function primerEnsure() {
    const d = primerData();
    if (primerRendered === d.key) return null;
    const want = (primerRendered = d.key);
    const root = $("#primer-pages");
    root.innerHTML = "";
    root.classList.add("fitting");
    $("#primer-info").textContent = $t("pager.busy");
    return TYPESET.typeset(root, d.parts.flatMap((p) => p.pages), (n, total) => primerRendered === want && ($("#primer-info").textContent = `${$t("pager.busy")} ${n}/${total}`)).then(() => {
      if (primerRendered !== want) return;
      root.classList.remove("fitting");
      primerEls.pages = [...root.querySelectorAll(":scope > .page")];
      // Seiten, auf denen eine Lektion beginnt (für „vorige/nächste Lektion“)
      primerEls.starts = [...new Set([...root.querySelectorAll(".lesson[data-lesson]:not([data-split-of])")].map((l) => primerEls.pages.indexOf(l.closest(".page"))))].sort((a, b) => a - b);
      primerEls.lessons = lessonIndex(root, primerEls.pages, partOf);
      $("#primer-info").textContent = `${d.title} · ${$tn("detail.pages", primerEls.pages.length)}`;
    });
  }
  const partOf = (pg) => [...(pg?.classList || [])].find((c) => c.startsWith("part-"))?.slice(5);
  const primerViewer = VIEWER.create({
    root: $("#primer-pages"),
    pager: $("#primer-pager"),
    name: "primer",
    active: () => state.view === "theory" && !$("#primer-view").hidden,
    count: () => primerEls.pages.length,
    pageNo: (i) => primerEls.pages[i]?.querySelector(".page-foot span:last-child").textContent || i + 1,
    units: () => ({ starts: primerEls.starts, prev: $t("pager.prevLesson"), next: $t("pager.nextLesson") }),
    ensure: primerEnsure,
    pos: { get: () => store.get("primerPos", 0), set: (v) => store.set("primerPos", v) },
    // Verzeichnis folgt dem Blättern
    onShow: (a, b) => {
      const cur = partOf(primerEls.pages[b]);
      if (!cur) return;
      primerToc.mark(cur);
      if (cur !== state.ui.primerPart) {
        state.ui.primerPart = cur;
        store.set("ui", state.ui);
      }
      if (state.view === "theory") viewWrite();
    },
  });
  const primerToc = VIEWER.toc($("#primer-toc"), {
    current: state.ui.primerPart,
    sections: () =>
      primerData().parts.map((p) => ({
        id: p.id,
        title: p.title,
        items: p.lessons.map((L) => ({ attrs: `data-part="${e(p.id)}" data-lesson="${e(L.id)}"`, html: `<span class="no">${e(L.label)}</span><span class="nm"><b>${e(L.title)}</b></span>` })),
      })),
    // Überschrift: aufklappen und zum Anfang des Teils blättern; erneuter Klick klappt zu
    onHead: (id, grp, toggle) => {
      const opening = !grp.classList.contains("open");
      toggle(opening);
      if (opening) ROUTE.mark(), renderPrimer({ part: id });
    },
    onPick: (li) => (ROUTE.mark(), renderPrimer({ part: li.dataset.part, lesson: li.dataset.lesson })),
  });
  async function renderPrimer(go = {}) {
    const d = primerData();
    $("#primer-toc-title").textContent = d.title;
    primerToc.render();
    const p = primerEnsure();
    if (p) {
      $("#primer-pager").innerHTML = "";
      await p;
      if (primerRendered !== d.key) return;
    }
    // zur Seite der gewählten Lektion oder zum Anfang des Teils blättern
    const root = $("#primer-pages");
    const target = (go.lesson && root.querySelector(`[data-lesson="${CSS.escape(go.lesson)}"]`)) || (go.part && root.querySelector(`:scope > .page.part-${CSS.escape(go.part)}:not(.blank)`));
    primerViewer.show(target ? primerEls.pages.indexOf(target.closest(".page")) : primerViewer.pos);
  }
  $("#btn-print-checks").onclick = () => printJob("checks");
  $("#btn-print-primer").onclick = () => printJob("primer");

  // --- Vademecum (Reiter „Lehre“, nur mit Gottheit) ----------------------------------
  // Jede Hälfte hat eigene Seiten, eigenen Betrachter und eigene Seitenzahlen; die Mitte steht am Ende beider
  // Hälften (in der zweiten kopfüber). Gesetzt werden beide Hälften auf einmal, danach die Verweise aufgelöst.
  let vmCache = null, vmRendered = null;
  const vmKeep = new Map();
  function vmData() {
    const key = [...state.book].sort().join(",") + "|" + JSON.stringify(state.settings) + "|" + (window.DEITY ? DEITY.id : "");
    if (vmCache && vmCache.key === key) return vmCache;
    if (vmCache) keep(vmKeep, vmCache);
    if (vmKeep.has(key)) return (vmCache = vmKeep.get(key));
    vmCache = { key, ...VADEMECUM_BOOK.build({ deity: window.DEITY, entries: bookEntries(), settings: state.settings }) };
    return vmCache;
  }
  // Seiten einer Hälfte: ihre Teile, dann die Mitte. Gemeinsame Mitte: in der ersten Hälfte aufrecht, in der zweiten
  // kopfüber (gegenüber, .vm-mid-foreign). Eigene Mitte je Hälfte: die eigene aufrecht, danach die der anderen Hälfte
  // kopfüber als gegenüberliegende Seite (ohne Anker, im Druck nicht doppelt).
  function vmPages(d, i) {
    const h = d.halves[i];
    const pages = h.parts.flatMap((p) => p.pages);
    if (!d.middle) return pages;
    const mid = (pg, foreign, anchor) => ({ ...pg, cls: pg.cls + " vm-mid half-" + h.key + (foreign ? " vm-mid-foreign upside-down" : ""), html: anchor ? pg.html.replace("<h3>", `<h3 data-anchor="${e(h.key)}/middle">`) : pg.html.replace(/ data-anchor="[^"]*"/g, "") });
    if (d.middle.shared) pages.push(mid(d.middle.pages[0], i === 1, true));
    else pages.push(mid(d.middle.pages[i], false, true), mid(d.middle.pages[1 - i], true, false));
    return pages;
  }
  // Eigene Mitte je Hälfte: sie steht links (gerade Seitenzahl), damit beide Mitten im gebundenen Buch einander
  // gegenüberliegen; sonst eine Vakatseite davor. Die gegenüberliegende Kopie trägt die Seitenzahl der anderen Hälfte.
  function vmPadMiddle(d, roots) {
    if (!d.middle || d.middle.shared) return;
    const foot = (pg) => pg.querySelector(".page-foot span:last-child");
    roots.forEach((root) => {
      const own = root.querySelector(":scope > .page.vm-mid:not(.vm-mid-foreign)");
      if (!own || +foot(own).textContent % 2 === 0) return;
      const blank = own.cloneNode(false);
      blank.classList.remove("vm-mid", "vm-middle", "flow");
      blank.classList.add("blank", "vm-mid-pad");
      blank.innerHTML = `<div class="page-inner"></div><footer class="page-foot"><span></span><span></span></footer>`;
      own.before(blank);
      let no = +foot(own).textContent;
      foot(blank).textContent = no;
      for (let pg = own; pg; pg = pg.nextElementSibling) foot(pg).textContent = ++no;
      root.querySelectorAll(":scope > .page.bind").forEach((pg) => pg.classList.toggle("verso", +foot(pg).textContent % 2 === 0));
    });
    roots.forEach((root, i) => {
      const f = root.querySelector(":scope > .page.vm-mid-foreign");
      const o = roots[1 - i]?.querySelector(":scope > .page.vm-mid:not(.vm-mid-foreign)");
      if (f && o) foot(f).textContent = foot(o).textContent;
    });
  }
  const vmRoot = (i) => $("#vm-pages-" + i);
  const vmEls = [{ pages: [], starts: [], lessons: [] }, { pages: [], starts: [], lessons: [] }];
  const vmHalf = () => Math.min(+store.get("vmHalf", 0) || 0, (vmCache && vmCache.halves.length - 1) || 0);
  const pageNoOf = (el) => el.closest(".page").querySelector(".page-foot span:last-child").textContent;
  // Anker → Seite: in der eigenen Hälfte nur die Zahl, in der anderen mit dem Zeichen der Hälfte
  function vmResolve(d, roots) {
    const at = new Map();
    roots.forEach((root, i) => {
      // Fortsetzungen geteilter Abschnitte tragen den Anker als Klon (data-split-of): nicht sie, aber was darin steht
      for (const el of root.querySelectorAll("[data-anchor]")) if (!el.dataset.splitOf && !at.has(el.dataset.anchor)) at.set(el.dataset.anchor, { i, no: pageNoOf(el) });
    });
    roots.forEach((root, i) => VADEMECUM_BOOK.resolveRefs(root, (ref) => {
      const x = at.get(ref);
      return x ? { no: x.no, mark: x.i !== i ? d.halves[x.i].mark : "" } : null;
    }));
  }
  async function vmTypeset(d, roots, onProgress) {
    const all = d.halves.map((h, i) => vmPages(d, i));
    const total = all.reduce((a, l) => a + l.length, 0);
    let done = 0;
    for (let i = 0; i < d.halves.length; i++) {
      for (const [k, v] of Object.entries(d.style)) roots[i].style.setProperty(k, v);
      await TYPESET.typeset(roots[i], all[i], (n) => onProgress && onProgress(done + n, total));
      done += all[i].length;
    }
    vmPadMiddle(d, roots.slice(0, d.halves.length));
    vmResolve(d, roots.slice(0, d.halves.length));
  }
  function vmEnsure() {
    const d = vmData();
    if (vmRendered === d.key) return null;
    const want = (vmRendered = d.key);
    const roots = [0, 1].map(vmRoot);
    roots.forEach((r) => { r.innerHTML = ""; r.removeAttribute("style"); r.classList.add("fitting"); });
    // beide Hälften messbar machen: in einem verborgenen Behälter (hidden) misst der Browser alle Höhen als 0
    const halves = [...document.querySelectorAll("#vademecum-view .vm-half")];
    halves.forEach((el) => (el.hidden = false));
    const restore = () => halves.forEach((el) => (el.hidden = +el.dataset.half !== vmHalf()));
    $("#vm-info").textContent = $t("pager.busy");
    return vmTypeset(d, roots, (n, total) => vmRendered === want && ($("#vm-info").textContent = `${$t("pager.busy")} ${n}/${total}`)).then(() => {
      restore();
      if (vmRendered !== want) return;
      roots.forEach((root, i) => {
        root.classList.remove("fitting");
        vmEls[i].pages = [...root.querySelectorAll(":scope > .page")];
        vmEls[i].starts = [...new Set([...root.querySelectorAll(".vm-ch, .lesson[data-lesson]:not([data-split-of])")].map((l) => vmEls[i].pages.indexOf(l.closest(".page"))))].sort((a, b) => a - b);
        vmEls[i].lessons = lessonIndex(root, vmEls[i].pages, vmPartOf);
      });
      // gemerkte Seite je Hälfte (Schlüssel der Hälfte steht erst jetzt fest)
      vmViewers.forEach((v, k) => d.halves[k] && (v.pos = +store.get("vmPos." + d.halves[k].key, 0) || 0));
      vmInfo();
    });
  }
  function vmInfo() {
    const d = vmData(), i = vmHalf();
    $("#vm-info").textContent = `${d.title}${d.dual ? " · " + d.halves[i].name : ""} · ${$tn("detail.pages", vmEls[i].pages.length)}`;
  }
  const vmPartOf = (pg) => (pg && (pg.classList.contains("vm-mid") || pg.classList.contains("vm-mid-pad")) ? "middle" : partOf(pg) || "front");
  const vmViewers = [0, 1].map((i) =>
    VIEWER.create({
      root: vmRoot(i),
      pager: $("#vm-pager-" + i),
      name: "vm" + i,
      active: () => state.view === "theory" && !$("#vademecum-view").hidden && vmHalf() === i,
      count: () => vmEls[i].pages.length,
      // die gegenüberstehende Mitte trägt die Seitenzahl der anderen Hälfte: im Blätterbereich zählt die eigene
      pageNo: (k) => (vmEls[i].pages[k]?.classList.contains("vm-mid-foreign") && k ? vmEls[i].pages[k - 1] : vmEls[i].pages[k])?.querySelector(".page-foot span:last-child").textContent || k + 1,
      units: () => ({ starts: vmEls[i].starts, prev: $t("pager.prevLesson"), next: $t("pager.nextLesson") }),
      ensure: vmEnsure,
      pos: { get: () => 0, set: (v) => vmCache && vmCache.halves[i] && store.set("vmPos." + vmCache.halves[i].key, v) },
      onShow: (a, b) => {
        vmToc.mark(vmPartOf(vmEls[i].pages[b]));
        if (state.view === "theory") viewWrite();
      },
    }),
  );
  const vmToc = VIEWER.toc($("#vm-toc"), {
    sections: () => {
      const d = vmData(), h = d.halves[vmHalf()];
      return h.parts
        .map((p) => ({ id: p.id, title: p.id === "front" ? $t("vm.front") : p.title, items: p.lessons.map((L) => ({ attrs: `data-part="${e(p.id)}" data-lesson="${e(L.id)}"`, html: `<span class="no">${e(L.label)}</span><span class="nm"><b>${e(L.title)}</b></span>` })) }))
        .concat(d.middle ? [{ id: "middle", title: d.middle.title, items: [] }] : []);
    },
    onHead: (id, grp, toggle) => {
      const opening = !grp.classList.contains("open");
      toggle(opening);
      if (opening) ROUTE.mark(), renderVm({ part: id });
    },
    onPick: (li) => (ROUTE.mark(), renderVm({ part: li.dataset.part, lesson: li.dataset.lesson })),
  });
  async function renderVm(go = {}) {
    const d = vmData();
    if (!d.halves) return;
    const i = vmHalf();
    document.querySelectorAll("#vademecum-view .vm-half").forEach((el) => (el.hidden = +el.dataset.half !== i));
    const other = d.halves[1 - i];
    $("#btn-vm-turn").hidden = $("#btn-print-vm-half").hidden = !d.dual;
    if (other) $("#btn-vm-turn").title = $t("vm.turnTitle", { name: other.name });
    $("#vm-toc-title").textContent = d.title + (d.dual ? " · " + d.halves[i].name : "");
    vmToc.render();
    const p = vmEnsure();
    if (p) {
      $("#vm-pager-" + i).innerHTML = "";
      await p;
      if (vmRendered !== d.key) return;
    }
    vmInfo();
    const root = vmRoot(i);
    const target =
      (go.lesson && root.querySelector(`[data-lesson="${CSS.escape(go.lesson)}"]`)) ||
      (go.part === "middle" && root.querySelector(":scope > .page.vm-mid")) ||
      (go.part === "front" && root.querySelector(":scope > .page")) ||
      (go.part && root.querySelector(`:scope > .page.part-${CSS.escape(go.part)}:not(.blank)`));
    vmViewers[i].show(target ? vmEls[i].pages.indexOf(target.closest(".page")) : vmViewers[i].pos);
  }
  // Buch wenden: andere Hälfte mit ihrer zuletzt gelesenen Seite
  $("#btn-vm-turn").onclick = () => {
    const d = vmData();
    if (!d.dual) return;
    ROUTE.mark();
    store.set("vmHalf", 1 - vmHalf());
    renderVm();
  };
  $("#vm-print-hooks").checked = store.get("vmPrintHooks", true);
  $("#vm-print-hooks").onchange = (ev) => store.set("vmPrintHooks", ev.target.checked);
  $("#btn-print-vm").onclick = () => printJob("vademecum");
  $("#btn-print-vm-half").onclick = () => printJob("vademecum", { half: vmHalf() });
  // Seiten im Druck: aus der Ansicht, sonst unsichtbar gesetzt (dieselben Seitenzahlen und Verweise)
  async function vmSetPages(d) {
    let roots = [0, 1].map(vmRoot);
    let tmp = null;
    if (vmRendered !== d.key || !roots[0].querySelector(".page")) {
      tmp = document.createElement("div");
      tmp.className = "offscreen-set";
      tmp.innerHTML = `<div class="pages"></div><div class="pages"></div>`;
      document.body.appendChild(tmp);
      roots = [...tmp.children];
      await vmTypeset(d, roots, (n, total) => progress.show($t("print.vademecum"), n, total));
    }
    const out = roots.map((r) => [...r.querySelectorAll(":scope > .page")].map((pg) => {
      const c = pg.cloneNode(true);
      c.classList.remove("offstage");
      c.style.contentVisibility = "";
      return c;
    }));
    tmp?.remove();
    return out;
  }
  // Druckfolge des Wendebuchs: Hälfte A mit Mitte, ggf. Vakatseite, dann Hälfte B ohne Mitte rückwärts und gedreht.
  // Bei gerader Gesamtzahl liegt jede Seite von B mit ihrer eigenen Seitenlage (recto/verso) richtig: nach der
  // Drehung wandert ihr Lochrand auf die Bindungskante des gebundenen Buches.
  async function vmPrintHTML(d, half) {
    const [A, B] = await vmSetPages(d);
    const style = Object.entries(d.style).map(([k, v]) => `${k}:${v}`).join(";");
    const wrap = (pages) => pages.map((pg) => (pg.style.cssText += ";" + style, pg.outerHTML)).join("");
    const own = (l) => l.filter((pg) => !pg.classList.contains("vm-mid-foreign"));
    if (half != null) return wrap(own(half ? B : A));
    if (!d.dual) return wrap(A);
    const back = own(B).reverse();
    back.forEach((pg) => pg.classList.add("upside-down"));
    const blank = (own(A).length + back.length) % 2 ? [Object.assign(document.createElement("section"), { className: "page blank" + (state.settings.primerGutter === false ? "" : " bind") + (own(A).length % 2 ? " verso" : ""), innerHTML: `<div class="page-inner"></div><footer class="page-foot"><span></span><span></span></footer>` })] : [];
    return wrap([...own(A), ...blank, ...back]);
  }

  // --- Fortschritt -----------------------------------------------------------------
  const progress = {
    show(label, done, total) {
      const el = $("#progress");
      el.hidden = false;
      el.querySelector(".pg-label").textContent = label;
      el.querySelector(".pg-count").textContent = total ? `${done}/${total}` : "";
      el.querySelector(".pg-bar i").style.width = total ? (100 * done) / total + "%" : "100%";
    },
    hide() {
      $("#progress").hidden = true;
    },
  };
  const tick = () => new Promise((r) => setTimeout(r, 0));

  // --- Drucken --------------------------------------------------------------------
  // pages: Seitenobjekte (werden in Häppchen gesetzt, mit Zähler) oder fertiges HTML.
  // Fertig gesetzte Druckaufträge werden im Speicher gehalten (gleicher Inhalt + Format = sofort druckbereit).
  const PAPER = { a5: "A5", a4: "A4", "a4-2up": "A4 landscape" };
  const printCache = new Map();
  // ids samt Verweisen (href="#…", url(#…)) mit Anhang versehen: Druck und Großansicht setzen dasselbe HTML wie die
  // Vorschau; doppelte ids ließen textPath des Schriftbands dem Pfad im Original folgen (Band läuft neben dem Kreis)
  // self: auch das Wurzelelement (Klon eines SVG); beim Druckbereich nur der Inhalt
  function suffixIds(root, suf, self = true) {
    const all = [...(self ? [root] : []), ...root.querySelectorAll("*")];
    for (const el of all) {
      if (el.id) el.id += suf;
      for (const a of ["href", "xlink:href"]) if (el.getAttribute?.(a)?.startsWith("#")) el.setAttribute(a, el.getAttribute(a) + suf);
      for (const a of ["fill", "stroke", "clip-path", "mask", "filter", "marker-start", "marker-mid", "marker-end"]) {
        const v = el.getAttribute?.(a);
        if (v && v.includes("url(#")) el.setAttribute(a, v.replace(/url\(#([^)]+)\)/g, `url(#$1${suf})`));
      }
    }
  }
  let printIds = 0;
  let printing = false;
  // Druckvorbereitung ohne Druckdialog (auch für die Browser-Tests): setzt in #print-root und lässt es stehen
  // Vorgeschlagener Dateiname beim Speichern als PDF: Chrome nimmt den Seitentitel. Firefox druckt bei window.print()
  // eine Kopie des Dokuments, deren Titel oft leer ankommt, und greift dann zum letzten Pfadteil der Adresse
  // („index.html.pdf“). Darum für die Dauer des Drucks beides umstellen: Titel und Dateiteil der Adresse.
  let titleBeforePrint = null;
  let pathBeforePrint = null;
  function printTitle(name) {
    const who = (CHARS.current()?.name || "").trim();
    return [who, name || $t("app.title")].filter(Boolean).join(" – ").replace(/[\\/:*?"<>|]+/g, " ").replace(/\s+/g, " ").trim();
  }
  function endPrint() {
    if (titleBeforePrint != null) document.title = titleBeforePrint;
    titleBeforePrint = null;
    if (pathBeforePrint != null && location.pathname !== pathBeforePrint) {
      try {
        history.replaceState(history.state, "", pathBeforePrint + location.search + location.hash);
      } catch {}
    }
    pathBeforePrint = null;
    document.body.classList.remove("printing");
    $("#print-root").innerHTML = "";
    printing = false;
    window.removeEventListener("afterprint", endPrint);
  }
  async function preparePrint(pages, paperOverride, label = I18N.t("print.pages"), after = null, useCache = true) {
    const root = $("#print-root");
    const paper = paperOverride || state.settings.paper || "a5";
    root.className = "paper-" + paper + (state.settings.printBackground ? "" : " no-bg");
    let st = $("#page-size-style");
    if (!st) {
      st = document.createElement("style");
      st.id = "page-size-style";
      document.head.appendChild(st);
    }
    st.textContent = `@page { size: ${PAPER[paper]}; margin: 0; }`;
    document.body.classList.add("printing");
    try {
      const html = pages.set != null ? pages.set : typeof pages === "string" ? pages : pages.map(TYPESET.pageHTML).join("");
      const key = U.hash(html) + "|" + html.length + "|" + paper;
      if (useCache && printCache.has(key)) root.innerHTML = printCache.get(key);
      else if (pages.set != null) root.innerHTML = html; // schon gesetzt (Vademecum): nicht neu umbrechen
      else {
        progress.show(label, 0, typeof pages === "string" ? 1 : pages.length);
        await tick();
        await TYPESET.typeset(root, pages, (n, total) => progress.show(label, n, total));
        if (after) await after(root);
        printCache.set(key, root.innerHTML);
        if (printCache.size > 3) printCache.delete(printCache.keys().next().value);
      }
      suffixIds(root, "-pr" + ++printIds, false); // nach dem Merken: der Speicher hält die ids der Vorlage
      if (paper === "a4-2up") {
        // je zwei A5-Seiten auf ein A4-Querblatt
        const list = [...root.querySelectorAll(":scope > .page")];
        for (let i = 0; i < list.length; i += 2) {
          const sheet = document.createElement("div");
          sheet.className = "sheet";
          list[i].before(sheet);
          sheet.append(list[i]);
          if (list[i + 1]) sheet.append(list[i + 1]);
        }
      }
    } finally {
      progress.hide();
    }
    return root;
  }
  async function printPages(pages, paperOverride, label, after, name) {
    if (printing) return;
    printing = true;
    window.addEventListener("afterprint", endPrint);
    try {
      await preparePrint(pages, paperOverride, label, after);
    } catch (err) {
      endPrint();
      throw err;
    }
    titleBeforePrint = document.title;
    document.title = printTitle(name);
    try {
      pathBeforePrint = location.pathname;
      const path = pathBeforePrint.replace(/[^/]*$/, encodeURIComponent(document.title));
      history.replaceState(history.state, "", path + location.search + location.hash);
    } catch {
      pathBeforePrint = null;
    }
    setTimeout(() => window.print(), 50);
  }

  // Druckaufträge: liefern Seiten, Papier, Beschriftung und Nacharbeit; Druckknöpfe und Tests nutzen dieselben
  async function primerRefs(d) {
    // Seite je Lektion im gesetzten Heft: aus der Ansicht, sonst unsichtbar setzen
    let root = $("#primer-pages");
    let tmp = null;
    if (primerRendered !== d.key || !root.querySelector(".page")) {
      tmp = root = document.createElement("div");
      tmp.className = "pages offscreen-set";
      document.body.appendChild(tmp);
      await TYPESET.typeset(tmp, d.parts.flatMap((p) => p.pages));
    }
    const at = {};
    for (const sec of root.querySelectorAll(".lesson[data-lesson]:not([data-split-of])")) at[sec.dataset.lesson] ??= sec.closest(".page").querySelector(".page-foot span:last-child").textContent;
    tmp?.remove();
    return at;
  }
  const JOBS = {
    book: (o = {}) => {
      const all = bookAll();
      const vi = o.vol ?? view.vol;
      const v = all.volumes[Math.min(vi, all.volumes.length - 1)];
      const multi = all.volumes.length > 1;
      const file = $t(DIVINE ? "file.brev" : "file.book") + (multi ? " " + $t("file.vol", { r: U.ROMAN[v.vi + 1] }) : "");
      return { pages: v.pages, label: multi ? $t("print.vol", { r: U.ROMAN[v.vi + 1] }) : $t("print.book"), file };
    },
    rules: () => {
      const d = bookAll();
      return d.entries.length ? { pages: BOOK.rulesBook(d.entries, state.settings), label: $t("print.rules"), after: BOOK.rulesIndex, file: $t("file.rules") } : null;
    },
    scrolls: () => {
      const entries = bookEntries();
      return entries.length ? { pages: entries.flatMap(({ m, t }) => BOOK.scrollPages(m, t, { paper: state.settings.scrollPaper })), paper: state.settings.scrollPaper, label: $t("print.scrolls"), file: $t("file.scrolls") } : null;
    },
    primer: () => ({ pages: primerData().parts.flatMap((p) => p.pages), label: $t("print.primer"), file: $t("file.primer") }),
    // Vademecum: fertig gesetzte Seiten (Seitenzahlen je Hälfte, Verweise aufgelöst); half: nur diese Hälfte
    // ohne Häkchen „Kapitel IX mitdrucken“: eigener Satz ohne das Kapitel (Seitenzahlen und Verweise stimmen)
    vademecum: async (o = {}) => {
      if (!hasVm()) return null;
      const hooks = o.hooks ?? store.get("vmPrintHooks", true);
      const d = hooks ? vmData() : { key: vmData().key + "|ohne-ix", ...VADEMECUM_BOOK.build({ deity: window.DEITY, entries: bookEntries(), settings: state.settings, omit: ["hooks"] }) };
      return { pages: { set: await vmPrintHTML(d, o.half) }, label: $t("print.vademecum"), file: $t("file.vademecum") + (o.half != null && vmCache?.halves[o.half]?.name ? " – " + vmCache.halves[o.half].name : "") };
    },
    // Andachtsblatt des laufenden Spieltages und Andachtsbuch: immer A5
    devotion: () => {
      if (!DEVOTION.enabled()) return null;
      const d = PREP.api.dayList().find((x) => x.current);
      return { pages: DEVOTION.sheetPages(d), paper: "a5", label: $t("dv.sheet"), file: $t("dv.sheet") + (d?.ingameText ? " " + d.ingameText : "") };
    },
    devotionBook: () => (DEVOTION.enabled() ? { pages: DEVOTION.bookPages(), paper: "a5", label: $t("dv.bookTitle"), file: $t("dv.bookTitle") } : null),
    checks: async () => {
      const d = primerData();
      const at = await primerRefs(d);
      return { pages: d.sheet((id) => at[id]), label: $t("print.checks"), file: $t("file.checks") };
    },
  };
  async function printJob(kind, opts) {
    const job = await JOBS[kind](opts);
    if (job) printPages(job.pages, job.paper, job.label, job.after, job.file);
  }
  $("#btn-print-scrolls").onclick = () => printJob("scrolls");
  $("#btn-print-book").onclick = () => printJob("book");
  $("#book-vols").addEventListener("click", (ev) => {
    const b = ev.target.closest("button[data-vol]");
    if (b) ROUTE.mark(), selectVol(+b.dataset.vol);
  });
  $("#btn-print-rules").onclick = () => printJob("rules");

  // Schnellschalter Originalschrift / Lateinschrift (Schriftband und Absichtszeichen); nur sichtbar, wenn eine
  // Formelsprache des Profils eine eigene Schrift hat
  // (Buchleiste und Lehrheft)
  const scriptSwitches = document.querySelectorAll(".script-switch");
  const scriptHidden = DIVINE || !FORMULA.stations().some((st) => FORMULA.get(st.lang).script);
  scriptSwitches.forEach((el) => (el.hidden = scriptHidden));
  const showScriptSwitch = () => document.querySelectorAll(".script-switch button").forEach((b) => {
    const on = b.dataset.mode === state.settings.scriptMode;
    b.classList.toggle("on", on);
    b.setAttribute("aria-pressed", on);
  });
  // Darstellung wechseln: Texte (Band) und alle gesetzten Seiten neu, Kernzeilen bleiben gleich
  function applyScriptMode() {
    if (SCRIPTS.mode() === state.settings.scriptMode) return false;
    // Caches sind nach den Einstellungen geschlüsselt (scriptMode inklusive): nichts verwerfen, nur neu zeigen
    SCRIPTS.setMode(state.settings.scriptMode);
    view.rendered = null;
    showScriptSwitch();
    return true;
  }
  scriptSwitches.forEach((el) => el.addEventListener("click", (ev) => {
    const b = ev.target.closest("button[data-mode]");
    if (!b || b.dataset.mode === state.settings.scriptMode) return;
    state.settings.scriptMode = b.dataset.mode;
    store.set("settings", state.settings); // nicht save(): das verwirft bei mehreren Stationen alle Texte
    if (!applyScriptMode()) return;
    renderList();
    if (state.selected) renderDetail();
    $("#theory-pages").innerHTML = "";
    show(state.view);
  }));
  showScriptSwitch();

  // --- Testschnittstelle (tools/test-browser.mjs) -----------------------------------
  // Setzt Buch und Einstellungen nur im Speicher (nichts wird gespeichert) und setzt Druckaufträge
  // wie die Druckknöpfe, aber ohne Druckdialog.
  window.APP_TEST = {
    version: 1,
    // book: Liste von Zaubernamen oder { levels: [0, 1, …], everyday: true } (Grade der Klassenliste)
    load({ book = [], settings = {} } = {}) {
      const missing = [];
      let ids;
      if (Array.isArray(book)) {
        const byName = new Map(ALL.map((x) => [x.s.name.toLowerCase(), x.s.id]));
        ids = book.map((n) => byName.get(String(n).toLowerCase()) || (missing.push(n), null)).filter(Boolean);
      } else {
        const lv = new Set(book.levels || []);
        ids = ALL.filter((x) => (x.s.everyday ? book.everyday && CLASS.everyday : lv.has(x.s.levels[CLASS.list]))).map((x) => x.s.id);
      }
      state.book = new Set(ids);
      state.settings = { ...DEFAULTS, ...settings };
      I18N.configure(state.settings);
      SCRIPTS.setMode(state.settings.scriptMode);
      showScriptSwitch();
      ALL.forEach((x) => (x.t = null));
      bookCache = null;
      primerCache = null;
      [bookKeep, primerKeep, vmKeep].forEach((k) => k.clear());
      primerRendered = null;
      vmCache = null;
      vmRendered = null;
      printCache.clear();
      view.rendered = null;
      view.vol = 0;
      bookViewer.pos = 0;
      primerViewer.pos = 0;
      theoryViewer.pos = 0;
      return { spells: ids.length, missing };
    },
    async print(kind, opts = {}) {
      const job = await JOBS[kind](opts);
      if (!job) return null;
      const t0 = performance.now();
      await preparePrint(job.pages, job.paper, job.label, job.after, false);
      return { ms: Math.round(performance.now() - t0), paper: job.paper || state.settings.paper || "a5", volumes: bookAll().volumes.length, maxPages: +state.settings.maxPages || 0, warnings: bookAll().warnings || [] };
    },
    done: endPrint,
    show: (v) => show(v),
    // Testbuch und Einstellungen speichern (für Fälle, die neu laden)
    save: () => save(),
    here: () => ({ view: state.view, selected: state.selected, full: fullId, vol: view.vol, hash: location.hash }),
  };

  // --- Ansichten ------------------------------------------------------------------
  function show(view) {
    state.view = view;
    // Reiterwechsel: neuer Verlaufseintrag, vor dem Zeichnen (der Betrachter kann sofort melden und berichtigt ihn dann);
    // beim Herstellen einer Adresse schreibt applyRoute
    if (!ROUTE.applying) {
      ROUTE.push(currentRoute());
      if (view === "book" || view === "theory") settling = true;
    }
    document.querySelectorAll(".tabs button").forEach((b) => b.classList.toggle("active", b.dataset.view === view));
    document.querySelectorAll(".view").forEach((v) => v.classList.toggle("active", v.id === "view-" + view));
    if (view === "book") renderBook();
    if (view === "theory") showLehre();
    if (view === "prepare") PREP.render();
  }

  // --- Adresse: Lesezeichen und Zurück/Vor ---------------------------------------------
  // #browse/<zauber>  #book/<zauber>  #prepare  #theory/primer/<teil>/<lektion>  #theory/prayer
  // #theory/vademecum/<hälfte>/<teil>/<lektion>; hinter browse/book optional /full (ausführliche Fassung).
  // Im Buch zählt der Zauber, nicht die Seite: Seitenzahlen verschieben sich mit jedem neuen Zauber.
  let fullId = null, fullRouteClose = false, lehreGo = null;
  // Betrachter melden nach jedem Anzeigen: anderer Zauber (Lektion, Teil) als in der Adresse → neuer Verlaufseintrag,
  // Blättern innerhalb derselben Einheit → nur ersetzen. Nach einem Reiterwechsel oder dem Herstellen einer Adresse
  // berichtigt die erste Meldung nur (settling), sonst entstünden doppelte Einträge bzw. ginge der Vor-Verlauf verloren.
  let settling = false;
  function viewWrite() {
    const r = currentRoute();
    if (settling) settling = false;
    else if (ROUTE.format(r) !== location.hash) ROUTE.mark();
    ROUTE.write(r);
  }
  // Zauber im sichtbaren Buchausschnitt: der erste, der hier beginnt (halbe Seiten tragen zwei), sonst der fortgesetzte
  function bookSpellShown() {
    const sh = bookViewer.shown;
    if (!sh) return null;
    const d = bookData();
    if (!d || !d.pages.length) return null;
    let cont = null;
    for (let i = sh[0]; i <= sh[1] && i < d.pages.length; i++) {
      const no = d.pages[i].no;
      const starts = d.toc.find((x) => x.page === no);
      if (starts) return starts.m.id;
      cont = cont || d.pages[i].spell || null;
    }
    return cont;
  }
  // steht der Zauber schon im sichtbaren Ausschnitt? (dann bleibt das Buch, wo es ist)
  function bookShows(id, p) {
    const sh = bookViewer.shown;
    if (state.view !== "book" || !sh || p.vol !== view.vol) return false;
    const d = bookData();
    for (let i = sh[0]; i <= sh[1] && i < d.pages.length; i++) if (d.pages[i].no === p.page || d.pages[i].spell === id) return true;
    return false;
  }
  // Lektionsanfänge eines gesetzten Hefts: [{ i: Seitenindex, id, part }]
  function lessonIndex(root, pages, partFn) {
    return [...root.querySelectorAll(".lesson[data-lesson]:not([data-split-of])")]
      .map((l) => {
        const pg = l.closest(".page");
        return { i: pages.indexOf(pg), id: l.dataset.lesson, part: partFn(pg) };
      })
      .filter((x) => x.i >= 0);
  }
  // Teil und Lektion zur letzten sichtbaren Seite b (wie das Verzeichnis, das dem Blättern folgt)
  function anchorAt(els, sh, partFn) {
    if (!sh || !els.pages.length) return [];
    const b = Math.min(sh[1], els.pages.length - 1);
    const part = partFn(els.pages[b]);
    if (!part) return [];
    const L = els.lessons.filter((x) => x.i <= b && x.part === part).pop();
    return L ? [part, L.id] : [part];
  }
  function lehreRoute() {
    if (hasVm() && store.get("lehreView", "main") === "vademecum") {
      const i = vmHalf(), h = vmCache && vmCache.halves && vmCache.halves[i];
      if (!h) return ["vademecum"];
      return ["vademecum", h.key, ...(vmRendered === vmCache.key ? anchorAt(vmEls[i], vmViewers[i].shown, vmPartOf) : [])];
    }
    if (!DIVINE && window.PRIMER_BOOK) return ["primer", ...(primerCache && primerRendered === primerCache.key ? anchorAt(primerEls, primerViewer.shown, partOf) : [])];
    return ["prayer"];
  }
  function currentRoute() {
    const v = state.view;
    if (v === "browse") return { view: v, parts: [fullId || state.selected], full: !!fullId };
    if (v === "book") return { view: v, parts: [fullId || bookSpellShown()], full: !!fullId };
    if (v === "theory") return { view: v, parts: lehreRoute() };
    return { view: v, parts: [] };
  }
  // Ziel in der Lehre vormerken (Unteransicht, Hälfte, Teil/Lektion); was die Figur nicht hat, fällt auf den Hauptteil
  function lehreTarget(parts) {
    const [kind, ...rest] = parts;
    if (!kind) return false;
    if (kind === "vademecum" && hasVm()) {
      store.set("lehreView", "vademecum");
      const d = vmData();
      const k = (d.halves || []).findIndex((h) => h.key === rest[0]);
      if (k >= 0) store.set("vmHalf", k);
      lehreGo = { part: rest[1], lesson: rest[2] };
    } else {
      store.set("lehreView", "main");
      lehreGo = kind === "primer" && !DIVINE ? { part: rest[0], lesson: rest[1] } : null;
    }
    return true;
  }
  // Ort aus der Adresse herstellen (Start, Zurück/Vor, von Hand geänderte Adresse), ohne neue Verlaufseinträge.
  // Was nicht passt, fällt zurück (Zauber nicht im Buch → Verzeichnis); die Adresse wird danach berichtigt.
  function applyRoute(r) {
    let v = r.view, settle = true;
    const id = r.parts[0], x = id && byId.get(id);
    ROUTE.applying = true;
    try {
      if (v === "book" && id) {
        const p = x && bookAll().pageBySpell.get(id);
        if (!p) v = "browse";
        else if (!bookShows(id, p)) {
          // Band und Seite setzen; angezeigt (und gemerkt) wird beim Zeigen des Buchs
          if (p.vol !== view.vol) {
            view.vol = p.vol;
            view.rendered = null;
            store.set("bookVol", p.vol);
          }
          bookViewer.pos = bookData().idxByNo.get(p.page) ?? 0;
          if (state.view === "book") renderBook();
          settle = false; // der Betrachter schreibt nach dem Satz
          settling = true;
        }
      }
      if (v === "browse" && x && state.selected !== id) select(id);
      const lehre = v === "theory" && lehreTarget(r.parts);
      const wantFull = r.full && !!x && (v === "browse" || v === "book");
      // anderer Zauber im offenen Fenster: openFull tauscht nur den Inhalt (das close-Ereignis käme erst später)
      if (fullId && !wantFull) {
        fullRouteClose = true;
        $("#full-modal").close();
        fullId = null;
      }
      if (((v === "book" || v === "theory") && state.view !== v) || lehre) settling = true;
      if (state.view !== v) show(v);
      else if (lehre) showLehre();
      if (v === "theory") settle = false;
      if (wantFull && fullId !== id) openFull(x);
    } finally {
      ROUTE.applying = false;
    }
    if (settle) ROUTE.write(currentRoute());
  }
  document.querySelectorAll(".tabs button").forEach((b) => (b.onclick = () => show(b.dataset.view)));

  // --- Einstellungen, Export, Import ------------------------------------------------
  const dlg = $("#settings");
  $("#btn-settings").onclick = () => {
    const f = dlg.querySelector("form");
    for (const [k, v] of Object.entries(state.settings)) {
      const el = f.elements[k];
      if (!el) continue;
      if (el.type === "checkbox") el.checked = !!v;
      else el.value = v;
    }
    // leerer Meistername: der aus dem Profil gilt, als Platzhalter sichtbar
    $("#set-primer-master").placeholder = (PROFILE.primer && PROFILE.primer.master && PROFILE.primer.master.name) || $t("set.book.masterDefault");
    renderCharAdmin();
    renderKnownLangs();
    renderInstall();
    langHint();
    bookLangHint();
    showSettingsSec(state.ui.settingsSec);
    dlg.showModal();
    dlg.querySelector(".set-nav button.on")?.focus();
  };
  // Hausregel Entziffern: beherrschte Formelsprachen je Charakter (nur sichtbar, wenn das Profil die Hausregel einschaltet)
  function renderKnownLangs() {
    const fs = $("#set-known-langs");
    fs.hidden = !FORMULA.decipherCfg().enabled || DIVINE;
    if (fs.hidden) return;
    const known = new Set(state.settings.knownLangs || FORMULA.decipherCfg().known);
    const ids = Object.keys(FORMULA.LANGS).sort((a, b) => FORMULA.name(a, I18N.lang.ui).localeCompare(FORMULA.name(b, I18N.lang.ui), I18N.locale()));
    fs.querySelector(".kl-list").innerHTML = ids.map((id) => `<label class="check"><input type="checkbox" value="${e(id)}" ${known.has(id) ? "checked" : ""}> ${e(FORMULA.name(id, I18N.lang.ui))}</label>`).join("");
  }
  function readKnownLangs() {
    const fs = $("#set-known-langs");
    if (fs.hidden) return;
    const now = [...fs.querySelectorAll("input:checked")].map((x) => x.value).sort();
    // unverändert gegenüber der Profilvorgabe: weiter der Vorgabe folgen (null)
    if (state.settings.knownLangs || now.join() !== [...FORMULA.decipherCfg().known].sort().join()) state.settings.knownLangs = now;
  }

  // Hinweis zur Regelsprache: Deutsch ohne lokale Regeldaten zeigt übersetzte Begriffe mit englischem Regeltext
  function langHint() {
    const f = dlg.querySelector("form");
    $("#set-lang-hint").textContent = f.elements.rulesLang.value === "de" ? (RULES.hasData() ? $t("set.lang.hintData", { n: Object.keys(window.RULES_DE).length }) : $t("set.lang.hintNoData")) : "";
  }
  dlg.querySelector('[name="rulesLang"]').addEventListener("change", langHint);
  // Hinweis zur Buchsprache: Profiltexte gelten nur in der Sprache des Profils (localization: einsprachige Profiltexte)
  function bookLangHint() {
    const l = dlg.querySelector('[name="bookLang"]').value, el = $("#set-lang-profile-hint");
    const show = !!(PROFILE.foreign && PROFILE.foreign(l));
    el.hidden = !show;
    el.textContent = show ? $t("set.lang.profileForeign", { lang: $t("set.lang.name." + PROFILE.localLang) }) : "";
  }
  dlg.querySelector('[name="bookLang"]').addEventListener("change", bookLangHint);
  // Abschnitte des Dialogs: immer genau einer sichtbar, der zuletzt gewählte wird gemerkt
  function showSettingsSec(sec) {
    if (!dlg.querySelector(`.set-sec[data-sec="${sec}"]`)) sec = "charakter";
    dlg.querySelectorAll(".set-sec").forEach((el) => (el.hidden = el.dataset.sec !== sec));
    dlg.querySelectorAll(".set-nav button").forEach((b) => b.classList.toggle("on", b.dataset.sec === sec));
    dlg.querySelector(".set-body").scrollTop = 0;
    if (state.ui.settingsSec !== sec) {
      state.ui.settingsSec = sec;
      store.set("ui", state.ui);
    }
  }
  dlg.querySelector(".set-nav").addEventListener("click", (ev) => {
    const b = ev.target.closest("button[data-sec]");
    if (b) showSettingsSec(b.dataset.sec);
  });
  dlg.addEventListener("close", () => {
    if (charReload) return location.reload();
    const f = dlg.querySelector("form");
    const owner = state.settings.owner, only = state.settings.onlyClass;
    const langBefore = ["uiLang", "bookLang", "rulesLang", "units"].map((k) => state.settings[k]).join("|");
    const uiBefore = state.settings.uiLang;
    for (const k of Object.keys(DEFAULTS)) {
      const el = f.elements[k];
      if (!el) continue;
      state.settings[k] = el.type === "checkbox" ? el.checked : el.value;
    }
    const langsBefore = JSON.stringify(state.settings.knownLangs);
    readKnownLangs();
    save();
    applyScriptMode();
    // neue Oberflächensprache: die Seite lädt neu (alle Beschriftungen, auch die aus den Skripten)
    if (state.settings.uiLang !== uiBefore) return location.reload();
    I18N.configure(state.settings);
    I18N.apply();
    VITRAIL.setMaterial(state.settings.material);
    const langChanged = ["uiLang", "bookLang", "rulesLang", "units"].map((k) => state.settings[k]).join("|") !== langBefore;
    if (state.settings.owner !== owner || langChanged) ALL.forEach((x) => (x.t = null)); // Besitzername steckt in den Randnotizen; Titel bleiben gleich
    if (langChanged) { bookCache = null; primerCache = null; vmCache = null; [bookKeep, primerKeep, vmKeep].forEach((k) => k.clear()); printCache.clear(); view.rendered = null; }
    if (state.settings.onlyClass !== only || state.settings.owner !== owner || langChanged) renderList();
    if (state.selected) renderDetail();
    if (JSON.stringify(state.settings.knownLangs) !== langsBefore && state.view === "prepare") PREP.render();
    $("#theory-pages").innerHTML = "";
    primerRendered = null;
    vmRendered = null;
    if (state.view !== "browse") show(state.view);
  });
  $("#btn-export").onclick = () => {
    const ch = CHARS.current();
    const data = { character: ch.name, profile: ch.profile, cls: CLASS.id, deity: ch.deity || null, prayers: state.prayers, book: [...state.book].map((id) => byId.get(id)?.s.name).filter(Boolean), ids: [...state.book], settings: state.settings, preparation: PREP.exportData(), journal: DEVOTION.exportData() };
    // Profilpaket: Profil des Charakters und Vademecum-Eintrag seiner Gottheit, damit eine Datei den ganzen Charakter trägt
    const prof = ch.profile && CHARS.profiles().find((p) => p.key === ch.profile);
    if (prof) data.profilePackage = profilePackage(prof, window.DEITY ? [DEITY.id] : []);
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
    a.download = (ch.name || state.settings.owner || "zauberbuch").toLowerCase().replace(/[^a-z0-9äöüß]+/g, "-") + "-zauberbuch.json";
    a.click();
  };
  $("#file-import").onchange = async (ev) => {
    const file = ev.target.files[0];
    if (!file) return;
    try {
      let names = [], ids = null, keepUnknown = false, settings = null, preparation = null, character = null, profile = null, extra = {}, prayers = null, journal = null, profileFromPackage = false;
      if (/\.xlsx$/i.test(file.name)) names = await IMPORT.xlsxNames(await file.arrayBuffer());
      else if (/\.json$/i.test(file.name)) {
        const data = JSON.parse(await file.text());
        names = data.book || [];
        // ids (seit dem Profilpaket im Export): eindeutig, auch bei gleichen Namen und Zaubern aus dem Profil
        if (Array.isArray(data.ids) && data.ids.length) ids = data.ids;
        settings = data.settings || null;
        preparation = data.preparation || null;
        character = data.character || null;
        profile = data.profile || null;
        if (data.cls) extra.cls = data.cls;
        if (data.deity) extra.deity = data.deity;
        prayers = data.prayers || null;
        journal = data.journal || null;
        // Profilpaket zuerst speichern (Rückfragen wie bei „Profil laden“); der Charakter nutzt dann dessen Schlüssel
        if (data.profilePackage) {
          const r = storePackage(PROFILE_STORE.check(data.profilePackage));
          profile = r.key;
          profileFromPackage = !r.kept || CHARS.current().profile !== r.key;
          // Alltagszauber aus dem mitgebrachten Profil kennt die App erst nach dem Neuladen: ids trotzdem übernehmen
          keepUnknown = true;
        }
      } else names = IMPORT.textNames(await file.text());
      const norm = (n) => String(n).toLowerCase().replace(/[^a-z0-9äöüß]/g, "");
      const lookup = new Map(ALL.map((x) => [norm(x.s.name), x.s.id]));
      const exact = new Map(ALL.map((x) => [x.s.name, x.s.id]));
      // deutsche Namen (lokale Regeldaten) werden beim Import ebenfalls erkannt
      for (const [id, d] of Object.entries(window.RULES_DE || {})) if (!lookup.has(norm(d.name))) lookup.set(norm(d.name), id);
      const missing = [];
      const found = [];
      if (ids) {
        for (const id of ids) (byId.has(id) || keepUnknown ? found : missing).push(id);
        names = [];
      }
      for (let i = 0; i < names.length; i++) {
        const n = names[i];
        const id = exact.get(n) || lookup.get(norm(n)) || (byId.has(n) ? n : null);
        if (id) found.push(id);
        else missing.push(n);
        if (i % 25 === 0) progress.show($t("import.matching"), i + 1, names.length), await tick();
      }
      progress.hide();
      if (!found.length) throw new Error($t("import.none"));
      // Datei eines anderen Charakters: als neuen Charakter anlegen?
      if (character && character !== CHARS.current().name && confirm($t("import.otherChar", { a: character, b: CHARS.current().name }))) {
        const c = CHARS.create(character, CHARS.profiles().some((p) => p.key === profile) ? profile : null, null, extra);
        CHARS.write(c.id, "book", found);
        if (prayers) CHARS.write(c.id, "prayers", prayers);
        if (journal) CHARS.write(c.id, "journal", journal);
        if (settings) CHARS.write(c.id, "settings", settings);
        if (preparation) {
          if (preparation.state) CHARS.write(c.id, "prep", preparation.state);
          if (preparation.presets) CHARS.write(c.id, "prepPresets", preparation.presets);
          if (preparation.log) CHARS.write(c.id, "prepLog", preparation.log);
          if (preparation.days) CHARS.write(c.id, "prepDays", preparation.days);
        }
        progress.hide();
        alert($t("import.created", { name: character, n: found.length }) + (missing.length ? "\n" + $t("import.missing", { n: missing.length, list: missing.slice(0, 30).join(", ") }) : ""));
        CHARS.switchTo(c.id);
        return;
      }
      const replace = !state.book.size || confirm($t("import.replace", { n: found.length }));
      if (replace) state.book = new Set();
      bookViewer.pos = 0;
      found.forEach((id) => state.book.add(id));
      if (settings) Object.assign(state.settings, settings);
      if (preparation) PREP.importData(preparation);
      if (journal) DEVOTION.importData(journal);
      if (prayers) (state.prayers = { ...state.prayers, ...prayers }), store.set("prayers", state.prayers);
      save();
      progress.show($t("import.assemble"), 0, 0);
      await tick();
      bookData();
      progress.hide();
      updateCount();
      renderList();
      if (state.view === "book") renderBook();
      if (state.view === "prepare") PREP.render();
      alert($t("import.done", { n: found.length, m: state.book.size }) + (missing.length ? "\n" + $t("import.missing", { n: missing.length, list: missing.slice(0, 30).join(", ") + (missing.length > 30 ? " …" : "") }) : ""));
      // mitgebrachtes Profil: Charakter damit verbinden; neues oder geändertes Profil wirkt erst nach dem Neuladen
      if (profileFromPackage) {
        CHARS.update(CHARS.active(), { profile });
        location.reload();
      }
    } catch (err) {
      progress.hide();
      alert(err.code ? profError(err) : $t("import.error") + " " + err.message);
    }
    ev.target.value = "";
  };
  $("#btn-clear").onclick = () => {
    if (confirm($t("set.data.clearConfirm"))) {
      state.book.clear();
      save();
      updateCount();
      renderList();
    }
  };

  // --- Charaktere --------------------------------------------------------------------
  function renderCharSwitch() {
    const sel = $("#char-switch");
    sel.innerHTML = CHARS.list().map((c) => `<option value="${e(c.id)}" ${c.id === CHARS.active() ? "selected" : ""}>${e(c.name)}</option>`).join("") + `<option value="__new">+ ${$t("set.char.newDots")}</option>`;
  }
  $("#char-switch").onchange = (ev) => {
    if (ev.target.value === "__new") return newCharacter();
    CHARS.switchTo(ev.target.value);
  };
  function newCharacter() {
    const name = prompt($t("set.char.newPrompt"));
    if (!name) return renderCharSwitch();
    CHARS.switchTo(CHARS.create(name.trim(), null).id);
  }
  let charReload = false;
  function renderCharAdmin() {
    const c = CHARS.current();
    $("#char-name").value = c.name;
    $("#char-profile").innerHTML = `<option value="">${$t("set.char.neutral")}</option>` + CHARS.profiles().map((p) => `<option value="${e(p.key)}" ${p.key === c.profile ? "selected" : ""}>${e(p.label)}</option>`).join("");
    $("#char-cls").innerHTML = Object.entries(CLASSES).map(([k, v]) => `<option value="${k}" ${k === CLASS.id ? "selected" : ""}>${e($t(`class.${k}.label`))}</option>`).join("");
    renderDeityPicker();
    $("#char-del").disabled = CHARS.list().length < 2;
    $("#char-hint").textContent = charReload ? $t("set.char.reload") : $tn("set.char.count", CHARS.list().length);
    renderProfiles();
  }
  $("#char-name").onchange = (ev) => {
    CHARS.update(CHARS.active(), { name: ev.target.value.trim() || CHARS.current().name });
    renderCharSwitch();
  };
  $("#char-profile").onchange = (ev) => {
    CHARS.update(CHARS.active(), { profile: ev.target.value || null });
    charReload = true;
    renderCharAdmin();
  };
  // Gottheit: Eingabe mit Vorschlagsliste, vorgefiltert auf die Gesinnungen der Klasse.
  // Arkane Klassen: Schutzgottheit (freiwillig, alle Gottheiten, leer = keine) nur für Andacht und Tagebuch
  function renderDeityPicker() {
    const cls = CLASSES[$("#char-cls").value] || CLASS;
    const divine = !!cls.deity;
    $("#char-deity-label").textContent = $t(divine ? "set.char.deity" : "set.char.patron");
    $("#char-deity").placeholder = $t(divine ? "set.char.deityPh" : "set.char.patronPh");
    $("#char-deity-row").querySelectorAll(".divine-only").forEach((el) => (el.hidden = !divine));
    const all = !divine || $("#char-deity-all").checked;
    const list = (window.DEITIES || []).filter((d) => all || !cls.alignments || cls.alignments.includes(d.align));
    // Beschriftung enthält den Namen: manche Browser (Firefox) suchen nur in der Beschriftung, nicht im Wert
    $("#deity-list").innerHTML = list.map((d) => `<option value="${e(d.name)}" label="${e(d.name)} – ${e(d.align)}, ${e(d.title || d.pantheon)}"></option>`).join("");
    const ch = CHARS.current();
    const cur = ch.deity === "" ? null : deityById(ch.deity) || (divine === !!CLASS.deity ? window.DEITY : null);
    if (document.activeElement !== $("#char-deity")) $("#char-deity").value = cur ? cur.name : "";
    $("#char-deity-info").textContent = cur ? `${cur.name}: ${cur.align}, ${cur.areas.join(", ")} · ${$t("set.char.symbol")}: ${cur.symbol}` : $t(divine ? "set.char.noDeity" : "set.char.noPatron");
  }
  $("#char-cls").onchange = (ev) => {
    CHARS.update(CHARS.active(), { cls: ev.target.value });
    charReload = true;
    renderCharAdmin();
  };
  $("#char-deity-all").onchange = renderDeityPicker;
  $("#char-deity").onchange = (ev) => {
    // Magier: leeres Feld = keine Schutzgottheit
    if (!ev.target.value.trim() && !(CLASSES[$("#char-cls").value] || CLASS).deity) {
      CHARS.update(CHARS.active(), { deity: "" });
      charReload = true;
      return renderCharAdmin();
    }
    const d = (window.DEITIES || []).find((x) => x.name.toLowerCase() === ev.target.value.trim().toLowerCase());
    if (!d) return ($("#char-deity-info").textContent = $t("set.char.unknownDeity"));
    CHARS.update(CHARS.active(), { deity: d.id });
    charReload = true;
    renderCharAdmin();
  };
  $("#char-new").onclick = newCharacter;
  $("#char-dup").onclick = () => {
    const c = CHARS.current();
    const name = prompt($t("set.char.copyPrompt"), c.name + " (" + $t("set.char.copy") + ")");
    if (name) CHARS.switchTo(CHARS.create(name.trim(), c.profile, c.id).id);
  };
  $("#char-del").onclick = () => {
    const c = CHARS.current();
    if (confirm($t("set.char.delConfirm", { name: c.name }))) CHARS.remove(c.id);
  };

  // --- Installierbare Web-App (sw.js, manifest.webmanifest) -------------------------------
  // Chrome/Edge bieten die Installation per beforeinstallprompt an: abfangen, als Knopf in den Einstellungen zeigen.
  // Safari meldet nichts: kurzer Hinweis. Unter file:// gibt es keinen Service Worker: Verweis auf die Online-Fassung.
  let installPrompt = null;
  const standalone = () => matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
  const appleTouch = () => /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  window.addEventListener("beforeinstallprompt", (ev) => {
    ev.preventDefault();
    installPrompt = ev;
    renderInstall();
  });
  window.addEventListener("appinstalled", () => {
    installPrompt = null;
    renderInstall();
  });
  function renderInstall() {
    const note = $("#set-install-note");
    $("#btn-install").hidden = !installPrompt;
    if (location.protocol === "file:") {
      const url = document.querySelector('meta[property="og:url"]').content;
      note.innerHTML = e($t("set.install.file")).replace("{link}", `<a href="${e(url)}" target="_blank" rel="noopener">${e(url)}</a>`);
    } else note.textContent = $t(standalone() ? "set.install.done" : installPrompt ? "set.install.note" : appleTouch() ? "set.install.ios" : "set.install.other");
  }
  $("#btn-install").onclick = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    await installPrompt.userChoice.catch(() => null);
    installPrompt = null;
    renderInstall();
  };
  // installiert: dauerhaften Speicher erbitten, damit Bücher und gespeicherte Profile nicht aufgeräumt werden
  if (standalone() && navigator.storage && navigator.storage.persist) navigator.storage.persisted().then((p) => p || navigator.storage.persist()).catch(() => {});

  // --- Profilpakete (profile-store.js): verwalten, exportieren, laden -----------------------
  const profDate = (iso) => (iso ? new Date(iso).toLocaleDateString(I18N.locale()) : "–");
  const profSlug = (s) => String(s || "profil").toLowerCase().replace(/[^a-z0-9äöüß]+/g, "-").replace(/^-|-$/g, "") || "profil";
  const profLabel = (pkg) => pkg.label || (pkg.profile && pkg.profile.owner) || pkg.key;
  function downloadJson(name, data) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 1)], { type: "application/json" }));
    a.download = name;
    a.click();
  }
  // Paket eines Profils; Vademecum: die genannten Gottheiten oder alle geladenen Einträge (Datei und gespeichert)
  function profilePackage(p, deityIds = null) {
    const ids = deityIds || [...new Set([...Object.keys((window.VADEMECUM && VADEMECUM.local) || {}), ...PROFILE_STORE.vademecumIds()])];
    return PROFILE_STORE.build(p.key, p.label, p.data, Object.fromEntries(ids.map((id) => [id, window.vademecumEntry(id)])));
  }
  function profError(err) {
    if (err.code === "notPackage") return $t("prof.notPackage");
    if (err.code === "newerVersion") return $t("prof.newerVersion", { v: err.version });
    if (err.code === "quota") return $t("prof.quota", { kb: Math.ceil(err.size / 1024) });
    return $t("import.error") + " " + err.message;
  }
  // Paket speichern, mit Rückfragen: anderes Profil unter demselben Schlüssel → eigener Schlüssel anbieten;
  // schon gespeichert → ersetzen oder behalten. Ergebnis { key, kept, shadowed }; wirft bei vollem Speicher.
  function storePackage(pkg) {
    let key = pkg.key;
    const name = profLabel(pkg);
    const cur = CHARS.profiles().find((p) => p.key === key);
    const st = PROFILE_STORE.entry(key);
    // dasselbe Profil kommt hier schon aus der Datei: nichts speichern, die Datei gilt ohnehin
    if (cur && cur.source === "file" && cur.label === name) return { key, kept: true, shadowed: true };
    if (cur && cur.label !== name && confirm($t("prof.otherLabel", { old: cur.label, oldSrc: cur.source === "file" ? $t("set.prof.file") : $t("set.prof.stored", { date: profDate(st && st.exported) }), name, newDate: profDate(pkg.exported) }))) {
      key = PROFILE_STORE.freeKey(name, CHARS.profiles().map((p) => p.key));
    } else if (st && !confirm($t("prof.replace", { name, old: profDate(st.exported), new: profDate(pkg.exported) }))) return { key, kept: true };
    PROFILE_STORE.save({ ...pkg, label: name }, key);
    CHARS.refreshProfiles();
    return { key, kept: false, shadowed: CHARS.profiles().find((p) => p.key === key).source === "file" };
  }
  function renderProfiles() {
    const list = CHARS.profiles();
    const shadowed = CHARS.shadowed();
    const row = (p, cls, src, canExport, canRemove) => `<li class="${cls}" data-key="${e(p.key)}"><span class="prof-name">${e(p.label)}</span> <span class="prof-src">${e(src)}</span>${canExport ? ` <button type="button" data-prof="export">${$t("set.prof.export")}</button>` : ""}${canRemove ? ` <button type="button" data-prof="remove" class="danger">${$t("set.prof.remove")}</button>` : ""}</li>`;
    $("#set-profiles .prof-list").innerHTML =
      list.map((p) => row(p, p.source, p.source === "file" ? $t("set.prof.file") : $t("set.prof.stored", { date: profDate(p.exported) }), true, p.source === "stored")).join("") +
      shadowed.map((x) => row({ key: x.key, label: x.label || x.key }, "stored shadowed", $t("set.prof.shadowed", { date: profDate(x.exported) }), false, true)).join("") ||
      `<li class="muted">${$t("set.prof.none")}</li>`;
  }
  $("#set-profiles .prof-list").onclick = (ev) => {
    const b = ev.target.closest("button[data-prof]");
    if (!b) return;
    const key = b.closest("li").dataset.key;
    if (b.dataset.prof === "export") {
      const p = CHARS.profiles().find((x) => x.key === key);
      if (p) downloadJson(profSlug(p.label) + $t("prof.suffix"), profilePackage(p));
    } else {
      const st = PROFILE_STORE.entry(key);
      if (!st || !confirm($t("set.prof.removeConfirm", { name: st.label || key }))) return;
      PROFILE_STORE.remove(key);
      CHARS.refreshProfiles();
      if (CHARS.current().profile === key) charReload = true;
      renderCharAdmin();
    }
  };
  $("#file-profile").onchange = async (ev) => {
    const file = ev.target.files[0];
    ev.target.value = "";
    if (!file) return;
    if (/\.js$/i.test(file.name)) return alert($t("prof.jsFile"));
    try {
      const pkg = PROFILE_STORE.parse(await file.text());
      const r = storePackage(pkg);
      if (!r.kept && CHARS.current().profile === r.key) charReload = true;
      if (!r.kept || r.shadowed) alert($t(r.shadowed ? "prof.loadedShadowed" : "prof.loaded", { name: profLabel(pkg) }));
      renderCharAdmin();
    } catch (err) {
      alert(profError(err));
    }
  };

  // --- Kreis groß anzeigen ----------------------------------------------------------
  const cm = $("#circle-modal");
  let cmSvg = null, cmName = "kreis", cmClones = 0;
  // Klon fürs Dialogfenster: eigene ids, sonst greifen href="#…" (Schriftband-textPath) auf das Original in der Seite,
  // und der Text folgt dessen Lage samt Seitenzoom statt dem Ring im Dialog
  function cloneSvg(svg) {
    const big = svg.cloneNode(true);
    suffixIds(big, "-cm" + ++cmClones);
    big.classList.add("cm-svg");
    return big;
  }
  document.addEventListener("click", (ev) => {
    const vt = ev.target.closest(".page svg.vitrail");
    if (vt && !document.body.classList.contains("printing")) return openVitrail(vt);
    const svg = ev.target.closest(".page svg.circle");
    if (!svg || document.body.classList.contains("printing")) return;
    const spellId = svg.closest("[data-spell]")?.dataset.spell;
    const x = spellId && byId.get(spellId);
    const big = cloneSvg(svg);
    if (svg.closest(".mirror")) big.style.transform = "scaleX(-1)";
    cm.querySelector(".cm-figure").replaceChildren(big);
    cmSvg = big;
    if (x) {
      const m = model(x), t = texts(x);
      cmName = x.s.id;
      cm.querySelector(".cm-head").innerHTML = `<h3>${e(t.title)}</h3><div class="muted">${e(t.epithet)} · ${e(RULES.name(x.s))}</div>`;
      cm.querySelector(".cm-legend").innerHTML =
        `<dl class="struct">${t.structure.map((s) => `<dt>${e(s.k)}</dt><dd>${e(s.t)}</dd>`).join("")}</dl>` +
        `<div class="cm-ess">${m.essences.map((y) => `<div class="essrow">${glyphSVG("essence", y.id, { s: 7, cls: y.id === m.primary ? "accent" : "" })}<span class="essname">${T.ESS[y.id].latin}</span><span class="essbar"><i style="width:${y.pct}%"></i></span><span class="esspct">${y.pct} %</span></div>`).join("")}</div>` +
        `<div class="cm-formula">${t.formula.lines.map((l) => `<div>${e(l)}</div>`).join("")}</div>`;
    } else {
      cmName = "kreis";
      cm.querySelector(".cm-head").innerHTML = `<h3>Zauberkreis</h3>`;
      cm.querySelector(".cm-legend").innerHTML = "";
    }
    cmSpell = x ? x.s.id : null;
    cmVitrail = null;
    cmAnnot = false;
    cm.dataset.legend = cm.querySelector(".cm-legend").innerHTML;
    $("#cm-annot").hidden = !x;
    $("#cm-annot").classList.remove("primary");
    cm.showModal();
  });
  function openVitrail(svg) {
    const spellId = svg.closest("[data-spell]")?.dataset.spell;
    const x = spellId && byId.get(spellId);
    const big = cloneSvg(svg);
    cm.querySelector(".cm-figure").replaceChildren(big);
    cmSvg = big;
    cmSpell = null;
    cmName = (x ? x.s.id : "fenster") + "-fenster";
    cmVitrail = x || null;
    cmAnnot = false;
    if (x) {
      const t = texts(x);
      cm.querySelector(".cm-head").innerHTML = `<h3>${e(t.title)}</h3><div class="muted">${e(t.epithet)} · ${e(RULES.name(x.s))}</div>`;
      renderModalVitrail();
    } else {
      cm.querySelector(".cm-head").innerHTML = `<h3>Andachtsbild</h3>`;
      cm.querySelector(".cm-legend").innerHTML = "";
    }
    $("#cm-annot").hidden = !x;
    cm.showModal();
  }
  // Andachtsbild im Dialog: mit „Beschriftung“ nummeriert, Legende als Liste mit denselben Nummern
  let cmVitrail = null;
  function renderModalVitrail() {
    const m = model(cmVitrail);
    cm.querySelector(".cm-figure").innerHTML = VITRAIL.render(m, window.DEITY, { annotate: cmAnnot, cls: "cm-svg" });
    cmSvg = cm.querySelector(".cm-figure svg");
    cm.querySelector(".cm-legend").innerHTML = `<ol class="annot-list">${VITRAIL.legend(m, window.DEITY).map((l) => `<li value="${l.n}"><b>${e(l.k)}:</b> ${e(l.t)}</li>`).join("")}</ol>`;
    $("#cm-annot").classList.toggle("primary", cmAnnot);
  }
  let cmSpell = null, cmAnnot = false;
  function renderModalCircle() {
    const x = cmSpell && byId.get(cmSpell);
    if (!x) return;
    const m = model(x), t = texts(x);
    cm.querySelector(".cm-figure").innerHTML = renderCircle(m, { text: t.formula.band, annotate: cmAnnot, cls: "cm-svg" });
    cmSvg = cm.querySelector(".cm-figure svg");
    cm.querySelector(".cm-legend").innerHTML = cmAnnot
      ? `<ol class="annot-list">${circleAnnotations(m).map((a) => `<li value="${a.n}"><b>${e(a.k)}:</b> ${e(a.t)}</li>`).join("")}</ol>`
      : cm.dataset.legend;
    $("#cm-annot").classList.toggle("primary", cmAnnot);
  }
  $("#cm-annot").onclick = () => {
    cmAnnot = !cmAnnot;
    cmVitrail ? renderModalVitrail() : renderModalCircle();
  };
  $("#cm-close").onclick = () => cm.close();
  cm.addEventListener("click", (ev) => { if (ev.target === cm) cm.close(); });
  // Export: Farben und Linienstile fest einbetten, damit die Datei ohne die App gleich aussieht
  const SVG_STYLE = `*{fill:none;stroke:#3b2a1a;stroke-width:1.1;stroke-linejoin:round;stroke-linecap:round}
    .fill{fill:#3b2a1a}.knock{fill:#f3e9d2}.thin{stroke-width:.55}.faint{opacity:.45}.dash{stroke-dasharray:4 3}.thick{stroke-width:3}
    .accent *,.accent{stroke:#8b1e1e}.accent .fill,.accent.fill{fill:#8b1e1e}.layer-shape{opacity:.32}.ess-seg{stroke-width:5}
    text,textPath{stroke:none;fill:#3b2a1a;font-family:Cinzel,Georgia,serif}.guide{stroke:none;fill:none}.gilded *{stroke:#a57a12}
    .annot circle{fill:#8b1e1e;stroke:#f3e9d2}.annot text{fill:#fff;font-family:Arial,sans-serif;font-weight:700}`;
  $("#cm-save").onclick = () => {
    if (!cmSvg) return;
    const out = cmSvg.cloneNode(true);
    out.removeAttribute("style");
    if (out.classList.contains("vitrail")) {
      // Andachtsbild: Farben stehen schon im SVG
      out.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      out.setAttribute("width", "800");
      out.setAttribute("height", "1600");
    } else {
      out.setAttribute("width", "1200");
      out.setAttribute("height", "1200");
      // Originalschrift des Bands mitnehmen (gekürzte Schrift als data-URL aus app/fonts/widths.js)
      const key = ((out.querySelector(".band-text[class*='script-']") || {}).className?.baseVal || "").match(/script-(\w+)/)?.[1];
      const font = key && (window.SCRIPT_FONTS || {})[key];
      const face = font ? `@font-face{font-family:"F-${key}";src:url(${font}) format("woff2")}.script-${key}{font-family:"F-${key}"}` : "";
      out.insertAdjacentHTML("afterbegin", `<rect x="-300" y="-300" width="600" height="600" fill="#f3e9d2" stroke="none"/><style>${SVG_STYLE}${face}</style>`);
    }
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([out.outerHTML], { type: "image/svg+xml" }));
    a.download = cmName + ".svg";
    a.click();
  };

  // --- Start ----------------------------------------------------------------------
  PREP.init({ byId, model, book: () => state.book, select, show, printPages, owner: () => state.settings.owner, knownLangs: () => state.settings.knownLangs });
  document.querySelectorAll(".cls-label").forEach((el) => (el.textContent = $t(`class.${CLASS.id}.label`)));
  document.querySelectorAll(".front-label").forEach((el) => (el.textContent = DIVINE ? $t("set.book.frontDivine") : $t("set.book.frontArcane")));
  if (DIVINE) {
    $('.tabs [data-view="book"] [data-i18n]').dataset.i18n = "tab.brev";
    $('.tabs [data-view="theory"]').dataset.i18n = "tab.onPrayer";
    I18N.apply();
    $("#btn-print-scrolls").hidden = true;
  }
  initFilters();
  renderCharSwitch();
  applySides();
  renderList();
  updateCount();
  const first = filtered().find((x) => x.s.name === "Fireball") || filtered()[0];
  if (first) select(first.s.id);
  // Adresse vor gemerkter Position; ohne Ziel wie bisher
  applyRoute(ROUTE.parse(location.hash));
  window.addEventListener("popstate", () => applyRoute(ROUTE.parse(location.hash)));
})();
