/* ======================= FIEND: a strong horned devil, about 3 m tall, with a weapon in each hand =======================
   Built in real metres on the villager's 25 joints (no group scale, so the 5 cm texture pixels stay the same), the oni's body plan
   scaled to 0.9: a narrow waist with a six-pack, a broad chest, traps and lats, thick arms with iron bracers, a spiked iron pauldron on
   the left shoulder and a leather baldric. Long, strong goat legs in shaggy fur: the knee bends forward, the shin runs back to a raised hock, and a long cannon bone goes down to a cloven hoof standing on its toes. A devil's head: long pointed face, a sly
   grin with fangs, glowing eyes under a heavy brow, long swept-back ears and big horns (bull, ram or swept back).
   Each hand holds its own weapon: a long sword with a glowing fuller, a double-bitted axe or a flail, all with about the same reach
   (1.3–1.5 m from the fist). Clips use the revenant's solver (rvSolver on the fiend's own rig) with both wrists keyed; after each solve
   a weapon below the ground is tilted up. A flail's chain and ball are simulated (a damped pendulum on the end of the handle, kept
   above the ground, out of the torso and within a cone round the handle) and baked into a track on fd_chain_R/L. */
VB.fiend=Object.assign({},VB.ogre,{thigh:.62,shin:.6,ankle:.5,hipOff:.08,spine:.27,chest:.27,neck:.36,headY:.16,shW:.7,ua:.6,fa:.54,g:1.45,hipW:.26,hand:1.9});
/* goat legs: the hips stand lower than the straight leg reaches (FD_HIP), so the knee always bends forward and the shin runs back down
   to a raised hock; the IK 'ankle' is the hock (0.58 m up), and the foot is the cannon bone and the hoof standing on its toes */
const FD_HIP=1.52;
{const b=VB.fiend;b.key='fiend';b.hipH=FD_HIP;b.legS=(b.thigh+b.shin)/.84;b.tS=(b.spine+b.chest)/.3;b.cS=b.neck/.22;}
const FD_SKIN={crimson:['#a8302a','crimson'],blood:['#6e1c1e','dark red'],charcoal:['#3a3234','charcoal'],violet:['#55304e','violet']};
const FD_FUR=[['#1e1614','black'],['#1e1614','black'],['#3e2618','dark brown'],['#5a2a1a','russet']];
const FD_EYES={yellow:['#fff4c0','#ffc81e','yellow'],orange:['#ffe0b0','#ff7a14','orange'],red:['#ffc8b8','#ff2a10','red']};
const FD_HORNS={bull:'great bull horns',ram:'curling ram horns',swept:'long swept-back horns'};
const FD_WPN={sword:'long sword',axe:'double axe',flail:'flail'};
/* flail: the chain pivots FD_PIV up the handle, the ball's centre FD_LC from the pivot; the ball's centre stays FD_BR above the ground */
const FD_PIV=.62,FD_LC=.6,FD_BR=.25;

/* weapons: grip at the origin, the business end along +y, edges along ±x (towards the fingers and the back of the hand) */
function fdWeapon(kind){const w=new THREE.Group(),ir=bm('#34343a','plain'),irL=bm('#6a6a72','plain'),irD=bm('#222226','plain'),edge=bm('#a4a6ac','plain'),grip=bm('#2a1a12','leather'),
    cordR=bm('#7a1a16','cloth'),wd=bm('#3e2a1c','leather'),bone=bm('#d4c8aa','plain'),glow=wrGlow('#ff7a4a','#ff3a10',1.6,pxTex('plain')),D=Math.PI;
  /* grip: leather wrap with red cord bands and an iron pommel */
  const gripAt=(y0,y1,r)=>{bx(w,r,y1-y0,r,grip,0,(y0+y1)/2,0);for(let y=y0+.06;y<y1-.03;y+=.11)bx(w,r+.012,.025,r+.012,cordR,0,y,0);};
  if(kind==='sword'){
    /* long sword: horned pommel, a guard swept up towards the blade like a pair of horns (a crescent, never a plain bar), a long
       dark blade with a glowing fuller and a few saw teeth on the back edge near the guard */
    gripAt(-.16,.15,.075);bx(w,.1,.06,.1,irD,0,-.19,0);for(const s of[-1,1])bx(w,.03,.08,.03,irD,s*.05,-.24,0,0,0,s*.5);
    bx(w,.12,.07,.09,irD,0,.18,0);for(const s of[-1,1]){bx(w,.14,.045,.06,ir,s*.11,.2,0,0,0,s*.45);bx(w,.05,.08,.045,ir,s*.18,.27,0,0,0,s*.2);}
    for(const[y0,y1,ww]of[[.21,.6,.15],[.6,1.0,.14],[1.0,1.3,.12],[1.3,1.42,.09],[1.42,1.5,.05]])bx(w,ww,y1-y0,.035,ir,0,(y0+y1)/2,0);
    bx(w,.02,1.0,.04,edge,.07,.82,0);bx(w,.03,.12,.028,edge,.035,1.45,0);
    for(const z of[-1,1])bx(w,.035,.9,.006,glow,0,.72,z*.019);
    for(let i=0;i<4;i++)bx(w,.04,.04,.03,ir,-.085,.32+i*.08,0,0,0,D/4);
    w.userData.len=1.5;}
  else if(kind==='axe'){
    /* double axe: a long iron-banded haft, a head with two crescent bits (one each side), a spike on top */
    gripAt(-.14,.2,.075);bx(w,.065,1.2,.065,wd,0,.66,0);bx(w,.09,.05,.09,irD,0,-.17,0);for(const y of[.3,.62,.94])bx(w,.08,.04,.08,ir,0,y,0);
    bx(w,.11,.3,.1,irD,0,1.2,0);bx(w,.12,.03,.11,ir,0,1.06,0);bx(w,.12,.03,.11,ir,0,1.34,0);
    for(const s of[-1,1]){bx(w,.1,.14,.05,ir,s*.1,1.2,0);bx(w,.08,.3,.04,ir,s*.18,1.2,0);bx(w,.06,.42,.035,ir,s*.24,1.2,0);
      bx(w,.03,.46,.04,edge,s*.28,1.2,0);bx(w,.05,.06,.035,ir,s*.25,1.43,0,0,0,s*.6);bx(w,.05,.06,.035,ir,s*.25,.97,0,0,0,-s*.6);}
    bx(w,.06,.12,.06,ir,0,1.41,0);bx(w,.035,.1,.035,irL,0,1.5,0);
    w.userData.len=1.55;}
  else{
    /* flail: a short iron-banded handle, a cap with a ring, a chain of iron links (fd_chain, posed by the clips) and a spiked ball */
    gripAt(-.14,.24,.08);bx(w,.075,.34,.075,wd,0,.4,0);bx(w,.1,.05,.1,irD,0,-.17,0);bx(w,.1,.04,.1,ir,0,.3,0);bx(w,.11,.08,.11,ir,0,.56,0);
    bx(w,.03,.06,.07,irD,0,.62,0);
    const ch=new THREE.Group();ch.name='fd_chain';ch.position.y=FD_PIV;w.add(ch);
    for(let i=0;i<5;i++){const y=.05+i*.095;if(i%2)bx(ch,.03,.11,.07,irD,0,y,0);else bx(ch,.07,.11,.03,irD,0,y,0);}
    bx(ch,.06,.05,.06,ir,0,.47,0);
    const bl=new THREE.Group();bl.position.y=FD_LC;ch.add(bl);bx(bl,.22,.22,.22,ir,0,0,0);bx(bl,.26,.16,.16,ir,0,0,0);bx(bl,.16,.26,.16,ir,0,0,0);bx(bl,.16,.16,.26,ir,0,0,0);
    for(const[x,y,z]of[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1],[.7,.7,0],[-.7,.7,0],[.7,-.7,0],[-.7,-.7,0],[0,.7,.7],[0,-.7,.7],[0,.7,-.7],[0,-.7,-.7]]){
      const s=new THREE.Group();bl.add(s);s.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),new THREE.Vector3(x,y,z).normalize());bx(s,.05,.08,.05,irL,0,.15,0);bx(s,.025,.04,.025,edge,0,.2,0);}
    w.userData.len=FD_PIV+FD_LC+.22;}
  return w;}

