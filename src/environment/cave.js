/* ======================= WASTELAND KIT: caves (wl-cave-) =======================
   Interior pieces build rooms on the 4 m grid, 6 m high:
   - Cave wall: 4 m long, centred on the grid line; the rock face (towards +z, the room side) bulges up to 0.8 m into the cell, the flat back is 1 m behind the line. The two end columns are always 0.3 m deep, so neighbouring walls line up.
   - Corners (inner and outer) go on the grid vertices. The ceiling slab (6–6.8 m) sits on the wall tops; the floor is a terrain-style tile (top at 0.8 m, place at -0.8). */
VXD.caveRock=(P,r)=>{const m=mulberry32(83),tone=[];for(let i=0;i<16;i++)tone.push(.8+m()*.28);for(let y=0;y<16;y++)for(let x=0;x<16;x++){const cell=((y>>2)*4+((x+((y>>2)%2)*2)>>2))&15,edge=(y%4===3&&m()<.6)||((x+((y>>2)%2)*2)%4===3&&m()<.5);
  P(x,y,edge?'#2c2926':'#4e4944',edge?nz(r,.9,1.05):tone[cell]*nz(r,.9,1.08));}};
VXD.caveFloor=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++){const k=r();P(x,y,k<.1?'#6a645c':k<.22?'#3a3530':'#544c42',nz(r,.88,1.06));}};
VXD.caveMoss=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,r()<.25?'#2e3e26':'#3e5230',nz(r,.85,1.1));};
const CAVEGLOW=new THREE.MeshStandardMaterial({color:new THREE.Color(0x8ae0c8).convertSRGBToLinear(),emissive:new THREE.Color(0x3ad0a8).convertSRGBToLinear(),emissiveIntensity:.6,roughness:.6});CAVEGLOW.userData={glowScale:1,base:.6};GLOW.push(CAVEGLOW);
FOLDERS['wasteland/cave']={name:'Cave',blurb:'Cave mouth in a hillside, modular rock walls, corners, ceiling, floor and tunnel, cave dressing',children:[]};
const wlTileMats2=tileMats;tileMats=function(){const m=wlTileMats2();Object.assign(m,{caveFloor:{top:vm('caveFloor'),side:vm('caveRock')},caveBump:{top:vm('caveRock'),side:vm('caveRock'),h:T+.12},caveMud:{top:vm('mud'),side:vm('caveRock'),h:T-.04}});return m;};
/* columns of rock in plan: cells [{x,z,h,y0}] of size c merged along x */
function cvCols(par,cells,c,mat){ruCols(par,cells.map(q=>({x:q.x,z:q.z,y0:q.y0||0,h:q.h,mat:q.mat})),c,mat||vm('caveRock'));}
const cvN=(a,b,s)=>Math.sin(a*1.9+b*.7+s)*.5+Math.cos(b*1.3-a*.8+s*2)*.35+Math.sin((a+b)*2.7+s*3)*.15;
/* cave wall: face depth per (column,row), merged per column into vertical runs */
function cvWall(s){const root=wlRoot(4),r=mulberry32((s||1)*853),c=.4,nr=15,sd=(s||1)*1.7,mat=vm('caveRock');
  for(let i=0;i<10;i++){const x=-1.8+i*c;let row=0;const dz=k=>i===0||i===9?.3:Math.round((.35+.45*cvN(i*.55,k*.45,sd))/.2)*.2;
    while(row<nr){const d=dz(row);let e=row;while(e+1<nr&&dz(e+1)===d)e++;const h=(e-row+1)*c,z0=-1,z1=d;const m=box(c,h,z1-z0,mat,{s:.8,ox:x-c/2,oy:row*c,oz:z0});put(root,m,x,row*c+h/2,(z0+z1)/2);row=e+1;}}
  for(let k=0;k<5;k++){const i=1+Math.floor(r()*8),row=Math.floor(r()*10);bx(root,.5+r()*.4,.3,.04,vm('caveMoss'),-1.8+i*c,row*c+.2,Math.max(.3,Math.round((.35+.45*cvN(i*.55,row*.45,sd))/.2)*.2)+.02);}
  for(let k=0;k<4;k++){const s2=.2+r()*.3;bx(root,s2,s2*.7,s2,mat,(r()-.5)*3.4,s2*.35,1.1+r()*.6,0,r()*3,0);}return root;}
