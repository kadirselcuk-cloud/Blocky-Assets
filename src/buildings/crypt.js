/* ======================= UNDEAD KIT: crypts (ud-crypt-) =======================
   Interior rooms on the 4 m grid, 4.8 m high: walls are 4 m long, centred on the grid line, 1.2 m thick, face towards +z (into the room);
   pillars go on the vertices, the vault (4.0–5.6 m) sits on the wall tops, the floor is a terrain-style tile (top at 0.8 m). */
VXD.crypt=(P,r)=>{const tone=[];for(let i=0;i<8;i++)tone.push(['#56514a','#5e5850','#4e4a44','#625c52','#4a4640'][Math.floor(r()*5)]);
  for(let y=0;y<16;y++){const row=y>>2,off=(row%2)*4;for(let x=0;x<16;x++){const id=row*2+(((x+off)>>3)&1),m=y%4===3||(x+off)%8===7;P(x,y,m?'#2e2b27':tone[id],m?nz(r,.9,1.05):nz(r,.86,1.06)*(r()<.06?.8:1));}}};
VXD.cryptDark=(P,r)=>{for(let y=0;y<16;y++){const row=y>>2,off=(row%2)*4;for(let x=0;x<16;x++){const m=y%4===3||(x+off)%8===7;P(x,y,m?'#1e1c1a':'#3e3a36',nz(r,.86,1.06));}}};
VXD.cryptFloor=(P,r)=>{const tone=[];for(let i=0;i<8;i++)tone.push(nz(r,.8,1.08));for(let y=0;y<16;y++){const row=y>>3,off=(row%2)*4;for(let x=0;x<16;x++){const id=row*2+(((x+off)>>3)&1),j=y%8===7||(x+off)%8===7;P(x,y,j?'#24221f':'#4a4640',j?1:tone[id]*nz(r,.9,1.06));}}};
FOLDERS['undead/crypt']={name:'Crypt',blurb:'Modular crypt walls, niches, ossuary, doorway, pillar, vault, floor and stairs; sarcophagi, coffins, altar, candles, braziers, ritual circle',children:[]};
const udTileMats1=tileMats;tileMats=function(){const m=udTileMats1();Object.assign(m,{cryptFloor:{top:vm('cryptFloor'),side:vm('cryptDark')},cryptDust:{top:vm('gSoil'),side:vm('cryptDark'),h:T-.02}});return m;};
const CW_T=1.2,CW_ROWS=12;
/* back half (z -0.6…0) solid, front half (z 0…0.6) with the openings; hole(i,row,front) */
function cwBody(root,hole,rows=CW_ROWS){const mat=vm('crypt'),pm=vm('cryptDark');ruGrid(root,10,rows,(i,row)=>!hole(i,row,false),{t:.6,z:-.3,mat,pmat:pm});ruGrid(root,10,rows,(i,row)=>!hole(i,row,true),{t:.6,z:.3,mat,pmat:pm,noPlinth:true});
  bx(root,4,.2,1.4,pm,0,.1,0);}
function cwSconce(root,L,x,y,green){const g=new THREE.Group();put(root,g,x,y,.6);bx(g,.12,.3,.06,vm('ironB'),0,0,.03);bx(g,.06,.06,.3,vm('ironB'),0,-.08,.18);bx(g,.16,.08,.16,vm('ironB'),0,-.02,.33);
  if(green)udFlame(g,L,0,.02,.33,.14,.9);else{bx(g,.08,.24,.08,vm('planksDark'),0,.1,.33);vFlame(g,0,.22,.33,.12,L,.8);}return g;}
