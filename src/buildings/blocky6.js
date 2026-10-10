/* ======================= batch 3: water, land and industry ======================= */
VXD.stone=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,r()<.1?'#6e6e6a':'#8a8a86',nz(r,.9,1.06));};
VXD.ore=(P,r)=>{const m=mulberry32(91);for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,'#7e7e7a',nz(r,.88,1.06));for(let i=0;i<5;i++){const x=Math.floor(m()*14),y=Math.floor(m()*14),c=m()<.5?'#e0b840':'#c88a5a';P(x,y,c,1);P(x+1,y,c,.9);P(x,y+1,c,.85);}};
VXD.rope=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,'#b89a68',(x+y)%4<2?nz(r,.95,1.05):.8);};
VXD.fish=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,y<5?'#5a6e7e':'#a8b4bc',nz(r,.9,1.08));};
VXD.sand=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,'#cdb27e',nz(r,.88,1.06));};
ICONS.coin=(g,x,y,z)=>{for(const s of[-1,1]){bx(g,.04,.3,.22,vm('gold'),x*s,y,z);bx(g,.04,.22,.3,vm('gold'),x*s,y,z);bx(g,.045,.1,.1,vm('hay'),x*s,y,z);}};
function vLand(par,w,d,x,z,h=.4,top='grassTop'){const sd=vm('grassSide'),m=box(w,h,d,[sd,sd,vm(top),vm('dirt'),sd,sd],{s:.8,ox:0,oy:0,oz:0});put(par,m,x,h/2,z);m.userData.noFrame=true;return m;}
function vBoat(par,x,y,z,ry=0,len=3,oars=true){const g=new THREE.Group();put(par,g,x,y,z,0,ry,0);const p=vm('planks'),d=vm('planksDark');
  bx(g,.5,.12,len-.8,d,0,.06,0);for(const s of[-1,1]){bx(g,.14,.3,len-1,p,s*.32,.25,0);bx(g,.14,.3,len-.6,p,s*.5,.52,0);bx(g,.16,.06,len-.6,d,s*.5,.7,0);}
  for(const e of[-1,1]){bx(g,.5,.3,.14,p,0,.25,e*(len/2-.45));bx(g,.86,.3,.14,p,0,.52,e*(len/2-.27));bx(g,.2,.8,.2,d,0,.45,e*(len/2-.12));}
  bx(g,.9,.08,.32,d,0,.55,-.3);bx(g,.9,.08,.32,d,0,.55,.55);if(oars)for(const s of[-1,1]){bx(g,.06,.06,1.8,p,s*.2,.66,.1,0,s*.25,0);bx(g,.06,.2,.3,p,s*.43,.66,.95,0,s*.25,0);}return g;}
function vFish(par,x,y,z,ry=0){const g=new THREE.Group();put(par,g,x,y,z,0,ry,0);bx(g,.08,.3,.12,vm('fish'),0,0,0);bx(g,.05,.1,.18,vm('fish'),0,-.18,0);bx(g,.06,.04,.04,vm('dark'),0,.1,.05);return g;}
function vChest(par,x,z,ry=0,open=false){const g=new THREE.Group();put(par,g,x,0,z,0,ry,0);const w=vm('planksDark'),ir=vm('iron');
  if(!open){bx(g,.8,.45,.5,w,0,.225,0);for(const s of[-.3,.3])bx(g,.06,.47,.52,ir,s,.235,0);}
  else{bx(g,.8,.05,.5,w,0,.025,0);for(const s of[-1,1]){bx(g,.8,.45,.05,w,0,.225,s*.225);bx(g,.05,.45,.4,w,s*.375,.225,0);}for(const s of[-.3,.3]){bx(g,.06,.47,.04,ir,s,.235,.24);bx(g,.06,.47,.04,ir,s,.235,-.24);bx(g,.06,.03,.52,ir,s,.01,0);}}
  const lid=new THREE.Group();put(g,lid,0,.45,-.25);if(open)lid.rotation.x=-1.2;bx(lid,.8,.14,.5,w,0,.07,.25);if(!open){for(const s of[-.3,.3])bx(lid,.06,.16,.52,ir,s,.07,.25);bx(g,.1,.12,.04,vm('gold'),0,.38,.26);}
  if(open){bx(g,.7,.22,.4,w,0,.16,0);const r=mulberry32(9);for(let i=0;i<14;i++)bx(g,.11,.05,.11,vm('gold'),-.26+(i%5)*.13,.29+(i>9?.05:0)+r()*.02,-.12+Math.floor(i/5)*.12,0,r()*2,0);}
  return g;}

