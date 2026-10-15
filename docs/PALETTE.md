# Palette

One colour system for the whole library, approved by the owner on 2026-10-16. The values live in `src/core/palette.js` (`PAL`), the colour sheet is `docs/palette/palette.html`, and `node tools/check-palette.mjs` checks every brute, undead, hell, effect and item file against the rules below.

## The tiers
Every colour belongs to one tier (saturation and brightness are HSB values):

| Tier | What | Limits |
|---|---|---|
| Matter | stone, wood, soil, skin, fur, bone, plain metal | S ≤ 65%, B 8–92% |
| Dye and metal | cloth, banners, roof tiles, war paint, gems, gold, bronze | S ≤ 75%, B ≤ 92% |
| Light | emissive only: flames, lava, spells, eyes, runes, rarity glows | a step of a `PAL` light ramp; core S ≤ 88% |

- No pure black or white. The darkest colour is `#16120e`. A white glow uses `PAL.glint` (`#f6f0e4`) or the hot step of its ramp. Black and white are allowed only in emissive maps (`#000000` = no glow) and as the white `emissive` that multiplies an `emissiveMap`.
- A light is always a 5-step ramp: hot (tinted white), light, core, deep, smoke. Eye, gem and fire option tables use the light and core steps of one ramp.

## One signature light per faction
- **Medieval village** (the reference, unchanged): hearth amber `PAL.hearth`.
- **Brutes and wasteland**: torch amber `PAL.amber` and `PAL.fire`. Olive, ochre, mud and stone; rags are faded dyes.
- **Undead**: grave-light green `PAL.necro` (necrotic fire, runes, default eyes). Other eye options use `soul` (blue), `violet`, `bloodGlow` (red) and `amber` (gold). Surfaces are cold and grey; robes are deep jewel tones.
- **Hell**: ember fire `PAL.fire` and `PAL.hellfire` (lava, braziers, demon eyes, efreet flames). Surfaces are near-black basalt and ash; the heat comes from light, not paint. Demon skins share `PAL.demonSkin` (an imp, a fiend and an efreet in crimson use the same `#9c3e3a`). Green hellfire uses `fel`.

## Shared materials
Iron, blackened iron, gold, bronze, silver, bone, leather, wood and blood each have one ramp in `PAL`. Use them instead of new near-duplicates.

## Spells and loot
The 12 spell schools in `SP_PAL` (spells.js) take steps 1–4 of their `PAL` ramp; the 5th entry stays the school's smoke or mist. Rarity colours are `PAL.rarity`; enchantments use the core of their school's ramp.

## Adding colours
1. Pick from `PAL` first. For a new light, use a ramp step; for matter or dye, stay inside the tier limits.
2. Run `node tools/check-palette.mjs` (add `-v` to list each colour out of tier). It must end with "All colours within the palette tiers".
