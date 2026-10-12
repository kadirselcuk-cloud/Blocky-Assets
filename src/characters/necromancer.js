/* ======================= NECROMANCER: a boss, a gothic sorceress with a skull staff =======================
   A tall, pale woman (VB.necro: the villager female's proportions with longer legs, about 1.8 m) in a black corset and a long gown
   slit up the right leg, thigh-high heeled boots, long black gloves with pointed silver nails, a bone pauldron with spikes on the
   left shoulder, a choker with a glowing gem and long straight hair with a blunt fringe. Glowing eyes in smoky make-up, dark lips,
   black veins at the temples and the neck; a headpiece (horns, crown of thorns or a skull diadem). A two-metre staff topped by a
   skull (horned, caged in bone claws, or under a crescent) in the right hand; a soul flame (orb_L) grows in the left palm.
   Built from its own meshes on the villager's 25 joints inside a body group (vbody), so the warrior's IK (wrSolve) fits unchanged.
   Clips use the vampire's arm machinery (hand targets in the torso's frame, keyed wrists, elbow poles by a cost search); the
   staff is carried, never aimed: the right elbow is chosen so that the straight wrist already points the staff where it should go
   (the lich's carried staff) and the staff never goes below the ground. After the clips are made the gown (16 panels round the
   hips, ncSkirtTracks) is laid over the legs every frame and the hair is laid by the wight's wtHairTracks, both baked into tracks,
   so they move the same in the GLB. Effects: a circle of runes on the ground (ncircle), a ring of soul fire (nnova), smoke for
   Vanish, Reappear and Death (nsmoke_*). */
VB.necro=Object.assign({},VB.female,{thigh:.44,shin:.42,g:.95,sex:'female'});
{const b=VB.necro;b.key='necro';b.hipH=b.thigh+b.shin+b.ankle+b.hipOff;b.legS=(b.thigh+b.shin)/.84;b.tS=(b.spine+b.chest)/.3;b.cS=b.neck/.22;}
const NC_SKIN={porcelain:['#ece2e2','porcelain'],ashen:['#d0cacc','ashen'],lilac:['#d6cada','grey-lilac']};
const NC_HAIR={black:['#141118','raven black'],white:['#d6d4dc','silver-white'],red:['#56101a','blood red']};
const NC_EYES={green:['#d8ffcc','#36ff62','green'],violet:['#f0d8ff','#b040ff','violet'],ice:['#d8f0ff','#48b4ff','icy blue'],red:['#ffc0b0','#ff2a14','red']};
const NC_GOWN={black:['#1a171e','black'],purple:['#36183e','deep purple'],red:['#4c0e18','blood red'],green:['#16281e','grave green']};
const NC_HEAD={horns:'curved black horns',thorns:'a crown of black thorns',skull:'a silver diadem with a small skull'};
const NC_STAFF={horned:'a horned skull',caged:'a skull caged in bone claws',crescent:'a skull under a black crescent'};
/* gown: NC_SK panels round the hips (angle round the waist, 0 = front), upper part NC_L1 long, lower part NC_L2 (the hem about 0.1 m
   above the ground). The front panel over the right leg stops high: the slit. a0 = the gown's flare when nothing pushes it */
const NC_SK=16,NC_L1=.4,NC_L2=.36,NC_SLIT=[-18,-40],NC_A0=[4,9];
const NC_PUFFM={};
function ncSmokeMat(hex,op){const k=hex+op;return NC_PUFFM[k]||(NC_PUFFM[k]=new THREE.MeshStandardMaterial({map:pxTex('plain'),color:new THREE.Color(hex).convertSRGBToLinear(),transparent:true,opacity:op,roughness:1,depthWrite:false}));}
/* a box from point a to point b (parent's frame) */
function ncSeg(par,a,b,w,d,m){const V=THREE.Vector3,A=new V(...a),Bv=new V(...b),D=Bv.clone().sub(A),mesh=bx(par,w,D.length(),d,m,(A.x+Bv.x)/2,(A.y+Bv.y)/2,(A.z+Bv.z)/2);
  mesh.quaternion.setFromUnitVectors(new V(0,1,0),D.normalize());return mesh;}
/* a curved horn through the points P, tapering from w0 to w1 */
function ncHorn(par,P,w0,w1,m,mD){for(let i=0;i<P.length-1;i++){const w=w0+(w1-w0)*i/(P.length-2);ncSeg(par,P[i],P[i+1],w,w,i%2?mD:m);}}

/* staff: grip at the origin, foot at -1, the skull about 1 above the grip. Its +x (where the fingers point) is where the skull looks,
   +y runs up the staff (socket +z through SH_BASIS) */
function ncStaff(kind,eyeM,gemM){const w=new THREE.Group(),wd=bm('#1c161c','leather'),wdD=bm('#0e0b10','leather'),wrap=bm('#3a1a24','leather'),sv=bm('#a8acb8','plain'),svD=bm('#62646e','plain');
  const bn=bm('#ddd3bc','plain'),bnD=bm('#a89c84','plain'),dk=bm('#100c0c','plain');
  /* twisted black shaft in short segments, silver bands, a silver spike at the foot, a wine-red grip */
  for(let i=0;i<9;i++){const y0=-.94+i*.2,y1=Math.min(.78,y0+.21);if(y0>=.78)break;bx(w,.042,y1-y0,.042,i%2?wdD:wd,0,(y0+y1)/2,0,0,i*.35,0);}
  bx(w,.05,.04,.05,sv,0,-.94,0);bx(w,.03,.05,.03,svD,0,-.975,0);for(const y of[-.62,-.3,.24,.55])bx(w,.05,.02,.05,svD,0,y,0);bx(w,.052,.18,.052,wrap,0,0,0);for(const y of[-.09,.09])bx(w,.056,.016,.056,sv,0,y,0);
  bx(w,.062,.05,.062,sv,0,.78,0);bx(w,.08,.024,.08,svD,0,.81,0);
  /* the skull, looking along +x */
  const skull=(y,sc)=>{const g=new THREE.Group();g.position.y=y;g.scale.setScalar(sc);w.add(g);
    bx(g,.15,.14,.15,bn,0,.02,0);bx(g,.12,.03,.13,bn,0,.1,0);bx(g,.05,.08,.12,bn,.06,-.05,0);
    for(const z of[-.034,.034]){bx(g,.012,.04,.042,dk,.076,.02,z);bx(g,.006,.018,.02,eyeM,.081,.02,z);}bx(g,.012,.026,.018,dk,.076,-.02,0);
    bx(g,.03,.02,.09,bnD,.07,-.07,0);for(let i=-2;i<=2;i++)bx(g,.008,.022,.006,dk,.085,-.07,i*.018);bx(g,.09,.03,.1,bnD,.02,-.1,0);bx(g,.07,.04,.03,bn,-.02,-.08,0);
    return g;};
  if(kind==='horned'){const g=skull(.93,1.15);for(const s of[-1,1])ncHorn(g,[[-.01,.07,s*.07],[-.02,.12,s*.13],[-.06,.13,s*.18],[-.1,.08,s*.2],[-.08,.02,s*.2],[-.03,.0,s*.18],[0,.03,s*.15]],.05,.022,bnD,bn);}
  else if(kind==='caged'){skull(.95,1.05);
    /* four black bone claws rising from the collar round the skull, their tips curling in over it */
    for(const[x,z]of[[1,0],[-1,0],[0,1],[0,-1]])ncHorn(w,[[x*.03,.8,z*.03],[x*.1,.88,z*.1],[x*.12,.98,z*.12],[x*.1,1.08,z*.1],[x*.05,1.13,z*.05]],.03,.016,wdD,wd);
    bx(w,.03,.03,.03,gemM,0,1.15,0,0,Math.PI/4,0);}
  else{skull(.93,1.05);
    /* a black crescent standing behind the skull, horns up, with a glowing gem in its middle */
    const P=[];for(let i=0;i<=8;i++){const a=-Math.PI*.42+i*Math.PI*.84/8;P.push([-.06,1.0-Math.cos(a)*.17+.02,Math.sin(a)*.2]);}ncHorn(w,P,.045,.045,wdD,wd);
    for(const s of[-1,1])bx(w,.03,.03,.03,wd,-.06,1.02-Math.cos(Math.PI*.42)*.17+.04,s*Math.sin(Math.PI*.42)*.2);bx(w,.035,.035,.035,gemM,-.06,.85,0,Math.PI/4,0,0);}
  return w;}

