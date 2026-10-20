/* ======================= DEVIL LORD: a winged devil lord, a spellcaster with a staff and a scimitar (Enemies → Hell) =======================
   After the owner's reference art: a tall, powerful devil (VB.dlord: the villager male's proportions x 1.22 with broader shoulders,
   about 2.2 m to the top of the head) with near-black skin crossed by glowing cracks, a bald head with a heavy brow, a stern face,
   slanted glowing eyes and a hard mouth (the lower face is the jaw g_jaw, fire glowing inside), long swept-back pointed ears and big
   ridged black horns (crescent: out, up and the tips turning in; or ram, or swept back). Muscular bare torso; black spiked armour
   with glowing runes (no crosses: bars, chevrons and diamonds): layered pauldrons, bracers, belt with a front plate, tassets, knee
   guards and greaves; a tattered loincloth hanging in front (dl_flap_0/1, laid in front of the thighs every frame); clawed hands and
   clawed beast feet. Big tattered bat wings on the shoulder blades (dwing_{L,R} with a folding outer half dwingO_{L,R}): half closed
   on the ground, spread in flight. A long spined tail (dtail_0..11). A staff in the left hand (weapon_L), a scimitar in the right
   (weapon_R).
   Built from its own meshes on the villager's 25 joints inside a body group (vbody), so the warrior's IK (wrSolve) fits unchanged.
   Clips use the succubus's arm machinery (hand targets turn with the body's yaw, elbow poles by a cost search) with a prop in each
   hand carried the necromancer's way (the elbow chosen so a straight wrist already points the prop, the wrist bends it the rest,
   clamped; neither prop goes below the ground), the succubus's wing beat and tail. Spell effects are added separately. */
VB.dlord=Object.assign({},VB.male,{thigh:.52,shin:.5,ankle:.07,hipOff:.06,spine:.13,chest:.26,neck:.26,headY:.08,shW:.3,ua:.36,fa:.32,g:1.22,hipW:.09,sex:'male'});
{const b=VB.dlord;b.key='dlord';b.hipH=b.thigh+b.shin+b.ankle+b.hipOff;b.legS=(b.thigh+b.shin)/.84;b.tS=(b.spine+b.chest)/.3;b.cS=b.neck/.22;}
const DL_SKIN={obsidian:['#292326','obsidian black'],ash:['#464243','ash grey'],blood:['#3e2224','blood dark']};
const DL_GLOW={red:['#eea373','#dc664b','red','#dc664b'],orange:['#f6ce78','#ed964e','orange','#ed964e'],violet:['#f3e7ff','#9568c6','violet','#9568c6'],green:['#e6fbea','#66d396','green','#b0e8c3']};
const DL_HORN={crescent:'great crescent horns curving in at the tips',ram:'curling ram horns',swept:'long horns swept back'};
const DL_STAFF={orb:'a glowing orb held in black horns',skull:'a horned skull with glowing eyes',gem:'a glowing shard in an iron cage'};
const DL_BLADE={infernal:'a black iron scimitar with glowing runes',steel:'a dark steel scimitar'};
const DL_WS=1.6,DL_TAIL=12,DL_TL=.11;
/* the staff: grip at the origin, local y up; the foot 1.2 m below the grip */
function dlStaff(kind,glow,glowB){const w=new THREE.Group(),iron=bm('#1c1a1d','plain'),ironD=bm('#141115','plain'),ironL=bm('#3a363b','plain'),wrap=bm('#311c1b','leather'),bone=bm('#cdc4b2','plain'),boneD=bm('#847b6b','plain');
  bx(w,.05,2.15,.05,iron,0,-.125,0);for(const y of[-.9,-.5,.45])bx(w,.056,.1,.056,ironD,0,y,0);bx(w,.064,.28,.064,wrap,0,0,0);
  for(const y of[-1.15,-.3,.16,-.16,.7])bx(w,.07,.035,.07,ironL,0,y,0);bx(w,.03,.06,.03,ironD,0,-1.2,0);
  bx(w,.09,.07,.09,ironL,0,.97,0);bx(w,.05,.04,.05,glow,0,.93,0,0,Math.PI/4,0);
  if(kind==='orb'){for(const s of[-1,1])ncHorn(w,[[s*.02,.99,0],[s*.08,1.05,0],[s*.115,1.14,0],[s*.1,1.24,0],[s*.05,1.3,.0]],.04,.016,iron,ironD);
    bx(w,.12,.12,.12,glow,0,1.14,0,.6,.6,0);bx(w,.07,.07,.07,glowB,0,1.14,0,0,.8,.6);}
  else if(kind==='skull'){bx(w,.13,.12,.13,bone,0,1.06,-.01);bx(w,.09,.12,.08,bone,0,1.01,.08);bx(w,.07,.04,.05,boneD,0,.96,.11);
    for(const s of[-1,1]){bx(w,.03,.02,.012,glow,s*.035,1.06,.12);ncHorn(w,[[s*.05,1.11,-.02],[s*.11,1.16,-.04],[s*.16,1.17,-.1],[s*.17,1.12,-.15],[s*.15,1.07,-.13]],.04,.016,iron,ironD);}}
  else{const g=new THREE.Group();g.position.set(0,1.13,0);g.scale.set(1,1.8,1);w.add(g);bx(g,.09,.09,.09,glow,0,0,0,0,0,Math.PI/4);bx(g,.05,.05,.05,glowB,0,0,0,0,0,Math.PI/4);
    for(const[x,z]of[[1,0],[-1,0],[0,1],[0,-1]])ncHorn(w,[[x*.03,.99,z*.03],[x*.09,1.06,z*.09],[x*.1,1.16,z*.1],[x*.05,1.25,z*.05],[x*.012,1.29,z*.012]],.026,.014,iron,ironD);}
  return w;}
/* the scimitar: grip at the origin, the blade along local y, its edge towards +x, curving back towards -x; barbs on the spine */
function dlScimitar(kind,glow){const w=new THREE.Group(),iron=bm('#1c1a1d','plain'),ironL=bm('#3a363b','plain'),grip=bm('#311c1b','leather');
  const inf=kind==='infernal',bl=bm(inf?'#262328':'#57585f','plain'),sp=bm(inf?'#141015':'#35363d','plain'),ed=bm(inf?'#514d53':'#94989d','plain');
  bx(w,.045,.2,.045,grip,0,-.02,0);for(const y of[-.08,.04])bx(w,.05,.015,.05,iron,0,y,0);bx(w,.06,.05,.06,ironL,0,-.14,0,0,Math.PI/4,0);bx(w,.025,.04,.025,iron,0,-.18,0);
  bx(w,.13,.03,.08,iron,0,.095,0);for(const s of[-1,1])ncHorn(w,[[s*.06,.095,0],[s*.09,.13,0],[s*.1,.17,0]],.024,.01,iron,iron);
  const n=8,y0=.13,Lb=1.0;
  for(let i=0;i<n;i++){const u=(i+.5)/n,wd=.075+.04*Math.sin(Math.min(1,u*1.15)*Math.PI*.55),x=-.16*u*u,a=Math.atan(-.32*u),h=Lb/n,cy=y0+h*(i+.5),g=new THREE.Group();
    put(w,g,x,cy,0,0,0,-a);
    if(i<n-1){bx(g,wd,h*1.06,.018,bl,0,0,0);bx(g,.016,h*1.06,.022,sp,-wd/2+.008,0,0);bx(g,.012,h*1.06,.012,ed,wd/2-.005,0,0);
      if(inf&&i>0&&i<6)bx(g,i%2?.014:.024,h*.5,.024,glow,-wd*.12,0,0,0,0,i%2?0:.6);
      if(i%2===1)bx(g,.04,.04,.016,sp,-wd/2-.012,h*.25,0,0,0,.7);}
    else{bx(g,wd*.7,h*.6,.018,bl,-wd*.1,-h*.2,0);bx(g,wd*.45,h*.45,.018,bl,-wd*.22,h*.22,0,0,0,.55);bx(g,.012,h*.75,.012,ed,wd*.22,-.01,0,0,0,.5);}}
  return w;}

