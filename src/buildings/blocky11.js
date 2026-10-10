/* ======================= school and church (no crosses anywhere) ======================= */
VXD.stained=(P,r)=>{const cols=['#b0302a','#2a4a9a','#d8a830','#3a7a3a','#7a3a8a','#2a7a8a'];for(let y=0;y<16;y++)for(let x=0;x<16;x++){const lead=(x+y)%8===0||(x-y+16)%8===0;const cell=Math.floor((x+y)/8)*3+Math.floor((x-y+16)/8);P(x,y,lead?'#24221e':cols[cell%cols.length],lead?1:nz(r,.85,1.08));}};
VXD.chalk=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,'#2a3430',nz(r,.9,1.08));for(const[y,x0,x1]of[[3,2,11],[6,2,8],[9,2,13],[12,2,6]])for(let x=x0;x<=x1;x++)if((x*7+y)%5)P(x,y,'#d8d8cc',nz(r,.9,1));};
const STAINED=new THREE.MeshStandardMaterial({map:vxTex('stained'),emissiveMap:vxTex('stained'),emissive:0xffffff,emissiveIntensity:0,roughness:.25,metalness:.1});STAINED.userData.glowScale=.75;GLOW.push(STAINED);
ICONS.book=(g,x,y,z)=>{for(const s of[-1,1]){bx(g,.04,.26,.4,vm('leather'),x*s,y,z);bx(g,.045,.2,.16,vm('woolWhite'),x*s,y+.01,z-.09);bx(g,.045,.2,.16,vm('woolWhite'),x*s,y+.01,z+.09);for(const k of[-.09,.09])for(const yy of[.05,0,-.05])bx(g,.05,.015,.1,vm('dark'),x*s,y+yy,z+k);}};
/* tall window with a stepped pointed head, filled with stained glass, no mullions */
function vStained(par,x,y0,w,h,t,z=0){const g=new THREE.Group();put(par,g,x,y0,z);const gl=box(w,h,.05,STAINED,{s:.8,ox:0,oy:0,oz:0});gl.castShadow=false;put(g,gl,0,h/2,-t/2);
  for(const s of[-1,1]){bx(g,.2,.2,t,vm('stoneBrick'),s*(w/2-.1),h-.1,-t/2);bx(g,.12,.12,t,vm('stoneBrick'),s*(w/2-.26),h-.06,-t/2);}bx(g,w+.24,.12,t+.16,vm('cobble'),0,-.06,-t/2+.08);return g;}
function vBelfryBell(par,x,y,z,s=1){const g=new THREE.Group();put(par,g,x,y,z);g.scale.setScalar(s);bx(g,1.2,.16,.16,vm('timber'),0,0,0);bx(g,.06,.2,.06,vm('iron'),0,-.15,0);bx(g,.36,.12,.36,vm('gold'),0,-.3,0);bx(g,.48,.36,.48,vm('gold'),0,-.54,0);bx(g,.58,.1,.58,vm('gold'),0,-.76,0);bx(g,.08,.14,.08,vm('iron'),0,-.86,0);return g;}

