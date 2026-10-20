/* ======================= LOOT KIT (lt-): droppable weapons, armour, potions, treasure and supplies =======================
   Every item is built upright by its builder (weapons: grip at the origin, blade +y, flat side facing +z), then ltMake lays it down:
   'flat' (blade along x, flat side up; ltSettle tips it until both ends touch the ground), 'back' (armour lying on its back), 'up' (as built)
   or, with the Display option, hovers and turns above the ground like a game pickup.
   ltFx adds the effects: rarity halo (back-face additive shells), a blocky light pool, a light beam, rising sparkles, enchantment motes
   (fire, frost, poison, lightning, holy, shadow, arcane, blood), potion bubbles and a PointLight; all motion is baked by propAnim into a 4 s
   looping Idle clip, so it plays in the viewer and exports in the GLB. See docs/LOOT.md. */
FOLDERS[''].children.push('loot');
FOLDERS['loot']={name:'Loot',blurb:'Droppable weapons, armour, potions, treasure and supplies, with rarity glows and enchantments',children:['loot/weapons','loot/armor','loot/potions','loot/treasure','loot/supplies']};
FOLDERS['loot/weapons']={name:'Weapons',blurb:'Swords, axes, maces, polearms, bows, staves and shields',children:[]};
FOLDERS['loot/armor']={name:'Armour',blurb:'Helmets, body armour, gauntlets, boots, greaves, pauldrons, belt and cloak',children:[]};
FOLDERS['loot/potions']={name:'Potions',blurb:'Ten brews in six bottle shapes and three sizes, with bubbles',children:[]};
FOLDERS['loot/treasure']={name:'Treasure',blurb:'Coins, gems, ingots, jewellery, scrolls, books, keys, crystals, sacks and chests',children:[]};
FOLDERS['loot/supplies']={name:'Supplies',blurb:'Food, ammunition and a bomb',children:[]};

const LT_RAR={common:['Common','#c7c4be',0],uncommon:['Uncommon','#72bb61',1],rare:['Rare','#6092d7',2],epic:['Epic','#a36fd2',3],legendary:['Legendary','#e6a252',4]};
const LT_METAL={steel:['Steel','#a9b2b9',{r:.4,m:.25}],iron:['Iron','#8c8f97',{r:.7,m:.15}],rusty:['Rusty iron','#756051',{r:.95,tex:'leather'}],bronze:['Bronze','#aa8050',{r:.5,m:.25}],
  gold:['Gold','#d8bb61',{r:.4,m:.25}],silver:['Silver','#ced4d9',{r:.35,m:.25}],mithril:['Mithril','#c1cfd9',{r:.3,m:.2,e:'#8cc3e4',ei:.2}],obsidian:['Obsidian','#2c262f',{r:.25,m:.1}],
  crystal:['Crystal','#9ad1d9',{r:.1,op:.8,e:'#8cc3e4',ei:.45}],bone:['Bone','#d3cab0',{r:.9}],leather:['Leather','#684d36',{r:.9,tex:'leather'}]};
const LT_ENCH={none:['None'],fire:['Fire','#ed964e'],frost:['Frost','#8cc3e4'],poison:['Poison','#b7ca55'],lightning:['Lightning','#9caaea'],holy:['Holy','#eed182'],shadow:['Shadow','#684d93'],arcane:['Arcane','#b078d8'],blood:['Blood','#c9524d']};
const LT_GLOW={soft:['Soft',.6],normal:['Normal',1],bright:['Bright',1.6]};
const LT_LEATHER=['#533d2b','#36271d','#684d36','#2b2a2d','#6b3830','#2d344e'],LT_CLOTH=['#7b3a38','#3b4782','#3a683b','#58345f','#bfa356','#262428','#a26949','#d9d3c7'],LT_WOOD=['#735641','#58412f','#83664c'];
const LT_GEMS={ruby:['Ruby','#c9524d'],sapphire:['Sapphire','#555cbc'],emerald:['Emerald','#53b876'],amethyst:['Amethyst','#9354ba'],topaz:['Topaz','#d9b462'],diamond:['Diamond','#eaf7ff'],onyx:['Onyx','#2b282e']};
const LT_WM=['steel','iron','rusty','bronze','gold','mithril','obsidian','crystal','bone'],LT_AM=['steel','iron','rusty','bronze','gold','mithril','obsidian','leather'],LT_TM=['gold','silver','bronze','iron','mithril'];
const LT_FLAT=new THREE.Matrix4().set(0,1,0,0, 0,0,1,0, 1,0,0,0, 0,0,0,1);   // blade +y -> +x, flat side +z -> up

/* ---------- materials ---------- */
const LTM={},LT_TX={};
function ltMat(hex,o={}){const k=hex+JSON.stringify(o);if(LTM[k])return LTM[k];const map=o.tex==='mail'?vxTex('mail'):pxTex(o.tex||'plain');
  const m=new THREE.MeshStandardMaterial({map,color:new THREE.Color(hex).convertSRGBToLinear(),roughness:o.r??.65,metalness:o.m??0});
  if(o.e){m.emissive=new THREE.Color(o.e).convertSRGBToLinear();m.emissiveIntensity=o.ei??1;m.emissiveMap=map;}if(o.op){m.transparent=true;m.opacity=o.op;}return LTM[k]=m;}
function ltAdd(hex,op,map,side){const k='add'+hex+op+(map?map.uuid:'')+(side||0);return LTM[k]||(LTM[k]=new THREE.MeshBasicMaterial({color:new THREE.Color(hex).convertSRGBToLinear(),map:map||null,transparent:true,opacity:Math.min(1,op),blending:THREE.AdditiveBlending,depthWrite:false,side:side||THREE.FrontSide}));}
function ltNorm(hex,op){const k='nrm'+hex+op;return LTM[k]||(LTM[k]=new THREE.MeshBasicMaterial({color:new THREE.Color(hex).convertSRGBToLinear(),transparent:true,opacity:op,depthWrite:false}));}
function ltLiquid(hex,op){const k='lq'+hex+op;if(LTM[k])return LTM[k];const c=new THREE.Color(hex).convertSRGBToLinear();return LTM[k]=new THREE.MeshStandardMaterial({color:c,emissive:c,emissiveIntensity:.55,roughness:.2,transparent:true,opacity:op,depthWrite:false});}
const ltShade=(hex,k)=>{const c=new THREE.Color(hex);if(k>1)c.lerp(new THREE.Color('#d9d9d9'),k-1);else c.multiplyScalar(k);return '#'+c.getHexString();};
const ltMix=(a,b,k)=>'#'+new THREE.Color(a).lerp(new THREE.Color(b),k).getHexString();
function ltCanvasTex(key,w,h,fn){if(LT_TX[key])return LT_TX[key];const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){g.fillStyle=`rgba(255,255,255,${Math.max(0,Math.min(1,fn(x,y))).toFixed(3)})`;g.fillRect(x,y,1,1);}
  const t=new THREE.CanvasTexture(c);t.magFilter=THREE.NearestFilter;t.minFilter=THREE.NearestFilter;t.generateMipmaps=false;return LT_TX[key]=t;}
const ltPoolTex=()=>ltCanvasTex('pool',16,16,(x,y)=>{const d=Math.hypot(x-7.5,y-7.5)/8;return Math.pow(Math.max(0,1-d),1.5)*.85+(Math.abs(d-.8)<.09?.5:0);});
const ltBeamTex=()=>ltCanvasTex('beam',2,16,(x,y)=>Math.pow(y/15,1.4));   // row 15 (bottom of the texture, v=0) is opaque

/* ---------- palette: materials for one item from its options and seed ---------- */
function ltPal(o,seed){const r=mulberry32(hashStr('lt'+seed)),R=LT_RAR[o.rarity]||LT_RAR.rare,lvl=R[2],M=LT_METAL[o.metal]||LT_METAL.steel,ec=o.ench&&o.ench!=='none'?LT_ENCH[o.ench][1]:null;
  const P={r,lvl,rc:R[1],ek:ec?o.ench:'none',ec,seed,mh:M[1],v:[...Array(8)].map(()=>r())},pk=a=>a[Math.floor(r()*a.length)];
  P.m=ltMat(M[1],M[2]);P.md=ltMat(ltShade(M[1],.7),M[2]);P.ml=ltMat(ltShade(M[1],1.25),M[2]);
  P.blade=ec?ltMat(ltMix(M[1],ec,.35),Object.assign({},M[2],{e:ec,ei:.6})):P.ml;P.rune=ec?ltMat(ltShade(ec,1.3),{e:ec,ei:2.2}):P.md;
  P.t=ltMat(lvl>=3?'#d8bb61':lvl===2?'#d0d3d9':lvl===1?'#aa8050':'#5c5d66',{r:.45,m:.2});
  const lh=pk(LT_LEATHER);P.g=ltMat(lh,{tex:'leather',r:.9});P.gd=ltMat(ltShade(lh,.7),{tex:'leather',r:.9});const wh=pk(LT_WOOD);P.w=ltMat(wh,{tex:'leather',r:.9});P.wd=ltMat(ltShade(wh,.7),{tex:'leather',r:.9});
  P.clh=pk(LT_CLOTH);P.cl2=pk(LT_CLOTH.filter(c=>c!==P.clh));P.cloth=ltMat(P.clh,{tex:'cloth',r:.95});P.cloth2=ltMat(P.cl2,{tex:'cloth',r:.95});
  P.gem=ltMat(ltShade(R[1],1.15),{e:R[1],ei:lvl?1.1:.15,r:.15});P.dark=ltMat('#151412',{r:1});P.paper=ltMat('#d9d0b6',{tex:'cloth',r:.95});
  P.orbHex=ec||R[1];P.orb=ltMat(ltShade(P.orbHex,1.2),{e:P.orbHex,ei:1.5,op:.88,r:.1});return P;}

/* ---------- weapons ---------- */
function ltGrip(g,P,len){bx(g,.045,len,.045,P.g,0,-len/2,0);for(let y=-.03;y>-len+.02;y-=.055)bx(g,.052,.014,.052,P.gd,0,y,0);}
function ltPommel(g,P,y,k=1){const st=Math.floor(P.v[0]*4),t=P.t,yy=y-.035*k;
  if(st===0)bx(g,.08*k,.07*k,.07*k,t,0,yy,0);else if(st===1)bx(g,.075*k,.075*k,.06*k,t,0,yy-.01*k,0,0,0,Math.PI/4);
  else if(st===2){bx(g,.1*k,.04*k,.06*k,t,0,yy+.01*k,0);bx(g,.05*k,.04*k,.06*k,t,0,yy-.03*k,0);}else{bx(g,.06*k,.09*k,.06*k,t,0,yy-.01*k,0);bx(g,.08*k,.03*k,.07*k,t,0,yy-.04*k,0);}
  if(P.lvl>=2)bx(g,.04*k,.04*k,.085*k,P.gem,0,yy,0,0,0,Math.PI/4);}
function ltGuard(g,P,gw,k=1){const st=Math.floor(P.v[1]*4),t=P.t;bx(g,gw,.05*k,.08*k,t,0,.025*k,0);
  if(st===1)for(const s of[-1,1])bx(g,.045*k,.09*k,.08*k,t,s*(gw/2-.022*k),-.02*k,0);
  else if(st===2)for(const s of[-1,1])bx(g,.045*k,.09*k,.08*k,t,s*(gw/2-.022*k),.07*k,0);
  else if(st===3)for(const s of[-1,1])bx(g,.06*k,.06*k,.09*k,t,s*gw/2,.025*k,0,0,0,Math.PI/4);
  if(P.lvl>=3)bx(g,.045*k,.045*k,.1*k,P.gem,0,.03*k,0,0,0,Math.PI/4);}
