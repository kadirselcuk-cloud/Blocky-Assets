/* ======================= phase 2: market stalls 1-5 (recolourable awnings), farmhouses 1-5 ======================= */
const AWNING_COLORS=[['#b03a2e','Red'],['#3a5a9a','Blue'],['#4a7a3a','Green'],['#c89a2a','Yellow'],['#6a3a7a','Purple'],['#c8642a','Orange'],['#8a5a3a','Brown'],['#2e2a28','Black']];
function awnKind(hex,solid){const k=(solid?'awnS':'awn')+hex.slice(1);if(!VXD[k])VXD[k]=solid?(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,hex,nz(r,.9,1.05));}:(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,Math.floor(x/4)%2?'#e8e4dc':hex,nz(r,.92,1.04));};return k;}
VXD.clayPot=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,y===4||y===11?'#7a3a20':'#b0603a',nz(r,.88,1.06));};
VXD.pumpkin=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,x%4===0?'#b85a10':'#e07a1a',nz(r,.9,1.06));};
/* recolourable parts are registered on the model so the viewer can swap them */
function awnBox(root,w,h,d,x,y,z,role,o){const m=box(w,h,d,vm(awnKind(root.userData.awnColor,role==='solid')),{s:.8,ox:0,oy:0,oz:0});put(root,m,x,y,z,o&&o[0],o&&o[1],o&&o[2]);m.userData.awnRole=role||'stripe';root.userData.awning.push(m);return m;}
function vStall(c){const root=new THREE.Group(),L=[];root.userData.lights=L;root.userData.awning=[];root.userData.awnColor=c.color;const W=c.W||3.2,D=c.D||1.8;
  vYard(root,W+2.4,D+2.6,0,.3);
  for(const[sx,sz,h]of[[1,1,2.5],[-1,1,2.5],[1,-1,2.9],[-1,-1,2.9]])vlog(root,.2,h,.2,'y',sx*(W/2-.1),h/2,sz*(D/2-.1));
  bx(root,W,.9,.08,vm('planksV'),0,.45,D/2-.04);for(const s of[-1,1])bx(root,.08,.9,D-.2,vm('planksV'),s*(W/2-.04),.45,0);
  bx(root,W+.1,.1,.75,vm('planks'),0,.95,D/2-.32);bx(root,W-.3,.08,.5,vm('planks'),0,1.35,-D/2+.35);for(const s of[-1,1])bx(root,.06,1.35,.06,vm('planksDark'),s*(W/2-.35),.67,-D/2+.15);
  for(let i=0;i<5;i++)awnBox(root,W+.5,.1,.5,0,2.95-i*.11,-D/2+.05+i*.45*(D/1.8));
  const nv=Math.round((W+.4)/.4);for(let i=0;i<nv;i++)if(i%2===0)awnBox(root,.36,.16,.04,-W/2-.1+.2+i*.4,2.43,D/2+.33,'solid');else bx(root,.36,.16,.04,vm('woolWhite'),-W/2-.1+.2+i*.4,2.43,D/2+.33);
  c.goods(root,{W,D,top:1,shelf:1.39});vLantern(root,L,W/2-.1,2.3,D/2-.1);root.userData.ground=4.8;return root;}
