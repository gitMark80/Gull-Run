# Gull Run Professional Art Pack

This pack establishes the production art direction for **Gull Run: Evolution**: bright creature-adventure artwork, anime-inspired cel shading, thick navy outlines, expressive characters, and readable silhouettes for mobile play.

## Contents

- `player/` — four aligned hero-gull flap frames, 384×512 transparent WebP
- `evolutions/` — nine evolution forms, 512×512 transparent WebP
- `enemies/` — five predator birds and one winged germ, 512×512 transparent WebP
- `items/` — seven food collectibles, 384×384 transparent WebP
- `obstacles/` — UFO, sailboat, speedboat, jet ski, and plane, 384×384 transparent WebP
- `backgrounds/coastal-world.webp` — 1774×887 optimized space-to-coast panorama
- `source/` — full-resolution WebP master sheets
- `preview-sprites.webp` — contact sheet for reviewing the complete sprite family

## Evolution order

1. Hatchling Gull
2. Young Gull
3. Seagull
4. Pelican
5. Osprey
6. Bald Eagle
7. Albatross
8. Pterodactyl
9. Sky Dragon

## Integration notes

- Keep the four hero frames on one animation anchor so the body does not jump while the wings flap.
- Mirror player and enemy sprites in code for left-facing movement rather than generating duplicate files.
- Use the WebP background at runtime, draw it with `cover`-style scaling, and preserve the central flight space.
- Use the transparent individual WebP files at runtime; retain the master sheets for future edits.
- The current game still draws its characters procedurally. These assets are prepared for the next integration pass.

## Rebuilding exports

Run:

```bash
python tools/build_art_pack.py
```

The script removes the presentation backgrounds, isolates each sprite, normalizes canvas sizes, and writes editable PNG exports from the WebP master sheets.
