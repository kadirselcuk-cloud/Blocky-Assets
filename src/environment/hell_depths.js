/* ======================= HELL KIT: the infernal depths (hl-dp-) and the demon temple (hl-tm-) =======================
   Depths: the wasteland cave pieces (6 m walls on grid lines, corners on vertices, ceiling 6–6.8 m, floor tiles) re-skinned in red rock with
   glowing veins, plus a lavafall wall, a chasm cell with a chain bridge, crystal clusters. Temple: ritual pieces for a boss room. */
FOLDERS['hell'].children.push('hell/depths','hell/temple');
FOLDERS['hell/depths']={name:'Infernal depths',blurb:'Magma caves: walls with glowing veins, corners, ceiling, floor, tunnel, lavafall wall, chasm with a chain bridge, crystals',children:[]};
FOLDERS['hell/temple']={name:'Demon temple',blurb:'Summoning circle, brimstone altar, obsidian obelisk, soul pit, lava fountain, pillar of faces',children:[]};
const hlTileMats2=tileMats;tileMats=function(){const m=hlTileMats2();Object.assign(m,{hCaveF:{top:vm('hAsh'),side:vm('hCave')},hCaveBump:{top:vm('hCave'),side:vm('hCave'),h:T+.12}});return m;};
/* swap the cave materials for hell ones: rock -> red rock, moss -> glowing crust */
function hlReskin(root){const M=new Map([[vm('caveRock'),vm('hCave')],[vm('caveMoss'),CRUSTMAT],[vm('wRock'),vm('hCave')],[vm('caveFloor'),vm('hAsh')],[vm('mud'),CRUSTMAT],[BOGMAT,LAVAMAT],[vm('cobble'),vm('hBrim')],[vm('gravel'),vm('hBasalt')]]);
  root.traverse(o=>{if(!o.isMesh)return;if(Array.isArray(o.material))o.material=o.material.map(m=>M.get(m)||m);else if(M.has(o.material))o.material=M.get(o.material);});root.userData.groundKind='hell';return root;}
/* glowing crystals growing out of a surface (points along +y of the group) */
function hlCrystals(par,x,y,z,n,r,s=1,rx=0,rz=0){const g=new THREE.Group();put(par,g,x,y,z,rx,0,rz);g.scale.setScalar(s);for(let k=0;k<n;k++){const a=r()*6.28,d=k?.12+r()*.2:0,h=k?.3+r()*.4:.7,t=k?.3+r()*.3:.05;
  const c=new THREE.Group();put(g,c,Math.cos(a)*d,-.05,Math.sin(a)*d,Math.sin(a)*t,0,-Math.cos(a)*t);for(const[w,f]of[[.14,.55],[.1,.3],[.05,.15]]){bx(c,w,h*f,w,HCRYS,0,(f===.55?h*f/2:f===.3?h*.55+h*f/2:h*.85+h*f/2),0).castShadow=false;}}return g;}
function dpWall(s){const root=hlReskin(cvWall(s)),r=mulberry32((s||1)*4901);for(let k=0;k<3;k++){const x=(r()-.5)*3,y=1+r()*3.5;hlCrystals(root,x,y,.95,4,r,.8,Math.PI/2,0);}return hlDone(root);}
function dpCorner(inner){return s=>hlDone(hlReskin(cvCorner(inner)(s)));}
function dpCeiling(s){const root=hlReskin(cvCeiling(s));root.userData.ground=-1;return hlDone(root);}
function dpFloor(){return hlDone(vTile((x,z)=>{const n=wlNoise(x*1.2,z*1.2,1);return n>1.7?'hCaveBump':n<-1.6?'hCrust':'hCaveF';},(root,at)=>{wlPebbles(root,16,4911,['hCaveF'],at,['hCave','hBasalt']);hlEmbers(root,at,['hCaveF'],5,4913);
  const r=mulberry32(4915);for(let i=0;i<2;i++){const x=(r()-.5)*3,z=(r()-.5)*3;if(at(x,z)==='hCaveF')wlBone(root,.3+r()*.3,x,T,z,r()*3);}}));}
function dpTunnel(s){const root=hlRoot(-1);root.userData.ground=-1;for(const sd of[-1,1]){const w=dpWall((s||1)*3+(sd>0?1:0));put(root,w,sd*2,0,0,0,-sd*Math.PI/2,0);}put(root,dpCeiling(s),0,0,0);put(root,dpFloor(),0,-T,0);
  return root;}
