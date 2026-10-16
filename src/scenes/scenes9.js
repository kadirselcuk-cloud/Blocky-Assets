/* ======================= Scenes: the three bases, 100 × 100 m each =======================
   Safe places where the player resupplies, each walled in the middle of hostile ground:
   - Army camp base (sc-base-camp): a palisade fort of the realm's army in the brutes' wasteland (wasteland kit outside).
   - Town base (sc-base-town): a stone-walled market town in undead country (undead kit outside).
   - Outpost base (sc-base-outpost): the priest outpost behind stone walls on holy ground in Hell (hell kit outside).
   Shared frame (scbFrame): the base is centred on the origin inside walls on |x|, |z| = B, gates on z = ±B, the road runs north-south along x = 0
   (kit road tiles outside the walls, cell centres at B + 2 + 4k, a 4 m dirt path inside). Ordinary grass and dirt inside the walls,
   turning into the kit's ground in a 6 m band outside them; hills rise at the map edge (lowered where the road leaves). No enemies. */
const SCB_SIDES={N:[0,-1,Math.PI],S:[0,1,0],W:[-1,0,-Math.PI/2],E:[1,0,Math.PI/2]};
function scbFrame(o){const root=new THREE.Group();root.userData.lights=[];root.userData.ground=-1;const B=o.B,rng=mulberry32(o.seed),PI=Math.PI;
  const TILES=o.tiles,underTile=(x,z)=>TILES.some(t=>Math.abs(x-t[1])<2&&Math.abs(z-t[2])<2),ring=(x,z)=>Math.max(Math.abs(x),Math.abs(z))-B;
  const heightAt=(x,z)=>{if(underTile(x,z))return-.85;if(ring(x,z)<6)return 0;let h=o.height?o.height(x,z):0;const e=Math.max(Math.abs(x),Math.abs(z))-42;
    if(e>0){let k=Math.round((e*.6+Math.max(0,Math.sin(x*.3+z*.25))*e*.3)/.5)*.5;if(Math.abs(z)>Math.abs(x)&&o.exits.includes(z<0?'N':'S'))k*=Math.min(1,Math.max(0,(Math.abs(x)-3)/9));h=Math.max(h,Math.round(k/.5)*.5);}return h;};
  const surfAt=(x,z,h)=>{const r=ring(x,z);if(r<0)return o.path(x,z)||o.inner(x,z);if(r<6&&wlNoise(x*.35+3,z*.35)<=2.4-4.8*r/6)return o.edge?o.edge(x,z):'grass';return o.outer(x,z,h);};
  sceneTerrain(root,100,2,heightAt,surfAt,o.surf);
  const stat=new THREE.Group();root.add(stat);const FOOT=[];
  const put2=(obj,x,z,ry=0,y=0)=>{obj.position.set(x,y,z);obj.rotation.y=ry;obj.userData.isAsset=true;stat.add(obj);return obj;};
  const mk=(id,o2={},s)=>{const a=SC_A(id);return a.build(s??a.defaultSeed??1,Object.assign((a.opts||[]).reduce((q,p)=>(q[p.key]=p.def,q),{}),o2));};
  const A=(id,x,z,ry=0,o2={},s,y=0)=>{const m=mk(id,o2,s);m.traverse(q=>{if(q.isMesh){q.castShadow=!q.material.transparent;q.receiveShadow=true;}});return put2(m,x,z,ry,y);};
  const F=(fn,x,z,ry=0,y=0)=>{const m=fn();m.traverse(q=>{if(q.isMesh){q.castShadow=!q.material.transparent;q.receiveShadow=true;}});return put2(m,x,z,ry,y);};
  const foot=(x,z,r)=>FOOT.push([x,z,r]),blocked=(x,z,r)=>ring(x,z)<5+r||Math.abs(x)<3+r||FOOT.some(([fx,fz,fr])=>Math.hypot(x-fx,z-fz)<fr+r)||underTile(x,z);
  for(const[k,x,z,ry]of TILES){const t=o.tile(k);t.position.set(x,-T,z);t.rotation.y=ry;t.userData.isAsset=true;stat.add(t);}
  /* walls: 'wood' = palisade, log towers, wooden gates; 'stone' = curtain wall, stone gates, and stone towers (corner:'tower') or corner turrets (corner:'turret') */
  const walls=(kind,corner)=>{const wood=kind==='wood',tc=wood?1.7:corner==='turret'?4.8:3.1,gh=wood?3.8:5,g=new THREE.Group();g.userData.isAsset=true;stat.add(g);let n=0;
    for(const side in SCB_SIDES){const[sx,sz,ry]=SCB_SIDES[side],cuts=[[-B-9,-B+tc],[B-tc,B+9]];if(o.exits.includes(side))cuts.push([-gh,gh]);cuts.sort((a,b)=>a[0]-b[0]);
      let cur=-B;const segs=[];for(const[a,b]of cuts){if(a>cur)segs.push([cur,a]);cur=Math.max(cur,b);}
      for(const[a,b]of segs){const len=b-a,k=Math.ceil(len/8);for(let i=0;i<k;i++){const c=a+(i+.5)*len/k,x=sz?c:sx*B,z=sz?sz*B:c;n++;if(wood)vPalisadeSeg(g,len/k,x,z,ry,n+6);else vStoneWallSeg(g,len/k,x,z,ry,{});}}}
    for(const[x,z]of[[-B,-B],[B,-B],[-B,B],[B,B]]){if(corner==='turret')put2(mk('vx-stonewall-c'),x,z,z<0?(x<0?PI:PI/2):(x<0?-PI/2:0));else put2(mk(wood?'vx-woodtower':'vx-stonetower'),x,z,z<0?PI:x<0?-PI/2:PI/2);}
    for(const side of o.exits)put2(mk(wood?'vx-woodgate':'vx-stonegate',{state:1}),0,SCB_SIDES[side][1]*B,SCB_SIDES[side][2],-.25);};
  /* people and animals */
  const dynG=new THREE.Group();dynG.userData.dynamic=true;root.add(dynG);const ag=[],tick=[],work=[];
  const V_=(kind,seed,job,force)=>{const m=buildVillager(kind,seed,job,force||{});m.traverse(q=>{if(q.isMesh)q.castShadow=true;});dynG.add(m);const a=agentOf(m);ag.push(a);if(m.userData.occTool)giveTool(m,m.userData.occTool);return a;};
  const tool=(a,name)=>{const t=a.m.userData.toolObj;if(t)t.parent.remove(t);a.m.userData.occTool=name;if(name)giveTool(a.m,name);return a;};
  const AN_=m=>{m.traverse(q=>{if(q.isMesh)q.castShadow=true;});dynG.add(m);const a=agentOf(m);ag.push(a);return a;};
  const still=(a,x,z,ry,clip,t,y=0)=>{a.m.position.set(x,y,z);a.m.rotation.y=ry;a.play(clip,0);if(a.cur)a.cur.time=t??rng()*3;return a;};
  /* lights: inside the walls first (where the player is), then always-on ones; 12 at most */
  const finish=(stats,extra)=>{const lights=[],v=new THREE.Vector3();stat.updateMatrixWorld(true);stat.traverse(q=>{if(q.isPointLight){q.getWorldPosition(v);q.userData.inB=ring(v.x,v.z)<0?1:0;lights.push(q);}});
    lights.sort((a,b)=>b.userData.inB-a.userData.inB||(b.userData.min||0)-(a.userData.min||0)||b.distance-a.distance);
    lights.forEach(l=>{if(root.userData.lights.length<12)root.userData.lights.push(l);else l.parent.remove(l);});mergeStatic(stat,32);
    for(const[a]of work){a.mx.update(0);a.m.userData.post&&a.m.userData.post();}root.updateMatrixWorld(true);for(const[a,c]of work)workPiece(dynG,a.m,c);
    root.userData.tick=dt=>{extra&&extra(dt);for(const f of tick)f(dt);for(const a of ag){a.mx.update(dt);a.m.userData.post&&a.m.userData.post();}};
    for(const a of ag)compactRig(a.m);root.userData.tick(.01);sceneStats(root,stats);return root;};
  return{root,rng,B,heightAt,ring,underTile,stat,put2,mk,A,F,foot,blocked,walls,V_,tool,AN_,still,tick,work,finish};}
