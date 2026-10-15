/* ======================= IMP: small winged fiend (Enemies → Hell) =======================
   About 1 m to the top of the head (1.1 m to the horn tips): a pot-bellied little devil with a big head, a wide grin full of
   pointed teeth and a lower jaw that opens (g_jaw), long pointed ears, horns, glowing eyes, thin arms with big three-clawed hands,
   clawed feet, a pair of bat wings on the back (iwing_{L,R} with a folding outer half iwingO_{L,R}) and a long tail of six segments
   (itail_0..5) ending in a spade. It never lands: every clip flies; the wings buzz fast (a beat every 0.24 s, 0.16 s in Fly).
   Built from its own meshes on the villager's 25 joints, so the warrior's IK (wrSolve) fits unchanged. Clip machinery after the
   vampire beast: hand targets and elbow poles keyed in the chest's frame (pole search against upper-arm roll), wrists keyed, feet
   keyed in the hips' frame. Whole-body flips and rolls (fl) turn about a point above the hips with the head carried along.
   Wings and tail are rigid groups driven by baked tracks; the tail folds up wherever it would go into the ground. */
VB.imp=Object.assign({},VB.male,{thigh:.2,shin:.19,ankle:.04,hipOff:.03,spine:.06,chest:.08,neck:.17,headY:.03,shW:.13,ua:.15,fa:.14,g:.55,hipW:.05,sex:'male'});
{const b=VB.imp;b.key='imp';b.hipH=b.thigh+b.shin+b.ankle+b.hipOff;b.legS=(b.thigh+b.shin)/.84;b.tS=(b.spine+b.chest)/.3;b.cS=b.neck/.22;}
const IMP_SKIN={crimson:['#9c3e3a','crimson'],dark:['#6a2a26','dark red'],ember:['#aa643c','ember orange'],soot:['#463434','soot black']};
const IMP_EYES={yellow:['#fff2d0','#ffd890','yellow glowing eyes'],orange:['#fff2d0','#ff8a2a','orange glowing eyes'],green:['#ecfce0','#b4f088','green glowing eyes']};
const IMP_HORN={short:'short horns',swept:'swept-back horns',curved:'curved horns'};
const IMP_TAIL=8,IMP_TL=.13,IMP_PIV=.15;
/* the tail curl is keyed as six values (tc) spread over the eight segments, or one per segment */
const impTc=(tc,i)=>{if(tc.length===IMP_TAIL)return tc[i];const f=i*5/(IMP_TAIL-1),j=Math.min(4,Math.floor(f));return(tc[j]+(tc[j+1]-tc[j])*(f-j))*6/IMP_TAIL;};

