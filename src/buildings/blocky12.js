/* ======================= fruit trees, orchard, sawmill, carpenter, stonemason, log houses, more terrain ======================= */
VXD.blossomPink=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,r()<.18?'#c86a8a':r()<.3?'#f6d8e2':'#eaa0b8',nz(r,.9,1.06));};
VXD.blossomWhite=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,r()<.15?'#8ab05a':r()<.35?'#f8f4ee':'#ecdce0',nz(r,.92,1.04));};
VXD.fruitLeaves=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,r()<.2?'#2e5420':'#4e7e30',nz(r,.85,1.1));};
VXD.gravel=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,['#8a8680','#a09a90','#6e6a64','#b4ae a4'.replace(' ','')][Math.floor(r()*4)],nz(r,.9,1.08));};
VXD.tilled=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,x%4<2?'#5e4630':'#7a5c3e',nz(r,.86,1.08));};
VXD.litter=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++){const k=r();P(x,y,k<.25?'#7a5a2a':k<.4?'#a8742e':k<.5?'#8a3a22':k<.8?'#5a7a32':'#6a5a3a',nz(r,.85,1.08));}};
ICONS.saw=(g,x,y,z)=>{for(const s of[-1,1]){bx(g,.04,.12,.34,vm('iron'),x*s,y,z+.04);bx(g,.04,.14,.1,vm('planks'),x*s,y,z-.17);for(let i=0;i<5;i++)bx(g,.045,.03,.03,vm('iron'),x*s,y-.07,z-.08+i*.06);}};
ICONS.mallet=(g,x,y,z)=>{for(const s of[-1,1]){bx(g,.04,.14,.26,vm('planks'),x*s,y+.08,z);bx(g,.04,.26,.05,vm('planksDark'),x*s,y-.08,z);}};

/* ---------- fruit trees ---------- */
const FRUIT={apple:{name:'Apple',fruit:'woolRed',s:.13,bloom:'blossomWhite'},pear:{name:'Pear',fruit:'pearSkin',s:.13,bloom:'blossomWhite'},cherry:{name:'Cherry',fruit:'cherrySkin',s:.08,bloom:'blossomPink'},plum:{name:'Plum',fruit:'woolPurple',s:.11,bloom:'blossomPink'}};
VXD.pearSkin=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,'#c8c050',nz(r,.88,1.08));};VXD.cherrySkin=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,'#8a1a22',nz(r,.88,1.1));};
function onFaces(root,blocks,mat,n,s,r){for(let i=0;i<n;i++){const b=blocks[Math.floor(r()*blocks.length)],p=b.geometry.parameters,c=b.position,f=Math.floor(r()*5),u=(r()-.5)*.8,v=(r()-.5)*.8;let x=c.x,y=c.y,z=c.z;
  if(f===0){x+=p.width/2+s/3;y+=v*p.height/2;z+=u*p.depth/2;}else if(f===1){x-=p.width/2+s/3;y+=v*p.height/2;z+=u*p.depth/2;}else if(f===2){z+=p.depth/2+s/3;y+=v*p.height/2;x+=u*p.width/2;}else if(f===3){z-=p.depth/2+s/3;y+=v*p.height/2;x+=u*p.width/2;}else{y-=p.height/2+s/3;x+=u*p.width/2;z+=v*p.depth/2;}
  const inside=blocks.some(o=>o!==b&&Math.abs(x-o.position.x)<o.geometry.parameters.width/2&&Math.abs(y-o.position.y)<o.geometry.parameters.height/2&&Math.abs(z-o.position.z)<o.geometry.parameters.depth/2);if(!inside)bx(root,s,s*1.1,s,mat,x,y,z);}}
