# Cerberus

Cerberus (`cerberus`, Characters → Enemies → Hell): the three-headed guardian hound of Hell. Code: `src/characters/cerberus.js`. It is the hellhound's body (materials, rottweiler paws, gait IK `hhGaitFn`) scaled up 1.35x, with a wider front and three heads. It uses the warg's sampler (`wgClip`).

Open it: `http://localhost:<port>/#/a/cerberus`

## Options

| Option | Choices (default first) |
|---|---|
| Fur | Random, Blue-black, Charcoal, Dark brown, Ash grey |
| Fire | Random, Ember red, Fire orange, Hellfire green, Blue flame (eyes, the glow through throats, chest and belly, inside the mouths) |
| Mane | Random, Shaggy (tufts along the hump, a mane on every neck, cheek and elbow fur), Short (a dark ridge) |
| Scars | Random, Yes (over the left head's left eye, three claw marks on the right shoulder), No |
| Gear | None, Spiked collars (one on every neck) |

## Body

Built in hellhound units and scaled by `CBK` = 1.35: about 2.2 m at the shoulder hump, 2.8 m tall to the side heads' ears, 4.6 m long with the heads. The upper body carries the weight: a very wide ribcage (1.27 m), a broad hump, massive shoulders and forearms set wide, front paws 8 % bigger than the hellhound's. The hind half is the hellhound's: a small rump on thinner hind legs and a long thin tail carried up and back.

Three heads, each a full hellhound head (about 0.76 m wide, 1 m long): heavy brow, small glowing eyes, huge jaw with separate teeth and fangs, glowing mouth. The centre neck grows from the low front of the chest and carries its head forward and lowest; the side necks grow from the top corners of the chest, higher and further back, and are turned out about 45° (set by the neck rest group, yaw then pitch), so the three skulls stand clear of each other in every clip.

The leg skeleton is the hellhound's exactly, scaled: `CBL` is `HHL` with every length times `CBK`, passed to `hhGaitFn` as `o.L`.

Rig: 34 joints. The warg's 24, where `neck`, `head`, `jaw`, `ear_L/R` are the centre head, plus `neckL`, `headL`, `jawL`, `earL_L/R` and `neckR`, `headR`, `jawR`, `earR_L/R` for the side heads. `cbTri(pose, L, R, add)` fills the side-head keys; a pose with no side keys gets the default (follow the centre and keep looking outwards).

## Clips

19 clips, 60 fps. Walk (1.25 s, 1 m/s), Run (0.58 s, 5.2 m/s) and Stalk (1.8 s, 0.6 m/s) are the hellhound's IK gaits at the bigger size. In Idle, Sniff, Sit and Lie down every head keeps its own watch: the side heads look outwards on their own timing, and in Sniff the centre head noses the ground while the side heads stand guard.

| Clip | What it does |
|---|---|
| Howl | Sits, the three heads throw back one after another and howl together, jaws trembling out of step |
| Growl | All three snarl, out of step |
| Bite | The centre head lunges straight ahead; the side heads snap outwards |
| Bite left / Bite right | The side head lunges out to its side and shakes |
| Triple bite | Left, centre, right snap one after another (2 s) |
| Pounce | Leaps forward with all three jaws open |
| Claw swipe | The right foreleg rakes across |
| Fire breath | All three heads breathe in raised, then thrust low with the jaws wide; the centre sweeps left to right, the side heads sweep their own flanks. The fire is left to a separate effect |
| Hit | The centre head snaps back, the side heads flinch outwards |
| Death | Rears back, the legs buckle and it slumps onto its belly with the forelegs stretched forward; the centre head drops to the ground, the side heads lay their chins on the forelegs, jaws slack (3 s, holds) |

Growl, the bites, Pounce, Claw swipe, Fire breath and Hit go on to Idle (war mode).

## Checks done

- `tools/check-character.mjs` for both manes, with and without collars, seeds 1–3: every clip passes except the Death pile height (1.76–1.93 m: the hump of the beast lying on its belly).
- A head-overlap check (each head's boxes against the other heads, the other necks and the forelegs, every frame): the heads stay clear of each other in every clip.
- Viewer in Day and Night.
