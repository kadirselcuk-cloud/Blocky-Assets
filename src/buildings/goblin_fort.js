/* ======================= WASTELAND KIT: goblin fortress (wl-gob-) =======================
   Palisade walls are 4 m long, centred on the grid line, outside towards +z: ten sharpened logs (3.4–4.2 m) on an earth bank,
   two lashing ropes in front, back rails at 1.1 m and 3 m. Corner posts and the gate posts sit on the grid vertices.
   The fighting platform of the wall walk is at 2.6 m, the same height as the walkway piece. */
VXD.gBark=(P,r)=>{const c=[];for(let x=0;x<16;x++)c.push(nz(r,.78,1.08));for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,(y*3+(x>>2)*7)%11===0?'#2e261c':'#5a4c3a',c[x]*nz(r,.9,1.06)*(x%4===0?.84:1));};
VXD.gBarkH=(P,r)=>{const c=[];for(let y=0;y<16;y++)c.push(nz(r,.78,1.08));for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,(x*3+(y>>2)*7)%11===0?'#2e261c':'#5a4c3a',c[y]*nz(r,.9,1.06)*(y%4===0?.84:1));};
VXD.gTip=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,(x+y)%5===0?'#7a5a34':'#a8844e',nz(r,.88,1.06));};
VXD.hide=(P,r)=>{const m=mulberry32(61);for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,'#7a5e44',nz(r,.86,1.06));for(let i=0;i<3;i++){const x0=Math.floor(m()*10),y0=Math.floor(m()*10),w=4+Math.floor(m()*3);for(let y=y0;y<y0+w;y++)for(let x=x0;x<x0+w;x++)P(x&15,y&15,i%2?'#644a34':'#86684a',nz(r,.88,1.05));
  for(let k=0;k<w;k+=2){P((x0+k)&15,y0&15,'#3e2a1a');P(x0&15,(y0+k)&15,'#3e2a1a');}}};
VXD.hideDark=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,(x*5+y*3)%13===0?'#3e3a2a':'#5e5a44',nz(r,.86,1.06));};
VXD.gPaint=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,'#7f362d',nz(r,.86,1.08));};
VXD.goo=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,(x*3+y*5)%7===0?'#a8c040':'#6c8930',nz(r,.88,1.1));};
FOLDERS['wasteland/fort']={name:'Goblin fortress',blurb:'Wooden palisade walls, corners, gate, towers, huts, totems and camp props',children:[]};
const GB_WALL={key:'deco',label:'Extras',choices:[['trophies','Skulls, hides and shields'],['plain','Plain'],['spikes','Stakes in front']],def:'trophies'};
/* sharpened log standing on the ground (its foot in the earth bank) */
function gbLog(par,x,z,h,w=.36){bx(par,w,h,w,vm('gBark'),x,h/2,z);bx(par,w*.66,.2,w*.66,vm('gTip'),x,h+.1,z);bx(par,w*.3,.18,w*.3,vm('gTip'),x,h+.29,z);}
function gbBank(par,w,d=1){const m=box(w,.3,d,[vm('wDustSide'),vm('wDustSide'),vm('wDust'),vm('dirt'),vm('wDustSide'),vm('wDustSide')],{s:.8,ox:0,oy:0,oz:0});put(par,m,0,.15,0);return m;}
function gbStakes(par,x,z,len){const g=new THREE.Group();put(par,g,x,0,z);vlog(g,len,.3,.3,'x',0,.15,0);for(let i=0;i<Math.round(len/.5);i++){const s=new THREE.Group();put(g,s,-len/2+.25+i*.5,.15,0,.75,0,0);bx(s,.1,1.2,.1,vm('gBark'),0,.6,0);bx(s,.06,.18,.06,vm('gTip'),0,1.29,0);}return g;}
function gbTrophy(par,r,x,y,z,k){if(k===0){wlSkull(par,x,y,z+.12,1,0);bx(par,.03,.34,.03,vm('rope'),x,y+.4,z+.02);}
  else if(k===1){const g=new THREE.Group();put(par,g,x,y,z+.035);bx(g,.7,.8,.03,vm('hide'),0,0,0);for(const[a,b]of[[-.25,-.48],[.05,-.46],[.28,-.5]])bx(g,.14,.16,.03,vm('hide'),a,b,0);bx(g,.1,.1,.03,vm('iron'),0,.36,.02);}
  else{const g=new THREE.Group();put(par,g,x,y,z+.03);wlShield(g,.32,r()<.5?'planks':'planksDark');}}
