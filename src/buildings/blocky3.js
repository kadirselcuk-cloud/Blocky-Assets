/* ======================= numbered house types: same walls and roofs as house 1 of each type ======================= */
VXD.brick=(P,r)=>{for(let y=0;y<16;y++){const off=(Math.floor(y/4)%2)*4;for(let x=0;x<16;x++){const m=y%4===3||(x+off)%8===7;P(x,y,m?'#c8bca8':['#a4483a','#9a4034','#b05444'][Math.floor(r()*3)],m?nz(r,.9,1):nz(r,.88,1.06));}}};
function vBench(par,x,z){bx(par,1.2,.1,.4,vm('planks'),x,.45,z);for(const s of[-1,1])bx(par,.1,.4,.4,vm('planks'),x+s*.5,.2,z);}
function vCrossGable(par,x,y,zFront,w,H,mat,roofMat){const len=zFront,g=new THREE.Group();put(par,g,x,y,len/2);put(g,vRoof(w,len,H,roofMat,{ov:.3,ovL:.25,step:H/Math.max(3,Math.round(H/.38)),gable:mat}),0,0,0,0,Math.PI/2,0);
  const wn=vWin(g,{x:0,w:.6,y0:.25,y1:.95},.05,{});wn.position.z=len/2+.06;return g;}

/* ---------- Half-timbered cottage: cobble plinth, plaster + oak frame, thatch gable, cobble gable chimney ---------- */
function cottageType(c){const root=new THREE.Group(),L=[];root.userData.lights=L;const Lx=5.6,Dz=4.4,base=.4,hw=2.4,t=.2,H=2.6;
  vYard(root,8.8,7.2,0,.6);bx(root,Lx+.2,base,Dz+.2,vm('cobble'),0,base/2,0);
  root.add(vWalls({Lx,Dz,y:base,h:hw,t,mat:vm('plaster'),ops:c.ops,frame:vm('timber'),unit:{shutter:vm('planksDark')}}).group);
  put(root,vRoof(Dz,Lx,H,vm('thatch'),{ov:.7,ovL:.6,step:.4,gable:vm('plaster'),ridge:vm('hay')}),0,base+hw,0);
  for(const s of[-1,1])bx(root,.1,.2,Dz,vm('timber'),s*(Lx/2+.04),base+hw+.1,0);
  const cs=c.chim==='R'?1:-1;bx(root,.8,base+hw+H+.8,1.2,vm('cobble'),cs*(Lx/2+.5),(base+hw+H+.8)/2,0);bx(root,1,.2,1.4,vm('stoneBrick'),cs*(Lx/2+.5),base+hw+H+.9,0);
  const dx=c.ops.front.find(o=>o.type==='door').x;bx(root,1.4,.2,.6,vm('cobble'),dx,.1,Dz/2+.4);bx(root,1.2,.2,.4,vm('cobble'),dx,.3,Dz/2+.2);
  vLantern(root,L,c.lamp??dx+.8,base+2.1,Dz/2);c.props(root,{Lx,Dz,base});return root;}
