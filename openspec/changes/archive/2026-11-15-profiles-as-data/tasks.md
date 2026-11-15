## 1. Speicher und Laden

- [x] 1.1 `app/js/chars.js`: gespeicherte Profile lesen (`spellbook.profiles`, `spellbook.profile.<key>`), `profiles()` liefert Datei-Profile und dann gespeicherte, deren Schlüssel nicht aus der Datei kommt; Herkunft und Überdeckung je Eintrag; Test: Profil nur im Speicher → Buch wie mit Datei
- [x] 1.2 Lookup `vademecumEntry(id)` (Datei vor gespeichertem Eintrag `spellbook.vademecum.<gottheit>`) in `vademecum.js` und `time.js`; Test: Vademecum der Nethys ohne Datei mit gespeichertem Eintrag
- [x] 1.3 Kleines Modul für Profilpakete (bauen, prüfen, speichern, ersetzen, entfernen) mit Abfangen von QuotaExceededError

## 2. Export und Import des Profils

- [x] 2.1 „Exportieren“ je Profil: Paket mit Profil und allen geladenen Vademecum-Einträgen, Dateiname aus dem Label (`kirran.profil.json`)
- [x] 2.2 „Profil laden …“: JSON prüfen (`format`, `version`), bei `.js` Hinweis statt Ausführen, Rückfrage beim Ersetzen mit Exportdaten, bei abweichendem Label Angebot eines neuen Schlüssels
- [x] 2.3 Entfernen: Charaktere mit diesem Profil fallen auf neutral zurück, Buch unverändert

## 3. Charakter-Export

- [x] 3.1 `#btn-export`: `profilePackage` mit Profil des Charakters und Vademecum-Eintrag seiner Gottheit; Hinweis, dass die Datei das Profil enthält
- [x] 3.2 `#file-import`: Paket zuerst speichern, dann Charakter mit dem Profilschlüssel anlegen bzw. aktualisieren; alte Dateien ohne Paket wie bisher
- [x] 3.3 Rundreise-Test: Export mit Datei-Profil → frischer Speicher ohne `profile.local.js` → Import → gleiche Randnotizen, Kalender und Vademecum-Titel

## 4. Oberfläche und Texte

- [x] 4.1 Block „Profile“ im Einstellungsdialog (Abschnitt Charakter): Liste mit Herkunft, Datum, überdeckt; Knöpfe Exportieren, Entfernen, Profil laden; im Browser in beiden Oberflächensprachen ansehen
- [x] 4.2 Texte in `data/lang/de.js` und `data/lang/en.js`; `tools/bilingual-check.mjs` grün
- [x] 4.3 Bedienungstests in `tools/test-cases.mjs` (Laden, Ersetzen, Überdeckt, Entfernen, Fremdformat, `.js`-Hinweis)

## 5. Doku

- [x] 5.1 `docs/GUIDE.md` und README: „Profil auf ein anderes Gerät bringen“ (am Laptop bearbeiten → neu laden → exportieren → am Handy laden bzw. Charakter-Export)
- [x] 5.2 Hinweis in `data/profile.local.example.js` auf Export als Profilpaket