function ltStraight(g,P,len,w,y0){bx(g,w,len,.026,P.blade,0,y0+len/2,0);bx(g,w*.26,len*.8,.032,P.ec?P.blade:P.md,0,y0+len*.42,0);
  bx(g,w*.66,.06,.024,P.blade,0,y0+len+.03,0);bx(g,w*.32,.06,.022,P.blade,0,y0+len+.09,0);
  if(P.ec){const n=Math.max(3,Math.round(len/.14));for(let i=0;i<n;i++){const y=y0+.07+i*(len*.76/n);if(i%2)bx(g,w*.16,.035,.038,P.rune,0,y,0);else bx(g,.028,.028,.038,P.rune,0,y,0,0,0,Math.PI/4);}}}
function ltSword(P,k){const g=new THREE.Group(),[len,w,gw,grip]={sword:[.78,.07,.2,.2],long:[1.02,.075,.26,.3],great:[1.3,.1,.36,.42],dagger:[.3,.055,.13,.12]}[k],s=k==='dagger'?.75:k==='great'?1.25:1;
  ltGrip(g,P,grip);ltPommel(g,P,-grip,s);ltGuard(g,P,gw,s);bx(g,w*1.15,.06,.04,P.m,0,.05*s+.03,0);if(k==='great')bx(g,w*.8,.14,.03,P.md,0,.2,0);ltStraight(g,P,len,w,.05*s+.06);return g;}
function ltScimitar(P){const g=new THREE.Group();ltGrip(g,P,.2);ltPommel(g,P,-.2);ltGuard(g,P,.18);bx(g,.08,.05,.04,P.m,0,.075,0);
  const n=10,len=.82,h=len/n,w=.07;for(let i=0;i<n;i++){const t=i/(n-1),x=.2*t*t,ww=w*(1+.55*Math.sin(t*Math.PI*.9)),y=.1+h/2+i*h;bx(g,ww,h+.004,.026,P.blade,x+(ww-w)/2,y,0);bx(g,.018,h+.004,.03,P.md,x-w/2+.012,y,0);
    if(P.ec&&i%2===0&&i<n-1)bx(g,.03,.03,.034,P.rune,x+.008,y,0,0,0,Math.PI/4);}
  bx(g,.065,.06,.024,P.blade,.23,.1+len+.03,0);bx(g,.035,.05,.022,P.blade,.25,.1+len+.08,0);return g;}
function ltHaft(g,P,len,grip,mat){bx(g,.05,len,.05,mat||P.w,0,len/2-grip,0);for(let y=-grip+.04;y<-.02;y+=.055)bx(g,.056,.016,.056,P.g,0,y,0);bx(g,.065,.05,.065,P.m,0,-grip-.02,0);}
function ltAxe(P,two){const g=new THREE.Group(),L=two?1.15:.68,gr=two?.32:.22,k=two?1.25:1,y=L-gr-.12*k;ltHaft(g,P,L,gr);
  bx(g,.08,.17*k,.075,P.m,0,y,0);for(const d of[-1,1])bx(g,.09,.03,.08,P.t,0,y+d*.09*k,0);
  for(const s of two?[-1,1]:[1]){for(let i=0;i<5;i++){const t=i/4,h=(.09+.2*t*t)*k;bx(g,.045*k,h,.03,P.m,s*(.06+i*.04*k),y-.01*k*t,0);}
    bx(g,.025*k,.31*k,.034,P.blade,s*(.06+.19*k),y-.01*k,0);if(P.ec)bx(g,.035,.035,.036,P.rune,s*(.06+.08*k),y,0,0,0,Math.PI/4);}
  if(!two){bx(g,.07,.05,.03,P.m,-.07,y,0);bx(g,.05,.03,.026,P.m,-.12,y,0);}if(P.lvl>=3)bx(g,.04,.04,.085,P.gem,0,y,0,0,0,Math.PI/4);bx(g,.06,.05,.06,P.t,0,L-gr,0);return g;}
function ltMace(P){const g=new THREE.Group(),L=.62,gr=.2,y=L-gr;ltHaft(g,P,L,gr,P.md);bx(g,.09,.2,.09,P.m,0,y,0);
  for(let k=0;k<4;k++){const f=new THREE.Group();put(g,f,0,y,0,0,k*Math.PI/4,0);bx(f,.24,.17,.03,k%2?P.m:P.blade,0,0,0);}
  bx(g,.06,.06,.06,P.t,0,y+.12,0);bx(g,.07,.04,.07,P.t,0,y-.12,0);if(P.lvl>=3)bx(g,.04,.04,.04,P.gem,0,y+.16,0,0,Math.PI/4,0);return g;}
function ltSpike(g,mat,o,d,r){const s=new THREE.Group();s.position.copy(o);s.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.clone().normalize());g.add(s);bx(s,.045,.06,.045,mat,0,r+.03,0);bx(s,.025,.05,.025,mat,0,r+.085,0);}
function ltMorning(P){const g=new THREE.Group(),L=.72,gr=.24,y=L-gr+.04,c=new THREE.Vector3(0,y,0);ltHaft(g,P,L,gr);
  bx(g,.17,.17,.17,P.m,0,y,0);bx(g,.2,.12,.12,P.m,0,y,0);bx(g,.12,.2,.12,P.m,0,y,0);bx(g,.12,.12,.2,P.m,0,y,0);
  const dirs=[[1,0,0],[-1,0,0],[0,1,0],[0,0,1],[0,0,-1]];for(const a of[-1,1])for(const b of[-1,1]){dirs.push([a,1,b]);dirs.push([a,-.6,b]);}
  for(const d of dirs)ltSpike(g,P.blade,c,new THREE.Vector3(...d),.07);bx(g,.08,.04,.08,P.t,0,y-.12,0);return g;}
function ltHammer(P){const g=new THREE.Group(),L=.86,gr=.26,y=L-gr-.04;ltHaft(g,P,L,gr);bx(g,.22,.1,.1,P.m,0,y,0);bx(g,.06,.14,.14,P.blade,-.13,y,0);bx(g,.02,.1,.1,P.ml,-.17,y,0);
  bx(g,.07,.06,.05,P.blade,.14,y,0);bx(g,.06,.035,.03,P.blade,.2,y,0);bx(g,.04,.02,.02,P.blade,.245,y,0);bx(g,.04,.08,.04,P.m,0,y+.09,0);for(const d of[-1,1])bx(g,.07,.025,.11,P.t,0,y+d*.05,0);
  if(P.ec)bx(g,.035,.035,.104,P.rune,0,y,0,0,0,Math.PI/4);return g;}
function ltSpear(P){const g=new THREE.Group(),y0=1.22;bx(g,.045,1.94,.045,P.w,0,y0-.97,0);bx(g,.055,.05,.055,P.m,0,y0-1.94,0);for(let y=-.12;y<.14;y+=.05)bx(g,.052,.016,.052,P.g,0,y,0);
  bx(g,.06,.12,.06,P.m,0,y0+.06,0);if(P.v[3]>.4)bx(g,.07,.1,.07,P.cloth,0,y0-.05,0);
  [.05,.075,.09,.09,.08,.065,.05,.035,.02].forEach((w,i)=>bx(g,w,.052,.024,P.blade,0,y0+.15+i*.05,0));bx(g,.016,.4,.03,P.ec?P.rune:P.md,0,y0+.32,0);if(P.lvl>=3)bx(g,.04,.04,.07,P.gem,0,y0+.06,0,0,0,Math.PI/4);return g;}
function ltHalberd(P){const g=new THREE.Group(),y0=1.32;bx(g,.045,2.12,.045,P.w,0,y0-1.06,0);bx(g,.055,.05,.055,P.m,0,y0-2.12,0);for(let y=-.12;y<.14;y+=.05)bx(g,.052,.016,.052,P.g,0,y,0);
  bx(g,.06,.3,.06,P.m,0,y0,0);for(const s of[-1,1])bx(g,.012,.5,.05,P.m,s*.03,y0-.3,0);
  [.05,.06,.05,.035,.02].forEach((w,i)=>bx(g,w,.06,.024,P.blade,0,y0+.18+i*.06,0));
  for(let i=0;i<5;i++){const h=.3-i*.035;bx(g,.045,h,.028,i===4?P.blade:P.m,.06+i*.042,y0+.02-i*.012,0);}bx(g,.02,.2,.032,P.blade,.25,y0-.03,0);
  for(let i=0;i<4;i++)bx(g,.045,.05-i*.006,.026,P.m,-.06-i*.04,y0+.02-i*i*.012,0);if(P.ec)bx(g,.035,.035,.034,P.rune,.12,y0+.02,0,0,0,Math.PI/4);return g;}
function ltBow(P){const g=new THREE.Group(),n=7,H=.62,st=ltMat('#d9d3c1',{r:.9});let tip=0;
  for(let i=-n;i<=n;i++){if(i===0)continue;const a=Math.abs(i)/n,x=-.16*a*a+(Math.abs(i)===n?.025:0),w=.05-.022*a;bx(g,w,H/n+.02,.04,P.w,x,i*H/n,0);if(Math.abs(i)===n)tip=x;
    if(P.ec&&Math.abs(i)%3===2)bx(g,.02,.03,.046,P.rune,x,i*H/n,0);if(P.lvl>=2&&Math.abs(i)===n-2)bx(g,w+.012,.02,.046,P.t,x,i*H/n,0);}
  bx(g,.06,.16,.05,P.g,0,0,0);for(const s of[-1,1]){bx(g,.066,.02,.056,P.t,0,s*.085,0);bx(g,.03,.04,.044,P.t,tip,s*(H+.02),0);}
  bx(g,.008,2*H+.04,.008,st,tip-.012,0,0);if(P.lvl>=3)bx(g,.04,.04,.06,P.gem,.02,0,0,0,0,Math.PI/4);return g;}
function ltStaff(P){const g=new THREE.Group();for(let i=0;i<14;i++){const y=-.55+i*.13,x=.012*Math.sin(i*1.7);bx(g,.06,.14,.06,i%4===2?P.wd:P.w,x,y,0);if(i%5===3)bx(g,.075,.05,.075,P.wd,x,y+.03,0);}
  for(let y=-.1;y<.14;y+=.05)bx(g,.068,.016,.068,P.g,0,y,0);const top=1.32;bx(g,.09,.05,.09,P.t,0,top-.04,0);
  for(let k=0;k<3;k++){const p=new THREE.Group();put(g,p,0,top,0,0,k*Math.PI*2/3,0);bx(p,.03,.1,.03,P.wd,.06,.04,0);bx(p,.03,.1,.03,P.wd,.095,.13,0);bx(p,.03,.08,.03,P.wd,.07,.22,0);}
  const o=new THREE.Group();put(g,o,0,top+.15,0);for(const[a,b,c]of[[.12,.12,.12],[.15,.08,.08],[.08,.15,.08],[.08,.08,.15]])bx(o,a,b,c,P.orb,0,0,0).userData.ench=1;
  if(P.lvl>=2)for(const y of[top-.15,top-.07])bx(g,.07,.02,.07,P.t,0,y,0);return g;}
