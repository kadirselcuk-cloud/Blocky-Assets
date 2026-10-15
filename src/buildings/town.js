/* ======================= TOWN: more vendors and the furniture of a town square =======================
   Market stalls 6-11 (same stall as 1-5, new goods), and tw- pieces: vendor's handcart, roast stand, rug seller, fountain, notice board,
   pillory and stocks, statue, signpost, planters, and the whole market square. Uses kRoot, kCandle (outpost.js), VXD.meat (army_camp.js). */
FOLDERS['buildings/medieval'].children.push('buildings/medieval/town');
FOLDERS['buildings/medieval/town']={name:'Town square',blurb:'Vendor carts and stands, fountain, notice board, pillory, statue, signpost, planters and a whole market square (market stalls are in Civil)',children:[]};
const TWWATER=new THREE.MeshStandardMaterial({color:new THREE.Color(0x8ac4e8).convertSRGBToLinear(),roughness:.1,transparent:true,opacity:.55,depthWrite:false});
/* small things */
function twFish(par,x,y,z,ry=0){const g=new THREE.Group();put(par,g,x,y,z,0,ry,0);bx(g,.26,.06,.09,vm('fish'),0,.03,0);bx(g,.06,.05,.11,vm('fish'),.15,.03,0);bx(g,.02,.02,.02,vm('dark'),-.1,.05,.045);return g;}
function twBottle(par,x,y,z,hex,h=.2,w=.09){const b=new THREE.Mesh(new THREE.BoxGeometry(w,h,w),GLASSMAT);b.position.set(x,y+h/2,z);par.add(b);const l=new THREE.Mesh(new THREE.BoxGeometry(w*.8,h*.7,w*.8),liquidMat(hex));l.position.set(x,y+h*.36,z);par.add(l);
  const n=new THREE.Mesh(new THREE.BoxGeometry(w*.45,h*.3,w*.45),GLASSMAT);n.position.set(x,y+h*1.15,z);par.add(n);bx(par,w*.5,.03,w*.5,vm('cattail'),x,y+h*1.3+.015,z);}
