/* ======================= EFREET: a fire genie of Hell, about 3.4 m, floating on a whirling tail of flame =======================
   Built in real metres on the villager's 25 joints (the oni's proportions, no group scale) inside a body group (ebody). There are
   no legs: below a wide sash and baggy trousers the body turns into a tail of fire (etail_0..7) that whirls down to a point just
   above the ground. Muscular bare chest and belly under an open vest with gold trim, gold arm rings and wide bracers; a big head
   with glowing eyes, a hooked nose, a grinning mouth (the jaw g_jaw opens onto fire), pointed ears with gold hoops, a pointed
   beard and moustache; a black topknot, a jewelled turban or big horns. A scimitar with a blade of flame in the
   right hand, or none. Clips use the revenant's solver (rvSolver on the efreet's own rig, the oni's ground tilt for the blade);
   the hidden legs just hang. The tail, the head flames, the jaw, the body group (Death and Appear shrink and spin it) and the
   dropped scimitar are baked into tracks every frame. */
VB.efreet=Object.assign({},VB.oni,{key:'efreet'});
const EF_SKIN={red:['#9c3e3a','crimson red'],ember:['#aa643c','ember orange'],bronze:['#8e6438','bronze'],charcoal:['#3a3232','charcoal']};
/* fire: mid, hot, deep */
const EF_FIRE={orange:['#ff8a2a','#ffcc5c','#d8481a','orange'],red:['#f0502a','#ff9a5a','#a8281a','crimson'],blue:['#5ab4ec','#e8f6ff','#1e5e94','blue'],green:['#6cd040','#b4f088','#28761a','green']};
/* vest (and turban), sash */
const EF_CLOTH=[['#4a1830','#c8a050','wine vest, gold sash'],['#24245a','#a82a2a','indigo vest, crimson sash'],['#1c1a1a','#a82a2a','black vest, crimson sash'],['#1e4a36','#c8a050','emerald vest, gold sash']];
const EF_HEAD={topknot:'black topknot',turban:'jewelled turban',horns:'horns'},EF_WPN={scimitar:'flame scimitar',none:'no weapon'};
const EF_TAIL=8,EFM={};
function efGlow(hex,k=1){const key=hex+k;return EFM[key]||(EFM[key]=new THREE.MeshStandardMaterial({color:new THREE.Color(hex).convertSRGBToLinear(),emissive:new THREE.Color(hex).convertSRGBToLinear(),emissiveIntensity:k,roughness:.6}));}

/* scimitar: grip at the origin, the blade along +y (about 1.35 m), the edge towards +x and curving back towards -x near the tip,
   flat sides towards ±z; an eight-sided gold disc guard (no cross) and a gold pommel */
/* square smoke rising off the blade (after the owner's voxel-fire reference): small cubes in the blade's fire colours, named <pre>0..
   (efp_ on the hand blade, efq_ on the dropped one). Each is born on the blade, swells, then shrinks as it rises: the hot (bright) ones
   stay low, the deep (dark) ones are smallest and rise highest. A fixed set: where along the blade (u) and across it (sd), type,
   period, phase, size, rise and drift */
const EF_PT=[];{const r=mulberry32(77);for(let k=0;k<36;k++){const ty=k%3;EF_PT.push({u:.06+.94*r(),sd:r()-.5,fz:(r()<.5?-1:1)*(.03+.04*r()),ty,P:[.55,.75,.95][ty]*(.85+.3*r()),ph:r(),sz:[.1,.07,.045][ty]*(.85+.3*r()),rise:[.16,.3,.46][ty]*(.8+.4*r()),dx:(r()-.5)*.24,dz:(r()-.5)*.24});}}
const efPtAt=P=>{const wd=.1+.07*Math.sin(Math.min(1,P.u*1.15)*Math.PI*.55);return new THREE.Vector3(-.22*P.u*P.u+P.sd*wd*.8,.2+1.3*P.u,P.fz);};
function efScimitar(F,pre='efp_'){const w=new THREE.Group(),gold=bm('#c8a050','plain'),goldD=bm('#9a7838','plain'),grip=bm('#3a2016','leather'),
    bl=efGlow(F[0],.9),ed=efGlow(F[1],1.3),fu=efGlow(F[2],.8);
  bx(w,.07,.3,.07,grip,0,-.02,0);for(const y of[-.12,-.02,.08])bx(w,.08,.02,.08,goldD,0,y,0);
  bx(w,.09,.07,.09,gold,0,-.19,0);bx(w,.09,.07,.09,gold,0,-.19,0,0,Math.PI/4,0);bx(w,.045,.03,.045,goldD,0,-.235,0);
  bx(w,.17,.04,.17,gold,0,.155,0);bx(w,.17,.04,.17,gold,0,.155,0,0,Math.PI/4,0);bx(w,.12,.05,.06,goldD,0,.19,0);
  /* the blade is flame: eight pieces widening towards the tip and curving back, a deep core line, a hot edge; square smoke rises off it */
  const n=8,y0=.2,Lb=1.3;
  for(let i=0;i<n;i++){const u=(i+.5)/n,wd=.1+.07*Math.sin(Math.min(1,u*1.15)*Math.PI*.55),x=-.22*u*u,a=Math.atan(-.44*u*.9),h=Lb/n,cy=y0+h*(i+.5),g=new THREE.Group();
    put(w,g,x,cy,0,0,0,-a);const tip=i===n-1;
    if(!tip){bx(g,wd,h*1.08,.03,bl,0,0,0);bx(g,.02,h*1.08,.034,fu,-wd*.18,0,0);bx(g,.025,h*1.08,.032,ed,wd/2-.008,0,0);}
    else{bx(g,wd*.75,h*.6,.03,bl,-wd*.12,-h*.2,0);bx(g,wd*.5,h*.4,.03,bl,-wd*.25,h*.25,0,0,0,.5);bx(g,.025,h*.7,.032,ed,wd*.25,-.01,0,0,0,.45);}}
  EF_PT.forEach((P,k)=>{const g=new THREE.Group();g.name=pre+k;g.position.copy(efPtAt(P));g.scale.setScalar(P.sz*.5);w.add(g);bx(g,1,1,1,[ed,bl,fu][P.ty]);});
  w.userData.len=y0+Lb;return w;}

