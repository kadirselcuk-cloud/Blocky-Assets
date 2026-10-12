# Vampire (beast form)

The vampire lord's creature form (`vampire-beast`, Characters → Enemies → Undead), phase 2 of the mini boss. Code: `src/characters/vampire_beast.js`.

Open it: `http://localhost:<port>/#/a/vampire-beast`

Phase 1 (`vampire`, docs/VAMPIRE.md) ends with Vanish: he wraps himself in his cape and is gone in smoke. Play this asset's **Appear** in the same place: the same smoke gathers and the beast grows out of it. He never lands; every clip flies. Reference: the owner's "Nosferat strain" concept art (grey, bald, bat-wing arms, clawed feet), in the blocky style.

## Options

| Option | Choices (default first) | Notes |
|---|---|---|
| Skin | Random, Ashen grey, Grey, Blue-grey | |
| Eyes | Random, Red glow, Amber glow, Violet glow | The phase 1 eye colours (`VL_EYES`), so a game can keep the same colour across both phases; Random rolls red twice as often |
| Wings | Random, Dusky brown, Charcoal, Blood red | Membrane colour; Random rolls dusky brown twice as often |

New look also rolls a notched right ear and a scar on the brow.

## Body

`VB.vbeast`: the villager's 25 joints with longer, thinner proportions (hips 1.15 m, long neck, arms 0.38 + 0.37 m), about **2.2 m** to the top of the head, 2.5 m to the ear tips. Inside a body group `vbody` (scaled and spun only by Appear).

- **Head**: big bald cranium, angry brow ridges slanting down to the nose, deep dark sockets with glowing eyes, a flat bat snout with an upturned nose leaf, gaunt cheeks, a wide red mouth with a row of small teeth and two long fangs. The lower jaw `g_jaw` carries the lower lip, teeth, fangs and the tongue. Big bat ears, broad at the base, pointing up and out.
- Long thin neck with tendons; narrow ribcage with the ribs and sternum showing, collarbones, shoulder blades and spine knobs on a hunched back; sunken belly; bony hips.
- **Arms are wings**: thin arms with knobby elbows, a short palm with a hooked thumb claw (on `thumb_`), and four long, straight wing fingers `wf0_*`…`wf3_*` (1.3, 1.45, 1.25, 1.0 m, small claws at the tips) that turn about the palm's normal: folded along the forearm or fanned open. Wingspan about 5 m.
- **Membrane**: one flat skinned mesh per wing (`vwing_L`, `vwing_R`), like the owner's bat-wing reference: three panels between the fingers with a scalloped trailing edge, one big panel from the arm and the last finger back to the side of the chest, the waist and the hip (its trailing edge dips in behind the forearm; the legs stay free to kick), and a small one in front of the elbow. Each corner is bound to one joint (the scallops between two fingers to both), so the panels stretch and fold with the bones and stay flat and straight.
- **Feet**: thin legs, knobby knees, long bird-like feet with three front toes and one back toe (`tt0_*`…`tt3_*`, outer joints `tu0_*`…`tu3_*`) and black talons; the toes curl (0 spread, 1 clenched).
- Hidden helpers: smoke `vsmoke`/`vsmoke_*` (the phase 1 puffs, used by Appear) and three screech rings `vring_0..2`.

## Clips (13)

