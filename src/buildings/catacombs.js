/* ======================= UNDEAD KIT: catacombs and the depths (ud-cata-, ud-) =======================
   Catacomb pieces are whole 4 × 4 m cells: floor (top at y = 0), walls and a low stepped vault (2.8–3.6 m).
   The passage is 2.4 m wide, centred on the cell (x -1.2…1.2), running along z; the side walls are 0.8 m thick and carry three tiers of burial niches.
   Rotate a piece to turn it; the stair goes down 3.2 m (one catacomb level) towards -z. */
FOLDERS['undead'].children.push('undead/catacombs');
FOLDERS['undead/catacombs']={name:'Catacombs & depths',blurb:'Whole-cell catacomb passages (straight, corner, T, dead end, stair down, gate, flooded, collapsed, chasm) and things of the depths',children:[]};
const CA_NI=[[1,2],[4,5],[7,8]],CA_TIERS=[1,3,5];
/* a niche wall face: 4 m long (10 columns), 2.8 m high, 0.8 m thick, centred at its origin, face towards local +z */
function caFace(par,x,z,ry,r,o={}){const g=new THREE.Group();put(par,g,x,o.y||0,z,0,ry,0);const mat=vm('crypt'),pm=vm('cryptDark'),nc=o.nc||10,rows=o.rows||7;
  const niche=(i,row)=>!o.plain&&CA_NI.some(([a,b])=>i>=a&&i<=b&&b<nc)&&CA_TIERS.includes(row);
  ruGrid(g,nc,rows,()=>true,{t:.3,z:-.25,mat,pmat:pm,noPlinth:true});ruGrid(g,nc,rows,(i,row)=>!niche(i,row),{t:.5,z:.15,mat,pmat:pm,noPlinth:true});
  if(!o.plain)for(const[a,b]of CA_NI)if(b<nc)for(const row of CA_TIERS){const cx=-nc*.2+(a+1)*.4,y=row*.4,k=r();
    if(k<.45){wlSkull(g,cx+(r()-.5)*.15,y,.12,.75,(r()-.5)*.5);if(r()<.6)wlBone(g,.4,cx,y,.32,0);}else if(k<.75){for(let j=0;j<3;j++)bx(g,.6,.04,.05,vm('bone'),cx,y+.02+j*.045,.05+j*.08);wlSkull(g,cx+.18,y+.13,.1,.5,0);}
    else if(k<.9){bx(g,.66,.2,.36,vm('burlap'),cx,y+.1,.18);}if(r()<.15)udWebAt(g,cx+.38,y+.4,.38,.3,0);}
  return g;}
/* floor, vault and the open-cell mask; open(x,z) says where the passage is */
function caShell(root,open,r,o={}){const c=.4,cf=vm('cryptFloor'),cm=vm('crypt'),dk=vm('cryptDark');if(!o.noFloor){const f=box(4,.2,4,[dk,dk,cf,dk,dk,dk],{s:.8,ox:0,oy:0,oz:0});put(root,f,0,-.1,0);}
  ruBox(root,4,.4,4,cm,0,3.4,0,-2,3.2);
  for(let i=0;i<10;i++)for(let k=0;k<10;k++){const x=-1.8+i*c,z=-1.8+k*c;if(!open(x,z))continue;const nb=[[1,0],[-1,0],[0,1],[0,-1]].some(([a,b])=>{const xx=x+a*c,zz=z+b*c;return Math.abs(xx)<2&&Math.abs(zz)<2&&!open(xx,zz);});
    if(nb)bx(root,c,.4,c,cm,x,3,z);}
  if(!o.noDeco){for(let i=0;i<5;i++){const x=(r()-.5)*2,z=(r()-.5)*3.6;if(open(x,z))bx(root,.08+r()*.08,.03,.08,vm(r()<.5?'bone':'crypt'),x,.015,z,0,r()*3,0);}if(r()<.5){const x=(r()-.5)*1.6,z=(r()-.5)*3;if(open(x,z))wlBone(root,.35,x,0,z,r()*3);}}}
function caSolid(root,x0,x1,z0,z1,h=2.8,y0=0){ruBox(root,x1-x0,h,z1-z0,vm('crypt'),(x0+x1)/2,y0+h/2,(z0+z1)/2,x0,y0);}
function caStraight(s,op){const root=udRoot(-1),r=mulberry32((s||1)*1201);root.userData.ground=-1;caShell(root,(x,z)=>Math.abs(x)<1.2,r);caFace(root,-1.6,0,Math.PI/2,r);caFace(root,1.6,0,-Math.PI/2,r);
  if((op&&op.light)==='sconce')for(const sd of[-1,1]){const sc=cwSconce(root,root.userData.lights,0,1.9,true);sc.position.set(sd*1.2,1.9,sd*.6);sc.rotation.y=-sd*Math.PI/2;}return root;}
