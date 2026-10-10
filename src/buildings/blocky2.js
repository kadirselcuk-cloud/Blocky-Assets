/* ======================= more blocky buildings: forester, toolsmith, blacksmith, tavern, town hall ======================= */
VXD.awningGreen=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,Math.floor(x/4)%2?'#e8e4dc':'#4a7a3a',nz(r,.92,1.04));};
VXD.woolBlue=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,'#3a5a9a',nz(r,.9,1.05));};
VXD.coal=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,r()<.15?'#4a4a50':'#1e1e22',nz(r,.85,1.1));};
const FIRE=new THREE.MeshStandardMaterial({color:0xffa040,emissive:0xff4a0a,emissiveIntensity:1.8,roughness:.6,transparent:true,opacity:.9});
function emberDraw(P,glow){const r=mulberry32(hashStr('embers'));for(let y=0;y<16;y++)for(let x=0;x<16;x++){const v=r(),f=nz(r,.85,1.1),chunk=((x>>2)+(y>>2)*3)%5;
  if(v<.22){P(x,y,glow?'#ffc070':'#ff7a1a',f);}else if(v<.36){P(x,y,glow?'#c03010':'#b02a12',f);}else if(glow)P(x,y,'#000000',1);else P(x,y,['#2a2624','#3a3430','#1c1a18','#4a4440','#24201e'][chunk],f);}}
VXD.embers=(P)=>emberDraw(P,false);VXD.embersE=(P)=>emberDraw(P,true);
const EMBER=new THREE.MeshStandardMaterial({map:vxTex('embers'),emissiveMap:vxTex('embersE'),emissive:new THREE.Color(0xff4a10),emissiveIntensity:2.2,roughness:.95});
function vTree(par,x,z,h=3,s=1){const g=new THREE.Group();put(par,g,x,0,z);vlog(g,.4,h,.4,'y',0,h/2,0);const lv=vm('leaves');
  bx(g,2.4*s,1,2.4*s,lv,0,h-.2,0);bx(g,1.8*s,.8,1.8*s,lv,0,h+.7,0);bx(g,1*s,.6,1*s,lv,0,h+1.4,0);bx(g,.8,.6,.8,lv,1*s,h+.1,.6*s);return g;}
function vTable(par,x,z,ry=0){const g=new THREE.Group();put(par,g,x,0,z,0,ry,0);const p=vm('planks'),d=vm('planksDark');bx(g,1.4,.1,.8,p,0,.78,0);for(const[a,b]of[[1,1],[1,-1],[-1,1],[-1,-1]])bx(g,.1,.73,.1,d,a*.6,.365,b*.3);
  for(const s of[-1,1]){bx(g,1.4,.08,.3,p,0,.45,s*.75);for(const a of[-1,1])bx(g,.08,.41,.08,d,a*.6,.205,s*.75);}
  bx(g,.12,.16,.12,vm('barrel'),-.3,.91,0);bx(g,.12,.16,.12,vm('barrel'),.35,.91,.15);return g;}
function vHangSign(par,x,y,z,icon){const g=new THREE.Group();put(par,g,x,y,z);bx(g,.06,.06,1,vm('iron'),0,0,.5);for(const zz of[.45,.9])bx(g,.02,.12,.02,vm('iron'),0,-.08,zz);bx(g,.1,.62,.66,vm('planks'),0,-.46,.68);icon(g,.07,-.46,.68);return g;}
const ICONS={
  hammer:(g,x,y,z)=>{for(const s of[-1,1]){bx(g,.04,.08,.08,vm('gold'),x*s,y+.1,z-.08);bx(g,.04,.08,.28,vm('gold'),x*s,y+.17,z);bx(g,.04,.3,.06,vm('gold'),x*s,y-.05,z);}},
  tankard:(g,x,y,z)=>{for(const s of[-1,1]){bx(g,.04,.28,.2,vm('gold'),x*s,y-.04,z-.02);bx(g,.04,.08,.22,vm('woolWhite'),x*s,y+.14,z-.02);bx(g,.04,.16,.06,vm('gold'),x*s,y-.02,z+.13);}},
  anvil:(g,x,y,z)=>{for(const s of[-1,1]){bx(g,.04,.08,.36,vm('iron'),x*s,y+.08,z);bx(g,.04,.12,.12,vm('iron'),x*s,y-.02,z);bx(g,.04,.06,.24,vm('iron'),x*s,y-.1,z);}},
  axe:(g,x,y,z)=>{for(const s of[-1,1]){bx(g,.04,.36,.05,vm('planks'),x*s,y,z+.04);bx(g,.04,.16,.12,vm('iron'),x*s,y+.1,z-.05);}},
};
function vToolMount(par,name,x,y,z,ry=0){const t=TOOLS[name].build();t.traverse(o=>{if(o.isMesh)o.castShadow=true;});put(par,t,x,y,z,-Math.PI/2,ry,0);return t;}

