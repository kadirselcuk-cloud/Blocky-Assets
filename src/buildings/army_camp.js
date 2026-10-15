/* ======================= ARMY CAMP (ac-): a field camp of the realm's soldiers =======================
   Clean white canvas, planed timber and the army colour (option on the tents, pavilion, command tent, armoury and standard).
   Uses kRoot, kWallTent, kFlag, kHangLamp, kCandle from outpost.js. No crosses: diamonds on banners, single diagonal braces. */
VXD.meat=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++){const k=r(),fat=(x+y*2)%9===0||y%7===0;P(x,y,fat?'#e8d0c0':k<.3?'#8a2a24':'#a83a30',nz(r,.9,1.06));}};
FOLDERS['buildings/medieval'].children.push('buildings/medieval/army');
FOLDERS['buildings/medieval/army']={name:'Army camp',blurb:'Soldiers\' tents, officer\'s pavilion, command tent, armoury, racks, training, kitchen, mess, wagon, supplies, horse lines, forge, watch platform and the whole camp',children:[]};
const AC_COL=[['woolRed','Red'],['woolBlue','Blue'],['woolGreen','Green'],['woolPurple','Purple']];
const acCol=o=>(o&&o.color)||'woolRed';
/* heater shield leaning back against something behind it: bottom edge on the ground at (x,z) */
function acShield(par,x,z,ry,col,tilt=.22){const g=new THREE.Group();put(par,g,x,0,z,0,ry,0);const s=wHeater(col,'woolWhite');put(g,s,0,.5*Math.cos(tilt)+.01,-.5*Math.sin(tilt),-tilt,0,0);return g;}
function acSpear(par,x,y,z,rx=0,rz=0){const g=new THREE.Group();put(par,g,x,y,z,rx,0,rz);put(g,TOOLS.Spear.build(),0,.95,0);return g;}
/* ---------- soldier's tent ---------- */
function acTent(s,o){const root=kRoot(2.6),c=acCol(o),L=2.8,H=1.8;vTentA(root,0,0,0,L,2.2,H,'canvasW');
  bx(root,.04,.8,.04,vm('planksDark'),0,H+.45,L/2);kFlag(root,0,H+.82,L/2,c,.42,.26);vBedroll(root,-.42,-.2,0,false);vBedroll(root,.42,-.2,0,true);
  vCrate(root,.5,1.5,0,1.1,.2);put(root,aHelmKettle(),1.5,.5,1.1);acShield(root,1.5,1.6,0,c,.4);return root;}
/* ---------- officer's pavilion ---------- */
function acPavilion(s,o){const root=kRoot(3.4),L=root.userData.lights,c=acCol(o),cv=vm('canvasW'),W=3.6,wh=1.8,t=.05;bx(root,3.2,.02,3.2,vm('rug'),0,.01,0).castShadow=false;
  for(const[a,b]of[[1,1],[1,-1],[-1,1],[-1,-1]])bx(root,.08,wh,.08,vm('planksDark'),a*(W/2-.05),wh/2,b*(W/2-.05));
  bx(root,W,wh,t,cv,0,wh/2,-W/2);for(const s of[-1,1])bx(root,t,wh,W,cv,s*W/2,wh/2,0);const dw=1.2;for(const s of[-1,1]){bx(root,(W-dw)/2,wh,t,cv,s*(W/2-(W-dw)/4),wh/2,W/2);const f=new THREE.Group();put(root,f,s*dw/2,0,W/2,0,s*1.3,0);bx(f,t,wh-.4,dw/2,cv,0,(wh-.4)/2,dw/4+.03);}
  bx(root,dw,.4,t,cv,0,wh-.2,W/2);put(root,vPyramid(W+.4,W+.4,1.6,cv,.2),0,wh,0);
  for(const[s,ax]of[[1,'x'],[-1,'x'],[1,'z'],[-1,'z']])for(let i=0;i<10;i++){const p=-W/2-.2+.2+i*.4,cm=vm(i%2?'woolWhite':c);if(ax==='x')bx(root,.4,.3,.03,cm,p,wh-.1,s*(W/2+.215));else bx(root,.03,.3,.4,cm,s*(W/2+.215),wh-.1,p);}
  bx(root,.1,wh+2.2,.1,vm('planksDark'),0,(wh+2.2)/2,0);bx(root,.18,.18,.18,vm('gold'),0,wh+2.29,0);kFlag(root,0,wh+2.15,0,c,.6,.36);
  poCot(root,-1,-.6,0,c);vChest(root,.9,-1.4,0,false);const tb=vTable(root,.9,.2,.9,.6);bx(tb,.3,.01,.4,vm('paper'),0,.905,0);kCandle(root,1.2,.9,.2,.14);
  {const st=new THREE.Group();put(root,st,1.4,0,1.2,0,-.5,0);bx(st,.4,.06,.4,vm('planks'),0,.45,0);for(const[a,b]of[[1,1],[1,-1],[-1,1],[-1,-1]])bx(st,.05,.42,.05,vm('planksDark'),a*.16,.21,b*.16);}
  vLantern(root,L,-(W/2-.05),1.5,W/2);return root;}