function twHang(par,x,y,len,z){bx(par,.02,len,.02,vm('iron'),x,y-len/2,z);}
const twRail=(r,W,D)=>bx(r,W-.2,.06,.06,vm('iron'),0,2.2,D/2-.1);
const STALLS2=[
 {name:'butcher',color:'#8a2a24',desc:'Butcher: hams and strings of sausages on hooks, cuts of meat and a plucked bird on the counter, a chopping block with a cleaver, salted meat and crocks on the back shelf, a salt barrel.',
  goods:(r,{W,D})=>{twRail(r,W,D);const z=D/2-.1;for(const[x,k]of[[-1.15,'ham'],[-.7,'saus'],[-.25,'ham'],[.25,'saus'],[.7,'ham'],[1.15,'saus']]){
      if(k==='ham'){twHang(r,x,2.17,.12,z);bx(r,.06,.08,.06,vm('bone'),x,2.01,z);bx(r,.22,.36,.18,vm('meat'),x,1.79,z);bx(r,.16,.08,.14,vm('meat'),x,1.57,z);}
      else for(let i=0;i<6;i++)bx(r,.07,.1,.07,vm('meat'),x,2.12-i*.1,z);}
    vlog(r,.5,.14,.4,'y',-1,1.07,D/2-.32);const cl=new THREE.Group();put(r,cl,-1,1.14,D/2-.32,0,.4,.15);bx(cl,.04,.18,.2,vm('iron'),0,.06,0);bx(cl,.04,.04,.18,vm('planksDark'),0,.12,.18);
    for(let i=0;i<5;i++)bx(r,.24,.06,.16,vm('meat'),-.45+(i%3)*.27,1.03+Math.floor(i/3)*.06,D/2-.32+(i%2?.12:-.08));bx(r,.26,.16,.2,vm('woolWhite'),.45,1.08,D/2-.32);bx(r,.1,.06,.06,vm('woolWhite'),.6,1.1,D/2-.26);
    tray(r,1.1,D/2-.32,1,g=>{for(let i=0;i<6;i++)bx(g,.12,.05,.08,vm('meat'),-.12+(i%3)*.12,.15,-.08+Math.floor(i/3)*.14);});
    for(let i=0;i<4;i++)bx(r,.3,.22,.24,vm('burlap'),-1.1+i*.36,1.5,-D/2+.35);for(let i=0;i<3;i++)bx(r,.24,.3,.24,vm('clayPot'),.5+i*.34,1.54,-D/2+.35);
    const sb=vBarrel(r,-W/2-.5,.2);bx(sb,.52,.02,.52,vm('flour'),0,.81,0);put(r,TOOLS.Bucket.build(),W/2+.45,.47,.3);}},
 {name:'fish',color:'#2a5a7a',desc:'Fishmonger: fish laid out on beds of ice, dried fish hung on hooks, baskets of shellfish on the shelf, a barrel of fish and a net over a crate.',
  goods:(r,{W,D})=>{twRail(r,W,D);for(let i=0;i<6;i++){const x=-1.2+i*.48;twHang(r,x,2.17,.1,D/2-.1);const f=new THREE.Group();put(r,f,x,2.07,D/2-.1,0,0,Math.PI/2);twFish(f,-.16,-.04,0);}
    for(const x of[-1.05,0,1.05]){bx(r,.9,.06,.6,vm('crate'),x,1.03,D/2-.32);bx(r,.84,.03,.54,vm('woolWhite'),x,1.075,D/2-.32);for(let i=0;i<6;i++)twFish(r,x-.2+(i%2)*.38,1.09,D/2-.5+Math.floor(i/2)*.17,i%2?Math.PI:0);}
    for(let i=0;i<3;i++){const b=new THREE.Group();put(r,b,-.9+i*.6,1.39,-D/2+.35);hollow(b,.44,.2,.32,.04,vm('wicker'));for(let k=0;k<6;k++)bx(b,.08,.05,.06,vm(i===1?'woolWhite':'dark'),-.14+(k%3)*.14,.17,-.06+Math.floor(k/3)*.12);}
    const fb=vBarrel(r,-W/2-.5,.2);for(let i=0;i<3;i++)twFish(fb,-.12+i*.1,.81,(i-1)*.12,i*.6);vCrate(r,.6,W/2+.5,0,-.3,.2);for(let i=0;i<5;i++){bx(r,.64,.02,.02,vm('rope'),W/2+.5,.61,-.55+i*.12);bx(r,.02,.02,.64,vm('rope'),W/2+.25+i*.12,.615,-.3);}}},
 {name:'armour',color:'#4a4a52',desc:'Armourer: three shields and two swords hung on a back board, swords and a mace laid on the counter, three helmets on the shelf, and mail on a stand beside the stall.',
  goods:(r,{W,D})=>{bx(r,W-.4,1,.06,vm('planksDark'),0,1.95,-D/2+.12);[['woolRed','gold'],['woolBlue','woolWhite'],['woolGreen','gold']].forEach(([a,b],i)=>{const s=wHeater(a,b);put(r,s,-1+i*1,1.97,-D/2+.18);bx(r,.06,.06,.06,vm('iron'),-1+i,2.43,-D/2+.15);});
    for(const x of[-.5,.5]){const s=wSword(.7);put(r,s,x,2.33,-D/2+.18,0,0,Math.PI);bx(r,.05,.05,.06,vm('iron'),x,2.4,-D/2+.15);}
    for(let i=0;i<3;i++){const o=new THREE.Group();put(r,o,-1.15+i*.5,1.04,D/2-.38,0,Math.PI/2+(i-1)*.05,0);put(o,wSword(.7),0,0,0,Math.PI/2,0,0);}
    {const o=new THREE.Group();put(r,o,.75,1.08,D/2-.3,0,Math.PI/2,0);put(o,wMace(),0,0,0,Math.PI/2,0,0);}put(r,aGauntlets(),1.2,1,D/2-.4);
    [aHelmNasal,aHelmKettle,aHelmGreat].forEach((h,i)=>put(r,h(),-.8+i*.8,1.39,-D/2+.35));put(r,aOnStand('mail'),W/2+.6,0,.2);vCrate(r,.5,-W/2-.45,0,-.4,.2);}},
 {name:'apothecary',color:'#3a6a4a',desc:'Apothecary: rows of coloured remedies in bottles, a mortar and pestle and an open book on the counter, lidded jars on the shelf, bundles of herbs drying from the rail, a basket of herbs.',
  goods:(r,{W,D})=>{twRail(r,W,D);for(let i=0;i<7;i++){const x=-1.25+i*.42;twHang(r,x,2.17,.12,D/2-.1);bx(r,.14,.26,.14,vm(i%2?'herb':'hay'),x,1.92,D/2-.1);bx(r,.16,.04,.16,vm('rope'),x,2.04,D/2-.1);}
    const cols=['#a02020','#3a8a3a','#3a5aa8','#c8a020','#8a3aa8','#d06a20'];for(let i=0;i<10;i++)twBottle(r,-1.3+(i%5)*.16,1,D/2-.5+Math.floor(i/5)*.2,cols[i%6],.14+(i%3)*.05,.08);
    {const m=new THREE.Group();put(r,m,.1,1,D/2-.35);hollow(m,.22,.14,.22,.04,vm('stone'));bx(m,.04,.26,.04,vm('stone'),.03,.2,0,0,0,.3);}
    bx(r,.5,.03,.36,vm('leather'),.75,1.015,D/2-.32);for(const s of[-1,1])bx(r,.23,.02,.32,vm('paper'),.75+s*.12,1.04,D/2-.32,0,0,-s*.1);
    for(let i=0;i<5;i++){bx(r,.22,.26,.22,vm('clayPot'),-1.1+i*.5,1.52,-D/2+.35);bx(r,.24,.05,.24,vm('planksDark'),-1.1+i*.5,1.675,-D/2+.35);}
    for(let i=0;i<4;i++)twBottle(r,-.85+i*.5,1.39,-D/2+.35,cols[(i+2)%6],.12,.07);vBarrel(r,-W/2-.5,.2);const b=new THREE.Group();put(r,b,W/2+.45,0,.4);hollow(b,.44,.22,.34,.04,vm('wicker'));bx(b,.38,.08,.28,vm('herb'),0,.2,0);}},
 {name:'jeweller',color:'#5a2a6a',desc:'Jeweller: a velvet cloth with rings, gems and necklaces on stands, stacks of gold coins, a small open casket, a balance; lockboxes and candlesticks on the shelf and a strongbox beside the stall.',
  goods:(r,{W,D})=>{const zc=D/2-.32;bx(r,W-.2,.02,.78,vm('velvet'),0,1.01,zc);bx(r,W-.2,.3,.02,vm('velvet'),0,.86,D/2+.06);
    for(let i=0;i<8;i++)bx(r,.05,.03,.05,vm('gold'),-1.3+i*.1,1.035,zc+.2);const gem=['#c02030','#2050c0','#20a050','#a020c0'];for(let i=0;i<8;i++){const g=new THREE.Mesh(new THREE.BoxGeometry(.06,.05,.06),liquidMat(gem[i%4]));g.position.set(-1.3+i*.1,1.045,zc-.05);r.add(g);}
    for(const x of[-.35,.05]){bx(r,.16,.04,.12,vm('velvet'),x,1.04,zc-.15);bx(r,.06,.24,.06,vm('velvet'),x,1.18,zc-.15);bx(r,.2,.12,.08,vm('velvet'),x,1.3,zc-.15);for(let k=0;k<7;k++){const a=k/6*Math.PI;bx(r,.035,.035,.035,vm('gold'),x+Math.cos(a)*.1,1.3-Math.sin(a)*.12,zc-.1);}}
    for(let i=0;i<4;i++)for(let k=0;k<=i%3+1;k++)bx(r,.07,.02,.07,vm('gold'),.4+i*.1,1.03+k*.02,zc+.18);
    {const c=new THREE.Group();put(r,c,.85,1.02,zc);hollow(c,.3,.14,.2,.03,vm('planksDark'));bx(c,.26,.03,.16,vm('gold'),0,.11,0);const lid=new THREE.Group();put(c,lid,0,.14,-.1,-1.9,0,0);bx(lid,.3,.03,.2,vm('planksDark'),0,0,.1);}
    {const b=new THREE.Group();put(r,b,1.25,1.02,zc+.05);bx(b,.16,.03,.12,vm('gold'),0,.015,0);bx(b,.03,.3,.03,vm('gold'),0,.18,0);bx(b,.36,.025,.025,vm('gold'),0,.33,0);for(const s of[-1,1]){bx(b,.01,.12,.01,vm('gold'),s*.17,.26,0);bx(b,.12,.015,.12,vm('gold'),s*.17,.2,0);}}
    for(let i=0;i<3;i++){const x=-1+i*.5;bx(r,.32,.2,.22,vm('planksDark'),x,1.49,-D/2+.35);bx(r,.33,.03,.23,vm('iron'),x,1.53,-D/2+.35);bx(r,.05,.06,.01,vm('gold'),x,1.47,-D/2+.465);}
    for(const x of[.75,1.15]){bx(r,.12,.03,.12,vm('gold'),x,1.405,-D/2+.35);bx(r,.03,.28,.03,vm('gold'),x,1.56,-D/2+.35);bx(r,.08,.03,.08,vm('gold'),x,1.71,-D/2+.35);bx(r,.05,.12,.05,vm('wax'),x,1.785,-D/2+.35);}
    vChest(r,W/2+.6,.1,-Math.PI/2,false);}},
 {name:'wine',color:'#6a2a3a',desc:'Wine and ale: two casks with taps on cradles at the back, jugs, mugs and wine bottles on the counter, and a stack of barrels with a bench beside the stall.',
  goods:(r,{W,D})=>{for(const x of[-.8,.6]){const c=new THREE.Group();put(r,c,x,1.39,-D/2+.38);for(const s of[-1,1])bx(c,.12,.14,.4,vm('planksDark'),s*.3,.07,0);const k=new THREE.Group();put(c,k,0,.32,0,0,0,Math.PI/2);bx(k,.56,.9,.56,vm('barrel'),0,0,0);
      bx(c,.04,.46,.46,vm('logEnd'),.46,.32,0);bx(c,.06,.06,.12,vm('iron'),.4,.18,.22);bx(c,.04,.06,.04,vm('iron'),.4,.12,.3);}
    for(let i=0;i<5;i++){const x=-1.3+i*.14;bx(r,.09,.12,.09,vm('barrel'),x,1.06,D/2-.2);bx(r,.03,.06,.03,vm('barrel'),x+.06,1.07,D/2-.2);}
    for(let i=0;i<2;i++){bx(r,.2,.28,.2,vm('clayPot'),-.45+i*.3,1.14,D/2-.35);bx(r,.1,.08,.1,vm('clayPot'),-.45+i*.3,1.32,D/2-.35);}
    for(let i=0;i<6;i++){const x=.25+i*.16,b=new THREE.Mesh(new THREE.BoxGeometry(.08,.22,.08),liquidMat('#3a0e18'));b.position.set(x,1.11,D/2-.4);r.add(b);bx(r,.035,.08,.035,vm('dark'),x,1.26,D/2-.4);}
    vBarrel(r,-W/2-.5,.6);vBarrel(r,-W/2-.5,-.1);const lb=new THREE.Group();put(r,lb,-W/2-.5,1.1,.25,Math.PI/2,0,0);bx(lb,.6,.8,.6,vm('barrel'),0,0,0);vBench(r,W/2+.8,.6);}}];
