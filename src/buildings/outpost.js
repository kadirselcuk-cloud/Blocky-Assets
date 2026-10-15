/* ======================= PRIEST OUTPOST (po-): a small mission on the frontier =======================
   Chapel with a bell-cote, the priest's hut, bell frame (Ring clip), wayside shrine, field altar, lectern, pews, font, votive candles,
   healer's tent, beehives, herb garden, alms box, holy banner, and the whole outpost. No crosses: diamonds and gold balls only.
   Shared helpers used by the army camp and the town too: kRoot, kBell, kWallTent, kFlag, kHangLamp, kCandle. */
VXD.canvasW=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,(x+y*3)%7===0?'#d4ccb6':(y%8===0?'#ddd6c2':'#e9e3d3'),nz(r,.95,1.03));};
VXD.bronze=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++){const k=r();P(x,y,k<.12?'#5a4a22':k<.3?'#c09a48':'#9a7a34',nz(r,.9,1.06));}};
VXD.herb=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++){const k=r();P(x,y,k<.25?'#4a6a2a':k<.6?'#6a8a3a':'#86a24a',nz(r,.9,1.08));}};
FOLDERS['buildings/medieval'].children.push('buildings/medieval/outpost');
FOLDERS['buildings/medieval/outpost']={name:'Priest outpost',blurb:'Chapel, priest\'s hut, bell frame, shrine, altar, pews, font, candles, healer\'s tent, beehives, herb garden and the whole outpost',children:[]};
function kRoot(g){const r=new THREE.Group();r.userData.lights=[];r.userData.ground=g;return r;}
/* a bell hanging from its pivot (origin = the hang point), mouth down; returns {g, clapper} */
function kBell(par,x,y,z,s=1){const g=new THREE.Group();put(par,g,x,y,z);const b=vm('bronze'),k=new THREE.Group();g.add(k);k.scale.setScalar(s);
  bx(k,.12,.1,.12,vm('iron'),0,-.05,0);bx(k,.22,.08,.22,b,0,-.14,0);[[.3,.12],[.34,.12],[.38,.1],[.44,.08]].reduce((y0,[w,h])=>{bx(k,w,h,w,b,0,y0-h/2,0);return y0-h;},-.18);
  bx(k,.5,.06,.5,b,0,-.63,0);bx(k,.4,.01,.4,vm('dark'),0,-.665,0);const c=new THREE.Group();c.name='clapper';put(k,c,0,-.2,0);bx(c,.03,.42,.03,vm('iron'),0,-.21,0);bx(c,.08,.08,.08,vm('iron'),0,-.48,0);
  return{g,clapper:c};}
/* plain flag on a staff top: hoist at the staff, flying towards +x */
function kFlag(par,x,y,z,col,w=.5,h=.32){const g=new THREE.Group();put(par,g,x,y,z);bx(g,w,h,.02,vm(col),w/2+.03,-h/2,0);bx(g,w*.4,h*.5,.021,vm('woolWhite'),w*.55+.03,-h/2,0,0,0,0);return g;}
/* lamp hung on a chain from a beam: hook at (x,y,z) */
function kHangLamp(par,L,x,y,z,len=.4){const g=new THREE.Group();put(par,g,x,y,z);for(let i=0;i<Math.round(len/.08);i++)bx(g,i%2?.02:.04,.08,i%2?.04:.02,vm('iron'),0,-.04-i*.08,0);
  const y0=-len;bx(g,.2,.04,.2,vm('iron'),0,y0-.02,0);const f=new THREE.Mesh(new THREE.BoxGeometry(.12,.18,.12),VFLAME);f.position.y=y0-.13;g.add(f);for(const[a,b]of[[1,1],[1,-1],[-1,1],[-1,-1]])bx(g,.03,.2,.03,vm('iron'),a*.085,y0-.13,b*.085);bx(g,.22,.04,.22,vm('iron'),0,y0-.25,0);
  const pl=new THREE.PointLight(0xffb060,0,7,2);pl.position.set(0,y0-.13,0);pl.userData.lamp=true;g.add(pl);L.push(pl);return g;}
