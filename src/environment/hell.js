/* ======================= HELL KIT (hl-): the burning lands, the infernal citadel, the depths and the demon temple =======================
   Same grid rules as the wasteland and undead kits (docs/WASTELAND.md): 4 m cells, tiles with their top at 0.8 m (place at y = -0.8),
   walls 4 m long between grid vertices, centred on the grid line, outside towards +z, corner pieces on the vertices. See docs/HELL.md.
   Lava is one shared emissive material whose texture slides slowly (root.userData.tick); fire, souls and bubbles are baked clips where they move. */
VXD.hBrim=(P,r)=>wlRockDraw(P,r,'#46292a','#180c0c',4401);
VXD.hBrimTop=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++){const k=r();P(x,y,k<.2?'#52322c':k<.3?'#221414':'#3c2422',nz(r,.86,1.08));}};
VXD.hAsh=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++){const k=r();P(x,y,k<.02?'#a5593a':k<.16?'#1c1a1a':k<.3?'#55504c':'#3a3634',nz(r,.86,1.08));}};
VXD.hAshSide=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,y%5===1?'#1c1818':y%7===4?'#4a4440':'#2e2a28',nz(r,.86,1.08));};
VXD.hSulph=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++){const k=r();P(x,y,k<.12?'#6a5e26':k<.3?'#d4c27a':k<.36?'#4a4420':'#b49a44',nz(r,.86,1.08));}};
VXD.hObs=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++){const k=r(),s=(x+y*2)%9===0;P(x,y,s?'#3e3250':k<.04?'#7a6a94':k<.3?'#1e1824':'#141018',nz(r,.9,1.1));}};
VXD.hBasalt=(P,r)=>{const m=mulberry32(4441),tone=[],brk=[];for(let i=0;i<4;i++){tone.push(.8+m()*.3);brk.push(Math.floor(m()*16));}
  for(let y=0;y<16;y++)for(let x=0;x<16;x++){const c=x>>2,j=x%4===3||y===brk[c];P(x,y,j?'#141214':'#3a3638',j?nz(r,.9,1.05):tone[c]*nz(r,.9,1.06));}};
VXD.hBasaltTop=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++){const j=x%8===7||y%8===7;P(x,y,j?'#161416':r()<.2?'#262224':'#322e30',nz(r,.9,1.06));}};
VXD.hFort=(P,r)=>{const tone=[];for(let i=0;i<8;i++)tone.push(['#3c2e2e','#453434','#352828','#4c3836','#302626'][Math.floor(r()*5)]);
  for(let y=0;y<16;y++){const row=y>>3,off=(row%2)*4;for(let x=0;x<16;x++){const id=row*2+(((x+off)>>3)&1),m=y%8===7||(x+off)%8===7;P(x,y,m?'#160c0c':tone[id],m?nz(r,.9,1.05):nz(r,.88,1.06)*(r()<.05?.82:1));}}};
VXD.hFortDark=(P,r)=>{for(let y=0;y<16;y++){const row=y>>3,off=(row%2)*4;for(let x=0;x<16;x++){const m=y%8===7||(x+off)%8===7;P(x,y,m?'#16100e':'#261c1c',nz(r,.88,1.06));}}};
VXD.hIron=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++){const rv=x%8===2&&y%8===2,e=x%8===7||y%8===7;P(x,y,rv?'#6a605c':e?'#161212':r()<.06?'#572c1e':'#2c2626',nz(r,.9,1.08));}};
VXD.hHorn=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,y%4===0?'#1a1412':'#3a2e28',nz(r,.88,1.08));};
VXD.hBronze=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++){const d=Math.hypot(x-7.5,y-7.5);P(x,y,Math.round(d)%4===0?'#573c1e':r()<.08?'#3e5a3a':'#986b35',nz(r,.9,1.08));}};
VXD.hCloth=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,(x+y)%5===0?'#3a1612':'#4e1a16',nz(r,.88,1.06));};
VXD.hWaxB=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,'#26222a',nz(r,.9,1.06));};
VXD.hEgg=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++){const k=r();P(x,y,k<.12?'#412217':k<.2?'#e8a050':'#ad683d',nz(r,.88,1.08));}};
VXD.hSmokeY=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,r()<.3?'#a8a050':'#d0c878',nz(r,.9,1.06));};
VXD.hCave=(P,r)=>{const m=mulberry32(4451),tone=[];for(let i=0;i<16;i++)tone.push(.8+m()*.28);for(let y=0;y<16;y++)for(let x=0;x<16;x++){const cell=((y>>2)*4+((x+((y>>2)%2)*2)>>2))&15,edge=(y%4===3&&m()<.6)||((x+((y>>2)%2)*2)%4===3&&m()<.5);
  P(x,y,edge?'#1a0e0c':'#402622',edge?nz(r,.9,1.05):tone[cell]*nz(r,.9,1.08));}};
/* glowing textures: the map and its emissive map share one pattern */
const HL_CRK=(()=>{const m=mulberry32(4421),g=[];for(let y=0;y<16;y++)g.push(new Array(16).fill(0));
  for(let c=0;c<4;c++){let x=c*4+1+Math.floor(m()*2);for(let y=0;y<16;y++){g[y][x&15]=1;if(m()<.35){const nx=x+(m()<.5?-1:1);if(nx>=c*4&&nx<=c*4+3){g[y][nx&15]=1;x=nx;}}}}return g;})(); /* four meandering veins running down, one per 4-pixel band, so they never meet or cross */
VXD.hCrust=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++){const c=HL_CRK[y][x];P(x,y,c?'#ff8a2a':r()<.3?'#2e201c':'#221816',c?nz(r,.9,1.05):nz(r,.86,1.08));}};
VXD.hCrustE=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++){const c=HL_CRK[y][x];P(x,y,c?'#ff8a2a':'#000000',c?nz(r,.85,1.05):1);}};
VXD.hLava=(P,r)=>{const TAU=Math.PI*2;for(let y=0;y<16;y++)for(let x=0;x<16;x++){const u=x/16*TAU,v=y/16*TAU,n=Math.sin(u*2+1.4*Math.sin(v))+Math.cos(v*3+.8*Math.sin(u*2))*.8+Math.sin(u+v)*.4;
  P(x,y,n>1.25?'#3c1a10':n>.85?'#7a2410':n>.1?'#d8481a':n>-.7?'#ff8a2a':'#ffcc5c',nz(r,.9,1.06));}};
function hlFlagDraw(P,r,glow){const m=mulberry32(4431),tone=[];for(let i=0;i<8;i++)tone.push(.82+m()*.26);
  for(let y=0;y<16;y++){const row=y>>3,off=(row%2)*4;for(let x=0;x<16;x++){const id=row*2+(((x+off)>>3)&1),j=y%8===7||(x+off)%8===7;
    if(glow)P(x,y,j?'#f0502a':'#000000',j?nz(r,.8,1.05):1);else P(x,y,j?'#ff8a2a':'#2a2228',j?1:tone[id]*nz(r,.9,1.06));}}}
VXD.hFloor=(P,r)=>hlFlagDraw(P,r,false);VXD.hFloorE=(P,r)=>hlFlagDraw(P,r,true);

/* ---------- materials ---------- */
const hlEm=(kind,emKind,base,scale,o={})=>{const m=new THREE.MeshStandardMaterial(Object.assign({map:vxTex(kind),emissiveMap:vxTex(emKind),emissive:new THREE.Color(0xffffff),emissiveIntensity:base,roughness:.85},o));m.userData={glowScale:scale,base};GLOW.push(m);return m;};
const hlGlow=(c,e,base,scale,o={})=>{const m=new THREE.MeshStandardMaterial(Object.assign({color:new THREE.Color(c).convertSRGBToLinear(),emissive:new THREE.Color(e).convertSRGBToLinear(),emissiveIntensity:base,roughness:.6},o));m.userData={glowScale:scale,base};GLOW.push(m);return m;};
const LAVATEX=vxTex('hLava'),LAVAMAT=hlEm('hLava','hLava',.5,.25,{roughness:.55}),CRUSTMAT=hlEm('hCrust','hCrustE',.9,.6),HFLOORMAT=hlEm('hFloor','hFloorE',.22,.22,{roughness:.5});
const OBSMAT=new THREE.MeshStandardMaterial({map:vxTex('hObs'),roughness:.22,metalness:.25});
const HRUNE=hlGlow(0xffdcb8,0xf0502a,1,1.2),HEMBER=hlGlow(0xff9a5a,0xf0502a,.8,.9),HVEIN=hlGlow(0xff8a2a,0xf0502a,.7,.7),HPETAL=hlGlow(0xf0502a,0xf0502a,.6,.8),HCRYS=hlGlow(0xff9a5a,0xf0502a,.9,1,{roughness:.3,metalness:.1}),HEGG=hlGlow(0xff9a5a,0xf0502a,.5,.8,{map:vxTex('hEgg')});
const SOULMAT=hlGlow(0xe8f6ff,0x5ab4ec,.9,.8,{transparent:true,opacity:.72});
const SULPHMAT=new THREE.MeshStandardMaterial({map:vxTex('hSmokeY'),transparent:true,opacity:.5,depthWrite:false,roughness:1});
VXM.hLavaLit=LAVAMAT;VXM.hCrustLit=CRUSTMAT;VXM.hFloorLit=HFLOORMAT;VXM.hObsGloss=OBSMAT;
const hlFireMat=(c,e,op=.88)=>new THREE.MeshStandardMaterial({color:new THREE.Color(c).convertSRGBToLinear(),emissive:new THREE.Color(e).convertSRGBToLinear(),emissiveIntensity:1.0,roughness:.6,transparent:op<1,opacity:op});
const HL_FIRE={orange:[hlFireMat(0xff8a2a,0xf0502a),hlFireMat(0xffcc5c,0xf0a838,1),0xff8a2a],green:[hlFireMat(0xa4ecbc,0x4cd88a),hlFireMat(0xe4fbe8,0xa4ecbc,1),0xa4ecbc],
  blue:[hlFireMat(0xa8dcfa,0x5ab4ec),hlFireMat(0xe8f6ff,0xa8dcfa,1),0x5ab4ec],violet:[hlFireMat(0xcca8f4,0x9a5ae0),hlFireMat(0xf2e4ff,0xcca8f4,1),0x9a5ae0]};
const HL_FIRE_OPT={key:'fire',label:'Fire',choices:[['orange','Hellfire'],['green','Fel green'],['blue','Soul blue'],['violet','Violet']],def:'orange'};

