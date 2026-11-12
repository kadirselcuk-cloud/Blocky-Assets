/* ======================= Scene: battle at the gates of Hell (sc-battle-hell), 60 × 60 m =======================
   A scripted fight that loops (about 105 s) before the infernal citadel, on the machinery of scenes10.js (btActor, btDirector,
   btParts, btFxPool, btEnds). The Mercenary crosses the lava bridge with a frost-enchanted sword; the Devil Lord walks out of the
   gatehouse, roars and summons: two imps rise from the summoning circle and two hellhounds leap out of the infernal portal.
   The Mercenary fights with four frost spells, each on one of his cast clips:
   - Frost ward (Cast spell 3, the blessing at 1.6 s): a frost aura round his feet; it holds the hellhound's fire breath off his shield
   - Ice spear (Cast spell 2, the thrust at 0.45 s): a spear of ice; it kills a taunting imp and brings the Devil Lord down from the air
   - Frost nova (Cast spell 4, the sword in the ground at 0.8 s): a frost rune circle and a burst of cold; the hounds are thrown back
   - Winter's wrath (Cast spell 1, the point at 1.7 s): an explosion of frost on the Devil Lord, knocking him onto one knee
   The Devil Lord answers with a hellfire bolt (blocked), a ring of fire round the Mercenary (he jumps out of it), his scimitar,
   a wing buffet, and a rain of fire from the air (the Mercenary runs clear). Slain demons burn away to embers; the Devil Lord
   sinks to his knees and shrinks to nothing in a burst of hellfire (his Death clip). */
