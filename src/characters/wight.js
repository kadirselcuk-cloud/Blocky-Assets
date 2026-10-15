/* ======================= WIGHT: a barrow-dead in a semi-crouch, attacking with both clawed hands =======================
   Human-sized (VB.wight is the villager male's proportions, about 1.8 m standing straight), but it never straightens: its stances
   crouch on bent knees with the back bowed and the head pushed forward, so it stands about 1.5 m tall. Built from its own meshes on
   the villager's 25 joints (so the warrior's leg and arm IK, wrSolve, fits unchanged). Gaunt grey body, long bony fingers with
   long black claws on both hands, glowing eyes, a lower jaw that opens (g_jaw, its own track per clip) and long hair.
   The hair is a set of chains (a back curtain and two front locks, each 2-5 segments) whose rotations are worked out after the
   clips are made (wtHairTracks): every frame each segment hangs towards the ground, trails a little behind fast moves and is
   pushed out of the head, torso, arms and the ground, so the hair drapes over the bowed back and never goes into the body.
   Death collapses the whole body (troll-style keyed falls, dropped onto its lowest point); Rise gets back up into the war stance. */
VB.wight=Object.assign({},VB.male,{sex:'male',g:1.45});
{const b=VB.wight;b.key='wight';b.hipH=b.thigh+b.shin+b.ankle+b.hipOff;b.legS=(b.thigh+b.shin)/.84;b.tS=(b.spine+b.chest)/.3;b.cS=b.neck/.22;}
const WT_SKIN={grey:['#9a9e98','pale grey'],blue:['#8692a0','corpse blue'],ash:['#a8a294','ashen'],dark:['#6e6a62','withered dark']};
const WT_EYES={ice:['#e8f6ff','#5ab4ec','icy blue glowing eyes'],green:['#e4fbe8','#4cd88a','pale green glowing eyes'],red:['#ffe0d8','#dc3a32','red glowing eyes']};
const WT_HAIRC={white:['#d8d6cc','white'],grey:['#8e8c86','grey'],black:['#24221f','black'],brown:['#4a3828','dark brown'],blond:['#a8946a','faded blond']};
/* hair length: back curtain and front locks (metres) */
const WT_HAIRL={shoulder:[.3,.2,'shoulder-length'],long:[.5,.34,'long'],verylong:[.74,.46,'very long']};
const WT_CLOTH={rags:'tattered burial tunic',mail:'rusted mail shirt over a tunic',bare:'bare chest, a torn loincloth and leg wraps'};
const WT_TUNIC=[['#3e4440','faded green'],['#433a46','faded purple'],['#4a4036','brown'],['#383c46','dark blue'],['#504c44','grey']];