function vxForester(){const root=new THREE.Group(),L=[];root.userData.lights=L;const Lx=5.6,Dz=4.4,base=.3,hw=2.4,t=.3,H=2.4;
  vYard(root,8.8,8,0,1);bx(root,Lx+.1,base,Dz+.1,vm('cobble'),0,base/2,0);
  const ops={front:[{type:'door',x:.6,w:1,y0:0,y1:2},{x:-1.4,w:.8,y0:.8,y1:1.6,shutter:vm('woolBlue')}],back:[{x:0,w:.8,y0:.8,y1:1.6}],right:[{x:0,w:.8,y0:.8,y1:1.6,shutter:vm('woolBlue')}],left:[]};
  root.add(vWalls({Lx:Lx-.4,Dz:Dz-.4,y:base,h:hw,t,mat:vm('logH'),ops,unit:{frame:vm('planks')}}).group);
  for(const[sx,sz]of[[1,1],[1,-1],[-1,1],[-1,-1]])vlog(root,.4,hw+.2,.4,'y',sx*(Lx/2-.2),base+(hw+.2)/2,sz*(Dz/2-.2));
  put(root,vRoof(Dz,Lx,H,vm('shingle'),{ov:.8,ovL:.6,step:.4,gable:vm('planksV'),ridge:vm('planksDark')}),0,base+hw,0);
  // porch
  bx(root,Lx,.2,1.6,vm('planks'),0,base-.1,Dz/2+.8);for(const s of[-1,1])vlog(root,.3,2.2,.3,'y',s*(Lx/2-.3),base+1.1,Dz/2+1.4);
  bx(root,Lx+.4,.2,1.2,vm('shingle'),0,base+2.3,Dz/2+1.25);bx(root,Lx+.4,.2,.8,vm('shingle'),0,base+2.5,Dz/2+.85);bx(root,Lx,.16,.2,vm('planksDark'),0,base+2.12,Dz/2+1.4);
  // antlers over the door
  const an=new THREE.Group();put(root,an,.6,base+2.25,Dz/2-.15);bx(an,.24,.16,.08,vm('planksDark'),0,0,.04);for(const s of[-1,1]){bx(an,.06,.3,.06,vm('woolWhite'),s*.12,.18,.08,0,0,-s*.5);bx(an,.06,.16,.06,vm('woolWhite'),s*.22,.22,.08,0,0,s*.4);}
  const cg=new THREE.Group();put(root,cg,-Lx/2-.5,0,0);bx(cg,1.1,1.6,1.1,vm('cobble'),0,.8,0);bx(cg,.8,base+hw+H+.8-1.6,.8,vm('cobble'),.1,1.6+(base+hw+H+.8-1.6)/2,0);bx(cg,1,.16,1,vm('stoneBrick'),.1,base+hw+H+.88,0);
  // sapling nursery
  for(let i=0;i<3;i++){const g=new THREE.Group();put(root,g,-3.6+i*1.1,0,Dz/2+2.4);bx(g,.9,.3,.6,vm('planks'),0,.15,0);bx(g,.8,.04,.5,vm('dirt'),0,.31,0);for(const s of[-1,1]){bx(g,.06,.4,.06,vm('planksDark'),s*.22,.5,0);bx(g,.24,.22,.24,vm('leaves'),s*.22,.78,0);}}
  // felled logs, trees, lantern
  const lp=new THREE.Group();put(root,lp,3.9,0,1.6,0,.15,0);for(let r=0;r<3;r++)for(let c=0;c<3-r;c++)vlog(lp,.45,.45,2,'z',(c-(2-r)/2)*.46,.225+r*.42,0);
  vTree(root,4.2,-2.6,3,1);vTree(root,-4.4,-2.4,3.4,.9);vTree(root,-5,2,2.6,.8);
  vLantern(root,L,-.2,base+1.9,Dz/2);vBarrel(root,Lx/2+.1,-Dz/2+.4,true);vBush(root,2.2,Dz/2+2.2,.9);return root;}

