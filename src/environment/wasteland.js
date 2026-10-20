/* ======================= WASTELAND KIT (wl-): goblin and ogre country =======================
   Everything snaps to a 4 m grid (the terrain tile size).
   - Tiles keep their top at y = 0.8, like the other terrain tiles: place them at y = -0.8.
   - Walls (ruins, palisade, cave) are 4 m long from grid vertex to grid vertex, centred on the grid line, front (outside) towards +z.
   - Corner pieces (pillars, towers, corner posts, rock corners) sit on a grid vertex and hide the wall ends that meet there.
   See docs/WASTELAND.md. */
VXD.wDust=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++){const k=r();P(x,y,k<.07?'#989286':k<.16?'#5b5044':'#796d5a',nz(r,.86,1.08));}};
VXD.wDustSide=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,y%5===1?'#5b4e41':y%7===4?'#877a67':'#6b5e4e',nz(r,.86,1.08));};
VXD.wCracked=(P,r)=>{const m=mulberry32(77),g=[];for(let y=0;y<16;y++)g.push(new Array(16).fill(0));
  for(let c=0;c<6;c++){let x=Math.floor(m()*16),y=Math.floor(m()*16),h=m()<.5;for(let s=0;s<11;s++){g[y&15][x&15]=1;if(m()<.3)h=!h;if(h)x+=m()<.85?1:-1;else y+=m()<.85?1:-1;}}
  for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,g[y][x]?'#4b3f31':'#9f8d70',g[y][x]?nz(r,.9,1.05):nz(r,.88,1.06));};
VXD.wAsh=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++){const k=r();P(x,y,k<.14?'#3d3a37':k<.24?'#8d8a86':'#6b6864',nz(r,.88,1.08));}};
VXD.wScorch=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++){const k=r();P(x,y,k<.03?'#654738':k<.2?'#1e1c1a':k<.35?'#4d4944':'#34302d',nz(r,.88,1.08));}};
VXD.wDeadGrass=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++){const k=r();P(x,y,k<.2?'#685b3a':k<.32?'#a49469':k<.4?'#796d5a':'#897a52',nz(r,.86,1.08));}};
VXD.wDeadGrassSide=(P,r)=>{const e=[];for(let x=0;x<16;x++)e.push(2+Math.floor(r()*3));for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,y<e[x]?'#897a52':y%5===1?'#5b4e41':'#6b5e4e',nz(r,.85,1.08));};
VXD.wTrack=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++){const k=r();P(x,y,k<.08?'#b6ab98':k<.14?'#776a58':'#9f8f75',nz(r,.9,1.05));}};
VXD.wRut=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++){const k=r();P(x,y,k<.15?'#665948':'#827161',nz(r,.9,1.05));}};
/* rock: blotchy grey-brown with a few dark cracks (tiles seamlessly) */
function wlRockDraw(P,r,base,crack,seedN){const m=mulberry32(seedN),T=new Float32Array(256),g=new Uint8Array(256);
  for(let b=0;b<7;b++){const cx=m()*16,cy=m()*16,rad=2.5+m()*4,v=(m()-.5)*.34;for(let y=0;y<16;y++)for(let x=0;x<16;x++){const dx=Math.min(Math.abs(x-cx),16-Math.abs(x-cx)),dy=Math.min(Math.abs(y-cy),16-Math.abs(y-cy)),d=Math.hypot(dx,dy);if(d<rad)T[y*16+x]+=v*(1-d/rad);}}
  for(let c=0;c<3;c++){let x=Math.floor(m()*16),y=Math.floor(m()*16);const sx=m()<.5?1:-1;for(let s=0;s<9;s++){g[(y&15)*16+(x&15)]=1;if(m()<.6)x+=sx;y+=m()<.7?1:0;}}
  for(let y=0;y<16;y++)for(let x=0;x<16;x++){const i=y*16+x;P(x,y,g[i]?crack:base,g[i]?nz(r,.9,1.05):(1+T[i])*nz(r,.9,1.07));}}
VXD.wRock=(P,r)=>wlRockDraw(P,r,'#635e58','#2d2a27',31);
VXD.wRockTop=(P,r)=>{const m=mulberry32(35);for(let y=0;y<16;y++)for(let x=0;x<16;x++){const k=r();P(x,y,k<.3?'#635e58':k<.4?'#4d4945':'#73685e',nz(r,.86,1.08));}};
VXD.wDeadBark=(P,r)=>{const c=[];for(let x=0;x<16;x++)c.push(nz(r,.8,1.08));for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,(y+((x>>2)*5))%6===0?'#393431':'#69635c',c[x]*nz(r,.92,1.05));};
VXD.wCharBark=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++){const k=r();P(x,y,k<.04?'#533a2e':k<.3?'#141210':k<.45?'#483f37':'#292421',nz(r,.88,1.08));}};
VXD.wTwig=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,'#3b2f26',nz(r,.82,1.1));};
VXD.bone=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,r()<.1?'#b6ae97':'#d6cfbb',nz(r,.92,1.04));};
VXD.rustIron=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++){const k=r();P(x,y,k<.3?'#70533e':k<.45?'#372c24':'#544033',nz(r,.88,1.08));}};
VXD.bog=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,r()<.15?'#2c2f23':'#3d412d',nz(r,.9,1.06));};
VXD.deadReed=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,'#877a5b',(y%5===0?.8:1)*nz(r,.9,1.06));};

