/* ======================= UNDEAD KIT (ud-): graveyards, crypts and the necromancer's castle =======================
   Same grid rules as the wasteland kit (docs/WASTELAND.md): 4 m cells, tiles with their top at 0.8 m, walls and fences 4 m long between grid vertices,
   centred on the grid line, outside towards +z, corner pieces (posts, pillars, towers) on the vertices. See docs/UNDEAD.md. */
VXD.gSoil=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++){const k=r();P(x,y,k<.12?'#2a2018':k<.22?'#4e4032':'#3a2e24',nz(r,.86,1.08));}};
VXD.gSoilSide=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,y%5===1?'#2a2018':y%7===4?'#4a3c2e':'#3a2e24',nz(r,.86,1.08));};
VXD.gGrass=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++){const k=r();P(x,y,k<.18?'#323a24':k<.3?'#5a5e40':k<.36?'#4a4030':'#434c30',nz(r,.86,1.08));}};
VXD.gGrassSide=(P,r)=>{const e=[];for(let x=0;x<16;x++)e.push(2+Math.floor(r()*3));for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,y<e[x]?'#434c30':y%5===1?'#2a2018':'#3a2e24',nz(r,.85,1.08));};
VXD.gPath=(P,r)=>{const tone=[];for(let i=0;i<8;i++)tone.push(nz(r,.82,1.08));for(let y=0;y<16;y++){const row=y>>3,off=(row%2)*4;for(let x=0;x<16;x++){const id=row*2+(((x+off)>>3)&1),j=y%8===7||(x+off)%8===7;
  P(x,y,j?(r()<.4?'#3e4a2c':'#2a2926'):'#5c5a54',j?nz(r,.9,1.05):tone[id]*nz(r,.92,1.05));}}};
VXD.tomb=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++){const k=r();P(x,y,k<.08?'#6a6862':k<.13?'#8a8a62':'#86847c',nz(r,.93,1.04));}};
VXD.tombDark=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++){const k=r();P(x,y,k<.1?'#46443f':'#5e5c58',nz(r,.9,1.05));}};
VXD.ashlarG=(P,r)=>{const tone=[];for(let i=0;i<4;i++)tone.push(nz(r,.86,1.06));for(let y=0;y<16;y++){const row=y>>3,off=(row%2)*8;for(let x=0;x<16;x++){const id=row*2+(((x+off)>>3)&1)%2,j=y%8===7||(x+off)%16===15;
  P(x,y,j?'#4e4c48':'#7e7c74',j?nz(r,.9,1.05):tone[id]*nz(r,.93,1.04));}}};
VXD.ironB=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,r()<.12?'#3e3e46':'#26262a',nz(r,.9,1.1));};
VXD.coffin=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++){let f=nz(r,.86,1.06);if(x%4===3)f=.62;P(x,y,'#3e2c22',f);}};
VXD.velvet=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,(x+y)%4===0?'#5a2232':'#4a1a2a',nz(r,.9,1.06));};
VXD.udBark=(P,r)=>{const c=[];for(let x=0;x<16;x++)c.push(nz(r,.8,1.08));for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,(y+((x>>2)*5))%6===0?'#1e1c1a':'#3e3a36',c[x]*nz(r,.92,1.05));};
VXD.udMoss=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,r()<.3?'#4e5442':'#6a7058',nz(r,.85,1.1));};
VXD.wax=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,'#e4dcc4',nz(r,.93,1.03));};
VXD.deadFlower=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,r()<.3?'#5a2a2a':'#6e4a3a',nz(r,.86,1.08));};
/* emissive materials: necromantic green fire, glowing runes, purple fungus, ground mist */
const NFIRE=new THREE.MeshStandardMaterial({color:new THREE.Color(0x9affb0).convertSRGBToLinear(),emissive:new THREE.Color(0x30e070).convertSRGBToLinear(),emissiveIntensity:1.8,roughness:.6,transparent:true,opacity:.88});
const RUNEMAT=new THREE.MeshStandardMaterial({color:new THREE.Color(0x8affa8).convertSRGBToLinear(),emissive:new THREE.Color(0x30e070).convertSRGBToLinear(),emissiveIntensity:.9,roughness:.6});RUNEMAT.userData={glowScale:1.2,base:.9};GLOW.push(RUNEMAT);
const UDGLOW=new THREE.MeshStandardMaterial({color:new THREE.Color(0xc89ae8).convertSRGBToLinear(),emissive:new THREE.Color(0x9a40e0).convertSRGBToLinear(),emissiveIntensity:.6,roughness:.6});UDGLOW.userData={glowScale:1,base:.6};GLOW.push(UDGLOW);
const MISTMAT=(()=>{const c=document.createElement('canvas');c.width=c.height=16;const g=c.getContext('2d'),r=mulberry32(4711);for(let y=0;y<16;y++)for(let x=0;x<16;x++){const d=Math.hypot((x-7.5)/7.5,(y-7.5)/7.5),a=Math.max(0,1-d*d)*(.7+r()*.3);g.fillStyle='rgba(255,255,255,'+a.toFixed(3)+')';g.fillRect(x,y,1,1);}
  const t=new THREE.CanvasTexture(c);t.magFilter=t.minFilter=THREE.NearestFilter;t.generateMipmaps=false;return new THREE.MeshStandardMaterial({color:new THREE.Color(0xd8dce4).convertSRGBToLinear(),map:t,transparent:true,opacity:.32,depthWrite:false,roughness:1});})();
const UDWATER=new THREE.MeshStandardMaterial({color:new THREE.Color(0x14181a).convertSRGBToLinear(),roughness:.08,metalness:.2,transparent:true,opacity:.94});

/* ---------- helpers ---------- */
function udRoot(g){const r=new THREE.Group();r.userData.lights=[];r.userData.ground=g;r.userData.groundKind='grave';return r;}
/* green necromantic flame with a light of its own (always on) */
function udFlame(par,L,x,y,z,s=.2,minI=1){const g=new THREE.Group();put(par,g,x,y,z);const a=new THREE.Mesh(new THREE.BoxGeometry(s,s*1.5,s),NFIRE);a.position.y=s*.75;g.add(a);const b=new THREE.Mesh(new THREE.BoxGeometry(s*.55,s*.9,s*.55),NFIRE);b.position.y=s*1.75;g.add(b);
  a.onBeforeRender=()=>{const t=performance.now()/1000;NFIRE.emissiveIntensity=1.6+.5*Math.sin(t*7.3);b.position.x=Math.sin(t*5.1+x)*s*.08;b.scale.y=1+.15*Math.sin(t*9+z);};
  if(L){const pl=new THREE.PointLight(0x60ff90,0,7,2);pl.position.set(0,s*2,0);pl.userData.lamp=true;pl.userData.min=minI;g.add(pl);L.push(pl);}return g;}
