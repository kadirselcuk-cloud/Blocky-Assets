/* ======================= TROLL: a lean, hunched giant, about 4 m tall standing straight (about 3 m hunched), unarmed =======================
   Built in real metres on the villager's 25 joints like the ogre (so the warrior's leg/arm IK works unchanged): long legs, a lean
   body with ribs and spine knobs, a hump, very long arms with big clawed hands, and an ugly head with a long drooping nose, a wide
   mouth with jagged teeth, big pointed ears and small deep-set eyes. An extra 'jaw' node opens the mouth (its own track per clip).
   It attacks with its long arms. It regenerates: Fall unconscious ends face-down and stays there; Rise starts from that pose,
   pushes up onto hands and knees, plants a foot and stands up into the war stance. */
VB.troll=Object.assign({},VB.goblin,{thigh:.88,shin:.84,ankle:.15,hipOff:.1,spine:.4,chest:.4,neck:.5,headY:.1,shW:.62,ua:.98,fa:.92,g:3.2,hipW:.2,head:1,hand:2.5,arm:1,td:1});
{const b=VB.troll;b.key='troll';b.hipH=b.thigh+b.shin+b.ankle+b.hipOff;b.legS=(b.thigh+b.shin)/.84;b.tS=(b.spine+b.chest)/.3;b.cS=b.neck/.22;}
const TR_SKIN={moss:['#6c7c4a','moss green'],grey:['#7a7c74','stone grey'],blue:['#5e7280','blue-grey'],olive:['#848456','pale olive'],bark:['#6e5a44','bark brown'],teal:['#52705e','swamp teal']};
const TR_HIDE=[['#6a5038','brown hide'],['#8a7050','tan hide'],['#4a4036','dark hide'],['#6e6252','grey hide']];
const TR_HAIR=[['#1c1a16','black'],['#2e3424','dark green'],['#6a6660','grey'],['#5a3420','rust']];