/* ---------- shared helpers ---------- */
function wlRoot(g){const r=new THREE.Group();r.userData.lights=[];r.userData.ground=g;r.userData.groundKind='waste';return r;}
/* a box between two points, keeping the 0.8 m pixel grid of bx */
function wlBeam(par,a,b,w,mat,d){const A=new THREE.Vector3(...a),B=new THREE.Vector3(...b),v=B.clone().sub(A),L=v.length();const m=box(w,L,d??w,mat,{s:.8,ox:0,oy:0,oz:0});m.position.copy(A).add(B).multiplyScalar(.5);m.quaternion.setFromUnitVectors(UP,v.normalize());par.add(m);return m;}
/* skull with its base at y, facing +z (rotated by ry) */
function wlSkull(par,x,y,z,s=1,ry=0){const g=new THREE.Group();put(par,g,x,y,z,0,ry,0);g.scale.setScalar(s);const b=vm('bone'),d=vm('dark');
  bx(g,.16,.06,.1,b,0,.03,.06);bx(g,.18,.06,.12,b,0,.03,-.05);bx(g,.22,.17,.24,b,0,.145,0);bx(g,.14,.03,.02,b,0,.075,.115);
  for(const sd of[-1,1])bx(g,.06,.05,.02,d,sd*.055,.17,.121);bx(g,.03,.04,.02,d,0,.115,.121);return g;}
/* big horned beast skull, base at y, snout towards +z */
function wlHornSkull(par,x,y,z,s=1,ry=0){const g=new THREE.Group();put(par,g,x,y,z,0,ry,0);g.scale.setScalar(s);const b=vm('bone'),d=vm('dark');
  bx(g,.36,.26,.36,b,0,.13,0);bx(g,.24,.16,.34,b,0,.08,.32);bx(g,.2,.05,.3,b,0,.025,.3);for(const sd of[-1,1]){bx(g,.08,.07,.02,d,sd*.1,.2,.181);bx(g,.03,.04,.02,d,sd*.04,.1,.491);
    const h=new THREE.Group();put(g,h,sd*.18,.2,-.04,0,0,-sd*.5);bx(h,.14,.1,.1,b,sd*.07,0,0);bx(h,.12,.09,.09,b,sd*.17,.05,0);bx(h,.1,.08,.08,b,sd*.25,.13,.0);bx(h,.07,.12,.07,b,sd*.28,.23,0);}return g;}
/* long bone lying on the ground along x */
function wlBone(par,len,x,y,z,ry=0){const g=new THREE.Group();put(par,g,x,y,z,0,ry,0);const b=vm('bone');bx(g,len,.05,.05,b,0,.035,0);for(const sd of[-1,1])bx(g,.09,.07,.09,b,sd*len/2,.035,0);return g;}
/* torch on a stake stuck in the ground (always lit) */
function wlTorch(par,L,x,z,h=1.6,y=0){const g=new THREE.Group();put(par,g,x,y,z);vlog(g,.1,h,.1,'y',0,h/2,0);bx(g,.16,.16,.16,vm('rope'),0,h-.02,0);vFlame(g,0,h+.06,0,.16,L,.8);return g;}
/* loose blocks lying on the ground */
function wlRubble(par,x,z,n,r,spread,mats,big=.5){for(let i=0;i<n;i++){const a=r()*6.28,d=Math.sqrt(r())*spread,s=.14+r()*big,m=mats[Math.floor(r()*mats.length)];bx(par,s*(1+r()*.5),s*(.6+r()*.4),s,m,x+Math.cos(a)*d,s*(.6+r()*.4)/2,z+Math.sin(a)*d,0,r()*3,0);}}
/* rubble as a stepped mound: blocks on the ground, a smaller layer on top of them; skip(x,z,y) leaves out blocks inside a wall */
/* each cell keeps the same jitter on every layer, so a block is only placed where the layer below has one (or skip() says a wall is there) */
function wlMound(par,x,z,R,r,mat,skip){const c=.4,n=Math.ceil(R/c),J=new Map(),jit=(i,k)=>{const key=i+','+k;if(!J.has(key))J.set(key,r()*.3);return J.get(key);};
  for(let l=0;l<4;l++){const rr=R*(1-l*.3);if(rr<.3)break;for(let i=-n;i<=n;i++)for(let k=-n;k<=n;k++){const px=x+i*c,pz=z+k*c;
  if(Math.hypot(i*c,k*c)>rr-jit(i,k))continue;if(skip&&skip(px,pz,l*c))continue;bx(par,c+r()*.04,c,c+r()*.04,mat,px+(r()-.5)*.04,l*c+c/2,pz+(r()-.5)*.04,0,(r()-.5)*.2,0);}}}
const dryTallMat=()=>cutTex('dryTall',(P,r)=>{for(let b=0;b<7;b++){const x0=1+b*2+Math.floor(r()*2),h=6+Math.floor(r()*9),lean=r()<.5?-1:1;for(let y=0;y<h;y++){const x=x0+Math.round(lean*y*y/70);if(x>=0&&x<16)P(x,15-y,['#9c8b5d','#86754e','#b3a275','#6c5f3f'][Math.floor(r()*4)],nz(r,.85,1.1));}}});
const dryShortMat=()=>cutTex('dryShort',(P,r)=>{for(let b=0;b<6;b++){const x0=2+b*2,h=2+Math.floor(r()*5);for(let y=0;y<h;y++)P(x0,15-y,r()<.5?'#86754e':'#9c8b5d',nz(r,.85,1.1));}});
function wlTuft(par,x,y,z,r,tall){vSprite(par,tall?dryTallMat():dryShortMat(),x,y,z,tall?.5:.35,tall?.45+r()*.45:.3,r()*3);}
/* murky water for bogs and cave pools */
const BOGMAT=new THREE.MeshStandardMaterial({color:new THREE.Color(0x323828).convertSRGBToLinear(),roughness:.12,metalness:.1,transparent:true,opacity:.92});
/* cart wheel standing in the x–y plane, centre at the origin of the returned group */
function wlWheel(par,R=.5){const g=new THREE.Group();par.add(g);const w=vm('planksDark');for(let i=0;i<8;i++){const a=i/8*Math.PI*2,s=new THREE.Group();put(g,s,0,0,0,0,0,a);bx(s,.1,R*2*Math.tan(Math.PI/8)+.02,.1,w,R-.05,0,0);bx(s,R-.1,.06,.06,w,(R-.1)/2,0,0);}bx(g,.18,.18,.14,vm('iron'),0,0,0);return g;}
/* round plank shield, face towards +z, centred at the origin */
function wlShield(par,R=.36,col='planks'){const g=new THREE.Group();par.add(g);vDiscV(g,R,vm(col),vm('iron'));return g;}
function vDiscV(g,R,mat,rim){const c=.08;for(let x=-R+c/2;x<R;x+=c){const h=Math.round(Math.sqrt(Math.max(0,R*R-x*x))/c)*c;if(h>0)bx(g,c,2*h,.05,mat,x,0,0);}bx(g,.12,.12,.04,rim,0,0,.04);for(let i=0;i<12;i++){const a=i/12*Math.PI*2;bx(g,.07,.07,.06,rim,Math.cos(a)*(R-.04),Math.sin(a)*(R-.04),0);}}

