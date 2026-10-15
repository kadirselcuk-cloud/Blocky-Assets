/* ======================= HELL KIT: the infernal citadel (hl-cit-) =======================
   Walls 4 m long, 1.6 m thick, centred on the grid line, outside towards +z; wall walk at 6.4 m behind a parapet with fang merlons
   (0.8 m fang, 1.2 m gap, period 2 m) up to about 8.2 m. Towers and pillars sit on the grid vertices; the keep covers 2 × 2 cells. */
FOLDERS['hell'].children.push('hell/citadel');
FOLDERS['hell/citadel']={name:'Infernal citadel',blurb:'Basalt and iron walls with fang merlons and glowing runes, lava spouts, gatehouse, towers, keep, bridges, throne, statues',children:[]};
const HC_T=1.6,HC_ROWS=16;
const hlTileMats1=tileMats;tileMats=function(){const m=hlTileMats1();Object.assign(m,{hFlag:{top:HFLOORMAT,side:vm('hFortDark')}});return m;};
/* fang merlon standing on y, centred at x, on the outer edge */
function hcFang(par,x,y,z,w=.8){bx(par,w,.6,.4,vm('hFort'),x,y+.3,z);bx(par,w*.7,.4,.36,vm('hFort'),x,y+.8,z);bx(par,w*.4,.3,.3,vm('hFortDark'),x,y+1.15,z);bx(par,w*.16,.22,.16,vm('hIron'),x,y+1.41,z);}
/* rune band on the outer face at height y, run of length L centred at x */
function hcRunes(par,x,y,z,L,r){bx(par,L,.36,.06,vm('hIron'),x,y,z+.03);const n=Math.round(L/1);for(let i=0;i<n;i++)hlGlyph(par,HL_GLYPHS[Math.floor(r()*6)],x-L/2+(i+.5)*L/n,y,z+.075,.9);}
/* demon head on a face (facing +z): heavy brow, glowing eyes, horns outwards, open jaw; s = scale */
function hcDemonHead(par,x,y,z,s=1,open=true){const g=new THREE.Group();put(par,g,x,y,z);g.scale.setScalar(s);const st=vm('hFortDark'),fd=vm('hFort');
  bx(g,1,.9,.5,fd,0,.15,.25);bx(g,1.1,.2,.6,st,0,.55,.32);for(const sd of[-1,1]){bx(g,.2,.1,.04,HRUNE,sd*.24,.4,.62);hlHorn(g,sd*.5,.5,.2,.9,sd,vm('hHorn'),0,-sd*.15);bx(g,.16,.4,.4,fd,sd*.42,-.1,.3);}
  bx(g,.24,.3,.2,fd,0,.18,.58);if(open){bx(g,.6,.24,.08,vm('dark'),0,-.18,.52);for(let i=0;i<4;i++)bx(g,.06,.1,.06,vm('bone'),-.2+i*.13,-.1,.53);}bx(g,.8,.22,.5,st,0,-.4,.3);for(const sd of[-1,1])bx(g,.06,.12,.06,vm('bone'),sd*.2,-.25,.55);return g;}
/* the wall builder: o.hole(i,row), o.prof(i) rows per column, o.extra(root,r,t,L) */
function hcWall(o){return(s,op)=>{const root=hlRoot(5),L=root.userData.lights,r=mulberry32(hashStr(o.key)+(s||1)*131),nc=10,t=HC_T,prof=i=>o.prof?o.prof(i):HC_ROWS,Hh=HC_ROWS*.4;
  const hole=o.hole||(()=>false),G=(i,row)=>row<prof(i)&&!hole(i,row);ruGrid(root,nc,HC_ROWS+1,G,{t,mat:vm('hFort'),pmat:vm('hFortDark')});
  let k=0;while(k<nc){if(prof(k)<HC_ROWS){k++;continue;}let j=k;while(j+1<nc&&prof(j+1)>=HC_ROWS)j++;const x0=-2+k*.4,w=(j-k+1)*.4;bx(root,w,.4,.4,vm('hFortDark'),x0+w/2,Hh+.2,t/2-.2);
    for(let m=k;m<=j;m++)if(m%5===0&&m+1<=j)hcFang(root,-2+m*.4+.4,Hh+.4,t/2-.2);k=j+1;}
  if(o.runes!==false){const runs=[];let a=-1;for(let i=0;i<=nc;i++){const ok=i<nc&&prof(i)>9&&!hole(i,8)&&!hole(i,7);if(ok&&a<0)a=i;if(!ok&&a>=0){runs.push([a,i-1]);a=-1;}}for(const[a2,b2]of runs)if(b2-a2>=2)hcRunes(root,-2+(a2+b2+1)/2*.4,3.2,t/2,(b2-a2+1)*.4,r);}
  for(let i=0;i<nc;i++)if(prof(i)>=2&&!hole(i,0)&&!hole(i,1))bx(root,.4,.06,.08,vm('hIron'),-1.8+i*.4,.86,t/2+.14);
  if(o.extra)o.extra(root,r,t,L);return hlDone(root);};}
