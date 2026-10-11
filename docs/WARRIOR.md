# Warrior

The warrior character (`warrior`, Characters → Warriors), what it can wear and hold, its animations, and how they are built. Code: `src/characters/warrior.js`.

Open it: `http://localhost:<port>/#/a/warrior`

## Options

| Option | Choices (default first) | Notes |
|---|---|---|
| Body | Male, Female | Bulky warrior body types, see below |
| Helmet | Leather (red glow), None | Hair that would poke through switches to a style that fits under |
| Armour | Plate (blue glow), None | Forces the short tunic and removes pouch and knife so the plates show |
| Gloves | Leather (orange glow), None | |
| Weapon | Sword, Battle axe (two-handed), None | |
| Shield | Round shield, None | In the left hand with the sword; slung on the back with the axe |

"New look" rolls face, skin, hair, beard, tunic type (short tunic, jerkin or tunic), legwear (wraps, hose or tall boots), hood and colours. The equipment stays as set in the options.

## Body type

The warrior uses the villager rig (25 joints) with its own proportions, `VB.warrior` and `VB.warriorF`, passed to `buildVillager` as `force.B`.

| | Male (`VB.warrior`) | Female (`VB.warriorF`) |
|---|---|---|
| Height | about 2.0 m | about 1.8 m |
| Shoulder half-width `shW` | 0.28 (villager 0.21) | 0.22 (villager 0.18) |
| Width scale `g` | 1.22 | 1.06 |
| Arm thickness `arm` | 1.15 | 1.1 |
| Torso depth `td` | 1.18 | 1.1 |
| Hip width `hipK` | 0.86 | 0.92 |
| Waist taper `waistK` | 0.9 | 0.95 |
| Hand size `hand` | 1.12 | 0.95 |
| Legs | thigh 0.44, shin 0.42, hip joints 0.085 apart from centre | villager female legs, hip joints 0.072 |

`arm`, `td`, `hipK` and `waistK` are optional body factors in `buildVillager` (default 1), so villagers are unchanged. The result is broad shoulders and a deep chest over a tapered waist, with hips narrowed so they still sit over the legs.

## Equipment

All built from boxes with the usual pixel textures. Glowing pieces use an emissive material (`wrGlow`) whose glow follows the texture; it is static and shows most at dusk and night.

- **Leather helmet (red glow):** cap, back plate, side plates, cheek guards, darker brow band and top ridge, two brass rivets.
- **Plate armour (blue glow):** breastplate with a centre ridge, neck guard (gorget) and collar plate; three belly lames; hip band with a leather belt and brass buckle; three-layer shoulder plates (pauldrons) and upper-arm plates; elbow plates and forearm plates (vambraces); thigh plates (cuisses) with a band; knee plates; shin plates (greaves); foot plates (sabatons) kept above the sole.
- **Leather gloves (orange glow):** hand, fingers, fingertips, thumb, and a flared cuff over the forearm or the vambrace.
- **Sword:** `wSword(.8,.075,.2)` in the right fist, blade along the thumb side.
- **Battle axe (two-handed):** `wBattleAxe()` in the right hand, haft along the thumb side, edge towards the fingers. The left hand grips the haft 0.3 m (`WR_HAFT`) lower down.
- **Round shield:** `wRoundShield('woolRed')` gripped by its centre handle in the left hand, painted face and boss outward. With the axe it hangs on the back at 85 % size.
- While a weapon or the shield is held, `post()` closes the fingers around it every frame.

## Animations

The warrior lists only the clips that fit what it holds: 26 with sword and shield, 25 with the axe, 24 with a sword and no shield. All clips are in place; the walking clips store their ground speed in `clip.speed` so scenes can move the character to match the steps.

### Every warrior

| Clip | Length | Loop | What it does |
|---|---|---|---|
| Idle | 4.0 s | loop | Breathing, slow weight shift; weapon carried point-down |
| Walk | 1.05 s | loop | Heel to toe, pelvis drop and sway, about 1.1 m/s |
| Run | 0.68 s | loop | Lean, high knees, heel tuck, flight phase, about 2.9 m/s |
| Idle (war mode) | 2.6 s | loop | Combat stance: left side forward, knees bent; shield forward and sword up, or axe across the body |
| Walk (war mode) | 1.1 s | loop | Guard up, short steps, about 0.8 m/s |
| Run (war mode) | 0.72 s | loop | Weapon ready, leaning in, about 3.3 m/s |
| Crouch | 3.0 s | loop | Low guard |
| Crouch & move forward | 1.3 s | loop | Sneaking low behind the guard, about 0.5 m/s |
| Crouching attack | 1.15 s | once | Lunge from the crouch: a thrust with the sword, a low sweep with the axe |
| Jump | 1.3 s | once | Dip, push off the toes with an arm swing, tuck, land toes first, about 0.3 m |
| Jump & attack | 1.6 s | once | Leap with the weapon raised, strike down on landing |
| Hit 1 | 0.75 s | once | Blow to the chest, rocks back |
| Hit 2 | 0.8 s | once | Blow from the left, twists and bends away |
| Heavy hit | 1.6 s | once | Knocked back two steps, then steps in again |
| Shout | 1.6 s | once | Short battle cry, leaning in |
| Roar | 2.6 s | once | Arms and weapon flung up, head thrown back |
| Taunt | 2.6 s | once | Sword and shield: bangs the sword on the shield twice, then opens the arms. Axe: beckons with the free hand |
| Cast spell | 2.6 s | once | Holds the weapon straight up overhead |
| Kick | 1.0 s | once | Front push kick with the rear leg, sole to the belly |
| Hip kick | 1.25 s | once | Door-busting stomp: knee to the chest, hips drive in, heel and sole straight ahead at hip height, body leaning back |

