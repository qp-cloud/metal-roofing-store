"""Explainer diagrams for the Meechai Steel blog articles.

Each article gets one scene, rendered twice (TH and EN) from a shared base class.

    manimgl scenes.py SeamSystemsTH -w

The cross-sections are schematic: they show how each system behaves, not
manufacturing dimensions. No load, temperature, or U-value figures are invented
here — the only numbers shown are the ones already published in src/data/.
"""

from __future__ import annotations

import os
import sys

import numpy as np
from manimlib import *  # noqa: F403

# manimgl imports the scene file by path without putting its directory on
# sys.path, so `theme` is not importable until we add it ourselves.
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from theme import *  # noqa: E402,F403


def centered_trapezoid(n_ribs: int, **kw) -> list[np.ndarray]:
    pts = trapezoid_points(n_ribs, **kw)
    mid = (pts[0][0] + pts[-1][0]) / 2
    return [p - np.array([mid, 0.0, 0.0]) for p in pts]


def crest_centers(pts: list[np.ndarray], rib_h: float) -> list[float]:
    """X positions of the rib tops in a trapezoid polyline."""
    xs = []
    for a, b in zip(pts, pts[1:]):
        if abs(a[1] - rib_h) < 1e-6 and abs(b[1] - rib_h) < 1e-6:
            xs.append((a[0] + b[0]) / 2)
    return xs


def check_mark(size: float = 0.34, color: str = SUCCESS) -> VMobject:
    pts = [
        np.array([-size, 0.05, 0.0]),
        np.array([-size * 0.25, -size * 0.55, 0.0]),
        np.array([size, size * 0.65, 0.0]),
    ]
    return polyline(pts, color=color, width=6)


# ============================================================ 1. seam systems

