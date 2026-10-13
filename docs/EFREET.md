# Efreet

The efreet (`efreet`, Characters → Enemies → Hell). Code: `src/characters/efreet.js`.

Open it: `http://localhost:<port>/#/a/efreet`

A fire genie, about **3.4 m** to the top of the head, who never touches the ground: right under his wide sash his body turns into a big whirling tail of fire that ends about 0.3 m above the ground.

## Options

| Option | Choices (default first) | Notes |
|---|---|---|
| Skin | Random, Crimson red, Ember orange, Bronze, Charcoal | Random rolls crimson twice as often |
| Fire | Random, Orange, Crimson, Blue, Green | Tail, the flames under the sash, eyes, inside of the mouth, the scimitar blade. Random rolls orange twice as often |
| Head | Random, Topknot, Jewelled turban, Horns | Topknot: bald with a black hair topknot in a gold ring, its tail falling back. Turban: wrapped turban with a gold-set red gem. Horns: bald with two big dark horns curving out and up (no topknot). No flames on the head |
| Weapon | Flame scimitar, None | |

"New look" also rolls the clothes (wine, indigo, black or emerald vest with a gold or crimson sash), the beard (black, flame or none), gold ear hoops and a scar on the belly.

## Body

`VB.efreet` is the oni's rig (`VB.oni`, real metres, the villager's 25 joints) so the revenant's solver fits unchanged. All of it sits in a body group `ebody` (scaled and spun only by Death and Appear).

- **Torso**: the oni's muscles (six-pack, broad chest, big pecs, traps), an open vest with gold trim over the sides and back, a gold torc.
- **Head**: big; glowing eyes in dark sockets under slanting brows, a hooked nose, a grin of teeth with fangs, pointed ears swept back (gold hoops). The lower face is the jaw `g_jaw`; it opens onto a glowing mouth. Moustache and pointed beard (the beard is on the jaw).
- **Arms**: the oni's arms with gold arm rings, wide gold bracers set with a red gem, big hands with dark nails.
- **Hips**: a wide sash with folds, a knot and two hanging ends, a gold medallion; below it only a thin band of trousers, hidden by a ring of flames that licks up to just under the sash.
- **Legs**: joints only, nothing drawn. The clips keep the feet under the hips (so the IK never pulls the hips down) and then let the legs hang straight.
- **Tail** `etail_0..7`: eight fire segments starting just under the sash, about 1 m wide at the top (a box in one fire shade crossed by a narrower, deeper box in another, alternating), with tongues licking up, the last one ending in a hot point. The top two segments keep the hips' facing; the lower ones spin. Built at unit height; the tracks stretch each segment between two points of the tail curve.

## Weapon (`efScimitar`)

`ef_wpn_R` in the right hand socket (the revenant's frame: grip through the fist, the blade along the thumb side, the edge leading). A 1.3 m curved blade made of flame in eight pieces, widening towards a clipped tip and curving back: fire-coloured body, a deep core line, a hot edge; square smoke rises off it (36 cubes `efp_*`, `efq_*` on the dropped copy) in the blade's three fire shades; an eight-sided gold disc guard (no cross), leather grip with gold bands, gold pommel. `ef_drop` is a copy at the root, shown only when Death lets the blade fall.

## Clips (17)

| Clip | Length | Loop | What it does |
|---|---|---|---|
| Idle | 4.0 s | loop | Floats with the left fist on the hip, the scimitar low and forward, bobbing, looking around |
| Float | 2.0 s | loop | Glides forward leaning in, arms back, the tail streaming behind (1.6 m/s) |
| Idle (war mode) | 2.6 s | loop | Scimitar raised upright, left hand open in front |
| Float (war mode) | 1.8 s | loop | Advances through the air, scimitar raised, tail trailing (1.2 m/s) |
| Attack 1 | 1.5 s | once | Diagonal slash from high on the right down across the body, gliding in |
| Attack 2 | 1.6 s | once | Flat sweep from right to left, the arm out wide |
| Attack 3 | 1.2 s | once | Burning fist: straight left punch, lunging through the air |
| Heavy attack | 2.2 s | once | Rises high with the scimitar overhead, dives forward and smashes it into the ground |
| Spell 1 | 2.0 s | once | Fire bolt: draws the open left hand back at the side, thrusts it forward and hurls |
| Spell 2 | 2.8 s | once | Eruption: rises with both arms flung up, then sweeps the left palm down at the ground ahead |
| Spell 3 | 2.8 s | once | Fire breath: breathes in, leans in with the jaw wide, sweeps the head left to right |
| Taunt | 3.0 s | once | Fists on hips, throws the head back and laughs (the jaw and body shake) |
| Hit 1 | 0.8 s | once | Blow to the chest, rocks back through the air |
| Hit 2 | 0.9 s | once | Blow from the left, twists and drifts away |
| Heavy hit | 1.6 s | once | Hurled back through the air (the tail swings forward), then glides in again |
| Death | 3.0 s | once, held | Recoils, doubles over and lets the scimitar fall (it lands flat beside him), flings the arms up with a cry, then whirls down into his tail of fire and burns out; nothing is left but the blade |
| Appear | 2.8 s | once | Whirls up out of a point of fire, growing as he spins, bursts open with the arms flung up, laughs and raises the scimitar |

One-shot clips are followed by Idle (war mode); Death is held (`clip.hold`). The spells are gestures only: the fire effects are left to be added separately.

## How the clips are built (`efreetClips`)

- **The revenant's solver** (`rvSolver`) on the efreet's rig (`efRig`) with the oni's ground tilt for the blade (`efSolver`): hand targets from the shoulders, elbow poles by cost search, wrists in closed form, clamped and rate-limited. Keys in body units (metres / `legS`); HP y 0.2 floats the hips 0.29 m above the oni's standing height. The attacks and hits are the oni's keys, floating, gliding instead of stepping.
- Extra keyed channels: `jw` (jaw), `bs` (body scale), `sn` (body spin), `ts` (tail stream: 1 trails it back in Float, negative swings it forward when knocked back).
- **Extras baked every frame**: the tail curve runs from under the trousers (following the hips) down to a point above the ground, swirling in a spiral and streaming with `ts`; each segment is placed, turned, spun about its own axis and stretched between two points. Every clip also moves the square smoke (after the owner's voxel-fire reference): each cube is born just off a face of the blade, swells, then shrinks as it rises straight up in the world and drifts; the bright ones are biggest and stay low, the dark ones are smallest and rise highest (up to about 0.5 m), whole cycles per clip, kept above the ground. On the dropped blade it goes on after Death. Empty groups keep the tracks bound when there is no weapon. Phases use whole cycles per clip, so loops close; loops are pre-rolled and their last frame is the first.
- **Death** (60 fps): the hand blade's world matrix is taken from a bare efreet posed like the clip (`poseM`); at 0.72 s `ef_wpn_R` is hidden and `ef_drop` takes over, falling under gravity and turning to lie flat, a flat side down, 0.45 m out from the body (the oni's `restOf`).

## Checks done

- `node tools/check-character.mjs efreet` for both weapon options × three heads × seeds 1–3: every clip passes (largest per-frame joint turn 20°, largest arm twist 86°, nothing below the ground; the Death pile is empty, he burns out).
- Blade against the body boxes, every clip at 20 fps: at most 12 mm (the pommel against the end of the bracer when the wrist bends); never the head or torso.
- Viewer: contact sheets of the stances, attacks, spells, taunt, Death and Appear from the front, sides and quarter; a lineup of skins, fires, heads and weapons; Day, Dusk and Night (fire, eyes and gems glow).