/* ---------- helpers ---------- */
function hlRoot(g){const r=new THREE.Group();r.userData.lights=[];r.userData.ground=g;r.userData.groundKind='hell';return r;}
/* the lava texture slides slowly; every asset with lava calls this from its tick (scenes too) */
function hlLavaTick(){const t=performance.now()/1000;LAVATEX.offset.set(Math.sin(t*.17)*.08,-(t*.06%1));}
function hlTick(root){const p=root.userData.tick;root.userData.tick=(dt,c)=>{hlLavaTick();if(p)p(dt,c);};}
/* lava slab with its top at y */
function hlLava(par,w,d,x,y,z,h=.1){const m=bx(par,w,h,d,LAVAMAT,x,y-h/2,z);m.castShadow=false;return m;}
/* Idle pieces are collected per asset and baked into one Idle clip by hlDone; other clips keep the Idle motion running */
function hlIdle(root,parts,fn){(root.userData.hlIdle||(root.userData.hlIdle=[])).push({parts,fn});}
function hlDone(root,dur=4,defs=[]){const L=root.userData.hlIdle||[];delete root.userData.hlIdle;const idle=(t,S)=>{for(const e of L)e.fn(t%dur,S,dur);};
  const parts=[...new Set([...L.flatMap(e=>e.parts),...defs.flatMap(d=>d.parts||[])])];
  if(parts.length)propAnim(root,parts,[...(L.length?[{name:'Idle',dur,loop:true,fn:idle}]:[]),...defs.map(d=>Object.assign({},d,{fn:(t,S)=>{if(!d.still)idle(t,S);d.fn(t,S);}}))]);
  let lv=false;root.traverse(o=>{if(o.material===LAVAMAT)lv=true;});if(lv)hlTick(root);return root;}
/* hellfire: flickering boxes with an optional light (always on) */
function hlFlame(par,L,x,y,z,s=.3,fire='orange',minI=1,dist=8){const F=HL_FIRE[fire]||HL_FIRE.orange,g=new THREE.Group();put(par,g,x,y,z);
  const a=new THREE.Mesh(new THREE.BoxGeometry(s,s*1.4,s),F[0]);a.position.y=s*.7;const b=new THREE.Mesh(new THREE.BoxGeometry(s*.5,s*.8,s*.5),F[1]);b.position.y=s*.45;const c=new THREE.Mesh(new THREE.BoxGeometry(s*.5,s*.7,s*.5),F[0]);c.position.y=s*1.6;
  for(const m of[a,b,c]){m.castShadow=false;g.add(m);}const ph=x*3.1+z*1.7+y;
  a.onBeforeRender=()=>{const t=performance.now()/1000;a.scale.set(1,1+.12*Math.sin(t*8+ph),1);c.position.set(Math.sin(t*5.3+ph)*s*.12,s*(1.55+.12*Math.sin(t*9.1+ph)),Math.cos(t*4.7+ph)*s*.1);c.rotation.y=t*2+ph;};
  if(L){const pl=new THREE.PointLight(F[2],0,dist,2);pl.position.set(0,s*1.5,0);pl.userData.lamp=true;pl.userData.min=minI;g.add(pl);L.push(pl);}return g;}
/* tapering spike, base at y, pointing up (tilted by rx, rz) */
function hlSpike(par,x,y,z,h,w,mat,rx=0,rz=0){const g=new THREE.Group();put(par,g,x,y,z,rx,0,rz);let yy=0;for(const[k,f]of[[1,.42],[.66,.3],[.4,.18],[.18,.1]]){bx(g,w*k,h*f,w*k,mat,0,yy+h*f/2,0);yy+=h*f;}return g;}
/* horn curving outwards (sd = -1 left, 1 right) and up, base at the origin of the group */
function hlHorn(par,x,y,z,s,sd,mat,ry=0,rz=0){const g=new THREE.Group();put(par,g,x,y,z,0,ry,rz);const P=[[0,0],[.3,.14],[.56,.42],[.66,.78],[.58,1.1]],W=[.3,.25,.19,.13,.07];
  for(let i=0;i<4;i++){const a=[sd*P[i][0]*s,P[i][1]*s,0],b=[sd*P[i+1][0]*s,P[i+1][1]*s,0];wlBeam(g,a,b,W[i]*s,mat);bx(g,W[i+1]*s*1.1,W[i+1]*s*1.1,W[i+1]*s*1.1,mat,b[0],b[1],0);}return g;}
/* chain of alternating links from a to b, sagging by sag in the middle */
function hlChain(par,a,b,sag=0,mat=vm('iron'),lk=.11){const A=new THREE.Vector3(...a),B=new THREE.Vector3(...b),n=Math.max(2,Math.ceil(A.distanceTo(B)/lk)),P=[];
  for(let i=0;i<=n;i++){const u=i/n,p=A.clone().lerp(B,u);p.y-=sag*4*u*(1-u);P.push(p.toArray());}for(let i=0;i<n;i++)wlBeam(par,P[i],P[i+1],i%2?.024:.07,mat,i%2?.07:.024);return P;}
/* glowing glyph on a face (facing +z): diamond, chevron, bars, eye, tri, zig (never a cross) */
const HL_GLYPHS=['diamond','chevron','bars','eye','tri','zig'];
function hlGlyph(par,kind,x,y,z,s=1,mat=HRUNE){const g=new THREE.Group();put(par,g,x,y,z);g.scale.setScalar(s);const t=.03,ring=(sx,sy)=>{const q=new THREE.Group();put(g,q,0,0,0,0,0,Math.PI/4);q.scale.set(sx,sy,1);for(const[a,b,w,h]of[[0,.1,.2,.04],[0,-.1,.2,.04],[-.1,0,.04,.2],[.1,0,.04,.2]])bx(q,w,h,t,mat,a,b,0);};
  if(kind==='diamond')ring(1,1);else if(kind==='eye'){ring(1.3,.7);bx(g,.05,.05,t,mat,0,0,.005);}
  else if(kind==='chevron')for(const sd of[-1,1])bx(g,.05,.2,t,mat,sd*.06,.02,0,0,0,sd*.6);
  else if(kind==='bars')for(const[a,h]of[[-.08,.16],[0,.26],[.08,.16]])bx(g,.04,h,t,mat,a,0,0);
  else if(kind==='tri'){bx(g,.24,.04,t,mat,0,-.08,0);for(const sd of[-1,1])bx(g,.04,.24,t,mat,sd*.06,.02,0,0,0,sd*.46);}
  else for(let i=0;i<3;i++)bx(g,.04,.12,t,mat,-.08+i*.08,0,0,0,0,(i%2?-1:1)*.5);return g;}
/* a soul: pale glowing wisp, tail at the origin, face towards +z */
function hlSoul(par,x,y,z,s=1){const g=new THREE.Group();put(par,g,x,y,z);g.scale.setScalar(s);for(const[w,h,yy]of[[.08,.14,.07],[.14,.16,.21],[.2,.18,.38],[.26,.28,.61]])bx(g,w,h,w*.9,SOULMAT,0,yy,0);
  for(const sd of[-1,1])bx(g,.05,.07,.02,vm('dark'),sd*.06,.66,.12);bx(g,.06,.08,.02,vm('dark'),0,.53,.12);return g;}
/* bubbles on a lava surface at height y: they swell and pop in the Idle clip */
function hlBubbles(root,pts,y){const parts=[];for(const[x,z,s]of pts){const g=new THREE.Group();g.name='bubble';put(root,g,x,y,z);const m=bx(g,.18*(s||1),.12*(s||1),.18*(s||1),HEMBER,0,0,0);m.castShadow=false;paHide(g);g.userData.ph=parts.length*.37%1;parts.push(g);}
  parts.forEach((g,i)=>g.name='bubble_'+i);hlIdle(root,parts,(t,S,dur)=>{for(const g of parts){const u=(t/dur*2+g.userData.ph)%1;S[g.name]={s:u<.7?.2+u/.7*.8:u<.76?1.25:1e-4};}});}
/* smoke cubes rising from a point (sulphur vents, pyres) */
function hlSmoke(root,x,y,z,n,mat,H=4,sz=.5){const parts=[];for(let i=0;i<n;i++){const g=new THREE.Group();g.name='smk_'+i;put(root,g,x,y,z);const m=new THREE.Mesh(new THREE.BoxGeometry(sz,sz,sz),mat);m.castShadow=false;g.add(m);paHide(g);parts.push(g);}
  hlIdle(root,parts,(t,S,dur)=>{parts.forEach((g,i)=>{const u=(t/dur+i/n)%1,big=.4+u*1.8;S[g.name]={p:[x+Math.sin(u*5+i*2)*.3*u+u*.5,y+u*H,z+Math.cos(u*4+i*3)*.3*u],r:[u*2,u*3+i,0],s:u<.1?u*10*big:u>.8?(1-u)*5*big:big};});});}
function hlUniq(list,base){list.forEach((o,i)=>o.name=base+'_'+i);}

FOLDERS[''].children.push('hell');
FOLDERS['hell']={name:'Hell kit',blurb:'The burning lands, the infernal citadel, the depths and the demon temple, on a 4 m grid',children:['hell/terrain','hell/nature','hell/props']};
FOLDERS['hell/terrain']={name:'Terrain',blurb:'Brimstone, ash, glowing crust, sulphur, obsidian, lava shores and rivers, obsidian road, basalt cliffs (4 × 4 m)',children:[]};
FOLDERS['hell/nature']={name:'Nature',blurb:'Basalt columns, brimstone spires, obsidian shards, magma boulders, vents, fire geysers, charred and bone trees, fire lilies, lava pools',children:[]};
FOLDERS['hell/props']={name:'Props',blurb:'Chains, soul cages, spikes, pyres, braziers, soul lanterns, gong, idol, rune stones, portal, soul crystal, cauldron, forge, nests',children:[]};
const HL=(id,f,name,build,desc,o={})=>ASSETS.push(Object.assign({id:'hl-'+id,folder:'hell/'+f,name,build,desc},o));

/* ======================= terrain ======================= */
const hlTileMats0=tileMats;tileMats=function(){const m=hlTileMats0();Object.assign(m,{hBrim:{top:vm('hBrimTop'),side:vm('hBrim')},hBrimHi:{top:vm('hBrimTop'),side:vm('hBrim'),h:T+.12},
  hAsh:{top:vm('hAsh'),side:vm('hAshSide')},hAshDrift:{top:vm('hAsh'),side:vm('hAshSide'),h:T+.06},hCrust:{top:CRUSTMAT,side:vm('hBrim'),h:T-.02},hSulph:{top:vm('hSulph'),side:vm('hBrim'),h:T+.02},
  hObs:{top:OBSMAT,side:vm('hBrim'),h:T+.02},hRoad:{top:HFLOORMAT,side:vm('hFortDark'),h:T+.02},hKerb:{top:vm('hFortDark'),side:vm('hFortDark'),h:T+.14},
  hLava:{top:LAVAMAT,side:LAVAMAT,h:.5},hShelf:{top:CRUSTMAT,side:vm('hBrim'),h:.62}});return m;};
