# Undead kit

Modular pieces for graveyards, crypts and the necromancer's castle (`ud-` ids, folder **Undead kit**), and the example scene **Haunted necropolis** (`sc-necropolis`). Code: `src/environment/undead.js` (textures, materials, helpers, terrain, nature, graveyard), `src/buildings/crypt.js`, `src/buildings/necro_castle.js`, `src/scenes/scenes7.js`. It reuses the wasteland kit's helpers (`ruGrid`, wear, `wlMound`, skulls and bones), see `docs/WASTELAND.md`.

## The grid
Same rules as the wasteland kit: 4 m cells; tiles with their top at 0.8 m (place at y = −0.8); walls and fences 4 m long between grid vertices, centred on the grid line, outside towards +z; corner pieces on the vertices. Heights that line up: graveyard wall 1.3 m, iron fence 2.2 m, crypt walls 4.8 m with the vault on top (to 5.6 m), castle wall walk 7.2 m (merlons to 8.8 m), gatehouse 8.8 m. Every piece sets `userData.groundKind = 'grave'`, so the viewer shows it on dark grass.

**No crosses:** headstones are rounded, slab, pointed, obelisk (stone ball), skull-carved or broken; windows have a single mullion and leaded glass in irregular cells; portcullises have vertical bars only; vaults are barrel vaults with transverse ribs (no diagonal ribs); the round window is a filled disc; the scene's paths branch in staggered T-junctions so they never form a cross from above.

## Pieces
| Folder | Pieces |
|---|---|
| Terrain | dark grass, grave soil, bone-strewn ground; graveyard path (straight, corner, T, crossroads) |
| Nature | gnarled tree small/large (hanging moss), grave toadstools (violet glow), ground mist, black swamp pool, dead bramble |
| Graveyard | headstone (6 styles, condition), grave, open grave, chest tomb, mausoleum, grand mausoleum, crypt entrance, iron fence, fence pillar, iron gate (live), graveyard wall (intact/broken), lychgate, mourner statue (wings or not), lamp post (warm or green), gibbet, gravedigger's cart |
| Crypt | crypt wall (burial niches / ossuary / sconces / plain; condition), crypt doorway (optional portcullis), crypt pillar, crypt vault, crypt floor, crypt stairs, cobwebbed corner; sarcophagus (lid closed / ajar / pushed off), coffin (closed / open / standing), dark altar, candle cluster, candelabra, green brazier, ritual circle, ossuary shelf, bone heap |
| Necromancer's castle | castle wall (buttress option), wall with stained-glass window, gatehouse (live portcullis), castle tower, necromancer's keep (2 × 2 cells), rune obelisk, gargoyle, banner, throne, iron skull pikes |

Shared helpers: `udRoot`, `udFlame` (green fire with an always-on light), `udCandle`, `udHeadstone(par, style, r, wear, x, z, ry, lean)`, `udCoffin(par, state, r, …)`, `udMist(par, x, z, R, n, r)` (drifting soft planes, no shadows), `udWebAt` (cobweb sprite), `ncGargoyle`, `ncGlass`; materials `NFIRE`, `RUNEMAT`, `UDGLOW`, `NGLASS` (stained glass, glows at night), `MISTMAT`, `UDWATER`.

## Building rooms
- **Crypt:** crypt floor tiles on the cells, crypt walls on the edges (any mix of niches, ossuary, sconces), crypt pillars on the vertices, a vault on each cell, a doorway with a portcullis between rooms, stairs up to the crypt entrance on the surface. Furnish with sarcophagi, coffins, the altar, candles, braziers and a ritual circle for the boss.
- **Castle:** walls on the edges, towers on the corners, the gatehouse in one slot, the keep in the middle; obelisks, braziers, banners and the throne in the courtyard.
- **Graveyard:** wall or iron fence with pillars on the vertices, the lychgate or an iron gate in one slot, path tiles, then graves in rows (headstones at the −z end).

## The scene `sc-necropolis` (100 × 100 m)
Grid lines on 4k + 2 (cell centres on multiples of 4, so the path runs along x = 0).
- **North:** the castle on lines x −18…18, z −42…−18: windowed walls, six towers, the gatehouse (portcullis up), the keep with its glowing orb, a ritual circle between green braziers, an altar, rune obelisks, gargoyles, banners, standing coffins, a gibbet, pikes, a bone heap and an ossuary. A rock ridge rises behind it.
- **Centre:** the graveyard on lines x −26…26, z −6…26: mossy stone wall (broken in two places) with the lychgate in the south, iron fence on the other sides with a pillar on every vertex, an iron gate (open) towards the castle. The path runs from the lychgate to the castle gate with a branch west (z 8) and a branch east (z 16). Two mausoleums, the grand mausoleum, the crypt entrance, two open graves with a gravedigger's cart, mourner statues, lamp posts, gnarled trees, about 60 graves, headstones and chest tombs placed in rows round them, ground mist.
- **West:** two black swamp pools in mud with mist. **East:** a ruined chapel built from the wasteland ruin pieces (mossy walls, broken pillars, a fallen column) round a sarcophagus.
- **Inhabitants (18 undead + 4 crows):** the necromancer raising two skeletons (Rise) in the ritual circle, the lich on the keep balcony, two skeletal warriors at the gate, two skeleton archers on the wall walk, a skeleton patrolling the front; the vampire laughing on the grand mausoleum steps; two ghouls at the open graves and one walking the path; two vampire spawn at the crypt entrance; a wight walking the main path; a revenant pacing past the swamp; a skeleton in the chapel ruin; crows hopping about.
- **Lights (12):** the keep's orb, the braziers, the keep door, crypt entrance and grand mausoleum flames, the ritual circle and two lamps.
- **Loading:** every undead character takes 1–6 s to build its clips, so all of them are queued and join one by one after the scene is shown (the crows are there at once). About 35 s until the last one arrives.

## Checks done
- Every `ud-` asset built in Node with every option value: no errors, the ground covers every piece; every clip the scene uses exists.
- Viewer: the grand mausoleum, keep, crypt wall, gatehouse and crypt entrance close up; the scene from above and from several angles in Day, Dusk and Night.
- Scene: about 186k triangles, about 350 draw calls, 12 point lights; one frame (animation + render with shadows) about 20 ms.

## Catacombs and the depths (added later)
Folder **Catacombs & depths** (`src/buildings/catacombs.js`). Catacomb pieces are **whole 4 × 4 m cells**: floor (top at y = 0), walls and a low stepped vault (2.8–3.6 m). The passage is 2.4 m wide and centred, running along z; the 0.8 m side walls carry three tiers of burial niches (skulls, bundled bones, shrouds, cobwebs).
- Passage (optional green sconces), corner (+z edge to +x edge), T-junction (branch to +x), dead end (ossuary wall and a skull altar), stair down (3.2 m, one level, towards -z; the next cell's floor is at y = -3.2), gate (iron grille, Open/Close), flooded (black water, stepping stones), collapsed (rubble under a hole in the vault, a gap along one wall), chasm (8 m shaft with a green glow, narrow bridge).
- Well of souls (green wisps rise, Idle loop), bone throne for the lich, phylactery shrine (floating gem, Idle and Shatter), skull pillar (vertex piece faced with skulls), and a bone chandelier option on the crypt vault.