function cvCorner(inner){return s=>{const root=wlRoot(3),r=mulberry32((s||1)*857+(inner?3:0)),c=.4,sd=(s||1)*2.3,cells=[];
  for(let i=-3;i<3;i++)for(let k=-3;k<3;k++){const x=(i+.5)*c,z=(k+.5)*c;for(let row=0;row<15;row++){const n=.25*cvN(x*1.3,row*.4+z,sd);let solid;
    if(inner)solid=x<.3+n||z<.3+n||x+z<1.1+n*2;else solid=x<.3+n&&z<.3+n;if(!solid)continue;cells.push({x,z,y0:row*c,h:c});}}
  const cols=new Map();for(const q of cells){const k=q.x+'|'+q.z;(cols.get(k)||cols.set(k,[]).get(k)).push(q);}const out=[];
  for(const list of cols.values()){list.sort((a,b)=>a.y0-b.y0);let s0=list[0];for(let j=1;j<=list.length;j++){const q=list[j];if(q&&Math.abs(q.y0-(s0.y0+s0.h))<1e-4){s0={x:s0.x,z:s0.z,y0:s0.y0,h:s0.h+c};continue;}out.push(s0);s0=q;}}
  cvCols(root,out,c);return root;};}
function cvCeiling(s){const root=wlRoot(-1),r=mulberry32((s||1)*859),m=vm('caveRock');root.userData.ground=-1;bx(root,4,.8,4,m,0,6.4,0);
  for(let k=0;k<4;k++){const w=.8+r()*.8;bx(root,w,.4,w*(.7+r()*.4),m,(r()-.5)*(4-w),5.8,(r()-.5)*(4-w));}
  for(let k=0;k<7;k++){const x=(r()-.5)*3.4,z=(r()-.5)*3.4,L=.6+r()*1.2;let y=6,w=.36;while(w>.1){const h=L*(w>.3?.45:w>.2?.35:.2);bx(root,w,h,w,m,x,y-h/2,z);y-=h;w-=.1;}}return root;}
function cvFloor(){return vTile((x,z)=>{const n=wlNoise(x*1.2,z*1.2,1);return n>1.7?'caveBump':n<-1.6?'caveMud':'caveFloor';},(root,at)=>{const r=mulberry32(61);
  for(let k=0;k<10;k++)for(let i=0;i<10;i++){const x=-1.8+i*.4,z=-1.8+k*.4;if(at(x,z)==='caveMud'&&wlNoise(x*1.2,z*1.2,1)<-2.1){const p=bx(root,.4,.01,.4,BOGMAT,x,T-.04+.005,z);p.castShadow=false;}}
  wlPebbles(root,18,63,['caveFloor'],at,['caveRock','cobble','gravel']);for(let i=0;i<3;i++){const x=(r()-.5)*3,z=(r()-.5)*3;if(at(x,z)==='caveFloor')wlBone(root,.3+r()*.3,x,T,z,r()*3);}});}
function cvTunnel(s){const root=wlRoot(-1);root.userData.ground=-1;for(const sd of[-1,1]){const w=cvWall((s||1)*3+(sd>0?1:0));put(root,w,sd*2,0,0,0,-sd*Math.PI/2,0);}put(root,cvCeiling(s),0,0,0);
  const f=cvFloor();put(root,f,0,-T,0);return root;}
