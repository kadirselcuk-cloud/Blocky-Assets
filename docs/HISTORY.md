# Project history

What the owner (Kadir) asked for, in order, and the decisions that came out of it. Add one line per change at the bottom.

## Phase 1: library, buildings and villagers (smooth, then blocky)
- Built a browser asset library ("Asset Forge") with folder navigation and an orbit viewer with Day/Dusk/Night lighting, turntable, wireframe and reset.
- Made six medieval buildings, at first smooth: half-timbered cottage, stone croft, merchant's townhouse, woodcutter's cabin, thatched barn, staddle granary.
- Made villagers (man, woman, child) with a 25-joint rig, random looks via seed ("New look") and 13 shared animation clips, plus tool clips (Tool strike, Hammering) with workpieces and left-hand IK.
- **Converted everything to a blocky, voxel art style** with 16×16 pixel textures. The smooth versions are no longer shown.
- Fixed roof orientations, narrowed the cottage and croft, removed stone paths from yards, gave the barn an arched roof and attached the cart shafts.

## Phase 2: more buildings
- Forester, toolsmith, blacksmith (glowing ember forge), tavern, town hall (clock and bell tower).
- **Owner feedback:** "Don't get creative without asking." Restyled alternatives were rejected. Variants must keep the first house's walls and roof; only the layout changes. Variants are named `Name 1–5`.
- Cottage 1–5, Stone croft 1–5, Merchant's townhouse 1–5, Brick house 1–5. Brick house 1 is the former cottage design with the gabled bay.
- Batch of 21: market stall, manor, stone wall, stone tower, palisade, wooden and stone gates, barracks, stable, archery range, charcoal kiln, brick oven, windmill (turning sails), bakery, well, farmhouse, mine, mint, fishery, dock, shipyard.
- Nine more: hunter, gatherer, leatherworker, loom house, tailor, sheep fold, weaver, kitchen, smokehouse (rising smoke).
- **Owner feedback:** remove all crosses (banners became placeholders with a diamond, arrow slits became plain). Fix floating objects. Make pens and paddocks complete and large enough.
- Five market stalls with recolourable awnings (8 colours, a live swatch picker). Farmhouse 1–5.
- Terrain tiles (4 × 4 m): grass, long grass, dirt, sand, clay; dirt, paved and stone roads with corners, T-junctions and crossroads; water, shore, shore corners; river, river bend; wooden and stone bridges; farmland, gravel, plaza, forest floor. Realistic animated water reflects the sky.
- Buildings were grouped into categories: Housing, Resource collection, Production, Farming, Civil, Military, Management, plus Outlaw camp and Fences.
- Watermill, quarry, herb collector, clinic, sickhouse, boarding house, school, church (no crosses, gold ball finial).
- Wall and palisade corners, a wooden tower, a stand-alone farm field (options for size, crop and fence), a dock stockpile fill level, a ladder option (later removed by request).
- **Gates open and close with animation** (a live option, no rebuild): wooden gate, stone gate (portcullis and doors), and later the fence gates.

## Phase 3: characters
- 21 occupations for villagers, each with its own clothing, headwear, accessories and held tool. Boy and girl are separate assets.
- Outlaws: bandit, bandit archer, marauder (bigger, mail, fur cloak, back shield), poacher. Bandit camp pieces and a full camp.
- Animals with coat options and animations:
  - Farm: sheep, goat, cow, horse (body colour, marking colour, five marking patterns), donkey, pig, hen, rooster, dog.
  - Wildlife: wolf, deer, boar, bison, bear, rabbit, duck, crow, songbird.
  - Young: foal, lamb, kid, calf, piglet, chick, pup, wolf pup, fawn, boar piglet, bison calf, bear cub, donkey foal.
- **Owner feedback fixed:** gaits looked backwards (knees now bend on the forward swing); the horse rear's lower legs now fold down; ears, horns and antlers now point outward. Static animals were removed from pens, so pens are empty and animals are placed as live agents in scenes.