function vFruitTree(par,kind,mature,bloom,r,x=0,z=0){const F=FRUIT[kind],g=new THREE.Group();put(par,g,x,0,z,0,r()*6,0);const H=mature?3.4+r()*1.1:2+r()*.7,tw=mature?.32:.18,lm=vm(bloom?F.bloom:'fruitLeaves');
  bx(g,tw,H*.45,tw,vm('bark'),0,H*.225,0);const blocks=[],cy=H*.66,cw=H*.62;for(let i=0;i<3;i++){const a=i/3*Math.PI*2+r(),L=cw*.3,br=new THREE.Group();put(g,br,0,H*.4,0,0,a,0);bx(br,tw*.6,tw*.6,L,vm('bark'),0,0,L/2,-.6,0,0);}
  blocks.push(bx(g,cw,H*.34,cw,lm,0,cy,0));blocks.push(bx(g,cw*.7,H*.2,cw*.7,lm,0,cy+H*.25,0));blocks.push(bx(g,cw*1.1,H*.18,cw*.75,lm,0,cy-.04,0));blocks.push(bx(g,cw*.75,H*.18,cw*1.1,lm,0,cy-.04,0));
  for(let i=0;i<5;i++){const a=r()*6.28,s=cw*(.25+r()*.15),d=cw*.5+s*.3;blocks.push(bx(g,s,s*.8,s,lm,Math.cos(a)*d,cy+(r()-.5)*H*.15,Math.sin(a)*d));}
  if(bloom){for(let i=0;i<6;i++)bx(g,.06,.02,.06,vm(F.bloom),(r()-.5)*cw*1.6,.02,(r()-.5)*cw*1.6);}
  else{onFaces(g,blocks,vm(F.fruit),mature?44:22,F.s,r);for(let i=0;i<4;i++)bx(g,F.s,F.s,F.s,vm(F.fruit),(r()-.5)*cw*1.4,F.s/2,(r()-.5)*cw*1.4);}
  return g;}
function vxFruitTree(kind){return(s,o={})=>{const root=new THREE.Group();root.userData.lights=[];const r=mulberry32((s||1)*613+hashStr(kind));vFruitTree(root,kind,o.size!=='young',o.season==='bloom',r);
  for(let i=0;i<4;i++){const a=r()*6.28,d=1+r()*1.2;vSprite(root,shortGrassMat(),Math.cos(a)*d,0,Math.sin(a)*d,.35,.3,a);}root.userData.ground=3.6;return root;};}

/* ---------- Orchard (farming) ---------- */
function vxOrchard(sd,o={}){const root=new THREE.Group();root.userData.lights=[];const dims={small:[3,3],medium:[4,4],large:[6,5]}[o.size||'medium'],sp=4,W=dims[0]*sp,D=dims[1]*sp;
  const kinds=o.trees==='mixed'?Object.keys(FRUIT):[o.trees||'apple'],r=mulberry32(77+(sd||1));
  for(let i=0;i<dims[0];i++)for(let k=0;k<dims[1];k++){const x=-W/2+sp/2+i*sp,z=-D/2+sp/2+k*sp;vFruitTree(root,kinds[(i+k)%kinds.length],r()<.8,o.season==='bloom',mulberry32(i*31+k*7+(sd||1)),x+(r()-.5)*.4,z+(r()-.5)*.4);}
  for(let i=0;i<dims[0]-1;i++)for(let z=-D/2+.4;z<D/2;z+=.8)bx(root,.7,.02,.7,vm('grassDirt'),-W/2+sp+i*sp,.01,z);
  if(o.fence!==0){const seg=(a,b,c,d)=>{const len=Math.hypot(b-a,d-c),n=Math.ceil(len/3.2);for(let i=0;i<n;i++){const t=(i+.5)/n;vFence(root,len/n,a+(b-a)*t,c+(d-c)*t,Math.abs(b-a)>.01?0:Math.PI/2);}};
    const hw=W/2+.6,hd=D/2+.6;seg(-hw,-1.4,hd,hd);seg(1.4,hw,hd,hd);seg(-hw,hw,-hd,-hd);seg(-hw,-hw,-hd,hd);seg(hw,hw,-hd,hd);}
  const ld=new THREE.Group();put(root,ld,-W/2+sp/2+.9,0,-D/2+sp/2+.4,.3,.6,0);for(const s of[-1,1])bx(ld,.06,2.4,.06,vm('planksDark'),s*.2,1.2,0);for(let i=0;i<7;i++)bx(ld,.4,.05,.05,vm('planks'),0,.25+i*.32,0);
  if(o.season!=='bloom'){const fk=FRUIT[kinds[0]].fruit;for(let i=0;i<3;i++)vBasket(root,-1+i*.6,0,D/2+.1,fk==='woolRed'||fk==='woolPurple'?fk:'gold',6);}
  vCart(root,W/2+2.4,D/2-1.6,1.4,null);root.userData.ground=Math.max(W,D)/2+3;return root;}

