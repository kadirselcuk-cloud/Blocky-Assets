# Hell kit

Modular pieces for the burning lands of Hell (`hl-` ids, folder **Hell kit**), and the example scene **Infernal citadel** (`sc-hell`). Code: `src/environment/hell.js` (textures, materials, helpers, terrain, nature, props), `src/buildings/hell_fort.js` (the infernal citadel), `src/environment/hell_depths.js` (the infernal depths and the demon temple), `src/scenes/scenes8.js` (the scene). The Hell characters (imp, hell mound, succubus, oni, fiend, hellhound, Cerberus, efreet, Devil Lord, Demon Prince) live in `characters/enemies/hell`.

## The grid
Same rules as the wasteland and undead kits (see `docs/WASTELAND.md`): 4 m cells; tiles with their top at 0.8 m (place at y = −0.8); walls 4 m long between grid vertices, centred on the grid line, outside towards +z; corner pieces (towers, pillars, cave corners) on the vertices. Heights that line up: citadel wall walk 6.4 m (fang merlons to about 8.2 m), gatehouse 9.6 m, towers 11.2 m to the corbel, basalt cliffs and stairs 4 m, cave walls 6 m with the ceiling slab 6–6.8 m. Every piece sets `userData.groundKind = 'hell'`, so the viewer shows it on ash.

**No crosses:** runes are diamonds, chevrons, bars, eyes, triangles and zigzags (`hlGlyph`); the crack texture is four meandering veins that never meet; banners are blank crimson with a gold diamond on a Γ-shaped pole; the statue holds an axe beside him (no crossguard); road junctions are T-junctions only.

## Lava, fire and glow
- `LAVAMAT` is one emissive material; its texture slides slowly. Every asset with lava gets a `root.userData.tick` that calls `hlLavaTick()` (scenes call it from their own tick). The lava lies 0.3 m below the ground on lava tiles.
- Glowing materials follow the Day/Dusk/Night glow: `CRUSTMAT` (cracked crust with glowing veins), `HFLOORMAT` (black flagstones with glowing joints), `HRUNE` (runes, eyes, fire slits), `HEMBER`, `HVEIN`, `HCRYS` (blood crystals), `SOULMAT` (souls), `HEGG`.
- `hlFlame(par, L, x, y, z, size, fire, minLight)`: hellfire in four colours (`HL_FIRE`: orange, fel green, soul blue, violet; option `HL_FIRE_OPT` on braziers, columns, the portal and the summoning circle).
- Moving parts are baked clips: `hlIdle(root, parts, fn)` collects the Idle motion (bubbles, smoke, drops, souls, rings) and `hlDone(root, dur, defs)` bakes one Idle clip plus one-shot clips that keep the Idle motion running.

Helpers: `hlRoot`, `hlLava`, `hlSpike`, `hlHorn` (curves outwards), `hlChain` (alternating links, sag), `hlGlyph`, `hlSoul`, `hlBubbles`, `hlSmoke`, `hcFang` (fang merlon), `hcRunes` (iron rune band), `hcDemonHead`, `hlReskin` (turns wasteland cave pieces into magma caves), `hlCrystals`.

## Pieces
| Folder | Pieces |
|---|---|
| Terrain | brimstone, ash plain, glowing crust, sulphur crust, obsidian field, bone-strewn ash; lava, lava shore, inner and outer corner, lava river, river bend, lava pit; obsidian road (straight, corner, T); basalt cliff, outer and inner corner, cliff top; lavafall (feeds a lava river tile); basalt stairs (two cells, 4 m rise) |
| Nature | basalt columns, brimstone spire, obsidian shards, magma boulder, sulphur vent (fumes), fire geyser (Idle, Erupt), charred tree small/large, bone tree, fire lilies, burning ground, lava pool |
| Props | chain post, soul cage (Idle, Rattle), impaling spikes, skull pyre, hellfire brazier, soul lantern, hell gong (Strike), demon idol, rune stone, infernal portal (Idle, Open, Close), soul crystal, lava cauldron, hellforge, imp nest, horned skull pile, spike barrier (4 m), chain frame |
| Infernal citadel | wall, spiked wall, wall with fire slits, wall with lava spout, wall with doorway, breached wall; tower and fire pillar (vertex pieces); gatehouse (live portcullis); infernal keep (2 × 2 cells, door Open/Close); wall stairs (two cells); lava bridge (across a river tile); lava causeway (over open lava); citadel floor; infernal throne (Devil Lord or Demon Prince size); demon statue; infernal banner; spiked railing; fire column |
| Infernal depths | magma cave wall, inner and outer corner, ceiling, floor, tunnel, lavafall wall, chasm with chain bridge, blood crystals, magma stalagmites, magma column |
| Demon temple | summoning circle (Idle, Summon), brimstone altar, obsidian obelisk, soul pit (souls rise), lava fountain, pillar of faces |

