#!/usr/bin/env node
// Tests für die Tafel der Zeit ohne Browser: Zeichen gegen Monate, Jahresnaht, Schutzgottheit, Rückfälle,
// Neutralität und fehlende Regelwirkung.
// Aufruf: node tools/time-test.mjs   (Rückgabecode 1 bei Fehlern)
import { readFileSync } from "node:fs";
import { loadApp } from "./lib/load-app.mjs";

const EXTRA = ["app/js/glyphs.js", "data/time.js", "app/js/time.js"];
const fails = [];
const expect = (what, got, want) => {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  console.log(`${ok ? "ok" : "✗ "}  ${what}${ok ? "" : `: erhalten ${JSON.stringify(got)}, erwartet ${JSON.stringify(want)}`}`);
  if (!ok) fails.push(what);
};

// Neutral: Tierkreis, irdische Tage, keine Patrone
let ctx = loadApp({ extra: EXTRA });
let TM = ctx.TIME;
expect("neutral: zwölf Zeichen des Tierkreises", TM.signs().length, 12);
expect("neutral: Tage ab Sonntag", [0, 1, 6].map((i) => TM.week()[i].day), ["Sonntag", "Montag", "Samstag"]);
expect("neutral: Wochenfolge wie im Wochenkreis", TM.week().map((w) => w.name), ["Sonne", "Mond", "Mars", "Merkur", "Jupiter", "Venus", "Saturn"]);
expect("neutral: keine Schutzgottheit", TM.months().filter((m) => m.patron).length, 0);
const steinbock = TM.signs().find((s) => s.id === "capricorn");
expect("Zeichen über die Jahresnaht: Ende nach 360°", steinbock.a1 > 360 && steinbock.a0 < 360, true);
expect("Zeichen über die Jahresnaht: Länge 29 Tage", Math.round(((steinbock.a1 - steinbock.a0) / 360) * TM.total()), 29);
const sum = TM.signs().reduce((a, s) => a + (s.a1 - s.a0), 0);
expect("Tierkreis schließt den Kreis ohne Lücke", Math.round(sum), 360);

// Nähe: fern ist nie selbst nahe
expect("neutral: jeder Tag hat Essenzen und Farbe", TM.week().every((w) => w.ess.length && w.color), true);
expect("Gegenpol gehört nicht zur Affinität", TM.signs().every((s) => !s.aff.near.includes(s.aff.far)), true);

// Lokal: 13 Zeichen, versetzt zu den 12 Monaten, Patrone aus deities.js
ctx = loadApp({ withProfile: true, extra: EXTRA });
TM = ctx.TIME;
const local = ctx.PROFILE.calendar.signs && ctx.PROFILE.calendar.signs.length === 13;
if (!local) console.log("(kein lokales Profil mit 13 Zeichen: lokale Fälle übersprungen)");
else {
  const Z = TM.signs(), M = TM.months();
  expect("lokal: 13 Zeichen", Z.length, 13);
  const edges = new Set(M.map((m) => Math.round(m.a0 * 100)));
  expect("lokal: Zeichengrenzen fallen nicht auf Monatsgrenzen", Z.filter((z) => edges.has(Math.round((z.a0 % 360) * 100))).length < Z.length / 2, true);
  expect("lokal: Zeichen schließen den Kreis", Math.round(Z.reduce((a, s) => a + (s.a1 - s.a0), 0)), 360);
  expect("lokal: Patron aus deities.js", M[10].patron && M[10].patron.name, "Nethys");
  expect("lokal: Tage mit eigenen Planeten haben trotzdem Essenzen und Farbe", TM.week().every((w) => w.ess.length && w.color), true);
  const blues = M.flatMap((m) => m.colors).filter((c) => c.name === "blue");
  expect("lokal: mehrere blaue Schutzgötter, jeder mit eigenem Blau", blues.length > 1 && new Set(blues.map((c) => c.hex)).size === blues.length, true);
  expect("lokal: Farben deterministisch", JSON.stringify(TM.months().map((m) => m.colors)), JSON.stringify(M.map((m) => m.colors)));
  // Feste aus dem Vademecum der eigenen Gottheit (falls die lokale Datei da ist)
  const vm = loadApp({ withProfile: true, extra: ["data/vademecum.js", "data/vademecum.local.js", ...EXTRA] });
  vm.DEITY = vm.DEITIES.find((d) => d.id === "nethys");
  if (vm.VADEMECUM.local && vm.VADEMECUM.local.nethys) {
    const F = vm.TIME.feasts();
    expect("Feste: Vademecum und Andacht zusammen, ohne Doppel am selben Tag", F.filter((f) => +f.m === 10 && +f.d === 8).length, 1);
    const abwehr = F.find((f) => +f.m === 10 && +f.d === 8);
    expect("Feste: Name aus dem Vademecum, Text aus der Andacht", [abwehr.name, !!abwehr.text], ["Der Tag der Abwehr", true]);
    expect("Feste: Tag der Hervorrufung aus dem Vademecum", F.some((f) => +f.m === 10 && +f.d === 18), true);
    expect("Feste: nach Datum geordnet", F.every((f, i) => !i || F[i - 1].m < f.m || (F[i - 1].m === f.m && (F[i - 1].d || 99) <= (f.d || 99))), true);
  }
  ctx.PROFILE.calendar.patrons[3] = "gibt-es-nicht";
  expect("unbekannte Id lässt den Monat ohne Patron", [TM.months()[3].patron, TM.months()[10].patron !== null], [null, true]);
}

