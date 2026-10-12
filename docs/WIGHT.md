# Wight

The wight enemy (`wight`, Characters → Enemies → Undead). Code: `src/characters/wight.js`.

Open it: `http://localhost:<port>/#/a/wight`

## Options

| Option | Choices (default first) | Notes |
|---|---|---|
| Hair length | Random, Shoulder-length, Long, Very long | Back curtain 0.3 / 0.5 / 0.74 m, front locks 0.2 / 0.34 / 0.46 m. Random rolls Long most often |
| Hair style | Random, Full, Thinning crown | Thinning: a bald, darker crown with a few tufts and narrower, straggly strands |
| Hair colour | Random, White, Grey, Black, Dark brown, Faded blond | Random rolls White most often |
| Skin | Random, Pale grey, Corpse blue, Ashen, Withered dark | |
| Eyes | Random, Icy blue glow, Pale green glow, Red glow | Emissive (show most at dusk and night) |
| Clothes | Random, Tattered tunic, Rusted mail shirt, Bare chest | The tunic colour is rolled from five faded colours |

"New look" also rolls the tunic colour, a bronze circlet (about 1 in 3) and a torn patch on the tunic.

## Body

`VB.wight` is the villager male's proportions on the villager's 25 joints (so the warrior's IK, `wrSolve`, fits unchanged): about **1.82 m standing straight**, but it never straightens. The relaxed stance stands **1.46 m** (bent knees, bowed back, head pushed forward) and the war stance **1.44 m**.

- Gaunt torso with collarbones and spine knobs; ribs show when bare. Thin arms with bony elbows.
- **Very large clawed hands**: a long, broad bony palm (0.16 × 0.15 m) and four fingers spread about 2 cm apart and fanned outwards, each its own piece (proximal in `fingers_*`, distal in `fingerTips_*`). Lengths like a real hand: index (next to the thumb) 0.88, middle 1.15 (the longest), ring 0.86, pinky 0.68; thickness and claw size follow. Every finger ends in a long black claw of three tapering boxes that hooks towards the palm. The thumb (two segments and a claw, about the size of the index finger) is splayed about 40° away from the fingers, so the hand reads open.
- **Long clawed feet** (0.30 m heel to toe): four separate toes, each with a black claw curving down over the tip. `VB.wight.g` is 1.45, so the IK foot (heel and toe points in `wrSolve`) is as long as the mesh and a toe-down foot never digs in.
- Head: long gaunt skull, sunken cheeks, deep sockets with glowing eyes, slit nose, thin lips drawn back over the upper teeth. `g_jaw` is the lower jaw, hinged under the ears, opened by every clip.
- Legs wrapped in cloth strips.
- **Hair**: a cap on the skull (full, or a thinning crown with a fringe round the back and sides) plus three chains of segments that hang: the back curtain `hair_B_0…n` (2–5 segments) and two front locks `hair_L_*`, `hair_R_*` beside the face (2–4 segments).

## Clips (15)

| Clip | Length | Loop | What it does |
|---|---|---|---|
| Idle | 5.0 s | loop | Crouched, breathing; the head turns and twitches, the claws flex |
| Walk | 1.4 s | loop | Stalking crouched walk, arms hanging, about 0.5 m/s |
| Run | 0.8 s | loop | Low loping run, leaning in, claws swinging, about 2.4 m/s |
| Idle (war mode) | 2.4 s | loop | Low and wide, both claws raised, hissing |
| Walk (war mode) | 1.3 s | loop | Stalking forward with the claws raised, about 0.5 m/s |
| Attack 1 | 1.46 s | once | Right claw: winds up and rakes across from the right, with a step in |
| Attack 2 | 1.46 s | once | Left claw: the same from the left |
| Attack 3 | 1.7 s | once | Both claws raised high and raked straight down together |
| Lunge & rake | 2.1 s | once | Lunges in and rakes right, left, right, then pulls back |
| Shriek | 2.4 s | once | Straightens a little, throws the head back and shrieks, claws spread wide |
| Hit 1 | 0.8 s | once | Head snaps back, jaw flies open |
| Hit 2 | 1.1 s | once | Struck from the right: twists away a step, then turns back in |
| Heavy hit | 1.8 s | once | Knocked back two steps, then stalks in again |
| Death | 2.4 s | once, held | Shudders, drops onto its knees and pitches forward face down, arms along its sides, palms down |
| Rise | 4.5 s | once | Claws twitch, the hands slide up beside the shoulders along the ground, pushes up onto hands and knees, kneels, plants a foot and rises into the war stance |

Every combat clip starts and ends on the war stance; Death ends where Rise starts.

## How the clips are built (`wightClips`)

- Two stances, relaxed (`WT_N`) and war (`WT_W`), keyed in the warrior's IK terms (hip offset, feet, both hand grips). `jw` opens the jaw (radians), written to `g_jaw.quaternion`.
- **Hand targets are in the torso's frame**: they turn about the hips with the body's total yaw (hips + spine + chest), so a twisting torso carries both arms and a free hand never ends up behind its shoulder.
- **Hands are not aimed**: each follows its forearm, bent only by keyed wrist angles `wr` (right) and `wl` (left), both written in the same terms (x tips the hand, z bends the claws back or curls them); the left is mirrored when solved.
- **Elbow poles are chosen, not keyed**. After a first solve places the body, every pole angle round the shoulder-to-hand line is scored: the upper arm's roll about its own bone (the same measure as the checker), an elbow pointing into the body, up or far out, and the distance from last frame's elbow. After the first frame only poles within 30° of last frame's elbow are tried, so no elbow flips. Looping clips first run one warm-up cycle through the solver, so the elbows start where the cycle ends and the loop seam never turns an arm over (the checker does not compare a loop's last frame with its first; every loop seam was checked separately: 0°). A hand target is never closer than 0.4 m to its shoulder.
- Gaits (`GAIT`): in-place IK, planted feet slide back at one steady speed (`clip.speed`), the hands ride with the hips.
- Death and Rise (`wtFalls`): keyed joint angles (`gbDeathKeys`) on a bare wight that is dropped onto its lowest point every frame, as the troll's falls. Death ends with the palms flat on the ground so the body rests on its torso, not on the big hands; Rise keeps it there while the claws twitch, then slides the hands out along the ground (elbows out) before pushing, so the body rises smoothly instead of being propped up in one jump.
- **Hair (`wtHairTracks`)** is added to every clip after it is made: each frame the model is posed and every chain laid segment by segment. A segment leaves the skull along its growth direction (stiff near the root), then hangs to the ground, trailing a little behind fast moves. Its end is pushed out of the head, neck, torso and arm boxes (meshes flagged `userData.hairCol`) and kept above the ground; when it lies on the ground it turns flat and slides away from the head. Death and Rise sample the hair at 60 fps. Hair tracks are cached per length and style.

## Checks done

- `node tools/check-character.mjs wight` for every hair length × style (the only options that change the rig) and seeds 1, 4, 5 and 7: every clip passes (largest arm twist about 90°, in the Run; per-frame flips under 25°, nothing below the ground, Death pile 0.44 m).
- Contact sheets of the stances, walks, run, attacks, shriek, Death and Rise from the front, side, back and above; Day, Dusk and Night (eye glow).
- GLB export works (4.3–5.5 MB raw with animations, depending on hair length; the ghoul is 3.6 MB the same way).