const COTTAGES=[
 {ops:{front:[{type:'door',x:-.6,w:1,y0:0,y1:2},{x:-1.9,w:.6,y0:.8,y1:1.6,flowers:true},{x:1.3,w:1,y0:.8,y1:1.6,flowers:true}],back:[{x:0,w:.8,y0:.8,y1:1.6}],right:[{x:0,w:.8,y0:.8,y1:1.6}],left:[]},chim:'L',lamp:.2,
  props:(r,{Dz})=>{vBarrel(r,2.4,Dz/2+.5,true);vBench(r,1.2,Dz/2+.45);vWoodpile(r,8,4,1,-Dz/2-.45);vBush(r,-2.6,Dz/2+.8);vBush(r,3.3,-1.2,.9);vBush(r,-4,-1.8,.8);},
  desc:'Door left of centre between two flower-box windows, gable chimney on the left, bench and rain barrel by the door.'},
 {ops:{front:[{type:'door',x:0,w:1,y0:0,y1:2},{x:-1.7,w:.8,y0:.8,y1:1.6,flowers:true},{x:1.7,w:.8,y0:.8,y1:1.6,flowers:true}],back:[{x:-1,w:.8,y0:.8,y1:1.6},{x:1.2,w:.8,y0:.8,y1:1.6}],right:[],left:[{x:0,w:.8,y0:.8,y1:1.6}]},chim:'R',lamp:.8,
  props:(r,{Dz})=>{vBench(r,-1.7,Dz/2+.5);vBarrel(r,2.3,Dz/2+.6,true);vWoodpile(r,8,4,-.6,-Dz/2-.45);vBush(r,-3.3,1);vBush(r,3.6,-1.6,.9);},
  desc:'Symmetrical front with a centre door and flower boxes either side, gable chimney on the right.'},
 {ops:{front:[{type:'door',x:1.5,w:1,y0:0,y1:2},{x:-1.9,w:.6,y0:.8,y1:1.6,flowers:true},{x:-.4,w:1,y0:.8,y1:1.6,flowers:true}],back:[{type:'door',x:-1.2,w:.9,y0:0,y1:1.9},{x:1,w:.8,y0:.8,y1:1.6}],right:[],left:[]},chim:'L',lamp:.8,
  props:(r,{Lx,Dz})=>{vWoodpile(r,10,5,Lx/2+.45,0,Math.PI/2);vBarrel(r,-2.4,Dz/2+.6,true);vBush(r,2.6,Dz/2+1);vBush(r,-1.2,-Dz/2-1,.9);},
  desc:'Door on the right with two windows to its left, back door, gable chimney on the left and firewood stacked along the right gable.'},
 {ops:{front:[{type:'door',x:-1.5,w:1,y0:0,y1:2},{x:.2,w:1,y0:.8,y1:1.6,flowers:true},{x:1.8,w:.6,y0:.8,y1:1.6}],back:[{x:0,w:.8,y0:.8,y1:1.6}],right:[],left:[{x:.8,w:.8,y0:.8,y1:1.6}]},chim:'R',lamp:-.7,
  props:(r,{Dz})=>{vBench(r,1,Dz/2+.5);vBarrel(r,-2.5,Dz/2+.6,true);vWoodpile(r,8,4,.4,-Dz/2-.45);vBush(r,3.4,1.4);vBush(r,-3.6,-1.4,1);},
  desc:'Door on the left, a wide flower-box window and a small window to its right, gable chimney on the right.'},
 {ops:{front:[{type:'door',x:.9,w:1,y0:0,y1:2},{x:-1.2,w:1.2,y0:.8,y1:1.6,flowers:true},{x:2.1,w:.5,y0:.9,y1:1.5}],back:[{x:-1.5,w:.8,y0:.8,y1:1.6},{x:1,w:.8,y0:.8,y1:1.6}],right:[{x:.6,w:.8,y0:.8,y1:1.6}],left:[]},chim:'L',lamp:1.7,
  props:(r,{Dz})=>{vCart(r,3.9,Dz/2+1.6,-.5,'hay');vBarrel(r,-2.5,Dz/2+.6);vBarrel(r,-2.5,Dz/2+1.3);vBush(r,-3.6,-1.6);},
  desc:'Wide flower-box window left of the door, small window by the corner, gable chimney on the left and a hay cart in the yard.'},
];