/* ---------- command tent ---------- */
function acCommand(s,o){const root=kRoot(3.6),L=root.userData.lights,c=acCol(o),T=kWallTent(root,0,0,0,{L:4.8,W:4.4,wh:1.8,rh:1.4,trim:c});bx(root,4.2,.02,4.6,vm('rug'),0,.01,0).castShadow=false;
  const tb=vTable(root,0,-.2,2,1.2);bx(tb,1.7,.01,1,vm('paper'),0,.905,0);const r=mulberry32(5);for(let i=0;i<9;i++){const red=i<5;bx(tb,.07,.1,.07,vm(red?c:'woolWhite'),(red?-.5:.4)+(r()-.5)*.5,.96,(r()-.5)*.6);}
  bx(tb,.3,.02,.05,vm('iron'),.1,.915,.35,0,.6,0);kCandle(root,-.85,.9,-.65,.14);
  for(const[x,z,ry]of[[-1.3,-.2,Math.PI/2],[1.3,-.2,-Math.PI/2],[0,-1.2,0]]){const g=new THREE.Group();put(root,g,x,0,z,0,ry,0);bx(g,.46,.06,.44,vm('planks'),0,.46,0);bx(g,.46,.5,.06,vm('planks'),0,.74,-.2);for(const[a,b]of[[1,1],[1,-1],[-1,1],[-1,-1]])bx(g,.05,.44,.05,vm('planksDark'),a*.19,.22,b*.18);}
  vChest(root,-1.4,-2,0,false);vChest(root,1.4,-2,0,true);bx(root,.08,2.4,.08,vm('planksDark'),1.85,1.2,-1.9);bx(root,.6,.06,.06,vm('planksDark'),1.6,2.36,-1.9);
  {const b=new THREE.Group();put(root,b,1.6,2.33,-1.86);bx(b,.5,.9,.03,vm(c),0,-.45,0);bx(b,.2,.2,.035,vm('woolWhite'),0,-.4,0,0,0,Math.PI/4);bx(b,.5,.05,.035,vm('gold'),0,-.88,0);}
  kHangLamp(root,L,0,T.userData.ridgeY,.6,.5);return root;}
/* ---------- weapon rack ---------- */
function acRack(s,o){const root=kRoot(1.8),c=acCol(o),d=vm('planksDark'),p=vm('planks');bx(root,2.4,.08,.5,p,0,.04,0);
  for(const s of[-1,1]){bx(root,.12,1.8,.12,d,s*1.14,.9,0);bx(root,.12,.1,.5,d,s*1.14,.13,0);}bx(root,2.4,.1,.1,d,0,1.75,0);
  for(const zz of[-.06,.06])bx(root,1.1,.06,.04,p,-.55,1.15,zz);for(let i=0;i<5;i++)acSpear(root,-1+i*.22,.08,0);
  for(const zz of[.14,.26])bx(root,1,.06,.04,p,.6,1.2,zz);for(let i=0;i<4;i++){const g=wSword();put(root,g,.24+i*.24,1.28,.2,0,0,Math.PI);}
  for(const s of[-1,1]){put(root,wHeater(c,'woolWhite'),s*1.24,1.05,0,0,s*Math.PI/2,0);bx(root,.06,.06,.06,vm('iron'),s*1.22,1.52,0);}return root;}
