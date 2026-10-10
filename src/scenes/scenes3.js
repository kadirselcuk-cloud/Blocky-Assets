/* ======================= Mining village =======================
   Plan (x east, z south, 200 × 200 m, no palisade):
   - North: a mountain (z < -44, up to ~42 m). The mine and the quarry are cut into its face; a pine forest climbs the slopes.
     Mining lane (z -28): toolsmith, carpenter and clinic to the west; donkey shelter, two charcoal kilns, herb collector and stonemason to the east.
   - Centre: plaza with well and stalls; tavern, blacksmith, bakery. East road: forester, woodcutter, hunter at the pine forest (x > 58).
   - West: an irregular lake with the fishery and a smokehouse.
   - South: ten houses in fenced gardens (wooden fences for log houses, drystone for crofts), greens, coop, pig pen and four fields.
   50 people: 30 adults, 20 children.
*/
function vxSceneMining(){const root=new THREE.Group();root.userData.lights=[];root.userData.ground=-1;const rng=mulberry32(311),S=200,H90=Math.PI/2,PI=Math.PI;
  /* irregular lake: an ellipse whose radius wobbles with the angle */
  const LAKE=[-64.5,10,22,46],lakeD=(x,z)=>{const u=(x-LAKE[0])/LAKE[2],v=(z-LAKE[1])/LAKE[3],a=Math.atan2(v,u),f=1+.2*Math.sin(2*a+2.6)+.14*Math.sin(3*a+.4)+.09*Math.sin(5*a+2.1)+.05*Math.sin(9*a+1);return(u*u+v*v)/(f*f);};
  /* road tiles on a 4 m grid */
  const TILES=[],TL=(k,x,z,ry=0)=>TILES.push([k,x,z,ry]);
  for(let i=-1;i<=1;i++)for(let k=-1;k<=1;k++)TL('plaza',i*4,k*4);
  for(let z=-8;z>=-40;z-=4)TL(z===-28?'cross':'straight',0,z);
  for(let z=8;z<=84;z+=4)TL('straight',0,z);
  for(let x=-8;x>=-28;x-=4)TL('straight',x,0,H90);for(let x=8;x<=56;x+=4)TL('straight',x,0,H90);
  for(let x=4;x<=48;x+=4)TL(x===36?'t':'straight',x,-28,H90);for(let z=-32;z>=-40;z-=4)TL('straight',36,z);
  for(let x=-4;x>=-28;x-=4)TL('straight',x,-28,H90);
  const underTile=(x,z)=>TILES.some(t=>Math.abs(x-t[1])<2&&Math.abs(z-t[2])<2);
  /* mountain, with notches where the mine and the quarry are cut into it */
  const ridge=x=>Math.abs(x)<20?-44:-44+1.6*Math.sin(x*.09);
  const NOTCH=[[-6,6,-56.4],[28,44,-58.4]],notched=(x,z)=>z<-40&&NOTCH.some(([a,b,zb])=>x>a&&x<b&&z>zb);
  const mount=(x,z)=>{const z0=ridge(x);if(z>=z0||notched(x,z))return 0;const k=Math.min(1,(z0-z)/52);return 42*Math.pow(k,.7)+(Math.sin(x*.17)+Math.cos(x*.11+z*.23))*k*3;};
  const SUNK=[[-39.6,-31.2,-8,8]],sunk=(x,z)=>SUNK.some(r=>x>r[0]&&x<r[1]&&z>r[2]&&z<r[3]);
  const heightAt=(x,z)=>{if(underTile(x,z))return-.85;if(sunk(x,z))return-1;const ld=lakeD(x,z);if(ld<1&&z>ridge(x)-2)return Math.round((-1-(1-ld)*1.6)/.5)*.5;
    let h=mount(x,z);if(x>94)h=Math.max(h,(x-94)*.6);if(z>94)h=Math.max(h,(z-94)*.5);if(x<-94)h=Math.max(h,(-94-x)*.6);return Math.max(0,Math.round(h/.5)*.5);};
  const surfAt=(x,z,h)=>{const ld=lakeD(x,z);if(ld<1&&h<0)return'bed';if(ld<1.16&&h<=0)return'sand';if(h>14||(h>5&&Math.sin(x*1.7+z)*Math.cos(z*1.3)>-.1))return'rock';if(h>1.5&&Math.sin(x*.9)*Math.cos(z*1.1)>.55)return'rock';
    if(notched(x,z))return'dirt';return'grass';};
  sceneTerrain(root,S,2,heightAt,surfAt);vWaterSurface(root,60,106,-64,-.35,10,.8);
  const stat=new THREE.Group();root.add(stat);const foot=[];let NB=0,NH=0,NT=0;
  for(const[k,x,z,ry]of TILES){const t=k==='plaza'?SC_A('tr-plaza').build():k==='cross'?roadTile2('dirt','cross'):k==='t'?roadTile2('dirt','t'):roadTile('dirt',k==='corner');t.position.set(x,-T,z);t.rotation.y=ry;t.userData.isAsset=true;stat.add(t);}
  const put2=(obj,x,z,ry=0,y=0)=>{obj.position.set(x,y,z);obj.rotation.y=ry;obj.userData.isAsset=true;obj.traverse(q=>{if(q.isMesh){q.castShadow=true;q.receiveShadow=true;}});stat.add(obj);return obj;};
  const mk=(id,o={})=>{const a=SC_A(id);return a.build(a.defaultSeed??1,Object.assign((a.opts||[]).reduce((q,p)=>(q[p.key]=p.def,q),{}),o));};
  const A=(id,x,z,ry=0,o={},y=0,fp)=>{if(SC_BLD(id))NB++;if(SC_HOUSE(id))NH++;if(fp)foot.push([x-fp[0]/2,x+fp[0]/2,z-fp[1]/2,z+fp[1]/2]);const b=mk(id,o);NT+=pineSwap(b,Math.abs(x*7+z)|1);return put2(b,x,z,ry,y);};
  const hideWater=m=>m.traverse(q=>{if(q.isMesh&&(q.material===WATERMAT||q.material===vm('deepWater')))q.visible=false;});
  const FP=(x0,x1,z0,z1)=>foot.push([x0,x1,z0,z1]);
  const gy=(x,z,r)=>Math.min(heightAt(x,z),heightAt(x-r,z-r),heightAt(x+r,z-r),heightAt(x-r,z+r),heightAt(x+r,z+r));
  const toW=(x,z,ry,lx,lz)=>[x+lx*Math.cos(ry)+lz*Math.sin(ry),z-lx*Math.sin(ry)+lz*Math.cos(ry)];
  /* north: mine and quarry in the mountain face, the mining lane */
  A('vx-mine',0,-50,0,{},0,[12,17]);A('vx-quarry',36,-50,0,{},0,[16,16]);
  A('vx-toolsmith',-12,-37,0,{},0,[10,8.4]);A('vx-carpenter',-26,-37,0,{},0,[11.4,9.2]);A('vx-clinic',-24,-19,PI,{},0,[11,9.4]);
  A('vx-donkeyshelter',14,-36,0,{},0,[10,10]);A('vx-kiln',25,-37,0,{},0,[10,9]);A('vx-kiln',47,-37,0,{},0,[10,9]);
  A('vx-herbalist',10,-19,PI,{},0,[9,9.4]);A('vx-stonemason',24,-18,PI,{},0,[12,10]);
  /* centre */
  A('vx-well',4,4,0,{},0,[3,3]);A('vx-market',-4,-3.6,PI/4);A('vx-stall-4',-4,3.6,PI*.75);for(const[x,z,ry]of[[5.2,-1,H90],[1,5.4,0]])put2(iBench(),x,z,ry);
  A('vx-tavern',-20,-9,0,{},0,[12,10.4]);A('vx-blacksmith',-10,-18,H90,{},0,[9,10.4]);A('vx-bakery',14,-8,0,{},0,[11,8.4]);
  /* east road to the forest */
  A('vx-forester',30,-8,0,{},0,[11.6,8.8]);A('vx-cabin',44,-8,0,{},0,[8.8,8]);A('vx-hunter',50,9,PI,{},0,[10,8]);
  /* west: lake */
  const fs=A('vx-fishery',-38.6,0,H90,{},-.49,[16.8,16]);hideWater(fs);A('vx-smokehouse',-24,8,PI,{},0,[8,7]);
  /* ten houses in fenced gardens along the south street */
  const DOOR={log:LOGHOUSES.map(c=>c.ops.front.find(o=>o.type==='door').x),crf:CROFTS.map(c=>c.ops.front.find(o=>o.type==='door').x)};
  const CROPS=['cabbage','carrot','tomato','pumpkin','mixed'],GX=7,GB=-8.6,GF=6.6,LOTS=[];
  const lot=(type,n,x,z,ry,v)=>{const g=new THREE.Group(),stone=type==='crf';NB++;NH++;g.add(mk(`vx-${type}-${n}`));const dx=Math.max(-2,Math.min(2,DOOR[type][n-1]||0)),gw=stone?3.4:3.12,e=stone?.25:0;
    const F=(len,cx,cz,r)=>stone?fStone(g,len,cx,cz,r,v*7+Math.round(cx*3+cz)):fWood(g,len,cx,cz,r);
    F(2*GX+2*e,0,GB,0);for(const s of[-1,1])F(GF-GB-2*e,s*GX,(GB+GF)/2,H90);const l0=-GX-e,l1=dx-gw,r0=dx+gw,r1=GX+e;F(l1-l0,(l0+l1)/2,GF,0);F(r1-r0,(r0+r1)/2,GF,0);put(g,fGate(stone)(0,{state:0}),dx,0,GF);
    /* back garden: a vegetable patch on one side, a sitting or work corner on the other */
    const sd=v%2?1:-1;put(g,vxFarmField(v+3,{crop:CROPS[v%5],width:5.2,length:2.6,fence:0}),sd*3.3,0,-6.2);const ox=-sd;
    if(v%4===0){NT++;put(g,vxFruitTree(['apple','pear','cherry','plum'][v%4])(v+5,{size:'young'}),ox*3.8,0,-6.4);put(g,mk('it-c-barrel',{contents:'water'}),ox*5.9,0,-4.2);}
    else if(v%4===1){put(g,mk('it-u-table'),ox*3.6,0,-6,0,H90,0);put(g,mk('it-u-stool'),ox*2.6,0,-6);put(g,mk('it-u-stool'),ox*4.6,0,-6);put(g,mk('it-c-jug'),ox*5.8,0,-7.6);}
    else if(v%4===2){vWoodpile(g,8,4,ox*3.8,-7.7,0);put(g,mk('it-f-wheelbarrow'),ox*4.2,0,-5,0,.4,0);put(g,mk('it-c-basket',{contents:'carrots'}),ox*2.2,0,-4.4);}
    else{put(g,mk('it-f-bale'),ox*5.2,0,-7.4);put(g,mk('it-c-crate',{contents:'cabbages'}),ox*3.4,0,-7.5);put(g,mk('it-c-basket',{contents:'eggs'}),ox*4.2,0,-5);put(g,iBench(),ox*2.8,0,-5.2);}
    /* flowers and bushes along the sides and the front fence */
    put(g,vxFlowers(v*3+1),-sd*5.8,0,2.2);put(g,vxBushAsset(v%3?null:'woolRed')(v+9),sd*5.8,0,-.6);put(g,vxFlowers(v*5+2),sd*5.6,0,5.4);
    put2(g,x,z,ry);const c=[[-GX,GB],[GX,GB],[-GX,GF],[GX,GF]].map(([a,b])=>toW(x,z,ry,a,b));FP(Math.min(...c.map(p=>p[0])),Math.max(...c.map(p=>p[0])),Math.min(...c.map(p=>p[1])),Math.max(...c.map(p=>p[1])));LOTS.push({x,z,ry,sd});};
  [15,30,45,60,75].forEach((z,i)=>{lot('log',i+1,-9,z,H90,i*2);lot('crf',i+1,9,z,-H90,i*2+1);});
  /* greens, coop, pig pen and fields */
  FP(-28,-22,19,25);FP(19,25,17,23);
  A('vx-coop',-26,36,0,{},0,[6.4,6]);A('vx-pigpen',24,62,0,{},0,[10,9]);
  put2(vxFarmField(1,{crop:'wheat',width:18,length:12}),35,30);FP(25.4,44.6,23.4,36.6);put2(vxFarmField(2,{crop:'cabbage',width:14,length:10}),35,48);FP(27.4,42.6,42.4,53.6);
  put2(vxFarmField(3,{crop:'mixed',width:14,length:10}),-28,52);FP(-35.6,-20.4,46.4,57.6);put2(vxFarmField(4,{crop:'wheat',width:16,length:10}),-26,70);FP(-34.6,-17.4,64.4,75.6);
  /* lighting */
  for(const[x,z]of[[2.6,-12],[-2.6,-38],[2,22.5],[-2,37.5],[2,52.5],[-2,67.5],[-28.6,-2.6],[32,2.6],[24,-25.4],[-6.6,6.6]])A('it-l-streetlantern',x,z,x>0?-H90:H90);
  /* mining props: ore at the rock face, coal, carts, tools */
  for(const[x,z,k,s]of[[-10,-44.6,'iron',.8],[9,-44.4,'iron',.7],[-14,-45,'copper',.8],[20,-44.8,'tin',.7],[27,-45,'iron',.6],[46,-44.6,'copper',.6]]){const b=vxOreBoulder(k)(Math.abs(x*3)|1);b.scale.setScalar(s);put2(b,x,z,rng()*6,-.15);}
  for(const[x,z,k]of[[-4.6,-41.4,'copper'],[4.8,-41.2,'iron'],[-16,-24.6,'iron'],[29.6,-43,'tin']])put2(vxOreRocks(k)(Math.abs(x+z)|1),x,z,rng()*6);
  put2(vCart(new THREE.Group(),0,0,0,'sacks'),-33,-22,.2);A('it-f-wheelbarrow',3.6,-25.4,1.4);A('it-c-sacks',30.6,-31.4,.3);A('it-c-sack',20.4,-31.4,0,{contents:'coal'});A('it-c-barrel',-3.4,-24.6,0,{contents:'coal'});
  A('it-c-barrel',3.4,-23.4,0,{contents:'nails'});A('it-c-crate',-18.3,-31,.3,{contents:'closed'});A('it-c-barrels',-28,-3.2,0);A('it-c-cask',-12.4,-3.4,0);
  A('it-c-barrel',-29.4,4,0,{contents:'fish'});A('it-c-basket',11.4,-2.6,0,{contents:'bread'});A('it-c-basket',38,39.6,0,{contents:'carrots'});A('it-f-stook',46.2,27,0);A('it-f-stook',-36,72,.6);
  /* trees: pines only, spaced so the crowns never touch */
  const TREES=new Map(),tk=(x,z)=>Math.floor(x/6)+','+Math.floor(z/6);
  const fits=(x,z,r)=>{const i=Math.floor(x/6),k=Math.floor(z/6);for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++)for(const t of TREES.get((i+a)+','+(k+b))||[])if(Math.hypot(x-t[0],z-t[1])<r+t[2]+.3)return false;return true;};
  const CLEAR=[[78,30,9],[84,-26,7.5],[80,70,9],[72,-8,7.5],[66,48,7.5]];
  const TRAIL=[[58,4],[68,6],[74,16],[78,30],[70,42],[62,38],[58,20]];
  const nearTrail=(x,z)=>{for(let i=0;i<TRAIL.length;i++){const[a,b]=TRAIL[i],[c,d]=TRAIL[(i+1)%TRAIL.length],dx=c-a,dz=d-b,t=Math.max(0,Math.min(1,((x-a)*dx+(z-b)*dz)/(dx*dx+dz*dz)));if(Math.hypot(x-a-dx*t,z-b-dz*t)<2.4)return true;}return false;};
  const blocked=(x,z,m=1.5)=>underTile(x,z)||foot.some(f=>x>f[0]-m&&x<f[1]+m&&z>f[2]-m&&z<f[3]+m)||CLEAR.some(([cx,cz,r])=>Math.hypot(x-cx,z-cz)<r)||nearTrail(x,z);
  for(let gx=-98;gx<=98;gx+=2.6)for(let gz=-98;gz<=98;gz+=2.6){const x=gx+(rng()-.5)*2,z=gz+(rng()-.5)*2;if(Math.abs(x)>98||Math.abs(z)>98)continue;const h=heightAt(x,z),ld=lakeD(x,z);
    const mtn=z<ridge(x)-1,forest=x>58&&!mtn,west=x<-84||(x<-40&&z>58),p=forest?.9:mtn?(h<24?.45:h<34?.12:0):west?.5:ld<1.8?.1:.004;if(rng()>p)continue;
    const big=rng()<.65,r=big?2.7:1.8;if(ld<1.3||h<0||blocked(x,z,r+.4)||!fits(x,z,r))continue;const key=tk(x,z);(TREES.get(key)||TREES.set(key,[]).get(key)).push([x,z,r]);
    NT++;put2(vxTree('pine',big?'large':'small')(Math.floor(rng()*999)+1),x,z,rng()*6,mtn?gy(x,z,.5):h);}
  for(let n=0;n<34;n++){const x=(rng()-.5)*196,z=-50-rng()*46;if(blocked(x,z)||notched(x,z))continue;const b=vxLargeRock(['granite','granite','basalt','sandstone'][n%4])(n+3),sc=.7+rng()*.9;b.scale.setScalar(sc);put2(b,x,z,rng()*6,gy(x,z,1.3*sc)-.3);}
  for(let n=0;n<10;n++){const x=(rng()-.5)*120,z=-52-rng()*20;if(blocked(x,z)||notched(x,z))continue;const b=vxOreBoulder(['iron','copper','tin','gold'][n%4])(n+11),sc=.6+rng()*.5;b.scale.setScalar(sc);put2(b,x,z,rng()*6,gy(x,z,1.3*sc)-.3);}
  for(let n=0;n<40;n++){const a=n/40*PI*2;let r=1.1;let x,z;for(;r>.6;r-=.02){x=LAKE[0]+Math.cos(a)*LAKE[2]*r*1.25;z=LAKE[1]+Math.sin(a)*LAKE[3]*r*1.25;if(lakeD(x,z)<1.02)break;}
    if(n%3===0||blocked(x,z,.5)||z<ridge(x)+1||heightAt(x,z)>0)continue;const rd=vxReeds(n+1);hideWater(rd);put2(rd,x,z,rng()*6,-.1);}
  for(const[x,z,f]of[[58,-14,'fern'],[62,-20,'fern'],[64,26,'mush'],[66,14,'stump'],[62,58,'log'],[70,-14,'berry'],[57,30,'berry'],[-36,24,'bush'],[-34,-14,'flowers'],[-34,-26,'bush'],[40,-22,'stump'],[60,70,'fern'],[74,40,'mush'],[86,-20,'log'],[-14,20,'flowers'],[-16,46,'bush']]){
    if(blocked(x,z,.2))continue;const g=f==='bush'?vxBushAsset(null)(Math.abs(x*z)|1):f==='berry'?vxBushAsset('woolRed')(Math.abs(x+z)|1):f==='flowers'?vxFlowers(Math.abs(x*3+z)|1):f==='fern'?vxFern(Math.abs(x)|1):f==='mush'?vxMushrooms(3):f==='stump'?vxStump(2):vxFallenLog(4);put2(g,x,z,rng()*6,heightAt(x,z));}
  /* lights: always-on glows (forge, kilns, mine lamp, ovens) first, then building lanterns; 12 at most */
  const lights=[];stat.traverse(o=>{if(o.isPointLight)lights.push(o);});
  const rank=l=>l.userData.min>=.6?0:l.distance===7?1:2;lights.sort((a,b)=>rank(a)-rank(b));lights.forEach(l=>{if(rank(l)<2&&root.userData.lights.length<12)root.userData.lights.push(l);else l.parent.remove(l);});
  mergeStatic(stat);

  /* ---------- people: 30 adults, 20 children ---------- */
  const dynG=new THREE.Group();dynG.userData.dynamic=true;root.add(dynG);const ag=[],tick=[],work=[];
  const V_=(kind,seed,job,force)=>{const m=buildVillager(kind,seed,job,force||{});m.traverse(q=>{if(q.isMesh)q.castShadow=true;});dynG.add(m);const a=agentOf(m);ag.push(a);if(m.userData.occTool)giveTool(m,m.userData.occTool);return a;};
  const tool=(a,name)=>{const t=a.m.userData.toolObj;if(t)t.parent.remove(t);a.m.userData.occTool=name;giveTool(a.m,name);return a;};
  const still=(a,x,z,ry,clip,t,y=0)=>{a.m.position.set(x,y,z);a.m.rotation.y=ry;a.play(clip,0);if(a.cur)a.cur.time=t??rng()*3;if(clip==='Tool strike'||clip==='Hammering')work.push([a,clip]);return a;};
  const inLot=(i,lx,lz)=>{const L=LOTS[i];return toW(L.x,L.z,L.ry,lx*L.sd,lz);};
  // mine and quarry (7)
  still(V_('male',51,'miner'),-10,-42.4,PI,'Tool strike',.2);still(V_('male',52,'miner'),9,-42.2,PI,'Tool strike',.9);
  still(V_('male',53,'miner'),-1.6,-41.4,PI,'Pick up');
  tick.push(behPath(V_('male',55,'miner'),[[.6,-42],[.6,-28.6],[12,-28.6],[.6,-28.6],[.6,-8],[.6,-28.6]],1.2,'Walk',{2:['Pick up',3],4:['Talk',4]}));
  still(tool(V_('male',56,'miner'),'Sledgehammer'),30.2,-46.2,PI,'Tool strike',.5);still(tool(V_('male',57,'miner'),'Sledgehammer'),41.6,-45.8,PI,'Tool strike',1.3);
  still(V_('female',54,'miner'),4,-40.6,PI*.85,'Look around');
  // crafts along the mining lane (7)
  still(tool(V_('male',58),'Sledgehammer'),20.8,-25.4,PI,'Tool strike',.7);still(V_('male',60,'toolsmith'),-12,-30.6,PI,'Hammering',.4);
  still(V_('male',61,'woodcutter'),28.4,-31.2,-H90,'Tool strike',.3);still(V_('male',62,'woodcutter'),49.8,-31.4,PI*.8,'Pick up');
  still(tool(V_('male',80),'Axe'),-26,-30.4,PI,'Tool strike',1);still(V_('female',82,'healer'),-24,-25.4,PI,'Idle');
  tick.push(behPath(V_('female',77,'herbalist'),[[10,-26.6],[10,-28.6],[48,-28.6],[54,-24],[60,-18],[54,-24],[48,-28.6],[10,-28.6]],1.2,'Walk',{4:['Pick up',4],0:['Idle',3]}));
  // smith, wood, hunt, lake (7)
  still(V_('male',59,'blacksmith'),-6.6,-14.2,-H90,'Hammering');still(V_('male',63,'woodcutter'),37.4,-7,-H90,'Tool strike',1.1);
  tick.push(behPath(V_('male',65,'hunter'),TRAIL,1.15,'Walk',{3:['Look around',5],5:['Look around',4]}));still(V_('female',66,'hunter'),47,3.2,PI*.9,'Look around');
  still(V_('male',67,'fisher'),-43,1.8,-H90,'Idle',0,.13);still(V_('female',68,'fisher'),-21.6,3,0,'Pick up');
  still(V_('female',69,'baker'),13.4,-2.6,0,'Idle');
  // plaza and street (9)
  still(V_('female',70,'cook'),-20,-3,0,'Talk',.3);still(V_('male',71,'miner'),-18.8,-1.8,PI*.85,'Talk',1.5);
  still(V_('male',72,'merchant'),-5.2,-4.8,PI/4,'Talk');still(V_('female',73),-2.6,-2.2,-PI*.75,'Talk',1);
  still(V_('female',74),2.2,7.2,H90+.3,'Talk',.4);still(V_('female',75,'weaver'),4.4,7.6,-H90-.2,'Talk',1.8);
  tick.push(behPath(V_('female',76),[[-.6,6],[-.6,44],[-1.6,44.6],[-.6,45.2],[-.6,80],[-.6,6],[-14,.6],[-27,.6],[-14,.6]],1.3,'Walk',{2:['Talk',4],7:['Look around',3]}));
  tick.push(behPath(V_('male',78,'farmer'),[[27,25.6],[43,25.6],[43,28],[27,28],[27,30.4],[43,30.4],[43,32.8],[27,32.8]],.8));
  {const[x,z]=inLot(2,3.3,-6.2);still(V_('female',79,'farmer'),x,z,PI*.5,'Pick up');}
  // children (20)
  const kid=(s,girl)=>V_('child',s,null,{girl});
  for(const[cx,cz,b]of[[-25,22,83],[22,20,86]])for(let i=0;i<3;i++)tick.push(behCircle(kid(b+i,i===1),cx,cz,2.4,2.8,i*PI*.66));
  still(kid(89,true),-1.4,22.4,H90,'Jump');still(kid(90,false),1.4,22.8,-H90,'Wave');still(kid(91,false),-1.4,52.4,H90,'Wave',.6);still(kid(92,true),1.4,52.8,-H90,'Jump',.8);
  tick.push(behPath(kid(93,true),[[-1,10],[-1,70],[-1.5,70],[-1.5,10]],1.1));tick.push(behPath(kid(94,false),[[1,70],[1,10],[1.5,10],[1.5,70]],1.1));
  tick.push(behPath(kid(95,false),[[-8,-.8],[-26,-.8],[-26,-1.4],[-8,-1.4]],1.15));tick.push(behPath(kid(96,true),[[-26,.9],[-8,.9],[-8,1.5],[-26,1.5]],1.15));
  {let x=-30;while(x>-60&&lakeD(x,26)>1.06)x-=.25;still(kid(97,true),x+1.4,25.2,-H90,'Sit');still(kid(98,false),x+1.6,27,-H90-.3,'Sit',1.2);}
  still(kid(99,false),-3.4,-16,-H90+.3,'Look around');still(kid(100,true),-3.2,-12.6,-H90-.4,'Idle');
  {const[x,z]=inLot(5,2.2,-6.4);still(kid(101,true),x,z,PI,'Pick up',.7);const[x2,z2]=inLot(6,-4.4,-5.6);still(kid(102,false),x2,z2,.6,'Sit');}
  for(const[a]of work){a.mx.update(0);a.m.userData.post&&a.m.userData.post();}root.updateMatrixWorld(true);for(const[a,c]of work)workPiece(dynG,a.m,c);
  /* ---------- animals ---------- */
  const AN_=m=>{m.traverse(q=>{if(q.isMesh)q.castShadow=true;});dynG.add(m);const a=agentOf(m);ag.push(a);return a;};
  const herd=(n,mk,box,sp,idles,seed,walk)=>{for(let i=0;i<n;i++)tick.push(behWander(AN_(mk(i)),box[0],box[1],box[2],box[3],sp,idles,mulberry32(seed+i),walk));};
  // domestic
  herd(2,i=>donkeyB(0,{coat:['#8a8680','#5a5856'][i]}),[11.4,17,-34,-32.8],.3,['Idle','Graze','Shake head'],300);
  herd(4,i=>pigB(0,{coat:['pink','spotted','pink','black'][i],young:i===3}),[23,26.6,60.6,64],.4,['Root around','Idle','Lie down'],310);
  herd(4,i=>buildBird('hen',HEN[['brown','white','buff','speckled'][i]]),[-28.2,-23.8,36.8,38.2],.35,['Peck','Idle','Peck'],320);
  herd(1,()=>buildBird('rooster',ROOSTER.red),[-28.2,-23.8,36.8,38.2],.35,['Idle','Crow','Peck'],330);
  {const d=AN_(dogB(0,{coat:'#c8963e'}));tick.push(behPath(d,[[-.6,6],[-.6,44],[-1.6,44.6],[-.6,45.2],[-.6,80],[-.6,6],[-14,.6],[-27,.6],[-14,.6]],1.3));}
  {const d=AN_(dogB(0,{coat:'#26242a',ears:'flop'}));still(d,-3.6,-34,H90,'Lie down');}
  {const d=AN_(dogB(0,{coat:'#7a4a28'}));still(d,48.4,4,PI,'Sit');}
  // wildlife in the forest
  herd(3,i=>deerB(0,{coat:'#7a5236',sex:i?'doe':'stag'}),[74,82,26,34],.5,['Graze','Alert','Idle'],340);herd(1,()=>deerB(0,{coat:'#7a5236',young:true}),[75,81,27,33],.5,['Graze','Idle'],345);
  herd(2,()=>boarB(0,{}),[68,76,-12,-4],.45,['Root around','Idle'],350);herd(2,()=>boarB(0,{young:true}),[69,75,-11,-5],.4,['Root around','Idle'],355);
  herd(3,i=>wolfB(0,{coat:['#8a8884','#5a5856','#8a8884'][i]}),[80,88,-30,-22],.55,['Idle','Sniff','Howl','Lie down'],360);
  {const b=AN_(bearB(0,{}));tick.push(behWander(b,75,85,65,75,.4,['Sniff','Idle','Sit','Stand up'],mulberry32(370)));const c=AN_(bearB(0,{young:true}));tick.push(behWander(c,76,84,66,74,.4,['Sniff','Idle'],mulberry32(371)));}
  herd(4,i=>rabbitB(0,{coat:['#8a6a4a','#8a8884','#8a6a4a','#c8a878'][i]}),[62,70,44,52],.6,['Eat','Idle','Sit up'],380,'Hop');
  for(let i=0;i<5;i++){const d=AN_(buildAvian('duck',DUCK[['mallard','hen','mallard','white','hen'][i]]));tick.push(behWander(d,-72,-52,-15,35,.35,['Swim'],mulberry32(390+i),'Swim'));}
  for(let i=0;i<2;i++){const c=AN_(buildAvian('crow',CROW.black));tick.push(behWander(c,-32,-20,66,74,.5,['Peck','Idle','Caw'],mulberry32(400+i),'Hop'));}
  root.userData.tick=dt=>{for(const f of tick)f(dt);for(const a of ag){a.mx.update(dt);a.m.userData.post&&a.m.userData.post();}};
  for(const a of ag)if(a.m.userData.animal==='duck')a.m.position.y=-.32;
  for(const a of ag)compactRig(a.m);root.userData.tick(.01);sceneStats(root,{buildings:NB,houses:NH,trees:NT});return root;}
ASSETS.push({id:'sc-mining',folder:'scenes',name:'Mining village',kind:'scene',build:vxSceneMining,groundR:-1,
  desc:'A 200 × 200 m open mining village of 50 people (30 adults, 20 children). The mine and quarry are cut into the face of a pine-clad mountain to the north; a mining lane runs past the toolsmith, carpenter, clinic, donkey shelter, two charcoal kilns, herb collector and stonemason. Around the plaza (well, market stalls) stand the tavern, blacksmith and bakery; the east road leads past the forester, woodcutter and hunter into a pine forest with deer, boar, wolves, a bear and rabbits. An irregular lake to the west has a fishery and smokehouse. Ten houses line the south street, each in a garden fenced with wood (log houses) or drystone (crofts) and fitted with a vegetable patch, seating, firewood, fruit trees or flowers; then greens, a coop, a pig pen and four fields.'});
