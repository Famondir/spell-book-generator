// Testfälle für tools/test-browser.mjs
// Satz-Fall:  { name, book, settings, cls, job, opts, limit }   job: book | rules | scrolls | primer | checks
// Bedienung:  { name, book, settings, cls, width, run: async (t) => … }   Helfer siehe test-browser.mjs
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
      for (let i = 0; i < 12; i++) {
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
];
