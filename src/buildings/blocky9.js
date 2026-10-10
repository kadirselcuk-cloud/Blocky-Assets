/* ======================= watermill, quarry, herb collector, clinic, sickhouse, boarding house; categories ======================= */
ICONS.bed=(g,x,y,z)=>{for(const s of[-1,1]){bx(g,.04,.08,.4,vm('planksDark'),x*s,y-.08,z);bx(g,.04,.2,.06,vm('planksDark'),x*s,y,z-.18);bx(g,.045,.08,.3,vm('woolBlue'),x*s,y-.02,z+.04);bx(g,.045,.08,.1,vm('woolWhite'),x*s,y,z-.1);}};
ICONS.mortar=(g,x,y,z)=>{for(const s of[-1,1]){bx(g,.04,.12,.3,vm('stone'),x*s,y-.08,z);bx(g,.04,.06,.2,vm('stone'),x*s,y-.17,z);bx(g,.045,.3,.05,vm('planks'),x*s,y+.06,z+.06,.5,0,0);}};
ICONS.leaf=(g,x,y,z)=>{for(const s of[-1,1]){bx(g,.04,.3,.14,vm('leaves'),x*s,y,z);bx(g,.04,.14,.3,vm('leaves'),x*s,y+.04,z);bx(g,.045,.36,.03,vm('woolGreen'),x*s,y-.02,z,.6,0,0);}};
const lavMat=()=>cutTex('lav',(P,r)=>{for(let b=0;b<5;b++){const x=2+b*3;for(let y=0;y<10;y++)P(x,15-y,'#5e8a38');for(let y=10;y<14;y++){P(x,15-y,'#8a6ac8',nz(r,.85,1.1));if(r()<.6)P(x+1,15-y,'#7a5ab8',nz(r,.85,1.1));}}});
const chamMat=()=>cutTex('cham',(P,r)=>{for(let b=0;b<4;b++){const x=2+b*4;for(let y=0;y<8;y++)P(x,15-y,'#5e8a38');for(const[dx,dy]of[[0,0],[1,0],[-1,0],[0,1],[0,-1]])P(x+dx,7+dy,dx||dy?'#f0f0f0':'#e8c030');}});
function vRaisedBed(par,x,z,w,d,fill){const g=new THREE.Group();put(par,g,x,0,z);bx(g,w,.3,d,vm('planks'),0,.15,0);bx(g,w-.16,.04,d-.16,vm('dirt'),0,.31,0);fill(g,w,d);return g;}
function vLinenLine(par,x,z,len,ry=0,cols=['woolWhite','woolWhite','woolBlue','woolWhite']){const g=new THREE.Group();put(par,g,x,0,z,0,ry,0);for(const s of[-1,1])vlog(g,.12,1.9,.12,'y',s*len/2,.95,0);bx(g,len,.03,.03,vm('rope'),0,1.8,0);
  const n=Math.floor((len-.4)/.7);for(let i=0;i<n;i++)bx(g,.55,.9,.03,vm(cols[i%cols.length]),-len/2+.5+i*.7,1.35,0);return g;}
function vPorch(par,x,z,w,d,h,mat){const g=new THREE.Group();put(par,g,x,0,z);bx(g,w,.14,d,vm('planks'),0,.07,d/2);for(const s of[-1,1])vlog(g,.2,h,.2,'y',s*(w/2-.15),h/2,d-.15);bx(g,w,.2,.2,vm('timber'),0,h,d-.15);
  for(let i=0;i<3;i++)bx(g,w+.3,.16,d+.3-i*.4,mat,0,h+.16+i*.16,(d+.3)/2-.15-i*.2);return g;}

