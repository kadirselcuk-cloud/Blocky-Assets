/* ======================= WASTELAND KIT: a village raided by goblins (wl-raid-) =======================
   Burnt and burning cottages, smashed huts and fences, a broken well, a goblin raid totem, plunder, siege engines.
   Fire and smoke are baked clips (Idle loops), so they play in the viewer and in the GLB. */
VXD.plasterBurnt=(P,r)=>{const m=mulberry32(2101),st=[];for(let x=0;x<16;x++)st.push(m());for(let y=0;y<16;y++)for(let x=0;x<16;x++){const k=r(),s=k<.22+st[x]*.45;P(x,y,s?(r()<.5?'#292421':'#49423c'):k<.8?'#989084':'#b6af9e',nz(r,.9,1.05));}};
VXD.timberChar=(P,r)=>{const c=[];for(let x=0;x<16;x++)c.push(nz(r,.8,1.1));for(let y=0;y<16;y++)for(let x=0;x<16;x++){const k=r();P(x,y,k<.05?'#5e3f33':(y%4===0?'#151311':'#28221e'),c[x]*nz(r,.9,1.06));}};
VXD.thatchBurnt=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++){let f=nz(r,.8,1.1);if(y%4===3)f=.6;P(x,y,r()<.35?'#1e1a16':'#574a36',f);}};
VXD.smoke=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,r()<.3?'#3c3a37':'#585551',nz(r,.9,1.06));};
const RFIRE=new THREE.MeshStandardMaterial({color:new THREE.Color(0xed964e).convertSRGBToLinear(),emissive:new THREE.Color(0xc65c3b).convertSRGBToLinear(),emissiveIntensity:1.1,roughness:.6,transparent:true,opacity:.9});
const RFIRE2=new THREE.MeshStandardMaterial({color:new THREE.Color(0xf8d9a2).convertSRGBToLinear(),emissive:new THREE.Color(0xe4ae58).convertSRGBToLinear(),emissiveIntensity:1.2,roughness:.6});
const SMOKEMAT=new THREE.MeshStandardMaterial({map:vxTex('smoke'),transparent:true,opacity:.62,depthWrite:false,roughness:1});
FOLDERS['wasteland'].children.push('wasteland/raid');
FOLDERS['wasteland/raid']={name:'Raided village',blurb:'Burnt and burning cottages, smashed huts, fences and well, raid totem, plunder, catapult and battering ram',children:[]};
const wlTileMats3=tileMats;tileMats=function(){const m=wlTileMats3();Object.assign(m,{burntField:{top:vm('tilled'),side:vm('wDustSide'),h:T-.02},burntStubble:{top:vm('wScorch'),side:vm('wDustSide')}});return m;};
/* fire on a part: a few flame boxes on groups that flicker in the Idle loop; smoke puffs that rise and spread */
function rdFire(par,x,y,z,s,list){const g=new THREE.Group();g.name='flame';put(par,g,x,y,z);for(const[fx,fz,k]of[[0,0,1],[s*.35,s*.2,.6],[-s*.3,-s*.25,.7]]){const f=new THREE.Mesh(new THREE.BoxGeometry(s*k*.6,s*k,s*k*.6),RFIRE);f.position.set(fx,s*k/2,fz);f.castShadow=false;g.add(f);const c2=new THREE.Mesh(new THREE.BoxGeometry(s*k*.3,s*k*.5,s*k*.3),RFIRE2);c2.position.set(fx,s*k*.28,fz);c2.castShadow=false;g.add(c2);}list.push(g);return g;}
function rdSmoke(par,x,y,z,n,list,spread=.6,size=1){for(let i=0;i<n;i++){const g=new THREE.Group();g.name='smoke';put(par,g,x,y,z);const m=new THREE.Mesh(new THREE.BoxGeometry(.7,.7,.7),SMOKEMAT);m.castShadow=false;g.add(m);g.userData.sm={x,y,z,ph:i/n,sp:spread,sz:size};list.push(g);}}
function rdFireAnim(root,flames,smokes,dur=3,extra=[]){const r=mulberry32(77);flames.forEach(f=>f.userData.ph=r()*6.28);
  propAnim(root,[...flames,...smokes,...extra.map(e=>e.o)],[{name:'Idle',dur,loop:true,fn:(t,S)=>{const a=t/dur*Math.PI*2;
    for(const f of flames){const ph=f.userData.ph;S[f.name]={s:[1+.12*Math.sin(a*3+ph),.8+.35*Math.abs(Math.sin(a*4+ph)),1+.12*Math.cos(a*3+ph)]};}
    for(const g of smokes){const{x,y,z,ph,sp,sz}=g.userData.sm,u=(t/dur+ph)%1,big=(.6+u*2)*sz;S[g.name]={p:[x+Math.sin(u*5+ph*9)*sp*u+u*1.2*sz,y+u*7*sz,z+Math.cos(u*4+ph*7)*sp*u],r:[u*2,u*3,0],s:u<.08?u*12*sz:u>.8?(1-u)*5*big:big};}
    for(const e of extra)e.fn(a,S);}}]);}