/* ---------- armoury lean-to ---------- */
function acArmoury(s,o){const root=kRoot(3),c=acCol(o),d=vm('planksDark'),W=4.4,D=2.2;bx(root,W,.12,D,vm('planks'),0,.06,0);
  for(let i=0;i<11;i++)bx(root,.4,2.6,.1,vm('planksV'),-W/2+.2+i*.4,1.3,-D/2+.05);for(const s of[-1,1]){bx(root,.16,2.6,.16,d,s*(W/2-.08),1.3,-D/2+.18);bx(root,.16,2.1,.16,d,s*(W/2-.08),1.05,D/2-.1);}
  bx(root,W,.14,.14,d,0,2.13,D/2-.1);const rf=new THREE.Group();put(root,rf,0,2.42,0,Math.atan2(.5,D),0,0);bx(rf,W+.4,.1,D+.6,vm('shingle'),0,.05,0);
  put(root,aOnStand('mail'),-1.2,.12,.1);put(root,aOnStand('leather'),0,.12,.1);put(root,aOnStand('quilt'),1.2,.12,.1);
  for(const[x,y]of[[-1.6,1.9],[-.55,1.95],[.55,1.95],[1.6,1.9]]){const sh=wHeater(c,'woolWhite');put(root,sh,x,y,-D/2+.15);bx(root,.06,.06,.08,vm('iron'),x,y+.47,-D/2+.12);}
  bx(root,1.4,.06,.3,d,1.3,1.25,-D/2+.25);for(const[x,h]of[[.85,aHelmNasal],[1.3,aHelmKettle],[1.75,aHelmGreat]])put(root,h(),x,1.28,-D/2+.25);
  const bar=vBarrel(root,-1.9,.6);bar.position.y=.12;const ar=wArrows();put(bar,ar,0,.62,0);acShield(root,2.15,1,-Math.PI/2,c,.2);return root;}
/* ---------- training dummy (clip Hit) ---------- */
function acDummy(){const root=kRoot(1.2),bu=vm('burlap');bx(root,.6,.14,.6,vm('dirt'),0,.07,0);const P=new THREE.Group();P.name='dummy';put(root,P,0,.1,0);
  bx(P,.14,1.5,.14,vm('planks'),0,.75,0);bx(P,.56,.74,.34,vm('hay'),0,1.25,0);bx(P,.6,.68,.38,bu,0,1.28,0);bx(P,.62,.06,.4,vm('rope'),0,1.0,0);bx(P,.62,.06,.4,vm('rope'),0,1.45,0);
  for(const s of[-1,1]){const a=new THREE.Group();put(P,a,s*.3,1.56,0,0,0,s*.35);bx(a,.16,.56,.16,bu,s*.06,-.26,0);bx(a,.18,.04,.18,vm('rope'),s*.06,-.46,0);}
  bx(P,.12,.1,.12,vm('planks'),0,1.67,0);bx(P,.32,.32,.3,bu,0,1.88,0);bx(P,.34,.04,.32,vm('rope'),0,1.75,0);put(P,aHelmKettle(),0,1.98,0);
  bx(P,.42,.42,.05,vm('woolWhite'),0,1.32,.2);bx(P,.24,.24,.055,vm('woolRed'),0,1.32,.2);
  propAnim(root,[P],[{name:'Hit',dur:2,next:'Idle',fn:(t,S)=>{const k=Math.exp(-t*2.6);S.dummy={r:[-.28*Math.sin(t*11)*k,0,.06*Math.sin(t*8)*k]};}},
    {name:'Spin hit',dur:2.2,next:'Idle',fn:(t,S)=>{const k=Math.exp(-t*2.2);S.dummy={r:[-.12*Math.sin(t*10)*k,(1-k)*Math.PI*2*.25+Math.sin(t*6)*.2*k,0]};}}]);return root;}
