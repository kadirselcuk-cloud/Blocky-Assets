/* ======================= LICH: an undead sorcerer, a skeleton in a ragged robe with a staff, who walks or levitates =======================
   buildSkeleton on VB.lich (the skeleton's bones, no armour) with the gear hook set, so it brings no weapon or buckler; the robe is
   then worn inside the bone pieces it covers (torso shell and high collar on bone_ribs, sleeves on the arm bones, a two-part skirt
   that pivots inside bone_pelvis and follows the thighs), the headwear on bone_skull, a phylactery on the ribs, the staff in the
   right socket (weapon_R) and a spell orb (orb_L) in front of the left palm. The body sits in a group scaled by LI_SC (about 1.9 m).
   Clips are IK clips in body units (wrSolve) with the goblin shaman's staff channels (T = staff foot, G = grip [x,z], pl = planted,
   ap = automatic elbow) plus fl (float height: lifts the hips, both feet and both grips together) and ob (orb size). Standing clips
   plant the staff; Levitate rises into Hover and Land comes back down; war mode hovers. Death drops it out of the air and lets it
   fall apart (skDeathRise): the robe goes down with the bones it hangs from, the skirt lies flat with the pelvis. */
VB.lich=Object.assign({},VB.skeleton);VB.lich.key='lich';
const LI_SC=1.05,LI_LB=1.0;
/* float height option (metres above the ground in the hover; the clips are authored for 0.45 body units and scaled to it) */
const LI_FLOAT={low:[.12,'just off the ground'],medium:[.3,'knee height'],high:[.5,'half a metre']};
const LI_ROBE={purple:['#3a2a4e','deep purple'],black:['#1f1d24','black'],red:['#5a1e24','blood red'],blue:['#22304a','midnight blue'],green:['#2c3a2a','grave green'],grey:['#57524a','ash grey'],brown:['#5e4a30','faded brown']};
const LI_EYES={blue:['#bfe6ff','#5ab8ff','pale blue glow'],green:['#c8ffb0','#3aff5a','green glow'],purple:['#e8ccff','#a650ff','purple glow'],red:['#ffb0a0','#ff3a1e','red glow'],gold:['#ffe9a0','#ffb02a','golden glow'],white:['#ffffff','#b8ccff','white glow']};
const LI_GEM={emerald:['#8af0a8','#20c060','emerald'],ruby:['#ffa0aa','#e0203a','ruby'],sapphire:['#a8c4ff','#2a5ae8','sapphire']};
const LI_STAFF={gnarled:'gnarled staff',bone:'bone staff',emerald:'staff with an emerald',ruby:'staff with a ruby',sapphire:'staff with a sapphire'};
const LI_HEAD={crown:'crown',coif:'chain mail coif',diadem:'diadem with a gem',none:'bare skull'};
const liGlow=c=>wrGlow(c[0],c[1],1.6,pxTex('plain'));

/* staffs: grip at the origin, foot at -LI_LB, top about 1 above the grip. The fingers point along +x (the bone staff's skull faces
   that way), +z is the outside of the right hand */
function liStaff(kind,boneHex,eyeM){const w=new THREE.Group(),wd=bm('#4a3826','leather'),wdD=bm('#2e2216','leather'),wrap=bm('#2a1e16','leather'),ir=vm('iron'),irD=bm('#3e4248','plain'),cord=vm('rope');
  if(kind==='gnarled'){
    /* crooked shaft of knotted segments; at the top three roots curl up and out round a knot, a bone charm hangs from one */
    for(const[y0,y1,x,z,rx,rz]of[[-1,-.66,.006,0,0,.04],[-.68,-.32,-.008,.004,.03,-.04],[-.34,.02,.006,-.004,-.03,.03],[0,.36,-.008,.004,.03,-.05],[.34,.66,.006,-.004,-.02,.04],[.64,.84,-.002,0,.02,-.03]])
      bx(w,.05,y1-y0+.02,.05,wd,x,(y0+y1)/2,z,rx,0,rz);
    bx(w,.058,.05,.058,wdD,0,-.975,0);for(const[x,y,z]of[[.03,-.5,0],[0,-.15,.03],[-.03,.2,0],[.028,.5,0],[0,.7,-.03]])bx(w,.034,.044,.034,wdD,x,y,z);
    bx(w,.06,.16,.06,wrap,0,0,0);for(const y of[-.06,.06])bx(w,.064,.014,.064,cord,0,y,0);
    bx(w,.09,.09,.09,wdD,0,.86,0);
    for(const[x,z]of[[1,0],[-.5,.87],[-.5,-.87]]){bx(w,.036,.13,.036,wd,x*.05,.95,z*.05,z*.4,0,-x*.4);bx(w,.03,.1,.03,wd,x*.075,1.04,z*.075,-z*.25,0,x*.25);bx(w,.026,.026,.026,wdD,x*.06,1.09,z*.06);}
    bx(w,.008,.09,.008,cord,.085,.96,0);bx(w,.024,.05,.02,bm(boneHex,'plain'),.085,.89,0);bx(w,.04,.016,.016,bm(boneHex,'plain'),.085,.86,0);}
  else if(kind==='bone'){
    /* long bones joined end to end with knuckles and cord bindings; a small skull on top facing along the fingers, on a vertebra */
    const bn=bm(boneHex,'plain'),bnD=bm('#'+new THREE.Color(boneHex).multiplyScalar(.75).getHexString(),'plain'),dk=bm('#16120e','plain');
    for(const[y0,y1]of[[-1,-.62],[-.62,-.22],[-.22,.2],[.2,.62]]){bx(w,.04,y1-y0-.02,.04,bn,0,(y0+y1)/2,0);bx(w,.058,.04,.058,bn,0,y1,0);}
    bx(w,.05,.03,.05,bnD,0,-.985,0);for(const y of[-.6,-.22,.2])bx(w,.062,.016,.062,cord,0,y-.026,0);bx(w,.056,.17,.056,wrap,0,0,0);
    for(const y of[.66,.71,.76])bx(w,.07,.03,.06,bn,0,y,0);bx(w,.03,.03,.02,bnD,-.03,.71,0);
    bx(w,.11,.09,.1,bn,0,.84,0);bx(w,.1,.04,.09,bn,.005,.89,0);bx(w,.04,.06,.09,bn,.05,.82,0);
    for(const z of[-.024,.024]){bx(w,.012,.024,.026,dk,.056,.84,z);if(eyeM)bx(w,.008,.01,.01,eyeM,.06,.84,z);}bx(w,.012,.016,.012,dk,.056,.815,0);
    bx(w,.04,.02,.07,bnD,.035,.79,0);for(let i=-1;i<=1;i++)bx(w,.01,.014,.01,bn,.058,.8,i*.018);}
  else{
    /* dark straight shaft with iron bands and a leather grip; an iron head whose four prongs hold a glowing gem */
    const sh=bm('#2c221c','leather'),gem=liGlow(LI_GEM[kind]);
    bx(w,.044,1.74,.044,sh,0,-.13,0);bx(w,.054,.05,.054,ir,0,-.975,0);for(const y of[-.6,-.24,.3,.6])bx(w,.05,.022,.05,irD,0,y,0);bx(w,.054,.17,.054,wrap,0,0,0);
    bx(w,.066,.06,.066,ir,0,.76,0);bx(w,.09,.03,.09,irD,0,.8,0);
    for(const[x,z]of[[1,0],[-1,0],[0,1],[0,-1]]){bx(w,.02,.15,.02,ir,x*.05,.88,z*.05,z*.22,0,-x*.22);bx(w,.02,.04,.02,ir,x*.06,.97,z*.06,-z*.6,0,x*.6);}
    bx(w,.07,.12,.07,gem,0,.9,0,0,Math.PI/4,0);bx(w,.04,.04,.04,gem,0,.975,0,0,Math.PI/4,0);bx(w,.04,.03,.04,gem,0,.83,0,0,Math.PI/4,0);}
  return w;}