function buildEfreet(seed,o={}){const B=VB.efreet,r=mulberry32(((seed*2654435761)>>>0)^0x0ef1),pick=a=>a[Math.floor(r()*a.length)],root=new THREE.Group();root.userData.lights=[];
  /* roll everything, then let the options override */
  const rs=pick(['red','red','ember','bronze','charcoal']),rf=pick(['orange','orange','red','blue','green']),rh=pick(['topknot','turban','horns']),cloth=pick(EF_CLOTH),
    beard=pick(['black','black','flame','none']),scar=r()<.3,hoops=r()<.75;
  const opt=(kk,d)=>o[kk]&&o[kk]!=='random'?o[kk]:d,skinK=opt('skin',rs),fireK=opt('fire',rf),headK=opt('head',rh),wpn=o.weapon||'scimitar';
  const sk=EF_SKIN[skinK],F=EF_FIRE[fireK],shade=(h,f)=>'#'+new THREE.Color(h).multiplyScalar(f).getHexString();
  const skin=bm(sk[0],'skin'),skinD=bm(shade(sk[0],.84),'skin'),skinM=bm(shade(sk[0],.64),'skin'),skinX=bm(shade(sk[0],.42),'skin');
  const fMid=efGlow(F[0],.9),fHot=efGlow(F[1],1.2),fDeep=efGlow(F[2],.8),eyeM=efGlow(F[1],1.6),
    vest=bm(cloth[0],'cloth'),vestD=bm(shade(cloth[0],.7),'cloth'),sash=bm(cloth[1],'cloth'),sashD=bm(shade(cloth[1],.72),'cloth'),pants=bm(shade(cloth[1],.55),'cloth'),pantsD=bm(shade(cloth[1],.4),'cloth'),
    gold=bm('#c8a050','plain'),goldD=bm('#9a7838','plain'),dark=bm('#1a1210','plain'),ivory=bm('#ece2c4','plain'),nail=bm('#2a201a','plain'),
    hairM=bm('#1a1614','hair'),hairD=bm('#161311','hair'),horn=bm('#2a2422','plain'),hornD=bm('#4a3e36','plain'),turb=bm('#e6dcc4','cloth'),turbD=bm('#bcae92','cloth'),gem=efGlow('#f0502a',1.1);
  const eb=new THREE.Group();eb.name='ebody';root.add(eb);
  /* joints: same names, offsets and order as buildVillager */
  const hips=J('hips',eb,0,B.hipH,0),spine=J('spine',hips,0,B.spine,0),chest=J('chest',spine,0,B.chest,0),neck=J('neck',chest,0,B.neck,0),head=J('head',neck,0,B.headY,0);
  const aw=.36,hk=B.hand;
  /* hips: a wide sash with folds, a knot on the left and two hanging ends, a gold medallion; baggy trousers whose hem burns into the tail */
  bx(hips,1.0,.2,.8,sash,0,.13,0);for(const y of[.07,.19])bx(hips,1.01,.02,.81,sashD,0,y,0);
  bx(hips,.13,.13,.03,gold,0,.13,.41,0,0,Math.PI/4);bx(hips,.07,.07,.03,gem,0,.13,.425,0,0,Math.PI/4);
  bx(hips,.18,.16,.1,sash,.3,.12,.42);bx(hips,.1,.42,.04,sash,.27,-.14,.425,0,0,.08);bx(hips,.1,.36,.04,sashD,.38,-.11,.42,0,0,-.18);
  bx(hips,.98,.08,.8,pants,0,-.01,0);bx(hips,.99,.02,.81,pantsD,0,-.045,0);
  for(let i=0;i<12;i++){const a=i/12*Math.PI*2,x=Math.cos(a)*.45,z=Math.sin(a)*.37;bx(hips,.17,.2,.17,i%2?fDeep:fMid,x,-.1,z,0,-a,0);if(i%2)bx(hips,.08,.12,.08,fHot,x*1.02,-.03,z*1.02,0,-a,0);}
  /* waist: a six-pack, obliques, a navel */
  bx(spine,.84,.52,.56,skin,0,0,0);bx(spine,.06,.38,.4,skin,.43,-.02,.02);bx(spine,.06,.38,.4,skin,-.43,-.02,.02);
  for(const y of[-.12,0,.12])for(const s of[-1,1])bx(spine,.15,.1,.05,skin,s*.085,y,.29);bx(spine,.02,.36,.02,skinM,0,0,.295);for(const y of[-.06,.06])bx(spine,.32,.02,.02,skinM,0,y,.295);
  bx(spine,.04,.04,.02,skinX,0,-.2,.285);bx(spine,.7,.3,.06,skin,0,.08,-.29);
  if(scar)bx(spine,.03,.3,.012,skinX,-.18,.02,.322,0,0,.3);
  /* chest: broad, big pecs, traps; an open vest with gold trim over the sides and back */
  bx(chest,1.1,.52,.62,skin,0,.16,0);bx(chest,1.0,.36,.08,skin,0,.12,-.33);
  for(const s of[-1,1]){bx(chest,.46,.26,.08,skin,s*.24,.2,.33);bx(chest,.42,.03,.02,skinM,s*.24,.075,.37);bx(chest,.05,.04,.02,skinD,s*.28,.15,.372);}
  bx(chest,.66,.17,.44,skin,0,.48,-.05);bx(neck,.44,.26,.42,skin,0,.02,.04);
  bx(chest,1.06,.56,.05,vest,0,.14,-.39);bx(chest,1.08,.03,.06,gold,0,-.14,-.39);
  for(const s of[-1,1]){bx(chest,.06,.56,.66,vest,s*.565,.14,-.02);bx(chest,.16,.56,.05,vest,s*.5,.14,.345);bx(chest,.03,.56,.06,gold,s*.42,.14,.355);bx(chest,.18,.03,.06,gold,s*.5,-.14,.355);
    bx(chest,.24,.08,.66,vest,s*.46,.43,-.03);bx(chest,.26,.03,.03,gold,s*.46,.47,.3);}
  /* gold torc round the neck */
  bx(chest,.5,.06,.06,gold,0,.56,.2);for(const s of[-1,1])bx(chest,.06,.06,.36,gold,s*.25,.56,.03);bx(chest,.08,.08,.04,gold,0,.55,.235);
  /* head: big; glowing eyes under slanting brows, hooked nose, a grin of teeth, the jaw opening onto fire, pointed ears */
  const hg=new THREE.Group();head.add(hg);hg.position.z=.06;
  bx(hg,.52,.38,.5,skin,0,.32,-.02);bx(hg,.5,.14,.46,skin,0,.2,.04);bx(hg,.34,.12,.24,efGlow(F[2],.9),0,.12,.08);
  bx(hg,.3,.03,.02,ivory,0,.142,.27);for(const s of[-1,1])bx(hg,.035,.06,.025,ivory,s*.11,.12,.27);
  const jaw=new THREE.Group();jaw.name='g_jaw';put(hg,jaw,0,.14,.02);
  bx(jaw,.44,.13,.42,skin,0,-.07,.04);bx(jaw,.36,.06,.3,efGlow(F[2],.9),0,.0,.06);bx(jaw,.28,.03,.02,ivory,0,-.02,.252);for(const s of[-1,1])bx(jaw,.035,.05,.025,ivory,s*.1,.0,.25);
  for(const s of[-1,1]){
    bx(hg,.16,.08,.03,skinX,s*.12,.33,.235);bx(hg,.12,.04,.03,eyeM,s*.12,.33,.245);
    bx(hg,.22,.06,.1,skinM,s*.13,.39,.23,0,0,s*.32);
    /* pointed ears swept back and up, a gold hoop */
    const e=new THREE.Group();put(hg,e,s*.26,.32,-.04,0,-s*.35,0);bx(e,.08,.14,.12,skin,s*.03,0,0);bx(e,.06,.1,.1,skin,s*.06,.08,-.06,.5,0,-s*.3);bx(e,.04,.08,.06,skin,s*.08,.15,-.12,.8,0,-s*.4);
    bx(e,.03,.08,.06,skinX,s*.07,0,.01);if(hoops){bx(e,.02,.1,.02,gold,s*.05,-.12,.02);bx(e,.08,.02,.02,gold,s*.05,-.17,.02);bx(e,.02,.06,.02,gold,s*.01,-.14,.02);bx(e,.02,.06,.02,gold,s*.09,-.14,.02);}}
  bx(hg,.12,.15,.1,skin,0,.25,.27);bx(hg,.15,.06,.08,skinD,0,.19,.29);bx(hg,.06,.05,.06,skinD,0,.31,.29);for(const s of[-1,1])bx(hg,.03,.02,.02,dark,s*.045,.165,.33);
  /* moustache and pointed beard (black hair or flame), on the jaw so they open with it */
  if(beard!=='none'){const bm1=beard==='flame'?fMid:hairM,bm2=beard==='flame'?fHot:hairD;
    for(const s of[-1,1]){bx(hg,.16,.035,.04,bm1,s*.1,.16,.29,0,0,-s*.25);bx(hg,.05,.08,.04,bm1,s*.19,.2,.28,0,0,s*.3);}
    bx(jaw,.22,.14,.1,bm1,0,-.18,.2);bx(jaw,.14,.14,.08,bm1,0,-.3,.21);bx(jaw,.07,.12,.06,bm2,0,-.41,.22);}
  /* headwear: a jewelled turban; or bald with a black topknot (a gold ring round its root, the tail falling back); or bald with horns */
  if(headK==='turban'){bx(hg,.6,.2,.58,turb,0,.48,-.02);bx(hg,.54,.12,.52,turbD,0,.6,-.03);bx(hg,.42,.1,.42,turb,0,.7,-.03);
    for(let i=0;i<4;i++)bx(hg,.62,.03,.03,turbD,0,.42+i*.05,.27,0,0,.18);bx(hg,.14,.16,.05,gold,0,.52,.29);bx(hg,.08,.1,.04,gem,0,.52,.31);bx(hg,.04,.04,.04,gold,0,.62,.3);}
  else if(headK==='topknot'){const tk=new THREE.Group();put(hg,tk,0,.5,-.1,-.45,0,0);bx(tk,.2,.1,.2,hairM,0,.04,0);bx(tk,.15,.08,.15,gold,0,.12,0);bx(tk,.16,.02,.16,goldD,0,.15,0);bx(tk,.13,.14,.13,hairM,0,.22,0);
    const tl=new THREE.Group();put(tk,tl,0,.27,0,-2.0,0,0);bx(tl,.12,.2,.1,hairM,0,.1,0);bx(tl,.1,.24,.08,hairM,0,.3,-.02,-.2,0,0);bx(tl,.07,.16,.06,hairD,0,.48,-.06,-.35,0,0);}
  if(headK==='horns')for(const s of[-1,1]){const H=new THREE.Group();put(hg,H,s*.24,.44,.02,0,0,-s*.5);
    bx(H,.13,.16,.13,horn,0,.06,0);bx(H,.14,.02,.14,hornD,0,.12,0);bx(H,.1,.16,.1,horn,s*.04,.2,0,0,0,-s*.35);bx(H,.11,.02,.11,hornD,s*.06,.27,0,0,0,-s*.35);
    bx(H,.075,.14,.075,horn,s*.04,.34,0,0,0,s*.35);bx(H,.045,.12,.045,hornD,0,.45,0,0,0,s*.6);}
  const sockHead=J('socket_head',head,0,.9,0);sockHead.userData.socket=true;
  /* arms: deltoids, biceps and triceps, thick forearms; gold arm rings and wide bracers; big hands with dark nails */
  for(const[sd,s]of[['L',1],['R',-1]]){const sh=J('shoulder_'+sd,chest,s*B.shW*.325,.165*B.cS,0),ua=J('upperArm_'+sd,sh,s*B.shW*.675,0,0),fa=J('foreArm_'+sd,ua,0,-B.ua,0),hd=J('hand_'+sd,fa,0,-B.fa,0);
    bx(ua,aw,B.ua+aw/2,aw,skin,0,-B.ua/2+aw/4,0);bx(ua,aw*1.2,.32,aw*1.16,skin,s*.01,-.04,0);bx(ua,aw*.78,.26,.07,skin,0,-.36,aw/2+.025);bx(ua,aw*.78,.28,.06,skin,0,-.3,-aw/2-.02);
    bx(ua,aw*1.06,.06,aw*1.06,gold,0,-.3,0);bx(ua,aw*1.08,.015,aw*1.08,goldD,0,-.27,0);
    bx(fa,aw*1.04,B.fa*.6,aw*1.04,skin,0,-B.fa*.3,0);bx(fa,aw*1.0,B.fa*.34,aw*1.0,gold,0,-B.fa*.62,0);for(const y of[-.47,-.77])bx(fa,aw*1.02,.025,aw*1.02,goldD,0,B.fa*y,0);
    bx(fa,aw*.3,aw*.3,.03,gem,0,-B.fa*.62,aw*.51);
    const hw=aw*.85;bx(hd,hw*1.08,.09*hk,hw*1.1,skin,0,-.04*hk,0);
    const fg=J('fingers_'+sd,hd,0,-.085*hk,0),ft=J('fingerTips_'+sd,fg,0,-.035*hk,0),th=J('thumb_'+sd,hd,-s*.02*hk,-.04*hk,hw/2);
    bx(fg,hw*.85,.04*hk,hw*.98,skin,s*.005,-.016*hk,0);bx(ft,hw*.75,.03*hk,hw*.92,skin,s*.005,-.012*hk,0);bx(th,.03*hk,.05*hk,.03*hk,skin,0,-.018*hk,.006);
    for(let i=-1;i<=1;i++)bx(ft,.035,.045,.04,nail,s*.005,-.04*hk,i*hw*.32);bx(th,.04,.04,.04,nail,0,-.054*hk,.006);
    const so=J('socket_'+sd,hd,-s*.012*hk,-.088*hk,0);so.userData.socket=true;}
  /* legs: joints only (the IK needs them); nothing is drawn, the tail of fire takes their place */
  for(const[sd,s]of[['L',1],['R',-1]]){const th=J('thigh_'+sd,hips,s*B.hipW,-(B.hipOff+.01),0),sn=J('shin_'+sd,th,0,-B.thigh,0);J('foot_'+sd,sn,0,-B.shin,0);}
  /* the tail: eight segments of fire, each a box in the fire colour inside a box turned 45° in the deep colour (alternating), with
     tongues licking up; unit height, so the tracks stretch each one between two points of the tail curve */
  for(let i=0;i<EF_TAIL;i++){const g=new THREE.Group();g.name='etail_'+i;eb.add(g);const u=(i+.5)/EF_TAIL,w=.98*Math.pow(1-u,.75)+.08,a=i%2?fMid:fDeep,b=i%2?fDeep:fMid;
    bx(g,w,1.3,w*.78,a);bx(g,w*.78,1.24,w*.88,b);
    for(let k=0;k<3;k++){const an=k*2.09+i*1.1,rr=w*.36;bx(g,Math.max(.04,w*.18),.9,Math.max(.04,w*.18),k?fMid:fHot,Math.cos(an)*rr,.45,Math.sin(an)*rr);}
    if(i===EF_TAIL-1)bx(g,w*.55,.7,w*.55,fHot,0,-.6,0);}
  /* scimitar in the right hand: its length along the thumb side (the socket's z), as the revenant's weapons; a copy at the root
     (ef_drop) is shown only when Death lets the blade fall */
  const Jn=n=>root.getObjectByName(n),wr=new THREE.Group();wr.name='ef_wpn_R';wr.userData.gear=true;Jn('socket_R').add(wr);
  const WB=new THREE.Matrix4().makeBasis(new THREE.Vector3(0,-1,0),new THREE.Vector3(0,0,1),new THREE.Vector3(-1,0,0)),dr=new THREE.Group();dr.name='ef_drop';dr.userData.gear=true;root.add(dr);dr.scale.set(0,0,0);
  if(wpn!=='none')for(const[g,pre]of[[wr,'efp_'],[dr,'efq_']]){const wp=efScimitar(F,pre);wp.quaternion.setFromRotationMatrix(WB);g.add(wp);}
  else{for(const[g,pre]of[[wr,'efp_'],[dr,'efq_']])EF_PT.forEach((_,k)=>{const t=new THREE.Group();t.name=pre+k;g.add(t);});}
  /* the right fist stays closed round the grip */
  const D2=Math.PI/180;root.userData.post=()=>{Jn('fingers_R').rotation.set(0,0,95*D2);Jn('fingerTips_R').rotation.set(0,0,90*D2);Jn('thumb_R').rotation.set(14*D2,0,33*D2);};
  const joints=[];root.traverse(q=>{if(q.userData.joint&&!q.userData.socket)joints.push(q);});root.userData.joints=joints;
  if(o.bare)return root;
  if(!o.noClips)root.userData.clips=efreetClips();root.userData.ground=4.2;
  const cap=s=>s.charAt(0).toUpperCase()+s.slice(1);
  root.userData.variantText=`${cap(sk[1])} skin, ${F[3]} fire, ${EF_HEAD[headK]}, ${beard==='none'?'clean-shaven':beard==='flame'?'beard of flame':'black beard'}; ${cloth[2]}, gold torc, arm rings and bracers${hoops?', gold ear hoops':''}${scar?', scarred belly':''}; ${EF_WPN[wpn]}.`;
  return root;}