// Farbstoffe der Gottheiten: dieselbe Gottheit überall gleich, die bekannten blauen Götter verschieden
{
  const c1 = loadApp(), c2 = loadApp();
  const col = (c, id) => c.DEITIES.find((d) => d.id === id).colors.map((x) => x.de + x.hex).join();
  expect("Farbstoff je Gottheit fest", col(c1, "desna"), col(c2, "desna"));
  const blueIds = ["desna", "gozreh", "pharasma", "sarenrae", "irori"];
  const hexes = blueIds.map((id) => c1.DEITIES.find((d) => d.id === id).colors.find((x) => x.name === "blue").hex);
  expect("bekannte blaue Götter mit eigenem Blau", new Set(hexes).size, blueIds.length);
  expect("Aroden ergänzt: Grün und Gold", c1.DEITIES.find((d) => d.id === "aroden").colors.map((x) => x.name), ["green", "gold"]);
  expect("Grundfarbe bleibt erhalten", c1.DEITIES.find((d) => d.id === "desna").colors[0].base, "#2552a3");
}

// Festtage im Lehrheft nur als Punkte einer Stimme (calendar.feastHand)
{
  const c = loadApp({ extra: EXTRA });
  c.PROFILE.devotion = { feasts: [{ d: 8, m: 10, name: "Probefest" }] };
  expect("ohne feastHand keine Festpunkte", c.TIME.yearRing().includes("hand-dot"), false);
  c.PROFILE.calendar.feastHand = "jemand";
  expect("mit feastHand Festpunkte", c.TIME.yearRing().includes("hand-dot"), true);
}

// Umbruch langer Namen im Ring
{
  const W = loadApp({ extra: EXTRA }).TIME.wrapName;
  expect("kurzer Name einzeilig", W("Der Wagen", 3.7, 21), ["Der Wagen"]);
  expect("weiche Trennstelle mit Strich", W("Die Frisch\u00advermählten", 3.7, 21), ["Die Frisch-", "vermählten"]);
  expect("ohne Trennstelle: Silbengrenze, „tr“ bleibt zusammen", W("Der Laternenträger", 3.7, 21), ["Der", "Laternen-", "träger"]);
}

// Neutralität: keine Eigennamen eines Fremdsettings in Daten, Modul und Lektion
const FREMD = ["Drossel", "Laternenträger", "Frischvermählte", "Sterngucker", "Verfolger", "Cynosure", "Toilday", "Wealday", "Oathday", "Moonday", "Karawane", "Abadius", "Golarion", "Sarenrae"];
for (const f of ["data/time.js", "app/js/time.js", "data/profile.js", "data/profile.local.example.js"]) {
  const t = readFileSync(f, "utf8");
  expect(`neutral: ${f} ohne Fremdnamen`, FREMD.filter((w) => t.includes(w)), []);
}
const primer = readFileSync("data/primer.js", "utf8");
const lesson = primer.slice(primer.indexOf('id: "l-time-week"'), primer.indexOf('id: "l31"'));
expect("neutral: Lektion ohne Fremdnamen", FREMD.filter((w) => lesson.includes(w)), []);
ctx = loadApp({ extra: EXTRA });
const out = ctx.TIME.yearRing() + ctx.TIME.starMap();
expect("neutral: Ring und Karte ohne Fremdnamen", FREMD.filter((w) => out.includes(w)), []);

// Keine Regelwirkung: Analyse eines Zaubers ist mit und ohne Zeitangaben gleich
const a1 = JSON.stringify(loadApp({ extra: EXTRA }).analyze(loadApp().SPELLS[0]));
const c2 = loadApp({ withProfile: true, extra: EXTRA });
const a2 = JSON.stringify(c2.analyze(loadApp().SPELLS[0]));
const strip = (j) => j.replace(/"seed":\d+/g, "");
expect("keine Regelwirkung: Analyse unverändert durch Zeitangaben", strip(a1) === strip(a2) || !local, true);

console.log(fails.length ? `\n${fails.length} Fehler` : "\nalle Tests bestanden");
process.exit(fails.length ? 1 : 0);
