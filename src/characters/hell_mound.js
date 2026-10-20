/* ======================= HELL MOUND: mound of tormented flesh (Enemies → Hell) =======================
   About 1.6 m: a slow, mindless heap of meat in endless agony. No legs and no feet: the lower body is a wide mound of fat rolls
   (lm_roll_0..2) on a snail-like muscular foot of seven segments (lm_ped_0..6) that trails out behind. It slides along on waves
   that ripple from the tail to the front. Out of the top rises a sagging torso with a hunched back, long flabby arms with three
   thick claws, and a half-melted head: drooping brow, one eye lower than the other, jowls, two nose slits and a gaping mouth
   whose lower jaw opens (g_jaw). Open sores, raw patches and pale fat show through the skin.
   Built on the villager's upper-body joints (no legs). Clips are pure FK: body joints as Euler angles, arms as swing-only
   rotations (a direction for the upper arm, a hinge for the elbow, a small keyed roll) so the arms can't twist about
   themselves. The mound groups get position, scale and rotation tracks: the upper rolls follow the hips part of the way,
   squash and jiggle, the foot ripples, and both flatten into a puddle when it melts (Death) and swell back (Rise). */
const LM_FLESH={raw:['#a07169','raw pink'],blood:['#7f4a46','blood red'],pallid:['#91837e','pallid grey'],bruised:['#6e545f','bruised purple']};
const LM_EYES={yellow:['#f8d9a2','#e4ae58',.7,'dull yellow eyes'],milky:['#d8d6ce',null,0,'milky blind eyes'],ember:['#ffe0bf','#dc664b',1.6,'ember-glowing eyes']};
/* foot segments [z, width, muscle height]; rolls [y, width, height, depth, z]; how far each roll follows the hips */
const LM_PED=[[.39,.82,.15],[.22,1,.2],[.05,1.07,.22],[-.12,1.05,.21],[-.29,.94,.18],[-.46,.76,.14],[-.61,.5,.1]];
const LM_ROLL=[[.2,1.08,.26,.96,0],[.45,.92,.22,.8,.01],[.65,.74,.16,.64,.02]],LM_K=[.2,.45,.75],LM_HIP=.72;
/* the left arm is long (it nearly drags), the right one short and stunted: [upper arm, forearm] */
const LM_ARM={L:[.38,.34],R:[.24,.2]};