function vxToolsmith(){const root=new THREE.Group(),L=[];root.userData.lights=L;const Lx=6,Dz=4.4,base=.4,hw=2.6,t=.2,H=2.4;
  vYard(root,10,8,0,1);bx(root,Lx+.2,base,Dz+.2,vm('cobble'),0,base/2,0);
  const ops={front:[{type:'hole',x:-1,w:2.4,y0:.9,y1:2.2},{type:'door',x:1.8,w:1,y0:0,y1:2.1}],back:[{x:0,w:.8,y0:.9,y1:1.7}],right:[],left:[{x:0,w:.8,y0:.9,y1:1.7}]};
  const W=vWalls({Lx,Dz,y:base,h:hw,t,mat:vm('planksV'),ops,frame:vm('timber')});root.add(W.group);const F=W.faces.front;
  put(root,vRoof(Dz,Lx,H,vm('tiles'),{ov:.7,ovL:.6,step:.4,gable:vm('planksV'),ridge:vm('timber')}),0,base+hw,0);
  bx(F,2.4,1.3,.04,vm('dark'),-1,1.55,-t+.03);bx(F,2.7,.12,.7,vm('planks'),-1,.9,.25);bx(F,2.7,.2,.12,vm('timber'),-1,2.3,.04);
  for(let i=0;i<2;i++)bx(F,2.8,.1,.55,vm('awningGreen'),-1,2.5-i*.14,.3+i*.5);
  put(F,TOOLS.Hammer.build(),-1.8,1.0,.25,0,.6,Math.PI/2);put(F,TOOLS.Axe.build(),-.6,1.0,.1,0,-.4,Math.PI/2);put(F,TOOLS.Pickaxe.build(),.0,1.0,.15,0,.3,Math.PI/2);
  // tool rack on the right wall
  const rk=W.faces.right;bx(rk,2.4,1.2,.08,vm('planksDark'),0,1.4,.05);['Axe','Pickaxe','Sledgehammer','Hammer'].forEach((n,i)=>vToolMount(rk,n,-.9+i*.6,1.05,.16,0));
  // workbench with vise, grindstone, handle barrel
  const wb=new THREE.Group();put(root,wb,-1,0,Dz/2+2.2);bx(wb,1.8,.14,.8,vm('planks'),0,.86,0);for(const[a,b]of[[1,1],[1,-1],[-1,1],[-1,-1]])bx(wb,.12,.8,.12,vm('planksDark'),a*.8,.4,b*.32);
  bx(wb,.2,.2,.2,vm('iron'),.7,1.02,.3);bx(wb,.06,.06,.3,vm('iron'),.7,1.02,.5);vlog(wb,.9,.2,.2,'x',-.3,1.03,-.1);
  const gs=new THREE.Group();put(root,gs,-3.8,0,1.4);for(const s of[-1,1])bx(gs,.1,.9,.1,vm('planksDark'),s*.18,.45,0);bx(gs,.12,.7,.7,vm('stoneBrick'),0,.85,0,Math.PI/4,0,0);bx(gs,.5,.06,.06,vm('iron'),0,.85,0);bx(gs,.6,.1,.5,vm('planks'),0,.1,0);
  const hb=vBarrel(root,Lx/2+.5,Dz/2+.4);for(let i=0;i<5;i++)bx(hb,.05,.5,.05,vm('planks'),(i%3-1)*.14,1,(i>2?.1:-.08));
  vCrate(root,.6,Lx/2+.5,0,Dz/2-.6,.2);vHangSign(F,Lx/2-.2,hw-.2,0,ICONS.hammer);
  bx(root,.7,base+hw+H+.4,.7,vm('stoneBrick'),1.6,(base+hw+H+.4)/2,-1);bx(root,.9,.14,.9,vm('cobble'),1.6,base+hw+H+.47,-1);
  vLantern(root,L,1,base+2.1,Dz/2);vBush(root,-3.6,-1.6);return root;}

