/* ======================= fences: wooden and drystone, straight, corner, gate ======================= */
function fWood(par,len,x,z,ry){const g=new THREE.Group();put(par,g,x,0,z,0,ry,0);const n=Math.max(2,Math.round(len/2)+1);for(let i=0;i<n;i++){const px=-len/2+i*len/(n-1);vlog(g,.16,1.1,.16,'y',px,.55,0);bx(g,.2,.06,.2,vm('planksDark'),px,1.13,0);}
  for(const y of[.45,.85])bx(g,len,.1,.07,vm('planks'),0,y,.04);return g;}
function fStone(par,len,x,z,ry,seed=1){const g=new THREE.Group();put(par,g,x,0,z,0,ry,0);const r=mulberry32(seed);for(let row=0;row<2;row++){let px=-len/2;while(px<len/2-.05){const w=Math.min(len/2-px,.32+r()*.34),m=vm(['cobble','stone','cobble','mossyCobble'in VXD?'mossyCobble':'stone'][Math.floor(r()*4)]);
      bx(g,w-.02,.38,.5-row*.06,m,px+w/2,.19+row*.38,(r()-.5)*.04);px+=w;}}
  let px=-len/2;while(px<len/2-.05){const w=Math.min(len/2-px,.4+r()*.3);bx(g,w-.01,.12,.56,vm('stone'),px+w/2,.82,0,0,(r()-.5)*.06,0);px+=w;}return g;}
function fGateLeaf(par,w,h,x,side){const lf=new THREE.Group();put(par,lf,x,0,0);const s=side;for(let i=0;i<5;i++)bx(lf,.04,h-.2,.12,vm('planksV'),-s*(w/2*0+.1+i*(w-.2)/4),h/2+.1,0).position.x=-s*(.12+i*(w-.24)/4);
  for(const y of[.35,h-.15])bx(lf,w-.08,.1,.07,vm('planks'),-s*w/2,y,.06);bx(lf,Math.hypot(w-.2,h-.6),.08,.06,vm('planksDark'),-s*w/2,h/2,.08,0,0,s*Math.atan2(h-.6,w-.2));bx(lf,.05,.05,.1,vm('iron'),-s*(w-.12),h/2,.12);return lf;}
function fGate(stone){return(sd,o={})=>{const root=new THREE.Group();root.userData.lights=[];const gw=1.8,h=1.1;
  if(stone){for(const s of[-1,1]){bx(root,.5,1.3,.5,vm('stoneBrick'),s*(gw/2+.25),.65,0);bx(root,.6,.12,.6,vm('stone'),s*(gw/2+.25),1.36,0);fStone(root,2,s*(gw/2+1.5),0,0,s>0?3:5);}}
  else{for(const s of[-1,1]){vlog(root,.22,1.4,.22,'y',s*(gw/2+.11),.7,0);bx(root,.28,.08,.28,vm('planksDark'),s*(gw/2+.11),1.44,0);fWood(root,2,s*(gw/2+1.22),0,0);}}
  const L=fGateLeaf(root,gw/2-.02,h,-gw/2,-1),Rr=fGateLeaf(root,gw/2-.02,h,gw/2,1);vGateAnim(root,o.state??0,p=>{L.rotation.y=-1.45*p;Rr.rotation.y=1.45*p;});root.userData.ground=3;return root;};}
FOLDERS['buildings/medieval'].children.push('buildings/medieval/fences');FOLDERS['buildings/medieval/fences']={name:'Fences',blurb:'Wooden and drystone fences, corners and gates',children:[]};
const FN=(id,name,build,desc,opts)=>ASSETS.push({id:'fn-'+id,folder:'buildings/medieval/fences',name,build:typeof build==='function'&&build.length>=2?build:(s,o)=>build(s,o),desc,opts,groundR:3});
FN('wood','Wooden fence',()=>{const r=new THREE.Group();r.userData.lights=[];fWood(r,4,0,0,0);r.userData.ground=3;return r;},'4 m post-and-rail fence, three capped posts and two rails; lines up end to end.');
FN('wood-c','Wooden fence corner',()=>{const r=new THREE.Group();r.userData.lights=[];fWood(r,2,-1,0,0);fWood(r,2,0,-1,Math.PI/2);r.userData.ground=3;return r;},'Corner piece: two 2 m arms sharing a corner post.');
FN('wood-g','Wooden fence gate',fGate(false),'Double plank gate with diagonal braces and a latch, hung between thick posts with 2 m of fence each side. Opens and closes.',[{key:'state',label:'Gate',choices:[[1,'Open'],[0,'Closed']],def:0,live:true}]);
FN('stone','Stone fence',()=>{const r=new THREE.Group();r.userData.lights=[];fStone(r,4,0,0,0,2);r.userData.ground=3;return r;},'4 m drystone wall of mixed fieldstones in two courses under flat capstones; lines up end to end.');
FN('stone-c','Stone fence corner',()=>{const r=new THREE.Group();r.userData.lights=[];fStone(r,2.25,-.875,0,0,4);fStone(r,1.75,0,-1.125,Math.PI/2,6);r.userData.ground=3;return r;},'Corner piece: two drystone arms meeting at a shared block.');
FN('stone-g','Stone fence gate',fGate(true),'Plank double gate between dressed-stone pillars with capstones, with 2 m of drystone wall each side. Opens and closes.',[{key:'state',label:'Gate',choices:[[1,'Open'],[0,'Closed']],def:0,live:true}]);
