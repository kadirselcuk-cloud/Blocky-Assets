/* ======================= VAMPIRE SPAWN: a feral, freshly risen vampire that bites and leaps on its prey =======================
   Human-sized (VB.vspawn is the villager male's proportions, about 1.8 m standing straight), but it never straightens: a humped back,
   bent knees and the head pushed forward keep it at about 1.4 m. Built from its own meshes on the villager's 25 joints (so the
   warrior's leg and arm IK, wrSolve, fits unchanged) with the wight's clip machinery: hand targets in the torso's frame, wrists keyed
   (never aimed), elbow poles chosen frame by frame so no arm flips. Bald, a large round head with veins on the scalp, long pointed
   ears that sweep out and back, glowing eyes, a hooked nose, two long upper fangs and a lower jaw that opens (g_jaw); big clawed hands.
   Rise from the ground: the claws break out of the earth, it drags itself up out of the ground (no ground
   piece of its own: a summoning effect is added separately) and crouches into the war stance. Death collapses face down; Rise gets back up. */
VB.vspawn=Object.assign({},VB.male,{sex:'male',g:1.45});
{const b=VB.vspawn;b.key='vspawn';b.hipH=b.thigh+b.shin+b.ankle+b.hipOff;b.legS=(b.thigh+b.shin)/.84;b.tS=(b.spine+b.chest)/.3;b.cS=b.neck/.22;}
const VS_SKIN={chalk:['#c8c6bc','chalk white'],bluish:['#9ea6ac','grey-blue'],green:['#9ea692','grey-green'],sallow:['#c0b696','sallow']};
const VS_EYES={red:['#ffe0d8','#dc3a32','red glowing eyes'],amber:['#fff2d0','#f0a838','amber glowing eyes'],white:['#f6f0e4','#e8f6ff','white glowing eyes']};
const VS_CLOTH={rags:'a torn grave shirt and ragged breeches',bare:'bare chest and ragged breeches'};
const VS_SHIRT=[['#8a8472','grave linen'],['#6e6a5e','grey'],['#5a4e44','brown']];
const VS_BREECH=[['#3a3430','black-brown'],['#4a4038','brown'],['#3c3a40','grey'],['#4a2e2c','faded red']];

