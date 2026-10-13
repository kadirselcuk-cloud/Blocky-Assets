# Fiend

The fiend (`fiend`, Characters → Enemies → Hell). Code: `src/characters/fiend.js`.

Open it: `http://localhost:<port>/#/a/fiend`

A strong horned devil with no wings, about **2.5 m** to the top of the head (2.7 m to the tips of ram horns, 2.85 m swept back, 3.1 m bull), with a weapon in each hand.

## Options

| Option | Choices (default first) | Notes |
|---|---|---|
| Right hand | Random, Long sword, Double axe, Flail | |
| Left hand | Random, Long sword, Double axe, Flail | Any mix with the right hand |
| Horns | Random, Bull, Ram, Swept back | Random rolls bull most often |
| Skin | Random, Crimson, Dark red, Charcoal, Violet | Random rolls crimson most often |

"New look" also rolls the fur colour of the legs (black most often, dark brown, russet), the horn colour (black with pale tips, or ivory), the eye glow (yellow most often, orange, red), bald or slicked-back hair, and a goatee.

## Body

`VB.fiend` is built in real metres (no group scale, so the 5 cm texture pixels stay the same) on the villager's 25 joints, so the warrior's leg and arm IK (`wrSolve`) fits unchanged. Hips at 1.16 m, thigh 0.5, shin 0.48, upper arm 0.52, forearm 0.47, shoulders 1.28 m apart. The torso and head use the oni's measures scaled down (`b()`, × 0.84; the head × 1.1 on top of that, `hb()`).

