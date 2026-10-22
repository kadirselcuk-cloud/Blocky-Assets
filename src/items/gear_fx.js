/* ======================= GEAR KIT, part 2: effects on weapons, shields and armour (docs/GEAR.md) =======================
   Weapon and shield effects: glow, burning, lightning, frost, dripping venom, smoke, pulsing runes, radiant. Armour (protection) effects:
   armour glow, ward bubble, rune rings, flame, frost, holy, shadow, storm and poison auras. Each has a colour (any spell school, or the
   effect's own) and a strength (faint to blazing: count, size, glow and light).
   Particles are the spells' unit cubes. Their motion is baked into every clip of the asset (gfBake): each clip is sampled at 30 fps, the
   emitter (the weapon, the shield or the worn gear) is read from the pose, and every particle is born on the emitter where it was at its
   birth time, so flames trail behind a swing and smoke rises straight up whatever the blade does. Particle periods divide the clip
   length, so loops never pop. Halo shells (the glow) are children of the glowing boxes and need no tracks. Everything exports in the GLB.
   Particles, shells and lights carry userData.fx (the character check skips them). */
const GF_STR={faint:['Faint',.45],low:['Low',.7],medium:['Medium',1],high:['High',1.45],blazing:['Blazing',2.1]};
const GF_WFX={none:'None',glow:'Glow',burn:'Burning',spark:'Lightning',frost:'Frost',drip:'Dripping venom',smoke:'Smoke',runes:'Pulsing runes',holy:'Radiant'};
const GF_AFX={none:'None',glow:'Armour glow',ward:'Ward bubble',runes:'Rune rings',flames:'Flame aura',frost:'Frost aura',holy:'Holy radiance',shadow:'Shadow aura',storm:'Storm aura',poison:'Poison miasma'};
const GF_OWN={glow:'arcane',burn:'fire',spark:'storm',frost:'frost',drip:'poison',smoke:'shadow',runes:'arcane',holy:'holy',ward:'soul',flames:'fire',shadow:'shadow',storm:'storm',poison:'poison'};
const GF_COLS=Object.assign({auto:"Effect's own"},Object.fromEntries(Object.entries(SP_PAL).map(([k,v])=>[k,v.n])));
const GF_STRN=Object.fromEntries(Object.entries(GF_STR).map(([k,v])=>[k,v[0]]));
/* recipes: b behaviour, n count at medium, P life (s), s size (m), m material keys of the spell palette (spPal); halo: shell opacity */
const GF_RX={
  glow:{halo:.34,tint:.3,light:1.2,e:[{b:'mote',n:20,P:1.6,s:.026,m:['hot','br','mid']}]},
  burn:{halo:.16,tint:.12,light:1.5,e:[{b:'rise',n:52,P:.5,s:.058,m:['hot','br','br','mid','mid','dk']},{b:'ember',n:14,P:.8,s:.016,m:['hot','br']},{b:'smoke',n:8,P:1.3,s:.07,m:['sm'],min:1.2}]},
  spark:{halo:.2,tint:.22,light:1.2,e:[{b:'arc',n:30,seg:5,P:.16,s:.018,m:['hot','br']},{b:'ember',n:14,P:.35,s:.014,m:['hot']}]},
  frost:{halo:.28,tint:.24,light:.8,e:[{b:'mist',n:26,P:1.4,s:.06,m:['soft','softB']},{b:'mote',n:14,P:2,s:.022,m:['hot','br']}]},
  drip:{halo:.16,tint:.2,light:.6,e:[{b:'drip',n:18,P:.9,s:.024,m:['mid','br']},{b:'mote',n:10,P:1,s:.02,m:['br']}]},
  smoke:{tint:.1,light:.3,e:[{b:'smoke',n:26,P:1.3,s:.08,m:['sm','sm','dk']},{b:'mote',n:6,P:1.4,s:.02,m:['mid']}]},
  runes:{halo:.16,tint:.12,light:.7,e:[{b:'rune',n:30,P:1.2,s:.026,m:['hot','br']}]},
  holy:{halo:.3,tint:.28,light:1.2,e:[{b:'sparkle',n:24,P:1.4,s:.024,m:['hot','br']},{b:'mote',n:10,P:1.8,s:.022,m:['br']}]}};