/* the palisade wall; o.gap = logs left out (with stumps), o.lean = a leaning log */
function gbWallBody(root,r,o={}){const L=4,xs=[],hs=[];for(let i=0;i<10;i++){xs.push(-1.8+i*.4);hs.push(3.4+r()*.8);}gbBank(root,L,1);
  for(let i=0;i<10;i++){if(o.gap&&o.gap.includes(i)){const h=.4+r()*.6;bx(root,.36,h,.36,vm('gBark'),xs[i],h/2,0);bx(root,.2,.12,.2,vm('gTip'),xs[i]+.06,h+.06,.04);continue;}
    if(o.lean===i)continue;gbLog(root,xs[i],(r()-.5)*.04,hs[i]);}
  const runs=[];let s=null;for(let i=0;i<10;i++){const solid=!(o.gap&&o.gap.includes(i))&&o.lean!==i;if(solid&&s===null)s=i;if((!solid||i===9)&&s!==null){runs.push([s,solid&&i===9?i:i-1]);s=null;}}
  for(const[a,b]of runs){const x0=xs[a]-.2,x1=xs[b]+.2,w=x1-x0,cx=(x0+x1)/2;if(w<.5)continue;for(const y of[1.1,3])vlog(root,w,.2,.2,'x',cx,y,-.28);for(const y of[1,2.6])bx(root,w,.08,.04,vm('rope'),cx,y,.2);}
  return{xs,hs};}
function gbWall(s,op){const deco=(op&&op.deco)||'trophies',root=wlRoot(3.6),r=mulberry32((s||1)*701);const{xs,hs}=gbWallBody(root,r);
  if(deco==='trophies'){const a=1+Math.floor(r()*3),b=6+Math.floor(r()*3);gbTrophy(root,r,xs[a],2.1,.18,Math.floor(r()*3));gbTrophy(root,r,xs[b],2.0,.18,(Math.floor(r()*3)+1)%3);}
  if(deco==='spikes')gbStakes(root,0,1.2,3.8);return root;}
function gbWallBroken(s){const root=wlRoot(3.6),r=mulberry32((s||1)*709),gap=[4,5,6];const{xs,hs}=gbWallBody(root,r,{gap,lean:3});
  const phi=Math.asin((xs[7]-xs[3]-.4)/3.4),g=new THREE.Group();put(root,g,xs[3],.0,0,0,0,-phi);bx(g,.36,3.4,.36,vm('gBark'),0,1.7,0);bx(g,.24,.2,.24,vm('gTip'),0,3.5,0);
  for(let i=0;i<2;i++){const l=new THREE.Group();put(root,l,-.6+i*1.4,.18,1.3+i*.6,0,.3+i*.5,Math.PI/2);bx(l,.36,3.2+i*.4,.36,vm('gBark'),0,0,0);bx(l,.24,.2,.24,vm('gTip'),0,1.7+i*.2,0);}
  wlRubble(root,.4,.9,5,r,.8,[vm('gBark'),vm('dirt')],.2);return root;}
function gbWallWalk(s,op){const lad=(op&&op.ladder)!=='none',root=wlRoot(3.6),r=mulberry32((s||1)*719);gbWallBody(root,r);const Y=2.6;
  for(const x of[-1.7,0,1.7]){vlog(root,.24,Y-.1,.24,'y',x,(Y-.1)/2,-1.45);vlog(root,.2,.2,1.3,'z',x,Y-.15,-.95);}
  for(let i=0;i<10;i++)bx(root,.38,.08,1.22,vm('planks'),-1.8+i*.4,Y+.0,-.99+(r()-.5)*.02);
  for(const x of[-1.7,.6])vlog(root,.14,1,.14,'y',x,Y+.54,-1.53);vlog(root,2.44,.14,.14,'x',-.55,Y+.9,-1.53);
  if(lad){const ld=new THREE.Group(),a=Math.atan2(1,Y+.6);put(root,ld,1.1,0,-2.6,a,0,0);const L=Math.hypot(1,Y+.6);for(const sd of[-1,1])bx(ld,.08,L,.08,vm('planksDark'),sd*.24,L/2,0);for(let i=0;i<Math.floor(L/.34);i++)bx(ld,.48,.05,.06,vm('planks'),0,.3+i*.34,0);}
  return root;}
function gbCorner(s){const root=wlRoot(2),r=mulberry32((s||1)*727);const m=box(1.8,.3,1.8,[vm('wDustSide'),vm('wDustSide'),vm('wDust'),vm('dirt'),vm('wDustSide'),vm('wDustSide')],{s:.8,ox:0,oy:0,oz:0});put(root,m,0,.15,0);
  for(let i=-1;i<=1;i++)for(let k=-1;k<=1;k++){if(!i&&!k)continue;gbLog(root,i*.4,k*.4,3.6+r()*.7,.38);}const H=4.8;bx(root,.44,H,.44,vm('gBark'),0,H/2,0);bx(root,.26,.3,.26,vm('gTip'),0,H+.15,0);bx(root,.1,.3,.1,vm('gTip'),0,H+.45,0);
  wlSkull(root,0,H+.12,0,1.15,0);for(const y of[1.2,2.8])for(let f=0;f<4;f++){const a=f*Math.PI/2;bx(root,1.24,.08,.04,vm('rope'),Math.sin(a)*.62,y,Math.cos(a)*.62,0,a,0);}return root;}