function buildWight(seed,o={}){const B=VB.wight,r=mulberry32(((seed*2654435761)>>>0)^0x3e11),pick=a=>a[Math.floor(r()*a.length)],root=new THREE.Group();root.userData.lights=[];
  /* roll everything, then let the options override */
  const skin0=pick(Object.keys(WT_SKIN)),eye0=pick(['ice','ice','green','red']),hc0=pick(['white','white','grey','black','brown','blond']),hl0=pick(['long','long','verylong','shoulder']),
    hs0=pick(['full','full','thin']),cl0=pick(['rags','rags','mail','bare']),tun=pick(WT_TUNIC),circ=r()<.35,torn=r()<.5;
  const opt=(k,d)=>o[k]&&o[k]!=='random'?o[k]:d,skinK=opt('skin',skin0),eyeK=opt('eyes',eye0),hcK=opt('hairColour',hc0),hlK=opt('hairLength',hl0),hsK=opt('hairStyle',hs0),cloth=opt('clothes',cl0);
  const shade=(h,f)=>'#'+new THREE.Color(h).multiplyScalar(f).getHexString(),SK=WT_SKIN[skinK][0];
  const skin=bm(SK,'skin'),skinD=bm(shade(SK,.74),'skin'),skinX=bm(shade(SK,.52),'skin'),dark=bm('#16110f','plain'),claw=bm('#1c1814','plain'),teeth=bm('#bcb08a','plain');
  const ey=WT_EYES[eyeK],eyeM=wrGlow(ey[0],ey[1],1.6,pxTex('plain')),hairM=bm(WT_HAIRC[hcK][0],'hair'),hairD=bm(shade(WT_HAIRC[hcK][0],.78),'hair');
  const tunM=bm(tun[0],'cloth'),tunD=bm(shade(tun[0],.72),'cloth'),wrapM=bm('#6e6450','cloth'),wrapD=bm('#544c3c','cloth'),rope=vm('rope'),mail=bm('#6a5e50','plain'),mailD=bm('#4e4236','plain'),rust=bm('#7a4a2e','plain'),bronze=bm('#8a6a34','plain');
  const shirt=cloth!=='bare',isMail=cloth==='mail';
  /* colliders for the hair: the main boxes of head, torso and arms */
  const col=m=>{m.userData.hairCol=true;return m;};
  const hips=J('hips',root,0,B.hipH,0),spine=J('spine',hips,0,B.spine,0),chest=J('chest',spine,0,B.chest,0),neck=J('neck',chest,0,B.neck,0),head=J('head',neck,0,B.headY,0);
  /* pelvis: tunic skirt or loincloth, rope belt */
  col(bx(hips,.27,.17,.17,shirt?tunM:wrapM,0,0,0));bx(hips,.28,.03,.18,rope,0,.07,0);
  if(!shirt){bx(hips,.12,.14,.012,wrapD,0,-.12,.088);bx(hips,.12,.1,.012,wrapD,0,-.1,-.088);}
  /* belly: sunken waist */
  col(bx(spine,.235,.24,.15,shirt?tunM:skin,0,.07,0));
  if(shirt){for(const[x,L]of[[-.1,.05],[-.04,.07],[.03,.04],[.09,.06]])bx(spine,.04,L,.012,tunD,x,-.05-L/2,.077);if(isMail){bx(spine,.245,.2,.16,mail,0,.06,0);bx(spine,.25,.03,.165,mailD,0,-.03,0);}}
  else{for(const y of[.04,.1])for(const s of[-1,1])bx(spine,.05,.012,.01,skinD,s*.06,y,.077);}
  /* chest: narrow and bony, collarbones, spine knobs; tunic with a torn neckline, or rusted mail */
  col(bx(chest,.3,.25,.19,shirt?tunM:skin,0,.1,0));
  for(const s of[-1,1])bx(chest,.12,.025,.02,shirt?tunD:skinD,s*.07,.21,.09);
  if(shirt){bx(chest,.1,.06,.01,skinD,0,.2,.096);if(torn)bx(chest,.06,.05,.01,tunD,.08,.02,.097);
    if(isMail){bx(chest,.31,.22,.2,mail,0,.09,0);bx(chest,.315,.03,.205,mailD,0,.0,0);for(const s of[-1,1])bx(chest,.06,.05,.2,mail,s*.14,.2,0);bx(chest,.04,.03,.01,rust,-.07,.12,.101);bx(chest,.03,.05,.01,rust,.09,.05,.101);}}
  else{for(const y of[.0,.05,.1,.15])for(const s of[-1,1])bx(chest,.07,.014,.012,skinD,s*.08,y,.098);bx(chest,.02,.2,.008,skinD,0,.08,.098);}
  for(const y of[-.02,.05,.12,.19])bx(chest,.03,.03,.02,shirt?tunD:skinD,0,y,-.1);
  /* neck: thin, tendons */
  col(bx(neck,.08,.13,.08,skin,0,.015,-.005));for(const s of[-1,1])bx(neck,.014,.11,.012,skinD,s*.022,.01,.036);
  /* head: long gaunt skull, sunken cheeks, deep sockets with glowing eyes, a slit nose, thin lips drawn back over the upper teeth */
  col(bx(head,.2,.2,.22,skin,0,.15,0));bx(head,.15,.06,.06,skin,0,.075,.075);bx(head,.21,.035,.03,skinD,0,.18,.105);
  for(const s of[-1,1]){bx(head,.058,.048,.012,dark,s*.05,.145,.111);bx(head,.022,.02,.008,eyeM,s*.05,.143,.118);bx(head,.012,.075,.08,skinD,s*.1,.1,.06);
    bx(head,.02,.045,.034,skinD,s*.108,.13,-.005);}
  bx(head,.03,.045,.012,skinD,0,.11,.116);for(const s of[-1,1])bx(head,.01,.014,.008,dark,s*.008,.094,.121);
  bx(head,.12,.035,.07,dark,0,.06,.06);bx(head,.1,.018,.012,teeth,0,.064,.106);
  if(circ){bx(head,.212,.025,.232,bronze,0,.2,0);bx(head,.03,.035,.012,bronze,0,.2,.118);}
  const jw=new THREE.Group();jw.name='g_jaw';head.add(jw);jw.position.set(0,.07,0);jw.rotation.x=.1;
  bx(jw,.13,.035,.045,skin,0,-.045,.08);for(const s of[-1,1])bx(jw,.022,.05,.11,skin,s*.068,-.028,.03);bx(jw,.085,.016,.012,teeth,0,-.022,.099);bx(jw,.1,.012,.06,dark,0,-.03,.055);
  /* hair on the skull: a full cap, or a thinning crown with a fringe of hair round the back and sides */
  const full=hsK==='full';
  if(full){bx(head,.216,.05,.236,hairM,0,.24,0);bx(head,.216,.12,.04,hairM,0,.2,-.112);for(const s of[-1,1])bx(head,.024,.1,.16,hairM,s*.112,.19,-.03);bx(head,.16,.025,.03,hairD,0,.258,.08);}
  else{bx(head,.17,.016,.17,skinD,0,.256,0);bx(head,.216,.1,.04,hairM,0,.18,-.112);for(const s of[-1,1])bx(head,.024,.08,.13,hairM,s*.112,.18,-.04);
    for(const[x,z]of[[-.05,-.04],[.03,.02],[.06,-.07]])bx(head,.02,.02,.02,hairM,x,.27,z);}
  /* hanging hair: chains of segments (hair_<chain>_<i>), each hanging along its own -y; rotations come from wtHairTracks. grow = the
     direction (head frame) the hair leaves the skull in: the back curtain down the back of the head, the front locks down beside the face */
  const HL=WT_HAIRL[hlK],chains=[];
  const chain=(name,par,x,y,z,len,n,w,d,m,md,taper,grow)=>{let p=J(name+'_0',par,x,y,z);const segs=[];const L=len/n;
    for(let i=0;i<n;i++){if(i)p=J(name+'_'+i,p,0,-L,0);const f=1-taper*i/n;bx(p,w*f,L+.02,d,i%2?md:m,0,-L/2,0);if(!full)bx(p,w*f*.4,L*.6,d*.9,md,w*f*.25,-L*.6,d*.05);segs.push(p);}
    chains.push({name,segs,L,r:d/2+.01,grow});return segs;};
  const nB=Math.max(2,Math.round(HL[0]/.15)),nF=Math.max(2,Math.round(HL[1]/.12));
  chain('hair_B',head,0,.2,-.13,HL[0],nB,full?.2:.16,.04,hairM,hairD,.25,[0,-1,-.55]);
  for(const[sd,s]of[['L',1],['R',-1]])chain('hair_'+sd,head,s*.122,.17,.02,HL[1],nF,.035,full?.07:.05,hairM,hairD,.2,[s*.2,-1,.1]);
  root.userData.hairChains=chains;
  /* arms: thin upper arms and forearms, bony elbows, big hands with long fingers and long black claws */
  for(const[sd,s]of[['L',1],['R',-1]]){const sh=J('shoulder_'+sd,chest,s*B.shW*.325,.165*B.cS,0),ua=J('upperArm_'+sd,sh,s*B.shW*.675,0,0),fa=J('foreArm_'+sd,ua,0,-B.ua,0),hd=J('hand_'+sd,fa,0,-B.fa,0);
    const fg=J('fingers_'+sd,hd,0,-.15,0),ft=J('fingerTips_'+sd,fg,0,-.075,0),th=J('thumb_'+sd,hd,-s*.016,-.055,.085),so=J('socket_'+sd,hd,-s*.012,-.075,0);so.userData.socket=true;
    bx(ua,.088,.08,.095,shirt?tunM:skin,s*-.005,-.01,0);col(bx(ua,.066,.25,.066,skin,0,-.15,0));bx(ua,.072,.04,.074,skinD,0,-.275,-.006);
    if(shirt){bx(ua,.082,.12,.082,isMail?mail:tunM,0,-.06,0);bx(ua,.02,.06,.012,tunD,s*.02,-.15,.042);}
    col(bx(fa,.058,.23,.058,skin,0,-.12,0));bx(fa,.054,.03,.054,skinD,0,-.24,0);bx(fa,.01,.14,.008,skinX,0,-.12,.03);
    if(!shirt||sd==='L'){bx(fa,.064,.06,.064,wrapM,0,-.2,0);bx(fa,.066,.012,.066,wrapD,0,-.18,0);}
    /* very large clawed hand: a long, broad bony palm, four long fingers spread apart (about 2 cm gaps) and fanned slightly outwards,
       each finger its own piece (proximal in fingers_, distal in fingerTips_) ending in a long black claw of three tapering boxes that
       hooks towards the palm, and a big clawed thumb. The palm side is -s on x (the side the fingers curl to) */
    bx(hd,.07,.16,.15,skin,0,-.074,0);bx(hd,.072,.016,.152,skinD,0,-.142,0);for(const z of[-.057,-.019,.019,.057])bx(hd,.008,.12,.012,skinX,s*.033,-.075,z);
    const tip=(par,y,z,k=1)=>{bx(par,.019*k,.055*k,.019*k,claw,-s*.002,y,z);bx(par,.014*k,.05*k,.014*k,claw,-s*.008*k,y-.047*k,z,0,0,-s*.14);bx(par,.009*k,.045*k,.009*k,claw,-s*.016*k,y-.088*k,z,0,0,-s*.32);};
    /* fingers from the thumb side (+z): index, middle (the longest), ring, pinky (the shortest); k scales length, thickness and claw */
    for(const[z,k]of[[.057,.88],[.019,1.15],[-.019,.86],[-.057,.68]]){const w=.8+.2*k,fa=-z*3.4,Lp=.075*k,Ld=.06*k,g1=new THREE.Group(),g2=new THREE.Group();
      g1.position.set(0,0,z);g1.rotation.x=fa;fg.add(g1);g2.position.set(0,.075-Lp*Math.cos(fa),z-Lp*Math.sin(fa));g2.rotation.x=fa;ft.add(g2);
      bx(g1,.026*w,Lp,.025*w,skin,0,-Lp/2+.004,0);bx(g1,.028*w,.02,.027*w,skinD,0,-Lp+.006,0);bx(g2,.023*w,Ld,.022*w,skinD,0,-Ld/2,0);tip(g2,-Ld-.022*k,0,.75+.25*k);}
    /* thumb: two segments and a claw (about index-finger size), splayed away from the fingers so the hand reads open */
    const tg=new THREE.Group();tg.rotation.set(-.7,0,-s*.12);th.add(tg);bx(tg,.034,.056,.034,skin,0,-.024,.004);bx(tg,.032,.016,.032,skinD,0,-.053,.004);
    bx(tg,.029,.048,.029,skinD,0,-.08,.004);tip(tg,-.124,.004,.95);}
  /* legs: tunic hem or wraps over thin legs; the shins wrapped in strips; bare bony feet whose sole matches the IK foot */
  for(const[sd,s]of[['L',1],['R',-1]]){const th=J('thigh_'+sd,hips,s*B.hipW,-(B.hipOff+.01),0),sn=J('shin_'+sd,th,0,-B.thigh,0),ft=J('foot_'+sd,sn,0,-B.shin,0);
    bx(th,.1,.41,.105,skin,0,-.2,0);if(shirt){bx(th,.112,.12,.116,tunM,0,-.04,0);for(const[x,L]of[[-.03,.05],[.02,.08]])bx(th,.025,L,.012,tunD,x,-.1-L/2,.058);}
    bx(th,.106,.15,.11,wrapM,0,-.3,0);bx(th,.108,.015,.112,wrapD,0,-.26,0);
    bx(sn,.088,.06,.098,skinD,0,-.01,.004);bx(sn,.08,.36,.084,skin,0,-.2,0);bx(sn,.088,.26,.092,wrapM,0,-.2,0);for(const y of[-.1,-.18,-.26])bx(sn,.09,.014,.094,wrapD,0,y,0);
    /* long bony feet: heel to toe matches the IK foot of g 1.45 (-0.107 to 0.194, sole 0.07 below the ankle); four separate toes with
       claws that curve down over the toe tips and stay inside the IK toe point, so a toe-down foot never digs in */
    bx(ft,.08,.045,.085,skin,0,-.025,-.01);bx(ft,.098,.035,.25,skin,0,-.0525,.018);bx(ft,.07,.016,.12,skinD,0,-.03,.06);bx(ft,.05,.03,.03,skinD,0,-.055,-.09);
    for(const x of[-.034,-.011,.011,.034]){const L=Math.abs(x)>.02?.8:1,e=.143+.047*L;bx(ft,.02,.03,e-.14,skin,x,-.055,(e+.14)/2);bx(ft,.021,.01,.012,skinD,x,-.045,e-.03);
      bx(ft,.014,.016,.026,claw,x,-.046,e-.012);bx(ft,.009,.012,.012,claw,x,-.057,e+.002);}
  }
  const joints=[];root.traverse(q=>{if(q.userData.joint&&!q.userData.socket)joints.push(q);});root.userData.joints=joints;
  if(o.bare)return root;
  if(!o.noClips){root.userData.clips=wtHairTracks(root,wightClips(),hlK+':'+hsK);jw.rotation.x=.1;}
  root.userData.ground=1.6;
  const cap=s=>s.charAt(0).toUpperCase()+s.slice(1);
  root.userData.variantText=`${cap(WT_SKIN[skinK][1])} skin, ${ey[2]}; ${HL[2]} ${WT_HAIRC[hcK][1]} hair${full?'':', thinning on the crown'}${circ?', a bronze circlet':''}; ${WT_CLOTH[cloth]}${shirt?` (${tun[1]})`:''}. Attacks with both clawed hands.`;
  return root;}