function buildVampireSpawn(seed,o={}){const B=VB.vspawn,r=mulberry32(((seed*2654435761)>>>0)^0x5a17),pick=a=>a[Math.floor(r()*a.length)],root=new THREE.Group();root.userData.lights=[];
  /* roll everything, then let the options override */
  const skin0=pick(Object.keys(VS_SKIN)),eye0=pick(['red','red','amber','white']),cl0=pick(['rags','bare','bare']),shc=pick(VS_SHIRT),brc=pick(VS_BREECH),notch=r()<.35,scar=r()<.4;
  const opt=(k,d)=>o[k]&&o[k]!=='random'?o[k]:d,skinK=opt('skin',skin0),eyeK=opt('eyes',eye0),cloth=opt('clothes',cl0);
  const shade=(h,f)=>'#'+new THREE.Color(h).multiplyScalar(f).getHexString(),SK=VS_SKIN[skinK][0];
  const skin=bm(SK,'skin'),skinD=bm(shade(SK,.76),'skin'),skinX=bm(shade(SK,.55),'skin'),vein=bm('#'+new THREE.Color(SK).multiplyScalar(.8).lerp(new THREE.Color('#6a7a9a'),.2).getHexString(),'plain'),dark=bm('#160f0f','plain'),claw=bm('#1c1814','plain'),
    teeth=bm('#e4dcc4','plain'),gum=bm('#5a2228','plain'),dirt=bm('#4a3a2a','plain');
  const ey=VS_EYES[eyeK],eyeM=wrGlow(ey[0],ey[1],1.7,pxTex('plain')),shM=bm(shc[0],'cloth'),shD=bm(shade(shc[0],.72),'cloth'),brM=bm(brc[0],'cloth'),brD=bm(shade(brc[0],.7),'cloth'),rope=vm('rope');
  const shirt=cloth==='rags',top=shirt?shM:skin,topD=shirt?shD:skinD;
  const hips=J('hips',root,0,B.hipH,0),spine=J('spine',hips,0,B.spine,0),chest=J('chest',spine,0,B.chest,0),neck=J('neck',chest,0,B.neck,0),head=J('head',neck,0,B.headY,0);
  /* pelvis: ragged breeches, rope belt */
  bx(hips,.27,.17,.17,brM,0,0,0);bx(hips,.28,.03,.18,rope,0,.07,0);
  /* belly: sunken waist; the shirt hangs torn below the belt */
  bx(spine,.235,.24,.15,top,0,.07,0);
  if(shirt){for(const[x,L]of[[-.1,.06],[-.03,.09],[.04,.05],[.1,.08]])bx(spine,.04,L,.012,shD,x,-.05-L/2,.077);bx(spine,.05,.06,.01,skinD,-.05,.08,.076);}
  else for(const y of[.04,.1])for(const s of[-1,1])bx(spine,.05,.012,.01,skinD,s*.06,y,.077);
  /* chest: narrow and bony, collarbones; a big hump over the shoulder blades with spine knobs along it */
  bx(chest,.3,.25,.19,top,0,.1,0);
  for(const s of[-1,1])bx(chest,.12,.025,.02,topD,s*.07,.21,.09);
  if(shirt){bx(chest,.11,.07,.01,skinD,0,.19,.096);bx(chest,.07,.06,.01,skin,.08,.03,.096);bx(chest,.04,.05,.01,shD,-.09,.08,.097);}
  else{for(const y of[.0,.05,.1,.15])for(const s of[-1,1])bx(chest,.07,.014,.012,skinD,s*.08,y,.098);bx(chest,.02,.2,.008,skinD,0,.08,.098);}
  bx(chest,.28,.22,.12,top,0,.15,-.12);bx(chest,.22,.14,.08,top,0,.2,-.19);bx(chest,.14,.08,.04,topD,0,.21,-.24);
  for(const[y,z]of[[.05,-.185],[.13,-.235],[.21,-.265],[.28,-.24]])bx(chest,.035,.03,.03,shirt?shD:skinD,0,y,z);
  if(shirt){bx(chest,.06,.05,.01,skin,-.07,.16,-.231);bx(chest,.02,.08,.01,shD,.09,.06,-.181);}
  /* neck: thin, tendons, pushed forward out of the hump */
  bx(neck,.08,.14,.08,skin,0,.02,.0);for(const s of[-1,1])bx(neck,.014,.12,.012,skinD,s*.022,.015,.041);
  /* head: large and round, bald, veins on the scalp; heavy brow, deep sockets with glowing eyes, a hooked nose, a wide mouth with
     two long upper fangs over the lower lip */
  bx(head,.28,.26,.27,skin,0,.17,0);bx(head,.3,.16,.23,skin,0,.2,-.01);bx(head,.22,.06,.22,skin,0,.32,-.01);bx(head,.2,.18,.04,skin,0,.2,-.15);bx(head,.16,.08,.03,skin,0,.29,-.13);
  for(const[x,z,ry]of[[-.06,.06,0],[.05,-.02,.5],[-.02,-.09,1.2]])bx(head,.012,.004,.12,vein,x,.352,z,0,ry,0);
  for(const s of[-1,1])bx(head,.004,.08,.012,vein,s*.151,.22,-.04,0,0,s*.3);
  bx(head,.27,.04,.04,skinD,0,.215,.13);
  for(const s of[-1,1]){bx(head,.07,.05,.012,dark,s*.062,.172,.136);bx(head,.032,.022,.008,eyeM,s*.062,.17,.143);bx(head,.03,.03,.012,skinD,s*.11,.11,.13);}
  bx(head,.04,.07,.045,skin,0,.13,.15);bx(head,.034,.03,.04,skinD,0,.098,.17);bx(head,.026,.016,.02,skinD,0,.085,.162);for(const s of[-1,1])bx(head,.01,.012,.008,dark,s*.01,.087,.172);
  bx(head,.16,.03,.03,skinD,0,.074,.128);bx(head,.15,.03,.07,dark,0,.06,.09);bx(head,.13,.012,.012,teeth,0,.053,.124);
  for(const s of[-1,1]){bx(head,.018,.05,.018,teeth,s*.034,.03,.128);bx(head,.012,.022,.012,teeth,s*.034,-.004,.128);}
  if(scar)bx(head,.008,.09,.012,skinX,.09,.25,.131,0,0,.4);
  /* long pointed ears: five tapering pieces sweeping out, back and a little up; the tip is the narrowest (ears point outward) */
  for(const s of[-1,1]){const eg=new THREE.Group();eg.position.set(s*.148,.18,-.02);eg.rotation.set(0,s*.2,s*.32);eg.scale.set(1.35,1.1,1);head.add(eg);
    bx(eg,.06,.1,.018,skin,s*.03,0,0);bx(eg,.06,.075,.016,skin,s*.085,.014,0);bx(eg,.06,.052,.014,skin,s*.14,.03,0);bx(eg,.05,.032,.012,skinD,s*.195,.045,0);bx(eg,.04,.016,.01,skinD,s*.24,.058,0);
    bx(eg,.11,.045,.008,skinX,s*.07,.004,.009);if(notch&&s>0)bx(eg,.024,.018,.02,skinX,.12,.05,0);}
  const jw=new THREE.Group();jw.name='g_jaw';head.add(jw);jw.position.set(0,.075,0);jw.rotation.x=.1;
  bx(jw,.15,.035,.05,skin,0,-.05,.085);for(const s of[-1,1])bx(jw,.024,.05,.12,skin,s*.075,-.03,.03);bx(jw,.11,.012,.06,gum,0,-.032,.07);bx(jw,.1,.012,.012,teeth,0,-.026,.105);
  for(const s of[-1,1])bx(jw,.012,.028,.012,teeth,s*.028,-.012,.106);
  /* arms: thin upper arms and forearms, bony elbows, big hands with long fingers and long black claws (the wight's hand) */
  for(const[sd,s]of[['L',1],['R',-1]]){const sh=J('shoulder_'+sd,chest,s*B.shW*.325,.165*B.cS,0),ua=J('upperArm_'+sd,sh,s*B.shW*.675,0,0),fa=J('foreArm_'+sd,ua,0,-B.ua,0),hd=J('hand_'+sd,fa,0,-B.fa,0);
    const fg=J('fingers_'+sd,hd,0,-.15,0),ft=J('fingerTips_'+sd,fg,0,-.075,0),th=J('thumb_'+sd,hd,-s*.016,-.055,.085),so=J('socket_'+sd,hd,-s*.012,-.075,0);so.userData.socket=true;
    bx(ua,.088,.08,.095,top,s*-.005,-.01,0);bx(ua,.064,.25,.064,skin,0,-.15,0);bx(ua,.072,.04,.074,skinD,0,-.275,-.006);
    if(shirt){bx(ua,.08,.11,.08,shM,0,-.06,0);bx(ua,.02,.06,.012,shD,s*.02,-.14,.041);}
    bx(fa,.056,.23,.056,skin,0,-.12,0);bx(fa,.052,.03,.052,skinD,0,-.24,0);bx(fa,.01,.14,.008,skinX,0,-.12,.029);
    bx(hd,.07,.16,.15,skin,0,-.074,0);bx(hd,.072,.016,.152,skinD,0,-.142,0);for(const z of[-.057,-.019,.019,.057])bx(hd,.008,.12,.012,skinX,s*.033,-.075,z);
    const tip=(par,y,z,k=1)=>{bx(par,.019*k,.055*k,.019*k,claw,-s*.002,y,z);bx(par,.014*k,.05*k,.014*k,claw,-s*.008*k,y-.047*k,z,0,0,-s*.14);bx(par,.009*k,.045*k,.009*k,claw,-s*.016*k,y-.088*k,z,0,0,-s*.32);};
    for(const[z,k]of[[.057,.88],[.019,1.15],[-.019,.86],[-.057,.68]]){const w=.8+.2*k,fa=-z*3.4,Lp=.075*k,Ld=.06*k,g1=new THREE.Group(),g2=new THREE.Group();
      g1.position.set(0,0,z);g1.rotation.x=fa;fg.add(g1);g2.position.set(0,.075-Lp*Math.cos(fa),z-Lp*Math.sin(fa));g2.rotation.x=fa;ft.add(g2);
      bx(g1,.026*w,Lp,.025*w,skin,0,-Lp/2+.004,0);bx(g1,.028*w,.02,.027*w,skinD,0,-Lp+.006,0);bx(g2,.023*w,Ld,.022*w,skinD,0,-Ld/2,0);tip(g2,-Ld-.022*k,0,.75+.25*k);}
    const tg=new THREE.Group();tg.rotation.set(-.7,0,-s*.12);th.add(tg);bx(tg,.034,.056,.034,skin,0,-.024,.004);bx(tg,.032,.016,.032,skinD,0,-.053,.004);
    bx(tg,.029,.048,.029,skinD,0,-.08,.004);tip(tg,-.124,.004,.95);}
  /* legs: ragged breeches to the knee, bare shins smeared with grave dirt, long bony clawed feet (the wight's, matching the IK foot) */
  for(const[sd,s]of[['L',1],['R',-1]]){const th=J('thigh_'+sd,hips,s*B.hipW,-(B.hipOff+.01),0),sn=J('shin_'+sd,th,0,-B.thigh,0),ft=J('foot_'+sd,sn,0,-B.shin,0);
    bx(th,.112,.4,.116,brM,0,-.19,0);for(const[x,L]of[[-.035,.05],[.0,.08],[.035,.04]])bx(th,.03,L,.012,brD,x,-.39-L/2+.02,.058);bx(th,.03,.06,.01,skinD,s*.03,-.2,.059);
    bx(sn,.088,.06,.098,skinD,0,-.01,.004);bx(sn,.078,.36,.082,skin,0,-.2,0);bx(sn,.012,.2,.008,skinX,0,-.18,.043);bx(sn,.082,.08,.086,dirt,0,-.31,0);bx(sn,.04,.06,.088,dirt,s*.02,-.24,0);
    bx(ft,.08,.045,.085,skin,0,-.025,-.01);bx(ft,.098,.035,.25,skin,0,-.0525,.018);bx(ft,.07,.016,.12,skinD,0,-.03,.06);bx(ft,.05,.03,.03,skinD,0,-.055,-.09);
    for(const x of[-.034,-.011,.011,.034]){const L=Math.abs(x)>.02?.8:1,e=.143+.047*L;bx(ft,.02,.03,e-.14,skin,x,-.055,(e+.14)/2);bx(ft,.021,.01,.012,skinD,x,-.045,e-.03);
      bx(ft,.014,.016,.026,claw,x,-.046,e-.012);bx(ft,.009,.012,.012,claw,x,-.057,e+.002);}
  }
  const joints=[];root.traverse(q=>{if(q.userData.joint&&!q.userData.socket)joints.push(q);});root.userData.joints=joints;
  if(o.bare)return root;
  if(!o.noClips){root.userData.clips=vampireSpawnClips();jw.rotation.x=.1;}
  root.userData.ground=2.4;
  const cap=s=>s.charAt(0).toUpperCase()+s.slice(1);
  root.userData.variantText=`${cap(VS_SKIN[skinK][1])} skin, ${ey[2]}${notch?', a notch torn out of the left ear':''}${scar?', a scar across the scalp':''}; ${VS_CLOTH[cloth]} (${shirt?shc[1]+' shirt, ':''}${brc[1]} breeches). Bites and leaps on its prey to feed.`;
  return root;}

