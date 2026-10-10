/* ======================= pig pen, clay pit, donkey shelter, builder's hut ======================= */
VXD.mud=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,r()<.12?'#3e2c1c':r()<.2?'#6a5a40':'#5a4028',nz(r,.85,1.08));};
VXD.clayBrick=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,y%4===3||x%8===7?'#8a5236':'#b4704e',nz(r,.88,1.06));};
function penFence(root,W,D,gap){const seg=(a,b,c,d)=>{const len=Math.hypot(b-a,d-c),n=Math.max(1,Math.ceil(len/3.2));for(let i=0;i<n;i++){const t=(i+.5)/n;vFence(root,len/n,a+(b-a)*t,c+(d-c)*t,Math.abs(b-a)>.01?0:Math.PI/2);}};
  seg(-W/2,-gap/2,D/2,D/2);seg(gap/2,W/2,D/2,D/2);seg(-W/2,W/2,-D/2,-D/2);seg(-W/2,-W/2,-D/2,D/2);seg(W/2,W/2,-D/2,D/2);}

/* ---------- Pig pen ---------- */
function vxPigPen(){const root=new THREE.Group(),L=[];root.userData.lights=L;const W=7,D=6;
  vYard(root,W+3,D+3,0,0);bx(root,W-.2,.04,D-.2,vm('mud'),0,.02,0);for(let i=0;i<4;i++)bx(root,.8+i*.2,.03,.6+i*.1,vm('water'),-1.6+i*.6,.04,1.2-i*.5).material=vm('mud');
  const pd=new THREE.Group();put(root,pd,1.6,0,1.4);bx(pd,1.4,.03,1,vm('deepWater'),0,.05,0);
  penFence(root,W,D,1.4);const gt=new THREE.Group();put(root,gt,-.7,0,D/2,0,-.9,0);for(const y of[.35,.7,1])bx(gt,1.4,.08,.06,vm('planks'),.7,y,0);bx(gt,1.5,.08,.06,vm('planksDark'),.7,.68,.02,0,0,.5);
  const sh=new THREE.Group();put(root,sh,-W/2+1.6,0,-D/2+1.2);bx(sh,2.8,1.2,.12,vm('planksV'),0,.6,-.9);for(const s of[-1,1])bx(sh,.12,1.2,1.8,vm('planksV'),s*1.4,.6,0);for(const s of[-1,1])vlog(sh,.18,1.5,.18,'y',s*1.35,.75,.85);for(let i=0;i<3;i++)bx(sh,3.2,.16,2.2-i*.5,vm('shingle'),0,1.55+i*.16,-.1-i*.22);bx(sh,2.6,.2,1.6,vm('hay'),0,.1,-.1);
  const tr=new THREE.Group();put(root,tr,W/2-1.2,0,-D/2+.8);hollow(tr,1.6,.4,.5,.07,vm('planksDark'));bx(tr,1.46,.22,.36,vm('dark'),0,.18,0);bx(tr,1.46,.03,.36,vm('stew'),0,.3,0);
  const wt=new THREE.Group();put(root,wt,W/2-.6,0,.4,0,Math.PI/2,0);hollow(wt,1.2,.36,.44,.06,vm('stone'));bx(wt,1.08,.2,.32,vm('dark'),0,.16,0);bx(wt,1.08,.03,.32,vm('water'),0,.27,0);
  const pigs=[['pink','Graze',.5,W/2-1.2,-D/2+1.5,Math.PI],['spotted','Idle',1.2,.4,-.4,.8],['pink','Lie down',2,-1.6,1.4,2.2],['black','Root around',.6,1.4,1.8,-1.4],['pink','Lie down',1,-W/2+1.4,-D/2+1.4,.2]];
  vSack(root,-W/2-.6,D/2-.4);vBarrel(root,-W/2-.6,D/2-1.1,true);root.userData.ground=6.4;return root;}