function buildTroll(seed,o={}){const B=VB.troll,r=mulberry32(((seed*2654435761)>>>0)^0x7a11),pick=a=>a[Math.floor(r()*a.length)],root=new THREE.Group();root.userData.lights=[];
  /* roll everything, then let the options override */
  const rk=pick(Object.keys(TR_SKIN)),rh=pick(['stringy','stringy','mane','bald']),hideC=pick(TR_HIDE),hairC=pick(TR_HAIR),moss=r()<.6,warts=r()<.75,scar=r()<.5,necklace=r()<.5,ring=r()<.4;
  const skinK=o.skin&&o.skin!=='random'?o.skin:rk,hair=o.hair&&o.hair!=='random'?o.hair:rh;
  const sk=TR_SKIN[skinK],shade=(h,f)=>'#'+new THREE.Color(h).multiplyScalar(f).getHexString(),skin=bm(sk[0],'skin'),skinD=bm(shade(sk[0],.84),'skin'),skinM=bm(shade(sk[0],.64),'skin'),skinX=bm(shade(sk[0],.42),'skin'),
    hide=bm(hideC[0],'leather'),hideD=bm(shade(hideC[0],.7),'leather'),hairM=bm(hairC[0],'hair'),dark=bm('#140e0a','plain'),eyeM=bm('#d8b040','plain'),ivory=bm('#d8ccaa','plain'),
    claw=bm('#2e2620','plain'),mossM=bm('#4e6228','plain'),mossL=bm('#6a7a34','plain'),gum=bm('#5a2a26','plain'),cord=bm('#2a1e16','leather'),rope=vm('rope'),ir=vm('iron');
  /* joints: same names, offsets and order as buildVillager */
  const hips=J('hips',root,0,B.hipH,0),spine=J('spine',hips,0,B.spine,0),chest=J('chest',spine,0,B.chest,0),neck=J('neck',chest,0,B.neck,0),head=J('head',neck,0,B.headY,0);
  const lw=.13*B.g,fk=B.ankle/.06,hk=B.hand,g=B.g;
  /* ragged hem: teeth of random length hanging below y around a w x d garment */
  const hem=(par,w,d,y,m,n,L0,L1)=>{for(const[f,s]of[[1,1],[1,-1],[0,1],[0,-1]]){const span=f?w:d;for(let i=0;i<n;i++){if(r()<.3)continue;const tw=span/n*(.55+.35*r()),L=L0+(L1-L0)*r(),c=-span/2+(i+.5)*span/n;
    if(f)bx(par,tw,L,.03,m,c,y-L/2+.006,s*(d/2+.006));else bx(par,.03,L,tw,m,s*(w/2+.006),y-L/2+.006,c);}}};
  /* hips: narrow pelvis in a hide wrap, rope belt with a knot and hanging ends */
  bx(hips,.6,.4,.44,skin,0,-.02,0);bx(hips,.66,.3,.5,hide,0,-.06,0);bx(hips,.7,.06,.54,rope,0,.1,0);
  bx(hips,.08,.08,.06,rope,.18,.1,.29);bx(hips,.04,.22,.03,rope,.16,-.04,.285,0,0,.1);bx(hips,.04,.18,.03,rope,.21,-.02,.285,0,0,-.08);
  if(necklace){/* bones and teeth tied to the belt on the left hip */bx(hips,.04,.24,.04,ivory,.36,-.08,.08,0,0,.1);bx(hips,.09,.05,.05,ivory,.37,-.21,.08);bx(hips,.03,.08,.03,ivory,.36,.02,-.06);}
  /* belly: lean and sunken, a navel, the lowest ribs */
  bx(spine,.54,.6,.4,skin,0,.02,0);bx(spine,.44,.3,.06,skinD,0,-.08,.19);bx(spine,.04,.04,.02,skinX,0,-.06,.222);
  for(const s of[-1,1])bx(spine,.03,.03,.24,skinM,s*.271,.2,.04,0,0,0);
  if(scar)bx(spine,.3,.03,.012,skinX,.06,.08,.206,0,0,-.5);
  /* chest: narrow and deep, ribs along the sides, collarbones, a hump on the upper back, knobs down the spine */
  bx(chest,.82,.62,.52,skin,0,.2,0);bx(chest,.72,.36,.3,skin,0,.4,-.2);bx(chest,.5,.2,.2,skin,0,.6,-.14);
  for(const s of[-1,1]){for(let i=0;i<4;i++)bx(chest,.02,.03,.36,skinM,s*.411,-.04+i*.11,.04);
    bx(chest,.3,.04,.04,skinD,s*.2,.5,.26,0,0,s*-.25);bx(chest,.24,.18,.06,skinD,s*.18,.2,.27);
    bx(chest,.24,.14,.3,skin,s*.3,.48,-.06,0,0,s*.35);}
  for(let i=0;i<4;i++)bx(chest,.08,.06,.06,skinD,0,-.02+i*.17,-.28-(i>1?.04*(i-1):0));for(let i=0;i<3;i++)bx(spine,.07,.05,.05,skinD,0,-.2+i*.18,-.215);
  if(moss){bx(chest,.4,.04,.24,mossM,-.18,.58,-.18);bx(chest,.26,.05,.18,mossL,.14,.6,-.24);bx(chest,.04,.2,.18,mossM,-.43,.3,-.12);}
  /* neck: thin and jutting forward from the top of the hump */
  bx(neck,.28,.4,.3,skin,0,.0,.06);bx(neck,.2,.3,.06,skinD,0,-.02,.22);
  /* head: low skull, heavy brow over small deep-set eyes, a long drooping nose, a wide mouth with jagged teeth and a long chin, big pointed ears */
  const hg=new THREE.Group();head.add(hg);hg.position.z=.14;
  bx(hg,.44,.34,.46,skin,0,.32,-.04);bx(hg,.4,.08,.36,skin,0,.5,-.06);bx(hg,.48,.1,.14,skinM,0,.36,.2);bx(hg,.46,.14,.38,skin,0,.2,.02);
  bx(hg,.34,.06,.03,dark,0,.29,.2);
  for(const s of[-1,1]){bx(hg,.08,.045,.02,eyeM,s*.1,.29,.214);bx(hg,.03,.04,.022,dark,s*.09,.29,.216);bx(hg,.1,.04,.04,skinD,s*.17,.22,.21);
    /* ears: long, pointed, drooping a little, pointing outward */
    const e=new THREE.Group();put(hg,e,s*.22,.3,-.04,0,s*.4,s*-.22);bx(e,.2,.16,.05,skin,s*.1,0,0);bx(e,.16,.1,.04,skin,s*.24,.02,0);bx(e,.1,.05,.035,skin,s*.35,.04,0);
    bx(e,.18,.08,.02,skinX,s*.13,0,.025);bx(e,.04,.08,.06,skin,s*.03,-.08,0);if(ring&&s<0){bx(e,.025,.07,.025,ir,s*.14,-.11,0);bx(e,.06,.025,.025,ir,s*.14,-.15,0);}}
  /* the long nose: a hooked bridge, a drooping shaft and a fat bulb hanging over the mouth */
  bx(hg,.11,.11,.36,skin,0,.215,.36,.52,0,0);bx(hg,.08,.05,.16,skin,0,.29,.3,.42,0,0);bx(hg,.15,.14,.14,skinD,0,.1,.51);bx(hg,.11,.03,.03,skinX,0,.12,.585);
  for(const s of[-1,1])bx(hg,.035,.025,.035,dark,s*.04,.033,.52);
  if(warts){bx(hg,.04,.04,.04,skinM,.06,.14,.58);bx(hg,.035,.035,.03,skinD,-.17,.43,.13);bx(hg,.03,.03,.03,skinD,.19,.12,.17);}
  /* upper jaw: teeth along the lip; the lower jaw opens (its own node, rotated by the clips) */
  bx(hg,.38,.1,.3,skin,0,.11,.12);bx(hg,.3,.03,.02,dark,0,.07,.27);
  for(const[x,h]of[[-.12,.05],[-.06,.04],[0,.06],[.06,.04],[.12,.05]])bx(hg,.035,h,.02,ivory,x,.07-h/2+.01,.275);
  const jaw=new THREE.Group();jaw.name='jaw';put(hg,jaw,0,.08,-.04);
  bx(jaw,.36,.1,.34,skin,0,-.06,.16);bx(jaw,.18,.1,.12,skin,0,-.1,.32);bx(jaw,.28,.02,.24,gum,0,-.005,.16);
  for(const s of[-1,1])bx(jaw,.04,.08,.04,ivory,s*.13,.02,.3);for(const x of[-.07,.01,.07])bx(jaw,.03,.035,.02,ivory,x,0,.31);
  bx(jaw,.42,.08,.24,skin,0,-.08,0);
  /* hair */
  /* a hair strand from (x,y0,z0), tilted back by th (0 = hanging straight down) so it lies over the hump instead of through it */
  const strand=(x,y0,z0,L,th,rz,w,d)=>bx(hg,w,L,d,hairM,x,y0-Math.cos(th)*L/2,z0-Math.sin(th)*L/2,th,0,rz);
  if(hair==='stringy'){/* bald crown; long thin strands from the back and sides of the skull, trailing back over the hump */
    bx(hg,.46,.12,.12,hairM,0,.4,-.23);for(const s of[-1,1])bx(hg,.05,.12,.24,hairM,s*.225,.38,-.08);
    for(const[x,L,th,rz]of[[-.2,.6,1.0,.12],[-.11,.78,1.12,.04],[-.02,.6,1.18,0],[.08,.72,1.1,-.05],[.18,.62,1.0,-.12]])strand(x,.44,-.27,L,th,rz,.06,.05);
    for(const s of[-1,1])strand(s*.245,.42,-.08,.42,.5,s*-.12,.05,.05);}
  if(hair==='mane'){/* a matted crest from the brow over the crown, hanging down the back of the neck in clumps */
    for(const[z,h,w]of[[.12,.1,.14],[0,.14,.18],[-.12,.15,.22],[-.24,.14,.26]])bx(hg,w,h,.14,hairM,0,.52+h/2-.04,z);
    for(const[x,L,rz]of[[-.12,.6,.1],[0,.74,0],[.12,.58,-.1]])strand(x,.52,-.3,L,1.15,rz,.13,.1);}
  if(hair==='bald'){for(const[x,z]of[[-.1,.04],[.06,-.06],[.14,.08],[-.02,-.16],[-.16,-.1]])bx(hg,.02,.06,.02,hairM,x,.56,z);}
  const sockHead=J('socket_head',head,0,.62,0);sockHead.userData.socket=true;
  /* arms: very long and lean, bony elbows and wrists, huge hands with long fingers and black claws */
  for(const[sd,s]of[['L',1],['R',-1]]){const sh=J('shoulder_'+sd,chest,s*B.shW*.325,.165*B.cS,0),ua=J('upperArm_'+sd,sh,s*B.shW*.675,0,0),fa=J('foreArm_'+sd,ua,0,-B.ua,0),hd=J('hand_'+sd,fa,0,-B.fa,0);
    bx(ua,.3,.32,.32,skin,s*.01,-.04,0);bx(ua,.22,B.ua,.24,skin,0,-B.ua/2-.02,0);bx(ua,.18,.14,.16,skinD,0,-B.ua+.02,-.07);
    if(moss&&sd==='R')bx(ua,.2,.04,.24,mossL,0,.13,0);
    bx(fa,.25,B.fa*.62,.27,skin,0,-B.fa*.3,0);bx(fa,.2,B.fa*.42,.21,skin,0,-B.fa*.76,0);bx(fa,.22,.08,.23,skinD,0,-B.fa*.95,0);
    const hw=.3;bx(hd,hw*.9,.09*hk,hw,skin,0,-.04*hk,0);bx(hd,hw*.5,.04*hk,hw*.6,skinD,s*-.12,-.03*hk,0);
    const fg=J('fingers_'+sd,hd,0,-.085*hk,0),ft=J('fingerTips_'+sd,fg,0,-.045*hk,0),th=J('thumb_'+sd,hd,-s*.02*hk,-.04*hk,hw/2);
    for(let i=-1;i<=1;i++){bx(fg,hw*.62,.05*hk,hw*.27,skin,s*.005,-.022*hk,i*hw*.33);bx(ft,hw*.52,.04*hk,hw*.24,skin,s*.005,-.018*hk,i*hw*.33);
      bx(ft,.05,.09,.05,claw,s*.01,-.04*hk-.03,i*hw*.33);}
    bx(th,.035*hk,.06*hk,.035*hk,skin,0,-.024*hk,.006);bx(th,.04,.08,.04,claw,0,-.06*hk-.02,.006);
    const so=J('socket_'+sd,hd,-s*.012*hk,-.088*hk,0);so.userData.socket=true;}
  /* legs: long and lean, a ragged hide kilt on the thighs, knobbly knees, long narrow feet with three clawed toes */
  for(const[sd,s]of[['L',1],['R',-1]]){const th=J('thigh_'+sd,hips,s*B.hipW,-(B.hipOff+.01),0),sn=J('shin_'+sd,th,0,-B.thigh,0),ft=J('foot_'+sd,sn,0,-B.shin,0);
    bx(th,.32,B.thigh+.12,.34,skin,0,-B.thigh/2+.03,0);bx(th,.38,.34,.4,hide,0,-.04,0);hem(th,.38,.4,-.21,hide,3,.05,.16);bx(th,.39,.04,.41,hideD,0,.1,0);
    bx(sn,.26,.18,.22,skinD,0,-.02,.05);bx(sn,.24,B.shin,.26,skin,0,-B.shin/2,0);bx(sn,.27,.36,.14,skin,0,-.26,-.1);bx(sn,.2,.1,.22,skinD,0,-B.shin+.06,0);
    const zh=.03*g-lw*.8,zt=.03*g+lw*.8,fl=lw*1.3;bx(ft,lw*.7,.07*fk,fl,skin,0,-.035*fk,zh+fl/2);bx(ft,lw*.5,.04*fk,fl*.5,skinD,0,-.01*fk,zh+fl*.6);
    for(let i=-1;i<=1;i++){const tz=zh+fl+(zt-zh-fl)/2,tl=zt-zh-fl+.004;bx(ft,lw*.17,.03*fk,tl,skin,i*lw*.22,-.07*fk+.015*fk,tz-.002);bx(ft,lw*.13,.03,.05,claw,i*lw*.22,-.07*fk+.03,zt-.015);}}
  const joints=[];root.traverse(q=>{if(q.userData.joint&&!q.userData.socket)joints.push(q);});root.userData.joints=joints;
  if(o.bare)return root;
  if(!o.noClips)root.userData.clips=trollClips();root.userData.ground=5.2;
  const cap=s=>s.charAt(0).toUpperCase()+s.slice(1),hairT={stringy:`stringy ${hairC[1]} hair`,mane:`a matted ${hairC[1]} mane`,bald:'bald'}[hair];
  root.userData.variantText=`${cap(sk[1])} skin, ${hairT}${warts?', warts':''}${moss?', moss on the back and shoulder':''}${scar?', scarred belly':''}; ${hideC[1]} kilt, rope belt${necklace?' with bones tied on':''}${ring?', iron ear ring':''}.`;
  return root;}

