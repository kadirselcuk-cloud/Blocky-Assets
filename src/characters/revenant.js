/* ======================= REVENANT: a big undead warrior in heavy plate, a one-handed weapon in each hand =======================
   Built from its own meshes on the villager's 25 joints (so the warrior's leg and arm IK, wrSolve, fits unchanged), on a bulky body
   type (VB.revenant: the warrior's legs, broader shoulders and hips, thick arms, big gauntlets) inside a group scaled by RV_SC, so it
   stands about 2.2 m with its helmet. Full plate over mail, dark and decayed: blackened, rusted or pale old steel with tarnished trim.
   The helmet is closed (great helm, horned or crowned) with the eyes glowing through the slit, or open, showing a withered face.
   Each hand holds its own weapon (short sword, axe or mace; any mix). Weapons sit in the sockets the way the skeleton's do: grip
   through the fist, blade or head along the thumb side, edge towards the fingers. Clips are wight-style IK: hand targets in the
   torso's frame (or from the shoulders), keyed weapon directions met by a clamped, rate-limited wrist (the hand never turns over),
   elbow poles chosen by a cost search that includes how well the weapon can be pointed. */
VB.revenant=Object.assign({},VB.male,{thigh:.44,shin:.42,spine:.12,chest:.24,shW:.3,ua:.29,fa:.27,g:1.3,hipW:.09,hand:1.15,sex:'male'});
{const b=VB.revenant;b.key='revenant';b.hipH=b.thigh+b.shin+b.ankle+b.hipOff;b.legS=(b.thigh+b.shin)/.84;b.tS=(b.spine+b.chest)/.3;b.cS=b.neck/.22;}
const RV_SC=1.12;
const RV_ARM={black:[['#46494e','#2f3135','#715847'],'blackened plate'],rust:[['#614c48','#443330','#7c5c44'],'rusted plate'],steel:[['#7f8387','#5a5e62','#704f42'],'pale old steel']};
const RV_EYES={ice:['#eaf7ff','#6fb3dd','icy blue'],green:['#e6fbea','#66d396','pale green'],red:['#ffe3dc','#c9524d','red'],violet:['#f3e7ff','#9568c6','violet']};
const RV_HELM={great:'closed great helm',horned:'horned great helm',crowned:'crowned great helm',open:'open helm over a withered face'};
const RV_WPN={sword:'short sword',axe:'axe',mace:'mace'};

/* one-handed weapons: grip at the origin, along +y, edge (or the axe's blade) towards +x, flat sides towards ±z. Sizes in body units */
function rvWeapon(kind){const w=new THREE.Group(),ir=vm('iron'),dk=bm('#3b3d42','plain'),hi=bm('#898d91','plain'),rust=bm('#653e38','plain'),wrap=bm('#2f211f','leather'),wood=bm('#4b342d','leather');
  if(kind==='sword'){bx(w,.044,.15,.044,wrap,0,.025,0);bx(w,.054,.025,.054,dk,0,-.06,0);bx(w,.2,.035,.06,dk,0,.1,0);bx(w,.05,.05,.07,dk,0,.1,0);
    for(const[y0,y1,wd]of[[.12,.44,.08],[.44,.58,.068],[.58,.66,.048],[.66,.7,.026]])bx(w,wd,y1-y0,.022,ir,0,(y0+y1)/2,0);
    bx(w,.016,.44,.026,dk,0,.36,0);bx(w,.026,.05,.026,rust,.024,.3,0);bx(w,.022,.04,.026,rust,-.02,.5,0);w.userData.len=.7;}
  else if(kind==='axe'){bx(w,.046,.6,.046,wood,0,.23,0);bx(w,.052,.14,.052,wrap,0,.02,0);bx(w,.056,.025,.056,dk,0,-.06,0);
    /* bearded head: socket round the haft, cheek, a blade that drops below the cheek, back spike */
    bx(w,.07,.13,.06,dk,0,.47,0);bx(w,.09,.1,.032,ir,.08,.48,0);bx(w,.07,.2,.026,ir,.15,.45,0);bx(w,.04,.08,.026,ir,.14,.33,0);bx(w,.02,.28,.03,hi,.19,.42,0);
    bx(w,.07,.035,.03,dk,-.07,.48,0);bx(w,.035,.025,.026,dk,-.115,.48,0);bx(w,.05,.05,.028,rust,.12,.5,0);w.userData.len=.56;}
  else{bx(w,.046,.5,.046,wood,0,.19,0);bx(w,.052,.14,.052,wrap,0,.02,0);bx(w,.056,.025,.056,dk,0,-.06,0);bx(w,.06,.06,.06,dk,0,.42,0);
    /* flanged head: a core with six flanges round it and a cap */
    bx(w,.09,.16,.09,ir,0,.53,0);for(let i=0;i<3;i++){const a=i*Math.PI/3;bx(w,.18,.13,.022,dk,0,.53,0,0,a,0);}bx(w,.07,.04,.07,ir,0,.63,0);bx(w,.035,.03,.035,dk,0,.665,0);
    bx(w,.03,.04,.03,rust,.05,.5,.03);w.userData.len=.68;}
  return w;}