const HCW=(id,name,o,desc,extra={})=>HL('cit-'+id,'citadel',name,hcWall(Object.assign({key:'hc'+id},o)),desc+' 4 m long, 1.6 m thick, centred on the grid line, outside towards +z.',Object.assign({variants:true,defaultSeed:1},extra));
HCW('wall','Citadel wall',{},'Black basalt wall with an iron-banded plinth, a band of glowing runes at 3.2 m, a 6.4 m wall walk and fang merlons on the outside.');
HCW('wall-spikes','Spiked wall',{extra:(root,r,t)=>{for(let row=0;row<3;row++)for(let i=0;i<5;i++){const x=-1.6+i*.8+(row%2)*.4;if(Math.abs(x)>1.8)continue;hlSpike(root,x,1.6+row*1.6+(row>0?.4:0),t/2-.05,.9,.2,vm('hIron'),Math.PI/2-.15,0);}}},'The citadel wall studded with three rows of iron spikes jutting out of the outer face.');
HCW('wall-slit','Wall with fire slits',{hole:(i,row)=>(i===2||i===7)&&row>=10&&row<=13,extra:(root,r,t)=>{for(const i of[2,7]){const x=-2+i*.4+.2;bx(root,.4,1.6,.1,HRUNE,x,4.8,0).castShadow=false;bx(root,.6,.12,.2,vm('hIron'),x,5.66,t/2+.1);bx(root,.6,.12,.2,vm('hIron'),x,3.94,t/2+.1);}}},'The citadel wall with two plain vertical slits high up, fire glowing inside them.');
HCW('wall-lava','Wall with lava spout',{extra:(root,r,t,L)=>{hcDemonHead(root,0,4.4,t/2,1.1);const z=t/2+.5;const lf=bx(root,.44,3.5,.18,LAVAMAT,0,1.2+1.75,z+.05);lf.castShadow=false;
    const bs=new THREE.Group();put(root,bs,0,0,t/2);bx(bs,2.2,.7,1.6,vm('hFortDark'),0,.35,.8);hlLava(bs,1.8,1.2,0,.62,.8,.2);bx(bs,2.2,.1,.2,vm('hIron'),0,.75,1.55);
    const drops=[];for(let i=0;i<4;i++){const g=new THREE.Group();g.name='ldrop_'+i;put(root,g,0,0,z+.18);bx(g,.12,.18,.12,HEMBER,0,0,0).castShadow=false;drops.push(g);}
    hlIdle(root,drops,(tt,S,dur)=>{drops.forEach((g,i)=>{const u=(tt/dur*2+i/4)%1;S[g.name]={p:[(i%2-.5)*.18,4.0-u*u*3.3,z+.18],s:u>.95?1e-4:1};});});hlBubbles(root,[[-.5,t/2+.7,1],[.5,t/2+1,.8]],.62);
    const pl=new THREE.PointLight(0xf0502a,0,8,2);pl.position.set(0,1.6,t/2+1.4);pl.userData.lamp=true;pl.userData.min=.8;root.add(pl);L.push(pl);}},'The citadel wall with a demon head at 4.4 m spewing a stream of lava down the face into a stone basin at its foot (drops fall and the basin bubbles in the Idle loop).');
HCW('wall-door','Wall with doorway',{hole:(i,row)=>(i>=3&&i<=6&&row<=8)||((i===4||i===5)&&row===9),extra:(root,r,t)=>{for(const sd of[-1,1]){bx(root,.2,3.6,.2,vm('hIron'),sd*.9,1.8,t/2+.1);}bx(root,2,.24,.2,vm('hIron'),0,4.12,t/2+.1);wlSkull(root,0,4.24,t/2,1.2,0);
    bx(root,1.6,.02,t,vm('hFortDark'),0,.01,0).castShadow=false;}},'The citadel wall with a pointed doorway 1.6 m wide and 3.6 m high framed in iron, a skull above it.');
