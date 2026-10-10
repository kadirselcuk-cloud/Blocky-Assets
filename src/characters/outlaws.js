/* ======================= OUTLAWS: bandits, archers, marauders, poachers; bandit camp ======================= */
VXD.canvas=(P,r)=>{const m=mulberry32(21);for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,(x%8===0||y%8===0)?'#a89878':'#c8b894',nz(r,.9,1.05));for(let i=0;i<2;i++){const x0=Math.floor(m()*10),y0=Math.floor(m()*10);for(let y=y0;y<y0+5;y++)for(let x=x0;x<x0+5;x++)P(x,y,i?'#8a7a5a':'#a07858',nz(r,.9,1.05));}};
VXD.rug=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++){const b=x<2||x>13||y<2||y>13,d=(Math.abs(x-7.5)+Math.abs(y-7.5))%5<1.5;P(x,y,b?'#c8a040':d?'#2a3a6a':'#7a2a22',nz(r,.9,1.05));}};
VXD.bedroll=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,y%4===0?'#4a3a2a':'#6a5a3e',nz(r,.9,1.06));};
Object.assign(OCC,{
  bandit:{name:'Bandit',outfit:'jerkin',fOutfit:'jerkin',main:['#4a4038','soot-brown'],second:['#3e342a','dark leather'],legs:['#2e2a26','black'],legwear:'tallBoots',head:'hoodUp',acc:['mask','knife','bigPouch'],tool:'Short sword'},
  banditArcher:{name:'Bandit archer',outfit:'shortTunic',fOutfit:'shortTunic',main:['#5a5a3a','olive'],second:['#3e3e2a','dark green'],legs:['#3a3428','dark brown'],legwear:'wraps',head:'hoodUp',acc:['mask','quiver','bracer'],tool:'Bow'},
  marauder:{name:'Marauder',outfit:'shortTunic',fOutfit:'shortTunic',main:['#5a2a22','blood-red'],second:['#3e2a1e','brown'],legs:['#2e2a26','black'],legwear:'tallBoots',head:'spikedHelm',acc:['mail','pauldrons','furCloak','shieldBack','scabbard'],tool:'Battle axe'},
  poacher:{name:'Poacher',outfit:'tunic',fOutfit:'tunic',main:['#5a5440','drab green'],second:['#4a3e2e','brown'],legs:['#4a4034','brown'],legwear:'wraps',head:'slouchHat',acc:['sackBack','knife','cloak'],tool:'Hare brace'}});
Object.assign(TOOLS,{
  'Short sword':{two:false,build(){const g=wSword(.55,.065,.15);g.userData.tip=new THREE.Vector3(0,.7,0);return g;}},
  'Battle axe':{two:false,build(){const g=wBattleAxe();g.position.y=-.3;const w=new THREE.Group();w.add(g);w.userData.tip=new THREE.Vector3(.2,.5,0);return w;}},
  Club:{two:false,build(){const g=new THREE.Group();bx(g,.06,.5,.06,vm('planks'),0,.15,0);bx(g,.12,.3,.12,vm('barkH'),0,.5,0);bx(g,.04,.04,.04,vm('iron'),.07,.55,0);g.userData.tip=new THREE.Vector3(0,.6,0);return g;}},
  'Hare brace':{two:false,build(){const g=new THREE.Group();bx(g,.02,.2,.02,vm('rope'),0,-.08,0);for(const s of[-1,1]){const h=new THREE.Group();put(g,h,s*.06,-.2,0,0,0,s*.15);bx(h,.08,.24,.1,cm('hair','#8a6a4a'),0,-.12,0);bx(h,.07,.08,.08,cm('hair','#8a6a4a'),0,-.27,.02);for(const e of[-1,1])bx(h,.02,.1,.03,cm('hair','#8a6a4a'),e*.02,-.36,.02);}g.userData.tip=new THREE.Vector3(0,-.3,0);return g;}}});