/* ---------- Church ---------- */
function vxChurch(){const root=new THREE.Group(),L=[];root.userData.lights=L;const Lx=7,Dz=12,pl=.6,hw=5,H=4.4,t=.5,sb=vm('stoneBrick'),cb=vm('cobble');
  vYard(root,12,20,0,1.8);bx(root,Lx+.4,pl,Dz+.4,cb,0,pl/2,0);
  const side=[-4,-1.4,1.2,3.8].map(x=>({type:'hole',x,w:.9,y0:1.3,y1:3.9}));
  const W=vWalls({Lx,Dz,y:pl,h:hw,t,mat:sb,ops:{front:[],back:[{type:'hole',x:0,w:1.3,y0:1.6,y1:4.4}],right:side,left:side}});root.add(W.group);
  for(const k of['right','left'])for(const op of side)vStained(W.faces[k],op.x,op.y0,op.w,op.y1-op.y0,t);vStained(W.faces.back,0,1.6,1.3,2.8,t);
  // buttresses between the windows
  for(const sd of[-1,1])for(const z of[-5.6,-2.7,-.1,2.5]){bx(root,.9,hw-.6,.7,sb,sd*(Lx/2+.4),pl+(hw-.6)/2,z);bx(root,.6,1.2,.5,sb,sd*(Lx/2+.32),pl+hw-.6+.4,z);bx(root,1,.3,.8,cb,sd*(Lx/2+.42),pl+.15,z);}
  put(root,vRoof(Lx,Dz,H,vm('slate'),{ov:.5,ovL:.4,step:.4,gable:sb,gt:.5,ridge:cb}),0,pl+hw,0,0,Math.PI/2,0);
  // west tower with portal, round window, open belfry and spire
  const TW=3.6,TH=11,tz=Dz/2+TW/2-.5,T=new THREE.Group();put(root,T,0,0,tz);
  bx(T,TW+.4,pl+.2,TW+.4,cb,0,(pl+.2)/2,0);bx(T,TW,TH-pl,TW,sb,0,pl+(TH-pl)/2,0);for(const y of[4.6,8.2])bx(T,TW+.16,.24,TW+.16,cb,0,y,0);
  for(const[x,z]of[[1,1],[1,-1],[-1,1],[-1,-1]])bx(T,.5,TH-pl,.5,cb,x*(TW/2-.05),pl+(TH-pl)/2,z*(TW/2-.05));
  const fz=TW/2;bx(T,2.4,3.2,.3,cb,0,pl+1.6,fz+.1);bx(T,2,.3,.32,cb,0,pl+3.05,fz+.12);for(const s of[-1,1])bx(T,.3,.3,.32,sb,s*.85,pl+2.75,fz+.12);
  bx(T,1.7,2.6,.06,vm('dark'),0,pl+1.3,fz+.27);for(const s of[-1,1]){bx(T,.82,2.5,.08,vm('planksDark'),s*.42,pl+1.25,fz+.3);for(const y of[.6,1.9])bx(T,.7,.08,.04,vm('iron'),s*.42,pl+y,fz+.35);bx(T,.08,.12,.05,vm('iron'),s*.12,pl+1.2,fz+.36);}
  const rw=new THREE.Group();put(T,rw,0,6.4,fz+.05);bx(rw,1.2,1.2,.06,STAINED,0,0,.02);bx(rw,1.2,1.2,.05,STAINED,0,0,.02,0,0,Math.PI/4);for(const[w,h,x,y]of[[1.5,.2,0,.72],[1.5,.2,0,-.72],[.2,1.5,.72,0],[.2,1.5,-.72,0]])bx(rw,w,h,.14,cb,x,y,.05);
  for(const s of[-1,1])vSlit(T,s*(TW/2+.01),5.6,0,s*Math.PI/2),vSlit(T,s*(TW/2+.01),8.8,0,s*Math.PI/2);
  const by=TH;bx(T,TW+.2,.3,TW+.2,cb,0,by+.15,0);for(const[x,z]of[[1,1],[1,-1],[-1,1],[-1,-1]])bx(T,.8,2.6,.8,sb,x*(TW/2-.4),by+.3+1.3,z*(TW/2-.4));
  for(const sd of[-1,1]){bx(T,TW,.5,.4,sb,0,by+.55,sd*(TW/2-.2));bx(T,.4,.5,TW,sb,sd*(TW/2-.2),by+.55,0);}
  vBelfryBell(T,0,by+2.5,0,1.3);bx(T,TW+.4,.36,TW+.4,cb,0,by+3.08,0);
  put(T,vPyramid(TW+.6,TW+.6,5.2,vm('slate'),.26),0,by+3.26,0);bx(T,.14,.5,.14,vm('iron'),0,by+8.7,0);bx(T,.36,.36,.36,vm('gold'),0,by+9.1,0);bx(T,.2,.2,.2,vm('gold'),0,by+9.38,0);
  for(let i=0;i<3;i++)bx(root,3.2-i*.4,.2,.5,cb,0,.1+i*.2,tz+TW/2+1.2-i*.4);
  for(const s of[-1,1]){vlog(root,.2,2.4,.2,'y',s*2.2,1.2,tz+TW/2+1.2);vLantern(root,L,s*2.2,2.7,tz+TW/2+1.05);vBench(root,s*3.4,tz+TW/2+.4);}
  vBush(root,-4.8,-3,1.1);vBush(root,4.8,-5,1);vTree(root,5.6,3,3,.9);root.userData.ground=13;return root;}

