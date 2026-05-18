#!/bin/bash
# build.sh — assembles a deploy-ready folder for a single client.
# Usage: ./build.sh ppponik
set -e

CLIENT="${1:?Usage: ./build.sh <client-name>}"
BASE="$(cd "$(dirname "$0")" && pwd)"
SRC_BASE="$BASE/base"
SRC_CLIENT="$BASE/clients/$CLIENT"
DEPLOY="$BASE/deploy/$CLIENT"

# Folders starting with _ are internal GEK-X tools (e.g. _onboarding) — not buildable
case "$CLIENT" in
  _*) echo "Refusing to build internal folder '$CLIENT'. Open it directly in a browser instead."; exit 1 ;;
esac

if [ ! -d "$SRC_CLIENT" ]; then
  echo "Client folder not found: $SRC_CLIENT"
  exit 1
fi

rm -rf "$DEPLOY"
mkdir -p "$DEPLOY"/{css,js,config,assets/gallery}

cp "$SRC_BASE/css/"*.css        "$DEPLOY/css/"
cp "$SRC_BASE/js/"*.js          "$DEPLOY/js/"
cp "$SRC_CLIENT/"*.html         "$DEPLOY/"
cp "$SRC_CLIENT/config/config.json" "$DEPLOY/config/"

if [ -d "$SRC_CLIENT/assets" ]; then
  cp -r "$SRC_CLIENT/assets/"* "$DEPLOY/assets/" 2>/dev/null || true
fi

echo "✅ $DEPLOY ready for Netlify (drag the folder onto netlify.app/drop)"
