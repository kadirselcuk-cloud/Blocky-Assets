/* ======================= GHOUL: a risen corpse that limps, on the villager joint layout =======================
   Human-sized (VB.ghoul is the villager male's proportions), built from its own meshes like the skeleton: every joint carries
   one named piece (g_chest, g_head, g_thigh_L…), so Death can let the body fall apart and Rise can put it back together
   (skDeathRise, shared with the skeletons). The left arm is torn off at the elbow (the forearm, hand and finger joints are there
   but empty), the left leg is wounded and drags. The right hand attacks with its claws, a knife, a small cleaver or a small club.
   Clips are solved with the warrior's leg and arm IK (wrSolve). The walks are a limp: the good right leg stays planted most of the
   stride, the left leg's stance is short, it swings stiffly outwards with the toes scraping, and the body dips when it lands on it.
   The left stump is keyed directly (stL, upper-arm angles) and the lower jaw is its own piece (g_jaw, jw = opening in radians). */
VB.ghoul=Object.assign({},VB.male,{sex:'male'});
{const b=VB.ghoul;b.key='ghoul';b.hipH=b.thigh+b.shin+b.ankle+b.hipOff;b.legS=(b.thigh+b.shin)/.84;b.tS=(b.spine+b.chest)/.3;b.cS=b.neck/.22;}
const GH_SKIN={grey:['#8c9286','ashen grey'],green:['#7e8a62','grey-green'],blue:['#7a8796','bluish'],bruised:['#887480','bruised'],brown:['#8a7658','leathery brown']};
const GH_EYES={milky:['#d8dccc',null,'milky eyes'],yellow:['#ffe9a0','#ffc23a','yellow glowing eyes'],red:['#ffb0a0','#ff3a1e','red glowing eyes']};
const GH_CLOTH={rags:'ragged shirt and trousers',shroud:'burial shroud',bare:'torn trousers, bare chest'};
const GH_WPN={none:'claws',knife:'knife',cleaver:'small cleaver',club:'small club'};

/* knife and small cleaver: grip at the origin, along +y, edge towards +x (same frame as gbWeapon) */
function ghKnife(){const w=new THREE.Group(),ir=vm('iron'),dk=bm('#4a4e54','plain'),wood=bm('#5a3e26','leather'),rust=bm('#7a4a2e','plain');
  bx(w,.034,.11,.03,wood,0,.0,0);bx(w,.04,.018,.036,dk,0,-.06,0);bx(w,.05,.016,.034,dk,0,.063,0);
  bx(w,.036,.1,.01,ir,.004,.12,0);bx(w,.028,.06,.01,ir,.0,.2,0);bx(w,.014,.03,.01,ir,-.004,.244,0);bx(w,.012,.04,.012,rust,.012,.13,0);w.userData.len=.26;return w;}
function ghCleaver(){const w=new THREE.Group(),ir=vm('iron'),dk=bm('#4a4e54','plain'),wood=bm('#5a3e26','leather'),wdD=bm('#3e2a1a','leather'),rust=bm('#7a4a2e','plain');
  bx(w,.034,.13,.03,wood,0,.0,0);for(const y of[-.03,.03])bx(w,.036,.01,.032,wdD,0,y,0);bx(w,.03,.03,.016,dk,0,.075,0);
  bx(w,.11,.17,.01,ir,.03,.17,0);bx(w,.016,.17,.016,dk,-.018,.17,0);bx(w,.018,.012,.012,bm('#16120e','plain'),-.002,.235,0);
  bx(w,.03,.05,.014,rust,.06,.12,0);bx(w,.02,.03,.014,rust,.0,.21,0);w.userData.len=.26;return w;}

