/* ======================= batch 1: market, manor, fortifications ======================= */
function vMerlons(par,len,x,y,z,axis,mat,o={}){const n=Math.floor(len/1.2),w=o.w||.6,t=o.t||.4,h=o.h||.6;for(let i=0;i<n;i++){const p=-len/2+.6+i*1.2+(len-n*1.2)/2;if(axis==='x')bx(par,w,h,t,mat,x+p,y+h/2,z);else bx(par,t,h,w,mat,x,y+h/2,z+p);}}
function vSlit(par,x,y,z,ry=0){const g=new THREE.Group();put(par,g,x,y,z,0,ry,0);bx(g,.14,.8,.06,vm('dark'),0,0,0);return g;}
function vPalLogs(par,len,x0,z,h=3.2,seed=1){const r=mulberry32(seed);for(let x=-len/2+.2;x<len/2;x+=.4){const hh=h+(r()-.5)*.3;vlog(par,.4,hh,.4,'y',x0+x,hh/2,z);bx(par,.24,.24,.24,vm('barkH'),x0+x,hh+.12,z);bx(par,.1,.12,.1,vm('planksDark'),x0+x,hh+.3,z);}}
function vBanner(par,x,y,z,col='woolRed'){const g=new THREE.Group();put(par,g,x,y,z);bx(g,1,.1,.1,vm('planksDark'),0,0,.05);bx(g,.8,1.6,.05,vm(col),0,-.85,.08);bx(g,.8,.1,.06,vm('gold'),0,-.12,.09);bx(g,.8,.06,.06,vm('gold'),0,-1.56,.09);bx(g,.4,.4,.06,vm('woolWhite'),0,-.75,.09);bx(g,.28,.28,.07,vm(col),0,-.75,.1,0,0,Math.PI/4);for(const s of[-1,1])bx(g,.2,.2,.05,vm(col),s*.3,-1.75,.08);return g;}

/* ---------- Market stall ---------- */
function vxMarketStall(){const root=new THREE.Group(),L=[];root.userData.lights=L;const W=3.2,D=1.8;
  vYard(root,5.6,4.4,0,.3);
  for(const[sx,sz,h]of[[1,1,2.5],[-1,1,2.5],[1,-1,2.9],[-1,-1,2.9]])vlog(root,.2,h,.2,'y',sx*(W/2-.1),h/2,sz*(D/2-.1));
  bx(root,W,.9,.08,vm('planksV'),0,.45,D/2-.04);for(const s of[-1,1])bx(root,.08,.9,D-.2,vm('planksV'),s*(W/2-.04),.45,0);
  bx(root,W+.1,.1,.75,vm('planks'),0,.95,D/2-.32);bx(root,W-.3,.08,.5,vm('planks'),0,1.35,-D/2+.35);for(const s of[-1,1])bx(root,.06,1.35,.06,vm('planksDark'),s*(W/2-.35),.67,-D/2+.15);
  for(let i=0;i<5;i++)bx(root,W+.5,.1,.5,vm('awning'),0,2.95-i*.11,-D/2+.05+i*.45);
  for(let i=0;i<9;i++)bx(root,.36,.16,.04,vm(i%2?'woolWhite':'woolRed'),-W/2+.2+i*.4,2.43,D/2+.33);
  const sg=new THREE.Group();put(root,sg,0,2.75,D/2+.42);bx(sg,1.1,.34,.06,vm('planks'),0,0,0);bx(sg,.22,.2,.04,vm('woolRed'),-.3,0,.04);bx(sg,.22,.2,.04,vm('leaves'),0,0,.04);bx(sg,.22,.2,.04,vm('gold'),.3,0,.04);
  const tray=(x,z,goods)=>{const g=new THREE.Group();put(root,g,x,1,z);bx(g,.5,.12,.4,vm('crate'),0,.06,0);goods(g);};
  tray(-1.15,D/2-.32,g=>{for(let i=0;i<9;i++)bx(g,.11,.11,.11,vm('woolRed'),-.15+(i%3)*.15,.18+(i>5?.08:0),-.12+Math.floor(i/3)*.12);});
  tray(-.4,D/2-.32,g=>{for(let i=0;i<4;i++)bx(g,.16,.15,.16,vm('leaves'),-.11+(i%2)*.22,.2,-.09+Math.floor(i/2)*.18);});
  tray(.4,D/2-.32,g=>{for(let i=0;i<6;i++)bx(g,.06,.06,.22,vm('gold'),-.16+i*.065,.15,0,0,(i%2?.2:-.2),0);for(let i=0;i<3;i++)bx(g,.05,.08,.05,vm('leaves'),-.16+i*.13,.17,.13);});
  tray(1.15,D/2-.32,g=>{for(let i=0;i<4;i++)bx(g,.2,.1,.12,vm('hay'),-.1+(i%2)*.2,.17+Math.floor(i/2)*.1,-.07+(i%2)*.1);});
  for(let i=0;i<3;i++)bx(root,.26,.12,.26,vm('gold'),-1+i*.5,1.45,-D/2+.35);for(let i=0;i<4;i++)vCrate(root,.3,.4+i*.35,1.39,-D/2+.35,i*.3);
  vBarrel(root,-W/2-.5,.2);vSack(root,W/2+.4,.5);vSack(root,W/2+.5,-.1);vCrate(root,.5,W/2+.45,0,-.8,.3);vCrate(root,.4,W/2+.45,.5,-.8,.6);
  bx(root,.4,.45,.4,vm('planks'),.3,.22,-.3);
  vLantern(root,L,W/2-.1,2.3,D/2-.1);root.userData.ground=4.8;return root;}

