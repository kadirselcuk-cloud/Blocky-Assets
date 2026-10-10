/* ======================= batch 4: crafts, food and herding ======================= */
VXD.hide=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,'#c09a6a',nz(r,.86,1.06)*((x*7+y*3)%11===0?.85:1));};
VXD.leather=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,'#6e4428',nz(r,.86,1.08));};
VXD.fur=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,y%3===0?'#5a4030':'#7a5a40',nz(r,.85,1.1));};
VXD.woolGreen=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,'#4a7a3a',nz(r,.9,1.05));};
VXD.woolPurple=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,'#6a3a7a',nz(r,.9,1.05));};
VXD.woolFluff=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,'#ece8dc',r()<.25?.88:nz(r,.95,1.03));};
VXD.sheepFace=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,'#d8c0a0',nz(r,.92,1.04));};
const liquid=(c)=>(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,c,(x+y*2)%7===0?1.2:nz(r,.92,1.04));};
VXD.liqBrown=liquid('#5a3a20');VXD.liqRed=liquid('#9a2a2a');VXD.liqBlue=liquid('#2a4a8a');VXD.liqYellow=liquid('#c89a2a');VXD.stew=liquid('#8a5a2a');
const SMOKE=new THREE.MeshStandardMaterial({color:0xb8b4ac,transparent:true,opacity:.55,roughness:1,depthWrite:false});
ICONS.boot=(g,x,y,z)=>{for(const s of[-1,1]){bx(g,.04,.3,.12,vm('leather'),x*s,y+.04,z-.06);bx(g,.04,.1,.3,vm('leather'),x*s,y-.1,z+.03);}};
ICONS.scissors=(g,x,y,z)=>{for(const s of[-1,1]){bx(g,.04,.36,.05,vm('iron'),x*s,y+.04,z,.6,0,0);bx(g,.04,.36,.05,vm('iron'),x*s,y+.04,z,-.6,0,0);bx(g,.045,.1,.1,vm('gold'),x*s,y-.14,z-.11);bx(g,.045,.1,.1,vm('gold'),x*s,y-.14,z+.11);}};
ICONS.yarn=(g,x,y,z)=>{for(const s of[-1,1]){bx(g,.04,.26,.26,vm('woolRed'),x*s,y,z);bx(g,.045,.04,.3,vm('woolWhite'),x*s,y+.05,z,.5,0,0);bx(g,.045,.04,.3,vm('woolWhite'),x*s,y-.05,z,.5,0,0);}};
function vTub(par,x,z,liq,s=1){const g=new THREE.Group();put(par,g,x,0,z);bx(g,1*s,.7,1*s,vm('barrel'),0,.35,0);bx(g,.86*s,.04,.86*s,vm(liq),0,.62,0);return g;}
function vHideFrame(par,x,z,ry=0,mat='hide'){const g=new THREE.Group();put(par,g,x,0,z,0,ry,0);for(const s of[-1,1])vlog(g,.14,1.9,.14,'y',s*.7,.95,0);bx(g,1.6,.12,.12,vm('planksDark'),0,1.8,0);bx(g,1.6,.12,.12,vm('planksDark'),0,.4,0);
  bx(g,1.1,1.1,.04,vm(mat),0,1.1,0);for(let i=0;i<4;i++){bx(g,.12,.02,.02,vm('rope'),-.62,.7+i*.25,0);bx(g,.12,.02,.02,vm('rope'),.62,.7+i*.25,0);}return g;}
function vBasket(par,x,y,z,fill,n=6){const g=new THREE.Group();put(par,g,x,y,z);bx(g,.44,.22,.34,vm('hay'),0,.11,0);bx(g,.36,.04,.26,vm('planksDark'),0,.2,0);
  const r=mulberry32(hashStr(fill+x+z));for(let i=0;i<n;i++)bx(g,.09,.09,.09,vm(fill),-.12+(i%3)*.12,.25+(i>2?.05:0)+r()*.02,-.06+(i>2?.1:0));bx(g,.04,.2,.04,vm('planksDark'),-.2,.32,0);bx(g,.04,.2,.04,vm('planksDark'),.2,.32,0);bx(g,.44,.04,.04,vm('planksDark'),0,.42,0);return g;}
function vMushroom(par,x,z,s=1,y=0){bx(par,.08*s,.16*s,.08*s,vm('woolWhite'),x,y+.08*s,z);bx(par,.22*s,.1*s,.22*s,vm('woolRed'),x,y+.2*s,z);bx(par,.05,.02,.05,vm('woolWhite'),x+.05*s,y+.255*s,z);}
function vSheep(par,x,z,ry=0,s=1,graze=false){const g=new THREE.Group();put(par,g,x,0,z,0,ry,0);g.scale.setScalar(s);const f=vm('sheepFace');
  bx(g,.56,.5,.84,vm('woolFluff'),0,.62,0);for(const[a,b]of[[1,1],[1,-1],[-1,1],[-1,-1]])bx(g,.12,.4,.12,f,a*.17,.2,b*.28);
  const hd=new THREE.Group();put(g,hd,0,graze?.42:.78,.5,graze?.9:0,0,0);bx(hd,.3,.3,.32,f,0,0,.08);bx(hd,.34,.14,.2,vm('woolFluff'),0,.16,-.02);for(const sd of[-1,1]){bx(hd,.14,.06,.08,f,sd*.2,.06,0);bx(hd,.04,.05,.02,vm('dark'),sd*.09,.04,.24);}return g;}
function vSmoke(par,x,y,z,n=6,spread=.3){const g=new THREE.Group();put(par,g,x,y,z);const cubes=[];for(let i=0;i<n;i++){const m=new THREE.Mesh(new THREE.BoxGeometry(.3,.3,.3),SMOKE);g.add(m);cubes.push(m);}
  cubes[0].onBeforeRender=()=>{const t=performance.now()/1000;cubes.forEach((c,i)=>{const k=((t*.35+i/n)%1);c.position.set(Math.sin(i*2.3+t*.5)*spread*k,k*2.6,Math.cos(i*1.7)*spread*k);c.scale.setScalar(.6+k*1.6);c.rotation.y=i+k;});};return g;}
