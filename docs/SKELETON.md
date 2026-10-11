# Skeleton

The skeleton enemy (`skeleton`, Characters → Enemies → Undead). Code: `src/characters/skeleton.js`.

Open it: `http://localhost:<port>/#/a/skeleton`

The skeleton archer (`skeleton-archer`) is the same build with `archer: true`: see `docs/SKELETON_ARCHER.md`. The skeletal warrior (`skeleton-warrior`) is the same build on a heavier body with a two-handed sword: see `docs/SKELETON_WARRIOR.md`.

## Options

| Option | Choices (default first) | Notes |
|---|---|---|
| Bones | Random, Bleached, Aged, Grimy, Dark, Reddish (fire) | Random rolls bleached, aged or grimy only; dark and reddish only when picked |
| Armour | Random, None, Leather, Chain mail, Plate | Random: no armour in about 1 in 6 looks |
| Armour pieces | Random, Few (2-3), Most (5-6), Full set (8) | Random rolls each of the eight areas on its own; the others wear that many areas, chosen by the seed |
| Weapon | Random, Small club, Crude axe, Crude sword | Right hand. The axe and sword are the goblin's (`gbWeapon`) |
| Eyes | Random, Pale blue glow, Green glow, Dark | Embers in the eye sockets (emissive, shows most at dusk and night) |

"New look" rolls the bone tint (bleached, aged, grimy) and which armour pieces are worn: helmet, chest, shoulders, bracers, gloves, belt, thighs, boots. Every worn piece is the same type. A chosen type always shows at least one piece.

| Piece | Leather | Chain mail | Plate |
|---|---|---|---|
| Helmet | cap with brow band, ear flaps and a ridge | coif over the top, sides and back, face open | kettle hat with a wide brim |
| Chest | cuirass with shoulder straps (lowest ribs show) | mail shirt with a ragged hem and short sleeves | breast and back plates on side straps, small pauldrons (ribs show at the sides) |
| Gloves | gloves with cuffs | mail mittens | gauntlets with a flared cuff |
| Boots | boots | mail chausses | greaves and sabatons |
| Shoulders | pad with a strap | mail mantle with a dark edge | three-layer pauldron with a rivet (replaces the breastplate's small pauldrons) |
| Bracers | laced leather bracer | mail sleeve | vambrace with a band and an elbow cop |
| Belt | belt with a buckle, front and side tassets | mail skirt band, mail over the thigh tops | fauld on a strap, front and side tassets |
| Thighs | guard with two straps | mail | cuisse with a band and a knee cop |

The belt's tassets (and the top of the mail skirt) sit on the thigh bones, so they swing with the legs instead of cutting into them.

The buckler is always in the left hand: plank columns, iron rim, boss in the middle.

## Body

`VB.skeleton` is the villager male's proportions (about 1.8 m) on the villager's 25 joints, so the warrior's IK clips fit unchanged. The foot bones end exactly on the IK sole (0.07 below the ankle, heel to toe), so planted feet touch the ground.

Each joint carries one named group with its bones: `bone_pelvis`, `bone_spine` (lumbar), `bone_ribs` (thoracic spine, sternum, five rib hoops, collarbones, shoulder blades), `bone_neck`, `bone_skull` (cranium, brow, eye sockets with embers, nose hole, cheekbones, upper teeth), `bone_jaw` (hanging slightly open), and per side `bone_humerus`, `bone_forearm` (radius and ulna), `bone_hand`, `bone_fingers`, `bone_tips`, `bone_thumb`, `bone_femur` (with kneecap), `bone_shin` (tibia and fibula), `bone_foot`. Armour is built inside the piece it covers. A heavier body type can widen every box of a piece across the bone (`B.boneK`, per piece name: `ribs`, `humerus`, `femur`…), so the bones and the armour on them grow thicker together. The weapon is `weapon_R` (right socket), the buckler `shield_L` (left socket). `post()` keeps both fists closed.

## Clips (27)

All warrior sword-and-shield clips except Cast spell (see `docs/WARRIOR.md`): Idle, Walk, Run, Idle/Walk/Run (war mode), Crouch, Crouch & move forward, Crouching attack, Jump, Jump & attack, Hit 1, Hit 2, Heavy hit, Shout, Roar, Taunt (weapon on buckler), Kick, Hip kick, One-handed attack 1 and 2, One-handed heavy attack, Low swing one-handed, Shield bash, Block with shield. Plus:

| Clip | Length | What it does |
|---|---|---|
| Death | about 1.5 s, once, held | Recoils, shudders and slumps at the knees; the weapon and buckler drop, then every bone comes loose, falls and lands in a pile (about 0.3–0.4 m high); the skull bounces once and rolls aside |
| Rise | 2.8 s, once | The pile trembles, the bones lift off top first (the skull rises first, weapon and buckler last) and fly back along an arc, then the body straightens out of the slump into the war stance |

Death ends exactly where Rise starts, and Rise ends on the first frame of Idle (war mode).

## How Death and Rise are built (`skDeathRise`)

Recorded on the model itself when it is built (about 0.1 s):

1. The war stance is read from the first frame of Idle (war mode). The recoil, shudder and slump are joint offsets on top of it (`gbDeathKeys`), plus a decaying jitter; each frame the body is dropped onto its lowest point.
2. At the release time each chunk (one bone piece, or a hand with its fingers) stores its transform, its box corners and its centre.
3. Resting pose per chunk: long bones lie flat along the direction they fell, the ribcage lies on its back, pelvis and spine lie flat, feet and skull stay upright, the buckler lies face up or down. Bones that started higher topple further from the middle; the skull rolls up to 0.4 m away.
4. Stacking: chunks land in order of starting height on a 1.5 cm height map. Every box is sampled with points, so each map column holds the real top of what lies there; each chunk tries 17 spots within 16 cm and settles in the lowest one. Nothing passes through what landed before it, and nothing goes below the ground.
5. Fall: gravity from the release point to the resting spot, turning to the resting orientation; the skull bounces once, other bones jolt slightly.
6. Rise: the same resting transforms with a growing tremble, then each chunk flies back (smoothstep with a 0.2 m arc) to where it belongs on the slumped body, top of the pile first; then the slump runs backwards into the stance.

Each frame the loose pieces are written in their parent joint's frame (`<piece>.position` / `.quaternion` tracks), so the clips play in the viewer and export to GLB like any other.

## Checks done

- Every clip sampled at 30 fps for 5 looks: no part below the ground (lowest point within 1 mm); planted feet on the ground in the war stance.
- Death pile top 0.31–0.42 m across looks; Rise ends on the war stance.
- Viewer: Death and Rise frame by frame, all armour types, Day and Night (eye glow).

`skDeathRise` also takes an optional fourth argument for other bodies that fall apart (the ghoul, see `docs/GHOUL.md`): its own slump keys and release time, a forward topple, rise timing and clip notes; pieces can join another piece's chunk (`userData.joinChunk`) and carry their own resting rule (`userData.restRule`). Without it the skeletons behave exactly as described above.