/* ---------- Clay pit ---------- */
function vxClayPit(){const root=new THREE.Group(),L=[];root.userData.lights=L;const W=7,D=6;
  vYard(root,W+4,D+4,0,-.3);bx(root,W,.04,D,vm('clay'),0,.02,0);
  const bank=(w,d,x,z,h)=>{const sd=vm('claySide'),b=box(w,h,d,[sd,sd,vm('grassTop'),sd,sd,sd],{s:.8,ox:0,oy:0,oz:0});put(root,b,x,h/2,z);};
  bank(W+2,1,0,-D/2-.5,.9);bank(1,D,-W/2-.5,0,.8);bank(1,D,W/2+.5,0,.7);bank(2.4,1,-W/2+1.2,D/2+.5,.6);bank(2.4,1,W/2-1.2,D/2+.5,.6);
  for(let i=0;i<3;i++)bx(root,1.2,.15+i*.15,.6,vm('clay'),0,(.15+i*.15)/2,D/2+.3-i*.0);
  for(let i=0;i<5;i++)bx(root,.4+i%2*.3,.12,.3+i%3*.2,vm('water'),-2+i*.9,.05,-1.4+(i%2)*.4).scale.y=.4;
  for(const[x,z]of[[-1.8,1],[-1,1.1],[-1.4,.4],[-2.2,.3]])bx(root,.5,.4,.5,vm('clay'),x,.2,z);
  const ds=new THREE.Group();put(root,ds,1.6,0,.6);for(const s of[-1,1])vlog(ds,.14,1.6,.14,'y',s*1.2,.8,0);for(let k=0;k<3;k++){bx(ds,2.5,.05,.5,vm('planks'),0,.35+k*.45,0);for(let i=0;i<8;i++)bx(ds,.22,.1,.12,vm(k===2?'clay':'clayBrick'),-1+i*.28,.43+k*.45,(i%2-.5)*.18);}
  bx(ds,2.8,.12,.9,vm('shingle'),0,1.68,0);
  const bs=new THREE.Group();put(root,bs,2.4,0,-1.7);for(let r=0;r<4;r++)for(let c=0;c<4;c++)bx(bs,.42,.14,.22,vm('clayBrick'),(c-1.5)*.44,.07+r*.14,(r%2)*.05);
  const wb=iWheelbarrow();wb.children.forEach(c=>{if(c.material===vm('hay'))c.material=vm('clay');});put(root,wb,-.4,0,-1.6,0,.6,0);
  for(const[x,z,a]of[[-2.8,-1.8,.2],[-2.5,-2,-.3]]){const sv=TOOLS.Shovel.build();put(root,sv,x,.3,z,a,0,.15);}
  for(let i=0;i<3;i++){const b=TOOLS.Bucket.build();put(root,b,.4+i*.4,.48,1.6);}
  root.userData.ground=7;return root;}

/* ---------- Donkey shelter ---------- */
function vxDonkeyShelter(){const root=new THREE.Group(),L=[];root.userData.lights=L;const W=4.8,D=3.2,h=2.2;
  vYard(root,10,9,0,1.4);bx(root,W,.12,D,vm('dirt'),0,.06,0);bx(root,W-.4,.06,D-.4,vm('hay'),0,.13,-.2);
  bx(root,W,h,.14,vm('planksV'),0,h/2,-D/2+.07);for(const s of[-1,1])bx(root,.14,h,D,vm('planksV'),s*(W/2-.07),h/2,0);for(const s of[-1,1])vlog(root,.22,h+.2,.22,'y',s*(W/2-.1),(h+.2)/2,D/2-.1);bx(root,W+.2,.2,.2,vm('timber'),0,h+.1,D/2-.1);
  for(let i=0;i<4;i++)bx(root,W+.6,.18,D+.6-i*.6,vm('shingle'),0,h+.2+i*.18,.2-i*.3+(i?0:0));
  const hr=new THREE.Group();put(root,hr,-1,0,-D/2+.35);for(const s of[-1,1])bx(hr,.08,1.1,.08,vm('planksDark'),s*.7,.95,0);bx(hr,1.5,.4,.4,vm('hay'),0,1.3,.05);for(let i=0;i<7;i++)bx(hr,.04,.55,.04,vm('planksDark'),-.6+i*.2,1.25,.24,-.35,0,0);
  const tr=new THREE.Group();put(root,tr,1.4,0,-D/2+.4);hollow(tr,1.2,.4,.44,.06,vm('planksDark'));bx(tr,1.08,.22,.32,vm('dark'),0,.18,0);bx(tr,1.08,.03,.32,vm('water'),0,.3,0);
  penFence(root,8,7.6,1.4);root.children.slice(-0).forEach(()=>{});
  const pk=new THREE.Group();put(root,pk,-W/2-1.2,0,1.6);bx(pk,.6,.5,.4,vm('leather'),0,.25,0);bx(pk,.7,.12,.5,vm('woolRed'),0,.55,0);for(const s of[-1,1])vSack(pk,s*.55,.0,0);
  vHay(root,W/2+.9,0,-.6);vHay(root,W/2+.9,.8,-.6);root.userData.ground=6.4;return root;}

