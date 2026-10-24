// Tagesvorbereitung: Zauberplätze von Hand, Zauber aus dem Buch vorbereiten, gewirkte abstreichen.
// Ersetzt keinen Charakterbogen: nichts wird aus Klasse, Stufe oder Attributen berechnet.
// Jede Aktion landet im Nutzungsprotokoll (spellbook.prepLog) – Grundlage für eine spätere Statistik.
window.PREP = (function () {
  const $ = (s, el = document) => el.querySelector(s);
  const e = U.esc;
  const GRADES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  // Speicherschlüssel je Charakter (chars.js)
  const KEY = CHARS.key("prep"), KEY_PRESETS = CHARS.key("prepPresets"), KEY_LOG = CHARS.key("prepLog");

  const load = (k, d) => {
    try {
      const v = localStorage.getItem(k);
      return v ? JSON.parse(v) : d;
    } catch (_) {
      return d;
    }
  };
  const put = (k, v) => {
    try {
      localStorage.setItem(k, JSON.stringify(v));
    } catch (_) { /* privater Modus o. Ä. */ }
  };

  // Plätze je Grad: n = normale Plätze, extra = Sonderplätze (Schule, Domäne …) mit Bedingung als Freitext
  // items: vorbereitete Zauber; jokers: heute über Joker gewirkte Zauber-IDs
  const fresh = () => ({
    slots: GRADES.map(() => ({ n: 0, extra: 0, note: "" })),
    joker: { n: 0, max: 1 },
    items: [],
    jokers: [],
    day: new Date().toISOString(),
  });
  let st = normalize(load(KEY, null));
  let presets = load(KEY_PRESETS, []);
  let log = load(KEY_LOG, []);
  let ctx = null;
  let editing = false;

  function normalize(s) {
    const f = fresh();
    if (!s || typeof s !== "object") return f;
    return {
      slots: GRADES.map((g) => ({ ...f.slots[g], ...((s.slots || [])[g] || {}) })),
      joker: { ...f.joker, ...(s.joker || {}) },
      items: (s.items || []).filter((x) => x && x.id != null).map((x) => ({ uid: x.uid || uid(), g: +x.g || 0, id: x.id, extra: !!x.extra, used: !!x.used, casts: +x.casts || 0 })),
      jokers: (s.jokers || []).filter(Boolean),
      day: s.day || f.day,
    };
  }
  function uid() {
    return Math.random().toString(36).slice(2, 10);
  }
  function save() {
    put(KEY, st);
    put(KEY_PRESETS, presets);
    put(KEY_LOG, log);
  }
  function record(ev, id, g) {
    log.push({ t: new Date().toISOString(), ev, id, g });
  }

  // --- Daten ------------------------------------------------------------------------
  const spell = (id) => ctx.byId.get(id);
  const level = (x) => (x.s.everyday ? 0 : ctx.model(x).level);
  function candidates(g, maxOnly) {
    // Grad-0-Plätze: Zaubertricks und Alltagszauber; sonst Grad 1 bis g
    return [...ctx.book()]
      .map(spell)
      .filter(Boolean)
      .filter((x) => (maxOnly || g > 0 ? level(x) >= 1 && level(x) <= g : level(x) === 0))
      .sort((a, b) => level(b) - level(a) || a.s.name.localeCompare(b.s.name));
  }
  function gradeInfo(g) {
    const sl = st.slots[g];
    const items = st.items.filter((x) => x.g === g);
    const normal = items.filter((x) => !x.extra), extra = items.filter((x) => x.extra);
    const total = sl.n + sl.extra;
    // übrig = vorbereitet und noch nicht gewirkt (leere Plätze kann man nicht wirken)
    const free = g === 0 ? null : items.filter((x) => !x.used).length;
    return { sl, items, normal, extra, total, free };
  }

  // --- Ansicht ----------------------------------------------------------------------
  function render() {
    const root = $("#prep");
    const hasSlots = st.slots.some((s) => s.n + s.extra > 0) || st.joker.n > 0;
    if (!hasSlots) editing = true;
    const day = new Date(st.day);
    const free = GRADES.filter((g) => g > 0).reduce((a, g) => a + (gradeInfo(g).free || 0), 0) + Math.max(0, st.joker.n - st.jokers.length);
    root.innerHTML = `
      <div class="prep-bar">
        <div>
          <h2>Heute vorbereitet</h2>
          <div class="muted">${hasSlots ? `${free} Zauber übrig · ` : ""}Tag begonnen ${day.toLocaleDateString("de-DE")} ${day.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })}</div>
        </div>
        <div class="row">
          <button id="p-newday" class="primary" title="Alle Abstriche zurücksetzen, Vorbereitung behalten">Neuer Tag</button>
          <button id="p-edit" class="${editing ? "on" : ""}">Plätze einstellen</button>
          <button id="p-print">Tageszettel drucken</button>
        </div>
        <div class="row prep-presets">
          <select id="p-preset"><option value="">Gespeicherte Vorbereitung …</option>${presets.map((p, i) => `<option value="${i}">${e(p.name)}</option>`).join("")}</select>
          <button id="p-load">Laden</button>
          <button id="p-save">Speichern als …</button>
          <button id="p-del" class="danger">Löschen</button>
        </div>
      </div>
      ${editing ? editorHTML() : ""}
      ${!ctx.book().size ? `<p class="muted">Dein Buch ist leer. Nimm im Verzeichnis Zauber mit <b>+</b> auf – vorbereiten lässt sich nur, was im Buch steht.</p>` : ""}
      <div class="prep-grades">${GRADES.map(gradeHTML).join("")}${jokerHTML()}</div>
      <p class="muted prep-foot">Alles bleibt nur in diesem Browser gespeichert. Für ein anderes Gerät: Einstellungen → Liste exportieren (enthält die Vorbereitung).</p>`;
  }

  function editorHTML() {
    return `<div class="prep-editor">
      <table>
        <thead><tr><th>Grad</th><th>Plätze</th><th>Sonderplätze</th><th>Bedingung (z. B. Schule)</th></tr></thead>
        <tbody>${GRADES.map((g) => {
          const s = st.slots[g];
          return `<tr data-g="${g}"><td>${g}</td><td><input type="number" min="0" max="20" data-f="n" value="${s.n}"></td><td><input type="number" min="0" max="5" data-f="extra" value="${s.extra}"></td><td><input data-f="note" value="${e(s.note)}" placeholder="—"></td></tr>`;
        }).join("")}</tbody>
      </table>
      <div class="row">
        <label>Joker <input type="number" min="0" max="5" data-j="n" value="${st.joker.n}"></label>
        <label>bis Grad <input type="number" min="1" max="9" data-j="max" value="${st.joker.max}"></label>
        <span class="muted">z. B. Arkane Verbindung: einmal täglich ein beliebiger Zauber aus dem Buch</span>
      </div>
      <p class="muted">Trag die Zahlen von deinem Charakterbogen ein; die App rechnet nichts nach.</p>
    </div>`;
  }

  function itemHTML(it) {
    const x = spell(it.id);
    if (!x) return "";
    const m = ctx.model(x);
    const lv = level(x);
    const cantrip = it.g === 0;
    const box = cantrip
      ? `<button class="p-cast0" title="Gewirkt – verbraucht nichts, wird nur gezählt">gewirkt${it.casts ? ` ×${it.casts}` : ""}</button>`
      : `<button class="p-cast ${it.used ? "on" : ""}" title="${it.used ? "Abstrich zurücknehmen" : "Als gewirkt abstreichen"}">${it.used ? "✓" : ""}</button>`;
    return `<li data-uid="${it.uid}" class="${it.used ? "used" : ""}">
      ${box}
      <span class="q">${quickGlyph(m)}</span>
      <span class="nm"><b>${e(x.s.name)}</b><i>${e(x.title)}${lv !== it.g && !cantrip ? ` · Grad ${lv} im Platz ${it.g}` : ""}${it.extra ? ` · Sonderplatz` : ""}</i></span>
      <button class="p-rm" title="Aus der Vorbereitung nehmen">×</button>
    </li>`;
  }

  function gradeHTML(g) {
    const gi = gradeInfo(g);
    if (!gi.total && !gi.items.length) return "";
    const emptyN = Math.max(0, gi.sl.n - gi.normal.length), emptyX = Math.max(0, gi.sl.extra - gi.extra.length);
    const empties =
      Array.from({ length: emptyN }, () => `<li class="empty"><button class="p-fill" data-g="${g}">+ Platz belegen</button></li>`).join("") +
      Array.from({ length: emptyX }, () => `<li class="empty"><button class="p-fill" data-g="${g}" data-extra="1">+ Sonderplatz belegen${gi.sl.note ? ` (${e(gi.sl.note)})` : ""}</button></li>`).join("");
    const over = gi.items.length > gi.total ? ` <span class="warn">${gi.items.length - gi.total} mehr vorbereitet als Plätze</span>` : "";
    const head = g === 0 ? `Zaubertricks <span class="muted">unbegrenzt wirkbar</span>` : `Grad ${g} <span class="muted">${gi.free} von ${gi.total} übrig</span>`;
    return `<section class="prep-grade"><h3>${head}${over}</h3><ul class="prep-list">${gi.items.map(itemHTML).join("")}${empties}</ul></section>`;
  }

  function jokerHTML() {
    if (!st.joker.n && !st.jokers.length) return "";
    const rows = st.jokers.map((id, i) => {
      const x = spell(id);
      return x ? `<li class="used"><span class="p-cast on">✓</span><span class="q">${quickGlyph(ctx.model(x))}</span><span class="nm"><b>${e(x.s.name)}</b><i>über Joker gewirkt</i></span><button class="p-unjoker" data-i="${i}" title="Zurücknehmen">×</button></li>` : "";
    });
    for (let i = st.jokers.length; i < st.joker.n; i++) rows.push(`<li class="empty"><button class="p-joker">Joker wirken … (bis Grad ${st.joker.max})</button></li>`);
    return `<section class="prep-grade"><h3>Joker <span class="muted">${Math.max(0, st.joker.n - st.jokers.length)} von ${st.joker.n} übrig</span></h3><ul class="prep-list">${rows.join("")}</ul></section>`;
  }

  // --- Auswahl-Dialog ---------------------------------------------------------------
  function pick(title, list, done) {
    let dlg = $("#prep-pick");
    if (!dlg) {
      dlg = document.createElement("dialog");
      dlg.id = "prep-pick";
      dlg.className = "prep-pick";
      document.body.appendChild(dlg);
      dlg.addEventListener("click", (ev) => { if (ev.target === dlg) dlg.close(); });
    }
    dlg.innerHTML = `<h3>${e(title)}</h3><input type="search" placeholder="Suchen …" autocomplete="off"><ul class="spell-list"></ul><div class="row end"><button class="p-close">Abbrechen</button></div>`;
    const ul = $("ul", dlg), q = $("input", dlg);
    const draw = () => {
      const w = q.value.trim().toLowerCase();
      const hits = list.filter((x) => !w || (x.s.name + " " + x.title).toLowerCase().includes(w));
      ul.innerHTML = hits.length
        ? hits.map((x) => `<li data-id="${x.s.id}"><span class="lvl">${level(x)}</span><span class="nm"><b>${e(x.s.name)}</b><i>${e(x.title)}</i></span><span class="ess">${quickGlyph(ctx.model(x))}</span></li>`).join("")
        : `<li class="muted">Kein passender Zauber im Buch.</li>`;
    };
    q.oninput = draw;
    ul.onclick = (ev) => {
      const li = ev.target.closest("li[data-id]");
      if (!li) return;
      dlg.close();
      done(li.dataset.id);
    };
    $(".p-close", dlg).onclick = () => dlg.close();
    draw();
    dlg.showModal();
    q.focus();
  }

  // --- Aktionen ---------------------------------------------------------------------
  function commit() {
    save();
    render();
  }
  function onClick(ev) {
    const t = ev.target;
    const li = t.closest("li[data-uid]");
    const it = li && st.items.find((x) => x.uid === li.dataset.uid);
    if (t.closest(".p-fill")) {
      const b = t.closest(".p-fill");
      const g = +b.dataset.g, extra = !!b.dataset.extra;
      pick(g === 0 ? "Zaubertrick vorbereiten" : `Platz des ${g}. Grades belegen`, candidates(g), (id) => {
        st.items.push({ uid: uid(), g, id, extra, used: false, casts: 0 });
        record("prep", id, g);
        commit();
      });
    } else if (t.closest(".p-cast") && it) {
      it.used = !it.used;
      record(it.used ? "cast" : "uncast", it.id, it.g);
      commit();
    } else if (t.closest(".p-cast0") && it) {
      it.casts++;
      record("cast", it.id, it.g);
      commit();
    } else if (t.closest(".p-rm") && it) {
      st.items = st.items.filter((x) => x !== it);
      record("unprep", it.id, it.g);
      commit();
    } else if (t.closest(".p-joker")) {
      pick(`Joker: Zauber bis Grad ${st.joker.max} wirken`, candidates(st.joker.max, true), (id) => {
        st.jokers.push(id);
        record("cast", id, "joker");
        commit();
      });
    } else if (t.closest(".p-unjoker")) {
      const [id] = st.jokers.splice(+t.closest(".p-unjoker").dataset.i, 1);
      record("uncast", id, "joker");
      commit();
    } else if (t.closest(".nm") && li) {
      ctx.select(it.id);
      ctx.show("browse");
    } else if (t.id === "p-newday") {
      if (!confirm("Neuer Tag: alle Abstriche und Joker zurücksetzen?")) return;
      record("day", st.items.map((x) => x.id), null);
      st.items.forEach((x) => ((x.used = false), (x.casts = 0)));
      st.jokers = [];
      st.day = new Date().toISOString();
      commit();
    } else if (t.id === "p-edit") {
      editing = !editing;
      render();
    } else if (t.id === "p-print") {
      ctx.printPages(BOOK.pageHTML(sheet()));
    } else if (t.id === "p-save") {
      const name = prompt("Name der Vorbereitung (z. B. Reise, Dungeon):");
      if (!name) return;
      const entry = { name: name.trim(), items: st.items.map(({ g, id, extra }) => ({ g, id, extra })) };
      const i = presets.findIndex((p) => p.name === entry.name);
      if (i >= 0) presets[i] = entry;
      else presets.push(entry);
      commit();
    } else if (t.id === "p-load") {
      const p = presets[$("#p-preset").value];
      if (!p) return;
      st.items.forEach((x) => record("unprep", x.id, x.g));
      st.items = p.items.filter((x) => spell(x.id)).map((x) => ({ uid: uid(), g: x.g, id: x.id, extra: !!x.extra, used: false, casts: 0 }));
      st.items.forEach((x) => record("prep", x.id, x.g));
      commit();
    } else if (t.id === "p-del") {
      const i = $("#p-preset").value;
      if (i === "" || !confirm(`Vorbereitung „${presets[i].name}“ löschen?`)) return;
      presets.splice(+i, 1);
      commit();
    }
  }
  function onInput(ev) {
    const t = ev.target;
    const tr = t.closest("tr[data-g]");
    if (tr && t.dataset.f) {
      const s = st.slots[+tr.dataset.g];
      s[t.dataset.f] = t.dataset.f === "note" ? t.value : Math.max(0, +t.value || 0);
    } else if (t.dataset.j) st.joker[t.dataset.j] = Math.max(t.dataset.j === "max" ? 1 : 0, Math.min(9, +t.value || 0));
    else return;
    save();
    // Liste neu zeichnen, Editor (und damit den Fokus) stehen lassen
    const grades = $("#prep .prep-grades");
    if (grades) grades.innerHTML = GRADES.map(gradeHTML).join("") + jokerHTML();
  }

  // --- Tageszettel ------------------------------------------------------------------
  function sheet() {
    const rows = [];
    for (const g of GRADES) {
      const gi = gradeInfo(g);
      if (!gi.items.length && !gi.total) continue;
      const lines = gi.items.map((it) => {
        const x = spell(it.id);
        if (!x) return "";
        return `<tr><td class="cb">${g === 0 ? "" : "☐"}</td><td class="tq">${quickGlyph(ctx.model(x))}</td><td>${e(x.title)}<span class="tn">${e(x.s.name)}${it.extra ? " · Sonderplatz" : ""}</span></td></tr>`;
      });
      const empty = Math.max(0, gi.total - gi.items.length);
      for (let i = 0; i < empty; i++) lines.push(`<tr><td class="cb">${g === 0 ? "" : "☐"}</td><td class="tq"></td><td class="blank"></td></tr>`);
      rows.push(`<h4>${g === 0 ? "Zaubertricks" : `${U.ROMAN[g]}. Grad`}</h4><table class="toc prep-sheet">${lines.join("")}</table>`);
    }
    if (st.joker.n) {
      const lines = Array.from({ length: st.joker.n }, () => `<tr><td class="cb">☐</td><td class="tq"></td><td class="blank">Joker bis Grad ${st.joker.max}: </td></tr>`);
      rows.push(`<h4>Joker</h4><table class="toc prep-sheet">${lines.join("")}</table>`);
    }
    const date = new Date().toLocaleDateString("de-DE");
    return { html: `<h3>Vorbereitete Formeln</h3><p class="hint" style="text-align:center">${e(ctx.owner())} · ${date}</p>${rows.join("") || `<p class="hint">Noch nichts vorbereitet.</p>`}`, cls: "prep-page", running: "Tageszettel", no: "" };
  }

  // --- Export / Import --------------------------------------------------------------
  function exportData() {
    return { state: st, presets, log };
  }
  function importData(d) {
    if (!d || typeof d !== "object") return;
    if (d.state) st = normalize(d.state);
    if (Array.isArray(d.presets)) presets = d.presets;
    if (Array.isArray(d.log)) log = d.log;
    save();
  }

  function init(c) {
    ctx = c;
    const root = $("#prep");
    root.addEventListener("click", onClick);
    root.addEventListener("input", onInput);
  }

  return { init, render, exportData, importData };
})();