/* ---------- Watermill (stone and boarded mill house, overshot wheel that turns) ---------- */
function vxWatermill(){const root=new THREE.Group(),L=[];root.userData.lights=L;const Lx=6,Dz=5,h1=2.4,h2=2,H=2.4,cx=Lx/2+1.9;
  vYard(root,9,8,-1.6,.6);vWaterArea(root,3,18,cx,0);for(const s of[-1,1])for(let z=-8.8;z<9;z+=.8)bx(root,.4,.32,.8,vm(((z*5)|0)%3?'cobble':'stone'),cx+s*1.7,.16,z+.4).userData.noFrame=true;
  root.add(vWalls({Lx,Dz,y:0,h:h1,t:.4,mat:vm('stoneBrick'),ops:{front:[{type:'door',x:-1,w:1.1,y0:0,y1:2.1,lintel:vm('cobble')},{x:1.2,w:.7,y0:.9,y1:1.7,sill:vm('cobble')}],back:[{x:0,w:.7,y0:.9,y1:1.7,sill:vm('cobble')}],right:[{x:-1.4,w:.6,y0:1,y1:1.6}],left:[{x:0,w:.7,y0:.9,y1:1.7}]}}).group);
  root.add(vWalls({Lx,Dz,y:h1,h:h2,t:.2,mat:vm('planks'),ops:{front:[{x:-1,w:.7,y0:.5,y1:1.3},{x:1.4,w:.7,y0:.5,y1:1.3}],back:[{x:0,w:.7,y0:.5,y1:1.3}],right:[],left:[{x:0,w:.6,y0:.5,y1:1.2}]},frame:vm('timber')}).group);
  bx(root,Lx+.2,.2,Dz+.2,vm('timber'),0,h1+.1,0);put(root,vRoof(Dz,Lx,H,vm('shingle'),{ov:.7,ovL:.5,step:.4,gable:vm('planks'),ridge:vm('planksDark')}),0,h1+h2,0);
  // wheel on the stream side
  const wy=2.05,R=2;vlog(root,cx+1.05-Lx/2,.3,.3,'x',(Lx/2+cx+1.05)/2,wy,0);for(const px of[cx-.66,cx+.66,cx+1.05]){vlog(root,.28,wy-.12,.28,'y',px,(wy-.12)/2,0);bx(root,.4,.24,.4,vm('planksDark'),px,wy-.12,0);}for(const s of[-1,1])bx(root,.12,1.5,.12,vm('planksDark'),cx-.66,.75,s*.4,s*.3,0,0);const hub=new THREE.Group();hub.position.set(cx,wy,0);root.add(hub);const rot=new THREE.Group();hub.add(rot);
  bx(rot,.8,.5,.5,vm('planksDark'),0,0,0);const N=16;for(let i=0;i<N;i++){const a=i/N*Math.PI*2,y=Math.sin(a),z=Math.cos(a);
    const th=Math.PI/2-a;for(const s of[-1,1])bx(rot,.12,.22,2*Math.PI*R/N+.04,vm('planksDark'),s*.36,y*R,z*R,th,0,0);bx(rot,.84,.36,.06,vm('planks'),0,y*(R+.12),z*(R+.12),th,0,0);if(i%2===0)for(const s of[-1,1])bx(rot,.1,R,.12,vm('planksDark'),s*.36,y*R/2,z*R/2,th,0,0);}
  rot.children[0].onBeforeRender=()=>{rot.rotation.x=performance.now()/1000*.6;};
  // flume bringing water over the top of the wheel
  const fy=wy+R+.45;bx(root,.8,.12,8,vm('planksDark'),cx,fy,-4.3);for(const s of[-1,1])bx(root,.08,.3,8,vm('planksDark'),cx+s*.36,fy+.15,-4.3);
  for(const z of[-7.6,-5,-2.4])for(const s of[-1,1])vlog(root,.2,fy,.2,'y',cx+s*.5,fy/2,z);
  // footbridge, sacks, millstone, cart
  bx(root,1.2,.12,3.8,vm('planks'),cx,.42,5.2,0,Math.PI/2,0);for(const s of[-1,1])bx(root,.1,.5,.1,vm('planksDark'),cx+s*1.6,.6,5.6);
  for(let i=0;i<5;i++)vSack(root,-Lx/2-.6+(i%2)*.45,1.2+Math.floor(i/2)*.42);const ms=new THREE.Group();put(root,ms,-1,0,Dz/2+1.6,0,.4,0);bx(ms,.3,1.2,1.2,vm('stoneBrick'),0,.6,0);bx(ms,.32,.2,.2,vm('dark'),0,.6,0);
  vCart(root,-Lx/2-2.2,-1.2,.3,'sacks');vLantern(root,L,-.2,1.9,Dz/2);root.userData.ground=11;return root;}

