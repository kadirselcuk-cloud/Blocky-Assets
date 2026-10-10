/* ======================= wall corners, wooden tower, farm field; options ======================= */
function vxStoneWallCorner(){const root=new THREE.Group(),L=[];root.userData.lights=L;const sb=vm('stoneBrick'),h=3.6;
  vStoneWallSeg(root,4,-2.8,0,0);vStoneWallSeg(root,4,0,-2.8,Math.PI/2);
  const T=new THREE.Group();put(root,T,0,0,0);bx(T,2.2,.8,2.2,vm('cobble'),0,.4,0);bx(T,2,h+.6-.8,2,sb,0,.8+(h+.6-.8)/2,0);bx(T,2.2,.24,2.2,vm('cobble'),0,h+.5,0);
  for(const[ax,z]of[['x',1.05],['x',-1.05]])vMerlons(T,2.2,0,h+.62,z,ax,sb,{h:.7});for(const x of[1.05,-1.05])vMerlons(T,2.2,x,h+.62,0,'z',sb,{h:.7});
  vSlit(T,0,2.4,1.01);vSlit(T,1.01,2.4,0,Math.PI/2);root.userData.ground=7.2;return root;}
function vxPalisadeCorner(){const root=new THREE.Group(),L=[];root.userData.lights=L;
  vPalisadeSeg(root,4,-2.2,0,0,11);vPalisadeSeg(root,4,0,-2.2,Math.PI/2,13);
  vlog(root,.6,4.2,.6,'y',0,2.1,0);bx(root,.4,.3,.4,vm('barkH'),0,4.35,0);bx(root,.16,.2,.16,vm('planksDark'),0,4.6,0);
  bx(root,1.2,.1,1.2,vm('planks'),-.6,2.3,-.6);root.userData.ground=6.4;return root;}

/* ---------- Wooden tower ---------- */
function vxWoodTower(){const root=new THREE.Group(),L=[];root.userData.lights=L;const W=3,P=6,top=8.6;
  bx(root,W+1,.3,W+1,vm('dirt'),0,.15,0);
  for(const[a,b]of[[1,1],[1,-1],[-1,1],[-1,-1]])vlog(root,.4,top,.4,'y',a*W/2,top/2,b*W/2);
  bx(root,W-.2,2.6,W-.2,vm('planksV'),0,1.6,0);bx(root,1,1.9,.06,vm('dark'),0,1.25,W/2-.06);bx(root,.9,1.8,.06,vm('planksV'),0,1.2,W/2-.02);
  for(const y of[2.95,4.6])for(const[ax,sd]of[['x',1],['x',-1],['z',1],['z',-1]]){const L2=Math.hypot(W,1.6),a=Math.atan2(1.6,W);if(ax==='x')bx(root,L2,.16,.16,vm('planksDark'),0,y+.8,sd*W/2,0,0,a);else bx(root,.16,.16,L2,vm('planksDark'),sd*W/2,y+.8,0,a,0,0);}
  bx(root,W+.8,.2,W+.8,vm('planks'),0,P,0);for(const sd of[-1,1]){bx(root,W+.8,.16,.12,vm('planksDark'),0,P-.1,sd*(W/2+.4));bx(root,.12,.16,W+.8,vm('planksDark'),sd*(W/2+.4),P-.1,0);}
  for(let i=0;i<6;i++){const p=-W/2-.15+i*(W+.3)/5;for(const sd of[-1,1]){if(i%2===0){bx(root,.5,1,.1,vm('planksV'),p,P+.6,sd*(W/2+.4));bx(root,.1,1,.5,vm('planksV'),sd*(W/2+.4),P+.6,p);}}}
  for(const sd of[-1,1]){bx(root,W+.9,.12,.12,vm('planksDark'),0,P+1.15,sd*(W/2+.42));bx(root,.12,.12,W+.9,vm('planksDark'),sd*(W/2+.42),P+1.15,0);}
  put(root,vPyramid(W+1.4,W+1.4,1.8,vm('shingle'),.3),0,top,0);vlog(root,.12,1.6,.12,'y',0,top+2.4,0);bx(root,.9,.55,.05,vm('woolRed'),.5,top+2.9,0);
  const ld=new THREE.Group();put(root,ld,.6,0,W/2+1.2,-.12,0,0);for(const s of[-1,1])bx(ld,.08,P+.4,.08,vm('planksDark'),s*.28,(P+.4)/2,0);for(let i=0;i<17;i++)bx(ld,.56,.06,.06,vm('planks'),0,.3+i*.36,0);
  vBarrel(root,-W/2-.6,.4);root.userData.ground=5.6;return root;}

