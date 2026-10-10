/* ======================= batch 2: military, crafts, food ======================= */
VXD.sailCloth=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,'#c4b89c',(x%8===0?.88:1)*nz(r,.92,1.04));};
function vDisc(par,cx,cz,r,y,h,mat,c=.4){for(let x=-r+c/2;x<r;x+=c){const hz=Math.round(Math.sqrt(Math.max(0,r*r-x*x))/c)*c;if(hz>0)bx(par,c,h,2*hz,mat,cx+x,y+h/2,cz);}}
function vDome(par,cx,cz,r,y,n,mat,step=.4){for(let i=0;i<n;i++){const k=i/n,rr=r*Math.sqrt(1-k*k);if(rr>.2)vDisc(par,cx,cz,rr,y+i*step,step,mat);}}
ICONS.bow=(g,x,y,z)=>{for(const s of[-1,1]){bx(g,.04,.12,.05,vm('planks'),x*s,y+.18,z-.06);bx(g,.04,.14,.05,vm('planks'),x*s,y,z-.1);bx(g,.04,.12,.05,vm('planks'),x*s,y-.18,z-.06);bx(g,.04,.46,.015,vm('woolWhite'),x*s,y,z+.04);bx(g,.04,.03,.3,vm('planksDark'),x*s,y,z);}};
ICONS.bread=(g,x,y,z)=>{for(const s of[-1,1]){bx(g,.04,.16,.4,vm('gold'),x*s,y,z);bx(g,.04,.1,.3,vm('gold'),x*s,y+.1,z);for(const k of[-.1,0,.1])bx(g,.045,.12,.03,vm('hay'),x*s,y+.04,z+k);}};
ICONS.shoe=(g,x,y,z)=>{for(const s of[-1,1]){bx(g,.04,.3,.07,vm('iron'),x*s,y,z-.12);bx(g,.04,.3,.07,vm('iron'),x*s,y,z+.12);bx(g,.04,.07,.31,vm('iron'),x*s,y-.12,z);}};
function vMouth(par,x,y,z,w,h,glow,L){const g=new THREE.Group();put(par,g,x,y,z);for(const s of[-1,1])bx(g,.2,h+.3,.4,vm('stoneBrick'),s*(w/2+.1),(h+.3)/2,0);bx(g,w+.4,.3,.4,vm('stoneBrick'),0,h+.15,0);bx(g,w,.08,.4,vm('stoneBrick'),0,.04,0);bx(g,w,h,.06,vm('dark'),0,h/2,-.2);
  if(glow){const e=new THREE.Mesh(new THREE.BoxGeometry(w*.9,h*.3,.3),EMBER);e.position.set(0,h*.15+.08,-.02);g.add(e);for(const[fx,s]of[[-.1,.35],[.12,.25]]){const f=new THREE.Mesh(new THREE.BoxGeometry(w*s,h*s*1.2,w*s),FIRE);f.position.set(fx*w,h*.3+h*s*.6,-.05);g.add(f);}
    e.onBeforeRender=()=>{const t=performance.now()/1000;EMBER.emissiveIntensity=2.1+.45*Math.sin(t*5.3)+.25*Math.sin(t*12.7);};
    const pl=new THREE.PointLight(0xff6a24,0,6,2);pl.position.set(0,h*.5,.8);pl.userData.lamp=true;pl.userData.min=1;g.add(pl);L.push(pl);}return g;}