function dpLavafall(s){const root=dpWall(s),L=root.userData.lights;root.userData.ground=4;const r=mulberry32((s||1)*4921);
  bx(root,1.6,.4,1,vm('hCave'),0,4.8,.6);bx(root,1.2,.06,.8,LAVAMAT,0,5.02,.7).castShadow=false;const lf=bx(root,1,4.1,.16,LAVAMAT,0,.5+4.1/2-.05,1.14);lf.castShadow=false;
  const c=.4;for(let i=-4;i<=4;i++)for(let k=0;k<5;k++){const x=i*c,z=1.2+c/2+k*c,d=Math.hypot(x/1.7,(z-2)/.9);if(d>1.25)continue;if(d>.85)bx(root,c,.3+r()*.15,c,[vm('hCave'),vm('hCave'),CRUSTMAT,vm('hCave'),vm('hCave'),vm('hCave')],x,.18,z);}
  hlLava(root,2.8,1.4,0,.26,2,.26);const drops=[];for(let i=0;i<5;i++){const g=new THREE.Group();g.name='fdrop_'+i;put(root,g,0,0,1.3);bx(g,.12,.18,.12,HEMBER,0,0,0).castShadow=false;drops.push(g);}
  hlIdle(root,drops,(t,S,dur)=>{drops.forEach((g,i)=>{const u=(t/dur*2+i/5)%1;S[g.name]={p:[(i%3-1)*.3,4.8-u*u*4.4,1.3],s:u>.95?1e-4:1};});});hlBubbles(root,[[-.6,2,1],[.5,2.2,.8]],.26);
  const pl=new THREE.PointLight(0xff6a20,0,9,2);pl.position.set(0,1.6,2);pl.userData.lamp=true;pl.userData.min=.9;root.add(pl);L.push(pl);delete root.userData.tick;return hlDone(root,3);}
/* chasm cell: the floor tile split by an 8 m deep rift along x with lava glowing at the bottom; a chain bridge crosses it along z */
function dpChasm(s){const root=new THREE.Group();root.userData.lights=[];root.userData.ground=-1;const r=mulberry32((s||1)*4931),hc=vm('hCave'),c=.4,D=8;
  const edge=x=>1+.25*Math.sin(x*2.1+1)+.15*Math.cos(x*3.7);
  for(let i=0;i<10;i++){const x=-1.8+i*c;for(const sd of[-1,1]){const e=Math.round(edge(x*sd+sd)/c)*c,len=2-e;bx(root,c,T,len,[hc,hc,vm('hAsh'),hc,hc,hc],x,T/2,sd*(e+len/2));bx(root,c,D,c,hc,x,T-D/2,sd*(e+c/2));}}
  for(let i=0;i<10;i++)bx(root,c,.4,2*2-.01,hc,-1.8+i*c,T-D-.2,0);hlLava(root,4,3.2,0,T-D+.3,0,.3);
  const pl=new THREE.PointLight(0xff5a10,0,10,2);pl.position.set(0,T-D+2,0);pl.userData.lamp=true;pl.userData.min=1;root.add(pl);root.userData.lights.push(pl);
  const ir=vm('hIron'),Z=2;for(const sd of[-1,1])for(const x of[-.7,.7]){bx(root,.2,1.2,.2,ir,x,T+.6,sd*1.7);hlSpike(root,x,T+1.2,sd*1.7,.3,.14,ir);}
  const sag=.5,yb=T+.1,P=(z)=>yb-sag*(1-(z/1.7)**2);for(const x of[-.6,.6])hlChain(root,[x,yb,-1.7],[x,yb,1.7],sag);for(const x of[-.7,.7])hlChain(root,[x,T+1.1,-1.7],[x,T+1.1,1.7],sag*.8);
  for(let k=0;k<12;k++){const z=-1.56+k*.284;bx(root,1.4,.06,.22,vm('planksDark'),0,P(z)+.05,z);}for(let k=0;k<4;k++){const z=-1.2+k*.8;hlChain(root,[.7,T+1.1-sag*.8*(1-(z/1.7)**2),z],[.6,P(z)+.06,z],0);hlChain(root,[-.7,T+1.1-sag*.8*(1-(z/1.7)**2),z],[-.6,P(z)+.06,z],0);}
  return hlDone(root);}