function buildImp(seed,o={}){const B=VB.imp,r=mulberry32(((seed*2654435761)>>>0)^0x1f3d),pick=a=>a[Math.floor(r()*a.length)],root=new THREE.Group();root.userData.lights=[];
  const skin0=pick(['crimson','crimson','dark','ember','soot']),eye0=pick(['yellow','yellow','orange','green']),horn0=pick(Object.keys(IMP_HORN)),hornDark=r()<.6,goatee=r()<.4,notch=r()<.3;
  const opt=(k,d)=>o[k]&&o[k]!=='random'?o[k]:d,skinK=opt('skin',skin0),eyeK=opt('eyes',eye0),hornK=opt('horns',horn0);
  const shade=(h,f)=>'#'+new THREE.Color(h).multiplyScalar(f).getHexString(),SK=IMP_SKIN[skinK][0];
  const skin=bm(SK,'skin'),skinD=bm(shade(SK,.75),'skin'),skinX=bm(shade(SK,.55),'skin'),belly=bm('#'+new THREE.Color(SK).lerp(new THREE.Color('#e0a070'),.3).getHexString(),'skin'),
    dark=bm('#140a0a','plain'),claw=bm('#1a1414','plain'),teeth=bm('#efe6cc','plain'),gum=bm('#511d1f','plain'),tongue=bm('#d0505a','plain'),
    horn=bm(hornDark?'#2a2222':'#d6c49a','plain'),hornD=bm(hornDark?'#3e3434':'#b4a078','plain'),memb=bm(shade(SK,skinK==='soot'?.8:.45),'plain'),cloth=bm('#2e2018','cloth'),belt=bm('#4a3020','plain');
  const ey=IMP_EYES[eyeK],eyeM=wrGlow(ey[0],ey[1],1.8,pxTex('plain'));
  const hips=J('hips',root,0,B.hipH,0),spine=J('spine',hips,0,B.spine,0),chest=J('chest',spine,0,B.chest,0),neck=J('neck',chest,0,B.neck,0),head=J('head',neck,0,B.headY,0);
  /* pelvis with a ragged loincloth on a cord */
  bx(hips,.17,.1,.12,skin,0,-.01,0);bx(hips,.175,.022,.125,belt,0,.035,0);bx(hips,.09,.11,.014,cloth,0,-.05,.066);bx(hips,.06,.03,.014,cloth,-.01,-.115,.066);bx(hips,.1,.1,.014,cloth,0,-.04,-.066);
  /* pot belly, lighter in front */
  bx(spine,.17,.13,.15,skin,0,.03,.01);bx(spine,.12,.1,.02,belly,0,.03,.085);bx(spine,.02,.02,.01,skinD,0,.03,.096);
  /* chest: small, hunched, a lighter patch in front, shoulder blades */
  bx(chest,.2,.17,.13,skin,0,.085,0);bx(chest,.13,.1,.02,belly,0,.08,.066);bx(chest,.16,.08,.05,skin,0,.12,-.07);for(const s of[-1,1])bx(chest,.06,.07,.02,skinD,s*.05,.1,-.095);
  /* neck */
  bx(neck,.08,.06,.08,skin,0,.01,0);
  /* head: big, a heavy brow slanting down to the nose, glowing eyes, a hooked nose, wide grin with pointed teeth; the lower jaw
     (g_jaw) carries the chin, the lower teeth and the tongue */
  bx(head,.22,.16,.2,skin,0,.115,.0);bx(head,.18,.03,.17,skin,0,.205,-.005);bx(head,.2,.06,.04,skinD,0,.1,-.1);
  for(const s of[-1,1]){bx(head,.095,.03,.035,skinD,s*.05,.15,.095,0,0,s*.32);bx(head,.06,.035,.01,dark,s*.05,.118,.1);bx(head,.04,.022,.01,eyeM,s*.05,.118,.105);
    bx(head,.04,.05,.05,skin,s*.09,.07,.075);}
  bx(head,.034,.05,.04,skin,0,.095,.11);bx(head,.026,.024,.03,skinD,0,.068,.125);for(const s of[-1,1])bx(head,.01,.01,.01,dark,s*.01,.062,.138);
  bx(head,.16,.03,.06,gum,0,.045,.075);bx(head,.17,.012,.02,skinX,0,.06,.1);
  for(let i=0;i<7;i++){const x=(i-3)*.022;bx(head,.012,.022,.01,teeth,x,.038,.098-Math.abs(x)*.2);}
  if(notch)bx(head,.02,.02,.02,skinX,-.08,.18,.06);
  const jw=new THREE.Group();jw.name='g_jaw';head.add(jw);jw.position.set(0,.04,-.04);
  bx(jw,.18,.045,.15,skin,0,-.018,.04);bx(jw,.07,.04,.05,skin,0,-.03,.115);bx(jw,.16,.016,.1,gum,0,.008,.06);bx(jw,.05,.012,.08,tongue,0,.012,.06);
  for(let i=0;i<6;i++){const x=(i-2.5)*.024;bx(jw,.012,.02,.01,teeth,x,.014,.135-Math.abs(x)*.25);}
  if(goatee){bx(jw,.03,.05,.03,dark,0,-.06,.125);bx(jw,.018,.03,.02,dark,0,-.095,.13);}
  /* ears: long, pointed, out to the sides and up */
  for(const s of[-1,1]){const eg=new THREE.Group();eg.position.set(s*.105,.125,-.015);eg.rotation.set(0,-s*.2,s*.3);head.add(eg);
    [[.05,.06,.025],[.045,.046,.065],[.04,.032,.1],[.03,.018,.13]].forEach(([w,h,x])=>{bx(eg,w,h,.02,skin,s*x,0,0);bx(eg,w*.7,h*.55,.008,skinX,s*x,0,.012);});
    if(notch&&s<0)bx(eg,.02,.02,.03,dark,s*.08,.02,0);}
  /* horns, point outwards and up */
  const HS={short:[[.04,.06,-.45,0],[.032,.05,-.2,0],[.022,.04,.15,0]],swept:[[.04,.06,-.25,-.3],[.034,.06,-.15,-.65],[.026,.06,-.05,-1.0],[.018,.05,.05,-1.3]],
    curved:[[.04,.055,-1.0,0],[.034,.055,-.6,0],[.028,.05,-.15,.1],[.02,.045,.35,.15]]}[hornK];
  for(const s of[-1,1]){let g=new THREE.Group();g.position.set(s*.07,.2,.02);head.add(g);
    HS.forEach(([w,h,rz,rx],i)=>{const q=new THREE.Group();q.rotation.set(i?rx-HS[i-1][3]:rx,0,s*(i?rz-HS[i-1][2]:rz));g.add(q);bx(q,w,h,w,i%2?hornD:horn,0,h/2,0);const n=new THREE.Group();n.position.y=h*.9;q.add(n);g=n;});}
  /* arms: thin, knobby elbows; big hands with three hooked claws and a thumb (fingers_ curl about z towards the palm) */
  for(const[sd,s]of[['L',1],['R',-1]]){const sh=J('shoulder_'+sd,chest,s*B.shW*.325,.165*B.cS,0),ua=J('upperArm_'+sd,sh,s*B.shW*.675,0,0),fa=J('foreArm_'+sd,ua,0,-B.ua,0),hd=J('hand_'+sd,fa,0,-B.fa,0);
    const fg=J('fingers_'+sd,hd,0,-.05,0),ft=J('fingerTips_'+sd,fg,0,-.04,0),th=J('thumb_'+sd,hd,-s*.018,-.02,.022),so=J('socket_'+sd,hd,0,0,0);so.userData.socket=true;
    bx(ua,.06,.06,.06,skin,0,-.005,0);bx(ua,.045,B.ua,.045,skin,0,-B.ua/2,0);bx(fa,.05,.04,.05,skinD,0,-.005,0);bx(fa,.04,B.fa,.04,skin,0,-B.fa/2,0);
    bx(hd,.035,.055,.06,skin,0,-.025,0);
    for(const z of[-.02,0,.02]){bx(fg,.016,.045,.016,skin,0,-.02,z);bx(ft,.012,.04,.012,claw,-s*.004,-.018,z,0,0,s*.25);}
    bx(th,.016,.035,.016,skin,0,-.012,0,.4,0,0);bx(th,.011,.028,.011,claw,0,-.04,.01,.6,0,0);}
  /* legs: thin; clawed feet with three toes and a heel spur */
  for(const[sd,s]of[['L',1],['R',-1]]){const th=J('thigh_'+sd,hips,s*B.hipW,-(B.hipOff+.01),0),sn=J('shin_'+sd,th,0,-B.thigh,0),ft=J('foot_'+sd,sn,0,-B.shin,0);
    bx(th,.07,.06,.075,skin,0,-.02,0);bx(th,.06,B.thigh,.065,skin,0,-B.thigh/2,0);bx(sn,.055,.045,.06,skinD,0,0,.005);bx(sn,.045,B.shin,.05,skin,0,-B.shin/2,0);
    bx(ft,.055,.04,.075,skin,0,-.024,.018);bx(ft,.025,.025,.03,claw,0,-.03,-.03);
    for(const x of[-.018,0,.018]){bx(ft,.016,.016,.035,skinD,x,-.034,.07);bx(ft,.01,.012,.022,claw,x,-.038,.095,.4,0,0);}}
  /* wings on the shoulder blades: inner bone and panel, then the folding outer half with two finger bones and a stepped panel
     (local x outwards, membrane hanging down from the leading edge; the clips pitch it back) */
  for(const[sd,s]of[['L',1],['R',-1]]){const w=new THREE.Group();w.name='iwing_'+sd;w.position.set(s*.05,.13,-.085);chest.add(w);
    const a=.26,b=.32;bx(w,.045,.045,.045,skinD,0,0,0);bx(w,a,.026,.026,skinD,s*a/2,0,0);bx(w,a-.02,.2,.008,memb,s*a/2,-.105,0);bx(w,a*.55,.05,.008,memb,s*a*.55,-.23,0);
    const wo=new THREE.Group();wo.name='iwingO_'+sd;wo.position.set(s*a,0,0);w.add(wo);bx(wo,.035,.035,.035,skinD,0,0,0);
    bx(wo,b,.022,.022,skinD,s*b/2,0,0);bx(wo,.018,.03,.03,claw,s*(b+.01),.012,0,0,0,s*.6);
    [[.25,-.55],[.21,-1.05]].forEach(([L,an])=>bx(wo,L,.016,.016,skinD,s*Math.cos(an)*L/2,Math.sin(an)*L/2,.004,0,0,s*an));
    [[.08,.2],[.08,.155],[.08,.11],[.08,.065]].forEach(([wd,h],i)=>bx(wo,wd+.002,h,.008,memb,s*(.04+i*.08),-h/2,0));
    for(const i of[0,1,2])bx(wo,.04,.02,.007,skinX,s*(.08+i*.08),-[.18,.135,.09][i]-.004,0);}
  /* tail: six segments from the hips back, each curls about x and sways about y; a spade at the tip */
  {let p=hips;for(let i=0;i<IMP_TAIL;i++){const g=new THREE.Group();g.name='itail_'+i;g.position.set(0,i?0:-.03,i?-IMP_TL:-.06);p.add(g);const t=.036-i*.0025;
    bx(g,t,t,IMP_TL+.01,i%2?skinD:skin,0,0,-IMP_TL/2);p=g;}
    bx(p,.012,.065,.065,skinD,0,0,-IMP_TL-.035,Math.PI/4,0,0);bx(p,.016,.03,.03,skinX,0,0,-IMP_TL-.01,Math.PI/4,0,0);}
  const joints=[];root.traverse(q=>{if(q.userData.joint&&!q.userData.socket)joints.push(q);});root.userData.joints=joints;
  if(o.bare)return root;
  if(!o.noClips){root.userData.clips=impClips();const mx=new THREE.AnimationMixer(root);mx.clipAction(root.userData.clips[0]).play();mx.update(0);}
  root.userData.ground=1.4;
  const cap=s=>s.charAt(0).toUpperCase()+s.slice(1);
  root.userData.variantText=`${cap(IMP_SKIN[skinK][1])} skin, ${ey[2]}, ${hornDark?'black':'bone'} ${IMP_HORN[hornK]}${goatee?', a goatee':''}${notch?', a notched ear':''}.`;
  return root;}

