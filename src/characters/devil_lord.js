/* ======================= DEVIL LORD: a charismatic winged devil, a spellcaster with a staff and a scimitar (Enemies → Hell) =======================
   A tall, handsome devil (VB.dlord: the villager male's proportions x 1.22, about 2.2 m to the top of the head) with coloured skin,
   slicked-back hair with a widow's peak, arched brows, glowing eyes, a thin waxed moustache and a pointed goatee, a sly smile with two
   fangs (the lower face is the jaw g_jaw), long pointed ears and big polished horns with gold bands. An open doublet with gold trim and
   a high stand-up collar over a bare chest, a gold medallion, pauldrons, bracers, a wide belt, tassets on the thighs, tall boots.
   Big bat wings on the shoulder blades (dwing_{L,R} with a folding outer half dwingO_{L,R}): half closed behind him on the ground,
   spread wide in flight. A staff in the left hand (weapon_L), a scimitar in the right (weapon_R).
   Built from its own meshes on the villager's 25 joints inside a body group (vbody), so the warrior's IK (wrSolve) fits unchanged.
   Clips use the succubus's arm machinery (hand targets turn with the body's yaw, elbow poles by a cost search) with a prop in each
   hand carried the necromancer's way: the elbow is chosen so that a straight wrist already points the prop where it should go, the
   wrist bends it the rest of the way (clamped), and neither prop goes below the ground; the succubus's wing beat. Spell effects are
   not part of the asset (the owner adds them separately). */
VB.dlord=Object.assign({},VB.male,{thigh:.52,shin:.5,ankle:.07,hipOff:.06,spine:.13,chest:.25,neck:.27,headY:.085,shW:.27,ua:.35,fa:.31,g:1.22,hipW:.085,sex:'male'});
{const b=VB.dlord;b.key='dlord';b.hipH=b.thigh+b.shin+b.ankle+b.hipOff;b.legS=(b.thigh+b.shin)/.84;b.tS=(b.spine+b.chest)/.3;b.cS=b.neck/.22;}
const DL_SKIN={crimson:['#a8282e','crimson'],scarlet:['#c8443a','scarlet'],dark:['#6a161c','dark red'],charcoal:['#3a3436','charcoal']};
const DL_GLOW={gold:['#fff0c0','#ffb41e','gold'],red:['#ffc0b0','#ff2a14','red'],green:['#d8ffcc','#36ff62','green'],violet:['#f0d8ff','#b040ff','violet']};
const DL_GARB={black:['#1a161c','black'],crimson:['#5a0e18','crimson'],purple:['#34143e','royal purple']};
const DL_HORN={swept:'long horns swept back',ram:'curling ram horns',great:'great horns rising out and up'};
const DL_STAFF={orb:'a glowing orb between two gold horns',skull:'a horned goat skull with glowing eyes',gem:'a glowing gem in an iron cage'};
const DL_BLADE={steel:'a steel scimitar',obsidian:'a black scimitar with a glowing edge'};
const DL_WS=1.5;
/* the staff: grip at the origin, local y up; the foot 1.2 m below the grip */
function dlStaff(kind,glow,glowB){const w=new THREE.Group(),wd=bm('#1e1416','leather'),wdD=bm('#120c0e','leather'),wrap=bm('#3a1418','leather'),gold=bm('#d0a848','plain'),goldD=bm('#8e6a28','plain'),bone=bm('#e2d8c0','plain'),boneD=bm('#b0a48a','plain'),iron=bm('#2a262a','plain');
  bx(w,.05,2.15,.05,wd,0,-.125,0);for(const y of[-.9,-.5,.45])bx(w,.054,.1,.054,wdD,0,y,0);bx(w,.062,.26,.062,wrap,0,0,0);
  for(const y of[-1.15,-.3,.16,-.16,.7])bx(w,.068,.035,.068,gold,0,y,0);bx(w,.06,.05,.06,goldD,0,-1.18,0);
  bx(w,.09,.07,.09,gold,0,.97,0);bx(w,.07,.03,.07,goldD,0,.93,0);
  if(kind==='orb'){for(const s of[-1,1])ncHorn(w,[[s*.02,.99,0],[s*.08,1.05,0],[s*.115,1.14,0],[s*.1,1.24,0],[s*.05,1.3,.0]],.04,.016,gold,goldD);
    bx(w,.12,.12,.12,glow,0,1.14,0,.6,.6,0);bx(w,.07,.07,.07,glowB,0,1.14,0,0,.8,.6);}
  else if(kind==='skull'){bx(w,.13,.12,.13,bone,0,1.06,-.01);bx(w,.09,.12,.08,bone,0,1.01,.08);bx(w,.07,.04,.05,boneD,0,.96,.11);
    for(const s of[-1,1]){bx(w,.03,.02,.012,glow,s*.035,1.06,.12);ncHorn(w,[[s*.05,1.11,-.02],[s*.11,1.16,-.04],[s*.16,1.17,-.1],[s*.17,1.12,-.15],[s*.15,1.07,-.13]],.04,.016,iron,wdD);}}
  else{const g=new THREE.Group();g.position.set(0,1.13,0);g.scale.set(1,1.8,1);w.add(g);bx(g,.09,.09,.09,glow,0,0,0,0,0,Math.PI/4);bx(g,.05,.05,.05,glowB,0,0,0,0,0,Math.PI/4);
    for(const[x,z]of[[1,0],[-1,0],[0,1],[0,-1]])ncHorn(w,[[x*.03,.99,z*.03],[x*.09,1.06,z*.09],[x*.1,1.16,z*.1],[x*.05,1.25,z*.05],[x*.012,1.29,z*.012]],.026,.014,iron,wdD);}
  return w;}
/* the scimitar: grip at the origin, the blade along local y, its edge towards +x, curving back towards -x */
function dlScimitar(kind,glow){const w=new THREE.Group(),gold=bm('#d0a848','plain'),goldD=bm('#8e6a28','plain'),grip=bm('#2a1214','leather');
  const ob=kind==='obsidian',bl=bm(ob?'#1c1a20':'#b4bac4','plain'),sp=bm(ob?'#0c0b0e':'#7e848e','plain'),ed=ob?glow:bm('#e8ecf2','plain');
  bx(w,.045,.2,.045,grip,0,-.02,0);for(const y of[-.08,.04])bx(w,.05,.015,.05,goldD,0,y,0);bx(w,.06,.05,.06,gold,0,-.14,0,0,Math.PI/4,0);bx(w,.03,.03,.03,goldD,0,-.18,0);
  bx(w,.13,.03,.13,gold,0,.095,0);bx(w,.13,.03,.13,gold,0,.095,0,0,Math.PI/4,0);bx(w,.08,.04,.04,goldD,0,.12,0);
  const n=8,y0=.13,Lb=1.0;
  for(let i=0;i<n;i++){const u=(i+.5)/n,wd=.07+.04*Math.sin(Math.min(1,u*1.15)*Math.PI*.55),x=-.16*u*u,a=Math.atan(-.32*u),h=Lb/n,cy=y0+h*(i+.5),g=new THREE.Group();
    put(w,g,x,cy,0,0,0,-a);
    if(i<n-1){bx(g,wd,h*1.06,.016,bl,0,0,0);bx(g,.014,h*1.06,.02,sp,-wd/2+.007,0,0);bx(g,.014,h*1.06,.012,ed,wd/2-.006,0,0);}
    else{bx(g,wd*.7,h*.6,.016,bl,-wd*.1,-h*.2,0);bx(g,wd*.45,h*.45,.016,bl,-wd*.22,h*.22,0,0,0,.55);bx(g,.014,h*.75,.012,ed,wd*.22,-.01,0,0,0,.5);}}
  return w;}

