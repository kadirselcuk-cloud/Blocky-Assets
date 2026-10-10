/* ======================= environment: trees, rocks, plants (each has random looks) ======================= */
VXD.pineLeaves=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,r()<.18?'#1e3a24':'#2e5a34',(x+y)%3===0?.82:nz(r,.85,1.1));};
VXD.birchLeaves=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,r()<.15?'#5a7a2a':'#86a83e',r()<.12?1.15:nz(r,.85,1.08));};
VXD.oakLeaves=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,r()<.2?'#2e4a20':'#46702e',nz(r,.85,1.1));};
VXD.pineBark=(P,r)=>{const c=[];for(let x=0;x<16;x++)c.push(nz(r,.8,1.08));for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,(y+((x>>2)*3))%5===0?'#3a2418':'#6a3e26',c[x]*nz(r,.92,1.05));};
VXD.birchBark=(P,r)=>{const m=mulberry32(17);for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,'#e8e4da',nz(r,.9,1.03));for(let i=0;i<9;i++){const y=Math.floor(m()*16),x0=Math.floor(m()*16),l=2+Math.floor(m()*4);for(let k=0;k<l;k++)P((x0+k)&15,y,'#2a2622',nz(r,.9,1.1));}};
VXD.moss=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,r()<.2?'#3e5a26':'#5a7a32',nz(r,.85,1.1));};
VXD.straw2=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,'#c8b060',(y%5===0?.85:1)*nz(r,.9,1.06));};
VXD.cattail=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,'#5a3a22',nz(r,.85,1.1));};
const ROCKS={granite:['#8a8a86','#ece8de','Granite'],sandstone:['#c8a070','#9a4a2a','Sandstone'],basalt:['#3e4048','#c89a3a','Basalt']};
for(const k in ROCKS){const[base,vein]=ROCKS[k];VXD['rock_'+k]=(P,r)=>{const m=mulberry32(hashStr(k));const g=[];for(let y=0;y<16;y++){g.push([]);for(let x=0;x<16;x++)g[y].push(0);}
  for(let v=0;v<3;v++){let x=m()*16,y=m()*16;const dx=m()<.5?1:-1;for(let s=0;s<22;s++){g[Math.floor(y)&15][Math.floor(x)&15]=1;if(m()<.35)g[(Math.floor(y)+1)&15][Math.floor(x)&15]=1;x+=dx*.8+(m()-.5)*.6;y+=.45+(m()-.5)*.9;}}
  for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,g[y][x]?vein:base,g[y][x]?nz(r,.92,1.06):nz(r,.84,1.08));};}

const leafMat=k=>vm(k==='pine'?'pineLeaves':k==='birch'?'birchLeaves':'oakLeaves'),barkMat=k=>vm(k==='pine'?'pineBark':k==='birch'?'birchBark':'bark');
function trunk(par,k,w,h,x=0,y=0,z=0){const b=barkMat(k),top=vm('logEnd');const m=box(w,h,w,[b,b,top,top,b,b],{s:.8,ox:0,oy:0,oz:0});put(par,m,x,y+h/2,z);return m;}
function leafBlock(par,k,w,h,d,x,y,z){return bx(par,w,h,d,leafMat(k),x,y,z);}
/* pine: stacked tiers that narrow to a spike */
const treeH=(size,r)=>size==='sapling'?.8+r()*.5:size==='small'?3+r():7+r()*2;
function vPine(root,size,r){const H=treeH(size,r),tw={sapling:.12,small:.3,large:.55}[size];trunk(root,'pine',tw,H*.9,0);
  const tiers=size==='sapling'?2:size==='small'?5:8,base=H*(size==='sapling'?.25:.2),w0=H*(size==='sapling'?.6:.52);
  for(let i=0;i<tiers;i++){const t=i/tiers,w=size==='sapling'?w0*(1-t*.5)*.7:w0*(1-t)+.25,y=base+t*(H-base)*.95,th=Math.max(.2,H/tiers*.62),off=(r()-.5)*.06*H;leafBlock(root,'pine',w,th,w,off,y+th/2,-off);
    if(size!=='sapling'){leafBlock(root,'pine',w*.7,th*.6,w*1.08,0,y+th*.3,0);leafBlock(root,'pine',w*1.08,th*.6,w*.7,0,y+th*.3,0);}}
  leafBlock(root,'pine',Math.max(.2,tw*1.3),H*.14,Math.max(.2,tw*1.3),0,H*.95,0);}
