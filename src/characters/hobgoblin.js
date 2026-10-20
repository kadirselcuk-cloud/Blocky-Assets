/* ======================= HOBGOBLIN: a goblin half again as big, armoured like a soldier =======================
   Built by buildGoblin (body type VB.hobgoblin, its own skins and weapons, plus the hob option: studded jerkin, iron cap,
   iron pauldron, bracers, thick belt) inside a group scaled by HB_SC. The body keeps the goblin's leg and arm lengths, so
   every goblin clip is reused unchanged in goblin metres; gait speeds are scaled with the group. */
VB.hobgoblin=Object.assign({},VB.goblin,{g:1.15,td:1.25,arm:1.3,shW:.25,hipW:.095,hand:1.25,head:1.1});
{const b=VB.hobgoblin;b.key='hobgoblin';b.hipH=b.thigh+b.shin+b.ankle+b.hipOff;b.legS=(b.thigh+b.shin)/.84;b.tS=(b.spine+b.chest)/.3;b.cS=b.neck/.22;}
const HB_SC=1.5;
const HB_SKIN={orange:['#89624b','rust orange'],brick:['#6b453b','brick red'],ochre:['#7e6345','ochre-brown'],olive:['#6a6858','olive grey'],slate:['#4a504c','slate grey']};
const HB_LEATHER=[['#4d3a2b','dark leather'],['#674e39','tan leather'],['#443930','brown leather'],['#393431','black leather'],['#54352e','red-dyed leather']];
const HB_WPN={cleaver:'heavy cleaver',axe:'bearded war axe',mace:'iron-bound mace'};

/* weapons: grip at the origin, along +y, striking edge towards +x (same frame and about the same length as gbWeapon) */
function hbWeapon(kind){const w=new THREE.Group(),ir=vm('iron'),dk=bm('#55565c','plain'),hi=bm('#9ea2a6','plain'),rust=bm('#654937','plain'),wood=bm('#5c4633','leather'),wrap=bm('#382b21','leather');
  if(kind==='cleaver'){/* falchion: straight spine on -x, the edge side widening towards the tip, a bright edge, rust patches */
    bx(w,.048,.15,.048,wrap,0,.015,0);bx(w,.06,.032,.06,dk,0,-.074,0);bx(w,.14,.036,.054,dk,0,.09,0);
    for(const[y,h,wd]of[[.19,.17,.075],[.35,.16,.09],[.49,.13,.105]])bx(w,wd,h,.024,ir,-.035+wd/2,y,0);bx(w,.075,.05,.024,ir,.002,.578,0);
    bx(w,.014,.42,.026,hi,.064,.38,0,0,0,-.04);bx(w,.03,.05,.028,rust,-.01,.27,0);bx(w,.025,.04,.028,rust,.02,.47,0);w.userData.len=.6;}
  else if(kind==='axe'){/* bearded axe: long haft, a head whose blade hooks down along the haft, a back spike, rope lashings */
    bx(w,.048,.62,.048,wood,0,.23,0);bx(w,.054,.14,.054,wrap,0,-.005,0);bx(w,.065,.13,.036,dk,.036,.45,0);bx(w,.066,.17,.026,ir,.09,.46,0);bx(w,.036,.09,.026,ir,.104,.36,0);
    bx(w,.02,.25,.028,hi,.128,.425,0);bx(w,.05,.04,.03,dk,-.045,.45,0);bx(w,.03,.025,.024,ir,-.08,.45,0);for(const y of[.37,.53])bx(w,.058,.025,.058,vm('rope'),0,y,0);
    bx(w,.025,.04,.03,rust,.09,.52,0);w.userData.len=.54;}
  else{/* mace: wooden haft with a leather grip, a square iron head with dark bands, staggered studs and a cap */
    bx(w,.05,.15,.05,wrap,0,.015,0);bx(w,.056,.03,.056,dk,0,-.074,0);bx(w,.05,.32,.05,wood,0,.25,0);bx(w,.06,.03,.06,dk,0,.39,0);
    bx(w,.11,.16,.11,ir,0,.48,0);bx(w,.12,.022,.12,dk,0,.41,0);bx(w,.12,.022,.12,dk,0,.55,0);bx(w,.07,.03,.07,dk,0,.575,0);
    for(const[x,y,z]of[[.06,.45,0],[-.06,.45,0],[0,.51,.06],[0,.51,-.06]])bx(w,Math.abs(x)?.025:.03,.03,Math.abs(z)?.025:.03,dk,x,y,z);w.userData.len=.59;}
  return w;}

