/* ======================= SUCCUBUS: a seductive winged demoness (Enemies → Hell) =======================
   A tall, shapely demoness (VB.succ: the necromancer's body, about 1.8 m) with coloured skin, long hair, glowing eyes in smoky
   make-up, full lips and horns; a leather bodice with gold lacing (bars only), a bare midriff with a gold waist chain, low leather
   briefs, thigh-high heeled boots, long fingerless gloves, a choker with a glowing gem. Big bat wings on the shoulder blades
   (swing_{L,R} with a folding outer half swingO_{L,R}) and a long thin tail (stail_0..9) ending in a heart-shaped spade.
   Built from its own meshes on the villager's 25 joints inside a body group (vbody), so the warrior's IK (wrSolve) fits unchanged.
   Clips use the necromancer's arm machinery with both hands free (hand targets turn with the body's yaw, elbow poles by a cost
   search, wrists keyed), the imp's wings and tail (rigid groups baked into tracks, lifted off the ground) and the wight's hair
   laying (wtHairTracks). Charm spells are gestures only: the owner adds the spell effects separately. */
VB.succ=Object.assign({},VB.female,{thigh:.44,shin:.42,g:.95,sex:'female'});
{const b=VB.succ;b.key='succ';b.hipH=b.thigh+b.shin+b.ankle+b.hipOff;b.legS=(b.thigh+b.shin)/.84;b.tS=(b.spine+b.chest)/.3;b.cS=b.neck/.22;}
const SU_SKIN={crimson:['#b43f45','crimson'],rose:['#d8908e','rose'],lilac:['#a68cc2','lilac'],fair:['#ecd0c4','fair']};
const SU_HAIR={black:['#16101a','jet black'],crimson:['#6c2631','crimson'],platinum:['#e4dacc','platinum'],violet:['#4b266b','violet']};
const SU_EYES={pink:['#ffe6f6','#e05ab8','pink'],violet:['#f2e4ff','#9a5ae0','violet'],gold:['#fff2d0','#f0a838','gold'],red:['#ffdcb8','#f0502a','red']};
const SU_OUT={black:['#1a141c','black'],crimson:['#521d26','crimson'],purple:['#3d1b4e','purple']};
const SU_HORN={curved:'curved horns swept back',ram:'ram horns curling back',tall:'tall horns rising up and out'};
const SU_WING={dark:'dark',black:'black',crimson:'crimson'};
const SU_TAIL=10,SU_TL=.11;