/* candle with a little flame; one light per call only when L is given */
function kCandle(par,x,y,z,h=.18,L){bx(par,.06,h,.06,vm('wax'),x,y+h/2,z);bx(par,.01,.03,.01,vm('dark'),x,y+h+.015,z);return vFlame(par,x,y+h+.01,z,.035,L,.5);}
/* wall tent: canvas walls and a ridge roof, front (+z) open with the flaps tied back; o={L (depth), W, wh (wall), rh (roof rise), mat, trim, open} */
function kWallTent(par,x,z,ry,o){const g=new THREE.Group();put(par,g,x,0,z,0,ry,0);const L=o.L||3.6,W=o.W||3,wh=o.wh||1.5,rh=o.rh||1.1,cv=vm(o.mat||'canvasW'),t=.05,a=Math.atan2(rh,W/2),sl=Math.hypot(rh,W/2)+.16;
  for(const zz of[-L/2,L/2])vlog(g,.1,wh+rh+.15,.1,'y',0,(wh+rh+.15)/2,zz);vlog(g,.08,.08,L+.2,'z',0,wh+rh,0);for(const s of[-1,1])for(const zz of[-L/2,L/2])bx(g,.07,wh,.07,vm('planksDark'),s*(W/2-.04),wh/2,zz*.98);
  for(const s of[-1,1]){const p=new THREE.Group();put(g,p,s*W/4,wh+rh/2,0,0,0,s*(Math.PI/2-a));bx(p,t,sl,L+.3,cv,s*.03,0,0);bx(g,t,wh,L,cv,s*W/2,wh/2,0);
    if(o.trim)for(let i=0;i<Math.round(L/.4);i++)if(i%2===0)bx(g,t+.02,.18,.4,vm(o.trim),s*(W/2+.05),wh-.08,-L/2+.2+i*.4);}
  const n=Math.round(rh/.2);for(const zz of[-L/2,L/2])for(let i=0;i<n;i++){const k=(i+.5)/n,w=W*(1-k);if(zz>0&&o.open!==false&&w<.5)continue;bx(g,w,rh/n,t,cv,0,wh+k*rh-rh/n/2,zz);}
  bx(g,W,wh,t,cv,0,wh/2,-L/2);if(o.open===false)bx(g,W,wh,t,cv,0,wh/2,L/2);
  else{const dw=Math.min(1.4,W*.45);for(const s of[-1,1]){const side=(W-dw)/2;bx(g,side,wh,t,cv,s*(W/2-side/2),wh/2,L/2);const f=new THREE.Group();put(g,f,s*dw/2,0,L/2,0,s*1.25,0);bx(f,t,wh-.05,dw/2,cv,0,(wh-.05)/2,dw/4+.03);bx(g,.03,.06,.3,vm('rope'),s*(W/2-side/2),wh*.55,L/2+.03);}}
  for(const s of[-1,1])for(const zz of[-L/2+.3,L/2-.3]){bx(g,.05,.22,.05,vm('planks'),s*(W/2+.55),.11,zz);wlBeam(g,[s*(W/2+.55),.18,zz],[s*(W/2+.03),wh-.06,zz],.02,vm('rope'));}
  g.userData.ridgeY=wh+rh-.04;return g;}