/* ---------- Well ---------- */
function vxWell(){const root=new THREE.Group(),L=[];root.userData.lights=L;const c=.4;
  vYard(root,5.2,5.2,0,0);for(let i=-4;i<4;i++)for(let k=-4;k<4;k++){const x=(i+.5)*c,z=(k+.5)*c,d=Math.hypot(x,z);if(d>=.95&&d<1.42){bx(root,c,.85,c,vm('cobble'),x,.425,z);bx(root,c,.1,c,vm('stoneBrick'),x,.9,z);}}
  vDisc(root,0,0,1,0,.62,vm('water'));
  for(const s of[-1,1]){vlog(root,.24,2.5,.24,'y',s*1.2,1.25,0);}vlog(root,2.8,.2,.2,'x',0,2.05,0);
  const cr=new THREE.Group();put(root,cr,1.4,2.05,0);bx(cr,.16,.07,.07,vm('iron'),.08,0,0);bx(cr,.06,.5,.06,vm('iron'),.16,-.22,0);bx(cr,.06,.06,.3,vm('planks'),.16,-.47,.12);
  bx(root,.05,.95,.05,vm('rope'),0,1.55,0);bx(root,.24,.04,.04,vm('rope'),0,1.1,0);bx(root,.3,.3,.3,vm('barrel'),0,.92,0);bx(root,.04,.14,.04,vm('iron'),0,1.12,0);
  put(root,vRoof(1.8,2.8,1,vm('shingle'),{ov:.3,ovL:.3,step:.25,gable:vm('planksV'),ridge:vm('planksDark')}),0,2.5,0);
  bx(root,.3,.3,.3,vm('barrel'),.9,1.1,.7);const tr=new THREE.Group();put(root,tr,-1.9,0,1.1,0,.5,0);bx(tr,1.2,.4,.5,vm('planksDark'),0,.2,0);bx(tr,1,.04,.32,vm('water'),0,.38,0);
  vBush(root,1.9,-1.6,.8);root.userData.ground=4;return root;}

/* ---------- Farmhouse ---------- */
function vxFarmhouse(){const root=new THREE.Group(),L=[];root.userData.lights=L;const Lx=8,Dz=5,base=.4,hw=2.4,H=2.8;
  vYard(root,10,7.6,0,.8);bx(root,Lx+.2,base,Dz+.2,vm('cobble'),0,base/2,0);
  const ops={front:[{type:'door',x:.8,w:1,y0:0,y1:2},{x:-2.8,w:.8,y0:.8,y1:1.6,flowers:true},{x:-1.2,w:.8,y0:.8,y1:1.6,flowers:true},{x:2.6,w:.8,y0:.8,y1:1.6,flowers:true}],back:[{type:'door',x:-2,w:.9,y0:0,y1:1.9},{x:.4,w:.8,y0:.8,y1:1.6},{x:2.4,w:.8,y0:.8,y1:1.6}],right:[{x:0,w:.8,y0:.8,y1:1.6}],left:[]};
  root.add(vWalls({Lx,Dz,y:base,h:hw,t:.2,mat:vm('plaster'),ops,frame:vm('timber'),unit:{shutter:vm('planksDark')}}).group);
  put(root,vRoof(Dz,Lx,H,vm('thatch'),{ov:.7,ovL:.6,step:.4,gable:vm('plaster'),ridge:vm('hay')}),0,base+hw,0);for(const s of[-1,1])bx(root,.1,.2,Dz,vm('timber'),s*(Lx/2+.04),base+hw+.1,0);
  bx(root,.8,base+hw+H+.8,1.2,vm('cobble'),-Lx/2-.5,(base+hw+H+.8)/2,0);bx(root,1,.2,1.4,vm('stoneBrick'),-Lx/2-.5,base+hw+H+.9,0);
  bx(root,1.4,.2,.6,vm('cobble'),.8,.1,Dz/2+.4);bx(root,1.2,.2,.4,vm('cobble'),.8,.3,Dz/2+.2);vLantern(root,L,1.6,base+2.1,Dz/2);
  // vegetable plot (larger)
  const gx=-3.2,gz=Dz/2+4.6,GW=7.2,rows=7;for(let i=0;i<rows;i++){const rz=gz-2.4+i*.8,kind=i%4;bx(root,GW-.4,.16,.5,vm('dirt'),gx,.08,rz);for(let k=0;k<13;k++){const px=gx-GW/2+.5+k*.5;
    if(kind===0)bx(root,.22,.2,.22,vm('leaves'),px,.26,rz);else if(kind===1){bx(root,.08,.2,.08,vm('leaves'),px,.26,rz);bx(root,.1,.06,.1,vm('gold'),px,.17,rz);}else if(kind===2){bx(root,.12,.4,.12,vm('hay'),px,.36,rz);bx(root,.14,.12,.14,vm('gold'),px,.62,rz);}else{bx(root,.16,.3,.16,vm('leaves'),px,.31,rz);if(k%2)bx(root,.08,.08,.08,vm('woolRed'),px+.06,.4,rz+.06);}}}
  for(let i=0;i<2;i++)vFence(root,GW/2,gx-GW/4+i*GW/2,gz+2.9);for(let i=0;i<2;i++)vFence(root,GW/2,gx-GW/4+i*GW/2,gz-3.1);for(const s of[-1,1])for(let i=0;i<2;i++)vFence(root,3,gx+s*GW/2,gz-1.6+i*3,Math.PI/2);
  vSack(root,gx+GW/2+.6,gz+2.2);bx(root,.06,1.4,.06,vm('planks'),gx+GW/2+.9,.7,gz+1.6,.3,0,0);
  for(const[x,z]of[[Lx/2+1.6,-.6],[Lx/2+2.4,-.6],[Lx/2+2,.2]])vHay(root,x,0,z);vHay(root,Lx/2+2,.8,-.2);vCart(root,Lx/2+1.6,-3.2,1.4,'hay');
  vBarrel(root,Lx/2+.4,Dz/2+.4,true);vWoodpile(root,8,4,1,-Dz/2-.45);vBush(root,-Lx/2-1.6,-1.6,1);root.userData.ground=13;return root;}

