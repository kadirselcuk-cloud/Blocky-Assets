/* ======================= SPELLS & EFFECTS part 2: fire, lightning, projectiles (engine in spells.js, see docs/SPELLS.md) ======================= */
const spShift=(at,dt)=>{const o={};for(const k in at)o[k]=at[k].map(e=>[e[0]+dt,e[1]]);return o;};
const spEvAt=(at,c,t)=>{let ev=null;for(const e of(at[c]||[]))if(t>=e[0])ev=e;return ev;};
/* explosion at events at={clip:[[t0,[x,y,z]],...]}: flash, fire burst, smoke, debris (stopping at o.floor), shock ring; size s */
function spBoom(K,o){const P=spPal(o.pal),s=o.s||1,par=o.par||K.root,at=o.at,seed=o.seed||101;
  const flash=K.g(par);spGeo().box(1,1,1,0,0,0).mesh(P.hot,flash);spGeo().box(1.5,1.5,1.5,0,0,0,.6,.6,0).mesh(P.addB,flash);
  const ring=K.g(par);spGeo().ring(1,.1,.05,0,32).mesh(P.br,ring);spGeo(true).ring(1,.3,.03,0,32).mesh(P.add,ring);
  spBurst(K,{pal:o.pal,par,at,n:Math.round(36+14*Math.min(2,s)),v:5.5,k:s,drag:3.5,life:.9,sz:.26,grow:1.2,seed,mats:[P.hot,P.br,P.br,P.mid,P.mid,P.dk]});
  if(o.smoke!==false)spBurst(K,{pal:o.pal,par,at:spShift(at,.15),n:Math.round(10+6*Math.min(2,s)),v:2.2,k:s,drag:1.2,g:-1.2,up:true,life:2,sz:.38,grow:2,seed:seed+1,mats:[P.sm,spM(P.c[4],'smoke',.5)]});
  if(o.debris!==false)spBurst(K,{pal:o.pal,par,at,n:12,v:4.5,k:s,drag:1.2,g:9.8,up:true,dir:[0,1,0],spread:1.4,life:1.7,sz:.11,keep:true,floor:o.floor??0,seed:seed+2,mats:[spM('#2a2220','solid'),spM('#3a3230','solid'),P.dk]});
  K.add((S,t,A,c)=>{const ev=spEvAt(at,c,t),tt=ev?t-ev[0]:9,fl=tt<.35?Math.sin(Math.PI*tt/.35):0,ru=tt/.55;
    S[flash.name]=fl>1e-3?{p:ev[1],s:fl*1.5*s}:spHid;S[ring.name]=ru<1?{p:[ev[1][0],Math.max(o.floor??-99,ev[1][1]-.2*s)+.04,ev[1][2]],s:[.2+3.2*s*ru,1,.2+3.2*s*ru]}:spHid;});}
/* a trail of cubes streaming back along -z from the origin (in the parent's frame): len, n, mats, sz, wob, fall (drops) */
function spTrail(K,o){return spPS(K,{n:o.n||16,seed:o.seed||111,par:o.par,init:(r,i)=>({mat:o.mats[i%o.mats.length],P:(o.life||.5)*(.8+.4*r()),ox:(r()-.5)*(o.w||.1),oy:(r()-.5)*(o.w||.1),sw:r()*SP_TAU,sz:(o.sz||.07)*(.7+.6*r())}),
  f:(q,u,t,A)=>A<=1e-3?spHid:{p:[q.ox*(1+u*(o.spread||1.5))+Math.sin(q.sw+u*7)*(o.wob||.03),q.oy*(1+u*(o.spread||1.5))+Math.cos(q.sw+u*6)*(o.wob||.03)-(o.fall||0)*u*u+(o.rise||0)*u,(o.z0||0)-(o.len||1)*u],
    s:q.sz*A*(o.grow?(.4+o.grow*u)*Math.sin(Math.PI*Math.min(1,u*1.1)):(1-u*.85))}});}

/* ======================= fire ======================= */
const SP_FSIZE={key:'size',label:'Size',choices:[['s','Small'],['m','Medium'],['l','Large']],def:'m'},spFk=o=>({s:.5,m:1,l:2.2}[o.size]||1);
function fxFire(_s,o){const root=new THREE.Group();root.userData.lights=[];const k=spFk(o),P=spPal(o.col),K=spKit(root,3),r=mulberry32(5),bed=spGeo(),bd=spGeo();
  for(let i=0;i<Math.round(12+k*8);i++){const d=spInDisc(r,.34*k),w=(.07+.06*r())*k;(r()<.6?bed:bd).box(w,.03*Math.min(k,1.5),w,d[0],.015*Math.min(k,1.5),d[1],0,r()*1.5,0);}bed.mesh(P.mid,root);bd.mesh(P.dk,root);
  spFire(K,{pal:o.col,n:Math.round(36+k*16),R:.26*k,h:.95*k,sz:.15*k,smoke:Math.round(3+3*k),embers:Math.round(6+5*k),seed:7});
  K.light(P.l,1.4,6*k+3,0,.5*k,0);spFrame(root,[.5*k,1.1*k,.5*k,1.1*k]);root.userData.ground=Math.max(1.6,1.6*k);return spFinish(K,{start:.8,end:1});}
FX('fire','fire','Magic fire',fxFire,'A fire burning on the ground with no fuel: cube flames rising and drawing in, a glowing ember bed, smoke and embers. Clips: Idle, Start, End.',{opts:[spCol(['fire','hell','fel','soul','frost','arcane','shadow','holy']),SP_FSIZE]});