function ltWand(P){const g=new THREE.Group();bx(g,.04,.14,.04,P.g,0,-.05,0);bx(g,.05,.03,.05,P.t,0,-.13,0);bx(g,.05,.03,.05,P.t,0,.03,0);bx(g,.034,.14,.034,P.w,0,.11,0);bx(g,.026,.12,.026,P.w,0,.24,0);
  bx(g,.04,.03,.04,P.t,0,.31,0);const c=bx(g,.045,.045,.045,P.orb,0,.355,0,0,0,Math.PI/4);c.userData.ench=1;bx(g,.025,.06,.025,P.orb,0,.39,0).userData.ench=1;return g;}
function ltDiscV(g,R,c,z,d,mat,inner){for(let x=-R+c/2;x<R;x+=c){const h=Math.round(Math.sqrt(Math.max(0,R*R-x*x))/c)*c;if(h>0)bx(g,c,2*h,d,inner&&Math.abs(x)<inner?inner.mat:mat,x,0,z);}}
function ltRoundShield(P){const g=new THREE.Group(),R=.4;ltDiscV(g,R,.06,0,.05,P.w);ltDiscV(g,R-.04,.06,.03,.012,P.cloth);ltDiscV(g,.25,.05,.04,.012,P.cloth2);
  for(let i=0;i<20;i++){const a=i/20*Math.PI*2;bx(g,.08,.08,.07,P.m,Math.cos(a)*(R-.02),Math.sin(a)*(R-.02),.005,0,0,a);}
  bx(g,.14,.14,.06,P.m,0,0,.06);bx(g,.08,.08,.04,P.ml,0,0,.1);for(let i=0;i<8;i++){const a=i/8*Math.PI*2+.39;bx(g,.035,.035,.03,P.t,Math.cos(a)*.31,Math.sin(a)*.31,.045);}
  if(P.ec)for(let i=0;i<6;i++){const a=i/6*Math.PI*2;bx(g,.03,.03,.02,P.rune,Math.cos(a)*.19,Math.sin(a)*.19,.05,0,0,Math.PI/4);}
  if(P.lvl>=3)bx(g,.05,.05,.03,P.gem,0,0,.12,0,0,Math.PI/4);bx(g,.3,.05,.04,P.g,0,0,-.045);return g;}
function ltKite(P){const g=new THREE.Group(),rows=[[.5,.06],[.58,.1],[.6,.14],[.6,.14],[.57,.12],[.52,.12],[.44,.1],[.34,.1],[.22,.08],[.1,.06]];let y=.5;
  rows.forEach(([w,h],i)=>{y-=h/2;bx(g,w/2,h,.05,P.cloth,-w/4,y,0);bx(g,w/2,h,.05,P.cloth2,w/4,y,0);bx(g,w,h,.02,P.w,0,y,-.035);for(const s of[-1,1])bx(g,.04,h,.065,P.m,s*w/2,y,0);
    const nx=rows[i+1]?rows[i+1][0]:0;if(nx<w)for(const s of[-1,1])bx(g,(w-nx)/2+.04,.04,.065,P.m,s*(w+nx)/4,y-h/2,0);y-=h/2;});
  bx(g,.52,.04,.065,P.m,0,.5,0);bx(g,.08,.04,.065,P.m,0,y,0);bx(g,.12,.12,.03,P.t,0,.22,.035,0,0,Math.PI/4);if(P.lvl>=3)bx(g,.05,.05,.03,P.gem,0,.22,.05,0,0,Math.PI/4);
  if(P.ec)for(const s of[-1,1])bx(g,.03,.03,.02,P.rune,s*.14,.38,.03,0,0,Math.PI/4);bx(g,.06,.3,.04,P.g,0,.15,-.06);return g;}
function ltTower(P){const g=new THREE.Group(),W=.72,H=1.2;for(let i=0;i<6;i++)bx(g,W/6,H,.05,i%2?P.w:P.wd,-W/2+W/12+i*W/6,0,0);bx(g,W-.08,H-.1,.012,P.cloth,0,0,.03);
  for(const y of[-H/2+.03,0,H/2-.03])bx(g,W+.02,.06,.07,P.m,0,y,0);for(const s of[-1,1])bx(g,.05,H,.07,P.m,s*W/2,0,0);
  bx(g,.16,.16,.03,P.t,0,.28,.04,0,0,Math.PI/4);bx(g,.16,.16,.03,P.t,0,-.28,.04,0,0,Math.PI/4);if(P.lvl>=3)for(const y of[.28,-.28])bx(g,.05,.05,.03,P.gem,0,y,.06,0,0,Math.PI/4);
  for(const x of[-.28,.28])for(const y of[.5,-.5])bx(g,.04,.04,.03,P.t,x,y,.045);if(P.ec)for(const y of[.14,-.14])bx(g,.03,.03,.02,P.rune,0,y,.04,0,0,Math.PI/4);bx(g,.3,.05,.04,P.g,0,0,-.045);return g;}

/* ---------- armour (built upright: front +z, bottom at y=0) ---------- */
function ltHelm(P,o){const g=new THREE.Group(),m=P.m,t=P.t,st=o.style||'nasal',dk=P.dark;
  if(st==='great'){bx(g,.36,.44,.38,m,0,.22,0);bx(g,.3,.05,.32,m,0,.465,0);bx(g,.28,.035,.02,dk,0,.31,.191);for(let i=0;i<6;i++)bx(g,.025,.025,.02,dk,.06+(i%3)*.05,.2-Math.floor(i/3)*.05,.191);
    bx(g,.37,.035,.39,t,0,.39,0);bx(g,.37,.03,.39,t,0,.015,0);if(P.lvl>=3)bx(g,.05,.05,.02,P.gem,-.1,.19,.195,0,0,Math.PI/4);if(P.ec)for(const s of[-1,1])bx(g,.03,.03,.02,P.rune,s*.08,.39,.198,0,0,Math.PI/4);return g;}
  bx(g,.36,.2,.38,m,0,.1,0);bx(g,.32,.1,.34,m,0,.25,0);bx(g,.22,.06,.24,m,0,.33,0);bx(g,.37,.04,.39,t,0,.17,0);bx(g,.26,.13,.012,dk,0,.065,.188);
  if(st==='nasal'){bx(g,.05,.15,.03,m,0,.075,.2);for(const s of[-1,1])bx(g,.06,.15,.12,m,s*.16,.075,.12);}
  if(st==='horned')for(const s of[-1,1]){const hm=ltMat('#d9d0bc',{r:.8});[[.2,.2,.07],[.25,.24,.06],[.285,.3,.05],[.3,.37,.04],[.295,.42,.03]].forEach(([x,y,w],i)=>bx(g,w,.07,w,i===4?P.dark:hm,s*x,y,0));}
  if(st==='winged')for(const s of[-1,1])for(let i=0;i<3;i++)bx(g,.03,.22-.04*i,.08,i===0?t:P.ml,s*(.19+i*.03),.28+i*.02,-.03-i*.04,0,0,-s*(.3+.25*i));
  if(st==='crowned'){bx(g,.35,.04,.37,t,0,.24,0);for(let i=0;i<8;i++){const a=i/8*Math.PI*2;bx(g,.04,.07,.04,t,Math.cos(a)*.16,.29,Math.sin(a)*.17);}bx(g,.04,.04,.03,P.gem,0,.24,.19,0,0,Math.PI/4);}
  if(P.lvl>=3&&st==='nasal'&&P.v[3]>.35)[[0,.38,0],[0,.42,-.05],[0,.44,-.11],[0,.43,-.17],[0,.39,-.22]].forEach(([x,y,z])=>bx(g,.05,.07,.07,P.cloth,x,y,z));
  if(P.lvl>=3&&st!=='crowned')for(const s of[-1,1])bx(g,.04,.04,.02,P.gem,s*.1,.17,.196,0,0,Math.PI/4);if(P.ec)for(const s of[-1,1])bx(g,.03,.03,.02,P.rune,s*.05,.17,.198,0,0,Math.PI/4);return g;}
function ltCuirass(P){const g=new THREE.Group(),m=P.m,t=P.t;bx(g,.46,.5,.07,P.md,0,.25,-.09);bx(g,.46,.4,.1,m,0,.2,0);bx(g,.3,.12,.1,m,0,.46,0);bx(g,.38,.28,.05,m,0,.25,.07);bx(g,.26,.12,.04,m,0,.29,.11);
  bx(g,.035,.24,.03,P.ml,0,.29,.135);bx(g,.42,.1,.06,P.ml,0,.06,.07);bx(g,.44,.03,.065,t,0,.115,.075);bx(g,.47,.03,.11,t,0,.015,0);bx(g,.32,.03,.11,t,0,.535,0);
  for(const s of[-1,1]){bx(g,.03,.12,.105,t,s*.165,.46,0);bx(g,.07,.035,.2,P.g,s*.11,.535,-.05);bx(g,.04,.04,.02,t,s*.11,.5,.06);}
  if(P.lvl>=3)bx(g,.06,.06,.03,P.gem,0,.45,.06,0,0,Math.PI/4);if(P.ec)for(const x of[-.12,0,.12])bx(g,.035,.035,.065,P.rune,x,.06,.08,0,0,Math.PI/4);return g;}
function ltMail(P){const g=new THREE.Group(),mm=ltMat(ltShade(P.mh,1.1),{tex:'mail',r:.7});bx(g,.56,.08,.44,mm,0,.04,0);for(const s of[-1,1])bx(g,.13,.05,.42,mm,s*.2,.105,0);bx(g,.26,.06,.12,mm,0,.11,-.15);
  bx(g,.56,.03,.04,P.t,0,.02,.22);bx(g,.3,.035,.035,P.g,0,.0975,.12);bx(g,.05,.04,.045,P.t,0,.1,.12);if(P.lvl>=3)bx(g,.04,.03,.04,P.gem,0,.15,-.15,0,Math.PI/4,0);
  if(P.ec)for(const z of[-.02,.06])bx(g,.03,.03,.03,P.rune,0,.085,z,0,Math.PI/4,0);return g;}
function ltJerkin(P){const g=new THREE.Group(),L=P.g,Ld=P.gd,t=P.t;bx(g,.46,.06,.5,L,0,.03,.02);for(const s of[-1,1])bx(g,.12,.06,.1,L,s*.17,.03,-.28);
  bx(g,.2,.07,.06,Ld,0,.035,-.2);for(const z of[-.08,.06,.18]){bx(g,.34,.065,.035,Ld,0,.0325,z);bx(g,.045,.07,.05,t,.08,.035,z);}
  for(let z=-.18;z<.26;z+=.08)for(const s of[-1,1])bx(g,.025,.07,.025,t,s*.2,.035,z);bx(g,.48,.065,.04,Ld,0,.0325,.27);
  if(P.lvl>=3)bx(g,.04,.03,.04,P.gem,0,.075,-.2,0,Math.PI/4,0);if(P.ec)for(const s of[-1,1])bx(g,.03,.03,.03,P.rune,s*.1,.065,-.13,0,Math.PI/4,0);return g;}