/* ragged robe skirt in bone_pelvis: front, back and side panels pivot at the waist and follow the thighs, two parts each so the
   lower part folds back on a high knee; torn hem strips, holes and a darker patch */
function liSkirt(pv,rb,rbD,hole,r){const PW=.3,PD=.23,t=.022,y0=-.03,L1=.4,L2=.35,sk={},D2=Math.PI/180;
  const panel=(par,q,L,low)=>{const fb=q==='F'||q==='B',w=fb?PW+2*t+(low?.02:0):PD+.03+(low?.02:0),sg=q==='F'||q==='L'?1:-1;
    if(fb)bx(par,w,L,t,rb,0,-L/2,0);else bx(par,t,L,w,rb,0,-L/2,0);
    /* holes and a darker worn patch on the outer face */
    for(let i=0;i<(low?2:1);i++){const c=(r()-.5)*w*.7,y=-L*(.25+.5*r()),hw=.025+.02*r(),hh=.02+.02*r();if(fb)bx(par,hw,hh,.004,hole,c,y,sg*(t/2+.001));else bx(par,.004,hh,hw,hole,sg*(t/2+.001),y,c);}
    if(low&&r()<.7){const c=(r()-.5)*w*.6,y=-L*(.3+.4*r());if(fb)bx(par,.06,.08,.004,rbD,c,y,sg*(t/2+.002));else bx(par,.004,.08,.06,rbD,sg*(t/2+.002),y,c);}
    if(!low)return;const n=fb?6:4;for(let i=0;i<n;i++){if(r()<.25)continue;const tw=w/n*(.5+.4*r()),Lt=.025+.05*r(),c=-w/2+(i+.5)*w/n;
      if(fb)bx(par,tw,Lt,t*.8,rb,c,-L-Lt/2+.004,0);else bx(par,t*.8,Lt,tw,rb,0,-L-Lt/2+.004,c);}};
  const piv={F:[0,PD/2+t/2],B:[0,-PD/2-t/2],L:[PW/2+t/2,0],R:[-PW/2-t/2,0]};
  for(const q in piv){const up=J('skirt_'+q,pv,piv[q][0],y0,piv[q][1]);up.userData.joint=false;panel(up,q,L1,false);
    const lo=J('skirtLow_'+q,up,0,-L1,0);lo.userData.joint=false;panel(lo,q,L2,true);sk[q]={up,lo};}
  sk.post=(tL,tR,body)=>{const loose=!!body&&(body.userData.detaching||pv.position.lengthSq()>1e-8||Math.abs(pv.quaternion.w)<.9999);
    /* a skirt let go in Death hangs straight from its pelvis, so it lies flat when the pelvis does */
    const a=loose?0:tL.rotation.x,b=loose?0:tR.rotation.x,lo=Math.min(a,b),hi=Math.max(a,b),av=(a+b)/2;
    const set=(q,v)=>{sk[q].up.rotation.x=v;const m=Math.abs(v),gv=Math.min(1,Math.max(0,(m-30*D2)/(40*D2)))*.95;sk[q].lo.rotation.x=-v*gv;};
    set('F',lo<0?lo*.85:lo*.4);set('B',hi>0?hi*.85:hi*.5);set('L',(a*.7+av*.3)*.5);set('R',(b*.7+av*.3)*.5);
    sk.L.up.rotation.z=loose?0:Math.max(0,tL.rotation.z)*.6;sk.R.up.rotation.z=loose?0:Math.min(0,tR.rotation.z)*.6;sk.L.lo.rotation.z=sk.R.lo.rotation.z=0;
    /* the hem never goes into the ground (kneeling, deep crouches): a panel that would is folded outwards, the lower part first,
       then the upper, by the smallest angle that keeps it above the ground; a fold that would not help is not made */
    if(!body)return;
    pv.updateWorldMatrix(true,true);const g0=body.matrixWorld.elements[13]+(loose?-.0005:.004);if(lowY(pv)>=g0)return;
    for(const q of'FBLR'){const P=sk[q],ax=q==='F'||q==='B'?'x':'z',sg={F:-1,B:1,L:1,R:-1}[q];
      for(const part of[P.lo,P.up]){const y0=lowY(P.up);if(y0>=g0)break;const a0=part.rotation[ax];let l=0,h=Math.PI/2;
        part.rotation[ax]=a0+sg*h;part.updateMatrixWorld(true);if(lowY(P.up)<=y0){part.rotation[ax]=a0;part.updateMatrixWorld(true);continue;}
        for(let i=0;i<9;i++){const m=(l+h)/2;part.rotation[ax]=a0+sg*m;part.updateMatrixWorld(true);if(lowY(P.up)<g0)l=m;else h=m;}
        part.rotation[ax]=a0+sg*h;part.updateMatrixWorld(true);}}};
  const v=new THREE.Vector3(),lowY=g=>{let y=1e9;g.traverse(m=>{if(!m.isMesh)return;const p=m.geometry.parameters;
    for(let i=0;i<8;i++){v.set((i&1?.5:-.5)*p.width,(i&2?.5:-.5)*p.height,(i&4?.5:-.5)*p.depth).applyMatrix4(m.matrixWorld);if(v.y<y)y=v.y;}});return y;};
  return sk;}