function gbGate(s,op){const root=wlRoot(4),r=mulberry32((s||1)*733),H=5;gbBank(root,5.2,1.2);
  for(const sd of[-1,1]){bx(root,.6,H,.6,vm('gBark'),sd*2,H/2,0);bx(root,.36,.24,.36,vm('gTip'),sd*2,H+.12,0);bx(root,.14,.2,.14,vm('gTip'),sd*2,H+.34,0);for(const y of[1,2.6,4])bx(root,.64,.08,.64,vm('rope'),sd*2,y,0);}
  vlog(root,5,.4,.4,'x',0,4.5,.0);wlHornSkull(root,0,4.7,.05,1.1,0);wlSkull(root,-1,4.7,.05,1,0);wlSkull(root,1,4.7,.05,1,0);
  for(const sd of[-1,1]){const g=new THREE.Group();put(root,g,sd*1.4,4.3,.21);bx(g,.03,.5,.03,vm('rope'),0,-.15,0);wlSkull(g,0,-.62,.05,.9,0);}
  const leaves=[];for(const sd of[-1,1]){const lf=new THREE.Group();put(root,lf,sd*-1.7,0,-.05);leaves.push([lf,-sd]);for(let i=0;i<4;i++){const x=sd*(.21+i*.42),h=3.1+(i%2)*.3;bx(lf,.4,h,.34,vm('gBark'),x,h/2+.05,0);bx(lf,.26,.2,.26,vm('gTip'),x,h+.15,0);bx(lf,.12,.18,.12,vm('gTip'),x,h+.34,0);}
    for(const y of[.7,2.4])bx(lf,1.68,.24,.12,vm('planksDark'),sd*.84,y,-.23);const L=Math.hypot(1.4,1.5),a=Math.atan2(1.5,1.4);const br=box(L,.2,.1,vm('planksDark'),{s:.8,ox:0,oy:0,oz:0});put(lf,br,sd*.84,1.55,-.24,0,0,sd*a);}
  vGateAnim(root,(op&&op.state)==='open'?1:0,e=>{for(const[lf,sd]of leaves)lf.rotation.y=-sd*e*1.45;});
  for(let i=0;i<4;i++)wlTuft(root,(r()-.5)*5,0,(r()<.5?-1:1)*(.9+r()*.4),r,r()<.5);return root;}
WL('gob-wall','fort','Palisade wall',gbWall,'Goblin palisade: ten rough sharpened logs of uneven height on an earth bank, lashed with rope in front, rails behind. Extras: trophies (skulls, hides, shields), plain, or stakes angled out in front. 4 m long, centred on the grid line, outside towards +z.',{opts:[GB_WALL],variants:true,defaultSeed:1});
WL('gob-wall-broken','fort','Broken palisade',gbWallBroken,'Palisade with three logs smashed to stumps, one leaning across the gap against its neighbour and two lying on the ground outside. 4 m long, same grid as the wall.',{variants:true,defaultSeed:1});
WL('gob-wall-walk','fort','Palisade with wall walk',gbWallWalk,'Palisade with a plank fighting platform behind it at 2.6 m on posts, a back rail and an optional ladder leaning against the platform. 4 m long, same grid as the wall.',{opts:[{key:'ladder',label:'Ladder',choices:[['yes','Yes'],['none','None']],def:'yes'}],variants:true,defaultSeed:1});
WL('gob-corner','fort','Palisade corner post',gbCorner,'Cluster of nine logs for a grid vertex, the tallest in the middle with a skull jammed on its point, roped round twice. Hides the palisade ends that meet there.',{variants:true,defaultSeed:1});
WL('gob-gate','fort','Palisade gate',gbGate,'Gate for a 4 m gap: tall posts on the vertices, a log lintel with a horned skull and two skulls, skulls hanging on ropes, and two leaves of sharpened logs that swing inwards.',{opts:[{key:'state',label:'Gate',choices:[['closed','Closed'],['open','Open']],def:'closed',live:true}]});

/* ---------- buildings ---------- */
function gbLadder(par,x,z,ry,top,run){const ld=new THREE.Group(),a=Math.atan2(run,top);put(par,ld,x,0,z,0,ry,0);const t=new THREE.Group();put(ld,t,0,0,0,a,0,0);const L=Math.hypot(run,top)+.4;
  for(const sd of[-1,1])bx(t,.08,L,.08,vm('planksDark'),sd*.24,L/2,0);for(let i=0;i<Math.floor(L/.34)-1;i++)bx(t,.48,.05,.06,vm('planks'),0,.3+i*.34,0);return ld;}