function buildDevilLord(seed,o={}){const B=VB.dlord,r=mulberry32(((seed*2654435761)>>>0)^0xd3b1),pick=a=>a[Math.floor(r()*a.length)],root=new THREE.Group();root.userData.lights=[];
  /* roll everything, then let the options override */
  const skin0=pick(['obsidian','obsidian','ash','blood']),glow0=pick(['red','red','orange','violet','green']),horn0=pick(['crescent','crescent','ram','swept']),staff0=pick(Object.keys(DL_STAFF)),blade0=pick(['infernal','infernal','steel']);
  const opt=(k,d)=>o[k]&&o[k]!=='random'?o[k]:d,skinK=opt('skin',skin0),glowK=opt('glow',glow0),hornK=opt('horns',horn0),staffK=opt('staff',staff0),bladeK=opt('blade',blade0);
  const shade=(h,f)=>'#'+new THREE.Color(h).multiplyScalar(f).getHexString(),SK=DL_SKIN[skinK][0];
  const skin=bm(SK,'skin'),skinL=bm(shade(SK,1.3),'skin'),skinD=bm(shade(SK,.72),'skin'),dark=bm('#120d14','plain'),claw=bm('#161315','plain'),teeth=bm('#d6cdbb','plain');
  const iron=bm('#1c1a1d','plain'),ironL=bm('#3d393e','plain'),ironD=bm('#141115','plain'),lea=bm('#1c1515','leather'),leaD=bm('#150f0f','leather'),cloth=bm('#341717','cloth'),clothD=bm('#1f1412','cloth');
  const horn=bm('#141012','plain'),hornD=bm('#252122','plain');
  const gl=DL_GLOW[glowK],eyeM=wrGlow(gl[3],gl[1],1.6,pxTex('plain')),runeM=wrGlow(gl[0],gl[1],1.3,pxTex('plain')),crackM=wrGlow(shade(gl[1],.8),gl[1],.9,pxTex('plain')),glowB=wrGlow('#f6f1e6',gl[1],2.4,pxTex('plain'));
  const wingB=bm('#181113','skin'),memb=bm(skinK==='ash'?'#372727':'#351f1d','plain'),membD=bm(skinK==='ash'?'#271b1a':'#211412','plain');
  const vb=new THREE.Group();vb.name='vbody';root.add(vb);
  const hips=J('hips',vb,0,B.hipH,0),spine=J('spine',hips,0,B.spine,0),chest=J('chest',spine,0,B.chest,0),neck=J('neck',chest,0,B.neck,0),head=J('head',neck,0,B.headY,0);
  /* glowing cracks: thin glowing bars laid on a surface */
  const crack=(par,x,y,z,len,rz,ry=0)=>{bx(par,.006,len*.55,.005,crackM,x,y+len*.22,z,0,ry,rz);bx(par,.006,len*.5,.005,crackM,x+.006,y-len*.22,z,0,ry,rz-.5);};
  /* runes (no crosses): a bar, a chevron, a diamond */
  const rune=(par,x,y,z,k,ry=0)=>{const g=new THREE.Group();g.position.set(x,y,z);g.rotation.y=ry;par.add(g);
    if(k===0)bx(g,.014,.06,.008,runeM,0,0,0);else if(k===1){bx(g,.012,.04,.008,runeM,-.01,0,0,0,0,.5);bx(g,.012,.04,.008,runeM,.01,0,0,0,0,-.5);}else bx(g,.03,.03,.008,runeM,0,0,0,0,0,Math.PI/4);};
  /* hips: dark loin wrap, a wide leather belt with iron studs and a spiked iron front plate with a rune; the tattered loincloth hangs in
     front in two pieces (dl_flap_0 from the belt, dl_flap_1 below it), laid in front of the thighs by the clips */
  bx(hips,.38,.2,.26,leaD,0,-.06,0);bx(hips,.41,.1,.28,lea,0,.03,0);for(let i=0;i<8;i++){const a=i/8*Math.PI*2;bx(hips,.022,.022,.022,ironL,Math.sin(a)*.2,.03,Math.cos(a)*.137);}
  bx(hips,.17,.15,.03,iron,0,.0,.15);bx(hips,.19,.02,.035,ironL,0,.075,.15);rune(hips,0,.0,.168,1);for(const s of[-1,1])bx(hips,.03,.05,.02,ironD,s*.07,-.07,.155,0,0,s*.4);
  const f0=new THREE.Group();f0.name='dl_flap_0';f0.position.set(0,-.06,.15);hips.add(f0);bx(f0,.18,.34,.018,cloth,0,-.17,.0);bx(f0,.02,.34,.02,clothD,-.06,-.17,0);bx(f0,.02,.3,.02,clothD,.05,-.15,0);
  const f1=new THREE.Group();f1.name='dl_flap_1';f1.position.set(0,-.34,0);f0.add(f1);
  [[-.07,.2],[-.035,.27],[0,.22],[.035,.3],[.07,.18]].forEach(([x,h],i)=>bx(f1,.036,h,.016,i%2?clothD:cloth,x,-h/2,0));
  /* waist: abs, obliques and glowing cracks */
  bx(spine,.34,.36,.23,skin,0,.08,0);for(const s of[-1,1])for(const y of[.0,.07,.14])bx(spine,.07,.055,.02,skinL,s*.042,y,.112);bx(spine,.012,.22,.01,skinD,0,.07,.117);
  for(const s of[-1,1])bx(spine,.04,.26,.2,skinD,s*.165,.08,0,0,0,-s*.08);crack(spine,.09,.04,.12,.12,.5);crack(spine,-.11,.16,.112,.08,-.3);
  /* chest: broad and muscular (pecs, traps, lats), cracks glowing through */
  bx(chest,.46,.3,.26,skin,0,.12,0);bx(chest,.52,.12,.24,skin,0,.08,-.01);bx(chest,.32,.1,.2,skin,0,.27,-.02);
  for(const s of[-1,1]){bx(chest,.2,.12,.05,skin,s*.1,.17,.13);bx(chest,.19,.02,.04,skinD,s*.1,.11,.14);bx(chest,.06,.14,.2,skinD,s*.25,.1,-.01);}
  bx(chest,.012,.14,.01,skinD,0,.17,.156);crack(chest,.12,.18,.157,.14,.7);crack(chest,.16,.13,.157,.08,-.4);crack(chest,-.07,.2,.157,.1,-.9);crack(chest,-.14,.16,.157,.12,.3);crack(chest,.02,.05,.132,.1,.2);
  /* neck: thick, a heavy iron gorget plate at the back */
  bx(neck,.18,.16,.18,skin,0,.04,0);bx(neck,.04,.14,.02,skinD,0,.03,.09);bx(chest,.36,.1,.06,iron,0,.3,-.13,-.3,0,0);
  /* head: bald, a heavy brow sloping down to the nose, slanted glowing eyes, high hard cheekbones, a broad short nose, a hard straight
     mouth; the jaw (g_jaw: square chin, teeth, fire inside) opens; glowing cracks; long ears swept back */
  bx(head,.25,.25,.27,skin,0,.2,0);bx(head,.2,.08,.15,skin,0,.05,-.06);bx(head,.23,.06,.22,skin,0,.33,-.02);
  for(const s of[-1,1]){bx(head,.13,.04,.05,skinD,s*.062,.235,.13,0,0,s*.22);bx(head,.06,.03,.014,dark,s*.06,.2,.137,0,0,s*.18);bx(head,.05,.013,.01,eyeM,s*.06,.201,.143,0,0,s*.18);
    bx(head,.06,.012,.012,skinD,s*.075,.17,.137,0,0,-s*.35);bx(head,.008,.016,.01,teeth,s*.034,.088,.136);}
  bx(head,.04,.1,.04,skin,0,.16,.148);bx(head,.044,.025,.044,skinD,0,.118,.15);bx(head,.08,.01,.012,dark,0,.096,.137);
  crack(head,.06,.29,.137,.07,.5);crack(head,-.1,.13,.137,.06,.25);
  for(const s of[-1,1]){const eg=new THREE.Group();eg.position.set(s*.13,.2,-.02);eg.rotation.set(-.75,s*.55,-s*.15);head.add(eg);
    bx(eg,.022,.09,.07,skin,s*.012,0,0);bx(eg,.02,.07,.05,skin,s*.016,.06,-.015);bx(eg,.017,.06,.034,skinD,s*.02,.12,-.026);bx(eg,.013,.05,.018,skinD,s*.022,.17,-.034);}
  const jw=new THREE.Group();jw.name='g_jaw';head.add(jw);jw.position.set(0,.09,0);
  bx(jw,.23,.08,.16,skin,0,-.04,.05);bx(jw,.13,.045,.07,skin,0,-.075,.1);bx(jw,.13,.02,.04,skinD,0,-.095,.11);bx(jw,.09,.012,.012,dark,0,-.002,.131);
  bx(jw,.08,.012,.04,teeth,0,-.004,.108);bx(head,.13,.05,.09,eyeM,0,.065,.06);bx(head,.08,.035,.06,glowB,0,.06,.05);crack(jw,.07,-.05,.131,.05,.4);
  /* horns from the temples, black and ridged, pointing outwards */
  const HP={crescent:[[.1,.3,.03],[.17,.33,.02],[.23,.39,0],[.27,.47,-.02],[.27,.56,-.03],[.24,.64,-.03],[.19,.7,-.02],[.13,.73,-.01]],
    ram:[[.09,.3,.05],[.15,.37,.02],[.22,.38,-.05],[.27,.32,-.11],[.28,.23,-.1],[.25,.17,-.04],[.22,.17,.03]],
    swept:[[.08,.31,.06],[.12,.39,.03],[.15,.47,-.03],[.17,.54,-.12],[.17,.59,-.23],[.15,.61,-.33],[.12,.6,-.41]]}[hornK];
  for(const s of[-1,1])ncHorn(head,HP.map(([x,y,z])=>[s*x,y,z]),hornK==='swept'?.08:.1,.024,horn,hornD);
  /* arms: layered spiked pauldrons with runes, big bare arms with cracks, spiked iron bracers with runes, clawed hands */
  for(const[sd,s]of[['L',1],['R',-1]]){const sh=J('shoulder_'+sd,chest,s*B.shW*.325,.165*B.cS,0),ua=J('upperArm_'+sd,sh,s*B.shW*.675,0,0),fa=J('foreArm_'+sd,ua,0,-B.ua,0),hd=J('hand_'+sd,fa,0,-B.fa,0);
    const fg=J('fingers_'+sd,hd,0,-.12,0),ft=J('fingerTips_'+sd,fg,0,-.055,0),th=J('thumb_'+sd,hd,-s*.024,-.04,.055),so=J('socket_'+sd,hd,-s*.016,-.09,0);so.userData.socket=true;
    bx(ua,.24,.07,.24,iron,s*.02,.07,0);bx(ua,.27,.06,.26,ironD,s*.03,.02,0);bx(ua,.28,.05,.27,iron,s*.035,-.03,0);bx(ua,.285,.012,.275,ironL,s*.035,-.055,0);
    ncHorn(ua,[[s*.06,.1,0],[s*.08,.17,0],[s*.07,.24,-.01]],.05,.014,ironD,iron);ncHorn(ua,[[s*.13,.04,0],[s*.19,.08,0],[s*.23,.09,0]],.04,.012,ironD,iron);rune(ua,s*.17,.0,.0,1,s*Math.PI/2);
    bx(ua,.16,.34,.16,skin,0,-.2,0);bx(ua,.11,.15,.06,skinL,0,-.2,.07);crack(ua,s*.081,-.22,.02,.14,.4,Math.PI/2);
    bx(fa,.15,.1,.15,skin,0,-.04,0);bx(fa,.16,.22,.16,iron,0,-.19,0);bx(fa,.17,.02,.17,ironL,0,-.09,0);bx(fa,.17,.02,.17,ironL,0,-.29,0);rune(fa,s*.082,-.19,0,0,s*Math.PI/2);
    for(const y of[-.15,-.23])ncHorn(fa,[[s*.07,y,-.02],[s*.12,y+.01,-.04],[s*.15,y+.03,-.05]],.03,.01,ironD,iron);
    bx(hd,.07,.12,.12,skin,0,-.06,0);
    for(const[z,Lp]of[[.04,.055],[.013,.062],[-.013,.058],[-.04,.048]]){const g1=new THREE.Group(),g2=new THREE.Group();g1.position.set(0,0,z);fg.add(g1);g2.position.set(0,.055-Lp,z);ft.add(g2);
      bx(g1,.026,Lp,.026,skin,0,-Lp/2+.003,0);bx(g2,.023,.04,.023,skin,0,-.02,0);bx(g2,.017,.03,.017,claw,-s*.002,-.05,0);bx(g2,.01,.022,.01,claw,-s*.005,-.072,0);}
    const tg=new THREE.Group();tg.rotation.set(-.6,0,-s*.15);th.add(tg);bx(tg,.03,.055,.03,skin,0,-.024,0);bx(tg,.026,.036,.026,skin,0,-.06,0);bx(tg,.016,.03,.016,claw,0,-.088,0);}
  /* legs: dark leather thighs with iron tassets on the outside, spiked knee guards, iron greaves with runes, clawed beast feet (three
     toes and a heel spur; the sole is the IK foot's) */
  for(const[sd,s]of[['L',1],['R',-1]]){const th=J('thigh_'+sd,hips,s*B.hipW,-(B.hipOff+.01),0),sn=J('shin_'+sd,th,0,-B.thigh,0),ft=J('foot_'+sd,sn,0,-B.shin,0);
    bx(th,.18,.52,.19,leaD,0,-.25,0);bx(th,.12,.3,.05,skin,0,-.33,.07);
    for(const[y,h]of[[-.02,.13],[-.12,.13]]){bx(th,.05,h,.2,iron,s*.1,y,0,0,0,s*.08);bx(th,.054,.012,.205,ironL,s*.103,y-h/2+.006,0,0,0,s*.08);}rune(th,s*.128,-.07,0,2,s*Math.PI/2);
    bx(sn,.17,.13,.06,iron,0,-.02,.065);bx(sn,.18,.015,.065,ironL,0,-.08,.065);ncHorn(sn,[[0,.0,.085],[0,.07,.11],[0,.13,.12]],.045,.014,ironD,iron);
    bx(sn,.15,.42,.15,skin,0,-.27,0);bx(sn,.17,.34,.1,iron,0,-.27,.04);for(const s2 of[-1,1])bx(sn,.03,.32,.12,ironD,s2*.08,-.27,.01);rune(sn,0,-.25,.093,0);rune(sn,0,-.35,.093,2);
    bx(ft,.14,.08,.14,skin,0,-.04,-.01);bx(ft,.03,.03,.04,claw,0,-.05,-.075,-.4,0,0);
    for(const x of[-.045,0,.045]){bx(ft,.042,.045,.13,skin,x,-.058,.07);bx(ft,.03,.03,.03,claw,x,-.065,.14);bx(ft,.02,.02,.02,claw,x,-.07,.155);}}
  /* wings on the shoulder blades, tattered: an inner arm bone and membrane, then the folding outer half with finger bones, a long lower
     finger from the tip ending in a talon, a hooked thumb claw and spines; the membrane is torn: ragged lengths, a few holes (local x
     outwards, hanging down from the leading edge; the clips pitch it back) */
  const spike=(par,x,y,w,len,m,rz=0)=>{const g=new THREE.Group();g.position.set(x,y,0);g.rotation.z=rz;g.scale.set(1,len/w,1);par.add(g);bx(g,w*.7071,w*.7071,.01,m,0,0,0,0,0,Math.PI/4);return g;};
  /* a membrane strip from the edge down to h, with an optional hole between h0 and h1 */
  const strip=(par,x,w,h,m,hole)=>{if(!hole){bx(par,w,h,.008,m,x,-h/2,0);return;}const[h0,h1]=hole;bx(par,w,h0,.008,m,x,-h0/2,0);bx(par,w,h-h1,.008,m,x,-(h1+h)/2,0);};
  for(const[sd,s]of[['L',1],['R',-1]]){const w0=new THREE.Group();w0.name='dwing_'+sd;w0.position.set(s*.13,.17,-.125);chest.add(w0);const w=new THREE.Group();w.scale.setScalar(DL_WS);w0.add(w);
    const a=.4,b=.55;bx(w,.07,.07,.07,wingB,0,0,0);bx(w,a,.042,.042,wingB,s*a/2,0,0);spike(w,s*.06,.05,.03,.08,claw,-s*.3);
    [[.38,.07,null],[.46,.2,[.2,.26]],[.5,.33,null]].forEach(([h,x,ho])=>{strip(w,s*x,.135,h,memb,ho);spike(w,s*(x+.02),-h-.05,.06,.12,membD);});
    const wo=new THREE.Group();wo.name='dwingO_'+sd;wo.position.set(s*a,0,0);w.add(wo);bx(wo,.06,.06,.06,wingB,0,0,0);
    ncHorn(wo,[[0,.02,0],[s*.01,.09,.01],[-s*.015,.15,.03]],.034,.012,claw,claw);
    bx(wo,b,.036,.036,wingB,s*b/2,0,0);spike(wo,s*(b+.04),.03,.045,.12,claw,-s*1.0);for(const x of[.18,.36])spike(wo,s*x,.04,.024,.06,claw,-s*.4);
    const bone=(x0,y0,x1,y1,t)=>{const L=Math.hypot(x1-x0,y1-y0),an=Math.atan2(y1-y0,x1-x0);bx(wo,L,t,t,wingB,s*(x0+x1)/2,(y0+y1)/2,.008,0,0,s*an);};
    bone(0,0,.135,-.6,.024);bone(0,0,.315,-.72,.024);bone(.02,0,.05,-.54,.024);bone(b,0,.495,-.84,.028);spike(wo,s*.494,-.93,.04,.2,claw);
    [[.5,.045,null],[.6,.135,[.3,.37]],[.62,.225,null],[.7,.315,[.44,.5]],[.74,.405,null],[.82,.495,null]].forEach(([h,x,ho],i)=>{strip(wo,s*x,.092,h,memb,ho);if(i<5)spike(wo,s*(x+.01),-h-.06,.06,.15+.05*(i%2),membD);});}
  /* tail: twelve segments from the base of the spine, tapering, a row of spines along the top, ending in a barbed spike */
  {let p=hips;for(let i=0;i<DL_TAIL;i++){const g=new THREE.Group();g.name='dtail_'+i;g.position.set(0,i?0:-.06,i?-DL_TL:-.12);p.add(g);const t=.09-i*.0058;
    bx(g,t,t,DL_TL+.012,i%3===1?skinD:skin,0,0,-DL_TL/2);if(i<DL_TAIL-1)bx(g,.016,t*.55,.03,claw,0,t/2+t*.2,-DL_TL/2,-.5,0,0);if(i%4===2)crack(g,0,-t/2-.001,-DL_TL/2,.06,0);p=g;}
    const z=-DL_TL;bx(p,.03,.03,.12,claw,0,0,z-.05);for(const s of[-1,1])bx(p,.012,.02,.07,claw,s*.025,0,z-.01,0,s*.6,0);}
  const joints=[];root.traverse(q=>{if(q.userData.joint&&!q.userData.socket)joints.push(q);});root.userData.joints=joints;
  /* the staff in the left hand, the scimitar in the right */
  const wl=new THREE.Group();wl.name='weapon_L';wl.userData.gear=true;root.getObjectByName('socket_L').add(wl);const st=dlStaff(o.bare?'orb':staffK,runeM,glowB);st.quaternion.copy(SH_BASIS());wl.add(st);
  const wr=new THREE.Group();wr.name='weapon_R';wr.userData.gear=true;root.getObjectByName('socket_R').add(wr);const sc=dlScimitar(o.bare?'steel':bladeK,runeM);sc.quaternion.copy(SH_BASIS());wr.add(sc);
  if(o.bare)return root;
  if(!o.noClips){root.userData.clips=devilLordClips();const mx=new THREE.AnimationMixer(root);mx.clipAction(root.userData.clips[0]).play();mx.update(0);}
  root.userData.ground=2.8;
  const cap=s=>s.charAt(0).toUpperCase()+s.slice(1);
  root.userData.variantText=`${cap(DL_SKIN[skinK][1])} skin with glowing ${gl[2]} cracks and eyes, ${DL_HORN[hornK]}; black spiked armour with ${gl[2]} runes, tattered loincloth, tattered bat wings and a spined tail. Staff with ${DL_STAFF[staffK]}; ${DL_BLADE[bladeK]}.`;
  return root;}