/* ---------- water wheel shared by the sawmill ---------- */
function vWaterWheel(par,x,y,z,R){const hub=new THREE.Group();hub.position.set(x,y,z);par.add(hub);const rot=new THREE.Group();hub.add(rot);bx(rot,.8,.5,.5,vm('planksDark'),0,0,0);const N=16;
  for(let i=0;i<N;i++){const a=i/N*Math.PI*2,yy=Math.sin(a),zz=Math.cos(a),th=Math.PI/2-a;for(const s of[-1,1])bx(rot,.12,.22,2*Math.PI*R/N+.04,vm('planksDark'),s*.36,yy*R,zz*R,th,0,0);bx(rot,.84,.36,.06,vm('planks'),0,yy*(R+.12),zz*(R+.12),th,0,0);if(i%2===0)for(const s of[-1,1])bx(rot,.1,R,.12,vm('planksDark'),s*.36,yy*R/2,zz*R/2,th,0,0);}
  rot.children[0].onBeforeRender=()=>{rot.rotation.x=performance.now()/1000*.6;};return rot;}

/* ---------- Sawmill ---------- */
function vxSawmill(){const root=new THREE.Group(),L=[];root.userData.lights=L;const Lx=8,Dz=5,hw=3,cx=Lx/2+1.9;
  vYard(root,12,10,-1.4,1);vWaterArea(root,3,18,cx,0);for(const s of[-1,1])for(let z=-8.8;z<9;z+=.8)bx(root,.4,.32,.8,vm(((z*5)|0)%3?'cobble':'stone'),cx+s*1.7,.16,z+.4).userData.noFrame=true;
  bx(root,Lx,.2,Dz,vm('planks'),0,.1,0);bx(root,Lx,2.2,.2,vm('planksV'),0,1.2,-Dz/2+.1);bx(root,.2,1.2,Dz-.2,vm('planksV'),-Lx/2+.1,.8,0);
  for(const x of[-Lx/2+.15,-1.3,1.3,Lx/2-.15])for(const z of[-Dz/2+.15,Dz/2-.15])vlog(root,.3,hw,.3,'y',x,hw/2,z);for(const z of[-Dz/2+.15,Dz/2-.15])bx(root,Lx,.24,.3,vm('timber'),0,hw-.1,z);
  put(root,vRoof(Dz,Lx,2.2,vm('shingle'),{ov:.7,ovL:.5,step:.37,gable:vm('planksV'),ridge:vm('planksDark')}),0,hw,0);
  vlog(root,cx-Lx/2+1.4,.3,.3,'x',(Lx/2+cx+1.4)/2,1.9,0);vWaterWheel(root,cx,1.9,0,1.8);for(const px of[cx-.7,cx+.7]){vlog(root,.3,2.05,.3,'y',px,1.03,0);bx(root,.42,.24,.42,vm('planksDark'),px,1.92,0);for(const s of[-1,1])bx(root,.12,1.6,.12,vm('planksDark'),px,.8,s*.45,s*.32,0,0);}vlog(root,.3,1.9,.3,'y',cx+1.25,.95,0);bx(root,.4,.24,.4,vm('planksDark'),cx+1.25,1.92,0);bx(root,.3,.3,.3,vm('iron'),Lx/2-.2,1.6,0);
  // frame saw: posts, a sash that moves up and down, a log on a carriage
  for(const z of[-.7,.7])bx(root,.2,2.8,.2,vm('timber'),0,1.6,z);bx(root,.3,.2,1.7,vm('timber'),0,3,0);
  const sash=new THREE.Group();sash.position.set(0,1.6,0);root.add(sash);for(const y of[-.7,.7])bx(sash,.1,.1,1.2,vm('planksDark'),0,y,0);for(const z of[-.15,.15])bx(sash,.02,1.5,.04,vm('iron'),0,0,z);
  sash.children[0].onBeforeRender=()=>{sash.position.y=1.6+Math.sin(performance.now()/1000*5)*.28;};
  for(const z of[-.45,.45])bx(root,6.4,.12,.12,vm('planksDark'),0,.3,z);bx(root,3,.1,1.1,vm('planks'),-.6,.42,0);const lg=vlog(root,3.6,.55,.55,'x',-.7,.75,0);
  for(const z of[-.15,.15])bx(root,1.6,.5,.02,vm('planks'),1.6,.72,z);
  const sd=new THREE.Group();put(root,sd,.4,.2,1.2);for(let i=0;i<4;i++)bx(sd,.6-i*.12,.08,.5-i*.08,vm('sand'),0,.04+i*.08,0);
  const lp=new THREE.Group();put(root,lp,-Lx/2-2.2,0,1.2,0,Math.PI/2,0);for(let r=0;r<3;r++)for(let c=0;c<4-r;c++)vlog(lp,.5,.5,3.6,'z',(c-(3-r)/2)*.52,.25+r*.46,0);
  const ps=new THREE.Group();put(root,ps,-1.4,0,Dz/2+2);for(let k=0;k<2;k++){for(let i=0;i<6;i++)bx(ps,2.4,.06,.3,vm('planks'),k*2.8,.1+i*.14,(i%2-.5)*.3);for(const x of[-1,0,1])bx(ps,.08,.06,.7,vm('planksDark'),k*2.8+x,.04,0);}
  vCart(root,-Lx/2-2.4,-2.6,.3,null);vLantern(root,L,-1.3,2.4,Dz/2-.3);root.userData.ground=11;return root;}

