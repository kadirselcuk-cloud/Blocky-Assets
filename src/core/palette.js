/* ======================= PALETTE: the one colour system for the whole library =======================
   See docs/PALETTE.md (rules) and docs/palette/palette.html (the colour sheet). Every hex in src/ belongs to one tier:
   - matter (stone, wood, soil, skin, fur, bone, metal that doesn't shine): HSB saturation <= 45%, brightness 7-85%; creatures are shaded darker
   - dye / metal (cloth, paint, roof tiles, gold, bronze): saturation <= 55%, brightness <= 85%
   - light (emissive only: flames, lava, spells, eyes, runes, rarity): 5-step ramps below, core saturation <= 75%,
     highlights tinted (never #ffffff), nothing pure black (darkest #16120e)
   Each faction has one signature light: village hearth, brute amber, undead grave-light, hell ember fire.
   Ramps run hot (tinted white) -> light -> core -> deep -> smoke. `node tools/check-palette.mjs` flags colours out of tier. */
const PAL={
  /* shared materials */
  neutral:['#15120f','#292521','#433c38','#6d6660','#9b978f','#d9d2c3'],
  wood:['#46362a','#69523e','#826548','#a0825d','#c1a67c'],
  leather:['#271f19','#392b21','#4a3a2c','#644c38','#846c50'],
  iron:['#2f2f34','#4c4e54','#70727a','#8b8e93','#b4babe'],
  blackIron:['#1b191b','#2d2a2d','#444248','#6b686e','#aba59f'],
  gold:['#6a5530','#937a4a','#c0a266','#d8bb61','#d9c790'],
  bronze:['#533829','#80593f','#aa8050','#c7a373'],
  silver:['#51535b','#7d7f87','#a9aeb4','#ced4d9'],
  bone:['#6c6455','#948b78','#b5ab92','#d3caae','#d9d1bc'],
  blood:['#241310','#43231e','#6a3430','#8d4640'],
  /* faction skins */
  goblinSkin:{olive:'#657446',moss:'#485632',sallow:'#867949',red:'#624036',grey:'#524f4c'},
  corpse:{ashen:'#7c8179',greenish:'#6f7b5f',bluish:'#6f7882',bruised:'#776973',leathery:'#7c6859',pallor:'#999ba4'},
  demonSkin:{crimson:'#7b4544',dark:'#56302f',ember:'#88614b',charcoal:'#393232',obsidian:'#292326',violet:'#4b3241',bronze:'#785c42'},
  /* lights (hot, light, core, deep, smoke) */
  hearth:['#fff0d8','#ffd08a','#ffa24a','#c8641e','#4a2a14'],
  amber:['#fff3d5','#f8d9a2','#e4ae58','#825e29','#362517'],
  fire:['#fff3d5','#f6ce78','#ed964e','#c65c3b','#6f3022'],
  hellfire:['#ffe0bf','#eea373','#dc664b','#993c32','#421914'],
  holy:['#fffbec','#fff2bf','#eed182','#ba9c52','#56462a'],
  frost:['#f3fbff','#d1eefc','#8cc3e4','#416f9e','#1a2635'],
  storm:['#f5f5ff','#d8e0ff','#9caaea','#535cb6','#1e2033'],
  arcane:['#fcf2ff','#e8bffc','#b078d8','#603992','#201529'],
  shadow:['#ede2f8','#a58dc6','#684d93','#2d1e43','#110e16'],
  necro:['#e6fbea','#b0e8c3','#66d396','#33875d','#13291c'],
  soul:['#eaf7ff','#b0dffa','#6fb3dd','#305f85','#131c26'],
  violet:['#f3e7ff','#d0b0f4','#9568c6','#492d6d','#150f1f'],
  poison:['#f8fcdc','#e2ee95','#b7ca55','#606c29','#232713'],
  fel:['#eefce3','#bded9b','#7dcb5b','#36742b','#141e0f'],
  bloodGlow:['#ffe3dc','#e49d94','#c9524d','#702328','#1e0b0d'],
  charm:['#ffe9f7','#f4b0de','#d06cb2','#702a5c','#200e1a'],
  glint:'#f6f1e6',                         /* neutral light highlight (white glows) */
  mist:{frost:'#ccdce8',holy:'#fffbea'},   /* light spell mists */
  rarity:{common:'#c7c4be',uncommon:'#72bb61',rare:'#6092d7',epic:'#a36fd2',legendary:'#e6a252'}
};
