/* ======================= PLAYER CHARACTERS: the Mercenary =======================
   Built from scratch (docs/MERCENARY.md): own body, own gear slots, own clip system.
   The joints use the villager names (hips, spine, chest, neck, head, upperArm/foreArm/hand, thigh/shin/foot), so the viewer's rig
   overlay and tools/check-character.mjs apply. Gear is boxes on the joints, one builder per slot (MC_GEAR), so new pieces are one entry.
   Clips are baked from poses solved by mcSolve: two-bone IK for the legs (feet planted, heel and ball pivots, toes bend) and the arms
   (wrist targets and elbow poles in the chest's frame), the sword hand aimed by a clamped wrist, prop and body ground clamps. */
const MC_SKIN={pale:['#d6b8a4','Pale'],light:['#c99a7c','Light'],tan:['#a67a60','Tan'],dark:['#7a5644','Dark'],black:['#4a342a','Black']};
const MC_HAIR={white:['#d6d2c8','White'],red:['#855c4a','Red'],brown:['#5a4232','Brown'],black:['#221c19','Black'],blonde:['#b89a68','Blonde'],gray:['#77736e','Gray']};
const MC_EYE={green:['#4f6a44','Green'],blue:['#4a6680','Blue'],brown:['#4e3a2c','Brown']};
const MC_SHCOL={red:['#7a4238','Red'],blue:['#3f4f6e','Blue'],green:['#4a5e3f','Green'],black:['#2c2a2a','Black'],ochre:['#8a7344','Ochre'],white:['#b8b1a2','White']};
/* cloth colour: the gambeson, the linen shirt and the cape ('natural' keeps undyed quilt and linen, a grey-brown wool cape) */
const MC_CLOTH={natural:[null,'Natural'],red:['#6e3a33','Red'],blue:['#3d4a63','Blue'],green:['#4a5a3c','Green'],black:['#2e2b2a','Black'],brown:['#5e4632','Brown']};
const MC_LOOK={face:{square:'Square jaw',broad:'Broad',lean:'Lean',weathered:'Weathered'},hairStyle:{short:'Short',long:'Long',tied:'Tied back',buzz:'Buzz cut',bald:'Bald'},
  beard:{short:'Short beard',full:'Full beard',stubble:'Stubble',moustache:'Moustache',goatee:'Goatee',none:'Clean-shaven'},scar:{none:'None',cheek:'Cheek',eye:'Over the eye'}};
const MC_SLOTS={weapon:{sword:'Arming sword',falchion:'Falchion',mace:'Flanged mace',axe:'Bearded axe',none:'None'},
  shield:{heater:'Heater shield',round:'Round shield',kite:'Kite shield',buckler:'Buckler',none:'None'},
  helmet:{none:'None',nasal:'Nasal helm',coif:'Mail coif',kettle:'Kettle hat',great:'Great helm'},
  armor:{mail:'Mail hauberk',plate:'Half plate',leather:'Studded leather',gambeson:'Gambeson',none:'Linen shirt'},gloves:{leather:'Leather gloves',none:'None'},
  boots:{leather:'Leather boots',none:'None (barefoot)'},pants:{wool:'Wool trousers',leather:'Leather trousers',none:'None (linen braies)'},cape:{none:'None',cape:'Cape'}};
const MC_DEF={skin:'light',hair:'brown',eyes:'brown',face:'square',hairStyle:'short',beard:'short',scar:'none',weapon:'sword',shield:'heater',shieldCol:'red',helmet:'none',armor:'mail',gloves:'leather',boots:'leather',pants:'wool',cape:'none',cloth:'natural'};
/* body: real metres; ground at y = 0, ankle 0.08 above it, hips joint 1.06 with straight legs; about 1.97 m tall */
const MCB={ank:.08,shin:.46,thigh:.46,hipDrop:.06,hipX:.11,hipsY:1.06,spine:.10,chest:.18,neck:.28,headY:.08,shX:.31,shY:.22,ua:.32,fa:.28,grip:.06,ball:.12,heel:-.07};
const MC_COL={linen:'#cbc2ae',quiltDye:'#7c6748',wool:'#4f4740',woolD:'#3c3530',leather:PAL.leather[3],leatherD:PAL.leather[2],leatherL:PAL.leather[4],boot:PAL.leather[2],sole:PAL.leather[0],
  iron:PAL.iron[2],ironD:PAL.iron[1],steel:PAL.iron[3],steelL:PAL.iron[4],brass:PAL.bronze[2],wood:PAL.wood[1],woodD:PAL.wood[0],lip:'#7c5048',eyeW:'#d3cbbc',mouth:'#3a2620',slit:'#16120e'};
/* face shapes: head half-width, jaw width and depth, nose width and height, brow depth, cheekbones, lines */
const MC_FACE={square:{w:.24,jw:.25,jd:.245,nw:.045,nh:.07,brow:.02},broad:{w:.25,jw:.27,jd:.25,nw:.056,nh:.07,brow:.026},
  lean:{w:.23,jw:.222,jd:.235,nw:.04,nh:.08,brow:.018,cheek:1},weathered:{w:.24,jw:.248,jd:.245,nw:.047,nh:.074,brow:.024,lines:1}};

/* own textures (16 px): mail rings, brushed steel, wood planks */
const MCT={};
function mcTex(kind){if(MCT[kind])return MCT[kind];const N=16,c=document.createElement('canvas');c.width=c.height=N;const g=c.getContext('2d'),r=mulberry32(hashStr('mc'+kind));
  for(let y=0;y<N;y++)for(let x=0;x<N;x++){let v=.88+.12*r();
    if(kind==='mail')v=y%2?.8+.06*r():((x+(y>>1))%2?.66:.95)+.04*r();
    if(kind==='steel')v=.9+.1*r()-(y%6===0?.1:0);
    if(kind==='planks')v=(x%5===0?.72:.9)+.1*r();
    const b=Math.round(Math.min(1,v)*255);g.fillStyle=`rgb(${b},${b},${b})`;g.fillRect(x,y,1,1);}
  const t=new THREE.CanvasTexture(c);t.magFilter=THREE.NearestFilter;t.minFilter=THREE.NearestFilter;t.generateMipmaps=false;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.encoding=THREE.sRGBEncoding;return MCT[kind]=t;}
const MCM={};
function mcMat(hex,kind){const k=hex+kind;if(MCM[k])return MCM[k];if(!['mail','steel','planks'].includes(kind))return MCM[k]=bm(hex,kind);
  const metal=kind!=='planks';return MCM[k]=new THREE.MeshStandardMaterial({map:mcTex(kind),color:new THREE.Color(hex).convertSRGBToLinear(),roughness:metal?.55:.9,metalness:metal?.45:0});}
const mcShade=(hex,f)=>'#'+new THREE.Color(hex).multiplyScalar(f).getHexString();
const mcMix=(a,b,f)=>'#'+new THREE.Color(a).lerp(new THREE.Color(b),f).getHexString();

/* ---------- gear: one builder per slot and choice; each gets the joints J and the materials M ---------- */
const MC_GEAR={
  /* torso and sleeves: what the body boxes are made of */
  armor:{
    mail:(J,M)=>{const mail=M.mail;mcTorso(J,M,mail,mail,mail);mcSleeves(J,M,mail,M.quilt,true);
      bx(J.chest,.25,.07,.23,mail,0,.3,-.005);                                        /* mail collar */
      for(const sd of['L','R']){bx(J['thigh_'+sd],.215,.2,.225,mail,0,-.08,0);}      /* hauberk skirt, split per thigh */
      mcBelt(J,M);if(mcOwnSh(M))for(const sd of['L','R'])mcPauldron(J['upperArm_'+sd],M);},
    /* half plate over mail: breastplate, faulds, big pauldrons, vambraces, tassets over the mail skirt */
    plate:(J,M)=>{const st=M.iron,mail=M.mail;mcTorso(J,M,st,st,mail);mcSleeves(J,M,mail,st,true);bx(J.chest,.25,.07,.23,mail,0,.3,-.005);bx(J.chest,.44,.05,.3,M.ironD,0,.005,0);
      for(const y of[.03,-.03])bx(J.spine,.37+(y>0?0:.01),.055,.25+(y>0?0:.01),y>0?st:M.ironD,0,y+.06,0);
      for(const sd of['L','R']){const ua=J['upperArm_'+sd],fa=J['foreArm_'+sd],s=sd==='L'?1:-1;
        if(mcOwnSh(M)){bx(ua,.22,.05,.22,M.steel,0,.05,0);bx(ua,.225,.05,.225,M.ironD,0,0,0);bx(ua,.228,.05,.228,M.steel,0,-.05,0);bx(ua,.03,.03,.03,M.brass,s*.115,.0,0);}
        bx(fa,.145,.06,.145,M.ironD,0,-.02,0);bx(J['thigh_'+sd],.215,.2,.225,mail,0,-.08,0);bx(J['thigh_'+sd],.2,.16,.03,st,0,-.07,.118);}
      mcBelt(J,M);},
    /* studded leather jerkin over a linen shirt: rivets on the chest, leather tassets and bracers */
    leather:(J,M)=>{const le=M.leather;mcTorso(J,M,le,le,le);mcSleeves(J,M,le,M.linen,true);bx(J.chest,.24,.06,.22,M.leatherD,0,.3,-.005);
      for(const x of[-.15,-.05,.05,.15])for(const y of[.06,.16,.24])bx(J.chest,.018,.018,.012,M.brass,x,y,.175);
      for(const x of[-.12,0,.12])bx(J.spine,.018,.018,.012,M.brass,x,.12,.124);
      for(const sd of['L','R']){bx(J['thigh_'+sd],.21,.18,.22,M.leatherD,0,-.075,0);bx(J['foreArm_'+sd],.142,.14,.142,M.leatherD,0,-.17,0);}mcBelt(J,M);},
    gambeson:(J,M)=>{mcTorso(J,M,M.quilt,M.quilt,M.quilt);mcSleeves(J,M,M.quilt,M.quilt,true);bx(J.chest,.24,.06,.22,M.quilt,0,.3,-.005);
      for(const sd of['L','R'])bx(J['thigh_'+sd],.21,.17,.22,M.quilt,0,-.065,0);mcBelt(J,M);},
    none:(J,M)=>{mcTorso(J,M,M.shirt,M.shirt,M.pantsTop);mcSleeves(J,M,M.shirt,null,false);bx(J.chest,.11,.07,.01,M.skin,0,.25,.149);mcBelt(J,M);}},
  pants:{
    wool:(J,M)=>mcLegs(J,M,M.wool,M.wool),
    leather:(J,M)=>{mcLegs(J,M,M.leather,M.leather);for(const sd of['L','R'])bx(J['shin_'+sd],.155,.07,.03,M.leatherD,0,-.02,.08);},
    none:(J,M)=>mcLegs(J,M,M.linen,M.skin,true)},
  boots:{
    leather:(J,M)=>{for(const sd of['L','R']){const sn=J['shin_'+sd];bx(sn,.165,.27,.175,M.boot,0,-.325,-.005);bx(sn,.175,.05,.185,M.leatherL,0,-.19,-.005);mcFoot(J,sd,M.boot,M.sole);}},
    none:(J,M)=>{for(const sd of['L','R'])mcFoot(J,sd,M.skin,null);}},
  gloves:{
    leather:(J,M)=>{for(const sd of['L','R']){mcFist(J['hand_'+sd],M.leather,sd);bx(J['foreArm_'+sd],.15,.07,.15,M.leatherL,0,-.245,0);}},
    none:(J,M)=>{for(const sd of['L','R'])mcFist(J['hand_'+sd],M.skin,sd);}},
  /* helmets return which hair still shows: 'all', 'back' (below the helmet band), 'none', or 'hide' (a closed helm: no hair and no facial hair) */
  helmet:{
    none:()=>'all',
    nasal:(J,M,F)=>{const h=J.head,ir=M.steel,w=F.w;
      bx(h,w+.032,.06,.292,M.ironD,0,.245,0);bx(h,w+.022,.05,.282,ir,0,.295,0);bx(h,w-.02,.035,.24,ir,0,.335,0);bx(h,.14,.025,.16,ir,0,.362,0);bx(h,.05,.02,.06,ir,0,.382,0);
      bx(h,.036,.05,.045,M.ironD,0,.235,.165);bx(h,.032,.085,.02,M.ironD,0,.185,.186);return 'back';},
    coif:(J,M,F)=>{const h=J.head,m=M.mail,w=F.w;
      bx(h,w+.034,.07,.29,m,0,.272,0);bx(h,.032,.28,.28,m,(w/2+.016),.135,-.005);bx(h,.032,.28,.28,m,-(w/2+.016),.135,-.005);bx(h,w+.034,.3,.034,m,0,.14,-.137);
      bx(h,w+.036,.03,.06,m,0,.225,.13);bx(J.neck,.22,.12,.21,m,0,.02,0);bx(J.chest,.36,.06,.31,m,0,.31,-.005);return 'none';},
    kettle:(J,M,F)=>{const h=J.head,ir=M.steel,w=F.w;
      bx(h,.42,.022,.44,M.ironD,0,.245,0);bx(h,w+.02,.06,.28,ir,0,.278,0);bx(h,w-.03,.04,.23,ir,0,.325,0);bx(h,.12,.03,.14,ir,0,.356,0);return 'back';},
    great:(J,M,F)=>{const h=J.head,ir=M.steel,w=F.w;
      bx(h,w+.07,.34,.345,ir,0,.15,.005);bx(h,w+.03,.03,.3,ir,0,.335,.005);bx(h,w+.074,.03,.35,M.ironD,0,.03,.005);
      bx(h,.2,.018,.012,M.slit,0,.165,.183);bx(h,.05,.012,.012,M.slit,-.06,.075,.183);bx(h,.05,.012,.012,M.slit,-.06,.05,.183);
      bx(J.neck,.2,.1,.2,M.mail,0,.02,0);return 'hide';}},
  /* weapons: one group 'mc_sword' in the right fist socket, the grip on the origin, the business end along +z, edges along y (knuckles at -y) */
  weapon:{
    sword:(J,M)=>{const g=mcWg(J);
      bx(g,.034,.034,.12,M.leatherD,0,0,0);bx(g,.03,.2,.03,M.ironD,0,0,.075);bx(g,.04,.04,.05,M.ironD,0,0,-.083);bx(g,.052,.052,.026,M.brass,0,0,-.118);
      bx(g,.018,.052,.68,M.steel,0,0,.43);bx(g,.022,.012,.6,M.ironD,0,0,.4);bx(g,.018,.034,.06,M.steel,0,0,.8);bx(g,.016,.014,.04,M.steel,0,0,.85);mcScabbard(J,M,.045,.05,.74);return g;},
    /* falchion: broad single edge widening to a clipped point, spine at +y */
    falchion:(J,M)=>{const g=mcWg(J);
      bx(g,.034,.034,.12,M.leatherD,0,0,0);bx(g,.03,.17,.03,M.ironD,0,0,.075);bx(g,.05,.05,.04,M.brass,0,0,-.08);
      for(const[z0,z1,h]of[[.09,.36,.05],[.36,.56,.064],[.56,.7,.076]])bx(g,.018,h,z1-z0,M.steel,0,.025-h/2,(z0+z1)/2);
      bx(g,.018,.05,.06,M.steel,0,-.012,.73);bx(g,.016,.026,.04,M.steel,0,-.026,.78);bx(g,.02,.01,.56,M.ironD,0,.02,.38);mcScabbard(J,M,.04,.09,.68);return g;},
    /* flanged mace: iron haft and a head of six flanges (no four-way cross) */
    mace:(J,M)=>{const g=mcWg(J);
      bx(g,.036,.036,.14,M.leatherD,0,0,-.01);bx(g,.05,.05,.03,M.ironD,0,0,-.095);bx(g,.03,.03,.44,M.ironD,0,0,.29);bx(g,.07,.07,.12,M.iron,0,0,.53);bx(g,.04,.04,.04,M.ironD,0,0,.61);
      for(let k=0;k<6;k++){const a=k*Math.PI/3,f=bx(g,.016,.05,.12,M.steel,Math.sin(a)*.05,Math.cos(a)*.05,.53);f.rotation.z=-a;}mcFrog(J,M,.4);return g;},
    /* bearded axe: wooden haft held low, the head at the top with the edge towards the knuckles and a beard hanging back down */
    axe:(J,M)=>{const g=mcWg(J);
      bx(g,.036,.036,.68,M.wood,0,0,.22);bx(g,.04,.04,.03,M.ironD,0,0,-.12);bx(g,.05,.06,.1,M.ironD,0,.0,.52);bx(g,.03,.04,.06,M.ironD,0,.045,.52);
      bx(g,.016,.08,.12,M.iron,0,-.07,.53);bx(g,.016,.05,.16,M.steel,0,-.13,.52);bx(g,.016,.05,.06,M.steel,0,-.15,.42);bx(g,.014,.02,.2,M.steelL,0,-.162,.5);mcFrog(J,M,.4);return g;},
    none:()=>null},
  /* shields: 'mc_shield' on a mount on the left forearm (buckler: in the fist); its face is turned every frame by mcShield.
     rows [width, height, y] of planks with a painted face inset 2 cm, so the wood shows as a rim; no emblem */
  shield:{
    heater:(J,M)=>mcShieldBoard(J,M,[[.56,.36,.12],[.52,.08,-.1],[.46,.07,-.175],[.38,.07,-.245],[.28,.06,-.31],[.16,.05,-.365],[.06,.04,-.41]],
      s=>{bx(s,.585,.03,.05,M.ironD,0,.3,.02);for(const x of[-.28,.28])bx(s,.03,.38,.05,M.ironD,x,.115,.02);}),
    round:(J,M)=>{const rows=[];for(let y=.27;y>-.3;y-=.06){const w=2*Math.sqrt(Math.max(0,.31*.31-y*y));rows.push([Math.round(w/.04)*.04,.06,y]);}
      return mcShieldBoard(J,M,rows,s=>{bx(s,.13,.13,.04,M.ironD,0,0,.055);bx(s,.08,.08,.03,M.steel,0,0,.085);});},
    kite:(J,M)=>mcShieldBoard(J,M,[[.36,.04,.36],[.46,.06,.31],[.5,.12,.22],[.5,.14,.08],[.46,.12,-.05],[.4,.1,-.16],[.33,.1,-.26],[.25,.1,-.36],[.17,.1,-.46],[.1,.08,-.55],[.05,.06,-.62]],
      ()=>{}),
    buckler:(J,M)=>{const rows=[];for(let y=.15;y>-.17;y-=.05){const w=2*Math.sqrt(Math.max(0,.18*.18-y*y));rows.push([Math.round(w/.04)*.04,.05,y]);}
      return mcShieldBoard(J,M,rows,s=>{bx(s,.09,.09,.05,M.ironD,0,0,.055);bx(s,.05,.05,.03,M.steelL,0,0,.085);},{fist:true,metal:true});},
    none:()=>null},
  /* shoulders (the armour builds its own pauldrons while this slot is 'armor'), belt (mcBelt calls it), cape; gear_items.js adds more */
  shoulders:{armor:()=>{},none:()=>{}},
  belt:{plain:(J,M)=>{bx(J.spine,.375,.06,.255,M.leatherD,0,0,0);bx(J.spine,.05,.045,.02,M.brass,0,0,.13);bx(J.spine,.08,.1,.04,M.leather,.12,-.06,.13);},none:()=>{}},
  cape:{none:()=>{},cape:(J,M)=>mcCapeBuild(J,M)}};
