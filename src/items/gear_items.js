/* ======================= GEAR KIT, part 1: the wearable pieces (docs/GEAR.md) =======================
   Every piece is a builder in MC_GEAR[slot][key] (mercenary.js), so the Mercenary wears it and gear_ground.js lays the very same boxes on the
   ground. Builders get the joints J (rest pose) and the materials M; armour pieces and shields get the armour metal, the weapon its own
   metal (mcMetal). Frames as in mercenary.js: weapons grip on the origin, business end +z, edge at -y (knuckles); shields in the mc_shield
   frame (face +z, top +y). No crosses: helmet slits are horizontal, emblems are diamonds, spikes come in threes and sixes. */

/* ---------- metals: [mid, dark, light, highlight] replacing iron, ironD, steel, steelL (and the mail rings) ---------- */
const MC_METAL={steel:['Steel',null],dark:['Black iron',[PAL.blackIron[2],PAL.blackIron[1],PAL.blackIron[3],PAL.blackIron[4]]],
  bronze:['Bronze',[PAL.bronze[1],PAL.bronze[0],PAL.bronze[2],PAL.bronze[3]]],gold:['Gold',[PAL.gold[1],PAL.gold[0],PAL.gold[2],PAL.gold[4]]],
  silver:['Silver',[PAL.silver[1],PAL.silver[0],PAL.silver[2],PAL.silver[3]]],mithril:['Mithril',['#8fa3b3','#5d6c7a','#b2c3cf','#c3cfd8']],
  obsidian:['Obsidian',['#3a3340','#241f29','#57505e','#8a8292']],bone:['Bone',[PAL.bone[1],PAL.bone[0],PAL.bone[3],PAL.bone[4]],'plain']};
function mcMetal(M,k){const m=MC_METAL[k];if(!m||!m[1])return M;const c=m[1],X=Object.assign({},M),mt=h=>m[2]?bm(h,m[2]):mcMat(h,'steel');
  X.iron=mt(c[0]);X.ironD=mt(c[1]);X.steel=mt(c[2]);X.steelL=mt(c[3]);X.mail=m[2]?bm(c[0],'leather'):mcMat(c[0],'mail');return X;}

/* ---------- own textures and materials ---------- */
const GIT={};
function giTex(kind){if(GIT[kind])return GIT[kind];const N=16,c=document.createElement('canvas');c.width=c.height=N;const g=c.getContext('2d'),r=mulberry32(hashStr('gi'+kind));
  for(let y=0;y<N;y++)for(let x=0;x<N;x++){let v=.9+.1*r();
    if(kind==='scale'){const row=y>>2,xx=(x+(row%2)*2)%4,yy=y%4;v=yy===3||xx===0?.62:.82+.06*(3-yy)+.04*r();}
    if(kind==='lamellar')v=x%3===0?.62:y%5===2?.7:.86+.08*r();
    if(kind==='fur')v=(x+(y>>1))%3===0?.7:.86+.14*r();
    const b=Math.round(Math.min(1,v)*255);g.fillStyle=`rgb(${b},${b},${b})`;g.fillRect(x,y,1,1);}
  const t=new THREE.CanvasTexture(c);t.magFilter=THREE.NearestFilter;t.minFilter=THREE.NearestFilter;t.generateMipmaps=false;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.encoding=THREE.sRGBEncoding;return GIT[kind]=t;}
const GIM={};
function giMat(hex,kind,metal){const k=hex+kind+metal;if(GIM[k])return GIM[k];
  return GIM[k]=new THREE.MeshStandardMaterial({map:giTex(kind),color:new THREE.Color(hex).convertSRGBToLinear(),roughness:metal?.55:.92,metalness:metal?.4:0});}
/* shared materials of the kit; the cloth follows the Cloth colour option (Natural gives each piece its own undyed colour) */
const GI={fur:()=>giMat('#5e4a39','fur'),furL:()=>giMat('#8a7660','fur'),ermine:()=>giMat(PAL.bone[4],'fur'),gold:()=>mcMat(PAL.gold[2],'steel'),goldD:()=>mcMat(PAL.gold[1],'steel'),
  bone:()=>bm(PAL.bone[3],'plain'),dark:()=>bm('#16120e','plain'),rope:()=>bm('#8a7556','straw'),
  cloth:(M,def)=>bm(MC_CLOTH[M.sel.cloth][0]||def),clothD:(M,def)=>bm(mcShade(MC_CLOTH[M.sel.cloth][0]||def,.75)),
  glass:()=>GIM.glass||(GIM.glass=new THREE.MeshStandardMaterial({color:new THREE.Color('#bccbd1').convertSRGBToLinear(),roughness:.15,metalness:.1,transparent:true,opacity:.42,depthWrite:false})),
  glow:hex=>spM(hex,'glow')};
/* a box whose +z axis points along d (spikes, studs) */
function giSpike(par,w,l,mat,x,y,z,d){const m=bx(par,w,w,l,mat,x,y,z);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1),new THREE.Vector3(...d).normalize());return m;}
function giSpikeT(par,w,l,mat,x,y,z,d){const n=new THREE.Vector3(...d).normalize();giSpike(par,w,l*.6,mat,x+n.x*l*.3,y+n.y*l*.3,z+n.z*l*.3,d);giSpike(par,w*.55,l*.45,mat,x+n.x*l*.78,y+n.y*l*.78,z+n.z*l*.78,d);}