function buildFiend(seed,o={}){const B=VB.fiend,r=mulberry32(((seed*2654435761)>>>0)^0xf1e7),pick=a=>a[Math.floor(r()*a.length)],root=new THREE.Group();root.userData.lights=[];
  /* roll everything, then let the options override */
  const rk=pick(['crimson','crimson','blood','charcoal','violet']),rh=pick(['bull','bull','ram','swept']),furC=pick(FD_FUR),eyeK=pick(['yellow','yellow','orange','red']),hairK=pick(['bald','bald','slick']),
    goatee=r()<.6,darkHorn=r()<.6,rR=pick(['sword','axe','flail']),rL=pick(['sword','axe','flail']);
  const opt=(kk,d)=>o[kk]&&o[kk]!=='random'?o[kk]:d,skinK=opt('skin',rk),horns=opt('horns',rh),wR=opt('weaponR',rR),wL=opt('weaponL',rL);
  const sk=FD_SKIN[skinK],shade=(h,f)=>'#'+new THREE.Color(h).multiplyScalar(f).getHexString(),skin=bm(sk[0],'skin'),skinD=bm(shade(sk[0],.84),'skin'),skinM=bm(shade(sk[0],.64),'skin'),skinX=bm(shade(sk[0],.42),'skin');
  const fur=bm(furC[0],'hair'),furD=bm(shade(furC[0],.7),'hair'),hoof=bm('#2e2624','plain'),hoofL=bm('#5a4c44','plain'),dark=bm('#140c0a','plain'),ivory=bm('#ece2c4','plain'),
    bone=bm('#d4c8aa','plain'),boneD=bm('#9a8e70','plain'),ir=bm('#34343a','plain'),irL=bm('#6a6a72','plain'),irD=bm('#222226','plain'),lth=bm('#3a2418','leather'),lthD=bm('#24160e','leather'),
    cloth=bm('#4a1210','cloth'),clothD=bm('#2e0a08','cloth'),nail=bm('#1a1210','plain'),ey=FD_EYES[eyeK],eyeM=wrGlow(ey[0],ey[1],1.8,pxTex('plain')),
    hornA=darkHorn?bm('#2a2422','plain'):bm('#cfc3a2','plain'),hornB=darkHorn?bm('#4a4038','plain'):bm('#e2d8bc','plain'),hornC=darkHorn?bm('#b8ac90','plain'):bm('#f2ead6','plain'),hornR=darkHorn?bm('#1a1614','plain'):bm('#a49878','plain');
  /* b: the oni's torso and head measures, scaled down to the fiend */
  const F=.9,b=(par,w,h,d,m,x=0,y=0,z=0,rx,ry,rz)=>bx(par,w*F,h*F,d*F,m,x*F,y*F,z*F,rx,ry,rz);
  /* joints: same names, offsets and order as buildVillager */
  const hips=J('hips',root,0,B.hipH,0),spine=J('spine',hips,0,B.spine,0),chest=J('chest',spine,0,B.chest,0),neck=J('neck',chest,0,B.neck,0),head=J('head',neck,0,B.headY,0);
  const D2=Math.PI/180,aw=.34,lw=.13*B.g,fk=B.ankle/.06,hk=B.hand,g=B.g;
  /* ragged hem: teeth of random length hanging below y around a w x d garment */
  const hem=(par,w,d,y,m,n,L0,L1)=>{for(const[f,s]of[[1,1],[1,-1],[0,1],[0,-1]]){const span=f?w:d;for(let i=0;i<n;i++){if(r()<.3)continue;const tw=span/n*(.55+.35*r()),L=L0+(L1-L0)*r(),c=-span/2+(i+.5)*span/n;
    if(f)bx(par,tw,L,.026,m,c,y-L/2+.005,s*(d/2+.005));else bx(par,.026,L,tw,m,s*(w/2+.005),y-L/2+.005,c);}}};
  /* hips: a dark red cloth wrap with a ragged hem, a broad studded leather belt, a horned skull buckle */
  bx(hips,.96,.32,.64,cloth,0,-.04,0);hem(hips,.96,.64,-.2,clothD,7,.03,.09);
  bx(hips,1.0,.13,.68,lth,0,.12,0);for(let i=0;i<9;i++){const x=-.42+i*.105;if(Math.abs(x)<.1)continue;bx(hips,.04,.04,.02,irL,x,.12,.345);bx(hips,.04,.04,.02,irL,x,.12,-.345);}
  for(const s of[-1,1])for(let i=0;i<4;i++)bx(hips,.02,.04,.04,irL,s*.505,.12,-.24+i*.16);
  bx(hips,.14,.13,.05,bone,0,.12,.36);bx(hips,.1,.04,.04,bone,0,.05,.36);for(const s of[-1,1]){bx(hips,.035,.035,.02,dark,s*.03,.13,.386);bx(hips,.03,.08,.03,boneD,s*.075,.2,.36,0,0,-s*.5);}
  /* waist: narrow, a six-pack, obliques, a navel; a row of short bony spikes down the back */
  b(spine,.84,.52,.56,skin,0,0,0);b(spine,.06,.38,.4,skin,.43,-.02,.02);b(spine,.06,.38,.4,skin,-.43,-.02,.02);
  for(const y of[-.12,0,.12])for(const s of[-1,1])b(spine,.15,.1,.05,skin,s*.085,y,.29);b(spine,.02,.36,.02,skinM,0,0,.295);for(const y of[-.06,.06])b(spine,.32,.02,.02,skinM,0,y,.295);
  b(spine,.04,.04,.02,skinX,0,-.2,.285);b(spine,.7,.3,.06,skin,0,.08,-.29);
  for(const y of[-.14,.04,.2])b(spine,.06,.1,.1,bone,0,y,-.34,-.5,0,0);
  /* chest: broad, big pecs, a V of lats at the back, traps rising to the neck */
  b(chest,1.1,.52,.62,skin,0,.16,0);b(chest,1.0,.36,.08,skin,0,.12,-.33);b(chest,.03,.3,.02,skinM,0,.14,-.372);
  for(const s of[-1,1]){b(chest,.46,.26,.08,skin,s*.24,.2,.33);b(chest,.42,.03,.02,skinM,s*.24,.075,.37);b(chest,.05,.04,.02,skinD,s*.28,.15,.372);}
  b(chest,.66,.17,.44,skin,0,.48,-.05);b(neck,.44,.26,.42,skin,0,.02,.04);
  /* baldric: a leather strap from the left shoulder down to the right side, front and back, an iron ring on the chest */
  for(const z of[.39,-.39])b(chest,.12,.86,.03,lth,.02,.2,z,0,0,-1.0);
  b(chest,.1,.1,.03,irL,.06,.24,.405);b(chest,.05,.05,.035,irD,.06,.24,.41);
  /* head: long pointed face, a sly grin with fangs, glowing eyes under a heavy brow, a hooked nose, long swept-back ears, big horns */
  const hg=new THREE.Group();head.add(hg);hg.position.z=.12;const H=1.18,hb=(par,w,h,d,m,x=0,y=0,z=0,rx,ry,rz)=>bx(par,w*H,h*H,d*H,m,x*H,y*H,z*H,rx,ry,rz);
  hb(hg,.4,.32,.42,skin,0,.2,-.02);hb(hg,.36,.14,.36,skin,0,.02,.04);hb(hg,.22,.1,.22,skin,0,-.07,.09);hb(hg,.11,.06,.12,skin,0,-.13,.14);
  for(const s of[-1,1]){hb(hg,.08,.07,.12,skinD,s*.165,.12,.12);
    /* glowing eyes in dark sockets under a heavy brow slanting down to the middle */
    hb(hg,.11,.06,.02,dark,s*.095,.225,.196);hb(hg,.085,.035,.02,eyeM,s*.095,.222,.204);
    hb(hg,.19,.06,.1,skinM,s*.1,.275,.17,0,0,s*.3);
    /* long pointed ears, swept back and up */
    const e=new THREE.Group();put(hg,e,s*.2*H,.2*H,-.02*H,.35,s*.25,0);hb(e,.04,.12,.14,skin,s*.01,0,-.05);hb(e,.035,.08,.14,skin,s*.012,.03,-.16);hb(e,.03,.05,.1,skinD,s*.014,.05,-.26);
    hb(e,.012,.07,.1,skinX,s*.022,0,-.07);}
  hb(hg,.07,.1,.07,skin,0,.15,.215);hb(hg,.05,.04,.05,skinD,0,.1,.24);
  /* the grin: a dark slit with upturned corners, two fangs */
  hb(hg,.17,.025,.02,dark,0,.055,.226);for(const s of[-1,1]){hb(hg,.05,.022,.02,dark,s*.095,.068,.222,0,0,s*.5);hb(hg,.022,.045,.02,ivory,s*.05,.04,.232);}
  if(goatee){hb(hg,.1,.06,.06,furD,0,-.16,.17);hb(hg,.05,.05,.05,furD,0,-.2,.2);hb(hg,.03,.04,.03,furD,0,-.23,.22);for(const s of[-1,1])hb(hg,.06,.02,.02,furD,s*.06,.08,.226,0,0,s*.4);}
  if(hairK==='slick'){hb(hg,.42,.06,.4,furD,0,.37,-.04);hb(hg,.42,.24,.06,furD,0,.25,-.24);for(const s of[-1,1])hb(hg,.04,.16,.3,furD,s*.205,.28,-.08);hb(hg,.08,.06,.03,furD,0,.33,.19);}
  /* horns: tapering segments along a curve from the temples, ringed at the root, lighter towards the tip */
  const V=THREE.Vector3,Y=new V(0,1,0);
  const hornAlong=(pts,r0,r1)=>{const n=pts.length-1;for(let i=0;i<n;i++){const a=new V(...pts[i]),c=new V(...pts[i+1]),d=c.clone().sub(a),L=d.length(),t=i/n,rr=r0+(r1-r0)*(i+.5)/n;
    const m=bx(hg,rr*2,L+rr*.7,rr*2,t<.45?hornA:t<.75?hornB:hornC,(a.x+c.x)/2,(a.y+c.y)/2,(a.z+c.z)/2);m.quaternion.setFromUnitVectors(Y,d.normalize());
    if(i<n*.6&&i%1===0){const q=bx(hg,rr*2+.02,.025,rr*2+.02,hornR,a.x,a.y,a.z);q.quaternion.copy(m.quaternion);}}};
  const HP={bull:[[.13,.3,.1],[.24,.36,.1],[.36,.42,.11],[.46,.5,.13],[.52,.62,.16],[.53,.74,.2],[.5,.84,.24]],
    swept:[[.12,.32,.12],[.17,.43,.07],[.22,.5,-.04],[.26,.54,-.18],[.29,.54,-.32],[.31,.56,-.45],[.32,.62,-.56]],
    ram:[[.14,.31,.08],[.21,.43,0],[.3,.44,-.14],[.38,.34,-.24],[.42,.18,-.2],[.44,.06,-.08],[.44,.04,.07],[.43,.1,.17]]}[horns];
  for(const s of[-1,1])hornAlong(HP.map(p=>[s*p[0]*H,p[1]*H,p[2]*H]),(horns==='ram'?.08:.075)*H,(horns==='ram'?.024:.016)*H);
  const sockHead=J('socket_head',head,0,.7,0);sockHead.userData.socket=true;
  /* arms: deltoids, biceps and triceps, thick forearms in spiked iron bracers; a layered spiked pauldron on the left shoulder; big clawed hands */
  for(const[sd,s]of[['L',1],['R',-1]]){const sh=J('shoulder_'+sd,chest,s*B.shW*.325,.165*B.cS,0),ua=J('upperArm_'+sd,sh,s*B.shW*.675,0,0),fa=J('foreArm_'+sd,ua,0,-B.ua,0),hd=J('hand_'+sd,fa,0,-B.fa,0);
    bx(ua,aw,B.ua+aw/2,aw,skin,0,-B.ua/2+aw/4,0);bx(ua,aw*1.2,.28,aw*1.16,skin,s*.01,-.04,0);bx(ua,aw*.78,.22,.06,skin,0,-.3,aw/2+.02);bx(ua,aw*.78,.24,.05,skin,0,-.26,-aw/2-.018);
    bx(fa,aw*1.04,B.fa*.68,aw*1.04,skin,0,-B.fa*.34,0);bx(fa,aw*.86,B.fa*.38,aw*.86,skin,0,-B.fa*.78,0);
    bx(fa,aw*1.12,B.fa*.5,aw*1.12,ir,0,-B.fa*.6,0);bx(fa,aw*1.16,.03,aw*1.16,irL,0,-B.fa*.36,0);bx(fa,aw*1.16,.03,aw*1.16,irL,0,-B.fa*.84,0);
    for(const y of[-.22,-.34])bx(fa,.08,.04,.04,irD,s*(aw*.56+.035),y,0);
    /* the pauldron: a domed cap and three lames stepping down the outside of the arm, a rim on each, three tall spikes along the top */
    if(sd==='L'){const pd=new THREE.Group();put(ua,pd,s*.05,.08,0,0,0,-s*.35);bx(pd,aw*1.3,.1,aw*1.4,ir,0,.06,0);bx(pd,aw*1.1,.06,aw*1.2,ir,0,.13,0);bx(pd,aw*1.32,.02,aw*1.42,irL,0,.11,0);
      for(const[i,y]of[[1,-.02],[2,-.1],[3,-.18]]){bx(pd,.06,.1,aw*1.36-i*.02,i%2?irD:ir,s*(aw*.62+i*.015),y,0);bx(pd,.065,.02,aw*1.38-i*.02,irL,s*(aw*.62+i*.015),y+.045,0);}
      for(const[z,L0]of[[-.11,.22],[0,.3],[.11,.22]]){const sp=new THREE.Group();put(pd,sp,s*.02,.15,z,0,0,-s*.25);bx(sp,.07,L0*.45,.07,irD,0,L0*.22,0);bx(sp,.045,L0*.35,.045,irL,0,L0*.6,0);bx(sp,.022,L0*.22,.022,irL,0,L0*.86,0);}}
    const hw=aw*.85;bx(hd,hw*1.08,.09*hk,hw*1.1,skin,0,-.04*hk,0);
    const fg=J('fingers_'+sd,hd,0,-.085*hk,0),ft=J('fingerTips_'+sd,fg,0,-.035*hk,0),th=J('thumb_'+sd,hd,-s*.02*hk,-.04*hk,hw/2);
    bx(fg,hw*.85,.04*hk,hw*.98,skin,s*.005,-.016*hk,0);bx(ft,hw*.75,.03*hk,hw*.92,skin,s*.005,-.012*hk,0);bx(th,.03*hk,.05*hk,.03*hk,skin,0,-.018*hk,.006);
    for(let i=-1;i<=1;i++)bx(ft,.03,.05,.035,nail,s*.005,-.042*hk,i*hw*.32);bx(th,.035,.04,.035,nail,0,-.054*hk,.006);
    const so=J('socket_'+sd,hd,-s*.012*hk,-.088*hk,0);so.userData.socket=true;}
  /* goat legs: a furry thigh forward to the knee, a slender shin back down to a pointed hock, a long cannon bone down to the fetlock
     (a tuft of feathering and dewclaws behind) and a cloven hoof on its toes: two wedge-shaped claws stepping up towards the heel. The
     hoof stays inside the IK foot (heel and toe points) and its sole sits 5 mm above the IK sole. Rest pose: legs bent so the hooves
     stand on the ground (the clips set every joint anyway) */
  const restT=-42.5,restK=86.7;
  for(const[sd,s]of[['L',1],['R',-1]]){const th=J('thigh_'+sd,hips,s*B.hipW,-(B.hipOff+.01),0),sn=J('shin_'+sd,th,0,-B.thigh,0),ft=J('foot_'+sd,sn,0,-B.shin,0);
    th.rotation.x=restT*D2;sn.rotation.x=restK*D2;ft.rotation.x=-(restT+restK)*D2;
    /* thigh: a heavy haunch, big quads in front, a hamstring bulge behind */
    bx(th,.46,B.thigh+.16,.5,fur,0,-B.thigh/2+.05,0);bx(th,.38,.32,.07,fur,0,-.42,.27);bx(th,.07,.34,.38,fur,s*.25,-.38,.02);bx(th,.36,.3,.07,fur,0,-.26,-.27);
    for(const[x,y,z]of[[.12,-.2,.26],[-.1,-.34,.26],[s*.25,-.14,-.1],[0,-.24,-.31],[-s*.22,-.48,.12]])bx(th,.09,.13,.05,furD,x,y,z,0,0,(r()-.5)*.6);
    bx(th,.38,.12,.4,furD,0,-B.thigh+.03,.02);
    /* shin: a thick muscled upper half, a strong tendon down the back to the pointed hock */
    bx(sn,.34,.3,.36,fur,0,-.14,-.01);bx(sn,.27,.34,.27,fur,0,-.42,-.01);bx(sn,.26,.14,.15,furD,0,-.26,-.15);
    for(const[x,y,z]of[[.08,-.1,.19],[-.08,-.24,.19],[s*.18,-.18,-.02],[0,-.36,-.15]])bx(sn,.07,.11,.05,furD,x,y,z,0,0,(r()-.5)*.6);
    /* hock, cannon bone, fetlock with feathering and dewclaws, cloven hoof */
    const S=-.07*fk+.005;
    bx(ft,.22,.2,.22,fur,0,-.01,-.01);bx(ft,.12,.12,.1,furD,0,0,-.15);
    const cn=new THREE.Group();put(ft,cn,0,-.05,-.01,-.12,0,0);bx(cn,.15,.3,.15,fur,0,-.15,0);
    bx(ft,.23,.1,.23,furD,0,S+.21,0);bx(ft,.18,.06,.18,fur,0,S+.155,.02);
    bx(ft,.018,.11,.24,dark,0,S+.06,.05);
    for(const t of[-1,1]){const x=t*.06;
      bx(ft,.1,.06,.28,hoof,x,S+.03,.05);bx(ft,.095,.06,.21,hoof,x,S+.085,.02);bx(ft,.09,.05,.13,hoof,x,S+.135,-.015);
      bx(ft,.085,.035,.05,hoofL,x,S+.0175,.16);bx(ft,.09,.06,.05,hoofL,x,S+.035,-.075);bx(ft,.05,.05,.05,hoof,t*.055,S+.21,-.12);}}
  /* weapons: one in each hand, along the thumb side (the socket's z), as the revenant's */
  const Jn=n=>root.getObjectByName(n);
  for(const sd of['R','L']){const wg=new THREE.Group();wg.name='fd_wpn_'+sd;wg.userData.gear=true;Jn('socket_'+sd).add(wg);const wp=fdWeapon(sd==='R'?wR:wL);wp.name='fd_wp_'+sd;
    wp.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(new THREE.Vector3(0,-1,0),new THREE.Vector3(0,0,1),new THREE.Vector3(-1,0,0)));wg.add(wp);
    const ch=wp.getObjectByName('fd_chain');if(ch)ch.name='fd_chain_'+sd;}
  /* both fists stay closed round the weapons */
  root.userData.post=()=>{Jn('fingers_R').rotation.set(0,0,95*D2);Jn('fingerTips_R').rotation.set(0,0,90*D2);Jn('thumb_R').rotation.set(14*D2,0,33*D2);
    Jn('fingers_L').rotation.set(0,0,-95*D2);Jn('fingerTips_L').rotation.set(0,0,-90*D2);Jn('thumb_L').rotation.set(14*D2,0,-33*D2);};
  const joints=[];root.traverse(q=>{if(q.userData.joint&&!q.userData.socket)joints.push(q);});root.userData.joints=joints;
  if(o.bare)return root;
  if(!o.noClips)root.userData.clips=fiendClips(wR,wL,horns);root.userData.ground=3.6;
  const cap=s=>s.charAt(0).toUpperCase()+s.slice(1);
  root.userData.variantText=`${cap(sk[1])} skin, ${FD_HORNS[horns]} (${darkHorn?'black':'ivory'}), glowing ${ey[2]} eyes, ${hairK==='slick'?'slicked-back hair':'bald'}${goatee?', goatee':''}; ${furC[1]} goat legs, cloven hooves; ${FD_WPN[wR]} in the right hand, ${FD_WPN[wL]} in the left.`;
  return root;}