FOLDERS[''].children.push('wasteland');
FOLDERS['wasteland']={name:'Wasteland kit',blurb:'Modular pieces for goblin and ogre country, on a 4 m grid',children:['wasteland/terrain','wasteland/nature','wasteland/props','wasteland/ruins','wasteland/fort','wasteland/cave']};
FOLDERS['wasteland/terrain']={name:'Terrain',blurb:'Wasteland ground tiles, dirt tracks, cliffs and a ramp (4 × 4 m)',children:[]};
FOLDERS['wasteland/nature']={name:'Nature',blurb:'Dead and burnt trees, thorns, dry grass, jagged rocks, bog',children:[]};
FOLDERS['wasteland/props']={name:'Props',blurb:'Bones, beast skeletons, battlefield remains, broken cart, markers',children:[]};
const WL=(id,f,name,build,desc,o={})=>ASSETS.push(Object.assign({id:'wl-'+id,folder:'wasteland/'+f,name,build,desc},o));

/* ======================= terrain tiles ======================= */
const wlTileMats0=tileMats;tileMats=function(){const m=wlTileMats0();Object.assign(m,{wDust:{top:vm('wDust'),side:vm('wDustSide')},wCracked:{top:vm('wCracked'),side:vm('wDustSide')},wAsh:{top:vm('wAsh'),side:vm('wDustSide')},
  wScorch:{top:vm('wScorch'),side:vm('wDustSide')},wDeadGrass:{top:vm('wDeadGrass'),side:vm('wDeadGrassSide')},wMud:{top:vm('mud'),side:vm('wDustSide'),h:T-.06},wTrack:{top:vm('wTrack'),side:vm('wDustSide'),h:T-.04},
  wRut:{top:vm('wRut'),side:vm('wDustSide'),h:T-.07},wRock:{top:vm('wRockTop'),side:vm('wRock'),h:T+.08}});return m;};
const wlNoise=(x,z,s=1)=>Math.sin(x*1.7*s+z*.9)+Math.cos(z*2.3*s-x*.6)+Math.sin((x+z)*3.1*s);
function wlDeco(n,tallP,kinds,seedN){return(root,at)=>{const r=mulberry32(seedN);for(let i=0;i<n;i++){const x=(r()-.5)*3.7,z=(r()-.5)*3.7;if(!kinds.includes(at(x,z)))continue;wlTuft(root,x,T,z,r,r()<tallP);}};}
function wlPebbles(root,n,seedN,kinds,at,mats=['cobble','wRock','gravel']){const r=mulberry32(seedN);for(let i=0;i<n;i++){const x=(r()-.5)*3.6,z=(r()-.5)*3.6;if(kinds&&!kinds.includes(at(x,z)))continue;const s=.06+r()*.1;bx(root,s,.04,s*(.8+r()*.6),vm(mats[Math.floor(r()*mats.length)]),x,T+.02,z,0,r()*3,0);}}
function wlTile(kind){if(kind==='dust')return vTile((x,z)=>wlNoise(x,z)>1.6?'wDeadGrass':'wDust',(root,at)=>{wlDeco(26,.3,['wDust','wDeadGrass'],3)(root,at);wlPebbles(root,16,5,null,at);});
  if(kind==='cracked')return vTile((x,z)=>wlNoise(x,z,.8)>2.2?'wDust':'wCracked',(root,at)=>{wlPebbles(root,6,7,null,at);wlDeco(6,0,['wDust'],9)(root,at);});
  if(kind==='ash')return vTile((x,z)=>{const n=wlNoise(x,z,1.2);return n>1.4?'wScorch':n<-2?'wDust':'wAsh';},(root,at)=>{const r=mulberry32(13);for(let i=0;i<7;i++){const x=(r()-.5)*3.2,z=(r()-.5)*3.2,l=.3+r()*.5;bx(root,l,.08,.08,vm('wCharBark'),x,T+.04,z,0,r()*3,0);}
    for(let i=0;i<5;i++){const x=(r()-.5)*3.4,z=(r()-.5)*3.4;bx(root,.08,.06,.08,EMBER,x,T+.03,z);}});
  if(kind==='deadgrass')return vTile((x,z)=>wlNoise(x,z)<-2.1?'wDust':'wDeadGrass',wlDeco(110,.8,['wDeadGrass'],15));
  if(kind==='mud')return vTile((x,z)=>{const n=wlNoise(x,z,.9);return n>.6?'wMud':n>-1.4?'wDust':'wDeadGrass';},(root,at)=>{const r=mulberry32(17);
    for(let k=0;k<10;k++)for(let i=0;i<10;i++){const x=-1.8+i*.4,z=-1.8+k*.4;if(at(x,z)==='wMud'&&wlNoise(x,z,.9)>1.5){const p=bx(root,.4,.01,.4,BOGMAT,x,T-.06+.005,z);p.castShadow=false;}}
    wlDeco(18,.5,['wDust','wDeadGrass'],19)(root,at);wlPebbles(root,8,21,['wDust'],at);});
  if(kind==='rocky')return vTile((x,z)=>wlNoise(x,z,1.1)>1.2?'wRock':'wDust',(root,at)=>{const r=mulberry32(23);for(let i=0;i<9;i++){const x=(r()-.5)*3.2,z=(r()-.5)*3.2,s=.2+r()*.35,y=at(x,z)==='wRock'?T+.08:T;bx(root,s*(1+r()*.6),s*.6,s,vm(r()<.5?'wRock':'cobble'),x,y+s*.3,z,0,r()*3,0);}
    wlPebbles(root,14,25,['wDust'],at);wlDeco(8,.2,['wDust'],27)(root,at);});}