function buildNecromancer(seed,o={}){const B=VB.necro,r=mulberry32(((seed*2654435761)>>>0)^0x6e3c),pick=a=>a[Math.floor(r()*a.length)],root=new THREE.Group();root.userData.lights=[];
  /* roll everything, then let the options override */
  const skin0=pick(Object.keys(NC_SKIN)),hair0=pick(['black','black','black','white','red']),eye0=pick(['green','green','violet','ice','red']),gown0=pick(Object.keys(NC_GOWN)),head0=pick(Object.keys(NC_HEAD)),staff0=pick(Object.keys(NC_STAFF));
  const opt=(k,d)=>o[k]&&o[k]!=='random'?o[k]:d,skinK=opt('skin',skin0),hairK=opt('hair',hair0),eyeK=opt('eyes',eye0),gownK=opt('gown',gown0),headK=opt('head',head0),staffK=opt('staff',staff0);
  const shade=(h,f)=>'#'+new THREE.Color(h).multiplyScalar(f).getHexString(),SK=NC_SKIN[skinK][0],HC=NC_HAIR[hairK][0],GC=NC_GOWN[gownK][0];
  const skin=bm(SK,'skin'),skinD=bm(shade(SK,.84),'skin'),vein=bm('#3a2a44','plain'),hair=bm(HC,'hair'),hairS=bm(shade(HC,hairK==='white'?.88:1.35),'hair'),hairD=bm(shade(HC,.7),'hair');
  const dark=bm('#0e0a0e','plain'),smoky=bm('#2a1c2c','plain'),lip=bm('#5c1430','plain'),lipD=bm('#3a0c1e','plain'),teeth=bm('#ece6da','plain'),gown=bm(GC,'cloth'),gownD=bm(shade(GC,.6),'cloth'),corset=bm('#141016','leather'),corsetL=bm('#2c2430','leather');
  const glove=bm('#121014','leather'),gloveT=bm(shade(GC,.9),'cloth'),boot=bm('#141114','leather'),bootD=bm('#08070a','leather'),silver=bm('#b4b8c4','plain'),silverD=bm('#6a6c78','plain'),bone=bm('#ddd3bc','plain'),boneD=bm('#a89c84','plain'),horn=bm('#1a161a','plain'),hornD=bm('#2c2630','plain');
  const ey=NC_EYES[eyeK],eyeM=wrGlow(ey[0],ey[1],1.8,pxTex('plain')),gemM=wrGlow(ey[0],ey[1],1.5,pxTex('plain')),soul=wrGlow(ey[0],ey[1],2.2,pxTex('plain')),soulW=wrGlow('#ffffff',ey[1],2.4,pxTex('plain'));
  const col=m=>{m.userData.hairCol=true;return m;};
  const vb=new THREE.Group();vb.name='vbody';root.add(vb);
  const hips=J('hips',vb,0,B.hipH,0),spine=J('spine',hips,0,B.spine,0),chest=J('chest',spine,0,B.chest,0),neck=J('neck',chest,0,B.neck,0),head=J('head',neck,0,B.headY,0);
  /* hips: the gown's fitted top over the hips, a low silver chain belt with a small skull, a chain hanging on the left */
  col(bx(hips,.31,.17,.21,gown,0,-.03,0));bx(hips,.24,.06,.17,corset,0,.06,0);bx(hips,.32,.022,.22,silverD,0,.0,0,0,0,.05);
  bx(hips,.04,.044,.02,bone,.07,.002,.112,0,0,.05);for(const z of[-.011,.011])bx(hips,.01,.01,.004,dark,.07+z,.008,.123);
  for(let i=0;i<4;i++)bx(hips,.012,.03,.012,silverD,.11,-.03-i*.032,.11-i*.004);
  /* waist: the corset, laced up the front with silver (bars only), boning lines */
  bx(spine,.22,.2,.165,corset,0,.06,0);bx(spine,.012,.18,.006,dark,0,.06,.084);for(let i=0;i<5;i++)bx(spine,.04,.008,.006,silver,0,-.02+i*.04,.088);
  for(const s of[-1,1])for(const x of[.05,.09])bx(spine,.008,.19,.004,corsetL,s*x,.06,.084-(x-.05)*.25);
  /* chest: the corset bodice with a sweetheart top over the bust, bare skin above it to the shoulders */
  col(bx(chest,.26,.13,.175,corset,0,.045,0));bx(chest,.012,.12,.006,dark,0,.045,.09);for(let i=0;i<3;i++)bx(chest,.04,.008,.006,silver,0,.0+i*.04,.094);
  for(const s of[-1,1]){bx(chest,.11,.08,.06,corset,s*.056,.128,.07);bx(chest,.1,.03,.05,corsetL,s*.058,.168,.068,0,0,-s*.25);bx(chest,.008,.13,.004,corsetL,s*.09,.05,.089);}
  col(bx(chest,.24,.08,.15,skin,0,.18,-.01));bx(chest,.2,.04,.04,skin,0,.172,.07);for(const s of[-1,1]){col(bx(chest,.08,.06,.13,skin,s*.105,.19,-.005));bx(chest,.07,.006,.008,skinD,s*.05,.205,.06,0,0,s*.15);}
  bx(chest,.006,.05,.004,vein,.04,.2,.072,0,0,.4);bx(chest,.006,.04,.004,vein,-.03,.205,.072,0,0,-.5);
  /* neck with black veins, a black choker with a glowing gem */
  col(bx(neck,.07,.12,.075,skin,0,.03,0));bx(neck,.08,.024,.084,dark,0,.03,0);bx(neck,.022,.022,.012,gemM,0,.03,.045,0,0,Math.PI/4);bx(neck,.012,.02,.012,silver,0,.008,.044);
  for(const s of[-1,1]){bx(neck,.004,.06,.006,vein,s*.036,.0,.02,.2,0,s*.3);bx(neck,.004,.04,.006,vein,s*.036,-.02,-.01,-.2,0,-s*.2);}
  /* head: a narrow pale face, sharp cheekbones, glowing eyes in smoky make-up with winged liner, arched brows, dark lips; the lower
     face is the jaw (g_jaw, opened by the clips). Black veins at the temples */
  col(bx(head,.2,.2,.22,skin,0,.175,0));bx(head,.16,.07,.1,skin,0,.05,-.045);bx(head,.06,.02,.06,dark,0,.07,.06);
  for(const s of[-1,1]){bx(head,.054,.024,.006,smoky,s*.047,.178,.111);bx(head,.044,.018,.008,dark,s*.046,.162,.111);bx(head,.028,.012,.006,eyeM,s*.046,.163,.115);bx(head,.03,.007,.006,dark,s*.082,.172,.112,0,0,s*.5);
    bx(head,.048,.007,.006,dark,s*.05,.196,.112,0,0,s*.22);bx(head,.026,.05,.01,skinD,s*.078,.118,.109,0,0,-s*.15);
    bx(head,.004,.07,.006,vein,s*.101,.2,.06,.3,0,0);bx(head,.004,.04,.006,vein,s*.101,.17,.04,-.5,0,0);}
  bx(head,.03,.06,.03,skin,0,.13,.118);bx(head,.022,.014,.022,skinD,0,.103,.124);bx(head,.058,.011,.012,lip,0,.082,.113);bx(head,.03,.006,.012,lipD,0,.087,.114);bx(head,.05,.008,.03,teeth,0,.072,.095);
  const jw=new THREE.Group();jw.name='g_jaw';head.add(jw);jw.position.set(0,.075,0);
  bx(jw,.17,.06,.12,skin,0,-.03,.045);bx(jw,.08,.024,.04,skin,0,-.056,.084);bx(jw,.056,.015,.014,lip,0,-.007,.106);bx(jw,.03,.005,.012,lipD,0,-.012,.112);bx(jw,.05,.008,.03,teeth,0,-.002,.092);
  /* hair: a cap, straight sides over the ears and a blunt fringe; long straight hair hangs in chains (wtHairTracks lays them) */
  bx(head,.22,.04,.24,hair,0,.29,-.005);col(bx(head,.22,.2,.04,hair,0,.19,-.125));for(const s of[-1,1])bx(head,.024,.2,.2,hair,s*.112,.185,-.02);
  bx(head,.22,.06,.03,hair,0,.245,.118);bx(head,.2,.01,.016,hairD,0,.214,.126);for(const x of[-.06,0,.06])bx(head,.012,.05,.004,hairS,x,.25,.134);
  const chains=[];
  const chain=(name,par,x,y,z,len,n,w,d,grow)=>{let p=J(name+'_0',par,x,y,z);const segs=[],L=len/n;
    for(let i=0;i<n;i++){if(i)p=J(name+'_'+i,p,0,-L,0);const f=1-.12*i/n;bx(p,w*f,L+.02,d,hair,0,-L/2,0);bx(p,w*f*.3,L+.02,d*1.02,hairS,w*f*.18,-L/2,0);segs.push(p);}
    chains.push({name,segs,L,r:d/2+.01,grow});return segs;};
  chain('hair_B',head,0,.2,-.12,.74,5,.25,.05,[0,-1,-.2]);
  for(const[sd,s]of[['L',1],['R',-1]])chain('hair_'+sd,head,s*.096,.15,.03,.44,3,.08,.035,[s*.03,-1,.15]);
  root.userData.hairChains=chains;
  /* headpiece */
  if(headK==='horns')for(const s of[-1,1])ncHorn(head,[[s*.07,.28,.03],[s*.12,.35,.0],[s*.16,.41,-.06],[s*.17,.46,-.13],[s*.15,.49,-.2],[s*.12,.5,-.25]],.05,.022,horn,hornD);
  else if(headK==='thorns'){bx(head,.23,.025,.025,horn,0,.29,.115);bx(head,.23,.025,.025,horn,0,.29,-.125);for(const s of[-1,1])bx(head,.025,.025,.25,horn,s*.115,.29,-.005);
    for(let i=0;i<11;i++){const a=-Math.PI*.9+i*Math.PI*1.8/10,x=Math.sin(a)*.12,z=Math.cos(a)*.125-.005,h=.06+.05*((i*7)%3)/2;ncSeg(head,[x,.29,z],[x*1.35,.29+h,z*1.3],.022,.022,i%2?hornD:horn);}}
  else{bx(head,.225,.022,.012,silver,0,.228,.14);for(const s of[-1,1])bx(head,.012,.022,.24,silver,s*.117,.228,.0);
    const g=new THREE.Group();g.position.set(0,.245,.148);head.add(g);bx(g,.05,.045,.022,bone,0,.0,0);bx(g,.03,.02,.02,bone,0,-.028,0);for(const x of[-.012,.012])bx(g,.012,.012,.006,eyeM,x,.0,.011);
    for(const s of[-1,1]){bx(head,.014,.04,.012,silverD,s*.05,.25,.14,0,0,-s*.2);bx(head,.012,.03,.012,silverD,s*.09,.245,.14,0,0,-s*.35);}}
  /* arms: bare shoulders and upper arms, long black gloves above the elbow with a coloured lace edge, slender gloved fingers with
     pointed silver nails, a silver ring with the eye-coloured gem on the left. A bone pauldron with spikes on the left shoulder */
  for(const[sd,s]of[['L',1],['R',-1]]){const sh=J('shoulder_'+sd,chest,s*B.shW*.325,.165*B.cS,0),ua=J('upperArm_'+sd,sh,s*B.shW*.675,0,0),fa=J('foreArm_'+sd,ua,0,-B.ua,0),hd=J('hand_'+sd,fa,0,-B.fa,0);
    const fg=J('fingers_'+sd,hd,0,-.085,0),ft=J('fingerTips_'+sd,fg,0,-.04,0),th=J('thumb_'+sd,hd,-s*.016,-.03,.04),so=J('socket_'+sd,hd,-s*.012,-.065,0);so.userData.socket=true;
    col(bx(ua,.075,.08,.08,skin,s*-.004,-.01,0));col(bx(ua,.066,.13,.066,skin,0,-.1,0));bx(ua,.072,.15,.072,glove,0,-.2,0);bx(ua,.078,.03,.078,gloveT,0,-.13,0);
    col(bx(fa,.064,.24,.064,glove,0,-.12,0));bx(fa,.058,.04,.058,glove,0,-.225,0);
    bx(hd,.04,.09,.078,glove,0,-.045,0);
    for(const[z,Lp]of[[.03,.04],[.01,.045],[-.01,.042],[-.03,.034]]){const g1=new THREE.Group(),g2=new THREE.Group();g1.position.set(0,0,z);fg.add(g1);g2.position.set(0,.04-Lp,z);ft.add(g2);
      bx(g1,.017,Lp,.017,glove,0,-Lp/2+.003,0);bx(g2,.015,.032,.015,glove,0,-.016,0);bx(g2,.011,.02,.011,silver,-s*.002,-.04,0);bx(g2,.006,.014,.006,silver,-s*.004,-.055,0);}
    const tg=new THREE.Group();tg.rotation.set(-.6,0,-s*.15);th.add(tg);bx(tg,.02,.042,.02,glove,0,-.02,0);bx(tg,.018,.028,.018,glove,0,-.048,0);bx(tg,.01,.016,.01,silver,0,-.068,0);
    if(sd==='L'){const rg=new THREE.Group();rg.position.set(0,0,.01);fg.add(rg);bx(rg,.022,.01,.022,silver,0,-.018,0);bx(rg,.012,.012,.012,gemM,-s*.012,-.018,0);
      /* bone pauldron: two curved plates of bone over the shoulder and two sharp spikes rising up and out */
      col(bx(ua,.12,.045,.13,bone,.015,.032,0,0,0,-.3));bx(ua,.1,.035,.12,boneD,.05,-.012,0,0,0,-.75);
      ncHorn(ua,[[.03,.05,-.025],[.065,.15,-.04],[.09,.24,-.055],[.105,.3,-.065]],.046,.012,bone,boneD);ncHorn(ua,[[.045,.04,.035],[.085,.11,.045],[.115,.16,.05],[.135,.19,.052]],.04,.012,bone,boneD);
      /* soul flame in front of the palm, hidden (tiny) unless a clip grows it */
      const orb=new THREE.Group();orb.name='orb_L';orb.userData.gear=true;orb.position.set(-s*.07,-.08,.02);orb.scale.setScalar(.001);hd.add(orb);
      bx(orb,.09,.09,.09,soul,0,0,0,.6,.6,0);bx(orb,.055,.055,.055,soulW,0,0,0,0,.8,.6);bx(orb,.04,.08,.04,soul,0,.07,0,0,.4,0);}}
  /* legs: pale skin above thigh-high boots with a silver garter clasp, pointed heeled boots (the sole is the IK foot's) */
  for(const[sd,s]of[['L',1],['R',-1]]){const th=J('thigh_'+sd,hips,s*B.hipW,-(B.hipOff+.01),0),sn=J('shin_'+sd,th,0,-B.thigh,0),ft=J('foot_'+sd,sn,0,-B.shin,0);
    bx(th,.118,.2,.122,skin,0,-.09,0);bx(th,.12,.25,.124,boot,0,-.32,0);bx(th,.126,.026,.13,bootD,0,-.195,0);bx(th,.02,.06,.01,silver,-s*.03,-.165,.062);bx(th,.008,.09,.006,dark,-s*.03,-.12,.062);
    bx(sn,.1,.07,.11,boot,0,-.01,.003);bx(sn,.094,.37,.1,boot,0,-.2,0);bx(sn,.008,.3,.004,bootD,0,-.2,.051);
    bx(ft,.085,.06,.09,boot,0,-.02,-.015);bx(ft,.075,.03,.11,boot,0,-.035,.05);bx(ft,.07,.016,.075,bootD,0,-.057,.075);bx(ft,.04,.02,.03,boot,0,-.05,.11);
    bx(ft,.032,.034,.028,bootD,0,-.048,-.05);bx(ft,.08,.012,.07,bootD,0,-.03,-.03);}
  /* gown: panels round the hips (sk_<i>, turned to face out), each an upper part (skUp_<i>) and a lower part (skLo_<i>) that the
     clips tilt out over the legs; the panel over the right leg stops high (the slit). Coloured outside, darker inside, pointed hem */
  for(let i=0;i<NC_SK;i++){const a=(i+.5)/NC_SK*360-180,ar=a*Math.PI/180,pv=new THREE.Group();pv.name='sk_'+i;pv.position.set(Math.sin(ar)*.152,-.065,Math.cos(ar)*.112);pv.rotation.y=ar;hips.add(pv);
    const slit=a>NC_SLIT[1]&&a<NC_SLIT[0],up=new THREE.Group(),lo=new THREE.Group();up.name='skUp_'+i;lo.name='skLo_'+i;pv.add(up);lo.position.y=-NC_L1;up.add(lo);
    const w1=.085,w2=.12,L1=slit?.2:NC_L1;up.rotation.x=-NC_A0[0]*Math.PI/180;lo.rotation.x=-(NC_A0[1]-NC_A0[0])*Math.PI/180;
    bx(up,w1,L1,.012,gown,0,-L1/2,.004);bx(up,w1*.96,L1,.008,gownD,0,-L1/2,-.006);
    if(slit){bx(up,w1,.04,.016,gownD,0,-L1+.02,.004);continue;}
    bx(lo,(w1+w2)/2,NC_L2,.012,gown,0,-NC_L2/2,.004);bx(lo,(w1+w2)/2*.96,NC_L2,.008,gownD,0,-NC_L2/2,-.006);bx(lo,w2*.6,.05,.012,gown,0,-NC_L2-.02,.004);bx(lo,w2*.3,.04,.012,gown,0,-NC_L2-.06,.004);}
  const joints=[];root.traverse(q=>{if(q.userData.joint&&!q.userData.socket)joints.push(q);});root.userData.joints=joints;
  if(o.bare)return root;
  /* staff in the right socket */
  const wr=new THREE.Group();wr.name='weapon_R';wr.userData.gear=true;root.getObjectByName('socket_R').add(wr);const st=ncStaff(staffK,eyeM,gemM);st.quaternion.copy(SH_BASIS());wr.add(st);
  /* circle of runes on the ground (Spell 2): two rings with diamonds between them, hidden unless the clip grows it */
  const rc=new THREE.Group();rc.name='ncircle';rc.scale.set(.001,1,.001);root.add(rc);
  for(const[R,n,w]of[[1.3,28,.3],[1.0,22,.3]])for(let i=0;i<n;i++){const a=i/n*Math.PI*2;bx(rc,w,.012,.045,gemM,Math.sin(a)*R,.009,Math.cos(a)*R,0,a,0);}
  for(let i=0;i<8;i++){const a=(i+.5)/8*Math.PI*2;bx(rc,.1,.012,.1,gemM,Math.sin(a)*1.15,.009,Math.cos(a)*1.15,0,Math.PI/4,0);bx(rc,.05,.014,.05,soulW,Math.sin(a)*1.15,.009,Math.cos(a)*1.15,0,Math.PI/4,0);}
  /* ring of soul fire (Spell 4): flames on a unit ring, grown outwards by the clip */
  const nv=new THREE.Group();nv.name='nnova';nv.scale.set(.001,.001,.001);root.add(nv);
  for(let i=0;i<24;i++){const a=i/24*Math.PI*2,h=.3+.12*(i%3);bx(nv,.1,h,.1,soul,Math.sin(a),h/2,Math.cos(a),0,a,0);bx(nv,.05,h*.7,.05,soulW,Math.sin(a),h*.35,Math.cos(a),0,a,0);}
  /* smoke for Vanish, Reappear and Death (hidden unless those clips play) */
  const sm=new THREE.Group();sm.name='nsmoke';sm.scale.setScalar(.001);root.add(sm);
  VL_PUFF.forEach((P,j)=>{const g=new THREE.Group();g.name='nsmoke_'+j;g.scale.setScalar(.001);sm.add(g);const m1=ncSmokeMat(j%3===0?'#24302a':'#1e1a22',.78),m2=ncSmokeMat(j%4===1?shade(ey[1],.45):'#2e2a34',.7);
    bx(g,1,1,1,m1,0,0,0,0,P.a,0);bx(g,.62,.62,.62,m2,.36*Math.sin(P.a*3),.28,.3*Math.cos(P.a*2),.3,P.a,0);});
  if(!o.noClips){root.userData.clips=ncBake(root);const mx=new THREE.AnimationMixer(root);mx.clipAction(root.userData.clips[0]).play();mx.update(0);}
  root.userData.ground=2.0;
  const cap=s=>s.charAt(0).toUpperCase()+s.slice(1);
  root.userData.variantText=`${cap(NC_SKIN[skinK][1])} skin, long straight ${NC_HAIR[hairK][1]} hair, glowing ${ey[2]} eyes; ${NC_GOWN[gownK][1]} gown slit up the right leg under a black corset; ${NC_HEAD[headK]}; staff topped by ${NC_STAFF[staffK]}.`;
  return root;}