const GF_AX={
  glow:{halo:.22,tint:.18,light:1,e:[{b:'mote',n:30,P:2,s:.028,m:['hot','br','mid']}]},
  ward:{light:1,e:[{b:'bubble',n:90,P:2,s:.12,m:['add','addB']},{b:'gring',n:18,P:2,s:.055,r:.62,m:['br','mid']}]},
  runes:{light:1,e:[{b:'ring',n:16,r:.78,y:'g',dir:1,P:2,s:.08,m:['br','mid']},{b:'ring',n:12,r:.56,y:-.1,dir:-1,P:2,s:.065,m:['hot','br']},{b:'ring',n:12,r:.5,y:.42,dir:1,P:2,s:.06,m:['br','mid']}]},
  flames:{halo:.1,light:1.5,e:[{b:'rise',n:100,P:.65,s:.1,up:1.5,m:['hot','br','br','mid','mid','dk']},{b:'ember',n:16,P:.9,s:.018,m:['hot','br']},{b:'gflame',n:20,r:.5,P:.55,s:.08,m:['br','mid','dk']}]},
  frost:{halo:.14,tint:.12,light:.9,e:[{b:'mist',n:40,P:1.6,s:.065,m:['soft','softB']},{b:'spiral',n:24,P:2.4,s:.028,m:['hot','br']},{b:'gring',n:14,P:2,s:.065,r:.55,m:['softB','br']}]},
  holy:{halo:.14,light:1.3,e:[{b:'gsparkle',n:40,r:.5,P:1.8,s:.03,m:['hot','br']},{b:'mote',n:16,P:2,s:.026,m:['br']},{b:'gring',n:16,P:2,s:.055,r:.6,m:['br','mid']}]},
  shadow:{light:.5,e:[{b:'smoke',n:48,P:1.6,s:.1,m:['sm','dk','sm','mid']},{b:'gring',n:14,P:2,s:.065,r:.55,m:['dk','mid']}]},
  storm:{halo:.12,light:1.3,e:[{b:'arc',n:60,seg:6,P:.18,s:.03,m:['hot','br']},{b:'ember',n:16,P:.4,s:.016,m:['hot']}]},
  poison:{light:.7,e:[{b:'gbubble',n:34,r:.55,P:1.5,s:.04,m:['br','mid']},{b:'mist',n:22,P:1.6,s:.065,m:['soft']}]}};
/* the business end of each weapon (local z from which it glows or burns) */
const GF_WZ={sword:.1,falchion:.1,mace:.45,axe:.4,longsword:.12,broadsword:.1,scimitar:.1,shortsword:.1,dagger:.07,rapier:.1,cleaver:.1,hammer:.42,morningstar:.44,pick:.42,handaxe:.28,doubleaxe:.4,club:.3,sceptre:.45,torch:.4};
const GF_TAU=Math.PI*2,GF_FPS=30;

/* spawn points on the surfaces of meshes, area-weighted: {o: parent object, v: point and n: normal in its frame} */
function gfPoints(meshes,count,seed){const r=mulberry32(seed),A=[],V3=THREE.Vector3;let tot=0;
  for(const m of meshes){const g=m.geometry.parameters;if(!g||g.width===undefined)continue;m.updateMatrix();const a=g.width*g.height+g.height*g.depth+g.width*g.depth;tot+=a;A.push([m,g,tot]);}
  const out=[];if(!A.length)return out;
  for(let i=0;i<count;i++){const x=r()*tot;let k=0;while(A[k][2]<x)k++;const[m,g]=A[k],ax=Math.floor(r()*3),sg=r()<.5?-1:1,p=new V3((r()-.5)*g.width,(r()-.5)*g.height,(r()-.5)*g.depth),n=new V3();
    if(ax===0){p.x=sg*g.width/2;n.x=sg;}else if(ax===1){p.y=sg*g.height/2;n.y=sg;}else{p.z=sg*g.depth/2;n.z=sg;}
    out.push({o:m.parent,v:p.applyMatrix4(m.matrix),n:n.applyQuaternion(m.quaternion)});}
  return out;}
/* glow shells: a slightly larger back-faced additive copy of every glowing box */
function gfHalo(meshes,hex,op,grow,side=THREE.BackSide){for(const m of meshes){const g=m.geometry.parameters;if(!g||g.width===undefined)continue;
  const h=new THREE.Mesh(new THREE.BoxGeometry(g.width+grow,g.height+grow,g.depth+grow),ltAdd(hex,op,null,side));h.position.copy(m.position);h.quaternion.copy(m.quaternion);
  h.name='fx_halo';h.userData.fx=true;h.userData.gear=true;m.parent.add(h);}}
