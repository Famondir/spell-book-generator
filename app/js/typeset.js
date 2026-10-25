// Satzmodul: setzt Seiten auf feste A5-Blätter. Kennt nur Seiten und Satz-Klassen,
// keine Zauber, Lektionen oder Einstellungen.
//
// Seite: { html, cls, running, no, spell, halves } → pageHTML() → <section class="page …">
//   typeset(root, pages, onProgress)  setzt in Häppchen, Seiten eines Zaubers (spell) bleiben zusammen
//   autofit(root)                     setzt bereits eingefügtes HTML (Vorschau, Detailansicht)
//
// Vertrag der Klassen (an der Seite bzw. an Blöcken in .page-inner):
//   .flow          fließende Seite: was nicht passt, wandert auf Folgeseiten (.flow-cont, Fußzeile „(Forts.)“)
//   .splittable    Block, dessen Kinder einzeln auf die Folgeseite wandern dürfen; die Fortsetzung ist ein
//                  leerer Klon mit data-split-of = data-split-id des Originals
//   .keep-next     steht nie als letztes Element am Seitenende (wandert mit dem Folgenden)
//   .keep-whole    teilbarer Block, der lieber ganz auf die Folgeseite wandert, als geteilt zu werden;
//                  geteilt wird er, wenn er oben auf einer Seite steht und trotzdem nicht passt oder wenn
//                  die Seite sonst zu leer bliebe (er beginnt im oberen Drittel, KEEP_WHOLE_MIN)
//   .break-before  beginnt immer eine neue Seite, außer es steht schon oben
//   .recto-start   beginnt auf einer ungeraden Seite; sonst wird eine Leerseite (.blank) davor eingefügt
//   .bind/.verso   Lochrand auf der Bindungsseite; .verso wird nach der gesetzten Seitenzahl vergeben (gerade),
//                  die Satzbreite bleibt gleich, der Umbruch hängt also nicht davon ab
//   feste Seiten (ohne .flow): --fit verkleinert die Schrift, bis der Inhalt passt (bis 0,62);
//   .blk           Pflichtblock eines Zaubers, darf zwischen dessen Seiten wandern (rebalance)
//   .opt           optionaler Füller (data-k), erscheint nur, solange Platz ist; .off = ausgeblendet
//   .overflow      Markierung, wenn eine feste Seite trotz Verkleinerung überläuft
(function () {
  const e = U.esc;

  function pageHTML(p) {
    return `<section class="page ${p.cls || ""} ${p.halves ? "halves" : ""}"${pageHTMLAttr(p)}><div class="page-inner">${p.html}</div><footer class="page-foot"><span>${e(p.running || "")}</span><span>${p.no || ""}</span></footer></section>`;
  }

  // Autofit: Schrift verkleinern, bis die Pflichtblöcke aufs Blatt passen; danach optionale
  // Füller einblenden, solange Platz ist (jeder Füller nur einmal pro Zauber).
  // Fließende Seiten (.flow): Überstehendes wandert auf Fortsetzungsseiten. Blöcke mit .splittable
  // dürfen in sich umbrechen; ihre Kinder werden einzeln verschoben.
  let splitSeq = 0;
  const nextSibs = (el) => {
    const out = [];
    for (let n = el.nextElementSibling; n; n = n.nextElementSibling) out.push(n);
    return out;
  };
  // Folgeseite einer fließenden Seite holen oder anlegen
  function contPage(page) {
    let next = page.nextElementSibling;
    if (next && next.classList.contains("flow-cont")) return next;
    next = page.cloneNode(false);
    next.classList.add("flow-cont");
    next.classList.remove("recto-start");
    next.innerHTML = `<div class="page-inner"></div>${page.querySelector(".page-foot").outerHTML}`;
    next.querySelector(".page-foot span").textContent = (page.querySelector(".page-foot span").textContent.replace(/ \(Forts\.\)$/, "")) + " (Forts.)";
    // Ablage für den Rest: wird erst gesetzt, wenn sie selbst an der Reihe ist (sonst quadratisch bei langen Teilen)
    next.style.contentVisibility = "hidden";
    page.after(next);
    return next;
  }
  function flow(root) {
    const over = (el) => el.scrollHeight > el.clientHeight + 1;
    const KEEP_WHOLE_MIN = 0.35;
    let page = root.querySelector(".page.flow");
    let guard = 0;
    while (page && guard++ < 2000) {
      const inner = page.querySelector(".page-inner");
      page.style.contentVisibility = "";
      inner.style.setProperty("--fit", "0.95");
      let moves = 0;
      // erzwungener Umbruch (.break-before, z. B. Lösungen): der Block und alles danach auf die Folgeseite
      const brk = [...inner.querySelectorAll(":scope > .break-before, :scope > .splittable > .break-before")].find((el) => {
        const top = el.parentElement === inner ? el : el.parentElement;
        return el.previousElementSibling || top.previousElementSibling;
      });
      if (brk) {
        const nextInner = contPage(page).querySelector(".page-inner");
        if (brk.parentElement === inner) nextInner.prepend(brk, ...nextSibs(brk));
        else {
          const sec = brk.parentElement;
          sec.dataset.splitId = sec.dataset.splitId || "s" + ++splitSeq;
          const cont = sec.cloneNode(false);
          delete cont.dataset.splitId;
          cont.dataset.splitOf = sec.dataset.splitId;
          cont.append(brk, ...nextSibs(brk));
          nextInner.prepend(cont, ...nextSibs(sec));
        }
      }
      while (over(inner) && moves++ < 400) {
        const next = contPage(page);
        const nextInner = next.querySelector(".page-inner");
        // alles hinter dem ersten überstehenden Block auf einmal verschieben (sonst quadratisch bei langen Anhängen)
        const lim = inner.getBoundingClientRect().top + inner.clientHeight + 1;
        const kids = [...inner.children];
        const k = kids.findIndex((c) => c.getBoundingClientRect().bottom > lim);
        if (k >= 0 && k < kids.length - 1) {
          nextInner.prepend(...kids.slice(k + 1));
          continue;
        }
        const last = inner.lastElementChild;
        if (!last) break;
        if (last.classList.contains("keep-whole") && inner.children.length > 1 && !last.dataset.splitId && !last.dataset.splitOf &&
            last.getBoundingClientRect().top - inner.getBoundingClientRect().top > KEEP_WHOLE_MIN * inner.clientHeight) {
          nextInner.prepend(last);
          continue;
        }
        if (last.classList.contains("splittable") && last.children.length > 1) {
          last.dataset.splitId = last.dataset.splitId || "s" + ++splitSeq;
          let cont = nextInner.firstElementChild;
          if (!cont || cont.dataset.splitOf !== last.dataset.splitId) {
            cont = last.cloneNode(false);
            delete cont.dataset.splitId;
            cont.dataset.splitOf = last.dataset.splitId;
            nextInner.prepend(cont);
          }
          cont.prepend(last.lastElementChild);
        } else if (inner.children.length > 1) nextInner.prepend(last);
        else break;
      }
      // kein Kopf allein am Seitenende: bleibt von einem geteilten Abschnitt nur der Kopf (.keep-next) übrig,
      // wandert er mit auf die Folgeseite
      const tail = inner.lastElementChild;
      const next = page.nextElementSibling;
      if (tail && next && next.classList.contains("flow-cont") && inner.children.length > 1 && tail.classList.contains("splittable")) {
        const kids = [...tail.children];
        if (kids.length && kids.every((c) => c.classList.contains("keep-next"))) next.querySelector(".page-inner").prepend(tail);
        else if (kids.length > 1 && tail.lastElementChild.classList.contains("keep-next") && tail.dataset.splitId) {
          // Zwischenüberschrift am Seitenende: in die Fortsetzung des Abschnitts
          const cont = next.querySelector(`.page-inner > [data-split-of="${tail.dataset.splitId}"]`);
          if (cont) cont.prepend(tail.lastElementChild);
        }
      }
      // nächste fließende Seite (auch eben erzeugte Fortsetzungen)
      let n = page.nextElementSibling;
      while (n && !n.classList.contains("flow")) n = n.nextElementSibling;
      page = n;
    }
    // Seitenzahlen neu durchzählen, falls Seiten hinzugekommen sind
    const feet = [...root.querySelectorAll(".page > .page-foot span:last-child")];
    const first = feet.find((f) => /^\d+$/.test(f.textContent));
    if (first) {
      let no = +first.textContent;
      for (const f of feet.slice(feet.indexOf(first))) f.textContent = no++;
    }
  }

  // Pflichtblöcke eines Zaubers zwischen seinen Seiten verschieben, bevor verkleinert wird:
  // letzter Block einer übervollen Seite an den Anfang der nächsten, erster Block ans Ende der vorigen –
  // jeweils nur, wenn die Zielseite dadurch nicht selbst überläuft. Die Lesereihenfolge bleibt erhalten.
  function rebalance(root) {
    const over = (el) => el.scrollHeight > el.clientHeight + 1;
    const blks = (el) => [...el.children].filter((c) => c.classList.contains("blk"));
    const beforeOpts = (el, node) => el.insertBefore(node, el.querySelector(":scope > .opt"));
    const groups = new Map();
    for (const inner of root.querySelectorAll(".page:not(.flow):not(.halves) > .page-inner")) {
      const id = inner.closest("[data-spell]")?.dataset.spell;
      if (!id) continue;
      inner.querySelectorAll(":scope > .opt").forEach((o) => o.classList.add("off"));
      inner.style.setProperty("--fit", 1);
      if (!groups.has(id)) groups.set(id, []);
      groups.get(id).push(inner);
    }
    for (const inners of groups.values()) {
      if (inners.length < 2) continue;
      for (let pass = 0, changed = true; changed && pass < 30; pass++) {
        changed = false;
        inners.forEach((a, i) => {
          if (!over(a)) return;
          const next = inners[i + 1];
          let bl = blks(a);
          if (next && bl.length > 1) {
            const last = bl[bl.length - 1];
            next.insertBefore(last, next.firstChild);
            if (!over(next)) return void (changed = true);
            beforeOpts(a, last);
          }
          const prev = inners[i - 1];
          bl = blks(a);
          if (prev && !prev.parentElement.classList.contains("first-page") && bl.length > 1) {
            const first = bl[0];
            beforeOpts(prev, first);
            if (!over(prev)) return void (changed = true);
            a.insertBefore(first, a.firstChild);
          }
        });
      }
    }
  }

  function fit(root, seen) {
    flow(root);
    rebalance(root);
    const over = (el) => el.scrollHeight > el.clientHeight + 1;
    const free = (el) => {
      const kids = [...el.children].filter((c) => !c.classList.contains("off"));
      const last = kids[kids.length - 1];
      return last ? el.clientHeight - (last.offsetTop + last.offsetHeight - el.offsetTop) : el.clientHeight;
    };
    const groups = new Map();
    const seenNotes = seen || new Set();
    root.querySelectorAll(".note").forEach((n) => !n.closest(".opt") && seenNotes.add(n.textContent.trim()));
    for (const inner of root.querySelectorAll(".page-inner, .half")) {
      if (inner.classList.contains("page-inner") && inner.querySelector(".half")) continue;
      if (inner.closest(".page.flow")) continue;
      inner.querySelectorAll(":scope > .opt").forEach((o) => o.classList.add("off"));
      let scale = 1, guard = 0;
      inner.style.setProperty("--fit", scale);
      while (over(inner) && scale > 0.62 && guard++ < 30) {
        scale -= 0.03;
        inner.style.setProperty("--fit", scale.toFixed(2));
      }
      inner.classList.toggle("overflow", over(inner));
      const spell = inner.closest("[data-spell]")?.dataset.spell || "";
      if (!groups.has(spell)) groups.set(spell, []);
      groups.get(spell).push(inner);
    }
    // Alle Seiten eines Zaubers nach der ersten in derselben Schriftgröße (der kleinsten nötigen)
    for (const inners of groups.values()) {
      const rest = inners.filter((x) => x.classList.contains("page-inner") && !x.parentElement.classList.contains("first-page"));
      if (rest.length < 2) continue;
      const min = Math.min(...rest.map((x) => +(x.style.getPropertyValue("--fit") || 1)));
      rest.forEach((x) => x.style.setProperty("--fit", min));
    }
    // Füller jeweils auf die Seite mit dem meisten freien Platz setzen; höchstens eine Randnotiz pro Seite
    const hasNote = new Set();
    for (const inners of groups.values()) {
      const keys = [];
      for (const inner of inners) for (const o of inner.querySelectorAll(":scope > .opt")) if (!keys.includes(o.dataset.k)) keys.push(o.dataset.k);
      for (const k of keys) {
        const cands = inners
          .map((inner) => ({ inner, o: inner.querySelector(`:scope > .opt[data-k="${k}"]`) }))
          .filter((c) => c.o && !(k.startsWith("note") && hasNote.has(c.inner)))
          .sort((a, b) => free(b.inner) - free(a.inner));
        let placed = null;
        // gleichlautende Randnotizen nur einmal im ganzen Buch
        const text = k.startsWith("note") && cands[0] ? cands[0].o.textContent.trim() : null;
        if (text && seenNotes.has(text)) cands.length = 0;
        for (const c of cands) {
          c.o.classList.remove("off");
          if (!over(c.inner)) {
            placed = c;
            if (text) seenNotes.add(text), hasNote.add(c.inner);
            break;
          }
          c.o.classList.add("off");
        }
        inners.forEach((inner) => inner.querySelectorAll(`:scope > .opt[data-k="${k}"]`).forEach((o) => o !== placed?.o && o.remove()));
      }
    }
  }
  // Setzen in Häppchen: Seiten eines Zaubers bleiben zusammen; zwischen den Häppchen bekommt der Browser Luft
  // und onProgress(erledigt, gesamt) wird aufgerufen. pages: Array von Seitenobjekten oder fertiges HTML.
  async function typeset(root, pages, onProgress, chunk = 12) {
    if (document.fonts) await document.fonts.ready;
    if (typeof pages === "string") {
      root.innerHTML = pages;
      fit(root);
      onProgress && onProgress(1, 1);
      return;
    }
    root.innerHTML = "";
    const groups = [];
    for (const p of pages) {
      const last = groups[groups.length - 1];
      if (p.spell && last && last.spell === p.spell) last.pages.push(p);
      else groups.push({ spell: p.spell, pages: [p] });
    }
    const seen = new Set();
    let done = 0;
    for (let i = 0; i < groups.length; ) {
      const part = [];
      while (i < groups.length && (part.length < chunk || !part.length)) part.push(...groups[i++].pages);
      const box = document.createElement("div");
      root.appendChild(box);
      box.innerHTML = part.map(pageHTML).join("");
      fit(box, seen);
      box.replaceWith(...box.childNodes);
      done += part.length;
      onProgress && onProgress(done, pages.length);
      await new Promise((r) => setTimeout(r, 0));
    }
    // Abschnitte mit .recto-start beginnen auf einer rechten (ungeraden) Seite: sonst eine Leerseite davor
    let pos = 0;
    for (const p of root.querySelectorAll(":scope > .page")) {
      if (++pos % 2 === 0 && p.classList.contains("recto-start")) {
        const blank = p.cloneNode(false);
        blank.classList.remove("recto-start", "flow");
        blank.classList.add("blank");
        blank.innerHTML = `<div class="page-inner"></div><footer class="page-foot"><span></span><span></span></footer>`;
        p.before(blank);
        pos++;
      }
    }
    // fließende Seiten (Regelband) haben Folgeseiten bekommen: fortlaufend nummerieren
    if (root.querySelector(".flow")) {
      let no = 1;
      root.querySelectorAll(":scope > .page > .page-foot span:last-child").forEach((f) => (f.textContent = no++));
    }
    // Bindungsrand (.bind): ungerade Seiten rechts im Heft (Rand links), gerade links (Rand rechts)
    root.querySelectorAll(":scope > .page.bind").forEach((p) => p.classList.toggle("verso", +p.querySelector(".page-foot span:last-child").textContent % 2 === 0));
  }

  const autofit = (root) => (document.fonts ? document.fonts.ready.then(() => fit(root)) : Promise.resolve(fit(root)));

  function pageHTMLAttr(p) {
    return p.spell ? ` data-spell="${e(p.spell)}"` : "";
  }

  window.TYPESET = { pageHTML, typeset, autofit, fit, flow };
})();
