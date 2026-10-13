# Succubus

A seductive winged demoness (`succubus`, Characters → Enemies → Hell). Code: `src/characters/succubus.js`.

Open it: `http://localhost:<port>/#/a/succubus`

She walks with a swaying catwalk, takes off and flies on big bat wings, and fights with charm spells, a draining kiss, her claws, her tail and her wings. The charm spells are gestures only: the owner adds the spell effects separately (as for the necromancer).

## Options

| Option | Choices (default first) | Notes |
|---|---|---|
| Skin | Random, Crimson, Rose, Lilac, Fair | Random rolls crimson twice as often. Lips are red on rose and fair skin, dark wine on the others |
| Hair | Random, Jet black, Crimson, Platinum, Violet | Random rolls black twice as often |
| Eyes | Random, Pink glow, Violet glow, Gold glow, Red glow | Emissive; also colours the choker gem, the belt gem and the ring. Random rolls pink twice as often |
| Outfit | Random, Black leather, Crimson leather, Purple leather | Bodice, briefs and gloves; the boots are always black |
| Horns | Random, Curved back, Ram, Tall | All black, pointing outwards |
| Wings | Random, Dark (skin), Black, Crimson | Bones and membrane; the tail spade matches |

## Body

`VB.succ` is the necromancer's body (the villager female with longer legs) on the villager's 25 joints in a body group `vbody`: about **1.8 m** to the top of the head, 2.0 m to the tall horns. The warrior's IK (`wrSolve`) fits unchanged.

- **Head**: the necromancer's face with glowing eyes in smoky make-up, winged liner, lashes, arched brows, full lips; the lower face is the jaw `g_jaw`. Small gold earrings. A swept fringe and a side parting.
- **Hair**: back curtain `hair_B_*` (0.62 m, narrow so it hangs between the wings) and two locks `hair_L_*`/`hair_R_*` over the front of the shoulders, laid every frame by the wight's `wtHairTracks` (pushed out of the head, torso, arms and the wing roots).
- Choker with a glowing gem. **Bustier**: a full bust in a small leather bustier with low cups and a gold rim, gold lacing (bars only, no crossing laces) and a gold lower edge; bare shoulders and upper chest. **Bare midriff** with a gold waist chain. **Low leather briefs** with a gold chain belt, a small gem at the front and a short chain hanging on the left.
- Arms: bare upper arms with a gold armlet, long fingerless leather gloves from above the elbow with gold cuffs, slender fingers with long dark nails, a gold ring with the eye-coloured gem on the left.
- Legs: bare thighs, thigh-high heeled boots with a gold clasp (the necromancer's boots).
- **Wings** `swing_L/R` on the shoulder blades, demonic: an inner arm bone (0.4 m) with a spine at the root and three membrane panels, then the folding outer half `swingO_L/R` (0.55 m) with a hooked thumb claw, spines along the leading edge, a hooked claw at the tip, three finger bones and the **lower part**: a long finger hanging from the tip (0.84 m) ending in a talon. The membrane grows longer towards the tip and ends in a ragged edge of sharp points. Span about 2.2 m; it reaches about 1 m below the leading edge.
- **Tail**: ten segments `stail_0..9` (1.1 m) from the base of the spine, tapering, ending in a heart-shaped spade.

## Clips (20)

| Clip | Length | Loop | What it does |
|---|---|---|---|
| Idle | 5.0 s | loop | Weight on the left leg, hip cocked, left hand on her hip, wings half folded behind her, the tail swaying; looks slowly round, the fingers drum |
| Walk | 1.2 s | loop | Slow swaying catwalk, one foot in front of the other, hips rolling, the tail swinging (about 0.8 m/s) |
| Idle (war mode) | 2.6 s | loop | Wider stance, left foot forward, both clawed hands raised, wings half open, the tail lashing slowly |
| Walk (war mode) | 1.3 s | loop | Stalks forward, claws raised |
| Take off | 1.8 s | once → Hover | Crouches, raises the wings high, a strong downstroke lifts her off and she beats up into the hover |
| Hover | 1.8 s | loop | 0.6 m up on slow wing beats (0.9 s), bobbing, legs dangling with the toes pointed |
| Fly | 1.2 s | loop | Leans into the air, legs and tail streaming behind (4 m/s, beat 0.6 s) |
| Land | 1.6 s | once → Idle | Beats down out of the hover, lands on bent knees and folds her wings |
| Charm 1 (blown kiss) | 2.4 s | once | Kisses her palm and blows the kiss at the enemy (the charm leaves at 1.35 s) |
| Charm 2 (beckon) | 3.0 s | once | Holds out her hand palm up and curls the fingers twice, swaying her hips, laughs softly |
| Charm 3 (enthrall) | 3.4 s | once | Spreads her wings wide, weaves both hands in slow circles before her face, then pushes both palms at the enemy (2.3 s) |
| Draining kiss | 3.4 s | once | Steps in, takes the enemy by the shoulders, wraps her wings round them, kisses and drinks, head tipping back, then steps back |
| Claw slash | 1.4 s | once | Raises the right claw beside her head and rakes it down and across with a step in |
| Tail lash | 1.4 s | once | Twists away, then turns and whips the tail round her right side at the enemy |
| Wing buffet | 1.4 s | once | Raises the wings high and back and slams them forward in a gust |
| Taunt | 2.6 s | once | Both hands on her hips, throws her head back and laughs, swaying, the tail flicking |
| Hit 1 | 0.9 s | once | Blow to the face: head snaps back, hands fly up, wings jerk open |
| Hit 2 | 1.1 s | once | Struck from the right: twists away and catches herself with a step |
| Heavy hit | 2.5 s | once | Knocked down onto her left knee, then rises |
| Death | 4.0 s | once, held | Sinks onto her knees, wings sagging, screams with her head thrown back, then shrinks to nothing (held: gone; the owner adds the effect) |

One-shot clips are followed by Idle (war mode), except Take off (→ Hover), Land (→ Idle) and Death (held).

## How the clips are built (`succubusClips`)

- Arms as the necromancer's: hand targets turn with the body's yaw (x, z hips-relative, y absolute), elbow poles by a cost search round the shoulder-to-hand line with frame-to-frame continuity; looping clips run one warm-up cycle first. Both hands are free and follow their forearms, bent only by the keyed wrists `wl` and `wr` (the right one mirrored).
- `fl` lifts the hips, both feet and both hands together (the flying clips).
- Wings as the imp's: `wg` [elevation, sweep back, pitch back, outer fold back, outer droop] plus a beat (`suBeat`) scaled by `ba`; a wing that would touch the ground is lifted.
- Tail: `tc` curl per segment (10 values), `tw` travelling wave, `tsw` sway spread over the segments; a segment that would go into the ground curls away from it.
- Extra channels baked into tracks: wings, tail, `jw` (jaw), `vb` (body group scale and spin, used by Death).
- Hair: `wtHairTracks` after the clips, cache key `succ`. The body, wings, tail and hair are the same for every look, so the baked clips are made once (`SU_CLIPS`).

## Checks done

- `node tools/check-character.mjs succubus` for seeds 1, 2, 3, 5, 7 and every horn option: every clip passes (largest per-frame jump 21° in Claw slash, largest arm twist 86° in Fly, nothing below the ground).
- Contact sheets of every clip from the front, side and back; a lineup of the skin, hair, eye, outfit, horn and wing options; Day and Night (eyes and gems glow).
