# Gear kit

Everything the Mercenary can wear or carry, the same pieces on the ground with animations, effects for weapons, shields and armour, potions and power-ups. Folder **Gear** (`gear/…`), ids `gr-…`.

Code:

| File | Contents |
|---|---|
| `src/items/gear_items.js` | the wearable pieces as `MC_GEAR[slot][key]` builders (plus their names in `MC_SLOTS`), metals (`MC_METAL`, `mcMetal`), own textures (`giTex`: scale, lamellar, fur), shared materials (`GI`), `giSpike`/`giSpikeT` |
| `src/items/gear_fx.js` | the effects engine (`gfSpec`, `gfBake`), recipes (`GF_RX` weapon/shield, `GF_AX` protection), the Mercenary wrapper that adds the effects |
| `src/items/gear_ground.js` | ground versions `gr-<slot>-<key>` (`grPiece`, `grBuild`), the Mercenary's full option list (`mcOptsAll`) |
| `src/items/consumables.js` | potions `gr-potion-<brew>` (`poBuild`) and power-ups `gr-pu-<kind>` (`puBuild`) |

One builder per piece: the Mercenary wears it, and the ground asset runs the very same builder on a bare rest-pose rig (`mcJoints`, `mcMats`) and keeps its boxes. A new piece is one builder and one name; its ground asset appears by itself.

## Pieces

| Slot | Choices |
|---|---|
| Weapon | arming sword, falchion, flanged mace, bearded axe, longsword, broadsword, scimitar, short sword, dagger, rapier, cleaver, war hammer, morning star, war pick, hand axe, double axe, spiked club, sceptre (glowing gem), torch (burns by default) |
| Shield | heater, round, kite, buckler, steel heater, targe, spiked buckler, oblong, ornate heater (glowing gem), dark round (spikes) |
| Helmet | nasal helm, mail coif, kettle hat, great helm, bascinet, sallet, armet, horned helm, winged helm, ridge helm, crown, hood, leather cap, crested great helm, dark helm (red glowing slit), mage hat |
| Armour | mail hauberk, half plate, studded leather, gambeson, linen shirt, full plate, ornate plate, warlord plate (spikes), brigandine, scale, lamellar, surcoat over mail, mail shirt, battlemage robe, ranger leathers, barbarian furs |
| Shoulders (new slot) | armour's own, none, leather, steel, spiked, fur mantle, gilded, mail mantle |
| Gloves | leather, mail mittens, plate gauntlets, fingerless with bracers, studded, spiked gauntlets |
| Boots | leather, plate sabatons, riding boots, fur boots, mail chausses and shoes, iron-shod boots |
| Pants | wool, leather, plate cuisses, mail chausses, padded, fur leggings |
| Belt (new slot) | leather belt, with pouches, with potions (three glowing vials), gilded, sash, rope |
| Cape | cape, fur-collared, royal (gold trim, ermine collar), tattered, hooded |

**Metals**: steel, black iron, bronze, gold, silver, mithril, obsidian, bone. The Mercenary has a weapon metal and an armour metal (armour, shoulders, helmet, gloves, boots, pants and shields); ground pieces have one Metal option where it applies.

Rules kept: no crosses (helmet slits horizontal, the surcoat emblem is a diamond, spikes in threes and sixes, the dark helm has no nose bar), helmets say what hair shows (`'all'`, `'back'`, `'none'`, `'hide'` = closed helm, no hair or beard), soles never lower than the leather boots, horns and spikes tilt outward. All capes share the four laid panels, so they share clips; Roll and Death are baked per helmet, armour, shoulders, hairstyle and cape.

## Effects

| Where | Effects |
|---|---|
| Weapon and shield | glow, burning, lightning, frost, dripping venom, smoke, pulsing runes, radiant |
| Protection (armour) | armour glow, ward bubble, rune rings, flame aura, frost aura, holy radiance, shadow aura, storm aura, poison miasma |