/* ======================= weapons ======================= */
function giGrip(g,M,len,z,mat){bx(g,.034,.034,len,mat||M.leatherD,0,0,z);for(let k=z-len/2+.03;k<z+len/2-.01;k+=.045)bx(g,.038,.038,.012,M.leather,0,0,k);}
Object.assign(MC_GEAR.weapon,{
  /* longsword: long grip, wide guard, wheel pommel, a blade 0.84 m with a fuller */
  longsword:(J,M)=>{const g=mcWg(J);giGrip(g,M,.22,-.03);bx(g,.03,.26,.03,M.ironD,0,0,.095);for(const s of[1,-1])bx(g,.036,.03,.045,M.ironD,0,s*.13,.1);
    bx(g,.04,.065,.065,M.brass,0,0,-.17);bx(g,.046,.03,.03,M.brass,0,0,-.17);
    bx(g,.018,.05,.84,M.steel,0,0,.53);bx(g,.022,.012,.7,M.ironD,0,0,.47);bx(g,.018,.032,.05,M.steel,0,0,.975);bx(g,.016,.014,.035,M.steel,0,0,1.012);mcScabbard(J,M,.045,.06,.9);return g;},
  /* broadsword: wide blade, down-swept quillons, round pommel */
  broadsword:(J,M)=>{const g=mcWg(J);giGrip(g,M,.12,0);bx(g,.032,.22,.032,M.ironD,0,0,.075);for(const s of[1,-1])bx(g,.032,.03,.06,M.ironD,0,s*.1,.11);bx(g,.058,.058,.045,M.brass,0,0,-.085);
    bx(g,.02,.075,.62,M.steel,0,0,.41);bx(g,.024,.018,.5,M.ironD,0,0,.36);bx(g,.02,.05,.05,M.steel,0,0,.745);bx(g,.018,.024,.04,M.steel,0,0,.79);mcScabbard(J,M,.045,.09,.74);return g;},
  /* scimitar: the blade curves back towards the spine (+y) and widens before the point */
  scimitar:(J,M)=>{const g=mcWg(J);giGrip(g,M,.12,0);bx(g,.03,.12,.03,M.brass,0,0,.07);bx(g,.042,.055,.05,M.brass,0,-.01,-.08);
    const yz=z=>.16*((z-.09)/.66)**2;let z0=.09;for(const[z1,h]of[[.22,.05],[.35,.054],[.47,.06],[.58,.066],[.67,.068],[.74,.05]]){const zm=(z0+z1)/2,a=Math.atan((yz(z1)-yz(z0))/(z1-z0));
      bx(g,.018,h,(z1-z0)/Math.cos(a)+.01,M.steel,0,yz(zm)-.004,zm,-a);bx(g,.02,.01,(z1-z0)/Math.cos(a),M.ironD,0,yz(zm)+h/2-.012,zm,-a);z0=z1;}
    bx(g,.016,.026,.045,M.steel,0,yz(.765)+.006,.765,-.4);mcScabbard(J,M,.045,.1,.76);return g;},
  /* short sword: broad leaf blade, wooden grip, ball pommel */
  shortsword:(J,M)=>{const g=mcWg(J);bx(g,.036,.036,.11,M.wood,0,0,0);for(const k of[-.03,0,.03])bx(g,.04,.04,.01,M.woodD||M.leatherD,0,0,k);bx(g,.045,.09,.035,M.brass,0,0,.07);bx(g,.06,.06,.05,M.brass,0,0,-.08);
    bx(g,.018,.06,.4,M.steel,0,0,.29);bx(g,.02,.066,.14,M.steel,0,0,.38);bx(g,.022,.012,.34,M.ironD,0,0,.27);bx(g,.018,.04,.05,M.steel,0,0,.515);bx(g,.016,.018,.04,M.steel,0,0,.555);mcScabbard(J,M,.045,.08,.54);return g;},
  /* dagger: a long fighting knife */
  dagger:(J,M)=>{const g=mcWg(J);giGrip(g,M,.1,0);bx(g,.03,.13,.025,M.ironD,0,0,.06);bx(g,.05,.05,.025,M.ironD,0,0,-.065);
    bx(g,.016,.04,.26,M.steel,0,0,.2);bx(g,.019,.01,.22,M.ironD,0,0,.18);bx(g,.016,.024,.04,M.steel,0,0,.35);bx(g,.014,.01,.03,M.steel,0,0,.38);mcScabbard(J,M,.04,.06,.36);return g;},
  /* rapier: long thin blade, swept hilt with a knuckle bow on the finger side and a small shell */
  rapier:(J,M)=>{const g=mcWg(J);giGrip(g,M,.12,0);bx(g,.025,.24,.025,M.steelL,0,0,.075);for(const s of[1,-1])bx(g,.026,.026,.04,M.steelL,0,s*.12,.09);
    bx(g,.02,.02,.2,M.steelL,0,-.085,-.01);bx(g,.02,.04,.02,M.steelL,0,-.075,.085);bx(g,.02,.04,.02,M.steelL,0,-.075,-.1);bx(g,.045,.045,.05,M.steelL,0,0,-.11);
    bx(g,.07,.07,.015,M.steel,0,0,.1);bx(g,.012,.024,.9,M.steel,0,0,.555);bx(g,.01,.012,.04,M.steel,0,0,1.02);mcScabbard(J,M,.035,.045,.98);return g;},
  /* cleaver: a heavy square chopping blade */
  cleaver:(J,M)=>{const g=mcWg(J);bx(g,.036,.036,.14,M.wood,0,0,-.005);bx(g,.04,.05,.03,M.ironD,0,0,.08);bx(g,.04,.04,.03,M.ironD,0,0,-.085);
    bx(g,.018,.13,.42,M.steel,0,-.035,.31);bx(g,.024,.022,.42,M.iron,0,.039,.31);bx(g,.016,.014,.42,M.steelL,0,-.105,.31);bx(g,.018,.09,.04,M.steel,0,-.015,.54);mcScabbard(J,M,.045,.15,.5);return g;},
  /* war hammer: a square hammer face at the edge side, a beak at the back and a spike on top */
  hammer:(J,M)=>{const g=mcWg(J);bx(g,.03,.03,.56,M.wood,0,0,.2);giGrip(g,M,.14,0);bx(g,.04,.04,.03,M.ironD,0,0,-.09);bx(g,.036,.036,.16,M.ironD,0,0,.4);
    bx(g,.06,.06,.08,M.iron,0,0,.5);bx(g,.065,.07,.065,M.steel,0,-.07,.5);bx(g,.075,.015,.075,M.ironD,0,-.11,.5);bx(g,.04,.08,.04,M.steel,0,.07,.5);bx(g,.025,.05,.025,M.steel,0,.13,.49);
    bx(g,.03,.03,.08,M.steel,0,0,.58);bx(g,.018,.018,.04,M.steel,0,0,.64);mcFrog(J,M);return g;},
  /* morning star: a ball with spikes in rings of six and three, and one on top */
  morningstar:(J,M)=>{const g=mcWg(J);bx(g,.034,.034,.5,M.wood,0,0,.18);giGrip(g,M,.14,0);bx(g,.042,.042,.03,M.ironD,0,0,-.085);bx(g,.04,.04,.06,M.ironD,0,0,.42);
    const c=.52;bx(g,.11,.11,.11,M.iron,0,0,c);bx(g,.09,.13,.09,M.iron,0,0,c);bx(g,.13,.09,.09,M.iron,0,0,c);bx(g,.09,.09,.13,M.iron,0,0,c);
    for(const[el,n,off]of[[0,6,0],[45,3,30],[-45,3,90]])for(let k=0;k<n;k++){const a=(off+k*360/n)*MC_R,e=el*MC_R,d=[Math.cos(e)*Math.cos(a),Math.cos(e)*Math.sin(a),Math.sin(e)];
      giSpikeT(g,.024,.07,M.steel,d[0]*.058,d[1]*.058,c+d[2]*.058,d);}giSpikeT(g,.024,.08,M.steel,0,0,c+.06,[0,0,1]);mcFrog(J,M);return g;},
  /* war pick: a long curved pick at the edge side, a small hammer behind */
  pick:(J,M)=>{const g=mcWg(J);bx(g,.032,.032,.56,M.wood,0,0,.2);giGrip(g,M,.14,0);bx(g,.04,.04,.03,M.ironD,0,0,-.09);bx(g,.05,.06,.08,M.ironD,0,0,.48);
    bx(g,.034,.07,.04,M.steel,0,-.06,.48);bx(g,.03,.07,.034,M.steel,0,-.125,.47,.2);bx(g,.024,.06,.03,M.steel,0,-.185,.452,.35);bx(g,.018,.045,.024,M.steel,0,-.228,.43,.5);
    bx(g,.05,.05,.05,M.steel,0,.05,.48);bx(g,.056,.012,.056,M.ironD,0,.078,.48);mcFrog(J,M);return g;},
  /* hand axe: short haft, small head */
  handaxe:(J,M)=>{const g=mcWg(J);bx(g,.032,.032,.46,M.wood,0,0,.15);bx(g,.036,.036,.03,M.ironD,0,0,-.08);bx(g,.045,.06,.07,M.ironD,0,0,.34);
    bx(g,.016,.06,.08,M.iron,0,-.06,.345);bx(g,.016,.04,.12,M.steel,0,-.105,.34);bx(g,.014,.016,.13,M.steelL,0,-.13,.34);bx(g,.04,.03,.05,M.ironD,0,.045,.34);mcFrog(J,M);return g;},
  /* double axe: two broad bits on one head */
  doubleaxe:(J,M)=>{const g=mcWg(J);bx(g,.036,.036,.62,M.wood,0,0,.23);giGrip(g,M,.14,0);bx(g,.042,.042,.03,M.ironD,0,0,-.09);bx(g,.05,.07,.1,M.ironD,0,0,.47);
    for(const s of[-1,1]){bx(g,.016,.07,.1,M.iron,0,s*.07,.47);bx(g,.016,.05,.17,M.steel,0,s*.13,.47);bx(g,.016,.03,.21,M.steel,0,s*.165,.47);bx(g,.014,.014,.22,M.steelL,0,s*.182,.47);}
    bx(g,.024,.024,.04,M.ironD,0,0,.54);mcFrog(J,M);return g;},
  /* spiked club: a tapering knotted club with iron studs */
  club:(J,M)=>{const g=mcWg(J);bx(g,.04,.04,.16,M.leatherD,0,0,0);bx(g,.05,.05,.2,M.wood,0,0,.17);bx(g,.065,.065,.2,M.wood,0,0,.36);bx(g,.08,.08,.18,M.wood,0,0,.54);bx(g,.07,.07,.03,M.wood,0,0,.645);
    bx(g,.085,.085,.02,M.ironD,0,0,.45);[[.38,.0325,0],[.5,.04,60],[.58,.04,0],[.62,.04,60]].forEach(([z,r,o])=>{for(let k=0;k<3;k++){const a=(o+k*120)*MC_R;giSpikeT(g,.02,.04,M.steel,Math.cos(a)*r,Math.sin(a)*r,z,[Math.cos(a),Math.sin(a),.15]);}});mcFrog(J,M);return g;},
  /* sceptre: a gold mace with six short flanges and a glowing gem */
  sceptre:(J,M)=>{const g=mcWg(J),au=GI.gold(),ad=GI.goldD();bx(g,.03,.03,.5,ad,0,0,.2);giGrip(g,M,.14,0,M.leatherD);bx(g,.05,.05,.04,au,0,0,-.09);bx(g,.045,.045,.03,au,0,0,.36);
    bx(g,.06,.06,.1,au,0,0,.5);for(let k=0;k<6;k++){const a=k*Math.PI/3,f=bx(g,.014,.04,.09,au,Math.sin(a)*.045,Math.cos(a)*.045,.5);f.rotation.z=-a;}
    bx(g,.07,.07,.02,ad,0,0,.56);const gm=bx(g,.045,.045,.045,GI.glow(PAL.holy[2]),0,0,.6);gm.rotation.set(Math.PI/4,Math.PI/4,0);mcFrog(J,M);return g;},
  /* torch: a wrapped stick with a glowing head; it burns by default (fxDefault) */
  torch:(J,M)=>{const g=mcWg(J);bx(g,.035,.035,.5,M.wood,0,0,.14);bx(g,.058,.058,.12,bm('#5e5446','cloth'),0,0,.42);for(const z of[.38,.44])bx(g,.062,.062,.012,M.leatherD,0,0,z);
    bx(g,.052,.052,.03,GI.dark(),0,0,.495);bx(g,.036,.036,.016,GI.glow(PAL.fire[2]),0,0,.516);g.userData.fxDefault={type:'burn',col:'fire'};mcFrog(J,M);return g;}});