## Phase 4: environment and items
- Trees: pine, oak, birch in sapling, small (3–4 m) and large (7–9 m) sizes, with random heights and no floating leaves. Fruit trees: apple, pear, cherry, plum, with fruit or blossom.
- Rocks: granite, sandstone, basalt boulders with veins; gold, iron, tin, copper ore boulders and rocks. Plants: reeds (no border), bushes, berry bush (berries on leaf faces), ferns (connected fronds), flowers, mushrooms, stump, log.
- About 86 items: tools, weapons (sword guards kept short), armour, potions, containers with contents options (barrel, sack, crate, basket, chest), farm goods, furniture, lighting (flickering flames that light up at night).
- Fixes requested: books have 10 cover colours with covers larger than white pages; the round shield rim is smooth; contents sit below rims in hollow containers; table stretchers connect; stool legs are straight; the brazier legs are straight.

## Phase 5: scenes and tooling
- A scene system: a voxel heightmap terrain, static meshes merged by material for speed, animated agents (walkers, wanderers, workers).
- "Small farm village", then **redesigned as "Farm by the lake"** (`sc-farm`): wooded hill to the north, lake to the west, a packed farmstead around a plaza, a village street with drystone walls, pastures, a windmill on a mound, fields, a stable and paddock, 28 people and about 40 animals. Roads use the road tile assets.
- Fences: wooden and stone, straight, corner and gate (the gates are animated).
- Viewer controls: WASD to move, Q/E for down/up, Shift for speed; unlimited zoom-in.
- Exported as a local three.js project with a live-reload dev server, GLB export, an `AssetForge` API, a generated catalog and these docs.

## Change log (append here)
- 2026-10-10: project exported to a local repository (this structure).
- 2026-10-10: new scene "Mining village" (`sc-mining`, 200 × 200 m, no palisade): mountain to the north with the mine and quarry at its foot, a mining lane with donkey shelter, two charcoal kilns, stonemason and toolsmith; plaza with well, stalls, tavern, bakery, blacksmith and miners' boarding house; lake to the west with fishery and smokehouse; forest to the east with woodcutter, forester, hunter, herb collector and wildlife (deer, boar, wolves, bear, rabbits); 13 houses, coop, pig pen and five fields to the south. 50 people (30 adults, 20 children), about 450k triangles, 12 lights.
- 2026-10-10: Mining village revised: pine-only forest with crowns kept apart; mine and quarry cut into the mountain face (the quarry's own leafy trees swapped for pines in the scene); 10 houses in fenced gardens (wood for log houses, drystone for crofts, gates at the doors, vegetable patches, seating, firewood, fruit trees, flowers); 17 work and service buildings (added toolsmith on the lane, carpenter, clinic, herb collector moved); irregular lake shore; tighter layout.
- 2026-10-10: scene stats in the viewer (FPS, buildings and houses, population, animals, wildlife, trees) for all scenes. Performance: terrain now builds only visible faces (about 4× fewer triangles), and scene characters are folded into one skinned mesh each (draw calls in the big town 10,842 → 849). Leafy trees inside buildings are swapped for pines in the pine-forest scenes.
- 2026-10-10: new scene "Large fortified town" (`sc-town`, 300 × 300 m): raised plateau inside a wooden palisade with 8 towers and 3 gates; plaza, town hall, church, barracks, mint, kitchen, tavern, bakery, tailor, weaver, manor in a drystone enclosure, packed townhouses and brick houses, boarding house; outside cottages, school, clinic, 5 farmsteads, 2 windmills, orchards, stable and pens; sawmill and watermill on the river; pine forest east of the river with a woodsmen's hamlet and wildlife; sea shore with dock, shipyard, fishery; mountain with quarry. 40 houses, 120 people (80 adults, 40 children).
- 2026-10-10: new scene "Fortified city" (`sc-city`, 500 × 500 m): inner city on an irregular hill in stone walls that step with the ground (13 towers, 4 stone gates) with square, town hall, church, manor in a drystone enclosure, clinic, mint, tavern, barracks and townhouses; outer town in an irregular wooden palisade (24 towers, 5 gates); mining quarter with 4 mines and 2 quarries cut into the mountain; docks, shipyard and fisheries by the mountain shore; river with bridge, sawmills and watermills; pine forest with a woodsmen's settlement, wildlife, a lake and a remote bandit camp; large farms, orchards, windmills on hills and a pond. Curved road ribbons. 100 houses, 60 production and extraction, 10 military buildings; 250 adults and 100 children.
- 2026-10-10: performance for big scenes: static meshes merged in 128 m chunks, shadow box follows the camera, characters keep bones relative to themselves and only re-upload them when the pose changes, far characters animate less often and hide beyond 330 m, empty groups pruned after merging, point lights off in Day. The pine swap only replaces real leafy trees, scaled to their size.