function vTable(par,x,z,w=1.4,d=.7,ry=0){const g=new THREE.Group();put(par,g,x,0,z,0,ry,0);bx(g,w,.1,d,vm('planks'),0,.85,0);for(const[a,b]of[[1,1],[1,-1],[-1,1],[-1,-1]])bx(g,.1,.8,.1,vm('planksDark'),a*(w/2-.1),.4,b*(d/2-.1));return g;}
function vFirePit(par,x,z,L){const g=new THREE.Group();put(par,g,x,0,z);for(let i=0;i<8;i++){const a=i/8*Math.PI*2;bx(g,.3,.24,.3,vm('cobble'),Math.sin(a)*.55,.12,Math.cos(a)*.55,0,a,0);}
  const e=new THREE.Mesh(new THREE.BoxGeometry(.7,.14,.7),EMBER);e.position.y=.08;g.add(e);for(const[fx,fz,s]of[[-.08,0,.26],[.1,.1,.18],[.05,-.12,.16]]){const f=new THREE.Mesh(new THREE.BoxGeometry(s,s*1.4,s),FIRE);f.position.set(fx,.15+s*.7,fz);g.add(f);}
  e.onBeforeRender=()=>{const t=performance.now()/1000;EMBER.emissiveIntensity=2.1+.45*Math.sin(t*5.3);FIRE.emissiveIntensity=1.8+.6*Math.sin(t*9.1+1);};
  const pl=new THREE.PointLight(0xff6a24,0,6,2);pl.position.set(0,.8,0);pl.userData.lamp=true;pl.userData.min=1;g.add(pl);L.push(pl);return g;}
function vLeanTo(par,x,z,w,d,ry,mat){const g=new THREE.Group();put(par,g,x,0,z,0,ry,0);for(const zz of[-d/2+.2,d/2-.2])vlog(g,.2,1.9,.2,'y',w-.2,.95,zz);for(let i=0;i<3;i++)bx(g,w+.3-i*.5,.2,d+.3,mat,(w+.3)/2-.15-i*.25,2+i*.2,0);return g;}

/* ---------- Hunter's lodge (log walls, shingle roof) ---------- */
function vxHunter(){const root=new THREE.Group(),L=[];root.userData.lights=L;const Lx=5.2,Dz=4.2,base=.3,hw=2.4,t=.3,H=2.2;
  vYard(root,10,8,.4,.8);bx(root,Lx+.1,base,Dz+.1,vm('cobble'),0,base/2,0);
  root.add(vWalls({Lx:Lx-.4,Dz:Dz-.4,y:base,h:hw,t,mat:vm('logH'),ops:{front:[{type:'door',x:.8,w:1,y0:0,y1:2},{x:-1.2,w:.8,y0:.8,y1:1.6,shutter:vm('planksDark')}],back:[{x:0,w:.6,y0:.9,y1:1.5}],right:[],left:[{x:.6,w:.6,y0:.9,y1:1.5}]},unit:{frame:vm('planks')}}).group);
  for(const[sx,sz]of[[1,1],[1,-1],[-1,1],[-1,-1]])vlog(root,.4,hw+.2,.4,'y',sx*(Lx/2-.2),base+(hw+.2)/2,sz*(Dz/2-.2));
  put(root,vRoof(Dz,Lx,H,vm('shingle'),{ov:.7,ovL:.5,step:.4,gable:vm('planksV'),ridge:vm('planksDark')}),0,base+hw,0);
  const cg=new THREE.Group();put(root,cg,-Lx/2-.5,0,-.4);bx(cg,1,1.4,1,vm('cobble'),0,.7,0);bx(cg,.7,base+hw+H+.6-1.4,.7,vm('cobble'),.1,1.4+(base+hw+H+.6-1.4)/2,0);bx(cg,.9,.14,.9,vm('stoneBrick'),.1,base+hw+H+.67,0);
  const an=new THREE.Group();put(root,an,.8,base+2.25,Dz/2-.15);bx(an,.26,.18,.08,vm('planksDark'),0,0,.04);bx(an,.16,.16,.1,vm('fur'),0,-.12,.1);for(const s of[-1,1]){bx(an,.06,.36,.06,vm('woolWhite'),s*.13,.2,.08,0,0,-s*.5);bx(an,.06,.18,.06,vm('woolWhite'),s*.26,.25,.08,0,0,s*.4);bx(an,.06,.14,.06,vm('woolWhite'),s*.2,.38,.08,0,0,-s*.2);}
  // lean-to with hides and game on the right gable
  const lt=vLeanTo(root,Lx/2,0,1.6,3.2,0,vm('shingle'));bx(lt,.1,.1,2.8,vm('planksDark'),1.3,1.7,0);
  for(const[z,m]of[[-1,'fur'],[-.3,'hide'],[.4,'fur']])bx(lt,.04,.8,.6,vm(m),1.32,1.25,z);for(const z of[1,1.25]){bx(lt,.12,.3,.14,vm('fur'),1.32,1.45,z);for(const k of[-.03,.03])bx(lt,.03,.12,.03,vm('fur'),1.32,1.66,z+k);}
  vHideFrame(root,-3.4,2.8,.4);vHideFrame(root,-1.6,3.6,.1,'fur');
  vFirePit(root,1.6,3.6,L);const sp=new THREE.Group();put(root,sp,1.6,0,3.6);for(const s of[-1,1]){bx(sp,.08,.9,.08,vm('planksDark'),s*.8,.45,0);bx(sp,.08,.16,.08,vm('planksDark'),s*.8+s*.04,.92,0,0,0,s*.4);}bx(sp,1.8,.05,.05,vm('iron'),0,.88,0);bx(sp,.36,.2,.2,vm('liqRed'),0,.88,0);
  const tb=vTable(root,3.4,1.6,1.2,.7,1.2);bx(tb,.8,.04,.5,vm('fur'),0,.92,0);bx(tb,.3,.03,.06,vm('iron'),.4,.92,.3);
  const br=new THREE.Group();put(root,br,-.6,0,Dz/2+.25);for(const s of[-1,1])bx(br,.08,1.2,.08,vm('planksDark'),s*.5,.6,0);bx(br,1.1,.06,.08,vm('planksDark'),0,1.15,0);
  for(let i=0;i<2;i++){const bw=new THREE.Group();put(br,bw,-.2+i*.4,.75,.06);bx(bw,.05,.3,.05,vm('planks'),.04,.3,0);bx(bw,.05,.3,.05,vm('planks'),.04,-.3,0);bx(bw,.05,.3,.05,vm('planksDark'),0,0,0);bx(bw,.01,.86,.01,vm('woolWhite'),-.05,0,0);}
  vWoodpile(root,8,4,0,-Dz/2-.45);vBarrel(root,-Lx/2+.2,Dz/2+.5,true);vBush(root,4.4,-1.8);return root;}

