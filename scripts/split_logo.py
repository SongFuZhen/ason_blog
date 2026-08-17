"""
Split the ASON logo image into separate components:
- logo-symbol.png: The brush-style A symbol with the golden dot
- logo-text.png: The "ASON" brand name
- logo-slogan-en.png: "A Sense Of Now"
- logo-slogan-cn.png: "从现在做起，永远不迟。"
- logo-full.png: Original full image

Usage:
    python scripts/split_logo.py <input_image_path> [--output-dir <output_dir>]
"""

import argparse
import os
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("Error: Pillow is required. Install it with: pip install Pillow")
    exit(1)


def split_logo(input_path: str, output_dir: str) -> None:
    img = Image.open(input_path)
    w, h = img.size
    print(f"Input image size: {w} x {h}")

    # Define crop regions (top, bottom) as percentages of height
    # Based on visual analysis of the ASON logo layout
    regions = {
        "logo-symbol.png": (0.10, 0.52),      # Mountain/A symbol + golden dot
        "logo-text.png": (0.52, 0.65),          # "ASON" brand name
        "logo-slogan-en.png": (0.65, 0.73),     # "A Sense Of Now"
        "logo-slogan-cn.png": (0.73, 0.85),     # "从现在做起，永远不迟。"
    }

    os.makedirs(output_dir, exist_ok=True)

    for filename, (top_pct, bottom_pct) in regions.items():
        top = int(h * top_pct)
        bottom = int(h * bottom_pct)
        # Add small padding
        padding = int(h * 0.01)
        top = max(0, top - padding)
        bottom = min(h, bottom + padding)

        cropped = img.crop((0, top, w, bottom))
        output_path = os.path.join(output_dir, filename)
        cropped.save(output_path, "PNG")
        print(f"Saved: {output_path}  ({cropped.size[0]}x{cropped.size[1]})")

    # Also save a transparent version of just the symbol
    symbol_top = int(h * 0.10)
    symbol_bottom = int(h * 0.52)
    symbol_img = img.crop((0, symbol_top, w, symbol_bottom))

    # Attempt to remove white background
    symbol_transparent = symbol_img.convert("RGBA")
    data = symbol_transparent.getdata()
    new_data = []
    threshold = 240
    for item in data:
        if item[0] > threshold and item[1] > threshold and item[2] > threshold:
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)
    symbol_transparent.putdata(new_data)
    transparent_path = os.path.join(output_dir, "logo-symbol-transparent.png")
    symbol_transparent.save(transparent_path, "PNG")
    print(f"Saved: {transparent_path}  ({symbol_transparent.size[0]}x{symbol_transparent.size[1]})")

    # Save full copy
    full_path = os.path.join(output_dir, "logo-full.png")
    img.save(full_path, "PNG")
    print(f"Saved: {full_path}  (full copy)")

    print("\nDone! All components saved to:", output_dir)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Split ASON logo into components")
    parser.add_argument("input", help="Path to the input logo image")
    parser.add_argument(
        "--output-dir",
        default="public/static/images/logo",
        help="Output directory (default: public/static/images/logo)",
    )
    args = parser.parse_args()
    split_logo(args.input, args.output_dir)