function cwSkullTile(par,x,y,z,r){const b=vm('bone');bx(par,.22,.2,.08,b,x,y,z);bx(par,.06,.05,.02,vm('dark'),x-.05,y+.02,z+.045);bx(par,.06,.05,.02,vm('dark'),x+.05,y+.02,z+.045);bx(par,.12,.05,.04,b,x,y-.11,z-.01);}
function cwWall(s,op){const type=(op&&op.type)||'niches',wear=(op&&op.wear)||'clean',root=udRoot(4),L=root.userData.lights,r=mulberry32((s||1)*1031);
  const NI=[[1,2],[4,5],[7,8]],niche=(i,row)=>type==='niches'&&NI.some(([a,b])=>i>=a&&i<=b)&&((row>=2&&row<=3)||(row>=6&&row<=7));
  cwBody(root,(i,row,front)=>front&&niche(i,row));
  if(type==='niches')for(const[a]of NI)for(const row of[2,6]){const x=-2+(a+1)*.4,y=row*.4;if(r()<.55){wlSkull(root,x+(r()-.5)*.2,y,.25,.9,(r()-.5)*.5);wlBone(root,.5,x,y,.45,0);}else{bx(root,.7,.22,.36,vm('burlap'),x,y+.11,.3);bx(root,.2,.18,.3,vm('burlap'),x-.3,y+.24,.3);}
    if(r()<.3)udWebAt(root,x+.25,y+.55,.52,.3,0);}
  if(type==='ossuary'){for(let row=0;row<6;row++){const y=1.1+row*.55;for(let k=0;k<13;k++)cwSkullTile(root,-1.8+k*.3,y,.64,r);if(row<5)for(let k=0;k<6;k++)bx(root,.6,.06,.06,vm('bone'),-1.5+k*.6,y+.28,.63);}bx(root,4,.12,.12,vm('cryptDark'),0,.92,.66);}
  if(type==='sconce'){cwSconce(root,L,-1,2.4,(op&&op.flame)==='green');cwSconce(root,L,1,2.4,(op&&op.flame)==='green');}
  const caps=[];for(let i=0;i<10;i++)caps.push([-1.8+i*.4,CW_ROWS*.4,.4,CW_T,0]);
  if(wear!=='clean')ruApplyWear(root,wear==='cracked'?'cracked':'mossy',10,(i,row)=>row<CW_ROWS&&!niche(i,row),()=>CW_ROWS,caps,r,CW_T,true);
  for(let k=0;k<3;k++){const s2=.14+r()*.2;bx(root,s2,s2*.6,s2,vm('crypt'),(r()-.5)*3.4,s2*.3,.9+r()*.8,0,r()*3,0);}return root;}
function cwDoor(s,op){const root=udRoot(4),gate=(op&&op.gate)||'none';const hole=(i,row)=>(i>=3&&i<=6&&row<=6)||((i===4||i===5)&&row===7);cwBody(root,hole);bx(root,1.6,.02,1.4,vm('cryptFloor'),0,.21,0);
  bx(root,.4,.4,.2,vm('cryptDark'),0,3.4,.7);wlSkull(root,0,3.2,.62,1,0);
  if(gate!=='none'){const g=new THREE.Group();root.add(g);const ib=vm('ironB');for(let i=0;i<6;i++){const x=-.62+i*.248;bx(g,.06,2.9,.06,ib,x,1.45+.2,0);bx(g,.04,.12,.04,ib,x,.14,0);}bx(g,1.5,.1,.1,ib,0,3,0);
    vGateAnim(root,gate==='open'?1:0,e=>{g.position.y=e*1.7;});}return root;}
function cwPillar(s){const root=udRoot(2),dk=vm('cryptDark'),c=vm('crypt');ruBox(root,2,.4,2,dk,0,.2,0,-1,0);ruBox(root,1.6,4.2,1.6,c,0,2.5,0,-.8,.4);ruBox(root,2,.4,2,dk,0,4.8,0,-1,4.6);
  for(const[a,b]of[[1,0],[-1,0],[0,1],[0,-1]])bx(root,a?.12:.5,4,a?.5:.12,dk,a*.86,2.4,b*.86);return root;}