function buildDevilLord(seed,o={}){const B=VB.dlord,r=mulberry32(((seed*2654435761)>>>0)^0xd3b1),pick=a=>a[Math.floor(r()*a.length)],root=new THREE.Group();root.userData.lights=[];
  /* roll everything, then let the options override */
  const skin0=pick(['crimson','crimson','scarlet','dark','charcoal']),glow0=pick(['gold','gold','red','green','violet']),garb0=pick(Object.keys(DL_GARB)),horn0=pick(Object.keys(DL_HORN)),staff0=pick(Object.keys(DL_STAFF)),blade0=pick(['steel','steel','obsidian']);
  const opt=(k,d)=>o[k]&&o[k]!=='random'?o[k]:d,skinK=opt('skin',skin0),glowK=opt('glow',glow0),garbK=opt('garb',garb0),hornK=opt('horns',horn0),staffK=opt('staff',staff0),bladeK=opt('blade',blade0);
  const shade=(h,f)=>'#'+new THREE.Color(h).multiplyScalar(f).getHexString(),SK=DL_SKIN[skinK][0],GC=DL_GARB[garbK][0];
  const skin=bm(SK,'skin'),skinD=bm(shade(SK,.8),'skin'),skinX=bm(shade(SK,.62),'skin'),hair=bm('#121014','hair'),hairS=bm('#2a2630','hair'),dark=bm('#0e0a0c','plain'),teeth=bm('#f0eadc','plain'),lip=bm(shade(SK,.55),'plain'),nail=bm('#141012','plain');
  const garb=bm(GC,'cloth'),garbD=bm(shade(GC,.65),'cloth'),garbL=bm(shade(GC,1.5),'cloth'),lea=bm('#1c1416','leather'),leaD=bm('#0e0a0c','leather'),trous=bm('#16131a','cloth'),boot=bm('#151214','leather'),bootD=bm('#0a0809','leather');
  const gold=bm('#d0a848','plain'),goldD=bm('#8e6a28','plain'),horn=bm('#141012','plain'),hornD=bm('#2c2428','plain');
  const gl=DL_GLOW[glowK],eyeM=wrGlow(gl[0],gl[1],1.8,pxTex('plain')),gemM=wrGlow(gl[0],gl[1],1.4,pxTex('plain')),glowB=wrGlow('#ffffff',gl[1],2.4,pxTex('plain'));
  const wingB=bm(shade(SK,.55),'skin'),memb=bm(shade(SK,.38),'plain'),membD=bm(shade(SK,.28),'plain'),claw=bm('#141012','plain');
  const vb=new THREE.Group();vb.name='vbody';root.add(vb);
  const hips=J('hips',vb,0,B.hipH,0),spine=J('spine',hips,0,B.spine,0),chest=J('chest',spine,0,B.chest,0),neck=J('neck',chest,0,B.neck,0),head=J('head',neck,0,B.headY,0);
  /* hips: dark trousers, a wide leather belt with gold edges and a diamond buckle with a glowing gem */
  bx(hips,.36,.2,.23,trous,0,-.05,0);bx(hips,.38,.08,.25,lea,0,.04,0);for(const y of[.0,.08])bx(hips,.385,.012,.255,gold,0,y,0);
  bx(hips,.08,.08,.02,gold,0,.04,.13,0,0,Math.PI/4);bx(hips,.04,.04,.02,gemM,0,.04,.137,0,0,Math.PI/4);
  /* waist: the doublet closes over the stomach, gold trim down the front */
  bx(spine,.33,.18,.22,garb,0,.07,0);bx(spine,.016,.18,.01,gold,0,.07,.112);for(const y of[.03,.11])bx(spine,.026,.026,.012,gold,0,y,.115,0,0,Math.PI/4);
  /* chest: broad, the doublet open in a V over a bare chest (pecs), gold-trimmed lapels, shoulders; a gold medallion on a chain */
  bx(chest,.42,.3,.24,garb,0,.12,0);bx(chest,.5,.1,.26,garb,0,.24,0);bx(chest,.16,.26,.02,skin,0,.14,.12);
  for(const s of[-1,1]){bx(chest,.085,.07,.02,skin,s*.045,.19,.128);bx(chest,.06,.008,.01,skinD,s*.045,.155,.135);
    bx(chest,.12,.3,.03,garb,s*.12,.12,.125,0,0,s*.14);bx(chest,.016,.3,.034,gold,s*.065,.12,.126,0,0,s*.14);bx(chest,.08,.12,.03,garbL,s*.15,.23,.13,0,0,s*.3);}
  bx(chest,.006,.12,.01,skinD,0,.07,.131);
  for(const s of[-1,1])bx(chest,.008,.13,.008,gold,s*.045,.2,.131,0,0,-s*.35);bx(chest,.07,.07,.02,gold,0,.12,.135,0,0,Math.PI/4);bx(chest,.036,.036,.02,gemM,0,.12,.142,0,0,Math.PI/4);
  /* the high stand-up collar behind the neck, lined inside, flaring out */
  bx(chest,.34,.2,.03,garb,0,.37,-.12,-.3,0,0);bx(chest,.32,.18,.012,garbD,0,.37,-.1,-.3,0,0);bx(chest,.345,.016,.035,gold,0,.47,-.15,-.3,0,0);
  for(const s of[-1,1]){bx(chest,.03,.18,.12,garb,s*.17,.35,-.06,0,0,-s*.25);bx(chest,.034,.016,.12,gold,s*.193,.44,-.06,0,0,-s*.25);}
  /* neck */
  bx(neck,.14,.15,.14,skin,0,.04,0);bx(neck,.09,.06,.02,skinD,0,.04,.07);
  /* head: a long handsome face, high cheekbones, arched brows rising outwards, glowing eyes, a straight nose, a thin waxed moustache, a
     sly smile with two fangs; slicked-back black hair with a widow's peak; long pointed ears. The jaw (g_jaw) carries the chin and a
     pointed goatee */
  bx(head,.26,.25,.28,skin,0,.205,0);bx(head,.21,.08,.15,skin,0,.05,-.06);bx(head,.24,.03,.03,skinD,0,.228,.135);
  for(const s of[-1,1]){bx(head,.06,.024,.008,skinX,s*.062,.199,.142);bx(head,.05,.016,.008,eyeM,s*.062,.198,.146);bx(head,.058,.008,.01,dark,s*.062,.21,.147,0,0,s*.1);bx(head,.008,.016,.01,dark,s*.062,.198,.148);
    bx(head,.08,.018,.016,hair,s*.066,.236,.146,0,0,s*.26);bx(head,.05,.008,.008,skinD,s*.088,.16,.142,0,0,-s*.35);
    bx(head,.05,.009,.012,hair,s*.035,.097,.152,0,0,s*.2);bx(head,.026,.009,.01,hair,s*.068,.108,.151,0,0,s*.75);bx(head,.012,.03,.012,teeth,s*.028,.074,.142);}
  bx(head,.04,.085,.04,skin,0,.15,.155);bx(head,.034,.028,.036,skinD,0,.116,.163);bx(head,.1,.012,.012,lip,0,.083,.146);bx(head,.024,.01,.012,lip,-.052,.088,.145,0,0,.4);
  bx(head,.27,.04,.29,hair,0,.335,-.01);bx(head,.27,.24,.04,hair,0,.21,-.148);bx(head,.22,.08,.05,hair,0,.075,-.14);
  bx(head,.2,.03,.02,hair,0,.315,.141);bx(head,.05,.05,.02,hair,0,.3,.142,0,0,Math.PI/4);for(const s of[-1,1]){bx(head,.03,.1,.02,hair,s*.11,.29,.138,0,0,s*.4);bx(head,.02,.12,.2,hair,s*.136,.26,-.03);}
  for(const x of[-.08,-.03,.03,.08])bx(head,.012,.012,.27,hairS,x,.357,-.02);
  for(const s of[-1,1]){const eg=new THREE.Group();eg.position.set(s*.136,.19,-.02);eg.rotation.set(-.4,s*.3,-s*.25);head.add(eg);
    bx(eg,.024,.08,.06,skin,s*.012,0,0);bx(eg,.02,.06,.045,skin,s*.018,.055,-.014);bx(eg,.017,.045,.03,skinD,s*.022,.1,-.024);bx(eg,.013,.035,.018,skinD,s*.025,.135,-.03);
    bx(eg,.014,.022,.022,gold,s*.02,-.05,.008);}
  const jw=new THREE.Group();jw.name='g_jaw';head.add(jw);jw.position.set(0,.08,0);
  bx(jw,.21,.075,.15,skin,0,-.035,.055);bx(jw,.11,.035,.06,skin,0,-.07,.105);bx(jw,.09,.012,.012,lip,0,-.006,.135);bx(jw,.09,.012,.04,teeth,0,-.006,.112);
  bx(jw,.05,.07,.04,hair,0,-.1,.125);bx(jw,.03,.06,.03,hair,0,-.155,.13,.15,0,0);bx(jw,.016,.04,.02,hair,0,-.2,.14,.25,0,0);
  /* horns from the hairline, pointing outwards, black with gold bands */
  const HP={swept:[[.08,.31,.06],[.12,.39,.03],[.15,.47,-.03],[.17,.54,-.12],[.17,.59,-.23],[.15,.61,-.33],[.12,.6,-.41]],
    ram:[[.09,.3,.05],[.15,.37,.02],[.22,.38,-.05],[.27,.32,-.11],[.28,.23,-.1],[.25,.17,-.04],[.22,.17,.03]],
    great:[[.09,.3,.05],[.17,.34,.05],[.25,.39,.02],[.3,.47,-.01],[.32,.57,-.04],[.31,.66,-.08],[.28,.73,-.12]]}[hornK];
  for(const s of[-1,1]){const P=HP.map(([x,y,z])=>[s*x,y,z]);ncHorn(head,P,hornK==='ram'?.085:.075,.022,horn,hornD);
    for(const[i,f]of[[0,.6],[1,.7]]){const a=P[i],b=P[i+1],m=(t)=>a.map((v,j)=>v+(b[j]-v)*t),w=(hornK==='ram'?.085:.075)*(1-.75*i/(P.length-2))+.012;ncSeg(head,m(f-.12),m(f+.12),w,w,gold);}}
  /* arms: pauldrons with gold rims, sleeves, leather bracers with gold bands, clawed hands with gold rings */
  for(const[sd,s]of[['L',1],['R',-1]]){const sh=J('shoulder_'+sd,chest,s*B.shW*.325,.165*B.cS,0),ua=J('upperArm_'+sd,sh,s*B.shW*.675,0,0),fa=J('foreArm_'+sd,ua,0,-B.ua,0),hd=J('hand_'+sd,fa,0,-B.fa,0);
    const fg=J('fingers_'+sd,hd,0,-.11,0),ft=J('fingerTips_'+sd,fg,0,-.05,0),th=J('thumb_'+sd,hd,-s*.02,-.035,.05),so=J('socket_'+sd,hd,-s*.014,-.08,0);so.userData.socket=true;
    bx(ua,.18,.1,.18,garb,s*.012,.0,0);bx(ua,.16,.05,.16,garbD,s*.008,.06,0);bx(ua,.185,.02,.185,gold,s*.012,-.05,0);bx(ua,.03,.07,.03,gold,s*.06,.1,0,0,0,-s*.5);
    bx(ua,.12,.33,.12,garb,0,-.19,0);bx(fa,.11,.08,.11,garb,0,-.03,0);bx(fa,.12,.23,.12,lea,0,-.17,0);for(const y of[-.08,-.27])bx(fa,.126,.025,.126,gold,0,y,0);
    bx(hd,.055,.11,.1,skin,0,-.055,0);
    for(const[z,Lp]of[[.036,.05],[.012,.056],[-.012,.052],[-.036,.042]]){const g1=new THREE.Group(),g2=new THREE.Group();g1.position.set(0,0,z);fg.add(g1);g2.position.set(0,.05-Lp,z);ft.add(g2);
      bx(g1,.021,Lp,.021,skin,0,-Lp/2+.003,0);bx(g2,.019,.038,.019,skin,0,-.019,0);bx(g2,.014,.02,.014,nail,-s*.002,-.045,0);bx(g2,.008,.014,.008,nail,-s*.004,-.06,0);}
    const tg=new THREE.Group();tg.rotation.set(-.6,0,-s*.15);th.add(tg);bx(tg,.025,.05,.025,skin,0,-.022,0);bx(tg,.022,.034,.022,skin,0,-.056,0);bx(tg,.013,.018,.013,nail,0,-.078,0);
    const rg=new THREE.Group();rg.position.set(0,0,sd==='L'?.036:.012);fg.add(rg);bx(rg,.027,.013,.027,gold,0,-.022,0);bx(rg,.013,.013,.013,gemM,-s*.014,-.022,0);}
  /* legs: trousers, gold-trimmed tassets on the outside of the thighs, tall boots with gold-trimmed cuffs and pointed toes (the sole
     is the IK foot's) */
  for(const[sd,s]of[['L',1],['R',-1]]){const th=J('thigh_'+sd,hips,s*B.hipW,-(B.hipOff+.01),0),sn=J('shin_'+sd,th,0,-B.thigh,0),ft=J('foot_'+sd,sn,0,-B.shin,0);
    bx(th,.15,.52,.16,trous,0,-.25,0);bx(th,.04,.22,.17,garb,s*.085,-.08,0,0,0,s*.06);bx(th,.044,.02,.175,gold,s*.092,-.19,0,0,0,s*.06);bx(th,.16,.04,.04,garb,s*.01,-.03,.08);
    bx(sn,.14,.09,.15,bootD,0,-.07,0);bx(sn,.146,.016,.156,gold,0,-.03,0);bx(sn,.125,.4,.135,boot,0,-.3,0);bx(sn,.01,.34,.006,bootD,0,-.3,.069);
    bx(ft,.125,.09,.13,boot,0,-.034,-.01);bx(ft,.115,.044,.2,boot,0,-.058,.052);bx(ft,.08,.036,.032,boot,0,-.062,.146);bx(ft,.11,.024,.075,bootD,0,-.068,-.045);bx(ft,.03,.02,.02,gold,0,-.03,-.075);}
  /* wings on the shoulder blades (the succubus's demonic bat wing, DL_WS times bigger): an inner arm bone and membrane, then the
     folding outer half with finger bones, a long lower finger from the tip ending in a talon, a hooked thumb claw and spines along the
     leading edge; the membrane ends in sharp points (local x outwards, hanging down from the leading edge; the clips pitch it back) */
  const spike=(par,x,y,w,len,m,rz=0)=>{const g=new THREE.Group();g.position.set(x,y,0);g.rotation.z=rz;g.scale.set(1,len/w,1);par.add(g);bx(g,w*.7071,w*.7071,.01,m,0,0,0,0,0,Math.PI/4);return g;};
  for(const[sd,s]of[['L',1],['R',-1]]){const w0=new THREE.Group();w0.name='dwing_'+sd;w0.position.set(s*.12,.17,-.115);chest.add(w0);const w=new THREE.Group();w.scale.setScalar(DL_WS);w0.add(w);
    const a=.4,b=.55;bx(w,.065,.065,.065,wingB,0,0,0);bx(w,a,.04,.04,wingB,s*a/2,0,0);spike(w,s*.06,.05,.03,.08,claw,-s*.3);
    [[.4,.07],[.46,.2],[.52,.33]].forEach(([h,x])=>{bx(w,.135,h,.008,memb,s*x,-h/2,0);spike(w,s*(x+.02),-h-.06,.07,.16,memb);});
    const wo=new THREE.Group();wo.name='dwingO_'+sd;wo.position.set(s*a,0,0);w.add(wo);bx(wo,.055,.055,.055,wingB,0,0,0);
    ncHorn(wo,[[0,.02,0],[s*.01,.09,.01],[-s*.015,.15,.03]],.032,.012,claw,claw);
    bx(wo,b,.034,.034,wingB,s*b/2,0,0);spike(wo,s*(b+.04),.03,.045,.12,claw,-s*1.0);for(const x of[.18,.36])spike(wo,s*x,.04,.024,.06,claw,-s*.4);
    const bone=(x0,y0,x1,y1,t)=>{const L=Math.hypot(x1-x0,y1-y0),an=Math.atan2(y1-y0,x1-x0);bx(wo,L,t,t,wingB,s*(x0+x1)/2,(y0+y1)/2,.008,0,0,s*an);};
    bone(0,0,.135,-.6,.022);bone(0,0,.315,-.72,.022);bone(.02,0,.05,-.54,.022);bone(b,0,.495,-.84,.026);spike(wo,s*.494,-.93,.04,.2,claw);
    [[.54,.045],[.6,.135],[.66,.225],[.72,.315],[.78,.405],[.84,.495]].forEach(([h,x],i)=>{bx(wo,.092,h,.008,memb,s*x,-h/2,0);if(i<5)spike(wo,s*(x+.01),-h-.07,.07,.18,i%2?membD:memb);});}
  const joints=[];root.traverse(q=>{if(q.userData.joint&&!q.userData.socket)joints.push(q);});root.userData.joints=joints;
  /* the staff in the left hand, the scimitar in the right */
  const wl=new THREE.Group();wl.name='weapon_L';wl.userData.gear=true;root.getObjectByName('socket_L').add(wl);const st=dlStaff(o.bare?'orb':staffK,gemM,glowB);st.quaternion.copy(SH_BASIS());wl.add(st);
  const wr=new THREE.Group();wr.name='weapon_R';wr.userData.gear=true;root.getObjectByName('socket_R').add(wr);const sc=dlScimitar(o.bare?'steel':bladeK,eyeM);sc.quaternion.copy(SH_BASIS());wr.add(sc);
  if(o.bare)return root;
  if(!o.noClips){root.userData.clips=devilLordClips();const mx=new THREE.AnimationMixer(root);mx.clipAction(root.userData.clips[0]).play();mx.update(0);}
  root.userData.ground=2.6;
  const cap=s=>s.charAt(0).toUpperCase()+s.slice(1);
  root.userData.variantText=`${cap(DL_SKIN[skinK][1])} skin, glowing ${gl[2]} eyes, ${DL_HORN[hornK]}, slicked-back black hair, moustache and goatee; ${DL_GARB[garbK][1]} doublet with gold trim; big bat wings. Staff with ${DL_STAFF[staffK]}; ${DL_BLADE[bladeK]}.`;
  return root;}

