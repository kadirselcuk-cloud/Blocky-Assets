# Hellhound

The hellhound (`hellhound`, Characters → Enemies → Hell): a lean, muscular fire hound. Code: `src/characters/hellhound.js`. It uses the warg's rig, sampler and clips (`src/characters/warg.js`).

Open it: `http://localhost:<port>/#/a/hellhound`

## Options

| Option | Choices (default first) |
|---|---|
| Hide | Random, Charcoal, Obsidian, Ash grey, Rust red |
| Fire | Random, Ember orange, Blood red, Hellfire green, Blue flame (eyes, cracks, mouth and flames) |
| Back | Random, Flame mane (flames along the neck and withers, spines down the rump), Bony spines (spines all along) |
| Horns | Random, None, Short, Curved (sweep back over the skull, tips curl up) |
| Gear | None, Spiked collar |

"New look" rolls every Random option.

## Body

About 2.2 m from nose to rump (3.2 m with the tail), 1.25 m at the withers, 1.8 m to the horn tips. Deep chest, tucked waist, level back, muscled shoulders and haunches, long black claws. Big blocky mastiff head (1.2× scale) with a heavy brow, glowing eyes, fangs, a mouth that glows inside, small ears swept back. Glowing ember cracks (zigzag seams, placed by seed) on the flanks, shoulders and haunches. Whip tail ending in a bony spike.

Rig: the warg's 24 joints (`body`, `chest`, `hips`, `neck`, `head`, `jaw`, `ear_L/R`, `tail`, `tail2`, `leg_F*`/`knee_F*`/`paw_F*`, `leg_B*`/`knee_B*`/`hock_B*`/`paw_B*`) plus flame joints `fl_0…5` (flame mane only).

## Clips

The warg's 15 clips (Idle, Walk, Run, Sniff, Sit, Lie down, Howl, Idle (war mode), Stalk, Growl, Bite, Pounce, Claw swipe, Hit, Death; see `docs/WARG.md`), sampled at 60 fps, plus:

| Clip | Length | Loop | What it does |
|---|---|---|---|
| Fire breath | 2.8 s | once | Draws a breath with the head raised, thrusts the head forward and low with the jaw wide, sweeps left and right, recovers. The fire itself is left to a separate effect; the mouth glows |
| Death | 2.8 s | once, holds | The warg's fall onto the right side, but the lower legs lie flat instead of propping the body up; the flames burn down to 20 % |

Flames sway and flicker in whole cycles per clip (seamless loops), stream back in Run and Pounce, and are baked as rotation and scale tracks through the opt-in `U.fx` / `U.fxJ` hook of `wgClip`. Growl, Bite, Pounce, Claw swipe, Fire breath and Hit go on to Idle (war mode).

## Checks done

- `tools/check-character.mjs` for both backs, all horns, with the collar, seeds 1–3: every clip passes except the Death pile height (0.86 m: the hound lying on its side is that thick; the warg is at 1.03 m). The limb jump/twist checks are for humanoid joints and do not apply to this rig.
- Viewer in Day and Night (eyes, cracks, mouth and flames glow); option combinations; GLB export with animations (about 2.3 MB).
