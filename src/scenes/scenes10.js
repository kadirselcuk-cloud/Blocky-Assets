/* ======================= Scene: battle at the necromancer's gate (sc-battle-necro), 56 × 56 m =======================
   A scripted fight that loops (about 95 s). The Mercenary walks up to the necromancer's gate with his sword on his back; she beckons him,
   he draws, she raises four skeletons from the bone piles round her. He cuts them down two at a time (blocks, a hit taken, shield bash,
   kick, spin attack, combo), blocks one soul bolt and dodges a flaming skull, then fights her: death nova (knocked back), staff strike,
   drain life broken by a shield bash, vanish and reappear behind him, a blown kiss of death dodged; a heavy cleave puts her on one knee
   and a combo finishes her. He raises his sword and puts it away, and the fight starts again.
   Only the existing clips are used; each blow lands on its clip's contact frame (measured on the weapon tip).
   Pieces: btActor (mixer: one-shot clips hand back to the idle; walking, facing, knock-back), btFx (pooled fx- spell effects with their
   own lights removed, lit by a small pool of lights instead, so no shader recompiles when effects come and go), btParts (instanced
   particles: sparks, bone chips, dust, blood, necrotic motes, smoke), btDirector (coroutines: generators yield seconds or a condition). */
const BT_LOOP=new Set(['Idle','Walk','Run','Idle (war mode)','Walk (war mode)','Run (war mode)','Walk back (war mode)','Strafe left','Strafe right','Blocking (hold)','Channel spell','Idle (weapon sheathed)','Walk (weapon sheathed)','Float','Float (war mode)']);
function btActor(m,idle){const mx=new THREE.AnimationMixer(m),acts={};
  const A={m,mx,idle,cur:null,name:'',once:false,hold:false,end:0,next:null,mv:null,look:null,kb:null,turnK:5,dead:false};
  A.clip=n=>m.userData.clips.find(c=>c.name===n);
  A.play=(n,fade=.18)=>{const c=A.clip(n);if(!c){console.warn('battle: no clip '+n);return 0;}const a=acts[n]||(acts[n]=mx.clipAction(c)),loop=BT_LOOP.has(n);
    if(A.cur===a&&loop)return c.duration;a.reset();a.setLoop(loop?THREE.LoopRepeat:THREE.LoopOnce,Infinity);a.clampWhenFinished=!loop;a.play();
    if(A.cur&&A.cur!==a){if(fade>0)a.crossFadeFrom(A.cur,fade,false);else A.cur.stop();}
    A.cur=a;A.name=n;A.once=!loop;A.end=c.duration;A.hold=!!c.hold||n==='Death'||n==='Vanish';A.next=c.next||null;
    const pr=m.userData.clipProps||{};for(const k in pr)pr[k].visible=k===n;return c.duration;};
  /* a clip frozen at a time (the bone piles) */
  A.pose=(n,t)=>{A.play(n,0);A.cur.time=Math.min(t,A.end);mx.update(0);};
  A.update=dt=>{const p=m.position;
    if(A.mv){const dx=A.mv.x-p.x,dz=A.mv.z-p.z,d=Math.hypot(dx,dz),st=A.mv.v*dt;
      if(d<=Math.max(st,.01)){p.x=A.mv.x;p.z=A.mv.z;A.mv=null;A.play(A.idle,.25);}else{p.x+=dx/d*st;p.z+=dz/d*st;face(m,dx,dz,dt,7);}}
    else if(A.look){const t=A.look.m?A.look.m.position:A.look,dx=t.x-p.x,dz=t.z-p.z;if(dx*dx+dz*dz>.01)face(m,dx,dz,dt,A.turnK);}
    if(A.kb){const k=A.kb;k.t+=dt;const u=Math.min(1,k.t/k.d),e=1-(1-u)*(1-u),de=e-k.e;k.e=e;p.x+=k.x*de;p.z+=k.z*de;if(u>=1)A.kb=null;}
    mx.update(dt);
    if(A.once&&!A.hold&&A.cur&&A.cur.time>=A.end-1e-4)A.play(A.next||A.idle,.2);
    m.userData.post&&m.userData.post();m.updateMatrixWorld(true);};
  return A;}
/* coroutines: a generator yields a number (seconds to wait) or a function (wait until it returns true) */
function btDirector(){const co=[];
  return{run(g){co.push({g,w:0,c:null});return g;},clear(keep){for(let i=co.length-1;i>=0;i--)if(co[i].g!==keep)co.splice(i,1);},
    step(dt){for(let i=co.length-1;i>=0;i--){const q=co[i];if(q.w>0){q.w-=dt;if(q.w>0)continue;}if(q.c){if(!q.c())continue;q.c=null;}
      for(let n=0;n<64;n++){const r=q.g.next();if(r.done){co.splice(co.indexOf(q),1);break;}const v=r.value;
        if(typeof v==='number'){if(v>0){q.w+=v;if(q.w>0)break;}}else if(typeof v==='function'){if(!v()){q.c=v;break;}}}}}};}
