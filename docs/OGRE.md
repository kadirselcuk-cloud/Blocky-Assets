# Ogre

The ogre enemy (`ogre`, Characters → Enemies → Brutes). Code: `src/characters/ogre.js`.

Open it: `http://localhost:<port>/#/a/ogre`

## Options

| Option | Choices (default first) |
|---|---|
| Skin | Random, Grey-green, Mud-brown, Pale grey, Ochre, Dusky blue, Dusky pink |
| Hair | Random (topknot most often), Bald, Topknot, Shaggy |
| Mantle | Random (fur most often), Fur mantle, None |
| Weapon | Knotted club, Tree trunk |

"New look" also rolls the hide colour (brown, tan, dark, grey-brown, mottled), the fur colour (brown, black, grey, fawn), the hair colour, warts, a scar across the belly and a broken iron shackle on the left wrist.

## Body

`VB.ogre` is built in real metres (no group scale, so the 5 cm texture pixels stay the same as everywhere else) on the villager's 25 joints. About 3.4 m tall (3.6 m with the topknot): hips at 1.51 m, thigh 0.66, shin 0.60, upper arm 0.74, forearm 0.68, shoulders 1.6 m apart.

- Gut: a 1.3 m wide core on the spine joint, love handles, and a paunch that swells forward in three steps and hangs over the belt (navel, crease).
- Chest: broad with sagging pecs, heavy traps and a hump; thick neck stub.
- Head: small for the body. Broad skull, an underslung jaw with two lower tusks and small lower teeth, a double chin, one heavy brow, small yellow eyes, a wide flat nose, stubby ears pointing out.
- Arms: long and heavy, leather wrist wraps, big mitts with dark nails.
- Legs: fat thighs in hide breeches with a ragged hem, thick calves, broad bare feet (the sole matches the IK foot, `g` = 3.4).
- Gear: thick belt under the gut with a pouch, a bone necklace (teeth and a bone), fur mantle with fur pads on the shoulders.

## Weapons

`ogWeapon(kind)`: right grip at the origin, left grip `OG_HAFT` (0.36 m) behind it, heavy end along +y. Meshes sit directly in the group (the death clips read them).

- **Knotted club:** 2.8 m (the head is built at 1.4× by `grow`). Wrapped haft with a knob, a head that swells in crooked lumps, two iron bands, iron nails all round, knots.
- **Tree trunk:** 2.9 m (everything past the haft at 0.68×). The thin end is the haft (broken top with splinters), bark ridges, two broken branch stubs, moss, a root plate with seven roots and a clod of earth.

## Clips

Both weapons are held like the warrior's two-handed axe (`wrSolve` with `two`; `R.haft` gives the hand spacing, a small hook added to `wrSolve`): the left hand rides the haft, or is free when `lf` = 1. Normal mode carries the weapon on the right shoulder.

The IK rig is a bare ogre holding the weapon (`ogRig`, fur mantle and topknot so it covers every look). After each solve:
1. while any weapon point is inside a body box (hands and forearms excepted), the grip is moved out, away from that box's centre;
2. if any of the weapon is below the ground, it is tilted up about the level axis across it until it rests on the ground (smashes land and stay there);
3. step 1 runs again after a tilt.

In one-shot clips the frames are solved in time order with continuity: each elbow pole leans towards where that elbow pointed the frame before, and the right fist keeps its roll about the haft (`eR`) from the frame before. The left fist copies the right fist's roll (`R.lroll`, an opt-in hook in `wrSolve`). Free-hand targets stay at arm's length from the shoulder, and the left hand lets go of the haft and comes back through a pose low in front of the body, so no arm swings round.

17 clips:

| Clip | What it does |
|---|---|
| Idle | Heavy breathing, looks around, scratches the gut with the free hand |
| Walk | Lumbering steps, hips swaying, weapon on the shoulder, 0.9 m/s |
| Run | Leaning in, free arm pumping, 3.7 m/s |
| Idle (war mode) | Low and wide, left side forward, weapon cocked over the right shoulder in both hands |
| Walk (war mode) | Advancing, weapon ready, 0.7 m/s |
| Run (war mode) | Charge with the weapon raised, 3.9 m/s |
| Roar | Crouches, rears up with the weapon high, head back, pounds the chest three times |
| Taunt | Weapon to the shoulder, slaps the gut three times and laughs |
| Attack 1 | Wide sweep right to left with a step in, weapon brought back low in front |
| Attack 2 | Overhead smash onto the ground |
| Heavy attack | Wind-up behind the back, lunging step, ground slam held a moment |
| Stomp | Left hand drops off the haft, weight on the left leg, right knee hauled up, stamps the ground; free arm out for balance |
| Belly bash | Left hand drops off the haft, both arms swing back (weapon held out to the side), a big step, the gut thrust forward |
| Hit | Head and shoulders snap back |
| Heavy hit | Knocked back two heavy steps, then steps in again |
| Death 1, Death 2 | The goblin's falls (`goblinDeaths`) on the ogre's body: back onto the seat and back, or to the knees and face-first onto the gut; the weapon drops and lies flat |

## Checks done

- All clips × both weapons sampled at 30 fps: body never more than 1.7 cm below the ground, weapons never below it.
- Weapon against head, neck, chest, gut and upper arms (sampled at 15 fps): at most about 6 cm, in passing frames of Attack 1, Roar and Belly bash.
- Hobgoblin and warrior unchanged (`R.haft` is only set by the ogre rig).
- Viewer in Day, Dusk and Night; GLB export with all clips (about 1.1 MB).