function dpCrystals(s){const root=hlRoot(1.6),r=mulberry32((s||1)*4941);bx(root,1.2,.3,1,vm('hCave'),0,.15,0,0,r(),0);for(let k=0;k<4;k++){const a=k/4*6.28+r(),d=k?.35+r()*.3:0;hlCrystals(root,Math.cos(a)*d,.25,Math.sin(a)*d,5,r,k?.9:1.6);}
  const pl=new THREE.PointLight(0xff3040,0,5,2);pl.position.set(0,1.2,0);pl.userData.lamp=true;pl.userData.min=.6;root.add(pl);root.userData.lights.push(pl);return hlDone(root);}
function dpStalag(s){const root=hlReskin(cvStalagmites(s)),r=mulberry32((s||1)*4943);hlCrystals(root,.8,0,-.6,4,r,.8);return hlDone(root);}
function dpColumn(s){const root=hlReskin(cvColumn(s)),r=mulberry32((s||1)*4947);for(const y of[1.2,3.4,5.2])bx(root,.06,.5,.06,HVEIN,.5+(r()-.5)*.1,y,0);return hlDone(root);}
HL('dp-wall','depths','Magma cave wall',dpWall,'The cave wall in red rock with glowing veins and red crystals growing out of the face. 4 m long, 6 m high, centred on the grid line, face towards +z.',{variants:true,defaultSeed:1});
HL('dp-corner-in','depths','Magma cave inner corner',dpCorner(true),'Inner corner rock for a grid vertex (room towards +x and +z), 6 m.',{variants:true,defaultSeed:1});
HL('dp-corner-out','depths','Magma cave outer corner',dpCorner(false),'Outer corner pillar for a grid vertex (rock in the −x −z quarter), 6 m.',{variants:true,defaultSeed:1});
HL('dp-ceiling','depths','Magma cave ceiling',dpCeiling,'4 × 4 m red rock ceiling slab from 6 to 6.8 m with stalactites; origin on the floor.',{variants:true,defaultSeed:1,groundR:-1});
HL('dp-floor','depths','Magma cave floor',dpFloor,'Cave floor tile of ash and red rock with patches of glowing crust, pebbles, embers and bones. 4 × 4 m, top at 0.8 m.',{groundR:-1});
HL('dp-tunnel','depths','Magma tunnel',dpTunnel,'One 4 m cell of tunnel: two magma walls facing each other, the ceiling and the floor, running along z. Floor top at 0.',{variants:true,defaultSeed:1,groundR:-1});
HL('dp-lavafall','depths','Lavafall wall',dpLavafall,'The magma cave wall with a ledge at 4.8 m from which a sheet of lava pours down into a crusted pool in front of the wall (drops fall, bubbles pop: Idle).',{variants:true,defaultSeed:1});
HL('dp-chasm','depths','Chasm with chain bridge',dpChasm,'Cave floor cell split by a rift along x, 8 m deep with lava glowing at the bottom; a sagging bridge of planks on chains crosses it along z between iron posts. Top at 0.8 m like the floor tiles.',{variants:true,defaultSeed:1,groundR:-1});
HL('dp-crystals','depths','Blood crystals',dpCrystals,'Cluster of glowing red crystals growing out of a rock, with a red light.',{variants:true,defaultSeed:1});
HL('dp-stalagmites','depths','Magma stalagmites',dpStalag,'Red rock stalagmites with a cluster of red crystals.',{variants:true,defaultSeed:1});
HL('dp-column','depths','Magma column',dpColumn,'Floor-to-ceiling column of red rock, 6 m, with glowing veins.',{variants:true,defaultSeed:1});

