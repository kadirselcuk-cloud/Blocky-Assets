/* ======================= OGRE: a fat giant about 3.5 m tall, with a knotted club or an uprooted tree trunk =======================
   Built in real metres on the villager's 25 joints (so the warrior's leg/arm IK and the goblin's death clips work unchanged):
   short thick legs, a huge hanging gut, a hunched back, long heavy arms with big mitts, and a small head with an underbite and
   two lower tusks. Both weapons are held like the warrior's two-handed axe (wrRig two): the right hand by the head end, the
   left hand OG_HAFT behind it on the haft, or free when lf = 1. Normal mode carries the weapon on the right shoulder.
   After every IK solve the weapon is tilted up just enough that none of it goes below the ground. */
VB.ogre=Object.assign({},VB.goblin,{thigh:.66,shin:.6,ankle:.14,hipOff:.12,spine:.34,chest:.32,neck:.52,headY:.12,shW:.8,ua:.74,fa:.68,g:3.4,hipW:.3,head:1,hand:2.3,arm:1,td:1});
{const b=VB.ogre;b.key='ogre';b.hipH=b.thigh+b.shin+b.ankle+b.hipOff;b.legS=(b.thigh+b.shin)/.84;b.tS=(b.spine+b.chest)/.3;b.cS=b.neck/.22;}
const OG_HAFT=.36;
const OG_SKIN={green:['#707757','grey-green'],mud:['#735f4b','mud-brown'],pale:['#8f8a7c','pale grey'],ochre:['#8e7653','ochre'],blue:['#5d6b6d','dusky blue'],pink:['#8d6e63','dusky pink']};
const OG_HIDE=[['#69543e','brown hide'],['#836e53','tan hide'],['#4d433a','dark hide'],['#6e5f54','grey-brown hide'],['#5d4b35','mottled hide']];
const OG_FUR=[['#5e5347','brown fur'],['#3c3631','black fur'],['#7b766e','grey fur'],['#8a7b65','fawn fur']];
const OG_WPN={club:'knotted club',trunk:'uprooted tree trunk'};
/* weapon axis (+y) along the thumb side of the right hand, +x towards the knuckles */
const OG_BASIS=()=>new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(new THREE.Vector3(0,-1,0),new THREE.Vector3(0,0,1),new THREE.Vector3(-1,0,0)));

/* weapons: right grip at the origin, left grip at -OG_HAFT, the heavy end towards +y. Meshes sit directly in the group (the death clips read them) */
function ogWeapon(kind){const w=new THREE.Group(),wd=bm('#5c4633','leather'),wdD=bm('#46372a','leather'),wrap=bm('#382b21','leather'),ir=vm('iron'),
    bark=bm('#514335','leather'),barkD=bm('#3f342a','leather'),cut=bm('#9b8260','plain'),moss=bm('#4d5530','plain'),dirt=bm('#44382c','plain');
  /* scale everything beyond y0 about the axis point (0,y0,0): the head grows or shrinks, the grip stays as it is */
  const grow=(y0,k)=>{for(const m of w.children)if(m.position.y>y0){m.position.set(m.position.x*k,y0+(m.position.y-y0)*k,m.position.z*k);m.scale.multiplyScalar(k);}};
  if(kind==='club'){
    /* knotted club: a wrapped haft long enough for both hands, a knob, a head that swells in crooked lumps, iron bands and nails */
    bx(w,.14,.76,.14,wd,0,-.13,0);bx(w,.165,.6,.165,wrap,0,-.18,0);for(const y of[-.42,-.18,.06])bx(w,.175,.025,.175,wdD,0,y,0);bx(w,.2,.06,.2,wdD,0,-.52,0);
    for(const[y0,y1,s,rx,rz]of[[.2,.56,.22,0,.03],[.5,.9,.3,.03,-.04],[.84,1.26,.37,-.03,.03],[1.2,1.52,.35,.02,-.03],[1.48,1.64,.26,0,0]])bx(w,s,y1-y0,s,wd,0,(y0+y1)/2,0,rx,0,rz);
    bx(w,.32,.06,.32,ir,0,.52,0);bx(w,.4,.06,.4,ir,0,1.23,0);
    for(const[y,a,h]of[[.68,0,.15],[.76,1.6,.15],[.98,.8,.185],[1.06,2.4,.185],[1.1,4.2,.185],[1.36,.4,.175],[1.4,2.1,.175],[1.44,3.6,.175],[.72,3.3,.15]])
      bx(w,.15,.04,.04,ir,Math.cos(a)*(h+.04),y,Math.sin(a)*(h+.04),0,-a,0);
    bx(w,.08,.1,.07,wdD,.17,.95,.06);bx(w,.07,.08,.08,wdD,-.06,.7,-.15);bx(w,.09,.09,.06,wdD,-.12,1.38,.15);grow(.2,1.4);}
  else{
    /* tree trunk: thin end as the haft (broken top with splinters), widening to a root plate with roots and a clod of earth */
    bx(w,.19,.84,.19,bark,0,-.11,0);bx(w,.15,.03,.15,cut,0,-.53,0);bx(w,.04,.1,.03,cut,.05,-.56,.04,.2,0,.1);bx(w,.03,.08,.04,cut,-.05,-.555,-.03,-.1,0,-.2);
    for(const[y0,y1,s,rx,rz]of[[.25,.95,.25,.02,-.02],[.9,1.62,.3,-.02,.02],[1.56,2.28,.35,.02,.015],[2.22,2.74,.41,-.015,-.02],[2.68,2.96,.5,0,0]]){const y=(y0+y1)/2;bx(w,s,y1-y0,s,bark,0,y,0,rx,0,rz);
      bx(w,.035,(y1-y0)*.75,.02,barkD,s*.2,y,s/2+.006,rx,0,rz);bx(w,.02,(y1-y0)*.6,.035,barkD,s/2+.006,y+.05,-s*.15,rx,0,rz);}
    bx(w,.44,.14,.44,dirt,0,3.02,0);
    for(let i=0;i<7;i++){const a=i*Math.PI*2/7+.3,t=.95+.1*(i%3),L=.42+.08*(i%2),ca=Math.cos(a),sa=Math.sin(a),dx=Math.sin(t)*ca,dy=Math.cos(t),dz=Math.sin(t)*sa;
      bx(w,.1,L,.1,barkD,ca*.2+dx*L/2,2.88+dy*L/2,sa*.2+dz*L/2,t*sa,0,-t*ca);}
    bx(w,.09,.4,.09,bark,.22,1.35,0,0,0,-.8);bx(w,.07,.04,.07,cut,.36,1.47,0,0,0,-.8);bx(w,.08,.32,.08,bark,-.06,1.98,.24,.85,0,.2);bx(w,.065,.04,.065,cut,-.08,2.07,.36,.85,0,.2);
    bx(w,.13,.3,.02,moss,.02,1.25,.161);bx(w,.02,.26,.14,moss,-.186,2.0,0);bx(w,.12,.2,.02,moss,0,2.5,-.216);grow(.25,.68);}
  w.userData.len=0;for(const m of w.children)w.userData.len=Math.max(w.userData.len,m.position.y);
  return w;}