function gbTower(s){const root=wlRoot(3.6),L=root.userData.lights,r=mulberry32((s||1)*739),Y=5,P=1.5,lg=vm('gBark');
  for(const[a,b]of[[1,1],[1,-1],[-1,1],[-1,-1]]){bx(root,.36,Y+2.6,.36,lg,a*P,(Y+2.6)/2,b*P);bx(root,.6,.3,.6,vm('dirt'),a*P,.15,b*P);}
  for(let f=0;f<4;f++){const g=new THREE.Group();put(root,g,0,0,0,0,f*Math.PI/2,0);const z=P+.04;vlog(g,3.4,.18,.18,'x',0,2.6,z+.18);vlog(g,3.4,.18,.18,'x',0,Y-.4,z+.18);for(const y of[2.6,Y-.4])for(const sd of[-1,1])wlBeam(g,[sd*(P-.18),y-1,z+.18],[sd*(P-1.2),y-.05,z+.18],.14,vm('gBarkH'));}
  bx(root,3.7,.14,3.7,vm('planks'),0,Y,0);for(const x of[-1,0,1])vlog(root,3.6,.2,.2,'x',0,Y-.17,x);
  for(let f=0;f<4;f++){const g=new THREE.Group();put(root,g,0,0,0,0,f*Math.PI/2,0);vlog(g,3,.16,.16,'x',0,Y+1,P);for(let i=0;i<7;i++){if(f===2&&(i===2||i===3))continue;const x=-1.2+i*.4;bx(g,.12,1,.12,lg,x,Y+.57,P);bx(g,.07,.12,.07,vm('gTip'),x,Y+1.13,P);}
    if(f%2===0){bx(g,1.6,.8,.03,vm('hide'),.5,Y+.62,P+.08);bx(g,.3,.2,.03,vm('hide'),.1,Y+.13,P+.08);}}
  const rf=vPyramid(4.4,4.4,1.6,vm('hide'),.4);put(root,rf,0,Y+2.6,0);bx(root,4.6,.2,4.6,vm('hideDark'),0,Y+2.5,0);vlog(root,.1,1.4,.1,'y',0,Y+4.5,0);wlHornSkull(root,0,Y+4.2+.0,.0,.6,0);
  gbLadder(root,.2,-P-.85,0,Y+.5,.7);vFlame(root,P-.3,Y+1.1,P-.3,.14,L,.8);bx(root,.1,1.03,.1,lg,P-.3,Y+.585,P-.3);
  vBarrel(root,-1,1);bx(root,.4,.4,.4,vm('crate'),-.9,Y+.27,-.9);for(let i=0;i<3;i++)wlTuft(root,(r()-.5)*3,0,(r()-.5)*3,r,true);return root;}
function gbHut(s){const root=wlRoot(3.2),r=mulberry32((s||1)*743),c=.4,R=1.8,H=1.8;const yard=box(4,.02,4,vm('wTrack'),{s:.8,ox:0,oy:0,oz:0});yard.castShadow=false;put(root,yard,0,.01,0);
  const N=Math.ceil(R/c);for(let i=-N;i<N;i++)for(let k=-N;k<N;k++){const x=(i+.5)*c,z=(k+.5)*c,d=Math.hypot(x,z);if(d>=R)continue;if(d<R-.45){if(d<R-.8)bx(root,c,.04,c,vm('mud'),x,.04,z);continue;}if(z>0&&Math.abs(x)<.5)continue;
    bx(root,c,H,c,vm(((i+k)%3)?'gBark':'mud'),x,H/2,z);}
  for(let l=0;l<6;l++){const rr=R+.4-l*.38,y=H+l*.3;if(rr<.3)break;vDisc(root,0,0,rr,y,.3,vm(l%2?'hideDark':'hide'),c);}
  vlog(root,.1,1,.1,'y',0,H+1.8+.5,0);wlSkull(root,0,H+2.8,0,.9,0);
  for(const sd of[-1,1]){const p=[sd*.62,0,R-.25],q=[sd*.42,1.4,R+.12],t=[sd*.12,2.05,R+.2];wlBeam(root,p,q,.16,vm('bone'));wlBeam(root,q,t,.12,vm('bone'));bx(root,.1,.1,.1,vm('bone'),t[0],t[1],t[2]);}
  bx(root,.6,.04,.5,vm('fur'),0,.06,-.6);vSack(root,.9,.4);wlBones(9).children.forEach(q=>{const p=q.clone();p.scale.setScalar(.7);p.position.multiplyScalar(.6);p.position.z+=R+.9;root.add(p);});return root;}
function gbChiefHut(s){const root=wlRoot(5.6),L=root.userData.lights,r=mulberry32((s||1)*751),Lx=7.2,Dz=3.6,hw=2.2;const yard=box(9.6,.02,6,vm('wTrack'),{s:.8,ox:0,oy:0,oz:0});yard.castShadow=false;put(root,yard,0,.01,.6);
  root.add(vWalls({Lx,Dz,y:0,h:hw,t:.3,mat:vm('gBarkH'),ops:{front:[{type:'door',x:0,w:1.4,y0:0,y1:1.9,open:1.3,leaf:'planksDark'},{type:'hole',x:-2.4,w:.4,y0:1.1,y1:1.5},{type:'hole',x:2.4,w:.4,y0:1.1,y1:1.5}],back:[],left:[],right:[{type:'hole',x:0,w:.4,y0:1.1,y1:1.5}]}}).group);
  for(const[a,b]of[[1,1],[1,-1],[-1,1],[-1,-1]])bx(root,.4,hw+.2,.4,vm('gBark'),a*Lx/2,(hw+.2)/2,b*Dz/2);
  put(root,vRoof(Dz,Lx,2.2,vm('hide'),{ov:.5,ovL:.5,step:.4,gable:vm('gBarkH'),ridge:vm('fur')}),0,hw,0);
  for(const sd of[-1,1]){const g=new THREE.Group();put(root,g,sd*(Lx/2+.15),hw+2.1,0);wlBeam(g,[0,0,0],[sd*.3,1.1,0],.16,vm('bone'));wlBeam(g,[sd*.3,1.1,0],[sd*.1,1.6,0],.12,vm('bone'));}
  for(const sd of[-1,1]){const p=[sd*1.05,0,Dz/2+.5],q=[sd*.85,1.7,Dz/2+.75],t=[sd*.3,2.5,Dz/2+.8];wlBeam(root,p,q,.2,vm('bone'));wlBeam(root,q,t,.15,vm('bone'));}
  wlHornSkull(root,0,2.04,Dz/2+.17,.9,0);for(const sd of[-1,1])wlTorch(root,L,sd*1.7,Dz/2+1.1,1.7);
  for(const x of[-2.4,2.4]){wlSkull(root,x,1.6,Dz/2+.1,.8,0);vlog(root,1.6,.3,.3,'x',x*1.08,.15,Dz/2+1.4);}
  return root;}