/* ---------- hair ----------
   For every clip frame: pose the model, then lay each chain segment by segment. A segment wants to hang straight down, leaning
   away from the way its root is moving (follow-through); its end is pushed out of every collider box (inflated by the hair's
   half thickness) and kept above the ground, and the segment is turned to point at it, keeping its flat side facing the head. */
const WT_HAIR={};
function wtHairTracks(root,clips,key){if(WT_HAIR[key])return WT_HAIR[key];
  const V=THREE.Vector3,Q=THREE.Quaternion,M4=THREE.Matrix4,cols=[];root.traverse(q=>{if(q.isMesh&&q.userData.hairCol)cols.push(q);});
  const chains=root.userData.hairChains,head=root.getObjectByName('head'),mx=new THREE.AnimationMixer(root),inv=new M4(),lp=new V(),wp=new V();
  /* push p (world) out of every collider box; m = margin */
  const cv=new V(),lowY=s=>{let y=1e9;for(const q of s.children){if(!q.isMesh)continue;const g=q.geometry.parameters;for(let i=0;i<8;i++){cv.set((i&1?.5:-.5)*g.width,(i&2?.5:-.5)*g.height,(i&4?.5:-.5)*g.depth).applyMatrix4(q.matrixWorld);if(cv.y<y)y=cv.y;}}return y;};
  const pushOut=(p,m)=>{for(let it=0;it<3;it++){let moved=false;for(const c of cols){const g=c.geometry.parameters;inv.copy(c.matrixWorld).invert();lp.copy(p).applyMatrix4(inv);
      const hx=g.width/2+m,hy=g.height/2+m,hz=g.depth/2+m,dx=hx-Math.abs(lp.x),dy=hy-Math.abs(lp.y),dz=hz-Math.abs(lp.z);if(dx<=0||dy<=0||dz<=0)continue;
      if(dx<=dy&&dx<=dz)lp.x=Math.sign(lp.x||1)*hx;else if(dy<=dz)lp.y=Math.sign(lp.y||1)*hy;else lp.z=Math.sign(lp.z||1)*hz;p.copy(lp.applyMatrix4(c.matrixWorld));moved=true;}
    if(p.y<m+.015)p.y=m+.015;if(!moved)break;}return p;};
  /* lay one chain; vel = world velocity of the chain root. The first segments are stiff: they leave the skull along grow and only
     further down give in to gravity */
  const lay=(ch,vel)=>{const hq=head.getWorldQuaternion(new Q()),hx=new V(1,0,0).applyQuaternion(hq),hc=head.localToWorld(new V(0,.15,0));
    const gw=new V(...ch.grow).normalize().applyQuaternion(hq);let ci=0;
    for(const s of ch.segs){s.quaternion.set(0,0,0,1);s.updateMatrixWorld(true);const A=s.getWorldPosition(new V());
      const st=Math.max(0,1-ci/2.2),want=new V(0,-1,0).lerp(gw,st*.8).addScaledVector(vel,-.18);want.y=Math.min(want.y,-.2);want.normalize();ci++;
      /* full-length end along dir, pushed out; turn towards the pushed end and repeat. When pushed straight back (hair lying on the
         ground or a surface under it), slide sideways, away from the head */
      const dir=want.clone(),away=A.clone().sub(hc);away.y=0;if(away.lengthSq()<1e-6)away.set(0,0,-1);away.normalize();
      for(let k=0;k<5;k++){const E=A.clone().addScaledVector(dir,ch.L),P=pushOut(E.clone(),ch.r);if(P.distanceToSquared(E)<1e-8)break;const d2=P.sub(A);
        if(d2.length()<ch.L*.95)d2.addScaledVector(away,ch.L-d2.length());dir.copy(d2).normalize();}
      for(let k=0;k<2;k++){const M=A.clone().addScaledVector(dir,ch.L*.5),M2=pushOut(M.clone(),ch.r);if(M2.distanceToSquared(M)<1e-8)break;dir.copy(M2.sub(A)).normalize();}
      /* point the segment along dir; if a corner of its box is below the ground, first turn its flat side level, then lift the end */
      let flat=0;for(let k=0;k<10;k++){const Y=dir.clone().negate(),hf=hx.clone();hf.y*=1-flat;const X=hf.addScaledVector(Y,-hf.dot(Y));if(X.lengthSq()<1e-6)X.set(0,0,1).addScaledVector(Y,-Y.z);X.normalize();
        const Z=new V().crossVectors(X,Y),wq=new Q().setFromRotationMatrix(new M4().makeBasis(X,Y,Z)),pq=s.parent.getWorldQuaternion(new Q());s.quaternion.copy(pq.invert().multiply(wq));s.updateMatrixWorld(true);
        const lo=lowY(s);if(lo>=.02)break;if(flat<1){flat=Math.min(1,flat+.5);continue;}const E2=A.clone().addScaledVector(dir,ch.L);E2.y+=1.5*(.026-lo);E2.addScaledVector(away,3*(.026-lo));dir.copy(E2.sub(A)).normalize();}}};
  const out=[];
  for(const c0 of clips){const c=c0.clone();c.loopMode=c0.loopMode;for(const k of['note','speed','next'])if(c0[k]!==undefined)c[k]=c0[k];
    /* Death and Rise move fast near the ground: their hair is sampled at 60 fps */
    const T0=c.tracks[0].times,T=/^(Death|Rise)/.test(c.name)?Array.from({length:Math.round(c.duration*60)+1},(_,i)=>Math.min(c.duration,i/60)):T0,act=mx.clipAction(c);act.play();const roots=[],Qs=chains.map(ch=>ch.segs.map(()=>[]));
    const poseAt=t=>{act.time=t;mx.update(0);root.updateMatrixWorld(true);};
    for(const t of T){poseAt(t);roots.push(chains.map(ch=>ch.segs[0].getWorldPosition(new V())));}
    for(let i=0;i<T.length;i++){poseAt(T[i]);
      const a=c.loopMode?(i-1+T.length-1)%(T.length-1):Math.max(0,i-1),b=c.loopMode?(i+1)%(T.length-1):Math.min(T.length-1,i+1),dt=Math.max(1e-3,(b-a+(b<a?T.length-1:0))*(T[1]-T[0]));
      chains.forEach((ch,j)=>{const vel=roots[b][j].clone().sub(roots[a][j]).divideScalar(dt);if(vel.length()>3)vel.setLength(3);lay(ch,vel);ch.segs.forEach((s,k)=>Qs[j][k].push(s.quaternion.x,s.quaternion.y,s.quaternion.z,s.quaternion.w));});}
    act.stop();mx.uncacheAction(c);
    chains.forEach((ch,j)=>ch.segs.forEach((s,k)=>c.tracks.push(new THREE.QuaternionKeyframeTrack(s.name+'.quaternion',Array.from(T),Qs[j][k]))));out.push(c);}
  mx.uncacheRoot(root);return WT_HAIR[key]=out;}