function fxFirePillar(_s,o){const root=new THREE.Group();root.userData.lights=[];const k=spFk(o),P=spPal(o.col),K=spKit(root,3),R=.55*k,H=4.5*k,r=mulberry32(9);
  const sc=spGeo();sc.disc(R*1.7,.004,.008,.12*k).mesh(spM(P.c[4],'solid',.95),root);const cr=spGeo();
  for(let i=0;i<9;i++){let a=i/9*SP_TAU+r()*.3,d=R*.4;for(let j=0;j<4;j++){const a2=a+(r()-.5)*.6,d2=d+R*(.3+.2*r());cr.flat(Math.sin(a)*d,Math.cos(a)*d,Math.sin(a2)*d2,Math.cos(a2)*d2,.06*k,.02,.012);a=a2;d=d2;}}cr.mesh(P.br,root);
  const env=(A,c,t)=>c==='Erupt'?(t<.25?1.5*t/.25:t<1.6?1.5-.5*spCl((t-.25)/.4):1-spCl((t-1.6)/.8)):A;
  spFire(K,{pal:o.col,n:Math.round(110+30*k),R,h:H*.42,sz:.3*k,conv:.2,life:.8,smoke:8,embers:16,seed:13,A:env,em:r=>{const d=spInDisc(r,R),y=Math.pow(r(),1.3)*H*.68;return[d[0]*(1-.35*y/H),y,d[1]*(1-.35*y/H)];}});
  spPS(K,{n:24,seed:14,init:(r,i)=>({mat:i%3?P.br:P.hot,a0:r()*SP_TAU,P:1,sz:.12*k*(.7+.6*r())}),
    f:(q,u,t,A,c)=>{const a=env(A,c,t);if(a<=1e-3)return spHid;const an=q.a0+SP_TAU*2*u,rr=R*(1.15-.5*u);return{p:[Math.sin(an)*rr,H*1.05*u*Math.min(1,a),Math.cos(an)*rr],s:q.sz*a*spEnv(u,.1)};}});
  spBurst(K,{pal:o.col,clip:'Erupt',n:30,y:.2,v:5*k,up:true,dir:[0,1,0],spread:1.2,g:6,life:1.1,sz:.14*k,seed:15});
  K.light(P.l,1.6,8*k+4,0,1.5*k,0);K.lf=(t,A,c)=>env(A,c,t)*(.85+.1*Math.sin(spW(t,3,9)));spFrame(root,[R*1.6,H*.55,R*1.6,H*.55]);root.userData.ground=Math.max(2,R*2.6);
  return spFinish(K,{start:.6,end:1,extra:[{name:'Erupt',dur:2.6,next:'Idle',fn:(t,S,step)=>step(S,t,1,'Erupt')}]});}
FX('fire-pillar','fire','Pillar of fire',fxFirePillar,'A column of fire roaring up out of glowing cracks in scorched ground, with cubes spiralling up its sides, smoke and embers. Clips: Idle, Start, End, Erupt (a one-shot blast that bursts up, throws sparks and dies away).',{opts:[spCol(['fire','hell','fel','soul','holy','arcane','shadow']),SP_FSIZE]});

function fxFireRing(_s,o){const root=new THREE.Group();root.userData.lights=[];const R=spR(o)*.8,P=spPal(o.col),K=spKit(root,3),h=Math.min(2,.9+R*.25);
  spGeo().ring(R,.3,.02,.01,Math.round(24+R*8)).mesh(spM(P.c[4],'solid',.95),root);spGeo().ring(R,.12,.03,.02,Math.round(24+R*8)).mesh(P.mid,root);
  const ang=e=>(Math.atan2(e[0],e[2])/SP_TAU+1)%1,Ae=(e,A,c)=>c==='Start'?spCl((A*1.25-ang(e))*5):A;
  spFire(K,{pal:o.col,n:Math.round(50+R*40),h,sz:.26,conv:.3,smoke:Math.round(6+R*3),embers:Math.round(6+R*4),seed:17,Ae,em:r=>{const a=r()*SP_TAU,d=R+(r()-.5)*.18;return[Math.sin(a)*d,0,Math.cos(a)*d];}});
  K.light(P.l,1.4,R*3+4,0,.8,0);spFrame(root,[R+.3,h*.6,R+.3,h*.6]);root.userData.ground=Math.max(2.4,R*1.4);return spFinish(K,{start:1.5,end:1});}
FX('fire-ring','fire','Ring of fire',fxFireRing,'A wall of flames burning in a circle on a smouldering line, to trap an enemy or close an arena. Clips: Idle, Start (the ring catches fire running round the circle), End.',{opts:[spCol(['fire','hell','fel','soul','arcane','shadow']),SP_SIZE]});

/* Rain of fire: fireballs fall at a slant onto an area, each with a trail, a flash, a small burst and smoke where it lands */
function fxFireRain(_s,o){const root=new THREE.Group();root.userData.lights=[];const R=spR(o),P=spPal(o.col),K=spKit(root,4),r=mulberry32(19),Nm=Math.min(20,Math.round(7+R*3)),dir=new THREE.Vector3(.35,-1,.25).normalize(),L=13,Tf=.75,M=[];
  const glow=spGeo();
  for(let i=0;i<Nm;i++){const d=spInDisc(r,R),P_=K.D/(r()<.6?1:2),m={x:d[0],z:d[1],P:P_,ph:r(),head:[K.p(P.hot),K.p(P.br),K.p(P.mid)],tr:[],deb:[],sm:[]};
    for(let j=0;j<6;j++)m.tr.push(K.p([P.br,P.mid,P.mid,P.dk,P.dk,P.sm][j]));for(let j=0;j<5;j++)m.deb.push({m:K.p(j<2?P.hot:P.br),d:new THREE.Vector3(r()-.5,.4+r()*.6,r()-.5).normalize(),v:2+r()*2});
    for(let j=0;j<2;j++)m.sm.push(K.p(P.sm));glow.box(.18,.012,.18,d[0],.01,d[1]);M.push(m);}
  const sc2=spGeo();for(const m of M){sc2.box(.5,.008,.36,m.x,.004,m.z,0,.4,0);sc2.box(.36,.009,.5,m.x,.0045,m.z,0,.4,0);}sc2.mesh(spM(P.c[4],'solid',.95),root);glow.mesh(P.dk,root);
  K.add((S,t,A,c)=>{for(const m of M){const u=spTau(t,K.D,m.P,m.ph)*m.P,on=A>.5||(c==='Start'&&A>m.ph);
      if(u<Tf&&on){const k=u/Tf,p=[m.x-dir.x*L*(1-k),-dir.y*L*(1-k),m.z-dir.z*L*(1-k)];
        m.head.forEach((h,j)=>S[h.name]={p:[p[0]+(j?.05*Math.sin(u*40+j):0),p[1]+.25+(j?.05*Math.cos(u*37+j):0),p[2]],s:[.3,.42,.52][j]});
        m.tr.forEach((h,j)=>{const b=(j+1)*.32;S[h.name]={p:[p[0]-dir.x*b+.06*Math.sin(u*30+j),p[1]+.25-dir.y*b,p[2]-dir.z*b+.06*Math.cos(u*33+j)],s:.4*(1-j*.12)};});}
      else{m.head.forEach(h=>S[h.name]=spHid);m.tr.forEach(h=>S[h.name]=spHid);}
      const tt=u-Tf;m.deb.forEach(q=>{if(tt<0||tt>.6||!on){S[q.m.name]=spHid;return;}const dist=q.v*tt;S[q.m.name]={p:[m.x+q.d.x*dist,Math.max(.05,q.d.y*dist*1.5-4.9*tt*tt+.1),m.z+q.d.z*dist],s:.12*(1-tt/.6)};});
      m.sm.forEach((q,j)=>{const ts=tt-.05*j;if(ts<0||ts>1.2||!on){S[q.name]=spHid;return;}S[q.name]={p:[m.x+.1*j,.3+ts*1.4,m.z-.1*j],s:.45*Math.sin(Math.PI*ts/1.2)};});}});
  K.light(P.l,1.4,R*3+6,0,2,0);K.lf=(t,A)=>A*(.75+.25*Math.sin(spW(t,4,11)));spFrame(root,[R+1,5,R+1,5]);root.userData.ground=Math.max(3,R*1.4);return spFinish(K,{start:2,end:1});}