/* ---------- chapel ---------- */
function poChapel(){const root=kRoot(6),L=root.userData.lights,Lx=4.8,Dz=6.4,pl=.4,hw=3.2,H=2.8,t=.4,sb=vm('stoneBrick'),cb=vm('cobble');
  vYard(root,8,10,0,1);bx(root,Lx+.4,pl,Dz+.4,cb,0,pl/2,0);bx(root,1.6,.2,.6,cb,0,.1,Dz/2+.5);
  const side=[-1.5,1.5].map(x=>({type:'hole',x,w:.7,y0:1.2,y1:2.6}));
  const W=vWalls({Lx,Dz,y:pl,h:hw,t,mat:sb,ops:{front:[{type:'door',x:0,w:1.2,y0:0,y1:2.2}],back:[{type:'hole',x:0,w:.8,y0:1.4,y1:2.8}],right:side,left:side}});root.add(W.group);
  for(const k of['right','left'])for(const op of side)vStained(W.faces[k],op.x,op.y0,op.w,op.y1-op.y0,t);vStained(W.faces.back,0,1.4,.8,1.4,t);
  for(const sd of[-1,1])for(const z of[-Dz/2+.3,Dz/2-.3])bx(root,.6,hw-.4,.6,sb,sd*(Lx/2+.2),pl+(hw-.4)/2,z);
  put(root,vRoof(Lx,Dz,H,vm('slate'),{ov:.4,ovL:.3,step:.4,gable:sb,gt:t,ridge:cb}),0,pl+hw,0,0,Math.PI/2,0);
  const zc=Dz/2-t/2,y0=pl+hw+H;bx(root,1.4,.6,t+.1,sb,0,y0-.1,zc);for(const s of[-1,1])bx(root,.3,1.1,t,sb,s*.5,y0+.2+.55,zc);bx(root,1.5,.3,t+.12,cb,0,y0+1.45,zc);
  put(root,vPyramid(1.5,t+.12,.6,vm('slate'),.15),0,y0+1.6,zc);bx(root,.2,.2,.2,vm('gold'),0,y0+2.3,zc);bx(root,.08,.08,.08,vm('gold'),0,y0+2.44,zc);
  bx(root,.1,.1,t,vm('planksDark'),0,y0+1.25,zc);kBell(root,0,y0+1.2,zc,.85);
  const In=new THREE.Group();put(root,In,0,pl,0);bx(In,1.4,.2,.9,cb,0,.1,-Dz/2+t+.6);bx(In,1.2,.8,.5,vm('stone'),0,.6,-Dz/2+t+.55);bx(In,1.3,.04,.6,vm('woolWhite'),0,1.02,-Dz/2+t+.55);bx(In,.3,.5,.02,vm('woolWhite'),0,.79,-Dz/2+t+.86);
  for(const s of[-1,1]){bx(In,.12,.04,.12,vm('gold'),s*.45,1.06,-Dz/2+t+.5);kCandle(In,s*.45,1.08,-Dz/2+t+.5,.22,s<0?L:null);}
  bx(In,.12,.12,.02,vm('gold'),0,.86,-Dz/2+t+.875,0,0,Math.PI/4);for(const z of[-.4,.9])for(const s of[-1,1])vBench(In,s*1,z);
  vLantern(root,L,1,pl+2.4,Dz/2);for(let i=0;i<3;i++)vBush(root,-Lx/2-.6,-1.6+i*1.6,.7);return root;}
/* ---------- the priest's hut ---------- */
function poHut(){const root=kRoot(5),L=root.userData.lights,Lx=4.4,Dz=3.6,base=.4,hw=2.4;vYard(root,7,6,0,.6);bx(root,Lx+.2,base,Dz+.2,vm('cobble'),0,base/2,0);
  const W=vWalls({Lx,Dz,y:base,h:hw,t:.2,mat:vm('plaster'),frame:vm('timber'),unit:{shutter:vm('planksDark')},ops:{front:[{type:'door',x:-.9,w:1,y0:0,y1:2},{x:1.1,w:.8,y0:.9,y1:1.7,shutter:true,flowers:true}],back:[{x:0,w:.8,y0:.9,y1:1.7,shutter:true}],left:[],right:[{x:0,w:.8,y0:.9,y1:1.7,shutter:true}]}});root.add(W.group);
  put(root,vRoof(Dz,Lx,2.2,vm('thatch'),{ov:.6,ovL:.5,step:.4,gable:vm('plaster'),ridge:vm('hay')}),0,base+hw,0);
  const ch=Lx/2-.3;bx(root,.6,base+hw+2.2,.6,vm('cobble'),ch,(base+hw+2.2)/2,-.9);bx(root,.8,.2,.8,vm('stoneBrick'),ch,base+hw+2.3,-.9);
  vLantern(root,L,-.1,base+2,Dz/2);vBench(root,1.1,Dz/2+.75);vWoodpile(root,5,3,-Lx/2-.5,0,Math.PI/2);
  for(let i=0;i<3;i++){const x=-2.1+i*.36,z=Dz/2+.7;bx(root,.26,.24,.26,vm('clayPot'),x,.12,z);bx(root,.2,.18,.2,vm('herb'),x,.33,z);}
  put(root,TOOLS.Bucket.build(),2.5,.47,1.1);return root;}