function rdUniq(list){list.forEach((o,i)=>o.name=o.name+'_'+i);}
/* the village cottage, burnt: plaster walls with broken tops, charred frame, roof gone but for a few rafters */
function rdCottage(s,op){const burning=op&&op.burning,state=(op&&op.state)||'smoulder',root=wlRoot(5),L=root.userData.lights,r=mulberry32((s||1)*1301+(burning?7:0)),Lx=5.6,Dz=4.4,base=.4,hw=2.4,t=.2,c=.4;
  bx(root,Lx+.2,base,Dz+.2,vm('cobble'),0,base/2,0);const pm=vm('plasterBurnt'),tc=vm('timberChar');
  const face=(nc,ry,x,z,prof,hole)=>{const g=new THREE.Group();put(root,g,x,base,z,0,ry,0);ruGrid(g,nc,7,(i,row)=>row<prof(i)&&!(hole&&hole(i,row)),{t,mat:pm,noPlinth:true});return g;};
  const sd0=(s||1)*1.7,brk=burning?()=>6:(i=>Math.max(2,Math.min(6,Math.round(4+1.5*Math.sin(i*.45+sd0)+.7*Math.sin(i*1.05+sd0*2)))));
  const F=face(14,0,0,Dz/2-t/2,burning?()=>6:i=>i>9?Math.max(1,6-(i-9)):brk(i),(i,row)=>(i>=4&&i<=6&&row<=4)||((i===1||i===2||i===10||i===11)&&row>=2&&row<=3));
  face(14,Math.PI,0,-Dz/2+t/2,brk,(i,row)=>(i===6||i===7)&&row>=2&&row<=3);face(10,Math.PI/2,Lx/2-t/2,0,brk,(i,row)=>(i===4||i===5)&&row>=2&&row<=3);face(10,-Math.PI/2,-Lx/2+t/2,0,burning?()=>6:i=>Math.max(3,brk(i)));
  for(const[x,z]of[[1,1],[1,-1],[-1,1],[-1,-1]])bx(root,.2,hw-(x>0&&z>0&&!burning?.9:0),.2,tc,x*(Lx/2-.05),base+(hw-(x>0&&z>0&&!burning?.9:0))/2,z*(Dz/2-.05));
  for(const x of[-1.4,1.4])bx(root,.18,burning?hw:1.6+r()*.5,.08,tc,x,base+(burning?hw:1.8)/2,Dz/2+.03);
  const ch=Lx/2+.5;bx(root,.8,base+hw+3.4,1.2,vm('cobble'),-ch,(base+hw+3.4)/2,0);bx(root,1,.2,1.4,vm('stoneBrick'),-ch,base+hw+3.5,0);bx(root,.4,1,.6,vm('wScorch'),-ch+.3,base+hw+2,0);
  const flames=[],smokes=[],extra=[];
  if(burning){const rf=vRoof(Dz,Lx,2.6,vm('thatchBurnt'),{ov:.7,ovL:.6,step:.4,gable:pm,ridge:vm('wScorch')});put(root,rf,0,base+hw,0);
    for(const[x,z,y,sz]of[[-1.6,1.4,.9,.9],[.4,1.2,1.4,1.1],[1.9,.9,.8,.8],[-.6,-1.3,1.2,1],[1.4,-1.1,1,.9],[0,0,2.5,1.2],[-2,-.5,1.6,.8]])rdFire(root,x,base+hw+y,z,sz,flames);
    for(const[x,z]of[[-1.9,Dz/2+.02],[1.3,Dz/2+.02]])rdFire(root,x,base+1.0,z,.45,flames);rdFire(root,0,base+.1,Dz/2+.05,.5,flames);rdSmoke(root,0,base+hw+3,0,8,smokes,.9);
    const pl=new THREE.PointLight(0xed964e,0,14,2);pl.position.set(0,base+hw+2,0);pl.userData.lamp=true;pl.userData.min=1.2;root.add(pl);L.push(pl);}
  else{for(const x of[-2,-.7,.6,1.9]){const ok=r()<.6;if(ok){for(const sd of[-1,1])wlBeam(root,[x,base+hw,sd*(Dz/2-.1)],[x,base+hw+2.2,0],.16,tc);}else wlBeam(root,[x,base+hw,-(Dz/2-.1)],[x+.4,.5,Dz/2-1],.16,tc);}
    wlBeam(root,[-2.4,base+hw+2.1,0],[.8,base+hw+2.15,0],.18,tc);wlBeam(root,[.8,base+hw+2.15,0],[2.4,.6,.6],.18,tc);
    bx(root,1.2,.4,.8,vm('thatchBurnt'),1.2,base+hw+.2,-1.6,.5,0,0);const ash=bx(root,Lx-.4,.06,Dz-.4,vm('wAsh'),0,base+.03,0);ash.castShadow=false;
    for(let i=0;i<5;i++)vlog(root,1.2+r()*1.4,.18,.18,'x',(r()-.5)*3,base+.15,(r()-.5)*2.4).material=tc;bx(root,1.2,.06,2,vm('planksDark'),.3,.03,Dz/2+1.4,0,.3,0);
    if(state==='smoulder'){for(const[x,z]of[[-1,.4],[.9,-.6],[1.6,1]]){const e=bx(root,.5,.08,.5,EMBER,x,base+.1,z);e.castShadow=false;rdFire(root,x,base+.14,z,.22,flames);}rdSmoke(root,.4,base+.4,0,6,smokes,.3,.45);
      const pl=new THREE.PointLight(0xed964e,0,6,2);pl.position.set(0,base+.8,0);pl.userData.lamp=true;pl.userData.min=.7;root.add(pl);L.push(pl);}}
  rdUniq(flames);rdUniq(smokes);if(flames.length||smokes.length)rdFireAnim(root,flames,smokes,3.4,extra);for(let i=0;i<6;i++)wlTuft(root,(r()-.5)*7,0,(r()<.5?-1:1)*(3+r()*.6),r,r()<.4);return root;}