/* ---------- clips (real metres) ---------- */
let TRCLIPS=null;
/* stances. Normal: deeply hunched, head thrust forward, long arms hanging with the hands by the knees.
   War: lower and wider, left side forward, both arms reaching out with the claws open */
const TR_N={HP:[0,-.12,0],h:[28,0,0],sp:[22,0,0],ch:[34,0,0],nk:[-6,0,0],hd:[-16,0,0],FL:[.3,.06,10,0,0],FR:[-.3,-.06,-10,0,0],
  gR:[-.62,.72,.85],dR:[0,-.2,1],pR:[-.4,0,-1],gL:[.62,.72,.85],dL:[1,0,0],pL:[.4,0,-1],fist:[35,35],jaw:[0]};
const TR_W={HP:[0,-.3,0],h:[30,-6,0],sp:[18,-4,0],ch:[30,-4,0],nk:[-8,0,0],hd:[-16,8,0],FL:[.42,.42,-10,0,0],FR:[-.42,-.36,-36,0,0],
  gR:[-1.05,1.45,1.75],dR:[0,.6,.8],pR:[-.8,-.5,-.3],gL:[.95,1.55,2.0],dL:[.8,.3,.5],pL:[.8,-.5,-.3],fist:[15,15],jaw:[6]};
function trRig(){const B=VB.troll,m=buildTroll(1,{hair:'mane',bare:true}),J={};m.traverse(q=>{if(q.userData.joint)J[q.name]=q;});
  const R={m,J,B,two:false},HM={L:[],R:[]};
  for(const sd of['L','R'])J['hand_'+sd].traverse(q=>{if(q.isMesh)HM[sd].push(q);});
  /* lowest corner of each hand (so a reaching hand never goes below the ground) */
  const v=new THREE.Vector3();R.lowHand=sd=>{m.updateMatrixWorld(true);let y=1e9;for(const q of HM[sd]){const p=q.geometry.parameters;for(let i=0;i<8;i++){v.set((i&1?.5:-.5)*p.width,(i&2?.5:-.5)*p.height,(i&4?.5:-.5)*p.depth).applyMatrix4(q.matrixWorld);if(v.y<y)y=v.y;}}return y;};
  return R;}

