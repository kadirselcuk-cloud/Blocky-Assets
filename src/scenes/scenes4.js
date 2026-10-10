/* ======================= Large fortified town =======================
   Plan (x east, z south, 300 × 300 m):
   - A river runs north–south at x ≈ 56; everything east of it is pine forest, with a woodsmen's hamlet (hunter, gatherer,
     herbalist, woodcutter, forester, charcoal kilns, log houses) in a clearing at the end of the bridge road, and wildlife deeper in.
   - The town stands on a raised plateau (3 m) inside a wooden palisade with corner and wall towers and three gates (west, south, east).
     Inside: a plaza with stalls and a well, town hall, church, barracks, mint, kitchen, tavern, bakery, tailor, weaver,
     the manor inside its own drystone enclosure, packed rows of merchant townhouses and brick houses, a boarding house.
   - Outside, more relaxed: cottages, school and clinic on the south road; five farmsteads with barns, granaries and fields;
     two windmills on mounds, orchards, stable, pens; sawmill and watermill on the river bank.
   - West: a sea shore with dock, shipyard, fishery, smokehouse, blacksmith, toolsmith and crofts.
   - North: a mountain with a quarry cut into it, stonemason and sheep fold below.
   120 people: 80 adults, 40 children.
*/
function vxSceneTown(){const root=new THREE.Group();root.userData.lights=[];root.userData.ground=-1;const rng=mulberry32(909),S=300,H=3,SW=12,H90=Math.PI/2,PI=Math.PI;
  const cl=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
  /* plateau under the town */
  const PX0=-72,PX1=20,PZ0=-62,PZ1=22,dOut=(x,z)=>Math.max(PX0-x,x-PX1,PZ0-z,z-PZ1,0),plat=(x,z)=>H*cl(1-dOut(x,z)/SW);
  /* river, sea, mountain, mounds */
  const RC=z=>{const w=Math.max(cl((-60-z)/30),cl((z-40)/30));return 56.5+w*(7*Math.sin(z*.025+.8)+3*Math.sin(z*.07));},RH=6;
  const SX=z=>{const w=cl((Math.abs(z+5)-55)/30);return-120+w*(7*Math.sin(z*.045+1)+4*Math.sin(z*.12));};
  const ridge=x=>-100+3*Math.sin(x*.05+1),NOTCH=[-38,-22,-116.4],notched=(x,z)=>z<-96&&x>NOTCH[0]&&x<NOTCH[1]&&z>NOTCH[2];
  const mount=(x,z)=>{const z0=ridge(x);if(z>=z0||notched(x,z))return 0;const k=Math.min(1,(z0-z)/50),f=cl((44-x)/12);return f*(42*Math.pow(k,.7)+(Math.sin(x*.17)+Math.cos(x*.11+z*.23))*k*3);};
  const MOUNDS=[[-100,57],[10,131]],mound=(x,z)=>{let h=0;for(const[mx,mz]of MOUNDS){const r=Math.hypot(x-mx,z-mz);h=Math.max(h,r<6.5?1.5:r<10?1.5*(10-r)/3.5:0);}return h;};
  const walkY=(x,z)=>plat(x,z);
  /* road tiles: [kind,x,z,ry,topY,tilt] */
  const TILES=[],TL=(k,x,z,ry=0,y=0,tilt=0)=>TILES.push([k,x,z,ry,y,tilt]),TB=new Map(),tb=(x,z)=>Math.floor(x/8)+','+Math.floor(z/8);
  // inside the walls (top at H)
  for(let i=-1;i<=1;i++)for(let k=-1;k<=1;k++)TL('plaza',-26+i*4,-20+k*4,0,H);
  for(let x=-70;x<=18;x+=4)if(x<-30||x>-22)TL('straight',x,-20,H90,H);
  for(let z=-12;z<=20;z+=4)TL(z===4?'cross':'straight',-26,z,0,H);
  for(let x=-66;x<=14;x+=4)if(x!==-26)TL('straight',x,4,H90,H);
  // ramps down the plateau
  const TA=Math.atan(H/SW);for(const d of[2,6,10]){const y=H*(1-d/SW);TL('ramp',PX1+d,-20,H90,y,TA);TL('ramp',PX0-d,-20,-H90,y,TA);TL('ramp',-26,PZ1+d,0,y,TA);}
  // outside roads (top at 0)
  for(let x=34;x<=46;x+=4)TL('straight',x,-20,H90);for(let x=66;x<=146;x+=4)TL('straight',x,-20,H90);
  for(let x=-86;x>=-106;x-=4)TL('straight',x,-20,H90);
  for(let z=36;z<=148;z+=4)TL(z===76?'cross':'straight',-26,z);for(let x=-110;x<=26;x+=4)if(x!==-26&&Math.abs(x+26)>0)TL(x===-110?'straight':'straight',x,76,H90);
  for(const t of TILES){const k=tb(t[1],t[2]);for(const a of[-1,0,1])for(const b of[-1,0,1]){const kk=(Math.floor(t[1]/8)+a)+','+(Math.floor(t[2]/8)+b);(TB.get(kk)||TB.set(kk,[]).get(kk)).push(t);}}
  const tileAt=(x,z)=>{const l=TB.get(tb(x,z));if(!l)return null;for(const t of l)if(Math.abs(x-t[1])<2&&Math.abs(z-t[2])<2)return t;return null;};
  /* footprints: sunk land of waterside buildings */
  const SUNK=[[-119.9,-110.3,-29,-10.5],[-120,-110.8,-6,14],[-119.8,-111.4,-50,-34]],sunk=(x,z)=>SUNK.some(r=>x>r[0]&&x<r[1]&&z>r[2]&&z<r[3]);
  const riverD=(x,z)=>Math.abs(x-RC(z))/RH;
  const heightAt=(x,z)=>{const t=tileAt(x,z);if(t)return t[4]-.85-(t[5]?.6:0);if(sunk(x,z))return-1;
    const sx=SX(z);if(x<sx)return Math.round((-1-Math.min(2,(sx-x)*.15))/.5)*.5;const rd=riverD(x,z);if(rd<1)return Math.round((-1-(1-rd)*1.6)/.5)*.5;
    let h=Math.max(plat(x,z),mount(x,z),mound(x,z));if(x>144)h=Math.max(h,(x-144)*.6);if(z>144)h=Math.max(h,(z-144)*.5);return Math.max(0,Math.round(h/.5)*.5);};
  const surfAt=(x,z,h)=>{if(h<0&&(x<SX(z)||riverD(x,z)<1))return'bed';if(h<=0&&(x<SX(z)+5||riverD(x,z)<1.2))return'sand';
    if(h>14||(h>5&&Math.sin(x*1.7+z)*Math.cos(z*1.3)>-.1&&z<-90))return'rock';if(notched(x,z))return'dirt';return'grass';};
  sceneTerrain(root,S,2,heightAt,surfAt);vWaterSurface(root,44,300,-128,-.35,0,.7);vWaterSurface(root,36,300,58,-.35,0,.7);
  const stat=new THREE.Group(),tileG=new THREE.Group();root.add(stat,tileG);const FOOT=[];let NB=0,NH=0,NT=0;
  for(const[k,x,z,ry,y,tilt]of TILES){const t=k==='plaza'?SC_A('tr-plaza').build():k==='cross'?roadTile2('dirt','cross'):k==='t'?roadTile2('dirt','t'):roadTile('dirt',false);
    if(tilt){t.rotation.set(tilt,ry,0,'YXZ');t.scale.z=1/Math.cos(tilt);const out=[Math.sin(ry),Math.cos(ry)];t.position.set(x-out[0]*T*Math.sin(tilt),y-T*Math.cos(tilt),z-out[1]*T*Math.sin(tilt));}
    else{t.position.set(x,y-T,z);t.rotation.y=ry;}t.userData.isAsset=true;tileG.add(t);}
  const shade=o=>o.traverse(q=>{if(q.isMesh){q.castShadow=true;q.receiveShadow=true;}});
  const put2=(obj,x,z,ry=0,y=0)=>{obj.position.set(x,y,z);obj.rotation.y=ry;obj.userData.isAsset=true;shade(obj);stat.add(obj);return obj;};
  const mk=(id,o={})=>{const a=SC_A(id);return a.build(a.defaultSeed??1,Object.assign((a.opts||[]).reduce((q,p)=>(q[p.key]=p.def,q),{}),o));};
  const fpOf=(obj,name)=>{obj.updateMatrixWorld(true);const b=new THREE.Box3();obj.traverse(q=>{if(q.isMesh&&!q.userData.noFrame&&q.visible){q.geometry.computeBoundingBox();b.union(q.geometry.boundingBox.clone().applyMatrix4(q.matrixWorld));}});FOOT.push([name,b.min.x,b.max.x,b.min.z,b.max.z]);};
  const A=(id,x,z,ry=0,o={},y=0)=>{if(SC_BLD(id))NB++;if(SC_HOUSE(id))NH++;const b=mk(id,o);NT+=pineSwap(b,Math.abs(x*7+z)|1);const m=put2(b,x,z,ry,y);fpOf(m,id);return m;};
  const AT=(id,x,z,ry=0,o={})=>A(id,x,z,ry,o,H);
  const hideWater=m=>m.traverse(q=>{if(q.isMesh&&(q.material===WATERMAT||q.material===vm('deepWater')))q.visible=false;});
  const toW=(x,z,ry,lx,lz)=>[x+lx*Math.cos(ry)+lz*Math.sin(ry),z-lx*Math.sin(ry)+lz*Math.cos(ry)];

  /* ---------- palisade, towers and gates ---------- */
  const WX0=-70,WX1=18,WZ0=-60,WZ1=20,GATES=[['W',-20],['E',-20],['S',-26]],TOWERS=[[WX0,WZ0],[WX1,WZ0],[WX0,WZ1],[WX1,WZ1],[-48,WZ0],[-4,WZ0],[WX0,-42],[WX1,-42]];
  const pal=new THREE.Group();pal.position.y=H;stat.add(pal);pal.userData.isAsset=true;
  const run=(a,b,fix,horiz,ry)=>{const len=b-a;if(len<.5)return;const n=Math.ceil(len/8);for(let i=0;i<n;i++){const c=a+(i+.5)*len/n;if(horiz)vPalisadeSeg(pal,len/n,c,fix,ry,i+7);else vPalisadeSeg(pal,len/n,fix,c,ry,i+11);}};
  const cuts=(side,lo,hi)=>{const c=[];for(const[x,z]of TOWERS){if((side==='N'&&z===WZ0)||(side==='S'&&z===WZ1))c.push([x-1.7,x+1.7]);if((side==='W'&&x===WX0)||(side==='E'&&x===WX1))c.push([z-1.7,z+1.7]);}
    for(const[s,p]of GATES)if(s===side)c.push([p-3.8,p+3.8]);c.sort((a,b)=>a[0]-b[0]);let cur=lo;const segs=[];for(const[a,b]of c){if(a>cur)segs.push([cur,a]);cur=Math.max(cur,b);}if(hi>cur)segs.push([cur,hi]);return segs;};
  for(const[a,b]of cuts('N',WX0,WX1))run(a,b,WZ0,true,PI);for(const[a,b]of cuts('S',WX0,WX1))run(a,b,WZ1,true,0);
  for(const[a,b]of cuts('W',WZ0,WZ1))run(a,b,WX0,false,-H90);for(const[a,b]of cuts('E',WZ0,WZ1))run(a,b,WX1,false,H90);shade(pal);FOOT.push(['wall',WX0,WX1,WZ0-.4,WZ0+1.45],['wall',WX0,WX1,WZ1-1.45,WZ1+.4],['wall',WX0-.4,WX0+1.45,WZ0,WZ1],['wall',WX1-1.45,WX1+.4,WZ0,WZ1]);
  for(const[x,z]of TOWERS)put2(mk('vx-woodtower'),x,z,z===WZ0?PI:x===WX0?-H90:x===WX1?H90:0,H);
  put2(mk('vx-woodgate',{state:1}),WX0,-20,-H90,H-.25);put2(mk('vx-woodgate',{state:1}),WX1,-20,H90,H-.25);put2(mk('vx-woodgate',{state:1}),-26,WZ1,0,H-.25);

  /* ---------- inside the walls ---------- */
  AT('vx-well',-21.6,-15.6);AT('vx-market',-30.2,-24.4,PI/4);AT('vx-stall-2',-30.2,-15.6,PI*.75);AT('vx-stall-3',-21.8,-24.4,-PI/4);
  AT('vx-townhall',-26,-34);AT('vx-church',-12,-42);AT('vx-barracks',6,-45);AT('vx-mint',6,-29);AT('vx-kitchen',-26,-50);
  // manor in a drystone enclosure
  {const E=[-67,-36,-57,-27],gx=-51.5,g=new THREE.Group();g.position.y=H;stat.add(g);g.userData.isAsset=true;
    fStone(g,E[1]-E[0]+.5,(E[0]+E[1])/2,E[2],0,3);for(const x of[E[0],E[1]])fStone(g,E[3]-E[2]-.5,x,(E[2]+E[3])/2,H90,x>-50?5:9);
    fStone(g,gx-3.4-E[0]+.25,(E[0]-.25+gx-3.4)/2,E[3],0,4);fStone(g,E[1]+.25-gx-3.4,(gx+3.4+E[1]+.25)/2,E[3],0,6);put(g,fGate(true)(0,{state:1}),gx,0,E[3]);shade(g);
    AT('vx-manor',gx,-46);for(const[x,z,k]of[[-63.5,-52,'apple'],[-63.5,-43,'pear'],[-63.5,-34,'cherry'],[-39.5,-52,'plum'],[-39.5,-43,'apple'],[-39.5,-34,'pear']]){NT++;put2(vxFruitTree(k)(Math.abs(x*z)|1,{size:'mature'}),x,z,rng()*6,H);}
    for(const[x,z]of[[-58,-30.5],[-45,-30.5]])put2(iBench(),x,z,0,H);for(const[x,z]of[[-55.5,-29.4],[-47.5,-29.4],[-61,-29.4],[-42,-29.4]])put2(vxFlowers(Math.abs(x)|1),x,z,0,H);FOOT.push(['manor-yard',E[0],E[1],E[2],E[3]]);}
  // rows of townhouses and brick houses
  for(const[i,x]of[-64,-55,-46,-37].entries()){AT('vx-twn-'+(i+1),x,-12.4,PI);AT(i?'vx-brk-'+i:'vx-twn-5',x,i?-2.6:-3.6,0);}
  AT('vx-tavern',-13,-11,PI);AT('vx-twn-1',-2.6,-12.4,PI);AT('vx-twn-2',5.8,-12.4,PI);
  AT('vx-bakery',-13.5,-3.4,0);AT('vx-tailor',-2,-3.2,0);AT('vx-weaver',9.2,-3.6,0);
  AT('vx-boarding',-62,12.8,PI);for(const[i,x]of[-51.2,-42.2,-33.2].entries())AT('vx-twn-'+(i+3),x,11.6,PI);
  {let x0=-23.6;for(const id of['vx-brk-4','vx-brk-5','vx-brk-1','vx-brk-2']){const tm=mk(id);pineSwap(tm,1);const b=new THREE.Box3().setFromObject(tm),cz=6.4+b.max.z;AT(id,x0+b.max.x,cz,PI);x0+=b.max.x-b.min.x+.4;}}
  // props inside
  for(const[x,z,id,o]of[[13.2,-16.6,'it-c-barrels'],[-8,-29,'it-c-cask'],[-36,-23.2,'it-c-crate',{contents:'apples'}],[-17,-23.6,'it-c-basket',{contents:'bread'}],[12.4,-25,'it-c-barrel',{contents:'water'}],[-34,-25.4,'it-c-sacks'],[14.2,-9,'it-u-bench']])A(id,x,z,rng()*.6,o||{},H);
  for(const[x,z]of[[-33,-22.6],[-19,-17.4],[-28.4,-6],[-23.6,8],[-50,-22.6],[0,-22.6],[-40,1.8],[4,6.6]])A('it-l-streetlantern',x,z,z<-20||x>-26?-H90:H90,{},H);

  /* ---------- outside: south road ---------- */
  A('vx-clinic',-34.3,46,H90);A('vx-school',-16,46,-H90);
  for(const[id,x,z,r]of[['vx-cot-1',-32.6,58,H90],['vx-cot-4',-19.4,58,-H90],['vx-cot-2',-32.6,90,H90],['vx-cot-5',-17.2,90,-H90],['vx-cot-3',-32.6,102,H90]])A(id,x,z,r);
  /* farmsteads: farmhouse, barn, field and sometimes a granary, all facing the farm lane */
  const farm=(n,x,z,ry,crop,gran)=>{const P=(id,lx,lz,r=0,o)=>{const[wx,wz]=toW(x,z,ry,lx,lz);return A(id,wx,wz,ry+r,o);};P('vx-farm'+(n===1?'house':'-'+n),0,0);P('vx-barn',-18.5,-2);
    const[fx,fz]=toW(x,z,ry,0,-18);const f=put2(vxFarmField(n+10,{crop,width:18,length:12}),fx,fz,ry);fpOf(f,'field');if(gran)P('vx-granary',-18,-17);return(lx,lz)=>toW(x,z,ry,lx,lz);};
  const FM=[farm(1,-62,63.6,0,'wheat',1),farm(2,-66,90.4,PI,'cabbage'),farm(5,-104,90.4,PI,'mixed',1),farm(3,18,64.6,0,'carrot'),farm(4,0,90.4,PI,'wheat',1)];
  A('vx-stable',40,98,H90);A('vx-windmill',-100,57,PI/4,{},1.5);A('vx-windmill',10,131,-PI/4,{},1.5);
  A('vx-orchard',-50,134,0,{size:'medium',trees:'apple'});A('vx-orchard',-92,134,0,{size:'medium',trees:'mixed'});A('vx-cowpen',30,134);A('vx-pigpen',-98,30);A('vx-coop',-100,44);
  for(const[x,z]of[[-23.6,40],[-28.4,64],[-23.6,84],[-28.4,108],[-40,78.4],[0,78.4]])A('it-l-streetlantern',x,z,x>-26?-H90:H90);
  A('it-f-haystack',-36,76.6-4,0);A('it-f-bales',8,84,.3);A('it-f-stook',-78,40,0);A('it-f-wheelbarrow',-55,80,1);put2(vCart(new THREE.Group(),0,0,0,'hay'),-96,82,.4);
  /* river bank: sawmill and watermill, bridge */
  A('vx-sawmill',42.2,-50);A('vx-watermill',43.4,10);A('it-c-barrels',38,-38,0);
  {const g=new THREE.Group(),L=17,y=.08;bx(g,L,.12,2.6,vm('planks'),0,y,0);bx(g,L,.1,.2,vm('planksDark'),0,y-.1,0);for(const s of[-1,1]){bx(g,L,.08,.1,vm('planksDark'),0,y+.75,s*1.25);for(let x=-L/2+.2;x<=L/2;x+=.9)bx(g,.1,.75,.1,vm('planksDark'),x,y+.38,s*1.25);}
    for(let x=-L/2+2;x<L/2-1;x+=2.6)for(const s of[-1,1])vlog(g,.26,2.6,.26,'y',x,y-1.3,s*1);put2(g,56,-20,0);FOOT.push(['bridge',47.5,64.5,-21.3,-18.7]);}
  /* west: shore, dock, shipyard, fishery, crafts and crofts */
  for(const[id,x,z]of[['vx-dock',-121.9,-20],['vx-shipyard',-118,4],['vx-fishery',-118.8,-42]]){const m=A(id,x,z,H90,id==='vx-dock'?{stock:3}:{},-.49);hideWater(m);}
  A('vx-crf-1',-92,-26.8);A('vx-smokehouse',-102,-26.5);A('vx-blacksmith',-93,-11.9,PI);A('vx-toolsmith',-104,-12.5,PI);
  A('vx-crf-2',-93,-40);A('vx-crf-3',-93,-52);A('vx-crf-4',-104,-46);A('vx-crf-5',-100,14);
  A('it-c-barrel',-106.6,-23,0,{contents:'fish'});A('it-l-streetlantern',-108,-22.6,-H90);A('it-l-streetlantern',-88,-17.4,H90);
  /* north: quarry, stonemason, sheep fold */
  A('vx-quarry',-30,-108);
  A('vx-stonemason',-30,-86,PI);A('vx-sheepfold',0,-88);
  /* forest side: woodsmen's hamlet along the bridge road */
  for(const[id,x,z,r]of[['vx-hunter',72,-27.2,0],['vx-gatherer',84,-26.7,0],['vx-forester',97,-27.4,0],['vx-log-1',109,-27,0],['vx-kiln',121,-27.5,0],['vx-log-5',132,-27,0],['vx-log-1',144,-27,0],
    ['vx-herbalist',72,-11.5,PI],['vx-cabin',84,-13.1,PI],['vx-log-2',96,-13,PI],['vx-log-3',108,-13,PI],['vx-log-4',120,-13,PI],['vx-kiln',133,-12.5,PI],['vx-log-2',145,-13,PI]])A(id,x,z,r);
  for(const[x,z]of[[78,-22.6],[114,-17.4],[138,-22.6]])A('it-l-streetlantern',x,z,z<-20?-H90:H90);

  /* ---------- trees: pine only, crowns never touch ---------- */
  const TRS=new Map(),tk=(x,z)=>Math.floor(x/6)+','+Math.floor(z/6);
  const fits=(x,z,r)=>{const i=Math.floor(x/6),k=Math.floor(z/6);for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++)for(const t of TRS.get((i+a)+','+(k+b))||[])if(Math.hypot(x-t[0],z-t[1])<r+t[2]+.3)return false;return true;};
  const CLEAR=[[100,40,9],[118,108,9],[126,-72,8],[98,-110,9],[90,76,7.5],[78,20,7],[124,60,13]];
  const TRAIL=[[70,-38],[82,-52],[100,-62],[114,-48],[104,-38]];
  const nearTrail=(x,z)=>{for(let i=0;i<TRAIL.length;i++){const[a,b]=TRAIL[i],[c,d]=TRAIL[(i+1)%TRAIL.length],dx=c-a,dz=d-b,t=cl(((x-a)*dx+(z-b)*dz)/(dx*dx+dz*dz));if(Math.hypot(x-a-dx*t,z-b-dz*t)<2.4)return true;}return false;};
  const FB=new Map();for(const f of FOOT)for(let i=Math.floor(f[1]/16);i<=Math.floor(f[2]/16);i++)for(let k=Math.floor(f[3]/16);k<=Math.floor(f[4]/16);k++){const kk=i+','+k;(FB.get(kk)||FB.set(kk,[]).get(kk)).push(f);}
  const inFoot=(x,z,m)=>{for(const f of FB.get(Math.floor(x/16)+','+Math.floor(z/16))||[])if(x>f[1]-m&&x<f[2]+m&&z>f[3]-m&&z<f[4]+m)return true;return false;};
  const blocked=(x,z,m=1.5)=>!!tileAt(x,z)||inFoot(x,z,m)||CLEAR.some(([cx,cz,r])=>Math.hypot(x-cx,z-cz)<r)||nearTrail(x,z)||(x>60&&x<150&&z>-38&&z<0)||dOut(x,z)<SW+2;
  const gy=(x,z,r)=>Math.min(heightAt(x,z),heightAt(x-r,z-r),heightAt(x+r,z-r),heightAt(x-r,z+r),heightAt(x+r,z+r));
  for(let gx=-148;gx<=148;gx+=2.6)for(let gz=-148;gz<=148;gz+=2.6){const x=gx+(rng()-.5)*2,z=gz+(rng()-.5)*2;if(Math.abs(x)>148||Math.abs(z)>148)continue;
    const forest=riverD(x,z)>1.35&&x>RC(z),mtn=z<ridge(x)-1&&x<44,h=heightAt(x,z),p=forest?.9:mtn?(h<24?.45:h<34?.12:0):x<SX(z)+14?.05:.012;if(rng()>p)continue;
    const big=rng()<.65,r=big?2.7:1.8;if(h<0||riverD(x,z)<1.4||x<SX(z)+6||blocked(x,z,r+.4)||!fits(x,z,r))continue;const kk=tk(x,z);(TRS.get(kk)||TRS.set(kk,[]).get(kk)).push([x,z,r]);
    NT++;put2(vxTree('pine',big?'large':'small')(Math.floor(rng()*999)+1),x,z,rng()*6,mtn?gy(x,z,.5):h);}
  for(let n=0;n<40;n++){const x=-150+rng()*190,z=-104-rng()*44;if(blocked(x,z)||notched(x,z))continue;const b=vxLargeRock(['granite','granite','basalt','sandstone'][n%4])(n+3),sc=.7+rng()*.9;b.scale.setScalar(sc);put2(b,x,z,rng()*6,gy(x,z,1.3*sc)-.3);}
  for(let n=0;n<40;n++){const z=-145+n*7.4,x=SX(z)+5+rng()*2;if(n%2||blocked(x,z,.5))continue;const rd=vxReeds(n+1);hideWater(rd);put2(rd,x,z,rng()*6,-.1);}
  for(let n=0;n<30;n++){const z=-140+n*9.6,x=RC(z)-RH-.6;if(n%3===1||blocked(x,z,.5))continue;const rd=vxReeds(n+51);hideWater(rd);put2(rd,x,z,rng()*6,-.1);}
  for(const[x,z,f]of[[66,-40,'fern'],[70,6,'berry'],[90,14,'mush'],[110,30,'stump'],[96,64,'log'],[130,20,'fern'],[80,-44,'berry'],[-70,30,'bush'],[-110,60,'flowers'],[-40,30,'bush'],[30,40,'flowers'],[-80,-80,'bush'],[20,-80,'flowers'],[-130,80,'bush']]){
    if(blocked(x,z,.2))continue;const g=f==='bush'?vxBushAsset(null)(Math.abs(x*z)|1):f==='berry'?vxBushAsset('woolRed')(Math.abs(x+z)|1):f==='flowers'?vxFlowers(Math.abs(x*3+z)|1):f==='fern'?vxFern(Math.abs(x)|1):f==='mush'?vxMushrooms(3):f==='stump'?vxStump(2):vxFallenLog(4);put2(g,x,z,rng()*6,heightAt(x,z));}
  /* lights: always-on glows first, then building lanterns; 12 at most */
  const lights=[];stat.traverse(o=>{if(o.isPointLight)lights.push(o);});
  const rank=l=>l.userData.min>=.6?0:l.distance===7?1:2;lights.sort((a,b)=>rank(a)-rank(b));lights.forEach(l=>{if(rank(l)<2&&root.userData.lights.length<12)root.userData.lights.push(l);else l.parent.remove(l);});
  root.userData._foot=FOOT;root.userData._tiles=TILES;mergeStatic(stat,128);mergeStatic(tileG,128);tileG.children.forEach(m=>m.castShadow=false);

  /* ---------- people: 80 adults, 40 children ---------- */
  const dynG=new THREE.Group();dynG.userData.dynamic=true;root.add(dynG);const ag=[],tick=[],work=[];
  const V_=(kind,seed,job,force)=>{const m=buildVillager(kind,seed,job,force||{});m.traverse(q=>{if(q.isMesh)q.castShadow=true;});dynG.add(m);const a=agentOf(m);ag.push(a);if(m.userData.occTool)giveTool(m,m.userData.occTool);return a;};
  const tool=(a,name)=>{const t=a.m.userData.toolObj;if(t)t.parent.remove(t);a.m.userData.occTool=name;giveTool(a.m,name);return a;};
  const still=(a,x,z,ry,clip,t,y)=>{a.m.position.set(x,y??walkY(x,z),z);if(y!=null)a.fixed=true;a.m.rotation.y=ry;a.play(clip,0);if(a.cur)a.cur.time=t??rng()*3;if(clip==='Tool strike'||clip==='Hammering')work.push([a,clip]);return a;};
  const walk=(a,pts,sp,clip,stops,y)=>{tick.push(behPath(a,pts,sp,clip||'Walk',stops||{}));if(y!=null){a.fixed=true;a.fy=y;}return a;};
  let sd=500;const M=(job,f)=>V_(f?'female':'male',sd++,job),K=girl=>V_('child',sd++,null,{girl});
  // gates and walls (10)
  for(const[x,z,r]of[[-66.6,-18.6,-H90],[-66.6,-21.4,-H90],[14.6,-18.6,H90],[14.6,-21.4,H90],[-27.4,17,0],[-24.6,17,0]])still(M('guard'),x,z,r,'Look around');
  walk(M('guard'),[[-46,-59.05],[-6,-59.05]],1,'Walk',{0:['Look around',4],1:['Look around',4]},H+2.35);walk(M('guard'),[[-69.05,-56],[-69.05,-24]],1,'Walk',{0:['Look around',4],1:['Look around',4]},H+2.35);
  still(M('archer'),WX1-.6,WZ0+.6,PI*.8,'Look around',0,H+6.1);still(M('archer'),WX0+.6,WZ1-.6,-.2,'Look around',0,H+6.1);
  // plaza, market, town hall, church, manor (17)
  for(const[x,z,r]of[[-28.6,-22.8,PI/4],[-28.6,-17.2,PI*.75],[-23.4,-22.8,-PI/4]])still(M('merchant'),x,z,r+PI,'Talk');
  for(const[x,z,r,f]of[[-27,-21.4,-PI*.75,1],[-27.2,-18.4,-PI/4,1],[-24.6,-21.6,PI*.75,0],[-22.4,-19,PI,1]])still(M(null,f),x,z,r,'Talk',rng()*2);
  still(M(null,1),-19.8,-15.2,-H90,'Talk',.3);still(M('weaver',1),-19.6,-17.4,PI*.4,'Talk',1.6);
  still(M('noble'),-26,-25.2,0,'Idle');still(M('merchant'),6,-22.6,0,'Idle');still(M('teacher'),-12,-29.4,0,'Idle');
  still(M('noble'),-48.4,-31.6,-H90,'Talk');still(M('noble',1),-50.6,-31.4,H90,'Talk',1.4);still(M('cook',1),-56,-33.4,PI,'Pick up');still(M('farmer'),-63.5,-40.6,PI,'Pick up',.8);
  still(M('guard'),3.4,-36.4,PI*.1,'Talk');still(M('guard'),4.8,-35,PI*1.1,'Talk',1.2);
  // crafts and walkers inside (10)
  still(M('baker',1),-13.5,2.4,0,'Idle');still(M('tailor',1),-2,2.2,0,'Idle');still(M('cook',1),-13,-18.2,PI,'Talk',.4);still(M('guard'),-11.6,-19.2,0,'Talk',1.1);
  walk(M(null,1),[[-64,-19.4],[-34,-19.4],[-18,-19.4],[12,-19.4],[-18,-20.6],[-34,-20.6]],1.3,'Walk',{3:['Look around',3]});
  walk(M('merchant'),[[-26.6,16],[-26.6,4.6],[-60,4.6],[-26.6,4.6],[10,4.6],[-25.4,4.6],[-25.4,-12]],1.25,'Walk',{2:['Talk',4],4:['Look around',3]});
  walk(M(null),[[12,-20.6],[-18,-20.6],[-20,-27],[-18,-20.6]],1.2,'Walk',{2:['Talk',4]});walk(M('miner'),[[30,-20.4],[16,-20.4],[-18,-20.4],[16,-20.4]],1.25,'Walk',{2:['Talk',3]});
  walk(M(null,1),[[-25.4,34],[-25.4,18],[-25.4,6],[-25.4,18]],1.1,'Walk',{2:['Pick up',3]});still(M('healer',1),-34.3+5.4,42.6,H90,'Idle');
  // south road, school, clinic (3)
  still(M(null),-28.9,48.6,-H90,'Sit',0);still(M('teacher',1),-22.8,44.4,-H90,'Talk');walk(M('farmer'),[[-26.6,40],[-26.6,140],[-26.6,76.6],[-60,76.6],[-26.6,76.6]],1.2,'Walk',{2:['Talk',4]});
  // west shore (9)
  still(M('blacksmith'),-93+3.4,-11.9+3.8-7.6,0,'Hammering');still(M('toolsmith'),-104,-18.6+.2,PI,'Hammering',.4);still(M('fisher',1),-102,-21.6,PI,'Pick up');
  still(M('fisher'),-123.2,-40.2,-H90,'Idle',0,-.49+.62);still(M(null),-113,-23.6,-H90,'Pick up');still(M(null,1),-113.4,-17.4,-H90,'Pick up',1);
  still(tool(M('woodcutter'),'Axe'),-113.6,6,-H90,'Tool strike',.4);still(M('merchant'),-111.2,-20.6,H90,'Talk');still(M('fisher'),-111.6,-38.4,-H90,'Look around');
  // river bank (3)
  still(M('woodcutter'),36,-44.4,H90,'Tool strike',.2);still(M('woodcutter'),37.4,-57,0,'Pick up');still(M('miller'),38.6,16.4,0,'Idle');
  // farms (14)
  FM.forEach((P,i)=>{const p=P(-4,-14.6);walk(M('farmer',i%2),[P(-8,-13),P(8,-13),P(8,-15.4),P(-8,-15.4),P(-8,-17.8),P(8,-17.8),P(8,-20.2),P(-8,-20.2)],.8);const q=P(3,-22.6);still(M('farmer',1-i%2),q[0],q[1],(i===1||i===2||i===4)?0:PI,'Pick up',i*.5);});
  still(M('miller'),-100+2,57+6.8,PI,'Look around',0,1.5);still(M('miller',1),10-2,131+6.8,PI,'Talk',0,1.5);
  still(M('farmer'),33.2,104,H90,'Idle');still(M('shepherd'),-2,-81.6,PI,'Look around');still(M('farmer',1),30,141.4,PI,'Idle');still(M('farmer',1),-98,35.6,PI,'Pick up');
  // quarry and mountain (3)
  still(tool(M('miner'),'Sledgehammer'),-35.8,-104.2,PI,'Tool strike',.5);still(tool(M('miner'),'Sledgehammer'),-24.4,-103.8,PI,'Tool strike',1.3);still(tool(M(null),'Sledgehammer'),-33.2,-79.4,0,'Tool strike',.8);
  // forest hamlet (8)
  walk(M('hunter'),TRAIL,1.15,'Walk',{2:['Look around',5],4:['Look around',4]});still(M('hunter',1),75,-21.8,0,'Look around');still(M('herbalist',1),72,-18.8,0,'Pick up');
  still(M(null,1),84,-21.6,PI,'Pick up');still(M('woodcutter'),88.6,-10,H90,'Tool strike',.6);walk(M('woodcutter'),[[66,-20.6],[146,-20.6],[146,-19.4],[66,-19.4]],1.1,'Walk',{1:['Look around',4]});
  still(M('woodcutter'),125.8,-22,-H90,'Pick up');still(M(null,1),108,-18.2,0,'Talk');
  // children (40)
  for(let i=0;i<3;i++)tick.push(behCircle(K(i===1),12.8,-13,2,2.6,i*PI*.66));
  walk(K(true),[[-60,3.4],[10,3.4],[10,2.8],[-60,2.8]],1.1);walk(K(false),[[10,5.2],[-60,5.2],[-60,5.8],[10,5.8]],1.1);walk(K(false),[[-50,4.6],[0,4.6]],1.6,'Run');walk(K(true),[[0,3.6],[-50,3.6]],1.6,'Run');
  for(let i=0;i<2;i++)tick.push(behCircle(K(i===0),-51.5,-29.8,1.4,2.2,i*PI));
  still(K(true),-24,-22,-PI*.75,'Idle');still(K(false),-27.8,-17.8,PI/4,'Jump');still(K(false),-24.6,15.6,0,'Wave');still(K(true),-27.6,15.4,0,'Look around');
  still(K(true),-27.2,-8,H90,'Jump');still(K(false),-24.8,-7.6,-H90,'Wave');still(K(false),-27.2,12,H90,'Wave',.6);still(K(true),-24.8,12.4,-H90,'Jump',.8);
  for(const[cx,cz]of[[-10,40],[-10,52]])for(let i=0;i<3;i++)tick.push(behCircle(K(i===1),cx,cz,2,2.6,i*PI*.66));
  still(K(true),RC(28)-RH-1.4,28,-H90,'Sit');still(K(false),RC(30)-RH-1.4,30,-H90,'Sit',1.2);
  still(K(false),-116.4,-13.4,-H90,'Sit',0,-.49+.85);still(K(true),-116.6,-14.8,-H90,'Sit',1,-.49+.85);
  FM.forEach((P,i)=>{const p=P(-5,-22.2);still(K(i%2===0),p[0],p[1],(i===1||i===2||i===4)?0:PI,'Pick up',.7+i*.3);});
  walk(K(true),[[-25.4,40],[-25.4,100],[-25,100],[-25,40]],1.1);walk(K(false),[[-26.8,100],[-26.8,40],[-27.2,40],[-27.2,100]],1.1);
  for(let i=0;i<3;i++)tick.push(behCircle(K(i===2),102,-22,1.8,2.4,i*PI*.66));
  still(K(true),SX(60)+3,60,-H90,'Jump');still(K(false),SX(62)+3.4,62,-H90,'Wave');still(K(false),-96,36.2,PI,'Idle');
  for(const[a]of work){a.mx.update(0);a.m.userData.post&&a.m.userData.post();}root.updateMatrixWorld(true);for(const[a,c]of work)workPiece(dynG,a.m,c);
  dynG.children.forEach(o=>{if(o.userData.traits)return;});
  /* ---------- animals ---------- */
  const AN_=m=>{m.traverse(q=>{if(q.isMesh)q.castShadow=true;});dynG.add(m);const a=agentOf(m);ag.push(a);return a;};
  const herd=(n,mk,box,sp,idles,seed,walk)=>{for(let i=0;i<n;i++)tick.push(behWander(AN_(mk(i)),box[0],box[1],box[2],box[3],sp,idles,mulberry32(seed+i),walk));};
  const stb=(lx,lz)=>toW(40,98,H90,lx,lz);{const a=stb(-10.5,-4.5),b=stb(-3,5);herd(4,i=>horseB(0,{coat:['#6e4a2e','#26242a','#a8784a','#e8e4dc'][i],pattern:['head','feet','spots','none'][i],young:i===3}),[Math.min(a[0],b[0]),Math.max(a[0],b[0]),Math.min(a[1],b[1]),Math.max(a[1],b[1])],.6,['Graze','Idle','Shake head'],600);}
  herd(6,i=>cowB(0,{coat:['#26242a','#7a4a2a','#26242a','#d8c8a8','#8a3a22','#26242a'][i],pattern:['patches','none','patches','face','patches','none'][i],young:i===5}),[25,34,131,138],.5,['Graze','Idle','Graze','Lie down'],610);
  herd(8,i=>sheepB(0,{coat:i===2?'#2a2826':i===5?'#7a5a3e':'#ece8dc',young:i===7}),[-3,3,-90,-86],.45,['Graze','Idle','Graze'],620);
  herd(5,i=>pigB(0,{coat:['pink','spotted','pink','black','pink'][i],young:i>2}),[-99,-95.4,29,32.4],.4,['Root around','Idle','Lie down'],630);
  herd(5,i=>buildBird('hen',HEN[['brown','white','buff','speckled','brown'][i]]),[-102.2,-97.8,44.8,46.2],.35,['Peck','Idle','Peck'],640);herd(1,()=>buildBird('rooster',ROOSTER.golden),[-102.2,-97.8,44.8,46.2],.35,['Idle','Crow','Peck'],645);
  herd(3,i=>buildBird('chick',CHICK[['yellow','yellow','brown'][i]]),[-102,-98,45,46],.3,['Peck','Idle'],648);
  herd(2,i=>donkeyB(0,{coat:['#8a8680','#5a5856'][i]}),[-84,-80,58,64],.3,['Idle','Graze'],650);
  {const d=AN_(dogB(0,{coat:'#c8963e'}));walk(d,[[-25.4,6],[-25.4,-12],[-34,-19.4],[-64,-19.4],[-34,-19.4]],1.3);}
  {const d=AN_(dogB(0,{coat:'#ece8dc'}));still(d,-1.2,-82.6,PI,'Sit');}{const d=AN_(dogB(0,{coat:'#26242a',ears:'flop'}));still(d,-90,-16.4,PI,'Lie down');}{const d=AN_(dogB(0,{coat:'#7a4a28'}));still(d,76.4,-21.4,0,'Sit');}
  // wildlife
  herd(4,i=>deerB(0,{coat:'#7a5236',sex:i?'doe':'stag',young:i===3}),[95,105,35,45],.5,['Graze','Alert','Idle'],700);herd(3,i=>deerB(0,{coat:'#8a4a2a',sex:i?'doe':'stag'}),[113,123,103,113],.5,['Graze','Alert','Idle'],705);
  herd(4,i=>boarB(0,{young:i>1}),[86,94,72,80],.45,['Root around','Idle'],710);
  herd(4,i=>wolfB(0,{coat:['#8a8884','#5a5856','#8a8884','#ece8dc'][i]}),[121,131,-77,-67],.55,['Idle','Sniff','Howl','Lie down'],720);
  {const b=AN_(bearB(0,{}));tick.push(behWander(b,93,103,-115,-105,.4,['Sniff','Idle','Sit','Stand up'],mulberry32(730)));const b2=AN_(bearB(0,{coat:'#3e2a1c'}));tick.push(behWander(b2,93,103,-115,-105,.4,['Sniff','Idle','Roar'],mulberry32(731)));const c=AN_(bearB(0,{young:true}));tick.push(behWander(c,94,102,-114,-106,.4,['Sniff','Idle'],mulberry32(732)));}
  herd(6,i=>rabbitB(0,{coat:['#8a6a4a','#8a8884','#8a6a4a','#c8a878','#8a6a4a','#ece8dc'][i]}),[74,82,16,24],.6,['Eat','Idle','Sit up'],740,'Hop');
  herd(4,i=>bisonB(0,{young:i===3}),[116,132,52,68],.45,['Graze','Idle'],750);
  for(let i=0;i<6;i++){const d=AN_(buildAvian('duck',DUCK[['mallard','hen','mallard','white','hen','mallard'][i]]));const box=i<3?[53,60,-58,-28]:[-146,-136,-40,40];tick.push(behWander(d,box[0],box[1],box[2],box[3],.35,['Swim'],mulberry32(760+i),'Swim'));d.fixed=true;d.fy=-.32;}
  for(let i=0;i<4;i++){const c=AN_(buildAvian('crow',CROW.black));const P=FM[i],a=P(-8,-12),b=P(8,-24);tick.push(behWander(c,Math.min(a[0],b[0]),Math.max(a[0],b[0]),Math.min(a[1],b[1]),Math.max(a[1],b[1]),.5,['Peck','Idle','Caw'],mulberry32(780+i),'Hop'));}
  root.userData.tick=dt=>{for(const f of tick)f(dt);for(const a of ag){if(a.fixed){if(a.fy!=null)a.m.position.y=a.fy;}else a.m.position.y=walkY(a.m.position.x,a.m.position.z);a.mx.update(dt);a.m.userData.post&&a.m.userData.post();}};
  for(const a of ag)compactRig(a.m);root.userData.tick(.01);sceneStats(root,{buildings:NB,houses:NH,trees:NT});return root;}
ASSETS.push({id:'sc-town',folder:'scenes',name:'Large fortified town',kind:'scene',build:vxSceneTown,groundR:-1,
  desc:'A 300 × 300 m fortified town of 120 people (80 adults, 40 children). On a raised plateau inside a wooden palisade with towers and three gates: a plaza with stalls and a well, town hall, church, barracks, mint, kitchen, tavern, bakery, tailor and weaver, the manor in its own drystone enclosure with an orchard garden, and packed rows of merchant townhouses, brick houses and a boarding house. Outside, more spread out: cottages, school and clinic on the south road, five farmsteads with barns, granaries and fields, two windmills on mounds, orchards, a stable, pens and a coop; a sawmill and watermill on the river, which divides the land from a pine forest with a woodsmen\'s hamlet (hunter, gatherer, herbalist, woodcutter, forester, charcoal kilns) and deer, boar, wolves, bears, bison and rabbits. A sea shore to the west with a dock, shipyard and fishery; a mountain to the north with a quarry. 40 houses in all.'});