/* ---------- clips ---------- */
const FD_CLIPS={},FD_RIG={},FD_BASE={};
/* stances (keys in body units: metres / legS). Relaxed (FD_N): upright, feet apart, both weapons held low at the sides pointing
   forward. War (FD_W): left foot forward, knees bent, the right weapon raised by the shoulder, the left held out in front in guard.
   Hand targets as the revenant's: x,z in the torso's frame, y absolute, or {s:[dx,dy,dz]} from that shoulder */
const FD_N={HP:[0,-.03,0],h:[3,0,0],sp:[3,0,0],ch:[1,0,0],nk:[0,0,0],hd:[0,0,0],FL:[.2,.03,10,0,0],FR:[-.2,-.03,-10,0,0],
  gR:[-.62,.86,.1],dR:[-.05,-.35,.94],gL:[.62,.86,.1],dL:[.05,-.35,.94],fist:[95,95]};
const FD_W=wrP(FD_N,{HP:[0,-.1,0],h:[4,-18,0],sp:[5,-4,0],ch:[3,-6,0],FL:[.2,.22,-12,0,0],FR:[-.2,-.24,-40,0,0],
  gR:{s:[-.12,-.06,.5]},dR:[-.1,.8,-.55],gL:{s:[.06,-.34,.52]},dL:[.12,.6,.8]});