/* ---------- Gatherer's hut (plaster + oak, thatch) ---------- */
function vxGatherer(){const root=new THREE.Group(),L=[];root.userData.lights=L;const Lx=4.4,Dz=3.6,base=.3,hw=2.2,H=2.2;
  vYard(root,8,7,0,.8);bx(root,Lx+.2,base,Dz+.2,vm('cobble'),0,base/2,0);
  root.add(vWalls({Lx,Dz,y:base,h:hw,t:.2,mat:vm('plaster'),ops:{front:[{type:'door',x:0,w:.9,y0:0,y1:1.9},{x:-1.4,w:.6,y0:.8,y1:1.5,flowers:true},{x:1.4,w:.6,y0:.8,y1:1.5,flowers:true}],back:[{x:0,w:.6,y0:.8,y1:1.5}],right:[{x:0,w:.6,y0:.8,y1:1.5}],left:[]},frame:vm('timber'),unit:{shutter:vm('planksDark')}}).group);
  put(root,vRoof(Dz,Lx,H,vm('thatch'),{ov:.8,ovL:.5,step:.37,gable:vm('plaster'),ridge:vm('hay')}),0,base+hw,0);
  bx(root,.7,base+hw+H+.6,.9,vm('cobble'),-Lx/2-.4,(base+hw+H+.6)/2,0);bx(root,.9,.16,1.1,vm('stoneBrick'),-Lx/2-.4,base+hw+H+.68,0);
  bx(root,Lx+.6,.08,.08,vm('planksDark'),0,base+hw-.15,Dz/2+.55);for(let i=0;i<9;i++){const x=-Lx/2+.1+i*.55;bx(root,.02,.2,.02,vm('rope'),x,base+hw-.3,Dz/2+.55);bx(root,.14,.26,.14,vm(['leaves','woolGreen','hay'][i%3]),x,base+hw-.52,Dz/2+.55);}
  const tb=vTable(root,-1.4,Dz/2+1.6,1.4,.7);vBasket(tb,-.4,.9,0,'woolRed');vBasket(tb,.15,.9,0,'woolBlue');bx(tb,.3,.06,.3,vm('leaves'),.5,.93,0);
  vBasket(root,1.2,0,Dz/2+1.4,'woolRed',6);vBasket(root,1.7,0,Dz/2+1.2,'gold',6);const mb=vBasket(root,1.45,0,Dz/2+1.9,'woolWhite',0);for(let i=0;i<4;i++)vMushroom(mb,-.1+(i%2)*.2,-.06+Math.floor(i/2)*.13,.8,.18);
  vlog(root,2,.4,.4,'x',2.9,.2,-1.4);for(const[x,z]of[[2.4,-1.1],[3,-1.12],[3.5,-1.08],[2.7,-1.7]])vMushroom(root,x,z);
  for(const[x,z,c]of[[-3.2,1.8,'woolRed'],[3.4,1.6,'woolBlue'],[-3.4,-1.6,'woolRed']]){const b=vBush(root,x,z);for(let i=0;i<6;i++)bx(b,.1,.1,.1,vm(c),(i%3-1)*.25,.35+(i>2?.25:0),.41);}
  vSack(root,2.4,.8);return root;}

/* ---------- Leatherworker (plank + oak, tile roof, tanning yard) ---------- */
function vxLeatherworker(){const root=new THREE.Group(),L=[];root.userData.lights=L;const Lx=5.6,Dz=4.4,base=.4,hw=2.6,H=2.4;
  vYard(root,11,8.4,-.8,.8);bx(root,Lx+.2,base,Dz+.2,vm('cobble'),0,base/2,0);
  const W=vWalls({Lx,Dz,y:base,h:hw,t:.2,mat:vm('planksV'),ops:{front:[{type:'hole',x:-.9,w:2.2,y0:.9,y1:2.1},{type:'door',x:1.6,w:1,y0:0,y1:2.1}],back:[{x:0,w:.8,y0:.9,y1:1.7}],right:[{x:0,w:.8,y0:.9,y1:1.7}],left:[]},frame:vm('timber')});root.add(W.group);const F=W.faces.front;
  put(root,vRoof(Dz,Lx,H,vm('tiles'),{ov:.7,ovL:.6,step:.4,gable:vm('planksV'),ridge:vm('timber')}),0,base+hw,0);
  bx(F,2.2,1.2,.04,vm('dark'),-.9,1.5,-.17);bx(F,2.4,.1,.7,vm('planks'),-.9,.9,.3);
  for(let i=0;i<2;i++){bx(F,.12,.22,.26,vm('leather'),-1.7+i*.18,1.06,.3);bx(F,.12,.08,.32,vm('leather'),-1.7+i*.18,.99,.42);}bx(F,.4,.3,.12,vm('hide'),-.9,1.1,.3);bx(F,.5,.04,.4,vm('leather'),-.2,.97,.35);for(let i=0;i<3;i++)bx(F,.5,.05,.05,vm('leather'),-.2,1.0+i*.02,.15+i*.05);
  vHangSign(F,Lx/2-.3,hw-.2,0,ICONS.boot);
  const sh=new THREE.Group();put(root,sh,-Lx/2,0,0,0,Math.PI,0);for(const zz of[-1.6,1.6])vlog(sh,.2,2.3,.2,'y',2.4,1.15,zz);for(let i=0;i<3;i++)bx(sh,2.8-i*.6,.2,3.8,vm('tiles'),1.4-i*.3,2.4+i*.2,0);
  ['liqBrown','liqBrown','liqYellow'].forEach((q,i)=>vTub(root,-Lx/2-.9-0,-1.1+i*1.15,q,.9));
  vHideFrame(root,-Lx/2-3.5,-1,Math.PI/2);vHideFrame(root,-Lx/2-3.5,.9,Math.PI/2,'leather');
  const dr=new THREE.Group();put(root,dr,-1.6,0,Dz/2+2.2);for(const s of[-1,1])vlog(dr,.14,1.8,.14,'y',s*1.1,.9,0);bx(dr,2.4,.08,.08,vm('planksDark'),0,1.7,0);for(let i=0;i<7;i++)bx(dr,.2,.7,.03,vm(i%2?'leather':'hide'),-.9+i*.3,1.3,0);
  const tb=vTable(root,1.2,Dz/2+1.8,1.4,.8);bx(tb,.9,.03,.6,vm('leather'),0,.92,0);bx(tb,.3,.03,.05,vm('iron'),.4,.95,.2);bx(tb,.05,.12,.05,vm('planksDark'),-.5,.98,.2);
  vLantern(root,L,.9,base+2,Dz/2);vBarrel(root,Lx/2+.5,Dz/2+.2,true);vCrate(root,.5,Lx/2+.5,0,-.8,.3);return root;}

