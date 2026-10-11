# Skeletal warrior

The skeletal warrior enemy (`skeleton-warrior`, Characters → Enemies → Undead). Code: `src/characters/skeleton_warrior.js` (body type, sword, wrapper) on top of `buildSkeleton` in `src/characters/skeleton.js` (`B: VB.skeletonWarrior`, `great: true`).

Open it: `http://localhost:<port>/#/a/skeleton-warrior`

## Options

| Option | Choices (default first) | Notes |
|---|---|---|
| Bones | Random, Bleached, Aged, Grimy, Dark, Reddish (fire) | Same as the skeleton |
| Armour | Random, None, Leather, Chain mail, Plate | Random rolls chain mail (1 in 3) or plate (2 in 3), never none or leather |
| Armour pieces | Random, Few (2-3), Most (5-6), Full set (8); default Most | Same eight areas as the skeleton (see `docs/SKELETON.md`) |
| Eyes | Random, Pale blue glow, Green glow, Dark | Same as the skeleton |

## Body

`VB.skeletonWarrior` keeps the skeleton's bone lengths (so the bones and the IK fit as they are) and changes:

| | Skeleton | Skeletal warrior |
|---|---|---|
| Shoulder half-width `shW` | 0.21 | 0.24 |
| Hip joints from centre `hipW` | 0.068 | 0.08 |
| Width scale `g` (feet and hands) | 1 | 1.2 |
| Bone thickness `boneK` | 1 | ribs and pelvis 1.2, spine 1.35, neck 1.3, upper arm, forearm, thigh and shin 1.4, hands and feet 1.2, skull 1 |

The body is built in a group scaled by `SKW_SC` = 1.21, so it stands about 2.2 m (2.24 m with the plate helmet). Clips stay in body units; walking speeds and their notes are multiplied by `SKW_SC`.

## Two-handed sword (`skwSword`)

`weapon_R` in the right socket, the same frame as the other skeleton weapons (blade along the thumb side, edges towards the fingers and the back of the hand). In body units: wrapped handle 0.42 long with a band between the fists, heavy pommel, straight guard 0.32 wide, ricasso, then a blade tapering from 0.09 to the tip with a dark fuller and two rust patches; about 1.55 overall (1.9 m real). The right fist holds it under the guard, the left fist `WR_HAFT` (0.3) lower on the handle. No buckler.

## Clips (26)

The warrior's two-handed clips (`warriorClips(B, {axe: true, long: true})`, see `docs/WARRIOR.md`) except Cast spell: Idle, Walk, Run, Idle/Walk/Run (war mode), Crouch, Crouch & move forward, Crouching attack, Jump, Jump & attack, Hit 1, Hit 2, Heavy hit, Shout, Roar, Taunt (beckons with the free hand), Kick, Hip kick, Two-handed attack 1 and 2, Two-handed heavy attack, Low swing two-handed, Block with two-handed weapon. Plus the skeleton's Death and Rise.

- `long: true` changes only the blade direction at the bottom of Two-handed heavy attack, so the longer blade's tip ends on the ground (1 cm above it) instead of in it.
- In the two-handed attacks the left elbow stays out to the side (see `docs/WARRIOR.md`, IK keyframe clips).
- Death: a long weapon (`weapon_R.userData.long`) lands first and lies beside the pile, pushed out across its own length, instead of on top of the bones.

## Checks done

- Every clip sampled at 30 fps for 5 looks: body never below the ground (the 6 mm toe dip in Run is the skeleton's own), the sword lowest at 1 cm in the heavy attack and on the ground in Death and Rise.
- Viewer: Idle, Two-handed heavy attack and Death; bleached, dark and reddish bones; Day.