/* ---------- clips ---------- */
let DL_CLIPS=null;
/* Pose channels: the succubus's (fl lifts the hips, feet and hands together; x,z of the hands hips-relative, y absolute) with a prop
   in each hand: dL the staff's direction (up from the fist), dR the scimitar's; wl, wr extra wrist bends (the left one mirrored);
   jw jaw, vb body [scale, spin°]; wings wg [elevation, sweep back, pitch back, outer fold back, outer droop] and ba wing-beat
   amplitude (0 holds wg); tail tc curl per segment (12), tw wave, tsw sway.
   Relaxed (DL_N): standing square and tall, feet apart, the staff planted upright at his left side, the scimitar low at his right,
   point forward; wings half closed behind him, the tail low behind with the tip curling up. War (DL_W): wider, left foot forward,
   the staff angled ahead, the scimitar raised, wings half open. Hover (DL_F): lifted, legs hanging, wings spread wide and beating. */
const DL_N={fl:[0],HP:[0,-.01,0],h:[0,0,0],sp:[1,0,0],ch:[-2,0,0],nk:[2,0,0],hd:[2,0,0],FL:[.11,.03,6,0,0],FR:[-.11,-.01,-8,0,0],
  gL:[.38,1.0,.14],dL:[0,1,0],pL:[.6,-.3,-.7],gR:[-.36,.92,.08],dR:[0,-.45,.9],pR:[-.6,-.3,-.7],wl:[0,0,0],wr:[0,0,0],fist:[95,95],jw:[0],vb:[1,0],
  wg:[40,55,10,50,-30],ba:[0],tc:[-40,4,4,4,6,6,6,8,10,14,18,22],tw:[.4],tsw:[0]};