/* a flail in the right hand is not raised by the shoulder (its chain would hang on the shoulder) but held low in front in guard, as the left */
const FD_RF={gR:{s:[-.08,-.36,.52]},dR:[-.12,.6,.8]},fdWar=wR=>wR==='flail'?wrP(FD_W,FD_RF):FD_W;
function fdRig(wR,wL){const k=wR+'|'+wL;if(FD_RIG[k])return FD_RIG[k];const B=VB.fiend,m=buildFiend(1,{bare:true,weaponR:wR,weaponL:wL,horns:'bull'}),J={};m.traverse(q=>{if(q.userData.joint)J[q.name]=q;});
  const R={m,J,B,two:false,noHeel:true,W:{R:[],L:[]},wp:{R:m.getObjectByName('fd_wp_R'),L:m.getObjectByName('fd_wp_L')}},v=new THREE.Vector3();
  /* weapon meshes for the ground check: everything but a flail's chain and ball (the chain simulation keeps those up) */
  const inChain=q=>{while(q){if(/^fd_chain/.test(q.name))return true;q=q.parent;}return false;};
  for(const sd of['R','L'])R.wp[sd].traverse(q=>{if(q.isMesh&&!inChain(q))R.W[sd].push(q);});
  R.low=sd=>{let y=1e9;for(const q of R.W[sd]){const p=q.geometry.parameters;for(let i=0;i<8;i++){v.set((i&1?.5:-.5)*p.width,(i&2?.5:-.5)*p.height,(i&4?.5:-.5)*p.depth).applyMatrix4(q.matrixWorld);if(v.y<y)y=v.y;}}return y;};
  return FD_RIG[k]=R;}
function fiendClips(wR,wL,horns){const ck=wR+'|'+wL+'|'+horns;if(FD_CLIPS[ck])return FD_CLIPS[ck];const base=fdBaseClips(wR,wL),L=base.slice();L.chainRef=base.chainRef;fdFalls(L,wR,wL,horns);return FD_CLIPS[ck]=L;}
/* solver: the revenant's (rvSolver) on the fiend's rig; the solved wrists are put on the rig, then a weapon below the ground is tilted
   up about the level axis across it (binary search) and the frame solved again from the same continuity state */
function fdSolver(wR,wL){const R=fdRig(wR,wL),SV=rvSolver(R),V=THREE.Vector3,D2R=Math.PI/180,solve0=SV.solve;
  const put=s=>{for(const sd of['R','L']){const w=s['w'+sd];R.J['hand_'+sd].rotation.set(w[0]*D2R,w[1]*D2R,w[2]*D2R);}R.m.updateMatrixWorld(true);return s;};
  SV.solve=p0=>{const PP=SV.PP,PW=SV.PW&&JSON.parse(JSON.stringify(SV.PW));let p=p0,s=put(solve0(p));
    for(const sd of['R','L']){if(R.low(sd)>=.004)continue;const d0=new V(...p['d'+sd]).normalize(),ax=new V().crossVectors(d0,new V(0,1,0));if(ax.lengthSq()<1e-6)continue;ax.normalize();
      const at=a=>{SV.PP=PP;SV.PW=PW&&JSON.parse(JSON.stringify(PW));const q=Object.assign({},p);q['d'+sd]=d0.clone().applyAxisAngle(ax,a).toArray();s=put(solve0(q));return q;};
      let lo=0,hi=Math.PI*.5;for(let i=0;i<9;i++){const a=(lo+hi)/2;at(a);if(R.low(sd)>=.004)hi=a;else lo=a;}p=at(hi);}
    return s;};
  return SV;}
/* flail chain: a damped pendulum (the ball on a rod FD_LC from the pivot) driven by the pivot's path; the ball stays above the ground,
   out of a capsule round the torso and head and within 150° of the handle's line. rec: per frame {M: the weapon's world matrix (fd_wp), C: body
   capsules (fdCaps)}. The chain's world rotation is carried from frame to frame by the smallest turn (no flips), then made local to fd_wp.
   Loops: three cycles first, then the last one is bent to close on its first frame. One-shots: start from ref0 (or settle on the first frame), then
   blend in from ref0 and out to ref1 (the war idle's first frame), so clips join without a pop */
/* capsules [end, end, radius to the ball's centre] round the torso and head and round each arm, from the posed joints */
function fdCaps(J){const V=THREE.Vector3,w=n=>J[n].getWorldPosition(new V()),C=[[w('hips'),J.head.localToWorld(new V(0,.25,.1)),.62]];
  for(const sd of['L','R'])C.push([w('upperArm_'+sd),w('foreArm_'+sd),.38],[w('foreArm_'+sd),w('hand_'+sd),.36]);return C;}
function fdChainSim(rec,dur,o={}){const V=THREE.Vector3,Q=THREE.Quaternion,M4=THREE.Matrix4,n=rec.length,dt=dur/(n-1),sub=6,h=dt/sub,G=9.8,Y=new V(0,1,0);
  const PV=rec.map(r=>new V(0,FD_PIV,0).applyMatrix4(r.M)),AX=rec.map(r=>new V(0,1,0).transformDirection(r.M)),WQ=rec.map(r=>new Q().setFromRotationMatrix(new M4().extractRotation(r.M)));
  let X=PV[0].clone().add(o.ref0?Y.clone().applyQuaternion(WQ[0].clone().multiply(o.ref0)).multiplyScalar(FD_LC):new V(0,-FD_LC,0)),Xp=X.clone();
  const fix=(P,ax,C)=>{for(let it=0;it<3;it++){const d=X.clone().sub(P);if(d.lengthSq()<1e-8)d.set(0,-1,0);d.normalize();
      /* cone: at most 150° from the handle's line */
      const c=d.dot(ax),cm=Math.cos(150*Math.PI/180);if(c<cm){const pp=d.clone().addScaledVector(ax,-c);if(pp.lengthSq()<1e-8)pp.set(1,0,0).addScaledVector(ax,-ax.x);pp.normalize();d.copy(ax).multiplyScalar(cm).addScaledVector(pp,Math.sqrt(1-cm*cm));}
      X.copy(P).addScaledVector(d,FD_LC);
      /* body capsules (torso and head, both upper arms and forearms): the ball stays rc from each, the middle of the chain rc-.16 */
      for(const[A,N,rc]of C){const AN=N.clone().sub(A),near=Q=>A.clone().addScaledVector(AN,Math.max(0,Math.min(1,Q.clone().sub(A).dot(AN)/AN.lengthSq())));
        let Cp=near(X),e=X.clone().sub(Cp);if(e.lengthSq()<rc*rc){if(e.lengthSq()<1e-8)e.set(0,0,1);X.copy(Cp).addScaledVector(e.normalize(),rc);}
        const Md=X.clone().add(P).multiplyScalar(.5),rm=rc-.16;Cp=near(Md);e=Md.sub(Cp);const dm=e.length();if(dm<rm){if(dm<1e-4)e.set(0,0,1);X.addScaledVector(e.normalize(),2*(rm-dm));}}
      if(X.y<FD_BR)X.y=FD_BR;}};
  const stepTo=(i0,i1)=>{for(let s=1;s<=sub;s++){const u=s/sub,P=PV[i0].clone().lerp(PV[i1],u),ax=AX[i0].clone().lerp(AX[i1],u).normalize(),C=rec[i0].C.map((c,j)=>[c[0].clone().lerp(rec[i1].C[j][0],u),c[1].clone().lerp(rec[i1].C[j][1],u),c[2]]);
    const v=X.clone().sub(Xp).multiplyScalar(.985);Xp.copy(X);X.add(v);X.y-=G*h*h;fix(P,ax,C);}};
  if(o.loop){for(let c=0;c<3;c++)for(let i=1;i<n;i++)stepTo(i-1,i);}
  else if(!o.ref0){for(let i=0;i<60;i++)stepTo(0,0);}
  const dirs=[X.clone().sub(PV[0]).normalize()];for(let i=1;i<n;i++){stepTo(i-1,i);dirs.push(X.clone().sub(PV[i]).normalize());}
  /* world rotations by the smallest turn from frame to frame, local to fd_wp */
  let qw=new Q().setFromUnitVectors(Y,dirs[0].y<-.999?new V(1e-3,-1,0).normalize():dirs[0]);const QL=[];
  for(let i=0;i<n;i++){if(i)qw=new Q().setFromUnitVectors(dirs[i-1],dirs[i]).multiply(qw);QL.push(WQ[i].clone().invert().multiply(qw));}
  if(o.loop){const fixQ=QL[n-1].clone().invert().multiply(QL[0]);for(let i=0;i<n;i++)QL[i].multiply(new Q().slerp(fixQ,i/(n-1)));QL[n-1].copy(QL[0]);}
  else{const nb=Math.min(n-1,Math.round(.12/dt)),sm=x=>x*x*(3-2*x);
    if(o.ref0)for(let i=0;i<=nb;i++)QL[i]=o.ref0.clone().slerp(QL[i],sm(i/nb));
    if(o.ref1){const nb2=Math.min(n-1,Math.round(.35/dt));for(let i=n-1-nb2;i<n;i++)QL[i]=QL[i].clone().slerp(o.ref1,sm((i-(n-1-nb2))/nb2));}}
  const out=[];for(const q of QL)out.push(q.x,q.y,q.z,q.w);return out;}
