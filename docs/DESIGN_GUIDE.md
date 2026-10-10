# Design guide

How assets in this library should look and behave. Most rules here come straight from the owner's feedback.

## Process
- **Ask before being creative.** If a request is ambiguous, or would change materials, roof shapes or style, ask or propose; don't just do it. You may suggest extras at the end of a reply.
- Keep each reply to what changed, grouped by asset. No long explanations.
- Work in phases when a request is large, and say what comes next ("type continue").
- Always look at the result: check the viewer in Day, Dusk and Night, the option combinations, and the animations. Scenes need several camera angles.

## Style
- **Blocky voxel look.** Every surface is a box (`bx` or `box`) with a 16×16 pixel texture made by `VXD` in `vxTex(kind)`, using nearest filtering. The world grid is 0.4 m (one "block"); building plinths, yards and terrain tiles use 0.8 m.
- Use the existing materials (`vm('<kind>')`): planks, planksDark, planksV, logH, bark, cobble, stoneBrick, plaster, plasterOchre, timber, thatch, tiles, slate, shingle, brick, iron, gold, glass, hay, dirt, wool colours, and so on. Add a new `VXD` kind only when nothing fits.
- **Same type, same look.** Numbered variants share walls, roof material, chimney style and plinth with variant 1. Only openings, chimney side, porch and props differ.
- Real-world scale: a door is about 2 m, a storey 2.4–3 m, an adult villager about 1.8 m, a child about 1.3 m.
- Fronts face **+z**, the default camera side. Doors face the road in scenes, so rotate the asset rather than rebuilding it.

## Forbidden and required
- **No crosses**: not on banners, slits, emblems, icons, clock hands, finials or patterns. Use a diamond or blank placeholder on banners, plain vertical slits, and a gold ball on spires.
- **Nothing floating, nothing intersecting.** Check props, tools, signs, berries, fruit, leaves, scaffold rails, wheel axles (they need posts and bearings), ladders, lids and handles.
- Ladders lean *into* what they climb. An open crate lid leans against the crate. Tools lean against walls or lie flat.
- Containers that show contents are **hollow** (`hollow()` in items.js), and the contents sit below the rim.
- Animal ears, horns and antlers tilt **outward** (rest rotation z = `-side * angle`).
- Gaits must read as moving forward: the knee bends while the foot swings forward.
- `root.userData.ground` (the grass base radius) must cover the whole asset, paddocks and fences included.
- Don't put static animals inside buildings or pens. Animals are live agents placed by scenes.
- Lights: `vLantern` and flames register PointLights in `root.userData.lights`. Use `userData.min` for always-on glows such as forges and torches. Keep scenes to 12 point lights or fewer.

## Organisation
- Every asset belongs to a category folder: Buildings → Medieval → Housing, Resource collection, Production, Farming, Civil, Military, Management, Outlaw camp or Fences. Other top-level folders are Characters (Villagers, Farm animals, Wildlife, Young animals, Outlaws), Items (8 sub-folders), Terrain, Environment (Trees, Rocks, Plants) and Scenes.
- Ids are stable and prefixed: `vx-` buildings, `fn-` fences, `cp-` camp, `an-` animals, `ol-` outlaws, `it-` items, `env-` environment, `tr-` terrain, `sc-` scenes. Villagers have plain ids.
- Use **options** (`opts`) instead of near-duplicate assets for colours, contents, sizes and states. Use `live:true` for options that animate in place (gates).

## Scenes
- Plan the layout first (regions, roads, then the buildings that belong together), and pack the buildings the way a medieval settlement would be.
- Build roads from the road tile assets on a 4 m grid, with junction tiles where branches meet.
- Use the owner's assets as much as possible.
- People: show a mix of working (tool clips with workpieces), talking, walking on roads and children playing. Animals go in their pens.
- Performance: merge static meshes (`mergeStatic`), cap the lights, and keep triangle count in mind (the farm scene is about 260k).