/* slots built on the body, in order (the coif's mantle sits on the armour, so the head comes after these) */
const MC_ORDER=['armor','shoulders','pants','boots','gloves','weapon','shield'];
const mcOwnSh=M=>!M.sel||!M.sel.shoulders||M.sel.shoulders==='armor';
function mcWg(J){const g=new THREE.Group();g.name='mc_sword';J.socket_R.add(g);return g;}
/* the weapon's holder on the left hip, 'mc_scab' (it swings back so it never goes into the ground, mcSolve): a scabbard for blades (thickness t,
   width w, length l), a leather belt loop for the mace and axe (hung head down through it, by the haft under the grip). userData.stow is where the
   weapon sits in the holder when sheathed (mcBake blends it there with the ws channel) */
function mcScabbard(J,M,t,w,l){const sc=new THREE.Group();sc.name='mc_scab';sc.position.set(.285,.03,.2);J.hips.add(sc);sc.userData.reach=l+.06;sc.userData.tilt=-40;
  bx(sc,t+.01,.05,w+.01,M.leatherD,0,-.02,0);bx(sc,t,l,w,M.leather,0,-.05-l/2,0);bx(sc,t+.005,.06,w+.005,M.brass,0,-.07-l+.03,0);bx(sc,.05,.04,.03,M.leatherD,-.02,.02,0);
  sc.userData.stow={p:[0,.08,0],r:[Math.PI/2,0,0]};}
function mcFrog(J,M,z){const sc=new THREE.Group();sc.name='mc_scab';sc.position.set(.3,.03,.13);J.hips.add(sc);sc.userData.reach=.66;sc.userData.tilt=-26;
  bx(sc,.06,.05,.012,M.leatherD,0,0,.03);bx(sc,.06,.05,.012,M.leatherD,0,0,-.03);bx(sc,.012,.05,.07,M.leatherD,.03,0,0);bx(sc,.05,.06,.02,M.leatherD,-.035,.03,0);
  sc.userData.stow={p:[0,.06,0],r:[Math.PI/2,0,0]};}
/* cape: four cloth panels 'mc_cape0..3' on the chest, laid every frame by mcCape (hanging, swinging back, kept out of the body and off the ground) */
const MC_CAPE={n:4,len:.26,w:.42,t:.022,at:[0,.3,-.175]};
function mcCapeBuild(J,M){bx(J.chest,.46,.045,.07,M.cape,0,.315,-.13);for(let k=0;k<MC_CAPE.n;k++){const g=new THREE.Group();g.name='mc_cape'+k;J.chest.add(g);g.position.set(MC_CAPE.at[0],MC_CAPE.at[1]-k*MC_CAPE.len,MC_CAPE.at[2]);
  bx(g,MC_CAPE.w-k*.0,MC_CAPE.len+.004,MC_CAPE.t,M.cape,0,-MC_CAPE.len/2,0);}}
function mcShieldBoard(J,M,rows,extra,o={}){const mt=new THREE.Group();mt.name='mc_shmount';
  if(o.fist)J.hand_L.add(mt),mt.position.set(0,-.06,0);else{mt.position.set(0,-.15,0);J.foreArm_L.add(mt);for(const y of[-.07,-.2])bx(J.foreArm_L,.15,.035,.15,M.leatherD,0,y,0);}
  const s=new THREE.Group();s.name='mc_shield';s.userData.fist=!!o.fist;mt.add(s);s.position.set(.075,0,0);
  s.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(new THREE.Vector3(0,0,-1),new THREE.Vector3(0,1,0),new THREE.Vector3(1,0,0)));
  /* shield frame: z = face normal, y = up; the solver turns it every frame (mcShield) */
  for(const[w,h,y]of rows){if(w<=0)continue;bx(s,w,h,.035,o.board||(o.metal?M.steel:M.planks),0,y,.0175);if((o.paint||!o.metal&&!o.board)&&w>.08)bx(s,w-.04,h,.01,M.paint,0,y,.04);}
  extra(s);return s;}

function mcTorso(J,M,chestM,bellyM,hipsM){bx(J.hips,.38,.2,.25,hipsM,0,-.03,0);bx(J.spine,.36,.22,.24,bellyM,0,.08,0);
  bx(J.chest,.5,.3,.29,chestM,0,.14,0);bx(J.chest,.42,.13,.04,chestM,0,.17,.155);bx(J.chest,.3,.06,.18,chestM,0,.3,-.01);}
function mcSleeves(J,M,upper,fore,long){for(const sd of['L','R']){const ua=J['upperArm_'+sd],fa=J['foreArm_'+sd];
  bx(ua,.18,.15,.18,upper,0,-.04,0);bx(ua,.15,.3,.15,long?upper:M.skin,0,-.17,0);if(!long)bx(ua,.16,.08,.16,upper,0,-.1,0);
  bx(fa,.14,.12,.14,fore||M.skin,0,-.06,0);bx(fa,.13,.28,.13,fore||M.skin,0,-.13,0);}}
function mcBelt(J,M){(MC_GEAR.belt[M.sel&&M.sel.belt||'plain']||MC_GEAR.belt.plain)(J,M);}
function mcPauldron(ua,M){bx(ua,.21,.04,.21,M.leather,0,.045,0);bx(ua,.215,.05,.215,M.leatherD,0,-.005,0);bx(ua,.218,.045,.218,M.leather,0,-.05,0);
  const s=Math.sign(ua.position.x);for(const z of[-.06,.06])bx(ua,.02,.02,.02,M.brass,s*.11,.0,z);}
function mcLegs(J,M,top,low,braies){for(const sd of['L','R']){const th=J['thigh_'+sd],sn=J['shin_'+sd];
  if(braies){bx(th,.19,.2,.2,top,0,-.09,0);bx(th,.18,.27,.19,M.skin,0,-.315,0);}else bx(th,.19,.46,.2,top,0,-.22,0);
  bx(sn,.15,.47,.16,low,0,-.225,-.005);bx(sn,.155,.1,.17,braies?M.skin:top,0,-.005,0);}}
function mcFoot(J,sd,mat,sole){const ft=J['foot_'+sd],toe=J['toes_'+sd];bx(ft,.12,.08,.19,mat,0,-.04,.025);bx(toe,.12,.05,.07,mat,0,.025,.035);
  if(sole){bx(ft,.125,.02,.195,sole,0,-.07,.025);bx(toe,.125,.02,.075,sole,0,.01,.035);}}
function mcFist(hd,mat,sd){bx(hd,.09,.11,.11,mat,0,-.06,0);bx(hd,.1,.03,.1,mat,0,-.1,0);bx(hd,.04,.06,.03,mat,(sd==='L'?-1:1)*.0,-.04,.06);}

/* ---------- head: face shape, eyes, brows, nose, ears, scar, facial hair, hair ---------- */
function mcHead(J,M,sel){const h=J.head,F=MC_FACE[sel.face],w=F.w,hw=w/2;bx(J.neck,.16,.13,.15,M.skin,0,.025,0);
  bx(h,w,.27,.26,M.skin,0,.135,.01);bx(h,F.jw,.08,F.jd,sel.beard==='stubble'?M.stub:M.skin,0,.05,.012);bx(h,w-.02,.03,F.brow,M.skinD,0,.165,.136+F.brow/2);
  const fz=.14;
  for(const s of[1,-1]){bx(h,.05,.028,.01,M.eyeW,s*.055,.142,fz+.002);bx(h,.026,.028,.012,M.eye,s*.05,.142,fz+.003);bx(h,.065,.016,.014,M.hair,s*.055,.172,.138+F.brow);
    bx(h,.03,.07,.05,M.skin,s*(hw+.007),.13,.0);bx(h,.012,.04,.03,M.skinD,s*(hw+.022),.13,.0);
    if(F.cheek)bx(h,.045,.01,.01,M.skinD,s*.075,.098,fz+.002);
    if(F.lines){bx(h,.012,.03,.01,M.skinD,s*.092,.142,fz+.002);bx(h,.035,.008,.01,M.skinD,s*.04,.112,fz+.002);}}
  if(F.lines)for(const y of[.2,.215])bx(h,.12,.007,.01,M.skinD,0,y,fz+.002);
  bx(h,F.nw,F.nh,.04,M.skin,0,.073+F.nh/2,.155);bx(h,F.nw+.005,.02,.02,M.skinD,0,.078,.163);
  if(sel.scar==='cheek')for(let i=0;i<4;i++)bx(h,.013,.013,.01,M.scar,-.06-i*.011,.088+i*.014,fz+.003);
  if(sel.scar==='eye')for(const y of[.198,.184,.122,.108,.094])bx(h,.012,.013,.01,M.scar,.062,y,y>.16?.139+F.brow:fz+.003);
  const helm=MC_GEAR.helmet[sel.helmet](J,M,F);
  if(helm!=='hide'){mcBeard(h,M,sel.beard,F);mcHair(h,M,sel.hairStyle,helm,F);}}
function mcBeard(h,M,st,F){const hr=M.hair,fz=.14;
  if(st==='none'||st==='stubble'){bx(h,.07,.01,.01,M.mouth,0,.055,fz+.009);if(st==='stubble')bx(h,.1,.016,.012,M.stub,0,.071,fz+.007);return;}
  if(st==='moustache'||st==='goatee'){bx(h,.12,.022,.03,hr,0,.072,.145);for(const s of[1,-1])bx(h,.02,.04,.025,hr,s*.058,.053,.148);bx(h,.06,.01,.01,M.mouth,0,.055,fz+.009);
    if(st==='goatee')bx(h,.07,.065,.03,hr,0,.02,.143);return;}
  bx(h,.11,.022,.03,hr,0,.072,.145);bx(h,.07,.01,.01,M.mouth,0,.055,.149);
  bx(h,F.jw-.04,.065,.04,hr,0,.018,.13);bx(h,.032,.1,.2,hr,F.jw/2-.01,.055,.03);bx(h,.032,.1,.2,hr,-(F.jw/2-.01),.055,.03);bx(h,F.jw-.05,.03,.16,hr,0,-.0,.05);
  if(st==='full'){bx(h,F.jw-.06,.09,.06,hr,0,-.03,.12);bx(h,F.jw-.09,.05,.05,hr,0,-.09,.11);}}
