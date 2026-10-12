# Creating a character

Checklist and rules for every new or changed character (people, enemies, creatures with clips). Read `docs/DESIGN_GUIDE.md` for the look; this page is about the rig, the clips and the checks.

## Decision (2026-10-11): no twisted limbs, checked by a tool, before reporting

Twisted or flipping arms and legs have been the most frequent mistake in new characters (warrior attacks, ogre, ghoul hand, lich spells). From now on:

1. **Every character is run through `node tools/check-character.mjs <id> [options JSON] [seed]` and every clip must pass before the work is reported.** Run it for each option that changes the rig or what the hands hold (every weapon or staff, every size or height option) and for 2–3 seeds.
2. Then look at it: contact sheets of every clip from the front, the side and above, Day, Dusk and Night.
3. A clip that can't pass is reworked (keys, poles, timing), not excused. If a flag is genuinely fine, say which one and why in the report.

The checker samples every clip at 60 fps and flags:

| Flag | Meaning | Limit |
|---|---|---|
| JUMP | an arm or leg joint turns more than this between two frames: a flip or a spin | 25° per frame |
| TWIST | a limb rolled about its own bone: upper arms and hands, thighs and feet | 100° (arms, hands), 50° (thighs, feet) |
| BELOW GROUND | any box corner below the ground | −5 mm |
| PILE TOO HIGH | Death/Fall clips: the body's highest point at the end (pieces resting in the air on other pieces) | 0.55 m |

## How twists happen, and how to avoid them

- **Don't aim a hand at a world direction.** Aiming a hand (`dR`, `dL`) is solved by rolling the hand about the forearm, and that roll is the twist. A free hand follows its forearm with small keyed wrist angles instead (ghoul `wr`, lich `wl`). A hand holding a prop is aimed only through the elbow: choose the elbow so that a straight wrist already points the prop where it should go (lich `pole()` with `wf`), and allow at most about 60° of roll.
- **The elbow pole must be well away from the shoulder→hand line.** When the pole lies almost along the arm, its perpendicular part is tiny and flips from frame to frame. Pick a pole roughly at right angles to the arm (arm out to the side: pole back or down, not out).
- **The elbow never points into the body, straight up or forward** (unless the pose really is a raised elbow). Penalise those directions in any automatic elbow search.
- **Don't fold the arm tight.** A hand target closer than about 0.35 m to the shoulder makes the elbow direction unstable. Remember the grip `y` is absolute (ground = 0), not relative to the hips: hip height is about 0.95 m on a human.
- **Don't swing a straight arm while its elbow direction changes.** If a straight arm turns round its own axis it reads as a twist. Keep the elbow pointing the same way through a fast move (draw the hand in at the side, elbow down, then thrust), and give big swings at least 0.25 s.
- **Continuity (leaning the pole towards last frame's elbow) only smooths.** It lags, and it can drag an elbow inwards over a fast move. Check with the tool; turn it off for an arm if it makes things worse.
- **Body yaw moves the shoulders under world-space targets.** When the hips or chest turn, re-check every hand target and pole in that key.
- **Legs:** knees fold forwards, feet point where the hips point, and thigh and foot twist stays small. Feet that slide are a gait error, not a twist, but check them in the contact sheets.

## Props, robes and the ground

- A long staff held in the middle sweeps both ends. Keep both ends clear of the body (swing it beside the body, not across the chest).
- Planted props stand on the ground; carried props never go below it (clamp after every solve).
- Cloth panels (skirts, robes) follow the thighs but must fold away from the ground when kneeling, and hang straight from their piece once it comes loose in Death, so the robe lies flat.
- In Death everything lies on the ground or on something solid; a held prop is let go early enough that it never sinks with the slumping hand; in Rise it comes back last.
- A clip that starts under the ground on purpose (Rise from the ground) sets `clip.underground = true`; the checker then skips BELOW GROUND for it (jumps and twists are still checked). The opaque ground tile hides what is below it.
- Fast falls recorded at 30 fps can dip between frames; record Death/Rise at 60 fps (`skDeathRise` option `fps`) when the checker flags it.

## Steps for a new character

1. Body: reuse an existing builder where possible (`buildSkeleton`, `buildGoblin`, `buildVillager`), with its own `VB.<kind>` body type. Real-world height; check it with the bounding box.
2. Options: colours, gear and sizes as `opts`; New look rolls the cosmetic ones.
3. Clips: start from the closest existing set (warrior IK clips, shaman staff clips, ghoul wrist-keyed hand). Every one-shot clip starts and ends on its stance; `clip.next` names the clip that follows (the viewer plays it).
4. Run `tools/check-character.mjs` (see the decision above) until every clip passes; then the visual check.
5. Docs: `docs/<NAME>.md` (options, body, clips table, how the clips are built, checks done), a row in `CLAUDE.md`, a line in `docs/ARCHITECTURE.md`, one line in `docs/HISTORY.md`.