const DL_W=wrP(DL_N,{HP:[0,-.06,0],h:[4,-14,0],sp:[3,-4,0],ch:[3,-6,0],nk:[0,0,0],hd:[-4,14,0],FL:[.13,.17,-4,0,0],FR:[-.13,-.15,-30,0,0],
  gL:[.4,1.12,.32],dL:[.05,.92,.38],gR:[-.38,1.12,.34],dR:[-.2,.55,.8],wg:[36,48,8,40,-18],tc:[-34,4,6,6,6,6,6,6,8,10,12,14],tw:[1]});
const DL_F=wrP(DL_N,{fl:[.7],HP:[0,0,0],h:[6,0,0],sp:[0,0,0],ch:[-2,0,0],nk:[0,0,0],hd:[2,0,0],FL:[.09,.04,4,-.04,46],FR:[-.09,-.1,-6,.06,40],
  gL:[.42,1.06,.2],dL:[.08,.92,.35],gR:[-.4,1.0,.22],dR:[-.1,-.2,.97],wg:[16,20,14,6,0],ba:[1],tc:[-52,4,4,4,4,4,4,4,4,6,8,10],tw:[1]});
function dlRig(){const B=VB.dlord,m=buildDevilLord(1,{bare:true}),J={};m.traverse(q=>{if(q.userData.joint||/^(dwing|dtail|dl_flap)/.test(q.name))J[q.name]=q;});
  const tail=[];for(let i=0;i<DL_TAIL;i++)tail.push(J['dtail_'+i]);return{m,J,B,two:false,lprop:true,tail};}