/* ---------- gown ----------
   Each frame of a clip, every panel is tilted outwards (about its own top edge) by the least angle that keeps the legs behind it:
   for each point of a leg (thigh, knee, shin, boot, with its radius) beside the panel, the tilt at which that point lies on the
   panel's inner side has a closed form; the panel takes the largest, never less than the gown's flare. The lower part does the same
   from the end of the upper part and never folds in by more than 20°. A hem that would go into the ground (kneeling) is folded
   further out until it clears it. The tilts become quaternion tracks of skUp_<i> and skLo_<i>. */
function ncSkirtTracks(root,clips){const V=THREE.Vector3,M4=THREE.Matrix4,mx=new THREE.AnimationMixer(root),D2R=Math.PI/180,P=[],inv=[],ups=[],los=[],slit=[];
  for(let i=0;i<NC_SK;i++){P.push(root.getObjectByName('sk_'+i));ups.push(root.getObjectByName('skUp_'+i));los.push(root.getObjectByName('skLo_'+i));inv.push(new M4());
    const a=(i+.5)/NC_SK*360-180;slit.push(a>NC_SLIT[1]&&a<NC_SLIT[0]);}
  const Jn={};for(const n of['thigh_L','shin_L','foot_L','thigh_R','shin_R','foot_R'])Jn[n]=root.getObjectByName(n);
  const pts=[];const legPts=()=>{pts.length=0;for(const sd of['L','R']){const T=Jn['thigh_'+sd].getWorldPosition(new V()),K=Jn['shin_'+sd].getWorldPosition(new V()),A=Jn['foot_'+sd].getWorldPosition(new V());
      for(let k=1;k<=4;k++)pts.push([T.clone().lerp(K,k/4),.068]);for(let k=1;k<=4;k++)pts.push([K.clone().lerp(A,k/4),.062]);
      for(const z of[-.05,.06,.11])pts.push([Jn['foot_'+sd].localToWorld(new V(0,-.035,z)),.045]);}};
  /* the least tilt (radians, about the pivot's x, outwards) at which every point within reach of a panel from P0 (pivot frame) of
     length L and half width hw lies behind it */
  const q=new V(),tilt=(i,P0,L,hw,a0)=>{let a=a0;for(const[w,rr]of pts){q.copy(w).applyMatrix4(inv[i]).sub(P0);if(Math.abs(q.x)>hw+rr)continue;const c=rr+.012,R=Math.hypot(q.y,q.z);
      if(R>L+rr||R<=c||q.y>rr)continue;let phi=Math.atan2(q.y,q.z);if(phi>Math.PI/2)phi-=2*Math.PI;const beta=Math.acos(-c/R);a=Math.max(a,phi+beta);}return Math.min(a,85*D2R);};
  /* a flared panel widens with the gown's girth at its hem, so the gown stays closed (and pools when she kneels) instead of opening
     into strips: the width scales of the upper part and (on top of it) the lower part */
  const r0=P.map(g=>Math.hypot(g.position.x,g.position.z)),A0=NC_A0.map(v=>v*D2R),girth=(i,a1,a2,L1)=>{const su=Math.min(2.5,1+.7*((r0[i]+L1*Math.sin(a1))/(r0[i]+L1*Math.sin(A0[0]))-1)),
      sl=Math.min(3.5,(r0[i]+L1*Math.sin(a1)+NC_L2*Math.max(0,Math.sin(a2)))/(r0[i]+L1*Math.sin(A0[0])+NC_L2*Math.sin(A0[1])));return[su,Math.max(1,sl/su)];};
  const hem=(i,a1,a2,L1)=>{let y=1e9;const g=girth(i,a1,a2,L1),hw=.06*g[0]*g[1];for(const x of[-hw,hw])for(const l of[0,NC_L2+.085]){const p=new V(x,-L1*Math.cos(a1)-l*Math.cos(a2),L1*Math.sin(a1)+l*Math.sin(a2)).applyMatrix4(P[i].matrixWorld);y=Math.min(y,p.y);}return y;};
  /* fold a hem that would go into the ground outwards: the lower part first (up to folding back up), then the upper part too */
  const fold=(i,a1,a2,L1)=>{const G=.014;if(hem(i,a1,a2,L1)>=G)return[a1,a2];for(let k=0;k<12;k++){if(hem(i,a1,150*D2R,L1)>=G){let lo=a2,hi=150*D2R;for(let j=0;j<14;j++){const m=(lo+hi)/2;if(hem(i,a1,m,L1)<G)lo=m;else hi=m;}return[a1,hi];}a1=Math.min(110*D2R,a1+8*D2R);a2=Math.max(a2,a1-20*D2R);}return[a1,150*D2R];};
  const out=[];
  for(const c of clips){const T=c.tracks[0].times,act=mx.clipAction(c);act.play();const QU=ups.map(()=>[]),QL=los.map(()=>[]),SU=ups.map(()=>[]),SL=los.map(()=>[]),qt=new THREE.Quaternion(),e=new THREE.Euler();
    for(const t of T){act.time=t;mx.update(0);root.updateMatrixWorld(true);legPts();
      for(let i=0;i<NC_SK;i++){inv[i].copy(P[i].matrixWorld).invert();const L1=slit[i]?.2:NC_L1;let a1=tilt(i,new V(),L1,.05,NC_A0[0]*D2R),a2=a1;
        if(!slit[i]){const K=new V(0,-L1*Math.cos(a1),L1*Math.sin(a1));a2=Math.max(a1-20*D2R,tilt(i,K,NC_L2,.07,NC_A0[1]*D2R));
          [a1,a2]=fold(i,a1,a2,L1);}
        qt.setFromEuler(e.set(-a1,0,0));QU[i].push(qt.x,qt.y,qt.z,qt.w);qt.setFromEuler(e.set(-(a2-a1),0,0));QL[i].push(qt.x,qt.y,qt.z,qt.w);const gs=girth(i,a1,a2,L1);SU[i].push(gs[0],1,1);SL[i].push(gs[1],1,1);}}
    act.stop();mx.uncacheAction(c);
    for(let i=0;i<NC_SK;i++){c.tracks.push(new THREE.QuaternionKeyframeTrack(`skUp_${i}.quaternion`,Array.from(T),QU[i]),new THREE.VectorKeyframeTrack(`skUp_${i}.scale`,Array.from(T),SU[i]));if(!slit[i])c.tracks.push(new THREE.VectorKeyframeTrack(`skLo_${i}.scale`,Array.from(T),SL[i]));if(!slit[i])c.tracks.push(new THREE.QuaternionKeyframeTrack(`skLo_${i}.quaternion`,Array.from(T),QL[i]));}
    out.push(c);}
  mx.uncacheRoot(root);return out;}

