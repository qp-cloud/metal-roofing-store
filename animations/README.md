# Explainer diagrams (manim)

Source for the technical animations embedded on the site. Rendered output goes
to `public/animations/` and is committed, so a normal `pnpm build` never needs
Python or manim — you only run anything in here when a diagram changes.

## Scenes

| Scene class | Output slug | Used on |
| --- | --- | --- |
| `SeamSystemsTH` / `EN` | `seam-systems-{th,en}` | `/blog/clip-lock-vs-snap-lock`, `/products`, `/en/products` |
| `PuFoamTH` / `EN` | `pu-foam-{th,en}` | `/blog/pu-foam-cold-storage`, `/products`, `/en/products` |
| `SheetThicknessTH` / `EN` | `sheet-thickness-{th,en}` | `/blog/choosing-roof-thickness`, `/specifications`, `/en/specifications` |

Each scene has a `*TH` and `*EN` subclass over a shared base; `self.t(th, en)`
picks the string. Layout is identical between the two, so a fix to the geometry
lands in both languages.

## Rendering

```sh
./render.sh                 # all six
./render.sh SeamSystemsTH   # just one
```

`render.sh` renders at 1920×1080/30fps, transcodes to h.264, and grabs the
closing frame as a WebP poster. Two encoding choices worth not re-litigating,
both measured on this content rather than assumed:

- **No webm/VP9 variant.** It came out ~30% *larger* than h.264 — flat-colour
  line art on white is x264's best case.
- **WebP posters, not JPEG.** Half the size of JPEG q3 with cleaner edges on
  Thai glyphs, and the poster is the one asset that always downloads.

To preview a single frame while iterating, `-s` skips to the end and writes a
PNG instead of a video:

```sh
manimgl scenes.py SeamSystemsTH -s -w
```

## Toolchain

This machine has no root access, so the whole stack lives in a micromamba
environment in `$HOME` rather than coming from apt:

```sh
micromamba create -n manim -c conda-forge \
  python=3.12 pango cairo pkg-config c-compiler ffmpeg glib pycairo manimpango
$HOME/micromamba/envs/manim/bin/python -m pip install -e $HOME/manim
```

Two things worth knowing if you rebuild it:

- **`manimpango` must come from conda-forge.** It ships no Linux wheels on
  PyPI at all, so pip always tries to compile it against Pango headers.
- **Thai fonts must be installed for the user**, not just linked by the site.
  Sarabun and Taviraj TTFs live in `~/.local/share/fonts` (`fc-cache -f` after
  copying). Without them manimpango silently falls back and the Thai text
  renders wrong.

`render.sh` finds the environment at `$HOME/micromamba/envs/manim`; override
with `MANIM_ENV=/path/to/env ./render.sh`.

## Conventions

- **Palette comes from `DESIGN.md`.** `theme.py` holds the OKLCH tokens
  verbatim and converts them to sRGB at import, so the videos cannot drift from
  the stylesheet. Change a token in `DESIGN.md`, change it in `theme.py`,
  re-render.
- **Always build text through `theme.label()` / `theme.title()`.** ManimGL
  1.7.2 constructs `Text` with `fill_opacity` 0, so passing `color=` alone
  produces invisible glyphs. The helpers set the fill explicitly.
- **Motion follows the `DESIGN.md` motion section** — fade plus a small rise,
  ease-out, no bounce or elastic easing.

## Accuracy

The cross-sections are schematic: they show how each system behaves, not
manufacturing dimensions. The only figures shown are ones already published in
`src/data/` (sheet gauges, insulation thickness). Nothing here states a U-value,
a span table, or a calculated deflection, and the deflection scene carries an
on-screen note saying the sag is a qualitative comparison. If real engineering
figures are ever added, they need to come from the manufacturer's data, not
from the animation.