function cwVault(s,op){const root=udRoot(-1),c=vm('crypt'),dk=vm('cryptDark');root.userData.ground=-1;ruBox(root,4,.8,4,c,0,5.2,0,-2,4.8);
  for(const sd of[-1,1]){ruBox(root,.8,.4,4,c,sd*1.6,4.6,0,-2,4.4);ruBox(root,.4,.4,4,c,sd*1.8,4.2,0,-2,4);ruBox(root,.4,.4,4,c,sd*1.0,4.6,0,-2,4.4);}
  for(const z of[-1.9,1.9]){for(const sd of[-1,1]){bx(root,.4,.8,.2,dk,sd*1.8,4.4,z);bx(root,.4,.4,.2,dk,sd*1.2,4.6,z);bx(root,.4,.2,.2,dk,sd*.8,4.7,z);}bx(root,1.2,.2,.2,dk,0,4.7,z);}
  if((op&&op.chandelier)==='bones'){const sw=new THREE.Group();sw.name='chandelier';put(root,sw,0,4.8,0);for(let i=0;i<10;i++)bx(sw,i%2?.03:.06,.12,i%2?.06:.03,vm('iron'),0,-.06-i*.11,0);
    const ring=new THREE.Group();put(sw,ring,0,-1.25,0);bx(ring,.16,.16,.16,vm('bone'),0,.05,0);for(let k=0;k<8;k++){const a=k/8*Math.PI*2;wlBone(ring,.62,Math.cos(a)*.5,-.03,Math.sin(a)*.5,-a+Math.PI/2);if(k%2===0){wlSkull(ring,Math.cos(a)*.58,.03,Math.sin(a)*.58,.6,-a+Math.PI/2);}else udCandle(ring,Math.cos(a)*.52,.04,Math.sin(a)*.52,.14);}
    for(let k=0;k<4;k++){const a=k/4*Math.PI*2+.4;wlBeam(sw,[0,-.9,0],[Math.cos(a)*.5,-1.22,Math.sin(a)*.5],.03,vm('iron'));}
    const pl=new THREE.PointLight(0xffcc5c,0,7,2);pl.position.set(0,3.4,0);pl.userData.lamp=true;pl.userData.min=.5;root.add(pl);root.userData.lights.push(pl);
    propAnim(root,[sw],[{name:'Idle',dur:5,loop:true,fn:(t,S)=>{const a=t/5*Math.PI*2;S.chandelier={r:[Math.sin(a)*.03,a*.1,Math.cos(a)*.03]};}}]);}
  else for(let k=0;k<2;k++){const ch=new THREE.Group();put(root,ch,0,4.8,k?1:-1);for(let i=0;i<4;i++)bx(ch,i%2?.03:.06,.12,i%2?.06:.03,vm('iron'),0,-.06-i*.11,0);}return root;}
function cwFloor(){return vTile((x,z)=>wlNoise(x*1.3,z*1.3,1)>1.8?'cryptDust':'cryptFloor',(root,at)=>{const r=mulberry32(91);wlPebbles(root,10,93,['cryptFloor'],at,['crypt','bone']);for(let i=0;i<3;i++){const x=(r()-.5)*3,z=(r()-.5)*3;wlBone(root,.3+r()*.3,x,at(x,z)==='cryptDust'?T-.02:T,z,r()*3);}});}
function cwStairs(s){const root=udRoot(3),c=vm('crypt'),dk=vm('cryptDark'),n=12,run=4/n;for(let i=0;i<n;i++){const h=(i+1)*.4,z=2-run/2-i*run;ruBox(root,2.4,h,run,c,0,h/2,z,-1.2,0);}
  for(const sd of[-1,1])for(let i=0;i<n;i++){const h=(i+1)*.4+.8,z=2-run/2-i*run;ruBox(root,.4,h,run,dk,sd*1.4,h/2,z,0,0);}return root;}