/* ---------- clips ---------- */
let NC_CLIPS=null;
/* the clips with the gown and the hair laid over them (made once: the gown, the hair and the staff's length are the same for every look) */
function ncBake(root){if(NC_CLIPS)return NC_CLIPS;return NC_CLIPS=wtHairTracks(root,ncSkirtTracks(root,necromancerClips()),'necro');}
/* stances (body units; x,z of the hands hips-relative, y absolute; fl lifts the hips, feet and hands together).
   Relaxed (NC_N): weight on the left leg, the hip cocked out, the right knee bent in, the staff upright at her right side, the left
   hand on her hip, chin lowered. War (NC_W): wider, left foot forward, the staff angled forward, the left hand raised with the soul
   flame. Extra channels: jw jaw, oL soul flame size, vb body [scale, spin°], sm smoke phase, rc rune circle size, nv soul-fire ring phase */
const NC_N={fl:[0],HP:[.035,-.012,0],h:[0,-8,5],sp:[1,3,-2],ch:[-2,4,-4],nk:[2,0,0],hd:[6,-6,5],FL:[.07,.0,6,0,0],FR:[-.05,.07,-16,0,6],
  gR:[-.33,1.0,.12],dR:[0,1,0],pR:[-.5,-.4,-.7],gL:[.2,1.0,-.01],dL:[1,0,0],pL:[.7,-.2,-.6],wr:[0,0,0],wl:[0,0,-40],fist:[20,95],jw:[0],oL:[0],vb:[1,0],sm:[0],rc:[0],nv:[0]};
const NC_W=wrP(NC_N,{HP:[0,-.05,0],h:[4,-16,0],sp:[3,-4,0],ch:[3,-6,0],nk:[0,0,0],hd:[-4,16,0],FL:[.11,.17,-4,0,0],FR:[-.11,-.15,-34,0,0],
  gR:[-.38,1.1,.3],dR:[-.1,.95,.3],gL:[.3,1.3,.42],pL:[.6,-.5,-.6],wl:[12,0,-24],fist:[25,95],oL:[.55]});
/* wrapped in smoke (Vanish, Reappear): arms crossed low before her, the staff upright */
const NC_WRAP={fl:[.06],h:[0,0,0],sp:[0,0,0],ch:[-4,0,0],nk:[-6,0,0],hd:[-14,0,0],FL:[.07,.0,6,0,0],FR:[-.07,.0,-6,0,0],gR:[-.3,1.1,.24],dR:[0,1,0],gL:[.42,1.24,.2],wl:[-10,0,-30],fist:[0,95],jw:[.2]};
function ncRig(){const B=VB.necro,m=buildNecromancer(1,{bare:true}),J={};m.traverse(q=>{if(q.userData.joint)J[q.name]=q;});return{m,J,B,two:false};}

