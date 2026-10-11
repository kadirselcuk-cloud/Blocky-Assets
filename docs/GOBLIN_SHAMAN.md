# Goblin shaman

The goblin shaman enemy (`goblin-shaman`, Characters → Enemies → Brutes). Code: `src/characters/goblin_shaman.js` (body and deaths come from `src/characters/goblin.js`, see `docs/GOBLIN.md`).

Open it: `http://localhost:<port>/#/a/goblin-shaman`

## Options

| Option | Choices (default first) |
|---|---|
| Skin, Top, Legs | Same as the goblin |
| Staff | Random, Gnarled staff, Ragged banner, Bulky staff |

"New look" rolls the goblin's random looks plus the staff, the earring side (left, right or both) and the banner colours.

## Body

`buildGoblin` with body type `VB.gshaman`, placed inside a group scaled by `SH_SC` = 1.22, so he stands about 1.6 m when hunched. The body type keeps the goblin's leg and arm lengths but has thicker limbs (`g` 1.15, arms 1.3), a deeper belly (`td` 1.55) and wider shoulders and hips. Because the lengths match the goblin's, every clip is authored in goblin metres.

Accessories come from the `shaman` option of `buildGoblin`:
- a thick leather belt with a crude iron buckle and a hanging end, replacing the rope;
- a cord necklace on the chest with four teeth, a big fang and two dark beads;
- square gold earrings hanging from the ear.

## Staffs

`shStaff(kind)` puts the grip at the origin along +y, the foot `SH_LB` = 0.62 below it and the top about 0.81 above it. All three staffs share the same length and grip, so the clips are shared. The ground clamp uses each staff's own corners.

- **Gnarled staff:** crooked knotted segments with moss, and a knotted lump on top that curls into a hook. A bone hangs from the hook on a cord.
- **Ragged banner:** a straight pole with an iron foot and a fang on top. A short arm out to one side (no cross bar) carries a ragged cloth with a blank diamond.
- **Bulky staff:** a thick shaft with iron bands and a leather grip. A wooden knob with four bone spikes holds a big stone, bound on top with an iron strap.

## How the clips hold the staff

All clips are IK keyframes (`wrKeys` + `wrSolve`) with extra staff channels:

- `T` is the staff foot [x, y, z] and `G` the grip [x, z], both absolute. With `pl` 1 the staff is planted and the grip height follows from the staff length. With `pl` 0, `gR`/`dR` place it freely. Keys can blend between the two.
- `sl` slides the hand down the staff (a `weapon_R.position` track), so swings and smashes hold it near the foot.
- `ap` places the elbow automatically. The solver searches for an elbow position that makes the forearm cross the staff at a right angle and keeps the elbow out from the chest. The knuckles follow the forearm, so the staff never runs back through the arm.
- After solving, a planted staff's lowest corner is put on the ground. A carried staff is never let below it.

In both walks the staff is planted a little after each left heel strike. It slides back with the ground at the same speed as the feet, then swings forward lifted.

## Clips

21 clips. The combat, hit and spell clips start and end in the war stance: low and wide, staff planted out to the right, claw raised.

| Clip | Length | Loop | What it does |
|---|---|---|---|
| Idle | 3.6 s | loop | Leaning on the planted staff, weight shift, looking around |
| Walk | 0.95 s | loop | Hunched steps, the staff planted with every left step, about 0.5 m/s |
| Run | 0.5 s | loop | Leaning in, staff carried pointing ahead |
| Run away | 1.84 s | loop | Four strides, staff waved high, looking back over each shoulder |
| Idle (war mode) | 2.2 s | loop | War stance, staff planted |
| Walk (war mode) | 0.9 s | loop | Stalking, staff planted with every left step |
| Run (war mode) | 0.5 s | loop | Charging, staff pointed ahead |
| Light attack 1 | 1.0 s | once | Hand slides down, sweep right to left with a skip forward |
| Light attack 2 | 0.9 s | once | Staff swung up and chopped down onto the ground ahead |
| Heavy attack | 1.5 s | once | Wind-up behind the head, lunge, staff head smashed into the ground |
| Jump | 1.2 s | once | Springs up with the staff, lands on feet and staff |
| Jump & attack | 1.5 s | once | Leap with the staff raised, smashes it down on landing |
| Hit 1 / Hit 2 | 0.65 / 0.7 s | once | Same as the goblin's; the staff stays planted |
| Heavy hit 1 | 1.5 s | once | Knocked back two steps; the staff is carried back and replanted |
| Heavy hit 2 | 1.9 s | once | Down on one knee leaning on the staff, then back up |
| Spell 1 (staff forward) | 2.4 s | once | Draws the staff in, thrusts it out at arm's length tilted at the target, open claw beside it, holds |
| Spell 2 (staff slam) | 2.2 s | once | Lifts the staff high, slams its foot into the ground, crouches over it with the claw spread, holds |
| Spell 3 (staff raised) | 2.8 s | once | Grabs the staff with both hands, lifts it level above the head with the head thrown back, holds it up shaking |
| Death 1 / Death 2 | 2.4 / 2.6 s | once, holds | The goblin's deaths. He lets go of the staff at once; it falls to the right and lies along the body |

## Checks done

- All clips with each of the 3 staffs, sampled at 30 fps: the body and the staff never go more than 5 mm below the ground, and a planted staff sits on the ground.
- Staff against the body: no contact with the head, chest or legs, apart from brief 2–4 cm brushes in Light attack 1. At the bottom of the chops the foot of the staff touches the wrist (up to about 7 cm of box overlap), like the goblin's pommel.
- Arms against the bigger belly: up to about 6 cm of box overlap at the elbows in some hits and jumps.
- Viewed in Day, Dusk and Night. GLB export works and includes the staff slide and drop tracks.
