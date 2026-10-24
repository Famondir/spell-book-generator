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
  function initFilters() {
    const lv = $("#f-level");
    for (let i = 0; i <= 9; i++) lv.insertAdjacentHTML("beforeend", `<option value="${i}">Grad ${i}</option>`);
    const sc = $("#f-school");
    for (const [k, v] of Object.entries(T.SCHOOLS)) sc.insertAdjacentHTML("beforeend", `<option value="${k}">${v.de}</option>`);
    const es = $("#f-essence");
    for (const x of T.ESSENCES) es.insertAdjacentHTML("beforeend", `<option value="${x.id}">${x.latin} – ${x.de}</option>`);
    for (const id of ["#q", "#f-level", "#f-school", "#f-essence", "#f-inbook", "#f-origin"]) $(id).addEventListener("input", renderList);
  }

  function filtered() {
    const q = $("#q").value.trim().toLowerCase();
    const lv = $("#f-level").value, sc = $("#f-school").value, es = $("#f-essence").value, ib = $("#f-inbook").value, og = $("#f-origin").value;
    return visible()
      .filter((x) => {
        const m = x.m;
        if (lv !== "" && m.level !== +lv) return false;
        if (og && !!x.s.everyday !== (og === "everyday")) return false;
        if (sc && m.school !== sc) return false;
        if (es && !m.essences.some((y) => y.id === es && y.pct >= 15)) return false;
        if (ib !== "" && state.book.has(x.s.id) !== (ib === "1")) return false;
        if (q) {
          const hay = (x.s.name + " " + (x.s.base || "") + (x.s.everyday ? " alltag" : "") + " " + x.title + " " + m.essences.map((y) => T.ESS[y.id].latin).join(" ") + " " + m.schoolInfo.de + " " + (m.combo || "")).toLowerCase();
          if (!q.split(/\s+/).every((w) => hay.includes(w))) return false;
        }
        return true;
      })
      .sort((a, b) => a.m.level - b.m.level || !!a.s.everyday - !!b.s.everyday || a.s.name.localeCompare(b.s.name));
  }

  function renderList() {
    const items = filtered();
    $("#list-info").textContent = `${items.length} Zauber`;
    const ul = $("#list");
    ul.innerHTML = items
      .slice(0, 600)
      .map((x) => {
        const m = x.m;
        const inBook = state.book.has(x.s.id);
        return `<li data-id="${x.s.id}" class="${state.selected === x.s.id ? "sel" : ""}">
          <span class="lvl">${x.s.everyday ? "A" : m.level}</span>
          <span class="nm"><b>${e(x.s.name)}</b><i>${e(x.title)}</i></span>
          <span class="ess" title="${e(m.essences.map((y) => T.ESS[y.id].latin + " " + y.pct + " %").join(", "))}">${quickGlyph(m)}</span>
          <button class="add ${inBook ? "on" : ""}" title="${inBook ? "Aus dem Buch entfernen" : "Ins Buch aufnehmen"}">${inBook ? "✓" : "+"}</button>
        </li>`;
      })
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
  function bookEntries() {
    return [...state.book]
      .map((id) => byId.get(id))
      .filter(Boolean)
      .sort((a, b) => a.m.level - b.m.level || !!a.s.everyday - !!b.s.everyday || a.title.localeCompare(b.title))
      .map((x) => ({ m: model(x), t: texts(x) }));
  }

  function renderBook() {
    const entries = bookEntries();
    const { pages, spellPagesCount } = BOOK.assemble(entries, state.settings, visible().map((x) => x.m));
    const byLevel = {};
    entries.forEach(({ m }) => (byLevel[m.level] = (byLevel[m.level] || 0) + 1));
    $("#book-stats").innerHTML = entries.length
      ? `<b>${entries.length}</b> Formeln · <b>${spellPagesCount}</b> Seiten Formeln · <b>${pages.length}</b> Blätter gesamt
         <span class="muted">(Gesegnetes Buch: 1000 Seiten · gewöhnliches Zauberbuch: 100 Seiten)</span>
         <div class="muted">${Object.entries(byLevel).map(([l, n]) => `Grad ${l}: ${n}`).join(" · ")}</div>`
      : `Das Buch ist leer. Nimm im Verzeichnis Zauber mit <b>+</b> auf.`;
    $("#book-list").innerHTML = entries
      .map(({ m, t }) => `<span class="chip" data-id="${m.id}" title="${e(t.title)}">${m.spell.everyday ? "A" : m.level} · ${e(m.name)} <button title="Entfernen">×</button></span>`)
      .join("");
    $("#book-pages").innerHTML = pages.map(BOOK.pageHTML).join("");
    BOOK.autofit($("#book-pages"));
  }

  $("#book-list").addEventListener("click", (ev) => {
    const chip = ev.target.closest(".chip");
    if (!chip) return;
    if (ev.target.tagName === "BUTTON") {
      state.book.delete(chip.dataset.id);
      save();
      updateCount();
      renderBook();
    } else {
      select(chip.dataset.id);
      show("browse");
    }
  });

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
    renderBook();
    printPages($("#book-pages").innerHTML);
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
    for (const k of Object.keys(DEFAULTS)) {
      const el = f.elements[k];
      if (!el) continue;
      state.settings[k] = el.type === "checkbox" ? el.checked : el.value;
    }
    save();
    ALL.forEach((x) => (x.t = null)); // Besitzername steckt in den Randnotizen
    ALL.forEach((x) => (x.title = texts(x).title));
    renderList();
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
  renderList();
  updateCount();
  const first = filtered().find((x) => x.s.name === "Fireball") || filtered()[0];
  if (first) select(first.s.id);
  const hashView = location.hash.slice(1);
  if (["book", "theory", "prepare"].includes(hashView)) show(hashView);
})();