/* ---------- bell frame (clip Ring) ---------- */
function poBellFrame(){const root=kRoot(2.4),pd=vm('planksDark'),H=2.7;bx(root,3,.2,1.8,vm('cobble'),0,.1,0);
  for(const s of[-1,1]){for(const zz of[-1,1])wlBeam(root,[s*1.1,.2,zz*.75],[s*1.1,H,0],.16,vm('timber'));bx(root,.12,.12,1.2,pd,s*1.1,1.1,0);bx(root,.24,.24,.24,pd,s*1.1,H,0);}
  vlog(root,2.6,.2,.2,'x',0,H+.18,0);bx(root,.14,.12,.1,vm('iron'),-.2,H+.02,0);bx(root,.14,.12,.1,vm('iron'),.2,H+.02,0);
  const P=new THREE.Group();P.name='bell_pivot';put(root,P,0,H-.04,0);bx(P,.5,.14,.16,pd,0,-.07,0);bx(P,.08,.08,.5,pd,0,-.07,.25);const b=kBell(P,0,-.14,0,1.2);
  const ropeL=1.5,rope=new THREE.Group();rope.name='bell_rope';put(root,rope,0,H-.04-.07-ropeL/2,.5);bx(rope,.03,ropeL,.03,vm('rope'),0,0,0);bx(rope,.06,.12,.06,vm('rope'),0,-ropeL/2+.06,0);
  bx(root,.12,.5,.12,pd,.25,.45,.75);bx(root,.18,.04,.06,vm('iron'),.25,.6,.69);
  const pose=(a,c,S)=>{S.bell_pivot={r:[a,0,0]};S[b.clapper.name]={r:[c,0,0]};S.bell_rope={p:[0,H-.04-.07*Math.cos(a)-.5*Math.sin(a)-ropeL/2,.5*Math.cos(a)-.07*Math.sin(a)]};};
  propAnim(root,[P,b.clapper,rope],[{name:'Ring',dur:2.4,loop:true,fn:(t,S)=>{const w=t/1.2*Math.PI*2,a=.75*Math.sin(w);pose(a,-.35*Math.sin(w-.6),S);}},
    {name:'Toll',dur:3,next:'Idle',fn:(t,S)=>{const k=Math.exp(-t*1.1),w=t/1.5*Math.PI*2,a=.6*Math.sin(w)*k*(t<.4?t/.4:1);pose(a,-.3*Math.sin(w-.6)*k,S);}}]);return root;}
/* ---------- wayside shrine ---------- */
function poShrine(){const root=kRoot(1.4),L=root.userData.lights,st=vm('stoneBrick'),s2=vm('stone');bx(root,1.2,.3,1.2,vm('cobble'),0,.15,0);bx(root,.6,1.3,.6,st,0,.95,0);
  bx(root,1,.12,.8,s2,0,1.66,0);bx(root,1,1,.14,st,0,2.22,-.33);for(const s of[-1,1])bx(root,.14,1,.8,st,s*.43,2.22,0);
  put(root,vRoof(1.1,.95,.5,vm('shingle'),{ov:.12,ovL:.1,step:.1,gable:st,ridge:vm('planksDark')}),0,2.72,0,0,Math.PI/2,0);bx(root,.12,.12,.12,vm('gold'),0,3.3,.0);
  const f=new THREE.Group(),sm=vm('statue');put(root,f,0,1.72,-.1);bx(f,.3,.06,.24,sm,0,.03,0);bx(f,.26,.38,.2,sm,0,.25,0);bx(f,.3,.12,.2,sm,0,.5,0);bx(f,.14,.15,.14,sm,0,.635,0);bx(f,.18,.06,.16,sm,0,.73,-.01);bx(f,.12,.08,.06,sm,0,.36,.12);
  bx(root,.14,.04,.14,vm('clayPot'),.22,1.74,.2);kCandle(root,.22,1.76,.2,.12,L);bx(root,.1,.05,.08,vm('hay'),-.24,1.745,.22);
  const r=mulberry32(91);for(let i=0;i<7;i++){const x=-.6+i*.2,z=.7+r()*.15;bx(root,.06,.14,.06,vm('leaves'),x,.07,z);bx(root,.09,.07,.09,vm(['woolRed','gold','woolWhite','woolPurple'][i%4]),x,.17,z);}return root;}