Object.assign(MC_SLOTS.weapon,{longsword:'Longsword',broadsword:'Broadsword',scimitar:'Scimitar',shortsword:'Short sword',dagger:'Dagger',rapier:'Rapier',cleaver:'Cleaver',
  hammer:'War hammer',morningstar:'Morning star',pick:'War pick',handaxe:'Hand axe',doubleaxe:'Double axe',club:'Spiked club',sceptre:'Sceptre',torch:'Torch'});
{const n=MC_SLOTS.weapon.none;delete MC_SLOTS.weapon.none;MC_SLOTS.weapon.none=n;}

/* ======================= shields ======================= */
const giRound=(r,step)=>{const rows=[];for(let y=r-step/2;y>-r;y-=step){const w=2*Math.sqrt(Math.max(0,r*r-y*y));rows.push([Math.round(w/.04)*.04,step,y]);}return rows;};
const GI_HEATER=[[.56,.36,.12],[.52,.08,-.1],[.46,.07,-.175],[.38,.07,-.245],[.28,.06,-.31],[.16,.05,-.365],[.06,.04,-.41]];
Object.assign(MC_GEAR.shield,{
  /* steel heater: all-steel boards with a painted face, a dark rim and rivets */
  steelheater:(J,M)=>mcShieldBoard(J,M,GI_HEATER,s=>{bx(s,.585,.03,.05,M.ironD,0,.3,.02);for(const x of[-.28,.28])bx(s,.03,.38,.05,M.ironD,x,.115,.02);
    for(const x of[-.2,-.1,0,.1,.2])bx(s,.022,.022,.02,M.brass,x,.3,.05);},{metal:true,paint:true}),
  /* targe: round leather board with a ring of brass studs and a spiked boss */
  targe:(J,M)=>mcShieldBoard(J,M,giRound(.27,.06),s=>{for(let k=0;k<12;k++){const a=k*Math.PI/6;bx(s,.024,.024,.02,M.brass,Math.sin(a)*.2,Math.cos(a)*.2,.045);}
    bx(s,.1,.1,.04,M.brass,0,0,.055);giSpikeT(s,.03,.12,M.steel,0,0,.075,[0,0,1]);},{board:M.leather}),
  /* spiked buckler: a small steel fist shield with a long spike */
  spikedbuckler:(J,M)=>mcShieldBoard(J,M,giRound(.17,.05),s=>{bx(s,.09,.09,.05,M.ironD,0,0,.055);giSpikeT(s,.03,.16,M.steelL,0,0,.08,[0,0,1]);},{fist:true,metal:true}),
  /* oblong: a tall rounded rectangle with a round boss and rim strips */
  oblong:(J,M)=>mcShieldBoard(J,M,[[.42,.04,.37],[.5,.7,0],[.42,.04,-.37]],s=>{bx(s,.12,.12,.04,M.ironD,0,0,.055);bx(s,.07,.07,.03,M.steel,0,0,.085);
    for(const x of[-.245,.245])bx(s,.03,.7,.05,M.ironD,x,0,.02);for(const y of[-.38,.38])bx(s,.4,.03,.05,M.ironD,0,y,.02);}),
  /* ornate heater: steel rim with gold edging and a glowing gem */
  ornate:(J,M)=>mcShieldBoard(J,M,GI_HEATER,s=>{const au=GI.gold();bx(s,.585,.03,.05,M.steel,0,.3,.02);for(const x of[-.28,.28])bx(s,.03,.38,.05,M.steel,x,.115,.02);
    bx(s,.6,.014,.055,au,0,.32,.022);for(const x of[-.295,.295])bx(s,.014,.4,.055,au,x,.115,.022);[[.24,-.12],[.18,-.25],[.1,-.35]].forEach(([x,y])=>{for(const s2 of[1,-1])bx(s,.05,.02,.05,au,s2*x,y,.03,0,0,s2*.75);});
    bx(s,.1,.1,.03,au,0,.03,.055);const gm=bx(s,.05,.05,.03,GI.glow(PAL.soul[2]),0,.03,.075);gm.rotation.z=Math.PI/4;},{metal:true,paint:true}),
  /* dark round: black iron with six spikes round the rim and a spiked boss */
  dark:(J,M)=>mcShieldBoard(J,M,giRound(.29,.06),s=>{const d=mcMat(PAL.blackIron[1],'steel');for(let k=0;k<6;k++){const a=k*Math.PI/3+Math.PI/6;giSpikeT(s,.03,.1,d,Math.sin(a)*.28,Math.cos(a)*.28,.02,[Math.sin(a),Math.cos(a),0]);}
    bx(s,.12,.12,.04,d,0,0,.055);giSpikeT(s,.035,.12,d,0,0,.08,[0,0,1]);},{metal:true,paint:true,board:mcMat(PAL.blackIron[2],'steel')})});