/* ---------- Carpenter ---------- */
function vxCarpenter(){const root=new THREE.Group(),L=[];root.userData.lights=L;const Lx=6,Dz=4.4,base=.3,hw=2.6;
  vYard(root,11,9,1,1.2);bx(root,Lx+.1,base,Dz+.1,vm('cobble'),0,base/2,0);
  const W=vWalls({Lx,Dz,y:base,h:hw,t:.2,mat:vm('planksV'),ops:{front:[{type:'door',x:-1.4,w:1.1,y0:0,y1:2.1},{x:1.2,w:1,y0:.9,y1:1.7}],back:[{x:0,w:.8,y0:.9,y1:1.7}],right:[{type:'door',x:0,w:1.2,y0:0,y1:2.2,open:1.3}],left:[{x:0,w:.8,y0:.9,y1:1.7}]},frame:vm('timber')});root.add(W.group);
  put(root,vRoof(Dz,Lx,2.2,vm('shingle'),{ov:.7,ovL:.5,step:.37,gable:vm('planksV'),ridge:vm('planksDark')}),0,base+hw,0);
  bx(root,.7,base+hw+2.8,.7,vm('cobble'),-Lx/2-.4,(base+hw+2.8)/2,-.6);vHangSign(W.faces.front,Lx/2-.3,hw-.2,0,ICONS.saw);vLantern(root,L,-.6,base+2,Dz/2);
  const lt=vLeanTo(root,Lx/2,0,2.4,4,0,vm('shingle'));
  const wb=vTable(lt,1.2,-.8,1.8,.8,Math.PI/2);put(wb,TOOLS.Saw.build(),.3,.95,-.1,0,.3,Math.PI/2);put(wb,TOOLS.Hammer.build(),-.4,.95,.1,0,-.4,Math.PI/2);bx(wb,.2,.2,.2,vm('iron'),-.75,.98,.3);
  for(const z of[.6,1.4]){const sh=new THREE.Group();put(lt,sh,1.2,0,z);for(const s of[-1,1]){bx(sh,.08,.7,.08,vm('planksDark'),s*.5,.35,-.15,.2,0,0);bx(sh,.08,.7,.08,vm('planksDark'),s*.5,.35,.15,-.2,0,0);}bx(sh,1.2,.1,.08,vm('planksDark'),0,.7,0);}
  bx(lt,2.4,.05,.3,vm('planks'),1.2,.78,1);
  const ch=iChair();put(root,ch,1.4,0,Dz/2+1.8,0,.4,0);const st=iStool();put(root,st,2.3,0,Dz/2+1.4);const tb=iTable('plain');tb.scale.setScalar(.8);put(root,tb,-1.6,0,Dz/2+2);const bb=vBarrel(root,Lx/2+.4,Dz/2+1.6);
  const pk=new THREE.Group();put(root,pk,-Lx/2-1.4,0,1.6,0,Math.PI/2,0);for(let i=0;i<7;i++)bx(pk,2.6,.06,.3,vm('planks'),0,.1+i*.12,(i%2-.5)*.32);for(const x of[-1,0,1])bx(pk,.08,.06,.7,vm('planksDark'),x,.04,0);
  vWoodpile(root,8,4,-.6,-Dz/2-.45);return root;}

