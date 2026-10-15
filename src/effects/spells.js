/* ======================= SPELLS & EFFECTS (fx-): voxel magic made of glowing cubes =======================
   See docs/SPELLS.md. Every effect is an ordinary asset whose motion is baked into AnimationClips with propAnim (props_anim.js),
   so it plays in the viewer and exports in the GLB like the characters:
   - Idle  : the effect running (loop; every particle period divides the loop length, so it never pops)
   - Start : grows in (or draws itself), then hands over to Idle seamlessly
   - End   : dies out and holds (everything shrunk to nothing)
   - extra one-shots per effect (Cast, Strike, Summon, Impact, Burst...).
   Particles are unit cubes (shared geometry) scaled per frame; static glowing shapes (rings, lines, rays, bolts) are merged into one
   geometry per material. Glowing parts are unlit (MeshBasicMaterial, KHR_materials_unlit in the GLB), smoke is lit.
   Anchors: hand effects sit on the palm, staff effects on the staff tip, ground effects on the ground, projectiles fly along +z.
   The 'Preview' option shows a stand (stone hand, planted staff, flight height); 'Bare (for export)' puts the anchor at the origin.
   A light follows the effect: the empty node fx_light carries the light strength as its scale (read it in your game the same way). */

const SPG=new THREE.BoxGeometry(1,1,1),SP_TAU=Math.PI*2;
/* palettes: hot core, bright, mid, dark, smoke, light colour */
const SP_PAL={
  fire:{n:'Fire',c:['#fff2d0','#ffcc5c','#ff8a2a','#d8481a','#3a2a24'],l:0xff8a2a},
  hell:{n:'Hellfire',c:['#ffdcb8','#ff9a5a','#f0502a','#a8281a','#1e1210'],l:0xf0502a},
  fel:{n:'Fel green',c:['#ecfce0','#b4f088','#6cd040','#28761a','#1a2a14'],l:0x6cd040},
  frost:{n:'Frost',c:['#f2fbff','#ccecfc','#7cc4f0','#2e6eb0','#c8dcec'],l:0x7cc4f0},
  arcane:{n:'Arcane',c:['#fcf0ff','#e6b8fc','#b86af0','#6228ac','#29163d'],l:0xb86af0},
  shadow:{n:'Shadow',c:['#ece0f8','#a888d4','#6a44a8','#2e1850','#0f0b16'],l:0xa888d4},
  blood:{n:'Blood',c:['#ffe0d8','#f49488','#dc3a32','#7a1218','#160809'],l:0xdc3a32},
  holy:{n:'Holy light',c:['#fffbea','#fff0b8','#f4d06a','#c09a3a','#fffae8'],l:0xf4d06a},
  storm:{n:'Lightning',c:['#f4f4ff','#d4dcff','#94a8ff','#4652d8','#2a3040'],l:0x94a8ff},
  poison:{n:'Poison',c:['#f8fcd8','#e0f080','#b4cc38','#5e6e18','#3a4a20'],l:0xb4cc38},
  soul:{n:'Soul',c:['#e8f6ff','#a8dcfa','#5ab4ec','#1e5e94','#14243a'],l:0x5ab4ec},
  necro:{n:'Necrotic',c:['#e4fbe8','#a4ecbc','#4cd88a','#1e8a54','#0e1a12'],l:0x4cd88a}};
const SP_MC=new Map();
/* glow: unlit, full colour; soft: unlit see-through; add: additive halo; smoke: lit see-through; solid: lit */
function spM(hex,kind='glow',op){const k=hex+kind+(op||'');if(SP_MC.has(k))return SP_MC.get(k);const c=new THREE.Color(hex).convertSRGBToLinear();let m;
  if(kind==='glow')m=new THREE.MeshBasicMaterial({color:c,toneMapped:false});
  else if(kind==='soft')m=new THREE.MeshBasicMaterial({color:c,toneMapped:false,transparent:true,opacity:op||.55,depthWrite:false});
  else if(kind==='add')m=new THREE.MeshBasicMaterial({color:c,toneMapped:false,transparent:true,opacity:op||.28,depthWrite:false,blending:THREE.AdditiveBlending});
  else if(kind==='smoke')m=new THREE.MeshStandardMaterial({color:c,transparent:true,opacity:op||.72,depthWrite:false,roughness:1});
  else m=new THREE.MeshStandardMaterial({color:c,roughness:op||.75});
  m.name='fx_'+kind+'_'+hex.slice(1);SP_MC.set(k,m);return m;}
function spPal(key){const p=SP_PAL[key]||SP_PAL.fire,c=p.c;return{key,c,l:p.l,hot:spM(c[0]),br:spM(c[1]),mid:spM(c[2]),dk:spM(c[3]),sm:spM(c[4],'smoke',.5),
  soft:spM(c[2],'soft'),softB:spM(c[1],'soft'),add:spM(c[2],'add'),addB:spM(c[1],'add'),addH:spM(c[0],'add',.4)};}
const spTau=(t,D,P,ph)=>{const n=Math.max(1,Math.round(D/P));return((t/D*n+ph)%1+1)%1;};
const spW=(t,D,k)=>t/D*SP_TAU*k;                                   // angle that turns k whole times per loop
const spEnv=(u,a=.15)=>u<a?u/a:Math.max(0,(1-u)/(1-a));             // particle life: quick grow, slow shrink
const spSm=x=>x<=0?0:x>=1?1:x*x*(3-2*x);
const spCl=x=>x<0?0:x>1?1:x;
const spHash=n=>{let h=Math.imul(n^0x9e3779b9,0x85ebca6b);h^=h>>>13;h=Math.imul(h,0xc2b2ae35);h^=h>>>16;return(h>>>0)/4294967296;};

/* ---------- merged static geometry: boxes, flat lines, 3D lines, rings, discs, glyphs ---------- */
function spGeo(halo=false){const pos=[],nor=[],uv=[],idx=[],M=new THREE.Matrix4(),Vp=new THREE.Vector3(),Vs=new THREE.Vector3(),V=new THREE.Vector3(),I=new THREE.Quaternion(),
  sp=SPG.attributes.position.array,sn=SPG.attributes.normal.array,su=SPG.attributes.uv.array,si=SPG.index.array,Y=new THREE.Vector3(0,1,0);
  const G={n:0};
  G.boxQ=(w,h,d,x=0,y=0,z=0,q=I)=>{M.compose(Vp.set(x,y,z),q,Vs.set(w,h,d));const b=pos.length/3;
    for(let i=0;i<sp.length;i+=3){V.set(sp[i],sp[i+1],sp[i+2]).applyMatrix4(M);pos.push(V.x,V.y,V.z);V.set(sn[i],sn[i+1],sn[i+2]).applyQuaternion(q);nor.push(V.x,V.y,V.z);}
    for(let i=0;i<su.length;i++)uv.push(su[i]);for(let i=0;i<si.length;i++)idx.push(b+si[i]);G.n++;return G;};
  G.box=(w,h,d,x=0,y=0,z=0,rx=0,ry=0,rz=0)=>G.boxQ(w,h,d,x,y,z,new THREE.Quaternion().setFromEuler(new THREE.Euler(rx,ry,rz)));
  /* flat line on a horizontal plane at height y: w wide, h thick, ends overlap by ext */
  G.flat=(ax,az,bx_,bz,w,h,y,ext=halo?0:w*.5)=>{const dx=bx_-ax,dz=bz-az,L=Math.hypot(dx,dz);if(L<1e-6)return G;return G.box(w,h,L+ext,(ax+bx_)/2,y,(az+bz)/2,0,Math.atan2(dx,dz),0);};
  /* 3D line from a to b (arrays), square section w */
  G.line=(a,b,w,ext=0)=>{const d=new THREE.Vector3(b[0]-a[0],b[1]-a[1],b[2]-a[2]),L=d.length();if(L<1e-6)return G;d.divideScalar(L);
    return G.boxQ(w,L+ext,w,(a[0]+b[0])/2,(a[1]+b[1])/2,(a[2]+b[2])/2,new THREE.Quaternion().setFromUnitVectors(Y,d));};
  /* ring of n straight pieces on the ground (angle 0 = +z), optionally only from a0 to a1 */
  G.ring=(R,w,h,y,n,a0=0,a1=SP_TAU)=>{for(let i=0;i<n;i++){const p=a0+(a1-a0)*i/n,q=a0+(a1-a0)*(i+1)/n;G.flat(R*Math.sin(p),R*Math.cos(p),R*Math.sin(q),R*Math.cos(q),w,h,y,halo?0:w*.6);}return G;};
  /* blocky disc made of rows */
  G.disc=(R,y,h,step)=>{for(let z=-R+step/2;z<R;z+=step){const hw=Math.sqrt(Math.max(0,R*R-z*z));if(hw>step*.3)G.box(2*hw,h,step,0,y,z);}return G;};
  /* glyph i at angle a on radius rr, size s, stroke w (glyph 'up' points outward) */
  G.glyph=(gi,a,rr,s,w,h,y)=>{const st=SP_GLY[gi%SP_GLY.length],er=[Math.sin(a),Math.cos(a)],et=[Math.cos(a),-Math.sin(a)],cx=rr*er[0],cz=rr*er[1];
    const P=(gx,gy)=>[cx+(gx*et[0]+gy*er[0])*s,cz+(gx*et[1]+gy*er[1])*s];
    for(const[x1,y1,x2,y2]of st){const A=P(x1,y1),B=P(x2,y2);G.flat(A[0],A[1],B[0],B[1],w,h,y,w*.8);}return G;};
  G.geo=()=>{const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(nor,3));
    g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeBoundingSphere();return g;};
  G.mesh=(mat,par,name)=>{const m=new THREE.Mesh(G.n?G.geo():new THREE.BufferGeometry(),mat);m.castShadow=m.receiveShadow=false;if(name)m.name=name;if(par)par.add(m);return m;};
  return G;}