function buildGhoul(seed,o={}){const B=VB.ghoul,r=mulberry32(((seed*2654435761)>>>0)^0x6b0f),pick=a=>a[Math.floor(r()*a.length)],root=new THREE.Group();root.userData.lights=[];
  /* roll everything, then let the options override */
  const skin0=pick(Object.keys(GH_SKIN)),cloth0=pick(['rags','rags','shroud','bare']),wpn0=pick(['none','knife','cleaver','club']),eye0=pick(['milky','milky','yellow','red']);
  const rag0=pick(GB_RAG),rag1=pick(GB_RAG),hairN=1+Math.floor(r()*4),toe=r()<.5,ear=r()<.5;
  const opt=(k,d)=>o[k]&&o[k]!=='random'?o[k]:d,skinK=opt('skin',skin0),cloth=opt('clothes',cloth0),wpn=opt('weapon',wpn0),eyeK=opt('eyes',eye0);
  const shade=(h,f)=>'#'+new THREE.Color(h).multiplyScalar(f).getHexString(),SK=GH_SKIN[skinK][0];
  const skin=bm(SK,'skin'),skinD=bm(shade(SK,.72),'skin'),skinL=bm(shade(SK,1.12),'skin'),vein=bm(shade(SK,.5),'skin');
  const wound=bm('#5e2420','plain'),woundD=bm('#36140f','plain'),flesh=bm('#86403a','plain'),bone=bm('#d6caa6','plain'),dark=bm('#16120e','plain'),nail=bm('#3a3226','plain'),teeth=bm('#c4b88a','plain'),hair=bm('#2a2622','hair');
  const ey=GH_EYES[eyeK],eyeM=ey[1]?wrGlow(ey[0],ey[1],1.4,pxTex('plain')):bm(ey[0],'plain');
  const shroud=cloth==='shroud',lin=bm('#b3a684','cloth'),linD=bm('#8e8266','cloth'),top=cloth==='rags'?bm(rag0[0],'cloth'):lin,topD=cloth==='rags'?bm(shade(rag0[0],.72),'cloth'):linD;
  const pants=shroud?lin:bm(rag1[0],'cloth'),pantsD=shroud?linD:bm(shade(rag1[0],.72),'cloth'),rope=vm('rope'),shirt=cloth!=='bare';
  const P=(name,par,o2={})=>{const g=new THREE.Group();g.name=name;g.userData.piece=true;Object.assign(g.userData,o2);par.add(g);return g;};
  const fwd='fwd';
  /* joints: same names, offsets and order as buildVillager */
  const hips=J('hips',root,0,B.hipH,0),spine=J('spine',hips,0,B.spine,0),chest=J('chest',spine,0,B.chest,0),neck=J('neck',chest,0,B.neck,0),head=J('head',neck,0,B.headY,0);
  /* torso: one chunk in Death (chest with belly, pelvis and neck), lies face down along the fall */
  const pv=P('g_pelvis',hips,{joinChunk:'g_chest'}),bl=P('g_belly',spine,{joinChunk:'g_chest'}),nk=P('g_neck',neck,{joinChunk:'g_chest'});
  const ch=P('g_chest',chest,{restRule:{long:'y',up:'z',sgn:-1,L:fwd,yaw:12,first:true}});
  /* pelvis: trousers (or a linen loincloth) with a rope belt */
  bx(pv,.27,.17,.17,pants,0,0,0);bx(pv,.28,.03,.18,shroud?linD:rope,0,.07,0);if(!shroud){bx(pv,.03,.07,.012,rope,.05,.02,.092);bx(pv,.06,.04,.012,pantsD,-.07,-.04,.088);}
  /* belly: sunken waist; shirt or shroud over it, a ragged hem */
  bx(bl,.235,.24,.15,shirt?top:skin,0,.07,0);if(!shirt){bx(bl,.02,.02,.008,skinD,0,0,.077);bx(bl,.05,.04,.008,wound,.06,.05,.077);}
  else{bx(bl,.245,.03,.16,topD,0,-.035,0);for(const[x,L]of[[-.09,.05],[-.03,.03],[.04,.06],[.1,.04]])bx(bl,.04,L,.012,top,x,-.05-L/2,.077);}
  /* chest: ribcage under the skin, a torn hole on the left showing ribs, spine knobs, collarbones */
  bx(ch,.3,.25,.19,shirt?top:skin,0,.1,0);bx(ch,.13,.03,.02,skinD,.07,.205,.088);bx(ch,.13,.03,.02,skinD,-.07,.205,.088);
  bx(ch,.11,.13,.012,woundD,.065,.08,.1);for(const y of[.04,.08,.12])bx(ch,.11,.018,.012,bone,.065,y,.106);bx(ch,.03,.13,.008,wound,.13,.08,.1);
  if(shirt){bx(ch,.06,.04,.01,topD,-.06,.0,.1);if(!shroud)for(const s of[-1,1])bx(ch,.035,.012,.2,topD,s*.11,.226,0);
    if(shroud){bx(ch,.31,.03,.2,linD,0,.04,0,0,0,.5);bx(ch,.31,.03,.2,linD,0,.16,0,0,0,-.4);}}
  else{for(const y of[.0,.05,.1,.15])for(const s of[-1,1])bx(ch,.06,.014,.012,skinD,s*.11,y,.098);}
  for(const y of[-.02,.05,.12,.19])bx(ch,.03,.03,.02,shirt?topD:skinD,0,y,-.1);
  /* neck: thin, tendons */
  bx(nk,.085,.13,.085,skin,0,.015,-.01);for(const s of[-1,1])bx(nk,.014,.11,.012,skinD,s*.022,.01,.033);
  /* head: skull with sunken cheeks and eye sockets, rotted nose, upper teeth, torn left cheek, patchy hair, small ears */
  const hd=P('g_head',head,{restRule:{long:'z',up:'y',sgn:1,yaw:60,tilt:22,roll:.28,bounce:true}});
  bx(hd,.2,.18,.22,skin,0,.15,.005);bx(hd,.16,.05,.06,skin,0,.08,.08);bx(hd,.21,.035,.03,skinD,0,.175,.11);
  for(const s of[-1,1]){bx(hd,.056,.046,.012,dark,s*.05,.14,.116);bx(hd,.02,.02,.008,eyeM,s*.05,.138,.124);bx(hd,.012,.07,.08,skinD,s*.1,.1,.06);}
  bx(hd,.034,.04,.012,dark,0,.1,.116);bx(hd,.03,.02,.02,skinD,0,.125,.12);bx(hd,.13,.04,.07,dark,0,.06,.06);bx(hd,.11,.02,.012,teeth,0,.064,.112);
  bx(hd,.012,.05,.06,woundD,.1,.075,.07);for(const z of[.06,.085])bx(hd,.008,.016,.014,teeth,.106,.068,z);
  bx(hd,.022,.05,.036,skinD,-.108,.12,-.01);bx(hd,.022,ear?.03:.05,.036,skinD,.108,ear?.11:.12,-.01);
  [[-.04,.245,-.02,.08,.1],[.05,.243,-.06,.06,.08],[-.06,.235,.04,.05,.06],[.03,.244,.03,.05,.05]].slice(0,hairN).forEach(([x,y,z,w,d])=>bx(hd,w,.022,d,hair,x,y,z));
  bx(hd,.05,.1,.02,hair,-.05,.17,-.112);if(hairN>2)bx(hd,.04,.07,.02,hair,.045,.185,-.112);bx(hd,.05,.012,.06,wound,.06,.242,.02);
  /* lower jaw: its own piece hinged under the ears, hanging open; rides with the head in Death */
  const jw=P('g_jaw',head,{joinChunk:'g_head'});jw.position.set(0,.07,0);jw.rotation.x=.12;
  bx(jw,.14,.035,.045,skin,0,-.045,.085);for(const s of[-1,1])bx(jw,.022,.05,.11,skin,s*.072,-.028,.035);bx(jw,.09,.018,.012,teeth,0,-.022,.104);bx(jw,.1,.012,.06,woundD,0,-.03,.06);
  /* arms: the right one whole with clawed fingers; the left torn off at the elbow, bone sticking out of the ragged stump */
  const sockets={};
  for(const[sd,s]of[['L',1],['R',-1]]){const sh=J('shoulder_'+sd,chest,s*B.shW*.325,.165*B.cS,0),ua=J('upperArm_'+sd,sh,s*B.shW*.675,0,0),fa=J('foreArm_'+sd,ua,0,-B.ua,0),hd2=J('hand_'+sd,fa,0,-B.fa,0);
    const fg=J('fingers_'+sd,hd2,0,-.085,0),ft=J('fingerTips_'+sd,fg,0,-.035,0),th=J('thumb_'+sd,hd2,-s*.02,-.04,.051),so=J('socket_'+sd,hd2,-s*.012,-.075,0);so.userData.socket=true;sockets[sd]=so;
    const up=P('g_upperArm_'+sd,ua,{restRule:{long:'y',up:'x',L:fwd,yaw:55}});bx(up,.088,.08,.095,shirt?top:skin,s*-.005,-.01,0);
    if(sd==='R'){bx(up,.07,.25,.07,skin,0,-.15,0);bx(up,.074,.04,.074,skinD,0,-.275,0);if(shirt)bx(up,.082,.12,.082,top,0,-.06,0);
      const fr=P('g_foreArm_R',fa,{restRule:{long:'y',up:'x',L:fwd,yaw:60}});bx(fr,.062,.23,.062,skin,0,-.12,0);bx(fr,.056,.03,.056,skinD,0,-.24,0);bx(fr,.012,.14,.01,vein,.0,-.12,.031);
      const hb=P('g_hand_R',hd2,{joinChunk:'g_foreArm_R'});bx(hb,.045,.09,.07,skin,0,-.04,0);bx(hb,.047,.012,.072,skinD,0,-.08,0);
      const fb=P('g_fingers_R',fg,{joinChunk:'g_foreArm_R'}),tb=P('g_tips_R',ft,{joinChunk:'g_foreArm_R'}),thb=P('g_thumb_R',th,{joinChunk:'g_foreArm_R'});
      for(const z of[-.024,-.008,.008,.024]){bx(fb,.02,.04,.015,skin,0,-.018,z);bx(tb,.018,.03,.014,skinD,0,-.014,z);bx(tb,.012,.03,.01,nail,s*-.004,-.04,z);}
      bx(thb,.022,.045,.022,skin,0,-.02,-.02);bx(thb,.014,.022,.012,nail,0,-.05,-.02);}
    else{bx(up,.07,.19,.07,skin,0,-.12,0);bx(up,.074,.03,.072,wound,0,-.225,0);bx(up,.03,.05,.02,skinD,.02,-.235,.03);bx(up,.025,.04,.025,skin,-.022,-.24,-.024);
      bx(up,.028,.07,.028,bone,0,-.27,.006);bx(up,.036,.022,.034,bone,0,-.3,.006);bx(up,.05,.012,.05,woundD,0,-.24,0);
      if(shirt){bx(up,.082,.11,.082,top,0,-.06,0);for(const[x,z,L]of[[.02,.043,.09],[-.025,-.043,.07],[.043,0,.11]])bx(up,Math.abs(x)>.04?.01:.025,L,Math.abs(x)>.04?.025:.01,topD,x,-.11-L/2,z);}}}
  /* legs: thighs in trousers; the right trouser leg reaches the ankle, the left is torn at the knee over a deep gash with the shin bone
     showing and a dirty bandage; bare feet whose sole matches the IK foot (heel to toe, 0.07 below the ankle) */
  for(const[sd,s]of[['L',1],['R',-1]]){const th=J('thigh_'+sd,hips,s*B.hipW,-(B.hipOff+.01),0),sn=J('shin_'+sd,th,0,-B.thigh,0),ft=J('foot_'+sd,sn,0,-B.shin,0);
    const tg=P('g_thigh_'+sd,th,{restRule:{long:'y',up:'x',L:fwd,yaw:20}});bx(tg,.105,.41,.11,pants,0,-.2,0);
    const sg=P('g_shin_'+sd,sn,{restRule:{long:'y',up:'x',L:fwd,yaw:22}}),fb=P('g_foot_'+sd,ft,{joinChunk:'g_shin_'+sd});
    bx(sg,.092,.06,.1,sd==='L'||shroud?skin:pants,0,-.01,0);bx(sg,.084,.36,.088,skin,0,-.2,0);
    if(sd==='R'&&!shroud){bx(sg,.1,.33,.104,pants,0,-.16,0);for(const[x,L]of[[-.03,.04],[.02,.06],[.04,.03]])bx(sg,.025,L,.012,pantsD,x,-.325-L/2,.047);}
    if(sd==='L'){for(const[x,L]of[[-.03,.05],[.01,.08],[.035,.04]])bx(tg,.025,L,.012,pantsD,x,-.405-L/2,.052);bx(tg,.012,.07,.03,pantsD,s*.053,-.43,0);
      bx(sg,.094,.04,.098,lin,0,-.07,0);bx(sg,.03,.1,.01,linD,.03,-.13,.05);bx(sg,.034,.13,.012,woundD,-.006,-.2,.045);bx(sg,.012,.1,.008,bone,-.006,-.2,.05);bx(sg,.05,.03,.01,wound,-.006,-.27,.045);}
    if(shroud)bx(tg,.11,.06,.115,linD,0,-.03,0);
    bx(fb,.07,.04,.075,skin,0,-.025,0);bx(fb,.08,.035,.18,skin,0,-.0525,.02);bx(fb,.075,.02,.024,skinD,0,-.06,.122);
    if(sd==='L'&&toe)bx(fb,.02,.022,.026,wound,.028,-.059,.122);bx(fb,.06,.012,.05,skinD,0,-.03,.07);}
  /* weapon in the right hand (blade along the thumb side, edge towards the fingers) */
  if(wpn!=='none'){const wr=new THREE.Group();wr.name='weapon_R';wr.userData.piece=wr.userData.gear=true;sockets.R.add(wr);const wp=wpn==='club'?skClub():wpn==='knife'?ghKnife():ghCleaver();
    wp.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(new THREE.Vector3(0,-1,0),new THREE.Vector3(0,0,1),new THREE.Vector3(-1,0,0)));wr.add(wp);}
  /* a held weapon keeps the right fist closed; empty, the claws follow the clips */
  const D2=Math.PI/180,Jn=n=>root.getObjectByName(n);
  root.userData.post=()=>{if(wpn!=='none'){Jn('fingers_R').rotation.set(0,0,95*D2);Jn('fingerTips_R').rotation.set(0,0,90*D2);Jn('thumb_R').rotation.set(14*D2,0,33*D2);}};
  const joints=[];root.traverse(q=>{if(q.userData.joint&&!q.userData.socket)joints.push(q);});root.userData.joints=joints;
  if(!o.noClips){root.userData.clips=ghoulClips(B,wpn);root.userData.clips=root.userData.clips.concat(ghDeathRise(root,B,seed));jw.rotation.x=.12;}
  root.userData.ground=1.6;
  root.userData.variantText=`${GH_SKIN[skinK][1].charAt(0).toUpperCase()+GH_SKIN[skinK][1].slice(1)} skin, ${ey[2]}; ${GH_CLOTH[cloth]}; ${wpn==='none'?'claws only':'a '+GH_WPN[wpn]+' in the right hand'}. Left forearm torn off at the elbow, wounded left leg.`;
  return root;}