/* ---------- Loom house (open shed with a floor loom) ---------- */
function vLoom(par,x,z,ry=0){const g=new THREE.Group();put(par,g,x,0,z,0,ry,0);const p=vm('planksDark');
  for(const[a,b]of[[1,1],[1,-1],[-1,1],[-1,-1]])bx(g,.14,1.9,.14,p,a*.8,.95,b*.7);bx(g,1.74,.14,.14,p,0,1.88,.7);bx(g,1.74,.14,.14,p,0,1.88,-.7);for(const s of[-1,1])bx(g,.14,.14,1.54,p,s*.8,1.88,0);
  bx(g,1.6,.16,.16,vm('planks'),0,1.15,-.7);bx(g,1.6,.14,.14,vm('planks'),0,.9,.7);bx(g,1.5,.2,.2,vm('woolBlue'),0,.6,.55);
  const cols=['woolWhite','woolRed','woolWhite','gold'];for(let i=0;i<14;i++){const m=bx(g,.03,.03,1.42,vm(cols[i%4]),-.65+i*.1,1.03,0);m.rotation.x=.18;m.castShadow=false;}
  bx(g,1.5,.3,.5,vm('woolBlue'),0,.95,.45,.18,0,0);bx(g,1.6,.4,.06,p,0,1.45,0);bx(g,1.5,.3,.04,vm('woolWhite'),0,1.45,.0);
  for(let i=0;i<3;i++)bx(g,.12,.04,.6,vm('planks'),-.3+i*.3,.12,-.1,.2,0,0);bx(g,1.2,.1,.3,vm('planks'),0,.55,1.2);for(const s of[-1,1])bx(g,.1,.5,.25,p,s*.5,.25,1.2);return g;}
function vxLoom(){const root=new THREE.Group(),L=[];root.userData.lights=L;const Lx=6,Dz=4,H=2.2;
  vYard(root,10,8,0,.6);bx(root,Lx,.2,Dz,vm('planks'),0,.1,0);
  bx(root,Lx,2.6,.2,vm('planksV'),0,1.4,-Dz/2+.1);for(const s of[-1,1])bx(root,.2,1.2,Dz-.2,vm('planksV'),s*(Lx/2-.1),.8,0);
  for(const x of[-Lx/2+.15,0,Lx/2-.15])for(const z of[-Dz/2+.15,Dz/2-.15])vlog(root,.3,2.8,.3,'y',x,1.4,z);bx(root,Lx,.24,.3,vm('timber'),0,2.7,Dz/2-.15);
  put(root,vRoof(Dz,Lx,H,vm('shingle'),{ov:.7,ovL:.5,step:.37,gable:vm('planksV'),ridge:vm('planksDark')}),0,2.8,0);
  vLoom(root,-1.2,.1);vLoom(root,1.5,.1);
  const sv=new THREE.Group();put(root,sv,0,.2,-Dz/2+.4);for(let k=0;k<3;k++){bx(sv,2,.08,.4,vm('planks'),0,.6+k*.55,0);for(let i=0;i<6;i++)bx(sv,.24,.22,.24,vm(['woolRed','woolBlue','gold','woolWhite','woolGreen','woolPurple'][(i+k)%6]),-.8+i*.32,.75+k*.55,0);}
  for(const[x,c]of[[2.5,'woolWhite'],[2.5,'woolRed']])vBasket(root,x,.2,-.6+(c==='woolRed'?.6:0),c,6);
  vHangSign(root,Lx/2-.1,2.4,Dz/2,ICONS.yarn);vLantern(root,L,-Lx/2+.3,2.2,Dz/2-.3);vSack(root,-Lx/2-.5,1);vBench(root,0,Dz/2+.8);return root;}

