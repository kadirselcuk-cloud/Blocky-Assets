# Demon Prince

A balrog-like fire demon, the owner's request: "basically a balrog, made to look like the balrog from the Lord of the Rings" (`demon-prince`, Characters → Enemies → Hell). Code: `src/characters/demon_prince.js`.

Open it: `http://localhost:<port>/#/a/demon-prince` (default seed 14: charred black skin, orange fire, great horns, burning sword).

About **4.2 m** to the top of the head (4.7 m to the horn tips), hunched and massive, a whip of fire in the left hand and a burning weapon in the right. He walks; he does not fly (the wings stay half closed on the ground and spread in Roar, Flame burst and Wing buffet).

## Options

| Option | Choices (default first) | Notes |
|---|---|---|
| Right hand | Random, Burning curved sword, Fiery axe, Burning flail | Random rolls the sword twice as often |
| Skin | Random, Charred black, Ash grey, Smouldering brown | Random rolls charred twice as often |
| Fire | Random, Orange, Crimson, Hellfire green | Emissive: eyes, lava cracks, the mouth, the mane, the whip, the weapon's edge and fire. Random rolls orange most often |
| Horns | Random, Great (forward), Ram, Swept back | Black and ridged; great horns sweep out and forward like a bull's (the film look) |

## Body

`VB.dprince`: the devil lord's torso and arms x `DP_F` 1.9 with broader shoulders and the fiend's goat legs x `DP_LG` 1.4, on the villager's 25 joints in a body group `vbody`, in real metres (meshes are authored in devil-lord units and scaled, no group scale). The warrior's IK (`wrSolve`) fits unchanged and the devil lord's clip keys carry over (they are in units of `legS`). A hunch (`DP_HUNCH`: spine, chest and neck pitched forward, head levelled) is added to every pose.

- **Skin**: rock-black plates (lighter and darker boxes) crossed by glowing lava cracks on the chest, waist, back, arms, legs and face.
- **Head position**: like the film's balrog, the head sits at the front on a neck leaning forward: the neck rises out of the top of the chest between the shoulders (neck joint 0.53 m up, 0.19 m forward of the chest joint) and leans forward, tilted 7° up from level (group inside `neck`), short and thick, about 0.55 m, rounded (four rings, each a box plus the same box turned 45° about the neck, so the cross-section is eight-sided) tapering from 0.55 m to 0.36 m wide, muscle bands along the sides, small spines along the top, a glowing seam under the throat; the head sits at its end (0.1 m up, 0.53 m forward of the neck joint), and the hunch (`DP_HUNCH`: spine 4°, chest 12°, neck 8° forward, head levelled) keeps it at shoulder height.
- **Head**: skull with a crown plate, a heavy brow slanting down to the middle over deep sockets with glowing eyes (white-hot pupils), a broad low upper jaw with nostrils, a glowing line of fire along the mouth, upper fangs, cheek spikes swept back; the jaw `g_jaw` opens onto fire inside.
- **Spikes**: on the shoulders (angled out), elbows, forearms, and down the back (pointing back).
- **Upper body**: chest, waist, neck, hips and arms made broader and deeper (a bulk pass after building: chest x 1.24 wide, 1.22 deep; upper arms x 1.32, forearms x 1.3).
- **Hands**: big clawed hands.
- **Legs and hooves** (the owner asked for strong legs and hooves, like a real balrog): the fiend's goat legs x 1.4 in rock skin with lava cracks: a heavy haunch with big quads and hamstrings forward to the knee, a thick-muscled shin back down to a raised hock, a long cannon bone (an ember seam down the front) to the fetlock with dewclaws, and a big cloven hoof standing on its toes (two wedge-shaped horn-brown claws stepping up towards the heel, a glowing cleft). The hips stand lower than the straight leg reaches (2.13 m against 2.64 m), so the knee always bends forward; the IK ankle is the hock and the warrior IK's heel lift is off (`R.noHeel`). `legS` is kept at the devil lord's x 1.9, so his keys carry over; the feet are keyed 1.3x further apart.
- **Wings** `dwing_L/R` / `dwingO_L/R` (after the film: huge bat wings held raised and half open, a membrane of shadow whose edges dissolve into smoke): a thick arm bone to the wrist with a hooked thumb claw, four long fingers fanning downward from the wrist (`DP_FING`: -20°, -50°, -78°, -105° from straight out, 0.65–1.0 wing units, about 2.3–3.5 m), so the wing rises to the wrist and faces down after half its length, with glowing undersides and claws at the tips, a dark torn membrane in fan slices (`DP_WSL`) with scalloped edges and a few holes. About 10 m span. Held raised and half open held lower, the outer half drooping from the wrist (`wg` [12,18,10,20,-28], war [10,12,8,10,-24]); laid flat on the ground in Death.
- **Wing smoke** (`DP_WSMOKE`, cubes `dpk_*`): 48 dark cubes (a few embers) always drifting up off the wings' edges.
- **Tail** `dptail_0..17`: about 3.6 m, very thick at the root (0.58 m) and tapering to a thin end (0.07 m), spines along the top, cracks, a claw spike at the end, no flame. The 14 tail-curl keys are spread over the 18 segments.
- **Fire mane** (`DP_MANE`, cubes `dpf_*`): the efreet's square smoke: 94 cubes in three fire shades on the head, neck, shoulders, upper back and waist, born on the body, swelling, then shrinking and darkening as they rise and drift. `fi` scales them (Idle 1, war 1.15, Roar about 2, Flame burst 2.6, Death down to embers).
- **Black smoke** (`DP_SMOKE`, cubes `dps_*`): 44 big dark cubes rising slowly from the body, growing as they go; `sm` scales them (only in Death and Dead).
- Effect cubes are flagged `userData.gear` (not body).