/* robe skirt (ogre magi): front, back and side panels pivot at the waist and follow the thighs (like the villager's skirt), two
   parts each so the lower part folds back on a high knee; a cloth sash round the waist with hanging ends, a pouch on the right */
function ogSkirt(hips,hide,hideD,sash,r){const PW=1.24,PD=.86,t=.05,y0=.1,L1=.45,L2=.4,sk={},D2=Math.PI/180;
  const panel=(par,q,L,low)=>{const fb=q==='F'||q==='B';if(fb)bx(par,PW+2*t,L,t,hide,0,-L/2,0);else bx(par,t,L,PD,hide,0,-L/2,0);
    if(!low)return;const span=fb?PW+2*t:PD,n=fb?6:4;for(let i=0;i<n;i++){if(r()<.3)continue;const tw=span/n*(.55+.35*r()),Lt=.04+.08*r(),c=-span/2+(i+.5)*span/n;
      if(fb)bx(par,tw,Lt,t*.8,hideD,c,-L-Lt/2+.006,0);else bx(par,t*.8,Lt,tw,hideD,0,-L-Lt/2+.006,c);}};
  const piv={F:[0,PD/2+t/2],B:[0,-PD/2-t/2],L:[PW/2+t/2,0],R:[-PW/2-t/2,0]};
  for(const q in piv){const up=J('skirt_'+q,hips,piv[q][0],y0,piv[q][1]);up.userData.joint=false;panel(up,q,L1,false);
    const lo=J('skirtLow_'+q,up,0,-L1,0);lo.userData.joint=false;panel(lo,q,L2,true);sk[q]={up,lo};}
  bx(hips,PW+2*t+.06,.15,PD+2*t+.06,sash,0,y0+.04,0);
  bx(sk.L.up,.04,.1,.16,sash,t/2+.02,-.03,.12);bx(sk.L.up,.03,.42,.1,sash,t/2+.02,-.28,.08,0,0,-.04);bx(sk.L.up,.03,.36,.09,sash,t/2+.02,-.25,.19,0,0,.05);
  bx(sk.R.up,.12,.22,.26,hideD,-t/2-.06,-.16,.12);bx(sk.R.up,.13,.05,.27,bm('#271f19','leather'),-t/2-.06,-.06,.12);
  sk.post=(tL,tR)=>{const a=tL.rotation.x,b=tR.rotation.x,lo=Math.min(a,b),hi=Math.max(a,b),av=(a+b)/2;
    const set=(q,v)=>{sk[q].up.rotation.x=v;const m=Math.abs(v),gv=Math.min(1,Math.max(0,(m-30*D2)/(40*D2)))*.95;sk[q].lo.rotation.x=-v*gv;};
    set('F',lo<0?lo*.8:lo*.4);set('B',hi>0?hi*.8:hi*.5);set('L',(a*.7+av*.3)*.5);set('R',(b*.7+av*.3)*.5);
    sk.L.up.rotation.z=Math.max(0,tL.rotation.z)*.6;sk.R.up.rotation.z=Math.min(0,tR.rotation.z)*.6;};
  return sk;}