/* cobweb: a flat sprite between two surfaces */
const webMat=()=>cutTex('web',(P,r)=>{const c='#e8e8ee';for(let k=0;k<6;k++){const a=k/6*Math.PI/2;for(let t=0;t<16;t++){const x=Math.round(Math.cos(a)*t),y=Math.round(Math.sin(a)*t);if(x<16&&y<16)P(x,15-y,c,1);}}
  for(const R of[4,8,12,15])for(let a=0;a<=16;a++){const t=a/16*Math.PI/2,x=Math.round(Math.cos(t)*R),y=Math.round(Math.sin(t)*R);if(x<16&&y<16&&(a%2===0||R<10))P(x,15-y,c,1);}});
function udWebAt(par,x,y,z,s,ry){const g=new THREE.Group();put(par,g,x,y,z,0,ry,0);const p=new THREE.Mesh(new THREE.PlaneGeometry(s,s),webMat());p.position.set(-s/2,-s/2,0);p.rotation.z=Math.PI;p.castShadow=false;g.add(p);return g;}
function cwWebCorner(s){const root=udRoot(1.6),r=mulberry32((s||1)*1033),c=vm('crypt');bx(root,1.2,1.6,.3,c,0,.8,-.6+.15);bx(root,.3,1.6,1.2,c,-.6+.15,.8,0);
  const g=new THREE.Group();put(root,g,-.3,1.6,-.3,0,Math.PI/4,0);const p=new THREE.Mesh(new THREE.PlaneGeometry(1.1,1.1),webMat());p.rotation.z=Math.PI;p.position.set(.0,-.55,0);p.scale.x=1;p.castShadow=false;g.add(p);
  wlSkull(root,.1,0,.1,.9,.5);return root;}
/* ---------- furniture ---------- */
function udSarcophagus(s,op){const lid=(op&&op.lid)||'closed',wear=(op&&op.wear)||'clean',root=udRoot(2.4),r=mulberry32((s||1)*1039),st=vm('tomb'),dk=vm('tombDark');
  bx(root,1.3,.2,2.5,dk,0,.1,0);bx(root,1.1,.8,2.3,st,0,.6,0);for(const sd of[-1,1])for(let i=0;i<4;i++)bx(root,.02,.5,.36,dk,sd*.56,.6,-.75+i*.5);
  const L=new THREE.Group();L.name='sarc_lid';root.add(L);bx(L,1.24,.16,2.44,st,0,.08,0);bx(L,.36,.1,.3,st,0,.2,-.9);bx(L,.5,.14,1.5,st,0,.23,.05);bx(L,.3,.14,.3,st,0,.23,-.65).position.y=.27;bx(L,.18,.08,.14,st,0,.33,-.25);for(const sd of[-1,1])bx(L,.14,.1,.3,st,sd*.1,.18,.95);
  if(lid==='closed')L.position.y=1.0;else if(lid==='ajar'){L.position.set(.25,1.0,.35);L.rotation.y=.22;}else{L.rotation.z=-1.25;L.position.set(.75,.62,0);}
  bx(root,.9,.02,2.1,vm('dark'),0,.99,0);
  const K={closed:[0,1,0,0,0,0],ajar:[.25,1,.35,0,.22,0],edge:[.95,1,.1,0,.05,0],tip:[1.02,.92,.05,0,.03,-.5],off:[.75,.62,0,0,0,-1.25]};
  const path=(names,k)=>{const n=names.length-1,u=Math.min(n-1e-6,Math.max(0,k*n)),i=Math.floor(u),f=paEase(u-i),a=K[names[i]],b=K[names[i+1]],v=a.map((x,j)=>x+(b[j]-x)*f);return{p:v.slice(0,3),r:v.slice(3)};};
  const toOff=lid==='off'?['off','off']:lid==='ajar'?['ajar','edge','tip','off']:['closed','ajar','edge','tip','off'],toClosed=lid==='closed'?['closed','closed']:lid==='ajar'?['ajar','closed']:['off','tip','edge','ajar','closed'];
  propAnim(root,[L],[{name:'Slide aside',dur:2.2,hold:true,fn:(t,S)=>{S.sarc_lid=path(lid==='closed'?['closed','ajar']:[lid,lid],t/2.2);}},{name:'Push off',dur:3,hold:true,fn:(t,S)=>{S.sarc_lid=path(toOff,t/3);}},
    {name:'Close',dur:3,hold:true,fn:(t,S)=>{S.sarc_lid=path(toClosed,t/3);}},{name:'Rattle',dur:1.4,next:'Idle',fn:(t,S)=>{const b=path([lid,lid],0);b.p[1]+=Math.max(0,Math.sin(t*22))*.04*(1-t/1.4);b.r[2]+=Math.sin(t*29)*.015;S.sarc_lid=b;}}]);
  if(wear==='mossy'){bx(root,1.1,.2,.02,vm('moss'),0,.3,1.16);for(let i=0;i<3;i++)wlTuft(root,(r()-.5)*1.6,0,1.4+r()*.3,r,false);}if(wear==='cracked'){let cx=-.2;for(let k=0;k<5;k++){bx(root,.02,.14,.02,vm('dark'),cx,.9-k*.12,1.16);cx+=(r()-.5)*.08;}}return root;}