function necromancerClips(){const B=VB.necro,D=Math.PI*2,S=Math.sin,C=Math.cos,V=THREE.Vector3,Q=THREE.Quaternion,L=[],R=ncRig(),k=B.legS;
  /* the staff's box corners in socket space, for the ground check */
  const C8=[];{const st=ncStaff('horned',bm('#fff','plain'),bm('#fff','plain')),bq=SH_BASIS();st.updateMatrixWorld(true);st.traverse(m=>{if(!m.isMesh)return;const g=m.geometry.parameters;
    for(let i=0;i<8;i++)C8.push(new V((i&1?.5:-.5)*g.width,(i&2?.5:-.5)*g.height,(i&4?.5:-.5)*g.depth).applyMatrix4(m.matrix).applyQuaternion(bq));});}
  const cv=new V(),staffLow=()=>{R.m.updateMatrixWorld(true);const M=R.J.socket_R.matrixWorld;let y=1e9;for(const c of C8){cv.copy(c).applyMatrix4(M);if(cv.y<y)y=cv.y;}return y;};
  /* hand targets turn with the body's yaw (hips + spine + chest) */
  const yawF=p=>{const y=(p.h[1]+p.sp[1]+p.ch[1])*Math.PI/180,c=Math.cos(y),sn=Math.sin(y),rt=v=>[v[0]*c+v[2]*sn,v[1],-v[0]*sn+v[2]*c],o=Object.assign({},p);for(const q of['gR','gL'])o[q]=rt(p[q]);o.dR=rt(p.dR);return o;};
  const restQ={L:new Q().setFromEuler(new THREE.Euler(0,0,BASEPOSE.upperArm_L[2]*Math.PI/180)),R:new Q().setFromEuler(new THREE.Euler(0,0,BASEPOSE.upperArm_R[2]*Math.PI/180))};
  /* elbow poles by score round the shoulder-to-hand line (the vampire's terms: upper arm roll, elbow into the body, up, far out or
     forward, continuity). The staff arm also scores the staff: with a straight wrist the staff leaves the fist across the forearm
     towards the shoulder side, so the elbow is placed where that already points along dR, with the forearm across the staff */
  let MIN=.4,PP=null;const M4=new THREE.Matrix4();
  const poles=p=>{R.m.updateMatrixWorld(true);const o=Object.assign({},p),hp=(p.HP||[0,0,0]).map(v=>v*k),cq=R.J.chest.getWorldQuaternion(new Q()),up=new V(0,1,0),fw=new V(0,0,1).applyQuaternion(cq),nx={};
    for(const[sd,s]of[['L',1],['R',-1]]){const G=p['g'+sd],Sh=R.J['upperArm_'+sd].getWorldPosition(new V()),shW=R.J['shoulder_'+sd].getWorldQuaternion(new Q()),shq=shW.clone().invert(),sq=shW.clone().multiply(restQ[sd]);
      const T=new V(G[0]*k+hp[0],G[1]*k,G[2]*k+hp[2]).sub(Sh);if(T.length()<MIN){T.setLength(MIN);o['g'+sd]=[(Sh.x+T.x-hp[0])/k,(Sh.y+T.y)/k,(Sh.z+T.z-hp[2])/k];}const d=Math.min(T.length(),(B.ua+B.fa)*.999),u=T.normalize(),bone=new V(0,-1,0).applyQuaternion(sq);
      const al=Math.acos(Math.min(1,Math.max(-1,(B.ua*B.ua+d*d-B.fa*B.fa)/(2*B.ua*d)))),inw=new V(-s,0,0).applyQuaternion(cq),dS=sd==='R'?new V(...p.dR).normalize():null,Wp=u.clone().multiplyScalar(d);
      const el0=new V(0,0,-1).applyQuaternion(sq).applyQuaternion(new Q().setFromUnitVectors(bone,u)),b1=el0.clone().addScaledVector(u,-el0.dot(u)).normalize(),b2=new V().crossVectors(u,b1);
      let prev=PP&&PP[sd]?PP[sd].clone().addScaledVector(u,-PP[sd].dot(u)):null;if(prev&&prev.lengthSq()<.04)prev=null;if(prev)prev.normalize();let best=null,bc=1e9;
      for(const lim of[.866,-2])if(!best)
      for(let i=0;i<120;i++){const f=i/120*2*Math.PI,pp=b1.clone().multiplyScalar(Math.cos(f)).addScaledVector(b2,Math.sin(f)),e=u.clone().multiplyScalar(Math.cos(al)).addScaledVector(pp,Math.sin(al));
        const Y=e.clone().negate(),Z=pp.clone().addScaledVector(e,-pp.dot(e)).normalize().negate(),lq=shq.clone().multiply(new Q().setFromRotationMatrix(M4.makeBasis(new V().crossVectors(Y,Z),Y,Z)));let rr=Math.abs(2*Math.atan2(lq.y,lq.w));if(rr>Math.PI)rr=2*Math.PI-rr;
        if(prev&&pp.dot(prev)<lim||pp.dot(inw)>.35)continue;let c=(rr/1.4)**2+3*Math.max(0,pp.dot(inw)+.1)**2+3*Math.max(0,pp.dot(up)+.15)**2+1.5*Math.max(0,-pp.dot(inw)-.55)**2+2*Math.max(0,pp.dot(fw)-.2)**2+(prev?.5*(1-pp.dot(prev)):0);
        if(dS){const E=e.clone().multiplyScalar(B.ua),F=Wp.clone().sub(E).normalize(),inn=E.negate();inn.addScaledVector(F,-inn.dot(F));          if(inn.lengthSq()>1e-8){inn.normalize();const yf=F.clone().negate(),xf=new V().crossVectors(yf,inn),side=dS.dot(xf),fx=Math.atan2(-dS.dot(yf),dS.dot(inn));
            c+=8*side*side+.4*fx*fx+4*Math.max(0,Math.abs(fx)-1.05)**2;}}
        if(c<bc){bc=c;best=pp;}}
      if(!best)best=prev||el0;nx[sd]=best;o['p'+sd]=best.toArray();}
    PP=nx;return o;};
  const lift=p=>{const o=Object.assign({},p),f=p.fl[0];o.HP=[p.HP[0],p.HP[1]+f,p.HP[2]];for(const c of['FL','FR']){const F=p[c].slice();F[3]=(F[3]||0)+f;o[c]=F;}o.gR=[p.gR[0],p.gR[1]+f,p.gR[2]];o.gL=[p.gL[0],p.gL[1]+f,p.gL[2]];return o;};
  /* the right hand follows its forearm, bent only by the keyed wrist wr (x tips the staff forward or back, z leans it sideways); a
     staff that would go below the ground lifts the hand */
  const D2R=Math.PI/180,wrist=(s,p)=>{R.m.updateMatrixWorld(true);const fq=R.J.foreArm_R.getWorldQuaternion(new Q()),d=new V(...p.dR).normalize().applyQuaternion(fq.invert());
    const th=Math.max(-95*D2R,Math.min(95*D2R,Math.atan2(-d.y,d.z))),ph=Math.max(-35*D2R,Math.min(35*D2R,Math.asin(Math.max(-1,Math.min(1,d.x)))));
    const q=new Q().setFromEuler(new THREE.Euler(th,0,0)).multiply(new Q().setFromEuler(new THREE.Euler(0,ph,0))).multiply(new Q().setFromEuler(new THREE.Euler(p.wr[0]*D2R,p.wr[1]*D2R,p.wr[2]*D2R)));
    R.J.hand_R.quaternion.copy(q);const e=new THREE.Euler().setFromQuaternion(q);s.wR=[e.x/D2R,e.y/D2R,e.z/D2R];};
  const solve=p0=>{let p=yawF(lift(p0));wrSolve(R,p);p=poles(p);let s=wrSolve(R,p);wrist(s,p);
    for(let it=0;it<3;it++){const dy=.01-staffLow();if(dy<3e-4)break;p.gR=[p.gR[0],p.gR[1]+dy/k,p.gR[2]];s=wrSolve(R,p);wrist(s,p);}
    s.wL=[p.wl[0]*.4,-p.wl[1],-p.wl[2]];s.fist=p.fist;return s;};
  /* extra tracks every clip carries: jaw, soul flame, body group (scale about its middle and spin), smoke, rune circle, soul-fire ring */
  const extra=(c,fn,smoke)=>{const T=Array.from(c.tracks[0].times),JQ=[],OL=[],VS=[],VQ=[],VP=[],SM=[],RC=[],NV=[],q=new Q(),e=new THREE.Euler();
    for(const t of T){const p=fn(t);q.setFromEuler(e.set(p.jw[0],0,0));JQ.push(q.x,q.y,q.z,q.w);const ol=Math.max(.001,p.oL[0]);OL.push(ol,ol,ol);
      const s=Math.max(.001,p.vb[0]);VS.push(s,s,s);VP.push(0,1.0*(1-s),0);q.setFromEuler(e.set(0,p.vb[1]*D2R,0));VQ.push(q.x,q.y,q.z,q.w);const sv=p.sm[0]>.002&&p.sm[0]<.998?1:.001;SM.push(sv,sv,sv);
      const rc=Math.max(.001,p.rc[0]);RC.push(rc,1,rc);const n=p.nv[0],on=n>.002&&n<.998,rr=on?.4+3*n:.001,hh=on?Math.max(.001,1.3*Math.sin(Math.PI*Math.min(1,n*1.15))):.001;NV.push(rr,hh,rr);}
    c.tracks.push(new THREE.QuaternionKeyframeTrack('g_jaw.quaternion',T,JQ),new THREE.VectorKeyframeTrack('orb_L.scale',T,OL),new THREE.VectorKeyframeTrack('vbody.scale',T,VS),
      new THREE.VectorKeyframeTrack('vbody.position',T,VP),new THREE.QuaternionKeyframeTrack('vbody.quaternion',T,VQ),new THREE.VectorKeyframeTrack('nsmoke.scale',T,SM),
      new THREE.VectorKeyframeTrack('ncircle.scale',T,RC),new THREE.VectorKeyframeTrack('nnova.scale',T,NV));
    if(smoke)VL_PUFF.forEach((P,j)=>{const PP=[],SS=[];for(const t of T){const u=vlPuff(P,fn(t).sm[0],.12);PP.push(...u.p);SS.push(u.s,u.s,u.s);}
      c.tracks.push(new THREE.VectorKeyframeTrack(`nsmoke_${j}.position`,T,PP),new THREE.VectorKeyframeTrack(`nsmoke_${j}.scale`,T,SS));});};
  /* looping clips: one warm-up cycle first, so the elbows start where the cycle ends */
  const CC=(name,dur,fn,o={})=>{PP=null;MIN=o.min||.4;if(o.loop)for(let i=0;i<Math.round(dur*30);i++)solve(fn(i/30));
    const c=sampleClip(name,dur,t=>solve(fn(t)),Object.assign({autoFeet:false},o),B);extra(c,fn,o.smoke);if(o.next!==undefined){if(o.next)c.next=o.next;}else if(!o.loop)c.next='Idle (war mode)';if(o.hold)c.hold=true;L.push(c);MIN=.4;return c;};
  const KC=(name,dur,keys,note,o={})=>{const f=wrKeys(keys.map(q=>[q[0],wrP(o.base||NC_W,q[1]||{})]));return CC(name,dur,o.add?t=>o.add(t,f(t)):f,Object.assign({note},o));};
  /* in-place IK gait: planted feet slide back at one steady speed, swinging feet come forward lifted; the hands ride with the hips */
  const GAIT=(name,dur,G,note)=>{const fn=t=>{const u=t/dur,o=G.body(u),c2=C(D*(u-G.duty/2)),dy=-G.b*C(2*D*(u-G.duty/2));o.HP=[o.HP[0]+G.sw*c2,o.HP[1]+dy,o.HP[2]];
      o.gR=[o.gR[0],o.gR[1]+dy,o.gR[2]];o.gL=[o.gL[0],o.gL[1]+dy,o.gL[2]];
      for(const[sd,off,x,yaw]of[['L',0,G.x,G.yaw[0]],['R',.5,-G.x,G.yaw[1]]]){const q=(((u+off)%1)+1)%1;let z,l,pt;
        if(q<G.duty){const v=q/G.duty;z=G.s*(1-2*v);l=0;pt=v<.15?-8*(1-v/.15):v>.7?G.toe*(v-.7)/.3:0;}
        else{const v=(q-G.duty)/(1-G.duty),sm=v*v*(3-2*v);z=-G.s+2*G.s*sm;l=G.lift*Math.sin(Math.PI*v);pt=G.toe*(1-v)*(1-v)-8*v*v;}
        o['F'+sd]=[x,z+(sd==='L'?1:-1)*(G.st||0),yaw,l,pt];}return o;};
    const sp=2*G.s/(G.duty*dur),c=CC(name,dur,fn,{loop:true,note:`${note}, in place, ${(sp*k).toFixed(1)} m/s`});c.speed=sp*k;};

  /* ---- relaxed ---- */
  CC('Idle',5,t=>{const p=D*t/5,b=S(p),b2=S(2*p);return wrP(NC_N,{HP:[.035+.006*b,-.012-.004*b2,0],h:[0,-8,5+1.2*b],sp:[1+.5*b2,3,-2-.6*b],ch:[-2+.8*b2,4+2*S(p+.8),-4],hd:[6+2*S(2*p+1),-6+18*S(p+.6),5+2*S(p)],
    FR:[-.05,.07,-16,0,6+3*S(p+1)],gR:[-.33,1.0+.01*b2,.12],gL:[.2,1.0+.008*b2,-.01],wl:[0,0,-40+6*S(3*p)],fist:[20+12*Math.max(0,S(3*p+1)),95]});},
    {loop:true,note:'Weight on one leg, the hip cocked out, a hand on her hip, the staff upright at her side; looks slowly round, the fingers drum'});
  GAIT('Walk',1.2,{duty:.62,s:.25,lift:.06,toe:16,x:.06,yaw:[6,-6],b:.012,sw:.03,
    body:u=>{const yw=C(D*u),a=C(D*(u-.06));return wrP(NC_N,{HP:[0,-.02,0],h:[1,-7*yw,-6*S(D*(u-.12))],sp:[1,2*yw,2*S(D*(u-.12))],ch:[-3,5*yw,2.5*S(D*(u-.12))],hd:[4,-4*yw,-2*S(D*(u-.12))],
      gR:[-.33,1.02,.14+.05*a],gL:[.24,.9,.04-.12*a],wl:[0,0,-8],fist:[25,95]});}},'Slow, swaying walk, one foot in front of the other, the staff carried upright');

  /* ---- war mode ---- */
  CC('Idle (war mode)',2.6,t=>{const p=D*t/2.6,b=S(p);return wrP(NC_W,{HP:[0,-.05-.008*b,0],ch:[3+1.2*S(2*p),-6,0],hd:[-4+1.5*S(2*p+1),16+5*S(p),0],
    gR:[-.38,1.1+.01*S(p+.4),.3],gL:[.3,1.3+.02*S(p+1.2),.42],wl:[12,0,-24-8*Math.max(0,S(2*p))],oL:[.55+.08*S(3*p)],fist:[25+10*Math.max(0,S(2*p+.3)),95]});},
    {loop:true,note:'Wider stance, left foot forward, the staff angled ahead, the soul flame flickering in her raised left hand'});
  GAIT('Walk (war mode)',1.3,{duty:.64,s:.21,lift:.06,toe:16,x:.1,yaw:[-2,-30],b:.01,sw:.016,st:.07,
    body:u=>wrP(NC_W,{h:[5,-16-3*C(D*u),0],gR:[-.38,1.1,.3+.03*C(D*u)],gL:[.3,1.3,.42-.03*C(D*u)],oL:[.55+.05*S(2*D*u)]})},'Advances slowly, staff and soul flame held ahead');

  /* ---- spells ---- */
  /* Spell 1 (soul bolt): draws the soul flame in at her left side (elbow down), thrusts the open hand forward and hurls it */
  KC('Spell 1 (soul bolt)',2.0,[[0,{}],
    [.45,{h:[4,10,0],sp:[2,6,0],ch:[0,10,0],hd:[-4,4,0],gL:[.42,1.12,.05],wl:[0,0,-30],fist:[4,95],oL:[.95],jw:[.2]}],
    [.7,{h:[8,-22,0],sp:[6,-8,0],ch:[8,-12,0],hd:[-6,22,0],FL:[.11,.24,-4,0,0],gL:[.14,1.34,.66],wl:[20,0,10],fist:[0,95],oL:[1.15],jw:[.5]}],
    [.76,{h:[8,-22,0],sp:[6,-8,0],ch:[8,-12,0],hd:[-6,22,0],FL:[.11,.24,-4,0,0],gL:[.14,1.35,.67],wl:[20,0,10],fist:[0,95],oL:[.001],jw:[.5]}],
    [1.15,{h:[6,-18,0],ch:[5,-8,0],FL:[.11,.2,-4,0,0],gL:[.24,1.28,.54],fist:[10,95],oL:[.001],jw:[.15]}],
    [1.6,{oL:[.2]}],[2.0,{}]],'Draws the soul flame in at her side, then thrusts the open hand forward and hurls it');
  /* Spell 2 (raise the dead): lifts the staff high and rises off the ground, the soul flame swelling in her raised palm, head thrown
     back; then drops and drives the staff's foot into the ground ahead: a circle of runes flares round her (where the dead climb out) */
  {const UP={fl:[.22],HP:[0,0,0],h:[-2,0,0],sp:[-5,0,0],ch:[-8,0,0],nk:[-6,0,0],hd:[-20,0,0],FL:[.07,.0,6,-.04,40],FR:[-.07,-.03,-6,-.04,36],gR:[-.3,1.62,.12],dR:[0,1,0],wr:[0,0,0],gL:[.48,1.62,.14],wl:[-20,0,-30],fist:[0,95]};
  const DN={fl:[0],HP:[0,-.16,.04],h:[16,-6,0],sp:[8,-2,0],ch:[8,-2,0],nk:[4,0,0],hd:[8,8,0],FL:[.1,.14,-4,0,0],FR:[-.12,-.2,-26,0,0],gR:[-.28,.88,.46],dR:[0,1,.1],gL:[.42,1.04,.3],wl:[-10,0,-50],fist:[0,95]};
  KC('Spell 2 (raise the dead)',3.6,[[0,{}],
    [.6,wrP(UP,{fl:[.12],oL:[.6],jw:[.3]})],
    [1.25,wrP(UP,{oL:[1.1],jw:[.7]})],
    [1.5,wrP(UP,{fl:[.24],gR:[-.3,1.66,.14],oL:[1.2],jw:[.8]})],
    [1.72,wrP(DN,{oL:[.3],rc:[.3],jw:[.6]})],
    [1.85,wrP(DN,{oL:[.001],rc:[1.05],jw:[.5]})],
    [2.8,wrP(DN,{HP:[0,-.15,.04],gL:[.43,1.05,.3],oL:[.001],rc:[1],jw:[.3]})],
    [3.25,{oL:[.1],rc:[.001]}],[3.6,{}]],'Lifts the staff high and rises off the ground, the soul flame swelling in her palm; drops and drives the staff into the ground ahead, a circle of runes flaring round her to call up the dead, and holds');}
  /* Spell 3 (drain life): reaches out with the open left hand, clenches it and draws the stolen life back to her breast, the flame
     swelling, head tipping back, eyes half closed */
  KC('Spell 3 (drain life)',3.0,[[0,{}],
    [.5,{h:[8,-14,0],sp:[5,-6,0],ch:[6,-8,0],hd:[2,12,0],gL:[.2,1.36,.68],wl:[10,0,-10],fist:[0,95],oL:[.15],jw:[.3]}],
    [1.0,{h:[8,-14,0],sp:[5,-6,0],ch:[6,-8,0],hd:[2,12,0],gL:[.2,1.38,.66],wl:[10,0,-10],fist:[70,95],oL:[.35],jw:[.2]}],
    [2.0,{h:[0,-6,0],sp:[-3,-2,0],ch:[-7,-2,0],nk:[-4,0,0],hd:[-16,4,0],gL:[.26,1.26,.32],wl:[0,0,-10],fist:[80,95],oL:[.95],jw:[.4]}],
    [2.4,{h:[0,-6,0],sp:[-4,-2,0],ch:[-9,-2,0],nk:[-5,0,0],hd:[-20,4,0],gL:[.26,1.27,.31],wl:[0,0,-10],fist:[82,95],oL:[1.05],jw:[.45]}],
    [3.0,{}]],'Reaches out with an open hand, clenches it and draws the stolen life back to her breast, the soul flame swelling, head tipping back');
  /* Spell 4 (death nova): sinks low gathering the flame, then rises into the air, arms flung wide, head back; a ring of soul fire
     bursts out along the ground; she sinks back down */
  {const HI={fl:[.42],HP:[0,0,0],h:[-4,0,0],sp:[-6,0,0],ch:[-10,0,0],nk:[-6,0,0],hd:[-22,0,0],FL:[.08,-.02,6,-.06,46],FR:[-.08,-.05,-6,-.05,42],gR:[-.62,1.5,.08],dR:[-.2,1,0],wr:[0,0,0],gL:[.66,1.5,.08],wl:[-20,0,-34],fist:[0,95]};
  KC('Spell 4 (death nova)',3.4,[[0,{}],
    [.6,{HP:[0,-.2,0],h:[16,-6,0],sp:[10,-2,0],ch:[10,-2,0],hd:[10,6,0],gR:[-.32,.96,.36],dR:[0,1,.1],gL:[.22,1.0,.36],wl:[10,0,-40],fist:[30,95],oL:[.8],jw:[.1]}],
    [1.15,wrP(HI,{fl:[.34],oL:[1.0],jw:[.6]})],
    [1.3,wrP(HI,{oL:[.001],jw:[.9],nv:[.01]})],
    [2.2,wrP(HI,{fl:[.44],gR:[-.63,1.51,.08],gL:[.67,1.51,.08],oL:[.001],jw:[.7],nv:[.995]})],
    [2.9,{fl:[.08],oL:[.1],nv:[1]}],[3.4,{nv:[1]}]],'Sinks low gathering the flame, then rises into the air with her arms flung wide and head thrown back: a ring of soul fire bursts out along the ground; she sinks back down');}
  /* Kiss of death: lifts the left palm before her lips, the soul flame kindling on it, and blows it towards the enemy */
  KC('Kiss of death',2.4,[[0,{}],
    [.6,{h:[2,-8,0],sp:[2,-4,0],ch:[2,-6,0],nk:[6,0,0],hd:[6,6,-8],gL:[.14,1.46,.36],wl:[-10,0,-50],fist:[10,95],oL:[.15],jw:[.0]}],
    [1.1,{h:[2,-8,0],sp:[2,-4,0],ch:[2,-6,0],nk:[6,0,0],hd:[8,8,-8],gL:[.14,1.47,.37],wl:[-10,0,-50],fist:[5,95],oL:[.6],jw:[.12]}],
    [1.3,{h:[6,-14,0],sp:[4,-6,0],ch:[6,-8,0],nk:[4,0,0],hd:[0,10,-4],gL:[.2,1.44,.58],wl:[0,0,-40],fist:[0,95],oL:[.7],jw:[.2]}],
    [1.38,{h:[6,-14,0],sp:[4,-6,0],ch:[6,-8,0],nk:[4,0,0],hd:[0,10,-4],gL:[.2,1.44,.6],wl:[0,0,-40],fist:[0,95],oL:[.001],jw:[.1]}],
    [1.9,{hd:[2,14,6],gL:[.28,1.3,.48],oL:[.001],jw:[0]}],[2.4,{}]],'Lifts the left palm before her lips, a soul flame kindling on it, and blows it towards the enemy',{min:.34});
  /* Staff strike: lifts the skull high beside her right shoulder and brings it down ahead, beside the body */
  KC('Staff strike',1.5,[[0,{}],
    [.45,{h:[2,16,0],sp:[-2,6,0],ch:[-6,10,0],hd:[-4,-10,0],gR:[-.42,1.56,.0],dR:[0,.9,-.4],wr:[0,0,0],gL:[.36,1.2,.36],oL:[.3],jw:[.2]}],
    [.64,{h:[12,-4,0],sp:[8,-2,0],ch:[8,-4,0],hd:[2,6,0],FL:[.11,.26,-4,0,0],gR:[-.4,1.32,.48],dR:[0,.6,.8],gL:[.34,1.1,.24],oL:[.3],jw:[.5]}],
    [.78,{h:[20,-10,0],sp:[12,-4,0],ch:[12,-6,0],hd:[8,10,0],FL:[.11,.28,-4,0,0],gR:[-.4,1.08,.5],dR:[0,.1,1],gL:[.32,1.04,.16],oL:[.3],jw:[.3]}],
    [1.0,{h:[18,-10,0],sp:[10,-4,0],ch:[10,-6,0],hd:[6,10,0],FL:[.11,.28,-4,0,0],gR:[-.4,1.1,.48],dR:[0,.15,1],oL:[.35]}],
    [1.5,{}]],'Lifts the skull high beside her right shoulder and brings it down ahead with a step in, the staff clear of the body');
  /* Taunt (beckon): holds out the left hand palm up and curls the fingers twice, come here; tilts her head and laughs */
  KC('Taunt (beckon)',3.0,[[0,{}],
    [.5,{h:[0,-10,4],sp:[0,-4,-2],ch:[-3,-6,-3],hd:[8,8,12],gL:[.24,1.22,.5],wl:[-30,0,0],fist:[0,95],oL:[.001],jw:[.05]}],
    [2.4,{h:[0,-10,4],sp:[0,-4,-2],ch:[-3,-6,-3],hd:[-6,8,12],gL:[.25,1.23,.51],wl:[-30,0,0],fist:[0,95],oL:[.001],jw:[.05]}],
    [3.0,{}]],'Holds out her left hand palm up and curls the fingers twice (come here), tilts her head and laughs',
    {add:(t,p)=>{const o=Object.assign({},p);if(t>.6&&t<1.6){const g=Math.max(0,S(D*(t-.6)/.5));o.fist=[p.fist[0]+80*g,p.fist[1]];}
      if(t>1.6&&t<2.5){const w=Math.min(1,(t-1.6)/.15,(2.5-t)/.15),g=Math.max(0,S(D*(t-1.6)/.3))*w;o.jw=[p.jw[0]+.3*g];o.ch=[p.ch[0]-2*g,p.ch[1],p.ch[2]];}return o;}});

  /* ---- reactions ---- */
  KC('Hit 1',.9,[[0,{}],
    [.1,{HP:[0,-.06,-.1],h:[-8,-10,0],sp:[-8,-4,0],ch:[-12,-6,0],nk:[-8,0,0],hd:[-24,6,8],gL:[.42,1.4,.2],wl:[-10,0,-30],fist:[5,95],oL:[.1],jw:[.6]}],
    [.36,{HP:[0,-.06,-.05],h:[2,-12,0],sp:[2,-4,0],ch:[0,-6,0],hd:[-8,8,0],gL:[.36,1.3,.32],oL:[.3],jw:[.2]}],
    [.9,{}]],'Blow to the face: her head snaps back, the free hand flies up');
  KC('Hit 2',1.1,[[0,{}],
    [.12,{HP:[.06,-.08,0],h:[6,8,-10],sp:[4,4,-6],ch:[0,6,-8],hd:[-10,24,-12],gL:[.5,1.3,.24],wl:[-10,0,-30],fist:[10,95],oL:[.1],jw:[.5]}],
    [.32,{HP:[.08,-.1,0],h:[6,0,-6],sp:[5,0,-4],ch:[2,0,-6],hd:[-2,16,-6],FL:[.17,.12,2,0,0],gL:[.44,1.24,.32],oL:[.2],jw:[.2]}],
    [.62,{HP:[.05,-.08,0],FL:[.17,.12,2,0,0]}],
    [1.1,{}]],'Struck from the right: twists away and catches herself with a step, then turns back');
  KC('Heavy hit',2.5,[[0,{}],
    [.12,{HP:[0,-.08,-.1],h:[-8,-12,0],sp:[-10,-4,0],ch:[-14,-6,0],nk:[-8,0,0],hd:[-26,6,6],gL:[.46,1.38,.2],wl:[-10,0,-30],fist:[5,95],oL:[.001],jw:[.7]}],
    [.36,{HP:[0,-.24,-.12],h:[8,-12,0],sp:[2,-4,0],ch:[0,-6,0],hd:[-8,8,4],FL:[.12,-.04,-4,.06,30],gL:[.4,1.0,.26],oL:[.001],jw:[.4]}],
    [.64,{HP:[0,-.41,-.12],h:[18,-12,0],sp:[10,-4,0],ch:[8,-6,0],hd:[6,8,0],FL:[.12,-.38,-4,0,70],FR:[-.12,-.06,-30,0,0],gR:[-.34,.9,.44],dR:[0,.8,.6],gL:[.3,.7,.3],wl:[0,0,-40],fist:[25,95],oL:[.001],jw:[.2]}],
    [1.35,{HP:[0,-.41,-.12],h:[20,-12,0],sp:[11,-4,0],ch:[9,-6,0],hd:[-6,14,0],FL:[.12,-.38,-4,0,70],FR:[-.12,-.06,-30,0,0],gR:[-.34,.9,.45],dR:[0,.8,.6],gL:[.3,.69,.31],wl:[0,0,-40],fist:[25,95],oL:[.001],jw:[.3]}],
    [1.75,{HP:[0,-.3,-.08],h:[22,-12,0],sp:[10,-4,0],ch:[8,-6,0],hd:[-4,10,0],FL:[.12,-.3,-4,0,42],FR:[-.12,-.08,-30,0,0],gR:[-.36,.98,.4],dR:[0,.9,.4],gL:[.32,.86,.3],fist:[25,95],oL:[.1],jw:[.1]}],
    [2.05,{HP:[0,-.1,-.02],h:[8,-14,0],FL:[.12,.0,-4,.05,10],oL:[.3]}],
    [2.5,{}]],'Knocked down onto her left knee, bracing on it, then rises again');

  /* ---- vanish, reappear, death ---- */
  /* Vanish: draws herself up, arms before her, the smoke billows up round her from the ground; she spins and shrinks to nothing
     inside it and the smoke swirls away (held: gone) */
  KC('Vanish',3.4,[[0,{}],
    [.55,NC_WRAP],[.9,wrP(NC_WRAP,{sm:[.02]})],[1.4,wrP(NC_WRAP,{fl:[.1],sm:[.4]})],
    [1.62,wrP(NC_WRAP,{fl:[.12],sm:[.47],vb:[.75,160]})],[1.95,wrP(NC_WRAP,{fl:[.14],sm:[.58],vb:[.001,620]})],[3.4,wrP(NC_WRAP,{fl:[.14],sm:[1],vb:[.001,620]})]],
    'Draws herself up, smoke billowing round her from the ground; she spins and shrinks to nothing inside it, and the smoke swirls away (held: gone)',{smoke:true,hold:true,next:null});
  /* Reappear: smoke gathers out of nothing, she grows out of it spinning with her arms spread; the smoke clears and she laughs */
  {const OPEN={fl:[.12],HP:[0,0,0],h:[-2,0,0],sp:[-4,0,0],ch:[-6,0,0],nk:[-2,0,0],hd:[-10,0,0],FL:[.07,.0,6,-.03,30],FR:[-.07,-.02,-6,-.03,28],gR:[-.5,1.3,.12],dR:[-.15,1,0],wr:[0,0,0],gL:[.56,1.36,.08],wl:[-10,0,-30],fist:[5,95],jw:[.2]};
  KC('Reappear',2.8,[[0,wrP(OPEN,{sm:[1],vb:[.001,-620]})],[.55,wrP(OPEN,{sm:[.6],vb:[.001,-620]})],[.85,wrP(OPEN,{fl:[.14],sm:[.5],vb:[.7,-160]})],[1.05,wrP(OPEN,{fl:[.15],sm:[.44],vb:[1,0]})],
    [1.6,wrP(OPEN,{fl:[.14],gL:[.57,1.37,.09],hd:[-18,0,0],sm:[.15],jw:[.7]})],[2.0,wrP(OPEN,{fl:[.1],sm:[.002],jw:[.4]})],[2.8,{}]],
    'Smoke gathers out of nothing and she grows out of it, spinning, arms spread; the smoke clears and she laughs',{smoke:true});}
  /* Death: reels from the blow and sinks onto her knees leaning on the staff, throws her head back and screams; the souls she held
     burst out of her as smoke and she crumbles into it (held: gone) */
  {const KN={HP:[0,-.41,-.08],h:[14,-6,0],sp:[6,-2,0],ch:[4,-2,0],nk:[2,0,0],hd:[4,4,0],FL:[.11,-.3,-4,0,72],FR:[-.11,-.32,-14,0,74],gR:[-.32,.78,.42],dR:[0,.75,.66],wr:[0,0,0],gL:[.34,.74,.26],wl:[0,0,-30],fist:[30,95]};
  KC('Death',4.0,[[0,{}],
    [.14,{HP:[0,-.08,-.12],h:[-10,-12,0],sp:[-10,-4,0],ch:[-14,-6,0],nk:[-8,0,0],hd:[-26,6,6],gL:[.46,1.38,.2],wl:[-10,0,-30],fist:[5,95],oL:[.001],jw:[.7]}],
    [.5,{HP:[0,-.2,-.1],h:[6,-10,0],sp:[2,-4,0],ch:[0,-4,0],hd:[-4,4,4],FL:[.11,.02,-4,.06,20],gL:[.4,1.0,.28],oL:[.001],jw:[.3]}],
    [.95,wrP(KN,{oL:[.001],jw:[.2]})],
    [1.5,wrP(KN,{h:[4,-6,0],sp:[-4,-2,0],ch:[-10,-2,0],nk:[-8,0,0],hd:[-30,0,0],gL:[.4,.9,.2],wl:[-20,0,-30],fist:[0,95],oL:[.001],jw:[1]})],
    [1.9,wrP(KN,{h:[4,-6,0],sp:[-4,-2,0],ch:[-11,-2,0],nk:[-8,0,0],hd:[-32,0,0],gL:[.41,.91,.2],wl:[-20,0,-30],fist:[0,95],oL:[.001],sm:[.3],jw:[1]})],
    [2.15,wrP(KN,{h:[4,-6,0],sp:[-4,-2,0],ch:[-11,-2,0],nk:[-8,0,0],hd:[-32,0,0],gL:[.41,.91,.2],wl:[-20,0,-30],fist:[0,95],oL:[.001],sm:[.48],vb:[.7,0],jw:[1]})],
    [2.45,wrP(KN,{h:[4,-6,0],sp:[-4,-2,0],ch:[-11,-2,0],nk:[-8,0,0],hd:[-32,0,0],gL:[.41,.91,.2],wl:[-20,0,-30],fist:[0,95],oL:[.001],sm:[.6],vb:[.001,0],jw:[1]})],
    [4.0,wrP(KN,{h:[4,-6,0],sp:[-4,-2,0],ch:[-11,-2,0],nk:[-8,0,0],hd:[-32,0,0],gL:[.41,.91,.2],wl:[-20,0,-30],fist:[0,95],oL:[.001],sm:[1],vb:[.001,0],jw:[1]})]],
    'Reels from the blow and sinks onto her knees, throws her head back and screams; the souls burst out of her as smoke and she crumbles into it (held: gone)',{smoke:true,hold:true,next:null});}
  return L;}