/* ---------- Quarry ---------- */
function vxQuarry(){const root=new THREE.Group(),L=[];root.userData.lights=L;const st=vm('stone'),gt=vm('grassTop');
  vYard(root,14,9,0,2.6);
  const terr=(w,h,d,x,z,top)=>{const b=box(w,h,d,[st,st,top||st,st,st,st],{s:.8,ox:0,oy:0,oz:0});put(root,b,x,h/2,z);return b;};
  terr(14,5.2,4,0,-6,gt);terr(11,3.6,1.6,0,-3.2);terr(8,2,1.4,-.4,-1.7);terr(4.4,.8,1.2,-1,-.4);
  for(const s of[-1,1]){terr(2,4.4,3,s*6.5,-3.2,gt);terr(1.6,3.2,2.4,s*6.8,-.9,gt);}
  for(const[x,y,z]of[[-3.2,3.6,-2.6],[-1.6,3.6,-2.6],[2.4,3.6,-2.6],[1.2,2,-1.2],[-2.6,2,-1.2],[2.2,.8,-.1]]){bx(root,.78,.78,.78,vm('stoneBrick'),x,y+.39,z);bx(root,.82,.04,.82,vm('dark'),x,y+.01,z);}
  for(const[x,z,s]of[[-5.4,-5.8,1],[4.6,-6.2,.9],[0,-6.6,1.1]])vTree(root,x,z,2.2,s).position.y=5.2;vBush(root,-3,-5,1).position.y=5.2;
  const ld=new THREE.Group();put(root,ld,3.6,0,-1.6,-.2,0,0);for(const s of[-1,1])bx(ld,.08,3.8,.08,vm('planksDark'),s*.25,1.9,0);for(let i=0;i<11;i++)bx(ld,.5,.06,.06,vm('planks'),0,.25+i*.33,0);
  // derrick crane lifting a block
  const dc=new THREE.Group();put(root,dc,-4.2,0,1.6);vlog(dc,.34,5,.34,'y',0,2.5,0);for(const s of[-1,1])bx(dc,.12,2.4,.12,vm('planksDark'),s*.7,1,0,0,0,s*.35);
  bx(dc,.22,.22,4.6,vm('timber'),0,4.2,-1.8,-.32,0,0);bx(dc,.04,2.6,.04,vm('rope'),0,3.2,-3.6);bx(dc,.14,.2,.08,vm('iron'),0,1.9,-3.6);bx(dc,.7,.7,.7,vm('stoneBrick'),0,1.4,-3.6);
  // cut blocks, rubble, tools, shelter, cart
  const cb=new THREE.Group();put(root,cb,3.6,0,3.4);for(let r=0;r<3;r++)for(let c=0;c<4-r;c++)bx(cb,.78,.78,.78,vm('stoneBrick'),(c-(3-r)/2)*.8,.39+r*.78,0);for(let c=0;c<3;c++)bx(cb,.78,.78,.78,vm('stoneBrick'),(c-1)*.8,.39,.82);
  for(let i=0;i<14;i++){const r=mulberry32(i*7);bx(root,.2+r()*.3,.16+r()*.2,.2+r()*.3,vm(r()<.5?'cobble':'stone'),-1.6+(r()-.5)*3,.12,1.2+(r()-.5)*1.4);}
  const sh=new THREE.Group();put(root,sh,-1.4,0,4.6);for(const[a,b]of[[1,1],[1,-1],[-1,1],[-1,-1]])vlog(sh,.18,2.2,.18,'y',a*1.1,1.1,b*.8);bx(sh,2.6,.16,2,vm('planksDark'),0,2.25,0,.12,0,0);
  const tb=vTable(sh,0,0,1.6,.7);for(let i=0;i<4;i++)bx(tb,.04,.04,.26,vm('iron'),-.5+i*.2,.93,0);bx(tb,.3,.2,.3,vm('stoneBrick'),.5,.98,0);
  put(root,TOOLS.Sledgehammer.build(),.6,.95,4,-.25,0,-1.3);put(root,TOOLS.Pickaxe.build(),1.1,.95,4.1,-.2,0,-1.4);
  const ct=vCart(root,5.6,.6,-.8,null);for(let i=0;i<3;i++)bx(ct,.6,.5,.6,vm('stoneBrick'),0,1,-.6+i*.65);vBarrel(root,-5.6,3.6,true);root.userData.ground=12;return root;}