function vDummy(par,x,z,ry=0){const g=new THREE.Group();put(par,g,x,0,z,0,ry,0);vlog(g,.2,1.7,.2,'y',0,.85,0);bx(g,1,.12,.12,vm('planksDark'),0,1.35,0);bx(g,.5,.62,.32,vm('hay'),0,1.15,0);bx(g,.32,.32,.32,vm('burlap'),0,1.68,0);bx(g,.08,.08,.02,vm('dark'),-.07,1.72,.17);bx(g,.08,.08,.02,vm('dark'),.07,1.72,.17);bx(g,.42,.42,.06,vm('woolRed'),.5,1.2,.08);bx(g,.12,.12,.04,vm('gold'),.5,1.2,.12);bx(g,.6,.08,.6,vm('planksDark'),0,.04,0);return g;}
function vWeaponRack(par,x,z,ry=0){const g=new THREE.Group();put(par,g,x,0,z,0,ry,0);bx(g,2,.12,.4,vm('planksDark'),0,.06,0);for(const s of[-1,1])bx(g,.12,1.9,.12,vm('planksDark'),s*.95,.95,0);bx(g,2,.1,.12,vm('planksDark'),0,1.85,0);bx(g,2,.1,.3,vm('planks'),0,.9,0);
  for(let i=0;i<4;i++){const px=-.7+i*.32;bx(g,.05,2.1,.05,vm('planks'),px,1.05,.12);bx(g,.08,.22,.03,vm('iron'),px,2.2,.12);}
  for(let i=0;i<3;i++){const px=.45+i*.2;bx(g,.06,.75,.02,vm('iron'),px,1.4,-.08);bx(g,.2,.04,.04,vm('gold'),px,1.0,-.08);bx(g,.04,.18,.04,vm('planksDark'),px,.88,-.08);}return g;}
function vShieldRack(par,x,z,ry=0){const g=new THREE.Group();put(par,g,x,0,z,0,ry,0);for(const s of[-1,1])bx(g,.1,1.3,.1,vm('planksDark'),s*.9,.65,0);bx(g,1.9,.1,.1,vm('planksDark'),0,1.2,0);
  ['woolRed','woolBlue','woolRed'].forEach((c,i)=>{bx(g,.5,.6,.06,vm(c),-.6+i*.6,.85,.06);bx(g,.16,.16,.07,vm('gold'),-.6+i*.6,.85,.07);});return g;}

/* ---------- Barracks ---------- */
function vxBarracks(){const root=new THREE.Group(),L=[];root.userData.lights=L;const Lx=12,Dz=6,pl=.4,hw=3.2,H=2.6,sb=vm('stoneBrick'),cb=vm('cobble');
  vYard(root,16,14,0,2.4);bx(root,Lx+.3,pl,Dz+.3,cb,0,pl/2,0);
  const win=x=>({x,w:.6,y0:.9,y1:1.8,sill:cb,lintel:cb});
  root.add(vWalls({Lx,Dz,y:pl,h:hw,t:.4,mat:sb,ops:{front:[{type:'door',x:0,w:1.6,y0:0,y1:2.4,lintel:cb},...[-4.4,-2.4,2.4,4.4].map(win)],back:[-4.4,-2.2,0,2.2,4.4].map(win),right:[win(0)],left:[win(0)]}}).group);
  for(let i=0,y=0;y<hw-.05;i++,y+=.4)for(const[sx,sz]of[[1,1],[1,-1],[-1,1],[-1,-1]]){const lx=i%2?.6:.4,lz=i%2?.4:.6;bx(root,lx,.4,lz,cb,sx*(Lx/2-lx/2+.02),pl+y+.2,sz*(Dz/2-lz/2+.02));}
  put(root,vRoof(Dz,Lx,H,vm('slate'),{ov:.6,ovL:.5,step:.37,gable:sb,gt:.4,ridge:cb}),0,pl+hw,0);
  for(const s of[-1,1]){bx(root,.8,hw+H+.8,1,sb,s*(Lx/2-.4),pl+(hw+H+.8)/2,0);bx(root,1,.16,1.2,cb,s*(Lx/2-.4),pl+hw+H+.88,0);vBanner(root,s*1.3,pl+hw-.15,Dz/2+.02,s<0?'woolRed':'woolBlue');}
  for(let i=0;i<3;i++)bx(root,2.4-i*.4,.2,.5,sb,0,.1+i*.2,Dz/2+1-i*.35);
  vLantern(root,L,-1.1,pl+2.6,Dz/2);vLantern(root,L,1.1,pl+2.6,Dz/2);
  const yz=Dz/2+3.6;for(let i=0;i<3;i++)vDummy(root,-3.2+i*1.8,yz+1.4,(i-1)*.2);
  vWeaponRack(root,4,yz,-.4);vShieldRack(root,4.4,yz+2.2,-.6);vWeaponRack(root,-5.6,yz-.4,.5);
  vBarrel(root,-6.5,Dz/2+.8);vBarrel(root,-6.5,Dz/2+1.5,true);vCrate(root,.6,6.4,0,Dz/2+.8,.2);vCrate(root,.5,6.4,.6,Dz/2+.8,.5);
  vFence(root,8,0,yz+3.2);vFence(root,3.2,-4,yz+1.6,Math.PI/2);vFence(root,3.2,4,yz+1.6+.0,Math.PI/2);root.userData.ground=11;return root;}