/* ---------- clips ----------
   Pose channels (metres and degrees):
   alt hip height above standing, HP hip offset [x,0,z]; h/sp/ch/nk/hd body joints (wrSolve keeps the head level as the body leans);
   fl whole-body flip [pitch, yaw, roll] about a point IMP_PIV above the hips, the head carried along (a backflip, a barrel roll, a spin);
   FL/FR ankle [x,y,z] in the hips' frame and the foot's pitch (toe down +); KN knee direction in the hips' frame;
   gL/gR hand targets and pL/pR elbow poles in the chest's frame; wl/wr wrist bend [x,y,z]; fs claw curl [L,R] (° , negative spreads);
   jw jaw; wg wing pose [elevation, sweep back, pitch back, outer fold] and ba wing-beat amplitude (0 holds wg);
   tc tail curl per segment, tw tail wave amplitude, tsw tail sway. */
const IMPCLIPS={};
const impM=v=>[-v[0],v[1],v[2]];
/* hover: upright, a little hunched, legs dangling, claws loose, tail hanging back and curling up */
const IMP_H={alt:[.62],HP:[0,0,0],h:[10,0,0],sp:[4,0,0],ch:[6,0,0],nk:[4,0,0],hd:[-6,0,0],fl:[0,0,0],FL:[.06,-.35,.04,35],FR:[-.06,-.34,0,30],KN:[0,0,1],
  gL:[.18,-.02,.1],gR:[-.18,-.02,.1],pL:[.3,-.4,-1],pR:[-.3,-.4,-1],wl:[0,0,0],wr:[0,0,0],fs:[25,25],pw:[1],cl:[0,0],jw:[.06],
  wg:[16,28,25,10],ba:[1],tc:[-45,12,18,20,18,14],tw:[1],tsw:[0]};
/* war hover: lower, leaning in, claws up and spread, knees drawn up, grinning, tail raised */
const IMP_W=wrP(IMP_H,{alt:[.56],h:[20,0,0],sp:[6,0,0],ch:[4,0,0],nk:[6,0,0],hd:[-8,0,0],FL:[.07,-.27,.12,10],FR:[-.07,-.28,.09,8],KN:[0,.5,1],
  gL:[.2,.1,.17],gR:[-.2,.1,.17],pL:[.6,-.6,-.4],pR:[-.6,-.6,-.4],wl:[-15,0,0],wr:[-15,0,0],fs:[-10,-10],jw:[.3],wg:[18,25,22,8],tc:[-25,25,25,22,18,12]});