/* ---------- Herb collector (cottage style with herb garden) ---------- */
function vxHerbalist(){const root=new THREE.Group(),L=[];root.userData.lights=L;const Lx=4.8,Dz=3.8,base=.3,hw=2.3,H=2.3;
  vYard(root,9,8,0,1);bx(root,Lx+.2,base,Dz+.2,vm('cobble'),0,base/2,0);
  const W=vWalls({Lx,Dz,y:base,h:hw,t:.2,mat:vm('plaster'),ops:{front:[{type:'door',x:1.2,w:.9,y0:0,y1:1.9},{x:-1.2,w:.9,y0:.8,y1:1.6,flowers:true}],back:[{x:0,w:.6,y0:.8,y1:1.5}],right:[{x:0,w:.6,y0:.8,y1:1.5}],left:[]},frame:vm('timber'),unit:{shutter:vm('woolGreen')}});root.add(W.group);
  put(root,vRoof(Dz,Lx,H,vm('thatch'),{ov:.8,ovL:.5,step:.38,gable:vm('plaster'),ridge:vm('hay')}),0,base+hw,0);
  bx(root,.7,base+hw+H+.6,.9,vm('cobble'),-Lx/2-.4,(base+hw+H+.6)/2,0);bx(root,.9,.16,1.1,vm('stoneBrick'),-Lx/2-.4,base+hw+H+.68,0);
  vHangSign(W.faces.front,Lx/2-.3,hw-.2,0,ICONS.leaf);vLantern(root,L,.5,base+1.9,Dz/2);
  const beds=[[-2.6,Dz/2+2,g=>{for(let i=0;i<8;i++)vSprite(g,lavMat(),-.8+(i%4)*.5,.32,-.2+Math.floor(i/4)*.4,.4,.55,i);}],[-0,Dz/2+2,g=>{for(let i=0;i<8;i++)vSprite(g,chamMat(),-.8+(i%4)*.5,.32,-.2+Math.floor(i/4)*.4,.4,.45,i);}],
    [2.6,Dz/2+2,g=>{for(let i=0;i<8;i++)bx(g,.24,.22,.24,vm('leaves'),-.75+(i%4)*.5,.43,-.2+Math.floor(i/4)*.4);}],[-2.6,Dz/2+3.6,g=>{for(let i=0;i<8;i++)bx(g,.14,.36,.14,vm('woolGreen'),-.75+(i%4)*.5,.5,-.2+Math.floor(i/4)*.4);}],
    [0,Dz/2+3.6,g=>{for(let i=0;i<8;i++)vSprite(g,flowerMat(['#f0d040','#e8e8f0'][i%2]),-.8+(i%4)*.5,.32,-.2+Math.floor(i/4)*.4,.35,.4,i);}]];
  for(const[x,z,f]of beds)vRaisedBed(root,x,z,2,1.1,f);
  const cf=vRaisedBed(root,2.6,Dz/2+3.6,2,1.1,g=>{for(let i=0;i<6;i++)bx(g,.2,.16,.2,vm('leaves'),-.6+(i%3)*.6,.4,-.2+Math.floor(i/3)*.4);});
  const dr=new THREE.Group();put(root,dr,Lx/2+1.2,0,-.2,0,Math.PI/2,0);for(const s of[-1,1])vlog(dr,.14,1.9,.14,'y',s*1.3,.95,0);bx(dr,2.8,.08,.08,vm('planksDark'),0,1.75,0);
  for(let i=0;i<9;i++){const x=-1.1+i*.28;bx(dr,.02,.16,.02,vm('rope'),x,1.66,0);bx(dr,.14,.3,.14,vm(['leaves','woolPurple','hay','woolGreen'][i%4]),x,1.43,0);}
  const tb=vTable(root,-Lx/2-1.4,1.6,1.4,.7,Math.PI/2);bx(tb,.22,.14,.22,vm('stone'),-.4,.97,0);bx(tb,.14,.04,.14,vm('dark'),-.4,1.04,0);bx(tb,.04,.22,.04,vm('planks'),-.35,1.1,.04,.4,0,0);
  for(let i=0;i<4;i++){bx(tb,.12,.18,.12,vm('glass'),.1+i*.16,1,0);bx(tb,.1,.08,.1,vm(['woolGreen','woolPurple','gold','woolRed'][i]),.1+i*.16,.96,0);}
  vBasket(root,1.6,0,Dz/2+.9,'woolPurple',6);vBasket(root,2.1,0,Dz/2+.8,'leaves',6);vBarrel(root,-Lx/2-.4,-1.4,true);return root;}