/* ---------- Stonemason ---------- */
function vxStonemason(){const root=new THREE.Group(),L=[];root.userData.lights=L;const Lx=6,Dz=4.4,hw=2.4,t=.4,sb=vm('stoneBrick');
  vYard(root,12,10,0,1.6);
  const W=vWalls({Lx,Dz,y:0,h:hw,t,mat:vm('cobble'),ops:{front:[{type:'door',x:-1.2,w:1.1,y0:0,y1:2.1,lintel:sb},{x:1.2,w:.8,y0:.9,y1:1.6,sill:sb,lintel:sb}],back:[{x:0,w:.7,y0:.9,y1:1.6,sill:sb}],right:[{x:0,w:.7,y0:.9,y1:1.6,sill:sb}],left:[]}});root.add(W.group);
  for(let i=0,y=0;y<hw-.05;i++,y+=.4)for(const[sx,sz]of[[1,1],[1,-1],[-1,1],[-1,-1]]){const lx=i%2?.6:.4,lz=i%2?.4:.6;bx(root,lx,.4,lz,sb,sx*(Lx/2-lx/2+.02),y+.2,sz*(Dz/2-lz/2+.02));}
  put(root,vRoof(Dz,Lx,2.1,vm('slate'),{ov:.6,ovL:.5,step:.35,gable:vm('cobble'),gt:.4,ridge:sb}),0,hw,0);bx(root,.8,hw+2.9,1,sb,-Lx/2+.4,(hw+2.9)/2,0);
  vHangSign(W.faces.front,Lx/2-.3,hw-.2,0,ICONS.mallet);vLantern(root,L,-.3,2,Dz/2);
  const yd=Dz/2+2.4;for(let r=0;r<2;r++)for(let c=0;c<3-r;c++)bx(root,.78,.78,.78,sb,-3.2+(c-(2-r)/2)*.8,.39+r*.78,yd);for(let i=0;i<4;i++)bx(root,.8+i%2*.3,.6,.7,vm('stone'),3.4+(i%2)*.4,.3+Math.floor(i/2)*.6,yd-.4+(i%2)*.1,0,i*.3,0);
  const col=new THREE.Group();put(root,col,-.4,0,yd+.4);bx(col,.7,.2,.7,sb,0,.1,0);bx(col,.5,1.4,.5,vm('rock_granite'),0,.9,0);bx(col,.68,.18,.68,sb,0,1.69,0);
  const wb=new THREE.Group();put(root,wb,1.4,0,yd+.8);bx(wb,.9,.6,.9,vm('stone'),0,.3,0);bx(wb,.6,.4,.6,vm('stoneBrick'),.0,.8,0);bx(wb,.3,.2,.3,vm('stone'),.12,1.08,.1);
  const tb=vTable(root,1.6,yd-1,1.4,.7);for(let i=0;i<4;i++)bx(tb,.03,.03,.24,vm('iron'),-.4+i*.15,.92,0);const ml=new THREE.Group();put(tb,ml,.45,.92,0,0,.5,0);bx(ml,.12,.12,.2,vm('planks'),0,.06,0);bx(ml,.04,.04,.3,vm('planksDark'),0,.06,.24);
  const gs=new THREE.Group();put(root,gs,-Lx/2-1.2,0,1.2);for(const s of[-1,1])bx(gs,.1,.9,.1,vm('planksDark'),s*.18,.45,0);const wh=new THREE.Mesh(new THREE.CylinderGeometry(.38,.38,.12,20),vm('stone'));wh.rotation.z=Math.PI/2;wh.position.y=.85;wh.castShadow=true;gs.add(wh);bx(gs,.5,.06,.06,vm('iron'),0,.85,0);
  for(let i=0;i<10;i++){const rr=mulberry32(i*11);bx(root,.15+rr()*.2,.1+rr()*.12,.15+rr()*.2,vm(rr()<.5?'cobble':'stone'),(rr()-.5)*3,.07,yd+1.6+(rr()-.5)*.8);}
  const ct=vCart(root,4.6,0,-1.2+Math.PI/2,null);for(let i=0;i<2;i++)bx(ct,.6,.5,.6,sb,0,1,-.3+i*.65);root.userData.ground=10;return root;}

