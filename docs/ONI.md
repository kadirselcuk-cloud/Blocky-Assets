# Oni

The oni (`oni`, Characters → Enemies → Hell). Code: `src/characters/oni.js`.

Open it: `http://localhost:<port>/#/a/oni`

A muscular Japanese demon, about **3 m** to the top of the head (3.45 m to the tips of two horns, 3.55 m with one), swinging a heavy club in one hand.

## Options

| Option | Choices (default first) | Notes |
|---|---|---|
| Skin | Random, Red (aka-oni), Blue (ao-oni), Yellow (ki-oni), Green (midori-oni), Black (kuro-oni) | The traditional oni colours. Random rolls red and blue twice as often |
| Horns | Random, Two, One | Two rise from the forehead and lean outwards; one is a bigger horn in the middle. Random rolls two most often |
| Weapon | Kanabō (iron club), Spiked club, Barbed club | |

"New look" also rolls the mane colour (black most often, white, dark red), a beard, big prayer beads (juzu), gold or iron rings and a scar across the belly.

## Body

`VB.oni` is built in real metres (no group scale, so the 5 cm texture pixels stay the same) on the villager's 25 joints, so the warrior's leg and arm IK (`wrSolve`) fits unchanged. Hips at 1.42 m, thigh 0.62, shin 0.58, upper arm 0.62, forearm 0.56, shoulders 1.56 m apart, shoulder height 2.35 m.

- **Torso**: narrow waist with a six-pack and obliques, a broad chest (1.1 m) with big pecs, a V of lats at the back and traps rising to a thick neck.
- **Head**: big; square jaw, a dark open mouth with two rows of teeth, two upward fangs and two short upper fangs; bulging eyes with red rims and small pupils under heavy brows that slant down to the middle (bushy hair on them), a furrowed brow, a broad flat nose, pointed ears with a gold ring.
- **Horns**: ringed ivory, darker at the tips, out of the forehead.
- **Mane**: a thick mass round the back and sides of the head with eleven spiky clumps flaring out and back; sometimes a wild beard.
- **Arms**: deltoids, biceps and triceps, thick forearms; a ring round each upper arm and a cuff at each wrist (gold, or iron); big hands with dark claws.
- **Legs**: big quads, thick calves, rings round the ankles, bare clawed feet. The soles sit 5 mm above the IK sole (fast heel strikes sampled between frames never dip in).
- **Clothing**: a tiger-skin loincloth (a wrap round the hips and trunks over the thighs, stripes and a ragged hem, a white belly patch) under a thick twisted straw rope belt with a knot and two short frayed ends at the front. Optional prayer beads round the neck with a red bead in the middle.

## Weapons (`onWeapon`)

`on_wpn_R` in the right hand socket (`userData.gear`), the revenant's frame: grip through the fist, the heavy end along the thumb side. Each has a leather grip with red cord bands and an iron pommel; about 1.85 m from the fist to the end, 2.3–2.5 m overall.

| Weapon | Build |
|---|---|
| Kanabō | Iron, eight-sided (two squares at 45°), widening towards the end; studs in a checker, a band, a cap; a ring pommel with a red tassel |
| Spiked club | Wooden, swelling towards the end, two iron bands; long iron spikes in staggered rows and one out of the end |
| Barbed club | The same wooden club with hooked iron barbs (each sticks out, then bends back towards the grip) and a band of barbed wire |

## Clips (16)

| Clip | Length | Loop | What it does |
|---|---|---|---|
| Idle | 4.5 s | loop | Heavy breathing, looking around, weapon on the right shoulder |
| Walk | 1.5 s | loop | Heavy strides, free arm swinging, about 0.8 m/s |
| Run | 0.85 s | loop | Pounding run, free arm pumping, about 3.4 m/s |
| Idle (war mode) | 2.8 s | loop | Left foot forward, weapon raised by the right shoulder, left fist up |
| Walk (war mode) | 1.3 s | loop | Guard up, steady advance, about 0.9 m/s |
| Run (war mode) | 0.8 s | loop | Charging, weapon raised, about 3.6 m/s |
| Attack 1 | 1.45 s | once | Diagonal chop from the right shoulder down across the body, with a step in |
| Attack 2 | 1.6 s | once | Flat sweep from right to left: the arm stays out to the side palm down and the turning body carries the club across |
| Attack 3 | 1.2 s | once | Straight left punch with a lunge |
| Heavy attack | 2.1 s | once | Crouches, leaps forward with the club overhead and smashes it flat onto the ground |
| Roar | 2.8 s | once | Crouches, then arms and weapon flung wide and up, head thrown back |
| Taunt | 3.2 s | once | Shiko (the sumo stamp): weight onto the right leg, the left leg raised high out to the side, stamped down into a wide squat with the left hand on the knee |
| Hit 1 | 0.8 s | once | Blow to the chest, rocks back |
| Hit 2 | 0.9 s | once | Blow from the left, twists and bends away |
| Heavy hit | 1.7 s | once | Knocked back two heavy steps, then steps in again |
| Death | 2.7 s | once, held | Recoils, sinks onto its knees, lets the weapon fall flat beside it and pitches forward face down |

Every one-shot clip names `Idle (war mode)` as `clip.next` (Death is held). Combat clips start and end on the war stance.

## How the clips are built

- **The revenant's solver** (`rvSolver`, now taking a rig) on the oni's own rig (`onRig`, a bare oni with the weapon): hand targets in the torso's frame or `{s:[dx,dy,dz]}` from a shoulder, elbow poles from a cost search, wrists in closed form, clamped and rate-limited. Keys are in body units (metres / `legS`).
- **One-handed**: the weapon is in the right hand only; the left hand is free (keyed `gL`/`dL` and fist). A weapon can only point to the thumb side of its forearm, so the flat sweep keeps the arm out to the side with the palm down.
- **Ground check** (`onSolver`): if any of the weapon is below the ground after a solve, the weapon direction is tilted up about the level axis across it (binary search) and the frame solved again from the same continuity state. The ground smash lands flat on the ground this way.
- Gaits (`GAIT`): in-place IK, planted feet slide back at one steady speed (`clip.speed`), the free hand swings against the legs. Loops are pre-rolled one cycle and their last frame is the first.
- **Death** (`onFalls`): keyed joint angles (`gbDeathKeys`) on a bare oni dropped onto its lowest point every frame (the revenant's method). The weapon is let go on the knees, falls under gravity and lies flat 0.35 m out from the body (track on `on_wpn_R`). The head rests face down (turned on its side, the mane would stand higher).

## Checks done

- `node tools/check-character.mjs oni` for all three weapons × both horn options × seeds 1–3: every clip passes jumps, twists and the ground, except **Death: PILE TOO HIGH (0.92 m)**. This is the oni's own size, not a heap: lying flat its chest alone is 0.74 m thick, and the mane on the back of the head reaches 0.92 m. The 0.55 m limit is for human-sized bodies.
- Weapon points inside body boxes, every clip at 20 fps, all three weapons: at most 2 mm (Run (war mode), against the right upper arm).
- Viewer: contact sheets of every attack, the taunt, the roar, the gaits and Death from the front, side and quarter; red, blue and yellow skin, both horn options and all three weapons; Day, Dusk and Night.
