/* ======================= Scene: infernal citadel (sc-hell), 100 × 100 m =======================
   Built from the hell kit. Grid lines on 4k + 2, cell centres on multiples of 4 (the road runs along x = 0).
   North: the citadel (lines x -18…18, z -42…-14) with the keep, the Devil Lord's throne, a summoning circle and the hellforge in the courtyard.
   A lava moat (river tiles along x, z -10…-6) with a bridge guarded by Cerberus; the obsidian road runs south from it with staggered branches.
   North-east: a lava lake with a basalt island where the Demon Prince waits. South-west: the demon temple round an infernal portal.
   South-east: the war pits. Badlands of brimstone, ash and sulphur all round, basalt cliffs along the north edge. */
const SC_HELL_SURF={hbrim:['hBrimTop','hBrim',1],hash:['hAsh','hAshSide',1],hcrust:['hCrustLit','hBrim',1],hsulph:['hSulph','hBrim',1],hobs:['hObsGloss','hBrim',1],hbas:['hBasaltTop','hBasalt',1],hlava:['hLavaLit','hBrim',1]};
function vxSceneHell(){const root=new THREE.Group();root.userData.lights=[];root.userData.ground=-1;const rng=mulberry32(6660),S=100,PI=Math.PI,H90=PI/2;
  /* tiles: [kind, x, z, ry] — kind 'r…' = road shape, 'l…' = lava shape */
  const TILES=[];for(let z=-4;z<=48;z+=4)TILES.push(['r'+(z===24||z===12?'t':'s'),0,z,z===12?PI:0]);TILES.push(['rs',0,-12,0]);
  for(let x=4;x<=24;x+=4)TILES.push(['rs',x,24,H90]);for(let x=-4;x>=-20;x-=4)TILES.push(['rs',x,12,H90]);
  for(let x=-48;x<=48;x+=4)TILES.push(['lriver',x,-8,H90]);
  const underTile=(x,z)=>TILES.some(t=>Math.abs(x-t[1])<2&&Math.abs(z-t[2])<2);
  const LAKE=(x,z)=>((x-37)/12.5)**2+((z+29)/13.5)**2+.12*Math.sin(x*.7+z*.3)+.08*Math.cos(z*.9-x*.4),ISLE=(x,z)=>((x-37)/5)**2+((z+29)/4.4)**2;
  const ridge=(x,z)=>{const foot=-46+1.5*Math.sin(x*.21)+Math.cos(x*.47);if(z>foot)return 0;return Math.min(10,Math.floor((foot-z)*1.6))+(z<foot-5?Math.round(Math.sin(x*.5)+Math.cos(z*.6)):0);};
  const heightAt=(x,z)=>{if(underTile(x,z))return-.85;if(x>23&&z<-15){if(ISLE(x,z)<1)return .5;const l=LAKE(x,z);if(l<1)return-.4;if(l<1.15)return-.1;}
    let h=ridge(x,z);const e=Math.max(Math.abs(x),z)-42;if(e>0)h=Math.max(h,Math.round((e*.6+Math.max(0,Math.sin(x*.3+z*.25))*e*.3)/.5)*.5);return h;};
  const surfAt=(x,z,h)=>{if(h<=-.39)return wlNoise(x*.45,z*.45,1.3)>1.5?'hcrust':'hlava';if(h<0&&h>-.2)return'hcrust';if(ISLE(x,z)<1.05&&x>23&&z<-15)return'hbas';if(h>=1)return'hbas';
    const n=wlNoise(x*.18,z*.18,1);if(x>-18&&x<18&&z>-42&&z<-14)return'hbrim';if(n>2.25&&wlNoise(x*.7,z*.7)>0)return'hsulph';if(n<-2.1)return'hobs';if(wlNoise(x*.4+7,z*.4)>2.1)return'hcrust';return n>.2?'hash':'hbrim';};
  sceneTerrain(root,S,2,heightAt,surfAt,SC_HELL_SURF);
  /* the terrain clones its materials: keep the lava sliding and everything glowing with the lighting */
  const lavaMaps=[];root.traverse(o=>{if(o.isMesh&&o.material.emissiveMap&&!GLOW.includes(o.material)){GLOW.push(o.material);if(o.material.map&&o.material.map.image===LAVATEX.image)lavaMaps.push(o.material.map);}});
  const stat=new THREE.Group();root.add(stat);const FOOT=[];
  const put2=(obj,x,z,ry=0,y=0)=>{obj.position.set(x,y,z);obj.rotation.y=ry;obj.userData.isAsset=true;stat.add(obj);return obj;};
  const A=(id,x,z,ry=0,o={},s,y=0)=>{const a=SC_A(id),m=a.build(s??a.defaultSeed??1,Object.assign((a.opts||[]).reduce((q,p)=>(q[p.key]=p.def,q),{}),o));m.traverse(q=>{if(q.isMesh){q.castShadow=!q.material.transparent;q.receiveShadow=true;}});return put2(m,x,z,ry,y);};
  const foot=(x,z,r)=>FOOT.push([x,z,r]),blocked=(x,z,r)=>FOOT.some(([fx,fz,fr])=>Math.hypot(x-fx,z-fz)<fr+r)||underTile(x,z);
  for(const[k,x,z,ry]of TILES){const t=k[0]==='r'?hlRoadTile(k.slice(1)):hlLavaTile(k.slice(1));t.position.set(x,-T,z);t.rotation.y=ry;t.userData.isAsset=true;stat.add(t);}
  let NB=0,NT=0;
  /* ---------- the citadel ---------- */
  const CW=(type,x,z,ry,o={},s)=>A('hl-cit-'+type,x,z,ry,o,s);
  [-16,-12,-8,-4,0,4,8,12,16].forEach((x,i)=>{const t=x===0?'gate':Math.abs(x)===4?'wall-lava':Math.abs(x)===8?'wall-spikes':Math.abs(x)===12?'wall-slit':'wall';CW(t,x,-14,0,x===0?{state:'open'}:{},i+1);});
  [-16,-12,-8,-4,0,4,8,12,16].forEach((x,i)=>CW(i%2?'wall-slit':'wall',x,-42,PI,{},i+11));
  [-40,-36,-32,-28,-24,-20,-16].forEach((z,i)=>{CW(z===-28?'wall-breach':i%2?'wall-slit':'wall',-18,z,-H90,{},i+21);CW(z===-24?'wall-door':i%3===1?'wall-slit':'wall',18,z,H90,{},i+31);});
  for(const[x,z]of[[-18,-14],[18,-14],[-18,-42],[18,-42]])CW('tower',x,z,0,{},Math.abs(x+z));for(const[x,z]of[[-18,-30],[18,-30],[-6,-42],[6,-42]])CW('pillar',x,z,0,{},Math.abs(x*z)|1);
  for(let x=-16;x<=16;x+=4)for(let z=-40;z<=-16;z+=4){const t=hcFloor();t.position.set(x,-T,z);t.userData.isAsset=true;stat.add(t);}
  CW('keep',0,-34,0,{door:'open'});CW('throne',0,-25,0,{size:'lord'});CW('stairs',-10,-14,0);
  for(const z of[-18,-21.5])for(const sd of[-1,1])CW('column',sd*3.2,z,0,{},z<-20?2:1);for(const sd of[-1,1]){CW('statue',sd*7.4,-19.5,-sd*.35,{},sd>0?2:1);CW('banner',sd*5.6,-27.5,sd>0?PI:0);}
  A('hl-tm-circle',-10.5,-34,0,{fire:'violet'});A('hl-tm-obelisk',-14.6,-38.4,0);A('hl-tm-obelisk',-6.4,-38.6,0,{},2);
  A('hl-forge',11.5,-35,0);A('hl-cauldron',8,-27.5,0);for(const[x,z]of[[13.6,-21.5],[15.4,-21.5]])A('hl-soul-cage',x,z,PI,{},x|0);A('hl-chain-frame',12,-18,PI);A('hl-crystal',-13.5,-23,0);A('hl-gong',-11,-18.6,0);
  for(const[x,z]of[[-14.5,-26],[-14.8,-30.6]])A('hl-trophies',x,z,rng()*6,{},x|0);NB+=6;foot(0,-28,19);
  /* ---------- outside the gate: moat, bridge, the road ---------- */
  A('hl-cit-bridge',0,-8,H90);for(const sd of[-1,1]){A('hl-brazier',sd*3,-4.2,0);A('hl-cit-banner',sd*3.4,-11.2,sd>0?PI:0);}foot(0,-4,3);
  for(const z of[4,16,28,40]){A('hl-soul-lantern',-2.6,z,0);A('hl-soul-lantern',2.6,z+6,PI);foot(-2.6,z,.6);foot(2.6,z+6,.6);}
  for(const[x,z]of[[-6,-2],[6,-2]]){A('hl-barrier',x,z,0,{},Math.abs(x));foot(x,z,2.4);}A('hl-spikes',-5,7,0,{},2);A('hl-spikes',5.5,18,0,{},3);foot(-5,7,1.2);foot(5.5,18,1.2);
  /* ---------- the demon temple (south-west) ---------- */
  A('hl-portal',-24,30,0,{fire:'orange'});foot(-24,30,4);for(const sd of[-1,1]){A('hl-tm-obelisk',-24+sd*5,29,0,{},sd>0?3:4);foot(-24+sd*5,29,1.4);}
  A('hl-tm-altar',-24,23.5,PI);foot(-24,23.5,2);A('hl-tm-soul-pit',-33,16,0);foot(-33,16,3.2);A('hl-tm-fountain',-14,18.5,0);foot(-14,18.5,2.6);A('hl-tm-faces',-33.5,25,0);foot(-33.5,25,1.4);foot(-34,8,4.5);foot(30,35,4);
  A('hl-idol',-14,30,-H90*.6);foot(-14,30,2.4);for(const[x,z]of[[-19,16.5],[-28,10],[-37,30]]){A('hl-rune-stone',x,z,rng()*6,{},(x*z)&7||1);foot(x,z,1);}A('hl-nest',-38,22,0);foot(-38,22,1.8);
  for(const[x,z]of[[-18,24],[-30,24],[-28,34],[-20,35]]){A('hl-pyre',x,z,0,{},(x+z)&3||1);foot(x,z,1.2);}NB+=3;
  /* ---------- the war pits (south-east) ---------- */
  for(const[x,z,ry]of[[14,32,0],[22,32,0],[10,36,H90],[26,36,H90]]){A('hl-cit-railing',x,z,ry);foot(x,z,2.2);}for(const[x,z]of[[18,30],[18,40]]){A('hl-chain-post',x,z,rng()*6,{},(x+z)&3||1);foot(x,z,1.4);}
  A('hl-idol',30,18,-H90,{},2);foot(30,18,2.4);A('hl-chain-frame',12,16,0,{},2);foot(12,16,2);A('hl-trophies',22,15.6,0,{},3);foot(22,15.6,1.4);A('hl-cauldron',27,28,0,{},2);foot(27,28,1.4);
  for(const[x,z]of[[34,40],[36,32]]){A('hl-soul-cage',x,z,-H90,{},x|0);foot(x,z,1);}A('hl-burning',30,10,0,{},2);foot(30,10,1.6);A('hl-forge',36,24,-H90,{},2);foot(36,24,3);NB+=2;
  /* ---------- the lava lake (north-east) ---------- */
  for(const[x,z]of[[27,-38],[46,-20],[26,-18],[45,-41]]){A('hl-geyser',x,z,0,{},(x+z)&3||1,Math.min(0,heightAt(x,z)));foot(x,z,1.6);}A('hl-spire',37.5,-31.5,0,{},4,.5);A('hl-shards',34.8,-26.5,0,{},2,.5);foot(37,-29,5);
  /* ---------- badlands ---------- */
  for(const[x,z]of[[-40,-30],[-28,-24],[-32,0],[40,2],[-44,8],[22,44],[-8,40],[42,44],[-44,40],[30,-2],[-24,-36],[10,4]]){if(blocked(x,z,2.6))continue;const k=rng(),id=k<.2?'hl-spire':k<.4?'hl-basalt':k<.55?'hl-shards':k<.7?'hl-boulder':k<.85?'hl-vent':'hl-lava-pool';A(id,x,z,rng()*6,{},(x*3+z)&7||1,heightAt(x,z)>0?heightAt(x,z):0);foot(x,z,2.6);}
  for(const[x,z,sz,s]of[[-30,-6,'large',2],[-42,-14,'small',3],[8,44,'large',4],[44,10,'small',5],[-10,46,'small',6],[-44,46,'large',7],[16,2,'small',8],[-36,-40,'large',9],[30,46,'small',10]]){if(blocked(x,z,1.6))continue;A('hl-tree-'+sz,x,z,rng()*6,{},s);foot(x,z,1.6);NT++;}
  for(const[x,z]of[[-10,4],[42,30],[-46,-2],[14,10]]){if(blocked(x,z,1.6))continue;A('hl-bone-tree',x,z,rng()*6,{},(x+z)&7||1);foot(x,z,1.6);NT++;}
  for(let i=0;i<34;i++){const x=(rng()-.5)*88,z=(rng()-.5)*84,y=heightAt(x,z);if(y!==0||blocked(x,z,1.2)||(x>-19&&x<19&&z>-43&&z<-13)||(x>22&&z<-12))continue;const k=rng();
    A(k<.25?'hl-lilies':k<.45?'hl-burning':k<.65?'hl-trophies':k<.8?'hl-spikes':'hl-boulder',x,z,rng()*6,{},i+1);foot(x,z,1.2);}
  /* lights: the keep fire, portal and circle first, then the others by priority; 12 at most */
  const lights=[];stat.traverse(o=>{if(o.isPointLight)lights.push(o);});lights.sort((a,b)=>(b.userData.min||0)-(a.userData.min||0)||b.distance-a.distance);lights.forEach(l=>{if(root.userData.lights.length<12)root.userData.lights.push(l);else l.parent.remove(l);});
  mergeStatic(stat,32);

  /* ---------- the host of Hell ---------- */
  const dynG=new THREE.Group();dynG.userData.dynamic=true;root.add(dynG);const ag=[],tick=[];
  const C=(id,seed,o={})=>{const a=SC_A(id),m=a.build(seed,Object.assign((a.opts||[]).reduce((q,p)=>(q[p.key]=p.def,q),{}),o));m.userData.enemy=true;m.traverse(q=>{if(q.isMesh)q.castShadow=true;});dynG.add(m);const A2=agentOf(m);ag.push(A2);return A2;};
  const still=(a,x,z,ry,clip,y=0)=>{a.m.position.set(x,y,z);a.m.rotation.y=ry;a.play(clip,0);if(a.cur)a.cur.time=rng()*3;return a;};
  const later=[];let planned=0;const D=(id,seed,o,fn)=>{planned++;later.push(()=>{const a=C(id,seed,o);fn(a);compactRig(a.m);});};
  // the citadel
  D('devil-lord',17,{},a=>still(a,-2.8,-24.4,.25,'Idle (war mode)'));
  for(const sd of[-1,1])D('fiend',20+sd,{},a=>still(a,sd*3.2,-11.6,0,'Idle (war mode)'));
  D('oni',4,{weapon:'kanabo'},a=>still(a,11.5,-31.6,PI,'Idle'));
  D('succubus',5,{},a=>still(a,-10.5,-29.4,PI,'Charm 3 (enthrall)'));
  D('imp',6,{},a=>tick.push(behWander(a,-14,14,-40,-17,1.6,['Fly','Taunt'],mulberry32(61),'Fly')));D('imp',7,{},a=>tick.push(behWander(a,-14,14,-40,-17,1.6,['Fly','Dodge back'],mulberry32(62),'Fly')));
  // the bridge and the road
  D('cerberus',8,{gear:'collar'},a=>still(a,0,-3.4,0,'Idle (war mode)'));
  D('hellhound',9,{},a=>still(a,4,-1.6,-.4,'Lie down'));D('hellhound',10,{},a=>tick.push(behPath(a,[[1.2,46],[1.2,0.6],[1.2,46]],1.3,'Walk',{1:['Sniff',4],2:['Howl',4]})));
  // the temple
  D('hell-mound',11,{},a=>tick.push(behWander(a,-38,-30,5,10.5,.6,['Idle','Wail','Writhe'],mulberry32(63),'Slide')));D('hell-mound',12,{},a=>tick.push(behWander(a,-38,-30,5,10.5,.6,['Idle','Writhe'],mulberry32(64),'Slide')));
  D('imp',13,{},a=>tick.push(behWander(a,-40,-10,14,38,1.6,['Fly','Taunt'],mulberry32(65),'Fly')));D('succubus',14,{},a=>still(a,-24,26.2,PI,'Charm 2 (beckon)'));
  // the war pits
  D('oni',15,{weapon:'spiked'},a=>still(a,18,35,-.6,'Taunt'));D('fiend',16,{},a=>still(a,18.4,37.2,PI-.5,'Idle (war mode)'));
  D('fiend',18,{},a=>tick.push(behPath(a,[[4,24.6],[24,24.6],[24,12],[4,12.6]],1.1,'Walk',{0:['Roar',3],2:['Idle (war mode)',4]})));D('hellhound',19,{},a=>tick.push(behWander(a,28,32,31,39,1,['Idle','Sniff','Sit'],mulberry32(66))));
  // the lava lake
  D('efreet',22,{},a=>tick.push(behCircle(a,37,-29,8.5,2.4,0,'Float')));D('demon-prince',23,{},a=>still(a,37,-27.2,-H90+.2,'Idle',.5));

  root.userData.tick=dt=>{hlLavaTick();const o=LAVATEX.offset;for(const m of lavaMaps)m.offset.copy(o);for(const f of tick)f(dt);for(const a of ag){a.mx.update(dt);a.m.userData.post&&a.m.userData.post();}};
  root.userData.tick(.01);sceneStats(root,{buildings:NB,trees:NT});root.userData.stats.enemies=(root.userData.stats.enemies||0)+planned;
  const step=()=>{if(!later.length)return;if(!root.parent&&root.userData.shown)return;later.shift()();setTimeout(step,60);};root.userData.shown=false;setTimeout(()=>{root.userData.shown=true;step();},400);
  return root;}
ASSETS.push({id:'sc-hell',folder:'scenes',name:'Infernal citadel',kind:'scene',build:vxSceneHell,groundR:-1,
  desc:'A 100 × 100 m corner of Hell built from the hell kit. In the north the infernal citadel: black basalt walls with fang merlons and glowing runes, lava spouting from demon heads, spiked walls, a breach, four horned towers and fire pillars, the gatehouse with its demon face, and the 22 m keep crowned with hellfire. In the courtyard the Devil Lord stands by his throne between fire columns and demon statues, a succubus works a summoning circle, an oni waits at the hellforge, imps flit about. A lava moat runs in front of the walls; two fiends guard the gate and Cerberus the bridge. The obsidian road runs south with soul lanterns, a hellhound patrolling it. South-west lies the demon temple round an infernal portal: altar, obelisks, idol, soul pit with hell mounds sliding round it, a lava fountain, the pillar of faces. South-east the war pits with oni, fiends and hellhounds. In the north-east a lava lake with fire geysers, where the efreet circles and the Demon Prince waits on a basalt island. Brimstone, ash, sulphur and obsidian badlands and basalt cliffs to the north.'});