/* oak: thick trunk, a few branches, broad rounded canopy of clustered blocks */
function vOak(root,size,r){const H=treeH(size,r),tw={sapling:.1,small:.4,large:.9}[size];trunk(root,'oak',tw,H*.62,0);
  if(size==='sapling'){bx(root,.06,H*.36,.06,barkMat('oak'),0,H*.78,0);leafBlock(root,'oak',.3,.24,.3,0,H*.95,0);leafBlock(root,'oak',.2,.18,.2,.16,H*.7,.04);return;}
  const cy=H*.68,cw=H*(size==='large'?.95:.8);const nb=size==='large'?4:2;for(let i=0;i<nb;i++){const a=i/nb*Math.PI*2+r(),L=cw*.35;const br=new THREE.Group();put(root,br,0,H*.45+i*.06*H,0,0,a,0);bx(br,tw*.5,tw*.5,L,barkMat('oak'),0,0,L/2,-.5,0,0);}
  leafBlock(root,'oak',cw,H*.32,cw,0,cy,0);leafBlock(root,'oak',cw*.75,H*.24,cw*.75,0,cy+H*.25,0);leafBlock(root,'oak',cw*1.15,H*.18,cw*.8,0,cy-.05,0);leafBlock(root,'oak',cw*.8,H*.18,cw*1.15,0,cy-.05,0);
  const n=size==='large'?10:5;for(let i=0;i<n;i++){const a=r()*Math.PI*2,s=cw*(.22+r()*.18),d=Math.min(cw*(.35+r()*.25),cw*.5+s*.35);leafBlock(root,'oak',s,s*.8,s,Math.cos(a)*d,cy+(r()-.5)*H*.18,Math.sin(a)*d);}
  if(size==='large')for(let i=0;i<4;i++){const a=i*Math.PI/2+.4;bx(root,tw*.5,tw*.35,tw*1.1,barkMat('oak'),Math.cos(a)*tw*.7,tw*.15,Math.sin(a)*tw*.7,0,-a,0);}}
/* birch: slender white trunk(s), small branches, airy light canopy */
function vBirch(root,size,r){const H=treeH(size,r),tw={sapling:.08,small:.22,large:.36}[size];const stems=size==='large'&&r()<.6?2:1;
  for(let s=0;s<stems;s++){const g=new THREE.Group();put(root,g,s?.35:0,0,s?.2:0,0,0,s?.08:0);trunk(g,'birch',tw*(s?.8:1),H*(s?.82:.9),0);
    if(size==='sapling'){leafBlock(g,'birch',.24,.22,.24,0,H*.88,0);leafBlock(g,'birch',.16,.14,.16,.1,H*.66,0);continue;}
    const cl=size==='large'?9:5;for(let i=0;i<cl;i++){const y=H*(.4+i/cl*.55),a=r()*Math.PI*2,w=H*(.14+r()*.1)*(1-i/cl*.4),d=Math.min(H*.045*(1+r()),w*.4);leafBlock(g,'birch',w,w*.8,w,Math.cos(a)*d,y,Math.sin(a)*d);
      if(i%2===0)bx(g,.05,.05,d+.1,barkMat('birch'),Math.cos(a)*d/2,y-.1,Math.sin(a)*d/2,0,-a+Math.PI/2,0);}
    leafBlock(g,'birch',H*.12,H*.14,H*.12,0,H*(s?.82:.9),0);}}
function vxTree(kind,size){return s=>{const root=new THREE.Group();root.userData.lights=[];const r=mulberry32((s||1)*977+hashStr(kind+size));
  ({pine:vPine,oak:vOak,birch:vBirch})[kind](root,size,r);if(size!=='sapling')for(let i=0;i<5;i++){const a=r()*6.28,d=.6+r()*1.2;vSprite(root,i%3?shortGrassMat():flowerMat(['#d84a3a','#f0d040','#e8e8f0'][i%3]),Math.cos(a)*d,0,Math.sin(a)*d,.35,.3,a);}
  root.userData.ground={sapling:2.4,small:3.6,large:6}[size];return root;};}