function buildSuccubus(seed,o={}){const B=VB.succ,r=mulberry32(((seed*2654435761)>>>0)^0x5c0b),pick=a=>a[Math.floor(r()*a.length)],root=new THREE.Group();root.userData.lights=[];
  /* roll everything, then let the options override */
  const skin0=pick(['crimson','crimson','rose','lilac','fair']),hair0=pick(['black','black','crimson','platinum','violet']),eye0=pick(['pink','pink','violet','gold','red']),out0=pick(Object.keys(SU_OUT)),horn0=pick(Object.keys(SU_HORN)),wing0=pick(Object.keys(SU_WING));
  const opt=(k,d)=>o[k]&&o[k]!=='random'?o[k]:d,skinK=opt('skin',skin0),hairK=opt('hair',hair0),eyeK=opt('eyes',eye0),outK=opt('outfit',out0),hornK=opt('horns',horn0),wingK=opt('wings',wing0);
  const shade=(h,f)=>'#'+new THREE.Color(h).multiplyScalar(f).getHexString(),SK=SU_SKIN[skinK][0],HC=SU_HAIR[hairK][0],OC=SU_OUT[outK][0];
  const skin=bm(SK,'skin'),skinD=bm(shade(SK,.82),'skin'),hair=bm(HC,'hair'),hairS=bm(shade(HC,hairK==='platinum'?.86:1.4),'hair'),hairD=bm(shade(HC,.7),'hair');
  const dark=bm('#161016','plain'),smoky=bm(skinK==='crimson'?'#371325':'#3c1c40','plain'),redLip=skinK==='fair'||skinK==='rose',lip=bm(redLip?'#9e3746':'#351223','plain'),lipD=bm(redLip?'#6b2630':'#200b19','plain'),teeth=bm('#ebe5db','plain');
  const lea=bm(OC,'leather'),leaL=bm(shade(OC,1.6),'leather'),boot=bm('#141114','leather'),bootD=bm('#120f16','leather'),gold=bm('#d8b04a','plain'),goldD=bm('#967534','plain'),nail=bm('#270d15','plain');
  const horn=bm('#1a1418','plain'),hornD=bm('#342a32','plain');
  const WB={dark:[shade(SK,.62),shade(SK,.42)],black:['#2a2228','#141016'],crimson:['#60212a','#41171f']}[wingK],wingB=bm(WB[0],'skin'),memb=bm(WB[1],'plain'),membD=bm(shade(WB[1],.7),'plain'),claw=bm('#1a1414','plain');
  const ey=SU_EYES[eyeK],eyeM=wrGlow(ey[0],ey[1],1.8,pxTex('plain')),gemM=wrGlow(ey[0],ey[1],1.5,pxTex('plain'));
  const col=m=>{m.userData.hairCol=true;return m;};
  const vb=new THREE.Group();vb.name='vbody';root.add(vb);
  const hips=J('hips',vb,0,B.hipH,0),spine=J('spine',hips,0,B.spine,0),chest=J('chest',spine,0,B.chest,0),neck=J('neck',chest,0,B.neck,0),head=J('head',neck,0,B.headY,0);
  /* hips: low leather briefs, a gold chain belt with a small gem at the front and a short chain hanging on the left */
  col(bx(hips,.3,.15,.21,lea,0,-.035,0));bx(hips,.24,.05,.17,skin,0,.06,0);bx(hips,.31,.02,.22,gold,0,.025,0,0,0,.06);
  bx(hips,.026,.026,.012,gemM,.02,.022,.112,0,0,Math.PI/4);bx(hips,.04,.012,.01,goldD,.02,.022,.108);for(let i=0;i<3;i++)bx(hips,.01,.026,.01,gold,.12,-.0-i*.028,.1-i*.004);
  for(const s of[-1,1])bx(hips,.006,.11,.004,leaL,s*.1,-.04,.106);
  /* bare midriff with a gold waist chain */
  col(bx(spine,.2,.2,.15,skin,0,.06,0));bx(spine,.012,.016,.006,skinD,0,.04,.076);bx(spine,.205,.012,.155,gold,0,.0,0,0,0,-.05);
  /* chest: a full bust held in a small leather bustier (low cups with a gold rim), gold lacing up the front (bars only), bare
     shoulders and upper chest above */
  col(bx(chest,.235,.12,.16,skin,0,.13,-.005));col(bx(chest,.25,.13,.17,lea,0,.025,0));bx(chest,.012,.1,.006,dark,0,.03,.087);for(let i=0;i<3;i++)bx(chest,.04,.008,.006,gold,0,-.02+i*.035,.09);bx(chest,.25,.016,.172,gold,0,-.035,0);
  for(const s of[-1,1]){col(bx(chest,.112,.1,.09,skin,s*.059,.128,.075));bx(chest,.1,.03,.03,skin,s*.058,.158,.06);
    col(bx(chest,.12,.07,.096,lea,s*.06,.1,.078));bx(chest,.122,.014,.098,gold,s*.06,.136,.078,0,0,-s*.12);bx(chest,.008,.1,.004,leaL,s*.09,.035,.087);}
  col(bx(chest,.24,.08,.15,skin,0,.18,-.01));bx(chest,.2,.04,.04,skin,0,.172,.07);for(const s of[-1,1]){col(bx(chest,.08,.06,.13,skin,s*.105,.19,-.005));bx(chest,.07,.006,.008,skinD,s*.05,.205,.06,0,0,s*.15);}
  /* neck: a black choker with a glowing gem */
  col(bx(neck,.07,.12,.075,skin,0,.03,0));bx(neck,.08,.024,.084,dark,0,.03,0);bx(neck,.022,.022,.012,gemM,0,.03,.045,0,0,Math.PI/4);bx(neck,.012,.02,.012,gold,0,.008,.044);
  /* head: a fine face, glowing eyes in smoky make-up with winged liner and lashes, arched brows, full lips; the lower face is the
     jaw (g_jaw, opened by the clips). Small gold earrings */
  col(bx(head,.2,.2,.22,skin,0,.175,0));bx(head,.16,.07,.1,skin,0,.05,-.045);bx(head,.06,.02,.06,dark,0,.07,.06);
  for(const s of[-1,1]){bx(head,.056,.026,.006,smoky,s*.047,.178,.111);bx(head,.044,.018,.008,dark,s*.046,.162,.111);bx(head,.028,.012,.006,eyeM,s*.046,.163,.115);bx(head,.032,.007,.006,dark,s*.083,.173,.112,0,0,s*.5);
    bx(head,.05,.006,.008,dark,s*.046,.172,.115);bx(head,.03,.007,.006,dark,s*.032,.204,.112,0,0,s*.12);bx(head,.032,.007,.006,dark,s*.066,.202,.112,0,0,-s*.3);bx(head,.016,.024,.01,skinD,s*.078,.122,.109,0,0,-s*.15);
    bx(head,.012,.03,.012,gold,s*.104,.1,.0);bx(head,.016,.016,.016,goldD,s*.104,.078,.0,0,0,Math.PI/4);}
  bx(head,.03,.06,.03,skin,0,.13,.118);bx(head,.022,.014,.022,skinD,0,.103,.124);bx(head,.064,.014,.014,lip,0,.083,.113);bx(head,.034,.007,.014,lipD,0,.088,.115);bx(head,.05,.008,.03,teeth,0,.072,.095);
  const jw=new THREE.Group();jw.name='g_jaw';head.add(jw);jw.position.set(0,.075,0);
  bx(jw,.17,.06,.12,skin,0,-.03,.045);bx(jw,.08,.024,.04,skin,0,-.056,.084);bx(jw,.06,.018,.016,lip,0,-.008,.106);bx(jw,.034,.006,.014,lipD,0,-.014,.113);bx(jw,.05,.008,.03,teeth,0,-.002,.092);
  /* hair: a cap with a side parting, long sides over the ears and a swept fringe; long hair hangs in chains (wtHairTracks lays them).
     The back curtain is narrow enough to hang between the wings */
  bx(head,.22,.04,.24,hair,0,.29,-.005);col(bx(head,.22,.2,.04,hair,0,.19,-.125));for(const s of[-1,1])bx(head,.024,.2,.2,hair,s*.112,.185,-.02);
  bx(head,.13,.05,.03,hair,.045,.255,.118,0,0,-.18);bx(head,.1,.03,.03,hair,-.06,.27,.118,0,0,.12);bx(head,.012,.04,.004,hairS,.02,.262,.134,0,0,-.18);bx(head,.012,.03,.004,hairS,.07,.25,.134,0,0,-.18);
  const chains=[];
  const chain=(name,par,x,y,z,len,n,w,d,grow)=>{let p=J(name+'_0',par,x,y,z);const segs=[],L=len/n;
    for(let i=0;i<n;i++){if(i)p=J(name+'_'+i,p,0,-L,0);const f=1-.12*i/n,wv=i%2?.008:-.008;bx(p,w*f,L+.02,d,hair,wv,-L/2,0);bx(p,w*f*.3,L+.02,d*1.02,hairS,w*f*.18+wv,-L/2,0);bx(p,w*f*.2,L+.02,d*1.02,hairD,-w*f*.25+wv,-L/2,0);segs.push(p);}
    chains.push({name,segs,L,r:d/2+.01,grow});return segs;};
  chain('hair_B',head,0,.2,-.12,.62,5,.17,.05,[0,-1,-.2]);
  for(const[sd,s]of[['L',1],['R',-1]])chain('hair_'+sd,head,s*.096,.15,.03,.46,3,.08,.035,[s*.03,-1,.15]);
  root.userData.hairChains=chains;
  /* horns, rising from the hairline, pointing outwards */
  const HP={curved:[[.07,.28,.03],[.12,.35,.0],[.16,.41,-.06],[.17,.46,-.13],[.15,.49,-.2],[.12,.5,-.25]],
    ram:[[.07,.28,.02],[.12,.33,-.02],[.17,.33,-.08],[.2,.27,-.12],[.2,.2,-.1],[.18,.17,-.05]],
    tall:[[.06,.28,.02],[.09,.36,.0],[.12,.44,-.03],[.14,.52,-.07],[.15,.58,-.12]]}[hornK];
  for(const s of[-1,1])ncHorn(head,HP.map(([x,y,z])=>[s*x,y,z]),hornK==='ram'?.056:.05,hornK==='tall'?.016:.022,horn,hornD);
  /* arms: bare shoulders and upper arms with a gold armlet, long fingerless leather gloves from above the elbow with a gold cuff,
     slender fingers with long dark nails, a gold ring with the eye-coloured gem on the left */
  for(const[sd,s]of[['L',1],['R',-1]]){const sh=J('shoulder_'+sd,chest,s*B.shW*.325,.165*B.cS,0),ua=J('upperArm_'+sd,sh,s*B.shW*.675,0,0),fa=J('foreArm_'+sd,ua,0,-B.ua,0),hd=J('hand_'+sd,fa,0,-B.fa,0);
    const fg=J('fingers_'+sd,hd,0,-.085,0),ft=J('fingerTips_'+sd,fg,0,-.04,0),th=J('thumb_'+sd,hd,-s*.016,-.03,.04),so=J('socket_'+sd,hd,-s*.012,-.065,0);so.userData.socket=true;
    col(bx(ua,.075,.08,.08,skin,s*-.004,-.01,0));col(bx(ua,.066,.13,.066,skin,0,-.1,0));bx(ua,.072,.022,.072,gold,0,-.07,0);bx(ua,.072,.12,.072,lea,0,-.215,0);bx(ua,.078,.02,.078,gold,0,-.155,0);
    col(bx(fa,.064,.24,.064,lea,0,-.12,0));bx(fa,.066,.03,.066,gold,0,-.225,0);
    bx(hd,.04,.09,.078,skin,0,-.045,0);
    for(const[z,Lp]of[[.03,.04],[.01,.045],[-.01,.042],[-.03,.034]]){const g1=new THREE.Group(),g2=new THREE.Group();g1.position.set(0,0,z);fg.add(g1);g2.position.set(0,.04-Lp,z);ft.add(g2);
      bx(g1,.017,Lp,.017,skin,0,-Lp/2+.003,0);bx(g2,.015,.032,.015,skin,0,-.016,0);bx(g2,.011,.02,.011,nail,-s*.002,-.04,0);bx(g2,.006,.014,.006,nail,-s*.004,-.055,0);}
    const tg=new THREE.Group();tg.rotation.set(-.6,0,-s*.15);th.add(tg);bx(tg,.02,.042,.02,skin,0,-.02,0);bx(tg,.018,.028,.018,skin,0,-.048,0);bx(tg,.01,.016,.01,nail,0,-.068,0);
    if(sd==='L'){const rg=new THREE.Group();rg.position.set(0,0,.01);fg.add(rg);bx(rg,.022,.01,.022,gold,0,-.018,0);bx(rg,.012,.012,.012,gemM,-s*.012,-.018,0);}}
  /* legs: bare thighs above thigh-high heeled boots with a gold clasp (the sole is the IK foot's) */
  for(const[sd,s]of[['L',1],['R',-1]]){const th=J('thigh_'+sd,hips,s*B.hipW,-(B.hipOff+.01),0),sn=J('shin_'+sd,th,0,-B.thigh,0),ft=J('foot_'+sd,sn,0,-B.shin,0);
    bx(th,.122,.06,.126,lea,0,-.01,0);bx(th,.118,.16,.122,skin,0,-.11,0);bx(th,.12,.25,.124,boot,0,-.32,0);bx(th,.126,.026,.13,bootD,0,-.195,0);bx(th,.02,.03,.01,gold,-s*.03,-.2,.066);
    bx(sn,.1,.07,.11,boot,0,-.01,.003);bx(sn,.094,.37,.1,boot,0,-.2,0);bx(sn,.008,.3,.004,bootD,0,-.2,.051);
    bx(ft,.085,.06,.09,boot,0,-.02,-.015);bx(ft,.075,.03,.11,boot,0,-.035,.05);bx(ft,.07,.016,.075,bootD,0,-.057,.075);bx(ft,.04,.02,.03,boot,0,-.05,.11);
    bx(ft,.032,.034,.028,bootD,0,-.048,-.05);bx(ft,.08,.012,.07,bootD,0,-.03,-.03);}
  /* wings on the shoulder blades: an inner arm bone and membrane, then the folding outer half with three finger bones, a long lower
     finger hanging from the tip (the lower part) ending in a talon, a hooked thumb claw and spines along the leading edge; the
     membrane grows longer towards the tip and ends in a ragged edge of sharp points (local x outwards, the membrane hanging down
     from the leading edge; the clips pitch it back) */
  const spike=(par,x,y,w,len,m,rz=0)=>{const g=new THREE.Group();g.position.set(x,y,0);g.rotation.z=rz;g.scale.set(1,len/w,1);par.add(g);bx(g,w*.7071,w*.7071,.01,m,0,0,0,0,0,Math.PI/4);return g;};
  for(const[sd,s]of[['L',1],['R',-1]]){const w=new THREE.Group();w.name='swing_'+sd;w.position.set(s*.1,.13,-.1);chest.add(w);
    const a=.4,b=.55;col(bx(w,.065,.065,.065,wingB,0,0,0));bx(w,a,.038,.038,wingB,s*a/2,0,0);spike(w,s*.06,.05,.03,.08,claw,-s*.3);
    [[.4,.07],[.46,.2],[.52,.33]].forEach(([h,x])=>{bx(w,.135,h,.01,memb,s*x,-h/2,0);spike(w,s*(x+.02),-h-.06,.07,.16,memb);});
    const wo=new THREE.Group();wo.name='swingO_'+sd;wo.position.set(s*a,0,0);w.add(wo);bx(wo,.055,.055,.055,wingB,0,0,0);
    ncHorn(wo,[[0,.02,0],[s*.01,.09,.01],[-s*.015,.15,.03]],.032,.012,claw,claw);
    bx(wo,b,.034,.034,wingB,s*b/2,0,0);spike(wo,s*(b+.04),.03,.045,.12,claw,-s*1.0);for(const x of[.18,.36])spike(wo,s*x,.04,.024,.06,claw,-s*.4);
    /* finger bones from the wrist to the points of the trailing edge, and the lower part: a long finger hanging from the tip */
    const bone=(x0,y0,x1,y1,t)=>{const L=Math.hypot(x1-x0,y1-y0),an=Math.atan2(y1-y0,x1-x0);bx(wo,L,t,t,wingB,s*(x0+x1)/2,(y0+y1)/2,.008,0,0,s*an);};
    bone(0,0,.135,-.6,.022);bone(0,0,.315,-.72,.022);bone(.02,0,.05,-.54,.022);bone(b,0,.495,-.84,.026);spike(wo,s*.494,-.93,.04,.2,claw);
    [[.54,.045],[.6,.135],[.66,.225],[.72,.315],[.78,.405],[.84,.495]].forEach(([h,x],i)=>{bx(wo,.092,h,.01,memb,s*x,-h/2,0);if(i<5)spike(wo,s*(x+.01),-h-.07,.07,.18,i%2?membD:memb);});}
  /* tail: ten thin segments from the base of the spine, each curls about x and sways about y; a heart-shaped spade at the tip */
  {let p=hips;for(let i=0;i<SU_TAIL;i++){const g=new THREE.Group();g.name='stail_'+i;g.position.set(0,i?0:-.05,i?-SU_TL:-.1);p.add(g);const t=.03-i*.0016;
    bx(g,t,t,SU_TL+.01,i%2?skinD:skin,0,0,-SU_TL/2);p=g;}
    const z=-SU_TL;bx(p,.012,.06,.06,wingB,0,0,z-.05,Math.PI/4,0,0);for(const y of[-.024,.024])bx(p,.012,.042,.042,wingB,0,y,z-.025,Math.PI/4,0,0);bx(p,.014,.02,.02,skinD,0,0,z-.005);}
  const joints=[];root.traverse(q=>{if(q.userData.joint&&!q.userData.socket)joints.push(q);});root.userData.joints=joints;
  if(o.bare)return root;
  if(!o.noClips){root.userData.clips=suBake(root);const mx=new THREE.AnimationMixer(root);mx.clipAction(root.userData.clips[0]).play();mx.update(0);}
  root.userData.ground=2.4;
  const cap=s=>s.charAt(0).toUpperCase()+s.slice(1);
  root.userData.variantText=`${cap(SU_SKIN[skinK][1])} skin, long ${SU_HAIR[hairK][1]} hair, glowing ${ey[2]} eyes, ${SU_HORN[hornK]}; ${SU_OUT[outK][1]} leather bodice, briefs and gloves, black thigh-high boots; ${SU_WING[wingK]} bat wings and a heart-tipped tail.`;
  return root;}