function udCandle(par,x,y,z,h=.2,w=.06){bx(par,w,h,w,vm('wax'),x,y+h/2,z);bx(par,w*1.4,.02,w*1.4,vm('wax'),x+.01,y+.01,z);const f=new THREE.Mesh(new THREE.BoxGeometry(.03,.05,.03),VFLAME);f.position.set(x,y+h+.03,z);par.add(f);}
/* headstone, base at y = 0, inscription facing +z; style: rounded, slab, pointed, obelisk, skull, broken */
const UD_STYLES=['rounded','slab','pointed','obelisk','skull','broken'];
function udHeadstone(par,style,r,wear,x=0,z=0,ry=0,lean=0){const g=new THREE.Group();put(par,g,x,0,z,0,ry,0);const s=new THREE.Group();g.add(s);s.rotation.set(lean*(r()-.3)*.25,0,lean*(r()-.5)*.18);const st=vm('tomb'),dk=vm('tombDark');
  bx(s,.9,.2,.44,dk,0,.1,0);let top=1;
  if(style==='obelisk'){bx(s,.56,.4,.56,st,0,.4,0);for(let i=0;i<4;i++){const w=.36-i*.05;bx(s,w,.4,w,st,0,.8+i*.4,0);}bx(s,.12,.14,.12,st,0,2.47,0);bx(s,.16,.16,.16,st,0,2.62,0);top=2.7;}
  else if(style==='broken'){bx(s,.66,.36,.16,st,0,.38,0);bx(s,.22,.08,.16,st,-.18,.6,0);const p=new THREE.Group();put(g,p,.25,0,.6,0,.5,0);bx(p,.62,.16,.5,st,0,.08,0);bx(p,.46,.08,.44,st,0,.19,0);top=.56;}
  else{const w=style==='slab'?.62:.7,h=style==='slab'?.95:.75;bx(s,w,h,.16,st,0,.2+h/2,0);top=.2+h;
    if(style==='rounded'||style==='skull'){bx(s,w-.2,.12,.16,st,0,top+.06,0);bx(s,w-.4,.08,.16,st,0,top+.16,0);top+=.2;}
    else if(style==='pointed')for(let i=1;i<=3;i++){bx(s,w-i*.16,.12,.16,st,0,top+.06,0);top+=.12;}
    else{bx(s,w-.1,.08,.18,st,0,top+.04,0);top+=.08;}
    if(style==='skull'){const k=new THREE.Group();put(s,k,0,.62,.08);k.scale.setScalar(1.1);bx(k,.2,.16,.04,st,0,.08,.0);bx(k,.12,.06,.04,st,0,-.02,0);for(const sd of[-1,1])bx(k,.05,.04,.02,dk,sd*.05,.1,.03);}
    else for(let i=0;i<3;i++)bx(s,w*(.6-i*.1),.03,.01,dk,0,.55+.18-i*.12,.085);}
  if(wear==='mossy'){bx(s,.5,.04,.2,vm('moss'),(r()-.5)*.1,Math.min(top,.95)+.02,0);bx(s,.4,.12,.02,vm('moss'),-.1,.28,.09);}
  if(wear==='cracked'&&style!=='obelisk'){let cx=(r()-.5)*.3;for(let k=0;k<4;k++){bx(s,.03,.1,.01,vm('dark'),cx,.85-k*.12,.085);cx+=(r()-.5)*.08;}}
  return g;}
const UD_STYLE_OPT={key:'style',label:'Style',choices:[['random','Random'],['rounded','Rounded'],['slab','Slab'],['pointed','Pointed'],['obelisk','Obelisk'],['skull','Skull'],['broken','Broken']],def:'random'};
const UD_WEAR={key:'wear',label:'Condition',choices:[['clean','Weathered'],['mossy','Mossy'],['cracked','Cracked']],def:'clean'};
const udStyle=(op,r)=>!op||!op.style||op.style==='random'?UD_STYLES[Math.floor(r()*UD_STYLES.length)]:op.style;
/* tapered coffin lying along z (head at -z), base at y = 0 */
function udCoffin(par,state,r,x=0,z=0,ry=0){const g=new THREE.Group();put(par,g,x,0,z,0,ry,0);const c=vm('coffin');
  const seg=(gg,y,h,mat,shrink=0)=>{bx(gg,.5-shrink,h,.5,mat,0,y,-.75);bx(gg,.66-shrink,h,.6,mat,0,y,-.2);bx(gg,.56-shrink,h,.5,mat,0,y,.35);bx(gg,.44-shrink,h,.4,mat,0,y,.8);};
  if(state==='standing'){g.rotation.x=Math.PI/2;g.position.y=1.0;const s=new THREE.Group();g.add(s);seg(s,0,.44,c);bx(s,.58,.04,.5,vm('iron'),0,.23,-.2);return g;}
  seg(g,.15,.3,c);if(state==='open'){seg(g,.29,.02,vm('velvet'),.08);wlSkull(g,0,.3,-.72,.75,0);for(const zz of[-.15,.25,.55])bx(g,.3,.04,.06,vm('bone'),0,.32,zz);for(const sd of[-1,1])bx(g,.05,.04,.5,vm('bone'),sd*.12,.32,.45);
    const lid=new THREE.Group();put(g,lid,.75,0,.1,0,.15,0);seg(lid,.04,.08,c);}
  else{seg(g,.34,.08,c);bx(g,.06,.02,.4,vm('iron'),0,.39,-.2);bx(g,.3,.02,.06,vm('iron'),0,.39,-.25);}
  return g;}

FOLDERS[''].children.push('undead');
FOLDERS['undead']={name:'Undead kit',blurb:'Graveyards, crypts and the necromancer\'s castle, on a 4 m grid',children:['undead/terrain','undead/nature','undead/graveyard','undead/crypt','undead/castle']};
FOLDERS['undead/terrain']={name:'Terrain',blurb:'Dark grass, grave soil, bone-strewn ground and flagstone paths (4 × 4 m)',children:[]};
FOLDERS['undead/nature']={name:'Nature',blurb:'Gnarled dead trees, glowing toadstools, ground mist, a black swamp',children:[]};
FOLDERS['undead/graveyard']={name:'Graveyard',blurb:'Headstones, graves, tombs, mausoleums, iron fences and gates, lychgate, statues, lamps',children:[]};
const UD=(id,f,name,build,desc,o={})=>ASSETS.push(Object.assign({id:'ud-'+id,folder:'undead/'+f,name,build,desc},o));

