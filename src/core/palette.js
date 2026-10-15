/* ======================= PALETTE: the one colour system for the whole library =======================
   See docs/PALETTE.md (rules) and docs/palette/palette.html (the colour sheet). Every hex in src/ belongs to one tier:
   - matter (stone, wood, soil, skin, fur, bone, metal that doesn't shine): HSB saturation <= 65%, brightness 8-92%
   - dye / metal (cloth, paint, roof tiles, gold, bronze): saturation <= 75%, brightness <= 92%
   - light (emissive only: flames, lava, spells, eyes, runes, rarity): 5-step ramps below, core saturation <= 88%,
     highlights tinted (never #ffffff), nothing pure black (darkest #16120e)
   Each faction has one signature light: village hearth, brute amber, undead grave-light, hell ember fire.
   Ramps run hot (tinted white) -> light -> core -> deep -> smoke. `node tools/check-palette.mjs` flags colours out of tier. */
const PAL={
  /* shared materials */
  neutral:['#16120e','#2a2420','#443c36','#6e665e','#9c968c','#e8dfca'],
  wood:['#4a3424','#6e5034','#8a6238','#a8804e','#c9a46c'],
  leather:['#2a1e16','#3c2a1c','#4e3826','#6a4a2e','#8a6a44'],
  iron:['#2e3034','#4a4e54','#6e737a','#8a8e94','#b4bac0'],
  blackIron:['#1a191c','#2c2a2e','#44424a','#6a6870','#a4a6ac'],
  gold:['#6e5420','#9a7838','#c8a050','#e0b840','#e8d084'],
  bronze:['#5a3420','#8a5430','#b47c3a','#d0a060'],
  silver:['#4e545c','#7a8088','#a8aeb6','#d6dce4'],
  bone:['#6e6450','#968a72','#b8ab8a','#d6caa6','#e8dec0'],
  blood:['#2a0e0c','#4e1a16','#7a2420','#a0342c'],
  /* faction skins */
  goblinSkin:{olive:'#6a8440',moss:'#46602c',sallow:'#9c8838',red:'#7a3e2e',grey:'#545652'},
  corpse:{ashen:'#8c9286',greenish:'#7e8a62',bluish:'#7a8796',bruised:'#887480',leathery:'#8a7658',pallor:'#b4b0b6'},
  demonSkin:{crimson:'#9c3e3a',dark:'#6a2a26',ember:'#aa643c',charcoal:'#3a3232',obsidian:'#2a2326',violet:'#553048',bronze:'#8e6438'},
  /* lights (hot, light, core, deep, smoke) */
  hearth:['#fff0d8','#ffd08a','#ffa24a','#c8641e','#4a2a14'],
  amber:['#fff2d0','#ffd890','#f0a838','#8a5a14','#3a2410'],
  fire:['#fff2d0','#ffcc5c','#ff8a2a','#d8481a','#7a2410'],
  hellfire:['#ffdcb8','#ff9a5a','#f0502a','#a8281a','#4a100a'],
  holy:['#fffbea','#fff0b8','#f4d06a','#c09a3a','#5a4420'],
  frost:['#f2fbff','#ccecfc','#7cc4f0','#2e6eb0','#16263a'],
  storm:['#f4f4ff','#d4dcff','#94a8ff','#4652d8','#1c1e3a'],
  arcane:['#fcf0ff','#e6b8fc','#b86af0','#6228ac','#22122e'],
  shadow:['#ece0f8','#a888d4','#6a44a8','#2e1850','#120e18'],
  necro:['#e4fbe8','#a4ecbc','#4cd88a','#1e8a54','#0e2a1a'],
  soul:['#e8f6ff','#a8dcfa','#5ab4ec','#1e5e94','#101c2a'],
  violet:['#f2e4ff','#cca8f4','#9a5ae0','#4a2280','#160c24'],
  poison:['#f8fcd8','#e0f080','#b4cc38','#5e6e18','#22280e'],
  fel:['#ecfce0','#b4f088','#6cd040','#28761a','#121e0c'],
  bloodGlow:['#ffe0d8','#f49488','#dc3a32','#7a1218','#22080a'],
  charm:['#ffe6f6','#f4a8dc','#e05ab8','#7a1a5e','#240a1c'],
  glint:'#f6f0e4',                         /* neutral light highlight (white glows) */
  mist:{frost:'#c8dcec',holy:'#fffae8'},   /* light spell mists */
  rarity:{common:'#c8c4bc',uncommon:'#62c04c',rare:'#4a90f0',epic:'#aa60ec',legendary:'#f49a30'}
};