function buildRevenant(seed,o={}){const B=VB.revenant,r=mulberry32(((seed*2654435761)>>>0)^0x6e7a),pick=a=>a[Math.floor(r()*a.length)],root=new THREE.Group();root.userData.lights=[];
  /* roll everything, then let the options override */
  const arm0=pick(['black','black','rust','steel']),eye0=pick(['ice','ice','green','red','violet']),helm0=pick(['great','great','horned','crowned','open']),wR0=pick(['sword','axe','mace']),wL0=pick(['sword','axe','mace']);
  const opt=(k,d)=>o[k]&&o[k]!=='random'?o[k]:d,armK=opt('armor',arm0),eyeK=opt('eyes',eye0),helmK=opt('helm',helm0),wR=opt('weaponR',wR0),wL=opt('weaponL',wL0);
  const shade=(h,f)=>'#'+new THREE.Color(h).multiplyScalar(f).getHexString(),AC=RV_ARM[armK][0];
  const P=bm(AC[0],'plain'),Pd=bm(AC[1],'plain'),T=bm(AC[2],'plain'),mail=bm(shade(AC[1],1.2),'plain'),rust=bm('#653e38','plain'),leath=bm('#2f1f1d','leather'),dark=bm('#161312','plain');
  const ey=RV_EYES[eyeK],eyeM=wrGlow(ey[0],ey[1],1.8,pxTex('plain')),skin=bm('#71736e','skin'),skinD=bm('#51544e','skin'),teeth=bm('#9f977f','plain'),horn=bm('#cdc4ad','plain'),hornD=bm('#7f7466','plain');
  const hips=J('hips',root,0,B.hipH,0),spine=J('spine',hips,0,B.spine,0),chest=J('chest',spine,0,B.chest,0),neck=J('neck',chest,0,B.neck,0),head=J('head',neck,0,B.headY,0);
  /* hips: plated skirt over groin and seat (two lames), plate fauld and a broad belt with a buckle plate */
  bx(hips,.37,.17,.26,Pd,0,-.025,0);for(const y of[-.05,-.095])bx(hips,.375,.014,.265,P,0,y,0);bx(hips,.38,.07,.27,P,0,.055,0);bx(hips,.39,.04,.28,leath,0,.1,0);bx(hips,.07,.05,.012,T,0,.1,.146);
  /* belly: two overlapping lames */
  bx(spine,.4,.26,.28,Pd,0,.04,0);bx(spine,.41,.07,.29,P,0,.0,0);bx(spine,.42,.07,.295,P,0,.09,0);
  /* chest: breast and back plate with a raised middle ridge, a lower lame, a collar; dents and rust */
  bx(chest,.46,.27,.31,P,0,.12,0);bx(chest,.45,.1,.3,Pd,0,-.03,0);bx(chest,.035,.22,.02,Pd,0,.11,.162);bx(chest,.28,.06,.25,Pd,0,.245,0);
  for(const s of[-1,1])bx(chest,.1,.03,.02,T,s*.13,.22,.158);
  bx(chest,.06,.05,.01,rust,.12,.05,.158);bx(chest,.05,.04,.01,rust,-.15,.15,.158);bx(chest,.07,.05,.01,rust,-.06,.1,-.158);bx(chest,.04,.06,.01,Pd,.07,.16,.158);
  /* gorget */
  bx(neck,.21,.17,.21,Pd,0,.025,0);bx(neck,.23,.03,.23,P,0,-.04,0);
  /* head: helmet (and the face under an open one); eyes in their own group (g_eyes, origin between the eyes), so Death and Rise scale them in place */
  const eyes=new THREE.Group();eyes.name='g_eyes';head.add(eyes);
  if(helmK!=='open'){bx(head,.3,.31,.32,P,0,.165,0);bx(head,.28,.03,.3,Pd,0,.33,0);bx(head,.32,.04,.34,Pd,0,.02,0);bx(head,.31,.025,.33,T,0,.235,0);
    /* a plain eye slit (dark), the eyes glowing deep in it; breathing holes in two short rows below, on the right */
    bx(head,.24,.032,.012,dark,0,.19,.161);eyes.position.set(0,.19,.163);for(const s of[-1,1])bx(eyes,.034,.018,.008,eyeM,s*.055,0,0);
    for(const y of[.1,.13])for(const x of[-.11,-.085,-.06])bx(head,.012,.012,.012,dark,x,y,.161);
    bx(head,.05,.06,.01,rust,.09,.08,.161);bx(head,.04,.04,.01,rust,-.07,.28,-.161);
    if(helmK==='horned')for(const s of[-1,1]){bx(head,.08,.06,.06,hornD,s*.18,.24,0);bx(head,.07,.05,.05,horn,s*.235,.27,0,0,0,s*.5);bx(head,.05,.09,.045,horn,s*.27,.33,0,0,0,s*.25);bx(head,.035,.07,.035,horn,s*.28,.4,0,0,0,-s*.05);}
    /* undead crown: a crude, tarnished band sitting askew, uneven segments with a dent and rust, jagged spikes of different heights
       leaning every way, one snapped off, an empty gem socket */
    if(helmK==='crowned'){const cg=new THREE.Group();put(head,cg,.005,.325,0,.05,.12,-.07);const Tk=bm(shade(AC[2],.6),'plain');
      for(const[x,z,w,d,h,y,m]of[[-.08,.172,.17,.03,.055,0,T],[.085,.172,.15,.03,.04,-.006,Tk],[-.07,-.172,.2,.03,.045,-.004,Tk],[.1,-.172,.13,.03,.06,.004,T],
        [-.168,.06,.03,.2,.05,.002,T],[-.168,-.1,.03,.15,.035,-.008,rust],[.168,.04,.03,.24,.06,0,Tk],[.168,-.13,.03,.1,.045,-.005,T]])bx(cg,w,h,d,m,x,y,z);
      bx(cg,.045,.04,.012,dark,-.02,.005,.19);bx(cg,.06,.02,.012,T,-.02,.03,.19);
      for(const[x,z,h,lean,tw,m]of[[-.13,.18,.09,.35,.1,T],[-.045,.18,.05,-.2,0,Tk],[.05,.18,.13,.15,-.15,T],[.135,.18,.025,0,0,Tk],
        [-.12,-.18,.07,-.3,.2,Tk],[.0,-.18,.11,.25,0,T],[.12,-.18,.06,-.1,-.1,rust],[-.175,-.04,.08,.2,.2,T],[-.175,.1,.045,-.3,0,Tk],[.175,0,.12,-.25,.1,T],[.175,-.12,.04,.3,0,Tk]]){
        const g=new THREE.Group(),out=Math.abs(z)>.17?[Math.sign(z)*.25,0]:[0,-Math.sign(x)*.25];put(cg,g,x,.025,z,out[0]+(Math.abs(z)>.17?0:lean*.6),tw,out[1]+(Math.abs(z)>.17?lean:0));
        bx(g,.035,h,.026,m,0,h/2,0);if(h>.05)bx(g,.018,.03,.018,m,0,h+.012,0);}}}
  else{/* withered face: grey skin drawn over the skull, sunken glowing eyes, no nose, lips gone over the teeth */
    bx(head,.24,.25,.26,skin,0,.14,0);bx(head,.25,.035,.03,skinD,0,.2,.12);
    for(const s of[-1,1]){bx(head,.06,.045,.012,dark,s*.052,.165,.131);bx(eyes,.024,.02,.008,eyeM,s*.052,0,0);bx(head,.014,.07,.08,skinD,s*.118,.1,.06);}
    eyes.position.set(0,.164,.138);bx(head,.035,.04,.012,dark,0,.12,.131);bx(head,.12,.05,.012,dark,0,.06,.131);bx(head,.1,.018,.012,teeth,0,.072,.135);bx(head,.09,.016,.012,teeth,0,.048,.135);
    /* open helm: skull cap, brow band, neck guard, cheek plates */
    bx(head,.3,.12,.32,P,0,.29,0);bx(head,.31,.035,.33,T,0,.235,0);bx(head,.3,.24,.04,P,0,.13,-.15);bx(head,.32,.04,.06,Pd,0,.02,-.15);
    for(const s of[-1,1])bx(head,.035,.22,.16,P,s*.145,.13,.05);bx(head,.04,.03,.01,rust,-.08,.3,.161);}
  /* arms: layered pauldrons, mail sleeve, rerebrace, elbow cop, vambrace, plated gauntlet; the fist closes round the grip */
  for(const[sd,s]of[['L',1],['R',-1]]){const sh=J('shoulder_'+sd,chest,s*B.shW*.325,.165*B.cS,0),ua=J('upperArm_'+sd,sh,s*B.shW*.675,0,0),fa=J('foreArm_'+sd,ua,0,-B.ua,0),hd=J('hand_'+sd,fa,0,-B.fa,0),hk=B.hand;
    bx(ua,.23,.09,.25,P,s*.03,.06,0);bx(ua,.21,.06,.23,Pd,s*.03,.0,0);bx(ua,.19,.05,.21,P,s*.025,-.05,0);bx(ua,.24,.02,.26,T,s*.03,.1,0);bx(ua,.05,.04,.01,rust,s*.05,.05,.126);
    bx(ua,.13,.28,.14,mail,0,-.13,0);bx(ua,.14,.14,.15,P,0,-.18,0);
    bx(fa,.14,.09,.15,Pd,0,0,-.01);bx(fa,.1,.07,.04,P,0,.005,-.085);bx(fa,.13,.2,.13,P,0,-.15,0);bx(fa,.15,.05,.15,Pd,0,-.245,0);
    const fg=J('fingers_'+sd,hd,0,-.085*hk,0),ft=J('fingerTips_'+sd,fg,0,-.035*hk,0),th=J('thumb_'+sd,hd,-s*.02*hk,-.04*hk,.06),so=J('socket_'+sd,hd,-s*.012*hk,-.075*hk,0);so.userData.socket=true;
    bx(hd,.09,.11,.13,P,0,-.05,0);bx(hd,.095,.03,.135,Pd,0,-.02,0);bx(fg,.075,.05,.125,Pd,0,-.02,0);bx(ft,.065,.04,.115,P,0,-.015,0);bx(th,.04,.06,.04,Pd,0,-.022,.005);
    const w=new THREE.Group();w.name='rv_wpn_'+sd;w.userData.gear=true;so.add(w);const wp=rvWeapon(sd==='R'?wR:wL);
    wp.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(new THREE.Vector3(0,-1,0),new THREE.Vector3(0,0,1),new THREE.Vector3(-1,0,0)));w.add(wp);}
  /* legs: tassets and a cuisse on the thigh, knee cop, greave, sabaton whose sole matches the IK foot (heel to toe; 5 mm above its sole, so fast heel strikes sampled between frames never dip in) */
  for(const[sd,s]of[['L',1],['R',-1]]){const th=J('thigh_'+sd,hips,s*B.hipW,-(B.hipOff+.01),0),sn=J('shin_'+sd,th,0,-B.thigh,0),ft=J('foot_'+sd,sn,0,-B.shin,0);
    bx(th,.165,.14,.17,Pd,0,-.05,0);bx(th,.17,.36,.18,P,0,-.26,0);bx(th,.175,.03,.185,Pd,0,-.12,0);
    bx(th,.19,.15,.03,P,s*.005,-.06,.1,-.12,0,0);bx(th,.19,.03,.032,T,s*.005,.01,.108,-.12,0,0);bx(th,.03,.15,.17,P,s*.1,-.06,0,0,0,s*.1);
    bx(sn,.15,.08,.16,P,0,-.02,0);bx(sn,.12,.1,.05,Pd,0,-.01,.085);bx(sn,.15,.38,.16,P,0,-.21,0);bx(sn,.155,.03,.165,Pd,0,-.39,0);bx(sn,.04,.08,.01,rust,s*.03,-.28,.081);
    bx(ft,.14,.06,.15,Pd,0,-.01,-.01);bx(ft,.15,.065,.27,P,0,-.0325,.039);bx(ft,.13,.03,.07,Pd,0,-.02,.13);}
  /* the fists stay closed round their grips */
  const D2=Math.PI/180,Jn=n=>root.getObjectByName(n);
  root.userData.post=()=>{for(const[sd,s]of[['R',1],['L',-1]]){Jn('fingers_'+sd).rotation.set(0,0,s*95*D2);Jn('fingerTips_'+sd).rotation.set(0,0,s*90*D2);Jn('thumb_'+sd).rotation.set(14*D2,0,s*33*D2);}};
  const joints=[];root.traverse(q=>{if(q.userData.joint&&!q.userData.socket)joints.push(q);});root.userData.joints=joints;
  root.userData.weapons={R:wR,L:wL};
  if(o.bare)return root;
  const out=new THREE.Group();out.userData.lights=root.userData.lights;root.scale.setScalar(RV_SC);out.add(root);out.userData.post=root.userData.post;out.userData.joints=joints;
  if(!o.noClips){const cl=revenantClips(wR,wL,helmK);for(const c of cl)if(c.speed&&!c.rvScaled){c.speed*=RV_SC;c.note=c.note.replace(/([\d.]+) m\/s/,(m,v)=>(v*RV_SC).toFixed(1)+' m/s');c.rvScaled=true;}out.userData.clips=cl;}
  out.userData.ground=2.6;
  out.userData.variantText=`${RV_ARM[armK][1].charAt(0).toUpperCase()+RV_ARM[armK][1].slice(1)} over mail, ${RV_HELM[helmK]}, ${ey[2]} glowing eyes; ${RV_WPN[wR]} in the right hand, ${RV_WPN[wL]} in the left.`;
  return out;}