HCW('wall-breach','Breached wall',{prof:i=>[16,16,15,11,7,5,6,10,14,16][i],runes:true,extra:(root,r,t)=>{wlMound(root,0,0,1.8,r,vm('hFort'),(px,pz,y)=>{const ci=Math.floor((px+2)/.4),pr=[16,16,15,11,7,5,6,10,14,16][Math.max(0,Math.min(9,ci))];return Math.abs(px)>1.8||(Math.abs(pz)<t/2&&pr>Math.floor(y/.4));});
    for(const[x,y]of[[-.6,4.4],[.2,2.4],[.9,4.2]])bx(root,.06,.5,t+.02,HVEIN,x,y,0);}},'The citadel wall smashed open in the middle down to 2 m, rubble heaped on both sides, glowing cracks at the break.');
/* ---------- vertex pieces ---------- */
function hcTower(s){const root=hlRoot(3.4),L=root.userData.lights,r=mulberry32((s||1)*4801),fd=vm('hFort'),dk=vm('hFortDark'),W=3.6,H=11.2;
  ruBox(root,W+.4,.4,W+.4,dk,0,.2,0,-(W+.4)/2,0);ruBox(root,W,H-.4,W,fd,0,.4+(H-.4)/2,0,-W/2,.4);ruBox(root,W+.8,.8,W+.8,dk,0,H+.4,0,-(W+.8)/2,H);
  for(let f=0;f<4;f++){const g=new THREE.Group();put(root,g,0,0,0,0,f*Math.PI/2,0);const z=W/2;
    for(const y of[3.6,8])bx(g,.4,1.4,.04,HRUNE,0,y,z+.005).castShadow=false;bx(g,1.2,1.8,.04,vm('dark'),0,7.3,z+.005).castShadow=false;hcRunes(g,0,5.2,z,W,r);
    for(let i=0;i<3;i++)hcFang(g,-1.6+i*1.6,H+.8,z+.2-.2,.8);hlSpike(g,1.9,H+.8,z+.2,.6,.2,vm('hIron'),.6,-.6);}
  const roof=vPyramid(W,W,4,vm('hIron'),.4);put(root,roof,0,H+.8,0);hlSpike(root,0,H+4.6,0,1.6,.3,vm('hIron'));
  for(const sd of[-1,1])hlHorn(root,sd*1.2,H+1.6,0,2,sd,vm('hHorn'),0,-sd*.25);
  for(const[a,b]of[[1,1],[-1,-1]]){const bw=new THREE.Group();put(root,bw,a*1.4,H+.8,b*1.4);bx(bw,.5,.3,.5,vm('hIron'),0,.15,0);hlFlame(bw,a>0?L:null,0,.3,0,.3,'orange',1,10);}
  return hlDone(root);}
function hcPillar(s){const root=hlRoot(2),L=root.userData.lights,r=mulberry32((s||1)*4807),fd=vm('hFort'),dk=vm('hFortDark');ruBox(root,2.4,.4,2.4,dk,0,.2,0,-1.2,0);ruBox(root,2,7.6,2,fd,0,4.2,0,-1,.4);ruBox(root,2.4,.4,2.4,dk,0,8.2,0,-1.2,8);
  for(let f=0;f<4;f++){const g=new THREE.Group();put(root,g,0,0,0,0,f*Math.PI/2,0);hcRunes(g,0,3.2,1,1.6,r);hlSpike(g,0,1.2,1,.7,.2,vm('hIron'),Math.PI/2-.2,0);}
  const bw=new THREE.Group();put(root,bw,0,8.4,0);for(let k=0;k<8;k++){const a=k/8*6.28;bx(bw,.5,.4,.12,vm('hIron'),Math.cos(a)*.55,.2,Math.sin(a)*.55,0,-a+Math.PI/2,0);hlSpike(bw,Math.cos(a)*.6,.4,Math.sin(a)*.6,.3,.08,vm('hIron'));}
  bx(bw,1,.1,1,vm('hIron'),0,.05,0);bx(bw,.9,.2,.9,CRUSTMAT,0,.15,0);hlFlame(bw,L,0,.25,0,.5,'orange',1,12);return hlDone(root);}
