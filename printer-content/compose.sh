#!/usr/bin/env bash
# Skleja klipy z output/ w jedną rolkę 1080x1920 (9:16, 30fps, H.264).
#
# Uzycie:
#   ./compose.sh                                  # uzywa output/*.mp4 w kolejnosci alfabetycznej
#   ./compose.sh clip1.mp4 clip2.mp4 clip3.mp4    # uzywa podanych klipow w podanej kolejnosci
#
# Wynik:  output/roll-YYYY-MM-DD-HHMM.mp4
#
# Wymaga: ffmpeg (apt install ffmpeg / brew install ffmpeg)

set -euo pipefail

OUTDIR="${OUTDIR:-output}"
mkdir -p "$OUTDIR"

if [ $# -eq 0 ]; then
  mapfile -t CLIPS < <(find "$OUTDIR" -maxdepth 1 -type f -name '*.mp4' ! -name 'roll-*.mp4' | sort)
else
  CLIPS=("$@")
fi

if [ ${#CLIPS[@]} -eq 0 ]; then
  echo "Brak klipow do sklejenia. Wrzuc .mp4 do $OUTDIR/ albo podaj jako argumenty."
  exit 1
fi

echo "Skladam ${#CLIPS[@]} klipow:"
printf '  - %s\n' "${CLIPS[@]}"

CONCAT_LIST="$(mktemp)"
trap 'rm -f "$CONCAT_LIST"' EXIT

# Normalizuj kazdy klip do 1080x1920 9:16 30fps H.264 AAC, zeby concat nie krzyczal
NORMALIZED=()
for i in "${!CLIPS[@]}"; do
  src="${CLIPS[$i]}"
  dst="$OUTDIR/.normalized-$i.mp4"
  ffmpeg -y -i "$src" \
    -vf "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps=30" \
    -c:v libx264 -preset fast -crf 20 -pix_fmt yuv420p \
    -c:a aac -b:a 128k -ar 48000 \
    -movflags +faststart \
    "$dst" </dev/null
  NORMALIZED+=("$dst")
  echo "file '$(realpath "$dst")'" >> "$CONCAT_LIST"
done

STAMP="$(date +%Y-%m-%d-%H%M)"
OUTFILE="$OUTDIR/roll-$STAMP.mp4"

ffmpeg -y -f concat -safe 0 -i "$CONCAT_LIST" -c copy "$OUTFILE"

# Cleanup normalized intermediates
rm -f "${NORMALIZED[@]}"

echo ""
echo "Gotowe: $OUTFILE"
echo ""
echo "Nastepny krok: wrzuc do CapCut Mobile, dodaj muzyke + tekst overlay + hook na start (0.5s)."
echo "TikTok algorytm karze fully-auto content, wiec hook + caption musisz dodac recznie."
