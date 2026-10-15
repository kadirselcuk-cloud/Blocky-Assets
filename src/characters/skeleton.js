/* ======================= SKELETON: undead warrior on the villager joint layout =======================
   Human-sized (VB.skeleton is the villager male's proportions), so every warrior sword-and-shield clip is reused unchanged.
   Each joint carries one bone piece (a named group: bone_skull, bone_ribs, bone_femur_L…); worn armour sits inside the piece
   it covers, the weapon is weapon_R in the right socket, the buckler shield_L in the left. Death and Rise are recorded on the
   model itself: the bone pieces come loose, fall under gravity and stack into a pile (a height map keeps them from passing
   through each other); Rise lifts them off the pile top first and flies each one back to its joint. */
VB.skeleton=Object.assign({},VB.male,{sex:'male'});
{const b=VB.skeleton;b.key='skeleton';b.hipH=b.thigh+b.shin+b.ankle+b.hipOff;b.legS=(b.thigh+b.shin)/.84;b.tS=(b.spine+b.chest)/.3;b.cS=b.neck/.22;}
/* bone tints: "New look" rolls the first three; dark and reddish (fire skeleton) only when picked in the options */
const SK_BONE={bleached:['#e2dac2','bleached'],aged:['#cdbf98','aged'],grimy:['#ab9d7a','grimy'],dark:['#57504a','dark'],red:['#a85a3e','reddish']};
const SK_EYES={blue:['#a8dcfa','#5ab4ec','pale blue glow'],green:['#a4ecbc','#4cd88a','green glow'],dark:null};
const SK_ARMOR={leather:'leather',chain:'chain mail',plate:'plate'};
/* armour areas, and how many of them each coverage choice wears (Random rolls every area on its own) */
const SK_AREAS=['helm','chest','boots','gloves','shoulders','bracers','belt','thighs'],SK_COVER={few:[2,3],most:[5,6],full:[8,8]};
const SK_BX=bx;
const SK_WPN={club:'small club',axe:'crude axe',sword:'crude sword'};

/* small wooden club: grip at the origin, along +y (same frame as gbWeapon) */
function skClub(){const w=new THREE.Group(),wood=bm('#6a4a2e','leather'),wdD=bm('#4e3826','leather'),wrap=bm('#3c2a1c','leather');
  bx(w,.04,.14,.04,wrap,0,.01,0);bx(w,.046,.06,.046,wdD,0,-.07,0);bx(w,.05,.2,.05,wood,0,.17,0);bx(w,.072,.15,.072,wood,0,.34,0);bx(w,.056,.04,.056,wood,0,.435,0);
  bx(w,.026,.04,.026,wdD,.042,.3,0);bx(w,.024,.03,.024,wdD,-.04,.37,.01);bx(w,.022,.03,.022,wdD,.01,.32,-.04);w.userData.len=.46;return w;}
/* round-ish buckler, face towards +z: plank columns, iron rim on the outer cells, boss in the middle, grip bar behind */
function skBuckler(){const g=new THREE.Group(),wood=bm('#7a5634','leather'),wdD=bm('#5a3e26','leather'),ir=vm('iron'),irD=bm('#4a4e54','plain'),R=.16,c=.04;
  for(let x=-R+c/2;x<R;x+=c){const hz=Math.round(Math.sqrt(Math.max(0,R*R-x*x))/.02)*.02;bx(g,c,2*hz,.022,Math.round((x+R)/c)%2?wood:wdD,x,0,0);
    for(const s of[-1,1])bx(g,c,.02,.03,ir,x,s*(hz+.01),0);if(Math.abs(x)>R-c)bx(g,.02,2*hz,.03,ir,x+Math.sign(x)*(c/2+.01),0,0);}
  bx(g,.07,.07,.03,ir,0,0,.026);bx(g,.04,.04,.016,irD,0,0,.048);bx(g,.02,.1,.022,wdD,0,0,-.022);return g;}