/* ======================= the demon temple ======================= */
function tmCircle(s,op){const fire=(op&&op.fire)||'orange',F=HL_FIRE[fire]||HL_FIRE.orange,root=hlRoot(3.6),L=root.userData.lights,r=mulberry32((s||1)*4951),dk=vm('hFortDark'),c=.4;
  for(let i=-8;i<8;i++)for(let k=-8;k<8;k++){const x=(i+.5)*c,z=(k+.5)*c,d=Math.hypot(x,z);if(d>3.2)continue;bx(root,c,d>2.8?.2:.3,c,d>2.8?dk:OBSMAT,x,d>2.8?.1:.15,z);}
  const ring=(R,n,w,y,name)=>{const g=new THREE.Group();g.name=name;put(root,g,0,y,0);for(let k=0;k<n;k++){const a=k/n*6.28;bx(g,w,.03,.08,HRUNE,Math.cos(a)*R,0,Math.sin(a)*R,0,-a+Math.PI/2,0).castShadow=false;}return g;};
  const r1=ring(2.5,40,.42,.315,'circle_outer'),r2=ring(1.5,24,.42,.315,'circle_inner');
  const gl=new THREE.Group();gl.name='circle_glyphs';put(root,gl,0,.3,0);for(let k=0;k<8;k++){const a=k/8*6.28,g=hlGlyph(gl,HL_GLYPHS[k%6],Math.cos(a)*2,.02,Math.sin(a)*2,1.4);g.rotation.set(-Math.PI/2,0,-a-Math.PI/2);}
  for(let k=0;k<6;k++){const a=k/6*6.28+.26;const cg=new THREE.Group();put(root,cg,Math.cos(a)*3.0,.2,Math.sin(a)*3.0);bx(cg,.12,.3,.12,vm('hWaxB'),0,.15,0);hlFlame(cg,null,0,.3,0,.07,fire,0);}
  const col=[];for(let i=0;i<6;i++){const g=new THREE.Group();g.name='cfire_'+i;put(root,g,0,.3,0);const m=new THREE.Mesh(new THREE.BoxGeometry(.9-i*.08,1,.9-i*.08),i%2?F[1]:F[0]);m.position.y=.5;m.castShadow=false;g.add(m);paHide(g);col.push(g);}
  const pl=new THREE.PointLight(F[2],0,9,2);pl.position.set(0,1,0);pl.userData.lamp=true;pl.userData.min=.9;root.add(pl);L.push(pl);
  hlIdle(root,[r1,r2,gl],(t,S,dur)=>{const a=t/dur*Math.PI*2;S.circle_outer={r:[0,a,0]};S.circle_inner={r:[0,-a*2,0]};S.circle_glyphs={r:[0,-a,0]};});
  return hlDone(root,12,[{name:'Summon',dur:5,next:'Idle',parts:[r1,r2,gl,...col],fn:(t,S)=>{const sp=t<1?t*t:1+(t-1)*2.5;S.circle_outer={r:[0,sp*2,0]};S.circle_inner={r:[0,-sp*3,0]};S.circle_glyphs={r:[0,-sp*1.5,0],s:[1,1+Math.max(0,Math.sin(t*2))*.8,1]};
    const H=t<1.2?0:t<2.2?(t-1.2)*6:t<3.8?6+.3*Math.sin(t*13):Math.max(0,6*(1-(t-3.8)/1));col.forEach((g,i)=>{const h=H/6,on=H>.05;S[g.name]={p:[Math.sin(t*9+i)*.06,.3+i*h,Math.cos(t*8+i)*.06],s:on?[1+.15*Math.sin(t*14+i),h,1+.15*Math.cos(t*13+i)]:1e-4};});}}]);}
function tmAltar(s){const root=hlRoot(2.2),L=root.userData.lights,r=mulberry32((s||1)*4957),dk=vm('hFortDark');for(let i=0;i<2;i++)bx(root,3.2-i*.6,.25,2.4-i*.4,dk,0,.125+i*.25,0);
  bx(root,2,.8,1,OBSMAT,0,.9,0);bx(root,2.3,.16,1.3,OBSMAT,0,1.38,0);for(const sd of[-1,1]){bx(root,.1,.02,1.2,LAVAMAT,sd*.5,1.465,0).castShadow=false;bx(root,.1,.9,.02,LAVAMAT,sd*.5,.95,.505).castShadow=false;}
  hlLava(root,1.6,.3,0,.52,.85,.04);bx(root,1.8,.1,.06,dk,0,.55,1.03);wlHornSkull(root,0,1.46,-.25,1,0);
  const bl=new THREE.Group();put(root,bl,.3,1.46,.3,0,.5,0);bx(bl,.5,.03,.08,vm('iron'),.15,.015,0);bx(bl,.06,.025,.1,vm('iron'),.42,.0125,.01);bx(bl,.2,.05,.06,vm('leather'),-.2,.025,0);
  for(const[x,z,h]of[[-.95,-.45,.34],[-.8,-.5,.22],[.95,-.45,.3],[.85,-.3,.18],[-.98,.4,.16]]){bx(root,.07,h,.07,vm('hWaxB'),x,1.46+h/2,z);hlFlame(root,null,x,1.46+h,z,.05,'orange',0);}
  for(const sd of[-1,1]){wlSkull(root,sd*1.35,.5,.6,1,sd*.3);hlFlame(root,sd>0?L:null,sd*1.35,.72,.62,.08,'orange',.8,6);}return hlDone(root);}