function rdHut(s){const root=wlRoot(3.8),r=mulberry32((s||1)*1307),pl=vm('planks'),pd=vm('planksDark');bx(root,3.6,.2,3.6,vm('dirt'),0,.1,0);
  for(const[x,z,ry,len,ok]of[[0,-1.6,0,3.2,1],[-1.6,0,Math.PI/2,3.2,1],[1.6,.4,Math.PI/2,2.4,0]]){const g=new THREE.Group();put(root,g,x,.2,z,0,ry,0);for(let i=0;i<Math.round(len/.4);i++){const h=ok?2:(.4+r()*.9);bx(g,.38,h,.12,pl,-len/2+.2+i*.4,h/2,0);}}
  for(let i=0;i<4;i++){const h=i<2?2:.6+r()*.5;bx(root,.38,h,.12,pl,-1.4+i*.4,.2+h/2,1.6);}for(let i=0;i<3;i++){const g=new THREE.Group();put(root,g,2.4+r()*.4,.06,-.8+i*.7,0,r()*.5,Math.PI/2);bx(g,.38,1.6,.12,pl,0,0,0);}
  for(const[x,z]of[[1,1],[1,-1],[-1,1],[-1,-1]])vlog(root,.2,x>0&&z>0?1.1:2.2,.2,'y',x*1.65,.2+(x>0&&z>0?1.1:2.2)/2,z*1.65);
  const rf=new THREE.Group();put(root,rf,.15,1.43,-.2,0,0,-.44);bx(rf,3.9,.12,3.8,vm('thatch'),0,0,0);bx(rf,3.6,.1,.2,pd,0,-.11,1.6);bx(rf,3.6,.1,.2,pd,0,-.11,-1.6);
  const dr=new THREE.Group();put(root,dr,.8,.06,2.6,-Math.PI/2,0,.4);bx(dr,1,2,.08,vm('planksV'),0,0,0);bx(dr,.8,.06,.03,vm('iron'),0,.6,.05);vSack(root,-.8,.4);vBarrel(root,-.9,-.9);return root;}