function buildSkeleton(seed,o={}){const B=o.B||VB.skeleton,r=mulberry32(((seed*2654435761)>>>0)^0x5c31),pick=a=>a[Math.floor(r()*a.length)],root=new THREE.Group();root.userData.lights=[];
  /* roll everything, then let the options override (o.armorRoll / o.coverDef: another body type's own odds) */
  const boneC0=pick(['bleached','aged','grimy']),eyeK0=pick(['blue','blue','green','dark']),arm0=pick(o.armorRoll||['none','leather','leather','chain','chain','plate']),wpn0=pick(['club','axe','sword']);
  const has0={helm:r()<.5,chest:r()<.45,gloves:r()<.4,boots:r()<.45,shoulders:r()<.4,bracers:r()<.4,belt:r()<.4,thighs:r()<.35},order=SK_AREAS,extra=pick(order);
  const rank=order.map(k=>[k,r()]).sort((a,b)=>a[1]-b[1]).map(a=>a[0]),nCov=r();
  const opt=(k,d)=>o[k]&&o[k]!=='random'?o[k]:d,boneC=SK_BONE[opt('bones',boneC0)],eyeK=opt('eyes',eyeK0),arm=opt('armor',arm0),wpn=opt('weapon',wpn0),cov=opt('cover',o.coverDef||'random');
  /* Random: every area rolled on its own (at least one piece when an armour type is chosen); otherwise the first n areas of a shuffled order */
  const has={};if(cov==='random'){for(const k of order)has[k]=arm!=='none'&&has0[k];if(arm!=='none'&&!order.some(k=>has[k]))has[extra]=true;}
  else{const[a,b]=SK_COVER[cov],n=a+Math.floor(nCov*(b-a+1));for(const k of order)has[k]=arm!=='none'&&rank.indexOf(k)<n;}
  const shade=(h,f)=>'#'+new THREE.Color(h).multiplyScalar(f).getHexString(),bone=bm(boneC[0],'plain'),boneD=bm(shade(boneC[0],.78),'plain'),dark=bm('#16120e','plain');
  const ey=(o.eyeTab||SK_EYES)[eyeK],eyeM=ey?wrGlow(ey[0],ey[1],1.6,pxTex('plain')):bm('#2a2420','plain');
  /* armour materials: one type for every worn piece */
  const AM=arm==='leather'?{a:bm('#5a3a24','leather'),b:bm('#3e2818','leather'),c:bm('#6e4a2e','leather')}:arm==='chain'?{a:vm('mail'),b:bm('#4a4e54','plain'),c:vm('mail')}:
    {a:bm('#8a9096','plain'),b:bm('#5e646a','plain'),c:bm('#7a4a2e','plain')};
  /* joints: same names, offsets and order as buildVillager; every joint gets a bone piece. A heavier body type (B.boneK) widens
     every box of a piece across the bone (x and z, sizes and offsets), so the bones and the armour on them grow thicker together */
  const BK=B.boneK||{},kOf=g=>{while(g&&g.userData.k===undefined)g=g.parent;return g?g.userData.k:1;};
  const bx=(g,w,h,d,m,x=0,y=0,z=0,rx,ry,rz)=>{const k=kOf(g);return SK_BX(g,w*k,h,d*k,m,x*k,y,z*k,rx,ry,rz);};
  const P=(name,par)=>{const g=new THREE.Group();g.name=name;g.userData.piece=true;g.userData.k=BK[name.replace(/^bone_|_[LR]$/g,'')]||1;par.add(g);return g;};
  const hips=J('hips',root,0,B.hipH,0),spine=J('spine',hips,0,B.spine,0),chest=J('chest',spine,0,B.chest,0),neck=J('neck',chest,0,B.neck,0),head=J('head',neck,0,B.headY,0);
  /* pelvis: flared wings, sacrum, pubic arch, hip sockets */
  const pv=P('bone_pelvis',hips);for(const s of[-1,1]){bx(pv,.055,.1,.09,bone,s*.07,.03,-.01,0,0,-s*.3);bx(pv,.03,.06,.03,bone,s*.05,-.03,.03);bx(pv,.045,.04,.045,boneD,s*.075,-.035,0);}
  bx(pv,.06,.09,.04,boneD,0,.01,-.055);bx(pv,.1,.03,.03,bone,0,-.05,.035);
  /* lumbar spine */
  const sp=P('bone_spine',spine);bx(sp,.022,.15,.022,boneD,0,-.01,-.07);for(const y of[-.07,-.03,.01,.05])bx(sp,.045,.028,.04,bone,0,y,-.07);
  /* ribcage: thoracic spine, sternum, five rib hoops (the lowest two open at the front), collarbones, shoulder blades */
  const rc=P('bone_ribs',chest);bx(rc,.04,.34,.035,boneD,0,.03,-.085);bx(rc,.035,.17,.02,bone,0,.09,.085);
  [[.17,.2],[.11,.24],[.05,.25],[-.01,.24],[-.07,.21]].forEach(([y,w],i)=>{const t=.022,d=.15,f=i<3?.02:.06;
    for(const s of[-1,1]){bx(rc,t,t,d,bone,s*w/2,y,0);bx(rc,w/2-f,t,t,bone,s*(f+w/2)/2,y,d/2);bx(rc,w/2-.02,t,t,bone,s*(.02+w/2)/2,y,-d/2);}});
  for(const s of[-1,1]){bx(rc,.15,.022,.022,bone,s*.095,.2,.05);bx(rc,.08,.11,.016,bone,s*.085,.1,-.093);}
  /* neck vertebrae */
  const nk=P('bone_neck',neck);for(const y of[-.025,.015,.05])bx(nk,.045,.028,.045,bone,0,y,-.02);
  /* skull: cranium, brow, deep eye sockets (glowing embers unless dark), nose hole, cheekbones, upper jaw with teeth */
  const sk=P('bone_skull',head);bx(sk,.21,.17,.24,bone,0,.165,-.005);bx(sk,.17,.03,.2,bone,0,.262,-.01);bx(sk,.17,.08,.04,bone,0,.12,-.13);bx(sk,.04,.04,.04,boneD,0,.06,-.03);
  bx(sk,.2,.03,.03,bone,0,.16,.125);bx(sk,.03,.035,.01,dark,0,.093,.118);
  for(const s of[-1,1]){bx(sk,.06,.048,.012,dark,s*.05,.12,.118);bx(sk,.02,.02,.008,eyeM,s*.05,.118,.126);bx(sk,.035,.03,.06,bone,s*.085,.1,.08);}
  bx(sk,.14,.06,.07,bone,0,.06,.075);for(let i=-2;i<=2;i++)bx(sk,.018,.022,.012,bone,i*.022,.024,.1);
  /* lower jaw: its own piece, hanging a little open */
  const jw=P('bone_jaw',head),jg=new THREE.Group();put(jw,jg,0,.06,-.005,.12,0,0);
  bx(jg,.13,.03,.03,bone,0,-.07,.1);for(const s of[-1,1]){bx(jg,.025,.03,.1,bone,s*.065,-.065,.05);bx(jg,.025,.065,.03,bone,s*.07,-.03,0);}for(let i=-1.5;i<=1.5;i++)bx(jg,.018,.016,.012,bone,i*.022,-.047,.1);
  /* arms: humerus, radius and ulna, hand bones; finger joints carry their own pieces */
  for(const[sd,s]of[['L',1],['R',-1]]){const sh=J('shoulder_'+sd,chest,s*B.shW*.325,.165*B.cS,0),ua=J('upperArm_'+sd,sh,s*B.shW*.675,0,0),fa=J('foreArm_'+sd,ua,0,-B.ua,0),hd=J('hand_'+sd,fa,0,-B.fa,0);
    const hu=P('bone_humerus_'+sd,ua);bx(hu,.05,.05,.05,bone,0,-.005,0);bx(hu,.03,.22,.03,bone,0,-.14,0);bx(hu,.05,.04,.045,bone,0,-.27,0);
    const fr=P('bone_forearm_'+sd,fa);bx(fr,.018,.22,.018,bone,0,-.125,.012);bx(fr,.018,.23,.018,boneD,0,-.12,-.012);bx(fr,.04,.025,.04,bone,0,-.245,0);
    const hk=B.hand,hw=.12*B.g*.85,hb=P('bone_hand_'+sd,hd);bx(hb,.035,.03,.045,bone,0,-.025,0);for(const z of[-.018,-.006,.006,.018])bx(hb,.012,.045,.01,bone,0,-.06,z);
    const fg=J('fingers_'+sd,hd,0,-.085*hk,0),ft=J('fingerTips_'+sd,fg,0,-.035*hk,0),th=J('thumb_'+sd,hd,-s*.02*hk,-.04*hk,hw/2);
    const fb=P('bone_fingers_'+sd,fg),tb=P('bone_tips_'+sd,ft),thb=P('bone_thumb_'+sd,th);for(const z of[-.018,-.006,.006,.018]){bx(fb,.012,.03,.01,bone,0,-.016,z);bx(tb,.011,.022,.009,bone,0,-.011,z);}
    bx(thb,.013,.04,.013,bone,0,-.018,-.02);
    const so=J('socket_'+sd,hd,-s*.012*hk,-.075*hk,0);so.userData.socket=true;
    if(has.gloves){bx(hb,.05,.075,.06,AM.a,0,-.045,0);bx(fb,.04,.036,.055,AM.a,0,-.016,0);bx(tb,.035,.026,.05,AM.a,0,-.011,0);bx(thb,.024,.045,.024,AM.a,0,-.018,-.02);
      const cf=arm==='plate'?.075:.064;bx(fr,cf,.075,cf,arm==='plate'?AM.a:AM.b,0,-.21,0);if(arm==='plate')bx(hb,.054,.04,.064,AM.b,0,-.03,0);}
    if(has.chest&&arm==='chain')bx(hu,.075,.11,.075,AM.a,0,-.05,0);
    if(has.chest&&arm==='plate'&&!has.shoulders){bx(hu,.09,.045,.09,AM.a,s*.006,.012,0);bx(hu,.084,.03,.084,AM.b,s*.006,-.02,0);}
    /* shoulders: leather pad with a strap, mail mantle, or a three-layer pauldron */
    if(has.shoulders){if(arm==='leather'){bx(hu,.086,.035,.1,AM.a,s*.008,.03,0);bx(hu,.08,.05,.094,AM.a,s*.012,-.005,0);bx(hu,.09,.012,.104,AM.b,s*.008,.012,0);}
      else if(arm==='chain'){bx(hu,.09,.07,.09,AM.a,s*.006,0,0);bx(hu,.094,.015,.094,AM.b,s*.006,-.035,0);}
      else{bx(hu,.105,.05,.105,AM.a,s*.01,.02,0);bx(hu,.1,.03,.1,AM.b,s*.012,-.015,0);bx(hu,.094,.03,.094,AM.a,s*.014,-.045,0);bx(hu,.02,.02,.012,AM.c,s*.01,.025,.056);}}
    /* forearms: laced leather bracer, mail sleeve, or a vambrace with an elbow cop */
    if(has.bracers){if(arm==='leather'){bx(fr,.052,.12,.06,AM.a,0,-.13,0);for(const y of[-.1,-.16])bx(fr,.055,.012,.063,AM.b,0,y,0);}
      else if(arm==='chain')bx(fr,.056,.17,.06,AM.a,0,-.1,0);
      else{bx(fr,.06,.14,.064,AM.a,0,-.125,0);bx(fr,.064,.02,.068,AM.b,0,-.06,0);bx(fr,.054,.05,.04,AM.b,0,-.008,-.02);}}}
  /* legs: femur with kneecap, tibia and fibula, foot bones whose sole matches the IK foot (heel to toe, 0.07 below the ankle) */
  for(const[sd,s]of[['L',1],['R',-1]]){const th=J('thigh_'+sd,hips,s*B.hipW,-(B.hipOff+.01),0),sn=J('shin_'+sd,th,0,-B.thigh,0),ft=J('foot_'+sd,sn,0,-B.shin,0);
    const fe=P('bone_femur_'+sd,th);bx(fe,.055,.05,.05,bone,0,-.01,0);bx(fe,.035,.36,.035,bone,0,-.215,0);bx(fe,.06,.045,.055,bone,0,-.408,0);bx(fe,.035,.04,.02,bone,0,-.41,.036);
    const sb=P('bone_shin_'+sd,sn);bx(sb,.055,.035,.05,bone,0,-.022,0);bx(sb,.035,.34,.035,bone,0,-.2,.005);bx(sb,.016,.31,.016,boneD,s*.022,-.2,-.012);bx(sb,.045,.03,.04,bone,0,-.395,0);
    const fb=P('bone_foot_'+sd,ft);bx(fb,.04,.035,.04,bone,0,-.025,0);bx(fb,.04,.035,.055,bone,0,-.0525,-.045);bx(fb,.05,.025,.04,bone,0,-.045,.02);
    for(const x of[-.024,-.008,.008,.024]){bx(fb,.011,.016,.07,bone,x,-.062,.07);bx(fb,.011,.014,.026,bone,x,-.063,.12);}
    if(has.boots){const pl=arm==='plate';bx(sb,pl?.08:.074,pl?.24:.2,pl?.08:.074,AM.a,0,pl?-.29:-.31,0);bx(sb,pl?.086:.08,.03,pl?.086:.08,AM.b,0,pl?-.17:-.21,0);
      bx(fb,.066,.05,.2,AM.a,0,-.043,.03);if(pl){bx(fb,.07,.02,.07,AM.b,0,-.01,.0);bx(sb,.03,.04,.012,AM.c,s*.02,-.3,.042);}}
    /* thighs: strapped leather guard, mail, or a plate cuisse with a knee cop over the kneecap */
    if(has.thighs){if(arm==='leather'){bx(fe,.066,.17,.066,AM.a,0,-.2,0);bx(fe,.069,.015,.069,AM.b,0,-.15,0);bx(fe,.069,.015,.069,AM.b,0,-.25,0);}
      else if(arm==='chain')bx(fe,.07,.24,.07,AM.a,0,-.2,0);
      else{bx(fe,.074,.22,.074,AM.a,0,-.2,0);bx(fe,.078,.025,.078,AM.b,0,-.1,0);bx(fe,.07,.06,.036,AM.a,0,-.41,.03);}}
    /* belt: the tassets (or the top of the mail skirt) ride on the thigh, so they swing with the leg */
    if(has.belt){if(arm==='chain')bx(fe,.074,.1,.074,AM.a,0,-.04,0);
      else{const pl=arm==='plate';bx(fe,.078,pl?.11:.1,.016,AM.a,s*.008,-.045,.045,pl?-.12:-.08);bx(fe,.016,pl?.11:.1,.07,AM.a,s*.046,-.045,0,0,0,s*.1);}}}
  /* belt round the pelvis: leather with a buckle, mail skirt band, or a plate fauld on a strap */
  if(has.belt){if(arm==='leather'){bx(pv,.25,.04,.19,AM.b,0,.035,-.01);bx(pv,.045,.04,.012,AM.c,0,.035,.088);}
    else if(arm==='chain'){bx(pv,.26,.1,.2,AM.a,0,.01,-.01);bx(pv,.265,.02,.205,AM.b,0,.06,-.01);}
    else{bx(pv,.26,.055,.2,AM.a,0,.03,-.01);bx(pv,.265,.02,.205,AM.c,0,.065,-.01);bx(pv,.04,.03,.012,AM.b,0,.065,.094);}}
  /* helmet */
  if(has.helm){if(arm==='leather'){bx(sk,.24,.07,.27,AM.a,0,.245,-.005);bx(sk,.25,.025,.28,AM.b,0,.215,-.005);for(const s of[-1,1])bx(sk,.02,.08,.1,AM.a,s*.122,.17,-.03);bx(sk,.03,.03,.2,AM.b,0,.29,-.01);}
    else if(arm==='chain'){bx(sk,.25,.05,.28,AM.a,0,.255,-.005);for(const s of[-1,1])bx(sk,.025,.2,.24,AM.a,s*.125,.15,-.02);bx(sk,.25,.2,.025,AM.a,0,.15,-.16);bx(sk,.26,.022,.29,AM.b,0,.226,-.005);}
    else{bx(sk,.25,.08,.28,AM.a,0,.245,-.005);bx(sk,.19,.03,.21,AM.a,0,.297,-.005);bx(sk,.33,.018,.36,AM.b,0,.205,-.005);bx(sk,.05,.03,.012,AM.c,.06,.25,.136);bx(sk,.03,.04,.012,AM.c,-.08,.24,-.146);}}
  /* chest armour: leather cuirass (lowest ribs show), mail shirt with a ragged hem, or breast and back plates on side straps */
  if(has.chest){if(arm==='leather'){bx(rc,.29,.22,.215,AM.a,0,.07,-.005);for(const s of[-1,1])bx(rc,.045,.02,.22,AM.b,s*.08,.19,-.005);bx(rc,.3,.03,.225,AM.b,0,-.03,-.005);bx(rc,.05,.05,.01,AM.c,-.06,.1,.104);}
    else if(arm==='chain'){bx(rc,.3,.3,.22,AM.a,0,.03,-.005);for(let i=0;i<7;i++){const L=.03+.04*r();bx(rc,.035,L,.225,AM.a,-.13+i*.043,-.12-L/2+.003,-.005);}}
    else{bx(rc,.29,.22,.03,AM.a,0,.07,.11);bx(rc,.29,.22,.03,AM.a,0,.07,-.125);bx(rc,.04,.16,.012,AM.b,0,.07,.13);for(const s of[-1,1]){bx(rc,.02,.04,.26,bm('#3e2818','leather'),s*.135,.13,-.007);bx(rc,.02,.04,.26,bm('#3e2818','leather'),s*.135,.0,-.007);bx(rc,.04,.02,.24,AM.b,s*.08,.19,-.007);}
      bx(rc,.06,.05,.012,AM.c,.07,.03,.128);}}
  /* weapon in the right hand (blade along the thumb side, edge towards the fingers), buckler in the left facing out */
  /* o.gear: another skeleton kind brings its own gear (the lich), so no weapon or buckler here */
  if(o.archer)skaGear(root,chest,has,arm,AM);else if(!o.gear){
  const wr=new THREE.Group();wr.name='weapon_R';wr.userData.piece=wr.userData.gear=true;root.getObjectByName('socket_R').add(wr);const wp=o.great?skwSword(o.great):wpn==='club'?skClub():gbWeapon(wpn);
  wp.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(new THREE.Vector3(0,-1,0),new THREE.Vector3(0,0,1),new THREE.Vector3(-1,0,0)));wr.add(wp);wr.userData.long=!!o.great;
  /* two-handed sword: no buckler, the left fist grips the long handle WR_HAFT behind the right one */
  if(!o.great){const sl=new THREE.Group();sl.name='shield_L';sl.userData.piece=sl.userData.gear=true;sl.userData.dropDt=.03;root.getObjectByName('socket_L').add(sl);const bk=skBuckler();bk.rotation.y=Math.PI/2;bk.position.x=.055;sl.add(bk);}}
  /* both fists stay closed around their grips */
  const D2=Math.PI/180,Jn=n=>root.getObjectByName(n);
  root.userData.post=()=>{for(const[sd,s]of[['R',1],['L',-1]]){Jn('fingers_'+sd).rotation.set(0,0,s*95*D2);Jn('fingerTips_'+sd).rotation.set(0,0,s*90*D2);Jn('thumb_'+sd).rotation.set(14*D2,0,s*33*D2);}};
  const joints=[];root.traverse(q=>{if(q.userData.joint&&!q.userData.socket)joints.push(q);});root.userData.joints=joints;
  if(!o.noClips){const base=o.archer?skaClips(B,root):(o.great?warriorClips(B,{axe:true,long:true}):warriorClips(B,{sword:true,shield:true})).filter(c=>c.name!=='Cast spell');root.userData.clips=base;root.userData.clips=base.concat(skDeathRise(root,B,seed));}
  root.userData.ground=1.6;
  const A3=(l,c,p)=>arm==='leather'?l:arm==='chain'?c:p;
  const worn=order.filter(k=>has[k]).map(k=>({helm:'helmet',chest:A3('cuirass','shirt','breastplate'),gloves:A3('gloves','gloves','gauntlets'),boots:A3('boots','boots','greaves'),
    shoulders:A3('shoulder pads','mantle','pauldrons'),bracers:A3('bracers','sleeves','vambraces'),belt:A3('belt and tassets','skirt','fauld and tassets'),thighs:A3('thigh guards','cuisses','cuisses')}[k]));
  root.userData.variantText=`${boneC[1].charAt(0).toUpperCase()+boneC[1].slice(1)} bones, ${ey?ey[2]+' in the eye sockets':'dark eye sockets'}; ${worn.length?SK_ARMOR[arm]+' '+worn.join(', '):'no armour'}; ${o.archer?'bow, arrow and quiver':o.great?'two-handed sword':SK_WPN[wpn]+' and buckler'}.`;
  return root;}