/* ---------- field altar ---------- */
function poAltar(){const root=kRoot(2.4),L=root.userData.lights,st=vm('stone'),sb=vm('stoneBrick');bx(root,3,.2,2,vm('cobble'),0,.1,0);bx(root,2.4,.2,1.4,sb,0,.3,-.3);
  bx(root,1.6,.9,.7,st,0,.85,-.55);bx(root,1.8,.1,.8,sb,0,1.35,-.55);bx(root,1.84,.03,.84,vm('woolWhite'),0,1.415,-.55);bx(root,.6,.7,.02,vm('woolWhite'),0,1.08,-.14);bx(root,.6,.06,.025,vm('gold'),0,.76,-.14);bx(root,.16,.16,.02,vm('gold'),0,1.1,-.125,0,0,Math.PI/4);
  for(const s of[-1,1]){bx(root,.14,.03,.14,vm('gold'),s*.7,1.445,-.65);bx(root,.04,.36,.04,vm('gold'),s*.7,1.62,-.65);bx(root,.1,.03,.1,vm('gold'),s*.7,1.815,-.65);kCandle(root,s*.7,1.83,-.65,.2,s<0?L:null);}
  bx(root,.42,.03,.32,vm('leather'),0,1.445,-.5);for(const s of[-1,1])bx(root,.19,.02,.28,vm('paper'),s*.1,1.47,-.5,0,0,-s*.12);
  bx(root,.1,.02,.1,vm('gold'),.38,1.44,-.75);bx(root,.03,.1,.03,vm('gold'),.38,1.5,-.75);bx(root,.08,.07,.08,vm('gold'),.38,1.585,-.75);
  bx(root,1.4,.14,.3,vm('planks'),0,.27,.7);for(const s of[-1,1])bx(root,.1,.07,.26,vm('planksDark'),s*.6,.235,.7);return root;}
/* ---------- lectern ---------- */
function poLectern(){const root=kRoot(1.2),L=root.userData.lights,w=vm('planksDark');bx(root,.5,.08,.5,w,0,.04,0);bx(root,.14,1,.14,vm('planks'),0,.58,0);bx(root,.3,.06,.3,w,0,1.11,0);
  const top=new THREE.Group();put(root,top,0,1.2,0,.4,0,0);bx(top,.6,.04,.44,w,0,0,0);bx(top,.6,.06,.03,w,0,.04,.22);bx(top,.32,.03,.06,w,0,-.035,-.1);
  bx(top,.46,.02,.32,vm('leather'),0,.03,0);for(const s of[-1,1])bx(top,.21,.02,.3,vm('paper'),s*.11,.05,0,0,0,-s*.1);bx(top,.02,.01,.26,vm('woolRed'),.04,.065,-.02);
  bx(root,.24,.04,.04,vm('iron'),.18,1.0,0);bx(root,.1,.03,.1,vm('iron'),.3,1.0,0);kCandle(root,.3,1.015,0,.12,L);return root;}
/* ---------- prayer benches ---------- */
function poPew(par,x,z){const g=new THREE.Group();put(par,g,x,0,z);const p=vm('planks'),d=vm('planksDark');bx(g,1.6,.08,.36,p,0,.45,0);bx(g,1.6,.45,.06,p,0,.75,-.18);bx(g,1.6,.06,.08,d,0,.99,-.18);
  for(const s of[-1,1]){bx(g,.06,.98,.44,d,s*.83,.49,-.02);bx(g,.08,.12,.1,d,s*.6,.06,.4);}bx(g,1.4,.08,.14,vm('planks'),0,.16,.4);return g;}
function poPews(){const root=kRoot(2.4);for(const z of[-.6,.7])for(const s of[-1,1])poPew(root,s*.95,z);return root;}
/* ---------- holy water font ---------- */
function poFont(){const root=kRoot(1),st=vm('stone');bx(root,.9,.12,.9,vm('cobble'),0,.06,0);bx(root,.56,.12,.56,vm('stoneBrick'),0,.18,0);bx(root,.32,.6,.32,st,0,.54,0);bx(root,.56,.1,.56,st,0,.89,0);
  hollow(root,.8,.26,.8,.08,st,0,.94,0);bx(root,.64,.02,.64,vm('water'),0,1.12,0);bx(root,.14,.14,.02,vm('gold'),0,1.06,.41,0,0,Math.PI/4);return root;}
