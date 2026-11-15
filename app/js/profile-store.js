// Profilpakete im Browser (Change profiles-as-data): Profile und Vademecum-Einträge als Daten statt als Dateien,
// damit sie auf ein anderes Gerät oder in die Online-Fassung mitreisen.
// Wird vor chars.js geladen; chars.js nimmt gespeicherte Profile in CHARS.profiles() auf.
//
// Paket (JSON, nie als Code ausgeführt):
//   { format: "spellbook-profile", version: 1, key, label, exported, profile: {…}, vademecum: { <gottheit>: {…} } }
// Speicher:
//   spellbook.profiles           Übersicht [{ key, label, exported, imported, vademecum: [gottheits-ids] }]
//   spellbook.profile.<key>      Profilinhalt
//   spellbook.vademecum.<id>     Vademecum-Eintrag je Gottheit (global, wie VADEMECUM.local)
// Vorrang: Datei vor Speicher (CHARS.profiles(), VADEMECUM-Lookup).
window.PROFILE_STORE = (function () {
  const P = "spellbook.";
  const FORMAT = "spellbook-profile";
  const VERSION = 1;
  const get = (k) => {
    try {
      return localStorage.getItem(k);
    } catch (_) {
      return null;
    }
  };
  const json = (k, d) => {
    try {
      const v = get(k);
      return v ? JSON.parse(v) : d;
    } catch (_) {
      return d;
    }
  };
  // Schreiben mit Fehler nach außen (Speicher voll), anders als die stillen Schreiber in chars.js
  const put = (k, v) => (v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v));

  const index = () => {
    const l = json(P + "profiles", []);
    return Array.isArray(l) ? l : [];
  };
  const entry = (key) => index().find((x) => x.key === key) || null;
  const data = (key) => json(P + "profile." + key, null);
  // Vademecum-Einträge sind groß (~170 KB) und werden beim Setzen oft gefragt: einmal lesen
  const vmCache = new Map();
  const vademecum = (id) => {
    if (!vmCache.has(id)) vmCache.set(id, json(P + "vademecum." + id, null));
    return vmCache.get(id);
  };

  // Fehler mit Code, damit die Oberfläche passende Texte zeigen kann
  const fail = (code, extra = {}) => Object.assign(new Error(code), { code, ...extra });

  // Paket prüfen; gibt das Paket zurück oder wirft (notPackage, newerVersion)
  function check(pkg) {
    if (!pkg || typeof pkg !== "object" || pkg.format !== FORMAT || !pkg.profile || typeof pkg.profile !== "object") throw fail("notPackage");
    if (!(pkg.version >= 1) || pkg.version > VERSION) throw fail("newerVersion", { version: pkg.version });
    if (!pkg.key || typeof pkg.key !== "string") throw fail("notPackage");
    return pkg;
  }
  function parse(text) {
    let pkg;
    try {
      pkg = JSON.parse(text);
    } catch (_) {
      throw fail("notPackage");
    }
    return check(pkg);
  }

  // Paket bauen: Profil-Rohdaten (ungemischt) und Vademecum-Einträge je Gottheit
  function build(key, label, profile, vm = {}) {
    const vademecum = Object.fromEntries(Object.entries(vm || {}).filter(([, v]) => v));
    return { format: FORMAT, version: VERSION, key, label, exported: new Date().toISOString(), profile, ...(Object.keys(vademecum).length ? { vademecum } : {}) };
  }

  // Schlüssel aus dem Label, der weder gespeichert noch in `taken` ist
  function freeKey(label, taken = []) {
    const base = String(label || "profil").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/ß/g, "ss").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "profil";
    const used = new Set([...index().map((x) => x.key), ...taken]);
    let k = base;
    for (let i = 2; used.has(k); i++) k = base + "-" + i;
    return k;
  }

  // Paket speichern (unter `key`, Vorgabe pkg.key); ersetzt ein gespeichertes Profil gleichen Schlüssels.
  // Alles oder nichts: bei vollem Speicher werden die vorigen Werte zurückgeschrieben.
  function save(pkg, key = pkg.key) {
    check(pkg);
    const vmIds = Object.keys(pkg.vademecum || {});
    const list = index().filter((x) => x.key !== key);
    list.push({ key, label: pkg.label || key, exported: pkg.exported || null, imported: new Date().toISOString(), ...(vmIds.length ? { vademecum: vmIds } : {}) });
    const writes = [[P + "profile." + key, JSON.stringify(pkg.profile)], ...vmIds.map((id) => [P + "vademecum." + id, JSON.stringify(pkg.vademecum[id])]), [P + "profiles", JSON.stringify(list)]];
    const before = writes.map(([k]) => [k, get(k)]);
    vmCache.clear();
    try {
      for (const [k, v] of writes) put(k, v);
    } catch (err) {
      for (const [k, v] of before) {
        try {
          put(k, v);
        } catch (_) { /* Rückschreiben nach bestem Vermögen */ }
      }
      const size = writes.reduce((n, [, v]) => n + v.length, 0);
      throw fail("quota", { size, cause: err });
    }
    return key;
  }

  // gespeichertes Profil entfernen; Vademecum-Einträge nur, wenn kein anderes gespeichertes Profil sie mitbrachte
  function remove(key) {
    const e = entry(key);
    if (!e) return false;
    const list = index().filter((x) => x.key !== key);
    const still = new Set(list.flatMap((x) => x.vademecum || []));
    vmCache.clear();
    put(P + "profile." + key, null);
    for (const id of e.vademecum || []) if (!still.has(id)) put(P + "vademecum." + id, null);
    put(P + "profiles", JSON.stringify(list));
    return true;
  }

  // alle gespeicherten Vademecum-Einträge (für den Export eines gespeicherten Profils)
  const vademecumIds = () => [...new Set(index().flatMap((x) => x.vademecum || []))];

  return { FORMAT, VERSION, index, entry, data, vademecum, vademecumIds, parse, check, build, freeKey, save, remove };
})();

// Vademecum-Eintrag einer Gottheit: Datei (data/vademecum.local.js) vor gespeichertem Eintrag
window.vademecumEntry = function (id) {
  if (!id) return null;
  const file = (window.VADEMECUM && window.VADEMECUM.local) || {};
  return file[id] || window.PROFILE_STORE.vademecum(id) || null;
};