(()=>{const i=ASSETS.findIndex(a=>a.id==='vx-stall-5'),folder=ASSETS[i].folder;
  ASSETS.splice(i+1,0,...STALLS2.map((c,k)=>({id:`vx-stall-${k+6}`,folder,name:`Market stall ${k+6}`,build:()=>vStall(c),desc:c.desc+' Awning colour can be changed.',groundR:4.8,awning:true})));})();

/* ---------- vendor's handcart ---------- */
const TW_CART={fruit:'Fruit',veg:'Vegetables',flowers:'Flowers',bread:'Bread'};
function twCartGoods(g,kind,r){const tr=(x,z,f)=>{const t=new THREE.Group();put(g,t,x,0,z,-.18,0,0);hollow(t,.5,.16,.4,.03,vm('crate'));f(t);};
  const piece=(t,mat,s,n=9)=>{for(let i=0;i<n;i++)bx(t,s,s,s,vm(mat),-.15+(i%3)*.15,.12+s/2,-.12+Math.floor(i/3)*.12);};
  const spots=[[-.28,-.5],[.28,-.5],[-.28,.05],[.28,.05],[-.28,.6],[.28,.6]];
  spots.forEach(([x,z],i)=>tr(x,z,t=>{if(kind==='fruit')piece(t,['woolRed','pearSkin','gold','cherrySkin','woolRed','pumpkin'][i],i===3?.06:.1);
    else if(kind==='veg'){if(i%3===0)for(let k=0;k<4;k++)bx(t,.16,.14,.16,vm('leaves'),-.1+(k%2)*.2,.19,-.08+Math.floor(k/2)*.16);else if(i%3===1)for(let k=0;k<6;k++){bx(t,.05,.05,.2,vm('pumpkin'),-.15+k*.06,.15,0);bx(t,.04,.06,.06,vm('leaves'),-.15+k*.06,.15,.12);}else piece(t,'leather',.1);}
    else if(kind==='flowers'){const c=['woolRed','woolPurple','gold','woolWhite','blossomPink','woolBlue'][i];for(let k=0;k<6;k++){const x=-.15+(k%3)*.15,z=-.08+Math.floor(k/3)*.16;bx(t,.03,.22,.03,vm('leaves'),x,.2,z);bx(t,.08,.07,.08,vm(c),x,.33,z);}}
    else{for(let k=0;k<4;k++)bx(t,.2,.09,.12,vm('hay'),-.11+(k%2)*.22,.16,-.08+Math.floor(k/2)*.16);if(i%2)bx(t,.09,.06,.09,vm('gold'),0,.23,0);}}));}
