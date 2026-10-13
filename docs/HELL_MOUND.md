# Hell Mound

A slow, mindless mound of tormented flesh (`hell-mound`, Characters → Enemies → **Hell**). Code: `src/characters/hell_mound.js`. The D&D hell mound's counterpart.

Open it: `http://localhost:<port>/#/a/hell-mound`

It has no legs and no feet. The lower body is a heap of fat rolls on a muscular foot, and it slides along like a snail. Everything it does is slow and heavy, and it moans the whole time.

## Options

| Option | Choices (default first) | Notes |
|---|---|---|
| Flesh | Random, Raw pink, Blood red, Pallid grey, Bruised purple | Random rolls raw pink twice as often |
| Eyes | Random, Dull yellow, Milky, Ember glow | Random rolls dull yellow twice as often; ember glows at night |

New look also rolls where the sores, lobes, drips and bruises sit, a lumpy skull, drool, a burnt patch, and which shoulder carries the lump of flesh.

## Body

About **1.6 m** tall, 1.3 m wide and 1.4 m long including the tail of the foot. Very fat all over.

- **Foot** `lm_ped_0..6`: seven segments from the front (z +0.37) to a trailing tail (z −0.58). Each segment has a dark slimy sole and a muscular top.
- **Mound** `lm_roll_0..2`: three fat, blubbery rolls (1.08, 0.92 and 0.74 m wide), each with a thick band sagging over the one below and a dark crease. Four big bulging lobes per roll, put in different places on each, so the rolls never line up. The upper rolls have folds of flesh dripping down, and all of them have bruised mottling, pale fat patches and open sores (a raw rim, a dark pit, sometimes a bead of pus).
- **Torso** (`hips` at 0.72 m, `spine`, `chest`): fat, about 0.7 m wide and 0.55 m deep: a big sagging belly with folds hanging from it, love handles at the sides, heavy droopy pecs, a hunched back, a lump of flesh over one shoulder, and a fleshy collar the head sinks into.
- **Head**: half melted. The brow droops more on the left, and the left eye sits lower than the right in its dark socket. Sagging jowls, two nose slits, and a gaping mouth with a few stubby teeth. The lower jaw `g_jaw` carries the lip, the teeth and the drool.
- **Arms**: thick and flabby, with heavy skin hanging under the upper arm and forearm. **Uneven:** the left arm is long (upper arm 0.38 m + forearm 0.34 m) and the right one short and stunted (0.24 + 0.20 m), set in `LM_ARM`. The hands are big, with three thick claws and a thumb (curled by the `fs` channel). `socket_L/R` are there for props.

## Clips (13)

| Clip | Length | Loop | What it does |
|---|---|---|---|
| Idle | 4.0 s | loop | Heaves with slow, ragged breaths while the fat rolls quiver; the head lolls, it moans, the claws twitch |
| Slide | 2.4 s | loop | Slides along on waves rippling from the tail to the front of the foot, lurching, arms dragging (0.35 m/s) |
| Idle (war mode) | 2.4 s | loop | Hunched towards the enemy, both claws raised and grasping, wailing |
| Slide (war mode) | 1.8 s | loop | Slides at the enemy as fast as it can, clawing with each arm in turn (0.5 m/s) |
| Claw swipe | 1.4 s | once | Draws the short right claw up and back, heaves forward and rakes across and down |
| Double slam | 1.8 s | once | Rears up with both fists high and brings them crashing down; the mound slumps into the blow |
| Smother | 2.4 s | once | Swells up with its arms spread, throws its mass forward onto the enemy, wraps it in its arms and squeezes |
| Wail | 2.6 s | once | Clutches its head in both claws, throws it back and wails, shaking |
| Writhe | 3.2 s | once | Hugs itself and twists from side to side in torment (followed by Idle) |
| Hit 1 | 0.8 s | once | Struck in front: rocks back with a howl, the rolls slapping and quivering |
| Hit 2 | 0.9 s | once | Struck from the right: twisted round and shoved aside, wobbling |
| Death | 3.2 s | once, held | Wails, sags and melts into a puddle of meat; the torso sinks forward into it and the head comes to rest on its side |
| Rise | 3.2 s | once | Reforms out of the puddle (Death played backwards), then Idle |

One-shot clips are followed by Idle (war mode) unless the table says otherwise. Both slides move in place; the game moves the root.

## How the clips are built (`hell moundClips`)

Pure FK, with no IK solver:

- Body joints `h sp ch nk hd` are Euler angles; `HP` offsets the hips.
- **Arms are swing-only.** `aL/aR` = [forward, outward, roll] gives the upper arm's direction in the chest's frame, and the rotation is the shortest one from hanging down to that direction, plus the keyed roll. Because of this the upper arm can't roll about itself except by the keyed amount (the checker's twist is that roll). The elbow (`eL/eR`) is a hinge. Keep forward + outward short of straight up, where the shortest rotation flips.
- Arm angles are relative to the chest. When the torso leans far forward, lower `forward` to match, or the arms point up. Keep the hands clear of the rolls (they follow the hips forward); the short right arm needs a higher `forward` than the left to reach past them.
- **Foot**: `pw` sets the strength of the pedal wave, a hump in each segment's height running from the tail to the front over the period `pT`.
- **Rolls** follow the hips by 20 %, 45 % and 75 % (bottom to top), lean with the hips' pitch, yaw and roll, squash (`md[2]`) and jiggle (`jg`, at a frequency rounded to fit the clip). `md` also lunges the mound forward or sideways.
- **Melt** (`mt` 0..1): the foot and the rolls flatten and spread into a puddle, and the torso shrinks to 80 % as it sinks into it.
- Everything is sampled at 30 fps into quaternion, position and scale tracks.

## Checks done

- `node tools/check-character.mjs hell-mound` for seeds 1–5, 8 and 9 and the flesh and eye options: every clip passes. The largest per-frame jump is 10° (Claw swipe), the largest upper-arm roll is 64° (Smother), nothing goes below the ground, and the Death pile is 0.52 m. Arms rest on the blubber in the heaviest attacks (at most about 6 cm into a roll) but never pass through it.
- Contact sheets of the clips from the front, the side and above, Day and Night.
