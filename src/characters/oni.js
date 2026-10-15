/* ======================= ONI: a muscular Japanese demon, about 3 m tall, with a kanabō, a spiked club or a barbed club =======================
   Built in real metres on the villager's 25 joints (no group scale, so the 5 cm texture pixels stay the same): long muscled legs,
   a narrow waist with a six-pack, a broad chest with big pecs, traps and lats, thick arms with gold arm rings and wrist cuffs, and a
   big head with a square jaw, upward fangs, bulging eyes under a furrowed brow, pointed ears, horns (two or one) and a wild mane.
   A tiger-skin loincloth (trunks over the thighs) under a thick twisted straw rope belt with a knot, gold rings round the ankles.
   The weapon is held in the right hand only (oni swing their clubs one-handed), the left hand is free. Clips use the revenant's
   solver (rvSolver on the oni's own rig): hand targets in the torso's frame, elbow poles from a cost search, wrists clamped and
   rate-limited, so arms never twist or flip. After each solve the weapon is tilted up until none of it is below the ground. */
VB.oni=Object.assign({},VB.ogre,{thigh:.62,shin:.58,ankle:.12,hipOff:.1,spine:.3,chest:.3,neck:.44,headY:.1,shW:.78,ua:.62,fa:.56,g:2.9,hipW:.24,hand:2.1});
{const b=VB.oni;b.key='oni';b.hipH=b.thigh+b.shin+b.ankle+b.hipOff;b.legS=(b.thigh+b.shin)/.84;b.tS=(b.spine+b.chest)/.3;b.cS=b.neck/.22;}
const ON_SKIN={red:['#a94d3b','red (aka-oni)'],blue:['#41659a','blue (ao-oni)'],yellow:['#cdb84e','yellow (ki-oni)'],green:['#5a7a46','green (midori-oni)'],black:['#3c3836','black (kuro-oni)']};
const ON_HAIR=[['#1a1614','black'],['#1a1614','black'],['#dcd6c8','white'],['#572c1e','dark red']];
const ON_WPN={kanabo:'iron kanabō',spiked:'spiked club',barbed:'barbed club'};

/* weapons: grip at the origin, the heavy end along +y (about 1.8 m), a short handle below. Meshes sit directly in the group */
function onWeapon(kind){const w=new THREE.Group(),ir=bm('#3a3a3e','plain'),irL=bm('#5a5a60','plain'),irD=bm('#26262a','plain'),grip=bm('#2a1e16','leather'),cordR=bm('#9a2a22','cloth'),
    wd=bm('#5a3e28','leather'),wdD=bm('#3e2a1a','leather'),D=Math.PI;
  /* handle: a leather-wrapped grip with red cord bands and an iron pommel */
  bx(w,.11,.5,.11,grip,0,-.06,0);for(const y of[-.24,-.06,.12])bx(w,.12,.03,.12,cordR,0,y,0);bx(w,.15,.06,.15,irD,0,-.33,0);
  if(kind==='kanabo'){
    /* iron kanabō: a ring pommel with a red tassel, a collar, an eight-sided body widening towards the end, studs in a checker */
    for(const[x,y,ww,hh]of[[0,-.38,.12,.025],[0,-.47,.12,.025],[.05,-.425,.025,.09],[-.05,-.425,.025,.09]])bx(w,ww,hh,.025,irD,x,y,0);
    bx(w,.04,.04,.04,cordR,0,-.5,0);bx(w,.06,.16,.06,cordR,0,-.6,0);bx(w,.075,.04,.075,cordR,0,-.68,0);
    bx(w,.17,.05,.17,irD,0,.2,0);
    const seg=[[.22,.6,.15],[.6,1.0,.18],[1.0,1.4,.21],[1.4,1.72,.235],[1.72,1.82,.21]];
    for(const[y0,y1,s]of seg){bx(w,s,y1-y0,s,ir,0,(y0+y1)/2,0);bx(w,s,y1-y0,s,ir,0,(y0+y1)/2,0,0,D/4,0);}
    bx(w,.25,.04,.25,irD,0,1.42,0);bx(w,.25,.04,.25,irD,0,1.42,0,0,D/4,0);bx(w,.16,.03,.16,irL,0,1.835,0);
    const rad=y=>{for(const[y0,y1,s]of seg)if(y<y1)return s/2;return .105;};
    for(let i=0;i<10;i++){const y=.4+i*.14;if(Math.abs(y-1.42)<.05)continue;const r=rad(y);for(let k=0;k<8;k++){if((k+i)%2)continue;const a=k*D/4;
      bx(w,.05,.055,.055,irL,Math.cos(a)*(r+.022),y,Math.sin(a)*(r+.022),0,-a,0);bx(w,.025,.03,.03,irL,Math.cos(a)*(r+.055),y,Math.sin(a)*(r+.055),0,-a,0);}}}
  else{
    /* wooden club: a body that swells towards the end, two iron bands; spikes or hooked barbs all round */
    const seg=[[.2,.6,.16],[.6,1.0,.2],[1.0,1.4,.24],[1.4,1.7,.26],[1.7,1.8,.21]];
    bx(w,.17,.05,.17,wdD,0,.2,0);for(const[y0,y1,s]of seg)bx(w,s,y1-y0,s,wd,0,(y0+y1)/2,0);
    bx(w,.21,.05,.21,ir,0,.62,0);bx(w,.28,.06,.28,ir,0,1.42,0);bx(w,.09,.12,.06,wdD,.1,.85,.07);bx(w,.06,.1,.07,wdD,-.11,1.18,-.08);
    const rad=y=>{for(const[y0,y1,s]of seg)if(y<y1)return s/2;return .105;};
    if(kind==='spiked'){
      /* long iron spikes sticking straight out, eight round in staggered rows, and one out of the end */
      for(let i=0;i<8;i++){const y=.78+i*.135,r=rad(y);for(let k=0;k<4;k++){const a=k*D/2+(i%2?D/4:0)+.2;
        bx(w,.14,.04,.04,ir,Math.cos(a)*(r+.06),y,Math.sin(a)*(r+.06),0,-a,0);bx(w,.06,.024,.024,irL,Math.cos(a)*(r+.15),y,Math.sin(a)*(r+.15),0,-a,0);}}
      bx(w,.05,.12,.05,ir,0,1.86,0);bx(w,.03,.06,.03,irL,0,1.94,0);}
    else{
      /* hooked iron barbs (each sticks out, then bends back towards the grip) and a band of barbed wire round the middle */
      for(let i=0;i<7;i++){const y=.82+i*.15,r=rad(y);for(let k=0;k<5;k++){const a=k*D*2/5+(i%2?D/5:0),g=new THREE.Group();put(w,g,0,y,0,0,-a,0);
        bx(g,.1,.035,.035,ir,r+.04,0,0);bx(g,.09,.03,.03,irL,r+.1,-.03,0,0,0,-.9);}}
      for(const y of[1.04,1.1,1.16])for(let k=0;k<6;k++){const a=k*D/3+y*7;bx(w,.04,.012,.012,irD,Math.cos(a)*(rad(y)+.015),y,Math.sin(a)*(rad(y)+.015),0,-a,0);}
      bx(w,.25,.018,.25,irD,0,1.1,0);}}
  w.userData.len=0;for(const m of w.children)w.userData.len=Math.max(w.userData.len,m.position.y);
  return w;}

