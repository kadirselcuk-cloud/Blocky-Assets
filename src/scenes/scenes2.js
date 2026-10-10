/* ======================= Farm scene, redesigned =======================
   Plan (x east, z south, 100 × 100 m):
   - North: wooded hill rising to ~8 m (z < -38). Woodcutter, forester and charcoal kiln work its edge; an orchard sits below it.
   - West: a lake (centre -34,14). A fishery and smokehouse on the east shore, a dock with a warehouse on the south shore.
   - Centre: a paved plaza with well and market stalls; the farmhouse, barn, granary, coop and communal oven pack in north of it.
   - South: the village street of houses and workshops (bakery, blacksmith, carpenter) behind drystone walls, leading to the stable and its paddock.
   - East: pig pen, cow pen and sheep fold beside the barn; a windmill on a mound; wheat, mixed and cabbage fields.
*/
function vxSceneFarm2(){const root=new THREE.Group();root.userData.lights=[];root.userData.ground=-1;const rng=mulberry32(77),S=100;
  const LAKE=[-34,14,16,24],lakeD=(x,z)=>((x-LAKE[0])/LAKE[2])**2+((z-LAKE[1])/LAKE[3])**2,MOUND=[42,-8];
  /* road tiles on a 4 m grid */
  const TILES=[],TL=(k,x,z,ry=0)=>TILES.push([k,x,z,ry]),H90=Math.PI/2;
  for(let i=-1;i<=1;i++)for(let k=-1;k<=1;k++)TL('plaza',i*4,k*4);
  for(let z=8;z<=48;z+=4)TL([16,28,40].includes(z)?'cross':'straight',0,z);
  for(let z=-8;z>=-28;z-=4)TL(z===-28?'cross':'straight',0,z);for(const x of[4,8,-4,-8])TL('straight',x,-28,H90);
  for(let x=8;x<=40;x+=4)TL(x===28?'t':'straight',x,0,H90);TL('straight',28,-4);TL('straight',28,-8);
  for(let x=-8;x>=-16;x-=4)TL('straight',x,0,H90);
  for(const z of[16,28])for(const x of[-4,4])TL('straight',x,z,H90);TL('straight',-4,40,H90);for(const x of[4,8,12,16])TL('straight',x,40,H90);
  const underTile=(x,z)=>TILES.some(t=>Math.abs(x-t[1])<2&&Math.abs(z-t[2])<2);
  const heightAt=(x,z)=>{if(underTile(x,z))return-.85;const ld=lakeD(x,z);if(ld<1)return Math.round((-1-(1-ld)*1.6)/.5)*.5;
    let h=0;if(z<-38){const k=(-38-z)/12;h=Math.pow(k,1.15)*8+(Math.sin(x*.21)+Math.cos(x*.13+z*.2))*k*1.2;}
    if(x<-44&&ld>1.4)h=Math.max(h,(-44-x)*.5);if(x>46)h=Math.max(h,(x-46)*.6);
    const mr=Math.hypot(x-MOUND[0],z-MOUND[1]);if(mr<5)h=Math.max(h,1.5);else if(mr<8)h=Math.max(h,1.5*(8-mr)/3);return Math.max(0,Math.round(h/.5)*.5);};
  const surfAt=(x,z,h)=>{const ld=lakeD(x,z);if(ld<1)return'bed';if(ld<1.25)return'sand';if(h>4&&Math.sin(x*1.7+z)*Math.cos(z*1.3)>.15)return'rock';return'grass';};
  sceneTerrain(root,S,2,heightAt,surfAt);vWaterSurface(root,LAKE[2]*2+2,LAKE[3]*2+2,LAKE[0],-.35,LAKE[1],1.2);
  const stat=new THREE.Group();root.add(stat);const foot=[];let NB=0,NH=0,NT=0;
  for(const[k,x,z,ry]of TILES){const t=k==='plaza'?SC_A('tr-plaza').build():k==='cross'?roadTile2('dirt','cross'):k==='t'?roadTile2('dirt','t'):roadTile('dirt',k==='corner');t.position.set(x,-T,z);t.rotation.y=ry;t.userData.isAsset=true;stat.add(t);}
  const put2=(obj,x,z,ry=0,y=0)=>{obj.position.set(x,y,z);obj.rotation.y=ry;obj.userData.isAsset=true;obj.traverse(q=>{if(q.isMesh){q.castShadow=true;q.receiveShadow=true;}});stat.add(obj);return obj;};
  const A=(id,x,z,ry=0,o={},y=0,fp)=>{const a=SC_A(id);if(SC_BLD(id))NB++;if(SC_HOUSE(id))NH++;const m=a.build(a.defaultSeed??1,Object.assign((a.opts||[]).reduce((q,p)=>(q[p.key]=p.def,q),{}),o));if(fp)foot.push([x-fp[0]/2,x+fp[0]/2,z-fp[1]/2,z+fp[1]/2]);return put2(m,x,z,ry,y);};
  const hideWater=m=>m.traverse(q=>{if(q.isMesh&&(q.material===WATERMAT||q.material===vm('deepWater')))q.visible=false;});
  /* centre: plaza, farmstead */
  A('vx-well',4,4,0,{},0,[3,3]);A('vx-market',-4,-3.6,Math.PI/4);A('vx-stall-3',-4,3.6,Math.PI*.75);for(const[x,z,ry]of[[5.2,-1,Math.PI/2],[1,5.4,0]])put2(iBench(),x,z,ry);
  A('vx-farmhouse',-11,-17,0,{},0,[14,14]);A('vx-barn',10,-21,0,{},0,[16,12]);A('vx-granary',-25,-18,Math.PI/2,{},0,[8,8]);A('vx-coop',-19,-27,0,{},0,[6,6]);A('vx-oven',6,-9.5,Math.PI,{},0,[6,6]);
  /* street: houses and workshops, drystone walls along the road */
  A('vx-bakery',-10.5,16,Math.PI/2,{},0,[9,12]);A('vx-cot-3',-10,28,Math.PI/2,{},0,[8,10]);A('vx-carpenter',-11,40,Math.PI/2,{},0,[10,12]);
  A('vx-blacksmith',11,16,-Math.PI/2,{},0,[10,11]);A('vx-brk-1',10,28,-Math.PI/2,{},0,[8,10]);
  for(const z of[10,22,34,46])for(const s of[-1,1]){if(s>0&&z===46)continue;const f=SC_A('fn-stone').build();put2(f,s*2.6,z,Math.PI/2);}
  /* west: lake shore */
  const fs=A('vx-fishery',-21,2,Math.PI/2,{},-.49,[8,16]);hideWater(fs);A('vx-smokehouse',-11.5,-6,Math.PI/2,{},0,[6,6]);
  const dk=A('vx-dock',-30,38,0,{stock:3},-.49,[18,12]);hideWater(dk);
  /* north: forest edge */
  A('vx-cabin',11,-33,0,{},0,[10,9]);A('vx-forester',-11,-33,0,{},0,[9,8]);A('vx-kiln',27,-33,0,{},0,[8,8]);A('vx-orchard',-31,-30,0,{size:'small',trees:'mixed'},0,[14,14]);
  /* east: pastures, windmill, fields, stable */
  A('vx-pigpen',14,-6,0,{},0,[8,7]);A('vx-cowpen',28,-14,0,{},0,[15,12]);A('vx-sheepfold',42,-25,0,{},0,[10,8]);A('vx-windmill',MOUND[0],MOUND[1],-Math.PI/4,{},1.5,[11,10]);
  put2(vxFarmField(1,{crop:'wheat',width:18,length:10}),32,10);foot.push([23,41,5,15]);put2(vxFarmField(2,{crop:'mixed',width:14,length:9}),27,22);foot.push([20,34,17,27]);put2(vxFarmField(3,{crop:'cabbage',width:10,length:7}),43,22);foot.push([38,48,18,26]);
  A('vx-stable',30,40,0,{},0,[26,16]);
  /* lighting */
  for(const[x,z]of[[2.6,8],[-2.6,20],[2.6,32],[-2.6,44],[6.6,6.6],[-6.6,-6.6],[2.6,-14],[-12,2.6],[12,2.6],[24,2.6],[2.6,-26]])A('it-l-streetlantern',x,z,x>0?-Math.PI/2:Math.PI/2);
  for(const[x,z]of[[-27,31.6],[-33,31.6]])A('it-l-standingtorch',x,z,0,{},-.49+.7+.06);
  /* props around the farmstead and street */
  A('it-f-haystack',20,-28,0);A('it-f-bales',-3,-23,.4);A('it-f-wheelbarrow',-3.4,-14,1.2);A('it-c-barrels',-4.2,12,0);A('it-c-sacks',39,-1,0);A('it-c-crate',-15.4,12,.3,{contents:'closed'});
  A('it-f-trough',18,-14,0);A('it-f-stook',36,4,0);A('it-f-stook',27,4,.5);A('it-c-basket',33,19,0,{contents:'cabbages'});A('it-f-straw',-14,-25.6,.2);A('it-u-bench',-6,26,Math.PI/2);A('it-u-bench',6,26,-Math.PI/2);
  A('it-c-barrel',-16.6,-3,0,{contents:'fish'});A('it-c-barrel',8,22,0,{contents:'water'});A('it-l-campfire',-20,-40.6,0,{},heightAt(-20,-40.6));A('it-c-cask',-6.6,9,Math.PI/2);put2(vCart(new THREE.Group(),0,0,0,'hay'),-27,-8.6,.3);put2(vCart(new THREE.Group(),0,0,0,'sacks'),36,-3.4,1.4);
  /* forest, lakeside and wild plants */
  const blocked=(x,z,m=1.5)=>underTile(x,z)||foot.some(f=>x>f[0]-m&&x<f[1]+m&&z>f[2]-m&&z<f[3]+m);
  const TK=[['pine','large'],['pine','large'],['pine','small'],['oak','large'],['birch','large'],['oak','small'],['birch','small']];
  for(let gx=-48;gx<=48;gx+=3.4)for(let gz=-48;gz<=48;gz+=3.4){const x=gx+(rng()-.5)*2.4,z=gz+(rng()-.5)*2.4,h=heightAt(x,z),ld=lakeD(x,z);if(ld<1.35||blocked(x,z,2))continue;
    const forest=z<-37||x<-45||x>45,lakeside=ld<2.2,p=forest?.8:lakeside?.12:.012;if(rng()>p)continue;const[k,s]=lakeside&&!forest?['birch',rng()<.5?'large':'small']:TK[Math.floor(rng()*TK.length)];NT++;put2(vxTree(k,s)(Math.floor(rng()*999)+1),x,z,rng()*6,h);}
  for(const[x,z,k]of[[-16,22,'apple'],[-16,34,'pear'],[16,22,'cherry'],[16,34,'plum'],[-20,-10,'apple'],[20,9,'pear']])NT++,put2(vxFruitTree(k)(Math.abs(x*7+z)|1,{size:'mature'}),x,z,rng()*6);
  for(let n=0;n<18;n++){const x=(rng()-.5)*96,z=-38-rng()*10;if(blocked(x,z))continue;const b=vxLargeRock(['granite','granite','basalt','sandstone'][n%4])(n+3);b.scale.setScalar(.5+rng()*.6);put2(b,x,z,rng()*6,heightAt(x,z)-.2);}
  {const b=vxOreBoulder('iron')(4);b.scale.setScalar(.7);put2(b,36,-41,0,heightAt(36,-41)-.2);const g=vxOreRocks('copper')(2);put2(g,-40,-40,0,heightAt(-40,-40));}
  for(let n=0;n<16;n++){const a=n/16*Math.PI*2,x=LAKE[0]+Math.cos(a)*LAKE[2]*1.03,z=LAKE[1]+Math.sin(a)*LAKE[3]*1.03;if(blocked(x,z,.5)||n%3===0)continue;const r=vxReeds(n+1);r.traverse(q=>{if(q.isMesh&&q.material===WATERMAT)q.visible=false;});put2(r,x,z,rng()*6,-.1);}
  for(const[x,z,f]of[[-16,10,'bush'],[15,10,'berry'],[-16,46,'flowers'],[6,46,'flowers'],[-3,-35,'fern'],[18,-36,'fern'],[-26,-36,'mush'],[30,-38,'stump'],[-6,-38,'log'],[46,8,'flowers'],[-40,-12,'bush'],[44,40,'berry'],[-14,-9,'flowers'],[22,-4,'bush']]){
    const g=f==='bush'?vxBushAsset(null)(Math.abs(x*z)|1):f==='berry'?vxBushAsset('woolRed')(Math.abs(x+z)|1):f==='flowers'?vxFlowers(Math.abs(x*3+z)|1):f==='fern'?vxFern(Math.abs(x)|1):f==='mush'?vxMushrooms(3):f==='stump'?vxStump(2):vxFallenLog(4);put2(g,x,z,rng()*6,heightAt(x,z));}
  /* lights: keep the street lanterns, torches and forge */
  const lights=[];stat.traverse(o=>{if(o.isPointLight)lights.push(o);});lights.forEach(l=>{if((l.distance===7||l.userData.min>=1.2)&&root.userData.lights.length<12)root.userData.lights.push(l);else l.parent.remove(l);});
  mergeStatic(stat);

  /* ---------- people ---------- */
  const dynG=new THREE.Group();dynG.userData.dynamic=true;root.add(dynG);const ag=[],tick=[];
  const V_=(kind,seed,job,force)=>{const m=buildVillager(kind,seed,job,force||{});m.traverse(q=>{if(q.isMesh)q.castShadow=true;});dynG.add(m);const a=agentOf(m);ag.push(a);if(m.userData.occTool)giveTool(m,m.userData.occTool);return a;};
  const still=(a,x,z,ry,clip,t,y=0)=>{a.m.position.set(x,y,z);a.m.rotation.y=ry;a.play(clip,0);if(a.cur)a.cur.time=t??rng()*3;};
  const smith=V_('male',4,'blacksmith');still(smith,7.6,12.2,Math.PI*.5,'Hammering');
  const wood=V_('male',7,'woodcutter');still(wood,5.2,-31.6,-Math.PI/2,'Tool strike');
  const carp=V_('male',30,'toolsmith');still(carp,-6.8,37.4,-Math.PI/2,'Hammering');
  const baker=V_('female',33,'baker');still(baker,-5.4,17.6,Math.PI/2,'Idle');
  const forester=V_('male',9);tick.push(behPath(forester,[[-18,-29.4],[2,-29.4],[20,-29.4],[2,-29.4]],1.2,'Walk',{2:['Look around',5],0:['Look around',4]}));
  const farmer=V_('male',11,'farmer');tick.push(behPath(farmer,[[24,7],[40,7],[40,9.4],[24,9.4],[24,11.8],[40,11.8],[40,14],[24,14]],.8));
  const pick=V_('female',5,'farmer');still(pick,24.6,21,.4,'Pick up');const pick2=V_('female',36,'farmer');still(pick2,42,21.4,-.6,'Pick up',1.2);
  const shep=V_('male',17,'shepherd');still(shep,42,-19.4,Math.PI,'Look around');
  const cowh=V_('male',19,'farmer');still(cowh,26,-8.4,Math.PI*.9,'Idle');
  const swine=V_('female',38,'farmer');still(swine,15.6,-2.6,Math.PI,'Pick up',.4);
  const miller=V_('male',13,'miller');still(miller,38.6,1.2,-2.4,'Talk');const millc=V_('male',41);still(millc,37.4,2.6,.6,'Talk',1.4);
  const fisher=V_('male',22,'fisher');still(fisher,-25.4,3.8,-Math.PI/2,'Idle',0,.13);
  const dockw=V_('male',25);still(dockw,-28,42.6,Math.PI,'Pick up');
  const merch=V_('male',21,'merchant');still(merch,-5.2,-4.8,Math.PI/4,'Talk');const cust=V_('female',15);still(cust,-2.6,-2.2,-Math.PI*.75,'Talk',1);
  const t1=V_('female',8);still(t1,2.2,7.2,Math.PI/2+.3,'Talk',.4);const t2=V_('female',12,'weaver');still(t2,4.4,7.6,-Math.PI/2-.2,'Talk',1.8);
  const w1=V_('female',19);tick.push(behPath(w1,[[.6,6],[.6,28],[5.6,28.6],[.6,29],[.6,40],[14,40.6],[.6,40],[.6,6],[-14,.6],[-14,-2],[-14,.6]],1.35,'Walk',{2:['Talk',4],5:['Look around',4],9:['Idle',3]}));
  const w2=V_('female',23,'herbalist');tick.push(behPath(w2,[[-.6,-6],[-.6,-27.4],[-7,-27.4],[-.6,-27.4],[-.6,-6],[27.4,-.6],[27.4,-8],[27.4,-.6]],1.3,'Walk',{2:['Pick up',3],6:['Look around',3]}));
  const guardian=V_('male',27,'hunter');tick.push(behPath(guardian,[[-8,-28.6],[-17,-29.4],[-20,-36.5],[-17,-29.4]],1.25,'Walk',{2:['Look around',5]}));
  // children
  const b1=V_('child',1,null,{girl:false}),g1=V_('child',4,null,{girl:true});tick.push(behCircle(b1,-.5,1,2.4,2.8,0));tick.push(behCircle(g1,-.5,1,2.4,2.8,Math.PI*.7));
  const g2=V_('child',6,null,{girl:true});still(g2,-5,27,Math.PI/2,'Jump');const b2=V_('child',3,null,{girl:false});still(b2,4.6,27.4,-Math.PI/2,'Wave');
  const g3=V_('child',9,null,{girl:true}),b3=V_('child',10,null,{girl:false});tick.push(behPath(g3,[[-1,14],[-1,30],[-5,30],[-5,15],[-1,14]],1.1));tick.push(behPath(b3,[[1,30],[1,14],[5,14],[5,29],[1,30]],1.1));
  const g4=V_('child',11,null,{girl:true});still(g4,-30,35,0,'Sit',0,.21);const b4=V_('child',14,null,{girl:false});still(b4,-18.2,-23.6,Math.PI*.95,'Pick up');
  [smith,wood,carp].forEach(a=>{a.mx.update(0);a.m.userData.post&&a.m.userData.post();});root.updateMatrixWorld(true);workPiece(dynG,wood.m,'Tool strike');workPiece(dynG,smith.m,'Hammering');workPiece(dynG,carp.m,'Hammering');
  /* ---------- animals ---------- */
  const AN_=m=>{m.traverse(q=>{if(q.isMesh)q.castShadow=true;});dynG.add(m);const a=agentOf(m);ag.push(a);return a;};
  const herd=(n,mk,box,sp,idles,seed,walk)=>{for(let i=0;i<n;i++)tick.push(behWander(AN_(mk(i)),box[0],box[1],box[2],box[3],sp,idles,mulberry32(seed+i),walk));};
  herd(5,i=>cowB(0,{coat:['#26242a','#7a4a2a','#26242a','#d8c8a8','#8a3a22'][i],pattern:['patches','none','patches','face','patches'][i],young:i===4}),[27,33,-17,-10.5],.5,['Graze','Idle','Graze','Lie down'],100);
  herd(4,i=>pigB(0,{coat:['pink','spotted','pink','black'][i],young:i===3}),[13,16.6,-7.4,-4],.4,['Root around','Idle','Lie down'],110);
  herd(6,i=>sheepB(0,{coat:i===2?'#2a2826':i===4?'#7a5a3e':'#ece8dc',young:i===5}),[38,46,-25,-21],.45,['Graze','Idle','Graze'],120);
  herd(3,i=>horseB(0,{coat:['#6e4a2e','#26242a','#a8784a'][i],pattern:['head','feet','spots'][i],young:i===2}),[19.5,27,35.5,45],.6,['Graze','Idle','Shake head'],130);
  herd(4,i=>buildBird('hen',HEN[['brown','white','buff','speckled'][i]]),[-21.2,-16.8,-26.2,-24.8],.35,['Peck','Idle','Peck'],140);
  herd(1,()=>buildBird('rooster',ROOSTER.golden),[-21.2,-16.8,-26.2,-24.8],.35,['Idle','Crow','Peck'],150);
  herd(3,i=>buildBird('chick',CHICK[['yellow','yellow','brown'][i]]),[-21,-17,-26,-25],.3,['Peck','Idle'],160);
  herd(2,i=>deerB(0,{coat:'#7a5236',sex:i?'doe':'stag'}),[-23,-17,-37.6,-35],.5,['Graze','Alert','Idle'],170);
  herd(2,i=>rabbitB(0,{coat:['#8a6a4a','#8a8884'][i]}),[17,23,-37.4,-34],.6,['Eat','Idle','Sit up'],180,'Hop');
  {const d=AN_(dogB(0,{coat:'#c8963e'}));tick.push(behPath(d,[[-.6,6],[-.6,28],[4.6,27.6],[-.6,28.6],[-.6,40],[13,39.6],[-.6,40],[-.6,6],[-14,-.6],[-14,-2],[-14,-.6]],1.35));}
  {const d=AN_(dogB(0,{coat:'#26242a',ears:'flop'}));still(d,-8,-10.2,0,'Lie down');}
  {const d=AN_(dogB(0,{coat:'#ece8dc'}));still(d,40.4,-19.6,Math.PI*.9,'Sit');}
  for(let i=0;i<4;i++){const d=AN_(buildAvian('duck',DUCK[['mallard','hen','mallard','white'][i]]));tick.push(behWander(d,-44,-28,0,28,.35,['Swim'],mulberry32(190+i),'Swim'));d.m.position.y=-.32;}
  for(let i=0;i<2;i++){const c=AN_(buildAvian('crow',CROW.black));tick.push(behWander(c,24,40,6,14,.5,['Peck','Idle','Caw'],mulberry32(200+i),'Hop'));}
  root.userData.tick=dt=>{for(const f of tick)f(dt);for(const a of ag){a.mx.update(dt);a.m.userData.post&&a.m.userData.post();}};
  for(const a of ag)if(a.m.userData.animal==='duck')a.m.position.y=-.32;
  for(const a of ag)compactRig(a.m);root.userData.tick(.01);sceneStats(root,{buildings:NB,houses:NH,trees:NT});return root;}
{const a=ASSETS.find(x=>x.id==='sc-farm');a.build=vxSceneFarm2;a.name='Farm by the lake';
 a.desc='Redesigned 100 × 100 m farm: a wooded hill to the north with a woodcutter, forester, charcoal kiln and orchard at its edge; a lake to the west with a fishery, smokehouse and dock; a packed farmstead around a paved plaza (farmhouse, barn, granary, coop, communal oven, well, market stalls); a village street of houses, bakery, blacksmith and carpenter behind drystone walls; and to the east pig, cow and sheep pens, a windmill on a mound, three fields and a stable with its paddock. 28 people at work, play and on the move, with cattle, pigs, sheep, horses, poultry, dogs, deer, rabbits, ducks and crows.';}