/* ---------- archery butt ---------- */
function acButt(){const root=kRoot(1.6),t=new THREE.Group();put(root,t,0,0,0);vHay(t,-.4,0,0);vHay(t,.4,0,0);vHay(t,0,.8,0);
  for(const s of[-1,1])bx(t,.12,1.6,.12,vm('planksDark'),s*.5,.8,-.6,-.28,0,0);[[.96,'woolWhite'],[.72,'woolRed'],[.48,'woolWhite'],[.24,'gold']].forEach(([w,c],i)=>bx(t,w,w,.04,vm(c),0,1.2,.42+i*.012));
  for(const[ax,ay,ry]of[[.08,.06,.1],[-.2,.18,-.15],[.25,-.15,.2],[-.05,-.28,0]]){const a=new THREE.Group();put(t,a,ax,1.2+ay,.47,0,ry,0);bx(a,.03,.03,.55,vm('planks'),0,0,.27);bx(a,.1,.02,.12,vm('woolWhite'),0,0,.5);bx(a,.02,.1,.12,vm('woolWhite'),0,0,.5);}return root;}
/* ---------- camp kitchen ---------- */
function acKitchen(){const root=kRoot(2.8),L=root.userData.lights;vFirePit(root,0,0,L);const top=1.7;for(let i=0;i<3;i++){const a=i/3*Math.PI*2+.3;wlBeam(root,[Math.sin(a)*.9,0,Math.cos(a)*.9],[0,top,0],.07,vm('planksDark'));}
  bx(root,.14,.14,.14,vm('rope'),0,top-.04,0);for(let i=0;i<5;i++)bx(root,i%2?.02:.04,.1,i%2?.04:.02,vm('iron'),0,top-.16-i*.1,0);
  const ca=new THREE.Group();put(root,ca,0,.62,0);hollow(ca,.6,.42,.6,.06,vm('iron'));bx(ca,.5,.02,.5,vm('stew'),0,.34,0);for(const s of[-1,1])bx(ca,.04,.18,.04,vm('iron'),s*.2,.5,0);bx(ca,.44,.04,.04,vm('iron'),0,.6,0);
  for(const[x,z,a]of[[0,1.5,0],[-1.6,-.2,Math.PI/2]])vlog(root,1.2,.32,.32,'x',x,.16,z).rotation.y=a;
  const tb=vTable(root,1.9,-.4,1.2,.6,-Math.PI/2);for(let i=0;i<3;i++)bx(tb,.16,.1,.24,vm('hay'),-.35+i*.24,.95,.05);bx(tb,.18,.16,.18,vm('leaves'),.3,.98,-.1);bx(tb,.3,.04,.2,vm('planksDark'),.3,.92,.15);bx(tb,.03,.02,.2,vm('iron'),.3,.95,.15);
  vSack(root,2.1,.8);vSack(root,2.5,.5);vBarrel(root,2.4,-1.4,true);vWoodpile(root,4,3,-1.2,-1.6,.2);put(root,TOOLS.Ladle.build(),.2,.98,.15,0,0,.3);return root;}
/* ---------- supply wagon ---------- */
function acWheel(par,x,y,z){const g=new THREE.Group();put(par,g,x,y,z,0,Math.PI/2,0);wlWheel(g,.48);return g;}
function acWagon(){const root=kRoot(3.6),d=vm('planksDark'),p=vm('planks');
  for(const z of[-1,1]){bx(root,1.9,.14,.14,d,0,.52,z);for(const s of[-1,1]){acWheel(root,s*.85,.52,z);bx(root,.1,.32,.2,d,s*.55,.74,z);}}
  bx(root,1.5,.1,3,p,0,.95,0);for(const s of[-1,1])bx(root,.08,.5,3,p,s*.71,1.25,0);bx(root,1.5,.5,.08,p,0,1.25,-1.46);
  put(root,vArchRoof(1.5,2.4,.9,vm('canvasW'),{ov:.06,ovL:0,step:.15}),0,1.5,-.25,0,Math.PI/2,0);for(const s of[-1,1])bx(root,.06,.5,2.4,vm('canvasW'),s*.75,1.25,-.25);
  vBarrel(root,-.35,.95);root.children[root.children.length-1].position.y=1;vCrate(root,.5,.35,1,1,.1);vSack(root,.3,.4,1);vSack(root,-.3,.35,1);
  for(const s of[-1,1])wlBeam(root,[s*.35,.85,-1.5],[s*.4,.05,-3.4],.1,d);bx(root,.9,.08,.08,d,0,.5,-2.5);bx(root,.3,.1,.3,vm('cobble'),.4,.05,-3.4);return root;}