function rdFence(s){const root=wlRoot(2.4),r=mulberry32((s||1)*1311);for(let i=0;i<4;i++){const x=-1.8+i*1.2,broken=i===2,h=broken?.5:1,g=new THREE.Group();put(root,g,x,0,0,0,0,i===1?.35:0);vlog(g,.16,h,.16,'y',0,h/2,0);if(broken)bx(g,.12,.12,.12,vm('planks'),.03,h+.06,0);}
  bx(root,1.2,.1,.08,vm('planks'),-1.2,.8,0);bx(root,1.2,.1,.08,vm('planks'),-1.2,.45,0);wlBeam(root,[0,.45,0],[1.0,.05,.6],.09,vm('planks'));wlBeam(root,[1.8,.8,0],[.9,.05,-.5],.09,vm('planks'));bx(root,1,.1,.08,vm('planks'),1.2,.05,.9,0,.8,0);
  for(let i=0;i<4;i++)wlTuft(root,(r()-.5)*3.6,0,(r()<.5?-1:1)*(.3+r()*.4),r,r()<.5);return root;}
function rdWell(s){const root=wlRoot(2.8),r=mulberry32((s||1)*1313),c=.4,R=.9;for(let i=-3;i<3;i++)for(let k=-3;k<3;k++){const x=(i+.5)*c,z=(k+.5)*c,d=Math.hypot(x,z);if(d<R+.2&&d>=R-.3){const h=(i===2&&k>0)?.4:.9;bx(root,c,h,c,vm('cobble'),x,h/2,z);}else if(d<R-.3){bx(root,c,.02,c,vm('dark'),x,.01,z);}}
  vlog(root,.16,2.2,.16,'y',-1.1,1.1,0);vlog(root,.16,.9,.16,'y',1.1,.45,0);bx(root,.14,.14,.14,vm('timberChar'),1.1,.97,0);
  const rf=new THREE.Group();put(root,rf,0,.35,1.5,-.5,0,0);bx(rf,1.6,.08,1.2,vm('shingle'),0,0,0);bx(root,.12,1.2,.12,vm('planksDark'),-.3,.06,2.4,0,.3,Math.PI/2);
  bx(root,2.4,.12,.12,vm('planksDark'),-.1,1.7,.05,0,0,-.45);bx(root,.3,.3,.3,vm('barrel'),1.4,.15,-.8,Math.PI/2,0,.4);bx(root,.03,.03,1.2,vm('rope'),1.0,.03,-.3,0,.3,0);
  for(let i=0;i<5;i++)wlTuft(root,(r()-.5)*2.4,0,(r()<.5?-1:1)*(1.3+r()*.3),r,false);return root;}