/* ---------- Mine ---------- */
function vxMine(){const root=new THREE.Group(),L=[];root.userData.lights=L;
  vYard(root,9,6,0,3.2);const st=vm('stone'),gt=vm('grassTop'),ore=vm('ore');
  const TE=-5.6;for(let i=0;i<6;i++){const w=11-i*1.4,d=8-i*1,zf=-2-i*.6,m=i%2?ore:st,mm=[m,m,gt,m,m,m],off=i%2?.2:-.2,y=.4+i*.8;
    if(i<4&&zf>TE){const L0=-w/2+off,R0=w/2+off;for(const[a,b2]of[[L0,-1.2],[1.2,R0]]){const bb=box(b2-a,.8,d,mm,{s:.8,ox:0,oy:0,oz:0});put(root,bb,(a+b2)/2,y,zf-d/2);}const back=zf-d;if(back<TE){const bb=box(2.4,.8,TE-back,mm,{s:.8,ox:0,oy:0,oz:0});put(root,bb,0,y,(TE+back)/2);}}
    else{const b=box(w,.8,d,mm,{s:.8,ox:0,oy:0,oz:0});put(root,b,off,y,zf-d/2);}}
  bx(root,2.6,.8,-TE-2,st,0,3.6,(TE-2)/2);bx(root,2.4,.04,-TE,vm('dirt'),0,.02,TE/2);
  for(const s of[-1,1]){bx(root,1.6,3.2,2.2,st,s*2,1.6,-1.1);bx(root,1.2,2.4,1.6,ore,s*3.3,1.2,-1.2);bx(root,1,1.6,1.2,st,s*4.4,.8,-1.4);bx(root,.8,.8,.8,st,s*3,.4,.3);bx(root,.6,.4,.6,st,s*3.7,.2,.5);}
  bx(root,5.2,1,2.4,st,0,3.7,-1.1);bx(root,4.4,.5,1.2,gt,0,4.45,-1.5);bx(root,.8,.6,.8,ore,-1.2,4.4,-.8);bx(root,.8,.6,.8,st,1.4,4.4,-.9);
  bx(root,2.4,3.2,.1,vm('dark'),0,1.6,TE-.05);bx(root,2.4,.1,-TE,vm('dark'),0,3.15,TE/2);
  for(const zz of[-.15,-1.35,-2.55,-3.75,-4.95]){for(const s of[-1,1])vlog(root,.28,2.7,.28,'y',s*1.05,1.35,zz);vlog(root,2.5,.3,.3,'x',0,2.85,zz);for(const s of[-1,1])bx(root,.1,.5,.1,vm('planksDark'),s*.75,2.55,zz,0,0,s*.7);}
  bx(root,.12,.24,.12,vm('iron'),0,2.62,-3.15);const ml=new THREE.Mesh(new THREE.BoxGeometry(.16,.2,.16),VFLAME);ml.position.set(0,2.45,-3.15);root.add(ml);const mlp=new THREE.PointLight(0xffb060,0,6,2);mlp.position.set(0,2.2,-.8);mlp.userData.lamp=true;mlp.userData.min=.6;root.add(mlp);L.push(mlp);
  for(let z=TE+.3;z<6;z+=.5)bx(root,1.3,.08,.22,vm('planksDark'),0,.04,z);for(const s of[-1,1])bx(root,.07,.08,6-TE-.3,vm('iron'),s*.45,.12,(6+TE+.3)/2);
  const cart=new THREE.Group();put(root,cart,0,.16,3.4);bx(cart,1,.62,1.3,vm('iron'),0,.45,0);bx(cart,.86,.1,1.16,vm('dark'),0,.72,0);for(let i=0;i<6;i++)bx(cart,.26,.22,.26,ore,-.25+(i%3)*.25,.8+(i>2?.12:0),-.3+(i>2?.4:0));
  for(const[a,b]of[[1,1],[1,-1],[-1,1],[-1,-1]])bx(cart,.08,.22,.22,vm('dark'),a*.48,.12,b*.42);
  for(let r=0;r<3;r++)for(let c=0;c<3-r;c++)bx(root,.4,.4,.4,ore,2.4+(c-(2-r)/2)*.42,.2+r*.4,2.6);for(let i=0;i<4;i++)bx(root,.3,.3,.3,vm('coal'),-2.6+(i%2)*.32,.15+Math.floor(i/2)*.3,3);
  vlog(root,.2,2.4,.2,'y',-1.9,1.2,1.2);vLantern(root,L,-1.9,2.3,1.1);put(root,TOOLS.Pickaxe.build(),1.9,.06,1,0,.5,Math.PI/2);
  const sh=new THREE.Group();put(root,sh,-3.6,0,4.2);for(const[a,b]of[[1,1],[1,-1],[-1,1],[-1,-1]])vlog(sh,.18,2,.18,'y',a*.9,1,b*.7);bx(sh,2.2,.16,1.8,vm('planksDark'),0,2.05,0,.12,0,0);vCrate(sh,.6,-.4,0,-.2,.2);vBarrel(sh,.4,.1);
  vCrate(root,.5,3.4,0,4.4,.4);root.userData.ground=10;return root;}