function buildHellMound(seed,o={}){const r=mulberry32(((seed*2654435761)>>>0)^0x5e3a),pick=a=>a[Math.floor(r()*a.length)],root=new THREE.Group();root.userData.lights=[];
  const flesh0=pick(['raw','raw','blood','pallid','bruised']),eye0=pick(['yellow','yellow','milky','ember']),drool=r()<.6,lump=r()<.5,burn=r()<.35,hunchL=r()<.5,sores=Math.floor(r()*1e6);
  const opt=(k,d)=>o[k]&&o[k]!=='random'?o[k]:d,fleshK=opt('flesh',flesh0),eyeK=opt('eyes',eye0);
  const shade=(h,f)=>'#'+new THREE.Color(h).multiplyScalar(f).getHexString(),mix=(a,b,f)=>'#'+new THREE.Color(a).lerp(new THREE.Color(b),f).getHexString(),FL=LM_FLESH[fleshK][0];
  const skin=bm(FL,'skin'),skinD=bm(shade(FL,.8),'skin'),skinX=bm(shade(FL,.55),'skin'),raw=bm(mix(FL,'#874a4a',.45),'skin'),fat=bm(mix(FL,'#bcad8e',.6),'skin'),
    sole=bm(shade(mix(FL,'#65584e',.3),.6),'plain'),sore=bm('#3c2120','plain'),pus=bm('#afa160','plain'),scab=bm('#261615','plain'),mouth=bm('#150c0b','plain'),
    teeth=bm('#aba186','plain'),claw=bm('#392b22','plain'),drl=bm('#d7d0be','plain'),soot=bm('#292222','plain'),bruise=bm(mix(shade(FL,.7),'#483246',.35),'skin');
  const ey=LM_EYES[eyeK],eyeM=ey[1]?wrGlow(ey[0],ey[1],ey[2],pxTex('plain')):bm(ey[0],'plain');
  const rs=mulberry32(sores);
  /* a sore: dark pit with a rim of raw flesh and sometimes a bead of pus; n = face normal (unit axis) */
  const sorePatch=(g,x,y,z,n,s)=>{const t=.012,w=s*(1+rs()*.6),h=s*(.7+rs()*.6);
    const B=(ww,hh,dd,m,o)=>n[0]?bx(g,dd,hh,ww,m,x+n[0]*o,y,z):n[2]?bx(g,ww,hh,dd,m,x,y,z+n[2]*o):bx(g,ww,dd,hh,m,x,y+n[1]*o,z);
    B(w+.03,h+.03,t,raw,t/2);B(w,h,t,sore,t);if(rs()<.5)B(w*.35,h*.35,t,pus,t*1.5);};
  /* ---- the foot: seven segments from the front to the trailing tail, a slimy sole under a muscular top ---- */
  LM_PED.forEach(([z,w,h],i)=>{const g=new THREE.Group();g.name='lm_ped_'+i;g.position.set(0,0,z);root.add(g);
    bx(g,w,.1,.18,sole,0,.05,0);bx(g,w*.88,h,.17,i%2?skinD:skin,0,.09+h/2,0);
    if(i===0){bx(g,w*.72,.08,.07,sole,0,.04,.11);bx(g,w*.62,h*.7,.06,skin,0,.08+h*.35,.1);}
    if(i===LM_PED.length-1){bx(g,w*.6,.06,.12,sole,0,.03,-.13);bx(g,w*.4,.05,.1,skinD,0,.08,-.12);}
    if(i>0&&i<6&&rs()<.45)sorePatch(g,(rs()<.5?1:-1)*w*.44,.09+h*.5,0,[rs()<.5?1:-1,0,0],.03);});
  /* ---- three fat rolls, each sagging over the one below with a dark crease where they meet ---- */
  LM_ROLL.forEach(([y,w,h,d,z],i)=>{const g=new THREE.Group();g.name='lm_roll_'+i;g.position.set(0,y,z);root.add(g);
    bx(g,w,h,d,skin,0,h/2,0);bx(g,w+.1,h*.5,d+.1,i===1?skinD:skin,0,h*.32,0);bx(g,w+.115,.02,d+.115,skinX,0,.012,0);
    if(i<2){bx(g,w*.5,h*.4,.02,fat,w*.15,h*.4,d/2+.055);bx(g,.02,h*.35,d*.4,fat,-(w/2+.055),h*.35,-d*.1);}
    /* lobes bulging out of the roll, so no two rolls line up */
    for(let k=0;k<4;k++){const an=(k/4+rs()*.2+i*.2)*Math.PI*2,lw=.22+rs()*.16,lh=h*(.65+rs()*.35),cx=Math.sin(an),cz=Math.cos(an);
      bx(g,lw,lh,lw*.8,k%2?skinD:skin,cx*(w/2+.02),lh/2+.01,cz*(d/2+.02),0,an,0);bx(g,lw+.02,.018,lw*.8+.02,skinX,cx*(w/2+.02),.012,cz*(d/2+.02),0,an,0);}
    /* folds of flesh dripping from the overhang onto the roll below */
    if(i>0)for(let k=0;k<4;k++){const an=(k/4+rs()*.2)*Math.PI*2,cx=Math.sin(an),cz=Math.cos(an),dh=.05+rs()*.07;
      bx(g,.09+rs()*.08,dh,.05,skin,cx*(w/2+.055),-dh/2+.02,cz*(d/2+.055),0,an,0);}
    /* bruised mottling */
    for(let k=0;k<3;k++){const an=rs()*Math.PI*2,bw=.1+rs()*.12;bx(g,bw,h*(.25+rs()*.25),.012,bruise,Math.sin(an)*(w/2+.051),h*(.3+rs()*.2),Math.cos(an)*(d/2+.051),0,an,0);}
    const ns=i===0?4:i===1?3:2;for(let k=0;k<ns;k++){const f=rs(),side=f<.45?[0,0,1]:f<.7?[1,0,0]:f<.9?[-1,0,0]:[0,0,-1],o2=(rs()-.5)*.6;
      const px=side[0]?side[0]*(w/2+.05):o2*w,pz=side[2]?side[2]*(d/2+.05):o2*d;sorePatch(g,px,h*(.6+rs()*.25),pz,side,.035+rs()*.02);}
    if(burn&&i===0){bx(g,.2,.1,.02,soot,-w*.25,h*.4,d/2+.056);bx(g,.12,.06,.022,scab,-w*.22,h*.45,d/2+.057);}});
  /* ---- torso ---- */
  const hips=J('hips',root,0,LM_HIP,0),spine=J('spine',hips,0,.14,0),chest=J('chest',spine,0,.16,0),neck=J('neck',chest,0,.26,.12),head=J('head',neck,0,.08,0);
  bx(hips,.64,.18,.54,skin,0,0,0);bx(hips,.68,.06,.58,skinD,0,-.04,0);
  bx(spine,.7,.26,.56,skin,0,.06,0);bx(spine,.6,.14,.16,skin,0,-.03,.24);bx(spine,.61,.018,.17,skinX,0,-.095,.24);bx(spine,.36,.14,.02,fat,.04,.03,.285);
  for(const s of[-1,1]){bx(spine,.08,.16,.44,skinD,s*.38,-.01,0);bx(spine,.085,.016,.45,skinX,s*.38,-.085,0);}
  sorePatch(spine,-.14,.1,.29,[0,0,1],.03);sorePatch(spine,.42,.04,-.05,[1,0,0],.03);
  bx(chest,.66,.3,.46,skin,0,.14,0);bx(chest,.5,.15,.12,skinD,0,.2,-.24);bx(chest,.28,.1,.1,skin,-.08,.29,-.21);
  for(const s of[-1,1]){bx(chest,.26,.13,.08,skin,s*.15,.07,.24);bx(chest,.26,.018,.085,skinX,s*.15,.012,.24);}
  sorePatch(chest,.15,.2,.23,[0,0,1],.035);sorePatch(chest,-.05,.12,-.23,[0,0,-1],.04);sorePatch(chest,-.33,.16,.02,[-1,0,0],.03);
  /* ---- head: half melted. The left side slumps lower, the jowls sag past the jaw, a gaping hole of a mouth ---- */
  bx(neck,.2,.12,.2,skin,0,.03,0);bx(neck,.24,.04,.2,skinD,0,-.02,.02);
  /* a fleshy collar the head sinks into, a lump of flesh over one shoulder, folds dripping from the belly */
  bx(chest,.52,.08,.38,skin,0,.29,.03);bx(chest,.54,.02,.4,skinX,0,.25,.03);bx(chest,.22,.14,.22,skinD,(hunchL?1:-1)*.22,.32,-.06);bx(chest,.13,.08,.13,skin,(hunchL?1:-1)*.26,.4,-.07);
  for(const[x,h]of[[-.18,.12],[.02,.09],[.2,.1]])bx(spine,.09,h,.05,skin,x,-.1-h/2+.02,.3);
  bx(head,.28,.24,.27,skin,0,.13,0);bx(head,.22,.05,.22,skin,.01,.265,-.01);
  if(lump){bx(head,.11,.06,.11,skinD,-.06,.28,-.04);bx(head,.06,.04,.07,skin,.07,.27,.05);}
  bx(head,.14,.05,.065,skinD,.06,.19,.125,0,0,-.08);bx(head,.14,.05,.065,skinD,-.065,.165,.125,0,0,.3);
  bx(head,.065,.05,.012,mouth,.065,.145,.135);bx(head,.03,.025,.01,eyeM,.06,.142,.142);
  bx(head,.06,.045,.012,mouth,-.07,.115,.135);bx(head,.026,.02,.01,eyeM,-.068,.112,.142);bx(head,.07,.03,.03,skinD,-.072,.09,.13);
  bx(head,.06,.045,.03,skin,0,.1,.145);for(const s of[-1,1])bx(head,.012,.022,.01,mouth,s*.013,.09,.161);
  bx(head,.32,.11,.21,skin,0,.03,.03);bx(head,.1,.09,.12,skinD,.13,-.02,.05);bx(head,.1,.12,.12,skinD,-.135,-.035,.05);
  bx(head,.17,.07,.02,mouth,0,.045,.138);bx(head,.19,.02,.04,raw,0,.075,.135);for(const x of[-.05,-.015,.03])bx(head,.018,.025,.012,teeth,x,.06,.146);
  bx(head,.15,.06,.1,mouth,0,.04,.09);sorePatch(head,-.14,.16,0,[-1,0,0],.025);
  const jw=new THREE.Group();jw.name='g_jaw';head.add(jw);jw.position.set(0,.02,-.02);
  bx(jw,.22,.06,.2,skin,0,-.04,.06);bx(jw,.16,.03,.05,raw,0,-.008,.15);bx(jw,.14,.012,.12,mouth,0,-.005,.08);for(const x of[-.04,.0,.045])bx(jw,.016,.022,.012,teeth,x,.01,.155);
  bx(jw,.2,.04,.1,skinD,0,-.08,.06);if(drool){bx(jw,.014,.07,.014,drl,.04,-.06,.165);bx(jw,.02,.02,.02,drl,.04,-.1,.165);}
  /* ---- arms: long and flabby, the skin hanging under the upper arm; big hands with three thick claws and a thumb ---- */
  for(const[sd,s]of[['L',1],['R',-1]]){const[UA,FA]=LM_ARM[sd],sh=J('shoulder_'+sd,chest,s*.27,.21,0),ua=J('upperArm_'+sd,sh,s*.08,0,0),fa=J('foreArm_'+sd,ua,0,-UA,0),hd=J('hand_'+sd,fa,0,-FA,0);
    const fg=J('fingers_'+sd,hd,0,-.085,0),ft=J('fingerTips_'+sd,fg,0,-.06,0),th=J('thumb_'+sd,hd,-s*.03,-.03,.035),so=J('socket_'+sd,hd,0,-.06,0);so.userData.socket=true;
    bx(sh,.22,.19,.24,skin,s*.03,0,0);bx(ua,.19,.16,.19,skin,0,-.03,0);bx(ua,.16,UA,.16,skin,0,-UA/2,0);bx(ua,.11,UA*.6,.08,skinD,0,-UA*.55,-.11);bx(ua,.12,.016,.09,skinX,0,-UA*.25,-.11);bx(ua,.165,.016,.165,skinX,0,-UA*.7,0);
    bx(fa,.16,.1,.16,skinD,0,-.01,0);bx(fa,.14,FA,.14,skin,0,-FA/2,0);bx(fa,.1,FA*.45,.05,skinD,0,-FA*.35,-.085);if(s>0)sorePatch(fa,0,-FA*.5,.07,[0,0,1],.025);else sorePatch(ua,-.08,-UA*.4,0,[-1,0,0],.025);
    bx(hd,.075,.1,.12,skin,0,-.045,0);
    for(const z of[-.035,0,.035]){bx(fg,.032,.065,.03,skin,0,-.03,z);bx(ft,.026,.05,.024,skinD,0,-.02,z);bx(ft,.018,.035,.018,claw,-s*.004,-.055,z,0,0,s*.2);}
    bx(th,.03,.05,.03,skin,0,-.02,0,.4,0,0);bx(th,.02,.03,.02,claw,0,-.055,.012,.5,0,0);}
  const joints=[];root.traverse(q=>{if(q.userData.joint&&!q.userData.socket)joints.push(q);});root.userData.joints=joints;
  if(!o.noClips){root.userData.clips=hellMoundClips();const mx=new THREE.AnimationMixer(root);mx.clipAction(root.userData.clips[0]).play();mx.update(0);}
  root.userData.ground=1.4;
  const cap=s=>s.charAt(0).toUpperCase()+s.slice(1);
  root.userData.variantText=`${cap(LM_FLESH[fleshK][1])} flesh, ${ey[3]}${lump?', a lumpy skull':''}${drool?', drooling':''}${burn?', a burnt patch':''}.`;
  return root;}

