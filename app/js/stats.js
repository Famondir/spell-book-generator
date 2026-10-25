// Verlauf und Statistik der Tagesvorbereitung: liest das Nutzungsprotokoll über PREP.api.
// Ein Spieltag reicht von einem „Neuer Tag“ zum nächsten; Probetage zählen in der Statistik nicht.
window.STATS = (function () {
  const e = U.esc;
  const fmtDate = (iso) => new Date(iso).toLocaleDateString(I18N.locale(), { weekday: "short", day: "2-digit", month: "2-digit", year: "numeric" });
  const fmtTime = (iso) => new Date(iso).toLocaleTimeString(I18N.locale(), { hour: "2-digit", minute: "2-digit" });
  const t = I18N.t, tn = I18N.tn;
  const EV = (k) => t("stats.ev." + k);

  // gewirkt je Zauber: cast − uncast (Joker zählen mit)
  function castCounts(events) {
    const c = new Map();
    for (const x of events) {
      if (x.ev === "cast") c.set(x.id, (c.get(x.id) || 0) + 1);
      if (x.ev === "uncast") c.set(x.id, (c.get(x.id) || 0) - 1);
    }
    for (const [k, v] of c) if (v <= 0) c.delete(k);
    return c;
  }
  const sum = (m) => [...m.values()].reduce((a, b) => a + b, 0);

  function spellCell(ctx, id) {
    const x = ctx.byId.get(id);
    if (!x) return `<span class="nm"><b>${e(id)}</b></span>`;
    const m = ctx.model(x);
    return `<span class="q">${quickGlyph(m)}</span><span class="nm" data-open="${e(id)}"><b>${e(RULES.name(x.s))}</b><i>${e(x.title)}</i></span>`;
  }

  // --- Verlauf ----------------------------------------------------------------------
  function history(root, api, ctx) {
    const list = api.dayList();
    root.innerHTML = list.length
      ? list.map((d) => {
        const casts = castCounts(d.events);
        const chips = [...casts].sort((a, b) => b[1] - a[1]).map(([id, n]) => `<span class="st-chip">${e(ctx.byId.get(id) ? RULES.name(ctx.byId.get(id).s) : id)}${n > 1 ? ` ×${n}` : ""}</span>`).join("");
        return `<section class="st-day ${d.meta.test ? "test" : ""}" data-day="${e(d.id)}">
          <header>
            <div><b>${fmtDate(d.start)}</b>${d.current ? ` <span class="badge">${t("stats.today")}</span>` : ""}${d.meta.test ? ` <span class="badge muted-badge">${t("stats.test")}</span>` : ""}
              <div class="muted">${d.ingameText ? e(d.ingameText) + " · " : ""}${t("stats.dayLine", { p: d.prepared.length, c: sum(casts) })}</div></div>
            <div class="row">
              <button data-act="test">${d.meta.test ? t("stats.untest") : t("stats.markTest")}</button>
              <button data-act="del" class="danger">${t("common.delete")}</button>
            </div>
          </header>
          ${chips ? `<div class="st-chips">${chips}</div>` : ""}
          <details><summary>${t("stats.events", { n: d.events.length })}</summary>
            <div class="ingame-row">${t("stats.ingameDate")} ${api.ingameFields(d.id)}</div>
            <ol class="st-events">${d.events.map((x) => `<li><span class="muted">${fmtTime(x.t)}</span> ${x.ev === "day" ? EV("day") : `${e(ctx.byId.get(x.id) ? RULES.name(ctx.byId.get(x.id).s) : x.id)} ${EV(x.ev)}${x.g === "joker" ? " (Joker)" : x.g != null ? ` (${t("stats.slot", { g: x.g })})` : ""}`}</li>`).join("") || `<li class="muted">${t("stats.noEvents")}</li>`}</ol>
          </details>
        </section>`;
      }).join("")
      : `<p class="muted">${t("stats.noDays")}</p>`;
    root.onclick = (ev) => {
      const b = ev.target.closest("button[data-act]");
      const sec = ev.target.closest("[data-day]");
      if (!b || !sec) return;
      const d = list.find((x) => x.id === sec.dataset.day);
      if (b.dataset.act === "test") api.setDayMeta(d.id, { test: !d.meta.test });
      if (b.dataset.act === "del") {
        const msg = d.current
          ? t("stats.delCurrent")
          : t("stats.delDay", { date: fmtDate(d.start), n: d.events.length });
        if (!confirm(msg)) return;
        api.deleteDay(d.id);
      }
      api.refresh();
    };
  }

  // --- Statistik ----------------------------------------------------------------------
  function bars(rows, max) {
    return `<div class="st-bars">${rows.map((r) => `<div class="st-bar">${r.label}<span class="st-track"><i style="width:${max ? (100 * r.value) / max : 0}%"></i></span><span class="st-val">${r.text != null ? r.text : r.value}</span></div>`).join("")}</div>`;
  }
  function statistics(root, api, ctx) {
    const real = api.dayList().filter((d) => !d.meta.test);
    const events = real.flatMap((d) => d.events);
    const casts = castCounts(events);
    const total = sum(casts);
    const tests = api.dayList().length - real.length;
    if (!real.length || (!total && !real.some((d) => d.prepared.length))) {
      root.innerHTML = `<p class="muted">${t("stats.nothing")}${tests ? " " + tn("stats.testsSkipped", tests) : ""}</p>`;
      return;
    }
    // vorbereitet: an wie vielen Tagen
    const prepDays = new Map();
    for (const d of real) for (const id of new Set(d.prepared)) prepDays.set(id, (prepDays.get(id) || 0) + 1);

    const top = [...casts].sort((a, b) => b[1] - a[1]).slice(0, 15);
    const idle = [...prepDays]
      .filter(([id, n]) => n >= 2 && (casts.get(id) || 0) / n < 0.5)
      .sort((a, b) => (casts.get(a[0]) || 0) / a[1] - (casts.get(b[0]) || 0) / b[1] || b[1] - a[1])
      .slice(0, 10);
    const by = (keyOf) => {
      const m = new Map();
      for (const [id, n] of casts) {
        const x = ctx.byId.get(id);
        if (!x) continue;
        const k = keyOf(x, ctx.model(x));
        m.set(k, (m.get(k) || 0) + n);
      }
      return m;
    };
    const gName = (lv) => t("stats.grade", { r: U.ROMAN[lv], n: lv });
    const byGrade = by((x, m) => (x.s.everyday ? t("stats.everyday") : m.level === 0 ? t("stats.cantrip") : gName(m.level)));
    const gradeOrder = [t("stats.cantrip"), t("stats.everyday"), ...U.ROMAN.slice(1).map((r, i) => gName(i + 1))];
    const bySchool = by((x, m) => I18N.school(m.school));
    const maxTop = top.length ? top[0][1] : 0;

    root.innerHTML = `
      <div class="st-kpis">
        <div><b>${real.length}</b><span>${t("stats.kDays")}</span></div>
        <div><b>${total}</b><span>${t("stats.kCast")}</span></div>
        <div><b>${(total / real.length).toFixed(1).replace(".", I18N.lang.ui === "de" ? "," : ".")}</b><span>${t("stats.kPerDay")}</span></div>
        <div><b>${casts.size}</b><span>${t("stats.kDistinct")}</span></div>
      </div>
      ${tests ? `<p class="muted">${tn("stats.testsSkipped", tests)}</p>` : ""}
      <h3>${t("stats.top")}</h3>
      ${top.length ? `<ol class="st-top">${top.map(([id, n]) => `<li>${spellCell(ctx, id)}<span class="st-track"><i style="width:${(100 * n) / maxTop}%"></i></span><span class="st-val">${n}× · ${prepDays.get(id) ? tn("stats.prepOn", prepDays.get(id)) : t("stats.onlyJoker")}</span></li>`).join("")}</ol>` : `<p class="muted">${t("stats.noneCast")}</p>`}
      <h3>${t("stats.idle")}</h3>
      ${idle.length ? `<ol class="st-top">${idle.map(([id, n]) => `<li>${spellCell(ctx, id)}<span class="st-val">${tn("stats.prepOn", n)} · ${t("stats.castTimes", { n: casts.get(id) || 0 })}</span></li>`).join("")}</ol>` : `<p class="muted">${t("stats.noIdle")}</p>`}
      <div class="st-cols">
        <div><h3>${t("stats.byGrade")}</h3>${bars(gradeOrder.filter((k) => byGrade.has(k)).map((k) => ({ label: `<span class="st-lbl">${k}</span>`, value: byGrade.get(k) })), Math.max(...byGrade.values()))}</div>
        <div><h3>${t("stats.bySchool")}</h3>${bars([...bySchool].sort((a, b) => b[1] - a[1]).map(([k, v]) => ({ label: `<span class="st-lbl">${e(k)}</span>`, value: v })), Math.max(...bySchool.values()))}</div>
      </div>
      <h3>${t("stats.perDay")}</h3>
      ${bars(real.slice().reverse().map((d) => ({ label: `<span class="st-lbl">${d.ingameText ? e(d.ingameText) : fmtDate(d.start)}</span>`, value: sum(castCounts(d.events)) })), Math.max(1, ...real.map((d) => sum(castCounts(d.events)))))}`;
    root.onclick = (ev) => {
      const n = ev.target.closest("[data-open]");
      if (!n) return;
      ctx.select(n.dataset.open);
      ctx.show("browse");
    };
  }

  function render(root, sub, api, ctx) {
    if (sub === "verlauf") history(root, api, ctx);
    else statistics(root, api, ctx);
  }
  return { render };
})();
