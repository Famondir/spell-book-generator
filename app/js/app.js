// Oberfläche: Verzeichnis durchsuchen, Zauber ansehen, Buch zusammenstellen, drucken.
(function () {
  const T = window.THEORY;
  const $ = (s, el = document) => el.querySelector(s);
  const e = U.esc;

  // --- Zustand (lokal im Browser gespeichert) -----------------------------------
  const DEFAULTS = {
    owner: PROFILE.owner,
    bookTitle: PROFILE.bookTitle,
    subtitle: PROFILE.subtitle,
    rules: "appendix",
    frontMatter: true,
    onlyWizard: true,
    paper: "a5",
    scrollPaper: "a4",
    printBackground: true,
    detailPrint: false,
  };
  const store = {
    get(k, d) {
      try {
        const v = localStorage.getItem("spellbook." + k);
        return v ? JSON.parse(v) : d;
      } catch (_) {
        return d;
      }
    },
    set(k, v) {
      try {
        localStorage.setItem("spellbook." + k, JSON.stringify(v));
      } catch (_) { /* privater Modus o. Ä. */ }
    },
  };
  const state = {
    settings: { ...DEFAULTS, ...store.get("settings", {}) },
    book: new Set(store.get("book", [])),
    selected: null,
    view: "browse",
    detailView: store.get("detailView", false),
    ui: { browseLeft: false, bookLeft: false, toc: false, ...store.get("ui", {}) },
  };
  const save = () => {
    store.set("settings", state.settings);
    store.set("book", [...state.book]);
  };

  // --- Daten vorbereiten -----------------------------------------------------------
  const ALL = window.SPELLS.map((s) => ({ s, m: null, t: null }));
  const byId = new Map(ALL.map((x) => [x.s.id, x]));
  const model = (x) => (x.m = x.m || analyze(x.s));
  const texts = (x) => (x.t = x.t || generateTexts(model(x), { name: state.settings.owner }));
  ALL.forEach(model);
  ALL.forEach((x) => (x.title = texts(x).title));
  // Alltagszauber sind immer sichtbar – sie gehören zum Buch, nicht zu einer Klassenliste
  const visible = () => ALL.filter((x) => !state.settings.onlyWizard || x.s.levels.wizard != null || x.s.everyday);

  // --- Filter ---------------------------------------------------------------------
  // Filterleisten: Verzeichnis (Präfix "") und Buch (Präfix "b")
  function initFilters() {
    for (const p of ["", "b"]) {
      const lv = $(`#${p}f-level`);
      for (let i = 0; i <= 9; i++) lv.insertAdjacentHTML("beforeend", `<option value="${i}">Grad ${i}</option>`);
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
    BOOK.autofit($("#detail"));
  }

  // --- Buchansicht ----------------------------------------------------------------
  // Das ganze Buch wird nur zusammengesetzt (HTML-Strings), aber nie komplett gerendert:
  // Die Vorschau baut nur die Seiten der gerade sichtbaren Zauber auf und blättert in 1er- oder 2er-Schritten.
  function bookEntries() {
    return [...state.book]
      .map((id) => byId.get(id))
      .filter(Boolean)
      .sort((a, b) => a.m.level - b.m.level || !!a.s.everyday - !!b.s.everyday || a.title.localeCompare(b.title))
      .map((x) => ({ m: model(x), t: texts(x) }));
  }

  let bookCache = null;
  function bookData() {
    const key = [...state.book].sort().join(",") + "|" + JSON.stringify(state.settings);
    if (bookCache && bookCache.key === key) return bookCache;
    const entries = bookEntries();
    const r = BOOK.assemble(entries, state.settings, visible().map((x) => x.m));
    // Einheiten: alle Seiten eines Zaubers gehören zusammen (Seitenfüllung verschiebt Blöcke zwischen ihnen)
    const units = [];
    r.pages.forEach((p, i) => {
      const last = units[units.length - 1];
      if (p.spell && last && last.spell === p.spell) last.n++;
      else units.push({ spell: p.spell || null, start: i, n: 1, flow: /\bflow\b/.test(p.cls || "") });
    });
    const pageBySpell = new Map(r.toc.map((x) => [x.m.id, x.page]));
    bookCache = { key, entries, ...r, units, pageBySpell, flowPages: null };
    view.rendered = null;
    return bookCache;
  }

  // Position: g = Index der ersten sichtbaren Seite (über alle Seiten, der Regelanhang zählt nach dem Rendern mit)
  const view = { g: store.get("bookPos", 0), rendered: null, busy: false };
  const spreadSize = () => {
    const w = $("#book-pages").clientWidth;
    return w >= 2 * 560 + 18 ? 2 : 1; // A5 = 148 mm ≈ 560 px
  };
  const totalPages = (d) => {
    const last = d.units[d.units.length - 1];
    return last && last.flow ? last.start + (d.flowPages || 1) : d.pages.length;
  };
  const unitAt = (d, g) => {
    for (let i = d.units.length - 1; i >= 0; i--) if (g >= d.units[i].start) return i;
    return 0;
  };

  function renderBook() {
    const d = bookData();
    const byLevel = {};
    d.entries.forEach(({ m }) => (byLevel[m.spell.everyday ? "A" : m.level] = (byLevel[m.spell.everyday ? "A" : m.level] || 0) + 1));
    $("#book-stats").innerHTML = d.entries.length
      ? `<b>${d.entries.length}</b> Formeln · <b>${d.spellPagesCount}</b> Seiten Formeln
         <span class="muted">(Gesegnetes Buch: 1000 Seiten · gewöhnliches Zauberbuch: 100 Seiten)</span>
         <div class="muted">${Object.entries(byLevel).map(([l, n]) => (l === "A" ? "Alltag" : "Grad " + l) + ": " + n).join(" · ")}</div>`
      : `Das Buch ist leer. Nimm im Verzeichnis Zauber mit <b>+</b> auf.`;
    renderBookList();
    renderBookToc();
    showSpread();
  }

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
    let g = Math.max(0, Math.min(view.g, totalPages(d) - 1));
    g -= g % s;
    view.g = g;
    store.set("bookPos", g);
    const u0 = unitAt(d, g), u1 = unitAt(d, Math.min(g + s - 1, totalPages(d) - 1));
    const want = u0 + "-" + u1;
    const reveal = () => {
      // DOM-Seiten den globalen Seitenindizes zuordnen und nur den aktuellen Ausschnitt zeigen
      const pages = [...root.querySelectorAll(":scope > .page")];
      let unitIdx = -1, gi = 0;
      for (const pg of pages) {
        const u = +pg.dataset.unit;
        if (u !== unitIdx) (unitIdx = u), (gi = d.units[u].start);
        else gi++;
        pg.classList.toggle("offstage", gi < g || gi >= g + s);
      }
      const flowUnit = d.units.findIndex((x) => x.flow);
      if (flowUnit >= 0 && view.rendered && +view.rendered.split("-")[1] >= flowUnit && !d.flowPages) {
        // Länge des Regelanhangs steht erst jetzt fest; „Ende“ dann wirklich ans Ende
        d.flowPages = pages.filter((p) => +p.dataset.unit === flowUnit).length;
        if (view.toEnd) {
          view.toEnd = false;
          view.g = totalPages(d) - 1;
          return showSpread();
        }
      }
      view.toEnd = false;
      renderPager(d, g, s, pages.filter((p) => !p.classList.contains("offstage")).map((p, i) => p.querySelector(".page-foot span:last-child")?.textContent || d.pages[g + i]?.no || g + i + 1));
    };
    if (view.rendered === want) return reveal();
    view.rendered = want;
    root.innerHTML = d.pages.slice(d.units[u0].start, d.units[u1].start + d.units[u1].n).map((p, i) => {
      const gi = d.units[u0].start + i;
      return BOOK.pageHTML(p).replace("<section ", `<section data-unit="${unitAt(d, gi)}" `);
    }).join("");
    root.classList.add("fitting");
    renderPager(d, g, s);
    $("#book-pager").insertAdjacentHTML("beforeend", `<span class="muted pager-busy">Seiten werden gesetzt …</span>`);
    BOOK.autofit(root).then(() => {
      if (view.rendered !== want) return;
      root.classList.remove("fitting");
      reveal();
    });
  }

  function renderPager(d, g, s, shown) {
    const total = totalPages(d);
    const flowLast = d.units[d.units.length - 1]?.flow && !d.flowPages;
    // Seitenzahlen aus den sichtbaren Seiten (im Regelanhang erst nach dem Umbruch bekannt)
    const nos = shown && shown.length ? shown : [d.pages[Math.min(g, d.pages.length - 1)]?.no || g + 1];
    const from = nos[0], to = nos.length > 1 ? nos[nos.length - 1] : null;
    $("#book-pager").innerHTML = `
      <button data-go="first" title="Anfang" ${g === 0 ? "disabled" : ""}>⏮</button>
      <button data-go="prev" title="Zurückblättern" ${g === 0 ? "disabled" : ""}>‹</button>
      <span class="pager-pos">Seite <input type="number" id="book-goto" min="1" value="${from || 1}">${to ? `–${to}` : ""} <span class="muted">von ${(d.pages[0]?.no || 1) + total - 1}${flowLast ? "+" : ""}</span></span>
      <button data-go="next" title="Weiterblättern" ${g + s >= total ? "disabled" : ""}>›</button>
      <button data-go="last" title="Ende" ${g + s >= total ? "disabled" : ""}>⏭</button>
      <button id="book-toc-toggle" class="${state.ui.toc ? "on" : ""}" title="Inhaltsverzeichnis rechts ein-/ausklappen">Inhalt</button>`;
  }

  $("#book-pager").addEventListener("click", (ev) => {
    const b = ev.target.closest("button");
    if (!b) return;
    if (b.id === "book-toc-toggle") return toggleSide("toc");
    const d = bookData(), s = spreadSize(), total = totalPages(d);
    if (b.dataset.go === "first") view.g = 0;
    if (b.dataset.go === "prev") view.g = Math.max(0, view.g - s);
    if (b.dataset.go === "next") view.g = Math.min(total - 1, view.g + s);
    if (b.dataset.go === "last") (view.g = total - 1), (view.toEnd = true);
    showSpread();
  });
  $("#book-pager").addEventListener("change", (ev) => {
    if (ev.target.id !== "book-goto") return;
    gotoPageNo(+ev.target.value);
  });
  document.addEventListener("keydown", (ev) => {
    if (state.view !== "book" || /INPUT|SELECT|TEXTAREA/.test(document.activeElement?.tagName) || document.querySelector("dialog[open]")) return;
    if (ev.key === "ArrowRight" || ev.key === "PageDown") $('#book-pager [data-go="next"]')?.click();
    if (ev.key === "ArrowLeft" || ev.key === "PageUp") $('#book-pager [data-go="prev"]')?.click();
  });
  function gotoPageNo(no) {
    const d = bookData();
    const i = d.pages.findIndex((p) => p.no === no);
    const last = d.pages[d.pages.length - 1];
    // Seiten im Regelanhang liegen hinter der letzten zusammengesetzten Seite
    view.g = i >= 0 ? i : last && no > last.no ? d.pages.length - 1 + (no - last.no) : 0;
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
    $("#book-list-info").textContent = `${items.length} von ${d.entries.length} Zaubern im Buch`;
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

  // Inhaltsverzeichnis rechts
  function renderBookToc() {
    const d = bookData();
    let lastGrade = null;
    $("#book-toc-list").innerHTML = d.toc.map((x) => {
      const gr = x.m.spell.everyday ? "Alltagszauber" : x.m.level === 0 ? "Zaubertricks" : U.ROMAN[x.m.level] + ". Grad";
      const head = gr !== lastGrade ? `<li class="toc-grade">${gr}</li>` : "";
      lastGrade = gr;
      return head + `<li data-page="${x.page}"><span class="q">${quickGlyph(x.m)}</span><span class="nm"><b>${e(x.t.title)}</b><i>${e(x.m.name)}</i></span><span class="pg">${x.page}</span></li>`;
    }).join("") + (d.units.some((u) => u.flow) ? `<li data-page="${d.pages[d.pages.length - 1].no}"><span class="q"></span><span class="nm"><b>Regelanhang</b></span><span class="pg">${d.pages[d.pages.length - 1].no}</span></li>` : "");
  }
  $("#book-toc-list").addEventListener("click", (ev) => {
    const li = ev.target.closest("li[data-page]");
    if (li) gotoPageNo(+li.dataset.page);
  });

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
    $("#theory-pages").innerHTML = pages.map((p, i) => BOOK.pageHTML({ ...p, no: i + 1, running: "Lehre der Kreise" })).join("");
    BOOK.autofit($("#theory-pages"));
  }

  // --- Drucken --------------------------------------------------------------------
  const PAPER = { a5: "A5", a4: "A4", "a4-2up": "A4 landscape" };
  function printPages(html, paperOverride) {
    const root = $("#print-root");
    const paper = paperOverride || state.settings.paper || "a5";
    root.innerHTML = html;
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
      window.removeEventListener("afterprint", done);
    };
    window.addEventListener("afterprint", done);
    BOOK.autofit(root).then(() => {
      if (paper === "a4-2up") {
        // je zwei A5-Seiten auf ein A4-Querblatt
        const pages = [...root.querySelectorAll(":scope > .page")];
        for (let i = 0; i < pages.length; i += 2) {
          const sheet = document.createElement("div");
          sheet.className = "sheet";
          pages[i].before(sheet);
          sheet.append(pages[i]);
          if (pages[i + 1]) sheet.append(pages[i + 1]);
        }
      }
      setTimeout(() => window.print(), 50);
    });
  }
  $("#btn-print-scrolls").onclick = () => {
    const entries = bookEntries();
    if (!entries.length) return;
    printPages(entries.flatMap(({ m, t }) => BOOK.scrollPages(m, t, { paper: state.settings.scrollPaper })).map(BOOK.pageHTML).join(""), state.settings.scrollPaper);
  };
  $("#btn-print-book").onclick = () => {
    const b = $("#btn-print-book"), label = b.textContent;
    b.textContent = "Wird vorbereitet …";
    b.disabled = true;
    // dem Knopf Zeit zum Neuzeichnen geben, dann das ganze Buch für den Druck aufbauen
    setTimeout(() => {
      printPages(bookData().pages.map(BOOK.pageHTML).join(""));
      const reset = () => ((b.textContent = label), (b.disabled = false), window.removeEventListener("afterprint", reset));
      window.addEventListener("afterprint", reset);
      setTimeout(reset, 120000);
    }, 30);
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
    dlg.showModal();
  };
  dlg.addEventListener("close", () => {
    const f = dlg.querySelector("form");
    const owner = state.settings.owner, wizard = state.settings.onlyWizard;
    for (const k of Object.keys(DEFAULTS)) {
      const el = f.elements[k];
      if (!el) continue;
      state.settings[k] = el.type === "checkbox" ? el.checked : el.value;
    }
    save();
    if (state.settings.owner !== owner) ALL.forEach((x) => (x.t = null)); // Besitzername steckt in den Randnotizen; Titel bleiben gleich
    if (state.settings.onlyWizard !== wizard || state.settings.owner !== owner) renderList();
    if (state.selected) renderDetail();
    $("#theory-pages").innerHTML = "";
    if (state.view !== "browse") show(state.view);
  });
  $("#btn-export").onclick = () => {
    const data = { book: [...state.book].map((id) => byId.get(id)?.s.name).filter(Boolean), settings: state.settings, preparation: PREP.exportData() };
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
    a.download = (state.settings.owner || "zauberbuch").toLowerCase() + "-zauberbuch.json";
    a.click();
  };
  $("#file-import").onchange = async (ev) => {
    const file = ev.target.files[0];
    if (!file) return;
    try {
      let names = [], settings = null, preparation = null;
      if (/\.xlsx$/i.test(file.name)) names = await IMPORT.xlsxNames(await file.arrayBuffer());
      else if (/\.json$/i.test(file.name)) {
        const data = JSON.parse(await file.text());
        names = data.book || [];
        settings = data.settings || null;
        preparation = data.preparation || null;
      } else names = IMPORT.textNames(await file.text());
      const norm = (n) => String(n).toLowerCase().replace(/[^a-z0-9äöüß]/g, "");
      const lookup = new Map(ALL.map((x) => [norm(x.s.name), x.s.id]));
      const missing = [];
      const found = [];
      for (const n of names) {
        const id = lookup.get(norm(n)) || (byId.has(n) ? n : null);
        if (id) found.push(id);
        else missing.push(n);
      }
      if (!found.length) throw new Error("Keine bekannten Zaubernamen gefunden.");
      const replace = !state.book.size || confirm(`${found.length} Zauber gefunden.\nOK = Buch ersetzen, Abbrechen = zum bestehenden Buch hinzufügen.`);
      if (replace) state.book = new Set();
      view.g = 0;
      found.forEach((id) => state.book.add(id));
      if (settings) Object.assign(state.settings, settings);
      if (preparation) PREP.importData(preparation);
      save();
      updateCount();
      renderList();
      if (state.view === "book") renderBook();
      if (state.view === "prepare") PREP.render();
      alert(`${found.length} Zauber übernommen, ${state.book.size} jetzt im Buch.` + (missing.length ? `\nNicht gefunden (${missing.length}): ${missing.slice(0, 30).join(", ")}${missing.length > 30 ? " …" : ""}` : ""));
    } catch (err) {
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

  // --- Kreis groß anzeigen ----------------------------------------------------------
  const cm = $("#circle-modal");
  let cmSvg = null, cmName = "kreis";
  document.addEventListener("click", (ev) => {
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
    out.setAttribute("width", "1200");
    out.setAttribute("height", "1200");
    out.insertAdjacentHTML("afterbegin", `<rect x="-300" y="-300" width="600" height="600" fill="#f3e9d2" stroke="none"/><style>${SVG_STYLE}</style>`);
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([out.outerHTML], { type: "image/svg+xml" }));
    a.download = cmName + ".svg";
    a.click();
  };

  // --- Start ----------------------------------------------------------------------
  PREP.init({ byId, model, book: () => state.book, select, show, printPages, owner: () => state.settings.owner });
  initFilters();
  applySides();
  renderList();
  updateCount();
  const first = filtered().find((x) => x.s.name === "Fireball") || filtered()[0];
  if (first) select(first.s.id);
  const hashView = location.hash.slice(1);
  if (["book", "theory", "prepare"].includes(hashView)) show(hashView);
})();
