# Revenant

The revenant enemy (`revenant`, Characters → Enemies → Undead). Code: `src/characters/revenant.js`.

Open it: `http://localhost:<port>/#/a/revenant`

A big undead warrior in heavy, decayed plate, with a one-handed weapon in each hand.

## Options

| Option | Choices (default first) | Notes |
|---|---|---|
| Right hand | Random, Short sword, Axe, Mace | |
| Left hand | Random, Short sword, Axe, Mace | Any mix with the right hand |
| Helmet | Random, Great helm, Horned, Crowned, Open (face shows) | Closed helms show the eyes glowing deep in a plain eye slit; Random rolls the great helm most often |
| Armour | Random, Blackened, Rusted, Pale old steel | Plate, darker lames and tarnished trim; Random rolls blackened most often |
| Eyes | Random, Icy blue glow, Pale green glow, Red glow, Violet glow | Emissive (show most at dusk and night) |

## Body

`VB.revenant`: the warrior's legs, a longer torso, broad shoulders (`shW` 0.3) and hips, thick arms and big gauntlets (`g` 1.3, `hand` 1.15), on the villager's 25 joints, so the warrior's IK (`wrSolve`) fits unchanged. The body is built in a group scaled by `RV_SC` = 1.12: about **2.2 m** standing (2.17 m in the war stance with the great helm, 2.27 m with horns). Clips stay in body units; walking speeds and their notes are multiplied by `RV_SC`.

- Plate over mail: breast and back plate with a middle ridge (no cross), belly lames, fauld and belt, gorget; layered pauldrons, rerebraces, elbow cops, vambraces, plated gauntlets; tassets and cuisses on the thighs, knee cops, greaves, sabatons. Rust patches and dents.
- No gaps: the belly core reaches into the hips and under the breastplate, the gorget up into the helmet, the cuisses down to the knee and the greaves up to the knee cop, so nothing opens when it bends.
- Groin and seat are a plated skirt (two lames) in the armour's own colours; the little mail that shows (sleeves, under the tassets) is tinted from the armour's dark colour, so every finish stays one colour scheme.
- The sabaton's sole sits 5 mm above the IK sole, so fast heel strikes sampled between frames never dip into the ground.
- Head: great helm (eye slit, two short rows of breathing holes on the right), horned (horns go out and curve up), crowned (a crude undead crown sitting askew: uneven tarnished and rusted band segments, a dent, jagged spikes of different heights leaning every way, one snapped off, an empty gem socket), or open (skull cap, cheek plates, neck guard) over a withered grey face with sunken glowing eyes and bare teeth. The eyes are in their own group `g_eyes`, its origin between the eyes so the Death/Rise scale track shrinks and flares them in place.
- The fists stay closed (`userData.post`).

## Weapons (`rvWeapon`)

`rv_wpn_R` and `rv_wpn_L` in the hand sockets, the same frame as the skeleton's weapons: grip through the fist, blade or head along the thumb side, edge towards the fingers. Body units:

| Weapon | Size | Build |
|---|---|---|
| Short sword | 0.7 long | Wrapped grip, small pommel, guard, tapering blade with a dark fuller and rust |
| Axe | 0.56 long | Wooden haft, bearded head (the blade drops below the cheek), back spike |
| Mace | 0.68 long | Wooden haft, iron collar, flanged head (six flanges) and cap |

The grips end just past the fist, so the pommel only grazes the vambrace at the strongest wrist bends.

## Clips (19)