/* ---------- Tailor (plaster + oak, tile roof, shop) ---------- */
function vxTailor(){const root=new THREE.Group(),L=[];root.userData.lights=L;const Lx=5.6,Dz=4.4,base=.4,hw=2.6,H=2.6;
  vYard(root,10,8,.4,.8);bx(root,Lx+.2,base,Dz+.2,vm('cobble'),0,base/2,0);
  const W=vWalls({Lx,Dz,y:base,h:hw,t:.2,mat:vm('plaster'),ops:{front:[{type:'hole',x:-1,w:2.4,y0:.8,y1:2.2},{type:'door',x:1.6,w:1,y0:0,y1:2.1}],back:[{x:-1,w:.8,y0:.9,y1:1.7},{x:1,w:.8,y0:.9,y1:1.7}],right:[{x:0,w:.8,y0:.9,y1:1.7}],left:[{x:0,w:.8,y0:.9,y1:1.7}]},frame:vm('timber')});root.add(W.group);const F=W.faces.front;
  put(root,vRoof(Dz,Lx,H,vm('tiles'),{ov:.7,ovL:.6,step:.4,gable:vm('plaster'),ridge:vm('timber')}),0,base+hw,0);
  bx(root,.8,H+1,.8,vm('stoneBrick'),1.6,base+hw+(H+1)/2,-1.1);bx(root,1,.16,1,vm('cobble'),1.6,base+hw+H+1.08,-1.1);
  bx(F,2.4,1.4,.04,vm('dark'),-1,1.5,-.17);bx(F,2.6,.1,.6,vm('planks'),-1,.8,.26);for(let i=0;i<2;i++)bx(F,2.8,.1,.5,vm('awning'),-1,2.4-i*.12,.3+i*.42);
  const df=new THREE.Group();put(F,df,-1.6,.85,-.3);bx(df,.06,.6,.06,vm('planksDark'),0,.3,0);bx(df,.36,.5,.24,vm('woolPurple'),0,.85,0);bx(df,.42,.2,.28,vm('woolPurple'),0,.62,0);bx(df,.12,.1,.1,vm('planksDark'),0,1.15,0);
  ['woolRed','woolBlue','woolGreen','gold'].forEach((c,i)=>bx(F,.6,.14,.14,vm(c),-.6+(i%2)*.5,.92+Math.floor(i/2)*.14,.3+(i%2)*.1,0,(i%2?.2:-.2),0));
  vHangSign(F,Lx/2-.3,hw-.2,0,ICONS.scissors);vLantern(root,L,.9,base+2,Dz/2);
  const cr=new THREE.Group();put(root,cr,-1,0,Dz/2+2.2);for(const s of[-1,1]){bx(cr,.1,1.8,.1,vm('planksDark'),s*1.2,.9,0);bx(cr,.1,.06,.6,vm('planksDark'),s*1.2,.03,0);}bx(cr,2.5,.06,.06,vm('planksDark'),0,1.75,0);
  ['woolRed','woolBlue','woolGreen','woolPurple','gold'].forEach((c,i)=>{const x=-.9+i*.45;bx(cr,.03,.12,.03,vm('iron'),x,1.68,0);bx(cr,.36,.6,.08,vm(c),x,1.3,0);bx(cr,.6,.14,.08,vm(c),x,1.53,0);});
  vBench(root,2.6,Dz/2+1.6);vCrate(root,.5,Lx/2+.5,0,Dz/2-.6,.2);vBush(root,-Lx/2-1,1.6);return root;}

/* ---------- Sheep fold ---------- */
function vxSheepFold(){const root=new THREE.Group(),L=[];root.userData.lights=L;const W=10,D=8;
  vYard(root,W-.4,D-.4,0,0);
  const wall=(x0,z0,x1,z1)=>{const len=Math.hypot(x1-x0,z1-z0),n=Math.round(len/.4);for(let i=0;i<n;i++){const t=(i+.5)/n;bx(root,.42,.6+(i%4===0?.12:0),.5,vm(i%5===2?'stone':'cobble'),x0+(x1-x0)*t,.3,z0+(z1-z0)*t,0,Math.atan2(x1-x0,z1-z0),0);}};
  wall(-W/2,-D/2,W/2,-D/2);wall(-W/2,-D/2,-W/2,D/2);wall(W/2,-D/2,W/2,D/2);wall(-W/2,D/2,-.9,D/2);wall(.9,D/2,W/2,D/2);
  for(const s of[-1,1])bx(root,.5,1.2,.5,vm('stoneBrick'),s*1,.6,D/2);const gt=new THREE.Group();put(root,gt,-.75,0,D/2);gt.rotation.y=-1.1;bx(gt,1.5,.1,.08,vm('planksDark'),.75,.3,0);bx(gt,1.5,.1,.08,vm('planksDark'),.75,.75,0);bx(gt,1.5,.1,.08,vm('planksDark'),.75,1.05,0);bx(gt,.1,1,.08,vm('planksDark'),.05,.65,0);bx(gt,.1,1,.08,vm('planksDark'),1.45,.65,0);bx(gt,1.6,.1,.06,vm('planks'),.75,.68,.02,0,0,.55);
  const sh=new THREE.Group();put(root,sh,0,0,-D/2+1.2);bx(sh,5,1.8,.2,vm('planksV'),0,.9,-1);for(const x of[-2.4,0,2.4])vlog(sh,.24,2,.24,'y',x,1,.8);for(let i=0;i<3;i++)bx(sh,5.4,.2,2.6-i*.5,vm('shingle'),0,2+i*.2,-.1-i*.25);
  const hr=new THREE.Group();put(sh,hr,-1.4,0,-.6);for(const s of[-1,1])bx(hr,.08,1,.08,vm('planksDark'),s*.6,.5,0);bx(hr,1.3,.4,.5,vm('hay'),0,.9,0);for(let i=0;i<6;i++)bx(hr,.04,.6,.04,vm('planksDark'),-.5+i*.2,.9,.27,-.3,0,0);
  const tr=new THREE.Group();put(root,tr,3,0,-1);bx(tr,1.6,.4,.5,vm('planksDark'),0,.2,0);bx(tr,1.4,.04,.32,vm('water'),0,.38,0);
  vHay(sh,1.4,0,-.4);vHay(sh,1.4,.8,-.4);
  const ck=new THREE.Group();put(root,ck,1.2,0,D/2+.4,0,0,-.15);bx(ck,.06,1.8,.06,vm('planksDark'),0,.9,0);bx(ck,.06,.06,.3,vm('planksDark'),0,1.8,.12);bx(ck,.06,.2,.06,vm('planksDark'),0,1.7,.27);
  vLantern(root,L,-1,1.5,D/2+.1);root.userData.ground=8.4;return root;}