function hcGate(s,op){const root=hlRoot(5),L=root.userData.lights,r=mulberry32((s||1)*4811),fd=vm('hFort'),dk=vm('hFortDark'),ir=vm('hIron'),t=3.2,rows=24,Hh=rows*.4;
  const hole=(i,row)=>(i>=2&&i<=7&&row<=9)||(i>=3&&i<=6&&row===10)||((i===4||i===5)&&row===11);ruGrid(root,10,rows+1,(i,row)=>row<rows&&!hole(i,row),{t,mat:fd,pmat:dk});
  bx(root,4,.4,t,dk,0,Hh+.2,0);for(const z of[t/2-.2,-t/2+.2])for(const x of[-1.4,0,1.4])hcFang(root,x,Hh+.4,z,.8);for(const sd of[-1,1])hlHorn(root,sd*1.7,Hh+.4,t/2-.4,2.2,sd,vm('hHorn'),0,-sd*.2);
  hcDemonHead(root,0,6.2,t/2,1.9,false);for(const sd of[-1,1]){for(let i=0;i<3;i++)hlSpike(root,sd*(.85-i*.3),4.75-i*.02,t/2+.3,.55-i*.08,.16,vm('bone'),Math.PI,0);}
  bx(root,2.4,.02,t,dk,0,.01,0).castShadow=false;hcRunes(root,0,8.2,t/2,4,r);
  for(const sd of[-1,1]){const bw=new THREE.Group();put(root,bw,sd*1.6,2.6,t/2);bx(bw,.4,.12,.5,ir,0,0,.25);bx(bw,.6,.24,.6,ir,0,.18,.5);bx(bw,.5,.1,.5,CRUSTMAT,0,.3,.5);hlFlame(bw,L,0,.32,.5,.3,'orange',1);}
  const pc=new THREE.Group();pc.name='portcullis';root.add(pc);for(let i=0;i<7;i++){const x=-1.05+i*.35;bx(pc,.08,4,.08,ir,x,2.2,.9);hlSpike(pc,x,.2,.9,.24,.08,ir,Math.PI,0);}for(const y of[1.4,2.8,4])bx(pc,2.3,.08,.06,ir,0,y,.96);
  vGateAnim(root,(op&&op.state)==='open'?1:0,e=>{pc.position.y=e*3.8;});return hlDone(root);}
function hcKeep(s,op){const root=hlRoot(7),L=root.userData.lights,r=mulberry32((s||1)*4817),fd=vm('hFort'),dk=vm('hFortDark'),ir=vm('hIron'),open=(op&&op.door)!=='closed';
  /* tier: hollow square of walls (thickness 0.8) built from ruGrid faces, holes for windows */
  const tier=(W,y0,rows,win,doorRows)=>{for(let f=0;f<4;f++){const g=new THREE.Group(),front=f===0;put(root,g,0,y0,0,0,f*Math.PI/2,0);const nc=Math.round((f%2?W-1.6:W)/.4),zf=W/2-.4;const inner=new THREE.Group();put(g,inner,0,0,zf);
      const mid=nc/2;ruGrid(inner,nc,rows,(i,row)=>{const d=Math.abs(i+.5-mid);if(front&&doorRows&&d<3&&row<doorRows+(d<2?1:0)+(d<1?1:0))return false;for(const wx of win)if(Math.abs(i+.5-mid-wx)<1&&row>=rows-6&&row<rows-2)return false;return true;},{t:.8,mat:fd,pmat:dk,noPlinth:y0>0});
      for(const wx of win){const x=(wx)*.4;bx(inner,.8,1.6,.06,HRUNE,x,(rows-4)*.4,0).castShadow=false;}}
    bx(root,W-1.6,.4,W-1.6,dk,0,y0+rows*.4-.2,0);bx(root,W+.4,.4,W+.4,dk,0,y0+rows*.4+.2,0);
    for(let f=0;f<4;f++){const g=new THREE.Group();put(root,g,0,y0+rows*.4+.4,0,0,f*Math.PI/2,0);const n=Math.floor(W/2);for(let i=0;i<n;i++)hcFang(g,-W/2+1+i*2,0,W/2,.8);}};
  ruBox(root,9.2,.4,9.2,dk,0,.2,0,-4.6,0);tier(8,.4,24,[-6,6],9);tier(6,10.4,16,[0],0);tier(4,17.2,12,[0],0);
  /* door, steps, banners, balcony */
  for(let i=0;i<3;i++)bx(root,3.6-i*.4,.2,.6,dk,0,.1+i*.2,4.6+.9-i*.3);const dl=[];for(const sd of[-1,1]){const lf=new THREE.Group();lf.name='keep_door_'+(sd<0?'L':'R');put(root,lf,sd*1.2,.4,3.62,0,open?sd*1.3:0,0);bx(lf,1.2,3.6,.12,ir,-sd*.6,1.8,0);for(const y of[.8,1.8,2.8])bx(lf,1,.08,.06,vm('hIron'),-sd*.6,y,.08);hlSpike(lf,-sd*.6,1.6,.06,.3,.1,ir,Math.PI/2,0);dl.push([lf,sd]);}
  bx(root,2.4,4.2,.04,vm('dark'),0,2.5,3.3).castShadow=false;hcDemonHead(root,0,5.6,4,1.3,false);
  for(const sd of[-1,1]){const b=new THREE.Group();put(root,b,sd*2.6,8.6,4.06);for(const x of[-.5,.5])bx(b,.06,.2,.06,ir,x,-.1,0);bx(b,1.2,.08,.08,ir,0,0,.02);bx(b,1,2.8,.04,vm('hCloth'),0,-1.5,.04);const dm=new THREE.Group();put(b,dm,0,-1.3,.07,0,0,Math.PI/4);bx(dm,.4,.4,.02,vm('gold'),0,0,0);bx(dm,.26,.26,.03,vm('hCloth'),0,0,0);
    for(const[x,h]of[[-.33,.4],[0,.6],[.33,.3]])bx(b,.32,h,.04,vm('hCloth'),x,-2.9-h/2+.02,.04);hlFlame(root,L,sd*1.9,2.2,4.3,.26,'orange',1);bx(root,.3,.1,.5,ir,sd*1.9,2.15,4.1);}
  const bal=new THREE.Group();put(root,bal,0,10.4,3);bx(bal,3.2,.4,1.6,dk,0,.2,.8);for(const x of[-1.2,0,1.2])wlBeam(bal,[x,-.1,-.4],[x,-1.6,-.4],.3,dk);for(let i=0;i<5;i++)hlSpike(bal,-1.4+i*.7,.4,1.5,.6,.14,ir);bx(bal,3.2,.12,.12,ir,0,.9,1.55);for(const sd of[-1,1])bx(bal,.12,.9,1.6,ir,sd*1.55,.45+.4,.8);
  bx(root,1.6,2.4,.04,vm('dark'),0,11.6,3.01).castShadow=false;
  /* crown: horns and the great fire on top */
  for(const[a,b]of[[1,1],[-1,1],[1,-1],[-1,-1]])hlHorn(root,a*1.6,22.4,b*1.6,3,a,vm('hHorn'),b*.3,-a*.25);
  const bw=new THREE.Group();put(root,bw,0,22.4,0);bx(bw,2.4,.3,2.4,ir,0,.15,0);for(let k=0;k<12;k++){const a=k/12*6.28;bx(bw,.7,.6,.14,ir,Math.cos(a)*1.1,.6,Math.sin(a)*1.1,0,-a+Math.PI/2,0);hlSpike(bw,Math.cos(a)*1.2,.9,Math.sin(a)*1.2,.5,.12,ir);}
  bx(bw,2,.3,2,CRUSTMAT,0,.45,0);hlFlame(bw,L,0,.55,0,1.1,'orange',1.4,26);
  propAnim(root,dl.map(d=>d[0]),[{name:'Open',dur:2.4,hold:true,fn:(t,S)=>{for(const[lf,sd]of dl)S[lf.name]={r:[0,sd*1.3*(open?1:paEase(t/2.4)),0]};}},{name:'Close',dur:2.4,hold:true,fn:(t,S)=>{for(const[lf,sd]of dl)S[lf.name]={r:[0,sd*1.3*(open?1-paEase(t/2.4):0),0]};}}]);
  for(let i=0;i<6;i++){const a=r()*6.28,d=5+r()*1;bx(root,.3,.12,.3,vm('hBrim'),Math.cos(a)*d,.06,Math.sin(a)*d,0,r()*3,0);}return hlDone(root);}
