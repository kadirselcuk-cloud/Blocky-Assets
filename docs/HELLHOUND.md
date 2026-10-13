# Hellhound

The hellhound (`hellhound`, Characters → Enemies → Hell): a hunched hound of Hell, built after the owner's reference art. Code: `src/characters/hellhound.js`. It uses the warg's rig, sampler and clips (`src/characters/warg.js`).

Open it: `http://localhost:<port>/#/a/hellhound`

## Options

| Option | Choices (default first) |
|---|---|
| Fur | Random, Blue-black, Charcoal, Dark brown, Ash grey |
| Fire | Random, Ember red, Fire orange, Hellfire green, Blue flame (eyes, the glow through throat, chest and belly, inside the mouth) |
| Mane | Random, Shaggy (tufts along the hump, neck mane, cheek and elbow fur), Short (a dark ridge) |
| Scars | Random, Yes (over the left eye, three claw marks on the right shoulder), No |
| Gear | None, Spiked collar |

"New look" rolls every Random option.

## Body

About 1.6 m at the shoulder hump, 2.6 m long. The upper body carries the weight: a deep, wide ribcage (0.66 m) under a big shoulder hump, heavy shoulders and forearms, big rottweiler-like paws (a thick pastern, a broad compact foot, four domed toes with rounded fronts and short dark nails, a dark pad underneath; front paws 10 % larger). The back falls steeply to a small rump on thin hind legs; a long, thin, nearly bare tail is carried up and back (never tucked), raised higher in war mode. Thick neck carried forward and low. Big, broad head (0.56 m wide, 0.77 m long): heavy brow over small glowing eyes, short muzzle, a huge lower jaw, separate teeth with long upper and lower fangs, glowing gums and mouth inside, small ears set far back. Fire glows through the throat, the brisket (edged by fur) and the belly.

Rig: the warg's 24 joints (`body`, `chest`, `hips`, `neck`, `head`, `jaw`, `ear_L/R`, `tail`, `tail2`, `leg_F*`/`knee_F*`/`paw_F*`, `leg_B*`/`knee_B*`/`hock_B*`/`paw_B*`).

## Clips

16 clips, 60 fps. Idle, Sniff, Sit, Lie down, Howl, Idle (war mode), The gaits are solved by `hhGaitFn`: each paw follows a flat stance line on the ground and a lifted swing arc, the legs are solved in the side plane (two-bone IK for the foreleg, hip-stifle IK over a keyed hock angle for the hind leg), paws stay flat while planted and fold only late in the swing. Body pitch and height are fitted so front and hind legs stand at the same slack, so the body glides at an even height (walk and stalk within 1 mm; the gallop rises about 5 cm in its suspension) instead of bobbing like a pendulum; planted paws slip less than 3 mm per frame in walk and stalk.

Growl, Bite, Pounce, Claw swipe and Hit are the warg's poses (see `docs/WARG.md`) with the tail re-keyed for its raised carriage. Walk, Run and Stalk are the hellhound's own:

| Clip | Length | Loop | What it does |
|---|---|---|---|
| Walk | 1.1 s | loop | Lateral-sequence walk, 0.85 m/s |
| Run | 0.5 s | loop | Rotary gallop with a short suspension and spine flex, 4.5 m/s |
| Stalk | 1.6 s | loop | Low crouched walk with the head down, 0.5 m/s |
| Fire breath | 2.8 s | once | Draws a breath with the head raised, thrusts the head forward and low with the jaw wide, sweeps left and right, recovers. The fire itself is left to a separate effect; the mouth glows |
| Death | 2.8 s | once, holds | The warg's fall onto the right side, but the lower legs lie flat instead of propping the body up |

Growl, Bite, Pounce, Claw swipe, Fire breath and Hit go on to Idle (war mode).

## Checks done

- `tools/check-character.mjs` for both manes, with and without the collar, seeds 1–3: every clip passes except the Death pile height (0.94 m: the deep chest and hump lying on its side; the warg is at 1.03 m). The limb jump/twist checks are for humanoid joints and do not apply to this rig.
- Viewer in Day and Night (eyes, throat, chest, belly and mouth glow); option combinations; GLB export with animations (about 1.6 MB).