Object.assign(MC_SLOTS.shield,{steelheater:'Steel heater',targe:'Targe',spikedbuckler:'Spiked buckler',oblong:'Oblong shield',ornate:'Ornate heater',dark:'Dark round shield'});
{const n=MC_SLOTS.shield.none;delete MC_SLOTS.shield.none;MC_SLOTS.shield.none=n;}

/* ======================= helmets (return which hair shows: 'all', 'back', 'none' or 'hide') ======================= */
function giSkull(h,w,M,top){const ir=M.steel;bx(h,w+.03,.08,.29,ir,0,.25,0);bx(h,w,.06,.25,ir,0,.32,-.005);bx(h,w-.06,.05,.19,ir,0,.37,-.01);if(top)bx(h,.1,.03,.1,ir,0,.405,-.02);}
Object.assign(MC_GEAR.helmet,{
  /* bascinet: a tall pointed skull over a mail aventail that falls onto the shoulders */
  bascinet:(J,M,F)=>{const h=J.head,w=F.w,m=M.mail;giSkull(h,w,M);bx(h,.08,.05,.1,M.steel,0,.41,-.03);bx(h,.03,.03,.04,M.steel,0,.445,-.04);
    bx(h,w+.034,.2,.034,m,0,.11,-.137);for(const s of[1,-1])bx(h,.032,.2,.24,m,s*(w/2+.017),.11,-.01);bx(J.neck,.22,.12,.21,m,0,.02,0);bx(J.chest,.36,.06,.31,m,0,.31,-.005);return 'none';},
  /* sallet: rounded skull swept into a long tail, a brim over the eyes */
  sallet:(J,M,F)=>{const h=J.head,w=F.w,ir=M.steel;bx(h,w+.03,.09,.3,ir,0,.255,-.01);bx(h,w,.05,.27,ir,0,.33,-.015);bx(h,w-.07,.03,.2,ir,0,.365,-.02);bx(h,.03,.03,.24,M.steelL,0,.385,-.03);
    bx(h,w+.03,.03,.14,ir,0,.215,-.2,-.35);bx(h,w+.034,.025,.03,M.ironD,0,.215,.15);for(const s of[1,-1])bx(h,.03,.08,.2,ir,s*(w/2+.017),.19,-.04);return 'none';},
  /* armet: a close helm with a pointed visor, a horizontal eye slit and breaths */
  armet:(J,M,F)=>{const h=J.head,w=F.w,ir=M.steel;bx(h,w+.06,.3,.32,ir,0,.17,.005);bx(h,w+.02,.05,.28,ir,0,.34,0);bx(h,w-.05,.03,.2,ir,0,.375,-.01);
    bx(h,w,.1,.04,ir,0,.15,.18);bx(h,w-.08,.07,.04,ir,0,.15,.215);bx(h,.19,.016,.012,M.slit,0,.218,.171);for(const x of[-.05,.05])bx(h,.04,.01,.012,M.slit,x,.15,.236);
    bx(h,w+.064,.03,.324,M.ironD,0,.03,.005);bx(J.neck,.2,.1,.2,M.steel,0,.02,0);return 'hide';},
  /* horned: the nasal helm with two bone horns that curve outward and up */
  horned:(J,M,F)=>{const r=MC_GEAR.helmet.nasal(J,M,F),h=J.head,w=F.w,b=GI.bone();
    for(const s of[1,-1]){bx(h,.06,.055,.06,b,s*(w/2+.035),.3,0,0,0,-s*.3);bx(h,.05,.05,.05,b,s*(w/2+.085),.33,0,0,0,-s*.7);bx(h,.04,.06,.04,b,s*(w/2+.115),.38,0,0,0,-s*.25);bx(h,.028,.05,.028,b,s*(w/2+.12),.43,0,0,0,s*.15);}return r;},
  /* winged: a round cap with metal wings on the sides */
  winged:(J,M,F)=>{const h=J.head,w=F.w,ir=M.steel;bx(h,w+.03,.07,.29,M.ironD,0,.25,0);bx(h,w+.01,.06,.27,ir,0,.3,0);bx(h,w-.04,.04,.22,ir,0,.345,0);bx(h,.12,.03,.14,ir,0,.375,0);
    for(const s of[1,-1])[[.16,.03,0],[.13,-.02,-.04],[.1,-.07,-.08]].forEach(([l,z,y])=>bx(h,.014,l,.045,M.steelL,s*(w/2+.03),.33+y+l/2,z-.03,-.6,0,-s*.3));return 'back';},
  /* ridge helm: rounded cap with a front-to-back ridge, cheek plates and a neck guard */
  ridge:(J,M,F)=>{const h=J.head,w=F.w,ir=M.steel;bx(h,w+.03,.07,.29,M.ironD,0,.25,0);bx(h,w+.01,.06,.27,ir,0,.3,0);bx(h,w-.04,.04,.22,ir,0,.345,0);bx(h,.03,.04,.24,M.brass,0,.37,0);
    for(const s of[1,-1])bx(h,.025,.15,.12,ir,s*(w/2+.017),.15,.05);bx(h,w+.03,.12,.03,ir,0,.17,-.15);return 'none';},
  /* crown: a gold circlet with points and dyed gems; the hair shows */
  crown:(J,M,F)=>{const h=J.head,w=F.w,au=GI.gold(),gm=bm(PAL.blood[3],'plain'),R=w/2+.025,Z=.155;
    bx(h,2*R+.014,.04,.014,au,0,.26,Z);bx(h,2*R+.014,.04,.014,au,0,.26,-Z);for(const s of[1,-1])bx(h,.014,.04,2*Z,au,s*R,.26,0);
    for(const x of[-.08,0,.08]){bx(h,.024,.04,.014,au,x,.3,Z);bx(h,.024,.04,.014,au,x,.3,-Z);}for(const s of[1,-1])for(const z of[-.07,.07])bx(h,.014,.04,.024,au,s*R,.3,z);
    bx(h,.03,.03,.01,gm,0,.26,Z+.01);for(const x of[-.08,.08])bx(h,.018,.018,.01,bm(PAL.gold[4],'plain'),x,.26,Z+.01);return 'all';},
  /* hood: cloth over the head and shoulders, face open */
  hood:(J,M,F)=>{const h=J.head,w=F.w,cl=GI.cloth(M,'#5e5446'),cd=GI.clothD(M,'#5e5446');bx(h,w+.04,.06,.3,cl,0,.29,-.01);for(const s of[1,-1])bx(h,.03,.3,.28,cl,s*(w/2+.02),.15,-.01);
    bx(h,w+.04,.32,.03,cl,0,.15,-.155);bx(h,w+.05,.04,.04,cd,0,.275,.13);for(const s of[1,-1])bx(h,.035,.22,.04,cd,s*(w/2+.022),.16,.13);
    bx(J.neck,.22,.12,.21,cl,0,.02,0);bx(J.chest,.42,.07,.32,cl,0,.31,-.005);bx(J.chest,.14,.08,.05,cd,0,.33,-.175);return 'none';},
  /* leather cap: a close skullcap */
  cap:(J,M,F)=>{const h=J.head,w=F.w;bx(h,w+.016,.06,.276,M.leather,0,.27,0);bx(h,w-.03,.03,.22,M.leather,0,.31,0);bx(h,w+.02,.02,.28,M.leatherD,0,.245,0);return 'back';},
  /* crested great helm: the great helm with a dyed crest from front to back */
  crested:(J,M,F)=>{const r=MC_GEAR.helmet.great(J,M,F),h=J.head,cl=GI.cloth(M,'#6e3a33'),cd=GI.clothD(M,'#6e3a33');
    bx(h,.05,.03,.26,M.brass,0,.365,.005);bx(h,.045,.08,.3,cl,0,.42,-.01);bx(h,.04,.05,.22,cd,0,.485,-.03);bx(h,.035,.06,.08,cl,0,.42,-.19);return r;},
  /* dark helm: a black close helm with small horns and a red glowing slit */
  dark:(J,M,F)=>{const h=J.head,w=F.w,d=mcMat(PAL.blackIron[2],'steel'),dd=mcMat(PAL.blackIron[1],'steel');bx(h,w+.07,.32,.33,d,0,.16,.005);bx(h,w+.03,.05,.29,d,0,.34,0);bx(h,w-.04,.03,.2,dd,0,.375,-.01);
    bx(h,w+.074,.03,.334,dd,0,.02,.005);bx(h,.2,.02,.012,GI.glow(PAL.bloodGlow[2]),0,.2,.176);
    for(const s of[1,-1]){bx(h,.05,.045,.05,dd,s*(w/2+.04),.29,0,0,0,-s*.6);bx(h,.032,.045,.032,dd,s*(w/2+.075),.32,0,0,0,-s*.3);}bx(J.neck,.2,.1,.2,dd,0,.02,0);return 'hide';},
  /* mage hat: a wide brim and a tall drooping cone in the cloth colour */
  mage:(J,M,F)=>{const h=J.head,w=F.w,cl=GI.cloth(M,'#3d4a63'),cd=GI.clothD(M,'#3d4a63');bx(h,.4,.02,.4,cl,0,.245,0);bx(h,w+.02,.04,.28,cd,0,.27,0);
    [[w+.01,.07,.27,.32,0],[.2,.07,.22,.38,-.01],[.15,.07,.16,.44,-.025],[.1,.06,.1,.5,-.05],[.06,.06,.06,.54,-.09]].forEach(([a,b,c,y,z])=>bx(h,a,b,c,cl,0,y,z));return 'back';}});