ASSETS.push({id:'necromancer',folder:'characters/enemies/undead',name:'Necromancer',kind:'character',variants:true,defaultSeed:1,groundR:2.0,build:(s,o)=>buildNecromancer(s,o||{}),
  opts:[{key:'skin',label:'Skin',choices:[['random','Random'],...Object.entries(NC_SKIN).map(([k,v])=>[k,v[1].charAt(0).toUpperCase()+v[1].slice(1)])],def:'random'},
    {key:'hair',label:'Hair',choices:[['random','Random'],...Object.entries(NC_HAIR).map(([k,v])=>[k,v[1].charAt(0).toUpperCase()+v[1].slice(1)])],def:'random'},
    {key:'eyes',label:'Eyes',choices:[['random','Random'],['green','Green glow'],['violet','Violet glow'],['ice','Icy blue glow'],['red','Red glow']],def:'random'},
    {key:'gown',label:'Gown',choices:[['random','Random'],...Object.entries(NC_GOWN).map(([k,v])=>[k,v[1].charAt(0).toUpperCase()+v[1].slice(1)])],def:'random'},
    {key:'head',label:'Headpiece',choices:[['random','Random'],['horns','Horns'],['thorns','Crown of thorns'],['skull','Skull diadem']],def:'random'},
    {key:'staff',label:'Staff',choices:[['random','Random'],['horned','Horned skull'],['caged','Caged skull'],['crescent','Skull and crescent']],def:'random'}],
  desc:'Necromancer (boss): a tall, pale gothic sorceress of about 1.8 m with long straight hair and a blunt fringe, glowing eyes in smoky make-up, dark lips and black veins; a black corset over a long gown slit up the right leg, thigh-high heeled boots, long black gloves with silver nails, a spiked bone pauldron, a choker with a glowing gem, and horns, a crown of thorns or a skull diadem. Carries a two-metre staff topped by a skull. The gown and the hair move with every step. Clips: Idle, Walk, war-mode Idle and Walk, Spell 1 (soul bolt), Spell 2 (raise the dead: drives the staff into the ground in a circle of runes), Spell 3 (drain life), Spell 4 (death nova: rises and sends a ring of soul fire along the ground), Kiss of death, Staff strike, Taunt (beckon), Hit 1, Hit 2, Heavy hit, Vanish and Reappear (in smoke) and Death (crumbles into smoke).'});