/* ---------- Manor (no walls around it) ---------- */
function vxManor(){const root=new THREE.Group(),L=[];root.userData.lights=L;const Lx=10,Dz=6.4,h1=3,band=.3,h2=2.8,H=3.2,sb=vm('stoneBrick'),pl=.4;
  vYard(root,16,14,0,2);bx(root,Lx+.3,pl,Dz+.3,vm('cobble'),0,pl/2,0);
  const ops1={front:[-4,-2.6,2.6,4].map(x=>({x,w:.9,y0:.8,y1:2.1,sill:sb,lintel:sb,shutter:vm('planksDark')})),back:[-3,-1,1,3].map(x=>({x,w:.9,y0:.8,y1:2.1,sill:sb,lintel:sb})),right:[-1.4,1.4].map(x=>({x,w:.9,y0:.8,y1:2.1,sill:sb})),left:[-1.4,1.4].map(x=>({x,w:.9,y0:.8,y1:2.1,sill:sb}))};
  root.add(vWalls({Lx,Dz,y:pl,h:h1,t:.4,mat:sb,ops:ops1}).group);
  bx(root,Lx+.2,band,Dz+.2,vm('timber'),0,pl+h1+band/2,0);
  const ops2={front:[-4,-2.6,2.6,4].map(x=>({x,w:.9,y0:.7,y1:1.9,shutter:vm('planksDark')})),back:[-3,-1,1,3].map(x=>({x,w:.9,y0:.7,y1:1.9})),right:[{x:0,w:.9,y0:.7,y1:1.9}],left:[{x:0,w:.9,y0:.7,y1:1.9}]};
  root.add(vWalls({Lx,Dz,y:pl+h1+band,h:h2,t:.25,mat:vm('plaster'),ops:ops2,frame:vm('timber')}).group);
  const top=pl+h1+band+h2;put(root,vRoof(Dz,Lx,H,vm('slate'),{ov:.6,ovL:.5,step:.4,gable:vm('plaster'),ridge:sb}),0,top,0);
  for(const s of[-1,1]){bx(root,.9,H+1.2,1,sb,s*(Lx/2-.45),top+(H+1.2)/2,0);bx(root,1.1,.18,1.2,vm('cobble'),s*(Lx/2-.45),top+H+1.29,0);for(const k of[-.2,.2])bx(root,.16,.36,.16,vm('brick'in VXD?'brick':'cobble'),s*(Lx/2-.45)+k,top+H+1.55,0);}
  // projecting entrance wing
  const WW=3.6,WD=2.6,wz=Dz/2+WD/2;bx(root,WW+.3,pl,WD+.1,vm('cobble'),0,pl/2,wz);
  const wops1={front:[{type:'door',x:0,w:1.6,y0:0,y1:2.4,lintel:sb}],back:[],right:[{x:.2,w:.8,y0:.8,y1:2.1,sill:sb}],left:[{x:.2,w:.8,y0:.8,y1:2.1,sill:sb}]};
  const wg1=vWalls({Lx:WW,Dz:WD,y:pl,h:h1,t:.4,mat:sb,ops:wops1});wg1.group.position.z=wz;root.add(wg1.group);
  bx(root,WW+.2,band,WD+.1,vm('timber'),0,pl+h1+band/2,wz+.05);
  const wops2={front:[{x:0,w:1.2,y0:.6,y1:1.9,flowers:true}],back:[],right:[{x:.2,w:.7,y0:.7,y1:1.8}],left:[{x:.2,w:.7,y0:.7,y1:1.8}]};
  const wg2=vWalls({Lx:WW,Dz:WD,y:pl+h1+band,h:h2,t:.25,mat:vm('plaster'),ops:wops2,frame:vm('timber')});wg2.group.position.z=wz;root.add(wg2.group);
  const wr=new THREE.Group();put(root,wr,0,top,Dz/2-.2+ (WD+.2)/2+.1);put(wr,vRoof(WW,WD+2.4,2.6,vm('slate'),{ov:.45,ovL:.35,step:.37,gable:vm('plaster')}),0,0,-1.1,0,Math.PI/2,0);
  const gwin=vWin(root,{x:0,w:.8,y0:top+.4,y1:top+1.2},.05,{});gwin.position.z=Dz/2+WD+.06;
  vBanner(root,-1.5,top-.3,Dz/2+WD+.02);vBanner(root,1.5,top-.3,Dz/2+WD+.02,'woolBlue');
  for(let i=0;i<3;i++)bx(root,2.6-i*.4,.2,.5,sb,0,.1+i*.2,Dz/2+WD+1.3-i*.4);
  // garden: hedges, topiary, lamp posts, flower beds, benches
  for(const s of[-1,1]){bx(root,.6,.7,4.6,vm('leaves'),s*1.9,.35,Dz/2+WD+3.6);for(const zz of[2.2,5])bx(root,.8,.8,.8,vm('leaves'),s*3.4,.4,Dz/2+zz),bx(root,.5,.5,.5,vm('leaves'),s*3.4,1.05,Dz/2+zz),bx(root,.3,.3,.3,vm('leaves'),s*3.4,1.45,Dz/2+zz);
    vlog(root,.2,2.4,.2,'y',s*1.4,1.2,Dz/2+WD+1.4);vLantern(root,L,s*1.4,2.7,Dz/2+WD+1.25);
    bx(root,3,.25,.6,vm('dirt'),s*(Lx/2-1.6),.12,Dz/2+.6);for(let i=0;i<7;i++){const fx=s*(Lx/2-1.6)-1.3+i*.43;bx(root,.16,.2,.16,vm('leaves'),fx,.35,Dz/2+.6);if(i%2===0)bx(root,.1,.1,.1,vm(['woolRed','gold','woolWhite','woolBlue'][i%4]),fx,.5,Dz/2+.6);}
    vBench(root,s*3.4,Dz/2+3.6);}
  vBush(root,-6.2,-2,1.2);vBush(root,6.3,-2.4,1.1);return root;}