function hcStairs(s){const root=hlRoot(5),fd=vm('hFort'),dk=vm('hFortDark'),ir=vm('hIron');
  for(let i=0;i<16;i++){const h=(i+1)*.4,x=-4+.25+i*.5;ruBox(root,.5,h,2,fd,x,h/2,-1.8,x-.25,0);bx(root,.5,.06,2,dk,x,h-.03+.001,-1.8);}bx(root,.5,.4,2,dk,3.75,6.6,-1.8);
  for(let i=0;i<16;i+=3){const x=-4+.25+i*.5,h=(i+1)*.4;hlSpike(root,x,h,-2.7,.6,.14,ir);}return hlDone(root);}
function hcBridge(s){const root=hlRoot(3),r=mulberry32((s||1)*4821),fd=vm('hFort'),dk=vm('hFortDark'),ir=vm('hIron'),W=2.8;
  for(const sd of[-1,1]){bx(root,.8,.6,W+.4,dk,sd*1.8,.3,0);bx(root,.4,.3,W,fd,sd*1.3,.15,0);}
  for(let i=0;i<10;i++){const x=-1.8+i*.4,y=.3+.22*Math.cos(x/2*Math.PI/2);bx(root,.4,.3,W,fd,x,y,0);bx(root,.4,.04,W-.8,HFLOORMAT,x,y+.17,0);}
  bx(root,2.4,.02,W,vm('dark'),0,.12,0).castShadow=false;
  for(const sd of[-1,1]){for(let i=0;i<5;i++){const x=-1.8+i*.9,y=.3+.22*Math.cos(x/2*Math.PI/2)+.15;bx(root,.2,.7,.2,dk,x,y+.35,sd*(W/2-.1));hlSpike(root,x,y+.7,sd*(W/2-.1),.36,.16,ir);if(i<4){const x2=x+.9,y2=.3+.22*Math.cos(x2/2*Math.PI/2)+.15;hlChain(root,[x+.1,y+.6,sd*(W/2-.1)],[x2-.1,y2+.6,sd*(W/2-.1)],.12);}}}
  return hlDone(root);}