function buildOni(seed,o={}){const B=VB.oni,r=mulberry32(((seed*2654435761)>>>0)^0x0a1e),pick=a=>a[Math.floor(r()*a.length)],root=new THREE.Group();root.userData.lights=[];
  /* roll everything, then let the options override */
  const rk=pick(['red','red','blue','blue','yellow','green','black']),rh=pick(['two','two','two','one']),hairC=pick(ON_HAIR),beard=r()<.5,beads=r()<.6,scar=r()<.4,ironRings=r()<.3;
  const opt=(kk,d)=>o[kk]&&o[kk]!=='random'?o[kk]:d,skinK=opt('skin',rk),horns=opt('horns',rh),wpn=o.weapon||'kanabo';
  const sk=ON_SKIN[skinK],shade=(h,f)=>'#'+new THREE.Color(h).multiplyScalar(f).getHexString(),skin=bm(sk[0],'skin'),skinD=bm(shade(sk[0],.84),'skin'),skinM=bm(shade(sk[0],.64),'skin'),skinX=bm(shade(sk[0],.42),'skin');
  const tig=bm('#cf9b48','hair'),tigD=bm('#1e1810','hair'),tigW=bm('#e8dcc0','hair'),rope=bm('#d2c08a','leather'),ropeD=bm('#a8945e','leather'),
    gold=ironRings?bm('#5a5a60','plain'):bm('#c8a050','plain'),goldD=ironRings?bm('#3a3a3e','plain'):bm('#9a7838','plain'),dark=bm('#1a1210','plain'),
    eyeW=bm('#ebe1c0','plain'),eyeR=bm('#b95141','plain'),ivory=bm('#ece2c4','plain'),horn=bm('#e6dcbc','plain'),hornD=bm('#8a7a58','plain'),nail=bm('#2a201a','plain'),
    hairM=bm(hairC[0],'hair'),hairD=bm(shade(hairC[0],.75),'hair'),bead=bm('#5a3a22','leather'),beadR=bm('#8f3832','plain');
  /* joints: same names, offsets and order as buildVillager */
  const hips=J('hips',root,0,B.hipH,0),spine=J('spine',hips,0,B.spine,0),chest=J('chest',spine,0,B.chest,0),neck=J('neck',chest,0,B.neck,0),head=J('head',neck,0,B.headY,0);
  const aw=.36,lw=.13*B.g,fk=B.ankle/.06,hk=B.hand,g=B.g;
  /* ragged hem: teeth of random length hanging below y around a w x d garment */
  const hem=(par,w,d,y,m,n,L0,L1)=>{for(const[f,s]of[[1,1],[1,-1],[0,1],[0,-1]]){const span=f?w:d;for(let i=0;i<n;i++){if(r()<.3)continue;const tw=span/n*(.55+.35*r()),L=L0+(L1-L0)*r(),c=-span/2+(i+.5)*span/n;
    if(f)bx(par,tw,L,.03,m,c,y-L/2+.006,s*(d/2+.006));else bx(par,.03,L,tw,m,s*(w/2+.006),y-L/2+.006,c);}}};
  /* tiger stripes on the faces of a w x d garment between y0 and y1: dark bands, slightly slanted, of uneven length */
  const stripes=(par,w,d,y0,y1,n)=>{const h=y1-y0;for(const[f,s]of[[1,1],[1,-1],[0,1],[0,-1]]){const span=f?w:d;for(let i=0;i<n;i++){const c=-span/2+(i+.3+.4*r())*span/n,L=h*(.45+.4*r()),y=y0+h*(.3+.4*r()),t=(r()-.5)*.5;
    if(f)bx(par,.045,L,.012,tigD,c,y,s*(d/2+.004),0,0,t);else bx(par,.012,L,.045,tigD,s*(w/2+.004),y,c,t,0,0);}}};
  /* hips: tiger-skin wrap with stripes and a ragged hem; a thick twisted straw rope belt with a knot at the front and short frayed ends */
  bx(hips,.96,.36,.66,tig,0,-.05,0);stripes(hips,.96,.66,-.2,.1,5);hem(hips,.96,.66,-.23,tig,6,.03,.08);
  bx(hips,1.0,.13,.7,rope,0,.14,0);for(let i=0;i<9;i++)bx(hips,.035,.15,.02,ropeD,-.44+i*.11,.14,.352,0,0,.6);for(let i=0;i<6;i++)bx(hips,.035,.15,.02,ropeD,-.38+i*.15,.14,-.352,0,0,.6);
  for(const s of[-1,1])for(let i=0;i<5;i++)bx(hips,.02,.15,.035,ropeD,s*.502,.14,-.26+i*.13,.6,0,0);
  bx(hips,.18,.16,.1,rope,.06,.13,.38);bx(hips,.1,.1,.06,ropeD,.06,.13,.44);
  for(const[x,L,t]of[[.0,.2,.15],[.12,.16,-.2]]){bx(hips,.06,L,.05,rope,x,.06-L/2,.4,0,0,t);for(const dx of[-.02,.02])bx(hips,.02,.05,.02,ropeD,x+dx-Math.sin(t)*L/2,.06-L-.01,.4);}
  /* waist: narrow, a six-pack, obliques, a navel */
  bx(spine,.84,.52,.56,skin,0,0,0);bx(spine,.06,.38,.4,skin,.43,-.02,.02);bx(spine,.06,.38,.4,skin,-.43,-.02,.02);
  for(const y of[-.12,0,.12])for(const s of[-1,1])bx(spine,.15,.1,.05,skin,s*.085,y,.29);bx(spine,.02,.36,.02,skinM,0,0,.295);for(const y of[-.06,.06])bx(spine,.32,.02,.02,skinM,0,y,.295);
  bx(spine,.04,.04,.02,skinX,0,-.2,.285);bx(spine,.7,.3,.06,skin,0,.08,-.29);
  if(scar)bx(spine,.36,.03,.012,skinX,.12,.04,.322,0,0,-.55);
  /* chest: broad, big pecs, a V of lats at the back, traps rising to the neck */
  bx(chest,1.1,.52,.62,skin,0,.16,0);bx(chest,1.0,.36,.08,skin,0,.12,-.33);bx(chest,.03,.3,.02,skinM,0,.14,-.372);
  for(const s of[-1,1]){bx(chest,.46,.26,.08,skin,s*.24,.2,.33);bx(chest,.42,.03,.02,skinM,s*.24,.075,.37);bx(chest,.05,.04,.02,skinD,s*.28,.15,.372);}
  bx(chest,.66,.17,.44,skin,0,.48,-.05);bx(neck,.44,.26,.42,skin,0,.02,.04);
  /* juzu: big wooden prayer beads round the base of the neck, a red bead at the front */
  if(beads){for(let i=-6;i<=6;i++){const x=i*.06,y=.46-.11*(1-(i/6)*(i/6)),z=y>.42?.21:.345;bx(chest,.075,.075,.07,i===0?beadR:bead,x,y,z);}
    for(const s of[-1,1])for(const z of[.1,-.02,-.14])bx(chest,.07,.07,.07,bead,s*.33,.575,z);}
  /* head: big; square jaw, upward fangs, bulging eyes under a furrowed brow, broad nose, pointed ears, horns and a wild mane */
  const hg=new THREE.Group();head.add(hg);hg.position.z=.06;
  bx(hg,.56,.4,.52,skin,0,.3,-.02);bx(hg,.6,.18,.5,skin,0,.04,.06);bx(hg,.36,.1,.4,skin,0,-.06,.1);bx(hg,.5,.08,.44,skin,0,.18,.06);
  bx(hg,.42,.08,.02,dark,0,.1,.312);bx(hg,.38,.025,.02,ivory,0,.128,.316);bx(hg,.36,.025,.02,ivory,0,.072,.316);
  for(const s of[-1,1]){bx(hg,.055,.15,.055,ivory,s*.17,.15,.31);bx(hg,.035,.04,.035,ivory,s*.17,.24,.31);bx(hg,.04,.06,.03,ivory,s*.09,.085,.322);
    /* bulging eyes, red rims, small pupils; heavy brows slanting down to the middle, bushy hair on them */
    bx(hg,.14,.11,.06,eyeR,s*.13,.33,.28);bx(hg,.12,.09,.06,eyeW,s*.13,.33,.295);bx(hg,.045,.05,.02,dark,s*.12,.33,.325);
    bx(hg,.24,.08,.12,skinM,s*.13,.405,.29,0,0,s*.28);bx(hg,.22,.05,.06,hairM,s*.135,.44,.32,0,0,s*.28);
    /* pointed ears, pointing out and up, with a gold ring */
    const e=new THREE.Group();put(hg,e,s*.28,.31,.0,0,s*.2,0);bx(e,.08,.16,.1,skin,s*.03,0,0);bx(e,.06,.1,.07,skin,s*.08,.08,0,0,0,-s*.6);bx(e,.04,.06,.04,skin,s*.11,.14,0,0,0,-s*.8);
    bx(e,.04,.1,.02,skinX,s*.05,0,.05);bx(e,.02,.07,.02,gold,s*.04,-.11,.01);bx(e,.06,.02,.02,gold,s*.04,-.15,.01);}
  bx(hg,.02,.08,.02,skinX,-.03,.37,.322);bx(hg,.02,.08,.02,skinX,.03,.37,.322);
  bx(hg,.18,.1,.1,skin,0,.23,.33);bx(hg,.24,.06,.08,skinD,0,.2,.33);for(const s of[-1,1])bx(hg,.035,.02,.02,dark,s*.05,.18,.372);
  /* horns: two out of the forehead, rising and leaning out; or one big horn in the middle; ringed, darker at the tip */
  const hornAt=(x,lean,k)=>{const H=new THREE.Group();put(hg,H,x,.48,.12,-.12,0,-lean);
    bx(H,.13*k,.14*k,.13*k,horn,0,.05*k,0);bx(H,.14*k,.02,.14*k,hornD,0,.08*k,0);bx(H,.105*k,.13*k,.105*k,horn,0,.17*k,0,0,0,-lean*.4);bx(H,.11*k,.02,.11*k,hornD,0,.2*k,0);
    bx(H,.075*k,.12*k,.075*k,horn,-lean*.04*k,.28*k,0,0,0,-lean*.8);bx(H,.045*k,.09*k,.045*k,hornD,-lean*.08*k,.37*k,0,0,0,-lean);};
  if(horns==='one')hornAt(0,0,1.3);else for(const s of[-1,1])hornAt(s*.15,s*.35,1);
  /* wild mane: a thick mass round the back and sides of the head, spiky clumps flaring out and back */
  bx(hg,.62,.46,.16,hairM,0,.34,-.33);bx(hg,.6,.1,.44,hairM,0,.54,-.08);for(const s of[-1,1])bx(hg,.08,.36,.3,hairM,s*.31,.36,-.17);
  for(const[x,y,rz,rx,L]of[[-.24,.58,.6,-.4,.24],[.24,.58,-.6,-.4,.24],[-.1,.62,.2,-.7,.26],[.1,.62,-.2,-.7,.26],[-.3,.36,1.1,-.3,.22],[.3,.36,-1.1,-.3,.22],
    [-.24,.2,1.9,-.2,.2],[.24,.2,-1.9,-.2,.2],[0,.5,0,-1.1,.26],[-.16,.3,.5,-1.6,.22],[.16,.3,-.5,-1.6,.22]]){const c=new THREE.Group();put(hg,c,x,y,-.3,rx,0,rz);bx(c,.12,L,.1,hairM,0,L/2,0);bx(c,.08,.06,.07,hairD,0,L,0);}
  if(beard){bx(hg,.56,.16,.12,hairM,0,-.06,.24);bx(hg,.4,.12,.1,hairM,0,-.18,.24);bx(hg,.2,.1,.08,hairD,0,-.27,.24);for(const s of[-1,1])bx(hg,.08,.26,.18,hairM,s*.29,.08,.12);}
  const sockHead=J('socket_head',head,0,.9,0);sockHead.userData.socket=true;
  /* arms: deltoids, biceps and triceps, thick forearms; arm rings and wrist cuffs; big hands with dark claws */
  for(const[sd,s]of[['L',1],['R',-1]]){const sh=J('shoulder_'+sd,chest,s*B.shW*.325,.165*B.cS,0),ua=J('upperArm_'+sd,sh,s*B.shW*.675,0,0),fa=J('foreArm_'+sd,ua,0,-B.ua,0),hd=J('hand_'+sd,fa,0,-B.fa,0);
    bx(ua,aw,B.ua+aw/2,aw,skin,0,-B.ua/2+aw/4,0);bx(ua,aw*1.2,.32,aw*1.16,skin,s*.01,-.04,0);bx(ua,aw*.78,.26,.07,skin,0,-.36,aw/2+.025);bx(ua,aw*.78,.28,.06,skin,0,-.3,-aw/2-.02);
    bx(ua,aw*1.06,.06,aw*1.06,gold,0,-.54,0);bx(ua,aw*1.08,.015,aw*1.08,goldD,0,-.51,0);
    bx(fa,aw*1.04,B.fa*.68,aw*1.04,skin,0,-B.fa*.34,0);bx(fa,aw*.86,B.fa*.38,aw*.86,skin,0,-B.fa*.78,0);bx(fa,aw*.96,.12,aw*.96,gold,0,-B.fa*.86,0);bx(fa,aw*.98,.02,aw*.98,goldD,0,-B.fa*.86+.04,0);
    const hw=aw*.85;bx(hd,hw*1.08,.09*hk,hw*1.1,skin,0,-.04*hk,0);
    const fg=J('fingers_'+sd,hd,0,-.085*hk,0),ft=J('fingerTips_'+sd,fg,0,-.035*hk,0),th=J('thumb_'+sd,hd,-s*.02*hk,-.04*hk,hw/2);
    bx(fg,hw*.85,.04*hk,hw*.98,skin,s*.005,-.016*hk,0);bx(ft,hw*.75,.03*hk,hw*.92,skin,s*.005,-.012*hk,0);bx(th,.03*hk,.05*hk,.03*hk,skin,0,-.018*hk,.006);
    for(let i=-1;i<=1;i++)bx(ft,.035,.045,.04,nail,s*.005,-.04*hk,i*hw*.32);bx(th,.04,.04,.04,nail,0,-.054*hk,.006);
    const so=J('socket_'+sd,hd,-s*.012*hk,-.088*hk,0);so.userData.socket=true;}
  /* legs: thighs in tiger-skin trunks with a ragged hem, big quads, thick calves, gold ankle rings, bare clawed feet (the soles 5 mm above the IK sole, so fast heel strikes sampled between frames never dip in) */
  for(const[sd,s]of[['L',1],['R',-1]]){const th=J('thigh_'+sd,hips,s*B.hipW,-(B.hipOff+.01),0),sn=J('shin_'+sd,th,0,-B.thigh,0),ft=J('foot_'+sd,sn,0,-B.shin,0);
    bx(th,.46,B.thigh+.18,.48,skin,0,-B.thigh/2+.06,0);bx(th,.36,.28,.06,skin,0,-.44,.26);bx(th,.06,.3,.36,skin,s*.24,-.4,.02);
    bx(th,.52,.36,.54,tig,0,-.08,0);stripes(th,.52,.54,-.22,.06,3);hem(th,.52,.54,-.26,tig,3,.03,.09);bx(th,.2,.1,.02,tigW,0,-.2,.276);
    bx(sn,.38,B.shin-.04,.4,skin,0,-B.shin/2+.02,0);bx(sn,.32,.28,.08,skin,0,-.2,-.22);bx(sn,.42,.06,.44,gold,0,-B.shin+.1,0);bx(sn,.43,.015,.45,goldD,0,-B.shin+.13,0);
    const zh=.03*g-lw*.8,zt=.03*g+lw*.8,fl=lw*1.36,f0=.005;bx(ft,lw*1.04,.07*fk,fl,skin,0,-.035*fk+f0,zh+fl/2);
    for(let i=-1;i<=1;i++){const big=i===-s?1.2:1,tz=zh+fl+(zt-zh-fl)/2;bx(ft,lw*.3*big,.036*fk*big,zt-zh-fl+.004,skin,i*lw*.34,-.07*fk+.018*fk*big+f0,tz-.002);bx(ft,lw*.2*big,.03,.03,nail,i*lw*.34,-.07*fk+.032*fk*big+f0,zt-.016);}}
  /* weapon in the right hand: its length along the thumb side (the socket's z), as the revenant's weapons */
  const D2=Math.PI/180,Jn=n=>root.getObjectByName(n),wr=new THREE.Group();wr.name='on_wpn_R';wr.userData.gear=true;Jn('socket_R').add(wr);
  const wp=onWeapon(wpn);wp.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(new THREE.Vector3(0,-1,0),new THREE.Vector3(0,0,1),new THREE.Vector3(-1,0,0)));wr.add(wp);
  /* the right fist stays closed round the weapon */
  root.userData.post=()=>{Jn('fingers_R').rotation.set(0,0,95*D2);Jn('fingerTips_R').rotation.set(0,0,90*D2);Jn('thumb_R').rotation.set(14*D2,0,33*D2);};
  const joints=[];root.traverse(q=>{if(q.userData.joint&&!q.userData.socket)joints.push(q);});root.userData.joints=joints;
  if(o.bare)return root;
  if(!o.noClips)root.userData.clips=oniClips(wpn,horns);root.userData.ground=4.2;
  const cap=s=>s.charAt(0).toUpperCase()+s.slice(1);
  root.userData.variantText=`${cap(sk[1])} skin, ${horns==='one'?'one horn':'two horns'}, ${hairC[1]} mane${beard?' and beard':''}; tiger-skin loincloth, straw rope belt, ${ironRings?'iron':'gold'} rings${beads?', prayer beads':''}${scar?', scarred belly':''}; ${ON_WPN[wpn]}.`;
  return root;}