/* ---------- Stone wall segment (8 m, modular) ---------- */
function vStoneWallSeg(par,len,x,z,ry=0,o={}){const root=new THREE.Group();put(par,root,x,0,z,0,ry,0);const h=3.6,t=1.6,sb=vm('stoneBrick');
  bx(root,len,.8,t+.3,vm('cobble'),0,.4,0);bx(root,len,h-.8,t,sb,0,.8+(h-.8)/2,0);bx(root,len,.2,t+.14,vm('cobble'),0,h-.1,0);
  bx(root,len,.6,.4,sb,0,h+.3,t/2-.2);vMerlons(root,len,0,h+.6,t/2-.2,'x',sb);bx(root,len,.4,.3,sb,0,h+.2,-t/2+.15);
  for(let x=-len/2+1.6;x<=len/2-1.6+1e-6;x+=2.4)vSlit(root,x,2.2,t/2+.01);for(let x=-len/2+2.8;x<=len/2-2.8+1e-6;x+=2.4)vSlit(root,x,h+.35,t/2+.01);
  if(o.stairs){const st=new THREE.Group();put(root,st,0,0,-t/2-.5);for(let i=0;i<9;i++)bx(st,.5,.4*(i+1),1,sb,len/2-.25-i*.5,.2*(i+1),0);}
  if(o.ladder){const ld=new THREE.Group();put(root,ld,-len/2+1.4,0,-t/2-1.25,.33,0,0);for(const s of[-1,1])bx(ld,.08,3.9,.08,vm('planksDark'),s*.26,1.95,0);for(let i=0;i<11;i++)bx(ld,.52,.06,.06,vm('planks'),0,.3+i*.34,0);}
  return root;}