function gbTent(s){const root=wlRoot(2.8),r=mulberry32((s||1)*757);vTentA(root,0,0,0,2.4,2,1.5,'hide');bx(root,.7,.06,1.6,vm('fur'),0,.03,-.2);wlBone(root,.4,1.3,0,1.2,.6);wlSkull(root,.9,0,1.5,.8,-.4);return root;}
WL('gob-tower','fort','Goblin watchtower',gbTower,'Rickety watchtower on a 4 × 4 m cell: four log legs with zig-zag braces, a plank platform at 5 m behind a stake parapet hung with hides, a stepped hide roof with a horned skull, a ladder leaning against the back and a torch.',{});
WL('gob-hut','fort','Goblin hut',gbHut,'Round hut of logs and mud, 3.6 m across, under a stepped roof of patched hides; two bone tusks frame the doorway, a skull tops the smoke pole, fur bedding inside and bones by the door.',{variants:true,defaultSeed:1});
WL('gob-chief','fort','Chieftain\'s longhut',gbChiefHut,'Long hut of horizontal logs, 7.2 × 3.6 m (two cells, centred on the edge between them), hide roof with a fur ridge and bone horns on the gables, a tusk arch and horned skull over the open door, skulls by the windows and two torches.',{});
WL('gob-tent','fort','Hide tent',gbTent,'Small A-frame tent of patched hides with a fur bedroll and a few bones outside.',{});

/* ---------- camp props ---------- */
function gbTotem(s){const root=wlRoot(2),r=mulberry32((s||1)*761),lg=vm('gBark');wlRubble(root,0,0,8,r,.7,[vm('wRock'),vm('cobble')],.3);
  bx(root,.5,4.4,.5,lg,0,2.2,0);const face=(y,k)=>{const g=new THREE.Group();put(root,g,0,y,0);bx(g,.7,.7,.7,lg,0,0,0);bx(g,.72,.1,.72,vm('gPaint'),0,.26,0);
    for(let f=0;f<(k===2?4:2);f++){const q=new THREE.Group();put(g,q,0,0,0,0,f*Math.PI,0);for(const sd of[-1,1])bx(q,.14,.1,.04,k===1?vm('gold'):vm('dark'),sd*.16,.1,.36);bx(q,.36,.1,.04,vm('dark'),0,-.16,.36);for(const sd of[-1,1])bx(q,.06,.16,.06,vm('bone'),sd*.14,-.06,.38);}};
  face(1.2,0);face(2.3,1);face(3.4,2);for(const sd of[-1,1]){const h=new THREE.Group();put(root,h,sd*.25,4.1,0,0,0,-sd*.4);bx(h,.3,.14,.14,vm('bone'),sd*.15,0,0);bx(h,.14,.4,.12,vm('bone'),sd*.3,.22,0);bx(h,.08,.2,.08,vm('bone'),sd*.3,.5,0);}
  wlSkull(root,0,4.4,0,1.2,0);for(let i=0;i<3;i++){const g=new THREE.Group();put(root,g,0,4.35,0,0,i*2.1,0);bx(g,.03,.5,.03,vm('rope'),.27,-.25,0);bx(g,.1,.1,.06,vm('bone'),.27,-.55,0);}
  for(let i=0;i<4;i++){const a=i*1.6;wlTuft(root,Math.cos(a)*1.1,0,Math.sin(a)*1.1,r,i%2===0);}return root;}