function caCorner(s){const root=udRoot(-1),r=mulberry32((s||1)*1203);root.userData.ground=-1;const open=(x,z)=>(Math.abs(x)<1.2&&z>-1.2)||(Math.abs(z)<1.2&&x>-1.2);caShell(root,open,r);
  caFace(root,-1.6,0,Math.PI/2,r);caFace(root,0,-1.6,0,r);caSolid(root,1.2,2,1.2,2);caSolid(root,-2,-1.2,-2,-1.2);return root;}
function caTee(s){const root=udRoot(-1),r=mulberry32((s||1)*1207);root.userData.ground=-1;const open=(x,z)=>Math.abs(x)<1.2||(Math.abs(z)<1.2&&x>0);caShell(root,open,r);
  caFace(root,-1.6,0,Math.PI/2,r);caSolid(root,1.2,2,1.2,2);caSolid(root,1.2,2,-2,-1.2);return root;}
function caEnd(s){const root=udRoot(-1),L=root.userData.lights,r=mulberry32((s||1)*1211);root.userData.ground=-1;const open=(x,z)=>Math.abs(x)<1.2&&z>-1.2;caShell(root,open,r);
  caFace(root,-1.6,0,Math.PI/2,r);caFace(root,1.6,0,-Math.PI/2,r);caSolid(root,-1.2,1.2,-2,-1.2);
  for(let row=0;row<6;row++){const y=.5+row*.42;for(let k=0;k<8;k++)cwSkullTile(root,-1.05+k*.3,y,-1.15,r);if(row<5)bx(root,2.4,.06,.06,vm('bone'),0,y+.21,-1.16);}
  ruBox(root,1.2,.8,.5,vm('cryptDark'),0,.4,-.9,-.6,0);wlSkull(root,0,.8,-.9,1.2,0);udCandle(root,-.4,.8,-.85,.2);udCandle(root,.42,.8,-.95,.14);udCandle(root,.3,0,-.5,.25);const pl=new THREE.PointLight(0xf6ce78,0,5,2);pl.position.set(0,1.3,-.6);pl.userData.lamp=true;pl.userData.min=.5;root.add(pl);L.push(pl);return root;}
function caStairs(s){const root=udRoot(-1),r=mulberry32((s||1)*1213);root.userData.ground=-1;const cf=vm('cryptFloor'),dk=vm('cryptDark'),cm=vm('crypt');
  for(let i=1;i<=8;i++){const top=-.4*i,z=2-(i-.5)*.5;const b=box(2.4,top+3.6,.5,[dk,dk,cf,dk,dk,dk],{s:.8,ox:0,oy:0,oz:0});put(root,b,0,(top-3.6)/2,z);const cl=top+3.2;ruBox(root,4,.4,.5,cm,0,cl+.2,z,-2,cl);}
  for(const sd of[-1,1]){ruBox(root,.8,7.2,4,cm,sd*1.6,0,0,0,-3.6);}
  for(const sd of[-1,1]){const sc=cwSconce(root,root.userData.lights,0,0,true);sc.position.set(sd*1.2,.4,0);sc.rotation.y=-sd*Math.PI/2;}return root;}
function caGate(s,op){const root=caStraight(s,{});const ib=vm('ironB'),leaves=[];for(const sd of[-1,1]){const lf=new THREE.Group();put(root,lf,sd*1.2,0,0);leaves.push([lf,sd]);
    for(let i=0;i<5;i++){const x=-sd*(.12+i*.24);bx(lf,.05,2.6,.05,ib,x,1.35,0);bx(lf,.04,.12,.04,ib,x,2.72,0);}for(const y of[.3,1.4,2.5])bx(lf,1.2,.06,.06,ib,-sd*.6,y,0);bx(lf,.08,.08,.08,vm('iron'),-sd*1.12,1.4,.05);}
  for(const sd of[-1,1])bx(root,.12,2.8,.16,ib,sd*1.22,1.4,0);
  vGateAnim(root,(op&&op.state)==='open'?1:0,e=>{for(const[lf,sd]of leaves)lf.rotation.y=sd*e*1.5;});return root;}