/* ---------- clips ---------- */
let VS_CLIPS=null;
/* stances. Relaxed (VS_N): crouched on bent knees, the humped back bowed, head pushed forward, arms hanging with the claws by the knees.
   War (VS_W): lower and wider, left foot forward, both claws raised in front, fangs bared. Hand targets in metres (hips-relative x,z). */
const VS_N={HP:[0,-.15,-.02],h:[24,0,0],sp:[18,0,0],ch:[24,0,0],nk:[20,0,0],hd:[-26,0,0],FL:[.13,.05,14,0,0],FR:[-.13,-.05,-14,0,0],
  gR:[-.28,.64,.32],dR:[0,-.7,.7],pR:[-.5,-.3,-.8],gL:[.28,.64,.32],dL:[1,0,0],pL:[.5,-.3,-.8],wr:[0,0,-6],wl:[0,0,-6],fist:[30,30],jw:[.1]};
const VS_W=wrP(VS_N,{HP:[0,-.18,0],h:[28,0,0],sp:[18,0,0],ch:[20,0,0],nk:[24,0,0],hd:[-30,0,0],FL:[.15,.16,16,0,0],FR:[-.15,-.16,-22,0,0],
  gR:[-.26,.9,.72],gL:[.24,.92,.76],wr:[12,0,-24],wl:[12,0,-24],fist:[10,10],jw:[.32]});
function vsRig(){const B=VB.vspawn,m=buildVampireSpawn(1,{bare:true}),J={};m.traverse(q=>{if(q.userData.joint)J[q.name]=q;});return{m,J,B,two:false};}