/* particles: one instanced mesh per kind */
function btParts(par){const G=new THREE.BoxGeometry(1,1,1),K={},o3=new THREE.Object3D(),V3=THREE.Vector3;
  const kind=(k,mat,n)=>{const im=new THREE.InstancedMesh(G,mat,n);im.instanceMatrix.setUsage(THREE.DynamicDrawUsage);im.frustumCulled=false;im.count=0;im.castShadow=false;par.add(im);K[k]={im,n,list:[]};};
  kind('spark',new THREE.MeshBasicMaterial({color:0xfff0b8}),220);kind('green',new THREE.MeshBasicMaterial({color:0x8ff0b0}),320);
  kind('bone',new THREE.MeshLambertMaterial({color:0xd8cfb4}),160);kind('dust',new THREE.MeshLambertMaterial({color:0x8a8478,transparent:true,opacity:.5,depthWrite:false}),120);
  kind('blood',new THREE.MeshLambertMaterial({color:0x7a1c1e}),80);kind('holy',new THREE.MeshBasicMaterial({color:0xffe28a}),260);kind('dirt',new THREE.MeshLambertMaterial({color:0x4a3a2a}),140);kind('ash',new THREE.MeshLambertMaterial({color:0x3c3a38,transparent:true,opacity:.6,depthWrite:false}),160);kind('smoke',new THREE.MeshLambertMaterial({color:0x26222c,transparent:true,opacity:.55,depthWrite:false}),160);
  const rnd=()=>Math.random()*2-1;
  /* o: n, v (speed), dir (unit-ish), spread, g (gravity, negative rises), life, size, grow, drag, home (fn -> Vector3: homes in on it), R (spawn radius), ring (flat ring burst) */
  const emit=(k,p,o={})=>{const L=K[k];if(!L)return;const n=o.n||8;for(let i=0;i<n&&L.list.length<L.n;i++){const d=o.ring?new V3(rnd(),.15*Math.random(),rnd()):new V3(rnd(),rnd(),rnd());
      if(o.dir&&!o.ring)d.multiplyScalar(o.spread??.7).add(o.dir);if(o.up)d.y=Math.abs(d.y)+o.up;d.normalize().multiplyScalar((o.v??2)*(.45+.55*Math.random()));
      const s=new V3(p.x,p.y,p.z);if(o.R)s.add(new V3(rnd()*o.R,0,rnd()*o.R));
      const life=(o.life??1)*(.7+.3*Math.random());L.list.push({p:s,v:d,life,l0:life,sz:(o.size??.05)*(.6+.8*Math.random()),g:o.g??9.8,grow:o.grow||0,drag:o.drag||0,home:o.home||null,r:new V3(rnd()*3,rnd()*3,rnd()*3),rv:new V3(rnd()*8,rnd()*8,rnd()*8)});}};
  const update=dt=>{for(const k in K){const L=K[k];let w=0;for(let i=L.list.length-1;i>=0;i--){const q=L.list[i];q.life-=dt;if(q.life<=0){L.list.splice(i,1);continue;}
        if(q.home){const h=q.home();if(h){const dx=h.x-q.p.x,dy=h.y-q.p.y,dz=h.z-q.p.z,d=Math.hypot(dx,dy,dz);if(d<.12){q.life=0;}else{const f=Math.min(1,dt*5);q.v.x+=(dx/d*6-q.v.x)*f;q.v.y+=(dy/d*6-q.v.y)*f;q.v.z+=(dz/d*6-q.v.z)*f;}}}
        else q.v.y-=q.g*dt;if(q.drag)q.v.multiplyScalar(Math.max(0,1-q.drag*dt));q.p.addScaledVector(q.v,dt);
        const half=q.sz/2;if(q.g>0&&q.p.y<half){q.p.y=half;q.v.y*=-.3;q.v.x*=.55;q.v.z*=.55;q.rv.multiplyScalar(.5);}
        q.r.addScaledVector(q.rv,dt);}
      for(const q of L.list){const age=q.l0-q.life,s=q.sz*(1+q.grow*age)*Math.min(1,q.life/(q.l0*.35));o3.position.copy(q.p);o3.rotation.set(q.r.x,q.r.y,q.r.z);o3.scale.setScalar(Math.max(1e-4,s));o3.updateMatrix();L.im.setMatrixAt(w++,o3.matrix);}
      L.im.count=w;L.im.instanceMatrix.needsUpdate=true;}};
  const clear=()=>{for(const k in K){K[k].list.length=0;K[k].im.count=0;}};
  return{emit,update,clear};}