Object.assign(MC_SLOTS.helmet,{bascinet:'Bascinet',sallet:'Sallet',armet:'Armet (close helm)',horned:'Horned helm',winged:'Winged helm',ridge:'Ridge helm',crown:'Crown',hood:'Hood',cap:'Leather cap',crested:'Crested great helm',dark:'Dark helm',mage:'Mage hat'});

/* ======================= body armour ======================= */
function giSkirt(J,mat,h=.2,y=-.08){for(const sd of['L','R'])bx(J['thigh_'+sd],.215,h,.225,mat,0,y,0);}
Object.assign(MC_GEAR.armor,{
  /* full plate: breastplate with a ridge, gorget, plackart and faulds, full arm harness with couters, big pauldrons, tassets over a mail skirt */
  fullplate:(J,M)=>{const st=M.steel,dk=M.ironD;mcTorso(J,M,st,st,M.mail);mcSleeves(J,M,st,st,true);bx(J.chest,.44,.05,.3,dk,0,.005,0);bx(J.chest,.04,.2,.03,M.steelL,0,.15,.178);
    bx(J.chest,.3,.07,.22,st,0,.31,-.005);bx(J.neck,.19,.07,.18,st,0,.0,0);bx(J.spine,.37,.055,.25,st,0,.09,0);bx(J.spine,.38,.055,.26,dk,0,.035,0);
    bx(J.hips,.4,.05,.27,st,0,.02,0);bx(J.hips,.41,.05,.28,dk,0,-.03,0);giSkirt(J,M.mail);
    for(const sd of['L','R']){const ua=J['upperArm_'+sd],fa=J['foreArm_'+sd],th=J['thigh_'+sd],s=sd==='L'?1:-1;
      if(mcOwnSh(M)){bx(ua,.24,.05,.24,st,0,.06,0);bx(ua,.245,.05,.245,dk,0,.015,0);bx(ua,.25,.05,.25,st,0,-.03,0);bx(ua,.25,.04,.25,dk,0,-.07,0);}
      bx(fa,.155,.07,.16,dk,0,0,0);bx(fa,.03,.06,.06,M.steelL,s*.085,0,0);bx(fa,.145,.04,.145,dk,0,-.13,0);
      bx(th,.2,.08,.03,st,0,-.04,.118);bx(th,.2,.08,.03,dk,0,-.11,.122);bx(th,.03,.15,.2,st,s*.105,-.07,0);}
    mcBelt(J,M);},
  /* ornate plate: the full plate with gold edging */
  ornate:(J,M)=>{MC_GEAR.armor.fullplate(J,M);const au=GI.gold();bx(J.chest,.445,.016,.305,au,0,.03,0);bx(J.chest,.044,.2,.02,au,0,.15,.187);bx(J.chest,.305,.015,.225,au,0,.345,-.005);
    bx(J.spine,.385,.014,.265,au,0,.064,0);for(const sd of['L','R']){const ua=J['upperArm_'+sd],th=J['thigh_'+sd];if(mcOwnSh(M))bx(ua,.255,.012,.255,au,0,-.092,0);bx(th,.205,.012,.035,au,0,-.148,.124);}},
  /* warlord plate: the full plate with spikes on the shoulders, elbows and breastplate */
  spiked:(J,M)=>{MC_GEAR.armor.fullplate(J,M);const sp=M.steelL;for(const sd of['L','R']){const ua=J['upperArm_'+sd],fa=J['foreArm_'+sd],s=sd==='L'?1:-1;
      if(mcOwnSh(M))for(const z of[-.06,0,.06])giSpikeT(ua,.03,.1,sp,s*.06,.085,z,[s*.45,1,0]);giSpikeT(fa,.026,.08,sp,0,0,-.08,[0,-.2,-1]);}
    for(const x of[-.12,.12])giSpikeT(J.chest,.024,.06,sp,x,.06,.15,[0,0,1]);},
  /* brigandine: a dyed coat studded with brass rivets over mail sleeves, small spaulders, mail skirt */
  brigandine:(J,M)=>{const cl=GI.cloth(M,'#6e3a33');mcTorso(J,M,cl,cl,M.mail);mcSleeves(J,M,M.mail,M.mail,true);bx(J.chest,.25,.07,.23,M.mail,0,.3,-.005);
    for(let x=-.18;x<=.181;x+=.06){for(const y of[.12,.17,.22])bx(J.chest,.016,.016,.01,M.brass,x,y,.178);for(const y of[.03,.07])bx(J.chest,.016,.016,.01,M.brass,x,y,.148);}
    for(let x=-.15;x<=.151;x+=.06)for(const y of[.05,.12])bx(J.spine,.016,.016,.01,M.brass,x,y,.123);
    if(mcOwnSh(M))for(const sd of['L','R']){const ua=J['upperArm_'+sd];bx(ua,.2,.04,.2,M.steel,0,.04,0);bx(ua,.205,.04,.205,M.ironD,0,0,0);}giSkirt(J,M.mail);mcBelt(J,M);},
  /* scale armour: overlapping metal scales on the body, the sleeves and the skirt */
  scale:(J,M)=>{const sc=giMat(MC_METAL[M.sel.ametal]&&MC_METAL[M.sel.ametal][1]?MC_METAL[M.sel.ametal][1][2]:PAL.bronze[2],'scale',1);mcTorso(J,M,sc,sc,sc);mcSleeves(J,M,sc,M.leather,true);
    bx(J.chest,.24,.06,.22,M.leatherD,0,.3,-.005);giSkirt(J,sc,.24,-.1);if(mcOwnSh(M))for(const sd of['L','R']){const ua=J['upperArm_'+sd];bx(ua,.21,.05,.21,sc,0,.04,0);bx(ua,.215,.05,.215,sc,0,-.01,0);}mcBelt(J,M);},
  /* lamellar: rows of laced plates on the body, layered shoulders and a long skirt */
  lamellar:(J,M)=>{const la=giMat(MC_METAL[M.sel.ametal]&&MC_METAL[M.sel.ametal][1]?MC_METAL[M.sel.ametal][1][0]:PAL.iron[2],'lamellar',1);mcTorso(J,M,la,la,la);mcSleeves(J,M,M.quilt,M.leather,true);
    bx(J.chest,.24,.06,.22,M.leatherD,0,.3,-.005);giSkirt(J,la,.28,-.12);if(mcOwnSh(M))for(const sd of['L','R']){const ua=J['upperArm_'+sd];for(const[y,w]of[[.05,.22],[0,.225],[-.05,.23]])bx(ua,w,.055,w,la,0,y,0);}mcBelt(J,M);},
  /* surcoat over mail: a dyed sleeveless coat with a diamond on the chest, panels front and back over the skirt */
  surcoat:(J,M)=>{const cl=GI.cloth(M,'#3d4a63'),cd=GI.clothD(M,'#3d4a63');mcTorso(J,M,cl,cl,M.mail);mcSleeves(J,M,M.mail,M.mail,true);bx(J.chest,.25,.07,.23,M.mail,0,.3,-.005);
    const dm=bx(J.chest,.08,.08,.012,M.brass,0,.165,.18);dm.rotation.z=Math.PI/4;giSkirt(J,M.mail);
    for(const sd of['L','R']){const th=J['thigh_'+sd];bx(th,.21,.32,.03,cl,0,-.16,.118);bx(th,.21,.32,.03,cl,0,-.16,-.118);bx(th,.212,.03,.032,cd,0,-.31,.118);}
    if(mcOwnSh(M))for(const sd of['L','R'])mcPauldron(J['upperArm_'+sd],M);mcBelt(J,M);},
  /* mail shirt: short sleeves and no skirt, over a linen shirt */
  mailshirt:(J,M)=>{const m=M.mail;mcTorso(J,M,m,m,M.pantsTop);mcSleeves(J,M,m,M.linen,false);bx(J.chest,.25,.07,.23,m,0,.3,-.005);mcBelt(J,M);},
  /* battlemage robe: a dyed robe to the knees with wide cuffs and a gold hem */
  robe:(J,M)=>{const cl=GI.cloth(M,'#3d4a63'),cd=GI.clothD(M,'#3d4a63'),au=GI.gold();mcTorso(J,M,cl,cl,cl);mcSleeves(J,M,cl,cl,true);bx(J.chest,.27,.07,.24,cd,0,.3,-.005);bx(J.chest,.275,.012,.245,au,0,.336,-.005);
    for(const sd of['L','R']){const th=J['thigh_'+sd],fa=J['foreArm_'+sd];bx(th,.225,.48,.235,cl,0,-.22,0);bx(th,.23,.035,.24,au,0,-.445,0);bx(fa,.17,.08,.17,cd,0,-.22,0);bx(fa,.172,.012,.172,au,0,-.255,0);}mcBelt(J,M);},
  /* ranger leathers: dark dyed leather with a folded hood on the back and quilted shoulders */
  ranger:(J,M)=>{const le=bm('#3e4433','leather'),ld=bm('#2b3024','leather');mcTorso(J,M,le,le,le);mcSleeves(J,M,M.quilt,le,true);bx(J.chest,.25,.07,.23,ld,0,.3,-.005);
    bx(J.chest,.28,.1,.1,ld,0,.33,-.15);for(const sd of['L','R'])bx(J['thigh_'+sd],.21,.2,.22,ld,0,-.085,0);mcBelt(J,M);},
  /* barbarian: bare chest under a fur mantle, leather bracers and fur flaps */
  barbarian:(J,M)=>{const fu=GI.fur();mcTorso(J,M,M.skin,M.skin,M.leather);mcSleeves(J,M,M.skin,null,true);bx(J.chest,.46,.08,.31,fu,0,.27,0);bx(J.chest,.12,.06,.04,fu,0,.24,.17);
    for(const sd of['L','R']){const th=J['thigh_'+sd],fa=J['foreArm_'+sd];bx(fa,.145,.13,.145,M.leatherD,0,-.16,0);bx(th,.2,.18,.03,fu,0,-.1,.115);bx(th,.2,.18,.03,fu,0,-.1,-.115);
      if(mcOwnSh(M))bx(J['upperArm_'+sd],.21,.08,.21,fu,0,.02,0);}mcBelt(J,M);}});