## Weapons

| Weapon | Build |
|---|---|
| Whip (left) | Leather handle with glowing bands and an iron pommel; a 4.5 m lash of 14 tapering glowing segments `dpw_0..13` with braid bands, a hot tip; 20 fire cubes `dpz_*` rise off it |
| Burning curved sword | About 2.2 m: black iron curved blade with a molten edge and glowing runes in the fuller, eight-sided guard (no cross); 30 fire cubes `dpq_*` rise off the blade |
| Fiery axe | 2.5 m haft with iron bands, a crescent bit with a molten edge, back spike and top spike; 24 fire cubes on the head |
| Burning flail | Banded handle, a chain of five links `dpc_0..4` and the ball's stem `dpc_5` carrying a spiked iron ball with glowing seams and a hot core; 24 fire cubes on the ball |

### Ropes (the lash and the chain)

Simulated while the clips are made and baked into quaternion tracks (`DP_ROPE`, `ropeStep`): verlet points from the anchor at the end of the handle, 240 Hz substeps, fixed segment lengths, gravity and damping, a light pull of the first segment along the handle, no sharp folds (points two apart stay 1.2 segment lengths apart), the ground with friction (in the gaits the ground slides back at the walking speed, so the lash trails behind), capsules round the torso, head, legs, feet, arms and tail. Then every frame is smoothed (two [1,2,1] passes), loops are bent so the last frame meets the first, one-shot clips start from the rope at rest in their first pose and blend back to it in the last half second, and each frame is rebuilt from the anchor with exact lengths, bends of at most 110° and every point above its ground height.

## Clips (18)

| Clip | Length | Loop | What it does |
|---|---|---|---|
| Idle | 5.0 s | loop | Stands hunched and heavy, the lash lying out before him, the weapon low; breathes and looks round, the mane flickering |
| Walk | 1.5 s | loop | Slow heavy stride, the lash dragging behind (about 1 m/s) |
| Idle (war mode) | 2.6 s | loop | Left foot forward, whip held out, weapon raised, wings half open, fire higher |
| Walk (war mode) | 1.4 s | loop | Advances, whip and weapon ready |
| Whip crack | 2.0 s | once | Raises the whip high over his head, then snaps it forward and down: the lash flies over and cracks out before him |
| Whip lash | 1.9 s | once | Draws the whip across to his right, then lashes it out to the left at waist height |
| Attack 1 | 1.5 s | once | Weapon raised beside the right shoulder, cut down and across with a step in |
| Attack 2 | 2.1 s | once | The same cut, then a backhand cut out to the right |
| Heavy attack | 2.4 s | once | Rears up with the weapon high over his head and smashes it into the ground before him |
| Wing buffet | 1.6 s | once | Wings high and back, slammed forward |
| Tail lash | 1.6 s | once | Turns away and whips the tail round his right side |
| Roar | 2.8 s | once | Arms and wings spread wide, roars, the mane flares up |
| Flame burst | 3.2 s | once | Crouches with the fire sinking low, rears up with arms and wings flung wide as the fire bursts out (burst at 1.2 s; the effect is added separately) |
| Hit 1 | 0.9 s | once | Blow to the face |
| Hit 2 | 1.1 s | once | Struck from the right, catches himself with a step |
| Heavy hit | 2.5 s | once | Knocked onto his left knee, rises |
| Death | 3.2 s | once → Dead | Reels, sinks onto his knees and lets go of the whip and the weapon (they fall and lie flat beside him), roars, pitches forward and falls face down, the wings laid out flat on the ground and the tail falling down behind him to lie on the ground (away from the head); the fire dies to embers and black smoke rises |
| Dead (smouldering) | 4.0 s | loop | Lies still, the embers flickering, black smoke rising |

One-shot clips are followed by Idle (war mode); Death by Dead (smouldering) (`clip.nextAlways`, so the viewer plays it after a Death clip too).

## How the clips are built (`dpClips`)

- Standing clips: the devil lord's machinery (the succubus's arms with a carried prop in each hand, elbow poles by a cost search, clamped wrists, a prop that would go below the ground lifts its hand), the wing beat and the tail with ground lift. One-shot clips at 60 fps, loops at 30.
- Death and Dead: keyed joint angles (the fiend's way, `gbDeathKeys`) on the rig, the feet anchored while they stand, the body dropped onto its lowest point every frame (`solveFK`); the weapons are let go at 1.0 s (right) and 1.12 s (left), fall under gravity and lie flat 0.95 m out from where they were held (tracks on `weapon_L/R`); lying, a wing that would go into the ground eases off its downward tilt. Made per weapon and horns (the head rests on them); the other clips per weapon.
- Extra tracks: wings, tail, jaw, body group, the ropes, the weapon groups, the fire and smoke cubes (whole cycles per clip, so loops close).

## Checks done

- `node tools/check-character.mjs demon-prince` for every weapon (seed 14) and the other horns and skins (seed 2, ram; Death for all three horns): every clip passes jumps, twists and the ground, except **Death: PILE TOO HIGH (1.44–1.49 m)**: a 4.2 m giant with a bulky chest lying face down is that thick (hips 0.73 m up), plus the horns of the head turned to the side.2 m giant with a bulky chest lying face down is that thick, and the great horns stand up from the head turned to the side, like the fiend (1.05 m) and the oni (0.92 m).
- Viewer: the head close up, Idle, war Idle, the whip crack from the side, Roar at Night, Death and Dead from two angles.

## Possible extras (not added)

Flight clips (Take off, Fly, Land), fire effects for the whip crack and Flame burst, a multi-tailed whip.