/* hair over the head box; 'back' keeps only what hangs below a helmet's band, 'none' nothing */
function mcHair(h,M,st,show,F){const hr=M.hair,w=F.w,hw=w/2;if(st==='bald'||show==='none')return;
  if(show==='all'){if(st==='buzz'){bx(h,w+.006,.02,.266,hr,0,.274,.01);bx(h,w+.006,.12,.012,hr,0,.2,-.124);for(const s of[1,-1])bx(h,.008,.06,.16,hr,s*(hw+.003),.22,-.03);return;}
    bx(h,w+.01,.05,.27,hr,0,.28,0);for(const s of[1,-1])bx(h,.02,.08,.2,hr,s*(hw+.006),.21,-.01);bx(h,w+.01,.06,.03,hr,0,.25,.13);
    if(st==='tied'){bx(h,.08,.07,.06,hr,0,.22,-.165);bx(h,.05,.16,.04,hr,0,.1,-.165);}}
  if(st==='buzz')return;
  bx(h,w+.01,show==='all'?.17:.11,.045,hr,0,show==='all'?.195:.165,-.128);
  if(st==='long'){bx(h,w+.01,.18,.05,hr,0,.06,-.13);for(const s of[1,-1])bx(h,.035,.18,.07,hr,s*(hw+.012),.09,-.08);}
  if(st==='tied'&&show==='back')bx(h,.05,.16,.04,hr,0,.1,-.165);}

/* materials for one look (sel); gear_items.js adds the metals (mcMetal) */
function mcMats(sel){const skinHex=MC_SKIN[sel.skin][0],hairHex=MC_HAIR[sel.hair][0];
  const M={skin:bm(skinHex,'skin'),skinD:bm(mcShade(skinHex,.85),'skin'),stub:bm(mcMix(skinHex,hairHex,.45),'skin'),scar:bm(mcMix(skinHex,'#d9b8a8',.45),'plain'),hair:bm(hairHex,'hair'),
    eye:bm(MC_EYE[sel.eyes][0],'plain'),eyeW:bm(MC_COL.eyeW,'plain'),lip:bm(MC_COL.lip,'plain'),mouth:bm(MC_COL.mouth,'plain'),slit:bm(MC_COL.slit,'plain'),
    linen:bm(MC_COL.linen),shirt:bm(MC_CLOTH[sel.cloth][0]||MC_COL.linen),quilt:bm(MC_CLOTH[sel.cloth][0]||MC_COL.quiltDye,'quilt'),cape:bm(MC_CLOTH[sel.cloth][0]||'#5e5446'),wool:bm(MC_COL.wool),leather:bm(MC_COL.leather,'leather'),leatherD:bm(MC_COL.leatherD,'leather'),leatherL:bm(MC_COL.leatherL,'leather'),
    boot:bm(MC_COL.boot,'leather'),sole:bm(MC_COL.sole,'leather'),brass:mcMat(MC_COL.brass,'steel'),iron:mcMat(MC_COL.iron,'steel'),ironD:mcMat(MC_COL.ironD,'steel'),steel:mcMat(MC_COL.steel,'steel'),
    steelL:mcMat(MC_COL.steelL,'steel'),mail:mcMat(MC_COL.iron,'mail'),planks:mcMat(MC_COL.wood,'planks'),wood:bm(MC_COL.woodD,'leather'),paint:bm(MC_SHCOL[sel.shieldCol][0])};
  M.pantsTop={wool:M.wool,leather:M.leather,none:M.linen}[sel.pants]||M.wool;M.sel=sel;
  /* skin, hair and face: never part of a gear piece (the ground versions and the armour glow skip them) */
  M.bodyMats=new Set([M.skin,M.skinD,M.stub,M.scar,M.hair,M.eye,M.eyeW,M.lip,M.mouth]);return M;}
/* the joints, in the rest pose (arms hanging, legs straight) */
function mcJoints(root){const Jt={};const jn=(n,p,x,y,z)=>Jt[n]=J(n,p,x,y,z);
  jn('hips',root,0,MCB.hipsY,0);jn('spine',Jt.hips,0,MCB.spine,0);jn('chest',Jt.spine,0,MCB.chest,0);jn('neck',Jt.chest,0,MCB.neck,0);jn('head',Jt.neck,0,MCB.headY,0);
  for(const[sd,s]of[['L',1],['R',-1]]){jn('upperArm_'+sd,Jt.chest,s*MCB.shX,MCB.shY,0);jn('foreArm_'+sd,Jt['upperArm_'+sd],0,-MCB.ua,0);jn('hand_'+sd,Jt['foreArm_'+sd],0,-MCB.fa,0);
    jn('socket_'+sd,Jt['hand_'+sd],0,-MCB.grip,0).userData.socket=true;
    jn('thigh_'+sd,Jt.hips,s*MCB.hipX,-MCB.hipDrop,0);jn('shin_'+sd,Jt['thigh_'+sd],0,-MCB.thigh,0);jn('foot_'+sd,Jt['shin_'+sd],0,-MCB.shin,0);jn('toes_'+sd,Jt['foot_'+sd],0,-MCB.ank,MCB.ball);}
  return Jt;}
/* which material set a slot gets: the weapon its own metal, armour pieces and shields the armour metal */
const mcSlotM=(slot,M,Mw,Ma)=>slot==='weapon'?Mw:Ma;
function buildMercenary(o={}){const opt=k=>o[k]!==undefined&&o[k]!=='random'?o[k]:MC_DEF[k];const sel={};for(const k in MC_DEF)sel[k]=opt(k);
  for(const k in MC_SLOTS)if(!MC_GEAR[k][sel[k]])sel[k]=MC_DEF[k];
  const root=new THREE.Group();root.userData.lights=[];
  const M=mcMats(sel),Mw=mcMetal(M,sel.wmetal),Ma=mcMetal(M,sel.ametal);
  const Jt=mcJoints(root);
  /* body gear first (the coif's mantle sits on the chest), then the head with its helmet, facial hair and hair, then the cape */
  for(const slot of MC_ORDER)MC_GEAR[slot][sel[slot]](Jt,mcSlotM(slot,M,Mw,Ma));
  mcHead(Jt,Ma,sel);MC_GEAR.cape[sel.cape](Jt,M);
  const joints=[];root.traverse(q=>{if(q.userData.joint&&!q.userData.socket)joints.push(q);});root.userData.joints=joints;root.userData.ground=2.2;root.userData.sel=sel;root.userData.M=M;
  const nm=k=>MC_SLOTS[k][sel[k]],lk=k=>MC_LOOK[k][sel[k]].toLowerCase(),cape=sel.cape!=='none';
  root.userData.variantText=`${MC_SKIN[sel.skin][1]} skin, ${lk('face')} face, ${MC_EYE[sel.eyes][1].toLowerCase()} eyes, ${MC_HAIR[sel.hair][1].toLowerCase()} ${lk('hairStyle')} hair, ${lk('beard')}${sel.scar!=='none'?', scar '+lk('scar'):''}. ${nm('armor')}${sel.shoulders!=='armor'?', shoulders: '+nm('shoulders').toLowerCase():''}, ${nm('pants').toLowerCase()}, ${nm('boots').toLowerCase()}, gloves: ${nm('gloves').toLowerCase()}, helmet: ${nm('helmet').toLowerCase()}, belt: ${nm('belt').toLowerCase()}${cape?', '+nm('cape').toLowerCase()+' ('+MC_CLOTH[sel.cloth][1].toLowerCase()+')':''}. ${nm('weapon')} and ${nm('shield').toLowerCase()}${sel.shield!=='none'&&sel.shield!=='buckler'?' ('+MC_SHCOL[sel.shieldCol][1].toLowerCase()+')':''}.`;
  /* clips: every cape has the same four panels, so one clip set serves them all */
  const cp=cape?'cape':'none';
  if(!o.noClips)root.userData.clips=mercenaryClips(sel.weapon,sel.shield,cp).concat(mcDeath(sel.weapon,sel.shield,sel.helmet,sel.armor,sel.hairStyle==='long'?'long':'short',sel.cape,sel.shoulders,sel.belt));
  return root;}
/* metals: gear_items.js replaces this with the metal choices */
function mcMetal(M){return M;}

/* ======================= the solver ======================= */
const MC_R=Math.PI/180;
function mcIK(S,T,a,b,pole,leg){const V3=THREE.Vector3,d0=T.clone().sub(S);let d=d0.length();const u=d0.clone().divideScalar(d||1);d=Math.min(Math.max(d,Math.abs(a-b)+1e-3),a+b-1e-4);
  const v=pole.clone().sub(u.clone().multiplyScalar(pole.dot(u)));if(v.lengthSq()<1e-8)v.set(0,0,leg?1:-1);v.normalize();
  const ca=(a*a+d*d-b*b)/(2*a*d),sa=Math.sqrt(Math.max(0,1-ca*ca)),Eo=u.clone().multiplyScalar(ca).add(v.clone().multiplyScalar(sa));
  const y=Eo.clone().negate(),z=leg?v.clone():v.clone().negate();z.sub(y.clone().multiplyScalar(z.dot(y))).normalize();const x=new V3().crossVectors(y,z);
  const q=new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(x,y,z)),cg=(a*a+b*b-d*d)/(2*a*b),bend=Math.PI-Math.acos(Math.max(-1,Math.min(1,cg)));
  return{q,bend:leg?bend:-bend};}
/* pose fields (degrees, metres): P hips offset, H/S/C hips, spine, chest (x pitch forward, y yaw left, z roll), N/Hd neck and head on top of the automatic
   head steadying (hc = how much of the torso's turn the head undoes); FL/FR feet [x, z, yaw, lift, pitch toe-down]; kL/kR knees out (deg);
   hL/hR wrists and eL/eR elbow poles in the chest's frame; bR blade direction in the body's frame (world turned by Y), rR edge roll; sn shield facing (body frame), st its tilt; wL left wrist; sh shield turn on
   the forearm; fr 0..1 frees the right arm from the blade (empty hand: keyed elbow eR, neutral wrist); Y turns the whole body about the vertical (feet included, the head not steadied against it); fk 0..1 blend of the legs to the FK angles LL/LR [thigh x, thigh z, knee, foot]; gc 1 lifts the body off the ground, 2 keeps it touching
   the ground (the roll); ws 0..1 moves the weapon from the hand into its holder on the hip; sc 0..1 turns the shield with the chest instead of the body; ht tilts the holder further (deg, sheathe and draw) */
const MC_F=[['P',3],['H',3],['S',3],['C',3],['N',3],['Hd',3],['FL',5],['FR',5],['kL',1],['kR',1],['hL',3],['eL',3],['wL',3],['hR',3],['eR',3],['bR',3],['rR',1],['sn',3],['st',1],['hc',1],['fk',1],['LL',4],['LR',4],['gc',1],['Y',1],['fr',1],['ws',1],['sc',1],['ht',1]];
function mcSolve(R,p){const V3=THREE.Vector3,Q=THREE.Quaternion,j=R.j,e=(o,a)=>o.rotation.set(a[0]*MC_R,a[1]*MC_R,a[2]*MC_R,'YXZ');
  {const lo=Math.max(p.FL[2],p.FR[2])-40,hi=Math.min(p.FL[2],p.FR[2])+40,hy=Math.max(lo,Math.min(hi,p.H[1]));if(hy!==p.H[1]&&p.fk<1){p.S=[p.S[0],p.S[1]+p.H[1]-hy,p.S[2]];p.H=[p.H[0],hy,p.H[2]];}}
  j.hips.position.set(p.P[0],MCB.hipsY+p.P[1],p.P[2]);e(j.hips,p.H);if(p.Y)j.hips.quaternion.premultiply(new Q().setFromAxisAngle(new V3(0,1,0),p.Y*MC_R));e(j.spine,p.S);e(j.chest,p.C);
  const hc=p.hc,yw=(p.H[1]+p.S[1]+p.C[1])*hc,pt=(p.H[0]+p.S[0]+p.C[0])*hc,rl=(p.H[2]+p.S[2]+p.C[2])*hc;
  e(j.neck,[p.N[0]-pt*.45,p.N[1]-yw*.5,p.N[2]-rl*.5]);e(j.head,[p.Hd[0]-pt*.45,p.Hd[1]-yw*.5,p.Hd[2]-rl*.5]);
  R.m.updateMatrixWorld(true);
  /* legs: ankle from the foot channel, pivoting on the ball (toe down) or the heel (toe up); the hips drop if a leg can't reach */
  const ft={};let drop=0;
  const cy=Math.cos((p.Y||0)*MC_R),sy=Math.sin((p.Y||0)*MC_R);
  for(const sd of['L','R']){const F0=p['F'+sd],F=[F0[0]*cy+F0[1]*sy,-F0[0]*sy+F0[1]*cy,F0[2]+(p.Y||0),F0[3],F0[4]],yaw=F[2]*MC_R,pit=F[4]*MC_R,q=new Q().setFromEuler(new THREE.Euler(pit,yaw,0,'YXZ')),pz=pit>0?MCB.ball:MCB.heel;
    const ank=new V3(F[0]+Math.sin(yaw)*pz,F[3],F[1]+Math.cos(yaw)*pz).add(new V3(0,MCB.ank,-pz).applyQuaternion(q));
    const hp=j['thigh_'+sd].getWorldPosition(new V3()),L=MCB.thigh+MCB.shin-.003,dx=ank.x-hp.x,dz=ank.z-hp.z,h2=dx*dx+dz*dz,dy=hp.y-ank.y;
    if(p.fk<1&&h2<L*L){const need=dy-Math.sqrt(L*L-h2);if(need>drop)drop=need;}ft[sd]={q,ank};}
  if(drop>0){j.hips.position.y-=drop;R.m.updateMatrixWorld(true);}
  const hInv=new THREE.Matrix4().copy(j.hips.matrixWorld).invert(),hQi=j.hips.getWorldQuaternion(new Q()).invert();
  for(const sd of['L','R']){const th=j['thigh_'+sd],sn=j['shin_'+sd],fo=j['foot_'+sd],F=p['F'+sd],s=sd==='L'?1:-1,k=(F[2]+(p.Y||0)+s*p['k'+sd])*MC_R;
    const r=mcIK(th.position,ft[sd].ank.clone().applyMatrix4(hInv),MCB.thigh,MCB.shin,new V3(Math.sin(k),0,Math.cos(k)).applyQuaternion(hQi),1);
    th.quaternion.copy(r.q);sn.rotation.set(r.bend,0,0);th.updateMatrixWorld(true);
    fo.quaternion.copy(sn.getWorldQuaternion(new Q()).invert().multiply(ft[sd].q));j['toes_'+sd].rotation.set(F[4]>0?-F[4]*MC_R:0,0,0);
    if(p.fk>0){const A=p['L'+sd],fq=new Q().setFromEuler(new THREE.Euler(A[0]*MC_R,0,s*A[1]*MC_R,'XYZ'));
      th.quaternion.slerp(fq,p.fk);sn.rotation.x+=(A[2]*MC_R-sn.rotation.x)*p.fk;const f0=fo.quaternion.clone();fo.quaternion.copy(f0.slerp(new Q().setFromEuler(new THREE.Euler(A[3]*MC_R,0,0)),p.fk));
      j['toes_'+sd].rotation.x*=1-p.fk;}}
  R.m.updateMatrixWorld(true);
  if(j.mc_scab){const hb=j.mc_scab,reach=hb.userData.reach||.7;if(!R.legCol){R.legCol=[];for(const n of['thigh_L','shin_L','foot_L','foreArm_L','hand_L'])j[n].children.forEach(q=>{if(q.isMesh)R.legCol.push(q);});if(j.mc_shield)j.mc_shield.traverse(q=>{if(q.isMesh)R.legCol.push(q);});}
    const inv=R.legCol.map(q=>new THREE.Matrix4().copy(q.matrixWorld).invert()),v=new V3(),pt=new V3();
    const legHit=()=>{for(let f=.05;f<=1.001;f+=.16)for(const zz of[-.035,.035])for(const xx of[-.022,.022]){pt.set(xx,-reach*f,zz).applyMatrix4(hb.matrixWorld);if(pt.y<.02)return true;
      for(let i=0;i<inv.length;i++){const g=R.legCol[i].geometry.parameters;v.copy(pt).applyMatrix4(inv[i]);if(Math.abs(v.x)<g.width/2+.012&&Math.abs(v.y)<g.height/2+.012&&Math.abs(v.z)<g.depth/2+.012)return true;}}return false;};
    const a00=(hb.userData.tilt||14)+(p.ht||0),a0=R.prevScab??a00;let best=a0,bc=1e9,bl=-9,fb=a0,nv=0;for(let i=0;i<72&&nv<10;i++){const a=a0+(i%2?1:-1)*Math.ceil(i/2)*5;hb.rotation.set(-a*MC_R,0,0);hb.updateMatrixWorld(true);const lo=mcLow(hb);
      if(lo>bl){bl=lo;fb=a;}if(lo>.02&&!legHit()){const tip=pt.set(0,-reach,0).applyMatrix4(hb.matrixWorld).y,c=Math.abs(a-a0)*.02+Math.abs(a-a00)*(p.ht?.05:.015)+tip*.6;nv++;if(c<bc){bc=c;best=a;}}}if(bc===1e9)best=fb;
    hb.rotation.set(-best*MC_R,0,0);hb.updateMatrixWorld(true);R.prevScab=best;}
  mcArms(R,p);
  /* props never go below the ground: lift the hand that holds them */
  for(const[sd,obj]of[['R',p.ws>=.5||p.fr>=.5?j.hand_R:j.mc_sword],['L',j.mc_shield]]){if(!obj||R.dropped&&R.dropped[obj.name])continue;for(let i=0;i<6;i++){const lo=mcLow(obj,obj===j.hand_R?true:false);if(lo>.002)break;
    const up=new V3(0,.004-lo,0).applyQuaternion(j.chest.getWorldQuaternion(new Q()).invert());p['h'+sd]=[p['h'+sd][0]+up.x,p['h'+sd][1]+up.y,p['h'+sd][2]+up.z];mcArms(R,p,sd);}}
  if(p.gc>=1.5){const lo=mcLow(R.m,3);j.hips.position.y+=(j.mc_cape0?.032:.002)-lo;R.m.updateMatrixWorld(true);}
  else if(p.gc>0){const lo=mcLow(R.m,true),g0=j.mc_cape0?.032:.001;if(lo<g0){j.hips.position.y+=g0-lo;R.m.updateMatrixWorld(true);}}}