function vxSceneHellBattle(){const root=new THREE.Group();root.userData.lights=[];root.userData.ground=-1;const rng=mulberry32(6661),S=60,PI=Math.PI,H90=PI/2;
  /* tiles: a lava river across the south (the bridge at x 0), citadel flagstones over the battlefield */
  const TILES=[];for(let x=-28;x<=28;x+=4)TILES.push(['lava',x,16,H90]);for(let x=-12;x<=12;x+=4)for(let z=-16;z<=8;z+=4)TILES.push(['floor',x,z,0]);
  const underTile=(x,z)=>TILES.some(t=>Math.abs(x-t[1])<2&&Math.abs(z-t[2])<2);
  const heightAt=(x,z)=>{if(underTile(x,z))return-.85;const e=Math.abs(x)-17;if(e>0&&z<14)return Math.min(6.5,Math.round((e*.9+Math.max(0,Math.sin(x*.5+z*.35))*e*.4)/.5)*.5);
    if(z>22){const f=z-22;return Math.round((f*.5+Math.max(0,Math.cos(x*.4))*f*.3)/.5)*.5;}return 0;};
  const surfAt=(x,z,h)=>{if(h>=1)return'hbas';const n=wlNoise(x*.18,z*.18,1);if(Math.abs(x)<17&&z<14)return wlNoise(x*.4+7,z*.4)>2?'hcrust':'hbrim';
    if(n<-2.1)return'hobs';if(wlNoise(x*.4+7,z*.4)>2.1)return'hcrust';return n>.2?'hash':'hbrim';};
  sceneTerrain(root,S,2,heightAt,surfAt,SC_HELL_SURF);
  const lavaMaps=[];root.traverse(o=>{if(o.isMesh&&o.material.emissiveMap&&!GLOW.includes(o.material)){GLOW.push(o.material);if(o.material.map&&o.material.map.image===LAVATEX.image)lavaMaps.push(o.material.map);}});
  const stat=new THREE.Group();root.add(stat);const dyn=new THREE.Group();dyn.userData.dynamic=true;root.add(dyn);
  const A=(id,x,z,ry=0,o={},s,y=0,par=stat)=>{const a=SC_A(id),m=a.build(s??a.defaultSeed??1,Object.assign((a.opts||[]).reduce((q,p)=>(q[p.key]=p.def,q),{}),o));m.traverse(q=>{if(q.isMesh){q.castShadow=!q.material.transparent;q.receiveShadow=true;}});
    m.position.set(x,y,z);m.rotation.y=ry;m.userData.isAsset=true;par.add(m);return m;};
  for(const[k,x,z,ry]of TILES){const t=k==='lava'?hlLavaTile('river'):hcFloor();t.position.set(x,-T,z);t.rotation.y=ry;t.userData.isAsset=true;stat.add(t);}
  let NB=0,NT=0;
  /* the citadel front: gatehouse (portcullis up), walls, horned towers, the keep behind */
  [-12,-8,-4,0,4,8,12].forEach((x,i)=>{const t=x===0?'gate':Math.abs(x)===8?'wall-spikes':Math.abs(x)===12?'wall-slit':'wall';A('hl-cit-'+t,x,-18,0,x===0?{state:'open'}:{},i+1);});
  for(const sd of[-1,1])A('hl-cit-tower',sd*14,-18,0,{},sd>0?2:1);A('hl-cit-keep',0,-26,0,{door:'open'});NB+=4;
  for(const sd of[-1,1]){A('hl-cit-column',sd*3.6,-15.2,0,{},sd>0?2:1);A('hl-cit-statue',sd*9.6,-15.6,-sd*.3,{},sd>0?2:1);A('hl-cit-banner',sd*6.2,-16.6,sd>0?PI:0);A('hl-brazier',sd*3,11.4,0);}
  A('hl-cit-bridge',0,16,H90);
  /* the summoning circle (west) and the infernal portal (east): both animate, so they stay out of the merged static */
  const CIRC0=[-8,-7],PORT=[8.5,-9],PRY=-.45;
  const CIRCLE=A('hl-tm-circle',CIRC0[0],CIRC0[1],0,{fire:'orange'},1,0,dyn),PORTAL=A('hl-portal',PORT[0],PORT[1],PRY,{fire:'orange'},1,0,dyn);NB+=2;
  for(const[x,z,s]of[[-12.6,-9.6,1],[-12.4,-3.6,2]])A('hl-tm-obelisk',x,z,0,{},s);
  for(const[x,z,id,s]of[[-4.6,-12.6,'hl-pyre',1],[12.6,-4.6,'hl-trophies',2],[12.4,-13,'hl-soul-cage',1],[-12.6,5.4,'hl-pyre',2],[12.8,5,'hl-spikes',2],[-6.2,10.6,'hl-spikes',3],[6.4,10.4,'hl-trophies',3],
    [-15.6,-1,'hl-burning',1],[15.6,1.6,'hl-burning',2],[-7.5,21.5,'hl-lava-pool',1],[8,21,'hl-lava-pool',2],[-3,20.4,'hl-lilies',1],[3.4,23,'hl-lilies',2]])A(id,x,z,rng()*6,{},s,Math.max(0,heightAt(x,z)));
  for(const[x,z,id,s]of[[-22,-12,'hl-spire',1],[22,-6,'hl-spire',3],[21,7,'hl-basalt',2],[-21.5,6,'hl-basalt',4],[-20,-26,'hl-shards',2],[23,-24,'hl-boulder',3],[-24,24,'hl-shards',3],[25,26,'hl-spire',2]])A(id,x,z,rng()*6,{},s,heightAt(x,z));
  for(const[x,z,id,s]of[[-16,20.5,'hl-tree-large',2],[17,19.6,'hl-tree-small',3],[-15.6,11.2,'hl-bone-tree',1],[15.8,10.6,'hl-tree-small',5],[-26,-4,'hl-tree-large',4],[27,12,'hl-bone-tree',2]]){A(id,x,z,rng()*6,{},s,heightAt(x,z));NT++;}
  const sl=[];root.traverse(o=>{if(o.isPointLight)sl.push(o);});sl.sort((a,b)=>(b.userData.min||0)-(a.userData.min||0)||b.distance-a.distance);sl.forEach(l=>{if(root.userData.lights.length<7)root.userData.lights.push(l);else l.parent.remove(l);});
  mergeStatic(stat,32);
  /* clips of the circle and the portal */
  const propMx=o=>{const mx=new THREE.AnimationMixer(o),P={cur:null,nx:null,end:0,
      play(n,loop,next){const c=o.userData.clips.find(c=>c.name===n);if(!c)return 0;mx.stopAllAction();const a=mx.clipAction(c);a.reset();a.setLoop(loop?THREE.LoopRepeat:THREE.LoopOnce,Infinity);a.clampWhenFinished=true;a.play();P.cur=a;P.nx=next||null;P.end=c.duration;return c.duration;},
      update(dt){mx.update(dt);if(P.nx&&P.cur.time>=P.end-1e-4){const n=P.nx;P.nx=null;P.play(n,true);}}};return P;};
  const cMx=propMx(CIRCLE),pMx=propMx(PORTAL);

  /* ---------- the fighters (queued) ---------- */
  const C=(id,seed,o,idle)=>{const a=SC_A(id),m=a.build(seed,Object.assign((a.opts||[]).reduce((q,p)=>(q[p.key]=p.def,q),{}),o));m.traverse(q=>{if(q.isMesh)q.castShadow=!q.material.transparent;});dyn.add(m);return btActor(m,idle);};
  const MPOS=[0,13.2],DPOS=[0,-19],DSTOP=[0,-8.6];
  const rot=(x,z,a)=>[x*Math.cos(a)+z*Math.sin(a),-x*Math.sin(a)+z*Math.cos(a)];
  const HPOS=[-1.3,1.3].map(x=>{const[dx,dz]=rot(x,2.7,PRY);return[PORT[0]+dx,PORT[1]+dz];}),IPOS=[[CIRC0[0]-.7,CIRC0[1]+.3],[CIRC0[0]+.7,CIRC0[1]-.3]];
  let M=null,DL=null;const IMP=[],HND=[],J={};let sword=null,staff=null;const later=[];
  later.push(()=>{M=C('mercenary',1,{wfx:'frost'},'Idle (weapon sheathed)');J.mChest=M.m.getObjectByName('chest');J.mShield=M.m.getObjectByName('mc_shield')||J.mChest;
    J.sword=M.m.getObjectByName('mc_sword');M.m.updateMatrixWorld(true);sword=btEnds(J.sword);});
  later.push(()=>{DL=C('devil-lord',17,{},'Idle (war mode)');DL.chest=DL.m.getObjectByName('chest');J.staff=DL.m.getObjectByName('weapon_L');J.vbody=DL.m.getObjectByName('vbody');
    DL.m.updateMatrixWorld(true);staff=btEnds(J.staff);compactRig(DL.m);});
  [6,7].forEach(s=>later.push(()=>{const k=C('imp',s,{},'Idle (war mode)');k.chest=k.m.getObjectByName('chest');compactRig(k.m);IMP.push(k);}));
  [[9,{}],[10,{gear:'collar'}]].forEach(([s,o])=>later.push(()=>{const k=C('hellhound',s,o,'Idle (war mode)');k.chest=k.m.getObjectByName('chest');k.head=k.m.getObjectByName('head');k.jaw=k.m.getObjectByName('jaw');compactRig(k.m);HND.push(k);}));
  const fx=btFxPool(dyn,root.userData.lights,4),parts=btParts(dyn);
  const AURA=fx.make('fx-aura',{col:'frost',size:'s'}),TIP=fx.make('fx-hand-frost',{col:'frost'}),FLASH=fx.make('fx-explosion',{col:'frost',size:'s'}),
    NOVA=fx.make('fx-rune-circle',{col:'frost',size:'l'}),SPEAR=fx.make('fx-ice-spear',{col:'frost'}),WRATH=fx.make('fx-explosion',{col:'frost',size:'m'}),
    BOLT=fx.make('fx-fireball',{col:'hell'}),BOOM=fx.make('fx-explosion',{col:'hell',size:'s'}),RING=fx.make('fx-fire-ring',{col:'hell',size:'s'}),
    RAIN=fx.make('fx-fire-rain',{col:'hell',size:'m'}),BREATH=fx.make('fx-fire-breath',{col:'fire',size:'s'});

  /* ---------- helpers ---------- */
  const D=btDirector(),run=g=>D.run(g),at=(s,f)=>run((function*(){yield s;f();})());
  const V3=THREE.Vector3,wp=(o,l)=>o.localToWorld(l?l.clone():new V3());
  const chest=a=>wp(a===M?J.mChest:a.chest),tip=()=>wp(J.sword,sword.head),staffHead=()=>wp(J.staff,staff.head);
  const W=(a,x,z,v,clip)=>{a.mv={x,z,v};a.play(clip,.25);return()=>!a.mv;};
  const near=(a,b,d,off=0)=>{const dx=a.m.position.x-b.m.position.x,dz=a.m.position.z-b.m.position.z,g=Math.atan2(dx,dz)+off;return[b.m.position.x+Math.sin(g)*d,b.m.position.z+Math.cos(g)*d];};
  const go=(a,b,d,v,clip,off)=>{const[x,z]=near(a,b,d,off);return W(a,x,z,v,clip);};
  const knock=(a,from,dist,dur=.35)=>{const dx=a.m.position.x-from.m.position.x,dz=a.m.position.z-from.m.position.z,d=Math.hypot(dx,dz)||1;a.kb={x:dx/d*dist,z:dz/d*dist,t:0,d:dur,e:0};};
  const away=(a,from)=>chest(a).sub(chest(from)).setY(0).normalize();
  const hitAt=(def,att)=>{const p=chest(def),d=chest(att).sub(p).setY(0).normalize();return p.addScaledVector(d,.22);};
  const fxHit=(kind,att,def)=>{if(!kind)return;const p=hitAt(def,att),dir=away(def,att).setY(.35);
    if(kind==='demon'||kind==='demonDeath'){const big=kind==='demonDeath';parts.emit('blood',p,{n:big?16:9,v:2.4,dir,spread:.9,life:1.1,size:.045});parts.emit('ember',p,{n:big?14:7,v:2.6,dir,spread:1,g:1,life:.6,size:.035});parts.emit('frost',p,{n:big?16:8,v:2.8,dir,spread:1.1,g:2,life:.5,size:.035});}
    else if(kind==='merc'){parts.emit('blood',p,{n:8,v:2.2,dir,spread:.8,life:1,size:.04});}
    else if(kind==='burn'){parts.emit('ember',p,{n:18,v:2,dir:new V3(0,1,0),spread:1.2,g:-1,drag:1,life:.9,size:.04});parts.emit('smoke',p,{n:5,v:.6,up:.6,g:-.6,drag:1.5,life:1.4,size:.16,grow:1});}
    else if(kind==='frost'){parts.emit('frost',p,{n:26,v:3.4,dir,spread:1.3,g:.6,life:.8,size:.05});parts.emit('smoke',p,{n:4,v:.5,dir,g:-.3,drag:1.5,life:1.1,size:.15,grow:1});}};
  const blockFx=(def,att,fire)=>{const p=wp(J.mShield),dir=away(def,att).multiplyScalar(-1).setY(.4);parts.emit('spark',p,{n:14,v:4,dir,spread:1.1,life:.3,size:.035,g:6});
    if(fire){parts.emit('ember',p,{n:22,v:3,dir,spread:1.4,g:1.5,life:.7,size:.045});parts.emit('frost',p,{n:10,v:2,dir,spread:1.2,g:1,life:.5,size:.035});}};
  /* slain demons burn away to embers once they lie still */
  const burn=k=>run((function*(){yield 2.4;const m=k.m;for(let t=0;t<1.4;t+=1/30){const u=t/1.4;m.scale.set(1-u*.3,Math.max(.02,1-u),1-u*.3);
      if(Math.random()<.7){const p=m.position;parts.emit('ember',new V3(p.x,.25,p.z),{n:3,v:.8,up:1.2,g:-1.2,drag:1.2,life:1.4,size:.04,R:.7});parts.emit('ash',new V3(p.x,.1,p.z),{n:1,v:.4,up:.4,g:-.4,drag:1.5,life:1.5,size:.2,grow:.8,R:.6});
        parts.emit('smoke',new V3(p.x,.3,p.z),{n:1,v:.4,up:.8,g:-.5,drag:1.2,life:1.6,size:.22,grow:1,R:.5});}yield 1/30;}m.visible=false;})());
  /* the Devil Lord's own Death shrinks him to nothing: a burst of hellfire and smoke as he goes */
  const lordGone=()=>run((function*(){yield 2.25;const p=DL.m.position;BOOM.r.position.set(p.x,.2,p.z);BOOM.play('Explode');BOOM.after(2.4);
    for(let t=0;t<1.6;t+=.05){parts.emit('ember',new V3(p.x,.6,p.z),{n:4,v:1.6,up:1.4,g:-1,drag:1,life:1.3,size:.045,R:.5});parts.emit('smoke',new V3(p.x,.5,p.z),{n:1,v:.6,up:.8,g:-.6,drag:1.3,life:2,size:.3,grow:1.2,R:.5});yield .05;}})());
  const kill=k=>{k.dead=true;k.look=null;k.mv=null;if(k===DL)lordGone();else burn(k);};
  const strike=(att,clip,hits)=>{if(hits[0])att.look=hits[0][1];const d=att.play(clip,.12);
    for(const[t,def,react,kind,push]of hits)at(t,()=>{if(def.dead)return;def.mv=null;if(react)def.play(react,react==='Death'?.12:.08);fxHit(kind,att,def);if(push)knock(def,att,push,react==='Death'?.25:.35);if(react==='Death')kill(def);});return d;};
  const block=(def,att,t,fire)=>{at(Math.max(0,t-.3),()=>{def.mv=null;def.play('Block',.1);});at(t,()=>blockFx(def,att,fire));};
  const dodge=(def,clip,t)=>at(Math.max(0,t-.32),()=>{def.mv=null;def.play(clip,.08);});
  const shots=[];const shoot=(F,from,to,v,onHit)=>{F.r.position.copy(from);F.play('Start');shots.push({F,to,v,onHit});};
  const stepShots=dt=>{for(let i=shots.length-1;i>=0;i--){const s=shots[i],t=s.to(),p=s.F.r.position,d=p.distanceTo(t),st=s.v*dt;
      if(d<=st){p.copy(t);s.F.play('Impact');s.F.after(2.2);s.onHit&&s.onHit(p.clone());shots.splice(i,1);}else{s.F.r.lookAt(t);p.addScaledVector(t.clone().sub(p),st/d);}}};
  const foes=()=>IMP.concat(HND).filter(k=>!k.dead&&k.m.visible);
  const ring=(p,n=60,v=7)=>{parts.emit('frost',new V3(p.x,.35,p.z),{n,v,ring:true,g:.2,drag:.6,life:.9,size:.06});};
  const fireEnd=(F,t)=>at(t,()=>{F.play('End');F.after(1.5);});
  /* the Jump forward clip lands 1.2 m on: move the root there as it ends */
  const jumpFwd=()=>{M.mv=null;const d=M.play('Jump forward',.1);at(d-.08,()=>{const r=M.m.rotation.y;M.m.position.x+=Math.sin(r)*1.2;M.m.position.z+=Math.cos(r)*1.2;M.play('Idle (war mode)',0);});return d;};
  let focus=null;
  /* --- the Mercenary's frost spells --- */
  const frostWard=()=>{M.play('Cast spell 3',.15);at(.5,()=>parts.emit('frost',tip(),{n:10,v:.8,g:-.5,life:.8,size:.04}));
    at(1.6,()=>{AURA.follow=r=>r.position.set(M.m.position.x,.02,M.m.position.z);AURA.play('Start');ring(M.m.position,40,4);parts.emit('frost',tip(),{n:24,v:2.5,g:-.4,drag:1,life:1.2,size:.05});});return 2.4;};
  const iceSpear=(tgt,onHit)=>{M.look=tgt;M.play('Cast spell 2',.12);at(.45,()=>shoot(SPEAR,tip(),()=>chest(tgt),16,()=>{fxHit('frost',M,tgt);onHit();}));return 1.3;};
  const frostNova=(R=6.5)=>{M.play('Cast spell 4',.15);
    at(.8,()=>{const p=M.m.position;NOVA.r.position.set(p.x,.02,p.z);NOVA.play('Start');at(.4,()=>NOVA.play('Pulse'));NOVA.after(4.2);FLASH.r.position.set(p.x,.1,p.z);FLASH.play('Explode');FLASH.after(1.8);ring(p,110,9);
      for(const k of foes()){const d=k.m.position.distanceTo(p);if(d>R)continue;run((function*(){yield .1+d/18;k.mv=null;k.play(k.clip('Hit')?'Hit':'Hit 1',.08);knock(k,M,1.6,.45);fxHit('frost',M,k);yield .9;k.play('Growl',.15);})());}});return 2.6;};
  const wrath=tgt=>{M.look=tgt;M.play('Cast spell 1',.15);TIP.follow=r=>r.position.copy(tip());at(.45,()=>TIP.play('Start'));
    at(1.7,()=>{TIP.play('Cast');TIP.after(1.2);const p=tgt.m.position;WRATH.r.position.set(p.x,.2,p.z);WRATH.play('Explode');WRATH.after(2.4);ring(p,80,6);tgt.mv=null;tgt.play('Heavy hit',.08);fxHit('frost',M,tgt);});return 2.4;};
  /* --- the Devil Lord's spells --- */
  const hellBolt=()=>{DL.look=M;DL.play('Spell 1 (hellfire bolt)',.15);const v=12,dist=DL.m.position.distanceTo(M.m.position),tI=.8+dist/v;
    at(.8,()=>shoot(BOLT,staffHead(),()=>wp(J.mShield),v,p=>{blockFx(M,DL,true);BOOM.r.position.copy(p);BOOM.play('Explode');BOOM.after(2.4);knock(M,DL,.3,.3);}));
    at(Math.max(0,tI-.35),()=>{M.mv=null;M.play('Block',.1);});return tI+.4;};
  const fireRing=()=>{DL.look=M;DL.play('Spell 2 (ring of fire)',.15);
    at(1.6,()=>{const p=M.m.position;RING.follow=null;RING.r.position.set(p.x,.02,p.z);RING.play('Start');parts.emit('ember',new V3(p.x,.2,p.z),{n:40,v:3,ring:true,g:-.5,drag:.8,life:.9,size:.05});});
    at(1.8,()=>{M.mv=null;M.play('Hit 2',.08);fxHit('burn',DL,M);});fireEnd(RING,5);return 1.6;};

  /* ---------- the fight ---------- */
  let MAIN=null;const DAIS=(x,z)=>Math.hypot(x-CIRC0[0],z-CIRC0[1])<3.6;
  function reset(){D.clear(MAIN);parts.clear();fx.stopAll();shots.length=0;pMx.play('Close');pMx.update(10);cMx.play('Idle',true);
    M.m.position.set(MPOS[0],0,MPOS[1]);M.m.rotation.y=PI;M.idle='Idle (weapon sheathed)';M.play(M.idle,0);Object.assign(M,{mv:null,look:null,kb:null,dead:false,turnK:5});
    DL.m.position.set(DPOS[0],0,DPOS[1]);DL.m.rotation.y=0;DL.m.visible=true;DL.play('Idle',0);if(J.vbody)J.vbody.scale.set(1,1,1);Object.assign(DL,{mv:null,look:null,kb:null,dead:false,idle:'Idle (war mode)'});
    IMP.forEach((k,i)=>{k.m.position.set(IPOS[i][0],-.9,IPOS[i][1]);k.m.rotation.y=Math.atan2(-IPOS[i][0],MPOS[1]-IPOS[i][1]);k.m.scale.set(1,1,1);k.m.visible=false;k.rising=true;Object.assign(k,{mv:null,look:null,kb:null,dead:true,idle:'Idle (war mode)'});k.play('Idle (war mode)',0);});
    HND.forEach((k,i)=>{k.m.position.set(HPOS[i][0],0,HPOS[i][1]);k.m.rotation.y=PRY;k.m.scale.set(1,1,1);k.m.visible=false;Object.assign(k,{mv:null,look:null,kb:null,dead:true,idle:'Idle (war mode)'});k.play('Idle (war mode)',0);});
    focus=DL;}
  function* intro(){
    run((function*(){yield .2;yield W(DL,DSTOP[0],DSTOP[1],1.3,'Walk');})());
    const ws=(M.clip('Walk (weapon sheathed)').speed)||1.3;yield W(M,0,3.6,ws,'Walk (weapon sheathed)');M.look=DL;yield()=>!DL.mv;
    DL.look=M;DL.play('Roar');yield .9;M.idle='Idle (war mode)';M.play('Draw');yield 2;
    /* the summoning: imps rise out of the circle, hellhounds leap out of the portal */
    DL.play('Spell 3 (summon)');yield 1.3;cMx.play('Summon',false,'Idle');pMx.play('Open');at(2.4,()=>pMx.play('Idle',true));
    IMP.forEach((k,i)=>at(.9+i*.35,()=>{k.m.visible=true;k.dead=false;k.look=M;run((function*(){for(let t=0;t<.9;t+=1/30){k.m.position.y=-.9+1.5*Math.min(1,t/.9);yield 1/30;}k.m.position.y=.6;k.rising=false;})());
      parts.emit('ember',new V3(k.m.position.x,.7,k.m.position.z),{n:20,v:2.4,up:1.5,g:-.5,drag:1,life:1,size:.045,R:.3});}));
    HND.forEach((k,i)=>at(1.7+i*.4,()=>{k.m.visible=true;k.dead=false;k.look=M;k.play('Growl',.1);const p=k.m.position;BOOM.r.position.set(p.x,.3,p.z);BOOM.play('Explode');BOOM.after(2.4);
      parts.emit('ember',new V3(p.x,.6,p.z),{n:24,v:3,up:1,g:1,life:.9,size:.045,R:.6});parts.emit('smoke',new V3(p.x,.5,p.z),{n:6,v:.6,up:.5,g:-.5,drag:1.4,life:1.6,size:.28,grow:1,R:.6});}));
    yield 2.3;IMP.forEach((k,i)=>at(i*.4,()=>k.play('Taunt')));yield 1.2;
    yield frostWard();yield .6;}
  function* wave1(){const[a,b]=IMP;focus=a;M.look=a;
    run((function*(){yield .6;b.look=null;yield go(b,M,1.05,5,'Fly (war mode)',-1.1);b.look=M;})());
    a.look=null;yield go(a,M,.95,5,'Fly (war mode)',.2);a.look=M;yield .15;
    a.play('Claw flurry');block(M,a,.40);at(.63,()=>blockFx(M,a));at(.88,()=>blockFx(M,a));yield 1.45;
    yield strike(M,'Attack 1',[[.40,a,'Hit 1','demon',.35]])-.1;
    dodge(a,'Dodge back',.40);yield strike(M,'Attack 2',[[.40,a,null,null,0]])-.15;
    /* the second stings him from the side; a shield bash throws it off */
    focus=b;yield()=>!b.mv;b.look=M;b.play('Tail sting');at(.57,()=>{M.mv=null;M.play('Hit 1',.08);fxHit('merc',b,M);});at(.9,()=>{M.play('Hit 2',.08);fxHit('merc',b,M);});yield 1.5;
    M.look=b;yield strike(M,'Shield bash',[[.37,b,'Hit 2','demon',1.6]]);
    focus=a;M.look=a;a.look=M;a.play('Swoop');dodge(M,'Dodge right',.52);yield 1.25;
    yield strike(M,'Combo',[[.35,a,'Hit 1','demon',.15],[.77,a,'Hit 2','demon',.15],[1.22,a,'Death','demonDeath',.4]])+.2;
    /* the other backs off to taunt him: an ice spear */
    focus=b;b.look=null;yield go(b,M,4.6,5,'Fly (war mode)');b.look=M;b.play('Taunt');yield .6;M.look=b;
    yield iceSpear(b,()=>{b.mv=null;b.play('Death',.1);kill(b);})+.6;}
  function* wave2(){const[c,d]=HND;focus=c;c.look=d.look=M;M.look=c;
    run((function*(){yield 1.3;yield go(d,M,3.1,6.5,'Run',1.25);d.look=M;})());yield go(c,M,3.1,6.5,'Run',-.3);c.look=M;
    c.play('Pounce');block(M,c,1.07);at(1.07,()=>{knock(M,c,.6,.3);knock(c,M,.5,.3);});yield 1.85;
    /* fire breath held off by the shield and the frost ward */
    focus=d;yield()=>!d.mv;M.look=d;d.look=M;d.play('Fire breath');at(.7,()=>{M.mv=null;M.play('Blocking (hold)',.12);});
    at(.95,()=>{BREATH.follow=r=>{const j=wp(d.jaw),h=wp(d.head);const f=j.clone().sub(h).setY(0).normalize();r.position.copy(j);r.lookAt(j.x+f.x,j.y-.12,j.z+f.z);};BREATH.play('Start');});
    run((function*(){yield 1.15;for(let t=0;t<1.1;t+=.12){blockFx(M,d,true);yield .12;}})());fireEnd(BREATH,2.25);at(2.55,()=>M.play('Idle (war mode)',.2));yield 2.85;
    yield frostNova()+.3;
    focus=c;M.look=c;yield go(M,c,2.1,4.5,'Run');M.look=c;
    yield strike(M,'Attack 3',[[.42,c,'Hit','demon',.3]])-.1;
    c.look=M;c.play('Bite');block(M,c,.45);yield 1.1;
    yield strike(M,'Heavy attack',[[.92,c,'Death','demonDeath',.5]])+.2;
    focus=d;d.look=M;M.look=d;yield go(d,M,2.2,6.5,'Run');
    d.play('Claw swipe');at(.45,()=>{M.mv=null;M.play('Hit 2',.08);fxHit('merc',d,M);knock(M,d,.4,.3);});yield 1.3;
    yield strike(M,'Spin attack',[[.42,d,'Hit','demon',.3],[1.36,d,'Death','demonDeath',.6]])+.3;}
  function* boss(){focus=DL;DL.look=M;M.look=DL;DL.play('Roar');yield 2.6;
    yield hellBolt()+.4;
    /* the ring of fire: he jumps out of it towards the Devil Lord */
    yield fireRing()+.95;M.look=DL;yield jumpFwd()+.1;
    {const[x,z]=near(M,DL,6),p=DL.m.position,dx=p.x-x,dz=p.z-z,dd=Math.hypot(dx,dz);run((function*(){yield W(M,x,z,1.2,'Walk (war mode)');M.look=DL;})());yield W(DL,x+dx/dd*1.9,z+dz/dd*1.9,1.5,'Walk (war mode)');}yield()=>!M.mv;M.look=DL;
    DL.play('Scimitar slash');block(M,DL,.53);yield 1.4;
    yield strike(M,'Attack 1',[[.40,DL,'Hit 1','demon',.4]])-.05;
    DL.play('Scimitar combo');block(M,DL,.53);at(.92,()=>{M.mv=null;M.play('Hit 2',.08);fxHit('merc',DL,M);knock(M,DL,.35,.3);});yield 2.0;
    yield strike(M,'Shield bash',[[.37,DL,'Hit 2','demon',.8]]);
    yield go(M,DL,1.85,(M.clip('Walk (war mode)').speed)||1.2,'Walk (war mode)');
    yield strike(M,'Attack 2',[[.40,DL,'Hit 1','demon',.3]])-.1;
    DL.play('Wing buffet');at(.7,()=>{M.mv=null;M.play('Heavy hit',.08);knock(M,DL,2.2,.5);parts.emit('dust',new V3(M.m.position.x,.2,M.m.position.z),{n:10,v:1.4,up:.3,g:-.2,drag:1.5,life:1.4,size:.25,grow:.9,R:.6});});yield 1.6;
    /* he takes to the air and rains fire; the Mercenary runs clear */
    DL.idle='Hover';DL.play('Take off',.15);yield 1.9;
    {const[x,z]=near(DL,M,6);DL.look=null;yield W(DL,x,z,2.2,'Fly');DL.look=M;yield .5;}
    DL.play('Spell 4 (rain of fire)',.15);at(1.25,()=>{const p=M.m.position;RAIN.r.position.set(p.x,0,p.z);RAIN.play('Start');});fireEnd(RAIN,4.6);
    at(1.05,()=>{const r=M.m.rotation.y,x=M.m.position.x+Math.cos(r)*3.4,z=M.m.position.z-Math.sin(r)*3.4;M.look=null;W(M,x,z,4.5,'Run');});yield 2.6;
    yield()=>!M.mv;M.look=DL;
    /* an ice spear brings him down; winter's wrath puts him on one knee */
    yield iceSpear(DL,()=>{DL.mv=null;DL.idle='Idle (war mode)';DL.play('Land',.1);at(1.65,()=>DL.play('Idle (war mode)',.2));})+1.1;
    yield wrath(DL);
    yield go(M,DL,1.8,4.5,'Run');
    yield strike(M,'Heavy attack',[[.92,DL,'Hit 2','demon',.5]])-.2;
    yield strike(M,'Combo',[[.35,DL,'Hit 1','demon',.1],[.77,DL,'Hit 2','demon',.1],[1.22,DL,'Death','demonDeath',.3]])+.4;
    yield 3.6;focus=M;M.look=null;M.play('Victory');yield 2.8;AURA.play('End');AURA.after(1.3);
    M.idle='Idle (weapon sheathed)';M.play('Sheathe');yield 4;}
  function* main(){for(;;){reset();yield .8;yield*intro();yield*wave1();yield*wave2();yield*boss();}}

  let ready=false,follow=true;const ft=new V3();
  root.userData.dbg=()=>({M,DL,IMP,HND,ready,focus});
  root.userData.tick=dt=>{hlLavaTick();const o=LAVATEX.offset;for(const m of lavaMaps)m.offset.copy(o);cMx.update(dt);pMx.update(dt);
    if(!ready){if(later.length||!M||!DL||IMP.length<2||HND.length<2)return;ready=true;MAIN=run(main());}
    D.step(dt);stepShots(dt);M.update(dt);DL.update(dt);
    /* imps hover over the dais (0.6 m up) and come down to the floor once off it */
    for(const k of IMP){if(!k.rising&&!k.dead){const p=k.m.position,g=DAIS(p.x,p.z)?.6:0;p.y+=(g-p.y)*Math.min(1,dt*4);}else if(k.dead&&!k.rising)k.m.position.y+=(0-k.m.position.y)*Math.min(1,dt*4);k.update(dt);}
    for(const k of HND)k.update(dt);fx.update(dt);parts.update(dt);};
  root.userData.view={t:[0,1,-2],r:22,ph:1.12,th:.5};
  root.userData.follow=()=>{if(!follow||!ready)return null;const p=M.m.position,f=focus&&focus!==M&&focus.m.visible?focus.m.position:p;return ft.set((p.x+f.x)/2,1,(p.z+f.z)/2);};
  root.userData.setOpt=(k,v)=>{if(k==='cam')follow=v==='follow';};
  sceneStats(root,{buildings:NB,trees:NT});root.userData.stats.enemies=(root.userData.stats.enemies||0)+5;
  root.userData.later=later;const step=()=>{if(!later.length)return;if(!root.parent&&root.userData.shown)return;later.shift()();setTimeout(step,60);};root.userData.shown=false;setTimeout(()=>{root.userData.shown=true;step();},400);
  return root;}