function ltGauntlets(P){const g=new THREE.Group(),m=P.m;for(const s of[-1,1]){const h=new THREE.Group();put(g,h,s*.12,0,0,0,s*.25,0);
    bx(h,.14,.09,.13,m,0,.045,-.13);bx(h,.16,.1,.04,P.t,0,.05,-.2);bx(h,.12,.06,.11,m,0,.03,-.01);bx(h,.13,.03,.04,P.ml,0,.065,.03);
    for(let i=0;i<4;i++){const x=-.045+i*.03;bx(h,.026,.035,.1,m,x,.0175,.1);bx(h,.028,.04,.02,P.md,x,.02,.07);}bx(h,.03,.035,.08,m,-s*.075,.0175,.02,0,-s*.5,0);
    if(P.ec)bx(h,.035,.012,.035,P.rune,0,.066,-.03,0,Math.PI/4,0);if(P.lvl>=3)bx(h,.04,.02,.04,P.gem,0,.1,-.13,0,Math.PI/4,0);}return g;}
function ltBoots(P,o){const g=new THREE.Group(),m=P.m,plate=o.metal!=='leather';for(const s of[-1,1]){const b=new THREE.Group();put(g,b,s*.1,0,0,0,s*.1,0);
    bx(b,.14,.025,.27,P.dark,0,.0125,.035);bx(b,.13,.1,.25,m,0,.075,.035);bx(b,.13,.3,.14,m,0,.25,-.03);bx(b,.15,.04,.16,P.t,0,.41,-.03);bx(b,.1,.06,.04,m,0,.06,.18);
    if(plate)for(const z of[.07,.12])bx(b,.135,.025,.05,P.ml,0,.135,z);if(P.ec)bx(b,.035,.035,.02,P.rune,0,.28,.045,0,0,Math.PI/4);if(P.lvl>=3)bx(b,.04,.04,.02,P.gem,0,.41,.055,0,0,Math.PI/4);}return g;}
function ltGreaves(P){const g=new THREE.Group(),m=P.m;for(const s of[-1,1]){const h=new THREE.Group();put(g,h,s*.11,0,0,0,s*.12,0);bx(h,.13,.07,.4,m,0,.035,0);bx(h,.16,.1,.12,m,0,.05,-.24);bx(h,.1,.04,.08,P.ml,0,.12,-.24);
    for(const z of[-.06,.1])bx(h,.14,.075,.03,P.g,0,.0375,z);bx(h,.14,.075,.03,P.t,0,.0375,.205);if(P.ec)bx(h,.035,.02,.035,P.rune,0,.071,.02,0,Math.PI/4,0);if(P.lvl>=3)bx(h,.04,.02,.04,P.gem,0,.142,-.24,0,Math.PI/4,0);}return g;}
function ltPauldrons(P){const g=new THREE.Group(),m=P.m;for(const s of[-1,1]){const h=new THREE.Group();put(g,h,s*.17,0,0,0,-s*.2,0);bx(h,.22,.08,.2,m,0,.04,0);bx(h,.16,.04,.14,m,0,.1,0);
    bx(h,.22,.06,.07,P.md,0,.03,.13);bx(h,.2,.05,.07,m,0,.025,.19);bx(h,.21,.055,.02,P.t,0,.0275,.23);bx(h,.23,.03,.21,P.t,0,.015,0);
    if(P.lvl>=3&&P.v[4]>.3)for(const x of[-.05,0,.05]){bx(h,.03,.05,.03,P.ml,x,.145,0);bx(h,.016,.04,.016,P.ml,x,.19,0);}if(P.ec)bx(h,.035,.012,.035,P.rune,0,.126,.03,0,Math.PI/4,0);}return g;}
function ltBelt(P){const g=new THREE.Group(),L=P.g,t=P.t;for(const s of[-1,1]){bx(g,.36,.014,.05,L,0,.007,s*.15);bx(g,.05,.014,.22,L,s*.22,.007,0);for(const z of[-1,1])bx(g,.07,.014,.05,L,s*.2,.007,z*.13,0,s*z*Math.PI/4,0);}
  for(const z of[-.035,.035])bx(g,.08,.024,.014,t,0,.012,.15+z);for(const s of[-1,1])bx(g,.014,.024,.084,t,s*.04,.012,.15);bx(g,.06,.02,.01,t,.01,.016,.15);
  bx(g,.12,.1,.07,P.gd,.13,.05,.21);bx(g,.12,.03,.075,L,.13,.09,.21);bx(g,.025,.025,.01,t,.13,.07,.25);if(P.lvl>=3)bx(g,.03,.03,.02,P.gem,0,.03,.15,0,Math.PI/4,0);
  if(P.ec)for(const x of[-.12,.12])bx(g,.03,.012,.03,P.rune,x,.016,-.15,0,Math.PI/4,0);return g;}
function ltCloak(P){const g=new THREE.Group();bx(g,.5,.05,.4,P.cloth,0,.025,0);bx(g,.48,.05,.38,ltMat(ltShade(P.clh,.75),{tex:'cloth',r:.95}),0,.075,.005);bx(g,.46,.05,.36,P.cloth,0,.125,.01);
  bx(g,.04,.15,.4,ltMat(ltShade(P.clh,.6),{tex:'cloth',r:.95}),.25,.075,0);if(P.lvl>=2)bx(g,.46,.06,.08,ltMat(P.lvl>=3?'#d9d6d0':'#675b4e',{tex:'hair',r:1}),0,.18,-.15);
  bx(g,.07,.025,.07,P.t,0,.163,.06,0,Math.PI/4,0);if(P.lvl>=2)bx(g,.035,.02,.035,P.gem,0,.18,.06,0,Math.PI/4,0);if(P.ec)for(const x of[-.15,.15])bx(g,.03,.012,.03,P.rune,x,.156,.12,0,Math.PI/4,0);return g;}

/* ---------- potions (upright) ---------- */
const LT_BREW={health:['Health potion','#bb5458','flask'],mana:['Mana potion','#4b71a8','tall'],stamina:['Stamina potion','#5bcb68','square'],rejuv:['Rejuvenation potion','#b856bf','heart'],
  poison:['Poison','#aad660','vial'],antidote:['Antidote','#b6d9a0','cone'],strength:['Strength potion','#d18d5e','square'],swift:['Swiftness potion','#60d6d4','tall'],invis:['Invisibility potion','#bfd2d9','flask'],luck:['Luck potion','#d9b762','cone']};
const LT_BOTTLE={flask:{L:[[.14,.03],[.22,.04],[.27,.09],[.22,.04],[.14,.03]],n:[.07,.1]},tall:{L:[[.13,.03],[.16,.24],[.12,.03]],n:[.06,.1]},square:{L:[[.2,.2],[.14,.03]],n:[.07,.07]},
  vial:{L:[[.06,.02],[.075,.22]],n:[.06,.02]},cone:{L:[[.24,.04],[.21,.05],[.17,.05],[.13,.05],[.09,.04]],n:[.07,.09]},heart:{L:[[.04,.035,.1],[.1,.035,.1],[.15,.035,.1],[.19,.035,.1],[.21,.035,.1],[.21,.035,.1]],n:[.05,.09]}};
const LT_GLASS=new THREE.MeshStandardMaterial({color:0xc7d8d9,transparent:true,opacity:.36,roughness:.08,metalness:.1,depthWrite:false}),LT_GLASSN=new THREE.MeshStandardMaterial({color:0xc1d6d9,transparent:true,opacity:.6,roughness:.1,metalness:.1,depthWrite:false});
function ltGlass(g,w,h,d,x,y,z,mat){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);g.add(m);return m;}
function ltPotion(P,o,brew){const g=new THREE.Group(),b=new THREE.Group();g.add(b);const[,hex]=LT_BREW[brew],sh=o.shape==='default'||!o.shape?LT_BREW[brew][2]:o.shape,B=LT_BOTTLE[sh],G=LT_GLASS,GN=LT_GLASSN,lq=ltLiquid(hex,brew==='invis'?.3:.8);
  b.scale.setScalar({small:.75,medium:1,large:1.35}[o.size]||1);const H=B.L.reduce((a,l)=>a+l[1],0),fill=H*(sh==='vial'?.82:.8);let y=0,big=B.L[0];
  for(const[w,h,dd]of B.L){const d=dd??w;ltGlass(b,w,h,d,0,y+h/2,0,G);if(y<fill){const lh=Math.min(h,fill-y)-(y===0?.008:0);if(lh>.004)ltGlass(b,w*.84,lh,d*.84,0,y+(y===0?.006:0)+lh/2,0,lq).userData.liquid=1;}if(w*h>big[0]*big[1])big=[w,h,d,y];y+=h;}
  if(sh==='heart'){for(const s of[-1,1]){ltGlass(b,.09,.05,.1,s*.055,y+.025,0,G);ltGlass(b,.075,.04,.084,s*.055,y+.02,0,lq).userData.liquid=1;}}
  const[nw,nh]=B.n,ny=sh==='heart'?y-.01:y;ltGlass(b,nw,nh,nw,0,ny+nh/2,0,GN);const top=ny+nh;ltGlass(b,nw*1.3,.02,nw*1.3,0,top-.01,0,GN);
  if(P.lvl>=3){const wx=ltMat(ltShade(P.rc,.8),{r:.5});bx(b,nw*1.35,.045,nw*1.35,wx,0,top+.02,0);for(const[x,z,h]of[[1,0,.05],[-1,.3,.035],[0,-1,.045]])bx(b,.018,h,.018,wx,x*nw*.62,top-h/2,z*nw*.62);}
  else bx(b,nw*.82,.06,nw*.82,ltMat('#a07e5a',{tex:'leather',r:1}),0,top+.015,0);
  if(P.lvl>=1)bx(b,nw*1.1,.014,nw*1.1,ltMat('#c5b89a',{r:1}),0,ny+nh*.45,0);
  const[bw,bh,bd,by]=[big[0],big[1],big[2]??big[0],big[3]??0];if(sh!=='vial'&&bh>.06){bx(b,bw*.6,bh*.5,.006,P.paper,0,by+bh/2,bd/2+.003);bx(b,.03,.03,.008,ltMat(hex,{r:.8}),0,by+bh/2,bd/2+.006,0,0,Math.PI/4);}
  P.bubble=ltShade(hex,1.4);P.lq=hex;return g;}