/* arms: two-bone IK in the chest's frame. The sword arm searches the elbow circle for the elbow that lets a nearly neutral wrist point the
   blade along bR (the wrist then bends the rest of the way, clamped): cost = wrist turn and bend from neutral, distance from the preferred elbow
   (opposite the blade, nudged towards the keyed eR),
   upper-arm twist over 70°, an elbow inside the body or straight up, and the change from last frame's elbow */
const MC_AX=new THREE.Vector3(1,0,0);
/* a wrist closer than 0.36 m to its shoulder makes the elbow unstable, and a straight arm snaps: targets are kept 0.36 m out and softly
   inside 0.585 m (the arm is 0.6 m), so the elbow always keeps a little bend */
function mcReach(S,h){const T=new THREE.Vector3(...h),d=T.clone().sub(S);let l=d.length();const l0=l;
  if(l<.36)l=.36;else if(l>.5)l=.5+.085*(1-Math.exp(-(l-.5)/.085));return S.clone().add(d.multiplyScalar(l/Math.max(l0,1e-4)));}
const mcBody=(p,v)=>new THREE.Vector3(...v).normalize().applyAxisAngle(new THREE.Vector3(0,1,0),(p.Y||0)*MC_R);
function mcArmR(R,p){const V3=THREE.Vector3,Q=THREE.Quaternion,S=R.j.upperArm_R.position,T=mcReach(S,p.hR),d=mcBody(p,p.bR).applyQuaternion(R.j.chest.getWorldQuaternion(new Q()).invert()),fr=p.fr||0,pref=d.clone().negate().multiplyScalar(1-fr).add(new V3(...p.eR).normalize().multiplyScalar(.35+fr*2));
  const u=T.clone().sub(S).normalize(),v1=pref.clone().sub(u.clone().multiplyScalar(pref.dot(u)));if(v1.lengthSq()<1e-6)v1.set(-1,0,0);v1.normalize();const v2=new V3().crossVectors(u,v1);
  const ev=ph=>{const pole=v1.clone().multiplyScalar(Math.cos(ph)).add(v2.clone().multiplyScalar(Math.sin(ph))),r=mcIK(S,T,MCB.ua,MCB.fa,pole,0);
    const qF=r.q.clone().multiply(new Q().setFromAxisAngle(MC_AX,r.bend)),dF=d.clone().applyQuaternion(qF.invert()),y0=Math.atan2(dF.x,dF.z)/MC_R,hz=Math.hypot(dF.x,dF.z),ya=R.prevYa===undefined?y0:R.prevYa+(((y0-R.prevYa+540)%360)-180)*Math.min(1,Math.max(0,(hz-.25)/.35)),pi=-Math.asin(Math.max(-1,Math.min(1,dF.y)))/MC_R;
    let tw=Math.abs(2*Math.atan2(r.q.y,r.q.w)/MC_R);if(tw>180)tw=360-tw;
    let c=(1-fr)*((ya/45)**2+((pi-28)/32)**2+(pi>55?((pi-55)/8)**2:0))+(.6+fr*3)*(ph/(70*MC_R))**2+(tw>70?((tw-70)/15)**2:0)+(pole.x>.35?((pole.x-.35)/.2)**2:0)+(pole.y>.6?((pole.y-.6)/.2)**2:0);
    if(R.prevPole){const dp=pole.dot(R.prevPole);if(dp<.94)c+=1e3;c+=40*(1-dp);}return{c,r,pole,ya,pi};};
  let best=null;for(let k=-36;k<36;k++){const e=ev(k*5*MC_R);if(!best||e.c<best.c){best=e;best.ph=k*5*MC_R;}}
  for(let k=-10;k<=10;k++){const e=ev(best.ph+k*.5*MC_R);if(e.c<best.c){e.ph=best.ph+k*.5*MC_R;best=e;}}
  R.prevPole=best.pole;R.prevYa=((best.ya+540)%360)-180;best.ya=R.prevYa;return best;}
function mcArms(R,p,only){const V3=THREE.Vector3,j=R.j;
  for(const sd of['L','R']){if(only&&only!==sd)continue;const ua=j['upperArm_'+sd],fa=j['foreArm_'+sd],hd=j['hand_'+sd];
    if(sd==='R'){const b=mcArmR(R,p);ua.quaternion.copy(b.r.q);fa.rotation.set(b.r.bend,0,0);
      /* the wrist turns at most 21° and bends at most 18° per 60 fps frame: in the fastest cuts the blade lags its key a little */
      const fr=p.fr||0;let wy=Math.max(-80,Math.min(80,b.ya))*(1-fr),wp=Math.max(-40,Math.min(75,b.pi))*(1-fr);if(R.prevW){wy=R.prevW[0]+Math.max(-21,Math.min(21,wy-R.prevW[0]));wp=R.prevW[1]+Math.max(-18,Math.min(18,wp-R.prevW[1]));}
      if(!only)R.prevW=[wy,wp];hd.rotation.set(wp*MC_R,wy*MC_R,p.rR*MC_R,'YXZ');}
    else{const r=mcIK(ua.position,mcReach(ua.position,p.hL.map((v,i)=>v+(R.lOff?R.lOff[i]:0))),MCB.ua,MCB.fa,new V3(...p.eL),0);ua.quaternion.copy(r.q);fa.rotation.set(r.bend,0,0);
      hd.rotation.set(p.wL[0]*MC_R,p.wL[1]*MC_R,p.wL[2]*MC_R,'YXZ');if(j.mc_shield)mcShield(R,p);}
    ua.updateMatrixWorld(true);}}
/* the shield's face looks along sn (the body's frame: the root turned by Y) made square to the forearm, its top stays up (turned st degrees in its plane); its back sits 7.5 cm off the forearm */
function mcShield(R,p){const V3=THREE.Vector3,Q=THREE.Quaternion,j=R.j,fa=j.foreArm_L,mt=j.mc_shmount,sh=j.mc_shield;fa.updateMatrixWorld(true);
  const fq=fa.getWorldQuaternion(new Q()),ax=new V3(0,1,0).applyQuaternion(fq),cq=j.chest.getWorldQuaternion(new Q()),sc=p.sc||0,
    n=mcBody(p,p.sn).multiplyScalar(1-sc).add(new V3(...p.sn).normalize().applyQuaternion(cq).multiplyScalar(sc));
  if(!sh.userData.fist)n.sub(ax.clone().multiplyScalar(n.dot(ax)));if(n.lengthSq()<1e-6)n.set(1,0,0).applyQuaternion(fq);n.normalize();
  const uw=new V3(0,1-sc,0).add(new V3(0,sc,0).applyQuaternion(cq)),up=uw.sub(n.clone().multiplyScalar(n.dot(uw)));if(up.lengthSq()<1e-4)up.copy(ax);up.normalize();if(p.st)up.applyAxisAngle(n,p.st*MC_R);
  const x=new V3().crossVectors(up,n),wq=new Q().setFromRotationMatrix(new THREE.Matrix4().makeBasis(x,up,n)),mq=mt.getWorldQuaternion(new Q()).invert();
  sh.quaternion.copy(mq.clone().multiply(wq));sh.position.copy(n.clone().multiplyScalar(.075).applyQuaternion(mq));sh.updateMatrixWorld(true);}
const MC_V=new THREE.Vector3();
/* the cape: each panel hangs from the bottom of the one above in the chest's side plane; its angle springs towards hanging (plus drag when
   running) and is then moved, 5 degrees at a time, to the nearest angle where its edge points are clear of every box of the body, weapon and
   shield and of the ground; after ex.capeFree (lying in Death) only the ground counts */
function mcCape(R,ex,t){/* ok() also leaves dir set, used for the fallback height */const j=R.j;if(!j.mc_cape0)return;const V3=THREE.Vector3,ch=j.chest,C=MC_CAPE;R.m.updateMatrixWorld(true);
  const X=new V3(1,0,0).transformDirection(ch.matrixWorld);let d0=new V3(0,-1,0).sub(X.clone().multiplyScalar(-X.y));if(d0.lengthSq()<1e-4)d0=new V3(0,0,-1).transformDirection(ch.matrixWorld);d0.normalize();
  const b0=new V3().crossVectors(X,d0);if(b0.dot(new V3(0,-.3,-1).transformDirection(ch.matrixWorld))<0)b0.negate();
  if(!R.capeCol){R.capeCol=[];R.m.traverse(q=>{if(!q.isMesh)return;let p=q;while(p){if(/^mc_cape/.test(p.name))return;p=p.parent;}const g=q.geometry.parameters;if(g&&g.width!==undefined&&!(q.parent===ch&&q.position.y>.3&&q.position.z<-.1))R.capeCol.push(q);});}
  const cf=ex.capeFree,free=cf!==undefined&&(Array.isArray(cf)?t>=cf[0]&&t<=cf[1]:t>=cf),inv=free?[]:R.capeCol.map(q=>new THREE.Matrix4().copy(q.matrixWorld).invert()),v=new V3();
  const hit=pt=>{if(pt.y<.015)return true;if(free)return false;for(let i=0;i<inv.length;i++){const g=R.capeCol[i].geometry.parameters;v.copy(pt).applyMatrix4(inv[i]);
    if(Math.abs(v.x)<g.width/2+.015&&Math.abs(v.y)<g.height/2+.015&&Math.abs(v.z)<g.depth/2+.015)return true;}return false;};
  if(!R.capeA)R.capeA=new Array(C.n).fill(2);const drag=ex.capeDrag||0,chI=new THREE.Matrix4().copy(ch.matrixWorld).invert();let S=ch.localToWorld(new V3(...C.at)),last=0;
  for(let k=0;k<C.n;k++){const want=R.capeA[k]+(2+drag*(.6+k*.15)-R.capeA[k])*.18,dir=new V3(),pt=new V3();let th=want;
    const ok=a=>{dir.copy(d0).multiplyScalar(Math.cos(a*MC_R)).add(b0.clone().multiplyScalar(Math.sin(a*MC_R)));if(k&&Math.abs(a-last)>75)return false;
      for(const f of[.35,.7,1])for(const w of[-.19,0,.19]){pt.copy(S).addScaledVector(dir,C.len*f).addScaledVector(X,w);if(hit(pt))return false;}return true;};
    let found=false,bh=-9;for(let i=0;i<72;i++){const a=want+(i%2?1:-1)*Math.ceil(i/2)*5;if(ok(a)){th=a;found=true;break;}const h=S.y+C.len*Math.min(dir.y,0);if(h>bh){bh=h;th=a;}}
    ok(th);R.capeA[k]=th;last=th;const y=dir.clone().negate(),z=new V3().crossVectors(X,y).normalize(),x=new V3().crossVectors(y,z);
    const W=new THREE.Matrix4().makeBasis(x,y,z).setPosition(S),L=chI.clone().multiply(W),g=j['mc_cape'+k];L.decompose(g.position,g.quaternion,new V3());g.updateMatrixWorld(true);
    S=S.clone().addScaledVector(dir,C.len);}}