function outlaw(job,scale=1){return(s,o)=>{const m=buildVillager(o.sex==='female'?'female':'male',s,job);if(scale!==1)m.scale.setScalar(scale);return m;};}
FOLDERS['characters'].children.push('characters/outlaws');FOLDERS['characters/outlaws']={name:'Outlaws',blurb:'Bandits, archers, marauders and poachers',children:[]};
const SEX=[{key:'sex',label:'Body',choices:[['male','Male'],['female','Female']],def:'male'}];
[['bandit','Bandit','bandit',1,'Hooded bandit with a cloth mask, dark leather vest, knife and a short sword.'],['bandit-archer','Bandit archer','banditArcher',1,'Hooded archer with a mask, quiver, leather bracer and a bow.'],
 ['marauder','Marauder','marauder',1.08,'Bigger, tougher raider: spiked helm, mail over a blood-red tunic, leather-and-iron pauldrons, fur cloak, shield on the back, sword at the hip and a battle axe.'],
 ['poacher','Poacher','poacher',1,'Poacher in a slouch hat and drab cloak, a sack on his back and a brace of hares in hand.']]
 .forEach(([id,name,job,sc,desc],i)=>ASSETS.push({id:'ol-'+id,folder:'characters/outlaws',name,kind:'character',variants:true,defaultSeed:[3,6,2,9][i],groundR:2.6,build:outlaw(job,sc),desc:desc+' New look rolls face, hair and build; all 13 villager animations apply.',opts:SEX}));

/* ---------- camp pieces ---------- */
function cRoot(g){const r=new THREE.Group();r.userData.lights=[];r.userData.ground=g;return r;}
function vTentA(par,x,z,ry,L=2.6,W=2,H=1.7,mat='canvas'){const g=new THREE.Group();put(par,g,x,0,z,0,ry,0);const cv=vm(mat),a=Math.atan2(H,W/2),sl=Math.hypot(H,W/2);
  for(const zz of[-L/2,L/2]){vlog(g,.08,H+.1,.08,'y',0,(H+.1)/2,zz);for(const s of[-1,1])bx(g,.05,.22,.05,vm('planksDark'),s*.06,H+.08,zz,0,0,s*.5);}vlog(g,.07,.07,L+.3,'z',0,H,0);
  for(const s of[-1,1]){const p=new THREE.Group();put(g,p,s*W/4,H/2,0,0,0,s*(Math.PI/2-a));bx(p,.04,sl,L,cv,0,0,0);}
  const n=6;for(let i=0;i<n;i++){const t=(i+.5)/n,w=W*(1-t);bx(g,w,H/n,.04,cv,0,t*H-H/n/2+.0,-L/2);}
  for(const s of[-1,1]){const fl=new THREE.Group();put(g,fl,s*W/4,H/2,L/2,0,0,s*(Math.PI/2-a));const f2=new THREE.Group();fl.add(f2);f2.rotation.y=s*.9;bx(f2,.035,sl,.6,cv,0,0,.3);}
  for(const s of[-1,1])for(const zz of[-L/2+.2,L/2-.2]){bx(g,.04,.2,.04,vm('planks'),s*(W/2+.4),.1,zz);bx(g,.01,.01,Math.hypot(.4,H)*.98,vm('rope'),s*(W/2+.2),H/2-.08,zz,0,0,0).rotation.set(0,0,s*Math.atan2(.4,H)*-1);}
  return g;}
function vBedroll(par,x,z,ry,rolled){const g=new THREE.Group();put(par,g,x,0,z,0,ry,0);if(rolled){vlog(g,.7,.2,.2,'x',0,.1,0);g.children[g.children.length-1].material=vm('bedroll');for(const s of[-1,1])bx(g,.03,.22,.22,vm('rope'),s*.22,.1,0);}
  else{bx(g,.7,.06,1.8,vm('bedroll'),0,.03,0);bx(g,.72,.07,.9,vm('woolRed'),0,.05,.3);bx(g,.5,.12,.25,vm('burlap'),0,.08,-.72);}return g;}