Each has a **colour** (the effect's own, or any of the 12 spell schools of `SP_PAL`) and a **strength** (faint, low, medium, high, blazing: count, size, glow and light). On the Mercenary: Weapon effect / colour / strength, Shield effect (it uses the protection colour and strength), Protection effect / colour / strength. Ground pieces: Effect (protection effects for armour pieces) / colour / strength.

How they are made (`gfBake`):
- Particles are the spells' unit cubes; glow is a back-faced additive shell round each glowing box (halo) and a thin front-faced shell that makes the box look lit (tint). Shells are children of the boxes, so they need no tracks.
- Every clip of the asset is sampled at 30 fps; the emitter (the weapon's business end `GF_WZ`, the shield, the worn gear minus skin, hair and face) is read from the pose. A particle is born where the emitter was at its birth time, so flames trail behind a swing and smoke rises straight up whatever the blade does.
- Particle periods divide each clip's length, so loops never pop. Behaviours: rise (flame), smoke, sparkle, ember, mist, drip (lands and splashes), mote, rune, arc (a zig-zag of stretched segments), bubble (ward tiles on an ellipsoid round the hips), ring (rune glyphs orbiting), ground ring, ground flames, ground sparkles and bubbles, spiral.
- The tracks are added to copies of the clips (cached per clip and effect key); a light follows each effect. Everything exports in the GLB.
- Effect meshes carry `userData.fx` (and `gear`): `tools/check-character.mjs` skips them for the ground and pile checks.

## Ground versions

`gr-<slot>-<key>` for every piece (not "None" and not "Armour's own"). Display:
- **On the ground**: weapons lie flat on both ends (`grSettle`), shields on their back, helmets on their rim (settled front to back), gloves side by side, boots standing, belts as a loop with their pouches lying beside them
- **On a stand**: body armour, shoulders, leg armour and capes on a wooden stand (post inside the torso, bar through the shoulders; a cape's collar rests on the bar)
- **Stuck in the ground**: blades, point down about 12 cm deep
- **Pickup**: hovering 0.3 m and turning above a glowing pool

Clips: Idle (loop), Appear, Drop (falls, bounces, settles; ground display), Pick up (rises, spins and shrinks away). Options: display, metal, shield or cloth colour where they apply, effect, effect colour and strength.

## Potions and power-ups

**Potions** (`gr-potion-…`): health, mana, stamina, strength, swiftness, invisibility, fire resistance, antidote, elixir of life, shadow draught, charm philtre, grave draught. Hollow glass (round flask, tall vial, square bottle with label, conical flask, heart flask, big jug; small, medium, large) with the glowing brew inside, a waxed cork and bubbles. Clips: Idle, Appear, Drop (lands upright and wobbles), Pick up, Drink (the cork pops and falls beside it, the brew drains, sparkles rise), Shatter (shards fly and settle, the brew splashes into a puddle that soaks away). Display on the ground or as a pickup; glow strength.

**Power-ups** (`gr-pu-…`): health heart, mana crystal, aegis, strength gauntlet, swiftness bolt, haste hourglass, extra life (winged gold heart), experience gem, gold coin, loot magnet, rage orb, shadow cloak. Glowing voxel icons; floating, on a stone pedestal or in a light beam. Clips: Idle (hover, turn, pulse, orbiting sparkles), Appear (the beam strikes, the icon grows), Collect (spins up, bursts into sparkles).

## Checks done

- Every gear asset builds in every option (3370 builds, Node).
- `node tools/check-character.mjs mercenary` for every new weapon and shield and for bulky gear and effect combinations (see HISTORY.md).
- `node tools/check-palette.mjs`: all colours within the tiers (the gear files are in its default list).
- Viewer and contact sheets: every piece worn and on the ground, every effect, potion and power-up clips, day and night.

The older Loot kit (`lt-`) is unchanged; its weapons and armour are not wearable.