/* lowest box corner under obj; body = true skips the weapon, shield, holder and cape, 2 skips only the holder and cape, 3 only the cape */
function mcLow(obj,body){obj.updateMatrixWorld(true);let y=1e9;obj.traverse(q=>{if(!q.isMesh||!q.visible)return;if(body){let p=q;while(p&&p!==obj){if((body===true&&(p.name==='mc_sword'||p.name==='mc_shield'))||(body!==3&&p.name==='mc_scab')||/^mc_cape/.test(p.name))return;p=p.parent;}}const g=q.geometry.parameters;if(!g||g.width===undefined)return;
  for(let i=0;i<8;i++){MC_V.set((i&1?.5:-.5)*g.width,(i&2?.5:-.5)*g.height,(i&4?.5:-.5)*g.depth).applyMatrix4(q.matrixWorld);if(MC_V.y<y)y=MC_V.y;}});return y;}

/* ======================= keys, splines and baking ======================= */
function mcFlat(p){const v=[];for(const[k,n]of MC_F){const a=p[k];if(n===1)v.push(a);else for(let i=0;i<n;i++)v.push(a[i]);}return v;}
function mcUnflat(v){const p={};let i=0;for(const[k,n]of MC_F){if(n===1)p[k]=v[i++];else{p[k]=v.slice(i,i+n);i+=n;}}return p;}
/* keys: [time, overrides] chained (each key starts from the one before; 'ST' starts again from the stance). Monotone cubic in between, flat at both ends */
function mcKeys(base,keys){const T=[],Vs=[];let cur=Object.assign({},base);
  for(const[t,o]of keys){cur=o==='ST'?Object.assign({},base):Object.assign({},cur,o||{});T.push(t);Vs.push(mcFlat(cur));}
  const n=T.length,dim=Vs[0].length,m=Vs.map(()=>new Array(dim).fill(0));
  for(let i=1;i<n-1;i++){const h0=T[i]-T[i-1],h1=T[i+1]-T[i];for(let k=0;k<dim;k++){const d0=(Vs[i][k]-Vs[i-1][k])/h0,d1=(Vs[i+1][k]-Vs[i][k])/h1;
    m[i][k]=d0*d1<=0?0:3*(h0+h1)/((2*h1+h0)/d0+(h1+2*h0)/d1);}}
  return t=>{if(t<=T[0])return mcUnflat(Vs[0]);if(t>=T[n-1])return mcUnflat(Vs[n-1]);let i=0;while(t>T[i+1])i++;
    const h=T[i+1]-T[i],s=(t-T[i])/h,s2=s*s,s3=s2*s,a=2*s3-3*s2+1,b=s3-2*s2+s,c=-2*s3+3*s2,d=s3-s2,v=[];
    for(let k=0;k<dim;k++)v.push(a*Vs[i][k]+b*h*m[i][k]+c*Vs[i+1][k]+d*h*m[i+1][k]);return mcUnflat(v);};}
const MC_RIGS={};
function mcRig(w,s,c){const k=w+'|'+s+'|'+(c||'none');if(MC_RIGS[k])return MC_RIGS[k];const m=buildMercenary({weapon:w,shield:s,cape:c||'none',noClips:true}),j={};m.traverse(q=>{if(q.name&&!j[q.name])j[q.name]=q;});
  /* the long kite shield is carried higher and a little further out, so it clears the legs */
  return MC_RIGS[k]={m,j,lOff:j.mc_shield&&j.mc_shield.userData.lOff||(s==='kite'?[.05,.14,0]:s==='buckler'?[.05,0,-.04]:[0,0,0])};}
const MC_TRK=['hips','spine','chest','neck','head','upperArm_L','foreArm_L','hand_L','upperArm_R','foreArm_R','hand_R','thigh_L','shin_L','foot_L','toes_L','thigh_R','shin_R','foot_R','toes_R','mc_shmount','mc_scab','mc_cape0','mc_cape1','mc_cape2','mc_cape3'];
/* bake one clip: pose(t) solved every frame; drops: {obj:'mc_sword'|'mc_shield', t, d (fall time), at:[x,z,yaw]} let a prop go and lay it flat on the ground */
function mcBake(R,name,dur,loop,pose,note,ex={}){const fps=ex.fps||60,n=Math.max(2,Math.round(dur*fps)),times=[],data={},prev={},Q=THREE.Quaternion,V3=THREE.Vector3;
  const objs=MC_TRK.filter(k=>R.j[k]),props=['mc_sword','mc_shield'].filter(k=>R.j[k]);for(const k of objs.concat(props))data[k]={q:[],p:[]};
  const rest={};for(const k of props)rest[k]={p:R.j[k].position.clone(),q:R.j[k].quaternion.clone()};
  const drops={};for(const d of ex.drops||[])if(R.j[d.obj])drops[d.obj]=Object.assign({},d);
  R.prevPole=null;R.prevYa=undefined;R.prevW=null;R.capeA=null;R.prevScab=undefined;for(let i=0;i<=n;i++){const t=i/n*dur;times.push(t);const p=pose(t);R.dropped={};for(const k of props){if(drops[k]&&t>=drops[k].t)R.dropped[k]=1;if(k==='mc_sword'){R.j[k].position.copy(rest[k].p);R.j[k].quaternion.copy(rest[k].q);}}mcSolve(R,p);
    for(const k of props){const o=R.j[k],D=drops[k];if(k==='mc_sword'){o.position.copy(rest[k].p);o.quaternion.copy(rest[k].q);}
      if(D&&t>=D.t){o.parent.updateMatrixWorld(true);
        if(!D.M0){o.updateMatrixWorld(true);D.M0=o.matrixWorld.clone();D.p0=new V3();D.q0=new Q();D.M0.decompose(D.p0,D.q0,new V3());
          /* rest on the ground: flat face up (sword: the flat; shield: the painted face), turned to yaw, lifted so its lowest corner sits on 0 */
          const yaw=D.at[2]*MC_R,zA=new V3(Math.sin(yaw),0,Math.cos(yaw)),up=new V3(0,1,0),X=k==='mc_sword'?up:new V3().crossVectors(zA,up),Y=k==='mc_sword'?new V3().crossVectors(zA,up):zA.clone(),Z=k==='mc_sword'?zA:up;
          D.q1=new Q().setFromRotationMatrix(new THREE.Matrix4().makeBasis(X,Y,Z));const tmp=o.clone(true);tmp.position.set(0,0,0);tmp.quaternion.copy(D.q1);tmp.updateMatrixWorld(true);
          D.p1=new V3(D.at[0],-mcLow(tmp)+.002,D.at[1]);}
        const s=Math.min(1,(t-D.t)/D.d),g=s*s,pos=D.p0.clone().lerp(D.p1,g),qq=D.q0.clone().slerp(D.q1,Math.min(1,s*1.15));pos.y=Math.max(pos.y,D.p1.y);
        {const tmp=o.clone(true);tmp.position.copy(pos);tmp.quaternion.copy(qq);tmp.updateMatrixWorld(true);const lo=mcLow(tmp);if(lo<.002)pos.y+=.002-lo;}
        const W=new THREE.Matrix4().compose(pos,qq,new V3(1,1,1)),Lm=new THREE.Matrix4().copy(o.parent.matrixWorld).invert().multiply(W),lp=new V3(),lq=new Q();Lm.decompose(lp,lq,new V3());o.position.copy(lp);o.quaternion.copy(lq);}
      /* sheathed: blend the weapon from the fist into its holder's stow place; it turns to the holder's axis early, so it slides in straight */
      if(k==='mc_sword'&&p.ws>0&&R.j.mc_scab&&!(D&&t>=D.t)){const st=R.j.mc_scab.userData.stow,u=Math.min(1,p.ws),sm=u*u*(3-2*u);o.parent.updateMatrixWorld(true);o.updateMatrixWorld(true);
        const Hm=R.j.mc_scab.matrixWorld.clone().multiply(new THREE.Matrix4().compose(new V3(...st.p),new Q().setFromEuler(new THREE.Euler(...st.r)),new V3(1,1,1))),p0=new V3(),q0=new Q(),p1=new V3(),q1=new Q();
        o.matrixWorld.decompose(p0,q0,new V3());Hm.decompose(p1,q1,new V3());const ul=Math.min(1,u*4),W=new THREE.Matrix4().compose(p0.lerp(p1,sm),q0.slerp(q1,ul*ul*(3-2*ul)),new V3(1,1,1)),Lm=new THREE.Matrix4().copy(o.parent.matrixWorld).invert().multiply(W);
        Lm.decompose(o.position,o.quaternion,new V3());o.updateMatrixWorld(true);}}
    mcCape(R,ex,t);
    for(const k of objs.concat(props)){const o=R.j[k],q=o.quaternion.clone();if(prev[k]&&prev[k].dot(q)<0)q.set(-q.x,-q.y,-q.z,-q.w);prev[k]=q;data[k].q.push(q.x,q.y,q.z,q.w);data[k].p.push(o.position.x,o.position.y,o.position.z);}}
  const tracks=[];for(const k of objs.concat(props)){tracks.push(new THREE.QuaternionKeyframeTrack(k+'.quaternion',times,data[k].q));if(k==='hips'||props.includes(k)||/^mc_cape/.test(k))tracks.push(new THREE.VectorKeyframeTrack(k+'.position',times,data[k].p));}
  for(const k of props){const o=R.j[k];o.position.copy(rest[k].p);o.quaternion.copy(rest[k].q);}
  R.dropped=null;const c=new THREE.AnimationClip(name,dur,tracks);c.loopMode=loop;c.note=note;if(ex.next)c.next=ex.next;if(ex.speed)c.speed=ex.speed;if(ex.turn)c.turn=ex.turn;if(ex.move)c.move=ex.move;return c;}

/* ======================= stances ======================= */
const MC_ST0={P:[0,-.015,0],H:[0,0,0],S:[2,0,0],C:[-1,0,0],N:[0,0,0],Hd:[0,0,0],FL:[.13,.01,7,0,0],FR:[-.13,-.01,-7,0,0],kL:0,kR:0,
  hL:[.36,-.3,.15],eL:[.4,.1,-1],wL:[0,0,0],hR:[-.35,-.32,.12],eR:[-.35,0,-1],bR:[-.1,-.42,.9],rR:0,sn:[1,0,.1],st:0,hc:1,fk:0,LL:[0,0,0,0],LR:[0,0,0,0],gc:0,Y:0,fr:0,ws:0,sc:0,ht:0};
const MC_ST=Object.assign({},MC_ST0,{P:[0,-.1,0],H:[3,-14,0],S:[4,-7,0],C:[2,-9,0],FL:[.15,.17,0,0,0],FR:[-.17,-.2,-32,0,0],kL:4,kR:8,
  hL:[.12,-.04,.42],eL:[1,-.6,.1],sn:[-.12,0,1],hR:[-.3,-.16,.32],eR:[-.4,-1,-.4],bR:[-.15,.55,.82],rR:0});

/* in-place gait: each foot slides back at the ground speed while planted (heel strike, flat, heel-off onto the ball) and swings forward lifted;
   g: dur, speed (m/s), beta (stance share), lift, dir [x,z] of travel, heel/toe pitch, bob (low at lowAt), sway, yaw (pelvis), arm swing, wide (feet apart), fn(ph,p) extras */
function mcGait(base,g){const Ls=g.speed*g.beta*g.dur,dir=g.dir||[0,1];
  return t=>{const ph=t/g.dur,p=JSON.parse(JSON.stringify(base)),c2=Math.cos(2*Math.PI*ph);
    for(const[sd,off,sg]of[['L',0,1],['R',.5,-1]]){const u=(ph+off)%1,F=p['F'+sd];let sl,lift=0,pit;
      if(u<g.beta){const w=u/g.beta;sl=(.5-w)*Ls;pit=-g.heel*Math.max(0,1-w/.15)+g.toe*Math.max(0,(w-.72)/.28)**1.5;}
      else{const w=(u-g.beta)/(1-g.beta),e=(1-Math.cos(Math.PI*w))/2;sl=(-.5+e)*Ls;lift=g.lift*Math.sin(Math.PI*w);pit=g.toe+(-g.heel-g.toe)*e;}
      F[0]+=dir[0]*sl+sg*(g.wide||0);F[1]+=dir[1]*sl;F[3]=lift;F[4]=pit*dir[1];}
    p.P[1]+=-(g.bob||0)*Math.cos(4*Math.PI*(ph-(g.lowAt||0)));p.P[0]+=(g.sway||0)*Math.sin(2*Math.PI*ph);
    p.H[1]+=-(g.yaw||0)*c2;p.C[1]+=(g.yaw||0)*1.5*c2;
    if(g.arm){p.hR[2]+=g.arm*c2;p.hL[2]-=g.arm*c2*.7;p.hR[1]+=Math.abs(g.arm)*.3*c2;}
    if(g.fn)g.fn(ph,p);return p;};}