function gbCauldron(s){const root=wlRoot(2.2),L=root.userData.lights,r=mulberry32((s||1)*769);vFirePit(root,0,0,L);
  for(let i=0;i<3;i++){const a=i/3*Math.PI*2+.5;bx(root,.36,.5,.36,vm('wRock'),Math.cos(a)*.5,.25,Math.sin(a)*.5,0,a,0);}
  const g=new THREE.Group();put(root,g,0,.5,0);hollow(g,1,.7,1,.08,vm('iron'),0,0,0);for(const sd of[-1,1])bx(g,1.12,.08,.08,vm('iron'),0,.66,sd*.52);for(const sd of[-1,1])bx(g,.08,.08,.96,vm('iron'),sd*.52,.66,0);
  bx(g,.84,.04,.84,vm('goo'),0,.58,0);const bub=[];for(let i=0;i<5;i++){const b=new THREE.Group();b.name='bubble_'+i;put(g,b,(r()-.5)*.6,.6,(r()-.5)*.6);bx(b,.1,.1,.1,vm('goo'),0,0,0);b.scale.setScalar(1e-4);bub.push(b);}const bone=wlBone(g,.4,.1,.6,-.1,.5);bone.name='cauldron_bone';
  const stir=new THREE.Group();stir.name='stir';put(g,stir,0,0,0);wlBeam(stir,[.2,.3,.1],[.7,1.4,.35],.06,vm('planksDark'));
  propAnim(root,[...bub,stir,bone],[{name:'Idle',dur:3,loop:true,fn:(t,S)=>{bub.forEach((b,i)=>{const u=((t/3)*2+i/5)%1;S[b.name]={p:[b.position.x,.6+u*.06,b.position.z],s:u<.85?.4+u:1e-4};});S.stir={r:[0,t/3*Math.PI*2*.25,0]};S.cauldron_bone={p:[.1,.6+Math.sin(t/3*Math.PI*2)*.015,-.1],r:[0,.5+Math.sin(t/3*Math.PI*2)*.2,0]};}}]);
  for(let i=0;i<3;i++){const a=r()*6.28,d=1.2+r()*.4;wlBone(root,.3+r()*.3,Math.cos(a)*d,0,Math.sin(a)*d,r()*3);}wlSkull(root,-1.1,0,.8,.9,.7);vlog(root,1,.3,.3,'x',1.3,.15,-.9);return root;}
function gbRack(s){const root=wlRoot(2),r=mulberry32((s||1)*773);for(const sd of[-1,1]){vlog(root,.12,2,.12,'y',sd*1.1,1,0);for(const t of[-1,1])bx(root,.06,.3,.06,vm('gBark'),sd*1.1+t*.06,2.05,0,0,0,t*.45);}vlog(root,2.5,.1,.1,'x',0,2.06,0);
  for(let i=0;i<5;i++){const x=-.8+i*.4;bx(root,.03,.12,.03,vm('rope'),x,1.95,0);if(i%2===0){bx(root,.34,.7,.03,vm(i===2?'hideDark':'hide'),x,1.54,0);}else{bx(root,.12,.46,.08,vm('liqRed'),x,1.66,0);bx(root,.08,.1,.06,vm('bone'),x,1.39,0);}}
  vFirePit(root,0,.9,root.userData.lights);return root;}
function gbCage(s){const root=wlRoot(2),r=mulberry32((s||1)*787),W=1.6,H=1.8,lg=vm('gBark');bx(root,W+.2,.16,W+.2,vm('planksDark'),0,.08,0);bx(root,W+.2,.14,W+.2,vm('planksDark'),0,H+.07,0);
  for(let i=0;i<=6;i++){const t=-W/2+i*W/6;for(const sd of[-1,1]){if(!(sd===1&&i>=2&&i<=4))bx(root,.1,H-.08,.1,lg,t,(H+.08)/2,sd*W/2);bx(root,.1,H-.08,.1,lg,sd*W/2,(H+.08)/2,t);}}
  const d=new THREE.Group();d.name='cage_door';put(root,d,-W/6*1-.0,0,W/2+.06,0,-.7,0);for(let i=0;i<3;i++)bx(d,.1,H-.3,.1,lg,.05+i*.25,H/2,0);for(const y of[.5,1.3])bx(d,.6,.08,.06,vm('planksDark'),.3,y,.06);
  for(const[a,b]of[[1,1],[1,-1],[-1,1],[-1,-1]])wlSkull(root,a*(W/2+.0),H+.14,b*(W/2),.6,Math.atan2(a,b));bx(root,1.2,.06,1.2,vm('hay'),0,.19,0);wlBones(11).children.forEach(q=>{const p=q.clone();p.scale.setScalar(.6);p.position.multiplyScalar(.4);p.position.y=.22;root.add(p);});
  propAnim(root,[d],[{name:'Close',dur:1,hold:true,fn:(t,S)=>{const k=paEase(t/1);S.cage_door={r:[0,-.7*(1-k)+(k>.9?Math.sin((k-.9)*70)*.04:0),0]};}},{name:'Open',dur:1,hold:true,fn:(t,S)=>{S.cage_door={r:[0,-.7*paEase(t/1),0]};}},{name:'Rattle',dur:1.2,next:'Idle',fn:(t,S)=>{S.cage_door={r:[0,-.05-Math.abs(Math.sin(t*20))*.08*(1-t/1.2),0]};}}]);return root;}