/* ---------- Brick house: stone-brick plinth, brick + oak frame, tile gable, inner chimney, optional gabled bays ---------- */
function brickType(c){const root=new THREE.Group(),L=[];root.userData.lights=L;const Lx=5.6,Dz=4.4,base=.4,hw=2.4,H=2.6;
  vYard(root,8.8,7.2,0,.6);bx(root,Lx+.2,base,Dz+.2,vm('stoneBrick'),0,base/2,0);
  root.add(vWalls({Lx,Dz,y:base,h:hw,t:.2,mat:vm('brick'),ops:c.ops,frame:vm('timber')}).group);
  put(root,vRoof(Dz,Lx,H,vm('tiles'),{ov:.6,ovL:.5,step:.37,gable:vm('brick'),ridge:vm('timber')}),0,base+hw,0);
  for(const b of c.bays||[]){const bw=b.w||2.2,bz=Dz/2+.4;bx(root,bw,hw,.8,vm('brick'),b.x,base+hw/2,bz);for(const s of[-1,1])bx(root,.2,hw,.2,vm('timber'),b.x+s*(bw/2-.05),base+hw/2,Dz/2+.75);
    bx(root,bw+.1,.2,.84,vm('timber'),b.x,base+hw-.1,bz);bx(root,bw+.2,base,1,vm('stoneBrick'),b.x,base/2,bz);const w=vWin(root,{x:b.x,w:Math.min(1,bw-.6),y0:base+.8,y1:base+1.7},.05,{flowers:true});w.position.z=Dz/2+.83;
    vCrossGable(root,b.x,base+hw,Dz/2+.8,bw+.2,2.1,vm('brick'),vm('tiles'));}
  bx(root,.8,H+1,.8,vm('stoneBrick'),c.chim[0],base+hw+(H+1)/2,c.chim[1]);bx(root,1,.16,1,vm('cobble'),c.chim[0],base+hw+H+1.08,c.chim[1]);
  const dx=c.ops.front.find(o=>o.type==='door').x;bx(root,1.4,.2,.5,vm('stoneBrick'),dx,.1,Dz/2+.35);vLantern(root,L,c.lamp??dx-.8,base+2,Dz/2);
  c.props(root,{Lx,Dz,base});return root;}
const BRICKS=[
 {ops:{front:[{type:'door',x:.5,w:1,y0:0,y1:2},{x:2,w:.5,y0:1,y1:1.6}],back:[{x:0,w:1,y0:.9,y1:1.7}],right:[{x:0,w:.8,y0:.9,y1:1.7}],left:[{x:.6,w:.6,y0:.9,y1:1.6}]},bays:[{x:-1.4}],chim:[1.8,-1.1],lamp:-.3,
  props:(r,{Dz})=>{vBench(r,1.6,Dz/2+.6);vBush(r,-3.4,1.2);vBush(r,-3,-2.2,.9);vWoodpile(r,6,3,.6,-Dz/2-.45);},
  desc:'Gabled bay with a flower box on the left, door and small window to the right, chimney at the back.'},
 {ops:{front:[{type:'door',x:0,w:1,y0:0,y1:2},{x:-1.7,w:.8,y0:.9,y1:1.7,flowers:true},{x:1.7,w:.8,y0:.9,y1:1.7,flowers:true}],back:[{x:-1.2,w:.8,y0:.9,y1:1.7},{x:1.2,w:.8,y0:.9,y1:1.7}],right:[{x:0,w:.8,y0:.9,y1:1.7}],left:[{x:0,w:.8,y0:.9,y1:1.7}]},chim:[-1.8,-1.1],lamp:.8,
  props:(r,{Dz})=>{vBench(r,-1.7,Dz/2+.6);vBarrel(r,2.5,Dz/2+.6,true);vBush(r,3.4,-1.6);vWoodpile(r,6,3,.8,-Dz/2-.45);},
  desc:'No bay: centre door between two flower-box windows, chimney at the back left.'},
 {ops:{front:[{type:'door',x:-.6,w:1,y0:0,y1:2},{x:-2,w:.6,y0:.9,y1:1.6}],back:[{x:.4,w:.8,y0:.9,y1:1.7}],right:[{x:-.6,w:.8,y0:.9,y1:1.7}],left:[{x:0,w:.8,y0:.9,y1:1.7}]},bays:[{x:1.4}],chim:[-1.6,-1.1],lamp:-1.4,
  props:(r,{Dz})=>{vBarrel(r,-2.6,Dz/2+.6,true);vWoodpile(r,6,3,-1,-Dz/2-.45);vBush(r,3.5,1.2,.9);},
  desc:'Gabled bay on the right, door and small window to the left, chimney at the back left.'},
 {ops:{front:[{type:'door',x:0,w:1,y0:0,y1:2}],back:[{x:-1.2,w:.8,y0:.9,y1:1.7},{x:1.2,w:.8,y0:.9,y1:1.7}],right:[{x:0,w:.8,y0:.9,y1:1.7}],left:[{x:0,w:.8,y0:.9,y1:1.7}]},bays:[{x:-1.75,w:1.8},{x:1.75,w:1.8}],chim:[0,-1.2],lamp:.75,
  props:(r,{Dz})=>{vBush(r,-3.5,1.4,.9);vBush(r,3.5,1.4,.9);vBench(r,0,-Dz/2-.6);},
  desc:'Two gabled bays framing a centre door, chimney on the ridge line at the back.'},
 {ops:{front:[{type:'door',x:1.6,w:1,y0:0,y1:2},{x:-1.8,w:.8,y0:.9,y1:1.7,flowers:true},{x:-.2,w:.8,y0:.9,y1:1.7,flowers:true}],back:[{x:0,w:1,y0:.9,y1:1.7}],right:[{type:'door',x:-.8,w:.9,y0:0,y1:1.9}],left:[{x:0,w:.8,y0:.9,y1:1.7}]},chim:[1.8,-1.1],lamp:.8,
  props:(r,{Lx,Dz})=>{vWoodpile(r,6,4,Lx/2+.45,.9,Math.PI/2);vCart(r,-3.9,Dz/2+1.4,.5,'sacks');vBush(r,3.4,-1.8);},
  desc:'No bay: door on the right, two flower-box windows to the left, side door and woodpile on the right gable.'},
];