function udCoffinAsset(s,op){const root=udRoot(1.8),r=mulberry32((s||1)*1049),st=(op&&op.state)||'closed',g=udCoffin(root,st,r),{lid,door,P}=g.userData.coffin;
  if(st==='standing'){propAnim(root,[door],[{name:'Open',dur:1.3,hold:true,fn:(t,S)=>{S[door.name]={r:[0,0,2*paEase(t/1.3)]};}},{name:'Close',dur:1.2,hold:true,fn:(t,S)=>{S[door.name]={r:[0,0,2*(1-paEase(t/1.2))]};}},
    {name:'Burst open',dur:1.6,hold:true,fn:(t,S)=>{const a=t<.4?2.6*paEase(t/.4):2+.6*Math.exp(-(t-.4)*5)*Math.cos((t-.4)*14);S[door.name]={r:[0,0,a]};}},
    {name:'Rattle',dur:1.2,next:'Idle',fn:(t,S)=>{S[door.name]={r:[0,0,Math.max(0,Math.sin(t*26))*.12*(1-t/1.2)]};}}]);return root;}
  const open=k=>{let v;if(k<.3)v=[0,.42+.2*paEase(k/.3),0,0,0,0];else{const u=paEase((k-.3)/.7),a=[0,.62,0,0,0,0];v=a.map((x,i)=>x+(P.open[i]-x)*u);v[1]+=Math.sin(u*Math.PI)*.15;}return{p:v.slice(0,3),r:v.slice(3)};};
  const at=st==='open'?1:0;
  propAnim(root,[lid],[{name:'Open',dur:1.8,hold:true,fn:(t,S)=>{S[lid.name]=open(at?1:t/1.8);}},{name:'Close',dur:1.8,hold:true,fn:(t,S)=>{S[lid.name]=open(at?1-t/1.8:0);}},
    {name:'Burst open',dur:1.6,hold:true,fn:(t,S)=>{if(at){S[lid.name]=open(1);return;}const f=paFly(t,{t0:.15,p0:[0,.42,0],v:[1.4,3.4,.18],rest:0,q0:new THREE.Quaternion(),q1:paQ(0,.15,0)});
      if(!f){S[lid.name]={p:[0,.42+Math.sin(t*60)*.01,0],r:[0,0,0]};return;}const k=Math.min(1,(t-.15)/1.3);S[lid.name]={p:f.p,r:[k*Math.PI*2,.15*k,0]};}},
    {name:'Rattle',dur:1.2,next:'Idle',fn:(t,S)=>{if(at)return;S[lid.name]={p:[0,.42+Math.max(0,Math.sin(t*24))*.05*(1-t/1.2),0],r:[0,0,Math.sin(t*31)*.03]};}}]);return root;}