/* ---------- clips ---------- */
const ON_CLIPS={},ON_RIG={};
/* stances (keys in body units: metres / legS). Relaxed (ON_N): upright and heavy, feet apart, the weapon resting on the right
   shoulder, the left arm hanging. War (ON_W): left foot forward, knees bent, the weapon raised by the right shoulder, the left fist
   up in front. Hand targets as the revenant's: x,z in the torso's frame, y absolute, or {s:[dx,dy,dz]} from that shoulder */
const ON_N={HP:[0,-.03,0],h:[3,0,0],sp:[3,0,0],ch:[1,0,0],nk:[0,0,0],hd:[0,0,0],FL:[.2,.03,10,0,0],FR:[-.2,-.03,-10,0,0],
  gR:{s:[.02,-.06,.4]},dR:[-.12,.86,-.5],gL:[.62,.86,.06],dL:[0,-.3,1],fist:[30,95]};
const ON_W=wrP(ON_N,{HP:[0,-.1,0],h:[4,-18,0],sp:[5,-4,0],ch:[3,-6,0],FL:[.2,.22,-12,0,0],FR:[-.2,-.24,-40,0,0],
  gR:{s:[-.12,-.06,.5]},dR:[-.1,.8,-.55],gL:{s:[.02,-.34,.5]},dL:[0,.7,.7],fist:[90,95]});