Object.assign(MC_SLOTS.armor,{fullplate:'Full plate',ornate:'Ornate plate',spiked:'Warlord plate',brigandine:'Brigandine',scale:'Scale armour',lamellar:'Lamellar',
  surcoat:'Surcoat over mail',mailshirt:'Mail shirt',robe:'Battlemage robe',ranger:'Ranger leathers',barbarian:'Barbarian furs'});
{const n=MC_SLOTS.armor.none;delete MC_SLOTS.armor.none;MC_SLOTS.armor.none=n;}

/* ======================= shoulders (replace the armour's own pauldrons) ======================= */
const giSh=fn=>(J,M)=>{for(const sd of['L','R'])fn(J['upperArm_'+sd],M,sd==='L'?1:-1,J);};
Object.assign(MC_GEAR.shoulders,{
  leather:giSh((ua,M)=>mcPauldron(ua,M)),
  steel:giSh((ua,M,s)=>{bx(ua,.23,.05,.23,M.steel,0,.055,0);bx(ua,.235,.05,.235,M.ironD,0,.01,0);bx(ua,.24,.05,.24,M.steel,0,-.035,0);bx(ua,.03,.03,.03,M.brass,s*.12,.01,0);}),
  spiked:giSh((ua,M,s)=>{bx(ua,.24,.05,.24,M.steel,0,.055,0);bx(ua,.245,.05,.245,M.ironD,0,.01,0);bx(ua,.25,.05,.25,M.steel,0,-.035,0);for(const z of[-.07,0,.07])giSpikeT(ua,.03,.11,M.steelL,s*.07,.08,z,[s*.45,1,0]);}),
  fur:giSh((ua,M)=>{bx(ua,.23,.1,.23,GI.fur(),0,.02,0);bx(ua,.2,.05,.2,GI.furL(),0,.085,0);}),
  gilded:giSh((ua,M,s)=>{const au=GI.gold();bx(ua,.25,.06,.25,M.steel,0,.06,0);bx(ua,.255,.012,.255,au,0,.03,0);bx(ua,.26,.05,.26,M.steel,0,-.0,0);bx(ua,.262,.05,.262,M.steel,0,-.05,0);bx(ua,.266,.012,.266,au,0,-.078,0);
    const gm=bx(ua,.04,.04,.02,au,s*.131,.0,0,0,Math.PI/2);gm.rotation.z=Math.PI/4;}),
  mail:(J,M)=>{bx(J.chest,.38,.07,.32,M.mail,0,.3,-.005);for(const sd of['L','R'])bx(J['upperArm_'+sd],.2,.13,.2,M.mail,0,-.0,0);}});