function caFlooded(s){const root=udRoot(-1),r=mulberry32((s||1)*1217);root.userData.ground=-1;caShell(root,(x,z)=>Math.abs(x)<1.2,r,{noFloor:true,noDeco:true});caFace(root,-1.6,0,Math.PI/2,r,{y:-.4});caFace(root,1.6,0,-Math.PI/2,r,{y:-.4});
  const dk=vm('cryptDark');put(root,box(4,.2,4,dk,{s:.8,ox:0,oy:0,oz:0}),0,-.5,0);const w=bx(root,2.4,.02,4,UDWATER,0,-.12,0);w.castShadow=false;
  for(let i=0;i<5;i++){const z=-1.6+i*.8,x=(i%2?.35:-.35)+(r()-.5)*.1;ruBox(root,.6,.4,.5,vm('crypt'),x,-.2,z,0,-.4);}
  for(let i=0;i<4;i++){const z=(r()-.5)*3.4,x=(r()-.5)*1.8;wlBone(root,.3,x,-.4,z,r()*3);}wlSkull(root,.7,-.17,.9,.8,2);return root;}
function caCollapsed(s){const root=udRoot(-1),r=mulberry32((s||1)*1219);root.userData.ground=-1;caShell(root,(x,z)=>Math.abs(x)<1.2,r);caFace(root,-1.6,0,Math.PI/2,r);caFace(root,1.6,0,-Math.PI/2,r);
  wlMound(root,-.3,-.2,1.5,r,vm('crypt'),(px,pz,y)=>Math.abs(px)>1.15||Math.abs(pz)>1.9||px>.5);wlRubble(root,.4,0,8,r,1.4,[vm('crypt'),vm('cryptDark')],.35);
  for(let i=0;i<3;i++){const g=new THREE.Group();put(root,g,-.4+i*.3,.0,-1+i*.8,(r()-.5)*.3,r()*3,0);ruBox(g,.8,.4,.4,vm('crypt'),0,.2,0,0,0);}
  const hole=bx(root,1.2,.42,1.6,vm('dark'),-.4,3.42,-.4);hole.castShadow=false;return root;}
function caChasm(s){const root=udRoot(-1),L=root.userData.lights,r=mulberry32((s||1)*1223);root.userData.ground=-1;const cf=vm('cryptFloor'),dk=vm('cryptDark'),cm=vm('crypt');
  caShell(root,(x,z)=>Math.abs(x)<1.2,r,{noFloor:true,noDeco:true});caFace(root,-1.6,0,Math.PI/2,r);caFace(root,1.6,0,-Math.PI/2,r);
  for(const sd of[-1,1]){const f=box(4,.2,.4,[dk,dk,cf,dk,dk,dk],{s:.8,ox:0,oy:0,oz:0});put(root,f,0,-.1,sd*1.8);}for(const sd of[-1,1]){const f=box(.8,.2,3.2,[dk,dk,cf,dk,dk,dk],{s:.8,ox:0,oy:0,oz:0});put(root,f,sd*1.6,-.1,0);}
  for(const sd of[-1,1]){ruBox(root,2.4,8,.2,cm,0,-4.2,sd*1.5,-1.2,-8.2);ruBox(root,.2,8,3.2,cm,sd*1.1,-4.2,0,-1.6,-8.2);}
  const bot=bx(root,2.2,.02,3,RUNEMAT,0,-8.1,0);bot.castShadow=false;{const mg=new THREE.Group();put(root,mg,0,-7.9,0);udMist(mg,0,0,1,6,r);}
  for(let i=0;i<8;i++){const z=-1.5+i*.43,ch=r()<.25?.06:0;ruBox(root,.8-ch*2,.4,.42,cm,(r()-.5)*.04,-.2,z,-.4,-.4);}
  const pl=new THREE.PointLight(0xb0e8c3,0,9,2);pl.position.set(0,-5,0);pl.userData.lamp=true;pl.userData.min=.7;root.add(pl);L.push(pl);return root;}