const tray=(par,x,z,y,goods)=>{const g=new THREE.Group();put(par,g,x,y,z);bx(g,.5,.12,.4,vm('crate'),0,.06,0);goods(g);return g;};
const STALLS=[
 {name:'produce',color:'#b03a2e',desc:'Produce: apples, cabbages, carrots and loaves on the counter, cheese and small crates on the back shelf.',
  goods:(r,{W,D})=>{tray(r,-1.15,D/2-.32,1,g=>{for(let i=0;i<9;i++)bx(g,.11,.11,.11,vm('woolRed'),-.15+(i%3)*.15,.18+(i>5?.08:0),-.12+Math.floor(i/3)*.12);});
    tray(r,-.4,D/2-.32,1,g=>{for(let i=0;i<4;i++)bx(g,.16,.15,.16,vm('leaves'),-.11+(i%2)*.22,.2,-.09+Math.floor(i/2)*.18);});
    tray(r,.4,D/2-.32,1,g=>{for(let i=0;i<6;i++)bx(g,.06,.06,.22,vm('gold'),-.16+i*.065,.15,0,0,(i%2?.2:-.2),0);});
    tray(r,1.15,D/2-.32,1,g=>{for(let i=0;i<4;i++)bx(g,.2,.1,.12,vm('hay'),-.1+(i%2)*.2,.17+Math.floor(i/2)*.1,-.07+(i%2)*.1);});
    for(let i=0;i<3;i++)bx(r,.26,.12,.26,vm('gold'),-1+i*.5,1.45,-D/2+.35);for(let i=0;i<3;i++)vCrate(r,.3,.6+i*.35,1.39,-D/2+.35,i*.3);
    vBarrel(r,-W/2-.5,.2);vSack(r,W/2+.4,.5);vSack(r,W/2+.5,-.1);vCrate(r,.5,W/2+.45,0,-.8,.3);}},
 {name:'tools',color:'#3a5a9a',desc:'Tools and hardware: axes, hammers and a pickaxe laid out, hanging tools on a back rack, horseshoes, nails and iron bars.',
  goods:(r,{W,D})=>{put(r,TOOLS.Axe.build(),-1.1,1.03,D/2-.45,0,.15,Math.PI/2);put(r,TOOLS.Hammer.build(),-.35,1.03,D/2-.3,0,-.3,Math.PI/2);put(r,TOOLS.Pickaxe.build(),.4,1.03,D/2-.45,0,.2,Math.PI/2);
    for(let i=0;i<3;i++){const hx=1.05+(i%2)*.2,hz=D/2-.45+i*.14;for(const s of[-1,1])bx(r,.04,.03,.18,vm('iron'),hx+s*.06,1.02,hz);bx(r,.16,.03,.04,vm('iron'),hx,1.02,hz-.08);}
    bx(r,W-.4,1,.06,vm('planksDark'),0,1.95,-D/2+.12);['Sledgehammer','Axe','Hammer','Pickaxe','Hammer'].forEach((n,i)=>vToolMount(r,n,-1.1+i*.55,1.7,-D/2+.25));
    for(let i=0;i<6;i++)bx(r,.3,.1,.14,vm('iron'),-.8+(i%3)*.32,1.45+Math.floor(i/3)*.1,-D/2+.35);
    const nb=vBarrel(r,-W/2-.5,.2);for(let i=0;i<5;i++)bx(nb,.05,.05,.05,vm('iron'),-.15+i*.07,.83,(i%2)*.08);vCrate(r,.5,W/2+.45,0,-.6,.2);bx(r,.6,.6,.6,vm('planksDark'),W/2+.5,.3,.4);bx(r,.4,.2,.3,vm('iron'),W/2+.5,.7,.4);}},
 {name:'bakery',color:'#c89a2a',desc:'Bread and dairy: baskets of loaves and buns, cheese wheels, milk jugs, honey pots and a basket of eggs.',
  goods:(r,{W,D})=>{vBasket(r,-1.15,1,D/2-.32,'hay',6);vBasket(r,-.55,1,D/2-.32,'hay',6);
    for(let i=0;i<3;i++){bx(r,.28,.12,.28,vm('gold'),.1+i*.1,1.06+i*.12,D/2-.32);}for(let i=0;i<3;i++){bx(r,.14,.24,.14,vm('woolWhite'),.75+i*.18,1.12,D/2-.25);bx(r,.1,.06,.1,vm('clayPot'),.75+i*.18,1.27,D/2-.25);}
    vBasket(r,1.25,1,D/2-.32,'woolWhite',6);for(let i=0;i<4;i++){bx(r,.16,.2,.16,vm('clayPot'),-1+i*.35,1.49,-D/2+.35);bx(r,.12,.06,.12,vm('gold'),-1+i*.35,1.62,-D/2+.35);}
    for(let i=0;i<3;i++)bx(r,.34,.14,.34,vm('gold'),.5+i*.38,1.46,-D/2+.35);vBarrel(r,-W/2-.5,.2);vSack(r,W/2+.4,.4);vSack(r,W/2+.4,-.2);}},
 {name:'cloth',color:'#6a3a7a',desc:'Cloth and textiles: bolts of dyed cloth, folded stacks, drapes hanging from the awning and baskets of yarn.',
  goods:(r,{W,D})=>{['woolRed','woolBlue','woolGreen','gold','woolPurple'].forEach((c,i)=>bx(r,.22,.22,.6,vm(c),-1.2+i*.32,1.11,D/2-.32));
    for(let k=0;k<4;k++)bx(r,.5,.06,.4,vm(['woolWhite','woolBlue','woolRed','woolGreen'][k]),.85,1.03+k*.06,D/2-.32);
    ['woolRed','gold','woolBlue','woolGreen'].forEach((c,i)=>bx(r,.36,.9,.03,vm(c),-1.2+i*.8,1.95,D/2+.2));
    for(let i=0;i<5;i++)bx(r,.24,.24,.24,vm(['woolRed','woolBlue','gold','woolWhite','woolPurple'][i]),-1.1+i*.5,1.51,-D/2+.35);
    vBasket(r,-W/2-.4,0,.5,'woolRed',6);vBasket(r,-W/2-.5,0,-.1,'woolBlue',6);vCrate(r,.5,W/2+.45,0,-.4,.2);}},
 {name:'pottery',color:'#4a7a3a',desc:'Pottery and goods: jugs, bowls and pots, coils of rope, candles, lanterns and woven baskets.',
  goods:(r,{W,D})=>{for(let i=0;i<4;i++){const x=-1.25+i*.3;bx(r,.2,.28,.2,vm('clayPot'),x,1.14,D/2-.3);bx(r,.12,.08,.12,vm('clayPot'),x,1.32,D/2-.3);}
    for(let i=0;i<3;i++)bx(r,.3,.1,.3,vm('clayPot'),-.05+i*.34,1.05,D/2-.3);for(let i=0;i<2;i++){bx(r,.3,.12,.3,vm('rope'),.95+i*.0,1.06+i*.12,D/2-.32);}
    for(let i=0;i<5;i++){bx(r,.06,.18,.06,vm('woolWhite'),-1+i*.12,1.49,-D/2+.35);bx(r,.03,.05,.03,vm('gold'),-1+i*.12,1.6,-D/2+.35);}
    for(let i=0;i<3;i++){bx(r,.36,.4,.36,vm('clayPot'),.1+i*.42,1.59,-D/2+.35);bx(r,.2,.1,.2,vm('clayPot'),.1+i*.42,1.84,-D/2+.35);}
    for(let i=0;i<3;i++){const lg=new THREE.Group();put(r,lg,-.8+i*.8,2.1,.3);bx(lg,.18,.04,.18,vm('iron'),0,0,0);bx(lg,.14,.2,.14,vm('glass'),0,-.13,0);bx(lg,.18,.04,.18,vm('iron'),0,-.25,0);}
    vBasket(r,-W/2-.4,0,.4,'hay',0);vBasket(r,-W/2-.4,.22,.4,'hay',0);vBasket(r,W/2+.4,0,-.2,'hay',0);bx(r,.6,.6,.6,vm('clayPot'),W/2+.45,.3,.5);}},
];

