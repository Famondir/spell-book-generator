// Seitenbetrachter und Verzeichnis für Buch, Lehrheft und „Vom Gebet“.
// VIEWER.create(opts): eine oder zwei Seiten je nach Breite, Doppelseiten wie im Buch (Seite 1 allein rechts),
//   Blätterleiste (Anfang, zurück, vor, Ende, Seitenzahl, vorige/nächste Einheit), Pfeiltasten, Größenänderung.
//   Gesetzt wird von der Ansicht selbst (opts.ensure): ausschnittweise oder alles auf einmal.
// VIEWER.toc(el, opts): Verzeichnis als Akkordeon mit Sprung zur Seite und Hervorhebung des aktuellen Abschnitts.
(function () {
  const e = U.esc;
  const PAGE_W = 560; // A5 = 148 mm ≈ 560 px

  // Ausschnitt um Seite g: im Doppelseitenmodus wie ein gebundenes Buch
  // (Index 0 = Seite 1 rechts allein, danach 1|2, 3|4 … = gerade Seite links, ungerade rechts)
  function spreadAt(g, s, total) {
    g = Math.max(0, Math.min(g, total - 1));
    if (s === 1) return [g, g];
    if (g === 0) return [0, 0];
    const a = g % 2 === 1 ? g : g - 1;
    return [a, Math.min(a + 1, total - 1)];
  }

  // opts:
  //   root, pager          Elemente (Seiten, Blätterleiste)
  //   name                 Kennung (id der Seitenzahl-Eingabe: <name>-goto)
  //   active()             sichtbar? (Tasten und Größenänderung nur dann)
  //   count()              Zahl der Seiten (nach ensure aktuell)
  //   pageNo(i)            gedruckte Seitenzahl der Seite i
  //   indexOfNo(no)        Seite zu einer eingegebenen Seitenzahl (sonst Suche über pageNo)
  //   units()              { starts: [Index …], prev, next } (Titel der Knöpfe) oder null
  //   ensure(a, b, cur)    setzt die nötigen Seiten (Promise); cur() = Auftrag noch aktuell?
  //   pos: { get, set }    gemerkte Position
  //   extra()              zusätzliches HTML am Ende der Blätterleiste
  //   onShow(a, b)         nach dem Anzeigen (z. B. Verzeichnis nachführen)
  function create(opts) {
    const { root, pager } = opts;
    let g = opts.pos ? +opts.pos.get() || 0 : 0;
    let job = 0;
    let shown = null; // [a, b]
    const size = () => (root.clientWidth >= 2 * PAGE_W + 18 ? 2 : 1);
    const domPages = () => [...root.querySelectorAll(":scope > .page")];
    const idx = (pg, i) => (pg.dataset.idx != null ? +pg.dataset.idx : i);

    function renderPager(a, b, n, busy) {
      const u = opts.units ? opts.units() : null;
      const prevU = u ? u.starts.filter((i) => i < a).pop() : null;
      const nextU = u ? u.starts.find((i) => i > b) : null;
      const from = opts.pageNo(a), to = b > a ? opts.pageNo(b) : null;
      shown = [a, b];
      shown.prevU = prevU;
      shown.nextU = nextU;
      const val = `${from}${to ? `–${to}` : ""}`;
      pager.innerHTML = `
        <button data-go="first" title="${e(I18N.t("pager.first"))}" ${a === 0 ? "disabled" : ""}>⏮</button>
        ${u ? `<button data-go="prevUnit" title="${e(u.prev)}" ${prevU == null ? "disabled" : ""}>«</button>` : ""}
        <button data-go="prev" title="${e(I18N.t("pager.prev"))}" ${a === 0 ? "disabled" : ""}>‹</button>
        <span class="pager-pos">${e(I18N.t("pager.page"))} <input type="text" inputmode="numeric" id="${opts.name}-goto" title="${e(I18N.t("pager.gotoTitle"))}" value="${e(val)}" size="${val.length + 1}"> <span class="muted">${e(I18N.t("pager.of"))} ${e(opts.pageNo(n - 1))}</span></span>
        <button data-go="next" title="${e(I18N.t("pager.next"))}" ${b >= n - 1 ? "disabled" : ""}>›</button>
        ${u ? `<button data-go="nextUnit" title="${e(u.next)}" ${nextU == null ? "disabled" : ""}>»</button>` : ""}
        <button data-go="last" title="${e(I18N.t("pager.last"))}" ${b >= n - 1 ? "disabled" : ""}>⏭</button>
        ${opts.extra ? opts.extra() : ""}${busy ? `<span class="muted pager-busy">${e(I18N.t("pager.busy"))}</span>` : ""}`;
    }

    function reveal(a, b, s) {
      const pages = domPages();
      pages.forEach((pg, i) => pg.classList.toggle("offstage", idx(pg, i) < a || idx(pg, i) > b));
      root.querySelectorAll(":scope > .page-ghost").forEach((x) => x.remove());
      // Seite 1 liegt rechts: links ein leerer Platzhalter
      if (s === 2 && a === 0) pages.find((pg, i) => idx(pg, i) === 0)?.insertAdjacentHTML("beforebegin", `<div class="page-ghost"></div>`);
    }

    async function show(to = g) {
      const my = ++job;
      const cur = () => my === job;
      const s = size();
      // schmale Bildschirme: eine Seite auf Bildschirmbreite verkleinern
      const w = root.clientWidth;
      root.style.zoom = s === 1 && w < PAGE_W ? (w / (PAGE_W + 10)).toFixed(3) : "";
      let n = opts.count();
      let [a, b] = n ? spreadAt(to, s, n) : [0, 0];
      const p = opts.ensure ? opts.ensure(a, b, cur) : null;
      if (p && typeof p.then === "function") {
        if (n) renderPager(a, b, n, true);
        await p;
        if (!cur()) return;
        n = opts.count();
        [a, b] = spreadAt(to, s, n);
      }
      if (!n) {
        pager.innerHTML = "";
        root.querySelectorAll(":scope > .page-ghost").forEach((x) => x.remove());
        return;
      }
      g = a;
      opts.pos && opts.pos.set(a);
      reveal(a, b, s);
      renderPager(a, b, n, false);
      opts.onShow && opts.onShow(a, b);
    }

    function go(where) {
      if (!shown) return;
      const [a, b] = shown;
      const n = opts.count();
      const t = { first: 0, prev: a - 1, next: b + 1, last: n - 1, prevUnit: shown.prevU, nextUnit: shown.nextU }[where];
      if (t == null) return;
      show(t);
    }
    function gotoNo(no) {
      let i = opts.indexOfNo ? opts.indexOfNo(no) : -1;
      if (i < 0) {
        const n = opts.count();
        for (let k = 0; k < n; k++) if (String(opts.pageNo(k)) === String(no)) { i = k; break; }
        if (i < 0) i = no > +opts.pageNo(n - 1) ? n - 1 : 0;
      }
      show(i);
    }

    pager.addEventListener("click", (ev) => {
      const btn = ev.target.closest("button[data-go]");
      if (btn) go(btn.dataset.go);
    });
    pager.addEventListener("change", (ev) => {
      if (ev.target.id !== opts.name + "-goto") return;
      const no = parseInt(ev.target.value, 10);
      if (no > 0) gotoNo(no);
    });
    document.addEventListener("keydown", (ev) => {
      if (!opts.active() || /INPUT|SELECT|TEXTAREA/.test(document.activeElement?.tagName) || document.querySelector("dialog[open]")) return;
      if (ev.key === "ArrowRight" || ev.key === "PageDown") go("next");
      if (ev.key === "ArrowLeft" || ev.key === "PageUp") go("prev");
    });
    let resizeT = null;
    window.addEventListener("resize", () => {
      clearTimeout(resizeT);
      resizeT = setTimeout(() => opts.active() && show(), 150);
    });

    return {
      show,
      go,
      gotoNo,
      get pos() { return g; },
      set pos(v) { g = v; },
      get shown() { return shown ? [shown[0], shown[1]] : null; },
      cancel: () => job++,
    };
  }

  // Verzeichnis als Akkordeon
  // opts:
  //   sections()           [{ id, title, count?, items: [{ html, attrs, cls }] }]
  //   open                 Set der offenen Abschnitte (bleibt während der Sitzung erhalten)
  //   current              Id des hervorgehobenen Abschnitts (setzen mit mark())
  //   onPick(li)           Klick auf einen Eintrag
  //   onHead(id, li)       Klick auf eine Abschnittsüberschrift (Vorgabe: auf-/zuklappen)
  function toc(el, opts) {
    const open = opts.open || new Set();
    let current = opts.current || null;
    function render() {
      el.innerHTML = opts.sections().map((sec) => `<li class="toc-group ${open.has(sec.id) ? "open" : ""} ${sec.id === current ? "on" : ""}" data-grp="${e(sec.id)}">
        <button class="toc-grade"><span>${e(sec.title)}</span>${sec.count != null ? `<span class="muted">${sec.count}</span>` : ""}</button>
        <ul>${sec.items.map((it) => `<li ${it.attrs || ""} class="${it.cls || ""}">${it.html}</li>`).join("")}</ul></li>`).join("");
    }
    const toggle = (grp, on) => {
      grp.classList.toggle("open", on);
      grp.classList.contains("open") ? open.add(grp.dataset.grp) : open.delete(grp.dataset.grp);
    };
    el.addEventListener("click", (ev) => {
      const head = ev.target.closest(".toc-grade");
      if (head) {
        const grp = head.parentElement;
        if (opts.onHead) opts.onHead(grp.dataset.grp, grp, (on) => toggle(grp, on));
        else toggle(grp);
        return;
      }
      const li = ev.target.closest(".toc-group li");
      if (li) opts.onPick(li);
    });
    return {
      render,
      open,
      // aktuellen Abschnitt hervorheben (ohne neu zu zeichnen)
      mark(id) {
        if (id === current) return;
        current = id;
        el.querySelectorAll(":scope > .toc-group").forEach((g) => g.classList.toggle("on", g.dataset.grp === id));
      },
      expand(id) {
        const grp = [...el.querySelectorAll(":scope > .toc-group")].find((g) => g.dataset.grp === id);
        if (grp) toggle(grp, true);
        else open.add(id);
      },
    };
  }

  window.VIEWER = { create, toc, spreadAt };
})();