function onRig(wpn){if(ON_RIG[wpn])return ON_RIG[wpn];const B=VB.oni,m=buildOni(1,{bare:true,weapon:wpn,horns:'two'}),J={};m.traverse(q=>{if(q.userData.joint)J[q.name]=q;});
  const R={m,J,B,two:false},W=[];m.getObjectByName('on_wpn_R').traverse(q=>{if(q.isMesh)W.push(q);});const v=new THREE.Vector3();
  R.low=()=>{m.updateMatrixWorld(true);let y=1e9;for(const q of W){const p=q.geometry.parameters;for(let i=0;i<8;i++){v.set((i&1?.5:-.5)*p.width,(i&2?.5:-.5)*p.height,(i&4?.5:-.5)*p.depth).applyMatrix4(q.matrixWorld);if(v.y<y)y=v.y;}}return y;};
  return ON_RIG[wpn]=R;}
function oniClips(wpn,horns){const ck=wpn+'|'+horns;if(ON_CLIPS[ck])return ON_CLIPS[ck];const L=onBaseClips(wpn).slice();onFalls(L,wpn,horns);return ON_CLIPS[ck]=L;}
const ON_BASE={};
/* solver: the revenant's (rvSolver) on the oni's rig, plus a ground check: while the weapon is below the ground it is tilted up about
   the level axis across it and the frame solved again (from the same continuity state) */
function onSolver(wpn){const R=onRig(wpn),SV=rvSolver(R),V=THREE.Vector3,solve0=SV.solve;
  SV.solve=p=>{const PP=SV.PP,PW=SV.PW&&Object.assign({},SV.PW);let s=solve0(p);if(R.low()>=.004)return s;
    const d0=new V(...p.dR).normalize(),ax=new V().crossVectors(d0,new V(0,1,0));if(ax.lengthSq()<1e-6)return s;ax.normalize();
    const at=a=>{SV.PP=PP;SV.PW=PW&&Object.assign({},PW);return solve0(Object.assign({},p,{dR:d0.clone().applyAxisAngle(ax,a).toArray()}));};
    let lo=0,hi=Math.PI*.5;for(let i=0;i<9;i++){const a=(lo+hi)/2;at(a);if(R.low()>=.004)hi=a;else lo=a;}return at(hi);};
  return SV;}