/* ---------- clips ---------- */
let WT_CLIPS=null;
/* stances. Relaxed (WT_N): semi-crouch on bent knees, back bowed, head pushed forward, arms hanging with the claws by the knees.
   War (WT_W): lower and wider, left foot forward, both clawed hands raised in front, jaw open. Hand targets in metres (hips-relative x,z). */
const WT_N={HP:[0,-.14,-.02],h:[22,0,0],sp:[16,0,0],ch:[20,0,0],nk:[16,0,0],hd:[-22,0,0],FL:[.13,.05,14,0,0],FR:[-.13,-.05,-14,0,0],
  gR:[-.28,.66,.3],dR:[0,-.7,.7],pR:[-.5,-.3,-.8],gL:[.28,.66,.3],dL:[1,0,0],pL:[.5,-.3,-.8],wr:[0,0,-6],wl:[0,0,-6],fist:[30,30],jw:[.1]};
const WT_W=wrP(WT_N,{HP:[0,-.16,0],h:[26,0,0],sp:[16,0,0],ch:[18,0,0],nk:[20,0,0],hd:[-26,0,0],FL:[.15,.16,16,0,0],FR:[-.15,-.16,-22,0,0],
  gR:[-.25,.94,.74],dR:[-.1,.5,.86],pR:[-.8,-.5,-.3],gL:[.23,.96,.78],dL:[1,0,0],pL:[.8,-.5,-.3],wr:[12,0,-24],wl:[12,0,-24],fist:[10,10],jw:[.28]});
function wtRig(){const B=VB.wight,m=buildWight(1,{bare:true,hairStyle:'thin',hairLength:'shoulder'}),J={};m.traverse(q=>{if(q.userData.joint)J[q.name]=q;});return{m,J,B,two:false};}