/* ---------- votive candle stand ---------- */
function poCandles(){const root=kRoot(1.2),L=root.userData.lights,ir=vm('iron');bx(root,1.3,.06,.7,vm('stoneBrick'),0,.03,0);
  for(const s of[-1,1])for(const z of[-.25,.25])bx(root,.05,.9,.05,ir,s*.55,.51,z);
  const r=mulberry32(7);let first=true;[[.25,.6],[0,.75],[-.25,.9]].forEach(([z,y])=>{bx(root,1.2,.04,.2,ir,0,y,z);bx(root,1.16,.02,.16,vm('wax'),0,y+.03,z);
    for(let i=0;i<7;i++){const x=-.48+i*.16,h=.06+r()*.12;if(r()<.75){kCandle(root,x,y+.04,z,h,first?L:null);first=false;}else bx(root,.06,.03,.06,vm('wax'),x,y+.055,z);}});
  bx(root,.3,.24,.2,vm('planksDark'),.4,.18,.42);bx(root,.12,.01,.02,vm('dark'),.4,.305,.42);for(let i=0;i<4;i++)bx(root,.05,.05,.18,vm('wax'),.28+i*.08,.325,.42);return root;}
/* ---------- healer's tent ---------- */
function poCot(par,x,z,ry,col='woolWhite'){const g=new THREE.Group();put(par,g,x,0,z,0,ry,0);const d=vm('planksDark');for(const[a,b]of[[1,1],[1,-1],[-1,1],[-1,-1]])bx(g,.06,.4,.06,d,a*.33,.2,b*.9);
  for(const s of[-1,1])bx(g,.06,.06,1.9,d,s*.33,.4,0);bx(g,.62,.04,1.8,vm('canvasW'),0,.42,0);bx(g,.64,.05,1.1,vm(col),0,.465,.3);bx(g,.4,.1,.24,vm('woolWhite'),0,.49,-.7);return g;}
function poTent(){const root=kRoot(3.4),L=root.userData.lights,T=kWallTent(root,0,0,0,{L:4.4,W:3.6,wh:1.6,rh:1.2});bx(root,3.4,.02,4.2,vm('hay'),0,.01,0).castShadow=false;
  poCot(root,-1.15,.2,0);poCot(root,1.15,.2,0,'blanket');const tb=vTable(root,0,-1.7,1.4,.6);bx(tb,.7,.02,.4,vm('canvasW'),0,.91,0);
  for(let i=0;i<4;i++){const x=-.5+i*.3,lq=liquidMat(['#a02020','#3a8a3a','#3a5aa8','#c8a020'][i]);const b=new THREE.Mesh(new THREE.BoxGeometry(.1,.16,.1),GLASSMAT);b.position.set(x,.98,-1.75);root.add(b);const l=new THREE.Mesh(new THREE.BoxGeometry(.08,.1,.08),lq);l.position.set(x,.96,-1.75);root.add(l);bx(root,.05,.04,.05,vm('cattail'),x,1.08,-1.75);}
  bx(root,.24,.08,.24,vm('clayPot'),.55,.94,-1.6);bx(root,.18,.02,.18,vm('water'),.55,.97,-1.6);put(root,TOOLS.Bucket.build(),-1.3,.47,-1.7);
  const ry=T.userData.ridgeY;for(let i=0;i<4;i++){const z=-1.4+i*.5;bx(root,.015,.3,.015,vm('rope'),0,ry-.19,z);bx(root,.12,.22,.12,vm(i%2?'herb':'hay'),0,ry-.45,z);}kHangLamp(root,L,0,ry-.04,1.2,.4);return root;}