/* ---------- Stone croft: cobble walls, stone-brick quoins, slate gable with cobble gables, stone-brick gable chimneys ---------- */
function croftType(c){const root=new THREE.Group(),L=[];root.userData.lights=L;const Lx=4.8,Dz=4,hw=2.4,t=.4,H=2,sb=vm('stoneBrick');
  vYard(root,8,6.4,0,.8);const ops={};for(const k in c.ops)ops[k]=c.ops[k].map(o=>Object.assign({lintel:sb,sill:sb},o));
  root.add(vWalls({Lx,Dz,y:0,h:hw,t,mat:vm('cobble'),ops}).group);
  for(let i=0,y=0;y<hw-.05;i++,y+=.4)for(const[sx,sz]of[[1,1],[1,-1],[-1,1],[-1,-1]]){const lx=i%2?.6:.4,lz=i%2?.4:.6;bx(root,lx,.4,lz,sb,sx*(Lx/2-lx/2+.02),y+.2,sz*(Dz/2-lz/2+.02));}
  put(root,vRoof(Dz,Lx,H,vm('slate'),{ov:.6,ovL:.5,step:.35,gable:vm('cobble'),gt:.4,ridge:sb}),0,hw,0);
  for(const sd of c.chims){const s=sd==='R'?1:-1;bx(root,.8,hw+H+.8,1,sb,s*(Lx/2-.4),(hw+H+.8)/2,0);bx(root,1,.16,1.2,vm('cobble'),s*(Lx/2-.4),hw+H+.88,0);}
  if(c.lean){const sh=new THREE.Group();put(root,sh,c.lean==='R'?Lx/2:-Lx/2,0,c.lean==='R'?-.3:.3,0,c.lean==='R'?0:Math.PI,0);for(const z of[-1.4,1])vlog(sh,.2,1.8,.2,'y',1.4,.9,z);for(let i=0;i<3;i++)bx(sh,1.8-i*.5,.2,3,vm('planksDark'),.9-i*.25,1.9+i*.2,-.2);vWoodpile(sh,6,5,.7,-.2,Math.PI/2);}
  const dx=ops.front.find(o=>o.type==='door').x;bx(root,1.4,.16,.6,sb,dx,.08,Dz/2+.3);vLantern(root,L,c.lamp??dx+.9,2,Dz/2);c.props(root,{Lx,Dz});return root;}
