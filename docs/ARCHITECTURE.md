# Architecture

## Loading model
- All files in `src/` are **classic scripts sharing one global scope**; there are no ES modules. Order matters and is defined once in `src/manifest.json`.
- `index.html` loads them in that order during development. `tools/build.mjs` inlines them into `dist/asset-forge.html`, and the library part into `dist/asset-forge-lib.js`.
- Top-level `const` names must be unique across files. Later files may *reassign* function declarations to extend them (for example `tileMats`).
- Uses three.js **r128** APIs (`outputEncoding`, `sRGBEncoding`, `PMREMGenerator.fromEquirectangular`). Don't upgrade three without porting.

## Files
| File | Contents |
|---|---|
| core/models.js | RNG (`mulberry32`, `hashStr`, `seed`), canvas texture helpers, `box()` with world-space UVs, `put()`, legacy smooth buildings (unused) |
| core/anim.js | villager clip sampler (`sampleClip`) and the 13 villager clips scaled per body type `VB` |
| characters/villager.js | `bm()` pixel materials for characters, `bx()` box helper, `villagerTraits`, `buildVillager(kind,seed,job,force)`, `TOOLS` (held tools plus workpieces), `buildWorkpiece` |
| characters/occ.js | `OCC` occupations (outfit, head, accessories, tool), `applyOccupation`, extra tools |
| characters/registry_chars.js | registers the villager, woman, boy and girl |
| buildings/blocky.js | **voxel core**: `VXD` texture recipes, `vxTex`, `vm(kind)` materials, `vWalls`, `vWin`, `vDoor`, `vRoof`, `vArchRoof`, `vPyramid`, `vlog`, `vYard`, props (`vBarrel`, `vCrate`, `vHay`, `vBush`, `vLantern`, `vFence`, `vWoodpile`, `vCart`, `vSack`), the first 6 buildings |
| buildings/blocky2..13.js | later batches of buildings; helpers grew along the way (`vTree`, `vHangSign`/`ICONS`, `vBanner`, `vMerlons`, `vSlit`, `vDisc`, `vDome`, `vMouth` (glowing oven mouth), `vFirePit`, `vLeanTo`, `vTable`, `vChest`, `vGateAnim`, `vStoneWallSeg`, `vPalisadeSeg`, `vWaterWheel`…) |
| buildings/blocky3.js, blocky8.js | numbered types built from config arrays: `cottageType`, `brickType`, `croftType`, `townType`, `farmBase`, `vStall` |
| buildings/blocky9.js | categories (`CATS`) mapping asset ids to category folders |
| buildings/fences.js | `fWood`, `fStone`, `fGate` |
| terrain/terrain.js | `vTile(classify,deco)`, `roadTile`, `waterTile`, `WATERMAT` (animated, sky-reflective water), `vWaterSurface`, `vWaterArea`, sprite foliage `vSprite` |
| environment/env.js | `vxTree(kind,size)`, rocks with veins, ore, reeds, bushes, ferns, flowers, mushrooms, stump, log |
| items/items.js | `iRoot`, `upright`, `vFlame`, `hollow`, weapons `w*`, armour `a*`, potions `p*`, containers `i*` with `fillTop`, furniture, lighting `l*` |
| characters/animals.js | `QUAD` species specs, `buildQuad(sp,o)` with `young`, `aClip` sampler, `quadClips`, birds (`buildBird`, `buildAvian`), coat colour sets, registrations |
| characters/outlaws.js | outlaw occupations, extra weapons, camp builders |
| characters/warrior.js | `VB.warrior`/`VB.warriorF` body types (passed to `buildVillager` as `force.B`), `OCC.warrior*` (random clothes via an `fn(T)` hook in `applyOccupation`), `pcurve`, `legFK`, `gaitPose` (grounded gait clips), `wrKeys` (monotone keyframes), `wrRig`/`wrSolve` (leg and arm IK on a copy of the rig: feet `FL/FR`, grips `gR/gL`, blade `dR`, shield facing `dL`, elbow poles `pR/pL`), `warriorClips(B,E)`, `wrEquip` (glowing helmet, plate, gloves; sword and shield in the hand sockets), `buildWarrior` |
| characters/goblin.js | `VB.goblin` body type, `GB_SKIN`, `gbWeapon` (crude shortsword, one-handed axe, club), `buildGoblin` (own meshes on the villager joint layout, so the warrior IK applies), `goblinClips(B,weapon)` (gait clips, IK clips authored in metres and converted by `gbU`, hits, and per-weapon deaths from `goblinDeaths`: FK keys with per-segment easing, body dropped onto its lowest point, weapon `weapon_R` falling on its own tracks). Options used by the shaman and hobgoblin: `B` (body type), `weapon:'none'`, `shaman:{ear}` (belt, necklace, earring), `hob:{top,helm,hair,jerkC,bracerC,pauldron}` (studded jerkin, iron cap, pauldron, bracers, belt), `skins`, `wpnFn`; `goblinDeaths(B,wpn,GX)` accepts another stance, rig, model and release times |
| characters/goblin_shaman.js | `VB.gshaman` body type, `shStaff` (gnarled, banner, bulky), `buildGShaman` (goblin body inside a group scaled by `SH_SC`), `shamanClips(staff)`: IK clips with staff channels (`T`/`G` planted foot and grip, `pl`, `sl` hand slide, `ap` auto elbow), staff ground clamp, goblin deaths with an early release |
| characters/hobgoblin.js | `VB.hobgoblin` body type, `HB_SKIN`, `hbWeapon` (heavy cleaver, bearded war axe, iron-bound mace), `buildHobgoblin` (goblin body with the `hob` option inside a group scaled by `HB_SC` = 1.5), `hobgoblinClips(weapon)`: the goblin clips with deaths measured on a bare hobgoblin, gait speeds scaled |
| characters/warg.js | `WG_COAT`, `WG_EYE`, `buildWarg` (own rig: split spine `chest`/`hips`, three-segment legs, opening `jaw`, two-part tail; coat, markings, mane, ears, eyes, scars, collar or saddle), `wgClip` (FK sampler that grounds each frame on the lowest box corner and optionally levels the body so both halves touch), `wgGait`, `wgPlant`, `wgMix`/`wgAdd`/`wgSeg`, `wargClips` |
| characters/ogre.js | `VB.ogre` body type (real metres, about 3.4 m), `OG_SKIN`, `ogWeapon` (knotted club, tree trunk), `buildOgre` (own meshes on the villager joint layout), `ogRig` (a bare ogre with the weapon as IK rig, with `low()` and `pen()` for the ground and body checks), `ogreClips(weapon)`: two-handed IK clips (`wrSolve` with `two`, `R.haft` and `R.lroll`; elbow and fist-roll continuity in one-shot clips) that push the weapon out of the body and tilt it onto the ground, plus `goblinDeaths` |
| characters/skeleton.js | `VB.skeleton` (villager male proportions), `skClub`, `skBuckler`, `buildSkeleton` (one named bone piece per joint, `bone_*`, with worn armour inside it; `weapon_R`, `shield_L`), `skDeathRise`: Death and Rise recorded on the model itself (pieces detach, fall and stack on a sampled height map; Rise flies them back top first). Clips: the warrior's sword-and-shield set plus these two |
| characters/lich.js | `VB.lich`, `liStaff` (gnarled, bone, emerald, ruby, sapphire), `liSkirt` (two-part robe panels inside `bone_pelvis`), `buildLich` (`buildSkeleton` with `gear:true` and `eyeTab`, then robe, headwear, phylactery, staff `weapon_R` and spell orb `orb_L` added to the bone pieces; group scaled by `LI_SC`), `lichClips(kind)`: shaman-style staff IK plus `fl` (float height) and `ob` (orb size); one-shot clips set `clip.next` |
| characters/wight.js | `VB.wight` (villager male proportions), `buildWight` (own meshes on the villager joints, `g_jaw`, hair chains `hair_B_*`/`hair_L_*`/`hair_R_*`, collider boxes flagged `userData.hairCol`), `wightClips` (two-handed IK with torso-frame hand targets, wrist keys `wr`/`wl` and elbow poles chosen by a cost search), `wtFalls` (Death/Rise, troll-style), `wtHairTracks` (lays the hair every frame and adds its tracks, cached per length and style) |
| characters/revenant.js | `VB.revenant` (bulky, group scaled by `RV_SC`), `rvWeapon` (short sword, axe, mace), `buildRevenant` (own meshes on the villager joints, weapons `rv_wpn_R`/`rv_wpn_L` in the sockets, eyes `g_eyes`), `rvSolver` (wight-style IK: torso-frame or shoulder-relative `{s:[…]}` hand targets, weapon directions met by a clamped, rate-limited wrist, blade-aware elbow pole search), `rvBaseClips` (shared clips), `rvFalls` (Death/Rise per weapon pair and helmet: weapons dropped flat and flown back, eye scale track) |
| characters/vampire_spawn.js | `VB.vspawn` (villager male proportions), `buildVampireSpawn` (own meshes on the villager joints, `g_jaw`, ear groups), `vampireSpawnClips` (the wight's IK clip machinery: torso-frame hand targets, wrist keys, elbow poles by cost search; every clip keys `g_jaw`), `vsFalls` (Death/Rise) |
| characters/vampire.js | `VB.vlord` (villager male proportions), `buildVampire` (own meshes on the villager joints inside the body group `vbody`, `g_jaw`, orbs `orb_R`/`orb_L`, cape pieces `cape_i_k`, smoke `vsmoke`/`vsmoke_*`), `vlCape` (cape cloth: point grid, constraints, body capsules, held edges), `vlCapeTracks` (bakes the cape into tracks), `vlPuff` (smoke puff placement), `vampireClips(flk)` (spawn-style arm IK with the lich float lift; every clip carries jaw, orb, body, smoke and cape tracks; `clip.hold` keeps Vanish on its last frame) |
| characters/vampire_beast.js | `VB.vbeast` (long thin villager proportions, 2.2 m), `buildVampireBeast` (own meshes on the villager joints inside `vbody`, `g_jaw`, wing fingers `wf{k}_{L,R}`, toes `tt*`/`tu*`, skinned wing membranes `vwing_L`/`vwing_R`, smoke `vsmoke_*`, rings `vring_*`), `vbbWing` (builds and binds a wing membrane), `vbbBeat` (one wing beat), `vampireBeastClips` (wrist targets and poles in a tilted chest frame, pole search, collarbone roll `cl`, feet in the hips' frame, toe-up fix after wrSolve; extra tracks for fingers, toes, jaw, body, smoke, rings) |
| characters/necromancer.js | `VB.necro` (villager female with longer legs, about 1.8 m), `ncStaff` (horned, caged, crescent skull staffs), `buildNecromancer` (own meshes on the villager joints inside `vbody`, `g_jaw`, hair chains, gown panels `sk_*`/`skUp_*`/`skLo_*`), `necromancerClips` (vampire-style arm IK; the carried staff: elbow chosen so the arm plane holds the staff direction, the wrist bends it there, ground clamp), `ncSkirtTracks` (lays the gown over the legs every frame, closed-form tilt, ground fold, width scale), `ncBake` (gown, then the wight's `wtHairTracks`) |
| characters/imp.js | `VB.imp` (small, about 1 m), `buildImp` (own meshes on the villager joints, `g_jaw`, rigid wings `iwing_*`/`iwingO_*`, tail `itail_0..7`), `impClips` (the vampire beast's IK with normal arms; `fl` whole-body flips and rolls with the head carried along; feet oriented from the hips after wrSolve; wing beat `impBeat`, tail curl/wave with ground fold, baked as tracks); adds the folder `characters/enemies/hell` |
| characters/hell_mound.js | `buildHellMound` (no legs: upper-body villager joints, `g_jaw`, a seven-segment foot `lm_ped_0..6` and three fat rolls `lm_roll_0..2` as plain groups), `hellMoundClips` (pure FK, no IK: swing-only upper arms with a keyed roll, hinge elbows; uneven arm lengths `LM_ARM`; foot pedal wave, roll follow/squash/jiggle and melt baked as position, scale and rotation tracks) |
| characters/succubus.js | `VB.succ` (the necromancer's body), `buildSuccubus` (own meshes on the villager joints in `vbody`, `g_jaw`, hair chains, rigid wings `swing_*`/`swingO_*`, tail `stail_0..9`), `succubusClips` (the necromancer's IK and pole search with both wrists keyed; the imp's wing beat `suBeat` and tail with ground lift, baked as tracks), hair by `wtHairTracks` |
| characters/oni.js | `VB.oni` (3 m, real metres), `buildOni` (own meshes on the villager joints, weapon group `on_wpn_R`), `onWeapon` (kanabō, spiked, barbed), `oniClips` (the revenant's `rvSolver` on the oni rig with a ground tilt for the weapon, `onSolver`; one-handed weapon, free left hand), `onFalls` (Death, weapon dropped as a track) |
| characters/fiend.js | `VB.fiend` (3 m, real metres, digitigrade goat legs: hips below the straight-leg height, IK ankle = hock, `R.noHeel`), `buildFiend` (own meshes on the villager joints, weapon groups `fd_wpn_R/L`), `fdWeapon` (long sword, double axe, flail with `fd_chain`), `fiendClips` (the revenant's `rvSolver` on the fiend rig with a ground tilt per weapon, `fdSolver`; both wrists keyed), `fdChainSim` (flail chain as a damped pendulum baked into tracks, kept above the ground and out of the body capsules `fdCaps`), `fdFalls` (Death, both weapons dropped as tracks) |
| characters/ogre_boss.js | `VB.ogreBoss` (the ogre's lengths x `OB_F` 1.05), `obRescale` (scales joint offsets and rebuilds boxes, no group scale), `buildOgreBoss` (`buildOgre` with the `heads` hook: warrior head on `head`, mage head on the group `headM`; staff `weapon_L` in the left socket), `obRig`, `obClips` (both arms by an elbow search scoring hand and upper-arm roll, `R.lprop` for the left-hand staff, `mh` channel turned into a `headM.quaternion` track), `obDeaths` (`goblinDeaths` with `GX.left`, per mantle) |
| scenes/scenes.js | `sceneTerrain` (voxel heightmap, only visible faces), `mergeStatic` (optional chunk size so big scenes can cull), `compactRig` (folds a character into one skinned mesh using a shared 16 × 16 texture atlas and vertex colours), `pineSwap`, `sceneStats`, agent behaviours (`agentOf`, `behPath`, `behWander`, `behCircle`, `giveTool`, `workPiece`) |
| scenes/scenes2.js | "Farm by the lake" (`vxSceneFarm2`), replacing the build of `sc-farm` |
| scenes/scenes3.js | "Mining village" (`vxSceneMining`, `sc-mining`), 200 × 200 m |
| scenes/scenes4.js | "Large fortified town" (`vxSceneTown`, `sc-town`), 300 × 300 m, plateau, palisade, river, sea shore |
| scenes/scenes5.js | "Fortified city" (`vxSceneCity`, `sc-city`), 500 × 500 m: curved road ribbons and bridges, irregular stone and wooden wall rings that follow the ground, a placement planner (oriented footprints, flat pads, regions, road fill), distance-based animation detail |
| export/export.js | `window.AssetForge` and GLB export (see EXPORT.md) |
| app/app.js | library UI, viewer, thumbnails, lighting presets, `Orbit` controls (WASD), options panel, animation panel, rig overlay |

## The registry
Every asset is one object in the global `ASSETS` array; folders live in the global `FOLDERS` map.
```js
ASSETS.push({
  id:'vx-example',                 // stable, unique, prefixed
  folder:'buildings/medieval/production',
  name:'Example',
  build:(seed,opts)=>THREE.Group, // seed only matters when variants:true
  desc:'One or two sentences shown in the viewer.',
  kind:'character'|'scene',       // optional; changes camera framing, animation UI
  variants:true, defaultSeed:3,    // optional: enables "New look"
  groundR:6,                       // optional legacy; prefer root.userData.ground
  opts:[{key:'contents',label:'Contents',choices:[['wine','Wine'],['water','Water']],def:'wine',live:false}]
});
FOLDERS['buildings/medieval/production']={name:'Production',blurb:'…',children:[]};
```

### What the root group carries (`root.userData`)
| key | meaning |
|---|---|
| `lights` | PointLights; their intensity follows Day/Dusk/Night (`userData.min` sets an always-on floor) |
| `ground` | grass base half-size in metres; `-1` means no base (terrain tiles, scenes) |
| `clips`, `joints` | AnimationClips and the joint objects (characters and animals) |
| `post()` | called after each mixer update (villager skirts) |
| `tick(dt)` | per-frame update (scenes, gate animation) |
| `setOpt(key,value)` | applies a `live` option without rebuilding |
| `awning`, `awnColor` | recolourable awning meshes (market stalls) |
| `animal` | marks animals (hides the tool row) |
| `occTool` | tool a villager holds for their occupation |

## Adding a building (pattern)
```js
function vxMyHall(){const root=new THREE.Group(),L=[];root.userData.lights=L;const Lx=6,Dz=4.4,base=.4,hw=2.6;
  vYard(root,10,8,0,1);bx(root,Lx+.2,base,Dz+.2,vm('cobble'),0,base/2,0);              // dirt yard + plinth
  const W=vWalls({Lx,Dz,y:base,h:hw,t:.2,mat:vm('plaster'),frame:vm('timber'),
    ops:{front:[{type:'door',x:0,w:1,y0:0,y1:2},{x:-1.8,w:.8,y0:.9,y1:1.7,flowers:true}],back:[],left:[],right:[]}});root.add(W.group);
  put(root,vRoof(Dz,Lx,2.4,vm('thatch'),{ov:.7,ovL:.6,step:.4,gable:vm('plaster'),ridge:vm('hay')}),0,base+hw,0);
  vLantern(root,L,.8,base+2,Dz/2);root.userData.ground=6;return root;}
ASSETS.push({id:'vx-myhall',folder:'buildings/medieval/civil',name:'My hall',build:vxMyHall,desc:'…'});
```
- `vWalls` openings: `type:'door'|'hole'` (default window), `x` along the face, `y0/y1` height, `w` width, plus optional `shutter`, `flowers`, `sill`, `lintel`, `leaf`, `open`. Each face (`W.faces.front` and so on) is a group in face coordinates, so decorations can be added to it.
- `vRoof(W,L,H,…)` builds a gable with its ridge along x. Rotate it π/2 for a front-facing gable.
- Animated parts set `mesh.onBeforeRender` to update a parent group. `mergeStatic` keeps those groups unmerged.

## Characters
- `buildVillager(kind,seed,job,force)`: `kind` is `male`, `female` or `child`; `job` is an `OCC` key; `force.girl` is a boolean. Accessories are listed in `T.acc` and built near the end of `buildVillager`.
- Clips for villagers come from `anim.js`; tool clips need `TOOLS[name].two` to match (`Tool strike` uses two hands, `Hammering` one).
- Animals: `buildQuad(species,{coat,face,leg,mane,muzzle,belly,young,antlers,…})`. Clips are sampled with `aClip(model,name,dur,loop,fn)`, where `fn(u)` returns joint angles in degrees plus `_pos` for the body.

## Scenes
`sceneTerrain(root,size,cell,heightAt,surfAt)` builds the ground. Road tiles go at y = −0.8, so their tops sit at 0, and the terrain under them is lowered to −0.85. Static content goes in one group that is then passed to `mergeStatic`. People and animals are agents updated in `root.userData.tick`. Call `compactRig(agent.m)` on every agent once the scene is built (cuts draw calls about 15×), and `sceneStats(root,{buildings,houses,trees})` so the viewer can show FPS, buildings, population, animals, wildlife and trees (optional extra keys: `production`, `military`, `farm`). `root.userData.tick(dt, camera)` receives the camera. Scenes larger than about 320 m get a shadow box that follows the orbit target, and point lights are off in Day mode.

## Tooling
`tools/dev-server.mjs` (static server, free port, live reload, background rebuild), `tools/build.mjs`, `tools/gen-catalog.mjs` (loads the library in Node with a canvas stub; also a quick check that every asset still builds), `tools/check-character.mjs` (per-clip check of a character for limb flips and twists, parts below the ground and the death pile; see CHARACTER_CREATION.md).
