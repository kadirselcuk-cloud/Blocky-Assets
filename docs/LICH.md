# Lich

The lich enemy (`lich`, Characters → Enemies → Undead). Code: `src/characters/lich.js`.

Open it: `http://localhost:<port>/#/a/lich`

## Options

| Option | Choices (default first) | Notes |
|---|---|---|
| Headwear | Random, Crown, Chain mail coif, Diadem with gem, None | Random rolls crown and diadem twice as often; the crown and the diadem carry a glowing emerald, ruby or sapphire |
| Staff | Random, Gnarled staff, Bone staff, Staff with emerald, Staff with ruby, Staff with sapphire | Right hand |
| Robe | Random, Deep purple, Black, Blood red, Midnight blue, Grave green, Ash grey, Faded brown | |
| Float height | Low (just off the ground), Medium (knee height), High (half a metre) | How high it hovers (0.12, 0.3 or 0.5 m); every levitating clip is scaled to it |
| Eyes | Random, Pale blue, Green, Purple, Red, Golden, White glow | Also colours the phylactery, the bone staff's skull eyes and the spell orb |
| Bones | Random, Bleached, Aged, Grimy, Dark, Reddish (fire) | The skeleton's tints; New look rolls the first three |

"New look" also rolls the gem of the crown or diadem and where the holes and worn patches sit on the robe.

## Body

`VB.lich` is the skeleton's body (villager male proportions, 25 joints), built by `buildSkeleton` with `gear:true` (no weapon or buckler), no armour and the lich's own eye table. The body sits in a group scaled by `LI_SC` = 1.05, so it stands about 1.9 m (2.0 m with the crown). The robe is worn inside the bone pieces it covers, so it falls apart with them in Death:

- `bone_ribs`: robe shell (back, sides, two front halves that leave the ribcage bare down the middle, shoulders round the neck), a high stiff collar flaring at the sides, a gold trim on the opening, the phylactery (glowing gem on a chain) over the breastbone.
- `bone_spine`, `bone_pelvis`: robe over the waist and hips, cord sash with hanging ends. The waist robe reaches up inside the torso shell and down over the hips robe, so no gap opens when the body bends.
- `bone_neck`: a cloth wrap round the neck, closing the gap between the shoulders and the skull.
- Skirt (`liSkirt`): front, back and side panels pivot inside `bone_pelvis` (`skirt_*`, `skirtLow_*`) and follow the thighs in `post()`; the lower parts fold back on a high knee. A panel that would go into the ground (kneeling) is folded outwards by the smallest angle that keeps it above it, lower part first. Torn hem strips, holes, a worn patch. The hem ends at mid-shin, so the bony feet show.
- Arms: shoulder caps and sleeves on the humerus; the forearm sleeve flares towards the wrist with a torn edge. Bony hands.
- Headwear on `bone_skull`.
- Staff `weapon_R` in the right socket (grip at the origin, foot 1.0 below, top about 1.0 above). The right fist stays closed round it.
- Spell orb `orb_L` beyond the left fingers: two glowing cubes, kept tiny (scale 0.001) unless a clip grows it.

## Clips (19)

| Clip | Length | Loop | What it does |
|---|---|---|---|
| Idle | 5.0 s | loop | Stands leaning lightly on the planted staff, looks slowly round, the fingers twitch |
| Walk | 1.2 s | loop | Slow, stately steps, the staff planted with every left step, about 0.5 m/s |
| Levitate | 2.6 s | once → Hover | Spreads the left hand palm down, lifts the staff and rises to the float height, toes pointing down |
| Hover | 4.0 s | loop | Floats, bobbing slowly, legs dangling, robe hanging |
| Float | 2.4 s | loop | Glides forward leaning in, legs trailing, staff tilted ahead, 1.2 m/s |
| Land | 2.2 s | once → Idle | Sinks back down toes first, the knees give a little, the staff is planted again |
| Hit 1 (standing) | 0.9 s | once → Idle | Blow to the face: the skull snaps back, the free hand flies up, the staff stays planted |
| Hit 2 (standing) | 1.2 s | once → Idle | Struck from the right: twists away, steps out to the left, steps back in |
| Heavy hit (standing) | 2.5 s | once → Idle | Knocked down onto the left knee, leaning on the planted staff and bracing on the knee, then pulls itself up |
| Idle (war mode) | 2.6 s | loop | Hovers higher, left side forward, staff angled ahead, claw raised with the orb flickering |
| Float (war mode) | 2.0 s | loop | Advances through the air, staff and claw forward, 0.9 m/s |
| Spell 1 (bolt) | 2.0 s | once | Draws the orb in at its side (elbow down), thrusts the open hand forward and hurls it (the orb vanishes) |
| Spell 2 (raise the dead) | 3.4 s | once | Rises higher with staff and palm lifted, the orb swelling, then bows and presses the palm down at the ground, holds |
| Spell 3 (drain life) | 3.0 s | once | Reaches out with an open claw, clenches it and drags the stolen life back to its chest, the orb swelling |
| Staff strike | 1.4 s | once | Raises the staff like a hammer beside the right shoulder and chops it down ahead, clear of the body on its right |
| Hit 1 | 0.9 s | once | Knocked back through the air, head snapping back |
| Hit 2 | 1.1 s | once | Struck from the right, twists away and drifts aside |
| Death | about 1.7 s | once, held | Struck in the air, drops to the ground, the knees give way and it falls apart: the robed torso and the skirt lie face down along the fall, the bones scatter round them, the staff lands first and lies flat on the ground on its right, the skull rolls off forward and to the left |
| Rise | 2.8 s | once → Idle (war mode) | The pile trembles, the pieces fly back top first, it straightens and rises into the hover |