FX('fire-rain','fire','Rain of fire',fxFireRain,'Fireballs raining down at a slant onto an area, each with a fiery trail, landing in a flash with sparks and a puff of smoke on scorched ground. Clips: Idle, Start, End.',{opts:[spCol(['fire','hell','fel','soul','arcane']),SP_SIZE]});

/* Meteor strike: a burning rock falls from the sky and explodes, leaving a glowing crater that smokes */
function fxMeteor(_s,o){const root=new THREE.Group();root.userData.lights=[];const P=spPal(o.col),K=spKit(root,5),r=mulberry32(23),T0=.8,Tf=1.1,ti=T0+Tf,from=new THREE.Vector3(-9,24,-7);
  const rock=K.g(root),rk=spGeo(),rg=spGeo();for(let i=0;i<10;i++){const v=spInBall(r,.35),w=.35+.3*r();rk.box(w,w,w,v[0],v[1],v[2],r(),r(),r());}rk.mesh(spM('#2a2220','solid'),rock);
  for(let i=0;i<8;i++){const v=spInBall(r,.45),w=.12+.1*r();rg.box(w,w,w,v[0],v[1],v[2],r(),r(),0);}rg.mesh(P.mid,rock);
  const tr=[];for(let j=0;j<22;j++)tr.push({m:K.p([P.hot,P.br,P.br,P.mid,P.mid,P.dk][Math.min(5,Math.floor(j/4))]),j,o:[(r()-.5)*.6,(r()-.5)*.6,(r()-.5)*.6]});const smk=[];for(let j=0;j<10;j++)smk.push({m:K.p(P.sm),j,o:[(r()-.5)*.8,(r()-.5)*.8,(r()-.5)*.8]});
  /* the crater: a ring of thrown-up rubble and a glowing pit */
  const cra=K.g(root),cg=spGeo(),cl=spGeo();for(let i=0;i<22;i++){const a=i/22*SP_TAU+r()*.2,d=1.5+r()*.5,w=.3+.3*r();cg.box(w,.2+.25*r(),w,Math.sin(a)*d,.1,Math.cos(a)*d,0,r(),.2*(r()-.5));}cg.disc(1.6,.005,.01,.2);cg.mesh(spM('#2e2624','solid'),cra);
  cl.disc(.9,.012,.012,.15);for(let i=0;i<7;i++){const a=r()*SP_TAU;cl.flat(Math.sin(a)*.5,Math.cos(a)*.5,Math.sin(a)*1.4,Math.cos(a)*1.4,.08,.02,.014);}cl.mesh(P.mid,cra);
  spRise(K,{pal:o.col,n:14,R:1.2,h:3,life:2.4,sz:.4,wig:.3,mats:[P.sm,spM(P.c[4],'smoke',.45)],seed:24,A:(A,c,t)=>t>ti+.3?A*(c==='Strike'?1-spCl((t-4.2)/.8):1):0});
  spFire(K,{pal:o.col,n:16,R:.6,h:.5,sz:.12,seed:25,A:(A,c,t)=>t>ti+.2?(c==='Strike'?1-spCl((t-3.5)/1.2):1):0});
  const at={Idle:[[ti,[0,.4,0]]],Strike:[[ti,[0,.4,0]]]};spBoom(K,{pal:o.col,at,s:2.2,seed:26});
  const posAt=k=>new THREE.Vector3().lerpVectors(from,new THREE.Vector3(0,.4,0),k);
  K.add((S,t,A,c)=>{const k=(t-T0)/Tf;if(k>=0&&k<1){const p=posAt(k);S[rock.name]={p:p.toArray(),s:1,r:[t*4,t*3,0]};
      tr.forEach(q=>{const b=posAt(k-(q.j+1)*.012-.004*Math.sin(t*50+q.j));S[q.m.name]={p:[b.x+q.o[0],b.y+q.o[1],b.z+q.o[2]],s:.55*(1-q.j/24)};});
      smk.forEach(q=>{const b=posAt(k-(q.j+3)*.03);S[q.m.name]={p:[b.x+q.o[0],b.y+q.o[1],b.z+q.o[2]],s:.6+q.j*.06};});}
    else{S[rock.name]=spHid;tr.forEach(q=>S[q.m.name]=spHid);smk.forEach(q=>S[q.m.name]=spHid);}
    S[cra.name]=t>=ti?{s:1}:spHid;});
  K.light(P.l,1.2,14,0,1.5,0);K.lf=(t,A,c)=>{const tt=t-ti;return tt<0?.3+(t>T0?.7*(t-T0)/Tf:0):tt<.4?4-6*tt:Math.max(.5,1.6-tt*.3);};
  spFrame(root,[2.5,2.5,2.5,2.5]);root.userData.ground=4;
  return spFinish(K,{start:false,end:false,extra:[{name:'Strike',dur:5,hold:true,fn:(t,S,step)=>step(S,t,1,'Strike')}]});}
