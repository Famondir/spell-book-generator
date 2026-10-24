// Oberfläche: Verzeichnis durchsuchen, Zauber ansehen, Buch zusammenstellen, drucken.
(function () {
  const T = window.THEORY;
  const $ = (s, el = document) => el.querySelector(s);
  const e = U.esc;

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
    onlyClass: true,
    paper: "a5",
    scrollPaper: "a4",
    printBackground: true,
    detailPrint: false,
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
      return st;
    })(),
    book: new Set(store.get("book", [])),
    selected: null,
    view: "browse",
    detailView: store.get("detailView", false),
    ui: { browseLeft: false, bookLeft: false, toc: false, ...store.get("ui", {}) },
    prayers: store.get("prayers", {}), // eigene Gebete je Zauber (göttliche Klassen)
  };
  const DIVINE = CLASS.tradition === "divine";
  document.body.classList.add(DIVINE ? "divine" : "arcane");
  const save = () => {
    store.set("settings", state.settings);
    store.set("book", [...state.book]);
  };

  // --- Daten vorbereiten -----------------------------------------------------------
  const ALL = window.SPELLS.map((s) => ({ s, m: null, t: null }));
  const byId = new Map(ALL.map((x) => [x.s.id, x]));
  const model = (x) => (x.m = x.m || analyze(x.s));
  const texts = (x) => (x.t = x.t || (DIVINE ? PRAYER.texts(model(x), window.DEITY) : generateTexts(model(x), { name: state.settings.owner })));
  ALL.forEach(model);
  ALL.forEach((x) => (x.title = texts(x).title));
  // Alltagszauber gehören zum Magierbuch, nicht zu einer Klassenliste: bei Magiern immer sichtbar, sonst nie
  const visible = () => ALL.filter((x) => (x.s.everyday ? CLASS.everyday : !state.settings.onlyClass || x.s.levels[CLASS.list] != null));

  // --- Filter ---------------------------------------------------------------------
  // Filterleisten: Verzeichnis (Präfix "") und Buch (Präfix "b")
  function initFilters() {
    for (const p of ["", "b"]) {
      const lv = $(`#${p}f-level`);
      for (const i of CLASS.grades) lv.insertAdjacentHTML("beforeend", `<option value="${i}">Grad ${i}</option>`);
      if (!CLASS.everyday) $(`#${p}f-origin`).closest("select").hidden = true;
      const sc = $(`#${p}f-school`);
      for (const [k, v] of Object.entries(T.SCHOOLS)) sc.insertAdjacentHTML("beforeend", `<option value="${k}">${v.de}</option>`);
      const es = $(`#${p}f-essence`);
      for (const x of T.ESSENCES) es.insertAdjacentHTML("beforeend", `<option value="${x.id}">${x.latin} – ${x.de}</option>`);
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
          const hay = (x.s.name + " " + (x.s.base || "") + (x.s.everyday ? " alltag" : "") + " " + x.title + " " + m.essences.map((y) => T.ESS[y.id].latin).join(" ") + " " + m.schoolInfo.de + " " + (m.combo || "")).toLowerCase();
          if (!f.q.split(/\s+/).every((w) => hay.includes(w))) return false;
        }
        return true;
      })
      .sort((a, b) => a.m.level - b.m.level || !!a.s.everyday - !!b.s.everyday || a.s.name.localeCompare(b.s.name));
  }
  const filtered = () => filterItems(visible(), readFilters(""));

  function listRow(x, opt = {}) {
    const m = x.m;
    const on = opt.remove || state.book.has(x.s.id);
    const btn = opt.remove
      ? `<button class="add on" title="Aus dem Buch entfernen">−</button>`
      : `<button class="add ${on ? "on" : ""}" title="${on ? "Aus dem Buch entfernen" : "Ins Buch aufnehmen"}">${on ? "✓" : "+"}</button>`;
    return `<li data-id="${x.s.id}" class="${state.selected === x.s.id && !opt.remove ? "sel" : ""}">
          <span class="lvl">${x.s.everyday ? "A" : m.level}</span>
          <span class="nm"><b>${e(x.s.name)}</b><i>${e(x.title)}</i></span>
          ${opt.page ? `<span class="pg" title="Seite im Buch">S. ${opt.page}</span>` : ""}
          <span class="ess" title="${e(m.essences.map((y) => T.ESS[y.id].latin + " " + y.pct + " %").join(", "))}">${quickGlyph(m)}</span>
          ${btn}
        </li>`;
  }

  function renderList() {
    const items = filtered();
    $("#list-info").textContent = `${items.length} Zauber`;
    const ul = $("#list");
    ul.innerHTML = items
      .slice(0, 600)
      .map((x) => listRow(x))
      .join("") + (items.length > 600 ? `<li class="more muted">… ${items.length - 600} weitere – Suche eingrenzen</li>` : "");
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
  });

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
      BOOK.pageHTML({ html: p.half ? `<div class="half">${p.html}</div>` : p.html, spell: m.id, cls: p.first ? "first-page" : "", halves: p.half, no: "", running: t.title + (sp.length > 1 ? ` · ${i + 1}/${sp.length}` : "") })
    );
    $("#detail").innerHTML = `
      <div class="detail-head">
        <div>
          <h2>${e(x.s.name)}</h2>
          <div class="muted">${e(t.title)} · ${e(t.epithet)}${t.custom ? ' · <span class="badge">handgeschrieben</span>' : ""}</div>
        </div>
        <div class="row">
          <button id="d-add" class="${inBook ? "" : "primary"}">${inBook ? "Aus dem Buch entfernen" : "Ins Buch aufnehmen"}</button>
          <label class="check toggle"><input type="checkbox" id="d-detail" ${state.detailView ? "checked" : ""}> Ausführliche Ansicht</label>
          <button id="d-print">Nur diesen Zauber drucken</button>
          <button id="d-scroll">Als Schriftrolle drucken</button>
        </div>
      </div>
      <div class="detail-grid">
        <div class="detail-side">
          <div class="facts">
            <div><b>Umfang im Buch</b> ${pageCount(m) === 0.5 ? "½ Seite" : pageCount(m) + (m.level === 1 ? " Seite" : " Seiten")}${state.detailView ? ` <span class="muted">(Ansicht: ausführlich, ${sp.length} Seiten)</span>` : ""}</div>
            <div><b>Essenzen</b></div>
            ${m.essences.map((y) => `<div class="essrow">${glyphSVG("essence", y.id, { s: 7, cls: y.id === m.primary ? "accent" : "" })}<span class="essname">${T.ESS[y.id].latin}</span><span class="essbar"><i style="width:${y.pct}%"></i></span><span class="esspct">${y.pct} %</span></div>`).join("")}
            ${m.combo ? `<div><b>Verbindung</b> ${e(m.combo)}</div>` : ""}
            ${m.signs.length ? `<div><b>Zeichen</b> ${m.signs.map((s) => e(s.de) + (s.dir === "in" ? " ↘" : " ↗")).join(", ")}</div>` : ""}
            <details class="why"><summary>Woher kommen die Anteile?</summary>${m.essences.map((y) => `<div><b>${T.ESS[y.id].latin}</b>: ${e(y.sources.join(", "))}</div>`).join("")}</details>
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
    $("#d-print").onclick = () => printPages(pages.join(""));
    $("#d-scroll").onclick = () => printPages(BOOK.scrollPages(m, t, { paper: state.settings.scrollPaper }).map(BOOK.pageHTML).join(""), state.settings.scrollPaper);
    BOOK.autofit($("#detail")).then(() => addRulesButtons($("#detail .pages")));
  }

  // Detailansicht für göttliche Klassen: Brevierseite, Eigene Worte bearbeiten
  function renderPrayerDetail(x) {
    const m = model(x), t = texts(x);
    const inBook = state.book.has(x.s.id);
    const own = state.prayers[x.s.id] || "";
    const pages = BOOK.prayerPages(m, t, { own }).map((p) => BOOK.pageHTML({ ...p, cls: "first-page", no: "", running: t.title }));
    $("#detail").innerHTML = `
      <div class="detail-head">
        <div>
          <h2>${e(x.s.name)}</h2>
          <div class="muted">${e(t.title)} · ${e(t.epithet)}${own ? ' · <span class="badge">eigene Worte</span>' : ""}</div>
        </div>
        <div class="row">
          <button id="d-add" class="${inBook ? "" : "primary"}">${inBook ? "Aus dem Brevier entfernen" : "Ins Brevier aufnehmen"}</button>
          <button id="d-print">Nur dieses Gebet drucken</button>
        </div>
      </div>
      <div class="detail-grid">
        <div class="detail-side">
          <div class="facts">
            <div><b>Gottheit</b> ${window.DEITY ? e(window.DEITY.name) : "keine gewählt"}</div>
            <div><b>Essenzen</b></div>
            ${m.essences.map((y) => `<div class="essrow"><span class="swatch" style="background:${VITRAIL.ESS_GLASS[y.id]}"></span><span class="essname">${T.ESS[y.id].latin}</span><span class="essbar"><i style="width:${y.pct}%"></i></span><span class="esspct">${y.pct} %</span></div>`).join("")}
          </div>
          <label class="own-edit"><b>Eigene Worte</b> <span class="muted">(dein eigenes Gebet zu diesem Zauber; leer = Linien zum Hineinschreiben)</span>
            <textarea id="d-own" rows="6" placeholder="Herrin, gib mir …">${e(own)}</textarea></label>
          ${BOOK.rulesBox(m)}
        </div>
        <div class="pages preview">${pages.join("")}</div>
      </div>`;
    $("#d-add").onclick = () => toggleBook(x.s.id);
    $("#d-print").onclick = () => printPages(pages.join(""));
    $("#d-own").onchange = (ev) => {
      const v = ev.target.value.replace(/\s+$/, "");
      if (v) state.prayers[x.s.id] = v;
      else delete state.prayers[x.s.id];
      store.set("prayers", state.prayers);
      renderDetail();
    };
    BOOK.autofit($("#detail")).then(() => addRulesButtons($("#detail .pages")));
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

  let bookCache = null;
  function bookData() {
    const key = [...state.book].sort().join(",") + "|" + JSON.stringify(state.settings) + (DIVINE ? "|" + JSON.stringify(state.prayers) : "");
    if (bookCache && bookCache.key === key) return bookCache;
    const entries = bookEntries();
    const r = BOOK.assemble(entries, state.settings, visible().map((x) => x.m), { prayers: state.prayers });
    // Einheiten: alle Seiten eines Zaubers gehören zusammen (Seitenfüllung verschiebt Blöcke zwischen ihnen)
    const units = [];
    r.pages.forEach((p, i) => {
      const last = units[units.length - 1];
      if (p.spell && last && last.spell === p.spell) last.n++;
      else units.push({ spell: p.spell || null, start: i, n: 1 });
    });
    const pageBySpell = new Map(r.toc.map((x) => [x.m.id, x.page]));
    // Vorspann fürs Inhaltsverzeichnis: Titel jeder Seite bis zur ersten Formel (Fortsetzungsseiten zusammengefasst)
    const front = [];
    const strip = (h) => h.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
    for (const p of r.pages) {
      if (p.spell || p.halves || /chapter-page|chapter-list/.test(p.cls || "")) break; // Kapitel gehören nicht zum Vorspann
      const h = /<h[123][^>]*>([\s\S]*?)<\/h[123]>/.exec(p.html);
      const title = /title-page/.test(p.cls || "") ? "Titelblatt" : h ? strip(h[1]) : null;
      if (title && title !== front[front.length - 1]?.title) front.push({ title, page: p.no });
    }
    const idxByNo = new Map(r.pages.map((p, i) => [p.no, i]));
    // Seitenindizes, an denen ein Zauber beginnt (für „vorheriger/nächster Zauber“)
    const starts = [...new Set(r.toc.map((x) => idxByNo.get(x.page)))].filter((i) => i != null).sort((x, y) => x - y);
    bookCache = { key, entries, ...r, units, pageBySpell, front, starts, idxByNo };
    view.rendered = null;
    return bookCache;
  }

  // Position: g = Index der ersten sichtbaren Seite (über alle Seiten, der Regelanhang zählt nach dem Rendern mit)
  const view = { g: store.get("bookPos", 0), rendered: null, nav: null };
  const spreadSize = () => {
    const w = $("#book-pages").clientWidth;
    return w >= 2 * 560 + 18 ? 2 : 1; // A5 = 148 mm ≈ 560 px
  };
  const unitAt = (d, g) => {
    for (let i = d.units.length - 1; i >= 0; i--) if (g >= d.units[i].start) return i;
    return 0;
  };

  function renderBook() {
    const d = bookData();
    const byLevel = {};
    const lvKey = (m) => (BOOK.chapterKey(m) === "foreign" ? "F" : m.spell.everyday ? "A" : m.level);
    d.entries.forEach(({ m }) => (byLevel[lvKey(m)] = (byLevel[lvKey(m)] || 0) + 1));
    $("#book-stats").innerHTML = d.entries.length
      ? `<b>${d.entries.length}</b> ${DIVINE ? "Gebete" : "Formeln"} · <b>${d.spellPagesCount}</b> Seiten ${DIVINE ? "Gebete" : "Formeln"}${d.chapterPages ? ` · ${d.chapterPages} Kapitelseiten` : ""}${d.fillers ? ` · ${d.fillers} Notizseiten` : ""}${d.expanded ? ` · ${d.expanded} Zauber im Umfang des nächsthöheren Grades` : ""} · <b>${d.pages.length}</b> Seiten gesamt
         ${DIVINE ? "" : `<span class="muted">(Gesegnetes Buch: 1000 Seiten · gewöhnliches Zauberbuch: 100 Seiten)</span>`}
         <div class="muted">${Object.entries(byLevel).map(([l, n]) => (l === "A" ? "Alltag" : l === "F" ? "Fremde Gebete" : "Grad " + l) + ": " + n).join(" · ")}</div>`
      : `${DIVINE ? "Das Brevier" : "Das Buch"} ist leer. Nimm im Verzeichnis Zauber mit <b>+</b> auf.`;
    renderBookList();
    renderBookToc();
    showSpread();
  }

  // Ausschnitt um Seite g: im Doppelseitenmodus wie ein gebundenes Buch
  // (Index 0 = Seite 1 rechts allein, danach 1|2, 3|4 … = gerade Seite links, ungerade rechts)
  const spreadAt = (g, s, total) => {
    g = Math.max(0, Math.min(g, total - 1));
    if (s === 1) return [g, g];
    if (g === 0) return [0, 0];
    const a = g % 2 === 1 ? g : g - 1;
    return [a, Math.min(a + 1, total - 1)];
  };

  function showSpread() {
    const d = bookData();
    const root = $("#book-pages");
    if (!d.pages.length) {
      root.innerHTML = "";
      $("#book-pager").innerHTML = "";
      return;
    }
    const s = spreadSize();
    // schmale Bildschirme: eine Seite auf Bildschirmbreite verkleinern
    const w = root.clientWidth;
    root.style.zoom = s === 1 && w < 560 ? (w / 570).toFixed(3) : "";
    const [ga, gb] = spreadAt(view.g, s, d.pages.length);
    view.g = ga;
    store.set("bookPos", ga);
    const u0 = unitAt(d, ga), u1 = unitAt(d, gb);
    const want = u0 + "-" + u1;
    const reveal = () => {
      // DOM-Seiten den Seitenindizes zuordnen und nur den aktuellen Ausschnitt zeigen
      const pages = [...root.querySelectorAll(":scope > .page")];
      pages.forEach((pg) => pg.classList.toggle("offstage", +pg.dataset.idx < ga || +pg.dataset.idx > gb));
      root.querySelectorAll(".page-ghost").forEach((x) => x.remove());
      // Seite 1 liegt rechts: links ein leerer Platzhalter
      if (s === 2 && ga === 0) pages[0]?.insertAdjacentHTML("beforebegin", `<div class="page-ghost"></div>`);
      renderPager(d, ga, gb);
    };
    if (view.rendered === want) return reveal();
    view.rendered = want;
    const start = d.units[u0].start;
    root.innerHTML = d.pages.slice(start, d.units[u1].start + d.units[u1].n).map((p, i) => BOOK.pageHTML(p).replace("<section ", `<section data-idx="${start + i}" `)).join("");
    root.classList.add("fitting");
    renderPager(d, ga, gb);
    $("#book-pager").insertAdjacentHTML("beforeend", `<span class="muted pager-busy">Seiten werden gesetzt …</span>`);
    BOOK.autofit(root).then(() => {
      if (view.rendered !== want) return;
      root.classList.remove("fitting");
      addRulesButtons(root);
      reveal();
    });
  }

  function renderPager(d, a, b) {
    const total = d.pages.length;
    const from = d.pages[a].no || a + 1, to = b > a ? d.pages[b].no || b + 1 : null;
    const prevSpell = d.starts.filter((i) => i < a).pop(), nextSpell = d.starts.find((i) => i > b);
    view.nav = { a, b, prevSpell, nextSpell };
    $("#book-pager").innerHTML = `
      <button data-go="first" title="Anfang" ${a === 0 ? "disabled" : ""}>⏮</button>
      <button data-go="prevSpell" title="Vorheriger Zauber" ${prevSpell == null ? "disabled" : ""}>«</button>
      <button data-go="prev" title="Zurückblättern" ${a === 0 ? "disabled" : ""}>‹</button>
      <span class="pager-pos">Seite <input type="text" inputmode="numeric" id="book-goto" title="Seitenzahl eingeben und Enter drücken" value="${from}${to ? `–${to}` : ""}" size="${String(from).length + (to ? String(to).length + 1 : 0) + 1}"> <span class="muted">von ${d.pages[total - 1].no || total}</span></span>
      <button data-go="next" title="Weiterblättern" ${b >= total - 1 ? "disabled" : ""}>›</button>
      <button data-go="nextSpell" title="Nächster Zauber" ${nextSpell == null ? "disabled" : ""}>»</button>
      <button data-go="last" title="Ende" ${b >= total - 1 ? "disabled" : ""}>⏭</button>
      <button id="book-toc-toggle" class="${state.ui.toc ? "on" : ""}" title="Inhaltsverzeichnis rechts ein-/ausklappen">Inhalt</button>`;
  }

  $("#book-pager").addEventListener("click", (ev) => {
    const b = ev.target.closest("button");
    if (!b || !view.nav) return;
    if (b.id === "book-toc-toggle") return toggleSide("toc");
    const n = view.nav, total = bookData().pages.length;
    const go = { first: 0, prev: n.a - 1, next: n.b + 1, last: total - 1, prevSpell: n.prevSpell, nextSpell: n.nextSpell }[b.dataset.go];
    if (go == null) return;
    view.g = go;
    showSpread();
  });
  $("#book-pager").addEventListener("change", (ev) => {
    if (ev.target.id !== "book-goto") return;
    const no = parseInt(ev.target.value, 10);
    if (no > 0) gotoPageNo(no);
  });
  document.addEventListener("keydown", (ev) => {
    if (state.view !== "book" || /INPUT|SELECT|TEXTAREA/.test(document.activeElement?.tagName) || document.querySelector("dialog[open]")) return;
    if (ev.key === "ArrowRight" || ev.key === "PageDown") $('#book-pager [data-go="next"]')?.click();
    if (ev.key === "ArrowLeft" || ev.key === "PageUp") $('#book-pager [data-go="prev"]')?.click();
  });
  function gotoPageNo(no) {
    const d = bookData();
    const i = d.pages.findIndex((p) => p.no === no);
    view.g = i >= 0 ? i : no > (d.pages[d.pages.length - 1]?.no || 0) ? d.pages.length - 1 : 0;
    showSpread();
  }
  let resizeT = null;
  window.addEventListener("resize", () => {
    clearTimeout(resizeT);
    resizeT = setTimeout(() => state.view === "book" && showSpread(), 150);
  });

  // Filterbare Liste der Buchzauber (wie das Verzeichnis, mit − statt +)
  function renderBookList() {
    const d = bookData();
    const items = filterItems([...state.book].map((id) => byId.get(id)).filter(Boolean), readFilters("b"));
    $("#book-list-info").textContent = `${items.length} von ${d.entries.length} Zaubern im ${DIVINE ? "Brevier" : "Buch"}`;
    $("#book-list").innerHTML = items.map((x) => listRow(x, { remove: true, page: d.pageBySpell.get(x.s.id) })).join("");
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
    const no = bookData().pageBySpell.get(id);
    if (no) gotoPageNo(no);
  });

  // Inhaltsverzeichnis rechts: Akkordeon, Abschnitte zu Beginn eingeklappt
  const tocOpen = new Set();
  function renderBookToc() {
    const d = bookData();
    const groups = [];
    const add = (name, li) => {
      if (!groups.length || groups[groups.length - 1].name !== name) groups.push({ name, items: [] });
      groups[groups.length - 1].items.push(li);
    };
    d.front.forEach((x) => add("Vorspann", `<li data-page="${x.page}"><span class="q"></span><span class="nm"><b>${e(x.title)}</b></span><span class="pg">${x.page}</span></li>`));
    const chapterPage = new Map((d.chapters || []).map((c) => [c.name, c.page]));
    d.toc.forEach((x) => {
      const gr = BOOK.chapterName(BOOK.chapterKey(x.m));
      if (chapterPage.has(gr) && (!groups.length || groups[groups.length - 1].name !== gr))
        add(gr, `<li data-page="${chapterPage.get(gr)}" class="toc-chapter"><span class="q"></span><span class="nm"><b>Kapitelseite</b></span><span class="pg">${chapterPage.get(gr)}</span></li>`);
      add(gr, `<li data-page="${x.page}"><span class="q">${quickGlyph(x.m)}</span><span class="nm"><b>${e(x.t.title)}</b><i>${e(x.m.name)}</i></span><span class="pg">${x.page}</span></li>`);
    });
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
    if (li) gotoPageNo(+li.dataset.page);
  });

  // Regeltext auf Abruf: (i) an jedem Zauberkopf der Vorschau
  function addRulesButtons(root) {
    root.querySelectorAll(".sp-head").forEach((h) => {
      const id = h.closest("[data-spell]")?.dataset.spell;
      if (!id || h.querySelector(".rules-i")) return;
      h.insertAdjacentHTML("beforeend", `<button class="rules-i" data-spell="${e(id)}" title="Regeltext anzeigen">i</button>`);
      tintToPage(h.querySelector(".rules-i"));
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
    const b = ev.target.closest(".rules-i");
    if (!b) return;
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
  }
  function toggleSide(k) {
    state.ui[k] = !state.ui[k];
    store.set("ui", state.ui);
    applySides();
    if (state.view === "book") showSpread();
  }
  document.querySelectorAll(".side-toggle").forEach((b) => (b.onclick = () => toggleSide(b.dataset.side)));

  function renderTheory() {
    const pages = BOOK.frontMatter(state.settings, visible().map((x) => x.m)).slice(1);
    $("#theory-pages").innerHTML = pages.map((p, i) => BOOK.pageHTML({ ...p, no: i + 1, running: DIVINE ? "Vom Gebet" : "Lehre der Kreise" })).join("");
    BOOK.autofit($("#theory-pages"));
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
  let printing = false;
  async function printPages(pages, paperOverride, label = "Seiten setzen", after = null) {
    if (printing) return;
    printing = true;
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
    const done = () => {
      document.body.classList.remove("printing");
      root.innerHTML = "";
      printing = false;
      window.removeEventListener("afterprint", done);
    };
    window.addEventListener("afterprint", done);
    try {
      const html = typeof pages === "string" ? pages : pages.map(BOOK.pageHTML).join("");
      const key = U.hash(html) + "|" + html.length + "|" + paper;
      if (printCache.has(key)) root.innerHTML = printCache.get(key);
      else {
        progress.show(label, 0, typeof pages === "string" ? 1 : pages.length);
        await tick();
        await BOOK.typeset(root, pages, (n, total) => progress.show(label, n, total));
        if (after) await after(root);
        printCache.set(key, root.innerHTML);
        if (printCache.size > 3) printCache.delete(printCache.keys().next().value);
      }
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
    setTimeout(() => window.print(), 50);
  }
  $("#btn-print-scrolls").onclick = () => {
    const entries = bookEntries();
    if (!entries.length) return;
    printPages(entries.flatMap(({ m, t }) => BOOK.scrollPages(m, t, { paper: state.settings.scrollPaper })), state.settings.scrollPaper, "Schriftrollen setzen");
  };
  $("#btn-print-book").onclick = () => printPages(bookData().pages, null, "Buch setzen");
  $("#btn-print-rules").onclick = () => {
    const d = bookData();
    if (d.entries.length) printPages(BOOK.rulesBook(d.entries, state.settings), null, "Regelband setzen", BOOK.rulesIndex);
  };

  // --- Ansichten ------------------------------------------------------------------
  function show(view) {
    state.view = view;
    history.replaceState(null, "", view === "browse" ? location.pathname : "#" + view);
    document.querySelectorAll(".tabs button").forEach((b) => b.classList.toggle("active", b.dataset.view === view));
    document.querySelectorAll(".view").forEach((v) => v.classList.toggle("active", v.id === "view-" + view));
    if (view === "book") renderBook();
    if (view === "theory" && !$("#theory-pages").innerHTML) renderTheory();
    if (view === "prepare") PREP.render();
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
    renderCharAdmin();
    dlg.showModal();
  };
  dlg.addEventListener("close", () => {
    if (charReload) return location.reload();
    const f = dlg.querySelector("form");
    const owner = state.settings.owner, only = state.settings.onlyClass;
    for (const k of Object.keys(DEFAULTS)) {
      const el = f.elements[k];
      if (!el) continue;
      state.settings[k] = el.type === "checkbox" ? el.checked : el.value;
    }
    save();
    if (state.settings.owner !== owner) ALL.forEach((x) => (x.t = null)); // Besitzername steckt in den Randnotizen; Titel bleiben gleich
    if (state.settings.onlyClass !== only || state.settings.owner !== owner) renderList();
    if (state.selected) renderDetail();
    $("#theory-pages").innerHTML = "";
    if (state.view !== "browse") show(state.view);
  });
  $("#btn-export").onclick = () => {
    const ch = CHARS.current();
    const data = { character: ch.name, profile: ch.profile, cls: CLASS.id, deity: ch.deity || null, prayers: state.prayers, book: [...state.book].map((id) => byId.get(id)?.s.name).filter(Boolean), settings: state.settings, preparation: PREP.exportData() };
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
    a.download = (ch.name || state.settings.owner || "zauberbuch").toLowerCase().replace(/[^a-z0-9äöüß]+/g, "-") + "-zauberbuch.json";
    a.click();
  };
  $("#file-import").onchange = async (ev) => {
    const file = ev.target.files[0];
    if (!file) return;
    try {
      let names = [], settings = null, preparation = null, character = null, profile = null, extra = {}, prayers = null;
      if (/\.xlsx$/i.test(file.name)) names = await IMPORT.xlsxNames(await file.arrayBuffer());
      else if (/\.json$/i.test(file.name)) {
        const data = JSON.parse(await file.text());
        names = data.book || [];
        settings = data.settings || null;
        preparation = data.preparation || null;
        character = data.character || null;
        profile = data.profile || null;
        if (data.cls) extra.cls = data.cls;
        if (data.deity) extra.deity = data.deity;
        prayers = data.prayers || null;
      } else names = IMPORT.textNames(await file.text());
      const norm = (n) => String(n).toLowerCase().replace(/[^a-z0-9äöüß]/g, "");
      const lookup = new Map(ALL.map((x) => [norm(x.s.name), x.s.id]));
      const missing = [];
      const found = [];
      for (let i = 0; i < names.length; i++) {
        const n = names[i];
        const id = lookup.get(norm(n)) || (byId.has(n) ? n : null);
        if (id) found.push(id);
        else missing.push(n);
        if (i % 25 === 0) progress.show("Zauber zuordnen", i + 1, names.length), await tick();
      }
      progress.hide();
      if (!found.length) throw new Error("Keine bekannten Zaubernamen gefunden.");
      // Datei eines anderen Charakters: als neuen Charakter anlegen?
      if (character && character !== CHARS.current().name && confirm(`Die Datei gehört zu „${character}“.\nOK = als neuen Charakter anlegen, Abbrechen = in „${CHARS.current().name}“ übernehmen.`)) {
        const c = CHARS.create(character, CHARS.profiles().some((p) => p.key === profile) ? profile : null, null, extra);
        CHARS.write(c.id, "book", found);
        if (prayers) CHARS.write(c.id, "prayers", prayers);
        if (settings) CHARS.write(c.id, "settings", settings);
        if (preparation) {
          if (preparation.state) CHARS.write(c.id, "prep", preparation.state);
          if (preparation.presets) CHARS.write(c.id, "prepPresets", preparation.presets);
          if (preparation.log) CHARS.write(c.id, "prepLog", preparation.log);
          if (preparation.days) CHARS.write(c.id, "prepDays", preparation.days);
        }
        progress.hide();
        alert(`Charakter „${character}“ mit ${found.length} Zaubern angelegt.` + (missing.length ? `\nNicht gefunden (${missing.length}): ${missing.slice(0, 30).join(", ")}` : ""));
        CHARS.switchTo(c.id);
        return;
      }
      const replace = !state.book.size || confirm(`${found.length} Zauber gefunden.\nOK = Buch ersetzen, Abbrechen = zum bestehenden Buch hinzufügen.`);
      if (replace) state.book = new Set();
      view.g = 0;
      found.forEach((id) => state.book.add(id));
      if (settings) Object.assign(state.settings, settings);
      if (preparation) PREP.importData(preparation);
      if (prayers) (state.prayers = { ...state.prayers, ...prayers }), store.set("prayers", state.prayers);
      save();
      progress.show("Buch zusammensetzen", 0, 0);
      await tick();
      bookData();
      progress.hide();
      updateCount();
      renderList();
      if (state.view === "book") renderBook();
      if (state.view === "prepare") PREP.render();
      alert(`${found.length} Zauber übernommen, ${state.book.size} jetzt im Buch.` + (missing.length ? `\nNicht gefunden (${missing.length}): ${missing.slice(0, 30).join(", ")}${missing.length > 30 ? " …" : ""}` : ""));
    } catch (err) {
      progress.hide();
      alert("Datei konnte nicht gelesen werden: " + err.message);
    }
    ev.target.value = "";
  };
  $("#btn-clear").onclick = () => {
    if (confirm("Alle Zauber aus dem Buch entfernen?")) {
      state.book.clear();
      save();
      updateCount();
      renderList();
    }
  };

  // --- Charaktere --------------------------------------------------------------------
  function renderCharSwitch() {
    const sel = $("#char-switch");
    sel.innerHTML = CHARS.list().map((c) => `<option value="${e(c.id)}" ${c.id === CHARS.active() ? "selected" : ""}>${e(c.name)}</option>`).join("") + `<option value="__new">+ Neuer Charakter …</option>`;
  }
  $("#char-switch").onchange = (ev) => {
    if (ev.target.value === "__new") return newCharacter();
    CHARS.switchTo(ev.target.value);
  };
  function newCharacter() {
    const name = prompt("Name des neuen Charakters:");
    if (!name) return renderCharSwitch();
    CHARS.switchTo(CHARS.create(name.trim(), null).id);
  }
  let charReload = false;
  function renderCharAdmin() {
    const c = CHARS.current();
    $("#char-name").value = c.name;
    $("#char-profile").innerHTML = `<option value="">Neutral (data/profile.js)</option>` + CHARS.profiles().map((p) => `<option value="${e(p.key)}" ${p.key === c.profile ? "selected" : ""}>${e(p.label)}</option>`).join("");
    $("#char-cls").innerHTML = Object.entries(CLASSES).map(([k, v]) => `<option value="${k}" ${k === CLASS.id ? "selected" : ""}>${e(v.label)}</option>`).join("");
    renderDeityPicker();
    $("#char-del").disabled = CHARS.list().length < 2;
    $("#char-hint").textContent = charReload ? "Das neue Profil gilt nach dem Schließen (die Seite lädt neu)." : `${CHARS.list().length} Charakter${CHARS.list().length > 1 ? "e" : ""} in diesem Browser.`;
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
  // Gottheit: Eingabe mit Vorschlagsliste, vorgefiltert auf die Gesinnungen der Klasse
  function renderDeityPicker() {
    const cls = CLASSES[$("#char-cls").value] || CLASS;
    $("#char-deity-row").hidden = !cls.deity;
    if (!cls.deity) return;
    const all = $("#char-deity-all").checked;
    const list = (window.DEITIES || []).filter((d) => all || !cls.alignments || cls.alignments.includes(d.align));
    $("#deity-list").innerHTML = list.map((d) => `<option value="${e(d.name)}">${e(d.align)} · ${e(d.title || d.pantheon)}</option>`).join("");
    const cur = deityById(CHARS.current().deity) || (CLASS.deity ? window.DEITY : null);
    if (document.activeElement !== $("#char-deity")) $("#char-deity").value = cur ? cur.name : "";
    $("#char-deity-info").textContent = cur ? `${cur.name}: ${cur.align}, ${cur.areas.join(", ")} · Symbol: ${cur.symbol}` : "Noch keine Gottheit gewählt (Standard: Iomedae).";
  }
  $("#char-cls").onchange = (ev) => {
    CHARS.update(CHARS.active(), { cls: ev.target.value });
    charReload = true;
    renderCharAdmin();
  };
  $("#char-deity-all").onchange = renderDeityPicker;
  $("#char-deity").onchange = (ev) => {
    const d = (window.DEITIES || []).find((x) => x.name.toLowerCase() === ev.target.value.trim().toLowerCase());
    if (!d) return ($("#char-deity-info").textContent = "Unbekannte Gottheit – bitte aus der Liste wählen.");
    CHARS.update(CHARS.active(), { deity: d.id });
    charReload = true;
    renderCharAdmin();
  };
  $("#char-new").onclick = newCharacter;
  $("#char-dup").onclick = () => {
    const c = CHARS.current();
    const name = prompt("Name der Kopie:", c.name + " (Kopie)");
    if (name) CHARS.switchTo(CHARS.create(name.trim(), c.profile, c.id).id);
  };
  $("#char-del").onclick = () => {
    const c = CHARS.current();
    if (confirm(`Charakter „${c.name}“ mit Buch, Vorbereitung und Protokoll endgültig löschen?\nTipp: vorher „Liste exportieren“.`)) CHARS.remove(c.id);
  };

  // --- Kreis groß anzeigen ----------------------------------------------------------
  const cm = $("#circle-modal");
  let cmSvg = null, cmName = "kreis";
  document.addEventListener("click", (ev) => {
    const vt = ev.target.closest(".page svg.vitrail");
    if (vt && !document.body.classList.contains("printing")) return openVitrail(vt);
    const svg = ev.target.closest(".page svg.circle");
    if (!svg || document.body.classList.contains("printing")) return;
    const spellId = svg.closest("[data-spell]")?.dataset.spell;
    const x = spellId && byId.get(spellId);
    const big = svg.cloneNode(true);
    big.classList.add("cm-svg");
    if (svg.closest(".mirror")) big.style.transform = "scaleX(-1)";
    cm.querySelector(".cm-figure").replaceChildren(big);
    cmSvg = big;
    if (x) {
      const m = model(x), t = texts(x);
      cmName = x.s.id;
      cm.querySelector(".cm-head").innerHTML = `<h3>${e(t.title)}</h3><div class="muted">${e(t.epithet)} · ${e(x.s.name)}</div>`;
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
    cmAnnot = false;
    cm.dataset.legend = cm.querySelector(".cm-legend").innerHTML;
    $("#cm-annot").hidden = !x;
    $("#cm-annot").classList.remove("primary");
    cm.showModal();
  });
  function openVitrail(svg) {
    const spellId = svg.closest("[data-spell]")?.dataset.spell;
    const x = spellId && byId.get(spellId);
    const big = svg.cloneNode(true);
    big.classList.add("cm-svg");
    cm.querySelector(".cm-figure").replaceChildren(big);
    cmSvg = big;
    cmSpell = null;
    cmName = (x ? x.s.id : "fenster") + "-fenster";
    if (x) {
      const m = model(x), t = texts(x);
      cm.querySelector(".cm-head").innerHTML = `<h3>${e(t.title)}</h3><div class="muted">${e(t.epithet)} · ${e(x.s.name)}</div>`;
      cm.querySelector(".cm-legend").innerHTML = `<dl class="struct">${VITRAIL.legend(m, window.DEITY).map((l) => `<dt>${e(l.k)}</dt><dd>${e(l.t)}</dd>`).join("")}</dl>`;
    } else {
      cm.querySelector(".cm-head").innerHTML = `<h3>Andachtsbild</h3>`;
      cm.querySelector(".cm-legend").innerHTML = "";
    }
    $("#cm-annot").hidden = true;
    cm.showModal();
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
    renderModalCircle();
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
      out.insertAdjacentHTML("afterbegin", `<rect x="-300" y="-300" width="600" height="600" fill="#f3e9d2" stroke="none"/><style>${SVG_STYLE}</style>`);
    }
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([out.outerHTML], { type: "image/svg+xml" }));
    a.download = cmName + ".svg";
    a.click();
  };

  // --- Start ----------------------------------------------------------------------
  PREP.init({ byId, model, book: () => state.book, select, show, printPages, owner: () => state.settings.owner });
  document.querySelectorAll(".cls-label").forEach((el) => (el.textContent = CLASS.label));
  document.querySelectorAll(".front-label").forEach((el) => (el.textContent = DIVINE ? "Gottheit, Vom Lesen der Fenster, Vom Gebet" : "Lehre der Kreise"));
  if (DIVINE) {
    $('.tabs [data-view="book"]').firstChild.textContent = "Mein Brevier ";
    $('.tabs [data-view="theory"]').textContent = "Vom Gebet";
    $("#btn-print-scrolls").hidden = true;
  }
  initFilters();
  renderCharSwitch();
  applySides();
  renderList();
  updateCount();
  const first = filtered().find((x) => x.s.name === "Fireball") || filtered()[0];
  if (first) select(first.s.id);
  const hashView = location.hash.slice(1);
  if (["book", "theory", "prepare"].includes(hashView)) show(hashView);
})();
