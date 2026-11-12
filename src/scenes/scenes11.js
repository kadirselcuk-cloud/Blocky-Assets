/* ======================= Scene: the vampire's mausoleum (sc-battle-vampire), 48 × 48 m =======================
   A scripted fight that loops (about 100 s) in a fenced graveyard before a grand mausoleum, on the machinery of scenes10.js
   (btActor, btDirector, btParts, btFxPool, btEnds). The Mercenary fights as a paladin (radiant sword, white shield) with four
   holy spells, each on one of his cast clips:
   - Divine shield (Cast spell 3, the blessing at 1.6 s): a holy aura round his feet; breaks the vampire's blood drain
   - Turn undead (Cast spell 1, the point at 1.7 s): a burst of light from the sword; every spawn near him hisses, recoils and flees
   - Consecrate (Cast spell 4, the sword in the ground at 0.8 s): a holy rune circle; spawns standing in it burn in holy fire and die
   - Smite (Cast spell 2, the thrust at 0.45 s): a bolt of holy light; the same raised sword calls a pillar of holy fire at the end
   Spawns killed by the radiant sword or the light crumble to ash. The vampire is not killed: beaten, he vanishes into his cape. */
function vxSceneVampireBattle(){const root=new THREE.Group();root.userData.lights=[];root.userData.ground=-1;const rng=mulberry32(5151),S=48,PI=Math.PI,H90=PI/2;
  const heightAt=(x,z)=>{const e=Math.max(Math.abs(x),Math.abs(z))-19;return e>0?Math.round((e*.7+Math.max(0,Math.sin(x*.4+z*.3))*e*.35)/.5)*.5:0;};
  const surfAt=(x,z,h)=>{if(h>2.5&&Math.sin(x*1.1)*Math.cos(z*.9)>.2)return'grock';if(Math.abs(x)<1.6&&z>6)return'gsoil';if(x*x/48+(z-1.5)**2/42<1)return'gsoil';
    return wlNoise(x*.35,z*.35,1)>1.9?'gsoil':'ggrass';};
  sceneTerrain(root,S,2,heightAt,surfAt,SC_GRAVE_SURF);
  const stat=new THREE.Group();root.add(stat);const dyn=new THREE.Group();dyn.userData.dynamic=true;root.add(dyn);
  const A=(id,x,z,ry=0,o={},s,y=0,par=stat)=>{const a=SC_A(id),m=a.build(s??a.defaultSeed??1,Object.assign((a.opts||[]).reduce((q,p)=>(q[p.key]=p.def,q),{}),o));m.traverse(q=>{if(q.isMesh){q.castShadow=!q.material.transparent;q.receiveShadow=true;}});
    m.position.set(x,y,z);m.rotation.y=ry;m.userData.isAsset=true;par.add(m);return m;};
  let NB=0,NT=0;
  /* the grand mausoleum (its door opens: kept out of the merged static) */
  const MAU=A('ud-mausoleum-large',0,-10,0,{door:'closed'},1,0,dyn);NB++;const mb=new THREE.Box3().setFromObject(MAU),DOORZ=mb.max.z,DOORIN=-10+1.76,FLOOR=.6;
  /* the crypt floor is 0.6 m up: floating out of the door he comes down over the stairs */
  const stairY=z=>z<=DOORIN+.3?FLOOR:z>=DOORZ?0:FLOOR*(1-(z-DOORIN-.3)/(DOORZ-DOORIN-.3));
  const mauMx=new THREE.AnimationMixer(MAU),door=n=>{const c=MAU.userData.clips.find(c=>c.name===n);if(!c)return;mauMx.stopAllAction();const a=mauMx.clipAction(c);a.reset();a.setLoop(THREE.LoopOnce,1);a.clampWhenFinished=true;a.play();};
  for(const[x,z]of[[-6,-6.5],[6,-6.5]])A('ud-statue',x,z,0,{wings:x<0?'yes':'no'},2);
  for(const[x,z,ry]of[[-2.6,-3.6,H90],[2.6,-3.6,-H90],[2.3,9,-H90]])A('ud-lamp',x,z,ry);
  /* the fence round the graveyard: iron gate in the south, posts on the vertices */
  for(let x=-16;x<=16;x+=4){if(x===0)A('ud-fence-gate',0,14,0,{state:'open'});else A('ud-fence',x,14,0,{},Math.abs(x)+2);}
  for(let z=-16;z<=12;z+=4){A('ud-fence',-18,z,-H90,{},Math.abs(z)+3);A('ud-fence',18,z,H90,{},Math.abs(z)+4);}
  for(let x=-18;x<=18;x+=4)if(Math.abs(x)!==2)A('ud-fence-post',x,14);for(let z=-18;z<=10;z+=4){A('ud-fence-post',-18,z);A('ud-fence-post',18,z);}
  /* rows of graves either side, older tombs by the mausoleum */
  let gi=0;for(const sd of[-1,1])for(let z=-4.6;z<=11;z+=3.4)for(let k=0;k<3;k++){const x=sd*(9.2+k*2.4)+(rng()-.5)*.3,r=rng();gi++;
    if(r<.55)A('ud-grave',x,z,(rng()-.5)*.08,{wear:rng()<.4?'mossy':rng()<.3?'cracked':'clean'},gi);else if(r<.8)A('ud-headstone',x,z-1,(rng()-.5)*.1,{wear:rng()<.5?'mossy':'clean'},gi);else if(r<.92)A('ud-tomb',x,z,0,{wear:'mossy'},gi);}
  for(const[x,z]of[[-10,-11],[10,-11.4],[-13.4,-9],[13.6,-8.6]])A('ud-tomb',x,z,0,{wear:'mossy'},++gi);
  for(const[x,z,sz,s]of[[-15,-15,'large',1],[15,-14,'large',2],[-14.6,12,'small',3],[15,11.6,'small',4],[-21,4,'large',5],[21,-2,'large',6],[-6,19,'small',7],[8,20,'large',8]]){A('ud-tree-'+sz,x,z,rng()*6,{},s,heightAt(x,z));NT++;}
  for(const[x,z,id,s]of[[-6.4,6,'ud-thorns',1],[6.6,5.2,'ud-shrooms',2],[-7,-3.2,'ud-bonepile',3],[7.4,-2,'wl-bones',2]])A(id,x,z,rng()*6,{},s);
  udMist(stat,-12,2,5,12,rng);udMist(stat,12,3,5,12,rng);udMist(stat,0,-7,4,8,rng);
  const sl=[];root.traverse(o=>{if(o.isPointLight)sl.push(o);});sl.sort((a,b)=>(b.userData.min||0)-(a.userData.min||0)||b.distance-a.distance);sl.forEach(l=>{if(root.userData.lights.length<7)root.userData.lights.push(l);else l.parent.remove(l);});
  mergeStatic(stat,32);

  /* ---------- the fighters (queued) ---------- */
  const C=(id,seed,o,idle)=>{const a=SC_A(id),m=a.build(seed,Object.assign((a.opts||[]).reduce((q,p)=>(q[p.key]=p.def,q),{}),o));m.traverse(q=>{if(q.isMesh)q.castShadow=!q.material.transparent;});dyn.add(m);return btActor(m,idle);};
  const RISE=[[-3,1.2],[3.2,1.6],[-4.6,-1.6],[4.8,-1.2]],VPOS=[0,-3.4],MPOS=[0,11];
  let M=null,V=null;const SP=[],J={};let sword=null;const later=[];
  later.push(()=>{M=C('mercenary',1,{wfx:'holy',wfxStr:'low',shieldCol:'white'},'Idle (weapon sheathed)');J.mChest=M.m.getObjectByName('chest');J.mShield=M.m.getObjectByName('mc_shield')||J.mChest;
    J.sword=M.m.getObjectByName('mc_sword');M.m.updateMatrixWorld(true);sword=btEnds(J.sword);});
  later.push(()=>{V=C('vampire',6,{coat:'black',lining:'crimson',eyes:'red',hair:'black'},'Idle (war mode)');J.vChest=V.m.getObjectByName('chest');J.vOrbR=V.m.getObjectByName('orb_R')||V.m.getObjectByName('hand_R');
    J.vHandL=V.m.getObjectByName('hand_L');compactRig(V.m);});
  [['rags','red',10],['bare','amber',11],['rags','red',12],['bare','white',13]].forEach(([cl,ey,s])=>later.push(()=>{const k=C('vampire-spawn',s,{clothes:cl,eyes:ey},'Idle (war mode)');k.chest=k.m.getObjectByName('chest');compactRig(k.m);SP.push(k);}));
  const fx=btFxPool(dyn,root.userData.lights,4),parts=btParts(dyn);
  const AURA=fx.make('fx-aura',{col:'holy',size:'s'}),TIP=fx.make('fx-hand-light',{col:'holy'}),FLASH=fx.make('fx-explosion',{col:'holy',size:'s'}),
    CIRC=fx.make('fx-rune-circle',{col:'holy',size:'l'}),SMITE=fx.make('fx-magic-bolt',{col:'holy'}),PILLAR=fx.make('fx-fire-pillar',{col:'holy',size:'m'}),
    BBOLT=fx.make('fx-blood-spear',{col:'blood'}),FIRES=[0,1].map(()=>fx.make('fx-fire',{col:'holy',size:'s'}));

  /* ---------- helpers ---------- */
  const D=btDirector(),run=g=>D.run(g),at=(s,f)=>run((function*(){yield s;f();})());
  const V3=THREE.Vector3,wp=(o,l)=>o.localToWorld(l?l.clone():new V3());
  const chest=a=>wp(a===M?J.mChest:a===V?J.vChest:a.chest),tip=()=>wp(J.sword,sword.head);
  const W=(a,x,z,v,clip)=>{a.mv={x,z,v};a.play(clip,.25);return()=>!a.mv;};
  const near=(a,b,d,off=0)=>{const dx=a.m.position.x-b.m.position.x,dz=a.m.position.z-b.m.position.z,g=Math.atan2(dx,dz)+off;return[b.m.position.x+Math.sin(g)*d,b.m.position.z+Math.cos(g)*d];};
  const go=(a,b,d,v,clip,off)=>{const[x,z]=near(a,b,d,off);return W(a,x,z,v,clip);};
  const knock=(a,from,dist,dur=.35)=>{const dx=a.m.position.x-from.m.position.x,dz=a.m.position.z-from.m.position.z,d=Math.hypot(dx,dz)||1;a.kb={x:dx/d*dist,z:dz/d*dist,t:0,d:dur,e:0};};
  const away=(a,from)=>chest(a).sub(chest(from)).setY(0).normalize();
  const hitAt=(def,att)=>{const p=chest(def),d=chest(att).sub(p).setY(0).normalize();return p.addScaledVector(d,.22);};
  const fxHit=(kind,att,def)=>{const p=hitAt(def,att),dir=away(def,att).setY(.35);
    if(kind==='flesh'||kind==='fleshDeath'){parts.emit('blood',p,{n:kind==='flesh'?9:16,v:2.4,dir,spread:.9,life:1.1,size:.045});parts.emit('holy',p,{n:kind==='flesh'?6:14,v:3,dir,spread:1,g:2,life:.45,size:.035});}
    else if(kind==='merc'){parts.emit('blood',p,{n:8,v:2.2,dir,spread:.8,life:1,size:.04});}
    else if(kind==='vamp'){parts.emit('blood',p,{n:10,v:2.2,dir,spread:.9,life:1,size:.045});parts.emit('smoke',p,{n:4,v:.6,dir,g:-.4,drag:1.5,life:1.2,size:.14,grow:1});parts.emit('holy',p,{n:8,v:3,dir,g:2,life:.45,size:.035});}
    else if(kind==='holy'){parts.emit('holy',p,{n:24,v:3.4,dir,spread:1.3,g:.5,life:.7,size:.05});parts.emit('smoke',p,{n:5,v:.7,dir,g:-.5,drag:1.5,life:1.2,size:.16,grow:1});}};
  const blockFx=(def,att,blood)=>{const p=wp(J.mShield),dir=away(def,att).multiplyScalar(-1).setY(.4);parts.emit('spark',p,{n:14,v:4,dir,spread:1.1,life:.3,size:.035,g:6});if(blood)parts.emit('blood',p,{n:14,v:2.4,dir,spread:1.2,life:.8,size:.045});};
  /* spawns killed by holy power crumble to ash once they lie face down */
  const ash=k=>run((function*(){yield 2.3;const m=k.m;for(let t=0;t<1.6;t+=1/30){const u=t/1.6;m.scale.set(1+u*.15,Math.max(.02,1-u),1+u*.15);
      if(Math.random()<.6){const p=m.position;parts.emit('ash',new V3(p.x,.1,p.z),{n:2,v:.5,up:.4,g:-.4,drag:1.5,life:1.6,size:.2,grow:.8,R:.6});parts.emit('holy',new V3(p.x,.2,p.z),{n:1,v:.6,up:1,g:-.6,life:1.2,size:.035,R:.6});}yield 1/30;}m.visible=false;})());
  const kill=k=>{k.dead=true;k.look=null;k.mv=null;ash(k);};
  const strike=(att,clip,hits)=>{if(hits[0])att.look=hits[0][1];const d=att.play(clip,.12);
    for(const[t,def,react,kind,push]of hits)at(t,()=>{if(def.dead)return;def.mv=null;if(react)def.play(react,react==='Death'?.12:.08);fxHit(kind,att,def);if(push)knock(def,att,push,react==='Death'?.25:.35);if(react==='Death')kill(def);});return d;};
  const block=(def,att,t,blood)=>{at(Math.max(0,t-.3),()=>{def.mv=null;def.play('Block',.1);});at(t,()=>blockFx(def,att,blood));};
  const dodge=(def,clip,t)=>at(Math.max(0,t-.32),()=>{def.mv=null;def.play(clip,.08);});
  const shots=[];const shoot=(F,from,to,v,onHit)=>{F.r.position.copy(from);F.play('Start');shots.push({F,to,v,onHit});};
  const stepShots=dt=>{for(let i=shots.length-1;i>=0;i--){const s=shots[i],t=s.to(),p=s.F.r.position,d=p.distanceTo(t),st=s.v*dt;
      if(d<=st){p.copy(t);s.F.play('Impact');s.F.after(2.2);s.onHit&&s.onHit(p.clone());shots.splice(i,1);}else{s.F.r.lookAt(t);p.addScaledVector(t.clone().sub(p),st/d);}}};
  const live=()=>SP.filter(k=>!k.dead&&k.m.visible);
  const ring=(p,n=60,v=7)=>{parts.emit('holy',new V3(p.x,.35,p.z),{n,v,ring:true,g:.2,drag:.6,life:.9,size:.06});};
  let focus=null;
  /* --- the paladin's spells --- */
  const divineShield=(after)=>{M.look=after||M.look;M.play('Cast spell 3',.15);at(.5,()=>parts.emit('holy',tip(),{n:10,v:.8,g:-.5,life:.8,size:.04}));
    at(1.6,()=>{AURA.follow=r=>r.position.set(M.m.position.x,.02,M.m.position.z);AURA.play('Start');AURA.after(14);ring(M.m.position,40,4);parts.emit('holy',tip(),{n:24,v:2.5,g:-.4,drag:1,life:1.2,size:.05});});return 2.4;};
  const turnUndead=(R=8)=>{M.play('Cast spell 1',.15);TIP.follow=r=>r.position.copy(tip());at(.45,()=>TIP.play('Start'));
    at(1.7,()=>{TIP.play('Cast');TIP.after(1.2);FLASH.r.position.copy(tip());FLASH.play('Explode');FLASH.after(1.6);ring(M.m.position,90,8);
      for(const k of live()){const d=k.m.position.distanceTo(M.m.position);if(d>R)continue;const dl=.15+d/14;
        k.fleeing=true;run((function*(){yield dl;k.mv=null;k.play(d<2.4?'Heavy hit':'Hit 1',.08);if(d<2.4)knock(k,M,1,.4);parts.emit('holy',chest(k),{n:12,v:2,g:-.5,life:.6,size:.04});yield .7;k.look=M;k.play('Hiss',.12);yield 1.1;
          const dx=k.m.position.x-M.m.position.x,dz=k.m.position.z-M.m.position.z,dd=Math.hypot(dx,dz)||1,tx=Math.max(-12,Math.min(12,k.m.position.x+dx/dd*5.5)),tz=Math.max(-5,Math.min(9,k.m.position.z+dz/dd*5.5));
          k.look=null;yield W(k,tx,tz,2.8,'Run');k.look=M;k.play('Idle',.3);k.idle='Idle';k.fleeing=false;})());}});return 2.4;};
  const consecrate=()=>{M.play('Cast spell 4',.15);
    at(.8,()=>{CIRC.r.position.set(M.m.position.x,.02,M.m.position.z);CIRC.play('Start');at(.4,()=>CIRC.play('Pulse'));CIRC.after(4.4);ring(M.m.position,70,5);
      let fi=0;for(const k of live()){if(k.m.position.distanceTo(M.m.position)>3.4)continue;const F=FIRES[fi++%2];
        run((function*(){yield .15;F.follow=r=>r.position.set(k.m.position.x,.02,k.m.position.z);F.play('Start');k.mv=null;k.play('Hit 2',.08);fxHit('holy',M,k);yield .8;k.play('Heavy hit',.1);yield .8;k.play('Death',.12);kill(k);yield 2.4;F.play('End');F.after(1.2);})());}});return 2.6;};
  const smite=(tgt)=>{M.look=tgt;M.play('Cast spell 2',.12);at(.45,()=>shoot(SMITE,tip(),()=>chest(tgt),14,()=>{tgt.mv=null;tgt.play('Hit 1',.08);fxHit('holy',M,tgt);knock(tgt,M,.6);}));return 1.3;};
  const bloodBolt=(mode)=>{V.look=M;V.play('Spell 1 (blood bolt)',.15);const v=11,dist=V.m.position.distanceTo(M.m.position),tI=.75+dist/v;
    at(.75,()=>shoot(BBOLT,wp(J.vOrbR),()=>wp(J.mShield),v,()=>blockFx(M,V,true)));if(mode==='block')at(Math.max(0,tI-.35),()=>{M.mv=null;M.play('Block',.1);});return tI;};

  /* ---------- the fight ---------- */
  let MAIN=null;
  function reset(){D.clear(MAIN);parts.clear();fx.stopAll();shots.length=0;door('Close');mauMx.update(10);
    M.m.position.set(MPOS[0],0,MPOS[1]);M.m.rotation.y=PI;M.idle='Idle (weapon sheathed)';M.play(M.idle,0);Object.assign(M,{mv:null,look:null,kb:null,dead:false,turnK:5});
    V.m.position.set(0,FLOOR,DOORIN);V.m.rotation.y=0;V.m.visible=false;V.play('Idle',0);Object.assign(V,{mv:null,look:null,kb:null,dead:false,idle:'Idle (war mode)'});
    SP.forEach((k,i)=>{k.m.position.set(RISE[i][0],0,RISE[i][1]);k.m.rotation.y=Math.atan2(-RISE[i][0],MPOS[1]-RISE[i][1]);k.m.scale.set(1,1,1);k.m.visible=false;Object.assign(k,{mv:null,look:null,kb:null,dead:true,idle:'Idle (war mode)'});k.pose('Rise from the ground',0);});
    focus=V;}
  function* intro(){
    run((function*(){yield 3.2;door('Open');yield 1.1;V.m.visible=true;V.play('Float',.2);V.mv={x:VPOS[0],z:VPOS[1],v:1.4};})());
    yield W(M,0,4.2,1.2,'Walk (weapon sheathed)');M.look=V;yield()=>!V.mv&&V.m.visible;
    V.look=M;V.play('Taunt (laugh)');yield .8;M.idle='Idle (war mode)';M.play('Draw');yield 2.3;
    /* he summons his spawn: they claw their way out of the ground */
    V.play('Spell 2 (summon spawn)');yield 1.8;
    SP.forEach((k,i)=>at(i*.3,()=>{k.m.visible=true;k.dead=false;k.play('Rise from the ground',0);const p=new V3(RISE[i][0],.05,RISE[i][1]+.4);
      parts.emit('dirt',p,{n:22,v:2.6,up:1.5,life:1.4,size:.07,R:.3});parts.emit('dust',p,{n:6,v:.6,up:.3,g:-.2,drag:1.5,life:1.6,size:.25,grow:.9,R:.4});parts.emit('blood',new V3(p.x,.6,p.z),{n:8,v:1,up:.5,g:-.3,drag:1.2,life:1.4,size:.04});}));
    yield 1.2;yield divineShield();yield 2.4;
    SP.forEach((k,i)=>{k.look=M;at(i*.35,()=>k.play('Hiss'));});yield 1.6;}
  function* wave1(){const[a,b,c,d]=SP;focus=a;M.look=a;
    run((function*(){yield 1.4;b.look=M;yield go(b,M,1.75,2.8,'Run',-.4);})());
    yield go(a,M,1.55,2.8,'Run',.3);yield .15;
    a.play('Claw swipe');block(M,a,.65);yield 1.3;
    yield strike(M,'Attack 1',[[.40,a,'Hit 1','flesh',.25]])-.1;
    yield strike(M,'Attack 2',[[.40,a,'Hit 2','flesh',.25]])-.15;
    /* the second leaps on him and feeds until the shield bash throws it off */
    focus=b;M.look=b;yield()=>!b.mv;b.play('Leap & feed',.1);
    at(1.0,()=>{M.mv=null;M.play('Hit 2',.08);fxHit('merc',b,M);});at(1.9,()=>{M.play('Hit 1',.1);fxHit('merc',b,M);});at(2.6,()=>{M.play('Hit 1',.1);fxHit('merc',b,M);});
    at(3.15,()=>strike(M,'Shield bash',[[.37,b,'Heavy hit','flesh',1.4]]));yield 4.4;
    /* the other two close in: Turn undead */
    focus=c;c.look=M;d.look=M;run((function*(){yield go(c,M,3.2,2.8,'Run',.7);})());run((function*(){yield .3;yield go(d,M,3.4,2.8,'Run',-1.5);})());yield 1.4;
    M.look=a;yield turnUndead()+.2;
    focus=V;yield bloodBolt('block')+.8;yield()=>!SP.some(k=>k.fleeing);
    /* they come back one by one */
    focus=a;a.idle='Idle (war mode)';a.look=M;M.look=a;yield go(a,M,1.55,1.2,'Walk (war mode)');
    a.play('Bite');dodge(M,'Dodge back',.55);yield 1.7;
    yield strike(M,'Combo',[[.35,a,'Hit 1','flesh',.15],[.77,a,'Hit 2','flesh',.15],[1.22,a,'Death','fleshDeath',.3]])+.2;
    focus=b;b.idle='Idle (war mode)';b.look=M;M.look=b;yield go(b,M,1.6,2.8,'Run');
    b.play('Claw swipe');at(.65,()=>{M.mv=null;M.play('Hit 2',.08);fxHit('merc',b,M);knock(M,b,.3,.3);});yield 1.3;
    yield strike(M,'Attack 3',[[.42,b,'Hit 1','flesh',.2]])-.1;
    yield strike(M,'Heavy attack',[[.92,b,'Death','fleshDeath',.4]])+.3;}
  function* wave2(){const[,,c,d]=SP;focus=c;c.idle=d.idle='Idle (war mode)';c.look=d.look=M;M.look=c;
    run((function*(){yield .4;yield go(d,M,1.7,2.8,'Run',-.55);})());yield go(c,M,1.7,2.8,'Run',.55);yield()=>!d.mv;
    c.play('Claw swipe');block(M,c,.65);yield 1.2;
    yield consecrate()+1.6;}
  function* boss(){focus=V;M.look=V;V.look=M;V.play('Taunt (laugh)');yield 2.4;
    yield go(V,M,2.6,1.4,'Float');yield go(V,M,1.7,1.0,'Float (war mode)');
    V.play('Claw slash');block(M,V,.55);yield 1.3;
    yield strike(M,'Attack 1',[[.40,V,'Hit 1','vamp',.6]])+.1;
    /* blood drain, broken by the divine shield */
    V.play('Spell 3 (blood drain)');let drain=true;run((function*(){yield .5;while(drain){parts.emit('blood',chest(M),{n:3,v:2,spread:1.5,dir:new V3(0,.5,0),home:()=>wp(J.vHandL),life:1.4,size:.045});yield .05;}})());
    at(.6,()=>M.play('Hit 2',.1));at(1.0,()=>divineShield());at(2.6,()=>{drain=false;V.mv=null;V.play('Hit 2',.08);fxHit('holy',M,V);knock(V,M,1.2,.5);});yield 3.6;
    yield smite(V)+.6;
    yield bloodBolt('block')+.6;
    yield go(M,V,1.6,.85,'Walk (war mode)');
    yield strike(M,'Attack 3',[[.42,V,'Hit 2','vamp',.3]])-.1;
    yield strike(M,'Heavy attack',[[.92,V,'Hit 1','vamp',1.6]])+.2;
    /* the pillar of holy fire; beaten, he flees into his cape */
    M.look=V;M.play('Cast spell 1',.15);TIP.follow=r=>r.position.copy(tip());at(.45,()=>TIP.play('Start'));
    at(1.7,()=>{TIP.play('Cast');TIP.after(1.2);PILLAR.r.position.set(V.m.position.x,0,V.m.position.z);PILLAR.play('Erupt');PILLAR.after(3);V.mv=null;V.play('Hit 1',.08);fxHit('holy',M,V);});
    at(2.6,()=>{V.play('Hit 2',.1);fxHit('vamp',M,V);});yield 3.6;
    V.play('Vanish');at(1.6,()=>parts.emit('smoke',new V3(V.m.position.x,.3,V.m.position.z),{n:24,v:1.2,up:.5,g:-.6,drag:1.4,life:2.2,size:.3,grow:1.2,R:.5}));yield 3.6;
    focus=M;M.look=null;M.play('Victory');yield 2.8;AURA.play('End');AURA.after(1.3);
    M.idle='Idle (weapon sheathed)';M.play('Sheathe');yield 4;}
  function* main(){for(;;){reset();yield .8;yield*intro();yield*wave1();yield*wave2();yield*boss();}}

  let ready=false,follow=true;const ft=new V3();
  root.userData.dbg=()=>({M,V,SP,ready,focus});
  root.userData.tick=dt=>{mauMx.update(dt);if(!ready){if(later.length||!M||!V||SP.length<4)return;ready=true;MAIN=run(main());}
    D.step(dt);stepShots(dt);M.update(dt);V.m.position.y=stairY(V.m.position.z);V.update(dt);for(const k of SP)k.update(dt);fx.update(dt);parts.update(dt);};
  root.userData.view={t:[0,1,3],r:19,ph:1.12,th:.5};
  root.userData.follow=()=>{if(!follow||!ready)return null;const p=M.m.position,f=focus&&focus!==M&&focus.m.visible?focus.m.position:p;return ft.set((p.x+f.x)/2,1,(p.z+f.z)/2);};
  root.userData.setOpt=(k,v)=>{if(k==='cam')follow=v==='follow';};
  sceneStats(root,{buildings:NB,trees:NT});root.userData.stats.enemies=(root.userData.stats.enemies||0)+5;
  root.userData.later=later;const step=()=>{if(!later.length)return;if(!root.parent&&root.userData.shown)return;later.shift()();setTimeout(step,60);};root.userData.shown=false;setTimeout(()=>{root.userData.shown=true;step();},400);
  return root;}
ASSETS.push({id:'sc-battle-vampire',folder:'scenes',name:'The vampire\'s mausoleum',kind:'scene',build:vxSceneVampireBattle,groundR:-1,
  opts:[{key:'cam',label:'Camera',choices:[['follow','Follow the fight'],['free','Free']],def:'follow',live:true}],
  desc:'A scripted battle that loops (about 100 s) in a fenced graveyard before a grand mausoleum. The Mercenary comes through the gate as a paladin (radiant sword, white shield); the mausoleum door swings open and the vampire floats out, laughs, and summons four spawn that claw their way out of the ground. The Mercenary blesses himself (Divine shield: a holy aura), blocks and cuts the first spawn, is leapt on and fed on by the second until a shield bash throws it off, then raises his sword and Turns undead: a burst of light, and every spawn near him hisses, recoils and flees. He blocks a blood lance, kills the spawn one by one as they creep back (they crumble to ash), and Consecrates the ground under the last two: a holy rune circle, and they burn in holy fire. Then the vampire: claw slash blocked, his blood drain broken by the divine shield, a Smite of holy light, a blood lance blocked, a heavy cleave, and a pillar of holy fire; beaten, he vanishes into his cape. Options: the camera follows the fight or stays free.'});