FX('meteor','fire','Meteor strike',fxMeteor,'A burning rock falls from the sky trailing fire and smoke and explodes on impact (flash, fire burst, shock ring, flying debris), leaving a crater of rubble with a glowing pit that smokes. Clips: Idle (repeats), Strike (once, the crater stays).',
  {opts:[spCol(['fire','hell','fel','arcane','soul'])]});

function fxExplosion(_s,o){const root=new THREE.Group();root.userData.lights=[];const k=spFk(o)*1.2,P=spPal(o.col),K=spKit(root,3);
  spGeo().disc(.9*k,.004,.008,.15*k).mesh(spM(P.c[4],'solid',.95),root);
  spBoom(K,{pal:o.col,at:{Idle:[[.2,[0,.5*k,0]]],Explode:[[.05,[0,.5*k,0]]]},s:k,seed:31});
  K.light(P.l,.2,10*k+4,0,1*k,0);K.lf=(t,A,c)=>{const tt=t-(c==='Explode'?.05:.2);return tt<0?1e-4:tt<.5?6*(1-tt/.5)+.2:.2;};spFrame(root,[1.6*k,1.4*k,1.6*k,1.2*k]);root.userData.ground=Math.max(2,2.2*k);
  return spFinish(K,{start:false,end:false,extra:[{name:'Explode',dur:2.6,next:'Idle',fn:(t,S,step)=>step(S,t,1,'Explode')}]});}
FX('explosion','fire','Explosion',fxExplosion,'A fireball explosion: a white-hot flash, a burst of fire cubes, a shock ring, flying debris and a cloud of smoke rising off scorched ground. Clips: Idle (repeats every 3 s), Explode (once).',{opts:[spCol(['fire','hell','fel','arcane','soul','frost','shadow','holy']),SP_FSIZE]});

/* Fire breath: a cone of fire streaming along +z from the origin (put it in a mouth) */
function fxFireBreath(_s,o){const{root,A}=spRootFor(o,1.3,4,[.6,.6,1,0]);const L={s:3,m:5,l:8}[o.size]||5,P=spPal(o.col),K=spKit(root,2);A.children.find(c=>c.name==='fx_frame').position.z=L/2;A.children.find(c=>c.name==='fx_frame').scale.set(L*.5,L*.35,L);
  const roles=[[.12,P.hot,.35,.5],[.28,P.br,.6,.8],[.32,P.mid,.9,1],[.18,P.dk,1,1.1],[.1,P.sm,1.15,1.4]];
  spPS(K,{n:Math.round(60+L*10),seed:41,par:A,init:(r,i)=>{const k=(i+.5)/Math.round(60+L*10);let a=0,ro=roles[4];for(const x of roles){a+=x[0];if(k<a){ro=x;break;}}
      return{mat:ro[1],rl:ro[2]*(.85+.3*r()),sz:ro[3]*(.7+.6*r()),P:(.3+.4*ro[2])*(.85+.3*r()),dx:(r()-.5)*2,dy:(r()-.5)*2,sw:r()*SP_TAU};},
    f:(q,u,t,A_)=>{if(A_<=1e-3)return spHid;const z=L*q.rl*u*(.25+.75*A_),sp=.06+z*.2;return{p:[q.dx*sp*.6+.05*Math.sin(q.sw+u*9),q.dy*sp*.45+z*z*.012+.1*u,z],s:(.06+.07*z)*q.sz*A_*spEnv(u,.08)};}});
  K.light(P.l,1.6,L+4,0,.2,L*.4,A);K.lf=(t,A_)=>A_*(.8+.12*Math.sin(spW(t,2,13))+.08*Math.sin(spW(t,2,7)));
  return spFinish(K,{start:.5,end:.5});}
FX('fire-breath','fire','Fire breath',fxFireBreath,'A roaring cone of fire streaming along +z from the origin (place it in a dragon\'s, hellhound\'s or efreet\'s mouth): white-hot near the mouth, darker and smoky at the end. Clips: Idle, Start (the jet shoots out), End.',
  {opts:[spCol(['fire','hell','fel','soul','frost','shadow','arcane']),{key:'size',label:'Length',choices:[['s','3 m'],['m','5 m'],['l','8 m']],def:'m'},SP_MOUNT]});

function fxBurningGround(_s,o){const root=new THREE.Group();root.userData.lights=[];const R=spR(o)*.8,P=spPal(o.col),K=spKit(root,3),r=mulberry32(43);
  spGeo().disc(R*1.05,.004,.008,.2).mesh(spM(P.c[4],'solid',.95),root);const cr=spGeo(),cb=spGeo();
  for(let i=0;i<Math.round(6+R*4);i++){let x=(r()-.5)*R,z=(r()-.5)*R,a=r()*SP_TAU;for(let j=0;j<5;j++){a+=(r()-.5)*1.4;const x2=x+Math.sin(a)*.35,z2=z+Math.cos(a)*.35;if(Math.hypot(x2,z2)>R*.95)break;(j%2?cb:cr).flat(x,z,x2,z2,.07,.02,.012);x=x2;z=z2;}}cr.mesh(P.mid,root);cb.mesh(P.br,root);
  const Ae=(e,A,c)=>c==='Start'?spCl((A*1.4-Math.hypot(e[0],e[2])/R)*4):A;const nf=Math.round(5+R*4);
  for(let i=0;i<nf;i++){const d=spInDisc(r,R*.85),hh=.3+.5*r();spFire(K,{pal:o.col,n:Math.round(8+hh*8),R:.12,h:hh,sz:.1,x:d[0],z:d[1],seed:44+i,smoke:i%3?0:2,embers:2,Ae:(e,A,c)=>Ae([d[0],0,d[1]],A,c)});}
  K.light(P.l,1.2,R*3+3,0,.6,0);spFrame(root,[R,.6,R,.5]);root.userData.ground=Math.max(2.2,R*1.4);return spFinish(K,{start:1.4,end:1});}