function fdBaseClips(wR,wL){const ck=wR+'|'+wL;if(FD_BASE[ck])return FD_BASE[ck];const B=VB.fiend,D=Math.PI*2,S=Math.sin,C=Math.cos,L=[],SV=fdSolver(wR,wL),R=SV.R,W=SV.abs(fdWar(wR)),N=SV.abs(FD_N);
  const FL={R:wR==='flail',L:wL==='flail'},anyF=FL.R||FL.L,V=THREE.Vector3;let ref=null;
  const grab=()=>{const o={C:fdCaps(R.J)};for(const sd of['R','L'])if(FL[sd])o[sd]=R.wp[sd].matrixWorld.clone();return o;};
  /* loops are pre-rolled one full cycle, so the elbow and wrist continuity carry over the seam, and the last frame is the first */
  const CC=(name,dur,fn,o={})=>{SV.PP=SV.PW=null;if(o.loop){const n=Math.round(dur*30);for(let i=0;i<n;i++)SV.solve(fn(i/n*dur));}SV.miss={};let first=null,firstRec=null;const rec=[];
    const c=sampleClip(name,dur,t=>{if(o.loop&&first&&t>=dur-1e-6){rec.push(firstRec);return first;}const r=SV.solve(fn(t));if(anyF)rec.push(grab());if(!first){first=r;firstRec=rec[0];}return r;},Object.assign({autoFeet:false},o),B);
    c.rvMiss=SV.miss;SV.miss=null;if(o.next)c.next=o.next;
    if(anyF){const T=Array.from(c.tracks[0].times);for(const sd of['R','L'])if(FL[sd]){const q=fdChainSim(rec.map(x=>({M:x[sd],C:x.C})),dur,{loop:!!o.loop,ref0:o.loop?null:ref&&ref[sd],ref1:o.loop?null:ref&&ref[sd]});
      c.tracks.push(new THREE.QuaternionKeyframeTrack('fd_chain_'+sd+'.quaternion',T,q));if(o.war)(ref=ref||{})[sd]=new THREE.Quaternion(q[0],q[1],q[2],q[3]);}}
    L.push(c);return c;};
  const KC=(name,dur,keys,note,base=W,next='Idle (war mode)')=>{const K=keys.map(k=>[k[0],SV.abs(wrP(base,k[1]||{}))]),c=CC(name,dur,wrKeys(K),{note,next});return c;};
  const lift=(o,dy)=>{o.gR=[o.gR[0],o.gR[1]+dy,o.gR[2]];o.gL=[o.gL[0],o.gL[1]+dy,o.gL[2]];return o;};
  /* IK gait in place: planted feet slide back at one steady speed, swinging feet come forward lifted; the hands ride with the hips */
  const GAIT=(name,dur,G,note)=>{const fn=t=>{const u=t/dur,o=G.body(u),c2=C(D*(u-G.duty/2));o.HP=[G.sw*c2,G.y0-G.b*C(2*D*(u-G.duty/2)),G.z0||0];lift(o,o.HP[1]-G.y0);
      for(const[sd,off,x,yaw]of[['L',0,G.x,G.yaw[0]],['R',.5,-G.x,G.yaw[1]]]){const q=(((u+off)%1)+1)%1;let z,l,pt;
        if(q<G.duty){const v=q/G.duty;z=G.s*(1-2*v);l=0;pt=v<.15?-10*(1-v/.15):v>.7?G.toe*(v-.7)/.3:0;}
        else{const v=(q-G.duty)/(1-G.duty),sm=v*v*(3-2*v);z=-G.s+2*G.s*sm;l=G.lift*Math.sin(Math.PI*Math.pow(v,G.lp||1));pt=G.toe*(1-v)*(1-v)-12*v*v;}
        o['F'+sd]=[x,z+(sd==='L'?1:-1)*(G.st||0),yaw,l,pt];}return o;};
    const sp=2*G.s/(G.duty*dur)*B.legS,c=CC(name,dur,fn,{loop:true,note:`${note}, in place, ${sp.toFixed(1)} m/s`});c.speed=sp/B.legS;};
  /* arm swing in the gaits: a = +1 when the left foot is forward (the left hand swings back) */
  const swing=(o,a,amp)=>{o.gL=[o.gL[0],o.gL[1]+.03*Math.abs(a),o.gL[2]-amp*a];o.gR=[o.gR[0],o.gR[1]+.03*Math.abs(a),o.gR[2]+amp*a];return o;};

  /* ---- war mode first (its first frame is where every one-shot's chain starts and ends) ---- */
  CC('Idle (war mode)',2.8,t=>{const p=D*t/2.8,b=S(p),c=S(p+.6);return lift(wrP(W,{HP:[0,-.1-.008*b,0],sp:[5+.8*b,-4,0],ch:[3+1.4*b,-6,0],hd:[0,5*S(p),0],
    dR:[W.dR[0],W.dR[1],W.dR[2]+.05*c],dL:[.12,.6,.8+.05*c]}),-.012*c);},{loop:true,war:true,note:'Right weapon raised by the shoulder, left held out in guard'});
  GAIT('Walk (war mode)',1.3,{duty:.62,s:.24,lift:.09,toe:20,x:.2,yaw:[-8,-30],y0:-.12,b:.012,sw:.02,st:.04,
    body:u=>lift(wrP(W,{h:[5,-14-4*C(D*u),2*S(D*u)],sp:[6,-4,0],ch:[3,-6,0]}),.012*C(2*D*u))},'Guard up, steady advance');
  GAIT('Run (war mode)',.8,{duty:.4,s:.4,lift:.2,lp:.75,toe:30,x:.18,yaw:[-4,-14],y0:-.1,b:.026,sw:.018,
    body:u=>lift(wrP(W,{h:[14,-10-5*C(D*u),3*S(D*u)],sp:[9,-3,0],ch:[4,-5,0],hd:[-10,0,0],dR:FL.R?W.dR:[-.2,.8,-.5]}),.015*C(2*D*(u-.1)))},'Charging, both weapons ready');

  /* ---- relaxed ---- */
  CC('Idle',4.5,t=>{const p=D*t/4.5,b=S(p),b2=S(2*p);return wrP(N,{HP:[.008*b,-.03-.006*b2,0],h:[3,0,1.2*b],sp:[3+.8*b2,0,-.5*b],ch:[1+1.4*b2,2*S(p+.8),0],hd:[-2+2*S(2*p+1),18*S(p+.6),0],
    gR:[N.gR[0],N.gR[1]+.008*b2,N.gR[2]],gL:[N.gL[0],N.gL[1]+.008*b2,N.gL[2]],dR:[-.05,-.35,.94+.05*b],dL:[.05,-.35,.94-.05*b]});},{loop:true,note:'Breathing, looking around, both weapons held low'});
  GAIT('Walk',1.4,{duty:.62,s:.26,lift:.09,toe:18,x:.2,yaw:[8,-8],y0:-.05,b:.016,sw:.03,
    body:u=>{const yw=C(D*u),a=C(D*(u-.06));return swing(wrP(N,{h:[4,-6*yw,2.5*S(D*u)],sp:[3,2*yw,0],ch:[1,4*yw,0],hd:[0,-3*yw,0],gR:[-.63,.88,.12],gL:[.63,.88,.12]}),a,.12);}},'Heavy, swaggering strides, weapons low');
  GAIT('Run',.82,{duty:.42,s:.42,lift:.2,lp:.8,toe:28,x:.19,yaw:[5,-5],y0:-.09,b:.03,sw:.025,
    body:u=>{const yw=C(D*u),a=C(D*(u-.04));return swing(wrP(N,{h:[14,-8*yw,3*S(D*u)],sp:[6,3*yw,0],ch:[2,6*yw,0],hd:[-12,0,0],gR:[-.64,1.0,.26],dR:[-.1,.3,.95],gL:[.64,1.0,.26],dL:[.1,.3,.95]}),a,.22);}},'Pounding run, weapons forward');

  /* ---- attacks (hand targets from the shoulders) ---- */
  /* Attack 1: the right weapon chops diagonally down across the body; the left is lifted up out of its way */
  KC('Attack 1',1.35,[[0,{}],
    [.4,{HP:[0,-.12,-.04],h:[4,-36,0],sp:[4,-8,0],ch:[-2,-22,0],hd:[-6,0,0],gR:{s:[-.36,.4,.14]},dR:[0,.75,-.65],gL:{s:[.2,-.28,.36]},dL:[.2,.9,.3]}],
    [.56,{HP:[0,-.14,.06],h:[6,-16,0],sp:[5,-4,0],ch:[2,-6,0],FL:[.2,.36,-12,.06,0],gR:{s:[-.38,.32,.48]},dR:[0,.9,-.4],gL:{s:[.26,-.2,.3]},dL:[.25,.95,0]}],
    [.68,{HP:[0,-.17,.12],h:[6,4,0],sp:[6,4,0],ch:[6,16,0],FL:[.2,.44,-10,0,0],FR:[-.2,-.24,-30,0,0],gR:{s:[.16,-.06,.76]},dR:[0,.5,.87],gL:{s:[.3,-.2,.2]},dL:[.3,.95,-.1]}],
    [.84,{HP:[0,-.19,.12],h:[8,16,0],sp:[8,8,0],ch:[8,24,0],FL:[.2,.44,-10,0,0],FR:[-.2,-.24,-24,0,0],gR:{s:[.55,-.34,.55]},dR:[.55,-.05,.83],gL:{s:[.34,-.22,.12]},dL:[.35,.9,-.25]}],
    [1.05,{HP:[0,-.14,.04],h:[6,-8,0],ch:[4,-4,0],FL:[.2,.32,-12,.06,0],FR:[-.2,-.24,-36,0,0],gR:{s:[-.06,-.12,.6]},dR:[-.1,.85,.3],gL:{s:[.12,-.3,.44]},dL:[.15,.7,.7]}],
    [1.35,{}]],'Right weapon: diagonal chop from the right shoulder down across the body, with a step in');
  /* the right weapon held up out of the way: a flail points forward, so its chain hangs clear of the shoulder */
  const rf=k=>FL.R?Object.assign({},k,FD_RF):k;
  /* Attack 2: the left weapon chops diagonally from the left shoulder down to the right; the right stays raised */
  KC('Attack 2',1.35,[[0,{}],
    [.4,rf({HP:[0,-.12,-.04],h:[4,8,0],sp:[4,4,0],ch:[0,12,0],hd:[-4,-10,0],gL:{s:[.36,.4,.14]},dL:[0,.75,-.65],gR:{s:[-.2,-.06,.36]},dR:[-.2,.9,-.3]})],
    [.56,rf({HP:[0,-.14,.06],h:[6,-6,0],sp:[5,0,0],ch:[2,2,0],FL:[.2,.36,-12,.06,0],gL:{s:[.38,.32,.48]},dL:[0,.9,-.4],gR:{s:[-.24,-.06,.32]},dR:[-.25,.9,-.3]})],
    [.68,rf({HP:[0,-.17,.12],h:[6,-28,0],sp:[6,-6,0],ch:[6,-18,0],FL:[.2,.44,-10,0,0],gL:{s:[-.16,-.06,.76]},dL:[0,.5,.87],gR:{s:[-.3,-.08,.24]},dR:[-.3,.9,-.3]})],
    [.84,rf({HP:[0,-.19,.12],h:[8,-40,0],sp:[8,-10,0],ch:[8,-26,0],FL:[.2,.44,-10,0,0],gL:{s:[-.55,-.34,.55]},dL:[-.55,-.05,.83],gR:{s:[-.32,-.08,.14]},dR:[-.35,.9,-.25]})],
    [1.05,{HP:[0,-.14,.04],h:[6,-24,0],ch:[4,-8,0],FL:[.2,.32,-12,.06,0],gL:{s:[.06,-.26,.56]},dL:[.15,.8,.5]}],
    [1.35,{}]],'Left weapon: diagonal chop from the left shoulder down across the body, with a step in');
  /* Attack 3: both weapons raised overhead and chopped straight down together, side by side */
  KC('Attack 3',1.45,[[0,{}],
    [.46,{HP:[0,-.08,-.06],h:[-4,-10,0],sp:[-8,-2,0],ch:[-10,-4,0],hd:[-8,0,0],gR:{s:[0,.56,.28]},dR:[.1,.5,-.85],gL:{s:[0,.56,.28]},dL:[-.1,.5,-.85]}],
    [.62,{HP:[0,-.12,.06],h:[2,-8,0],sp:[0,-2,0],ch:[0,-2,0],FL:[.2,.38,-12,.05,0],gR:{s:[.03,.54,.5]},dR:[0,.95,.3],gL:{s:[-.03,.54,.5]},dL:[0,.95,.3]}],
    [.72,{HP:[0,-.2,.14],h:[10,-6,0],sp:[12,0,0],ch:[8,0,0],FL:[.2,.46,-10,0,0],gR:{s:[.08,.12,.76]},dR:[0,.5,.87],gL:{s:[-.08,.12,.76]},dL:[0,.5,.87]}],
    [.82,{HP:[0,-.26,.16],h:[14,-6,0],sp:[16,0,0],ch:[10,0,0],FL:[.2,.46,-10,0,0],gR:{s:[.1,-.44,.66]},dR:[0,-.15,1],gL:{s:[-.1,-.44,.66]},dL:[0,-.15,1]}],
    [1.05,{HP:[0,-.25,.15],h:[13,-6,0],sp:[15,0,0],ch:[10,0,0],FL:[.2,.46,-10,0,0],gR:{s:[.1,-.43,.66]},dR:[0,-.12,1],gL:{s:[-.1,-.43,.66]},dL:[0,-.12,1]}],
    [1.22,{HP:[0,-.14,.05],h:[6,-14,0],FL:[.2,.3,-12,.05,0],gR:{s:[-.12,-.12,.56]},dR:[-.1,.8,.3]}],
    [1.45,{}]],'Both weapons raised overhead and chopped straight down together');
  /* Attack 4: both weapons swung out wide, then swept in across the front, the right above the left */
  KC('Attack 4',1.45,[[0,{}],
    [.44,{HP:[0,-.13,-.05],h:[2,-14,0],sp:[0,-4,0],ch:[-4,-4,0],hd:[-4,0,0],gR:{s:[-.52,.06,.16]},dR:[-.5,.4,-.77],gL:{s:[.52,.06,.16]},dL:[.5,.4,-.77]}],
    [.6,{HP:[0,-.15,.06],h:[4,-14,0],sp:[4,-4,0],ch:[2,-4,0],FL:[.2,.38,-12,.05,0],gR:{s:[-.56,0,.42]},dR:[-.3,.6,.74],gL:{s:[.54,-.2,.42]},dL:[.3,.6,.74]}],
    [.72,{HP:[0,-.17,.12],h:[6,-14,0],sp:[6,-4,0],ch:[4,-4,0],FL:[.2,.44,-10,0,0],gR:{s:[0,0,.8]},dR:[.55,.3,.8],gL:{s:[-.06,-.34,.78]},dL:[-.55,.2,.8]}],
    [.84,{HP:[0,-.17,.12],h:[6,-14,0],sp:[6,-4,0],ch:[4,-4,0],FL:[.2,.44,-10,0,0],gR:{s:[.44,0,.7]},dR:[.9,.1,.4],gL:{s:[-.5,-.36,.64]},dL:[-.9,0,.4]}],
    [1.12,{HP:[0,-.13,.04],FL:[.2,.32,-12,.05,0],gR:{s:[-.14,-.12,.56]},dR:[-.2,.8,.2],gL:{s:[0,-.34,.58]}}],
    [1.45,{}]],'Both weapons swung out wide, then swept in together across the front, one above the other');
  KC('Heavy attack',2.1,[[0,{}],
    [.42,{HP:[0,-.34,-.04],h:[22,-10,0],sp:[16,-2,0],ch:[8,-4,0],hd:[-10,0,0],gR:{s:[-.14,-.28,.58]},dR:[0,.75,.65],gL:{s:[.14,-.28,.58]},dL:[0,.75,.65]}],
    [.64,{HP:[0,.08,.1],h:[-6,-10,0],sp:[-8,-2,0],ch:[-10,-4,0],hd:[-6,0,0],FL:[.2,.24,-12,.1,20],FR:[-.2,-.18,-40,.06,25],gR:{s:[-.04,.48,.38]},dR:[.1,.5,-.85],gL:{s:[.04,.48,.38]},dL:[-.1,.5,-.85]}],
    [.82,{HP:[0,.16,.2],h:[0,-8,0],sp:[0,-2,0],ch:[-4,-2,0],FL:[.2,.42,-12,.2,10],FR:[-.2,-.08,-40,.16,15],gR:{s:[0,.48,.56]},dR:[0,.95,.3],gL:{s:[0,.48,.56]},dL:[0,.95,.3]}],
    [.96,{HP:[0,-.24,.3],h:[16,-6,0],sp:[18,0,0],ch:[10,0,0],FL:[.2,.62,-10,0,0],FR:[-.2,-.02,-40,0,0],gR:{s:[.06,.07,.8]},dR:[0,.4,.92],gL:{s:[-.06,.07,.8]},dL:[0,.4,.92]}],
    [1.06,{HP:[0,-.31,.32],h:[26,-6,0],sp:[22,0,0],ch:[12,0,0],FL:[.2,.62,-10,0,0],FR:[-.2,-.02,-40,0,0],gR:{s:[.08,-.56,.62]},dR:[0,-.55,.85],gL:{s:[-.08,-.56,.62]},dL:[0,-.55,.85]}],
    [1.45,{HP:[0,-.31,.32],h:[26,-6,0],sp:[22,0,0],ch:[12,0,0],FL:[.2,.62,-10,0,0],FR:[-.2,-.02,-40,0,0],gR:{s:[.08,-.55,.62]},dR:[0,-.53,.85],gL:{s:[-.08,-.55,.62]},dL:[0,-.53,.85]}],
    [1.72,{HP:[0,-.2,.24],h:[10,-12,0],FL:[.2,.62,-10,0,0],FR:[-.2,-.02,-40,0,24],gR:{s:[-.14,-.14,.58]},dR:[-.1,.8,.4],gL:{s:[.02,-.32,.6]}}],
    [1.9,{HP:[0,-.12,.1],FR:[-.2,-.16,-40,.04,0]}],
    [2.1,{}]],'Crouches, leaps forward and smashes both weapons into the ground');
  KC('Block',1.4,[[0,{}],
    [.15,{HP:[0,-.18,-.04],h:[4,-14,0],sp:[6,-2,0],ch:[2,-4,0],hd:[10,0,0],gR:{s:[.1,.08,.658]},dR:[.15,.95,.15],gL:{s:[-.1,.08,.658]},dL:[-.15,.95,.15]}],
    [.5,{HP:[0,-.2,-.1],h:[2,-14,0],sp:[4,-2,0],ch:[0,-4,0],hd:[14,0,0],gR:{s:[.1,.06,.65]},dR:[.15,.95,.1],gL:{s:[-.1,.06,.65]},dL:[-.15,.95,.1]}],
    [.75,{HP:[0,-.19,-.05],h:[4,-14,0],sp:[6,-2,0],ch:[2,-4,0],hd:[11,0,0],gR:{s:[.1,.07,.656]},dR:[.15,.95,.15],gL:{s:[-.1,.07,.656]},dL:[-.15,.95,.15]}],
    [1.05,{HP:[0,-.18,-.04],h:[4,-14,0],sp:[6,-2,0],ch:[2,-4,0],hd:[10,0,0],gR:{s:[.1,.08,.658]},dR:[.15,.95,.15],gL:{s:[-.1,.08,.658]},dL:[-.15,.95,.15]}],
    [1.4,{}]],'Both weapons up side by side in front of the face, takes the blow and pushes back');

  /* ---- voice and gestures ---- */
  KC('Roar',2.8,[[0,{}],
    [.45,{HP:[0,-.2,-.02],h:[14,-14,0],sp:[16,-2,0],ch:[10,-4,0],hd:[6,0,0],gR:{s:[-.14,-.5,.44]},dR:[0,.3,.95],gL:{s:[.14,-.5,.44]},dL:[0,.3,.95]}],
    [.9,{HP:[0,-.08,0],h:[-4,-8,0],sp:[-8,0,0],ch:[-14,-2,0],nk:[-6,0,0],hd:[-24,0,0],gR:{s:[-.56,.32,.14]},dR:[0,1,0],gL:{s:[.56,.32,.14]},dL:[0,1,0]}],
    [1.4,{HP:[0,-.09,0],h:[-4,-8,2],sp:[-9,0,1],ch:[-15,-2,0],nk:[-6,0,0],hd:[-26,4,0],gR:{s:[-.57,.33,.12]},dR:[0,1,0],gL:{s:[.57,.33,.12]},dL:[0,1,0]}],
    [1.95,{HP:[0,-.08,0],h:[-4,-8,-2],sp:[-8,0,-1],ch:[-14,-2,0],nk:[-6,0,0],hd:[-24,-4,0],gR:{s:[-.56,.32,.14]},dR:[0,1,0],gL:{s:[.56,.32,.14]},dL:[0,1,0]}],
    [2.8,{}]],'Arms and weapons flung wide and up, head thrown back');
  /* Taunt: like a bull before the charge: lowers its head, horns forward, weapons held out low, and paws the ground twice with the
     right hoof, scraping it back; then snorts with the head tossed up */
  {const T={HP:[0,-.16,0],h:[14,-12,0],sp:[10,-2,0],ch:[6,-4,0],nk:[6,0,0],hd:[18,0,0],gR:{s:[-.36,-.52,.4]},dR:[-.45,-.25,.86],gL:{s:[.36,-.52,.4]},dL:[.45,-.25,.86]};
  KC('Taunt',3.2,[[0,{}],
    [.45,T],
    [.75,wrP(T,{FR:[-.2,-.06,-30,.12,15]})],
    [.95,wrP(T,{FR:[-.2,-.02,-30,.0,15]})],
    [1.3,wrP(T,{FR:[-.2,-.48,-30,.0,25]})],
    [1.55,wrP(T,{FR:[-.2,-.06,-30,.12,15]})],
    [1.75,wrP(T,{FR:[-.2,-.02,-30,.0,15]})],
    [2.1,wrP(T,{FR:[-.2,-.46,-30,.0,25]})],
    [2.4,wrP(T,{HP:[0,-.12,0],h:[6,-12,0],sp:[0,-2,0],ch:[-4,-4,0],nk:[-4,0,0],hd:[-16,0,0],FR:[-.2,-.3,-36,.0,10]})],
    [3.2,{}]],'Lowers its head like a bull, horns forward, and paws the ground twice with a hoof, then tosses its head up');}

  /* ---- reactions ---- */
  KC('Hit 1',.8,[[0,{}],
    [.1,{HP:[0,-.1,-.07],h:[-6,-22,0],sp:[-12,-4,0],ch:[-16,-6,0],hd:[-16,0,0],gR:{s:[-.3,.06,.4]},dR:[-.4,.8,-.3],gL:{s:[.1,-.24,.48]},dL:[.3,.7,.5]}],
    [.32,{HP:[0,-.11,-.04],h:[0,-20,0],sp:[-2,-4,0],ch:[-4,-6,0],hd:[-4,0,0],gR:{s:[-.18,-.02,.48]},gL:{s:[.06,-.32,.52]}}],
    [.8,{}]],'Blow to the chest, rocks back');
  KC('Hit 2',.9,[[0,{}],
    [.12,{HP:[.05,-.12,-.02],h:[2,-36,8],sp:[2,-10,10],ch:[-4,-20,12],hd:[-6,-18,14],gR:{s:[-.3,-.06,.4]},dR:[-.5,.75,-.3],gL:{s:[.12,-.4,.44]},dL:[.5,.4,.75]}],
    [.36,{HP:[.02,-.11,0],h:[3,-28,3],sp:[4,-6,4],ch:[0,-12,5],hd:[-2,-6,5],gR:{s:[-.18,-.04,.5]},gL:{s:[.06,-.36,.52]}}],
    [.9,{}]],'Blow from the left, twists and bends away');
  KC('Heavy hit',1.7,[[0,{}],
    [.12,{HP:[0,-.08,-.1],h:[-14,-24,0],sp:[-16,-4,0],ch:[-18,-6,0],hd:[-20,0,4],gR:{s:[-.36,.14,.26]},dR:[0,1,0],gL:{s:[.24,-.1,.4]},dL:[0,.8,.6]}],
    [.3,{HP:[0,-.12,-.25],h:[-8,-22,0],sp:[-8,-4,0],ch:[-10,-6,0],hd:[-8,0,0],FR:[-.21,-.48,-42,.09,0],gR:{s:[-.3,.06,.38]},gL:{s:[.14,-.2,.46]}}],
    [.48,{HP:[0,-.2,-.38],h:[8,-22,0],sp:[10,-4,0],ch:[4,-6,0],hd:[4,0,0],FR:[-.22,-.62,-42,0,0],gR:{s:[-.2,-.04,.5]},gL:{s:[.06,-.32,.52]}}],
    [.64,{HP:[0,-.16,-.4],FL:[.18,-.04,-15,.07,0],FR:[-.22,-.62,-42,0,0]}],
    [.8,{HP:[0,-.12,-.42],FL:[.19,-.2,-12,0,0],FR:[-.22,-.62,-42,0,0]}],
    [1.06,{HP:[0,-.1,-.25],FL:[.19,0,-12,.06,0],FR:[-.22,-.62,-42,0,0]}],
    [1.2,{HP:[0,-.1,-.18],FL:[.2,.2,-12,0,0],FR:[-.22,-.62,-42,0,0]}],
    [1.4,{HP:[0,-.1,-.08],FR:[-.21,-.42,-41,.06,0]}],
    [1.55,{}],[1.7,{}]],'Knocked back two heavy steps, then steps in again');
  /* the viewer lists the clips in this order */
  const order=['Idle','Walk','Run','Idle (war mode)','Walk (war mode)','Run (war mode)'];L.sort((a,b)=>{const ia=order.indexOf(a.name),ib=order.indexOf(b.name);return(ia<0?99:ia)-(ib<0?99:ib);});
  FD_BASE[ck]=L;L.chainRef=ref;return L;}