function trollClips(){if(TRCLIPS)return TRCLIPS;const B=VB.troll,k=B.legS,D=Math.PI*2,S=Math.sin,C=Math.cos,L=[],R=trRig(),V=THREE.Vector3,gU=o=>gbU(B,o),D2R=Math.PI/180;
  /* the jaw: its own track, an angle in degrees per frame (opens downward) */
  const jawTrack=(c,fn)=>{const T=c.tracks[0].times,Q=[],q=new THREE.Quaternion(),e=new THREE.Euler();for(const t of T){q.setFromEuler(e.set(fn(t)*D2R,0,0));Q.push(q.x,q.y,q.z,q.w);}
    c.tracks.push(new THREE.QuaternionKeyframeTrack('jaw.quaternion',Array.from(T),Q));};
  /* continuity (one-shot clips): each elbow pole leans towards where that elbow pointed the frame before, so no arm flips over */
  let EL=null;const elbows=()=>{const e={};R.m.updateMatrixWorld(true);for(const sd of['L','R']){const Sh=R.J['upperArm_'+sd].getWorldPosition(new V()),E=R.J['foreArm_'+sd].getWorldPosition(new V()),W=R.J['hand_'+sd].getWorldPosition(new V()),u=W.sub(Sh).normalize();
    E.sub(Sh);E.addScaledVector(u,-E.dot(u));if(E.lengthSq()>1e-6)e[sd]=E.normalize();}return e;};
  const solve=(o,cont)=>{const q=gU(o);if(cont&&EL)for(const sd of['L','R'])if(EL[sd]){const p=new V(...q['p'+sd]).normalize().lerp(EL[sd],.75).normalize();q['p'+sd]=p.toArray();}
    let s=wrSolve(R,q);
    /* hands stay above the ground */
    for(let i=0;i<3;i++){let moved=false;for(const sd of['L','R']){const y=R.lowHand(sd);if(y<.01){q['g'+sd]=[q['g'+sd][0],q['g'+sd][1]+(.012-y)/k,q['g'+sd][2]];moved=true;}}if(!moved)break;s=wrSolve(R,q);}
    if(cont)EL=elbows();return s;};
  const CC=(name,dur,fn,o)=>{EL=null;const cont=!(o&&o.loop),c=sampleClip(name,dur,t=>solve(fn(t),cont),Object.assign({autoFeet:false},o),B);jawTrack(c,t=>(fn(t).jaw||[0])[0]);L.push(c);return c;};
  const KC=(name,dur,keys,note,base=TR_W)=>CC(name,dur,wrKeys(keys.map(q=>[q[0],wrP(base,q[1])])),{note});
  const lift=(o,dy)=>{o.gR=[o.gR[0],o.gR[1]+dy,o.gR[2]];o.gL=[o.gL[0],o.gL[1]+dy,o.gL[2]];return o;};
  /* in-place IK gait: feet slide back while planted and swing forward lifted; the hands ride up and down with the hips */
  const GAIT=(name,dur,G,note)=>{const fn=t=>{const u=t/dur,o=G.body(u),c2=C(D*(u-G.duty/2));o.HP=[G.sw*c2,G.y0-G.b*C(2*D*(u-G.duty/2)),0];lift(o,o.HP[1]-G.y0);
      for(const[sd,off,x,yaw]of[['L',0,G.x,G.yaw[0]],['R',.5,-G.x,G.yaw[1]]]){const q=(((u+off)%1)+1)%1;let z,l,pt;
        if(q<G.duty){const v=q/G.duty;z=G.s*(1-2*v);l=0;pt=v<.15?-10*(1-v/.15):v>.7?G.toe*(v-.7)/.3:0;}
        else{const v=(q-G.duty)/(1-G.duty),sm=v*v*(3-2*v);z=-G.s+2*G.s*sm;l=G.lift*Math.sin(Math.PI*Math.pow(v,G.lp||1));pt=G.toe*(1-v)*(1-v)-12*v*v;}
        o['F'+sd]=[x,z,yaw,l,pt];}return o;};
    const sp=2*G.s/(G.duty*dur),c=CC(name,dur,fn,{loop:true,note:`${note}, in place, ${sp.toFixed(1)} m/s`});c.speed=sp;};
  /* arm swing for the gaits: a = +1 when the left foot is forward (the left hand swings back) */
  const swing=(o,a,amp,y0,z0,x0)=>{o.gL=[x0,y0+.08*Math.abs(a),z0-amp*a];o.gR=[-x0,y0+.08*Math.abs(a),z0+amp*a];return o;};

  /* ---- normal mode ---- */
  /* Idle: slow breathing, the head swings round sniffing the air (nose up, short sniffs), then scratches the head with the left hand */
  CC('Idle',6,t=>{const p=D*t/6,b=S(p),b2=S(2*p),sn=t>.6&&t<2.6?S(Math.PI*(t-.6)/2):0,sf=sn*sn*(3-2*sn),k2=t>3.4&&t<5.6?S(Math.PI*(t-3.4)/2.2):0,sc=k2*k2*(3-2*k2),rub=.05*S(D*t*3)*sc;
    return wrP(TR_N,{HP:[.02*b,-.12-.015*b2,0],h:[28,0,1.5*b],sp:[22+1*b2,0,0],ch:[34+2*b2,0,0],nk:[-6-10*sf,0,0],hd:[-16-8*sf+3*S(D*t*4)*sf+10*sc,30*S(p+.4)*(1-sc),6*sc],
      gR:[-.62,.72+.02*b2,.85],gL:[.62-.3*sc+.4*S(Math.PI*sc),.72+2.42*sc+rub,.85+.4*sc+.3*S(Math.PI*sc)],dL:[1-.8*sc,.4*sc,.6*sc],pL:[.4+.5*sc,.6*sc,-1+.9*sc],fist:[35+15*sc,35],jaw:[2+3*sf]});},{loop:true,note:'Hunched breathing, sniffs the air, scratches its head'});
  GAIT('Walk',1.6,{duty:.62,s:.55,lift:.2,toe:20,x:.3,yaw:[8,-8],y0:-.16,b:.04,sw:.06,
    body:u=>{const yw=C(D*(u-.97)),a=C(D*(u-.06));return swing(wrP(TR_N,{h:[28,-6*yw,4*S(D*(u+.05))],sp:[22,2*yw,-2*S(D*(u+.05))],ch:[34+2*C(2*D*(u-.18)),4*yw,0],nk:[-6-2*C(2*D*u),-4*yw,0]}),a,.4,.8,.8,.74);}},'Long loping strides, hunched, arms swinging');
  GAIT('Run',.84,{duty:.4,s:.85,lift:.36,lp:.7,toe:30,x:.28,yaw:[6,-6],y0:-.22,b:.07,sw:.04,
    body:u=>{const yw=C(D*(u-.92)),a=C(D*(u-.05));return swing(wrP(TR_N,{h:[34,-8*yw,4*S(D*(u+.1))],sp:[22,3*yw,0],ch:[30+2*C(2*D*(u-.12)),5*yw,0],nk:[-14,0,0],pR:[-.5,0,-1],pL:[.5,0,-1],fist:[60,60]}),a,.8,1.1,.7,.76);}},'Loping run, leaning in, long arms pumping');

  /* ---- war mode ---- */
  CC('Idle (war mode)',2.6,t=>{const p=D*t/2.6,b=S(p),b2=S(p+.6),c=S(2*p);return lift(wrP(TR_W,{HP:[.02*S(p*.5),-.3-.016*b,0],sp:[18+1.2*b,-4,0],ch:[30+2*b,-6,0],hd:[-16,8+10*S(p*.5),0],
    gR:[-1.05,1.45,1.75+.06*c],gL:[.95,1.55,2.0-.06*c],fist:[15+12*Math.max(0,c),15+12*Math.max(0,-c)],jaw:[6+4*Math.max(0,b)]}),-.03*b2);},{loop:true,note:'Low and wide, arms reaching out, claws flexing'});
  GAIT('Walk (war mode)',1.4,{duty:.64,s:.4,lift:.14,toe:20,x:.42,yaw:[-8,-34],y0:-.36,b:.025,sw:.04,
    body:u=>lift(wrP(TR_W,{h:[30,-6-5*C(D*u),4*S(D*(u+.1))],sp:[18,-4,0],ch:[30,-4,0],gR:[-1.05,1.45,1.75+.08*C(D*u)],gL:[.95,1.55,2.0-.08*C(D*u)],jaw:[8]}),.02*C(2*D*u))},'Stalking forward, arms out');
  GAIT('Run (war mode)',.76,{duty:.38,s:.82,lift:.34,lp:.7,toe:32,x:.34,yaw:[-2,-10],y0:-.26,b:.07,sw:.03,
    body:u=>{const a=C(D*(u-.05));return lift(wrP(TR_W,{h:[30,-6-4*C(D*u),3*S(D*(u+.1))],sp:[16,-2,0],ch:[18,-3,0],nk:[-32,0,0],hd:[-6,0,0],
      gR:[-.85,1.25+.12*a,-.4+.6*a],dR:[0,.3,1],pR:[-.6,-.4,-.7],gL:[.85,1.25-.12*a,-.4-.6*a],dL:[.8,.3,0],pL:[.6,-.4,-.7],fist:[30,30],jaw:[14]}),.03*C(2*D*(u-.1)));}},'Charging, leaning far forward, arms swept back');
  /* Roar: crouches, rears up with both arms spread wide and high, mouth wide open, then drops back */
  {const up={HP:[0,-.1,0],h:[2,-8,0],sp:[-2,0,0],ch:[-4,0,0],nk:[-20,0,0],hd:[-10,0,0],gR:[-2.0,3.1,.6],dR:[0,1,.2],pR:[-.3,-1,-.2],gL:[1.85,3.15,.9],dL:[.3,1,.2],pL:[.3,-1,-.2],fist:[5,5],jaw:[34]};
  KC('Roar',3.2,[[0,{}],
    [.5,{HP:[0,-.5,0],h:[30,-14,0],sp:[18,-4,0],ch:[24,-4,0],nk:[-14,0,0],hd:[4,0,0],gR:[-.8,.7,.9],gL:[.7,.7,1.1],fist:[60,60],jaw:[0]}],
    [.95,up],[1.4,wrP(up,{hd:[-14,6,0],jaw:[38]})],[1.9,wrP(up,{hd:[-12,-6,0],jaw:[36]})],[2.3,wrP(up,{jaw:[30]})],
    [3.2,{}]],'Crouches, then rears up with the arms spread wide, roaring');}
  /* attacks: the long arms do the work */
  KC('Attack 1',1.6,[[0,{}],
    [.45,{HP:[0,-.32,-.06],h:[18,-40,0],sp:[14,-10,0],ch:[18,-26,0],gR:[-1.75,2.2,-.55],dR:[-.3,.4,-.85],pR:[-.3,-.6,-.7],gL:[.9,1.5,1.6],pL:[.8,-.6,-.2],fist:[5,30]}],
    [.62,{HP:[0,-.36,.14],h:[22,-10,0],sp:[16,0,0],ch:[20,6,0],FL:[.42,.7,-10,0,0],gR:[-1.3,1.55,1.9],dR:[.7,.2,.6],pR:[-.5,-.8,-.2],gL:[1.0,1.3,1.3],fist:[5,40]}],
    [.74,{HP:[0,-.36,.18],h:[22,14,0],sp:[16,8,0],ch:[20,26,0],FL:[.42,.74,-8,0,0],gR:[.5,1.45,2.2],dR:[1,0,-.1],pR:[-.3,-.9,-.3],gL:[1.2,.9,1.3],fist:[5,40]}],
    [.88,{HP:[0,-.35,.16],h:[22,22,0],sp:[16,10,0],ch:[20,32,0],FL:[.42,.74,-8,0,0],gR:[1.35,1.5,1.3],dR:[.6,0,-.8],pR:[-.2,-.9,-.4],gL:[1.25,.9,1.0],fist:[10,40]}],
    [1.15,{HP:[0,-.34,.08],h:[22,4,0],sp:[16,2,0],ch:[20,8,0],FL:[.42,.6,-10,.06,0],gR:[-.3,1.3,1.8],dR:[0,.4,.9],gL:[1.0,1.4,1.5]}],
    [1.6,{}]],'Long backhand swipe from the right, a step in');
  KC('Attack 2',1.6,[[0,{}],
    [.5,{HP:[0,-.24,-.1],h:[14,10,0],sp:[6,6,0],ch:[0,14,0],hd:[-10,-6,0],gL:[1.1,3.5,.1],dL:[.2,1,-.2],pL:[.6,-.6,-.6],gR:[-1.1,1.3,1.4],fist:[0,30],jaw:[16]}],
    [.7,{HP:[0,-.4,.2],h:[26,-6,0],sp:[16,-2,0],ch:[24,-8,0],FL:[.42,.78,-10,0,0],gL:[.65,2.6,2.0],dL:[0,.6,.8],pL:[.7,-.6,-.3],gR:[-1.1,1.2,1.2],fist:[0,30],jaw:[22]}],
    [.84,{HP:[0,-.48,.24],h:[32,-16,0],sp:[20,-4,0],ch:[26,-12,0],FL:[.42,.8,-8,0,0],gL:[.05,.7,1.9],dL:[-.4,-.3,.85],pL:[.8,0,-.6],gR:[-1.1,1.15,1.2],fist:[25,30],jaw:[10]}],
    [1.05,{HP:[0,-.45,.22],h:[30,-18,0],sp:[18,-4,0],ch:[24,-12,0],FL:[.42,.8,-8,0,0],gL:[-.1,.65,1.6],dL:[-.4,-.3,.85],pL:[.8,0,-.6],gR:[-1.1,1.15,1.2],fist:[60,30]}],
    [1.3,{HP:[0,-.38,.1],FL:[.42,.6,-10,.06,0],gL:[.6,1.3,1.3]}],
    [1.6,{}]],'Overhead claw rake with the left hand, down and across');
  /* Heavy attack: both fists raised high together, then hammered into the ground; the hands stay apart so they never cross */
  KC('Heavy attack',2.4,[[0,{}],
    [.8,{HP:[0,-.14,-.12],h:[2,-10,0],sp:[-6,-2,0],ch:[-12,-4,0],nk:[-16,0,0],hd:[-14,0,0],FR:[-.42,-.36,-36,0,10],gR:[-.32,4.0,.0],dR:[0,.2,-1],pR:[-.8,.4,-.3],gL:[.32,4.0,.1],dL:[1,0,0],pL:[.8,.4,-.3],fist:[95,95],jaw:[20]}],
    [1.0,{HP:[0,-.2,.1],h:[10,-10,0],sp:[4,-2,0],ch:[0,-2,0],FL:[.42,.85,-10,.1,0],gR:[-.32,3.9,.9],dR:[0,.95,.3],pR:[-.8,0,-.3],gL:[.32,3.9,1.0],dL:[1,0,0],pL:[.8,0,-.3],fist:[95,95],jaw:[26]}],
    [1.18,{HP:[0,-.62,.32],h:[34,-8,0],sp:[22,0,0],ch:[24,0,0],nk:[-26,0,0],FL:[.42,.95,-8,0,0],gR:[-.34,.3,2.0],dR:[0,-.3,1],pR:[-.8,-.4,-.3],gL:[.34,.3,2.05],dL:[1,0,0],pL:[.8,-.4,-.3],fist:[95,95],jaw:[30]}],
    [1.6,{HP:[0,-.64,.32],h:[35,-8,0],sp:[23,0,0],ch:[25,0,0],nk:[-26,0,0],FL:[.42,.95,-8,0,0],gR:[-.34,.28,2.0],dR:[0,-.3,1],pR:[-.8,-.4,-.3],gL:[.34,.28,2.05],dL:[1,0,0],pL:[.8,-.4,-.3],fist:[95,95],jaw:[14]}],
    [2.0,{HP:[0,-.42,.16],h:[26,-12,0],FL:[.42,.7,-10,.08,0],gR:[-.8,1.2,1.2],gL:[.7,1.3,1.5],fist:[40,40]}],
    [2.4,{}]],'Both fists raised high and hammered into the ground');
  /* Grab & bite: lunges with both arms far out, closes the hands, hauls the catch to the mouth and bites, then flings it aside */
  KC('Grab & bite',2.8,[[0,{}],
    [.35,{HP:[0,-.3,-.1],h:[16,-12,0],gR:[-1.3,1.9,.6],dR:[0,.6,.8],pR:[-.8,-.2,-.5],gL:[1.2,1.9,.9],dL:[.8,.3,.5],fist:[0,0],jaw:[10]}],
    [.6,{HP:[0,-.5,.4],h:[34,-4,0],sp:[20,0,0],ch:[18,0,0],nk:[-34,0,0],FL:[.42,1.05,-8,0,0],gR:[-.4,1.4,2.75],dR:[0,.3,1],pR:[-.8,-.3,-.3],gL:[.4,1.4,2.85],dL:[1,0,0],pL:[.8,-.3,-.3],fist:[0,0],jaw:[18]}],
    [.75,{HP:[0,-.5,.4],h:[34,-4,0],sp:[20,0,0],ch:[18,0,0],nk:[-34,0,0],FL:[.42,1.05,-8,0,0],gR:[-.32,1.38,2.7],dR:[0,.3,1],pR:[-.8,-.3,-.3],gL:[.32,1.38,2.8],dL:[1,0,0],pL:[.8,-.3,-.3],fist:[90,90],jaw:[6]}],
    [1.2,{HP:[0,-.3,.1],h:[14,-8,0],sp:[6,0,0],ch:[6,0,0],nk:[-30,0,0],hd:[-10,0,0],FL:[.42,.6,-10,0,0],gR:[-.26,2.8,1.2],dR:[0,.6,.8],pR:[-.9,-.4,-.1],gL:[.26,2.82,1.25],dL:[1,0,0],pL:[.9,-.4,-.1],fist:[90,90],jaw:[30]}],
    [1.4,{HP:[0,-.32,.1],h:[16,-8,0],sp:[8,0,0],ch:[8,0,0],nk:[-22,0,0],hd:[4,0,0],FL:[.42,.6,-10,0,0],gR:[-.26,2.7,1.2],dR:[0,.6,.8],pR:[-.9,-.4,-.1],gL:[.26,2.72,1.25],dL:[1,0,0],pL:[.9,-.4,-.1],fist:[90,90],jaw:[0]}],
    [1.6,{HP:[0,-.3,.1],h:[14,-8,0],sp:[6,0,0],ch:[6,0,0],nk:[-28,0,0],hd:[-6,0,0],FL:[.42,.6,-10,0,0],gR:[-.26,2.7,1.15],dR:[0,.6,.8],pR:[-.9,-.4,-.1],gL:[.26,2.72,1.2],dL:[1,0,0],pL:[.9,-.4,-.1],fist:[90,90],jaw:[28]}],
    [1.8,{HP:[0,-.32,.1],h:[16,-8,0],sp:[8,0,0],ch:[8,0,0],nk:[-22,0,0],hd:[4,0,0],FL:[.42,.6,-10,0,0],gR:[-.26,2.7,1.2],dR:[0,.6,.8],pR:[-.9,-.4,-.1],gL:[.26,2.72,1.25],dL:[1,0,0],pL:[.9,-.4,-.1],fist:[90,90],jaw:[0]}],
    [2.15,{HP:[0,-.3,.05],h:[18,-30,0],sp:[12,-8,0],ch:[14,-14,0],FL:[.42,.5,-10,0,0],gR:[-1.9,2.1,.6],dR:[-.6,.4,.6],pR:[-.6,-.6,-.4],gL:[1.0,1.6,.9],dL:[.8,.3,.5],fist:[0,20],jaw:[8]}],
    [2.8,{}]],'Lunges, grabs with both hands, bites, flings the catch aside');
  /* Low sweep: the right arm swings at shin height, right to left, knocking legs away */
  KC('Low sweep',1.8,[[0,{}],
    [.45,{HP:[0,-.6,-.1],h:[34,-40,0],sp:[18,-10,0],ch:[18,-24,0],FR:[-.5,-.4,-40,0,0],gR:[-1.9,.5,-.3],dR:[-.2,-.2,-1],pR:[-.3,-.9,-.3],gL:[1.0,.5,1.5],dL:[.3,0,1],pL:[.6,0,-.8],fist:[50,30]}],
    [.66,{HP:[0,-.72,.18],h:[42,-12,0],sp:[20,-2,0],ch:[20,0,0],FL:[.48,.7,-10,0,0],FR:[-.5,-.4,-40,0,0],gR:[-1.3,.35,1.6],dR:[.8,0,.5],pR:[-.4,-.9,-.1],gL:[1.0,.25,1.4],dL:[.3,0,1],pL:[.6,0,-.8],fist:[80,30]}],
    [.8,{HP:[0,-.72,.2],h:[42,14,0],sp:[20,8,0],ch:[20,24,0],FL:[.48,.7,-8,0,0],FR:[-.5,-.4,-40,0,0],gR:[.4,.35,2.2],dR:[1,0,-.1],pR:[-.3,-.9,-.2],gL:[1.0,.25,1.35],dL:[.3,0,1],pL:[.6,0,-.8],fist:[80,30]}],
    [.96,{HP:[0,-.7,.18],h:[40,24,0],sp:[20,10,0],ch:[20,30,0],FL:[.48,.7,-8,0,0],FR:[-.5,-.4,-40,0,0],gR:[1.5,.45,1.2],dR:[.6,0,-.8],pR:[-.2,-.9,-.3],gL:[1.0,.25,1.35],dL:[.3,0,1],pL:[.6,0,-.8],fist:[80,30]}],
    [1.3,{HP:[0,-.5,.08],h:[30,4,0],sp:[18,2,0],ch:[20,6,0],FL:[.45,.55,-10,.06,0],gR:[-.3,.9,1.4],dR:[0,.4,.9],gL:[1.0,.8,1.6],fist:[40,30]}],
    [1.8,{}]],'Crouches low and sweeps the right arm at shin height, right to left');
  /* hits */
  KC('Hit',.9,[[0,{}],
    [.08,{HP:[0,-.3,-.1],h:[14,-18,0],sp:[6,-4,0],ch:[0,-6,0],nk:[-34,0,0],hd:[-20,0,0],gR:[-1.0,1.7,.6],gL:[.9,1.75,1.0],jaw:[16]}],
    [.18,{HP:[0,-.31,-.11],h:[13,-18,0],sp:[5,-4,0],ch:[-2,-6,0],nk:[-36,0,0],hd:[-22,0,4],gR:[-1.0,1.72,.58],gL:[.9,1.77,.98],jaw:[18]}],
    [.45,{HP:[0,-.33,-.04],h:[20,-16,0],sp:[14,-4,0],ch:[16,-6,0],hd:[-8,0,0],jaw:[8]}],
    [.9,{}]],'Blow to the face: head and shoulders snap back, then recover');
  KC('Heavy hit',1.9,[[0,{}],
    [.12,{HP:[0,-.24,-.14],h:[2,-24,0],sp:[-6,-4,0],ch:[-10,-8,0],nk:[-30,0,0],hd:[-16,0,4],gR:[-1.3,1.9,.3],dR:[0,.8,.4],gL:[1.2,2.0,.6],jaw:[22]}],
    [.35,{HP:[0,-.3,-.34],h:[8,-24,0],sp:[2,-4,0],ch:[4,-8,0],hd:[-8,0,0],FR:[-.42,-.85,-38,.16,0],gR:[-1.2,1.6,.4],gL:[1.1,1.7,.8],jaw:[12]}],
    [.55,{HP:[0,-.36,-.52],h:[18,-22,0],sp:[12,-4,0],ch:[14,-8,0],FR:[-.42,-1.05,-38,0,0],jaw:[8]}],
    [.78,{HP:[0,-.34,-.56],FL:[.42,0,-12,.14,0],FR:[-.42,-1.05,-38,0,0]}],
    [.98,{HP:[0,-.32,-.58],FL:[.42,-.2,-12,0,0],FR:[-.42,-1.05,-38,0,0]}],
    [1.28,{HP:[0,-.32,-.32],FL:[.42,.1,-12,.12,0],FR:[-.42,-1.05,-38,0,0]}],
    [1.45,{HP:[0,-.32,-.22],FR:[-.42,-1.05,-38,0,0]}],
    [1.68,{HP:[0,-.33,-.1],FR:[-.42,-.7,-37,.12,0]}],
    [1.9,{}]],'Knocked back two long steps, then stalks in again');
  /* ---- falls: FK keyframes from the solved war stance; every frame rests the body on its lowest point ---- */
  trFalls(L,R,solve);
  return TRCLIPS=L;}

