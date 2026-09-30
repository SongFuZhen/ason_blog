# -*- coding: utf-8 -*-
"""现代风公众号封面定稿：裁 900x383 -> 底部渐隐蒙版 -> 思源黑体白字标题 + 青色强调线。

不强行改底色，保留 Agnes 生成的现代渐变。

用法：
  python finish-modern.py --src raw.png --title "库在内网、人在外地，这端口咋通？" --out cover_modern.png
"""
import argparse
import os

import numpy as np
from PIL import Image, ImageDraw, ImageFont

W, H = 900, 383
TITLE_SIZE = 46
TRACK = 4
LEFT = 48
BOTTOM = 56
INK = (255, 255, 255)
ACCENT = (64, 224, 208)          # 青色强调线
FONT = 'C:/Windows/Fonts/NotoSansSC-VF.ttf'


def to_cover(im):
    w, h = im.size
    if w / h > W / H:
        need = h * W / H
        c = int((w - need) / 2)
        im = im.crop((c, 0, w - c, h))
    else:
        need = w * H / W
        c = int((h - need) / 2)
        im = im.crop((0, c, w, h - c))
    return im.resize((W, H), Image.LANCZOS)


def add_scrim(im):
    """底部渐隐蒙版：上透明 -> 下 ~0.5 黑，保证白字可读。"""
    a = np.array(im).astype(np.float32)
    h, w, _ = a.shape
    y = np.linspace(0, 1, h)[:, None]
    mask = np.clip((y - 0.45) / 0.55, 0, 1) * 0.5
    a = a * (1 - mask[:, :, None])
    return Image.fromarray(a.clip(0, 255).astype(np.uint8))


def add_title(im, text):
    im = im.copy()
    f = ImageFont.truetype(FONT, TITLE_SIZE)
    d = ImageDraw.Draw(im)
    ws = [d.textlength(c, font=f) for c in text]
    total = sum(ws) + TRACK * (len(text) - 1)
    x = LEFT
    base_y = H - BOTTOM - TITLE_SIZE
    # 青色强调线
    d.line([(LEFT, base_y - 18), (LEFT + 54, base_y - 18)], fill=ACCENT, width=4)
    # 阴影 + 正文（先画偏移暗色再画白，提升对比）
    for dx, dy, col in [(2, 2, (0, 0, 0)), (0, 0, INK)]:
        cx = x
        for c, cw in zip(text, ws):
            d.text((cx + dx, base_y + dy), c, font=f, fill=col)
            cx += cw + TRACK
    return im


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--src', required=True)
    ap.add_argument('--out', required=True)
    ap.add_argument('--title', default='')
    a = ap.parse_args()

    im = Image.open(a.src).convert('RGB')
    cov = to_cover(im)
    cov = add_scrim(cov)
    cov.save(a.out)
    print(f'  输出 {a.out}  {cov.size}')

    if a.title:
        stem, ext = os.path.splitext(a.out)
        plain = f'{stem}_无字版{ext}'
        cov.save(plain)
        add_title(cov, a.title).save(a.out)
        print(f'  输出 {plain} / {a.out}（带标题「{a.title}」）')


if __name__ == '__main__':
    main()