const CROFTS=[
 {ops:{front:[{type:'door',x:0,w:1,y0:0,y1:2},{x:-1.4,w:.6,y0:.8,y1:1.6,shutter:vm('planksV')},{x:1.4,w:.6,y0:.8,y1:1.6,shutter:vm('planksV')}],back:[{x:.8,w:.6,y0:.8,y1:1.6}],right:[{x:-.6,w:.6,y0:1,y1:1.6,lintel:null}],left:[]},chims:['L','R'],lean:'R',
  props:(r,{Lx,Dz})=>{vBarrel(r,-Lx/2+.1,Dz/2+.5,true);vSack(r,-2.2,Dz/2+.5);vBush(r,2.1,Dz/2+.7);vBush(r,-3.2,-1.4,1.1);vFence(r,3.2,-1.8,Dz/2+2.2);},
  desc:'Centre door between two shuttered windows, chimneys on both gables, log lean-to on the right.'},
 {ops:{front:[{type:'door',x:-.9,w:1,y0:0,y1:2},{x:.9,w:.7,y0:.8,y1:1.6,shutter:vm('planksV')}],back:[{x:-.8,w:.6,y0:.8,y1:1.6}],right:[],left:[{x:-.9,w:.6,y0:1,y1:1.6}]},chims:['R'],lean:'L',lamp:.0,
  props:(r,{Lx,Dz})=>{vBarrel(r,Lx/2+.4,Dz/2+.4,true);vBush(r,2.4,Dz/2+1.2);vFence(r,3,1.6,Dz/2+2.2);},
  desc:'Door on the left, one shuttered window, chimney on the right gable and the lean-to moved to the left.'},
 {ops:{front:[{type:'door',x:.9,w:1,y0:0,y1:2},{x:-.9,w:.7,y0:.8,y1:1.6,shutter:vm('planksV')}],back:[{x:.6,w:.6,y0:.8,y1:1.6},{x:-1,w:.6,y0:.8,y1:1.6}],right:[{x:.9,w:.6,y0:1,y1:1.6}],left:[]},chims:['L'],lean:null,lamp:0,
  props:(r,{Lx,Dz})=>{vWoodpile(r,8,4,0,-Dz/2-.5);vSack(r,-2,Dz/2+.5);vSack(r,-2.4,Dz/2+.8);vBench(r,-1,Dz/2+.6);vBush(r,3.3,-1.2);},
  desc:'Door on the right, window and bench on the left, single chimney on the left gable, no lean-to.'},
 {ops:{front:[{type:'door',x:-1.3,w:1,y0:0,y1:2},{x:.3,w:.6,y0:.8,y1:1.6,shutter:vm('planksV')},{x:1.4,w:.5,y0:.9,y1:1.5}],back:[{x:0,w:.6,y0:.8,y1:1.6}],right:[{x:-.9,w:.6,y0:1,y1:1.6}],left:[{x:.9,w:.6,y0:1,y1:1.6}]},chims:['L','R'],lean:null,lamp:-.4,
  props:(r,{Lx,Dz})=>{vBarrel(r,-Lx/2-.3,Dz/2-.2,true);vFence(r,4,0,Dz/2+2.3);vBush(r,2.2,Dz/2+1.1);vWoodpile(r,6,4,Lx/2+.45,0,Math.PI/2);},
  desc:'Door on the left with two windows to its right, chimneys on both gables, firewood along the right gable.'},
 {ops:{front:[{type:'door',x:1.2,w:1,y0:0,y1:2},{x:-1.4,w:.6,y0:.8,y1:1.6,shutter:vm('planksV')},{x:-.2,w:.6,y0:.8,y1:1.6,shutter:vm('planksV')}],back:[{x:.8,w:.6,y0:.8,y1:1.6}],right:[],left:[{x:-.6,w:.6,y0:1,y1:1.6}]},chims:['R'],lean:'L',lamp:.3,
  props:(r,{Lx,Dz})=>{vSack(r,2.3,Dz/2+.5);vBarrel(r,Lx/2+.4,-.6,true);vBush(r,-3.6,Dz/2+1);},
  desc:'Door on the right, two shuttered windows to the left, chimney on the right gable, lean-to on the left.'},
];