function hlEmbers(root,at,kinds,n,seedN,y=T){const r=mulberry32(seedN);for(let i=0;i<n;i++){const x=(r()-.5)*3.7,z=(r()-.5)*3.7;if(!kinds.includes(at(x,z)))continue;bx(root,.05,.03,.05,HEMBER,x,y+.015,z,0,r()*3,0).castShadow=false;}}
function hlTile(kind){
  if(kind==='brim')return hlDone(vTile((x,z)=>wlNoise(x,z)>1.9?'hBrimHi':wlNoise(x*.8+3,z*.8-1)<-2.1?'hAsh':'hBrim',(root,at)=>{wlPebbles(root,16,4501,['hBrim','hAsh'],at,['hBrim','hBasalt','hObs']);
    const r=mulberry32(4503);for(let i=0;i<5;i++){const x=(r()-.5)*3.2,z=(r()-.5)*3.2;if(at(x,z)!=='hBrim')continue;hlSpike(root,x,T-.06,z,.3+r()*.4,.16+r()*.1,vm('hBrim'),(r()-.5)*.4,(r()-.5)*.4);}}));
  if(kind==='ash')return hlDone(vTile((x,z)=>wlNoise(x,z,.8)>1.5?'hAshDrift':'hAsh',(root,at)=>{hlEmbers(root,at,['hAsh'],14,4511);const r=mulberry32(4513);
    for(let i=0;i<3;i++){const x=(r()-.5)*3,z=(r()-.5)*3;if(at(x,z)==='hAsh')bx(root,.4+r()*.3,.06,.06,vm('wCharBark'),x,T+.03,z,0,r()*3,0);}}));
  if(kind==='crust')return hlDone(vTile((x,z)=>wlNoise(x*1.1,z*1.1)>.2?'hCrust':'hBrim',(root,at)=>{wlPebbles(root,10,4521,['hBrim'],at,['hBrim','hBasalt']);hlEmbers(root,at,['hBrim'],6,4523);}));
  if(kind==='sulphur')return hlDone(vTile((x,z)=>wlNoise(x,z,.9)>-.3?'hSulph':'hBrim',(root,at)=>{const r=mulberry32(4531);let n=0;
    for(let i=0;i<12&&n<3;i++){const x=(r()-.5)*2.8,z=(r()-.5)*2.8;if(at(x,z)!=='hSulph'||at(x+.3,z)!=='hSulph'||at(x-.3,z)!=='hSulph'||at(x,z+.3)!=='hSulph'||at(x,z-.3)!=='hSulph')continue;n++;
      bx(root,.22,.02,.22,vm('dark'),x,T+.03,z).castShadow=false;for(let k=0;k<5;k++){const a=k/5*6.28+r(),d=.17+r()*.05;bx(root,.07,.05+r()*.05,.07,vm('hSulph'),x+Math.cos(a)*d,T+.04,z+Math.sin(a)*d,0,r()*3,0);}}
    wlPebbles(root,8,4533,['hBrim'],at,['hBrim','hSulph']);}));
  if(kind==='obsidian')return hlDone(vTile((x,z)=>wlNoise(x,z,.9)>-.4?'hObs':'hBrim',(root,at)=>{const r=mulberry32(4541);
    for(let i=0;i<7;i++){const x=(r()-.5)*3.2,z=(r()-.5)*3.2;if(at(x,z)!=='hObs')continue;hlSpike(root,x,T-.05,z,.2+r()*.4,.12+r()*.1,OBSMAT,(r()-.5)*.6,(r()-.5)*.6);}wlPebbles(root,8,4543,['hBrim'],at,['hBrim']);}));
  if(kind==='bones')return hlDone(vTile((x,z)=>wlNoise(x,z)>1.3?'hBrim':'hAsh',(root,at)=>{const r=mulberry32(4551);for(let i=0;i<9;i++){const x=(r()-.5)*3.2,z=(r()-.5)*3.2;wlBone(root,.25+r()*.35,x,T,z,r()*3);}
    for(let i=0;i<2;i++){const x=(r()-.5)*3,z=(r()-.5)*3;wlSkull(root,x,T,z,.9,r()*6);}wlHornSkull(root,.9,T,-.8,.9,2.2);hlEmbers(root,at,['hAsh'],6,4553);}));}
[['brim','Brimstone','Dark red brimstone rock, raised slabs, loose stones and small rock spikes.'],['ash','Ash plain','Grey-black ash in low drifts with charred sticks and glowing embers.'],
 ['crust','Glowing crust','Cooled lava crust split by glowing orange cracks (they glow at night), between brimstone patches.'],['sulphur','Sulphur crust','Yellow sulphur crust with small smoking vent holes ringed by crystals.'],
 ['obsidian','Obsidian field','Glossy black volcanic glass with small shards sticking up, brimstone at the edges.'],['bones','Bone-strewn ash','Ash and brimstone littered with bones, two skulls and a horned beast skull.']]
 .forEach(([k,n,d])=>HL('t-'+k,'terrain',n,()=>hlTile(k),d+' 4 × 4 m tile, top at 0.8 m like the other terrain tiles.',{groundR:-1}));
/* lava: f(x,z) is the distance into the land side; land, a glowing crust shelf, then lava 0.3 m below the ground */
function hlLavaTile(kind){const gL=kind.startsWith('river')||kind==='pool'?.6:1.2;
  const f=(x,z)=>kind==='open'?99:kind==='shore'?x+2:kind==='shore-c'?Math.min(x+2,z+2):kind==='shore-o'?Math.hypot(x+2,z+2):kind==='river'?2-Math.abs(x):kind==='river-c'?2-Math.abs(Math.hypot(x-2,z-2)-2):2.6-Math.hypot(x,z);
  const lava=(x,z)=>kind==='open'||f(x,z)>=gL+.4;
  return hlDone(vTile((x,z)=>{if(kind==='open')return'hLava';const d=f(x,z);return d<gL?(wlNoise(x,z)>1.5?'hAsh':'hBrim'):d<gL+.4?'hShelf':'hLava';},(root,at)=>{const r=mulberry32(4561+kind.length*7),pts=[];
    for(let i=0;i<40&&pts.length<(kind==='open'?5:3);i++){const x=(r()-.5)*3.4,z=(r()-.5)*3.4;if(lava(x,z)&&lava(x+.3,z)&&lava(x-.3,z)&&lava(x,z+.3)&&lava(x,z-.3))pts.push([x,z,.8+r()*.6]);}hlBubbles(root,pts,.5);
    for(let i=0;i<30;i++){const x=(r()-.5)*3.4,z=(r()-.5)*3.4,w=.3+r()*.4,d=.3+r()*.3;if([[0,0],[w/2,d/2],[-w/2,d/2],[w/2,-d/2],[-w/2,-d/2]].every(([a,b])=>lava(x+a,z+b))&&!pts.some(p=>Math.hypot(p[0]-x,p[1]-z)<.6)&&r()<.25)bx(root,w,.1,d,CRUSTMAT,x,.51,z,0,r()*3,0);}
    if(kind!=='open')wlPebbles(root,10,4563,['hBrim','hAsh'],at,['hBrim','hBasalt']);}),6);}
[['open','Lava','Open lava: glowing molten rock sliding slowly, crust rafts and bubbles that swell and pop.'],['shore','Lava shore','Brimstone bank on the west edge, a step of glowing crust, then lava towards +x.'],
 ['shore-c','Lava shore inner corner','Land on the west and north edges, lava in the south-east.'],['shore-o','Lava shore outer corner','A corner of land in the north-west, lava everywhere else.'],
 ['river','Lava river','A 2 m channel of lava running north–south between crust shelves and brimstone banks.'],['river-c','Lava river bend','The lava channel turning from the south edge to the east edge.'],['pool','Lava pit','A round pit of lava in the middle of the tile, ringed by crust.']]
 .forEach(([k,n,d])=>HL('t-lava'+(k==='open'?'':'-'+k),'terrain',n,()=>hlLavaTile(k),d+' 4 × 4 m tile; the lava lies 0.3 m below the ground.',{groundR:-1}));
function hlRoadTile(shape){const half=1.2,d0=(x,z)=>shape==='c'?Math.abs(Math.hypot(x-2,z-2)-2):shape==='t'?Math.min(Math.abs(x),x>0?Math.abs(z):99):Math.abs(x);
  return hlDone(vTile((x,z)=>{const d=d0(x,z);return d<half?'hRoad':d<half+.4?'hKerb':wlNoise(x,z)>1.4?'hAsh':'hBrim';},(root,at)=>{const r=mulberry32(4571+shape.length);
    for(let k=0;k<10;k++)for(let i=0;i<10;i++){const x=-1.8+i*.4,z=-1.8+k*.4;if(at(x,z)==='hKerb'&&(i*3+k*7)%5===0)hlSpike(root,x,T+.14,z,.36,.14,vm('hIron'));}wlPebbles(root,8,4573,['hBrim'],at,['hBrim']);}));}
[['','Obsidian road','Straight road of black flagstones whose joints glow, between dark kerbs studded with iron spikes.'],['-c','Obsidian road corner','Curved quarter turn of the road, south edge to east edge.'],['-t','Obsidian road T-junction','The north–south road with a branch to the east.']]
 .forEach(([s,n,d])=>HL('t-road'+s,'terrain',n,()=>hlRoadTile(s?s.slice(1):'s'),d+' 4 × 4 m tile.',{groundR:-1}));