/* ---------- Farmhouses 2-5: same walls, thatch and chimney as farmhouse 1 ---------- */
function vCropRows(par,gx,gz,GW,rows,kinds,fence=true){for(let i=0;i<rows;i++){const rz=gz-(rows-1)*.4+i*.8,kind=kinds[i%kinds.length];bx(par,GW-.4,.16,.5,vm('dirt'),gx,.08,rz);const n=Math.floor((GW-.6)/.5);
    for(let k=0;k<n;k++){const px=gx-GW/2+.5+k*.5;if(kind==='cabbage')bx(par,.22,.2,.22,vm('leaves'),px,.26,rz);else if(kind==='carrot'){bx(par,.08,.2,.08,vm('leaves'),px,.26,rz);bx(par,.1,.06,.1,vm('gold'),px,.17,rz);}
      else if(kind==='wheat'){bx(par,.12,.5,.12,vm('hay'),px,.41,rz);bx(par,.14,.14,.14,vm('gold'),px,.73,rz);}else if(kind==='tomato'){bx(par,.16,.3,.16,vm('leaves'),px,.31,rz);if(k%2)bx(par,.08,.08,.08,vm('woolRed'),px+.06,.4,rz+.06);}
      else if(kind==='pumpkin'&&k%2===0){bx(par,.14,.08,.3,vm('leaves'),px,.2,rz);bx(par,.26,.22,.26,vm('pumpkin'),px+.1,.27,rz+.05);}}}
  if(!fence)return;const D=rows*.8+.4;for(const zz of[gz-D/2-.1,gz+D/2+.1]){const n=Math.ceil(GW/3.6);for(let i=0;i<n;i++)vFence(par,GW/n,gx-GW/2+GW/n*(i+.5),zz);}for(const s of[-1,1]){const n=Math.ceil(D/3.6);for(let i=0;i<n;i++)vFence(par,D/n,gx+s*GW/2,gz-D/2+D/n*(i+.5),Math.PI/2);}}