/* ---------- Weaver (plaster + oak, thatch; spinning and dyeing) ---------- */
function vxWeaver(){const root=new THREE.Group(),L=[];root.userData.lights=L;const Lx=5.6,Dz=4.4,base=.4,hw=2.4,H=2.6;
  vYard(root,11,8.4,0,1);bx(root,Lx+.2,base,Dz+.2,vm('cobble'),0,base/2,0);
  root.add(vWalls({Lx,Dz,y:base,h:hw,t:.2,mat:vm('plaster'),ops:{front:[{type:'door',x:-.8,w:1,y0:0,y1:2},{x:-2.1,w:.6,y0:.8,y1:1.6,flowers:true},{x:1.4,w:1.2,y0:.8,y1:1.6,flowers:true}],back:[{x:0,w:.8,y0:.8,y1:1.6}],right:[{x:0,w:.8,y0:.8,y1:1.6}],left:[]},frame:vm('timber'),unit:{shutter:vm('planksDark')}}).group);
  put(root,vRoof(Dz,Lx,H,vm('thatch'),{ov:.7,ovL:.6,step:.4,gable:vm('plaster'),ridge:vm('hay')}),0,base+hw,0);for(const s of[-1,1])bx(root,.1,.2,Dz,vm('timber'),s*(Lx/2+.04),base+hw+.1,0);
  bx(root,.8,base+hw+H+.8,1.2,vm('cobble'),-Lx/2-.5,(base+hw+H+.8)/2,0);bx(root,1,.2,1.4,vm('stoneBrick'),-Lx/2-.5,base+hw+H+.9,0);
  bx(root,1.4,.2,.6,vm('cobble'),-.8,.1,Dz/2+.4);bx(root,1.2,.2,.4,vm('cobble'),-.8,.3,Dz/2+.2);vLantern(root,L,0,base+2.1,Dz/2);vHangSign(root,Lx/2-.3,base+hw-.2,Dz/2,ICONS.yarn);
  // spinning wheel (turns)
  const sw=new THREE.Group();put(root,sw,1.4,0,Dz/2+1.6,0,.4,0);bx(sw,1,.12,.36,vm('planks'),0,.4,0);for(const[a,b]of[[1,1],[1,-1],[-1,1],[-1,-1]])bx(sw,.06,.4,.06,vm('planksDark'),a*.4,.2,b*.14);
  for(const s of[-1,1])bx(sw,.06,.8,.06,vm('planksDark'),.2,.85,s*.08);const wh=new THREE.Group();put(sw,wh,.2,1.1,0);for(let i=0;i<8;i++){const sp=bx(wh,.04,.62,.04,vm('planks'),0,0,0);sp.rotation.x=i*Math.PI/8;}
  for(let i=0;i<8;i++){const a=i/8*Math.PI*2;bx(wh,.05,.1,.24,vm('planksDark'),0,Math.sin(a)*.32,Math.cos(a)*.32,a,0,0);}wh.children[0].onBeforeRender=()=>{wh.rotation.x=performance.now()/1000*1.5;};
  bx(sw,.06,.5,.06,vm('planksDark'),-.35,.65,0);bx(sw,.12,.2,.12,vm('woolFluff'),-.35,.95,0);bx(sw,.4,.4,.4,vm('planks'),-.8,.2,.4);
  // skein lines, dye vats, raw wool
  const sl=new THREE.Group();put(root,sl,-2.6,0,Dz/2+2.4);for(const s of[-1,1])vlog(sl,.14,1.9,.14,'y',s*1.4,.95,0);bx(sl,2.8,.04,.04,vm('rope'),0,1.75,0);
  ['woolRed','woolBlue','gold','woolGreen','woolPurple','woolRed','woolBlue'].forEach((c,i)=>{bx(sl,.14,.6,.06,vm(c),-1.1+i*.36,1.42,0);bx(sl,.18,.08,.08,vm(c),-1.1+i*.36,1.72,0);});
  ['liqRed','liqBlue','liqYellow'].forEach((q,i)=>vTub(root,Lx/2+.9,-1.2+i*1.1,q,.8));
  for(let i=0;i<5;i++)bx(root,.36,.3,.36,vm('woolFluff'),3.6+(i%3)*.38,.15+(i>2?.3:0),2.2+(i>2?.1:0));vSack(root,3.6,1.4);vWoodpile(root,8,4,1,-Dz/2-.45);return root;}

/* ---------- Kitchen (open hall with hearth, cauldron and oven) ---------- */
function vxKitchen(){const root=new THREE.Group(),L=[];root.userData.lights=L;const Lx=6.4,Dz=4.4,H=2.4;
  vYard(root,11,8,0,.6);bx(root,Lx,.2,Dz,vm('cobble'),0,.1,0);
  bx(root,Lx,1.2,.3,vm('stoneBrick'),0,.8,-Dz/2+.15);bx(root,Lx,1.6,.2,vm('planksV'),0,2.2,-Dz/2+.1);
  for(const x of[-Lx/2+.15,-1,1,Lx/2-.15])for(const z of[-Dz/2+.15,Dz/2-.15])vlog(root,.3,2.9,.3,'y',x,1.55,z);for(const z of[-Dz/2+.15,Dz/2-.15])bx(root,Lx,.24,.3,vm('timber'),0,2.9,z);
  put(root,vRoof(Dz,Lx,H,vm('shingle'),{ov:.7,ovL:.5,step:.4,gable:vm('planksV'),ridge:vm('planksDark')}),0,3,0);
  // hearth with cauldron on an iron crane
  const hx=-.6,hz=-Dz/2+.9;bx(root,2,.5,1.2,vm('stoneBrick'),hx,.45,hz);const e=new THREE.Mesh(new THREE.BoxGeometry(1.2,.14,.7),EMBER);e.position.set(hx,.77,hz);root.add(e);
  for(const[fx,s]of[[-.2,.28],[.2,.22],[0,.18]]){const f=new THREE.Mesh(new THREE.BoxGeometry(s,s*1.5,s),FIRE);f.position.set(hx+fx,.84+s*.75,hz);root.add(f);}
  e.onBeforeRender=()=>{const t=performance.now()/1000;EMBER.emissiveIntensity=2.1+.45*Math.sin(t*5.3);FIRE.emissiveIntensity=1.8+.6*Math.sin(t*9.1+1);};
  bx(root,2,1.2,.6,vm('stoneBrick'),hx,2.6,hz-.3);bx(root,1.2,3.2,.8,vm('stoneBrick'),hx,4.4,hz-.3);bx(root,1.4,.16,1,vm('cobble'),hx,6.08,hz-.3);
  bx(root,.08,1.6,.08,vm('iron'),hx+.9,1.5,hz);bx(root,1,.06,.06,vm('iron'),hx+.45,2.2,hz);bx(root,.03,.5,.03,vm('iron'),hx,1.95,hz);
  const cd=new THREE.Group();put(root,cd,hx,1.2,hz);bx(cd,.6,.5,.6,vm('iron'),0,.25,0);bx(cd,.5,.04,.5,vm('stew'),0,.48,0);bx(cd,.7,.08,.7,vm('iron'),0,.5,0);
  const pl=new THREE.PointLight(0xff6a24,0,7,2);pl.position.set(hx,1.4,hz+.8);pl.userData.lamp=true;pl.userData.min=1.2;root.add(pl);L.push(pl);
  // small oven, tables, shelves, hanging pans
  bx(root,1.4,.8,1.4,vm('stoneBrick'),2.2,.6,-Dz/2+1);vDome(root,2.2,-Dz/2+1,.7,1,3,vm('brick'),.25);vMouth(root,2.2,.95,-Dz/2+1.7,.4,.35,true,L);
  const t1=vTable(root,0,.9,2,.8);for(let i=0;i<3;i++)bx(t1,.2,.18,.2,vm('leaves'),-.8+i*.25,.99,-.1);for(let i=0;i<4;i++)bx(t1,.06,.06,.22,vm('gold'),-.1+i*.08,.93,.15);bx(t1,.4,.12,.3,vm('liqRed'),.6,.96,0);bx(t1,.5,.04,.36,vm('planks'),.6,.91,0);bx(t1,.24,.12,.16,vm('hay'),.6,.96,-.3);
  const sv=new THREE.Group();put(root,sv,1.8,0,-Dz/2+.32);for(let k=0;k<2;k++){bx(sv,1.6,.06,.3,vm('planks'),0,1.7+k*.5,0);for(let i=0;i<4;i++)bx(sv,.2,.24,.2,vm(i%2?'barrel':'iron'),-.6+i*.4,1.85+k*.5,0);}
  bx(root,2.4,.06,.06,vm('iron'),-.6,2.6,-.4);for(let i=0;i<4;i++){bx(root,.03,.2,.03,vm('iron'),-1.5+i*.6,2.48,-.4);bx(root,.3,.04,.3,vm('iron'),-1.5+i*.6,2.36,-.4);}
  vBarrel(root,-Lx/2+.5,1,true);vSack(root,Lx/2-.5,1.2);vSack(root,Lx/2-.6,.7);vWoodpile(root,6,4,-Lx/2-.5,-.4,Math.PI/2);vBench(root,0,Dz/2+.7);return root;}