function rdTotem(s){const root=wlRoot(2),r=mulberry32((s||1)*1317),lg=vm('gBark');bx(root,.7,.2,.7,vm('dirt'),0,.1,0);bx(root,.24,3.4,.24,lg,0,1.7,0);
  for(const sd of[-1,1]){wlBeam(root,[0,3.2,0],[sd*.45,4,0],.14,lg);wlSkull(root,sd*.45,3.95,0,.9,sd*.3);}
  const pot=(y,ry)=>{const g=new THREE.Group();put(root,g,0,y,0,0,ry,0);bx(g,.03,.2,.03,vm('rope'),.18,0,0);bx(g,.26,.22,.26,vm('iron'),.18,-.2,0);bx(g,.2,.02,.2,vm('dark'),.18,-.08,0);};pot(2.6,0);pot(2.2,2.3);
  const hat=new THREE.Group();put(root,hat,0,3.2,0);bx(hat,.6,.04,.6,vm('hay'),0,.0,0);bx(hat,.32,.18,.32,vm('hay'),0,.11,0);
  {const g=new THREE.Group();put(root,g,0,1.8,.18);wlShield(g,.3);}bx(root,.3,.22,.32,vm('iron'),0,2.85,.0).position.z=-.24;
  for(let i=0;i<3;i++){const g=new THREE.Group();put(root,g,0,1.3,0,0,i*2.1,0);bx(g,.08,.5,.02,vm('woolRed'),.15,-.25,0);}for(let i=0;i<3;i++)bx(root,.12,.12,.02,vm('gPaint'),(i-1)*.1,1.1-i*.15,.13);
  wlBones(17).children.forEach(q=>{const p=q.clone();p.position.multiplyScalar(.7);root.add(p);});return root;}
function rdPlunderCart(s){const root=wlRoot(3),r=mulberry32((s||1)*1319);vCart(root,0,0,0,null).position.y=-.05;const y=.7;
  for(let i=0;i<4;i++)vSack(root,-.3+(i%2)*.5,-.7+Math.floor(i/2)*.5,y);vBarrel(root,.2,.5).position.y=y;vCrate(root,.5,-.3,y,.6,.2);{const c=new THREE.Group();put(root,c,-.3,y+.5,.6);hollow(c,.44,.3,.44,.03,vm('planksDark'));bx(c,.16,.16,.22,vm('woolWhite'),0,.1,0);bx(c,.06,.06,.06,vm('woolRed'),0,.2,.1);}
  bx(root,.06,1.6,.06,vm('gBark'),.5,y+.8,-.95);bx(root,.6,.5,.03,vm('hideDark'),.82,y+1.35,-.95);bx(root,.6,.08,.04,vm('gPaint'),.82,y+1.52,-.95);for(let i=0;i<8;i++)bx(root,.08,.04,.08,vm('gold'),(r()-.5)*.8,y+.03,(r()-.5)*1.6);return root;}
