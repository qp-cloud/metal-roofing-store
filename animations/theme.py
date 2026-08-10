"""Shared palette, typography, and drawing helpers for the Meechai Steel diagrams.

The palette below is the OKLCH token set from DESIGN.md, kept verbatim and
converted to sRGB here so the videos and the stylesheet cannot drift apart.
If a token changes in DESIGN.md, change it here and re-render.
"""

from __future__ import annotations

import math

import numpy as np
from manimlib import *  # noqa: F403


# ---------------------------------------------------------------- palette ---

def oklch(L: float, C: float, h_deg: float) -> str:
    """Convert an OKLCH triple to a #RRGGBB string (sRGB, gamut-clipped)."""
    h = math.radians(h_deg)
    a, b = C * math.cos(h), C * math.sin(h)
    l_ = L + 0.3963377774 * a + 0.2158037573 * b
    m_ = L - 0.1055613458 * a - 0.0638541728 * b
    s_ = L - 0.0894841775 * a - 1.2914855480 * b
    l, m, s = l_ ** 3, m_ ** 3, s_ ** 3
    r = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s
    g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s
    bl = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s

    def enc(u: float) -> int:
        u = min(1.0, max(0.0, u))
        u = 12.92 * u if u <= 0.0031308 else 1.055 * (u ** (1 / 2.4)) - 0.055
        return round(u * 255)

    return "#{:02X}{:02X}{:02X}".format(enc(r), enc(g), enc(bl))


# Tokens copied from DESIGN.md.
BG = oklch(1.000, 0.000, 0)        # #FFFFFF
SURFACE = oklch(0.965, 0.004, 250)  # #F1F4F6
INK = oklch(0.220, 0.010, 30)       # #1F1918
MUTED = oklch(0.480, 0.006, 30)     # #615C5C
PRIMARY = oklch(0.550, 0.160, 32)   # #BD432F  red-oxide
ACCENT = oklch(0.280, 0.060, 240)   # #042C43  galvanized steel-blue
BORDER = oklch(0.880, 0.006, 250)   # #D5D8DB
SUCCESS = oklch(0.560, 0.130, 145)
DANGER = oklch(0.550, 0.180, 25)

# Diagram-only extensions, built on the same hue axes so they sit in-family.
WATER = oklch(0.620, 0.110, 240)    # droplets / run-off
HEAT = oklch(0.640, 0.170, 40)      # heat flux arrows
COOL = oklch(0.720, 0.070, 230)     # conditioned interior
STEEL = oklch(0.760, 0.008, 250)    # sheet metal fill
FOAM = oklch(0.930, 0.020, 90)      # PU foam core

FONT_DISPLAY = "Taviraj"
FONT_BODY = "Sarabun"


# ------------------------------------------------------------- typography ---

def label(text: str, size: int = 34, color: str = INK, font: str = FONT_BODY) -> Text:
    """Text with fill applied explicitly.

    ManimGL 1.7.2 constructs Text with fill_opacity 0, so passing `color=` alone
    yields invisible glyphs. Every caller must go through this helper.
    """
    t = Text(text, font=font, font_size=size)
    t.set_fill(color, 1).set_stroke(width=0)
    return t


def title(text: str, size: int = 46, color: str = INK) -> Text:
    return label(text, size=size, color=color, font=FONT_DISPLAY)


def tag(text: str, color: str = ACCENT, size: int = 28, pad: float = 0.22) -> VGroup:
    """A small filled chip — mirrors the spec-table header treatment."""
    txt = label(text, size=size, color=BG)
    box = RoundedRectangle(
        width=txt.get_width() + 2 * pad,
        height=txt.get_height() + 1.35 * pad,
        corner_radius=0.09,
    )
    box.set_fill(color, 1).set_stroke(width=0)
    txt.move_to(box)
    return VGroup(box, txt)


# ---------------------------------------------------------------- geometry ---

def trapezoid_points(
    n_ribs: int,
    x0: float = 0.0,
    y: float = 0.0,
    pitch: float = 1.5,
    rib_h: float = 0.5,
    top_w: float = 0.5,
    slope: float = 0.2,
) -> list[np.ndarray]:
    """Polyline for a trapezoidal (corrugated) roofing profile, valley-first."""
    flat = pitch - top_w - 2 * slope
    pts = [np.array([x0, y, 0.0])]
    x = x0
    for _ in range(n_ribs):
        x += flat
        pts.append(np.array([x, y, 0.0]))
        x += slope
        pts.append(np.array([x, y + rib_h, 0.0]))
        x += top_w
        pts.append(np.array([x, y + rib_h, 0.0]))
        x += slope
        pts.append(np.array([x, y, 0.0]))
    x += flat
    pts.append(np.array([x, y, 0.0]))
    return pts


def polyline(points, color: str = ACCENT, width: float = 5.0) -> VMobject:
    m = VMobject()
    m.set_points_as_corners(points)
    m.set_stroke(color, width).set_fill(opacity=0)
    return m