function vSpit(par,x,z,L){const g=new THREE.Group();put(par,g,x,0,z);vFirePit(g,0,0,L);for(const s of[-1,1]){bx(g,.07,1,.07,vm('planksDark'),s*.75,.5,0);for(const t of[-1,1])bx(g,.05,.25,.05,vm('planksDark'),s*.75+t*.05,1.05,0,0,0,t*.45);}
  bx(g,1.7,.04,.04,vm('iron'),0,1,0);const mt=new THREE.Group();put(g,mt,0,1,0);bx(mt,.6,.3,.3,vm('liqRed'),0,0,0);bx(mt,.4,.22,.22,vm('leather'),.32,.02,0);for(const s of[-1,1])bx(mt,.08,.2,.08,vm('leather'),-.2,-.2,s*.1);
  const pot=new THREE.Group();put(g,pot,.9,0,.6);bx(pot,.36,.3,.36,vm('iron'),0,.2,0);bx(pot,.3,.02,.3,vm('stew'),0,.35,0);return g;}
function vStakes(par,x,z,ry,len=6){const g=new THREE.Group();put(par,g,x,0,z,0,ry,0);vlog(g,len,.3,.3,'x',0,.15,0);for(let i=0;i<Math.round(len/.45);i++){const sx=-len/2+.25+i*.45,s=new THREE.Group();put(g,s,sx,.15,0,.7,0,0);bx(s,.1,1.3,.1,vm('barkH'),0,.65,0);bx(s,.06,.18,.06,vm('planks'),0,1.38,0);}return g;}
function vLookout(par,x,z,ry){const g=new THREE.Group();put(par,g,x,0,z,0,ry,0);const H=3.4;for(const[a,b]of[[1,1],[1,-1],[-1,1],[-1,-1]])vlog(g,.2,H+1,.2,'y',a*.9,(H+1)/2,b*.9);for(const s of[-1,1])bx(g,.08,.08,2.6,vm('planksDark'),s*.9,1.5,0,.55,0,0);
  bx(g,2.2,.12,2.2,vm('planks'),0,H,0);for(const[a,b]of[[1,0],[-1,0],[0,1],[0,-1]])bx(g,a?.06:2.1,.06,a?2.1:.06,vm('planksDark'),a*1,H+.8,b*1);for(let i=0;i<8;i++){const t=-.9+i*.26;bx(g,.04,.8,.04,vm('barkH'),t,H+.4,1);bx(g,.04,.8,.04,vm('barkH'),1,H+.4,t);}
  const ld=new THREE.Group();put(g,ld,.3,0,1.9,-.22,0,0);for(const s of[-1,1])bx(ld,.06,3.6,.06,vm('planksDark'),s*.22,1.8,0);for(let i=0;i<10;i++)bx(ld,.48,.05,.05,vm('planks'),0,.3+i*.34,0);
  vlog(g,.06,1.6,.06,'y',-.9,H+1.8,-.9);bx(g,.6,.4,.03,vm('woolRed'),-.6,H+2.3,-.9);bx(g,.2,.15,.03,vm('woolRed'),-.25,H+2.1,-.9,0,0,.4);return g;}
function vLoot(par,x,z){const g=new THREE.Group();put(par,g,x,0,z);vChest(g,0,0,.2,true);vChest(g,1,-.3,-.4,false);for(let i=0;i<20;i++){const r=mulberry32(i*5);bx(g,.1,.05,.1,vm('gold'),-.6+r()*1.8,.03+r()*.08,.5+r()*.5,0,r()*3,0);}
  for(let i=0;i<3;i++)vSack(g,-.9+i*.45,-.6);vBarrel(g,1.7,.4);vCrate(g,.6,-1.5,0,.3,.4);bx(g,.06,.4,.06,vm('iron'),.6,.2,.8);bx(g,.16,.04,.16,vm('iron'),.6,.02,.8);bx(g,.05,.12,.05,vm('woolWhite'),.6,.46,.8);
  vlog(g,1.4,.22,.22,'x',.4,.11,-1.2);g.children[g.children.length-1].material=vm('rug');put(g,wSword(),-1.2,.05,.9,Math.PI/2,0,.4);return g;}