/* runic glyphs from strokes in a unit cell (no crosses: strokes only meet at their ends) */
const SP_GLY=[
  [[-.35,-.4,0,.4],[0,.4,.35,-.4]],                                        // chevron
  [[0,-.45,.4,0],[.4,0,0,.45],[0,.45,-.4,0],[-.4,0,0,-.45]],               // diamond
  [[-.4,-.4,.4,-.4],[.4,-.4,0,.4],[0,.4,-.4,-.4]],                         // triangle
  [[-.4,.4,.4,.4],[.4,.4,-.4,-.4],[-.4,-.4,.4,-.4]],                       // zigzag
  [[-.25,-.45,-.25,.45],[.25,-.45,.25,.45]],                               // two bars
  [[-.4,.4,0,-.05],[0,-.05,.4,.4],[0,-.05,0,-.45]],                        // fork
  [[-.4,-.4,-.4,.3],[-.4,.3,.4,.3],[.4,.3,.4,-.4]],                        // arch
  [[-.4,.45,.4,.15],[-.4,-.15,.4,-.45]],                                   // slashes
  [[-.3,-.45,-.3,.45],[-.3,.45,.35,.1],[.35,.1,-.3,-.1]],                  // thorn
  [[-.4,-.1,0,.4],[0,.4,.4,-.1],[-.2,-.45,.2,-.45]],                       // roof and bar
  [[-.45,0,-.15,.4],[-.15,.4,.15,-.4],[.15,-.4,.45,0]]];                   // wave

/* ---------- the kit: animated parts and systems for one effect ---------- */
function spKit(root,D,pre='fx'){const K={root,D,parts:[],n:0,sys:[],lights:[],lc:null};
  K.p=(mat,par=root)=>{const m=new THREE.Mesh(SPG,mat);m.castShadow=m.receiveShadow=false;m.name=pre+'_'+(K.n++);m.scale.setScalar(1e-4);par.add(m);K.parts.push(m);return m;};
  K.g=(par=root,x=0,y=0,z=0)=>{const g=new THREE.Group();g.name=pre+'_g'+(K.n++);g.position.set(x,y,z);par.add(g);K.parts.push(g);return g;};
  K.add=f=>{K.sys.push(f);return f;};
  /* a light that follows the effect; strength = scale of the empty node fx_light (lf(t,A,c) overrides the default flicker) */
  K.light=(col,I,dist,x,y,z,par=root)=>{const l=new THREE.PointLight(col,I,dist,2);l.position.set(x,y,z);l.userData.min=I;l.castShadow=false;par.add(l);root.userData.lights.push(l);K.lights.push(l);
    if(!K.lc){K.lc=new THREE.Group();K.lc.name='fx_light';root.add(K.lc);K.parts.push(K.lc);}return l;};
  K.lf=null;return K;}
/* bakes the clips: Idle (loop D), Start (grows in over o.start seconds, hands over to Idle), End (dies out over o.end, holds), extra one-shots.
   extra def: {name,dur,loop,hold,next,fn(t,S,step)}; step(S,t,A,clipName) runs every system */
function spFinish(K,o={}){const D=K.D,step=(S,t,A,c)=>{for(const f of K.sys)f(S,t,A,c);
    if(K.lc){const f=K.lf?K.lf(t,A,c):A*(.86+.08*Math.sin(spW(t,D,7))+.06*Math.sin(spW(t,D,13)));S[K.lc.name]={s:Math.max(1e-4,f)};}};
  const defs=[{name:'Idle',dur:D,loop:true,fn:(t,S)=>step(S,t,1,'Idle')}];
  if(o.start!==false){const Ts=o.start||.8;defs.push({name:'Start',dur:D,next:'Idle',fn:(t,S)=>step(S,t,spSm(t/Ts),'Start')});}
  if(o.end!==false){const Te=o.end||1;defs.push({name:'End',dur:Te+.4,hold:true,fn:(t,S)=>step(S,t,1-spSm(t/Te),'End')});}
  for(const d of o.extra||[])defs.push({name:d.name,dur:d.dur,loop:d.loop,hold:d.hold,next:d.next,fn:(t,S)=>d.fn(t,S,step)});
  propAnim(K.root,K.parts,defs);
  if(K.lc){const lc=K.lc,L=K.lights;K.root.userData.post=()=>{const f=lc.scale.x;for(const l of L)l.intensity=(l.userData.base??l.userData.min)*f;};}
  return K.root;}

/* ---------- generic looping particle system: init(r,i) -> particle data (needs mat), f(q,u,t,A,c) -> {p,s} or null ---------- */
function spPS(K,o){const r=mulberry32(o.seed||7),L=[];for(let i=0;i<o.n;i++){const q=o.init(r,i);q.m=K.p(q.mat,q.par||o.par||K.root);if(q.rot)q.m.rotation.set(q.rot[0],q.rot[1],q.rot[2]);
    q.P=q.P||o.P||1;if(q.ph===undefined)q.ph=r();L.push(q);}
  K.add((S,t,A,c)=>{for(const q of L){const u=spTau(t,K.D,q.P,q.ph),v=o.f(q,u,t,A,c);if(v)S[q.m.name]=v;}});return L;}
const spHid={s:1e-4};
/* emitter shapes: point in a disc / on a ring / in a box / in a sphere */
const spInDisc=(r,R)=>{const a=r()*SP_TAU,d=R*Math.sqrt(r());return[Math.sin(a)*d,Math.cos(a)*d];};
const spInBall=(r,R)=>{let x,y,z;do{x=r()*2-1;y=r()*2-1;z=r()*2-1;}while(x*x+y*y+z*z>1);return[x*R,y*R,z*R];};

/* fire: cubes born in the emitter rise, sway, draw in towards the axis and shrink; hot ones low and short, dark ones high; smoke and embers above.
   o: pal, n, R (emitter radius), h (flame height), sz (cube size), x,y,z, par, smoke (count), embers (count), wind [x,z] per metre of rise,
   conv (draw-in 0..1), life (period scale), em (emitter fn(r)->[x,y,z] overrides the disc), A (fn(A,c,t) -> local strength) */
function spFire(K,o){const P=spPal(o.pal),h=o.h||1,sz=o.sz||h*.16,x0=o.x||0,y0=o.y||0,z0=o.z||0,conv=o.conv??.6,wind=o.wind||[0,0],life=o.life||1;
  const roles=[[.16,P.hot,.38,.55],[.3,P.br,.62,.85],[.32,P.mid,.88,1],[.22,P.dk,1.08,.72]];
  const pick=k=>{let a=0;for(const ro of roles){a+=ro[0];if(k<a)return ro;}return roles[3];};
  spPS(K,{n:o.n||40,seed:o.seed||11,par:o.par,init:(r,i)=>{const ro=pick((i+.5)/(o.n||40)),e=o.em?o.em(r):(()=>{const d=spInDisc(r,o.R||.2);return[d[0],0,d[1]];})();
      return{mat:ro[1],e,rise:ro[2]*(.8+.4*r()),sz:ro[3]*sz*(.7+.6*r()),P:(.5+.55*ro[2])*life*(.85+.3*r()),sw:r()*SP_TAU,sa:(r()-.5)*.08*h};},
    f:(q,u,t,A,c)=>{const a=o.Ae?o.Ae(q.e,A,c,t):o.A?o.A(A,c,t):A;if(a<=1e-3)return spHid;const k=1-conv*u,ry=q.rise*h*Math.pow(u,.9);
      return{p:[x0+q.e[0]*k+Math.sin(q.sw+u*5)*q.sa+wind[0]*ry,y0+q.e[1]+ry*(.6+.4*a),z0+q.e[2]*k+Math.cos(q.sw+u*4)*q.sa+wind[1]*ry],s:q.sz*spEnv(u,.14)*a};}});
  if(o.smoke)spPS(K,{n:o.smoke,seed:(o.seed||11)+1,par:o.par,init:r=>{const d=spInDisc(r,(o.R||.2)*.6);return{mat:P.sm,e:[d[0],0,d[1]],P:1.6*life*(.85+.3*r()),sw:r()*SP_TAU,sz:sz*(.9+.5*r())};},
    f:(q,u,t,A,c)=>{const a=o.Ae?o.Ae(q.e,A,c,t):o.A?o.A(A,c,t):A;if(a<=1e-3)return spHid;const ry=h*(.7+1.3*u);
      return{p:[x0+q.e[0]+Math.sin(q.sw)*.35*h*u+wind[0]*ry,y0+ry,z0+q.e[2]+Math.cos(q.sw)*.35*h*u+wind[1]*ry],s:q.sz*(.5+.9*u)*Math.pow(Math.sin(Math.PI*u),.8)*(1-.5*u)*a};}});
  if(o.embers)spPS(K,{n:o.embers,seed:(o.seed||11)+2,par:o.par,init:r=>{const d=spInDisc(r,o.R||.2);return{mat:r()<.5?P.hot:P.br,e:[d[0],0,d[1]],P:1.2*life*(.8+.4*r()),sw:r()*SP_TAU,sz:sz*.22};},
    f:(q,u,t,A,c)=>{const a=o.Ae?o.Ae(q.e,A,c,t):o.A?o.A(A,c,t):A;if(a<=1e-3)return spHid;const ry=h*2.2*u;
      return{p:[x0+q.e[0]+Math.sin(q.sw+u*9)*.15*h+wind[0]*ry,y0+ry,z0+q.e[2]+Math.cos(q.sw+u*7)*.15*h+wind[1]*ry],s:q.sz*(u<.1?u/.1:1-u)*a};}});}