/* ---------- Clinic ---------- */
function vxClinic(){const root=new THREE.Group(),L=[];root.userData.lights=L;const Lx=7,Dz=5,base=.4,hw=2.6,H=2.6;
  vYard(root,11,9,0,1.4);bx(root,Lx+.2,base,Dz+.2,vm('cobble'),0,base/2,0);
  const W=vWalls({Lx,Dz,y:base,h:hw,t:.2,mat:vm('plaster'),ops:{front:[{type:'door',x:0,w:1.2,y0:0,y1:2.2},{x:-2.3,w:1,y0:.8,y1:1.8,flowers:true},{x:2.3,w:1,y0:.8,y1:1.8,flowers:true}],back:[-2,0,2].map(x=>({x,w:.9,y0:.8,y1:1.8})),right:[{x:0,w:.9,y0:.8,y1:1.8}],left:[{x:0,w:.9,y0:.8,y1:1.8}]},frame:vm('timber'),unit:{shutter:vm('woolBlue')}});root.add(W.group);
  put(root,vRoof(Dz,Lx,H,vm('tiles'),{ov:.7,ovL:.6,step:.4,gable:vm('plaster'),ridge:vm('timber')}),0,base+hw,0);
  bx(root,.8,H+1,.8,vm('stoneBrick'),-2,base+hw+(H+1)/2,-1.2);bx(root,1,.16,1,vm('cobble'),-2,base+hw+H+1.08,-1.2);
  const pc=vPorch(root,0,Dz/2,4.4,1.6,2.3,vm('tiles'));for(const s of[-1,1])vBench(pc,s*1.4,.9);
  vHangSign(root,1.9,2.3,Dz/2+1.6,ICONS.mortar);vLantern(root,L,-.9,base+2.1,Dz/2);
  for(let i=0;i<4;i++){const p=new THREE.Group();put(root,p,-3.2+i*.5,0,Dz/2+2.2);bx(p,.3,.3,.3,vm('clayPot'),0,.15,0);bx(p,.3,.3,.3,vm('leaves'),0,.42,0);}
  vLinenLine(root,Lx/2+1.8,0,3.6,Math.PI/2);vBarrel(root,Lx/2+.5,Dz/2+.3,true);vBush(root,-Lx/2-1.2,-1,1);return root;}

/* ---------- Sickhouse (long stone infirmary with an arcade) ---------- */
function vxSickhouse(){const root=new THREE.Group(),L=[];root.userData.lights=L;const Lx=12,Dz=5.6,pl=.4,hw=3,H=2.6,sb=vm('stoneBrick'),cb=vm('cobble');
  vYard(root,16,12,0,2);bx(root,Lx+.3,pl,Dz+.3,cb,0,pl/2,0);
  const win=x=>({x,w:.7,y0:.9,y1:2.1,sill:cb,lintel:cb});
  root.add(vWalls({Lx,Dz,y:pl,h:hw,t:.4,mat:sb,ops:{front:[{type:'door',x:0,w:1.6,y0:0,y1:2.4,lintel:cb},...[-4.6,-3,-1.6,1.6,3,4.6].map(win)],back:[-4.6,-3,-1.4,1.4,3,4.6].map(win),right:[win(-1.2),win(1.2)],left:[win(-1.2),win(1.2)]}}).group);
  put(root,vRoof(Dz,Lx,H,vm('slate'),{ov:.6,ovL:.5,step:.37,gable:sb,gt:.4,ridge:cb}),0,pl+hw,0);
  for(const s of[-1,1]){bx(root,.8,hw+H+.8,1,sb,s*(Lx/2-.4),pl+(hw+H+.8)/2,0);bx(root,1,.16,1.2,cb,s*(Lx/2-.4),pl+hw+H+.88,0);}
  const ar=new THREE.Group();put(root,ar,0,pl,Dz/2);for(let x=-Lx/2+.3;x<=Lx/2-.3+1e-6;x+=(Lx-.6)/6)vlog(ar,.24,2.4,.24,'y',x,1.2,1.6);bx(ar,Lx,.2,.24,vm('timber'),0,2.45,1.6);bx(ar,Lx,.1,1.8,vm('planks'),0,-.05,.9);
  for(let i=0;i<3;i++)bx(ar,Lx+.4,.16,2.1-i*.5,vm('slate'),0,2.6+i*.16,.95-i*.25);
  for(const x of[-4,-2,2,4])vBench(ar,x,1);vLantern(ar,L,-.9,2.1,0);vLantern(ar,L,.9,2.1,0);
  vLinenLine(root,-Lx/2-1.6,1,4,Math.PI/2,['woolWhite']);vLinenLine(root,-Lx/2-3,1,4,Math.PI/2,['woolWhite']);
  for(const[x,z]of[[Lx/2+1.6,-1],[Lx/2+1.6,1]])vRaisedBed(root,x,z,1.4,1.6,g=>{for(let i=0;i<6;i++)vSprite(g,i%2?lavMat():chamMat(),-.3+(i%2)*.6,.32,-.5+Math.floor(i/2)*.5,.35,.45,i);});
  vBench(root,Lx/2+3,0);vCart(root,4.6,Dz/2+4.2,.4,'sacks');vBarrel(root,-Lx/2+.6,Dz/2+2.4,true);root.userData.ground=12;return root;}