const MC_CLIPS={};
function mercenaryClips(w,s,cp){const ck=w+'|'+s+'|'+(cp||'none');if(MC_CLIPS[ck])return MC_CLIPS[ck];const R=mcRig(w,s,cp),C=[],ST=MC_ST,ST0=MC_ST0;
  const K=(name,dur,loop,base,keys,note,ex)=>C.push(mcBake(R,name,dur,loop,mcKeys(base,keys),note,ex));
  const G=(name,base,g,note)=>C.push(mcBake(R,name,g.dur,true,mcGait(base,g),note,{speed:g.speed,capeDrag:g.speed*9}));
  const WAR={next:'Idle (war mode)'};
  /* ---- relaxed ---- */
  K('Idle',4,true,ST0,[[0,{}],[1,{C:[-2.5,0,0],P:[.012,-.02,0],hR:[-.35,-.31,.13]}],[2,{C:[-1,1,0],P:[.018,-.016,0],Hd:[0,4,0]}],[3,{C:[-2.5,0,0],P:[.006,-.02,0],Hd:[0,-3,0]}],[4,'ST']],
    'Breathing and a slow weight shift; sword point down, shield at the side');
  G('Walk',ST0,{dur:1.05,speed:1.2,beta:.62,lift:.09,heel:14,toe:24,bob:.018,sway:.022,yaw:5,arm:.1},'Heel to toe with the arms swinging, about 1.2 m/s');
  G('Run',Object.assign({},ST0,{P:[0,-.04,0],H:[9,0,0],S:[4,0,0],C:[2,0,0],hR:[-.33,-.2,.22],eR:[-.4,-.2,-1],bR:[-.3,-.2,.93],hL:[.33,-.18,.26],eL:[.5,0,-1],sn:[1,0,.25]}),
    {dur:.68,speed:3.3,beta:.36,lift:.2,heel:10,toe:30,bob:.035,lowAt:.18,sway:.012,yaw:8,arm:.17},'Leaning in, high knees and a flight phase, about 3.3 m/s');
  /* ---- war mode ---- */
  K('Idle (war mode)',2.6,true,ST,[[0,{}],[1.3,{P:[0,-.115,0],C:[4,-9,0],hL:[.12,-.05,.42],hR:[-.3,-.17,.32],Hd:[2,0,0]}],[2.6,'ST']],'Guard: left foot forward, knees bent, shield up and the sword ready');
  G('Walk (war mode)',ST,{dur:1.1,speed:.85,beta:.66,lift:.07,heel:10,toe:16,bob:.012,yaw:2},'Short steps behind the shield, about 0.85 m/s');
  G('Walk back (war mode)',ST,{dur:1.1,speed:.7,beta:.66,lift:.07,heel:8,toe:14,dir:[0,-1],bob:.012},'Backing off behind the shield, about 0.7 m/s');
  G('Strafe left',ST,{dur:.85,speed:.75,beta:.62,lift:.07,heel:0,toe:0,dir:[1,0],wide:.03,bob:.012},'Side steps to the left behind the guard, about 0.75 m/s');
  G('Strafe right',ST,{dur:.85,speed:.75,beta:.62,lift:.07,heel:0,toe:0,dir:[-1,0],wide:.03,bob:.012},'Side steps to the right behind the guard, about 0.75 m/s');
  /* ---- moves ---- */
  K('Dodge left',.9,false,ST,[[0,{}],[.12,{P:[0,-.2,0],H:[3,-14,-4]}],[.3,{P:[.45,-.12,0],H:[3,-14,8],FL:[.62,.17,0,.12,0],FR:[.1,-.2,-32,.06,0]}],
    [.42,{P:[.5,-.2,0],H:[3,-14,4],FL:[.68,.17,0,0,0],FR:[.3,-.2,-32,0,0]}],[.65,{P:[.25,-.12,0],FL:[.4,.17,0,.05,0],FR:[.1,-.2,-32,0,0]}],[.9,'ST']],'Quick hop to the left and back into the guard',WAR);
  K('Dodge right',.9,false,ST,[[0,{}],[.12,{P:[0,-.2,0],H:[3,-14,4]}],[.3,{P:[-.45,-.12,0],H:[3,-14,-8],FR:[-.64,-.2,-32,.12,0],FL:[-.1,.17,0,.06,0]}],
    [.42,{P:[-.5,-.2,0],H:[3,-14,-4],FR:[-.68,-.2,-32,0,0],FL:[-.32,.17,0,0,0]}],[.65,{P:[-.25,-.12,0],FR:[-.42,-.2,-32,0,0],FL:[-.1,.17,0,.05,0]}],[.9,'ST']],'Quick hop to the right and back into the guard',WAR);
  K('Dodge back',.95,false,ST,[[0,{}],[.12,{P:[0,-.22,.03],H:[8,-14,0]}],[.32,{P:[0,-.1,-.45],H:[-4,-14,0],FL:[.15,-.12,0,.14,10],FR:[-.17,-.62,-32,.08,0],hL:[.14,.08,.42]}],
    [.45,{P:[0,-.22,-.5],H:[6,-14,0],FL:[.15,-.3,0,0,0],FR:[-.17,-.7,-32,0,0]}],[.7,{P:[0,-.12,-.22],FL:[.15,.0,0,.06,0],FR:[-.17,-.42,-32,0,0]}],[.95,'ST']],'Hops back out of reach and steps in again',WAR);
  K('Jump',1.3,false,ST0,[[0,{}],[.28,{P:[0,-.26,0],H:[16,0,0],S:[8,0,0],hR:[-.38,-.25,-.12],bR:[-.3,-.6,-.75],hL:[.4,-.25,-.1]}],
    [.42,{P:[0,.02,.02],H:[4,0,0],S:[0,0,0],FL:[.13,.01,7,0,32],FR:[-.13,-.01,-7,0,32],hR:[-.33,.05,.3],bR:[-.15,.2,1],hL:[.36,.05,.3]}],
    [.6,{P:[0,.36,0],FL:[.13,.04,7,.36,8],FR:[-.13,.0,-7,.34,8]}],[.76,{P:[0,.4,0],FL:[.13,.05,7,.42,4],FR:[-.13,.01,-7,.4,4]}],[.95,{P:[0,.0,0],FL:[.13,.01,7,0,18],FR:[-.13,-.01,-7,0,18],H:[6,0,0]}],
    [1.06,{P:[0,-.24,0],H:[14,0,0],S:[6,0,0],FL:[.13,.01,7,0,0],FR:[-.13,-.01,-7,0,0],hR:[-.36,-.2,.2],bR:[-.15,-.3,.95],hL:[.38,-.2,.2]}],[1.3,'ST']],'Dips, springs up with an arm swing, tucks and lands on the balls of the feet, about 0.4 m');
  /* ---- sword attacks: cuts along arcs (mcCut). dir(θ) = cosθ·A + sinθ·B in the body's frame; the blade points along dir(θ), the hand runs
     round the right shoulder at nearly full reach r (offset c), lead° ahead of the blade (a bent arm would bend the blade past the wrist), so arm and blade sweep round the body instead of
     cutting through "straight up"; θ, the torso turn (yaw) and lean (pit) ease from start to end; ex(s) adds steps, hips and the shield ---- */
  const nv=v=>{const l=Math.hypot(...v);return v.map(x=>x/l);},lr=(a,b,s)=>a.map((v,i)=>v+(b[i]-v)*s);
  const arcD=(A,B,th)=>{const c=Math.cos(th*MC_R),s=Math.sin(th*MC_R);return nv(A.map((a,i)=>a*c+B[i]*s));};
  const toCh=(v,yaw,pit)=>new THREE.Vector3(...v).applyQuaternion(new THREE.Quaternion().setFromEuler(new THREE.Euler(pit*MC_R,yaw*MC_R,0,'YXZ')).invert()).toArray();
  const mcCut=o=>{const ks=[],n=o.n||8,A=nv(o.A),B=nv(o.B),sg=Math.sign(o.th[1]-o.th[0]);
    for(let i=0;i<=n;i++){const u=i/n,s=u*u*(3-2*u),th=o.th[0]+(o.th[1]-o.th[0])*s,yaw=o.yaw[0]+(o.yaw[1]-o.yaw[0])*s,pit=o.pit[0]+(o.pit[1]-o.pit[0])*s;
      const dh=arcD(A,B,th+o.lead*sg),sh=new THREE.Vector3(-MCB.shX,MCB.shY,0).applyEuler(new THREE.Euler(pit*MC_R,yaw*MC_R,0,'YXZ')).toArray(),
        rr=o.r0!==undefined?o.r0+(o.r-o.r0)*Math.min(1,u*3):o.r,hb=sh.map((v,k)=>v+(o.c?o.c[k]:0)+rr*dh[k]);
      /* the blade leans towards the shoulder-to-hand line (al), so it never bends past the arm the way no wrist can */
      const arm=nv(hb.map((v,k)=>v-sh[k])),bd=arcD(A,B,th),al=o.al??.7;
      const k={H:[pit*.4,yaw*.45,0],S:[pit*.3,yaw*.25,0],C:[pit*.3,yaw*.3,o.roll||0],hR:toCh(hb,yaw,pit),bR:nv(bd.map((v,i)=>v+arm[i]*al)),eR:o.eR?(Array.isArray(o.eR[0])?lr(o.eR[0],o.eR[1],s):o.eR):[-.4,-1,-.3]};
      if(o.ex)Object.assign(k,o.ex(s));ks.push([o.t[0]+(o.t[1]-o.t[0])*u,k]);}return ks;};
  /* the cuts: forehand (right to left, slightly falling), backhand (left to right), overhead (straight down), heavy (diagonal down to the left) */
  const FH=(t0,t1,ex)=>mcCut({t:[t0,t1],A:[-1,.45,0],B:[0,-.14,1],th:[-85,110],lead:35,r:.56,al:.15,yaw:[-58,24],pit:[5,13],ex}),
    BH=(t0,t1,ex)=>mcCut({t:[t0,t1],A:[1,.7,0],B:[0,-.05,1],th:[-45,105],lead:35,c:[.05,-.08,.25],r:.56,al:.15,yaw:[22,-40],pit:[5,12],ex}),
    OH=(t0,t1,ex,e1,s1)=>mcCut({t:[t0,t1],A:[-.4,1,0],B:[.05,0,1],th:[s1||-55,e1||118],lead:35,c:[0,.04,.04],r:.56,al:.15,yaw:[-26,-12],pit:[-4,24],eR:[[-.5,.1,.9],[-.3,-1,-.3]],ex}),
    HV=(t0,t1,ex)=>mcCut({t:[t0,t1],A:[-.55,.85,0],B:[.15,-.1,1],th:[-66,130],lead:35,c:[0,.04,.06],r:.56,al:.15,yaw:[-60,14],pit:[-4,24],roll:-4,ex}),
    SHO={hL:[.3,-.06,.32],eL:[1,-.6,.1],sn:[.3,0,1]},SHW={hL:[.42,-.1,.14],eL:[1,-.4,-.3],sn:[.8,0,.55]},SHL={hL:[.6,-.2,.12],eL:[1,0,-.3],sn:[1,0,.15]},SHG={hL:[.12,-.04,.42],eL:[1,-.6,.1],sn:[-.12,0,1]};
  const sm=(a,b,s)=>{const k=Math.min(1,Math.max(0,(s-a)/(b-a)));return k*k*(3-2*k);},shB=(X,Y,s)=>({hL:lr(X.hL,Y.hL,s),eL:lr(X.eL||SHG.eL,Y.eL||SHG.eL,s),sn:lr(X.sn,Y.sn,s)});
  const step=(P0,P1,F0,F1,R0,R1)=>s=>Object.assign({P:lr(P0,P1,s),FL:lr(F0,F1,s)},R0?{FR:lr(R0,R1,s)}:{});
  const REC=(t,o)=>[t,Object.assign({P:[0,-.12,.02],H:[3,-13,0],S:[4,-7,0],C:[2,-9,0],hR:[-.26,-.08,.4],eR:[-.4,-1,-.4],bR:[-.15,.55,.82],hL:[.12,-.04,.42],eL:[1,-.6,.1],sn:[-.12,0,1]},o||{})];
  const FLs=[.15,.17,0,0,0],FRs=[-.17,-.2,-32,0,0];
  K('Attack 1',1.0,false,ST,[[0,{}],[.14,{hR:[-.48,.18,.24],bR:[-.4,.8,.2]}],...FH(.28,.52,s=>Object.assign(step([0,-.12,0],[0,-.16,.07],FLs,[.15,.27,0,0,0])(s),shB(SHO,SHW,sm(.3,.7,s)))),[.6,{}],REC(.8,{FL:[.15,.21,0,0,0]}),[1.0,'ST']],
    'Forehand slash: winds the sword back past the right shoulder and cuts round in front, right to left, with a step in',WAR);
  K('Attack 2',1.0,false,ST,[[0,{}],[.12,{hR:[-.1,.18,.52],bR:[.2,.7,.6]},],[.2,Object.assign({hR:[.12,.32,.48],bR:[.5,.75,.1]},shB(SHG,SHL,.6))],...BH(.28,.52,s=>Object.assign(step([0,-.11,0],[0,-.15,.06],FLs,[.15,.25,0,0,0])(s),SHL)),[.6,{}],REC(.8,{FL:[.15,.2,0,0,0]}),[1.0,'ST']],
    'Backhand slash: the sword goes up over the left shoulder and cuts round in front, left to right',WAR);
  K('Attack 3',1.05,false,ST,[[0,{}],...OH(.3,.54,s=>Object.assign(step([0,-.07,0],[0,-.21,.08],FLs,[.15,.28,0,0,0])(s),shB(SHO,SHW,sm(.4,1,s)))),[.62,{}],[.74,{hR:[-.36,.0,.42],bR:[-.35,.4,.85]}],REC(.88,{FL:[.15,.2,0,0,0]}),[1.05,'ST']],'Overhead chop: raises the sword behind his head and brings it straight down in front',WAR);
  K('Attack 4',.95,false,ST,[[0,{}],[.28,{P:[0,-.13,-.05],H:[3,-28,0],S:[4,-8,0],C:[2,-8,0],hR:[-.47,-.1,-.02],eR:[-.5,-.6,-1],bR:[-.3,.1,1]}],
    [.48,{P:[0,-.18,.14],H:[8,-14,0],S:[6,-4,0],C:[6,-4,0],FL:[.15,.38,0,0,0],FR:[-.17,-.2,-32,0,16],hR:[-.1,.06,.62],eR:[-.6,-1,-.15],bR:[0,-.02,1]}],
    [.62,{}],[.95,'ST']],'Lunging thrust',WAR);
  K('Combo',2.3,false,ST,[[0,{}],[.12,{hR:[-.48,.18,.24],bR:[-.4,.8,.2]}],...FH(.24,.47,s=>Object.assign(step([0,-.12,0],[0,-.16,.07],FLs,[.15,.27,0,0,0])(s),shB(SHO,SHW,sm(.3,.7,s)))),
    [.56,{hR:[.18,.12,.56],bR:[.6,.55,.55]}],...BH(.66,.86,s=>Object.assign(step([0,-.14,.08],[0,-.16,.14],[.15,.28,0,0,0],[.15,.36,0,0,0],FRs,[-.17,-.12,-32,0,0])(s),SHL)),
    [1.0,{hR:[-.48,.36,.32],bR:[-.4,.9,.1]}],...OH(1.12,1.34,s=>Object.assign(step([0,-.1,.14],[0,-.22,.24],[.15,.36,0,0,0],[.15,.48,0,0,0],[-.17,-.12,-32,0,0],[-.17,0,-32,0,0])(s),SHO),108,-38),[1.44,{}],[1.64,{hR:[-.3,.1,.45],bR:[-.2,.6,.8]}],
    REC(1.95,{P:[0,-.13,.08],FL:[.15,.24,0,0,0],FR:[-.17,-.16,-32,0,0]}),[2.3,'ST']],'Three cuts in a row: forehand, backhand, overhead, stepping in',WAR);
  {const hv=HV(.8,1.04,s=>Object.assign(step([.05,-.06,.22],[.08,-.28,.3],[.26,.4,8,.1,0],[.36,.56,14,0,0],[-.17,-.2,-32,0,18],[-.17,-.24,-32,0,22])(s),shB(SHO,SHW,sm(.2,.6,s))));
    K('Heavy attack',1.8,false,ST,[[0,{}],[.5,Object.assign({},hv[0][1],{P:[0,-.2,-.06],FL:FLs,FR:FRs,Hd:[0,-6,0]},SHO)],[.7,{P:[.04,-.04,.18],FL:[.24,.32,6,.16,0],FR:[-.17,-.2,-32,0,18],Hd:[0,0,0]}],...hv.slice(1),
      [1.18,{P:[.08,-.27,.3]}],[1.34,{P:[.05,-.22,.22],H:[8,-10,0],hR:[-.12,.06,.5],bR:[0,.4,.92]}],REC(1.52,{P:[0,-.18,.12],FL:[.15,.3,0,0,0]}),[1.8,'ST']],
      'Big wind-up over the right shoulder, a leap in and a diagonal cleave down to the left',WAR);}
  {const SP=Object.assign({},ST,{P:[0,-.16,0],H:[4,-14,0],S:[6,-7,0],C:[4,-4,0],hR:[-.6,.08,.3],eR:[-.3,-1,-.2],bR:[-.85,.05,.5],hL:[.32,-.06,.3],sn:[.6,0,.8]}),F=['P','H','S','C','hR','eR','bR','hL','sn'];
    const ss=k=>{k=Math.min(1,Math.max(0,k));return k*k*(3-2*k);};
    C.push(mcBake(R,'Spin attack',1.45,false,t=>{const p=Object.assign({},ST),a=ss(t/.25)*(1-ss((t-1.05)/.4)),u=Math.min(1,Math.max(0,(t-.25)/.8));
      for(const f of F)p[f]=ST[f].map((v,i)=>v+(SP[f][i]-v)*a);p.Y=-360*ss(u);
      const lf=Math.sin(Math.PI*u*4);p.FL=ST.FL.slice();p.FR=ST.FR.slice();p.FL[3]=Math.max(0,lf)*.06;p.FR[3]=Math.max(0,-lf)*.06;return p;},'Spins round once on the spot with the blade held out',WAR));}
  K('Shield bash',1.0,false,ST,[[0,{}],[.28,{P:[0,-.15,-.04],H:[2,-30,0],S:[2,-10,0],C:[0,-8,0],hL:[.2,-.06,.3],eL:[1,-.5,-.2]}],
    [.44,{P:[0,-.17,.2],H:[12,-14,0],S:[8,-4,0],C:[6,-4,0],FL:[.15,.42,0,0,0],FR:[-.17,-.14,-32,0,14],hL:[.1,.0,.6],eL:[1,-.5,.2],sn:[0,0,1]}],[.58,{}],[1.0,'ST']],'Steps in and drives the shield forward',WAR);
  K('Kick',1.0,false,ST,[[0,{}],[.25,{P:[0,-.12,.02],H:[-4,-12,0],FR:[-.12,.15,-12,.34,-10],kR:0}],[.42,{P:[0,-.08,-.02],H:[-14,-8,0],S:[-6,0,0],FR:[-.1,.58,-8,.5,-62]}],
    [.55,{}],[.75,{P:[0,-.12,0],H:[0,-16,0],S:[2,-4,0],FR:[-.15,-.05,-24,.16,0]}],[1.0,'ST']],'Front push kick with the rear leg',WAR);
  /* ---- defence ---- */
  const BLK={P:[0,-.14,0],H:[4,-18,0],C:[4,-10,0],hL:[.08,.12,.42],eL:[1,-.4,.1],sn:[-.1,.3,1],hR:[-.32,-.05,.32],bR:[-.2,.6,.75],Hd:[8,0,0]};
  K('Block',1.2,false,ST,[[0,{}],[.18,BLK],[.36,{P:[0,-.18,-.08],H:[0,-18,0],C:[0,-10,0],hL:[.08,.1,.36]}],[.6,BLK],[1.2,'ST']],'Shield up over the face, takes the blow and pushes back',WAR);
  K('Blocking (hold)',2,true,Object.assign({},ST,BLK),[[0,{}],[1,{P:[0,-.15,0],hL:[.08,.115,.41]}],[2,'ST']],'Holds the shield up over the face');
  /* ---- spells (gestures; the effects are added separately) ---- */
  const UP={P:[0,-.06,0],H:[0,-12,0],S:[-2,-2,0],C:[-4,0,0],hR:[-.22,.72,.16],eR:[-.8,.1,.6],bR:[0,1,.08],hL:[.34,-.12,.3],eL:[1,-.2,-.3],sn:[.9,0,.45],Hd:[-12,0,0]};
  const RISE={hR:[-.34,.24,.42],bR:[0,.85,.5],H:[1,-12,0],C:[-1,-4,0]};
  K('Cast spell 1',2.4,false,ST,[[0,{}],[.22,RISE],[.45,UP],[1.5,{hR:[-.22,.74,.17],Hd:[-14,0,0]}],[1.75,{P:[0,-.14,.06],H:[6,-14,0],S:[4,0,0],C:[4,0,0],FL:[.15,.24,0,0,0],hR:[-.12,.18,.6],eR:[-.6,-1,-.2],bR:[0,.05,1],Hd:[0,0,0]}],
    [2.0,{}],[2.4,'ST']],'Raises the sword straight up overhead, gathers power, then points it at the target',WAR);
  K('Cast spell 2',1.3,false,ST,[[0,{}],[.25,{P:[0,-.13,-.03],H:[3,-28,0],C:[2,-10,0],hR:[-.34,.12,.08],bR:[-.05,.45,.9]}],[.45,{P:[0,-.15,.08],H:[5,-8,0],S:[4,0,0],C:[4,2,0],FL:[.15,.24,0,0,0],hR:[-.12,.14,.6],eR:[-.6,-1,-.2],bR:[0,.05,1]}],
    [.75,{}],[1.3,'ST']],'Quick cast: thrusts the sword point at the target',WAR);
  K('Cast spell 3',2.4,false,ST,[[0,{}],[.24,{hR:[-.22,-.02,.48],bR:[-.05,.8,.6]}],[.5,{P:[0,-.04,0],H:[0,-6,0],S:[2,0,0],C:[0,0,0],hR:[-.07,.12,.43],eR:[-1,-.6,0],bR:[0,1,.1],hL:[.3,-.16,.24],eL:[1,-.2,-.4],sn:[.9,0,.45],Hd:[14,0,0]}],
    [1.3,{hR:[-.07,.13,.44],Hd:[16,0,0]}],[1.6,{P:[0,-.02,0],H:[-2,-6,0],C:[-6,0,0],hR:[-.22,.7,.2],eR:[-.8,.1,.6],bR:[-.05,1,.05],Hd:[-14,0,0]}],[1.9,{}],[2.4,'ST']],
    'Holds the sword upright before his face, head bowed, then thrusts it up to the sky: a blessing on himself',WAR);
  /* with a weapon longer than the arming sword (or curved) he crouches less deep as he drives it down, so its point stops at the ground (gear kit weapons) */
  let reach=0;if(R.j.mc_sword)R.j.mc_sword.traverse(q=>{const g=q.isMesh&&q.geometry.parameters;if(g&&g.width!==undefined)reach=Math.max(reach,Math.hypot(Math.abs(q.position.z)+g.depth/2,Math.abs(q.position.y)+g.height/2));});
  const dy=['sword','falchion','mace','axe','none'].includes(w)?0:Math.max(0,reach-.75);
  K('Cast spell 4',2.6,false,ST,[[0,{}],[.22,RISE],[.45,UP],[.62,{P:[0,-.2,.03],H:[10,-14,0],S:[6,0,0],hR:[-.16,.2,.5],eR:[-.6,-1,-.2],bR:[0,.1,1]}],
    [.8,{P:[0,-.42+dy,.06],H:[22,-14,0],S:[14,0,0],C:[10,0,0],FL:[.15,.24,0,0,0],FR:[-.17,-.22,-32,0,24],hR:[-.12,-.24,.56],eR:[-.6,-1,-.2],bR:[0,-1,.12],hL:[.5,.04,.2],eL:[1,-.2,-.3],sn:[1,0,.25],Hd:[6,0,0]}],
    [1.6,{P:[0,-.42+dy,.06]}],[1.92,{P:[0,-.3+dy*.5,.05],hR:[-.3,-.02,.44],bR:[-.1,.2,1]}],[2.25,{P:[0,-.14,.02],H:[4,-14,0],S:[4,-7,0],C:[2,-9,0],FR:[-.17,-.2,-32,0,0],FL:[.15,.2,0,0,0],hR:[-.3,-.16,.32],eR:[-.4,-1,-.4],bR:[-.15,.55,.82],sn:[-.12,0,1],Hd:[0,0,0]}],[2.6,'ST']],
    'Raises the sword and drives it point down to the ground in a deep crouch: a spell on the ground around him',WAR);
  K('Channel spell',2,true,Object.assign({},ST,UP,{P:[0,-.07,0]}),[[0,{}],[1,{P:[0,-.08,0],hR:[-.23,.7,.18],C:[-3,0,0]}],[2,'ST']],'Holds the sword up overhead while a spell is kept going');
  /* ---- reactions ---- */
  K('Hit 1',.7,false,ST,[[0,{}],[.12,{P:[0,-.12,-.08],H:[-6,-14,0],S:[-6,-7,0],C:[-10,-9,0],hR:[-.38,-.05,.22],hL:[.18,.02,.34],Hd:[-10,0,0]}],[.3,{P:[0,-.13,-.06],H:[-3,-14,0],C:[-5,-9,0]}],[.7,'ST']],'Blow to the chest, rocks back',WAR);
  K('Hit 2',.75,false,ST,[[0,{}],[.13,{P:[-.06,-.13,0],H:[2,-28,-6],S:[2,-12,-6],C:[2,-12,-8],hL:[.26,-.1,.32],Hd:[0,-12,-8]}],[.32,{P:[-.04,-.12,0],H:[2,-22,-3]}],[.75,'ST']],'Blow from the left, twists away',WAR);
  K('Heavy hit',1.6,false,ST,[[0,{}],[.14,{P:[0,-.14,-.12],H:[-12,-14,0],S:[-8,-7,0],C:[-12,-9,0],hR:[-.42,0,.16],hL:[.34,.0,.26],Hd:[-14,0,0]}],
    [.36,{P:[0,-.16,-.42],H:[-6,-14,0],FR:[-.17,-.64,-32,0,0],FL:[.15,-.06,0,.1,0]}],[.58,{P:[0,-.2,-.58],H:[4,-14,0],S:[4,-7,0],C:[4,-9,0],FL:[.15,-.4,0,0,0],Hd:[0,0,0]}],
    [.9,{P:[0,-.15,-.5]}],[1.2,{P:[0,-.12,-.22],FL:[.15,-.04,0,.07,0],FR:[-.17,-.44,-32,0,0]}],[1.6,'ST']],'Knocked back two steps, then steps in again',WAR);
  K('Taunt',2.4,false,ST,[[0,{}],[.3,{H:[2,-18,0],C:[0,-8,0],hR:[-.03,.08,.49],eR:[-.6,-1,-.1],bR:[-.05,1,.15],hL:[.16,-.02,.42],sn:[-.1,0,1]}],[.45,{hR:[.03,.06,.61]}],[.6,{hR:[-.03,.1,.52]}],[.75,{hR:[.03,.06,.61]}],
    [.95,{hR:[-.03,.1,.49]}],[1.12,{hR:[-.3,.08,.46],H:[0,-14,0]}],[1.35,{P:[0,-.06,0],H:[-2,-12,0],C:[-8,-4,0],hR:[-.58,.06,.12],eR:[-.3,-1,-.5],bR:[-.5,.35,.8],hL:[.58,.02,.12],eL:[.3,-1,-.5],sn:[1,0,.25],Hd:[-12,0,0]}],[1.85,{}],[2.4,'ST']],
    'Bangs the sword hilt on the shield twice, then spreads his arms',WAR);
  K('Victory',2.6,false,ST,[[0,{}],[.5,{P:[0,-.03,0],H:[0,-10,0],S:[-2,0,0],C:[-6,4,0],hR:[-.16,.76,.16],eR:[-.8,.1,.6],bR:[.05,1,-.05],hL:[.5,-.16,.2],eL:[.5,-1,-.5],sn:[1,0,.3],Hd:[-16,0,0],FL:[.15,.12,0,0,0]}],
    [1.9,{hR:[-.17,.76,.15],Hd:[-18,4,0]}],[2.6,'ST']],'Raises the sword high and looks up: the fight is won',WAR);
  /* ---- weapon away: sheathe and draw (the weapon blends between the fist and its holder, ws), idle and walk with it sheathed,
     pick up and interact with the free right hand ---- */
  const armed=w!=='none',down=w==='sword'||w==='falchion',SB=Object.assign({},ST0,{ws:armed?1:0,fr:1,hR:[-.35,-.34,.08],eR:[-.35,0,-1],hL:[.44,-.3,.26],eL:[.6,.1,-1]}),
    AWAY={next:armed?'Idle (weapon sheathed)':'Idle'},REACH={ht:0,FL:[.24,.08,12,0,0],P:[-.03,-.06,0],H:[0,10,0],S:[2,9,0],C:[5,9,0],hR:[.17,-.13,.25],eR:[-.5,-.5,1],bR:[0,-1,0],hL:[.5,-.12,.3],eL:[1,-.2,-.3],sn:[1,0,.3]};
  if(armed){
    /* where the hand must be to hold the weapon as it sits in its holder (gr) and a blade length up the holder's axis (pre: the tip at the mouth), in the chest's frame
       of the reaching pose; the weapon only blends (ws) over the last few centimetres */
    const V3=THREE.Vector3,Q=THREE.Quaternion,RP=Object.assign({},ST,REACH,{ws:0,fr:0});R.prevScab=undefined;mcSolve(R,RP);
    const hb=R.j.mc_scab,st=hb.userData.stow,Hm=hb.matrixWorld.clone().multiply(new THREE.Matrix4().compose(new V3(...st.p),new Q().setFromEuler(new THREE.Euler(...st.r)),new V3(1,1,1))),gp=new V3(),gq=new Q();Hm.decompose(gp,gq,new V3());
    const wrist=gp.clone().sub(new V3(0,-MCB.grip,0).applyQuaternion(gq)),axis=new V3(0,1,0).transformDirection(hb.matrixWorld),bl=new V3(0,0,1).applyQuaternion(gq);
    const toC=v=>R.j.chest.worldToLocal(v.clone()).toArray(),GR={hR:toC(wrist),bR:bl.toArray()},PRE={hR:toC(wrist.clone().addScaledVector(axis,hb.userData.reach*.5)),bR:bl.toArray()},MID={hR:toC(wrist.clone().addScaledVector(axis,hb.userData.reach*.5)),bR:bl.toArray()};if(globalThis.MCG)console.log("grip",gp.toArray().map(v=>v.toFixed(2)),"wrist",wrist.toArray().map(v=>v.toFixed(2)),"GR",GR.hR.map(v=>v.toFixed(2)),"PRE",PRE.hR.map(v=>v.toFixed(2)),"chest",R.j.chest.getWorldPosition(new V3()).toArray().map(v=>v.toFixed(2)),"ua",R.j.upperArm_R.getWorldPosition(new V3()).toArray().map(v=>v.toFixed(2)));
    K('Sheathe',1.7,false,ST,[[0,{}],[.2,{hR:[-.05,.05,.5],bR:[0,.5,.85],H:[2,0,0],S:[3,4,0],C:[3,4,0],hL:[.5,-.12,.3],eL:[1,-.2,-.3],sn:[1,0,.3]}],[.32,{hR:[-.02,0,.52],bR:[-.25,.1,.96]}],[.56,Object.assign({ws:0,fr:0},REACH,PRE)],[.7,Object.assign({ws:.35},MID)],[.84,Object.assign({ws:1},GR)],[1.02,{fr:1,ht:0,hR:[-.05,-.14,.46],eR:[-.6,-.6,-.4],H:[0,4,0],S:[2,3,0],C:[0,2,0]}],[1.16,{hR:[-.24,-.24,.36],FL:SB.FL,P:SB.P}],[1.36,{hR:[-.34,-.3,.14],eR:[-.6,-.1,-1]}],[1.7,Object.assign({},SB)]],
      down?'Puts the blade away in the scabbard on the left hip':'Hangs the weapon head down in the belt loop on the left hip',AWAY);
    K('Idle (weapon sheathed)',4,true,SB,[[0,{}],[1,{C:[-2.5,0,0],P:[.012,-.02,0]}],[2,{C:[-1,1,0],P:[.018,-.016,0],Hd:[0,4,0]}],[3,{C:[-2.5,0,0],P:[.006,-.02,0],Hd:[0,-3,0]}],[4,'ST']],'Relaxed, the weapon on the hip');
    G('Walk (weapon sheathed)',SB,{dur:1.05,speed:1.2,beta:.62,lift:.09,heel:14,toe:24,bob:.018,sway:.022,yaw:5,arm:.1},'Walking with the weapon on the hip, about 1.2 m/s');
    K('Draw',1.65,false,SB,[[0,{}],[.12,{hR:[-.12,-.14,.5],fr:.7,H:[0,4,0],S:[2,3,0],C:[2,3,0]}],[.22,{hR:[.06,-.08,.52],fr:.4,H:[0,8,0],S:[2,7,0],C:[4,7,0],FL:[.24,.08,12,0,0],P:[-.03,-.06,0]}],[.3,Object.assign({ws:1,fr:0},REACH,GR)],[.46,Object.assign({ws:.65},MID)],[.62,Object.assign({ws:0},PRE)],[.86,{hR:[.05,.02,.5],bR:[.3,.1,.95]}],[1.02,{ht:0,hR:[-.02,.08,.5],bR:[-.05,.35,.95],H:[1,2,0],S:[3,2,0],C:[2,0,0]}],[1.22,{hR:[-.16,.12,.45],bR:[-.2,.7,.6],H:[2,-6,0],S:[3,-4,0],C:[2,-4,0],P:[0,-.08,0]}],[1.65,Object.assign({},ST)]],
      'Draws the weapon from the hip into the guard',{next:'Idle (war mode)'});}
  {/* pick up: hips hinge and knees bend; the hand targets are world points (the right fist on the ground in front of the feet, the shield hand out by the left knee) turned into the chest's frame of the bent pose */
    const PK=Object.assign({},SB,{ht:45,P:[0,-.4,.02],H:[40,0,0],S:[14,0,0],C:[8,0,0],kL:3,kR:3,FL:[.2,.02,5,0,0],FR:[-.2,-.02,-5,0,0],Hd:[10,0,0]});R.prevScab=undefined;mcSolve(R,Object.assign({},PK));
    const wc=v=>R.j.chest.worldToLocal(new THREE.Vector3(...v)).toArray(),pk={hR:wc([-.1,.1,.52]),eR:[-.6,-.2,-1],hL:wc([.56,.86,.24]),eL:[1,0,-.3],sn:[1,0,.1]},pk2=Object.assign({},pk);
  K('Pick up',1.7,false,SB,[[0,{}],[.22,{FL:PK.FL,FR:PK.FR}],[.6,Object.assign({},PK,pk)],[.88,pk2],[1.04,{P:[0,-.3,.02],H:[24,0,0],hR:wc([-.08,.45,.56])}],[1.25,{P:[0,-.14,0],H:[6,0,0],S:[3,0,0],C:[0,0,0],kL:0,kR:0,hR:[-.18,-.15,.4],Hd:[6,0,0]}],[1.5,{FL:SB.FL,FR:SB.FR,ht:0,hL:SB.hL,eL:SB.eL,sn:SB.sn}],[1.7,'ST']],'Crouches and picks something up with the free right hand',AWAY);}
  K('Interact',1.3,false,SB,[[0,{}],[.35,{P:[0,-.03,.04],H:[3,0,0],hR:[-.18,.12,.56],eR:[-.4,-1,-.2]}],[.55,{P:[0,-.04,.09],hR:[-.17,.12,.6]}],[.8,{P:[0,-.03,.03],hR:[-.2,.1,.5]}],[1.3,'ST']],
    'Reaches out and pushes: a door, a lever, a chest',AWAY);
  /* ---- turn on the spot in the guard, 90 degrees, stepping one foot then the other (clip.turn: the root turns in a game) ---- */
  for(const[name,sg]of[['Turn left (war mode)',1],['Turn right (war mode)',-1]]){const ss=k=>{k=Math.min(1,Math.max(0,k));return k*k*(3-2*k);};
    C.push(mcBake(R,name,.8,false,t=>{const p=JSON.parse(JSON.stringify(ST)),u=t/.8,Y=90*sg*ss(u);p.Y=Y;
      for(const[sd,a0,a1]of(sg>0?[['L',.05,.5],['R',.45,.95]]:[['R',.05,.5],['L',.45,.95]])){const F=ST['F'+sd],k=ss((u-a0)/(a1-a0)),a=90*sg*k,c=Math.cos((a-Y)*MC_R),sn=Math.sin((a-Y)*MC_R);
        const piv=(Y-a)*.55*(k<1?1:0)*(k>0?1-k:1),yw=F[2]*(1-.55*Math.sin(Math.PI*u))+a-Y+piv;
        p['F'+sd]=[F[0]*c+F[1]*sn,-F[0]*sn+F[1]*c,yw,.07*Math.sin(Math.PI*k),0];}
      p.P[1]-=.02*Math.sin(Math.PI*u*2);return p;},sg>0?'Turns 90 degrees to the left on the spot, behind the shield':'Turns 90 degrees to the right on the spot, behind the shield',{next:'Idle (war mode)',turn:90*sg}));}
  return MC_CLIPS[ck]=C;}