function buildLich(seed,o={}){const r=mulberry32(((seed*2654435761)>>>0)^0x71c4),pick=a=>a[Math.floor(r()*a.length)];
  /* roll everything, then let the options override */
  const head0=pick(['crown','crown','coif','diadem','diadem','none']),staff0=pick(Object.keys(LI_STAFF)),robe0=pick(Object.keys(LI_ROBE)),eye0=pick(Object.keys(LI_EYES)),dGem=pick(Object.keys(LI_GEM)),bone0=pick(['bleached','aged','grimy']);
  const opt=(k,d)=>o[k]&&o[k]!=='random'?o[k]:d,headK=opt('head',head0),kind=opt('staff',staff0),robeK=opt('robe',robe0),eyeK=opt('eyes',eye0),boneK=opt('bones',bone0);
  const body=buildSkeleton(seed,{B:VB.lich,bones:boneK,eyes:eyeK,eyeTab:LI_EYES,armor:'none',gear:true,noClips:true});
  const Jn=n=>body.getObjectByName(n),shade=(h,f)=>'#'+new THREE.Color(h).multiplyScalar(f).getHexString(),RC=LI_ROBE[robeK][0],boneHex=SK_BONE[boneK][0];
  const rb=bm(RC,'cloth'),rbD=bm(shade(RC,.65),'cloth'),hole=bm('#0c0a0a','plain'),cord=bm('#2a2420','leather'),trim=bm('#8a7444','plain'),eyeM=liGlow(LI_EYES[eyeK]);
  const gold=bm('#c9a24a','plain'),goldD=bm('#8a6a2a','plain'),chain=bm('#5a5650','plain');
  const pv=Jn('bone_pelvis'),sp=Jn('bone_spine'),rc=Jn('bone_ribs'),sk=Jn('bone_skull');
  /* torso: a shell over the ribs (back, sides, two front halves that leave the ribcage bare down the middle, shoulders round the neck) */
  bx(rc,.3,.38,.024,rb,0,.03,-.112);
  for(const s of[-1,1]){bx(rc,.024,.38,.22,rb,s*.15,.03,0);bx(rc,.1,.38,.024,rb,s*.1,.03,.112);bx(rc,.014,.38,.008,trim,s*.054,.03,.126);bx(rc,.115,.024,.248,rb,s*.0925,.232,0);
    /* ragged edges of the opening, and a tear on the left */
    bx(rc,.03,.05,.024,rb,s*.06,-.175,.112);}
  bx(rc,.05,.04,.004,hole,.11,-.02,.125);bx(rc,.004,.05,.04,hole,.163,.12,-.04);
  /* high stiff collar behind the skull, flaring out at the sides */
  bx(rc,.28,.17,.022,rbD,0,.31,-.14,-.25,0,0);for(const s of[-1,1])bx(rc,.022,.15,.11,rbD,s*.15,.3,-.085,0,0,-s*.25);bx(rc,.29,.02,.03,trim,0,.235,-.12);
  /* phylactery: a glowing gem on a chain, hanging in the opening over the breastbone */
  for(const s of[-1,1])bx(rc,.008,.13,.008,chain,s*.032,.16,.116,0,0,s*.3);bx(rc,.044,.06,.012,goldD,0,.08,.12);bx(rc,.026,.036,.01,eyeM,0,.08,.128,0,0,Math.PI/4);
  /* waist and hips: the waist robe reaches up inside the torso shell and down over the hips robe, so no gap opens when the body
     bends; a cord sash with hanging ends. A cloth wrap round the neck closes the gap between the shoulders and the skull */
  bx(sp,.29,.34,.22,rb,0,.03,0);bx(Jn('bone_neck'),.09,.12,.09,rbD,0,.02,-.02);bx(pv,.3,.1,.23,rb,0,0,0);bx(pv,.31,.036,.24,cord,0,.045,0);bx(pv,.03,.2,.016,cord,-.07,-.07,.128,0,0,.08);bx(pv,.03,.15,.016,cord,-.035,-.05,.128,0,0,-.06);
  const skirt=liSkirt(pv,rb,rbD,hole,r);
  /* in Death the robed torso (ribs with the lumbar spine and neck) and the pelvis with the skirt fall face down along the fall */
  sp.userData.joinChunk=Jn('bone_neck').userData.joinChunk='bone_ribs';rc.userData.restRule={long:'y',up:'z',sgn:-1,L:'fwd',yaw:10,first:true};pv.userData.restRule={long:'y',up:'z',sgn:-1,L:'fwd',yaw:12,fw:-.55,first:true};
  /* sleeves: shoulder cap and upper sleeve on the humerus, a sleeve flaring towards the wrist with a torn edge on the forearm */
  for(const[sd,s]of[['L',1],['R',-1]]){const hu=Jn('bone_humerus_'+sd),fr=Jn('bone_forearm_'+sd);
    bx(hu,.11,.05,.11,rbD,s*.005,0,0);bx(hu,.09,.26,.09,rb,0,-.14,0);bx(fr,.095,.16,.095,rb,0,-.08,0);bx(fr,.12,.09,.12,rb,0,-.2,0);
    for(const[x,z]of[[s*.045,.04],[-s*.03,-.05],[s*.05,-.03]])bx(fr,.03,.035,.012,rb,x,-.26,z);bx(fr,.004,.03,.03,hole,s*.061,-.18,.02);}
  /* headwear */
  if(headK==='crown'){bx(sk,.25,.045,.022,gold,0,.245,.124);bx(sk,.25,.045,.022,gold,0,.245,-.134);for(const s of[-1,1])bx(sk,.022,.045,.28,gold,s*.116,.245,-.005);
    for(const[x,z,h]of[[-.08,.124,.06],[0,.124,.09],[.08,.124,.06],[-.08,-.134,.06],[0,-.134,.07],[.08,-.134,.06]]){bx(sk,.03,h,.022,gold,x,.267+h/2,z);bx(sk,.016,.016,.016,goldD,x,.267+h+.008,z);}
    for(const s of[-1,1])for(const z of[-.06,.05]){bx(sk,.022,.06,.03,gold,s*.116,.297,z);bx(sk,.016,.016,.016,goldD,s*.116,.335,z);}
    bx(sk,.03,.03,.01,liGlow(LI_GEM[dGem]),0,.245,.137,0,0,Math.PI/4);for(const s of[-1,1])bx(sk,.02,.02,.008,goldD,s*.06,.245,.136);}
  else if(headK==='coif'){const ml=vm('mail'),mlD=bm('#4a4e54','plain');
    bx(sk,.25,.05,.28,ml,0,.257,-.005);for(const s of[-1,1]){bx(sk,.025,.2,.25,ml,s*.125,.16,-.02);bx(sk,.025,.1,.18,ml,s*.125,.02,-.05);}
    bx(sk,.25,.28,.025,ml,0,.12,-.152);bx(sk,.25,.04,.025,ml,0,.215,.122);bx(sk,.26,.022,.29,mlD,0,.232,-.005);}
  else if(headK==='diadem'){bx(sk,.21,.022,.012,gold,0,.21,.121);for(const s of[-1,1])bx(sk,.012,.022,.25,gold,s*.111,.21,-.005);bx(sk,.21,.022,.012,gold,0,.21,-.131);
    bx(sk,.05,.05,.01,goldD,0,.215,.128,0,0,Math.PI/4);bx(sk,.032,.032,.012,liGlow(LI_GEM[dGem]),0,.215,.134,0,0,Math.PI/4);}
  /* staff in the right socket */
  const wr=new THREE.Group();wr.name='weapon_R';wr.userData.piece=wr.userData.gear=true;Jn('socket_R').add(wr);const st=liStaff(kind,boneHex,eyeM);st.quaternion.copy(SH_BASIS());wr.add(st);
  /* in Death the staff is let go as the lich drops and lands first, lying flat on the ground beside the body on its right (in Rise it
     comes back last, into the hand of the risen lich, so it never sinks into the ground with the slumped body); the skull rolls off forward and to the left, clear of it */
  wr.userData.restRule={long:'z',up:'x',L:'fwd',yaw:8,first:true,sd:.5,fw:.2,late:true};sk.userData.restRule={long:'z',up:'y',sgn:1,yaw:50,tilt:18,bounce:true,fw:.3,sd:-.3};
  /* spell orb in front of the left palm, hidden (tiny) unless a clip grows it */
  const orb=new THREE.Group();orb.name='orb_L';orb.userData.gear=true;orb.position.set(-.06,-.12,0);orb.scale.setScalar(.001);Jn('hand_L').add(orb);
  const oc=LI_EYES[eyeK];bx(orb,.09,.09,.09,liGlow(oc),0,0,0,.6,.6,0);bx(orb,.06,.06,.06,wrGlow('#ffffff',oc[1],2.2,pxTex('plain')),0,0,0,0,.8,.6);
  /* the right fist stays closed round the staff (until a death lets it go); the left hand follows the clips */
  const D2=Math.PI/180;
  body.userData.post=()=>{skirt.post(Jn('thigh_L'),Jn('thigh_R'),body);if(Math.abs(wr.quaternion.w)<.9999||wr.position.lengthSq()>1e-6)return;Jn('fingers_R').rotation.set(0,0,95*D2);Jn('fingerTips_R').rotation.set(0,0,90*D2);Jn('thumb_R').rotation.set(14*D2,0,33*D2);};
  body.userData.post();
  if(o.bare)return body;
  const flK=LI_FLOAT[o.float]?o.float:'low';
  if(!o.noClips){body.userData.clips=lichClips(kind,LI_FLOAT[flK][0]/LI_SC/.45);body.userData.clips=body.userData.clips.concat(liDeathRise(body,seed));}
  const root=new THREE.Group();root.userData.lights=[];body.scale.setScalar(LI_SC);root.add(body);
  root.userData.post=body.userData.post;root.userData.joints=body.userData.joints;root.userData.clips=body.userData.clips;root.userData.ground=1.7;
  const cap=s=>s.charAt(0).toUpperCase()+s.slice(1),gemA=(dGem==='emerald'?'an ':'a ')+LI_GEM[dGem][2];
  root.userData.variantText=`${cap(SK_BONE[boneK][1])} bones, ${LI_EYES[eyeK][2]} in the eye sockets; ragged ${LI_ROBE[robeK][1]} robe; ${headK==='diadem'?'diadem with '+gemA:headK==='crown'?'crown with '+gemA:LI_HEAD[headK]}; ${LI_STAFF[kind]}.`;
  return root;}