function wightClips(){if(WT_CLIPS)return WT_CLIPS;const B=VB.wight,D=Math.PI*2,S=Math.sin,C=Math.cos,V=THREE.Vector3,Q=THREE.Quaternion,L=[],R=wtRig();
  /* hands are never aimed at a world direction: they follow the forearm, bent by the keyed wrist angles
     wr (right) and wl (left), both in the same terms: x tips the hand forward (>0) or back, y twist, z bends the claws back (<0) or curls them */
  /* hand targets are authored in the torso's frame: they turn about the hips with the body's total yaw (hips + spine + chest), so a
     twisting torso carries both arms with it and a free hand never ends up behind its shoulder */
  const yawF=p=>{const y=(p.h[1]+p.sp[1]+p.ch[1])*Math.PI/180,c=Math.cos(y),sn=Math.sin(y),rt=v=>[v[0]*c+v[2]*sn,v[1],-v[0]*sn+v[2]*c],o=Object.assign({},p);for(const k of['gR','gL'])o[k]=rt(p[k]);return o;};
  /* elbow poles are chosen, not keyed. Round the shoulder-to-hand line, every pole angle is scored: the upper arm's roll about its own
     bone (against a roll-free swing from hanging), an elbow pointing into the body, up (it should point a little down), far out or forward, and the distance from last frame's
     elbow (continuity, so nothing flips); the cheapest wins. The first solve places the body, the second solves the arms. */
  const restQ={L:new Q().setFromEuler(new THREE.Euler(0,0,BASEPOSE.upperArm_L[2]*Math.PI/180)),R:new Q().setFromEuler(new THREE.Euler(0,0,BASEPOSE.upperArm_R[2]*Math.PI/180))};
  /* a hand target never comes closer than WT_MIN to its shoulder (pushed out along the same line): a tightly folded arm has no stable elbow */
  const WT_MIN=.4;let PP=null;const M4=new THREE.Matrix4();
  const poles=p=>{R.m.updateMatrixWorld(true);const k=B.legS,o=Object.assign({},p),hp=(p.HP||[0,0,0]).map(v=>v*k),cq=R.J.chest.getWorldQuaternion(new Q()),up=new V(0,1,0),fw=new V(0,0,1).applyQuaternion(cq),nx={};
    for(const[sd,s]of[['L',1],['R',-1]]){const G=p['g'+sd],Sh=R.J['upperArm_'+sd].getWorldPosition(new V()),shW=R.J['shoulder_'+sd].getWorldQuaternion(new Q()),shq=shW.clone().invert(),sq=shW.clone().multiply(restQ[sd]);
      const T=new V(G[0]*k+hp[0],G[1]*k,G[2]*k+hp[2]).sub(Sh);if(T.length()<WT_MIN){T.setLength(WT_MIN);o['g'+sd]=[(Sh.x+T.x-hp[0])/k,(Sh.y+T.y)/k,(Sh.z+T.z-hp[2])/k];}const d=Math.min(T.length(),(B.ua+B.fa)*.999),u=T.normalize(),bone=new V(0,-1,0).applyQuaternion(sq),zr=new V(0,0,1).applyQuaternion(sq);
      const al=Math.acos(Math.min(1,Math.max(-1,(B.ua*B.ua+d*d-B.fa*B.fa)/(2*B.ua*d)))),inw=new V(-s,0,0).applyQuaternion(cq);
      const el0=new V(0,0,-1).applyQuaternion(sq).applyQuaternion(new Q().setFromUnitVectors(bone,u)),b1=el0.clone().addScaledVector(u,-el0.dot(u)).normalize(),b2=new V().crossVectors(u,b1);
      let prev=PP&&PP[sd]?PP[sd].clone().addScaledVector(u,-PP[sd].dot(u)):null;if(prev&&prev.lengthSq()<.04)prev=null;if(prev)prev.normalize();let best=null,bc=1e9;
      for(const lim of[.866,-2])if(!best)
      for(let i=0;i<96;i++){const f=i/96*2*Math.PI,pp=b1.clone().multiplyScalar(Math.cos(f)).addScaledVector(b2,Math.sin(f)),e=u.clone().multiplyScalar(Math.cos(al)).addScaledVector(pp,Math.sin(al));
        const Y=e.clone().negate(),Z=pp.clone().addScaledVector(e,-pp.dot(e)).normalize().negate(),lq=shq.clone().multiply(new Q().setFromRotationMatrix(M4.makeBasis(new V().crossVectors(Y,Z),Y,Z)));let r=Math.abs(2*Math.atan2(lq.y,lq.w));if(r>Math.PI)r=2*Math.PI-r;
        if(prev&&pp.dot(prev)<lim||pp.dot(inw)>.35)continue;const c=(r/1.4)**2+3*Math.max(0,pp.dot(inw)+.1)**2+3*Math.max(0,pp.dot(up)+.15)**2+1.5*Math.max(0,-pp.dot(inw)-.55)**2+2*Math.max(0,pp.dot(fw)-.2)**2+(prev?.5*(1-pp.dot(prev)):0);
        if(c<bc){bc=c;best=pp;}}
      if(!best)best=prev||el0;nx[sd]=best;o['p'+sd]=best.toArray();}
    PP=nx;return o;};
  const solve=p0=>{let p=yawF(p0);wrSolve(R,p);p=poles(p);const s=wrSolve(R,p);s.wR=[p.wr[0]*.4,p.wr[1],p.wr[2]];s.wL=[p.wl[0]*.4,-p.wl[1],-p.wl[2]];s.fist=p.fist;return s;};
  /* looping clips: one warm-up cycle first, so the elbows start where the cycle ends and the loop seam never flips an arm */
  const CC=(name,dur,fn,o={})=>{PP=null;if(o.loop)for(let i=0;i<Math.round(dur*30);i++)solve(fn(i/30));const c=sampleClip(name,dur,t=>solve(fn(t)),Object.assign({autoFeet:false},o),B);
    const T=c.tracks[0].times,JQ=[],q=new THREE.Quaternion(),e=new THREE.Euler();for(const t of T){q.setFromEuler(e.set(fn(t).jw[0],0,0));JQ.push(q.x,q.y,q.z,q.w);}
    c.tracks.push(new THREE.QuaternionKeyframeTrack('g_jaw.quaternion',Array.from(T),JQ));if(o.next)c.next=o.next;L.push(c);return c;};
  const KC=(name,dur,keys,note,base=WT_W)=>CC(name,dur,wrKeys(keys.map(k=>[k[0],wrP(base,k[1]||{})])),{note});
  const lift=(o,dy)=>{o.gR=[o.gR[0],o.gR[1]+dy,o.gR[2]];o.gL=[o.gL[0],o.gL[1]+dy,o.gL[2]];return o;};
  /* crouched IK gait in place: planted feet slide back at one steady speed, swinging feet come forward lifted; the hands ride with the hips */
  const GAIT=(name,dur,G,note)=>{const fn=t=>{const u=t/dur,o=G.body(u),c2=C(D*(u-G.duty/2));o.HP=[G.sw*c2,G.y0-G.b*C(2*D*(u-G.duty/2)),G.z0||0];lift(o,o.HP[1]-G.y0);
      for(const[sd,off,x,yaw]of[['L',0,G.x,G.yaw[0]],['R',.5,-G.x,G.yaw[1]]]){const q=(((u+off)%1)+1)%1;let z,l,pt;
        if(q<G.duty){const v=q/G.duty;z=G.s*(1-2*v);l=0;pt=v<.15?-10*(1-v/.15):v>.7?G.toe*(v-.7)/.3:0;}
        else{const v=(q-G.duty)/(1-G.duty),sm=v*v*(3-2*v);z=-G.s+2*G.s*sm;l=G.lift*Math.sin(Math.PI*Math.pow(v,G.lp||1));pt=G.toe*(1-v)*(1-v)-12*v*v;}
        o['F'+sd]=[x,z+(sd==='L'?1:-1)*(G.st||0),yaw,l,pt];}return o;};
    const sp=2*G.s/(G.duty*dur),c=CC(name,dur,fn,{loop:true,note:`${note}, in place, ${sp.toFixed(1)} m/s`});c.speed=sp;};
  /* arm swing: a = +1 when the left foot is forward (the left hand swings back) */
  const swing=(o,a,amp,y0,z0,x0)=>{o.gL=[x0,y0+.04*Math.abs(a),z0-amp*a];o.gR=[-x0,y0+.04*Math.abs(a),z0+amp*a];return o;};

  /* ---- relaxed ---- */
  /* Idle: crouched, slow breathing, the head turns and twitches, the claws flex */
  {const dur=5,tw=(t,t0,w)=>{const s=(t-t0)/w;return s<0||s>1?0:s<.15?s/.15:Math.pow(1-(s-.15)/.85,2);};
    CC('Idle',dur,t=>{const p=D*t/dur,b=S(p),b2=S(2*p),j1=tw(t,1.3,1.0),j2=tw(t,3.4,.8),cl=Math.max(0,S(3*p));
      return wrP(WT_N,{HP:[.008*b,-.17-.006*b2,-.02],h:[22+1.2*b2,0,1.5*b],sp:[16+b2,0,0],ch:[20+1.5*b2,2*b,0],hd:[-22+8*j2+2*S(3*p),34*S(p+.4)*.6+22*j1,10*j1-6*j2],
        gR:[-.28,.66+.012*b2,.3],gL:[.28,.66+.012*b2,.3],wr:[0,0,-6-14*cl],wl:[0,0,-6-14*Math.max(0,S(3*p+2))],fist:[30-20*Math.max(0,S(3*p+2)),30-20*cl],jw:[.1+.06*Math.max(0,S(5*p))+.2*j1]});},
      {loop:true,note:'Crouched, breathing; the head turns and twitches, the claws flex'});}
  GAIT('Walk',1.4,{duty:.64,s:.24,lift:.07,toe:16,x:.13,yaw:[12,-12],y0:-.19,b:.012,sw:.016,
    body:u=>{const yw=C(D*u),a=C(D*(u-.06));return swing(wrP(WT_N,{h:[24,-5*yw,2*S(D*u)],sp:[16,2*yw,0],ch:[20,4*yw,0],hd:[-22,-4*yw,0]}),a,.12,.66,.3,.28);}},'Stalking crouched walk, arms hanging');
  GAIT('Run',.8,{duty:.44,s:.42,lift:.15,lp:.8,toe:26,x:.13,yaw:[8,-8],y0:-.24,b:.03,sw:.02,
    body:u=>{const yw=C(D*u),a=C(D*(u-.04));return swing(wrP(WT_W,{h:[34,-6*yw,3*S(D*u)],sp:[16,3*yw,0],ch:[14,5*yw,0],nk:[20,0,0],hd:[-34,0,0],pR:[-.6,-.4,-.6],pL:[.6,-.4,-.6],wr:[20,0,-10],wl:[20,0,-10],fist:[30,30],jw:[.35]}),a,.28,.82,.32,.3);}},'Low loping run, leaning in, claws swinging');

  /* ---- war mode ---- */
  CC('Idle (war mode)',2.4,t=>{const p=D*t/2.4,b=S(p),c=S(2*p);return lift(wrP(WT_W,{HP:[.008*S(p),-.16-.008*b,0],sp:[16+b,0,0],ch:[18+1.4*b,0,0],hd:[-26+2*S(2*p+1),6*S(p),0],
    gR:[-.25,.94,.74+.03*c],gL:[.23,.96,.78-.03*c],wr:[12,0,-24-10*Math.max(0,c)],wl:[12,0,-24-10*Math.max(0,-c)],jw:[.28+.14*Math.max(0,S(2*p))]}),-.015*S(p+.6));},{loop:true,note:'Low and wide, both claws raised, hissing'});
  GAIT('Walk (war mode)',1.3,{duty:.66,s:.2,lift:.06,toe:16,x:.15,yaw:[16,-22],y0:-.2,b:.01,sw:.014,st:.08,
    body:u=>lift(wrP(WT_W,{h:[26,-4*C(D*u),2*S(D*u)],gR:[-.25,.94,.74+.04*C(D*u)],gL:[.23,.96,.78-.04*C(D*u)],jw:[.3]}),.015*C(2*D*u))},'Stalking forward, claws raised');

  /* ---- attacks: the two clawed hands ---- */
  /* claw swipes: the torso winds up and turns through the swipe, the hand (in the torso's frame) sweeps from out-and-up to across the front */
  const SW=(sd,s)=>{const g='g'+sd,o='g'+(sd==='R'?'L':'R'),w='w'+sd.toLowerCase(),F=sd==='R'?'FL':'FR',f0=sd==='R'?WT_W.FL:WT_W.FR,x=v=>[s*v[0],v[1],v[2]];
    const step=d=>[f0[0],f0[1]+d,f0[2],0,0],K=(t,q)=>{const r={};for(const c in q)r[c]=q[c];return[t,r];};
    return[[0,{}],
      K(.38,{HP:[0,-.23,-.04],h:[22,s*-14,0],sp:[14,s*-6,0],ch:[12,s*-12,0],hd:[-20,s*10,0],[g]:x([-.56,1.2,.42]),[o]:x([.3,.96,.76]),[w]:[-20,0,-35],jw:[.4]}),
      K(.52,{HP:[0,-.25,.04],h:[24,s*-8,0],sp:[15,s*-3,0],ch:[14,s*-6,0],[F]:[f0[0],f0[1]+.12,f0[2],.05,0],[g]:x([-.5,1.04,.58]),[o]:x([.3,.94,.74]),[w]:[-10,0,-30],jw:[.55]}),
      K(.72,{HP:[0,-.27,.1],h:[27,s*6,0],sp:[16,s*3,0],ch:[15,s*8,0],[F]:step(.24),[g]:x([-.2,.84,.74]),[o]:x([.3,.92,.72]),[w]:[10,0,5],jw:[.45]}),
      K(.92,{HP:[0,-.28,.12],h:[28,s*14,0],sp:[16,s*6,0],ch:[15,s*14,0],[F]:step(.24),[g]:x([.06,.78,.62]),[o]:x([.32,.92,.7]),[w]:[20,0,25],jw:[.3]}),
      K(1.06,{HP:[0,-.27,.11],h:[28,s*15,0],sp:[16,s*6,0],ch:[15,s*15,0],[F]:step(.24),[g]:x([.08,.76,.56]),[o]:x([.32,.94,.7]),[w]:[20,0,25],jw:[.3]}),
      K(1.24,{HP:[0,-.24,.04],h:[26,s*2,0],[F]:[f0[0],f0[1]+.1,f0[2],.04,0],[g]:x([-.26,.9,.7]),[w]:[12,0,-10]}),
      [1.46,{}]];};
  KC('Attack 1',1.46,SW('R',1),'Right claw: winds up and rakes across from the right, with a step in');
  KC('Attack 2',1.46,SW('L',-1),'Left claw: winds up and rakes across from the left, with a step in');
  KC('Attack 3',1.7,[[0,{}],
    [.55,{HP:[0,-.18,-.08],h:[10,-4,0],sp:[2,-2,0],ch:[-4,-2,0],nk:[10,0,0],hd:[-16,0,0],gR:[-.34,1.5,.26],wr:[-30,0,-40],gL:[.34,1.52,.3],wl:[-30,0,-40],fist:[0,0],jw:[.6]}],
    [.74,{HP:[0,-.24,.1],h:[20,-6,0],sp:[10,-2,0],ch:[6,-4,0],FR:[-.15,-.04,-22,.05,0],gR:[-.28,1.38,.58],wr:[-10,0,-30],gL:[.28,1.4,.62],wl:[-10,0,-30],fist:[0,0],jw:[.7]}],
    [.88,{HP:[0,-.3,.18],h:[32,-6,0],sp:[18,-2,0],ch:[14,-4,0],FR:[-.15,.06,-22,0,0],gR:[-.25,.9,.72],wr:[20,0,10],gL:[.25,.92,.76],wl:[20,0,10],fist:[20,20],jw:[.4]}],
    [1.02,{HP:[0,-.34,.2],h:[38,-6,0],sp:[20,-2,0],ch:[16,-4,0],FR:[-.15,.06,-22,0,0],gR:[-.25,.56,.6],wr:[25,0,30],gL:[.25,.58,.64],wl:[25,0,30],fist:[40,40],jw:[.25]}],
    [1.22,{HP:[0,-.33,.18],h:[36,-6,0],sp:[20,-2,0],ch:[16,-4,0],FR:[-.15,.06,-22,0,0],gR:[-.26,.6,.58],wr:[25,0,30],gL:[.26,.62,.62],wl:[25,0,30],fist:[40,40],jw:[.3]}],
    [1.42,{HP:[0,-.27,.06],h:[28,-6,0],FR:[-.15,-.08,-22,.04,0],gR:[-.32,.92,.58],gL:[.3,.96,.62]}],
    [1.7,{}]],'Both claws raised high and raked straight down together');
  {const LG={HP:[0,-.31,.3],h:[34,-4,0],sp:[18,0,0],ch:[12,0,0],hd:[-30,0,0],FL:[.15,.52,16,0,0],FR:[-.15,-.1,-22,0,0]};
  KC('Lunge & rake',2.1,[[0,{}],
    [.38,{HP:[0,-.3,-.08],h:[30,-4,0],sp:[18,0,0],ch:[16,0,0],hd:[-30,0,0],gR:[-.38,.86,.28],gL:[.36,.88,.32],wr:[0,0,-30],wl:[0,0,-30],fist:[0,0],jw:[.5]}],
    [.6,wrP(LG,{gR:[-.3,.94,.86],gL:[.28,.96,.9],wr:[10,0,-30],wl:[10,0,-30],fist:[0,0],jw:[.8]})],
    [.82,wrP(LG,{h:[34,6,0],sp:[18,3,0],ch:[12,6,0],gR:[-.12,.78,.84],gL:[.3,.94,.84],wr:[20,0,25],wl:[10,0,-30],fist:[40,0],jw:[.5]})],
    [1.04,wrP(LG,{h:[34,-6,0],sp:[18,-3,0],ch:[12,-6,0],gR:[-.3,.94,.84],gL:[.12,.78,.84],wr:[10,0,-30],wl:[20,0,25],fist:[0,40],jw:[.6]})],
    [1.26,wrP(LG,{h:[34,6,0],sp:[18,3,0],ch:[12,6,0],gR:[-.12,.78,.84],gL:[.3,.94,.84],wr:[20,0,25],wl:[10,0,-30],fist:[40,0],jw:[.45]})],
    [1.58,{HP:[0,-.27,.14],h:[28,-4,0],FL:[.15,.34,16,.05,0],gR:[-.34,.98,.6],gL:[.32,1.02,.64],wr:[10,0,-20],wl:[10,0,-20],jw:[.35]}],
    [2.1,{}]],'Lunges in and rakes right, left, right, then pulls back');}

  /* ---- voice and reactions ---- */
  KC('Shriek',2.4,[[0,{}],
    [.4,{HP:[0,-.28,0],h:[30,0,0],sp:[18,0,0],ch:[16,0,0],hd:[-4,0,0],gR:[-.32,.72,.4],gL:[.32,.72,.4],wr:[0,0,10],wl:[0,0,10],fist:[50,50],jw:[.15]}],
    [.78,{HP:[0,-.16,-.04],h:[8,0,0],sp:[-4,0,0],ch:[-10,0,0],nk:[-6,0,0],hd:[-30,0,0],gR:[-.62,1.3,.1],pR:[-.9,-.2,-.2],gL:[.62,1.3,.1],pL:[.9,-.2,-.2],wr:[-30,0,-40],wl:[-30,0,-40],fist:[0,0],jw:[1.0]}],
    [1.1,{HP:[0,-.16,-.04],h:[8,2,0],sp:[-4,0,0],ch:[-11,0,0],nk:[-6,0,0],hd:[-32,8,3],gR:[-.63,1.31,.09],pR:[-.9,-.2,-.2],gL:[.63,1.31,.09],pL:[.9,-.2,-.2],wr:[-30,0,-42],wl:[-30,0,-42],fist:[0,0],jw:[1.05]}],
    [1.45,{HP:[0,-.16,-.04],h:[8,-2,0],sp:[-4,0,0],ch:[-10,0,0],nk:[-6,0,0],hd:[-31,-8,-3],gR:[-.62,1.3,.1],pR:[-.9,-.2,-.2],gL:[.62,1.3,.1],pL:[.9,-.2,-.2],wr:[-30,0,-40],wl:[-30,0,-40],fist:[0,0],jw:[1.0]}],
    [1.8,{HP:[0,-.16,-.04],h:[8,0,0],sp:[-4,0,0],ch:[-10,0,0],nk:[-6,0,0],hd:[-30,4,0],gR:[-.62,1.3,.1],pR:[-.9,-.2,-.2],gL:[.62,1.3,.1],pL:[.9,-.2,-.2],wr:[-30,0,-40],wl:[-30,0,-40],fist:[0,0],jw:[.95]}],
    [2.1,{HP:[0,-.22,0],h:[20,0,0],hd:[-16,0,0],jw:[.4]}],
    [2.4,{}]],'Straightens a little, throws the head back and shrieks, claws spread wide');
  KC('Hit 1',.8,[[0,{}],
    [.1,{HP:[0,-.2,-.07],h:[10,-6,0],sp:[4,0,0],ch:[-6,0,0],nk:[6,0,0],hd:[-34,10,8],gR:[-.44,1.18,.36],gL:[.42,1.22,.4],wr:[-10,0,-30],wl:[-10,0,-30],jw:[.7]}],
    [.32,{HP:[0,-.22,-.04],h:[20,-6,0],sp:[12,-2,0],ch:[10,-4,0],hd:[-20,2,2],jw:[.45]}],
    [.8,{}]],'Head snaps back, jaw flies open');
  KC('Hit 2',1.1,[[0,{}],
    [.14,{HP:[.06,-.22,0],h:[22,22,-8],sp:[12,8,-6],ch:[8,14,-8],hd:[-20,18,-12],gR:[-.24,1.04,.66],gL:[.46,1.0,.6],wr:[-10,0,-30],wl:[-10,0,-30],jw:[.6]}],
    [.32,{HP:[.08,-.27,-.02],h:[26,12,-6],sp:[14,6,-4],ch:[14,8,-6],hd:[-22,8,-4],FL:[.19,.16,18,0,0],gR:[-.26,1.0,.46],gL:[.42,1.0,.42],jw:[.3]}],
    [.55,{HP:[.03,-.25,0],h:[26,2,0],FL:[.19,.16,18,0,0],FR:[-.17,-.2,-22,.05,0],jw:[.3]}],
    [.78,{HP:[0,-.23,0],FR:[-.15,-.18,-22,0,0]}],
    [1.1,{}]],'Struck from the right: twists away a step, then turns back in');
  KC('Heavy hit',1.8,[[0,{}],
    [.12,{HP:[0,-.18,-.12],h:[4,-14,0],sp:[-4,-4,0],ch:[-10,-6,0],hd:[-30,0,4],gR:[-.5,1.3,.3],gL:[.48,1.34,.34],wr:[-10,0,-30],wl:[-10,0,-30],jw:[.75]}],
    [.35,{HP:[0,-.24,-.3],h:[14,-14,0],sp:[6,-4,0],ch:[4,-6,0],hd:[-22,0,0],FR:[-.15,-.62,-22,.12,0],gR:[-.44,1.1,.4],gL:[.42,1.12,.44],jw:[.5]}],
    [.55,{HP:[0,-.28,-.42],h:[22,-10,0],sp:[12,-4,0],ch:[12,-6,0],FR:[-.15,-.72,-22,0,0],jw:[.4]}],
    [.8,{HP:[0,-.27,-.44],FL:[.15,-.08,14,.1,0],FR:[-.15,-.72,-22,0,0]}],
    [1.0,{HP:[0,-.26,-.44],FL:[.15,-.22,14,0,0],FR:[-.15,-.72,-22,0,0]}],
    [1.3,{HP:[0,-.26,-.24],FL:[.15,.04,16,.08,0],FR:[-.15,-.72,-22,0,0]}],
    [1.5,{HP:[0,-.25,-.14],FR:[-.15,-.72,-22,0,0]}],
    [1.62,{HP:[0,-.25,-.06],FR:[-.15,-.42,-22,.08,0]}],
    [1.8,{}]],'Knocked back two steps, then stalks in again');
  wtFalls(L,R,solve);
  return WT_CLIPS=L;}