function buildOgre(seed,o={}){const B=VB.ogre,r=mulberry32(((seed*2654435761)>>>0)^0x0a7e),pick=a=>a[Math.floor(r()*a.length)],root=new THREE.Group();root.userData.lights=[];
  /* roll everything, then let the options override */
  const rk=pick(Object.keys(OG_SKIN)),rh=pick(['bald','topknot','topknot','shaggy']),rm=pick(['fur','fur','none']),hideC=pick(OG_HIDE),furC=pick(OG_FUR),hairC=pick(['#1d1b19','#372b22','#4d3a2b','#615e59']),
    shackle=r()<.5,warts=r()<.7,scar=r()<.5;
  const skinK=o.skin&&o.skin!=='random'?o.skin:rk,hair=o.hair&&o.hair!=='random'?o.hair:rh,mantle=o.mantle&&o.mantle!=='random'?o.mantle:rm,wpn=o.weapon||'club';
  const sk=OG_SKIN[skinK],shade=(h,f)=>'#'+new THREE.Color(h).multiplyScalar(f).getHexString(),skin=bm(sk[0],'skin'),skinD=bm(shade(sk[0],.84),'skin'),skinM=bm(shade(sk[0],.62),'skin'),skinX=bm(shade(sk[0],.42),'skin'),
    hide=bm(hideC[0],'leather'),hideD=bm(shade(hideC[0],.7),'leather'),fur=bm(furC[0],'hair'),furD=bm(shade(furC[0],.75),'hair'),belt=bm('#36281d','leather'),wrapM=bm('#433428','leather'),
    dark=bm('#1a1411','plain'),eyeM=bm('#b7a768','plain'),ivory=bm('#d9d1b9','plain'),nail=bm('#443930','plain'),bone=bm('#d6ccb2','plain'),cord=bm('#271f19','leather'),hairM=bm(hairC,'hair'),rope=vm('rope'),ir=vm('iron');
  /* joints: same names, offsets and order as buildVillager */
  const hips=J('hips',root,0,B.hipH,0),spine=J('spine',hips,0,B.spine,0),chest=J('chest',spine,0,B.chest,0),neck=J('neck',chest,0,B.neck,0),head=J('head',neck,0,B.headY,0);
  const aw=.42,lw=.13*B.g,fk=B.ankle/.06,hk=B.hand,g=B.g;
  /* ragged hem: teeth of random length hanging below y around a w x d garment */
  const hem=(par,w,d,y,m,n,L0,L1)=>{for(const[f,s]of[[1,1],[1,-1],[0,1],[0,-1]]){const span=f?w:d;for(let i=0;i<n;i++){if(r()<.3)continue;const tw=span/n*(.55+.35*r()),L=L0+(L1-L0)*r(),c=-span/2+(i+.5)*span/n;
    if(f)bx(par,tw,L,.03,m,c,y-L/2+.006,s*(d/2+.006));else bx(par,.03,L,tw,m,s*(w/2+.006),y-L/2+.006,c);}}};
  /* hips: hide wrap, a thick belt under the gut with a pouch on the left */
  bx(hips,1.0,.42,.78,hide,0,-.06,0);bx(hips,.86,.26,.1,hide,0,-.1,-.42);
  const rb=o.robe;if(!rb){bx(hips,1.06,.11,.84,belt,0,.1,0);bx(hips,.1,.22,.24,hideD,.56,-.02,.12);bx(hips,.11,.05,.25,cord,.56,.08,.12);}
  /* the gut: a wide core, love handles, and a paunch that swells forward in steps and hangs over the belt */
  bx(spine,1.3,.66,.94,skin,0,.02,.02);bx(spine,1.42,.38,.74,skin,0,-.08,.04);bx(spine,1.12,.54,.14,skin,0,-.04,.56);bx(spine,.86,.38,.1,skin,0,-.07,.68);
  bx(spine,.07,.06,.02,skinX,0,-.04,.735);bx(spine,.8,.035,.02,skinM,0,-.27,.735-.12);bx(spine,1.1,.5,.08,skin,0,.02,-.5);
  if(scar)bx(spine,.32,.03,.012,skinX,-.18,-.02,.734,0,0,.5);
  /* chest: broad, sagging pecs, heavy traps and a hump */
  bx(chest,1.18,.5,.86,skin,0,.19,0);bx(chest,.96,.16,.68,skin,0,.5,-.06);bx(chest,.84,.3,.12,skin,0,.34,-.48);
  for(const s of[-1,1]){bx(chest,.44,.24,.1,skin,s*.25,.17,.47);bx(chest,.4,.03,.02,skinM,s*.25,.05,.52);}
  if(!o.heads)bx(neck,.62,.26,.6,skin,0,.02,.1);
  /* robe (ogre magi): open hide robe over the back and sides of the chest and gut, lapels at the front edges, half sleeves below */
  if(rb){bx(chest,1.24,.58,.07,hide,0,.2,-.56);for(const s of[-1,1]){bx(chest,.06,.52,.9,hide,s*.62,.18,-.08);bx(chest,.16,.52,.05,hideD,s*.53,.18,.5);
      bx(spine,.06,.66,.62,hide,s*.75,.02,-.2);bx(spine,.05,.6,.1,hideD,s*.75,.02,.13);}bx(spine,1.34,.62,.07,hide,0,.04,-.575);}
  if(mantle==='fur'){/* fur mantle round the shoulders and neck, ragged at the hem */
    bx(chest,1.3,.26,1.0,fur,0,.4,-.02);bx(chest,1.1,.08,.84,furD,0,.56,-.04);hem(chest,1.3,1.0,.27,fur,6,.04,.12);}
  /* bone necklace: a cord across the front of the chest (or the mantle), big teeth and a bone hanging from it */
  {const fz=mantle==='fur'?.5:.44,cy=mantle==='fur'?.3:.44;bx(chest,.72,.03,.03,cord,0,cy,fz+.01);
    if(rb){/* talisman: dark and ivory beads, and a stone set in a gold diamond */const gold=bm('#a78e5c','plain'),bead=bm('#292421','plain'),gem=bm(rb.gem[0],'plain');
      for(const[i,x]of[-.3,-.21,-.12,.12,.21,.3].entries())bx(chest,.06,.06,.05,i%2?ivory:bead,x,cy-.03,fz+.02);
      bx(chest,.03,.08,.03,cord,0,cy-.05,fz+.02);bx(chest,.16,.16,.04,gold,0,cy-.17,fz+.025,0,0,Math.PI/4);bx(chest,.1,.1,.05,gem,0,cy-.17,fz+.03,0,0,Math.PI/4);}
    else{for(const x of[-.27,-.16,.16,.27])bx(chest,.05,.12,.04,ivory,x,cy-.07,fz+.02);bx(chest,.07,.18,.05,bone,0,cy-.1,fz+.025);bx(chest,.12,.04,.05,bone,0,cy-.2,fz+.025);}}
  /* head: small for the body; broad skull, underslung jaw with lower tusks, heavy single brow, small eyes, flat nose, stubby ears */
  /* o.heads (two-headed ogre): builds its own heads on the neck instead of this one */
  if(o.heads)o.heads({head,neck,chest,skin,skinD,skinM,skinX,eyeM,dark,ivory,nail,hairM,rope,ir,cord,warts});
  else{const hg=new THREE.Group();head.add(hg);hg.position.z=.12;
  bx(hg,.62,.5,.6,skin,0,.36,-.02);bx(hg,.72,.22,.62,skin,0,.1,.06);bx(hg,.56,.12,.44,skin,0,-.04,.06);
  bx(hg,.66,.1,.12,skinM,0,.47,.3);bx(hg,.5,.03,.02,skinX,0,.213,.37);
  for(const s of[-1,1]){bx(hg,.09,.06,.02,eyeM,s*.14,.39,.285);bx(hg,.035,.05,.022,dark,s*.13,.39,.287);
    bx(hg,.07,.13,.07,ivory,s*.22,.265,.33);bx(hg,.05,.05,.05,ivory,s*.215,.35,.33);bx(hg,.03,.012,.012,dark,s*.06,.235,.4);
    const e=new THREE.Group();put(hg,e,s*.31,.37,-.02,0,s*.25,0);bx(e,.1,.18,.12,skin,s*.05,0,0);bx(e,.06,.12,.02,skinX,s*.06,-.01,.06);bx(e,.07,.06,.1,skin,s*.1,.06,-.02);
    if(rb){const gold=bm('#a78e5c','plain');bx(e,.025,.08,.025,gold,s*.06,-.13,.02);bx(e,.07,.025,.025,gold,s*.06,-.18,.02);}}
  for(const x of[-.1,0,.1])bx(hg,.05,.04,.04,ivory,x,.225,.33);
  bx(hg,.2,.14,.12,skin,0,.3,.33);bx(hg,.26,.07,.1,skinD,0,.25,.35);
  if(warts){bx(hg,.04,.04,.03,skinD,.2,.3,.29);bx(hg,.035,.035,.03,skinD,-.24,.55,.2);bx(hg,.03,.03,.03,skinD,.12,.06,.37);}
  if(hair==='topknot'){bx(hg,.2,.1,.2,hairM,0,.65,-.08);bx(hg,.22,.04,.22,rope,0,.71,-.08);bx(hg,.15,.2,.15,hairM,0,.83,-.1,-.2,0,0);bx(hg,.1,.12,.1,hairM,0,.96,-.15,-.4,0,0);}
  if(hair==='shaggy'){bx(hg,.66,.3,.06,hairM,0,.42,-.34);for(const s of[-1,1])bx(hg,.05,.24,.36,hairM,s*.335,.47,-.14);bx(hg,.5,.05,.3,hairM,0,.63,-.16);
    for(const[x,L]of[[-.24,.12],[-.08,.18],[.08,.14],[.24,.1]])bx(hg,.12,L,.05,hairM,x,.27-L/2+.02,-.34);}}
  const sockHead=J('socket_head',head,0,.72,0);sockHead.userData.socket=true;
  /* arms: long and heavy, leather wrist wraps, big mitts with dark nails; sometimes a broken iron shackle on the left wrist */
  for(const[sd,s]of[['L',1],['R',-1]]){const sh=J('shoulder_'+sd,chest,s*B.shW*.325,.165*B.cS,0),ua=J('upperArm_'+sd,sh,s*B.shW*.675,0,0),fa=J('foreArm_'+sd,ua,0,-B.ua,0),hd=J('hand_'+sd,fa,0,-B.fa,0);
    bx(ua,aw,B.ua+aw/2,aw,skin,0,-B.ua/2+aw/4,0);bx(ua,aw*1.18,.36,aw*1.14,skin,s*.01,-.04,0);
    if(rb){bx(ua,aw*1.26,.44,aw*1.24,hide,s*.01,-.12,0);hem(ua,aw*1.26,aw*1.24,-.34,hide,2,.03,.08);}
    if(mantle==='fur'){bx(ua,aw*1.32,.14,aw*1.3,fur,s*.02,.12,0);hem(ua,aw*1.32,aw*1.3,.05,fur,2,.03,.08);}
    bx(fa,aw*1.14,B.fa*.72,aw*1.14,skin,0,-B.fa*.36,0);bx(fa,aw*.9,B.fa*.34,aw*.9,skin,0,-B.fa*.82,0);bx(fa,aw*.98,.16,aw*.98,wrapM,0,-B.fa*.8,0);bx(fa,aw*1.0,.025,aw*1.0,cord,0,-B.fa*.8+.05,0);
    if(sd==='L'&&shackle){bx(fa,aw*1.04,.1,aw*1.04,ir,0,-B.fa*.64,0);bx(fa,.04,.12,.1,ir,s*(aw*.52+.02),-B.fa*.64-.09,0);bx(fa,.1,.12,.04,ir,s*(aw*.52+.02),-B.fa*.64-.19,0);}
    const hw=aw*.85;bx(hd,hw*1.08,.09*hk,hw*1.1,skin,0,-.04*hk,0);
    const fg=J('fingers_'+sd,hd,0,-.085*hk,0),ft=J('fingerTips_'+sd,fg,0,-.035*hk,0),th=J('thumb_'+sd,hd,-s*.02*hk,-.04*hk,hw/2);
    bx(fg,hw*.85,.04*hk,hw*.98,skin,s*.005,-.016*hk,0);bx(ft,hw*.75,.03*hk,hw*.92,skin,s*.005,-.012*hk,0);bx(th,.03*hk,.05*hk,.03*hk,skin,0,-.018*hk,.006);
    for(let i=-1;i<=1;i++)bx(ft,.03,.03,.04,nail,s*.005,-.034*hk,i*hw*.32);bx(th,.035,.03,.035,nail,0,-.05*hk,.006);
    const so=J('socket_'+sd,hd,-s*.012*hk,-.088*hk,0);so.userData.socket=true;}
  /* legs: fat thighs in hide breeches with a ragged hem, thick calves, broad bare feet */
  for(const[sd,s]of[['L',1],['R',-1]]){const th=J('thigh_'+sd,hips,s*B.hipW,-(B.hipOff+.01),0),sn=J('shin_'+sd,th,0,-B.thigh,0),ft=J('foot_'+sd,sn,0,-B.shin,0);
    bx(th,.52,B.thigh+.22,.52,skin,0,-B.thigh/2+.08,0);bx(th,.58,.46,.58,hide,0,-.07,0);if(!rb)hem(th,.58,.58,-.3,hide,3,.04,.12);
    bx(sn,.44,B.shin,.45,skin,0,-B.shin/2,0);bx(sn,.48,.28,.2,skin,0,-.2,-.14);
    const zh=.03*g-lw*.8,zt=.03*g+lw*.8,fl=lw*1.36;bx(ft,lw*1.04,.07*fk,fl,skin,0,-.035*fk,zh+fl/2);
    for(let i=-1;i<=1;i++){const big=i===-s?1.2:1,tz=zh+fl+(zt-zh-fl)/2;bx(ft,lw*.3*big,.036*fk*big,zt-zh-fl+.004,skin,i*lw*.34,-.07*fk+.018*fk*big,tz-.002);bx(ft,lw*.2*big,.02,.02,nail,i*lw*.34,-.07*fk+.032*fk*big,zt-.012);}}
  /* weapon in the right hand, the heavy end along the thumb side */
  const D2=Math.PI/180,Jn=n=>root.getObjectByName(n),wr=new THREE.Group();wr.name='weapon_R';Jn('socket_R').add(wr);const wp=o.wpnObj||ogWeapon(wpn);wp.quaternion.copy(OG_BASIS());wr.add(wp);
  /* the right fist stays closed round the weapon while it is held (the death clips let it fall) */
  const skirt=rb?ogSkirt(hips,hide,hideD,bm(rb.sash[0]),r):null;
  root.userData.post=()=>{if(skirt)skirt.post(Jn('thigh_L'),Jn('thigh_R'));if(rb?Math.abs(wr.quaternion.w)<.9999||Math.abs(wr.position.x)+Math.abs(wr.position.y)>1e-4:wr.position.lengthSq()>1e-6)return;Jn('fingers_R').rotation.set(0,0,95*D2);Jn('fingerTips_R').rotation.set(0,0,90*D2);Jn('thumb_R').rotation.set(14*D2,0,33*D2);};
  const joints=[];root.traverse(q=>{if(q.userData.joint&&!q.userData.socket)joints.push(q);});root.userData.joints=joints;root.userData.mantle=mantle;
  if(o.bare)return root;
  if(!o.noClips)root.userData.clips=ogreClips(wpn);root.userData.ground=wpn==='trunk'?5.5:4.2;
  const cap=s=>s.charAt(0).toUpperCase()+s.slice(1),hairT={bald:'bald',topknot:'a topknot',shaggy:'shaggy hair'}[hair];
  root.userData.variantText=`${cap(sk[1])} skin, ${hairT}${warts?', warts':''}; ${hideC[1]} breeches and belt${mantle==='fur'?`, ${furC[1]} mantle`:''}, bone necklace${shackle?', broken shackle on the left wrist':''}${scar?', scarred belly':''}; ${OG_WPN[wpn]}.`;
  return root;}