/* dirt track, 2.4 m wide with cart ruts; shapes: straight (north–south), corner (south edge to east edge), t (branch to the east), x */
function wlTrackTile(shape){const half=1.2,d0=(x,z)=>shape==='c'?Math.abs(Math.hypot(x-2,z-2)-2):shape==='t'?Math.min(Math.abs(x),x>0?Math.abs(z):99):shape==='x'?Math.min(Math.abs(x),Math.abs(z)):Math.abs(x);
  const rut=(x,z)=>{const near=v=>Math.abs(Math.abs(v)-.6)<.12;if(shape==='c'){const d=Math.hypot(x-2,z-2)-2;return near(d);}const ns=near(x)&&(shape!=='t'&&shape!=='x'||Math.abs(z)>half||x<0&&shape==='t'),ew=(shape==='x'||shape==='t'&&x>half)&&near(z);return ns||ew;};
  return vTile((x,z)=>{const d=d0(x,z);if(d<half)return rut(x,z)?'wRut':'wTrack';return d<half+.4||wlNoise(x,z)<1.4?'wDust':'wDeadGrass';},(root,at)=>{wlDeco(22,.4,['wDust','wDeadGrass'],31+shape.length)(root,at);wlPebbles(root,12,33,['wTrack'],at,['cobble','gravel']);});}
/* cliff tiles: high ground (4 m above the tile top) with a jagged rock face; hi(x,z) says where the high ground is */
function wlCliff(hi,seedN){const root=new THREE.Group();root.userData.lights=[];root.userData.ground=-1;const r=mulberry32(seedN),c=.4,N=10,H=4,rk=vm('wRock'),dt=vm('wDust'),ds=vm('wDustSide'),rt=vm('wRockTop');
  const cells=[];for(let k=0;k<N;k++){cells.push([]);for(let i=0;i<N;i++){const x=-2+c/2+i*c,z=-2+c/2+k*c,j=Math.sin(x*3.1+z*1.3)*.25+Math.cos(z*2.7-x*1.9)*.2;const h=hi(x+j,z+j);cells[k].push(h);}}
  const isHi=(i,k)=>i<0||k<0||i>=N||k>=N?null:cells[k][i];
  for(let k=0;k<N;k++)for(let i=0;i<N;i++){const x=-2+c/2+i*c,z=-2+c/2+k*c;if(!cells[k][i]){bx(root,c,T,c,[ds,ds,dt,dt,ds,ds],x,T/2,z);continue;}
    const edge=[[1,0],[-1,0],[0,1],[0,-1]].some(([a,b])=>isHi(i+a,k+b)===false),drop=edge?(r()<.35?c*(1+Math.floor(r()*3)):0):0,h=T+H-drop;
    bx(root,c,h,c,[rk,rk,edge?rt:dt,rk,rk,rk],x,h/2,z);
    if(edge&&r()<.3){const s=.3+r()*.3,lo=[[1,0],[-1,0],[0,1],[0,-1]].find(([a,b])=>isHi(i+a,k+b)===false);const px=x+lo[0]*(c/2+s/2-.06),pz=z+lo[1]*(c/2+s/2-.06);if(Math.abs(px)<2-s/2&&Math.abs(pz)<2-s/2)bx(root,s,s*.8,s,rk,px,T+s*.4,pz,0,r(),0);}}
  const tr=mulberry32(seedN+5);for(let i=0;i<10;i++){const x=(tr()-.5)*3.6,z=(tr()-.5)*3.6,ii=Math.min(N-1,Math.floor((x+2)/c)),kk=Math.min(N-1,Math.floor((z+2)/c));if(cells[kk][ii]&&[[1,0],[-1,0],[0,1],[0,-1]].every(([a,b])=>isHi(ii+a,kk+b)!==false))wlTuft(root,x,T+H,z,tr,tr()<.4);}
  return root;}
/* ramp: 4 m wide, 8 m long (two cells), rising 4 m towards -z in 0.4 m steps; starts at the tile top of the southern cell */
function wlRamp(){const root=new THREE.Group();root.userData.lights=[];root.userData.ground=-1;const rk=vm('wRock'),dt=vm('wTrack'),ds=vm('wDustSide');
  for(let i=0;i<10;i++){const h=T+.4*(i+1),z=4-.4-i*.8;bx(root,3.2,h,.8,[rk,rk,dt,rk,rk,rk],0,h/2,z);for(const s of[-1,1])bx(root,.4,h+.4,.8,[rk,rk,vm('wRockTop'),rk,rk,rk],s*1.8,(h+.4)/2,z);}
  return root;}

