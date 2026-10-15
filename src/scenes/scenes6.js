/* ======================= Scene: goblin wasteland (sc-wasteland), 100 × 100 m =======================
   Built from the wasteland kit on its 4 m grid (grid lines on multiples of 4, cell centres at 4k + 2).
   North: a rock ridge with the ogres' cave. Centre-east: a ruined castle held by goblins, their two-headed ogre boss on a bone throne.
   West: the goblins' palisade war camp. A dirt track comes in from the south and forks to both gates. */
const SC_WASTE_SURF={wdust:['wDust','wDustSide',1],wcrack:['wCracked','wDustSide',1],wgrass:['wDeadGrass','wDustSide',1],wrock:['wRockTop','wRock',1],wash:['wAsh','wDustSide',1],wmud:['mud','wDustSide',1]};
function vxSceneWasteland(){const root=new THREE.Group();root.userData.lights=[];root.userData.ground=-1;const rng=mulberry32(4242),S=100,PI=Math.PI,H90=PI/2;
  /* ---------- road tiles (dirt track): south edge → castle gate, branch west → camp gate ---------- */
  const TILES=[];for(let z=46;z>=2;z-=4)TILES.push([z===14?'t':'s',18,z,z===14?PI:0]);for(let x=14;x>=-14;x-=4)TILES.push(['s',x,14,H90]);
  const underTile=(x,z)=>TILES.some(t=>Math.abs(x-t[1])<2&&Math.abs(z-t[2])<2);
  const FLOORS=[[10,-2],[14,-2],[10,-6],[14,-6]],underFloor=(x,z)=>FLOORS.some(f=>Math.abs(x-f[0])<2&&Math.abs(z-f[1])<2);
  const CAVE=[-18,-26.6],BOG=[36,26];
  const ridge=(x,z)=>{const foot=-23+1.2*Math.sin(x*.21)+.8*Math.cos(x*.47);if(z>foot)return 0;const h=Math.min(9,Math.floor((foot-z)*1.5));return h<9?h:9+Math.round((Math.sin(x*.4)+Math.cos(z*.5))*.6);};
  const heightAt=(x,z)=>{if(underTile(x,z)||underFloor(x,z))return-.85;
    if(Math.abs(x-CAVE[0])<2.6&&z>-31&&z<-21)return 0;
    let h=ridge(x,z);const e=Math.max(Math.abs(x),z)-40;if(e>0)h=Math.max(h,Math.round((e*.5+Math.max(0,Math.sin(x*.3+z*.2))*e*.3)/.5)*.5);return h;};
  const surfAt=(x,z,h)=>{const bd=((x-BOG[0])/4.4)**2+((z-BOG[1])/3.6)**2+Math.sin(x*1.3+z)*.25;if(bd<1.25)return'wmud';if(z<-21&&(h>0||ridge(x,z)>0))return'wrock';if(h>2.5)return Math.sin(x*1.1)*Math.cos(z*.9)>.3?'wrock':'wgrass';if(h>0)return'wgrass';
    if(x>-38&&x<-14&&z>2&&z<26)return wlNoise(x*.3,z*.3)>.4?'wash':'wdust';const n=wlNoise(x*.15,z*.15,1);return n>1.5?'wcrack':n<-1.7?'wgrass':'wdust';};
  sceneTerrain(root,S,2,heightAt,surfAt,SC_WASTE_SURF);
  const stat=new THREE.Group();root.add(stat);const FOOT=[];
  const put2=(obj,x,z,ry=0,y=0)=>{obj.position.set(x,y,z);obj.rotation.y=ry;obj.userData.isAsset=true;stat.add(obj);return obj;};
  const A=(id,x,z,ry=0,o={},s,y=0)=>{const a=SC_A(id),m=a.build(s??a.defaultSeed??1,Object.assign((a.opts||[]).reduce((q,p)=>(q[p.key]=p.def,q),{}),o));m.traverse(q=>{if(q.isMesh){q.castShadow=true;q.receiveShadow=true;}});return put2(m,x,z,ry,y);};
  const foot=(x,z,r)=>FOOT.push([x,z,r]),blocked=(x,z,r)=>FOOT.some(([fx,fz,fr])=>Math.hypot(x-fx,z-fz)<fr+r)||underTile(x,z)||Math.abs(x-18)<3.5&&z>-1||Math.abs(z-14)<3.5&&x<16&&x>-16;
  for(const[k,x,z,ry]of TILES){const t=wlTrackTile(k);t.position.set(x,-T,z);t.rotation.y=ry;t.userData.isAsset=true;stat.add(t);}
  for(const[x,z]of FLOORS){const t=SC_A('wl-ruin-floor').build();t.position.set(x,-T,z);t.userData.isAsset=true;stat.add(t);}
  let NB=0,NT=0;
  /* ---------- the ruined castle: lines x = 4 … 28, z = -20 … 0; gate in the south wall at x = 18 ---------- */
  const RW=(type,x,z,ry,wear,o={},s)=>A('wl-ruin-'+type,x,z,ry,Object.assign({wear},o),s);
  [['wall-slit',6,'cracked'],['wall',10,'mossy'],['wall',14,'cracked'],['gateway',18,'both'],['wall-door',22,'mossy'],['wall-breach',26,'both']].forEach(([t,x,w],i)=>RW(t,x,0,0,w,{},i+1));
  [['wall',-2,'both'],['wall-slit',-6,'clean'],['wall',-10,'mossy'],['wall-end',-14,'cracked',{side:'left'}],['wall-low',-18,'mossy']].forEach(([t,z,w,o],i)=>RW(t,28,z,H90,w,o||{},i+11));
  [['wall',6,'mossy'],['wall-end',10,'cracked',{side:'right'}],['wall-low',14,'both'],['wall-end',18,'mossy',{side:'left'}],['wall-window',22,'mossy'],['wall',26,'cracked']].forEach(([t,x,w,o],i)=>RW(t,x,-20,PI,w,o||{},i+21));
  [['wall-door',-2,'mossy'],['wall',-6,'clean'],['wall-slit',-14,'both'],['wall',-18,'cracked']].forEach(([t,z,w],i)=>RW(t,4,z,-H90,w,{},i+31));
  A('wl-gob-wall',4,-10,-H90,{deco:'trophies'},3);RW('pillar',4,-8,0,'mossy',{state:'broken'},4);RW('pillar',4,-12,0,'cracked',{state:'broken'},5);
  RW('tower',4,0,0,'mossy',{state:'broken'},2);RW('tower',28,0,0,'cracked',{state:'broken'},3);RW('pillar',28,-20,0,'both',{state:'broken'},6);RW('tower',4,-20,0,'mossy',{state:'intact'},4);
  RW('stairs',28,-10,H90,'mossy');A('wl-gob-wall',25.4,-3,0,{deco:'plain'},5);A('wl-gob-corner',23.4,-3,0,{},2);
  A('wl-ruin-keep',12,-12,0,{wear:'mossy'});A('wl-gob-gate',18,-2,0,{state:'open'});
  A('wl-gob-tower',24,-16,0);A('wl-gob-hut',23.5,-7,0,{},2);A('wl-gob-hut',20,-12.5,-H90,{},3);A('wl-gob-cauldron',23.5,-2.4,.4);
  A('wl-gob-throne',9,-4.6,.15,{size:'ogre'});A('wl-gob-junk',6.3,-13,H90);A('wl-gob-totem',6.6,-2.6,.6);A('wl-gob-banner',14.8,-1.4,0);A('wl-gob-banner',21.2,-1.4,PI,{},2);
  A('wl-bones',11.8,-1.8,0,{},4);A('wl-gob-pikes',6.2,-7.2,H90,{},2);A('wl-ruin-rubble',26,-17.4,0,{size:'small'},3);A('wl-ruin-column',16.5,-17.5,0,{state:'broken',wear:'mossy'},2);
  NB+=8;foot(16,-10,15);
  /* outside the castle */
  A('wl-gob-pikes',14.2,3.6,0,{},3);A('wl-skullpile',22.3,3.4,0,{},1);A('wl-ruin-statue',9,6,.4,{wear:'mossy'});A('wl-ruin-arch',-2,-8,0,{state:'broken',wear:'mossy'});
  A('wl-ruin-column',-1,-14,0,{state:'standing',wear:'cracked'},2);A('wl-ruin-column',2.2,-16.5,0,{state:'fallen',wear:'mossy'},3);A('wl-ruin-column',-5,-15,0,{state:'broken',wear:'both'},4);
  A('wl-ruin-rubble',32,-6,0,{size:'large'},2);A('wl-ruin-rubble',1,2,0,{size:'small'},5);A('wl-ruin-rubble',31.5,3,0,{size:'small'},6);
  foot(9,6,2);foot(-2,-8,3);foot(-1,-14,1.5);foot(3,-16.5,3);foot(-5,-15,2.5);foot(32,-6,3);foot(1,2,2);foot(31.5,3,2);
  /* ---------- the goblin war camp: lines x = -36 … -16, z = 4 … 24; gate on the east side at z = 14 ---------- */
  const GW=(type,x,z,ry,o={},s)=>A('wl-gob-'+type,x,z,ry,o,s);
  [['wall-walk',-34,{ladder:'yes'}],['wall',-30,{deco:'trophies'}],['wall',-26,{deco:'spikes'}],['wall-broken',-22],['wall',-18,{deco:'trophies'}]].forEach(([t,x,o],i)=>GW(t,x,24,0,o||{},i+1));
  [['wall',-34,{deco:'trophies'}],['wall',-30,{deco:'plain'}],['wall-walk',-26,{ladder:'yes'}],['wall',-22,{deco:'spikes'}],['wall',-18,{deco:'trophies'}]].forEach(([t,x,o],i)=>GW(t,x,4,PI,o||{},i+6));
  [['wall',6,{deco:'trophies'}],['wall-walk',10,{ladder:'yes'}],['wall',14,{deco:'plain'}],['wall',18,{deco:'trophies'}],['wall',22,{deco:'spikes'}]].forEach(([t,z,o],i)=>GW(t,-36,z,-H90,o||{},i+11));
  [['wall',6,{deco:'trophies'}],['wall-walk',10,{ladder:'yes'}],['gate',14,{state:'open'}],['wall-walk',18,{ladder:'yes'}],['wall',22,{deco:'trophies'}]].forEach(([t,z,o],i)=>GW(t,-16,z,H90,o||{},i+16));
  for(const[x,z]of[[-36,4],[-16,4],[-36,24],[-16,24]])GW('corner',x,z,0,{},Math.abs(x+z)|1);
  GW('tower',-18.2,21.8,0);GW('tower',-33.8,6.2,0);GW('chief',-30.5,14,H90);GW('hut',-28,7.6,0,{},4);GW('hut',-21.5,7.2,.3,{},5);GW('hut',-28.5,21.4,PI,{},6);
  GW('totem',-22.5,14.5,-H90);GW('fire',-23,19.8,0);GW('cauldron',-21,9.8,0);GW('rack',-25.2,11.6,H90);GW('cage',-34,19.5,.4);GW('junk',-26.4,18,0);GW('banner',-18,12.4,H90);GW('tent',-33.4,10.6,H90);
  GW('pikes',-13.4,9.6,H90,{},4);GW('pikes',-13.4,18.4,H90,{},5);GW('barricade',-12.2,6,H90);GW('barricade',-12.2,22,H90);A('wl-signpost',-12.6,11.6,H90);
  foot(-26,14,13.5);NB+=7;
  /* warg pen south of the camp */
  for(const[x,z,ry]of[[-32,27,0],[-28,27,0],[-32,35,0],[-28,35,0],[-34,29,H90],[-34,33,H90],[-26,29,H90]])GW('fence',x,z,ry,{},Math.abs(x*z)%7+1);GW('corner',-26,35,0,{},3);
  A('wl-bones',-30,31,0,{},6);foot(-30,31,6);
  /* ---------- the ogres' cave in the ridge ---------- */
  A('wl-cave-mouth',CAVE[0],CAVE[1],0,{},2);A('wl-cave-nest',-25,-19.4,.3);A('wl-gob-fire',-15.6,-19.2,0,{},2);A('wl-skullpile',-12.2,-21,0,{},2);A('wl-cave-rockfall',-8,-22,0,{},2);
  A('wl-cave-stalagmites',-24,-23.4,0,{},3);A('wl-bones',-19.5,-16.6,0,{},7);A('wl-ribcage',-6,-17,.6,{},1);A('wl-cave-shrooms',-21.6,-22.4,0,{},2);
  foot(-18,-25,7);foot(-25,-19.4,3.4);foot(-15.6,-19.2,2);foot(-12.2,-21,1.2);foot(-8,-22,3);foot(-24,-23.4,2);foot(-6,-17,5);
  /* ---------- badlands: bog, spires, battlefield, wrecks, dead and burnt trees ---------- */
  A('wl-bog',BOG[0],BOG[1],.3,{},1);foot(BOG[0],BOG[1],4);
  for(const[x,z,s]of[[42,38,1],[40,16,2],[-44,-14,3],[30,-30,4],[6,-32,5],[-36,-36,6]]){const y=heightAt(x,z);A('wl-spire',x,z,rng()*6,{},s,y);foot(x,z,3);}
  for(const[x,z,s]of[[-10,34,1],[-22,40,2]]){A('wl-battlefield',x,z,rng()*6,{},s);foot(x,z,3.4);}
  A('wl-cart',24.6,33,-.4,{},1);foot(24.6,33,3);A('wl-signpost',15.4,44,0);A('wl-signpost',15.6,17,0);A('wl-cairn',21,9.4,0,{},2);foot(21,9.4,1.2);
  A('wl-ribcage',2,30,-.8,{},2);foot(2,30,5.5);A('wl-skullpile',-6,8,0,{},3);foot(-6,8,1.2);
  for(const[x,z,id,s]of[[30,12,'wl-boulder',1],[-6,22,'wl-boulder',2],[38,-14,'wl-boulder',3],[-42,30,'wl-boulder',4],[10,40,'wl-boulder',5],[34,-22,'wl-boulder',6],[-28,-10,'wl-boulder',7],[-40,0,'wl-boulder',8]]){if(blocked(x,z,2.5))continue;A(id,x,z,rng()*6,{},s,heightAt(x,z));foot(x,z,2.6);}
  for(const[x,z,size,s]of[[-6,-2,'large',1],[30,40,'large',2],[-14,26,'small',3],[8,22,'small',4],[36,6,'large',5],[-44,18,'small',6],[-10,-28,'small',7],[26,-26,'large',8],[0,44,'small',9],[-30,40,'large',10],[44,28,'small',11],[-2,16,'small',12]]){
    if(blocked(x,z,1.5))continue;A('wl-deadtree-'+size,x,z,rng()*6,{},s,heightAt(x,z));foot(x,z,1.4);NT++;}
  for(const[x,z,s]of[[-10,18,1],[-12,2,2],[-40,10,3],[12,30,4],[-24,30,5],[34,16,6]]){if(blocked(x,z,1.3))continue;A('wl-burnt-tree',x,z,rng()*6,{},s,heightAt(x,z));foot(x,z,1.3);NT++;}
  for(let i=0;i<34;i++){const x=(rng()-.5)*88,z=(rng()-.5)*76+4,k=rng(),y=heightAt(x,z);if(y<0||blocked(x,z,1.2))continue;
    const flat=[[1,0],[-1,0],[0,1],[0,-1]].every(([a,b])=>heightAt(x+a,z+b)===y);if(!flat)continue;A(k<.35?'wl-thorn':k<.75?'wl-drygrass':'wl-bones',x,z,rng()*6,{},1+i,y);foot(x,z,1);}
  /* lights: always-on fires and torches first, 12 at most */
  const lights=[];stat.traverse(o=>{if(o.isPointLight)lights.push(o);});lights.sort((a,b)=>(b.userData.min||0)-(a.userData.min||0));lights.forEach(l=>{if(root.userData.lights.length<12)root.userData.lights.push(l);else l.parent.remove(l);});
  mergeStatic(stat,32);

  /* ---------- the inhabitants ---------- */
  const dynG=new THREE.Group();dynG.userData.dynamic=true;root.add(dynG);const ag=[],tick=[];
  const C=(id,seed,o={})=>{const a=SC_A(id),m=a.build(seed,Object.assign((a.opts||[]).reduce((q,p)=>(q[p.key]=p.def,q),{}),o));m.userData.enemy=true;m.traverse(q=>{if(q.isMesh)q.castShadow=true;});dynG.add(m);const A2=agentOf(m);ag.push(A2);return A2;};
  const still=(a,x,z,ry,clip,y=0)=>{a.m.position.set(x,y,z);a.m.rotation.y=ry;a.play(clip,0);if(a.cur)a.cur.time=rng()*3;return a;};
  /* ogres, shamans and the boss take seconds to build their clips: they join one by one after the scene is on screen */
  const later=[];let planned=0;const D=(id,seed,o,fn)=>{planned++;later.push(()=>{const a=C(id,seed,o);fn(a);compactRig(a.m);});};
  // castle: the boss on his throne, his warg, guards, goblins at work
  D('ogre-boss',3,{staff:'skull'},a=>still(a,11.6,-3.2,.25,'Idle'));still(C('warg',4,{gear:'collar',pattern:'saddle'}),13.6,-4.6,-.6,'Lie down');
  still(C('hobgoblin',5,{weapon:'cleaver'}),16.1,2.6,.15,'Idle (war mode)');still(C('hobgoblin',6,{weapon:'axe',helm:'cap'}),19.9,2.6,-.15,'Idle (war mode)');
  still(C('goblin',7,{weapon:'club'}),22.1,-1.5,2.2,'Idle');still(C('goblin',8,{weapon:'axe'}),24.9,-1.4,-2.3,'Idle');
  still(C('goblin',9,{weapon:'sword'}),24.6,-15.3,.1,'Idle (war mode)',5.07);
  tick.push(behPath(C('goblin',10,{weapon:'sword'}),[[18,-4.6],[18,-6.5],[8,-6.5],[6.4,-9.6],[18,-6.5]],.9,'Walk',{2:['Idle',4]}));
  D('goblin-shaman',11,{staff:'banner'},a=>still(a,7.6,-1.2,2.4,'Spell 3 (staff raised)'));
  // war camp
  D('goblin-shaman',12,{staff:'banner'},a=>still(a,-21.1,14.6,-H90,'Spell 1 (staff forward)'));
  still(C('goblin',13,{weapon:'club'}),-24.3,18.6,.9,'Idle');still(C('goblin',14,{weapon:'axe'}),-21.7,20.8,-2.4,'Idle');
  still(C('hobgoblin',15,{weapon:'mace'}),-27.6,14.6,H90,'Idle (war mode)');still(C('goblin',16,{weapon:'sword'}),-17,10,H90,'Idle (war mode)',2.64);
  still(C('goblin',17,{weapon:'axe'}),-18.4,22.3,.2,'Idle (war mode)',5.07);
  tick.push(behPath(C('goblin',18,{weapon:'club'}),[[-24,12],[-19,12],[-19,17],[-24,17]],.9,'Walk',{1:['Idle',3]}));
  tick.push(behPath(C('goblin',19,{weapon:'sword'}),[[-14,13.2],[14,13.2],[16.8,13.2],[16.8,4],[16.8,13.2],[-14,13.2]],1.1,'Walk',{2:['Idle (war mode)',3],5:['Idle',3]}));
  for(let i=0;i<2;i++)tick.push(behWander(C('warg',20+i,{}),-33,-27,28,34,.6,['Idle','Sniff','Lie down','Sit'],mulberry32(500+i)));
  // the cave: ogres and the ogre magi; one ogre walks the old road to the castle
  D('ogre',22,{weapon:'club'},a=>still(a,-16.4,-21.4,.3,'Idle'));D('ogre-magi',23,{staff:'gnarled'},a=>still(a,-21.4,-18.2,.6,'Spell 2 (staff slam)'));
  D('ogre',24,{weapon:'club'},a=>tick.push(behPath(a,[[-14,-17],[-2,-11],[-2,-5],[4,4.2],[14.6,7],[4,4.2],[-2,-5],[-2,-11]],.9,'Walk',{4:['Taunt',5],0:['Idle',5]})));
  // the troll in the badlands
  tick.push(behWander(C('troll',25,{}),24,32,36,42,.7,['Idle','Roar','Idle'],mulberry32(510)));

  root.userData.tick=dt=>{for(const f of tick)f(dt);for(const a of ag){a.mx.update(dt);a.m.userData.post&&a.m.userData.post();}};
  for(const a of ag)compactRig(a.m);root.userData.tick(.01);sceneStats(root,{buildings:NB,trees:NT});root.userData.stats.enemies+=planned;
  const step=()=>{if(!later.length)return;if(!root.parent&&root.userData.shown)return;later.shift()();setTimeout(step,60);};root.userData.shown=false;setTimeout(()=>{root.userData.shown=true;step();},400);
  return root;}
ASSETS.push({id:'sc-wasteland',folder:'scenes',name:'Goblin wasteland',kind:'scene',build:vxSceneWasteland,groundR:-1,
  desc:'A 100 × 100 m wasteland built from the wasteland kit. To the north a rock ridge rises in cliffs; in its foot the ogres have their cave, with a nest, a fire, bones and a skull pile; an ogre stands guard, the ogre magi works a spell and a second ogre walks the old road to the castle. In the middle stands a ruined castle on a 24 × 20 m grid: broken, cracked and mossy walls, tower stumps, an intact corner tower, a breach the goblins have fenced with a palisade and the roofless keep. The goblins hold it: watchtower, huts, a cauldron, a totem, banners, pikes and a wooden gate behind the stone gateway, with two hobgoblins on guard and the two-headed ogre boss beside his bone throne. To the west lies the goblin war camp, a palisade fort with wall walks, two watchtowers, the chieftain\'s longhut, huts, a totem with a shaman, a fire and a warg pen. A dirt track runs in from the south and forks to both gates, past dead and burnt trees, rock spires, battlefield remains, a broken cart, a beast skeleton, a bog and a wandering troll.'});