/* ---------- Builder's hut ---------- */
function vxBuildersHut(){const root=new THREE.Group(),L=[];root.userData.lights=L;const Lx=4.4,Dz=3.6,base=.2,hw=2.4;
  vYard(root,12,9,1.2,1.4);bx(root,Lx+.1,base,Dz+.1,vm('cobble'),0,base/2,0);
  const W=vWalls({Lx,Dz,y:base,h:hw,t:.2,mat:vm('planksV'),ops:{front:[{type:'door',x:-.8,w:1,y0:0,y1:2},{x:1.1,w:.8,y0:.9,y1:1.6}],back:[{x:0,w:.6,y0:.9,y1:1.5}],right:[{x:0,w:.6,y0:.9,y1:1.5}],left:[]},frame:vm('timber')});root.add(W.group);
  put(root,vRoof(Dz,Lx,1.8,vm('shingle'),{ov:.6,ovL:.5,step:.36,gable:vm('planksV'),ridge:vm('planksDark')}),0,base+hw,0);vHangSign(W.faces.front,Lx/2-.3,hw-.2,0,ICONS.hammer);vLantern(root,L,.2,base+1.9,Dz/2);
  // scaffold sample, ladders, materials
  const sc=new THREE.Group();put(root,sc,4.2,0,-.6);for(const x of[-1.2,1.2])for(const z of[-.6,.6])vlog(sc,.14,4.2,.14,'y',x,2.1,z);for(const y of[1.6,3.2]){bx(sc,2.6,.08,1.3,vm('planks'),0,y,0);for(const z of[-.6,.6])bx(sc,2.6,.08,.08,vm('planksDark'),0,y+.9,z);}
  bx(sc,2.85,.1,.1,vm('planksDark'),0,.8,.6,0,0,.58);const ld=new THREE.Group();put(sc,ld,-1.6,0,.2,0,0,-.25);for(const s of[-1,1])bx(ld,.06,3.4,.06,vm('planksDark'),0,1.7,s*.22);for(let i=0;i<10;i++)bx(ld,.06,.06,.44,vm('planks'),0,.3+i*.32,0);
  const pk=new THREE.Group();put(root,pk,-.6,0,Dz/2+2.2);for(let i=0;i<7;i++)bx(pk,2.6,.06,.3,vm('planks'),0,.1+i*.12,(i%2-.5)*.32);for(const x of[-1,0,1])bx(pk,.08,.06,.7,vm('planksDark'),x,.04,0);
  const st=new THREE.Group();put(root,st,2.4,0,Dz/2+2.4);for(let r=0;r<2;r++)for(let c=0;c<3-r;c++)bx(st,.6,.4,.5,vm('stoneBrick'),(c-(2-r)/2)*.62,.2+r*.4,0);
  const mt=new THREE.Group();put(root,mt,.9,0,Dz/2+1.1);hollow(mt,.9,.3,.6,.05,vm('planksDark'));bx(mt,.8,.03,.5,vm('flour'),0,.26,0);const tw=new THREE.Group();put(mt,tw,.2,.3,0,0,0,.3);bx(tw,.16,.02,.1,vm('iron'),0,0,0);bx(tw,.03,.12,.03,vm('planks'),0,.06,0);
  const wb=iWheelbarrow();wb.children.forEach(c=>{if(c.material===vm('hay'))c.material=vm('cobble');});put(root,wb,-Lx/2-1.2,0,1.8,0,.9,0);
  {const sv=TOOLS.Shovel.build();put(root,sv,-Lx/2-.32,.37,-.6,0,0,-.18);const pk=TOOLS.Pickaxe.build();put(root,pk,-Lx/2-.7,.05,.4,0,.6,Math.PI/2);}
  bx(root,.5,.12,.5,vm('rope'),Lx/2+.4,.06,Dz/2+.2);bx(root,.4,.12,.4,vm('rope'),Lx/2+.4,.18,Dz/2+.2);vBarrel(root,-Lx/2-.4,Dz/2,true);root.userData.ground=8;return root;}