[['dust','Dusty ground','Dry grey-brown earth with pebbles and tufts of dead grass.'],['cracked','Cracked earth','Sun-baked earth split by a network of dark cracks.'],
 ['ash','Ash','Grey ash and scorched patches with charred sticks and a few glowing embers.'],['deadgrass','Dead grass','Thick dry yellow-brown grass, tall tufts leaning every way.'],
 ['mud','Mud','Churned mud with murky puddles, dusty edges and dead grass.'],['rocky','Rocky ground','Stony ground with flat rock slabs and loose stones.']]
 .forEach(([k,n,d])=>WL('t-'+k,'terrain',n,()=>wlTile(k),d+' 4 × 4 m tile, top at 0.8 m like the other terrain tiles.',{groundR:-1}));
[['','Dirt track','Straight dirt track, 2.4 m wide, with two dark cart ruts.'],['-c','Dirt track corner','Curved quarter turn of the dirt track, south edge to east edge.'],['-t','Dirt track T-junction','The north–south track with a branch to the east.'],['-x','Dirt track crossroads','Two tracks crossing.']]
 .forEach(([s,n,d])=>WL('t-track'+s,'terrain',n,()=>wlTrackTile(s?s.slice(1):'s'),d+' 4 × 4 m tile.',{groundR:-1}));
WL('t-cliff','terrain','Cliff',()=>wlCliff((x,z)=>z<1.2,41),'Cliff edge: high ground 4 m above the tile top with a jagged rock face towards +z and a ledge here and there. Line several up along a grid row.',{groundR:-1});
WL('t-cliff-o','terrain','Cliff outer corner',()=>wlCliff((x,z)=>z<1.2&&x<1.2,43),'Outer corner of the cliff: rock faces towards +z and +x.',{groundR:-1});
WL('t-cliff-i','terrain','Cliff inner corner',()=>wlCliff((x,z)=>z<1.2||x<-1.2,45),'Inner corner of the cliff: high ground on the north and west sides, low ground in the south-east.',{groundR:-1});
WL('t-cliff-top','terrain','Cliff top',()=>wlCliff(()=>true,47),'Solid high ground 4 m above the tile top, to fill in behind the cliff edge.',{groundR:-1});
WL('t-ramp','terrain','Rock ramp',wlRamp,'Stepped ramp in 0.4 m steps between rock side walls, 4 m wide and 8 m long (two cells), climbing from the tile top up to the cliff top towards -z.',{groundR:-1});

/* ======================= nature ======================= */
/* crooked branch as a chain of beams, with knuckle blocks at the joints */
function wlBranch(par,mat,p,a,el,len,w,r,depth,out){let[px,py,pz]=p;const n=Math.max(2,Math.round(len/.4));for(let i=0;i<n;i++){const seg=len/n,ww=Math.max(.05,w*(1-i/n*.55));a+=(r()-.5)*.6;el=Math.max(-.2,el+(r()-.5)*.35-.02);
    const q=[px+Math.cos(el)*Math.sin(a)*seg,py+Math.sin(el)*seg,pz+Math.cos(el)*Math.cos(a)*seg];wlBeam(par,[px,py,pz],q,ww,mat);bx(par,ww,ww,ww,mat,q[0],q[1],q[2]);[px,py,pz]=q;
    if(depth>0&&i>0&&r()<.4)wlBranch(par,mat,[px,py,pz],a+(r()<.5?1:-1)*(.6+r()*.6),el+.15,len*.5,ww*.65,r,depth-1,out);}if(out)out.push([px,py,pz]);return[px,py,pz];}
function wlTrunk(par,mat,H,w0,r){let x=0,z=0;const n=Math.round(H/.5),pts=[];for(let i=0;i<n;i++){const w=w0*(1-i/n*.55),nx=x+(r()-.5)*.14,nz2=z+(r()-.5)*.14;bx(par,w,.5+.02,w,mat,(x+nx)/2,i*.5+.26,(z+nz2)/2);x=nx;z=nz2;pts.push([x,(i+1)*.5,z,w]);}return pts;}
function wlDeadTree(size){return s=>{const root=wlRoot(size==='large'?5:3.2),r=mulberry32((s||1)*311+(size==='large'?7:0)),m=vm('wDeadBark'),H=size==='large'?5+r()*1.6:2.6+r()*.8,w0=size==='large'?.7:.4;
  const pts=wlTrunk(root,m,H,w0,r);for(let i=0;i<4;i++){const a=i*Math.PI/2+r()*.6;wlBeam(root,[Math.sin(a)*w0*.3,.3,Math.cos(a)*w0*.3],[Math.sin(a)*(w0*.5+.5),.06,Math.cos(a)*(w0*.5+.5)],w0*.32,m);}
  const nb=size==='large'?5:3;for(let i=0;i<nb;i++){const p=pts[Math.min(pts.length-1,Math.floor(pts.length*(.45+i/nb*.5)))];wlBranch(root,m,[p[0],p[1]-.1,p[2]],i*2.4+r(),.5+r()*.5,H*(.35+r()*.2),p[3]*.55,r,size==='large'?2:1);}
  const t=pts[pts.length-1];wlBranch(root,m,[t[0],t[1]-.05,t[2]],r()*6,1.2,H*.25,t[3]*.7,r,1);
  for(let i=0;i<5;i++){const a=r()*6.28,d=.7+r()*1.2;wlTuft(root,Math.cos(a)*d,0,Math.sin(a)*d,r,r()<.5);}return root;};}
function wlBurntTree(s){const root=wlRoot(2.6),r=mulberry32((s||1)*331),m=vm('wCharBark'),H=2.2+r()*1.6;const pts=wlTrunk(root,m,H,.6,r);const t=pts[pts.length-1];
  for(let i=0;i<4;i++){const h=.2+r()*.6,w=.18;bx(root,w,h,w,m,t[0]+(i%2?.14:-.14),H+h/2,t[2]+(i<2?.14:-.14));}
  for(let i=0;i<2;i++){const p=pts[Math.floor(pts.length*(.5+i*.25))];wlBranch(root,m,[p[0],p[1]-.1,p[2]],r()*6,.4,.8+r()*.5,.18,r,0);}
  for(let i=-3;i<3;i++)for(let k=-3;k<3;k++){const x=(i+.5)*.4,z=(k+.5)*.4,d=Math.hypot(x,z)+(r()-.5)*.5;if(d>1.15)continue;const sc=bx(root,.4,.02,.4,vm(d<.7?'wScorch':'wAsh'),x,.01,z);sc.castShadow=false;}for(let i=0;i<4;i++){const a=r()*6.28,d=.7+r()*.5;bx(root,.5+r()*.4,.12,.12,m,Math.cos(a)*d,.07,Math.sin(a)*d,0,r()*3,0);}return root;}