/* ---------- Mint ---------- */
function vxMint(){const root=new THREE.Group(),L=[];root.userData.lights=L;const Lx=7,Dz=5,pl=.4,hw=3.2,H=2.6,sb=vm('stoneBrick'),cb=vm('cobble');
  vYard(root,12,9,0,1.4);bx(root,Lx+.3,pl,Dz+.3,cb,0,pl/2,0);
  const win=x=>({x,w:.7,y0:1,y1:1.9,sill:cb,lintel:cb});
  const W=vWalls({Lx,Dz,y:pl,h:hw,t:.5,mat:sb,ops:{front:[{type:'door',x:0,w:1.2,y0:0,y1:2.3,lintel:cb},win(-2.2),win(2.2)],back:[win(-1.6),win(1.6)],right:[],left:[win(0)]}});root.add(W.group);
  for(const[k,xs]of[['front',[-2.2,2.2]],['back',[-1.6,1.6]],['left',[0]]])for(const x of xs)for(let i=0;i<4;i++)bx(W.faces[k],.06,.9,.06,vm('iron'),x-.24+i*.16,1.45,.06);
  for(let i=0;i<5;i++)bx(W.faces.front,1.1,.08,.04,vm('iron'),0,.3+i*.45,-.18);for(let i=0;i<12;i++)bx(W.faces.front,.06,.06,.03,vm('iron'),-.4+(i%4)*.27,.55+Math.floor(i/4)*.7,-.17);
  for(let i=0,y=0;y<hw-.05;i++,y+=.4)for(const[sx,sz]of[[1,1],[1,-1],[-1,1],[-1,-1]]){const lx=i%2?.6:.4,lz=i%2?.4:.6;bx(root,lx,.4,lz,cb,sx*(Lx/2-lx/2+.02),pl+y+.2,sz*(Dz/2-lz/2+.02));}
  put(root,vRoof(Dz,Lx,H,vm('slate'),{ov:.6,ovL:.5,step:.37,gable:sb,gt:.5,ridge:cb}),0,pl+hw,0);
  // smelting furnace on the right gable
  const fx=Lx/2+.9;bx(root,1.8,2.2,2.4,sb,fx,1.1,0);bx(root,1.2,.6,1.8,sb,fx,2.5,0);bx(root,.9,pl+hw+H+1.2-2.8,.9,vm('brick'),fx,2.8+(pl+hw+H+1.2-2.8)/2,0);bx(root,1.1,.16,1.1,cb,fx,pl+hw+H+1.28,0);
  vMouth(root,fx,.5,1.2,.7,.7,true,L);
  vHangSign(W.faces.front,-1,hw-.3,0,ICONS.coin);vBanner(root,1.2,pl+hw-.15,Dz/2+.02,'woolBlue');
  // screw press, chests, ingots
  const pr=new THREE.Group();put(root,pr,-2.6,0,Dz/2+2.2);bx(pr,1.2,.5,.8,sb,0,.25,0);for(const s of[-1,1])bx(pr,.2,2.2,.2,vm('timber'),s*.5,1.1,0);bx(pr,1.4,.3,.3,vm('timber'),0,2.2,0);
  bx(pr,.14,.9,.14,vm('iron'),0,1.6,0);bx(pr,1.6,.08,.08,vm('iron'),0,1.95,0,0,.6,0);bx(pr,.3,.14,.3,vm('iron'),0,1.1,0);bx(pr,.2,.06,.2,vm('gold'),0,.53,0);
  vChest(root,1.8,Dz/2+1.4,-.3,true);vChest(root,2.8,Dz/2+1.8,.2);vChest(root,2.4,Dz/2+2.6,-.1);
  for(let r=0;r<3;r++)for(let c=0;c<4-r;c++)bx(root,.32,.12,.16,vm('gold'),-1+(c-(3-r)/2)*.34,.06+r*.12,Dz/2+1.2+(r%2)*.05);
  for(let i=0;i<4;i++)bx(root,.3,.3,.3,vm('ore'),fx-.8+(i%2)*.35,.15+Math.floor(i/2)*.3,2.2);vBarrel(root,fx+.5,2,true);
  vLantern(root,L,-.9,pl+2.6,Dz/2);vLantern(root,L,.9,pl+2.6,Dz/2);root.userData.ground=10;return root;}