function vampireSpawnClips(){if(VS_CLIPS)return VS_CLIPS;const B=VB.vspawn,D=Math.PI*2,S=Math.sin,C=Math.cos,V=THREE.Vector3,Q=THREE.Quaternion,L=[],R=vsRig();
  /* as the wight: hand targets in the torso's frame, hands follow the forearm bent by keyed wrists (wr right, wl left), elbow poles
     chosen by score round the shoulder-to-hand line with frame-to-frame continuity; a hand never comes closer than 0.4 m to its shoulder */
  const yawF=p=>{const y=(p.h[1]+p.sp[1]+p.ch[1])*Math.PI/180,c=Math.cos(y),sn=Math.sin(y),rt=v=>[v[0]*c+v[2]*sn,v[1],-v[0]*sn+v[2]*c],o=Object.assign({},p);for(const k of['gR','gL'])o[k]=rt(p[k]);return o;};
  const restQ={L:new Q().setFromEuler(new THREE.Euler(0,0,BASEPOSE.upperArm_L[2]*Math.PI/180)),R:new Q().setFromEuler(new THREE.Euler(0,0,BASEPOSE.upperArm_R[2]*Math.PI/180))};
  const MIN=.4;let PP=null;const M4=new THREE.Matrix4();
  const poles=p=>{R.m.updateMatrixWorld(true);const k=B.legS,o=Object.assign({},p),hp=(p.HP||[0,0,0]).map(v=>v*k),cq=R.J.chest.getWorldQuaternion(new Q()),up=new V(0,1,0),fw=new V(0,0,1).applyQuaternion(cq),nx={};
    for(const[sd,s]of[['L',1],['R',-1]]){const G=p['g'+sd],Sh=R.J['upperArm_'+sd].getWorldPosition(new V()),shW=R.J['shoulder_'+sd].getWorldQuaternion(new Q()),shq=shW.clone().invert(),sq=shW.clone().multiply(restQ[sd]);
      const T=new V(G[0]*k+hp[0],G[1]*k,G[2]*k+hp[2]).sub(Sh);if(T.length()<MIN){T.setLength(MIN);o['g'+sd]=[(Sh.x+T.x-hp[0])/k,(Sh.y+T.y)/k,(Sh.z+T.z-hp[2])/k];}const d=Math.min(T.length(),(B.ua+B.fa)*.999),u=T.normalize(),bone=new V(0,-1,0).applyQuaternion(sq);
      const al=Math.acos(Math.min(1,Math.max(-1,(B.ua*B.ua+d*d-B.fa*B.fa)/(2*B.ua*d)))),inw=new V(-s,0,0).applyQuaternion(cq);
      const el0=new V(0,0,-1).applyQuaternion(sq).applyQuaternion(new Q().setFromUnitVectors(bone,u)),b1=el0.clone().addScaledVector(u,-el0.dot(u)).normalize(),b2=new V().crossVectors(u,b1);
      let prev=PP&&PP[sd]?PP[sd].clone().addScaledVector(u,-PP[sd].dot(u)):null;if(prev&&prev.lengthSq()<.04)prev=null;if(prev)prev.normalize();let best=null,bc=1e9;
      for(const lim of[.866,-2])if(!best)
      for(let i=0;i<96;i++){const f=i/96*2*Math.PI,pp=b1.clone().multiplyScalar(Math.cos(f)).addScaledVector(b2,Math.sin(f)),e=u.clone().multiplyScalar(Math.cos(al)).addScaledVector(pp,Math.sin(al));
        const Y=e.clone().negate(),Z=pp.clone().addScaledVector(e,-pp.dot(e)).normalize().negate(),lq=shq.clone().multiply(new Q().setFromRotationMatrix(M4.makeBasis(new V().crossVectors(Y,Z),Y,Z)));let rr=Math.abs(2*Math.atan2(lq.y,lq.w));if(rr>Math.PI)rr=2*Math.PI-rr;
        if(prev&&pp.dot(prev)<lim||pp.dot(inw)>.35)continue;const c=(rr/1.4)**2+3*Math.max(0,pp.dot(inw)+.1)**2+3*Math.max(0,pp.dot(up)+.15)**2+1.5*Math.max(0,-pp.dot(inw)-.55)**2+2*Math.max(0,pp.dot(fw)-.2)**2+(prev?.5*(1-pp.dot(prev)):0);
        if(c<bc){bc=c;best=pp;}}
      if(!best)best=prev||el0;nx[sd]=best;o['p'+sd]=best.toArray();}
    PP=nx;return o;};
  const solve=p0=>{let p=yawF(p0);wrSolve(R,p);p=poles(p);const s=wrSolve(R,p);s.wR=[p.wr[0]*.4,p.wr[1],p.wr[2]];s.wL=[p.wl[0]*.4,-p.wl[1],-p.wl[2]];s.fist=p.fist;return s;};
  /* every clip keys the jaw; looping clips run one warm-up cycle first */
  const extra=(c,jaw)=>{const T=c.tracks[0].times,JQ=[],q=new Q(),e=new THREE.Euler();
    for(const t of T){q.setFromEuler(e.set(jaw(t),0,0));JQ.push(q.x,q.y,q.z,q.w);}
    c.tracks.push(new THREE.QuaternionKeyframeTrack('g_jaw.quaternion',Array.from(T),JQ));};
  const CC=(name,dur,fn,o={})=>{PP=null;if(o.loop)for(let i=0;i<Math.round(dur*30);i++)solve(fn(i/30));const c=sampleClip(name,dur,t=>solve(fn(t)),Object.assign({autoFeet:false},o),B);
    extra(c,t=>fn(t).jw[0]);if(o.next)c.next=o.next;if(o.underground)c.underground=true;L.push(c);return c;};
  const KC=(name,dur,keys,note,o={})=>{const f=wrKeys(keys.map(k=>[k[0],wrP(o.base||VS_W,k[1]||{})]));return CC(name,dur,o.add?t=>o.add(t,f(t)):f,Object.assign({note},o));};
  const lift=(o,dy)=>{o.gR=[o.gR[0],o.gR[1]+dy,o.gR[2]];o.gL=[o.gL[0],o.gL[1]+dy,o.gL[2]];return o;};
  const GAIT=(name,dur,G,note)=>{const fn=t=>{const u=t/dur,o=G.body(u),c2=C(D*(u-G.duty/2));o.HP=[G.sw*c2,G.y0-G.b*C(2*D*(u-G.duty/2)),G.z0||0];lift(o,o.HP[1]-G.y0);
      for(const[sd,off,x,yaw]of[['L',0,G.x,G.yaw[0]],['R',.5,-G.x,G.yaw[1]]]){const q=(((u+off)%1)+1)%1;let z,l,pt;
        if(q<G.duty){const v=q/G.duty;z=G.s*(1-2*v);l=0;pt=v<.15?-10*(1-v/.15):v>.7?G.toe*(v-.7)/.3:0;}
        else{const v=(q-G.duty)/(1-G.duty),sm=v*v*(3-2*v);z=-G.s+2*G.s*sm;l=G.lift*Math.sin(Math.PI*Math.pow(v,G.lp||1));pt=G.toe*(1-v)*(1-v)-12*v*v;}
        o['F'+sd]=[x,z+(sd==='L'?1:-1)*(G.st||0),yaw,l,pt];}return o;};
    const sp=2*G.s/(G.duty*dur),c=CC(name,dur,fn,{loop:true,note:`${note}, in place, ${sp.toFixed(1)} m/s`});c.speed=sp;};
  const swing=(o,a,amp,y0,z0,x0)=>{o.gL=[x0,y0+.04*Math.abs(a),z0-amp*a];o.gR=[-x0,y0+.04*Math.abs(a),z0+amp*a];return o;};

  /* ---- relaxed ---- */
  {const dur=5,tw=(t,t0,w)=>{const s=(t-t0)/w;return s<0||s>1?0:s<.15?s/.15:Math.pow(1-(s-.15)/.85,2);};
    CC('Idle',dur,t=>{const p=D*t/dur,b=S(p),b2=S(2*p),j1=tw(t,1.2,1.1),j2=tw(t,3.3,.9),cl=Math.max(0,S(3*p));
      return wrP(VS_N,{HP:[.008*b,-.17-.006*b2,-.02],h:[24+1.2*b2,0,1.5*b],sp:[18+b2,0,0],ch:[24+1.5*b2,2*b,0],nk:[20+6*j1,0,0],hd:[-26-10*j1+6*j2+2*S(3*p),30*S(p+.4)*.6,8*j2],
        gR:[-.28,.64+.012*b2,.32],gL:[.28,.64+.012*b2,.32],wr:[0,0,-6-14*cl],wl:[0,0,-6-14*Math.max(0,S(3*p+2))],fist:[30-20*Math.max(0,S(3*p+2)),30-20*cl],jw:[.1+.04*Math.max(0,S(5*p))+.3*j2]});},
      {loop:true,note:'Crouched, breathing; sniffs the air with the head stretched forward, bares its fangs, the claws flex'});}
  GAIT('Walk',1.3,{duty:.64,s:.23,lift:.07,toe:16,x:.13,yaw:[12,-12],y0:-.2,b:.012,sw:.018,
    body:u=>{const yw=C(D*u),a=C(D*(u-.06));return swing(wrP(VS_N,{h:[26,-5*yw,2*S(D*u)],sp:[18,2*yw,0],ch:[24,4*yw,0],hd:[-26,-4*yw,0]}),a,.12,.64,.32,.28);}},'Skulking hunched walk, arms hanging');
  GAIT('Run',.7,{duty:.42,s:.42,lift:.15,lp:.8,toe:26,x:.13,yaw:[8,-8],y0:-.25,b:.03,sw:.02,
    body:u=>{const yw=C(D*u),a=C(D*(u-.04));return swing(wrP(VS_W,{h:[36,-6*yw,3*S(D*u)],sp:[18,3*yw,0],ch:[16,5*yw,0],nk:[24,0,0],hd:[-38,0,0],wr:[20,0,-10],wl:[20,0,-10],fist:[30,30],jw:[.4]}),a,.28,.8,.32,.3);}},'Low, fast run, leaning in, claws swinging');

  /* ---- war mode ---- */
  CC('Idle (war mode)',2.4,t=>{const p=D*t/2.4,b=S(p),c=S(2*p);return lift(wrP(VS_W,{HP:[.008*S(p),-.18-.008*b,0],sp:[18+b,0,0],ch:[20+1.4*b,0,0],hd:[-30+2*S(2*p+1),6*S(p),0],
    gR:[-.26,.9,.72+.03*c],gL:[.24,.92,.76-.03*c],wr:[12,0,-24-10*Math.max(0,c)],wl:[12,0,-24-10*Math.max(0,-c)],jw:[.32+.18*Math.max(0,S(2*p))]}),-.015*S(p+.6));},{loop:true,note:'Low and wide, both claws raised, fangs bared, hissing'});
  GAIT('Walk (war mode)',1.2,{duty:.66,s:.2,lift:.06,toe:16,x:.15,yaw:[16,-22],y0:-.21,b:.01,sw:.014,st:.08,
    body:u=>lift(wrP(VS_W,{h:[28,-4*C(D*u),2*S(D*u)],gR:[-.26,.9,.72+.04*C(D*u)],gL:[.24,.92,.76-.04*C(D*u)],jw:[.36]}),.015*C(2*D*u))},'Stalking forward, claws raised');

  /* ---- attacks ---- */
  /* Bite: coils, darts in with a step, both claws grab high in front and the fangs snap shut at neck height, worries the head side to
     side, tears free and steps back */
  {const GR={gR:[-.22,1.1,.66],gL:[.2,1.12,.68],wr:[10,0,-20],wl:[10,0,-20]},IN={HP:[0,-.2,.26],h:[32,0,0],sp:[16,0,0],ch:[14,0,0],FL:[.15,.44,16,0,0]};
  KC('Bite',1.8,[[0,{}],
    [.34,{HP:[0,-.27,-.06],h:[30,0,0],sp:[18,0,0],ch:[22,0,0],nk:[14,0,0],hd:[-40,0,0],gR:[-.32,.86,.56],gL:[.3,.88,.58],wr:[0,0,-34],wl:[0,0,-34],fist:[0,0],jw:[.6]}],
    [.5,{HP:[0,-.24,.12],h:[30,0,0],sp:[16,0,0],ch:[16,0,0],nk:[28,0,0],hd:[-24,0,0],FL:[.15,.3,16,.06,0],gR:[-.26,1.06,.66],gL:[.24,1.08,.68],wr:[8,0,-30],wl:[8,0,-30],fist:[0,0],jw:[1.1]}],
    [.62,wrP(IN,{nk:[34,0,0],hd:[-16,0,0],...GR,fist:[20,20],jw:[1.15]})],
    [.72,wrP(IN,{nk:[38,0,0],hd:[-12,0,0],...GR,fist:[70,70],jw:[.18]})],
    [.88,wrP(IN,{nk:[36,0,0],hd:[-14,16,6],ch:[14,-6,0],...GR,fist:[75,75],jw:[.2]})],
    [1.04,wrP(IN,{nk:[36,0,0],hd:[-14,-16,-6],ch:[14,6,0],...GR,fist:[75,75],jw:[.2]})],
    [1.18,wrP(IN,{nk:[36,0,0],hd:[-14,8,0],...GR,fist:[70,70],jw:[.22]})],
    [1.36,{HP:[0,-.23,.1],h:[26,0,0],sp:[16,0,0],ch:[18,0,0],nk:[16,0,0],hd:[-44,0,0],FL:[.15,.44,16,0,0],gR:[-.3,.98,.62],gL:[.28,1.0,.64],fist:[30,30],jw:[.75]}],
    [1.56,{HP:[0,-.2,.02],FL:[.15,.24,16,.05,0],jw:[.45]}],
    [1.8,{}]],'Coils, darts in, grabs with both claws and sinks its fangs in at neck height, worries side to side, tears free');}
  /* Claw swipe: the right claw winds up and rakes across with a step in (the wight's swipe) */
  {const s=1,f0=VS_W.FL,step=d=>[f0[0],f0[1]+d,f0[2],0,0],x=v=>v;
  KC('Claw swipe',1.46,[[0,{}],
    [.38,{HP:[0,-.25,-.04],h:[24,-14,0],sp:[16,-6,0],ch:[14,-12,0],hd:[-24,10,0],gR:x([-.56,1.16,.42]),gL:[.3,.92,.74],wr:[-20,0,-35],jw:[.5]}],
    [.52,{HP:[0,-.27,.04],h:[26,-8,0],sp:[17,-3,0],ch:[16,-6,0],FL:[f0[0],f0[1]+.12,f0[2],.05,0],gR:[-.5,1.0,.58],gL:[.3,.9,.72],wr:[-10,0,-30],jw:[.7]}],
    [.72,{HP:[0,-.29,.1],h:[29,6,0],sp:[18,3,0],ch:[17,8,0],FL:step(.24),gR:[-.2,.8,.74],gL:[.3,.88,.7],wr:[10,0,5],jw:[.6]}],
    [.92,{HP:[0,-.3,.12],h:[30,14,0],sp:[18,6,0],ch:[17,14,0],FL:step(.24),gR:[.06,.74,.62],gL:[.32,.88,.68],wr:[20,0,25],jw:[.4]}],
    [1.06,{HP:[0,-.29,.11],h:[30,15,0],sp:[18,6,0],ch:[17,15,0],FL:step(.24),gR:[.08,.72,.56],gL:[.32,.9,.68],wr:[20,0,25],jw:[.4]}],
    [1.24,{HP:[0,-.26,.04],h:[28,2,0],FL:[f0[0],f0[1]+.1,f0[2],.04,0],gR:[-.26,.86,.68],wr:[12,0,-10]}],
    [1.46,{}]],'Right claw: winds up and rakes across, with a step in');}
  /* Leap & feed: crouches, leaps about 1 m forward with the claws reaching, lands stretched up on its toes, claws gripping the
     prey's shoulders and the fangs in its neck; feeds (head and shoulders pulse with each gulp, the claws clench), rips free and
     hops back to where it started */
  {const FL0=VS_W.FL,FR0=VS_W.FR,Z=1.0,FEED={HP:[0,-.03,Z],h:[12,0,0],sp:[6,0,0],ch:[2,0,0],nk:[34,0,0],hd:[-6,0,0],FL:[.14,FL0[1]+Z,14,0,32],FR:[-.14,FR0[1]+Z,-18,0,38],
    gR:[-.22,1.36,.44],gL:[.2,1.38,.46],wr:[20,0,-10],wl:[20,0,-10],fist:[60,60],jw:[.25]};
  KC('Leap & feed',4.7,[[0,{}],
    [.38,{HP:[0,-.38,-.08],h:[42,0,0],sp:[20,0,0],ch:[18,0,0],nk:[20,0,0],hd:[-40,0,0],FL:[FL0[0],FL0[1],FL0[2],0,0],FR:[FR0[0],FR0[1],FR0[2],0,0],gR:[-.32,.52,.12],gL:[.3,.54,.14],wr:[0,0,-20],wl:[0,0,-20],fist:[20,20],jw:[.5]}],
    [.56,{HP:[0,-.06,.24],h:[30,0,0],sp:[12,0,0],ch:[8,0,0],nk:[24,0,0],hd:[-30,0,0],FL:[FL0[0],FL0[1],FL0[2],0,40],FR:[FR0[0],FR0[1],FR0[2],0,44],gR:[-.28,1.12,.62],gL:[.26,1.14,.64],wr:[10,0,-30],wl:[10,0,-30],fist:[0,0],jw:[.9]}],
    [.8,{HP:[0,.36,.62],h:[24,0,0],sp:[10,0,0],ch:[6,0,0],nk:[26,0,0],hd:[-24,0,0],FL:[.14,.62,14,.4,30],FR:[-.14,.44,-18,.46,30],gR:[-.26,1.62,.66],gL:[.24,1.64,.68],wr:[0,0,-34],wl:[0,0,-34],fist:[0,0],jw:[1.15]}],
    [1.02,wrP(FEED,{HP:[0,-.06,Z],nk:[30,0,0],hd:[-12,0,0],fist:[20,20],jw:[1.1]})],
    [1.16,wrP(FEED,{nk:[38,0,0],hd:[-4,0,0],jw:[.2]})],
    [1.3,FEED],[3.1,FEED],
    [3.32,wrP(FEED,{nk:[12,0,0],hd:[-40,0,0],ch:[-2,0,0],fist:[30,30],jw:[.8]})],
    [3.56,{HP:[0,-.3,Z-.04],h:[36,0,0],sp:[18,0,0],ch:[16,0,0],nk:[20,0,0],hd:[-34,0,0],FL:[.14,FL0[1]+Z,14,0,0],FR:[-.14,FR0[1]+Z,-18,0,0],gR:[-.3,.8,.5],gL:[.28,.82,.52],fist:[10,10],jw:[.55]}],
    [3.82,{HP:[0,.08,.52],h:[22,0,0],sp:[14,0,0],ch:[14,0,0],FL:[.15,FL0[1]+.5,15,.2,20],FR:[-.15,FR0[1]+.5,-20,.24,20],gR:[-.3,1.02,.6],gL:[.28,1.04,.62],jw:[.45]}],
    [4.08,{HP:[0,-.3,.02],h:[34,0,0],sp:[18,0,0],ch:[20,0,0],FL:[FL0[0],FL0[1],FL0[2],0,0],FR:[FR0[0],FR0[1],FR0[2],0,0],gR:[-.3,.82,.62],gL:[.28,.84,.64],jw:[.4]}],
    [4.7,{}]],'Crouches and leaps on its prey, grips its shoulders and sinks its fangs into the neck, feeds, rips free and hops back',
    {add:(t,p)=>{if(t<1.3||t>3.1)return p;const w=Math.min(1,(t-1.3)/.2,(3.1-t)/.2),g=Math.pow(Math.max(0,S(D*(t-1.3)/.6)),2)*w;
      return Object.assign({},p,{nk:[p.nk[0]+4*g,0,0],hd:[p.hd[0]-3*g,0,0],ch:[p.ch[0]+3*g,0,0],HP:[p.HP[0],p.HP[1]-.012*g,p.HP[2]],fist:[p.fist[0]+18*g,p.fist[1]+18*g],jw:[p.jw[0]+.08*g]});}});}

  /* ---- voice and reactions ---- */
  KC('Hiss',2.0,[[0,{}],
    [.35,{HP:[0,-.22,-.04],h:[22,0,0],sp:[14,0,0],ch:[16,0,0],nk:[30,0,0],hd:[-16,0,0],gR:[-.56,1.02,.42],gL:[.56,1.02,.42],wr:[-20,0,-40],wl:[-20,0,-40],fist:[0,0],jw:[1.15]}],
    [.7,{HP:[0,-.22,-.04],h:[22,2,0],sp:[14,0,0],ch:[16,0,0],nk:[32,0,0],hd:[-15,6,3],gR:[-.57,1.03,.41],gL:[.57,1.03,.41],wr:[-20,0,-42],wl:[-20,0,-42],fist:[0,0],jw:[1.2]}],
    [1.05,{HP:[0,-.22,-.04],h:[22,-2,0],sp:[14,0,0],ch:[16,0,0],nk:[32,0,0],hd:[-15,-6,-3],gR:[-.56,1.02,.42],gL:[.56,1.02,.42],wr:[-20,0,-40],wl:[-20,0,-40],fist:[0,0],jw:[1.15]}],
    [1.4,{HP:[0,-.21,-.04],h:[22,0,0],sp:[14,0,0],ch:[16,0,0],nk:[30,0,0],hd:[-16,0,0],gR:[-.55,1.0,.43],gL:[.55,1.0,.43],wr:[-20,0,-40],wl:[-20,0,-40],fist:[0,0],jw:[1.1]}],
    [1.7,{jw:[.5]}],
    [2.0,{}]],'Hunches its hump, thrusts the head forward and hisses with the fangs bared, claws spread wide');
  KC('Hit 1',.8,[[0,{}],
    [.1,{HP:[0,-.21,-.07],h:[12,-6,0],sp:[6,0,0],ch:[-4,0,0],nk:[8,0,0],hd:[-40,10,8],gR:[-.44,1.14,.38],gL:[.42,1.18,.42],wr:[-10,0,-30],wl:[-10,0,-30],jw:[.8]}],
    [.32,{HP:[0,-.23,-.04],h:[22,-6,0],sp:[14,-2,0],ch:[12,-4,0],hd:[-24,2,2],jw:[.5]}],
    [.8,{}]],'Head snaps back, fangs bared');
  KC('Hit 2',1.1,[[0,{}],
    [.14,{HP:[.06,-.23,0],h:[24,22,-8],sp:[14,8,-6],ch:[10,14,-8],hd:[-24,18,-12],gR:[-.24,1.0,.66],gL:[.46,.96,.6],wr:[-10,0,-30],wl:[-10,0,-30],jw:[.7]}],
    [.32,{HP:[.08,-.28,-.02],h:[28,12,-6],sp:[16,6,-4],ch:[16,8,-6],hd:[-26,8,-4],FL:[.19,.16,18,0,0],gR:[-.26,.96,.46],gL:[.42,.96,.42],jw:[.35]}],
    [.55,{HP:[.03,-.26,0],h:[28,2,0],FL:[.19,.16,18,0,0],FR:[-.17,-.2,-22,.05,0],jw:[.35]}],
    [.78,{HP:[0,-.24,0],FR:[-.15,-.18,-22,0,0]}],
    [1.1,{}]],'Struck from the right: twists away a step, then turns back in');
  KC('Heavy hit',1.8,[[0,{}],
    [.12,{HP:[0,-.19,-.12],h:[6,-14,0],sp:[-2,-4,0],ch:[-6,-6,0],hd:[-36,0,4],gR:[-.5,1.26,.32],gL:[.48,1.3,.36],wr:[-10,0,-30],wl:[-10,0,-30],jw:[.85]}],
    [.35,{HP:[0,-.25,-.3],h:[16,-14,0],sp:[8,-4,0],ch:[8,-6,0],hd:[-26,0,0],FR:[-.15,-.62,-22,.12,0],gR:[-.44,1.06,.42],gL:[.42,1.08,.46],jw:[.55]}],
    [.55,{HP:[0,-.29,-.42],h:[24,-10,0],sp:[14,-4,0],ch:[16,-6,0],FR:[-.15,-.72,-22,0,0],jw:[.45]}],
    [.8,{HP:[0,-.28,-.44],FL:[.15,-.08,14,.1,0],FR:[-.15,-.72,-22,0,0]}],
    [1.0,{HP:[0,-.27,-.44],FL:[.15,-.22,14,0,0],FR:[-.15,-.72,-22,0,0]}],
    [1.3,{HP:[0,-.27,-.24],FL:[.15,.04,16,.08,0],FR:[-.15,-.72,-22,0,0]}],
    [1.5,{HP:[0,-.26,-.14],FR:[-.15,-.72,-22,0,0]}],
    [1.62,{HP:[0,-.26,-.06],FR:[-.15,-.42,-22,.08,0]}],
    [1.8,{}]],'Knocked back two steps, then stalks in again');
  vsFalls(L,solve,extra);

  /* Rise from the ground: starts buried, the claws burst up out of the earth, slap down on either side
     and drag the body up; head, shoulders and chest come out, the right foot is planted at the rim, the left leg climbs out and it
     crouches into the war stance, hissing. Feet below the ground are IK feet with negative lift, so the legs fold naturally */
  {const FL0=VS_W.FL,FR0=VS_W.FR,dn=(F,l,z)=>[F[0],z===undefined?F[1]:z,F[2],l,0];
  const UP={h:[4,0,0],sp:[4,0,0],ch:[4,0,0],nk:[4,0,0],hd:[-6,0,0]};
  KC('Rise from the ground',5.4,[
    [0,wrP(UP,{HP:[0,-2.3,0],FL:dn(FL0,-2.08,.06),FR:dn(FR0,-2.08,-.06),gR:[-.28,-.6,.3],gL:[.28,-.6,.3],wr:[0,0,-10],wl:[0,0,-10],fist:[50,50],jw:[.1]})],
    [.3,wrP(UP,{HP:[0,-2.2,0],FL:dn(FL0,-1.98,.06),FR:dn(FR0,-1.98,-.06),gR:[-.29,-.4,.34],gL:[.29,-.38,.34],wr:[0,0,-10],wl:[0,0,-10],fist:[40,40],jw:[.1]})],
    [.62,wrP(UP,{HP:[0,-1.92,0],hd:[-2,0,0],FL:dn(FL0,-1.7,.06),FR:dn(FR0,-1.7,-.06),gR:[-.3,-.09,.38],gL:[.3,-.07,.38],wr:[-10,0,-36],wl:[-10,0,-36],fist:[0,0],jw:[.1]})],
    [.9,wrP(UP,{HP:[0,-1.88,0],hd:[-2,0,0],FL:dn(FL0,-1.66,.06),FR:dn(FR0,-1.66,-.06),gR:[-.32,-.05,.4],gL:[.32,-.03,.4],wr:[-10,0,-30],wl:[-10,0,-30],fist:[20,20],jw:[.1]})],
    [1.25,wrP(UP,{HP:[0,-1.62,0],h:[10,0,0],sp:[8,0,0],ch:[8,0,0],hd:[-12,0,0],FL:dn(FL0,-1.5,.06),FR:dn(FR0,-1.5,-.06),gR:[-.48,.05,.3],gL:[.48,.05,.32],wr:[20,0,10],wl:[20,0,10],fist:[50,50],jw:[.1]})],
    [1.95,wrP(UP,{HP:[0,-1.3,.02],h:[22,0,0],sp:[12,0,0],ch:[12,0,0],nk:[10,0,0],hd:[-26,0,0],FL:dn(FL0,-1.1,.06),FR:dn(FR0,-1.1,-.06),gR:[-.48,.05,.34],gL:[.48,.05,.36],wr:[24,0,14],wl:[24,0,14],fist:[55,55],jw:[.5]})],
    [2.65,wrP(UP,{HP:[0,-.98,.06],h:[42,0,0],sp:[16,0,0],ch:[14,0,0],nk:[16,0,0],hd:[-34,0,0],FL:dn(FL0,-.8,.06),FR:dn(FR0,-.8,-.06),gR:[-.42,.06,.4],gL:[.42,.06,.42],wr:[24,0,14],wl:[24,0,14],fist:[55,55],jw:[.3]})],
    [3.2,wrP(UP,{HP:[0,-.66,.12],h:[44,0,0],sp:[18,0,0],ch:[16,0,0],nk:[18,0,0],hd:[-36,0,0],FL:dn(FL0,-.5,.06),FR:[-.15,.3,-4,0,0],gR:[-.42,.06,.44],gL:[.42,.06,.46],wr:[24,0,14],wl:[24,0,14],fist:[55,55],jw:[.3]})],
    [3.6,wrP(UP,{HP:[0,-.46,.1],h:[40,0,0],sp:[18,0,0],ch:[18,0,0],nk:[20,0,0],hd:[-34,0,0],FL:dn(FL0,.14,.1),FR:[-.15,.3,-4,0,0],gR:[-.34,.48,.5],gL:[.34,.5,.52],wr:[10,0,-10],wl:[10,0,-10],fist:[20,20],jw:[.3]})],
    [4.0,{HP:[0,-.36,.06],h:[36,0,0],sp:[18,0,0],ch:[20,0,0],nk:[22,0,0],hd:[-32,0,0],FL:[FL0[0],FL0[1],FL0[2],0,0],FR:[-.15,.1,-20,.05,0],gR:[-.3,.74,.62],gL:[.28,.76,.64],jw:[.4]}],
    [4.4,{HP:[0,-.24,0],FR:[FR0[0],FR0[1],FR0[2],0,0],nk:[30,0,0],hd:[-16,0,0],jw:[1.1]}],
    [4.85,{HP:[0,-.2,0],nk:[30,0,0],hd:[-16,0,0],jw:[1.0]}],
    [5.4,{}]],'Starts buried: the claws burst out of the earth, it drags itself up out of the ground, climbs out and crouches into the war stance, hissing',
    {underground:true,next:'Idle (war mode)',
    /* the right knee points up while the foot is planted at the rim with the thigh near level (pointing it over the toes would roll the thigh) */
    add:(t,p)=>{const w=Math.max(0,Math.min(1,(t-2.7)/.5,(4.1-t)/.5));return w>0?Object.assign({},p,{nR:[-.07*(1-w),.8*w,1-.4*w]}):p;}});}
  return VS_CLIPS=L;}