function twCart(s,o){const root=kRoot(2.4),kind=(o&&o.goods)||'fruit',d=vm('planksDark'),p=vm('planks');root.userData.awning=[];root.userData.awnColor={fruit:'#b03a2e',veg:'#4a7a3a',flowers:'#a04a8a',bread:'#c89a2a'}[kind];
  bx(root,1.5,.12,.12,d,0,.47,0);for(const s of[-1,1]){const w=new THREE.Group();put(root,w,s*.72,.47,0,0,Math.PI/2,0);wlWheel(w,.45);bx(root,.12,.3,.3,d,s*.42,.68,0);}
  bx(root,1.2,.08,1.9,p,0,.87,0);for(const s of[-1,1])bx(root,.06,.2,1.9,p,s*.57,1.01,0);bx(root,1.2,.2,.06,p,0,1.01,-.92);bx(root,1.2,.2,.06,p,0,1.01,.92);
  for(const s of[-1,1]){wlBeam(root,[s*.45,.86,.9],[s*.45,.78,1.9],.07,d);bx(root,.06,.84,.06,d,s*.5,.42,-.85);}bx(root,.98,.06,.06,d,0,.78,1.86);
  const g=new THREE.Group();put(root,g,0,.91,0);twCartGoods(g,kind);
  for(const[a,b]of[[1,1],[1,-1],[-1,1],[-1,-1]])bx(root,.05,1.3,.05,d,a*.57,1.6,b*.89);
  for(let i=0;i<5;i++)awnBox(root,1.5,.06,.44,0,2.28-Math.abs(i-2)*.05,-.88+i*.44);for(let i=0;i<4;i++)if(i%2===0)awnBox(root,.38,.16,.04,-.57+i*.38,2.12,1.12,'solid');else bx(root,.38,.16,.04,vm('woolWhite'),-.57+i*.38,2.12,1.12);
  return root;}