/* ---------- clips ---------- */
const RV_CLIPS={};
/* stances. Relaxed (RV_N): upright and heavy, feet apart, both weapons held low at the sides. War (RV_W): left foot forward, knees
   bent, the right weapon raised by the shoulder, the left held out in front. Hand targets: x,z in the torso's frame (metres, relative
   to the hips), y absolute (ground = 0), or {s:[dx,dy,dz]}: an offset from that shoulder (see S.abs); dR/dL: where each weapon points (also in the torso's frame) */
const RV_N={HP:[0,-.03,0],h:[2,0,0],sp:[2,0,0],ch:[0,0,0],nk:[0,0,0],hd:[0,0,0],FL:[.15,.03,8,0,0],FR:[-.15,-.03,-8,0,0],
  gR:[-.36,.86,.08],dR:[0,-.6,.8],gL:[.36,.86,.08],dL:[0,-.6,.8],fist:[95,95]};
const RV_W=wrP(RV_N,{HP:[0,-.1,0],h:[4,-18,0],sp:[5,-4,0],ch:[3,-6,0],FL:[.16,.2,-12,0,0],FR:[-.16,-.22,-44,0,0],
  gR:{s:[-.14,-.02,.42]},dR:[-.1,.8,-.5],gL:{s:[-.04,-.26,.44]},dL:[.05,.6,.8]});
const RV_WX=[-70,72],RV_WY=85,RV_WR=20;
let RV_RIG=null;
function rvRig(){if(RV_RIG)return RV_RIG;const B=VB.revenant,m=buildRevenant(1,{bare:true,weaponR:'sword',weaponL:'sword'}),J={};m.traverse(q=>{if(q.userData.joint)J[q.name]=q;});return RV_RIG={m,J,B,two:false};}
/* solver: wight-style. Hand targets turn with the torso's yaw; poles from a cost search round the shoulder-hand line (how near the
   wrist can point the weapon from that elbow, upper-arm roll, elbow into the body, up, far out or forward, distance from last frame's
   elbow); then the wrists are solved for the keyed weapon directions */
function rvSolver(R=rvRig()){const B=R.B,V=THREE.Vector3,Q=THREE.Quaternion,M4=new THREE.Matrix4();
  const yawF=p=>{const y=(p.h[1]+p.sp[1]+p.ch[1])*Math.PI/180,c=Math.cos(y),sn=Math.sin(y),rt=v=>[v[0]*c+v[2]*sn,v[1],-v[0]*sn+v[2]*c],o=Object.assign({},p);for(const k of['gR','gL','dR','dL'])o[k]=rt(p[k]);return o;};
  const restQ={L:new Q().setFromEuler(new THREE.Euler(0,0,BASEPOSE.upperArm_L[2]*Math.PI/180)),R:new Q().setFromEuler(new THREE.Euler(0,0,BASEPOSE.upperArm_R[2]*Math.PI/180))};
  const D2R=Math.PI/180,cl=(v,a,b)=>Math.max(a,Math.min(b,v)),fit=(l,x,y)=>Math.sin(y*D2R)*l.x-Math.sin(x*D2R)*Math.cos(y*D2R)*l.y+Math.cos(x*D2R)*Math.cos(y*D2R)*l.z;
  const MIN=.4,S={PP:null,bw:2.5};
  const poles=p=>{R.m.updateMatrixWorld(true);const k=B.legS,o=Object.assign({},p),hp=(p.HP||[0,0,0]).map(v=>v*k),cq=R.J.chest.getWorldQuaternion(new Q()),up=new V(0,1,0),fw=new V(0,0,1).applyQuaternion(cq),nx={};
    for(const[sd,s]of[['L',1],['R',-1]]){const G=p['g'+sd],Sh=R.J['upperArm_'+sd].getWorldPosition(new V()),shW=R.J['shoulder_'+sd].getWorldQuaternion(new Q()),shq=shW.clone().invert(),sq=shW.clone().multiply(restQ[sd]);
      const T=new V(G[0]*k+hp[0],G[1]*k,G[2]*k+hp[2]).sub(Sh);if(T.length()<MIN){T.setLength(MIN);o['g'+sd]=[(Sh.x+T.x-hp[0])/k,(Sh.y+T.y)/k,(Sh.z+T.z-hp[2])/k];}const d=Math.min(T.length(),(B.ua+B.fa)*.999),u=T.normalize(),bone=new V(0,-1,0).applyQuaternion(sq);
      const al=Math.acos(Math.min(1,Math.max(-1,(B.ua*B.ua+d*d-B.fa*B.fa)/(2*B.ua*d)))),inw=new V(-s,0,0).applyQuaternion(cq);
      const hq=new Q().setFromEuler(new THREE.Euler(-(Math.PI-Math.acos(Math.min(1,Math.max(-1,(B.ua*B.ua+B.fa*B.fa-d*d)/(2*B.ua*B.fa))))),0,0)),dW=new V(...p['d'+sd]).normalize();
      const el0=new V(0,0,-1).applyQuaternion(sq).applyQuaternion(new Q().setFromUnitVectors(bone,u)),b1=el0.clone().addScaledVector(u,-el0.dot(u)).normalize(),b2=new V().crossVectors(u,b1);
      let prev=S.PP&&S.PP[sd]?S.PP[sd].clone().addScaledVector(u,-S.PP[sd].dot(u)):null;if(prev&&prev.lengthSq()<.04)prev=null;if(prev)prev.normalize();let best=null,bc=1e9;
      for(const lim of[.866,-2])if(!best)
      for(let i=0;i<96;i++){const f=i/96*2*Math.PI,pp=b1.clone().multiplyScalar(Math.cos(f)).addScaledVector(b2,Math.sin(f)),e=u.clone().multiplyScalar(Math.cos(al)).addScaledVector(pp,Math.sin(al));
        const Y=e.clone().negate(),Z=pp.clone().addScaledVector(e,-pp.dot(e)).normalize().negate(),lq=shq.clone().multiply(new Q().setFromRotationMatrix(M4.makeBasis(new V().crossVectors(Y,Z),Y,Z)));let r=Math.abs(2*Math.atan2(lq.y,lq.w));if(r>Math.PI)r=2*Math.PI-r;
        if(prev&&pp.dot(prev)<lim||pp.dot(inw)>.35)continue;
        /* how near a clamped wrist can point the weapon from this elbow */
        const l=dW.clone().applyQuaternion(new Q().setFromRotationMatrix(M4.makeBasis(new V().crossVectors(Y,Z),Y,Z)).multiply(hq).invert()),wy=cl(Math.asin(cl(l.x,-1,1))/D2R,-RV_WY,RV_WY),wx=cl(Math.atan2(-l.y,l.z)/D2R,RV_WX[0],RV_WX[1]),ms=Math.acos(cl(fit(l,wx,wy),-1,1));
        const c=S.bw*ms*ms+(r/1.4)**2+3*Math.max(0,pp.dot(inw)+.1)**2+3*Math.max(0,pp.dot(up)+.15)**2+1.5*Math.max(0,-pp.dot(inw)-.55)**2+2*Math.max(0,pp.dot(fw)-.2)**2+(prev?.5*(1-pp.dot(prev)):0);
        if(c<bc){bc=c;best=pp;}}
      if(!best)best=prev||el0;nx[sd]=best;o['p'+sd]=best.toArray();}
    S.PP=nx;return o;};
  /* wrists: the weapon points along the socket's z, so for a wanted direction d (dR/dL) the wrist angles follow in closed form from d
     in the forearm's frame: x = deviation (tips the weapon towards the forearm's line or back), y = twist about the forearm. Both are
     clamped (RV_WX, RV_WY), so the hand never turns over; where the wanted direction is out of reach the weapon simply points as near
     as the wrist allows. While S.miss is set it collects the largest miss per hand (each clip keeps it as clip.rvMiss, for tuning keys) */
  const wrist=(sd,d)=>{const fq=R.J['foreArm_'+sd].getWorldQuaternion(new Q()),l=new V(...d).normalize().applyQuaternion(fq.invert());
    /* the closed form, kept only while it is in reach and close to last frame's wrist; otherwise a bounded search from last frame */
    let y=Math.asin(cl(l.x,-1,1))/D2R,x=Math.atan2(-l.y,l.z)/D2R;const pw=S.PW&&S.PW[sd];
    if(x<RV_WX[0]||x>RV_WX[1]||Math.abs(y)>RV_WY||(pw&&Math.hypot(x-pw[0],y-pw[1])>20)){if(pw){x=pw[0];y=pw[1];}else{x=cl(x,RV_WX[0],RV_WX[1]);y=cl(y,-RV_WY,RV_WY);}
      for(const st of[16,8,4,2,1,.5])for(let it=0;it<6;it++){let best=fit(l,x,y),bx2=x,by2=y;for(const[dx,dy]of[[st,0],[-st,0],[0,st],[0,-st]]){const nx=cl(x+dx,RV_WX[0],RV_WX[1]),ny=cl(y+dy,-RV_WY,RV_WY),f=fit(l,nx,ny);if(f>best+1e-9){best=f;bx2=nx;by2=ny;}}
        if(bx2===x&&by2===y)break;x=bx2;y=by2;}}
    /* rate limit: the wrist turns at most RV_WR degrees per frame, so it can lag but never flip */
    if(pw){x=cl(x,pw[0]-RV_WR,pw[0]+RV_WR);y=cl(y,pw[1]-RV_WR,pw[1]+RV_WR);}
    if(S.miss){const e=Math.acos(cl(fit(l,x,y),-1,1))/D2R;if(e>(S.miss[sd]||0))S.miss[sd]=e;}
    S.PW=S.PW||{};S.PW[sd]=[x,y];return[x,y,0];};
  S.solve=p0=>{let p=yawF(p0);wrSolve(R,p);p=poles(p);const s=wrSolve(R,p);R.m.updateMatrixWorld(true);s.wR=wrist('R',p.dR);s.wL=wrist('L',p.dL);s.fist=p.fist;return s;};
  /* shoulder-relative hand targets: a key may give gR/gL as {s:[dx,dy,dz]}, an offset from that shoulder in the torso's (yaw) frame,
     turned into the usual target from the key's own body pose (so a lean that carries the shoulders forward is allowed for) */
  S.abs=k=>{const o=Object.assign({},k);if(!(k.gR&&k.gR.s)&&!(k.gL&&k.gL.s))return o;const q=Object.assign({},k);for(const sd of['R','L'])if(k['g'+sd].s)q['g'+sd]=[0,1,.3];
    wrSolve(R,yawF(q));R.m.updateMatrixWorld(true);const kk=B.legS,hp=(k.HP||[0,0,0]).map(v=>v*kk),y=-(k.h[1]+k.sp[1]+k.ch[1])*D2R,c=Math.cos(y),sn=Math.sin(y);
    for(const sd of['R','L'])if(k['g'+sd].s){const P=R.J['upperArm_'+sd].getWorldPosition(new V()),x=(P.x-hp[0])/kk,z=(P.z-hp[2])/kk,d=k['g'+sd].s;
      o['g'+sd]=[x*c+z*sn+d[0],P.y/kk+d[1],-x*sn+z*c+d[2]];}return o;};
  S.R=R;return S;}