/* ======================= terrain ======================= */
const udTileMats0=tileMats;tileMats=function(){const m=udTileMats0();Object.assign(m,{gGrass:{top:vm('gGrass'),side:vm('gGrassSide')},gSoil:{top:vm('gSoil'),side:vm('gSoilSide'),h:T-.02},gPath:{top:vm('gPath'),side:vm('tombDark'),h:T+.02},gEdge:{top:vm('gSoil'),side:vm('gSoilSide')}});return m;};
function udDeco(n,kinds,seedN){return(root,at)=>{const r=mulberry32(seedN);for(let i=0;i<n;i++){const x=(r()-.5)*3.7,z=(r()-.5)*3.7;if(!kinds.includes(at(x,z)))continue;const k=r();vSprite(root,k<.6?shortGrassMat():dryTallMat(),x,T,z,.35,.3+r()*.25,r()*3);}};}
function udTile(kind){if(kind==='grass')return vTile((x,z)=>wlNoise(x,z)>2?'gSoil':'gGrass',udDeco(40,['gGrass'],71));
  if(kind==='soil')return vTile((x,z)=>wlNoise(x,z,.9)<-1.8?'gGrass':'gSoil',(root,at)=>{wlPebbles(root,12,73,['gSoil'],at,['tombDark','cobble']);udDeco(8,['gGrass'],75)(root,at);});
  if(kind==='bones')return vTile((x,z)=>wlNoise(x,z)>1.2?'gGrass':'gSoil',(root,at)=>{const r=mulberry32(77);for(let i=0;i<9;i++){const x=(r()-.5)*3.2,z=(r()-.5)*3.2,y=at(x,z)==='gSoil'?T-.02:T;wlBone(root,.25+r()*.35,x,y,z,r()*3);}
    for(let i=0;i<2;i++){const x=(r()-.5)*3,z=(r()-.5)*3;wlSkull(root,x,at(x,z)==='gSoil'?T-.02:T,z,.9,r()*6);}udDeco(10,['gGrass'],79)(root,at);});}
function udPathTile(shape){const half=1.2,d0=(x,z)=>shape==='c'?Math.abs(Math.hypot(x-2,z-2)-2):shape==='t'?Math.min(Math.abs(x),x>0?Math.abs(z):99):shape==='x'?Math.min(Math.abs(x),Math.abs(z)):Math.abs(x);
  return vTile((x,z)=>{const d=d0(x,z);return d<half?'gPath':d<half+.4?'gEdge':'gGrass';},udDeco(22,['gGrass'],81+shape.length));}
[['grass','Dark grass','Rank, dark grass with a few bare patches.'],['soil','Grave soil','Dark, freshly turned soil with stones.'],['bones','Bone-strewn ground','Soil and grass littered with bones and two skulls.']]
 .forEach(([k,n,d])=>UD('t-'+k,'terrain',n,()=>udTile(k),d+' 4 × 4 m tile, top at 0.8 m.',{groundR:-1}));
[['','Graveyard path','Straight path of worn dark flagstones, moss in the joints, soil edges.'],['-c','Graveyard path corner','Curved quarter turn, south edge to east edge.'],['-t','Graveyard path T-junction','North–south path with a branch to the east.'],['-x','Graveyard path crossroads','Two paths crossing.']]
 .forEach(([s,n,d])=>UD('t-path'+s,'terrain',n,()=>udPathTile(s?s.slice(1):'s'),d+' 4 × 4 m tile.',{groundR:-1}));

/* ======================= nature ======================= */
function udTree(size){return s=>{const root=udRoot(size==='large'?5:3.2),r=mulberry32((s||1)*911+(size==='large'?3:0)),m=vm('udBark'),H=size==='large'?5.4+r()*1.4:2.8+r()*.8,w0=size==='large'?.8:.45,tips=[];
  const pts=wlTrunk(root,m,H,w0,r);for(let i=0;i<5;i++){const a=i*1.26+r()*.5;wlBeam(root,[Math.sin(a)*w0*.3,.35,Math.cos(a)*w0*.3],[Math.sin(a)*(w0*.5+.7),.06,Math.cos(a)*(w0*.5+.7)],w0*.34,m);}
  const nb=size==='large'?6:3;for(let i=0;i<nb;i++){const p=pts[Math.min(pts.length-1,Math.floor(pts.length*(.4+i/nb*.55)))];wlBranch(root,m,[p[0],p[1]-.1,p[2]],i*2.2+r(),.15+r()*.5,H*(.4+r()*.2),p[3]*.55,r,size==='large'?2:1,tips);}
  for(const[x,y,z]of tips)if(r()<.6&&y>1.6){const L=.3+r()*.8;bx(root,.07,L,.07,vm('udMoss'),x,y-L/2,z);if(r()<.5)bx(root,.05,L*.6,.05,vm('udMoss'),x+.06,y-L*.3,z);}
  for(let i=0;i<5;i++){const a=r()*6.28,d=.8+r()*1.2;wlTuft(root,Math.cos(a)*d,0,Math.sin(a)*d,r,r()<.5);}return root;};}
function udShrooms(s){const root=udRoot(2),r=mulberry32((s||1)*919);for(let k=0;k<12;k++){const a=r()*6.28,d=Math.sqrt(r()),sc=.6+r()*1.5,x=Math.cos(a)*d,z=Math.sin(a)*d;
  bx(root,.06*sc,.22*sc,.06*sc,vm('woolWhite'),x,.11*sc,z);bx(root,.22*sc,.08*sc,.22*sc,UDGLOW,x,.25*sc,z);bx(root,.12*sc,.05*sc,.12*sc,UDGLOW,x,.315*sc,z);}
  vlog(root,1.4,.3,.3,'x',-.3,.15,.6).rotation.y=.4;const pl=new THREE.PointLight(0xb070ff,0,4,2);pl.position.set(0,.6,0);pl.userData.lamp=true;pl.userData.min=.4;root.add(pl);root.userData.lights.push(pl);return root;}
/* ground mist: thin translucent slabs drifting slowly */
function udMist(par,x,z,R,n,r){for(let i=0;i<n;i++){const a=r()*6.28,d=Math.sqrt(r())*R,w=1+r()*1.8,dd=.8+r()*1.4,y=.12+r()*.35,m=new THREE.Mesh(new THREE.PlaneGeometry(w,dd).rotateX(-Math.PI/2),MISTMAT);const px=x+Math.cos(a)*d,pz=z+Math.sin(a)*d,ph=r()*6.28;
  m.position.set(px,y,pz);m.castShadow=false;m.receiveShadow=false;m.renderOrder=2;m.onBeforeRender=()=>{const t=performance.now()/1000;m.position.x=px+Math.sin(t*.13+ph)*.6;m.position.z=pz+Math.cos(t*.11+ph)*.5;m.position.y=y+Math.sin(t*.4+ph)*.05;};par.add(m);}}