/* glowing orb: hot core, soft shell turned 45 degrees, additive halo; spins and breathes. Returns the group (scale = strength). */
function spOrb(K,o){const P=spPal(o.pal),R=o.r||.12,g=K.g(o.par||K.root,o.x||0,o.y||0,o.z||0);
  const st=(m,s,rx,ry)=>{const x=new THREE.Mesh(SPG,m);x.scale.setScalar(s);x.rotation.set(rx,ry,0);x.castShadow=x.receiveShadow=false;g.add(x);return x;};
  st(o.coreM||P.hot,R,0,0);st(o.shellM||P.softB,R*1.5,Math.PI/4,Math.PI/4);if(o.halo!==false)st(spM(P.c[2],'add',.13),R*2.1,0,Math.PI/4);
  K.add((S,t,A,c)=>{const a=o.A?o.A(A,c,t):A,b=1+.07*Math.sin(spW(t,K.D,o.pulse||4));S[g.name]={s:Math.max(1e-4,a*b),r:[spW(t,K.D,o.spin||1),spW(t,K.D,(o.spin||1)*2),0]};});return g;}
/* motes circling a centre on tilted orbits */
function spOrbit(K,o){const P=spPal(o.pal),c0=[o.x||0,o.y||0,o.z||0];
  return spPS(K,{n:o.n||12,seed:o.seed||21,par:o.par,init:(r,i)=>{const tilt=new THREE.Quaternion().setFromEuler(new THREE.Euler((r()-.5)*(o.tilt??1.4),r()*SP_TAU,(r()-.5)*(o.tilt??1.4)));
      return{mat:o.mats?o.mats[i%o.mats.length]:(r()<.4?P.hot:P.br),q:tilt,rad:(o.r||.3)*(.75+.5*r()),k:(r()<.5?-1:1)*(1+Math.floor(r()*(o.kmax||2))),a0:r()*SP_TAU,sz:(o.sz||.035)*(.7+.6*r()),tw:1+Math.floor(r()*4),P:K.D};},
    f:(q,u,t,A,c)=>{const a=o.A?o.A(A,c,t):A;if(a<=1e-3)return spHid;const an=q.a0+spW(t,K.D,q.k),v=new THREE.Vector3(Math.cos(an)*q.rad*a,0,Math.sin(an)*q.rad*a).applyQuaternion(q.q);
      return{p:[c0[0]+v.x,c0[1]+v.y,c0[2]+v.z],s:q.sz*a*(.7+.3*Math.sin(spW(t,K.D,q.tw*3)+q.a0))};}});}
/* motes rising from an emitter and fading */
function spRise(K,o){const P=spPal(o.pal),c0=[o.x||0,o.y||0,o.z||0];
  return spPS(K,{n:o.n||16,seed:o.seed||31,par:o.par,init:(r,i)=>{const e=o.em?o.em(r,i):(()=>{const d=spInDisc(r,o.R||.4);return[d[0],0,d[1]];})();
      return{mat:o.mats?o.mats[Math.floor(r()*o.mats.length)]:(r()<.35?P.hot:P.br),e,P:(o.life||1.6)*(.75+.5*r()),sw:r()*SP_TAU,sz:(o.sz||.04)*(.6+.8*r()),hh:(o.h||1)*(.6+.6*r())};},
    f:(q,u,t,A,c)=>{const a=o.A?o.A(A,c,t):A;if(a<=1e-3)return spHid;return{p:[c0[0]+q.e[0]+Math.sin(q.sw+u*6)*(o.wig??.05),c0[1]+q.e[1]+q.hh*Math.pow(u,o.pow||1),c0[2]+q.e[2]+Math.cos(q.sw+u*5)*(o.wig??.05)],
      s:(o.sv?[q.sz*a*spEnv(u,.2),q.sz*o.sv*a*spEnv(u,.2),q.sz*a*spEnv(u,.2)]:q.sz*a*spEnv(u,.2))};}});}
/* particles spiralling in from radius R0 to the centre (vortex) */
function spSwirl(K,o){const P=spPal(o.pal),c0=[o.x||0,o.y||0,o.z||0];
  return spPS(K,{n:o.n||24,seed:o.seed||41,par:o.par,init:r=>({mat:o.mats?o.mats[Math.floor(r()*o.mats.length)]:(r()<.3?P.br:r()<.6?P.mid:P.dk),a0:r()*SP_TAU,P:(o.life||1.2)*(.8+.4*r()),
      R0:(o.R||.6)*(.7+.5*r()),yy:(o.yr||0)*(r()-.5),sz:(o.sz||.06)*(.6+.8*r())}),
    f:(q,u,t,A,c)=>{const a=o.A?o.A(A,c,t):A;if(a<=1e-3)return spHid;const rr=q.R0*(1-u)*a,an=q.a0+(o.turns||1.5)*SP_TAU*u*(o.dir||1),flat=o.flat;
      return{p:[c0[0]+Math.sin(an)*rr,c0[1]+(flat?0:q.yy*(1-u))+(o.lift||0)*u,c0[2]+Math.cos(an)*rr*(o.squash||1)],s:q.sz*a*(u<.15?u/.15:1-.7*u)};}});}
/* one-shot radial burst in clip `clip` starting at t0: speed, drag, gravity, dir (unit vector bias), spread */
function spBurst(K,o){const P=spPal(o.pal),c0=[o.x||0,o.y||0,o.z||0],L=[],r=mulberry32(o.seed||51),clips=[].concat(o.clip),
    evs=c=>o.at?(o.at[c]||[]):(clips.includes(c)?[[o.t0||0,c0]]:[]);
  for(let i=0;i<(o.n||20);i++){const m=K.p(o.mats?o.mats[i%o.mats.length]:(r()<.3?P.hot:r()<.7?P.br:P.mid),o.par||K.root);
    let d=new THREE.Vector3(r()*2-1,r()*2-1,r()*2-1);if(o.flat)d.y=Math.abs(d.y)*.15;d.normalize();if(o.dir){d.multiplyScalar(o.spread??.5).add(new THREE.Vector3(...o.dir)).normalize();}if(o.up)d.y=Math.abs(d.y);
    L.push({m,d,v:(o.v||3)*(.6+.8*r()),life:(o.life||.8)*(.7+.6*r()),sz:(o.sz||.06)*(.6+.8*r())});}
  K.add((S,t,A,c)=>{let ev=null;for(const e of evs(c))if(t>=e[0])ev=e;
    for(const q of L){const tt=ev?t-ev[0]:-1;if(!ev||tt>q.life){S[q.m.name]=spHid;continue;}const u=tt/q.life,dr=o.drag??2.5,dist=q.v*(1-Math.exp(-dr*tt))/dr,e=ev[1],k=o.k||1;
      let y=e[1]+(q.d.y*dist-(o.g||0)*tt*tt*.5)*k;if(o.floor!==undefined)y=Math.max(o.floor+q.sz*.5,y);
      S[q.m.name]={p:[e[0]+q.d.x*dist*k,y,e[2]+q.d.z*dist*k],s:q.sz*k*(o.keep?Math.min(1,(1-u)*4):(1-u))*(o.grow?1+u*o.grow:1)};}});return L;}

/* lightning: jagged points between a and b (midpoint displacement), with optional branches */
function spBoltPts(a,b,r,jag=.25,lv=5){let P=[new THREE.Vector3(...a),new THREE.Vector3(...b)],J=jag;
  for(let l=0;l<lv;l++){const N=[P[0]];for(let i=1;i<P.length;i++){const A=P[i-1],B=P[i],L=A.distanceTo(B),m=A.clone().add(B).multiplyScalar(.5);
      m.add(new THREE.Vector3(r()*2-1,r()*2-1,r()*2-1).multiplyScalar(L*J));N.push(m,B);}P=N;J*=.62;}return P;}
/* n variants of a bolt, each one group (merged core + glow) that flicks on and off; o.from/o.to: fn(r,k) -> [x,y,z];
   o.vis(k,t,A,c) -> scale (0 hides). Default: crackle, one or two variants lit at a time, re-rolled rate times a second */