/* basalt cliff: high cells are 4 m columns whose tops step by 0.2 m, so the face reads as basalt columns */
function hlCliff(hi,seedN,fall){const root=new THREE.Group();root.userData.lights=[];root.userData.ground=-1;const r=mulberry32(seedN),c=.4,N=10,H=4,bs=vm('hBasalt'),bt=vm('hBasaltTop'),ah=vm('hAsh'),as=vm('hAshSide');
  /* with a fall the cells round the notch keep a straight edge at z = 1.2, and the low ground in front is a lava channel matching the lava river tile (lava |x| < 1.2, crust shelf to 1.6) */
  const cells=[];for(let k=0;k<N;k++){cells.push([]);for(let i=0;i<N;i++){const x=-2+c/2+i*c,z=-2+c/2+k*c,j=fall&&Math.abs(x)<1.7?0:Math.sin(x*3.1+z*1.3)*.2+Math.cos(z*2.7-x*1.9)*.15;cells[k].push(hi(x+j,z+j));}}
  const isHi=(i,k)=>i<0||k<0||i>=N||k>=N?null:cells[k][i];
  for(let k=0;k<N;k++)for(let i=0;i<N;i++){const x=-2+c/2+i*c,z=-2+c/2+k*c;
    if(!cells[k][i]){if(fall&&Math.abs(x)<1.2)bx(root,c,.5,c,[LAVAMAT,LAVAMAT,LAVAMAT,bs,LAVAMAT,LAVAMAT],x,.25,z).castShadow=false;else if(fall&&Math.abs(x)<1.6)bx(root,c,.62,c,[bs,bs,CRUSTMAT,bs,bs,bs],x,.31,z);else bx(root,c,T,c,[as,as,ah,ah,as,as],x,T/2,z);continue;}
    const edge=[[1,0],[-1,0],[0,1],[0,-1]].some(([a,b])=>isHi(i+a,k+b)===false),col=((i>>1)*7+(k>>1)*3)%5,h=T+H-(edge?[0,.2,.4,.2,.6][col]:[0,.2,0,.2,0][col]);
    if(fall&&Math.abs(x)<.8&&edge){const h2=T+H-.4;bx(root,c,h2,c,[bs,bs,CRUSTMAT,bs,bs,bs],x,h2/2,z);continue;}bx(root,c,fall&&Math.abs(x)<1.7&&edge?T+H:h,c,[bs,bs,bt,bs,bs,bs],x,(fall&&Math.abs(x)<1.7&&edge?T+H:h)/2,z);}
  if(fall){const zE=1.2,top=T+H-.4,lf=bx(root,1.2,top-.5,.2,LAVAMAT,0,.5+(top-.5)/2,zE+.1);lf.castShadow=false;bx(root,1.2,.08,.5,LAVAMAT,0,top+.02,zE-.2).castShadow=false;const drops=[];
    for(let i=0;i<6;i++){const g=new THREE.Group();g.name='drop_'+i;put(root,g,(i%3-1)*.36,0,zE+.3);bx(g,.14,.2,.14,HEMBER,0,0,0).castShadow=false;drops.push(g);}
    hlIdle(root,drops,(t,S,dur)=>{drops.forEach((g,i)=>{const u=(t/dur*2+i/6)%1;S[g.name]={p:[(i%3-1)*.36,top-.2-u*u*(top-.7),zE+.3+u*.15],s:u>.95?1e-4:1};});});
    hlBubbles(root,[[-.5,1.7,1],[.4,1.6,.8]],.5);const pl=new THREE.PointLight(0xf0502a,0,9,2);pl.position.set(0,1.5,2);pl.userData.lamp=true;pl.userData.min=.8;root.add(pl);root.userData.lights.push(pl);}
  else{const tr=mulberry32(seedN+5);for(let i=0;i<6;i++){const x=(tr()-.5)*3.6,z=(tr()-.5)*3.6,ii=Math.min(N-1,Math.floor((x+2)/c)),kk=Math.min(N-1,Math.floor((z+2)/c));if(!cells[kk][ii])bx(root,.1+tr()*.1,.06,.12,vm('hBasalt'),x,T+.03,z,0,tr()*3,0);}}
  return hlDone(root,3);}
HL('t-cliff','terrain','Basalt cliff',()=>hlCliff((x,z)=>z<1.2,4581),'Cliff edge of basalt columns: high ground 4 m above the tile top, the face towards +z made of columns that step at the top; ash below.',{groundR:-1});
HL('t-cliff-o','terrain','Basalt cliff outer corner',()=>hlCliff((x,z)=>z<1.2&&x<1.2,4583),'Outer corner of the basalt cliff: faces towards +z and +x.',{groundR:-1});
HL('t-cliff-i','terrain','Basalt cliff inner corner',()=>hlCliff((x,z)=>z<1.2||x<-1.2,4585),'Inner corner of the basalt cliff: high ground on the north and west sides.',{groundR:-1});
HL('t-cliff-top','terrain','Basalt cliff top',()=>hlCliff(()=>true,4587),'Solid basalt high ground 4 m above the tile top, to fill in behind the cliff edge.',{groundR:-1});
HL('t-lavafall','terrain','Lavafall',()=>hlCliff((x,z)=>z<1.2,4589,true),'The basalt cliff with a notch in its edge: a sheet of lava pours down the face into a lava channel at the foot that lines up with the lava river tile (place one to the south), glowing drops falling with it (Idle).',{groundR:-1});
function hlStairs(){const root=new THREE.Group();root.userData.lights=[];root.userData.ground=-1;const bs=vm('hBasalt'),bt=vm('hBasaltTop'),fl=vm('hFortDark');
  for(let i=0;i<10;i++){const h=T+.4*(i+1),z=4-.4-i*.8;bx(root,3.2,h,.8,[bs,bs,fl,bs,bs,bs],0,h/2,z);for(const s of[-1,1])bx(root,.4,h+.4,.8,[bs,bs,bt,bs,bs,bs],s*1.8,(h+.4)/2,z);if(i%3===1)for(const s of[-1,1])hlSpike(root,s*1.8,h+.4,z,.5,.2,vm('hIron'));}
  return root;}
HL('t-stairs','terrain','Basalt stairs',hlStairs,'Stairs cut into basalt between side walls with iron spikes, 4 m wide and 8 m long (two cells), climbing 4 m from the tile top to the cliff top towards -z.',{groundR:-1});

/* ======================= nature ======================= */
function hlBasaltCols(s){const root=hlRoot(3.2),r=mulberry32((s||1)*4601),bs=vm('hBasalt'),bt=vm('hBasaltTop'),c=.6;
  for(let i=-3;i<=3;i++)for(let k=-3;k<=3;k++){const x=i*c+(k%2?c/2:0),z=k*c*.9,d=Math.hypot(x,z);if(d>1.7)continue;const h=Math.round((1+(1.7-d)*2.4+r()*1.4)/.2)*.2;bx(root,c,h,c,[bs,bs,bt,bs,bs,bs],x,h/2,z);}
  for(let i=0;i<2;i++){const a=r()*6.28,d=2.3+r()*.3,g=new THREE.Group();put(root,g,Math.cos(a)*d,0,Math.sin(a)*d,0,r()*3,0);bx(g,c,c,1.2,[bs,bs,bs,bs,bt,bt],0,c/2,0);}wlRubble(root,0,0,6,r,2.2,[bs],.2);return hlDone(root);}
function hlSpire(s){const root=hlRoot(2.8),r=mulberry32((s||1)*4607),m=vm('hBrim'),H=6+r()*3,n=Math.round(H/.6);let x=0,z=0;const lx=(r()-.5)*.12,lz=(r()-.5)*.12;
  for(let i=0;i<n;i++){const u=i/n,w=1.8*(1-u*.8)+(r()-.5)*.2,d=1.5*(1-u*.8)+(r()-.5)*.2;bx(root,w,.62,d,m,x,i*.6+.31,z);
    if(i%2===0&&i<n-2){const sd=r()<.5?1:-1;bx(root,.04,.5,.06,HVEIN,x+sd*(w/2+.02),i*.6+.3,z+(r()-.5)*.2);}if(i%3===1)bx(root,.06,.62,.04,HVEIN,x+(r()-.5)*.4,i*.6+.31,z+d/2+.01);x+=lx+(r()-.5)*.08;z+=lz+(r()-.5)*.08;}
  for(let k=0;k<3;k++){const a=k*2.1+r(),w=.7+r()*.5;bx(root,w,.5+r()*.6,w,m,Math.cos(a)*1.2,.4,Math.sin(a)*1.1,0,r()*3,0);}wlRubble(root,0,0,8,r,2.2,[m,vm('hBasalt')],.25);return hlDone(root);}
function hlShards(s){const root=hlRoot(2.4),r=mulberry32((s||1)*4613),m=vm('hBrim');for(let k=0;k<9;k++){const a=r()*6.28,d=Math.sqrt(r())*.9;bx(root,.5+r()*.4,.2+r()*.2,.5+r()*.4,m,Math.cos(a)*d,.12,Math.sin(a)*d,0,r()*3,0);}
  for(let k=0;k<8;k++){const a=k/8*6.28+r()*.4,d=k?.3+r()*.6:0,h=k?.6+r()*1.4:2.2+r()*.6,w=k?.2+r()*.16:.42,tilt=k?.15+r()*.4:.05;hlSpike(root,Math.cos(a)*d,-.12,Math.sin(a)*d,h+.12,w,OBSMAT,Math.sin(a)*tilt,-Math.cos(a)*tilt);}
  return hlDone(root);}
function hlBoulder(s){const root=hlRoot(2.8),r=mulberry32((s||1)*4619),m=vm('hBrim'),parts=[[1.8,1.1,1.5,0,0]];for(let i=0;i<5;i++)parts.push([.6+r()*.9,.5+r()*.8,.6+r()*.7,(r()-.5)*1.6,(r()-.5)*1.3]);
  for(const[w,h,d,x,z]of parts){const mats=[m,m,m,m,m,m];for(let f=0;f<2;f++)mats[[0,1,2,4,5][Math.floor(r()*5)]]=CRUSTMAT;bx(root,w,h,d,mats,x,h/2,z,0,r()*.8,0);}return hlDone(root);}
function hlVent(s){const root=hlRoot(2),r=mulberry32((s||1)*4621),su=vm('hSulph'),bm=vm('hBrim');for(const[w,h,y]of[[2.4,.3,.15],[1.7,.3,.45],[1.1,.28,.74]])bx(root,w,h,w,[bm,bm,su,bm,bm,bm],0,y,0);
  bx(root,.5,.02,.5,vm('dark'),0,.89,0).castShadow=false;for(let k=0;k<10;k++){const a=k/10*6.28+r()*.3,d=.32+r()*.1;bx(root,.1,.08+r()*.1,.1,su,Math.cos(a)*d,.92,Math.sin(a)*d,0,r()*3,0);}
  for(let k=0;k<6;k++){const a=r()*6.28,d=1+r()*.3;bx(root,.14,.1,.14,su,Math.cos(a)*d,.34,Math.sin(a)*d,0,r()*3,0);}hlSmoke(root,0,.9,0,7,SULPHMAT,4,.5);return hlDone(root,5);}