/* Death: shudders, the wounded leg gives way and the body pitches forward; at the release every piece comes loose and falls ahead
   (the higher it started, the further), the head rolls off. Rise: the pieces twitch, fly back and the body straightens. */
function ghDeathRise(root,B,seed){return skDeathRise(root,B,seed,{tDet:.78,tW:.5,fwd:.5,sh:1.1,rise:[1.0,.9,.6,1.2],
  keys:[[.12,{sp:[-6,0,0],ch:[-12,0,0],nk:[-6,0,0],hd:[-22,0,12],uR:[-16,0,-12],uL:[-14,0,14]},'out'],
    [.4,{sp:[4,0,4],ch:[6,0,6],nk:[6,0,0],hd:[12,12,22],uR:[10,0,0],uL:[10,0,0],tL:[-14,0,0],kL:[36,0,0],aL:[-20,0,0],tR:[-6,0,0],kR:[12,0,0],aR:[-6,0,0],jit:[1]}],
    [.78,{h:[34,0,10],sp:[14,0,6],ch:[14,0,4],nk:[14,0,0],hd:[24,16,28],uL:[40,0,6],uR:[44,0,8],fR:[20,0,0],tL:[-40,0,0],kL:[82,0,0],aL:[-36,0,0],tR:[-28,0,0],kR:[56,0,0],aR:[-24,0,0],jit:[.6]},'in']],
  notes:['Shudders, the wounded leg gives way, pitches forward and falls apart: head, arms, legs and torso land in a heap ahead of the feet','The pieces twitch, fly back together top first, then it straightens into the hunched war stance']});}

