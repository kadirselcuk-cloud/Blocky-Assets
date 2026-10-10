/* ======================= phase 3: terrain tiles (4 × 4 m), roads, water ======================= */
VXD.clay=(P,r)=>{const m=mulberry32(5);for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,'#b4704e',nz(r,.88,1.06));for(let i=0;i<3;i++){let x=Math.floor(m()*16),y=Math.floor(m()*16);for(let k=0;k<6;k++){P(x&15,y&15,'#7a4430',1);x+=m()<.5?1:0;y+=m()<.5?1:-1;}}};
VXD.claySide=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,y%5===0?'#8a5236':'#a8664a',nz(r,.88,1.06));};
VXD.sandSide=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,y%6===2?'#b89c68':'#cdb27e',nz(r,.88,1.06));};
VXD.dirtRoad=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,r()<.07?'#9a9284':'#8a6a48',nz(r,.86,1.06));};
VXD.grassDirt=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,r()<.45?'#62903c':'#8a6a48',nz(r,.86,1.08));};
VXD.flagstone=(P,r)=>{const rows=[[0,6],[6,5],[11,5]];const tone=[];for(let i=0;i<9;i++)tone.push(nz(r,.86,1.06));for(let y=0;y<16;y++){const ri=y<6?0:y<11?1:2,ry=rows[ri],off=ri*5;for(let x=0;x<16;x++){const cx=(x+off)%16,ci=Math.floor(cx/6)%3,edge=y===ry[0]+ry[1]-1||cx%6===5;P(x,y,edge?'#6e6a62':'#a8a296',edge?1:tone[ri*3+ci]*nz(r,.95,1.03));}}};
VXD.riverbed=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,r()<.1?'#5a5a50':'#7a6a50',nz(r,.85,1.08));};
VXD.deepWater=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,'#1a3a44',nz(r,.9,1.08));};
/* cutout sprites: transparent background, crossed planes like voxel-game foliage */
const CUT={};
function cutTex(kind,draw){if(CUT[kind])return CUT[kind];const c=document.createElement('canvas');c.width=c.height=16;const g=c.getContext('2d'),r=mulberry32(hashStr('cut'+kind));draw((x,y,hex,f=1)=>{g.fillStyle=col(hex,f);g.fillRect(x,y,1,1);},r);
  const t=new THREE.CanvasTexture(c);t.magFilter=t.minFilter=THREE.NearestFilter;t.generateMipmaps=false;t.encoding=THREE.sRGBEncoding;return CUT[kind]=new THREE.MeshStandardMaterial({map:t,alphaTest:.5,side:THREE.DoubleSide,roughness:.95});}
const tallGrassMat=()=>cutTex('tall',(P,r)=>{for(let b=0;b<7;b++){const x0=1+b*2+Math.floor(r()*2),h=7+Math.floor(r()*9),lean=r()<.5?-1:1;for(let y=0;y<h;y++){const x=x0+Math.round(lean*y*y/80);if(x>=0&&x<16)P(x,15-y,['#4e7a30','#5e8a38','#6e9a40'][Math.floor(r()*3)],nz(r,.85,1.1));}}});
const shortGrassMat=()=>cutTex('short',(P,r)=>{for(let b=0;b<6;b++){const x0=2+b*2,h=3+Math.floor(r()*5);for(let y=0;y<h;y++)P(x0,15-y,'#5e8a38',nz(r,.85,1.1));}});
const flowerMat=c=>cutTex('flower'+c,(P,r)=>{for(let y=0;y<9;y++)P(8,15-y,'#4e7a30');P(7,10,'#4e7a30');P(9,12,'#4e7a30');for(const[dx,dy]of[[0,0],[1,0],[-1,0],[0,1],[0,-1]])P(8+dx,6+dy,dx||dy?c:'#e0c040');});
function vSprite(par,mat,x,y,z,s=.4,h=.4,ry=0){const g=new THREE.Group();put(par,g,x,y,z,0,ry,0);for(const a of[0,Math.PI/2]){const p=new THREE.Mesh(new THREE.PlaneGeometry(s,h),mat);p.position.y=h/2;p.rotation.y=a+Math.PI/4;p.castShadow=true;p.receiveShadow=true;g.add(p);}return g;}

/* tile body: 10 × 10 cells of 0.4 m, merged into row runs per material class */
const T=.8,TS=4,TC=.4;
function tileMats(){return{grass:{top:vm('grassTop'),side:vm('grassSide')},dirt:{top:vm('dirt'),side:vm('dirt')},sand:{top:vm('sand'),side:vm('sandSide')},clay:{top:vm('clay'),side:vm('claySide')},
  dirtRoad:{top:vm('dirtRoad'),side:vm('dirt'),h:T-.04},grassDirt:{top:vm('grassDirt'),side:vm('grassSide')},paved:{top:vm('flagstone'),side:vm('stoneBrick')},kerb:{top:vm('stoneBrick'),side:vm('stoneBrick'),h:T+.08},stone:{top:vm('cobble'),side:vm('cobble')}};}