/* ---------- Fishery ---------- */
function vxFishery(){const root=new THREE.Group(),L=[];root.userData.lights=L;
  vWaterArea(root,16,8,0,-5.4);vLand(root,16,8.4,0,3.2);bx(root,16,.4,.6,vm('sand'),0,.2,-1.2).userData.noFrame=true;
  const G=new THREE.Group();G.position.y=.4;root.add(G);const Lx=4.4,Dz=3.4,hw=2.4;
  put(G,vYard(new THREE.Group(),7,5,0,0),0,0,3);
  const hut=new THREE.Group();put(G,hut,1.2,0,3.4);hut.add(vWalls({Lx,Dz,y:0,h:hw,t:.2,mat:vm('planksV'),ops:{front:[{type:'door',x:-.8,w:.9,y0:0,y1:1.9},{x:1,w:.7,y0:.9,y1:1.5}],back:[{x:0,w:.6,y0:.9,y1:1.5}],right:[],left:[{x:0,w:.6,y0:.9,y1:1.5}]},frame:vm('planksDark')}).group);
  for(const[a,b]of[[1,1],[1,-1],[-1,1],[-1,-1]])vlog(hut,.3,hw,.3,'y',a*Lx/2,hw/2,b*Dz/2);
  put(hut,vRoof(Dz,Lx,1.8,vm('shingle'),{ov:.6,ovL:.5,step:.36,gable:vm('planksV'),ridge:vm('planksDark')}),0,hw,0);bx(hut,.6,hw+2.6,.6,vm('cobble'),Lx/2+.3,(hw+2.6)/2,-.6);
  vLantern(hut,L,0,1.9,Dz/2);
  // drying racks with fish, net frame, barrels
  for(const rx of[-4.6,-2.6]){const r=new THREE.Group();put(G,r,rx,0,1.6);for(const s of[-1,1])vlog(r,.14,1.9,.14,'y',s*.8,.95,0);bx(r,1.8,.1,.1,vm('planksDark'),0,1.8,0);bx(r,1.8,.08,.08,vm('planksDark'),0,1.3,0);
    for(let i=0;i<6;i++){vFish(r,-.6+i*.24,1.55,0,i*.4);vFish(r,-.6+i*.24+.12,1.05,0,-i*.3);}}
  const nt=new THREE.Group();put(G,nt,-3.6,0,3.8);for(const s of[-1,1])vlog(nt,.16,2.2,.16,'y',s*1.1,1.1,0);bx(nt,2.4,.1,.1,vm('planksDark'),0,2.1,0);
  for(let i=0;i<8;i++)bx(nt,.03,1.6,.03,vm('rope'),-.9+i*.26,1.25,0);for(let j=0;j<7;j++)bx(nt,1.9,.03,.03,vm('rope'),0,.5+j*.25,0);for(let i=0;i<4;i++)bx(nt,.1,.1,.1,vm('woolRed'),-.8+i*.55,.42,0);
  for(const[x,z]of[[3.9,1.6],[4.5,2.1]]){const b=vBarrel(G,x,z);for(let i=0;i<3;i++)vFish(b,-.12+i*.12,.86,0,Math.PI/2+i);b.children.slice(-3).forEach(f=>f.rotation.x=Math.PI/2);}
  vCrate(G,.5,4.6,0,1.2,.2);
  // jetty and boats
  const jx=-1.8;bx(root,1.4,.12,4.6,vm('planks'),jx,.62,-3.2);for(const z of[-1.4,-3.2,-5.2])for(const s of[-1,1])vlog(root,.22,.9,.22,'y',jx+s*.6,.25,z);
  for(const s of[-1,1])bx(root,.1,.12,4.6,vm('planksDark'),jx+s*.68,.7,-3.2);vlog(root,.24,.5,.24,'y',jx+.6,.9,-5.3);
  vBoat(root,jx+1.6,.1,-4,-.1,3.2);{const ub=vBoat(G,5.6,.78,.2,1.2,3,false);ub.rotation.z=Math.PI;}
  root.userData.ground=10;return root;}