/* Death and Rise: keys are joint angles (degrees) as wrSolve outputs them (gbDeathKeys), plus X (hip offset x,z in metres), anc (how
   firmly each foot stays where it stood) and flat (the foot stays level). Each frame a bare wight is posed and dropped onto its lowest
   point. Death starts in the war stance and ends face down; Rise starts from Death's last frame and ends in the war stance. */
function wtFalls(L,R,solve){const B=VB.wight,k=B.legS,D2R=Math.PI/180,V=THREE.Vector3;
  const S0=solve(wrP(WT_W,{}),false),K0={X:[S0.pos[0]*k,S0.pos[2]*k],anc:[1,1],flat:[0,0],jaw:[WT_W.jw[0]/D2R]};
  for(const c of['h','sp','ch','nk','hd','tL','kL','aL','tR','kR','aR','uL','fL','wL','uR','fR','wR','fist'])K0[c]=S0[c].slice();
  const M=buildWight(1,{bare:true,hairStyle:'thin',hairLength:'shoulder'}),JN={};M.traverse(q=>{if(q.userData.joint||q.name==='g_jaw')JN[q.name]=q;});
  const body=[];M.traverse(q=>{if(!q.isMesh)return;let p=q;while(p&&!/^hair_/.test(p.name))p=p.parent;if(!p)body.push(q);});
  const corner=new V(),lowest=()=>{let y=1e9;for(const q of body){const p=q.geometry.parameters;for(let i=0;i<8;i++){corner.set((i&1?.5:-.5)*p.width,(i&2?.5:-.5)*p.height,(i&4?.5:-.5)*p.depth).applyMatrix4(q.matrixWorld);if(corner.y<y)y=corner.y;}}return y;};
  const pose=p=>{const P={};for(const c in p)if(JALIAS[c])P[JALIAS[c]]=p[c];const f=p.fist;P.fingers_L=[0,0,-f[0]];P.fingerTips_L=[0,0,-f[0]*.95];P.thumb_L=[f[0]*.15,0,-f[0]*.35];P.fingers_R=[0,0,f[1]];P.fingerTips_R=[0,0,f[1]*.95];P.thumb_R=[f[1]*.15,0,f[1]*.35];
    for(const j of RIG_JOINTS){const b=BASEPOSE[j]||[0,0,0],v=P[j]||[0,0,0];JN[j].rotation.set((b[0]+v[0])*D2R,(b[1]+v[1])*D2R,(b[2]+v[2])*D2R);}};
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
    const c=sampleClip(name,dur,fn,{autoFeet:false,note},B);const T=c.tracks[0].times,Q=[],q=new THREE.Quaternion(),e=new THREE.Euler();
    for(const t of T){q.setFromEuler(e.set(fn(t).jaw[0]*D2R,0,0));Q.push(q.x,q.y,q.z,q.w);}c.tracks.push(new THREE.QuaternionKeyframeTrack('g_jaw.quaternion',Array.from(T),Q));
    if(o.next)c.next=o.next;L.push(c);return{c,fn};};
  /* Death: shudders, the claws curl, the knees give, drops onto the knees, then pitches forward face down, arms beside the head */
  const death=gbDeathKeys(K0,[
    [.2,{flat:[1,1],sp:[10,0,0],ch:[6,0,0],nk:[6,0,0],hd:[-38,0,8],uL:[-50,0,30],uR:[-50,0,-30],fL:[-50,0,0],fR:[-50,0,0],fist:[70,70],jaw:[55]},'out'],
    [.55,{h:[18,-4,0],sp:[14,0,0],ch:[16,0,0],nk:[10,0,0],hd:[-10,0,10],tL:[-40,0,4],kL:[86,0,0],tR:[-34,0,-6],kR:[80,0,0],uL:[-30,0,16],uR:[-30,0,-16],fL:[-30,0,0],fR:[-30,0,0],fist:[50,50],jaw:[30]}],
    [.85,{h:[16,-4,0],sp:[20,0,0],ch:[22,0,0],nk:[8,0,0],hd:[10,0,10],tL:[-16,0,4],kL:[104,0,0],tR:[-12,0,-4],kR:[102,0,0],flat:[0,0],aL:[44,0,0],aR:[44,0,0],anc:[0,0],X:[0,.08],uL:[-40,0,10],uR:[-40,0,-10]},'io'],
    [.95,{h:[20,-4,0]},'out'],
    [1.3,{h:[56,-2,-4],sp:[16,0,-4],ch:[14,0,0],nk:[-4,0,0],hd:[-6,16,0],tL:[-30,0,6],kL:[70,0,0],tR:[-26,0,-6],kR:[68,0,0],X:[0,.26],uL:[-80,0,20],fL:[-40,0,0],uR:[-80,0,-20],fR:[-40,0,0]},'in'],
    [1.56,{h:[90,0,-4],sp:[2,0,-2],ch:[0,0,0],nk:[-26,0,0],hd:[-24,60,0],tL:[-6,4,6],kL:[14,0,0],tR:[-6,-4,-6],kR:[14,0,0],aL:[50,0,0],aR:[50,0,0],X:[0,.66],
      uL:[-20,0,24],fL:[-20,0,0],wL:[0,0,0],uR:[-20,0,-24],fR:[-20,0,0],wR:[0,0,0],fist:[40,40]},'in'],
    [1.66,{h:[87,0,-4]},'out'],
    [2.4,{h:[90,0,-4],nk:[-28,0,0],hd:[-26,66,0],tL:[-4,4,6],kL:[10,0,0],tR:[-4,-4,-6],kR:[8,0,0],uL:[4,0,30],fL:[-12,0,0],wL:[0,-90,0],uR:[6,0,-30],fR:[-10,0,0],wR:[0,90,0],fist:[20,24],jaw:[34]},'out']]);
  const F=FC('Death',2.4,death,'Shudders, drops onto its knees and pitches forward face down, arms along its sides, palms down');
  /* Rise: the claws twitch, the hands are planted under the shoulders, it pushes up onto hands and knees, kneels, plants the right
     foot and stands up into the war stance */
  const last=F.fn(2.4),RK={};for(const c of['h','sp','ch','nk','hd','tL','kL','aL','tR','kR','aR','uL','fL','wL','uR','fR','wR','fist'])RK[c]=death(2.4)[c].slice();
  RK.X=last.X.slice();RK.anc=[0,0];RK.flat=[0,0];RK.jaw=[34];
  const tw=(a,b)=>({fist:[a,b]}),rise=gbDeathKeys(RK,[
    [.25,tw(40,18)],[.45,tw(16,42)],[.6,tw(38,16)],[.8,{fist:[20,24],jaw:[10]}],
    /* hands slide up beside the shoulders along the ground, elbows out, before the arms push: swinging a straight arm down under
       the body would prop it up in one jerk */
    [1.05,{uL:[0,90,80],fL:[-100,0,0],uR:[0,-90,-80],fR:[-100,0,0]}],
    [1.4,{nk:[-36,0,0],hd:[-30,10,0],uL:[-40,60,50],fL:[-80,0,0],wL:[0,0,0],uR:[-40,-60,-50],fR:[-80,0,0],wR:[0,0,0],fist:[10,10],X:[RK.X[0],RK.X[1]-.08]}],
    [1.75,{h:[62,0,0],sp:[6,0,0],ch:[6,0,0],nk:[-40,0,0],hd:[-24,0,0],tL:[-30,4,6],kL:[70,0,0],tR:[-30,-4,-6],kR:[70,0,0],aL:[60,0,0],aR:[60,0,0],
      uL:[-60,50,40],fL:[-60,0,0],uR:[-60,-50,-40],fR:[-60,0,0],fist:[20,20],jaw:[14],X:[RK.X[0]*.8,RK.X[1]-.36]}],
    [2.25,{h:[22,0,0],sp:[12,0,0],ch:[12,0,0],nk:[-14,0,0],hd:[-10,0,0],tL:[-20,0,6],kL:[96,0,0],tR:[-20,0,-6],kR:[96,0,0],uL:[-30,0,14],fL:[-30,0,0],uR:[-30,0,-14],fR:[-30,0,0],fist:[40,40],X:[RK.X[0]*.6,RK.X[1]*.5]}],
    [2.75,{h:[26,-4,0],tR:[-96,0,-6],kR:[104,0,0],aR:[0,0,0],flat:[0,1],anc:[0,1],X:[RK.X[0]*.4,RK.X[1]*.35]}],
    [3.25,{h:[30,-6,0],sp:[16,-2,0],ch:[18,-4,0],nk:[10,0,0],hd:[-20,0,0],tL:[-50,0,4],kL:[84,0,0],aL:[20,0,0],tR:[-74,0,-6],kR:[90,0,0],uL:[-50,0,20],fL:[-50,0,0],uR:[-50,0,-20],fR:[-50,0,0],fist:[30,30],flat:[.5,1],anc:[.5,1],X:[RK.X[0]*.15,RK.X[1]*.15]}],
    [3.8,Object.assign({},K0,{hd:[K0.hd[0],K0.hd[1]+20,0],jaw:[24]})],
    [4.0,Object.assign({},K0,{hd:[K0.hd[0],K0.hd[1]-16,0],jaw:[18]})],
    [4.5,K0]]);
  FC('Rise',4.5,rise,'Claws twitch, pushes up onto hands and knees, kneels, plants a foot and rises into the war stance',{refEnd:true});}