function vxStoneWall(s,o={}){const root=new THREE.Group(),L=[];root.userData.lights=L;const t=1.6;vStoneWallSeg(root,8,0,0,0,{});
  vLantern(root,L,-2,2.6,-t/2);for(const x of[-3.4,3.4])bx(root,.6,.4,.6,vm('cobble'),x,.2,t/2+.45);root.userData.ground=7.2;return root;}

/* ---------- Stone tower (round, voxel-stepped) ---------- */
function vxStoneTower(){const root=new THREE.Group(),L=[];root.userData.lights=L;const R=2.6,H=8,c=.4,sb=vm('stoneBrick');
  const disc=(r,y,h,mat)=>{for(let x=-r+c/2;x<r;x+=c){const hz=Math.round(Math.sqrt(Math.max(0,r*r-x*x))/c)*c;if(hz>0)bx(root,c,h,2*hz,mat,x,y+h/2,0);}};
  disc(R+.3,0,.8,vm('cobble'));disc(R,.8,H-.8,sb);disc(R+.12,3.8,.24,vm('cobble'));disc(R+.35,H,.3,vm('cobble'));disc(R+.2,H+.3,.06,vm('planks'));
  const N=Math.ceil((R+.8)/c);for(let i=-N;i<N;i++)for(let k=-N;k<N;k++){const x=(i+.5)*c,z=(k+.5)*c,d=Math.hypot(x,z);if(d>=R&&d<R+.4){bx(root,c,.5,c,sb,x,H+.55,z);if(((i+k)%2+2)%2===0&&(Math.abs(i)+Math.abs(k))%3!==1)bx(root,c,.5,c,sb,x,H+1.05,z);}}
  for(let i=0;i<10;i++){const a=i/10*Math.PI*2;bx(root,.3,.3,.3,vm('cobble'),Math.sin(a)*(R+.25),H-.15,Math.cos(a)*(R+.25));}
  const dz=R;bx(root,1.5,2.5,.3,sb,0,2.05,dz+.05);bx(root,1.1,2.1,.1,vm('dark'),0,1.85,dz+.22);bx(root,1,2,.1,vm('planksV'),0,1.8,dz+.26);for(const y of[1.2,2.4])bx(root,.9,.06,.04,vm('iron'),0,y,dz+.32);
  bx(root,1.6,.4,.36,vm('cobble'),0,3.3,dz+.08);for(const s of[-1,1])bx(root,.36,.36,.36,vm('cobble'),s*.65,3.05,dz+.08);
  for(const[a,y]of[[0,5.2],[0,6.8],[Math.PI/2,4.6],[-Math.PI/2,5.8],[Math.PI,5.4]])vSlit(root,Math.sin(a)*(R+.01),y,Math.cos(a)*(R+.01),a);
  bx(root,1.4,.2,1.4,vm('planksDark'),.8,H+.4,-.6);vlog(root,.14,3,.14,'y',0,H+1.5,0);bx(root,1.1,.7,.06,vm('woolRed'),.6,H+2.6,0);bx(root,.3,.3,.07,vm('gold'),.6,H+2.6,0);
  vLantern(root,L,1,2.6,dz+.05);root.userData.ground=7.2;return root;}

/* ---------- Wooden palisade segment (8 m, modular) ---------- */
function vPalisadeSeg(par,len,x,z,ry=0,seedN=3){const root=new THREE.Group();put(par,root,x,0,z,0,ry,0);
  bx(root,len,.3,.8,vm('dirt'),0,.15,0);vPalLogs(root,len,0,0,3.4,seedN);for(const y of[1,2.4])bx(root,len,.2,.2,vm('planksDark'),0,y,-.3);
  bx(root,len,.1,1,vm('planks'),0,2.3,-.95);const n=Math.max(2,Math.round(len/2.4)+1);for(let i=0;i<n;i++){const px=-len/2+.4+i*(len-.8)/(n-1);vlog(root,.2,2.25,.2,'y',px,1.12,-1.35);bx(root,.12,.12,1.1,vm('planksDark'),px,1.6,-.85,.65,0,0);bx(root,.08,.7,.08,vm('planksDark'),px,2.65,-1.4);}
  bx(root,len,.1,.08,vm('planksDark'),0,3,-1.4);return root;}
function vxPalisade(){const root=new THREE.Group(),L=[];root.userData.lights=L;const len=8;vPalisadeSeg(root,len,0,0);
  root.userData.ground=6.4;return root;}