function wlThorn(s){const root=wlRoot(2),r=mulberry32((s||1)*347),m=vm('wTwig'),tips=[];bx(root,.24,.16,.24,m,0,.08,0);
  for(let i=0;i<9;i++)wlBranch(root,m,[0,.12,0],i/9*6.28+r()*.4,.5+r()*.6,.7+r()*.5,.08,r,1,tips);
  for(const[x,y,z]of tips){bx(root,.04,.1,.04,vm('bone'),x,y+.05,z);if(r()<.5)bx(root,.1,.06,.1,vm('wDeadGrass'),x+.04,y,z+.04);}return root;}
function wlDryGrass(s){const root=wlRoot(2),r=mulberry32((s||1)*353);for(let i=0;i<34;i++){const a=r()*6.28,d=Math.sqrt(r())*1.2;wlTuft(root,Math.cos(a)*d,0,Math.sin(a)*d,r,r()<.7);}return root;}
function wlBoulder(s){const root=wlRoot(3.2),r=mulberry32((s||1)*359),m=vm('wRock'),tp=vm('wRockTop');const parts=[[2,1.2,1.6,0,0]];for(let i=0;i<6;i++)parts.push([.7+r()*1,.5+r()*1,.7+r()*.8,(r()-.5)*1.8,(r()-.5)*1.4]);
  parts.forEach(([w,h,d,x,z],i)=>{const b=box(w,h,d,[m,m,r()<.4?tp:m,m,m,m],{s:.8,ox:r()*4,oy:r()*4,oz:r()*4});put(root,b,x,h/2,z,0,(r()-.5)*.8,0);if(i<3){const w2=w*.6,h2=.4+r()*.5;put(root,box(w2,h2,d*.6,m,{s:.8,ox:r()*4,oy:r()*4,oz:r()*4}),x+(r()-.5)*.2,h+h2/2,z+(r()-.5)*.2,0,r(),0);}});
  for(let i=0;i<5;i++){const a=r()*6.28,d=1.4+r()*.6,sz=.15+r()*.25;bx(root,sz,sz*.7,sz,m,Math.cos(a)*d,sz*.35,Math.sin(a)*d,0,r(),0);}return root;}
function wlSpire(s){const root=wlRoot(3.2),r=mulberry32((s||1)*367),m=vm('wRock');const n=8+Math.floor(r()*4);let x=0,z=0;
  for(let i=0;i<n;i++){const k=1-i/n,w=.4+2*k,h=.8;bx(root,w,h,w*(.8+r()*.3),m,x,i*h+h/2,z,0,r()*.6,0);x+=(r()-.5)*.25;z+=(r()-.5)*.25;}
  for(let i=0;i<6;i++){const a=r()*6.28,d=1.6+r()*.6,sz=.2+r()*.4;bx(root,sz,sz*.7,sz,m,Math.cos(a)*d,sz*.35,Math.sin(a)*d,0,r(),0);}return root;}
function wlBog(s){const root=wlRoot(3.4),r=mulberry32((s||1)*373),Rx=2.6,Rz=1.9,c=.4;
  for(let k=-6;k<=6;k++){let run=null;const flush=()=>{if(run){const w=bx(root,(run[1]-run[0]+1)*c,.02,c,BOGMAT,(run[0]+run[1])/2*c,.07,k*c);w.castShadow=false;run=null;}};
    for(let i=-8;i<=8;i++){const x=i*c,z=k*c,d=(x/Rx)**2+(z/Rz)**2+(r()-.5)*.12;if(d>1.45){flush();continue;}if(d>1){bx(root,c,.1,c,vm('mud'),x,.05,z);flush();}else{bx(root,c,.02,c,vm('bog'),x,.01,z);if(run)run[1]=i;else run=[i,i];}}flush();}
  for(let i=0;i<16;i++){const a=r()*6.28,d=Math.sqrt(r()),x=Math.cos(a)*d*(Rx-.3),z=Math.sin(a)*d*(Rz-.3),h=.7+r()*.8,g=new THREE.Group();put(root,g,x,0,z,(r()-.5)*.25,r()*3,(r()-.5)*.25);bx(g,.04,h,.04,vm('deadReed'),0,h/2,0);if(r()<.4)bx(g,.08,.2,.08,vm('cattail'),0,h-.12,0);}
  for(let i=0;i<4;i++){const a=r()*6.28,d=r()*.6;bx(root,.07,.05,.07,vm('bog'),Math.cos(a)*d*Rx,.08,Math.sin(a)*d*Rz);}
  wlBone(root,.6,1.1,0,.6,.4);wlSkull(root,-1.2,.0,-.3,1.1,.8);for(let i=0;i<8;i++){const a=r()*6.28;wlTuft(root,Math.cos(a)*(Rx+.4),0,Math.sin(a)*(Rz+.4),r,r()<.5);}return root;}