/* Death: struck in the air, drops to the ground, the knees give way and it falls apart into a pile of bones and robe.
   Rise: the pile trembles, the pieces fly back and it straightens, rising into the hover */
function liDeathRise(body,seed){return skDeathRise(body,VB.lich,seed,{fps:60,tDet:.74,tW:.24,fwd:.45,sh:1.05,
  keys:[[.12,{sp:[-8,0,0],ch:[-14,0,0],nk:[-6,0,0],hd:[-20,0,4],uL:[-10,0,12],uR:[-12,0,-10]},'out'],
    [.34,{sp:[2,0,2],ch:[4,0,4],nk:[4,0,0],hd:[8,10,18],uL:[10,0,0],uR:[14,0,0],tL:[-10,0,0],kL:[24,0,0],aL:[-40,0,0],tR:[-10,0,0],kR:[24,0,0],aR:[-40,0,0],jit:[1]}],
    [.74,{sp:[10,0,4],ch:[14,0,6],nk:[10,0,0],hd:[18,14,26],uL:[22,0,-6],uR:[26,0,6],fL:[10,0,0],fR:[10,0,0],tL:[-4,0,0],kL:[56,0,0],aL:[-44,0,0],tR:[-4,0,0],kR:[56,0,0],aR:[-44,0,0],jit:[.7]},'in']],
  notes:['Struck in the air, drops to the ground, the knees give way and it falls apart into a pile of bones and robe','The pile trembles, the bones fly back together top first, then it straightens and rises into the hover']});}

/* ---------- clips (body units: the male skeleton's metres, before LI_SC) ---------- */
const LICLIPS={};
/* planted staff: the grip sits on the line from the foot T, LI_LB - sl along the staff */
function liStaffPose(o){const n=v=>{const l=Math.hypot(...v)||1;return v.map(x=>x/l);},w=o.pl[0];let g=o.gR.slice(),d=n(o.dR);
  if(w>0){const Lb=LI_LB-o.sl[0],T=o.T,G=o.G,hx=G[0]-T[0],hz=G[1]-T[2],hy=Math.sqrt(Math.max(1e-4,Lb*Lb-hx*hx-hz*hz)),pg=[G[0]-o.HP[0],T[1]+hy,G[1]-o.HP[2]],pd=[hx/Lb,hy/Lb,hz/Lb];
    g=g.map((v,i)=>v+(pg[i]-v)*w);d=n(d.map((v,i)=>v+(pd[i]-v)*w));}o.gR=g;o.dR=d;return o;}
/* stances. Standing (LI_N): upright, a slight stoop, the staff planted ahead on the right, left arm hanging. Hover (LI_H): about
   0.45 m up, legs dangling with the toes down, staff held upright, left arm out with the palm down. War (LI_W): higher, left side
   forward, staff angled forward, left hand raised like a claw with the orb glowing in front of it */
const LI_N=liStaffPose({fl:[0],ob:[0],HP:[0,-.015,0],h:[3,0,0],sp:[5,0,0],ch:[7,0,0],nk:[4,0,0],hd:[0,0,0],FL:[.1,.02,8,0,0],FR:[-.1,-.02,-8,0,0],
  T:[-.36,.012,.32],G:[-.34,.24],pl:[1],sl:[0],ap:[1],gR:[0,0,0],dR:[0,1,0],eR:[0,0,1],pR:[-.8,-.4,-.4],gL:[.25,.84,.12],dL:[1,0,.2],pL:[.35,-.3,-.9],wl:[0,0,0],wf:[0],wr:[0,0,0],fist:[35,95]});
const LI_H=wrP(LI_N,{fl:[.45],pl:[0],HP:[0,0,0],h:[2,0,0],sp:[3,0,0],ch:[4,0,0],nk:[4,0,0],FL:[.08,-.02,6,-.06,50],FR:[-.08,-.05,-6,-.05,46],
  wf:[1],gR:[-.3,1.0,.3],dR:[0,1,.06],pR:[-.35,-.45,-.8],wr:[0,0,0],gL:[.42,.98,.34],dL:[.1,1,.1],pL:[.6,-.6,-.5],fist:[12,95]});
const LI_W=wrP(LI_H,{fl:[.5],ob:[.6],h:[8,-12,0],sp:[6,-4,0],ch:[6,-6,0],nk:[0,0,0],FL:[.1,.01,-6,-.05,48],FR:[-.09,-.07,-24,-.04,44],
  gR:[-.34,1.08,.36],dR:[-.12,.9,.42],pR:[-.45,-.5,-.7],gL:[.44,1.42,.48],dL:[.4,.3,-.9],pL:[.85,-.5,-.1],fist:[45,95]});
/* IK rig and the staff's box corners in socket space, for the ground check */
function liRig(kind){const B=VB.lich,R=wrRig(B,false),V=THREE.Vector3,st=liStaff(kind,'#d0c4a0',null),bq=SH_BASIS(),C8=[];st.updateMatrixWorld(true);
  st.traverse(m=>{if(!m.isMesh)return;const p=m.geometry.parameters;for(let i=0;i<8;i++)C8.push(new V((i&1?.5:-.5)*p.width,(i&2?.5:-.5)*p.height,(i&4?.5:-.5)*p.depth).applyMatrix4(m.matrix).applyQuaternion(bq));});
  const v=new V();R.low=()=>{R.m.updateMatrixWorld(true);const M=R.J.socket_R.matrixWorld;let y=1e9;for(const c of C8){v.copy(c).applyMatrix4(M);if(v.y<y)y=v.y;}return y;};
  return R;}

