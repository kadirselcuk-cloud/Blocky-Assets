# Blocky Assets: start here

Blocky (voxel-style) medieval 3D asset library for **three.js r128**, built procedurally in code. Around 300 assets: buildings, villagers with jobs, outlaws, animals, items, terrain tiles, environment and complete scenes. Every asset can be exported as **GLB**.

Read this file first in every session, then open only the doc you need:

| Need | Read |
|---|---|
| What has been built and why, the owner's feedback over time | `docs/HISTORY.md` |
| Rules for designing or changing assets (style, mistakes to avoid) | `docs/DESIGN_GUIDE.md` |
| How the code is organised, helper functions, how to add an asset | `docs/ARCHITECTURE.md` |
| Every asset id, folder, options (generated) | `docs/ASSET_CATALOG.md` |
| Using assets in another project (GLB, JS API, catalog.json) | `docs/EXPORT.md` |
| The warrior: body, equipment, all clips and how they are built | `docs/WARRIOR.md` |
| The goblin enemy: body, clothes, weapons, clips | `docs/GOBLIN.md` |
| The goblin shaman: body, accessories, staffs, clips | `docs/GOBLIN_SHAMAN.md` |
| The hobgoblin: body, armour, weapons, clips | `docs/HOBGOBLIN.md` |
| The warg: body, looks, clips | `docs/WARG.md` |
| The ogre: body, weapons, clips | `docs/OGRE.md` |
| The troll: body, looks, clips (fall unconscious and rise) | `docs/TROLL.md` |
| The skeleton (undead): bones, armour, weapons, the bone-pile death and rise | `docs/SKELETON.md` |
| The skeleton archer: bow, string and arrow posing, shooting and reload clips | `docs/SKELETON_ARCHER.md` |
| The skeletal warrior: heavy-boned 2.2 m skeleton, two-handed sword, clips | `docs/SKELETON_WARRIOR.md` |
| The ghoul (undead): one arm torn off, limping, body pieces fall apart in Death and rise | `docs/GHOUL.md` |

## Run it

```
npm start            (or start.bat on Windows, ./start.sh elsewhere)
```

- Serves the project on the **first free port from 5173**.
- The browser reloads on every save, and `dist/` plus the catalog are rebuilt in the background.
- No `npm install` is needed: three.js r128 and GLTFExporter are in `vendor/`. Node 18+ only.
- The port in use is written to `.devserver.json`.
- Open one asset directly: `http://localhost:<port>/#/a/<asset-id>` (for example `#/a/vx-barn`, `#/a/sc-farm`).

Other commands: `npm run build` (writes `dist/asset-forge.html` and `dist/asset-forge-lib.js`) and `npm run catalog` (writes `docs/ASSET_CATALOG.md` and `dist/catalog.json`).

## Golden rules (the owner's standing requests)

1. **Don't get creative without asking.** Keep the established style. Variants of a type (Cottage 1–5, Brick house 1–5…) share the same walls, roofs and materials; only the layout changes. Propose extras; don't add them silently.
2. **No crosses anywhere.** That covers banners, arrow slits, emblems, icons and decorations. Use plain slits, diamonds and blank placeholder banners. Window frames are tolerated so far.
3. **Nothing floats and nothing intersects.** Every prop touches the ground or its support. Ladders lean *towards* what they climb. Lids lean against their box. Contents sit below rims, inside hollow containers.
4. **Check orientation.** Ears, horns and antlers point outward. Walk and run cycles must read as moving forward. Lower legs fold the natural way.
5. **The ground must fit the asset.** `root.userData.ground` must cover every part, fences and paddocks included.
6. **Name numbered variants `Name 1…5`.** Put assets in the right category folder.
7. After a change, **look at it**: the viewer (day, dusk and night) and, for scenes, several camera angles. Report what changed concisely.
8. Reply in the language the owner writes in, and keep replies concise.

## Workflow for a change

1. Find the asset id in `docs/ASSET_CATALOG.md`, then its builder (`grep -rn "'<id>'" src`).
2. Edit the builder in `src/…` and save. The browser reloads by itself.
3. New asset: write a builder, `ASSETS.push({...})` in the matching file (see `docs/ARCHITECTURE.md`), and add a new file to `src/manifest.json`.
4. Check day, dusk and night, the options, and the animations. Then update `docs/HISTORY.md` with one line per change.