function spBolts(K,o){const P=spPal(o.pal),r=mulberry32(o.seed||61),G=[],par=o.par||K.root,w=o.w||.03,nv=o.n||6;
  for(let k=0;k<nv;k++){const g=K.g(par),core=spGeo(),glow=spGeo(true),a=o.from(r,k),b=o.to(r,k),pts=spBoltPts(a,b,r,o.jag??.22,o.lv??4);
    for(let i=1;i<pts.length;i++){const A=pts[i-1].toArray(),B=pts[i].toArray(),fw=1-.5*i/pts.length;core.line(A,B,w*fw,w*.5);glow.line(A,B,w*3.2*fw,0);}
    for(let bI=0;bI<(o.branch??2);bI++){const s=pts[1+Math.floor(r()*(pts.length-3))],dir=new THREE.Vector3(...b).sub(new THREE.Vector3(...a)),L=dir.length()*(.2+.25*r());
      const e=s.clone().add(dir.normalize().multiplyScalar(L*.6)).add(new THREE.Vector3(r()*2-1,r()*2-1,r()*2-1).multiplyScalar(L*.7)),bp=spBoltPts(s.toArray(),e.toArray(),r,.3,3);
      for(let i=1;i<bp.length;i++){const A=bp[i-1].toArray(),B=bp[i].toArray();core.line(A,B,w*.55,w*.3);glow.line(A,B,w*1.8,0);}}
    core.mesh(o.coreM||P.hot,g);glow.mesh(o.glowM||P.add,g);g.scale.setScalar(1e-4);G.push(g);}
  const rate=o.rate||14;
  K.add((S,t,A,c)=>{const sl=Math.floor(t*rate+1e-6),ns=Math.max(1,Math.round(K.D*rate)),h=spHash(((sl%ns)+ns)%ns+(o.seed||61)*977);
    G.forEach((g,k)=>{let s;if(o.vis)s=o.vis(k,t,A,c);else{const on=(Math.floor(h*nv)===k)||(spHash(sl*31+k*7+(o.seed||61))<(o.duty??.12));s=on&&A>.05&&spHash(sl*13+k)<A+.1?1:0;}
      S[g.name]={s:s>1e-3?s:1e-4};});});return G;}

/* ---------- stands for the preview ---------- */
/* stone pedestal with an open hand, palm up, fingers towards +z; returns the anchor height above the palm */
function spHandStand(root){const dk=vm('cobble'),sk=spM('#8c8680','solid',.9),skD=spM('#76706a','solid',.9),y=-.38;
  bx(root,.56,.16,.5,dk,0,.08,0);bx(root,.36,.14,.32,dk,.02,.22,.02);bx(root,.15,.56,.15,skD,0,.56,-.04);bx(root,.17,.06,.17,dk,0,.31,-.04);
  bx(root,.13,.16,.15,skD,0,1.2+y,-.04);bx(root,.22,.07,.22,sk,0,1.3+y,0);bx(root,.2,.04,.06,sk,0,1.345+y,-.09);
  for(let i=0;i<4;i++){const x=-.075+i*.05,l=i===0||i===3?.07:.085;bx(root,.042,.045,l,sk,x,1.31+y,.11+l/2);bx(root,.042,.06,.045,sk,x,1.34+y,.12+l+.005);}
  bx(root,.05,.045,.09,sk,-.135,1.31+y,.03,0,-.5,0);bx(root,.045,.06,.045,sk,-.17,1.34+y,.08);return 1.5+y;}
/* a staff planted in a mound: dark wood, iron collar, three prongs holding the effect; returns the anchor height (inside the prongs) */
function spStaffStand(root){const wd=vm('planksDark'),ir=vm('iron'),dt=vm('dirt');
  bx(root,.6,.12,.5,dt,0,.06,0);bx(root,.36,.1,.32,dt,0,.15,.02);bx(root,.08,1.9,.08,wd,0,1.05,0);bx(root,.12,.08,.12,ir,0,1.88,0);bx(root,.1,.06,.1,ir,0,1.2,0);
  for(let i=0;i<3;i++){const a=i/3*SP_TAU,c=Math.sin(a),s=Math.cos(a);bx(root,.04,.14,.04,ir,c*.07,1.97,s*.07,s*.35,0,-c*.35);bx(root,.035,.12,.035,ir,c*.1,2.09,s*.1,-s*.25,0,c*.25);}return 2.1;}
/* the root for floating effects: Preview stand -> anchor raised on the stand, Bare -> anchor at the origin with no ground */
function spRootFor(o,stand,gr=1.6,fr=[.45,.5,.45,.1]){const root=new THREE.Group();root.userData.lights=[];const A=new THREE.Group();A.name='fx_anchor';root.add(A);
  if(o.mount==='bare'){root.userData.ground=-1;}else{A.position.y=typeof stand==='number'?stand:stand(root);root.userData.ground=gr;}spFrame(A,fr);return{root,A};}
/* an invisible box the viewer frames (the particles are hidden at rest); not exported (the GLB keeps visible objects only) */
function spFrame(par,[w,h,d,y=0]){const m=new THREE.Mesh(SPG,spM('#000000','soft',.01));m.visible=false;m.scale.set(2*w,2*h,2*d);m.position.y=y;m.name='fx_frame';par.add(m);return m;}
const SP_MOUNT={key:'mount',label:'Preview',choices:[['stand','On a stand'],['bare','Bare (for export)']],def:'stand'};
const spCol=(keys,def)=>({key:'col',label:'Colour',choices:keys.map(k=>[k,SP_PAL[k].n]),def:def||keys[0]});
const SP_SIZE={key:'size',label:'Size',choices:[['s','Small (1.6 m)'],['m','Medium (3 m)'],['l','Large (6 m)'],['xl','Huge (10 m)']],def:'m'};
const spR=o=>({s:.8,m:1.5,l:3,xl:5}[o.size]||1.5);

/* ---------- folders ---------- */
FOLDERS[''].children.push('spells');
FOLDERS['spells']={name:'Spells & effects',blurb:'Voxel magic: casts from hands and staffs, circles under casters and creatures, fire, lightning, blood, dark and holy spells, lights. Baked clips: Idle, Start, End and one-shots',
  children:['spells/ground','spells/hand','spells/staff','spells/fire','spells/lightning','spells/bolts','spells/blood','spells/dark','spells/light','spells/status']};
FOLDERS['spells/ground']={name:'Circles & auras',blurb:'Pentagrams, rune circles and auras that lie on the ground under casters and creatures',children:[]};
FOLDERS['spells/hand']={name:'Hand casts',blurb:'Effects held in an open hand (anchor on the palm)',children:[]};
FOLDERS['spells/staff']={name:'Staff tips',blurb:'Effects on the tip of a staff (anchor at the tip)',children:[]};
FOLDERS['spells/fire']={name:'Fire',blurb:'Flames, pillars, rings, rain of fire, meteors, explosions, fire breath',children:[]};
FOLDERS['spells/lightning']={name:'Lightning',blurb:'Strikes from the sky, chains, beams, storm clouds',children:[]};
FOLDERS['spells/bolts']={name:'Projectiles',blurb:'Bolts and missiles that fly along +z, with an Impact clip',children:[]};
FOLDERS['spells/blood']={name:'Blood magic',blurb:'Blood novas, spikes, drains and rains',children:[]};
FOLDERS['spells/dark']={name:'Dark magic',blurb:'Shadow vortices, portals, curses, grasping hands, raising the dead',children:[]};
FOLDERS['spells/light']={name:'Light & holy',blurb:'Light orbs, wisps, beams from the sky, healing, shields, shine',children:[]};
FOLDERS['spells/status']={name:'On characters',blurb:'Burning, shining, electrified, frozen, poisoned, cursed... sized for a 1.8 m figure (Size scales it for big creatures)',children:[]};
const FX=(id,f,name,build,desc,o={})=>ASSETS.push(Object.assign({id:'fx-'+id,folder:'spells/'+f,name,build,desc},o));