ASSETS.push({id:'sc-battle-hell',folder:'scenes',name:'Battle at the gates of Hell',kind:'scene',build:vxSceneHellBattle,groundR:-1,
  opts:[{key:'cam',label:'Camera',choices:[['follow','Follow the fight'],['free','Free']],def:'follow',live:true}],
  desc:'A scripted battle that loops (about 105 s) before the infernal citadel. The Mercenary crosses the lava bridge with a frost-enchanted sword; the Devil Lord walks out of the gatehouse, roars and summons: two imps rise out of the summoning circle and two hellhounds leap out of the infernal portal. The Mercenary wards himself in frost, blocks an imp\'s claw flurry, is stung by the other\'s tail and throws it off with a shield bash, dodges a swoop and cuts the first imp down, then kills the second with an ice spear as it taunts him. He blocks a hellhound\'s pounce and holds its fire breath off with his shield, throws both hounds back with a frost nova and kills them. Then the Devil Lord: a hellfire bolt blocked, a ring of fire he jumps out of, scimitar blows traded, a wing buffet that throws him back; the Devil Lord takes to the air and rains fire, the Mercenary runs clear, brings him down with an ice spear, knocks him onto one knee with winter\'s wrath, and finishes him: he sinks to his knees and shrinks to nothing in a burst of hellfire. Slain demons burn away to embers. Options: the camera follows the fight or stays free.'});
