# Hobgoblin

The hobgoblin enemy (`hobgoblin`, Characters → Enemies → Brutes). Code: `src/characters/hobgoblin.js` (body and clips come from `src/characters/goblin.js`, see `docs/GOBLIN.md`).

Open it: `http://localhost:<port>/#/a/hobgoblin`

## Options

| Option | Choices (default first) |
|---|---|
| Skin | Random, Rust orange, Brick red, Ochre-brown, Olive grey, Slate grey |
| Top | Random (studded jerkin most often), Studded jerkin, Ragged shirt, No shirt |
| Legs | Same as the goblin |
| Helmet | Random (iron cap most often), Iron cap, None |
| Weapon | Heavy cleaver, Bearded war axe, Iron-bound mace |

"New look" rolls the Random options plus hair under no helmet (bald, a crest of hair or straggly hair), the jerkin leather (dark, tan, brown, black or red-dyed) and the bracer colour.

## Body

`buildGoblin` with body type `VB.hobgoblin`, placed inside a group scaled by `HB_SC` = 1.5, so it stands about 2.0 m (2.1 m with the iron cap). The body type keeps the goblin's leg and arm lengths but has thicker limbs (`g` 1.15, arms 1.3), a flatter belly (`td` 1.25), wider shoulders and hips, and a smaller head (1.1 instead of 1.25), so it reads as more muscular and grown-up than the goblin.

Accessories come from the `hob` option of `buildGoblin`:
- studded jerkin: leather torso and short sleeves with three rows of iron studs front and back, and a darker collar;
- iron cap: riveted dome with a darker rim and a low boss on top (hides tufts and crest);
- iron pauldron on the left shoulder (two plates, rivets);
- leather bracers bound with two cords on both forearms (the wrist stays bare so the grip clears it);
- the shaman's thick belt with the iron buckle, instead of the rope.

Other hooks added to `buildGoblin`: `skins` (another skin table), `wpnFn` (another weapon builder), and `userData.look` (the rolled looks, used for the variant text).

## Weapons

`hbWeapon(kind)` uses the goblin weapon frame (grip at the origin along +y, edge towards +x) and about the same length, so the goblin clips fit unchanged.

- **Heavy cleaver:** falchion with a straight spine, a blade widening towards the clipped tip, a bright edge, rust patches.
- **Bearded war axe:** long haft, a head whose blade hooks down along the haft, a short back spike, rope lashings.
- **Iron-bound mace:** wooden haft with a leather grip, square iron head with dark bands, staggered studs and a cap.

## Clips

The goblin's 18 clips (see `docs/GOBLIN.md`), solved on the hobgoblin body. Deaths are measured on a bare hobgoblin so the fall rests on its own meshes. Gait speeds (`clip.speed` and the note) are multiplied by 1.5: walk 1.3 m/s, run 3.5 m/s, run away 4.2 m/s, war walk 0.7 m/s, war run 3.3 m/s.

## Checks done

- All clips × 3 weapons sampled at 30 fps: body never more than 1.5 cm below the ground (same as the goblin, scaled), weapons never below it.
- Weapon against head, neck, torso and legs: no hits outside the deaths.
- Goblin and goblin shaman unchanged (same rolls, clip counts and variant text).
- Viewer in Day, Dusk and Night; GLB export with all clips.