/* one wing beat at phase u (0 = wings up): offsets added to wg, scaled by ba */
function impBeat(u){const a=Math.PI*2*u,c=Math.cos(a),s=Math.sin(a);return[36*c,8*s,10*s,26*Math.max(0,-s)];}
function impRig(){const B=VB.imp,m=buildImp(1,{bare:true}),J={};m.traverse(q=>{if(q.userData.joint||/^(iwing|itail)/.test(q.name))J[q.name]=q;});
  const tail=[];for(let i=0;i<IMP_TAIL;i++)tail.push(J['itail_'+i]);return{m,J,B,two:false,tail};}

function impClips(){if(IMPCLIPS.all)return IMPCLIPS.all;const B=VB.imp,D=Math.PI*2,R2=Math.PI/180,S=Math.sin,C=Math.cos,V=THREE.Vector3,Q=THREE.Quaternion,E3=THREE.Euler,L=[],R=impRig(),k=B.legS;
  const fk=B.ankle/.06,lw=.13*B.g,hs=.07*fk,zt=.03*B.g+lw*.8,zh=.03*B.g-lw*.8,low=p=>{const a=p*R2;return Math.min(-hs*C(a)-zt*S(a),-hs*C(a)-zh*S(a));};
  let PP=null,MEM=null;const M4=new THREE.Matrix4(),vv=new V();
  /* lowest box corner of the meshes directly inside a group (not its child groups) */
  const lowOwn=g=>{g.updateMatrixWorld(true);let y=1e9;for(const q of g.children){if(!q.isMesh)continue;const P=q.geometry.parameters;for(let i=0;i<8;i++){vv.set((i&1?.5:-.5)*P.width,(i&2?.5:-.5)*P.height,(i&4?.5:-.5)*P.depth).applyMatrix4(q.matrixWorld);if(vv.y<y)y=vv.y;}}return y;};
  const lowAll=g=>{g.updateMatrixWorld(true);let y=1e9;g.traverse(q=>{if(!q.isMesh)return;const P=q.geometry.parameters;for(let i=0;i<8;i++){vv.set((i&1?.5:-.5)*P.width,(i&2?.5:-.5)*P.height,(i&4?.5:-.5)*P.depth).applyMatrix4(q.matrixWorld);if(vv.y<y)y=vv.y;}});return y;};
  const wingQ=(s,el,sw,pi)=>new Q().setFromEuler(new E3(pi*R2,s*sw*R2,s*el*R2,'YZX'));
  const solve=(p,t,o)=>{const fl=p.fl,flq=new Q().setFromEuler(new E3(fl[0]*R2,fl[1]*R2,fl[2]*R2)),cv=new V(0,IMP_PIV,0),dv=cv.clone().sub(cv.clone().applyQuaternion(flq));
    const h=[p.h[0]+fl[0],p.h[1]+fl[1],p.h[2]+fl[2]],hd=[p.hd[0]+.7*fl[0],p.hd[1]+.9*fl[1],p.hd[2]+.8*fl[2]];
    const hq=new Q().setFromEuler(new E3(h[0]*R2,h[1]*R2,h[2]*R2)),HP=[p.HP[0]+dv.x,0,p.HP[2]+dv.z],alt=p.alt[0]+dv.y,hp=new V(HP[0],B.hipH+alt,HP[2]);
    const w={h,sp:p.sp,ch:p.ch,nk:p.nk,hd,HP:[HP[0]/k,alt/k,HP[2]/k],fist:[0,0]};
    for(const sd of['L','R']){const F=p['F'+sd],A=new V(F[0],F[1],F[2]).applyQuaternion(hq).add(hp),pit=h[0]+F[3],kn=new V(...p.KN);if(sd==='R')kn.x=-kn.x;
      w['F'+sd]=[A.x/k,A.z/k,h[1],(A.y+low(pit))/k,pit];w['n'+sd]=kn.applyQuaternion(hq).toArray();}
    for(const[sd,i]of[['L',0],['R',1]])R.J['shoulder_'+sd].rotation.set(p.cl[i]*R2,0,0);
    wrSolve(R,w);R.m.updateMatrixWorld(true);
    const cw=R.J.chest,fq=cw.getWorldQuaternion(new Q()),co=cw.getWorldPosition(new V()),nx={};
    for(const sd of['L','R']){const G=new V(...p['g'+sd]).applyQuaternion(fq).add(co);w['g'+sd]=[(G.x-HP[0])/k,G.y/k,(G.z-HP[2])/k];w['d'+sd]=[0,-1,0];
      /* elbow pole: the keyed one, unless it would roll the upper arm too far about itself (search round the shoulder-to-hand line) */
      const pref=new V(...p['p'+sd]).applyQuaternion(fq).normalize(),Sh=R.J['upperArm_'+sd].getWorldPosition(new V()),shq=R.J['shoulder_'+sd].getWorldQuaternion(new Q()).invert();
      const T=G.clone().sub(Sh),d=Math.min(Math.max(T.length(),.03),(B.ua+B.fa)*.999),u=T.normalize(),al=Math.acos(Math.min(1,Math.max(-1,(B.ua*B.ua+d*d-B.fa*B.fa)/(2*B.ua*d))));
      const b1=pref.clone().addScaledVector(u,-pref.dot(u));if(b1.lengthSq()<1e-6)b1.set(0,0,-1).addScaledVector(u,u.z);b1.normalize();const b2=new V().crossVectors(u,b1);
      let prev=PP&&PP[sd]?PP[sd].clone().addScaledVector(u,-PP[sd].dot(u)):null;if(prev&&prev.lengthSq()<.04)prev=null;if(prev)prev.normalize();let best=b1,bc=1e9;
      for(let i=0;i<96;i++){const f=i/96*D,pp=b1.clone().multiplyScalar(C(f)).addScaledVector(b2,S(f)),e=u.clone().multiplyScalar(C(al)).addScaledVector(pp,S(al));
        const Y=e.clone().negate(),Z=pp.clone().addScaledVector(e,-pp.dot(e)).normalize().negate(),lq=shq.clone().multiply(new Q().setFromRotationMatrix(M4.makeBasis(new V().crossVectors(Y,Z),Y,Z)));
        let rr=Math.abs(2*Math.atan2(lq.y,lq.w));if(rr>Math.PI)rr=D-rr;const c=2*p.pw[0]*(1-C(f))+3*(rr/1.4)**4+(prev?1.5*(1-pp.dot(prev)):0);if(c<bc){bc=c;best=pp;}}
      nx[sd]=best;w['p'+sd]=best.toArray();}
    PP=nx;
    const s=wrSolve(R,w);s.wL=p.wl.slice();s.wR=[p.wr[0],-p.wr[1],-p.wr[2]];s.fist=[p.fs[0],p.fs[1]];s.sL=[p.cl[0],0,0];s.sR=[p.cl[1],0,0];
    /* feet: the hips' orientation turned by the keyed pitch, set after the solve (wrSolve keeps feet level for the ground; a rolling imp needs them to roll along) */
    for(const sd of['L','R']){const qf=hq.clone().multiply(new Q().setFromAxisAngle(new V(1,0,0),p['F'+sd][3]*R2)),ql=R.J['shin_'+sd].getWorldQuaternion(new Q()).invert().multiply(qf),e=new E3().setFromQuaternion(ql,'XYZ');s['a'+sd]=[e.x/R2,e.y/R2,e.z/R2];R.J['foot_'+sd].quaternion.copy(ql);}
    for(const sd of['L','R'])R.J['hand_'+sd].rotation.set(s['w'+sd][0]*R2,s['w'+sd][1]*R2,s['w'+sd][2]*R2);R.m.updateMatrixWorld(true);
    /* wings: the keyed pose plus the beat; lifted (elevation) wherever they would touch the ground */
    const bt=impBeat(o.bu?o.bu(t):t/(o.beat||.24)),ba=p.ba[0],wv=p.wg.map((v,i)=>v+bt[i]*ba),wing={};
    for(const[sd,s1]of[['L',1],['R',-1]]){const g=R.J['iwing_'+sd],go=R.J['iwingO_'+sd];let el=wv[0];go.quaternion.setFromAxisAngle(new V(0,1,0),s1*wv[3]*R2);
      g.quaternion.copy(wingQ(s1,el,wv[1],wv[2]));if(lowAll(g)<.012)for(let dd=3;dd<=120;dd+=3){g.quaternion.copy(wingQ(s1,el+dd,wv[1],wv[2]));if(lowAll(g)>=.012){el+=dd;break;}}
      wing[sd]=[g.quaternion.clone(),go.quaternion.clone()];}
    /* tail: curl and a travelling wave; a segment that would go into the ground curls up (or down) just enough */
    const ph=D*t/(o.tp||.96),tq=[];
    for(let i=0;i<IMP_TAIL;i++){const g=R.tail[i];let ax=impTc(p.tc,i)+p.tw[0]*6*S(ph-.7*i);const ay=p.tsw[0]/IMP_TAIL+p.tw[0]*6*S(ph-.7*i+1.3);
      const set=a=>g.quaternion.setFromEuler(new E3(a*R2,ay*R2,0,'YXZ'));set(ax);
      if(lowOwn(g)<.012){let ok=null;for(let dd=3;dd<=180&&ok===null;dd+=3)for(const sg of[1,-1]){set(ax+sg*dd);if(lowOwn(g)>=.012){ok=ax+sg*dd;break;}}ax=ok===null?ax:ok;set(ax);}
      tq.push(g.quaternion.clone());}
    MEM={wing,tq};return s;};
  /* extra tracks: wings, tail, jaw */
  const extra=(c,fn,M)=>{const T=Array.from(c.tracks[0].times),q=new Q(),e=new E3(),Tr={},add=(n,v)=>{(Tr[n]||(Tr[n]=[])).push(...v);};
    T.forEach((t,i)=>{const p=fn(t),m=M[i];
      for(const sd of['L','R']){add(`iwing_${sd}.quaternion`,m.wing[sd][0].toArray());add(`iwingO_${sd}.quaternion`,m.wing[sd][1].toArray());}
      m.tq.forEach((tq,j)=>add(`itail_${j}.quaternion`,tq.toArray()));
      q.setFromEuler(e.set(p.jw[0],0,0));add('g_jaw.quaternion',[q.x,q.y,q.z,q.w]);});
    for(const n in Tr)c.tracks.push(new THREE.QuaternionKeyframeTrack(n,T,Tr[n]));};
  const CC=(name,dur,fn,o={})=>{PP=null;if(o.loop){solve(fn(dur-dur/12),dur-dur/12,o);for(let i=0;i<12;i++)solve(fn(dur*i/12),dur*i/12,o);}const M=[],c=sampleClip(name,dur,t=>{const s=solve(fn(t),t,o);M.push(MEM);return s;},Object.assign({autoFeet:false,fps:60},o),B);
    extra(c,fn,M);if(o.next!==undefined){if(o.next)c.next=o.next;}else if(!o.loop)c.next='Idle (war mode)';if(o.hold)c.hold=true;if(o.speed)c.speed=o.speed;L.push(c);return c;};
  const KC=(name,dur,keys,note,o={})=>{const f=wrKeys(keys.map(kk=>{const q=wrP(o.base||IMP_W,kk[1]||{});q.tc=Array.from({length:IMP_TAIL},(_,i)=>impTc(q.tc,i));return[kk[0],q];}));return CC(name,dur,t=>{const p=f(t);return o.add?o.add(t,p):p;},Object.assign({note},o));};
  const both=(o,F)=>Object.assign(o,{FL:F,FR:[-F[0],F[1],F[2],F[3]]});
  const arms=(o,g,pl,wl)=>Object.assign(o,{gL:g,gR:impM(g)},pl?{pL:pl,pR:impM(pl)}:{},wl?{wl,wr:wl}:{});

  /* ---- flying ---- */
  CC('Idle',2.88,t=>{const b=S(D*t/.24),a=D*t/2.88;return wrP(IMP_H,{alt:[.62+.018*b+.03*S(a*2)],HP:[.04*S(a),0,.02*S(a*2)],h:[10+2*S(a*2),0,3*S(a)],sp:[4+1.5*S(a*3),0,0],
    hd:[-6+4*S(a*2+1),28*S(a+.6),4*S(a)],gL:[.18,-.02+.015*S(a*3),.1+.02*S(a*2)],gR:[-.18,-.02+.015*S(a*3+1),.1+.02*S(a*2+1)],fs:[25+15*S(a*4),25+15*S(a*4+2)],
    FL:[.06,-.35,.04+.03*S(a*3),35+8*S(a*3)],FR:[-.06,-.34,.0+.03*S(a*3+1.4),30+8*S(a*3+1.4)],jw:[.06+.08*Math.max(0,S(a*2-1))],tsw:[20*S(a)]});},
    {loop:true,tp:.96,note:'Hovers on fast buzzing wing beats, bobbing and drifting, legs dangling, tail swishing, looking round with a grin'});
  CC('Fly',.96,t=>{const b=S(D*t/.16),a=D*t/.96;return wrP(IMP_H,{alt:[.66+.02*b],h:[64,0,4*S(a)],sp:[4,0,0],ch:[4,0,0],nk:[-8,0,0],hd:[-14,0,0],
    gL:[.15,-.18,-.04],gR:[-.15,-.18,-.04],pL:[1,.2,-.4],pR:[-1,.2,-.4],fs:[40,40],FL:[.055,-.37,-.05,72],FR:[-.055,-.37,-.07,74],KN:[0,-.2,1],
    wg:[18,30,66,8],tc:[-74,0,4,4,4,4],tw:[.8],jw:[.1]});},{loop:true,beat:.16,tp:.96,speed:6,note:'Darts forward almost level on a blur of wing beats, arms tucked, legs and tail streaming behind, in place, 6 m/s'});
  CC('Idle (war mode)',1.92,t=>{const a=D*t/.96,b=S(D*t/.24);return wrP(IMP_W,{alt:[.56+.02*b+.04*S(a*2)],HP:[.12*S(a),0,.03*S(a*2)],h:[20,6*S(a),-10*S(a)],ch:[4,-6*S(a),0],
    hd:[-8,-8*S(a),6*S(a)],gL:[.2,.1+.02*S(a*2),.17],gR:[-.2,.1+.02*S(a*2+1),.17],fs:[-10+20*Math.max(0,S(a*2)),-10+20*Math.max(0,-S(a*2))],jw:[.3+.12*S(a*2)],tsw:[-30*S(a)]});},
    {loop:true,tp:.96,note:'Weaves quickly side to side in the air, claws up and spread, grinning, ready to dart in or away'});
  CC('Fly (war mode)',.96,t=>{const a=D*t/.96,b=S(D*t/.16);return wrP(IMP_W,{alt:[.58+.02*b+.06*S(a*2)],HP:[.22*S(a),0,0],h:[44,-10*C(a),-22*C(a)],sp:[6,0,0],ch:[4,0,0],hd:[-10,10*C(a),0],
    gL:[.2,.04,.2],gR:[-.2,.04,.2],fs:[-15,-15],FL:[.06,-.32,.0,40],FR:[-.06,-.32,-.02,40],KN:[0,.2,1],wg:[22,26,62,8],tc:[-60,8,8,8,8,8],tsw:[40*C(a)],jw:[.45]});},
    {loop:true,beat:.16,tp:.96,speed:5,note:'Zigzags forward in quick banking swerves, claws out, mouth wide, in place, 5 m/s'});

  /* ---- dodges ---- */
  /* Dodge left / right: a barrel roll that throws it about 0.9 m to the side, wings tucked, then it darts back */
  for(const[nm,s]of[['Dodge left',1],['Dodge right',-1]]){const T={HP:[s*.5,0,0],alt:[.62],fl:[0,0,-s*170],h:[10,0,-s*10],FL:[.07,-.22,.12,10],FR:[-.07,-.22,.12,10],KN:[0,.8,.6],
      gL:[.13,-.02,.13],gR:[-.13,-.02,.13],fs:[60,60],wg:[-10,40,40,70],ba:[0],tc:[0,30,30,30,30,20],tw:[0],jw:[.2]};
    KC(nm,.96,[[0,{}],[.06,{HP:[-s*.05,0,0],h:[20,0,s*16],wg:[40,10,50,5],ba:[.3]}],[.22,T],[.36,wrP(T,{HP:[s*.9,0,0],alt:[.58],fl:[0,0,-s*360],h:[16,0,-s*14],ba:[.3]})],
      [.56,{HP:[s*.85,0,0],fl:[0,0,-s*360],h:[20,0,-s*10],ba:[1],jw:[.5]}],[.96,{fl:[0,0,-s*360]}]],
      `Barrel-rolls about 0.9 m to the ${s>0?'left':'right'} with the wings tucked, cackles, then darts back`,{tp:.96});}
  /* Dodge back: a backflip that carries it about 0.7 m back and up */
  KC('Dodge back',.96,[[0,{}],[.08,{h:[30,0,0],alt:[.52],HP:[0,0,.05],wg:[40,10,50,5],ba:[.3]}],
    [.32,{HP:[0,0,-.45],alt:[.85],fl:[-200,0,0],FL:[.07,-.22,.14,10],FR:[-.07,-.22,.14,10],KN:[0,.8,.6],gL:[.13,.0,.13],gR:[-.13,.0,.13],fs:[60,60],wg:[-5,40,40,70],ba:[0],tc:[30,30,30,25,20,10],tw:[0],jw:[.2]}],
    [.5,{HP:[0,0,-.72],alt:[.66],fl:[-360,0,0],h:[10,0,0],ba:[.4],jw:[.45]}],[.96,{fl:[-360,0,0]}]],'Backflips about 0.7 m back and up out of reach, then darts back in',{tp:.96});
  /* Dash: darts in a fast zigzag (right, left) and back to where it started, wings blurring */
  KC('Dash',.96,[[0,{}],[.16,{HP:[-.5,0,.3],h:[46,-20,20],fl:[0,0,0],tsw:[40],jw:[.5]}],[.34,{HP:[.5,0,.6],h:[46,20,-20],tsw:[-40]}],[.54,{HP:[-.2,0,.4],h:[30,-10,12],tsw:[20]}],
    [.96,{}]],'Darts about in a fast zigzag, right then left and back to where it was, wings blurring',{beat:.16,tp:.96});

  /* ---- attacks ---- */
  /* Claw swipe: winds the right claw up and back, swipes it across and down to the left, the body twisting into it */
  KC('Claw swipe',.72,[[0,{}],[.18,{h:[14,-18,0],ch:[0,-20,4],HP:[0,0,-.06],gR:[-.3,.04,.1],wr:[-30,0,0],fs:[-10,-25],pR:[-.4,-.6,-.6],jw:[.5]}],
    [.32,{h:[26,22,0],ch:[8,24,-4],HP:[0,0,.22],gR:[-.02,.02,.2],wr:[10,0,0],fs:[-10,70],pR:[-.6,-.4,-.4],jw:[.8]}],[.46,{h:[24,18,0],ch:[8,18,-4],HP:[0,0,.18],gR:[0,-.02,.18],fs:[-10,60],jw:[.5]}],
    [.72,{}]],'Winds the right claw up and back, then lunges and swipes it across and down, twisting into the blow',{});
  /* Claw flurry: four quick alternating swipes, right, left, right, left, pressing forward */
  {const SW=(sd,on)=>{const g=sd==='R'?(on?[-.02,.02,.2]:[-.29,.04,.1]):(on?[.02,.02,.2]:[.29,.04,.1]);return sd==='R'?{gR:g,fs:[on?-10:60,on?70:-20]}:{gL:g,fs:[on?70:-20,on?60:-10]};};
  const K=[[0,{}]];[['R',.1],['L',.34],['R',.58],['L',.82]].forEach(([sd,t],i)=>{const s=sd==='R'?1:-1,z=.12+.04*i;
    K.push([t,Object.assign({h:[20,-s*14,0],ch:[4,-s*16,0],HP:[0,0,z-.08],jw:[.4]},SW(sd,false),SW(sd==='R'?'L':'R',true))]);
    K.push([t+.12,Object.assign({h:[28,s*16,0],ch:[8,s*18,0],HP:[0,0,z],jw:[.85]},SW(sd,true),SW(sd==='R'?'L':'R',false))]);});
  K.push([1.44,{}]);KC('Claw flurry',1.44,K,'Four quick alternating claw swipes, right, left, right, left, pressing forward with a shriek',{});}
  /* Swoop: rises and backs off, then dives at the enemy, both claws raking down, and zips back up */
  KC('Swoop',1.2,[[0,{}],[.3,{alt:[.9],HP:[0,0,-.3],h:[0,0,0],sp:[0,0,0],gL:[.2,.2,.12],gR:[-.2,.2,.12],pL:[.6,-.5,-.6],pR:[-.6,-.5,-.6],fs:[-15,-15],wg:[50,20,50,5],jw:[.4]}],
    [.5,{alt:[.4],HP:[0,0,.75],h:[50,0,0],sp:[8,0,0],ch:[8,0,0],gL:[.2,.2,.2],gR:[-.2,.2,.2],fs:[-20,-20],wg:[-10,45,40,40],ba:[.2],jw:[.9],tc:[-60,10,10,10,10,10]}],
    [.62,{alt:[.36],HP:[0,0,.85],h:[34,0,0],sp:[6,0,0],ch:[6,0,0],gL:[.1,-.04,.2],gR:[-.1,-.04,.2],fs:[75,75],wg:[10,30,55,15],ba:[.6],jw:[.6]}],
    [.84,{alt:[.62],HP:[0,0,.35],h:[10,0,0],jw:[.4]}],[1.2,{}]],'Rises and backs off, dives at the enemy raking down with both claws, then zips back up',{});
  /* Tail sting: rears back, the tail arcs forward over its head like a scorpion's and stabs twice */
  {const UP={h:[-10,0,0],sp:[-4,0,0],ch:[-2,0,0],nk:[6,0,0],hd:[10,0,0],FL:[.07,-.3,.16,20],FR:[-.07,-.3,.14,20],tw:[0],jw:[.5],gL:[.2,.06,.14],gR:[-.2,.06,.14]};
  KC('Tail sting',1.44,[[0,{}],[.3,wrP(UP,{tc:[20,50,25,0,0,35,40,30]})],[.5,wrP(UP,{tc:[20,50,25,0,0,35,40,30],jw:[.7]})],
    [.62,wrP(UP,{h:[16,0,0],sp:[6,0,0],HP:[0,0,.15],tc:[20,45,12,0,0,45,45,15],jw:[.9]})],[.78,wrP(UP,{tc:[20,50,25,0,0,35,40,30]})],
    [.92,wrP(UP,{h:[16,0,0],sp:[6,0,0],HP:[0,0,.15],tc:[20,45,12,0,0,45,45,15],jw:[.9]})],[1.1,wrP(UP,{tc:[5,40,30,15,10,25,20,10],jw:[.4]})],[1.44,{}]],
    'Rears back in the air and arcs its tail forward over its head like a scorpion, stabbing twice with the spade',{});}

  /* ---- taunt, hits, death ---- */
  /* Taunt: thumbs at its ears, wiggling its claws, cackling with the head thrown back, then a little spin in the air */
  KC('Taunt',2.4,[[0,{}],[.3,arms({hd:[-4,0,0],jw:[.6]},[.13,.29,.02],[1,.2,-.3],[0,0,0])],
    [1.3,arms({hd:[-20,0,0],h:[2,0,0],jw:[.9],alt:[.64]},[.13,.29,.02],[1,.2,-.3],[0,0,0])],[1.5,{fl:[0,0,0],jw:[.4]}],[2.1,{fl:[0,360,0],jw:[.8]}],[2.4,{fl:[0,360,0]}]],
    'Puts its thumbs to its ears and wiggles its claws, cackling with the head thrown back, then spins round once in the air',
    {add:(t,p)=>{if(t<.3||t>1.4)return p;const w=Math.min(1,(t-.3)/.12,(1.4-t)/.12),g=S(D*t*5)*w,j=Math.abs(S(D*t*4))*w;
      return Object.assign({},p,{fs:[20+50*g,20-50*g],jw:[p.jw[0]+.2*j],hd:[p.hd[0],p.hd[1]+8*S(D*t*2)*w,p.hd[2]+6*S(D*t*2)*w],alt:[p.alt[0]+.02*j]});}});
  KC('Hit 1',.6,[[0,{}],[.1,{alt:[.66],HP:[0,0,-.32],h:[-22,0,0],sp:[-8,0,0],ch:[-10,0,0],hd:[-20,0,0],FL:[.07,-.3,.2,20],FR:[-.07,-.3,.18,20],
    gL:[.22,.1,.04],gR:[-.22,.1,.04],fs:[-20,-20],wg:[50,10,45,20],ba:[0],jw:[.8]}],[.34,{alt:[.6],HP:[0,0,-.18],h:[12,0,0],ba:[.6],jw:[.4]}],[.6,{}]],
    'Knocked back through the air, head snapping back, wings jerking up',{});
  KC('Hit 2',.72,[[0,{}],[.12,{alt:[.6],HP:[.34,0,-.04],h:[8,0,-14],fl:[0,-70,0],ch:[0,10,-8],hd:[-10,10,-14],gR:[-.16,.2,.06],gL:[.24,-.04,.1],fs:[-20,30],ba:[.2],jw:[.7],tsw:[-40]}],
    [.4,{alt:[.58],HP:[.2,0,0],fl:[0,-30,0],h:[12,0,-4],ba:[.8],jw:[.3]}],[.72,{}]],'Struck from the right: spun round and knocked aside, then whips back to face the enemy',{});
  /* Death: shrieks, the wings stop, it tumbles out of the air and lands face down, wings spread on its back, the tail flopping */
  {const DN={alt:[-.36],HP:[0,0,.3],h:[88,0,0],sp:[0,0,0],ch:[0,0,0],nk:[-14,0,0],hd:[-34,0,0],fl:[0,0,0],FL:[.08,-.415,-.03,80],FR:[-.09,-.41,-.05,82],KN:[0,-.6,1],
      gL:[.24,.12,.02],gR:[-.24,.12,.02],pL:[0,-1,0],pR:[0,-1,0],pw:[3],wl:[0,0,0],wr:[0,0,0],fs:[40,40],wg:[10,-12,0,10],ba:[0],tc:[-80,-10,0,0,0,0],tw:[0],tsw:[60],jw:[.6]};
  KC('Death',2.4,[[0,{}],[.24,{alt:[.7],h:[-16,0,0],sp:[-6,0,0],ch:[-8,0,0],hd:[-24,0,0],gL:[.22,.2,.04],gR:[-.22,.2,.04],fs:[-25,-25],wg:[60,15,50,10],ba:[0],jw:[1.0],tw:[0]}],
    [.5,{alt:[.4],HP:[0,0,.1],h:[30,0,0],sp:[6,0,0],hd:[-6,0,0],gL:[.22,.14,.14],gR:[-.22,.14,.14],wg:[40,30,30,40],ba:[0],jw:[.8],tw:[0]}],
    [.78,wrP(DN,{alt:[-.3],h:[80,0,0],tc:[-60,10,10,10,10,10]})],[.86,wrP(DN,{alt:[-.33]})],[.98,wrP(DN,{alt:[-.31],tc:[-70,5,5,5,5,5]})],[1.1,DN],
    [1.5,wrP(DN,{tc:[-70,30,25,-10,0,0],tsw:[90]})],[1.8,wrP(DN,{tc:[-80,0,10,0,0,0]})],[2.4,DN]],
    'Shrieks and the wings stop; it tumbles out of the air and lands face down, wings spread on its back, the tail flopping once more (held)',{next:null,hold:true});}
  return IMPCLIPS.all=L;}