/* ---------- roast stand ---------- */
function twRoast(){const root=kRoot(2.2),L=root.userData.lights,br=vm('brick'),d=vm('planksDark');bx(root,1.6,.9,.8,br,0,.45,0);bx(root,1.4,.06,.6,vm('coal'),0,.92,0);const e=bx(root,1.2,.04,.5,EMBER,0,.95,0);e.castShadow=false;
  for(const s of[-1,1])bx(root,1.6,.16,.1,br,0,.98,s*.35);for(let i=0;i<7;i++)bx(root,.02,.02,.62,vm('iron'),-.6+i*.2,1.07,0);
  for(let i=0;i<5;i++){bx(root,.08,.07,.4,vm('meat'),-.5+i*.25,1.115,-.05);}for(let i=0;i<3;i++){const k=new THREE.Group();put(root,k,-.5+i*.5,1.1,.22,0,0,Math.PI/2);bx(k,.02,.8,.02,vm('planks'),0,0,0);for(let j=0;j<4;j++)bx(k,.07,.08,.07,vm(j%2?'meat':'pumpkin'),0,-.2+j*.13,0);}
  vFlame(root,.3,.96,0,.05,L,1);vFlame(root,-.4,.96,-.1,.04);
  for(const[a,b]of[[1,1],[1,-1],[-1,1],[-1,-1]])bx(root,.12,2.3,.12,d,a*1.1,1.15,b*.6);const rf=new THREE.Group();put(root,rf,0,2.3,0);bx(rf,2.6,.1,1.6,vm('shingle'),0,.05,0);bx(rf,2.6,.1,.1,d,0,-.05,.6);bx(rf,2.6,.1,.1,d,0,-.05,-.6);
  bx(root,.8,.08,.5,vm('planks'),1.55,.9,.1);for(const s of[-1,1])bx(root,.08,.86,.08,d,1.55+s*.33,.43,.1);for(let i=0;i<3;i++)bx(root,.18,.1,.12,vm('hay'),1.38+i*.18,.99,.1);
  vBarrel(root,-1.6,.2);bx(root,.4,.5,.36,vm('burlap'),-1.6,.25,-.5);vWoodpile(root,3,2,.0,-.95,0);return root;}