function lichClips(kind,flk=1){const key=kind+':'+flk.toFixed(3);if(LICLIPS[key])return LICLIPS[key];const B=VB.lich,D=Math.PI*2,S=Math.sin,C=Math.cos,L=[],R=liRig(kind),V=THREE.Vector3,cl=x=>Math.min(1,Math.max(-1,x));
  /* elbow pole (weighted by ap): searched round the shoulder-wrist line for a forearm that crosses the staff at a right angle and an
     elbow out from the chest (as the goblin shaman's), so the staff never runs back through the arm. The wrist must not twist: with
     a straight wrist the staff leaves the fist across the forearm towards the shoulder side (inner), elbows that would need the
     fist rolled more than 60° from that cost more, beyond 100° much more; an elbow pointing inwards, up or forward is never chosen. With a
     carried staff (wf) any roll costs: the elbow is placed so that the straight wrist points the staff along dR */
  const pole=o=>{const w=o.ap[0];if(w<=0)return;R.m.updateMatrixWorld(true);const Sh=R.J.upperArm_R.getWorldPosition(new V()),W=R.J.hand_R.getWorldPosition(new V()),d=new V(...o.dR).normalize(),a=B.ua,b=B.fa;
    const cq=R.J.chest.getWorldQuaternion(new THREE.Quaternion()),out=new V(-1,0,0).applyQuaternion(cq),fw=new V(0,0,1).applyQuaternion(cq);
    const Dv=W.clone().sub(Sh),Dl=Math.min(Math.max(Dv.length(),.05),(a+b)*.999),u=Dv.normalize(),al=Math.acos(cl((a*a+Dl*Dl-b*b)/(2*a*Dl)));
    const pA=new V(...o.pR0);pA.addScaledVector(u,-pA.dot(u)).normalize();const e2=new V().crossVectors(u,pA);
    if(o.pPrev)o.pPrev=o.pPrev.clone().addScaledVector(u,-o.pPrev.dot(u)).normalize();
    let best=pA,bs=-1e9;for(let i=0;i<72;i++){const f=i/72*Math.PI*2,q=pA.clone().multiplyScalar(Math.cos(f)).addScaledVector(e2,Math.sin(f));
      const E=Sh.clone().addScaledVector(u,a*Math.cos(al)).addScaledVector(q,a*Math.sin(al)),F=W.clone().sub(E).normalize();
      const inn=Sh.clone().sub(E);inn.addScaledVector(F,-inn.dot(F));const dp=d.clone().addScaledVector(F,-d.dot(F));
      const tw=inn.lengthSq()>1e-8&&dp.lengthSq()>1e-8?Math.acos(cl(inn.normalize().dot(dp.normalize()))):0;
      const sc=-2*Math.abs(F.dot(d))+.4*q.dot(pA)-4*Math.max(0,.5-q.dot(out))-12*Math.max(0,-q.dot(out))-2*Math.max(0,tw-Math.PI/3)-8*Math.max(0,tw-Math.PI*.55)-3*o.wf[0]*tw-4*Math.max(0,q.y)-4*Math.max(0,q.dot(fw))+(o.pPrev?2*q.dot(o.pPrev):0);if(sc>bs){bs=sc;best=q;}}
    const pp=pA.clone().lerp(best,w).normalize(),E=Sh.clone().addScaledVector(u,a*Math.cos(al)).addScaledVector(pp,a*Math.sin(al));
    o.pR=pp.toArray();o.eR=new V(...o.eR0).normalize().lerp(W.clone().sub(E).normalize(),w).toArray();};
  /* continuity (one-shot clips): each elbow pole leans towards where that elbow pointed in the frame before */
  let EL=null;const elbows=()=>{const e={};R.m.updateMatrixWorld(true);for(const sd of['L','R']){const Sh=R.J['upperArm_'+sd].getWorldPosition(new V()),E=R.J['foreArm_'+sd].getWorldPosition(new V()),W=R.J['hand_'+sd].getWorldPosition(new V()),u=W.sub(Sh).normalize();
    E.sub(Sh);E.addScaledVector(u,-E.dot(u));if(E.lengthSq()>1e-6)e[sd]=E.normalize();}return e;};
  /* fl lifts the whole pose: hips, feet (their lift) and both grips; scaled by flk, the float height option */
  const lift=o=>{const f=o.fl[0]*flk;o.HP=[o.HP[0],o.HP[1]+f,o.HP[2]];for(const c of['FL','FR']){const F=o[c].slice();F[3]=(F[3]||0)+f;o[c]=F;}o.gR=[o.gR[0],o.gR[1]+f,o.gR[2]];o.gL=[o.gL[0],o.gL[1]+f,o.gL[2]];return o;};
  const solve=(p,cont)=>{const o=Object.assign({},p);liStaffPose(o);lift(o);
    if(cont&&EL)for(const sd of['L','R'])if(EL[sd]&&sd==='R'&&o.ap[0]<=.5)o['p'+sd]=new V(...o['p'+sd]).normalize().lerp(EL[sd],.75).normalize().toArray();
    o.pR0=o.pR;o.eR0=o.eR;o.pPrev=cont&&EL&&EL.R?EL.R.clone():null;let s=wrSolve(R,o);if(o.ap[0]>0)for(let i=0;i<2;i++){pole(o);s=wrSolve(R,o);}
    /* a carried staff (wf = 1) is not aimed: the fist follows the forearm, bent only by the keyed wrist angles wr [x tips the staff
       forward (>0) or back, y twists, z leans it sideways], so the wrist never rolls over; the staff points across the forearm towards
       the shoulder side (with the elbow bent about 90°, along the upper arm). wf blends from the aimed planted staff to this */
    const D2R=Math.PI/180,wrist=()=>{const w=o.wf[0];if(w<=0)return;const qa=new THREE.Quaternion().setFromEuler(new THREE.Euler(...s.wR.map(d=>d*D2R))),qb=new THREE.Quaternion().setFromEuler(new THREE.Euler(...o.wr.map(d=>d*D2R)));
      qa.slerp(qb,w);R.J.hand_R.quaternion.copy(qa);const e=new THREE.Euler().setFromQuaternion(qa);s.wR=[e.x/D2R,e.y/D2R,e.z/D2R];};wrist();
    /* the staff: a planted one stands on the ground, a carried one never goes below it */
    for(let it=0;it<3;it++){const y=R.low(),dy=o.pl[0]>.999?.008-y:Math.max(0,.008-y);if(Math.abs(dy)<3e-4)break;o.gR=[o.gR[0],o.gR[1]+dy,o.gR[2]];s=wrSolve(R,o);wrist();}
    /* the free left hand follows the forearm, bent only by the keyed wrist angles wl, so it never rolls over */
    s.wL=o.wl.slice();if(cont)EL=elbows();return s;};
  /* every clip also sizes the spell orb (orb_L.scale); one-shot clips name the clip that follows them (clip.next) */
  const CC=(name,dur,fn,o={})=>{EL=null;const cont=!o.loop,c=sampleClip(name,dur,t=>solve(fn(t),cont),Object.assign({autoFeet:false},o),B);
    const T=Array.from(c.tracks[0].times),P=[];for(const t of T){const s=Math.max(.001,fn(t).ob[0]);P.push(s,s,s);}c.tracks.push(new THREE.VectorKeyframeTrack('orb_L.scale',T,P));
    if(o.next)c.next=o.next;L.push(c);return c;};
  const KC=(name,dur,keys,note,base=LI_W,next='Idle (war mode)')=>CC(name,dur,wrKeys(keys.map(q=>[q[0],wrP(base,q[1])])),{note,next});
  /* in-place IK gait: feet slide back while planted and swing forward lifted; the staff is planted a little after the left heel,
     slides back with the ground (a shorter stance, same speed) and swings forward lifted */
  const GAIT=(name,dur,G,note)=>{const fn=t=>{const u=t/dur,o=G.body(u),c2=C(D*(u-G.duty/2));o.HP=[G.sw*c2,G.y0-G.b*C(2*D*(u-G.duty/2)),0];
      for(const[sd,off,x,yaw]of[['L',0,G.x,G.yaw[0]],['R',.5,-G.x,G.yaw[1]]]){const q=(((u+off)%1)+1)%1;let z,l,pt;
        if(q<G.duty){const v=q/G.duty;z=G.s*(1-2*v);l=0;pt=v<.15?-10*(1-v/.15):v>.7?G.toe*(v-.7)/.3:0;}
        else{const v=(q-G.duty)/(1-G.duty),sm=v*v*(3-2*v);z=-G.s+2*G.s*sm;l=G.lift*Math.sin(Math.PI*v);pt=G.toe*(1-v)*(1-v)-12*v*v;}
        o['F'+sd]=[x,z,yaw,l,pt];}
      const s=G.st,q=(((u-s.off)%1)+1)%1,ss=G.s*s.duty/G.duty;let z,l=0;
      if(q<s.duty)z=ss*(1-2*q/s.duty);else{const v=(q-s.duty)/(1-s.duty),sm=v*v*(3-2*v);z=-ss+2*ss*sm;l=s.lift*Math.sin(Math.PI*v);}
      o.T=[s.x,.012+l,s.z+z];o.G=[s.gx,s.gz+.45*z];o.pl=[1];return o;};
    const sp=2*G.s/(G.duty*dur),c=CC(name,dur,fn,{loop:true,note:`${note}, in place, ${(sp*LI_SC).toFixed(1)} m/s`});c.speed=sp*LI_SC;};

  /* ---- standing ---- */
  CC('Idle',5,t=>{const p=D*t/5,b=S(p),b2=S(2*p);return wrP(LI_N,{HP:[.008*b,-.015-.004*b2,0],h:[3,0,b],sp:[5+.6*b2,0,0],ch:[7+b2,2*S(p+.8),0],hd:[2*S(2*p+1),22*S(p+.6),0],
    gL:[.25,.84+.008*b2,.12+.02*S(p+.5)],fist:[35+15*Math.max(0,S(3*p)),95]});},{loop:true,note:'Stands leaning lightly on the planted staff, looks slowly round, the bony fingers twitch'});
  GAIT('Walk',1.2,{duty:.62,s:.17,lift:.05,toe:16,x:.1,yaw:[6,-6],y0:-.03,b:.008,sw:.012,st:{off:.04,duty:.55,lift:.06,x:-.36,z:.32,gx:-.34,gz:.24},
    body:u=>{const a=C(D*(u-.04));return wrP(LI_N,{h:[3,-5*a,2*S(D*(u+.1))],sp:[5,2*a,0],ch:[7,4*a,0],gL:[.25,.84,.12-.08*a]});}},'Slow, stately steps, the staff planted with every left step');

  /* ---- levitation ---- */
  KC('Levitate',2.6,[[0,{}],
    [.45,{HP:[0,-.04,0],hd:[-8,0,0],gL:[.36,.9,.14],dL:[.3,1,0],fist:[10,95]}],
    [.95,wrP(LI_H,{fl:[.06],HP:[0,-.01,0],hd:[-12,0,0],FL:[.1,.0,8,.0,32],FR:[-.1,-.03,-8,.0,28],gL:[.42,.96,.16],fist:[6,95]})],
    [1.7,wrP(LI_H,{fl:[.38],hd:[-6,0,0],FL:[.09,-.02,7,-.04,46],FR:[-.09,-.05,-7,-.03,42]})],
    [2.1,wrP(LI_H,{fl:[.48]})],
    [2.6,LI_H]],'Spreads the left hand palm down, lifts the staff and rises off the ground into the hover, toes pointing down',LI_N,'Hover');
  CC('Hover',4,t=>{const p=D*t/4,b=S(p),b2=S(2*p);return wrP(LI_H,{fl:[.45+.035*b],h:[2+1.5*b2,0,1.5*S(p+.5)],sp:[3+b2,0,0],ch:[4+1.2*S(p+1),0,-S(p+.5)],hd:[2*S(2*p+1),14*S(p+.3),0],
    FL:[.08,-.02+.03*S(p+.6),6,-.06,50+6*S(p+.6)],FR:[-.08,-.05+.03*S(p+2.2),-6,-.05,46+6*S(p+2.2)],gR:[-.32,1.02+.015*S(p+.4),.22],gL:[.42,.98+.03*S(p+.9),.34],fist:[12+8*S(2*p),95]});},
    {loop:true,note:'Floats about half a metre above the ground, bobbing slowly, legs dangling, robe hanging'});
  {const F=CC('Float',2.4,t=>{const p=D*t/2.4,b=S(p),b2=S(2*p);return wrP(LI_H,{fl:[.5+.02*b2],h:[14+b2,0,1.5*b],sp:[4,0,0],ch:[3,0,-b],hd:[2*S(2*p+1),0,0],
    FL:[.08,-.2+.02*b,6,-.02,62],FR:[-.08,-.24-.02*b,-6,0,60],gR:[-.32,1.06+.01*b2,.38],dR:[0,.88,.48],gL:[.4,.92+.02*b2,-.06],dL:[.3,1,-.2],fist:[15,95]});},
    {loop:true,note:'Glides forward in the air, leaning in, legs trailing, staff tilted ahead, in place, 1.2 m/s'});F.speed=1.2;}
  KC('Land',2.2,[[0,{}],
    [.6,{fl:[.3],FL:[.09,-.02,7,.03,44],FR:[-.09,-.05,-7,.04,40]}],
    [1.15,{fl:[.05],hd:[4,0,0],FL:[.1,.01,8,0,22],FR:[-.1,-.02,-8,0,18]}],
    [1.45,wrP(LI_N,{HP:[0,-.06,0],gL:[.32,.86,.14],fist:[15,95]})],
    [2.2,LI_N]],'Sinks back down, toes first, the knees give a little and the staff is planted again',LI_H,'Idle');

  /* ---- war mode (in the air) ---- */
  CC('Idle (war mode)',2.6,t=>{const p=D*t/2.6,b=S(p);return wrP(LI_W,{fl:[.5+.03*b],ch:[6+1.2*S(2*p),-6,0],hd:[1.5*S(2*p+1),6*S(p),0],
    FL:[.1,.01+.02*S(p+.5),-6,-.05,48+5*S(p+.5)],FR:[-.09,-.07+.02*S(p+2),-24,-.04,44+5*S(p+2)],gL:[.44,1.42+.02*S(2*p),.48],ob:[.58+.08*S(3*p)],fist:[45+8*S(2*p+.3),95]});},
    {loop:true,note:'Hovers higher, left side forward, staff angled ahead, the claw raised with the spell orb flickering in front of it'});
  {const F=CC('Float (war mode)',2.0,t=>{const p=D*t/2,b=S(p),b2=S(2*p);return wrP(LI_W,{fl:[.52+.02*b2],h:[16,-10,b],sp:[6,-4,0],ch:[4,-6,0],
    FL:[.1,-.14+.02*b,-6,-.02,62],FR:[-.09,-.24-.02*b,-24,0,60],gR:[-.34,1.1,.42],dR:[-.1,.8,.6],gL:[.3,1.32+.015*b2,.44],ob:[.6+.06*S(3*p)]});},
    {loop:true,note:'Advances through the air, leaning in, staff and claw held forward, in place, 0.9 m/s'});F.speed=.9;}
  KC('Spell 1 (bolt)',2.0,[[0,{}],
    [.45,{fl:[.55],h:[6,-26,0],sp:[2,-8,0],ch:[-2,-12,0],hd:[0,22,0],gR:[-.42,1.05,.3],dR:[0,1,.15],gL:[.28,1.15,.12],pL:[.1,-.5,-.86],fist:[20,95],ob:[.95]}],
    [.7,{fl:[.5],h:[10,8,0],sp:[6,4,0],ch:[8,10,0],hd:[0,-6,0],gR:[-.44,1.05,.24],dR:[0,1,.1],gL:[.12,1.36,.66],pL:[.3,-.9,-.2],fist:[0,95],ob:[1.15]}],
    [.78,{fl:[.5],h:[10,9,0],sp:[6,4,0],ch:[8,11,0],hd:[0,-6,0],gR:[-.44,1.05,.24],dR:[0,1,.1],gL:[.12,1.37,.67],pL:[.3,-.9,-.2],fist:[0,95],ob:[.001]}],
    [1.1,{fl:[.47],h:[6,4,0],sp:[4,2,0],ch:[4,6,0],hd:[-4,-4,0],gR:[-.4,1.06,.3],dR:[-.05,.95,.3],gL:[.2,1.28,.52],pL:[.3,-.85,-.4],fist:[10,95],ob:[.001]}],
    [1.5,{ob:[.1]}],
    [2.0,{}]],'Draws the orb in at its side, then thrusts the open hand forward and hurls it');
  KC('Spell 2 (raise the dead)',3.4,[[0,{}],
    [.7,{fl:[.78],h:[-2,0,0],sp:[-6,0,0],ch:[-10,0,0],nk:[-6,0,0],hd:[-22,0,0],FL:[.08,-.02,6,-.05,62],FR:[-.08,-.05,-6,-.04,58],
      gR:[-.32,1.3,.4],dR:[0,1,.08],pR:[-.3,-.95,0],gL:[.5,1.84,.2],dL:[0,-1,.1],pL:[.9,-.2,-.3],fist:[0,95],ob:[.8]}],
    [1.1,{fl:[.8],h:[-2,0,0],sp:[-6,0,0],ch:[-10,0,0],nk:[-6,0,0],hd:[-24,0,0],FL:[.08,-.02,6,-.05,62],FR:[-.08,-.05,-6,-.04,58],
      gR:[-.32,1.32,.4],dR:[0,1,.08],pR:[-.3,-.95,0],gL:[.51,1.86,.19],dL:[0,-1,.1],pL:[.9,-.2,-.3],fist:[0,95],ob:[1.0]}],
    [1.45,{fl:[.62],h:[18,0,0],sp:[10,0,0],ch:[12,0,0],nk:[6,0,0],hd:[16,0,0],FL:[.08,-.12,6,-.03,56],FR:[-.08,-.16,-6,-.02,52],
      gR:[-.32,1.18,.44],dR:[0,.9,.44],pR:[-.4,-.6,-.7],gL:[.24,.95,.56],dL:[0,1,.1],pL:[.85,-.4,-.3],fist:[0,95],ob:[.001]}],
    [2.5,{fl:[.6],h:[19,0,0],sp:[10,0,0],ch:[12,0,0],nk:[6,0,0],hd:[18,0,0],FL:[.08,-.12,6,-.03,56],FR:[-.08,-.16,-6,-.02,52],
      gR:[-.32,1.17,.45],dR:[0,.9,.44],pR:[-.4,-.6,-.7],gL:[.24,.93,.57],dL:[0,1,.1],pL:[.85,-.4,-.3],fist:[8,95],ob:[.001]}],
    [3.0,{fl:[.52],ob:[.2]}],
    [3.4,{}]],'Rises higher with staff and palm lifted, the orb swelling, then bows forward and presses the palm down at the ground to call up the dead, holds');
  KC('Spell 3 (drain life)',3.0,[[0,{}],
    [.5,{h:[12,4,0],sp:[6,2,0],ch:[8,4,0],hd:[6,0,0],gL:[.14,1.4,.66],dL:[0,.2,-1],fist:[0,95],ob:[.15]}],
    [1.0,{h:[12,4,0],sp:[6,2,0],ch:[8,4,0],hd:[6,0,0],gL:[.14,1.42,.64],dL:[0,.2,-1],fist:[55,95],ob:[.35]}],
    [2.0,{h:[2,-6,0],sp:[0,-2,0],ch:[-6,-8,0],hd:[-12,0,0],gL:[.26,1.32,.24],dL:[.3,.1,-1],fist:[85,95],ob:[.95]}],
    [2.4,{h:[0,-6,0],sp:[-2,-2,0],ch:[-8,-8,0],hd:[-18,0,0],gL:[.27,1.33,.23],dL:[.3,.1,-1],fist:[88,95],ob:[1.05]}],
    [3.0,{}]],'Reaches out with an open claw, clenches it and slowly drags the stolen life back to its chest, the orb swelling');
  KC('Staff strike',1.4,[[0,{}],
    [.42,{h:[2,-22,0],sp:[-2,-8,0],ch:[-6,-12,0],hd:[-4,18,0],gR:[-.46,1.56,.16],dR:[0,.35,-.94],pR:[-.25,-.5,.83],gL:[.4,1.2,.4],ob:[.2]}],
    [.6,{h:[12,4,0],sp:[8,2,0],ch:[8,4,0],hd:[2,-4,0],gR:[-.46,1.34,.46],dR:[0,.75,.66],pR:[-.25,-.95,.2],gL:[.38,1.06,.24],ob:[.2]}],
    [.72,{h:[18,8,0],sp:[12,4,0],ch:[12,6,0],hd:[8,-6,0],gR:[-.46,1.1,.46],dR:[0,.05,1],pR:[-.3,-.9,-.3],gL:[.36,1.0,.16],ob:[.2]}],
    [.95,{h:[16,6,0],sp:[10,4,0],ch:[10,6,0],hd:[6,-4,0],gR:[-.46,1.12,.44],dR:[0,.1,1],pR:[-.3,-.9,-.3],ob:[.25]}],
    [1.4,{}]],'Raises the staff like a hammer beside the right shoulder and chops it down ahead, the staff swinging clear of the body on its right');
  /* ---- hits while standing: the staff stays planted ---- */
  KC('Hit 1 (standing)',.9,[[0,{}],
    [.1,{HP:[0,-.03,-.06],h:[-6,-4,0],sp:[-8,0,0],ch:[-12,0,0],nk:[-8,0,0],hd:[-26,6,8],gL:[.36,1.0,.02],dL:[.6,.4,-.6],fist:[10,95]}],
    [.35,{HP:[0,-.03,-.03],h:[0,-2,0],sp:[2,0,0],ch:[2,0,0],hd:[-6,0,2],gL:[.3,.9,.08]}],
    [.9,{}]],'Blow to the face: the skull snaps back, the free hand flies up, then it straightens on the staff',LI_N,'Idle');
  KC('Hit 2 (standing)',1.2,[[0,{}],
    [.1,{HP:[.04,-.04,0],h:[4,18,-8],sp:[4,8,-6],ch:[0,10,-8],hd:[-8,22,-14],gL:[.44,1.0,.14],dL:[.9,.3,-.3],fist:[10,95]}],
    [.26,{HP:[.07,-.05,0],h:[6,12,-6],sp:[5,5,-4],ch:[2,6,-6],hd:[-2,14,-8],FL:[.15,.0,11,.05,0],T:[-.31,.05,.32],G:[-.29,.24],gL:[.42,.94,.16]}],
    [.4,{HP:[.08,-.06,0],h:[6,6,-4],sp:[6,2,-2],ch:[4,2,-4],hd:[0,8,-4],FL:[.19,-.02,14,0,0],T:[-.28,.012,.32],G:[-.26,.24],gL:[.38,.9,.16]}],
    [.62,{HP:[.06,-.05,0],h:[5,2,-2],FL:[.19,-.02,14,0,0],T:[-.28,.012,.32],G:[-.26,.24]}],
    [.82,{HP:[.03,-.03,0],FL:[.14,.01,10,.05,0],T:[-.33,.04,.32],G:[-.31,.24]}],
    [1.2,{}]],'Struck from the right: twists away, steps out to the left to catch itself, then steps back in',LI_N,'Idle');
  KC('Heavy hit (standing)',2.5,[[0,{}],
    [.12,{HP:[0,-.05,-.08],h:[-8,-6,0],sp:[-10,0,0],ch:[-14,0,0],nk:[-8,0,0],hd:[-26,0,6],gL:[.4,1.05,.02],dL:[.6,.4,-.6],fist:[10,95]}],
    [.36,{HP:[0,-.2,-.1],h:[8,-6,0],sp:[2,0,0],ch:[0,0,0],hd:[-8,0,4],FL:[.1,-.2,8,.07,30],gL:[.36,.8,.18],fist:[20,95]}],
    [.62,{HP:[0,-.42,-.1],h:[20,-4,0],sp:[10,0,0],ch:[8,0,0],hd:[6,0,0],T:[-.6,.012,.28],G:[-.5,.22],FL:[.1,-.42,8,0,70],gL:[.22,.56,.24],dL:[.3,.9,.2],pL:[.8,-.2,-.5],fist:[25,95]}],
    [1.35,{HP:[0,-.42,-.1],h:[22,-4,0],sp:[11,0,0],ch:[9,0,0],hd:[-4,8,4],T:[-.6,.012,.28],G:[-.5,.22],FL:[.1,-.42,8,0,70],gL:[.22,.55,.25],dL:[.3,.9,.2],pL:[.8,-.2,-.5],fist:[25,95]}],
    [1.7,{HP:[0,-.3,-.08],h:[24,-4,0],sp:[10,0,0],ch:[8,0,0],hd:[-6,0,2],T:[-.6,.012,.28],G:[-.5,.22],FL:[.1,-.36,8,0,42],gL:[.24,.62,.24],dL:[.3,.9,.2],pL:[.8,-.2,-.5],fist:[25,95]}],
    [2.0,{HP:[0,-.08,-.02],h:[8,-2,0],FL:[.1,-.08,8,.05,10]}],
    [2.5,{}]],'Knocked down onto the left knee, leaning on the planted staff and bracing on the knee, then pulls itself up',LI_N,'Idle');
  KC('Hit 1',.9,[[0,{}],
    [.1,{fl:[.44],HP:[0,0,-.16],h:[-8,-12,0],sp:[-10,-4,0],ch:[-14,-6,0],nk:[-8,0,0],hd:[-26,0,6],gR:[-.42,1.22,.16],gL:[.44,1.32,.16],dL:[.6,.3,-.7],fist:[10,95],ob:[.1]}],
    [.36,{fl:[.47],HP:[0,0,-.1],h:[2,-12,0],sp:[2,-4,0],ch:[0,-6,0],hd:[-8,0,0],gL:[.36,1.22,.3],ob:[.25]}],
    [.9,{}]],'Knocked back through the air, head snapping back, then drifts in again');
  KC('Hit 2',1.1,[[0,{}],
    [.1,{fl:[.46],HP:[.12,0,0],h:[6,14,-12],sp:[4,8,-8],ch:[0,10,-10],hd:[-10,22,-14],gL:[.48,1.2,.22],dL:[.8,.3,-.5],fist:[15,95],ob:[.1]}],
    [.38,{fl:[.48],HP:[.08,0,0],h:[8,-2,-6],sp:[6,-2,-4],ch:[4,-2,-4],hd:[-2,6,-4],gL:[.36,1.2,.34],ob:[.2]}],
    [.7,{HP:[.02,0,0]}],
    [1.1,{}]],'Struck from the right: twists away and drifts aside, then turns back');
  return LICLIPS[key]=L;}

