// Testfälle für tools/test-browser.mjs
// Satz-Fall:  { name, book, settings, cls, deity, job, opts, limit }   job: book | rules | scrolls | primer | checks | vademecum
// Bedienung:  { name, book, settings, cls, deity, width, run: async (t) => … }   Helfer siehe test-browser.mjs
//             deity: Gottheit am Charakter (Magier sonst ohne Schutzgottheit, göttliche Klassen Iomedae)
// Node:       { name, node: async ({ withProfile, root }) => [{ rule, detail }] }   ohne Browser
import { execFileSync } from "node:child_process";

// Werkzeug in tools/ ausführen; Rückgabecode ≠ 0 ergibt einen Fehler mit der letzten Ausgabezeile
const tool = (root, rule, args) => {
  try {
    execFileSync(process.execPath, args, { cwd: root, stdio: "pipe" });
    return [];
  } catch (e) {
    return [{ rule, detail: String(e.stdout || e.message).trim().split("\n").pop() }];
  }
};

// Testbücher als feste Namenslisten, damit neue Daten die Auswahl nicht verschieben.

export const BOOKS = {
  leer: [],
  klein: [
    // Zaubertricks
    "Acid Splash", "Detect Magic", "Light", "Mage Hand", "Message", "Prestidigitation", "Ray of Frost", "Read Magic",
    // 1. Grad
    "Color Spray", "Feather Fall", "Grease", "Identify", "Mage Armor", "Magic Missile", "Shield", "Sleep",
    // 2. Grad
    "Glitterdust", "Invisibility", "Mirror Image", "Scorching Ray", "Web",
    // 3. Grad
    "Dispel Magic", "Fireball", "Fly", "Haste", "Lightning Bolt",
  ],
  // alle Zaubertricks und Alltagszauber (benannte Auswahl, wächst mit den Daten)
  gross: { levels: [0], everyday: true },
  paladin: ["Bless Weapon", "Divine Favor", "Protection from Evil", "Cure Light Wounds", "Restoration, Lesser", "Shield Other", "Remove Paralysis", "Cure Moderate Wounds", "Heal Mount"],
};

// Selektoren, die ein Umbau der Ansichten ändern darf, an einer Stelle
export const UI = {
  tab: (v) => `.tabs [data-view="${v}"]`,
  bookPager: "#book-pager",
  bookPos: "#book-pager .pager-pos",
  bookGo: (g) => `#book-pager [data-go="${{ nextSpell: "nextUnit", prevSpell: "prevUnit" }[g] || g}"]`,
  bookGoto: "#book-goto",
  bookPages: "#book-pages",
  bookToc: "#book-toc",
  bookTocToggle: '#book-toc .side-toggle',
  bookTocGroup: "#book-toc-list .toc-group",
  bookLeft: "#book-side",
  bookLeftToggle: '#book-side .side-toggle',
  theoryView: "#theory-view",
  theoryPages: "#theory-pages",
  theoryGo: (g) => `#theory-pager [data-go="${g}"]`,
  primerView: "#primer-view",
  primerPos: "#primer-pager .pager-pos",
  primerGo: (g) => `#primer-pager [data-go="${g}"]`,
  primerPages: "#primer-pages",
  primerToc: "#primer-toc",
  primerTocPart: (id) => `#primer-toc .toc-group[data-grp="${id}"] > .toc-grade`,
  primerTocLesson: (id) => `#primer-toc li[data-lesson="${id}"]`,
  primerTocCurrent: "#primer-toc .toc-group.on > .toc-grade",
  primerGoto: "#primer-goto",
  primerSide: "#primer-side",
  primerSideToggle: "#primer-side .side-toggle",
  settingsBtn: "#btn-settings",
  settings: "#settings",
};

// sichtbare Seiten (ohne .offstage) einer Ansicht: Seitenzahlen als Liste
const visibleNos = (root) => `[...document.querySelectorAll(${JSON.stringify(root + " > .page:not(.offstage)")})].map((p) => p.querySelector(".page-foot span:last-child").textContent.trim())`;
const text = (sel) => `(document.querySelector(${JSON.stringify(sel)})?.textContent || "").replace(/\\s+/g, " ").trim()`;