/* ---------- beehives ---------- */
function poSkep(par,x,y,z){const g=new THREE.Group();put(par,g,x,y,z);[.52,.5,.46,.4,.32,.2].forEach((w,i)=>bx(g,w,.1,w,vm('hay'),0,.05+i*.1,0));for(let i=0;i<5;i++)bx(g,.53-i*.02,.02,.53-i*.02,vm('rope'),0,.1+i*.1,0);bx(g,.1,.06,.02,vm('dark'),0,.04,.265);return g;}
function poBees(){const root=kRoot(1.8),d=vm('planksDark');bx(root,2.4,.08,.7,vm('planks'),0,.54,0);for(const s of[-1,1])for(const zz of[-.25,.25])bx(root,.08,.5,.08,d,s*1.05,.25,zz);
  for(const x of[-.75,0,.75])poSkep(root,x,.58,0);for(const s of[-1,1]){bx(root,.1,1.7,.1,d,s*1.25,.85,-.5);bx(root,.1,1.4,.1,d,s*1.25,.7,.5);}
  const rf=new THREE.Group();put(root,rf,0,1.6,0,-Math.atan2(.3,1),0,0);bx(rf,2.8,.08,1.4,vm('shingle'),0,.04,0);bx(rf,2.7,.08,.1,d,0,-.04,.5);bx(rf,2.7,.08,.1,d,0,-.04,-.5);return root;}
/* ---------- herb garden ---------- */
function poHerbs(){const root=kRoot(2.2),p=vm('planks'),r=mulberry32(33);hollow(root,3.2,.32,1.3,.08,p);bx(root,3.04,.02,1.14,vm('dirt'),0,.27,0);
  for(const[x,z]of[[1,1],[1,-1],[-1,1],[-1,-1]])bx(root,.12,.36,.12,vm('planksDark'),x*1.6,.18,z*.65);
  for(let row=0;row<3;row++)for(let i=0;i<7;i++){const x=-1.3+i*.43+(r()-.5)*.05,z=-.38+row*.38,kind=row;
    if(kind===0){bx(root,.2,.16,.2,vm('herb'),x,.36,z);bx(root,.12,.08,.12,vm('herb'),x,.48,z);}
    else if(kind===1){for(const dx of[-.05,.05]){bx(root,.04,.22,.04,vm('herb'),x+dx,.39,z);bx(root,.05,.08,.05,vm('woolPurple'),x+dx,.54,z);}}
    else{bx(root,.22,.1,.22,vm('leaves'),x,.33,z);bx(root,.06,.06,.06,vm('woolWhite'),x+.05,.41,z-.04);}}
  put(root,TOOLS.Bucket.build(),1.95,.47,.4);{const s=new THREE.Group();put(root,s,-2.1,0,.2,0,.3,-.25);put(s,TOOLS.Shovel.build(),0,.82,0);}return root;}
/* ---------- alms box ---------- */
function poAlms(){const root=kRoot(1),d=vm('planksDark');bx(root,.4,.12,.4,vm('cobble'),0,.06,0);bx(root,.16,1,.16,vm('planks'),0,.62,0);bx(root,.44,.34,.34,d,0,1.29,0);
  for(const y of[1.18,1.4])bx(root,.46,.04,.36,vm('iron'),0,y,0);bx(root,.14,.02,.02,vm('dark'),0,1.465,.06);bx(root,.08,.1,.02,vm('iron'),0,1.28,.18);
  put(root,vRoof(.5,.62,.24,vm('shingle'),{ov:.06,ovL:.04,step:.08,gable:d}),0,1.46,0);return root;}
/* ---------- holy banner ---------- */
function poBanner(){const root=kRoot(1.6),H=4;bx(root,.6,.4,.6,vm('cobble'),0,.2,0);bx(root,.12,H,.12,vm('planksDark'),0,.4+H/2,0);bx(root,.2,.2,.2,vm('gold'),0,H+.5,0);
  bx(root,1.1,.08,.08,vm('planksDark'),.6,H+.2,0);bx(root,.1,.06,.06,vm('gold'),1.18,H+.2,0);const g=new THREE.Group();put(root,g,.65,H+.16,.0);
  bx(g,.8,1.5,.04,vm('woolWhite'),0,-.75,0);for(const s of[-1,1]){bx(g,.36,.3,.04,vm('woolWhite'),s*.22,-1.65,0);bx(g,.06,1.5,.05,vm('gold'),s*.38,-.75,0);}bx(g,.8,.08,.05,vm('gold'),0,-.04,0);
  bx(g,.34,.34,.05,vm('gold'),0,-.7,0,0,0,Math.PI/4);bx(g,.18,.18,.055,vm('woolWhite'),0,-.7,0,0,0,Math.PI/4);for(const s of[-1,1])bx(g,.012,.12,.012,vm('rope'),s*.3,.02,0);return root;}
