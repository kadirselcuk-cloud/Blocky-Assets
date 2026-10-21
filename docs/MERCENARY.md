# Mercenary

The first player character (`mercenary`, Characters → Player characters): a powerful sword-and-shield fighter, about 1.97 m tall. Built from scratch on request: own body, own gear, own clip system (no other model used as a base). Code: `src/characters/mercenary.js`.

Open it: `http://localhost:<port>/#/a/mercenary`

## Options

| Option | Choices (default first) | Notes |
|---|---|---|
| Skin | Light, Pale, Tan, Dark, Black | |
| Face | Square jaw, Broad, Lean, Weathered | Head width, jaw, nose and brow per face (`MC_FACE`); lean adds cheekbone shadows, weathered adds forehead and eye lines |
| Eyes | Brown, Green, Blue | |
| Hair colour | Brown, White, Red, Black, Blonde, Gray | Hair, brows and facial hair |
| Hairstyle | Short, Long, Tied back, Buzz cut, Bald | Under a nasal helm or kettle hat only what hangs below the band shows; none under the coif or great helm |
| Facial hair | Short beard, Full beard, Stubble, Moustache, Goatee, Clean-shaven | Stubble tints the jaw |
| Scar | None, Cheek, Over the eye | |
| Weapon | Arming sword, Falchion, Flanged mace, Bearded axe, None | Right fist. With the sword an empty scabbard hangs on the left hip |
| Shield | Heater, Round, Kite, Buckler, None | Heater, round and kite on the left forearm; the buckler in the fist; the kite is carried 10 cm higher |
| Shield colour | Red, Blue, Green, Black, Ochre, White | Painted face; the buckler is plain steel |
| Helmet | None, Nasal helm, Mail coif, Kettle hat, Great helm | The great helm hides the face (horizontal eye slit only, no cross) |
| Armour | Mail hauberk, Half plate, Studded leather, Gambeson, Linen shirt | Half plate: iron breastplate, faulds, steel pauldrons and vambraces, tassets over the mail skirt; studded leather: jerkin with brass rivets, tassets, bracers over linen sleeves |
| Gloves | Leather gloves, None | |
| Boots | Leather boots, None (barefoot) | |
| Pants | Wool trousers, Leather trousers, None (linen braies) | |

Male only. No "New look": the look is set by the options. Clips are cached per weapon and shield; Death is baked per weapon, shield, helmet, armour and long hair (`mcDeath`), so the lying body rests on what he wears.

Adding a gear piece: one entry in `MC_SLOTS` (name) and one builder in `MC_GEAR[slot][key]`, which gets the joints and the materials. `buildMercenary` calls one builder per slot.

## Body

Own boxes on joints named like the villager rig (`hips`, `spine`, `chest`, `neck`, `head`, `upperArm/foreArm/hand_L/R`, `thigh/shin/foot_L/R`, plus `toes_L/R`), so the viewer's rig overlay and `tools/check-character.mjs` work. Real metres (`MCB`): ankle 0.08 above the ground, shin and thigh 0.46, hips joint 1.06 with straight legs, chest 0.5 wide and 0.29 deep over a narrower waist, thick neck, upper arm 0.32, forearm 0.28, closed fists. The head is built by `mcHead` (face shape, eyes, brows, nose, ears, scar), then the helmet, `mcBeard` and `mcHair`. Feet bend at the ball (`toes_*`), so a raised heel never pushes the toes into the ground.

Own textures (`mcTex`): mail rings, brushed steel, wood planks; everything else uses the shared pixel textures (`bm`). Colours pass `tools/check-palette.mjs`.

Props: the weapon (always the group `mc_sword`, whatever it is) sits in the right fist socket, business end along the hand's +z, edges along the knuckles. The shield (`mc_shield`) hangs on a mount (`mc_shmount`) on the left forearm, or in the left fist for the buckler; the solver turns it every frame (see below). Shield boards are rows of planks with a painted face inset, so the wood shows as a rim (`mcShieldBoard`); no emblems. The scabbard (`mc_scab`) hangs on the hips and the solver swings it back so its tip never goes into the ground.

## Animations

34 clips. Combat clips start and end in the war-mode guard and set `clip.next = 'Idle (war mode)'`; walking clips store their ground speed in `clip.speed`.

