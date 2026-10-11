# Skeleton archer

The skeleton archer enemy (`skeleton-archer`, Characters → Enemies → Undead). Code: `src/characters/skeleton_archer.js` (gear and clips) on top of `buildSkeleton` in `src/characters/skeleton.js` (`archer: true`).

Open it: `http://localhost:<port>/#/a/skeleton-archer`

## Options

| Option | Choices (default first) | Notes |
|---|---|---|
| Bones | Random, Bleached, Aged, Grimy, Dark, Reddish (fire) | Same as the skeleton |
| Armour | Random, None, Leather, Chain mail, Plate | Same pieces and rules as the skeleton (see `docs/SKELETON.md`) |
| Armour pieces | Random, Few (2-3), Most (5-6), Full set (8) | Same as the skeleton |
| Eyes | Random, Pale blue glow, Green glow, Dark | Same as the skeleton |

"New look" rolls bone tint, eyes and armour exactly like the skeleton. The archer gear is always the same.

## Gear

| Piece | Where | What |
|---|---|---|
| `bow_L` | left socket | 1.2 m self bow: limbs along the socket's z, curving back towards the string (+y), leather grip, horn tips |
| `string_top`, `string_bot` | children of the bow, at the tips | one box each, turned and scaled every frame so they meet at the nock point |
| `arrow_R` | right socket | shaft, flat iron head, one flat vane (no crossed fletching) |
| `quiver` | chest joint, on the back | leather tube with five fletched arrows, top behind the right shoulder. Its strap (over the right collarbone and across the chest) belongs to `bone_ribs` |

`skaGearPose(root)` places the string and the arrow for the current joints from three values:

- `pull` 0..1: the nock point moves from the string's rest to the right fist.
- `aw` 0..1: the arrow sits in the right fist (nock 10 cm behind the fist, along its grip axis) or lies nocked, from the nock through the arrow rest beside the grip.
- `av`: the arrow is shown or hidden (scaled to 0.001), hidden from the release until a new arrow comes out of the quiver.

`skaGearTracks` plays every clip on the model frame by frame, calls the gear pose and adds `position`, `quaternion` and `scale` tracks for the two string halves and the arrow, so the clips play in the viewer and export to GLB like any other.

## Clips (22)

| Clip | Length | What it does |
|---|---|---|
| Idle, Walk, Run | 4 s, 1.05 s, 0.68 s, loop | Relaxed, arrow in the quiver; the bow hangs in the left hand (upper limb forward and up), carried upright in the run |
| Idle (war mode) | 2.6 s, loop | Half turned, left side forward, arrow nocked, bow low and slightly drawn |
| Walk (war mode), Run (war mode) | 1.1 s, 0.72 s, loop | Same stance on the warrior's IK gait |
| Crouch, Crouch & move forward | 3 s, 1.3 s, loop | Low, arrow nocked |
| Aim (hold) | 2.4 s, loop | Full draw to the jaw, holding with a slight tremble |
| Shoot | 2.5 s | Raises the bow while drawing, aims, looses (string snaps back, the drawing hand flies past the ear), reaches over the shoulder, pulls a new arrow, nocks it |
| Quick shot | 1.6 s | Short snap draw, then a faster reload |
| Shoot upward | 2.7 s | Volley at about 40° up, leaning back, then reload |
| Crouching shot | 2.5 s | Shoots and reloads from the crouch |
| Bow bash | 1.5 s | Lets go of the string (arrow stays in the right fist), sweeps the bow across at head height, nocks again |
| Kick | 1.0 s | Front push kick |
| Jump | 1.3 s | Standing jump, arrow nocked |
| Hit 1, Hit 2, Heavy hit | 0.75, 0.8, 1.6 s | Rocks back; twists away; knocked back two steps |
| Roar | 2.8 s | Bow and arrow flung up, skull thrown back, then nocks again |
| Death, Rise | about 1.6 s held, 2.8 s | The skeleton's bone-pile death and rise. The arrow drops first, the bow a moment later, the quiver slides off behind and to the right of the pile and lies flat |

Every war-mode and one-shot clip starts and ends on the first frame of Idle (war mode); Rise ends on it exactly (gear included).

## How the clips are keyed

The IK clips use the warrior's `wrSolve`, but keys are written in aim terms (`skaClips`):

- `G` bow grip [x, y, z] (x, z relative to the hips), `A` aim [yaw°, pitch°], `dd` draw length (grip to fist, m), `cant` (°, top of the bow to the right).
- The right fist goes to the string: `G + 0.075·limb axis − dd·aim`, its grip axis along the limbs. `rh` / `rq` (0..1) send the position / direction to a free target `hR` / `hD` (reaching for the quiver, the bash, the roar).
- The bow hand is turned after the solve so the limbs follow the limb axis and the string faces the archer.
- `pull`, `aw`, `av` are keyed with the pose and drive the gear pass. Helpers: `shot(t, pose)` (release and follow-through) and `reload(t0, speed, dy, dpitch)` (quiver to string).
- Elbow and blade-roll continuity is the same as in `warriorClips`.

## Changes to the skeleton's Death and Rise (`skDeathRise`)

Shared with the skeleton and behaviour-neutral for it:

- Anything flagged `userData.gear` is dropped like the weapon and the buckler (`userData.dropDt` shifts its drop time).
- A piece with `userData.longAx` lies flat along that axis and slides off behind and to the right (the quiver).
- `root.userData.gearPose` is called on every recorded frame; `root.userData.gearTracks` lists extra objects whose transform and scale are recorded (the string halves, the arrow's scale).
- Attached pieces are recorded at their own local transform instead of identity, so the arrow stays nocked while it is still attached.

## Checks done

- All 22 clips sampled at 30 fps: no visible part below the ground (lowest point within 6 mm, as the skeleton's run).
- The arrow never passes through the body, skull or quiver in any clip (only the hands and the bow it rests on).
- Five looks (random, plate, chain mail, leather, none): Death pile 0.30–0.48 m high, Rise ends exactly on the war stance, gear included.
- Viewer: Aim, Shoot, Shoot upward, Crouching shot, Bow bash, Roar, Death and Rise frame by frame; Day, Dusk and Night.