FX('burning-ground','fire','Burning ground',fxBurningGround,'A patch of scorched ground with glowing cracks and small fires licking up all over it (a fire trap, the aftermath of a spell, a burning field). Clips: Idle, Start (spreads out from the centre), End.',{opts:[spCol(['fire','hell','fel','soul','shadow','poison']),SP_SIZE]});

/* ======================= lightning ======================= */
const spFlick=tt=>(tt>=0&&tt<.05)||(tt>=.1&&tt<.17)||(tt>=.23&&tt<.28);
function fxLightningStrike(_s,o){const root=new THREE.Group();root.userData.lights=[];const P=spPal(o.col),K=spKit(root,3),H=16;
  const evs={Idle:[[.4,0],[1.9,1]],Strike:[[.3,2]]},cur=(c,t)=>{let e=null;for(const x of(evs[c]||[]))if(t>=x[0])e=x;return e;};
  spBolts(K,{pal:o.col,n:4,w:.1,jag:.1,lv:6,branch:5,from:(r,k)=>[(r()-.5)*5,H,(r()-.5)*5],to:r=>[(r()-.5)*.3,0,(r()-.5)*.3],seed:51,
    vis:(k,t,A,c)=>{const e=cur(c,t);if(!e)return 0;const tt=t-e[0],main=e[1];return spFlick(tt)&&(k===main||(k===3&&tt>=.1&&tt<.17))?1:0;}});
  spGeo().disc(.7,.004,.008,.12).mesh(spM('#1a1614','solid',.95),root);const gl=K.g(root);spGeo().disc(.45,.012,.01,.1).mesh(P.br,gl);spGeo().disc(.9,.008,.01,.15).mesh(P.add,gl);
  spBurst(K,{pal:o.col,at:{Idle:[[.4,[0,.05,0]],[1.9,[0,.05,0]]],Strike:[[.3,[0,.05,0]]]},n:26,v:4,up:true,g:6,drag:1,life:.8,sz:.06,floor:0,seed:52,mats:[P.hot,P.br,P.br,P.mid]});
  spRise(K,{pal:o.col,n:6,R:.3,h:1.5,life:1.5,sz:.25,mats:[spM('#3a3a40','smoke',.5)],seed:53,A:(A,c,t)=>{const e=cur(c,t);return e&&t-e[0]<1.4?1:0;}});
  K.add((S,t,A,c)=>{const e=cur(c,t),tt=e?t-e[0]:9;S[gl.name]=tt<1?{s:Math.max(1e-4,1-tt)}:spHid;});
  K.light(P.l,.3,30,0,4,0);K.lf=(t,A,c)=>{const e=cur(c,t);return e&&spFlick(t-e[0])?8:.05;};spFrame(root,[2.5,H/2,2.5,H/2]);root.userData.ground=4;
  return spFinish(K,{start:false,end:false,extra:[{name:'Strike',dur:2,next:'Idle',fn:(t,S,step)=>step(S,t,1,'Strike')}]});}
FX('lightning-strike','lightning','Lightning strike',fxLightningStrike,'A forked bolt of lightning 16 m tall striking the ground: it flickers three times, sparks fly, the ground glows and smokes. Clips: Idle (two strikes every 3 s), Strike (once).',{opts:[spCol(['storm','arcane','fel','blood','holy','shadow'])]});

/* chain and beam: from a hand (stand) to training dummies */
function spDummyAt(root,x,z,ry){if(typeof vDummy==='function')vDummy(root,x,z,ry);}
function fxChainLightning(_s,o){const st=o.mount!=='bare',{root,A}=spRootFor(o,spHandStand,6,[.4,.4,.4,0]);const P=spPal(o.col),K=spKit(root,2),dy=st?.22:0,T=[[0,0,0],[1.4,dy,3.6],[-1.2,dy,6.4],[.8,dy,9.2]];
  if(st)for(let i=1;i<4;i++)spDummyAt(root,T[i][0],T[i][2],(i-2)*.4);const fr=A.children.find(c=>c.name==='fx_frame');fr.position.set(0,0,4.6);fr.scale.set(3.5,1.6,10.5);
  const links=[];for(let i=0;i<3;i++)links.push(spBolts(K,{pal:o.col,par:A,n:3,w:.035,jag:.16,lv:5,branch:2,from:()=>T[i],to:()=>T[i+1],seed:60+i,
    vis:(k,t,A_,c)=>{const on=c==='Cast'?(t>.1+i*.18&&t<1.1):A_>.5;return on&&Math.floor(t*18+i*5)%3===k?1:0;}}));
  for(let i=1;i<4;i++){const g=K.g(A,...T[i]);spGeo().box(.18,.18,.18,0,0,0,.6,.6,0).mesh(P.hot,g);spGeo().box(.4,.4,.4,0,0,0).mesh(P.add,g);
    K.add((S,t,A_,c)=>{const on=c==='Cast'?(t>.1+(i-1)*.18&&t<1.1):A_>.5;S[g.name]=on?{s:.7+.4*spHash(Math.floor(t*18)+i*31),r:[t*9,t*7,0]}:spHid;});
    spBurst(K,{pal:o.col,par:A,at:{Cast:[[.1+(i-1)*.18,T[i]]]},n:12,v:3,life:.5,sz:.04,seed:70+i});}
  K.light(P.l,1,8,0,0,2,A);K.lf=(t,A_,c)=>(c==='Cast'?(t>.1&&t<1.1?2:0):A_)*(.5+.6*spHash(Math.floor(t*18)%36));
  return spFinish(K,{start:.3,end:.3,extra:[{name:'Cast',dur:1.6,next:'Idle',fn:(t,S,step)=>step(S,t,1,'Cast')}]});}
FX('chain-lightning','lightning','Chain lightning',fxChainLightning,'Lightning that leaps from the caster\'s hand to three targets in turn (training dummies in the preview), crackling along each link. Clips: Idle (all links crackle), Start, End, Cast (jumps from target to target).',{opts:[spCol(['storm','arcane','fel','blood','shadow']),SP_MOUNT]});

