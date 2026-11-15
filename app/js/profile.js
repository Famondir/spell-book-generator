// Führt das neutrale Profil (data/profile.js) mit dem lokalen Profil des aktiven Charakters zusammen
// (data/profile.local.js: PROFILE_LOCAL und/oder PROFILES_LOCAL).
// Objekte werden rekursiv gemischt, Listen und einfache Werte ersetzt.
//
// Sprache (localization: einsprachige Profiltexte): Ein Profil schreibt in einer Sprache (lang, ab Werk "de").
// window.PROFILE ist das Profil in dieser Sprache; strukturelle Angaben (Formelherkunft, Gottheit, Hausregeln)
// liest der Code von dort. Texte im Buch kommen aus PROFILE.forLang(buchsprache): In der Sprache des Profils
// ist das PROFILE selbst; in der anderen das neutrale Profil dieser Sprache (data/profile.js → en), ergänzt
// um sprachneutrale Angaben des lokalen Profils (KEEP) und dessen optionales Unterobjekt für diese Sprache.
(function () {
  const isObj = (v) => v && typeof v === "object" && !Array.isArray(v);
  function merge(base, over) {
    const out = { ...base };
    for (const [k, v] of Object.entries(over || {})) out[k] = isObj(v) && isObj(base[k]) ? merge(base[k], v) : v;
    return out;
  }
  const fill = (text, vars) => String(text).replace(/\{(\w+)\}/g, (m, k) => (vars[k] != null ? vars[k] : m));
  const LANGS = ["de", "en"];
  const strip = (p) => Object.fromEntries(Object.entries(p || {}).filter(([k]) => !LANGS.includes(k)));
  // Profil des aktiven Charakters (chars.js); ohne Charakter-Slots wie bisher PROFILE_LOCAL
  const NEUTRAL = window.PROFILE || {};
  const LOCAL = (window.CHARS ? window.CHARS.profileData() : window.PROFILE_LOCAL) || {};
  const localLang = LOCAL.lang || "de";
  // sprachneutrale Angaben, die das lokale Profil auch in der anderen Buchsprache behält
  const KEEP = ["owner", "deity", "decipher", "rulesDe", "lang"];
  // neutrale Profiltexte je Sprache: Deutsch = Grundobjekt, sonst Grundobjekt mit dem Unterobjekt der Sprache
  const neutralIn = (l) => (l === "de" ? strip(NEUTRAL) : merge(strip(NEUTRAL), NEUTRAL[l] || {}));

  window.PROFILE = merge(NEUTRAL, LOCAL);
  // Platzhalter {owner} {name} {essence} {school} ersetzen
  window.PROFILE.fill = fill;
  const cache = new Map();
  window.PROFILE.forLang = (l) => {
    if (!cache.has(l)) {
      let p;
      if (l === localLang) p = merge(neutralIn(l), strip(LOCAL));
      else {
        const keep = Object.fromEntries(KEEP.filter((k) => LOCAL[k] != null).map((k) => [k, LOCAL[k]]));
        p = merge(merge(neutralIn(l), keep), LOCAL[l] || {});
      }
      p.fill = fill;
      p.lang = l;
      cache.set(l, p);
    }
    return cache.get(l);
  };
  // Profil der eingestellten Buchsprache
  window.PROFILE.book = () => window.PROFILE.forLang((window.I18N && I18N.lang.book) || "de");
  // eigene Texte entfallen: lokales Profil mit Texten, aber andere Buchsprache (Hinweis im Dialog)
  window.PROFILE.foreign = (l) => Object.keys(strip(LOCAL)).some((k) => !KEEP.includes(k)) && l !== localLang && !LOCAL[l];
  window.PROFILE.localLang = localLang;
  // Einstellung mit Vorgabe aus dem Profil (Besitzer, Buchtitel, Untertitel): unverändert übernommen gilt sie als
  // Profiltext, im Buch der anderen Sprache steht dann der Wert des Profils dieser Sprache; eigene Eingaben bleiben
  window.PROFILE.bookValue = (settings, k) => {
    const v = settings[k], l = (window.I18N && I18N.lang.book) || "de";
    if (l === localLang || v !== window.PROFILE[k]) return v;
    const x = window.PROFILE.forLang(l)[k];
    return x != null ? x : v;
  };
})();