function tmObelisk(s){const root=hlRoot(1.8),r=mulberry32((s||1)*4961),dk=vm('hFortDark');bx(root,2,.3,2,dk,0,.15,0);bx(root,1.5,.3,1.5,dk,0,.45,0);
  for(let i=0;i<10;i++){const w=1-i*.04;bx(root,w,.5,w,OBSMAT,0,.6+i*.5+.25,0);}for(let i=0;i<4;i++){const w=.6-i*.15;bx(root,w,.25,w,OBSMAT,0,5.6+i*.25+.125,0);}
  for(let f=0;f<4;f++){const g=new THREE.Group();put(root,g,0,0,0,0,f*Math.PI/2,0);for(let i=0;i<6;i++){const y=1+i*.7,w=1-((y-.6)/.5|0)*.04;hlGlyph(g,HL_GLYPHS[(i+f)%6],0,y,w/2+.005,1);}}
  for(const[a,b]of[[1,1],[1,-1],[-1,1],[-1,-1]])hlSpike(root,a*.85,.3,b*.85,.5,.16,vm('hIron'));return hlDone(root);}
function tmSoulPit(s){const root=hlRoot(3.4),L=root.userData.lights,r=mulberry32((s||1)*4967),dk=vm('hFortDark'),fd=vm('hFort'),c=.4;
  for(let i=-7;i<7;i++)for(let k=-7;k<7;k++){const x=(i+.5)*c,z=(k+.5)*c,d=Math.hypot(x,z);if(d>2.7||d<1.7)continue;bx(root,c,d<2.1?.6:.4,c,d<2.1?fd:dk,x,d<2.1?.3:.2,z);}
  bx(root,3.4,.02,3.4,vm('dark'),0,.01,0).castShadow=false;const glow=bx(root,2.4,.02,2.4,SOULMAT,0,.03,0);glow.castShadow=false;
  for(let k=0;k<4;k++){const a=k/4*6.28+.4,x=Math.cos(a)*2.3,z=Math.sin(a)*2.3;bx(root,.24,1.4,.24,vm('hIron'),x,1.1,z);hlSpike(root,x,1.8,z,.3,.14,vm('hIron'));hlChain(root,[x,1.6,z],[Math.cos(a)*1.4,.4,Math.sin(a)*1.4],.2);bx(root,.16,.16,.16,vm('hIron'),Math.cos(a)*1.4,.36,Math.sin(a)*1.4);}
  const souls=[];for(let i=0;i<6;i++){const g=hlSoul(root,0,0,0,.9);g.name='psoul_'+i;paHide(g);souls.push(g);}
  hlIdle(root,souls,(t,S,dur)=>{souls.forEach((g,i)=>{const u=(t/dur+i/6)%1,a=i*1.05+u*3;S[g.name]={p:[Math.cos(a)*(.9-u*.4),-.4+u*4.4,Math.sin(a)*(.9-u*.4)],r:[0,a,Math.sin(u*9)*.2],s:u<.12?u/.12:u>.7?Math.max(1e-4,(1-u)/.3):1};});});
  const pl=new THREE.PointLight(0x5ad0ff,0,8,2);pl.position.set(0,1,0);pl.userData.lamp=true;pl.userData.min=1;root.add(pl);L.push(pl);return hlDone(root,6);}