/* ---------- treasure ---------- */
const LT_COIN={gold:'#d8bb61',silver:'#ced4d9',bronze:'#b17450',iron:'#8c8f97',mithril:'#c1cfd9'};
function ltCoin(g,cm,x,y,z,k,ry){const h=k*.013;bx(g,.07,h,.07,cm,x,y+h/2,z,0,ry,0);bx(g,.07,h,.07,cm,x,y+h/2,z,0,ry+Math.PI/4,0);return h;}
function ltCoins(P,o){const g=new THREE.Group(),r=P.r,cm=ltMat(LT_COIN[o.metal]||LT_COIN.gold,{r:.4,m:.25}),amt=o.amount||'pile';
  if(amt==='few'){[[0,0,4],[.1,.03,2],[-.06,.09,1],[.04,-.1,1],[-.11,-.04,1]].forEach(([x,z,n])=>{let y=0;for(let i=0;i<n;i++)y+=ltCoin(g,cm,x+(r()-.5)*.012,y,z+(r()-.5)*.012,1,r()*1.5);});return g;}
  const R=amt==='hoard'?.36:.2,mx=amt==='hoard'?12:6,c=.075,tops=[];
  for(let x=-R;x<=R+1e-6;x+=c)for(let z=-R;z<=R+1e-6;z+=c){const d=Math.hypot(x,z)/R;if(d>1)continue;const n=Math.max(1,Math.round((1-d*d)*mx*(.75+.5*r())));let y=0;
    for(let i=0;i<n;){const k=Math.min(n-i,1+Math.floor(r()*3));y+=ltCoin(g,cm,x+(r()-.5)*.02,y,z+(r()-.5)*.02,k,r()*1.5);i+=k;}tops.push([x,y,z]);}
  for(let i=0;i<(amt==='hoard'?14:7);i++){const a=r()*Math.PI*2,d=R+.06+r()*.12;ltCoin(g,cm,Math.cos(a)*d,0,Math.sin(a)*d,1,r()*1.5);}
  if(amt==='hoard')for(let i=0;i<4;i++){const gm=ltMat(ltShade(Object.values(LT_GEMS)[i][1],1.1),{e:Object.values(LT_GEMS)[i][1],ei:.8,r:.15});const[x,y,z]=tops[Math.floor((i*.23+.1)*tops.length)];bx(g,.05,.04,.05,gm,x,y+.02,z,0,i*1.7,0);}
  return g;}
function ltPouch(P,o){const g=new THREE.Group(),cm=ltMat(LT_COIN[o.metal]||LT_COIN.gold,{r:.4,m:.25}),L=P.g;bx(g,.22,.16,.2,L,0,.08,0);bx(g,.18,.05,.16,L,0,.185,0);bx(g,.1,.05,.1,L,0,.23,0);bx(g,.12,.02,.12,P.gd,0,.215,0);bx(g,.14,.035,.14,L,0,.27,0);
  bx(g,.02,.02,.12,P.gd,.07,.205,.1,0,0,0);for(const[x,z,n]of[[.18,.08,2],[.24,0,1],[.2,-.08,1],[.12,.16,1],[.28,.1,1]]){let y=0;for(let i=0;i<n;i++)y+=ltCoin(g,cm,x,y,z,1,x*9+i);}return g;}
function ltGemBody(g,gm,cut){const L=[[.025,.03],[.06,.03],[.1,.03],[.14,.03],[.17,.03],[.15,.025],[.1,.02]];let y=0;
  for(const[w,h]of L){if(cut==='square')bx(g,w,h,w*.78,gm,0,y+h/2,0);else{bx(g,w*.92,h,w*.92,gm,0,y+h/2,0);bx(g,w*.92,h,w*.92,gm,0,y+h/2,0,0,Math.PI/4,0);}y+=h;}if(cut==='oval')g.scale.z=1.45;return g;}
function ltGem(P,o){const k=o.gem||'ruby',hex=LT_GEMS[k][1],gm=ltMat(ltShade(hex,1.15),{e:hex,ei:k==='onyx'?.05:k==='diamond'?.35:.7,op:.85,r:.08});const g=new THREE.Group(),b=new THREE.Group();g.add(b);ltGemBody(b,gm,o.cut||'round');
  b.children.forEach(m=>m.userData.ench=1);return g;}
function ltIngots(P,o){const g=new THREE.Group(),n=+o.count||3,pos=n===1?[[0,0,0]]:n===3?[[-.065,0,0],[.065,0,0],[0,1,0]]:[[-.13,0,0],[0,0,0],[.13,0,0],[-.065,1,0],[.065,1,0],[0,2,0]];
  for(const[x,l]of pos){const y=l*.07;bx(g,.12,.035,.24,P.m,x,y+.0175,0);bx(g,.095,.035,.21,P.m,x,y+.0525,0);bx(g,.05,.003,.08,P.md,x,y+.0715,0);}return g;}
function ltRing(P){const g=new THREE.Group();for(let i=0;i<8;i++){const a=i/8*Math.PI*2;bx(g,.05,.024,.022,P.m,Math.cos(a)*.06,.012,Math.sin(a)*.06,0,-a-Math.PI/2,0);}
  bx(g,.05,.04,.04,P.m,0,.022,.075);for(const s of[-1,1])for(const t of[-1,1])bx(g,.008,.025,.008,P.ml,s*.018,.05,.075+t*.018);const gm=bx(g,.035,.03,.035,P.gem,0,.055,.075,0,Math.PI/4,0);gm.userData.ench=1;return g;}
function ltAmulet(P){const g=new THREE.Group(),n=26;for(let i=0;i<n;i++){const u=i/n,a=Math.PI/2+u*Math.PI*2,x=Math.cos(a)*.14*(1-.25*Math.cos(a)),z=Math.sin(a)*.12-.02,an=Math.atan2(Math.cos(a)*.12,-Math.sin(a)*.14);if(u<.04||u>.96)continue;bx(g,.022,.012,.012,P.m,x,.006+(i%2)*.002,z,0,an,0);}
  const pd=new THREE.Group();put(g,pd,0,0,.15);bx(pd,.12,.02,.12,P.t,0,.01,0,0,Math.PI/4,0);bx(pd,.08,.024,.08,P.m,0,.014,0,0,Math.PI/4,0);bx(pd,.03,.016,.04,P.t,0,.008,-.085);bx(pd,.05,.03,.05,P.gem,0,.03,0,0,Math.PI/4,0).userData.ench=1;
  for(const s of[-1,1])bx(pd,.025,.022,.025,P.gem,s*.06,.016,0,0,Math.PI/4,0);return g;}
function ltCrown(P){const g=new THREE.Group(),n=12,R=.12;for(let i=0;i<n;i++){const a=i/n*Math.PI*2;bx(g,.068,.07,.022,P.m,Math.cos(a)*R,.035,Math.sin(a)*R,0,-a-Math.PI/2,0);if(i%2===0){bx(g,.04,.06,.02,P.m,Math.cos(a)*R,.1,Math.sin(a)*R,0,-a-Math.PI/2,0);bx(g,.024,.04,.016,P.m,Math.cos(a)*R,.15,Math.sin(a)*R,0,-a-Math.PI/2,0);bx(g,.025,.025,.025,P.ml,Math.cos(a)*R,.18,Math.sin(a)*R,0,0,Math.PI/4);}
    else{bx(g,.03,.03,.012,i%4===1?P.gem:ltMat('#c9524d',{e:'#c9524d',ei:.6,r:.15}),Math.cos(a)*(R+.012),.035,Math.sin(a)*(R+.012),0,-a-Math.PI/2,Math.PI/4);}}
  bx(g,.27,.014,.27,P.t,0,.007,0,0,Math.PI/8,0);if(P.lvl>=2){bx(g,.2,.05,.2,P.cloth,0,.07,0);bx(g,.14,.04,.14,P.cloth,0,.11,0);}return g;}
function ltGoblet(P){const g=new THREE.Group();bx(g,.14,.02,.14,P.m,0,.01,0);bx(g,.14,.02,.14,P.m,0,.01,0,0,Math.PI/4,0);bx(g,.08,.02,.08,P.m,0,.03,0);bx(g,.03,.12,.03,P.m,0,.1,0);bx(g,.06,.03,.06,P.t,0,.11,0);
  bx(g,.08,.02,.08,P.m,0,.17,0);const c=new THREE.Group();put(g,c,0,.18,0);hollow(c,.14,.13,.14,.018,P.m);bx(c,.15,.02,.15,P.t,0,.12,0);bx(c,.11,.006,.11,ltMat('#492125',{r:.2}),0,.1,0);
  for(let i=0;i<4;i++){const a=i*Math.PI/2;bx(g,.03,.03,.012,P.gem,Math.sin(a)*.076,.24,Math.cos(a)*.076,0,a,Math.PI/4);}return g;}
function ltScroll(P){const g=new THREE.Group(),pp=P.paper,pd=ltMat('#c5b89a',{tex:'cloth',r:1});bx(g,.36,.08,.06,pp,0,.04,0);bx(g,.36,.06,.08,pp,0,.04,0);for(const s of[-1,1])bx(g,.02,.05,.05,pd,s*.185,.04,0);
  bx(g,.05,.085,.085,P.cloth,0,.04,0);bx(g,.05,.05,.02,ltMat(ltShade(P.rc,.7),{r:.5}),0,.04,.05);bx(g,.025,.025,.006,ltMat(ltShade(P.rc,.5),{r:.5}),0,.04,.062,0,0,Math.PI/4);
  bx(g,.3,.008,.18,pp,0,.004,.13);const ink=P.ec?P.rune:ltMat('#372b20',{r:1});for(let l=0;l<3;l++)for(let i=0;i<6;i++)if((i+l)%4!==3)bx(g,.03,.004,.012,ink,-.1+i*.04,.01,.08+l*.04);return g;}
function ltBook(P){const g=new THREE.Group(),cv=P.lvl>=3?ltMat(ltShade(P.clh,.8),{tex:'leather',r:.8}):P.g,pg=ltMat('#d9d2c2',{r:1});bx(g,.32,.025,.4,cv,0,.0125,0);bx(g,.29,.09,.37,pg,.01,.07,0);bx(g,.32,.025,.4,cv,0,.1275,0);bx(g,.03,.14,.4,cv,-.155,.07,0);
  for(const x of[-1,1])for(const z of[-1,1])bx(g,.05,.03,.05,P.t,x*.14,.13,z*.18);bx(g,.03,.1,.06,P.t,.16,.09,0);bx(g,.02,.03,.04,P.t,.155,.14,0);
  bx(g,.13,.012,.13,P.t,0,.144,0,0,Math.PI/4,0);bx(g,.09,.014,.09,cv,0,.146,0,0,Math.PI/4,0);bx(g,.05,.03,.05,P.ec?P.orb:P.gem,0,.155,0,0,Math.PI/4,0).userData.ench=1;
  if(P.ec)for(let i=0;i<8;i++){const a=i/8*Math.PI*2;bx(g,.02,.006,.02,P.rune,Math.cos(a)*.11,.143,Math.sin(a)*.14,0,Math.PI/4,0);}return g;}
function ltKey(P){const g=new THREE.Group(),m=P.m,st=Math.floor(P.v[2]*3);bx(g,.22,.022,.026,m,.03,.011,0);bx(g,.03,.03,.04,P.t,-.07,.015,0);
  if(st===0)for(const s of[-1,1]){bx(g,.11,.022,.022,m,-.15,.011,s*.045);bx(g,.022,.022,.11,m,-.15+s*.045,.011,0);}
  else if(st===1){const f=new THREE.Group();put(g,f,-.15,0,0,0,Math.PI/4,0);for(const s of[-1,1]){bx(f,.11,.022,.022,m,0,.011,s*.045);bx(f,.022,.022,.11,m,s*.045,.011,0);}}
  else for(const[x,z]of[[-.12,.045],[-.12,-.045],[-.19,0]])for(let i=0;i<6;i++){const a=i/6*Math.PI*2;bx(g,.03,.022,.016,m,x+Math.cos(a)*.03,.011,z+Math.sin(a)*.03,0,-a-Math.PI/2,0);}
  for(const[x,w]of[[.12,.05],[.07,.035]])bx(g,.024,.022,w,m,x+.0,.011,.026+w/2-.01);bx(g,.02,.022,.03,m,.135,.011,.03);if(P.lvl>=3&&st<2)bx(g,.04,.03,.04,P.gem,-.15,.015,0,0,Math.PI/4,0).userData.ench=1;return g;}