function hlGeyser(s){const root=hlRoot(2.2),L=root.userData.lights,r=mulberry32((s||1)*4631),m=vm('hBrim'),F=HL_FIRE.orange;
  for(let k=0;k<12;k++){const a=k/12*6.28,h=.3+r()*.2;bx(root,.5,h,.5,[m,m,CRUSTMAT,m,m,m],Math.cos(a)*.9,h/2,Math.sin(a)*.9,0,-a,0);}hlLava(root,1.4,1.4,0,.16,0,.16);
  const segs=[];for(let i=0;i<8;i++){const g=new THREE.Group();g.name='gy_'+i;put(root,g,0,.16,0);const w=.7-i*.05,a=new THREE.Mesh(new THREE.BoxGeometry(w,1,w),F[0]);a.position.y=.5;a.castShadow=false;g.add(a);
    const b=new THREE.Mesh(new THREE.BoxGeometry(w*.5,.9,w*.5),F[1]);b.position.y=.45;b.castShadow=false;g.add(b);segs.push(g);}
  const emb=[];for(let i=0;i<8;i++){const g=new THREE.Group();g.name='gem_'+i;put(root,g,0,.2,0);bx(g,.1,.1,.1,HEMBER,0,0,0).castShadow=false;paHide(g);emb.push(g);}
  const col=(t,S,H)=>{const n=H<.6?1:8,h=H/n;segs.forEach((g,i)=>{const y=.16+i*h,on=i<n,w=1+.15*Math.sin(t*13+i*2);S[g.name]={p:[Math.sin(t*7+i)*.05*i,y,Math.cos(t*6+i)*.05*i],s:on?[w*(1-i*.04),h,w*(1-i*.04)]:1e-4};});};
  hlIdle(root,segs,(t,S)=>col(t,S,.35+.12*Math.sin(t*9)));
  const pl=new THREE.PointLight(0xff8a2a,0,9,2);pl.position.set(0,1.2,0);pl.userData.lamp=true;pl.userData.min=.8;root.add(pl);L.push(pl);
  return hlDone(root,2,[{name:'Erupt',dur:4,next:'Idle',parts:[...segs,...emb],fn:(t,S)=>{const H=t<.3?.4:t<.7?.4+(t-.3)/.4*6.6:t<2.6?7+.4*Math.sin(t*11):t<3.6?7*(1-(t-2.6)):.4;col(t,S,Math.max(.35,H));
    emb.forEach((g,i)=>{const a=i/8*6.28,f=paFly(t,{t0:.6+i*.12,p0:[0,2+i*.6,0],v:[Math.cos(a)*1.6,3+i*.3,Math.sin(a)*1.6],rest:.05,q0:new THREE.Quaternion(),q1:paQ(1,2,0)});S[g.name]=f?{p:f.p,q:f.q,s:t>3.7?1e-4:1}:{s:1e-4};});}}]);}
function hlTree(size){return s=>{const root=hlRoot(size==='large'?4.4:2.8),r=mulberry32((s||1)*4639+(size==='large'?3:0)),m=vm('wCharBark'),H=size==='large'?5+r()*1.4:2.6+r()*.8,w0=size==='large'?.75:.42,tips=[];
  const pts=wlTrunk(root,m,H,w0,r);for(let i=0;i<5;i++){const a=i*1.26+r()*.5;wlBeam(root,[Math.sin(a)*w0*.3,.35,Math.cos(a)*w0*.3],[Math.sin(a)*(w0*.5+.7),.06,Math.cos(a)*(w0*.5+.7)],w0*.34,m);}
  for(let i=1;i<pts.length-1;i+=2){const p=pts[i],sd=r()<.5?1:-1;bx(root,.03,.4,.05,HVEIN,p[0]+sd*(p[3]/2+.01),p[1]-.25,p[2]);}
  const nb=size==='large'?6:3;for(let i=0;i<nb;i++){const p=pts[Math.min(pts.length-1,Math.floor(pts.length*(.4+i/nb*.55)))];wlBranch(root,m,[p[0],p[1]-.1,p[2]],i*2.2+r(),.2+r()*.5,H*(.4+r()*.2),p[3]*.55,r,size==='large'?2:1,tips);}
  for(const[x,y,z]of tips){const e=r();if(e<.5)bx(root,.09,.09,.09,HEMBER,x,y+.04,z).castShadow=false;}for(let i=0;i<4;i++){const a=r()*6.28,d=.8+r()*1.2;bx(root,.06,.03,.06,HEMBER,Math.cos(a)*d,.015,Math.sin(a)*d).castShadow=false;}return hlDone(root);};}
function hlBoneTree(s){const root=hlRoot(2.8),r=mulberry32((s||1)*4643),b=vm('bone');let x=0,z=0,y=0;const lean=(r()-.5)*.08,pts=[];
  for(let i=0;i<14;i++){const w=.42-i*.016;bx(root,w,.16,w*.9,b,x,y+.08,z);bx(root,w*.5,.1,w*.5,vm('bone'),x,y+.21,z);if(i%2===0)bx(root,.1,.12,.18,b,x,y+.1,z-w*.45-.08);pts.push([x,y,z,w]);y+=.26;x+=lean;z+=(r()-.5)*.03;}
  for(let i=4;i<13;i+=2){const p=pts[i];for(const sd of[-1,1]){const L=1.1-i*.05,a=[p[0]+sd*p[3]*.4,p[1]+.1,p[2]],m=[p[0]+sd*(L*.6),p[1]+.3,p[2]+.25],e=[p[0]+sd*L,p[1]+.75,p[2]+.1];wlBeam(root,a,m,.07,b);wlBeam(root,m,e,.06,b);bx(root,.07,.07,.07,b,m[0],m[1],m[2]);
    if(i===8&&sd>0)wlSkull(root,e[0],e[1]-.02,e[2],.7,0);}}
  const t=pts[pts.length-1];wlHornSkull(root,t[0],t[1]+.24,t[2],1.1,0);for(let k=0;k<5;k++){const a=k/5*6.28+r()*.5;wlBeam(root,[Math.sin(a)*.12,.3,Math.cos(a)*.12],[Math.sin(a)*.9,.04,Math.cos(a)*.9],.08,b);}
  for(let k=0;k<3;k++){const a=r()*6.28,d=1.2+r()*.8;wlBone(root,.4+r()*.3,Math.cos(a)*d,0,Math.sin(a)*d,r()*3);}return hlDone(root);}
function hlLilies(s){const root=hlRoot(1.4),r=mulberry32((s||1)*4649),st=vm('wTwig');for(let k=0;k<9;k++){const a=r()*6.28,d=Math.sqrt(r())*.9,x=Math.cos(a)*d,z=Math.sin(a)*d,h=.4+r()*.5;
    bx(root,.04,h,.04,st,x,h/2,z);for(let l=0;l<3;l++){const la=l*2.1+r();bx(root,.04,.22,.1,st,x+Math.cos(la)*.06,.12,z+Math.sin(la)*.06,Math.sin(la)*.5,la,-Math.cos(la)*.5);}
    const f=new THREE.Group();put(root,f,x,h,z,0,r()*3,0);bx(f,.07,.06,.07,vm('gold'),0,.03,0);for(let p=0;p<4;p++){const pa=p/4*6.28;bx(f,.07,.16,.03,HPETAL,Math.cos(pa)*.06,.08,Math.sin(pa)*.06,Math.sin(pa)*-.5,-pa+Math.PI/2,0);}}
  const pl=new THREE.PointLight(0xf0502a,0,3.5,2);pl.position.set(0,.8,0);pl.userData.lamp=true;pl.userData.min=.3;root.add(pl);root.userData.lights.push(pl);return hlDone(root);}
function hlBurning(s){const root=hlRoot(2),L=root.userData.lights,r=mulberry32((s||1)*4651);for(let i=-4;i<=4;i++)for(let k=-4;k<=4;k++){const x=i*.4,z=k*.4,d=Math.hypot(x,z)+(r()-.5)*.3;if(d>1.5)continue;bx(root,.4,.02,.4,vm(d<1?'wScorch':'hAsh'),x,.01,z).castShadow=false;}
  const flames=[],smokes=[];for(const[x,z,sz]of[[0,0,.6],[.6,.3,.4],[-.5,.4,.45],[.2,-.6,.4],[-.6,-.4,.3]])rdFire(root,x,.02,z,sz,flames);rdUniq(flames);rdSmoke(root,0,.8,0,4,smokes,.5,.6);rdUniq(smokes);
  for(let i=0;i<8;i++){const a=r()*6.28,d=r()*1.2;bx(root,.06,.03,.06,HEMBER,Math.cos(a)*d,.035,Math.sin(a)*d).castShadow=false;}wlBeam(root,[-.9,.06,.8],[.3,.06,1.1],.1,vm('wCharBark'));
  const pl=new THREE.PointLight(0xff8a2a,0,6,2);pl.position.set(0,.8,0);pl.userData.lamp=true;pl.userData.min=.8;root.add(pl);L.push(pl);rdFireAnim(root,flames,smokes,3);return root;}
function hlLavaPool(s){const root=hlRoot(3),L=root.userData.lights,r=mulberry32((s||1)*4657),c=.4,R=1.8,bm=vm('hBrim');
  for(let i=-6;i<6;i++)for(let k=-6;k<6;k++){const x=(i+.5)*c,z=(k+.5)*c,d=Math.hypot(x,z)+(r()-.5)*.25;if(d>R+.6)continue;if(d>R)bx(root,c,.2+r()*.2,c,[bm,bm,r()<.3?CRUSTMAT:vm('hBrimTop'),bm,bm,bm],x,.15,z);else if(d>R-.4)bx(root,c,.18,c,[bm,bm,CRUSTMAT,bm,bm,bm],x,.09,z);}
  for(let k=-5;k<5;k++){let run=null;const flush=()=>{if(run){hlLava(root,(run[1]-run[0]+1)*c,c,((run[0]+run[1])/2+.5)*c,.14,(k+.5)*c,.14);run=null;}};for(let i=-5;i<5;i++){const x=(i+.5)*c,z=(k+.5)*c;if(Math.hypot(x,z)<=R-.4+.12){if(run)run[1]=i;else run=[i,i];}else flush();}flush();}
  hlBubbles(root,[[-.4,.2,1],[.5,-.3,.8],[.1,.6,.7],[-.2,-.6,.9]],.14);const pl=new THREE.PointLight(0xf0502a,0,7,2);pl.position.set(0,1,0);pl.userData.lamp=true;pl.userData.min=1;root.add(pl);L.push(pl);return hlDone(root,5);}