/* ---------- supply dump ---------- */
function acSupplies(){const root=kRoot(2.8),r=mulberry32(19);for(let i=0;i<3;i++)vCrate(root,.6,-1.6+i*.62,0,-.6,(r()-.5)*.1);for(let i=0;i<2;i++)vCrate(root,.6,-1.3+i*.62,.6,-.6,(r()-.5)*.1);vCrate(root,.6,-1,1.2,-.6,.05);
  for(let i=0;i<3;i++)vBarrel(root,.4+i*.66,-.7);vBarrel(root,.73,-.7).position.y=.8;
  for(let i=0;i<3;i++){const b=new THREE.Group();put(root,b,.2+i*.62,.3,.5,0,0,Math.PI/2);bx(b,.6,.8,.6,vm('barrel'),0,0,0);}for(const x of[-.3,1.6])bx(root,.12,.2,.8,vm('planksDark'),x,.1,.5);
  for(let i=0;i<4;i++)vSack(root,-1.8+i*.42,.5);vSack(root,-1.6,.5,.5);vSack(root,-1.2,.5,.5);
  {const g=new THREE.Group();put(root,g,2.3,0,.2);for(let i=0;i<6;i++){const sp=TOOLS.Spear.build();put(g,sp,(i%3-1)*.06,.35,(Math.floor(i/3)-.5)*.06,Math.PI/2,0,0);sp.position.y=.06+Math.floor(i/3)*.05;}for(const z of[-.6,.6])bx(g,.2,.06,.06,vm('rope'),0,.08,z);}
  put(root,wArrows(),2.3,.02,-.8);put(root,wArrows(),2.55,.02,-.6);return root;}
/* ---------- camp standard ---------- */
function acBanner(s,o){const root=kRoot(1.6),c=acCol(o),H=5;for(let i=0;i<9;i++){const a=i/9*Math.PI*2;bx(root,.3,.24,.3,vm('cobble'),Math.sin(a)*.32,.12,Math.cos(a)*.32,0,a,0);}bx(root,.3,.3,.3,vm('cobble'),0,.39,0);
  bx(root,.12,H,.12,vm('planksDark'),0,H/2,0);bx(root,.2,.2,.2,vm('gold'),0,H+.1,0);bx(root,1.1,.08,.08,vm('planksDark'),.6,H-.25,0);
  const g=new THREE.Group();put(root,g,.65,H-.29,0);bx(g,.9,1.6,.04,vm(c),0,-.8,0);bx(g,.9,.08,.05,vm('gold'),0,-.04,0);bx(g,.9,.06,.05,vm('gold'),0,-1.57,0);
  bx(g,.4,.4,.05,vm('woolWhite'),0,-.75,0,0,0,Math.PI/4);bx(g,.22,.22,.055,vm(c),0,-.75,0,0,0,Math.PI/4);for(let i=0;i<4;i++)bx(g,.12,.2,.04,vm('gold'),-.36+i*.24,-1.7,0);return root;}