const LT_GLYPH=[[[.5,0,1,.5],[1,.5,.5,1],[.5,1,0,.5],[0,.5,.5,0]],[[.2,0,.8,.25],[.8,.25,.2,.5],[.2,.5,.8,.75],[.8,.75,.2,1]],[[.3,0,.3,1],[.3,.62,.8,.92],[.3,.32,.8,.62]],[[.5,.1,.95,.9],[.95,.9,.05,.9],[.05,.9,.5,.1]],[[.2,1,.5,0],[.5,0,.8,1],[.35,.5,.65,.5]]];
function ltRuneStone(P){const g=new THREE.Group(),st=ltMat('#818189',{tex:'leather',r:.95}),sd=ltMat('#66656d',{tex:'leather',r:.95});bx(g,.3,.07,.38,sd,0,.035,0);bx(g,.26,.04,.34,st,0,.09,0);bx(g,.32,.05,.3,sd,0,.025,0);
  const gl=P.ec?P.rune:ltMat(ltShade(P.rc,1.2),{e:P.rc,ei:1.8});const gy=LT_GLYPH[Math.floor(P.v[5]*LT_GLYPH.length)],W=.16,D=.24;
  for(const[a,b,c,d]of gy){const x1=-W/2+a*W,z1=-D/2+b*D,x2=-W/2+c*W,z2=-D/2+d*D,l=Math.hypot(x2-x1,z2-z1);bx(g,l+.02,.008,.022,gl,(x1+x2)/2,.112,(z1+z2)/2,0,-Math.atan2(z2-z1,x2-x1),0).userData.ench=1;}return g;}
function ltCrystal(P){const g=new THREE.Group(),r=P.r,rk=ltMat('#5c5b63',{tex:'leather',r:.95});bx(g,.3,.06,.26,rk,0,.03,0);bx(g,.2,.05,.18,rk,.02,.08,-.01);
  const cm=P.orb;[[0,0,.1,.34,0,0],[.07,.03,.07,.22,.35,.3],[-.07,.02,.07,.2,-.4,.2],[.02,-.06,.06,.16,.2,-.45],[-.03,.07,.05,.14,-.25,.5]].forEach(([x,z,w,h,rz,rx])=>{const c=new THREE.Group();put(g,c,x,.08,z,rx,0,rz);
    bx(c,w,h,w,cm,0,h/2,0).userData.ench=1;bx(c,w*.62,w*.6,w*.62,cm,0,h+w*.3,0).userData.ench=1;bx(c,w*.28,w*.4,w*.28,cm,0,h+w*.75,0).userData.ench=1;});return g;}
function ltSack(P){const g=new THREE.Group(),s=vm('burlap'),cm=ltMat(LT_COIN.gold,{r:.4,m:.25});bx(g,.38,.26,.34,s,0,.13,0);bx(g,.32,.08,.28,s,0,.3,0);bx(g,.16,.06,.16,s,0,.37,0);bx(g,.18,.025,.18,vm('rope'),0,.355,0);bx(g,.2,.05,.2,s,0,.42,0);
  bx(g,.03,.02,.16,vm('rope'),.09,.36,.14,.3,0,0);for(const[x,z,n]of[[.24,.12,3],[.3,.02,1],[.16,.24,2],[.06,.26,1],[.34,.16,1],[.26,-.1,1]]){let y=0;for(let i=0;i<n;i++)y+=ltCoin(g,cm,x,y,z,1,x*7+i);}
  bx(g,.05,.04,.05,P.gem,.2,.02,.2,0,.6,0).userData.ench=1;const cup=new THREE.Group();put(g,cup,-.08,.46,.02,0,0,-.4);bx(cup,.06,.08,.06,ltMat(LT_COIN.gold,{r:.4,m:.25}),0,0,0);return g;}
function ltChest(P,o){const g=new THREE.Group(),W=.6,D=.4,H=.32,wood=P.w,band=P.lvl>=3?P.t:P.lvl===2?ltMat('#d0d3d9',{r:.45,m:.2}):ltMat('#5c5d66',{r:.6,m:.15}),cm=ltMat(LT_COIN.gold,{r:.4,m:.25});
  bx(g,W,.04,D,wood,0,.02,0);hollow(g,W,H-.04,D,.04,wood,0,.04,0);for(const x of[-.2,.2]){bx(g,.05,H,.012,band,x,H/2,D/2+.006);bx(g,.05,H,.012,band,x,H/2,-D/2-.006);bx(g,.05,.012,D+.024,band,x,.006,0);}
  for(const s of[-1,1])bx(g,.012,H,D+.024,band,s*(W/2+.006),H/2,0);bx(g,.08,.08,.014,band,0,H-.06,D/2+.008);bx(g,.02,.035,.016,P.dark,0,H-.07,D/2+.009);
  bx(g,W-.1,.04,D-.1,cm,0,H-.08,0);for(let i=0;i<7;i++)ltCoin(g,cm,-.2+i*.065,H-.06,(i%3-1)*.08,1,i);bx(g,.05,.04,.05,P.gem,.1,H-.04,.03,0,.5,0).userData.ench=1;
  const lid=new THREE.Group();lid.name='lt_lid';put(g,lid,0,H,-D/2);bx(lid,W+.02,.07,D+.02,wood,0,.035,D/2);bx(lid,W+.02,.05,D-.1,wood,0,.095,D/2);for(const x of[-.2,.2])bx(lid,.05,.13,D+.04,band,x,.06,D/2);
  bx(lid,.06,.08,.014,band,0,-.01,D+.018);if(P.lvl>=3)bx(lid,.05,.05,.02,P.gem,0,.07,D+.02,0,0,Math.PI/4);if(o.open==='open')lid.rotation.x=-1.9;g.userData.lid=lid;return g;}

/* ---------- supplies ---------- */
function ltMeat(P){const g=new THREE.Group(),mt=ltMat('#7c5238',{tex:'leather',r:.8}),md=ltMat('#4e3223',{tex:'leather',r:.8}),bn=ltMat('#d9d2bf',{r:.8});bx(g,.2,.12,.18,mt,0,.06,0);bx(g,.16,.04,.14,md,0,.14,0);bx(g,.12,.09,.12,mt,.12,.045,0);
  bx(g,.04,.04,.14,bn,.24,.04,0,0,Math.PI/2,0);bx(g,.06,.06,.04,bn,.3,.03,-.015);bx(g,.06,.06,.04,bn,.3,.03,.015);return g;}
function ltBread(P){const g=new THREE.Group(),c=ltMat('#b68f5a',{tex:'leather',r:.9}),cd=ltMat('#805e3a',{tex:'leather',r:.9});bx(g,.3,.1,.16,c,0,.05,0);bx(g,.26,.05,.12,c,0,.12,0);bx(g,.2,.03,.08,c,0,.155,0);
  for(const x of[-.08,0,.08])bx(g,.02,.012,.1,ltMat('#d9c8a4',{r:1}),x,.146,0,0,.5,0);bx(g,.31,.02,.17,cd,0,.01,0);return g;}
function ltCheese(P){const g=new THREE.Group(),y=ltMat('#d9bd62',{r:.8}),rd=ltMat('#bc8a55',{r:.8}),h=ltMat('#bfa356',{r:1});for(let i=0;i<5;i++){const w=.3-i*.055;bx(g,w,.12,.05,y,-.15+w/2,.06,-.1+i*.05);}
  bx(g,.012,.12,.25,rd,-.156,.06,.025);bx(g,.3,.012,.05,rd,0,.126,-.1);for(const[x,yy,z]of[[-.05,.04,-.126],[.06,.08,-.126],[-.1,.08,-.126]])bx(g,.03,.03,.004,h,x,yy,z);return g;}
function ltApple(P){const g=new THREE.Group(),a=ltMat(P.v[6]>.5?'#a74c4b':'#8bc358',{r:.6});bx(g,.1,.06,.1,a,0,.03,0);bx(g,.12,.06,.12,a,0,.08,0);bx(g,.1,.03,.1,a,0,.125,0);bx(g,.012,.04,.012,ltMat('#543d26'),0,.15,0);bx(g,.04,.008,.025,ltMat('#4f863d'),.02,.15,0,0,0,.4);return g;}
function ltQuiver(P){const g=new THREE.Group(),L=P.g,c=new THREE.Group();put(g,c,0,.07,0,0,0,Math.PI/2);bx(c,.12,.5,.12,L,0,0,0);bx(c,.14,.04,.14,P.gd,0,.23,0);bx(c,.14,.04,.14,P.gd,0,-.15,0);bx(c,.13,.02,.13,P.t,0,-.25,0);
  for(let i=0;i<6;i++){const x=(i%3-1)*.03,z=(i<3?-1:1)*.025;bx(c,.012,.26,.012,P.w,x,.37,z);bx(c,.008,.08,.034,P.cloth,x,.44,z);bx(c,.008,.08,.034,P.cloth,x,.44,z,0,Math.PI/2,0);}
  bx(g,.02,.012,.4,L,.02,.006,.08,0,.3,0);return g;}
function ltBomb(P){const g=new THREE.Group(),m=ltMat('#2b2a2e',{r:.5,m:.2});bx(g,.2,.2,.2,m,0,.12,0);bx(g,.24,.14,.14,m,0,.12,0);bx(g,.14,.24,.14,m,0,.12,0);bx(g,.14,.14,.24,m,0,.12,0);bx(g,.07,.05,.07,P.t,0,.255,0);
  bx(g,.016,.06,.016,ltMat('#c5b89a'),.0,.3,0,0,0,.3);const sp=bx(g,.03,.03,.03,ltMat('#d9ba6f',{e:'#ed964e',ei:2}),-.015,.335,0,0,0,Math.PI/4);sp.userData.ench=1;return g;}

/* ---------- placing: lay down or hover ---------- */
function ltSettle(tilt,obj){tilt.updateMatrixWorld(true);const inv=new THREE.Matrix4().copy(tilt.matrixWorld).invert(),pts=[];
  obj.traverse(m=>{if(!m.isMesh)return;const gm=m.geometry;if(!gm.boundingBox)gm.computeBoundingBox();const b=gm.boundingBox,M=new THREE.Matrix4().multiplyMatrices(inv,m.matrixWorld);
    for(let i=0;i<8;i++)pts.push(new THREE.Vector3(i&1?b.max.x:b.min.x,i&2?b.max.y:b.min.y,i&4?b.max.z:b.min.z).applyMatrix4(M));});
  let cx=0;pts.forEach(p=>cx+=p.x);cx/=pts.length;let best=0,bc=1e9;
  for(let a=-.2;a<=.2001;a+=.002){const c=Math.cos(a),s=Math.sin(a);let L=1e9,R=1e9;for(const p of pts){const y=p.x*s+p.y*c,x=p.x*c-p.y*s;if(x<cx)L=Math.min(L,y);else R=Math.min(R,y);}const cost=Math.abs(L-R)+Math.abs(a)*.002;if(cost<bc){bc=cost;best=a;}}
  tilt.rotation.z=best;}

