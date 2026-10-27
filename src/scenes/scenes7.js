/* ======================= Scene: haunted necropolis (sc-necropolis), 100 × 100 m =======================
   Built from the undead kit. Grid lines on 4k + 2, cell centres on multiples of 4 (so the path tiles sit on x = 0).
   North: the necromancer's castle (lines x -18…18, z -42…-18) with the keep and a ritual circle in the courtyard.
   Centre: the graveyard (lines x -26…26, z -6…26): stone wall and lychgate in the south, iron fence and gates elsewhere,
   a flagstone path from the lychgate to the castle gate with staggered branches (no crossing), mausoleums, a crypt entrance and rows of graves.
   West: a black swamp. East: an older ruined chapel (wasteland ruin pieces). */
const SC_GRAVE_SURF={ggrass:['gGrass','gSoilSide',1],gsoil:['gSoil','gSoilSide',1],grock:['wRockTop','wRock',1],gmud:['mud','gSoilSide',1]};
function vxSceneNecropolis(){const root=new THREE.Group();root.userData.lights=[];root.userData.ground=-1;const rng=mulberry32(6666),S=100,PI=Math.PI,H90=PI/2;
  const TILES=[];for(let z=-16;z<=48;z+=4)TILES.push([z===8||z===16?'t':'s',0,z,z===8?PI:0]);for(let x=-4;x>=-24;x-=4)TILES.push(['s',x,8,H90]);for(let x=4;x<=24;x+=4)TILES.push(['s',x,16,H90]);
  const underTile=(x,z)=>TILES.some(t=>Math.abs(x-t[1])<2&&Math.abs(z-t[2])<2);
  const ridge=(x,z)=>{const foot=-46+1.5*Math.sin(x*.19)+Math.cos(x*.43);if(z>foot)return 0;return Math.min(10,Math.floor((foot-z)*1.4))+(z<foot-6?Math.round(Math.sin(x*.5)+Math.cos(z*.6)):0);};
  const heightAt=(x,z)=>{if(underTile(x,z))return-.85;let h=ridge(x,z);const e=Math.max(Math.abs(x),z)-42;if(e>0)h=Math.max(h,Math.round((e*.6+Math.max(0,Math.sin(x*.3+z*.25))*e*.3)/.5)*.5);return h;};
  const SWAMPS=[[-41,10],[-42,-7]];
  const surfAt=(x,z,h)=>{if(z<-44&&ridge(x,z)>0)return'grock';if(h>2.5&&Math.sin(x*1.1)*Math.cos(z*.9)>.2)return'grock';if(SWAMPS.some(([a,b])=>((x-a)/4.5)**2+((z-b)/3.6)**2<1.3))return'gmud';
    if(x>-26&&x<26&&z>-6&&z<26)return wlNoise(x*.4,z*.4)>2?'gsoil':'ggrass';return wlNoise(x*.15,z*.15,1)>1.6?'gsoil':'ggrass';};
  sceneTerrain(root,S,2,heightAt,surfAt,SC_GRAVE_SURF);
  const stat=new THREE.Group();root.add(stat);const FOOT=[];
  const put2=(obj,x,z,ry=0,y=0)=>{obj.position.set(x,y,z);obj.rotation.y=ry;obj.userData.isAsset=true;stat.add(obj);return obj;};
  const A=(id,x,z,ry=0,o={},s,y=0)=>{const a=SC_A(id),m=a.build(s??a.defaultSeed??1,Object.assign((a.opts||[]).reduce((q,p)=>(q[p.key]=p.def,q),{}),o));m.traverse(q=>{if(q.isMesh){q.castShadow=!q.material.transparent;q.receiveShadow=true;}});return put2(m,x,z,ry,y);};
  const foot=(x,z,r)=>FOOT.push([x,z,r]),blocked=(x,z,r)=>FOOT.some(([fx,fz,fr])=>Math.hypot(x-fx,z-fz)<fr+r)||underTile(x,z);
  for(const[k,x,z,ry]of TILES){const t=udPathTile(k);t.position.set(x,-T,z);t.rotation.y=ry;t.userData.isAsset=true;stat.add(t);}
  let NB=0,NT=0;
  /* ---------- the necromancer's castle ---------- */
  const CW=(type,x,z,ry,o={},s)=>A('ud-castle-'+type,x,z,ry,o,s);
  [-16,-12,-8,-4,0,4,8,12,16].forEach((x,i)=>{const t=x===0?'gate':i%2?'wall-window':'wall';CW(t,x,-18,0,x===0?{state:'open'}:{wear:i===2?'cracked':i===6?'mossy':'clean'},i+1);});
  [-16,-12,-8,-4,0,4,8,12,16].forEach((x,i)=>CW(i%2?'wall-window':'wall',x,-42,PI,{wear:i===3?'mossy':'clean'},i+11));
  [-40,-36,-32,-28,-24,-20].forEach((z,i)=>{CW(i%3===1?'wall-window':'wall',-18,z,-H90,{wear:i===4?'cracked':'clean'},i+21);CW(i%3===1?'wall-window':'wall',18,z,H90,{wear:i===2?'mossy':'clean'},i+31);});
  for(const[x,z]of[[-18,-18],[18,-18],[-18,-42],[18,-42],[-18,-30],[18,-30]])CW('tower',x,z,0);
  CW('keep',0,-34,0);A('ud-ritual',0,-24,0);A('ud-brazier',-3.2,-24,0);A('ud-brazier',3.2,-24,0);A('ud-obelisk',-5.4,-30.6,0);A('ud-obelisk',5.4,-30.6,0);
  A('ud-gargoyle',-2.6,-28.4,0);A('ud-gargoyle',2.6,-28.4,0);A('ud-banner',-6.4,-27.6,0);A('ud-banner',6.4,-27.6,PI,{},2);A('ud-altar',0,-21,PI);
  for(const[x,z]of[[-9,-29.6],[-10.2,-29.6],[9,-29.6],[10.2,-29.6]])A('ud-coffin',x,z,0,{state:'standing'},Math.abs(x)|0);A('ud-gibbet',12,-24,-H90);A('ud-pikes',-12,-22,0,{},2);A('ud-bonepile',-12.5,-34,0,{},2);A('ud-ossuary',12,-33,-H90,{},2);
  A('ud-pikes',-6,-15.4,0,{},3);A('ud-pikes',6,-15.4,0,{},4);NB+=3;foot(0,-30,19);
  /* ---------- the graveyard ---------- */
  const GV=(id,x,z,ry=0,o={},s)=>A('ud-'+id,x,z,ry,o,s);
  for(let x=-24;x<=24;x+=4){if(x===0)GV('lychgate',0,26,0);else GV('wall',x,26,0,{state:x===-16||x===12?'broken':'intact',wear:'mossy'},Math.abs(x)+1);}
  for(let x=-24;x<=24;x+=4){if(x===0)GV('fence-gate',0,-6,PI,{state:'open'});else GV('fence',x,-6,PI,{},Math.abs(x)+2);}
  for(let z=-4;z<=24;z+=4){GV('fence',-26,z,-H90,{},Math.abs(z)+3);GV('fence',26,z,H90,{},Math.abs(z)+4);}
  for(let x=-26;x<=26;x+=4){if(Math.abs(x)!==2)GV('fence-post',x,-6);}for(let z=-2;z<=26;z+=4){GV('fence-post',-26,z);GV('fence-post',26,z);}for(const x of[-2,2])GV('fence-post',x,26);
  GV('mausoleum-large',-15.8,14,H90,{door:'open'});GV('mausoleum',-21,-.6,0,{door:'closed',wear:'mossy'},2);GV('mausoleum',21.2,3,-H90,{door:'open',wear:'cracked'},3);GV('crypt-entrance',20,20,PI);
  foot(-15.8,14,4.6);foot(-21,-.6,2.8);foot(21.2,3,2.8);foot(20,20,3.2);NB+=4;
  for(const[x,z,w]of[[2.8,8,'yes'],[-2.8,16,'no']]){GV('statue',x,z,w==='yes'?-H90:H90,{wings:w},2);foot(x,z,1);}
  const LAMPS=[];for(const[x,z,ry]of[[2.3,0,-H90],[-2.3,4,H90],[2.3,20,-H90],[-2.3,22,H90]]){LAMPS.push(GV('lamp',x,z,ry));foot(x,z,.6);}
  const OPEN=[[-9,20],[10.4,3.4]];for(const[x,z]of OPEN){GV('grave-open',x,z,0,{style:'rounded'},Math.abs(x)|0);foot(x,z,2.4);}GV('digger-cart',12.8,6.4,.3);foot(12.8,6.4,2.4);
  for(const[x,z,s]of[[-24,-3,1],[23.6,-2.6,2],[-24,23.6,3],[8,23.4,4]]){GV('tree-'+(s%2?'large':'small'),x,z,rng()*6,{},s);foot(x,z,1.6);NT++;}
  GV('shrooms',-24.2,10.4,0,{},2);foot(-24.2,10.4,1);GV('bonepile',23.6,10.4,0,{},3);foot(23.6,10.4,1.4);
  /* rows of graves, headstones at the -z end */
  const busy=(x,z)=>blocked(x,z,1.25)||Math.abs(x)<3.1||(z>4.6&&z<11.4&&x<-1)||(z>12.6&&z<19.4&&x>1)||Math.abs(x)>24.6||z<-4.4||z>24.4;
  let gi=0;for(let z=-2.6;z<=23;z+=3.6)for(let x=-23.6;x<=23.6;x+=2.4){if(busy(x,z)||busy(x,z-1.3)||busy(x,z+1.3))continue;gi++;const k=rng(),j=(rng()-.5)*.3;
    if(k<.58)GV('grave',x+j,z,(rng()-.5)*.08,{wear:rng()<.4?'mossy':rng()<.3?'cracked':'clean'},gi);else if(k<.78)GV('headstone',x+j,z-1,(rng()-.5)*.1,{wear:rng()<.5?'mossy':'clean'},gi);else if(k<.9)GV('tomb',x+j,z,0,{wear:rng()<.5?'mossy':'clean'},gi);}
  udMist(stat,-12,2,6,14,rng);udMist(stat,12,12,6,14,rng);udMist(stat,-8,22,4,8,rng);
  /* ---------- the swamp (west) and the ruined chapel (east) ---------- */
  for(const[x,z]of SWAMPS){GV('swamp',x,z,rng()*6,{},Math.abs(x+z)|1);foot(x,z,4.6);}udMist(stat,-41,2,9,22,rng);
  const RW=(type,x,z,ry,wear,o={},s)=>A('wl-ruin-'+type,x,z,ry,Object.assign({wear},o),s);
  RW('wall-window',34,2,PI,'mossy',{},1);RW('wall-door',34,10,0,'both',{},2);RW('wall-low',38,6,H90,'mossy',{},3);RW('wall-end',30,6,-H90,'mossy',{side:'right'},4);
  for(const[x,z,st]of[[30,2,'broken'],[38,2,'intact'],[30,10,'broken'],[38,10,'broken']])RW('pillar',x,z,0,'mossy',{state:st},x+z);GV('sarcophagus',34,6,0,{lid:'off',wear:'mossy'},2);
  A('wl-ruin-column',36.5,14,0,{state:'fallen',wear:'mossy'},3);foot(34,6,6);foot(36.5,15,3);NB++;
  /* outside: gnarled trees, bones, a gibbet by the road */
  GV('gibbet',5.4,36,0);foot(5.4,36,1.8);A('wl-signpost',-3,44,0);GV('lamp',2.6,40,-H90,{light:'green'});foot(2.6,40,.6);
  for(const[x,z,sz,s]of[[-32,26,'large',5],[-36,-20,'large',6],[30,-10,'large',7],[36,30,'small',8],[-14,38,'large',9],[18,40,'small',10],[-46,30,'small',11],[44,-30,'large',12],[-30,-34,'small',13],[30,-36,'small',14],[-8,32,'small',15],[40,16,'small',16]]){
    if(blocked(x,z,1.5))continue;GV('tree-'+sz,x,z,rng()*6,{},s,heightAt(x,z));foot(x,z,1.5);NT++;}
  for(let i=0;i<30;i++){const x=(rng()-.5)*90,z=(rng()-.5)*90,y=heightAt(x,z);if(y!==0||blocked(x,z,1.2)||(x>-27&&x<27&&z>-7&&z<27)||(x>-19&&x<19&&z>-43&&z<-17))continue;const k=rng();
    A(k<.35?'ud-thorns':k<.6?'wl-drygrass':k<.8?'wl-bones':'ud-shrooms',x,z,rng()*6,{},i+1);foot(x,z,1.2);}
  /* lights: the castle and the ritual first, then flames, then the lamps; 12 at most */
  for(const l of LAMPS)l.traverse(o=>{if(o.isPointLight)o.userData.min=.6;});
  const lights=[];stat.traverse(o=>{if(o.isPointLight)lights.push(o);});lights.sort((a,b)=>(b.userData.min||0)-(a.userData.min||0)||b.distance-a.distance);lights.forEach(l=>{if(root.userData.lights.length<12)root.userData.lights.push(l);else l.parent.remove(l);});
  mergeStatic(stat,32);

  /* ---------- the dead ---------- */
  const dynG=new THREE.Group();dynG.userData.dynamic=true;root.add(dynG);const ag=[],tick=[];
  const C=(id,seed,o={})=>{const a=SC_A(id),m=a.build(seed,Object.assign((a.opts||[]).reduce((q,p)=>(q[p.key]=p.def,q),{}),o));if(!a.id.startsWith('an-'))m.userData.enemy=true;m.traverse(q=>{if(q.isMesh)q.castShadow=true;});dynG.add(m);const A2=agentOf(m);ag.push(A2);return A2;};
  const still=(a,x,z,ry,clip,y=0)=>{a.m.position.set(x,y,z);a.m.rotation.y=ry;a.play(clip,0);if(a.cur)a.cur.time=rng()*3;return a;};
  const later=[];let planned=0;const D=(id,seed,o,fn)=>{planned++;later.push(()=>{const a=C(id,seed,o);fn(a);compactRig(a.m);});};
  // crows are cheap: they are there at once
  for(let i=0;i<4;i++){const c=C('an-crow',1);c.m.userData.enemy=false;const b=[[-20,20,-4,4],[-6,6,30,40],[28,40,-4,12],[-12,12,-14,-8]][i];tick.push(behWander(c,b[0],b[1],b[2],b[3],.5,['Peck','Idle','Caw'],mulberry32(700+i),'Hop'));}
  // the castle
  D('necromancer',3,{staff:'caged',head:'skull'},a=>still(a,0,-25.7,0,'Spell 2 (raise the dead)'));
  for(const[x,s]of[[-1.4,31],[1.5,32]])D('skeleton',s,{weapon:'sword'},a=>still(a,x,-22.6,PI,'Rise'));
  for(const sd of[-1,1])D('skeleton-warrior',40+sd,{},a=>still(a,sd*2.5,-15.6,0,'Idle (war mode)'));
  D('lich',5,{staff:'emerald',head:'crown'},a=>still(a,0,-29.6,0,'Idle (war mode)',10.35));
  for(const sd of[-1,1])D('skeleton-archer',44+sd,{},a=>still(a,sd*8,-18.5,0,'Idle (war mode)',7.2));
  D('skeleton',35,{weapon:'axe'},a=>tick.push(behPath(a,[[-13,-14.6],[13,-14.6]],.9,'Walk',{0:['Idle (war mode)',4],1:['Idle (war mode)',4]})));
  // the graveyard
  D('vampire',6,{coat:'black',lining:'crimson'},a=>still(a,-10.6,14,H90,'Taunt (laugh)'));
  D('ghoul',7,{weapon:'none'},a=>still(a,-7.8,21.3,-H90-.4,'Idle'));D('ghoul',8,{weapon:'knife'},a=>still(a,11.6,4.6,-H90-.3,'Attack 1'));
  D('ghoul',9,{weapon:'cleaver'},a=>tick.push(behPath(a,[[-1,24],[-1,10],[-20,9.2],[-1,10]],.8,'Walk',{2:['Shriek',4],0:['Idle',3]})));
  D('vampire-spawn',10,{},a=>still(a,17.8,17.2,PI*.85,'Idle (war mode)'));D('vampire-spawn',11,{},a=>still(a,21.6,16.6,-PI*.8,'Idle'));
  D('wight',12,{},a=>tick.push(behPath(a,[[1,23],[1,-2],[1,-9],[1,-2]],.9,'Walk',{2:['Idle (war mode)',5],0:['Idle',4]})));
  // the swamp and the chapel
  D('revenant',13,{},a=>tick.push(behPath(a,[[-34,-16],[-34,24]],1,'Walk',{0:['Idle',4],1:['Idle',4]})));
  D('skeleton',36,{weapon:'club'},a=>still(a,33.4,7.8,.5,'Idle'));

  root.userData.tick=dt=>{for(const f of tick)f(dt);for(const a of ag){a.mx.update(dt);a.m.userData.post&&a.m.userData.post();}};
  for(const a of ag)compactRig(a.m);root.userData.tick(.01);sceneStats(root,{buildings:NB,trees:NT});root.userData.stats.enemies=(root.userData.stats.enemies||0)+planned;
  /* the viewer builds the queue itself (root.userData.later) with a percentage before the scene is shown; otherwise the characters join one by one */
  root.userData.later=later;const step=()=>{if(!later.length)return;if(!root.parent&&root.userData.shown)return;later.shift()();setTimeout(step,60);};root.userData.shown=false;setTimeout(()=>{root.userData.shown=true;step();},400);
  return root;}
ASSETS.push({id:'sc-necropolis',folder:'scenes',name:'Haunted necropolis',kind:'scene',build:vxSceneNecropolis,groundR:-1,
  desc:'A 100 × 100 m necropolis built from the undead kit. In the north stands the necromancer\'s castle: gothic walls with glowing stained glass, six spired towers, a gatehouse with the portcullis up and the 28 m keep with its green orb. In the courtyard the necromancer raises the dead in a ritual circle between green braziers and rune obelisks while the lich watches from the balcony; skeletal warriors guard the gate, skeleton archers stand on the wall walk and a skeleton patrols the front. South of it lies the graveyard: a mossy stone wall with a lychgate, iron fences and gates, a flagstone path with staggered branches, lamp posts and mourner statues, rows of graves, headstones and chest tombs, two open graves where ghouls feed, a gravedigger\'s cart, two mausoleums, a grand mausoleum where the vampire laughs on the steps, and a crypt entrance guarded by vampire spawn; a wight walks the path and ground mist drifts between the stones. To the west a revenant paces past black swamp pools; to the east lie the mossy ruins of an older chapel. Gnarled trees, a gibbet, bones and crows all round.'});