| Clip | Length | Loop | What it does |
|---|---|---|---|
| Idle | 4.0 s | loop | Breathing, slow weight shift; sword point down, shield at the side |
| Walk | 1.05 s | loop | Heel to toe, arms swinging, about 1.2 m/s |
| Run | 0.68 s | loop | Lean, high knees, flight phase, about 3.3 m/s |
| Idle (war mode) | 2.6 s | loop | Guard: left foot forward, knees bent, shield up, sword ready |
| Walk (war mode) | 1.1 s | loop | Short steps behind the shield, about 0.85 m/s |
| Walk back (war mode) | 1.1 s | loop | Backing off, toes first, about 0.7 m/s |
| Strafe left / right | 0.85 s | loop | Side steps behind the guard, about 0.75 m/s |
| Dodge left / right / back | 0.9–0.95 s | once | Quick hop out of reach and back into the guard |
| Jump | 1.3 s | once | Dip, spring with an arm swing, tuck, land on the balls of the feet |
| Attack 1 | 1.0 s | once | Forehand slash: the weapon cocked back past the right shoulder, the arm sweeps out wide with the blade trailing, then it whips round in front, right to left, with a step in; the shield opens out of the way |
| Attack 2 | 1.0 s | once | Backhand slash: up over the left shoulder, round in front, left to right; the shield held out wide |
| Attack 3 | 1.05 s | once | Overhead chop: raised behind the head, brought straight down in front |
| Attack 4 | 0.95 s | once | Lunging thrust |
| Combo | 2.3 s | once | Forehand, backhand, overhead, stepping in |
| Heavy attack | 1.8 s | once | Big wind-up over the right shoulder, a leap in and a diagonal cleave down to the left |
| Spin attack | 1.45 s | once | Spins round once with the blade held out |
| Shield bash | 1.0 s | once | Steps in and drives the shield forward |
| Kick | 1.0 s | once | Front push kick with the rear leg |
| Block | 1.2 s | once | Shield up over the face, takes the blow, pushes back |
| Blocking (hold) | 2.0 s | loop | Holds the shield up |
| Cast spell 1 | 2.4 s | once | Sword straight up overhead (after the warrior's Cast spell), gathers, then points it at the target |
| Cast spell 2 | 1.3 s | once | Quick cast: thrusts the sword point at the target |
| Cast spell 3 | 2.4 s | once | Sword upright before the face, head bowed, then raised to the sky (self blessing) |
| Cast spell 4 | 2.6 s | once | Raises the sword and drives it point down to the ground in a deep crouch (ground spell) |
| Channel spell | 2.0 s | loop | Holds the sword up overhead while a spell is kept going |
| Hit 1 / Hit 2 | 0.7 / 0.75 s | once | Blow to the chest; blow from the left |
| Heavy hit | 1.6 s | once | Knocked back two steps, steps in again |
| Taunt | 2.4 s | once | Bangs the sword hilt on the shield twice, spreads the arms |
| Victory | 2.6 s | once | Raises the sword high and looks up |
| Death | 2.6 s | once | Staggers, the knees go, falls on his back; sword and shield drop flat beside him |

Spell clips are gestures only; the effects come from the Spells & effects kit.

## How the clips are built

All in `mercenary.js`:

1. **Poses** (`MC_F` lists the channels): hips offset `P`, hips/spine/chest/neck/head angles, root turn `Y`, feet `FL`/`FR` `[x, z, yaw, lift, pitch]`, knees out `kL`/`kR`, wrists `hL`/`hR` and elbow hints `eL`/`eR` in the chest's frame, blade direction `bR` and shield facing `sn` in the body's frame, `fr` (frees the right arm when the sword is let go), FK leg blend `fk` with `LL`/`LR`, body ground clamp `gc`. The head undoes most of the torso's turn and pitch (`hc`).
2. **Keys** (`mcKeys`): each key starts from the one before (`'ST'` starts again from the stance); monotone cubic splines, flat at both ends. **Gaits** (`mcGait`): each foot slides back at the ground speed while planted (heel strike, flat, heel-off on the ball) and swings forward lifted; bob, sway, pelvis turn and arm swing on top.
3. **Cuts** (`mcCut`): attacks 1–3, the combo and the heavy attack are arcs, not loose keys. Each cut has a swing plane (`dir(θ) = cos θ·A + sin θ·B`); θ eases from the wind-up to the follow-through, the hand runs round the right shoulder at nearly full reach (0.56 m) 35° ahead of the blade, the blade leans a little towards the arm line, and the torso turn and lean drive it. Before this, blade directions were interpolated straight between keys, so mid-swing the blade cut through "straight up" and the arm stayed folded against the chest; and a bent arm with the blade along the shoulder-to-hand line bends the blade past what a wrist can do, which flipped the wrist.
4. **Solver** (`mcSolve`): two-bone leg IK (the hips drop when a leg can't reach; the hips' turn is kept within 40° of the planted feet, the spine takes the rest); left arm IK with its elbow hint; the sword arm searches the elbow circle for the elbow that lets a nearly neutral wrist point the blade (cost: wrist turn and bend, distance from the elbow opposite the blade, upper-arm twist, elbow inside the body; each frame stays within 20° of the last elbow), then the wrist bends the rest, clamped and rate-limited (21°/18° per frame) so fast cuts lag a little instead of flipping. Wrist targets are kept 0.36–0.585 m from the shoulder. The shield's face turns to `sn`, square to the forearm, top up. Props are lifted off the ground through their hand; dropped props fall flat and stay above the ground.
5. **Bake** (`mcBake`): 60 fps quaternion tracks for every joint, hips position, and position/rotation tracks for the sword and the shield.

## Checks done

- `node tools/check-character.mjs mercenary` for all 25 weapon × shield combinations and the bulky gear (great helm, coif, plate, long hair, full beard): all 34 clips pass.
- Intersection pass (scratch script) for all 25 weapon × shield combinations: blade and every shield box sampled against every body box, forearms and hands against torso, head and legs: none.
- Viewer: Day, Dusk and Night; every clip from the front, both sides, three quarters and above; all gear and colour options.
- `node tools/check-palette.mjs`: all colours within the tiers.
- GLB export of the model with all 34 clips (about 8 MB).

## Possible next steps

More hair and beard styles, cloth colour options, a cape, draw/sheathe clips with the scabbard, turn-in-place, roll, pick-up and interact clips.