function fxLightningBeam(_s,o){const st=o.mount!=='bare',{root,A}=spRootFor(o,spHandStand,5,[.4,.4,.4,0]);const L={s:4,m:7,l:11}[o.size]||7,P=spPal(o.col),K=spKit(root,2);
  if(st)spDummyAt(root,0,L+.25,0);const fr=A.children.find(c=>c.name==='fx_frame');fr.position.set(0,0,L/2);fr.scale.set(2,1.4,L+1);
  const core=K.g(A);spGeo().box(.04,.04,L,0,0,L/2).mesh(P.hot,core);spGeo(true).box(.16,.16,L,0,0,L/2).mesh(P.add,core);
  spBolts(K,{pal:o.col,par:A,n:6,w:.03,jag:.07,lv:6,branch:3,from:()=>[0,0,0],to:()=>[0,0,L],rate:20,duty:.2,seed:81});
  spTrail(K,{par:A,n:20,len:-L,z0:0,mats:[P.hot,P.br],sz:.035,w:.15,spread:.5,life:.3,seed:82});
  const hit=K.g(A,0,0,L);spGeo().box(.22,.22,.22,0,0,0,.6,.6,0).mesh(P.hot,hit);spGeo().box(.5,.5,.5).mesh(P.add,hit);
  spPS(K,{n:14,seed:83,par:A,init:r=>({mat:r()<.5?P.hot:P.br,d:new THREE.Vector3(r()-.5,r()-.3,-r()).normalize(),P:.4,sz:.04}),f:(q,u,t,a)=>a<=1e-3?spHid:{p:[q.d.x*u*.8,q.d.y*u*.8-u*u*.4,L+q.d.z*u*.8],s:q.sz*(1-u)*a}});
  K.add((S,t,A_)=>{S[core.name]={s:A_>1e-3?[.6+.6*spHash(Math.floor(t*20)%60),.6+.6*spHash(Math.floor(t*20)%60+7),Math.max(1e-4,A_)]:1e-4};S[hit.name]=A_>.95?{s:.7+.5*spHash(Math.floor(t*20)%60+3),r:[t*8,t*6,0]}:spHid;});
  K.light(P.l,1.2,L+4,0,0,L*.5,A);K.lf=(t,A_)=>A_*(.6+.5*spHash(Math.floor(t*20)%40));
  return spFinish(K,{start:.3,end:.3});}
FX('lightning-beam','lightning','Lightning beam',fxLightningBeam,'A continuous beam of lightning from the hand along +z, a straight bright core wrapped in crackling forks, sparks where it hits. Clips: Idle, Start (the beam shoots out), End.',
  {opts:[spCol(['storm','arcane','fel','blood','holy','shadow']),{key:'size',label:'Length',choices:[['s','4 m'],['m','7 m'],['l','11 m']],def:'m'},SP_MOUNT]});

function fxStormCloud(_s,o){const root=new THREE.Group();root.userData.lights=[];const R={s:2.4,m:4,l:7}[o.size]||4,P=spPal(o.col),K=spKit(root,4),H=10,r=mulberry32(91);
  const cloud=K.g(root,0,H,0),sh=[spGeo(),spGeo(),spGeo()];for(let i=0;i<Math.round(30+R*8);i++){const v=spInBall(r,1),w=(.6+.8*r())*R*.32;sh[Math.floor(r()*3)].box(w*1.3,w*.7,w,v[0]*R,v[1]*R*.22+(v[1]<0?0:R*.06),v[2]*R*.75);}
  sh[0].mesh(spM('#3a3c44','solid',1),cloud);sh[1].mesh(spM('#4a4c56','solid',1),cloud);sh[2].mesh(spM('#2c2e34','solid',1),cloud);
  const flashes=[];for(let i=0;i<6;i++){const v=spInBall(r,1),g=K.g(cloud,v[0]*R*.6,-R*.05,v[2]*R*.45);spGeo().box(R*.35,R*.12,R*.3).mesh(P.softB,g);flashes.push(g);}
  const sl=t=>Math.floor(t*12+1e-6),ev=t=>{const s=sl(t),h=spHash(s%48+500);return h<.16?Math.floor(h/.16*4):-1;};
  spBolts(K,{pal:o.col,n:4,w:.07,jag:.12,lv:6,branch:3,from:r=>[(r()-.5)*R,H-R*.1,(r()-.5)*R*.6],to:r=>[(r()-.5)*R*.9,0,(r()-.5)*R*.7],seed:92,vis:(k,t)=>ev(t)===k?1:0});
  K.add((S,t,A)=>{S[cloud.name]={p:[0,H+.15*Math.sin(spW(t,4,1)),0],s:Math.max(1e-4,A)};flashes.forEach((g,i)=>{const f=ev(t)>=0||spHash(sl(t)*7+i)<.06;S[g.name]=f&&A>.5?{s:1}:spHid;});});
  spRise(K,{pal:o.col,n:Math.round(40+R*10),R:R*.8,h:-H+.6,life:.7,sz:.04,sv:9,y:H-.4,wig:0,pow:1.6,mats:[spM('#7cc4f0','soft',.5),spM('#ccecfc','soft',.4)],seed:93});
  K.light(P.l,.4,30,0,H*.6,0);K.lf=(t,A)=>A*(ev(t)>=0?6:.3);spFrame(root,[R,H*.6,R,H*.6]);root.userData.ground=Math.max(3,R*1.1);return spFinish(K,{start:1,end:1});}
FX('storm-cloud','lightning','Storm cloud',fxStormCloud,'A dark storm cloud 10 m up, flashing from inside, pouring rain and striking the ground with forked lightning. Clips: Idle, Start, End.',{opts:[spCol(['storm','arcane','fel','blood']),{key:'size',label:'Size',choices:[['s','Small'],['m','Medium'],['l','Large']],def:'m'}]});