/* catapult: the arm is cocked back, Fire swings it up against the stop beam and throws the rock, Reload winches it down again */
function rdCatapult(s){const root=wlRoot(3.4),r=mulberry32((s||1)*1321),lg=vm('gBark'),lh=vm('gBarkH'),pv=[0,.75,.3];
  for(const sd of[-1,1]){vlog(root,.24,.24,2.8,'z',sd*.7,.45,0);const w=new THREE.Group();put(root,w,sd*.95,.45,-.9,0,Math.PI/2,0);wlWheel(w,.42);const w2=new THREE.Group();put(root,w2,sd*.95,.45,.9,0,Math.PI/2,0);wlWheel(w2,.42);}
  for(const z of[-1.2,.3,1.2])vlog(root,1.64,.2,.2,'x',0,.45,z);for(const sd of[-1,1]){vlog(root,.2,1.6,.2,'y',sd*.6,1.35,.95);wlBeam(root,[sd*.6,.55,1.25],[sd*.6,1.6,.95],.12,lh);}
  vlog(root,1.4,.24,.24,'x',0,2.1,.95);bx(root,.5,.3,.3,vm('fur'),0,2.1,.82);vlog(root,1.2,.36,.36,'x',0,pv[1],pv[2]);for(const sd of[-1,1])bx(root,.12,.4,.4,vm('rope'),sd*.3,pv[1],pv[2]);
  vlog(root,1.2,.26,.26,'x',0,.75,-1.0);for(const sd of[-1,1])bx(root,.12,.5,.5,lg,sd*.64,.75,-1.0);bx(root,.08,.5,.08,vm('iron'),.72,.75,-.75);
  const arm=new THREE.Group();arm.name='catapult_arm';put(root,arm,pv[0],pv[1],pv[2]);bx(arm,.22,2.3,.22,lg,0,1.15,0);const bk=new THREE.Group();put(arm,bk,0,2.3,0);hollow(bk,.56,.18,.56,.05,vm('planksDark'),0,-.05,0);
  const rock=new THREE.Group();rock.name='catapult_rock';root.add(rock);bx(rock,.36,.34,.36,vm('wRock'),0,0,0);bx(rock,.22,.2,.4,vm('wRock'),.05,.08,0);
  const A0=-1.42,A1=.28,L=2.3,tip=(a,off=.13)=>[pv[0],pv[1]+Math.cos(a)*L+Math.cos(a)*off,pv[2]+Math.sin(a)*L+Math.sin(a)*off];
  arm.rotation.x=A0;rock.position.set(...tip(A0,.18));
  const fire=t=>t<.38?A0+(A1-A0)*Math.pow(t/.38,2):A1-Math.sin((t-.38)*25)*.06*Math.exp(-(t-.38)*6);
  const rel=.3,ar=A0+(A1-A0)*Math.pow(rel/.38,2),p0=tip(ar,.18),w=2*(A1-A0)/.38*(rel/.38),v=[0,-Math.sin(ar)*w*L,Math.cos(ar)*w*L];
  propAnim(root,[arm,rock],[{name:'Fire',dur:2.2,hold:true,fn:(t,S)=>{const a=fire(t);S.catapult_arm={r:[a,0,0]};if(t<rel)S.catapult_rock={p:tip(a,.18),r:[0,0,0]};else{const dt=t-rel;S.catapult_rock={p:[p0[0],p0[1]+v[1]*dt-4.9*dt*dt,p0[2]+v[2]*dt],r:[dt*6,dt*3,0],s:dt>1.6?1e-4:1};}}},
    {name:'Reload',dur:3,next:'Idle',fn:(t,S)=>{const k=t/2.4,a=k>=1?A0:A1+(A0-A1)*(Math.floor(k*8)/8+paEase((k*8)%1)/8);S.catapult_arm={r:[a,0,0]};S.catapult_rock={p:tip(A0,.18+(t>2.4?0:.6)),r:[0,0,0],s:t<2.4?1e-4:paEase((t-2.4)/.4)};}}]);
  return root;}