/* ---------- clips ---------- */
const GH_CLIPS={};
function ghoulClips(B,wpn){const key=B.key+':'+wpn;if(GH_CLIPS[key])return GH_CLIPS[key];const D=Math.PI*2,S=Math.sin,C=Math.cos,V3=THREE.Vector3,Q=THREE.Quaternion,L=[],held=wpn!=='none',FI=[0,held?95:38];
  const R=wrRig(B,false);
  /* stances: relaxed (IST, weight on the good right leg, arm hanging) and war mode (GST, hunched, claws or weapon raised, jaw open) */
  const IST={HP:[-.015,-.07,0],h:[14,0,4],sp:[12,0,0],ch:[18,0,-3],nk:[18,0,0],hd:[-20,0,12],FL:[.14,.04,22,0,0],FR:[-.12,-.04,-8,0,0],
      gR:[-.25,.88,.2],dR:held?[0,-.4,.92]:[0,-.7,.7],pR:[-.5,-.3,-.8],stL:[4,0,6],jw:[.12],fist:FI};
  const GST=wrP(IST,{HP:[-.01,-.13,0],h:[20,-6,5],sp:[16,-2,0],ch:[20,-4,-3],nk:[20,0,0],hd:[-26,0,10],FL:[.15,.07,24,0,0],FR:[-.13,-.13,-10,0,0],
      gR:[-.32,1.22,.42],dR:held?[-.1,.62,.78]:[-.1,.5,.86],pR:[-.85,-.25,-.4],stL:[-24,0,28],jw:[.3]});
  /* continuity for one-shot clips (right arm only): as in warriorClips */
  let EL=null,HR=null;
  const elbow=()=>{R.m.updateMatrixWorld(true);const Sh=R.J.upperArm_R.getWorldPosition(new V3()),E=R.J.foreArm_R.getWorldPosition(new V3()),W=R.J.hand_R.getWorldPosition(new V3()),u=W.sub(Sh).normalize();E.sub(Sh);E.addScaledVector(u,-E.dot(u));return E.lengthSq()>1e-6?E.normalize():null;};
  const roll=()=>{const hq=R.J.hand_R.getWorldQuaternion(new Q()),Dh=new V3(0,0,1).applyQuaternion(hq),yw=new V3(0,1,0).applyQuaternion(hq);return{D:Dh,A:yw.addScaledVector(Dh,-yw.dot(Dh)).negate().normalize()};};
  const carry=(H,Dv)=>{const A=H.A.clone().applyQuaternion(new Q().setFromUnitVectors(H.D,Dv));return A.addScaledVector(Dv,-A.dot(Dv)).normalize();};
  const solve=(p,cont,w=1)=>{let s=wrSolve(R,p);if(cont){let e=elbow(),h=roll();
      if(EL){const q=Object.assign({},p);if(e&&e.angleTo(EL)>WR_JUMP){q.pR=new V3(...p.pR).normalize().lerp(EL,.85*w).normalize().toArray();s=wrSolve(R,q);e=elbow();h=roll();}
        if(HR){const A=carry(HR,h.D),th=Math.atan2(new V3().crossVectors(A,h.A).dot(h.D),A.dot(h.A)),Jm=WR_JUMP/Math.max(w,1e-3);if(Math.abs(th)>Jm){q.eR=(Math.abs(th)>Math.PI/2&&w>=1?A:A.applyAxisAngle(h.D,Math.sign(th)*Jm)).toArray();s=wrSolve(R,q);e=elbow();h=roll();}}}
      EL=e;HR=h;}
    /* the stump is keyed directly; the missing forearm and hand stay straight */
    s.uL=p.stL.slice();s.fL=[0,0,0];s.wL=[0,0,0];s.fist=p.fist;return s;};
  /* each clip also drives the lower jaw (g_jaw.quaternion, opening about x) from its jw channel */
  const CC=(name,dur,fn,o)=>{EL=HR=null;const cont=!(o&&o.loop),c=sampleClip(name,dur,t=>solve(fn(t),cont,Math.min(1,(dur-t)/.25)),Object.assign({autoFeet:false},o),B);
    const T=c.tracks[0].times,JQ=[],q=new Q(),e=new THREE.Euler();for(const t of T){q.setFromEuler(e.set(fn(t).jw[0],0,0));JQ.push(q.x,q.y,q.z,q.w);}
    c.tracks.push(new THREE.QuaternionKeyframeTrack('g_jaw.quaternion',T,JQ));L.push(c);return c;};
  const KC=(name,dur,keys,note,base=GST)=>CC(name,dur,wrKeys(keys.map(k=>[k[0],wrP(base,k[1]||{})])),{note});
  /* limping gait, in place: per leg its heel-strike phase (off), stance share (fs), swing lift and toe pitch; the wounded leg (drag)
     swings out stiffly (circ) with its toes scraping and lands flat; planted feet slide back at one steady speed (S per cycle) */
  const LIMP=(name,dur,G,note)=>{const fn=t=>{const u=t/dur,o=G.body(u);o.HP=[G.sway(u),G.y0+G.dip(u),0];
      for(const sd of['L','R']){const g=G[sd],q=(((u-g.off)%1)+1)%1;let z,l=0,pt,x=g.x;
        if(q<g.fs){const v=q/g.fs;z=G.S*g.fs*(.5-v);pt=v<.15?-g.heel*(1-v/.15):v>.7?g.toe*(v-.7)/.3:0;}
        else{const v=(q-g.fs)/(1-g.fs),sm=v*v*(3-2*v);z=G.S*g.fs*(sm-.5);l=g.lift*S(Math.PI*v);x+=g.circ*S(Math.PI*v);pt=g.drag?g.toe*(1-v)*(1-v)+g.drag*S(Math.PI*Math.min(1,v*1.2)):g.toe*(1-v)*(1-v)-g.heel*v*v;}
        o['F'+sd]=[x,z,g.yaw,l,pt];}return o;};
    const sp=G.S*B.legS/dur,c=CC(name,dur,fn,{loop:true,note:`${note}, in place, ${sp.toFixed(2)} m/s`});c.speed=sp;};
  const LEGS=(fsR,offL,fsL,y)=>({R:{off:0,fs:fsR,lift:.07,toe:20,heel:10,x:-.12,yaw:-8,circ:0,drag:0},L:{off:offL,fs:fsL,lift:.018,toe:6,heel:0,x:.14,yaw:22,circ:.06,drag:14+y}});
  /* hips: over the right leg most of the stride, a dip and a lurch onto the wounded leg after it lands (phase offL) */
  const sway=pcurve([[0,-.006],[.15,-.026],[.35,-.03],[.55,-.016],[.68,.01],[.82,.018],[.95,.006]]),dip=pcurve([[0,-.004],[.15,.004],[.35,.01],[.55,.002],[.65,-.026],[.76,-.034],[.88,-.024],[.96,-.01]]);
  const lurch=u=>{const a=(((u-.6)%1)+1)%1;return a<.4?S(Math.PI*a/.4)*Math.exp(-a*3):0;};
  const ext=(b,a)=>[b[0]+a[0],b[1]+a[1],b[2]+a[2]];

  /* Idle: hunched, weight on the right leg, slow sway; the head jerks now and then, the jaw works */
  {const dur=5,tw=(t,t0,w)=>{const s=(t-t0)/w;return s<0||s>1?0:s<.15?s/.15:Math.pow(1-(s-.15)/.85,2);};
    CC('Idle',dur,t=>{const p=D*t/dur,b=S(p),j1=tw(t,1.1,1.1),j2=tw(t,3.1,.9);return wrP(IST,{HP:[-.015+.008*b,-.07+.004*S(2*p),0],h:[14+1.2*S(2*p),2*b,4+1.5*b],sp:[12+S(2*p+.5),0,0],ch:[18+1.5*S(2*p+1),2*b,-3],
      hd:[-20+10*j2+2*S(3*p),26*j1-8*j2+4*S(p),12-14*j1+6*j2],nk:[18+6*j2,0,0],gR:[-.25-.01*b,.88,.2+.03*S(p+1)],stL:[4+6*S(p+1.4),0,6+2*b],jw:[.14+.1*Math.max(0,S(4*p))*Math.max(0,S(p+2))+.25*j1]});},{loop:true,note:'Hunched on the good leg, swaying; the head jerks now and then, the jaw works'});}
  /* Walk: slow limp; Run: a hurried lurch, leaning in with the claws or weapon reaching */
  LIMP('Walk',1.7,{S:.75,y0:-.075,sway,dip,...LEGS(.72,.58,.52,0),body:u=>{const k=lurch(u),a=C(D*u);return wrP(IST,{h:[15+3*k,-4*a,3+3*C(D*(u-.15))-9*k],sp:[12,1.5*a,0],ch:[18-2*k,4*a,-3],nk:[18+4*k,0,0],hd:[-20-10*k,-3*a,12+4*S(D*u)],
    gR:[-.25,.88+.015*C(2*D*u),.2-.08*a],stL:[4+14*C(D*(u-.58)),0,8+3*k],jw:[.14+.08*k]});}},'Slow limp: the wounded left leg drags with its toes scraping, the body dips onto it');
  LIMP('Run',1.05,{S:.95,y0:-.11,sway:u=>1.3*sway(u),dip:u=>1.4*dip(u),...LEGS(.6,.55,.45,4),body:u=>{const k=lurch(u),a=C(D*u);return wrP(GST,{h:[28+4*k,-5*a,3-10*k],sp:[16,2*a,0],ch:[16-3*k,5*a,-3],nk:[20,0,0],hd:[-32-8*k,-3*a,8],
    gR:[-.3,1.12+.03*C(2*D*u),.6-.05*a],dR:held?[-.1,.3,.95]:[-.1,.2,.98],pR:[-.85,-.2,-.4],stL:[-20+18*C(D*(u-.55)),0,24],jw:[.4+.12*k]});}},'Hurried lurch, leaning in and reaching, still limping');
  CC('Idle (war mode)',2.4,t=>{const p=D*t/2.4,b=S(p);return wrP(GST,{HP:[-.01+.006*b,-.13-.006*S(2*p),0],sp:[16+S(2*p),-2,0],ch:[20+1.4*S(2*p+.6),-4,-3],hd:[-26+3*S(2*p+1),5*S(p),10+3*b],
    gR:[-.32,1.22+.02*S(2*p+.4),.42+.02*b],stL:[-24+6*S(p+1),0,28],jw:[.3+.16*Math.max(0,S(2*p))]});},{loop:true,note:'Hunched, claws or weapon raised, snarling'});
  LIMP('Walk (war mode)',1.5,{S:.7,y0:-.13,sway,dip,...LEGS(.7,.56,.5,2),body:u=>{const k=lurch(u),a=C(D*u);return wrP(GST,{h:[20+3*k,-6-4*a,5-9*k],sp:[16,-2+1.5*a,0],ch:[20-2*k,-4+4*a,-3],hd:[-26-8*k,-2*a,10],
    gR:[-.32,1.22+.02*C(2*D*u),.42-.03*a],stL:[-24+12*C(D*(u-.56)),0,28],jw:[.3+.15*k]});}},'Limping advance, claws or weapon raised');

  /* attacks with the right hand: overhead strike, side swipe, stab, and a lunge with a bite */
  KC('Attack 1',1.4,[[0,{}],
    [.4,{HP:[0,-.11,-.06],h:[6,-16,6],sp:[-2,-4,0],ch:[-8,-10,0],hd:[-12,0,6],gR:[-.28,1.8,-.08],dR:[0,.35,-.94],pR:[-.8,.3,-.2],stL:[-40,0,32],jw:[.5]}],
    [.52,{HP:[0,-.12,.02],h:[10,-10,5],sp:[2,-2,0],ch:[-2,-4,0],hd:[-10,0,6],FR:[-.13,.04,-10,.07,0],gR:[-.22,1.84,.12],dR:[0,.8,-.6],pR:[-.8,.2,-.25],stL:[-34,0,30],jw:[.62]}],
    [.62,{HP:[0,-.15,.1],h:[18,-4,4],sp:[8,0,0],ch:[6,2,0],FR:[-.13,.24,-10,0,0],gR:[-.14,1.62,.42],dR:[0,.75,.66],pR:[-.8,0,-.3],stL:[-26,0,28],jw:[.4]}],
    [.7,{HP:[0,-.21,.15],h:[28,-2,4],sp:[16,2,0],ch:[12,6,0],FR:[-.13,.26,-10,0,0],gR:[-.1,1.12,.62],dR:[0,-.15,1],pR:[-.7,-.4,-.3],stL:[-16,0,25],jw:[.18]}],
    [.8,{HP:[0,-.26,.16],h:[34,0,4],sp:[20,4,0],ch:[14,8,0],FR:[-.13,.26,-10,0,0],gR:[-.07,.8,.5],dR:[0,-.75,.65],pR:[-.7,-.6,-.3],stL:[-10,0,25],jw:[.15]}],
    [1.02,{HP:[0,-.24,.14],h:[30,0,4],sp:[18,4,0],ch:[12,8,0],FR:[-.13,.26,-10,0,0],gR:[-.09,.82,.48],dR:[0,-.62,.78],pR:[-.7,-.6,-.3],stL:[-14,0,25],jw:[.28]}],
    [1.18,{HP:[0,-.17,.06],h:[22,-4,5],FR:[-.13,.06,-10,.06,0],gR:[-.24,1.08,.36],dR:[-.1,.4,.9]}],
    [1.4,{}]],'Overhead strike, steps in on the good leg and hacks straight down');
  KC('Attack 2',1.3,[[0,{}],
    [.38,{HP:[0,-.12,-.04],h:[8,-34,8],sp:[4,-8,0],ch:[0,-22,0],hd:[-6,10,8],gR:[-.6,1.4,-.1],dR:[-.4,.4,-.82],pR:[-.5,-.3,-.8],stL:[-20,0,40],jw:[.45]}],
    [.5,{HP:[0,-.14,.06],h:[12,-12,6],sp:[6,-4,0],ch:[4,0,0],FR:[-.14,.1,-12,.05,0],gR:[-.5,1.32,.3],dR:[-.95,.1,.3],pR:[-.4,-.8,-.4],stL:[-10,0,35],jw:[.5]}],
    [.58,{HP:[0,-.16,.12],h:[16,8,4],sp:[8,4,0],ch:[6,18,0],FR:[-.14,.2,-12,0,0],gR:[-.08,1.25,.6],dR:[-.3,0,.95],pR:[-.4,-.8,-.4],stL:[0,0,30],jw:[.3]}],
    [.66,{HP:[0,-.17,.12],h:[18,18,4],sp:[10,8,0],ch:[8,28,0],FR:[-.14,.2,-12,0,0],gR:[.24,1.15,.42],dR:[.7,-.1,.7],pR:[-.3,-.9,-.3],stL:[10,0,32],jw:[.2]}],
    [.82,{HP:[0,-.17,.1],h:[18,22,4],sp:[10,8,0],ch:[8,32,0],FR:[-.14,.2,-12,0,0],gR:[.3,1.05,.2],dR:[.95,-.2,.1],pR:[-.3,-.9,-.3],stL:[10,0,32],jw:[.25]}],
    [1.04,{HP:[0,-.15,.04],h:[16,0,5],FR:[-.14,.04,-12,.05,0],gR:[-.16,1.15,.35],dR:[-.1,.6,.8],stL:[-12,0,30]}],
    [1.3,{}]],'Side swipe from right to left with a step in');
  KC('Attack 3',1.15,[[0,{}],
    [.3,{HP:[0,-.12,-.06],h:[10,-22,6],sp:[4,-6,0],ch:[2,-12,0],hd:[-10,8,8],gR:[-.36,1.2,-.1],dR:[0,.15,1],pR:[-.6,-.2,-.8],stL:[-20,0,30],jw:[.4]}],
    [.38,{HP:[0,-.14,.04],h:[16,-8,5],sp:[8,-2,0],ch:[4,0,0],hd:[-10,4,8],FR:[-.13,.08,-10,.06,0],gR:[-.28,1.2,.2],dR:[0,.1,1],pR:[-.6,-.4,-.6],stL:[-12,0,28],jw:[.5]}],
    [.46,{HP:[0,-.18,.14],h:[22,4,4],sp:[12,2,0],ch:[8,8,0],hd:[-12,0,6],FR:[-.13,.24,-10,0,0],gR:[-.1,1.18,.74],dR:[.05,-.05,1],pR:[-.6,-.6,-.4],stL:[0,0,25],jw:[.65]}],
    [.64,{HP:[0,-.18,.14],h:[22,4,4],sp:[12,2,0],ch:[8,8,0],hd:[-10,0,6],FR:[-.13,.24,-10,0,0],gR:[-.11,1.16,.72],dR:[.05,-.08,1],pR:[-.6,-.6,-.4],stL:[0,0,25],jw:[.5]}],
    [.88,{HP:[0,-.15,.06],h:[18,-4,5],FR:[-.13,.06,-10,.05,0],gR:[-.28,1.18,.32],dR:[-.05,.5,.86]}],
    [1.15,{}]],'Lunging stab straight ahead');
  {const BITE={HP:[0,-.18,.22],h:[26,4,2],sp:[12,2,0],ch:[8,4,0],FR:[-.13,.32,-8,0,0],pR:[-.8,.2,-.4],stL:[-50,0,30]};
  KC('Lunge & bite',2.1,[[0,{}],
    [.35,{HP:[0,-.2,-.06],h:[22,-10,4],sp:[12,-2,0],ch:[8,-4,0],hd:[-30,0,4],gR:[-.55,1.35,.25],dR:[-.5,.6,.6],pR:[-.8,0,-.4],stL:[-40,0,40],jw:[.7]}],
    [.47,{HP:[0,-.18,.08],h:[24,-4,3],sp:[12,0,0],ch:[8,0,0],hd:[-30,0,2],FR:[-.13,.1,-8,.07,0],gR:[-.55,1.32,.5],dR:[-.2,.4,.9],pR:[-.8,.1,-.4],stL:[-50,0,36],jw:[.8]}],
    [.56,wrP(BITE,{nk:[12,0,0],hd:[-28,0,0],gR:[-.48,1.25,.76],dR:[.4,.2,.9],jw:[.9]})],
    [.7,wrP(BITE,{nk:[18,0,0],hd:[-12,0,0],gR:[-.08,1.22,.62],dR:[.9,0,.3],pR:[-.7,-.2,-.6],jw:[.06]})],
    [.86,wrP(BITE,{nk:[14,0,0],hd:[-26,-8,6],gR:[-.06,1.2,.6],dR:[.9,0,.3],pR:[-.7,-.2,-.6],jw:[.7]})],
    [1.0,wrP(BITE,{nk:[18,0,0],hd:[-10,6,-4],gR:[-.06,1.2,.6],dR:[.9,0,.3],pR:[-.7,-.2,-.6],jw:[.05]})],
    [1.14,wrP(BITE,{nk:[16,0,0],hd:[-16,-16,8],gR:[-.06,1.2,.6],dR:[.9,0,.3],pR:[-.7,-.2,-.6],jw:[.12]})],
    [1.3,wrP(BITE,{nk:[16,0,0],hd:[-16,16,-8],gR:[-.08,1.2,.6],dR:[.9,0,.3],pR:[-.7,-.2,-.6],jw:[.1]})],
    [1.55,{HP:[0,-.18,.12],h:[24,-4,4],sp:[12,0,0],ch:[10,0,0],FR:[-.13,.32,-8,0,0],gR:[-.3,1.15,.4],dR:[-.1,.4,.9],jw:[.35]}],
    [1.72,{HP:[0,-.15,.04],h:[20,-6,5],FR:[-.13,.1,-10,.07,0],jw:[.3]}],
    [2.1,{}]],'Lurches forward, hooks the arm round the prey, bites twice and tears with a shake of the head');}

  /* voice and reactions */
  KC('Shriek',2.3,[[0,{}],
    [.35,{HP:[0,-.15,0],h:[22,0,4],sp:[12,0,0],ch:[10,0,0],hd:[6,0,0],gR:[-.32,1.0,.22],dR:held?[0,.2,1]:[0,-.2,1],stL:[-6,0,20],jw:[.2]}],
    [.72,{HP:[0,-.08,-.02],h:[4,0,2],sp:[-6,0,0],ch:[-14,0,0],nk:[-10,0,0],hd:[-28,0,0],gR:[-.62,1.45,.12],dR:[-.5,.8,0],pR:[-.9,-.2,-.2],stL:[-20,0,70],jw:[1.05]}],
    [1.0,{HP:[0,-.08,-.02],h:[4,2,2],sp:[-6,0,0],ch:[-15,0,0],nk:[-10,0,0],hd:[-30,8,4],gR:[-.63,1.46,.11],dR:[-.5,.8,0],pR:[-.9,-.2,-.2],stL:[-18,0,72],jw:[1.1]}],
    [1.3,{HP:[0,-.08,-.02],h:[4,-2,2],sp:[-6,0,0],ch:[-14,0,0],nk:[-10,0,0],hd:[-29,-8,-4],gR:[-.62,1.45,.13],dR:[-.5,.8,0],pR:[-.9,-.2,-.2],stL:[-22,0,70],jw:[1.05]}],
    [1.6,{HP:[0,-.08,-.02],h:[4,1,2],sp:[-6,0,0],ch:[-14,0,0],nk:[-10,0,0],hd:[-28,6,2],gR:[-.62,1.45,.12],dR:[-.5,.8,0],pR:[-.9,-.2,-.2],stL:[-20,0,70],jw:[1.0]}],
    [2.0,{HP:[0,-.12,0],h:[14,-4,4],hd:[-10,0,8],jw:[.4]}],
    [2.3,{}]],'Head thrown back, jaw wide, arm and stump flung out, shaking');
  KC('Hit 1',.85,[[0,{}],
    [.1,{HP:[0,-.12,-.08],h:[4,-6,6],sp:[-8,0,0],ch:[-14,0,0],nk:[-10,0,0],hd:[-26,10,12],gR:[-.44,1.36,.06],dR:[-.4,.7,.2],stL:[-34,0,42],jw:[.75]}],
    [.32,{HP:[0,-.13,-.05],h:[12,-6,5],sp:[4,0,0],ch:[2,0,0],hd:[-6,0,4],gR:[-.36,1.26,.2],stL:[-28,0,32],jw:[.45]}],
    [.85,{}]],'Head snaps back, jaw flies open');
  KC('Hit 2',1.15,[[0,{}],
    [.1,{HP:[.06,-.14,0],h:[10,24,-10],sp:[4,8,-8],ch:[0,14,-10],hd:[-10,20,-16],gR:[-.5,1.15,.02],dR:[-.6,.6,.2],stL:[-10,0,50],jw:[.6]}],
    [.32,{HP:[.08,-.22,-.02],h:[16,14,-8],sp:[8,6,-4],ch:[6,8,-6],hd:[0,10,-6],FL:[.17,.06,24,0,0],gR:[-.44,1.0,.16],stL:[0,0,36],jw:[.3]}],
    [.55,{HP:[.03,-.17,0],h:[16,4,0],sp:[10,0,0],ch:[10,0,0],FL:[.17,.06,24,0,0],FR:[-.17,-.08,-10,.06,0],gR:[-.36,1.1,.2],stL:[-10,0,30],jw:[.35]}],
    [.78,{HP:[0,-.14,0],FR:[-.14,-.12,-10,0,0],jw:[.3]}],
    [1.15,{}]],'Struck from the right: twists away and buckles on the wounded leg, then steps back in');
  KC('Heavy hit',2.5,[[0,{}],
    [.12,{HP:[0,-.12,-.1],h:[-6,-10,4],sp:[-10,0,0],ch:[-14,0,0],hd:[-22,0,8],gR:[-.5,1.4,-.04],dR:[-.6,.7,0],stL:[-30,0,50],jw:[.75]}],
    [.32,{HP:[0,-.2,-.14],h:[8,-10,-4],sp:[0,0,0],ch:[-4,0,0],hd:[-6,0,4],FL:[.15,-.08,24,.04,8],gR:[-.5,1.1,.1],dR:[-.4,.7,.4],stL:[-20,0,40],jw:[.5]}],
    [.55,{HP:[0,-.42,-.12],h:[24,-6,-2],sp:[14,0,0],ch:[8,0,0],hd:[4,0,8],FL:[.15,-.44,24,0,70],gR:[-.42,.52,.36],dR:[-.1,.3,.95],pR:[-.85,-.4,0],stL:[-30,0,22],jw:[.3]}],
    [.65,{HP:[0,-.43,-.12],h:[26,-6,-2],sp:[15,0,0],ch:[9,0,0],hd:[10,0,10],FL:[.15,-.44,24,0,70],gR:[-.42,.5,.38],dR:[-.1,.3,.95],pR:[-.85,-.4,0],stL:[-30,0,22],jw:[.2]}],
    [1.25,{HP:[0,-.42,-.12],h:[24,-6,-2],sp:[14,0,0],ch:[8,0,0],hd:[-4,10,14],FL:[.15,-.44,24,0,70],gR:[-.42,.52,.36],dR:[-.1,.3,.95],pR:[-.85,-.4,0],stL:[-30,0,22],jw:[.45]}],
    [1.6,{HP:[0,-.32,-.08],h:[32,-6,0],sp:[16,0,0],ch:[10,0,0],hd:[-10,0,8],FL:[.15,-.4,24,0,42],gR:[-.36,.62,.36],dR:[-.1,.4,.9],pR:[-.85,-.4,0],stL:[-28,0,26],jw:[.3]}],
    [1.9,{HP:[0,-.17,-.02],h:[22,-6,3],FL:[.15,-.14,24,.03,12],stL:[-24,0,28]}],
    [2.15,{HP:[0,-.14,0],FL:[.15,.07,24,0,0]}],
    [2.5,{}]],'Knocked down onto the wounded knee, braces with the hand, drags itself back up');
  return GH_CLIPS[key]=L;}

