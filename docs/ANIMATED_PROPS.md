# Animated props

Objects that open, break, swing, bubble or burn carry baked AnimationClips in `root.userData.clips`, like the characters. The viewer lists them in the Animations page, and **Export GLB** writes them into the file. Code: `src/items/props_anim.js`.

## How it works
`propAnim(root, parts, defs)` samples each clip at 30 fps from a function and turns it into position, quaternion and scale tracks.
- `parts`: the Object3Ds that move. Each gets a unique name (tracks bind by name) and goes into `userData.joints` (the viewer's rig dots).
- `defs`: `[{name, dur, loop, hold, next, fn(t, S)}]`. `fn` writes `S[part.name] = {p:[x,y,z], r:[x,y,z,order], q:Quaternion, s:number|[x,y,z]}` as absolute local values. A part a clip never writes gets no track.
- If no def is called `Idle`, an empty `Idle` clip is added first. The viewer poses every asset on `Idle`, and fading to it returns the parts to the pose they were built in (the mixer blends towards the original state). Props that should always move (cauldron, gibbet, banners, fire) define `Idle` as a loop instead.
- One-shot clips use `hold: true` so they stay at the end pose (an open door stays open); `next` chains to another clip (Hit → Idle).
- Hidden pieces (debris, the catapult rock before reloading) are scaled to 1e-4 and scaled up when they appear.
- Helpers: `paFly` (thrown debris: velocity, gravity, landing height, turning to a resting rotation), `paQ`, `paEase`, `paHide`.

**Gates are detected automatically:** every asset that uses `vGateAnim` (wooden and stone gates, fence gates, the goblin gate, the iron graveyard gate, the castle and crypt portcullises, the catacomb grille) gets `Open` and `Close` clips. The wrapper tries the gate shut and open, keeps the objects that moved, and bakes the motion. The live Gate option still works when no clip is holding.

## Animated assets
| Asset | Clips |
|---|---|
| Barrel `it-c-barrel` | Hit (wobble), Break (the barrel bursts: eight staves and two hoops fly out and land flat, liquids spill in a puddle) |
| Crate `it-c-crate` | Hit, Break (the lid flies up, the four sides fall outwards, the contents go) |
| Chest `it-c-chest` | Open, Close (hinged lid, gold inside) |
| Gates: `vx-woodgate`, `vx-stonegate`, `fn-wood-g`, `fn-stone-g`, `wl-gob-gate`, `ud-fence-gate`, `ud-castle-gate`, `ud-crypt-door` (with portcullis), `ud-cata-gate` | Open, Close |
| Coffin `ud-coffin` | Open, Close, Burst open (the lid is flung off spinning and lands beside it), Rattle; standing: the lid swings on its long edge |
| Sarcophagus `ud-sarcophagus` | Slide aside, Push off (slides, tips over the edge and leans against the side), Close, Rattle |
| Mausoleum, grand mausoleum | Open, Close (both door leaves) |
| Gibbet `ud-gibbet` | Idle (the cage sways on its chain), Struck |
| Crypt vault with bone chandelier | Idle (slow sway) |
| Well of souls, phylactery shrine | Idle (wisps rise; the gem floats and turns), Shatter (phylactery) |
| Necromancer's banner, goblin banner | Idle (the cloth waves, the tattered tail lags behind) |
| Goblin cauldron | Idle (bubbles rise and pop, the stirring stick turns, the bone bobs) |
| Bone cage | Close, Open, Rattle |
| Burnt cottage (smouldering), burning cottage | Idle (flames flicker, smoke rises and spreads) |
| Goblin catapult | Fire (the arm whips up against the stop beam and throws the rock), Reload (winched down step by step, a new rock in the bucket) |
| Battering ram | Swing (loop), Strike |

## Checks
A Node test builds every non-character asset with every option combination, plays each clip to the end and fails if any track cannot find its target, if `Idle` is missing or if there are no joints: 77 animated builds, no problems. Barrel Break, catapult Fire, coffin Burst open and sarcophagus Push off were also checked frame by frame in the viewer.