function udMistAsset(s){const root=udRoot(3),r=mulberry32((s||1)*929);udMist(root,0,0,2.2,16,r);return root;}
function udSwamp(s){const root=udRoot(4),r=mulberry32((s||1)*937),Rx=3,Rz=2.2,c=.4;
  for(let k=-7;k<=7;k++){let run=null;const flush=()=>{if(run){const w=bx(root,(run[1]-run[0]+1)*c,.02,c,UDWATER,(run[0]+run[1])/2*c,.06,k*c);w.castShadow=false;run=null;}};
    for(let i=-9;i<=9;i++){const x=i*c,z=k*c,d=(x/Rx)**2+(z/Rz)**2+(r()-.5)*.12;if(d>1.4){flush();continue;}if(d>1){bx(root,c,.08,c,vm(r()<.5?'gSoil':'mud'),x,.04,z);flush();}else{bx(root,c,.02,c,vm('dark'),x,.01,z);if(run)run[1]=i;else run=[i,i];}}flush();}
  for(let i=0;i<18;i++){const a=r()*6.28,d=Math.sqrt(r()),x=Math.cos(a)*d*(Rx-.3),z=Math.sin(a)*d*(Rz-.3),h=.6+r()*.9,g=new THREE.Group();put(root,g,x,0,z,(r()-.5)*.3,r()*3,(r()-.5)*.3);bx(g,.04,h,.04,vm('deadReed'),0,h/2,0);if(r()<.3)bx(g,.08,.18,.08,vm('cattail'),0,h-.1,0);}
  {const g=new THREE.Group();put(root,g,1.2,0,-.6);bx(g,.5,.6,.5,vm('udBark'),0,.3,0);bx(g,.3,.4,.3,vm('udBark'),.08,.8,.04);bx(g,.2,.06,.6,vm('udBark'),.25,.5,.3,.6,0,0);}
  wlSkull(root,-.9,.02,.5,1,1);udMist(root,0,0,2.6,14,r);return root;}
UD('tree-small','nature','Gnarled tree small',udTree('small'),'Black, crooked dead tree about 3 m with grey moss hanging from its twigs and roots gripping the ground. New look gives a new shape.',{variants:true,defaultSeed:1});
UD('tree-large','nature','Gnarled tree large',udTree('large'),'Big black dead tree about 6 m: twisted trunk, long clawing branches hung with grey moss, splayed roots. New look gives a new shape.',{variants:true,defaultSeed:1});
UD('shrooms','nature','Grave toadstools',udShrooms,'Cluster of pale toadstools with glowing violet caps by a rotten log, with a dim light of their own.',{variants:true,defaultSeed:1});
UD('mist','nature','Ground mist',udMistAsset,'Patch of low, thin mist that drifts slowly; it does not cast shadows.',{variants:true,defaultSeed:1});
UD('swamp','nature','Black swamp pool',udSwamp,'Still black pool in a muddy rim with dead reeds, a rotten stump, a skull and mist over the water.',{variants:true,defaultSeed:1});
UD('thorns','nature','Dead bramble',wlThorn,'Tangle of dark thorny twigs (the wasteland thorn bush).',{variants:true,defaultSeed:2});

/* ======================= graveyard ======================= */
function udHeadAsset(s,op){const root=udRoot(1.4),r=mulberry32((s||1)*941),st=udStyle(op,r);udHeadstone(root,st,r,(op&&op.wear)||'clean',0,0,0,1);if((op&&op.wear)==='mossy')for(let i=0;i<3;i++)wlTuft(root,(r()-.5)*1,0,.4+r()*.3,r,false);return root;}
function udGrave(s,op){const root=udRoot(1.8),r=mulberry32((s||1)*947),st=udStyle(op,r),wear=(op&&op.wear)||'clean';
  for(const sd of[-1,1]){bx(root,.12,.14,2.2,vm('tombDark'),sd*.58,.07,.1);}bx(root,1.28,.14,.12,vm('tombDark'),0,.07,1.14);
  bx(root,1.04,.12,2.0,vm('gSoil'),0,.06,.1);bx(root,.8,.1,1.7,vm('gSoil'),0,.17,.1);udHeadstone(root,st,r,wear,0,-1.12,0,1);
  if(r()<.6){const g=new THREE.Group();put(root,g,(r()-.5)*.3,.22,.5+r()*.3,0,r()*3,0);for(let i=0;i<4;i++)bx(g,.03,.02,.3,vm('deadReed'),(i-1.5)*.03,.01,0,0,(i-1.5)*.15,0);bx(g,.1,.06,.1,vm('deadFlower'),0,.04,-.15);}
  if(wear==='mossy')for(let i=0;i<3;i++)wlTuft(root,(r()-.5)*.8,.22,(r()-.2)*1.4,r,false);return root;}
function udOpenGrave(s,op){const root=udRoot(2.8),r=mulberry32((s||1)*953),st=udStyle(op,r);
  for(const sd of[-1,1])bx(root,.2,.2,2.3,vm('gSoil'),sd*.6,.1,.1);for(const sd of[-1,1])bx(root,1.4,.2,.2,vm('gSoil'),0,.1,.1+sd*1.15);const h=bx(root,1,.02,2.1,vm('dark'),0,.01,.1);h.castShadow=false;
  udHeadstone(root,st,r,'clean',0,-1.45,0,1);wlMound(root,1.5,.3,1,r,vm('gSoil'));wlBeam(root,[1.6,.5,.4],[1.9,1.5,.1],.05,vm('planksDark'));bx(root,.18,.24,.04,vm('iron'),1.56,.4,.43,0,.1,.3);
  {const g=new THREE.Group();put(root,g,-1.25,0,.3,0,.12,0);for(const[zz,w,d]of[[-.75,.5,.5],[-.2,.66,.6],[.35,.56,.5],[.8,.44,.4]])bx(g,w,.06,d,vm('coffin'),0,.03,zz);}
  wlBone(root,.4,-1.1,0,1.4,.6);return root;}
