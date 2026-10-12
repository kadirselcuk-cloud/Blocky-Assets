# Vampire spawn

The vampire spawn enemy (`vampire-spawn`, Characters → Enemies → Undead). Code: `src/characters/vampire_spawn.js`.

Open it: `http://localhost:<port>/#/a/vampire-spawn`

## Options

| Option | Choices (default first) | Notes |
|---|---|---|
| Skin | Random, Chalk white, Grey-blue, Grey-green, Sallow | Veins on the scalp follow the skin colour |
| Eyes | Random, Red glow, Amber glow, White glow | Emissive (show most at dusk and night). Random rolls red most often |
| Clothes | Random, Torn grave shirt, Bare chest | Ragged breeches either way; shirt and breeches colours are rolled |

"New look" also rolls a notch torn out of the left ear (about 1 in 3) and a scar across the scalp (about 2 in 5).

## Body

`VB.vspawn` is the villager male's proportions on the villager's 25 joints (so the warrior's IK, `wrSolve`, fits unchanged): about **1.8 m standing straight**, but it never straightens. The relaxed stance stands about **1.4 m** (bent knees, humped back, head pushed forward).

- **Head**: bald, large and round (layered boxes about 0.3 m wide), veins on the scalp, heavy brow, deep sockets with glowing eyes, hooked nose, a wide mouth with **two long upper fangs** over the lower lip. `g_jaw` is the lower jaw (small lower fangs), opened by every clip.
- **Ears**: long and pointed, five tapering pieces sweeping out and up (only a little back, so they lie flat when it falls face down).
- **Humpback**: a big hump over the shoulder blades with spine knobs along it.
- Gaunt torso and limbs; the wight's big clawed hands and long clawed feet (the IK foot, g 1.45, matches the mesh).
- Ragged breeches to the knee, bare shins smeared with grave dirt; a torn grave shirt, or a bare chest with ribs.
- **Grave** (`g_grave`, child of the root): a dark hole in a ring of broken earth with a few clods, lying on the ground. Every clip keys `g_grave.scale`; it shows only in Rise from the ground and is shrunk away (0.001) everywhere else.

## Clips (15)

| Clip | Length | Loop | What it does |
|---|---|---|---|
| Idle | 5.0 s | loop | Crouched, breathing; sniffs the air with the head stretched forward, bares its fangs, claws flex |
| Walk | 1.3 s | loop | Skulking hunched walk, arms hanging |
| Run | 0.7 s | loop | Low, fast run, leaning in, claws swinging |
| Idle (war mode) | 2.4 s | loop | Low and wide, both claws raised, fangs bared, hissing |
| Walk (war mode) | 1.2 s | loop | Stalking forward with the claws raised |
| Bite | 1.8 s | once | Coils, darts in with a step, grabs high with both claws and sinks its fangs in at neck height, worries side to side, tears free |
| Claw swipe | 1.46 s | once | Right claw winds up and rakes across with a step in |
| Leap & feed | 4.7 s | once | Crouches, leaps about 1 m forward with the claws reaching, lands on its toes gripping the prey's shoulders with the fangs in its neck, feeds (head and shoulders pulse with each gulp, claws clench), rips free and hops back to where it started |
| Hiss | 2.0 s | once | Hunches, thrusts the head forward and hisses with the fangs bared, claws spread wide |
| Hit 1 | 0.8 s | once | Head snaps back |
| Hit 2 | 1.1 s | once | Struck from the right: twists away a step, then turns back in |
| Heavy hit | 1.8 s | once | Knocked back two steps, then stalks in again |
| Death | 2.4 s | once, held | Shudders, drops onto its knees and pitches forward face down |
| Rise | 4.5 s | once | Pushes up onto hands and knees, kneels, plants a foot and rises into the war stance |
| Rise from the ground | 5.4 s | once | Starts buried: the claws burst out of the earth, slap down either side of the hole and drag the body up; head, shoulders and chest come out, the right foot is planted at the rim, the left leg climbs out and it crouches into the war stance, hissing. The earth patch settles flat at the end. Followed by Idle (war mode) |

Every combat clip starts and ends on the war stance; Death ends where Rise starts.

## How the clips are built (`vampireSpawnClips`)

- The wight's machinery (see `docs/WIGHT.md`): relaxed (`VS_N`) and war (`VS_W`) stances in the warrior's IK terms, hand targets in the torso's frame, hands never aimed (keyed wrists `wr`/`wl`), elbow poles chosen by a cost search with frame-to-frame continuity, looping clips warmed up one cycle so the seam never flips an arm.
- Jumps (Leap & feed) are IK keys with the hips raised and positive foot lift; foot z is absolute, so the landing feet move forward with the hips.
- Leap & feed adds the gulping pulse on top of the keys (`o.add`) while it feeds.
- **Rise from the ground** uses the same IK: the hips start 2.3 m down and the feet have negative lift, so the legs stay naturally folded underground; the hands are targets on the ground beside the hole. The right knee points up (`nR`) while that foot is planted at the rim with the thigh near level, so the thigh doesn't roll. The clip is marked `clip.underground` (the checker skips the below-ground flag for it); the opaque ground tile hides the buried body.
- Death and Rise (`vsFalls`): the wight's keyed falls (`gbDeathKeys`), dropped onto the lowest point every frame, sampled at 60 fps. The head stays face down so the long ears lie flat.

## Checks done

- `node tools/check-character.mjs vampire-spawn` for both clothes options and seeds 1, 2, 3, 7: every clip passes (largest arm twist 95° in Rise from the ground, per-frame flips under 25°, nothing below the ground outside Rise from the ground, Death pile 0.48 m).
- Contact sheets of the stances, Bite, Leap & feed, Death and Rise from the ground from the front, side and three-quarter; Day and Night (eye glow).