/* cave mouth in a rocky hill, 12 × 10 m, the opening (3.2 m wide) facing +z */
function cvMouth(s){const root=wlRoot(8),r=mulberry32((s||1)*863),c=.8,cells=[],sd=(s||1)*1.3;
  const zf=x=>2.6+.5*Math.sin(x*.9+sd),TB=-2.8;
  for(let i=0;i<16;i++)for(let k=0;k<13;k++){const x=-6+c/2+i*c,z=-5.2+c/2+k*c;if(z>zf(x))continue;const ex=1-Math.pow(Math.abs(x)/6.4,4);if(ex<=0)continue;
    let h=Math.min(7.6,4.8+(zf(x)-z)*.55)*ex+cvN(x*.5,z*.5,sd)*.8;h=Math.round(h/.4)*.4;if(h<.4)continue;
    const inT=Math.abs(x)<1.6&&z>TB;if(inT){const ceil=Math.abs(x)<.8?3.6:2.8;if(h>ceil+.4)cells.push({x,z,y0:ceil,h:h-ceil});continue;}cells.push({x,z,y0:0,h});}
  const rk=vm('wRock'),ck=vm('caveRock'),tp=vm('wRockTop');cvCols(root,cells.filter(q=>q.y0===0),c,[rk,rk,tp,rk,rk,rk]);cvCols(root,cells.filter(q=>q.y0>0),c,[ck,ck,tp,ck,ck,ck]);
  const dk=bx(root,3.2,3.6,.1,vm('dark'),0,1.8,TB-.05);dk.castShadow=false;const fl=bx(root,3.2,.04,zf(0)-TB,vm('caveFloor'),0,.02,(zf(0)+TB)/2);fl.castShadow=false;
  for(let k=0;k<6;k++){const x=-1.4+k*.56+(r()-.5)*.1,ceil=Math.abs(x)<.8?3.6:2.8,L=.4+r()*.5,zz=zf(x)-c/2;let y=ceil,w=.3;while(w>.08){const h=L*.5;bx(root,w,h,w,vm('caveRock'),x,y-h/2,zz);y-=h;w-=.12;}}
  for(const s2 of[-1,1]){const b=new THREE.Group();put(root,b,s2*2.5,0,zf(s2*2.5)+.5,0,r(),0);bx(b,1.6,1.4,1.4,vm('wRock'),0,.7,0);bx(b,1,.8,1,vm('wRock'),.1,1.8,-.1);}
  for(let k=0;k<6;k++){const a=r()*3.14,d=3.6+r()*1.6;wlBone(root,.4+r()*.4,Math.cos(a)*d*.7,0,zf(0)+Math.sin(a)*d*.5+.5,r()*3);}wlSkull(root,.8,0,zf(0)+1.2,1.1,.5);wlHornSkull(root,-1.1,0,zf(0)+1.8,1.2,-.6);
  for(let k=0;k<12;k++){const x=(r()-.5)*11,z=zf(x)+.3+r()*1.2;if(Math.abs(x)>2&&Math.abs(x)<6)wlTuft(root,x,0,z,r,r()<.5);}
  for(let k=0;k<8;k++){const x=(r()-.5)*10,z=-4.4+r()*6,ii=Math.floor((x+6)/c),kk=Math.floor((z+5.2)/c),q=cells.find(q=>Math.abs(q.x-(-6+c/2+ii*c))<.01&&Math.abs(q.z-(-5.2+c/2+kk*c))<.01&&q.y0===0);
    if(q){const top=q.y0+q.h,nb=cells.filter(o=>Math.abs(o.x-q.x)<c*1.1&&Math.abs(o.z-q.z)<c*1.1&&o.y0===0);if(nb.length===9&&nb.every(o=>o.h===q.h))wlTuft(root,q.x,top,q.z,r,r()<.5);}}
  return root;}
function cvStalagmites(s){const root=wlRoot(2),r=mulberry32((s||1)*877),m=vm('caveRock');for(let k=0;k<6;k++){const a=r()*6.28,d=k?.5+r()*.9:0,x=Math.cos(a)*d,z=Math.sin(a)*d,H=k?.6+r()*1.4:2.2+r()*.8;let y=0,w=k?.4:.6;const n=Math.max(2,Math.round(H/.4));
  for(let i=0;i<n;i++){const ww=w*(1-i/n*.8),h=H/n;bx(root,ww,h,ww,m,x+(r()-.5)*.04,y+h/2,z+(r()-.5)*.04);y+=h;}}wlRubble(root,0,0,6,r,1.3,[m],.2);return root;}