function udTombChest(s,op){const root=udRoot(2),r=mulberry32((s||1)*967),wear=(op&&op.wear)||'clean',st=vm('tomb'),dk=vm('tombDark');
  bx(root,1.4,.2,2.4,dk,0,.1,0);bx(root,1.1,.7,2.1,st,0,.55,0);bx(root,1.3,.14,2.3,st,0,.97,0);bx(root,1,.08,2,st,0,1.08,0);
  for(const sd of[-1,1]){for(let i=0;i<3;i++)bx(root,.02,.36,.4,dk,sd*.56,.55,-.65+i*.65);const k=new THREE.Group();put(root,k,0,.42,sd*1.06,0,sd>0?0:Math.PI,0);bx(k,.22,.18,.03,st,0,.12,0);bx(k,.12,.06,.03,st,0,.01,0);for(const e of[-1,1])bx(k,.05,.04,.02,dk,e*.05,.14,.02);}
  if(wear==='mossy'){bx(root,.9,.04,1.2,vm('moss'),.05,1.14,-.3);bx(root,1.2,.2,.02,vm('moss'),0,.3,1.06);for(let i=0;i<4;i++)wlTuft(root,(r()-.5)*1.6,0,(r()-.5)*2.6,r,false);}
  if(wear==='cracked'){let cx=-.3;for(let k=0;k<5;k++){bx(root,.02,.01,.18,vm('dark'),cx,1.125,-.4+k*.16);cx+=(r()-.5)*.1;}wlRubble(root,.9,.6,3,r,.3,[st],.12);}return root;}
function udMausoleum(s,op){const root=udRoot(3.2),r=mulberry32((s||1)*971),open=(op&&op.door)==='open',wear=(op&&op.wear)||'clean',st=vm('ashlarG'),dk=vm('tombDark');
  bx(root,3.6,.4,4.4,dk,0,.2,0);bx(root,2,.2,.4,dk,0,.1,2.4);bx(root,3.2,2.8,3.6,st,0,1.8,-.2);bx(root,3.36,.2,3.76,dk,0,3.3,-.2);
  const rf=vRoof(3.4,4.2,1.4,vm('slate'),{ov:.1,ovL:.1,step:.35,gable:st,ridge:dk});put(root,rf,0,3.4,0,0,Math.PI/2,0);bx(root,.24,.24,.24,st,0,3.4+1.4+.2,2.1);
  for(const sd of[-1,1]){bx(root,.4,.2,.4,dk,sd*1.25,.5,1.85);bx(root,.3,2.6,.3,st,sd*1.25,1.9,1.85);bx(root,.44,.2,.44,dk,sd*1.25,3.3,1.85);}bx(root,2.9,.2,.4,dk,0,3.3,1.85);
  bx(root,1.3,2.2,.06,vm(open?'dark':'ironB'),0,1.5,1.62);if(!open){bx(root,.04,2.1,.02,vm('dark'),0,1.5,1.66);for(const sd of[-1,1])bx(root,.06,.06,.04,vm('iron'),sd*.12,1.45,1.67);}else{const lf=new THREE.Group();put(root,lf,.62,.4,1.62,0,-1.1,0);bx(lf,.64,2.2,.06,vm('ironB'),-.32,1.1,0);}
  bx(root,1,.3,.04,dk,0,2.85,1.62);for(const sd of[-1,1]){const u=new THREE.Group();put(root,u,sd*1.6,.4,2);bx(u,.24,.08,.24,dk,0,.04,0);bx(u,.3,.34,.3,st,0,.25,0);bx(u,.2,.1,.2,st,0,.47,0);}
  if(wear==='mossy'){for(let i=0;i<5;i++)bx(root,.5+r()*.6,.3+r()*.5,.02,vm('moss'),(r()-.5)*2.4,.6+r()*1.2,1.61);bx(root,3.2,.06,.5,vm('moss'),0,3.43,1.8);for(let i=0;i<6;i++)wlTuft(root,(r()-.5)*3.6,0,2.4+r()*.5,r,false);}
  if(wear==='cracked')for(let k=0;k<2;k++){let cx=(r()<.5?-1:1)*(.9+r()*.4),y=3;for(let i=0;i<8;i++){bx(root,.04,.18,.02,vm('dark'),cx,y,1.61);cx+=(r()-.5)*.08;y-=.18;}}
  return root;}
function udMausoleumLarge(s,op){const root=udRoot(5),L=root.userData.lights,r=mulberry32((s||1)*977),open=(op&&op.door)!=='closed',st=vm('ashlarG'),dk=vm('tombDark');
  bx(root,7.6,.3,6.4,dk,0,.15,0);for(let i=0;i<3;i++){const h=.2+i*.2;bx(root,3.2,h,.4,dk,0,h/2,3.9-i*.4);}bx(root,7.2,.3,6,dk,0,.45,-.1);
  bx(root,6,4.2,4.4,st,0,2.7,-.6);const rf=vRoof(4.6,6.2,2,vm('slate'),{ov:.2,ovL:.2,step:.4,gable:st,ridge:dk});put(root,rf,0,4.8,-.6);bx(root,6.3,.3,4.7,dk,0,4.75,-.6);
  for(const sd of[-1,1]){const b=new THREE.Group();put(root,b,sd*3.15,.6,-.6);bx(b,.6,3.6,4.6,st,0,1.8,0);bx(b,.8,.3,4.8,dk,0,3.7,0);for(const zz of[-2.1,2.1]){bx(b,.6,1,.6,st,0,4.35,zz);bx(b,.4,.6,.4,st,0,5.15,zz);bx(b,.2,.3,.2,st,0,5.6,zz);bx(b,.2,.2,.2,vm('gold'),0,5.85,zz);}}
  for(const x of[-2.1,-.8,.8,2.1]){bx(root,.5,.2,.5,dk,x,.7,2.1);vDisc(root,x,2.1,.22,.8,3.2,st,.11);bx(root,.54,.24,.54,dk,x,4.12,2.1);}
  bx(root,5,.4,.7,dk,0,4.44,2.1);bx(root,5.2,.12,.8,st,0,4.7,2.1);const pd=new THREE.Group();put(root,pd,0,4.76,1.85);for(let i=0;i<4;i++)bx(pd,4.8-i*1.2,.3,.5,st,0,.15+i*.3,0);bx(pd,.3,.3,.3,st,0,1.35,0);
  {const ow=new THREE.Group();put(root,ow,0,5.3,2.11);const R=.3,c=.06;for(let x=-R+c/2;x<R;x+=c){const h=2*Math.sqrt(Math.max(0,R*R-x*x));if(h>.02)bx(ow,c,h,.03,vm('dark'),x,0,0);}for(let k=0;k<12;k++){const a2=k/12*Math.PI*2;bx(ow,.1,.1,.05,vm('tombDark'),Math.cos(a2)*(R+.04),Math.sin(a2)*(R+.04),0);}}
  bx(root,1.8,2.8,.08,vm('dark'),0,2.1,1.62);if(open){for(const sd of[-1,1]){const lf=new THREE.Group();put(root,lf,sd*.9,.6,1.66,0,sd*1.2,0);bx(lf,.9,2.8,.06,vm('ironB'),-sd*.45,1.4,0);for(const y of[.6,1.4,2.2])bx(lf,.8,.06,.04,vm('iron'),-sd*.45,y,.04);}}
  else{for(const sd of[-1,1]){bx(root,.9,2.8,.06,vm('ironB'),sd*.45,2.1,1.68);for(const y of[1.2,2,2.8])bx(root,.8,.06,.04,vm('iron'),sd*.45,y,1.72);}}
  for(const sd of[-1,1]){udFlame(root,L,sd*1.35,.75,2.55,.18,.9);bx(root,.3,.15,.3,vm('ironB'),sd*1.35,.67,2.55);}
  for(const sd of[-1,1]){const g=new THREE.Group();put(root,g,sd*3.5,.3,2.9);bx(g,.6,.6,.6,dk,0,.3,0);wlSkull(g,0,.6,.0,1.4,0);}
  for(let i=0;i<8;i++){const a=r()*3.14,d=4+r()*.6;wlTuft(root,Math.cos(a)*d,0,Math.sin(a)*d*.8+.8,r,r()<.4);}return root;}