/* ---------- clips ---------- */
let SU_CLIPS=null;
/* the clips with the hair laid over them (made once: the body, wings, tail and hair are the same for every look) */
function suBake(root){if(SU_CLIPS)return SU_CLIPS;return SU_CLIPS=wtHairTracks(root,succubusClips(),'succ');}
/* Pose channels: the necromancer's (fl lifts the hips, feet and hands together; x,z of the hands hips-relative, y absolute) with
   both wrists keyed (wl, wr: the right one mirrored), plus jw jaw, vb body [scale, spin°]; wings wg [elevation, sweep back, pitch
   back, outer fold back, outer droop] and ba wing-beat amplitude (0 holds wg); tail tc curl per segment (10), tw wave, tsw sway.
   Relaxed (SU_N): weight on the left leg, the hip cocked out, the left hand on her hip, wings half folded behind her, the tail
   hanging in a curve with its tip up. War (SU_W): wider, left foot forward, both clawed hands raised, wings half open. */
const SU_N={fl:[0],HP:[.035,-.012,0],h:[0,-8,5],sp:[1,3,-2],ch:[-2,4,-4],nk:[2,0,0],hd:[6,-6,5],FL:[.07,.0,6,0,0],FR:[-.05,.07,-16,0,6],
  gR:[-.25,.93,.06],dR:[0,0,1],pR:[-.5,-.3,-.8],gL:[.2,1.0,-.01],dL:[1,0,0],pL:[.7,-.2,-.6],wr:[0,0,6],wl:[0,0,-40],fist:[20,25],jw:[0],vb:[1,0],
  wg:[30,30,8,24,0],ba:[0],tc:[-62,6,8,10,12,14,14,12,10,8],tw:[.5],tsw:[0]};
const SU_W=wrP(SU_N,{HP:[0,-.06,0],h:[6,-14,0],sp:[3,-4,0],ch:[4,-4,0],nk:[0,0,0],hd:[-6,14,0],FL:[.11,.17,-4,0,0],FR:[-.11,-.15,-34,0,0],
  gL:[.28,1.24,.36],pL:[.6,-.5,-.6],gR:[-.3,1.16,.3],pR:[-.6,-.5,-.6],wl:[12,0,-20],wr:[12,0,-20],fist:[10,10],wg:[28,35,8,20,0],tc:[-44,8,10,12,12,12,10,8,6,4],tw:[1]});
/* hovering: lifted, the left leg straighter, the right knee bent with its foot behind, toes pointed, arms loose and a little out */
const SU_F=wrP(SU_N,{fl:[.6],HP:[0,0,0],h:[6,0,0],sp:[0,0,0],ch:[-2,0,0],nk:[0,0,0],hd:[2,0,0],FL:[.07,.04,4,-.04,50],FR:[-.07,-.1,-6,.06,42],
  gL:[.3,1.0,.1],pL:[.7,-.3,-.6],gR:[-.3,1.0,.1],pR:[-.7,-.3,-.6],wl:[0,0,-10],wr:[0,0,-10],fist:[25,25],wg:[18,22,14,6,0],ba:[1],tc:[-50,6,6,8,8,8,8,6,6,4],tw:[1]});
/* one wing beat at phase u (0 = wings up): offsets added to wg, scaled by ba */
function suBeat(u){const a=Math.PI*2*u,c=Math.cos(a),s=Math.sin(a);return[44*c,6*s,12*s,24*Math.max(0,-s),-10*Math.max(0,-s)];}
function suRig(){const B=VB.succ,m=buildSuccubus(1,{bare:true}),J={};m.traverse(q=>{if(q.userData.joint||/^(swing|stail)/.test(q.name))J[q.name]=q;});
  const tail=[];for(let i=0;i<SU_TAIL;i++)tail.push(J['stail_'+i]);return{m,J,B,two:false,tail};}