function vxBlacksmith(){const root=new THREE.Group(),L=[];root.userData.lights=L;const Lx=6.4,Dz=5,hw=3,t=.4,H=2.2;
  vYard(root,10.4,9,0,1.2);bx(root,Lx-.4,.04,Dz-.4,vm('dirt'),0,.02,0);
  const ops={front:[{type:'hole',x:-.3,w:4.2,y0:0,y1:2.6}],back:[],right:[{x:0,w:.8,y0:1,y1:1.8}],left:[]};
  const W=vWalls({Lx,Dz,y:0,h:hw,t,mat:vm('cobble'),ops});root.add(W.group);
  for(const[sx,sz]of[[1,1],[1,-1],[-1,1],[-1,-1]])bx(root,.5,hw,.5,vm('stoneBrick'),sx*(Lx/2-.2),hw/2,sz*(Dz/2-.2));
  bx(W.faces.front,4.6,.3,.5,vm('timber'),-.3,2.75,-.2);
  put(root,vRoof(Dz,Lx,H,vm('slate'),{ov:.6,ovL:.5,step:.37,gable:vm('cobble'),gt:.4,ridge:vm('stoneBrick')}),0,hw,0);
  // forge, hood and chimney at the back left
  const fx=-1.6,fz=-Dz/2+1;bx(root,1.8,.9,1.3,vm('stoneBrick'),fx,.45,fz);
  const bed=new THREE.Mesh(new THREE.BoxGeometry(1.3,.16,.9),EMBER);bed.position.set(fx,.98,fz);root.add(bed);
  const mound=new THREE.Mesh(new THREE.BoxGeometry(.8,.2,.5),EMBER);mound.position.set(fx,1.12,fz);root.add(mound);
  for(const[x,y,z,s]of[[-.15,1.3,0,.22],[.12,1.27,.08,.16],[.02,1.42,-.05,.12],[.25,1.24,-.12,.12]]){const f=new THREE.Mesh(new THREE.BoxGeometry(s,s*1.3,s),FIRE);f.position.set(fx+x,y,fz+z);root.add(f);}
  const glow=new THREE.Mesh(new THREE.BoxGeometry(1.5,.02,1.1),new THREE.MeshBasicMaterial({color:0xff5a10,transparent:true,opacity:.35}));glow.position.set(fx,1.79,fz);root.add(glow);
  mound.onBeforeRender=()=>{const t=performance.now()/1000;EMBER.emissiveIntensity=2.1+.45*Math.sin(t*5.3)+.25*Math.sin(t*12.7);FIRE.emissiveIntensity=1.8+.6*Math.sin(t*9.1+1);(root.userData.lights||[]).forEach(l=>{if(l.userData.min)l.intensity=l.userData.base*(.8+.12*Math.sin(t*7.7)+.08*Math.sin(t*13.3));});};
  bx(root,1.8,.4,1.3,vm('stoneBrick'),fx,2,fz);bx(root,1.3,.5,1,vm('stoneBrick'),fx,2.45,fz-.1);bx(root,.9,hw+H+1.2-2.7,.9,vm('stoneBrick'),fx,2.7+(hw+H+1.2-2.7)/2,fz-.2);bx(root,1.1,.16,1.1,vm('cobble'),fx,hw+H+1.28,fz-.2);
  for(const s of[-1,1])bx(root,.2,1.1,.2,vm('stoneBrick'),fx+s*.8,1.45,fz+.55);
  const pl=new THREE.PointLight(0xff6a24,0,9,2);pl.position.set(fx,1.6,fz+1);pl.userData.lamp=true;pl.userData.min=1.6;root.add(pl);L.push(pl);
  const bel=new THREE.Group();put(root,bel,fx+1.4,0,fz-.1);bx(bel,.5,.3,.8,vm('planksDark'),0,.7,0);bx(bel,.46,.2,.7,vm('burlap'),0,.95,0);bx(bel,.12,.12,.3,vm('iron'),-.1,.75,.5);bx(bel,.1,.5,.1,vm('planksDark'),0,.25,0);
  for(let i=0;i<5;i++)bx(root,.3,.2,.3,vm('coal'),-2.6+(i%3)*.3,.1+Math.floor(i/3)*.2,-.4+(i%2)*.2);
  // anvil, quench trough, rack, ingots
  const av=buildWorkpiece('anvil',.85);put(root,av,.3,0,.5,0,.3,0);
  const tr=new THREE.Group();put(root,tr,1.9,0,-1.3);bx(tr,1.4,.6,.6,vm('stoneBrick'),0,.3,0);bx(tr,1.2,.04,.4,vm('water'),0,.58,0);
  const rk=W.faces.right;bx(rk,2,1,.08,vm('planksDark'),0,1.5,.05);vToolMount(rk,'Sledgehammer',-.5,1.15,.16);vToolMount(rk,'Hammer',.2,1.25,.16);vToolMount(rk,'Pickaxe',.7,1.15,.16);
  for(let i=0;i<6;i++)bx(root,.3,.1,.14,vm('iron'),Lx/2+.6+(i%2)*.32,.05+Math.floor(i/2)*.1,Dz/2+.4);
  vBarrel(root,-Lx/2-.2,Dz/2+.6,true);vBarrel(root,-Lx/2+.5,Dz/2+.8);vHangSign(W.faces.front,Lx/2-.3,2.6,0,ICONS.anvil);
  vLantern(root,L,2.3,2.4,Dz/2);return root;}