/* battering ram under a hide roof, the log hung on chains */
function rdRam(s){const root=wlRoot(3.6),r=mulberry32((s||1)*1327),lg=vm('gBark');for(const sd of[-1,1]){vlog(root,.22,.22,3.6,'z',sd*.9,.45,0);for(const z of[-1.2,1.2]){const w=new THREE.Group();put(root,w,sd*1.15,.45,z,0,Math.PI/2,0);wlWheel(w,.42);}}
  for(const z of[-1.5,0,1.5])for(const sd of[-1,1])wlBeam(root,[sd*.9,.55,z],[0,2.6,z],.16,lg);vlog(root,.2,.2,3.6,'z',0,2.62,0);
  for(const sd of[-1,1]){const p=new THREE.Group();put(root,p,sd*.45,1.6,0,0,0,sd*.82);bx(p,.06,2.3,3.4,vm('hide'),0,0,0);}
  const sw=new THREE.Group();sw.name='ram_swing';put(root,sw,0,2.5,0);for(const z of[-.9,.9])for(let i=0;i<6;i++)bx(sw,i%2?.03:.06,.14,i%2?.06:.03,vm('iron'),0,-.07-i*.13,z);
  vlog(sw,.36,.36,3.8,'z',0,-.95,.2);const hd=new THREE.Group();put(sw,hd,0,-.95,2.2);bx(hd,.5,.5,.4,vm('iron'),0,0,0);bx(hd,.3,.3,.3,vm('iron'),0,0,.3);for(const sd of[-1,1]){bx(hd,.08,.06,.02,vm('dark'),sd*.1,.08,.205);const h=new THREE.Group();put(hd,h,sd*.25,.18,0,0,0,-sd*.6);bx(h,.08,.3,.08,vm('iron'),0,.15,0);}
  for(const sd of[-1,1])bx(sw,.1,.04,.4,vm('rope'),sd*.19,-.95,-1.2);
  propAnim(root,[sw],[{name:'Swing',dur:2.4,loop:true,fn:(t,S)=>{S.ram_swing={r:[Math.sin(t/2.4*Math.PI*2)*.32,0,0]};}},
    {name:'Strike',dur:2,next:'Idle',fn:(t,S)=>{const a=t<1?-.4*paEase(t):t<1.15?-.4+.7*((t-1)/.15):.3-.3*paEase((t-1.15)/.85)+Math.sin((t-1.15)*20)*.03*Math.exp(-(t-1.15)*5);S.ram_swing={r:[a,0,0]};}}]);return root;}
function rdField(){return vTile((x,z)=>wlNoise(x*1.4,z*1.4)>1.9?'burntStubble':'burntField',(root,at)=>{const r=mulberry32(131);for(let i=0;i<70;i++){const x=(r()-.5)*3.8,z=-1.8+Math.floor(r()*10)*.4;if(at(x,z)!=='burntField')continue;bx(root,.04,.12+r()*.12,.04,vm(r()<.5?'wCharBark':'hay'),x,T+.04,z);}
  for(let i=0;i<4;i++){const x=(r()-.5)*3,z=(r()-.5)*3;const e=bx(root,.3,.04,.3,EMBER,x,T-.01,z);e.castShadow=false;}});}
function rdBelongings(s){const root=wlRoot(2),r=mulberry32((s||1)*1331);{const g=new THREE.Group();put(root,g,-.3,.04,.2,0,.6,0);bx(g,.05,.05,1.6,vm('planks'),0,0,0);for(const x of[-.08,0,.08])bx(g,.03,.03,.3,vm('iron'),x,0,.92);bx(g,.22,.04,.04,vm('iron'),0,0,.78);}
  {const b=new THREE.Group();put(root,b,.6,.18,-.3,0,0,1.4);hollow(b,.4,.3,.36,.04,vm('wicker'),0,-.15,0);}for(let i=0;i<7;i++)bx(root,.09,.09,.09,vm('woolRed'),.9+r()*.6,.045,-.5+r()*.6);
  for(let i=0;i<5;i++)bx(root,.12+r()*.08,.04,.08,vm('clayPot'),-.8+r()*.6,.02,-.6+r()*.4,0,r()*3,0);{const h=new THREE.Group();put(root,h,.2,0,.8);bx(h,.5,.03,.5,vm('hay'),0,.015,0);bx(h,.28,.14,.28,vm('hay'),0,.1,0);}
  vSack(root,-.8,.7);bx(root,.4,.06,.36,vm('burlap'),-.2,.03,-.9,0,.4,0);return root;}