/* ---------- Stable ---------- */
function vxStable(){const root=new THREE.Group(),L=[];root.userData.lights=L;const Lx=9.2,Dz=5,pl=.3,hw=2.8,H=2.4,t=.2;
  vYard(root,14,11,0,1.6);bx(root,Lx+.2,pl,Dz+.2,vm('cobble'),0,pl/2,0);
  const stalls=[-3.45,-1.15,1.15,3.45];
  const W=vWalls({Lx,Dz,y:pl,h:hw,t,mat:vm('planksV'),ops:{front:stalls.map(x=>({type:'hole',x,w:1.7,y0:0,y1:2.3})),back:[-2.3,2.3].map(x=>({x,w:.6,y0:1.4,y1:1.9})),right:[],left:[{type:'door',x:0,w:1.2,y0:0,y1:2.2}]}});root.add(W.group);const F=W.faces.front;
  for(const x of[-Lx/2+.15,-2.3,0,2.3,Lx/2-.15])vlog(F,.3,hw,.3,'y',x,hw/2,.1);bx(F,Lx,.25,.3,vm('timber'),0,hw-.1,.1);
  stalls.forEach((x,i)=>{bx(F,1.7,2.3,.04,vm('dark'),x,1.15,-1.2);bx(F,.1,2.3,1.2,vm('planksDark'),x-.9,1.15,-.6)&&null;
    const d=new THREE.Group();put(F,d,x-.85,0,-.05);if(i===2)d.rotation.y=-1.3;bx(d,1.7,1.2,.1,vm('planksV'),.85,.6,0);bx(d,1.6,.1,.04,vm('planksDark'),.85,1.15,.07);bx(d,1.5,.12,.04,vm('planksDark'),.85,.6,.07,0,0,.55);for(const y of[.25,.95])bx(d,.3,.05,.03,vm('iron'),.15,y,.07);
    bx(F,1.3,.3,.4,vm('planks'),x,1,-1);bx(F,1.1,.16,.3,vm('hay'),x,1.2,-1);bx(F,.3,.3,.3,vm('hay'),x+.4,.15,-.8);});
  put(root,vRoof(Dz,Lx,H,vm('shingle'),{ov:.9,ovL:.6,step:.4,gable:vm('planksV'),ridge:vm('planksDark')}),0,pl+hw,0);
  const R_=W.faces.right;bx(R_,1.2,1.2,.04,vm('dark'),0,hw+.75,.04);const ld=new THREE.Group();put(R_,ld,-.6,hw+.15,.08);ld.rotation.y=-1.6;bx(ld,1.2,1.2,.08,vm('planksV'),.6,.6,0);bx(R_,.8,.3,.4,vm('hay'),0,hw+.3,.1);
  bx(R_,.2,.2,1.6,vm('timber'),0,hw+1.6,.7);bx(R_,.04,1.3,.04,vm('planks'),0,hw+.95,1.4);
  const sg=new THREE.Group();put(root,sg,0,pl+hw+.15,Dz/2+.25);bx(sg,1,.5,.08,vm('planks'),0,0,0);for(const s of[-1,1])bx(sg,.07,.3,.04,vm('iron'),s*.12,.02,.06);bx(sg,.31,.07,.04,vm('iron'),0,-.12,.06);
  const tr=new THREE.Group();put(root,tr,-2.3,0,Dz/2+1.6);bx(tr,2,.5,.6,vm('planksDark'),0,.25,0);bx(tr,1.8,.04,.4,vm('water'),0,.48,0);
  for(const[x,z]of[[3.4,Dz/2+1.6],[4.2,Dz/2+1.6],[3.8,Dz/2+2.4]])vHay(root,x,0,z);vHay(root,3.8,.8,Dz/2+1.9);
  const sr=new THREE.Group();put(root,sr,.8,0,Dz/2+2.6);for(const s of[-1,1])bx(sr,.12,1.1,.12,vm('planksDark'),s*.7,.55,0);bx(sr,1.6,.1,.14,vm('planksDark'),0,1.1,0);bx(sr,.6,.22,.5,vm('barrel'),0,1.24,0);bx(sr,.7,.06,.6,vm('woolRed'),0,1.12,0);bx(sr,.04,.4,.04,vm('iron'),.32,.85,.2);
  vLantern(root,L,0,pl+2.5,Dz/2+.15);vBarrel(root,Lx/2+.4,Dz/2+.3,true);
  {const sb=new THREE.Group();while(root.children.length)sb.add(root.children[0]);sb.position.set(4.5,0,-2.4);root.add(sb);}
  {const x0=4.5-Lx/2-1.2,x1=x0-11,z0=-6.4,z1=7,seg=(a,b,c,d)=>{const len=Math.hypot(b-a,d-c),n=Math.ceil(len/3.2);for(let i=0;i<n;i++){const t0=i/n,t1=(i+1)/n;vFence(root,len/n,a+(b-a)*(t0+t1)/2,c+(d-c)*(t0+t1)/2,Math.abs(b-a)>.01?0:Math.PI/2);}};
   seg(x1,x0,z0,z0);seg(x1,x0,z1,z1);seg(x1,x1,z0,z1);seg(x0,x0,z0,3.8);seg(x0,x0,6.4,z1);
   const gt=new THREE.Group();put(root,gt,x0,0,3.8,0,-1.1,0);for(const y of[.35,.7,1])bx(gt,.08,.1,2.6,vm('planks'),0,y,1.3);bx(gt,.08,.12,2.8,vm('planksDark'),0,.68,1.3,.4,0,0);bx(gt,.1,1.1,.1,vm('planksDark'),0,.55,2.55);
   const tr2=new THREE.Group();put(root,tr2,x1+1.2,0,0,0,Math.PI/2,0);bx(tr2,2,.5,.6,vm('planksDark'),0,.25,0);bx(tr2,1.8,.04,.4,vm('water'),0,.48,0);
   const hr=new THREE.Group();put(root,hr,(x0+x1)/2,0,z0+.8);for(const s of[-1,1])bx(hr,.1,1,.1,vm('planksDark'),s*.8,.5,0);bx(hr,1.7,.45,.5,vm('hay'),0,.95,0);}
  root.userData.ground=19;return root;}