/* ---------- clips ---------- */
let DL_CLIPS=null;
/* Pose channels: the succubus's (fl lifts the hips, feet and hands together; x,z of the hands hips-relative, y absolute) with a prop
   in each hand: dL the staff's direction (up from the fist), dR the scimitar's; wl, wr extra wrist bends (the left one mirrored);
   jw jaw, vb body [scale, spin°]; wings wg [elevation, sweep back, pitch back, outer fold back, outer droop] and ba wing-beat
   amplitude (0 holds wg).
   Relaxed (DL_N): standing tall, the staff planted upright at his left side, the scimitar held low at his right, point forward;
   wings half closed behind him. War (DL_W): wider, left foot forward, the staff angled ahead, the scimitar raised, wings half open.
   Hover (DL_F): lifted, legs hanging, wings spread wide and beating. */
const DL_N={fl:[0],HP:[.02,-.01,0],h:[0,-5,3],sp:[0,2,-1],ch:[-3,3,-2],nk:[2,0,0],hd:[4,-4,2],FL:[.08,.02,4,0,0],FR:[-.07,.04,-12,0,0],
  gL:[.36,1.0,.14],dL:[0,1,0],pL:[.6,-.3,-.7],gR:[-.33,.92,.1],dR:[0,-.45,.9],pR:[-.6,-.3,-.7],wl:[0,0,0],wr:[0,0,0],fist:[95,95],jw:[0],vb:[1,0],
  wg:[40,55,10,50,-30],ba:[0]};
