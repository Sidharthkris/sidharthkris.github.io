"""Renders the social card by running the real crowd model, so the picture on
LinkedIn is an actual frame of the simulation rather than a mock-up."""
from PIL import Image, ImageDraw, ImageFont
import json, os, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CACHE = os.path.join(ROOT, "node_modules/.cache")
FONTS = os.path.join(ROOT, "src/assets/fonts")

# The webfonts ship as woff2, which Pillow cannot read; unpack them once.
def as_ttf(stem):
    dst = os.path.join(CACHE, stem + ".ttf")
    if not os.path.exists(dst):
        try:
            from fontTools.ttLib import TTFont
        except ImportError:
            sys.exit("needs fonttools and brotli:  pip install fonttools brotli")
        f = TTFont(os.path.join(FONTS, stem + "-latin-wght-normal.woff2"))
        f.flavor = None
        os.makedirs(CACHE, exist_ok=True)
        f.save(dst)
    return dst

W, H = 1200, 630
GROUND, INK, MUTED, MUTED2 = "#0b1220", "#e8eef7", "#a3b1c9", "#8293ad"
SIGNAL, AGENT, AGENT2, CALM, ALARM = "#00e5a0", "#7c93ff", "#3ed9ff", "#9aa8c7", "#ff5e5b"
STRAT = {"follow-others": AGENT, "nearest-exit": AGENT2, "calm-and-orderly": CALM, "panic-rush": ALARM}

state = json.loads(subprocess.check_output(["node", os.path.join(CACHE, "og-state.mjs")], text=True))
layout, agents = state["layout"], state["agents"]

img = Image.new("RGBA", (W, H), GROUND)
d = ImageDraw.Draw(img, "RGBA")

sg    = lambda s: ImageFont.truetype(as_ttf("space-grotesk"), s)
mono  = lambda s: ImageFont.truetype(as_ttf("jetbrains-mono"), s)
inter = lambda s: ImageFont.truetype(as_ttf("inter"), s)

# --- fit the isometric hall into a target box on the right -------------------
hw, hd = layout["width"] / 2, layout["depth"] / 2
def raw(x, z):
    return ((x - z) * 0.72, (x + z) * 0.40)
pts = [raw(sx * hw, sz * hd) for sx in (-1, 1) for sz in (-1, 1)]
minx, maxx = min(p[0] for p in pts), max(p[0] for p in pts)
miny, maxy = min(p[1] for p in pts), max(p[1] for p in pts)

BOX = (520, 70, 1190, 600)           # left, top, right, bottom
scale = min((BOX[2] - BOX[0]) / (maxx - minx), (BOX[3] - BOX[1]) / (maxy - miny))
ox = BOX[0] + ((BOX[2] - BOX[0]) - (maxx - minx) * scale) / 2 - minx * scale
oy = BOX[1] + ((BOX[3] - BOX[1]) - (maxy - miny) * scale) / 2 - miny * scale
def proj(x, z):
    rx, ry = raw(x, z)
    return (ox + rx * scale, oy + ry * scale)

d.polygon([proj(-hw, -hd), proj(hw, -hd), proj(hw, hd), proj(-hw, hd)],
          fill=(22, 35, 61, 120), outline=(140, 170, 214, 80))

for x in range(int(-hw), int(hw) + 1, 5):
    d.line([proj(x, -hd), proj(x, hd)], fill=(140, 170, 214, 30), width=1)
for z in range(int(-hd), int(hd) + 1, 5):
    d.line([proj(-hw, z), proj(hw, z)], fill=(140, 170, 214, 30), width=1)

for x0, x1 in layout["blocks"]:
    for z in layout["rowZ"]:
        t = layout["rowThickness"] / 2
        d.polygon([proj(x0, z - t), proj(x1, z - t), proj(x1, z + t), proj(x0, z + t)],
                  fill=(27, 42, 71, 240), outline=(140, 170, 214, 95))

# exit sills, drawn thick enough to register at thumbnail size
for e in layout["exits"]:
    g = e["width"] / 0.5 / 2 + 1
    if e["side"] in ("W", "E"):
        a, b = proj(e["x"], e["z"] - g), proj(e["x"], e["z"] + g)
    else:
        a, b = proj(e["x"] - g, e["z"]), proj(e["x"] + g, e["z"])
    d.line([a, b], fill=(0, 229, 160, 90), width=16)
    d.line([a, b], fill=SIGNAL, width=6)

for a in sorted(agents, key=lambda a: a["x"] + a["z"]):
    px, py = proj(a["x"], a["z"])
    r = 4.2
    d.ellipse([px - r, py - r, px + r, py + r], fill=STRAT[a["strategy"]])

# --- gradient scrim, so type stays readable without hiding the hall ----------
scrim = Image.new("RGBA", (W, H), (0, 0, 0, 0))
sd = ImageDraw.Draw(scrim)
for x in range(760):
    alpha = 255 if x < 470 else int(255 * (1 - (x - 470) / 290) ** 1.5)
    sd.line([(x, 0), (x, H)], fill=(11, 18, 32, alpha))
img = Image.alpha_composite(img, scrim)
d = ImageDraw.Draw(img, "RGBA")

# --- type --------------------------------------------------------------------
d.ellipse([64, 78, 74, 88], fill=SIGNAL)
d.text((86, 71), "AGENT-BASED MODELLING", font=mono(15), fill=MUTED2)

d.text((64, 128), "Sidharth Vijayan", font=sg(60), fill=INK)
d.text((64, 196), "Krishnan", font=sg(60), fill=INK)
d.text((64, 288), "Java backend & full-stack engineer", font=inter(26), fill=MUTED)
d.text((64, 340), "Spring Boot · React · PostgreSQL · Three.js", font=mono(16), fill=MUTED2)

d.line([64, 416, 560, 416], fill=(140, 170, 214, 70), width=1)
for i, (k, v) in enumerate([("HALL LAYOUTS", "6"), ("BEHAVIOURS", "4"), ("MODEL RUNS", "9,000+")]):
    x = 64 + i * 172
    d.text((x, 440), k, font=mono(12), fill=MUTED2)
    d.text((x, 462), v, font=sg(32), fill=SIGNAL)

d.text((64, 548), "sidharthkris.github.io", font=mono(16), fill=MUTED)

out = os.path.join(ROOT, "public/og.png")
img.convert("RGB").save(out, "PNG", optimize=True)
print("wrote", out)