function udAltar(s){const root=udRoot(2),r=mulberry32((s||1)*1051),dk=vm('cryptDark'),c=vm('crypt');ruBox(root,2.4,.2,1.2,dk,0,.1,0,-1.2,0);ruBox(root,2,.8,.9,c,0,.6,0,-1,.2);ruBox(root,2.2,.12,1.1,dk,0,1.06,0,-1.1,1);
  bx(root,.8,.02,1.14,vm('dark'),0,1.13,0);bx(root,.8,.6,.02,vm('dark'),0,.82,.56);bx(root,.2,.12,.02,vm('woolPurple'),0,.5,.58);
  wlSkull(root,-.55,1.12,-.15,1,.2);const bk=new THREE.Group();put(root,bk,.1,1.12,.05,0,-.2,0);for(const sd of[-1,1])bx(bk,.22,.04,.3,vm('paper'),sd*.11,.03,0,0,0,-sd*.12);bx(bk,.46,.03,.32,vm('leather'),0,.01,0);
  bx(root,.08,.04,.08,vm('gold'),.6,1.14,-.2);bx(root,.04,.14,.04,vm('gold'),.6,1.23,-.2);bx(root,.12,.1,.12,vm('gold'),.6,1.35,-.2);bx(root,.09,.02,.09,vm('liqRed'),.6,1.405,-.2);
  bx(root,.32,.02,.05,vm('iron'),.45,1.13,.25,0,.6,0);bx(root,.08,.03,.06,vm('leather'),.32,1.135,.33,0,.6,0);for(const[x,z,h]of[[-.9,-.4,.3],[-.75,-.42,.2],[.85,.3,.26],[.95,-.35,.18],[-.2,-.42,.14]])udCandle(root,x,1.12,z,h);
  for(let i=0;i<3;i++)udCandle(root,-.7+i*.7,.2,.65,.14+i*.04);return root;}
function udCandles(s){const root=udRoot(1.2),r=mulberry32((s||1)*1061);for(let i=0;i<9;i++){const a=r()*6.28,d=Math.sqrt(r())*.45;udCandle(root,Math.cos(a)*d,0,Math.sin(a)*d,.08+r()*.3,.05+r()*.04);}
  bx(root,.6,.02,.5,vm('wax'),0,.01,0);const pl=new THREE.PointLight(0xffcc5c,0,4,2);pl.position.set(0,.6,0);pl.userData.lamp=true;pl.userData.min=.5;root.add(pl);root.userData.lights.push(pl);return root;}
function udCandelabra(s){const root=udRoot(1.2),ib=vm('ironB');bx(root,.4,.06,.4,ib,0,.03,0);for(const[a,b]of[[1,0],[-1,0],[0,1]])bx(root,.06,.06,.3,ib,a*.12,.06,b*.12,0,Math.atan2(a,b),0);bx(root,.06,1.6,.06,ib,0,.86,0);
  bx(root,.9,.05,.05,ib,0,1.5,0);for(const x of[-.42,-.21,0,.21,.42]){const y=1.53+(x===0?.2:Math.abs(x)<.3?.1:0);if(y>1.6)bx(root,.04,y-1.52,.04,ib,x,(y+1.52)/2,0);bx(root,.1,.03,.1,ib,x,y,0);udCandle(root,x,y+.015,0,.16);}
  const pl=new THREE.PointLight(0xffcc5c,0,5,2);pl.position.set(0,1.9,0);pl.userData.lamp=true;pl.userData.min=.5;root.add(pl);root.userData.lights.push(pl);return root;}
function udBrazier(s){const root=udRoot(1.4),ib=vm('ironB');for(let i=0;i<3;i++){const a=i/3*Math.PI*2;wlBeam(root,[Math.cos(a)*.42,0,Math.sin(a)*.42],[Math.cos(a)*.24,.85,Math.sin(a)*.24],.06,ib);}
  hollow(root,.7,.2,.7,.05,ib,0,.85,0);bx(root,.6,.06,.6,vm('coal'),0,.94,0);udFlame(root,root.userData.lights,0,.97,0,.3,1);return root;}