/* ======================= circles & auras (on the ground) ======================= */
/* Pentagram: scorched disc, double outer circle with glyphs (turning), inverted star with sparks running along it, candles on the points */
function fxPentagram(_s,o){const root=new THREE.Group();root.userData.lights=[];const R=spR(o)*1.0,P=spPal(o.col),K=spKit(root,8),y=.012,w=Math.max(.035,R*.03),h=.018;
  const scorch=spGeo().disc(R*1.12,.004,.008,Math.max(.1,R*.07));scorch.mesh(spM(P.c[4],'solid',.95),root);
  const rot=K.g(root),Ng=15,arcs=[];
  /* the outer double circle in 12 arcs each (so it can draw itself) */
  for(const[rr,ww]of[[R,w],[R*.86,w*.8]])for(let i=0;i<12;i++){const g=K.g(rot),G=spGeo().ring(rr,ww,h,y,4,i/12*SP_TAU,(i+1)/12*SP_TAU);G.mesh(P.br,g);
    spGeo(true).ring(rr,ww*3,h*.5,y-.004,4,i/12*SP_TAU,(i+1)/12*SP_TAU).mesh(P.add,g);arcs.push({g,k:i/12});}
  const gly=[];for(let i=0;i<Ng;i++){const g=K.g(rot),a=i/Ng*SP_TAU+SP_TAU/Ng/2;spGeo().glyph([0,8,5][i%3],a,R*.93,R*.075,w*.55,h,y).mesh(P.br,g);gly.push({g,k:i/Ng});}
  /* the star (single point towards +z, so it reads inverted from the front); five lines that extend from their start */
  const Rs=R*.86,pt=k=>{const a=k*SP_TAU/5;return[Rs*Math.sin(a),Rs*Math.cos(a)];},order=[0,2,4,1,3],lines=[];
  for(let i=0;i<5;i++){const A=pt(order[i]),B=pt(order[(i+1)%5]),L=Math.hypot(B[0]-A[0],B[1]-A[1]),g=K.g(root,A[0],0,A[1]);g.rotation.y=Math.atan2(B[0]-A[0],B[1]-A[1]);
    const G=spGeo().box(w,h,L+w*.5,0,y+.002,L/2);G.mesh(P.br,g);spGeo().box(w*3,h*.5,L+w,0,y-.002,L/2).mesh(P.add,g);lines.push({g,k:i/5,A,B,L});}
  const inner=K.g(root);spGeo().ring(R*.2,w*.7,h,y,10).mesh(P.mid,inner);
  /* sparks running round the star path, each with a fading tail */
  const per=lines.reduce((s,l)=>s+l.L,0),at=d=>{d=((d%per)+per)%per;for(const l of lines){if(d<=l.L){const k=d/l.L;return[l.A[0]+(l.B[0]-l.A[0])*k,l.A[1]+(l.B[1]-l.A[1])*k];}d-=l.L;}return lines[0].A;};
  const run=[];for(let s=0;s<3;s++)for(let j=0;j<5;j++)run.push({m:K.p(j?P.br:P.hot),s,j});
  /* candles just outside the circle, on the star's points */
  const cs=Math.min(1.6,Math.max(.8,R/1.5)),cand=[];if(o.candles!=='no')for(let i=0;i<5;i++){const a=i*SP_TAU/5,cx=Math.sin(a)*R*1.12,cz=Math.cos(a)*R*1.12,hh=(.16+.08*((i*7)%3)/2)*cs;
    bx(root,.07*cs,hh,.07*cs,vm('wax'),cx,hh/2,cz);bx(root,.012*cs,.03*cs,.012*cs,vm('dark'),cx,hh+.015*cs,cz);bx(root,.1*cs,.012,.1*cs,vm('wax'),cx+.02*cs,.006,cz-.01*cs);cand.push([cx,hh+.03*cs,cz]);}
  cand.forEach((c,i)=>spFire(K,{pal:o.col==='holy'?'fire':o.col,n:7,R:.015*cs,h:.14*cs,sz:.05*cs,x:c[0],y:c[1],z:c[2],seed:300+i,conv:.3,A:(A,cl)=>spCl((A-.85)/.15)}));
  spRise(K,{pal:o.col,n:Math.round(18+R*8),h:R*.6,life:2,sz:.035*Math.max(1,R*.5),em:r=>{if(r()<.5){const a=r()*SP_TAU;return[Math.sin(a)*R,0,Math.cos(a)*R];}const d=at(r()*per);return[d[0],0,d[1]];},A:A=>spCl((A-.6)/.4)});
  /* Summon: the circle flares, a column of light and sparks rises from it and fades */
  const col=K.g(root);spGeo().box(R*.16,1,R*.16,0,.5,0).mesh(P.hot,col);spGeo().box(R*.36,1,R*.36,0,.5,0).mesh(P.addH,col);spGeo().box(R*.62,.85,R*.62,0,.425,0).mesh(P.add,col);
  spRise(K,{pal:o.col,n:24,R:R*.8,h:R*3,life:.8,sz:.05*Math.max(1,R*.5),sv:5,pow:.7,seed:78,A:(A,c,t)=>c==='Summon'?Math.sin(Math.PI*spCl(t/2.4)):0});
  spBurst(K,{pal:o.col,clip:'Summon',n:40,x:0,y:.1,v:R*2.2,up:true,dir:[0,1,0],spread:.8,life:1.4,g:1.5,sz:.07*Math.max(1,R*.5),seed:77});
  K.add((S,t,A,c)=>{S[rot.name]={r:[0,spW(t,8,1)*3/Ng,0]};
    arcs.forEach(a=>S[a.g.name]={s:spCl((A*2.6-a.k)*6)>1e-3?Math.max(1e-4,spCl((A*2.6-a.k)*6)):1e-4});
    lines.forEach(l=>{const k=spCl((A-.35-l.k*.08)/.1);S[l.g.name]={s:[1,1,Math.max(1e-4,k)]};});
    gly.forEach(g=>{const k=spCl((A-.72-g.k*.18)/.06);S[g.g.name]={s:Math.max(1e-4,k)};});S[inner.name]={s:Math.max(1e-4,spCl((A-.85)/.15))};
    run.forEach(q=>{const d=spW(t,8,2)/SP_TAU*per+q.s*per/3-q.j*w*1.6,p=at(d);S[q.m.name]={p:[p[0],y+.03,p[1]],s:A>.95?w*(1.8-q.j*.28):1e-4};});
    const sc=c==='Summon'?Math.sin(Math.PI*spCl(t/2.4)):0;S[col.name]={s:sc>1e-3?[1+sc*.2,R*3.2*sc,1+sc*.2]:1e-4};});
  K.light(P.l,1.2,R*4+3,0,.6,0);K.lf=(t,A,c)=>A*(.8+.1*Math.sin(spW(t,8,9)))+(c==='Summon'?2.2*Math.sin(Math.PI*spCl(t/2.4)):0);
  root.userData.ground=Math.max(2.4,R*1.4);
  return spFinish(K,{start:2.6,end:1.6,extra:[{name:'Summon',dur:2.6,next:'Idle',fn:(t,S,step)=>step(S,t,1,'Summon')}]});}
FX('pentagram','ground','Pentagram',fxPentagram,'A summoning circle to put under a creature: scorched ground, a double circle with runes that slowly turns, an inverted star with sparks running along its lines, and candles on the points. Clips: Idle, Start (draws itself: circles, then the star line by line, then the runes and candles), End, Summon (the circle flares and a column of light rises).',
  {opts:[spCol(['hell','blood','fel','shadow','arcane','soul','necro','holy']),SP_SIZE,{key:'candles',label:'Candles',choices:[['yes','Yes'],['no','No']],def:'yes'}]});

/* Rune circle: three rings turning in turn, two bands of runes, a star of two squares in the middle */
function fxRuneCircle(_s,o){const root=new THREE.Group();root.userData.lights=[];const R=spR(o),P=spPal(o.col),K=spKit(root,8),y=.012,w=Math.max(.03,R*.025),h=.018,rings=[];
  const mk=(fn,k,spd,mat)=>{const g=K.g(root),G=spGeo();fn(G);G.mesh(mat||P.br,g);const H=spGeo(true);fn(H,3);H.mesh(P.add,g);rings.push({g,k,spd});return g;};
  mk((G,f=1)=>{G.ring(R,w*f,h,y,48);G.ring(R*.92,w*.6*f,h,y,48);for(let i=0;i<16;i++)if(f===1)G.glyph(i*3+1,i/16*SP_TAU,R*.96,R*.05,w*.5,h,y);},0,1);
  mk((G,f=1)=>{G.ring(R*.74,w*f,h,y,40);for(let i=0;i<8;i++){const a=i/8*SP_TAU;G.flat(Math.sin(a)*R*.74,Math.cos(a)*R*.74,Math.sin(a)*R*.92,Math.cos(a)*R*.92,w*.6*f,h,y);}
    for(let i=0;i<12;i++)if(f===1)G.glyph(i*5+2,(i+.5)/12*SP_TAU,R*.66,R*.06,w*.5,h,y);},.3,-1);
  mk((G,f=1)=>{const r2=R*.56;for(const a0 of[0,Math.PI/4])for(let i=0;i<4;i++){const a=a0+i*Math.PI/2,b=a+Math.PI/2;G.flat(Math.sin(a)*r2,Math.cos(a)*r2,Math.sin(b)*r2,Math.cos(b)*r2,w*.7*f,h,y);}
    G.ring(R*.24,w*.8*f,h,y,20);G.ring(R*.12,w*.6*f,h,y,12);},.6,2,P.mid);
  spRise(K,{pal:o.col,n:Math.round(14+R*8),h:R*.5,life:2,sz:.03*Math.max(1,R*.5),em:r=>{const a=r()*SP_TAU,rr=[R,R*.74,R*.24][Math.floor(r()*3)];return[Math.sin(a)*rr,0,Math.cos(a)*rr];},A:A=>spCl((A-.6)/.4)});
  /* Pulse: a ring of light runs outward, sparks spring up */
  const wave=K.g(root);spGeo().ring(1,.05,.03,y+.01,40).mesh(P.hot,wave);spGeo(true).ring(1,.16,.02,y,40).mesh(P.addB,wave);
  spBurst(K,{pal:o.col,clip:'Pulse',n:30,y:.05,v:R*1.6,flat:true,life:.9,sz:.05*Math.max(1,R*.5),seed:91});
  K.add((S,t,A,c)=>{rings.forEach(q=>{const k=spCl((A-q.k*.6)/.4);S[q.g.name]={s:Math.max(1e-4,spSm(k)),r:[0,spW(t,8,q.spd)/12,0]};});
    const u=c==='Pulse'?spCl(t/1.2):1;S[wave.name]={s:u<1?[R*(.2+1.1*u),1,R*(.2+1.1*u)]:1e-4};});
  K.light(P.l,1.1,R*4+3,0,.6,0);K.lf=(t,A,c)=>A*(.85+.08*Math.sin(spW(t,8,6)))+(c==='Pulse'?1.6*(1-spCl(t/1.2)):0);root.userData.ground=Math.max(2.4,R*1.4);
  return spFinish(K,{start:1.6,end:1.2,extra:[{name:'Pulse',dur:1.4,next:'Idle',fn:(t,S,step)=>step(S,t,1,'Pulse')}]});}
