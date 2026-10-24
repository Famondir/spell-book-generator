// Führt das neutrale Profil (data/profile.js) mit dem lokalen Profil des aktiven Charakters zusammen
// (data/profile.local.js: PROFILE_LOCAL und/oder PROFILES_LOCAL).
// Objekte werden rekursiv gemischt, Listen und einfache Werte ersetzt.
(function () {
  const isObj = (v) => v && typeof v === "object" && !Array.isArray(v);
  function merge(base, over) {
    const out = { ...base };
    for (const [k, v] of Object.entries(over || {})) out[k] = isObj(v) && isObj(base[k]) ? merge(base[k], v) : v;
    return out;
  }
  // Profil des aktiven Charakters (chars.js); ohne Charakter-Slots wie bisher PROFILE_LOCAL
  const local = window.CHARS ? window.CHARS.profileData() : window.PROFILE_LOCAL;
  window.PROFILE = merge(window.PROFILE || {}, local || {});
  // Platzhalter {owner} {name} {essence} {school} ersetzen
  window.PROFILE.fill = (text, vars) => String(text).replace(/\{(\w+)\}/g, (m, k) => (vars[k] != null ? vars[k] : m));
})();