/* ---------- Smokehouse ---------- */
function vxSmokehouse(){const root=new THREE.Group(),L=[];root.userData.lights=L;const Lx=3,Dz=3,sh=1.1,hw=3.4,H=2.2;
  vYard(root,8,7,0,.6);
  const W1=vWalls({Lx,Dz,y:0,h:sh,t:.3,mat:vm('cobble'),ops:{front:[{type:'hole',x:0,w:1.1,y0:0,y1:sh}],back:[],right:[],left:[]}});root.add(W1.group);
  const W2=vWalls({Lx,Dz,y:sh,h:hw-sh,t:.2,mat:vm('planksV'),ops:{front:[{type:'hole',x:0,w:1.1,y0:0,y1:1.1}],back:[],right:[],left:[]},frame:vm('timber')});root.add(W2.group);
  for(const[sx,sz]of[[1,1],[1,-1],[-1,1],[-1,-1]])vlog(root,.3,hw,.3,'y',sx*Lx/2,hw/2,sz*Dz/2);
  const F=W2.faces.front;bx(F,1.1,2.2,.04,vm('dark'),0,0,-Dz+.3);
  for(let i=0;i<5;i++){const x=-.4+i*.2;bx(F,.03,.2,.03,vm('iron'),x,.95,-.8);if(i%2===0){bx(F,.18,.34,.16,vm('liqRed'),x,.7,-.8);bx(F,.12,.1,.12,vm('hide'),x,.5,-.8);}else vFish(F,x,.68,-.8);}
  const dr=new THREE.Group();put(F,dr,-.55,-sh,.02);dr.rotation.y=-1.5;bx(dr,1.1,2.2,.08,vm('planksV'),.55,1.1,0);for(const y of[.4,1.8])bx(dr,.9,.06,.03,vm('iron'),.5,y,.05);
  const fb=W1.faces.front;bx(fb,1.1,1.1,.04,vm('dark'),0,.55,-.28);const e=new THREE.Mesh(new THREE.BoxGeometry(.8,.16,.3),EMBER);e.position.set(0,.1,-.12);fb.add(e);const f=new THREE.Mesh(new THREE.BoxGeometry(.24,.3,.2),FIRE);f.position.set(-.1,.3,-.12);fb.add(f);
  e.onBeforeRender=()=>{const t=performance.now()/1000;EMBER.emissiveIntensity=2.1+.45*Math.sin(t*5.3);FIRE.emissiveIntensity=1.8+.6*Math.sin(t*9.1+1);};
  const pl=new THREE.PointLight(0xff6a24,0,5,2);pl.position.set(0,.5,Dz/2+.6);pl.userData.lamp=true;pl.userData.min=.9;root.add(pl);L.push(pl);
  put(root,vRoof(Dz,Lx,H,vm('shingle'),{ov:.5,ovL:.4,step:.37,gable:vm('planksV'),ridge:vm('planksDark')}),0,hw,0);
  const lv=new THREE.Group();put(root,lv,0,hw+H+.1,0);bx(lv,1.4,.5,.6,vm('dark'),0,.25,0);for(const s of[-1,1])bx(lv,.1,.5,.7,vm('planksDark'),s*.65,.25,0);for(let i=0;i<3;i++)for(const s of[-1,1])bx(lv,1.3,.06,.12,vm('planksDark'),0,.08+i*.16,s*.32,s*.5,0,0);bx(lv,1.6,.14,.9,vm('shingle'),0,.56,0);
  vSmoke(root,0,hw+H+.7,0,6,.25);
  const rk=new THREE.Group();put(root,rk,2.6,0,1.2);for(const s of[-1,1])vlog(rk,.14,1.8,.14,'y',s*.7,.9,0);bx(rk,1.6,.08,.08,vm('planksDark'),0,1.7,0);for(let i=0;i<4;i++)vFish(rk,-.5+i*.33,1.4,0,i);
  for(const z of[-.5,.2])vBarrel(root,-Lx/2-.5,z).children.forEach((c,i)=>{if(i===1)c.material=vm('woolWhite');});
  const cp=new THREE.Group();put(root,cp,-1.6,0,Dz/2+1.4);for(let i=0;i<7;i++)bx(cp,.3,.14,.3,vm('planks'),(i%3-1)*.26,.07+Math.floor(i/3)*.14,(i%2)*.12);
  vWoodpile(root,6,5,Lx/2+.45,-.6,Math.PI/2);const tb=vTable(root,2.4,-1.6+0,1.2,.6,1.5);vFish(tb,0,.95,0,Math.PI/2).rotation.z=Math.PI/2;bx(tb,.3,.03,.05,vm('iron'),.3,.92,.1);
  root.userData.ground=6.4;return root;}