War-mode clips start and end on the war hover and are followed by Idle (war mode).

## How the clips are built (`lichClips`)

- Keyframes and loops are solved with the warrior's IK (`wrSolve`) in body units, with the goblin shaman's staff channels: `T` staff foot, `G` grip [x, z], `pl` planted, `ap` automatic elbow. A planted staff is put on the ground (8 mm clearance); a carried one is never let below it.
- No twisted arms (see `docs/CHARACTER_CREATION.md`):
  - The staff hand's elbow is searched round the shoulder–wrist line (`pole()`): the forearm crosses the staff, the fist may roll at most about 60° (costs rise steeply past 100°), the elbow never points inwards, up or forward, and in one-shot clips it stays near last frame's elbow.
  - A carried staff (`wf` = 1, every levitating clip) is not aimed by the hand at all: the fist follows the forearm, bent only by the keyed wrist angles `wr`, and the elbow search places the elbow so that the straight wrist points the staff along `dR`. `wf` blends from the aimed, planted staff to this in Levitate and Land.
  - The free left hand follows its forearm with the keyed wrist angles `wl`; it is never aimed (`dL` only nudges the IK).
- `fl` (float height) lifts the hips, both feet and both grips together, so the hover stances are authored like standing ones; it is scaled by the Float height option (`lichClips(kind, flk)`, clips cached per staff and height). Hovering feet have a negative lift so the legs hang almost straight and the robe stays closed.
- `ob` sizes the spell orb (`orb_L.scale` track in every clip).
- One-shot clips keep each elbow near where it pointed in the frame before (continuity, as the ogre magi).
- `clip.next` names the clip the viewer plays after a one-shot clip (new in `app.js`; other characters still go back to Idle).
- Death and Rise are the skeleton's `skDeathRise` with own slump keys (the feet flatten as it lands), a forward topple (`fwd`), and rest rules: the ribs (with the spine and neck joined, `joinChunk`) and the pelvis with the skirt lie face down along the fall; the pelvis is shifted back (`fw`) so the skirt lies behind the torso instead of on it. The staff (`weapon_R`) lands first and is shifted to the right of the fall (`sd`), so it lies flat on the ground beside the body; the skull is shifted forward and to the left, clear of it. The staff is let go early (0.24 s, while the lich drops) and comes back last in Rise (`late`), so it never sinks into the ground with the slumping hand. Once the pelvis is loose the skirt hangs straight from it, so it lies flat on the ground with the leg bones on top. Recorded at 60 fps.

## Changes elsewhere

- `buildSkeleton` (`src/characters/skeleton.js`): `o.gear` skips the weapon and buckler; `o.eyeTab` replaces the eye table. Existing skeletons are unchanged.
- `skDeathRise`: a rest rule may carry `fw` (metres along the fall direction), `sd` (metres to the right of it) and `late` (comes back last in Rise); option `fps` (default 30); `root.userData.detaching` is set while the pieces are captured at the release.
- `tools/check-character.mjs`: the twist, flip, ground and pile check for any character (see `docs/CHARACTER_CREATION.md`).
- `app.js`: after a one-shot clip the viewer plays `clip.next` if it is set, otherwise Idle.

## Checks done

- `tools/check-character.mjs`: every clip passes (no flips, no twists, nothing below the ground, death pile 0.51 m) for all five staffs, all three float heights and seeds 1–3. Low hover: the toes stay about 5 cm off the ground.
- Height 1.91 m bare-headed, 2.01 m with the crown.
- Viewer: Day and Night (eyes, gems, phylactery and orb glow), contact sheets of levitation, walk, float, spells, staff strike, hits, Death and Rise from several angles; a lineup of every staff, headwear and robe. After Death the staff lies on the ground (lowest point 2 mm) and the skull does not touch it, for several seeds and staffs.