/* ---------- Archery range ---------- */
function vxArchery(){const root=new THREE.Group(),L=[];root.userData.lights=L;const lanes=[-2.6,0,2.6],tz=-5.5,sz=4.2;
  vYard(root,12,19.6,0,2.4);
  for(const x of lanes){const t=new THREE.Group();put(root,t,x,0,tz);vHay(t,-.4,0,0);vHay(t,.4,0,0);vHay(t,0,.8,0);bx(t,.12,1.6,.12,vm('planksDark'),-.5,.8,-.5,-.25,0,0);bx(t,.12,1.6,.12,vm('planksDark'),.5,.8,-.5,-.25,0,0);
    const f=[[.96,'woolWhite'],[.72,'woolRed'],[.48,'woolWhite'],[.24,'gold']];f.forEach(([s,c],i)=>bx(t,s,s,.04,vm(c),0,1.2,.42+i*.012));
    for(const[ax,ay]of[[.08,.06],[-.2,.18],[.25,-.15]]){const a=new THREE.Group();put(t,a,ax,1.2+ay,.47,(Math.random?0:0),ax*.4,0);bx(a,.03,.03,.55,vm('planks'),0,0,.27);bx(a,.1,.02,.12,vm('woolWhite'),0,0,.5);bx(a,.02,.1,.12,vm('woolWhite'),0,0,.5);}}
  for(const x of[-3.9,-1.3,1.3,3.9]){for(let z=-4.6;z<=3;z+=1.9)bx(root,.12,.8,.12,vm('planksDark'),x,.4,z);bx(root,.06,.06,7.8,vm('woolWhite'),x,.7,-.8);}
  for(const x of lanes)bx(root,1.4,.04,.12,vm('woolWhite'),x,.02,2.9);
  const sh=new THREE.Group();put(root,sh,0,0,sz);for(const x of[-3.8,-1.3,1.3,3.8])for(const z of[-.8,.8])vlog(sh,.2,2.5,.2,'y',x,1.25,z);
  put(sh,vRoof(2,8,1.1,vm('shingle'),{ov:.4,ovL:.3,step:.28}),0,2.5,0);bx(sh,7.6,.12,2,vm('planks'),0,.06,0);
  vBench(sh,-1.6,.5);vBench(sh,1.6,.5);
  const br=new THREE.Group();put(sh,br,2.6,0,.75);for(const s of[-1,1])bx(br,.1,1.4,.1,vm('planksDark'),s*.6,.7,0);bx(br,1.3,.08,.12,vm('planksDark'),0,1.3,0);bx(br,1.3,.08,.12,vm('planksDark'),0,.3,0);
  for(let i=0;i<3;i++){const bw=new THREE.Group();put(br,bw,-.4+i*.4,.8,.08);bx(bw,.05,.3,.05,vm('planks'),.04,.4,0);bx(bw,.05,.3,.05,vm('planks'),.04,-.4,0);bx(bw,.05,.3,.05,vm('planksDark'),0,0,0);bx(bw,.05,.12,.05,vm('planks'),.02,.2,0);bx(bw,.05,.12,.05,vm('planks'),.02,-.2,0);bx(bw,.01,1.06,.01,vm('woolWhite'),-.06,0,0);}
  for(const x of[-2.8,-.4]){const ab=vBarrel(sh,x,-.4);for(let i=0;i<7;i++){const ax=(i%3-1)*.13,az=(Math.floor(i/3)-1)*.12;bx(ab,.03,.5,.03,vm('planks'),ax,1,az);bx(ab,.06,.12,.06,vm('woolWhite'),ax,1.28,az);}}
  vLantern(root,L,-3.8,2.3,sz+.9);
  {const bz=sz+4.4,Lx=6,Dz=3.6,hw=2.6,b=new THREE.Group();put(root,b,0,0,bz);bx(b,Lx+.2,.3,Dz+.2,vm('cobble'),0,.15,0);
   const W=vWalls({Lx,Dz,y:.3,h:hw,t:.2,mat:vm('planksV'),ops:{front:[{type:'door',x:0,w:1.1,y0:0,y1:2.1},{x:-1.9,w:.8,y0:.9,y1:1.6},{x:1.9,w:.8,y0:.9,y1:1.6}],back:[{type:'door',x:1.6,w:1,y0:0,y1:2.1},{x:-1.4,w:.8,y0:.9,y1:1.6}],right:[{x:0,w:.7,y0:.9,y1:1.6}],left:[{x:0,w:.7,y0:.9,y1:1.6}]},frame:vm('timber')});b.add(W.group);
   put(b,vRoof(Dz,Lx,2.2,vm('shingle'),{ov:.7,ovL:.5,step:.37,gable:vm('planksV'),ridge:vm('planksDark')}),0,.3+hw,0);
   vHangSign(W.faces.front,Lx/2-.3,hw-.2,0,ICONS.bow);vLantern(W.faces.front,L,.9,2,0);vBarrel(b,-Lx/2-.4,Dz/2-.3);vHay(b,Lx/2+.6,0,.4);
   const tgt=new THREE.Group();put(b,tgt,Lx/2+.6,.8,.4);[[.6,'woolWhite'],[.44,'woolRed'],[.28,'woolWhite'],[.14,'gold']].forEach(([s,c],i)=>bx(tgt,s,s,.03,vm(c),0,.4,.41+i*.01));}
  root.userData.ground=14;return root;}