/* ---------- School ---------- */
function vxSchool(){const root=new THREE.Group(),L=[];root.userData.lights=L;const Lx=8,Dz=5.6,base=.4,hw=2.8,H=2.6;
  vYard(root,12,11,0,2);bx(root,Lx+.2,base,Dz+.2,vm('cobble'),0,base/2,0);
  const W=vWalls({Lx,Dz,y:base,h:hw,t:.2,mat:vm('plaster'),ops:{front:[{type:'door',x:0,w:1.2,y0:0,y1:2.2},{x:-2.6,w:1.4,y0:.8,y1:2},{x:2.6,w:1.4,y0:.8,y1:2}],back:[-2.6,0,2.6].map(x=>({x,w:1.2,y0:.8,y1:2})),right:[{x:0,w:1.2,y0:.8,y1:2}],left:[{x:0,w:1.2,y0:.8,y1:2}]},frame:vm('timber'),unit:{shutter:vm('woolBlue')}});root.add(W.group);
  const top=base+hw;put(root,vRoof(Dz,Lx,H,vm('tiles'),{ov:.7,ovL:.6,step:.4,gable:vm('plaster'),ridge:vm('timber')}),0,top,0);
  bx(root,.8,H+1,.8,vm('stoneBrick'),-2.6,top+(H+1)/2,-1.3);bx(root,1,.16,1,vm('cobble'),-2.6,top+H+1.08,-1.3);
  // bell turret on the ridge
  const bt=new THREE.Group();put(root,bt,1.2,top+H+.1,0);bx(bt,1.2,.3,1.2,vm('planks'),0,.15,0);for(const[x,z]of[[1,1],[1,-1],[-1,1],[-1,-1]])vlog(bt,.14,1.1,.14,'y',x*.5,.85,z*.5);
  vBelfryBell(bt,0,1.3,0,.55);put(bt,vPyramid(1.5,1.5,.8,vm('shingle'),.2),0,1.4,0);bx(bt,.16,.16,.16,vm('gold'),0,2.3,0);
  const pc=vPorch(root,0,Dz/2,2.6,1.4,2.3,vm('tiles'));vHangSign(root,1.6,2.2,Dz/2+1.4,ICONS.book);vLantern(W.faces.front,L,-.9,2,0);
  // schoolyard: benches facing a chalk board, a tree and a satchel rack
  for(let i=0;i<2;i++)vBench(root,-2.6,Dz/2+2.4+i*1.2);vTree(root,3.4,Dz/2+3.8,2.6,.8);
  const rk=new THREE.Group();put(root,rk,Lx/2+.6,0,1);for(const s of[-1,1])bx(rk,.1,1.2,.1,vm('planksDark'),s*.6,.6,0);bx(rk,1.3,.08,.1,vm('planksDark'),0,1.15,0);
  ['leather','woolBlue','leather'].forEach((c,i)=>{bx(rk,.28,.3,.12,vm(c),-.4+i*.4,.9,.08);bx(rk,.04,.16,.04,vm('leather'),-.4+i*.4,1.1,.05);});
  vBarrel(root,-Lx/2-.5,Dz/2-.2,true);return root;}

ASSETS.push({id:'vx-school',folder:'buildings/medieval/civil',name:'School',build:vxSchool,desc:'Plaster-and-oak schoolhouse with large shuttered windows, a tiled entrance porch, a bell turret on the ridge, a book sign, and a yard with benches, a tree and a satchel rack.'},
 {id:'vx-church',folder:'buildings/medieval/civil',name:'Church',build:vxChurch,desc:'Stone church with buttressed walls, tall stained-glass windows, a slate roof and a front tower with a deep portal, a round window, an open belfry with a bell and a slate spire topped by a gold finial. No crosses.'});
