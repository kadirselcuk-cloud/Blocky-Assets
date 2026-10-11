# Ghoul

The ghoul enemy (`ghoul`, Characters → Enemies → Undead). Code: `src/characters/ghoul.js`.

Open it: `http://localhost:<port>/#/a/ghoul`

## Options

| Option | Choices (default first) | Notes |
|---|---|---|
| Skin | Random, Ashen grey, Grey-green, Bluish, Bruised, Leathery brown | |
| Clothes | Random, Ragged shirt and trousers, Burial shroud, Torn trousers only | Random rolls rags twice as often; rag colours come from the goblin rag list |
| Weapon | Random, None (claws), Knife, Small cleaver, Small club | Right hand. The club is the skeleton's (`skClub`) |
| Eyes | Random, Milky, Yellow glow, Red glow | Glowing eyes are emissive (show most at dusk and night) |

"New look" also rolls the rag colours, how many hair patches are left, a torn ear and a missing toe on the wounded foot.

## Body

`VB.ghoul` is the villager male's proportions (about 1.8 m standing, lower in its hunch) on the villager's 25 joints, so the warrior's IK (`wrSolve`) fits unchanged. Its own meshes, one named piece per joint:

- `g_pelvis`, `g_belly`, `g_chest`, `g_neck`: gaunt torso. A torn hole on the left of the chest shows three ribs; spine knobs on the back; ribs show through the skin when bare.
- `g_head`: sunken cheeks and eye sockets, rotted nose, upper teeth, torn left cheek showing teeth, patchy hair, small ears. `g_jaw` is the lower jaw, hinged under the ears.
- Right arm `g_upperArm_R`, `g_foreArm_R`, `g_hand_R`, `g_fingers_R`, `g_tips_R` (dark claws), `g_thumb_R`. Weapon in `weapon_R` on the right socket.
- Left arm: `g_upperArm_L` only, ending at the elbow in a ragged wound with the humerus sticking out. The forearm, hand and finger joints exist (empty) so every clip binds.
- Legs `g_thigh_*`, `g_shin_*`, `g_foot_*`: the right trouser leg reaches the ankle; the left is torn at the knee over a gash with the shin bone showing and a dirty bandage. Bare feet whose soles match the IK foot (0.07 below the ankle, heel to toe).

## Clips (15)

| Clip | Length | Loop | What it does |
|---|---|---|---|
| Idle | 5.0 s | loop | Hunched on the good leg, swaying; the head jerks twice, the jaw works |
| Walk | 1.7 s | loop | Slow limp, about 0.44 m/s |
| Run | 1.05 s | loop | Hurried lurch, leaning in and reaching, still limping, about 0.9 m/s |
| Idle (war mode) | 2.4 s | loop | Deeper hunch, claws or weapon raised, snarling |
| Walk (war mode) | 1.5 s | loop | Limping advance with the arm raised, about 0.47 m/s |
| Attack 1 | 1.4 s | once | Overhead strike: steps in on the good leg, hacks straight down |
| Attack 2 | 1.3 s | once | Side swipe, right to left, with a step in |
| Attack 3 | 1.15 s | once | Lunging stab straight ahead |
| Lunge & bite | 2.1 s | once | Lurches in, hooks the arm round the prey, bites twice, tears with a shake of the head |
| Shriek | 2.3 s | once | Head thrown back, jaw wide, arm and stump flung out, shaking |
| Hit 1 | 0.85 s | once | Head snaps back, jaw flies open |
| Hit 2 | 1.15 s | once | Struck from the right, buckles on the wounded leg, steps back in |
| Heavy hit | 2.5 s | once | Knocked down onto the wounded knee, braces with the hand, drags itself up |
| Death | about 1.6 s | once, held | Shudders, the wounded leg gives way, pitches forward; head, arms, legs and torso come apart and land in a heap ahead of the feet, the head rolls off |
| Rise | 3.7 s | once | The pieces twitch, fly back together top first, then it pushes up into the war stance |

Every combat clip starts and ends on the war stance; Death ends where Rise starts.

## How the clips are built (`ghoulClips`)

- Two stances: relaxed (`IST`) and war mode (`GST`), keyed in the warrior's IK terms (hip offset, feet, right grip and blade direction). `stL` keys the stump's upper-arm angles directly; `jw` opens the jaw (radians), written to `g_jaw.quaternion` in every clip.
- **Limp (`LIMP`)**: per leg a heel-strike phase, stance share, lift and toe pitch. The right leg is planted 72 % of the stride, the wounded left only 52 %; the left swings out stiffly (`circ`) with its toes scraping (`drag`) and lands flat, and the hips dip and lurch onto it. Planted feet slide back at one steady speed (stored in `clip.speed`).
- Attacks and reactions are keyframes solved with `wrSolve`, with the same elbow and blade-roll continuity as the warrior's clips (right arm only).
- Death and Rise use the skeleton's `skDeathRise` with options: own slump keys, release at 0.78 s, a forward topple (`fwd`: each piece lands further ahead the higher it starts) and slower rise timing. The torso (pelvis, belly, chest, neck) falls as one piece face down, the jaw stays with the head, the hand with the forearm, each foot with its shin (`userData.joinChunk`); each piece carries its resting rule in `userData.restRule`.

## Changes elsewhere

`skDeathRise` (`src/characters/skeleton.js`) gained an optional fourth argument: `keys`, `tDet`, `tW`, `fwd`, `sh`, `rise` (tremble, spread, flight, straighten) and `notes`, plus the per-piece `joinChunk` and `restRule` flags. The skeletons pass nothing and are unchanged.

## Checks done

- Every clip, all four weapons, several seeds, sampled at 30 fps: no part below the ground (lowest point within 1 mm), feet on the ground in every frame except during Death and Rise.
- Contact sheets of the walk, run, attacks, bite, heavy hit, Death and Rise from several angles; Day, Dusk and Night (eye glow).
- GLB export works (about 1 MB with animations).