/* ---------- Death (collapse into a pile of bones) and Rise (reassemble from it) ----------
   Recorded on the model: the war stance comes from the first frame of Idle (war mode); a recoil and a shudder are added as
   joint offsets (gbDeathKeys) with the body grounded on its lowest point. At tDet every bone piece lets go (weapon and buckler
   a little earlier), falls under gravity while turning to lie flat, and lands on a height map of what has already landed, so the
   pile stacks without pieces passing through each other. Rise starts on that pile: the bones tremble, lift off top first, fly back
   to their joints along an arc, then the body straightens out of the slump into the war stance. */
function skDeathRise(root,B,seed,X={}){const D2R=Math.PI/180,V=THREE.Vector3,Q=THREE.Quaternion,M4=THREE.Matrix4,JN={},r=mulberry32(((seed*40503)>>>0)^0x77),ss=s=>s*s*(3-2*s);
  root.traverse(q=>{if(q.userData.joint)JN[q.name]=q;});const post=root.userData.post,gearPose=root.userData.gearPose,gearTr=root.userData.gearTracks||[];
  const war=root.userData.clips.find(c=>c.name==='Idle (war mode)'),mx=new THREE.AnimationMixer(root),act=mx.clipAction(war);act.play();act.time=0;mx.update(0);post();
  const Q0={};for(const j of RIG_JOINTS)Q0[j]=JN[j].quaternion.clone();const H0=JN.hips.position.clone();act.stop();mx.uncacheRoot(root);
  /* pieces and chunks (a hand falls in one piece with its fingers) */
  const pieces={};root.traverse(q=>{if(q.userData.piece)pieces[q.name]=q;});const chunks=[];
  for(const n in pieces){if(/^bone_(fingers|tips|thumb)_/.test(n)||pieces[n].userData.joinChunk)continue;const sd=n.slice(-1),list=[pieces[n]];if(/^bone_hand_/.test(n))for(const f of['fingers','tips','thumb'])list.push(pieces['bone_'+f+'_'+sd]);chunks.push({name:n,list});}
  /* pieces flagged joinChunk fall rigidly with the chunk they name (the ghoul's torso, a shin with its foot) */
  for(const n in pieces){const jc=pieces[n].userData.joinChunk;if(jc)chunks.find(c=>c.name===jc).list.push(pieces[n]);}
  const isW=q=>{while(q){if(q.userData.gear)return true;q=q.parent;}return false;},body=[];root.traverse(q=>{if(q.isMesh&&!isW(q))body.push(q);});
  const corner=new V(),cornersOf=(m,Mx)=>{const p=m.geometry.parameters,out=[];for(let i=0;i<8;i++)out.push(new V((i&1?.5:-.5)*p.width,(i&2?.5:-.5)*p.height,(i&4?.5:-.5)*p.depth).applyMatrix4(Mx));return out;};
  const lowest=()=>{let y=1e9;for(const q of body){const p=q.geometry.parameters;for(let i=0;i<8;i++){corner.set((i&1?.5:-.5)*p.width,(i&2?.5:-.5)*p.height,(i&4?.5:-.5)*p.depth).applyMatrix4(q.matrixWorld);if(corner.y<y)y=corner.y;}}return y;};
  /* recoil, shudder and slump: offsets (degrees) on top of the war stance */
  const CH=['h','sp','ch','nk','hd','uL','fL','wL','uR','fR','wR','tL','kL','aL','tR','kR','aR'],K0={jit:[0]};for(const c of CH)K0[c]=[0,0,0];
  const tDet=X.tDet||.58,tW=X.tW||.5,DK=gbDeathKeys(K0,X.keys||[
    [.1,{sp:[-8,0,0],ch:[-12,0,0],nk:[-6,0,0],hd:[-16,0,4],uL:[-8,0,8],uR:[-12,0,-10]},'out'],
    [.3,{sp:[2,0,2],ch:[4,0,4],nk:[4,0,0],hd:[8,10,18],uL:[10,0,0],uR:[14,0,0],tL:[-10,0,0],kL:[20,0,0],aL:[-10,0,0],tR:[-10,0,0],kR:[20,0,0],aR:[-10,0,0],jit:[1]}],
    [tDet,{sp:[8,0,4],ch:[12,0,6],nk:[10,0,0],hd:[18,14,26],uL:[22,0,-6],uR:[26,0,6],fL:[10,0,0],fR:[10,0,0],tL:[-22,0,0],kL:[44,0,0],aL:[-22,0,0],tR:[-22,0,0],kR:[44,0,0],aR:[-22,0,0],jit:[.7]},'in']]);
  const PH={};for(const c of CH)PH[c]=[0,1,2].map(()=>[r()*6.28,(6+3*r())*6.28]);
  const e=new THREE.Euler(),qe=new Q();let lo0=null;
  const poseAt=td=>{td=Math.min(td,tDet);const p=DK(td),jt=p.jit[0]*4;for(const j of RIG_JOINTS)JN[j].quaternion.copy(Q0[j]);
    for(const c of CH){const o=p[c],ph=PH[c];e.set((o[0]+jt*Math.sin(ph[0][0]+ph[0][1]*td))*D2R,(o[1]+jt*Math.sin(ph[1][0]+ph[1][1]*td))*D2R,(o[2]+jt*Math.sin(ph[2][0]+ph[2][1]*td))*D2R);JN[JALIAS[c]].quaternion.multiply(qe.setFromEuler(e));}
    post();JN.hips.position.copy(H0);root.updateMatrixWorld(true);const lo=lowest();if(lo0===null)lo0=lo;JN.hips.position.y-=lo-lo0*(1-Math.min(1,td/.3));root.updateMatrixWorld(true);
    /* archer: the string stays in the hand until the bow is let go, the arrow stays nocked */
    if(gearPose){gearPose({pull:Math.min(1,Math.max(0,(tW-td)/.05)),aw:1,av:1});root.updateMatrixWorld(true);}};
  /* detach state of every chunk: anchor transform, box corners in the anchor frame, centre */
  const dec=Mx=>{const p=new V(),q=new Q(),s=new V();Mx.decompose(p,q,s);return{p,q};};
  const capture=ch=>{const A=ch.list[0].matrixWorld.clone(),Ai=A.clone().invert();ch.rel=ch.list.map(g=>Ai.clone().multiply(g.matrixWorld));ch.boxes=[];
    for(const g of ch.list)g.traverse(m=>{if(m.isMesh)ch.boxes.push(cornersOf(m,Ai.clone().multiply(m.matrixWorld)));});
    const bb=new THREE.Box3();for(const b of ch.boxes)for(const c of b)bb.expandByPoint(c);ch.cl=bb.getCenter(new V());const d=dec(A);ch.q0=d.q;ch.c0=ch.cl.clone().applyQuaternion(d.q).add(d.p);};
  const wpnCh=chunks.filter(c=>c.list[0].userData.gear),bodyCh=chunks.filter(c=>!wpnCh.includes(c));
  poseAt(0);for(const c of wpnCh){c.tDet=tW+(c.list[0].userData.dropDt||0);poseAt(c.tDet);capture(c);}
  /* userData.detaching tells post() that the pieces are being let go (the lich's skirt then hangs straight from its pelvis) */
  root.userData.detaching=true;poseAt(tDet);for(const c of bodyCh){capture(c);c.tDet=tDet;}root.userData.detaching=false;
  /* X.fwd: the body topples forward, every piece lands further ahead the higher it starts */
  const Fw=new V(0,0,1).applyQuaternion(Q0.hips).setY(0).normalize();
  /* attached transform at the slumped pose (where Rise flies each chunk back to) */
  for(const c of chunks){const d=dec(c.list[0].matrixWorld);c.qA=d.q;c.cA=c.cl.clone().applyQuaternion(d.q).add(d.p);}
  const pile=JN.hips.getWorldPosition(new V());
  /* resting orientation: 'long' axis lies flat along its fallen direction, 'up' axis turns vertical */
  const ax={x:new V(1,0,0),y:new V(0,1,0),z:new V(0,0,1)},up=new V(0,1,0);
  const rest=(c,long,upA,sgn,yawJ,tilt=0,Lf=null)=>{const L=Lf?Lf.clone():ax[long].clone().applyQuaternion(c.q0).setY(0);if(L.lengthSq()<.04)L.set(r()-.5,0,r()-.5);L.normalize().applyAxisAngle(up,(r()-.5)*2*yawJ*D2R);
    const s=sgn||(ax[upA].clone().applyQuaternion(c.q0).y>=0?1:-1),U=up.clone().multiplyScalar(s),X=new V().crossVectors(L,U),la=ax[long],ua=ax[upA],lx=new V().crossVectors(la,ua);
    const q=new Q().setFromRotationMatrix(new M4().makeBasis(X,L,U)).multiply(new Q().setFromRotationMatrix(new M4().makeBasis(lx,la,ua)).invert());
    if(tilt)q.premultiply(new Q().setFromAxisAngle(X.clone().normalize(),(r()-.5)*2*tilt*D2R));return q;};
  for(const c of chunks){const n=c.name,U=c.list[0].userData.restRule;let sh=.65,push=new V();
    /* a piece's own resting rule (userData.restRule): long and up axes, sign of the up axis, yaw jitter, tilt, long axis along the fall (L:'fwd'), roll-away radius, lands first, extra shift along the fall (fw) and to the right of it (sd), in metres; late: flies back last in Rise, landing as the body finishes straightening */
    if(U){c.qF=rest(c,U.long,U.up,U.sgn||0,U.yaw??25,U.tilt||0,U.L==='fwd'?Fw:null);if(U.roll){const a=r()*6.28;push.set(Math.cos(a)*U.roll,0,Math.sin(a)*U.roll);}if(U.fw)push.addScaledVector(Fw,U.fw);if(U.sd)push.addScaledVector(new V().crossVectors(Fw,up),U.sd);c.first=!!U.first;}
    /* ribcage on its back: its top points backwards, its front faces up */
    else if(n==='bone_ribs'){const F=ax.z.clone().applyQuaternion(c.q0).setY(0).normalize().negate();c.qF=new Q().setFromRotationMatrix(new M4().makeBasis(new V().crossVectors(F,up),F,up));push.copy(F).multiplyScalar(.18);}
    else if(n==='bone_pelvis')c.qF=rest(c,'y','z',0,30);
    else if(n==='bone_skull'){c.qF=rest(c,'z','y',1,60,22);const a=r()*6.28;push.set(Math.cos(a)*.4,0,Math.sin(a)*.4);}
    else if(n==='bone_jaw'){c.qF=rest(c,'z','y',1,50,10);const a=r()*6.28;push.set(Math.cos(a)*.12,0,Math.sin(a)*.12);}
    else if(/^bone_foot_/.test(n))c.qF=rest(c,'z','y',1,25,0);
    else if(/^bone_hand_/.test(n))c.qF=rest(c,'y','x',0,30);
    else if(n==='bone_spine'||n==='bone_neck')c.qF=rest(c,'y','z',0,40);
    else if(n==='weapon_R'){c.qF=rest(c,'z','x',0,15);sh=1;
      /* a long blade lands first and lies beside the pile, not across the top of it */
      if(c.list[0].userData.long){const Lx=ax.z.clone().applyQuaternion(c.qF).setY(0).normalize(),o2=new V(c.c0.x-pile.x,0,c.c0.z-pile.z);o2.addScaledVector(Lx,-o2.dot(Lx));if(o2.lengthSq()<1e-4)o2.set(-Lx.z,0,Lx.x);push.copy(o2.normalize().multiplyScalar(.34));c.first=true;}}
    else if(n==='shield_L'){c.qF=rest(c,'y','x',r()<.5?1:-1,20);sh=1;}
    else if(n==='bow_L'){c.qF=rest(c,'z','x',r()<.5?1:-1,15);sh=1;}
    else if(n==='arrow_R'){c.qF=rest(c,'z','x',0,40);sh=1.3;}
    /* a long piece worn on the back (the archer's quiver) lies flat along its own axis and slides off behind and to the right of the pile */
    else if(c.list[0].userData.longAx){ax.L=c.list[0].userData.longAx;c.qF=rest(c,'L','z',0,30);push.copy(ax.z.clone().applyQuaternion(c.q0).setY(0).normalize().multiplyScalar(-.22)).addScaledVector(ax.x.clone().applyQuaternion(c.q0).setY(0).normalize(),-.4);}
    else{const zy=Math.abs(ax.z.clone().applyQuaternion(c.q0).y),xy=Math.abs(ax.x.clone().applyQuaternion(c.q0).y);c.qF=rest(c,'y',zy>xy?'z':'x',0,25);}
    /* the higher a bone started, the further it topples away from the middle */
    const out=new V(c.c0.x-pile.x,0,c.c0.z-pile.z);if(out.lengthSq()<.004)out.set(r()-.5,0,r()-.5);
    if(!c.list[0].userData.gear){if(X.fwd){push.addScaledVector(Fw,X.fwd*c.c0.y);sh=X.sh||1;}else push.addScaledVector(out.normalize(),.2*Math.max(0,c.c0.y-.6));}
    c.tc=new V(pile.x+(c.c0.x-pile.x)*sh+(r()-.5)*.16,0,pile.z+(c.c0.z-pile.z)*sh+(r()-.5)*.16).add(push);}
  /* stack in landing order on a 1.5 cm height map: every box is sampled with points, so each map column holds the real top of
     what lies there and later bones can settle into the gaps between earlier ones */
  const N=200,CS=.015,HM=new Float32Array(N*N),ox=pile.x-N*CS/2,oz=pile.z-N*CS/2,ci=(v,o)=>Math.min(N-1,Math.max(0,Math.floor((v-o)/CS)));
  for(const c of chunks){c.pts=[];for(const b of c.boxes){const o=b[0],ex=b[1].clone().sub(o),ey=b[2].clone().sub(o),ez=b[4].clone().sub(o),n=v=>Math.max(1,Math.ceil(v.length()/.012));
    const[nx,ny,nz]=[n(ex),n(ey),n(ez)];for(let i=0;i<=nx;i++)for(let j=0;j<=ny;j++)for(let k=0;k<=nz;k++)c.pts.push(o.clone().addScaledVector(ex,i/nx).addScaledVector(ey,j/ny).addScaledVector(ez,k/nz));}}
  /* each bone settles in the lowest spot within 16 cm of where it aims for (it slides off what is already there) */
  const byLand=chunks.slice().sort((a,b)=>(a.first?-1:a.c0.y)-(b.first?-1:b.c0.y));byLand.forEach((c,i)=>{c.li=i;const off=c.cl.clone().applyQuaternion(c.qF),W=c.pts.map(p=>p.clone().applyQuaternion(c.qF));let best=null;
    for(const[rr,nn]of[[0,1],[.08,8],[.16,8]])for(let j=0;j<nn;j++){const a=j/nn*6.28+i,A=new V(c.tc.x-off.x+rr*Math.cos(a),0,c.tc.z-off.z+rr*Math.sin(a)),lo={},hi={};let need=0;
      for(const w of W){const k=ci(w.x+A.x,ox)*N+ci(w.z+A.z,oz);if(!(k in lo)||w.y<lo[k])lo[k]=w.y;if(!(k in hi)||w.y>hi[k])hi[k]=w.y;}
      for(const k in lo)need=Math.max(need,HM[k]-lo[k]);const score=need+.4*rr;if(!best||score<best.score)best={score,need,A,hi};}
    const{A,hi}=best;A.y=best.need+.002;for(const k in hi)HM[k]=Math.max(HM[k],A.y+hi[k]);
    c.cF=off.add(A);c.tl=Math.max(.12,Math.sqrt(2*Math.max(0,c.c0.y-c.cF.y)/9.8));c.wob=new V(r()-.5,0,r()-.5).normalize();c.ph=r()*6.28;});
  /* chunk transform helpers: centre + rotation -> anchor world matrix, lifted so no corner goes below the ground */
  const anchorM=(c,cen,q)=>{let lo=1e9;for(const b of c.boxes)for(const p of b)lo=Math.min(lo,p.clone().sub(c.cl).applyQuaternion(q).y);const C=cen.clone();C.y=Math.max(C.y,.001-lo);
    return new M4().compose(C.sub(c.cl.clone().applyQuaternion(q)),q,new V(1,1,1));};
  const restM=(c,t,amp)=>{let q=c.qF.clone(),cen=c.cF.clone();if(amp>0){q=new Q().setFromAxisAngle(c.wob,amp*3*D2R*Math.sin(c.ph+t*55)).multiply(q);cen.y+=amp*.008*Math.abs(Math.sin(c.ph*1.7+t*42));}return anchorM(c,cen,q);};
  const fallM=(c,t)=>{const tau=t-c.tDet;if(tau<=0)return null;
    if(tau<c.tl){const s=tau/c.tl,cen=c.c0.clone().lerp(c.cF,s);cen.y=Math.max(c.cF.y,c.c0.y-4.9*tau*tau);return anchorM(c,cen,c.q0.clone().slerp(c.qF,ss(s)));}
    const b=tau-c.tl,big=c.name==='bone_skull'||!!(c.list[0].userData.restRule||{}).bounce,T=big?.32:.12;if(b<T){const s=b/T,cen=c.cF.clone();cen.y+=(big?.05:.008)*Math.sin(Math.PI*s);
      return anchorM(c,cen,big?new Q().setFromAxisAngle(c.wob,14*D2R*Math.sin(2*Math.PI*s)*(1-s)).multiply(c.qF):c.qF);}
    return restM(c,0,0);};
  /* Rise timing: tremble, pick-up spread (top of the pile first), flight, then straighten */
  const[tTr,spread,fl,tSt]=X.rise||[.7,.8,.5,.8],tUp=tTr+spread+fl,NC=chunks.length;for(const c of chunks)c.tUp=(c.list[0].userData.restRule||{}).late?tUp+tSt-fl:tTr+(NC-1-c.li)/(NC-1)*spread;
  const riseM=(c,t)=>{if(t<c.tUp)return restM(c,t,Math.min(1,t/tTr));const s=(t-c.tUp)/fl;if(s>=1)return null;const k=ss(s),cen=c.cF.clone().lerp(c.cA,k);cen.y+=.2*Math.sin(Math.PI*k);
    return anchorM(c,cen,c.qF.clone().slerp(c.qA,k));};
  /* sampler: joints from poseAt, each loose chunk's pieces written in their parent joint's frame */
  const rec=(name,dur,poseT,chunkM,note)=>{const n=Math.round(dur*(X.fps||30)),T=[],JQ={},HP=[],PP={},PQ={},GT=gearTr.map(()=>({p:[],q:[],s:[]})),tmp=new M4();for(const j of RIG_JOINTS)JQ[j]=[];for(const k in pieces){PP[k]=[];PQ[k]=[];}
    for(let i=0;i<=n;i++){const t=i/n*dur;T.push(t);poseAt(poseT(t));for(const j of RIG_JOINTS){const q=JN[j].quaternion;JQ[j].push(q.x,q.y,q.z,q.w);}const h=JN.hips.position;HP.push(h.x,h.y,h.z);
      gearTr.forEach(([o],i)=>{GT[i].p.push(...o.position.toArray());GT[i].q.push(...o.quaternion.toArray());GT[i].s.push(...o.scale.toArray());});
      for(const c of chunks){const W=chunkM(c,t);c.list.forEach((g,gi)=>{if(!W){PP[g.name].push(...g.position.toArray());PQ[g.name].push(...g.quaternion.toArray());return;}
        tmp.copy(g.parent.matrixWorld).invert().multiply(W.clone().multiply(c.rel[gi]));const d=dec(tmp);PP[g.name].push(d.p.x,d.p.y,d.p.z);PQ[g.name].push(d.q.x,d.q.y,d.q.z,d.q.w);});}}
    const tracks=RIG_JOINTS.map(j=>new THREE.QuaternionKeyframeTrack(j+'.quaternion',T,JQ[j]));tracks.push(new THREE.VectorKeyframeTrack('hips.position',T,HP));
    for(const k in pieces)tracks.push(new THREE.VectorKeyframeTrack(k+'.position',T,PP[k]),new THREE.QuaternionKeyframeTrack(k+'.quaternion',T,PQ[k]));
    gearTr.forEach(([o,m],i)=>{if(m.includes('p'))tracks.push(new THREE.VectorKeyframeTrack(o.name+'.position',T,GT[i].p),new THREE.QuaternionKeyframeTrack(o.name+'.quaternion',T,GT[i].q));tracks.push(new THREE.VectorKeyframeTrack(o.name+'.scale',T,GT[i].s));});
    const clip=new THREE.AnimationClip(name,dur,tracks);clip.loopMode=false;clip.note=note;return clip;};
  const tEnd=Math.max(...chunks.map(c=>c.tDet+c.tl))+.5;
  const death=rec('Death',tEnd,t=>t,fallM,(X.notes||[])[0]||'Recoils, shudders and slumps, then falls apart into a pile of bones');
  const rise=rec('Rise',tUp+tSt,t=>t<tUp?tDet:tDet*(1-ss((t-tUp)/tSt)),riseM,(X.notes||[])[1]||'The pile trembles, bones fly back together top first, then it straightens into the war stance');
  /* back to the rest pose */
  for(const j of RIG_JOINTS)JN[j].quaternion.set(0,0,0,1);JN.hips.position.set(0,B.hipH,0);root.updateMatrixWorld(true);
  return[death,rise];}