/* ---------- Merchant's townhouse: cobble ground floor, jetty, ochre plaster + oak upper, tile front gable ---------- */
function townType(c){const root=new THREE.Group(),L=[];root.userData.lights=L;const Lx=5,Dz=5.6,h1=2.8,t=.3,band=.3,Lx2=5.6,Dz2=6,h2=2.4,H=3.2,sb=vm('stoneBrick');
  vYard(root,8,8.4,0,1);
  const W1=vWalls({Lx,Dz,y:0,h:h1,t,mat:vm('cobble'),ops:c.ops1,unit:{lintel:sb,sill:sb}});root.add(W1.group);const F=W1.faces.front;
  if(c.shop){const s=c.shop;bx(F,s.w,1.4,.04,vm('dark'),s.x,1.5,-t+.03);bx(F,s.w+.2,.2,.12,vm('timber'),s.x,2.3,.04);bx(F,s.w+.1,.1,.6,vm('planks'),s.x,.8,.26);
    for(let i=0;i<2;i++)bx(F,s.w+.2,.1,.5,vm('awning'),s.x,2.45-i*.12,.3+i*.42);const n=Math.floor(s.w/.4);for(let i=0;i<n;i++)bx(F,.14,.18,.14,vm(i%2?'gold':'woolWhite'),s.x-s.w/2+.3+i*.4,.94,.3);}
  bx(root,Lx2,band,Dz2,vm('timber'),0,h1+band/2,.2);for(let i=0;i<10;i++)bx(root,.16,.16,.4,vm('timber'),-Lx2/2+.3+i*(Lx2-.6)/9,h1-.08,Dz/2+.15);
  const W2=vWalls({Lx:Lx2,Dz:Dz2,y:h1+band,h:h2,t:.2,mat:vm('plasterOchre'),ops:c.ops2,frame:vm('timber')});W2.group.position.z=.2;root.add(W2.group);
  for(const k of['front','back'])for(let x=-2.4;x<=2.41;x+=.8)if(Math.abs(x)>.3&&!c.ops2[k].some(o=>Math.abs(o.x-x)<o.w/2+.15))bx(W2.faces[k],.12,h2-.4,.06,vm('timber'),x,h2/2,.04);
  put(root,vRoof(Lx2,Dz2,H,vm('tiles'),{ov:.6,ovL:.5,step:.4,gable:vm('plasterOchre'),ridge:vm('timber')}),0,h1+band+h2,.2,0,Math.PI/2,0);
  for(const gx of c.gable)vWin(W2.faces.front,{x:gx,w:.7,y0:h2+.4,y1:h2+1.1},.05,{}).position.z=.06;
  bx(root,.8,H+.8,.8,sb,c.chim[0],h1+band+h2+(H+.8)/2,c.chim[1]);bx(root,1,.16,1,vm('cobble'),c.chim[0],h1+band+h2+H+.88,c.chim[1]);
  if(c.sign!=null){const sg=new THREE.Group();put(F,sg,c.sign,h1-.3,0);bx(sg,.06,.06,1,vm('iron'),0,0,.5);bx(sg,.08,.6,.6,vm('planks'),0,-.36,.7);bx(sg,.1,.3,.3,vm('gold'),0,-.36,.7);}
  const fd=c.ops1.front.find(o=>o.type==='door');if(fd)bx(root,1.2,.16,.5,sb,fd.x,.08,Dz/2+.25);vLantern(root,L,c.lamp,2.3,Dz/2);c.props(root,{Lx,Dz});return root;}