ASSETS.push({id:'wight',folder:'characters/enemies/undead',name:'Wight',kind:'character',variants:true,defaultSeed:1,groundR:1.6,build:(s,o)=>buildWight(s,o||{}),
  opts:[{key:'hairLength',label:'Hair length',choices:[['random','Random'],['shoulder','Shoulder-length'],['long','Long'],['verylong','Very long']],def:'random'},
    {key:'hairStyle',label:'Hair style',choices:[['random','Random'],['full','Full'],['thin','Thinning crown']],def:'random'},
    {key:'hairColour',label:'Hair colour',choices:[['random','Random'],...Object.entries(WT_HAIRC).map(([k,v])=>[k,v[1].charAt(0).toUpperCase()+v[1].slice(1)])],def:'random'},
    {key:'skin',label:'Skin',choices:[['random','Random'],...Object.entries(WT_SKIN).map(([k,v])=>[k,v[1].charAt(0).toUpperCase()+v[1].slice(1)])],def:'random'},
    {key:'eyes',label:'Eyes',choices:[['random','Random'],['ice','Icy blue glow'],['green','Pale green glow'],['red','Red glow']],def:'random'},
    {key:'clothes',label:'Clothes',choices:[['random','Random'],['rags','Tattered tunic'],['mail','Rusted mail shirt'],['bare','Bare chest']],def:'random'}],
  desc:'Wight: a barrow-dead, about 1.8 m tall but always in a semi-crouch (about 1.5 m): gaunt grey body, bowed back, head pushed forward, glowing eyes, a jaw that opens, long bony fingers with long black claws on both hands. Long hair that drapes over the back and hangs past the face (length, style and colour are options; it follows every move without going into the body). Tattered burial tunic, a rusted mail shirt or a bare chest; sometimes a bronze circlet. Attacks with both claws. Clips: Idle, Walk, Run, war-mode Idle and Walk, Attack 1 (right claw), Attack 2 (left claw), Attack 3 (both claws down), Lunge & rake, Shriek, Hit 1, Hit 2, Heavy hit, Death (falls face down) and Rise.'});