class SeamSystemsBase(StoreScene):
    """Bolt-type vs clip-lock vs snap-lock — where the leak path is."""

    RIB_H = 0.55

    def construct(self):
        head = self.show_title(
            "สกรูยึด · คลิปล็อก · สแนปล็อก",
            "Bolt-Type · Clip-Lock · Snap-Lock",
            "สามระบบยึดแผ่นหลังคา ต่างกันที่จุดรั่วซึม",
            "Three fastening systems, compared at the leak point",
        )
        self.footnote(
            "ภาพตัดขวางเชิงหลักการ ไม่ใช่แบบก่อสร้าง",
            "Schematic cross-sections, not construction drawings",
        )

        bolt = self.bolt_stage()
        self.play(FadeOut(bolt, shift=0.3 * DOWN), run_time=0.45)
        self.compare_stage()
        self.wait(0.3)

    # -- stage 1: the through-fastened system and its leak path ---------------

    def bolt_stage(self) -> VGroup:
        pts = centered_trapezoid(4, pitch=1.9, rib_h=self.RIB_H, top_w=0.55, slope=0.25)
        sheet = polyline(pts, color=ACCENT, width=5)
        sheet.shift(0.15 * DOWN)
        rail = purlin(width=9.6, y=-1.5)

        crests = crest_centers(pts, self.RIB_H)
        screws = VGroup(*[
            screw(x, self.RIB_H - 0.05, -1.35) for x in crests
        ])

        name = tag(self.t("ระบบยึดสกรู (Bolt Type)", "Bolt-Type"), color=ACCENT)
        name.next_to(rail, DOWN, buff=0.45)

        self.reveal(rail)
        self.play(ShowCreation(sheet), run_time=0.9, rate_func=rush_from)
        self.play(
            AnimationGroup(*[FadeIn(s, shift=0.2 * DOWN) for s in screws], lag_ratio=0.12),
            run_time=0.9,
        )
        self.reveal(name)

        stage = VGroup(rail, sheet, screws, name)

        # Rain: most of it runs off, one droplet finds a fastener hole.
        safe_x = [-3.1, -1.2, 1.2, 3.1]
        drops = VGroup(*[droplet() for _ in safe_x])
        for d, x in zip(drops, safe_x):
            d.move_to(np.array([x, 2.4, 0.0]))
        self.add(drops)
        self.play(
            AnimationGroup(*[
                d.animate.move_to(np.array([x, 0.02, 0.0]))
                for d, x in zip(drops, safe_x)
            ], lag_ratio=0.08),
            run_time=0.8, rate_func=rush_into,
        )

        leak_x = crests[1]
        leaker = droplet(color=WATER)
        leaker.move_to(np.array([leak_x, 2.4, 0.0]))
        self.add(leaker)
        self.play(
            leaker.animate.move_to(np.array([leak_x, self.RIB_H + 0.02, 0.0])),
            run_time=0.5, rate_func=rush_into,
        )

        ring = Circle(radius=0.42)
        ring.set_stroke(DANGER, 5).set_fill(opacity=0)
        ring.move_to(np.array([leak_x, self.RIB_H - 0.05, 0.0]))
        warn = label(
            self.t("ทุกรูสกรูคือจุดเสี่ยงรั่วซึม", "Every screw hole is a leak path"),
            size=30, color=DANGER,
        )
        warn.next_to(ring, UP, buff=0.35).shift(RIGHT * 1.4)

        self.play(ShowCreation(ring), leaker.animate.set_fill(DANGER, 1), run_time=0.5)
        self.reveal(warn)
        self.play(
            leaker.animate.move_to(np.array([leak_x, -2.35, 0.0])).set_opacity(0.35),
            run_time=1.0, rate_func=rush_into,
        )
        self.wait(0.5)

        stage.add(drops, leaker, ring, warn)
        return stage

    # -- stage 2: the two concealed-fastener systems, side by side ------------

    def compare_stage(self):
        left = self.seam_detail("clip", cx=-3.55)
        right = self.seam_detail("snap", cx=3.55)

        divider = Line(UP * 1.7, DOWN * 2.1, stroke_color=BORDER, stroke_width=3)

        self.reveal(divider, run_time=0.3)
        for group in (left, right):
            self.play(
                AnimationGroup(
                    FadeIn(group["rail"], shift=0.2 * UP),
                    ShowCreation(group["sheets"]),
                    FadeIn(group["fixing"], shift=0.2 * UP),
                    lag_ratio=0.4,
                ),
                run_time=1.3, rate_func=rush_from,
            )
            self.reveal(group["name"], group["note"])
            self.wait(0.9)

        # Neither system is penetrated: water crosses both seams and runs off
        # down the pan instead of finding a fastener hole.
        for group in (left, right):
            top = group["seam_top"]
            drop = droplet()
            drop.move_to(top + np.array([0.0, 1.7, 0.0]))
            self.add(drop)
            self.play(
                drop.animate.move_to(top),
                run_time=0.45, rate_func=rush_into,
            )
            self.play(
                drop.animate.move_to(group["shoulder"]),
                run_time=0.3,
            )
            self.play(
                drop.animate.move_to(group["runoff"]).set_opacity(0.25),
                run_time=0.6,
            )
            tick = check_mark()
            tick.move_to(top + np.array([0.0, 1.0, 0.0]))
            self.reveal(tick, run_time=0.3)

        verdict = label(
            self.t(
                "เน้นงบและความเร็ว → สแนปล็อก   |   ฝนชุก ต้องการความมั่นใจสูงสุด → คลิปล็อก",
                "Budget and speed → Snap-Lock   |   Heavy rain, maximum certainty → Clip-Lock",
            ),
            size=28, color=INK,
        )
        verdict.to_edge(DOWN, buff=0.75)
        self.reveal(verdict)
        self.wait(1.2)

    def seam_detail(self, kind: str, cx: float) -> dict:
        """One enlarged seam cross-section. `kind` is "clip" or "snap"."""
        y_pan = -0.15
        y_top = 1.25
        gap = 0.3          # half-width of the seam channel between the two pans
        pan_len = 2.2
        shift = np.array([cx, 0.0, 0.0])

        # Purlin top sits flush under the pans.
        rail = purlin(width=5.6, y=y_pan - 0.17, height=0.34)
        rail.shift(shift)

        left_sheet = polyline([
            np.array([-pan_len, y_pan, 0.0]),
            np.array([-gap, y_pan, 0.0]),
            np.array([-gap, y_top, 0.0]),
        ], color=ACCENT, width=5).shift(shift)

        right_sheet = polyline([
            np.array([pan_len, y_pan, 0.0]),
            np.array([gap, y_pan, 0.0]),
            np.array([gap, y_top, 0.0]),
        ], color=ACCENT, width=5).shift(shift)

        # The folded cap that closes the seam over both upstands.
        cap = polyline([
            np.array([-gap - 0.1, y_top, 0.0]),
            np.array([-gap - 0.1, y_top + 0.17, 0.0]),
            np.array([gap + 0.1, y_top + 0.17, 0.0]),
            np.array([gap + 0.1, y_top, 0.0]),
        ], color=ACCENT, width=5).shift(shift)

        sheets = VGroup(left_sheet, right_sheet, cap)

        # Both fixings land inside the seam channel (|x| < gap), so neither
        # one pierces a pan — that is the whole point of these systems.
        if kind == "clip":
            # A separate metal clip stands on the purlin between the two
            # upstands; the sheet legs hook over its head.
            clip = VGroup(
                Line(np.array([-0.2, y_pan, 0.0]), np.array([0.2, y_pan, 0.0]),
                     stroke_color=PRIMARY, stroke_width=5),
                Line(np.array([0.0, y_pan, 0.0]), np.array([0.0, y_top - 0.14, 0.0]),
                     stroke_color=PRIMARY, stroke_width=5),
                Line(np.array([-0.22, y_top - 0.14, 0.0]), np.array([0.22, y_top - 0.14, 0.0]),
                     stroke_color=PRIMARY, stroke_width=5),
            ).shift(shift)
            anchor = screw(cx, y_pan, y_pan - 0.42, color=PRIMARY)
            fixing = VGroup(clip, anchor)
            name_th, name_en = "ระบบคลิปล็อก (Clip-Lock)", "Clip-Lock"
            note_th = "คลิปโลหะซ่อนใต้รอยต่อ · ลาดเอียงต่ำ · กันน้ำดีเยี่ยม"
            note_en = "Hidden metal clip · low slope · excellent water resistance"
        else:
            # No separate clip: the panel's own concealed flange is fastened
            # down inside the channel, and the opposite leg snaps over it.
            flange = Line(
                np.array([gap, y_pan, 0.0]), np.array([-0.1, y_pan, 0.0]),
                stroke_color=PRIMARY, stroke_width=6,
            ).shift(shift)
            anchor = screw(cx + 0.08, y_pan, y_pan - 0.42, color=PRIMARY)
            fixing = VGroup(flange, anchor)
            name_th, name_en = "ระบบสแนปล็อก (Snap-Lock)", "Snap-Lock"
            note_th = "ล็อกตัวเอง ไม่ใช้คลิป · ติดตั้งเร็ว · ผิวเรียบ"
            note_en = "Self-locking, no clips · fast install · clean finish"

        name = tag(self.t(name_th, name_en), color=ACCENT, size=26)
        name.move_to(shift + np.array([0.0, -1.55, 0.0]))

        note = label(self.t(note_th, note_en), size=23, color=MUTED)
        note.move_to(shift + np.array([0.0, -2.15, 0.0]))

        return {
            "sheets": sheets,
            "fixing": fixing,
            "name": name,
            "note": note,
            "rail": rail,
            "seam_top": shift + np.array([0.0, y_top + 0.17, 0.0]),
            "shoulder": shift + np.array([gap + 0.1, y_top - 0.1, 0.0]),
            "runoff": shift + np.array([pan_len, y_pan + 0.05, 0.0]),
        }


