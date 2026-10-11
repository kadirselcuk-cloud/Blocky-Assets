# Goblin

The goblin enemy (`goblin`, Characters → Enemies → Brutes): body, clothes, weapons and clips. Code: `src/characters/goblin.js`.

Open it: `http://localhost:<port>/#/a/goblin`

## Options

| Option | Choices (default first) |
|---|---|
| Skin | Random, Dark yellow, Green, Dark green, Dark red, Dark grey |
| Top | Random, Ragged shirt, No shirt |
| Legs | Random, Ragged shorts, Ragged pants |
| Weapon | Crude shortsword, One-handed axe, Club |

"New look" rolls the Random options plus hair (bald, tufts or straggly), cloth colours (17: drab browns and greys plus faded dyes such as red, blue, mustard, moss green, purple, teal, ochre, dirty white, soot black, rust orange and wine), patches and the lengths of the ragged hems.

## Body

About 1.3 m tall when hunched (1.4 m to the ear tips). Own body type `VB.goblin`: short legs (thigh 0.25, shin 0.23), long thick arms (upper 0.235, fore 0.22, hands reach the knees), a deep pot belly (`td` 1.4), broad heavy shoulders, a big head (scale 1.25) with a wide jaw, brow ridge, yellow eyes, a long hooked nose, two lower tusks and long pointed ears that sweep outward, back and up. Bare feet with toes, clawed fingers. Shading: brow ridge 55 % of the skin colour, the slanted brows 30 %, inner ears, nostrils, chest lines and navel 40 %. The forearm tapers to a thinner wrist so the weapon grip clears it.

`buildGoblin` builds its own meshes but uses the villager's 25 joint names, offsets and order, so `legFK`, `gaitPose`, `wrRig` and `wrSolve` from `warrior.js` work unchanged. The right-hand socket sits slightly deeper in the fist (−0.088 × hand instead of −0.075).

## Weapons

`gbWeapon(kind)`: grip at the origin along +y, striking edge towards +x; mounted so the blade or head runs along the thumb side and the edge faces the knuckles (same as the warrior's axe), so `eR` in the clips sets the edge.

- **Crude shortsword:** leather grip, crooked guard, three uneven blade segments with a chipped tip and rust patches.
- **One-handed axe:** wooden haft, wedge head with a bright edge, rope lashings.
- **Club:** thickening knotted head with four iron nails.

## Clips

18 clips. The death clips are built per weapon (the dropped weapon's path depends on its shape); all others are shared. Gait clips store their ground speed in `clip.speed`.

| Clip | Length | Loop | What it does |
|---|---|---|---|
| Idle | 3.6 s | loop | Hunched on bent knees, weight shift, looking around |
| Walk | 0.78 s | loop | Short waddling steps, about 0.9 m/s |
| Run | 0.5 s | loop | Leaning in, arms pumping, flight phase, about 2.3 m/s |
| Run away | 1.84 s | loop | Four strides of panicked flight: weapon waved overhead, free arm flailing, looks back over each shoulder in turn, about 2.8 m/s |
| Idle (war mode) | 2.2 s | loop | Low wide stance, left side forward, weapon raised, claw out |
| Walk (war mode) | 0.8 s | loop | Stalking, about 0.5 m/s |
| Run (war mode) | 0.5 s | loop | Charging, about 2.2 m/s |
| Light attack 1 | 0.85 s | once | Quick slash right to left with a skip forward |
| Light attack 2 | 0.8 s | once | Quick overhead chop, landing to the right of the head |
| Heavy attack | 1.5 s | once | Wind-up behind the head, lunge, smash down to the ground |
| Jump | 1.2 s | once | Squat, spring up about 0.2 m, land and absorb |
| Jump & attack | 1.5 s | once | Leap with the weapon raised, strike down on landing |
| Hit 1 | 0.65 s | once | Blow to the face: head and shoulders snap back within 0.06 s, hold, then recover |
| Hit 2 | 0.7 s | once | Blow on top of the head: head ducks down sharply within 0.06 s, weapon swings out of the way, then recovers |
| Heavy hit 1 | 1.5 s | once | Knocked back two steps, then steps in again |
| Heavy hit 2 | 1.9 s | once | Knocked down onto the right knee (weapon held in front, left hand on the knee, elbows out to the side), then gets back up |
| Death 1 | 2.4 s | once, holds | Struck in the chest: knees buckle, falls back onto the seat, then the back hits the ground with a small rebound; arms fling out, the weapon flies off to the right; ends lying on the back, one knee up |
| Death 2 | 2.6 s | once, holds | Gut blow: doubles over clutching the belly, the weapon slips away, drops onto both knees, sways, topples face-first and settles with the cheek on the ground |

Idle, Walk, Run and Run away use `gaitPose` (per-leg curves, hips solved from the leg geometry). The war-mode clips, attacks and jumps are IK keyframes (`wrKeys` + `wrSolve`) authored in metres and converted to leg units by `gbU`. Every combat and hit clip starts and ends in the war-mode stance. The viewer holds the last frame of any clip whose name starts with Death.

### Deaths

FK keyframes (`gbDeathKeys`) of joint angles, starting from the war stance solved once by IK. Each key carries the previous key forward and has its own easing: `in` accelerates like a fall, `out` settles after an impact. Every frame the whole body is dropped onto its lowest point, so it rests on its feet, knees, seat, back or chest as it goes down; `anc` pins the planted feet until they leave the ground and `flat` keeps a sole level while the knees buckle. At the release time the weapon (node `weapon_R`, its own tracks in the clip) is flung to the side, falls under gravity, turns flat, bounces once and lies still; the fingers open. The final poses were fitted so torso, head, arms and legs all rest on the ground.

## Checks done

- All clips × 3 weapons sampled at 30 fps: body never below the ground, planted feet on it, weapon never below it.
- Weapon against the body (sample points inside every body box): no hits on head, ears, chest or legs. The only remaining contact is the small pommel touching the wrist (up to about 2.5 cm) at the bottom of the chops.
- Deaths: lying body parts within about 4 cm of the ground (curled fingers), nothing below it; dropped weapon never below the ground and never on the body. Remaining contact: the head resting on a shoulder by about 2 cm when lying, and box overlap at the bent knees and hips as in every clip.
- Viewer in Day, Dusk and Night; GLB export (weapon tracks included).