/* ---------- clips (real metres) ---------- */
const OGCLIPS={};
/* IK rig: a bare ogre with the weapon in hand (largest looks: fur mantle, topknot), so after a solve the weapon can be tested
   against the body's own boxes. low() = the weapon's lowest corner; pen() = the deepest weapon point inside the body (hands and
   forearms excepted) and the way out: away from that box's centre, mostly level */
function ogRig(kind){const B=VB.ogre,m=buildOgre(1,{weapon:kind,mantle:'fur',hair:'topknot',bare:true}),J={},V=THREE.Vector3;m.traverse(q=>{if(q.userData.joint)J[q.name]=q;});
  const R={m,J,B,two:true,haft:OG_HAFT,lroll:true},wr=m.getObjectByName('weapon_R'),W=[],BD=[],v=new V(),inv=new THREE.Matrix4();
  const jointOf=q=>{let p=q.parent;while(p&&!p.userData.joint)p=p.parent;return p?p.name:'';},under=q=>{while(q){if(q===wr)return true;q=q.parent;}return false;};
  const drop=[];m.traverse(q=>{if(!q.isMesh)return;const p=q.geometry.parameters;if(under(q))W.push(q);else if(!/hand|finger|thumb|foreArm/.test(jointOf(q))&&p.width*p.height*p.depth>4e-4)BD.push(q);else drop.push(q);});
  for(const q of drop)q.parent.remove(q);/* the rest only slows the solver down */
  const box=new THREE.Box3(),ctr=new V();for(const q of BD){const p=q.geometry.parameters;q.userData.rad=Math.hypot(p.width,p.height,p.depth)/2;}
  const corners=(q,f)=>{const p=q.geometry.parameters;for(let i=0;i<9;i++){if(i<8)v.set((i&1?.5:-.5)*p.width,(i&2?.5:-.5)*p.height,(i&4?.5:-.5)*p.depth);else v.set(0,0,0);f(v.applyMatrix4(q.matrixWorld));}};
  R.low=()=>{m.updateMatrixWorld(true);let y=1e9;for(const q of W)corners(q,c=>{if(c.y<y)y=c.y;});return y;};
  R.pen=()=>{m.updateMatrixWorld(true);const P=[];box.makeEmpty();for(const q of W)corners(q,c=>{P.push(c.clone());box.expandByPoint(c);});let best=0,out=null;
    for(const q of BD){ctr.setFromMatrixPosition(q.matrixWorld);const rd=q.userData.rad,r2=rd*rd;if(box.distanceToPoint(ctr)>rd)continue;const p=q.geometry.parameters;inv.copy(q.matrixWorld).invert();for(const c of P){if(c.distanceToSquared(ctr)>r2)continue;v.copy(c).applyMatrix4(inv);const dx=p.width/2-Math.abs(v.x),dy=p.height/2-Math.abs(v.y),dz=p.depth/2-Math.abs(v.z),d=Math.min(dx,dy,dz);
      if(d>best){best=d;out=c.clone().sub(new V().setFromMatrixPosition(q.matrixWorld));out.y*=.3;out.normalize();}}}
    return best>0?{d:best,n:out}:null;};
  return R;}