function buildHobgoblin(seed,o={}){const r=mulberry32(((seed*2654435761)>>>0)^0x6b0b),pick=a=>a[Math.floor(r()*a.length)];
  const helm=o.helm&&o.helm!=='random'?o.helm:pick(['cap','cap','none']),hair=pick(['bald','crest','crest','strands']),jerkC=pick(HB_LEATHER),bracerC=pick(['#392b21','#2c2623','#433428']),top=pick(['jerkin','jerkin','shirt','none']),wpn=o.weapon||'cleaver';
  const body=buildGoblin(seed,{skin:o.skin,top:o.top,legs:o.legs,B:VB.hobgoblin,skins:HB_SKIN,weapon:wpn,wpnFn:hbWeapon,noClips:true,hob:{top,helm,hair,jerkC,bracerC,pauldron:true}});
  if(o.bare)return body;
  const root=new THREE.Group();root.userData.lights=[];body.scale.setScalar(HB_SC);root.add(body);
  root.userData.post=body.userData.post;root.userData.joints=body.userData.joints;
  if(!o.noClips)root.userData.clips=hobgoblinClips(wpn);root.userData.ground=2.4;
  const L=body.userData.look,cap=s=>s.charAt(0).toUpperCase()+s.slice(1);
  const hairT={bald:'bald',crest:'a crest of hair',strands:'straggly hair',tufts:'tufts of hair'}[L.hairS],topT={jerkin:`studded ${jerkC[1]} jerkin`,shirt:`ragged ${L.shirtC[1]} shirt`,none:'no shirt'}[L.top];
  root.userData.variantText=`${cap(L.sk[1])} skin, ${helm==='cap'?'iron cap':hairT}; ${topT}, ragged ${L.legC[1]} ${L.legs}; iron pauldron, leather bracers, thick belt; ${HB_WPN[wpn]}.`;
  return root;}

/* the goblin's clips on the hobgoblin body; deaths measured on a bare hobgoblin so the fall rests on its own meshes */
const HBCLIPS={};
function hobgoblinClips(wpn){if(HBCLIPS[wpn])return HBCLIPS[wpn];const B=VB.hobgoblin;
  const L=goblinBaseClips(B).concat(goblinDeaths(B,wpn,{M:buildHobgoblin(1,{skin:'brick',top:'jerkin',legs:'pants',helm:'cap',weapon:wpn,bare:true})}));
  for(const c of L)if(c.speed&&!c.hbScaled){c.speed*=HB_SC;c.note=c.note.replace(/([\d.]+) m\/s/,(m,v)=>(v*HB_SC).toFixed(1)+' m/s');c.hbScaled=true;}
  return HBCLIPS[wpn]=L;}

ASSETS.push({id:'hobgoblin',folder:'characters/enemies/brutes',name:'Hobgoblin',kind:'character',variants:true,defaultSeed:4,groundR:2.4,build:(s,o)=>buildHobgoblin(s,o||{}),
  opts:[{key:'skin',label:'Skin',choices:[['random','Random'],...Object.entries(HB_SKIN).map(([kk,v])=>[kk,v[1].charAt(0).toUpperCase()+v[1].slice(1)])],def:'random'},
    {key:'top',label:'Top',choices:[['random','Random'],['jerkin','Studded jerkin'],['shirt','Ragged shirt'],['none','No shirt']],def:'random'},
    {key:'legs',label:'Legs',choices:[['random','Random'],['shorts','Ragged shorts'],['pants','Ragged pants']],def:'random'},
    {key:'helm',label:'Helmet',choices:[['random','Random'],['cap','Iron cap'],['none','None']],def:'random'},
    {key:'weapon',label:'Weapon',choices:[['cleaver','Heavy cleaver'],['axe','Bearded war axe'],['mace','Iron-bound mace']],def:'cleaver'}],
  desc:'Hobgoblin, about 1.95 m: the goblin at 1.5 times the size, more muscular and less pot-bellied, with a smaller head. Skin rust orange, brick red, ochre-brown, olive grey or slate grey; studded leather jerkin, ragged shirt or bare chest; iron cap or a crest of hair; iron pauldron on the left shoulder, leather bracers, thick belt. Heavy cleaver, bearded war axe or iron-bound mace. All goblin clips: idle, walk, run, run away, war-mode idle, walk and run, two light attacks, heavy attack, jump, jump attack, two hits, two heavy hits and two deaths.'});