/* look options shared by every skeleton (cover: the default coverage for that skeleton) */
const SK_OPT={
  bones:{key:'bones',label:'Bones',choices:[['random','Random'],['bleached','Bleached'],['aged','Aged'],['grimy','Grimy'],['dark','Dark'],['red','Reddish (fire)']],def:'random'},
  armor:{key:'armor',label:'Armour',choices:[['random','Random'],['none','None'],['leather','Leather'],['chain','Chain mail'],['plate','Plate']],def:'random'},
  cover:(def='random')=>({key:'cover',label:'Armour pieces',choices:[['random','Random'],['few','Few (2-3)'],['most','Most (5-6)'],['full','Full set (8)']],def}),
  eyes:{key:'eyes',label:'Eyes',choices:[['random','Random'],['blue','Pale blue glow'],['green','Green glow'],['dark','Dark']],def:'random'}};
ASSETS.push({id:'skeleton',folder:'characters/enemies/undead',name:'Skeleton',kind:'character',variants:true,defaultSeed:1,groundR:1.6,build:(s,o)=>buildSkeleton(s,o||{}),
  opts:[SK_OPT.bones,SK_OPT.armor,SK_OPT.cover(),
    {key:'weapon',label:'Weapon',choices:[['random','Random'],['club','Small club'],['axe','Crude axe'],['sword','Crude sword']],def:'random'},SK_OPT.eyes],
  desc:'Human-sized skeleton (about 1.8 m): skull with a hanging jaw and deep eye sockets, open ribcage, pelvis, bony limbs and hands. A small club, crude axe or crude sword in the right hand and a small wooden buckler in the left. Bones bleached, aged, grimy, dark or reddish (fire skeleton). May wear armour of one type (leather, chain mail or plate) on up to eight areas: helmet, chest, shoulders, bracers, gloves, belt with tassets, thighs and boots; "New look" rolls which pieces, the bone tint and the eye glow. All warrior sword-and-shield clips, plus Death (falls apart into a pile of bones) and Rise (reassembles from the pile into the war stance).'});