function udCryptEntrance(s,op){const root=udRoot(4),L=root.userData.lights,r=mulberry32((s||1)*983),st=vm('ashlarG'),dk=vm('tombDark'),P=1.2,W=3.2,H=2.8,t=.4,y0=P;
  /* platform round a stairwell (x ±1.2, z -1.2…1.2) */
  bx(root,.8,P,4,dk,-1.6,P/2,0);bx(root,.8,P,4,dk,1.6,P/2,0);bx(root,2.4,P,.8,dk,0,P/2,-1.6);bx(root,2.4,P,.8,dk,0,P/2,1.6);
  for(let i=0;i<3;i++){const h=P-(i+1)*.4;bx(root,1.8,h,.4,dk,0,h/2,2.2+i*.4);}
  for(const sd of[-1,1])bx(root,t,H,W,st,sd*(W/2-t/2),y0+H/2,0);bx(root,W,H,t,st,0,y0+H/2,-W/2+t/2);
  for(const sd of[-1,1]){bx(root,(W-1.4)/2,H,t,st,sd*(W/2-(W-1.4)/4),y0+H/2,W/2-t/2);bx(root,.2,.2,t,st,sd*.6,y0+1.9,W/2-t/2);}bx(root,1.4,H-2,t,st,0,y0+2+(H-2)/2,W/2-t/2);bx(root,1.8,.16,.6,dk,0,y0+2.08,W/2-.1);
  const rf=vPyramid(3.8,3.8,1.6,vm('slate'),.4);put(root,rf,0,y0+H+.2,0);bx(root,3.6,.2,3.6,dk,0,y0+H+.1,0);bx(root,.24,.3,.24,st,0,y0+H+1.95,0);bx(root,.22,.22,.22,vm('gold'),0,y0+H+2.21,0);
  for(let i=0;i<2;i++){const h=P-(i+1)*.4;bx(root,2.4,h,.8,dk,0,h/2,.8-i*.8);}const fl=bx(root,2.4,.02,1.6,vm('dark'),0,.01,-.4);fl.castShadow=false;
  const bk=bx(root,2.4,P+H-.2,.04,vm('dark'),0,(P+H-.2)/2,-1.17);bk.castShadow=false;for(const sd of[-1,1]){const w=bx(root,.04,P,2.4,vm('dark'),sd*1.17,P/2,0);w.castShadow=false;}
  for(const sd of[-1,1]){bx(root,.2,.5,.2,dk,sd*1.1,P+.25,1.85);udFlame(root,L,sd*1.1,P+.5,1.85,.18,1);}
  for(let i=0;i<5;i++)wlTuft(root,(r()-.5)*4,0,2.6+r()*.6,r,false);return root;}
function udFence(s){const root=udRoot(2.8),r=mulberry32((s||1)*991),ib=vm('ironB');bx(root,4,.4,.5,vm('tombDark'),0,.2,0);bx(root,4,.06,.56,vm('tomb'),0,.43,0);
  for(let i=0;i<19;i++){const x=-1.8+i*.2;bx(root,.05,1.6,.05,ib,x,1.26,0);const t=new THREE.Group();put(root,t,x,2.1,0,0,0,Math.PI/4);bx(t,.08,.08,.04,ib,0,0,0);}for(const y of[.75,1.85])bx(root,3.8,.06,.06,ib,0,y,0);
  for(let i=0;i<3;i++)wlTuft(root,(r()-.5)*3.6,0,(r()<.5?-1:1)*(.4+r()*.2),r,false);return root;}
function udFencePost(s){const root=udRoot(1.6),dk=vm('tombDark'),st=vm('tomb');bx(root,.8,.3,.8,dk,0,.15,0);bx(root,.6,2,.6,st,0,1.3,0);bx(root,.76,.16,.76,dk,0,2.38,0);bx(root,.36,.2,.36,st,0,2.56,0);bx(root,.3,.3,.3,st,0,2.81,0);return root;}
function udFenceGate(s,op){const root=udRoot(3.2),ib=vm('ironB'),dk=vm('tombDark'),st=vm('tomb');bx(root,5,.1,.8,vm('gPath'),0,.05,0);
  for(const sd of[-1,1]){const p=new THREE.Group();put(root,p,sd*2,0,0);bx(p,1,.3,1,dk,0,.15,0);bx(p,.8,2.8,.8,st,0,1.7,0);bx(p,.96,.2,.96,dk,0,3.2,0);bx(p,.5,.3,.5,st,0,3.45,0);bx(p,.4,.4,.4,st,0,3.8,0);}
  const yA=x=>2.85+.7*Math.sqrt(Math.max(0,1-(x/1.6)**2));for(let i=1;i<13;i++){const x=-1.6+i*3.2/13,h=yA(x)-2.55;bx(root,.05,h,.05,ib,x,2.55+h/2,0);}for(let i=0;i<16;i++){const x0=-1.6+i*.2,x1=x0+.2;wlBeam(root,[x0,yA(x0),0],[x1,yA(x1),0],.06,ib);}
  bx(root,3.2,.08,.08,ib,0,2.55,0);const leaves=[];for(const sd of[-1,1]){const lf=new THREE.Group();put(root,lf,sd*-1.6,0,0);leaves.push([lf,-sd]);for(let i=0;i<8;i++){const x=sd*(.1+i*.2),h=2.3;bx(lf,.05,h-.1,.05,ib,x,.15+(h-.1)/2,0);const t=new THREE.Group();put(lf,t,x,h+.05,0,0,0,Math.PI/4);bx(t,.08,.08,.04,ib,0,0,0);}
    for(const y of[.3,1.2,2.1])bx(lf,1.58,.06,.06,ib,sd*.79,y,0);bx(lf,.08,.08,.08,vm('iron'),sd*1.45,1.2,.05);}
  vGateAnim(root,(op&&op.state)==='open'?1:0,e=>{for(const[lf,hs]of leaves)lf.rotation.y=-hs*e*1.4;});return root;}
