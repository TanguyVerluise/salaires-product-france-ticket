#!/bin/bash
# Vérifie que index.html n'utilise pas de liens absolus pour les versions.
# Les liens absolus (/v1.html) cassent GitHub Pages (sous-répertoire).
# Les liens doivent être relatifs (v1.html).

set -e

FAIL=0

if grep -n 'href="/v[0-9]' index.html; then
  echo "❌ index.html contient des liens absolus vers les versions."
  echo "   Remplace href=\"/vN.html\" par href=\"vN.html\" (sans slash initial)."
  FAIL=1
fi

if [ "$FAIL" -eq 0 ]; then
  echo "✅ Tous les liens dans index.html sont relatifs."
fi

exit $FAIL