/* ---------- clips ----------
   Pose channels (metres and degrees):
   HP hip offset [x,y,z]; h/sp/ch/nk/hd body joint angles [pitch (forward +), yaw (to its left +), roll]; sL/sR shoulder shrug;
   aL/aR upper arm [forward, outward, roll]: the arm's direction (swung forward from hanging, then outward), the same signs for
   both sides; eL/eR elbow bend; wL/wR wrist [bend, sideways]; fs claw curl [L,R] (negative spreads); jw jaw open;
   md mound [lunge forward m, shift left m, squash (+ squashes and spreads, − stretches up)]; jg jiggle of the rolls;
   pw pedal wave strength (the slide); mt melt 0..1 (the rolls and the foot flatten into a puddle). */
const LMCLIPS={};
const LM_H={HP:[0,0,0],h:[0,0,0],sp:[8,0,0],ch:[12,0,0],nk:[10,0,0],hd:[-6,0,8],sL:[0,0,0],sR:[0,0,0],aL:[34,24,0],aR:[32,24,0],eL:[30],eR:[34],wL:[10,0],wR:[10,0],
  fs:[30,30],jw:[8],md:[0,0,0],jg:[.3],pw:[0],mt:[0]};
/* war mode: hunched forward, both claws raised and spread, mouth open in a wail */
const LM_W=wrP(LM_H,{h:[6,0,0],sp:[12,0,0],ch:[10,0,0],nk:[6,0,0],hd:[-20,0,4],aL:[78,30,0],aR:[78,30,0],eL:[48],eR:[48],wL:[-15,0],wR:[-15,0],fs:[-12,-12],jw:[26],jg:[.4],md:[.02,0,.1]});