/* ---------- rug seller ---------- */
function twRug(){const root=kRoot(2.6),d=vm('planksDark');for(const s of[-1,1])vlog(root,.16,2.4,.16,'y',s*1.5,1.2,-.8);bx(root,3.2,.1,.1,d,0,2.3,-.8);
  [['rug',-.95],['blanket',0],['woolPurple',.95]].forEach(([m,x])=>{bx(root,.8,1.7,.04,vm(m),x,1.4,-.75);bx(root,.8,.06,.05,vm('gold'),x,.56,-.75);for(const s of[-1,1])bx(root,.04,.08,.04,vm('rope'),x+s*.3,2.3,-.73);});
  bx(root,2.4,.02,1.6,vm('rug'),0,.01,.5).castShadow=false;for(let i=0;i<4;i++){const m=vlog(root,1.4,.24,.24,'x',-.2,.12+(i>2?.22:0),-.1+(i>2?.12:i*.25));m.material=vm(['rug','blanket','woolBlue','woolRed'][i]);}
  for(let i=0;i<3;i++)bx(root,.5,.1,.5,vm(['woolRed','gold','woolGreen'][i]),.8,.06+i*.1,.8);bx(root,.5,.12,.5,vm('velvet'),-.8,.06,.9);return root;}
/* ---------- fountain ---------- */
function twFountain(){const root=kRoot(3.6),st=vm('stone'),sb=vm('stoneBrick'),c=.4,R=2.4;bx(root,2*R+.8,.12,2*R+.8,vm('flagstone'),0,.06,0);
  for(let i=-6;i<6;i++)for(let k=-6;k<6;k++){const x=(i+.5)*c,z=(k+.5)*c,dd=Math.hypot(x,z);if(dd<R&&dd>=R-.42){bx(root,c,.6,c,sb,x,.42,z);bx(root,c,.06,c,st,x,.75,z);}}
  vDisc(root,0,0,R-.38,.12,.02,vm('stone'));const w=box(2*(R-.4),.02,2*(R-.4),TWWATER,{s:.8,ox:0,oy:0,oz:0});w.castShadow=false;put(root,w,0,.55,0);
  bx(root,.6,1.2,.6,sb,0,.72,0);bx(root,.8,.12,.8,st,0,1.36,0);hollow(root,1.4,.24,1.4,.12,st,0,1.42,0);const w2=bx(root,1.18,.02,1.18,TWWATER,0,1.6,0);w2.castShadow=false;
  bx(root,.24,.6,.24,st,0,1.9,0);bx(root,.4,.12,.4,st,0,2.26,0);bx(root,.24,.24,.24,st,0,2.44,0);
  for(const[a,b]of[[1,0],[-1,0],[0,1],[0,-1]]){bx(root,.12,.08,.2,st,a*.12,2.1,b*.12).rotation.y=a?Math.PI/2:0;const j=bx(root,.06,.06,.36,TWWATER,a*.3,2.06,b*.3);j.rotation.y=a?Math.PI/2:0;j.castShadow=false;
    const f=bx(root,.08,1.5-.62,.08,TWWATER,a*.76,1.12+.0,b*.76);f.castShadow=false;const f2=bx(root,.08,.4,.08,TWWATER,a*.5,1.86,b*.5);f2.castShadow=false;bx(root,.14,.08,.2,st,a*.71,1.62,b*.71).rotation.y=a?Math.PI/2:0;}
  return root;}
/* ---------- notice board ---------- */
function twNotice(){const root=kRoot(1.4),d=vm('planksDark'),r=mulberry32(12);for(const s of[-1,1])bx(root,.14,2.5,.14,d,s*.8,1.25,0);bx(root,1.5,1,.06,vm('planks'),0,1.6,.03);bx(root,1.6,.06,.1,d,0,1.07,.03);
  for(let i=0;i<6;i++){const x=-.5+(i%3)*.5+(r()-.5)*.1,y=1.85-Math.floor(i/3)*.45;bx(root,.3,.36,.01,vm('paper'),x,y,.065,0,0,(r()-.5)*.2);bx(root,.03,.03,.02,vm('iron'),x,y+.15,.072);}
  put(root,vRoof(.7,1.9,.4,vm('shingle'),{ov:.1,ovL:.05,step:.1,gable:d}),0,2.5,0);return root;}