Object.assign(MC_SLOTS,{shoulders:{armor:"Armour's own",none:'None',leather:'Leather pauldrons',steel:'Steel pauldrons',spiked:'Spiked pauldrons',fur:'Fur mantle',gilded:'Gilded pauldrons',mail:'Mail mantle'}});

/* ======================= gloves ======================= */
const giGl=fn=>(J,M)=>{for(const sd of['L','R'])fn(J['hand_'+sd],J['foreArm_'+sd],M,sd,sd==='L'?1:-1);};
Object.assign(MC_GEAR.gloves,{
  mail:giGl((hd,fa,M,sd)=>{mcFist(hd,M.mail,sd);bx(fa,.15,.08,.15,M.mail,0,-.24,0);bx(fa,.152,.02,.152,M.leatherD,0,-.2,0);}),
  gauntlets:giGl((hd,fa,M,sd,s)=>{mcFist(hd,M.steel,sd);bx(hd,.014,.08,.1,M.steelL,s*.052,-.06,0);bx(hd,.1,.025,.105,M.ironD,0,-.02,0);bx(fa,.17,.09,.17,M.steel,0,-.22,0);bx(fa,.155,.05,.155,M.ironD,0,-.16,0);}),
  bracers:giGl((hd,fa,M,sd)=>{mcFist(hd,M.skin,sd);bx(hd,.095,.04,.115,M.leather,0,-.035,0);bx(fa,.15,.16,.15,M.leatherD,0,-.17,0);bx(fa,.02,.14,.012,M.leatherL,0,-.17,.078);}),
  studded:giGl((hd,fa,M,sd,s)=>{mcFist(hd,M.leather,sd);bx(fa,.155,.1,.155,M.leatherD,0,-.225,0);for(const z of[-.045,.045])for(const y of[-.2,-.25])bx(fa,.012,.016,.016,M.brass,s*.08,y,z);
    for(const y of[-.2,-.25])bx(fa,.016,.016,.012,M.brass,0,y,.08);}),
  spiked:giGl((hd,fa,M,sd,s)=>{mcFist(hd,M.steel,sd);bx(hd,.014,.08,.1,M.steelL,s*.052,-.06,0);for(const y of[-.03,-.06,-.09])giSpikeT(hd,.016,.04,M.steelL,s*.058,y,0,[s,0,0]);
    bx(fa,.17,.09,.17,M.steel,0,-.22,0);giSpikeT(fa,.02,.05,M.steelL,s*.085,-.22,0,[s,.3,0]);})});
Object.assign(MC_SLOTS.gloves,{mail:'Mail mittens',gauntlets:'Plate gauntlets',bracers:'Fingerless with bracers',studded:'Studded gloves',spiked:'Spiked gauntlets'});
{const n=MC_SLOTS.gloves.none;delete MC_SLOTS.gloves.none;MC_SLOTS.gloves.none=n;}

/* ======================= boots (soles stay where the leather boots have them: nothing below the ground) ======================= */
const giBt=fn=>(J,M)=>{for(const sd of['L','R'])fn(J['shin_'+sd],J['foot_'+sd],J['toes_'+sd],M,sd,sd==='L'?1:-1,J);};
Object.assign(MC_GEAR.boots,{
  sabatons:giBt((sn,ft,toe,M,sd,s,J)=>{bx(sn,.17,.3,.18,M.steel,0,-.3,0);bx(sn,.03,.28,.02,M.steelL,0,-.3,.095);bx(sn,.175,.03,.185,M.ironD,0,-.16,0);mcFoot(J,sd,M.steel,M.ironD);
    for(const z of[-.02,.05])bx(ft,.125,.012,.04,M.ironD,0,.002,z);}),
  riding:giBt((sn,ft,toe,M,sd,s,J)=>{bx(sn,.165,.38,.175,M.boot,0,-.27,-.005);bx(sn,.185,.08,.195,M.leatherL,0,-.06,-.005);mcFoot(J,sd,M.boot,M.sole);bx(ft,.03,.02,.05,M.brass,0,-.04,-.085);}),
  fur:giBt((sn,ft,toe,M,sd,s,J)=>{bx(sn,.165,.27,.175,M.boot,0,-.325,-.005);bx(sn,.19,.1,.2,GI.fur(),0,-.19,-.005);for(const y of[-.3,-.38])bx(sn,.17,.02,.18,M.leatherL,0,y,-.005);mcFoot(J,sd,M.boot,M.sole);}),
  mailshoes:giBt((sn,ft,toe,M,sd,s,J)=>{bx(sn,.16,.42,.17,M.mail,0,-.23,-.005);mcFoot(J,sd,M.leather,M.sole);bx(ft,.125,.02,.06,M.leatherD,0,-.0,-.03);}),
  shod:giBt((sn,ft,toe,M,sd,s,J)=>{bx(sn,.165,.27,.175,M.boot,0,-.325,-.005);bx(sn,.12,.22,.02,M.iron,0,-.3,.092);bx(sn,.175,.05,.185,M.leatherL,0,-.19,-.005);mcFoot(J,sd,M.boot,M.sole);
    bx(toe,.126,.02,.076,M.iron,0,.045,.035);bx(ft,.126,.02,.05,M.iron,0,.002,.09);})});