function cvColumn(s){const root=wlRoot(2),r=mulberry32((s||1)*881),m=vm('caveRock');const w=y=>.7+.6*Math.pow(Math.abs(y-3)/3,1.6)+(r()-.5)*.1;for(let i=0;i<15;i++){const y=i*.4+.2,ww=w(y);bx(root,ww,.42,ww*(.9+r()*.15),m,(r()-.5)*.06,y,(r()-.5)*.06,0,r()*.3,0);}
  wlRubble(root,0,0,5,r,1.2,[m],.25);return root;}
function cvShrooms(s){const root=wlRoot(2),r=mulberry32((s||1)*883);for(let k=0;k<11;k++){const a=r()*6.28,d=Math.sqrt(r())*1,sc=.6+r()*1.4,x=Math.cos(a)*d,z=Math.sin(a)*d;
  bx(root,.06*sc,.22*sc,.06*sc,vm('woolWhite'),x,.11*sc,z);bx(root,.2*sc,.08*sc,.2*sc,CAVEGLOW,x,.25*sc,z);bx(root,.12*sc,.05*sc,.12*sc,CAVEGLOW,x,.315*sc,z);}
  bx(root,.6,.2,.5,vm('caveRock'),-.6,.1,.5);const pl=new THREE.PointLight(0x5af0c8,0,4,2);pl.position.set(0,.6,0);pl.userData.lamp=true;pl.userData.min=.5;root.add(pl);root.userData.lights.push(pl);return root;}
function cvPool(s){const root=wlRoot(3.6),r=mulberry32((s||1)*887),c=.4,R=1.7;for(let i=-5;i<5;i++)for(let k=-5;k<5;k++){const x=(i+.5)*c,z=(k+.5)*c,d=Math.hypot(x,z)+(r()-.5)*.2;if(d>R+.5)continue;
  if(d>R)bx(root,c,.16+r()*.12,c,vm('caveRock'),x,.1,z);else bx(root,c,.02,c,vm('caveFloor'),x,.01,z);}
  for(let k=-4;k<4;k++){let run=null;const flush=()=>{if(run){const w=bx(root,(run[1]-run[0]+1)*c,.02,c,BOGMAT,((run[0]+run[1])/2+.5)*c,.09,(k+.5)*c);w.castShadow=false;run=null;}};for(let i=-5;i<5;i++){const x=(i+.5)*c,z=(k+.5)*c;if(Math.hypot(x,z)<R-.25){if(run)run[1]=i;else run=[i,i];}else flush();}flush();}
  cvStalagmites(5).children.forEach(q=>{if(q.isMesh&&q.position.y>.05){const p=q.clone();p.position.x+=1.9;p.position.z-=.6;p.scale.multiplyScalar(.7);p.position.y*=.7;root.add(p);}});return root;}
function cvNest(s){const root=wlRoot(4),r=mulberry32((s||1)*891),c=.4,R=1.8;for(let i=-6;i<6;i++)for(let k=-6;k<6;k++){const x=(i+.5)*c,z=(k+.5)*c,d=Math.hypot(x,z);if(d>R+.4)continue;
  if(d>R-.5)bx(root,c,.3+r()*.2,c,vm(r()<.5?'hay':'fur'),x,.2,z);else bx(root,c,.1,c,vm(r()<.6?'fur':'hay'),x,.05,z);}
  bx(root,1.4,.06,1,vm('hide'),-.2,.13,.1,0,.4,0);wlHornSkull(root,1.6,0,1.4,1.5,-.8);for(let i=0;i<9;i++){const a=r()*6.28,d=2.4+r()*.8;wlBone(root,.4+r()*.5,Math.cos(a)*d,0,Math.sin(a)*d,r()*3);}
  for(let i=0;i<3;i++)wlSkull(root,-1.8+i*.7,0,-2.4+r()*.3,1,r());const rib=wlRibcage(2);rib.scale.setScalar(.32);rib.position.set(-2.6,0,1.2);rib.rotation.y=1;root.add(rib);
  vBarrel(root,2.2,-1.4);bx(root,.6,.04,.6,vm('liqRed'),.6,.12,-.6);return root;}