function devilLordClips(){if(DL_CLIPS)return DL_CLIPS;const B=VB.dlord,D=Math.PI*2,S=Math.sin,C=Math.cos,V=THREE.Vector3,Q=THREE.Quaternion,E3=THREE.Euler,L=[],R=dlRig(),k=B.legS,R2=Math.PI/180;
  const vv=new V();
  const lowOwn=g=>{g.updateMatrixWorld(true);let y=1e9;for(const q of g.children){if(!q.isMesh)continue;const P=q.geometry.parameters;for(let i=0;i<8;i++){vv.set((i&1?.5:-.5)*P.width,(i&2?.5:-.5)*P.height,(i&4?.5:-.5)*P.depth).applyMatrix4(q.matrixWorld);if(vv.y<y)y=vv.y;}}return y;};
  const lowAll=g=>{g.updateMatrixWorld(true);let y=1e9;g.traverse(q=>{if(!q.isMesh)return;const P=q.geometry.parameters;for(let i=0;i<8;i++){vv.set((i&1?.5:-.5)*P.width,(i&2?.5:-.5)*P.height,(i&4?.5:-.5)*P.depth).applyMatrix4(q.matrixWorld);if(vv.y<y)y=vv.y;}});return y;};
  /* each prop's box corners in its socket's space, for the ground check (every staff head) */
  const C8={L:[],R:[]};{const bq=SH_BASIS(),w=bm('#fff','plain'),mk=(sd,g)=>{g.updateMatrixWorld(true);g.traverse(m=>{if(!m.isMesh)return;const gp=m.geometry.parameters;
      for(let i=0;i<8;i++)C8[sd].push(new V((i&1?.5:-.5)*gp.width,(i&2?.5:-.5)*gp.height,(i&4?.5:-.5)*gp.depth).applyMatrix4(m.matrixWorld).applyQuaternion(bq));});};
    for(const kd of Object.keys(DL_STAFF))mk('L',dlStaff(kd,w,w));mk('R',dlScimitar('infernal',w));}
  const cv=new V(),propLow=sd=>{R.m.updateMatrixWorld(true);const M=R.J['socket_'+sd].matrixWorld;let y=1e9;for(const c of C8[sd]){cv.copy(c).applyMatrix4(M);if(cv.y<y)y=cv.y;}return y;};
  /* hand targets and prop directions turn with the body's yaw (hips + spine + chest) */
  const yawF=p=>{const y=(p.h[1]+p.sp[1]+p.ch[1])*R2,c=Math.cos(y),sn=Math.sin(y),rt=v=>[v[0]*c+v[2]*sn,v[1],-v[0]*sn+v[2]*c],o=Object.assign({},p);for(const q of['gR','gL','dR','dL'])o[q]=rt(p[q]);return o;};
  const restQ={L:new Q().setFromEuler(new E3(0,0,BASEPOSE.upperArm_L[2]*R2)),R:new Q().setFromEuler(new E3(0,0,BASEPOSE.upperArm_R[2]*R2))};
  /* elbow poles by score round the shoulder-to-hand line (the succubus's terms), plus the necromancer's prop term on both arms: a
     straight wrist sends the prop out of the fist across the forearm towards the shoulder side, so the elbow is placed where that
     already points along the prop's direction */
  let MIN=.4,PP=null;const M4=new THREE.Matrix4();
  const poles=p=>{R.m.updateMatrixWorld(true);const o=Object.assign({},p),hp=(p.HP||[0,0,0]).map(v=>v*k),cq=R.J.chest.getWorldQuaternion(new Q()),up=new V(0,1,0),fw=new V(0,0,1).applyQuaternion(cq),nx={};
    for(const[sd,s]of[['L',1],['R',-1]]){const G=p['g'+sd],Sh=R.J['upperArm_'+sd].getWorldPosition(new V()),shW=R.J['shoulder_'+sd].getWorldQuaternion(new Q()),shq=shW.clone().invert(),sq=shW.clone().multiply(restQ[sd]);
      const T=new V(G[0]*k+hp[0],G[1]*k,G[2]*k+hp[2]).sub(Sh);if(T.length()<MIN){T.setLength(MIN);o['g'+sd]=[(Sh.x+T.x-hp[0])/k,(Sh.y+T.y)/k,(Sh.z+T.z-hp[2])/k];}const d=Math.min(T.length(),(B.ua+B.fa)*.999),u=T.normalize(),bone=new V(0,-1,0).applyQuaternion(sq);
      const al=Math.acos(Math.min(1,Math.max(-1,(B.ua*B.ua+d*d-B.fa*B.fa)/(2*B.ua*d)))),inw=new V(-s,0,0).applyQuaternion(cq),dS=new V(...p['d'+sd]).normalize(),Wp=u.clone().multiplyScalar(d);
      const el0=new V(0,0,-1).applyQuaternion(sq).applyQuaternion(new Q().setFromUnitVectors(bone,u)),b1=el0.clone().addScaledVector(u,-el0.dot(u)).normalize(),b2=new V().crossVectors(u,b1);
      let prev=PP&&PP[sd]?PP[sd].clone().addScaledVector(u,-PP[sd].dot(u)):null;if(prev&&prev.lengthSq()<.04)prev=null;if(prev)prev.normalize();let best=null,bc=1e9;
      for(const lim of[.866,-2])if(!best)
      for(let i=0;i<120;i++){const f=i/120*D,pp=b1.clone().multiplyScalar(C(f)).addScaledVector(b2,S(f)),e=u.clone().multiplyScalar(C(al)).addScaledVector(pp,S(al));
        const Y=e.clone().negate(),Z=pp.clone().addScaledVector(e,-pp.dot(e)).normalize().negate(),lq=shq.clone().multiply(new Q().setFromRotationMatrix(M4.makeBasis(new V().crossVectors(Y,Z),Y,Z)));let rr=Math.abs(2*Math.atan2(lq.y,lq.w));if(rr>Math.PI)rr=D-rr;
        if(prev&&pp.dot(prev)<lim||pp.dot(inw)>.35)continue;let c=(rr/1.4)**2+3*Math.max(0,pp.dot(inw)+.1)**2+3*Math.max(0,pp.dot(up)+.15)**2+1.5*Math.max(0,-pp.dot(inw)-.55)**2+2*Math.max(0,pp.dot(fw)-.2)**2+(prev?.5*(1-pp.dot(prev)):0);
        const E=e.clone().multiplyScalar(B.ua),F=Wp.clone().sub(E).normalize(),inn=E.negate();inn.addScaledVector(F,-inn.dot(F));
        if(inn.lengthSq()>1e-8){inn.normalize();const yf=F.clone().negate(),xf=new V().crossVectors(yf,inn),side=dS.dot(xf),fx=Math.atan2(-dS.dot(yf),dS.dot(inn));c+=8*side*side+.4*fx*fx+4*Math.max(0,Math.abs(fx)-1.05)**2;}
        if(c<bc){bc=c;best=pp;}}
      if(!best)best=prev||el0;nx[sd]=best;o['p'+sd]=best.toArray();}
    PP=nx;return o;};
  const lift=p=>{const o=Object.assign({},p),f=p.fl[0];o.HP=[p.HP[0],p.HP[1]+f,p.HP[2]];for(const c of['FL','FR']){const F=p[c].slice();F[3]=(F[3]||0)+f;o[c]=F;}o.gR=[p.gR[0],p.gR[1]+f,p.gR[2]];o.gL=[p.gL[0],p.gL[1]+f,p.gL[2]];return o;};
  /* each hand follows its forearm, bent by the wrist towards its prop's direction (x tips it forward or back, clamped to 95°; y leans
     it sideways, clamped to 35°), plus the keyed bend (wl mirrored) */
  const wrist=(s,p,sd)=>{R.m.updateMatrixWorld(true);const fq=R.J['foreArm_'+sd].getWorldQuaternion(new Q()),d=new V(...p['d'+sd]).normalize().applyQuaternion(fq.invert());
    const th=Math.max(-95*R2,Math.min(95*R2,Math.atan2(-d.y,d.z))),ph=Math.max(-35*R2,Math.min(35*R2,Math.asin(Math.max(-1,Math.min(1,d.x))))),w=sd==='L'?[p.wl[0],-p.wl[1],-p.wl[2]]:p.wr;
    const q=new Q().setFromEuler(new E3(th,0,0)).multiply(new Q().setFromEuler(new E3(0,ph,0))).multiply(new Q().setFromEuler(new E3(w[0]*R2,w[1]*R2,w[2]*R2)));
    R.J['hand_'+sd].quaternion.copy(q);const e=new E3().setFromQuaternion(q);s['w'+sd]=[e.x/R2,e.y/R2,e.z/R2];};
  const wingQ=(s,el,sw,pi)=>new Q().setFromEuler(new E3(pi*R2,s*sw*R2,s*el*R2,'YZX'));
  const hq=new Q(),tv=new V();
  let MEM=null;
  const solve=(p0,t,o)=>{let p=yawF(lift(p0));wrSolve(R,p);p=poles(p);let s=wrSolve(R,p);wrist(s,p,'L');wrist(s,p,'R');
    /* a prop that would go below the ground lifts its hand */
    for(let it=0;it<4;it++){let moved=false;for(const sd of['L','R']){const dy=.012-propLow(sd);if(dy>3e-4){const g=p['g'+sd];p['g'+sd]=[g[0],g[1]+dy/k,g[2]];moved=true;}}
      if(!moved)break;s=wrSolve(R,p);wrist(s,p,'L');wrist(s,p,'R');}
    s.fist=p.fist;R.m.updateMatrixWorld(true);
    /* loincloth: the upper piece swings forward with the thigh that is furthest forward (so it lies in front of both), the lower piece
       hangs closer to plumb; both are kept above the ground */
    R.J.hips.getWorldQuaternion(hq).invert();let a1=0;
    for(const sd of['L','R']){tv.set(0,-1,0).applyQuaternion(R.J['thigh_'+sd].getWorldQuaternion(new Q()).premultiply(hq));a1=Math.max(a1,Math.atan2(tv.z,-tv.y)/R2+4);}
    let a2=-a1*.65;const f0=R.J.dl_flap_0,f1=R.J.dl_flap_1;
    const setF=()=>{f0.quaternion.setFromEuler(new E3(-a1*R2,0,0));f1.quaternion.setFromEuler(new E3(-a2*R2,0,0));};setF();
    for(let it=0;it<40&&lowAll(f0)<.012;it++){a2-=4;if(it>15)a1+=4;setF();}
    const flap=[f0.quaternion.clone(),f1.quaternion.clone()];
    /* wings: the keyed pose plus the beat; lifted (elevation) wherever they would touch the ground */
    const bt=suBeat(o.bu?o.bu(t):t/(o.beat||1.0)),ba=p.ba[0],wv=p.wg.map((v,i)=>v+bt[i]*ba),wing={};
    for(const[sd,s1]of[['L',1],['R',-1]]){const g=R.J['dwing_'+sd],go=R.J['dwingO_'+sd];let el=wv[0];go.quaternion.setFromEuler(new E3(0,s1*wv[3]*R2,s1*wv[4]*R2,'YZX'));
      g.quaternion.copy(wingQ(s1,el,wv[1],wv[2]));if(lowAll(g)<.012)for(let dd=3;dd<=120;dd+=3){g.quaternion.copy(wingQ(s1,el+dd,wv[1],wv[2]));if(lowAll(g)>=.012){el+=dd;break;}}
      wing[sd]=[g.quaternion.clone(),go.quaternion.clone()];}
    /* tail: curl and a travelling wave; a segment that would go into the ground curls up (or down) just enough */
    const ph=D*t/(o.tp||2.4),tq=[];
    for(let i=0;i<DL_TAIL;i++){const g=R.tail[i];let ax=p.tc[i]+p.tw[0]*4*S(ph-.5*i);const ay=p.tsw[0]/DL_TAIL+p.tw[0]*5*S(ph-.5*i+1.3);
      const set=a=>g.quaternion.setFromEuler(new E3(a*R2,ay*R2,0,'YXZ'));set(ax);
      if(lowOwn(g)<.012){let ok=null;for(let dd=3;dd<=180&&ok===null;dd+=3)for(const sg of[1,-1]){set(ax+sg*dd);if(lowOwn(g)>=.012){ok=ax+sg*dd;break;}}ax=ok===null?ax:ok;set(ax);}
      tq.push(g.quaternion.clone());}
    MEM={wing,tq,flap};return s;};
  /* extra tracks every clip carries: wings, tail, loincloth, jaw, body group (scale about its middle and spin) */
  const extra=(c,fn,M)=>{const T=Array.from(c.tracks[0].times),q=new Q(),e=new E3(),Tr={},Vt={},add=(n,v,tb=Tr)=>{(tb[n]||(tb[n]=[])).push(...v);};
    T.forEach((t,i)=>{const p=fn(t),m=M[i];
      for(const sd of['L','R']){add(`dwing_${sd}.quaternion`,m.wing[sd][0].toArray());add(`dwingO_${sd}.quaternion`,m.wing[sd][1].toArray());}
      m.tq.forEach((tq,j)=>add(`dtail_${j}.quaternion`,tq.toArray()));m.flap.forEach((fq,j)=>add(`dl_flap_${j}.quaternion`,fq.toArray()));
      q.setFromEuler(e.set(p.jw[0],0,0));add('g_jaw.quaternion',[q.x,q.y,q.z,q.w]);
      const s=Math.max(.001,p.vb[0]);add('vbody.scale',[s,s,s],Vt);add('vbody.position',[0,1.2*(1-s),0],Vt);q.setFromEuler(e.set(0,p.vb[1]*R2,0));add('vbody.quaternion',[q.x,q.y,q.z,q.w]);});
    for(const n in Tr)c.tracks.push(new THREE.QuaternionKeyframeTrack(n,T,Tr[n]));for(const n in Vt)c.tracks.push(new THREE.VectorKeyframeTrack(n,T,Vt[n]));};
  /* looping clips: one warm-up cycle first, so the elbows start where the cycle ends */
  const CC=(name,dur,fn,o={})=>{PP=null;MIN=o.min||.4;if(o.loop)for(let i=0;i<Math.round(dur*30);i++)solve(fn(i/30),i/30,o);
    const M=[],c=sampleClip(name,dur,t=>{const s=solve(fn(t),t,o);M.push(MEM);return s;},Object.assign({autoFeet:false,fps:o.fps||30},o),B);extra(c,fn,M);
    if(o.next!==undefined){if(o.next)c.next=o.next;}else if(!o.loop)c.next='Idle (war mode)';if(o.hold)c.hold=true;if(o.speed)c.speed=o.speed;L.push(c);MIN=.4;return c;};
  const KC=(name,dur,keys,note,o={})=>{const f=wrKeys(keys.map(q=>[q[0],wrP(o.base||DL_W,q[1]||{})]));return CC(name,dur,o.add?t=>o.add(t,f(t)):f,Object.assign({note},o));};
  /* in-place IK gait (the succubus's): planted feet slide back at one steady speed, swinging feet come forward lifted */
  const GAIT=(name,dur,G,note)=>{const fn=t=>{const u=t/dur,o=G.body(u),c2=C(D*(u-G.duty/2)),dy=-G.b*C(2*D*(u-G.duty/2));o.HP=[o.HP[0]+G.sw*c2,o.HP[1]+dy,o.HP[2]];
      o.gR=[o.gR[0],o.gR[1]+dy,o.gR[2]];o.gL=[o.gL[0],o.gL[1]+dy,o.gL[2]];
      for(const[sd,off,x,yaw]of[['L',0,G.x,G.yaw[0]],['R',.5,-G.x,G.yaw[1]]]){const q=(((u+off)%1)+1)%1;let z,l,pt;
        if(q<G.duty){const v=q/G.duty;z=G.s*(1-2*v);l=0;pt=v<.15?-8*(1-v/.15):v>.7?G.toe*(v-.7)/.3:0;}
        else{const v=(q-G.duty)/(1-G.duty),sm=v*v*(3-2*v);z=-G.s+2*G.s*sm;l=G.lift*Math.sin(Math.PI*v);pt=G.toe*(1-v)*(1-v)-8*v*v;}
        o['F'+sd]=[x,z+(sd==='L'?1:-1)*(G.st||0),yaw,l,pt];}return o;};
    const sp=2*G.s/(G.duty*dur);CC(name,dur,fn,{loop:true,tp:dur,note:`${note}, in place, ${(sp*k).toFixed(1)} m/s`,speed:sp*k});};

  /* ---- on the ground ---- */
  CC('Idle',5,t=>{const p=D*t/5,b=S(p),b2=S(2*p);return wrP(DL_N,{HP:[0,-.01-.005*b2,0],ch:[-2+1*b2,0,0],hd:[2+1.5*S(2*p+1),12*S(p+.6),1.5*S(p)],
    gL:[.38,1.0+.006*b2,.14],gR:[-.36,.92+.01*b2,.08],wg:[40+3*S(p),55,10,50+4*S(2*p),-30],tsw:[24*S(p)]});},
    {loop:true,tp:2.5,note:'Stands square and tall, the staff planted upright at his side, the scimitar low; breathes and looks slowly round, wings half closed, the tail swaying'});
  GAIT('Walk',1.3,{duty:.62,s:.25,lift:.07,toe:12,x:.09,yaw:[4,-4],b:.012,sw:.02,
    body:u=>{const yw=C(D*u),a=C(D*(u-.06));return wrP(DL_N,{HP:[0,-.02,0],h:[2,-5*yw,0],sp:[1,2*yw,0],ch:[-1,4*yw,0],hd:[2,-3*yw,0],
      gL:[.38,1.04,.16+.04*a],gR:[-.37,.94,.08-.08*a],dR:[0,-.4,.92],tsw:[30*C(D*u)]});}},'A slow, heavy stride, the staff carried upright, the tail swinging');

  /* ---- war mode ---- */
  CC('Idle (war mode)',2.6,t=>{const p=D*t/2.6,b=S(p);return wrP(DL_W,{HP:[0,-.06-.008*b,0],ch:[3+1.2*S(2*p),-6,0],hd:[-4+1.5*S(2*p+1),14+5*S(p),0],
    gL:[.4,1.12+.015*S(p+1.2),.32],gR:[-.38,1.12+.02*S(p+.4),.34],dR:[-.2,.55+.06*S(p),.8],wg:[36+4*S(p),48,8,40,-18],tsw:[-20*S(p)]});},
    {loop:true,tp:2.6,note:'Wider stance, left foot forward, the staff angled ahead, the scimitar raised, wings half open, the tail lashing slowly'});
  GAIT('Walk (war mode)',1.3,{duty:.64,s:.21,lift:.065,toe:12,x:.12,yaw:[-2,-28],b:.01,sw:.016,st:.07,
    body:u=>wrP(DL_W,{h:[6,-14-3*C(D*u),0],gL:[.4,1.12,.32-.03*C(D*u)],gR:[-.38,1.12,.34+.03*C(D*u)],tsw:[24*C(D*u)]})},'Advances, staff and scimitar held ready');

  /* ---- flight ---- */
  /* Take off: crouches, opens and raises the wings high, a strong downstroke lifts him off and he beats up into the hover */
  KC('Take off',1.9,[[0,{}],
    [.4,{HP:[0,-.14,.02],h:[14,0,0],sp:[6,0,0],hd:[-4,0,0],FL:[.11,.02,4,0,0],FR:[-.11,-.02,-4,0,0],gL:[.42,1.0,.16],dL:[.05,.95,.25],gR:[-.4,.96,.16],dR:[-.1,-.3,.95],wg:[80,22,6,0,0],ba:[0],tc:[-30,4,6,6,6,6,6,6,6,6,6,6]}],
    [.66,wrP(DL_F,{fl:[.22],h:[8,0,0],wg:[-16,14,20,0,0],ba:[0]})],
    [1.0,wrP(DL_F,{fl:[.46],wg:[40,20,10,0,0],ba:[.5]})],
    [1.9,DL_F]],'Crouches, opens and raises the wings high, a strong downstroke lifts him off the ground and he beats up into the hover',{base:DL_N,next:'Hover',beat:1.0});
  CC('Hover',2.0,t=>{const a=D*t/2.0;return wrP(DL_F,{fl:[.7+.04*S(D*t/1.0-1.2)],HP:[.03*S(a),0,.02*S(2*a)],h:[6,0,3*S(a)],hd:[2+3*S(a*2),12*S(a+.6),3*S(a)],
    FL:[.09,.04+.03*S(a),4,-.04,46+6*S(a)],FR:[-.09,-.1+.03*S(a+1.4),-6,.06,40+6*S(a+1.4)],gL:[.42,1.06+.02*S(a+1),.2],gR:[-.4,1.0+.02*S(a+2),.22],tsw:[24*S(a)]});},
    {loop:true,beat:1.0,tp:2.0,next:null,note:'Hovers on slow, strong beats of his spread wings, bobbing gently, legs hanging, the tail swaying'});
  CC('Fly',1.4,t=>{const a=D*t/1.4;return wrP(DL_F,{fl:[.8+.05*S(D*t/.7-1.2)],h:[30,0,3*S(a)],sp:[4,0,0],ch:[0,0,0],nk:[-6,0,0],hd:[-14,0,0],FL:[.09,-.2,4,.05,60],FR:[-.09,-.28,-4,.1,64],
    gL:[.38,1.0,-.02],dL:[.05,.6,.8],gR:[-.36,.98,-.04],dR:[-.05,-.1,1],pL:[.6,-.2,-.7],pR:[-.6,-.2,-.7],wg:[16,22,30,8,0],tc:[-20,2,2,2,2,2,2,2,2,2,2,2],tw:[.8],tsw:[10*S(a)]});},
    {loop:true,beat:.7,tp:1.4,next:null,speed:5,note:'Flies forward leaning into the air, legs and tail streaming behind, on strong beats of the spread wings, in place, 5 m/s'});
  KC('Land',1.7,[[0,DL_F],[.75,wrP(DL_F,{fl:[.22],h:[10,0,0],FL:[.09,.02,4,0,20],FR:[-.09,-.04,-6,.02,20],wg:[40,15,10,0,0],ba:[.6]})],
    [1.05,{HP:[0,-.12,.02],h:[12,0,0],sp:[5,0,0],FL:[.11,.02,4,0,0],FR:[-.11,-.02,-4,0,0],gL:[.42,1.0,.16],dL:[.05,.95,.25],gR:[-.4,.96,.16],dR:[-.1,-.3,.95],wg:[60,24,8,20,0],ba:[0]}],
    [1.7,{}]],'Beats down out of the hover, lands on bent knees and folds his wings half closed',{base:DL_N,next:'Idle',beat:1.0});

  /* ---- spells (gestures; the effects are added separately) ---- */
  /* Spell 1 (hellfire bolt): draws the staff back, then thrusts its head at the enemy (the bolt leaves at 0.8 s) */
  KC('Spell 1 (hellfire bolt)',2.0,[[0,{}],
    [.45,{h:[2,8,0],sp:[-2,6,0],ch:[-6,10,0],hd:[-4,4,0],gL:[.44,1.32,.06],dL:[.05,.85,-.5],jw:[.1]}],
    [.78,{h:[10,-8,0],sp:[6,-4,0],ch:[6,-4,0],hd:[-6,10,0],FL:[.13,.26,-4,0,0],gL:[.38,1.36,.6],dL:[.12,.4,.9],jw:[.5]}],
    [.86,{h:[10,-8,0],sp:[6,-4,0],ch:[6,-4,0],hd:[-6,10,0],FL:[.13,.26,-4,0,0],gL:[.38,1.37,.61],dL:[.12,.38,.91],jw:[.4]}],
    [1.3,{h:[6,-12,0],ch:[4,-6,0],FL:[.13,.22,-4,0,0],gL:[.4,1.24,.48],dL:[.05,.7,.7],jw:[.1]}],
    [2.0,{}]],'Draws the staff back, then thrusts its head at the enemy (the bolt leaves at 0.8 s)');
  /* Spell 2 (ring of fire): raises the staff high over his head, the scimitar out to the side, then drives the staff's foot into the
     ground before him (the ring of fire bursts out at 1.6 s) */
  {const UP={HP:[0,0,0],h:[-2,-6,0],sp:[-4,-2,0],ch:[-8,-2,0],nk:[-4,0,0],hd:[-16,6,0],FL:[.12,.08,-2,0,0],FR:[-.12,-.1,-20,0,0],gL:[.38,1.72,.14],dL:[0,1,.05],gR:[-.58,1.3,.1],dR:[-.6,.6,.4],wg:[56,30,6,24,0]};
  const DN={HP:[0,-.2,.04],h:[16,-8,0],sp:[8,-2,0],ch:[8,-4,0],nk:[4,0,0],hd:[8,10,0],FL:[.13,.18,-4,0,0],FR:[-.13,-.22,-26,0,0],gL:[.32,1.06,.5],dL:[0,1,.08],gR:[-.52,1.0,.2],dR:[-.5,-.1,.86],wg:[30,40,8,40,-10]};
  KC('Spell 2 (ring of fire)',3.0,[[0,{}],[.7,wrP(UP,{jw:[.3]})],[1.3,wrP(UP,{gL:[.38,1.76,.15],jw:[.6]})],[1.6,wrP(DN,{jw:[.7]})],[1.72,wrP(DN,{jw:[.5]})],
    [2.4,wrP(DN,{HP:[0,-.19,.04],jw:[.2]})],[3.0,{}]],'Raises the staff high over his head, then drives its foot into the ground before him (the ring of fire bursts out at 1.6 s)');}
  /* Spell 3 (summon): rises a little off the ground, wings spread wide, the staff raised high and the scimitar flung out, head thrown
     back, calling up his minions; settles again */
  {const HI={fl:[.3],HP:[0,0,0],h:[-3,0,0],sp:[-5,0,0],ch:[-9,0,0],nk:[-6,0,0],hd:[-20,0,0],FL:[.09,-.02,6,-.06,40],FR:[-.09,-.05,-6,-.05,36],gL:[.58,1.62,.1],dL:[.15,1,0],gR:[-.68,1.44,.08],dR:[-.8,.5,.2],wg:[20,14,10,0,0],ba:[0],tc:[-50,4,4,4,4,4,4,4,6,8,10,12]};
  KC('Spell 3 (summon)',3.4,[[0,{}],[.5,{HP:[0,-.16,0],h:[14,-4,0],sp:[8,-2,0],ch:[8,-2,0],hd:[10,6,0],gL:[.38,1.0,.34],dL:[0,1,.1],gR:[-.38,.98,.32],dR:[-.2,.2,.95],wg:[60,30,8,30,0],jw:[.1]}],
    [1.1,wrP(HI,{fl:[.22],jw:[.6]})],[1.3,wrP(HI,{jw:[.9]})],[2.3,wrP(HI,{fl:[.32],gL:[.59,1.63,.1],gR:[-.69,1.45,.08],jw:[.7]})],[2.9,{fl:[.06]}],[3.4,{}]],
    'Rises a little off the ground, wings spread wide, the staff raised high and the scimitar flung out, head thrown back, calling up his minions; settles again (the summoning at 1.3 s)');}
  /* Spell 4 (rain of fire): from the hover, rises, lifts the staff high, then sweeps its head down at the ground before him (the fire
     falls at 1.25 s) and beats back into the hover */
  KC('Spell 4 (rain of fire)',2.6,[[0,{}],
    [.6,{fl:[.86],h:[-4,0,0],sp:[-4,0,0],ch:[-8,0,0],hd:[-12,0,0],gL:[.42,1.74,.1],dL:[0,.9,-.4],gR:[-.52,1.2,.1],dR:[-.5,.2,.85],wg:[30,16,10,0,0],ba:[.6],jw:[.4]}],
    [1.2,{fl:[.8],h:[14,-6,0],sp:[6,-2,0],ch:[8,-4,0],hd:[10,6,0],gL:[.36,1.2,.56],dL:[-.05,-.35,.94],gR:[-.46,1.04,.24],dR:[-.3,-.2,.93],wg:[10,24,16,6,0],ba:[1],jw:[.7]}],
    [1.4,{fl:[.79],h:[14,-6,0],sp:[6,-2,0],ch:[8,-4,0],hd:[10,6,0],gL:[.36,1.18,.57],dL:[-.05,-.38,.92],gR:[-.46,1.04,.24],dR:[-.3,-.2,.93],wg:[10,24,16,6,0],ba:[1],jw:[.5]}],
    [2.6,{}]],'From the hover he rises and lifts the staff high, then sweeps its head down at the ground before him (the fire falls at 1.25 s) and beats back into the hover',{base:DL_F,next:'Hover',beat:1.0});

  /* ---- attacks ---- */
  /* Scimitar slash: raises the scimitar high beside his right shoulder and cuts down and across to the left with a step in */
  const RAISE={h:[2,12,0],sp:[-2,8,0],ch:[-6,12,0],hd:[-4,-10,0],gR:[-.52,1.6,.12],dR:[-.35,.88,-.3],gL:[.42,1.16,.3],jw:[.3],wg:[44,40,8,36,0]};
  KC('Scimitar slash',1.4,[[0,{}],[.38,RAISE],
    [.62,{h:[12,-16,0],sp:[8,-6,0],ch:[8,-10,0],hd:[0,10,0],FL:[.13,.27,-4,0,0],gR:[-.12,1.1,.62],dR:[.5,-.25,.83],gL:[.44,1.08,.2],jw:[.6],wg:[30,50,10,46,0]}],
    [.76,{h:[14,-22,0],sp:[9,-8,0],ch:[9,-12,0],hd:[2,14,0],FL:[.13,.27,-4,0,0],gR:[.0,.98,.58],dR:[.62,-.4,.67],gL:[.44,1.06,.18],jw:[.4],wg:[30,50,10,46,0]}],
    [1.4,{}]],'Raises the scimitar high beside his right shoulder and cuts down and across with a step in');
  /* Scimitar combo: the same downward cut, then a backhand cut out to the right */
  KC('Scimitar combo',2.0,[[0,{}],[.38,RAISE],
    [.62,{h:[12,-16,0],sp:[8,-6,0],ch:[8,-10,0],hd:[0,10,0],FL:[.13,.27,-4,0,0],gR:[-.12,1.1,.62],dR:[.5,-.25,.83],gL:[.44,1.08,.2],jw:[.6],wg:[30,50,10,46,0]}],
    [.78,{h:[14,-22,0],sp:[9,-8,0],ch:[9,-12,0],hd:[2,14,0],FL:[.13,.27,-4,0,0],gR:[.0,1.04,.56],dR:[.55,-.1,.83],gL:[.44,1.06,.18],jw:[.3],wg:[30,50,10,46,0]}],
    [1.08,{h:[8,8,0],sp:[4,6,0],ch:[4,8,0],hd:[0,-6,0],FL:[.13,.27,-4,0,0],gR:[-.62,1.26,.42],dR:[-.85,.1,.5],gL:[.42,1.1,.24],jw:[.7],wg:[30,50,10,46,0]}],
    [1.2,{h:[8,10,0],sp:[4,7,0],ch:[4,9,0],hd:[0,-8,0],FL:[.13,.27,-4,0,0],gR:[-.66,1.24,.32],dR:[-.9,.05,.42],gL:[.42,1.1,.24],jw:[.4],wg:[30,50,10,46,0]}],
    [2.0,{}]],'Cuts down and across with a step in, then whips a backhand cut out to the right');
  /* Scimitar thrust: draws the blade back at his side, point forward, and lunges to drive the point at the enemy */
  KC('Scimitar thrust',1.5,[[0,{}],
    [.42,{HP:[0,-.08,-.04],h:[4,14,0],sp:[0,6,0],ch:[-2,10,0],hd:[-2,-12,0],gR:[-.46,1.12,-.04],dR:[0,.12,1],gL:[.44,1.14,.32],jw:[.2]}],
    [.7,{HP:[0,-.14,.12],h:[14,-12,0],sp:[6,-4,0],ch:[6,-6,0],hd:[2,12,0],FL:[.13,.36,-4,0,0],FR:[-.13,-.2,-30,0,0],gR:[-.22,1.28,.72],dR:[.05,.05,1],gL:[.46,1.1,.1],jw:[.6]}],
    [.86,{HP:[0,-.14,.12],h:[14,-12,0],sp:[6,-4,0],ch:[6,-6,0],hd:[2,12,0],FL:[.13,.36,-4,0,0],FR:[-.13,-.2,-30,0,0],gR:[-.22,1.28,.73],dR:[.05,.05,1],gL:[.46,1.1,.1],jw:[.4]}],
    [1.5,{}]],'Draws the scimitar back at his side, point forward, and lunges to drive the point at the enemy');
  /* Tail lash: turns away to the left and whips the tail round his right side at the enemy */
  KC('Tail lash',1.5,[[0,{}],
    [.4,{h:[4,-22,0],sp:[0,-8,0],ch:[0,-6,0],hd:[0,30,0],FL:[.14,.12,-6,0,0],FR:[-.12,-.12,-24,0,0],tc:[-14,6,6,6,4,4,4,2,2,2,2,2],tsw:[-100],tw:[0]}],
    [.64,{h:[4,34,0],sp:[0,10,0],ch:[0,8,0],hd:[0,-44,0],FL:[.14,.12,18,0,0],FR:[-.12,-.12,8,0,0],tc:[-6,4,4,2,0,0,0,0,0,0,0,0],tsw:[165],tw:[0],jw:[.3]}],
    [.8,{h:[4,38,0],sp:[0,11,0],ch:[0,9,0],hd:[0,-48,0],FL:[.14,.12,18,0,0],FR:[-.12,-.12,8,0,0],tc:[-6,4,4,2,0,0,0,0,-4,-6,-8,-8],tsw:[185],tw:[0],jw:[.2]}],
    [1.5,{}]],'Turns away, then swings round and whips his tail round his right side at the enemy, the barbed tip snapping out');
  /* Wing buffet: raises the wings high and back, then slams them forward in a gust */
  KC('Wing buffet',1.5,[[0,{}],
    [.48,{HP:[0,-.08,-.04],h:[-6,0,0],sp:[-6,0,0],ch:[-8,0,0],hd:[-8,0,0],gL:[.46,1.18,.2],gR:[-.46,1.16,.2],wg:[72,64,0,20,0],jw:[.2]}],
    [.68,{HP:[0,-.06,.08],h:[16,0,0],sp:[8,0,0],ch:[6,0,0],hd:[8,0,0],FL:[.13,.24,-4,0,0],gL:[.4,1.1,.36],gR:[-.4,1.1,.36],wg:[-6,-36,-14,-20,0],jw:[.7]}],
    [.84,{HP:[0,-.06,.08],h:[16,0,0],sp:[8,0,0],ch:[6,0,0],hd:[8,0,0],FL:[.13,.24,-4,0,0],gL:[.4,1.1,.36],gR:[-.4,1.1,.36],wg:[-8,-38,-14,-22,0],jw:[.5]}],
    [1.5,{}]],'Raises his wings high and back, then slams them forward in a gust that knocks the enemy back');
  /* Roar: spreads his arms and wings wide, chest out, and roars at the enemy, fire glowing in his throat */
  KC('Roar',2.6,[[0,{}],
    [.5,{HP:[0,-.1,0],h:[8,0,0],sp:[6,0,0],ch:[6,0,0],nk:[4,0,0],hd:[6,0,0],gL:[.48,1.08,.3],gR:[-.48,1.04,.3],wg:[44,40,8,30,0],jw:[.1]}],
    [.9,{HP:[0,-.04,0],h:[-2,0,0],sp:[-6,0,0],ch:[-10,0,0],nk:[-4,0,0],hd:[-4,0,0],FL:[.13,.12,-4,0,0],gL:[.64,1.3,.14],dL:[.25,.96,.05],gR:[-.66,1.28,.14],dR:[-.6,.5,.5],wg:[22,18,10,4,0],jw:[.6]}],
    [1.9,{HP:[0,-.04,0],h:[-2,0,0],sp:[-6,0,0],ch:[-11,0,0],nk:[-4,0,0],hd:[-6,0,0],FL:[.13,.12,-4,0,0],gL:[.65,1.31,.14],dL:[.25,.96,.05],gR:[-.67,1.29,.14],dR:[-.6,.5,.5],wg:[22,18,10,4,0],jw:[.58]}],
    [2.6,{}]],'Spreads his arms and wings wide, chest out, and roars at the enemy (fire glows in his throat)',
    {add:(t,p)=>{if(t<.9||t>1.9)return p;const o=Object.assign({},p),g=S(D*(t-.9)/.12)*Math.min(1,(t-.9)/.1,(1.9-t)/.1);o.hd=[p.hd[0]+1.5*g,p.hd[1]+2*g,p.hd[2]];return o;}});

  /* ---- reactions ---- */
  KC('Hit 1',.9,[[0,{}],
    [.1,{HP:[0,-.06,-.1],h:[-8,-10,0],sp:[-8,-4,0],ch:[-12,-6,0],nk:[-8,0,0],hd:[-24,6,8],gL:[.5,1.3,.22],gR:[-.48,1.24,.22],jw:[.6],wg:[50,40,0,30,0]}],
    [.36,{HP:[0,-.06,-.05],h:[2,-12,0],sp:[2,-4,0],ch:[0,-6,0],hd:[-8,8,0],jw:[.2]}],
    [.9,{}]],'Blow to the face: his head snaps back, his arms fly up and the wings jerk open');
  KC('Hit 2',1.1,[[0,{}],
    [.12,{HP:[.06,-.08,0],h:[6,8,-10],sp:[4,4,-6],ch:[0,6,-8],hd:[-10,24,-12],gL:[.56,1.24,.26],jw:[.5],wg:[44,40,6,30,0],tsw:[-60]}],
    [.32,{HP:[.08,-.1,0],h:[6,0,-6],sp:[5,0,-4],ch:[2,0,-6],hd:[-2,16,-6],FL:[.2,.12,2,0,0],gL:[.5,1.2,.32],jw:[.2]}],
    [.62,{HP:[.05,-.08,0],FL:[.2,.12,2,0,0]}],
    [1.1,{}]],'Struck from the right: twists away and catches himself with a step, then turns back');
  KC('Heavy hit',2.5,[[0,{}],
    [.12,{HP:[0,-.08,-.1],h:[-8,-12,0],sp:[-10,-4,0],ch:[-14,-6,0],nk:[-8,0,0],hd:[-26,6,6],gL:[.52,1.3,.22],gR:[-.5,1.24,.22],jw:[.7],wg:[54,40,0,30,0]}],
    [.36,{HP:[0,-.24,-.12],h:[8,-12,0],sp:[2,-4,0],ch:[0,-6,0],hd:[-8,8,4],FL:[.13,-.04,-4,.06,30],gL:[.46,1.04,.3],gR:[-.44,1.0,.3],jw:[.4],wg:[34,44,6,40,0]}],
    [.64,{HP:[0,-.33,-.12],h:[18,-12,0],sp:[10,-4,0],ch:[8,-6,0],hd:[6,8,0],FL:[.13,-.38,-4,0,70],FR:[-.13,-.06,-30,0,0],gL:[.42,.92,.48],dL:[0,1,.05],gR:[-.42,.84,.34],dR:[-.3,-.2,.93],jw:[.2],wg:[24,52,10,56,0]}],
    [1.35,{HP:[0,-.33,-.12],h:[20,-12,0],sp:[11,-4,0],ch:[9,-6,0],hd:[-6,14,0],FL:[.13,-.38,-4,0,70],FR:[-.13,-.06,-30,0,0],gL:[.42,.92,.49],dL:[0,1,.05],gR:[-.42,.84,.35],dR:[-.3,-.2,.93],jw:[.3],wg:[24,52,10,56,0]}],
    [1.75,{HP:[0,-.3,-.08],h:[22,-12,0],sp:[10,-4,0],ch:[8,-6,0],hd:[-4,10,0],FL:[.13,-.3,-4,0,42],FR:[-.13,-.08,-30,0,0],gL:[.42,.98,.44],dL:[0,1,.1],gR:[-.42,.92,.32],dR:[-.3,-.1,.95],jw:[.1],wg:[28,50,10,50,0]}],
    [2.05,{HP:[0,-.1,-.02],h:[8,-14,0],FL:[.13,.0,-4,.05,10]}],
    [2.5,{}]],'Knocked down onto his left knee, leaning on the staff, then rises again');
  /* Death: reels from the blow and sinks onto his knees leaning on the staff, the wings sagging; throws his head back and roars, then
     shrinks to nothing (held: gone; the owner adds the effect) */
  {const KN={HP:[0,-.33,-.08],h:[14,-6,0],sp:[6,-2,0],ch:[4,-2,0],nk:[2,0,0],hd:[4,4,0],FL:[.13,-.3,-4,0,72],FR:[-.13,-.32,-14,0,74],gL:[.4,.86,.46],dL:[0,1,.05],gR:[-.42,.8,.3],dR:[-.2,-.3,.93],wg:[4,64,12,60,0]};
  const SC={h:[4,-6,0],sp:[-4,-2,0],ch:[-11,-2,0],nk:[-8,0,0],hd:[-32,0,0],gR:[-.52,1.0,.2],dR:[-.5,.1,.86],jw:[1],wg:[30,40,4,30,0]};
  KC('Death',4.0,[[0,{}],
    [.14,{HP:[0,-.08,-.12],h:[-10,-12,0],sp:[-10,-4,0],ch:[-14,-6,0],nk:[-8,0,0],hd:[-26,6,6],gL:[.52,1.3,.22],gR:[-.5,1.24,.22],jw:[.7],wg:[54,40,0,30,0]}],
    [.5,{HP:[0,-.2,-.1],h:[6,-10,0],sp:[2,-4,0],ch:[0,-4,0],hd:[-4,4,4],FL:[.13,.02,-4,.06,20],gL:[.46,1.04,.32],gR:[-.44,1.0,.3],jw:[.3],wg:[34,50,8,44,0]}],
    [.95,wrP(KN,{jw:[.2]})],
    [1.5,wrP(KN,SC)],[1.9,wrP(KN,wrP(SC,{ch:[-12,-2,0],hd:[-33,0,0]}))],
    [2.15,wrP(KN,wrP(SC,{ch:[-12,-2,0],hd:[-33,0,0],vb:[.7,0]}))],
    [2.45,wrP(KN,wrP(SC,{ch:[-12,-2,0],hd:[-33,0,0],vb:[.001,0]}))],
    [4.0,wrP(KN,wrP(SC,{ch:[-12,-2,0],hd:[-33,0,0],vb:[.001,0]}))]],
    'Reels from the blow and sinks onto his knees leaning on the staff, the wings sagging; throws his head back and roars, then shrinks to nothing (held: gone)',{hold:true,next:null,fps:60});}
  return DL_CLIPS=L;}