function farmBase(c){const root=new THREE.Group(),L=[];root.userData.lights=L;const Lx=8,Dz=5,base=.4,hw=2.4,H=2.8;
  vYard(root,10,7.6,0,.8);bx(root,Lx+.2,base,Dz+.2,vm('cobble'),0,base/2,0);
  root.add(vWalls({Lx,Dz,y:base,h:hw,t:.2,mat:vm('plaster'),ops:c.ops,frame:vm('timber'),unit:{shutter:vm('planksDark')}}).group);
  put(root,vRoof(Dz,Lx,H,vm('thatch'),{ov:.7,ovL:.6,step:.4,gable:vm('plaster'),ridge:vm('hay')}),0,base+hw,0);for(const s of[-1,1])bx(root,.1,.2,Dz,vm('timber'),s*(Lx/2+.04),base+hw+.1,0);
  const cs=c.chim==='R'?1:-1;bx(root,.8,base+hw+H+.8,1.2,vm('cobble'),cs*(Lx/2+.5),(base+hw+H+.8)/2,0);bx(root,1,.2,1.4,vm('stoneBrick'),cs*(Lx/2+.5),base+hw+H+.9,0);
  const dx=c.ops.front.find(o=>o.type==='door').x;bx(root,1.4,.2,.6,vm('cobble'),dx,.1,Dz/2+.4);bx(root,1.2,.2,.4,vm('cobble'),dx,.3,Dz/2+.2);vLantern(root,L,dx+.8,base+2.1,Dz/2);
  c.farm(root,{Lx,Dz,base,hw});root.userData.ground=c.ground||14;return root;}