HL('basalt','nature','Basalt columns',hlBasaltCols,'Cluster of square basalt columns rising to about 5 m in the middle, two broken column pieces lying beside it.',{variants:true,defaultSeed:1});
HL('spire','nature','Brimstone spire',hlSpire,'Jagged leaning spire of brimstone, 6 to 9 m, glowing veins running down its faces, boulders and rubble round the foot.',{variants:true,defaultSeed:1});
HL('shards','nature','Obsidian shards',hlShards,'Glossy black glass shards bursting out of a low brimstone mound, the tallest about 2.5 m.',{variants:true,defaultSeed:1});
HL('boulder','nature','Magma boulder',hlBoulder,'Heap of brimstone boulders with glowing cracked faces.',{variants:true,defaultSeed:1});
HL('vent','nature','Sulphur vent',hlVent,'Stepped mound of sulphur crust with a dark vent ringed by crystals; yellow fumes rise and drift (Idle).',{variants:true,defaultSeed:1});
HL('geyser','nature','Fire geyser',hlGeyser,'Crater rimmed with glowing crust round a lava throat. Clips: Idle (low licking flames) and Erupt (a 7 m column of fire blasts up, embers fly out and land, then it dies down).',{variants:true,defaultSeed:1});
HL('tree-small','nature','Charred tree small',hlTree('small'),'Black burnt tree about 3 m with glowing cracks in the trunk and embers on the twig ends.',{variants:true,defaultSeed:1});
HL('tree-large','nature','Charred tree large',hlTree('large'),'Big black burnt tree about 6 m, clawing branches with glowing ember tips and cracks, splayed roots.',{variants:true,defaultSeed:1});
HL('bone-tree','nature','Bone tree',hlBoneTree,'A tree grown of bone: a spine of vertebrae with rib branches, a skull on one rib, a horned skull at the top and rib roots.',{variants:true,defaultSeed:1});
HL('lilies','nature','Fire lilies',hlLilies,'Clump of dark-stemmed lilies whose petals glow like embers, with a dim light of their own.',{variants:true,defaultSeed:1});
HL('burning','nature','Burning ground',hlBurning,'Patch of scorched ash on fire: flames lick (Idle), smoke rises, embers and a charred stick.',{variants:true,defaultSeed:1});
HL('lava-pool','nature','Lava pool',hlLavaPool,'Round pool of lava in a raised rim of brimstone and glowing crust, bubbles swelling and popping (Idle), with a light.',{variants:true,defaultSeed:1});

/* ======================= props ======================= */
function hlChainPost(s){const root=hlRoot(1.8),r=mulberry32((s||1)*4661),ir=vm('hIron');bx(root,.7,.3,.7,vm('hFortDark'),0,.15,0);bx(root,.24,3,.24,ir,0,1.8,0);bx(root,1.3,.2,.2,ir,.53,3.1,0);hlSpike(root,0,3.3,0,.5,.24,ir);hlHorn(root,-.12,2.6,0,.6,-1,vm('hHorn'));
  for(const[x,z,l]of[[.45,.12,.5],[.85,-.1,.35],[1.1,.08,.6]]){bx(root,.08,.08,.08,ir,x,3.0,z);const P=hlChain(root,[x,2.96,z],[x,.06,z]);hlChain(root,[x,.035,z],[x+l*.4,.035,z+l],0);bx(root,.22,.06,.22,ir,x+l*.4,.03,z+l+.1);}
  return hlDone(root);}
function hlSoulCage(s){const root=hlRoot(1.6),r=mulberry32((s||1)*4663),ir=vm('hIron');bx(root,1.3,.3,1.3,vm('hFortDark'),0,.15,0);bx(root,1.1,.08,1.1,ir,0,.34,0);bx(root,1.1,.08,1.1,ir,0,2.1,0);
  for(let i=0;i<5;i++)for(const sd of[-1,1]){bx(root,.05,1.68,.05,ir,-.5+i*.25,1.22,sd*.52);if(i>0&&i<4)bx(root,.05,1.68,.05,ir,sd*.52,1.22,-.5+i*.25);}
  bx(root,.6,.2,.6,ir,0,2.24,0);hlSpike(root,0,2.34,0,.6,.24,ir);for(const[a,b]of[[1,1],[1,-1],[-1,1],[-1,-1]])hlSpike(root,a*.5,2.14,b*.5,.3,.12,ir);
  const soul=hlSoul(root,0,.38,0,1.4);soul.name='soul';const pl=new THREE.PointLight(0x5ab4ec,0,5,2);pl.position.set(0,1.2,0);pl.userData.lamp=true;pl.userData.min=.6;root.add(pl);root.userData.lights.push(pl);
  hlIdle(root,[soul],(t,S,dur)=>{const a=t/dur*Math.PI*2;S.soul={r:[Math.sin(a*2)*.06,Math.sin(a)*.5,Math.sin(a*2+1)*.08],s:[1+.04*Math.sin(a*3),1+.06*Math.sin(a*3+1),1+.04*Math.sin(a*3)]};});
  return hlDone(root,4,[{name:'Rattle',dur:1.6,next:'Idle',parts:[soul],fn:(t,S)=>{const k=1-t/1.6;S.soul={p:[Math.sin(t*31)*.08*k,.38,Math.cos(t*27)*.06*k],r:[Math.sin(t*23)*.25*k,t*4,Math.sin(t*19)*.3*k],s:[1.1,1.2+.15*Math.sin(t*40)*k,1.1]};}}]);}
function hlSpikes(s){const root=hlRoot(2),r=mulberry32((s||1)*4667),ir=vm('hIron');wlMound(root,0,0,.7,r,vm('hBrim'));
  for(let k=0;k<7;k++){const a=k/7*6.28+r()*.4,d=k?.45+r()*.3:0,h=k?1.4+r()*1:2.6,tilt=k?.15+r()*.25:0,mat=k%3===2?vm('bone'):ir;hlSpike(root,Math.cos(a)*d,.2,Math.sin(a)*d,h,.14+r()*.06,mat,Math.sin(a)*tilt,-Math.cos(a)*tilt);
    if(k===0||k===3){const sp=root.children[root.children.length-1];wlSkull(sp,0,h*.62,0,.8,r()*6).rotation.x=0;}}return hlDone(root);}
function hlPyre(s){const root=hlRoot(1.8),L=root.userData.lights,r=mulberry32((s||1)*4673),dk=vm('hFortDark');bx(root,1.8,.3,1.8,dk,0,.15,0);
  const tiers=[[3,.6,.3],[2,.32,.6],[1,0,.9]];for(const[n,off,y]of tiers)for(let i=0;i<n;i++)for(let k=0;k<n;k++)wlSkull(root,(i-(n-1)/2)*.3,y,(k-(n-1)/2)*.3,1.3,(r()-.5)*.6);
  hlFlame(root,L,0,1.18,0,.32,'orange',1);hlSmoke(root,0,1.8,0,4,SMOKEMAT,3,.4);return hlDone(root,4);}
function hlBrazier(s,op){const fire=(op&&op.fire)||'orange',root=hlRoot(1.4),L=root.userData.lights,ir=vm('hIron'),hn=vm('hHorn');
  for(let k=0;k<3;k++){const a=k/3*6.28,c=Math.cos(a),sn=Math.sin(a);wlBeam(root,[c*.55,0,sn*.55],[c*.42,.55,sn*.42],.1,ir);wlBeam(root,[c*.42,.55,sn*.42],[c*.3,1,sn*.3],.09,ir);bx(root,.16,.06,.16,ir,c*.55,.03,sn*.55);}
  for(let k=0;k<8;k++){const a=k/8*6.28;bx(root,.32,.26,.08,ir,Math.cos(a)*.38,1.08,Math.sin(a)*.38,0,-a+Math.PI/2,0);hlSpike(root,Math.cos(a)*.42,1.2,Math.sin(a)*.42,.18,.06,ir);}
  bx(root,.66,.06,.66,ir,0,.98,0);bx(root,.6,.14,.6,CRUSTMAT,0,1.06,0);hlFlame(root,L,0,1.13,0,.34,fire,1);return hlDone(root);}
function hlSoulLantern(s){const root=hlRoot(1.4),ir=vm('hIron');bx(root,.5,.2,.5,vm('hFortDark'),0,.1,0);bx(root,.12,2.6,.12,ir,0,1.5,0);
  const arm=[[0,2.6,0],[.3,2.85,0],[.65,2.9,0],[.85,2.75,0]];for(let i=0;i<3;i++)wlBeam(root,arm[i],arm[i+1],.07,ir);hlSpike(root,0,2.8,0,.3,.12,ir);hlChain(root,[.85,2.72,0],[.85,2.36,0]);
  const g=new THREE.Group();g.name='lantern';put(root,g,.85,2.34,0);bx(g,.3,.04,.3,ir,0,-.02,0);bx(g,.3,.04,.3,ir,0,-.5,0);for(const[a,b]of[[1,1],[1,-1],[-1,1],[-1,-1]])bx(g,.03,.46,.03,ir,a*.13,-.26,b*.13);
  const so=hlSoul(g,0,-.48,0,.42);hlFlame(g,root.userData.lights,0,-.48,0,.08,'blue',.7,6);hlIdle(root,[g],(t,S,dur)=>{const a=t/dur*Math.PI*2;S.lantern={r:[Math.sin(a)*.05,0,Math.sin(a+1)*.06]};});return hlDone(root,4);}
function hlGong(s){const root=hlRoot(2.2),r=mulberry32((s||1)*4679),dk=vm('hFortDark'),ir=vm('hIron');
  for(const sd of[-1,1]){bx(root,.6,.4,.6,dk,sd*1.3,.2,0);bx(root,.26,3,.26,ir,sd*1.3,1.9,0);hlHorn(root,sd*1.3,3.38,0,.9,sd,vm('hHorn'));}bx(root,2.86,.24,.24,ir,0,3.28,0);
  const g=new THREE.Group();g.name='gong';put(root,g,0,3.16,0);for(const sd of[-1,1])hlChain(g,[sd*.35,0,0],[sd*.35,-.42,0]);const disc=new THREE.Group();put(g,disc,0,-1.4,0);vDiscV(disc,.95,vm('hBronze'),vm('hBronze'));bx(disc,.4,.4,.04,vm('hBronze'),0,0,.04);
  for(const sd of[-1,1])bx(disc,.1,.1,.06,vm('dark'),sd*.16,.12,.07);bx(disc,.24,.06,.06,vm('dark'),0,-.12,.07);
  const ml=new THREE.Group();put(root,ml,1.62,0,.28,0,0,.18);wlBeam(ml,[0,.04,0],[0,1.5,0],.07,vm('planksDark'));bx(ml,.3,.26,.3,vm('woolBlack'),0,1.62,0);
  return hlDone(root,4,[{name:'Strike',dur:3,next:'Idle',parts:[g],fn:(t,S)=>{const k=Math.exp(-t*1.4);S.gong={r:[-.3*Math.sin(t*4.2)*k,0,Math.sin(t*23)*.02*k]};}}]);}
