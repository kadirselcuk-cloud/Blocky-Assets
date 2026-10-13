# Devil Lord

A charismatic winged devil, mainly a spellcaster (`devil-lord`, Characters → Enemies → Hell). Code: `src/characters/devil_lord.js`.

Open it: `http://localhost:<port>/#/a/devil-lord`

He walks and flies. On the ground his big bat wings stay half closed behind him; in flight they spread wide and beat. He carries a staff in the left hand and a scimitar in the right. The spells are gestures only: the owner adds the spell effects separately (as for the necromancer and the succubus).

## Options

| Option | Choices (default first) | Notes |
|---|---|---|
| Skin | Random, Crimson, Scarlet, Dark red, Charcoal | Random rolls crimson twice as often. The wings are a darker shade of the skin |
| Eyes and magic | Random, Gold glow, Red glow, Green glow, Violet glow | Emissive: eyes, belt and medallion gems, ring gems, the staff's orb, gem or skull eyes, the obsidian blade's edge |
| Doublet | Random, Black, Crimson, Royal purple | Doublet, collar, pauldrons, tassets |
| Horns | Random, Swept back, Ram, Great | Black with two gold bands, pointing outwards |
| Staff | Random, Horned orb, Goat skull, Caged gem | Black shaft with gold bands, about 2.4 m |
| Scimitar | Random, Steel, Obsidian (glowing edge) | About 1.1 m blade |

## Body

`VB.dlord` is the villager male's proportions x 1.22 on the villager's 25 joints in a body group `vbody`: about **2.2 m** to the top of the head (2.6 m to the great horns). The warrior's IK (`wrSolve`) fits unchanged.

- **Head**: long handsome face, slicked-back black hair with a widow's peak, arched brows rising outwards, glowing almond eyes under lids, high cheekbones, straight nose, a thin waxed moustache curling up, two fangs; the lower face is the jaw `g_jaw` with a pointed goatee. Long pointed ears with gold studs.
- **Outfit**: an open doublet with gold-trimmed lapels over a bare chest, a high stand-up collar behind the neck, a gold medallion with a glowing gem (a diamond, no crosses), pauldrons with gold rims, sleeves, leather bracers with gold bands, a gold ring on each hand, a wide belt with a diamond buckle, dark trousers, tassets on the outside of the thighs, tall boots with gold-trimmed cuffs and pointed toes.
- **Wings** `dwing_L/R` (folding outer half `dwingO_L/R`): the succubus's demonic bat wing, 1.5x bigger. Span about 3.6 m spread.
- **Props**: staff `weapon_L` (left socket), scimitar `weapon_R` (right socket), both along the thumb side of the fist.
- No tail (can be added on request).

## Clips (21)

| Clip | Length | Loop | What it does |
|---|---|---|---|
| Idle | 5.0 s | loop | Stands tall, the staff planted upright at his left side, the scimitar low, point forward; looks slowly round, wings half closed |
| Walk | 1.25 s | loop | Slow, confident stride, the staff carried upright |
| Idle (war mode) | 2.6 s | loop | Wider stance, left foot forward, staff angled ahead, scimitar raised, wings half open |
| Walk (war mode) | 1.3 s | loop | Advances with staff and scimitar held ready |
| Take off | 1.9 s | once → Hover | Crouches, opens and raises the wings, a downstroke lifts him off, beats up into the hover |
| Hover | 2.0 s | loop | About 0.85 m up on slow beats of the spread wings (1.0 s), legs hanging |
| Fly | 1.4 s | loop | Leans into the air, legs streaming behind (5 m/s, beat 0.7 s) |
| Land | 1.7 s | once → Idle | Beats down, lands on bent knees and folds the wings half closed |
| Spell 1 (hellfire bolt) | 2.0 s | once | Draws the staff back and thrusts its head at the enemy (the bolt leaves at 0.8 s) |
| Spell 2 (ring of fire) | 3.0 s | once | Raises the staff over his head, then drives its foot into the ground (the ring bursts at 1.6 s) |
| Spell 3 (summon) | 3.4 s | once | Rises a little, wings spread, staff high, scimitar flung out, head back (the summoning at 1.3 s) |
| Spell 4 (rain of fire) | 2.6 s | once → Hover | From the hover: lifts the staff high and sweeps its head down at the ground (the fire falls at 1.25 s) |
| Scimitar slash | 1.4 s | once | Raises the blade beside his right shoulder and cuts down and across with a step in |
| Scimitar combo | 2.0 s | once | The same cut, then a backhand cut out to the right |
| Scimitar thrust | 1.5 s | once | Draws the blade back at his side and lunges, point first |
| Wing buffet | 1.5 s | once | Raises the wings high and back, then slams them forward |
| Taunt | 2.8 s | once | Spreads his arms wide, wings opening, throws his head back and laughs |
| Hit 1 | 0.9 s | once | Blow to the face: head back, arms up, wings jerk open |
| Hit 2 | 1.1 s | once | Struck from the right: twists away and catches himself with a step |
| Heavy hit | 2.5 s | once | Knocked onto his left knee, leaning on the staff, then rises |
| Death | 4.0 s | once, held | Sinks onto his knees leaning on the staff, roars, then shrinks to nothing (held: gone; the owner adds the effect) |

One-shot clips are followed by Idle (war mode), except Take off (→ Hover), Land (→ Idle), Spell 4 (→ Hover) and Death (held).

## How the clips are built (`devilLordClips`)

- Arms as the succubus's (hand targets turn with the body's yaw, x and z hips-relative, y absolute; elbow poles by a cost search with continuity; looping clips run one warm-up cycle), with a prop in each hand carried the necromancer's way on both arms: the pole score also places the elbow so that a straight wrist already points the prop along `dL` (staff) or `dR` (scimitar); the wrist bends it the rest of the way, clamped to 95° (tip) and 35° (sideways), plus keyed bends `wl`/`wr`. A prop that would go below the ground lifts its hand.
- `fl` lifts the hips, both feet and both hands together (flight, Spell 3).
- Wings: `wg` [elevation, sweep back, pitch back, outer fold back, outer droop] plus the succubus's beat `suBeat` scaled by `ba`; a wing that would touch the ground is lifted. Half closed on the ground: `[40,55,10,50,-30]`; war mode `[36,48,8,40,-18]`; spread in flight `[16,20,14,6,0]` with the beat.
- Extra tracks: wings, `jw` (jaw), `vb` (body group scale and spin, Death). The clips are the same for every look, so they are made once (`DL_CLIPS`).

## Checks done

- `node tools/check-character.mjs devil-lord` for every staff, horn and blade option and seeds 1–3: every clip passes (largest per-frame jump 19°, largest arm twist 80°, nothing below the ground).
- Contact sheets of every clip from several angles; close-ups of the head; a lineup of the options in Day and Night (eyes, gems, staff and the obsidian edge glow).