FX('rune-circle','ground','Rune circle',fxRuneCircle,'An arcane casting circle for under a caster: three rings that turn in turn, two bands of runes and a star of two squares in the middle; motes rise from the rings. Clips: Idle, Start (rings open one by one), End, Pulse (a ring of light runs outward with sparks).',
  {opts:[spCol(['arcane','frost','holy','fel','soul','fire','shadow','blood']),SP_SIZE]});

/* Aura: a soft glowing disc under a figure, a ring of motes circling the feet and motes rising (buffs, auras) */
function fxAura(_s,o){const root=new THREE.Group();root.userData.lights=[];const R=spR(o)*.55,P=spPal(o.col),K=spKit(root,4),y=.01,disc=K.g(root);
  for(const[k,m]of[[1,P.add],[.75,P.add],[.45,P.addB]])spGeo().disc(R*k,y+k*.002,.01,R*.08).mesh(m,disc);spGeo().ring(R,.04*Math.max(1,R*.6),.015,y+.004,36).mesh(P.br,disc);
  spOrbit(K,{pal:o.col,n:Math.round(10+R*6),r:R*.95,y:.12,tilt:.15,sz:.05,kmax:1,seed:5});
  spRise(K,{pal:o.col,n:Math.round(14+R*8),R:R,h:1.6+R*.4,life:1.8,sz:.04,sv:2.2,seed:6});
  K.add((S,t,A)=>{S[disc.name]={s:Math.max(1e-4,A*(1+.04*Math.sin(spW(t,4,2)))),r:[0,spW(t,4,1)/8,0]};});
  K.light(P.l,.8,R*3+2,0,.5,0);root.userData.ground=Math.max(2,R*1.6);return spFinish(K,{start:.8,end:.8});}
FX('aura','ground','Aura',fxAura,'A glowing aura for under a player or a creature (blessings, buffs, rage): a soft disc of light, motes circling the feet and streaks rising. Clips: Idle, Start, End.',
  {opts:[spCol(['holy','arcane','fel','fire','frost','blood','shadow','poison','soul','storm']),SP_SIZE]});

/* Target marker: an area warning, rings closing in and a pulsing edge */
function fxTarget(_s,o){const root=new THREE.Group();root.userData.lights=[];const R=spR(o),P=spPal(o.col),K=spKit(root,2),y=.012,w=Math.max(.04,R*.035);
  const edge=K.g(root);spGeo().ring(R,w,.018,y,48).mesh(P.br,edge);spGeo(true).ring(R,w*3,.01,y-.004,48).mesh(P.add,edge);
  const fill=K.g(root);spGeo().disc(R,y-.006,.006,R*.1).mesh(spM(P.c[2],'add',.12),fill);
  const waves=[0,1,2].map(i=>{const g=K.g(root);spGeo().ring(1,w*.7,.014,y+.002,40).mesh(P.mid,g);return{g,ph:i/3};});
  K.add((S,t,A)=>{S[edge.name]={s:Math.max(1e-4,A*(1+.03*Math.sin(spW(t,2,4))))};S[fill.name]={s:Math.max(1e-4,A)};
    waves.forEach(q=>{const u=spTau(t,2,1,q.ph),k=R*(1-u)*A;S[q.g.name]={s:k>1e-3?[k,1,k]:1e-4};});});
  root.userData.ground=Math.max(2,R*1.3);return spFinish(K,{start:.4,end:.4});}
FX('target','ground','Target marker',fxTarget,'An area-of-effect warning on the ground: a glowing edge with rings closing in towards the centre. Clips: Idle, Start, End.',
  {opts:[spCol(['blood','fire','arcane','fel','holy','frost','storm']),SP_SIZE]});

/* ======================= hand casts (anchor on the palm) ======================= */
/* Flame in hand: a fire burning on the palm; Cast: it flares and a gout of fire bursts forward */
function fxHandFlame(_s,o){const{root,A}=spRootFor(o,spHandStand),P=spPal(o.col),K=spKit(root,3);
  spFire(K,{pal:o.col,par:A,n:42,R:.08,h:.32,sz:.06,y:-.12,smoke:6,embers:8,conv:.7,seed:3,A:(a,c,t)=>c==='Cast'?1+.6*Math.sin(Math.PI*spCl(t/.5)):a});
  spBurst(K,{pal:o.col,par:A,clip:'Cast',t0:.25,n:36,y:0,v:6,dir:[0,.1,1],spread:.25,life:.7,drag:1.5,sz:.09,grow:1.5,seed:9,mats:[P.hot,P.br,P.br,P.mid,P.mid,P.dk]});
  K.light(P.l,1.2,6,0,.15,0,A);K.lf=(t,A_,c)=>A_*(.8+.12*Math.sin(spW(t,3,11))+.08*Math.sin(spW(t,3,17)))+(c==='Cast'?1.5*Math.sin(Math.PI*spCl(t/.9)):0);
  return spFinish(K,{start:.5,end:.6,extra:[{name:'Cast',dur:1.2,next:'Idle',fn:(t,S,step)=>step(S,t,1,'Cast')}]});}
FX('hand-flame','hand','Flame in hand',fxHandFlame,'A fire burning on an open palm, with smoke and embers. Clips: Idle, Start, End, Cast (the flame flares and a gout of fire bursts forward along +z).',{opts:[spCol(['fire','hell','fel','soul','frost','shadow','arcane']),SP_MOUNT]});

/* Crackling hand: a small charged orb, arcs flicking out to the fingers and the air; Cast: a bolt shoots forward */
function fxHandLightning(_s,o){const{root,A}=spRootFor(o,spHandStand),P=spPal(o.col),K=spKit(root,2);
  spOrb(K,{pal:o.col,par:A,r:.06,y:.02,spin:3,pulse:8});
  spBolts(K,{pal:o.col,par:A,n:8,w:.02,jag:.3,lv:3,branch:1,from:()=>[0,.02,0],to:r=>{const v=spInBall(r,1);const d=Math.hypot(...v)||1;return[v[0]/d*.32,Math.abs(v[1]/d)*.2+.02-.08*r(),v[2]/d*.32];},rate:16,seed:12});
  const shot=spBolts(K,{pal:o.col,par:A,n:3,w:.03,jag:.12,lv:5,branch:3,from:()=>[0,.02,.05],to:r=>[(r()-.5)*.6,.1+(r()-.5)*.4,7],seed:13,
    vis:(k,t,A_,c)=>c==='Cast'&&t>.2&&t<.75&&Math.floor(t*20)%3===k?1:0});
  spOrbit(K,{pal:o.col,par:A,n:10,r:.16,y:.02,sz:.018,kmax:4,seed:14});
  K.light(P.l,1,5,0,.1,0,A);K.lf=(t,A_,c)=>A_*(.6+.5*spHash(Math.floor(t*16)%32))+(c==='Cast'&&t>.2&&t<.75?2.5:0);
  return spFinish(K,{start:.4,end:.4,extra:[{name:'Cast',dur:1,next:'Idle',fn:(t,S,step)=>step(S,t,1,'Cast')}]});}
FX('hand-lightning','hand','Crackling hand',fxHandLightning,'A small charged orb on the palm with arcs of lightning flicking out and sparks circling. Clips: Idle, Start, End, Cast (a forked bolt shoots 7 m forward along +z).',{opts:[spCol(['storm','arcane','fel','blood','shadow']),SP_MOUNT]});