/* ---------- things of the depths ---------- */
function udSoulWell(s){const root=udRoot(2.6),L=root.userData.lights,r=mulberry32((s||1)*1229),c=.4,R=1.4;
  for(let i=-5;i<5;i++)for(let k=-5;k<5;k++){const x=(i+.5)*c,z=(k+.5)*c,d=Math.hypot(x,z);if(d<R+.6&&d>=R)ruBox(root,c,.9,c,vm('cryptDark'),x,.45,z,x,0);else if(d<R+1)bx(root,c,.1,c,vm('cryptFloor'),x,.05,z);else if(d<R){const m=bx(root,c,.04,c,RUNEMAT,x,.6,z);m.castShadow=false;bx(root,c,.58,c,vm('dark'),x,.29,z);}}
  for(let k=0;k<8;k++){const a=k/8*Math.PI*2;bx(root,.36,.12,.36,vm('crypt'),Math.cos(a)*(R+.3),.96,Math.sin(a)*(R+.3),0,-a,0);if(k%2===0)wlSkull(root,Math.cos(a)*(R+.3),1.02,Math.sin(a)*(R+.3),.8,-a+Math.PI/2);}
  const wisps=[];for(let i=0;i<7;i++){const w=new THREE.Group();w.name='wisp_'+i;const a=r()*6.28,d=r()*R*.7;put(root,w,Math.cos(a)*d,.7,Math.sin(a)*d);const m=new THREE.Mesh(new THREE.BoxGeometry(.18,.4,.18),NFIRE);m.castShadow=false;w.add(m);wisps.push(w);}
  const pl=new THREE.PointLight(0xb0e8c3,0,8,2);pl.position.set(0,1.4,0);pl.userData.lamp=true;pl.userData.min=.9;root.add(pl);L.push(pl);
  propAnim(root,wisps,[{name:'Idle',dur:4,loop:true,fn:(t,S)=>{wisps.forEach((w,i)=>{const u=((t/4)+i/7)%1,a=i*1.7+u*3;S[w.name]={p:[w.position.x+Math.sin(a)*.15,.7+u*2.4,w.position.z+Math.cos(a)*.15],r:[0,u*3,0],s:u<.1?u*10:u>.75?(1-u)*4:1};});}}]);return root;}
function udBoneThrone(s){const root=udRoot(2.4),r=mulberry32((s||1)*1231),dk=vm('cryptDark');ruBox(root,3,.3,2.6,dk,0,.15,0,-1.5,0);ruBox(root,2.4,.3,2,vm('crypt'),0,.45,-.1,-1.2,.3);
  wlMound(root,0,-.3,.9,r,vm('bone'),(x,z,y)=>z>.3);bx(root,1.2,.5,.9,vm('bone'),0,.85,.1);for(let i=0;i<6;i++)wlBone(root,.9,(r()-.5)*.4,1.1+(i%2)*.05,-.2+i*.12,(r()-.5)*.3);
  for(let row=0;row<7;row++){const w=7-Math.abs(row-2)*.6;for(let k=0;k<Math.round(w);k++){const x=(k-(Math.round(w)-1)/2)*.27;wlSkull(root,x,1.1+row*.25,-.45,1,(r()-.5)*.3);}}
  for(const sd of[-1,1]){for(let j=0;j<4;j++)wlBone(root,.7,sd*.75,.9+j*.07,0,Math.PI/2);wlSkull(root,sd*.75,1.18,.3,1.2,0);const h=new THREE.Group();put(root,h,sd*.6,2.8,-.45,0,0,-sd*.4);bx(h,.14,.9,.14,vm('bone'),0,.45,0);bx(h,.1,.4,.1,vm('bone'),sd*.1,.95,0,0,0,-sd*.4);}
  wlHornSkull(root,0,2.85,-.4,1.3,0);for(let i=0;i<8;i++){const a=r()*3.14,d=1.7+r()*.4;wlBone(root,.3+r()*.3,Math.cos(a)*d,0,Math.sin(a)*d*.8+.4,r()*3);}return root;}
function udPhylactery(s){const root=udRoot(1.6),L=root.userData.lights,dk=vm('cryptDark');ruBox(root,1.4,.3,1.4,dk,0,.15,0,-.7,0);ruBox(root,.8,1,.8,vm('crypt'),0,.8,0,-.4,.3);ruBox(root,1,.15,1,dk,0,1.37,0,-.5,1.3);
  for(const[a,b]of[[1,1],[1,-1],[-1,1],[-1,-1]]){bx(root,.06,.5,.06,vm('ironB'),a*.36,1.7,b*.36);udCandle(root,a*.5,.3,b*.5,.18);}
  const gem=new THREE.Group();gem.name='phylactery';put(root,gem,0,2,0);bx(gem,.3,.3,.3,RUNEMAT,0,0,0);const q=bx(gem,.22,.22,.22,RUNEMAT,0,0,0);q.rotation.set(.6,.6,0);bx(gem,.36,.06,.36,vm('gold'),0,-.17,0);bx(gem,.36,.06,.36,vm('gold'),0,.17,0);
  const pl=new THREE.PointLight(0xb0e8c3,0,6,2);pl.position.set(0,2,0);pl.userData.lamp=true;pl.userData.min=.8;root.add(pl);L.push(pl);
  propAnim(root,[gem],[{name:'Idle',dur:4,loop:true,fn:(t,S)=>{const a=t/4*Math.PI*2;S.phylactery={p:[0,2+Math.sin(a)*.08,0],r:[0,a,0]};}},{name:'Shatter',dur:1.5,hold:true,fn:(t,S)=>{S.phylactery={p:[0,2,0],r:[0,t*20,0],s:t<.6?1+t*.5:Math.max(1e-4,1.3-(t-.6)*4)};}}]);return root;}
