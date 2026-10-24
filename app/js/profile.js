// Führt das neutrale Profil (data/profile.js) mit dem optionalen lokalen Profil (data/profile.local.js) zusammen.
// Objekte werden rekursiv gemischt, Listen und einfache Werte ersetzt.
(function () {
  const isObj = (v) => v && typeof v === "object" && !Array.isArray(v);
  function merge(base, over) {
    const out = { ...base };
    for (const [k, v] of Object.entries(over || {})) out[k] = isObj(v) && isObj(base[k]) ? merge(base[k], v) : v;
    return out;
  }
  window.PROFILE = merge(window.PROFILE || {}, window.PROFILE_LOCAL || {});
  // Platzhalter {owner} {name} {essence} {school} ersetzen
  window.PROFILE.fill = (text, vars) => String(text).replace(/\{(\w+)\}/g, (m, k) => (vars[k] != null ? vars[k] : m));
})();
