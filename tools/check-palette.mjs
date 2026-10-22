#!/usr/bin/env node
/* Checks hex colours against the palette tiers in src/core/palette.js (see docs/PALETTE.md).
   node tools/check-palette.mjs            -> summary per faction file (brutes, undead, hell, effects, items)
   node tools/check-palette.mjs -v         -> also lists every colour out of tier, with its line
   node tools/check-palette.mjs src/x.js   -> only these files
   A colour counts as a light when its line or call reads as emissive (glow, emissive, PointLight, eye/fire/gem tables...).
   Lights must sit on a palette ramp; everything else must stay within matter/dye limits. Emissive-map black and white
   (#000000 / 0xffffff next to an emissiveMap) are allowed. Exit code 1 when something is out of tier. */
import fs from 'fs';
const read=f=>fs.readFileSync(f,'utf8');
const PAL=new Function(read('src/core/palette.js')+';return PAL;')();
const VERB=process.argv.includes('-v');
let files=process.argv.slice(2).filter(a=>!a.startsWith('-'));
if(!files.length){const m=JSON.parse(read('src/manifest.json')).library;
  files=m.filter(f=>/(imp|fiend|oni|devil_lord|demon_prince|efreet|succubus|cerberus|hellhound|hell_mound|skeleton|ghoul|lich|wight|revenant|vampire|necromancer|goblin|ogre|troll|warg|hell|undead|wasteland|cave|crypt|catacombs|necro_castle|ruins|raid|spells|loot|items|mercenary|gear|consumables)/.test(f));}
const rgb=h=>[0,2,4].map(i=>parseInt(h.slice(i,i+2),16));
const sv=h=>{const c=rgb(h),mx=Math.max(...c),mn=Math.min(...c);return[mx?(mx-mn)/mx:0,mx/255];};
const INPAL=new Set();(function w(o){for(const v of Object.values(o))typeof v==='string'?INPAL.add(v.slice(1)):w(v);})(PAL);
const GLOW=/(Glow\(|glow\w*\s*[=:(]|emissive|Basic|PointLight|light\w*\s*[=:(]|flame\w*\s*[=:(]|fire\w*\s*[=:(]|_EYES|_GLOW|_FIRE|LT_RAR|LT_ENCH|spM\()/i;
let bad=0;
for(const f of files){const lines=read(f).split('\n');let n=0,out=[];
  lines.forEach((L,i)=>{for(const m of L.matchAll(/(?:0x|#)([0-9a-fA-F]{6})\b/g)){const h=m[1].toLowerCase();n++;
    if(INPAL.has(h))continue;
    if((h==='000000'||h==='ffffff')&&/emissiveMap|hCrustE|hlFlagDraw|glow\)P|lerp|'soft',\.01/.test(L+lines[i-1]))continue;
    const[s,b]=sv(h),pre=L.slice(Math.max(0,m.index-48),m.index);const light=GLOW.test(pre);
    const why=h==='000000'||h==='ffffff'?'pure black/white':light?(s>.8?'light too saturated':null):(s>.55+.02?'too saturated':b<.07?'too dark':b>.87?'too bright':null);
    if(why)out.push(`${f}:${i+1}  #${h}  ${why}`);}});
  bad+=out.length;console.log(`${out.length?'✗':'✓'} ${f}  ${n} colours${out.length?', '+out.length+' out of tier':''}`);if(VERB)out.forEach(o=>console.log('    '+o));}
console.log(bad?`\n${bad} colours out of tier`:'\nAll colours within the palette tiers.');process.exit(bad?1:0);
