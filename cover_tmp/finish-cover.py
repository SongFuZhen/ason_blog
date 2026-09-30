# -*- coding: utf-8 -*-
"""公众号封面定稿：去 Agnes 自带的米白画框 -> 背景校色到设计稿 hex -> 裁 900x383 -> 叠中文标题。

用法：
  python finish-cover.py --src raw.png --bg "#0E1626" --title "它开始动手了" --out cover_900x383.png

输出 --out（带标题）与 <out>_无字版.png。
"""
import argparse
import os

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

# ---- 可调常量 ----
W, H = 900, 383          # 公众号推文封面尺寸
TITLE_SIZE = 42
TITLE_TRACK = 5          # 字间距
TITLE_RIGHT = 40         # 右边距
TITLE_BOTTOM = 40        # 下边距
INK = (237, 230, 216)    # #EDE6D8 标题色
CREAM = np.array([175, 168, 150])   # 判定「米白画框」的阈值
DEF_FONT = 'C:/Windows/Fonts/NotoSerifSC-VF.ttf'


def hex2rgb(s):
    s = s.lstrip('#')
    return np.array([int(s[i:i + 2], 16) for i in (0, 2, 4)], dtype=np.float32)


def frame_thickness(a):
    """从四边中缝扫进去，找米白画框的厚度。"""
    h, w, _ = a.shape
    def scan(seq):
        for i, px in enumerate(seq):
            if not (px[0] > CREAM[0] and px[1] > CREAM[1] and px[2] > CREAM[2]):
                return i
        return 0
    return max(scan(a[h // 2, :w // 2]), scan(a[h // 2, ::-1][:w // 2]),
               scan(a[:h // 2, w // 2]), scan(a[::-1, w // 2][:h // 2]))


def kill_cream(im, band=120):
    """圆角画框残留：对角反射填充 + 只在填充区生效的羽化模糊（不能用固定盒子模糊，会留缝）。"""
    a = np.array(im).astype(np.float32)
    h, w, _ = a.shape
    cream = (a[:, :, 0] > CREAM[0]) & (a[:, :, 1] > CREAM[1]) & (a[:, :, 2] > CREAM[2])
    bm = np.zeros((h, w), bool)
    bm[:band, :] = bm[-band:, :] = True
    bm[:, :band] = bm[:, -band:] = True
    cream &= bm
    cream = np.array(Image.fromarray((cream * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(5))) > 127

    res = a.copy()
    s = min(160, max(40, min(h, w) // 4))
    boxes = [
        (0, 0, s, s, s, 2 * s, s, 2 * s),
        (w - s, 0, w, s, w - 2 * s, w - s, s, 2 * s),
        (0, h - s, s, h, s, 2 * s, h - 2 * s, h - s),
        (w - s, h - s, w, h, w - 2 * s, w - s, h - 2 * s, h - s),
    ]
    for (x0, y0, x1, y1, sx0, sx1, sy0, sy1) in boxes:
        src = a[sy0:sy1, sx0:sx1][::-1, ::-1]
        m = cream[y0:y1, x0:x1]
        if m.any() and src.shape[:2] == m.shape:
            res[y0:y1, x0:x1][m] = src[m]

    out = Image.fromarray(res.clip(0, 255).astype(np.uint8))
    soft = np.array(Image.fromarray((cream * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(5))).astype(np.float32) / 255
    blur = np.array(out.filter(ImageFilter.GaussianBlur(2.4))).astype(np.float32)
    soft = soft[:, :, None]
    return Image.fromarray((np.array(out).astype(np.float32) * (1 - soft) + blur * soft).clip(0, 255).astype(np.uint8)), int(cream.sum())


def modal_bg(a):
    """背景众数：只取暗像素，量化到 6 的倍数后取最高频，避开渐变与暗角干扰。"""
    lum = a.max(axis=2)
    m = a[(lum > 4) & (lum < 95)]
    if len(m) == 0:
        m = a[(lum >= 4) & (lum < 120)]
    q = (m // 6 * 6).astype(np.int32)
    keys, counts = np.unique(q, axis=0, return_counts=True)
    return keys[counts.argmax()].astype(np.float32)


def grade_bg(im, target):
    """按通道比例把背景拉到目标 hex；亮度斜坡保证只压背景、不动亮部元素。"""
    a = np.array(im).astype(np.float32)
    lum = a.max(axis=2)
    modal = modal_bg(a)
    scale = target / np.maximum(modal, 1)
    w = np.clip((150 - lum) / (150 - 70), 0, 1)[:, :, None]
    print(f'  背景众数 {tuple(int(v) for v in modal)} -> 目标 {tuple(int(v) for v in target)}  scale={np.round(scale, 2)}')
    return Image.fromarray((a * (1 - w * (1 - scale))).clip(0, 255).astype(np.uint8))


def calibrate(im, paper=None, accent=None):
    """自校准：把高亮元素（文字/线条/碎点）拉到 paper 色，把主色拉到 accent 色。
    都用「测中位/分位 -> 按比例或偏移修正」的方式做，保留纹理，不做整体调色。"""
    a = np.array(im).astype(np.float32)

    if paper is not None:
        hi = a[a.min(axis=2) > 170]
        if len(hi) > 200:
            cur = np.percentile(hi, 70, axis=0)
            sc = paper / np.maximum(cur, 1)
            minc = a.min(axis=2)
            w = np.clip((minc - 140) / 80, 0, 1)[:, :, None]
            a = a * (1 - w * (1 - sc))
            print(f'  高亮元素 {tuple(int(v) for v in cur)} -> {tuple(int(v) for v in paper)}')

    if accent is not None:
        r, g, b = a[:, :, 0], a[:, :, 1], a[:, :, 2]
        m = ((r > g + 40) & (r > b + 40) & (r > 110))
        if m.sum() > 200:
            cur = np.median(a[m], axis=0)
            wr = (np.clip((r - 80) / 80, 0, 1) * m * 0.5)[:, :, None]
            a = a + wr * (accent - cur)
            print(f'  主色 {tuple(int(v) for v in cur)} -> 校正向 {tuple(int(v) for v in accent)}（半程）')
    return Image.fromarray(a.clip(0, 255).astype(np.uint8))


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


def add_title(im, text, font_path):
    im = im.copy()
    f = ImageFont.truetype(font_path, TITLE_SIZE)
    d = ImageDraw.Draw(im)
    ws = [d.textlength(c, font=f) for c in text]
    x = im.width - TITLE_RIGHT - (sum(ws) + TITLE_TRACK * (len(text) - 1))
    asc, desc = f.getmetrics()
    y = im.height - TITLE_BOTTOM - (asc + desc)
    for c, cw in zip(text, ws):
        d.text((x, y), c, font=f, fill=INK)
        x += cw + TITLE_TRACK
    return im


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--src', required=True)
    ap.add_argument('--out', required=True)
    ap.add_argument('--title', default='')
    ap.add_argument('--bg', default='')
    ap.add_argument('--paper', default='')     # 高亮元素目标色，如 #EDE6D8
    ap.add_argument('--accent', default='')    # 主色目标色，如 #B03A2E
    ap.add_argument('--font', default=DEF_FONT)
    a = ap.parse_args()

    im = Image.open(a.src).convert('RGB')
    t = frame_thickness(np.array(im))
    print(f'画框厚度 {t}px，原图 {im.size}')
    im = im.crop((t + 3, t + 3, im.width - t - 3, im.height - t - 3))
    im, n = kill_cream(im)
    print(f'  填充米白像素 {n}')
    if a.bg:
        im = grade_bg(im, hex2rgb(a.bg))
    if a.paper or a.accent:
        im = calibrate(im, hex2rgb(a.paper) if a.paper else None,
                       hex2rgb(a.accent) if a.accent else None)
    cov = to_cover(im)
    cov.save(a.out)
    print(f'  输出 {a.out}  {cov.size}')

    if a.title:
        stem, ext = os.path.splitext(a.out)
        plain = f'{stem}_无字版{ext}'
        cov.save(plain)
        add_title(cov, a.title, a.font).save(a.out)
        print(f'  输出 {plain} / {a.out}（带标题「{a.title}」）')


if __name__ == '__main__':
    main()