/* ---------- clips ---------- */
/* stances (keys in body units: metres / legS; hand targets {s:[dx,dy,dz]} from that shoulder in the torso's frame). HP y 0.2 floats
   the hips 0.29 m above the oni's standing height. Extra channels: jw (jaw, degrees), bs (body scale), sn (body spin, degrees),
   ts (tail stream: 1 trails it back as he glides forward) */
const EF_N={HP:[0,.2,0],h:[0,0,0],sp:[2,0,0],ch:[-2,0,0],nk:[0,0,0],hd:[0,0,0],
  gR:{s:[-.06,-.6,.2]},dR:[-.15,-.45,.88],gL:{s:[-.16,-.54,.02]},dL:[0,-.2,1],fist:[80,95],jw:[0],bs:[1],sn:[0],ts:[0]};
const EF_W=wrP(EF_N,{HP:[0,.17,.02],h:[4,-18,0],sp:[5,-4,0],ch:[3,-6,0],gR:{s:[-.14,-.1,.5]},dR:[-.1,.85,.4],gL:{s:[.04,-.32,.52]},dL:[0,.7,.7],fist:[25,95]});
let EF_R=null,EF_ALL=null;
function efRig(){if(EF_R)return EF_R;const B=VB.efreet,m=buildEfreet(1,{bare:true,weapon:'scimitar',head:'topknot'}),J={};m.traverse(q=>{if(q.userData.joint)J[q.name]=q;});
  const R={m,J,B,two:false},W=[];m.getObjectByName('ef_wpn_R').traverse(q=>{if(q.isMesh)W.push(q);});const v=new THREE.Vector3();
  R.low=()=>{m.updateMatrixWorld(true);let y=1e9;for(const q of W){const p=q.geometry.parameters;for(let i=0;i<8;i++){v.set((i&1?.5:-.5)*p.width,(i&2?.5:-.5)*p.height,(i&4?.5:-.5)*p.depth).applyMatrix4(q.matrixWorld);if(v.y<y)y=v.y;}}return y;};
  return EF_R=R;}