/* ---------- horse lines ---------- */
function acPicket(){const root=kRoot(3.6),d=vm('planksDark');for(const s of[-1,1])vlog(root,.24,1.4,.24,'y',s*2.6,.7,0);bx(root,5.2,.04,.04,vm('rope'),0,1.2,0);for(let i=0;i<5;i++)bx(root,.03,.3,.03,vm('rope'),-1.6+i*.8,1.05,0);
  for(const s of[-1,1])bx(root,.06,.1,.1,vm('rope'),s*2.48,1.2,0);const tr=new THREE.Group();put(root,tr,-.8,0,-1);hollow(tr,1.6,.4,.5,.08,d,0,.12,0);bx(tr,1.44,.02,.34,vm('water'),0,.42,0);for(const s of[-1,1])bx(tr,.1,.12,.5,d,s*.6,.06,0);
  {const h=new THREE.Group();put(root,h,1.1,0,-1.1);bx(h,1.2,.3,.9,vm('hay'),0,.15,0);bx(h,.8,.25,.6,vm('hay'),.05,.42,0);bx(h,.4,.12,.3,vm('hay'),.1,.6,.05);}
  const sh=new THREE.Group();put(root,sh,.8,0,1.4);for(const s of[-1,1])for(const zz of[-1,1])wlBeam(sh,[s*.7,0,zz*.25],[s*.7,.8,0],.07,d);bx(sh,1.6,.12,.12,d,0,.82,0);
  for(const s of[-1,1]){const sd=new THREE.Group();put(sh,sd,s*.38,.88,0);bx(sd,.5,.08,.62,vm('leather'),0,0,0);bx(sd,.5,.14,.08,vm('leather'),0,.08,-.26);bx(sd,.5,.1,.08,vm('leather'),0,.06,.27);for(const t of[-1,1])bx(sd,.04,.36,.04,vm('leather'),0,-.2,t*.3);bx(sd,.52,.04,.4,vm('woolRed'),0,-.05,0);}
  put(root,TOOLS.Bucket.build(),-1.9,.47,-.9);return root;}
/* ---------- field forge ---------- */
function acForge(){const root=kRoot(2.4),L=root.userData.lights,st=vm('stoneBrick');bx(root,1.4,.9,1,st,-.6,.45,-.3);bx(root,1.2,.04,.8,vm('coal'),-.6,.92,-.3);const e=bx(root,.6,.05,.4,EMBER,-.6,.94,-.3);e.castShadow=false;
  for(const s of[-1,1])bx(root,.14,.2,1,st,-.6+s*.63,1,-.3);bx(root,1.4,.3,.14,st,-.6,1.05,-.73);vFlame(root,-.6,.94,-.3,.08,L,1.2);
  const bw=new THREE.Group();put(root,bw,-1.75,.5,-.3);bx(bw,.5,.06,.8,vm('planksDark'),0,.15,0);bx(bw,.5,.06,.8,vm('planksDark'),0,-.05,0,.12,0,0);bx(bw,.44,.18,.7,vm('leather'),0,.05,0);bx(bw,.08,.08,.4,vm('iron'),0,.05,.55);bx(bw,.06,.3,.06,vm('planksDark'),0,.3,-.38);
  for(const s of[-1,1])bx(root,.12,.45,.5,vm('planksDark'),-1.75+s*.18,.225,-.3);
  const av=buildWorkpiece('anvil',.85);put(root,av,.8,0,.1,0,.4,0);put(root,TOOLS.Hammer.build(),.8,.95,.1,Math.PI/2,0,.3);
  const qt=new THREE.Group();put(root,qt,.3,0,-.95);hollow(qt,.8,.5,.5,.06,vm('barrel'));bx(qt,.68,.02,.38,vm('water'),0,.42,0);put(root,TOOLS.Tongs.build(),.25,.6,-.95,0,0,.5);
  const gs=new THREE.Group();put(root,gs,1.3,0,-.9);for(const s of[-1,1])bx(gs,.08,.6,.08,vm('planksDark'),s*.18,.3,0);const wh=new THREE.Group();put(gs,wh,0,.62,0,0,Math.PI/2,0);vDiscV(wh,.3,vm('stone'),vm('stone'));bx(gs,.44,.04,.04,vm('iron'),0,.62,0);
  for(let i=0;i<4;i++)bx(root,.4,.06,.08,vm('iron'),.1+i*.02,.03+i*.06,.9,0,.2*i,0);return root;}