/* rocks: irregular clusters of blocks; large rocks carry a vein colour */
function vxLargeRock(k){return s=>{const root=new THREE.Group();root.userData.lights=[];const r=mulberry32((s||1)*131+hashStr(k)),m=vm('rock_'+k),moss=vm('moss');
  const n=7+Math.floor(r()*4),parts=[[2.4,1.4,2]];for(let i=1;i<n;i++)parts.push([.8+r()*1.4,.5+r()*1.2,.8+r()*1.2]);
  parts.forEach(([w,h,d],i)=>{const x=i?(r()-.5)*2:0,z=i?(r()-.5)*1.6:0,y=i?(r()<.5?h/2:1.1+h/2-.2):h/2;const top=r()<.35?moss:m;const b=box(w,h,d,[m,m,top,m,m,m],{s:.8,ox:r()*4,oy:r()*4,oz:r()*4});put(root,b,x,y,z,0,(r()-.5)*.5,0);});
  for(let i=0;i<5;i++){const a=r()*6.28,d=1.6+r()*.8,sz=.2+r()*.3;bx(root,sz,sz*.7,sz,m,Math.cos(a)*d,sz*.35,Math.sin(a)*d,0,r(),0);}
  root.userData.ground=4;return root;};}
function vxSmallRocks(s){const root=new THREE.Group();root.userData.lights=[];const r=mulberry32((s||1)*71);const mats=['stone','cobble','rock_granite','rock_basalt','rock_sandstone'];
  for(let i=0;i<9;i++){const a=r()*6.28,d=r()*1.1,sz=.15+r()*.4,m=vm(mats[Math.floor(r()*3)]);bx(root,sz*(1+r()*.6),sz*(.5+r()*.5),sz,m,Math.cos(a)*d,sz*.35,Math.sin(a)*d,0,r()*3,0);}
  root.userData.ground=2;return root;}

/* plants */
function vxReeds(s){const root=new THREE.Group();root.userData.lights=[];const r=mulberry32((s||1)*53);
  const pool=new THREE.Group();root.add(pool);bx(pool,2.6,.04,2,vm('deepWater'),0,.02,0);vWaterSurface(pool,2.6,2,0,.08,0,6);
  const n=16+Math.floor(r()*8);for(let i=0;i<n;i++){const x=(r()-.5)*2.4,z=(r()-.5)*1.8,h=1.1+r()*.9,lean=(r()-.5)*.12,g=new THREE.Group();put(root,g,x,0,z,lean,r()*3,lean*.6);
    bx(g,.04,h,.04,vm('straw2'),0,h/2,0);if(r()<.75){bx(g,.09,.24,.09,vm('cattail'),0,h-.18,0);bx(g,.02,.1,.02,vm('straw2'),0,h+.0,0);}
    for(let k=0;k<2;k++)bx(g,.015,h*(.6+r()*.3),.08,vm('leaves'),(k?.05:-.05),h*.33,0,0,0,(k?.12:-.12));}
  root.userData.ground=2.4;return root;}
function vxBushAsset(berries){return s=>{const root=new THREE.Group();root.userData.lights=[];const r=mulberry32((s||1)*29+(berries?7:0)),blocks=[];
  for(let i=0;i<7;i++){const w=.5+r()*.5;blocks.push(leafBlock(root,'oak',w,w*.8,w,(r()-.5)*.9,w*.4+r()*.35,(r()-.5)*.8));}
  if(berries){for(let i=0;i<24;i++){const b=blocks[Math.floor(r()*blocks.length)],p=b.geometry.parameters,c=b.position,face=Math.floor(r()*5),u=(r()-.5)*.8,v=(r()-.5)*.8;let x=c.x,y=c.y,z=c.z;
      if(face===0){x+=p.width/2+.03;y+=v*p.height/2;z+=u*p.depth/2;}else if(face===1){x-=p.width/2+.03;y+=v*p.height/2;z+=u*p.depth/2;}else if(face===2){z+=p.depth/2+.03;y+=v*p.height/2;x+=u*p.width/2;}else if(face===3){z-=p.depth/2+.03;y+=v*p.height/2;x+=u*p.width/2;}else{y+=p.height/2+.03;x+=u*p.width/2;z+=v*p.depth/2;}
      const inside=blocks.some(o=>o!==b&&Math.abs(x-o.position.x)<o.geometry.parameters.width/2&&Math.abs(y-o.position.y)<o.geometry.parameters.height/2&&Math.abs(z-o.position.z)<o.geometry.parameters.depth/2);if(!inside)bx(root,.09,.09,.09,vm(berries),x,y,z);}}
  root.userData.ground=2;return root;};}