/* ---------- Charcoal kiln ---------- */
function vxCharcoalKiln(){const root=new THREE.Group(),L=[];root.userData.lights=L;const R=2.2;
  vYard(root,10,9,0,.6);vDisc(root,0,0,R+.4,0,.4,vm('stoneBrick'));vDome(root,0,0,R,.4,7,vm('brick'));
  vMouth(root,0,.4,R-.15,1,1,true,L);
  bx(root,.7,.6,.7,vm('stoneBrick'),0,3.1,0);bx(root,.4,.62,.4,vm('dark'),0,3.12,0);
  for(let i=0;i<6;i++){const a=i/6*Math.PI*2+.5;bx(root,.2,.2,.2,vm('dark'),Math.sin(a)*(R-.15),.7,Math.cos(a)*(R-.15));}
  for(const[x,z]of[[3.4,.6],[3.8,-1.2]])vWoodpile(root,7,5,x,z,Math.PI/2);
  const ch=new THREE.Group();put(root,ch,-3.4,0,1.2);for(let r=0;r<4;r++)for(let c=0;c<4-r;c++)for(let d=0;d<3-Math.floor(r/2);d++)bx(ch,.4,.4,.4,vm('coal'),(c-(3-r)/2)*.4,.2+r*.36,(d-1)*.4);
  for(const[x,z]of[[-2.6,2.8],[-3.1,3.1],[-2.2,3.3]]){vSack(root,x,z);bx(root,.3,.06,.26,vm('coal'),x,.53,z);}
  vBarrel(root,2.2,R+1,true);root.userData.ground=7.2;return root;}