const TOWNS=[
 {shop:{x:-.9,w:2.2},ops1:{front:[{type:'hole',x:-.9,w:2.2,y0:.8,y1:2.2},{type:'door',x:1.6,w:1,y0:0,y1:2.2}],back:[{x:0,w:.8,y0:.8,y1:1.6}],right:[{x:.8,w:.6,y0:.8,y1:1.6}],left:[{x:-.8,w:.6,y0:.8,y1:1.6}]},
  ops2:{front:[{x:-1.4,w:1.2,y0:.8,y1:1.6},{x:1.4,w:1.2,y0:.8,y1:1.6}],back:[{x:.9,w:.8,y0:.8,y1:1.6}],right:[{x:-.6,w:.8,y0:.8,y1:1.6}],left:[{x:.6,w:.8,y0:.8,y1:1.6}]},gable:[0],chim:[1.4,-1.6],sign:2.3,lamp:.8,
  props:(r,{Dz})=>{vBarrel(r,-2.3,Dz/2+.6);vBarrel(r,-1.6,Dz/2+.8);vCrate(r,.6,2.6,0,Dz/2+.6,.3);vCrate(r,.45,2.6,.6,Dz/2+.6,.6);vSack(r,-1.9,Dz/2+1.4);},
  desc:'Shop counter and awning on the left, door on the right, two wide upper windows.'},
 {shop:{x:.9,w:2.2},ops1:{front:[{type:'hole',x:.9,w:2.2,y0:.8,y1:2.2},{type:'door',x:-1.6,w:1,y0:0,y1:2.2}],back:[{x:0,w:.8,y0:.8,y1:1.6}],right:[{x:.8,w:.6,y0:.8,y1:1.6}],left:[{x:-.8,w:.6,y0:.8,y1:1.6}]},
  ops2:{front:[{x:-1.7,w:.8,y0:.8,y1:1.6},{x:0,w:.8,y0:.8,y1:1.6},{x:1.7,w:.8,y0:.8,y1:1.6}],back:[{x:-.9,w:.8,y0:.8,y1:1.6}],right:[{x:.6,w:.8,y0:.8,y1:1.6}],left:[{x:-.6,w:.8,y0:.8,y1:1.6}]},gable:[0],chim:[-1.4,-1.6],sign:-2.3,lamp:-.8,
  props:(r,{Dz})=>{vCrate(r,.6,2.6,0,Dz/2+.7,.2);vSack(r,2.2,Dz/2+1.3);vBarrel(r,-2.5,Dz/2+1.1);},
  desc:'Mirror layout: shop on the right, door on the left, three upper windows.'},
 {shop:null,ops1:{front:[{type:'door',x:0,w:1,y0:0,y1:2.2},{x:-1.6,w:.8,y0:.8,y1:1.7,flowers:true},{x:1.6,w:.8,y0:.8,y1:1.7,flowers:true}],back:[{type:'door',x:1,w:.9,y0:0,y1:2},{x:-1,w:.8,y0:.8,y1:1.6}],right:[{x:.8,w:.6,y0:.8,y1:1.6}],left:[{x:-.8,w:.6,y0:.8,y1:1.6}]},
  ops2:{front:[{x:-1.4,w:1,y0:.8,y1:1.6},{x:1.4,w:1,y0:.8,y1:1.6}],back:[{x:.9,w:.8,y0:.8,y1:1.6}],right:[{x:-.6,w:.8,y0:.8,y1:1.6}],left:[{x:.6,w:.8,y0:.8,y1:1.6}]},gable:[-.6,.6],chim:[1.4,-1.6],sign:null,lamp:.8,
  props:(r,{Dz})=>{vBench(r,-1.6,Dz/2+.7);vBush(r,2.8,Dz/2+.9,.9);vBarrel(r,-2.8,-1,true);},
  desc:'Residence without a shop: centre door between two flower-box windows, two attic windows in the gable.'},
 {shop:{x:-.6,w:2.6},ops1:{front:[{type:'hole',x:-.6,w:2.6,y0:.8,y1:2.2},{type:'door',x:1.75,w:.9,y0:0,y1:2.2}],back:[{x:0,w:.8,y0:.8,y1:1.6}],right:[{x:.8,w:.6,y0:.8,y1:1.6}],left:[{x:-.8,w:.6,y0:.8,y1:1.6}]},
  ops2:{front:[{x:-1,w:1.4,y0:.8,y1:1.6},{x:1.6,w:.8,y0:.8,y1:1.6}],back:[{x:.9,w:.8,y0:.8,y1:1.6}],right:[{x:-.6,w:.8,y0:.8,y1:1.6}],left:[{x:.6,w:.8,y0:.8,y1:1.6}]},gable:[0],chim:[-1.4,-1.8],sign:2.35,lamp:1,
  props:(r,{Dz})=>{vBarrel(r,-2.4,Dz/2+.7);vBarrel(r,-2.4,Dz/2+1.4);vSack(r,-1.6,Dz/2+1.4);vCrate(r,.5,2.5,0,Dz/2+.9,.4);},
  desc:'Wider shop window on the left, narrow door on the right, one wide and one narrow upper window.'},
 {shop:{x:-.3,w:2.6},ops1:{front:[{type:'hole',x:-.3,w:2.6,y0:.8,y1:2.2}],back:[{x:0,w:.8,y0:.8,y1:1.6}],right:[{type:'door',x:1.6,w:1,y0:0,y1:2.2}],left:[{x:-.8,w:.6,y0:.8,y1:1.6}]},
  ops2:{front:[{x:-1.7,w:.8,y0:.8,y1:1.6},{x:0,w:.6,y0:.8,y1:1.6},{x:1.7,w:.8,y0:.8,y1:1.6}],back:[{x:.9,w:.8,y0:.8,y1:1.6}],right:[{x:-.6,w:.8,y0:.8,y1:1.6}],left:[{x:.6,w:.8,y0:.8,y1:1.6}]},gable:[0],chim:[-1.4,-1.6],sign:2.3,lamp:1.6,
  props:(r,{Dz})=>{bx(r,.5,.16,1.2,vm('stoneBrick'),2.75,.08,1.6);vCrate(r,.6,-2.4,0,Dz/2+.6,.2);vCrate(r,.45,-2.4,.6,Dz/2+.6,.5);vBarrel(r,2.9,Dz/2+.4);},
  desc:'Full-width shop front with the entrance moved to the right side wall.'},
];

/* registry: replace house 1 of each type with numbered sets; brick houses follow the cottages */
(()=>{const groups=[['vx-cottage','Half-timbered cottage','cot',COTTAGES,cottageType],['vx-croft','Stone croft','crf',CROFTS,croftType],['vx-townhouse',"Merchant's townhouse",'twn',TOWNS,townType]];
  for(const[old,name,key,list,fn]of groups){const i=ASSETS.findIndex(a=>a.id===old),folder=ASSETS[i].folder;const items=list.map((c,k)=>({id:`vx-${key}-${k+1}`,folder,name:`${name} ${k+1}`,build:()=>fn(c),desc:c.desc}));
    if(key==='cot')BRICKS.forEach((c,k)=>items.push({id:`vx-brk-${k+1}`,folder,name:`Brick house ${k+1}`,build:()=>brickType(c),desc:c.desc}));
    ASSETS.splice(i,1,...items);}})();