function hlIdol(s){const root=hlRoot(2.6),L=root.userData.lights,r=mulberry32((s||1)*4681),st=vm('statue'),dk=vm('hFortDark');bx(root,2.8,.4,2.8,dk,0,.2,0);bx(root,2.2,.8,2.2,vm('hFort'),0,.8,0);bx(root,2.4,.12,2.4,dk,0,1.26,0);const y=1.32;
  for(const sd of[-1,1]){bx(root,.44,.4,1.1,st,sd*.32,y+.2,-.05);bx(root,.4,.62,.4,st,sd*.32,y+.31,.66);bx(root,.4,.12,.56,st,sd*.32,y+.06,.84);bx(root,.3,.9,.3,st,sd*.62,y+1.05,.0);bx(root,.28,.26,.62,st,sd*.6,y+.53,.42);bx(root,.3,.12,.3,st,sd*.6,y+.45,.76);}
  bx(root,1,.4,.7,st,0,y+.2,-.4);bx(root,.9,1.1,.62,st,0,y+.95,-.3);bx(root,1.2,.36,.7,st,0,y+1.62,-.3);const h=new THREE.Group();put(root,h,0,y+1.8,-.18);bx(h,.6,.56,.56,st,0,.28,0);bx(h,.44,.16,.24,st,0,.12,.36);
  for(const sd of[-1,1]){bx(h,.12,.06,.02,HRUNE,sd*.15,.34,.285);hlHorn(h,sd*.24,.46,0,.7,sd,st);}bx(h,.3,.05,.02,vm('dark'),0,.06,.485);for(const sd of[-1,1])bx(h,.05,.08,.02,vm('bone'),sd*.08,.02,.49);
  bx(root,.3,.5,.3,vm('hIron'),0,.25,1.8);const bw=new THREE.Group();put(root,bw,0,.5,1.8);bx(bw,.5,.1,.5,vm('hIron'),0,.05,0);for(let k=0;k<4;k++){const a=k/4*6.28+.78;bx(bw,.26,.14,.06,vm('hIron'),Math.cos(a)*.22,.14,Math.sin(a)*.22,0,-a+Math.PI/2,0);}hlFlame(bw,L,0,.12,0,.2,'orange',.9);return hlDone(root);}
function hlRuneStone(s){const root=hlRoot(1.4),r=mulberry32((s||1)*4687),m=vm('hBrim'),g=new THREE.Group();put(root,g,0,0,0,(r()-.5)*.08,r()*.5,(r()-.5)*.1);
  for(let i=0;i<6;i++){const w=.9-i*.06+(r()-.5)*.06;bx(g,w,.42,.5-i*.02,m,(r()-.5)*.04,i*.4+.21,0);}bx(g,.5,.24,.4,m,0,2.5,0);for(let i=0;i<4;i++)hlGlyph(g,HL_GLYPHS[Math.floor(r()*6)],0,.55+i*.46,.25-i*.01,.9);
  for(let k=0;k<4;k++){const a=r()*6.28,d=.7+r()*.3;bx(root,.2,.12,.2,m,Math.cos(a)*d,.06,Math.sin(a)*d,0,r()*3,0);}return hlDone(root);}
function hlPortal(s,op){const fire=(op&&op.fire)||'orange',root=hlRoot(3.2),L=root.userData.lights,r=mulberry32((s||1)*4691),dk=vm('hFortDark'),F=HL_FIRE[fire]||HL_FIRE.orange,R=1.9,cy=2.7;
  for(let i=0;i<3;i++)bx(root,5.6-i*.8,.3,2.4-i*.4,dk,0,.15+i*.3,0);const top=.9;
  for(let k=0;k<24;k++){const a=k/24*Math.PI*2,x=Math.sin(a)*R,y=cy+Math.cos(a)*R;const sg=new THREE.Group();put(root,sg,x,y,0,0,0,-a);bx(sg,.5,.54,.5,OBSMAT,0,0,0);
    if(k%3===0&&Math.abs(Math.cos(a))<.95)hlSpike(sg,0,.26,0,.6,.2,vm('hIron'));}
  for(const sd of[-1,1]){bx(root,.8,.6,.8,OBSMAT,sd*1.2,top+.3,0);hlHorn(root,sd*.8,cy+R+.1,0,1.3,sd,vm('hHorn'),0,-sd*.2);}
  const rings=[];for(let j=0;j<3;j++){const g=new THREE.Group();g.name='pring_'+j;put(root,g,0,cy,0);const rr=1.45-j*.45,n=14-j*3;for(let k=0;k<n;k++){const a=k/n*Math.PI*2,m=new THREE.Mesh(new THREE.BoxGeometry(.5-j*.08,.28,.06),j%2?F[1]:F[0]);m.position.set(Math.cos(a)*rr,Math.sin(a)*rr,(j-1)*.04);m.rotation.z=a+Math.PI/2+.5;m.castShadow=false;g.add(m);}rings.push(g);}
  const core=new THREE.Mesh(new THREE.BoxGeometry(.6,.6,.06),F[1]);core.position.set(0,cy,0);core.castShadow=false;root.add(core);
  const pl=new THREE.PointLight(F[2],0,10,2);pl.position.set(0,cy,.8);pl.userData.lamp=true;pl.userData.min=1.2;root.add(pl);L.push(pl);
  hlIdle(root,rings,(t,S,dur)=>{rings.forEach((g,j)=>{S[g.name]={r:[0,0,(j%2?-1:1)*t/dur*Math.PI*2*(j+1)/ (j===1?2:1)],s:1+.04*Math.sin(t/dur*Math.PI*4+j)};});});
  return hlDone(root,6,[{name:'Open',dur:2.4,hold:true,still:true,parts:rings,fn:(t,S)=>{const k=paEase(t/2.4);rings.forEach((g,j)=>{S[g.name]={r:[0,0,(j%2?-1:1)*t*(3+j*2)],s:Math.max(1e-4,k*(1+.1*Math.sin(t*9+j)))};});}},
    {name:'Close',dur:2,hold:true,still:true,parts:rings,fn:(t,S)=>{const k=1-paEase(t/2);rings.forEach((g,j)=>{S[g.name]={r:[0,0,(j%2?-1:1)*t*(3+j*2)],s:Math.max(1e-4,k)};});}}]);}
function hlCrystal(s){const root=hlRoot(1.4),L=root.userData.lights,ir=vm('hIron'),dk=vm('hFortDark');bx(root,1.1,.3,1.1,dk,0,.15,0);bx(root,.7,.7,.7,vm('hFort'),0,.65,0);bx(root,.9,.12,.9,dk,0,1.06,0);bx(root,.5,.1,.5,ir,0,1.17,0);
  for(let k=0;k<4;k++){const a=k/4*6.28+.78,c=Math.cos(a),sn=Math.sin(a),P=[[c*.2,1.18,sn*.2],[c*.36,1.5,sn*.36],[c*.3,1.95,sn*.3],[c*.18,2.3,sn*.18]];for(let i=0;i<3;i++){wlBeam(root,P[i],P[i+1],.09-i*.015,ir);bx(root,.09,.09,.09,ir,...P[i+1]);}}
  const cr=new THREE.Group();cr.name='crystal';put(root,cr,0,1.22,0);for(const[w,h,y]of[[.22,.2,.1],[.36,.4,.4],[.42,.36,.78],[.3,.26,1.09],[.16,.2,1.32]])bx(cr,w,h,w,HCRYS,0,y,0).castShadow=false;
  const pl=new THREE.PointLight(0xf0502a,0,6,2);pl.position.set(0,2,0);pl.userData.lamp=true;pl.userData.min=.7;root.add(pl);L.push(pl);
  hlIdle(root,[cr],(t,S,dur)=>{const a=t/dur*Math.PI*2;S.crystal={s:1+.03*Math.sin(a*3)};});return hlDone(root,6);}
function hlCauldron(s){const root=hlRoot(1.8),L=root.userData.lights,r=mulberry32((s||1)*4697),ir=vm('hIron'),R=.8,y0=.5;
  for(let k=0;k<3;k++){const a=k/3*6.28+.5;wlBeam(root,[Math.cos(a)*.95,0,Math.sin(a)*.95],[Math.cos(a)*.6,y0+.2,Math.sin(a)*.6],.14,ir);bx(root,.24,.08,.24,ir,Math.cos(a)*.95,.04,Math.sin(a)*.95);}
  for(let i=0;i<5;i++){const yy=y0+i*.24,rr=i===0?R*.6:i===1?R*.9:R;for(let k=0;k<16;k++){const a=k/16*6.28;bx(root,rr*.42,.26,.12,ir,Math.cos(a)*(rr-.06),yy+.12,Math.sin(a)*(rr-.06),0,-a+Math.PI/2,0);}}bx(root,R*1.2,.1,R*1.2,ir,0,y0+.05,0);
  for(let k=0;k<16;k++){const a=k/16*6.28;bx(root,R*.44,.08,.18,ir,Math.cos(a)*(R+.02),y0+1.2,Math.sin(a)*(R+.02),0,-a+Math.PI/2,0);}for(let x=-.6;x<.61;x+=.2){const d=2*Math.sqrt(Math.max(0,.66*.66-x*x));hlLava(root,.2,d,x,y0+1.0,0,.6);}hlBubbles(root,[[-.2,.1,1],[.25,-.2,.8],[0,.3,.7]],y0+1.0);
  for(const[x,z]of[[.2,.1],[-.15,-.2],[0,.25]]){bx(root,.5,.1,.12,vm('wCharBark'),x,.05,z,0,r()*3,0);}hlFlame(root,L,0,.06,0,.26,'orange',.9);
  const ld=new THREE.Group();put(root,ld,.62,y0+.98,.3,0,.4,-.5);wlBeam(ld,[0,0,0],[0,.9,0],.05,vm('bone'));wlSkull(ld,0,-.16,0,.6,0);return hlDone(root,4);}
