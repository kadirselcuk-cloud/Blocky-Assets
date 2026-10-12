# Vampire

The vampire lord (`vampire`, Characters → Enemies → Undead), a mini boss. Code: `src/characters/vampire.js`.

Open it: `http://localhost:<port>/#/a/vampire`

Phase 1 of the boss fight: he never touches the ground, summons vampire spawn (`vampire-spawn`, its clip Rise from the ground), casts spells and, at the end of the phase, wraps himself in his cape and vanishes in smoke. Reappear brings him back for the next phase, or play the beast form's Appear (`vampire-beast`, docs/VAMPIRE_BEAST.md) in the same place for phase 2.

## Options

| Option | Choices (default first) | Notes |
|---|---|---|
| Skin | Random, Pale ivory, Ashen, Grey-blue | |
| Hair | Random, Black, Silver, Dark brown | Random rolls black twice as often |
| Eyes | Random, Red glow, Amber glow, Violet glow | Emissive; Random rolls red twice as often |
| Coat | Random, Black, Midnight blue, Burgundy | The waistcoat follows the cape lining (dark grey with a black lining) |
| Cape lining | Random, Crimson, Purple, Black | The cape is always black outside |
| Float height | Medium (knee height, 0.3 m), Low (0.15 m), High (0.5 m) | Every clip is scaled to it (clips cached per height) |

## Body

`VB.vlord` is the villager male's proportions on the villager's 25 joints (so the warrior's IK, `wrSolve`, fits unchanged): about **1.86 m** to the top of the hair. The joints sit in a body group `vbody` (scaled and spun only by Vanish and Reappear).

- **Head**: long pale face, slicked-back hair with a widow's peak, brows slanting down to the nose, deep sockets with glowing eyes, a long nose, pointed ears (pointing up, back and out). The lower face is the jaw `g_jaw` (lips, lower teeth), opened by the clips; two fangs hang from the upper lip.
- Shirt collar and a white cravat falling in three ruffles, a gold brooch with a glowing ruby.
- Frock coat open over a waistcoat with silver buttons, lapels, a short coat skirt, belt with a silver buckle; sleeves with turned-back cuffs and white lace.
- Long pale fingers with dark pointed nails, a gold ring with a ruby on the right hand. A blood orb (`orb_R`, `orb_L`) in front of each palm, hidden unless a clip grows it.
- Dark trousers, tall black riding boots with turned-down cuffs and pointed toes.
- **Cape**: a high stand-up collar on the chest (black outside, lined inside, flaring behind the head) and a long cape hanging from the shoulders to the ankles, black outside and lined in the lining colour, with a pointed hem. The cape is 54 pieces `cape_i_k` (9 strips round the back, 6 pieces each) in the body group; the clips set where each piece is and how big it is.

## Clips (13)

| Clip | Length | Loop | What it does |
|---|---|---|---|
| Idle | 5.0 s | loop | Floats upright at knee height, bobbing slowly, looks round, the fingers twitch, the cape hanging |
| Float | 2.4 s | loop | Glides forward leaning in, legs trailing, arms swept back, the cape streaming behind (1.4 m/s) |
| Idle (war mode) | 2.6 s | loop | Hovers higher, leaning in a little, both clawed hands raised, fangs showing |
| Float (war mode) | 2.0 s | loop | Advances through the air, claws forward, the cape streaming (1.0 m/s) |
| Spell 1 (blood bolt) | 2.0 s | once | Draws a blood orb at the right side (elbow down), thrusts the open hand forward and hurls it |
| Spell 2 (summon spawn) | 3.6 s | once | Rises, flings both arms up and out holding the cape's edges so it spreads like bat wings, blood orbs swelling in both hands, head thrown back; sweeps both hands down at the ground ahead on either side (the orbs dive into the earth, where the spawn climb out), holds, lets the cape go |
| Spell 3 (blood drain) | 3.0 s | once | Reaches out with an open left claw, clenches it, drags the stolen blood back to the chest, the orb swelling, head tipping back |
| Claw slash | 1.4 s | once | The right claw rises beside the head and rakes down across as he darts in through the air |
| Taunt (laugh) | 3.0 s | once | Spreads the arms low holding the cape open, throws the head back and laughs |
| Hit 1 | 0.9 s | once | Knocked back through the air, head snapping back |
| Hit 2 | 1.1 s | once | Struck from the right: twists away and drifts aside |
| Vanish | 3.4 s | once, held | Sweeps the cape up across his face with the right arm and draws the left edge round his waist; smoke billows up from the hem, he spins and shrinks to nothing inside it, the smoke swirls out and thins away. The viewer holds the last frame (nothing left) |
| Reappear | 2.8 s | once | Smoke gathers out of nothing, he grows out of it spinning, holding the cape open behind him like wings; the smoke clears, he laughs and lets the cape go |

One-shot clips are followed by Idle (war mode), except Vanish (held: `clip.hold`, new in `app.js`).

## How the clips are built (`vampireClips`)

- Arms as the vampire spawn: hand targets in the torso's frame (x, z hips-relative, y absolute), elbow poles chosen by a cost search with frame-to-frame continuity, hands bent only by keyed wrists (`wr`, `wl`), never aimed.
- `fl` (the lich's float lift) raises the hips, both feet and both hands together; feet hang with a negative lift and the toes pointing down. Scaled by the Float height option.
- Extra channels baked into tracks: `jw` (jaw), `oR`/`oL` (orb sizes), `cR`/`cL` (a hand holding the cape's edge: weight and which point of the edge strip), `vb` (body group scale and spin), `sm` (smoke phase).
- **Cape cloth** (`vlCape`): a 9 × 7 grid of points hanging from anchors round the shoulders, simulated while the clip is made: gravity and wind (Float), strip lengths, neighbours kept between the cape's gentle flare and how far the cloth can spread (wider towards the hem), no folding back, pushed out of capsules round the torso, head, arms, legs and boots and above the ground, and kept behind the body unless the clip wraps it round the front (`front`). A held edge is pinned to the palm. One-shot clips let the cape settle on the first pose; looping clips run two warm-up cycles and spread the remaining seam difference over the cycle, so loops never jump. `vlCapeTracks` turns the recorded grids into position, rotation and scale tracks of the 54 pieces, so the cape moves the same in the GLB.
- **Smoke** (`vlPuff`): 44 puffs (`vsmoke_*` in `vsmoke`, semi-transparent dark grey, purple-grey and a few blood-red ones) placed by the smoke phase: they grow from the hem upwards round the body, swirl, then drift out, rise and shrink. `vsmoke` is hidden in every other clip.
- Vanish and Reappear scale `vbody` about the middle of the body (position track) and spin it.

## Checks done

- `node tools/check-character.mjs vampire` for all three float heights, colour options and seeds 1, 2, 3, 7: every clip passes (largest arm twist 60° in Vanish, per-frame flips under 18°, nothing below the ground).
- Contact sheets of every clip from the front, side and back, Day and Night (eyes, brooch, orbs glow); a lineup of colour variants; GLB export (5.8 MB with the cape tracks).
