#!/usr/bin/env node
// Tests für das Vademecum ohne Browser: Gerüst, Mustervorlage, Zwiespalt-Paar, Aufbau des Bandes, Choräle.
// Aufruf: node tools/vademecum-test.mjs   (Rückgabecode 1 bei Fehlern)
import { readFileSync } from "node:fs";
import vm from "node:vm";
import { loadApp } from "./lib/load-app.mjs";

const EXTRA = ["app/js/glyphs.js", "app/js/circle.js", "app/js/vitrail.js", "app/js/prayer.js", "data/time.js", "data/vademecum.js", "app/js/vademecum.js"];
const fails = [];
const expect = (what, got, want) => {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  console.log(`${ok ? "ok" : "✗ "}  ${what}${ok ? "" : `: erhalten ${JSON.stringify(got)}, erwartet ${JSON.stringify(want)}`}`);
  if (!ok) fails.push(what);
};

const ctx = loadApp({ extra: EXTRA });
const { VADEMECUM: V, PRAYER: P, DEITIES: D } = ctx;
const deity = (id) => D.find((d) => d.id === id);

// Gerüst
expect("Gerüst: zehn Kapitel in fester Folge", V.chapters.map((c) => c.id),
  ["preface", "essence", "prayers", "hymns", "rites", "retinue", "works", "history", "rank", "hooks"]);
expect("Gerüst: lokale Einträge leer", Object.keys(V.local), []);
expect("Gerüst: Zahl der Choräle begrenzt", V.hymns > 0 && V.hymns <= 12, true);
expect("Gerüst: jede Gesinnung hat einen Satzteil", [...new Set(D.map((d) => d.align).filter(Boolean))].every((a) => V.align[a]), true);

// Zwiespalt-Paar
expect("Nethys: Zerstörung und Schutz", P.dualPair(deity("nethys"), ""), ["Destruction", "Protection"]);
expect("Iomedae: kein Zwiespalt", P.dualPair(deity("iomedae"), ""), null);
expect("Profilton plain schaltet ab", P.dualPair(deity("nethys"), "plain"), null);
expect("Profilton dual erzwingt Geben und Nehmen", P.dualPair(deity("iomedae"), "dual"), ["Give", "Take"]);
expect("jedes Paar hat Standardnamen", ["nethys", "iomedae", ...D.map((d) => d.id)].map((id) => P.dualPair(deity(id), "dual")).flat().every((k) => V.pairNames[k]), true);
expect("dualPair passt zu dual", D.every((d) => !!P.dualPair(d, "") === !!P.dual(d, "")), true);

// --- Aufbau des Bandes ---------------------------------------------------------
const B = ctx.VADEMECUM_BOOK;
const entry = (n) => { const sp = ctx.SPELLS.find((x) => x.name === n); const m = ctx.analyze(sp); return { m, t: ctx.generateTexts(m, {}) }; };
const BOOK = ["Speak with Dead", "False Life", "Shield", "Magic Missile", "Detect Magic", "Command Undead", "Comprehend Languages", "Fireball", "Ray of Enfeeblement", "Protection from Evil", "Dispel Magic", "Mage Armor"].map(entry);
const html = (v, hi = 0) => v.halves[hi].parts.flatMap((p) => p.pages.map((pg) => pg.html)).join("");
const chapterIds = (v, hi = 0) => v.halves[hi].parts.map((p) => p.id).filter((id) => id !== "front");

expect("ohne Gottheit kein Vademecum", B.build({ deity: null, entries: BOOK }) && ctx.DEITY ? "?" : B.build({ deity: null, entries: BOOK }), null);

const io = B.build({ deity: deity("iomedae"), entries: BOOK, settings: {} });
expect("Iomedae: einfaches Buch", [io.dual, io.halves.length, io.middle], [false, 1, null]);
expect("Iomedae dünn: Wesen und Choräle, leere Kapitel entfallen", chapterIds(io), ["essence", "hymns"]);
expect("Iomedae dünn: römische Zählung lückenlos", io.halves[0].parts.slice(1).map((p) => p.title.split(" · ")[0]), ["I", "II"]);
expect("Iomedae dünn: Wesen aus Gottheitsdaten", /Iomedae.*verehrt als Macht über/.test(html(io)) && /Gaben aus den Bereichen/.test(html(io)), true);
expect("Iomedae dünn: Titelblatt und Verzeichnis", io.halves[0].parts[0].pages.map((p) => p.running), ["", "Verzeichnis"]);
expect("Iomedae dünn: Verzeichnis verweist auf Kapitel", (html(io).match(/data-ref="a\/ch-[a-z]+"/g) || []).length, 2);
expect("Farben: Iomedae rot, Weiß nicht als Zierfarbe", [io.style["--vm-primary"], io.style["--vm-accent"]], (() => { const red = ctx.DEITIES.find((d) => d.id === "iomedae").colors.find((c) => c.name === "red").hex; return [red, red]; })());
expect("leeres Buch: Choräle entfallen", chapterIds(B.build({ deity: deity("iomedae"), entries: [] })), ["essence"]);