function hellMoundClips(){if(LMCLIPS.all)return LMCLIPS.all;const D=Math.PI*2,R2=Math.PI/180,S=Math.sin,C=Math.cos,V=THREE.Vector3,Q=THREE.Quaternion,E3=THREE.Euler,L=[];
  const DN=new V(0,-1,0),Y=new V(0,1,0),X=new V(1,0,0),eq=(a,o='XYZ')=>new Q().setFromEuler(new E3(a[0]*R2,a[1]*R2,a[2]*R2,o));
  /* swing-only upper arm: no roll about the bone except the keyed one */
  const armQ=(s,a)=>{const f=a[0]*R2,o=a[1]*R2,d=new V(s*S(o),-C(o)*C(f),C(o)*S(f));return new Q().setFromUnitVectors(DN,d).multiply(new Q().setFromAxisAngle(Y,s*a[2]*R2));};
  const solve=(p,t,o)=>{const T={},q=(n,v)=>{(T[n]||(T[n]={})).q=v.toArray();},ps=(n,v)=>{(T[n]||(T[n]={})).p=v;},sc=(n,v)=>{(T[n]||(T[n]={})).s=v;};
    const mt=p.mt[0],HP=p.HP,md=p.md,sq=md[2];
    ps('hips',[HP[0],LM_HIP+HP[1],HP[2]]);sc('hips',[1-.2*mt,1-.2*mt,1-.2*mt]);q('hips',eq(p.h));q('spine',eq(p.sp));q('chest',eq(p.ch));q('neck',eq(p.nk));q('head',eq(p.hd));
    q('g_jaw',new Q().setFromAxisAngle(X,p.jw[0]*R2));
    for(const[sd,s]of[['L',1],['R',-1]]){const sh=p['s'+sd];q('shoulder_'+sd,eq([sh[0],s*sh[1],s*sh[2]]));q('upperArm_'+sd,armQ(s,p['a'+sd]));
      q('foreArm_'+sd,new Q().setFromAxisAngle(X,-p['e'+sd][0]*R2));const w=p['w'+sd];q('hand_'+sd,eq([w[0],0,s*w[1]]));
      const f=p.fs[sd==='L'?0:1]*-s;q('fingers_'+sd,eq([0,0,f]));q('fingerTips_'+sd,eq([0,0,f*.95]));q('thumb_'+sd,eq([-s*f*.15,0,f*.35]));}
    /* the foot: waves run from the tail to the front; it flattens and spreads as it melts */
    const pp=D*t/(o.pT||2.4),jf=D*(o.jf||2.6)*t;
    LM_PED.forEach(([z],i)=>{const w=Math.max(0,S(pp+i*.9)),c=C(pp+i*.9);
      ps('lm_ped_'+i,[md[1]*.05*i/6,0,z*(1+.18*mt)+p.pw[0]*.022*c+md[0]*.15*(1-i/6)]);
      sc('lm_ped_'+i,[1+.04*p.pw[0]*w+.22*mt+.05*sq,(1+.3*p.pw[0]*w-.04*p.pw[0])*(1-.5*mt)*(1-.06*sq),1+.06*p.pw[0]*c]);});
    /* the rolls follow the hips part of the way, lean with the body, squash, jiggle; they spread and sink as it melts */
    LM_ROLL.forEach(([y,w,h,d,z],i)=>{const k=LM_K[i],j=p.jg[0]*.035*S(jf-i*1.2),lean=S(p.h[0]*R2)*.12*k;
      ps('lm_roll_'+i,[k*(HP[0]+md[1]),y*(1-.08*sq)*(1-.62*mt)+k*Math.min(HP[1],.1)*(1-mt)+(i?.012*S(pp+3.5)*p.pw[0]:0),z+k*(HP[2]+md[0])+lean]);
      sc('lm_roll_'+i,[1+.07*sq+j+mt*(.38-.08*i),(1-.12*sq-j*1.4)*(1-.58*mt),1+.07*sq+j*.6+mt*(.3-.06*i)]);
      q('lm_roll_'+i,eq([p.h[0]*.25*k,p.h[1]*.7*k,p.h[2]*.5*k]));});
    return T;};
  /* sample at fps into tracks; loops pre-wrap so the seam matches */
  const CC=(name,dur,fn,o={})=>{const fps=o.fps||30,n=Math.max(2,Math.round(dur*fps)),times=[],A={};if(o.jf)o.jf=Math.max(1,Math.round(o.jf*dur))/dur;else o.jf=Math.max(1,Math.round(2.6*dur))/dur;
    for(let i=0;i<=n;i++){const t=i/n*dur;times.push(t);const T=solve(fn(t),t,o);for(const nm in T)for(const k in T[nm]){const key=nm+'|'+k;(A[key]||(A[key]=[])).push(...T[nm][k]);}}
    const tracks=[];for(const key in A){const[nm,k]=key.split('|');tracks.push(k==='q'?new THREE.QuaternionKeyframeTrack(nm+'.quaternion',times,A[key]):new THREE.VectorKeyframeTrack(nm+(k==='p'?'.position':'.scale'),times,A[key]));}
    const c=new THREE.AnimationClip(name,dur,tracks);c.loopMode=!!o.loop;c.note=o.note||'';
    if(o.next!==undefined){if(o.next)c.next=o.next;}else if(!o.loop)c.next='Idle (war mode)';if(o.hold)c.hold=true;if(o.speed)c.speed=o.speed;if(o.underground)c.underground=true;L.push(c);return c;};
  const KC=(name,dur,keys,note,o={})=>{const f=wrKeys(keys.map(kk=>[kk[0],wrP(o.base||LM_W,kk[1]||{})]));return CC(name,dur,t=>{const p=f(t);return o.add?o.add(t,p):p;},Object.assign({note},o));};
  const arms=(a,e)=>({aL:a,aR:a.slice(),eL:[e],eR:[e]});

  /* ---- idle and sliding ---- */
  CC('Idle',4,t=>{const a=D*t/4;return wrP(LM_H,{HP:[0,.012*S(a*2),.01*S(a)],md:[0,0,-.2*S(a*2)],h:[0,3*S(a),2*S(a)],sp:[8+2*S(a*2),3*S(a),0],ch:[12+3*S(a*2),0,2*S(a)],nk:[10,0,0],
    hd:[-6+7*S(a*2+1),16*S(a+.5),8+6*S(a)],jw:[8+16*Math.max(0,S(a*2-.8))],aL:[34+4*S(a*2),36,0],aR:[32+4*S(a*2+.6),30,0],eL:[30+5*S(a*2)],eR:[34+5*S(a*2+.6)],
    fs:[30+18*S(a*4),30+18*S(a*4+2)],jg:[.35]});},{loop:true,note:'Heaves with slow ragged breaths, the rolls of fat quivering, head lolling, moaning, claws twitching'});
  CC('Slide',2.4,t=>{const a=D*t/2.4;return wrP(LM_H,{pw:[1],HP:[0,.015*S(a*2),.03*S(a)],md:[.02*S(a),0,.15*S(a+1)],h:[4+3*S(a),3*S(a*2),3*S(a*2)],sp:[10+3*S(a),0,0],ch:[14,0,0],
    hd:[-8+6*S(a+1),8*S(a*2),8+8*S(a*2)],aL:[46+12*S(a*2),36,0],aR:[46-12*S(a*2),34,0],eL:[30+10*S(a*2)],eR:[30-10*S(a*2)],jw:[10+14*Math.max(0,S(a-1))],jg:[.5]});},
    {loop:true,pT:2.4,speed:.35,note:'Slides slowly along on waves rippling through its foot, like a snail, lurching, arms dragging, moaning, in place, 0.35 m/s'});
  CC('Idle (war mode)',2.4,t=>{const a=D*t/2.4;return wrP(LM_W,{HP:[0,.01*S(a*2),0],md:[.02,0,.1-.15*S(a*2)],h:[6,4*S(a),0],ch:[10,-6*S(a),3*S(a)],hd:[-20+6*S(a*2),10*S(a),4+6*S(a)],
    aL:[78+10*S(a),30,0],aR:[78-10*S(a),30,0],eL:[48+14*S(a)],eR:[48-14*S(a)],fs:[-12+30*Math.max(0,S(a*2)),-12+30*Math.max(0,-S(a*2))],jw:[26+12*S(a*2)],jg:[.5]});},
    {loop:true,note:'Hunched towards the enemy, both claws raised and grasping at the air, wailing'});
  CC('Slide (war mode)',1.8,t=>{const a=D*t/1.8;return wrP(LM_W,{pw:[1.3],HP:[0,.02*S(a*2),.04*S(a)],md:[.04+.03*S(a),0,.2*S(a+1)],h:[10+3*S(a),4*S(a),3*S(a)],sp:[14,0,0],
    hd:[-22+4*S(a*2),6*S(a),4+4*S(a)],aL:[82+18*S(a),28,0],aR:[82-18*S(a),28,0],eL:[42-18*S(a)],eR:[42+18*S(a)],fs:[-12+40*Math.max(0,-S(a)),-12+40*Math.max(0,S(a))],jw:[30+10*S(a*2)],jg:[.7]});},
    {loop:true,pT:1.8,speed:.5,note:'Slides at the enemy as fast as it can, reaching and clawing with each arm in turn, wailing, in place, 0.5 m/s'});

  /* ---- attacks ---- */
  KC('Claw swipe',1.4,[[0,{}],[.45,{h:[4,-14,0],ch:[6,-22,4],sp:[10,-6,0],aR:[105,70,0],eR:[70],wR:[-20,0],fs:[-12,-25],jw:[34],md:[-.03,0,-.1]}],
    [.72,{h:[16,16,0],ch:[18,24,-4],sp:[16,8,0],HP:[0,-.03,.1],aR:[78,-4,0],eR:[18],wR:[10,0],fs:[-12,70],jw:[44],md:[.1,0,.3],jg:[1]}],
    [.95,{h:[14,12,0],ch:[16,18,-4],sp:[14,6,0],HP:[0,-.02,.08],aR:[64,6,0],eR:[24],fs:[-12,60],md:[.08,0,.2],jg:[.8]}],[1.4,{}]],
    'Draws the right claw up and back, then heaves its weight forward and rakes it across and down',{});
  KC('Double slam',1.8,[[0,{}],[.6,{HP:[0,.07,-.04],md:[-.03,0,-.35],h:[-4,0,0],sp:[-2,0,0],ch:[-10,0,0],hd:[-28,0,0],...arms([150,24,0],40),wL:[-20,0],wR:[-20,0],fs:[60,60],jw:[40]}],
    [.85,{HP:[0,-.08,.08],md:[.04,0,.5],h:[12,0,0],sp:[20,0,0],ch:[28,0,0],hd:[-26,0,0],...arms([50,22,0],8),aR:[72,24,0],wL:[10,0],wR:[10,0],fs:[80,80],jw:[20],jg:[1.4]}],
    [1.15,{HP:[0,-.07,.07],md:[.04,0,.4],h:[12,0,0],sp:[18,0,0],ch:[26,0,0],hd:[-24,0,0],...arms([46,22,0],12),aR:[68,24,0],fs:[80,80],jw:[30],jg:[.8]}],[1.8,{}]],
    'Rears up with both fists high over its head and brings them crashing down, the whole mound slumping into the blow',{});
  KC('Smother',2.4,[[0,{}],[.6,{HP:[0,.1,-.06],md:[-.05,0,-.45],h:[-6,0,0],sp:[-4,0,0],ch:[-12,0,0],hd:[-30,0,0],...arms([100,62,0],20),fs:[-15,-15],jw:[42]}],
    [.95,{HP:[0,-.1,.32],md:[.3,0,.45],h:[26,0,0],sp:[14,0,0],ch:[10,0,0],hd:[-40,0,0],...arms([80,40,-60],70),aR:[92,40,-50],eR:[60],fs:[60,60],jw:[36],jg:[1.3]}],
    [1.55,{HP:[0,-.1,.3],md:[.28,0,.4],h:[24,0,0],sp:[14,0,0],ch:[10,0,0],hd:[-38,0,0],...arms([78,36,-64],72),aR:[90,36,-54],eR:[62],fs:[80,80],jw:[30],jg:[1]}],[2.4,{}]],
    'Swells up with its arms spread, then throws its whole mass forward onto the enemy, wraps it in its arms and squeezes',
    {add:(t,p)=>{if(t<.95||t>1.6)return p;const w=Math.min(1,(t-.95)/.1,(1.6-t)/.1),g=S(D*t*3)*w;return Object.assign({},p,{h:[p.h[0],p.h[1]+6*g,p.h[2]+4*g],jw:[p.jw[0]+10*Math.abs(g)],md:[p.md[0],p.md[1],p.md[2]+.15*Math.abs(g)]});}});

  /* ---- agony ---- */
  KC('Wail',2.6,[[0,{}],[.5,{h:[-4,0,0],sp:[-6,0,0],ch:[-14,0,0],nk:[-8,0,0],hd:[-30,0,0],...arms([150,48,0],128),wL:[-20,0],wR:[-20,0],fs:[60,60],jw:[50],md:[0,0,-.35],HP:[0,.06,-.03]}],
    [1.9,{h:[-4,0,0],sp:[-6,0,0],ch:[-16,0,0],nk:[-10,0,0],hd:[-34,0,0],...arms([150,48,0],128),wL:[-20,0],wR:[-20,0],fs:[60,60],jw:[54],md:[0,0,-.4],HP:[0,.07,-.03]}],[2.6,{}]],
    'Clutches its head in both claws, throws it back and wails in agony, shaking',
    {add:(t,p)=>{if(t<.4||t>2)return p;const w=Math.min(1,(t-.4)/.15,(2-t)/.15),g=S(D*t*6)*w;return Object.assign({},p,{hd:[p.hd[0],p.hd[1]+10*g,p.hd[2]+5*g],ch:[p.ch[0],p.ch[1]+4*g,p.ch[2]],jw:[p.jw[0]+6*Math.abs(g)],jg:[1]});}});
  KC('Writhe',3.2,[[0,{}],[.5,{h:[8,-14,6],sp:[16,-8,4],ch:[18,-10,6],hd:[-6,-20,18],aL:[84,-12,0],aR:[60,-8,0],eL:[112],eR:[86],fs:[80,80],jw:[30],md:[0,.04,.3]}],
    [1.4,{h:[10,16,-6],sp:[20,10,-4],ch:[16,10,-8],hd:[-2,22,-16],aL:[84,-8,0],aR:[58,-12,0],eL:[110],eR:[96],fs:[80,80],jw:[44],md:[0,-.04,.35]}],
    [2.3,{h:[6,-10,4],sp:[14,-6,2],ch:[14,-8,4],hd:[-14,-14,12],aL:[82,-10,0],aR:[60,-8,0],eL:[110],eR:[88],fs:[70,70],jw:[36],md:[0,.03,.2]}],[3.2,{}]],
    'Hugs itself and twists from side to side in torment, moaning',{base:LM_H,next:'Idle',add:(t,p)=>Object.assign({},p,{jg:[.8]})});

  /* ---- hits, death, rise ---- */
  KC('Hit 1',.8,[[0,{}],[.12,{HP:[0,.02,-.08],md:[-.08,0,-.15],h:[-8,0,0],sp:[-8,0,0],ch:[-16,0,0],hd:[-30,0,0],...arms([60,46,0],20),fs:[-20,-20],jw:[44],jg:[1.6]}],
    [.42,{HP:[0,0,-.03],md:[-.03,0,.15],h:[2,0,0],ch:[6,0,0],jg:[1.2]}],[.8,{}]],'Struck in front: rocks back with a howl, the fat rolls slapping and quivering',{});
  KC('Hit 2',.9,[[0,{}],[.13,{HP:[.06,0,0],md:[0,.08,0],h:[0,26,8],sp:[0,10,6],ch:[-6,16,8],hd:[-16,24,16],aL:[66,50,0],aR:[50,60,0],eL:[24],eR:[30],fs:[-20,-20],jw:[44],jg:[1.6]}],
    [.46,{HP:[.02,0,0],md:[0,.02,.1],h:[4,6,0],ch:[6,4,0],jg:[1.1]}],[.9,{}]],'Struck from the right: twisted round and shoved aside, wobbling, then turns back',{});
  /* Death: wails, sags and melts into a puddle of meat; the torso sinks forward into it and the head comes to rest on top.
     Rise plays it backwards: the puddle swells up and the hell mound reforms. */
  const MELT={HP:[0,-.46,.16],md:[.06,0,0],mt:[1],h:[80,0,0],sp:[8,0,0],ch:[2,0,6],nk:[-14,0,0],hd:[-50,24,40],sL:[0,0,0],sR:[0,0,0],aL:[40,86,0],aR:[48,84,0],eL:[8],eR:[14],
    wL:[30,0],wR:[30,0],fs:[20,20],jw:[22],jg:[0],pw:[0]};
  const DK=[[0,{}],[.5,{HP:[0,.06,-.03],md:[0,0,-.35],h:[-6,0,0],ch:[-16,0,0],hd:[-34,0,0],...arms([120,60,0],40),fs:[-20,-20],jw:[56],jg:[1]}],
    [1.2,{HP:[0,-.16,.04],md:[.02,0,.4],mt:[.3],h:[18,0,0],sp:[18,0,0],ch:[20,0,2],hd:[-20,6,8],...arms([60,44,0],20),fs:[30,30],jw:[40],jg:[1.2]}],
    [2.1,wrP(MELT,{HP:[0,-.44,.12],mt:[.9],jw:[30],jg:[.5]})],[2.6,wrP(MELT,{jg:[.2]})],[3.2,MELT]];
  KC('Death',3.2,DK,'Wails, sags and melts into a puddle of meat, the torso sinking forward into it, the head resting on top (held)',{next:null,hold:true});
  {const RK=DK.slice().reverse().map(([t,k])=>[3.2-t,k]);RK[RK.length-1]=[3.2,LM_H];
    KC('Rise',3.2,RK.map(([t,k],i)=>[t,i===RK.length-1?k:wrP(LM_W,k)]),'Reforms out of the puddle: the meat swells up into a mound, the torso rises out of it, a wail',{base:{},next:'Idle'});}
  return LMCLIPS.all=L;}

ASSETS.push({id:'hell-mound',folder:'characters/enemies/hell',name:'Hell Mound',kind:'character',variants:true,defaultSeed:1,groundR:1.4,build:(s,o)=>buildHellMound(s,o||{}),
  opts:[{key:'flesh',label:'Flesh',choices:[['random','Random'],...Object.entries(LM_FLESH).map(([k,v])=>[k,v[1].charAt(0).toUpperCase()+v[1].slice(1)])],def:'random'},
    {key:'eyes',label:'Eyes',choices:[['random','Random'],['yellow','Dull yellow'],['milky','Milky'],['ember','Ember glow']],def:'random'}],
  desc:'Hell Mound: a slow, mindless mound of tormented flesh, about 1.6 m. No legs: a heap of fat rolls on a snail-like foot that slides it along; a fat sagging torso with thick flabby clawed arms, one long and one short, and a half-melted head with a gaping, moaning mouth; sores and raw patches. Clips: Idle, Slide, war-mode Idle and Slide, Claw swipe, Double slam, Smother, Wail, Writhe, Hit 1, Hit 2, Death (melts into a puddle) and Rise (reforms).'});