/* Magic orb in hand: a floating orb with circling motes; Cast: it swells and sends out a shock ring */
function fxHandOrb(_s,o){const{root,A}=spRootFor(o,spHandStand),P=spPal(o.col),K=spKit(root,4);
  const orb=spOrb(K,{pal:o.col,par:A,r:.08,y:.06,spin:1,pulse:4,A:(a,c,t)=>c==='Cast'?1+.7*Math.sin(Math.PI*spCl(t/.6)):a});
  spOrbit(K,{pal:o.col,par:A,n:14,r:.2,y:.06,sz:.022,seed:15});spRise(K,{pal:o.col,par:A,n:8,R:.06,h:.35,life:1,sz:.02,y:.06,seed:16});
  const ring=K.g(A,0,.06,0);spGeo().ring(1,.03,.03,0,28).mesh(P.br,ring);spGeo(true).ring(1,.09,.02,0,28).mesh(P.add,ring);
  spBurst(K,{pal:o.col,par:A,clip:'Cast',t0:.5,n:24,y:.06,v:2.4,life:.6,sz:.04,seed:17});
  K.add((S,t,A_,c)=>{const u=c==='Cast'?spCl((t-.45)/.5):1;S[ring.name]={s:u<1?[.1+1.6*u,1,.1+1.6*u]:1e-4,r:[.25,0,0]};});
  K.light(P.l,1,5,0,.1,0,A);K.lf=(t,A_,c)=>A_*(.85+.1*Math.sin(spW(t,4,4)))+(c==='Cast'?1.4*Math.sin(Math.PI*spCl(t/.9)):0);
  return spFinish(K,{start:.6,end:.6,extra:[{name:'Cast',dur:1.2,next:'Idle',fn:(t,S,step)=>step(S,t,1,'Cast')}]});}
FX('hand-orb','hand','Magic orb',fxHandOrb,'A floating orb of magic above the palm, breathing and turning, with motes circling it. Clips: Idle, Start, End, Cast (the orb swells and a shock ring and sparks burst out).',
  {opts:[spCol(['arcane','shadow','holy','blood','soul','frost','fel','fire','necro']),SP_MOUNT]});

/* Shadow grasp: dark wisps spiralling into the palm, a black core, smoke falling off the fingers */
function fxHandShadow(_s,o){const{root,A}=spRootFor(o,spHandStand),P=spPal(o.col),K=spKit(root,3);
  spOrb(K,{pal:o.col,par:A,r:.07,y:.05,spin:2,coreM:spM(P.c[4]),shellM:P.soft});
  spSwirl(K,{pal:o.col,par:A,n:30,R:.45,y:.05,yr:.4,turns:1.5,life:1,sz:.04,seed:18,mats:[P.br,P.mid,P.mid,P.dk,spM(P.c[4])]});
  spRise(K,{pal:o.col,par:A,n:10,R:.1,h:-.45,life:1.5,sz:.05,y:-.02,mats:[P.sm,spM(P.c[3],'soft')],seed:19});
  spBurst(K,{pal:o.col,par:A,clip:'Cast',t0:.3,n:30,y:.05,v:5,dir:[0,0,1],spread:.35,life:.8,drag:1.6,sz:.08,grow:1,seed:20,mats:[P.dk,P.mid,spM(P.c[4]),P.br]});
  K.light(P.l,.8,4,0,.1,0,A);
  return spFinish(K,{start:.6,end:.6,extra:[{name:'Cast',dur:1.2,next:'Idle',fn:(t,S,step)=>step(S,t,1,'Cast')}]});}
FX('hand-shadow','hand','Shadow grasp',fxHandShadow,'Dark magic gathering in the hand: wisps spiral in to a black core and smoke drips off the fingers. Clips: Idle, Start, End, Cast (a burst of shadow forward along +z).',{opts:[spCol(['shadow','necro','blood','arcane']),SP_MOUNT]});

/* Blood orb: a ball of blood turning over the palm, drops circling and dripping down */
function fxHandBlood(_s,o){const{root,A}=spRootFor(o,spHandStand),P=spPal(o.col),K=spKit(root,3);
  spOrb(K,{pal:o.col,par:A,r:.08,y:.07,spin:2,coreM:P.mid,shellM:spM(P.c[3],'soft',.7)});
  spOrbit(K,{pal:o.col,par:A,n:12,r:.18,y:.07,sz:.03,tilt:.6,seed:21,mats:[P.mid,P.dk,P.br]});
  spPS(K,{n:6,seed:22,par:A,init:r=>({mat:r()<.5?P.mid:P.dk,x:(r()-.5)*.14,z:(r()-.5)*.14,P:1,sz:.025+.015*r()}),f:(q,u,t,a)=>({p:[q.x,.02-.4*u*u,q.z],s:a>1e-3?[q.sz*a,q.sz*a*(1+u),q.sz*a]:1e-4})});
  spBurst(K,{pal:o.col,par:A,clip:'Cast',t0:.3,n:30,y:.07,v:5,dir:[0,.1,1],spread:.3,life:.8,drag:1.2,g:3,sz:.05,seed:23,mats:[P.mid,P.dk,P.br]});
  K.light(P.l,.8,4,0,.1,0,A);
  return spFinish(K,{start:.6,end:.6,extra:[{name:'Cast',dur:1.2,next:'Idle',fn:(t,S,step)=>step(S,t,1,'Cast')}]});}
FX('hand-blood','hand','Blood orb',fxHandBlood,'Blood magic: a ball of blood turning over the palm, drops circling it and dripping off. Clips: Idle, Start, End, Cast (a spray of blood forward along +z).',{opts:[spCol(['blood','necro','shadow']),SP_MOUNT]});

/* Frost in hand: ice shards circling a cold core, mist rolling down off the hand */
function fxHandFrost(_s,o){const{root,A}=spRootFor(o,spHandStand),P=spPal(o.col),K=spKit(root,4);
  spOrb(K,{pal:o.col,par:A,r:.06,y:.06,spin:1});
  spPS(K,{n:9,seed:24,par:A,init:(r,i)=>({mat:i%3?P.br:P.hot,a0:i/9*SP_TAU,rad:.16+.05*r(),yy:.03+.08*r(),k:i%2?1:-1,h:.08+.06*r(),P:4,rot:[r(),r(),r()]}),
    f:(q,u,t,a)=>{const an=q.a0+spW(t,4,q.k);return{p:[Math.cos(an)*q.rad,q.yy+.03*Math.sin(spW(t,4,2)+q.a0),Math.sin(an)*q.rad],s:a>1e-3?[.025*a,q.h*a,.025*a]:1e-4,r:[spW(t,4,1)+q.a0,an,.4]};}});
  spRise(K,{pal:o.col,par:A,n:12,R:.12,h:-.5,life:2,sz:.07,y:-.02,mats:[spM(P.c[4],'smoke',.4),spM(P.c[1],'soft',.35)],wig:.08,seed:25});
  spBurst(K,{pal:o.col,par:A,clip:'Cast',t0:.3,n:24,y:.06,v:6,dir:[0,.05,1],spread:.2,life:.7,drag:1,sz:.05,seed:26,mats:[P.hot,P.br,P.mid]});
  K.light(P.l,.8,4,0,.1,0,A);
  return spFinish(K,{start:.6,end:.6,extra:[{name:'Cast',dur:1.2,next:'Idle',fn:(t,S,step)=>step(S,t,1,'Cast')}]});}
FX('hand-frost','hand','Frost in hand',fxHandFrost,'Ice shards circling a cold glowing core over the palm, frosty mist rolling down off the hand. Clips: Idle, Start, End, Cast (a spray of ice forward along +z).',{opts:[spCol(['frost','soul','arcane']),SP_MOUNT]});

/* Shining hand: a radiant light with turning rays and sparkles */
function fxHandLight(_s,o){const{root,A}=spRootFor(o,spHandStand),P=spPal(o.col),K=spKit(root,6);
  spOrb(K,{pal:o.col,par:A,r:.07,y:.08,spin:1,pulse:6});
  const rays=K.g(A,0,.08,0);const G=spGeo(),H=spGeo(true);for(let i=0;i<10;i++){const a=i/10*SP_TAU,el=(i%2?.5:-.3),L=i%2?.34:.5,d=[Math.cos(a)*Math.cos(el),Math.sin(el),Math.sin(a)*Math.cos(el)];
    G.line([d[0]*.08,d[1]*.08,d[2]*.08],[d[0]*L,d[1]*L,d[2]*L],.014);H.line([d[0]*.08,d[1]*.08,d[2]*.08],[d[0]*L*.9,d[1]*L*.9,d[2]*L*.9],.045);}G.mesh(P.br,rays);H.mesh(P.add,rays);
  spRise(K,{pal:o.col,par:A,n:14,R:.25,h:.5,life:1.5,sz:.025,y:-.05,seed:27});
  K.add((S,t,A_,c)=>{const s=c==='Cast'?1+1.2*Math.sin(Math.PI*spCl(t/.8)):A_;S[rays.name]={s:Math.max(1e-4,s*(1+.08*Math.sin(spW(t,6,6)))),r:[0,spW(t,6,1),0]};});
  spBurst(K,{pal:o.col,par:A,clip:'Cast',t0:.2,n:30,y:.08,v:3,life:.8,sz:.035,seed:28});
  K.light(P.l,1.2,6,0,.1,0,A);K.lf=(t,A_,c)=>A_*(.9+.1*Math.sin(spW(t,6,6)))+(c==='Cast'?1.8*Math.sin(Math.PI*spCl(t/.8)):0);
  return spFinish(K,{start:.6,end:.6,extra:[{name:'Cast',dur:1.2,next:'Idle',fn:(t,S,step)=>step(S,t,1,'Cast')}]});}