function onBaseClips(wpn){if(ON_BASE[wpn])return ON_BASE[wpn];const B=VB.oni,D=Math.PI*2,S=Math.sin,C=Math.cos,L=[],SV=onSolver(wpn),W=SV.abs(ON_W),N=SV.abs(ON_N);
  /* loops are pre-rolled one full cycle, so the elbow and wrist continuity carry over the seam, and the last frame is the first */
  const CC=(name,dur,fn,o={})=>{SV.PP=SV.PW=null;if(o.loop){const n=Math.round(dur*30);for(let i=0;i<n;i++)SV.solve(fn(i/n*dur));}SV.miss={};let first=null;
    const c=sampleClip(name,dur,t=>{if(o.loop&&first&&t>=dur-1e-6)return first;const r=SV.solve(fn(t));if(!first)first=r;return r;},Object.assign({autoFeet:false},o),B);c.rvMiss=SV.miss;SV.miss=null;if(o.next)c.next=o.next;L.push(c);return c;};
  const KC=(name,dur,keys,note,base=ON_W,next='Idle (war mode)')=>{const K=keys.map(k=>[k[0],SV.abs(wrP(base,k[1]||{}))]),c=CC(name,dur,wrKeys(K),{note,next});return c;};
  const lift=(o,dy)=>{o.gR=[o.gR[0],o.gR[1]+dy,o.gR[2]];o.gL=[o.gL[0],o.gL[1]+dy,o.gL[2]];return o;};
  /* IK gait in place: planted feet slide back at one steady speed, swinging feet come forward lifted; the hands ride with the hips */
  const GAIT=(name,dur,G,note)=>{const fn=t=>{const u=t/dur,o=G.body(u),c2=C(D*(u-G.duty/2));o.HP=[G.sw*c2,G.y0-G.b*C(2*D*(u-G.duty/2)),G.z0||0];lift(o,o.HP[1]-G.y0);
      for(const[sd,off,x,yaw]of[['L',0,G.x,G.yaw[0]],['R',.5,-G.x,G.yaw[1]]]){const q=(((u+off)%1)+1)%1;let z,l,pt;
        if(q<G.duty){const v=q/G.duty;z=G.s*(1-2*v);l=0;pt=v<.15?-10*(1-v/.15):v>.7?G.toe*(v-.7)/.3:0;}
        else{const v=(q-G.duty)/(1-G.duty),sm=v*v*(3-2*v);z=-G.s+2*G.s*sm;l=G.lift*Math.sin(Math.PI*Math.pow(v,G.lp||1));pt=G.toe*(1-v)*(1-v)-12*v*v;}
        o['F'+sd]=[x,z+(sd==='L'?1:-1)*(G.st||0),yaw,l,pt];}return o;};
    const sp=2*G.s/(G.duty*dur)*B.legS,c=CC(name,dur,fn,{loop:true,note:`${note}, in place, ${sp.toFixed(1)} m/s`});c.speed=sp/B.legS;};
  /* the free left arm swings against the legs: a = +1 when the left foot is forward */
  const swing=(o,a,amp)=>{o.gL=[o.gL[0],o.gL[1]+.03*Math.abs(a),o.gL[2]-amp*a];return o;};

  /* ---- relaxed ---- */
  CC('Idle',4.5,t=>{const p=D*t/4.5,b=S(p),b2=S(2*p);return wrP(N,{HP:[.008*b,-.03-.006*b2,0],h:[3,0,1.2*b],sp:[3+.8*b2,0,-.5*b],ch:[1+1.4*b2,2*S(p+.8),0],hd:[-2+2*S(2*p+1),18*S(p+.6),0],
    gR:[N.gR[0],N.gR[1]+.008*b2,N.gR[2]],gL:[.62,.86+.01*b2,.06+.02*b],fist:[30+10*b,95]});},{loop:true,note:'Heavy breathing, looking around, weapon on the shoulder'});
  GAIT('Walk',1.5,{duty:.62,s:.26,lift:.09,toe:18,x:.2,yaw:[8,-8],y0:-.05,b:.016,sw:.03,
    body:u=>{const yw=C(D*u),a=C(D*(u-.06));return swing(wrP(N,{h:[4,-6*yw,2.5*S(D*u)],sp:[3,2*yw,0],ch:[1,4*yw,0],hd:[0,-3*yw,0],gR:N.gR,gL:[.62,.88,.08]}),a,.14);}},'Heavy strides, weapon on the shoulder');
  GAIT('Run',.85,{duty:.42,s:.42,lift:.2,lp:.8,toe:28,x:.19,yaw:[5,-5],y0:-.09,b:.03,sw:.025,
    body:u=>{const yw=C(D*u),a=C(D*(u-.04));return swing(wrP(N,{h:[14,-8*yw,3*S(D*u)],sp:[6,3*yw,0],ch:[2,6*yw,0],hd:[-12,0,0],gR:N.gR,gL:[.6,1.0,.2],dL:[0,.3,1],fist:[80,95]}),a,.28);}},'Pounding run, weapon on the shoulder, free arm pumping');

  /* ---- war mode ---- */
  CC('Idle (war mode)',2.8,t=>{const p=D*t/2.8,b=S(p),c=S(p+.6);return lift(wrP(W,{HP:[0,-.1-.008*b,0],sp:[5+.8*b,-4,0],ch:[3+1.4*b,-6,0],hd:[0,5*S(p),0],
    dR:[-.1,.8,-.55+.05*c]}),-.012*c);},{loop:true,note:'Weapon raised by the right shoulder, left fist up'});
  GAIT('Walk (war mode)',1.3,{duty:.62,s:.24,lift:.09,toe:20,x:.2,yaw:[-8,-30],y0:-.12,b:.012,sw:.02,st:.04,
    body:u=>lift(wrP(W,{h:[5,-14-4*C(D*u),2*S(D*u)],sp:[6,-4,0],ch:[3,-6,0]}),.012*C(2*D*u))},'Guard up, steady advance');
  GAIT('Run (war mode)',.8,{duty:.4,s:.4,lift:.2,lp:.75,toe:30,x:.18,yaw:[-4,-14],y0:-.1,b:.026,sw:.018,
    body:u=>lift(wrP(W,{h:[14,-10-5*C(D*u),3*S(D*u)],sp:[9,-3,0],ch:[4,-5,0],hd:[-10,0,0],dR:[-.2,.8,-.5]}),.015*C(2*D*(u-.1)))},'Charging, weapon raised');

  /* ---- attacks (hand targets from the shoulders) ---- */
  KC('Attack 1',1.45,[[0,{}],
    [.42,{HP:[0,-.12,-.04],h:[4,-36,0],sp:[4,-8,0],ch:[-2,-22,0],hd:[-6,0,0],gR:{s:[-.36,.4,.14]},dR:[0,.75,-.65],gL:{s:[.1,-.3,.5]}}],
    [.6,{HP:[0,-.14,.06],h:[6,-16,0],sp:[5,-4,0],ch:[2,-6,0],FL:[.2,.36,-12,.06,0],gR:{s:[-.38,.32,.48]},dR:[0,.9,-.4],gL:{s:[.12,-.32,.44]}}],
    [.72,{HP:[0,-.17,.12],h:[6,4,0],sp:[6,4,0],ch:[6,16,0],FL:[.2,.44,-10,0,0],FR:[-.2,-.24,-30,0,0],gR:{s:[.16,-.06,.76]},dR:[0,.5,.87],gL:{s:[.14,-.38,.3]}}],
    [.88,{HP:[0,-.19,.12],h:[8,16,0],sp:[8,8,0],ch:[8,24,0],FL:[.2,.44,-10,0,0],FR:[-.2,-.24,-24,0,0],gR:{s:[.55,-.34,.55]},dR:[.55,-.05,.83],gL:{s:[.2,-.4,.12]}}],
    [1.1,{HP:[0,-.14,.04],h:[6,-8,0],ch:[4,-4,0],FL:[.2,.32,-12,.06,0],FR:[-.2,-.24,-36,0,0],gR:{s:[-.06,-.12,.6]},dR:[-.1,.85,.3]}],
    [1.45,{}]],'Diagonal chop from the right shoulder down across the body, with a step in');
  /* Attack 2: the arm stays out to the side with the palm down, so the club points ahead of it, and the turning body carries it across */
  KC('Attack 2',1.6,[[0,{}],
    [.5,{HP:[0,-.14,-.04],h:[4,-46,0],sp:[4,-10,0],ch:[0,-20,0],hd:[0,30,0],gR:{s:[-.68,.12,.02]},dR:[0,1,.1],gL:{s:[.2,-.3,.46]}}],
    [.72,{HP:[0,-.17,.04],h:[6,-30,0],sp:[5,-6,0],ch:[2,-12,0],hd:[0,20,0],FL:[.22,.36,-12,.06,0],gR:{s:[-.7,-.04,.2]},dR:[-.1,.3,.95],gL:{s:[.24,-.36,.36]}}],
    [.86,{HP:[0,-.19,.1],h:[8,-4,0],sp:[6,2,0],ch:[4,6,0],hd:[0,4,0],FL:[.22,.44,-10,0,0],FR:[-.2,-.24,-30,0,0],gR:{s:[-.55,-.08,.55]},dR:[.5,.12,.86],gL:{s:[.3,-.4,.16]}}],
    [1.0,{HP:[0,-.19,.1],h:[8,20,0],sp:[6,8,0],ch:[4,20,0],hd:[0,-14,0],FL:[.22,.44,-10,0,0],FR:[-.2,-.24,-24,0,0],gR:{s:[-.3,-.1,.7]},dR:[.85,.12,.5]}],
    [1.2,{HP:[0,-.17,.08],h:[6,24,0],sp:[6,8,0],ch:[4,24,0],hd:[0,-14,0],FL:[.22,.44,-10,0,0],FR:[-.2,-.24,-24,0,0],gR:{s:[-.24,-.05,.66]},dR:[.8,.42,.42]}],
    [1.4,{HP:[0,-.14,.04],h:[6,-6,0],ch:[4,-2,0],FL:[.2,.3,-12,.06,0],gR:{s:[-.06,-.1,.56]},dR:[-.1,.85,-.2]}],
    [1.6,{}]],'Flat sweep from right to left, the arm out wide');
  KC('Attack 3',1.2,[[0,{}],
    [.3,{HP:[0,-.13,-.04],h:[4,-6,0],sp:[4,0,0],ch:[0,4,0],gL:{s:[.12,-.34,.2]},dL:[0,.8,.6]}],
    [.46,{HP:[0,-.17,.14],h:[8,-34,0],sp:[6,-8,0],ch:[4,-18,0],hd:[0,16,0],FL:[.2,.46,-12,0,0],gL:{s:[-.04,-.06,.78]},dL:[0,1,.1],gR:{s:[-.2,-.06,.4]}}],
    [.58,{HP:[0,-.17,.14],h:[8,-34,0],sp:[6,-8,0],ch:[4,-18,0],hd:[0,16,0],FL:[.2,.46,-12,0,0],gL:{s:[-.04,-.05,.76]},dL:[0,1,.1],gR:{s:[-.2,-.06,.4]}}],
    [.85,{HP:[0,-.13,.04],h:[5,-20,0],FL:[.2,.3,-12,.06,0],gL:{s:[.04,-.3,.5]}}],
    [1.2,{}]],'Straight left punch with a lunge');
  KC('Heavy attack',2.1,[[0,{}],
    [.45,{HP:[0,-.32,-.04],h:[20,-12,0],sp:[14,-2,0],ch:[6,-4,0],hd:[-10,0,0],gR:{s:[-.1,-.16,.5]},dR:[0,.7,.7],gL:{s:[.12,-.26,.5]}}],
    [.68,{HP:[0,.06,.1],h:[-6,-10,0],sp:[-8,-2,0],ch:[-10,-4,0],hd:[-6,0,0],FL:[.2,.24,-12,.1,20],FR:[-.2,-.18,-40,.06,25],gR:{s:[-.06,.46,.2]},dR:[.1,.5,-.85],gL:{s:[.4,.1,.3]},dL:[0,.6,.8],fist:[60,95]}],
    [.84,{HP:[0,.14,.2],h:[0,-8,0],sp:[0,-2,0],ch:[-4,-2,0],FL:[.2,.42,-12,.2,10],FR:[-.2,-.08,-40,.16,15],gR:{s:[0,.46,.4]},dR:[0,.95,.3],gL:{s:[.46,.1,.2]},fist:[60,95]}],
    [.98,{HP:[0,-.24,.3],h:[16,-6,0],sp:[18,0,0],ch:[10,0,0],FL:[.2,.62,-10,0,0],FR:[-.2,-.02,-40,0,0],gR:{s:[.04,.04,.78]},dR:[0,.4,.92],gL:{s:[.4,-.2,.3]},fist:[80,95]}],
    [1.08,{HP:[0,-.36,.32],h:[26,-6,0],sp:[22,0,0],ch:[12,0,0],FL:[.2,.62,-10,0,0],FR:[-.2,-.02,-40,0,0],gR:{s:[.08,-.52,.58]},dR:[0,-.4,.92],gL:{s:[.36,-.5,.3]},fist:[90,95]}],
    [1.45,{HP:[0,-.36,.32],h:[26,-6,0],sp:[22,0,0],ch:[12,0,0],FL:[.2,.62,-10,0,0],FR:[-.2,-.02,-40,0,0],gR:{s:[.08,-.51,.58]},dR:[0,-.38,.92],gL:{s:[.36,-.49,.3]},fist:[90,95]}],
    [1.72,{HP:[0,-.22,.24],h:[10,-12,0],FL:[.2,.62,-10,0,0],FR:[-.2,-.02,-40,0,0],gR:{s:[-.1,-.1,.56]},dR:[-.1,.8,.4],gL:{s:[.04,-.32,.5]}}],
    [1.9,{HP:[0,-.12,.1],FR:[-.2,-.16,-40,.04,0]}],
    [2.1,{}]],'Leaps forward and smashes the weapon into the ground');

  /* ---- voice and gestures ---- */
  KC('Roar',2.8,[[0,{}],
    [.45,{HP:[0,-.2,-.02],h:[14,-14,0],sp:[16,-2,0],ch:[10,-4,0],hd:[6,0,0],gR:{s:[-.14,-.44,.4]},dR:[0,.4,.9],gL:{s:[.14,-.5,.4]},dL:[0,.5,.85]}],
    [.9,{HP:[0,-.08,0],h:[-4,-8,0],sp:[-8,0,0],ch:[-14,-2,0],nk:[-6,0,0],hd:[-24,0,0],gR:{s:[-.56,.32,.14]},dR:[0,1,0],gL:{s:[.56,.32,.14]},dL:[0,1,0],fist:[100,95]}],
    [1.4,{HP:[0,-.09,0],h:[-4,-8,2],sp:[-9,0,1],ch:[-15,-2,0],nk:[-6,0,0],hd:[-26,4,0],gR:{s:[-.57,.33,.12]},dR:[0,1,0],gL:{s:[.57,.33,.12]},dL:[0,1,0],fist:[100,95]}],
    [1.95,{HP:[0,-.08,0],h:[-4,-8,-2],sp:[-8,0,-1],ch:[-14,-2,0],nk:[-6,0,0],hd:[-24,-4,0],gR:{s:[-.56,.32,.14]},dR:[0,1,0],gL:{s:[.56,.32,.14]},dL:[0,1,0],fist:[100,95]}],
    [2.8,{}]],'Arms and weapon flung wide and up, head thrown back');
  /* Taunt: shiko, the sumo stamp: weight onto the right leg, the left leg raised high out to the side, stamped down into a wide
     squat with the left hand on the knee; the weapon held up and out of the way in the right hand */
  {const up={HP:[-.12,-.1,0],h:[2,-8,-8],sp:[2,-2,-6],ch:[2,-4,-4],hd:[0,10,6],FR:[-.22,-.04,-24,0,0],gR:{s:[-.28,.2,.3]},dR:[-.2,.95,.1],dL:[.3,.6,.75],fist:[30,95]};
  KC('Taunt',3.2,[[0,{}],
    [.45,wrP(up,{HP:[-.1,-.1,0],FL:[.26,.12,-6,0,0],gL:{s:[.3,-.3,.3]}})],
    [.95,wrP(up,{HP:[-.14,-.08,0],h:[2,-8,-12],FL:[.52,.08,26,.52,0],gL:{s:[.5,-.08,.2]}})],
    [1.3,wrP(up,{HP:[-.16,-.06,0],h:[2,-8,-15],FL:[.58,.08,30,.62,0],gL:{s:[.54,-.04,.18]}})],
    [1.48,{HP:[-.02,-.26,0],h:[8,-10,0],sp:[6,-2,0],ch:[6,-4,0],hd:[-4,0,0],FL:[.4,.1,28,0,0],FR:[-.22,-.04,-24,0,0],gR:{s:[-.3,.14,.32]},dR:[-.2,.95,.1],gL:{s:[.12,-.66,.4]},dL:[0,.2,1],fist:[10,95]}],
    [2.2,{HP:[-.02,-.28,0],h:[8,-10,0],sp:[6,-2,0],ch:[6,-4,0],hd:[-10,0,0],FL:[.4,.1,28,0,0],FR:[-.22,-.04,-24,0,0],gR:{s:[-.3,.14,.32]},dR:[-.2,.95,.1],gL:{s:[.12,-.67,.42]},dL:[0,.2,1],fist:[10,95]}],
    [2.7,{HP:[0,-.16,0],h:[4,-14,0],FL:[.28,.18,-6,.05,0],hd:[-6,0,0]}],
    [3.2,{}]],'Shiko: raises the left leg high to the side and stamps it down into a wide squat, hand on the knee');}

  /* ---- reactions ---- */
  KC('Hit 1',.8,[[0,{}],
    [.1,{HP:[0,-.1,-.07],h:[-6,-22,0],sp:[-12,-4,0],ch:[-16,-6,0],hd:[-16,0,0],gR:{s:[-.3,.06,.4]},dR:[-.4,.8,-.3],gL:{s:[.1,-.24,.48]}}],
    [.32,{HP:[0,-.11,-.04],h:[0,-20,0],sp:[-2,-4,0],ch:[-4,-6,0],hd:[-4,0,0],gR:{s:[-.18,-.02,.48]},gL:{s:[.04,-.32,.5]}}],
    [.8,{}]],'Blow to the chest, rocks back');
  KC('Hit 2',.9,[[0,{}],
    [.12,{HP:[.05,-.12,-.02],h:[2,-36,8],sp:[2,-10,10],ch:[-4,-20,12],hd:[-6,-18,14],gR:{s:[-.3,-.06,.4]},dR:[-.5,.75,-.3],gL:{s:[.12,-.4,.44]}}],
    [.36,{HP:[.02,-.11,0],h:[3,-28,3],sp:[4,-6,4],ch:[0,-12,5],hd:[-2,-6,5],gR:{s:[-.18,-.04,.5]},gL:{s:[.04,-.36,.5]}}],
    [.9,{}]],'Blow from the left, twists and bends away');
  KC('Heavy hit',1.7,[[0,{}],
    [.12,{HP:[0,-.08,-.1],h:[-14,-24,0],sp:[-16,-4,0],ch:[-18,-6,0],hd:[-20,0,4],gR:{s:[-.36,.14,.26]},dR:[0,1,0],gL:{s:[.24,-.1,.4]},dL:[0,.8,.6]}],
    [.3,{HP:[0,-.12,-.25],h:[-8,-22,0],sp:[-8,-4,0],ch:[-10,-6,0],hd:[-8,0,0],FR:[-.21,-.48,-42,.09,0],gR:{s:[-.3,.06,.38]},gL:{s:[.14,-.2,.46]}}],
    [.48,{HP:[0,-.2,-.38],h:[8,-22,0],sp:[10,-4,0],ch:[4,-6,0],hd:[4,0,0],FR:[-.22,-.62,-42,0,0],gR:{s:[-.2,-.04,.5]},gL:{s:[.04,-.32,.5]}}],
    [.64,{HP:[0,-.16,-.4],FL:[.18,-.04,-15,.07,0],FR:[-.22,-.62,-42,0,0]}],
    [.8,{HP:[0,-.12,-.42],FL:[.19,-.2,-12,0,0],FR:[-.22,-.62,-42,0,0]}],
    [1.06,{HP:[0,-.1,-.25],FL:[.19,0,-12,.06,0],FR:[-.22,-.62,-42,0,0]}],
    [1.2,{HP:[0,-.1,-.18],FL:[.2,.2,-12,0,0],FR:[-.22,-.62,-42,0,0]}],
    [1.4,{HP:[0,-.1,-.08],FR:[-.21,-.42,-41,.06,0]}],
    [1.55,{}],[1.7,{}]],'Knocked back two heavy steps, then steps in again');
  return ON_BASE[wpn]=L;}