/* ======================= projectiles: content in `body`, flying along +z ======================= */
function spProjRoot(o,D=2){const r=spRootFor(o,1.3,7,[.5,.45,1,0]);const fr=r.A.children.find(c=>c.name==='fx_frame');fr.position.z=-.5;const K=spKit(r.root,D);const body=K.g(r.A);return{root:r.root,A:r.A,K,body};}
/* Idle: in place; Impact: the body vanishes into the impact; Shot: (preview) flies 6 m and hits */
function spProjFinish(K,body,A,impact,o={}){const at={Impact:[[.03,[0,0,0]]],Shot:[[.8,[0,0,6]]]};impact(at);
  K.add((S,t,A_,c)=>{if(c==='Shot'){const u=t/.8;S[body.name]=u<1?{p:[0,0,6*u],s:1}:spHid;}else if(c==='Impact')S[body.name]=t<.03?{p:[0,0,0],s:1}:spHid;else S[body.name]={p:[0,0,0],s:Math.max(1e-4,A_)};});
  const lf0=K.lf;K.lf=(t,A_,c)=>{const ev=spEvAt(at,c,t),tt=ev?t-ev[0]:9;return(c==='Impact'?(t<.03?1:0):c==='Shot'?(t<.8?1:0):(lf0?lf0(t,A_,c):A_))+(tt<.5?4*(1-tt/.5):0);};
  return spFinish(K,{start:.3,end:.3,extra:[{name:'Impact',dur:2.2,hold:true,fn:(t,S,step)=>step(S,t,1,'Impact')},{name:'Shot',dur:3,next:'Idle',fn:(t,S,step)=>step(S,t,1,'Shot')}]});}
const SP_PCLIPS='Clips: Idle (in flight, in place: move the object in your game), Start, End, Impact (it bursts and vanishes, held), Shot (preview: flies 6 m along +z and hits).';

function fxFireball(_s,o){const{root,A,K,body}=spProjRoot(o),P=spPal(o.col);
  spOrb(K,{pal:o.col,par:body,r:.14,spin:3,pulse:6,coreM:P.hot,shellM:P.softB});
  spFire(K,{pal:o.col,par:body,n:56,h:.3,wind:[0,-4.5],sz:.13,conv:0,life:.45,smoke:8,embers:8,seed:101,em:r=>spInBall(r,.16)});
  K.light(P.l,1.4,6,0,0,0,body);return spProjFinish(K,body,A,at=>spBoom(K,{pal:o.col,par:A,at,s:.55,floor:o.mount==='bare'?-99:-1.3,seed:102}));}
FX('fireball','bolts','Fireball',fxFireball,'A ball of fire with a long trail of flame, smoke and embers streaming back. '+SP_PCLIPS,{opts:[spCol(['fire','hell','fel','soul','frost','arcane','shadow']),SP_MOUNT]});

function fxMagicBolt(_s,o){const{root,A,K,body}=spProjRoot(o),P=spPal(o.col);
  spOrb(K,{pal:o.col,par:body,r:.1,spin:4,pulse:8});
  const hx=[];for(let s=0;s<2;s++)for(let j=0;j<12;j++)hx.push({m:K.p(j<3?P.hot:j<7?P.br:P.mid,body),s,j});
  K.add((S,t,A_)=>{hx.forEach(q=>{const an=spW(t,2,8)+q.s*Math.PI-q.j*.45,rr=.12*(1-q.j/16);S[q.m.name]={p:[Math.cos(an)*rr,Math.sin(an)*rr,-.05-q.j*.08],s:.05*(1-q.j/14)*A_};});});
  spTrail(K,{par:body,n:16,len:1.1,mats:[P.br,P.mid,P.softB],sz:.04,w:.14,life:.4,seed:111});
  K.light(P.l,1,5,0,0,0,body);return spProjFinish(K,body,A,at=>{spBurst(K,{pal:o.col,par:A,at,n:30,v:4,life:.6,sz:.06,seed:112});spBoom(K,{pal:o.col,par:A,at,s:.35,smoke:false,debris:false,seed:113});});}
FX('magic-bolt','bolts','Magic missile',fxMagicBolt,'A bright orb of magic with two strands of light spiralling behind it and a sparkling trail. '+SP_PCLIPS,{opts:[spCol(['arcane','frost','holy','fel','soul','blood','shadow','storm']),SP_MOUNT]});

function spSpear(K,body,core,shell,len=.9,w=.07){const sp=K.g(body),G=spGeo(),H=spGeo();G.box(w,w,len*.7,0,0,-len*.05);G.box(w*.7,w*.7,len*.2,0,0,len*.38);G.box(w*.4,w*.4,len*.12,0,0,len*.52);G.box(w*1.6,w*.4,len*.12,0,0,-len*.3);
  H.box(w*1.6,w*1.6,len*.8,0,0,0);G.mesh(core,sp);H.mesh(shell,sp);sp.rotation.z=Math.PI/4;K.add((S,t,A)=>{S[sp.name]={r:[0,0,Math.PI/4+spW(t,K.D,2)]};});return sp;}
function fxIceSpear(_s,o){const{root,A,K,body}=spProjRoot(o),P=spPal(o.col);spSpear(K,body,P.br,P.soft);
  spTrail(K,{par:body,n:22,len:1.4,z0:-.3,mats:[spM(P.c[4],'smoke',.45),P.soft,spM(P.c[1],'soft',.35)],sz:.12,w:.12,grow:1.6,life:.6,seed:121});
  spTrail(K,{par:body,n:10,len:1,z0:-.2,mats:[P.hot,P.br],sz:.03,w:.25,life:.35,seed:122,rot:true});
  K.light(P.l,.9,5,0,0,0,body);return spProjFinish(K,body,A,at=>{spBurst(K,{pal:o.col,par:A,at,n:24,v:4,g:5,life:.9,sz:.07,seed:123,mats:[P.hot,P.br,P.mid]});spBoom(K,{pal:o.col,par:A,at,s:.35,debris:false,seed:124});});}
FX('ice-spear','bolts','Ice spear',fxIceSpear,'A spinning spear of ice with a trail of frosty mist and glittering shards; it shatters on impact. '+SP_PCLIPS,{opts:[spCol(['frost','soul','arcane']),SP_MOUNT]});