function vxFern(s){const root=new THREE.Group();root.userData.lights=[];const r=mulberry32((s||1)*37),lf=vm('leaves'),dk=vm('oakLeaves');
  for(let c=0;c<3;c++){const cx=(r()-.5)*1.1,cz=(r()-.5)*1.1;bx(root,.16,.12,.16,dk,cx,.06,cz);const nf=6+Math.floor(r()*3);
    for(let i=0;i<nf;i++){const a=i/nf*Math.PI*2+r()*.4,fr=new THREE.Group();put(root,fr,cx,.08,cz,0,a,0);const L=.55+r()*.35,N=6,pts=[];
      for(let k=0;k<=N;k++){const t=k/N;pts.push([t*L,Math.sin(t*2.2)*.32*L/.7]);}
      for(let k=0;k<N;k++){const[z0,y0]=pts[k],[z1,y1]=pts[k+1],len=Math.hypot(z1-z0,y1-y0)+.02,w=.2*(1-k/N)+.05,sg=new THREE.Group();put(fr,sg,0,(y0+y1)/2,(z0+z1)/2,-Math.atan2(y1-y0,z1-z0),0,0);
        bx(sg,w,.02,len,k%2?lf:dk,0,0,0);bx(sg,.02,.03,len,dk,0,.01,0);}}}
  root.userData.ground=2;return root;}
function vxFlowers(s){const root=new THREE.Group();root.userData.lights=[];const r=mulberry32((s||1)*41);for(let i=0;i<40;i++){const x=(r()-.5)*2.4,z=(r()-.5)*2.4;vSprite(root,i%4===0?shortGrassMat():flowerMat(['#d84a3a','#f0d040','#e8e8f0','#6a7ad8','#d870b0'][Math.floor(r()*5)]),x,0,z,.32,.3+r()*.15,r()*3);}root.userData.ground=2;return root;}
function vxMushrooms(s){const root=new THREE.Group();root.userData.lights=[];const r=mulberry32((s||1)*43);for(let i=0;i<9;i++){const sc=.7+r()*1.6,x=(r()-.5)*1.4,z=(r()-.5)*1.4;if(r()<.6)vMushroom(root,x,z,sc);else{bx(root,.08*sc,.18*sc,.08*sc,vm('woolWhite'),x,.09*sc,z);bx(root,.24*sc,.08*sc,.24*sc,vm('leather'),x,.2*sc,z);}}
  const big=new THREE.Group();put(root,big,.2,0,-.2);bx(big,.22,.6,.22,vm('woolWhite'),0,.3,0);bx(big,.7,.22,.7,vm('woolRed'),0,.66,0);bx(big,.5,.1,.5,vm('woolRed'),0,.8,0);for(const[x,z]of[[.2,.1],[-.15,.2],[.05,-.22],[-.25,-.1]])bx(big,.08,.03,.08,vm('woolWhite'),x,.785,z);root.userData.ground=2;return root;}
function vxStump(s){const root=new THREE.Group();root.userData.lights=[];const r=mulberry32((s||1)*47);trunk(root,'oak',.8,.6,0);for(let i=0;i<4;i++){const a=i*Math.PI/2+r()*.4;bx(root,.3,.25,.6,barkMat('oak'),Math.cos(a)*.55,.12,Math.sin(a)*.55,0,-a+Math.PI/2,0);}
  bx(root,.6,.04,.6,vm('moss'),-.05,.62,.05);vMushroom(root,.45,.3,.8);vMushroom(root,.5,.15,.6);put(root,TOOLS.Axe.build(),.1,.75,-.1,1.3,.3,0);root.userData.ground=2;return root;}