ASSETS.push({id:'lich',folder:'characters/enemies/undead',name:'Lich',kind:'character',variants:true,defaultSeed:1,groundR:1.7,build:(s,o)=>buildLich(s,o||{}),
  opts:[{key:'head',label:'Headwear',choices:[['random','Random'],['crown','Crown'],['coif','Chain mail coif'],['diadem','Diadem with gem'],['none','None']],def:'random'},
    {key:'staff',label:'Staff',choices:[['random','Random'],['gnarled','Gnarled staff'],['bone','Bone staff'],['emerald','Staff with emerald'],['ruby','Staff with ruby'],['sapphire','Staff with sapphire']],def:'random'},
    {key:'robe',label:'Robe',choices:[['random','Random'],...Object.entries(LI_ROBE).map(([k,v])=>[k,v[1].charAt(0).toUpperCase()+v[1].slice(1)])],def:'random'},
    {key:'float',label:'Float height',choices:[['low','Low (just off the ground)'],['medium','Medium (knee height)'],['high','High (half a metre)']],def:'low'},
    {key:'eyes',label:'Eyes',choices:[['random','Random'],...Object.entries(LI_EYES).map(([k,v])=>[k,v[2].charAt(0).toUpperCase()+v[2].slice(1)])],def:'random'},
    SK_OPT.bones],
  desc:'Undead sorcerer, about 1.9 m: a skeleton in a ragged robe (deep purple, black, blood red, midnight blue, grave green, ash grey or faded brown) with a high collar, flaring torn sleeves and an open front showing the ribs and a glowing phylactery. Wears a crown, a chain mail coif, a diadem with a gem or nothing; carries a gnarled staff, a bone staff with a small skull, or a staff with a glowing emerald, ruby or sapphire. Eyes glow pale blue, green, purple, red, gold or white. Walks leaning on the staff or levitates: Idle, Walk, Levitate (rises off the ground), Hover, Float, Land; war mode in the air: Idle, Float, three spells (bolt, raise the dead, drain life) with a spell orb in the left hand, Staff strike, two hits, Death (drops and falls apart into bones and robe) and Rise.'});