| Clip | Length | Loop | What it does |
|---|---|---|---|
| Idle | 4.4 s | loop | Hovers with slow, heavy wing beats (1.1 s), legs hanging with the talons curled, looking round |
| Fly | 1.6 s | loop | Flies forward almost level, the wings beating hard, legs trailing behind (4 m/s) |
| Idle (war mode) | 2.4 s | loop | Hovers higher with quick beats (0.8 s), leaning in, knees drawn up with the talons open, mouth open |
| Fly (war mode) | 1.6 s | loop | Swoops forward leaning in, talons thrust ahead and open, mouth wide (3 m/s) |
| Appear | 3.6 s | once | The phase 1 smoke gathers, he grows out of it spinning, wrapped in his wings; the smoke clears, the wings burst open, he screeches (rings) and starts beating |
| Talon strike | 1.5 s | once | Draws the knees up with the wings high, lunges on a hard downstroke and kicks forward with both feet; the talons clench and rake down |
| Talon flurry | 1.8 s | once | Leans back in the air and kicks left, right, left, each set of talons clenching as it strikes |
| Dive kick | 2.6 s | once | Climbs about 0.65 m, folds the wings back and dives feet first about 1.3 m forward; the talons clench on impact and he beats back up |
| Blood feast | 4.6 s | once | Swoops in with the wings wide, seizes the enemy with his talons, brings both arms round in front so the wings close over the enemy like a bell, bites and gulps three times, then rips free, flinging the wings open and kicking off |
| Screech | 2.8 s | once | Rears back with the wings spread wide, thrusts the head forward and shrieks; three rings of sound fly out of the mouth |
| Hit 1 | 0.9 s | once | Knocked back through the air, head snapping back, wings jerking up, legs swinging forward |
| Hit 2 | 1.0 s | once | Struck from the right: twists away and drifts aside, one wing folding up |
| Death | 3.4 s | once, held | Shrieks with the wings flung up, they crumple and he drops out of the air onto his back, the wings spread flat on the ground and the talons curled up; one last twitch of a wing |

One-shot clips are followed by Idle (war mode); Death holds its last frame. For Blood feast the enemy stands about 0.5 m in front, the wings close round them at chest height.

## How the clips are built (`vampireBeastClips`)

- Pose channels: `alt` hip height above standing and `HP` hip offset; body joints `h sp ch nk hd` (wrSolve keeps the head level as the body leans); feet `FL`/`FR` as ankle positions in the hips' frame plus the foot's pitch, `KN` knee direction in the hips' frame, `tl` toe curl.
- Wings: wrist targets `gL`/`gR` and elbow poles `pL`/`pR` in the **wing frame** (the chest's frame tilted back by `wp`, so the beats stay vertical when the body leans into flight), spread `sL`/`sR` (0 folded, 1 open), wrists `wl`/`wr` (x turns the whole fan). Hands are bent only by the keyed wrists, never aimed.
- Elbow poles: the keyed pole, unless it would roll the upper arm too far about itself; a search round the shoulder-to-wrist line (96 candidates) scores distance from the keyed pole (`pw` weights it), the upper arm's roll and frame-to-frame continuity.
- `cl` rolls the collarbone (`shoulder_*`) about x. Death uses −90° so the elbows can point at the feet with the wings flat on the ground without twisting the upper arms.
- wrSolve never lets the toes point up (planted feet); for kicks and the dead feet the foot is turned up after the solve.
- One wing beat (`VBB_BEAT`): the wrist path through the stroke (top, mid down, bottom, mid up pulled in, near the top), spread (open on the downstroke, folded on the upstroke) and a little feathering, as periodic curves. Looping clips run whole beats; one-shot clips key their own wing poses and blend the beat in and out by weight (`BT`: beat phase and weight keyed over time).
- Extra tracks baked into every clip: wing fingers, toes, jaw, body group (scale about 1.65 m and spin), smoke (Appear only), rings (Screech, Appear). The membrane needs no tracks: it is skinned to the joints (`vbbWing`, bound with the fingers fanned open). Fly holds the body level (about 80°) with the wing frame matched, so the whole wing lies in one plane mid-stroke; the beat's upstroke stays below about 50°. Death is recorded at 60 fps.

## Checks done

- `node tools/check-character.mjs vampire-beast` (the checker now also tests skinned meshes against the ground, vertex by vertex) for seeds 1, 2, 3, 7 and a colour combination: every clip passes (largest upper-arm roll 87° in Blood feast, per-frame jumps 24° or less, nothing below the ground, Death pile 0.42 m).
- Contact sheets of every clip from the front, side and above, Day, Dusk and Night (eyes and rings glow); GLB export (2.6 MB, with the two wing skins).