function vCage(par,x,z,ry){const g=new THREE.Group();put(par,g,x,0,z,0,ry,0);const W=2,H=2;bx(g,W+.2,.12,W+.2,vm('planksDark'),0,.06,0);bx(g,W+.2,.12,W+.2,vm('planksDark'),0,H,0);
  for(let i=0;i<=8;i++){const t=-W/2+i*W/8;for(const s of[-1,1]){bx(g,.07,H,.07,vm('barkH'),t,H/2,s*W/2);if(i>0&&i<8)bx(g,.07,H,.07,vm('barkH'),s*W/2,H/2,t);}}
  bx(g,.16,.2,.08,vm('iron'),.3,1,W/2+.06);bx(g,1.6,.06,1.6,vm('hay'),0,.15,0);bx(g,.3,.2,.3,vm('barrel'),-.6,.22,-.6);return g;}
function vWRack(par,x,z,ry){const g=new THREE.Group();put(par,g,x,0,z,0,ry,0);for(const s of[-1,1])vlog(g,.14,1.6,.14,'y',s*1,.8,0);vlog(g,2.2,.12,.12,'x',0,1.5,0);vlog(g,2.2,.12,.12,'x',0,.4,.15);
  const items=[TOOLS.Spear.build(),wSword(),TOOLS['Battle axe'].build(),TOOLS.Club.build(),wSword(.34,.05,.12)];items.forEach((it,i)=>{put(g,it,-.8+i*.4,.42,.12,-.08,0,0);});return g;}
function vLeanToCamp(par,x,z,ry){const g=new THREE.Group();put(par,g,x,0,z,0,ry,0);for(const s of[-1,1])vlog(g,.14,1.8,.14,'y',s*1.1,.9,.6);vlog(g,2.6,.12,.12,'x',0,1.8,.6);
  for(let i=0;i<9;i++)vlog(g,.1,.1,2,'z',-1.2+i*.3,1.05,-.2).rotation.x=-.85;bx(g,2.6,.06,1.6,vm('leaves'),0,1.12,-.2,.85,0,0);bx(g,1.2,1,.04,vm('fur'),.4,.9,.62);vBedroll(g,-.2,-.1,Math.PI/2,false);return g;}

/* ---------- camp assets ---------- */
const CAMP=(id,name,build,desc,g)=>ASSETS.push({id:'cp-'+id,folder:'buildings/medieval/outlaw',name,build,desc,groundR:g});
CAMP('tent','Bandit tent',()=>{const r=cRoot(3);vTentA(r,0,0,0);vBedroll(r,0,-.2,0,false);return r;},'Patched canvas A-frame tent on forked poles with guy ropes, open front flaps and a bedroll inside.',3);
CAMP('bigtent','Leader\'s tent',()=>{const r=cRoot(4.4);vTentA(r,0,0,0,4,3.2,2.4);bx(r,2.2,.02,3,vm('rug'),0,.01,0);vChest(r,.6,-1.2,0,true);vBedroll(r,-.7,-.4,0,false);vLantern(r,r.userData.lights,0,2.1,1.7);
  vlog(r,.08,3.4,.08,'y',1.9,1.7,1.8);bx(r,.8,.6,.03,vm('woolRed'),2.32,3.1,1.8);bx(r,.3,.2,.03,vm('woolRed'),2.85,2.9,1.8,0,0,.5);return r;},'Large patched tent with a rug, an open chest of loot, a bedroll, a lantern and a ragged red banner.',4.4);