/* ---------- effects: halo, pool, beam, sparkles, enchantment motes, bubbles, light; returns the moving parts and the Idle sampler ---------- */
const LT_PER={fire:1,frost:2,poison:4/3,lightning:4,holy:2,shadow:2,arcane:4,blood:2,bubble:4/3};
function ltFx(root,it,o,P,sp){const parts=[],R=LT_RAR[o.rarity]||LT_RAR.rare,lvl=R[2],col=R[1],B=(LT_GLOW[o.glow]||LT_GLOW.normal)[1],fx=o.fx||'all',G=fx!=='none',beam=fx==='all'||fx==='beam',spk=fx==='all'||fx==='sparkle',r=mulberry32(P.seed*31+7);
  root.updateMatrixWorld(true);const bb=new THREE.Box3().setFromObject(it),sz=bb.getSize(new THREE.Vector3()),ctr=bb.getCenter(new THREE.Vector3()),rad=Math.max(.22,Math.max(sz.x,sz.z)*.55+.08);
  const inv=new THREE.Matrix4().copy(it.matrixWorld).invert(),src=[],liq=[];let ic=new THREE.Vector3();new THREE.Box3().setFromObject(it).getCenter(ic).applyMatrix4(inv);
  it.traverse(m=>{if(!m.isMesh)return;const b=()=>new THREE.Box3().setFromObject(m).applyMatrix4(inv);if(m.userData.liquid)liq.push(b());else if(m.material===P.blade||m.material===P.rune||m.userData.ench)src.push(b());});
  const motes=[],ek=sp.emit||P.ek;
  if(ek!=='none'&&src.length){const ec=sp.emit?'#d69c60':P.ec,shadow=ek==='shadow',blood=ek==='blood',n=Math.round((sp.emit?6:12)*B);
    const mat=shadow?ltNorm('#201529',.75):blood?ltNorm('#702328',.95):ltAdd(ltShade(ec,ek==='lightning'?1.6:1.25),.95),geo=new THREE.BoxGeometry(...(ek==='lightning'?[.014,.09,.014]:shadow?[.07,.07,.07]:sp.emit?[.025,.025,.025]:[.04,.04,.04]));
    for(let i=0;i<n;i++){const b=src[Math.floor(r()*src.length)],m=new THREE.Mesh(geo,mat);m.name='lt_mote_'+i;m.userData.fx=1;m.renderOrder=3;it.add(m);paHide(m);
      motes.push({m,i,p:[b.min.x+(b.max.x-b.min.x)*r(),b.min.y+(b.max.y-b.min.y)*r(),b.min.z+(b.max.z-b.min.z)*r()],ph:i/n,a:r()*6.283,k:r(),ek:sp.emit?'fire':ek});parts.push(m);}}
  if(liq.length){const mat=ltAdd(P.bubble||'#f6f1e6',.9),geo=new THREE.BoxGeometry(.02,.02,.02);
    for(let i=0;i<7;i++){const b=liq[Math.floor(r()*liq.length)],m=new THREE.Mesh(geo,mat);m.name='lt_bub_'+i;m.userData.fx=1;m.renderOrder=3;it.add(m);paHide(m);
      const bot=liq.reduce((a,l)=>Math.min(a,l.min.y),1e9),top=liq.reduce((a,l)=>Math.max(a,l.max.y),-1e9);
      motes.push({m,i,p:[b.min.x+(b.max.x-b.min.x)*(.2+.6*r()),bot+.01,b.min.z+(b.max.z-b.min.z)*(.2+.6*r())],h:top-bot-.02,ph:i/7,a:r()*6.283,k:r(),ek:'bubble'});parts.push(m);}}
  if(G&&lvl>0&&!sp.noShell){const sm=ltAdd(col,(.12+.045*lvl)*B,null,THREE.BackSide),t=.008+.003*lvl,list=[];it.traverse(m=>{if(m.isMesh&&!m.userData.fx&&!m.material.transparent)list.push(m);});
    for(const m of list){const p=m.geometry.parameters||{},sh=new THREE.Mesh(m.geometry,sm);sh.userData.fx=1;const ws=m.getWorldScale(new THREE.Vector3());
      if(p.width!==undefined&&p.depth!==undefined)sh.scale.set(1+2*t/Math.max(p.width*ws.x,.01),1+2*t/Math.max(p.height*ws.y,.01),1+2*t/Math.max(p.depth*ws.z,.01));else sh.scale.setScalar(1.12);m.add(sh);}}
  let pool=null,bm=null;const sparks=[];
  if(G){pool=new THREE.Mesh(new THREE.PlaneGeometry(rad*2.1,rad*2.1),ltAdd(col,(.26+.06*lvl)*B,ltPoolTex()));pool.rotation.x=-Math.PI/2;pool.position.set(ctr.x,.012,ctr.z);pool.name='lt_pool';pool.userData.fx=1;pool.userData.noFrame=true;root.add(pool);parts.push(pool);}
  if(beam){const H=1+lvl*.75,w=Math.max(.06,Math.min(.14,rad*.16));bm=new THREE.Group();bm.name='lt_beam';bm.userData.noFrame=true;bm.position.set(ctr.x,bb.max.y-.02,ctr.z);root.add(bm);
    for(const[ww,op]of[[w*2.4,.1],[w,.26]]){const geo=new THREE.CylinderGeometry(ww*.7071,ww*.7071,H,4,1,true);geo.translate(0,H/2,0);const m=new THREE.Mesh(geo,ltAdd(ltShade(col,1.15),op*B,ltBeamTex(),THREE.DoubleSide));m.rotation.y=Math.PI/4;m.userData.fx=1;bm.add(m);}parts.push(bm);}
  if(spk){const n=Math.round((3+lvl*3)*Math.min(1.5,B)),mat=ltAdd(ltShade(col,1.4),.95),geo=new THREE.BoxGeometry(.035,.035,.035);for(let i=0;i<n;i++){const s=new THREE.Mesh(geo,mat);s.name='lt_spark_'+i;s.userData.fx=1;s.userData.noFrame=true;root.add(s);paHide(s);
    const a=r()*6.283,rr=rad*(.3+.7*r());sparks.push({m:s,x:ctr.x+Math.cos(a)*rr,z:ctr.z+Math.sin(a)*rr,ph:i/n,h:.5+r()*(.4+lvl*.25)+sz.y*.6,a:r()*6});parts.push(s);}}
  if(G&&(lvl>0||P.ec||liq.length||sp.emit)){const pl=new THREE.PointLight(new THREE.Color(P.ec||(liq.length?P.lq:null)||col),0,2.4+lvl*.5,2);pl.position.set(ctr.x,Math.max(.25,ctr.y+.1),ctr.z);pl.userData.lamp=true;pl.userData.min=(.3+.12*lvl)*B;root.add(pl);root.userData.lights.push(pl);}
  const hov=o.pose==='hover',y0=it.position.y;if(hov)parts.push(it);const gy=-y0,TW=Math.PI*2;
  const fn=(t,S)=>{const w=TW*t/4;if(hov)S[it.name]={p:[0,y0+.05*Math.sin(w*2),0],r:[0,w,0]};
    if(pool){const k=1+.07*Math.sin(w*4);S.lt_pool={s:[k,k,1]};}if(bm){const k=1+.14*Math.sin(w*4);S.lt_beam={s:[k,1+.03*Math.sin(w*2),k]};}
    for(const s of sparks){const u=(t/2+s.ph)%1;S[s.m.name]={p:[s.x,.05+u*s.h,s.z],s:Math.sin(Math.PI*u)*(.7+.3*Math.sin(TW*u*3)),r:[s.a+u*4,s.a,u*3]};}
    for(const M of motes){const T=LT_PER[M.ek],u=(t/T+M.ph)%1,[x,y,z]=M.p,n=M.m.name;
      switch(M.ek){
        case'fire':S[n]={p:[x+.03*Math.sin(TW*u*2+M.a),y+.32*u,z+.03*Math.cos(TW*u*2+M.a)],s:(1-u)*1.1,r:[0,M.a+u*3,0]};break;
        case'frost':S[n]={p:[x+.05*Math.sin(TW*u+M.a),y+.1-.22*u,z+.05*Math.cos(TW*u+M.a)],s:Math.sin(Math.PI*u)*.8,r:[u*3,M.a,u*2]};break;
        case'poison':S[n]={p:[x,y+.22*u,z],s:u<.85?.4+u*.9:Math.max(0,(1-u)/.15)*1.17};break;
        case'holy':S[n]={p:[x,y+.45*u,z],s:Math.sin(Math.PI*u)*(.7+.3*Math.sin(TW*u*4)),r:[0,0,Math.PI/4]};break;
        case'shadow':S[n]={p:[x+.04*Math.sin(TW*u+M.a),y+.3*u,z],s:Math.sin(Math.PI*u)*(.6+u*.9),r:[0,M.a+u,0]};break;
        case'arcane':{const a=M.a+TW*(t/4)*(M.k>.5?1:-1),rr=rad*.75*(.6+.4*M.k);S[n]={p:[ic.x+Math.cos(a)*rr,y+.03*Math.sin(TW*u*2),ic.z+Math.sin(a)*rr],s:.6+.4*Math.sin(TW*u*4+M.a),r:[0,a,Math.PI/4]};break;}
        case'lightning':{const q=mulberry32(Math.floor(t*12)*97+M.i*13),on=q()<.35;S[n]={p:[x+(q()-.5)*.06,y+(q()-.5)*.06,z+(q()-.5)*.06],r:[q()*3,q()*3,q()*3],s:on?1:0};break;}
        case'blood':{if(u<.5){const f=u/.5;S[n]={p:[x,y-(y-gy-.005)*f*f,z],s:[.5,1.1,.5]};}else{const f=(u-.5)/.5;S[n]={p:[x,gy+.004,z],s:[1.8*(1-f*.6),.12,1.8*(1-f*.6)]};}break;}
        case'bubble':S[n]={p:[x+.006*Math.sin(TW*u*3+M.a),y+u*M.h,z],s:u<.9?.6+u*.5:0};break;}}};
  return{parts,fn,rad};}

function ltMake(seed,o,build,sp,opts){const oo={};for(const op of opts)oo[op.key]=o[op.key]!==undefined?o[op.key]:op.def;Object.assign(oo,sp.fixed||{});
  const P=ltPal(oo,seed),obj=build(P,oo),root=iRoot(1.6),it=new THREE.Group(),hold=new THREE.Group(),tilt=new THREE.Group();it.name='lt_item';root.add(it);it.add(hold);hold.add(tilt);tilt.add(obj);
  const hov=oo.pose==='hover',lay=sp.lay||'flat';if(lay==='flat')obj.quaternion.setFromRotationMatrix(LT_FLAT);else if(lay==='back')obj.rotation.x=-Math.PI/2;else if(Array.isArray(lay))obj.rotation.set(...lay);
  if(!hov&&sp.settle)ltSettle(tilt,obj);hold.rotation.set(hov&&(lay==='flat'||lay==='back')?.45:0,hov?0:(sp.yaw??(.15+P.v[7]*.5)),0);
  root.updateMatrixWorld(true);const b=new THREE.Box3().setFromObject(hold),c=b.getCenter(new THREE.Vector3()),s=b.getSize(new THREE.Vector3());
  if(hov){hold.position.set(-c.x,-c.y,-c.z);it.position.y=Math.max(.6,s.y/2+.4);}else hold.position.set(-c.x,-b.min.y,-c.z);
  const F=ltFx(root,it,oo,P,sp),defs=[{name:'Idle',dur:4,loop:true,fn:F.fn}];
  if(sp.clips)defs.push(...sp.clips(obj,F.fn,F.parts));if(F.parts.length)propAnim(root,F.parts,defs);
  root.userData.ground=Math.max(1.2,Math.ceil(F.rad*1.6/.4)*.4);return root;}