/* road tiles along x = 0 from the gates to the map edge, skipping z values in skip */
const scbRoad=(B,exits,skip=[])=>{const t=[];for(const s of exits)for(let d=B+2;d<=48;d+=4){const z=s==='S'?d:-d;if(!skip.includes(z))t.push(['s',0,z,0]);}return t;};
/* scatter n small things (ids picked by k in [0,1)) on flat open ground outside the walls */
function scbScatter(K,n,pick,box=44){for(let i=0;i<n;i++){const x=(K.rng()-.5)*2*box,z=(K.rng()-.5)*2*box,y=K.heightAt(x,z);if(y<0||K.blocked(x,z,1.2))continue;
  if(![[1,0],[-1,0],[0,1],[0,-1]].every(([a,b])=>K.heightAt(x+a,z+b)===y))continue;K.A(pick(K.rng()),x,z,K.rng()*6,{},i+1,y);K.foot(x,z,1.1);}}

/* ======================= Army camp base (sc-base-camp): wasteland ======================= */
function vxSceneBaseCamp(){const PI=Math.PI,H90=PI/2,B=22,BOG=[-36,30];
  const mesa=(x,z)=>{const m=Math.min(x-29+Math.sin(z*.4),-29-z+Math.cos(x*.35));return m>0?Math.min(8,Math.floor(m*1.6))+(m>4?Math.round(Math.sin(x*.5)+Math.cos(z*.6)):0):0;};
  const K=scbFrame({seed:5150,B,exits:['S','N'],tiles:scbRoad(B,['S','N']),tile:k=>wlTrackTile(k),surf:SC_WASTE_SURF,height:mesa,
    path:(x,z)=>Math.abs(x)<2&&'path',inner:(x,z)=>wlNoise(x*.25,z*.25)>.6?'dirt':'grass',edge:(x,z)=>wlNoise(x*.5,z*.5)>1?'dirt':'grass',
    outer:(x,z,h)=>{if(((x-BOG[0])/4.4)**2+((z-BOG[1])/3.6)**2+Math.sin(x*1.3+z)*.25<1.25)return'wmud';if(mesa(x,z)>0||h>2.5)return Math.sin(x*1.1)*Math.cos(z*.9)>.3?'wrock':h>0&&mesa(x,z)===0?'wgrass':'wrock';if(h>0)return'wgrass';
      if(x<-26&&z<-26)return wlNoise(x*.3,z*.3)>.4?'wash':'wdust';const n=wlNoise(x*.15,z*.15,1);return n>1.5?'wcrack':n<-1.7?'wgrass':'wdust';}});
  const{A,F,put2,foot,blocked,heightAt,rng,V_,tool,AN_,still,tick,work}=K;let NB=0,NT=0;
  K.walls('wood');
  /* stake barricades outside the palisade, points outward, a gap for the road */
  const sg=new THREE.Group();put2(sg,0,0);for(const s of[-1,1]){for(const x of[-21,-15,-9,9,15,21])vStakes(sg,x,s*26.5,s>0?0:PI,6);for(const z of[-21,-15,-9,-3,3,9,15,21])vStakes(sg,s*26.5,z,s>0?H90:-H90,6);}
  /* ---------- inside: headquarters (north-west) ---------- */
  const c={};A('ac-command',-9,-13,H90,c);A('ac-banner',-4.4,-16.4);A('ac-banner',-4.4,-9.6);A('ac-pavilion',-16,-16,H90);A('ac-pavilion',-16,-9,H90,{},2);NB+=3;
  /* the healer's tent, horse lines, kitchen and mess (west) */
  A('po-tent',-8,-3,H90);A('ac-picket',-16,-1.5);A('ac-kitchen',-7,5);A('ac-mess',-7,10);A('ac-mess',-7,13.2);NB+=2;
  /* training ground (south-west) */
  for(const x of[-17,-14.5,-12])A('ac-dummy',x,6);for(const x of[-17,-13.5])A('ac-butt',x,12);
  /* the quartermaster (east): armoury, forge, supplies, wagon, racks, and the resupply row of stalls facing the road */
  A('ac-armoury',9,-17.6);A('ac-forge',16,-17.4);A('ac-supplies',9.5,-11);A('ac-wagon',16.5,-9);A('ac-rack',3.6,-14,-H90);A('ac-rack',3.6,-10,-H90);A('ac-watch',18.6,-2,-H90);NB+=3;
  A('vx-stall-8',4.6,-4.5,-H90);A('vx-stall-9',4.6,1,-H90);A('vx-stall-6',4.6,6.5,-H90);NB+=3;
  /* soldiers' tents (south-east) and the standards at the south gate */
  for(const x of[9.5,13,16.5]){A('ac-tent',x,11,0,{},x|0);A('ac-tent',x,17,PI,{},(x|0)+1);}NB+=6;A('ac-banner',3.6,17.6);A('ac-banner',-4.6,17.6);
  for(const[x,z]of[[-2.6,-6],[2.6,9.5],[-2.6,15.5]])F(lStreetLantern,x,z,x<0?H90:-H90);
  /* ---------- outside: the brutes' wasteland ---------- */
  A('wl-bog',BOG[0],BOG[1],.3);foot(BOG[0],BOG[1],4);
  for(const[x,z,s]of[[-14,36,1],[18,38,2],[36,8,3],[-36,-12,4]]){A('wl-battlefield',x,z,rng()*6,{},s);foot(x,z,3.4);}
  A('wl-ribcage',34,30,-.6);foot(34,30,5);A('wl-cart',7,37,-.4);foot(7,37,3);A('wl-cairn',-30,-36,0,{},2);foot(-30,-36,1.2);
  for(const[x,z]of[[3.4,31],[-3.4,-31]]){A('wl-signpost',x,z,x>0?0:PI);}foot(3.4,31,.8);foot(-3.4,-31,.8);
  A('wl-gob-totem',-40,14,H90*.7);foot(-40,14,1.6);A('wl-gob-pikes',-38,19,.5,{},2);foot(-38,19,1.8);A('wl-skullpile',-34,8,0,{},2);foot(-34,8,1.2);A('wl-skullpile',30,-14,0,{},3);foot(30,-14,1.2);
  for(const[x,z,s]of[[-40,-28,1],[22,-38,2],[40,22,3],[-24,40,4]]){if(blocked(x,z,2.6))continue;A('wl-spire',x,z,rng()*6,{},s,heightAt(x,z));foot(x,z,2.8);}
  for(const[x,z,s]of[[-30,-4,1],[14,-32,2],[38,-4,3],[-8,-36,4],[26,42,5],[-42,36,6],[-18,-30,7],[44,34,8]]){if(blocked(x,z,2.4))continue;A('wl-boulder',x,z,rng()*6,{},s,heightAt(x,z));foot(x,z,2.6);}
  for(const[x,z,sz,s]of[[-30,28,'large',1],[30,18,'small',2],[-16,-38,'large',3],[12,30,'small',4],[-44,-4,'small',5],[34,40,'large',6],[-30,-18,'small',7],[20,-30,'small',8],[-10,44,'small',9],[44,10,'large',10]]){
    if(blocked(x,z,1.5))continue;A('wl-deadtree-'+sz,x,z,rng()*6,{},s,heightAt(x,z));foot(x,z,1.5);NT++;}
  for(const[x,z,s]of[[-36,-30,1],[-28,-42,2],[-42,-20,3],[24,32,4]]){if(blocked(x,z,1.3))continue;A('wl-burnt-tree',x,z,rng()*6,{},s,heightAt(x,z));foot(x,z,1.3);NT++;}
  scbScatter(K,40,k=>k<.4?'wl-drygrass':k<.75?'wl-thorn':'wl-bones');

  /* ---------- the garrison ---------- */
  for(const sd of[-1,1]){still(V_('male',11+sd,'guard'),sd*2.7,18.6,0,'Idle');still(V_('male',14+sd,'guard'),sd*2.7,-18.6,PI,'Idle');}
  tick.push(behPath(V_('male',17,'guard'),[[1,-17],[1,17],[-1,17],[-1,-17]],1,'Walk',{1:['Look around',4],3:['Look around',4]}));
  still(V_('male',18,'guard'),-14.5,7.3,PI,'Swing');still(tool(V_('male',19,'guard'),'Club'),-12,7.3,PI+.2,'Swing',.6);
  still(V_('male',20,'archer'),-17,18.4,PI,'Idle');still(V_('female',21,'archer'),-13.5,18.4,PI,'Look around');
  still(V_('male',22,'blacksmith'),16.8,-16.5,PI,'Hammering');still(V_('female',23,'cook'),-5.8,5.8,-2.03,'Idle');
  still(V_('female',24,'healer'),-5,-2.8,H90+.5,'Talk');still(V_('male',25,'guard'),-3.8,-2,-H90-.6,'Talk',1.1);
  for(const[z,s,j]of[[-1.8,26,'merchant'],[3.7,27,'merchant'],[9.2,28,'cook']])still(V_(s===27?'female':'male',s,j),2.9,z,-H90,'Idle');
  still(V_('male',29,'merchant'),7.4,-13.8,-H90,'Talk');still(V_('male',30,'guard'),5.8,-13.8,H90,'Talk',1.2);
  still(V_('male',31,'noble'),-6.2,-13,-H90,'Idle');still(V_('male',32,'guard'),-3.4,-12.4,-H90+.4,'Talk');
  still(V_('male',33,'guard'),-7.6,8.6,0,'Talk');still(V_('male',34,'archer'),-6.4,8.6,PI,'Talk',.8);
  tick.push(behPath(V_('male',35,'guard'),[[7.4,14],[19.4,14],[19.4,7.8],[7.4,7.8]],.9,'Walk',{2:['Idle',4]}));
  still(V_('male',36,'archer'),18.6,-2,-H90,'Look around',0,3.12);
  for(const[x,s,c]of[[-17.6,40,'#6e4a2e'],[-16.4,41,'#26242a']])still(AN_(horseB(s,{coat:c})),x,.6,PI,'Idle');still(AN_(horseB(42,{coat:'#a8784a'})),-12.2,-2.6,-H90,'Graze');
  {const d=AN_(dogB(0,{coat:'#c8963e'}));still(d,-4,.6,H90,'Lie down');}
  return K.finish({buildings:NB,trees:NT});}