/* every clip but Death and Rise is the same for any look; those two drop and catch the weapons and lay the helmet on the ground, so
   they are made per weapon pair and helmet */
function revenantClips(wR,wL,helm){const k=wR+'|'+wL+'|'+helm;if(RV_CLIPS[k])return RV_CLIPS[k];const L=rvBaseClips().slice();rvFalls(L,wR,wL,helm);return RV_CLIPS[k]=L;}
let RV_BASE=null;
function rvBaseClips(){if(RV_BASE)return RV_BASE;const B=VB.revenant,D=Math.PI*2,S=Math.sin,C=Math.cos,L=[],SV=rvSolver(),W=SV.abs(RV_W);
  /* loops are pre-rolled one full cycle, so the elbow and wrist continuity carry over the seam, and the last frame is the first */
  const CC=(name,dur,fn,o={})=>{SV.PP=SV.PW=null;if(o.loop){const n=Math.round(dur*30);for(let i=0;i<n;i++)SV.solve(fn(i/n*dur));}SV.miss={};let first=null;
    const c=sampleClip(name,dur,t=>{if(o.loop&&first&&t>=dur-1e-6)return first;const r=SV.solve(fn(t));if(!first)first=r;return r;},Object.assign({autoFeet:false},o),B);c.rvMiss=SV.miss;SV.miss=null;if(o.next)c.next=o.next;L.push(c);return c;};
  const KC=(name,dur,keys,note,base=W,next='Idle (war mode)')=>{const K=keys.map(k=>[k[0],SV.abs(wrP(base,k[1]||{}))]),c=CC(name,dur,wrKeys(K),{note,next});return c;};
  const lift=(o,dy)=>{o.gR=[o.gR[0],o.gR[1]+dy,o.gR[2]];o.gL=[o.gL[0],o.gL[1]+dy,o.gL[2]];return o;};
  /* IK gait in place: planted feet slide back at one steady speed, swinging feet come forward lifted; the hands ride with the hips */
  const GAIT=(name,dur,G,note)=>{const fn=t=>{const u=t/dur,o=G.body(u),c2=C(D*(u-G.duty/2));o.HP=[G.sw*c2,G.y0-G.b*C(2*D*(u-G.duty/2)),G.z0||0];lift(o,o.HP[1]-G.y0);
      for(const[sd,off,x,yaw]of[['L',0,G.x,G.yaw[0]],['R',.5,-G.x,G.yaw[1]]]){const q=(((u+off)%1)+1)%1;let z,l,pt;
        if(q<G.duty){const v=q/G.duty;z=G.s*(1-2*v);l=0;pt=v<.15?-10*(1-v/.15):v>.7?G.toe*(v-.7)/.3:0;}
        else{const v=(q-G.duty)/(1-G.duty),sm=v*v*(3-2*v);z=-G.s+2*G.s*sm;l=G.lift*Math.sin(Math.PI*Math.pow(v,G.lp||1));pt=G.toe*(1-v)*(1-v)-12*v*v;}
        o['F'+sd]=[x,z+(sd==='L'?1:-1)*(G.st||0),yaw,l,pt];}return o;};
    const sp=2*G.s/(G.duty*dur),c=CC(name,dur,fn,{loop:true,note:`${note}, in place, ${sp.toFixed(1)} m/s`});c.speed=sp;};
  /* arm swing in the gaits: a = +1 when the left foot is forward (the left hand swings back) */
  const swing=(o,a,amp)=>{o.gL=[o.gL[0],o.gL[1]+.03*Math.abs(a),o.gL[2]-amp*a];o.gR=[o.gR[0],o.gR[1]+.03*Math.abs(a),o.gR[2]+amp*a];return o;};

  /* ---- relaxed ---- */
  CC('Idle',4,t=>{const p=D*t/4,b=S(p),b2=S(2*p);return wrP(RV_N,{HP:[.006*b,-.03-.005*b2,0],h:[2,0,1.2*b],sp:[2+.6*b2,0,-.5*b],ch:[.8*b2,2*S(p+.8),0],hd:[-1+1.5*S(2*p+1),10*S(p+.6),0],
    gR:[-.36,.86+.008*b2,.08],gL:[.36,.86+.008*b2,.08],dR:[0,-.6,.8+.05*b],dL:[0,-.6,.8-.05*b]});},{loop:true,note:'Heavy breathing, weapons held low'});
  GAIT('Walk',1.3,{duty:.62,s:.26,lift:.08,toe:18,x:.15,yaw:[6,-6],y0:-.05,b:.014,sw:.02,
    body:u=>{const yw=C(D*u),a=C(D*(u-.06));return swing(wrP(RV_N,{h:[3,-5*yw,2*S(D*u)],sp:[3,2*yw,0],ch:[0,4*yw,0],hd:[0,-3*yw,0],gR:[-.37,.88,.1],gL:[.37,.88,.1]}),a,.1);}},'Heavy, deliberate steps, weapons low');
  GAIT('Run',.8,{duty:.42,s:.42,lift:.18,lp:.8,toe:28,x:.14,yaw:[4,-4],y0:-.09,b:.03,sw:.02,
    body:u=>{const yw=C(D*u),a=C(D*(u-.04));return swing(wrP(RV_N,{h:[12,-7*yw,3*S(D*u)],sp:[6,3*yw,0],ch:[2,6*yw,0],hd:[-10,0,0],gR:[-.38,.98,.24],dR:[0,.3,.95],gL:[.38,.98,.24],dL:[0,.3,.95]}),a,.2);}},'Lumbering run, weapons forward');

  /* ---- war mode ---- */
  CC('Idle (war mode)',2.6,t=>{const p=D*t/2.6,b=S(p),c=S(p+.6);return lift(wrP(W,{HP:[0,-.1-.008*b,0],sp:[5+.8*b,-4,0],ch:[3+1.2*b,-6,0],hd:[0,4*S(p),0],
    dR:[-.1,.8,-.5+.06*c],dL:[.05,.6,.8+.06*c]}),-.012*c);},{loop:true,note:'Right weapon raised by the shoulder, left held out in guard'});
  GAIT('Walk (war mode)',1.2,{duty:.62,s:.24,lift:.08,toe:20,x:.15,yaw:[-8,-30],y0:-.12,b:.012,sw:.015,st:.04,
    body:u=>lift(wrP(W,{h:[5,-14-4*C(D*u),2*S(D*u)],sp:[6,-4,0],ch:[3,-6,0]}),.012*C(2*D*u))},'Guard up, steady advance');
  GAIT('Run (war mode)',.76,{duty:.4,s:.4,lift:.2,lp:.75,toe:30,x:.13,yaw:[-4,-14],y0:-.1,b:.026,sw:.014,
    body:u=>lift(wrP(W,{h:[12,-10-5*C(D*u),3*S(D*u)],sp:[9,-3,0],ch:[4,-5,0],hd:[-8,0,0]}),.015*C(2*D*(u-.1)))},'Charging, both weapons ready');

  /* ---- attacks (hand targets from the shoulders) ---- */
  KC('Attack 1',1.2,[[0,{}],
    [.35,{HP:[0,-.12,-.04],h:[4,-36,0],sp:[4,-8,0],ch:[0,-22,0],gR:{s:[-.3,.3,.1]},dR:[0,.8,-.6],gL:{s:[-.02,-.28,.4]}}],
    [.5,{HP:[0,-.14,.06],h:[6,-16,0],sp:[5,-4,0],ch:[2,-6,0],FL:[.16,.34,-12,.05,0],gR:{s:[-.32,.22,.38]},dR:[0,.9,-.4],gL:{s:[0,-.28,.36]}}],
    [.6,{HP:[0,-.16,.12],h:[6,4,0],sp:[6,4,0],ch:[6,16,0],FL:[.16,.42,-10,0,0],FR:[-.16,-.22,-30,0,0],gR:{s:[.15,-.05,.56]},dR:[0,.5,.87],gL:{s:[.08,-.3,.25]}}],
    [.74,{HP:[0,-.17,.12],h:[8,14,0],sp:[8,8,0],ch:[8,24,0],FL:[.16,.42,-10,0,0],FR:[-.16,-.22,-24,0,0],gR:{s:[.5,-.25,.3]},dR:[.6,0,.8],gL:{s:[.15,-.32,.1]}}],
    [.95,{HP:[0,-.13,.04],h:[6,-8,0],ch:[4,-4,0],FL:[.16,.3,-12,.05,0],FR:[-.16,-.22,-36,0,0],gR:{s:[-.05,-.1,.45]},dR:[-.1,.85,.3]}],
    [1.2,{}]],'Right weapon: diagonal slash from the right shoulder, with a step in');
  KC('Attack 2',1.2,[[0,{}],
    [.35,{HP:[0,-.12,-.04],h:[4,6,0],sp:[4,4,0],ch:[0,10,0],gL:{s:[.3,.3,.1]},dL:[0,.8,-.6],gR:{s:[-.1,-.05,.36]}}],
    [.5,{HP:[0,-.14,.06],h:[6,-6,0],sp:[5,0,0],ch:[2,2,0],FL:[.16,.34,-12,.05,0],gL:{s:[.32,.22,.38]},dL:[0,.9,-.4],gR:{s:[-.12,-.06,.34]}}],
    [.6,{HP:[0,-.16,.12],h:[6,-26,0],sp:[6,-6,0],ch:[6,-16,0],FL:[.16,.42,-10,0,0],gL:{s:[-.15,-.05,.56]},dL:[0,.5,.87],gR:{s:[-.2,-.08,.24]}}],
    [.74,{HP:[0,-.17,.12],h:[8,-36,0],sp:[8,-8,0],ch:[8,-24,0],FL:[.16,.42,-10,0,0],gL:{s:[-.5,-.25,.3]},dL:[-.6,0,.8],gR:{s:[-.28,-.1,.12]}}],
    [.95,{HP:[0,-.13,.04],h:[6,-22,0],ch:[4,-8,0],FL:[.16,.3,-12,.05,0],gL:{s:[.04,-.18,.45]},dL:[.1,.7,.6]}],
    [1.2,{}]],'Left weapon: diagonal slash from the left shoulder, with a step in');
  KC('Attack 3',1.3,[[0,{}],
    [.42,{HP:[0,-.08,-.06],h:[-4,-10,0],sp:[-8,-2,0],ch:[-10,-4,0],hd:[-8,0,0],gR:{s:[0,.42,.2]},dR:[.1,.5,-.85],gL:{s:[0,.42,.2]},dL:[-.1,.5,-.85]}],
    [.56,{HP:[0,-.12,.06],h:[2,-8,0],sp:[0,-2,0],ch:[0,-2,0],FL:[.16,.36,-12,.05,0],gR:{s:[.02,.4,.38]},dR:[0,.95,.3],gL:{s:[-.02,.4,.38]},dL:[0,.95,.3]}],
    [.64,{HP:[0,-.2,.14],h:[10,-6,0],sp:[12,0,0],ch:[8,0,0],FL:[.16,.44,-10,0,0],gR:{s:[.06,.1,.56]},dR:[0,.5,.87],gL:{s:[-.06,.1,.56]},dL:[0,.5,.87]}],
    [.74,{HP:[0,-.26,.16],h:[14,-6,0],sp:[16,0,0],ch:[10,0,0],FL:[.16,.44,-10,0,0],gR:{s:[.08,-.32,.48]},dR:[0,-.15,1],gL:{s:[-.08,-.32,.48]},dL:[0,-.15,1]}],
    [.95,{HP:[0,-.25,.15],h:[13,-6,0],sp:[15,0,0],ch:[10,0,0],FL:[.16,.44,-10,0,0],gR:{s:[.08,-.31,.48]},dR:[0,-.12,1],gL:{s:[-.08,-.31,.48]},dL:[0,-.12,1]}],
    [1.1,{HP:[0,-.14,.05],h:[6,-14,0],FL:[.16,.3,-12,.05,0],gR:{s:[-.1,-.1,.4]},dR:[-.1,.8,.3]}],
    [1.3,{}]],'Both weapons raised overhead and brought straight down together');
  KC('Attack 4',1.35,[[0,{}],
    [.4,{HP:[0,-.13,-.05],h:[2,-14,0],sp:[0,-4,0],ch:[-4,-4,0],hd:[-4,0,0],gR:{s:[-.42,.05,-.02]},dR:[0,1,0],gL:{s:[.42,.05,-.02]},dL:[0,1,0]}],
    [.55,{HP:[0,-.15,.06],h:[4,-14,0],sp:[4,-4,0],ch:[2,-4,0],FL:[.16,.36,-12,.05,0],gR:{s:[-.4,0,.3]},dR:[0,.8,.6],gL:{s:[.38,-.14,.3]},dL:[0,.8,.6]}],
    [.66,{HP:[0,-.17,.12],h:[6,-14,0],sp:[6,-4,0],ch:[4,-4,0],FL:[.16,.42,-10,0,0],gR:{s:[0,0,.58]},dR:[.55,.3,.8],gL:{s:[-.04,-.24,.56]},dL:[-.55,.2,.8]}],
    [.78,{HP:[0,-.17,.12],h:[6,-14,0],sp:[6,-4,0],ch:[4,-4,0],FL:[.16,.42,-10,0,0],gR:{s:[.32,0,.5]},dR:[.9,.1,.4],gL:{s:[-.36,-.26,.46]},dL:[-.9,0,.4]}],
    [1.05,{HP:[0,-.13,.04],FL:[.16,.3,-12,.05,0],gR:{s:[-.1,-.1,.4]},dR:[-.2,.8,.2],gL:{s:[-.04,-.24,.42]}}],
    [1.35,{}]],'Both weapons swung wide, then swept in together across the front, one above the other');
  KC('Heavy attack',1.9,[[0,{}],
    [.35,{HP:[0,-.34,-.04],h:[22,-10,0],sp:[16,-2,0],ch:[8,-4,0],hd:[-10,0,0],gR:{s:[-.1,-.2,.42]},dR:[0,.75,.65],gL:{s:[.1,-.2,.42]},dL:[0,.75,.65]}],
    [.55,{HP:[0,.08,.1],h:[-6,-10,0],sp:[-8,-2,0],ch:[-10,-4,0],hd:[-6,0,0],FL:[.16,.24,-12,.1,20],FR:[-.16,-.18,-44,.06,25],gR:{s:[-.03,.34,.28]},dR:[.1,.5,-.85],gL:{s:[.03,.34,.28]},dL:[-.1,.5,-.85]}],
    [.72,{HP:[0,.16,.2],h:[0,-8,0],sp:[0,-2,0],ch:[-4,-2,0],FL:[.16,.42,-12,.2,10],FR:[-.16,-.08,-44,.16,15],gR:{s:[0,.34,.4]},dR:[0,.95,.3],gL:{s:[0,.34,.4]},dL:[0,.95,.3]}],
    [.86,{HP:[0,-.24,.3],h:[16,-6,0],sp:[18,0,0],ch:[10,0,0],FL:[.16,.62,-10,0,0],FR:[-.16,-.02,-44,0,0],gR:{s:[.04,.05,.58]},dR:[0,.4,.92],gL:{s:[-.04,.05,.58]},dL:[0,.4,.92]}],
    [.96,{HP:[0,-.44,.32],h:[26,-6,0],sp:[22,0,0],ch:[12,0,0],FL:[.16,.62,-10,0,0],FR:[-.16,-.02,-44,0,0],gR:{s:[.06,-.4,.44]},dR:[0,-.55,.85],gL:{s:[-.06,-.4,.44]},dL:[0,-.55,.85]}],
    [1.3,{HP:[0,-.44,.32],h:[26,-6,0],sp:[22,0,0],ch:[12,0,0],FL:[.16,.62,-10,0,0],FR:[-.16,-.02,-44,0,0],gR:{s:[.06,-.39,.44]},dR:[0,-.53,.85],gL:{s:[-.06,-.39,.44]},dL:[0,-.53,.85]}],
    [1.55,{HP:[0,-.2,.24],h:[10,-12,0],FL:[.16,.62,-10,0,0],FR:[-.16,-.02,-44,.05,0],gR:{s:[-.1,-.1,.42]},dR:[-.1,.8,.4],gL:{s:[-.02,-.22,.46]}}],
    [1.72,{HP:[0,-.12,.1],FR:[-.16,-.16,-44,.04,0]}],
    [1.9,{}]],'Crouches, leaps forward and smashes both weapons into the ground');
  KC('Block',1.4,[[0,{}],
    [.15,{HP:[0,-.18,-.04],h:[4,-14,0],sp:[6,-2,0],ch:[2,-4,0],hd:[10,0,0],gR:{s:[.1,.06,.42]},dR:[.15,.95,.15],gL:{s:[-.1,.06,.42]},dL:[-.15,.95,.15]}],
    [.5,{HP:[0,-.2,-.1],h:[2,-14,0],sp:[4,-2,0],ch:[0,-4,0],hd:[14,0,0],gR:{s:[.1,.04,.36]},dR:[.15,.95,.1],gL:{s:[-.1,.04,.36]},dL:[-.15,.95,.1]}],
    [.75,{HP:[0,-.19,-.05],h:[4,-14,0],sp:[6,-2,0],ch:[2,-4,0],hd:[11,0,0],gR:{s:[.1,.05,.4]},dR:[.15,.95,.15],gL:{s:[-.1,.05,.4]},dL:[-.15,.95,.15]}],
    [1.05,{HP:[0,-.18,-.04],h:[4,-14,0],sp:[6,-2,0],ch:[2,-4,0],hd:[10,0,0],gR:{s:[.1,.06,.42]},dR:[.15,.95,.15],gL:{s:[-.1,.06,.42]},dL:[-.15,.95,.15]}],
    [1.4,{}]],'Both weapons up in front of the face, takes the blow and pushes back');

  /* ---- voice and gestures ---- */
  KC('Roar',2.6,[[0,{}],
    [.4,{HP:[0,-.18,-.02],h:[14,-14,0],sp:[16,-2,0],ch:[10,-4,0],hd:[6,0,0],gR:{s:[-.1,-.4,.3]},dR:[0,.3,.95],gL:{s:[.1,-.4,.3]},dL:[0,.3,.95]}],
    [.8,{HP:[0,-.08,0],h:[-4,-8,0],sp:[-8,0,0],ch:[-14,-2,0],nk:[-6,0,0],hd:[-22,0,0],gR:{s:[-.42,.26,.12]},dR:[0,1,0],gL:{s:[.42,.26,.12]},dL:[0,1,0]}],
    [1.3,{HP:[0,-.09,0],h:[-4,-8,2],sp:[-9,0,1],ch:[-15,-2,0],nk:[-6,0,0],hd:[-24,4,0],gR:{s:[-.43,.27,.1]},dR:[0,1,0],gL:{s:[.43,.27,.1]},dL:[0,1,0]}],
    [1.8,{HP:[0,-.08,0],h:[-4,-8,-2],sp:[-8,0,-1],ch:[-14,-2,0],nk:[-6,0,0],hd:[-22,-4,0],gR:{s:[-.42,.26,.12]},dR:[0,1,0],gL:{s:[.42,.26,.12]},dL:[0,1,0]}],
    [2.6,{}]],'Arms and weapons flung wide, head thrown back');
  {const clash={HP:[0,-.11,0],h:[2,-8,0],sp:[2,-2,0],ch:[0,-2,0],hd:[-4,0,0]},apart={gR:{s:[-.1,-.1,.45]},dR:[-.5,.8,.3],gL:{s:[.1,-.1,.45]},dL:[.5,.8,.3]},hit={gR:{s:[.2,-.1,.45]},dR:[.12,.95,.2],gL:{s:[-.2,-.1,.45]},dL:[-.12,.95,.2]};
  KC('Taunt',2.6,[[0,{}],
    [.35,wrP(clash,apart)],[.5,wrP(clash,hit)],[.75,wrP(clash,apart)],[.9,wrP(clash,hit)],
    [1.35,{HP:[0,-.08,0],h:[0,-8,0],sp:[-3,-2,0],ch:[-6,-2,0],hd:[-12,0,6],gR:{s:[-.38,-.15,.25]},dR:[-.7,.4,.5],gL:{s:[.38,-.15,.25]},dL:[.7,.4,.5]}],
    [2.0,{HP:[0,-.08,0],h:[0,-8,0],sp:[-3,-2,0],ch:[-6,-2,0],hd:[-12,0,-6],gR:{s:[-.38,-.15,.25]},dR:[-.7,.4,.5],gL:{s:[.38,-.15,.25]},dL:[.7,.4,.5]}],
    [2.6,{}]],'Clashes the weapons together twice, then spreads the arms, chin up');}

  /* ---- reactions ---- */
  KC('Hit 1',.75,[[0,{}],
    [.1,{HP:[0,-.1,-.07],h:[-6,-22,0],sp:[-12,-4,0],ch:[-16,-6,0],hd:[-14,0,0],gR:{s:[-.25,.08,.3]},dR:[-.4,.8,-.3],gL:{s:[0,-.15,.38]},dL:[.3,.7,.5]}],
    [.3,{HP:[0,-.11,-.04],h:[0,-20,0],sp:[-2,-4,0],ch:[-4,-6,0],hd:[-4,0,0],gR:{s:[-.2,0,.38]},gL:{s:[-.02,-.22,.42]}}],
    [.75,{}]],'Blow to the chest, rocks back');
  KC('Hit 2',.85,[[0,{}],
    [.12,{HP:[.05,-.12,-.02],h:[2,-36,8],sp:[2,-10,10],ch:[-4,-20,12],hd:[-6,-18,14],gR:{s:[-.25,-.05,.3]},dR:[-.5,.75,-.3],gL:{s:[.08,-.3,.4]},dL:[.5,.4,.75]}],
    [.34,{HP:[.02,-.11,0],h:[3,-28,3],sp:[4,-6,4],ch:[0,-12,5],hd:[-2,-6,5],gR:{s:[-.18,-.03,.38]},gL:{s:[0,-.27,.42]}}],
    [.85,{}]],'Blow from the left, twists and bends away');
  KC('Heavy hit',1.6,[[0,{}],
    [.1,{HP:[0,-.08,-.1],h:[-14,-24,0],sp:[-16,-4,0],ch:[-18,-6,0],hd:[-20,0,4],gR:{s:[-.3,.12,.2]},dR:[0,1,0],gL:{s:[.15,0,.3]},dL:[0,.8,.6]}],
    [.28,{HP:[0,-.12,-.25],h:[-8,-22,0],sp:[-8,-4,0],ch:[-10,-6,0],hd:[-8,0,0],FR:[-.17,-.48,-46,.09,0],gR:{s:[-.26,.06,.3]},gL:{s:[.08,-.1,.36]}}],
    [.45,{HP:[0,-.2,-.38],h:[8,-22,0],sp:[10,-4,0],ch:[4,-6,0],hd:[4,0,0],FR:[-.18,-.62,-46,0,0],gR:{s:[-.18,-.02,.4]},gL:{s:[-.02,-.22,.44]}}],
    [.6,{HP:[0,-.16,-.4],FL:[.14,-.04,-15,.07,0],FR:[-.18,-.62,-46,0,0]}],
    [.75,{HP:[0,-.12,-.42],FL:[.15,-.2,-12,0,0],FR:[-.18,-.62,-46,0,0]}],
    [1.0,{HP:[0,-.1,-.25],FL:[.15,0,-12,.06,0],FR:[-.18,-.62,-46,0,0]}],
    [1.12,{HP:[0,-.1,-.18],FL:[.16,.2,-12,0,0],FR:[-.18,-.62,-46,0,0]}],
    [1.3,{HP:[0,-.1,-.08],FR:[-.17,-.42,-45,.06,0]}],
    [1.45,{}],[1.6,{}]],'Knocked back two steps, then steps in again');
  return RV_BASE=L;}