WL('deadtree-small','nature','Dead tree small',wlDeadTree('small'),'Bare, crooked dead tree about 3 m high with grey weathered bark, twisted branches and roots spreading over the ground. New look gives a new shape.',{variants:true,defaultSeed:1});
WL('deadtree-large','nature','Dead tree large',wlDeadTree('large'),'Big bare dead tree about 6 m high: crooked trunk, long forked branches, splayed roots. New look gives a new shape.',{variants:true,defaultSeed:1});
WL('burnt-tree','nature','Burnt tree',wlBurntTree,'Charred black trunk snapped off at the top, a couple of stubby branches, on a scorched patch with burnt sticks. New look gives a new shape.',{variants:true,defaultSeed:1});
WL('thorn','nature','Thorn bush',wlThorn,'Low tangle of dark thorny twigs with pale thorns and a few dead leaves. New look gives a new shape.',{variants:true,defaultSeed:1});
WL('drygrass','nature','Dry grass',wlDryGrass,'Clump of tall and short dead grass tufts.',{variants:true,defaultSeed:1});
WL('boulder','nature','Jagged boulder',wlBoulder,'Dark angular boulder of stacked rock blocks with dusty tops and loose stones. New look gives a new shape.',{variants:true,defaultSeed:1});
WL('spire','nature','Rock spire',wlSpire,'Tall leaning needle of dark rock, 6 to 9 m, narrowing to the top. New look gives a new shape.',{variants:true,defaultSeed:1});
WL('bog','nature','Bog pool',wlBog,'Murky green pool in a ring of mud with dead reeds, bubbles, a sunken bone and a skull at the edge.',{variants:true,defaultSeed:1});

/* ======================= props ======================= */
function wlBones(s){const root=wlRoot(2),r=mulberry32((s||1)*379);for(let i=0;i<7;i++){const a=r()*6.28,d=Math.sqrt(r())*1.1;wlBone(root,.3+r()*.4,Math.cos(a)*d,0,Math.sin(a)*d,r()*3);}wlSkull(root,.2,0,.1,1,r()*6);if(r()<.7)wlSkull(root,-.6,0,-.4,.9,r()*6);return root;}
function wlSkullPile(s){const root=wlRoot(2),r=mulberry32((s||1)*383);const L0=[[-.3,-.15],[0,-.15],[.3,-.15],[-.15,.12],[.15,.12],[-.45,.12],[.45,.12],[0,-.42]];L0.forEach(([x,z])=>wlSkull(root,x,0,z,1,(r()-.5)*.8));
  [[-.15,-.02],[.15,-.02],[0,-.28],[-.3,.12],[.3,.12]].forEach(([x,z])=>wlSkull(root,x,.23,z,1,(r()-.5)*.8));[[0,-.1],[-.15,.05],[.15,.05]].forEach(([x,z])=>wlSkull(root,x,.46,z,1,(r()-.5)*.6));wlSkull(root,0,.69,-.02,1,0);
  for(let i=0;i<6;i++){const a=r()*6.28,d=.8+r()*.4;wlBone(root,.3+r()*.3,Math.cos(a)*d,0,Math.sin(a)*d,r()*3);}return root;}
function wlRibcage(s){const root=wlRoot(5.6),r=mulberry32((s||1)*389),b=vm('bone'),Ys=1.6,L=5,R=1.5;const sp=x=>Ys*Math.sqrt(Math.max(0,1-(x/(L*.5))**2));
  for(let x=-L/2;x<=L/2+.01;x+=.25){const y=sp(x);if(y<.12)continue;bx(root,.27,.2,.24,b,x,y,0);bx(root,.08,.16,.08,b,x,y+.17,0);}
  for(let i=0;i<7;i++){const x=-1.6+i*.5,y0=sp(x),rr=R*(1-Math.abs(i-3)*.08);for(const sd of[-1,1]){if(i===5&&sd===1)continue;let p=[x,y0,0];const n=6;for(let k=1;k<=n;k++){const t=k/n,q=[x+t*.15,y0*Math.cos(t*Math.PI/2),sd*rr*Math.sin(t*Math.PI*.55)];wlBeam(root,p,q,.1,b);p=q;}bx(root,.12,.08,.12,b,p[0],.04,p[2]);}}
  wlBone(root,1,1.2,0,1.5,.3);wlHornSkull(root,L/2+.5,0,.1,1.6,Math.PI/2+.2);for(let i=0;i<3;i++)wlBone(root,.8+r()*.6,(r()-.5)*4,0,(r()<.5?-1:1)*(1.8+r()*.4),r()*3);
  for(let i=0;i<8;i++){const a=r()*6.28,d=2+r()*1.5;wlTuft(root,Math.cos(a)*d,0,Math.sin(a)*d,r,r()<.5);}return root;}
/* rusted sword stuck in the ground at an angle, hilt up */
function wlStuckSword(par,x,z,ry,tilt,depth=.25){const g=new THREE.Group();put(par,g,x,0,z,0,ry,0);const t=new THREE.Group();put(g,t,0,0,0,tilt,0,0);const ru=vm('rustIron');
  bx(t,.07,.9,.02,ru,0,.45-depth,0);bx(t,.22,.05,.07,ru,0,.9-depth+.025,0);bx(t,.05,.22,.05,vm('leather'),0,1.04-depth,0);bx(t,.08,.07,.07,ru,0,1.18-depth,0);return g;}
