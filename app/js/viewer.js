// Seitenbetrachter und Verzeichnis für Buch, Lehrheft und „Vom Gebet“.
// VIEWER.create(opts): eine oder zwei Seiten je nach Breite, Doppelseiten wie im Buch (Seite 1 allein rechts),
//   Blätterleiste (Anfang, zurück, vor, Ende, Seitenzahl, vorige/nächste Einheit), Pfeiltasten, Größenänderung,
//   Seitenzoom (nur die Seiten, eine Stufe für alle Betrachter, gemerkt je Gerät).
//   Gesetzt wird von der Ansicht selbst (opts.ensure): ausschnittweise oder alles auf einmal.
// VIEWER.toc(el, opts): Verzeichnis als Akkordeon mit Sprung zur Seite und Hervorhebung des aktuellen Abschnitts.
(function () {
  const e = U.esc;
  const PAGE_W = 560; // A5 = 148 mm ≈ 560 px
  const PAGE_H = 794; // 210 mm
  const GAP = 18;

  // Seitenzoom: feste Stufen oder "fit" (Seitenfläche ausfüllen); reine Anzeige, Satz und Druck bleiben bei 100 %
  const ZOOMS = [0.5, 0.67, 0.75, 0.9, 1, 1.1, 1.25, 1.5, 1.75, 2, 2.5];
  const ZOOM_KEY = "spellbook.pageZoom";
  let zoom = (() => {
    try {
      const v = JSON.parse(localStorage.getItem(ZOOM_KEY));
      return v === "fit" || ZOOMS.includes(v) ? v : 1;
    } catch (_) {
      return 1;
    }
  })();
  function setZoom(v) {
    zoom = v;
    try {
      localStorage.setItem(ZOOM_KEY, JSON.stringify(v));
    } catch (_) { /* privater Modus o. Ä. */ }
  }
  // nächste feste Stufe
  const stepZoom = (z, dir) => (dir > 0 ? ZOOMS.find((x) => x > z + 0.001) ?? ZOOMS[ZOOMS.length - 1] : [...ZOOMS].reverse().find((x) => x < z - 0.001) ?? ZOOMS[0]);

  // Ausschnitt um Seite g: im Doppelseitenmodus wie ein gebundenes Buch
  // (Index 0 = Seite 1 rechts allein, danach 1|2, 3|4 … = gerade Seite links, ungerade rechts);
  // lose Blätter (flat): 0|1, 2|3 … = Vorder- und Rückseite nebeneinander
  function spreadAt(g, s, total, flat) {
    g = Math.max(0, Math.min(g, total - 1));
    if (s === 1) return [g, g];
    if (flat) return [g - (g % 2), Math.min(g - (g % 2) + 1, total - 1)];
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
  //   flat()               lose Blätter statt gebundenem Buch: Seite 1 nicht allein rechts
  function create(opts) {
    const { root, pager } = opts;
    let g = opts.pos ? +opts.pos.get() || 0 : 0;
    let job = 0;
    let shown = null; // [a, b]
    let shownZ = 1; // gezeigte Stufe (bei "fit" errechnet)
    const flat = () => !!(opts.flat && opts.flat());
    // Höhe vom oberen Rand der Seitenfläche bis zum Fensterrand (unabhängig davon, wie weit gescrollt ist)
    function availH() {
      let top = root.getBoundingClientRect().top;
      for (let el = root.parentElement; el; el = el.parentElement) top += el.scrollTop;
      return window.innerHeight - top - 16;
    }
    // Seitenzahl (1 oder 2) und Stufe für die verfügbare Fläche
    function layout() {
      const w = root.clientWidth;
      if (zoom === "fit") {
        const h = availH();
        const z1 = Math.min(h / PAGE_H, w / PAGE_W), z2 = Math.min(h / PAGE_H, w / (2 * PAGE_W + GAP));
        return z2 >= 0.75 * z1 ? { s: 2, z: z2 } : { s: 1, z: z1 };
      }
      const s = w >= (2 * PAGE_W + GAP) * zoom ? 2 : 1;
      // schmale Bildschirme: bis 100 % eine Seite auf Bildschirmbreite verkleinern, darüber verschieben
      const z = zoom <= 1 && PAGE_W * zoom > w ? w / (PAGE_W + 10) : zoom;
      return { s, z };
    }
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
        <span class="pager-zoom">
          <button data-zoom="out" title="${e(I18N.t("pager.zoomOut"))}" ${shownZ <= ZOOMS[0] + 0.001 ? "disabled" : ""}>−</button>
          <button data-zoom="reset" class="pager-zoom-val" title="${e(I18N.t("pager.zoomReset"))}">${Math.round(shownZ * 100)} %</button>
          <button data-zoom="in" title="${e(I18N.t("pager.zoomIn"))}" ${shownZ >= ZOOMS[ZOOMS.length - 1] - 0.001 ? "disabled" : ""}>+</button>
          <button data-zoom="fit" class="${zoom === "fit" ? "on" : ""}" title="${e(I18N.t("pager.zoomFit"))}">⤢</button>
        </span>
        ${opts.extra ? opts.extra() : ""}${busy ? `<span class="muted pager-busy">${e(I18N.t("pager.busy"))}</span>` : ""}`;
    }

    function reveal(a, b, s) {
      const pages = domPages();
      pages.forEach((pg, i) => pg.classList.toggle("offstage", idx(pg, i) < a || idx(pg, i) > b));
      root.querySelectorAll(":scope > .page-ghost").forEach((x) => x.remove());
      // Seite 1 liegt rechts: links ein leerer Platzhalter
      if (s === 2 && a === 0 && b === 0 && !flat()) pages.find((pg, i) => idx(pg, i) === 0)?.insertAdjacentHTML("beforebegin", `<div class="page-ghost"></div>`);
    }

    async function show(to = g) {
      const my = ++job;
      const cur = () => my === job;
      const { s, z } = layout();
      if (z !== shownZ) root.scrollLeft = 0;
      shownZ = z;
      root.style.setProperty("--page-zoom", z.toFixed(3));
      let n = opts.count();
      let [a, b] = n ? spreadAt(to, s, n, flat()) : [0, 0];
      const p = opts.ensure ? opts.ensure(a, b, cur) : null;
      if (p && typeof p.then === "function") {
        if (n) renderPager(a, b, n, true);
        await p;
        if (!cur()) return;
        n = opts.count();
        [a, b] = spreadAt(to, s, n, flat());
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
    function zoomTo(how) {
      // von der gewählten Stufe aus; eingepasst von der gezeigten
      setZoom(how === "fit" ? (zoom === "fit" ? 1 : "fit") : how === "reset" ? 1 : stepZoom(zoom === "fit" ? shownZ : zoom, how === "in" ? 1 : -1));
      show();
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
      const zb = ev.target.closest("button[data-zoom]");
      if (zb) zoomTo(zb.dataset.zoom);
    });
    pager.addEventListener("change", (ev) => {
      if (ev.target.id !== opts.name + "-goto") return;
      const no = parseInt(ev.target.value, 10);
      if (no > 0) gotoNo(no);
    });
    document.addEventListener("keydown", (ev) => {
      // offener Dialog: nur der Betrachter darin blättert
      const dlg = document.querySelector("dialog[open]");
      if (!opts.active() || /INPUT|SELECT|TEXTAREA/.test(document.activeElement?.tagName) || (dlg && !dlg.contains(root))) return;
      if (ev.key === "ArrowRight" || ev.key === "PageDown") go("next");
      if (ev.key === "ArrowLeft" || ev.key === "PageUp") go("prev");
      // ohne Strg/Cmd/Alt: die Vergrößerung des Browsers bleibt unberührt
      if (ev.ctrlKey || ev.metaKey || ev.altKey) return;
      if (ev.key === "+" || ev.key === "=") zoomTo("in");
      if (ev.key === "-") zoomTo("out");
      if (ev.key === "0") zoomTo("reset");
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