/* ---------- pillory and stocks ---------- */
function twPillory(){const root=kRoot(2.6),d=vm('planksDark'),p=vm('planks');bx(root,2,.6,2,vm('planks'),-.6,.3,0);bx(root,.8,.3,.4,p,-.6,.15,1.2);
  bx(root,.16,1.5,.16,d,-.6,1.35,-.1);const y=1.95;bx(root,1.2,.14,.12,d,-.6,y-.08,-.1);bx(root,1.2,.14,.12,d,-.6,y+.07,-.1);for(const[x,s]of[[-.6,.1],[-1,.06],[-.2,.06]])bx(root,s*2,s*1.4,.13,vm('dark'),x,y,-.1);
  bx(root,.08,.08,.14,vm('iron'),-1.15,y,-.1);
  const sx=1.3;for(const s of[-1,1])bx(root,.12,.7,.12,d,sx+s*.6,.35,.2);bx(root,1.3,.12,.1,d,sx,.45,.2);bx(root,1.3,.12,.1,d,sx,.58,.2);for(const s of[-1,1])bx(root,.12,.08,.11,vm('dark'),sx+s*.25,.51,.2);
  bx(root,1.3,.08,.3,p,sx,.35,-.3);for(const s of[-1,1])bx(root,.08,.31,.26,d,sx+s*.55,.155,-.3);return root;}
/* ---------- statue ---------- */
function twStatue(){const root=kRoot(1.8),st=vm('stoneBrick'),sm=vm('statue');bx(root,2,.3,2,vm('cobble'),0,.15,0);bx(root,1.4,.3,1.4,st,0,.45,0);bx(root,1,1.2,1,st,0,1.2,0);bx(root,1.2,.2,1.2,st,0,1.9,0);bx(root,.5,.3,.02,vm('bronze'),0,1.2,.51);
  const f=new THREE.Group();put(root,f,0,2,0);bx(f,.6,.1,.5,sm,0,.05,0);bx(f,.5,.9,.32,sm,0,.55,0);bx(f,.56,.3,.36,sm,0,.85,0);bx(f,.58,.35,.34,sm,0,1.15,0);bx(f,.24,.12,.22,sm,0,1.38,0);bx(f,.26,.3,.26,sm,0,1.58,0);bx(f,.3,.08,.3,sm,0,1.76,0);
  for(const s of[-1,1])bx(f,.14,.5,.16,sm,s*.36,1.05,0);bx(f,.14,.14,.4,sm,.36,.86,.15);bx(f,.1,.3,.1,sm,.36,.8,.36);bx(f,.12,.12,.12,sm,-.36,.75,.03);bx(f,.5,.7,.06,sm,0,.85,-.19);return root;}
/* ---------- signpost ---------- */
function twSign(){const root=kRoot(1.4),d=vm('planksDark'),p=vm('planks');bx(root,.6,.24,.6,vm('cobble'),0,.12,0);bx(root,.16,2.8,.16,d,0,1.4,0);bx(root,.24,.12,.24,d,0,2.84,0);
  for(const[y,ry,len]of[[2.5,.3,1.1],[2.1,2.4,1],[1.7,-1.2,.9]]){const g=new THREE.Group();put(root,g,0,y,0,0,ry,0);bx(g,len,.22,.05,p,.08+len/2,0,.1);bx(g,.12,.16,.05,p,.14+len+.04,0,.1);bx(g,.06,.08,.05,p,.14+len+.12,0,.1);for(const x of[.2,.08+len-.1])bx(g,.03,.03,.02,vm('iron'),x,0,.13);}return root;}
/* ---------- flower planters ---------- */
function twPlanters(){const root=kRoot(1.8),r=mulberry32(21);for(const x of[-.9,.9]){const g=new THREE.Group();put(root,g,x,0,0);hollow(g,1.2,.45,.5,.06,vm('planks'));bx(g,1.08,.02,.38,vm('dirt'),0,.4,0);for(const s of[-1,1])bx(g,.08,.06,.5,vm('planksDark'),s*.55,.48,0);
    for(let i=0;i<8;i++){const fx=-.45+(i%4)*.3,fz=-.1+Math.floor(i/4)*.2;bx(g,.1,.12+r()*.08,.1,vm('leaves'),fx,.47,fz);bx(g,.08,.08,.08,vm(['woolRed','gold','woolPurple','woolWhite','blossomPink'][Math.floor(r()*5)]),fx,.6+r()*.06,fz);}}
  return root;}
