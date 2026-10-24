#!/usr/bin/env bash
# Überträgt den aktuellen Stand von main als neuen Commit auf den öffentlichen Zweig „public“
# und pusht ihn nach origin/main (GitHub Pages). Die private Historie von main wird nie gepusht.
# Private Dateien (character/, data/profile.local.js, Rohdaten …) sind per .gitignore ohnehin ausgeschlossen.
set -euo pipefail
cd "$(dirname "$0")/.."
msg="${1:-Aktualisierung}"
tree=$(git rev-parse "main^{tree}")
if [ "$(git rev-parse "public^{tree}")" = "$tree" ]; then
  echo "Nichts zu veröffentlichen – public entspricht bereits main."
  exit 0
fi
commit=$(git commit-tree "$tree" -p public -m "$msg")
git update-ref refs/heads/public "$commit"
git push origin public:main
echo "Veröffentlicht: $(git log --oneline -1 public)"