Object.assign(MC_SLOTS.boots,{sabatons:'Plate sabatons',riding:'Riding boots',fur:'Fur boots',mailshoes:'Mail chausses and shoes',shod:'Iron-shod boots'});
{const n=MC_SLOTS.boots.none;delete MC_SLOTS.boots.none;MC_SLOTS.boots.none=n;}

/* ======================= leg armour ======================= */
Object.assign(MC_GEAR.pants,{
  cuisses:(J,M)=>{mcLegs(J,M,M.wool,M.wool);for(const sd of['L','R']){const th=J['thigh_'+sd],sn=J['shin_'+sd],s=sd==='L'?1:-1;
    bx(th,.2,.3,.03,M.steel,0,-.22,.112);bx(th,.03,.28,.17,M.steel,s*.107,-.22,.0);bx(th,.2,.02,.032,M.ironD,0,-.08,.113);bx(sn,.17,.08,.04,M.steelL,0,-.01,.095);bx(sn,.02,.08,.1,M.steel,s*.085,-.01,.04);}},
  chausses:(J,M)=>mcLegs(J,M,M.mail,M.mail),
  padded:(J,M)=>{const q=GI.cloth(M,MC_COL.quiltDye);mcLegs(J,M,bm(MC_CLOTH[M.sel.cloth][0]||MC_COL.quiltDye,'quilt'),M.wool);for(const sd of['L','R'])bx(J['shin_'+sd],.16,.08,.04,M.leather,0,-.01,.085);},
  fur:(J,M)=>{mcLegs(J,M,M.leather,GI.furL());for(const sd of['L','R'])for(const y of[-.1,-.22,-.34])bx(J['shin_'+sd],.158,.02,.168,M.leatherD,0,y,-.005);}});
Object.assign(MC_SLOTS.pants,{cuisses:'Plate cuisses',chausses:'Mail chausses',padded:'Padded leggings',fur:'Fur leggings'});
{const n=MC_SLOTS.pants.none;delete MC_SLOTS.pants.none;MC_SLOTS.pants.none=n;}

/* ======================= capes (all share the four laid panels, so they share clips) ======================= */
const giCapePanel=(J,k)=>J.chest.children.find(q=>q.name==='mc_cape'+k);
Object.assign(MC_GEAR.cape,{
  fur:(J,M)=>{mcCapeBuild(J,M);bx(J.chest,.5,.09,.12,GI.fur(),0,.335,-.115);bx(giCapePanel(J,3),.43,.05,.032,GI.fur(),0,-.24,0);},
  royal:(J,M)=>{const cm=bm(MC_CLOTH[M.sel.cloth][0]||PAL.blood[3]),au=GI.gold();const M2=Object.assign({},M,{cape:cm});mcCapeBuild(J,M2);bx(J.chest,.5,.08,.12,GI.ermine(),0,.335,-.115);
    for(let k=0;k<MC_CAPE.n;k++){const g=giCapePanel(J,k);for(const x of[-.2,.2])bx(g,.024,MC_CAPE.len+.004,.026,au,x,-MC_CAPE.len/2,0);if(k===3)bx(g,.42,.024,.026,au,0,-MC_CAPE.len+.012,0);}
    for(const x of[-.16,0,.16])bx(J.chest,.02,.03,.012,GI.dark(),x,.34,-.051);},
  tattered:(J,M)=>{const M2=Object.assign({},M,{cape:bm(mcShade(MC_CLOTH[M.sel.cloth][0]||'#5e5446',.8))});mcCapeBuild(J,M2);const g=giCapePanel(J,3);g.remove(g.children[0]);
    [[-.17,.24],[-.08,.17],[.0,.22],[.09,.14],[.17,.2]].forEach(([x,l])=>bx(g,.09,l,MC_CAPE.t,M2.cape,x,-l/2,0));bx(giCapePanel(J,2),.06,.05,MC_CAPE.t+.002,bm('#4a4238'),.1,-.12,0);},
  hooded:(J,M)=>{mcCapeBuild(J,M);bx(J.chest,.4,.09,.12,M.cape,0,.335,-.115);bx(J.chest,.28,.03,.08,bm(mcShade(MC_CLOTH[M.sel.cloth][0]||'#5e5446',.75)),0,.39,-.125);}});
Object.assign(MC_SLOTS.cape,{cape:'Cape',fur:'Fur-collared cloak',royal:'Royal cape',tattered:'Tattered cloak',hooded:'Hooded cloak'});

/* ======================= belts ======================= */
Object.assign(MC_GEAR.belt,{
  pouches:(J,M)=>{MC_GEAR.belt.plain(J,M);bx(J.spine,.08,.1,.05,M.leather,-.13,-.06,.145);bx(J.spine,.085,.03,.055,M.leatherD,-.13,-.02,.147);bx(J.spine,.09,.11,.05,M.leather,-.08,-.06,-.15);bx(J.spine,.095,.03,.055,M.leatherD,-.08,-.015,-.152);},
  /* potions: three glass vials of red, blue and green brew at the back */
  potions:(J,M)=>{MC_GEAR.belt.plain(J,M);[[-.13,PAL.bloodGlow[2]],[-.06,PAL.soul[2]],[.01,PAL.fel[2]]].forEach(([x,c])=>{bx(J.spine,.045,.09,.04,GI.glass(),x,-.04,-.15);
    bx(J.spine,.032,.055,.028,GI.glow(c),x,-.055,-.15);bx(J.spine,.026,.02,.026,M.wood,x,.015,-.15);bx(J.spine,.05,.015,.012,M.leatherD,x,-.02,-.132);});},
  gilded:(J,M)=>{const au=GI.gold();bx(J.spine,.375,.06,.255,M.leatherD,0,0,0);for(const x of[-.15,-.075,.075,.15])bx(J.spine,.04,.04,.01,au,x,0,.131);bx(J.spine,.07,.055,.02,au,0,0,.135);bx(J.spine,.03,.03,.01,bm(PAL.blood[3],'plain'),0,0,.147);},
  sash:(J,M)=>{const cl=GI.cloth(M,'#6e3a33');bx(J.spine,.38,.09,.26,cl,0,0,0);bx(J.spine,.06,.07,.03,GI.clothD(M,'#6e3a33'),-.13,-.01,.135);bx(J.spine,.05,.2,.02,cl,-.13,-.13,.142);bx(J.spine,.05,.12,.02,cl,-.07,-.09,.142);},
  rope:(J,M)=>{bx(J.spine,.37,.035,.25,GI.rope(),0,0,0);bx(J.spine,.04,.04,.03,GI.rope(),-.1,-.01,.13);bx(J.spine,.02,.15,.02,GI.rope(),-.11,-.1,.135);}});
Object.assign(MC_SLOTS,{belt:{plain:'Leather belt',pouches:'Belt with pouches',potions:'Belt with potions',gilded:'Gilded belt',sash:'Sash',rope:'Rope belt',none:'None'}});

Object.assign(MC_DEF,{shoulders:'armor',belt:'plain',wmetal:'steel',ametal:'steel'});