/* ---------- Log houses 1-5 (log walls, log corners, shingle roof, fieldstone chimney) ---------- */
function logHouse(c){const root=new THREE.Group(),L=[];root.userData.lights=L;const Lx=5.6,Dz=4.4,base=.2,hw=2.4,t=.3,H=2;
  vYard(root,9,7.6,0,.8);bx(root,Lx+.1,base,Dz+.1,vm('cobble'),0,base/2,0);
  root.add(vWalls({Lx:Lx-.4,Dz:Dz-.4,y:base,h:hw,t,mat:vm('logH'),ops:c.ops,unit:{frame:vm('planks'),shutter:c.shutter?vm(c.shutter):null}}).group);
  for(const[sx,sz]of[[1,1],[1,-1],[-1,1],[-1,-1]])vlog(root,.4,hw+.2,.4,'y',sx*(Lx/2-.2),base+(hw+.2)/2,sz*(Dz/2-.2));
  put(root,vRoof(Dz,Lx,H,vm('shingle'),{ov:.8,ovL:.6,step:.4,gable:vm('planksV'),ridge:vm('planksDark')}),0,base+hw,0);
  const cs=c.chim==='R'?1:-1,cg=new THREE.Group();put(root,cg,cs*(Lx/2+.5),0,c.chz||0);bx(cg,1.1,1.6,1.1,vm('field'in VXD?'field':'cobble'),0,.8,0);bx(cg,.75,base+hw+H+.6-1.6,.75,vm('cobble'),-cs*.08,1.6+(base+hw+H+.6-1.6)/2,0);bx(cg,.9,.14,.9,vm('stoneBrick'),-cs*.08,base+hw+H+.67,0);
  const dx=c.ops.front.find(o=>o.type==='door').x;
  if(c.porch){bx(root,Lx,.2,1.5,vm('planks'),0,base-.1,Dz/2+.75);for(const s of[-1,1])vlog(root,.26,2.1,.26,'y',s*(Lx/2-.3),base+1.05,Dz/2+1.35);bx(root,Lx+.4,.2,1.2,vm('shingle'),0,base+2.2,Dz/2+1.2);bx(root,Lx+.4,.2,.8,vm('shingle'),0,base+2.4,Dz/2+.85);bx(root,Lx,.14,.2,vm('planksDark'),0,base+2.06,Dz/2+1.35);}
  else vlog(root,1.2,.2,.4,'x',dx,.1,Dz/2+.25);
  vLantern(root,L,dx+.85,base+1.9,Dz/2-.15);c.props(root,{Lx,Dz});return root;}
const LOGHOUSES=[
 {ops:{front:[{type:'door',x:-.6,w:1,y0:0,y1:2},{x:1.3,w:.8,y0:.8,y1:1.6}],back:[{x:.6,w:.6,y0:.9,y1:1.5}],right:[{x:0,w:.7,y0:.9,y1:1.5}],left:[]},chim:'L',shutter:'woolRed',
  props:(r,{Lx,Dz})=>{vWoodpile(r,10,4,Lx/2+.45,0,Math.PI/2);vBarrel(r,1.9,Dz/2+.5,true);vBush(r,-3.4,1.6);},desc:'Door left of centre, a red-shuttered window, chimney on the left gable and firewood along the right.'},
 {ops:{front:[{type:'door',x:0,w:1,y0:0,y1:2},{x:-1.6,w:.7,y0:.8,y1:1.5},{x:1.6,w:.7,y0:.8,y1:1.5}],back:[{x:0,w:.7,y0:.9,y1:1.5}],right:[],left:[{x:0,w:.7,y0:.9,y1:1.5}]},chim:'R',porch:true,
  props:(r,{Lx,Dz})=>{vBench(r,-1.6,Dz/2+.9);vBarrel(r,-Lx/2-.3,Dz/2-.2,true);vWoodpile(r,8,4,0,-Dz/2-.45);},desc:'Centre door between two windows under a full-width covered porch with a bench, chimney on the right.'},
 {ops:{front:[{type:'door',x:1.4,w:1,y0:0,y1:2},{x:-.8,w:1.1,y0:.8,y1:1.6}],back:[{x:-1,w:.6,y0:.9,y1:1.5},{type:'door',x:1,w:.9,y0:0,y1:1.9}],right:[],left:[]},chim:'L',shutter:'woolBlue',
  props:(r,{Lx,Dz})=>{const cb=new THREE.Group();put(r,cb,-2.2,0,Dz/2+1.6);vlog(cb,.6,.6,.6,'y',0,.3,0);put(cb,TOOLS.Axe.build(),-.05,.95,.05,1.25,.4,0);vWoodpile(r,10,5,Lx/2+.45,0,Math.PI/2);},desc:'Door on the right, a wide blue-shuttered window, back door, chimney on the left and a chopping block in the yard.'},
 {ops:{front:[{type:'door',x:-1.5,w:1,y0:0,y1:2},{x:.4,w:.7,y0:.8,y1:1.5},{x:1.7,w:.5,y0:.9,y1:1.5}],back:[{x:.4,w:.7,y0:.9,y1:1.5}],right:[{x:.8,w:.6,y0:.9,y1:1.5}],left:[]},chim:'L',chz:-.8,porch:true,
  props:(r,{Lx,Dz})=>{vBarrel(r,Lx/2+.4,Dz/2+.3,true);vBarrel(r,Lx/2+.4,Dz/2-.4);const ch=iChair();put(r,ch,1,0,Dz/2+.9,0,.4,0);vBush(r,3.6,-1.4,.9);},desc:'Door on the left, two windows, a covered porch with a chair, chimney set to the back of the left gable.'},
 {ops:{front:[{type:'door',x:.7,w:1,y0:0,y1:2},{x:-1.4,w:.9,y0:.8,y1:1.6}],back:[{x:0,w:.8,y0:.9,y1:1.5}],right:[{x:-.6,w:.6,y0:.9,y1:1.5}],left:[{x:.6,w:.6,y0:.9,y1:1.5}]},chim:'R',chz:.8,shutter:'woolGreen',
  props:(r,{Lx,Dz})=>{vHideFrame(r,-Lx/2-1.4,1.4,Math.PI/2,'fur');vWoodpile(r,8,4,-.6,-Dz/2-.45);vBush(r,3.2,2,.8);},desc:'Door right of centre, a green-shuttered window, side windows, chimney to the front of the right gable and a hide drying frame.'},
];