function vTile(classify,deco){const root=new THREE.Group();root.userData.lights=[];const M=tileMats(),N=TS/TC;const cells=[];
  for(let k=0;k<N;k++){cells.push([]);for(let i=0;i<N;i++){const cx=-TS/2+TC/2+i*TC,cz=-TS/2+TC/2+k*TC;cells[k].push(classify(cx,cz));}}
  for(let k=0;k<N;k++){let i=0;while(i<N){const key=cells[k][i];let j=i+1;while(j<N&&cells[k][j]===key)j++;const m=M[key],h=m.h||T,w=(j-i)*TC;
    const b=box(w,h,TC,[m.side,m.side,m.top,vm('dirt'),m.side,m.side],{s:.8,ox:0,oy:0,oz:0});put(root,b,-TS/2+i*TC+w/2,h/2,-TS/2+TC/2+k*TC);i=j;}}
  if(deco)deco(root,(x,z)=>cells[Math.min(N-1,Math.max(0,Math.floor((z+TS/2)/TC)))][Math.min(N-1,Math.max(0,Math.floor((x+TS/2)/TC)))]);root.userData.ground=-1;return root;}
function grassDeco(n,tall){return(root,at)=>{const r=mulberry32(n*31+(tall?7:1));for(let i=0;i<n;i++){const x=(r()-.5)*3.7,z=(r()-.5)*3.7;if(at(x,z)!=='grass')continue;const k=r();
  if(tall&&k<.85)vSprite(root,tallGrassMat(),x,T,z,.5,.5+r()*.5,r()*3);else if(k<.9)vSprite(root,shortGrassMat(),x,T,z,.35,.3,r()*3);else vSprite(root,flowerMat(['#d84a3a','#f0d040','#e8e8f0','#6a7ad8'][Math.floor(r()*4)]),x,T,z,.35,.4,r()*3);}};}
function pebbles(root,mat,n,seed){const r=mulberry32(seed);for(let i=0;i<n;i++)bx(root,.08+r()*.08,.04,.08+r()*.08,mat,(r()-.5)*3.6,T+.02,(r()-.5)*3.6);}

/* road shapes: straight runs north–south; the corner turns from the south edge to the east edge */
const roadStraight=(x,z,w=1.2)=>Math.abs(x);
const roadCorner=(x,z)=>Math.hypot(x-2,z-2);
function roadTile(type,corner){const half=1.2,inner=corner?2-half:0,outer=corner?2+half:half,pos=(x,z)=>corner?roadCorner(x,z):roadStraight(x,z);
  return vTile((x,z)=>{const d=pos(x,z),inR=corner?(d>=inner&&d<=outer):(d<outer);
    if(type==='dirt'){if(inR)return'dirtRoad';const e=corner?(d>=inner-.4&&d<inner)||(d>outer&&d<=outer+.4):(d>=outer&&d<outer+.4);return e?'grassDirt':'grass';}
    if(type==='paved'){if(!inR)return'grass';const kerb=corner?(d<inner+.4||d>outer-.4):(d>=outer-.4);return kerb?'kerb':'paved';}
    return inR?'stone':'grass';},
    (root,at)=>{grassDeco(26,false)(root,at);if(type==='dirt'){const r=mulberry32(corner?9:4);for(let i=0;i<14;i++){const x=(r()-.5)*3.6,z=(r()-.5)*3.6;if(at(x,z)==='dirtRoad')bx(root,.1,.03,.1,vm('cobble'),x,T-.025,z);}}});}

/* realistic water: wave-animated surface with sky reflections, transparent volume, sandy bed */
const WATERMAT=new THREE.MeshStandardMaterial({color:new THREE.Color(0x174452).convertSRGBToLinear(),roughness:.07,metalness:.15,transparent:true,opacity:.9,envMapIntensity:1.1});WATERMAT.userData.env=true;
const VOLMAT=new THREE.MeshStandardMaterial({color:new THREE.Color(0x184a58).convertSRGBToLinear(),roughness:.2,transparent:true,opacity:.62,depthWrite:false});
function vWaterSurface(par,w,d,x,y,z,density=6){const geo=new THREE.PlaneGeometry(w,d,Math.max(4,Math.round(w*density)),Math.max(4,Math.round(d*density)));geo.rotateX(-Math.PI/2);
  const p=geo.attributes.position,base=new Float32Array(p.count*2);for(let i=0;i<p.count;i++){base[i*2]=p.getX(i)+x;base[i*2+1]=p.getZ(i)+z;}
  const m=new THREE.Mesh(geo,WATERMAT);m.position.set(x,y,z);m.receiveShadow=true;par.add(m);let last=0;
  m.onBeforeRender=()=>{const t=performance.now()/1000;if(t-last<1/40)return;last=t;for(let i=0;i<p.count;i++){const X=base[i*2],Z=base[i*2+1];
      p.setY(i,.035*Math.sin(X*1.3+t*1.1)+.025*Math.sin(Z*1.8-t*.8)+.012*Math.sin((X*2.2+Z*2.9)+t*2.3)+.006*Math.sin(X*6.1-Z*5.3+t*3.1));}p.needsUpdate=true;geo.computeVertexNormals();};
  return m;}