/* the Roll and Death are baked on a rig wearing the same helmet, armour, shoulders, belt, hairstyle and cape, so he rolls over and lies on what he wears (a great helm or coif is bulkier) */
const MC_DEATH={};
function mcDeath(w,s,h,a,hs,cp,sh,bl){cp=cp||'none';sh=sh||'armor';bl=bl||'plain';const ck=[w,s,h,a,hs,cp,sh,bl].join('|');if(MC_DEATH[ck])return MC_DEATH[ck];const ST=MC_ST,C=[],WAR={next:'Idle (war mode)'};
  const k=ck;if(!MC_RIGS[k]){const m=buildMercenary({weapon:w,shield:s,helmet:h,armor:a,hairStyle:hs,cape:cp,shoulders:sh,belt:bl,noClips:true}),j={};m.traverse(q=>{if(q.name&&!j[q.name])j[q.name]=q;});
    MC_RIGS[k]={m,j,lOff:mcRig(w,s).lOff};}
  const R=MC_RIGS[k],K=(name,dur,loop,base,keys,note,ex)=>C.push(mcBake(R,name,dur,loop,mcKeys(base,keys),note,ex));
  /* ---- forward roll: the body keeps touching the ground (gc 2), the shield rides on the chest (sc), the blade points out to the side so it
     never digs in; ends 1.4 m further on (clip.move) ---- */
  K('Roll',1.4,false,ST,[[0,{}],[.14,{gc:1,P:[0,-.3,.12],H:[30,-14,0],S:[12,-4,0],C:[10,-4,0],hc:.3,FL:[.15,.3,0,0,0],hR:[-.44,-.18,.1],eR:[-.4,-1,-.2],bR:[-1,0,.05],hL:[.5,-.12,.32],eL:[1,-.2,-.3],sn:[1,0,.25]}],
    [.26,{fk:1,gc:2,hc:0,H:[95,-14,0],S:[25,0,0],C:[20,0,0],N:[20,0,0],Hd:[25,0,0],P:[0,-.55,.5],LL:[-110,10,130,30],LR:[-110,10,130,30],sc:1}],
    [.5,{H:[200,-14,0],P:[0,-.6,.85]}],[.72,{H:[300,-14,0],P:[0,-.55,1.15],LL:[-100,10,125,20],LR:[-100,10,125,20]}],
    [.92,{H:[352,-14,0],P:[0,-.45,1.3],FL:[.15,1.5,0,0,0],FR:[-.17,1.2,-32,0,0],S:[14,-4,0],C:[10,-4,0],LL:[-75,8,110,10],LR:[-75,8,110,10]}],
    [1.05,{H:[360,-14,0],fk:0,gc:1,P:[0,-.3,1.36],FL:[.15,1.57,0,0,0],S:[10,-4,0],C:[8,-4,0],N:[0,0,0],Hd:[5,0,0],hc:.6,sc:0}],
    [1.4,Object.assign({},ST,{P:[0,-.1,1.4],H:[363,-14,0],FL:[.15,1.57,0,0,0],FR:[-.17,1.2,-32,0,0]})]],'Forward roll behind the shield, coming up 1.4 m further on in the guard',{next:'Idle (war mode)',move:[0,1.4],capeFree:[.18,1.05]});
  /* ---- death: staggers back, the knees go, falls on his back; sword and shield drop to the ground ---- */
  const DL={fk:1,hc:0,gc:1,P:[0,-.93,-.55],H:[-90,-8,0],S:[0,0,0],C:[-3,0,0],N:[14,0,0],Hd:[10,10,0],LL:[-4,7,4,22],LR:[-6,9,8,18],hR:[-.84,.1,-.03],eR:[0,-1,0],bR:[-.4,.1,-.9],hL:[.84,.12,-.03],eL:[0,-1,0],fr:1};
  K('Death',2.6,false,ST,[[0,{}],[.28,{P:[0,-.14,-.1],H:[-10,-14,0],S:[-8,-7,0],C:[-12,-9,0],hR:[-.42,-.05,.16],hL:[.46,-.02,.3],Hd:[-14,0,0]}],
    [.75,{P:[0,-.42,-.18],H:[0,-12,0],S:[4,-2,0],C:[6,0,0],hR:[-.42,-.28,.16],bR:[-.65,-.55,.35],hL:[.42,-.28,.2],sn:[1,0,.3],Hd:[8,0,0],hc:.5,fr:0,eR:[-.4,0,-1]}],[.95,{fr:1}],
    [1.15,{fk:.75,hc:0,gc:1,P:[0,-.74,-.34],H:[-40,-10,0],S:[-6,0,0],C:[-8,0,0],LL:[-70,8,95,10],LR:[-62,10,88,8],hR:[-.5,-.1,.16],hL:[.5,-.1,.16],eL:[.5,-1,0],Hd:[10,0,0]}],
    [1.55,Object.assign({},DL,{H:[-82,-8,0],Hd:[14,8,0],LL:[-30,7,40,20],LR:[-24,9,34,16]})],[1.85,DL],[2.6,DL]],'Staggers back, the knees give way and he falls on his back; sword and shield drop to the ground',
    {fps:60,capeFree:1.4,drops:[{obj:'mc_sword',t:.72,d:.42,at:[-.95,.1,30]},{obj:'mc_shield',t:1.0,d:.45,at:[.78,.05,-14]}]});
  return MC_DEATH[ck]=C;}

