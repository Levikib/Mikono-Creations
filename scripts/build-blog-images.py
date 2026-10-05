#!/usr/bin/env python3
"""Builds the journal images from content/journal/picks.mjs.

For each post it writes public/media/blog/<slug>/<slot>.jpg (a crop of a sourced photo or a Mikono photo) and
content/journal/images.generated.json (src, size, alt, credit). Photos marked "o" keep their original file.
Crops are plain crops (no resize distortion, no colour change). Run: python3 scripts/build-blog-images.py
"""
import json, re, subprocess, sys, os
from pathlib import Path
from PIL import Image, ImageOps

root = Path(__file__).resolve().parent.parent
picks_js = root / "content/journal/picks.mjs"
node = subprocess.run(["node", "-e", f"import('{picks_js}').then(m=>console.log(JSON.stringify(m.picks)))"], capture_output=True, text=True, check=True)
picks = json.loads(node.stdout)

manifest = json.loads((root / "media/blog-sourced/manifest.json").read_text())["images"]
photos_ts = (root / "content/photos.ts").read_text()
mk = {}
for m in re.finditer(r'^\s+(\w+): p\((S|M) \+ "([^"]+)", (\d+), (\d+), "([^"]*)", "([^"]*)"', photos_ts, re.M):
    pid, pre, f, w, h, cap, alt = m.groups()
    folder = "story" if pre == "S" else "moments"
    mk[pid] = {"path": root / "public/media" / folder / f, "src": f"/media/{folder}/{f}", "w": int(w), "h": int(h), "alt": alt, "cap": cap}
PR_ALT = {
    "giraffe/giraffe-yellow-brown-spots-01": "A crocheted yellow giraffe with brown spots and a white muzzle",
    "zebra/zebra-black-and-white-01": "Two crocheted black and white zebras standing on a wooden table",
    "bear/bear-blue-striped-top-01": "A blue crocheted bear in a striped top with a black nose",
    "butterfly/butterfly-blue-01": "A blue crocheted butterfly with yellow spots on its wings",
    "goose/goose-cream-01": "A cream crocheted goose with an orange beak",
    "turtle/turtle-mint-cream-01": "A crocheted turtle with a mint and cream shell",
    "rhino/rhino-light-blue-01": "Light blue crocheted rhinos with cream horns on a table",
}
RATIO = {"h": 16 / 9, "w": 3 / 2, "t": 4 / 5}
MAXW = {"h": 1600, "w": 1200, "t": 900}
out = {}
problems = []
for slug, entries in picks.items():
    if len(entries) != 4:
        problems.append(f"{slug}: {len(entries)} entries")
    (root / "public/media/blog" / slug).mkdir(parents=True, exist_ok=True)
    rows = []
    for i, (source, crop, caption) in enumerate(entries):
        slot = "hero" if i == 0 else f"inline-{i}"
        kind, _, ref = source.partition(":")
        if kind == "s":
            m = manifest[int(ref)]
            path = root / "media/blog-sourced" / m["file"]
            alt = m["alt"]
            credit = {"text": f'{m["attribution"]} ({m["licence"]})', "url": m["page_url"]}
            key = f"s{ref}"
            osrc = None
        elif kind == "mk":
            m = mk[ref]
            path, alt, osrc = m["path"], m["alt"], m["src"]
            credit = {"text": "Photo: Mikono Creations", "url": ""}
            key = f"mk{ref}"
        elif kind == "pr":
            path = root / "public/media/products" / f"{ref}.jpg"
            alt = PR_ALT[ref]
            credit = {"text": "Photo: Mikono Creations", "url": ""}
            key = f"pr{ref}"
            osrc = f"/media/products/{ref}.jpg"
        else:
            problems.append(f"{slug}: bad source {source}")
            continue
        mode, _, focal = crop.partition("@")
        im = Image.open(path)
        im = ImageOps.exif_transpose(im).convert("RGB")
        W, H = im.size
        if mode == "o":
            src, w, h = osrc, W, H
        else:
            fx, fy = (0.5, 0.5)
            if focal:
                fx, fy = (float(v) for v in focal.split(","))
            r = RATIO[mode]
            if W / H > r:
                cw, ch = round(H * r), H
            else:
                cw, ch = W, round(W / r)
            x = min(max(round(fx * W - cw / 2), 0), W - cw)
            y = min(max(round(fy * H - ch / 2), 0), H - ch)
            c = im.crop((x, y, x + cw, y + ch))
            if cw > MAXW[mode]:
                c = c.resize((MAXW[mode], round(MAXW[mode] / r)), Image.LANCZOS)
            dest = root / "public/media/blog" / slug / f"{slot}.jpg"
            c.save(dest, "JPEG", quality=86, optimize=True, progressive=True)
            src, w, h = f"/media/blog/{slug}/{slot}.jpg", c.size[0], c.size[1]
        rows.append({"slot": slot, "src": src, "w": w, "h": h, "alt": alt, "caption": caption, "credit": credit["text"], "creditUrl": credit["url"], "key": key})
    out[slug] = rows
(root / "content/journal/images.generated.json").write_text(json.dumps(out, indent=1, ensure_ascii=False) + "\n")
heroes = [v[0]["key"] for v in out.values()]
dup = {k for k in heroes if heroes.count(k) > 1}
if dup: problems.append(f"duplicate heroes: {sorted(dup)}")
for slug, rows in out.items():
    keys = [r["key"] for r in rows]
    if len(set(keys)) != len(keys): problems.append(f"{slug}: photo twice on a page {keys}")
print(f"{len(out)} posts, {sum(len(v) for v in out.values())} images")
if problems:
    print("PROBLEMS"); print("\n".join(problems)); sys.exit(1)