/* ---------- Brick oven ---------- */
function vxBrickOven(){const root=new THREE.Group(),L=[];root.userData.lights=L;
  vYard(root,8,7,0,.4);bx(root,2.6,.9,2.6,vm('stoneBrick'),0,.45,0);vDome(root,0,-.1,1.15,.9,5,vm('brick'),.3);
  vMouth(root,0,.9,1.05,.6,.6,true,L);bx(root,.36,.8,.36,vm('brick'),0,1.9,.75);bx(root,.2,.82,.2,vm('dark'),0,1.92,.75);
  for(const[a,b]of[[1,1],[1,-1],[-1,1],[-1,-1]])vlog(root,.24,2.8,.24,'y',a*1.7,1.4,b*1.7);
  for(const s of[-1,1])bx(root,3.6,.2,.2,vm('timber'),0,2.7,s*1.7);put(root,vRoof(3.6,3.8,1.3,vm('shingle'),{ov:.4,ovL:.3,step:.33,ridge:vm('planksDark')}),0,2.8,0);
  const tb=new THREE.Group();put(root,tb,2.8,0,.3);bx(tb,1,.1,1.6,vm('planks'),0,.85,0);for(const[a,b]of[[1,1],[1,-1],[-1,1],[-1,-1]])bx(tb,.1,.8,.1,vm('planksDark'),a*.4,.4,b*.7);
  for(let i=0;i<5;i++)bx(tb,.26,.12,.16,vm('hay'),(i%2-.5)*.4,.96,-.6+i*.3);bx(tb,.4,.06,.3,vm('woolWhite'),0,.93,.55);
  const pe=new THREE.Group();put(root,pe,1.25,0,1.6,0,0,.25);bx(pe,.06,2,.06,vm('planks'),0,1.2,0);bx(pe,.4,.04,.36,vm('planks'),0,.12,0,Math.PI/2,0,0);
  vWoodpile(root,7,5,-2.8,.4,Math.PI/2);vSack(root,2.6,-1.4);vSack(root,3,-1.1);vBarrel(root,-1.8,2.2,true);root.userData.ground=6.4;return root;}