function vxTavern(){const root=new THREE.Group(),L=[];root.userData.lights=L;const Lx=8,Dz=6,h1=3,band=.3,Lx2=8.4,Dz2=6.4,h2=2.6,H=3.2,sb=vm('stoneBrick');
  vYard(root,12,10.4,0,1.4);
  const ops1={front:[{type:'door',x:0,w:1.6,y0:0,y1:2.3,lintel:sb},{x:-2.6,w:1.2,y0:.9,y1:1.9,flowers:true},{x:2.6,w:1.2,y0:.9,y1:1.9,flowers:true}],back:[{type:'door',x:2.6,w:1,y0:0,y1:2.1},{x:-1.6,w:1,y0:.9,y1:1.8}],right:[{x:-1,w:.9,y0:.9,y1:1.8},{x:1.2,w:.9,y0:.9,y1:1.8}],left:[{x:0,w:.9,y0:.9,y1:1.8}]};
  root.add(vWalls({Lx,Dz,y:0,h:h1,t:.3,mat:vm('cobble'),ops:ops1}).group);
  for(let i=0,y=0;y<h1-.05;i++,y+=.4)for(const[sx,sz]of[[1,1],[1,-1],[-1,1],[-1,-1]]){const lx=i%2?.6:.4,lz=i%2?.4:.6;bx(root,lx,.4,lz,sb,sx*(Lx/2-lx/2+.02),y+.2,sz*(Dz/2-lz/2+.02));}
  bx(root,Lx2,band,Dz2,vm('timber'),0,h1+band/2,.2);for(let i=0;i<14;i++)bx(root,.16,.16,.4,vm('timber'),-Lx2/2+.3+i*(Lx2-.6)/13,h1-.08,Dz/2+.15);
  const ops2={front:[-2.9,-1,1,2.9].map(x=>({x,w:.8,y0:.8,y1:1.7})),back:[-2,2].map(x=>({x,w:.8,y0:.8,y1:1.7})),right:[{x:0,w:.8,y0:.8,y1:1.7}],left:[{x:0,w:.8,y0:.8,y1:1.7}]};
  const W2=vWalls({Lx:Lx2,Dz:Dz2,y:h1+band,h:h2,t:.2,mat:vm('plaster'),ops:ops2,frame:vm('timber'),unit:{shutter:vm('woolRed')}});W2.group.position.z=.2;root.add(W2.group);
  put(root,vRoof(Dz2,Lx2,H,vm('tiles'),{ov:.7,ovL:.6,step:.4,gable:vm('plaster'),ridge:vm('timber')}),0,h1+band+h2,.2);
  for(const s of[-1,1]){bx(root,.8,H+.9,.9,sb,s*(Lx2/2-.5),h1+band+h2+(H+.9)/2,.2);bx(root,1,.16,1.1,vm('cobble'),s*(Lx2/2-.5),h1+band+h2+H+.98,.2);}
  bx(root,2.4,.16,.8,sb,0,.08,Dz/2+.4);vHangSign(root,1.4,h1-.3,Dz/2,ICONS.tankard);
  vLantern(root,L,-1.2,2.3,Dz/2);vLantern(root,L,1.2,2.3,Dz/2);
  vTable(root,-2.8,Dz/2+2.3);vTable(root,2.8,Dz/2+2.3,.1);
  const bs=new THREE.Group();put(root,bs,-Lx/2-.7,0,1.2);vBarrel(bs,0,0);vBarrel(bs,0,.66);vBarrel(bs,0,-.66);const tb=vBarrel(bs,0,.33);tb.position.y=.8;const tb2=vBarrel(bs,0,-.33);tb2.position.y=.8;
  vCrate(root,.6,Lx/2+.6,0,Dz/2-.5,.3);vCrate(root,.5,Lx/2+.6,.6,Dz/2-.5,.6);vBush(root,-4.6,-2.4,1.1);vBush(root,4.8,-2,.9);return root;}