const DL_W=wrP(DL_N,{HP:[0,-.05,0],h:[4,-14,0],sp:[3,-4,0],ch:[3,-6,0],nk:[0,0,0],hd:[-4,14,0],FL:[.12,.17,-4,0,0],FR:[-.12,-.15,-30,0,0],
  gL:[.38,1.12,.32],dL:[.05,.92,.38],gR:[-.36,1.12,.34],dR:[-.2,.55,.8],wg:[36,48,8,40,-18]});
const DL_F=wrP(DL_N,{fl:[.7],HP:[0,0,0],h:[6,0,0],sp:[0,0,0],ch:[-2,0,0],nk:[0,0,0],hd:[2,0,0],FL:[.08,.04,4,-.04,46],FR:[-.08,-.1,-6,.06,40],
  gL:[.4,1.06,.2],dL:[.08,.92,.35],gR:[-.38,1.0,.22],dR:[-.1,-.2,.97],wg:[16,20,14,6,0],ba:[1]});
function dlRig(){const B=VB.dlord,m=buildDevilLord(1,{bare:true}),J={};m.traverse(q=>{if(q.userData.joint||/^dwing/.test(q.name))J[q.name]=q;});return{m,J,B,two:false,lprop:true};}

function devilLordClips(){if(DL_CLIPS)return DL_CLIPS;const B=VB.dlord,D=Math.PI*2,S=Math.sin,C=Math.cos,V=THREE.Vector3,Q=THREE.Quaternion,E3=THREE.Euler,L=[],R=dlRig(),k=B.legS,R2=Math.PI/180;
  const vv=new V();
  const lowAll=g=>{g.updateMatrixWorld(true);let y=1e9;g.traverse(q=>{if(!q.isMesh)return;const P=q.geometry.parameters;for(let i=0;i<8;i++){vv.set((i&1?.5:-.5)*P.width,(i&2?.5:-.5)*P.height,(i&4?.5:-.5)*P.depth).applyMatrix4(q.matrixWorld);if(vv.y<y)y=vv.y;}});return y;};
  /* each prop's box corners in its socket's space, for the ground check */
  const C8={};{const bq=SH_BASIS(),mk=(sd,g)=>{const P=[];g.updateMatrixWorld(true);g.traverse(m=>{if(!m.isMesh)return;const gp=m.geometry.parameters;m.updateMatrixWorld(true);const M=m.matrixWorld;
      for(let i=0;i<8;i++)P.push(new V((i&1?.5:-.5)*gp.width,(i&2?.5:-.5)*gp.height,(i&4?.5:-.5)*gp.depth).applyMatrix4(M).applyQuaternion(bq));});C8[sd]=P;};
    const w=bm('#fff','plain');mk('L',dlStaff('skull',w,w));const s2=dlStaff('orb',w,w),s3=dlStaff('gem',w,w);[s2,s3].forEach(g=>{g.updateMatrixWorld(true);g.traverse(m=>{if(!m.isMesh)return;const gp=m.geometry.parameters;for(let i=0;i<8;i++)C8.L.push(new V((i&1?.5:-.5)*gp.width,(i&2?.5:-.5)*gp.height,(i&4?.5:-.5)*gp.depth).applyMatrix4(m.matrixWorld).applyQuaternion(bq));});});
    mk('R',dlScimitar('steel',w));}
  const cv=new V(),propLow=sd=>{R.m.updateMatrixWorld(true);const M=R.J['socket_'+sd].matrixWorld;let y=1e9;for(const c of C8[sd]){cv.copy(c).applyMatrix4(M);if(cv.y<y)y=cv.y;}return y;};
  /* hand targets and prop directions turn with the body's yaw (hips + spine + chest) */
  const yawF=p=>{const y=(p.h[1]+p.sp[1]+p.ch[1])*R2,c=Math.cos(y),sn=Math.sin(y),rt=v=>[v[0]*c+v[2]*sn,v[1],-v[0]*sn+v[2]*c],o=Object.assign({},p);for(const q of['gR','gL','dR','dL'])o[q]=rt(p[q]);return o;};
  const restQ={L:new Q().setFromEuler(new E3(0,0,BASEPOSE.upperArm_L[2]*R2)),R:new Q().setFromEuler(new E3(0,0,BASEPOSE.upperArm_R[2]*R2))};
  /* elbow poles by score round the shoulder-to-hand line (the succubus's terms), plus the necromancer's prop term on both arms: a
     straight wrist sends the prop out of the fist across the forearm towards the shoulder side, so the elbow is placed where that
     already points along the prop's direction */
  let MIN=.38,PP=null;const M4=new THREE.Matrix4();
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
  let MEM=null;
  const solve=(p0,t,o)=>{let p=yawF(lift(p0));wrSolve(R,p);p=poles(p);let s=wrSolve(R,p);wrist(s,p,'L');wrist(s,p,'R');
    /* a prop that would go below the ground lifts its hand */
    for(let it=0;it<4;it++){let moved=false;for(const sd of['L','R']){const dy=.012-propLow(sd);if(dy>3e-4){const g=p['g'+sd];p['g'+sd]=[g[0],g[1]+dy/k,g[2]];moved=true;}}
      if(!moved)break;s=wrSolve(R,p);wrist(s,p,'L');wrist(s,p,'R');}
    s.fist=p.fist;R.m.updateMatrixWorld(true);
    /* wings: the keyed pose plus the beat; lifted (elevation) wherever they would touch the ground */
    const bt=suBeat(o.bu?o.bu(t):t/(o.beat||1.0)),ba=p.ba[0],wv=p.wg.map((v,i)=>v+bt[i]*ba),wing={};
    for(const[sd,s1]of[['L',1],['R',-1]]){const g=R.J['dwing_'+sd],go=R.J['dwingO_'+sd];let el=wv[0];go.quaternion.setFromEuler(new E3(0,s1*wv[3]*R2,s1*wv[4]*R2,'YZX'));
      g.quaternion.copy(wingQ(s1,el,wv[1],wv[2]));if(lowAll(g)<.012)for(let dd=3;dd<=120;dd+=3){g.quaternion.copy(wingQ(s1,el+dd,wv[1],wv[2]));if(lowAll(g)>=.012){el+=dd;break;}}
      wing[sd]=[g.quaternion.clone(),go.quaternion.clone()];}
    MEM={wing};return s;};
  /* extra tracks every clip carries: wings, jaw, body group (scale about its middle and spin) */
  const extra=(c,fn,M)=>{const T=Array.from(c.tracks[0].times),q=new Q(),e=new E3(),Tr={},Vt={},add=(n,v,tb=Tr)=>{(tb[n]||(tb[n]=[])).push(...v);};
    T.forEach((t,i)=>{const p=fn(t),m=M[i];
      for(const sd of['L','R']){add(`dwing_${sd}.quaternion`,m.wing[sd][0].toArray());add(`dwingO_${sd}.quaternion`,m.wing[sd][1].toArray());}
      q.setFromEuler(e.set(p.jw[0],0,0));add('g_jaw.quaternion',[q.x,q.y,q.z,q.w]);
      const s=Math.max(.001,p.vb[0]);add('vbody.scale',[s,s,s],Vt);add('vbody.position',[0,1.2*(1-s),0],Vt);q.setFromEuler(e.set(0,p.vb[1]*R2,0));add('vbody.quaternion',[q.x,q.y,q.z,q.w]);});
    for(const n in Tr)c.tracks.push(new THREE.QuaternionKeyframeTrack(n,T,Tr[n]));for(const n in Vt)c.tracks.push(new THREE.VectorKeyframeTrack(n,T,Vt[n]));};
  /* looping clips: one warm-up cycle first, so the elbows start where the cycle ends */
  const CC=(name,dur,fn,o={})=>{PP=null;MIN=o.min||.38;if(o.loop)for(let i=0;i<Math.round(dur*30);i++)solve(fn(i/30),i/30,o);
    const M=[],c=sampleClip(name,dur,t=>{const s=solve(fn(t),t,o);M.push(MEM);return s;},Object.assign({autoFeet:false,fps:o.fps||30},o),B);extra(c,fn,M);
    if(o.next!==undefined){if(o.next)c.next=o.next;}else if(!o.loop)c.next='Idle (war mode)';if(o.hold)c.hold=true;if(o.speed)c.speed=o.speed;L.push(c);MIN=.38;return c;};
  const KC=(name,dur,keys,note,o={})=>{const f=wrKeys(keys.map(q=>[q[0],wrP(o.base||DL_W,q[1]||{})]));return CC(name,dur,o.add?t=>o.add(t,f(t)):f,Object.assign({note},o));};
  /* in-place IK gait (the succubus's): planted feet slide back at one steady speed, swinging feet come forward lifted */
  const GAIT=(name,dur,G,note)=>{const fn=t=>{const u=t/dur,o=G.body(u),c2=C(D*(u-G.duty/2)),dy=-G.b*C(2*D*(u-G.duty/2));o.HP=[o.HP[0]+G.sw*c2,o.HP[1]+dy,o.HP[2]];
      o.gR=[o.gR[0],o.gR[1]+dy,o.gR[2]];o.gL=[o.gL[0],o.gL[1]+dy,o.gL[2]];
      for(const[sd,off,x,yaw]of[['L',0,G.x,G.yaw[0]],['R',.5,-G.x,G.yaw[1]]]){const q=(((u+off)%1)+1)%1;let z,l,pt;
        if(q<G.duty){const v=q/G.duty;z=G.s*(1-2*v);l=0;pt=v<.15?-8*(1-v/.15):v>.7?G.toe*(v-.7)/.3:0;}
        else{const v=(q-G.duty)/(1-G.duty),sm=v*v*(3-2*v);z=-G.s+2*G.s*sm;l=G.lift*Math.sin(Math.PI*v);pt=G.toe*(1-v)*(1-v)-8*v*v;}
        o['F'+sd]=[x,z+(sd==='L'?1:-1)*(G.st||0),yaw,l,pt];}return o;};
    const sp=2*G.s/(G.duty*dur);CC(name,dur,fn,{loop:true,note:`${note}, in place, ${(sp*k).toFixed(1)} m/s`,speed:sp*k});};

  /* ---- on the ground ---- */
  CC('Idle',5,t=>{const p=D*t/5,b=S(p),b2=S(2*p);return wrP(DL_N,{HP:[.02+.006*b,-.01-.004*b2,0],h:[0,-5,3+1.5*b],sp:[.5*b2,2,-1-.6*b],ch:[-3+.8*b2,3+2*S(p+.8),-2],hd:[4+2*S(2*p+1),-4+16*S(p+.6),2+2*S(p)],
    gL:[.36,1.0+.006*b2,.14],gR:[-.33,.92+.01*b2,.1+.02*S(p+.5)],dR:[.04*S(p),-.45,.9],wg:[40+3*S(p),55,10,50+4*S(2*p),-30]});},
    {loop:true,note:'Stands tall, the staff planted upright at his left side, the scimitar held low, point forward; looks slowly round, wings half closed'});
  GAIT('Walk',1.25,{duty:.62,s:.24,lift:.07,toe:16,x:.06,yaw:[5,-5],b:.012,sw:.02,
    body:u=>{const yw=C(D*u),a=C(D*(u-.06));return wrP(DL_N,{HP:[0,-.02,0],h:[1,-6*yw,-3*S(D*(u-.12))],sp:[1,2*yw,1.5*S(D*(u-.12))],ch:[-3,5*yw,1.5*S(D*(u-.12))],hd:[3,-4*yw,-1*S(D*(u-.12))],
      gL:[.36,1.04,.16+.04*a],gR:[-.34,.94,.1-.08*a],dR:[0,-.4,.92]});}},'A slow, confident stride, the staff carried upright, the scimitar swinging low');

  /* ---- war mode ---- */
  CC('Idle (war mode)',2.6,t=>{const p=D*t/2.6,b=S(p);return wrP(DL_W,{HP:[0,-.05-.008*b,0],ch:[3+1.2*S(2*p),-6,0],hd:[-4+1.5*S(2*p+1),14+5*S(p),0],
    gL:[.38,1.12+.015*S(p+1.2),.32],gR:[-.36,1.12+.02*S(p+.4),.34],dR:[-.2,.55+.06*S(p),.8],wg:[36+4*S(p),48,8,40,-18]});},
    {loop:true,note:'Wider stance, left foot forward, the staff angled ahead, the scimitar raised, wings half open'});
  GAIT('Walk (war mode)',1.3,{duty:.64,s:.21,lift:.065,toe:16,x:.1,yaw:[-2,-28],b:.01,sw:.016,st:.07,
    body:u=>wrP(DL_W,{h:[6,-14-3*C(D*u),0],gL:[.38,1.12,.32-.03*C(D*u)],gR:[-.36,1.12,.34+.03*C(D*u)]})},'Advances, staff and scimitar held ready');

  /* ---- flight ---- */
  /* Take off: crouches, opens and raises the wings high, a strong downstroke lifts him off and he beats up into the hover */
  KC('Take off',1.9,[[0,{}],
    [.4,{HP:[0,-.14,.02],h:[14,0,0],sp:[6,0,0],hd:[-4,0,0],FL:[.09,.02,4,0,0],FR:[-.09,-.02,-4,0,0],gL:[.4,1.0,.16],dL:[.05,.95,.25],gR:[-.38,.96,.16],dR:[-.1,-.3,.95],wg:[80,22,6,0,0],ba:[0]}],
    [.66,wrP(DL_F,{fl:[.22],h:[8,0,0],wg:[-16,14,20,0,0],ba:[0]})],
    [1.0,wrP(DL_F,{fl:[.46],wg:[40,20,10,0,0],ba:[.5]})],
    [1.9,DL_F]],'Crouches, opens and raises the wings high, a strong downstroke lifts him off the ground and he beats up into the hover',{base:DL_N,next:'Hover',beat:1.0});
  CC('Hover',2.0,t=>{const a=D*t/2.0;return wrP(DL_F,{fl:[.7+.04*S(D*t/1.0-1.2)],HP:[.03*S(a),0,.02*S(2*a)],h:[6,0,3*S(a)],hd:[2+3*S(a*2),12*S(a+.6),3*S(a)],
    FL:[.08,.04+.03*S(a),4,-.04,46+6*S(a)],FR:[-.08,-.1+.03*S(a+1.4),-6,.06,40+6*S(a+1.4)],gL:[.4,1.06+.02*S(a+1),.2],gR:[-.38,1.0+.02*S(a+2),.22]});},
    {loop:true,beat:1.0,next:null,note:'Hovers on slow, strong beats of his spread wings, bobbing gently, legs hanging, staff and scimitar in hand'});
  CC('Fly',1.4,t=>{const a=D*t/1.4;return wrP(DL_F,{fl:[.8+.05*S(D*t/.7-1.2)],h:[30,0,3*S(a)],sp:[4,0,0],ch:[0,0,0],nk:[-6,0,0],hd:[-14,0,0],FL:[.08,-.2,4,.05,60],FR:[-.08,-.28,-4,.1,64],
    gL:[.36,1.0,-.02],dL:[.05,.6,.8],gR:[-.34,.98,-.04],dR:[-.05,-.1,1],pL:[.6,-.2,-.7],pR:[-.6,-.2,-.7],wg:[16,22,30,8,0]});},
    {loop:true,beat:.7,next:null,speed:5,note:'Flies forward leaning into the air, legs streaming behind, on strong beats of the spread wings, in place, 5 m/s'});
  KC('Land',1.7,[[0,DL_F],[.75,wrP(DL_F,{fl:[.22],h:[10,0,0],FL:[.08,.02,4,0,20],FR:[-.08,-.04,-6,.02,20],wg:[40,15,10,0,0],ba:[.6]})],
    [1.05,{HP:[0,-.12,.02],h:[12,0,0],sp:[5,0,0],FL:[.09,.02,4,0,0],FR:[-.09,-.02,-4,0,0],gL:[.4,1.0,.16],dL:[.05,.95,.25],gR:[-.38,.96,.16],dR:[-.1,-.3,.95],wg:[60,24,8,20,0],ba:[0]}],
    [1.7,{}]],'Beats down out of the hover, lands on bent knees and folds his wings half closed',{base:DL_N,next:'Idle',beat:1.0});

  /* ---- spells (gestures; the effects are added separately) ---- */
  /* Spell 1 (hellfire bolt): draws the staff back, then thrusts its head at the enemy (the bolt leaves at 0.8 s) */
  KC('Spell 1 (hellfire bolt)',2.0,[[0,{}],
    [.45,{h:[2,8,0],sp:[-2,6,0],ch:[-6,10,0],hd:[-4,4,0],gL:[.42,1.32,.06],dL:[.05,.85,-.5],jw:[.1]}],
    [.78,{h:[10,-8,0],sp:[6,-4,0],ch:[6,-4,0],hd:[-6,10,0],FL:[.12,.26,-4,0,0],gL:[.36,1.36,.6],dL:[.12,.4,.9],jw:[.5]}],
    [.86,{h:[10,-8,0],sp:[6,-4,0],ch:[6,-4,0],hd:[-6,10,0],FL:[.12,.26,-4,0,0],gL:[.36,1.37,.61],dL:[.12,.38,.91],jw:[.4]}],
    [1.3,{h:[6,-16,0],ch:[4,-8,0],FL:[.12,.22,-4,0,0],gL:[.36,1.24,.48],dL:[0,.7,.7],jw:[.1]}],
    [2.0,{}]],'Draws the staff back, then thrusts its head at the enemy (the bolt leaves at 0.8 s)');
  /* Spell 2 (ring of fire): raises the staff high over his head, the scimitar out to the side, then drives the staff's foot into the
     ground before him (the ring of fire bursts out at 1.6 s) */
  {const UP={HP:[0,0,0],h:[-2,-6,0],sp:[-4,-2,0],ch:[-8,-2,0],nk:[-4,0,0],hd:[-16,6,0],FL:[.1,.08,-2,0,0],FR:[-.1,-.1,-20,0,0],gL:[.36,1.72,.14],dL:[0,1,.05],gR:[-.56,1.3,.1],dR:[-.6,.6,.4],wg:[56,30,6,24,0]};
  const DN={HP:[0,-.2,.04],h:[16,-8,0],sp:[8,-2,0],ch:[8,-4,0],nk:[4,0,0],hd:[8,10,0],FL:[.12,.18,-4,0,0],FR:[-.12,-.22,-26,0,0],gL:[.3,1.06,.5],dL:[0,1,.08],gR:[-.5,1.0,.2],dR:[-.5,-.1,.86],wg:[30,40,8,40,0]};
  KC('Spell 2 (ring of fire)',3.0,[[0,{}],[.7,wrP(UP,{jw:[.3]})],[1.3,wrP(UP,{gL:[.36,1.76,.15],jw:[.6]})],[1.6,wrP(DN,{jw:[.7]})],[1.72,wrP(DN,{jw:[.5]})],
    [2.4,wrP(DN,{HP:[0,-.19,.04],jw:[.2]})],[3.0,{}]],'Raises the staff high over his head, then drives its foot into the ground before him (the ring of fire bursts out at 1.6 s)');}
  /* Spell 3 (summon): rises a little off the ground, wings spread wide, the staff raised high and the scimitar flung out, head thrown
     back, calling up his minions; settles again */
  {const HI={fl:[.3],HP:[0,0,0],h:[-3,0,0],sp:[-5,0,0],ch:[-9,0,0],nk:[-6,0,0],hd:[-20,0,0],FL:[.08,-.02,6,-.06,40],FR:[-.08,-.05,-6,-.05,36],gL:[.56,1.62,.1],dL:[.15,1,0],gR:[-.66,1.44,.08],dR:[-.8,.5,.2],wg:[20,14,10,0,0],ba:[0]};
  KC('Spell 3 (summon)',3.4,[[0,{}],[.5,{HP:[0,-.16,0],h:[14,-4,0],sp:[8,-2,0],ch:[8,-2,0],hd:[10,6,0],gL:[.36,1.0,.34],dL:[0,1,.1],gR:[-.36,.98,.32],dR:[-.2,.2,.95],wg:[60,30,8,30,0],jw:[.1]}],
    [1.1,wrP(HI,{fl:[.22],jw:[.6]})],[1.3,wrP(HI,{jw:[.9]})],[2.3,wrP(HI,{fl:[.32],gL:[.57,1.63,.1],gR:[-.67,1.45,.08],jw:[.7]})],[2.9,{fl:[.06]}],[3.4,{}]],
    'Rises a little off the ground, wings spread wide, the staff raised high and the scimitar flung out, head thrown back, calling up his minions; settles again (the summoning at 1.3 s)');}
  /* Spell 4 (rain of fire): from the hover, rises, lifts the staff high, then sweeps its head down at the ground before him (the fire
     falls at 1.25 s) and beats back into the hover */
  KC('Spell 4 (rain of fire)',2.6,[[0,{}],
    [.6,{fl:[.86],h:[-4,0,0],sp:[-4,0,0],ch:[-8,0,0],hd:[-12,0,0],gL:[.4,1.74,.1],dL:[0,.9,-.4],gR:[-.5,1.2,.1],dR:[-.5,.2,.85],wg:[30,16,10,0,0],ba:[.6],jw:[.4]}],
    [1.2,{fl:[.8],h:[14,-6,0],sp:[6,-2,0],ch:[8,-4,0],hd:[10,6,0],gL:[.34,1.2,.56],dL:[-.05,-.35,.94],gR:[-.44,1.04,.24],dR:[-.3,-.2,.93],wg:[10,24,16,6,0],ba:[1],jw:[.7]}],
    [1.4,{fl:[.79],h:[14,-6,0],sp:[6,-2,0],ch:[8,-4,0],hd:[10,6,0],gL:[.34,1.18,.57],dL:[-.05,-.38,.92],gR:[-.44,1.04,.24],dR:[-.3,-.2,.93],wg:[10,24,16,6,0],ba:[1],jw:[.5]}],
    [2.6,{}]],'From the hover he rises and lifts the staff high, then sweeps its head down at the ground before him (the fire falls at 1.25 s) and beats back into the hover',{base:DL_F,next:'Hover',beat:1.0});

  /* ---- attacks ---- */
  /* Scimitar slash: raises the scimitar high beside his right shoulder, blade back, and cuts down and across to the left with a step in */
  const RAISE={h:[2,12,0],sp:[-2,8,0],ch:[-6,12,0],hd:[-4,-10,0],gR:[-.5,1.6,.12],dR:[-.35,.88,-.3],gL:[.4,1.16,.3],jw:[.3],wg:[44,40,8,36,0]};
  KC('Scimitar slash',1.4,[[0,{}],[.38,RAISE],
    [.62,{h:[12,-16,0],sp:[8,-6,0],ch:[8,-10,0],hd:[0,10,0],FL:[.12,.27,-4,0,0],gR:[-.12,1.1,.62],dR:[.5,-.25,.83],gL:[.42,1.08,.2],jw:[.6],wg:[30,50,10,46,0]}],
    [.76,{h:[14,-22,0],sp:[9,-8,0],ch:[9,-12,0],hd:[2,14,0],FL:[.12,.27,-4,0,0],gR:[.0,.98,.58],dR:[.62,-.4,.67],gL:[.42,1.06,.18],jw:[.4],wg:[30,50,10,46,0]}],
    [1.4,{}]],'Raises the scimitar high beside his right shoulder and cuts down and across with a step in');
  /* Scimitar combo: the same downward cut, then a backhand cut out to the right */
  KC('Scimitar combo',2.0,[[0,{}],[.38,RAISE],
    [.62,{h:[12,-16,0],sp:[8,-6,0],ch:[8,-10,0],hd:[0,10,0],FL:[.12,.27,-4,0,0],gR:[-.12,1.1,.62],dR:[.5,-.25,.83],gL:[.42,1.08,.2],jw:[.6],wg:[30,50,10,46,0]}],
    [.78,{h:[14,-22,0],sp:[9,-8,0],ch:[9,-12,0],hd:[2,14,0],FL:[.12,.27,-4,0,0],gR:[.0,1.04,.56],dR:[.55,-.1,.83],gL:[.42,1.06,.18],jw:[.3],wg:[30,50,10,46,0]}],
    [1.08,{h:[8,8,0],sp:[4,6,0],ch:[4,8,0],hd:[0,-6,0],FL:[.12,.27,-4,0,0],gR:[-.6,1.26,.42],dR:[-.85,.1,.5],gL:[.4,1.1,.24],jw:[.7],wg:[30,50,10,46,0]}],
    [1.2,{h:[8,10,0],sp:[4,7,0],ch:[4,9,0],hd:[0,-8,0],FL:[.12,.27,-4,0,0],gR:[-.64,1.24,.32],dR:[-.9,.05,.42],gL:[.4,1.1,.24],jw:[.4],wg:[30,50,10,46,0]}],
    [2.0,{}]],'Cuts down and across with a step in, then whips a backhand cut out to the right');
  /* Scimitar thrust: draws the blade back at his side, point forward, and lunges to drive the point at the enemy */
  KC('Scimitar thrust',1.5,[[0,{}],
    [.42,{HP:[0,-.08,-.04],h:[4,14,0],sp:[0,6,0],ch:[-2,10,0],hd:[-2,-12,0],gR:[-.44,1.12,-.04],dR:[0,.12,1],gL:[.42,1.14,.32],jw:[.2]}],
    [.7,{HP:[0,-.14,.12],h:[14,-12,0],sp:[6,-4,0],ch:[6,-6,0],hd:[2,12,0],FL:[.12,.36,-4,0,0],FR:[-.12,-.2,-30,0,0],gR:[-.2,1.28,.72],dR:[.05,.05,1],gL:[.44,1.1,.1],jw:[.6]}],
    [.86,{HP:[0,-.14,.12],h:[14,-12,0],sp:[6,-4,0],ch:[6,-6,0],hd:[2,12,0],FL:[.12,.36,-4,0,0],FR:[-.12,-.2,-30,0,0],gR:[-.2,1.28,.73],dR:[.05,.05,1],gL:[.44,1.1,.1],jw:[.4]}],
    [1.5,{}]],'Draws the scimitar back at his side, point forward, and lunges to drive the point at the enemy');
  /* Wing buffet: raises the wings high and back, then slams them forward in a gust */
  KC('Wing buffet',1.5,[[0,{}],
    [.48,{HP:[0,-.08,-.04],h:[-6,0,0],sp:[-6,0,0],ch:[-8,0,0],hd:[-8,0,0],gL:[.44,1.18,.2],gR:[-.44,1.16,.2],wg:[72,64,0,20,0],jw:[.2]}],
    [.68,{HP:[0,-.06,.08],h:[16,0,0],sp:[8,0,0],ch:[6,0,0],hd:[8,0,0],FL:[.12,.24,-4,0,0],gL:[.38,1.1,.36],gR:[-.38,1.1,.36],wg:[-6,-36,-14,-20,0],jw:[.7]}],
    [.84,{HP:[0,-.06,.08],h:[16,0,0],sp:[8,0,0],ch:[6,0,0],hd:[8,0,0],FL:[.12,.24,-4,0,0],gL:[.38,1.1,.36],gR:[-.38,1.1,.36],wg:[-8,-38,-14,-22,0],jw:[.5]}],
    [1.5,{}]],'Raises his wings high and back, then slams them forward in a gust that knocks the enemy back');
  /* Taunt: spreads his arms wide, staff and scimitar out, wings opening, throws his head back and laughs */
  KC('Taunt',2.8,[[0,{}],
    [.6,{HP:[0,-.02,0],h:[0,-4,0],sp:[-2,0,0],ch:[-6,0,0],hd:[2,4,0],FL:[.1,.06,0,0,0],FR:[-.1,-.06,-14,0,0],gL:[.6,1.3,.16],dL:[.25,.96,.05],gR:[-.62,1.28,.16],dR:[-.6,.5,.5],wg:[30,28,8,14,0]}],
    [1.1,{HP:[0,-.02,0],h:[0,-4,0],sp:[-4,0,0],ch:[-10,0,0],nk:[-6,0,0],hd:[-18,0,0],FL:[.1,.06,0,0,0],FR:[-.1,-.06,-14,0,0],gL:[.62,1.34,.14],dL:[.25,.96,.05],gR:[-.64,1.32,.14],dR:[-.6,.5,.5],wg:[26,24,8,10,0],jw:[.5]}],
    [2.1,{HP:[0,-.02,0],h:[0,-4,0],sp:[-2,0,0],ch:[-6,0,0],hd:[6,6,6],FL:[.1,.06,0,0,0],FR:[-.1,-.06,-14,0,0],gL:[.58,1.28,.18],dL:[.25,.96,.05],gR:[-.6,1.26,.18],dR:[-.6,.5,.5],wg:[30,28,8,14,0],jw:[.1]}],
    [2.8,{}]],'Spreads his arms wide, staff and scimitar out, wings opening, throws his head back and laughs',
    {add:(t,p)=>{if(t<.8||t>1.9)return p;const o=Object.assign({},p),g=Math.abs(S(D*(t-.8)/.28))*Math.min(1,(t-.8)/.1,(1.9-t)/.1);o.jw=[p.jw[0]+.2*g];o.ch=[p.ch[0]-1.5*g,p.ch[1],p.ch[2]];return o;}});

  /* ---- reactions ---- */
  KC('Hit 1',.9,[[0,{}],
    [.1,{HP:[0,-.06,-.1],h:[-8,-10,0],sp:[-8,-4,0],ch:[-12,-6,0],nk:[-8,0,0],hd:[-24,6,8],gL:[.48,1.3,.22],gR:[-.46,1.24,.22],jw:[.6],wg:[50,40,0,30,0]}],
    [.36,{HP:[0,-.06,-.05],h:[2,-12,0],sp:[2,-4,0],ch:[0,-6,0],hd:[-8,8,0],jw:[.2]}],
    [.9,{}]],'Blow to the face: his head snaps back, his arms fly up and the wings jerk open');
  KC('Hit 2',1.1,[[0,{}],
    [.12,{HP:[.06,-.08,0],h:[6,8,-10],sp:[4,4,-6],ch:[0,6,-8],hd:[-10,24,-12],gL:[.54,1.24,.26],jw:[.5],wg:[44,40,6,30,0]}],
    [.32,{HP:[.08,-.1,0],h:[6,0,-6],sp:[5,0,-4],ch:[2,0,-6],hd:[-2,16,-6],FL:[.18,.12,2,0,0],gL:[.48,1.2,.32],jw:[.2]}],
    [.62,{HP:[.05,-.08,0],FL:[.18,.12,2,0,0]}],
    [1.1,{}]],'Struck from the right: twists away and catches himself with a step, then turns back');
  KC('Heavy hit',2.5,[[0,{}],
    [.12,{HP:[0,-.08,-.1],h:[-8,-12,0],sp:[-10,-4,0],ch:[-14,-6,0],nk:[-8,0,0],hd:[-26,6,6],gL:[.5,1.3,.22],gR:[-.48,1.24,.22],jw:[.7],wg:[54,40,0,30,0]}],
    [.36,{HP:[0,-.24,-.12],h:[8,-12,0],sp:[2,-4,0],ch:[0,-6,0],hd:[-8,8,4],FL:[.12,-.04,-4,.06,30],gL:[.44,1.04,.3],gR:[-.42,1.0,.3],jw:[.4],wg:[34,44,6,40,0]}],
    [.64,{HP:[0,-.41,-.12],h:[18,-12,0],sp:[10,-4,0],ch:[8,-6,0],hd:[6,8,0],FL:[.12,-.38,-4,0,70],FR:[-.12,-.06,-30,0,0],gL:[.4,.92,.48],dL:[0,1,.05],gR:[-.4,.84,.34],dR:[-.3,-.2,.93],jw:[.2],wg:[24,52,10,56,0]}],
    [1.35,{HP:[0,-.41,-.12],h:[20,-12,0],sp:[11,-4,0],ch:[9,-6,0],hd:[-6,14,0],FL:[.12,-.38,-4,0,70],FR:[-.12,-.06,-30,0,0],gL:[.4,.92,.49],dL:[0,1,.05],gR:[-.4,.84,.35],dR:[-.3,-.2,.93],jw:[.3],wg:[24,52,10,56,0]}],
    [1.75,{HP:[0,-.3,-.08],h:[22,-12,0],sp:[10,-4,0],ch:[8,-6,0],hd:[-4,10,0],FL:[.12,-.3,-4,0,42],FR:[-.12,-.08,-30,0,0],gL:[.4,.98,.44],dL:[0,1,.1],gR:[-.4,.92,.32],dR:[-.3,-.1,.95],jw:[.1],wg:[28,50,10,50,0]}],
    [2.05,{HP:[0,-.1,-.02],h:[8,-14,0],FL:[.12,.0,-4,.05,10]}],
    [2.5,{}]],'Knocked down onto his left knee, leaning on the staff, then rises again');
  /* Death: reels from the blow and sinks onto his knees leaning on the staff, the wings sagging; throws his head back and roars, then
     shrinks to nothing (held: gone; the owner adds the effect) */
  {const KN={HP:[0,-.41,-.08],h:[14,-6,0],sp:[6,-2,0],ch:[4,-2,0],nk:[2,0,0],hd:[4,4,0],FL:[.12,-.3,-4,0,72],FR:[-.12,-.32,-14,0,74],gL:[.38,.86,.46],dL:[0,1,.05],gR:[-.4,.8,.3],dR:[-.2,-.3,.93],wg:[4,64,12,60,0]};
  const SC={h:[4,-6,0],sp:[-4,-2,0],ch:[-11,-2,0],nk:[-8,0,0],hd:[-32,0,0],gR:[-.5,1.0,.2],dR:[-.5,.1,.86],jw:[1],wg:[30,40,4,30,0]};
  KC('Death',4.0,[[0,{}],
    [.14,{HP:[0,-.08,-.12],h:[-10,-12,0],sp:[-10,-4,0],ch:[-14,-6,0],nk:[-8,0,0],hd:[-26,6,6],gL:[.5,1.3,.22],gR:[-.48,1.24,.22],jw:[.7],wg:[54,40,0,30,0]}],
    [.5,{HP:[0,-.2,-.1],h:[6,-10,0],sp:[2,-4,0],ch:[0,-4,0],hd:[-4,4,4],FL:[.12,.02,-4,.06,20],gL:[.44,1.04,.32],gR:[-.42,1.0,.3],jw:[.3],wg:[34,50,8,44,0]}],
    [.95,wrP(KN,{jw:[.2]})],
    [1.5,wrP(KN,SC)],[1.9,wrP(KN,wrP(SC,{ch:[-12,-2,0],hd:[-33,0,0]}))],
    [2.15,wrP(KN,wrP(SC,{ch:[-12,-2,0],hd:[-33,0,0],vb:[.7,0]}))],
    [2.45,wrP(KN,wrP(SC,{ch:[-12,-2,0],hd:[-33,0,0],vb:[.001,0]}))],
    [4.0,wrP(KN,wrP(SC,{ch:[-12,-2,0],hd:[-33,0,0],vb:[.001,0]}))]],
    'Reels from the blow and sinks onto his knees leaning on the staff, the wings sagging; throws his head back and roars, then shrinks to nothing (held: gone)',{hold:true,next:null,fps:60});}
  return DL_CLIPS=L;}