function rdSign(s){const root=wlRoot(1.6),r=mulberry32((s||1)*1337);vlog(root,.14,2.2,.14,'y',0,1.1,0);bx(root,1,.26,.06,vm('planksDark'),.45,1.85,.08,0,0,-.12);bx(root,.12,.12,.12,vm('rope'),0,1.85,.04);
  const g=new THREE.Group();put(root,g,-.6,.03,.5,Math.PI/2,0,.5);bx(g,.9,.24,.06,vm('planksDark'),0,0,0);for(let i=0;i<3;i++)bx(root,.07,.2,.02,vm('gPaint'),.3+i*.12,1.85,.115,0,0,.3);wlStuckSword(root,.4,-.4,1,.3);return root;}
WL('raid-cottage','raid','Burnt cottage',rdCottage,'Village cottage after the goblins came: soot-black plaster walls with broken tops, charred posts, the roof gone but for a few rafters (one fallen in), ash and charred beams inside, the door thrown down outside; the chimney still stands. Smouldering (embers, small flames and smoke rising, Idle loop) or burnt out.',{opts:[{key:'state',label:'State',choices:[['smoulder','Smouldering'],['out','Burnt out']],def:'smoulder'}],variants:true,defaultSeed:1});
WL('raid-burning','raid','Burning cottage',(s,o)=>rdCottage(s,Object.assign({},o,{burning:true})),'The same cottage with its blackened thatch roof ablaze: flames on the roof, in the windows and the doorway flicker and a column of smoke rises (Idle loop), with a strong orange light.',{variants:true,defaultSeed:1});
WL('raid-hut','raid','Smashed hut',rdHut,'Plank hut with one wall kicked in (boards lying outside), the roof sliding off to one side, the door torn off; a sack and a barrel left inside.',{variants:true,defaultSeed:1});
WL('raid-fence','raid','Smashed fence',rdFence,'4 m of village fence: one post snapped, one leaning, rails broken and lying in the grass.',{variants:true,defaultSeed:1});
WL('raid-well','raid','Broken well',rdWell,'Village well with part of its stone ring knocked down, one post snapped, the little roof thrown off to the side, the bucket and rope in the dirt.',{variants:true,defaultSeed:1});
WL('raid-totem','raid','Raid totem',rdTotem,'Forked stake the goblins planted in the village: two skulls on the prongs, a straw hat, a helmet, a shield, stolen pots, red rags and red hand marks, bones at its foot.',{variants:true,defaultSeed:1});
WL('raid-cart','raid','Plunder cart',rdPlunderCart,'Village cart loaded with plunder: sacks, a barrel, a crate, a hen in a basket, gold, and a goblin banner on a pole.',{variants:true,defaultSeed:1});
WL('raid-catapult','raid','Goblin catapult',rdCatapult,'Crude wheeled catapult of rough logs and rope with a hide-padded stop beam and a winch. Clips: Fire (the arm whips up and throws the rock) and Reload (winched down, a new rock in the bucket).',{});
WL('raid-ram','raid','Battering ram',rdRam,'Battering ram under a hide roof on four wheels, the log hung on chains with an iron horned head. Clips: Swing (loop) and Strike.',{});
WL('raid-field','raid','Burnt field',rdField,'Trampled, burnt field: dark furrows, charred stubble, ash and a few embers. 4 × 4 m tile, top at 0.8 m.',{groundR:-1});
WL('raid-belongings','raid','Dropped belongings',rdBelongings,'Things the villagers dropped as they fled: a pitchfork, a spilt basket of apples, broken pots, a straw hat and sacks.',{variants:true,defaultSeed:1});
WL('raid-sign','raid','Broken village sign',rdSign,'Village signpost with one board hanging crooked and daubed with red claw marks, the other board torn off, a goblin sword stuck beside it.',{variants:true,defaultSeed:1});