[['vx-hunter',"Hunter's lodge",vxHunter,'Log lodge with an antler mount over the door, a lean-to hung with furs and game, hide stretching frames, a roasting spit over a fire pit, a skinning table and a bow rack.',null],
 ['vx-gatherer',"Gatherer's hut",vxGatherer,'Small thatched hut with herb bundles drying under the eaves, baskets of berries and mushrooms, a sorting table, berry bushes and a mushroom log.',null],
 ['vx-leather','Leatherworker',vxLeatherworker,'Plank workshop with a counter of boots, bags and belts, a tiled tanning shed with three vats, hide frames, a drying rack of leather and a cutting table.',null],
 ['vx-loom','Loom house',vxLoom,'Open-fronted weaving shed with two floor looms threaded with coloured warps, shelves of yarn, baskets of wool and a yarn sign.',null],
 ['vx-tailor','Tailor',vxTailor,'Plaster-and-oak shop with a dress form and bolts of cloth in the window under a striped awning, a scissors sign and a rail of hanging tunics.',null],
 ['vx-sheepfold','Sheep fold',vxSheepFold,'Drystone fold with a plank gate, a shingled shelter with a hay rack, a water trough, and a shepherd\'s crook.',8.4],
 ['vx-weaver','Weaver',vxWeaver,'Thatched cottage-style house with a turning spinning wheel, coloured skeins drying on a line, three dye vats and heaps of raw wool.',null],
 ['vx-kitchen','Kitchen',vxKitchen,'Open kitchen hall with a glowing hearth and cauldron on an iron crane, a tall chimney, a brick oven, a prep table of food, shelves of pots and hanging pans.',null],
 ['vx-smokehouse','Smokehouse',vxSmokehouse,'Tall plank smokehouse on a stone firebox that glows, with hams and fish hanging inside the open door, a louvred roof vent trailing smoke, salt barrels and a fish rack.',6.4],
].forEach(([id,name,build,desc,g])=>ASSETS.push({id,folder:'buildings/medieval',name,build,desc,groundR:g||undefined}));

/* ---------- Chicken coop (separate small building) ---------- */
function vHen(par,x,z,ry=0,c='woolWhite'){const h=new THREE.Group();put(par,h,x,0,z,0,ry,0);bx(h,.22,.2,.32,vm(c),0,.22,0);bx(h,.16,.16,.14,vm(c),0,.38,.16);bx(h,.06,.06,.06,vm('gold'),0,.36,.25);bx(h,.04,.06,.08,vm('woolRed'),0,.48,.15);bx(h,.14,.1,.08,vm(c),0,.3,-.18,.5,0,0);for(const s of[-1,1])bx(h,.03,.12,.03,vm('gold'),s*.05,.06,0);return h;}
function vxChickenCoop(){const root=new THREE.Group(),L=[];root.userData.lights=L;const Lx=2.4,Dz=1.8,lift=.6,hw=1.4;
  vYard(root,6.4,5.6,0,.8);const cp=new THREE.Group();put(root,cp,0,0,-.6);
  for(const[a,b]of[[1,1],[1,-1],[-1,1],[-1,-1]])vlog(cp,.16,lift,.16,'y',a*(Lx/2-.1),lift/2,b*(Dz/2-.1));bx(cp,Lx,.1,Dz,vm('planks'),0,lift+.05,0);
  const W=vWalls({Lx,Dz,y:lift+.1,h:hw,t:.12,mat:vm('planksV'),ops:{front:[{type:'hole',x:.6,w:.36,y0:0,y1:.4},{x:-.6,w:.4,y0:.6,y1:1}],back:[],right:[],left:[{type:'door',x:0,w:.7,y0:0,y1:1.1}]},frame:vm('timber')});cp.add(W.group);
  bx(W.faces.front,.36,.4,.04,vm('dark'),.6,.2,-.1);put(cp,vRoof(Dz,Lx,.9,vm('shingle'),{ov:.3,ovL:.25,step:.3,gable:vm('planksV'),ridge:vm('planksDark')}),0,lift+.1+hw,0);
  const nb=new THREE.Group();put(cp,nb,Lx/2+.25,lift+.1,0);bx(nb,.5,.5,1.2,vm('planksV'),0,.25,0);bx(nb,.6,.08,1.3,vm('shingle'),.05,.54,0,0,0,-.35);
  const rp=new THREE.Group();put(cp,rp,.6,0,Dz/2+.55,.55,0,0);bx(rp,.36,.04,1.3,vm('planks'),0,0,0);for(let i=0;i<5;i++)bx(rp,.36,.03,.04,vm('planksDark'),0,.03,-.5+i*.25);rp.position.y=lift/2-.03;
  for(const[x0,z0,x1,z1]of[[-2.6,.6,2.6,.6]])0;
  const run=(a,b,c,d,ry)=>vFence(root,Math.hypot(b-a,d-c),(a+b)/2,(c+d)/2,ry);run(-2.6,2.6,2.6,2.6,0);run(-2.6,-2.6,-1.6,2.6,Math.PI/2);run(2.6,2.6,-1.6,2.6,Math.PI/2);run(-2.6,-1.3,-1.6,-1.6,0);run(1.3,2.6,-1.6,-1.6,0);
  const ft=new THREE.Group();put(root,ft,-1.4,0,1.4);bx(ft,1,.16,.3,vm('planksDark'),0,.08,0);bx(ft,.9,.04,.22,vm('hay'),0,.16,0);
  bx(root,.4,.08,.4,vm('iron'),1.6,.04,1.6);bx(root,.32,.02,.32,vm('water'),1.6,.08,1.6);vSack(root,2.1,-2.2);
  root.userData.ground=4.8;return root;}
ASSETS.push({id:'vx-coop',folder:'buildings/medieval',name:'Chicken coop',build:vxChickenCoop,desc:'Small plank hen house on log stilts with a shingle roof, pop-hole ramp and nest box, inside a fenced run with a feed trough and water dish.',groundR:4.8});