/* stances. Normal: hunched, feet apart and turned out, weapon on the right shoulder, left arm hanging clear of the gut.
   War: low and wide, left side forward, weapon cocked over the right shoulder in both hands */
const OG_N={HP:[0,-.08,0],h:[8,0,0],sp:[6,0,0],ch:[10,0,0],nk:[0,0,0],hd:[0,0,0],FL:[.36,.03,12,0,0],FR:[-.36,-.03,-12,0,0],
  gR:[-.85,2.65,.8],dR:[0,.55,-.9],pR:[-.3,-.9,.2],lf:[1],gL:[1.08,1.28,.3],dL:[1,0,.2],pL:[.5,-.3,-.8],fist:[30,95]};
const OG_W={HP:[0,-.2,0],h:[12,-20,0],sp:[8,-4,0],ch:[6,-6,0],nk:[0,0,0],hd:[0,0,0],FL:[.42,.36,-12,0,0],FR:[-.42,-.3,-42,0,0],
  gR:[-.7,2.4,.8],dR:[-.5,.6,-.6],pR:[-.6,-.7,-.3],lf:[0],gL:[-.45,2.1,1.1],dL:[.3,.5,.8],pL:[.6,-.7,-.3],fist:[95,95]};
function ogreClips(wpn){if(OGCLIPS[wpn])return OGCLIPS[wpn];const B=VB.ogre,D=Math.PI*2,S=Math.sin,C=Math.cos,L=[],R=ogRig(wpn),V=THREE.Vector3,gU=o=>gbU(B,o);
  /* solve; while the weapon cuts into the body, move the grip out of it (the left hand follows along the haft); then tilt the
     weapon up about the level axis across it until nothing of it is below the ground */
  const clear=(q,s)=>{for(let i=0;i<10;i++){const p=R.pen();if(!p||p.d<.005)break;const m=(p.d+.05)/B.legS;q.gR=[q.gR[0]+p.n.x*m,q.gR[1]+p.n.y*m,q.gR[2]+p.n.z*m];s=wrSolve(R,q);}return s;};
  const ground=(q,s)=>{if(R.low()>=.005)return s;const d0=new V(...q.dR).normalize(),ax=new V().crossVectors(d0,new V(0,1,0));if(ax.lengthSq()<1e-6)return s;ax.normalize();
    let lo=0,hi=Math.PI*.6;for(let i=0;i<10;i++){const a=(lo+hi)/2;q.dR=d0.clone().applyAxisAngle(ax,a).toArray();wrSolve(R,q);if(R.low()>=.005)hi=a;else lo=a;}
    q.dR=d0.clone().applyAxisAngle(ax,hi).toArray();return wrSolve(R,q);};
  /* continuity (one-shot clips): frames are solved in time order; each elbow pole leans towards where that elbow pointed in the
     frame before, and the right fist keeps its roll about the haft from the frame before, so neither flips over when the hand
     passes close to the shoulder line or the forearm turns back along the haft */
  let EL=null,HR=null;const elbows=()=>{const e={};R.m.updateMatrixWorld(true);for(const sd of['L','R']){const S=R.J['upperArm_'+sd].getWorldPosition(new V()),E=R.J['foreArm_'+sd].getWorldPosition(new V()),W=R.J['hand_'+sd].getWorldPosition(new V()),u=W.sub(S).normalize();
    E.sub(S);E.addScaledVector(u,-E.dot(u));if(E.lengthSq()>1e-6)e[sd]=E.normalize();}return e;};
  const solve=(o,cont)=>{const q=gU(o);if(cont&&EL)for(const sd of['L','R'])if(EL[sd]){const p=new V(...q['p'+sd]).normalize().lerp(EL[sd],.75).normalize();q['p'+sd]=p.toArray();}
    if(cont&&HR)q.eR=HR;
    let s=clear(q,wrSolve(R,q));s=ground(q,s);if(R.pen()){s=clear(q,s);s=ground(q,s);}
    if(cont){EL=elbows();const hq=R.J.hand_R.getWorldQuaternion(new THREE.Quaternion()),Dh=new V(0,0,1).applyQuaternion(R.J.socket_R.getWorldQuaternion(new THREE.Quaternion())),yw=new V(0,1,0).applyQuaternion(hq);
      HR=yw.addScaledVector(Dh,-yw.dot(Dh)).negate().normalize().toArray();}return s;};
  const CC=(name,dur,fn,o)=>{EL=HR=null;const cont=!(o&&o.loop),c=sampleClip(name,dur,t=>solve(fn(t),cont),Object.assign({autoFeet:false},o),B);L.push(c);return c;};
  const KC=(name,dur,keys,note,base=OG_W)=>CC(name,dur,wrKeys(keys.map(q=>[q[0],wrP(base,q[1])])),{note});
  const lift=(o,dy)=>{o.gR=[o.gR[0],o.gR[1]+dy,o.gR[2]];o.gL=[o.gL[0],o.gL[1]+dy,o.gL[2]];return o;};
  /* in-place IK gait: feet slide back while planted and swing forward lifted; the hands ride up and down with the hips */
  const GAIT=(name,dur,G,note)=>{const fn=t=>{const u=t/dur,o=G.body(u),c2=C(D*(u-G.duty/2));o.HP=[G.sw*c2,G.y0-G.b*C(2*D*(u-G.duty/2)),0];lift(o,o.HP[1]-G.y0);
      for(const[sd,off,x,yaw]of[['L',0,G.x,G.yaw[0]],['R',.5,-G.x,G.yaw[1]]]){const q=(((u+off)%1)+1)%1;let z,l,pt;
        if(q<G.duty){const v=q/G.duty;z=G.s*(1-2*v);l=0;pt=v<.15?-10*(1-v/.15):v>.7?G.toe*(v-.7)/.3:0;}
        else{const v=(q-G.duty)/(1-G.duty),sm=v*v*(3-2*v);z=-G.s+2*G.s*sm;l=G.lift*Math.sin(Math.PI*Math.pow(v,G.lp||1));pt=G.toe*(1-v)*(1-v)-12*v*v;}
        o['F'+sd]=[x,z,yaw,l,pt];}return o;};
    const sp=2*G.s/(G.duty*dur),c=CC(name,dur,fn,{loop:true,note:`${note}, in place, ${sp.toFixed(1)} m/s`});c.speed=sp;};

  /* ---- normal mode ---- */
  /* Idle: slow heavy breathing, looks around, scratches the gut with the free hand */
  CC('Idle',5,t=>{const p=D*t/5,b=S(p),b2=S(2*p),k=t>2.1&&t<4.1?S(Math.PI*(t-2.1)/2):0,sc=k*k*(3-2*k),rub=.05*S(D*t*2.6)*sc;
    return wrP(OG_N,{HP:[.02*b,-.08-.012*b2,0],h:[8,0,1.2*b],sp:[6+1*b2,0,0],ch:[10+1.8*b2,0,0],hd:[2*S(2*p+1)+14*sc,26*S(p+.6)*(1-sc),0],
      gR:[-.85,2.65-.01*b2,.8],gL:[1.08-.5*sc,1.28+.42*sc+rub,.3+.5*sc],dL:[1-.6*sc,0,.2+.6*sc],fist:[30+30*sc,95]});},{loop:true,note:'Heavy breathing, looking around, scratches the gut'});
  GAIT('Walk',1.5,{duty:.64,s:.42,lift:.16,toe:18,x:.38,yaw:[12,-12],y0:-.1,b:.03,sw:.07,
    body:u=>{const yw=C(D*(u-.97)),a=C(D*(u-.99));return wrP(OG_N,{h:[8,-6*yw,5*S(D*(u+.05))],sp:[6,2*yw,-2*S(D*(u+.05))],ch:[10+1.5*C(2*D*(u-.18)),3*yw,0],
      gL:[1.08,1.3+.04*a,.3+.35*a],dL:[1,0,.2]});}},'Heavy lumbering steps, weapon on the shoulder');
  GAIT('Run',.8,{duty:.42,s:.62,lift:.3,lp:.7,toe:28,x:.36,yaw:[8,-8],y0:-.12,b:.05,sw:.05,
    body:u=>{const yw=C(D*(u-.92)),a=C(D*(u-.9));return wrP(OG_N,{h:[18,-8*yw,5*S(D*(u+.1))],sp:[8,3*yw,0],ch:[8+2*C(2*D*(u-.12)),4*yw,0],
      gR:[-.85,2.65,.9],gL:[1.0,1.55+.12*a,.35+.55*a],dL:[.8,0,.6],pL:[.6,-.4,-.7],fist:[80,95]});}},'Lumbering run, weapon on the shoulder, free arm pumping');

  /* ---- war mode ---- */
  CC('Idle (war mode)',2.8,t=>{const p=D*t/2.8,b=S(p),b2=S(p+.6);return lift(wrP(OG_W,{HP:[.015*S(p*.5),-.2-.014*b,0],sp:[8+1.2*b,-4,0],ch:[6+1.8*b,-6,0],hd:[0,8*S(p*.5),0]}),-.02*b2);},{loop:true,note:'Low and wide, weapon cocked over the shoulder'});
  GAIT('Walk (war mode)',1.3,{duty:.64,s:.3,lift:.12,toe:20,x:.42,yaw:[-10,-40],y0:-.22,b:.02,sw:.04,
    body:u=>lift(wrP(OG_W,{h:[12,-18-5*C(D*u),4*S(D*(u+.1))],sp:[8,-4,0],ch:[6,-6,0]}),.02*C(2*D*u))},'Advancing, weapon ready');
  GAIT('Run (war mode)',.75,{duty:.4,s:.58,lift:.28,lp:.7,toe:30,x:.38,yaw:[-4,-14],y0:-.14,b:.05,sw:.03,
    body:u=>lift(wrP(OG_W,{h:[22,-10-6*C(D*u),4*S(D*(u+.1))],sp:[8,-3,0],ch:[4,-4,0],gR:[-.75,2.65,.75],dR:[-.45,.75,-.45]}),.03*C(2*D*(u-.1)))},'Charging, weapon raised');
  /* Roar: crouches, rears up with the weapon held high, pounds the chest three times with the free fist */
  {const up={HP:[0,-.12,0],h:[-2,-8,0],sp:[-8,0,0],ch:[-14,0,0],nk:[-8,0,0],hd:[-24,0,0],gR:[-.9,3.35,.25],dR:[-.15,.95,-.2],lf:[1],gL:[.3,2.3,.85],dL:[.2,.3,1],pL:[.8,-.4,-.3],fist:[95,95]},
    hit=wrP(up,{gL:[.3,2.3,.6],ch:[-12,0,0]});
  KC('Roar',3,[[0,{}],
    [.45,{HP:[0,-.32,0],h:[22,-16,0],sp:[14,-4,0],ch:[10,-4,0],hd:[12,0,0],gR:[-.6,2.0,.85],dR:[-.4,.7,-.6],lf:[1],gL:[.8,1.3,.8],dL:[.6,0,.8],fist:[60,95]}],
    [.85,up],[1.0,hit],[1.2,up],[1.35,hit],[1.55,up],[1.7,hit],[1.9,wrP(up,{hd:[-28,4,0]})],[2.3,wrP(up,{hd:[-26,-4,0]})],
    [3,{}]],'Rears up with the weapon high, head back, pounds the chest');}
  /* Taunt: weapon to the shoulder, slaps the gut three times and laughs, head bobbing back */
  {const st={HP:[0,-.1,0],h:[2,-6,0],sp:[-4,0,0],ch:[-6,0,0],FL:[.42,.36,-12,0,0],gR:[-.85,2.75,.7],dR:[0,.55,-.9],pR:[-.4,-.9,.1],lf:[1],dL:[.6,0,.8],pL:[.6,-.3,-.7],fist:[20,95]},
    pre=wrP(st,{gL:[.95,2.0,.95],hd:[-18,0,0]}),on=wrP(st,{gL:[.72,1.82,.7],hd:[-24,0,4],HP:[0,-.13,0]});
  KC('Taunt',3,[[0,{}],[.5,wrP(st,{gL:[1.0,1.5,.5],hd:[-10,0,0]})],[.8,pre],[.95,on],[1.2,pre],[1.35,on],[1.6,pre],[1.75,on],
    [2.0,wrP(st,{gL:[.95,1.6,.6],hd:[-26,0,-4],HP:[0,-.11,0]})],[2.25,wrP(st,{gL:[1.0,1.5,.5],hd:[-16,0,2]})],[3,{}]],'Slaps the gut and laughs, head thrown back');}
  /* attacks: the heavy end leads; downward blows land on the ground and stay there a moment */
  KC('Attack 1',1.85,[[0,{}],
    [.55,{HP:[0,-.24,-.06],h:[10,-50,0],sp:[8,-10,0],ch:[4,-24,0],gR:[-.95,2.05,-.15],dR:[-.7,.25,-.65],pR:[-.4,-.6,-.7],pL:[.5,-.6,-.6]}],
    [.8,{HP:[0,-.26,.1],h:[12,-12,0],sp:[8,-2,0],ch:[6,4,0],FL:[.42,.62,-10,.08,0],gR:[-.4,1.85,.9],dR:[-.8,.05,.6],pR:[-.4,-.8,-.4],pL:[.5,-.7,-.4]}],
    [.9,{HP:[0,-.28,.16],h:[14,8,0],sp:[8,4,0],ch:[8,20,0],FL:[.42,.72,-8,0,0],gR:[.05,1.8,1.05],dR:[-.1,-.05,1],pR:[-.4,-.8,-.4]}],
    [1.0,{HP:[0,-.28,.16],h:[14,20,0],sp:[8,8,0],ch:[8,30,0],FL:[.42,.72,-8,0,0],gR:[.9,1.85,1.15],dR:[.85,-.05,.5],pR:[-.3,-.9,-.3]}],
    [1.18,{HP:[0,-.27,.14],h:[14,24,0],sp:[8,8,0],ch:[8,34,0],FL:[.42,.72,-8,0,0],gR:[1.15,1.8,.6],dR:[.95,-.1,-.25],pR:[-.3,-.9,-.3]}],
    [1.34,{HP:[0,-.25,.1],h:[13,5,0],sp:[8,2,0],ch:[7,10,0],FL:[.42,.65,-10,.04,0],gR:[.3,1.75,1.3],dR:[.35,.25,.9],pR:[-.4,-.8,-.4]}],
    [1.58,{HP:[0,-.22,.05],h:[12,-6,0],ch:[6,-2,0],FL:[.42,.55,-10,.08,0],gR:[-.7,2.3,.95],dR:[-.5,.75,-.4]}],
    [1.85,{}]],'Wide sweep right to left with a step in');
  KC('Attack 2',1.8,[[0,{}],
    [.65,{HP:[0,-.14,-.08],h:[0,-14,0],sp:[-8,-2,0],ch:[-10,-4,0],hd:[-10,0,0],gR:[-.25,3.35,.1],dR:[0,.35,-.94],pR:[-.8,.2,-.3],pL:[.8,.2,-.3]}],
    [.85,{HP:[0,-.24,.1],h:[10,-10,0],sp:[6,0,0],ch:[4,0,0],FL:[.42,.6,-10,.08,0],gR:[-.2,3.0,1.0],dR:[0,.95,.3],pR:[-.8,0,-.3],pL:[.8,0,-.3]}],
    [1.0,{HP:[0,-.4,.2],h:[20,-8,0],sp:[10,0,0],ch:[4,0,0],FL:[.42,.7,-8,0,0],gR:[-.15,1.5,1.4],dR:[0,-.8,.6],pR:[-.7,-.6,-.3],pL:[.7,-.6,-.3]}],
    [1.25,{HP:[0,-.42,.2],h:[21,-8,0],sp:[11,0,0],ch:[4,0,0],FL:[.42,.7,-8,0,0],gR:[-.15,1.46,1.4],dR:[0,-.8,.6],pR:[-.7,-.6,-.3],pL:[.7,-.6,-.3]}],
    [1.55,{HP:[0,-.26,.08],h:[14,-14,0],sp:[8,-2,0],FL:[.42,.5,-10,.08,0],gR:[-.35,2.0,.9],dR:[-.3,.9,0]}],
    [1.8,{}]],'Overhead smash straight down onto the ground');
  KC('Heavy attack',2.6,[[0,{}],
    [.9,{HP:[0,-.12,-.16],h:[-4,-30,0],sp:[-10,-6,0],ch:[-14,-14,0],hd:[-14,0,0],FR:[-.42,-.3,-42,0,20],gR:[-.4,3.35,-.3],dR:[-.1,-.1,-.99],pR:[-.8,.3,-.3],pL:[.8,.3,-.3]}],
    [1.15,{HP:[0,-.22,.15],h:[6,-16,0],sp:[0,-2,0],ch:[-6,-4,0],FL:[.42,.9,-10,.12,0],gR:[-.3,3.2,.9],dR:[-.05,.98,.2],pR:[-.8,.1,-.3],pL:[.8,.1,-.3]}],
    [1.34,{HP:[0,-.55,.35],h:[26,-6,0],sp:[14,0,0],ch:[6,4,0],FL:[.42,1.0,-8,0,0],gR:[-.15,1.2,1.5],dR:[0,-.9,.45],pR:[-.7,-.6,-.3],pL:[.7,-.6,-.3]}],
    [1.75,{HP:[0,-.58,.35],h:[27,-6,0],sp:[15,0,0],ch:[6,4,0],FL:[.42,1.0,-8,0,0],gR:[-.15,1.16,1.5],dR:[0,-.9,.45],pR:[-.7,-.6,-.3],pL:[.7,-.6,-.3]}],
    [2.2,{HP:[0,-.34,.22],h:[18,-10,0],sp:[10,-2,0],ch:[6,0,0],FL:[.42,.8,-10,.08,0],gR:[-.35,2.0,.95],dR:[-.3,.9,0]}],
    [2.6,{}]],'Huge wind-up behind the back, a lunging step and a ground-shaking slam');
  /* Stomp: weight onto the left leg, right knee hauled up, foot slammed down; weapon raised in one hand, free arm out for balance.
     The left hand lets go of the haft beside the body first and comes back the same way, so the arm never swings round */
  {const side={lf:[1],gL:[.75,1.25,1.15],dL:[1,.1,.1],pL:[.3,0,-1],fist:[70,95]},
    up={HP:[.14,-.1,0],h:[-4,-14,-6],sp:[-6,-2,-3],ch:[-6,-4,0],hd:[-6,0,4],FR:[-.38,-.02,-30,.62,-8],gR:[-.85,2.95,.35],dR:[-.2,.85,-.5],lf:[1],gL:[1.55,2.0,.5],dL:[1,.1,.1],pL:[.3,0,-1],fist:[60,95]};
  KC('Stomp',2.0,[[0,{}],[.3,side],[.6,up],[.92,wrP(up,{FR:[-.38,-.02,-30,.7,-6],HP:[.14,-.06,0],gR:[-.85,3.05,.3]})],
    [1.04,{HP:[.02,-.44,0],h:[18,-16,0],sp:[10,-4,0],ch:[8,-6,0],hd:[10,0,0],FR:[-.4,-.04,-30,0,0],gR:[-.7,2.35,.65],dR:[-.3,.8,-.45],lf:[1],gL:[1.3,1.45,.8],dL:[1,.1,.1],pL:[.3,0,-1],fist:[80,95]}],
    [1.14,{HP:[0,-.38,0],h:[16,-16,0],sp:[9,-4,0],ch:[7,-6,0],FR:[-.4,-.04,-30,0,0],gR:[-.7,2.4,.65],lf:[1],gL:[1.3,1.48,.8],dL:[1,.1,.1],pL:[.3,0,-1],fist:[80,95]}],
    [1.55,wrP(side,{HP:[0,-.24,0],FR:[-.42,-.2,-38,0,0]})],[2.0,{}]],'Hauls the right knee up and stamps the ground');}
  /* Belly bash: the left hand lets go beside the body, both arms swing back (elbows back and up), a big step and the gut
     thrust forward; the hand comes back the same way */
  {const side={lf:[1],gL:[.75,1.25,1.15],dL:[1,.1,.1],pL:[.3,0,-1],fist:[60,95]},back={pR:[-.3,0,-1],lf:[1],dL:[1,.1,.1],pL:[.4,.6,-.6],fist:[80,95]};
  KC('Belly bash',1.8,[[0,{}],[.25,side],
    [.45,wrP(back,{HP:[0,-.2,-.12],h:[6,-8,0],sp:[0,-2,0],ch:[0,-2,0],gR:[-1.4,1.65,.05],dR:[-.55,.7,-.45],gL:[1.25,1.45,-.35],fist:[60,95]})],
    [.72,wrP(back,{HP:[0,-.2,.44],h:[-14,-4,0],sp:[-10,0,0],ch:[-8,0,0],hd:[-4,0,0],FL:[.42,.96,-6,0,0],FR:[-.42,-.12,-30,0,0],gR:[-1.45,1.6,-.15],dR:[-.55,.7,-.45],gL:[1.3,1.5,-.6]})],
    [.95,wrP(back,{HP:[0,-.22,.42],h:[-12,-4,0],sp:[-9,0,0],ch:[-7,0,0],FL:[.42,.96,-6,0,0],FR:[-.42,-.12,-30,0,0],gR:[-1.42,1.62,-.1],dR:[-.55,.7,-.45],gL:[1.28,1.5,-.55]})],
    [1.3,wrP(side,{HP:[0,-.22,.18],h:[6,-14,0],FL:[.42,.6,-10,.1,0],gR:[-.7,2.25,.75],dR:[-.45,.65,-.6]})],
    [1.8,{}]],'Arms swung back, a big step, the gut thrust forward');}
  /* hits */
  KC('Hit',.9,[[0,{}],
    [.08,{HP:[0,-.22,-.08],h:[4,-22,0],sp:[-8,-4,0],ch:[-18,-6,0],nk:[-10,0,0],hd:[-24,0,0],gR:[-.6,2.45,.65],gL:[.45,1.75,.6]}],
    [.18,{HP:[0,-.23,-.09],h:[3,-22,0],sp:[-9,-4,0],ch:[-20,-6,0],nk:[-12,0,0],hd:[-26,0,3],gR:[-.6,2.47,.63],gL:[.45,1.77,.58]}],
    [.45,{HP:[0,-.21,-.03],h:[10,-21,0],sp:[4,-4,0],ch:[2,-6,0],hd:[-6,0,0]}],
    [.9,{}]],'Blow to the face: head and shoulders snap back, then recover');
  KC('Heavy hit',1.9,[[0,{}],
    [.12,{HP:[0,-.16,-.12],h:[-6,-28,0],sp:[-14,-4,0],ch:[-16,-8,0],hd:[-20,0,4],gR:[-.7,2.6,.5],dR:[-.4,.8,-.4],gL:[.5,1.9,.5]}],
    [.35,{HP:[0,-.2,-.3],h:[0,-26,0],sp:[-6,-4,0],ch:[-8,-8,0],hd:[-8,0,0],FR:[-.42,-.62,-44,.12,0],gR:[-.62,2.45,.62],gL:[.45,1.75,.62]}],
    [.55,{HP:[0,-.26,-.44],h:[10,-24,0],sp:[6,-4,0],ch:[4,-8,0],FR:[-.42,-.8,-44,0,0]}],
    [.78,{HP:[0,-.24,-.48],FL:[.42,-.05,-14,.1,0],FR:[-.42,-.8,-44,0,0]}],
    [.98,{HP:[0,-.22,-.5],FL:[.42,-.24,-12,0,0],FR:[-.42,-.8,-44,0,0]}],
    [1.28,{HP:[0,-.21,-.28],FL:[.42,.04,-12,.1,0],FR:[-.42,-.8,-44,0,0]}],
    [1.45,{HP:[0,-.2,-.18],FR:[-.42,-.8,-44,0,0]}],
    [1.68,{HP:[0,-.2,-.08],FR:[-.42,-.55,-43,.1,0]}],
    [1.9,{}]],'Knocked back two heavy steps, then steps in again');
  /* deaths: the goblin's two falls on the ogre's body (measured on a bare ogre, so the gut takes the face-first fall) */
  L.push(...goblinDeaths(B,wpn,{st:OG_W,R,M:buildOgre(1,{weapon:wpn,mantle:'fur',hair:'topknot',bare:true}),lieZ:false}));
  return OGCLIPS[wpn]=L;}