/* ---------- more terrain ---------- */
function roadTile2(type,shape){const dist=(x,z)=>shape==='t'?Math.min(Math.abs(x),x>0?Math.abs(z):99):Math.min(Math.abs(x),Math.abs(z)),half=1.2;
  return vTile((x,z)=>{const d=dist(x,z),inR=d<half;if(type==='dirt'){if(inR)return'dirtRoad';return d<half+.4?'grassDirt':'grass';}if(type==='paved'){if(!inR)return'grass';return d>=half-.4?'kerb':'paved';}return inR?'stone':'grass';},
    (root,at)=>grassDeco(20,false)(root,at));}
function bridgeTile(kind){const root=waterTile('river');const y=T+.06;
  if(kind==='wood'){bx(root,4,.12,2.4,vm('planks'),0,y,0);for(const s of[-1,1]){bx(root,4,.08,.1,vm('planksDark'),0,y+.75,s*1.15);for(let x=-1.8;x<=1.8;x+=.9)bx(root,.1,.75,.1,vm('planksDark'),x,y+.38,s*1.15);}
    for(const x of[-.7,.7])for(const s of[-1,1])vlog(root,.22,y,.22,'y',x,y/2,s*.9);bx(root,4,.1,.2,vm('planksDark'),0,y-.1,0);}
  else{const sb=vm('stoneBrick');bx(root,4,.2,2.6,sb,0,y+.02,0);for(const s of[-1,1]){bx(root,4,.5,.3,sb,0,y+.37,s*1.15);bx(root,4,.08,.34,vm('cobble'),0,y+.66,s*1.15);}
    for(const[w,yy]of[[.4,.62],[.3,.46]])for(const s of[-1,1])bx(root,w,.16,2.6,sb,s*(1-w/2),yy,0);for(const s of[-1,1])bx(root,.4,.8,2.6,sb,s*1.2,.4,0);bx(root,2,.12,2.6,sb,0,y-.12,0);}
  root.userData.ground=-1;return root;}
function plainTile(cls,deco){return()=>vTile(()=>cls,deco);}
const extraMats=tileMats;tileMats=function(){const m=extraMats();Object.assign(m,{gravel:{top:vm('gravel'),side:vm('dirt')},tilled:{top:vm('tilled'),side:vm('dirt'),h:T-.02},litter:{top:vm('litter'),side:vm('grassSide')},plaza:{top:vm('flagstone'),side:vm('stoneBrick')},plazaRing:{top:vm('stoneBrick'),side:vm('stoneBrick')}});return m;};

/* ---------- registry ---------- */
for(const k in FRUIT)ASSETS.push({id:'env-fruit-'+k,folder:'environment/trees',name:`${FRUIT[k].name} tree`,build:vxFruitTree(k),variants:true,defaultSeed:1,
  desc:`${FRUIT[k].name} tree on a short trunk with a rounded crown, hung with fruit or in blossom, with a few windfalls underneath. New look gives a new shape.`,opts:[{key:'size',label:'Size',choices:[['young','Young'],['mature','Mature']],def:'mature'},{key:'season',label:'Season',choices:[['fruit','Fruit'],['bloom','Blossom']],def:'fruit'}]});
ASSETS.push({id:'vx-orchard',folder:'buildings/medieval/farming',name:'Orchard',build:vxOrchard,desc:'Rows of fruit trees 4 m apart with worn paths between, a ladder against a tree, baskets of picked fruit and a cart.',
  opts:[{key:'size',label:'Size',choices:[['small','3 × 3'],['medium','4 × 4'],['large','6 × 5']],def:'medium'},{key:'trees',label:'Trees',choices:[['apple','Apple'],['pear','Pear'],['cherry','Cherry'],['plum','Plum'],['mixed','Mixed']],def:'apple'},{key:'season',label:'Season',choices:[['fruit','Fruit'],['bloom','Blossom']],def:'fruit'},{key:'fence',label:'Fence',choices:[[1,'On'],[0,'Off']],def:1}]});