## Building levels
- **Citadel:** citadel walls on the edges (mix the six types), towers on the corners, fire pillars on other vertices, the gatehouse in one slot, the keep in the courtyard, citadel floor tiles on the cells, wall stairs against an inner face. A lava moat of river tiles in front with the bridge at the gate.
- **Lava fields:** lava tiles for open lava, shore and corner tiles for the banks, the river and bend for channels, causeways across open lava, a lavafall at a basalt cliff feeding a river.
- **Depths:** magma floor tiles, magma walls on the room edges, corners on the vertices, ceilings, tunnels to join rooms, the chasm cell as an obstacle, a lavafall wall as a set piece.
- **Boss rooms:** the throne on citadel floor tiles (Devil Lord or Demon Prince size), the summoning circle with obelisks and the altar, the portal on a plaza.

## The scene `sc-hell` (100 × 100 m)
Grid lines on 4k + 2 (cell centres on multiples of 4, so the road runs along x = 0).
- **North:** the citadel on lines x −18…18, z −42…−14: lava-spout, spiked and slit walls on the front, a breach in the west wall, a doorway in the east wall, towers on the corners and fire pillars, the gatehouse (portcullis up), flagstone courtyard, the keep, the throne between fire columns and statues, banners, a summoning circle between obelisks, the hellforge, a lava cauldron, soul cages, a gong, a crystal. Basalt cliffs rise behind it.
- **Moat and road:** a lava river along x (z −10…−6) with the lava bridge at the gate; the obsidian road runs south with soul lanterns, braziers, spike barriers and spikes, branching east (z 24) and west (z 12).
- **South-west, the demon temple:** the infernal portal between obelisks, the altar, the soul pit, the lava fountain, the pillar of faces, an idol, rune stones, pyres, an imp nest.
- **South-east, the war pits:** a railed arena with chain posts, an idol, a chain frame, horned skulls, a cauldron, soul cages, burning ground, a second forge.
- **North-east:** a lava lake (crust floes) with fire geysers and a basalt island with a spire and obsidian shards.
- **Badlands:** brimstone, ash, sulphur, crust and obsidian ground; spires, basalt columns, shards, boulders, vents, lava pools, charred and bone trees, fire lilies, burning ground, skulls and spikes.
- **Inhabitants (20):** the Devil Lord by his throne; two fiends at the gate; an oni at the hellforge; a succubus at the summoning circle; imps flitting about the courtyard and the temple; Cerberus on the bridge with a hellhound lying beside it and another patrolling the road; two hell mounds sliding by the soul pit; a second succubus beckoning at the portal; an oni and a fiend in the war pits, a fiend patrolling, a hellhound; the efreet circling over the lava lake; the Demon Prince on the island. Every character is queued and joins after the scene is shown (the Demon Prince last, it takes the longest).
- **Lights (12):** the keep's beacon, the portal, the circle, the forges, the flames and braziers, by priority.

## Checks done
- Every `hl-` asset built in Node with every option value: no errors, every animation track finds its part, the ground covers every piece.
- Viewer: the pieces close up in Day, Dusk and Night; the scene from above and from several angles (gate, courtyard, temple, lava lake).
- Scene: about 208k triangles, about 460 draw calls before the characters, 12 point lights.
