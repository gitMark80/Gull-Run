# Gull Run Professional Art Pack

This pack establishes the production art direction for **Gull Run: Evolution**: bright creature-adventure artwork, anime-inspired cel shading, thick navy outlines, expressive characters, and readable silhouettes for mobile play.

## Contents

- `player/` — hero-gull frames plus four-frame animations for every active hero bird
- `evolutions/` — evolution form portraits, 512×512 transparent WebP
- `enemies/` — enemy portraits plus four-frame animations for every active enemy bird
- `items/` — seven food collectibles, 384×384 transparent WebP
- `obstacles/` — UFO, sailboat, speedboat, jet ski, and plane, 384×384 transparent WebP
- `backgrounds/coastal-world.webp` — 1774×887 optimized space-to-coast panorama
- `source/` — full-resolution WebP master sheets
- `preview-sprites.webp` — contact sheet for reviewing the complete sprite family

## Evolution order

1. Hatchling Gull
2. Seagull
3. Pelican
4. Osprey
5. Bald Eagle
6. Albatross
7. Pterodactyl
8. Sky Dragon

## Integration notes

- Keep each four-frame animation on one anchor so the body does not jump while the wings flap.
- Mirror player and enemy sprites in code for left-facing movement rather than generating duplicate files.
- The game maps the panorama's space, sky, ocean, and shore bands to the matching world zones.
- Use the transparent individual WebP files at runtime; retain the master sheets for future edits.
- Runtime outlines are generated from sprite alpha so green/red feedback hugs each silhouette.
- Young Gull and Falcon art remain as archived pack options but are not used by the active game.

## Rebuilding exports

Run:

```bash
python tools/build_art_pack.py
```

The script removes presentation backgrounds, isolates sprites, normalizes canvas sizes, and rebuilds both the original exports and four-frame animation WebPs. Use `--animations-only` to rebuild only the new animation set.