/* ---------- Windmill (tower mill, sails turn) ---------- */
function vxWindmill(){const root=new THREE.Group(),L=[];root.userData.lights=L;const H=8;
  vYard(root,11,10,0,1);vDisc(root,0,0,3,0,.8,vm('cobble'));
  for(let i=0;i<8;i++)vDisc(root,0,0,2.7-i*.09,.8+i*(H-.8)/8,(H-.8)/8+.01,i<3?vm('stoneBrick'):vm('planks'));
  vDisc(root,0,0,2.2,H,.24,vm('timber'));for(let i=0;i<5;i++)vDisc(root,0,0,2.3*Math.sqrt(1-(i/5)**2)+.05,H+.24+i*.36,.36,vm('shingle'));
  bx(root,1.3,2.2,.3,vm('stoneBrick'),0,1.9,2.62);bx(root,1,2,.1,vm('planksV'),0,1.8,2.78);for(const y of[1.2,2.4])bx(root,.9,.06,.04,vm('iron'),0,y,2.84);
  const tierR=y=>2.7-Math.min(7,Math.floor((y-.8)/((H-.8)/8)))*.09,surf=(r,side)=>{if(!side){let best=0;for(let x=-r+.2;x<r;x+=.4)if(Math.abs(x)<=.2+1e-6)best=Math.max(best,Math.round(Math.sqrt(Math.max(0,r*r-x*x))/.4)*.4);return best;}let mx=0;for(let x=-r+.2;x<r;x+=.4){const hz=Math.round(Math.sqrt(Math.max(0,r*r-x*x))/.4)*.4;if(hz>=.4)mx=Math.max(mx,Math.abs(x)+.2);}return mx;};
  for(const[a,y]of[[0,4.8],[Math.PI/2,3.6],[-Math.PI/2,5.4],[Math.PI,4.4],[0,6.6]]){const lo=Math.min(tierR(y),tierR(y+.8)),side=Math.abs(Math.sin(a))>.5,d=surf(lo,side);const w=new THREE.Group();put(root,w,Math.sin(a)*d,y,Math.cos(a)*d,0,a,0);bx(w,.84,1.04,.1,vm('planksDark'),0,.4,-.03);const wn=vWin(w,{x:0,w:.6,y0:0,y1:.8},.05,{});wn.position.z=.03;}
  vlog(root,.4,.4,1.6,'z',0,H+.9,2.2);bx(root,.3,.3,.3,vm('iron'),0,H+.9,3);
  const hub=new THREE.Group();hub.position.set(0,H+.9,3.1);hub.rotation.x=-.12;root.add(hub);const rot=new THREE.Group();hub.add(rot);
  bx(rot,.5,.5,.3,vm('planksDark'),0,0,0);
  for(let k=0;k<4;k++){const arm=new THREE.Group();arm.rotation.z=k*Math.PI/2+.3;rot.add(arm);bx(arm,.18,5.6,.15,vm('planksDark'),0,2.9,0);
    for(let j=0;j<10;j++)bx(arm,1.2,.06,.08,vm('planks'),.55,1+j*.5,-.02);bx(arm,.06,4.6,.08,vm('planks'),1.15,3.25,-.02);bx(arm,1.0,4.4,.03,vm('sailCloth'),.6,3.25,.06);}
  const spin=rot.children[0];spin.onBeforeRender=()=>{rot.rotation.z=-performance.now()/1000*.7;};
  for(let i=0;i<4;i++)vSack(root,1.4+(i%2)*.45,3.5+Math.floor(i/2)*.45);vCart(root,-3.4,2.8,.4,'sacks');
  const ms=new THREE.Group();put(root,ms,2.9,0,1.6,0,.6,0);bx(ms,.3,1.2,1.2,vm('stoneBrick'),0,.6,0);bx(ms,.32,.2,.2,vm('dark'),0,.6,0);
  vFence(root,4,-3.5,-1,Math.PI/2);root.userData.ground=10;return root;}

