# Blocky Assets

Procedural blocky medieval assets for three.js (r128), with a library viewer, scenes and GLB export.

## Quick start

1. Install **Node.js 18+**.
2. Run `npm start` in this folder (Windows: double-click `start.bat`).
3. The browser opens at the first free port from `http://localhost:5173`. Edit anything in `src/` and the page reloads.

## What's inside

```
index.html            viewer page (loads scripts listed in src/manifest.json)
src/                  all asset code (classic scripts sharing one global scope)
  manifest.json       load order: the single source of truth
  core/               texture and geometry helpers, villager animation sampler
  characters/         villagers, occupations, animals, outlaws
  buildings/          every building, fence and camp asset
  terrain/            4 × 4 m terrain tiles, roads, water
  environment/        trees, rocks, plants
  items/              tools, weapons, armour, potions, containers, furniture, lighting
  scenes/             scene system and example scenes
  export/             AssetForge API and GLB export
  app/                library UI and viewer
vendor/               three.js r128 and GLTFExporter (no npm install needed)
tools/                dev-server.mjs, build.mjs, gen-catalog.mjs
docs/                 HISTORY, DESIGN_GUIDE, ARCHITECTURE, ASSET_CATALOG, EXPORT
dist/                 build output (single-file viewer, library, catalog.json)
```

AI assistants should start with `CLAUDE.md`.

## Export

Use the **Export GLB** button in any asset's viewer, or `AssetForge.exportGLB(id, {seed, options})` from code. See `docs/EXPORT.md`.