ASSETS.push({id:'ghoul',folder:'characters/enemies/undead',name:'Ghoul',kind:'character',variants:true,defaultSeed:1,groundR:1.6,build:(s,o)=>buildGhoul(s,o||{}),
  opts:[{key:'skin',label:'Skin',choices:[['random','Random'],...Object.entries(GH_SKIN).map(([k,v])=>[k,v[1].charAt(0).toUpperCase()+v[1].slice(1)])],def:'random'},
    {key:'clothes',label:'Clothes',choices:[['random','Random'],['rags','Ragged shirt and trousers'],['shroud','Burial shroud'],['bare','Torn trousers only']],def:'random'},
    {key:'weapon',label:'Weapon',choices:[['random','Random'],['none','None (claws)'],['knife','Knife'],['cleaver','Small cleaver'],['club','Small club']],def:'random'},
    {key:'eyes',label:'Eyes',choices:[['random','Random'],['milky','Milky'],['yellow','Yellow glow'],['red','Red glow']],def:'random'}],
  desc:'Risen corpse, human-sized (about 1.8 m), hunched and gaunt: sunken eyes, rotted nose, a hanging jaw with a torn cheek, ribs showing through a hole in the chest. The left arm is torn off at the elbow with the bone sticking out; the left leg is gashed to the bone and drags in a slow limp. Attacks with the right hand: bare claws, a knife, a small cleaver or a small club. Skin ashen grey, grey-green, bluish, bruised or leathery brown; ragged shirt and trousers, a burial shroud or torn trousers; milky or glowing eyes. Clips: Idle, Walk (limp), Run (hurried lurch), war-mode Idle and Walk, three attacks, Lunge & bite, Shriek, two hits, Heavy hit (down on the wounded knee and up), Death (falls apart into a heap of body pieces) and Rise (the pieces come back together).'});
