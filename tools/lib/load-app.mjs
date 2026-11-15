// Lädt die Skripte der App ohne Browser in einen vm-Kontext (für Werkzeuge ohne DOM).
// Reihenfolge wie in index.html; fehlende optionale Dateien werden übersprungen.
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

export function loadApp({ withProfile = false, extra = [] } = {}) {
  const mem = new Map();
  const ctx = {
    navigator: { language: "de-DE" },
    document: { documentElement: {}, querySelector: () => null, addEventListener() {} },
    localStorage: { getItem: (k) => (mem.has(k) ? mem.get(k) : null), setItem: (k, v) => mem.set(k, String(v)), removeItem: (k) => mem.delete(k) },
    location: { search: "", hash: "" },
    console,
  };
  ctx.window = ctx;
  vm.createContext(ctx);
  const files = [
    "app/js/i18n.js", "data/lang/de.js", "data/lang/en.js", "data/profile.js",
    withProfile && "data/profile.local.js",
    "app/js/profile-store.js", "app/js/chars.js", "app/js/profile.js", "data/spells.js", "data/everyday_spells.js", "data/everyday_spells.en.js", "data/deities.js", "app/js/deity-colors.js", "data/custom_texts.js",
    "app/js/util.js", "app/js/classes.js", "app/js/everyday.js", "app/js/theory.js", "app/js/analyze.js",
    ...langFiles(withProfile),
    "app/js/lang.js", "app/fonts/widths.js", "app/js/scripts.js", "app/js/textgen.de.js", "app/js/textgen.en.js", "app/js/textgen.js", ...extra,
  ].filter(Boolean);
  for (const f of files) {
    const p = join(ROOT, f);
    if (!existsSync(p)) continue;
    vm.runInContext(readFileSync(p, "utf8"), ctx, { filename: f });
  }
  return ctx;
}

// Formel-Lexika: mitgelieferte, mit Profil auch lokale
function langFiles(withLocal) {
  const dir = join(ROOT, "data", "formula-lang");
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((f) => f.endsWith(".js") && (withLocal || !f.endsWith(".local.js"))).sort().map((f) => "data/formula-lang/" + f);
}