/* Death and Rise: the wight's keyed falls (gbDeathKeys joint angles, dropped onto the lowest point every frame) on a bare spawn.
   Death starts in the war stance and ends face down; Rise starts from Death's last frame and ends in the war stance. */
function vsFalls(L,solve,extra){const B=VB.vspawn,k=B.legS,D2R=Math.PI/180,V=THREE.Vector3;
  const S0=solve(wrP(VS_W,{})),K0={X:[S0.pos[0]*k,S0.pos[2]*k],anc:[1,1],flat:[0,0],jaw:[VS_W.jw[0]/D2R]};
  for(const c of['h','sp','ch','nk','hd','tL','kL','aL','tR','kR','aR','uL','fL','wL','uR','fR','wR','fist'])K0[c]=S0[c].slice();
  const M=buildVampireSpawn(1,{bare:true}),JN={};M.traverse(q=>{if(q.userData.joint||q.name==='g_jaw')JN[q.name]=q;});
  const body=[];M.traverse(q=>{if(q.isMesh)body.push(q);});
  const corner=new V(),lowest=()=>{let y=1e9;for(const q of body){const p=q.geometry.parameters;for(let i=0;i<8;i++){corner.set((i&1?.5:-.5)*p.width,(i&2?.5:-.5)*p.height,(i&4?.5:-.5)*p.depth).applyMatrix4(q.matrixWorld);if(corner.y<y)y=corner.y;}}return y;};
  const pose=p=>{const P={};for(const c in p)if(JALIAS[c])P[JALIAS[c]]=p[c];const f=p.fist;P.fingers_L=[0,0,-f[0]];P.fingerTips_L=[0,0,-f[0]*.95];P.thumb_L=[f[0]*.15,0,-f[0]*.35];P.fingers_R=[0,0,f[1]];P.fingerTips_R=[0,0,f[1]*.95];P.thumb_R=[f[1]*.15,0,f[1]*.35];
    for(const j of RIG_JOINTS){const b=BASEPOSE[j]||[0,0,0],v=P[j]||[0,0,0];JN[j].rotation.set((b[0]+v[0])*D2R,(b[1]+v[1])*D2R,(b[2]+v[2])*D2R);}JN.g_jaw.rotation.set(p.jaw[0]*D2R,0,0);};
  const feet=()=>({L:JN.foot_L.getWorldPosition(new V()),R:JN.foot_R.getWorldPosition(new V())});
  const FC=(name,dur,f,note,o={})=>{let ref=null,full=[0,0];
    if(o.refEnd){const p=f(dur);pose(p);JN.hips.position.set(p.X[0],B.hipH,p.X[1]);M.updateMatrixWorld(true);ref=feet();}
    const fn=t=>{const p=f(t);
      for(const[i,sd]of[[0,'L'],[1,'R']]){const w=p.flat[i];if(w>0){const a=p['a'+sd].slice();a[0]=a[0]*(1-w)-(p.h[0]+p['t'+sd][0]+p['k'+sd][0])*w;p['a'+sd]=a;}}
      pose(p);JN.hips.position.set(p.X[0],B.hipH,p.X[1]);M.updateMatrixWorld(true);const ft=feet();if(!ref)ref={L:ft.L.clone(),R:ft.R.clone()};
      const wsum=p.anc[0]+p.anc[1];let cx=0,cz=0;if(wsum>1e-3){for(const[i,sd]of[[0,'L'],[1,'R']]){cx+=p.anc[i]*(ref[sd].x-ft[sd].x);cz+=p.anc[i]*(ref[sd].z-ft[sd].z);}cx/=wsum;cz/=wsum;}
      const w=Math.min(1,Math.max(p.anc[0],p.anc[1]));if(w>.999&&!o.refEnd)full=[cx,cz];const X=[p.X[0]+w*cx+(1-w)*full[0],p.X[1]+w*cz+(1-w)*full[1]];
      JN.hips.position.set(X[0],B.hipH,X[1]);M.updateMatrixWorld(true);const y=.005-lowest();
      const out={};for(const c in p)if(JALIAS[c]||c==='fist')out[c]=p[c];out.pos=[X[0]/k,y/k,X[1]/k];out.jaw=p.jaw;out.X=X;return out;};
    const c=sampleClip(name,dur,fn,{autoFeet:false,note,fps:60},B);extra(c,t=>fn(t).jaw[0]*D2R);
    if(o.next)c.next=o.next;L.push(c);return{c,fn};};
  /* Death: shudders, the claws curl, the knees give, drops onto the knees, then pitches forward face down, arms along its sides */
  const death=gbDeathKeys(K0,[
    [.2,{flat:[1,1],sp:[12,0,0],ch:[10,0,0],nk:[8,0,0],hd:[-44,0,8],uL:[-50,0,30],uR:[-50,0,-30],fL:[-50,0,0],fR:[-50,0,0],fist:[70,70],jaw:[60]},'out'],
    [.55,{h:[18,-4,0],sp:[16,0,0],ch:[20,0,0],nk:[12,0,0],hd:[-14,0,10],tL:[-40,0,4],kL:[86,0,0],tR:[-34,0,-6],kR:[80,0,0],uL:[-30,0,16],uR:[-30,0,-16],fL:[-30,0,0],fR:[-30,0,0],fist:[50,50],jaw:[34]}],
    [.85,{h:[16,-4,0],sp:[22,0,0],ch:[26,0,0],nk:[10,0,0],hd:[6,0,10],tL:[-16,0,4],kL:[104,0,0],tR:[-12,0,-4],kR:[102,0,0],flat:[0,0],aL:[44,0,0],aR:[44,0,0],anc:[0,0],X:[0,.08],uL:[-40,0,10],uR:[-40,0,-10]},'io'],
    [.95,{h:[20,-4,0]},'out'],
    [1.3,{h:[56,-2,-4],sp:[16,0,-4],ch:[14,0,0],nk:[-4,0,0],hd:[-10,10,0],tL:[-30,0,6],kL:[70,0,0],tR:[-26,0,-6],kR:[68,0,0],X:[0,.26],uL:[-80,0,20],fL:[-40,0,0],uR:[-80,0,-20],fR:[-40,0,0]},'in'],
    [1.56,{h:[90,0,-4],sp:[2,0,-2],ch:[0,0,0],nk:[-20,0,0],hd:[-24,4,0],tL:[-6,4,6],kL:[14,0,0],tR:[-6,-4,-6],kR:[14,0,0],aL:[50,0,0],aR:[50,0,0],X:[0,.66],
      uL:[-20,0,24],fL:[-20,0,0],wL:[0,0,0],uR:[-20,0,-24],fR:[-20,0,0],wR:[0,0,0],fist:[40,40]},'in'],
    [1.66,{h:[87,0,-4]},'out'],
    [2.4,{h:[90,0,-4],nk:[-20,0,0],hd:[-24,4,0],tL:[-4,4,6],kL:[10,0,0],tR:[-4,-4,-6],kR:[8,0,0],uL:[4,0,30],fL:[-12,0,0],wL:[0,-90,0],uR:[6,0,-30],fR:[-10,0,0],wR:[0,90,0],fist:[20,24],jaw:[40]},'out']]);
  const F=FC('Death',2.4,death,'Shudders, drops onto its knees and pitches forward face down, arms along its sides');
  const last=F.fn(2.4),RK={};for(const c of['h','sp','ch','nk','hd','tL','kL','aL','tR','kR','aR','uL','fL','wL','uR','fR','wR','fist'])RK[c]=death(2.4)[c].slice();
  RK.X=last.X.slice();RK.anc=[0,0];RK.flat=[0,0];RK.jaw=[40];
  const tw=(a,b)=>({fist:[a,b]}),rise=gbDeathKeys(RK,[
    [.25,tw(40,18)],[.45,tw(16,42)],[.6,tw(38,16)],[.8,{fist:[20,24],jaw:[10]}],
    [1.05,{uL:[0,90,80],fL:[-100,0,0],uR:[0,-90,-80],fR:[-100,0,0]}],
    [1.4,{nk:[-36,0,0],hd:[-34,10,0],uL:[-40,60,50],fL:[-80,0,0],wL:[0,0,0],uR:[-40,-60,-50],fR:[-80,0,0],wR:[0,0,0],fist:[10,10],X:[RK.X[0],RK.X[1]-.08]}],
    [1.75,{h:[62,0,0],sp:[6,0,0],ch:[6,0,0],nk:[-40,0,0],hd:[-24,0,0],tL:[-30,4,6],kL:[70,0,0],tR:[-30,-4,-6],kR:[70,0,0],aL:[60,0,0],aR:[60,0,0],
      uL:[-60,50,40],fL:[-60,0,0],uR:[-60,-50,-40],fR:[-60,0,0],fist:[20,20],jaw:[14],X:[RK.X[0]*.8,RK.X[1]-.36]}],
    [2.25,{h:[22,0,0],sp:[12,0,0],ch:[12,0,0],nk:[-14,0,0],hd:[-10,0,0],tL:[-20,0,6],kL:[96,0,0],tR:[-20,0,-6],kR:[96,0,0],uL:[-30,0,14],fL:[-30,0,0],uR:[-30,0,-14],fR:[-30,0,0],fist:[40,40],X:[RK.X[0]*.6,RK.X[1]*.5]}],
    [2.75,{h:[26,-4,0],tR:[-96,0,-6],kR:[104,0,0],aR:[0,0,0],flat:[0,1],anc:[0,1],X:[RK.X[0]*.4,RK.X[1]*.35]}],
    [3.25,{h:[30,-6,0],sp:[18,-2,0],ch:[20,-4,0],nk:[12,0,0],hd:[-24,0,0],tL:[-50,0,4],kL:[84,0,0],aL:[20,0,0],tR:[-74,0,-6],kR:[90,0,0],uL:[-50,0,20],fL:[-50,0,0],uR:[-50,0,-20],fR:[-50,0,0],fist:[30,30],flat:[.5,1],anc:[.5,1],X:[RK.X[0]*.15,RK.X[1]*.15]}],
    [3.8,Object.assign({},K0,{hd:[K0.hd[0],K0.hd[1]+20,0],jaw:[30]})],
    [4.0,Object.assign({},K0,{hd:[K0.hd[0],K0.hd[1]-16,0],jaw:[24]})],
    [4.5,K0]]);
  FC('Rise',4.5,rise,'Claws twitch, pushes up onto hands and knees, kneels, plants a foot and rises into the war stance',{refEnd:true,next:'Idle (war mode)'});}