function gbJunk(s){const root=wlRoot(2.8),r=mulberry32((s||1)*797);vCrate(root,.7,-.6,0,-.4,.3);vCrate(root,.5,-.6,.7,-.4,.1);vBarrel(root,.5,-.6);vChest(root,.6,.6,-.4,true);for(let i=0;i<3;i++)vSack(root,-1.3+i*.35,.5);
  {const w=new THREE.Group();put(root,w,1.3,.07,-.4,-Math.PI/2,0,0);wlWheel(w,.45);}{const sh=new THREE.Group();put(root,sh,-.6,.94,-.12);wlShield(sh,.24);}
  for(let i=0;i<2;i++){const sh=new THREE.Group();put(root,sh,(r()-.5)*2.4,.025,1+r()*.4,-Math.PI/2,0,r()*3);wlShield(sh,.3,'planksDark');}
  bx(root,.28,.2,.3,vm('rustIron'),1.2,.1,.8,0,.4,0);wlStuckSword(root,-1.5,-.6,.5,.3);put(root,wSword(.6,.06,.14),.2,.04,1.3,Math.PI/2,0,.7);for(let i=0;i<12;i++)bx(root,.08,.04,.08,vm('gold'),.4+r()*.8,.02,.2+r()*.6,0,r()*3,0);return root;}
function gbBanner(s){const root=wlRoot(1.6),r=mulberry32((s||1)*809);bx(root,.6,.3,.6,vm('wRock'),0,.15,0);vlog(root,.14,4.4,.14,'y',0,2.5,0);vlog(root,1.1,.1,.1,'x',.5,4.55,0);bx(root,.12,.12,.12,vm('rope'),1,4.45,0);wlSkull(root,0,4.7,0,1,0);
  const b=new THREE.Group();b.name='banner_cloth';put(root,b,.55,4.45,0);for(const x of[-.35,.35])bx(b,.04,.1,.04,vm('rope'),x,0,0);bx(b,.9,.8,.04,vm('hideDark'),0,-.45,0);bx(b,.9,.08,.05,vm('gPaint'),0,-.12,0);
  const b2=new THREE.Group();b2.name='banner_tail';put(b,b2,0,-.85,0);bx(b2,.9,.62,.04,vm('hideDark'),0,-.31,0);for(const[x,h]of[[-.33,.3],[-.05,.45],[.25,.25]])bx(b2,.24,h,.04,vm('hideDark'),x,-.6-h/2+.02,0);
  propAnim(root,[b,b2],[{name:'Idle',dur:3.2,loop:true,fn:(t,S)=>{const a=t/3.2*Math.PI*2;S.banner_cloth={r:[Math.sin(a)*.06,Math.sin(a)*.22,0]};S.banner_tail={r:[Math.sin(a-1)*.12,Math.sin(a-1.2)*.3,0]};}}]);return root;}
function gbPikes(s){const root=wlRoot(2),r=mulberry32((s||1)*811);for(let i=0;i<3;i++){const x=-1+i,h=2.2+r()*.6,g=new THREE.Group();put(root,g,x,0,(r()-.5)*.3,(r()-.5)*.1,0,(r()-.5)*.1);bx(g,.1,h,.1,vm('gBark'),0,h/2-.1,0);bx(g,.06,.2,.06,vm('gTip'),0,h,0);wlSkull(g,0,h-.2,0,1,(r()-.5)*.6);bx(root,.3,.12,.3,vm('dirt'),x,.06,g.position.z);}
  wlBones(13).children.forEach(q=>{const p=q.clone();p.position.multiplyScalar(.8);p.position.z+=.8;root.add(p);});return root;}
function gbBarricade(s){const root=wlRoot(3.2),r=mulberry32((s||1)*821);gbStakes(root,0,0,3.8);for(let i=0;i<3;i++){const x=-1.4+i*1.4;wlBeam(root,[x,.1,-1],[x,.3,-.16],.12,vm('gBark'));}wlSkull(root,.5,.3,.1,.8,0);return root;}
function gbFence(s){const root=wlRoot(2.8),r=mulberry32((s||1)*823);for(let i=0;i<4;i++){const x=-1.8+i*1.2,h=1.3+r()*.3;bx(root,.18,h,.18,vm('gBark'),x,h/2,0);bx(root,.1,.14,.1,vm('gTip'),x,h+.07,0);}
  for(const y of[.5,1])vlog(root,4,.12,.12,'x',0,y,.15);for(let i=0;i<3;i++){const x=-1.2+i*1.2;bx(root,.03,.2,.03,vm('rope'),x,.83,.21);wlBone(root,.3,x,.66,.25,0);}
  for(let i=0;i<4;i++)wlTuft(root,(r()-.5)*3.6,0,(r()<.5?-.4:.4),r,r()<.5);return root;}
function gbWalkway(s){const root=wlRoot(3),r=mulberry32((s||1)*827),Y=2.6;for(const x of[-1.8,1.8])for(const z of[-.6,.6])vlog(root,.24,Y-.1,.24,'y',x,(Y-.1)/2,z);for(const x of[-1.8,1.8])vlog(root,.2,.2,1.6,'z',x,Y-.34,0);
  for(const z of[-.5,.5])vlog(root,4,.2,.2,'x',0,Y-.14,z);for(let i=0;i<10;i++)bx(root,.38,.08,1.5,vm('planks'),-1.8+i*.4,Y,(r()-.5)*.03);
  for(const x of[-1.8,0,1.8])vlog(root,.12,1,.12,'y',x,Y+.54,.7);vlog(root,3.8,.12,.12,'x',0,Y+.95,.7);wlBeam(root,[-1.8,.3,-.5],[-.2,Y-.2,-.5],.14,vm('gBarkH'));wlBeam(root,[1.8,.3,.5],[.2,Y-.2,.5],.14,vm('gBarkH'));return root;}