### Sword (and no axe)

| Clip | Length | What it does |
|---|---|---|
| One-handed attack 1 | 1.1 s | Forehand slash, right to left, with a step in |
| One-handed attack 2 | 1.05 s | Overhead chop, straight down |
| One-handed heavy attack | 1.7 s | Wind-up over the shoulder, lunge and diagonal cut to the ground |
| Low swing one-handed | 1.1 s | Lunging sweep at shin height, right to left |

### Shield in hand (sword or no weapon)

| Clip | Length | What it does |
|---|---|---|
| Shield bash | 1.0 s | Steps in and drives the shield forward |
| Block with shield | 1.4 s | Shield up over the face, takes the blow and pushes back |

### Battle axe

| Clip | Length | What it does |
|---|---|---|
| Two-handed attack 1 | 1.2 s | Horizontal swing, right to left, with a step in |
| Two-handed attack 2 | 1.15 s | Overhead chop, straight down |
| Two-handed heavy attack | 1.9 s | Wind-up behind the back, lunge and smash down to the ground |
| Low swing two-handed | 1.25 s | Lunging sweep at shin height, right to left |
| Block with two-handed weapon | 1.4 s | Haft held level above the head, takes the blow |

Every combat clip starts and ends in the war-mode stance, so they chain smoothly.

## How the animations are built

Three systems, all in `warrior.js`:

1. **Gait clips (Idle, Walk, Run): `gaitPose`.** Each leg follows periodic curves over the stride (`pcurve`): thigh angle, knee angle and the foot's pitch in the world. The hip height is solved from the leg geometry every frame (`legFK`), so the planted foot touches the ground exactly; the run arcs the hips through a flight phase. Pelvis drop, sway, counter-rotating shoulders, a steady head and slight swing-leg clearance are layered on top.
2. **IK keyframe clips (everything else): `wrKeys` + `wrSolve`.** Keys are written in world terms and interpolated with monotone cubics (smooth, no overshoot), then solved on a bare copy of the rig (`wrRig`):
   - `HP` hip offset (m), `h`/`sp`/`ch`/`nk`/`hd` torso and head angles. The head turns back to face forward automatically.
   - `FL`/`FR` feet: `[x, z, yaw°, lift m, pitch° (toe down), roll°]`. Two-bone leg IK, knee over the toes or along `nL`/`nR`. If a leg can't reach, the hips are lowered, so nothing floats. A shin leaning far forward lifts its heel, which only happens for feet on the ground.
   - `gR`/`gL` grip points (m, x and z relative to the hips), `dR` blade or haft direction, `dL` shield facing, `pR`/`pL` elbow directions, `eR` axe edge direction. Two-bone arm IK; the hand turns by the smallest wrist rotation that points the weapon where asked.
   - Two-handed: the right hand is solved first and the left hand rides the haft; `lf` (0 to 1) frees the left hand (Taunt).
   - Two-handed attack 1, 2 and heavy attack: the left elbow pole is fixed in the chest's frame (the stance's pole while the left grip is low, turning to straight out to the side as it rises), and when the left grip would come closer than `WR_FRONT` (0.22) in front of the chest joint, both grips move forward, level, until it does not. Before this, the bent-over strikes pulled the hands into the ribs and the left elbow pointed inward.
   - Keys are `[time, common, sword-and-shield overrides, two-handed overrides]`; anything a key leaves out comes from the stance (`ST1` sword and shield, `ST2` axe).
   - Continuity (one-shot clips, frames solved in time order): if an elbow would swing to the other side, or the blade would spin about its own axis, by more than 20° (`WR_JUMP`) in one frame, the frame is solved again with the elbow pole leaning towards the previous elbow and the blade turning at most 20° towards the keyed roll (it keeps its roll while the keyed roll is flipped over). The corrections fade out over the last 0.25 s, so every clip still starts and ends exactly on its keys.
3. **IK gaits (war-mode walk and run, crouch walk): `GAIT`.** Each foot slides back at a steady speed while planted, with heel strike and heel-off, and swings forward lifted. The upper body keeps the stance's guard with a small bob.

Lengths are authored for the male warrior and scaled by leg length for the female body. Clips are cached per body and equipment combination (`WCLIPS`).

## Checks done

- Every clip, both bodies, both weapons, sampled at 30 fps: planted feet within 2 mm of the ground; weapon, shield and body never below it.
- Frame-by-frame renders from the front, the sides and above for each clip; viewer checked in Day, Dusk and Night.
- All 96 option combinations (2 bodies × helmet × armour × gloves × 3 weapons × shield) build.

## Related changes elsewhere

- `src/characters/villager.js`: `buildVillager` accepts `force.B` (body type) and the optional body factors `arm`, `td`, `hipK`, `waistK`.
- `src/characters/occ.js`: an occupation may define `fn(T)` to adjust the rolled clothes (`OCC.warrior*` uses it).
- `src/items/items.js`: round shield paint moved to the front (boss side), and a stray white plank strip removed.

## Possible next steps

More armour types (mail, leather), more weapons (mace, longsword, spear, two-handed sword), more shield shapes (heater), and per-weapon tuning of the generic clips.