function udGraveWall(s,op){const root=udRoot(2.8),r=mulberry32((s||1)*997),broken=(op&&op.state)==='broken',wear=(op&&op.wear)||'mossy',nc=10,prof=[];for(let i=0;i<nc;i++)prof.push(broken?[3,3,2,1,1,2,2,3,3,3][i]:3);
  const G=(i,row)=>row<prof[i];ruGrid(root,nc,4,G,{t:.6});const caps=[];for(let i=0;i<nc;i++){if(prof[i]===3){bx(root,.4,.1,.8,vm('tombDark'),-1.8+i*.4,1.25,0);caps.push([-1.8+i*.4,1.3,.4,.8,0]);}else caps.push([-1.8+i*.4,prof[i]*.4,.4,.6,0]);}
  if(broken)wlRubble(root,0,.7,5,r,.8,[vm('ruin')],.25);ruApplyWear(root,wear==='clean'?'clean':wear==='cracked'?'cracked':'mossy',nc,G,i=>prof[i],caps,r,.6);return root;}
function udLychgate(s){const root=udRoot(3.2),r=mulberry32((s||1)*1009),tb=vm('timber');bx(root,4.4,.1,2,vm('gPath'),0,.05,0);
  for(const sd of[-1,1])for(const zz of[-.7,.7]){bx(root,.5,.3,.5,vm('tombDark'),sd*1.8,.25,zz);bx(root,.24,2.4,.24,tb,sd*1.8,1.6,zz);}
  for(const zz of[-.7,.7])bx(root,4,.24,.24,tb,0,2.92,zz);for(const sd of[-1,1]){bx(root,.24,.24,1.64,tb,sd*1.8,2.92,0);wlBeam(root,[sd*1.8,2.3,-.7],[sd*1.8,2.8,-.2],.12,tb);wlBeam(root,[sd*1.8,2.3,.7],[sd*1.8,2.8,.2],.12,tb);}
  const rf=vRoof(2,4,1.3,vm('slate'),{ov:.45,ovL:.35,step:.33,gable:vm('timber'),ridge:vm('tombDark')});put(root,rf,0,3.04,0);
  for(const sd of[-1,1])bx(root,.36,.08,1.2,vm('planksDark'),sd*1.45,.34,0);for(const sd of[-1,1])for(const zz of[-.45,.45])bx(root,.24,.3,.08,vm('planksDark'),sd*1.45,.15,zz);
  vLantern(root,root.userData.lights,0,2.8,.82);return root;}
function udStatue(s,op){const wings=(op&&op.wings)!=='no',wear=(op&&op.wear)||'mossy',root=udRoot(2),r=mulberry32((s||1)*1013),sm=vm('statue'),dk=vm('tombDark');
  bx(root,1.3,.3,1.3,dk,0,.15,0);bx(root,1,1,1,vm('tomb'),0,.8,0);bx(root,1.16,.16,1.16,dk,0,1.38,0);const y=1.46;
  for(let i=0;i<5;i++){const w=.8-i*.08;bx(root,w,.36,w*.75,sm,0,y+.18+i*.36,0);}bx(root,.5,.2,.4,sm,0,y+1.9,0);const hd=new THREE.Group();put(root,hd,0,y+2.0,.02,.35,0,0);bx(hd,.42,.44,.42,sm,0,.22,0);bx(hd,.3,.3,.06,vm('dark'),0,.2,.2);
  for(const sd of[-1,1]){wlBeam(root,[sd*.3,y+1.85,0],[sd*.14,y+1.95,.32],.16,sm);bx(root,.14,.2,.12,sm,sd*.1,y+2.08,.36);}
  if(wings)for(const sd of[-1,1]){const w=new THREE.Group();put(root,w,sd*.22,y+1.2,-.25,0,sd*.25,0);for(let i=0;i<5;i++)bx(w,.12,.5+i*.3,.3,sm,sd*(.06+i*.1),.25+i*.18,-.1-i*.02);}
  if(wear==='mossy'){bx(root,1,.04,.3,vm('moss'),.1,1.48,.4);bx(root,.4,.3,.02,vm('moss'),-.2,.6,.51);for(let i=0;i<4;i++)wlTuft(root,(r()-.5)*1.6,0,.8+r()*.3,r,false);}
  if(wear==='cracked'){let cx=.1;for(let k=0;k<5;k++){bx(root,.03,.12,.02,vm('dark'),cx,1.1-k*.1,.51);cx+=(r()-.5)*.06;}}return root;}
function udLamp(s,op){const root=udRoot(1.4),ib=vm('ironB'),green=(op&&op.light)==='green';bx(root,.5,.2,.5,vm('tombDark'),0,.1,0);bx(root,.14,2.6,.14,ib,0,1.5,0);bx(root,.24,.2,.24,ib,0,2.9,0);if(green)bx(root,.08,.08,.5,ib,0,2.85,.25);
  if(green){const g=new THREE.Group();put(root,g,0,2.81,.5);bx(g,.04,.12,.04,ib,0,-.06,0);bx(g,.26,.04,.26,ib,0,-.14,0);bx(g,.26,.04,.26,ib,0,-.5,0);for(const[a,b]of[[1,1],[1,-1],[-1,1],[-1,-1]])bx(g,.03,.34,.03,ib,a*.115,-.32,b*.115);udFlame(g,root.userData.lights,0,-.48,0,.12,.9);}
  else vLantern(root,root.userData.lights,0,2.85,0);return root;}