ASSETS.push({id:'vampire-spawn',folder:'characters/enemies/undead',name:'Vampire spawn',kind:'character',variants:true,defaultSeed:1,groundR:2.4,build:(s,o)=>buildVampireSpawn(s,o||{}),
  opts:[{key:'skin',label:'Skin',choices:[['random','Random'],...Object.entries(VS_SKIN).map(([k,v])=>[k,v[1].charAt(0).toUpperCase()+v[1].slice(1)])],def:'random'},
    {key:'eyes',label:'Eyes',choices:[['random','Random'],['red','Red glow'],['amber','Amber glow'],['white','White glow']],def:'random'},
    {key:'clothes',label:'Clothes',choices:[['random','Random'],['rags','Torn grave shirt'],['bare','Bare chest']],def:'random'}],
  desc:'Vampire spawn: a feral, freshly risen vampire, about 1.8 m tall but always hunched (about 1.4 m): bald with a large round head and veins on the scalp, long pointed ears, glowing eyes, a hooked nose, two long fangs and a jaw that opens, a big hump on its back, gaunt limbs and big clawed hands and feet. Torn grave shirt or bare chest, ragged breeches, grave dirt on the shins. Clips: Idle, Walk, Run, war-mode Idle and Walk, Bite, Claw swipe, Leap & feed (leaps on its prey and sucks its blood), Hiss, Hit 1, Hit 2, Heavy hit, Death (face down), Rise, and Rise from the ground (claws its way up out of the ground).'});