/* ---------- Dock ---------- */
function vxDock(sd,o={}){const root=new THREE.Group(),L=[];root.userData.lights=L;const dy=.7;
  vWaterArea(root,18,12,0,-4);vLand(root,18,9.6,0,6.8);bx(root,18,.4,.6,vm('stoneBrick'),0,.2,1.9).userData.noFrame=true;
  const pier=(x0,x1,z0,z1)=>{const w=x1-x0,d=z0-z1;bx(root,w,.14,d,vm('planks'),(x0+x1)/2,dy,(z0+z1)/2);for(let z=z0-.3;z>z1;z-=2)for(const x of[x0+.2,x1-.2])vlog(root,.28,dy+.2,.28,'y',x,(dy+.2)/2-.05,z);};
  pier(-2,2,2.2,-6.2);pier(-5,5,-6,-8.4);for(const s of[-1,1])bx(root,.12,.16,8.4,vm('planksDark'),s*2.04,dy-.05,-2);bx(root,10.1,.16,.12,vm('planksDark'),0,dy-.05,-8.44);
  for(const[x,z]of[[-1.8,-1],[1.8,-3],[-1.8,-5],[-4.8,-8.2],[4.8,-8.2],[1.8,1]]){vlog(root,.24,.45,.24,'y',x,dy+.28,z);bx(root,.3,.06,.3,vm('planksDark'),x,dy+.5,z);}
  // crane
  const cr=new THREE.Group();put(root,cr,3.6,dy,-7.2);vlog(cr,.4,4.6,.4,'y',0,2.3,0);for(const s of[-1,1])bx(cr,.12,2,.12,vm('planksDark'),s*.6,.9,0,0,0,s*.4);
  bx(cr,.24,.24,4.2,vm('timber'),0,4.2,-1.4,-.25,0,0);bx(cr,.04,2.2,.04,vm('rope'),0,3.2,-3.3);bx(cr,.12,.2,.06,vm('iron'),0,2.1,-3.3);bx(cr,.6,.6,.6,vm('crate'),0,1.75,-3.3);bx(cr,.4,.2,.4,vm('planks'),0,4.6,0);
  // cargo
  for(const[x,z,s,y]of[[-1.2,-6.8,.6,0],[-1.2,-6.8,.45,.6],[-.5,-7.4,.6,0],[-3.6,-7.2,.6,0]])vCrate(root,s,x,dy+.07+y,z,x);
  for(const[x,z]of[[1.2,-2],[1.2,-2.7],[1.2,-3.4]])vBarrel(root,x,z).position.y=dy+.07;const tb=vBarrel(root,1.2,-2.35);tb.position.y=dy+.87;
  for(let i=0;i<4;i++)vSack(root,-1.3+(i%2)*.4,-.6-Math.floor(i/2)*.4,dy+.07);
  for(const x of[-4.6,4.6]){vlog(root,.2,2.2,.2,'y',x,dy+1.1,-8.2);vLantern(root,L,x,dy+2,-8.35);}
  const ld=new THREE.Group();put(root,ld,-2.15,0,-3.4);for(const s of[-1,1])bx(ld,.06,1.2,.06,vm('planksDark'),0,.3,s*.25);for(let i=0;i<4;i++)bx(ld,.06,.06,.5,vm('planks'),0,.05+i*.25,0);
  vBoat(root,-3.2,.1,-2.4,0,3.2);vBoat(root,3.2,.1,-4.4,.15,3);{const G=new THREE.Group();G.position.y=.4;root.add(G);const Lx=6,Dz=3.6,hw=2.8;
    const wh=new THREE.Group();put(G,wh,0,0,6.2,0,Math.PI,0);
    wh.add(vWalls({Lx,Dz,y:0,h:hw,t:.2,mat:vm('planksV'),ops:{front:[{type:'door',x:0,w:1.8,y0:0,y1:2.4,leaf:'planks',open:1.3},{x:-2.1,w:.7,y0:1,y1:1.7},{x:2.1,w:.7,y0:1,y1:1.7}],back:[{type:'door',x:1.6,w:1,y0:0,y1:2.1}],right:[{x:0,w:.7,y0:1,y1:1.7}],left:[{x:0,w:.7,y0:1,y1:1.7}]},frame:vm('timber')}).group);
    for(const[a,b]of[[1,1],[1,-1],[-1,1],[-1,-1]])vlog(wh,.3,hw,.3,'y',a*Lx/2,hw/2,b*Dz/2);put(wh,vRoof(Dz,Lx,2,vm('shingle'),{ov:.6,ovL:.5,step:.4,gable:vm('planksV'),ridge:vm('planksDark')}),0,hw,0);
    bx(wh,1.4,.2,.2,vm('timber'),0,hw+.9,Dz/2+.5);bx(wh,.04,1,.04,vm('rope'),0,hw+.3,Dz/2+1.3);bx(wh,.1,.1,1.4,vm('timber'),0,hw+.9,Dz/2+.7);
    vLantern(wh,L,-1.2,2.3,Dz/2);
    bx(G,14,.06,7.4,vm('planks'),0,.03,5.95);for(const[w,d,x,z]of[[14.6,.3,0,2.1],[14.6,.3,0,9.8],[.3,7.4,-7.15,5.95],[.3,7.4,7.15,5.95]])bx(G,w,.16,d,vm('stoneBrick'),x,.08,z);
    const lvl=Math.max(0,Math.min(4,o.stock??4)),take=(arr)=>arr.slice(0,Math.round(arr.length*lvl/4));
    const sp=new THREE.Group();put(G,sp,4.4,.06,4.6);bx(sp,3.8,.04,2.2,vm('planksDark'),0,.02,0);const cr=[];for(let r=0;r<3;r++)for(let c=0;c<4-r;c++)for(let d=0;d<2;d++)cr.push([(c-(3-r)/2)*.62,r*.6,d*.62-.3]);take(cr).forEach(([x,y,z])=>vCrate(sp,.6,x,y+.04,z,0));
    const sp3=new THREE.Group();put(G,sp3,4.4,.06,7.6);bx(sp3,3.8,.04,1.6,vm('planksDark'),0,.02,0);const br=[];for(let i=0;i<6;i++)br.push([-1.5+(i%6)*.62,0]);for(let i=0;i<4;i++)br.push([-1.2+i*.62,.8]);take(br).forEach(([x,y])=>{const b=vBarrel(sp3,x,0);b.position.y=y+.04;});
    const sp2=new THREE.Group();put(G,sp2,-4.4,.06,4.6);bx(sp2,3.8,.04,2.2,vm('planksDark'),0,.02,0);const sk=[];for(let r=0;r<3;r++)for(let c=0;c<6-r;c++)sk.push([-1.3+c*.44+r*.22,r*.5,-.4]);for(let c=0;c<6;c++)sk.push([-1.3+c*.44,0,.4]);take(sk).forEach(([x,y,z])=>vSack(sp2,x,z,y+.04));
    vCart(G,-8.6,8,.2,'sacks');}
  root.userData.ground=11;return root;}