CAMP('leanto','Bandit lean-to',()=>{const r=cRoot(2.6);vLeanToCamp(r,0,0,0);return r;},'Pole lean-to roofed with branches and leaves, a pelt hung across one side and a bedroll beneath.',2.6);
CAMP('spit','Camp fire with spit',()=>{const r=cRoot(2.4);vSpit(r,0,0,r.userData.lights);for(const[x,z,a]of[[0,1.4,0],[-1.4,0,Math.PI/2],[1.4,-.2,Math.PI/2]])vlog(r,1.2,.32,.32,'x',x,.16,z).rotation.y=a;return r;},'Stone-ringed fire roasting a joint on an iron spit between forked posts, a stew pot and log seats.',2.4);
CAMP('stakes','Stake barricade',()=>{const r=cRoot(4);vStakes(r,0,0,0);return r;},'6 m barricade of sharpened stakes angled outward from a log base; modular.',4);
CAMP('lookout','Lookout platform',()=>{const r=cRoot(3);vLookout(r,0,0,0);return r;},'Crude log lookout platform with a stick parapet, a ladder and a ragged red flag.',3);
CAMP('loot','Loot pile',()=>{const r=cRoot(2.6);vLoot(r,0,0);return r;},'Stolen goods: an open chest of gold with coins spilled around, a locked chest, sacks, a barrel, a crate, a candlestick, a rolled rug and a sword.',2.6);
CAMP('cage','Prisoner cage',()=>{const r=cRoot(2.4);vCage(r,0,0,0);return r;},'Cage of lashed log bars with a padlocked door, straw and a water barrel.',2.4);
CAMP('bedrolls','Bedrolls',()=>{const r=cRoot(2.4);vBedroll(r,-.9,0,0,false);vBedroll(r,0,.2,.2,false);vBedroll(r,1,0,0,true);vBedroll(r,1,.5,.3,true);return r;},'Two laid-out bedrolls with blankets and pillows, and two rolled and tied.',2.4);
CAMP('rack','Bandit weapon rack',()=>{const r=cRoot(2.2);vWRack(r,0,0,0);return r;},'Log rack holding a spear, a sword, a battle axe, a club and a dagger.',2.2);
CAMP('camp','Bandit camp',()=>{const r=cRoot(13);const L=r.userData.lights;vYard(r,20,18,0,0);
  vTentA(r,0,-5,0,4,3.2,2.4);bx(r,2.2,.02,3,vm('rug'),0,.01,-5);vTentA(r,-5.4,-2.4,.7);vTentA(r,5.2,-2.6,-.6);vLeanToCamp(r,-5.8,2.8,1.9);
  vSpit(r,0,0,L);for(const[x,z,a]of[[0,1.5,0],[-1.5,0,Math.PI/2],[1.5,-.2,Math.PI/2]])vlog(r,1.2,.32,.32,'x',x,.16,z).rotation.y=a;
  vLoot(r,3.4,-5.2);vCage(r,6,2.6,-.4);vLookout(r,-7,-6.6,.5);vWRack(r,3,1.8,-.5);vBedroll(r,-2.6,-2.4,.4,false);vBedroll(r,2.6,-3.6,-.3,false);
  for(const[x,z,a]of[[-8,4,1.2],[-4.4,7,.3],[1.6,8,-.1],[7,6.8,-.6],[9,.8,-1.4],[8.4,-5,-2.1]])vStakes(r,x,z,a,4);
  const crew=[['bandit',3,'Talk',1,-1.2,1.6,2.6],['banditArcher',6,'Look around',2,-7,-6.6,.5],['marauder',2,'Idle',.5,1.8,1.2,-2.4],['bandit',8,'Idle',1.5,4.8,3.6,-2.4]];
  for(const[job,sd,cl,t,x,z,ry]of crew){const m=buildVillager('male',sd,job);if(job==='marauder')m.scale.setScalar(1.08);posedAnimal(m,cl,t);const sk=m.getObjectByName('socket_R');if(sk&&m.userData.occTool&&TOOLS[m.userData.occTool])sk.add(TOOLS[m.userData.occTool].build());put(r,m,x,job==='banditArcher'?3.46:0,z,0,ry,0);}
  for(let i=0;i<4;i++)vBarrel(r,-1+i*.65,-7.2);vCrate(r,.6,1.8,0,-7.3,.2);vTree(r,-9,-1,3.2,1);vTree(r,9.4,-7.4,3.6,1);vTree(r,-2,9.4,3,.9);return r;},'Complete hideout: a leader\'s tent, two tents and a lean-to around a roasting fire, a loot pile, a prisoner cage, a lookout with an archer, a weapon rack, bedrolls and stake barricades, with a crew of bandits and a marauder.',13);
FOLDERS['buildings/medieval'].children.push('buildings/medieval/outlaw');FOLDERS['buildings/medieval/outlaw']={name:'Outlaw camp',blurb:'Tents, barricades, loot and a full bandit hideout',children:[]};