function fxShadowBolt(_s,o){const{root,A,K,body}=spProjRoot(o),P=spPal(o.col);
  spOrb(K,{pal:o.col,par:body,r:.13,spin:3,coreM:spM(P.c[4]),shellM:P.soft});spOrbit(K,{pal:o.col,par:body,n:10,r:.22,sz:.04,kmax:3,seed:131,mats:[P.br,P.mid]});
  spTrail(K,{par:body,n:26,len:1.6,mats:[P.dk,spM(P.c[4]),P.mid,P.sm],sz:.11,w:.18,grow:1.4,life:.55,seed:132});
  K.light(P.l,.9,5,0,0,0,body);return spProjFinish(K,body,A,at=>{spBurst(K,{pal:o.col,par:A,at,n:30,v:3.5,life:.8,sz:.09,grow:1,seed:133,mats:[P.dk,P.mid,spM(P.c[4]),P.br]});spBoom(K,{pal:o.col,par:A,at,s:.35,debris:false,seed:134});});}
FX('shadow-bolt','bolts','Shadow bolt',fxShadowBolt,'A black orb in a violet shell with motes whirling round it and a trail of dark smoke. '+SP_PCLIPS,{opts:[spCol(['shadow','necro','blood','arcane']),SP_MOUNT]});

function fxBloodSpear(_s,o){const{root,A,K,body}=spProjRoot(o),P=spPal(o.col);spSpear(K,body,P.mid,spM(P.c[3],'soft',.6),1,.08);
  spTrail(K,{par:body,n:18,len:1.2,z0:-.4,mats:[P.mid,P.dk,P.br],sz:.05,w:.1,fall:.35,life:.5,seed:141});
  K.light(P.l,.8,5,0,0,0,body);return spProjFinish(K,body,A,at=>spBurst(K,{pal:o.col,par:A,at,n:34,v:4,g:6,life:1,sz:.07,floor:o.mount==='bare'?undefined:-1.3,keep:true,seed:142,mats:[P.mid,P.dk,P.br]}));}
FX('blood-spear','bolts','Blood lance',fxBloodSpear,'A lance of blood spinning as it flies, shedding drops that fall behind it; it splashes on impact. '+SP_PCLIPS,{opts:[spCol(['blood','necro','shadow']),SP_MOUNT]});

function fxFlamingSkull(_s,o){const{root,A,K,body}=spProjRoot(o),P=spPal(o.col),bn=vm('bone'),sk=K.g(body),dk=spM('#140c0c','solid');
  bx(sk,.24,.2,.26,bn,0,.03,0);bx(sk,.2,.06,.2,bn,0,.15,-.01);bx(sk,.18,.07,.08,bn,0,-.08,.1);bx(sk,.06,.05,.02,dk,-.055,.04,.131);bx(sk,.06,.05,.02,dk,.055,.04,.131);bx(sk,.03,.04,.02,dk,0,-.025,.131);
  bx(sk,.03,.03,.02,P.hot,-.055,.04,.135);bx(sk,.03,.03,.02,P.hot,.055,.04,.135);for(let i=0;i<4;i++)bx(sk,.03,.025,.02,bn,-.045+i*.03,-.115,.14);
  sk.traverse(m=>{if(m.isMesh)m.castShadow=false;});K.add((S,t,A_)=>{S[sk.name]={r:[.15*Math.sin(spW(t,2,2)),.2*Math.sin(spW(t,2,1)),0]};});
  spFire(K,{pal:o.col,par:body,n:48,h:.32,wind:[0,-4],sz:.12,conv:0,life:.45,smoke:6,embers:8,seed:151,em:r=>{const v=spInBall(r,.16);return[v[0],Math.abs(v[1])+.05,v[2]-.08];}});
  K.light(P.l,1.2,6,0,0,0,body);return spProjFinish(K,body,A,at=>spBoom(K,{pal:o.col,par:A,at,s:.5,floor:o.mount==='bare'?-99:-1.3,seed:152}));}
FX('flaming-skull','bolts','Flaming skull',fxFlamingSkull,'A grinning skull wreathed in ghost fire, glowing eyes, flames streaming back as it flies (for liches and necromancers). '+SP_PCLIPS,{opts:[spCol(['necro','soul','fire','hell','fel','shadow']),SP_MOUNT]});

function fxAcidGlob(_s,o){const{root,A,K,body}=spProjRoot(o),P=spPal(o.col),bl=K.g(body);spGeo().box(.22,.2,.24).mesh(P.mid,bl);spGeo().box(.16,.16,.16,.05,.04,.05,.5,.5,0).mesh(P.br,bl);spGeo().box(.3,.28,.3).mesh(spM(P.c[3],'soft',.5),bl);
  K.add((S,t,A_)=>{const w=Math.sin(spW(t,2,6));S[bl.name]={s:[1+.12*w,1-.1*w,1+.06*Math.cos(spW(t,2,6))],r:[0,spW(t,2,1),0]};});
  spTrail(K,{par:body,n:14,len:.9,z0:-.1,mats:[P.mid,P.br,P.dk],sz:.06,w:.14,fall:.5,life:.5,seed:161});spOrbit(K,{pal:o.col,par:body,n:8,r:.2,sz:.035,seed:162,mats:[P.br,P.hot]});
  K.light(P.l,.8,5,0,0,0,body);return spProjFinish(K,body,A,at=>{spBurst(K,{pal:o.col,par:A,at,n:30,v:3.5,g:6,life:1,sz:.07,floor:o.mount==='bare'?undefined:-1.3,keep:true,seed:163,mats:[P.mid,P.br,P.dk]});
    spBurst(K,{pal:o.col,par:A,at:spShift(at,.1),n:10,v:1,g:-1,up:true,life:1.4,sz:.2,grow:1.5,seed:164,mats:[spM(P.c[2],'smoke',.4)]});});}
FX('acid-glob','bolts','Acid glob',fxAcidGlob,'A wobbling glob of acid or poison dripping as it flies, bubbles circling it; it splatters and fumes on impact. '+SP_PCLIPS,{opts:[spCol(['poison','fel','blood','necro']),SP_MOUNT]});