const ne = B.build({ deity: deity("nethys"), entries: BOOK, settings: {} });
expect("Nethys: Wendebuch mit Mitte", [ne.dual, ne.halves.map((h) => h.name), !!ne.middle], [true, ["Die Zerstörung", "Der Schutz"], true]);
expect("Nethys: gleiche Kapitel in beiden Hälften", chapterIds(ne, 0), chapterIds(ne, 1));
expect("Nethys: Verzeichnis je Hälfte mit Mitte", [0, 1].map((i) => html(ne, i).includes(`data-ref="${ne.halves[i].key}/middle"`)), [true, true]);
expect("Nethys: Hälften eigene Choräle", ne.halves[0].hymns.some((h) => ne.halves[1].hymns.some((k) => k.spell === h.spell)), false);
expect("Nethys: Choräle höchstens hymns je Hälfte", ne.halves.every((h) => h.hymns.length <= V.hymns && h.hymns.length > 0), true);

// --- Choräle ----------------------------------------------------------------
const all = ne.halves.flatMap((h) => h.hymns);
expect("Choräle: jede Zeile mit Lücke", all.every((h) => h.plain.every((l) => l.includes("–"))), true);
expect("Choräle: Kopfzeile Schule · Grad ohne Zaubernamen", all.every((h) => /^[A-ZÄÖÜa-zäöü]+ · ([IVX]+|0)$/.test(h.head)), true);
const swd = all.find((h) => h.spell === BOOK[0].m.id) || B.build({ deity: deity("nethys"), entries: [BOOK[0]] }).halves.flatMap((h) => h.hymns)[0];
expect("Speak with Dead: Kopfzeile Nekromantie · III", swd.head, "Nekromantie · III");
expect("Choräle: kein Zaubername im Choral", all.every((h) => ![h.title, h.head, h.use, ...h.plain].join(" ").toLowerCase().includes(ctx.SPELLS.find((s) => s.id === h.spell).name.toLowerCase())), true);
const ne2 = B.build({ deity: deity("nethys"), entries: BOOK, settings: {} });
expect("Choräle deterministisch", JSON.stringify(ne2.halves.map((h) => h.hymns)), JSON.stringify(ne.halves.map((h) => h.hymns)));
expect("Silben: In-hu-ma", B.syllables("Inhuma"), ["In", "hu", "ma"]);
expect("Silben: Over-lo-dek", B.syllables("Overlodek"), ["O", "ver", "lo", "dek"]);
expect("Silben: Des-cher bleibt sch", B.syllables("Descher"), ["De", "scher"]);
expect("Vers: erste Silbe bleibt", BOOK.every((x) => x.t.formula.lines.every((l, k) => !B.lineText(B.hymnLine(l, "t|" + k)).startsWith("–"))), true);
expect("Vers: einsilbig nur halb gestrichen", B.lineText(B.hymnLine("Fiat!", "x")), "Fi–!");
expect("Vers: Satzzeichen bleiben", B.lineText(B.hymnLine("Clausum est!", "x")).endsWith("!"), true);

// Mustervorlage lädt ohne Fehler und hat das beschriebene Format
vm.runInContext(readFileSync(new URL("../data/vademecum.local.example.js", import.meta.url), "utf8"), ctx);
const ex = V.local.example;
expect("Vorlage: zwei Hälften mit Zeichen", ex.halves.map((h) => h.mark), ["☉", "☾"]);
const ids = new Set(V.chapters.map((c) => c.id));
expect("Vorlage: nur bekannte Kapitel", ex.halves.every((h) => Object.keys(h.chapters).every((k) => ids.has(k))), true);
expect("Vorlage: Verweis zielt auf vorhandenen Abschnitt", (() => {
  const refs = JSON.stringify(ex).match(/\{\{ref:([^}]+)\}\}/g).map((r) => r.slice(6, -2).split("/"));
  return refs.every(([k, id]) => Object.values(ex.halves.find((h) => h.key === k).chapters).some((c) => c.sections.some((s) => s.id === id)));
})(), true);

