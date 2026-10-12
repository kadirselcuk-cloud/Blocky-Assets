# Necromancer

The necromancer (`necromancer`, Characters → Enemies → Undead), a boss. Code: `src/characters/necromancer.js`.

Open it: `http://localhost:<port>/#/a/necromancer`

A tall gothic sorceress with a skull staff: frightening (glowing eyes, black veins, horns or thorns, bone spikes) and seductive (corset, slit gown, thigh-high heeled boots, long gloves, a sultry swaying walk, a kiss of death, a beckoning taunt).

## Options

| Option | Choices (default first) | Notes |
|---|---|---|
| Skin | Random, Porcelain, Ashen, Grey-lilac | |
| Hair | Random, Raven black, Silver-white, Blood red | Random rolls black three times as often |
| Eyes | Random, Green glow, Violet glow, Icy blue glow, Red glow | Emissive; also colours the choker gem, the ring, and the staff skull's eyes. Random rolls green twice as often |
| Gown | Random, Black, Deep purple, Blood red, Grave green | The lace edge of the gloves follows it |
| Headpiece | Random, Horns, Crown of thorns, Skull diadem | |
| Staff | Random, Horned skull, Caged skull, Skull and crescent | Same length for all three (the clips are shared) |

## Body

`VB.necro` is the villager female's proportions with longer legs (thigh 0.44, shin 0.42) on the villager's 25 joints, so the warrior's IK (`wrSolve`) fits unchanged: about **1.8 m** to the top of the head (2.0 m with the horns). The joints sit in a body group `vbody` (scaled and spun only by Vanish, Reappear and Death).

- **Head**: narrow pale face, sharp cheekbones, glowing eyes under dark eyeshadow with winged liner, arched brows, wine-dark lips, black veins at the temples. The lower face is the jaw `g_jaw` (lower lip and teeth), opened by the clips.
- **Hair**: a cap with straight sides and a blunt fringe; long straight hair in three chains (`hair_B_*` back curtain to the waist, `hair_L_*` and `hair_R_*` locks falling over the front of the shoulders), laid every frame by the wight's `wtHairTracks` (pushed out of the head, torso and arms, colliders flagged `userData.hairCol`).
- Headpiece: two curved black horns sweeping back, a crown of black thorns, or a silver diadem with a small skull whose eyes glow.
- Neck with black veins and a black choker with a glowing gem.
- **Corset**: black leather with boning and silver lacing (bars only, no crossing laces), a sweetheart top over the bust, bare shoulders and upper chest with a few dark veins.
- Arms: bare upper arms, long black gloves above the elbow with a lace edge in the gown colour, slender fingers with pointed silver nails, a silver ring with the eye-coloured gem on the left. **Bone pauldron** on the left shoulder: two curved plates and two sharp spikes.
- Low silver chain belt with a small skull, a chain hanging on the left.
- **Gown** (`sk_<i>`, 16 panels round the hips, each an upper part `skUp_<i>` and a lower part `skLo_<i>`, coloured outside, darker inside, pointed hem about 6 cm above the ground). The front panel over the right leg stops high: the slit.
- Legs: pale thighs above **thigh-high boots** with a silver garter clasp; pointed boots with a heel block and an arch (the sole matches the IK foot).
- **Staff** `weapon_R` in the right socket (`ncStaff`): a two-metre twisted black shaft with silver bands, a wine-red grip and a silver foot spike; topped by a skull whose eyes glow, with ram horns (Horned skull), inside four black bone claws with a gem above (Caged skull), or under a black crescent with a gem (Skull and crescent).
- **No spell effects** (owner decision, 2026-10-12): soul flame, rune circle, soul-fire ring and smoke were removed; the owner adds the effects separately. The clips keep the poses and timing the effects fit.

## Clips (17)