function cvRockfall(s){const root=wlRoot(3),r=mulberry32((s||1)*897),m=vm('caveRock');for(let i=0;i<6;i++){const w=.6+r()*1,h=.5+r()*.7,a=r()*6.28,d=r()*1.4;bx(root,w,h,w*(.8+r()*.3),m,Math.cos(a)*d,h/2,Math.sin(a)*d,0,r()*3,0);}
  wlRubble(root,0,0,16,r,2.2,[m,vm('cobble')],.3);return root;}
WL('cave-mouth','cave','Cave mouth',cvMouth,'Rocky hill, 12 × 10 m and up to 7.6 m high, with a 3.2 m wide cave opening facing +z that runs 5 m into darkness; stalactite teeth hang from the lip, two boulders flank it and bones and skulls are strewn outside.',{variants:true,defaultSeed:1});
WL('cave-wall','cave','Cave wall',cvWall,'Interior rock wall, 4 m long and 6 m high, centred on the grid line: rough face towards +z (into the room) bulging up to 0.8 m, flat back 1 m behind, patches of moss and fallen stones. The end columns are always 0.3 m deep, so walls in a row line up.',{variants:true,defaultSeed:1});
WL('cave-corner-in','cave','Cave inner corner',cvCorner(true),'Rock mass for a grid vertex where two cave walls meet round a room corner (room towards +x and +z), with a rough chamfer between them. 6 m high.',{variants:true,defaultSeed:1});
WL('cave-corner-out','cave','Cave outer corner',cvCorner(false),'Rock pillar for a grid vertex where the cave wall turns round an outside corner (rock in the −x −z quarter). 6 m high.',{variants:true,defaultSeed:1});
WL('cave-ceiling','cave','Cave ceiling',cvCeiling,'4 × 4 m rock ceiling slab from 6 to 6.8 m with lumps and stalactites hanging under it; the origin is on the floor, so it snaps onto the wall tops.',{variants:true,defaultSeed:1,groundR:-1});
WL('cave-floor','cave','Cave floor',cvFloor,'Cave floor tile, 4 × 4 m: dark stony ground, rock bumps, a muddy puddle, pebbles and gnawed bones. Top at 0.8 m like the terrain tiles.',{groundR:-1});
WL('cave-tunnel','cave','Cave tunnel',cvTunnel,'One 4 m cell of tunnel: two cave walls facing each other, the ceiling and the floor, running along z. The floor top is at 0.',{variants:true,defaultSeed:1,groundR:-1});
WL('cave-stalagmites','cave','Stalagmites',cvStalagmites,'Cluster of tapering stalagmites, one tall in the middle, with loose stones.',{variants:true,defaultSeed:1});
WL('cave-column','cave','Rock column',cvColumn,'Floor-to-ceiling column of rock, 6 m, pinched in the middle where stalactite met stalagmite.',{variants:true,defaultSeed:1});
WL('cave-shrooms','cave','Glowing mushrooms',cvShrooms,'Cluster of pale mushrooms with softly glowing blue-green caps and a dim light of their own.',{variants:true,defaultSeed:1});
WL('cave-pool','cave','Cave pool',cvPool,'Still dark pool in a rim of rock with small stalagmites beside it.',{variants:true,defaultSeed:1});
WL('cave-nest','cave','Ogre nest',cvNest,'Ogre bed: a ring of hay and furs round a hide, a huge horned skull, a gnawed carcass, bones and skulls, a barrel and a blood stain.',{variants:true,defaultSeed:1});
WL('cave-rockfall','cave','Rockfall',cvRockfall,'Heap of fallen boulders and broken stone.',{variants:true,defaultSeed:1});