/* ---------- mess table ---------- */
function acMess(){const root=kRoot(2.4),r=mulberry32(4);const tb=vTable(root,0,0,3.2,.9);for(const s of[-1,1]){bx(root,3,.08,.32,vm('planks'),0,.45,s*.75);for(const x of[-1.3,0,1.3])bx(root,.08,.41,.28,vm('planksDark'),x,.205,s*.75);}
  for(let i=0;i<6;i++){const x=-1.2+i*.48,z=(i%2?.25:-.25);bx(tb,.22,.04,.22,vm('clayPot'),x,.92,z);bx(tb,.16,.02,.16,vm('stew'),x,.94,z);bx(tb,.08,.12,.08,vm('barrel'),x+.17,.96,z*.4);bx(tb,.03,.02,.14,vm('planksDark'),x-.14,.915,z);}
  for(let i=0;i<3;i++)bx(tb,.18,.1,.28,vm('hay'),-.6+i*.6,.95,0,0,r()*.6,0);bx(tb,.18,.26,.18,vm('clayPot'),1.35,1.03,0);bx(tb,.1,.06,.1,vm('clayPot'),1.35,1.19,0);return root;}
/* ---------- watch platform ---------- */
function acWatch(){const root=kRoot(2.6),L=root.userData.lights,d=vm('planksDark'),H=3,S=1.2;for(const[a,b]of[[1,1],[1,-1],[-1,1],[-1,-1]])vlog(root,.2,H+1.1,.2,'y',a*S,(H+1.1)/2,b*S);
  for(const s of[-1,1]){wlBeam(root,[s*S,.3,-S],[s*S,H-.2,S],.1,d);wlBeam(root,[-S,.3,s*S],[S,H-.2,s*S],.1,d);}
  bx(root,2.8,.12,2.8,vm('planks'),0,H,0);for(const[a,b]of[[1,0],[-1,0],[0,-1]]){const lx=a?.1:2.8,lz=a?2.8:.1;bx(root,lx,.9,lz,vm('planksV'),a*1.35,H+.51,b*1.35);}
  for(const s of[-1,1])bx(root,.9,.9,.1,vm('planksV'),s*.95,H+.51,1.35);
  const lh=Math.hypot(H,.6)+.2,ld=new THREE.Group();put(root,ld,0,0,1.45+.6,-Math.atan2(.6,H),0,0);for(const s of[-1,1])bx(ld,.08,lh,.08,d,s*.25,lh/2,0);for(let i=0;i<8;i++)bx(ld,.5,.06,.06,vm('planks'),0,.35+i*.36,0);
  for(const[a,b]of[[1,1],[1,-1],[-1,1],[-1,-1]])bx(root,.06,.36,.06,vm('iron'),.5+a*.15,H+.24,-.5+b*.15);bx(root,.4,.12,.4,vm('iron'),.5,H+.46,-.5);bx(root,.3,.04,.3,EMBER,.5,H+.53,-.5);vFlame(root,.5,H+.52,-.5,.1,L,1);
  put(root,TOOLS.Spear.build(),-1.1,H+1.01,-1.1,0,0,.08);return root;}
/* ---------- the whole camp ---------- */
function acCamp(s,o){const root=kRoot(17),L=root.userData.lights;vYard(root,32,30,0,0);const c={color:acCol(o)};
  const add=(fn,x,z,ry=0)=>{const a=fn(1,c);a.userData.lights.forEach(l=>L.push(l));put(root,a,x,0,z,0,ry,0);return a;};
  add(acCommand,0,-9);add(acPavilion,-6,-9.4);add(acBanner,3.4,-6.4);add(acBanner,-3.4,-6.4);
  for(const x of[-11,-7.6,-4.2,4.2,7.6,11]){add(acTent,x,-2.6);add(acTent,x,3,Math.PI);}add(acKitchen,-5,8.2);add(acMess,-4.6,12);add(acArmoury,6,-9.6);
  add(acRack,9.6,-5.6,-Math.PI/2);add(acDummy,3,8);add(acDummy,4.6,8);add(acDummy,6.2,8);add(acButt,11.4,7.4,-Math.PI/2);add(acButt,11.4,10.4,-Math.PI/2);
  add(acWagon,-10.6,12.4,Math.PI/2);add(acSupplies,-11.6,7.6,Math.PI/2);add(acPicket,4,12.6);add(acForge,11.4,-9.6,-Math.PI/2);add(acWatch,-12.6,-10.6,.785);
  bx(root,1.8,.02,18,vm('dirtRoad'),0,.012,3.6).castShadow=false;
  for(const[x,z,a]of[[-15,0,Math.PI/2],[-15,-8,Math.PI/2],[15,0,Math.PI/2],[15,-8,Math.PI/2],[-9,-14.4,0],[1,-14.4,0],[9,-14.4,0],[-10,14.4,0],[10,14.4,0],[-15,8.6,Math.PI/2],[15,8.6,Math.PI/2]])vStakes(root,x,z,a,6);
  return root;}