// Lokale Datei: Eintrag unter der Id einer Gottheit mit Zwiespalt (Vorlage unter „nethys“ eingehängt)
V.local.nethys = ex;
const lx = B.build({ deity: deity("nethys"), entries: BOOK, settings: { charLevel: 5 } });
expect("lokal: Namen und Zeichen der Hälften", lx.halves.map((h) => [h.key, h.name, h.mark]), [["maß", "Das Maß", "☉"], ["last", "Die Last", "☾"]]);
expect("lokal: Tempelfarben", lx.style["--vm-primary"], "#2f4a6b");
expect("lokal: Titel aus der Datei", lx.title, "Vademecum der Waage");
expect("lokal: Vorrede ungezählt, Verweis als Platzhalter", [lx.halves[1].parts[1].title, html(lx, 1).includes('class="vref" data-ref="maß/vorrede"')], ["Vorrede", true]);
expect("lokal: Gebet mit Gebrauchshinweis und Versen", /vm-use">Beim ersten Licht.*vm-line">Was ich trage/.test(html(lx, 0)), true);
expect("lokal: Feste nach Hälfte gefiltert", [B.feastsOf(ex, "maß").length, B.feastsOf(ex, "last").length], [2, 1]);
expect("Festdatum mit Monatsnamen des Profils", B.feastDate({ d: 8, m: 10 }), "8. " + ctx.PROFILE.calendar.months[10]);
const months = ctx.PROFILE.calendar.months;
ctx.PROFILE.calendar.months = [];
expect("Festdatum neutral ohne Monatsnamen", B.feastDate({ d: 8, m: 10 }), "8. Tag des 11. Monats");
ctx.PROFILE.calendar.months = months;
expect("lokal: Mitte aus der Datei", lx.middle.title, "Die Mitte");
// Randnotizen der Profilstimmen: Mindeststufe, eigene Hand und Tinte, Verweis auf die andere Hälfte
ctx.PROFILE.vademecum = { voices: { k: { label: "K.", hand: "even", ink: "#123456" } }, notes: {
  "maß/vorrede": [{ voice: "k", text: "Vgl. {{ref:last/vorrede}}" }, { voice: "k", text: "Erst ab Stufe 7", level: 7 }],
} };
const nx = (lvl) => html(B.build({ deity: deity("nethys"), entries: [], settings: { charLevel: lvl } }), 0);
expect("Notiz: Hand, Tinte und Verweis", /class="mnote hand-even" style="color:#123456">Vgl\. <span class="vref" data-ref="last\/vorrede">/.test(nx(6)), true);
expect("Notiz: Stufe zu niedrig", [nx(6).includes("Erst ab Stufe 7"), nx(7).includes("Erst ab Stufe 7")], [false, true]);
delete ctx.PROFILE.vademecum;
// Feste aus lokaler Datei und Profil, nach Datum, doppelte einmal
const pf = ctx.PROFILE.devotion;
ctx.PROFILE.devotion = { ...(pf || {}), feasts: [{ d: 3, m: 0, name: "Profilfest" }, { d: 1, m: 0, name: "Tag des Eichens" }] };
expect("Feste: Profil und lokal gemischt, nach Datum", B.feastsOf(ex, "last").map((f) => f.name), ["Tag des Eichens", "Profilfest"]);
ctx.PROFILE.devotion = pf;

ex.dual = false;
expect("lokal: dual false schaltet Wendebuch ab", B.build({ deity: deity("nethys"), entries: BOOK }).halves.length, 1);
delete ex.dual;