function tmFountain(s){const root=hlRoot(2.8),L=root.userData.lights,r=mulberry32((s||1)*4971),dk=vm('hFortDark'),fd=vm('hFort'),c=.4;
  for(let i=-6;i<6;i++)for(let k=-6;k<6;k++){const x=(i+.5)*c,z=(k+.5)*c,d=Math.max(Math.abs(x),Math.abs(z))*.7+Math.hypot(x,z)*.3;if(d>2.3)continue;if(d>1.9)bx(root,c,.7,c,fd,x,.35,z);else bx(root,c,.2,c,dk,x,.1,z);}
  hlLava(root,3.2,3.2,0,.55,0,.35);bx(root,.9,2.4,.9,fd,0,1.2,0);bx(root,1.2,.3,1.2,dk,0,2.5,0);bx(root,.6,.6,.6,fd,0,2.95,0);hlFlame(root,null,0,3.25,0,.3,'orange',0);
  const arcs=[];for(let k=0;k<3;k++){const a=k/3*6.28+.5,ca=Math.cos(a),sa=Math.sin(a),h=new THREE.Group();put(root,h,ca*.45,1.9,sa*.45,0,-a+Math.PI/2,0);bx(h,.4,.4,.3,fd,0,0,.1);bx(h,.3,.1,.1,vm('dark'),0,-.08,.26);for(const sd of[-1,1])bx(h,.06,.04,.02,HRUNE,sd*.1,.08,.26);hlHorn(h,0,.18,0,.5,1,vm('hHorn'),0,0);
    const P=u=>[ca*(.7+u*1),1.82+u*.5-u*u*1.8,sa*(.7+u*1)];for(let i=0;i<6;i++){const p0=P(i/6),p1=P((i+1)/6);wlBeam(root,p0,p1,.16,LAVAMAT).castShadow=false;}
    for(let i=0;i<2;i++){const g=new THREE.Group();g.name='fdrop';put(root,g,0,0,0);bx(g,.14,.14,.14,HEMBER,0,0,0).castShadow=false;g.userData.P=P;g.userData.ph=i*.5+k*.17;arcs.push(g);}}hlUniq(arcs,'fdrop');
  hlIdle(root,arcs,(t,S,dur)=>{for(const g of arcs){const u=(t/dur*2+g.userData.ph)%1;S[g.name]={p:g.userData.P(u)};}});hlBubbles(root,[[1.2,.3,.8],[-.8,1,1],[.3,-1.2,.9]],.55);
  const pl=new THREE.PointLight(0xff6a20,0,9,2);pl.position.set(0,2,1);pl.userData.lamp=true;pl.userData.min=1;root.add(pl);L.push(pl);return hlDone(root,3);}
function tmFaces(s){const root=hlRoot(1.8),r=mulberry32((s||1)*4977),fd=vm('hFort'),dk=vm('hFortDark');bx(root,1.8,.4,1.8,dk,0,.2,0);bx(root,1.3,5.2,1.3,fd,0,3,0);bx(root,1.8,.4,1.8,dk,0,5.8,0);
  for(let f=0;f<4;f++){const g=new THREE.Group();put(root,g,0,0,0,0,f*Math.PI/2,0);for(let i=0;i<3;i++){const y=1.3+i*1.5,x=(i%2?.2:-.2)+(r()-.5)*.1,fc=new THREE.Group();put(g,fc,x,y,.65);
    bx(fc,.5,.62,.14,vm('statue'),0,0,.05);for(const sd of[-1,1]){bx(fc,.1,.08,.04,vm('dark'),sd*.11,.1,.12);bx(fc,.12,.04,.04,vm('statue'),sd*.11,.2,.13,0,0,sd*.4);}bx(fc,.14,.2,.04,vm('dark'),0,-.14,.12);
    if(r()<.5)bx(fc,.12,.3,.1,vm('statue'),-.32,-.1,.06,0,0,.3);}hlChain(g,[-.55,5.5,.66],[.55,4.0,.66],.1);}
  hlSpike(root,0,6,0,1,.5,vm('hIron'));return hlDone(root);}
HL('tm-circle','temple','Summoning circle',tmCircle,'Round obsidian dais 6.4 m across inlaid with two rings of glowing runes and eight great glyphs that turn slowly (Idle), six black candles round the edge. Clip: Summon (the rings whirl and a column of fire roars up in the middle, then dies).',{opts:[HL_FIRE_OPT],variants:true,defaultSeed:1});
HL('tm-altar','temple','Brimstone altar',tmAltar,'Obsidian altar on two steps: lava runs in channels along the top and down the front into a trough, a horned skull, a curved knife, black candles, skulls with flames at the foot.',{variants:true,defaultSeed:1});
HL('tm-obelisk','temple','Obsidian obelisk',tmObelisk,'Tapering obsidian obelisk about 6.6 m on a stepped base, columns of glowing runes on every face, iron spikes on the corners.',{variants:true,defaultSeed:1});
HL('tm-soul-pit','temple','Soul pit',tmSoulPit,'Round pit 5.4 m across with a stone rim, glowing pale blue from below; chains run down into it from four spiked posts, and lost souls rise out of it and fade (Idle).',{variants:true,defaultSeed:1});
HL('tm-fountain','temple','Lava fountain',tmFountain,'Basin of lava with a central pillar; three horned demon heads spout arcs of lava into it (drops run along the arcs, bubbles pop: Idle), a flame on top.',{variants:true,defaultSeed:1});
HL('tm-faces','temple','Pillar of faces',tmFaces,'Square stone pillar, 6 m, carved on every side with tormented faces, a sagging chain hung across each face, a spike on top.',{variants:true,defaultSeed:1});