/* Fall unconscious / Rise / Death. Keys are joint angles (degrees) as wrSolve outputs them, carried forward from key to key
   (gbDeathKeys), plus X (hip offset x,z in metres), anc (how firmly each foot is pinned where it stands) and flat (the foot
   stays level). Each frame the measuring troll is posed and dropped onto its lowest point. Fall unconscious starts in the war
   stance; Rise starts from Fall unconscious's last frame and ends in the war stance, so the three chain without a jump. */
function trFalls(L,R,solve){const B=VB.troll,k=B.legS,D2R=Math.PI/180,V=THREE.Vector3;
  const S0=solve(wrP(TR_W,{}),false),K0={X:[S0.pos[0]*k,S0.pos[2]*k],anc:[1,1],flat:[0,0],jaw:[6]};
  for(const c of['h','sp','ch','nk','hd','tL','kL','aL','tR','kR','aR','uL','fL','wL','uR','fR','wR','fist'])K0[c]=S0[c].slice();
  const M=buildTroll(1,{hair:'stringy',bare:true}),JN={};M.traverse(q=>{if(q.userData.joint||q.name==='jaw')JN[q.name]=q;});const body=[];M.traverse(q=>{if(q.isMesh)body.push(q);});
  const corner=new V(),lowest=()=>{let y=1e9;for(const q of body){const p=q.geometry.parameters;for(let i=0;i<8;i++){corner.set((i&1?.5:-.5)*p.width,(i&2?.5:-.5)*p.height,(i&4?.5:-.5)*p.depth).applyMatrix4(q.matrixWorld);if(corner.y<y)y=corner.y;}}return y;};
  const pose=p=>{const P={};for(const c in p)if(JALIAS[c])P[JALIAS[c]]=p[c];const f=p.fist;P.fingers_L=[0,0,-f[0]];P.fingerTips_L=[0,0,-f[0]*.95];P.thumb_L=[f[0]*.15,0,-f[0]*.35];P.fingers_R=[0,0,f[1]];P.fingerTips_R=[0,0,f[1]*.95];P.thumb_R=[f[1]*.15,0,f[1]*.35];
    for(const j of RIG_JOINTS){const b=BASEPOSE[j]||[0,0,0],v=P[j]||[0,0,0];JN[j].rotation.set((b[0]+v[0])*D2R,(b[1]+v[1])*D2R,(b[2]+v[2])*D2R);}JN.jaw.rotation.set(p.jaw[0]*D2R,0,0);};
  const feet=()=>({L:JN.foot_L.getWorldPosition(new V()),R:JN.foot_R.getWorldPosition(new V())});
  /* FC: f(t) gives the keyed pose; ref = where pinned feet belong (the first frame's feet, or the last frame's with refEnd) */
  const FC=(name,dur,f,note,refEnd)=>{let ref=null,full=[0,0];
    if(refEnd){const p=f(dur);pose(p);JN.hips.position.set(p.X[0],B.hipH,p.X[1]);M.updateMatrixWorld(true);ref=feet();}
    const fn=t=>{const p=f(t);
      for(const[i,sd]of[[0,'L'],[1,'R']]){const w=p.flat[i];if(w>0){const a=p['a'+sd].slice();a[0]=a[0]*(1-w)-(p.h[0]+p['t'+sd][0]+p['k'+sd][0])*w;p['a'+sd]=a;}}
      pose(p);JN.hips.position.set(p.X[0],B.hipH,p.X[1]);M.updateMatrixWorld(true);const ft=feet();if(!ref)ref={L:ft.L.clone(),R:ft.R.clone()};
      const wsum=p.anc[0]+p.anc[1];let cx=0,cz=0;if(wsum>1e-3){for(const[i,sd]of[[0,'L'],[1,'R']]){cx+=p.anc[i]*(ref[sd].x-ft[sd].x);cz+=p.anc[i]*(ref[sd].z-ft[sd].z);}cx/=wsum;cz/=wsum;}
      const w=Math.min(1,Math.max(p.anc[0],p.anc[1]));if(w>.999&&!refEnd)full=[cx,cz];const X=[p.X[0]+w*cx+(1-w)*full[0],p.X[1]+w*cz+(1-w)*full[1]];
      JN.hips.position.set(X[0],B.hipH,X[1]);M.updateMatrixWorld(true);const y=-lowest();
      const o={};for(const c in p)if(JALIAS[c]||c==='fist')o[c]=p[c];o.pos=[X[0]/k,y/k,X[1]/k];o.jaw=p.jaw;o.X=X;return o;};
    const c=sampleClip(name,dur,fn,{autoFeet:false,note},B);const T=c.tracks[0].times,Q=[],q=new THREE.Quaternion(),e=new THREE.Euler();
    for(const t of T){const jw=fn(t).jaw[0];q.setFromEuler(e.set(jw*D2R,0,0));Q.push(q.x,q.y,q.z,q.w);}c.tracks.push(new THREE.QuaternionKeyframeTrack('jaw.quaternion',Array.from(T),Q));L.push(c);return{c,fn};};
  /* Fall unconscious: eyes roll up, the arms go limp, the knees buckle onto the ground, the body topples face-first and
     lies flat, head turned to the side, left arm flung forward, right arm along the side */
  const fall=gbDeathKeys(K0,[
    [.25,{flat:[1,1],nk:[-10,0,0],hd:[-18,0,6],uL:[-62,0,18],fL:[-15,0,0],uR:[-62,0,-18],fR:[-15,0,0],fist:[10,10],jaw:[20]},'out'],
    [.6,{h:[26,-6,0],sp:[18,0,0],ch:[20,0,0],nk:[-4,0,0],hd:[10,0,8],tL:[-38,0,4],kL:[80,0,0],tR:[-30,0,-6],kR:[76,0,0],uL:[-58,0,12],uR:[-58,0,-12],fL:[-6,0,0],fR:[-6,0,0],jaw:[24]}],
    [.9,{h:[20,-4,0],sp:[22,0,0],ch:[24,0,0],nk:[6,0,0],hd:[16,0,10],tL:[-22,0,4],kL:[100,0,0],tR:[-18,0,-4],kR:[98,0,0],flat:[0,0],aL:[40,0,0],aR:[40,0,0],anc:[0,0],X:[0,.1],uL:[-60,0,10],uR:[-60,0,-10]},'in'],
    [1.0,{h:[24,-4,0]},'out'],
    [1.35,{h:[56,-2,-4],sp:[16,0,-4],ch:[14,0,0],nk:[-6,0,0],hd:[-6,20,0],tL:[-30,0,6],kL:[70,0,0],tR:[-26,0,-6],kR:[68,0,0],X:[0,.3],uL:[-75,0,26],fL:[-20,0,0],uR:[-40,0,-20]},'in'],
    [1.62,{h:[90,0,-6],sp:[2,0,-2],ch:[0,0,0],nk:[-30,0,0],hd:[-24,62,0],tL:[-6,4,6],kL:[14,0,0],tR:[-6,-4,-6],kR:[14,0,0],aL:[50,0,0],aR:[50,0,0],X:[0,.75],
      uL:[-150,0,30],fL:[-10,0,0],wL:[0,40,0],uR:[16,0,-16],fR:[-8,0,0],wR:[0,40,0],fist:[25,30]},'in'],
    [1.72,{h:[87,0,-6]},'out'],
    [2.4,{h:[90,0,-6],nk:[-32,0,0],hd:[-26,70,0],tL:[-4,4,6],kL:[10,0,0],tR:[-4,-4,-6],kR:[8,0,0],uL:[-156,0,36],fL:[-14,0,0],uR:[18,0,-14],fR:[-10,0,0],fist:[30,35],jaw:[16]},'out']]);
  const F=FC('Fall unconscious',2.4,fall,'Knocked out: knees buckle, topples face-first and lies still (regenerating; play Rise to get up)');
  /* Rise: from where Fall unconscious ends. Fingers twitch, the head lifts, the hands are planted under the shoulders, pushes the
     chest up and drags the knees under, kneels upright on its knuckles (the long arms reach the ground from there), plants the
     right foot, stands up, shakes the head and drops into the war stance */
  const last=F.fn(2.4),RK={};for(const c of['h','sp','ch','nk','hd','tL','kL','aL','tR','kR','aR','uL','fL','wL','uR','fR','wR','fist'])RK[c]=fall(2.4)[c].slice();
  RK.X=last.X.slice();RK.anc=[0,0];RK.flat=[0,0];RK.jaw=[16];
  const tw=(a,b)=>({fist:[a,b]}),rise=gbDeathKeys(RK,[
    [.25,tw(70,10)],[.45,tw(20,60)],[.6,tw(60,15)],[.75,{fist:[25,40],jaw:[6]}],
    [1.15,{nk:[-36,0,0],hd:[-30,10,0],uL:[-80,0,24],fL:[-90,0,0],wL:[0,0,0],uR:[-80,0,-24],fR:[-90,0,0],wR:[0,0,0],fist:[10,10],X:[RK.X[0],RK.X[1]-.1]}],
    [1.7,{h:[60,0,0],sp:[6,0,0],ch:[6,0,0],nk:[-40,0,0],hd:[-24,0,0],tL:[-30,4,6],kL:[70,0,0],tR:[-30,-4,-6],kR:[70,0,0],aL:[60,0,0],aR:[60,0,0],
      uL:[-84,0,12],fL:[-40,0,0],uR:[-84,0,-12],fR:[-40,0,0],fist:[40,40],jaw:[10],X:[RK.X[0]*.8,RK.X[1]-.45]}],
    [2.2,{h:[20,0,0],sp:[10,0,0],ch:[10,0,0],nk:[-24,0,0],hd:[-10,0,0],tL:[-20,0,6],kL:[90,0,0],tR:[-20,0,-6],kR:[90,0,0],uL:[-50,0,12],fL:[-20,0,0],uR:[-50,0,-12],fR:[-20,0,0],fist:[80,80],X:[RK.X[0]*.6,RK.X[1]*.5]}],
    [2.7,{h:[24,-4,0],tR:[-100,0,-6],kR:[100,0,0],aR:[0,0,0],flat:[0,1],anc:[0,1],X:[RK.X[0]*.4,RK.X[1]*.35]}],
    [3.2,{h:[34,-6,0],sp:[16,-2,0],ch:[22,-4,0],nk:[-14,0,0],hd:[-14,0,0],tL:[-50,0,4],kL:[80,0,0],aL:[20,0,0],tR:[-80,0,-6],kR:[90,0,0],uL:[-50,0,20],fL:[-30,0,0],uR:[-50,0,-20],fR:[-30,0,0],fist:[40,40],flat:[.5,1],anc:[.5,1],X:[RK.X[0]*.15,RK.X[1]*.15]}],
    [3.7,Object.assign({},K0,{hd:[K0.hd[0],K0.hd[1]+26,0],jaw:[12]})],
    [3.9,Object.assign({},K0,{hd:[K0.hd[0],K0.hd[1]-26,0],jaw:[8]})],
    [4.1,Object.assign({},K0,{hd:[K0.hd[0],K0.hd[1]+18,0],jaw:[10]})],
    [4.6,K0]]);
  FC('Rise',4.6,rise,'Regenerated: twitches, pushes up, kneels on its knuckles, plants a foot, stands and shakes the head, ends in the war stance',true);
  /* Death: struck down for good. Staggers back, the knees give, sits down hard and falls onto the back, arms flung out */
  FC('Death',2.6,gbDeathKeys(K0,[
    [.15,{flat:[1,1],h:[4,-14,0],sp:[-10,-2,0],ch:[-14,-2,0],nk:[-30,0,0],hd:[-24,0,0],uL:[-50,0,40],fL:[-30,0,0],uR:[-50,0,-40],fR:[-30,0,0],fist:[20,20],jaw:[30]},'out'],
    [.45,{h:[0,-8,0],sp:[-4,0,0],ch:[-6,0,0],nk:[-10,0,0],hd:[0,0,0],tL:[-50,0,6],kL:[90,0,0],tR:[-44,0,-8],kR:[84,0,0],X:[0,-.1],uL:[-30,0,30],uR:[-30,0,-30],jaw:[24]}],
    [.7,{h:[-35,-4,4],tL:[-80,0,10],kL:[100,0,0],tR:[-74,0,-12],kR:[96,0,0],X:[0,-.3],uL:[-60,0,40],uR:[-55,0,-50]},'in'],
    [1.05,{h:[-80,0,4],sp:[-6,0,0],ch:[-4,0,0],nk:[16,0,0],hd:[10,0,10],tL:[-60,0,12],kL:[70,0,0],tR:[-55,0,-14],kR:[65,0,0],anc:[0,0],flat:[0,0],aL:[20,0,0],aR:[20,0,0],X:[0,-.5],uL:[-40,0,60],uR:[-30,0,-70],fL:[-20,0,0],fR:[-15,0,0]},'in'],
    [1.15,{h:[-88,0,4],nk:[24,0,0],hd:[18,0,6],tL:[-40,8,14],kL:[60,0,0],tR:[-30,-10,-16],kR:[50,0,0],uL:[20,0,80],uR:[0,0,-85],fL:[-5,0,0],fR:[-5,0,0]},'out'],
    [1.3,{h:[-84,0,4],hd:[12,0,4]}],
    [1.9,{h:[-88,0,4],sp:[-4,0,0],ch:[-2,0,0],nk:[20,0,0],hd:[20,30,0],tL:[-24,8,14],kL:[40,0,0],aL:[0,0,0],tR:[-12,-10,-16],kR:[24,0,0],aR:[40,0,0],uL:[30,0,82],fL:[0,0,0],wL:[0,0,-30],uR:[20,0,-80],fR:[0,0,0],wR:[0,0,0],fist:[35,30],jaw:[34]},'out'],
    [2.6,{}]]),'Struck down for good: staggers back, sits down hard and falls onto the back, jaw hanging open');}