FX('hand-light','hand','Shining hand',fxHandLight,'Radiant light held in the hand: a bright core, turning rays and sparkles. Clips: Idle, Start, End, Cast (a blinding flash of light and sparkles).',{opts:[spCol(['holy','frost','arcane','soul','fire']),SP_MOUNT]});

/* ======================= staff tips (anchor at the tip) ======================= */
function fxStaffOrb(_s,o){const{root,A}=spRootFor(o,spStaffStand),P=spPal(o.col),K=spKit(root,4);
  spOrb(K,{pal:o.col,par:A,r:.09,spin:1,pulse:4,A:(a,c,t)=>c==='Cast'?1+.8*Math.sin(Math.PI*spCl(t/.7)):a});
  const rg=[0,1].map(i=>{const g=K.g(A);spGeo().ring(.2+i*.05,.02,.02,0,24).mesh(i?P.mid:P.br,g);return g;});
  spOrbit(K,{pal:o.col,par:A,n:12,r:.3,sz:.025,seed:29});spRise(K,{pal:o.col,par:A,n:10,R:.1,h:.6,life:1.4,sz:.025,seed:30});
  spBurst(K,{pal:o.col,par:A,clip:'Cast',t0:.4,n:30,v:4,dir:[0,.4,1],spread:.5,life:.7,sz:.05,seed:31});
  K.add((S,t,A_,c)=>{rg.forEach((g,i)=>{S[g.name]={s:Math.max(1e-4,A_),r:[.9+i*.5,spW(t,4,i?-2:1),.3-i*.6]};});});
  K.light(P.l,1.2,6,0,0,0,A);K.lf=(t,A_,c)=>A_*(.85+.1*Math.sin(spW(t,4,4)))+(c==='Cast'?1.6*Math.sin(Math.PI*spCl(t/1)):0);
  return spFinish(K,{start:.6,end:.6,extra:[{name:'Cast',dur:1.2,next:'Idle',fn:(t,S,step)=>step(S,t,1,'Cast')}]});}
FX('staff-orb','staff','Staff orb',fxStaffOrb,'A glowing orb held in the prongs of a staff, two tilted rings turning round it, motes circling and rising. Clips: Idle, Start, End, Cast (it flares and throws sparks forward).',
  {opts:[spCol(['arcane','frost','fel','holy','blood','shadow','soul','fire','necro']),SP_MOUNT]});

function fxStaffStorm(_s,o){const{root,A}=spRootFor(o,spStaffStand),P=spPal(o.col),K=spKit(root,2);
  spOrb(K,{pal:o.col,par:A,r:.07,spin:3,pulse:8});
  spBolts(K,{pal:o.col,par:A,n:8,w:.022,jag:.3,lv:3,branch:1,from:()=>[0,0,0],to:r=>{const a=r()*SP_TAU,el=.2+r()*1.1;return[Math.cos(a)*Math.cos(el)*.6,Math.sin(el)*.6,Math.sin(a)*Math.cos(el)*.6];},rate:14,seed:32});
  spBolts(K,{pal:o.col,par:A,n:4,w:.012,jag:.15,lv:4,branch:0,from:()=>[0,-.05,0],to:r=>[(r()-.5)*.1,-.8-r()*.6,(r()-.5)*.1],rate:10,duty:.05,seed:33});
  spOrbit(K,{pal:o.col,par:A,n:12,r:.28,sz:.02,kmax:4,seed:34});
  const shot=spBolts(K,{pal:o.col,par:A,n:3,w:.035,jag:.12,lv:5,branch:3,from:()=>[0,0,.05],to:r=>[(r()-.5)*.8,(r()-.5)*.6,8],seed:35,vis:(k,t,A_,c)=>c==='Cast'&&t>.25&&t<.85&&Math.floor(t*20)%3===k?1:0});
  K.light(P.l,1,6,0,0,0,A);K.lf=(t,A_,c)=>A_*(.55+.55*spHash(Math.floor(t*14)%28))+(c==='Cast'&&t>.25&&t<.85?2.5:0);
  return spFinish(K,{start:.4,end:.4,extra:[{name:'Cast',dur:1.1,next:'Idle',fn:(t,S,step)=>step(S,t,1,'Cast')}]});}
FX('staff-storm','staff','Storm staff',fxStaffStorm,'Lightning crackling off a staff tip: a charged orb, arcs flicking out and running down the shaft, sparks circling. Clips: Idle, Start, End, Cast (a forked bolt shoots 8 m forward along +z).',
  {opts:[spCol(['storm','arcane','fel','blood','shadow']),SP_MOUNT]});

function fxStaffFlame(_s,o){const{root,A}=spRootFor(o,spStaffStand),P=spPal(o.col),K=spKit(root,3);
  spFire(K,{pal:o.col,par:A,n:40,R:.09,h:.4,sz:.07,y:-.06,smoke:6,embers:8,conv:.65,seed:36,A:(a,c,t)=>c==='Cast'?1+.7*Math.sin(Math.PI*spCl(t/.5)):a});
  spBurst(K,{pal:o.col,par:A,clip:'Cast',t0:.25,n:36,y:.1,v:6,dir:[0,.2,1],spread:.25,life:.7,drag:1.5,sz:.09,grow:1.5,seed:37,mats:[P.hot,P.br,P.br,P.mid,P.mid,P.dk]});
  K.light(P.l,1.2,6,0,.2,0,A);K.lf=(t,A_,c)=>A_*(.8+.12*Math.sin(spW(t,3,11))+.08*Math.sin(spW(t,3,17)))+(c==='Cast'?1.5*Math.sin(Math.PI*spCl(t/.9)):0);
  return spFinish(K,{start:.5,end:.6,extra:[{name:'Cast',dur:1.2,next:'Idle',fn:(t,S,step)=>step(S,t,1,'Cast')}]});}
FX('staff-flame','staff','Flaming staff',fxStaffFlame,'A fire burning in the prongs of a staff like a torch, with smoke and embers. Clips: Idle, Start, End, Cast (a gout of fire forward along +z).',{opts:[spCol(['fire','hell','fel','soul','shadow','arcane']),SP_MOUNT]});

function fxStaffVortex(_s,o){const{root,A}=spRootFor(o,spStaffStand),P=spPal(o.col),K=spKit(root,3);
  spOrb(K,{pal:o.col,par:A,r:.07,spin:2,coreM:spM(P.c[4]),shellM:P.soft});
  spSwirl(K,{pal:o.col,par:A,n:40,R:.6,yr:.5,turns:2,life:1.2,sz:.045,seed:38,mats:[P.br,P.mid,P.mid,P.dk,spM(P.c[4])]});
  spSwirl(K,{pal:o.col,par:A,n:16,R:.9,yr:.1,turns:1,life:1.5,sz:.07,flat:true,squash:1,seed:39,mats:[P.sm]});
  spBurst(K,{pal:o.col,par:A,clip:'Cast',t0:.3,n:30,v:5,dir:[0,0,1],spread:.35,life:.8,drag:1.6,sz:.08,grow:1,seed:40,mats:[P.dk,P.mid,spM(P.c[4]),P.br]});
  K.light(P.l,.9,5,0,0,0,A);
  return spFinish(K,{start:.6,end:.6,extra:[{name:'Cast',dur:1.2,next:'Idle',fn:(t,S,step)=>step(S,t,1,'Cast')}]});}
FX('staff-vortex','staff','Vortex staff',fxStaffVortex,'Dark power sucked into a staff tip: wisps and smoke spiral in to a black core. Clips: Idle, Start, End, Cast (a burst of shadow forward along +z).',{opts:[spCol(['shadow','necro','blood','arcane','fel']),SP_MOUNT]});

/* Soul staff: ghostly wisps with trailing tails circling the staff head */
function fxStaffSouls(_s,o){const{root,A}=spRootFor(o,spStaffStand),P=spPal(o.col),K=spKit(root,4);
  spOrb(K,{pal:o.col,par:A,r:.06,spin:1});const W=[];
  for(let i=0;i<5;i++){const tail=[];for(let j=0;j<6;j++)tail.push(K.p(j===0?P.hot:j<3?P.br:P.soft,A));W.push({tail,k:i%2?1:-1,a0:i/5*SP_TAU,rad:.25+.06*(i%3),yy:-.1+.08*i,tl:.25+.04*i});}
  K.add((S,t,A_)=>{for(const w of W)w.tail.forEach((m,j)=>{const an=w.a0+spW(t,4,w.k)-w.k*j*.14,yy=w.yy+.06*Math.sin(an*2+w.a0);
    S[m.name]={p:[Math.cos(an)*w.rad*A_,yy,Math.sin(an)*w.rad*A_],s:A_>1e-3?.05*(1-j*.13)*A_:1e-4};});});
  spRise(K,{pal:o.col,par:A,n:8,R:.15,h:.5,life:1.4,sz:.02,seed:41});
  K.light(P.l,.9,5,0,0,0,A);return spFinish(K,{start:.6,end:.6});}
FX('staff-souls','staff','Soul staff',fxStaffSouls,'Ghostly wisps with trailing tails circling the head of a staff around a pale light. Clips: Idle, Start, End.',{opts:[spCol(['soul','necro','shadow','arcane','blood']),SP_MOUNT]});