/* ---------- Shipyard ---------- */
function vxShipyard(){const root=new THREE.Group(),L=[];root.userData.lights=L;
  vWaterArea(root,20,9,0,-6.4);vLand(root,20,9.2,0,2.6);
  const slope=-Math.atan(.6/12),ramp=new THREE.Group();put(root,ramp,0,.25,-1.6,slope,0,0);
  for(let z=-6;z<6;z+=.5)bx(ramp,4.4,.1,.46,vm('planksDark'),0,0,z);for(const s of[-1,1])bx(ramp,.3,.3,12,vm('timber'),s*1.5,.1,0);
  // ship under construction
  const ship=new THREE.Group();put(ramp,ship,0,.7,.4);for(let z=-4.2;z<4.4;z+=.6)bx(ship,.5,.6,.5,vm('timber'),0,-.4,z);
  vlog(ship,.32,.32,9.4,'z',0,0,0);vlog(ship,.3,3.2,.3,'y',0,1.6,-4.8);bx(ship,.3,.6,.3,vm('timber'),0,3.1,-5.1);vlog(ship,.3,3.4,.3,'y',0,1.7,4.6);
  for(let z=-3.6;z<=3.61;z+=.9){const w=1.7*(1-(z/5)**2);bx(ship,2*w*.6,.2,.2,vm('timber'),0,.2,z);for(const s of[-1,1]){bx(ship,.2,.8,.2,vm('timber'),s*w*.6,.6,z);bx(ship,.2,.8,.2,vm('timber'),s*w*.85,1.4,z);bx(ship,.2,.9,.2,vm('timber'),s*w,2.25,z);
      if(z>=-.5){for(const[y,f]of[[.5,.66],[.9,.72],[1.3,.86],[1.7,.9]])bx(ship,.12,.4,.92,vm('planks'),s*(w*f+.12),y,z);}}}
  for(const s of[-1,1])for(let z=-3.6;z<3.6;z+=.9){const w=1.7*(1-((z+.45)/5)**2);bx(ship,.14,.14,.9,vm('planksDark'),s*(w+.1),2.7,z+.45);}
  for(const s of[-1,1]){for(let z=-3.6;z<=3.6;z+=2.4)vlog(ship,.2,2.6,.2,'y',s*2.6,.8,z);bx(ship,.8,.1,8,vm('planks'),s*2.4,1.5,0);bx(ship,.08,.08,8,vm('planksDark'),s*2.8,2.1,0);}
  // shed, timber stacks, sawpit, sheer legs
  const sh=new THREE.Group();put(root,sh,6.4,.4,2.6);for(const[a,b]of[[1,1],[1,-1],[-1,1],[-1,-1]])vlog(sh,.24,2.6,.24,'y',a*1.8,1.3,b*1.3);put(sh,vRoof(2.6,3.6,1.2,vm('shingle'),{ov:.4,ovL:.3,step:.3}),0,2.6,0);
  bx(sh,2,.1,.8,vm('planks'),0,.85,-.6);for(const s of[-1,1])bx(sh,.1,.8,.6,vm('planksDark'),s*.9,.4,-.6);put(sh,TOOLS.Hammer.build(),.3,.95,-.6,0,.4,Math.PI/2);put(sh,TOOLS.Axe.build(),-.5,.95,-.5,0,-.3,Math.PI/2);
  vWoodpile(sh,6,3,0,.6,0);
  const ts=new THREE.Group();put(root,ts,-6.6,.4,3);for(let r=0;r<3;r++)for(let c=0;c<4-r;c++)vlog(ts,.4,.4,4,'z',(c-(3-r)/2)*.42,.2+r*.38,0);for(let i=0;i<6;i++)bx(ts,1.6,.08,.3,vm('planks'),2.2,.04+i*.08,(i%2-.5)*.3);
  const sp=new THREE.Group();put(root,sp,-4.4,.4,5.4);bx(sp,2.6,.04,1,vm('dark'),0,.02,0);for(const s of[-1,1])bx(sp,.2,.6,1.2,vm('planksDark'),s*.9,.3,0);vlog(sp,3,.36,.36,'x',0,.78,0);bx(sp,.04,1.4,.3,vm('iron'),.4,.8,.0);bx(sp,.5,.06,.06,vm('planks'),.4,1.5,0);
  const sl=new THREE.Group();put(root,sl,3.2,.4,-1.4);for(const a of[0,2.1,4.2]){const g=new THREE.Group();put(sl,g,0,0,0,0,a,0);bx(g,.16,4.6,.16,vm('timber'),0,2.2,.9,-.2,0,0);}bx(sl,.04,1.8,.04,vm('rope'),0,3.2,0);bx(sl,.14,.14,1.6,vm('timber'),0,2.2,0,.3,0,0);
  vLantern(root,L,-2.4,2.6,1.2);vlog(root,.2,2.6,.2,'y',-2.4,1.7,1.35);vBoat(root,-7,.1,-4.4,.6,3);root.userData.ground=11;return root;}