/* Death and Rise: keys are joint angles (degrees) as wrSolve outputs them (gbDeathKeys), plus X (hip offset x,z in metres), anc (how
   firmly each foot stays where it stood), flat (the foot stays level) and ey (eye glow size). Each frame a bare revenant is posed and
   dropped onto its lowest point (weapons left out). Death: recoils, sinks onto its knees, the weapons slip from its hands and fall
   flat beside it, the eyes go out and it pitches forward face down. Rise: the eyes light again, it pushes up onto hands and knees,
   kneels, the weapons fly up off the ground back into its fists, and it stands into the war stance. The weapons get their own tracks
   (rv_wpn_R/L, relative to the sockets), the eyes a scale track (g_eyes). */
function rvFalls(L,wR,wL,helm){const B=VB.revenant,k=B.legS,D2R=Math.PI/180,V=THREE.Vector3,Q=THREE.Quaternion,M4=THREE.Matrix4,SV=rvSolver();
  SV.PP=SV.PW=null;const S0=SV.solve(SV.abs(RV_W)),K0={X:[S0.pos[0]*k,S0.pos[2]*k],anc:[1,1],flat:[0,0],ey:[1]};
  const CH=['h','sp','ch','nk','hd','tL','kL','aL','tR','kR','aR','uL','fL','wL','uR','fR','wR','fist'];for(const c of CH)K0[c]=S0[c].slice();
  const M=buildRevenant(1,{bare:true,weaponR:wR,weaponL:wL,helm}),JN={};M.traverse(q=>{if(q.userData.joint)JN[q.name]=q;});
  const WG={R:M.getObjectByName('rv_wpn_R'),L:M.getObjectByName('rv_wpn_L')},isW=q=>{while(q){if(q.userData.gear)return true;q=q.parent;}return false;};
  const body=[];M.traverse(q=>{if(q.isMesh&&!isW(q))body.push(q);});
  const corner=new V(),cornersW=list=>{const out=[];for(const q of list){const p=q.geometry.parameters;for(let i=0;i<8;i++)out.push(new V((i&1?.5:-.5)*p.width,(i&2?.5:-.5)*p.height,(i&4?.5:-.5)*p.depth).applyMatrix4(q.matrixWorld));}return out;};
  const lowest=()=>{let y=1e9;for(const q of body){const p=q.geometry.parameters;for(let i=0;i<8;i++){corner.set((i&1?.5:-.5)*p.width,(i&2?.5:-.5)*p.height,(i&4?.5:-.5)*p.depth).applyMatrix4(q.matrixWorld);if(corner.y<y)y=corner.y;}}return y;};
  const pose=p=>{const P={};for(const c in p)if(JALIAS[c])P[JALIAS[c]]=p[c];const f=p.fist;P.fingers_L=[0,0,-f[0]];P.fingerTips_L=[0,0,-f[0]*.95];P.thumb_L=[f[0]*.15,0,-f[0]*.35];P.fingers_R=[0,0,f[1]];P.fingerTips_R=[0,0,f[1]*.95];P.thumb_R=[f[1]*.15,0,f[1]*.35];
    for(const j of RIG_JOINTS){const b=BASEPOSE[j]||[0,0,0],v=P[j]||[0,0,0];JN[j].rotation.set((b[0]+v[0])*D2R,(b[1]+v[1])*D2R,(b[2]+v[2])*D2R);}};
  const feet=()=>({L:JN.foot_L.getWorldPosition(new V()),R:JN.foot_R.getWorldPosition(new V())});
  /* f: keyed pose; wpn(t, i, held world matrices) -> world matrix of each loose weapon or null while held */
  const FC=(name,dur,f,note,wpn,o={})=>{let ref=null,full=[0,0];
    if(o.refEnd){const p=f(dur);pose(p);JN.hips.position.set(p.X[0],B.hipH,p.X[1]);M.updateMatrixWorld(true);ref=feet();}
    const fn=t=>{const p=f(t);
      for(const[i,sd]of[[0,'L'],[1,'R']]){const w=p.flat[i];if(w>0){const a=p['a'+sd].slice();a[0]=a[0]*(1-w)-(p.h[0]+p['t'+sd][0]+p['k'+sd][0])*w;p['a'+sd]=a;}}
      pose(p);JN.hips.position.set(p.X[0],B.hipH,p.X[1]);M.updateMatrixWorld(true);const ft=feet();if(!ref)ref={L:ft.L.clone(),R:ft.R.clone()};
      const wsum=p.anc[0]+p.anc[1];let cx=0,cz=0;if(wsum>1e-3){for(const[i,sd]of[[0,'L'],[1,'R']]){cx+=p.anc[i]*(ref[sd].x-ft[sd].x);cz+=p.anc[i]*(ref[sd].z-ft[sd].z);}cx/=wsum;cz/=wsum;}
      const w=Math.min(1,Math.max(p.anc[0],p.anc[1]));if(w>.999&&!o.refEnd)full=[cx,cz];const X=[p.X[0]+w*cx+(1-w)*full[0],p.X[1]+w*cz+(1-w)*full[1]];
      JN.hips.position.set(X[0],B.hipH,X[1]);M.updateMatrixWorld(true);const y=.005-lowest();JN.hips.position.y=B.hipH+y;M.updateMatrixWorld(true);
      const out={};for(const c in p)if(JALIAS[c]||c==='fist')out[c]=p[c];out.pos=[X[0]/k,y/k,X[1]/k];out.ey=p.ey;out.X=X;return out;};
    const c=sampleClip(name,dur,fn,{autoFeet:false,note},B),T=Array.from(c.tracks[0].times);
    /* second pass (same order, so the foot anchoring repeats exactly): eye scale and the weapons in their sockets' frames */
    const ES=[],WP={R:[],L:[]},WQ={R:[],L:[]},inv=new M4(),pp=new V(),qq=new Q(),ss=new V();
    T.forEach((t,i)=>{const p=fn(t),e=Math.max(.001,p.ey[0]);ES.push(e,e,e);
      for(const sd of['R','L']){const so=WG[sd].parent,W=wpn(t,sd);if(!W){WP[sd].push(0,0,0);WQ[sd].push(0,0,0,1);continue;}
        inv.copy(so.matrixWorld).invert().multiply(W).decompose(pp,qq,ss);WP[sd].push(pp.x,pp.y,pp.z);WQ[sd].push(qq.x,qq.y,qq.z,qq.w);}});
    c.tracks.push(new THREE.VectorKeyframeTrack('g_eyes.scale',T,ES));
    for(const sd of['R','L'])c.tracks.push(new THREE.VectorKeyframeTrack('rv_wpn_'+sd+'.position',T,WP[sd]),new THREE.QuaternionKeyframeTrack('rv_wpn_'+sd+'.quaternion',T,WQ[sd]));
    if(o.next)c.next=o.next;L.push(c);return{c,fn};};
  /* a held weapon's world matrix (pose already applied) */
  const heldM=sd=>WG[sd].parent.matrixWorld.clone();
  /* resting place of a dropped weapon: flat side down (its thin z axis vertical), lying the way it pointed, pushed a little out from the
     body, lowest corner on the ground */
  const restOf=(sd,Mw)=>{const p0=new V(),q0=new Q(),s0=new V();Mw.decompose(p0,q0,s0);
    /* in the weapon group's frame the blade runs along z and the flat sides face ±x: z lies along the ground, x turns vertical */
    const Lh=new V(0,0,1).applyQuaternion(q0).setY(0);if(Lh.lengthSq()<1e-4)Lh.set(0,0,1);Lh.normalize();const U=new V(0,new V(1,0,0).applyQuaternion(q0).y>=0?1:-1,0);
    const q=new Q().setFromRotationMatrix(new M4().makeBasis(U,new V().crossVectors(Lh,U),Lh));
    const hip=JN.hips.getWorldPosition(new V()),out=new V(p0.x-hip.x,0,p0.z-hip.z);if(out.lengthSq()<1e-4)out.set(sd==='L'?1:-1,0,0);out.normalize();
    const probe=WG[sd].clone(),list=[];probe.position.set(p0.x,0,p0.z).addScaledVector(out,.22);probe.quaternion.copy(q);probe.updateMatrixWorld(true);probe.traverse(z=>{if(z.isMesh)list.push(z);});
    let lo=1e9;for(const c of cornersW(list))lo=Math.min(lo,c.y);probe.position.y+=.002-lo;probe.updateMatrix();return probe.matrix.clone();};
  /* a loose weapon's world matrix lifted so no corner goes below the ground */
  const PR={R:WG.R.clone(),L:WG.L.clone()},PL={R:[],L:[]};for(const sd of['R','L'])PR[sd].traverse(z=>{if(z.isMesh)PL[sd].push(z);});
  const above=(sd,m)=>{const pr=PR[sd];m.decompose(pr.position,pr.quaternion,pr.scale);pr.updateMatrixWorld(true);let lo=1e9;for(const c of cornersW(PL[sd]))lo=Math.min(lo,c.y);if(lo<.002)m.elements[13]+=.002-lo;return m;};
  const lerpM=(A,Bm,s,arc=0)=>{const pa=new V(),qa=new Q(),pb=new V(),qb=new Q(),sc=new V();A.decompose(pa,qa,sc);Bm.decompose(pb,qb,sc);const p=pa.lerp(pb,s);p.y+=arc*Math.sin(Math.PI*s);return new M4().compose(p,qa.slerp(qb,s),new V(1,1,1));};
  const ss=s=>s*s*(3-2*s);

  /* ---- Death ---- */
  /* the head comes to rest turned on its side; a horned or crowned helmet stays face down, so horns and spikes lie flat */
  const hy=helm==='horned'||helm==='crowned'?0:70,tRel={R:1.0,L:1.08},death=gbDeathKeys(K0,[
    [.16,{sp:[-8,0,0],ch:[-14,0,0],nk:[-6,0,0],hd:[-18,0,6]},'out'],
    [.5,{h:[10,-10,0],sp:[8,0,0],ch:[10,0,0],nk:[6,0,0],hd:[4,0,8],tL:[-30,0,4],kL:[60,0,0],tR:[-26,0,-6],kR:[56,0,0],uL:[-30,0,14],fL:[-40,0,0],uR:[-30,0,-14],fR:[-40,0,0]}],
    [.85,{h:[12,-4,0],sp:[14,0,0],ch:[16,0,0],nk:[8,0,0],hd:[10,0,8],tL:[-16,0,4],kL:[104,0,0],tR:[-12,0,-4],kR:[102,0,0],flat:[0,0],aL:[44,0,0],aR:[44,0,0],anc:[0,0],X:[0,.08],
      uL:[-14,0,18],fL:[-30,0,0],uR:[-14,0,-18],fR:[-30,0,0]},'io'],
    [.95,{h:[16,-4,0]},'out'],
    [1.2,{uL:[-6,0,24],fL:[-12,0,0],wL:[40,80,0],uR:[-6,0,-24],fR:[-12,0,0],wR:[40,-80,0]}],
    [1.5,{h:[50,-2,-4],sp:[16,0,-4],ch:[14,0,0],nk:[-4,0,0],hd:[-6,16,0],tL:[-30,0,6],kL:[70,0,0],tR:[-26,0,-6],kR:[68,0,0],X:[0,.26],uL:[-80,0,20],fL:[-40,0,0],uR:[-80,0,-20],fR:[-40,0,0],ey:[.9]},'in'],
    [1.76,{h:[90,0,-4],sp:[2,0,-2],ch:[0,0,0],nk:[-14,0,0],hd:[-12,hy*.85,0],tL:[-6,4,6],kL:[14,0,0],tR:[-6,-4,-6],kR:[14,0,0],aL:[50,0,0],aR:[50,0,0],X:[0,.7],
      uL:[-20,0,24],fL:[-20,0,0],uR:[-20,0,-24],fR:[-20,0,0],ey:[.6]},'in'],
    [1.86,{h:[87,0,-4]},'out'],
    [2.6,{h:[90,0,-4],nk:[hy?-8:-2,0,0],hd:[hy?-6:2,hy,0],tL:[-4,4,6],kL:[10,0,0],tR:[-4,-4,-6],kR:[8,0,0],uL:[4,0,30],fL:[-12,0,0],wL:[0,-90,0],uR:[6,0,-30],fR:[-10,0,0],wR:[0,90,0],ey:[0]},'out']]);
  /* the weapons: captured where the hands let go, then a fall under gravity, turning to lie flat */
  const drop={};for(const sd of['R','L']){const fw=FC('_probe',tRel[sd],death,'',()=>null);L.pop();fw.fn(tRel[sd]);const A=heldM(sd),R0=restOf(sd,A),pa=new V().setFromMatrixPosition(A),pr=new V().setFromMatrixPosition(R0);
    drop[sd]={A,R0,tl:Math.max(.18,Math.sqrt(2*Math.max(0,pa.y-pr.y)/9.8))};}
  const dropW=(t,sd)=>{const d=drop[sd],tau=t-tRel[sd];if(tau<=0)return null;if(tau>=d.tl)return d.R0.clone();const s=tau/d.tl,m=lerpM(d.A,d.R0,ss(s));
    const pa=new V().setFromMatrixPosition(d.A),pr=new V().setFromMatrixPosition(d.R0);m.elements[13]=Math.max(pr.y,pa.y-4.9*tau*tau);return m;};
  const F=FC('Death',2.6,death,'Recoils, sinks onto its knees, lets the weapons fall, the eyes go out and it pitches forward face down',dropW);

  /* ---- Rise ---- */
  const RK={};for(const c of CH)RK[c]=death(2.6)[c].slice();const last=F.fn(2.6);RK.X=last.X.slice();RK.anc=[0,0];RK.flat=[0,0];RK.ey=[0];
  const wK={wL:K0.wL,wR:K0.wR},rise=gbDeathKeys(RK,[
    [.5,{ey:[1.3]}],[.75,{ey:[1]}],
    [1.05,{uL:[0,90,80],fL:[-100,0,0],uR:[0,-90,-80],fR:[-100,0,0]}],
    [1.4,{nk:[-36,0,0],hd:[-30,10,0],uL:[-40,60,50],fL:[-80,0,0],wL:[0,0,0],uR:[-40,-60,-50],fR:[-80,0,0],wR:[0,0,0],X:[RK.X[0],RK.X[1]-.08]}],
    [1.75,{h:[62,0,0],sp:[6,0,0],ch:[6,0,0],nk:[-40,0,0],hd:[-24,0,0],tL:[-30,4,6],kL:[70,0,0],tR:[-30,-4,-6],kR:[70,0,0],aL:[60,0,0],aR:[60,0,0],
      uL:[-60,50,40],fL:[-60,0,0],uR:[-60,-50,-40],fR:[-60,0,0],X:[RK.X[0]*.8,RK.X[1]-.36]}],
    [2.25,Object.assign({h:[16,0,0],sp:[10,0,0],ch:[8,0,0],nk:[-8,0,0],hd:[-6,0,0],tL:[-20,0,6],kL:[96,0,0],tR:[-20,0,-6],kR:[96,0,0],uL:[-50,0,30],fL:[-50,0,0],uR:[-50,0,-30],fR:[-50,0,0],X:[RK.X[0]*.6,RK.X[1]*.5]},wK)],
    [2.7,{uL:[-56,0,24],fL:[-56,0,0],uR:[-56,0,-24],fR:[-56,0,0]}],
    [3.1,{h:[22,-4,0],tR:[-96,0,-6],kR:[104,0,0],aR:[0,0,0],flat:[0,1],anc:[0,1],X:[RK.X[0]*.4,RK.X[1]*.35]}],
    [3.6,{h:[26,-6,0],sp:[14,-2,0],ch:[14,-4,0],nk:[6,0,0],hd:[-10,0,0],tL:[-50,0,4],kL:[84,0,0],aL:[20,0,0],tR:[-74,0,-6],kR:[90,0,0],uL:[-50,0,24],fL:[-60,0,0],uR:[-50,0,-24],fR:[-60,0,0],flat:[.5,1],anc:[.5,1],X:[RK.X[0]*.15,RK.X[1]*.15]}],
    [4.2,Object.assign({},K0,{hd:[K0.hd[0],K0.hd[1]+16,0]})],
    [4.6,K0]]);
  /* the weapons lie where Death left them, then fly up into the fists while it kneels */
  const fly={R:[2.3,2.75],L:[2.4,2.85]},RW={R:drop.R.R0,L:drop.L.R0};
  /* the flight is worked out in the socket's frame: the weapon turns to its grip angle over the first 70%, and arcs in from beyond the
     fingers, so it never passes through the forearm on its way into the fist */
  const riseW=(t,sd)=>{const[a,b]=fly[sd];if(t<=a)return RW[sd].clone();if(t>=b)return null;const s=ss((t-a)/(b-a)),H=heldM(sd),lp=new V(),lq=new Q(),sc=new V();
    new M4().copy(H).invert().multiply(RW[sd]).decompose(lp,lq,sc);lp.multiplyScalar(1-s);lp.y-=.35*Math.sin(Math.PI*s);lq.slerp(new Q(),Math.min(1,s/.7));
    return above(sd,H.multiply(new M4().compose(lp,lq,new V(1,1,1))));};
  FC('Rise',4.6,rise,'The eyes light again; it pushes up onto its knees, the weapons fly back into its fists and it stands into the war stance',riseW,{refEnd:true,next:'Idle (war mode)'});}

