# Two-headed ogre (boss)

The boss of the brutes (`ogre-boss`, Characters → Enemies → Brutes). Code: `src/characters/ogre_boss.js`.

Open it: `http://localhost:<port>/#/a/ogre-boss`

A larger ogre with two heads: a warrior head on the right that swings the club, and a mage head on the left that casts with the staff.

## Options

| Option | Choices (default first) | Notes |
|---|---|---|
| Skin | Random, Grey-green, Mud-brown, Pale grey, Ochre, Dusky blue, Dusky pink | The ogre's skins |
| Mantle | Random (fur most often), Fur mantle, None | The ogre's fur mantle |
| Staff | Random, Gnarled crystal staff, Horned skull staff, Bound stone staff | The ogre magi's staffs (`omStaff`) |

"New look" also rolls the ogre's hide, fur, warts, belly scar and shackle, the horn colour (ivory, yellowed, grey) and the mage head's hair colour.

## Body

Built by `buildOgre` with the `heads` hook (it replaces the ogre's head and neck), then `obRescale` multiplies every joint offset and rebuilds every box at `OB_F` = 1.05. That is the ogre's body at 1.05x in real metres with unchanged 5 cm texture pixels (no group scale). `VB.ogreBoss` is `VB.ogre` with every length times 1.05.

- Height: about **3.75 m** to the top of the helmet standing, 3.9 m to the horn tips (the hunched idle is lower).
- The main neck carries the warrior head a little right of the middle (`OB_HX` = -0.31, ogre metres); the mage head grows out of the left shoulder (`OB_MX` = 0.45) on a thinner neck of its own, inside the group `headM_base`, which leans it outwards, away from the warrior head (turned 9° out, its top tilted 17° to the left), like a second head grown later.
- **Warrior head** (right, the ogre's head size, on the `head` joint): the ogre's head with angry slanted brows, big tusks and a scar over the left eye. A **wooden helmet**: a shell of staves with dark seams, an iron rim with rivets, a stepped crown with an iron ridge front to back, and two **horns** sweeping outwards and up from wooden bosses (Viking style, no crossing bands).
- **Mage head** (left, 0.74x, on the group `headM`): narrower jaw, hooked nose, small tusks, heavy lids, long ears with gold rings, bald on top with hair down the back. A **gold diadem** with a diamond plate and a glowing **red ruby**.
- Warrior side: an iron pauldron with rivets on the right shoulder. Mage side: a gold arm ring and a bead bracelet on the left arm.
- Club in the right hand (`weapon_R`, the ogre's knotted club, 2.9 m at this size); staff in the left hand (`weapon_L`, basis `OB_BASIS_L`: staff top along the thumb, skull face out of the back of the hand). `root.userData.post` keeps both fists closed while the props are held.

## Clips

Keys are written in the ogre's metres and scaled by `OB_F` before solving (`scl`). The IK rig (`obRig`) is a bare boss with both props; `wrSolve` holds the staff with the opt-in `R.lprop` (the left hand aims `dL` like the right hand aims `dR`). Staff channels work like the magi's: `T` = staff foot, `G` = grip x,z, `pl` = planted (1) or carried (0). `mh` = the mage head's turn on top of the head track; each clip gets a `headM.quaternion` track.

Per frame (`solve`): solve, then three rounds of
1. **elbow search** (`autoPole`) for each arm round the shoulder–wrist line, scoring the hand's roll and bend (from the forearm to the prop, the rotation `wrSolve` makes), the upper arm's own roll at the shoulder, elbow not into the body, not straight up or forward, a pull towards the keyed pole (`OB_HINT`) and towards last frame's elbow (`OB_CONT`);
2. each prop pushed out of the body (heads included), the club tilted up off the ground, a planted staff put on the ground, a carried one lifted.

Loops are pre-rolled through two cycles at the sampling steps, so every loop seam is 0°.

No twitches: the arm tracks get two passes of 1-2-1 smoothing (not on frames where the staff is planted or the club rests on the ground, so nothing is pulled into the ground); keyed club positions are kept outside the body, so the push-out step never jerks the hand; the rig sets `heelFade` (0.12 m) so the IK's automatic heel lift fades as a foot rises instead of stopping at once (that snapped the knee at toe-off). Every one-shot clip sets `next` = Idle (war mode), the stance it ends on, so the viewer doesn't fade from the raised club into the club-on-shoulder Idle.

18 clips:

| Clip | What it does |
|---|---|
| Idle | Leaning on the planted staff, club on the shoulder; the warrior head looks about, then the two heads turn to each other and grumble |
| Walk | Heavy steps, club on the shoulder, staff planted with every right step, 0.9 m/s |
| Run | Lumbering run, staff carried pointing ahead, 3.6 m/s (60 fps) |
| Idle (war mode) | Low and wide, club raised out to the right, staff planted ahead on the left |
| Walk (war mode) | Advancing, staff planted with every right step, 0.7 m/s |
| Run (war mode) | Charge, club up, staff pointed ahead, 3.8 m/s (60 fps) |
| Roar | Crouches, rears up with club and staff high, both heads roaring, shakes them three times |
| Taunt | The heads squabble: the warrior head snaps at the mage head, it snaps back; both laugh |
| Attack 1 | Club in one hand: wide sweep right to left with a step in; staff held out at the side |
| Attack 2 | Club swung overhead and smashed down onto the ground |
| Heavy attack | Club wound up behind the back, lunging step, ground slam held a moment |
| Spell 1 (staff forward) | Staff thrust out at arm's length with a step, mage head chanting at the target |
| Spell 2 (staff slam) | Staff lifted high and its foot slammed into the ground, crouching over it (60 fps) |
| Spell 3 (staff raised) | Staff raised overhead, mage head thrown back chanting, staff shaking |
| Hit | Heads and shoulders snap back |
| Heavy hit | Staggers a step back on the staff, steps in again (60 fps) |
| Death 1, Death 2 | The goblin's falls (`goblinDeaths`, 60 fps) on the boss's body: onto the back, or to the knees and face down on the gut. The staff is let go at once and topples away (`GX.left`, no hand fling), the club as he falls; the mage head lolls aside. Measured per mantle, so the gut or the fur takes the fall |

## Checks done

- `node tools/check-character.mjs ogre-boss` for every staff, both mantles and seeds 1–4: every clip passes (jumps at most 25°, twists under the limits, nothing below the ground).
- The one flag left is **PILE TOO HIGH** in both deaths (1.42 m and 1.98 m). The 0.55 m limit is for human-sized bodies: the boss's gut alone is over 1 m deep, so lying on its back or face down it can't be lower (the plain ogre gives 1.35 m). Death 2 also has the warrior head on its side with a horn pointing up.
- Props against the body, sampled at 15 fps: heads never touch each other; the club rests on the pauldron (4 cm), passes the helmet by up to 4 cm in the overhead wind-ups, and the staff stays clear in both deaths.
- Loop seams 0° on all six loops.
- Viewer: Day, Dusk, Night (the ruby glows at night); GLB export with all 18 clips and the mage-head track, about 1.65 MB.
- Twitch check: no arm, hand or head frame sits more than about 5° off the smooth path through its neighbours in idles, walks, runs, spells and hits (up to 10° in the frame the club leaves the ground after a slam).
- Shared code changes are opt-in and the ogre, ogre magi and goblin give the same checker results as before: `wrSolve` `R.lprop`, `sampleClip` `o.fps`, `goblinDeaths` `GX.fps` and `GX.left`, `buildOgre` `o.heads` and `userData.mantle`, `wrSolve` `R.heelFade`. The ogre's belly scar was moved onto the paunch so it no longer sticks out below the gut in face-down falls.
