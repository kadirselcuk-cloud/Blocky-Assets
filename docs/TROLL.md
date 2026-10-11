# Troll

The troll enemy (`troll`, Characters → Enemies → Brutes). Code: `src/characters/troll.js`.

Open it: `http://localhost:<port>/#/a/troll`

## Options

| Option | Choices (default first) |
|---|---|
| Skin | Random, Moss green, Stone grey, Blue-grey, Pale olive, Bark brown, Swamp teal |
| Hair | Random (stringy most often), Stringy, Matted mane, Bald |

"New look" also rolls the hair colour (black, dark green, grey, rust), the kilt hide (brown, tan, dark, grey), moss on the back and right shoulder, warts, a belly scar, bones tied to the belt and an iron ring in the right ear.

## Body

`VB.troll` is built in real metres (like the ogre) on the villager's 25 joints, plus a `jaw` node in the head. About 3.9 m standing straight, about 3.1 m in its hunched stance: hips at 1.97 m, thigh 0.88, shin 0.84, upper arm 0.98, forearm 0.92, hands 2.5× (about 0.36 m), shoulders 1.24 m apart.

- Lean: narrow pelvis, sunken belly, a deep narrow chest with ribs along the sides, collarbones, a hump on the upper back and knobs down the spine.
- Head: low skull, heavy brow over small deep-set yellow eyes, a long drooping nose with a fat bulb hanging over the mouth, jagged upper teeth, a lower jaw that opens (two lower fangs), a long chin, big pointed ears pointing out and drooping a little.
- Hair strands are tilted back (`strand()`) so they lie over the hump instead of through it.
- Arms: very long and lean, bony elbows and wrists, huge hands with long fingers and black claws.
- Legs: long, a ragged hide kilt on the thighs, knobbly knees, long narrow feet with three clawed toes (the sole matches the IK foot, `g` = 3.2).

## Clips

Unarmed. IK clips use the warrior's `wrSolve` on a bare troll (`trRig`), with both hands as free targets. After each solve a hand that would go below the ground is lifted. One-shot clips keep each elbow on the side it was on the frame before. Every clip has a `jaw.quaternion` track.

The FK clips (Fall unconscious, Rise, Death) are keyed joint angles (`gbDeathKeys`) from the solved war stance; every frame the troll is dropped onto its lowest point, and pinned feet stay put (`trFalls`). Rise starts on Fall unconscious's last frame and ends on the war stance. The viewer holds the last frame of clips named Death… or Fall… (app.js).

17 clips:

| Clip | What it does |
|---|---|
| Idle | Hunched breathing, sniffs the air, scratches its head |
| Walk | Long loping strides, arms swinging, 1.1 m/s |
| Run | Leaning in, long arms pumping, 5.1 m/s |
| Idle (war mode) | Low and wide, both arms reaching out, claws flexing |
| Walk (war mode) | Stalking forward, arms out, 0.9 m/s |
| Run (war mode) | Charge, leaning far forward, arms swept back, 5.7 m/s |
| Roar | Crouches, rears up with the arms spread wide, mouth wide open |
| Attack 1 | Long backhand swipe from the right with a step in |
| Attack 2 | Overhead claw rake with the left hand, down and across |
| Heavy attack | Both fists raised high, hammered into the ground |
| Grab & bite | Lunges, grabs with both hands, bites, flings the catch aside |
| Low sweep | Crouches with the left knuckles on the ground, sweeps the right arm at shin height |
| Hit | Head and shoulders snap back |
| Heavy hit | Knocked back two long steps, then stalks in again |
| Fall unconscious | Knees buckle, topples face-first, lies still (the viewer holds it) |
| Rise | Fingers twitch, pushes up, kneels on its knuckles, plants the right foot, stands, shakes the head, ends in the war stance |
| Death | Staggers back, sits down hard, falls onto the back, jaw hanging open |

## Checks done

- All clips sampled at 30 fps with every hair style: body never more than 6 mm below the ground, and every frame outside the runs touches it.
- Hands, fingers and forearms against head, neck, chest, belly, hips and legs (15 fps): no overlap except the scratching fingertips touching the scalp in Idle.
- Fall unconscious end = Rise start exactly; Rise end = war stance.
- Viewer in Day, Dusk and Night; GLB export with all clips and the jaw (about 1.15 MB).
