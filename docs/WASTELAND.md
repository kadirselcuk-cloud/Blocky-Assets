# Wasteland kit

Modular pieces for goblin and ogre country (`wl-` ids, folder **Wasteland kit**), and the example scene **Goblin wasteland** (`sc-wasteland`). Code: `src/environment/wasteland.js` (textures, helpers, terrain, nature, props), `src/buildings/ruins.js`, `src/buildings/goblin_fort.js`, `src/environment/cave.js`, `src/scenes/scenes6.js`.

## The grid (read this before building a level)
- **4 m cells**, the same as the terrain tiles. In `sc-wasteland` the grid lines are on multiples of 4 and cell centres at 4k + 2.
- **Tiles** (terrain, cave floor, flagstone floor) are 4 × 4 m with their top at 0.8 m, like every terrain tile: place them at y = −0.8 so the walking surface is y = 0.
- **Walls** are 4 m long from grid vertex to grid vertex, centred on the grid line, outside towards +z. Rotate by ±90° or 180° for the other sides (see the castle in `scenes6.js`: south 0, east +90°, north 180°, west −90°).
- Walls in a straight run butt together. **Where walls meet at an angle, put a corner piece on the vertex** (ruin pillar or tower stump, palisade corner post, cave corner): it hides the wall ends.
- Pieces that span two cells say so in their description (ruined keep 2 × 2, chieftain's longhut 2 × 1, ramp 1 × 2).
- Heights that line up: ruin wall walk 4.4 m (merlons to 5.6 m), palisade fighting platform and raised walkway 2.6 m, cave walls 6 m with the ceiling slab from 6 to 6.8 m, cliffs 4 m.
- Every piece sets `userData.groundKind = 'waste'`, so the viewer shows it on dusty ground.

## Pieces
| Folder | Pieces |
|---|---|
| Terrain | dusty ground, cracked earth, ash, dead grass, mud, rocky ground; dirt track (straight, corner, T, crossroads); cliff, cliff outer/inner corner, cliff top; rock ramp (two cells, 4 m rise) |
| Nature | dead tree small/large, burnt tree, thorn bush, dry grass, jagged boulder, rock spire, bog pool |
| Props | scattered bones, skull pile, beast skeleton, battlefield remains, broken cart, warning post, cairn |
| Ruined castle | castle wall, wall with slits, wall with window, wall with doorway, gateway, breached wall, tumbled wall, broken wall end (left/right); corner pillar, tower stump (vertex pieces); ruined keep; wall stairs; column (standing/broken/fallen); freestanding arch; rubble heap; headless statue; flagstone floor tile |
| Goblin fortress | palisade wall (trophies / plain / stakes in front), broken palisade, palisade with wall walk (ladder option), corner post, gate (live open/closed); watchtower, hut, chieftain's longhut, hide tent; skull totem, cauldron, drying rack, bone cage, loot heap, ragged banner, skull pikes, stake barricade, crude fence, raised walkway, bone throne (ogre or goblin size), goblin fire |
| Cave | cave mouth (hill with opening), cave wall, inner corner, outer corner, ceiling, floor, tunnel; stalagmites, rock column, glowing mushrooms, cave pool, ogre nest, rockfall |

**Condition** option on ruin pieces: Weathered, Cracked (dark crack chains, a chipped notch or missing merlon, loose stones at the foot), Mossy (moss caps on the tops, moss patches low on the faces, ivy, tufts), Cracked and mossy. Most pieces also have **New look** (seed).

## How the ruin walls are built
`ruGrid(par, columns, rows, G)` turns a cell grid (0.4 m columns × 0.4 m rows, `G(col,row)` true where there is stone) into boxes: horizontal runs per row, grown upwards. Row 0 is the plinth course (0.2 m thicker, darker). Box UVs use world offsets, so the brick pattern continues across boxes and across neighbouring walls. `ruWall({prof, hole, mound, sill})` builds every wall type from a column-height profile and an opening mask; wear is added by `ruApplyWear`. Merlons follow one rhythm (1.2 m merlon, 0.8 m gap, period 2 m) so it continues along a run.

Rubble mounds (`wlMound`) give each cell the same jitter on every layer, so a block only sits where there is a block (or a wall) under it.

## Ideas for levels and boss rooms
- Courtyard arena: a ring of ruin walls on a 6 × 5 cell grid with towers on the corners, the gateway as the entrance, the keep or the bone throne as the boss spot.
- Cave dungeon: cave floor tiles on the room cells, cave walls on the room edges, inner corners on the room corners, ceilings on top; tunnels to join rooms; the cave mouth as the way in from outside.
- Goblin fort: palisade walls with corner posts, a gate on one side, wall-walk segments with ladders, watchtowers in corner cells.
- Cliffs and the ramp make two-level maps (high ground 4 m up).

## The scene `sc-wasteland` (100 × 100 m)
- North: a rock ridge (terrain in 1 m cliff steps up to 9 m) with the cave mouth; outside it a nest, a fire, a skull pile, a rockfall, glowing mushrooms and a beast skeleton.
- Centre-east: the castle on lines x 4…28, z −20…0. Walls of every type and condition, tower stumps, an intact corner tower, broken pillars where a palisade replaces a missing wall, a breach fenced off with a palisade, stairs, the keep. The goblins hold it: wooden gate (open) behind the gateway, watchtower, two huts, cauldron, totem, banners, pikes, loot heap and the ogre-size bone throne on four flagstone tiles.
- West: the goblin war camp on lines x −36…−16, z 4…24: palisade with corner posts, wall walks and an open gate facing the track, two watchtowers, the chieftain's longhut, three huts, totem, fire, cauldron, rack, cage, junk heap, tent; pikes, barricades and a warning post outside; a warg pen to the south.
- A dirt track (track tiles on the grid) runs in from the south edge to the castle gate, with a T-junction to the camp gate.
- Badlands: dead and burnt trees, boulders, rock spires, thorns, dry grass, bones, two battlefields, a broken cart, a second beast skeleton, a bog.
- Terrain surfaces come from `sceneTerrain`'s new `extra` table (`SC_WASTE_SURF`): dust, cracked earth, dead grass, rock, ash, mud. They use metric side UVs (third entry), so tall cliff sides tile the texture every 0.8 m instead of stretching it.

**Inhabitants (23):** the two-headed ogre boss beside his throne with a collared warg lying at his feet; two hobgoblins guarding the castle gate; goblins at the cauldron, on both watchtowers, on a wall walk, at the camp fire, on patrol in the courtyard, round the camp plaza and up the track; two goblin shamans casting (castle totem, camp totem); a hobgoblin at the chieftain's door; two wargs in the pen; an ogre guarding the cave, the ogre magi casting beside the nest, a second ogre walking the old road from the cave to the castle and back; a troll wandering the badlands.

**Loading:** the static scene and the light characters build in about 2 s. The ogres, the ogre magi, the shamans and the boss need several seconds each to solve their clips (the boss about 15 s), so they are queued and join the scene one by one after it is on screen. If the viewer switches away first, the queue stops. GLB export of the scene contains the static geometry (as for every scene).

## Checks done
- Every `wl-` asset built in Node with every option value: no errors, the ground covers every piece.
- Viewer, Day / Dusk / Night; the scene from above and from several angles: the castle, the camp, the cave, the track.
- Scene: about 185k triangles, about 380 draw calls, 11 point lights; one frame (animation + render with shadows) about 15 ms.