/* ---------- Wooden gate ---------- */
function vGateAnim(root,start,applyFn){const st={cur:+start,target:+start};applyFn(st.cur);root.userData.setOpt=(k,v)=>{if(k==='state')st.target=+v;};
  root.userData.tick=dt=>{if(st.cur===st.target)return;const d=st.target-st.cur,m=Math.min(Math.abs(d),dt*.45);st.cur+=Math.sign(d)*m;const e=st.cur<.5?2*st.cur*st.cur:1-Math.pow(-2*st.cur+2,2)/2;applyFn(e);};}
function vxWoodGate(sd,o={}){const root=new THREE.Group(),L=[];root.userData.lights=L;const gw=3.2,TW=2.2,tx=gw/2+TW/2;
  bx(root,gw+2*TW+6,.3,1,vm('dirt'),0,.15,0);
  for(const s of[-1,1]){const t=new THREE.Group();put(root,t,s*tx,0,0);
    for(const[a,b]of[[1,1],[1,-1],[-1,1],[-1,-1]])vlog(t,.3,5.6,.3,'y',a*(TW/2-.15),2.8,b*(TW/2-.15));
    bx(t,TW-.1,3.6,TW-.1,vm('planksV'),0,1.8,0);bx(t,TW+.3,.2,TW+.3,vm('planks'),0,3.7,0);
    for(let i=0;i<4;i++)for(const sd of[0,1,2,3]){const p=-TW/2+.35+i*.5;const v=sd<2;if(i%2===0)bx(t,v?.4:.1,.8,v?.1:.4,vm('planksV'),v?p:(sd===2?1:-1)*(TW/2+.1),4.2,v?(sd===0?1:-1)*(TW/2+.1):p);}
    for(const sd of[1,-1])bx(t,TW+.3,.12,.1,vm('planksDark'),0,4.6,sd*(TW/2+.1)),bx(t,.1,.12,TW+.3,vm('planksDark'),sd*(TW/2+.1),4.6,0);
    put(t,vPyramid(TW+.8,TW+.8,1.4,vm('shingle'),.28),0,5.6,0);bx(t,.14,.14,.14,vm('planksDark'),0,7.1,0);vSlit(t,0,2.4,TW/2-.04);}
  vlog(root,gw+.6,.5,.5,'x',0,3.9,0);bx(root,gw,.12,1.4,vm('planks'),0,4.2,-.2);
  const leaves=[];for(const s of[-1,1]){const lf=new THREE.Group();put(root,lf,s*gw/2,0,.05);leaves.push([lf,s]);bx(lf,gw/2,3.5,.16,vm('planksV'),-s*gw/4,1.75,0);
    for(const y of[.5,1.75,3])bx(lf,gw/2-.1,.12,.05,vm('iron'),-s*gw/4,y,.1);bx(lf,gw/2-.2,.2,.06,vm('planksDark'),-s*gw/4,1.1,.1,0,0,s*.75);for(let i=0;i<3;i++)bx(lf,.06,.06,.04,vm('iron'),-s*(gw/4-.3+i*.3),2.4,.11);}
  for(const s of[-1,1])vPalisadeSeg(root,3,s*(tx+TW/2+1.5),0,0,s>0?7:9);
  vGateAnim(root,o.state??1,p=>leaves.forEach(([lf,s])=>lf.rotation.y=-s*1.4*p));root.userData.ground=8;return root;}