function hcCauseway(s){const root=hlRoot(3),fd=vm('hFort'),dk=vm('hFortDark'),ir=vm('hIron'),W=2.8;bx(root,W,.4,4,fd,0,.2,0);bx(root,W-.6,.04,4,HFLOORMAT,0,.42,0);
  for(const sd of[-1,1]){ruBox(root,.8,1,.8,dk,sd*.9,-.5,0,sd*.9-.4,-1);bx(root,1,.2,1,dk,sd*.9,-.9,0);for(const z of[-1.6,0,1.6]){bx(root,.2,.6,.2,dk,sd*(W/2-.1),.7,z);hlSpike(root,sd*(W/2-.1),1,z,.3,.14,ir);}
    for(const[z0,z1]of[[-1.5,-.1],[.1,1.5]])hlChain(root,[sd*(W/2-.1),.9,z0],[sd*(W/2-.1),.9,z1],.1);bx(root,.12,.14,4,dk,sd*(W/2-.1),.47,0);}
  return hlDone(root);}
function hcFloor(){return hlDone(vTile((x,z)=>wlNoise(x*1.3,z*1.3,1)>2?'hCrust':'hFlag',(root,at)=>wlPebbles(root,6,4831,['hFlag'],at,['hFortDark'])));}
function hcThrone(s,op){const big=(op&&op.size)==='prince',k=big?1.9:1,root=hlRoot(big?5:2.8),L=root.userData.lights,r=mulberry32((s||1)*4837),g=new THREE.Group();root.add(g);g.scale.setScalar(k);const fd=vm('hFort'),dk=vm('hFortDark'),ir=vm('hIron');
  for(let i=0;i<3;i++)bx(g,3.6-i*.6,.2,2.8-i*.4,dk,0,.1+i*.2,-.1-i*.1);bx(g,1.6,.5,1.2,fd,0,.85,-.2);bx(g,1.3,.1,1,vm('hCloth'),0,1.15,-.15);
  bx(g,1.8,3.2,.4,fd,0,2.2,-.8);for(let i=0;i<4;i++)bx(g,1.5-i*.34,.3,.4,fd,0,3.95+i*.3,-.8);bx(g,1.2,1.8,.04,vm('hCloth'),0,2.2,-.58);const dm=new THREE.Group();put(g,dm,0,2.6,-.55,0,0,Math.PI/4);bx(dm,.3,.3,.02,vm('gold'),0,0,0);
  for(const sd of[-1,1]){bx(g,.3,.6,1.3,fd,sd*.95,1.4,-.2);wlSkull(g,sd*.95,1.7,.25,1,0);hlHorn(g,sd*.7,4.9,-.8,1.6,sd,vm('hHorn'),0,-sd*.1);for(let i=0;i<3;i++)hlSpike(g,sd*.9,1.8+i*.8,-.8,.5,.14,ir,0,-sd*1.3);
    const bw=new THREE.Group();put(g,bw,sd*1.6,.6,.5);bx(bw,.2,.8,.2,ir,0,.4,0);bx(bw,.5,.2,.5,ir,0,.9,0);bx(bw,.4,.08,.4,CRUSTMAT,0,1.02,0);hlFlame(bw,sd>0?L:null,0,1.04,0,.24,'orange',1,big?14:8);}
  wlSkull(g,0,4.0,-.58,1.2,0);return hlDone(root);}