function udGibbet(s){const root=udRoot(2.4),r=mulberry32((s||1)*1019),tb=vm('timber');bx(root,.6,.2,.6,vm('tombDark'),0,.1,0);bx(root,.26,4.2,.26,tb,0,2.2,0);bx(root,1.8,.22,.22,tb,.78,4.1,0);wlBeam(root,[0,3.2,0],[.9,4.0,0],.14,tb);
  let y=3.99;for(let i=0;i<5;i++){bx(root,i%2?.03:.07,.14,i%2?.07:.03,vm('iron'),1.5,y-.07,0);y-=.12;}const c=new THREE.Group();put(root,c,1.5,y-1.3,0);const ib=vm('ironB');
  bx(c,.74,.06,.74,ib,0,1.3,0);bx(c,.74,.06,.74,ib,0,0,0);for(let i=0;i<4;i++)for(const sd of[-1,1]){bx(c,.04,1.3,.04,ib,-.3+i*.2,.65,sd*.35);bx(c,.04,1.3,.04,ib,sd*.35,.65,-.3+i*.2);}bx(c,.1,.12,.1,ib,0,1.38,0);
  wlSkull(c,.05,.03,.05,.9,.6);wlBone(c,.4,-.05,.03,-.1,.4);bx(c,.24,.1,.16,vm('bone'),.1,.5,-.1,.3,0,.5);bx(c,.05,.6,.05,vm('bone'),-.15,.33,.15,0,0,.3);
  for(let i=0;i<3;i++)wlTuft(root,(r()-.5)*1.4,0,(r()-.5)*1.4,r,true);return root;}
function udDiggerCart(s){const root=udRoot(3),r=mulberry32((s||1)*1021);vCart(root,0,0,0,null).position.y=-.05;udCoffin(root,'closed',r,0,-.2,0).position.y=.7;wlBeam(root,[.45,.75,.8],[.5,1.6,-.6],.05,vm('planksDark'));bx(root,.2,.26,.04,vm('iron'),.5,1.66,-.65,0,0,.1);
  bx(root,.06,.8,.06,vm('planksDark'),-.5,1.1,-.98);vLantern(root,root.userData.lights,-.5,1.45,-.98).rotation.y=Math.PI;return root;}
UD('headstone','graveyard','Headstone',udHeadAsset,'Single headstone on a stone footing, leaning a little: rounded, slab, pointed, obelisk with a ball, skull-carved or broken off with its top lying in front. Inscription lines face +z.',{opts:[UD_STYLE_OPT,UD_WEAR],variants:true,defaultSeed:1});
UD('grave','graveyard','Grave',udGrave,'Grave plot 1.3 × 2.4 m: stone kerb, a mound of soil, headstone at the head (-z) end and sometimes a bunch of dead flowers.',{opts:[UD_STYLE_OPT,UD_WEAR],variants:true,defaultSeed:1});
UD('grave-open','graveyard','Open grave',udOpenGrave,'Freshly dug grave: a dark pit in a rim of soil, the heap of earth beside it with a shovel stuck in, the coffin lid leaning against the rim, headstone and a bone.',{opts:[UD_STYLE_OPT],variants:true,defaultSeed:1});
UD('tomb','graveyard','Chest tomb',udTombChest,'Stone chest tomb on a plinth: panelled sides, a skull carved on each end, a heavy moulded lid.',{opts:[UD_WEAR],variants:true,defaultSeed:1});
UD('mausoleum','graveyard','Mausoleum',udMausoleum,'Small family mausoleum on a 3.6 × 4.4 m plinth: ashlar walls, two square columns, a slate gable with a stone ball, an iron door (closed or one leaf open on darkness), urns on the plinth.',{opts:[{key:'door',label:'Door',choices:[['closed','Closed'],['open','Open']],def:'closed'},UD_WEAR],variants:true,defaultSeed:1});
UD('mausoleum-large','graveyard','Grand mausoleum',udMausoleumLarge,'Great crypt of an old family (or a vampire), 7.6 × 6.4 m and 7 m high: front stairs, a portico of four round columns, pediment, side buttresses with pinnacles and gold balls, a round window, a double iron door and green flames in iron bowls beside it, skulls on posts.',{opts:[{key:'door',label:'Door',choices:[['open','Open'],['closed','Closed']],def:'open'}],variants:true,defaultSeed:1});
UD('crypt-entrance','graveyard','Crypt entrance',udCryptEntrance,'Way down into the crypts on one 4 × 4 m cell: a 1.2 m stone platform with front steps, a small slate-roofed portal on it, steps inside going down into darkness, green flames either side.',{});
UD('fence','graveyard','Iron fence',udFence,'Wrought iron fence on a low stone kerb: bars with spear tips and two rails. 4 m long, centred on the grid line.',{variants:true,defaultSeed:1});
UD('fence-post','graveyard','Fence pillar',udFencePost,'Stone pillar with a cap and a stone ball, for a grid vertex: hides the fence and wall ends that meet there.',{});
UD('fence-gate','graveyard','Iron gate',udFenceGate,'Double iron gate for a 4 m gap between two tall stone pillars with balls, an arch of bars above; the leaves swing inwards.',{opts:[{key:'state',label:'Gate',choices:[['closed','Closed'],['open','Open']],def:'closed',live:true}]});
UD('wall','graveyard','Graveyard wall',udGraveWall,'Low old stone wall, 1.3 m with a coping, 0.6 m thick; intact or broken down in the middle. 4 m long, centred on the grid line.',{opts:[{key:'state',label:'State',choices:[['intact','Intact'],['broken','Broken']],def:'intact'},Object.assign({},UD_WEAR,{def:'mossy'})],variants:true,defaultSeed:1});
UD('lychgate','graveyard','Lychgate',udLychgate,'Roofed timber gateway for a 4 m gap in the graveyard wall, slate roof, two benches inside and a lantern under the eaves.',{});
UD('statue','graveyard','Mourner statue',udStatue,'Hooded stone mourner on a plinth, head bowed into its hands, with folded wings or without.',{opts:[{key:'wings',label:'Wings',choices:[['yes','Yes'],['no','No']],def:'yes'},Object.assign({},UD_WEAR,{def:'mossy'})],variants:true,defaultSeed:1});
UD('lamp','graveyard','Lamp post',udLamp,'Iron lamp post with a lantern on an arm: warm light, or a ghostly green flame.',{opts:[{key:'light',label:'Light',choices:[['warm','Warm'],['green','Ghostly green']],def:'warm'}]});
UD('gibbet','graveyard','Gibbet',udGibbet,'Timber gibbet with a braced arm, a chain and an iron cage holding a skeleton.',{});
UD('digger-cart','graveyard','Gravedigger\'s cart',udDiggerCart,'Hand cart with a coffin on it, a shovel leaning in and a lantern on a pole.',{});