| Clip | Length | Loop | What it does |
|---|---|---|---|
| Idle | 4.0 s | loop | Heavy breathing, weapons held low |
| Walk | 1.3 s | loop | Heavy, deliberate steps, weapons low, about 0.7 m/s |
| Run | 0.8 s | loop | Lumbering run, weapons forward, about 2.8 m/s |
| Idle (war mode) | 2.6 s | loop | Right weapon raised by the shoulder, left held out in guard |
| Walk (war mode) | 1.2 s | loop | Guard up, steady advance, about 0.7 m/s |
| Run (war mode) | 0.76 s | loop | Charging, both weapons ready, about 2.9 m/s |
| Attack 1 | 1.2 s | once | Right weapon: diagonal slash from the right shoulder, with a step in |
| Attack 2 | 1.2 s | once | Left weapon: the same from the left shoulder |
| Attack 3 | 1.3 s | once | Both weapons raised overhead and chopped straight down together |
| Attack 4 | 1.35 s | once | Both weapons swung out wide, then swept in across the front, one above the other |
| Heavy attack | 1.9 s | once | Crouches, leaps forward and smashes both weapons into the ground |
| Block | 1.4 s | once | Both weapons up side by side in front of the face, takes the blow and pushes back |
| Roar | 2.6 s | once | Arms and weapons flung wide and up, head thrown back |
| Taunt | 2.6 s | once | Clashes the weapon heads together twice (they meet, never cross), then spreads the arms |
| Hit 1 | 0.75 s | once | Blow to the chest, rocks back |
| Hit 2 | 0.85 s | once | Blow from the left, twists and bends away |
| Heavy hit | 1.6 s | once | Knocked back two steps, then steps in again |
| Death | 2.6 s | once, held | Recoils, sinks onto its knees, the weapons slip from its hands and fall flat beside it, the eyes go out, it pitches forward face down |
| Rise | 4.6 s | once | The eyes light again; it pushes up onto hands and knees, kneels, the weapons fly back into its fists, it stands into the war stance |

Every one-shot clip names `Idle (war mode)` as `clip.next` (Death is held). Combat clips start and end on the war stance; Death ends where Rise starts.

## How the clips are built

- **Stances**: relaxed `RV_N` and war `RV_W`, in the warrior's IK terms (hip offset, feet, both hand targets, both weapon directions `dR`/`dL`).
- **Hand targets** are in the torso's frame (they turn with the total yaw of hips, spine and chest). A key can also give a target as `{s:[dx,dy,dz]}`: an offset from that shoulder, worked out from the key's own body pose (`S.abs`). All combat keys use this, so a lean that carries the shoulders forward keeps the arms extended (hip-relative targets left the arms folded at the chest).
- **Weapons are pointed by the wrist, within limits**: the weapon runs along the socket's z, so a wanted direction gives the wrist angles in closed form (x deviation, y twist about the forearm). They are clamped (`RV_WX` −70…72°, `RV_WY` ±85°: the forearm has no twist joint, so the hand's twist stands in for pronation and stays under the checker's 100°) and **rate-limited** (`RV_WR` 20° per frame), so a wrist can lag a fast swing but never flip. Where a direction is out of reach the weapon points as near as it can; `clip.rvMiss` keeps the largest miss per hand.
- **Elbow poles are chosen, not keyed** (the wight's cost search: upper-arm roll, elbow into the body, up, far out or forward, continuity) plus how well a clamped wrist can point the weapon from each candidate elbow, so elbow and weapon agree.
- **Rule for keys**: a weapon can only point to the thumb side of its forearm. With the forearm forward and the elbow down that is "up"; at the end of a chop the arm must be extended so the blade can sit just above the arm's line.
- **Loops are seamless**: every looping curve is periodic over the clip, and loops are pre-rolled one full cycle (so the elbow and wrist continuity carries over the seam) with the last frame set equal to the first.
- Gaits (`GAIT`): in-place IK, planted feet slide back at one steady speed (`clip.speed`), hands ride with the hips.
- **Death and Rise** (`rvFalls`): keyed joint angles (`gbDeathKeys`) on a bare revenant dropped onto its lowest point every frame (the wight's method). The weapons are let go on their knees (right 1.0 s, left 1.08 s), with the wrists turned so they point out to the sides; each falls under gravity and lies flat (blade along the ground) 0.22 m further out, lowest corner on the ground. In Rise they fly back in the socket's frame, turning to the grip angle first and arcing in from beyond the fingers, so they never pass through the forearm, and are kept above the ground. The eyes are a scale track on `g_eyes` (out at the end of Death, flaring back at the start of Rise). Made per weapon pair and helmet (the helmet changes how the head rests: on its side, or face down for horns and the crown so they lie flat). Every other clip is shared by all looks.

## Checks done

- `node tools/check-character.mjs revenant` passes every clip for all 9 weapon pairs (great and horned helms), all four helmets, and seeds 1–7. Death pile 0.46–0.54 m.
- Weapons against the body every frame (sampled points inside body boxes): only the pommel grazing its own vambrace at full wrist bend; nothing in Death or Rise.
- Viewer: contact sheets of the attacks, gaits, Block, Taunt, Death and Rise from the front, side, quarter and above; all four helmets and three armour finishes in Day, Dusk and Night.