[['vx-well','Well',vxWell,'Round cobble well with water inside, a crank and rope bucket under a little shingle roof, and a horse trough.',4],
 ['vx-farmhouse','Farmhouse',vxFarmhouse,'Long thatched farmhouse in the cottage style, with a large fenced plot of cabbages, carrots, wheat and tomatoes, hay and a hay cart.',11],
 ['vx-mine','Mine',vxMine,'Timber-framed adit cut into a stepped stone and ore hill, with rails, a loaded minecart, ore and coal piles, a pickaxe and a tool shed.',10],
 ['vx-mint','Mint',vxMint,'Fortified stone mint with barred windows and an iron-strapped door, a glowing smelting furnace on the gable, a screw coin press, chests of coins and stacked gold ingots.',10],
 ['vx-fishery','Fishery',vxFishery,'Fisherman\'s plank hut on the shore with fish drying on racks, a net frame with floats, barrels of catch, a small jetty, a rowboat and an upturned boat.',10],
 ['vx-dock','Dock',vxDock,'T-shaped pier on log piles over moving water with a cargo crane and moored rowboats; a plank warehouse on a planked yard with stone kerbs, stockpiles of crates, barrels and sacks that can be set from empty to full, and a cart off to the side.',11],
 ['vx-shipyard','Shipyard',vxShipyard,'Slipway into the water with a ship half-built on its stocks, ribs, keel and partial planking inside scaffolding; sheer legs, sawpit, timber stacks and a tool shed.',11],
].forEach(([id,name,build,desc,g])=>ASSETS.push({id,folder:'buildings/medieval',name,build,desc,groundR:g||undefined}));