ASSETS.push({id:'troll',folder:'characters/enemies/brutes',name:'Troll',kind:'character',variants:true,defaultSeed:1,groundR:5.2,build:(s,o)=>buildTroll(s,o||{}),
  opts:[{key:'skin',label:'Skin',choices:[['random','Random'],...Object.entries(TR_SKIN).map(([kk,v])=>[kk,v[1].charAt(0).toUpperCase()+v[1].slice(1)])],def:'random'},
    {key:'hair',label:'Hair',choices:[['random','Random'],['stringy','Stringy'],['mane','Matted mane'],['bald','Bald']],def:'random'}],
  desc:'Lean, hunched troll, about 4 m standing straight (about 3 m hunched): long legs, ribs and spine knobs showing, a hump, very long arms with huge clawed hands, an ugly head with a long drooping nose, a wide mouth with jagged teeth that opens, big pointed ears and small deep-set eyes. Skin moss green, stone grey, blue-grey, pale olive, bark brown or swamp teal; stringy hair, a matted mane or bald; ragged hide kilt and rope belt; sometimes moss, warts, a belly scar, bones on the belt, an iron ear ring. Unarmed: idle (sniffs the air), loping walk and run; war-mode idle, stalk and charge; roar, backhand swipe, overhead claw rake, two-fisted ground slam, grab and bite, low sweep, hit, heavy hit; fall unconscious and rise (it regenerates), and a death.'});