/* ---------- the market square ---------- */
function twSquare(){const root=kRoot(13),L=root.userData.lights;const fl=box(24,.1,24,vm('cobble'),{s:.8,ox:0,oy:0,oz:0});fl.castShadow=false;put(root,fl,0,.05,0);
  const add=(fn,x,z,ry=0,dy=.1)=>{const a=fn();a.userData.lights.forEach(l=>L.push(l));put(root,a,x,dy,z,0,ry,0);return a;};
  add(twFountain,0,0);const st=[['vx-market',-6,-8.6,0],['vx-stall-6',0,-8.6,0],['vx-stall-7',6,-8.6,0],['vx-stall-10',-8.6,-2.4,Math.PI/2],['vx-stall-9',-8.6,3.6,Math.PI/2],['vx-stall-11',8.6,-2.4,-Math.PI/2],['vx-stall-8',8.6,3.6,-Math.PI/2]];
  for(const[id,x,z,ry]of st){const a=ASSETS.find(q=>q.id===id).build();a.children.filter(o=>o.userData.noFrame).forEach(o=>a.remove(o));a.userData.lights.forEach(l=>{L.push(l);});put(root,a,x,.1,z,0,ry,0);}
  const cart=(k,x,z,ry)=>{const a=twCart(1,{goods:k});put(root,a,x,.1,z,0,ry,0);};cart('fruit',-4.4,6.8,.3);cart('flowers',4.2,7.2,-.4);
  add(twRoast,-8.4,9,Math.PI/2);add(twRug,8.6,9.2,-Math.PI/2);add(twNotice,-2.2,-11.2);add(twPillory,3.4,11);add(twSign,-10.6,-10.6,.8);add(twPlanters,0,-5.6);add(twPlanters,0,5.6,Math.PI);
  for(const[x,z]of[[-5,-5],[5,-5],[-5,5],[5,5]]){const a=lStreetLantern();a.userData.lights.forEach(l=>L.push(l));put(root,a,x,.1,z);}
  for(const[x,z,ry]of[[-3.6,0,Math.PI/2],[3.6,0,-Math.PI/2]]){const b=new THREE.Group();put(root,b,x,.1,z,0,ry,0);vBench(b,0,0);}return root;}

const TW=(id,name,build,desc,x={})=>ASSETS.push(Object.assign({id:'tw-'+id,folder:'buildings/medieval/town',name,build,desc},x));
TW('cart','Vendor\'s handcart',twCart,'Two-wheeled handcart with a striped canopy on four poles and six tilted display crates; it stands on its wheels and two back legs, handles forward. Goods option; the canopy colour can be changed.',{awning:true,opts:[{key:'goods',label:'Goods',choices:Object.entries(TW_CART),def:'fruit'}]});
TW('roast','Roast stand',twRoast,'Brick grill with glowing coals under a shingle roof on four posts: sausages and skewers on the iron bars, a side counter with bread, a barrel, a sack and firewood.');
TW('rug','Rug seller',twRug,'Three rugs hung from a pole rack, a big rug on the ground with rolled rugs, stacked cushions and a velvet seat.');
TW('fountain','Town fountain',twFountain,'Round stone basin with water, a pillar with an upper bowl and four spouts; water runs down into the basin. Stands on a flagstone pad.');
TW('notice','Notice board',twNotice,'Plank board on two posts under a small shingle roof, with six notices pinned to it.');
TW('pillory','Pillory and stocks',twPillory,'Pillory on a plank platform with a step (holes for head and hands, iron lock) and a set of stocks with a bench beside it.');
TW('statue','Town statue',twStatue,'Stone figure of a founder in a long coat holding a scroll, on a stepped stone plinth with a blank bronze plaque.');
TW('signpost','Signpost',twSign,'Post on a stone base with three blank arrow boards pointing different ways at different heights.');
TW('planters','Flower planters',twPlanters,'Two plank planters full of flowers.');
TW('square','Market square',twSquare,'Cobbled market square around the fountain: seven market stalls (produce, butcher, fishmonger, jeweller, apothecary, wine and ale, armourer), fruit and flower carts, the roast stand, a rug seller, the notice board, a pillory, a signpost, planters, benches and four street lanterns.',{groundR:13});