ASSETS.push({id:'devil-lord',folder:'characters/enemies/hell',name:'Devil Lord',kind:'character',variants:true,defaultSeed:17,groundR:2.8,build:(s,o)=>buildDevilLord(s,o||{}),
  opts:[{key:'skin',label:'Skin',choices:[['random','Random'],['obsidian','Obsidian black'],['ash','Ash grey'],['blood','Blood dark']],def:'random'},
    {key:'glow',label:'Glow',choices:[['random','Random'],['red','Red'],['orange','Orange'],['violet','Violet'],['green','Green']],def:'random'},
    {key:'horns',label:'Horns',choices:[['random','Random'],['crescent','Crescent'],['ram','Ram'],['swept','Swept back']],def:'random'},
    {key:'staff',label:'Staff',choices:[['random','Random'],['orb','Horned orb'],['skull','Horned skull'],['gem','Caged shard']],def:'random'},
    {key:'blade',label:'Scimitar',choices:[['random','Random'],['infernal','Black iron, glowing runes'],['steel','Dark steel']],def:'random'}],
  desc:'Devil Lord: a 2.2 m winged devil lord after the owner\'s reference: near-black skin with glowing cracks, a bald head with a heavy brow, slanted glowing eyes and a stern face, long swept-back ears and big ridged black horns; a muscular bare torso, black spiked armour with glowing runes (pauldrons, bracers, belt, tassets, knee guards, greaves), a tattered loincloth, clawed hands and feet, big tattered bat wings (half closed on the ground, spread in flight) and a long spined tail. A staff in the left hand and a scimitar in the right. Clips: Idle, Walk, war-mode Idle and Walk, Take off, Hover, Fly, Land, Spell 1 (hellfire bolt), Spell 2 (ring of fire), Spell 3 (summon), Spell 4 (rain of fire, from the air), Scimitar slash, Scimitar combo, Scimitar thrust, Tail lash, Wing buffet, Roar, Hit 1, Hit 2, Heavy hit and Death. Spell effects are added separately.'});