function hcStatue(s){const root=hlRoot(2.4),r=mulberry32((s||1)*4841),st=vm('statue'),dk=vm('hFortDark');bx(root,2,.4,2,dk,0,.2,0);bx(root,1.6,1,1.6,vm('hFort'),0,.9,0);bx(root,1.8,.16,1.8,dk,0,1.48,0);const y=1.56;
  for(const sd of[-1,1]){bx(root,.34,.9,.4,st,sd*.25,y+.45,-.1);bx(root,.3,.8,.34,st,sd*.25,y+1.2,.05);bx(root,.4,.16,.6,st,sd*.25,y+.08,.15);}
  bx(root,.9,.5,.5,st,0,y+1.8,0);bx(root,1,1,.56,st,0,y+2.5,0);bx(root,1.3,.4,.64,st,0,y+3.1,0);const h=new THREE.Group();put(root,h,0,y+3.3,.04);bx(h,.5,.5,.5,st,0,.25,0);bx(h,.4,.14,.2,st,0,.08,.32);for(const sd of[-1,1]){bx(h,.1,.05,.02,HRUNE,sd*.12,.3,.255);hlHorn(h,sd*.2,.45,0,.8,sd,st);}
  bx(root,.28,1,.3,st,-.78,y+2.6,0);bx(root,.26,.8,.3,st,-.86,y+1.8,.12);bx(root,.28,1,.3,st,.78,y+2.6,0);bx(root,.26,.3,.8,st,.86,y+2.2,.4);
  const ax=new THREE.Group();put(root,ax,.86,y+.0,.7);bx(ax,.12,3.6,.12,st,0,1.8,0);bx(ax,.7,.7,.08,st,.35,3.2,0);bx(ax,.1,.9,.1,st,.72,3.2,0);
  for(const sd of[-1,1]){const w=new THREE.Group();put(root,w,sd*.4,y+2.9,-.3,0,-sd*.45,0);wlBeam(w,[0,0,0],[sd*1.1,.8,-.1],.16,st);wlBeam(w,[sd*1.1,.8,-.1],[sd*2,1.3,-.15],.12,st);const top=x=>x<1.1?x/1.1*.8:.8+(x-1.1)/.9*.5;for(let i=0;i<6;i++){const x=.15+i*.33,t=top(x),bt=-1.6+x*.45+(i%2?.25:0);bx(w,.34,t-bt,.06,st,sd*x,(t+bt)/2,-.1);}}
  return hlDone(root);}
function hcBanner(s){const root=hlRoot(1.6),ir=vm('hIron');bx(root,.6,.3,.6,vm('hFortDark'),0,.15,0);bx(root,.12,4.6,.12,ir,0,2.6,0);hlSpike(root,0,4.9,0,.5,.16,ir);
  const arm=[[0,4.6,0],[.5,4.75,0],[1.1,4.7,0]];for(let i=0;i<2;i++)wlBeam(root,arm[i],arm[i+1],.08,ir);hlHorn(root,0,4.3,0,.5,-1,vm('hHorn'));
  const b=new THREE.Group();b.name='hbanner';put(root,b,.6,4.62,0);for(const x of[-.4,.4])bx(b,.04,.1,.04,vm('rope'),x,-.05,0);bx(b,1,1.2,.04,vm('hCloth'),0,-.7,0);const dm=new THREE.Group();put(b,dm,0,-.7,.03,0,0,Math.PI/4);bx(dm,.36,.36,.02,vm('gold'),0,0,0);bx(dm,.22,.22,.03,vm('hCloth'),0,0,0);
  const b2=new THREE.Group();b2.name='hbanner_tail';put(b,b2,0,-1.3,0);bx(b2,1,.8,.04,vm('hCloth'),0,-.4,0);for(const[x,h]of[[-.37,.4],[0,.6],[.37,.3]])bx(b2,.26,h,.04,vm('hCloth'),x,-.8-h/2+.02,0);
  propAnim(root,[b,b2],[{name:'Idle',dur:3.6,loop:true,fn:(t,S)=>{const a=t/3.6*Math.PI*2;S.hbanner={r:[Math.sin(a)*.05,Math.sin(a)*.2,0]};S.hbanner_tail={r:[Math.sin(a-1)*.1,Math.sin(a-1.2)*.28,0]};}}]);return root;}
function hcRailing(s){const root=hlRoot(2.4),ir=vm('hIron');bx(root,4,.3,.5,vm('hFortDark'),0,.15,0);for(let i=0;i<13;i++){const x=-1.8+i*.3;bx(root,.06,1.3,.06,ir,x,.95,0);hlSpike(root,x,1.6,0,.3,.1,ir);}for(const y of[.6,1.4])bx(root,3.8,.06,.06,ir,0,y,0);
  for(const sd of[-1,1]){bx(root,.3,1.9,.3,vm('hFortDark'),sd*1.9,1.1,0);hlSpike(root,sd*1.9,2.05,0,.4,.24,ir);}return hlDone(root);}