// --- Format der lokalen Datei: Rahmen, Mitte je Hälfte, Notizen, Feste ohne Tag, Anker, Auszeichnung ----------
V.local.nethys = {
  halves: [
    { key: "w", name: "Weiß", mark: "○", chapters: {
      essence: { title: "Vom Wesen des Herrn", sections: [{ id: "intro", text: ["Er **sieht** *dich*.", "{{anchor:grab}}Und wenn du stirbst.", { list: ["eins", "zwei"] }, { table: [["A", "B"], ["1", "2"]] }] }] },
      hymns: { sections: [{ id: "vor", text: ["Davor."] }, { id: "slot-0", kind: "slot", frames: [0, 1] }, { id: "nach", title: "Danach", text: ["Danach."] }], frames: [
        { title: "Choral vom Lesen", school: "Divination", level: 0, use: "Zur Aufnahme.", response: "Was geschrieben steht.", lines: ["De — hedsch"] },
        { title: "Choral ohne Zauber", school: "Illusion", level: 9, head: "Illusion · IX", use: "Nie.", lines: ["Ta — ta", "", "Ri — ra"] },
      ] },
    } },
    { key: "s", name: "Schwarz", mark: "●", chapters: { essence: { sections: [{ id: "intro", text: ["Vgl. S. {{page:w/grab}} und {{ref:w/intro}}."] }] } } },
  ],
  middle: { title: "Was er sagte", halves: [{ lines: ["Ich sah alles.", "Ich bin zerbrochen."] }, { lines: ["Ich bin zerbrochen.", "Ich sah alles."] }] },
  feasts: [{ m: 11, when: "erste mondlose Nacht", name: "Nacht der Offenen Augen" }, { d: 28, m: 10, name: "Transmutatum" }],
  notes: {
    "w/intro": [{ voice: "kirran", text: "Notiz K", level: 1 }, { voice: "fremd", text: "Fremde Stimme" }],
    "w/middle": [{ voice: "kirran", desc: "unterstreicht „alles“", text: "Gelesen." }],
  },
};
ctx.PROFILE.vademecum = { voices: { kirran: { label: "K.", hand: "even", ink: "#111111" } } };
const fx = B.build({ deity: deity("nethys"), entries: BOOK, settings: { charLevel: 3 } });
const fh = (i) => html(fx, i);
expect("Format: Kapiteltitel aus der Datei", fx.halves[0].parts.find((p) => p.id === "essence").title, "I · Vom Wesen des Herrn");
expect("Format: fett und kursiv", fh(0).includes("Er <b>sieht</b> <i>dich</i>."), true);
expect("Format: Anker im Absatz", fh(0).includes('<span class="vm-anchor" data-anchor="w/grab"></span>Und wenn'), true);
expect("Format: Liste und Tabelle", [fh(0).includes('<ul class="vm-list"><li>eins</li>'), fh(0).includes('<table class="vm-table"><tr><th>A</th>')], [true, true]);
expect("Format: Seitenverweis ohne Zeichen", fh(1).includes('data-ref="w/grab" data-plain'), true);
expect("Notizen der Datei: nur bekannte Stimmen", [fh(0).includes("Notiz K"), fh(0).includes("Fremde Stimme")], [true, false]);
const fhy = fx.halves[0].parts.find((p) => p.id === "hymns");
const hy0 = fhy.pages[0].html;
expect("Rahmen: Titel, Anlass und Antwort am erzeugten Choral", /Choral vom Lesen.*Erkenntnis · 0.*Zur Aufnahme\..*vm-gap.*vm-response"><b>Gemeinde:<\/b> Was geschrieben steht\./.test(hy0), true);
expect("Rahmen ohne Zauber: ausgeschriebene Verse mit Strophe", /Choral ohne Zauber.*Illusion · IX.*Ta — ta.*vm-stanza.*Ri — ra/.test(hy0), true);
expect("Rahmen: erzeugte Choräle ohne Rahmen folgen", fhy.lessons.length > 2, true);
const hyIds = [...hy0.matchAll(/data-lesson="([^"]+)"/g)].map((m) => m[1]);
expect("Platzhalter: Text davor, dann die Choräle der Rahmen, übrige dahinter, Text danach am Ende", [hyIds[0], /Choral vom Lesen/.test(hy0.split('data-lesson="' + hyIds[1] + '"')[1].slice(0, 300)), hyIds[2], hyIds[hyIds.length - 1], hyIds.length > 4], ["vor", true, "hymn-frame-1", "nach", true]);
expect("übrige erzeugte Choräle: eigene Zählung", /Choral I<\/h4>/.test(hy0), true);
expect("Mitte je Hälfte: zwei Seiten, eigene Verse", [fx.middle.shared, fx.middle.pages.map((p) => /vm-line">(.*?)</.exec(p.html)[1])], [false, ["Ich sah alles.", "Ich bin zerbrochen."]]);
expect("Mitte: Notiz mit Beschreibung", fx.middle.pages[0].html.includes('<span class="mnote-desc">unterstreicht „alles“</span>Gelesen.'), true);
expect("Feste: am selben Tag gilt die lokale Datei, ohne Tag am Monatsende", B.feastsOf(V.local.nethys, "w").filter((f) => f.m >= 10).map((f) => f.name), ["Tag der Abwehr", "Transmutatum", "Nacht der Offenen Augen"].filter((n) => n !== "Tag der Abwehr" || (ctx.PROFILE.devotion.feasts || []).some((f) => f.name === n)));
expect("Festdatum ohne Tag", B.feastDate({ m: 11, when: "erste mondlose Nacht" }), ctx.PROFILE.calendar.months[11] + ", erste mondlose Nacht");
delete ctx.PROFILE.vademecum;
delete V.local.nethys;

if (fails.length) { console.log(`\n${fails.length} Fehler`); process.exit(1); }
console.log("\nalle Tests bestanden");