function vxFallenLog(s){const root=new THREE.Group();root.userData.lights=[];const r=mulberry32((s||1)*59);const g=new THREE.Group();put(root,g,0,0,0,0,(r()-.5)*.6,0);vlog(g,3.2,.55,.55,'x',0,.28,0);
  for(let i=0;i<4;i++)bx(g,.5+r()*.5,.06,.4,vm('moss'),-1.2+i*.8,.57,(r()-.5)*.1);bx(g,.16,.4,.16,barkMat('oak'),.6,.65,.1,.3,0,.4);bx(g,.14,.3,.14,barkMat('oak'),-.9,.6,-.12,-.3,0,-.3);
  vMushroom(g,1.2,.36,.7);vMushroom(g,1.05,.4,.5);for(let i=0;i<4;i++)vSprite(root,shortGrassMat(),(r()-.5)*3,0,(r()<.5?.5:-.5),.3,.3,r()*3);root.userData.ground=3;return root;}

FOLDERS[''].children=['characters','buildings','items','terrain','environment'];
FOLDERS['environment']={name:'Environment',blurb:'Trees, rocks and plants',children:['environment/trees','environment/rocks','environment/plants']};
FOLDERS['environment/trees']={name:'Trees',blurb:'Pine, oak and birch in three sizes',children:[]};
FOLDERS['environment/rocks']={name:'Rocks',blurb:'Boulders with veins, small stones',children:[]};
FOLDERS['environment/plants']={name:'Plants',blurb:'Reeds, bushes, ferns, flowers and fungi',children:[]};
const envA=(id,f,name,build,desc)=>ASSETS.push({id,folder:'environment/'+f,name,build,desc:desc+' New look gives a new random shape.',variants:true,defaultSeed:1});
for(const[k,K,d]of[['pine','Pine','dark needled tiers narrowing to a spike on a red-brown trunk'],['oak','Oak','a thick trunk with branches under a broad, clustered canopy'],['birch','Birch','a slender white trunk with dark marks and an airy light-green canopy']])
  for(const[sz,S,h]of[['sapling','sapling','about 1 m'],['small','small tree','about 4 m'],['large','large tree','about 9 m']])envA(`env-${k}-${sz}`,'trees',`${K} ${S}`,vxTree(k,sz),`${K}, ${h}: ${d}.`);
for(const k in ROCKS){const[,,N]=ROCKS[k];envA(`env-rock-${k}`,'rocks',`${N} boulder`,vxLargeRock(k),`Large ${N.toLowerCase()} boulder built from stacked blocks, ${k==='granite'?'grey with white quartz veins':k==='sandstone'?'tan with rust-red veins':'near-black with gold veins'}, some tops grown with moss.`);}
envA('env-rocks-small','rocks','Small rocks',vxSmallRocks,'Scatter of small stones in mixed rock types.');
envA('env-reeds','plants','Reeds',vxReeds,'Clump of yellow reed stalks with brown cattail heads and green blades, standing in a small pool.');
envA('env-bush','plants','Bush',vxBushAsset(null),'Rounded leafy bush.');
envA('env-berrybush','plants','Berry bush',vxBushAsset('woolRed'),'Leafy bush hung with red berries.');
envA('env-fern','plants','Ferns',vxFern,'Three ferns of arching fronds.');
envA('env-flowers','plants','Flower patch',vxFlowers,'Patch of wildflowers in five colours with grass.');
envA('env-mushrooms','plants','Mushrooms',vxMushrooms,'Cluster of red-capped and brown mushrooms around one large toadstool.');
envA('env-stump','plants','Tree stump',vxStump,'Oak stump with roots, a mossy top, mushrooms and an axe left in it.');
envA('env-log','plants','Fallen log',vxFallenLog,'Fallen log with moss, broken branch stubs and mushrooms.');

/* ---------- ore boulders and ore rocks ---------- */
const ORES={gold:['#e0b840','#fff0a0','Gold','bright gold nuggets'],iron:['#6e3426','#b8866a','Iron','dark rust-red iron ore'],tin:['#c4c8d0','#f0f2f6','Tin','silvery tin ore'],copper:['#d07a3a','#3aa088','Copper','orange copper ore with green patina']};
for(const k in ORES){const[c,h]=ORES[k];
  VXD['ore_'+k]=(P,r)=>{const m=mulberry32(hashStr('ore'+k));for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,r()<.1?'#6a6a66':'#7e7e7a',nz(r,.86,1.06));
    for(let i=0;i<7;i++){const x=Math.floor(m()*15),y=Math.floor(m()*15);P(x,y,c,1.05);P(x+1,y,c,.9);P(x,y+1,c,.85);if(m()<.6)P(x+1,y+1,h,1);if(m()<.4)P((x+2)&15,y,c,.8);}};
  VXD['nug_'+k]=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,(x+y)%5===0?h:c,nz(r,.88,1.1));};}
