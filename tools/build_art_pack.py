#!/usr/bin/env python3
"""Prepare generated Gull Run art sheets as transparent, named game assets."""

import argparse
from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage


ROOT = Path(__file__).resolve().parents[1]
PACK = ROOT / "assets" / "art-pack"
SOURCE = PACK / "source"


def open_source(stem: str) -> Image.Image:
    for suffix in (".png", ".webp"):
        path = SOURCE / f"{stem}{suffix}"
        if path.exists():
            return Image.open(path)
    raise FileNotFoundError(f"No source sheet found for {stem}")


def remove_smooth_background(image: Image.Image, step_threshold: int = 24) -> Image.Image:
    """Remove a smooth connected backdrop while preserving outlined figures."""
    rgba = np.asarray(image.convert("RGBA")).copy()
    rgb = rgba[:, :, :3].astype(np.int16)
    height, width = rgb.shape[:2]
    background = np.zeros((height, width), dtype=bool)
    queue = deque()

    def seed(y: int, x: int) -> None:
        if not background[y, x]:
            background[y, x] = True
            queue.append((y, x))

    for x in range(width):
        seed(0, x)
        seed(height - 1, x)
    for y in range(1, height - 1):
        seed(y, 0)
        seed(y, width - 1)

    while queue:
        y, x = queue.popleft()
        current = rgb[y, x]
        for ny, nx in ((y - 1, x), (y + 1, x), (y, x - 1), (y, x + 1)):
            if ny < 0 or ny >= height or nx < 0 or nx >= width or background[ny, nx]:
                continue
            if np.max(np.abs(rgb[ny, nx] - current)) <= step_threshold:
                background[ny, nx] = True
                queue.append((ny, nx))

    rgba[background, 3] = 0
    return Image.fromarray(rgba, "RGBA")


def split_grid(image: Image.Image, columns: int, rows: int):
    for row in range(rows):
        top = round(row * image.height / rows)
        bottom = round((row + 1) * image.height / rows)
        for column in range(columns):
            left = round(column * image.width / columns)
            right = round((column + 1) * image.width / columns)
            yield image.crop((left, top, right, bottom))


def fit_square(image: Image.Image, size: int, padding: int) -> Image.Image:
    alpha_box = image.getchannel("A").getbbox()
    if alpha_box is None:
        raise ValueError("Sprite cell contains no visible pixels")
    cropped = image.crop(alpha_box)
    max_size = size - padding * 2
    cropped.thumbnail((max_size, max_size), Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    x = (size - cropped.width) // 2
    y = (size - cropped.height) // 2
    canvas.alpha_composite(cropped, (x, y))
    return canvas


def keep_largest_component(image: Image.Image) -> Image.Image:
    rgba = np.asarray(image.convert("RGBA")).copy()
    labels, count = ndimage.label(rgba[:, :, 3] > 0)
    if count == 0:
        return image.convert("RGBA")
    sizes = np.bincount(labels.ravel())
    sizes[0] = 0
    rgba[labels != sizes.argmax(), 3] = 0
    return Image.fromarray(rgba, "RGBA")


def save_hero_frames() -> None:
    source = open_source("hero-gull-sheet").convert("RGBA")
    names = ["hero-gull-up", "hero-gull-rising", "hero-gull-level", "hero-gull-down"]
    for name, frame in zip(names, split_grid(source, 4, 1), strict=True):
        frame.resize((384, 512), Image.Resampling.LANCZOS).save(PACK / "player" / f"{name}.png")


def save_sheet_assets(
    source_name: str,
    alpha_name: str,
    columns: int,
    rows: int,
    names: list[str],
    destinations: list[str],
    size: int,
    background_threshold: int,
    largest_only: bool = False,
) -> None:
    source = open_source(source_name)
    transparent = remove_smooth_background(source, background_threshold)
    transparent.save(SOURCE / alpha_name)
    cells = list(split_grid(transparent, columns, rows))
    if len(cells) != len(names) or len(names) != len(destinations):
        raise ValueError(f"Grid metadata mismatch for {source_name}")
    for name, destination, cell in zip(names, destinations, cells, strict=True):
        if largest_only:
            cell = keep_largest_component(cell)
        fit_square(cell, size, max(20, size // 16)).save(PACK / destination / f"{name}.png")


def prepare_animation_source(source_name: str, background_threshold: int) -> Image.Image:
    source = open_source(source_name).convert("RGBA")
    if source.getchannel("A").getextrema()[0] < 255:
        return source
    return remove_smooth_background(source, background_threshold)


def save_animation_sheet(
    source_name: str,
    rows: list[str],
    destination: str,
    background_threshold: int,
) -> None:
    transparent = prepare_animation_source(source_name, background_threshold)
    transparent.save(SOURCE / f"{source_name}-alpha.png")
    poses = ["down", "level", "rising", "up"]
    cells = list(split_grid(transparent, 4, len(rows)))
    output = PACK / destination / "animations"
    output.mkdir(parents=True, exist_ok=True)
    for species, pose, cell in zip(
        (species for species in rows for _ in poses),
        poses * len(rows),
        cells,
        strict=True,
    ):
        frame = fit_square(keep_largest_component(cell), 512, 28)
        path = output / f"{species}-{pose}.webp"
        for _ in range(3):
            frame.save(path, "WEBP", lossless=True, method=4)
            if path.stat().st_size > 0:
                break
        else:
            raise OSError(f"Failed to encode {path}")


def build_animation_assets() -> None:
    save_animation_sheet(
        "hero-animation-sheet-4x4",
        ["hatchling-gull", "pelican", "osprey", "bald-eagle"],
        "player",
        24,
    )
    save_animation_sheet(
        "albatross-animation-sheet-4x1",
        ["albatross"],
        "player",
        12,
    )
    save_animation_sheet(
        "enemy-animation-sheet-4x4",
        ["crow", "heron", "hawk", "vulture"],
        "enemies",
        24,
    )


def main() -> None:
    save_hero_frames()

    save_sheet_assets(
        "evolution-sheet",
        "evolution-sheet-alpha.png",
        3,
        3,
        [
            "hatchling-gull",
            "young-gull",
            "seagull",
            "pelican",
            "osprey",
            "bald-eagle",
            "albatross",
            "pterodactyl",
            "sky-dragon",
        ],
        ["evolutions"] * 9,
        512,
        16,
        True,
    )

    build_animation_assets()

    save_sheet_assets(
        "enemy-sheet",
        "enemy-sheet-alpha.png",
        3,
        2,
        ["crow", "falcon", "heron", "hawk", "vulture", "winged-germ"],
        ["enemies"] * 6,
        512,
        8,
        True,
    )

    enemy_master = Image.open(SOURCE / "enemy-sheet-alpha.png").convert("RGBA")
    full_vulture = keep_largest_component(enemy_master.crop((440, 470, 1090, 1024)))
    fit_square(full_vulture, 512, 32).save(PACK / "enemies" / "vulture.png")

    save_sheet_assets(
        "props-sheet",
        "props-sheet-alpha.png",
        4,
        3,
        [
            "burger",
            "hotdog",
            "bread",
            "chicken",
            "ham",
            "pizza",
            "apple",
            "ufo",
            "sailboat",
            "speedboat",
            "jetski",
            "plane",
        ],
        ["items"] * 7 + ["obstacles"] * 5,
        384,
        8,
        True,
    )


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--animations-only", action="store_true")
    args = parser.parse_args()
    build_animation_assets() if args.animations_only else main()