function gfLight(root,parent,hex,k,pos){const l=new THREE.PointLight(hex,.9*k,3.2*Math.sqrt(k),2);l.userData.fx=true;if(pos)l.position.set(...pos);parent.add(l);root.userData.lights.push(l);return l;}

/* one effect on one emitter: spec {id, rx (recipe), pal, k, meshes, seed, center:{o, off, R, H}}; makes the particles and the shells,
   returns the particle list for gfBake */
function gfSpec(root,sp){const P=sp.pal,k=sp.k,ks=Math.sqrt(k),rx=sp.rx,parts=[];
  /* halo: a back-faced shell round each box; tint: a thin front-faced shell that makes the box itself look lit */
  if(rx.halo)gfHalo(sp.meshes,P.c[2],Math.min(.7,rx.halo*k),.018+.016*ks);if(rx.tint)gfHalo(sp.meshes,P.c[1],Math.min(.6,rx.tint*k),.004,THREE.FrontSide);
  let pi=0;for(const E of rx.e){if(E.min&&k<E.min)continue;const n=E.b==='arc'?Math.max(E.seg,Math.round(E.n*k/E.seg)*E.seg):Math.max(2,Math.round(E.n*(E.b==='bubble'||/ring/.test(E.b)?1:k)));
    for(let j=0;j<n;j++){const mk=E.m[j%E.m.length],mat=P[mk]||P.br,ms=new THREE.Mesh(SPG,mat);ms.name=`fx_${sp.id}_${pi++}`;ms.userData.fx=true;ms.userData.gear=true;ms.scale.setScalar(1e-4);
      ms.frustumCulled=false;root.add(ms);parts.push({ms,E,j,n,ph:spHash(sp.seed*977+pi*131),s:E.s*ks});}}
  return parts;}

