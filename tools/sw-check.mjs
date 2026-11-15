#!/usr/bin/env node
// Prüft die Vorladeliste des Service Workers (sw.js, PRECACHE) gegen die ausgelieferten Dateien:
//   - erwartet: "./", index.html, manifest.webmanifest, LICENSE-OGL.txt (Fußzeile) und alle Dateien aus app/ und data/ mit Endung
//     .js .css .woff2 .png (ohne *.local.*), laut git (eingecheckt oder neu, nicht ignoriert)
//   - jeder Verweis in index.html (src/href) und im Manifest steht in der Liste
//   - jeder Eintrag existiert
// Rückgabecode 1 bei Abweichungen.
//
//   node tools/sw-check.mjs
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sw = readFileSync(join(ROOT, "sw.js"), "utf8");
const m = sw.match(/const PRECACHE = \[([\s\S]*?)\];/);
if (!m) {
  console.error("sw.js: PRECACHE nicht gefunden");
  process.exit(1);
}
const list = [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]);
const SHIPPED = /\.(js|css|woff2|png)$/;
const git = (...a) => execFileSync("git", a, { cwd: ROOT }).toString().split("\n").filter(Boolean);
const files = [...new Set([...git("ls-files", "app", "data"), ...git("ls-files", "--others", "--exclude-standard", "app", "data")])]
  .filter((f) => SHIPPED.test(f) && !/\.local\./.test(f) && existsSync(join(ROOT, f)));
const want = new Set(["./", "index.html", "manifest.webmanifest", "LICENSE-OGL.txt", ...files]);

const errs = [];
const have = new Set(list);
for (const f of want) if (!have.has(f)) errs.push(`fehlt in PRECACHE: ${f}`);
for (const f of list) if (!want.has(f)) errs.push(`überzählig in PRECACHE: ${f}`);
if (list.length !== have.size) errs.push("doppelte Einträge in PRECACHE");
for (const f of list) if (f !== "./" && !existsSync(join(ROOT, f))) errs.push(`Datei fehlt: ${f}`);
// Verweise der Seite und des Manifests
const html = readFileSync(join(ROOT, "index.html"), "utf8");
const refs = [...html.matchAll(/\b(?:src|href)="([^"#:]+)"/g)].map((x) => x[1]);
const manifest = JSON.parse(readFileSync(join(ROOT, "manifest.webmanifest"), "utf8"));
refs.push(...manifest.icons.map((i) => i.src));
for (const r of refs) if (!/\.local\./.test(r) && r !== "sw.js" && !have.has(r)) errs.push(`Verweis nicht vorgeladen: ${r}`);

if (errs.length) {
  console.log(errs.join("\n"));
  console.log(`sw-check: ${errs.length} Abweichung(en)`);
  process.exit(1);
}
console.log(`ok: ${list.length} Einträge, Verweise aus index.html und Manifest vollständig`);