function wlBattlefield(s){const root=wlRoot(3.4),r=mulberry32((s||1)*397);for(let i=0;i<5;i++){const a=r()*6.28,d=.4+r()*2;wlStuckSword(root,Math.cos(a)*d,Math.sin(a)*d,r()*6,(r()-.5)*.5);}
  for(let i=0;i<3;i++){const a=r()*6.28,d=.5+r()*1.8,sh=new THREE.Group();put(root,sh,Math.cos(a)*d,.025,Math.sin(a)*d,-Math.PI/2,0,r()*3);wlShield(sh,.36,r()<.5?'planks':'planksDark');}
  {const sh=new THREE.Group();put(root,sh,-1.6,.025,1.2,-Math.PI/2,0,.7);wlShield(sh,.3,'planksDark');}
  {const h=new THREE.Group();put(root,h,.9,0,-1.1,0,.5,0);bx(h,.34,.04,.36,vm('rustIron'),0,.02,0);bx(h,.28,.2,.3,vm('rustIron'),0,.14,0);bx(h,.2,.04,.02,vm('dark'),0,.16,.151);}
  {const sp=new THREE.Group();put(root,sp,-.5,.03,-1.6,0,1.1,0);bx(sp,1.2,.06,.06,vm('planksDark'),0,0,0);bx(sp,.14,.04,.06,vm('rustIron'),.67,0,0);bx(sp,.9,.06,.06,vm('planksDark'),-.3,0,.3,0,.5,0);}
  for(let i=0;i<6;i++){const a=r()*6.28,d=.3+r()*2.2,g=new THREE.Group();put(root,g,Math.cos(a)*d,0,Math.sin(a)*d,0,r()*6,0);const t=new THREE.Group();put(g,t,0,0,0,.4+r()*.3,0,0);bx(t,.025,.6,.025,vm('planks'),0,.18,0);bx(t,.06,.08,.01,vm('woolWhite'),0,.44,0);}
  wlBones(3).children.forEach(c=>root.add(c.clone()));for(let i=0;i<10;i++){const a=r()*6.28,d=r()*2.6;wlTuft(root,Math.cos(a)*d,0,Math.sin(a)*d,r,r()<.4);}return root;}
function wlCart(s){const root=wlRoot(3),r=mulberry32((s||1)*401),p=vm('planks'),d=vm('planksDark');const c=new THREE.Group();put(root,c,0,0,0,0,.2,0);
  bx(c,1.2,.1,2.2,p,0,.15,0);bx(c,1.3,.1,.14,d,0,.05,-.8);bx(c,1.3,.1,.14,d,0,.05,.8);bx(c,.08,.4,2.2,p,-.56,.4,0);bx(c,1.2,.4,.08,p,0,.4,-1.06);
  bx(c,.08,.4,1.1,p,.56,.4,-.55);bx(c,.08,.15,.6,p,.56,.27,.6);bx(c,.1,.08,1.6,d,.2,.24,1.9,0,.15,0);
  {const w=new THREE.Group();put(root,w,1.5,.07,.2,-Math.PI/2,0,0);wlWheel(w);}
  {const a=.32,w=new THREE.Group();put(c,w,-.2,.494,-1.185,a,0,0);wlWheel(w,.5);}
  bx(root,1.1,.06,.12,p,.9,.03,1.2,0,.6,0);for(let i=0;i<3;i++)vSack(root,1.1+i*.3,-.8+i*.25);bx(root,.4,.5,.36,vm('burlap'),.3,.2,1.6,Math.PI/2-.1,.3,0);
  for(let i=0;i<5;i++)bx(root,.09,.05,.7,vm('barrel'),-1.4+i*.12,.025,-1.2,0,.3+i*.2,0);bx(root,.5,.05,.5,p,-1.3,.025,-.3);
  for(let i=0;i<6;i++){const a=r()*6.28,d=1.6+r()*.8;wlTuft(root,Math.cos(a)*d,0,Math.sin(a)*d,r,r()<.5);}return root;}
function wlSignpost(){const root=wlRoot(1.6),r=mulberry32(409);vlog(root,.14,2.2,.14,'y',0,1.1,0);wlSkull(root,0,2.2,0,1.1,0);
  bx(root,.9,.36,.06,vm('planksDark'),.1,1.5,.1,0,0,.08);for(let i=0;i<3;i++)bx(root,.07,.26,.02,vm('liqRed'),-.12+i*.14,1.5,.14,0,0,.35);bx(root,.12,.12,.12,vm('rope'),0,1.5,.04);
  bx(root,.12,.04,.12,vm('rope'),0,1.88,0);for(let i=0;i<4;i++){const a=i*1.6+.3;wlTuft(root,Math.cos(a)*.4,0,Math.sin(a)*.4,r,i%2===0);}return root;}
function wlCairn(s){const root=wlRoot(1.6),r=mulberry32((s||1)*419),mats=[vm('wRock'),vm('cobble'),vm('stone')];let y=0;for(let i=0;i<6;i++){const w=.9-i*.13,h=.22+r()*.1;bx(root,w,h,w*(.8+r()*.3),mats[i%3],(r()-.5)*.06,y+h/2,(r()-.5)*.06,0,r()*3,0);y+=h;}
  wlRubble(root,0,0,6,r,.9,mats,.2);return root;}
WL('bones','props','Scattered bones',wlBones,'A few long bones and one or two skulls lying in the dust.',{variants:true,defaultSeed:1});
WL('skullpile','props','Skull pile',wlSkullPile,'Pyramid of skulls stacked four high, with loose bones around it.',{variants:true,defaultSeed:1});
WL('ribcage','props','Beast skeleton',wlRibcage,'Skeleton of a huge beast half sunk in the ground: arched spine, great curved ribs (one broken), a horned skull at the front and loose leg bones.',{variants:true,defaultSeed:1});
WL('battlefield','props','Battlefield remains',wlBattlefield,'Rusted swords stuck in the ground, broken round shields, a helmet, a snapped spear, spent arrows and bones.',{variants:true,defaultSeed:1});
WL('cart','props','Broken cart',wlCart,'Abandoned cart sitting on its bed: one wheel off and lying flat, the other leaning against the back, a side board split, sacks spilt and a barrel burst into staves.',{variants:true,defaultSeed:1});
WL('signpost','props','Warning post',wlSignpost,'Stake topped with a skull, a plank daubed with three red claw marks lashed to it.');
WL('cairn','props','Cairn',wlCairn,'Marker cairn of stacked flat stones with loose stones around the foot.',{variants:true,defaultSeed:1});