ASSETS.push({id:'devil-lord',folder:'characters/enemies/hell',name:'Devil Lord',kind:'character',variants:true,defaultSeed:1,groundR:2.6,build:(s,o)=>buildDevilLord(s,o||{}),
  opts:[{key:'skin',label:'Skin',choices:[['random','Random'],...Object.entries(DL_SKIN).map(([k,v])=>[k,v[1].charAt(0).toUpperCase()+v[1].slice(1)])],def:'random'},
    {key:'glow',label:'Eyes and magic',choices:[['random','Random'],['gold','Gold glow'],['red','Red glow'],['green','Green glow'],['violet','Violet glow']],def:'random'},
    {key:'garb',label:'Doublet',choices:[['random','Random'],['black','Black'],['crimson','Crimson'],['purple','Royal purple']],def:'random'},
    {key:'horns',label:'Horns',choices:[['random','Random'],['swept','Swept back'],['ram','Ram'],['great','Great']],def:'random'},
    {key:'staff',label:'Staff',choices:[['random','Random'],['orb','Horned orb'],['skull','Goat skull'],['gem','Caged gem']],def:'random'},
    {key:'blade',label:'Scimitar',choices:[['random','Random'],['steel','Steel'],['obsidian','Obsidian, glowing edge']],def:'random'}],
  desc:'Devil Lord: a charismatic, 2.2 m humanoid devil with coloured skin, slicked-back hair with a widow\'s peak, glowing eyes, a waxed moustache and pointed goatee, a sly fanged smile, long pointed ears and big horns with gold bands; an open gold-trimmed doublet with a high collar over a bare chest, a gold medallion, pauldrons, bracers and tall boots. Big bat wings, half closed on the ground and spread wide in flight. A staff in the left hand and a scimitar in the right. Clips: Idle, Walk, war-mode Idle and Walk, Take off, Hover, Fly, Land, Spell 1 (hellfire bolt), Spell 2 (ring of fire), Spell 3 (summon), Spell 4 (rain of fire, from the air), Scimitar slash, Scimitar combo, Scimitar thrust, Wing buffet, Taunt, Hit 1, Hit 2, Heavy hit and Death. Spell effects are added separately.'});