/* Death: keyed joint angles (gbDeathKeys) on a bare oni dropped onto its lowest point every frame (the revenant's method): it
   recoils, sinks onto its knees, lets the weapon fall flat beside it and pitches forward face down. The weapon gets its own track
   (on_wpn_R, relative to the socket). The head comes to rest face down: turned on its side, the mane would stand up higher */
function onFalls(L,wpn,horns){const B=VB.oni,k=B.legS,V=THREE.Vector3,Q=THREE.Quaternion,M4=THREE.Matrix4,D2R=Math.PI/180,SV=onSolver(wpn);
  SV.PP=SV.PW=null;const S0=SV.solve(SV.abs(ON_W)),K0={X:[S0.pos[0]*k,S0.pos[2]*k],anc:[1,1],flat:[0,0]};
  const CH=['h','sp','ch','nk','hd','tL','kL','aL','tR','kR','aR','uL','fL','wL','uR','fR','wR','fist'];for(const c of CH)K0[c]=S0[c].slice();
  const M=buildOni(1,{bare:true,weapon:wpn,horns}),JN={};M.traverse(q=>{if(q.userData.joint)JN[q.name]=q;});
  const WG=M.getObjectByName('on_wpn_R'),isW=q=>{while(q){if(q.userData.gear)return true;q=q.parent;}return false;},body=[];M.traverse(q=>{if(q.isMesh&&!isW(q))body.push(q);});
  const corner=new V(),cornersW=list=>{const out=[];for(const q of list){const p=q.geometry.parameters;for(let i=0;i<8;i++)out.push(new V((i&1?.5:-.5)*p.width,(i&2?.5:-.5)*p.height,(i&4?.5:-.5)*p.depth).applyMatrix4(q.matrixWorld));}return out;};
  const lowest=()=>{let y=1e9;for(const q of body){const p=q.geometry.parameters;for(let i=0;i<8;i++){corner.set((i&1?.5:-.5)*p.width,(i&2?.5:-.5)*p.height,(i&4?.5:-.5)*p.depth).applyMatrix4(q.matrixWorld);if(corner.y<y)y=corner.y;}}return y;};
  const pose=p=>{const P={};for(const c in p)if(JALIAS[c])P[JALIAS[c]]=p[c];const f=p.fist;P.fingers_L=[0,0,-f[0]];P.fingerTips_L=[0,0,-f[0]*.95];P.thumb_L=[f[0]*.15,0,-f[0]*.35];P.fingers_R=[0,0,f[1]];P.fingerTips_R=[0,0,f[1]*.95];P.thumb_R=[f[1]*.15,0,f[1]*.35];
    for(const j of RIG_JOINTS){const b=BASEPOSE[j]||[0,0,0],v=P[j]||[0,0,0];JN[j].rotation.set((b[0]+v[0])*D2R,(b[1]+v[1])*D2R,(b[2]+v[2])*D2R);}};
  const feet=()=>({L:JN.foot_L.getWorldPosition(new V()),R:JN.foot_R.getWorldPosition(new V())});
  const FC=(name,dur,f,note,wpnM)=>{let ref=null,full=[0,0];
    const fn=t=>{const p=f(t);
      for(const[i,sd]of[[0,'L'],[1,'R']]){const w=p.flat[i];if(w>0){const a=p['a'+sd].slice();a[0]=a[0]*(1-w)-(p.h[0]+p['t'+sd][0]+p['k'+sd][0])*w;p['a'+sd]=a;}}
      pose(p);JN.hips.position.set(p.X[0],B.hipH,p.X[1]);M.updateMatrixWorld(true);const ft=feet();if(!ref)ref={L:ft.L.clone(),R:ft.R.clone()};
      const wsum=p.anc[0]+p.anc[1];let cx=0,cz=0;if(wsum>1e-3){for(const[i,sd]of[[0,'L'],[1,'R']]){cx+=p.anc[i]*(ref[sd].x-ft[sd].x);cz+=p.anc[i]*(ref[sd].z-ft[sd].z);}cx/=wsum;cz/=wsum;}
      const w=Math.min(1,Math.max(p.anc[0],p.anc[1]));if(w>.999)full=[cx,cz];const X=[p.X[0]+w*cx+(1-w)*full[0],p.X[1]+w*cz+(1-w)*full[1]];
      JN.hips.position.set(X[0],B.hipH,X[1]);M.updateMatrixWorld(true);const y=.005-lowest();JN.hips.position.y=B.hipH+y;M.updateMatrixWorld(true);
      const out={};for(const c in p)if(JALIAS[c]||c==='fist')out[c]=p[c];out.pos=[X[0]/k,y/k,X[1]/k];out.X=X;return out;};
    const c=sampleClip(name,dur,fn,{autoFeet:false,note},B),T=Array.from(c.tracks[0].times);
    /* second pass (same order, so the foot anchoring repeats exactly): the weapon in its socket's frame */
    const WP=[],WQ=[],inv=new M4(),pp=new V(),qq=new Q(),ss=new V();
    T.forEach(t=>{fn(t);const so=WG.parent,Wm=wpnM(t);if(!Wm){WP.push(0,0,0);WQ.push(0,0,0,1);return;}inv.copy(so.matrixWorld).invert().multiply(Wm).decompose(pp,qq,ss);WP.push(pp.x,pp.y,pp.z);WQ.push(qq.x,qq.y,qq.z,qq.w);});
    c.tracks.push(new THREE.VectorKeyframeTrack('on_wpn_R.position',T,WP),new THREE.QuaternionKeyframeTrack('on_wpn_R.quaternion',T,WQ));L.push(c);return{c,fn};};
  /* resting place of the dropped weapon: lying the way it pointed, a flat side down, pushed a little out from the body, lowest corner on the ground */
  const restOf=Mw=>{const p0=new V(),q0=new Q(),s0=new V();Mw.decompose(p0,q0,s0);
    const Lh=new V(0,0,1).applyQuaternion(q0).setY(0);if(Lh.lengthSq()<1e-4)Lh.set(0,0,1);Lh.normalize();const U=new V(0,new V(1,0,0).applyQuaternion(q0).y>=0?1:-1,0);
    const q=new Q().setFromRotationMatrix(new M4().makeBasis(U,new V().crossVectors(Lh,U),Lh));
    const hip=JN.hips.getWorldPosition(new V()),out=new V(p0.x-hip.x,0,p0.z-hip.z);if(out.lengthSq()<1e-4)out.set(-1,0,0);out.normalize();
    const probe=WG.clone(),list=[];probe.position.set(p0.x,0,p0.z).addScaledVector(out,.35);probe.quaternion.copy(q);probe.updateMatrixWorld(true);probe.traverse(z=>{if(z.isMesh)list.push(z);});
    let lo=1e9;for(const c of cornersW(list))lo=Math.min(lo,c.y);probe.position.y+=.002-lo;probe.updateMatrix();return probe.matrix.clone();};
  const lerpM=(A,Bm,s)=>{const pa=new V(),qa=new Q(),pb=new V(),qb=new Q(),sc=new V();A.decompose(pa,qa,sc);Bm.decompose(pb,qb,sc);return new M4().compose(pa.lerp(pb,s),qa.slerp(qb,s),new V(1,1,1));};
  const ss=s=>s*s*(3-2*s);
  const tRel=1.05,death=gbDeathKeys(K0,[
    [.18,{sp:[-8,0,0],ch:[-14,0,0],nk:[-6,0,0],hd:[-18,0,6]},'out'],
    [.55,{h:[10,-10,0],sp:[8,0,0],ch:[10,0,0],nk:[6,0,0],hd:[4,0,8],tL:[-30,0,4],kL:[60,0,0],tR:[-26,0,-6],kR:[56,0,0],uL:[-30,0,14],fL:[-40,0,0],uR:[-30,0,-14],fR:[-40,0,0]}],
    [.9,{h:[12,-4,0],sp:[14,0,0],ch:[16,0,0],nk:[8,0,0],hd:[10,0,8],tL:[-16,0,4],kL:[104,0,0],tR:[-12,0,-4],kR:[102,0,0],flat:[0,0],aL:[44,0,0],aR:[44,0,0],anc:[0,0],X:[0,.1],
      uL:[-14,0,18],fL:[-30,0,0],uR:[-14,0,-18],fR:[-30,0,0]},'io'],
    [1.0,{h:[16,-4,0]},'out'],
    [1.25,{uL:[-6,0,24],fL:[-12,0,0],uR:[-6,0,-24],fR:[-12,0,0],wR:[40,-80,0]}],
    [1.55,{h:[50,-2,-4],sp:[16,0,-4],ch:[14,0,0],nk:[-4,0,0],hd:[-6,14,0],tL:[-30,0,6],kL:[70,0,0],tR:[-26,0,-6],kR:[68,0,0],X:[0,.36],uL:[-80,0,20],fL:[-40,0,0],uR:[-80,0,-20],fR:[-40,0,0]},'in'],
    [1.82,{h:[90,0,-4],sp:[2,0,-2],ch:[0,0,0],nk:[-14,0,0],hd:[-12,0,0],tL:[-6,4,6],kL:[14,0,0],tR:[-6,-4,-6],kR:[14,0,0],aL:[50,0,0],aR:[50,0,0],X:[0,1.0],
      uL:[-20,0,24],fL:[-20,0,0],uR:[-20,0,-24],fR:[-20,0,0]},'in'],
    [1.92,{h:[87,0,-4]},'out'],
    [2.7,{h:[90,0,-4],nk:[2,0,0],hd:[4,0,0],tL:[-4,4,6],tL:[-4,4,6],kL:[10,0,0],tR:[-4,-4,-6],kR:[8,0,0],uL:[4,0,30],fL:[-12,0,0],wL:[0,-90,0],uR:[6,0,-30],fR:[-10,0,0],wR:[0,90,0],fist:[40,95]},'out']]);
  /* the weapon: captured where the hand lets go, then a fall under gravity, turning to lie flat */
  const pr0=FC('_probe',tRel,death,'',()=>null);L.pop();pr0.fn(tRel);const A=WG.parent.matrixWorld.clone(),R0=restOf(A),pa=new V().setFromMatrixPosition(A),prr=new V().setFromMatrixPosition(R0),tl=Math.max(.2,Math.sqrt(2*Math.max(0,pa.y-prr.y)/9.8));
  const dropW=t=>{const tau=t-tRel;if(tau<=0)return null;if(tau>=tl)return R0.clone();const m=lerpM(A,R0,ss(tau/tl));m.elements[13]=Math.max(prr.y,pa.y-4.9*tau*tau);return m;};
  FC('Death',2.7,death,'Recoils, sinks onto its knees, lets the weapon fall and pitches forward face down',dropW);}