/* ---------- Boarding house (two storeys, rooms to let) ---------- */
function vxBoardingHouse(){const root=new THREE.Group(),L=[];root.userData.lights=L;const Lx=8,Dz=6,h1=2.8,band=.3,Lx2=8.4,Dz2=6.4,h2=2.6,H=3,sb=vm('stoneBrick');
  vYard(root,12,10,0,1.4);
  root.add(vWalls({Lx,Dz,y:0,h:h1,t:.3,mat:vm('cobble'),ops:{front:[{type:'door',x:-1.4,w:1.1,y0:0,y1:2.2,lintel:sb},{x:-3,w:.8,y0:.9,y1:1.7,flowers:true},{x:.6,w:.8,y0:.9,y1:1.7,flowers:true},{x:2.4,w:.8,y0:.9,y1:1.7,flowers:true}],back:[{type:'door',x:2.4,w:1,y0:0,y1:2.1},{x:-2,w:.8,y0:.9,y1:1.7},{x:0,w:.8,y0:.9,y1:1.7}],right:[{x:-1,w:.8,y0:.9,y1:1.7},{x:1.2,w:.8,y0:.9,y1:1.7}],left:[{x:0,w:.8,y0:.9,y1:1.7}]}}).group);
  bx(root,Lx2,band,Dz2,vm('timber'),0,h1+band/2,.2);for(let i=0;i<14;i++)bx(root,.16,.16,.4,vm('timber'),-Lx2/2+.3+i*(Lx2-.6)/13,h1-.08,Dz/2+.15);
  const ops2={front:[-3.2,-1.6,0,1.6,3.2].map(x=>({x,w:.8,y0:.8,y1:1.7})),back:[-2.4,0,2.4].map(x=>({x,w:.8,y0:.8,y1:1.7})),right:[{x:-1.2,w:.8,y0:.8,y1:1.7},{x:1.2,w:.8,y0:.8,y1:1.7}],left:[{x:-1.2,w:.8,y0:.8,y1:1.7},{x:1.2,w:.8,y0:.8,y1:1.7}]};
  const W2=vWalls({Lx:Lx2,Dz:Dz2,y:h1+band,h:h2,t:.2,mat:vm('plaster'),ops:ops2,frame:vm('timber'),unit:{shutter:vm('woolGreen')}});W2.group.position.z=.2;root.add(W2.group);
  const top=h1+band+h2;put(root,vRoof(Dz2,Lx2,H,vm('tiles'),{ov:.7,ovL:.6,step:.4,gable:vm('plaster'),ridge:vm('timber')}),0,top,.2);
  for(const s of[-1,1]){bx(root,.8,H+.9,.9,sb,s*(Lx2/2-.5),top+(H+.9)/2,.2);bx(root,1,.16,1.1,vm('cobble'),s*(Lx2/2-.5),top+H+.98,.2);}
  bx(root,1.6,.16,.6,sb,-1.4,.08,Dz/2+.3);vHangSign(root,-.4,h1-.3,Dz/2,ICONS.bed);vLantern(root,L,-2.3,2.2,Dz/2);
  vBench(root,1.6,Dz/2+.6);vBench(root,-3,Dz/2+.6);vLinenLine(root,Lx/2+1.8,.4,4,Math.PI/2,['woolWhite','woolBlue','woolWhite','woolRed']);vBarrel(root,-Lx/2-.5,Dz/2-.3,true);vBarrel(root,-Lx/2-.5,Dz/2-1);vWoodpile(root,8,4,0,-Dz/2-.5);return root;}