/* pooled spell effects; their lights are replaced by a pool of lights that follow the strongest effects */
function btFxPool(par,lightsOut,nL=4){const L=[],all=[];
  for(let i=0;i<nL;i++){const l=new THREE.PointLight(0x66d396,0,9,2);l.userData.min=1.2;l.castShadow=false;par.add(l);lightsOut.push(l);L.push(l);}
  const make=(id,o={})=>{const a=SC_A(id),op=Object.assign((a.opts||[]).reduce((q,p)=>(q[p.key]=p.def,q),{}),{mount:'bare'},o),r=a.build(1,op),rm=[];let col=null,dist=8;
    r.traverse(q=>{if(q.isPointLight){rm.push(q);if(!col){col=q.color.clone();dist=q.distance||8;}}if(q.isMesh){q.castShadow=false;q.receiveShadow=false;}});rm.forEach(q=>q.parent.remove(q));
    r.visible=false;par.add(r);const mx=new THREE.AnimationMixer(r),acts={};
    const F={r,mx,lc:r.getObjectByName('fx_light'),col:col||new THREE.Color(0x66d396),dist,on:false,follow:null,kill:0,cur:null,next:null,end:0,str:1,
      play(n){const c=r.userData.clips.find(c=>c.name===n);if(!c)return 0;const a=acts[n]||(acts[n]=mx.clipAction(c));mx.stopAllAction();a.reset();a.setLoop(n==='Idle'?THREE.LoopRepeat:THREE.LoopOnce,Infinity);a.clampWhenFinished=true;a.play();
        F.cur=a;F.next=n==='Idle'?null:c.next||null;F.end=c.duration;F.on=true;r.visible=true;if(F.follow)F.follow(r);return c.duration;},
      stop(){F.on=false;r.visible=false;mx.stopAllAction();F.follow=null;F.kill=0;},
      after(s){F.kill=s;}};
    all.push(F);return F;};
  const v=new THREE.Vector3();
  const update=dt=>{for(const F of all){if(!F.on)continue;if(F.follow)F.follow(F.r);F.mx.update(dt);if(F.next&&F.cur.time>=F.end-1e-4)F.play(F.next);if(F.kill>0){F.kill-=dt;if(F.kill<=0)F.stop();}}
    const act=[];for(const F of all)if(F.on&&F.lc){F.r.updateMatrixWorld(true);act.push({F,s:F.lc.scale.x*F.str});}act.sort((a,b)=>b.s-a.s);
    L.forEach((l,i)=>{const q=act[i];if(!q||q.s<.03){l.intensity=0;return;}q.F.lc.getWorldPosition(v);l.position.set(v.x,v.y+.5,v.z);l.color.copy(q.F.col);l.distance=Math.max(6,q.F.dist);l.intensity=(l.userData.base??1.2)*Math.min(2.5,q.s);});};
  const stopAll=()=>all.forEach(F=>F.stop());
  return{make,update,stopAll,all};}
/* the prop's two ends in its own frame (staff head and foot) */
function btEnds(o){o.updateMatrixWorld(true);const inv=new THREE.Matrix4().copy(o.matrixWorld).invert(),bb=new THREE.Box3(),b=new THREE.Box3();
  o.traverse(q=>{if(!q.isMesh||!q.geometry)return;q.geometry.computeBoundingBox();b.copy(q.geometry.boundingBox).applyMatrix4(new THREE.Matrix4().multiplyMatrices(inv,q.matrixWorld));bb.union(b);});
  const sz=bb.getSize(new THREE.Vector3()),c=bb.getCenter(new THREE.Vector3()),k=sz.x>sz.y&&sz.x>sz.z?'x':sz.y>sz.z?'y':'z',hi=c.clone(),lo=c.clone();
  hi[k]=Math.abs(bb.max[k])>Math.abs(bb.min[k])?bb.max[k]:bb.min[k];lo[k]=hi[k]===bb.max[k]?bb.min[k]:bb.max[k];return{head:hi,foot:lo};}