ASSETS.push({id:'vx-pigpen',folder:'buildings/medieval/farming',name:'Pig pen',build:vxPigPen,desc:'Fenced muddy pen with a wallow, a plank shelter bedded with straw, a swill trough and a stone water trough.',groundR:6.4},
  {id:'vx-donkeyshelter',folder:'buildings/medieval/farming',name:'Donkey shelter',build:vxDonkeyShelter,desc:'Three-sided plank shelter with a straw floor, hay rack and water trough inside a small paddock, with a pack saddle and sacks.',groundR:6.4},
  {id:'vx-claypit',folder:'buildings/medieval/resource',name:'Clay pit',build:vxClayPit,desc:'Clay dug out below grassy banks, with puddles, cut clay blocks, a shingled drying rack of bricks, stacked fired bricks, a loaded wheelbarrow, shovels and buckets.',groundR:7},
  {id:'vx-builder',folder:'buildings/medieval/production',name:"Builder's hut",build:vxBuildersHut,desc:"Plank hut with a hammer sign beside a two-level scaffold with ladder; stacked planks and stone, a mortar tub with trowel, a wheelbarrow, tools and rope.",groundR:8});

/* ---------- Cow pen ---------- */
function vxCowPen(){const root=new THREE.Group(),L=[];root.userData.lights=L;const W=12,D=9;
  vYard(root,W+3,D+3,0,0);bx(root,W-.4,.03,D-.4,vm('grassDirt'),0,.015,0);penFence(root,W,D,1.6);
  const gt=new THREE.Group();put(root,gt,-.8,0,D/2,0,-1,0);for(const y of[.35,.7,1])bx(gt,1.6,.08,.06,vm('planks'),.8,y,0);bx(gt,1.7,.08,.06,vm('planksDark'),.8,.68,.02,0,0,.45);
  const sh=new THREE.Group();put(root,sh,-W/2+2.6,0,-D/2+1.8);const sw=4.6,sd=3;bx(sh,sw,2.2,.14,vm('planksV'),0,1.1,-sd/2);for(const s of[-1,1])bx(sh,.14,2.2,sd,vm('planksV'),s*sw/2,1.1,0);for(const s of[-1,1])vlog(sh,.22,2.4,.22,'y',s*(sw/2-.1),1.2,sd/2-.1);bx(sh,sw+.2,.2,.2,vm('timber'),0,2.3,sd/2-.1);
  for(let i=0;i<4;i++)bx(sh,sw+.6,.18,sd+.6-i*.6,vm('shingle'),0,2.4+i*.18,.2-i*.3);bx(sh,sw-.3,.08,sd-.3,vm('hay'),0,.04,0);
  const hr=new THREE.Group();put(root,hr,1.6,0,-D/2+.8);for(const s of[-1,1])bx(hr,.1,1.2,.1,vm('planksDark'),s*1,.6,0);bx(hr,2.1,.5,.5,vm('hay'),0,1.1,0);for(let i=0;i<10;i++)bx(hr,.04,.6,.04,vm('planksDark'),-.9+i*.2,1.05,.28,-.35,0,0);bx(hr,2.2,.06,.7,vm('shingle'),0,1.45,0);
  const tr=new THREE.Group();put(root,tr,W/2-1,0,0,0,Math.PI/2,0);hollow(tr,2,.5,.6,.08,vm('stone'));bx(tr,1.84,.3,.44,vm('dark'),0,.23,0);bx(tr,1.84,.03,.44,vm('water'),0,.4,0);
  const cows=[['#26242a','patches','Graze',.6,1.4,-2.4,.3,false],['#7a4a2a','none','Idle',1.2,-1.2,.8,2.2,false],['#d8c8a8','face','Lie down',1,2.6,1.6,-1.8,false],['#8a3a22','patches','Walk',.3,-3,2.4,1.2,false],['#26242a','patches','Idle',.5,3.8,-1.2,-.6,true]];
  const st=new THREE.Group();put(root,st,-2.2,0,3);bx(st,.36,.05,.36,vm('planks'),0,.36,0);for(const s of[-1,1])bx(st,.05,.34,.05,vm('planksDark'),s*.12,.17,0);const bk=TOOLS.Bucket.build();put(root,bk,-1.8,.47,3.1);bk.children[1].material=vm('milk');
  vHay(root,-W/2-.8,0,1);vHay(root,-W/2-.8,.8,1);vSack(root,W/2+.6,D/2-.6);root.userData.ground=8.4;return root;}
ASSETS.push({id:'vx-cowpen',folder:'buildings/medieval/farming',name:'Cow pen',build:vxCowPen,desc:'Fenced pen with a three-sided shelter bedded with straw, a covered hay rack, a stone water trough, and a milking stool and pail.',groundR:8.4});