ASSETS.push({id:'sc-base-camp',folder:'scenes',name:'Army camp base',kind:'scene',build:vxSceneBaseCamp,groundR:-1,
  desc:'A 100 × 100 m base where the player can resupply: the realm\'s army camp, a 44 m square palisade fort with log towers at the corners and wooden gates north and south, ringed by stake barricades, in the middle of the brutes\' wasteland. Inside: the command tent between two standards and two officer\'s pavilions, the healer\'s tent, horse lines with three horses, the camp kitchen and mess tables, a training ground with dummies and archery butts, the quartermaster\'s armoury, forge, supply dump, wagon and weapon racks, a row of stalls on the road (armourer, apothecary, butcher), a watch platform and six soldiers\' tents. 24 soldiers and camp folk on guard, at work, training and trading, a dog. Outside: dusty, cracked and dead-grass badlands, a rock mesa in the north-east, a bog, battlefield remains, a beast skeleton, a broken cart, a goblin totem with pikes and skull piles, warning posts on the track, rock spires, boulders, dead and burnt trees.'});

/* ======================= Town base (sc-base-town): undead country ======================= */
function vxSceneBaseTown(){const PI=Math.PI,H90=PI/2,B=22,SWAMPS=[[37,-8],[39,13]],YARD=[-44,-30,-14,12];
  const K=scbFrame({seed:6161,B,exits:['S','N'],tiles:scbRoad(B,['S','N']),tile:k=>udPathTile(k),surf:SC_GRAVE_SURF,
    path:(x,z)=>Math.abs(x)<11&&Math.abs(z)<9?'plaza':Math.abs(x)<2&&'path',inner:(x,z)=>'grass',
    outer:(x,z,h)=>{if(h>2.5&&Math.sin(x*1.1)*Math.cos(z*.9)>.2)return'grock';if(SWAMPS.some(([a,b])=>((x-a)/4.5)**2+((z-b)/3.6)**2<1.3))return'gmud';
      if(x>YARD[0]&&x<YARD[1]&&z>YARD[2]&&z<YARD[3])return wlNoise(x*.4,z*.4)>1.2?'gsoil':'ggrass';return wlNoise(x*.15,z*.15,1)>1.6?'gsoil':'ggrass';}});
  const{A,F,put2,foot,blocked,heightAt,rng,V_,tool,AN_,still,tick,work,stat}=K;let NB=0,NT=0;
  K.walls('stone','tower');
  /* ---------- the market square ---------- */
  A('tw-fountain',0,0);
  A('vx-market',-6.5,-6.5);A('vx-stall-6',6.5,-6.5);A('vx-stall-9',-6.5,6.5,PI);A('vx-stall-8',6.5,6.5,PI);A('vx-stall-11',-9,0,H90);NB+=5;
  A('tw-roast',9,0,-H90);A('tw-cart',-6,2.6,-.4,{goods:'fruit'});A('tw-notice',-3.4,-10.8);A('tw-signpost',3.2,-11.4,0);
  for(const z of[-4.6,4.6]){const b=new THREE.Group();vBench(b,0,0);put2(b,0,z,z<0?0:PI);}
  for(const[x,z]of[[-2.6,-10],[2.6,10],[-2.6,18],[2.6,-18]])F(lStreetLantern,x,z,x<0?H90:-H90);
  /* ---------- around it: tavern, clinic, smithy, houses ---------- */
  A('vx-tavern',-13,-15);A('vx-clinic',13,-15);A('vx-blacksmith',-13,15,PI);A('vx-twn-1',14,15.5,PI);A('vx-twn-2',7,15.5,PI,{},2);A('vx-brk-1',-16,0,H90);A('vx-brk-3',16,0,-H90);NB+=7;
  /* ---------- outside: undead country ---------- */
  /* the old graveyard (west), walled, with a lychgate facing the town */
  const GV=(id,x,z,ry=0,o={},s)=>A('ud-'+id,x,z,ry,o,s);
  for(const z of[-10,-6,-2,2,6,10]){if(z===-2)GV('fence-gate',-29,z,H90,{state:'open'});else GV('fence',-29,z,H90,{},Math.abs(z)+1);GV('fence',-41,z,-H90,{},Math.abs(z)+7);}
  for(const x of[-39,-35,-31]){GV('fence',x,-12,PI,{},Math.abs(x));GV('fence',x,12,0,{},Math.abs(x)+3);}
  for(const x of[-41,-37,-33,-29])for(const z of[-12,12])GV('fence-post',x,z);for(const x of[-41,-29])for(let z=-8;z<=8;z+=4)GV('fence-post',x,z);
  GV('mausoleum',-37.5,-8,H90,{door:'closed',wear:'mossy'});GV('statue',-33,-2,H90,{wings:'yes'});GV('grave-open',-33,6,0,{style:'rounded'});GV('digger-cart',-26.4,-7,.2);foot(-26.4,-7,2);NB+=2;
  for(let z=-10;z<=10;z+=3.2)for(let x=-39.4;x<=-30.5;x+=2.4){if(Math.hypot(x+37.5,z+8)<3.6||Math.hypot(x+33,z+2)<1.8||Math.hypot(x+32.6,z-6)<3||Math.abs(z+2)<1.6&&x>-35)continue;const k=rng(),j=(rng()-.5)*.3;
    if(k<.5)GV('grave',x+j,z,(rng()-.5)*.1,{wear:rng()<.5?'mossy':'cracked'},(x*z)|1);else if(k<.75)GV('headstone',x+j,z-.9,(rng()-.5)*.14,{wear:'mossy'},(x*z)|1);else if(k<.86)GV('tomb',x+j,z,0,{wear:'mossy'},(x*z)|1);}
  udMist(stat,-35,0,6,14,rng);foot(-35,0,13.5);
  /* black swamp (east), a crypt entrance, the gibbet and lamps on the road */
  for(const[x,z]of SWAMPS){GV('swamp',x,z,rng()*6,{},Math.abs(x+z)|1);foot(x,z,4.6);}udMist(stat,38,3,9,20,rng);
  GV('crypt-entrance',34,-34,-PI*.75);foot(34,-34,4);GV('mausoleum-large',-36,36,PI*.8,{door:'closed'});foot(-36,36,5);NB+=2;
  GV('gibbet',5.8,34,0);foot(5.8,34,1.8);A('wl-signpost',-3.4,30,PI);foot(-3.4,30,.8);A('wl-signpost',3.4,-30,0);foot(3.4,-30,.8);
  for(const[x,z]of[[-2.6,38],[2.6,46],[2.6,-38],[-2.6,-46]]){GV('lamp',x,z,x<0?H90:-H90,{light:'green'});foot(x,z,.6);}
  GV('statue',22,-38,-.6,{wings:'no',wear:'cracked'});foot(22,-38,1.4);
  for(const[x,z,sz,s]of[[-14,-34,'large',1],[16,34,'large',2],[30,26,'small',3],[-22,30,'small',4],[40,-26,'large',5],[-44,24,'small',6],[26,-20,'small',7],[-16,40,'small',8],[44,32,'small',9],[-26,-28,'small',10],[12,-42,'small',11],[-40,-30,'large',12]]){
    if(blocked(x,z,1.6))continue;GV('tree-'+sz,x,z,rng()*6,{},s,heightAt(x,z));foot(x,z,sz==='large'?3:1.6);NT++;}
  scbScatter(K,36,k=>k<.3?'ud-thorns':k<.55?'wl-drygrass':k<.8?'wl-bones':'ud-shrooms');

  /* ---------- the townsfolk ---------- */
  for(const sd of[-1,1]){still(V_('male',11+sd,'guard'),sd*2.8,17.8,0,'Idle');still(V_('male',14+sd,'guard'),sd*2.8,-17.8,PI,'Idle');}
  tick.push(behPath(V_('male',17,'guard'),[[-.8,-17],[-.8,-9],[-11.2,-9],[-11.2,9],[-.8,9],[-.8,17],[.8,17],[.8,9],[11.2,9],[11.2,-9],[.8,-9],[.8,-17]],1,'Walk',{0:['Look around',4],6:['Look around',4]}));
  /* vendors beside their stalls */
  for(const[x,z,ry,s,j,f]of[[-3.6,-6.2,0,20,'farmer',1],[9.4,-6.2,0,21,'cook'],[-3.6,6.2,PI,22,'herbalist',1],[9.4,6.2,PI,23,'blacksmith'],[-8.6,-3,H90,24,'merchant'],[8.6,2.6,-H90,25,'cook',1]])still(V_(f?'female':'male',s,j),x,z,ry,'Idle');
  still(V_('female',26),-3.6,-3.6,-.5,'Talk');still(V_('male',27,'merchant'),-2.6,-4.6,PI-.6,'Talk',1.4);still(V_('female',28,'weaver'),5.4,3.2,-2.4,'Talk',.6);still(V_('female',29),4.6,4.2,2.6,'Talk',2);
  still(V_('male',30,'cook'),-13,-8.6,0,'Talk');still(V_('male',31,'miner'),-12.6,-7.4,-2.8,'Talk',1);still(V_('female',32,'healer'),13,-9.2,0,'Idle');
  work.push([still(V_('male',33,'blacksmith'),-9,10.4,-H90,'Hammering'),'Hammering']);
  tick.push(behPath(V_('female',34),[[1.6,20],[1.6,9],[11.2,9],[11.2,-9],[1.6,-9],[1.6,-20],[1.6,-9],[-11.2,-9],[-11.2,9],[1.6,9]],1.2,'Walk',{1:['Look around',3],5:['Idle',3],8:['Talk',4]}));
  tick.push(behPath(V_('male',35,'farmer'),[[-11.2,9],[-11.2,-9],[-1.6,-9],[-1.6,-17],[-1.6,-9]],1.1,'Walk',{3:['Look around',3]}));
  const kid=(s,girl)=>V_('child',s,null,{girl});for(let i=0;i<3;i++)tick.push(behCircle(kid(40+i,i===1),0,0,3.3,2.4,i*PI*.66));
  {const d=AN_(dogB(0,{coat:'#7a4a28'}));still(d,1.8,-4.4,.4,'Sit');}
  for(let i=0;i<5;i++){const c=AN_(buildAvian('crow',CROW.black));const b=[[-40,-30,-10,10],[30,44,-4,8],[-8,8,30,44],[-8,8,-44,-30],[20,40,-44,-30]][i];tick.push(behWander(c,b[0],b[1],b[2],b[3],.5,['Peck','Idle','Caw'],mulberry32(800+i),'Hop'));}
  return K.finish({buildings:NB,trees:NT});}