function vxSceneNecroBattle(){const root=new THREE.Group();root.userData.lights=[];root.userData.ground=-1;const rng=mulberry32(4242),S=56,PI=Math.PI,H90=PI/2;
  const heightAt=(x,z)=>{const e=Math.max(Math.abs(x),Math.abs(z))-22;return e>0?Math.round((e*.7+Math.max(0,Math.sin(x*.35+z*.3))*e*.35)/.5)*.5:0;};
  const surfAt=(x,z,h)=>{if(h>2.5&&Math.sin(x*1.1)*Math.cos(z*.9)>.2)return'grock';if(Math.abs(x)<1.6&&z>8)return'gsoil';if(x*x/64+(z+3)**2/72<1)return'gsoil';
    return wlNoise(x*.3,z*.3,1)>1.8?'gsoil':'ggrass';};
  sceneTerrain(root,S,2,heightAt,surfAt,SC_GRAVE_SURF);
  const stat=new THREE.Group();root.add(stat);
  const A=(id,x,z,ry=0,o={},s,y=0)=>{const a=SC_A(id),m=a.build(s??a.defaultSeed??1,Object.assign((a.opts||[]).reduce((q,p)=>(q[p.key]=p.def,q),{}),o));m.traverse(q=>{if(q.isMesh){q.castShadow=!q.material.transparent;q.receiveShadow=true;}});
    m.position.set(x,y,z);m.rotation.y=ry;m.userData.isAsset=true;stat.add(m);return m;};
  let NB=0,NT=0;
  /* the gate front: walls on the grid line z = -14, towers on the vertices, the keep behind */
  const CW=(t,x,z,ry,o={},s)=>A('ud-castle-'+t,x,z,ry,o,s);
  [-12,-8,-4,0,4,8,12].forEach((x,i)=>CW(x===0?'gate':i%2?'wall-window':'wall',x,-14,0,x===0?{state:'closed'}:{wear:i===1?'cracked':i===5?'mossy':'clean'},i+1));
  for(const x of[-14,14]){CW('tower',x,-14,0);for(const z of[-18,-22])CW(z===-22?'wall-window':'wall',x,z,x<0?-H90:H90,{wear:'mossy'},z+x);CW('tower',x,-26,0);}
  CW('keep',0,-22,0);NB+=3;
  /* the ritual ground before the gate */
  A('ud-altar',0,-10.2,0);A('ud-brazier',-3.4,-8.4,0);A('ud-brazier',3.4,-8.4,0);A('ud-obelisk',-6.2,-10.4,0);A('ud-obelisk',6.2,-10.4,0);
  A('ud-pikes',-9.5,-11,0,{},2);A('ud-pikes',9.5,-11,0,{},3);A('ud-banner',-2.2,-12.6,0);A('ud-banner',2.2,-12.6,0,{},2);
  /* graves either side of the field */
  let gi=0;for(const sd of[-1,1])for(let z=-6;z<=10;z+=3.6)for(let k=0;k<3;k++){const x=sd*(10.5+k*2.4)+(rng()-.5)*.3,r=rng();gi++;
    if(r<.55)A('ud-grave',x,z,(rng()-.5)*.08,{wear:rng()<.4?'mossy':'clean'},gi);else if(r<.8)A('ud-headstone',x,z-1,(rng()-.5)*.1,{wear:rng()<.5?'mossy':'clean'},gi);else if(r<.92)A('ud-tomb',x,z,0,{wear:'mossy'},gi);}
  for(const[x,z,ry]of[[2.3,12,-H90],[-2.3,18,H90]])A('ud-lamp',x,z,ry);
  for(const[x,z,sz,s]of[[-18,-9,'large',1],[17,-8,'small',2],[-19,14,'small',3],[18,15,'large',4],[-8,20,'large',5],[9,22,'small',6],[-23,2,'large',7],[23,0,'large',8]]){A('ud-tree-'+sz,x,z,rng()*6,{},s,heightAt(x,z));NT++;}
  for(const[x,z,id,s]of[[-7,-6,'ud-bonepile',2],[7.2,-5.4,'ud-bonepile',3],[-6.5,6,'ud-thorns',1],[6.8,7.4,'ud-shrooms',2],[-5.4,13,'wl-bones',3],[5.6,16,'ud-thorns',4],[-12,-12,'ud-bonepile',5]])A(id,x,z,rng()*6,{},s);
  udMist(stat,-13,2,5,12,rng);udMist(stat,13,2,5,12,rng);udMist(stat,0,-11,4,8,rng);
  /* lights: braziers and lamps first, at most 7 (the effect pool adds 4) */
  const sl=[];stat.traverse(o=>{if(o.isPointLight)sl.push(o);});sl.sort((a,b)=>(b.userData.min||0)-(a.userData.min||0)||b.distance-a.distance);sl.forEach(l=>{if(root.userData.lights.length<7)root.userData.lights.push(l);else l.parent.remove(l);});
  mergeStatic(stat,32);

  /* ---------- the fighters (queued: the viewer builds them first) ---------- */
  const dyn=new THREE.Group();dyn.userData.dynamic=true;root.add(dyn);
  const C=(id,seed,o,idle)=>{const a=SC_A(id),m=a.build(seed,Object.assign((a.opts||[]).reduce((q,p)=>(q[p.key]=p.def,q),{}),o));m.traverse(q=>{if(q.isMesh)q.castShadow=!q.material.transparent;});dyn.add(m);return btActor(m,idle);};
  const PILES=[[-2.6,-2.4],[2.8,-1.8],[-4.4,-5.4],[4.6,-5]],NPOS=[0,-6.6],MPOS=[0,13.5];
  let M=null,N=null;const SK=[],J={};let staffEnds=null;
  const later=[];
  later.push(()=>{M=C('mercenary',1,{},'Idle (weapon sheathed)');J.mChest=M.m.getObjectByName('chest');J.mShield=M.m.getObjectByName('mc_shield')||J.mChest;});
  later.push(()=>{N=C('necromancer',3,{skin:'porcelain',hair:'black',eyes:'green',gown:'black',head:'horns',staff:'caged'},'Idle (war mode)');
    const st=N.m.getObjectByName('weapon_R');staffEnds=btEnds(st);J.staff=st;J.nHand=N.m.getObjectByName('hand_L');J.nChest=N.m.getObjectByName('chest');J.nHead=N.m.getObjectByName('head');compactRig(N.m);});
  [['sword','chain',31],['axe','leather',32],['club','none',33],['sword','plate',34]].forEach(([w,ar,s])=>later.push(()=>{const k=C('skeleton',s,{weapon:w,armor:ar,eyes:'green'},'Idle (war mode)');k.chest=k.m.getObjectByName('chest');compactRig(k.m);SK.push(k);}));
  /* the spell effects (cheap, built now) */
  const fx=btFxPool(dyn,root.userData.lights,4),parts=btParts(dyn);
  const PENT=fx.make('fx-pentagram',{col:'necro',size:'m',candles:'no'}),SPENT=PILES.map(()=>fx.make('fx-pentagram',{col:'necro',size:'s',candles:'no'}));
  const SOULS=fx.make('fx-staff-souls',{col:'necro'}),HAND=fx.make('fx-hand-shadow',{col:'necro'}),BOLT=fx.make('fx-shadow-bolt',{col:'necro'}),SKULL=fx.make('fx-flaming-skull',{col:'necro'}),
    KISS=fx.make('fx-magic-bolt',{col:'blood'}),NOVA=fx.make('fx-explosion',{col:'fel',size:'m'}),DOOM=fx.make('fx-explosion',{col:'shadow',size:'m'}),PUFF=fx.make('fx-explosion',{col:'shadow',size:'s'});
  PENT.r.position.set(NPOS[0],.01,NPOS[1]);SPENT.forEach((F,i)=>F.r.position.set(PILES[i][0],.01,PILES[i][1]));

  /* ---------- helpers ---------- */
  const D=btDirector(),run=g=>D.run(g),at=(s,f)=>run((function*(){yield s;f();})());
  const V3=THREE.Vector3,wp=(o,l)=>o.localToWorld(l?l.clone():new V3());
  const chest=A2=>wp(A2===M?J.mChest:A2===N?J.nChest:A2.chest);
  const palm=()=>wp(J.nHand,new V3(0,-.09,0)),tip=()=>wp(J.staff,staffEnds.head),foot=()=>wp(J.staff,staffEnds.foot);
  const W=(A2,x,z,v,clip)=>{A2.mv={x,z,v};A2.play(clip,.25);return()=>!A2.mv;};
  const near=(A2,B,d,off=0)=>{const dx=A2.m.position.x-B.m.position.x,dz=A2.m.position.z-B.m.position.z,a=Math.atan2(dx,dz)+off;return[B.m.position.x+Math.sin(a)*d,B.m.position.z+Math.cos(a)*d];};
  const go=(A2,B,d,v,clip,off)=>{const[x,z]=near(A2,B,d,off);return W(A2,x,z,v,clip);};
  const knock=(A2,from,dist,dur=.35)=>{const dx=A2.m.position.x-from.m.position.x,dz=A2.m.position.z-from.m.position.z,d=Math.hypot(dx,dz)||1;A2.kb={x:dx/d*dist,z:dz/d*dist,t:0,d:dur,e:0};};
  const away=(A2,from)=>{const p=chest(A2),q=chest(from);return p.sub(q).setY(0).normalize();};
  const hitAt=(def,att)=>{const p=chest(def),d=chest(att).sub(p).setY(0).normalize();return p.addScaledVector(d,.22);};
  const fxHit=(kind,att,def)=>{const p=hitAt(def,att),dir=away(def,att).setY(.35);
    if(kind==='bone'||kind==='boneDeath'){parts.emit('bone',p,{n:kind==='bone'?8:18,v:2.6,dir,spread:.9,life:1.8,size:.055});parts.emit('spark',p,{n:6,v:3.5,dir,life:.25,size:.03,g:4});if(kind==='boneDeath')parts.emit('dust',new V3(p.x,.3,p.z),{n:10,v:.8,up:.3,g:-.3,drag:1.5,life:1.6,size:.22,grow:.8,R:.4});}
    else if(kind==='kick'){parts.emit('dust',p,{n:6,v:1,dir,g:-.2,drag:2,life:1,size:.16,grow:.8});parts.emit('bone',p,{n:5,v:2,dir,life:1.5,size:.05});}
    else if(kind==='merc'){parts.emit('blood',p,{n:8,v:2.2,dir,spread:.8,life:1,size:.04});parts.emit('spark',p,{n:5,v:3,dir,life:.22,size:.03,g:4});}
    else if(kind==='necro'||kind==='necroDeath'){parts.emit('green',p,{n:kind==='necro'?14:24,v:2.4,dir,spread:1,g:1,life:.9,size:.045});parts.emit('smoke',p,{n:4,v:.6,dir,g:-.4,drag:1.5,life:1.2,size:.14,grow:1});}
    else if(kind==='magic'){parts.emit('green',p,{n:20,v:3,spread:1.4,dir,g:.5,life:.8,size:.05});}};
  const blockFx=(def,att,magic)=>{const p=wp(J.mShield),dir=away(def,att).multiplyScalar(-1).setY(.4);parts.emit('spark',p,{n:16,v:4,dir,spread:1.1,life:.3,size:.035,g:6});if(magic)parts.emit('green',p,{n:16,v:2.5,dir,spread:1.2,life:.7,size:.05,g:.5});};
  /* attacker plays a clip; hits: [time, defender, reaction clip, effect kind, push] */
  const strike=(att,clip,hits)=>{if(hits[0])att.look=hits[0][1];const d=att.play(clip,.12);
    for(const[t,def,react,kind,push]of hits)at(t,()=>{if(def.dead)return;def.mv=null;if(react)def.play(react,react==='Death'?.12:.08);fxHit(kind,att,def);if(push)knock(def,att,push,react==='Death'?.25:.35);if(react==='Death'){def.dead=true;def.look=null;}});return d;};
  const block=(def,att,t,magic)=>{at(Math.max(0,t-.3),()=>{def.mv=null;def.play('Block',.1);});at(t,()=>blockFx(def,att,magic));};
  const dodge=(def,clip,t)=>at(Math.max(0,t-.32),()=>{def.mv=null;def.play(clip,.08);});
  /* projectiles: fly from a point to a moving target; Impact there */
  const shots=[];
  const shoot=(F,from,to,v,onHit)=>{F.r.position.copy(from);F.play('Start');shots.push({F,to,v,onHit});};
  const stepShots=dt=>{for(let i=shots.length-1;i>=0;i--){const s=shots[i],t=s.to(),p=s.F.r.position,d=p.distanceTo(t),st=s.v*dt;
      if(d<=st){p.copy(t);s.F.play('Impact');s.F.after(2.2);s.onHit&&s.onHit(p.clone());shots.splice(i,1);}else{s.F.r.lookAt(t);p.addScaledVector(t.clone().sub(p),st/d);}}};
  /* Spell 1: the hand gathers, the bolt leaves at 0.7 s; returns the time of impact from now. mode: 'block' (hits the shield), 'dodge' (flies past) */
  const soulBolt=(F,mode)=>{N.look=M;N.play('Spell 1 (soul bolt)',.15);HAND.follow=r=>{r.position.copy(palm());r.lookAt(chest(M));};HAND.play('Start');at(.5,()=>HAND.play('Cast'));at(1.3,()=>{HAND.play('End');HAND.after(1);});
    const v=12,dist=Math.hypot(M.m.position.x-N.m.position.x,M.m.position.z-N.m.position.z),tI=.7+dist/v;
    at(.7,()=>{if(mode==='block')shoot(F,palm(),()=>wp(J.mShield),v,()=>blockFx(M,N,true));else{const P0=palm(),aim=chest(M),d=aim.clone().sub(P0).setY(0).normalize(),end=new V3(aim.x+d.x*7,.25,aim.z+d.z*7);
        shoot(F,P0,()=>end,v,p=>{parts.emit('green',p,{n:14,v:2,up:.6,g:2,life:.8,size:.05});parts.emit('dust',p,{n:6,v:.8,up:.4,g:-.3,drag:1.5,life:1.4,size:.25,grow:.8});});}});
    return mode==='block'?tI:tI-.15;};
  const smoke=(p,n=26)=>{parts.emit('smoke',new V3(p.x,.2,p.z),{n,v:1.3,up:.4,g:-.6,drag:1.4,life:2.2,size:.3,grow:1.2,R:.5});parts.emit('green',new V3(p.x,.9,p.z),{n:12,v:1.6,g:-.5,drag:1,life:1.2,size:.05,R:.4});};
  let focus=null;

  /* ---------- the fight ---------- */
  let MAIN=null;
  function reset(){D.clear(MAIN);parts.clear();fx.stopAll();shots.length=0;
    M.m.position.set(MPOS[0],0,MPOS[1]);M.m.rotation.y=PI;M.idle='Idle (weapon sheathed)';M.play(M.idle,0);Object.assign(M,{mv:null,look:null,kb:null,dead:false,turnK:5});
    N.m.position.set(NPOS[0],0,NPOS[1]);N.m.rotation.y=0;N.play('Idle',0);Object.assign(N,{mv:null,look:null,kb:null,dead:false,idle:'Idle (war mode)'});
    SK.forEach((k,i)=>{k.m.position.set(PILES[i][0],0,PILES[i][1]);k.m.rotation.y=Math.atan2(-PILES[i][0],MPOS[1]-PILES[i][1]);Object.assign(k,{mv:null,look:null,kb:null,dead:true});k.pose('Death',99);});
    PENT.play('Idle');focus=N;}
  function* intro(){
    yield W(M,0,6.8,1.2,'Walk (weapon sheathed)');M.look=N;yield .4;
    N.look=M;N.play('Taunt (beckon)');yield 1.8;
    M.idle='Idle (war mode)';M.play('Draw');yield 1.7;
    /* raise the dead: the staff goes up, its foot is driven into the ground at 1.8 s */
    N.play('Spell 2 (raise the dead)');SOULS.follow=r=>r.position.copy(tip());SOULS.play('Start');SPENT.forEach((F,i)=>at(i*.15,()=>F.play('Start')));
    yield 1.1;PENT.play('Summon');yield .7;
    {const f=foot();parts.emit('green',new V3(f.x,.1,f.z),{n:30,v:3,ring:true,g:.5,life:.9,size:.05});parts.emit('dust',new V3(f.x,.1,f.z),{n:8,v:1,ring:true,g:-.2,drag:1.5,life:1.4,size:.25,grow:1});}
    SK.forEach((k,i)=>at(.15+i*.25,()=>{k.dead=false;k.play('Rise',.05);SPENT[i].play('Summon');const p=new V3(PILES[i][0],.2,PILES[i][1]);parts.emit('green',p,{n:24,v:2.4,up:1.2,g:-.4,drag:.8,life:1.6,size:.05,R:.4});parts.emit('dust',p,{n:6,v:.6,up:.3,g:-.2,drag:1.5,life:1.6,size:.25,grow:.9,R:.4});}));
    at(.9,()=>M.play('Taunt'));at(1.4,()=>{SOULS.play('End');SOULS.after(.8);});
    yield 3.7;SPENT.forEach(F=>{F.play('End');F.after(2.1);});
    SK.forEach((k,i)=>{k.look=M;at(i*.3,()=>k.play(['Roar','Shout','Taunt','Shout'][i]));});yield 2.2;}
  function* wave1(){const[a,b]=SK;focus=a;
    run((function*(){yield 1.2;b.look=M;yield go(b,M,1.75,3.3,'Run (war mode)',-.35);})());
    a.look=M;M.look=a;yield go(a,M,1.6,3.3,'Run (war mode)');yield .2;
    a.play('One-handed attack 1');block(M,a,.48);yield 1.05;
    yield strike(M,'Attack 1',[[.40,a,'Hit 1','bone',.25]])-.1;
    yield strike(M,'Attack 2',[[.40,a,'Hit 2','bone',.25]])-.15;
    /* the second one lands a blow */
    focus=b;M.look=b;b.play('One-handed attack 2');at(.48,()=>{M.mv=null;M.play('Hit 1',.08);fxHit('merc',b,M);knock(M,b,.3,.3);});yield 1.0;
    yield strike(M,'Shield bash',[[.37,b,'Heavy hit','kick',1.2]])-.1;
    focus=a;M.look=a;a.play('One-handed heavy attack');dodge(M,'Dodge back',.75);yield 1.6;
    yield strike(M,'Attack 3',[[.42,a,'Death','boneDeath',.2]]);
    /* a soul bolt from the necromancer, caught on the shield */
    focus=N;M.look=N;const tI=soulBolt(BOLT,'block');at(Math.max(0,tI-.35),()=>{M.mv=null;M.play('Block',.1);});yield tI+.5;
    focus=b;M.look=b;b.look=M;yield go(b,M,1.7,.8,'Walk (war mode)');
    b.play('Jump & attack');block(M,b,.72);yield 1.45;
    yield strike(M,'Combo',[[.35,b,'Hit 1','bone',.15],[.77,b,'Hit 2','bone',.15],[1.22,b,'Death','boneDeath',.25]])+.3;}
  function* wave2(){const[,,a,b]=SK;focus=a;M.look=a;a.look=M;b.look=M;
    run((function*(){yield .5;yield go(b,M,1.65,3.3,'Run (war mode)',-.6);})());
    yield go(a,M,1.65,3.3,'Run (war mode)',.6);yield()=>!b.mv;yield .2;
    yield strike(M,'Spin attack',[[.42,a,'Hit 2','bone',.3],[1.0,b,'Hit 1','bone',.3],[1.33,a,'Hit 1','bone',.2]])-.1;
    a.play('One-handed attack 1');at(.48,()=>{M.mv=null;M.play('Hit 2',.08);fxHit('merc',a,M);knock(M,a,.3,.3);});yield 1.0;
    focus=b;b.play('Low swing one-handed');yield strike(M,'Kick',[[.5,b,'Heavy hit','kick',1.3]])-.05;
    focus=a;M.look=a;a.play('One-handed attack 2');block(M,a,.48);yield 1.05;
    yield strike(M,'Heavy attack',[[.92,a,'Death','boneDeath',.4]]);
    focus=b;M.look=b;yield go(b,M,1.75,.8,'Walk (war mode)');
    b.play('Jump & attack');dodge(M,'Dodge right',.72);yield 1.35;
    yield strike(M,'Attack 4',[[.37,b,'Hit 1','bone',.2]])-.15;
    yield strike(M,'Attack 1',[[.40,b,'Death','boneDeath',.3]])+.4;}
  function* boss(){focus=N;M.look=N;N.look=M;
    N.play('Taunt (beckon)');yield 1.2;
    let tI=soulBolt(SKULL,'dodge');dodge(M,'Dodge right',tI);yield tI+.6;
    /* he charges; the death nova throws him back */
    yield go(M,N,4.4,3.3,'Run');
    N.play('Spell 4 (death nova)');go(M,N,2.7,.85,'Walk (war mode)');
    at(1.3,()=>{NOVA.r.position.set(N.m.position.x,0,N.m.position.z);NOVA.play('Explode');NOVA.after(2.5);parts.emit('green',new V3(N.m.position.x,.4,N.m.position.z),{n:50,v:6,ring:true,g:.3,drag:.8,life:1,size:.06});
      M.mv=null;M.play('Heavy hit',.08);fxHit('magic',N,M);knock(M,N,2.2,.6);});
    yield 2.2;yield go(M,N,2.6,3.3,'Run');
    yield go(M,N,1.6,.85,'Walk (war mode)');
    N.play('Staff strike');block(M,N,.8);yield 1.4;
    yield strike(M,'Attack 1',[[.40,N,'Hit 1','necro',.25]])-.1;
    yield strike(M,'Attack 2',[[.40,N,'Hit 2','necro',.25]])+.2;
    /* drain life, broken by a shield bash */
    N.play('Spell 3 (drain life)');let drain=true;run((function*(){yield .5;while(drain){const c=chest(M);parts.emit('green',c,{n:3,v:2,spread:1.5,dir:new V3(0,.5,0),home:palm,life:1.4,size:.05});yield .05;}})());
    at(.55,()=>M.play('Hit 2',.1));at(1.25,()=>M.play('Hit 1',.1));at(2.0,()=>{drain=false;strike(M,'Shield bash',[[.37,N,'Hit 1','necro',.6]]);});
    yield 3.2;
    /* she vanishes in smoke and comes back behind him */
    N.play('Vanish');at(2.2,()=>smoke(N.m.position));at(2.6,()=>{PUFF.r.position.set(N.m.position.x,0,N.m.position.z);PUFF.play('Explode');PUFF.after(2.4);});yield 3.6;
    {const mp=M.m.position,dx=mp.x-N.m.position.x,dz=mp.z-N.m.position.z,d=Math.hypot(dx,dz)||1;N.m.position.set(mp.x+dx/d*2.6,0,mp.z+dz/d*2.6);N.m.rotation.y=Math.atan2(-dx,-dz);}
    N.look=M;N.play('Reappear',0);smoke(N.m.position,18);
    at(.6,()=>{M.look=N;M.turnK=3;M.play('Walk (war mode)',.2);});at(1.7,()=>{M.play('Idle (war mode)',.25);M.turnK=5;});yield 2.7;
    /* a blown kiss of death; he ducks aside */
    N.play('Kiss of death');at(1.35,()=>{const P0=wp(J.nHead,new V3(0,.0,.12)),aim=chest(M),d=aim.clone().sub(P0).setY(0).normalize(),end=new V3(aim.x+d.x*7+d.z*.4,.3,aim.z+d.z*7-d.x*.4);
      shoot(KISS,P0,()=>end,9,p=>parts.emit('blood',p,{n:10,v:1.6,up:.6,life:1,size:.045}));});
    dodge(M,'Dodge left',1.35+Math.hypot(M.m.position.x-N.m.position.x,M.m.position.z-N.m.position.z)/9);yield 2.5;
    yield go(M,N,1.6,.85,'Walk (war mode)');
    yield strike(M,'Heavy attack',[[.92,N,'Heavy hit','necro',.4]])+.9;
    yield strike(M,'Combo',[[.35,N,'Hit 1','necro',.2],[.77,N,'Hit 2','necro',.2],[1.22,N,'Death','necroDeath',.2]])-1.08;
    /* her death: she shrinks to nothing from 1.9 s */
    yield 1.9;smoke(N.m.position,30);DOOM.r.position.set(N.m.position.x,0,N.m.position.z);DOOM.play('Explode');DOOM.after(2.5);PENT.play('End');PENT.after(2.1);
    yield 1.6;focus=M;M.look=null;M.play('Victory');yield 2.8;
    M.idle='Idle (weapon sheathed)';M.play('Sheathe');yield 4.5;}
  function* main(){for(;;){reset();yield .8;yield*intro();yield*wave1();yield*wave2();yield*boss();}}

  /* ---------- per frame ---------- */
  let ready=false,follow=true;const ft=new V3();
  root.userData.dbg=()=>({M,N,SK,ready,focus});
  root.userData.tick=dt=>{if(!ready){if(later.length||!M||!N||SK.length<4)return;ready=true;MAIN=run(main());}
    D.step(dt);stepShots(dt);M.update(dt);N.update(dt);for(const k of SK)k.update(dt);fx.update(dt);parts.update(dt);};
  /* the viewer: start framing, and a camera that follows the fight (Options → Camera) */
  root.userData.view={t:[0,1,3],r:21,ph:1.12,th:.55};
  root.userData.follow=()=>{if(!follow||!ready)return null;const p=M.m.position,f=focus&&focus!==M?focus.m.position:p;return ft.set((p.x+f.x)/2,1,(p.z+f.z)/2);};
  root.userData.setOpt=(k,v)=>{if(k==='cam')follow=v==='follow';};
  sceneStats(root,{buildings:NB,trees:NT});root.userData.stats.enemies=(root.userData.stats.enemies||0)+5;
  /* the viewer builds the queue itself (root.userData.later) with a percentage; otherwise the fighters are built one by one */
  root.userData.later=later;const step=()=>{if(!later.length)return;if(!root.parent&&root.userData.shown)return;later.shift()();setTimeout(step,60);};root.userData.shown=false;setTimeout(()=>{root.userData.shown=true;step();},400);
  return root;}