function udRitual(s){const root=udRoot(-1),L=root.userData.lights,r=mulberry32((s||1)*1063),c=.2;root.userData.ground=-1;
  const disc=bx(root,3.8,.04,3.8,vm('cryptFloor'),0,.02,0);disc.castShadow=false;
  for(let i=-10;i<10;i++)for(let k=-10;k<10;k++){const x=(i+.5)*c,z=(k+.5)*c,d=Math.hypot(x,z);if((d>1.6&&d<1.8)||(d>1.1&&d<1.28)||(d<.15)){const m=bx(root,c,.02,c,RUNEMAT,x,.05,z);m.castShadow=false;}}
  for(let k=0;k<12;k++){const a=k/12*Math.PI*2,R=1.44;const g=new THREE.Group();put(root,g,Math.cos(a)*R,.05,Math.sin(a)*R,0,-a,0);const sh=k%3;bx(g,.06,.02,.2,RUNEMAT,0,0,0);if(sh===0)bx(g,.16,.02,.06,RUNEMAT,.05,0,.07);else if(sh===1)bx(g,.06,.02,.06,RUNEMAT,.08,0,-.07);else bx(g,.12,.02,.06,RUNEMAT,-.03,0,.07);}
  for(let k=0;k<5;k++){const a=k/5*Math.PI*2+.3;udCandle(root,Math.cos(a)*1.95,.04,Math.sin(a)*1.95,.18+r()*.1);}for(let k=0;k<4;k++){const a=k/4*Math.PI*2+.8;wlSkull(root,Math.cos(a)*2.05,.04,Math.sin(a)*2.05,.9,-a-Math.PI/2);}
  const pl=new THREE.PointLight(0xa4ecbc,0,6,2);pl.position.set(0,.8,0);pl.userData.lamp=true;pl.userData.min=.6;root.add(pl);L.push(pl);return root;}
function udOssuary(s){const root=udRoot(1.8),r=mulberry32((s||1)*1069),w=vm('planksDark');for(const sd of[-1,1])bx(root,.1,2,.5,w,sd*1,1,0);for(let t=0;t<4;t++){const y=.1+t*.6;bx(root,2.1,.06,.5,w,0,y,0);
  if(t<3)for(let k=0;k<6;k++){if(t%2===0)wlSkull(root,-.75+k*.3,y+.03,.02,.9,(r()-.5)*.3);else for(let j=0;j<3;j++)wlBone(root,.4,-.7+k*.28,y+.03+j*.06,0,Math.PI/2);}}bx(root,2.1,1.9,.04,w,0,1,-.27);return root;}
function udBonePile(s){const root=udRoot(2),r=mulberry32((s||1)*1087);wlMound(root,0,0,.9,r,vm('gSoil'));for(let i=0;i<18;i++){const a=r()*6.28,d=Math.sqrt(r())*1.2,y=Math.max(0,(.9-d)*1.2);wlBone(root,.3+r()*.4,Math.cos(a)*d,Math.min(y,1.2),Math.sin(a)*d,r()*3);}
  for(let i=0;i<5;i++){const a=r()*6.28,d=r()*1,y=Math.max(0,(.9-d)*1.2);wlSkull(root,Math.cos(a)*d,Math.min(y,1.2),Math.sin(a)*d,1,r()*6);}return root;}