function succubusClips(){const B=VB.succ,D=Math.PI*2,S=Math.sin,C=Math.cos,V=THREE.Vector3,Q=THREE.Quaternion,E3=THREE.Euler,L=[],R=suRig(),k=B.legS,R2=Math.PI/180;
  const vv=new V();
  const lowOwn=g=>{g.updateMatrixWorld(true);let y=1e9;for(const q of g.children){if(!q.isMesh)continue;const P=q.geometry.parameters;for(let i=0;i<8;i++){vv.set((i&1?.5:-.5)*P.width,(i&2?.5:-.5)*P.height,(i&4?.5:-.5)*P.depth).applyMatrix4(q.matrixWorld);if(vv.y<y)y=vv.y;}}return y;};
  const lowAll=g=>{g.updateMatrixWorld(true);let y=1e9;g.traverse(q=>{if(!q.isMesh)return;const P=q.geometry.parameters;for(let i=0;i<8;i++){vv.set((i&1?.5:-.5)*P.width,(i&2?.5:-.5)*P.height,(i&4?.5:-.5)*P.depth).applyMatrix4(q.matrixWorld);if(vv.y<y)y=vv.y;}});return y;};
  /* hand targets turn with the body's yaw (hips + spine + chest) */
  const yawF=p=>{const y=(p.h[1]+p.sp[1]+p.ch[1])*R2,c=Math.cos(y),sn=Math.sin(y),rt=v=>[v[0]*c+v[2]*sn,v[1],-v[0]*sn+v[2]*c],o=Object.assign({},p);for(const q of['gR','gL'])o[q]=rt(p[q]);return o;};
  const restQ={L:new Q().setFromEuler(new E3(0,0,BASEPOSE.upperArm_L[2]*R2)),R:new Q().setFromEuler(new E3(0,0,BASEPOSE.upperArm_R[2]*R2))};
  /* elbow poles by score round the shoulder-to-hand line (the necromancer's terms without the staff: upper arm roll, elbow into
     the body, up, far out or forward, continuity) */
  let MIN=.36,PP=null;const M4=new THREE.Matrix4();
  const poles=p=>{R.m.updateMatrixWorld(true);const o=Object.assign({},p),hp=(p.HP||[0,0,0]).map(v=>v*k),cq=R.J.chest.getWorldQuaternion(new Q()),up=new V(0,1,0),fw=new V(0,0,1).applyQuaternion(cq),nx={};
    for(const[sd,s]of[['L',1],['R',-1]]){const G=p['g'+sd],Sh=R.J['upperArm_'+sd].getWorldPosition(new V()),shW=R.J['shoulder_'+sd].getWorldQuaternion(new Q()),shq=shW.clone().invert(),sq=shW.clone().multiply(restQ[sd]);
      const T=new V(G[0]*k+hp[0],G[1]*k,G[2]*k+hp[2]).sub(Sh);if(T.length()<MIN){T.setLength(MIN);o['g'+sd]=[(Sh.x+T.x-hp[0])/k,(Sh.y+T.y)/k,(Sh.z+T.z-hp[2])/k];}const d=Math.min(T.length(),(B.ua+B.fa)*.999),u=T.normalize(),bone=new V(0,-1,0).applyQuaternion(sq);
      const al=Math.acos(Math.min(1,Math.max(-1,(B.ua*B.ua+d*d-B.fa*B.fa)/(2*B.ua*d)))),inw=new V(-s,0,0).applyQuaternion(cq);
      const el0=new V(0,0,-1).applyQuaternion(sq).applyQuaternion(new Q().setFromUnitVectors(bone,u)),b1=el0.clone().addScaledVector(u,-el0.dot(u)).normalize(),b2=new V().crossVectors(u,b1);
      let prev=PP&&PP[sd]?PP[sd].clone().addScaledVector(u,-PP[sd].dot(u)):null;if(prev&&prev.lengthSq()<.04)prev=null;if(prev)prev.normalize();let best=null,bc=1e9;
      for(const lim of[.866,-2])if(!best)
      for(let i=0;i<120;i++){const f=i/120*D,pp=b1.clone().multiplyScalar(C(f)).addScaledVector(b2,S(f)),e=u.clone().multiplyScalar(C(al)).addScaledVector(pp,S(al));
        const Y=e.clone().negate(),Z=pp.clone().addScaledVector(e,-pp.dot(e)).normalize().negate(),lq=shq.clone().multiply(new Q().setFromRotationMatrix(M4.makeBasis(new V().crossVectors(Y,Z),Y,Z)));let rr=Math.abs(2*Math.atan2(lq.y,lq.w));if(rr>Math.PI)rr=D-rr;
        if(prev&&pp.dot(prev)<lim||pp.dot(inw)>.35)continue;const c=(rr/1.4)**2+3*Math.max(0,pp.dot(inw)+.1)**2+3*Math.max(0,pp.dot(up)+.15)**2+1.5*Math.max(0,-pp.dot(inw)-.55)**2+2*Math.max(0,pp.dot(fw)-.2)**2+(prev?.5*(1-pp.dot(prev)):0);
        if(c<bc){bc=c;best=pp;}}
      if(!best)best=prev||el0;nx[sd]=best;o['p'+sd]=best.toArray();}
    PP=nx;return o;};
  const lift=p=>{const o=Object.assign({},p),f=p.fl[0];o.HP=[p.HP[0],p.HP[1]+f,p.HP[2]];for(const c of['FL','FR']){const F=p[c].slice();F[3]=(F[3]||0)+f;o[c]=F;}o.gR=[p.gR[0],p.gR[1]+f,p.gR[2]];o.gL=[p.gL[0],p.gL[1]+f,p.gL[2]];return o;};
  const wingQ=(s,el,sw,pi)=>new Q().setFromEuler(new E3(pi*R2,s*sw*R2,s*el*R2,'YZX'));
  let MEM=null;
  const solve=(p0,t,o)=>{let p=yawF(lift(p0));wrSolve(R,p);p=poles(p);const s=wrSolve(R,p);
    s.wL=[p.wl[0]*.4,-p.wl[1],-p.wl[2]];s.wR=[p.wr[0]*.4,p.wr[1],p.wr[2]];s.fist=p.fist;
    for(const sd of['L','R'])R.J['hand_'+sd].rotation.set(s['w'+sd][0]*R2,s['w'+sd][1]*R2,s['w'+sd][2]*R2);R.m.updateMatrixWorld(true);
    /* wings: the keyed pose plus the beat; lifted (elevation) wherever they would touch the ground */
    const bt=suBeat(o.bu?o.bu(t):t/(o.beat||.9)),ba=p.ba[0],wv=p.wg.map((v,i)=>v+bt[i]*ba),wing={};
    for(const[sd,s1]of[['L',1],['R',-1]]){const g=R.J['swing_'+sd],go=R.J['swingO_'+sd];let el=wv[0];go.quaternion.setFromEuler(new E3(0,s1*wv[3]*R2,s1*wv[4]*R2,'YZX'));
      g.quaternion.copy(wingQ(s1,el,wv[1],wv[2]));if(lowAll(g)<.012)for(let dd=3;dd<=120;dd+=3){g.quaternion.copy(wingQ(s1,el+dd,wv[1],wv[2]));if(lowAll(g)>=.012){el+=dd;break;}}
      wing[sd]=[g.quaternion.clone(),go.quaternion.clone()];}
    /* tail: curl and a travelling wave; a segment that would go into the ground curls up (or down) just enough */
    const ph=D*t/(o.tp||2),tq=[];
    for(let i=0;i<SU_TAIL;i++){const g=R.tail[i];let ax=p.tc[i]+p.tw[0]*5*S(ph-.6*i);const ay=p.tsw[0]/SU_TAIL+p.tw[0]*7*S(ph-.6*i+1.3);
      const set=a=>g.quaternion.setFromEuler(new E3(a*R2,ay*R2,0,'YXZ'));set(ax);
      if(lowOwn(g)<.012){let ok=null;for(let dd=3;dd<=180&&ok===null;dd+=3)for(const sg of[1,-1]){set(ax+sg*dd);if(lowOwn(g)>=.012){ok=ax+sg*dd;break;}}ax=ok===null?ax:ok;set(ax);}
      tq.push(g.quaternion.clone());}
    MEM={wing,tq};return s;};
  /* extra tracks every clip carries: wings, tail, jaw, body group (scale about its middle and spin) */
  const extra=(c,fn,M)=>{const T=Array.from(c.tracks[0].times),q=new Q(),e=new E3(),Tr={},Vt={},add=(n,v,tb=Tr)=>{(tb[n]||(tb[n]=[])).push(...v);};
    T.forEach((t,i)=>{const p=fn(t),m=M[i];
      for(const sd of['L','R']){add(`swing_${sd}.quaternion`,m.wing[sd][0].toArray());add(`swingO_${sd}.quaternion`,m.wing[sd][1].toArray());}
      m.tq.forEach((tq,j)=>add(`stail_${j}.quaternion`,tq.toArray()));
      q.setFromEuler(e.set(p.jw[0],0,0));add('g_jaw.quaternion',[q.x,q.y,q.z,q.w]);
      const s=Math.max(.001,p.vb[0]);add('vbody.scale',[s,s,s],Vt);add('vbody.position',[0,1.0*(1-s),0],Vt);q.setFromEuler(e.set(0,p.vb[1]*R2,0));add('vbody.quaternion',[q.x,q.y,q.z,q.w]);});
    for(const n in Tr)c.tracks.push(new THREE.QuaternionKeyframeTrack(n,T,Tr[n]));for(const n in Vt)c.tracks.push(new THREE.VectorKeyframeTrack(n,T,Vt[n]));};
  /* looping clips: one warm-up cycle first, so the elbows start where the cycle ends */
  const CC=(name,dur,fn,o={})=>{PP=null;MIN=o.min||.36;if(o.loop)for(let i=0;i<Math.round(dur*30);i++)solve(fn(i/30),i/30,o);
    const M=[],c=sampleClip(name,dur,t=>{const s=solve(fn(t),t,o);M.push(MEM);return s;},Object.assign({autoFeet:false,fps:o.fps||30},o),B);extra(c,fn,M);
    if(o.next!==undefined){if(o.next)c.next=o.next;}else if(!o.loop)c.next='Idle (war mode)';if(o.hold)c.hold=true;if(o.speed)c.speed=o.speed;L.push(c);MIN=.36;return c;};
  const KC=(name,dur,keys,note,o={})=>{const f=wrKeys(keys.map(q=>[q[0],wrP(o.base||SU_W,q[1]||{})]));return CC(name,dur,o.add?t=>o.add(t,f(t)):f,Object.assign({note},o));};
  /* in-place IK gait (the necromancer's): planted feet slide back at one steady speed, swinging feet come forward lifted */
  const GAIT=(name,dur,G,note)=>{const fn=t=>{const u=t/dur,o=G.body(u),c2=C(D*(u-G.duty/2)),dy=-G.b*C(2*D*(u-G.duty/2));o.HP=[o.HP[0]+G.sw*c2,o.HP[1]+dy,o.HP[2]];
      o.gR=[o.gR[0],o.gR[1]+dy,o.gR[2]];o.gL=[o.gL[0],o.gL[1]+dy,o.gL[2]];
      for(const[sd,off,x,yaw]of[['L',0,G.x,G.yaw[0]],['R',.5,-G.x,G.yaw[1]]]){const q=(((u+off)%1)+1)%1;let z,l,pt;
        if(q<G.duty){const v=q/G.duty;z=G.s*(1-2*v);l=0;pt=v<.15?-8*(1-v/.15):v>.7?G.toe*(v-.7)/.3:0;}
        else{const v=(q-G.duty)/(1-G.duty),sm=v*v*(3-2*v);z=-G.s+2*G.s*sm;l=G.lift*Math.sin(Math.PI*v);pt=G.toe*(1-v)*(1-v)-8*v*v;}
        o['F'+sd]=[x,z+(sd==='L'?1:-1)*(G.st||0),yaw,l,pt];}return o;};
    const sp=2*G.s/(G.duty*dur);CC(name,dur,fn,{loop:true,tp:dur,note:`${note}, in place, ${(sp*k).toFixed(1)} m/s`,speed:sp*k});};

  /* ---- on the ground ---- */
  CC('Idle',5,t=>{const p=D*t/5,b=S(p),b2=S(2*p);return wrP(SU_N,{HP:[.035+.008*b,-.012-.004*b2,0],h:[0,-8,5+2*b],sp:[1+.5*b2,3,-2-.8*b],ch:[-2+.8*b2,4+2*S(p+.8),-4],hd:[6+2*S(2*p+1),-6+16*S(p+.6),5+3*S(p)],
    FR:[-.05,.07,-16,0,6+3*S(p+1)],gR:[-.25,.93+.01*b2,.06+.02*S(p+.5)],gL:[.2,1.0+.008*b2,-.01],wl:[0,0,-40+6*S(3*p)],fist:[20+12*Math.max(0,S(3*p+1)),25],
    wg:[30+3*S(p),30,8,24+4*S(2*p),0],tsw:[30*S(p)]});},
    {loop:true,tp:2.5,note:'Weight on one leg, the hip cocked out, a hand on her hip, wings folded behind her, the tail swaying; looks slowly round, the fingers drum'});
  GAIT('Walk',1.2,{duty:.62,s:.25,lift:.06,toe:16,x:.05,yaw:[6,-6],b:.012,sw:.04,
    body:u=>{const yw=C(D*u),a=C(D*(u-.06));return wrP(SU_N,{HP:[0,-.02,0],h:[1,-8*yw,-8*S(D*(u-.12))],sp:[1,2*yw,3*S(D*(u-.12))],ch:[-3,6*yw,3*S(D*(u-.12))],hd:[4,-4*yw,-2*S(D*(u-.12))],
      gR:[-.25,.93,.06+.08*a],gL:[.25,.93,.06-.08*a],wl:[0,0,-6],wr:[0,0,6],fist:[22,22],tsw:[40*C(D*u)]});}},'A slow, swaying catwalk, one foot in front of the other, hips rolling, the tail swinging');

  /* ---- war mode ---- */
  CC('Idle (war mode)',2.6,t=>{const p=D*t/2.6,b=S(p);return wrP(SU_W,{HP:[0,-.06-.008*b,0],ch:[4+1.2*S(2*p),-4,0],hd:[-6+1.5*S(2*p+1),14+5*S(p),0],
    gL:[.28,1.24+.02*S(p+1.2),.36],gR:[-.3,1.16+.02*S(p+.4),.3],fist:[10+15*Math.max(0,S(2*p)),10+15*Math.max(0,S(2*p+1.5))],wg:[28+4*S(p),35,8,20,0],tsw:[-25*S(p)]});},
    {loop:true,tp:2.6,note:'Wider stance, left foot forward, both clawed hands raised, wings half open, the tail lashing slowly'});
  GAIT('Walk (war mode)',1.3,{duty:.64,s:.21,lift:.06,toe:16,x:.1,yaw:[-2,-30],b:.01,sw:.02,st:.07,
    body:u=>wrP(SU_W,{h:[7,-14-3*C(D*u),0],gL:[.28,1.24,.36-.03*C(D*u)],gR:[-.3,1.16,.3+.03*C(D*u)],tsw:[30*C(D*u)]})},'Stalks forward, claws raised, wings half open');

  /* ---- flight ---- */
  /* Take off: crouches, raises the wings high, a strong downstroke lifts her off and she beats up into the hover */
  KC('Take off',1.8,[[0,{}],
    [.35,{HP:[0,-.14,.02],h:[14,0,0],sp:[6,0,0],hd:[-4,0,0],FL:[.08,.02,4,0,0],FR:[-.08,-.02,-4,0,0],gL:[.32,.96,.1],gR:[-.32,.96,.1],wl:[0,0,-10],wr:[0,0,-10],wg:[78,20,6,0,0],ba:[0],tc:[-40,8,10,12,12,12,10,8,6,4]}],
    [.6,wrP(SU_F,{fl:[.22],h:[8,0,0],wg:[-18,14,20,0,0],ba:[0],gL:[.32,.98,.08],gR:[-.32,.98,.08]})],
    [.95,wrP(SU_F,{fl:[.42],wg:[40,20,10,0,0],ba:[.5]})],
    [1.8,SU_F]],'Crouches and raises the wings high, a strong downstroke lifts her off the ground and she beats up into the hover',{base:SU_N,next:'Hover',beat:.9});
  CC('Hover',1.8,t=>{const a=D*t/1.8;return wrP(SU_F,{fl:[.6+.035*S(D*t/.9-1.2)],HP:[.03*S(a),0,.02*S(2*a)],h:[6,0,3*S(a)],hd:[2+3*S(a*2),12*S(a+.6),3*S(a)],
    FL:[.07,.04+.03*S(a),4,-.04,50+6*S(a)],FR:[-.07,-.1+.03*S(a+1.4),-6,.06,42+6*S(a+1.4)],gL:[.3,1.0+.02*S(a+1),.1],gR:[-.3,1.0+.02*S(a+2),.1],tsw:[30*S(a)]});},
    {loop:true,beat:.9,tp:1.8,next:null,note:'Hovers on slow, strong wing beats, bobbing gently, legs dangling with the toes pointed, the tail swaying'});
  CC('Fly',1.2,t=>{const a=D*t/1.2;return wrP(SU_F,{fl:[.7+.04*S(D*t/.6-1.2)],h:[34,0,4*S(a)],sp:[4,0,0],ch:[0,0,0],nk:[-6,0,0],hd:[-16,0,0],FL:[.07,-.2,4,.05,62],FR:[-.07,-.28,-4,.1,66],
    gL:[.26,.98,-.06],gR:[-.26,.98,-.06],pL:[.6,-.2,-.7],pR:[-.6,-.2,-.7],wg:[18,22,30,8,0],tc:[-20,2,2,2,2,2,2,2,2,2],tw:[.8],tsw:[10*S(a)]});},
    {loop:true,beat:.6,tp:1.2,next:null,speed:4,note:'Flies forward leaning into the air, legs and tail streaming behind, on strong wing beats, in place, 4 m/s'});
  KC('Land',1.6,[[0,SU_F],[.7,wrP(SU_F,{fl:[.2],h:[10,0,0],FL:[.07,.02,4,0,20],FR:[-.07,-.04,-6,.02,20],wg:[40,15,10,0,0],ba:[.6]})],
    [1.0,{HP:[0,-.12,.02],h:[12,0,0],sp:[5,0,0],FL:[.08,.02,4,0,0],FR:[-.08,-.02,-4,0,0],gL:[.32,.96,.1],gR:[-.32,.96,.1],wl:[0,0,-10],wr:[0,0,-10],wg:[60,20,10,0,0],ba:[0]}],
    [1.6,{}]],'Beats down out of the hover, lands softly on bent knees and folds her wings',{base:SU_N,next:'Idle',beat:.9});

  /* ---- charm spells (gestures; the effects are added separately) ---- */
  /* Charm 1 (blown kiss): lifts the left palm before her lips, kisses it and blows the kiss towards the enemy, with a wink of the hip */
  KC('Charm 1 (blown kiss)',2.4,[[0,{}],
    [.6,{h:[2,-8,8],sp:[2,-4,-4],ch:[2,-6,-4],nk:[6,0,0],hd:[6,6,-10],gL:[.14,1.46,.36],wl:[-10,0,-50],fist:[10,25],gR:[-.26,.98,.08],wr:[0,0,6],jw:[0],wg:[22,45,8,30,0]}],
    [1.1,{h:[2,-8,8],sp:[2,-4,-4],ch:[2,-6,-4],nk:[6,0,0],hd:[8,8,-10],gL:[.14,1.47,.37],wl:[-10,0,-50],fist:[5,25],gR:[-.26,.98,.08],wr:[0,0,6],jw:[.12],wg:[22,45,8,30,0]}],
    [1.3,{h:[6,-14,4],sp:[4,-6,-2],ch:[6,-8,-2],nk:[4,0,0],hd:[0,10,-4],gL:[.2,1.44,.58],wl:[0,0,-40],fist:[0,25],gR:[-.26,.98,.08],wr:[0,0,6],jw:[.2],wg:[26,40,8,26,0]}],
    [1.38,{h:[6,-14,4],sp:[4,-6,-2],ch:[6,-8,-2],nk:[4,0,0],hd:[0,10,-4],gL:[.2,1.44,.6],wl:[0,0,-40],fist:[0,25],gR:[-.26,.98,.08],wr:[0,0,6],jw:[.1],wg:[26,40,8,26,0]}],
    [1.9,{hd:[2,14,6],gL:[.28,1.3,.48],jw:[0]}],[2.4,{}]],'Lifts her palm before her lips, kisses it and blows the kiss towards the enemy (the charm leaves at 1.35 s)',{min:.34});
  /* Charm 2 (beckon): holds out her right hand palm up and curls the fingers twice (come here), swaying her hips, then laughs softly */
  KC('Charm 2 (beckon)',3.0,[[0,{}],
    [.5,{h:[0,-10,6],sp:[0,-4,-3],ch:[-3,-6,-3],hd:[8,8,12],gR:[-.24,1.22,.5],wr:[-30,0,0],fist:[20,0],gL:[.2,1.0,-.01],wl:[0,0,-40],jw:[.05],wg:[22,45,8,30,0],tc:[-50,10,12,14,14,14,12,10,8,6]}],
    [2.4,{h:[0,-10,6],sp:[0,-4,-3],ch:[-3,-6,-3],hd:[-6,8,12],gR:[-.25,1.23,.51],wr:[-30,0,0],fist:[20,0],gL:[.2,1.0,-.01],wl:[0,0,-40],jw:[.05],wg:[22,45,8,30,0],tc:[-50,10,12,14,14,14,12,10,8,6]}],
    [3.0,{}]],'Holds out her hand palm up and curls the fingers twice (come here), swaying her hips, then laughs softly',
    {add:(t,p)=>{const o=Object.assign({},p);if(t>.6&&t<1.6){const g=Math.max(0,S(D*(t-.6)/.5));o.fist=[p.fist[0],p.fist[1]+80*g];}
      if(t>.5&&t<2.4){const w=Math.min(1,(t-.5)/.2,(2.4-t)/.2);o.h=[p.h[0],p.h[1],p.h[2]+5*S(D*(t-.5)/1.2)*w];o.tsw=[40*S(D*(t-.5)/1.2)*w];}
      if(t>1.6&&t<2.5){const w=Math.min(1,(t-1.6)/.15,(2.5-t)/.15),g=Math.max(0,S(D*(t-1.6)/.3))*w;o.jw=[p.jw[0]+.3*g];o.ch=[p.ch[0]-2*g,p.ch[1],p.ch[2]];}return o;}});
  /* Charm 3 (enthrall): spreads her wings wide, raises both hands before her face and weaves them in slow circles, then pushes both
     open palms towards the enemy, head tilted, eyes on them */
  {const UP={HP:[0,-.02,0],h:[2,0,4],sp:[-2,0,-2],ch:[-4,0,-2],nk:[2,0,0],hd:[4,0,-10],FL:[.09,.1,-4,0,0],FR:[-.09,-.08,-20,0,0],gL:[.16,1.42,.34],gR:[-.16,1.42,.34],pL:[.7,-.4,-.4],pR:[-.7,-.4,-.4],
    wl:[-10,0,-30],wr:[-10,0,-30],fist:[0,0],wg:[34,4,4,0,0],jw:[.08],tc:[-40,10,12,14,14,14,12,10,8,6]};
  KC('Charm 3 (enthrall)',3.4,[[0,{}],[.6,UP],[2.0,wrP(UP,{hd:[4,0,10]})],
    [2.3,wrP(UP,{h:[6,0,0],sp:[2,0,0],ch:[2,0,0],hd:[0,0,0],gL:[.24,1.4,.56],gR:[-.24,1.4,.56],wl:[-30,0,-10],wr:[-30,0,-10],jw:[.2]})],
    [2.6,wrP(UP,{h:[6,0,0],sp:[2,0,0],ch:[2,0,0],hd:[0,0,0],gL:[.24,1.4,.57],gR:[-.24,1.4,.57],wl:[-30,0,-10],wr:[-30,0,-10],jw:[.1]})],[3.4,{}]],
    'Spreads her wings wide, raises both hands before her face and weaves them in slow circles, then pushes both open palms towards the enemy (the charm takes hold at 2.3 s)',
    {add:(t,p)=>{if(t<.6||t>2.0)return p;const w=Math.min(1,(t-.6)/.25,(2.0-t)/.25),a=D*(t-.6)/.7,o=Object.assign({},p);
      o.gL=[p.gL[0]+.07*C(a)*w,p.gL[1]+.07*S(a)*w,p.gL[2]];o.gR=[p.gR[0]+.07*C(a)*w,p.gR[1]-.07*S(a)*w,p.gR[2]];o.h=[p.h[0],p.h[1],p.h[2]+4*S(a)*w];o.tsw=[30*S(a/2)*w];return o;}});}
  /* Draining kiss: steps in, takes the enemy by the shoulders and wraps her wings round them, kisses and drinks their life, head
     tipping back, then lets go and steps back */
  {const IN={HP:[0,-.04,.16],h:[8,0,0],sp:[4,0,0],ch:[4,0,0],nk:[8,0,0],hd:[10,0,-16],FL:[.09,.3,0,0,0],FR:[-.08,-.04,-18,0,8],gL:[.2,1.42,.62],gR:[-.2,1.42,.62],pL:[.7,-.6,-.2],pR:[-.7,-.6,-.2],
    wl:[10,0,-10],wr:[10,0,-10],fist:[45,45],jw:[.06],wg:[24,-34,0,-20,0],tc:[-40,10,12,14,14,14,12,10,8,6]};
  KC('Draining kiss',3.4,[[0,{}],[.5,wrP(IN,{wg:[40,10,4,0,0],jw:[0]})],[.8,IN],[1.4,wrP(IN,{nk:[6,0,0],hd:[6,0,-18],jw:[.1]})],
    [2.2,wrP(IN,{HP:[0,-.03,.15],sp:[0,0,0],ch:[-6,0,0],nk:[0,0,0],hd:[-14,0,-6],jw:[.25],fist:[60,60]})],
    [2.6,wrP(IN,{HP:[0,-.04,.08],h:[4,0,0],ch:[0,0,0],hd:[-6,0,0],gL:[.26,1.3,.46],gR:[-.26,1.3,.46],fist:[10,10],wg:[34,30,6,10,0],jw:[.1]})],[3.4,{}]],
    'Steps in, takes the enemy by the shoulders and wraps her wings round them, kisses and drinks their life with her head tipping back, then lets go and steps back');}

  /* ---- attacks ---- */
  /* Claw slash: raises the right claw high beside her head and rakes it down and across to the left with a step in */
  KC('Claw slash',1.4,[[0,{}],
    [.38,{h:[2,11,0],sp:[-2,9,0],ch:[-6,14,0],hd:[-4,-12,0],gR:[-.36,1.56,.1],wr:[-20,0,0],fist:[10,-10],gL:[.3,1.16,.3],jw:[.3],wg:[40,30,6,14,0]}],
    [.62,{h:[12,-16,0],sp:[8,-6,0],ch:[8,-10,0],hd:[0,10,0],FL:[.11,.27,-4,0,0],gR:[-.06,1.08,.5],wr:[10,0,0],fist:[10,-10],gL:[.32,1.08,.18],jw:[.6],wg:[22,40,10,24,0]}],
    [.76,{h:[14,-22,0],sp:[9,-8,0],ch:[9,-12,0],hd:[2,14,0],FL:[.11,.27,-4,0,0],gR:[.06,1.0,.42],wr:[10,0,0],fist:[10,-10],gL:[.32,1.06,.16],jw:[.4],wg:[22,40,10,24,0]}],
    [1.4,{}]],'Raises her right claw high beside her head and rakes it down and across with a step in');
  /* Tail lash: turns away to the left and whips her tail round her right side at the enemy */
  KC('Tail lash',1.4,[[0,{}],
    [.38,{h:[4,-22,0],sp:[0,-8,0],ch:[0,-6,0],hd:[0,30,0],FL:[.12,.12,-6,0,0],FR:[-.1,-.12,-24,0,0],tc:[-12,8,8,6,6,4,4,2,2,2],tsw:[-100],tw:[0],wg:[30,40,8,24,0]}],
    [.62,{h:[4,34,0],sp:[0,10,0],ch:[0,8,0],hd:[0,-44,0],FL:[.12,.12,18,0,0],FR:[-.1,-.12,8,0,0],tc:[-4,6,4,2,0,0,0,0,0,0],tsw:[165],tw:[0],jw:[.3],wg:[30,40,8,24,0]}],
    [.78,{h:[4,38,0],sp:[0,11,0],ch:[0,9,0],hd:[0,-48,0],FL:[.12,.12,18,0,0],FR:[-.1,-.12,8,0,0],tc:[-4,6,4,2,0,0,0,-6,-8,-8],tsw:[185],tw:[0],jw:[.2],wg:[30,40,8,24,0]}],
    [1.4,{}]],'Twists away, then turns her back half round and whips her tail round her right side at the enemy, the heart-shaped tip snapping out');
  /* Wing buffet: raises the wings high and back, then slams them forward in a gust that knocks the enemy back */
  KC('Wing buffet',1.4,[[0,{}],
    [.45,{HP:[0,-.08,-.04],h:[-6,0,0],sp:[-6,0,0],ch:[-8,0,0],hd:[-8,0,0],gL:[.34,1.2,.12],gR:[-.34,1.2,.12],wg:[70,70,0,30,0],jw:[.2]}],
    [.64,{HP:[0,-.06,.08],h:[16,0,0],sp:[8,0,0],ch:[6,0,0],hd:[8,0,0],FL:[.11,.24,-4,0,0],gL:[.3,1.1,.34],gR:[-.3,1.1,.34],wg:[-10,-40,-16,-24,0],jw:[.7]}],
    [.8,{HP:[0,-.06,.08],h:[16,0,0],sp:[8,0,0],ch:[6,0,0],hd:[8,0,0],FL:[.11,.24,-4,0,0],gL:[.3,1.1,.34],gR:[-.3,1.1,.34],wg:[-12,-42,-16,-26,0],jw:[.5]}],
    [1.4,{}]],'Raises her wings high and back, then slams them forward in a gust that knocks the enemy back');
  /* Taunt: both hands on her hips, throws her head back and laughs, sways her hips, the tail flicking */
  KC('Taunt',2.6,[[0,{}],
    [.45,{HP:[.03,-.02,0],h:[0,-6,6],sp:[0,2,-3],ch:[-4,2,-3],hd:[4,0,8],FL:[.07,.0,6,0,0],FR:[-.05,.07,-16,0,6],gL:[.2,1.0,-.01],gR:[-.2,1.0,-.01],wl:[0,0,-40],wr:[0,0,-40],fist:[20,20],pL:[.7,-.2,-.6],pR:[-.7,-.2,-.6],wg:[22,50,8,30,0]}],
    [1.0,{HP:[.03,-.02,0],h:[0,-6,6],sp:[-2,2,-3],ch:[-8,2,-3],nk:[-4,0,0],hd:[-18,0,4],FL:[.07,.0,6,0,0],FR:[-.05,.07,-16,0,6],gL:[.2,1.0,-.01],gR:[-.2,1.0,-.01],wl:[0,0,-40],wr:[0,0,-40],fist:[20,20],pL:[.7,-.2,-.6],pR:[-.7,-.2,-.6],wg:[22,50,8,30,0],jw:[.5]}],
    [2.0,{HP:[.03,-.02,0],h:[0,-6,6],sp:[0,2,-3],ch:[-4,2,-3],hd:[6,6,10],FL:[.07,.0,6,0,0],FR:[-.05,.07,-16,0,6],gL:[.2,1.0,-.01],gR:[-.2,1.0,-.01],wl:[0,0,-40],wr:[0,0,-40],fist:[20,20],pL:[.7,-.2,-.6],pR:[-.7,-.2,-.6],wg:[22,50,8,30,0],jw:[.1]}],
    [2.6,{}]],'Puts both hands on her hips, throws her head back and laughs, swaying her hips, the tail flicking',
    {add:(t,p)=>{if(t<.45||t>2.0)return p;const w=Math.min(1,(t-.45)/.2,(2.0-t)/.2),o=Object.assign({},p);o.h=[p.h[0],p.h[1],p.h[2]+6*S(D*(t-.45)/.8)*w];o.tsw=[60*S(D*(t-.45)/.5)*w];
      if(t>.8&&t<1.6){const g=Math.abs(S(D*(t-.8)/.25))*Math.min(1,(t-.8)/.1,(1.6-t)/.1);o.jw=[p.jw[0]+.2*g];}return o;}});

  /* ---- reactions ---- */
  KC('Hit 1',.9,[[0,{}],
    [.1,{HP:[0,-.06,-.1],h:[-8,-10,0],sp:[-8,-4,0],ch:[-12,-6,0],nk:[-8,0,0],hd:[-24,6,8],gL:[.42,1.4,.2],gR:[-.4,1.3,.2],wl:[-10,0,-30],wr:[-10,0,-30],fist:[5,5],jw:[.6],wg:[50,40,0,10,0]}],
    [.36,{HP:[0,-.06,-.05],h:[2,-12,0],sp:[2,-4,0],ch:[0,-6,0],hd:[-8,8,0],gL:[.36,1.3,.32],jw:[.2]}],
    [.9,{}]],'Blow to the face: her head snaps back, her hands fly up and the wings jerk open');
  KC('Hit 2',1.1,[[0,{}],
    [.12,{HP:[.06,-.08,0],h:[6,8,-10],sp:[4,4,-6],ch:[0,6,-8],hd:[-10,24,-12],gL:[.5,1.3,.24],wl:[-10,0,-30],fist:[10,10],jw:[.5],wg:[44,30,6,14,0],tsw:[-60]}],
    [.32,{HP:[.08,-.1,0],h:[6,0,-6],sp:[5,0,-4],ch:[2,0,-6],hd:[-2,16,-6],FL:[.17,.12,2,0,0],gL:[.44,1.24,.32],jw:[.2]}],
    [.62,{HP:[.05,-.08,0],FL:[.17,.12,2,0,0]}],
    [1.1,{}]],'Struck from the right: twists away and catches herself with a step, then turns back');
  KC('Heavy hit',2.5,[[0,{}],
    [.12,{HP:[0,-.08,-.1],h:[-8,-12,0],sp:[-10,-4,0],ch:[-14,-6,0],nk:[-8,0,0],hd:[-26,6,6],gL:[.46,1.38,.2],gR:[-.42,1.3,.2],wl:[-10,0,-30],wr:[-10,0,-30],fist:[5,5],jw:[.7],wg:[54,40,0,10,0]}],
    [.36,{HP:[0,-.24,-.12],h:[8,-12,0],sp:[2,-4,0],ch:[0,-6,0],hd:[-8,8,4],FL:[.12,-.04,-4,.06,30],gL:[.4,1.0,.26],gR:[-.36,1.0,.26],jw:[.4],wg:[30,40,6,20,0]}],
    [.64,{HP:[0,-.41,-.12],h:[18,-12,0],sp:[10,-4,0],ch:[8,-6,0],hd:[6,8,0],FL:[.12,-.38,-4,0,70],FR:[-.12,-.06,-30,0,0],gR:[-.32,.84,.34],wr:[0,0,0],gL:[.3,.7,.3],wl:[0,0,-40],fist:[25,25],jw:[.2],wg:[14,50,10,30,0]}],
    [1.35,{HP:[0,-.41,-.12],h:[20,-12,0],sp:[11,-4,0],ch:[9,-6,0],hd:[-6,14,0],FL:[.12,-.38,-4,0,70],FR:[-.12,-.06,-30,0,0],gR:[-.32,.84,.35],wr:[0,0,0],gL:[.3,.69,.31],wl:[0,0,-40],fist:[25,25],jw:[.3],wg:[14,50,10,30,0]}],
    [1.75,{HP:[0,-.3,-.08],h:[22,-12,0],sp:[10,-4,0],ch:[8,-6,0],hd:[-4,10,0],FL:[.12,-.3,-4,0,42],FR:[-.12,-.08,-30,0,0],gR:[-.34,.92,.32],gL:[.32,.86,.3],fist:[25,25],jw:[.1],wg:[20,45,10,26,0]}],
    [2.05,{HP:[0,-.1,-.02],h:[8,-14,0],FL:[.12,.0,-4,.05,10]}],
    [2.5,{}]],'Knocked down onto her left knee, bracing on it, then rises again');
  /* Death: reels from the blow and sinks onto her knees, the wings sagging; throws her head back and screams, then shrinks to
     nothing (held: gone; the owner adds the effect) */
  {const KN={HP:[0,-.41,-.08],h:[14,-6,0],sp:[6,-2,0],ch:[4,-2,0],nk:[2,0,0],hd:[4,4,0],FL:[.11,-.3,-4,0,72],FR:[-.11,-.32,-14,0,74],gR:[-.32,.76,.28],wr:[0,0,-20],gL:[.34,.74,.26],wl:[0,0,-30],fist:[30,30],wg:[2,60,14,40,0]};
  const SC={h:[4,-6,0],sp:[-4,-2,0],ch:[-11,-2,0],nk:[-8,0,0],hd:[-32,0,0],gL:[.41,.91,.2],gR:[-.4,.91,.2],wl:[-20,0,-30],wr:[-20,0,-30],fist:[0,0],jw:[1],wg:[30,30,4,10,0]};
  KC('Death',4.0,[[0,{}],
    [.14,{HP:[0,-.08,-.12],h:[-10,-12,0],sp:[-10,-4,0],ch:[-14,-6,0],nk:[-8,0,0],hd:[-26,6,6],gL:[.46,1.38,.2],gR:[-.42,1.3,.2],wl:[-10,0,-30],wr:[-10,0,-30],fist:[5,5],jw:[.7],wg:[54,40,0,10,0]}],
    [.5,{HP:[0,-.2,-.1],h:[6,-10,0],sp:[2,-4,0],ch:[0,-4,0],hd:[-4,4,4],FL:[.11,.02,-4,.06,20],gL:[.4,1.0,.28],gR:[-.36,1.0,.28],jw:[.3],wg:[30,50,8,24,0]}],
    [.95,wrP(KN,{jw:[.2]})],
    [1.5,wrP(KN,SC)],[1.9,wrP(KN,wrP(SC,{ch:[-12,-2,0],hd:[-33,0,0]}))],
    [2.15,wrP(KN,wrP(SC,{ch:[-12,-2,0],hd:[-33,0,0],vb:[.7,0]}))],
    [2.45,wrP(KN,wrP(SC,{ch:[-12,-2,0],hd:[-33,0,0],vb:[.001,0]}))],
    [4.0,wrP(KN,wrP(SC,{ch:[-12,-2,0],hd:[-33,0,0],vb:[.001,0]}))]],
    'Reels from the blow and sinks onto her knees, the wings sagging; throws her head back and screams, then shrinks to nothing (held: gone)',{hold:true,next:null,fps:60});}
  return L;}