/* ---------- Farm field (size, crop and fence are options) ---------- */
function vxFarmField(sd,o={}){const root=new THREE.Group();root.userData.lights=[];const W=o.width||10,Lz=o.length||10,crop=o.crop||'wheat';
  const kinds=crop==='mixed'?['cabbage','carrot','wheat','tomato','pumpkin']:[crop];const rows=Math.max(2,Math.floor((Lz-.4)/.8));
  vYard(root,W+1.2,Lz+1.2,0,0);vCropRows(root,0,0,W,rows,kinds,o.fence!==0);
  if(o.fence!==0){vSack(root,W/2+.6,Lz/2-.2);bx(root,.06,1.4,.06,vm('planks'),W/2+.9,.7,Lz/2-.8,.3,0,0);}
  root.userData.ground=Math.max(5,Math.max(W,Lz)/2+2);return root;}

/* register, then attach options */
(()=>{const mil=ASSETS.findIndex(a=>a.id==='vx-stonewall'),pal=ASSETS.findIndex(a=>a.id==='vx-palisade');
  ASSETS.splice(mil+1,0,{id:'vx-stonewall-c',folder:'buildings/medieval/military',name:'Stone wall corner',build:vxStoneWallCorner,desc:'Corner piece for the stone wall: two 4 m arms meeting at a square crenellated corner turret with slits.',groundR:7.2});
  const p2=ASSETS.findIndex(a=>a.id==='vx-palisade');ASSETS.splice(p2+1,0,{id:'vx-palisade-c',folder:'buildings/medieval/military',name:'Wooden palisade corner',build:vxPalisadeCorner,desc:'Corner piece for the palisade: two 4 m arms with their fighting platforms meeting at a thick corner post.',groundR:6.4},
    {id:'vx-woodtower',folder:'buildings/medieval/military',name:'Wooden tower',build:vxWoodTower,desc:'Log watchtower with a planked lower room, diagonal bracing, a fighting platform with a plank parapet, a shingle spire, flag and a tall ladder.',groundR:5.6});
  const f=ASSETS.findIndex(a=>a.id==='vx-farm-5');ASSETS.splice(f+1,0,{id:'vx-field',folder:'buildings/medieval/farming',name:'Farm field',build:vxFarmField,desc:'Stand-alone rectangular field. Width, length, crop and fence can be changed; rows fill whatever size you pick.'});
  const opt=(id,list)=>{const a=ASSETS.find(x=>x.id===id);if(a)a.opts=list;};
  opt('vx-woodgate',[{key:'state',label:'Gate',choices:[[1,'Open'],[0,'Closed']],def:1,live:true}]);opt('vx-stonegate',[{key:'state',label:'Gate',choices:[[1,'Open'],[0,'Closed']],def:1,live:true}]);
  opt('vx-dock',[{key:'stock',label:'Stockpiles',choices:[[0,'Empty'],[1,'¼'],[2,'½'],[3,'¾'],[4,'Full']],def:4}]);
  opt('vx-field',[{key:'crop',label:'Crop',choices:[['wheat','Wheat'],['cabbage','Cabbage'],['carrot','Carrot'],['pumpkin','Pumpkin'],['tomato','Tomato'],['mixed','Mixed']],def:'wheat'},
    {key:'width',label:'Width',choices:[[6,'6 m'],[10,'10 m'],[14,'14 m'],[18,'18 m'],[24,'24 m']],def:10},{key:'length',label:'Length',choices:[[6,'6 m'],[10,'10 m'],[14,'14 m'],[18,'18 m']],def:10},
    {key:'fence',label:'Fence',choices:[[1,'On'],[0,'Off']],def:1}]);
  const sw=ASSETS.find(a=>a.id==='vx-stonewall');if(sw)sw.desc='8 m modular curtain wall: stone-brick on a cobble footing, crenellated wall-walk and arrow slits.';const pa=ASSETS.find(a=>a.id==='vx-palisade');if(pa)pa.desc='8 m modular palisade of sharpened logs on an earth bank, with rails and a braced fighting platform.';const wg=ASSETS.find(a=>a.id==='vx-woodgate');if(wg)wg.desc='Double plank gate between two log watchtowers with shingle spires and parapets, a log lintel and palisade wings with walkways. Opens and closes.';const sg=ASSETS.find(a=>a.id==='vx-stonegate');if(sg)sg.desc='Gatehouse with two crenellated towers, an iron portcullis and oak doors that open and close, banners and stub walls on each side.';const wt=ASSETS.find(a=>a.id==='vx-woodtower');if(wt)wt.desc='Log watchtower with a planked lower room, diagonal bracing, a fighting platform with a plank parapet, a shingle spire, flag and a ladder up to the platform.';})();
