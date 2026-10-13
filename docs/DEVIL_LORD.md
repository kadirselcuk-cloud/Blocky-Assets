# Devil Lord

A winged devil lord, mainly a spellcaster (`devil-lord`, Characters → Enemies → Hell), built after the owner's reference art (a dark, armoured devil with glowing cracks, big black horns, tattered wings and a long tail). Code: `src/characters/devil_lord.js`.

Open it: `http://localhost:<port>/#/a/devil-lord` (default seed 17 is the reference look: obsidian skin, red glow, crescent horns).

He walks and flies. On the ground his wings stay half closed behind him; in flight they spread wide and beat. Staff in the left hand, scimitar in the right. Spells are gestures only: the owner adds the effects separately.

## Options

| Option | Choices (default first) | Notes |
|---|---|---|
| Skin | Random, Obsidian black, Ash grey, Blood dark | Random rolls obsidian twice as often |
| Glow | Random, Red, Orange, Violet, Green | Emissive: eyes, skin cracks, armour runes, fire in the mouth, staff head, scimitar runes. Random rolls red twice as often |
| Horns | Random, Crescent, Ram, Swept back | Black, ridged, pointing outwards; crescent (the reference) curves out, up and in at the tips |
| Staff | Random, Horned orb, Horned skull, Caged shard | Black iron shaft, about 2.4 m |
| Scimitar | Random, Black iron with glowing runes, Dark steel | About 1.1 m blade with barbs on the spine |

## Body

`VB.dlord`: the villager male's proportions x 1.22 with broader shoulders, on the villager's 25 joints in a body group `vbody`: about **2.2 m** to the top of the head (2.6 m to the horn tips). The warrior's IK (`wrSolve`) fits unchanged.

- **Head**: bald, a heavy brow sloping down to the nose, slanted glowing eyes in deep sockets, hard cheekbone lines, a straight nose, a hard straight mouth with two small fangs, a square chin. The lower face is the jaw `g_jaw`; fire glows inside the mouth when it opens. Long pointed ears swept back. Glowing cracks on the face.
- **Torso**: muscular and bare (pecs, abs, obliques, traps, lats) with glowing cracks; an iron plate at the back of the neck.
- **Armour** (black iron, runes in the glow colour: bars, chevrons and diamonds, no crosses): layered spiked pauldrons, spiked bracers, a wide studded belt with a spiked front plate, tassets on the thighs, spiked knee guards, greaves.
- **Loincloth**: tattered dark red cloth in front, two pieces `dl_flap_0/1`; the clips swing the upper piece forward with the thigh that is furthest forward so it always lies in front of the legs, and keep it off the ground.
- **Hands and feet**: big clawed hands; beast feet with three clawed toes and a heel spur.
- **Wings** `dwing_L/R` (folding outer half `dwingO_L/R`): the succubus's demonic bat wing x 1.6, dark red-brown membrane, torn: ragged lengths and a few holes. About 3.8 m span spread.
- **Tail** `dtail_0..11`: 1.3 m, tapering, spines along the top, a barbed tip.

## Clips (22)

| Clip | Length | Loop | What it does |
|---|---|---|---|
| Idle | 5.0 s | loop | Stands square and tall, feet apart, staff planted upright, scimitar low; breathes and looks round, wings half closed, tail swaying |
| Walk | 1.3 s | loop | Slow, heavy stride, staff carried upright, tail swinging |
| Idle (war mode) | 2.6 s | loop | Wider stance, left foot forward, staff angled ahead, scimitar raised, wings half open |
| Walk (war mode) | 1.3 s | loop | Advances, staff and scimitar ready |
| Take off | 1.9 s | once → Hover | Crouches, raises the wings, a downstroke lifts him off, beats up into the hover |
| Hover | 2.0 s | loop | About 0.85 m up on slow beats of the spread wings (1.0 s), legs hanging |
| Fly | 1.4 s | loop | Leans into the air, legs and tail streaming behind (5 m/s, beat 0.7 s) |
| Land | 1.7 s | once → Idle | Beats down, lands on bent knees, folds the wings half closed |
| Spell 1 (hellfire bolt) | 2.0 s | once | Draws the staff back and thrusts its head at the enemy (bolt at 0.8 s) |
| Spell 2 (ring of fire) | 3.0 s | once | Raises the staff over his head, drives its foot into the ground (ring at 1.6 s) |
| Spell 3 (summon) | 3.4 s | once | Rises a little, wings spread, staff high, scimitar out, head back (summoning at 1.3 s) |
| Spell 4 (rain of fire) | 2.6 s | once → Hover | From the hover: lifts the staff high and sweeps its head down at the ground (fire at 1.25 s) |
| Scimitar slash | 1.4 s | once | Raises the blade beside his right shoulder and cuts down and across with a step in |
| Scimitar combo | 2.0 s | once | The same cut, then a backhand cut out to the right |
| Scimitar thrust | 1.5 s | once | Draws the blade back at his side and lunges, point first |
| Tail lash | 1.5 s | once | Turns away, then whips the tail round his right side |
| Wing buffet | 1.5 s | once | Raises the wings high and back, slams them forward |
| Roar | 2.6 s | once | Arms and wings spread wide, roars, fire glowing in the mouth |
| Hit 1 | 0.9 s | once | Blow to the face: head back, arms up, wings jerk open |
| Hit 2 | 1.1 s | once | Struck from the right: twists away and catches himself with a step |
| Heavy hit | 2.5 s | once | Knocked onto his left knee, leaning on the staff, then rises |
| Death | 4.0 s | once, held | Sinks onto his knees leaning on the staff, roars, shrinks to nothing (held: gone; the owner adds the effect) |

One-shot clips are followed by Idle (war mode), except Take off (→ Hover), Land (→ Idle), Spell 4 (→ Hover) and Death (held).

## How the clips are built (`devilLordClips`)

- Arms as the succubus's (hand targets turn with the body's yaw, x and z hips-relative, y absolute; elbow poles by a cost search with continuity; looping clips run one warm-up cycle), with a prop in each hand carried the necromancer's way on both arms: the pole score also places the elbow so a straight wrist already points the prop along `dL` (staff) or `dR` (scimitar); the wrist bends the rest, clamped to 95° (tip) and 35° (sideways), plus keyed bends `wl`/`wr`. A prop that would go below the ground lifts its hand.
- `fl` lifts the hips, feet and hands together (flight, Spell 3).
- Wings: `wg` [elevation, sweep back, pitch back, outer fold back, outer droop] plus the succubus's beat `suBeat` scaled by `ba`; lifted where they would touch the ground. Half closed on the ground `[40,55,10,50,-30]`, war mode `[36,48,8,40,-18]`, spread in flight `[16,20,14,6,0]` with the beat.
- Tail: `tc` curl per segment (12 values), `tw` travelling wave, `tsw` sway; a segment that would go into the ground curls away from it.
- Extra tracks: wings, tail, loincloth, `jw` (jaw), `vb` (body group scale and spin, Death). The clips are the same for every look, so they are made once (`DL_CLIPS`).

## Checks done

- `node tools/check-character.mjs devil-lord` for every staff, horn and blade option and seeds 1–3 (and the default 17): every clip passes (largest per-frame jump 19°, largest arm twist 80°, nothing below the ground).
- Contact sheets of every clip from several angles; close-ups of the head (closed and roaring); a lineup of the options in Day and Night.