| Clip | Length | Loop | What it does |
|---|---|---|---|
| Idle | 5.0 s | loop | Weight on the left leg, the hip cocked out, the right knee bent in, left hand on her hip, staff upright at her side; looks slowly round, the fingers drum |
| Walk | 1.2 s | loop | Slow swaying walk, one foot in front of the other, hips rolling, the staff carried upright, about 0.7 m/s |
| Idle (war mode) | 2.6 s | loop | Wider stance, left foot forward, the staff angled ahead, her left hand raised like a claw |
| Walk (war mode) | 1.3 s | loop | Advances slowly, staff and left hand held ahead, about 0.5 m/s |
| Spell 1 (soul bolt) | 2.0 s | once | Draws the left hand in at her side (elbow down), then thrusts the open hand forward (the bolt leaves at 0.7 s) |
| Spell 2 (raise the dead) | 3.6 s | once | Lifts the staff high and rises off the ground, left palm raised, head back; drops and drives the staff's foot into the ground ahead (at 1.8 s), holds |
| Spell 3 (drain life) | 3.0 s | once | Reaches out with an open hand, clenches it, draws the stolen life back to her breast, head tipping back |
| Spell 4 (death nova) | 3.4 s | once | Sinks low, rises into the air with her arms flung wide (the burst at 1.3 s), sinks back down |
| Kiss of death | 2.4 s | once | Lifts the left palm before her lips and blows a kiss at the enemy (at 1.35 s) |
| Staff strike | 1.5 s | once | Lifts the skull high beside her right shoulder and brings it down ahead with a step in, clear of the body |
| Taunt (beckon) | 3.0 s | once | Holds out her left hand palm up and curls the fingers twice (come here), tilts her head and laughs |
| Hit 1 | 0.9 s | once | Blow to the face: head snaps back, the free hand flies up |
| Hit 2 | 1.1 s | once | Struck from the right: twists away and catches herself with a step |
| Heavy hit | 2.5 s | once | Knocked down onto her left knee, the gown pooling round her, then rises |
| Vanish | 3.4 s | once, held | Draws herself up, spins and shrinks to nothing (`clip.hold`) |
| Reappear | 2.8 s | once | Grows out of nothing, spinning with her arms spread, and laughs |
| Death | 4.0 s | once, held | Reels, sinks onto her knees, throws her head back and screams; then shrinks to nothing from 1.9 s (held: gone) |

One-shot clips are followed by Idle (war mode), except Vanish and Death (held).

## How the clips are built (`necromancerClips`)

- Arms as the vampire: hand targets turn with the body's yaw (x, z hips-relative, y absolute), elbow poles chosen by a cost search round the shoulder-to-hand line with frame-to-frame continuity; looping clips run one warm-up cycle first. The free left hand is bent only by the keyed wrist `wl`.
- **The staff is carried, not aimed.** With a straight wrist the staff leaves the fist across the forearm towards the shoulder side, so the right elbow is chosen so that the arm's plane already holds the staff direction `dR` (cost on the part of `dR` out of that plane, and on how far the wrist must bend). The wrist then bends the staff onto `dR` within that plane (up to 95°) with at most 35° of roll, plus the keyed offset `wr`. A staff that would go below the ground lifts the hand (box corners of the staff checked every frame).
- `fl` lifts the hips, both feet and both hands together (Spell 2, Spell 4, Vanish, Reappear).
- Extra channels baked into tracks: `jw` (jaw), `vb` (body group scale and spin).
- **Gown (`ncSkirtTracks`)**: after the clips are made, every frame each panel is tilted outwards about its top edge by the least angle that keeps the legs (points along thigh, shin and boot with their radius) behind it, in closed form; never less than the gown's flare (4° upper, 9° lower). The lower part does the same from the end of the upper part and folds in by at most 20°. A hem that would go into the ground (kneeling) is folded further out until it clears it. A flared panel widens with the gown's girth at its hem (scale tracks), so the gown stays closed and pools on the ground when she kneels.
- Hair: `wtHairTracks` (the wight's) after the gown, cache key `necro`. The gown, the hair and the staff length are the same for every look, so the baked clips are made once (`NC_CLIPS`).

## Checks done

- `node tools/check-character.mjs necromancer` for seeds 1, 2, 3, 5, 7 and the headpiece/staff options: every clip passes (largest per-frame flip 19°, largest arm twist 66° in Spell 4, nothing below the ground; the staff stands upright in Idle within 1°).
- Contact sheets of every clip from the front, side and back, Day and Night (eyes and gems glow); a lineup of the colour, headpiece and staff options.
- GLB export: 5.2 MB with the gown and hair tracks.