/* Death: keyed joint angles (gbDeathKeys) on a bare fiend dropped onto its lowest point every frame (the oni's method): it recoils,
   sinks onto its knees, lets both weapons fall flat beside it and pitches forward face down. The weapons get their own tracks
   (fd_wpn_R/L, relative to the sockets); a flail's chain keeps swinging as it falls and comes to rest on the ground */
function fdFalls(L,wR,wL,horns){const B=VB.fiend,k=B.legS,V=THREE.Vector3,Q=THREE.Quaternion,M4=THREE.Matrix4,D2R=Math.PI/180,SV=fdSolver(wR,wL);
  SV.PP=SV.PW=null;const S0=SV.solve(SV.abs(fdWar(wR))),K0={X:[S0.pos[0]*k,S0.pos[2]*k],anc:[1,1],flat:[0,0]};
  const CH=['h','sp','ch','nk','hd','tL','kL','aL','tR','kR','aR','uL','fL','wL','uR','fR','wR','fist'];for(const c of CH)K0[c]=S0[c].slice();
  const M=buildFiend(1,{bare:true,weaponR:wR,weaponL:wL,horns}),JN={};M.traverse(q=>{if(q.userData.joint)JN[q.name]=q;});
  const WG={R:M.getObjectByName('fd_wpn_R'),L:M.getObjectByName('fd_wpn_L')},WP={R:M.getObjectByName('fd_wp_R'),L:M.getObjectByName('fd_wp_L')},isW=q=>{while(q){if(q.userData.gear)return true;q=q.parent;}return false;};
  const inChain=q=>{while(q){if(/^fd_chain/.test(q.name))return true;q=q.parent;}return false;},body=[];M.traverse(q=>{if(q.isMesh&&!isW(q))body.push(q);});
  const corner=new V(),cornersW=list=>{const out=[];for(const q of list){const p=q.geometry.parameters;for(let i=0;i<8;i++)out.push(new V((i&1?.5:-.5)*p.width,(i&2?.5:-.5)*p.height,(i&4?.5:-.5)*p.depth).applyMatrix4(q.matrixWorld));}return out;};
  const lowest=()=>{let y=1e9;for(const q of body){const p=q.geometry.parameters;for(let i=0;i<8;i++){corner.set((i&1?.5:-.5)*p.width,(i&2?.5:-.5)*p.height,(i&4?.5:-.5)*p.depth).applyMatrix4(q.matrixWorld);if(corner.y<y)y=corner.y;}}return y;};
  const pose=p=>{const P={};for(const c in p)if(JALIAS[c])P[JALIAS[c]]=p[c];const f=p.fist;P.fingers_L=[0,0,-f[0]];P.fingerTips_L=[0,0,-f[0]*.95];P.thumb_L=[f[0]*.15,0,-f[0]*.35];P.fingers_R=[0,0,f[1]];P.fingerTips_R=[0,0,f[1]*.95];P.thumb_R=[f[1]*.15,0,f[1]*.35];
    for(const j of RIG_JOINTS){const b=BASEPOSE[j]||[0,0,0],v=P[j]||[0,0,0];JN[j].rotation.set((b[0]+v[0])*D2R,(b[1]+v[1])*D2R,(b[2]+v[2])*D2R);}};
  const feet=()=>({L:JN.foot_L.getWorldPosition(new V()),R:JN.foot_R.getWorldPosition(new V())});
  /* a held weapon that would go into the ground (kneeling, falling) is turned up about the grip, round the level axis across it */
  const WM={R:[],L:[]};for(const sd of['R','L'])WG[sd].traverse(q=>{if(q.isMesh&&!inChain(q))WM[sd].push(q);});
  const lowAt=(sd,Mw)=>{let y=1e9;const m=new M4();for(const q of WM[sd]){m.copy(Mw);const chain=[];let z=q;while(z&&z!==WG[sd]){chain.unshift(z);z=z.parent;}for(const c of chain)m.multiply(c.matrix);
      const p=q.geometry.parameters;for(let i=0;i<8;i++){corner.set((i&1?.5:-.5)*p.width,(i&2?.5:-.5)*p.height,(i&4?.5:-.5)*p.depth).applyMatrix4(m);if(corner.y<y)y=corner.y;}}
    if((sd==='R'?wR:wL)==='flail'){const pv=new V(0,FD_PIV,0).applyMatrix4(m.copy(Mw).multiply(WP[sd].matrix));y=Math.min(y,pv.y-.06);}return y;};
  const liftHeld=(sd,Mw)=>{if(lowAt(sd,Mw)>=.004)return null;const p0=new V().setFromMatrixPosition(Mw),d=new V(0,0,1).transformDirection(Mw),ax=new V().crossVectors(d,new V(0,1,0));if(ax.lengthSq()<1e-6)return null;ax.normalize();
    const at=a=>{const R4=new M4().makeRotationAxis(ax,a),m=new M4().makeTranslation(p0.x,p0.y,p0.z).multiply(R4).multiply(new M4().makeTranslation(-p0.x,-p0.y,-p0.z)).multiply(Mw);return m;};
    let lo=0,hi=Math.PI*.6;for(let i=0;i<10;i++){const a=(lo+hi)/2;if(lowAt(sd,at(a))>=.004)hi=a;else lo=a;}return at(hi);};
  const FC=(name,dur,f,note,wpn)=>{let ref=null,full=[0,0];
    const fn=t=>{const p=f(t);
      for(const[i,sd]of[[0,'L'],[1,'R']]){const w=p.flat[i];if(w>0){const a=p['a'+sd].slice();a[0]=a[0]*(1-w)-(p.h[0]+p['t'+sd][0]+p['k'+sd][0])*w;p['a'+sd]=a;}}
      pose(p);JN.hips.position.set(p.X[0],B.hipH,p.X[1]);M.updateMatrixWorld(true);const ft=feet();if(!ref)ref={L:ft.L.clone(),R:ft.R.clone()};
      const wsum=p.anc[0]+p.anc[1];let cx=0,cz=0;if(wsum>1e-3){for(const[i,sd]of[[0,'L'],[1,'R']]){cx+=p.anc[i]*(ref[sd].x-ft[sd].x);cz+=p.anc[i]*(ref[sd].z-ft[sd].z);}cx/=wsum;cz/=wsum;}
      const w=Math.min(1,Math.max(p.anc[0],p.anc[1]));if(w>.999)full=[cx,cz];const X=[p.X[0]+w*cx+(1-w)*full[0],p.X[1]+w*cz+(1-w)*full[1]];
      JN.hips.position.set(X[0],B.hipH,X[1]);M.updateMatrixWorld(true);const y=.005-lowest();JN.hips.position.y=B.hipH+y;M.updateMatrixWorld(true);
      const out={};for(const c in p)if(JALIAS[c]||c==='fist')out[c]=p[c];out.pos=[X[0]/k,y/k,X[1]/k];out.X=X;return out;};
    const c=sampleClip(name,dur,fn,{autoFeet:false,note,fps:60},B),T=Array.from(c.tracks[0].times);
    /* second pass (same order, so the foot anchoring repeats exactly): the weapons in their sockets' frames, and the flails' chains */
    const PW={R:[],L:[]},QW={R:[],L:[]},rec={R:[],L:[]},inv=new M4(),pp=new V(),qq=new Q(),ss=new V();
    T.forEach(t=>{fn(t);const Cs=fdCaps(JN);
      for(const sd of['R','L']){const so=WG[sd].parent,Wm=wpn(t,sd)||liftHeld(sd,so.matrixWorld),Wx=Wm||so.matrixWorld.clone();
        if(!Wm){PW[sd].push(0,0,0);QW[sd].push(0,0,0,1);}else{inv.copy(so.matrixWorld).invert().multiply(Wm).decompose(pp,qq,ss);PW[sd].push(pp.x,pp.y,pp.z);QW[sd].push(qq.x,qq.y,qq.z,qq.w);}
        rec[sd].push({M:Wx.multiply(WP[sd].matrix),C:Cs});}});
    for(const sd of['R','L']){c.tracks.push(new THREE.VectorKeyframeTrack('fd_wpn_'+sd+'.position',T,PW[sd]),new THREE.QuaternionKeyframeTrack('fd_wpn_'+sd+'.quaternion',T,QW[sd]));
      if((sd==='R'?wR:wL)==='flail')c.tracks.push(new THREE.QuaternionKeyframeTrack('fd_chain_'+sd+'.quaternion',T,fdChainSim(rec[sd],dur,{ref0:L.chainRef&&L.chainRef[sd]})));}
    L.push(c);return{c,fn};};
  /* resting place of a dropped weapon: lying the way it pointed, a flat side down, pushed a little out from the body, lowest corner on the ground */
  const restOf=(sd,Mw)=>{const p0=new V(),q0=new Q(),s0=new V();Mw.decompose(p0,q0,s0);
    const Lh=new V(0,0,1).applyQuaternion(q0).setY(0);if(Lh.lengthSq()<1e-4)Lh.set(0,0,1);Lh.normalize();const U=new V(0,new V(1,0,0).applyQuaternion(q0).y>=0?1:-1,0);
    const q=new Q().setFromRotationMatrix(new M4().makeBasis(U,new V().crossVectors(Lh,U),Lh));
    const hip=JN.hips.getWorldPosition(new V()),out=new V(p0.x-hip.x,0,p0.z-hip.z);if(out.lengthSq()<1e-4)out.set(sd==='L'?1:-1,0,0);out.normalize();
    const probe=WG[sd].clone(),list=[];probe.position.set(p0.x,0,p0.z).addScaledVector(out,.3);probe.quaternion.copy(q);probe.updateMatrixWorld(true);probe.traverse(z=>{if(z.isMesh&&!inChain(z))list.push(z);});
    let lo=1e9;for(const c of cornersW(list))lo=Math.min(lo,c.y);probe.position.y+=.002-lo;probe.updateMatrix();return probe.matrix.clone();};
  const lerpM=(A,Bm,s)=>{const pa=new V(),qa=new Q(),pb=new V(),qb=new Q(),sc=new V();A.decompose(pa,qa,sc);Bm.decompose(pb,qb,sc);return new M4().compose(pa.lerp(pb,s),qa.slerp(qb,s),new V(1,1,1));};
  const ss=s=>s*s*(3-2*s);
  /* the head comes to rest face down; bull horns reach down past the face, so the head is lifted back a little */
  const bull=horns==='bull',tRel={R:1.05,L:1.13},death=gbDeathKeys(K0,[
    [.18,{sp:[-8,0,0],ch:[-14,0,0],nk:[-6,0,0],hd:[-18,0,6]},'out'],
    [.55,{h:[10,-10,0],sp:[8,0,0],ch:[10,0,0],nk:[6,0,0],hd:[4,0,8],tL:[-30,0,4],kL:[60,0,0],tR:[-26,0,-6],kR:[56,0,0],uL:[-30,0,14],fL:[-40,0,0],uR:[-30,0,-14],fR:[-40,0,0]}],
    [.9,{h:[12,-4,0],sp:[14,0,0],ch:[16,0,0],nk:[8,0,0],hd:[10,0,8],tL:[-16,0,4],kL:[104,0,0],tR:[-12,0,-4],kR:[102,0,0],flat:[0,0],aL:[44,0,0],aR:[44,0,0],anc:[0,0],X:[0,.1],
      uL:[-14,0,18],fL:[-30,0,0],uR:[-14,0,-18],fR:[-30,0,0]},'io'],
    [1.0,{h:[16,-4,0]},'out'],
    [1.25,{uL:[-6,0,24],fL:[-12,0,0],wL:[40,80,0],uR:[-6,0,-24],fR:[-12,0,0],wR:[40,-80,0]}],
    [1.55,{h:[50,-2,-4],sp:[16,0,-4],ch:[14,0,0],nk:[-4,0,0],hd:[-6,14,0],tL:[-30,0,6],kL:[70,0,0],tR:[-26,0,-6],kR:[68,0,0],X:[0,.3],uL:[-80,0,20],fL:[-40,0,0],uR:[-80,0,-20],fR:[-40,0,0]},'in'],
    [1.82,{h:[90,0,-4],sp:[2,0,-2],ch:[0,0,0],nk:[-14,0,0],hd:[-12,0,0],tL:[-6,4,6],kL:[14,0,0],tR:[-6,-4,-6],kR:[14,0,0],aL:[50,0,0],aR:[50,0,0],X:[0,.85],
      uL:[-20,0,24],fL:[-20,0,0],uR:[-20,0,-24],fR:[-20,0,0]},'in'],
    [1.92,{h:[87,0,-4]},'out'],
    [2.7,{h:[90,0,-4],nk:[bull?-20:2,0,0],hd:[bull?-15:4,0,0],tL:[-4,4,6],kL:[10,0,0],tR:[-4,-4,-6],kR:[8,0,0],uL:[4,0,30],fL:[-12,0,0],wL:[0,-90,0],uR:[6,0,-30],fR:[-10,0,0],wR:[0,90,0]},'out']]);
  /* the weapons: captured where the hands let go, then a fall under gravity, turning to lie flat */
  const drop={};for(const sd of['R','L']){const pr0=FC('_probe',tRel[sd],death,'',()=>null);L.pop();pr0.fn(tRel[sd]);const A=liftHeld(sd,WG[sd].parent.matrixWorld)||WG[sd].parent.matrixWorld.clone(),R0=restOf(sd,A),pa=new V().setFromMatrixPosition(A),pr=new V().setFromMatrixPosition(R0);
    drop[sd]={A,R0,pa,pr,tl:Math.max(.2,Math.sqrt(2*Math.max(0,pa.y-pr.y)/9.8))};}
  const dropW=(t,sd)=>{const d=drop[sd],tau=t-tRel[sd];if(tau<=0)return null;if(tau>=d.tl)return d.R0.clone();const m=lerpM(d.A,d.R0,ss(tau/d.tl));m.elements[13]=Math.max(d.pr.y,d.pa.y-4.9*tau*tau);return m;};
  FC('Death',2.7,death,'Recoils, sinks onto its knees, lets both weapons fall and pitches forward face down',dropW);}