function gbThrone(s,op){const og=(op&&op.size)!=='goblin',root=wlRoot(og?3:1.6),r=mulberry32((s||1)*829),g=new THREE.Group();root.add(g);g.scale.setScalar(og?1:.5);
  bx(g,3,.4,2.4,vm('wRock'),0,.2,0);bx(g,2.4,.5,2,vm('ruinDark'),0,.65,-.1);bx(g,2,.3,1.4,vm('gBarkH'),0,1.05,0);bx(g,1.9,.14,1.3,vm('fur'),0,1.27,0);bx(g,.5,.8,.06,vm('fur'),.4,.85,.93);
  for(let i=0;i<5;i++){const x=-.8+i*.4,h=2.8+(i===2?.6:i%2?.2:0);bx(g,.38,h,.38,vm('gBark'),x,.9+h/2,-.8);bx(g,.24,.2,.24,vm('gTip'),x,.9+h+.1,-.8);}
  for(const sd of[-1,1]){bx(g,.4,1.2,1.4,vm('gBarkH'),sd*1,1.5,0);bx(g,.42,.12,.4,vm('bone'),sd*1,2.16,.5);wlSkull(g,sd*1,2.1,-.1,1.1,0);}
  wlHornSkull(g,0,3.7,-.6,1.4,0);for(const sd of[-1,1])wlSkull(g,sd*.6,3.5,-.6,1,0);for(let i=0;i<5;i++){const a=r()*3.14+3.3,d=1.8+r()*.4;wlBone(root,(.3+r()*.4)*(og?1:.5),Math.cos(a)*d*(og?1:.5),0,-Math.sin(a)*d*(og?1:.5),r()*3);}return root;}
function gbFire(s){const root=wlRoot(2.4),L=root.userData.lights,r=mulberry32((s||1)*839);vFirePit(root,0,0,L);for(const[x,z,a]of[[0,1.4,0],[-1.4,0,Math.PI/2],[1.3,-.3,Math.PI/2+.3]])vlog(root,1.1,.3,.3,'x',x,.15,z).rotation.y=a;
  for(const sd of[-1,1]){vlog(root,.07,1,.07,'y',sd*.75,.5,-.1);bx(root,.05,.22,.05,vm('gBark'),sd*.75+.05,1.05,-.1,0,0,.45);}bx(root,1.7,.04,.04,vm('gBark'),0,1,-.1);bx(root,.3,.16,.16,vm('liqRed'),0,.9,-.1);
  for(let i=0;i<4;i++){const a=r()*6.28,d=.9+r()*.3;wlBone(root,.25+r()*.2,Math.cos(a)*d,0,Math.sin(a)*d,r()*3);}return root;}
WL('gob-totem','fort','Skull totem',gbTotem,'Totem pole of three carved, painted faces with bone tusks (the top one four-faced, the middle one gold-eyed), bone horns and a skull on top, charms on ropes, on a pile of stones.',{});
WL('gob-cauldron','fort','Goblin cauldron',gbCauldron,'Big iron cauldron of bubbling green brew on three stones over a fire, a bone floating in it, a stirring stick, bones and a skull around, a log to sit on.',{});
WL('gob-rack','fort','Drying rack',gbRack,'Pole rack hung with hides and strips of red meat over a smoky fire.',{});
WL('gob-cage','fort','Bone cage',gbCage,'Log cage on a plank floor with a door swung open, a skull on every corner, straw and gnawed bones inside.',{});
WL('gob-junk','fort','Loot heap',gbJunk,'Goblin hoard: crates, a barrel, an open chest, sacks, a wheel, shields, a helmet, swords and scattered gold.',{});
WL('gob-banner','fort','Ragged banner',gbBanner,'Pole with a skull on top and a bent arm holding a ragged, blank hide banner with a red band and a torn bottom edge.',{});
WL('gob-pikes','fort','Skull pikes',gbPikes,'Three crooked pikes with skulls stuck on them and bones scattered at their feet.',{variants:true,defaultSeed:1});
WL('gob-barricade','fort','Stake barricade',gbBarricade,'4 m barricade of sharpened stakes angled outwards from a log, propped from behind, a skull on one stake.',{});
WL('gob-fence','fort','Crude fence',gbFence,'Low 4 m fence of rough posts and two log rails with bones tied on, for warg pens and yards.',{variants:true,defaultSeed:1});
WL('gob-walkway','fort','Raised walkway',gbWalkway,'4 m plank walkway at 2.6 m on four log posts with a rail on one side; links watchtowers and wall walks.',{});
WL('gob-throne','fort','Bone throne',gbThrone,'Crude throne on a rock plinth: log seat with furs, a back of sharpened logs crowned with a horned skull, skulls on the armrests. Ogre size (about 4.5 m tall) or goblin size.',{opts:[{key:'size',label:'Size',choices:[['ogre','Ogre'],['goblin','Goblin']],def:'ogre'}]});
WL('gob-fire','fort','Goblin fire',gbFire,'Fire pit with a spit roasting something on forked sticks, log seats and gnawed bones.',{});