ASSETS.push({id:'succubus',folder:'characters/enemies/hell',name:'Succubus',kind:'character',variants:true,defaultSeed:1,groundR:2.4,build:(s,o)=>buildSuccubus(s,o||{}),
  opts:[{key:'skin',label:'Skin',choices:[['random','Random'],...Object.entries(SU_SKIN).map(([k,v])=>[k,v[1].charAt(0).toUpperCase()+v[1].slice(1)])],def:'random'},
    {key:'hair',label:'Hair',choices:[['random','Random'],...Object.entries(SU_HAIR).map(([k,v])=>[k,v[1].charAt(0).toUpperCase()+v[1].slice(1)])],def:'random'},
    {key:'eyes',label:'Eyes',choices:[['random','Random'],['pink','Pink glow'],['violet','Violet glow'],['gold','Gold glow'],['red','Red glow']],def:'random'},
    {key:'outfit',label:'Outfit',choices:[['random','Random'],['black','Black leather'],['crimson','Crimson leather'],['purple','Purple leather']],def:'random'},
    {key:'horns',label:'Horns',choices:[['random','Random'],['curved','Curved back'],['ram','Ram'],['tall','Tall']],def:'random'},
    {key:'wings',label:'Wings',choices:[['random','Random'],['dark','Dark (skin)'],['black','Black'],['crimson','Crimson']],def:'random'}],
  desc:'Succubus: a seductive winged demoness of about 1.8 m with coloured skin, long hair, glowing eyes in smoky make-up, full lips and horns; a leather bodice with gold lacing, bare midriff with a gold waist chain, leather briefs, long fingerless gloves, thigh-high heeled boots and a choker with a glowing gem. Big bat wings and a long tail with a heart-shaped tip. Walks and flies. Clips: Idle, Walk, war-mode Idle and Walk, Take off, Hover, Fly, Land, Charm 1 (blown kiss), Charm 2 (beckon), Charm 3 (enthrall), Draining kiss, Claw slash, Tail lash, Wing buffet, Taunt, Hit 1, Hit 2, Heavy hit and Death. Spell effects are added separately.'});