/* the oni's solver: rvSolver plus a ground check that tilts the blade up about the level axis across it until none of it is below the ground */
function efSolver(){const R=efRig(),SV=rvSolver(R),V=THREE.Vector3,solve0=SV.solve;
  SV.solve=p=>{const PP=SV.PP,PW=SV.PW&&Object.assign({},SV.PW);let s=solve0(p);if(R.low()>=.004)return s;
    const d0=new V(...p.dR).normalize(),ax=new V().crossVectors(d0,new V(0,1,0));if(ax.lengthSq()<1e-6)return s;ax.normalize();
    const at=a=>{SV.PP=PP;SV.PW=PW&&Object.assign({},PW);return solve0(Object.assign({},p,{dR:d0.clone().applyAxisAngle(ax,a).toArray()}));};
    let lo=0,hi=Math.PI*.5;for(let i=0;i<9;i++){const a=(lo+hi)/2;at(a);if(R.low()>=.004)hi=a;else lo=a;}return at(hi);};
  return SV;}
function efreetClips(){if(EF_ALL)return EF_ALL;const B=VB.efreet,k=B.legS,D=Math.PI*2,S=Math.sin,C=Math.cos,L=[],SV=efSolver(),R=SV.R,V=THREE.Vector3,Q=THREE.Quaternion,M4=THREE.Matrix4,D2R=Math.PI/180;
  /* the hidden legs: feet kept under the hips, so the leg IK always reaches and never pulls the hips down; then they just hang */
  const fix=p=>{const h=p.HP||[0,0,0],o=Object.assign({},p),y=Math.max(0,h[1])+.04;o.FL=[h[0]+.2,h[2],0,y,0];o.FR=[h[0]-.2,h[2],0,y,0];return o;};
  const legs0=s=>{for(const c of['tL','kL','aL','tR','kR','aR'])s[c]=[0,0,0];return s;};
  const A=p=>SV.abs(fix(p)),N=A(EF_N),W=A(EF_W);
  const lift=(o,dy)=>{o.gR=[o.gR[0],o.gR[1]+dy,o.gR[2]];o.gL=[o.gL[0],o.gL[1]+dy,o.gL[2]];return o;};
  /* a bare efreet posed like the clip, to find where the blade is when Death lets it go */
  const M=buildEfreet(1,{bare:true,weapon:'scimitar',head:'topknot'}),JN={};M.traverse(q=>{if(q.userData.joint)JN[q.name]=q;});const WG=M.getObjectByName('ef_wpn_R');
  const poseM=s=>{const P={};for(const c in s)if(JALIAS[c])P[JALIAS[c]]=s[c];for(const j of RIG_JOINTS){const b=BASEPOSE[j]||[0,0,0],v=P[j]||[0,0,0];JN[j].rotation.set((b[0]+v[0])*D2R,(b[1]+v[1])*D2R,(b[2]+v[2])*D2R);}
    JN.hips.position.set(s.pos[0]*k,B.hipH+s.pos[1]*k,s.pos[2]*k);M.updateMatrixWorld(true);return WG.matrixWorld.clone();};
  const cornersLow=list=>{let lo=1e9;const c=new V();for(const q of list){const p=q.geometry.parameters;for(let i=0;i<8;i++){c.set((i&1?.5:-.5)*p.width,(i&2?.5:-.5)*p.height,(i&4?.5:-.5)*p.depth).applyMatrix4(q.matrixWorld);lo=Math.min(lo,c.y);}}return lo;};
  /* where the dropped blade comes to rest: lying the way it pointed, a flat side down, pushed out from the body, lowest corner on the ground */
  const restOf=Mw=>{const p0=new V(),q0=new Q(),s0=new V();Mw.decompose(p0,q0,s0);
    const Lh=new V(0,0,1).applyQuaternion(q0).setY(0);if(Lh.lengthSq()<1e-4)Lh.set(0,0,1);Lh.normalize();const U=new V(0,new V(1,0,0).applyQuaternion(q0).y>=0?1:-1,0);
    const q=new Q().setFromRotationMatrix(new M4().makeBasis(U,new V().crossVectors(Lh,U),Lh));
    const hip=JN.hips.getWorldPosition(new V()),out=new V(p0.x-hip.x,0,p0.z-hip.z);if(out.lengthSq()<1e-4)out.set(-1,0,0);out.normalize();
    const probe=WG.clone(),list=[];probe.position.set(p0.x,0,p0.z).addScaledVector(out,.45);probe.quaternion.copy(q);probe.updateMatrixWorld(true);probe.traverse(z=>{if(z.isMesh)list.push(z);});
    probe.position.y+=.003-cornersLow(list);probe.updateMatrix();return probe.matrix.clone();};
  const ss=x=>x*x*(3-2*x);
  /* the square smoke of a blade whose holder (ef_wpn_R or ef_drop) has world matrix Hw: born on the blade, rising straight up in the
     world and drifting, kept above the ground, given back in the blade's own frame; whole cycles per clip, so loops close */
  const WBm=new M4().makeBasis(new V(0,-1,0),new V(0,0,1),new V(-1,0,0)),smoke=(Hw,t,dur)=>{const W=Hw.clone().multiply(WBm),Wi=W.clone().invert();
    return EF_PT.map(P=>{const n=Math.max(1,Math.round(dur/P.P)),tau=((t/dur*n+P.ph)%1+1)%1,sz=Math.max(.0005,P.sz*(tau<.15?tau/.15:(1-tau)/.85)),w=efPtAt(P).applyMatrix4(W);
      w.x+=P.dx*tau;w.z+=P.dz*tau;w.y+=P.rise*Math.pow(tau,.8);w.y=Math.max(w.y,sz*.9+.003);w.applyMatrix4(Wi);return[w.x,w.y,w.z,sz];});};
  /* per-frame extras: the tail curve from the hips down to a point above the ground (swirling, streaming back with ts), the head
     flames, the jaw, the body group (scale about a point 0.3 m above the ground under the hips, and spin) and the dropped blade.
     Phases use whole cycles per clip, so loops close */
  const extras=(p,s,t,dur,o)=>{const Ph=R.J.hips.position.clone(),Qh=R.J.hips.quaternion.clone(),top=new V(0,-.1,0).applyQuaternion(Qh).add(Ph);
    const f=new V(0,0,1).applyQuaternion(Qh).setY(0);if(f.lengthSq()<1e-4)f.set(0,0,1);f.normalize();const sd=new V(f.z,0,-f.x);
    const ns=Math.max(1,Math.round(dur/1.6)),ph=D*ns*t/dur,nf=Math.max(1,Math.round(dur/.4)),fq=D*nf*t/dur,ts=p.ts[0],yT=.32+.04*S(ph)+.3*Math.abs(ts),pts=[];
    for(let i=0;i<=EF_TAIL;i++){const u=i/EF_TAIL,a=.17*Math.pow(u,1.2)*(1+.25*Math.abs(ts)),an=ph-u*D*1.1,bk=-(.08+.85*ts)*Math.pow(u,1.5)+a*.7*C(an),sw=a*S(an);
      pts.push(top.clone().addScaledVector(f,bk).addScaledVector(sd,sw).setY(top.y+(yT-top.y)*u));}
    const tail=[];for(let i=0;i<EF_TAIL;i++){const a=pts[i],b=pts[i+1],d=a.clone().sub(b),len=Math.max(.02,d.length()),q=new Q().setFromUnitVectors(new V(0,1,0),d.normalize());
      q.multiply(new Q().setFromAxisAngle(new V(0,1,0),(i>1?1:0)*(ph*1+i*.7)));const fl=1+.07*S(fq+i*1.3);tail.push([...a.clone().add(b).multiplyScalar(.5).toArray(),q.x,q.y,q.z,q.w,fl,len,fl]);}
    const bs=Math.max(.0005,p.bs[0]),qb=new Q().setFromAxisAngle(new V(0,1,0),p.sn[0]*D2R),pv=new V(Ph.x,.3,Ph.z),ep=pv.clone().sub(pv.clone().multiplyScalar(bs).applyQuaternion(qb));
    const x={tail,jw:p.jw[0],eb:[...ep.toArray(),qb.x,qb.y,qb.z,qb.w,bs]};
    const Mh=poseM(s);x.pt=smoke(Mh,t,dur);
    if(o.drop!==undefined){if(t<o.drop){x.w=1;x.d=Mh;x.ds=0;}else{if(!o._A){o._A=Mh;o._R=restOf(Mh);}x.w=0;x.ds=1;
      const A0=o._A,R0=o._R,pa=new V(),qa=new Q(),pb=new V(),qbb=new Q(),sc=new V();A0.decompose(pa,qa,sc);R0.decompose(pb,qbb,sc);const tl=Math.max(.2,Math.sqrt(2*Math.max(0,pa.y-pb.y)/9.8)),tau=t-o.drop,u=Math.min(1,tau/tl);
      const pp=pa.clone().lerp(pb,ss(u));pp.y=Math.max(pb.y,pa.y-4.9*tau*tau);x.d=new M4().compose(pp,qa.clone().slerp(qbb,ss(u)),new V(1,1,1));x.pq=smoke(x.d,t,dur);}}
    return x;};
  const bake=(c,X,o)=>{const T=Array.from(c.tracks[0].times),q=new Q(),e=new THREE.Euler(),TR=[];
    for(let i=0;i<EF_TAIL;i++){const P=[],QQ=[],SC=[];for(const x of X){const v=x.tail[i];P.push(v[0],v[1],v[2]);QQ.push(v[3],v[4],v[5],v[6]);SC.push(v[7],v[8],v[9]);}
      TR.push(new THREE.VectorKeyframeTrack(`etail_${i}.position`,T,P),new THREE.QuaternionKeyframeTrack(`etail_${i}.quaternion`,T,QQ),new THREE.VectorKeyframeTrack(`etail_${i}.scale`,T,SC));}
    const JQ=[],EP=[],EQ=[],ES=[];for(const x of X){q.setFromEuler(e.set(x.jw*D2R,0,0));JQ.push(q.x,q.y,q.z,q.w);EP.push(x.eb[0],x.eb[1],x.eb[2]);EQ.push(x.eb[3],x.eb[4],x.eb[5],x.eb[6]);ES.push(x.eb[7],x.eb[7],x.eb[7]);}
    TR.push(new THREE.QuaternionKeyframeTrack('g_jaw.quaternion',T,JQ),new THREE.VectorKeyframeTrack('ebody.position',T,EP),new THREE.QuaternionKeyframeTrack('ebody.quaternion',T,EQ),new THREE.VectorKeyframeTrack('ebody.scale',T,ES));
    /* the square smoke: the hand blade's in every clip, the dropped blade's in Death once it falls */
    EF_PT.forEach((_,k)=>{for(const[pre,key]of[['efp_','pt'],['efq_','pq']]){if(key==='pq'&&o.drop===undefined)continue;const P=[],SC=[];for(const x of X){const v=x[key]?x[key][k]:[0,0,0,.0005];P.push(v[0],v[1],v[2]);SC.push(v[3],v[3],v[3]);}
      TR.push(new THREE.VectorKeyframeTrack(pre+k+'.position',T,P),new THREE.VectorKeyframeTrack(pre+k+'.scale',T,SC));}});
    const T2=[0,c.duration];
    if(o.drop!==undefined){const WS=[],DP=[],DQ=[],DS=[],pp=new V(),qq=new Q(),sc=new V();for(const x of X){WS.push(x.w,x.w,x.w);x.d.decompose(pp,qq,sc);DP.push(pp.x,pp.y,pp.z);DQ.push(qq.x,qq.y,qq.z,qq.w);DS.push(x.ds,x.ds,x.ds);}
      TR.push(new THREE.VectorKeyframeTrack('ef_wpn_R.scale',T,WS),new THREE.VectorKeyframeTrack('ef_drop.position',T,DP),new THREE.QuaternionKeyframeTrack('ef_drop.quaternion',T,DQ),new THREE.VectorKeyframeTrack('ef_drop.scale',T,DS));}
    else TR.push(new THREE.VectorKeyframeTrack('ef_wpn_R.scale',T2,[1,1,1,1,1,1]),new THREE.VectorKeyframeTrack('ef_drop.scale',T2,[0,0,0,0,0,0]));
    c.tracks.push(...TR);};
  /* a clip: loops are pre-rolled one full cycle (elbow and wrist continuity carry over the seam) and their last frame is the first */
  const CC=(name,dur,fn,o={})=>{SV.PP=SV.PW=null;if(o.loop){const n=Math.round(dur*30);for(let i=0;i<n;i++)SV.solve(fix(fn(i/n*dur)));}SV.miss={};let first=null,firstX=null;const X=[];
    const c=sampleClip(name,dur,t=>{if(o.loop&&first&&t>=dur-1e-6){X.push(firstX);return first;}const p=fn(t),s=legs0(SV.solve(fix(p))),x=extras(p,s,t,dur,o);if(!first){first=s;firstX=x;}X.push(x);return s;},
      Object.assign({autoFeet:false},o),B);
    c.rvMiss=SV.miss;SV.miss=null;bake(c,X,o);if(o.next)c.next=o.next;if(o.hold)c.hold=true;if(o.speed)c.speed=o.speed;L.push(c);return c;};
  const KC=(name,dur,keys,note,o={})=>{const K=keys.map(kk=>[kk[0],A(wrP(o.base||EF_W,kk[1]||{}))]),f=wrKeys(K);return CC(name,dur,o.mod?t=>o.mod(f(t),t):f,Object.assign({note,next:'Idle (war mode)'},o));};

  /* ---- relaxed ---- */
  CC('Idle',4.0,t=>{const p=D*t/4,b=S(p),b2=S(2*p),dy=.022*b2;return lift(wrP(N,{HP:[.01*b,.2+dy,0],h:[0,0,1.5*b],sp:[2+.8*b2,0,0],ch:[-2+1.4*b2,2*S(p+.8),0],hd:[-2+2*S(2*p+1),16*S(p+.6),0]}),dy);},
    {loop:true,note:'Floats with arms akimbo, bobbing slowly, looking around, the tail of fire whirling'});
  {const FB=A(wrP(EF_N,{HP:[0,.22,0],h:[16,0,0],sp:[4,0,0],ch:[2,0,0],hd:[-16,0,0],gR:{s:[-.1,-.6,.06]},dR:[-.25,-.6,.75],gL:{s:[.14,-.56,-.12]},dL:[0,-.3,-1],fist:[60,95],ts:[1]}));
  CC('Float',2.0,t=>{const p=D*t/2,dy=.03*S(p);return lift(wrP(FB,{HP:[0,.22+dy,0],h:[16+2*S(p),0,2*S(p)],ts:[1+.1*S(p)]}),dy);},{loop:true,speed:1.6,note:'Glides forward leaning in, arms swept back, the tail streaming behind, in place, 1.6 m/s'});}

  /* ---- war mode ---- */
  CC('Idle (war mode)',2.6,t=>{const p=D*t/2.6,b=S(p),dy=.018*b;return lift(wrP(W,{HP:[0,.17+dy,.02],sp:[5+.8*b,-4,0],ch:[3+1.4*b,-6,0],hd:[0,5*S(p),0],dR:[-.1,.85,.4+.05*S(p+.6)]}),dy);},
    {loop:true,note:'Scimitar raised, left hand open in front, hovering'});
  {const FW=A(wrP(EF_W,{HP:[0,.18,.02],h:[12,-14,0],sp:[6,-4,0],ch:[4,-6,0],hd:[-10,10,0],ts:[.8]}));
  CC('Float (war mode)',1.8,t=>{const p=D*t/1.8,dy=.025*S(p);return lift(wrP(FW,{HP:[0,.18+dy,.02],h:[12+2*S(p),-14,1.5*S(p)],ts:[.8+.08*S(p)]}),dy);},{loop:true,speed:1.2,note:'Advances through the air, scimitar raised, in place, 1.2 m/s'});}

  /* ---- attacks (the oni's, floating, gliding in instead of stepping) ---- */
  KC('Attack 1',1.5,[[0,{}],
    [.42,{HP:[0,.18,-.04],h:[4,-36,0],sp:[4,-8,0],ch:[-2,-22,0],hd:[-6,0,0],gR:{s:[-.36,.4,.14]},dR:[0,.75,-.65],gL:{s:[.1,-.3,.5]}}],
    [.6,{HP:[0,.16,.06],h:[6,-16,0],sp:[5,-4,0],ch:[2,-6,0],gR:{s:[-.38,.32,.48]},dR:[0,.9,-.4],gL:{s:[.12,-.32,.44]}}],
    [.72,{HP:[0,.13,.14],h:[6,4,0],sp:[6,4,0],ch:[6,16,0],gR:{s:[.16,-.06,.76]},dR:[0,.5,.87],gL:{s:[.14,-.38,.3]}}],
    [.88,{HP:[0,.11,.16],h:[8,16,0],sp:[8,8,0],ch:[8,24,0],gR:{s:[.55,-.34,.55]},dR:[.55,-.05,.83],gL:{s:[.2,-.4,.12]}}],
    [1.12,{HP:[0,.15,.08],h:[6,-8,0],ch:[4,-4,0],gR:{s:[-.06,-.12,.6]},dR:[-.1,.85,.3]}],
    [1.5,{}]],'Diagonal slash from high on the right down across the body, gliding in');
  KC('Attack 2',1.6,[[0,{}],
    [.5,{HP:[0,.15,-.04],h:[4,-46,0],sp:[4,-10,0],ch:[0,-20,0],hd:[0,30,0],gR:{s:[-.68,.12,.02]},dR:[0,1,.1],gL:{s:[.2,-.3,.46]}}],
    [.72,{HP:[0,.12,.04],h:[6,-30,0],sp:[5,-6,0],ch:[2,-12,0],hd:[0,20,0],gR:{s:[-.7,-.04,.2]},dR:[-.1,.3,.95],gL:{s:[.24,-.36,.36]}}],
    [.86,{HP:[0,.1,.1],h:[8,-4,0],sp:[6,2,0],ch:[4,6,0],hd:[0,4,0],gR:{s:[-.55,-.08,.55]},dR:[.5,.12,.86],gL:{s:[.3,-.4,.16]}}],
    [1.0,{HP:[0,.1,.1],h:[8,20,0],sp:[6,8,0],ch:[4,20,0],hd:[0,-14,0],gR:{s:[-.3,-.1,.7]},dR:[.85,.12,.5]}],
    [1.2,{HP:[0,.12,.08],h:[6,24,0],sp:[6,8,0],ch:[4,24,0],hd:[0,-14,0],gR:{s:[-.24,-.05,.66]},dR:[.8,.42,.42]}],
    [1.4,{HP:[0,.15,.04],h:[6,-6,0],ch:[4,-2,0],gR:{s:[-.06,-.1,.56]},dR:[-.1,.85,-.2]}],
    [1.6,{}]],'Flat sweep from right to left, the arm out wide');
  KC('Attack 3',1.2,[[0,{}],
    [.3,{HP:[0,.15,-.04],h:[4,-6,0],sp:[4,0,0],ch:[0,4,0],gL:{s:[.12,-.34,.2]},dL:[0,.8,.6],fist:[90,95]}],
    [.46,{HP:[0,.11,.16],h:[8,-34,0],sp:[6,-8,0],ch:[4,-18,0],hd:[0,16,0],gL:{s:[-.04,-.06,.78]},dL:[0,1,.1],gR:{s:[-.2,-.06,.4]},fist:[95,95]}],
    [.58,{HP:[0,.11,.16],h:[8,-34,0],sp:[6,-8,0],ch:[4,-18,0],hd:[0,16,0],gL:{s:[-.04,-.05,.76]},dL:[0,1,.1],gR:{s:[-.2,-.06,.4]},fist:[95,95]}],
    [.85,{HP:[0,.15,.06],h:[5,-20,0],gL:{s:[.04,-.3,.5]},fist:[60,95]}],
    [1.2,{}]],'Burning fist: a straight left punch, lunging through the air');
  KC('Heavy attack',2.2,[[0,{}],
    [.45,{HP:[0,.1,-.04],h:[16,-12,0],sp:[12,-2,0],ch:[6,-4,0],hd:[-10,0,0],gR:{s:[-.1,-.16,.5]},dR:[0,.7,.7],gL:{s:[.12,-.26,.5]}}],
    [.75,{HP:[0,.42,.08],h:[-8,-10,0],sp:[-8,-2,0],ch:[-10,-4,0],hd:[-8,0,0],gR:{s:[-.06,.46,.2]},dR:[.1,.5,-.85],gL:{s:[.4,.1,.3]},dL:[0,.6,.8],fist:[60,95],jw:[20],ts:[-.3]}],
    [.92,{HP:[0,.46,.18],h:[0,-8,0],sp:[0,-2,0],ch:[-4,-2,0],gR:{s:[0,.46,.4]},dR:[0,.95,.3],gL:{s:[.46,.1,.2]},fist:[60,95],jw:[24],ts:[0]}],
    [1.06,{HP:[0,.0,.34],h:[18,-6,0],sp:[18,0,0],ch:[10,0,0],gR:{s:[.04,.04,.78]},dR:[0,.4,.92],gL:{s:[.4,-.2,.3]},fist:[80,95],jw:[10],ts:[.5]}],
    [1.16,{HP:[0,-.12,.38],h:[26,-6,0],sp:[22,0,0],ch:[12,0,0],gR:{s:[.08,-.52,.58]},dR:[0,-.4,.92],gL:{s:[.36,-.5,.3]},fist:[90,95],ts:[.3]}],
    [1.5,{HP:[0,-.12,.38],h:[26,-6,0],sp:[22,0,0],ch:[12,0,0],gR:{s:[.08,-.51,.58]},dR:[0,-.38,.92],gL:{s:[.36,-.49,.3]},fist:[90,95]}],
    [1.8,{HP:[0,.06,.24],h:[10,-12,0],gR:{s:[-.1,-.1,.56]},dR:[-.1,.8,.4],gL:{s:[.04,-.32,.5]}}],
    [2.2,{}]],'Rises high with the scimitar overhead, dives forward and smashes it into the ground');

  /* ---- spells (gestures only; the fire itself is left to separate effects) ---- */
  KC('Spell 1',2.0,[[0,{}],
    [.45,{HP:[0,.18,-.02],h:[2,10,0],sp:[4,4,0],ch:[-4,16,0],hd:[0,-12,0],gL:{s:[.2,-.44,-.02]},dL:[0,.3,1],fist:[10,95],jw:[6]}],
    [.8,{HP:[0,.18,-.04],h:[2,14,0],sp:[4,4,0],ch:[-6,20,0],hd:[2,-14,0],gL:{s:[.22,-.42,-.06]},dL:[0,.3,1],fist:[0,95],jw:[10]}],
    [1.0,{HP:[0,.15,.1],h:[6,-22,0],sp:[6,-6,0],ch:[6,-26,0],hd:[0,20,0],gL:{s:[-.04,-.02,.8]},dL:[0,1,.1],fist:[0,95],jw:[22]}],
    [1.3,{HP:[0,.15,.1],h:[6,-22,0],sp:[6,-6,0],ch:[6,-26,0],hd:[0,20,0],gL:{s:[-.04,-.03,.79]},dL:[0,1,.1],fist:[0,95],jw:[14]}],
    [2.0,{}]],'Fire bolt: draws the open left hand back at the side, then thrusts it forward and hurls');
  KC('Spell 2',2.8,[[0,{}],
    [.6,{HP:[0,.3,0],h:[-4,0,0],sp:[-6,0,0],ch:[-10,0,0],hd:[-20,0,0],gR:{s:[-.46,.46,.12]},dR:[-.3,.9,.1],gL:{s:[.46,.46,.12]},dL:[0,1,0],fist:[0,95],jw:[20]}],
    [1.1,{HP:[0,.34,0],h:[-4,0,0],sp:[-7,0,0],ch:[-12,0,0],hd:[-24,0,0],gR:{s:[-.47,.48,.1]},dR:[-.3,.9,.1],gL:{s:[.47,.48,.1]},dL:[0,1,0],fist:[0,95],jw:[28]}],
    [1.4,{HP:[0,.08,.06],h:[20,0,0],sp:[14,0,0],ch:[8,0,0],hd:[6,0,0],gR:{s:[-.5,-.4,.3]},dR:[-.7,.3,.6],gL:{s:[.24,-.56,.5]},dL:[0,.2,1],fist:[0,95],jw:[30]}],
    [2.0,{HP:[0,.08,.06],h:[20,0,0],sp:[14,0,0],ch:[8,0,0],hd:[4,0,0],gR:{s:[-.5,-.41,.29]},dR:[-.7,.3,.6],gL:{s:[.24,-.57,.5]},dL:[0,.2,1],fist:[0,95],jw:[16]}],
    [2.8,{}]],'Eruption: rises with both arms flung up, then sweeps the left palm down at the ground ahead');
  KC('Spell 3',2.8,[[0,{}],
    [.6,{HP:[0,.24,-.04],h:[-6,0,0],sp:[-6,0,0],ch:[-12,0,0],hd:[-18,0,0],gR:{s:[-.42,-.3,-.04]},dR:[-.4,.6,-.5],gL:{s:[.42,-.3,-.04]},dL:[0,.6,-.6],fist:[30,95],jw:[6]}],
    [.95,{HP:[0,.16,.08],h:[10,0,0],sp:[8,0,0],ch:[8,0,0],hd:[6,-24,0],gR:{s:[-.46,-.36,.16]},dR:[-.5,.6,.5],gL:{s:[.46,-.36,.16]},dL:[0,.6,.6],fist:[10,95],jw:[34]}],
    [1.6,{HP:[0,.16,.08],h:[10,0,0],sp:[8,0,0],ch:[8,0,0],hd:[6,0,0],gR:{s:[-.46,-.36,.16]},dR:[-.5,.6,.5],gL:{s:[.46,-.36,.16]},dL:[0,.6,.6],fist:[10,95],jw:[36]}],
    [2.2,{HP:[0,.16,.08],h:[10,0,0],sp:[8,0,0],ch:[8,0,0],hd:[6,24,0],gR:{s:[-.46,-.36,.16]},dR:[-.5,.6,.5],gL:{s:[.46,-.36,.16]},dL:[0,.6,.6],fist:[10,95],jw:[34]}],
    [2.8,{}]],'Fire breath: draws in a breath, leans in with the jaw wide and sweeps the head from left to right');

  /* ---- voice and reactions ---- */
  {const up={HP:[0,.2,-.02],h:[-4,-6,0],sp:[-4,0,0],ch:[-8,0,0],hd:[-22,6,0],gR:{s:[-.3,-.5,.2]},dR:[-.6,-.3,.7],gL:{s:[-.16,-.54,.02]},dL:[0,-.2,1],fist:[80,95],jw:[22]};
  KC('Taunt',3.0,[[0,{}],[.5,up],[2.4,wrP(up,{hd:[-20,-6,0]})],[3.0,{}]],'Fists on hips, throws the head back and laughs',
    {mod:(o,t)=>{const e=Math.max(0,Math.min(1,(t-.5)/.2,(2.4-t)/.3)),l=S(D*t*3.5);o.jw=[o.jw[0]+e*12*l];o.HP=[o.HP[0],o.HP[1]+e*.012*l,o.HP[2]];return lift(o,e*.012*l);}});}
  KC('Hit 1',.8,[[0,{}],
    [.1,{HP:[0,.17,-.1],h:[-6,-22,0],sp:[-12,-4,0],ch:[-16,-6,0],hd:[-16,0,0],gR:{s:[-.3,.06,.4]},dR:[-.4,.8,-.3],gL:{s:[.1,-.24,.48]},jw:[16],ts:[-.3]}],
    [.32,{HP:[0,.16,-.06],h:[0,-20,0],sp:[-2,-4,0],ch:[-4,-6,0],hd:[-4,0,0],gR:{s:[-.18,-.02,.48]},gL:{s:[.04,-.32,.5]},jw:[4]}],
    [.8,{}]],'Blow to the chest, rocks back through the air');
  KC('Hit 2',.9,[[0,{}],
    [.12,{HP:[.06,.15,-.02],h:[2,-36,8],sp:[2,-10,10],ch:[-4,-20,12],hd:[-6,-18,14],gR:{s:[-.3,-.06,.4]},dR:[-.5,.75,-.3],gL:{s:[.12,-.4,.44]},jw:[14]}],
    [.36,{HP:[.03,.16,0],h:[3,-28,3],sp:[4,-6,4],ch:[0,-12,5],hd:[-2,-6,5],gR:{s:[-.18,-.04,.5]},gL:{s:[.04,-.36,.5]},jw:[4]}],
    [.9,{}]],'Blow from the left, twists and drifts away');
  KC('Heavy hit',1.6,[[0,{}],
    [.14,{HP:[0,.2,-.16],h:[-14,-24,0],sp:[-16,-4,0],ch:[-18,-6,0],hd:[-20,0,4],gR:{s:[-.36,.14,.26]},dR:[0,1,0],gL:{s:[.24,-.1,.4]},dL:[0,.8,.6],jw:[24],ts:[-.6]}],
    [.4,{HP:[0,.22,-.5],h:[-10,-22,0],sp:[-10,-4,0],ch:[-12,-6,0],hd:[-10,0,0],gR:{s:[-.3,.06,.38]},gL:{s:[.14,-.2,.46]},jw:[10],ts:[-.8]}],
    [.75,{HP:[0,.18,-.56],h:[6,-20,0],sp:[6,-4,0],ch:[2,-6,0],hd:[2,0,0],gR:{s:[-.2,-.04,.5]},gL:{s:[.04,-.32,.5]},ts:[-.2]}],
    [1.2,{HP:[0,.17,-.2],ts:[.5]}],
    [1.6,{}]],'Hurled back through the air, then glides in again');

  /* ---- Death and Appear: the body group shrinks (about a point just above the ground) and spins; Death lets the scimitar fall ---- */
  KC('Death',3.0,[[0,{}],
    [.2,{HP:[0,.2,-.06],h:[-6,-12,0],sp:[-10,-4,0],ch:[-14,-6,0],hd:[-20,0,6],gR:{s:[-.36,0,.3]},dR:[-.3,.8,-.3],gL:{s:[.36,-.05,.3]},dL:[0,.8,.5],fist:[10,95],jw:[18]}],
    [.6,{HP:[0,.12,0],h:[14,-6,0],sp:[14,0,0],ch:[12,0,0],hd:[8,0,0],gR:{s:[-.1,-.42,.4]},dR:[-.2,.3,.9],gL:{s:[.12,-.4,.42]},dL:[0,.5,.8],fist:[60,95],jw:[6]}],
    [1.05,{HP:[0,.24,-.04],h:[-8,0,0],sp:[-12,0,0],ch:[-16,0,0],hd:[-28,0,0],gR:{s:[-.5,.42,.1]},dR:[-.2,1,0],gL:{s:[.5,.42,.1]},dL:[0,1,0],fist:[0,95],jw:[34]}],
    [1.3,{HP:[0,.24,-.04],h:[-8,0,0],sp:[-12,0,0],ch:[-16,0,0],hd:[-28,0,0],gR:{s:[-.5,.43,.1]},dR:[-.2,1,0],gL:{s:[.5,.43,.1]},dL:[0,1,0],fist:[0,95],jw:[34],bs:[1],sn:[0]}],
    [2.6,{HP:[0,.1,0],h:[10,0,0],sp:[14,0,0],ch:[14,0,0],hd:[16,0,0],gR:{s:[.1,-.4,.4]},dR:[0,.6,.8],gL:{s:[-.1,-.4,.4]},dL:[0,.6,.8],fist:[60,95],jw:[0],bs:[0],sn:[900]}],
    [3.0,{HP:[0,.1,0],h:[10,0,0],sp:[14,0,0],ch:[14,0,0],hd:[16,0,0],gR:{s:[.1,-.4,.4]},dR:[0,.6,.8],gL:{s:[-.1,-.4,.4]},dL:[0,.6,.8],fist:[60,95],jw:[0],bs:[0],sn:[900]}]],
    'Recoils, doubles over and lets the scimitar fall, flings the arms up with a cry, then whirls down into his tail of fire and burns out',
    {drop:.72,hold:true,next:null,fps:60});
  KC('Appear',2.8,[[0,{HP:[0,.1,0],h:[10,0,0],sp:[14,0,0],ch:[14,0,0],hd:[16,0,0],gR:{s:[.1,-.4,.4]},dR:[0,.6,.8],gL:{s:[-.1,-.4,.4]},dL:[0,.6,.8],fist:[60,95],bs:[0],sn:[-900]}],
    [1.3,{HP:[0,.26,0],h:[-6,0,0],sp:[-10,0,0],ch:[-14,0,0],hd:[-24,0,0],gR:{s:[-.5,.42,.12]},dR:[-.2,1,0],gL:{s:[.5,.42,.12]},dL:[0,1,0],fist:[0,95],jw:[28],bs:[1],sn:[0]}],
    [1.6,{HP:[0,.26,0],h:[-6,0,0],sp:[-10,0,0],ch:[-14,0,0],hd:[-24,0,0],gR:{s:[-.5,.43,.12]},dR:[-.2,1,0],gL:{s:[.5,.43,.12]},dL:[0,1,0],fist:[0,95],jw:[30]}],
    [2.1,{HP:[0,.2,-.02],h:[-4,-6,0],sp:[-4,0,0],ch:[-8,0,0],hd:[-20,6,0],gR:{s:[-.3,-.5,.2]},dR:[-.6,-.3,.7],gL:{s:[-.16,-.54,.02]},dL:[0,-.2,1],fist:[80,95],jw:[24]}],
    [2.8,{}]],'Whirls up out of a point of fire, growing as he spins, bursts open with the arms flung up, laughs and raises the scimitar',
    {mod:(o,t)=>{const e=Math.max(0,Math.min(1,(t-1.6)/.15,(2.4-t)/.25)),l=S(D*t*3.5);o.jw=[o.jw[0]+e*10*l];return o;}});
  return EF_ALL=L;}