function hcColumn(s,op){const root=hlRoot(1.6),L=root.userData.lights,fd=vm('hFort'),dk=vm('hFortDark'),r=mulberry32((s||1)*4843);ruBox(root,1.4,.4,1.4,dk,0,.2,0,-.7,0);ruBox(root,1,3.8,1,fd,0,2.3,0,-.5,.4);ruBox(root,1.4,.3,1.4,dk,0,4.35,0,-.7,4.2);
  for(let f=0;f<4;f++){const g=new THREE.Group();put(root,g,0,0,0,0,f*Math.PI/2,0);hlGlyph(g,HL_GLYPHS[Math.floor(r()*6)],0,2.6,.515,1.2);}
  const bw=new THREE.Group();put(root,bw,0,4.5,0);for(let k=0;k<8;k++){const a=k/8*6.28;bx(bw,.36,.3,.1,vm('hIron'),Math.cos(a)*.42,.15,Math.sin(a)*.42,0,-a+Math.PI/2,0);}bx(bw,.8,.08,.8,vm('hIron'),0,.04,0);bx(bw,.7,.14,.7,CRUSTMAT,0,.12,0);hlFlame(bw,L,0,.19,0,.36,(op&&op.fire)||'orange',1);return hlDone(root);}
HL('cit-tower','citadel','Citadel tower',hcTower,'Square basalt tower for a grid vertex, 3.6 m wide and 11.2 m to the corbel: fire slits and a rune band on every side, fang merlons, a steep iron roof with a spike, two great horns and fire bowls on top (about 17 m).',{variants:true,defaultSeed:1});
HL('cit-pillar','citadel','Fire pillar',hcPillar,'Square basalt pillar for a grid vertex, 8.6 m, with rune bands and spikes, crowned with a spiked iron fire bowl; hides the wall ends meeting there.',{variants:true,defaultSeed:1});
HL('cit-gate','citadel','Citadel gatehouse',hcGate,'Gatehouse for one 4 m wall slot, 3.2 m deep and 9.6 m high: a great demon face over the pointed gate with bone fangs, glowing eyes and horns, a spiked iron portcullis, fire bowls either side, fang merlons and two horns on top.',{opts:[{key:'state',label:'Portcullis',choices:[['closed','Down'],['open','Up']],def:'closed',live:true}],variants:true,defaultSeed:1});
HL('cit-keep','citadel','Infernal keep',hcKeep,'The Devil Lord\'s keep, 2 × 2 cells (9 m square), three tiers to 22 m with glowing windows and fang merlons, an iron double door (Open/Close) under a demon face, steps, blank crimson banners with a gold diamond, a balcony at 10.4 m, four great horns and a huge hellfire on top.',{opts:[{key:'door',label:'Door',choices:[['open','Open'],['closed','Closed']],def:'open'}],variants:true,defaultSeed:1});
HL('cit-stairs','citadel','Wall stairs',hcStairs,'Basalt stair for the inside of a wall run: 8 m long (two cells along x), 2 m wide, climbing from the ground at -x to the 6.4 m wall walk at +x. The origin is on the wall\'s grid line; the stair lies behind it (towards -z) against the wall\'s inner face.',{});
HL('cit-bridge','citadel','Lava bridge',hcBridge,'Arched stone bridge for one cell, 4 m long across x and 2.8 m wide, resting on the banks of a lava river tile (turn it to cross the channel): glowing flagstone deck, spiked posts and sagging chains.',{variants:true,defaultSeed:1});
HL('cit-causeway','citadel','Lava causeway',hcCauseway,'Straight stone causeway for one cell of open lava, 4 m along z and 2.8 m wide, deck 0.4 m above the ground on two piers that stand in the lava; spiked posts and chains along the edges. Cells in a row join.',{});
HL('cit-floor','citadel','Citadel floor',hcFloor,'Courtyard tile of black flagstones with glowing joints and a patch of glowing crust. 4 × 4 m, top at 0.8 m.',{groundR:-1});
HL('cit-throne','citadel','Infernal throne',hcThrone,'Throne of black stone on a stepped dais: crimson cushion and back cloth with a gold diamond, skulls on the armrests, spikes and two great horns on the back, fire bowls either side. Sized for the Devil Lord, or 1.9x for the Demon Prince.',{opts:[{key:'size',label:'Size',choices:[['lord','Devil Lord'],['prince','Demon Prince']],def:'lord'}]});
HL('cit-statue','citadel','Demon statue',hcStatue,'Stone statue of a horned demon with half-spread bat wings on a plinth (about 7 m), glowing eyes, a great axe held upright beside him.',{variants:true,defaultSeed:1});
HL('cit-banner','citadel','Infernal banner',hcBanner,'Iron pole with a spike, a horn and an arm holding a long, tattered crimson banner with a blank gold diamond; it waves (Idle).',{});
HL('cit-railing','citadel','Spiked railing',hcRailing,'Iron railing of spiked bars on a low kerb between two stone posts. 4 m long, centred on the grid line.',{});
HL('cit-column','citadel','Fire column',hcColumn,'Courtyard column, 4.5 m, carved with glowing runes and crowned with a bowl of fire.',{opts:[HL_FIRE_OPT],variants:true,defaultSeed:1});