ASSETS.push({id:'sc-battle-necro',folder:'scenes',name:'Battle at the necromancer\'s gate',kind:'scene',build:vxSceneNecroBattle,groundR:-1,
  opts:[{key:'cam',label:'Camera',choices:[['follow','Follow the fight'],['free','Free']],def:'follow',live:true}],
  desc:'A scripted battle that loops (about 95 s) before the necromancer\'s gate, built from the undead kit. The Mercenary walks up with his sword on his back; the necromancer beckons, he draws, and she raises four skeletons from the bone piles round her ritual circle (the circle flares, souls swirl round her staff, small summoning circles light under each pile). He cuts them down two at a time: blocks with sparks off the shield, takes a blow, shield bash, kick, spin attack, combo and heavy cleave, bone chips flying, each skeleton collapsing into a pile. He blocks her soul bolt and dodges a flaming skull, then fights her: the death nova throws him back, he blocks her staff strike, her drain life pulls green motes out of him until a shield bash breaks it, she vanishes in smoke and reappears behind him, blows a kiss of death he ducks, and a heavy cleave puts her on one knee before a combo finishes her; she shrinks to nothing in a burst of shadow. He raises his sword and puts it away. Every blow lands on its clip\'s contact frame. Options: the camera follows the fight or stays free.'});