function waterTile(kind){const root=new THREE.Group();root.userData.lights=[];const M=tileMats(),wl=.68;
  const g=kind.startsWith('river')?.4:.8,sl=kind.startsWith('river')?.6:1.2;
  const height=(x,z)=>{if(kind==='open')return null;const d=kind==='shore'?x+2:kind==='corner'?Math.min(x+2,z+2):kind==='outer'?Math.hypot(x+2,z+2):kind==='river'?2-Math.abs(x):2-Math.abs(Math.hypot(x-2,z-2)-2);
    if(d<g)return T;if(d<g+sl)return T-.06-(d-g)/sl*.26;return null;};
  const N=TS/TC;for(let k=0;k<N;k++)for(let i=0;i<N;i++){const cx=-TS/2+TC/2+i*TC,cz=-TS/2+TC/2+k*TC,h=height(cx,cz);
    if(h==null){bx(root,TC,.2,TC,vm('riverbed'),cx,.1,cz);}else{const g=h>=T;const top=g?vm('grassTop'):vm('sand'),sd=g?vm('grassSide'):vm('sandSide');const b=box(TC,h,TC,[sd,sd,top,vm('dirt'),sd,sd],{s:.8,ox:0,oy:0,oz:0});put(root,b,cx,h/2,cz);}}
  const r=mulberry32(kind.length*13);for(let i=0;i<9;i++){const x=(r()-.5)*3.4,z=(r()-.5)*3.4;if(height(x,z)==null)bx(root,.14+r()*.14,.08,.14+r()*.1,vm(r()<.5?'cobble':'stone'),x,.22,z);}
  if(kind==='open'){const v=new THREE.Mesh(new THREE.BoxGeometry(TS,wl-.2,TS),VOLMAT);v.position.y=.2+(wl-.2)/2;root.add(v);}
  else if(kind==='shore'){const v=new THREE.Mesh(new THREE.BoxGeometry(TS-1.6,wl-.2,TS),VOLMAT);v.position.set(.8,.2+(wl-.2)/2,0);root.add(v);}
  vWaterSurface(root,TS,TS,0,wl,0,8);if(kind!=='open')grassDeco(18,true)(root,(x,z)=>height(x,z)>=T?'grass':'x');
  root.userData.ground=-1;root.userData.water=true;return root;}

/* upgrade the waterside buildings to the same water */
function vWaterArea(par,w,d,x,z){const u=box(w,.04,d,vm('deepWater'),{s:.8,ox:0,oy:0,oz:0});u.castShadow=false;u.userData.noFrame=true;put(par,u,x,.02,z);const s=vWaterSurface(par,w,d,x,.14,z,4);s.position.set(x,.14,z);s.userData.noFrame=true;return s;}

FOLDERS[''].children=['characters','buildings','items','terrain'];
FOLDERS['terrain']={name:'Terrain',blurb:'Ground tiles, roads and water, 4 × 4 m',children:[]};
[['tr-grass','Grass',()=>vTile(()=>'grass',grassDeco(30,false)),'Grass block with short tufts and a few wildflowers.'],
 ['tr-longgrass','Long grass',()=>vTile(()=>'grass',grassDeco(120,true)),'Grass block thick with tall grass that leans in different directions, and scattered flowers.'],
 ['tr-dirt','Dirt',()=>{const t=vTile(()=>'dirt');pebbles(t,vm('cobble'),18,3);return t;},'Bare earth with pebbles.'],
 ['tr-sand','Sand',()=>{const t=vTile(()=>'sand');pebbles(t,vm('woolWhite'),8,5);return t;},'Layered sand with a few shells.'],
 ['tr-clay','Clay',()=>vTile(()=>'clay'),'Red-brown clay with dry cracks and banded sides.'],
 ['tr-dirtroad','Dirt road',()=>roadTile('dirt',false),'Straight dirt road three blocks wide, worn grassy edges and loose stones.'],
 ['tr-dirtroad-c','Dirt road corner',()=>roadTile('dirt',true),'Curved quarter turn of the dirt road, south edge to east edge.'],
 ['tr-paved','Paved road',()=>roadTile('paved',false),'Straight road of flagstones with raised stone kerbs.'],
 ['tr-paved-c','Paved road corner',()=>roadTile('paved',true),'Curved quarter turn of the paved road with kerbs on both sides.'],
 ['tr-stone','Stone road',()=>roadTile('stone',false),'Straight cobblestone road.'],
 ['tr-stone-c','Stone road corner',()=>roadTile('stone',true),'Curved quarter turn of the cobblestone road.'],
 ['tr-water','Water',()=>waterTile('open'),'Open water: animated waves reflecting the sky, a tinted water volume and a stony sand bed.'],
 ['tr-shore','Shore',()=>waterTile('shore'),'Grass bank sloping down a sand beach into the water.'],
 ['tr-shore-c','Shore corner',()=>waterTile('corner'),'Inner corner of the shore: land on two sides, water in the bay.'],
].forEach(([id,name,build,desc])=>ASSETS.push({id,folder:'terrain',name,build,desc,groundR:-1}));