ASSETS.push({id:'vx-sawmill',folder:'buildings/medieval/production',name:'Sawmill',build:vxSawmill,desc:'Open timber shed beside a stream, its water wheel driving a frame saw that cuts a log on a carriage; log pile, plank stacks, sawdust and a cart.',groundR:11},
  {id:'vx-carpenter',folder:'buildings/medieval/production',name:'Carpenter',build:vxCarpenter,desc:'Plank workshop with a saw sign and a side shelter with a workbench and sawhorses; finished chair, stool and table out front, stacked planks and firewood.'},
  {id:'vx-stonemason',folder:'buildings/medieval/production',name:'Stonemason',build:vxStonemason,desc:'Cobble workshop with stone quoins and a mallet sign; a yard of dressed and rough blocks, a finished column, a block being carved, tools, a grindstone and a cart of stone.',groundR:10});
LOGHOUSES.forEach((c,k)=>ASSETS.push({id:`vx-log-${k+1}`,folder:'buildings/medieval/housing',name:`Log house ${k+1}`,build:()=>logHouse(c),desc:c.desc}));
for(const[t,T2]of[['dirt','Dirt road'],['paved','Paved road'],['stone','Stone road']])ASSETS.push({id:`tr-${t}-t`,folder:'terrain',name:`${T2} T-junction`,build:()=>roadTile2(t,'t'),desc:`${T2} junction: the north–south road with a branch to the east.`,groundR:-1},{id:`tr-${t}-x`,folder:'terrain',name:`${T2} crossroads`,build:()=>roadTile2(t,'cross'),desc:`${T2} crossroads in all four directions.`,groundR:-1});
ASSETS.push({id:'tr-river',folder:'terrain',name:'River',build:()=>waterTile('river'),desc:'Straight river channel north to south with sandy banks.',groundR:-1},{id:'tr-river-c',folder:'terrain',name:'River bend',build:()=>waterTile('riverCorner'),desc:'Quarter bend of the river, south edge to east edge.',groundR:-1},
  {id:'tr-bridge-wood',folder:'terrain',name:'Wooden bridge',build:()=>bridgeTile('wood'),desc:'Plank bridge on log piles carrying an east–west crossing over the river.',groundR:-1},{id:'tr-bridge-stone',folder:'terrain',name:'Stone bridge',build:()=>bridgeTile('stone'),desc:'Arched stone bridge with parapets over the river.',groundR:-1},
  {id:'tr-shore-o',folder:'terrain',name:'Shore outer corner',build:()=>waterTile('outer'),desc:'Outer corner of the shore: a point of land with water on two sides.',groundR:-1},
  {id:'tr-farmland',folder:'terrain',name:'Farmland',build:()=>vTile(()=>'tilled',(root)=>{const r=mulberry32(3);for(let i=0;i<30;i++){const x=Math.floor(r()*10)*.4-1.8,z=(r()-.5)*3.6;if(Math.round((x+2)/.4)%2===0)vSprite(root,shortGrassMat(),x,T-.02,z,.25,.2,r()*3);}}),desc:'Tilled furrows with young sprouts.',groundR:-1},
  {id:'tr-gravel',folder:'terrain',name:'Gravel',build:plainTile('gravel'),desc:'Loose grey gravel.',groundR:-1},
  {id:'tr-plaza',folder:'terrain',name:'Plaza',build:()=>vTile((x,z)=>{const d=Math.max(Math.abs(x),Math.abs(z));return d>1.2&&d<1.6?'plazaRing':'plaza';}),desc:'Town-square paving with an inset stone band; tiles seamlessly with itself.',groundR:-1},
  {id:'tr-forest',folder:'terrain',name:'Forest floor',build:()=>vTile(()=>'litter',(root)=>{const r=mulberry32(8);for(let i=0;i<14;i++){const x=(r()-.5)*3.6,z=(r()-.5)*3.6;if(i%4===0)vMushroom(root,x,z,.6,T);else if(i%4===1)bx(root,.5,.06,.06,vm('bark'),x,T+.03,z,0,r()*3,0);else vSprite(root,i%3?shortGrassMat():flowerMat('#e8e8f0'),x,T,z,.3,.3,r()*3);}}),desc:'Leaf litter with twigs, mushrooms and a few plants.',groundR:-1});