ASSETS.push({id:'oni',folder:'characters/enemies/hell',name:'Oni',kind:'character',variants:true,defaultSeed:1,groundR:4.2,build:(s,o)=>buildOni(s,o||{}),
  opts:[{key:'skin',label:'Skin',choices:[['random','Random'],['red','Red (aka-oni)'],['blue','Blue (ao-oni)'],['yellow','Yellow (ki-oni)'],['green','Green (midori-oni)'],['black','Black (kuro-oni)']],def:'random'},
    {key:'horns',label:'Horns',choices:[['random','Random'],['two','Two'],['one','One']],def:'random'},
    {key:'weapon',label:'Weapon',choices:[['kanabo','Kanabō (iron club)'],['spiked','Spiked club'],['barbed','Barbed club']],def:'kanabo'}],
  desc:'Oni: a muscular Japanese demon, about 3 m tall: long muscled legs, a six-pack, a broad chest, thick arms; a big head with a square jaw, upward fangs, bulging red-rimmed eyes, a furrowed brow, pointed ears, two horns or one, and a wild mane (black, white or dark red), sometimes a beard. Skin red, blue, yellow, green or black. Tiger-skin loincloth, a twisted straw rope belt, gold (or iron) arm, wrist and ankle rings, sometimes big prayer beads. Swings an iron studded kanabō, a spiked club or a barbed club in the right hand. Idle, walk and run with the weapon on the shoulder; war-mode idle, walk and charge; diagonal chop, horizontal sweep, left punch, leaping ground smash, roar, taunt (shiko stamp), two hits, a heavy hit and a death.'});