function udSkullPillar(s){const root=udRoot(2),r=mulberry32((s||1)*1237),dk=vm('cryptDark');ruBox(root,2,.4,2,dk,0,.2,0,-1,0);ruBox(root,1.6,4.2,1.6,vm('crypt'),0,2.5,0,-.8,.4);ruBox(root,2,.4,2,dk,0,4.8,0,-1,4.6);
  for(let f=0;f<4;f++){const g=new THREE.Group();put(root,g,0,0,0,0,f*Math.PI/2,0);for(let row=0;row<9;row++){const y=.75+row*.42;for(let k=0;k<5;k++)cwSkullTile(g,-.6+k*.3,y,.84,r);if(row<8)bx(g,1.6,.05,.05,vm('bone'),0,y+.21,.83);}}return root;}
UD('cata-straight','catacombs','Catacomb passage',caStraight,'Whole 4 × 4 m cell of catacomb: a 2.4 m passage along z between walls with three tiers of burial niches (skulls, bundled bones, shrouds, cobwebs), a low stepped vault and a flagstone floor (top at y = 0). Optional green sconces.',{opts:[{key:'light',label:'Light',choices:[['none','None'],['sconce','Green sconces']],def:'none'}],variants:true,defaultSeed:1,groundR:-1});
UD('cata-corner','catacombs','Catacomb corner',caCorner,'Catacomb cell turning from the +z edge to the +x edge, niche walls on the outside of the bend.',{variants:true,defaultSeed:1,groundR:-1});
UD('cata-t','catacombs','Catacomb T-junction',caTee,'Catacomb passage along z with a branch to +x.',{variants:true,defaultSeed:1,groundR:-1});
UD('cata-end','catacombs','Catacomb dead end',caEnd,'Passage from the +z edge ending at an ossuary wall of skulls and bones, a little skull altar with candles before it.',{variants:true,defaultSeed:1,groundR:-1});
UD('cata-stairs','catacombs','Catacomb stair down',caStairs,'Stair going down 3.2 m (one catacomb level) in eight steps towards -z, the vault stepping down with it, a green sconce on each wall. The lower end meets a cell whose floor is at y = -3.2.',{groundR:-1});
UD('cata-gate','catacombs','Catacomb gate',caGate,'Catacomb passage closed by a double grille of iron bars that swings open. Clips Open and Close.',{opts:[{key:'state',label:'Gate',choices:[['closed','Closed'],['open','Open']],def:'closed',live:true}],groundR:-1});
UD('cata-flooded','catacombs','Flooded passage',caFlooded,'Catacomb passage standing in black water, the floor 0.4 m down, a row of stepping stones (tops at y = 0) and sunken bones.',{variants:true,defaultSeed:1,groundR:-1});
UD('cata-collapsed','catacombs','Collapsed passage',caCollapsed,'Catacomb passage half blocked by a fall of masonry from a hole in the vault; a gap is left along one wall.',{variants:true,defaultSeed:1,groundR:-1});
UD('cata-chasm','catacombs','Chasm bridge',caChasm,'The floor of the passage has fallen into the depths: an 8 m shaft with a faint green glow and mist at the bottom, crossed by a narrow stone bridge without rails.',{variants:true,defaultSeed:1,groundR:-1});
UD('soulwell','catacombs','Well of souls',udSoulWell,'Round stone well brimming with glowing green souls, skulls on the rim; green wisps rise and fade (Idle loop).',{variants:true,defaultSeed:1});
UD('bone-throne','catacombs','Bone throne',udBoneThrone,'The lich\'s throne: a seat heaped with bones, a back of stacked skulls, bone horns, a horned skull on top, on a stone dais.',{variants:true,defaultSeed:1});
UD('phylactery','catacombs','Phylactery shrine',udPhylactery,'Stone pedestal with four candles and iron prongs; the lich\'s phylactery, a glowing green gem in gold bands, floats and turns above it (Idle) or shatters (Shatter).',{});
UD('skull-pillar','catacombs','Skull pillar',udSkullPillar,'Crypt pillar for a grid vertex faced on all sides with rows of skulls and bones, 5 m.',{variants:true,defaultSeed:1});