/* ---------- Stone gate (gatehouse) ---------- */
function vxStoneGate(sd,o={}){const root=new THREE.Group(),L=[];root.userData.lights=L;const sb=vm('stoneBrick'),pw=2.6,ph=3.6,CW=3.6,CH=6.4,CT=3.2,TW=3.2,TH=8.4,tx=CW/2+TW/2;
  bx(root,CW+2*TW+6,.3,CT+1,vm('cobble'),0,.15,0);
  const mid=new THREE.Group();put(root,mid,0,.3,CT/2);mid.add(wall(CW,CH,CT,sb,[{x:0,w:pw,y0:0,y1:ph}],{s:.8,uo:0,vo:0}));
  for(const s of[-1,1]){bx(mid,.4,.4,CT,sb,s*(pw/2-.2),ph-.2,-CT/2);}
  bx(mid,pw+.4,.5,.3,vm('cobble'),0,ph+.25,.1);for(const s of[-1,1])bx(mid,.3,.3,.32,vm('cobble'),s*(pw/2+.05),ph+.05,.1);
  const pc=new THREE.Group();put(mid,pc,0,2.3,-.6);for(let i=0;i<9;i++)bx(pc,.08,ph-.1,.08,vm('iron'),-pw/2+.15+i*(pw-.3)/8,(ph-.1)/2,0);for(let j=0;j<8;j++)bx(pc,pw-.1,.08,.08,vm('iron'),0,.2+j*.45,0);for(let i=0;i<9;i++)bx(pc,.06,.14,.06,vm('iron'),-pw/2+.15+i*(pw-.3)/8,-.07,0);
  const dl=[];for(const s of[-1,1]){const lf=new THREE.Group();put(mid,lf,s*(pw/2-.1),0,-CT+.4);dl.push([lf,s]);bx(lf,pw/2,ph-.2,.14,vm('planksV'),-s*pw/4,(ph-.2)/2,0);for(const y of[.6,2.6])bx(lf,pw/2-.1,.1,.04,vm('iron'),-s*pw/4,y,.09);}
  bx(mid,pw,.04,CT,vm('cobble'),0,.02,-CT/2);
  bx(mid,CW,.5,.4,sb,0,CH+.25,-.2);vMerlons(mid,CW,0,CH+.5,-.2,'x',sb);bx(mid,CW,.5,.4,sb,0,CH+.25,-CT+.2);vMerlons(mid,CW,0,CH+.5,-CT+.2,'x',sb);
  for(const s of[-1,1]){const t=new THREE.Group();put(root,t,s*tx,.3,0);bx(t,TW+.3,.8,TW+.3,vm('cobble'),0,.4,0);bx(t,TW,TH-.8,TW,sb,0,.8+(TH-.8)/2,0);bx(t,TW+.2,.24,TW+.2,vm('cobble'),0,4.6,0);
    bx(t,TW+.5,.3,TW+.5,vm('cobble'),0,TH+.15,0);for(const[ax,z]of[['x',TW/2+.05],['x',-TW/2-.05]])vMerlons(t,TW+.5,0,TH+.3,z,ax,sb,{h:.8});for(const x of[TW/2+.05,-TW/2-.05])vMerlons(t,TW+.5,x,TH+.3,0,'z',sb,{h:.8});
    for(const y of[2.6,5.8])vSlit(t,0,y,TW/2+.01);vSlit(t,s*(TW/2+.01),6.6,0,Math.PI/2);vBanner(t,0,TH-1,TW/2+.02,s>0?'woolBlue':'woolRed');}
  for(const s of[-1,1]){const w=new THREE.Group();put(root,w,s*(tx+TW/2+1.5),.3,0);bx(w,3,3.6,1.6,sb,0,1.8,0);bx(w,3,.6,.4,sb,0,3.9,.6);vMerlons(w,3,0,4.2,.6,'x',sb);bx(w,3,.4,.3,sb,0,3.8,-.65);}
  vLantern(root,L,-pw/2-.35,2.8,CT/2+.05);vLantern(root,L,pw/2+.35,2.8,CT/2+.05);vGateAnim(root,o.state??1,p=>{pc.position.y=.02+(ph-.4)*Math.min(1,p*1.3);dl.forEach(([lf,s])=>lf.rotation.y=s*1.45*Math.max(0,(p-.25)/.75));});root.userData.ground=10;return root;}

[['vx-market','Market stall',vxMarketStall,'Log-post stall with a counter of apples, cabbages, carrots and bread under a striped awning with a scalloped valance; cheese and crates on the back shelf.',4.8],
 ['vx-manor','Manor',vxManor,'Two-storey stone and timber manor with a projecting entrance wing under its own gable, twin gable chimneys, banners, and a formal garden of hedges, topiary and lamp posts.',null],
 ['vx-stonewall','Stone wall',vxStoneWall,'8 m modular curtain wall: stone-brick on a cobble footing, crenellated wall-walk, arrow slits and a stair on the inner side.',7.2],
 ['vx-stonetower','Stone tower',vxStoneTower,'Round 8 m tower stepped out of blocks, with a corbelled crenellated top, arrow slits, an iron-banded door and a flag.',7.2],
 ['vx-palisade','Wooden palisade',vxPalisade,'8 m modular palisade of sharpened logs on an earth bank, with rails, a braced fighting platform and a ladder.',6.4],
 ['vx-woodgate','Wooden gate',vxWoodGate,'Double plank gate between two log watchtowers with shingle spires and parapets, a log lintel and palisade wings.',8],
 ['vx-stonegate','Stone gate',vxStoneGate,'Gatehouse with two crenellated towers, a half-raised iron portcullis, open oak doors, banners and stub walls on each side.',10],
].forEach(([id,name,build,desc,g])=>ASSETS.push({id,folder:'buildings/medieval',name,build,desc,groundR:g||undefined}));