const AC=(id,name,build,desc,x={})=>ASSETS.push(Object.assign({id:'ac-'+id,folder:'buildings/medieval/army',name,build,desc},x));
const acOpt={opts:[{key:'color',label:'Army colour',choices:AC_COL,def:'woolRed'}]};
AC('tent','Soldier\'s tent',acTent,'Clean white canvas A-frame tent for two, with a pennant in the army colour; a bedroll laid out and one rolled inside, a helmet on a crate and a shield leaning against it.',acOpt);
AC('pavilion','Officer\'s pavilion',acPavilion,'Square canvas pavilion with a pyramid roof, a scalloped valance in the army colour, a pennant and a gold ball on the centre pole; inside a rug, a cot, a chest, a table with orders and a candle, and a stool.',acOpt);
AC('command','Command tent',acCommand,'Large wall tent with trim in the army colour: a map table with markers for both sides, a dagger and a candle, three chairs, two chests, a standard and a hanging lamp.',acOpt);
AC('rack','Weapon rack',acRack,'Planed timber rack with five spears standing in a slotted rail, four swords hung blade down and a shield in the army colour hung on each end.',acOpt);
AC('armoury','Armoury lean-to',acArmoury,'Plank lean-to under a shingle roof: mail, leather and quilted armour on stands, shields in the army colour on the back wall, three helmets on a shelf, a barrel of arrows and a shield at the side.',acOpt);
AC('dummy','Training dummy',acDummy,'Straw dummy in a burlap coat on a post, arms hanging, a target on its chest and a kettle helmet. Clips: Hit (it rocks back and wobbles) and Spin hit.');
AC('butt','Archery butt',acButt,'Three hay bales on two leaning props with a painted target face and four arrows in it.');
AC('kitchen','Camp kitchen',acKitchen,'Stone-ringed fire under a tripod with a cauldron of stew on a chain, log seats, a table with bread, a cabbage and a knife, sacks, a water barrel and a woodpile.');
AC('wagon','Supply wagon',acWagon,'Covered supply wagon on four wheels with axles and bearings, loaded with a barrel, a crate and sacks; the shafts rest on the ground on a stone.');
AC('supplies','Supply dump',acSupplies,'Stacked crates, barrels standing and lying in a cradle, a pile of sacks, a bundle of spare spears and two quivers of arrows.');
AC('banner','Camp standard',acBanner,'Tall standard in a cairn of stones: a banner in the army colour with a white diamond, gold borders and a fringe, hung from the arm of the pole; gold ball on top.',acOpt);
AC('picket','Horse lines',acPicket,'Picket rope between two posts with tie ropes, a water trough, a heap of hay, two saddles on a saddle rack and a bucket. Horses are added by scenes.');
AC('forge','Field forge',acForge,'Open stone hearth with glowing coals, a leather bellows on a stand, an anvil on a stump with a hammer, a quench tub with tongs, a grindstone and iron bars.');
AC('mess','Mess table',acMess,'Long table with two benches, bowls of stew, mugs, spoons, loaves and a jug.');
AC('watch','Watch platform',acWatch,'3 m timber platform on four posts with diagonal braces and a plank parapet, a ladder leaning against the open front, a fire basket and a spear.');
AC('camp','Army camp',acCamp,'The whole camp inside a ring of stake barricades: command tent, officer\'s pavilion and armoury at the head with two standards, two rows of soldiers\' tents, the kitchen and mess, a weapon rack, training dummies and archery butts, the forge, the supply wagon and dump, the horse lines and a watch platform.',Object.assign({groundR:17},acOpt));