/* ---------- the whole outpost ---------- */
function poOutpost(){const root=kRoot(15),L=root.userData.lights;vYard(root,26,24,0,0);
  const add=(fn,x,z,ry=0)=>{const a=fn();a.userData.lights.forEach(l=>L.push(l));put(root,a,x,0,z,0,ry,0);return a;};
  add(poChapel,0,-5);add(poHut,7,-4,-Math.PI/2);add(poBellFrame,-5.4,-6.2);add(poTent,-7,2.4,Math.PI/2);add(poHerbs,6.6,2.4);add(poBees,7.4,6,-Math.PI/2);
  add(poFont,1.6,-.6);add(poAlms,-1.6,-.6);add(poShrine,-2.2,9.2);add(poBanner,2.4,9.6);add(poCandles,-4.4,-1.6,.6);
  for(let i=0;i<5;i++)bx(root,1.2,.04,.8,vm('cobble'),0,.02,.6+i*1.7).castShadow=false;
  const fz=10.2,fx=10.4;for(const s of[-1,1]){vFence(root,8.4,s*5.8,fz);vFence(root,20.4,s*fx,0,Math.PI/2);}vFence(root,20.8,0,-fz);
  for(const s of[-1,1])vlog(root,.24,1.6,.24,'y',s*1.6,.8,fz);vTree(root,-9,-9,3.4,1.1);vTree(root,9.2,-9.2,3,1);vTree(root,-8.8,8.6,3.2,1);return root;}

const PO=(id,name,build,desc,x={})=>ASSETS.push(Object.assign({id:'po-'+id,folder:'buildings/medieval/outpost',name,build,desc},x));
PO('chapel','Wayside chapel',poChapel,'Small stone chapel with a slate roof and stained-glass windows; a bell-cote with a bronze bell and a gold ball on the front gable. Inside: an altar with a white cloth and two candles, and four benches.');
PO('hut','Priest\'s hut',poHut,'The priest\'s timber-framed cottage under thatch, with shutters, a flower box, a stone chimney, a bench by the door, a woodpile and pots of herbs.');
PO('bell','Bell frame',poBellFrame,'Bronze bell hung in a timber frame on a stone base, with a bell rope. Clips: Ring (the bell swings, the clapper strikes, the rope follows) and Toll (one stroke dying away).');
PO('shrine','Wayside shrine',poShrine,'Stone pillar with a roofed niche holding a robed stone figure, a lit candle and an offering of bread; flowers at its foot.');
PO('altar','Field altar',poAltar,'Open-air stone altar on two steps: white altar cloth with a gold diamond, two gold candlesticks with lit candles, an open book, a chalice and a kneeling bench.');
PO('lectern','Lectern',poLectern,'Wooden reading stand with an open book and a ribbon, and a candle on a small iron arm.');
PO('pews','Prayer benches',poPews,'Four wooden pews with backrests and kneelers, in two rows.');
PO('font','Holy water font',poFont,'Stone basin on a pillar, filled with water, with a small gold diamond on the rim.');
PO('candles','Votive candles',poCandles,'Iron stand with three tiers of votive candles, most of them lit, and a box of fresh candles beside it.');
PO('tent','Healer\'s tent',poTent,'White canvas wall tent with the front tied open: two cots with blankets, a table with remedies in coloured bottles and a basin, herbs drying from the ridge pole and a hanging lamp.');
PO('bees','Beehives',poBees,'Three straw skeps on a plank bench under a little shingle roof.');
PO('herbs','Herb garden',poHerbs,'Raised plank bed with three rows of herbs (green herbs, lavender, flowering herbs), a bucket and a shovel.');
PO('alms','Alms box',poAlms,'Iron-bound alms box with a coin slot on a post, under a small roof.');
PO('banner','Holy banner',poBanner,'White banner with a gold border and a gold diamond, hung from the arm of a tall pole set in a stone base; gold ball on top.');
PO('outpost','Priest outpost',poOutpost,'The whole mission inside a wooden fence: the chapel with a font and an alms box before its door, the priest\'s hut, the bell frame, votive candles, the healer\'s tent, the herb garden and beehives, and a shrine and the holy banner at the gate.',{groundR:15});