export const CASES = [
  // --- Satz: Buch -------------------------------------------------------------------------
  { name: "buch-leer-a5", book: "leer", job: "book" },
  { name: "buch-klein-a5", book: "klein", job: "book" },
  { name: "buch-klein-a4", book: "klein", settings: { paper: "a4" }, job: "book" },
  { name: "buch-klein-a4quer", book: "klein", settings: { paper: "a4-2up" }, job: "book" },
  { name: "buch-klein-ohne-kapitel", book: "klein", settings: { chapters: false }, job: "book" },
  { name: "buch-klein-ohne-beginn-links", book: "klein", settings: { leftStart: "off" }, job: "book" },
  { name: "buch-klein-ausfuehrlich", book: "klein", settings: { detailPrint: true }, job: "book" },
  { name: "buch-klein-baende-band1", book: "klein", settings: { maxPages: 50 }, job: "book", opts: { vol: 0 } },
  { name: "buch-klein-baende-band2", book: "klein", settings: { maxPages: 50 }, job: "book", opts: { vol: 1 } },
  { name: "buch-gross-a5", book: "gross", job: "book", limit: 20000 },
  // --- Satz: weitere Aufträge -----------------------------------------------------------
  { name: "regelband-klein", book: "klein", job: "rules" },
  { name: "regelband-klein-en", book: "klein", settings: { rulesLang: "en" }, job: "rules" },
  { name: "rollen-klein-a4", book: "klein", job: "scrolls" },
  { name: "rollen-klein-a5", book: "klein", settings: { scrollPaper: "a5" }, job: "scrolls" },
  { name: "lehrheft-klein", book: "klein", job: "primer" },
  { name: "lehrheft-klein-ohne-lochrand", book: "klein", settings: { primerGutter: false }, job: "primer" },
  { name: "lehrheft-gross", book: "gross", job: "primer", limit: 8000 },
  { name: "lehrheft-klein-dicht", book: "klein", settings: { primerLayout: "dense" }, job: "primer" },
  { name: "lehrheft-klein-seitenweise", book: "klein", settings: { primerLayout: "pages" }, job: "primer" },
  // mit --with-profile: alle Stimmen, Übergabe und loses Blatt; ohne Profil wie lehrheft-klein
  { name: "lehrheft-klein-stufe9", book: "klein", settings: { charLevel: 9 }, job: "primer" },
  { name: "pruefbogen-klein", book: "klein", job: "checks" },
  // Vademecum: einfaches Buch (Iomedae, dünn) und ganzes Wendebuch (Nethys: A, Mitte, B rückwärts und gedreht)
  { name: "vademecum-paladin", book: "paladin", cls: "paladin", job: "vademecum" },
  { name: "vademecum-nethys-wendebuch", book: "klein", deity: "nethys", job: "vademecum" },
  { name: "brevier-paladin", book: "paladin", cls: "paladin", job: "book" },

  // --- Testschnittstelle selbst ---------------------------------------------------------------
  {
    name: "ui-testschnittstelle-speichert-nicht",
    book: "leer",
    run: async (t) => {
      const before = await t.eval(`JSON.stringify(Object.entries(localStorage).sort())`);
      await t.eval(`APP_TEST.load({ book: ["Fireball", "Shield"], settings: { paper: "a4" } })`);
      await t.expect("Buch im Speicher gesetzt", `APP_TEST.print("book").then((r) => { APP_TEST.done(); return r.paper; })`, "a4");
      await t.expect("localStorage unverändert", `JSON.stringify(Object.entries(localStorage).sort())`, before);
    },
  },

  {
    name: "ui-druckknoepfe",
    book: "klein",
    run: async (t) => {
      await t.eval(`window.print = () => { window.__pages = document.querySelectorAll("#print-root .page").length; window.__printed = (window.__printed || 0) + 1; window.dispatchEvent(new Event("afterprint")); }`);
      for (const [btn, view] of [["#btn-print-book", "book"], ["#btn-print-rules", "book"], ["#btn-print-scrolls", "book"], ["#btn-print-primer", "theory"], ["#btn-print-checks", "theory"]]) {
        await t.click(t.ui.tab(view));
        await t.settled();
        const n = await t.eval(`window.__printed || 0`);
        await t.click(btn);
        await t.until(`(window.__printed || 0) > ${n}`);
        await t.expect(`${btn}: Seiten gesetzt`, `window.__pages > 0`, true);
        await t.expect(`${btn}: Druck vorbereitet und aufgeräumt`, `document.getElementById("print-root").children.length === 0 && !document.body.classList.contains("printing")`, true);
      }
    },
  },

  // Schnellschalter Originalschrift / Lateinschrift: nur sichtbar, wenn eine Formelsprache eine eigene Schrift hat
  // (mit Profil); umgeschaltet trägt kein Kreis und keine Schnellglyphe mehr eine Originalschrift
  {
    name: "ui-schriftschalter",
    book: "klein",
    run: async (t) => {
      await t.click(t.ui.tab("book"));
      await t.settled();
      const own = await t.eval(`FORMULA.stations().some((st) => FORMULA.get(st.lang).script)`);
      await t.expect("Schalter nur bei eigener Schrift", `document.getElementById("script-switch").hidden`, !own);
      if (!own) return;
      // Umschalten mit Zeitmessung; Buchsatz (BOOK.volumes) gezählt
      await t.eval(`window.__vol = 0; const v = BOOK.volumes; BOOK.volumes = (...a) => (window.__vol++, v(...a))`);
      const flip = async (mode) => {
        await t.eval(`window.__t0 = performance.now()`);
        await t.click(`#script-switch [data-mode="${mode}"]`);
        await t.settled();
        return t.eval(`Math.round(performance.now() - window.__t0)`);
      };
      const first = await flip("latin");
      await t.expect("Lateinschrift eingestellt", `SCRIPTS.mode() + "|" + document.querySelector('#script-switch [data-mode="latin"]').classList.contains("on")`, "latin|true");
      await t.expect("keine Originalschrift auf den Seiten", `document.querySelectorAll("#book-pages [class*='script-'], #book-pages .ql-proto, #book-pages .band-glyph").length`, 0);
      const back = await flip("original");
      await t.expect("zurück auf Originalschrift", `SCRIPTS.mode()`, "original");
      const again = await flip("latin");
      await flip("original");
      // beide Fassungen liegen im Speicher: nur der erste Wechsel setzt das Buch
      await t.expect("Buch nur beim ersten Wechsel gesetzt", `window.__vol`, 1);
      console.log(`    Umschalten: erstmals ${first} ms, zurück ${back} ms, erneut ${again} ms`);
      // Lehrheft: eigener Schalter, wirkt auf die gesetzten Seiten
      await t.click(t.ui.tab("theory"));
      await t.settled();
      await t.click('#primer-script-switch [data-mode="latin"]');
      await t.settled();
      await t.expect("Lehrheft in Lateinschrift", `SCRIPTS.mode() + "|" + document.querySelectorAll("#primer-pages [class*='script-'], #primer-pages .ql-proto, #primer-pages .band-glyph").length + "|" + document.querySelector('#script-switch [data-mode="latin"]').classList.contains("on")`, "latin|0|true");
      await t.click('#primer-script-switch [data-mode="original"]');
      await t.settled();
      await t.expect("Lehrheft zurück auf Originalschrift", `SCRIPTS.mode()`, "original");
    },
  },

  // Druck setzt dasselbe HTML wie die Vorschau: ids im Druckbereich müssen eigene sein (sonst folgt das Schriftband
  // dem Pfad der Vorschau und läuft neben dem Kreis)
  {
    name: "ui-druck-eigene-ids",
    book: "klein",
    // „Nur diesen Zauber drucken“: dieselben Seiten wie die Vorschau in der Detailansicht
    run: async (t) => {
      await t.click(t.ui.tab("browse"));
      await t.settled();
      await t.click("#list li[data-id]");
      await t.until(`!!document.getElementById("d-print")`);
      await t.eval(`window.print = () => { const ids = [...document.querySelectorAll("#print-root [id]")].map((el) => el.id); const out = new Set([...document.querySelectorAll("body [id]")].filter((el) => !el.closest("#print-root")).map((el) => el.id)); window.__dup = ids.filter((i) => out.has(i)).length; const own = new Set(ids); window.__refs = [...document.querySelectorAll("#print-root textPath")].filter((tp) => !own.has(tp.getAttribute("href").slice(1))).length; window.__printed = (window.__printed || 0) + 1; window.dispatchEvent(new Event("afterprint")); }`);
      await t.click("#d-print");
      await t.until(`(window.__printed || 0) > 0`);
      await t.expect("Vorschau und Druck tragen ein Schriftband", `document.querySelectorAll("#detail textPath").length > 0`, true);
      await t.expect("keine ids doppelt, jedes Band findet seinen Pfad im Druck", `[window.__dup, window.__refs]`, [0, 0]);
    },
  },

  // --- Lehrheft: Stimmen aus dem Profil, nach Charakterstufe freigeschaltet ---------------------
  {
    name: "ui-lehrheft-freischalten",
    book: "klein",
    run: async (t) => {
      // Profil im Speicher ergänzen (die lokale Profildatei ist im Test gesperrt)
      await t.eval(`PROFILE.primer = { voices: { a: { label: "A", hand: "angular" }, b: { label: "B", hand: "even" } }, notes: { l13: [{ voice: "a", text: "NOTIZ-IMMER" }, { voice: "b", level: 7, text: "NOTIZ-STUFE7" }] }, handover: { level: 5, voice: "a", text: ["UEBERGABE"] } }`);
      const has = (lvl, w) => `APP_TEST.load({ book: ${JSON.stringify(BOOKS.klein)}, settings: { charLevel: ${lvl} } }) && APP_TEST.print("primer").then(() => { const s = document.getElementById("print-root").textContent; APP_TEST.done(); return ${JSON.stringify(w)}.map((x) => s.includes(x)); })`;
      await t.expect("ohne Stufe: nur die Notiz ohne Mindeststufe", has(0, ["NOTIZ-IMMER", "NOTIZ-STUFE7", "UEBERGABE"]), [true, false, false]);
      await t.expect("Stufe 5: Übergabe, noch nicht Stufe 7", has(5, ["NOTIZ-IMMER", "NOTIZ-STUFE7", "UEBERGABE"]), [true, false, true]);
      await t.expect("Stufe 7: alles", has(7, ["NOTIZ-IMMER", "NOTIZ-STUFE7", "UEBERGABE"]), [true, true, true]);
      await t.expect("Hände: Schrift je Stimme", `APP_TEST.load({ book: ${JSON.stringify(BOOKS.klein)}, settings: { charLevel: 7 } }) && APP_TEST.print("primer").then(() => { const f = (c) => getComputedStyle(document.querySelector("#print-root .mnote." + c)).fontFamily; const r = [f("hand-angular"), f("hand-even")].map((x) => x.split(",")[0].replace(/"/g, "")); APP_TEST.done(); return r; })`, ["Covered By Your Grace", "Kalam"]);
    },
  },

  // --- Lehrheft: Glossen stehen in der Zeile ihres Begriffs, Randnotizen weichen aus -----------
  {
    name: "ui-lehrheft-glossenabstand",
    book: "klein",
    run: async (t) => {
      const lots = (k) => Array.from({ length: k }, (_, i) => ({ voice: i % 2 ? "b" : "a", text: "Eine Randnotiz, die etwas länger ist, damit sie Platz braucht. Nummer " + (i + 1) + "." }));
      await t.eval(`PROFILE.primer = { voices: { a: { label: "A", hand: "angular" }, b: { label: "B", hand: "even" } }, notes: ${JSON.stringify({ "w-soap": lots(2), l4: lots(1), l6: lots(3), l13: lots(3), l27: lots(2), l29: lots(2) })} }`);
      // eine Glosse, die tiefer steht als ihr Begriff, darf nur von einer Glosse darüber geschoben sein
      const probe = `APP_TEST.load({ book: ${JSON.stringify(BOOKS.klein)} }) && APP_TEST.print("primer").then(() => {
        const bad = [];
        let n = 0;
        for (const page of document.querySelectorAll("#print-root .page")) {
          const items = [...page.querySelectorAll(".pr-note, .mnote")].map((el) => ({ el, r: el.getBoundingClientRect() }));
          for (const it of items.filter((x) => x.el.classList.contains("pr-note"))) {
            n++;
            const term = it.el.nextElementSibling, dy = it.r.top - term.getBoundingClientRect().top;
            if (dy <= 4) continue;
            const above = items.filter((x) => x !== it && x.r.bottom <= it.r.top + 1).sort((a, b) => b.r.bottom - a.r.bottom)[0];
            if (!above || !above.el.classList.contains("pr-note") || it.r.top - above.r.bottom > 14) bad.push(term.textContent + " (" + Math.round(dy) + " px, darüber " + (above ? above.el.className : "nichts") + ")");
          }
        }
        APP_TEST.done(); return { glossen: n > 40, bad };
      })`;
      await t.expect("Glossen an ihrem Begriff, nicht von Randnotizen verdrängt", probe, { glossen: true, bad: [] });
    },
  },

  // --- Lehrheft: Leerseite vor einem Teil nur, wenn davor kein ganzer Abschnitt nachrücken kann -------
  {
    name: "ui-lehrheft-leerseite-aufgelockert",
    book: "klein",
    run: async (t) => {
      const extra = ["Apfelwandel", "Pfannkuchenwende", "Salzentzug"];
      for (let n = 0; n <= extra.length; n++) {
        const probe = `APP_TEST.load({ book: ${JSON.stringify([...BOOKS.klein, ...extra.slice(0, n)])} }) && APP_TEST.print("primer").then(() => {
          const bad = [];
          for (const b of document.querySelectorAll("#print-root > .page.blank")) {
            const prev = b.previousElementSibling;
            if (!prev || !prev.classList.contains("flow")) continue;
            const kids = [...prev.querySelector(".page-inner").children];
            if (kids.findLastIndex((c) => c.tagName === "SECTION" && !c.dataset.splitOf && !c.dataset.splitId) > 0) bad.push(prev.querySelector(".page-foot span:last-child").textContent);
          }
          APP_TEST.done(); return bad; })`;
        await t.expect(`${n} Alltagszauber: kein verschiebbarer Abschnitt vor einer Leerseite`, probe, []);
      }
    },
  },

  // --- Lehrheft: Nummern nach Reihenfolge, Ids bleiben -----------------------------------------
  {
    name: "ui-lehrheft-nummern",
    book: "klein",
    run: async (t) => {
      await t.eval(`PROFILE.primer = { voices: { a: { label: "A", hand: "angular" } }, notes: { l8: [{ voice: "a", text: "NOTIZ-L8" }] }, lessons: { l30: { title: "ERSATZ-L30" } } }`);
      const probe = `APP_TEST.load({ book: ${JSON.stringify(BOOKS.klein)} }) && APP_TEST.print("primer").then(() => {
        const r = document.getElementById("print-root"), sec = (id) => r.querySelector('section[data-lesson="' + id + '"]');
        const out = { l8: sec("l8").querySelector(".ls-k").textContent, note: sec("l8").textContent.includes("NOTIZ-L8"), l30: sec("l30").querySelector(".ls-t").textContent,
          soap: sec("w-soap").querySelector(".ls-k").textContent, sigil: sec("g-sigil").querySelector(".ls-k").textContent, ref: sec("l30").textContent.includes("aus Lektion 18 und"), raw: r.textContent.includes("{{lesson") };
        APP_TEST.done(); return out; })`;
      await t.expect("Nummern, Notiz, Ersatz und Verweis", probe, { l8: "Lektion 10", note: true, l30: "ERSATZ-L30", soap: "Lektion 6", sigil: "Lektion 29", ref: true, raw: false });
    },
  },

  // --- Zaubertinten: aus den Entsprechungen, ohne Regelwirkung, ohne Randnotiz ---------------------
  {
    name: "ui-zaubertinten",
    book: "leer",
    run: async (t) => {
      const find = `SPELLS.map(analyze).find((m) => m.level >= 1 && m.primary === "ignis" && m.essences[1] && m.essences[1].id === "aer")`;
      await t.expect("Feuer mit Luft: Zinnober, Gold, Kupfer mit Begründung, Warnung", `(() => { const m = ${find}; const k = generateTexts(m).ink; return [/Zinnober/.test(k), /Goldstaub/.test(k), /Kupferstaub, denn /.test(k), /eigenem Pinsel/.test(k)]; })()`, [true, true, true, true]);
      await t.expect("gleich bei jedem Erzeugen", `(() => { const m = ${find}; return generateTexts(m).ink === generateTexts(analyze(m.spell)).ink; })()`, true);
      await t.expect("Zaubertrick ohne Tinte", `generateTexts(SPELLS.map(analyze).find((m) => m.level === 0)).ink`, "");
      await t.expect("keine Zahlen, keine Regeln, keine Tinte in Randnotizen", `(() => { const bad = []; for (const m of SPELLS.slice(0, 400).map(analyze)) { const x = generateTexts(m); if (/\\d|Bonus|Stufe|SG/.test(x.ink)) bad.push(m.name); if (x.notes.some((n) => /Tinte/.test(n))) bad.push("Notiz: " + m.name); } return bad.slice(0, 5); })()`, []);
      await t.expect("Tinte steht in den Entsprechungen", `(() => { const m = ${find}; return BOOK.spellPages(m, generateTexts(m), { detail: true }).map((p) => p.html).join("").includes('<p class="ink"><b>Tinte</b>'); })()`, true);
    },
  },

  // --- Sprachen -------------------------------------------------------------------------------
  {
    name: "ui-sprachtabellen-vollstaendig",
    book: "leer",
    run: async (t) => {
      await t.expect("gleiche Schlüssel in beiden Tabellen", `(() => { const d = Object.keys(LANG.de), e = Object.keys(LANG.en); return d.filter((k) => !(k in LANG.en)).concat(e.filter((k) => !(k in LANG.de))); })()`, []);
    },
  },
  {
    name: "ui-oberflaeche-englisch",
    book: "klein",
    run: async (t) => {
      const u = t.ui;
      await t.eval(`APP_TEST.load({ book: ${JSON.stringify(BOOKS.klein)}, settings: { uiLang: "en", bookLang: "de", rulesLang: "en" } }); I18N.apply(); I18N.missing.clear()`);
      await t.expect("Reiter englisch", `document.querySelector('${u.tab("browse")}').textContent.trim()`, "Catalogue");
      for (const v of ["book", "prepare", "theory", "browse"]) {
        await t.click(u.tab(v));
        await t.settled();
      }
      await t.click(u.settingsBtn);
      for (const sec of ["charakter", "buch", "druck", "sprache", "bestand"]) await t.click(`${u.settings} [data-sec="${sec}"]`);
      await t.eval(`document.querySelector("${u.settings}").close()`);
      await t.expect("keine fehlenden englischen Schlüssel", `[...I18N.missing].filter((k) => k.startsWith("en:"))`, []);
      await t.expect("Regeltext englisch beschriftet", `document.querySelector("#detail .rules")?.textContent.includes("Casting Time")`, true);
    },
  },
  {
    name: "ui-regelsprache-deutsch-ohne-daten",
    book: "klein",
    run: async (t) => {
      await t.eval(`Object.defineProperty(window, "RULES_DE", { value: undefined, configurable: true }); true`);
      const box = `(APP_TEST.load({ book: ["Fireball"], settings: { rulesLang: "de" } }), BOOK.rulesBox(analyze(SPELLS.find((s) => s.name === "Fireball"))).replace(/<[^>]+>/g, " ").replace(/\\s+/g, " "))`;
      await t.expect("übersetzte Werte in Metern", `${box}.includes("Lang (120 m + 12 m/Stufe)")`, true);
      await t.expect("Rettungswurf übersetzt", `${box}.includes("Reflex, halbiert")`, true);
      await t.expect("Hinweis auf lokale Regeltexte", `${box}.includes("tools/import-rules-de.mjs")`, true);
    },
  },

  {
    name: "ui-deutsche-regeldaten",
    book: "klein",
    run: async (t) => {
      // kleine Test-Regeldatei statt der lokalen
      await t.eval(`Object.defineProperty(window, "RULES_DE", { value: { fireball: { name: "Feuerball", source: "GRW 272", fields: { Schule: "Hervorrufung [Feuer]", Grad: "HXM/MAG 3", Reichweite: "Lang (120 m + 12 m/Stufe)" }, text: "Ein Feuerball erzeugt eine Flammenexplosion." } }, configurable: true }); true`);
      const box = (lang) => `(APP_TEST.load({ book: ["Fireball"], settings: { rulesLang: "${lang}" } }), BOOK.rulesBox(analyze(SPELLS.find((s) => s.name === "Fireball"))).replace(/<[^>]+>/g, " ").replace(/\\s+/g, " "))`;
      await t.expect("deutscher Name mit englischem daneben", `${box("de")}.includes("Feuerball (Fireball)")`, true);
      await t.expect("deutscher Regeltext und Quelle", `(${box("de")}).includes("Flammenexplosion") && (${box("de")}).includes("GRW 272")`, true);
      await t.expect("Name in der Regelsprache", `(APP_TEST.load({ settings: { rulesLang: "de" } }), RULES.name(SPELLS.find((s) => s.name === "Fireball")))`, "Feuerball");
      await t.expect("englisch bleibt englisch", `${box("en")}.includes("Feuerball")`, false);
      await t.expect("Rückfall ohne Eintrag", `(APP_TEST.load({ settings: { rulesLang: "de" } }), RULES.name(SPELLS.find((s) => s.name === "Shield")))`, "Shield");
    },
  },

  {
    name: "ui-regelbegriffe",
    book: "klein",
    run: async (t) => {
      // Begriffsübersetzung ohne Regeldaten (Meter): typische Werte aus den englischen Daten
      await t.eval(`Object.defineProperty(window, "RULES_DE", { value: undefined, configurable: true }); APP_TEST.load({ settings: { rulesLang: "de", units: "m" } }); true`);
      const cases = {
        "one living creature": "Eine lebende Kreatur",
        "creature or object touched": "Berührte Kreatur oder berührter Gegenstand",
        "melee weapon touched": "Berührte Nahkampfwaffe",
        "one creature/level, no two of which can be more than 30 ft. apart": "Eine Kreatur/Stufe, von denen keine zwei mehr als 9 m voneinander entfernt sein dürfen",
        "20-ft.-radius emanation centered on you": "Ausstrahlung mit 6 m Radius mit dir als Mittelpunkt",
        "cylinder (40-ft. radius, 20 ft. high)": "Zylinder (12 m Radius, 6 m hoch)",
        "10 minutes/level (D)": "10 Minuten/Stufe (A)",
        "1 round/level or until discharged": "1 Runde/Stufe oder bis entladen",
        "Will disbelief (if interacted with)": "Willen, anzweifeln (bei Interaktion)",
        "none or Will negates (harmless)": "Keiner oder Willen, keine Wirkung (harmlos)",
        "medium (100 ft. + 10 ft./level)": "Mittel (30 m + 3 m/Stufe)",
        "1 mile/level": "1,5 km/Stufe",
        "one swarm of bats, rats, or spiders": "Ein Schwarm aus Fledermäusen, Ratten oder Spinnen",
        "1d4 rounds": "1W4 Runden",
        "Fortitude negates, Will partial, see text": "Zähigkeit, keine Wirkung; Willen, teilweise, siehe Text",
        "one object or willing creature": "Ein Gegenstand oder eine bereitwillige Kreatur",
        "wall 4 ft./level wide, 2 ft./level high": "Wand 1,2 m/Stufe breit, 0,6 m/Stufe hoch",
      };
      for (const [en, de] of Object.entries(cases)) await t.expect(en, `RULES.term(${JSON.stringify(en)})`, de);
    },
  },

  {
    name: "ui-deutsche-domaenen",
    book: "klein",
    run: async (t) => {
      const dom = (lang, x) => `(APP_TEST.load({ settings: { rulesLang: "${lang}" } }), RULES.domain(${JSON.stringify(x)}))`;
      await t.eval(`Object.defineProperty(window, "DOMAINS_DE", { value: undefined, configurable: true }); true`);
      await t.expect("Domäne ohne Daten als Begriff", dom("de", "Law"), "Ordnung");
      await t.expect("Unterdomäne ohne Daten bleibt englisch", dom("de", "Arcane"), "Arcane");
      // kleine Test-Domänendatei statt der lokalen
      await t.eval(`Object.defineProperty(window, "DOMAINS_DE", { value: { Arcane: { name: "Arkanes", kind: "subdomain" }, Demon: { name: "Dämonen", kind: "subdomain" } }, configurable: true }); true`);
      await t.expect("Unterdomäne aus den Daten", dom("de", "Arcane"), "Arkanes");
      await t.expect("Klammer der Oberdomäne übersetzt", dom("de", "Demon (Chaos)"), "Dämonen (Chaos)");
      await t.expect("englisch bleibt englisch", dom("en", "Demon (Chaos)"), "Demon (Chaos)");
      const page = `(APP_TEST.load({ settings: { rulesLang: "de" } }), BOOK.deityPage(DEITIES.find((d) => d.id === "nethys")).replace(/<[^>]+>/g, " ").replace(/\\s+/g, " "))`;
      await t.expect("Gottheitsseite mit Unterdomänen", `${page}.includes("Unterdomänen Aeon, Arkanes, ")`, true);
    },
  },

  // --- Bedienung: Buch ---------------------------------------------------------------------
  {
    name: "ui-buch-blaettern",
    book: "klein",
    run: async (t) => {
      const u = t.ui;
      await t.click(u.tab("book"));
      await t.settled();
      await t.expect("Anfang: Seite 1 allein rechts", visibleNos(u.bookPages), ["1"]);
      await t.expect("Anfang: Platzhalter links", `!!document.querySelector("${u.bookPages} > .page-ghost")`, true);
      await t.click(u.bookGo("next"));
      await t.settled();
      await t.expect("weiterblättern", visibleNos(u.bookPages), ["2", "3"]);
      await t.key("ArrowRight");
      await t.settled();
      await t.expect("Pfeil rechts", visibleNos(u.bookPages), ["4", "5"]);
      await t.key("ArrowLeft");
      await t.settled();
      await t.expect("Pfeil links", visibleNos(u.bookPages), ["2", "3"]);
      await t.type(u.bookGoto, "20");
      await t.settled();
      await t.expect("Seitenzahl 20 eingeben", visibleNos(u.bookPages), (v) => v.includes("20"));
      const before = await t.eval(visibleNos(u.bookPages));
      await t.click(u.bookGo("nextSpell"));
      await t.settled();
      await t.expect("nächster Zauber beginnt auf sichtbarer Seite", `[...document.querySelectorAll("${u.bookPages} > .page:not(.offstage)")].some((p) => p.querySelector(".sp-head"))`, true);
      await t.expect("nächster Zauber: weitergeblättert", visibleNos(u.bookPages), (v) => +v[0] > +before[0]);
      await t.click(u.bookGo("last"));
      await t.settled();
      await t.expect("Ende: Weiterblättern gesperrt", `document.querySelector('${u.bookGo("next")}').disabled`, true);
      await t.click(u.bookGo("first"));
      await t.settled();
      await t.expect("Anfang", visibleNos(u.bookPages), ["1"]);
    },
  },
  {
    name: "ui-buch-schmal",
    book: "klein",
    run: async (t) => {
      const u = t.ui;
      await t.click(u.tab("book"));
      await t.settled();
      await t.click(u.bookGo("next"));
      await t.settled();
      await t.expect("breit: Doppelseite", visibleNos(u.bookPages), ["2", "3"]);
      await t.resize(900);
      await t.settled();
      await t.expect("schmal: eine Seite", visibleNos(u.bookPages), (v) => v.length === 1);
      await t.click(u.bookGo("next"));
      await t.settled();
      await t.expect("schmal: Weiterblättern um eine Seite", visibleNos(u.bookPages), ["3"]);
      await t.resize(1600);
    },
  },
  {
    // Zoom nur für die Seiten: Oberfläche gleich groß, Satz unverändert, Doppelseite wird bei Bedarf zur Einzelseite
    name: "ui-seitenzoom",
    book: "klein",
    run: async (t) => {
      const u = t.ui;
      const zoomBtn = (z) => `${u.bookPager} [data-zoom="${z}"]`;
      const pageW = `Math.round(document.querySelector("${u.bookPages} > .page:not(.offstage)").getBoundingClientRect().width)`;
      const uiH = `[document.querySelector("${u.bookPager}").getBoundingClientRect().height, document.querySelector("${u.bookToc}").getBoundingClientRect().width].map(Math.round)`;
      // Fingerabdruck des Satzes: je Seite Füllfaktor und Textlänge (Folgeseiten eines Zaubers teilen den
      // kleinsten Füllfaktor der gerade gesetzten Seiten, darum Einzelseite mit Einzelseite vergleichen)
      const sig = `[...document.querySelectorAll("${u.bookPages} > .page:not(.offstage)")].map((p) => p.querySelector(".page-foot span:last-child").textContent.trim() + ":" + [...p.querySelectorAll(".page-inner, .half")].map((x) => getComputedStyle(x).getPropertyValue("--fit") + "/" + x.textContent.length).join(","))`;
      await t.click(u.tab("book"));
      await t.settled();
      await t.type(u.bookGoto, "12");
      await t.settled();
      await t.expect("100 %: Doppelseite", visibleNos(u.bookPages), ["12", "13"]);
      await t.expect("100 %: Anzeige", text(zoomBtn("reset")), "100 %");
      const w0 = await t.eval(pageW), ui0 = await t.eval(uiH);
      await t.click(zoomBtn("in"));
      await t.settled();
      await t.expect("110 %: Seiten breiter", pageW, (w) => w > w0);
      await t.expect("110 %: Blätterleiste und Verzeichnis gleich groß", uiH, ui0);
      await t.click(zoomBtn("in"));
      await t.click(zoomBtn("in"));
      await t.settled();
      await t.expect("150 %: Einzelseite", visibleNos(u.bookPages), ["12"]);
      await t.expect("150 %: gemerkt", `localStorage.getItem("spellbook.pageZoom")`, "1.5");
      await t.click(zoomBtn("out"));
      await t.click(zoomBtn("out"));
      await t.click(zoomBtn("out"));
      await t.settled();
      await t.expect("zurück auf 100 %: wieder Doppelseite", visibleNos(u.bookPages), ["12", "13"]);
      // Satz: Einzelseite bei 100 % (schmales Fenster) und bei 175 % (neu gesetzt) gleich
      await t.resize(900);
      await t.settled();
      const sig1 = await t.eval(sig);
      await t.resize(1600);
      await t.key("+"); await t.key("+"); await t.key("+"); await t.key("+");
      await t.settled();
      await t.expect("Taste +: 175 %", text(zoomBtn("reset")), "175 %");
      await t.click(u.bookGo("last"));
      await t.settled();
      await t.type(u.bookGoto, "12");
      await t.settled();
      await t.expect("175 %: Seite 12 allein", visibleNos(u.bookPages), ["12"]);
      await t.expect("175 %: Satz wie bei 100 %", sig, sig1);
      await t.key("0");
      await t.settled();
      await t.expect("Taste 0: 100 %", text(zoomBtn("reset")), "100 %");
      await t.expect("Taste 0: Doppelseite", visibleNos(u.bookPages), ["12", "13"]);
      // Einpassen: füllt die Höhe und wächst mit dem Fenster
      await t.click(zoomBtn("fit"));
      await t.settled();
      const bottom = `Math.round(document.querySelector("${u.bookPages} > .page:not(.offstage)").getBoundingClientRect().bottom)`;
      await t.expect("Einpassen: Seitenunterkante nahe am Fensterrand", bottom, (b) => b > 1100 - 80 && b <= 1100);
      const wFit = await t.eval(pageW);
      await t.resize(2400, 1400);
      await t.settled();
      await t.expect("Einpassen: wächst mit dem Fenster", pageW, (w) => w > wFit);
      await t.expect("Einpassen: Stufe gemerkt", `localStorage.getItem("spellbook.pageZoom")`, '"fit"');
      // schmal und groß: waagrecht verschiebbar, Kopf bleibt fensterbreit
      await t.click(zoomBtn("fit"));
      await t.resize(500);
      await t.settled();
      await t.expect("schmal 100 %: Seite verkleinert", pageW, (w) => w < 500);
      await t.click(zoomBtn("in"));
      await t.settled();
      await t.expect("schmal 110 %: Seitenfläche verschiebbar", `(() => { const r = document.querySelector("${u.bookPages}"); return r.scrollWidth > r.clientWidth; })()`, true);
      await t.expect("schmal 110 %: Seite nicht breiter", `document.documentElement.scrollWidth <= window.innerWidth`, true);
      await t.resize(1600);
    },
  },
  {
    name: "ui-buch-verzeichnis",
    book: "klein",
    run: async (t) => {
      const u = t.ui;
      await t.click(u.tab("book"));
      await t.settled();
      if (await t.eval(`document.querySelector("${u.bookToc}").classList.contains("collapsed")`)) await t.click(u.bookTocToggle);
      await t.expect("Verzeichnis offen", `document.querySelector("${u.bookToc}").classList.contains("collapsed")`, false);
      await t.expect("Abschnitte zu Beginn zu", `[...document.querySelectorAll("${u.bookTocGroup}.open")].length`, 0);
      const grp = await t.eval(`[...document.querySelectorAll("${u.bookTocGroup}")].findIndex((g) => /III\\. Grad/.test(g.dataset.grp))`);
      await t.expect("Abschnitt III. Grad vorhanden", `${grp >= 0}`, true);
      await t.click(`${u.bookTocGroup}:nth-child(${grp + 1}) .toc-grade`);
      await t.expect("III. Grad aufgeklappt", `document.querySelectorAll("${u.bookTocGroup}")[${grp}].classList.contains("open")`, true);
      await t.expect("andere bleiben zu", `[...document.querySelectorAll("${u.bookTocGroup}.open")].length`, 1);
      const page = await t.eval(`document.querySelectorAll("${u.bookTocGroup}")[${grp}].querySelector("li[data-page]:not(.toc-chapter)").dataset.page`);
      await t.click(`${u.bookTocGroup}:nth-child(${grp + 1}) li[data-page]:not(.toc-chapter)`);
      await t.settled();
      await t.expect("Zauber angesprungen", visibleNos(u.bookPages), (v) => v.includes(page));
    },
  },
  {
    name: "ui-seitenleisten",
    book: "klein",
    run: async (t) => {
      const u = t.ui;
      await t.click(u.tab("book"));
      await t.settled();
      const was = await t.eval(`document.querySelector("${u.bookLeft}").classList.contains("collapsed")`);
      await t.click(u.bookLeftToggle);
      await t.expect("linke Leiste umgeschaltet", `document.querySelector("${u.bookLeft}").classList.contains("collapsed")`, !was);
      await t.click(u.bookLeftToggle);
      await t.expect("linke Leiste zurück", `document.querySelector("${u.bookLeft}").classList.contains("collapsed")`, was);
      const toc = await t.eval(`document.querySelector("${u.bookToc}").classList.contains("collapsed")`);
      await t.click(u.bookTocToggle);
      await t.expect("Verzeichnis umgeschaltet", `document.querySelector("${u.bookToc}").classList.contains("collapsed")`, !toc);
    },
  },

  // --- Bedienung: Lehre und Lehrheft -----------------------------------------------------------
  {
    name: "ui-lehre-zeigt-lehrheft",
    book: "klein",
    run: async (t) => {
      const u = t.ui;
      await t.click(u.tab("theory"));
      await t.settled();
      await t.expect("Lehrheft sofort sichtbar", `!document.querySelector("${u.primerView}").hidden && document.querySelector("${u.theoryView}").hidden`, true);
      await t.expect("keine Unterpunkte", `!!document.querySelector(".lehre-nav")`, false);
      await t.expect("Lehrheft beginnt mit Seite 1", visibleNos(u.primerPages), ["1"]);
    },
  },
  // --- Bedienung: Vademecum ---------------------------------------------------------------------
  {
    name: "ui-vademecum-ohne-gottheit",
    book: "klein",
    run: async (t) => {
      await t.click(t.ui.tab("theory"));
      await t.settled();
      await t.expect("Magier ohne Gottheit: keine Auswahl, Lehrheft", `document.querySelector("#lehre-switch").hidden && !document.querySelector("#primer-view").hidden && document.querySelector("#vademecum-view").hidden`, true);
    },
  },
  {
    name: "ui-vademecum-paladin-duenn",
    book: "paladin",
    cls: "paladin",
    run: async (t) => {
      await t.click(t.ui.tab("theory"));
      await t.settled();
      await t.expect("Auswahl sichtbar: Vom Gebet / Vademecum", `[...document.querySelectorAll("#lehre-switch button")].map((b) => b.textContent)`, ["Vom Gebet", "Vademecum"]);
      await t.expect("zuerst Vom Gebet", `!document.querySelector("#theory-view").hidden`, true);
      await t.click('#lehre-switch [data-lehre="vademecum"]');
      await t.settled();
      await t.expect("Vademecum sichtbar", `!document.querySelector("#vademecum-view").hidden && document.querySelector("#theory-view").hidden`, true);
      await t.expect("einfaches Buch: kein Wenden", `document.querySelector("#btn-vm-turn").hidden`, true);
      // Durchsicht von Hand: VM_SHOTS=<ordner> node tools/test-browser.mjs --only vademecum
      if (process.env.VM_SHOTS) for (const [k, go] of [["paladin-1", "first"], ["paladin-2", "next"], ["paladin-3", "next"]]) { await t.click("#vm-pager-0 [data-go=" + go + "]"); await t.settled(); await t.shot(process.env.VM_SHOTS + "/" + k + ".png"); }
      // ohne lokale Texte: Wesen und Choräle (mit Profil auch Riten und Feste aus den Festen des Profils)
      await t.expect("Kapitel: Wesen und Choräle", `[...document.querySelectorAll("#vm-pages-0 .vm-ch h3")].map((h) => h.textContent).filter((x) => x !== "Riten und Feste")`, ["Vom Wesen", "Choräle"]);
      await t.expect("Kapitelzählung lückenlos", `[...document.querySelectorAll("#vm-pages-0 .vm-ch .ch-kicker")].map((h, i) => h.textContent === "Kapitel " + ["I", "II", "III"][i]).every(Boolean)`, true);
      await t.expect("Verzeichnis mit Seitenzahlen", `[...document.querySelectorAll("#vm-pages-0 .vm-toc .vref")].every((v) => /^\\d+$/.test(v.textContent))`, true);
      await t.expect("Verzeichnis zeigt richtige Seiten", `[...document.querySelectorAll("#vm-pages-0 .vm-toc .vref")].every((v) => { const a = document.querySelector('#vm-pages-0 [data-anchor="' + v.dataset.ref + '"]'); return a && a.closest(".page").querySelector(".page-foot span:last-child").textContent === v.textContent; })`, true);
      await t.expect("Choräle: jede Zeile mit Lücke", `[...document.querySelectorAll("#vm-pages-0 .vm-hymn .vm-line")].every((l) => l.querySelector(".vm-gap"))`, true);
      await t.expect("keine Seite läuft über", `[...document.querySelectorAll("#vm-pages-0 .page-inner")].every((i) => i.scrollHeight <= i.clientHeight + 1)`, true);
      await t.expect("kein Kapitelkopf allein auf einer Seite", `[...document.querySelectorAll("#vm-pages-0 .vm-ch")].every((h) => h.nextElementSibling)`, true);
      await t.click("#lehre-switch [data-lehre=main]");
      await t.settled();
      await t.expect("zurück zu Vom Gebet", `!document.querySelector("#theory-view").hidden && document.querySelector("#vademecum-view").hidden`, true);
    },
  },
  {
    name: "ui-vademecum-wendebuch",
    book: "klein",
    deity: "nethys",
    run: async (t) => {
      await t.click(t.ui.tab("theory"));
      await t.settled();
      await t.expect("Magier mit Gottheit: Auswahl Lehrheft / Vademecum", `[...document.querySelectorAll("#lehre-switch button")].map((b) => b.textContent)`, ["Lehrheft", "Vademecum"]);
      await t.click('#lehre-switch [data-lehre="vademecum"]');
      await t.settled();
      await t.expect("Wendebuch: Wenden sichtbar", `!document.querySelector("#btn-vm-turn").hidden`, true);
      await t.expect("Hälfte 1 sichtbar", `!document.querySelector('.vm-half[data-half="0"]').hidden && document.querySelector('.vm-half[data-half="1"]').hidden`, true);
      await t.expect("gleiches Kapitelgerüst in beiden Hälften", `(() => { const k = (i) => [...document.querySelectorAll("#vm-pages-" + i + " .vm-ch .ch-kicker")].map((h) => h.textContent).join("|"); return k(0) === k(1) && k(0).length > 0; })()`, true);
      await t.expect("Mitte: eigene aufrecht am Ende, die der anderen Hälfte kopfüber", `[0, 1].map((i) => { const l = [...document.querySelectorAll("#vm-pages-" + i + " > .page")]; const own = l.filter((p) => p.classList.contains("vm-mid") && !p.classList.contains("vm-mid-foreign")); const fo = l.filter((p) => p.classList.contains("vm-mid-foreign")); return (own.every((p) => !p.classList.contains("upside-down")) && fo.every((p) => p.classList.contains("upside-down")) && l.pop().classList.contains("vm-mid")) + "/" + (own.length + fo.length > 0); })`, ["true/true", "true/true"]);
      await t.expect("Seitenzahlen je Hälfte ab 1", `[0, 1].map((i) => document.querySelector("#vm-pages-" + i + " > .page .page-foot span:last-child").textContent)`, ["1", "1"]);
      await t.expect("Verzeichnis der Seitenleiste: Kapitel und Mitte", `[...document.querySelectorAll("#vm-toc > .toc-group")].pop().dataset.grp`, "middle");
      await t.expect("alle Verweise aufgelöst", `[...document.querySelectorAll(".vm-pages .vref")].every((v) => /^(\\S+ )?\\d+$/.test(v.textContent))`, true);
      await t.expect("keine Seite läuft über", `[...document.querySelectorAll(".vm-pages .page-inner")].every((i) => i.scrollHeight <= i.clientHeight + 1)`, true);
      if (process.env.VM_SHOTS) {
        for (const k of [1, 2, 3, 4, 5]) { await t.shot(process.env.VM_SHOTS + "/nethys-a" + k + ".png"); await t.click("#vm-pager-0 [data-go=next]"); await t.settled(); }
        await t.click("#vm-pager-0 [data-go=first]");
        await t.settled();
      }
      // Wenden behält die Seite je Hälfte
      await t.click("#vm-pager-0 [data-go=next]");
      await t.settled();
      const a = await t.eval(visibleNos("#vm-pages-0"));
      await t.click("#btn-vm-turn");
      await t.settled();
      await t.expect("nach dem Wenden: zweite Hälfte sichtbar", `!document.querySelector('.vm-half[data-half="1"]').hidden`, true);
      await t.expect("zweite Hälfte beginnt bei 1", visibleNos("#vm-pages-1"), ["1"]);
      await t.click("#vm-pager-1 [data-go=last]");
      await t.settled();
      const b = await t.eval(visibleNos("#vm-pages-1"));
      await t.click("#btn-vm-turn");
      await t.settled();
      await t.expect("zurückgewendet: alte Seite der ersten Hälfte", visibleNos("#vm-pages-0"), a);
      await t.click("#btn-vm-turn");
      await t.settled();
      await t.expect("wieder gewendet: alte Seite der zweiten Hälfte", visibleNos("#vm-pages-1"), b);
      if (process.env.VM_SHOTS) await t.shot(process.env.VM_SHOTS + "/nethys-b-last.png");
      await t.expect("Verzeichnis folgt: Mitte hervorgehoben", `document.querySelector("#vm-toc > .toc-group.on")?.dataset.grp`, "middle");
      // Druck: ganzes Wendebuch
      await t.eval(`APP_TEST.print("vademecum")`);
      await t.expect("Druck: gerade Seitenzahl", `document.querySelectorAll("#print-root > .page").length % 2`, 0);
      await t.expect("Druck: jede Mitte einmal, keine gegenüberstehende Kopie", `document.querySelectorAll("#print-root > .page.vm-mid").length > 0 && !document.querySelector("#print-root > .page.vm-mid-foreign")`, true);
      await t.expect("Druck: letzte Seite ist das Titelblatt der zweiten Hälfte, kopfüber", `(() => { const p = [...document.querySelectorAll("#print-root > .page")].pop(); return p.classList.contains("vm-title") && p.classList.contains("upside-down"); })()`, true);
      await t.expect("Druck: zweite Hälfte rückwärts", `(() => { const l = [...document.querySelectorAll("#print-root > .page.upside-down .page-foot span:last-child")].map((s) => +s.textContent).filter(Boolean); return l.every((n, i) => !i || n < l[i - 1]); })()`, true);
      await t.expect("Druck: Lochrand nach der Drehung an der Bindungskante", `[...document.querySelectorAll("#print-root > .page.bind")].every((p, i) => { const odd = i % 2 === 0; const verso = p.classList.contains("verso"); const flip = p.classList.contains("upside-down"); return (flip ? verso : !verso) === odd; })`, true);
      await t.eval(`APP_TEST.done()`);
      await t.eval(`APP_TEST.print("vademecum", { hooks: false })`);
      await t.expect("Druck ohne Kapitel IX", `!document.querySelector("#print-root .part-hooks") && [...document.querySelectorAll("#print-root .vm-toc .nm")].every((n) => !/Anregungen|Regelskizzen/.test(n.textContent))`, true);
      await t.eval(`APP_TEST.done()`);
      await t.eval(`APP_TEST.print("vademecum", { half: 1 })`);
      await t.expect("Druck einer Hälfte: nichts kopfüber", `document.querySelectorAll("#print-root > .page.upside-down").length`, 0);
      await t.eval(`APP_TEST.done()`);
    },
  },
  {
    // gesetzt, während die zweite Hälfte offen ist: auch die verborgene erste Hälfte muss richtig umbrechen
    name: "ui-vademecum-satz-beide-haelften",
    book: "klein",
    deity: "nethys",
    settings: { charLevel: 9 },
    run: async (t) => {
      await t.eval(`localStorage.setItem(CHARS.key("lehreView"), '"vademecum"'); localStorage.setItem(CHARS.key("vmHalf"), "1"); true`);
      await t.click(t.ui.tab("theory"));
      await t.settled();
      await t.until(`document.querySelectorAll("#vm-pages-0 > .page").length > 0 && document.querySelectorAll("#vm-pages-1 > .page").length > 0`);
      for (const i of [1, 0]) {
        if (await t.eval(`document.querySelector('.vm-half[data-half="${i}"]').hidden`)) { await t.click("#btn-vm-turn"); await t.settled(); }
        await t.eval(`document.querySelectorAll("#vm-pages-${i} > .page").forEach((p) => (p.style.contentVisibility = "visible")); true`);
        // mit dem echten Text (lokale Datei) hat jede Hälfte gut 40 Seiten; verborgen gesetzt waren es nur gut 20
        await t.expect(`Hälfte ${i}: genug Seiten`, `!VADEMECUM.local.nethys || document.querySelectorAll("#vm-pages-${i} > .page").length > 40`, true);
        await t.expect(`Hälfte ${i}: Seitenverweise ({{page:…}}) ohne Zeichen`, `[...document.querySelectorAll("#vm-pages-${i} .vref[data-plain]")].every((v) => /^\\d+$/.test(v.textContent))`, true);
        await t.expect(`Hälfte ${i}: Verweis direkt hinter „S.“`, `[...document.querySelectorAll("#vm-pages-${i} .mnote .vref")].every((v) => v.getBoundingClientRect().width < 30)`, true);
        await t.expect(`Hälfte ${i}: keine Seite läuft über`, `[...document.querySelectorAll("#vm-pages-${i} > .page")].filter((p) => { const n = p.querySelector(".page-inner"); return n.scrollHeight > n.clientHeight + 1; }).map((p) => p.querySelector(".page-foot span:last-child").textContent)`, []);
        await t.expect(`Hälfte ${i}: keine Überschrift allein am Seitenende`, `[...document.querySelectorAll("#vm-pages-${i} > .page")].filter((p) => { const n = p.querySelector(".page-inner"); let l = n.lastElementChild; while (l && l.classList.contains("splittable") && l.lastElementChild) l = l.lastElementChild; return l && (l.classList.contains("keep-next") || l.classList.contains("ls-head")); }).map((p) => p.querySelector(".page-foot span:last-child").textContent)`, []);
        await t.expect(`Hälfte ${i}: kein Abschnitt nur aus Kopf am Seitenende`, `[...document.querySelectorAll("#vm-pages-${i} .lesson")].filter((s) => s.children.length && [...s.children].every((c) => c.classList.contains("ls-head") || c.classList.contains("vm-anchor") || c.classList.contains("mnote")) && !(s.nextElementSibling && s.dataset.splitId && s.nextElementSibling.dataset.splitOf === s.dataset.splitId)).map((s) => s.closest(".page").querySelector(".page-foot span:last-child").textContent + ":" + s.dataset.lesson)`, []);
      }
    },
  },
  {
    name: "node-vademecum",
    node: async ({ root }) => tool(root, "vademecum", ["tools/vademecum-test.mjs"]),
  },
  {
    name: "ui-vom-gebet-blaettern",
    book: "paladin",
    cls: "paladin",
    run: async (t) => {
      const u = t.ui;
      await t.click(u.tab("theory"));
      await t.settled();
      await t.expect("Vom Gebet sichtbar", `!document.querySelector("${u.theoryView}").hidden && document.querySelector("${u.primerView}").hidden`, true);
      await t.expect("Seite 1 allein rechts", visibleNos(u.theoryPages), ["1"]);
      await t.click(u.theoryGo("next"));
      await t.settled();
      await t.expect("weiterblättern", visibleNos(u.theoryPages), ["2", "3"]);
    },
  },
  {
    name: "ui-lehrheft-verzeichnis",
    book: "klein",
    run: async (t) => {
      const u = t.ui;
      await t.click(u.tab("theory"));
      await t.settled();
      await t.click(u.primerTocPart("VI"));
      await t.settled();
      await t.expect("Teil VI hervorgehoben", text(u.primerTocCurrent), /VI · Kreise lesen/);
      await t.expect("Teil VI aufgeklappt", `!!document.querySelector('#primer-toc .toc-group.open[data-grp="VI"]')`, true);
      await t.click(u.primerTocLesson("l37"));
      await t.settled();
      await t.expect("Lektion 37 auf sichtbarer Seite", `[...document.querySelectorAll("${u.primerPages} > .page:not(.offstage)")].some((p) => p.querySelector('[data-lesson="l37"]'))`, true);
      await t.expect("Teil beginnt auf ungerader Seite", `+document.querySelector("${u.primerPages} > .page.part-VI:not(.blank)").querySelector(".page-foot span:last-child").textContent % 2`, 1);
    },
  },
  {
    name: "ui-lehrheft-blaettern",
    book: "klein",
    run: async (t) => {
      const u = t.ui;
      await t.click(u.tab("theory"));
      await t.settled();
      await t.click(u.primerGo("first"));
      await t.expect("Anfang", visibleNos(u.primerPages), ["1"]);
      await t.click(u.primerGo("next"));
      await t.expect("weiterblättern", visibleNos(u.primerPages), ["2", "3"]);
      await t.key("ArrowRight");
      await t.expect("Pfeil rechts", visibleNos(u.primerPages), ["4", "5"]);
      // bis in Teil III blättern: das Verzeichnis folgt
      for (let i = 0; i < 20; i++) {
        if (await t.eval(`[...document.querySelectorAll("${u.primerPages} > .page:not(.offstage)")].some((p) => p.classList.contains("part-III"))`)) break;
        await t.click(u.primerGo("next"));
      }
      await t.expect("Verzeichnis folgt dem Blättern", text(u.primerTocCurrent), /III · Die Glyphen/);
      // neu durch den gemeinsamen Betrachter: Seitenzahl eingeben, nächste Lektion
      await t.type(u.primerGoto, "20");
      await t.expect("Seitenzahl 20 eingeben", visibleNos(u.primerPages), (v) => v.includes("20"));
      const before = await t.eval(visibleNos(u.primerPages));
      await t.click(u.primerGo("nextUnit"));
      await t.expect("nächste Lektion beginnt auf sichtbarer Seite", `[...document.querySelectorAll("${u.primerPages} > .page:not(.offstage)")].some((p) => p.querySelector(".lesson[data-lesson]:not([data-split-of])"))`, true);
      await t.expect("nächste Lektion: weitergeblättert", visibleNos(u.primerPages), (v) => +v[0] > +before[0]);
      await t.click(u.primerSideToggle);
      await t.expect("Verzeichnis eingeklappt", `document.querySelector("${u.primerSide}").classList.contains("collapsed")`, true);
      await t.click(u.primerSideToggle);
      await t.expect("Verzeichnis offen", `document.querySelector("${u.primerSide}").classList.contains("collapsed")`, false);
      await t.resize(900);
      await t.expect("schmal: eine Seite", visibleNos(u.primerPages), (v) => v.length === 1);
      await t.resize(1600);
    },
  },
  {
    name: "ui-einstellungen-lochrand",
    book: "klein",
    run: async (t) => {
      const u = t.ui;
      await t.click(u.tab("theory"));
      await t.settled();
      await t.expect("Lochrand ab Werk", `!!document.querySelector("${u.primerPages} > .page.bind")`, true);
      await t.click(u.settingsBtn);
      await t.expect("Dialog offen", `document.querySelector("${u.settings}").open`, true);
      await t.click(`${u.settings} [data-sec="druck"]`);
      await t.expect("Abschnitt Druck sichtbar", `!document.querySelector('${u.settings} section[data-sec="druck"]').hidden && document.querySelector('${u.settings} section[data-sec="buch"]').hidden`, true);
      await t.eval(`(() => { const el = document.querySelector('${u.settings} [name="primerGutter"]'); el.checked = false; el.dispatchEvent(new Event("change", { bubbles: true })); })()`);
      await t.eval(`(() => { const d = document.querySelector("${u.settings}"); const b = [...d.querySelectorAll("button")].find((x) => /Fertig/.test(x.textContent)); b ? b.click() : d.close(); })()`);
      await t.until(`!document.querySelector("${u.settings}").open`);
      await t.sleep(200);
      await t.settled();
      await t.expect("ohne Lochrand gesetzt", `!!document.querySelector("${u.primerPages} > .page.bind")`, false);
      await t.expect("ohne Leerseiten", `!!document.querySelector("${u.primerPages} > .page.blank")`, false);
    },
  },

  {
    name: "ui-einstellungen-stufe-und-meister",
    book: "klein",
    run: async (t) => {
      const u = t.ui;
      await t.eval(`PROFILE.primer = { voices: { a: { label: "A" } }, notes: { l1: [{ voice: "a", level: 4, text: "NOTIZ-STUFE4" }] } }`);
      await t.click(u.tab("theory"));
      await t.settled();
      await t.expect("ohne Stufe: Notiz verborgen", `document.querySelector("${u.primerPages}").textContent.includes("NOTIZ-STUFE4")`, false);
      await t.click(u.settingsBtn);
      await t.expect("Meister: Platzhalter ohne Profilname", `document.querySelector('${u.settings} [name="primerMaster"]').placeholder`, "der Meister");
      const set = (k, v, sec) => t.eval(`(() => { document.querySelector('${u.settings} [data-sec="${sec}"]').click(); const el = document.querySelector('${u.settings} [name="${k}"]'); el.value = ${JSON.stringify(v)}; el.dispatchEvent(new Event("input", { bubbles: true })); })()`);
      await set("charLevel", "4", "charakter");
      await set("primerMaster", "Meisterin Testa", "buch");
      await t.eval(`document.querySelector("${u.settings}").close()`);
      await t.until(`!document.querySelector("${u.settings}").open`);
      await t.sleep(200);
      await t.settled();
      await t.expect("Stufe 4: Notiz sichtbar", `document.querySelector("${u.primerPages}").textContent.includes("NOTIZ-STUFE4")`, true);
      await t.expect("Meister auf dem Titelblatt", `document.querySelector("${u.primerPages} .primer-title").textContent.includes("Meisterin Testa")`, true);
    },
  },

  // --- Andacht (Schutzgottheit am Magier) ------------------------------------------------------
  {
    name: "ui-andacht-texte",
    book: "klein",
    deity: "nethys",
    run: async (t) => {
      const day = `PREP.api.dayList().find((d) => d.current)`;
      const id = (n) => `SPELLS.find((s) => s.name === ${JSON.stringify(n)}).id`;
      await t.expect("Andacht mit Schutzgottheit", `DEVOTION.enabled() && DEITY.id`, "nethys");
      await t.expect("ohne Profil: Anrufung, Vorbereitung, Schluss", `DEVOTION.morning(${day}).steps.map((s) => s.step)`, ["invoke", "prepare", "close"]);
      await t.expect("gleicher Tag, gleicher Text", `JSON.stringify(DEVOTION.morning(${day})) === JSON.stringify(DEVOTION.morning(${day}))`, true);
      await t.expect("Zwiespalt in der Anrufung", `DEVOTION.morning(${day}).steps[0].lines.join(" ")`, /Du zerbrichst, was nicht trägt, du bewahrst, was trägt/);
      await t.expect("Ruhetag: Formeln ungenutzt zurück, Bitte ums Behalten", `(() => { const s = DEVOTION.evening(${day}).steps; return [s.find((x) => x.step === "review").lines.join(" ").includes("ungenutzt zurück"), s.some((x) => x.step === "keep")]; })()`, [true, true]);
      await t.eval(`PREP.api.record("cast", ${id("Magic Missile")}, 1); PREP.api.record("cast", ${id("Magic Missile")}, 1); PREP.api.record("cast", ${id("Shield")}, 1)`);
      await t.expect("Abend nennt den meistgewirkten Zauber", `DEVOTION.evening(${day}).steps.find((x) => x.step === "review").lines[0]`, /Magic Missile \(2-mal\) und eine weitere Formel/);
      await t.eval(`PROFILE.devotion = { ...PROFILE.devotion, feasts: [{ d: 8, m: 8, name: "FESTTAG-TEST" }], evening: [{ step: "invoke" }, { step: "studyBook", optional: true }, { step: "review" }, { step: "keep" }, { step: "close" }] }`);
      await t.expect("gewöhnlicher Tag ohne Festtag", `DEVOTION.morning(${day}).feast`, null);
      await t.eval(`(() => { const d = ${day}; PREP.api.setIngame(d.id, "d", 8); PREP.api.setIngame(d.id, "m", 8); })()`);
      await t.expect("Festtag nach der Anrufung", `DEVOTION.morning(${day}).steps.map((s) => s.label).slice(0, 2)`, ["Anrufung", "FESTTAG-TEST"]);
      await t.expect("Studium vor der Bitte ums Behalten", `DEVOTION.evening(${day}).steps.map((s) => s.step).join(",")`, "invoke,studyBook,review,keep,close");
      await t.expect("Anlass: höchstens vier Zeilen, mit Anrede", `DEVOTION.OCCASIONS.map((k) => DEVOTION.occasion(k)).every((o) => o.lines.length <= 4 && /Nethys/.test(o.lines[0]))`, true);
      await t.eval(`PROFILE.devotion.occasions = { dead: "EIGENES-TOTENGEBET" }`);
      await t.expect("eigener Anlasstext", `DEVOTION.occasion("dead").lines`, ["EIGENES-TOTENGEBET"]);
    },
  },
  {
    name: "ui-andacht-zwiespalt-brevier",
    book: "klein",
    run: async (t) => {
      const m = `analyze(SPELLS.find((s) => s.name === "Shield"))`;
      await t.expect("Nethys: Doppelvers im Kanon", `(() => { const c = PRAYER.texts(${m}, deityById("nethys")).canon; return [c.dual, c.lines.some((l) => l.dual && /du bewahrst/.test(l.t))]; })()`, [true, true]);
      await t.expect("Iomedae: kein Zwiespalt", `PRAYER.texts(${m}, deityById("iomedae")).canon.dual`, false);
      await t.expect("Pharasma: Tod und Heilung", `PRAYER.dual(deityById("pharasma"))`, "Du nimmst, was endet, du gibst, was fehlt.");
    },
  },
  {
    name: "ui-andacht-fragment",
    book: "klein",
    deity: "nethys",
    run: async (t) => {
      await t.eval(`PROFILE.devotion = { ...PROFILE.devotion, obedience: "fragment" }`);
      const seven = `Array.from({ length: 7 }, (_, i) => DEVOTION.fragment({ id: "2026-01-0" + (i + 1) + "T08:00:00.000Z", meta: {} }))`;
      await t.expect("sieben Tage, sieben Zauber", `new Set(${seven}.map((f) => f.id)).size`, 7);
      await t.expect("Tag behält sein Fragment", `DEVOTION.fragment({ id: "2026-01-03T08:00:00.000Z", meta: {} }).id === DEVOTION.fragment({ id: "2026-01-03T08:00:00.000Z", meta: {} }).id`, true);
      await t.expect("abgebrochen, Teilkreis ohne Weitenringe und Schriftband", `(() => { const f = DEVOTION.fragment({ id: "2026-01-02T08:00:00.000Z", meta: {} }); return [f.lines.length, /—$/.test(f.lines[1]), /dv-stub/.test(f.svg), /layer-range|textPath/.test(f.svg)]; })()`, [2, true, true, false]);
    },
  },
  {
    name: "ui-andachtsblatt-druck",
    book: "klein",
    deity: "nethys",
    settings: { paper: "a4" },
    run: async (t) => {
      await t.eval(`PROFILE.devotion = { ...PROFILE.devotion, obedience: "fragment", log: true }`);
      await t.expect("Blatt immer A5", `APP_TEST.print("devotion").then((r) => r.paper)`, "a5");
      await t.expect("Vorderseite Lochrand links, Rückseite rechts, kein Überlauf", `(() => { const p = [...document.querySelectorAll("#print-root > .page")]; const r = [p.length, p[0].classList.contains("bind") && !p[0].classList.contains("verso"), p[1].classList.contains("verso"), !!p[0].querySelector(".dv-frag-big svg"), document.querySelectorAll("#print-root .overflow").length]; APP_TEST.done(); return r; })()`, [2, true, true, true, 0]);
      await t.expect("Vorderseite: nur die Anrufung statt ganzem Gebet, keine Unterschrift; Rückseite: Protokoll", `APP_TEST.print("devotion").then(() => { const [f, b] = document.querySelectorAll("#print-root > .page"); const r = [/Nethys/.test(f.querySelector(".dv-invoke").textContent), f.textContent.includes("Vorbereitung"), f.textContent.includes("Unterschrift"), [...b.querySelectorAll(".dv-log th")].map((x) => x.textContent).slice(0, 3)]; APP_TEST.done(); return r; })`, [true, false, false, ["Vorbereitet", "Gewirkt", "Auslastung"]]);
      await t.expect("Andachtsbuch: Titel und Doppelseite je Tag", `APP_TEST.print("devotionBook").then(() => { const r = [document.querySelectorAll("#print-root > .page.dv-morning").length, document.querySelectorAll("#print-root > .page.dv-evening").length, document.querySelectorAll("#print-root .dv-lines").length > 0]; APP_TEST.done(); return r; })`, [1, 1, true]);
    },
  },
  {
    name: "ui-andacht-rueckschau",
    book: "klein",
    deity: "nethys",
    run: async (t) => {
      const day = `PREP.api.dayList().find((d) => d.current)`;
      await t.eval(`PREP.api.record("cast", SPELLS.find((s) => s.name === "Fireball").id, 3)`);
      await t.expect("Bogen mit Protokoll und Antwortfeld", `(() => { const s = DEVOTION.reviewText(${day}); return [/Gewirkt: Fireball/.test(s), /<!-- devotion-review \{/.test(s)]; })()`, [true, true]);
      const answer = (di) => `DEVOTION.reviewText(${day}).replace(/"diary":""/, ${JSON.stringify(`"diary":"${di}"`)})`;
      await t.expect("Import ordnet dem Tag zu", `DEVOTION.importReview(${answer("TAGEBUCH-X")}, () => true)`, "ok");
      await t.expect("im Journal", `DEVOTION.journal.days[${day}.id].diary`, "TAGEBUCH-X");
      await t.expect("Überschreiben abgelehnt: unverändert", `DEVOTION.importReview(${answer("NEU")}, () => false) + "|" + DEVOTION.journal.days[${day}.id].diary`, "cancel|TAGEBUCH-X");
      await t.expect("unbekannter Tag", `DEVOTION.importReview(JSON.stringify({ day: "1999-01-01T00:00:00.000Z", diary: "x" }))`, "unknown");
      await t.expect("Rückseite zeigt den Eintrag", `APP_TEST.print("devotion").then(() => { const s = document.querySelector("#print-root .sheet-back").textContent; APP_TEST.done(); return s.includes("TAGEBUCH-X"); })`, true);
      await t.expect("im Charakter-Export", `JSON.stringify(DEVOTION.exportData()).includes("TAGEBUCH-X")`, true);
    },
  },
  {
    name: "ui-andacht-spielleiter",
    book: "klein",
    deity: "nethys",
    run: async (t) => {
      await t.eval(`Promise.all([DEVOTION.seal({ id: "7", title: "ERINNERUNG", text: "GEHEIMTEXT" }, "asker-molin-7"), DEVOTION.seal({ id: "8", title: "ANDERES", text: "x" }, "anderer-code")]).then((e) => DEVOTION.importGM({ entries: e }))`);
      await t.expect("versiegelt: nur Anzahl, kein Text im Speicher", `[DEVOTION.sealed().length, JSON.stringify(localStorage).includes("GEHEIMTEXT")]`, [2, false]);
      await t.expect("falscher Code ändert nichts", `DEVOTION.release("falsch").then((g) => [g, DEVOTION.sealed().length])`, [null, 2]);
      await t.expect("richtiger Code (Großschreibung, Leerzeichen egal)", `DEVOTION.release("  Asker Molin 7 ").then((g) => [g.id, g.released.title, DEVOTION.sealed().length])`, ["7", "ERINNERUNG", 1]);
      await t.expect("Freigabe protokolliert", `PREP.api.dayList().find((d) => d.current).events.some((x) => x.ev === "release" && x.id === "7")`, true);
      await t.eval(`document.querySelector("#dv-dialog")?.close()`);
      await t.expect("Statusliste ohne Code und Text", `(() => { const s = DEVOTION.statusText(); return [s.includes("freigegeben"), s.includes("versiegelt"), /asker|GEHEIMTEXT|ERINNERUNG/.test(s)]; })()`, [true, true, false]);
      await t.expect("im Andachtsbuch beim Tag", `APP_TEST.print("devotionBook").then(() => { const s = document.getElementById("print-root").textContent; APP_TEST.done(); return s.includes("GEHEIMTEXT"); })`, true);
      await t.eval(`DEVOTION.forgetDay(PREP.api.dayList().find((d) => d.current).id)`);
      await t.expect("Tag gelöscht: wieder versiegelt", `DEVOTION.sealed().length`, 2);
    },
  },
  {
    name: "ui-andacht-bedienung",
    book: "klein",
    deity: "nethys",
    run: async (t) => {
      await t.click(t.ui.tab("prepare"));
      await t.settled();
      await t.expect("Zeilen Morgenandacht und Abendgebet", `document.querySelectorAll("#prep .dv-today .dv-row").length`, 2);
      await t.click('#prep [data-dv="held"]');
      await t.expect("Morgenandacht protokolliert, nichts abgestrichen", `[PREP.api.dayList().find((d) => d.current).events.some((x) => x.ev === "devotion"), PREP.api.dayList().find((d) => d.current).events.some((x) => x.ev === "cast")]`, [true, false]);
      await t.click('#prep [data-sub="andacht"]');
      await t.settled();
      await t.until(`document.querySelectorAll("#devotion-pages > .page").length === 2`);
      await t.expect("Unterreiter Andacht zeigt das Blatt", `!document.getElementById("devotion-view").hidden`, true);
      await t.expect("Bedienung als Seitenleiste, Vorder- und Rückseite nebeneinander", `(() => { const s = document.getElementById("prep-side").getBoundingClientRect(), v = document.getElementById("devotion-view").getBoundingClientRect(); return [document.getElementById("view-prepare").classList.contains("dv-mode"), s.width < 400, v.left >= s.right - 1, document.querySelectorAll("#devotion-pages > .page:not(.offstage)").length]; })()`, [true, true, true, 2]);
      if (process.env.SHOT) await t.shot(process.env.SHOT);
      await t.click('#prep-side > .side-toggle');
      await t.expect("Seitenleiste eingeklappt", `[document.getElementById("prep-side").classList.contains("collapsed"), document.getElementById("prep").offsetWidth]`, [true, 0]);
      await t.click('#prep-side > .side-toggle');
      await t.click('#prep [data-dvp="view-book"]');
      await t.until(`document.querySelectorAll("#devotion-pages > .page.dv-morning").length === 1`);
      await t.click('#prep [data-sub="heute"]');
      await t.expect("andere Reiter blenden den Betrachter aus", `[document.getElementById("devotion-view").hidden, document.getElementById("view-prepare").classList.contains("dv-mode")]`, [true, false]);
    },
  },
  {
    name: "ui-andacht-ohne-gottheit",
    book: "klein",
    run: async (t) => {
      await t.click(t.ui.tab("prepare"));
      await t.settled();
      await t.expect("kein Unterreiter, keine Zeilen", `[!!document.querySelector('#prep [data-sub="andacht"]'), !!document.querySelector("#prep .dv-today"), DEVOTION.enabled()]`, [false, false, false]);
    },
  },
  {
    name: "ui-lehrheft-gebete-fuer-den-tag",
    book: "klein",
    deity: "nethys",
    run: async (t) => {
      await t.expect("Teil hinter dem Anhang, vor den Alltagszaubern", `APP_TEST.print("primer").then(() => { const r = document.getElementById("print-root"); const parts = [...new Set([...r.querySelectorAll(":scope > .page")].map((p) => [...p.classList].find((c) => c.startsWith("part-"))).filter(Boolean))]; const s = r.textContent; APP_TEST.done(); return [parts.slice(parts.indexOf("part-A"), parts.indexOf("part-A") + 2), parts.filter((p) => p !== "part-W").pop(), s.includes("Morgengebet"), s.includes("Vor dem Entziffern")]; })`, [["part-A", "part-G"], "part-G", true, true]);
    },
  },
  {
    name: "ui-charakter-duplizieren-ohne-tagebuch",
    book: "klein",
    deity: "nethys",
    run: async (t) => {
      await t.eval(`DEVOTION.setText(PREP.api.dayList()[0].id, "diary", "TAGEBUCH-ORIGINAL")`);
      await t.expect("Kopie ohne Andachtsbuch", `(() => { const c = CHARS.create("Kopie", null, CHARS.active()); const r = localStorage.getItem("spellbook.c." + c.id + ".journal"); CHARS.remove(c.id); return r; })()`, null);
    },
  },

  // Werkzeug des Spielleiters und App verschlüsseln gleich: tools/seal-entries.html versiegelt, devotion.js öffnet
  {
    name: "node-andacht-versiegeln",
    node: async ({ root }) => {
      const { readFileSync } = await import("node:fs");
      const html = readFileSync(`${root}/tools/seal-entries.html`, "utf8");
      const tool = html.slice(html.indexOf("<script>") + 8, html.indexOf("const $ = "));
      const store = {};
      const g = {
        crypto: globalThis.crypto, TextEncoder, TextDecoder, btoa, atob, Uint8Array, Uint32Array, JSON, String,
        U: { esc: (x) => String(x) }, I18N: { t: (k) => k, lang: { book: "de" } },
        CHARS: { key: (k) => "spellbook.c.t." + k, current: () => ({ name: "Test" }) },
        localStorage: { getItem: (k) => store[k] ?? null, setItem: (k, v) => (store[k] = String(v)) },
        document: { getElementById: () => null },
      };
      g.window = g;
      const run = (src) => new Function(...Object.keys(g), src + "\nreturn { seal, makeCode, normCode };")(...Object.values(g));
      const T = run(tool);
      new Function(...Object.keys(g), readFileSync(`${root}/app/js/devotion.js`, "utf8"))(...Object.values(g));
      const D = g.DEVOTION;
      const code = T.makeCode();
      const errs = [];
      if (!/^[a-z]+-[a-z]+-\d+$/.test(code)) errs.push({ rule: "code", detail: "nicht sprechbar: " + code });
      const sealed = await T.seal({ id: "9", title: "TITEL", text: "TEXT" }, code);
      D.importGM({ kind: "gm-entries", entries: [sealed] });
      if (await D.release("falsch")) errs.push({ rule: "falscher-code", detail: "entsiegelt" });
      const r = await D.release(" " + code.toUpperCase().replace(/-/g, " ") + " ");
      if (!r || r.released.title !== "TITEL" || r.released.text !== "TEXT") errs.push({ rule: "freigabe", detail: JSON.stringify(r) });
      return errs;
    },
  },

  // Formelsprachen: Latein unverändert gegenüber dem Snapshot (tools/formula-snapshot.mjs --save nach gewollten Änderungen)
  {
    name: "node-formel-latein",
    node: async ({ withProfile, root }) => tool(root, "snapshot", ["tools/formula-snapshot.mjs", "--check", ...(withProfile ? ["--with-profile"] : [])]),
  },
  {
    name: "node-formel-herkunft",
    node: async ({ root }) => tool(root, "herkunft", ["tools/formula-origins-test.mjs"]),
  },
  {
    name: "node-formel-lexika",
    node: async ({ withProfile, root }) => tool(root, "lexika", ["tools/formula-lang-check.mjs", ...(withProfile ? ["--with-profile"] : [])]),
  },
  // Schnellglyphen: je Klassenliste eindeutig, Anfangsbuchstaben der lateinischen Wortlisten verschieden
  {
    name: "node-schnellglyphen-eindeutig",
    node: async ({ withProfile, root }) => tool(root, "schnellglyphen", ["tools/quick-glyph-check.mjs", ...(withProfile ? ["--with-profile"] : [])]),
  },
  // Originalschriften: alle Lexikonwörter übertragbar, jedes benutzte Zeichen in der gekürzten Schrift
  {
    name: "node-originalschriften",
    node: async ({ withProfile, root }) => tool(root, "originalschriften", ["tools/script-check.mjs", ...(withProfile ? ["--with-profile"] : [])]),
  },
  // Formelsprachen im Buch: fremde Formeln, Brückennotizen ohne Doppelungen, höchstens eine Notiz je Seite bzw. Hälfte
  {
    name: "ui-formelsprache-buch",
    book: "klein",
    run: async (t) => {
      await t.eval(`PROFILE.formulaOrigins = [{ id: "a", lang: "pie", share: 50 }, { id: "b", lang: "latin", share: 50 }]; PROFILE.formulaLangNames = {}; PROFILE.bridgeNotes = {}; APP_TEST.load({ book: ${JSON.stringify(BOOKS.klein)} }); 1`);
      await t.eval(`APP_TEST.print("book")`);
      await t.eval(`window.__fl = (() => {
        const pages = [...document.querySelectorAll("#print-root .page")];
        const vis = (n) => n.offsetParent !== null && n.textContent.trim();
        const texts = pages.flatMap((p) => [...p.querySelectorAll(".note")].filter(vis).map((n) => n.textContent.trim()));
        return {
          // eine Notiz je Satzbereich: ganze Seite oder je halber Zauber
          maxPerPage: Math.max(0, ...pages.flatMap((p) => (p.querySelector(".half") ? [...p.querySelectorAll(".half")] : [p]).map((u) => [...u.querySelectorAll(".note")].filter(vis).length))),
          dup: texts.length - new Set(texts).size,
          bridges: texts.filter((x) => /Stamm|Wurzel|hört .* noch darin|Lehrbuch .* schreibt|Gedanke|Fachformel/.test(x)).length,
          pie: [...document.querySelectorAll("#print-root .formula .fl")].some((x) => /estu|bhutu|kwekwlos/i.test(x.textContent)),
        };
      })()`);
      await t.eval(`APP_TEST.done()`);
      await t.expect("höchstens eine Notiz je Seite", `__fl.maxPerPage <= 1`, true);
      await t.expect("keine doppelte Notiz", `__fl.dup`, 0);
      await t.expect("Brückennotiz im Buch", `__fl.bridges > 0`, true);
      await t.expect("urindogermanische Formeln im Buch", `__fl.pie`, true);
    },
  },
  // Hausregel Entziffern: beherrschte Sprachen in den Einstellungen, SG in Detailansicht und „Heute vorbereitet“
  {
    name: "ui-formelsprache-entziffern",
    book: "klein",
    run: async (t) => {
      const u = t.ui;
      await t.eval(`PROFILE.formulaOrigins = [{ id: "a", label: "Station A", lang: "akkadian", share: 100 }]; PROFILE.formulaLangNames = {}; PROFILE.bridgeNotes = {}; PROFILE.decipher = { enabled: true, known: ["latin"] }; APP_TEST.load({ book: ${JSON.stringify(BOOKS.klein)} }); 1`);
      await t.click(u.settingsBtn);
      await t.expect("Sprachenliste sichtbar", `!document.querySelector("#set-known-langs").hidden`, true);
      await t.expect("Latein vorgewählt", `document.querySelector('#set-known-langs input[value="latin"]').checked`, true);
      await t.eval(`(() => { const el = document.querySelector('#set-known-langs input[value="akkadian"]'); el.checked = true; })()`);
      await t.eval(`document.querySelector("${u.settings}").close()`);
      await t.until(`!document.querySelector("${u.settings}").open`);
      // Detailansicht: Feuerball (Grad 3) in beherrschter Sprache → 10 + 3
      await t.eval(`(() => { const q = document.querySelector("#q"); q.value = "fireball"; q.dispatchEvent(new Event("input", { bubbles: true })); })()`);
      await t.click('#list [data-id="fireball"] .nm');
      await t.expect("SG in der Detailansicht", `document.querySelector("#detail .formula-fact").textContent`, /Akkadisch.*Station A.*SG 13/);
      // Heute vorbereitet: Zauber eintragen, SG steht in der Zeile
      await t.click(u.tab("prepare"));
      await t.eval(`(() => { const el = document.querySelector('#prep tr[data-g="3"] input[data-f="n"]'); el.value = "1"; el.dispatchEvent(new Event("input", { bubbles: true })); })()`);
      await t.click('#prep .p-fill[data-g="3"]');
      await t.click('#prep-pick li[data-id="fireball"]');
      await t.expect("SG in Heute vorbereitet", `document.querySelector("#prep .decipher")?.textContent`, /SG 13 \(Akkadisch\)/);
    },
  },

  // --- Adresse: Lesezeichen und Zurück/Vor (add-bookmarkable-urls) -------------------------------
  {
    name: "node-adresse",
    node: async ({ root }) => {
      const { readFileSync } = await import("node:fs");
      const calls = [];
      const location = { hash: "", pathname: "/index.html", search: "" };
      const setUrl = (u) => (location.hash = u.startsWith("#") ? u : "");
      const history = {
        state: null,
        pushState: (st, _, u) => (calls.push("push " + u), (history.state = st), setUrl(u)),
        replaceState: (st, _, u) => (calls.push("replace " + u), (history.state = st), setUrl(u)),
      };
      const win = {};
      new Function("window", "location", "history", readFileSync(`${root}/app/js/route.js`, "utf8"))(win, location, history);
      const R = win.ROUTE, errs = [];
      const eq = (rule, got, want) => JSON.stringify(got) !== JSON.stringify(want) && errs.push({ rule, detail: `Soll ${JSON.stringify(want)}, Ist ${JSON.stringify(got)}` });
      eq("leer", R.parse(""), { view: "browse", parts: [], full: false });
      eq("unbekannte Ansicht", R.parse("#xyz/fireball"), { view: "browse", parts: [], full: false });
      eq("Bindestrich-ID mit full", R.parse("#book/abadar-s-truthtelling/full"), { view: "book", parts: ["abadar-s-truthtelling"], full: true });
      eq("full allein ist kein Fenster", R.parse("#book/full"), { view: "book", parts: ["full"], full: false });
      eq("führender Schrägstrich", R.parse("#/theory/primer/II/l10"), { view: "theory", parts: ["primer", "II", "l10"], full: false });
      eq("Verzeichnis ohne Ziel", R.format({ view: "browse", parts: [null] }), "");
      eq("full ohne Ziel entfällt", R.format({ view: "book", parts: [], full: true }), "#book");
      eq("Sonderzeichen", R.format({ view: "theory", parts: ["primer", "a b/c"] }), "#theory/primer/a%20b%2Fc");
      for (const h of ["#browse/fireball", "#book/fireball/full", "#prepare", "#theory/vademecum/a/middle", "#theory/primer/a%20b%2Fc"]) eq("Rundlauf " + h, R.format(R.parse(h)), h);
      // Verlauf: ersetzen, nach mark() neuer Eintrag, gleiche Adresse nichts, beim Herstellen nie neu
      R.write({ view: "book", parts: ["fireball"] });
      R.push({ view: "browse", parts: ["light"] }, { full: true });
      R.write({ view: "browse", parts: ["light"] });
      R.applying = true;
      R.push({ view: "prepare", parts: [] });
      R.applying = false;
      R.mark();
      R.write({ view: "prepare", parts: [] }); // unverändert: kein Eintrag, Marke verbraucht
      R.write({ view: "book", parts: [] });
      eq("Verlauf", calls, ["replace #book/fireball", "push #browse/light", "replace #prepare", "replace #book"]);
      return errs;
    },
  },
  {
    name: "ui-adresse-lesezeichen",
    book: "klein",
    settings: { maxPages: 50 },
    run: async (t) => {
      const here = (k) => `APP_TEST.here().${k}`;
      const shows = (id) => `!!document.querySelector('#book-pages .page:not(.offstage)[data-spell="${id}"]')`;
      const spread = `[...document.querySelectorAll("#book-pages > .page:not(.offstage)")].map((p) => p.dataset.idx).join("|")`;
      await t.eval(`APP_TEST.save()`);
      // Verzeichnis
      await t.reload("");
      await t.expect("Start ohne Ziel: Standardzauber in der Adresse", `location.hash`, "#browse/fireball");
      await t.click('#list li[data-id="light"] .nm');
      await t.expect("Klick schreibt die Adresse", `location.hash`, "#browse/light");
      await t.click('#list li[data-id="detect-magic"] .nm');
      await t.back();
      await t.expect("Zurück: voriger Zauber", here("selected"), "light");
      await t.reload();
      await t.expect("Neuladen behält den Zauber", here("selected"), "light");
      await t.reload("#browse/gibt-es-nicht");
      await t.expect("unbekannte ID: Standardzauber, Adresse berichtigt", `location.hash`, "#browse/fireball");
      await t.eval(`location.hash = "#browse/light"`);
      await t.sleep(200);
      await t.expect("von Hand geänderte Adresse", here("selected"), "light");
      // Buch: Lesezeichen auf einen Zauber (zwei Bände)
      await t.reload("#book/fireball");
      await t.settled();
      await t.expect("Lesezeichen: Buch", here("view"), "book");
      await t.expect("Lesezeichen: Fireball aufgeschlagen", shows("fireball"), true);
      await t.expect("Adresse nennt einen sichtbaren Zauber", `(() => { const id = location.hash.split("/")[1]; return !!id && ${shows("' + id + '")}; })()`, true);
      await t.reload("#book/wish");
      await t.expect("nicht im Buch: Verzeichnis", `APP_TEST.here()`, (h) => h.view === "browse" && h.selected === "wish" && h.hash === "#browse/wish");
      // Blättern: neuer Eintrag je Zauber, innerhalb eines Zaubers nur ersetzen
      await t.click(t.ui.tab("prepare"));
      await t.expect("Reiter in der Adresse", `location.hash`, "#prepare");
      await t.click(t.ui.tab("book"));
      await t.settled();
      const hs = [await t.eval(`location.hash`)];
      for (let i = 0; i < 2; i++) {
        await t.click(t.ui.bookGo("nextSpell"));
        await t.settled();
        hs.push(await t.eval(`location.hash`));
      }
      await t.expect("Blättern: Adresse folgt dem Zauber", `${JSON.stringify(hs)}`, (l) => l.every((h) => /^#book\/[a-z-]+$/.test(h)) && new Set(l).size === 3);
      for (let i = 1; i >= 0; i--) {
        await t.back();
        await t.settled();
        await t.expect(`Zurück: voriger Zauber (${i})`, `location.hash`, hs[i]);
      }
      await t.back();
      await t.expect("Zurück vor dem ersten Zauber: voriger Reiter", here("view"), "prepare");
      await t.forward();
      await t.settled();
      await t.expect("Vor: wieder im Buch beim selben Zauber", `APP_TEST.here()`, (h) => h.view === "book" && h.hash === hs[0]);
      await t.forward();
      await t.settled();
      await t.expect("Vor: nächster Zauber", `location.hash`, hs[1]);
      // Seite für Seite innerhalb von Fireball (eine Seite breit): kein neuer Eintrag
      await t.resize(900);
      await t.reload("#book/fireball");
      await t.settled();
      const len = await t.eval(`history.length`);
      await t.click(t.ui.bookGo("next"));
      await t.settled();
      await t.expect("innerhalb des Zaubers: Adresse bleibt, kein Eintrag", `location.hash + "|" + history.length`, `#book/fireball|${len}`);
      await t.resize(1600);
      await t.settled();
      // ausführliche Fassung
      const before = await t.eval(spread);
      await t.click("#book-pages .page:not(.offstage) .full-i");
      await t.until(`document.getElementById("full-modal").open`);
      await t.expect("Fenster: /full", `location.hash`, /^#book\/[a-z-]+\/full$/);
      await t.back();
      await t.expect("Zurück schließt das Fenster", `document.getElementById("full-modal").open`, false);
      await t.expect("… ohne /full", `location.hash`, /^#book\/[a-z-]+$/);
      await t.expect("… Buch an derselben Stelle", spread, before);
      await t.click("#book-pages .page:not(.offstage) .full-i");
      await t.until(`document.getElementById("full-modal").open`);
      await t.eval(`document.getElementById("full-modal").close()`);
      await t.sleep(250);
      await t.expect("Schließen per Knopf: ohne /full, Buch bleibt", `APP_TEST.here()`, (h) => h.view === "book" && /^#book\/[a-z-]+$/.test(h.hash));
      await t.reload("#book/fireball/full");
      await t.until(`document.getElementById("full-modal").open`);
      await t.expect("Lesezeichen mit Fenster", here("full"), "fireball");
      await t.eval(`document.getElementById("full-modal").close()`);
      await t.sleep(250);
      await t.expect("Schließen nach Laden: /full gestrichen, App bleibt", `APP_TEST.here()`, (h) => h.view === "book" && h.hash === "#book/fireball");
      // Lehrheft-Anker
      await t.reload("#theory/primer/II/l11");
      await t.settled();
      await t.until(`!!document.querySelector('#primer-pages .page:not(.offstage) [data-lesson="l11"]')`);
      await t.expect("Lehrheft: Adresse mit Lektion", `location.hash`, /^#theory\/primer\/II\/l1\d$/);
      const l0 = await t.eval(`location.hash`);
      await t.click(t.ui.primerGo("nextUnit"));
      await t.settled();
      await t.expect("Lehrheft: Blättern führt den Anker nach", `location.hash`, (h) => /^#theory\/primer\/[^/]+\/[^/]+$/.test(h) && h !== l0);
      const l1 = await t.eval(`location.hash`);
      await t.back();
      await t.settled();
      await t.expect("Lehrheft: Zurück zur vorigen Lektion", `location.hash`, l0);
      await t.forward();
      await t.settled();
      await t.expect("Lehrheft: Vor zur nächsten Lektion", `location.hash`, l1);
      await t.click(t.ui.primerTocPart("III"));
      await t.settled();
      await t.expect("Lehrheft: Teil aus dem Verzeichnis", `location.hash`, /^#theory\/primer\/III(\/|$)/);
      await t.back();
      await t.settled();
      await t.expect("Zurück: vorige Lektion", `location.hash`, (h) => h !== "" && !/\/III(\/|$)/.test(h));
    },
  },

  {
    name: "ui-adresse-lehre-rueckfall",
    book: "paladin",
    cls: "paladin",
    run: async (t) => {
      await t.eval(`APP_TEST.save()`);
      await t.reload("#theory/primer/II/l11");
      await t.settled();
      await t.until(`location.hash === "#theory/prayer"`);
      await t.expect("göttliche Klasse: primer → Vom Gebet", `location.hash`, "#theory/prayer");
      await t.reload("#theory/vademecum");
      await t.settled();
      await t.until(`/^#theory\\/vademecum\\/[^/]+\\/[^/]+/.test(location.hash)`, 30000);
      const h = await t.eval(`location.hash`);
      await t.expect("Vademecum: Hälfte und Teil in der Adresse", `location.hash`, /^#theory\/vademecum\/[^/]+\/[^/]+/);
      // zu einer Lektion weiter hinten und zurück per Lesezeichen
      await t.click(`#vm-pager-0 [data-go="last"]`);
      await t.settled();
      const end = await t.eval(`location.hash`);
      await t.expect("Vademecum: Blättern ändert den Anker", `location.hash`, (x) => x !== h);
      await t.reload(h);
      await t.settled();
      await t.until(`location.hash === ${JSON.stringify(h)}`, 30000);
      await t.expect("Vademecum: Lesezeichen kehrt zurück", `location.hash`, h);
      await t.reload(end);
      await t.settled();
      await t.until(`location.hash === ${JSON.stringify(end)}`, 30000);
      await t.expect("Vademecum: Lesezeichen am Ende", `location.hash`, end);
    },
  },
  {
    name: "ui-adresse-vademecum-ohne-gottheit",
    book: "klein",
    run: async (t) => {
      await t.eval(`APP_TEST.save()`);
      await t.reload("#theory/vademecum/a/front");
      await t.settled();
      await t.until(`/^#theory\\/primer/.test(location.hash)`);
      await t.expect("ohne Gottheit: Lehrheft", `location.hash`, /^#theory\/primer/);
    },
  },

  {
    name: "ui-adresse-vademecum-wendebuch",
    book: "klein",
    deity: "nethys",
    run: async (t) => {
      await t.eval(`APP_TEST.save()`);
      await t.reload("#theory/vademecum");
      await t.settled();
      await t.until(`/^#theory\\/vademecum\\/[^/]+\\/[^/]+/.test(location.hash)`, 30000);
      const a = (await t.eval(`location.hash`)).split("/")[2];
      await t.click("#btn-vm-turn");
      await t.settled();
      await t.until(`location.hash.split("/")[2] !== ${JSON.stringify(a)}`, 30000);
      const h = await t.eval(`location.hash`);
      await t.back();
      await t.settled();
      await t.expect("Zurück: erste Hälfte", `location.hash.split("/")[2]`, a);
      await t.reload(h);
      await t.settled();
      await t.until(`location.hash === ${JSON.stringify(h)}`, 30000);
      await t.expect("Lesezeichen: zweite Hälfte gewendet", `!document.querySelector('#vademecum-view .vm-half[data-half="1"]').hidden`, true);
    },
  },
];