def seam_pan(
    width: float,
    x0: float = 0.0,
    y: float = 0.0,
    rib_h: float = 0.85,
    hook: float = 0.18,
    color: str = ACCENT,
    stroke: float = 5.0,
) -> VMobject:
    """A standing-seam pan: flat tray with an upstand and return hook each side."""
    pts = [
        np.array([x0 - hook, y + rib_h - 0.14, 0.0]),
        np.array([x0, y + rib_h, 0.0]),
        np.array([x0, y, 0.0]),
        np.array([x0 + width, y, 0.0]),
        np.array([x0 + width, y + rib_h, 0.0]),
        np.array([x0 + width + hook, y + rib_h - 0.14, 0.0]),
    ]
    return polyline(pts, color=color, width=stroke)


def purlin(width: float = 9.0, y: float = -1.35, height: float = 0.38) -> VGroup:
    """The structural member the sheets fasten to (แป)."""
    bar = Rectangle(width=width, height=height)
    bar.set_fill(SURFACE, 1).set_stroke(MUTED, 2.5)
    bar.move_to(np.array([0.0, y, 0.0]))
    hatch = VGroup()
    step = 0.42
    x = -width / 2 + step / 2
    while x < width / 2:
        hatch.add(Line(
            np.array([x, y - height / 2, 0.0]),
            np.array([x + 0.16, y + height / 2, 0.0]),
            stroke_color=BORDER, stroke_width=2,
        ))
        x += step
    return VGroup(bar, hatch)


def screw(x: float, y_top: float, y_bottom: float, color: str = MUTED) -> VGroup:
    """A through-fastener: head, shank, and washer."""
    shank = Line(
        np.array([x, y_top, 0.0]), np.array([x, y_bottom, 0.0]),
        stroke_color=color, stroke_width=6,
    )
    head = Rectangle(width=0.3, height=0.13)
    head.set_fill(color, 1).set_stroke(width=0)
    head.move_to(np.array([x, y_top, 0.0]))
    washer = Line(
        np.array([x - 0.19, y_top - 0.1, 0.0]),
        np.array([x + 0.19, y_top - 0.1, 0.0]),
        stroke_color=color, stroke_width=4,
    )
    return VGroup(shank, head, washer)


def droplet(radius: float = 0.085, color: str = WATER) -> Dot:
    d = Dot(radius=radius)
    d.set_fill(color, 1).set_stroke(width=0)
    return d


def flux_arrow(start, end, color: str = HEAT, width: float = 5.0) -> Arrow:
    a = Arrow(
        np.array(start, dtype=float), np.array(end, dtype=float),
        buff=0, thickness=width,
    )
    a.set_fill(color, 1).set_stroke(color, 0)
    return a


def bend(points: list[np.ndarray], sag: float) -> list[np.ndarray]:
    """Push a horizontal run into a parabolic sag — illustrative deflection only."""
    xs = [p[0] for p in points]
    x_min, x_max = min(xs), max(xs)
    span = max(x_max - x_min, 1e-6)
    out = []
    for p in points:
        t = (p[0] - x_min) / span          # 0..1 across the span
        drop = sag * 4 * t * (1 - t)       # zero at supports, max at midspan
        out.append(np.array([p[0], p[1] - drop, p[2]]))
    return out


# ------------------------------------------------------------------ scene ---

class StoreScene(Scene):
    """Base scene: white ground, house typography, DESIGN.md motion rules."""

    default_camera_config = dict(background_color=BG)

    # DESIGN.md: fade + small rise, ease-out, 300-400ms, no bounce.
    REVEAL = 0.4
    RISE = 0.25 * UP

    lang = "th"

    def t(self, th: str, en: str) -> str:
        return th if self.lang == "th" else en

    def show_title(self, th: str, en: str, sub_th: str = "", sub_en: str = ""):
        head = title(self.t(th, en), size=46)
        head.to_edge(UP, buff=0.55)
        rule = Line(LEFT * 1.1, RIGHT * 1.1, stroke_color=PRIMARY, stroke_width=5)
        rule.next_to(head, DOWN, buff=0.22)
        self.play(FadeIn(head, shift=self.RISE), run_time=self.REVEAL, rate_func=rush_from)
        self.play(ShowCreation(rule), run_time=0.3)
        group = VGroup(head, rule)
        if sub_th or sub_en:
            sub = label(self.t(sub_th, sub_en), size=28, color=MUTED)
            sub.next_to(rule, DOWN, buff=0.3)
            self.play(FadeIn(sub, shift=self.RISE), run_time=self.REVEAL, rate_func=rush_from)
            group.add(sub)
        return group

    def footnote(self, th: str, en: str):
        note = label(self.t(th, en), size=20, color=MUTED)
        note.to_corner(DL, buff=0.35)
        self.add(note)
        return note

    def reveal(self, *mobs, shift=None, run_time=None):
        self.play(
            *[FadeIn(m, shift=self.RISE if shift is None else shift) for m in mobs],
            run_time=self.REVEAL if run_time is None else run_time,
            rate_func=rush_from,
        )