/* sample every clip and add the particle tracks. specs carry their particles (gfSpec) and spawn points; returns new clips (cached per key) */
const GF_CACHE=new WeakMap();
function gfBake(root,clips,specs,key){if(!specs.length)return clips;const V3=THREE.Vector3,Q=THREE.Quaternion;
  /* nodes whose matrices we record: every spawn point parent and every centre */
  const nodes=[],ix=new Map(),nid=o=>{if(!ix.has(o)){ix.set(o,nodes.length);nodes.push(o);}return ix.get(o);};
  for(const sp of specs){sp.pts=gfPoints(sp.meshes,Math.max(24,sp.parts.length*3),sp.seed);for(const p of sp.pts)p.ni=nid(p.o);if(sp.center)sp.center.ni=nid(sp.center.o);}
  /* remember the rest pose, sample with a mixer, put it back */
  const rest=[];root.traverse(o=>rest.push([o,o.position.clone(),o.quaternion.clone(),o.scale.clone()]));
  const mx=new THREE.AnimationMixer(root),out=[];
  for(const c of clips){let cm=GF_CACHE.get(c);if(!cm)GF_CACHE.set(c,cm=new Map());if(cm.has(key)){out.push(cm.get(key));continue;}
    const D=c.duration,nf=Math.max(2,Math.round(D*GF_FPS)+1),loop=!!c.loopMode,F=new Float32Array(nf*nodes.length*16),times=[];
    const a=mx.clipAction(c);a.play();const inv=new THREE.Matrix4();
    for(let f=0;f<nf;f++){const t=f/(nf-1)*D;times.push(t);a.time=t;mx.update(0);root.updateMatrixWorld(true);inv.copy(root.matrixWorld).invert();
      for(let i=0;i<nodes.length;i++){const M=nodes[i].matrixWorld.clone().premultiply(inv);M.toArray(F,(f*nodes.length+i)*16);}}
    a.stop();mx.uncacheAction(c);
    const Mt=new THREE.Matrix4(),fr=t=>{let x=t/D*(nf-1);if(loop){x=((x%(nf-1))+(nf-1))%(nf-1);}else x=Math.max(0,Math.min(nf-1,x));return Math.round(x);};
    const W=(ni,t)=>Mt.fromArray(F,(fr(t)*nodes.length+ni)*16);
    const at=(p,t)=>{const M=W(p.ni,t);return[p.v.clone().applyMatrix4(M),p.n.clone().transformDirection(M)];};
    const tracks=[];
    for(const sp of specs){const pts=sp.pts,C=sp.center,cen=t=>C?new V3(...C.off).applyMatrix4(W(C.ni,t)):new V3();
      for(const q of sp.parts){const E=q.E,P=[],S=[],R=[];let useQ=false;
        for(const t of times){const n=Math.max(1,Math.round(D/E.P)),x=t/D*n+q.ph,cy=((Math.floor(x)%n)+n)%n,u=x-Math.floor(x),Pp=D/n,tb=t-u*Pp;
          const pick=salt=>pts[Math.floor(spHash(q.j*7919+cy*104729+salt*31+sp.seed)*pts.length)];
          const h=s=>spHash(q.j*131+cy*977+s*7+sp.seed*13);let p=new V3(),s=[0,0,0],rq=null;const sz=q.s;
          switch(E.b){
            case'rise':{const[b,nn]=at(pick(0),tb);p.copy(b).addScaledVector(nn,.01+.03*u);p.y+=u*(.22+.1*h(1))*Math.sqrt(sp.k)*(E.up||1);p.x+=Math.sin((u*2+h(2))*GF_TAU)*.02;p.z+=Math.cos((u*2+h(3))*GF_TAU)*.02;
              const v=sz*Math.pow(1-u,.8)*Math.min(1,u/.12);s=[v,v,v];break;}
            case'smoke':{const[b,nn]=at(pick(0),tb);p.copy(b).addScaledVector(nn,.02+.05*u);p.y+=u*.5;p.x+=Math.sin((u+h(2))*GF_TAU)*.05;const v=sz*(.5+u)*(1-u)*1.6;s=[v,v,v];break;}
            case'sparkle':{const[b,nn]=at(pick(0),tb);p.copy(b).addScaledVector(nn,.02);p.y+=u*.4;const v=sz*Math.sin(Math.PI*u);s=[v,v,v];break;}
            case'ember':{const[b,nn]=at(pick(0),tb),dt=u*Pp;p.copy(b).addScaledVector(nn,.3*dt);p.x+=(h(1)-.5)*.5*dt;p.z+=(h(2)-.5)*.5*dt;p.y+=(.5+.4*h(3))*dt-1.2*dt*dt;const v=sz*(1-u);s=[v,v,v];break;}
            case'mist':{const[b,nn]=at(pick(0),tb);p.copy(b).addScaledVector(nn,.04+.12*u);p.y-=.18*u;const v=sz*(.4+u)*(1-u)*2;s=[v,v,v];break;}
            case'drip':{const[b]=at(pick(0),tb),dt=u*Pp*1.2;p.copy(b);p.y-=4.9*dt*dt;const fade=1-Math.max(0,(u-.8)/.2);if(p.y<sz/2){p.y=sz*.15;s=[sz*1.8*fade,sz*.3*fade,sz*1.8*fade];}else s=[sz*fade*.8,sz*fade*1.3,sz*fade*.8];break;}
            case'mote':{const[b,nn]=at(pick(0),t),a2=(u+h(4))*GF_TAU;p.copy(b).addScaledVector(nn,.03+.02*Math.sin(u*GF_TAU));p.x+=Math.cos(a2)*.03;p.z+=Math.sin(a2)*.03;p.y+=.05*u;const v=sz*spEnv(u,.3);s=[v,v,v];break;}
            case'rune':{const pp=pts[q.j%pts.length],[b,nn]=at(pp,t),m=Math.max(1,Math.round(D/E.P));p.copy(b).addScaledVector(nn,.006);const v=sz*(.5+.5*Math.sin(GF_TAU*(m*t/D+q.ph)));s=[v,v,v];break;}
            case'arc':{const a=Math.floor(q.j/E.seg),sg=q.j%E.seg,hh=s2=>spHash(a*131+cy*977+s2*7+sp.seed*13),pA=pts[Math.floor(hh(1)*pts.length)],pB=pts[Math.floor(hh(2)*pts.length)];
              /* a zig-zag polyline from A to B; this particle is one stretched segment of it */
              const A=at(pA,t)[0],B=at(pB,t)[0];if(A.distanceTo(B)>.7)B.lerp(A,1-.7/A.distanceTo(B));const L=A.distanceTo(B),jit=Math.min(.07,L*.25);
              const node=k=>{const v=A.clone().lerp(B,k/E.seg);if(k>0&&k<E.seg){v.x+=(hh(3+k)-.5)*jit*2;v.y+=(hh(9+k)-.5)*jit*2;v.z+=(hh(15+k)-.5)*jit*2;}return v;};
              const a0=node(sg),a1=node(sg+1),dl=a1.clone().sub(a0),len=dl.length();p.copy(a0).add(a1).multiplyScalar(.5);
              const on=hh(20)<.85&&u<.75&&len>1e-4;s=on?[sz,sz,len+sz]:[0,0,0];if(on){rq=new Q().setFromUnitVectors(new V3(0,0,1),dl.normalize());}break;}
            case'bubble':{const N=q.n,i=q.j+.5,phi=Math.acos(1-2*i/N),th=Math.PI*(1+Math.sqrt(5))*i,d=new V3(Math.sin(phi)*Math.cos(th),Math.cos(phi),Math.sin(phi)*Math.sin(th)),c=cen(t);
              p.set(c.x+d.x*C.R,c.y+d.y*C.H,c.z+d.z*C.R);const m=Math.max(1,Math.round(D/E.P)),w=.55+.45*Math.sin(GF_TAU*(m*t/D)-d.y*4+q.ph*2),v=p.y<.03?0:sz*w;s=[v,v,.012];
              if(!q.qs){q.qs=new Q().setFromUnitVectors(new V3(0,0,1),new V3(d.x/C.R,d.y/C.H,d.z/C.R).normalize());q.ms.quaternion.copy(q.qs);}break;}
            case'ring':{const c=cen(t),N=q.n,steps=Math.max(1,Math.round(D*.25*N)),ang=GF_TAU*(q.j/N)+E.dir*GF_TAU*(steps/N)*(t/D),r=E.r*(C.R/.6);
              p.set(c.x+Math.cos(ang)*r,E.y==='g'?.02:c.y+E.y*(C.H/1),c.z+Math.sin(ang)*r);const m=Math.max(1,Math.round(D/E.P)),v=sz*(.75+.25*Math.sin(GF_TAU*(m*t/D)+q.j));
              if(E.y==='g'){s=[v,.012,v];rq=new Q().setFromAxisAngle(new V3(0,1,0),-ang);}else{s=[v,v,.012];rq=new Q().setFromAxisAngle(new V3(0,1,0),-ang+Math.PI/2);}if(p.y<.02&&E.y!=='g')s=[0,0,0];break;}
            case'gring':{const c=cen(t),ang=GF_TAU*q.j/q.n,r=E.r*(C.R/.6),m=Math.max(1,Math.round(D/E.P)),v=sz*(.6+.4*Math.sin(GF_TAU*(m*t/D)+q.j*1.3));p.set(c.x+Math.cos(ang)*r,v/2+.005,c.z+Math.sin(ang)*r);s=[v,v,v];break;}
            case'gflame':{const c=cen(tb),ang=GF_TAU*(q.j/q.n+h(1)*.1),r=E.r*(C.R/.6);p.set(c.x+Math.cos(ang)*r,.02+u*.45,c.z+Math.sin(ang)*r);const v=sz*Math.pow(1-u,.8)*Math.min(1,u/.15);s=[v,v,v];p.y=Math.max(p.y,v/2);break;}
            case'gsparkle':case'gbubble':{const c=cen(tb),ang=GF_TAU*h(1),r=E.r*(C.R/.6)*(.4+.6*h(2));p.set(c.x+Math.cos(ang)*r,.03+u*(E.b==='gbubble'?.9:1.9),c.z+Math.sin(ang)*r);const v=sz*Math.sin(Math.PI*u);s=[v,v,v];break;}
            case'spiral':{const c=cen(t),a2=GF_TAU*(u*1.5+q.ph),y=C.H*(1.1-2*u);p.set(c.x+Math.cos(a2)*C.R*.9,c.y+y,c.z+Math.sin(a2)*C.R*.9);const v=p.y<.02?0:sz*spEnv(u,.2);s=[v,v,v];break;}}
          if(!(s[0]>0))s=[1e-4,1e-4,1e-4];P.push(p.x,p.y,p.z);S.push(...s.map(x=>Math.max(1e-4,x)));if(rq){useQ=true;R.push(rq.x,rq.y,rq.z,rq.w);}else R.push(0,0,0,1);}
        tracks.push(new THREE.VectorKeyframeTrack(q.ms.name+'.position',times,P),new THREE.VectorKeyframeTrack(q.ms.name+'.scale',times,S));
        if(useQ)tracks.push(new THREE.QuaternionKeyframeTrack(q.ms.name+'.quaternion',times,R));}}
    const nc=new THREE.AnimationClip(c.name,D,c.tracks.concat(tracks));for(const k of['loopMode','note','next','speed','turn','move','hold','underground'])if(c[k]!==undefined)nc[k]=c[k];
    cm.set(key,nc);out.push(nc);}
  for(const[o,p,q,s]of rest){o.position.copy(p);o.quaternion.copy(q);o.scale.copy(s);}
  for(const sp of specs)for(const q of sp.parts)if(q.qs)q.ms.quaternion.copy(q.qs);
  return out;}
