# Imp

A small winged fiend (`imp`, Characters → Enemies → **Hell**, a new folder). Code: `src/characters/imp.js`.

Open it: `http://localhost:<port>/#/a/imp`

He never lands: every clip flies. Fast and dodgy: the wings buzz (a beat every 0.24 s, 0.16 s when flying), he weaves in place in war mode and has three dodges and a dash.

## Options

| Option | Choices (default first) | Notes |
|---|---|---|
| Skin | Random, Crimson, Dark red, Ember orange, Soot black | Random rolls crimson twice as often; the wing membranes are a darker shade of the skin |
| Eyes | Random, Yellow glow, Orange glow, Green glow | Random rolls yellow twice as often |
| Horns | Random, Short, Swept back, Curved | All point up and outwards |

New look also rolls black or bone horns, a goatee and a notched ear.

## Body

`VB.imp`: the villager's 25 joints with small proportions (hips 0.46 m, arms 0.15 + 0.14 m), about **1.0 m** to the top of the head, 1.1 m to the horn tips.

- **Head**: big, a heavy brow slanting down to the nose, glowing eyes in dark sockets, a hooked nose, a wide grin of pointed teeth. The lower jaw `g_jaw` carries the chin, lower teeth, tongue and the goatee. Long pointed ears out to the sides and up.
- Pot belly and a small hunched chest with lighter patches in front, shoulder blades; a ragged dark loincloth on a cord.
- Thin arms; big hands with three hooked black claws and a clawed thumb (they curl and spread with the `fs` channel).
- Thin legs; clawed feet with three toes and a heel spur.
- **Wings** `iwing_L/R` on the shoulder blades: an inner bone and panel, then the outer half `iwingO_L/R` (folds back on the upstroke) with two finger bones, a stepped membrane and a claw at the tip. Span about 1.3 m.
- **Tail**: eight segments `itail_0..7` (about 1 m) from the back of the hips, tapering, ending in a diamond spade.

## Clips (16)

| Clip | Length | Loop | What it does |
|---|---|---|---|
| Idle | 2.9 s | loop | Hovers on fast buzzing wing beats, bobbing and drifting, legs dangling, tail swishing, looking round with a grin |
| Fly | 0.96 s | loop | Darts forward almost level, arms tucked, legs and tail streaming behind (6 m/s) |
| Idle (war mode) | 1.9 s | loop | Weaves quickly side to side, claws up and spread, grinning |
| Fly (war mode) | 0.96 s | loop | Zigzags forward in banking swerves, claws out, mouth wide (5 m/s) |
| Dodge left / Dodge right | 0.96 s | once | Barrel roll about 0.9 m to the side with the wings tucked, then darts back |
| Dodge back | 0.96 s | once | Backflip about 0.7 m back and up, then darts back in |
| Dash | 0.96 s | once | Fast zigzag, right then left, and back to where it was |
| Claw swipe | 0.72 s | once | Winds the right claw back and swipes it across, twisting into the blow |
| Claw flurry | 1.44 s | once | Four quick alternating swipes, pressing forward |
| Swoop | 1.2 s | once | Rises and backs off, dives at the enemy raking with both claws, zips back up |
| Tail sting | 1.44 s | once | Arcs the tail up behind the back and over the head like a scorpion's and stabs twice |
| Taunt | 2.4 s | once | Thumbs at the ears, wiggling the claws, cackling; then a spin in the air |
| Hit 1 | 0.6 s | once | Knocked back, head snapping back, wings jerking up |
| Hit 2 | 0.72 s | once | Struck from the right: spun round and knocked aside |
| Death | 2.4 s | once, held | Shrieks, the wings stop, tumbles out of the air and lands face down, wings spread flat on its back, tail flopping once more |

One-shot clips are followed by Idle (war mode); Death holds its last frame. Dodges, Dash and Swoop move in place and come back (the game moves the root).

## How the clips are built (`impClips`)

The vampire beast's machinery (`docs/VAMPIRE_BEAST.md`) with normal arms:

- Pose channels: `alt`, `HP`, body joints `h sp ch nk hd`; feet `FL/FR` in the hips' frame plus pitch, `KN` knee direction. The foot's orientation is set after wrSolve from the hips' orientation and the keyed pitch, so feet roll along in the barrel rolls and flips.
- `fl` turns the whole body (pitch, yaw, roll) about a point 0.15 m above the hips and carries the head along (wrSolve would otherwise keep it level): the backflip, the barrel rolls, the spins in Hit 2 and Taunt.
- Arms: hand targets `gL/gR` and poles `pL/pR` in the chest's frame, pole search against upper-arm roll with frame continuity, wrists keyed (`wl/wr`), claws `fs`. Keep hand targets within reach and wind-ups not folded tight: a fast swipe from a folded arm to a straight one flips the elbow.
- Wings: `wg` [elevation, sweep back, pitch back, outer fold] plus one beat (`impBeat`) scaled by `ba`; a wing that would touch the ground is lifted.
- Tail: `tc` curl per segment (six values spread over the eight segments, or eight), `tw` travelling wave, `tsw` sway; a segment that would go into the ground curls away from it.
- Every clip is sampled at 60 fps; loops are whole numbers of beats and tail waves, pre-rolled so the elbows match at the seam.

## Checks done

- `node tools/check-character.mjs imp` for seeds 1–5 and 7 and every horn option: every clip passes (largest per-frame jump 21°, upper-arm roll 74° in Death, nothing below the ground, Death pile 0.44 m).
- Contact sheets of the clips from the front, the side and above, Day and Night (eyes glow); GLB export (1.65 MB, 16 clips).