ASSETS.push({id:'revenant',folder:'characters/enemies/undead',name:'Revenant',kind:'character',variants:true,defaultSeed:1,groundR:2.6,build:(s,o)=>buildRevenant(s,o||{}),
  opts:[{key:'weaponR',label:'Right hand',choices:[['random','Random'],['sword','Short sword'],['axe','Axe'],['mace','Mace']],def:'random'},
    {key:'weaponL',label:'Left hand',choices:[['random','Random'],['sword','Short sword'],['axe','Axe'],['mace','Mace']],def:'random'},
    {key:'helm',label:'Helmet',choices:[['random','Random'],['great','Great helm'],['horned','Horned'],['crowned','Crowned'],['open','Open (face shows)']],def:'random'},
    {key:'armor',label:'Armour',choices:[['random','Random'],['black','Blackened'],['rust','Rusted'],['steel','Pale old steel']],def:'random'},
    {key:'eyes',label:'Eyes',choices:[['random','Random'],['ice','Icy blue glow'],['green','Pale green glow'],['red','Red glow'],['violet','Violet glow']],def:'random'}],
  desc:'Revenant: a big undead warrior, about 2.2 m, in heavy decayed plate over mail (blackened, rusted or pale old steel), with a one-handed weapon in each hand: short sword, axe or mace, chosen per hand. Closed great helm, horned or crowned helm with the eyes glowing through the slit, or an open helm showing a withered face; eyes icy blue, pale green, red or violet. Clips: Idle, Walk, Run, war-mode Idle, Walk and Run, Attack 1 (right slash), Attack 2 (left slash), Attack 3 (both weapons chopped down), Attack 4 (both swung in from the sides), Heavy attack (leaps and smashes both weapons into the ground), Block, Roar, Taunt (clashes the weapons), Hit 1, Hit 2, Heavy hit, Death (sinks to its knees, drops the weapons, the eyes go out, falls face down) and Rise (the eyes light again, the weapons fly back into its hands).'});