FOLDERS['characters/enemies'].children.push('characters/enemies/hell');FOLDERS['characters/enemies/hell']={name:'Hell',blurb:'Imps and other fiends',children:[]};
ASSETS.push({id:'imp',folder:'characters/enemies/hell',name:'Imp',kind:'character',variants:true,defaultSeed:1,groundR:1.4,build:(s,o)=>buildImp(s,o||{}),
  opts:[{key:'skin',label:'Skin',choices:[['random','Random'],...Object.entries(IMP_SKIN).map(([k,v])=>[k,v[1].charAt(0).toUpperCase()+v[1].slice(1)])],def:'random'},
    {key:'eyes',label:'Eyes',choices:[['random','Random'],['yellow','Yellow glow'],['orange','Orange glow'],['green','Green glow']],def:'random'},
    {key:'horns',label:'Horns',choices:[['random','Random'],['short','Short'],['swept','Swept back'],['curved','Curved']],def:'random'}],
  desc:'Imp: a small winged fiend of about 1 m, pot-bellied, with a big grinning head full of pointed teeth, long pointed ears, horns, glowing eyes, big three-clawed hands, bat wings and a long spade-tipped tail. Always flying, fast and dodgy. Clips: Idle, Fly, war-mode Idle and Fly, Dodge left, Dodge right, Dodge back, Dash, Claw swipe, Claw flurry, Swoop, Tail sting, Taunt, Hit 1, Hit 2 and Death.'});