/* ---------- registry ---------- */
const ltCh=(T,keys)=>(keys||Object.keys(T)).map(k=>[k,T[k][0]]);
const LTO={rar:d=>({key:'rarity',label:'Rarity',choices:ltCh(LT_RAR),def:d||'rare'}),metal:(keys,d)=>({key:'metal',label:'Material',choices:ltCh(LT_METAL,keys),def:d||keys[0]}),
  ench:d=>({key:'ench',label:'Enchantment',choices:ltCh(LT_ENCH),def:d||'none'}),fx:d=>({key:'fx',label:'Effects',choices:[['all','Glow, beam and sparkles'],['beam','Glow and beam'],['sparkle','Glow and sparkles'],['glow','Glow only'],['none','None']],def:d||'all'}),
  glow:d=>({key:'glow',label:'Brightness',choices:ltCh(LT_GLOW),def:d||'normal'}),pose:d=>({key:'pose',label:'Display',choices:[['ground','On the ground'],['hover','Hovering, turning']],def:d||'ground'})};
function LT(id,f,name,desc,build,sp={}){const d=sp.def||{},opts=[...(sp.opts||[])];if(sp.metals)opts.push(LTO.metal(sp.metals,d.metal));opts.push(LTO.rar(d.rarity));if(sp.ench!==false)opts.push(LTO.ench(d.ench));opts.push(LTO.fx(d.fx),LTO.glow(d.glow),LTO.pose(d.pose));
  ASSETS.push({id:'lt-'+id,folder:'loot/'+f,name,desc:desc+' Options: rarity (trim, gems, glow colour), effects, brightness and display.',variants:true,defaultSeed:1,opts,build:(seed,o)=>ltMake(seed,o||{},build,sp,opts)});}
const LTW={metals:LT_WM,settle:true};
[['sword','Arming sword',P=>ltSword(P,'sword'),'One-handed sword with a fuller.'],['longsword','Longsword',P=>ltSword(P,'long'),'Hand-and-a-half sword with a long grip.'],
 ['greatsword','Greatsword',P=>ltSword(P,'great'),'Two-handed sword with a ricasso.'],['dagger','Dagger',P=>ltSword(P,'dagger'),'Short double-edged dagger.'],['scimitar','Scimitar',ltScimitar,'Curved single-edged blade.'],
 ['handaxe','Hand axe',P=>ltAxe(P,false),'One-handed axe with a back spike.'],['battleaxe','Battle axe',P=>ltAxe(P,true),'Two-handed double-bitted axe.'],['mace','Flanged mace',ltMace,'Mace with eight flanges on a metal haft.'],
 ['morningstar','Morning star',ltMorning,'Spiked ball on a wooden haft.'],['warhammer','War hammer',ltHammer,'Hammer face with a back spike.'],['spear','Spear',ltSpear,'Leaf-bladed spear on an ash shaft.'],['halberd','Halberd',ltHalberd,'Axe blade, top spike and back hook on a long shaft.']]
  .forEach(([id,n,f,d])=>LT(id,'weapons',n,d+' Seeds change the grip, guard and pommel.',f,LTW));
LT('bow','weapons','Bow','Recurve bow with a leather grip and nocked tips.',ltBow,{settle:true});
LT('staff','weapons','Mage staff','Gnarled staff with three prongs holding a glowing orb (enchantment or rarity colour).',ltStaff,{settle:true,def:{ench:'arcane',rarity:'epic'}});
LT('wand','weapons','Wand','Short wand with a crystal tip.',ltWand,{settle:true,def:{ench:'frost'}});
LT('roundshield','weapons','Round shield','Painted plank shield with a metal rim, boss and studs; seeds change the colours.',ltRoundShield,{metals:LT_WM,lay:'back'});
LT('kiteshield','weapons','Kite shield','Two-colour kite shield with a diamond emblem.',ltKite,{metals:LT_WM,lay:'back'});
LT('towershield','weapons','Tower shield','Tall plank shield with metal bands and diamond bosses.',ltTower,{metals:LT_WM,lay:'back'});
LT('helmet','armor','Helmet','Helmet in five styles standing on its rim.',ltHelm,{metals:LT_AM,lay:'up',opts:[{key:'style',label:'Style',choices:[['nasal','Nasal helm'],['great','Great helm'],['horned','Horned helm'],['winged','Winged helm'],['crowned','Crowned helm']],def:'nasal'}]});
LT('cuirass','armor','Breastplate','Breastplate with a ridge, plackart and shoulder straps, lying on its back.',ltCuirass,{metals:LT_AM,lay:'back'});
LT('mail','armor','Mail shirt','Folded chain-mail shirt with a belt.',ltMail,{metals:LT_AM.filter(k=>k!=='leather'),lay:'up',def:{metal:'iron'}});
LT('jerkin','armor','Leather jerkin','Leather jerkin with buckled straps and studs, lying flat.',ltJerkin,{lay:'up',def:{rarity:'uncommon'}});
LT('gauntlets','armor','Gauntlets','Pair of gauntlets with finger lames.',ltGauntlets,{metals:LT_AM,lay:'up'});
LT('boots','armor','Boots','Pair of boots; plate lames unless made of leather.',ltBoots,{metals:LT_AM,lay:'up'});
LT('greaves','armor','Greaves','Pair of shin guards with knee cops and straps.',ltGreaves,{metals:LT_AM,lay:'up'});
LT('pauldrons','armor','Pauldrons','Pair of shoulder guards with three lames; spikes on some epic and legendary ones.',ltPauldrons,{metals:LT_AM,lay:'up'});
LT('belt','armor','Belt','Leather belt with a buckle and pouch.',ltBelt,{lay:'up',def:{rarity:'uncommon'}});
LT('cloak','armor','Cloak','Folded cloak with a clasp; fur collar on rare and better.',ltCloak,{lay:'up'});
const LT_SHOPT=[{key:'shape',label:'Bottle',choices:[['default','Default'],['flask','Round flask'],['tall','Tall bottle'],['square','Square bottle'],['vial','Vial'],['cone','Conical flask'],['heart','Heart bottle']],def:'default'},{key:'size',label:'Size',choices:[['small','Small'],['medium','Medium'],['large','Large']],def:'medium'}];
for(const[k,[n]]of Object.entries(LT_BREW))LT('p-'+k,'potions',n,`${n} in a glass bottle; bubbles rise in the glowing brew. Wax seal on epic and legendary, a string on uncommon and better.`,(P,o)=>ltPotion(P,o,k),{lay:'up',ench:false,opts:LT_SHOPT,def:{rarity:k==='luck'||k==='rejuv'?'epic':k==='poison'?'uncommon':'rare'}});
LT('coins','treasure','Coins','Coins: a few, a pile or a hoard with gems.',ltCoins,{lay:'up',ench:false,noShell:true,metals:['gold','silver','bronze'],opts:[{key:'amount',label:'Amount',choices:[['few','A few'],['pile','Pile'],['hoard','Hoard']],def:'pile'}],def:{rarity:'common'}});
LT('pouch','treasure','Coin pouch','Drawstring leather pouch with spilled coins.',ltPouch,{lay:'up',ench:false,metals:['gold','silver','bronze'],def:{rarity:'uncommon'}});
LT('gem','treasure','Gem','Cut gem lying on its side; pick the stone and the cut.',ltGem,{lay:[0,0,1.15],ench:false,opts:[{key:'gem',label:'Stone',choices:ltCh(LT_GEMS),def:'ruby'},{key:'cut',label:'Cut',choices:[['round','Round'],['square','Square'],['oval','Oval']],def:'round'}]});
LT('ingots','treasure','Ingots','One, three or six stacked ingots.',ltIngots,{lay:'up',ench:false,metals:LT_TM,opts:[{key:'count',label:'Count',choices:[['1','One'],['3','Three'],['6','Six']],def:'3'}],def:{rarity:'uncommon'}});
LT('ring','treasure','Ring','Ring with a gem in a four-prong setting (rarity colour).',ltRing,{lay:'up',metals:LT_TM});
LT('amulet','treasure','Amulet','Diamond-shaped pendant with gems on a chain.',ltAmulet,{lay:'up',metals:LT_TM,def:{rarity:'epic'}});
LT('crown','treasure','Crown','Crown with points, gems and a velvet cap (rare and better).',ltCrown,{lay:'up',ench:false,metals:LT_TM,def:{rarity:'legendary'}});
LT('goblet','treasure','Goblet','Jewelled goblet with wine below the rim.',ltGoblet,{lay:'up',ench:false,metals:LT_TM});
LT('scroll','treasure','Scroll','Rolled scroll with a ribbon, wax seal and an unrolled end; glowing script when enchanted.',ltScroll,{lay:'up',def:{ench:'arcane'}});
LT('spellbook','treasure','Spellbook','Thick tome with metal corners, a clasp and a gem; a ring of runes when enchanted.',ltBook,{lay:'up',def:{ench:'arcane',rarity:'epic'}});
LT('key','treasure','Key','Key with a ring, diamond or trefoil bow (by seed).',ltKey,{lay:'up',metals:LT_TM.concat(['bone'])});
LT('runestone','treasure','Rune stone','Stone slab with a glowing glyph (by seed).',ltRuneStone,{lay:'up'});
LT('crystal','treasure','Soul crystal','Cluster of glowing crystals on a rock.',ltCrystal,{lay:'up',def:{ench:'arcane',rarity:'epic'}});
LT('sack','treasure','Loot sack','Tied sack with coins, a gem and a gold cup spilling out.',ltSack,{lay:'up',ench:false,def:{rarity:'rare'}});
LT('chest','treasure','Loot chest','Small chest full of gold; bands in the rarity metal. Clips: Open, Close.',ltChest,{lay:'up',ench:false,yaw:.3,opts:[{key:'open',label:'Lid',choices:[['closed','Closed'],['open','Open']],def:'closed'}],
  clips:(obj,fx)=>{const lid=obj.userData.lid,a0=lid.rotation.x;return[{name:'Open',dur:4,hold:true,fn:(t,S)=>{fx(t,S);S[lid.name]={r:[a0+(-1.9-a0)*paEase(Math.min(1,t/1.2)),0,0]};}},{name:'Close',dur:4,hold:true,fn:(t,S)=>{fx(t,S);S[lid.name]={r:[-1.9+(0+1.9)*paEase(Math.min(1,t/1.2)),0,0]};}}];}});
for(const[id,n,f,d]of[['meat','Roast meat',ltMeat,'Roast leg with a bone.'],['bread','Bread loaf',ltBread,'Scored loaf of bread.'],['cheese','Cheese wedge',ltCheese,'Wedge of cheese with rind and holes.'],['apple','Apple',ltApple,'Red or green apple (by seed).'],['quiver','Quiver of arrows',ltQuiver,'Leather quiver of six fletched arrows, lying down.']])
  LT(id,'supplies',n,d,f,{lay:'up',ench:false,def:{rarity:'common',fx:'glow'}});
LT('bomb','supplies','Bomb','Iron bomb with a lit fuse throwing sparks.',ltBomb,{lay:'up',ench:false,emit:'fire',def:{rarity:'uncommon',fx:'glow'}});