ASSETS.push({id:'fiend',folder:'characters/enemies/hell',name:'Fiend',kind:'character',variants:true,defaultSeed:1,groundR:3.6,build:(s,o)=>buildFiend(s,o||{}),
  opts:[{key:'weaponR',label:'Right hand',choices:[['random','Random'],['sword','Long sword'],['axe','Double axe'],['flail','Flail']],def:'random'},
    {key:'weaponL',label:'Left hand',choices:[['random','Random'],['sword','Long sword'],['axe','Double axe'],['flail','Flail']],def:'random'},
    {key:'horns',label:'Horns',choices:[['random','Random'],['bull','Bull'],['ram','Ram'],['swept','Swept back']],def:'random'},
    {key:'skin',label:'Skin',choices:[['random','Random'],['crimson','Crimson'],['blood','Dark red'],['charcoal','Charcoal'],['violet','Violet']],def:'random'}],
  desc:'Fiend: a strong horned devil, about 3 m tall, with no wings: a muscular body (crimson, dark red, charcoal or violet skin), a spiked iron pauldron on the left shoulder, a leather baldric, iron bracers, a dark red loin wrap under a studded belt with a horned skull buckle, goat legs in shaggy fur, bending back at the hock, and cloven hooves. A devil\'s head with a long pointed face, a sly fanged grin, glowing eyes, long swept-back ears and big horns (bull, ram or swept back), sometimes a goatee and slicked-back hair. A weapon in each hand, chosen per hand, all with about the same reach: a long sword with a glowing fuller, a double axe or a flail with a swinging chain and spiked ball. Clips: Idle, Walk, Run, war-mode Idle, Walk and Run, Attack 1 (right chop), Attack 2 (left chop), Attack 3 (both chopped down), Attack 4 (both swept in from the sides), Heavy attack (leaps and smashes both into the ground), Block, Roar, Taunt (paws the ground like a bull), Hit 1, Hit 2, Heavy hit and Death.'});