ASSETS.push({id:'sc-base-town',folder:'scenes',name:'Town base',kind:'scene',build:vxSceneBaseTown,groundR:-1,
  desc:'A 100 × 100 m base where the player can resupply: a market town inside 44 m square stone walls with four corner towers and stone gatehouses north and south, in the middle of undead country. Inside: the cobbled market square round the fountain with six stalls (produce, butcher, apothecary, armourer, wine and ale, roast stand), a fruit cart, benches, notice board, signpost and street lanterns; round it the tavern, the clinic, the smithy, two merchant\'s townhouses and two brick houses. 24 townsfolk: guards at the gates and on patrol, vendors at their stalls, the healer, the smith, shoppers and children by the fountain, and a dog. Outside: dark grass and grave soil, an old walled graveyard with a lychgate, mausoleum, mourner statue, an open grave, graves, headstones and tombs in the mist; black swamp pools, a crypt entrance, a grand mausoleum, a gibbet and ghostly green lamps on the path, gnarled trees, brambles, bones, toadstools and crows.'});

/* ======================= Outpost base (sc-base-outpost): Hell ======================= */
function vxSceneBaseOutpost(){const PI=Math.PI,H90=PI/2,B=18,RZ=32;
  const LAKE=(x,z)=>((x-37)/10.5)**2+((z+35)/9.5)**2+.12*Math.sin(x*.7+z*.3)+.08*Math.cos(z*.9-x*.4);
  const ROAD=scbRoad(B,['S'],[RZ]),TILES=ROAD.concat(Array.from({length:25},(_,i)=>['lriver',-48+i*4,RZ,H90]));
  const ridge=(x,z)=>{const f=-37+1.5*Math.sin(x*.21)+Math.cos(x*.47);if(z>f||x>22)return 0;return Math.min(9,Math.floor((f-z)*1.6))+(z<f-5?Math.round(Math.sin(x*.5)+Math.cos(z*.6)):0);};
  const K=scbFrame({seed:6262,B,exits:['S'],tiles:TILES,tile:k=>k[0]==='l'?hlLavaTile(k.slice(1)):hlRoadTile(k),surf:SC_HELL_SURF,
    height:(x,z)=>{if(x>25&&z<-22){const l=LAKE(x,z);if(l<1)return-.4;if(l<1.15)return-.1;}return ridge(x,z);},
    path:(x,z)=>Math.abs(x)<2&&z>-5&&'path',inner:(x,z)=>'grass',edge:(x,z)=>wlNoise(x*.5,z*.5)>.8?'hash':'grass',
    outer:(x,z,h)=>{if(h<=-.39)return wlNoise(x*.45,z*.45,1.3)>1.5?'hcrust':'hlava';if(h<0&&h>-.2)return'hcrust';if(h>=1)return'hbas';
      const n=wlNoise(x*.18,z*.18,1);if(n>2.25&&wlNoise(x*.7,z*.7)>0)return'hsulph';if(n<-2.1)return'hobs';if(wlNoise(x*.4+7,z*.4)>2.1)return'hcrust';return n>.2?'hash':'hbrim';}});
  const{root,A,F,put2,foot,blocked,heightAt,rng,V_,tool,AN_,still,tick,work}=K;let NB=0,NT=0;
  /* the terrain clones its materials: keep the lava sliding and everything glowing with the lighting */
  const lavaMaps=[];root.traverse(o=>{if(o.isMesh&&o.material.emissiveMap&&!GLOW.includes(o.material)){GLOW.push(o.material);if(o.material.map&&o.material.map.image===LAVATEX.image)lavaMaps.push(o.material.map);}});
  K.walls('stone','turret');
  /* ---------- the mission ---------- */
  A('po-chapel',0,-9);A('po-font',2.8,-4);A('po-alms',-2.8,-4);A('po-candles',-5,-4.5,.6);A('po-bell',-8,-12);A('po-hut',10.5,-10,-H90);NB+=2;
  A('po-tent',-10,-2,H90);A('po-tent',-10,5,H90,{},2);A('ac-kitchen',-9.5,12);NB+=2;
  A('vx-stall-9',5.5,-1,-H90);A('vx-stall-8',5.5,5,-H90);A('ac-supplies',12,13,-H90);NB+=2;
  A('po-altar',-13,-13);A('po-pews',-13,-9.4);A('po-lectern',-10.8,-12.4,-.5);A('po-herbs',11.5,1,-H90);A('po-bees',12,8.5,-H90);A('po-shrine',-4.5,14);A('po-banner',4.5,14.4);for(const[x,z,ry]of[[-14.6,14.6,0],[14.6,-14.6,PI],[-2.6,-15.6,0]])A('po-banner',x,z,ry);
  for(const[x,z]of[[-2.6,1],[2.6,7],[-2.6,12]])F(lStreetLantern,x,z,x<0?H90:-H90);
  /* ---------- outside: Hell ---------- */
  A('hl-cit-bridge',0,RZ,H90);for(const sd of[-1,1]){A('hl-soul-lantern',sd*3,RZ-3.6,sd>0?PI:0);foot(sd*3,RZ-3.6,.8);}
  for(const[x,z]of[[27,-40],[40,-23],[30,-26]]){A('hl-geyser',x,z,0,{},(x+z)&3||1,heightAt(x,z));foot(x,z,1.6);}foot(37,-35,11);
  A('hl-idol',-34,40,PI*.8);foot(-34,40,2.4);for(const[x,z]of[[-28,40],[-40,40]]){A('hl-pyre',x,z,0,{},(x+z)&3||1);foot(x,z,1.2);}
  A('hl-spikes',-15,27,0,{},2);foot(-15,27,1.2);A('hl-spikes',13,26,0,{},3);foot(13,26,1.2);A('hl-soul-cage',30,8,-H90);foot(30,8,1);A('hl-chain-post',-30,6,.4);foot(-30,6,1.4);
  for(const[x,z]of[[-30,-14],[32,-6],[-40,22],[38,22],[-24,26],[20,40],[-12,42],[40,44],[-44,-2],[26,-14],[-26,-26],[14,24]]){if(blocked(x,z,2.6))continue;const k=rng(),id=k<.2?'hl-spire':k<.4?'hl-basalt':k<.55?'hl-shards':k<.7?'hl-boulder':k<.85?'hl-vent':'hl-lava-pool';A(id,x,z,rng()*6,{},(x*3+z)&7||1,heightAt(x,z)>0?heightAt(x,z):0);foot(x,z,2.6);}
  for(const[x,z,sz,s]of[[-34,-8,'large',2],[26,18,'small',3],[-20,38,'large',4],[44,6,'small',5],[-44,12,'large',7],[16,44,'small',8],[34,30,'small',10]]){if(blocked(x,z,1.6))continue;A('hl-tree-'+sz,x,z,rng()*6,{},s);foot(x,z,sz==='large'?3:1.6);NT++;}
  for(const[x,z]of[[-26,14],[30,-18],[-10,26]]){if(blocked(x,z,1.6))continue;A('hl-bone-tree',x,z,rng()*6,{},(x+z)&7||1);foot(x,z,1.6);NT++;}
  scbScatter(K,36,k=>k<.3?'hl-lilies':k<.55?'hl-burning':k<.75?'hl-trophies':'hl-boulder');

  /* ---------- the mission folk ---------- */
  for(const sd of[-1,1])still(V_('male',11+sd,'guard'),sd*2.8,13.8,0,'Idle');
  tick.push(behPath(V_('male',14,'guard'),[[-1,12],[-1,-3],[1,-3],[1,12]],.9,'Walk',{1:['Look around',4],3:['Idle',3]}));
  still(V_('female',15,'healer'),-7.4,-2,H90,'Idle');still(V_('male',16,'healer'),-7.4,5,H90,'Talk');still(V_('male',17,'guard'),-6.2,5.6,-H90,'Talk',1);
  still(V_('male',18,'healer'),0,-4.2,0,'Idle');still(V_('female',19),-4.5,15.6,PI,'Idle');still(V_('male',25),-13.6,-9.2,PI,'Idle');still(V_('female',26),-12.4,-9.4,PI+.2,'Look around');
  still(V_('female',20,'herbalist'),3.2,-1,-H90,'Idle');still(V_('male',21,'blacksmith'),3.2,5,-H90,'Idle');
  still(V_('female',22,'herbalist'),9.6,1.2,H90,'Pick up');still(V_('female',23,'cook'),-8.3,12.8,-2.03,'Idle');still(V_('male',24,'merchant'),9.8,13,H90,'Talk');
  return K.finish({buildings:NB,trees:NT},()=>{hlLavaTick();const o=LAVATEX.offset;for(const m of lavaMaps)m.offset.copy(o);});}
ASSETS.push({id:'sc-base-outpost',folder:'scenes',name:'Outpost base',kind:'scene',build:vxSceneBaseOutpost,groundR:-1,
  desc:'A 100 × 100 m base where the player can resupply: the priest outpost, a patch of green holy ground inside 36 m square stone walls with corner turrets and a stone gatehouse to the south, in the middle of Hell. Inside: the wayside chapel with its font, alms box and votive candles, the bell frame, a field altar with pews and a lectern, the priest\'s hut, two healer\'s tents, a camp kitchen, an apothecary and an armourer\'s stall on the path, a supply dump, the herb garden and beehives, a shrine and holy banners. 15 healers, guards, traders and pilgrims. Outside: brimstone, ash, sulphur and obsidian ground; the obsidian road crosses a lava river on a bridge between soul lanterns; basalt cliffs to the north-west, a lava lake with fire geysers in the north-east, a demon idol between skull pyres, impaling spikes, a soul cage, spires, basalt columns, magma boulders, vents, charred and bone trees, fire lilies and burning ground.'});