class SeamSystemsTH(SeamSystemsBase):
    lang = "th"


class SeamSystemsEN(SeamSystemsBase):
    lang = "en"


# ================================================================ 2. PU foam

class PuFoamBase(StoreScene):
    """Why an insulated sandwich panel holds temperature and a bare sheet does not."""

    def construct(self):
        self.show_title(
            "แผ่นเปล่า vs แผ่นฉนวน PU Foam",
            "Bare Sheet vs PU Foam Panel",
            "ทำไมห้องเย็นและโรงงานควบคุมอุณหภูมิถึงเลือกแผ่นฉนวน",
            "Why cold storage and climate-controlled plants choose insulated panels",
        )
        self.footnote(
            "ภาพประกอบเชิงเปรียบเทียบ · ความหนาฉนวนตามสเปกสินค้า 25–50 มม.",
            "Illustrative comparison · insulation thickness per spec sheet, 25–50 mm",
        )

        bare = self.build_bare(cx=-3.55)
        panel = self.build_panel(cx=3.55)

        self.play(
            AnimationGroup(
                ShowCreation(bare["body"]),
                ShowCreation(panel["body"]),
                lag_ratio=0.25,
            ),
            run_time=1.1, rate_func=rush_from,
        )
        self.reveal(bare["name"], panel["name"])

        # Heat arrives at both roofs from above.
        # Sits in the empty channel between the two panels, clear of the subtitle.
        sun_label = label(self.t("ความร้อนจากภายนอก", "Heat from outside"), size=24, color=HEAT)
        sun_label.move_to(np.array([0.0, 1.5, 0.0]))
        self.reveal(sun_label)

        incoming = VGroup()
        for cx in (-3.55, 3.55):
            for dx in (-1.0, 0.0, 1.0):
                incoming.add(flux_arrow(
                    [cx + dx, 1.95, 0.0], [cx + dx, 1.05, 0.0], color=HEAT, width=5,
                ))
        self.play(
            AnimationGroup(*[GrowArrow(a) for a in incoming], lag_ratio=0.06),
            run_time=0.8,
        )
        self.wait(0.8)

        # Through the bare sheet it keeps going; the foam core stops most of it.
        through = VGroup(*[
            flux_arrow([-3.55 + dx, 0.75, 0.0], [-3.55 + dx, -0.55, 0.0], color=HEAT, width=5)
            for dx in (-1.0, 0.0, 1.0)
        ])
        # Stubs that die inside the foam core (0.59..1.01) rather than crossing
        # the bottom skin — the arrows must not contradict the caption.
        blocked = VGroup(*[
            flux_arrow([3.55 + dx, 0.97, 0.0], [3.55 + dx, 0.74, 0.0], color=HEAT, width=5)
            for dx in (-1.0, 0.0, 1.0)
        ])
        self.play(
            AnimationGroup(*[GrowArrow(a) for a in through], lag_ratio=0.06),
            AnimationGroup(*[GrowArrow(a) for a in blocked], lag_ratio=0.06),
            run_time=0.9,
        )
        self.wait(1.0)

        # Interior response.
        self.play(
            bare["interior"].animate.set_fill(HEAT, 0.5),
            panel["interior"].animate.set_fill(COOL, 0.45),
            run_time=1.2,
        )
        hot = label(self.t("ภายในร้อนตามแดด", "Interior tracks the sun"), size=26, color=DANGER)
        hot.move_to(np.array([-3.55, -1.55, 0.0]))
        cool = label(self.t("ภายในคงอุณหภูมิ", "Interior holds temperature"), size=26, color=SUCCESS)
        cool.move_to(np.array([3.55, -1.55, 0.0]))
        self.reveal(hot, cool)
        self.wait(1.2)

        outcome = label(
            self.t(
                "ลดภาระเครื่องทำความเย็น · ลดเสียงจากภายนอก · น้ำหนักเบากว่าผนังก่ออิฐ",
                "Less load on cooling plant · less outside noise · lighter than masonry",
            ),
            size=27, color=INK,
        )
        outcome.to_edge(DOWN, buff=1.2)
        self.reveal(outcome)
        self.wait(1.3)

    def build_bare(self, cx: float) -> dict:
        shift = np.array([cx, 0.0, 0.0])
        interior = Rectangle(width=4.6, height=1.55)
        interior.set_fill(SURFACE, 0.7).set_stroke(width=0)
        interior.move_to(shift + np.array([0.0, 0.05, 0.0]))
        self.add(interior)

        sheet = polyline(
            centered_trapezoid(3, pitch=1.5, rib_h=0.34, top_w=0.45, slope=0.2),
            color=ACCENT, width=5,
        ).shift(shift + np.array([0.0, 0.85, 0.0]))

        thickness = label(self.t("เหล็กชั้นเดียว", "Single steel skin"), size=22, color=MUTED)
        thickness.next_to(sheet, RIGHT, buff=0.2)

        name = tag(self.t("แผ่นเหล็กเปล่า", "Bare Metal Sheet"), color=ACCENT, size=26)
        name.move_to(shift + np.array([0.0, -1.05, 0.0]))
        return {"body": VGroup(sheet, thickness), "interior": interior, "name": name}

    def build_panel(self, cx: float) -> dict:
        shift = np.array([cx, 0.0, 0.0])
        interior = Rectangle(width=4.6, height=1.55)
        interior.set_fill(SURFACE, 0.7).set_stroke(width=0)
        interior.move_to(shift + np.array([0.0, 0.05, 0.0]))
        self.add(interior)

        core = Rectangle(width=4.4, height=0.42)
        core.set_fill(FOAM, 1).set_stroke(width=0)
        core.move_to(shift + np.array([0.0, 0.8, 0.0]))

        cells = VGroup()
        x = -2.05
        while x < 2.05:
            cells.add(Dot(radius=0.045).set_fill(BORDER, 1).set_stroke(width=0)
                      .move_to(shift + np.array([x, 0.8 + (0.09 if int(x * 5) % 2 else -0.09), 0.0])))
            x += 0.28
        top_skin = Line(
            shift + np.array([-2.2, 1.01, 0.0]), shift + np.array([2.2, 1.01, 0.0]),
            stroke_color=ACCENT, stroke_width=5,
        )
        bottom_skin = Line(
            shift + np.array([-2.2, 0.59, 0.0]), shift + np.array([2.2, 0.59, 0.0]),
            stroke_color=ACCENT, stroke_width=5,
        )

        brace = Line(
            shift + np.array([2.35, 0.59, 0.0]), shift + np.array([2.35, 1.01, 0.0]),
            stroke_color=MUTED, stroke_width=3,
        )
        gauge = label("25–50 mm", size=22, color=MUTED)
        gauge.next_to(brace, RIGHT, buff=0.12)

        name = tag(self.t("แผ่นฉนวน PU Foam", "PU Foam Panel"), color=PRIMARY, size=26)
        name.move_to(shift + np.array([0.0, -1.05, 0.0]))
        body = VGroup(core, cells, top_skin, bottom_skin, brace, gauge)
        return {"body": body, "interior": interior, "name": name}