UD('crypt-wall','crypt','Crypt wall',cwWall,'Crypt wall 4.8 m high and 1.2 m thick, face towards +z: burial niches (two tiers of three, with skulls, bones or shrouded bodies), an ossuary face of skulls and bones, two sconces (warm or green flame) or plain. 4 m long, centred on the grid line.',{opts:[{key:'type',label:'Type',choices:[['niches','Burial niches'],['ossuary','Ossuary'],['sconce','Sconces'],['plain','Plain']],def:'niches'},{key:'flame',label:'Sconce flame',choices:[['warm','Warm'],['green','Green']],def:'warm'},{key:'wear',label:'Condition',choices:[['clean','Old'],['cracked','Cracked'],['mossy','Damp and mossy']],def:'clean'}],variants:true,defaultSeed:1});
UD('crypt-door','crypt','Crypt doorway',cwDoor,'Crypt wall with a stepped-arch doorway 1.6 × 3.2 m and a skull keystone; optional iron portcullis of bars that slides up.',{opts:[{key:'gate',label:'Portcullis',choices:[['none','None'],['closed','Closed'],['open','Open']],def:'none',live:false}]});
UD('crypt-pillar','crypt','Crypt pillar',cwPillar,'Square pillar for a grid vertex, 1.6 m with a plinth, cap and a rib on each face; hides the crypt wall ends.',{});
UD('crypt-vault','crypt','Crypt vault',cwVault,'Stepped barrel vault over one 4 × 4 m cell, springing from 4 m, top slab to 5.6 m, a rib at each end; two short chains, or a bone chandelier with skulls and candles that sways slowly (Idle loop). The origin is on the floor.',{opts:[{key:'chandelier',label:'Hanging',choices:[['none','Two chains'],['bones','Bone chandelier']],def:'none'}],groundR:-1});
UD('crypt-floor','crypt','Crypt floor',cwFloor,'Dark flagstone floor tile with dust, grit and a few bones, top at 0.8 m.',{groundR:-1});
UD('crypt-stairs','crypt','Crypt stairs',cwStairs,'Stone stair, 2.4 m wide between low side walls, climbing 4.8 m in 12 steps across one 4 × 4 m cell towards -z.',{});
UD('crypt-web','crypt','Cobwebbed corner',cwWebCorner,'Corner of two low crypt walls with a big cobweb across it and a skull below. The web sprite (udWebAt) can be put in any corner.',{variants:true,defaultSeed:1});
UD('sarcophagus','crypt','Sarcophagus',udSarcophagus,'Stone sarcophagus with panelled sides and an effigy carved on the lid; the lid closed, slid aside, or pushed off and leaning against it. Clips: Slide aside, Push off (slides, tips over the edge and leans against the side), Close, Rattle.',{opts:[{key:'lid',label:'Lid',choices:[['closed','Closed'],['ajar','Ajar'],['off','Pushed off']],def:'closed'},UD_WEAR],variants:true,defaultSeed:1});
UD('coffin','crypt','Coffin',udCoffinAsset,'Tapered wooden coffin, hollow, lined with velvet, a skeleton inside: closed with iron straps, open (lid lying beside it) or standing upright (the lid hinged on its long edge). Clips: Open, Close, Burst open (the lid is flung off), Rattle.',{opts:[{key:'state',label:'State',choices:[['closed','Closed'],['open','Open'],['standing','Standing']],def:'closed'}],variants:true,defaultSeed:1});
UD('altar','crypt','Dark altar',udAltar,'Necromancer\'s altar: stone block under a black cloth, a skull, an open book, a gold chalice of blood, a ritual dagger and candles.',{});
UD('candles','crypt','Candle cluster',udCandles,'Cluster of melted candles of different heights on a puddle of wax, with a small warm light.',{variants:true,defaultSeed:1});
UD('candelabra','crypt','Candelabra',udCandelabra,'Tall iron candelabra on three feet, five candles, warm light.',{});
UD('brazier','crypt','Green brazier',udBrazier,'Iron fire bowl on three legs burning with green necromantic fire, always lit.',{});
UD('ritual','crypt','Ritual circle',udRitual,'4 × 4 m ritual circle on the floor: two glowing rings with runes between them, five candles, four skulls and a green glow.',{groundR:-1,variants:true,defaultSeed:1});
UD('ossuary','crypt','Ossuary shelf',udOssuary,'Wooden shelf of three tiers stacked with skulls and bundles of long bones.',{variants:true,defaultSeed:1});
UD('bonepile','crypt','Bone heap',udBonePile,'Heap of earth piled with bones and skulls.',{variants:true,defaultSeed:1});