const FARMS=[
 {chim:'R',ops:{front:[{type:'door',x:0,w:1,y0:0,y1:2},{x:-2.4,w:.8,y0:.8,y1:1.6,flowers:true},{x:2.4,w:.8,y0:.8,y1:1.6,flowers:true}],back:[{x:-1.6,w:.8,y0:.8,y1:1.6},{type:'door',x:1.4,w:.9,y0:0,y1:1.9}],right:[],left:[{x:0,w:.8,y0:.8,y1:1.6}]},
  farm:(r,{Lx,Dz})=>{vCropRows(r,0,Dz/2+5,10,8,['wheat']);for(const[x,z]of[[Lx/2+2,-.4],[Lx/2+2.8,-.4],[Lx/2+2.4,.4]])vHay(r,x,0,z);vHay(r,Lx/2+2.4,.8,0);vCart(r,-Lx/2-2,-2.4,.8,'hay');vWoodpile(r,8,4,-1,-Dz/2-.45);vBarrel(r,Lx/2+.4,Dz/2+.4,true);},
  desc:'Centre door between flower boxes, chimney on the right, and a broad fenced wheat field in front with hay stacked at the side.'},
 {chim:'L',ops:{front:[{type:'door',x:-1.8,w:1,y0:0,y1:2},{x:0,w:.8,y0:.8,y1:1.6,flowers:true},{x:1.8,w:.8,y0:.8,y1:1.6,flowers:true}],back:[{x:0,w:.8,y0:.8,y1:1.6},{x:2,w:.8,y0:.8,y1:1.6}],right:[{x:0,w:.8,y0:.8,y1:1.6}],left:[]},
  farm:(r,{Lx,Dz})=>{vCropRows(r,-2.2,Dz/2+4.4,6,6,['cabbage','carrot','tomato']);for(const[x,z]of[[3.2,Dz/2+2.6],[5.4,Dz/2+3.2],[3.6,Dz/2+5.2],[5.8,Dz/2+5.8]]){const t=vTree(r,x,z,2.2,.7);for(let i=0;i<5;i++)bx(t,.12,.12,.12,vm('woolRed'),(i%3-1)*.55,2.1+(i%2)*.4,.88);}
    vBasket(r,4.4,0,Dz/2+4.2,'woolRed',6);vBasket(r,4.9,0,Dz/2+4.4,'woolRed',6);bx(r,.08,2,.08,vm('planks'),4.7,1,Dz/2+3.8,.25,0,0);vWoodpile(r,8,4,1,-Dz/2-.45);},
  desc:'Door on the left, chimney on the left, a vegetable plot of cabbages, carrots and tomatoes and a small apple orchard with picking baskets.'},
 {chim:'R',ops:{front:[{type:'door',x:1.6,w:1,y0:0,y1:2},{x:-2.6,w:.8,y0:.8,y1:1.6,flowers:true},{x:-.8,w:.8,y0:.8,y1:1.6,flowers:true}],back:[{x:-2,w:.8,y0:.8,y1:1.6},{x:.6,w:.8,y0:.8,y1:1.6}],right:[],left:[{type:'door',x:-.6,w:.9,y0:0,y1:1.9}]},
  farm:(r,{Lx,Dz})=>{const lt=vLeanTo(r,-Lx/2,0,1.8,4,Math.PI,vm('thatch'));for(let i=0;i<3;i++)vHay(lt,.9,0,-1.2+i*.9);vHay(lt,.9,.8,-.3);
    vCropRows(r,-2,Dz/2+4,6.4,5,['pumpkin','carrot']);vCropRows(r,4,Dz/2+3.6,4,4,['cabbage','tomato']);vCart(r,Lx/2+2.2,-2,1.2,'sacks');vBarrel(r,Lx/2+.4,Dz/2+.5,true);vBench(r,-1,Dz/2+.6);},
  desc:'Door on the right with a side door to a thatched hay lean-to on the left gable, a pumpkin and carrot field and a separate cabbage and tomato plot.'},
 {chim:'L',ops:{front:[{type:'door',x:0,w:1,y0:0,y1:2},{x:-2.6,w:.8,y0:.8,y1:1.6,flowers:true},{x:-1.2,w:.6,y0:.9,y1:1.6},{x:1.2,w:.6,y0:.9,y1:1.6},{x:2.6,w:.8,y0:.8,y1:1.6,flowers:true}],back:[{x:-1.4,w:.8,y0:.8,y1:1.6},{x:1.4,w:.8,y0:.8,y1:1.6}],right:[{x:0,w:.8,y0:.8,y1:1.6}],left:[]},
  farm:(r,{Lx,Dz})=>{vCropRows(r,-3,Dz/2+4.6,5,7,['cabbage','carrot','wheat']);vCropRows(r,3,Dz/2+4.6,5,7,['tomato','pumpkin','carrot']);
    for(let z=Dz/2+1;z<Dz/2+8;z+=.6)bx(r,.8,.04,.5,vm('dirt'),0,.02,z);vWoodpile(r,6,4,-Lx/2-.5,-1.8,Math.PI/2);vBarrel(r,Lx/2+.5,Dz/2+.3,true);vBarrel(r,Lx/2+.5,Dz/2-.4);vBench(r,1.9,Dz/2+.6);},
  desc:'Symmetrical front with four windows, chimney on the left, and two fenced plots either side of a dirt path from the door.'},
];

(()=>{const i=ASSETS.findIndex(a=>a.id==='vx-market'),folder=ASSETS[i].folder;
  const items=STALLS.map((c,k)=>({id:k?`vx-stall-${k+1}`:'vx-market',folder,name:`Market stall ${k+1}`,build:()=>vStall(c),desc:c.desc+' Awning colour can be changed.',groundR:4.8,awning:true}));
  ASSETS.splice(i,1,...items);
  const f=ASSETS.findIndex(a=>a.id==='vx-farmhouse');ASSETS[f].name='Farmhouse 1';
  ASSETS.splice(f+1,0,...FARMS.map((c,k)=>({id:`vx-farm-${k+2}`,folder,name:`Farmhouse ${k+2}`,build:()=>farmBase(c),desc:c.desc})));})();