function vxTownHall(){const root=new THREE.Group(),L=[];root.userData.lights=L;const Lx=10,Dz=7,pl=.6,h1=3.2,band=.3,h2=2.8,H=3.4,sb=vm('stoneBrick');
  vYard(root,14.4,12.8,0,1.6);bx(root,Lx+.4,pl,Dz+.4,sb,0,pl/2,0);
  const ops1={front:[{type:'door',x:0,w:1.8,y0:0,y1:2.6,lintel:sb},...[-3.8,-2,2,3.8].map(x=>({x,w:.9,y0:.8,y1:2.2,sill:sb,lintel:sb}))],back:[-3,0,3].map(x=>({x,w:.9,y0:.8,y1:2.2,sill:sb})),right:[-1.5,1.5].map(x=>({x,w:.9,y0:.8,y1:2.2,sill:sb})),left:[-1.5,1.5].map(x=>({x,w:.9,y0:.8,y1:2.2,sill:sb}))};
  root.add(vWalls({Lx,Dz,y:pl,h:h1,t:.4,mat:sb,ops:ops1}).group);
  for(const x of[-5,-2.9,2.9,5])bx(root,.5,h1,.2,vm('cobble'),x*(Lx/10)-Math.sign(x)*.0,pl+h1/2,Dz/2+.08);
  bx(root,Lx+.2,band,Dz+.2,vm('timber'),0,pl+h1+band/2,0);
  const ops2={front:[{x:0,w:1.4,y0:.6,y1:2},...[-3.8,-2,2,3.8].map(x=>({x,w:.9,y0:.7,y1:1.9}))],back:[-3,0,3].map(x=>({x,w:.9,y0:.7,y1:1.9})),right:[{x:0,w:.9,y0:.7,y1:1.9}],left:[{x:0,w:.9,y0:.7,y1:1.9}]};
  const W2=vWalls({Lx,Dz,y:pl+h1+band,h:h2,t:.25,mat:vm('plaster'),ops:ops2,frame:vm('timber'),unit:{shutter:vm('woolBlue')}});root.add(W2.group);
  // small balcony at the centre window
  bx(root,2,.14,.8,sb,0,pl+h1+band+.5,Dz/2+.4);for(let i=0;i<5;i++)bx(root,.1,.5,.1,vm('iron'),-.9+i*.45,pl+h1+band+.82,Dz/2+.75);bx(root,2,.08,.1,vm('iron'),0,pl+h1+band+1.1,Dz/2+.75);
  for(const s of[-1,1]){const b=new THREE.Group();put(root,b,s*2.9,pl+h1+band+h2-.3,Dz/2+.16);bx(b,.1,.1,1,vm('planksDark'),0,0,-.3,0,Math.PI/2,0);bx(b,.8,1.7,.05,vm('woolRed'),0,-.9,0);bx(b,.8,.1,.06,vm('gold'),0,-.12,.01);bx(b,.8,.06,.06,vm('gold'),0,-1.7,.01);bx(b,.4,.4,.06,vm('woolWhite'),0,-.8,.01);bx(b,.28,.28,.07,vm('woolRed'),0,-.8,.02,0,0,Math.PI/4);}
  const top=pl+h1+band+h2;put(root,vRoof(Dz,Lx,H,vm('slate'),{ov:.7,ovL:.6,step:.4,gable:vm('plaster'),ridge:sb}),0,top,0);
  // clock and bell tower on the ridge
  const tw=new THREE.Group();put(root,tw,0,top,0);const TW=2.4,TH=H+2.4;
  bx(tw,TW,TH,TW,sb,0,TH/2,0);for(const[sx,sz]of[[1,1],[1,-1],[-1,1],[-1,-1]])bx(tw,.3,TH,.3,vm('cobble'),sx*(TW/2-.1),TH/2,sz*(TW/2-.1));
  for(const f of[1,-1]){const cz=f*(TW/2+.03);bx(tw,1.4,1.4,.06,vm('gold'),0,TH-1.1,cz);bx(tw,1.15,1.15,.08,vm('woolWhite'),0,TH-1.1,cz);bx(tw,.08,.45,.1,vm('dark'),.1,TH-.92,cz,0,0,-.45);bx(tw,.07,.32,.1,vm('dark'),-.1,TH-1.2,cz,0,0,-2.3);bx(tw,.12,.12,.11,vm('gold'),0,TH-1.1,cz);}
  bx(tw,TW+.2,.2,TW+.2,vm('timber'),0,TH+.1,0);for(const[sx,sz]of[[1,1],[1,-1],[-1,1],[-1,-1]])vlog(tw,.3,1.6,.3,'y',sx*(TW/2-.15),TH+1,sz*(TW/2-.15));
  bx(tw,.1,.4,.1,vm('iron'),0,TH+1.55,0);bx(tw,.6,.6,.6,vm('gold'),0,TH+1.1,0);bx(tw,.8,.12,.8,vm('gold'),0,TH+.8,0);
  bx(tw,TW+.3,.2,TW+.3,vm('timber'),0,TH+1.9,0);put(tw,vPyramid(TW+.6,TW+.6,2.4,vm('slate'),.3),0,TH+2,0);bx(tw,.12,.6,.12,vm('gold'),0,TH+4.6,0);bx(tw,.4,.3,.04,vm('woolRed'),.24,TH+4.75,0);
  // steps, lamp posts, notice board
  for(let i=0;i<3;i++)bx(root,3.2-i*.4,.2,.5,sb,0,.1+i*.2,Dz/2+1.4-i*.4);
  for(const s of[-1,1]){vlog(root,.2,2.2,.2,'y',s*2.2,1.1,Dz/2+1.3);vLantern(root,L,s*2.2,2.5,Dz/2+1.15);}
  const nb=new THREE.Group();put(root,nb,4.6,0,Dz/2+1.6,0,-.3,0);for(const s of[-1,1])bx(nb,.14,1.8,.14,vm('planksDark'),s*.7,.9,0);bx(nb,1.6,.9,.08,vm('planks'),0,1.3,.04);bx(nb,1.8,.2,.4,vm('shingle'),0,1.85,.05);
  for(const[x,y]of[[-.4,1.45],[.1,1.3],[.5,1.5],[-.15,1.05]])bx(nb,.3,.34,.02,vm('woolWhite'),x,y,.1);
  vBush(root,-4.6,Dz/2+1.4);vBush(root,-5.6,-2,1.1);vBush(root,5.6,-2.4,1);return root;}

[['vx-forester',"Forester's lodge",vxForester,"Log lodge with a covered porch, antlers over the door, a sapling nursery, felled logs and the forest at its back."],
 ['vx-toolsmith','Toolsmith',vxToolsmith,'Plank workshop with a shop counter under a green awning, a wall rack of axes, picks and hammers, a workbench with vise and a grindstone.'],
 ['vx-blacksmith','Blacksmith',vxBlacksmith,'Open-fronted stone smithy with a glowing forge, bellows, chimney hood, anvil, quench trough and a stack of iron ingots.'],
 ['vx-tavern','Tavern',vxTavern,'Two-storey inn with a jettied plaster floor, twin chimneys, a tankard sign, lanterns, outdoor tables and a stack of barrels.'],
 ['vx-townhall','Town hall',vxTownHall,'Stone hall on a plinth with a balcony, red banners and a clock and bell tower rising through the roof; lamp posts and a notice board by the steps.'],
].forEach(([id,name,build,desc])=>ASSETS.push({id,folder:'buildings/medieval',name,build,desc}));