FOLDERS['characters'].children.push('characters/players');FOLDERS['characters/players']={name:'Player characters',blurb:'Playable heroes with customisable looks and gear',children:[]};
const MC_CH=t=>Object.entries(t).map(([k,v])=>[k,Array.isArray(v)?v[1]:v]);
function mcOpts(){return [{key:'skin',label:'Skin',choices:MC_CH(MC_SKIN),def:'light'},{key:'face',label:'Face',choices:MC_CH(MC_LOOK.face),def:'square'},{key:'eyes',label:'Eyes',choices:MC_CH(MC_EYE),def:'brown'},
    {key:'hair',label:'Hair colour',choices:MC_CH(MC_HAIR),def:'brown'},{key:'hairStyle',label:'Hairstyle',choices:MC_CH(MC_LOOK.hairStyle),def:'short'},
    {key:'beard',label:'Facial hair',choices:MC_CH(MC_LOOK.beard),def:'short'},{key:'scar',label:'Scar',choices:MC_CH(MC_LOOK.scar),def:'none'},
    {key:'weapon',label:'Weapon',choices:MC_CH(MC_SLOTS.weapon),def:'sword'},{key:'shield',label:'Shield',choices:MC_CH(MC_SLOTS.shield),def:'heater'},{key:'shieldCol',label:'Shield colour',choices:MC_CH(MC_SHCOL),def:'red'},
    {key:'helmet',label:'Helmet',choices:MC_CH(MC_SLOTS.helmet),def:'none'},{key:'armor',label:'Armour',choices:MC_CH(MC_SLOTS.armor),def:'mail'},
    {key:'gloves',label:'Gloves',choices:MC_CH(MC_SLOTS.gloves),def:'leather'},{key:'boots',label:'Boots',choices:MC_CH(MC_SLOTS.boots),def:'leather'},
    {key:'pants',label:'Pants',choices:MC_CH(MC_SLOTS.pants),def:'wool'},{key:'cape',label:'Cape',choices:MC_CH(MC_SLOTS.cape),def:'none'},{key:'cloth',label:'Cloth colour',choices:MC_CH(MC_CLOTH),def:'natural'}];}
ASSETS.push({id:'mercenary',folder:'characters/players',name:'Mercenary',kind:'character',groundR:2.2,build:(sd,o)=>buildMercenary(o||{}),
  opts:mcOpts(),
  desc:'Mercenary: the first player character, a powerful fighter with a one-handed weapon and a shield, about 1.97 m tall, built from scratch. Looks: skin (pale, light, tan, dark, black), face (square jaw, broad, lean, weathered), eyes (green, blue, brown), hair colour (white, red, brown, black, blonde, gray), hairstyle (short, long, tied back, buzz cut, bald), facial hair (short beard, full beard, stubble, moustache, goatee, clean-shaven) and a scar. Every gear slot can be changed: weapon (arming sword with a scabbard on the hip, falchion, flanged mace, bearded axe, none), shield (heater, round, kite, buckler, none) and its colour, helmet (none, nasal helm, mail coif, kettle hat, great helm), armour (mail hauberk, half plate, studded leather, gambeson, linen shirt), gloves, boots, pants, a cape and the cloth colour. 43 clips with a weapon: Idle, Walk, Run, war-mode Idle and Walk, Walk back, Strafe left and right, Dodge left, right and back, Jump, Attack 1 (forehand), Attack 2 (backhand), Attack 3 (overhead), Attack 4 (thrust), Combo, Heavy attack, Spin attack, Shield bash, Kick, Block, Blocking (hold), Cast spell 1 to 4, Channel spell, Hit 1, Hit 2, Heavy hit, Taunt, Victory, Death (weapon and shield drop), Sheathe, Idle and Walk with the weapon sheathed, Draw, Pick up, Interact, Turn left and right, and a forward Roll.'});