/* ---------- Bakery ---------- */
function vxBakery(){const root=new THREE.Group(),L=[];root.userData.lights=L;const Lx=6.4,Dz=4.8,base=.4,hw=2.6,H=2.6;
  vYard(root,11,8.4,-.6,.8);bx(root,Lx+.2,base,Dz+.2,vm('cobble'),0,base/2,0);
  const W=vWalls({Lx,Dz,y:base,h:hw,t:.2,mat:vm('plaster'),ops:{front:[{type:'hole',x:-1.1,w:2.2,y0:.9,y1:2.1},{type:'door',x:1.7,w:1,y0:0,y1:2.1}],back:[{x:-1,w:.8,y0:.9,y1:1.7},{type:'door',x:1.5,w:.9,y0:0,y1:2}],right:[{x:0,w:.8,y0:.9,y1:1.7}],left:[]},frame:vm('timber')});root.add(W.group);const F=W.faces.front;
  put(root,vRoof(Dz,Lx,H,vm('tiles'),{ov:.7,ovL:.6,step:.4,gable:vm('plaster'),ridge:vm('timber')}),0,base+hw,0);for(const s of[-1,1])bx(root,.1,.2,Dz,vm('timber'),s*(Lx/2+.04),base+hw+.1,0);
  bx(F,2.2,1.2,.04,vm('dark'),-1.1,1.5,-.17);bx(F,2.4,.1,.7,vm('planks'),-1.1,.9,.3);for(let i=0;i<2;i++)bx(F,2.6,.1,.5,vm('awningGreen'),-1.1,2.3-i*.12,.3+i*.42);
  for(let i=0;i<6;i++)bx(F,.26,.12,.16,vm('hay'),-1.9+i*.32,1.01,.25+(i%2)*.18);for(let i=0;i<3;i++){bx(F,.36,.14,.3,vm('planks'),-1.6+i*.5,1.02+.0,.55);bx(F,.12,.1,.12,vm('gold'),-1.6+i*.5,1.13,.55);}
  // brick oven built onto the left gable
  const ox=-Lx/2-.9;bx(root,1.8,1.4,2.4,vm('stoneBrick'),ox,.7,0);vDome(root,ox,0,1.1,1.4,4,vm('brick'),.3);
  bx(root,.8,base+hw+H+.8,.8,vm('brick'),ox+.4,(base+hw+H+.8)/2,-.6);bx(root,1,.16,1,vm('stoneBrick'),ox+.4,base+hw+H+.88,-.6);
  vMouth(root,ox-.0,1.4,1.05,.5,.5,true,L).position.z=1.12;
  vHangSign(F,Lx/2-.3,hw-.2,0,ICONS.bread);vLantern(root,L,.9,base+2,Dz/2);
  const tb=new THREE.Group();put(root,tb,-1.2,0,Dz/2+2);bx(tb,1.6,.1,.8,vm('planks'),0,.85,0);for(const[a,b]of[[1,1],[1,-1],[-1,1],[-1,-1]])bx(tb,.1,.8,.1,vm('planksDark'),a*.7,.4,b*.3);for(let i=0;i<6;i++)bx(tb,.24,.12,.16,vm('hay'),-.55+i*.22,.96,(i%2-.5)*.3);
  for(let i=0;i<4;i++)vSack(root,Lx/2+.5+(i%2)*.45,-1.2+Math.floor(i/2)*.45);vWoodpile(root,6,4,ox,-1.9,0);vBarrel(root,Lx/2+.6,Dz/2+.3,true);return root;}

[['vx-barracks','Barracks',vxBarracks,'Long stone barracks with corner quoins, slate roof and twin chimneys, banners by the door; a fenced training yard with straw dummies, weapon racks and painted shields.',11],
 ['vx-stable','Stable',vxStable,'Plank stable with four stalls behind half-doors (one open), deep shingle eaves, a hayloft door, horseshoe sign, saddle rack and hay; a large fully fenced paddock with a gate, trough and hay rack.',10],
 ['vx-archery','Archery range',vxArchery,'Three roped lanes from a shingled shooting shelter to straw-bale butts with ringed targets and arrows; bow rack, arrow barrels, benches and a plank range house with a bow sign at the front.',9.6],
 ['vx-kiln','Charcoal kiln',vxCharcoalKiln,'Beehive brick kiln on a stone ring with glowing embers at the mouth, vents and a flue; log stacks, a charcoal heap, filled sacks and a water barrel.',7.2],
 ['vx-oven','Brick oven',vxBrickOven,'Communal brick oven glowing under a shingled shelter, with a flue, a baker\'s peel, a table of loaves, firewood and flour sacks.',6.4],
 ['vx-windmill','Windmill',vxWindmill,'Stone and timber-boarded tower mill with framed windows, a shingled cap and four canvas sails that turn; spare millstone, flour sacks and a cart.',10],
 ['vx-bakery','Bakery',vxBakery,'Timbered bakery with a bread counter under a green awning, a brick oven and chimney built onto the gable, bread sign and a table of loaves.',null],
].forEach(([id,name,build,desc,g])=>ASSETS.push({id,folder:'buildings/medieval',name,build,desc,groundR:g||undefined}));