function hlForge(s){const root=hlRoot(3.4),L=root.userData.lights,r=mulberry32((s||1)*4699),fd=vm('hFort'),dk=vm('hFortDark'),ir=vm('hIron');
  bx(root,2.4,1,1.6,fd,-.6,.5,-.6);bx(root,2.6,.14,1.8,dk,-.6,1.07,-.6);hlLava(root,1.6,1,-.6,1.12,-.6,.08);for(const sd of[-1,1])bx(root,.2,.2,1.8,dk,-.6+sd*1.2,1.24,-.6);
  bx(root,1.4,2.6,1,fd,-.6,2.44,-1.1);bx(root,1,1.8,.8,fd,-.6,4.6,-1.1);bx(root,1.2,.2,1.0,dk,-.6,5.6,-1.1);const fc=new THREE.Group();put(root,fc,-.6,2.1,-.58);bx(fc,.9,.5,.06,vm('dark'),0,0,0);bx(fc,.7,.3,.04,HEMBER,0,0,.02);
  for(const sd of[-1,1]){bx(fc,.16,.1,.06,HRUNE,sd*.3,.5,.02);hlHorn(fc,sd*.5,.5,0,.6,sd,vm('hHorn'));}for(let i=0;i<5;i++)bx(fc,.08,.14,.08,vm('bone'),-.28+i*.14,.2,.06);
  const an=new THREE.Group();put(root,an,1.3,0,.6,0,.3,0);bx(an,.6,.6,.6,vm('wCharBark'),0,.3,0);bx(an,.3,.24,.26,ir,0,.72,0);bx(an,.7,.2,.36,ir,0,.94,0);bx(an,.3,.1,.2,ir,.46,.94,0);bx(an,.5,.04,.12,vm('hIron'),-.05,1.06,.04,0,.4,0);bx(an,.06,.06,.3,vm('planksDark'),-.25,1.07,.2,0,.4,0);
  const rk=new THREE.Group();put(root,rk,1.6,0,-1.4);for(const sd of[-1,1])bx(rk,.12,1.6,.12,dk,sd*.6,.8,0);bx(rk,1.4,.12,.12,dk,0,1.5,0);bx(rk,1.4,.12,.12,dk,0,.5,0);
  for(let i=0;i<3;i++){const g=new THREE.Group();put(rk,g,-.4+i*.4,0,.12,-.12,0,0);wlBeam(g,[0,.04,0],[0,.9,0],.06,vm('planksDark'));bx(g,.08,.5,.03,ir,.06,1.15,0,0,0,-.25);bx(g,.06,.28,.03,HRUNE,.1,1.1,.02,0,0,-.25);}
  bx(root,.9,.5,.6,ir,-2.1,.25,.6);bx(root,.8,.04,.5,vm('dark'),-2.1,.51,.6);hlFlame(root,L,-.6,1.16,-.6,.3,'orange',1.2,9);return hlDone(root);}
function hlNest(s){const root=hlRoot(2),r=mulberry32((s||1)*4703),c=.4,R=1.1;for(let i=-4;i<4;i++)for(let k=-4;k<4;k++){const x=(i+.5)*c,z=(k+.5)*c,d=Math.hypot(x,z);if(d>R+.4)continue;
    if(d>R-.3)bx(root,c,.24+r()*.16,c,vm(r()<.5?'hAsh':'wCharBark'),x,.14,z);else bx(root,c,.06,c,vm('hAsh'),x,.03,z);}
  for(let i=0;i<8;i++){const a=i/8*6.28+r()*.3;wlBone(root,.5+r()*.2,Math.cos(a)*(R+.1),.3,Math.sin(a)*(R+.1),-a+Math.PI/2);}
  const eggs=[];for(const[x,z,s2]of[[0,0,1],[.36,.2,.85],[-.3,.3,.9],[.1,-.38,.8],[-.36,-.2,.75]]){const g=new THREE.Group();g.name='egg';put(root,g,x,.06,z,0,r()*3,0);for(const[w,h,y]of[[.24,.12,.06],[.3,.2,.22],[.24,.12,.38],[.14,.06,.47]])bx(g,w*s2,h*s2,w*s2,HEGG,0,y*s2,0);eggs.push(g);}hlUniq(eggs,'egg');
  {const g=new THREE.Group();put(root,g,.7,.06,-.5);for(const[x,z,ry]of[[0,0,0],[.15,.1,1],[-.1,.12,2.2]])bx(g,.16,.08,.12,HEGG,x,.04,z,.3,ry,.2);}
  hlIdle(root,eggs,(t,S,dur)=>{eggs.forEach((g,i)=>{const a=t/dur*Math.PI*2*2+i*1.3;S[g.name]={s:[1+.03*Math.sin(a),1+.05*Math.sin(a),1+.03*Math.sin(a)]};});});
  const pl=new THREE.PointLight(0xff8a2a,0,4,2);pl.position.set(0,.9,0);pl.userData.lamp=true;pl.userData.min=.4;root.add(pl);root.userData.lights.push(pl);return hlDone(root,4);}
function hlTrophies(s){const root=hlRoot(2.2),r=mulberry32((s||1)*4707);wlMound(root,0,0,.9,r,vm('hAsh'));for(let i=0;i<5;i++){const a=i/5*6.28+r(),d=.6+r()*.5;wlHornSkull(root,Math.cos(a)*d,0,Math.sin(a)*d,.9+r()*.3,a+Math.PI);}
  wlHornSkull(root,0,.68,0,1.2,r()*6);for(let i=0;i<6;i++){const a=r()*6.28,d=1.2+r()*.4;wlBone(root,.4+r()*.3,Math.cos(a)*d,0,Math.sin(a)*d,r()*3);}return hlDone(root);}
function hlBarrier(s){const root=hlRoot(2.6),r=mulberry32((s||1)*4711),ir=vm('hIron');for(const x of[-1.5,0,1.5]){bx(root,.3,.7,.9,vm('hFortDark'),x,.35,-.1);}vlog(root,4,.3,.3,'x',0,.8,-.1);
  for(let i=0;i<9;i++){const x=-1.8+i*.45;hlSpike(root,x,.8,-.05,1.1+r()*.3,.12,i%2?vm('bone'):ir,.9,0);}return hlDone(root);}
function hlChainFrame(s){const root=hlRoot(2.4),r=mulberry32((s||1)*4713),ir=vm('hIron'),dk=vm('hFortDark');for(const sd of[-1,1]){bx(root,.5,.3,.5,dk,sd*1.6,.15,0);bx(root,.24,3.2,.24,ir,sd*1.6,1.9,0);hlSpike(root,sd*1.6,3.5,0,.4,.24,ir);}bx(root,3.44,.22,.22,ir,0,3.38,0);
  const ch=[];for(let i=0;i<4;i++){const g=new THREE.Group();g.name='chain';put(root,g,-1.05+i*.7,3.27,0);const len=1+r()*1.1;hlChain(g,[0,0,0],[0,-len,0]);const hk=new THREE.Group();put(g,hk,0,-len-.04,0);bx(hk,.04,.14,.04,ir,0,-.04,0);bx(hk,.14,.04,.04,ir,.05,-.12,0);bx(hk,.04,.08,.04,ir,.1,-.08,0);ch.push(g);}hlUniq(ch,'chain');
  hlIdle(root,ch,(t,S,dur)=>{ch.forEach((g,i)=>{const a=t/dur*Math.PI*2+i*1.7;S[g.name]={r:[Math.sin(a)*.05,0,Math.sin(a*2+i)*.04]};});});return hlDone(root,5);}
HL('chain-post','props','Chain post',hlChainPost,'Iron post with a spiked top and a horn, an arm from which three chains hang to the ground and trail off to open shackles.',{variants:true,defaultSeed:1});
HL('soul-cage','props','Soul cage',hlSoulCage,'Spiked iron cage on a stone block holding a glowing lost soul whose tail rests on the cage floor. Clips: Idle (it sways and breathes) and Rattle (it thrashes).',{variants:true,defaultSeed:1});
HL('spikes','props','Impaling spikes',hlSpikes,'Cluster of leaning iron and bone spikes driven into a brimstone mound, two of them with skulls.',{variants:true,defaultSeed:1});
HL('pyre','props','Skull pyre',hlPyre,'Stepped pile of skulls on a stone base with hellfire burning on top and smoke rising (Idle).',{variants:true,defaultSeed:1});
HL('brazier','props','Hellfire brazier',hlBrazier,'Three-legged iron brazier with a spiked bowl of glowing coals and a tall flame.',{opts:[HL_FIRE_OPT]});
HL('soul-lantern','props','Soul lantern',hlSoulLantern,'Hooked iron post with a caged lantern on a chain holding a small soul in a blue flame; the lantern sways (Idle).',{});
HL('gong','props','Hell gong',hlGong,'Great bronze gong with a grim face hung on chains between two horned iron posts, a mallet leaning against one. Clip: Strike (the gong swings and shudders).',{variants:true,defaultSeed:1});
HL('idol','props','Demon idol',hlIdol,'Seated horned demon carved in stone on a stepped plinth, eyes glowing, an iron bowl of fire on the plinth in front.',{variants:true,defaultSeed:1});
HL('rune-stone','props','Rune stone',hlRuneStone,'Leaning standing stone of brimstone carved with a column of glowing runes (diamonds, chevrons, bars, eyes), small stones round it.',{variants:true,defaultSeed:1});
HL('portal','props','Infernal portal',hlPortal,'Ring of obsidian blocks with iron spikes and two great horns on a stepped base, about 6 m high, filled with whirling rings of fire. Clips: Idle (the rings turn), Open (they grow out of nothing), Close.',{opts:[HL_FIRE_OPT],variants:true,defaultSeed:1});
HL('crystal','props','Soul crystal',hlCrystal,'Big red crystal held by four iron claws on a stone pedestal, turning slowly and pulsing (Idle), with a red light.',{});
HL('cauldron','props','Lava cauldron',hlCauldron,'Huge iron cauldron on three claw legs over a fire, full of bubbling lava (Idle), a bone ladle with a skull leaning in it.',{variants:true,defaultSeed:1});
HL('forge','props','Hellforge',hlForge,'Demon smithy for one cell: stone forge with a bed of lava and a chimney whose demon face glows, anvil on a charred stump with tongs and a blade, rack of glowing-runed blades, oil trough.',{variants:true,defaultSeed:1});
HL('nest','props','Imp nest',hlNest,'Ring of ash and charred wood lined with bones, five glowing eggs that pulse slowly (Idle) and a broken shell.',{variants:true,defaultSeed:1});
HL('trophies','props','Horned skull pile',hlTrophies,'Ash mound piled with horned beast skulls and bones.',{variants:true,defaultSeed:1});
HL('barrier','props','Spike barrier',hlBarrier,'A 4 m log on three stone blocks bristling with iron and bone spikes that point forward (+z). 4 m long, fits a grid line.',{variants:true,defaultSeed:1});
HL('chain-frame','props','Chain frame',hlChainFrame,'Iron frame with spiked posts and four hooked chains that sway (Idle).',{variants:true,defaultSeed:1});