class PuFoamTH(PuFoamBase):
    lang = "th"


class PuFoamEN(PuFoamBase):
    lang = "en"


# =========================================================== 3. sheet gauge

class SheetThicknessBase(StoreScene):
    """0.35 mm vs 0.47 mm — stiffness across a span, and where each one belongs."""

    def construct(self):
        self.show_title(
            "ความหนา 0.35 มม. กับ 0.47 มม.",
            "0.35 mm vs 0.47 mm Sheet",
            "ความหนาบอกความแข็งแรงในการรับน้ำหนักและอายุการใช้งาน",
            "Gauge drives load capacity and service life",
        )
        self.footnote(
            "การแอ่นตัวในภาพเป็นการเปรียบเทียบเชิงหลักการ ไม่ใช่ค่าคำนวณทางวิศวกรรม",
            "Deflection shown is a qualitative comparison, not an engineering calculation",
        )

        thin = self.build_span(cy=1.05, gauge="0.35", sag=0.5, color=ACCENT)
        thick = self.build_span(cy=-1.0, gauge="0.47", sag=0.17, color=PRIMARY)

        self.play(
            AnimationGroup(ShowCreation(thin["sheet"]), ShowCreation(thick["sheet"]), lag_ratio=0.3),
            run_time=1.0, rate_func=rush_from,
        )
        self.reveal(thin["name"], thick["name"], thin["supports"], thick["supports"])

        # Tucked beside the upper load arrow; the subtitle owns the top band.
        load = label(self.t("น้ำหนักกด เช่น คนขึ้นซ่อม หรือแรงลม",
                            "Applied load — maintenance traffic or wind"), size=24, color=MUTED)
        load.move_to(np.array([3.0, 1.8, 0.0]))
        self.reveal(load)
        self.wait(0.5)

        arrows = VGroup(
            flux_arrow([0.0, thin["y"] + 1.0, 0.0], [0.0, thin["y"] + 0.28, 0.0], color=MUTED, width=5),
            flux_arrow([0.0, thick["y"] + 1.0, 0.0], [0.0, thick["y"] + 0.28, 0.0], color=MUTED, width=5),
        )
        self.play(AnimationGroup(*[GrowArrow(a) for a in arrows], lag_ratio=0.15), run_time=0.7)
        self.wait(0.7)

        # Same load, different sag.
        self.play(
            Transform(thin["sheet"], thin["bent"]),
            Transform(thick["sheet"], thick["bent"]),
            run_time=1.4, rate_func=smooth,
        )
        self.reveal(thin["verdict"], thick["verdict"])
        self.wait(1.4)

        rec = VGroup(
            label(self.t("บ้านพักอาศัยทั่วไป  →  0.35–0.40 มม.",
                         "Housing  →  0.35–0.40 mm"), size=27, color=INK),
            label(self.t("โรงงาน โกดัง พื้นที่ลมแรง  →  0.47 มม. ขึ้นไป",
                         "Factories, warehouses, high wind  →  0.47 mm and up"), size=27, color=INK),
        ).arrange(DOWN, buff=0.24, aligned_edge=LEFT)
        rec.to_edge(DOWN, buff=1.15)
        self.reveal(*rec)
        self.wait(1.3)

    def build_span(self, cy: float, gauge: str, sag: float, color: str) -> dict:
        half = 3.1
        flat = [
            np.array([-half, cy, 0.0]),
            np.array([-half / 2, cy, 0.0]),
            np.array([0.0, cy, 0.0]),
            np.array([half / 2, cy, 0.0]),
            np.array([half, cy, 0.0]),
        ]
        sheet = polyline(flat, color=color, width=5)
        bent = polyline(bend(flat, sag), color=color, width=5)

        supports = VGroup()
        for x in (-half, half):
            block = Rectangle(width=0.42, height=0.5)
            block.set_fill(SURFACE, 1).set_stroke(MUTED, 2.5)
            block.move_to(np.array([x, cy - 0.3, 0.0]))
            supports.add(block)

        name = tag(f"{gauge} mm", color=color, size=26)
        name.move_to(np.array([-half - 1.35, cy, 0.0]))

        verdict = label(
            self.t("แอ่นตัวมากกว่า", "More sag") if sag > 0.3
            else self.t("แข็งแรงกว่า แอ่นน้อยกว่า", "Stiffer, less sag"),
            size=25,
            color=DANGER if sag > 0.3 else SUCCESS,
        )
        verdict.move_to(np.array([half + 1.75, cy - 0.45, 0.0]))

        return {
            "sheet": sheet, "bent": bent, "supports": supports,
            "name": name, "verdict": verdict, "y": cy,
        }


class SheetThicknessTH(SheetThicknessBase):
    lang = "th"


class SheetThicknessEN(SheetThicknessBase):
    lang = "en"