function vOreNuggets(root,k,r,n,spread,yMax){const nm=vm('nug_'+k);const bb=new THREE.Box3().setFromObject(root);for(let i=0;i<n;i++){const s=.1+r()*.14,side=Math.floor(r()*5);let x=(r()-.5)*spread,z=(r()-.5)*spread,y;
  if(side===4){y=bb.max.y*(.6+r()*.35);}else{y=.2+r()*(Math.min(yMax,bb.max.y)-.3);if(side===0)x=bb.max.x;else if(side===1)x=bb.min.x;else if(side===2)z=bb.max.z;else z=bb.min.z;}
  bx(root,s,s*.8,s,nm,x,y,z,0,r()*3,0);}}
function vxOreBoulder(k){return s=>{const root=new THREE.Group();root.userData.lights=[];const r=mulberry32((s||1)*157+hashStr(k)),m=vm('ore_'+k);
  const n=7+Math.floor(r()*4),parts=[[2.4,1.4,2]];for(let i=1;i<n;i++)parts.push([.8+r()*1.4,.5+r()*1.2,.8+r()*1.2]);
  parts.forEach(([w,h,d],i)=>{const x=i?(r()-.5)*2:0,z=i?(r()-.5)*1.6:0,y=i?(r()<.5?h/2:1.1+h/2-.2):h/2;const b=box(w,h,d,m,{s:.8,ox:r()*4,oy:r()*4,oz:r()*4});put(root,b,x,y,z,0,(r()-.5)*.5,0);});
  vOreNuggets(root,k,r,14,1.6,2.4);for(let i=0;i<6;i++){const a=r()*6.28,d=1.7+r()*.8,sz=.18+r()*.28;bx(root,sz,sz*.7,sz,i%2?vm('nug_'+k):m,Math.cos(a)*d,sz*.35,Math.sin(a)*d,0,r(),0);}
  root.userData.ground=4;return root;};}
function vxOreRocks(k){return s=>{const root=new THREE.Group();root.userData.lights=[];const r=mulberry32((s||1)*83+hashStr(k)),m=vm('ore_'+k),nm=vm('nug_'+k);
  for(let i=0;i<9;i++){const a=r()*6.28,d=r()*1.1,sz=.18+r()*.4;const rk=bx(root,sz*(1+r()*.5),sz*(.5+r()*.5),sz,m,Math.cos(a)*d,sz*.35,Math.sin(a)*d,0,r()*3,0);
    if(r()<.7)bx(root,sz*.35,sz*.3,sz*.35,nm,Math.cos(a)*d+(r()-.5)*sz*.4,sz*(.6+r()*.2),Math.sin(a)*d+(r()-.5)*sz*.4,0,r()*3,0);}
  for(let i=0;i<5;i++){const a=r()*6.28,d=.4+r()*1.2,sz=.06+r()*.07;bx(root,sz,sz*.8,sz,nm,Math.cos(a)*d,sz*.4,Math.sin(a)*d,0,r()*3,0);}
  root.userData.ground=2;return root;};}
{const after=ASSETS.findIndex(a=>a.id==='env-rocks-small');const add=[];for(const k in ORES){const[,,N,d]=ORES[k];
  add.push({id:`env-ore-${k}`,folder:'environment/rocks',name:`${N} ore boulder`,build:vxOreBoulder(k),desc:`Large grey boulder shot through with ${d}, with nuggets breaking out of its faces and loose ore around the base. New look gives a new random shape.`,variants:true,defaultSeed:1},
    {id:`env-orerocks-${k}`,folder:'environment/rocks',name:`${N} ore rocks`,build:vxOreRocks(k),desc:`Scatter of small rocks flecked with ${d} and loose nuggets. New look gives a new random shape.`,variants:true,defaultSeed:1});}
  ASSETS.splice(after+1,0,...add);}