[['vx-watermill','Watermill',vxWatermill,'Stone and boarded mill house beside a stone-lined stream, with an overshot wheel that turns under a timber flume, a footbridge, flour sacks, a spare millstone and a cart.',11],
 ['vx-quarry','Quarry',vxQuarry,'Terraced stone face cut into a grassy hill, part-cut blocks on the benches, a derrick crane lifting a block, stacked dressed stone, rubble, a ladder, a tool shelter and a cart of blocks.',12],
 ['vx-herbalist','Herb collector',vxHerbalist,'Thatched herbalist\'s cottage with raised beds of lavender, chamomile, leafy and flowering herbs, a herb drying line and a table with mortar and jars.',null],
 ['vx-clinic','Clinic',vxClinic,'Plaster-and-oak healer\'s house with a tiled waiting porch and benches, a mortar-and-pestle sign, potted herbs and a line of drying linen.',null],
 ['vx-sickhouse','Sickhouse',vxSickhouse,'Long stone infirmary under slate with twin chimneys, a covered arcade with benches along the front, herb beds, linen lines and a supply cart.',12],
 ['vx-boarding','Boarding house',vxBoardingHouse,'Two-storey lodging house with a cobble ground floor, jettied plaster rooms above with green shutters, twin chimneys, a bed sign, benches and a washing line.',null],
].forEach(([id,name,build,desc,g])=>ASSETS.push({id,folder:'buildings/medieval',name,build,desc,groundR:g||undefined}));

/* ---------- categories under Buildings → Medieval ---------- */
(()=>{const CATS={housing:['Housing','Cottages, houses and lodgings',['vx-cot-','vx-brk-','vx-crf-','vx-twn-','vx-boarding']],
  resource:['Resource collection','Wood, stone, ore, game, fish and plants',['vx-cabin','vx-forester','vx-mine','vx-quarry','vx-hunter','vx-gatherer','vx-herbalist','vx-fishery']],
  production:['Production','Workshops, mills and kitchens',['vx-toolsmith','vx-blacksmith','vx-kiln','vx-oven','vx-windmill','vx-watermill','vx-bakery','vx-leather','vx-loom','vx-tailor','vx-weaver','vx-kitchen','vx-smokehouse','vx-shipyard']],
  farming:['Farming','Farmhouses, barns and animals',['vx-farmhouse','vx-farm-','vx-barn','vx-granary','vx-coop','vx-sheepfold','vx-stable']],
  civil:['Civil','Markets, inns, health and public works',['vx-market','vx-stall-','vx-tavern','vx-clinic','vx-sickhouse','vx-well','vx-dock']],
  military:['Military','Walls, gates, towers and training',['vx-barracks','vx-archery','vx-stonewall','vx-stonetower','vx-palisade','vx-woodgate','vx-stonegate']],
  management:['Management','Seats of government and treasury',['vx-townhall','vx-manor','vx-mint']]};
  FOLDERS['buildings/medieval'].children=Object.keys(CATS).map(k=>'buildings/medieval/'+k);FOLDERS['buildings/medieval'].blurb='Village and farmstead, in blocks';
  for(const k in CATS)FOLDERS['buildings/medieval/'+k]={name:CATS[k][0],blurb:CATS[k][1],children:[]};
  for(const a of ASSETS){if(a.folder!=='buildings/medieval')continue;for(const k in CATS)if(CATS[k][2].some(p=>p.endsWith('-')?a.id.startsWith(p):a.id===p)){a.folder='buildings/medieval/'+k;break;}}
  const left=ASSETS.filter(a=>a.folder==='buildings/medieval').map(a=>a.id);if(left.length)console.warn('uncategorised',left);
  const order=Object.keys(CATS);ASSETS.sort((a,b)=>{const ia=order.findIndex(k=>a.folder.endsWith('/'+k)),ib=order.findIndex(k=>b.folder.endsWith('/'+k));return ia===ib?0:(ia<0?1:ib<0?-1:ia-ib);});})();