ASSETS.push({id:'efreet',folder:'characters/enemies/hell',name:'Efreet',kind:'character',variants:true,defaultSeed:1,groundR:4.2,build:(s,o)=>buildEfreet(s,o||{}),
  opts:[{key:'skin',label:'Skin',choices:[['random','Random'],...Object.entries(EF_SKIN).map(([kk,v])=>[kk,v[1].charAt(0).toUpperCase()+v[1].slice(1)])],def:'random'},
    {key:'fire',label:'Fire',choices:[['random','Random'],...Object.entries(EF_FIRE).map(([kk,v])=>[kk,v[3].charAt(0).toUpperCase()+v[3].slice(1)])],def:'random'},
    {key:'head',label:'Head',choices:[['random','Random'],['topknot','Topknot'],['turban','Jewelled turban'],['horns','Horns']],def:'random'},
    {key:'weapon',label:'Weapon',choices:[['scimitar','Flame scimitar'],['none','None']],def:'scimitar'}],
  desc:'Efreet: a fire genie of Hell, about 3.4 m, floating on a whirling tail of fire instead of legs. Muscular bare chest under an open vest with gold trim, a wide sash with flames licking up to it from the tail, gold torc, arm rings and bracers; big head with glowing eyes, a hooked nose, a grin, pointed ears with gold hoops, a pointed beard; a black topknot, a jewelled turban or horns. Skin crimson, ember, bronze or charcoal; fire orange, crimson, blue or green. A scimitar with a blade of flame, or none. Idle, float, war-mode idle and float, three attacks, a diving smash, three spells (fire bolt, eruption, fire breath), a laughing taunt, two hits, a heavy hit, death (burns out, the scimitar falls) and appear.'});