- **Torso**: narrow waist with a six-pack and obliques, a broad chest with big pecs, lats and traps; three short bony spikes down the back of the waist.
- **Head**: long pointed face and chin, sharp cheekbones, a heavy brow slanting down to the middle over glowing eyes in dark sockets (emissive), a hooked nose, a sly grin with upturned corners and two fangs, long ears swept back and up. The head sits a little forward of the chest (a brute's posture).
- **Horns**: tapering segments along a curve from the temples, ringed at the root, lighter towards the tip. Bull: out to the sides, then up and a little forward. Ram: back, down and curling forward round the ears. Swept back: long, rising backwards.
- **Arms**: deltoids, biceps and triceps, thick forearms in iron bracers with two spikes on the outside; big clawed hands, both fists closed (`userData.post`). On the left shoulder a spiked iron pauldron: a domed cap, three lames stepping down the arm and three tall spikes.
- **Gear**: a leather baldric from the right shoulder (front and back) with an iron ring, a dark red cloth wrap with a ragged hem under a broad studded belt with a horned skull buckle.
- **Legs**: goat legs in shaggy fur with darker tufts, a fetlock tuft, and cloven hooves (two toes with lighter rims and tips, dewclaws behind). The hoof stays inside the IK foot (heel and toe points), and the soles sit 5 mm above the IK sole.

## Weapons (`fdWeapon`)

`fd_wpn_R` and `fd_wpn_L` (`userData.gear`) in the hand sockets, the revenant's frame: grip through the fist, the business end along the thumb side, edges towards the fingers. All have about the same reach from the fist.

| Weapon | Reach | Build |
|---|---|---|
| Long sword | 1.5 m | Wrapped grip with red cord bands, horned pommel, a guard swept up towards the blade like a pair of horns (a crescent, never a plain bar), a long dark blade with a light edge, a glowing red fuller on both faces and four saw teeth on the back edge near the guard |
| Double axe | 1.55 m | Long haft with iron bands, a head with a crescent bit on each side and a spike on top |
| Flail | about 1.45 m | Short banded handle, a cap with a ring, a chain of five iron links (`fd_chain_R/L`) and a spiked ball (14 spikes) |

### The flail's chain

The chain and ball are one rigid group (`fd_chain_R/L`) turning about the end of the handle, baked into a quaternion track on every clip. `fdChainSim` simulates them as a damped pendulum (the ball 0.6 m from the pivot, 6 substeps per frame) driven by the pivot's path:

- the ball's centre stays 0.25 m above the ground (its spikes never go in);
- the ball stays out of capsules round the torso and head and round both upper arms and forearms (`fdCaps`), and the middle of the chain stays out of them too;
- the chain stays within 150° of the handle's line (it never folds back onto the hand);
- the rotation is carried from frame to frame by the smallest turn, so it never flips;
- loops run three cycles first and the last one is bent to close on its first frame; one-shot clips start from the war idle's first frame and blend back to it at the end, so clips join without a pop.

A flail in the right hand is held low in front in guard (as the left), not raised by the shoulder, so its chain does not drape over the shoulder (`fdWar`, `FD_RF`).

## Clips (18)

| Clip | Length | Loop | What it does |
|---|---|---|---|
| Idle | 4.5 s | loop | Breathing, looking around, both weapons held low |
| Walk | 1.4 s | loop | Heavy, swaggering strides, weapons low, about 0.7 m/s |
| Run | 0.82 s | loop | Pounding run, weapons forward, about 2.8 m/s |
| Idle (war mode) | 2.8 s | loop | Left foot forward, right weapon raised by the shoulder (a flail is held in front), left held out in guard |
| Walk (war mode) | 1.3 s | loop | Guard up, steady advance, about 0.7 m/s |
| Run (war mode) | 0.8 s | loop | Charging, both weapons ready, about 2.9 m/s |
| Attack 1 | 1.35 s | once | Right weapon: diagonal chop from the right shoulder down across the body, with a step in; the left weapon is lifted out of its way |
| Attack 2 | 1.35 s | once | Left weapon: the same from the left shoulder down to the right |
| Attack 3 | 1.45 s | once | Both weapons raised overhead and chopped straight down together, side by side |
| Attack 4 | 1.45 s | once | Both weapons cocked out wide, then swept in across the front, one above the other |
| Heavy attack | 2.1 s | once | Crouches, leaps forward and smashes both weapons into the ground |
| Block | 1.4 s | once | Both weapons up side by side in front of the face (they never cross), takes the blow and pushes back |
| Roar | 2.8 s | once | Arms and weapons flung wide and up, head thrown back |
| Taunt | 3.2 s | once | Like a bull before the charge: lowers its head with the horns forward, weapons held out low, paws the ground twice with the right hoof, then tosses its head up |
| Hit 1 | 0.8 s | once | Blow to the chest, rocks back |
| Hit 2 | 0.9 s | once | Blow from the left, twists and bends away |
| Heavy hit | 1.7 s | once | Knocked back two heavy steps, then steps in again |
| Death | 2.7 s | once, held | Recoils, sinks onto its knees, lets both weapons fall flat beside it and pitches forward face down |

Every one-shot clip names `Idle (war mode)` as `clip.next` (Death is held). Combat clips start and end on the war stance.

## How the clips are built

- **The revenant's solver** (`rvSolver`) on the fiend's own rig (`fdRig`, a bare fiend with the chosen weapon pair): hand targets in the torso's frame or `{s:[dx,dy,dz]}` from a shoulder, elbow poles from a cost search, both wrists in closed form, clamped and rate-limited. Keys are in body units (metres / `legS`); the oni's keys fit (same proportions).
- **Ground check** (`fdSolver`): the solved wrists are put on the rig, then each weapon that is below the ground is tilted up about the level axis across it (binary search) and the frame solved again from the same continuity state. A flail's chain is left out of this check (the simulation keeps it up).
- Gaits (`GAIT`): in-place IK, planted feet slide back at one steady speed (`clip.speed`), both hands swing against the legs. Loops are pre-rolled one cycle and their last frame is the first.
- Clips are made per weapon pair (the ground check and the chains depend on it); Death per weapon pair and horns.
- **Death** (`fdFalls`): keyed joint angles (`gbDeathKeys`) on a bare fiend dropped onto its lowest point every frame, sampled at 60 fps. While a weapon is still held and would go into the ground (on the knees), it is turned up about the grip. The weapons are let go on the knees (right 1.05 s, left 1.13 s), fall under gravity and lie flat 0.3 m out from the body (tracks on `fd_wpn_R/L`); a flail's chain keeps swinging as it falls and comes to rest on the ground. The head rests face down; with bull horns it is lifted back a little, as the horns reach down past the face.

## Checks done

- `node tools/check-character.mjs fiend` for all 9 weapon pairs × 3 horns × seeds 1–3: every clip passes jumps, twists and the ground, except **Death: PILE TOO HIGH (0.81–0.86 m)**. This is the fiend's own size, not a heap: lying flat, its chest and back are about 0.66 m thick, plus the pauldron and baldric (the oni is 0.92 m). The 0.55 m limit is for human-sized bodies.
- Weapons against the body every frame (sampled points inside body boxes, 20 fps): grips and pommels at most 3 cm into their own bracer at strong wrist bends; a flail's chain links (not the ball) graze an arm or the head for a frame or two while swinging, up to 8 cm.
- Viewer: contact sheets of the attacks, the taunt (front and side), the gaits and Death (side and above); all three horns, crimson, dark red, charcoal and violet skin, every weapon (two flails too); Day, Dusk and Night (the eyes and the sword's fuller glow).

## Possible extras (not added)

A tail with a spade tip, and spell or fire effects, were left out; they can be added on request.
