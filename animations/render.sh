#!/usr/bin/env bash
# Render every scene and transcode it for the web into public/animations/.
#
# Each scene produces three files:
#   <slug>.mp4    h.264, faststart  — broad compatibility
#   <slug>.webp   final frame       — <video> poster and reduced-motion fallback
#
# The poster is WebP, not JPEG: it is the one asset that always downloads
# (the video is preload="none"), and on flat graphics WebP came in at half
# the size of JPEG q3 with cleaner edges on the Thai text.
#
# No VP9/webm variant: measured on this content it came out ~30% LARGER than
# h.264. Flat-colour line art on white is x264's best case, so the second
# encode would cost bytes and a build step for nothing.
#
# Usage:  ./render.sh              # everything
#         ./render.sh SeamSystemsTH  # one scene
set -euo pipefail

ENV_PREFIX="${MANIM_ENV:-$HOME/micromamba/envs/manim}"
export PATH="$ENV_PREFIX/bin:$PATH"

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUT="$HERE/../public/animations"
RAW="$HERE/out/videos"
mkdir -p "$OUT"

SCENES=(
  "SeamSystemsTH:seam-systems-th"
  "SeamSystemsEN:seam-systems-en"
  "PuFoamTH:pu-foam-th"
  "PuFoamEN:pu-foam-en"
  "SheetThicknessTH:sheet-thickness-th"
  "SheetThicknessEN:sheet-thickness-en"
)

want="${1:-}"

for entry in "${SCENES[@]}"; do
  scene="${entry%%:*}"
  slug="${entry##*:}"
  [ -n "$want" ] && [ "$want" != "$scene" ] && continue

  echo "==> $scene -> $slug"
  # tqdm redraws with \r, so split on it before filtering or the whole
  # progress bar arrives as one line and defeats the grep.
  ( cd "$HERE" && manimgl scenes.py "$scene" -w ) 2>&1 \
    | tr '\r' '\n' | grep -E "Error|Traceback" || true

  src="$RAW/$scene.mp4"
  [ -f "$src" ] || { echo "    !! $src missing"; exit 1; }

  # Flat-colour line art compresses hard; these CRFs stay visually lossless
  # on text edges while keeping the payload small enough to autoplay.
  ffmpeg -y -loglevel error -i "$src" \
    -c:v libx264 -crf 26 -preset slow -pix_fmt yuv420p \
    -movflags +faststart -an "$OUT/$slug.mp4"

  # Poster = the closing summary frame, which is also what a
  # prefers-reduced-motion visitor sees instead of the animation.
  ffmpeg -y -loglevel error -sseof -0.5 -i "$src" \
    -vframes 1 -c:v libwebp -quality 82 "$OUT/$slug.webp"

  printf "    mp4 %s | webp %s\n" \
    "$(du -h "$OUT/$slug.mp4" | cut -f1)" \
    "$(du -h "$OUT/$slug.webp" | cut -f1)"
done

echo "done -> $OUT"