ASSETS.push({id:'ogre',folder:'characters/enemies/brutes',name:'Ogre',kind:'character',variants:true,defaultSeed:1,groundR:4.2,build:(s,o)=>buildOgre(s,o||{}),
  opts:[{key:'skin',label:'Skin',choices:[['random','Random'],...Object.entries(OG_SKIN).map(([kk,v])=>[kk,v[1].charAt(0).toUpperCase()+v[1].slice(1)])],def:'random'},
    {key:'hair',label:'Hair',choices:[['random','Random'],['bald','Bald'],['topknot','Topknot'],['shaggy','Shaggy']],def:'random'},
    {key:'mantle',label:'Mantle',choices:[['random','Random'],['fur','Fur mantle'],['none','None']],def:'random'},
    {key:'weapon',label:'Weapon',choices:[['club','Knotted club'],['trunk','Tree trunk']],def:'club'}],
  desc:'Fat ogre, about 3.4 m: short thick legs, a huge hanging gut, a hunched back, long heavy arms with big mitts, a small head with an underbite and lower tusks. Skin grey-green, mud-brown, pale grey, ochre, dusky blue or dusky pink; bald, topknot or shaggy hair; hide breeches and a thick belt, a fur mantle or bare shoulders, a bone necklace, sometimes a broken shackle. Swings a knotted iron-banded club or an uprooted tree trunk with both hands. Idle, walk and run with the weapon on the shoulder; war-mode idle, walk and charge; roar, taunt (slaps the gut), sweep, overhead smash, heavy ground slam, stomp, belly bash, hit, heavy hit and two deaths.'});