const gfPal=(col,type)=>spPal(col&&col!=='auto'?col:GF_OWN[type]||'arcane');

/* ---------- the Mercenary wears them ---------- */
Object.assign(MC_DEF,{wfx:'none',wfxCol:'auto',wfxStr:'medium',sfx:'none',afx:'none',afxCol:'auto',afxStr:'medium'});
const buildMercenaryPlain=buildMercenary;
buildMercenary=function(o={}){const root=buildMercenaryPlain(o);if(o.noClips)return root;const sel=root.userData.sel,M=root.userData.M,j={};root.traverse(q=>{if(q.name&&!j[q.name])j[q.name]=q;});
  const specs=[],kW=GF_STR[sel.wfxStr]?GF_STR[sel.wfxStr][1]:1,kA=GF_STR[sel.afxStr]?GF_STR[sel.afxStr][1]:1;let key=[];
  const meshesOf=(g,f)=>{const a=[];g.traverse(q=>{if(q.isMesh&&!q.userData.fx&&(!f||f(q)))a.push(q);});return a;};
  /* weapon: its business end; the torch burns unless another effect is chosen */
  let wt=sel.wfx,wc=sel.wfxCol;if(j.mc_sword&&wt==='none'&&j.mc_sword.userData.fxDefault){wt=j.mc_sword.userData.fxDefault.type;if(wc==='auto')wc=j.mc_sword.userData.fxDefault.col;}
  if(j.mc_sword&&GF_RX[wt]){const z0=GF_WZ[sel.weapon]??.1,ms=meshesOf(j.mc_sword,q=>q.position.z>=z0),pal=gfPal(wc,wt);
    specs.push({id:'w',rx:GF_RX[wt],pal,k:kW,meshes:ms,seed:11});gfLight(root,j.mc_sword,pal.l,kW*GF_RX[wt].light,[0,0,.5]);key.push('w',sel.weapon,wt,sel.wfxStr);}
  if(j.mc_shield&&GF_RX[sel.sfx]){const pal=gfPal(sel.afxCol,sel.sfx);specs.push({id:'s',rx:GF_RX[sel.sfx],pal,k:kA,meshes:meshesOf(j.mc_shield),seed:23});gfLight(root,j.mc_shield,pal.l,kA*GF_RX[sel.sfx].light,[0,0,.15]);
    key.push('s',sel.shield,sel.sfx,sel.afxStr);}
  /* protection: the worn gear (not skin, hair, face, the weapon, shield, holder or cape) */
  if(GF_AX[sel.afx]){const skip=q=>{let p=q;while(p){if(p.name==='mc_sword'||p.name==='mc_shield'||p.name==='mc_scab'||/^mc_cape/.test(p.name))return true;p=p.parent;}return false;};
    const ms=meshesOf(root,q=>!M.bodyMats.has(q.material)&&!skip(q)),pal=gfPal(sel.afxCol,sel.afx);
    specs.push({id:'a',rx:GF_AX[sel.afx],pal,k:kA,meshes:ms,seed:37,center:{o:j.hips,off:[0,-.1,0],R:.6,H:1.02}});gfLight(root,j.chest,pal.l,kA*GF_AX[sel.afx].light,[0,.1,.4]);
    key.push('a',sel.afx,sel.afxStr,sel.armor,sel.helmet,sel.shoulders,sel.gloves,sel.boots,sel.pants,sel.belt,sel.weapon,sel.shield);}
  if(specs.length){for(const sp of specs)sp.parts=gfSpec(root,sp);root.userData.clips=gfBake(root,root.userData.clips,specs,key.join('|'));
    const nm=t=>t==='a'?GF_AFX[sel.afx]:GF_WFX[t==='w'?wt:sel.sfx];root.userData.variantText+=' Effects: '+specs.map(s=>({w:'weapon',s:'shield',a:'protection'})[s.id]+' '+nm(s.id).toLowerCase()).join(', ')+'.';}
  return root;};
