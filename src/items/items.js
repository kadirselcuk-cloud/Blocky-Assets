/* ======================= ITEMS ======================= */
VXD.wine=liquid('#3f1c22');VXD.ale=liquid('#997745');VXD.oil=liquid('#685a2f');VXD.milk=liquid('#d9d6cf');
VXD.grain=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,(x+y*3)%4===0?'#a28b4f':'#d2b977',nz(r,.85,1.1));};
VXD.flour=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,'#d9d6cf',nz(r,.93,1.03));};
VXD.mail=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++){const ring=((x+(y>>1)%2*2)%4===0)||(y%2===0&&x%4===2);P(x,y,ring?'#5c5d66':'#9b9fa6',nz(r,.9,1.08));}};
VXD.blanket=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,(Math.floor(x/4)+Math.floor(y/4))%2?'#7c4644':'#985b4f',nz(r,.9,1.05));};
VXD.paper=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,y%3===1&&x>2&&x<13?'#877b67':'#d9d0bc',nz(r,.94,1.02));};
const GLASSMAT=new THREE.MeshStandardMaterial({color:0xc7d8d9,transparent:true,opacity:.32,roughness:.08,metalness:.1,depthWrite:false});
const liquidMat=hex=>{const k='lq'+hex;if(VXM[k])return VXM[k];const c=new THREE.Color(hex).convertSRGBToLinear();return VXM[k]=new THREE.MeshStandardMaterial({color:c,emissive:c,emissiveIntensity:.35,roughness:.2,transparent:true,opacity:.9});};
function iRoot(g=2){const r=new THREE.Group();r.userData.lights=[];r.userData.ground=g;return r;}
/* stand a long item upright with its lowest point on the ground */
function upright(obj,lie){const g=iRoot(2);g.add(obj);obj.updateMatrixWorld(true);let b=new THREE.Box3().setFromObject(obj);const s=b.getSize(new THREE.Vector3());
  if(lie){if(s.y>=s.z&&s.y>=s.x)obj.rotation.x=Math.PI/2;}else if(s.z>s.y*1.3&&s.z>s.x*1.3)obj.rotation.x=-Math.PI/2;
  obj.updateMatrixWorld(true);b=new THREE.Box3().setFromObject(obj);const c=b.getCenter(new THREE.Vector3());obj.position.set(-c.x,-b.min.y+.01,-c.z);return g;}
function vFlame(par,x,y,z,s,L,minI=.8){const g=new THREE.Group();put(par,g,x,y,z);const a=new THREE.Mesh(new THREE.BoxGeometry(s,s*1.5,s),FIRE);a.position.y=s*.75;g.add(a);const b=new THREE.Mesh(new THREE.BoxGeometry(s*.55,s*.9,s*.55),FIRE);b.position.y=s*1.75;g.add(b);
  a.onBeforeRender=()=>{const t=performance.now()/1000;FIRE.emissiveIntensity=1.8+.6*Math.sin(t*9.1+1);b.scale.y=.8+.3*Math.sin(t*13+x*7);b.position.x=Math.sin(t*7+z)*s*.08;};
  if(L){const pl=new THREE.PointLight(0xefa860,0,Math.max(2.5,s*36),2);pl.position.set(0,s*2,0);pl.userData.lamp=true;pl.userData.min=minI;g.add(pl);L.push(pl);}return g;}
function hollow(par,w,h,d,t,mat,x=0,y=0,z=0){bx(par,w,t,d,mat,x,y+t/2,z);for(const s of[-1,1]){bx(par,w,h,t,mat,x,y+h/2,z+s*(d/2-t/2));bx(par,t,h,d-2*t,mat,x+s*(w/2-t/2),y+h/2,z);}}
const iron=()=>vm('iron'),wd=()=>vm('planks'),wdd=()=>vm('planksDark'),gold=()=>vm('gold'),lea=()=>vm('leather');

/* ---------- extra tools ---------- */
Object.assign(TOOLS,{
  Shovel:{two:false,build(){const g=new THREE.Group();bx(g,.04,1.3,.04,wd(),0,.3,0);bx(g,.16,.05,.05,wdd(),0,-.37,0);bx(g,.24,.3,.03,iron(),0,1.06,0);bx(g,.16,.06,.03,iron(),0,1.24,0);return g;}},
  Pitchfork:{two:false,build(){const g=new THREE.Group();bx(g,.04,1.5,.04,wd(),0,.35,0);bx(g,.26,.04,.04,iron(),0,1.12,0);for(const x of[-.11,0,.11])bx(g,.025,.32,.025,iron(),x,1.3,0);return g;}},
  Sickle:{two:false,build(){const g=new THREE.Group();bx(g,.05,.3,.05,wd(),0,0,0);for(const[x,y]of[[.02,.2],[.08,.3],[.16,.36],[.25,.36],[.32,.31],[.36,.23]])bx(g,.08,.05,.025,iron(),x,y,0);return g;}},
  Scythe:{two:false,build(){const g=new THREE.Group();bx(g,.05,1.7,.05,wd(),0,.45,0);bx(g,.05,.05,.18,wdd(),0,.4,.08);for(let i=0;i<7;i++)bx(g,.03,.06+i*.004,.12,iron(),0,1.27-i*.025,.08+i*.11);return g;}},
  Saw:{two:false,build(){const g=new THREE.Group();bx(g,.05,.16,.12,wd(),0,0,0);bx(g,.02,.14,.7,iron(),0,.0,.42);for(let i=0;i<9;i++)bx(g,.021,.03,.03,iron(),0,-.085,.12+i*.07);return g;}},
  Tongs:{two:false,build(){const g=new THREE.Group();for(const s of[-1,1]){bx(g,.03,.6,.03,iron(),s*.03,.1,0);bx(g,.06,.04,.03,iron(),s*.04,.42,0);}bx(g,.05,.05,.05,iron(),0,.18,0);return g;}},
  Bucket:{two:false,build(){const g=new THREE.Group();bx(g,.3,.3,.3,vm('barrel'),0,-.32,0);bx(g,.26,.02,.26,vm('water'),0,-.18,0);bx(g,.02,.2,.02,iron(),.15,-.1,0);bx(g,.02,.2,.02,iron(),-.15,-.1,0);bx(g,.32,.02,.02,iron(),0,0,0);return g;}},
});
/* ---------- weapons (grip at origin, blade up) ---------- */
function wSword(len=.8,w=.07,guard=.18){const g=new THREE.Group();bx(g,.05,.2,.05,lea(),0,-.1,0);bx(g,.08,.08,.08,gold(),0,-.24,0);bx(g,guard,.05,.08,gold(),0,.025,0);bx(g,w,len,.02,iron(),0,.05+len/2,0);bx(g,.015,len*.75,.024,vm('stone'),0,.05+len*.4,0);bx(g,w*.6,.08,.02,iron(),0,.09+len,0);bx(g,w*.3,.06,.02,iron(),0,.15+len,0);return g;}
function wFalchion(){const g=new THREE.Group();bx(g,.05,.2,.05,lea(),0,-.1,0);bx(g,.07,.07,.07,iron(),0,-.24,0);bx(g,.16,.05,.08,iron(),0,.025,0);for(let i=0;i<7;i++){const w=.07+i*.012;bx(g,w,.11,.02,iron(),w/2-.035,.1+i*.105,0);}bx(g,.08,.08,.02,iron(),.06,.86,0,0,0,.5);return g;}
function wMace(){const g=new THREE.Group();bx(g,.05,.6,.05,wd(),0,.15,0);bx(g,.06,.12,.06,lea(),0,-.08,0);bx(g,.14,.18,.14,iron(),0,.52,0);for(const[a,b]of[[1,0],[-1,0],[0,1],[0,-1]])bx(g,a?.06:.04,.2,b?.06:.04,iron(),a*.09,.52,b*.09);bx(g,.06,.06,.06,iron(),0,.64,0);return g;}
function wWarhammer(){const g=new THREE.Group();bx(g,.05,.8,.05,wd(),0,.25,0);bx(g,.06,.14,.06,lea(),0,-.08,0);bx(g,.26,.1,.1,iron(),.04,.62,0);bx(g,.12,.06,.06,iron(),-.14,.62,0);bx(g,.05,.14,.05,iron(),0,.72,0);return g;}
function wBattleAxe(){const g=new THREE.Group();bx(g,.05,1.1,.05,wd(),0,.35,0);for(let i=0;i<5;i++){const h=.12+Math.sin(i/4*Math.PI)*.2;bx(g,.05,h,.03,iron(),.07+i*.05,.82,0);}bx(g,.06,.12,.06,iron(),0,.82,0);bx(g,.08,.06,.03,iron(),-.06,.82,0);return g;}
function wHalberd(){const g=new THREE.Group();bx(g,.05,2.2,.05,wd(),0,.5,0);bx(g,.05,.36,.025,iron(),0,1.78,0);bx(g,.03,.1,.02,iron(),0,2.0,0);for(let i=0;i<4;i++)bx(g,.05,.3-i*.04,.025,iron(),.06+i*.05,1.5,0);bx(g,.16,.05,.025,iron(),-.1,1.52,0);bx(g,.05,.05,.025,iron(),-.18,1.47,0);return g;}
function wArrows(){const g=new THREE.Group();for(let i=0;i<12;i++){const x=(i%4-1.5)*.04,z=(Math.floor(i/4)-1)*.04;bx(g,.015,.75,.015,wd(),x,.37,z);bx(g,.03,.05,.015,iron(),x,.76,z);bx(g,.035,.1,.01,vm('woolWhite'),x,.04,z);}bx(g,.18,.05,.14,lea(),0,.3,0);return g;}
function wRoundShield(c='woolRed'){const g=new THREE.Group(),p=new THREE.Group();g.add(p);p.rotation.x=Math.PI/2;vDisc(p,0,0,.42,-.03,.06,vm('planks'),.08);const n0=p.children.length;vDisc(p,0,0,.42,.03,.012,vm(c),.08);p.children.slice(n0).forEach(m=>{if(m.position.x>0)m.material=vm('woolWhite');});
  const rim=new THREE.Mesh(new THREE.TorusGeometry(.42,.035,4,48),iron());rim.castShadow=true;rim.rotation.z=Math.PI/4;g.add(rim);const boss=new THREE.Mesh(new THREE.CylinderGeometry(.08,.09,.06,24),iron());boss.rotation.x=Math.PI/2;boss.position.z=.05;g.add(boss);return g;}
function wHeater(c1='woolBlue',c2='gold'){const g=new THREE.Group();const rows=[[.62,.2],[.6,.2],[.56,.16],[.48,.14],[.38,.12],[.26,.1],[.12,.08]];let y=.5;rows.forEach(([w,h],i)=>{y-=h/2;bx(g,w/2,h,.05,vm(c1),-w/4,y,0);bx(g,w/2,h,.05,vm(c2),w/4,y,0);for(const s of[-1,1])bx(g,.05,h,.07,iron(),s*w/2,y,0);
    const nx=rows[i+1]?rows[i+1][0]:0;if(nx<w)for(const s of[-1,1])bx(g,(w-nx)/2+.05,.04,.07,iron(),s*((w+nx)/4),y-h/2,0);y-=h/2;});
  bx(g,.68,.05,.07,iron(),0,.5,0);bx(g,.18,.18,.06,vm('woolWhite'),0,.25,-.03);return g;}
/* ---------- armour (on a stand or a block) ---------- */
function mannequin(root){bx(root,.5,.06,.5,wdd(),0,.03,0);bx(root,.06,1,.06,wd(),0,.55,0);bx(root,.36,.5,.22,wd(),0,1.25,0);bx(root,.12,.14,.12,wd(),0,1.55,0);}
function aHelmKettle(){const g=new THREE.Group(),im=iron();bx(g,.34,.12,.34,im,0,.06,0);bx(g,.3,.12,.3,im,0,.18,0);bx(g,.2,.06,.2,im,0,.27,0);bx(g,.52,.03,.52,im,0,.0,0);return g;}
function aHelmNasal(){const g=new THREE.Group(),im=iron();bx(g,.34,.16,.34,im,0,.08,0);bx(g,.28,.1,.28,im,0,.21,0);bx(g,.16,.08,.16,im,0,.3,0);bx(g,.06,.18,.03,im,0,-.07,.17);bx(g,.36,.04,.36,vm('stone'),0,.02,0);return g;}
function aHelmGreat(){const g=new THREE.Group(),im=iron();bx(g,.34,.4,.34,im,0,.2,0);bx(g,.3,.06,.3,im,0,.43,0);bx(g,.26,.035,.02,vm('dark'),0,.27,.171);for(let i=0;i<6;i++)bx(g,.025,.025,.02,vm('dark'),(i%3-1)*.06,.12-Math.floor(i/3)*.05,.171);bx(g,.36,.04,.36,gold(),0,.33,0);return g;}
function aCoif(){const g=new THREE.Group(),m=vm('mail');bx(g,.34,.3,.34,m,0,.15,0);bx(g,.4,.12,.4,m,0,-.04,0);bx(g,.22,.2,.04,vm('dark'),0,.12,.16);return g;}
function aOnStand(kind){const root=iRoot(1.6);mannequin(root);const m=kind==='mail'?vm('mail'):kind==='leather'?vm('leather'):bm('#9c8b66','quilt');
  bx(root,.42,.56,.28,m,0,1.24,0);for(const s of[-1,1])bx(root,.14,.34,.16,m,s*.27,1.36,0);bx(root,.44,.24,.3,m,0,.88,0);
  if(kind==='leather'){for(const s of[-1,1])bx(root,.03,.56,.02,vm('cattail'),s*.1,1.24,.15);bx(root,.46,.05,.32,vm('cattail'),0,1.02,0);bx(root,.06,.05,.02,gold(),0,1.02,.17);}
  if(kind==='mail')bx(root,.46,.05,.32,lea(),0,1.03,0);if(kind!=='leather'){const h=kind==='mail'?aCoif():aHelmKettle();put(root,h,0,1.6,0);}return root;}
function aGauntlets(){const root=iRoot(1.4);for(const s of[-1,1]){const g=new THREE.Group();put(root,g,s*.18,0,0,0,s*.3,0);bx(g,.14,.06,.2,iron(),0,.03,0);bx(g,.12,.04,.08,iron(),0,.08,.1);bx(g,.16,.14,.12,iron(),0,.08,-.12);bx(g,.05,.04,.08,iron(),.08,.04,.06);}return root;}
function aBoots(){const root=iRoot(1.4);for(const s of[-1,1]){const g=new THREE.Group();put(root,g,s*.12,0,0,0,s*.15,0);bx(g,.14,.36,.14,lea(),0,.18,-.04);bx(g,.14,.1,.28,lea(),0,.05,.04);bx(g,.15,.03,.3,vm('cattail'),0,.0,.04);bx(g,.16,.06,.16,vm('cattail'),0,.35,-.04);}return root;}
/* ---------- potions ---------- */
function pBottle(shape,hex){const root=iRoot(1.2);const lq=liquidMat(hex),G=GLASSMAT;
  const dims={round:[.3,.26,.3,.1,.12],tall:[.16,.42,.16,.08,.12],square:[.2,.24,.2,.08,.1],vial:[.08,.26,.08,.05,.06],jug:[.32,.36,.32,.12,.1]}[shape];const[w,h,d,nw,nh]=dims;
  const body=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),G);body.position.y=h/2;root.add(body);const neck=new THREE.Mesh(new THREE.BoxGeometry(nw,nh,nw),G);neck.position.y=h+nh/2;root.add(neck);
  const l=new THREE.Mesh(new THREE.BoxGeometry(w*.86,h*.7,d*.86),lq);l.position.y=h*.36;root.add(l);bx(root,nw*.9,.05,nw*.9,vm('cattail'),0,h+nh+.025,0);
  if(shape!=='vial')bx(root,w*.6,h*.3,.005,vm('paper'),0,h*.45,d/2+.003);if(shape==='jug')bx(root,.04,.18,.04,G,w/2+.03,h*.6,0);
  const pl=new THREE.PointLight(new THREE.Color(hex),0,1.5,2);pl.position.set(0,h*.4,0);pl.userData.lamp=true;pl.userData.min=.15;root.add(pl);root.userData.lights.push(pl);return root;}
function pRack(){const root=iRoot(1.8);const sh=new THREE.Group();root.add(sh);for(const s of[-1,1])bx(sh,.06,1.3,.3,wdd(),s*.6,.65,0);for(const y of[.05,.5,.95])bx(sh,1.26,.05,.3,wd(),0,y,0);bx(sh,1.26,1.3,.03,wd(),0,.65,-.14);
  const cols=['#a54b4a','#456098','#51964d','#754687','#d4b55f','#c17e57'];for(let k=0;k<3;k++)for(let i=0;i<5;i++){const hx=cols[(i+k*2)%6],w=.1+((i+k)%3)*.03,h=.16+((i*2+k)%3)*.05,x=-.48+i*.24,y=.08+k*.45;
    const b=new THREE.Mesh(new THREE.BoxGeometry(w,h,w),GLASSMAT);b.position.set(x,y+h/2,0);root.add(b);const l=new THREE.Mesh(new THREE.BoxGeometry(w*.8,h*.65,w*.8),liquidMat(hx));l.position.set(x,y+h*.34,0);root.add(l);bx(root,w*.4,.05,w*.4,vm('cattail'),x,y+h+.03,0);}
  return root;}
/* ---------- containers with contents ---------- */
const FILL={water:'water',wine:'wine',ale:'ale',oil:'oil',milk:'milk',grain:'grain',flour:'flour',coal:'coal'};
function fillTop(par,kind,w,y,d){if(FILL[kind]){const m=box(w,.04,d,vm(FILL[kind]),{s:.8,ox:0,oy:0,oz:0});put(par,m,0,y,0);return;}
  const r=mulberry32(hashStr(kind));const piece={apples:['woolRed',.1],potatoes:['leather',.11],cabbages:['leaves',.17],carrots:['gold',.07],fish:['fish',.1],nails:['iron',.04],bread:['hay',.14],eggs:['woolWhite',.07],mushrooms:['woolRed',.09],flowers:['woolPurple',.07],bottles:['glass',.08],ingots:['gold',.12]}[kind];if(!piece)return;
  bx(par,w,.03,d,vm(kind==='fish'?'water':'dark'),0,y-.06,0);const[mat,s]=piece,n=Math.max(4,Math.floor(w*d/(s*s)*.7));
  for(let i=0;i<n;i++){const x=(r()-.5)*(w-s),z=(r()-.5)*(d-s),yy=y-.03+r()*s*.6;if(kind==='fish'){const f=vFish(par,x,yy+.06,z,r()*3);f.rotation.x=Math.PI/2;}else if(kind==='ingots')bx(par,s*1.6,s*.6,s*.8,vm('gold'),x*.6,yy,z*.6,0,(i%2)*Math.PI/2,0);
    else if(kind==='bottles'){const b=new THREE.Mesh(new THREE.BoxGeometry(s,s*2.4,s),GLASSMAT);b.position.set(x*.7,y+s,z*.7);par.add(b);bx(par,s*.8,s*1.2,s*.8,liquidMat(['#3f1c22','#395733','#997745'][i%3]),x*.7,y+s*.6,z*.7);}
    else bx(par,s,s*.85,s,vm(mat),x,yy,z,0,r()*3,0);}
  if(kind==='mushrooms')for(let i=0;i<5;i++)bx(par,.05,.06,.05,vm('woolWhite'),(r()-.5)*w*.7,y+.02,(r()-.5)*d*.7);}
function iBarrel(o={}){const root=iRoot(1.6),c=o.contents||'water',b=new THREE.Group();root.add(b);if(c==='closed')bx(b,.6,.8,.6,vm('barrel'),0,.4,0);else hollow(b,.6,.8,.6,.06,vm('barrel'));
  if(c==='closed'){bx(b,.52,.02,.52,vm('planks'),0,.805,0);bx(b,.14,.03,.08,iron(),0,.82,0);}else if(c==='empty')bx(b,.48,.02,.48,vm('dark'),0,.07,0);
  else if(c==='arrows'){bx(b,.48,.5,.48,vm('dark'),0,.31,0);for(let i=0;i<14;i++){const x=(i%4-1.5)*.1,z=(Math.floor(i/4)-1.5)*.1;bx(b,.02,.5,.02,wd(),x,.95,z);bx(b,.05,.1,.015,vm('woolWhite'),x,1.18,z);}}
  else{bx(b,.48,.58,.48,vm('dark'),0,.35,0);fillTop(b,c,.48,.68,.48);}if(o.tap)bx(b,.06,.06,.12,wdd(),0,.2,.34);return root;}
function iBarrelStack(){const root=iRoot(2);for(let i=0;i<3;i++){const b=iBarrel({contents:'closed'});b.position.set(-.64+i*.64,0,0);root.add(b);}for(let i=0;i<2;i++){const b=iBarrel({contents:'closed'});b.position.set(-.32+i*.64,.81,0);root.add(b);}return root;}
function iCask(){const root=iRoot(1.8);const st=new THREE.Group();root.add(st);for(const s of[-1,1]){bx(st,.08,.3,.9,wdd(),s*.25,.15,0);bx(st,.12,.1,.1,wdd(),s*.25,.32,0);}
  const b=new THREE.Group();put(root,b,0,.62,0,0,0,Math.PI/2);bx(b,.6,.9,.6,vm('barrel'),0,0,0);bx(b,.5,.02,.5,vm('logEnd'),0,.455,0);bx(b,.5,.02,.5,vm('logEnd'),0,-.455,0);bx(root,.06,.12,.06,wdd(),0,.4,.31);bx(root,.2,.08,.2,iron(),0,.04,.38);return root;}
function iSack(o={}){const root=iRoot(1.2),c=o.contents||'grain';bx(root,.44,.56,.4,vm('burlap'),0,.28,0);
  if(c==='closed'){bx(root,.3,.1,.26,vm('burlap'),0,.6,0);bx(root,.18,.06,.18,vm('rope'),0,.68,0);bx(root,.12,.1,.12,vm('burlap'),0,.75,0);}else{bx(root,.48,.06,.44,vm('burlap'),0,.55,0);fillTop(root,c,.38,.58,.34);}return root;}
function iSackPile(){const root=iRoot(1.8);const pos=[[-.45,0,0],[0,0,.05],[.45,0,0],[-.22,.5,.02],[.22,.5,.02]];pos.forEach(([x,y,z],i)=>{const s=iSack({contents:'closed'});s.position.set(x,y,z);s.rotation.y=i*.3;root.add(s);});return root;}
function iCrate(o={}){const root=iRoot(1.4),c=o.contents||'closed';vCrate(root,.7,0,0,0,0);if(c==='closed')return root;bx(root,.62,.02,.62,vm('dark'),0,.66,0);
  fillTop(root,c,.6,.72,.6);const lid=new THREE.Group();put(root,lid,0,0,.64,-.36,0,0);bx(lid,.7,.7,.06,vm('crate'),0,.35,0);return root;}
VXD.wicker=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,(x+y)%4<2?'#735737':'#584028',(y%4===0?.8:1)*nz(r,.9,1.06));};
function iBasket(o={}){const root=iRoot(1);const c=o.contents||'apples',b=new THREE.Group();root.add(b);b.scale.setScalar(1.6);const wk=vm('wicker'),hd=bm('#36281a','leather');hollow(b,.44,.22,.34,.04,wk);bx(b,.46,.03,.36,hd,0,.215,0);bx(b,.4,.14,.3,vm('dark'),0,.09,0);for(const s of[-1,1])bx(b,.035,.22,.035,hd,s*.2,.32,0);bx(b,.44,.035,.035,hd,0,.43,0);fillTop(b,c,.36,.2,.26);return root;}
function iChestItem(o={}){const root=iRoot(1.4);vChest(root,0,0,0,o.open===1);return root;}
function iPots(kind){const root=iRoot(1.4),c=vm('clayPot');
  if(kind==='pot'){bx(root,.36,.32,.36,c,0,.16,0);bx(root,.42,.16,.42,c,0,.36,0);bx(root,.3,.06,.3,c,0,.47,0);bx(root,.24,.02,.24,vm('dark'),0,.5,0);}
  else if(kind==='jug'){bx(root,.32,.34,.32,c,0,.17,0);bx(root,.24,.12,.24,c,0,.4,0);bx(root,.14,.12,.14,c,0,.52,0);bx(root,.04,.22,.04,c,.18,.4,0);bx(root,.06,.04,.04,c,.15,.5,0);}
  else if(kind==='amphora'){const st=[[.16,.06],[.24,.14],[.32,.2],[.34,.16],[.26,.1],[.14,.16],[.18,.04]];let y=0;st.forEach(([w,h])=>{bx(root,w,h,w,c,0,y+h/2,0);y+=h;});for(const s of[-1,1])bx(root,.04,.22,.04,c,s*.18,y-.2,0);}
  else if(kind==='cauldron'){hollow(root,.6,.42,.6,.06,iron(),0,.1,0);for(const s of[-1,1]){bx(root,.68,.06,.06,iron(),0,.52,s*.31);bx(root,.06,.06,.68,iron(),s*.31,.52,0);}bx(root,.48,.2,.48,vm('dark'),0,.26,0);bx(root,.48,.02,.48,vm('stew'),0,.4,0);for(const[a,b]of[[1,1],[1,-1],[-1,1],[-1,-1]])bx(root,.06,.12,.06,iron(),a*.22,.06,b*.22);for(const s of[-1,1])bx(root,.04,.04,.12,iron(),s*.36,.5,0);}
  else{for(let i=0;i<5;i++){const s=.6+(i%3)*.25,g=new THREE.Group();put(root,g,(i-2)*.32,0,(i%2)*.25);g.scale.setScalar(s);bx(g,.3,.28,.3,c,0,.14,0);bx(g,.36,.12,.36,c,0,.32,0);bx(g,.2,.08,.2,c,0,.42,0);}}
  return root;}
/* ---------- farm goods ---------- */
function iHaystack(){const root=iRoot(2.4);const h=vm('hay');for(let i=0;i<7;i++){const r=1.3*(1-i/8);vDisc(root,0,0,r,i*.36,.36,h);}bx(root,.08,.5,.08,wdd(),0,2.7,0);return root;}
function iHayBales(n){const root=iRoot(2);const p=n===1?[[0,0,0]]:[[-.42,0,0],[.42,0,0],[0,.8,0],[-.42,0,.82],[.42,0,.82]];p.forEach(([x,y,z])=>{vHay(root,x,y,z);for(const s of[-.22,.22])bx(root,.04,.82,.84,vm('rope'),x+s,y+.4,z);});return root;}
function iStook(){const root=iRoot(1.6);for(let i=0;i<6;i++){const a=i/6*Math.PI*2,g=new THREE.Group();put(root,g,Math.cos(a)*.18,0,Math.sin(a)*.18,Math.sin(a)*.18,0,-Math.cos(a)*.18);bx(g,.16,.8,.16,vm('hay'),0,.4,0);bx(g,.2,.24,.2,vm('grain'),0,.9,0);bx(g,.18,.04,.18,vm('rope'),0,.5,0);}return root;}
function iStrawPack(){const root=iRoot(1.4);bx(root,.9,.36,.5,vm('hay'),0,.18,0);bx(root,.9,.36,.5,vm('hay'),0,.54,0);for(const x of[-.28,.28])bx(root,.04,.74,.52,vm('rope'),x,.37,0);return root;}
function iWheelbarrow(){const root=iRoot(1.6);bx(root,.7,.06,.8,wd(),0,.42,0);for(const s of[-1,1])bx(root,.06,.26,.8,wd(),s*.33,.55,0);bx(root,.7,.26,.06,wd(),0,.55,.4);
  for(const s of[-1,1]){bx(root,.06,.06,1.2,wdd(),s*.3,.38,-.3);bx(root,.05,.4,.05,wdd(),s*.3,.2,-.55);}bx(root,.08,.4,.4,wdd(),0,.22,.6);bx(root,.1,.12,.12,iron(),0,.22,.6);vHay(root,0,.32,0).scale.set(.7,.4,.8);return root;}
function iTrough(water){const root=iRoot(1.8);hollow(root,1.6,.5,.6,.08,wdd());bx(root,1.44,.24,.44,vm('dark'),0,.2,0);bx(root,1.44,.04,.44,vm(water?'water':'hay'),0,.36,0);if(!water)for(let i=0;i<8;i++)bx(root,.2,.06,.16,vm('hay'),-.6+i*.17,.4,(i%2-.5)*.14,0,i,0);return root;}
/* ---------- furniture ---------- */
function iTable(kind){const root=iRoot(1.8);const w=kind==='long'?2.4:kind==='round'?1:1.3,d=kind==='long'?.9:kind==='round'?1:.8;bx(root,w,.08,d,wd(),0,.78,0);for(const[a,b]of[[1,1],[1,-1],[-1,1],[-1,-1]])bx(root,.08,.74,.08,wdd(),a*(w/2-.1),.37,b*(d/2-.1));for(const s of[-1,1])bx(root,w-.2,.06,.06,wdd(),0,.2,s*(d/2-.1));bx(root,.06,.06,d-.2,wdd(),0,.2,0);
  if(kind==='long'){bx(root,w-.4,.01,.5,vm('woolWhite'),0,.825,0);for(let i=0;i<4;i++){bx(root,.24,.03,.24,vm('clayPot'),-.9+i*.6,.84,.2);bx(root,.1,.12,.1,vm('barrel'),-.9+i*.6,.88,-.2);}bx(root,.3,.14,.2,vm('hay'),0,.9,0);bx(root,.2,.2,.2,vm('woolRed'),.5,.92,0);}
  if(kind==='round'){bx(root,.3,.2,.3,vm('clayPot'),0,.92,0);bx(root,.16,.2,.16,vm('leaves'),0,1.1,0);}return root;}
function iBench(){const root=iRoot(1.4);vBench(root,0,0);return root;}
function iChair(){const root=iRoot(1.2);bx(root,.46,.06,.44,wd(),0,.46,0);for(const[a,b]of[[1,1],[1,-1],[-1,1],[-1,-1]])bx(root,.06,.46,.06,wdd(),a*.19,.23,b*.18);for(const s of[-1,1])bx(root,.06,.56,.06,wdd(),s*.19,.76,-.18);for(const y of[.72,.92])bx(root,.4,.08,.04,wd(),0,y,-.19);return root;}
function iStool(){const root=iRoot(1);bx(root,.4,.06,.4,wd(),0,.45,0);for(const[a,b]of[[1,1],[1,-1],[-1,1],[-1,-1]])bx(root,.06,.44,.06,wdd(),a*.15,.22,b*.15);for(const s of[-1,1])bx(root,.3,.04,.04,wdd(),0,.14,s*.15);return root;}
function iBed(){const root=iRoot(2);bx(root,1.1,.3,2.1,wdd(),0,.25,0);bx(root,1.1,.7,.1,wdd(),0,.5,-1.05);bx(root,1.1,.45,.08,wdd(),0,.4,1.06);bx(root,1,.14,1.95,vm('hay'),0,.46,0);bx(root,1.02,.06,1.3,vm('blanket'),0,.55,.3);bx(root,.6,.12,.3,vm('woolWhite'),0,.6,-.78);return root;}
function iShelf(){const root=iRoot(1.8);for(const s of[-1,1])bx(root,.06,1.6,.36,wdd(),s*.6,.8,0);for(const y of[.05,.55,1.05,1.55])bx(root,1.26,.05,.36,wd(),0,y,0);bx(root,1.26,1.6,.03,wd(),0,.8,-.17);
  const r=mulberry32(5);for(const y of[.08,.58,1.08])for(let i=0;i<4;i++){const x=-.42+i*.28,h=.18+r()*.14;if((i+y*10)%3<1){bx(root,.2,h,.2,vm('clayPot'),x,y+h/2,0);}else if((i+y*10)%3<2){bx(root,.22,.22,.22,vm('crate'),x,y+.11,0);}else{bx(root,.16,.24,.2,vm(['woolRed','woolBlue','leather'][i%3]),x,y+.12,0);}}return root;}
function iCupboard(){const root=iRoot(1.8);bx(root,1.1,1.7,.5,wdd(),0,.85,0);for(const s of[-1,1]){bx(root,.5,1.3,.03,wd(),s*.27,1,.26);bx(root,.04,.12,.04,iron(),s*.06,1,.29);}bx(root,1.04,.3,.03,wd(),0,.2,.26);bx(root,1.2,.08,.6,wdd(),0,1.74,0);return root;}
function iWorkbench(){const root=iRoot(1.8);const t=vTable(root,0,0,1.8,.8);bx(t,.2,.2,.2,iron(),.7,.98,.3);bx(t,.06,.06,.3,iron(),.7,.98,.5);put(t,TOOLS.Hammer.build(),-.3,.95,0,0,.4,Math.PI/2);put(t,TOOLS.Saw.build(),.2,.95,-.1,0,-.2,Math.PI/2);vlog(t,.8,.18,.18,'x',-.5,.98,-.2);bx(root,1.6,.06,.6,wd(),0,.2,0);return root;}
/* ---------- lighting ---------- */
function lCandle(){const root=iRoot(.8);bx(root,.2,.03,.2,vm('clayPot'),0,.015,0);bx(root,.06,.18,.06,vm('woolWhite'),0,.12,0);vFlame(root,0,.21,0,.03,root.userData.lights,.4);return root;}
function lCandlestick(){const root=iRoot(1.2);bx(root,.24,.04,.24,iron(),0,.02,0);bx(root,.04,.5,.04,iron(),0,.27,0);for(const s of[-1,0,1]){if(s){bx(root,.18,.03,.03,iron(),s*.09,.4,0);bx(root,.03,.12,.03,iron(),s*.18,.46,0);}const y=s?.52:.52;bx(root,.07,.03,.07,iron(),s*.18,y,0);bx(root,.05,.14,.05,vm('woolWhite'),s*.18,y+.08,0);vFlame(root,s*.18,y+.15,0,.03,s===0?root.userData.lights:null,.4);}return root;}
function lOilLamp(){const root=iRoot(.8);bx(root,.24,.08,.16,vm('clayPot'),0,.04,0);bx(root,.12,.06,.1,vm('clayPot'),.13,.06,0);bx(root,.08,.04,.08,vm('dark'),-.03,.09,0);bx(root,.04,.08,.03,vm('clayPot'),-.13,.1,0);vFlame(root,.17,.09,0,.035,root.userData.lights,.4);return root;}
function lHandLantern(){const root=iRoot(.9);bx(root,.24,.04,.24,iron(),0,.02,0);bx(root,.24,.04,.24,iron(),0,.34,0);for(const[a,b]of[[1,1],[1,-1],[-1,1],[-1,-1]])bx(root,.03,.32,.03,iron(),a*.105,.18,b*.105);
  const gl=new THREE.Mesh(new THREE.BoxGeometry(.2,.28,.2),GLASSMAT);gl.position.y=.18;root.add(gl);bx(root,.06,.08,.06,vm('woolWhite'),0,.08,0);vFlame(root,0,.12,0,.04,root.userData.lights,.5);bx(root,.1,.06,.1,iron(),0,.39,0);for(const s of[-1,1])bx(root,.02,.12,.02,iron(),s*.06,.48,0);bx(root,.14,.02,.02,iron(),0,.54,0);return root;}
function lWallLantern(){const root=iRoot(1.2);bx(root,.4,1.2,.12,vm('cobble'),0,.6,-.2);bx(root,.06,.06,.36,iron(),0,.9,-.02);bx(root,.04,.3,.04,iron(),0,.75,-.1,.6,0,0);const l=lHandLantern();l.userData.ground=undefined;put(root,l,0,.32,.14);root.userData.lights.push(...l.userData.lights);return root;}
function lStreetLantern(){const root=iRoot(1.6);bx(root,.4,.2,.4,vm('cobble'),0,.1,0);vlog(root,.16,2.6,.16,'y',0,1.5,0);bx(root,.06,.06,.6,iron(),0,2.7,.27);bx(root,.04,.4,.04,iron(),0,2.45,.1,.75,0,0);const l=lHandLantern();put(root,l,0,2.12,.52);root.userData.lights.push(...l.userData.lights);l.children.forEach(c=>{if(c.isPointLight){c.distance=7;c.userData.min=.6;}});return root;}
function lStandingTorch(){const root=iRoot(1.2);bx(root,.3,.12,.3,vm('cobble'),0,.06,0);vlog(root,.08,1.7,.08,'y',0,.95,0);for(const s of[-1,1])bx(root,.04,.3,.04,iron(),s*.08,1.85,0,0,0,-s*.3);bx(root,.2,.06,.2,iron(),0,1.72,0);bx(root,.16,.12,.16,vm('cattail'),0,1.8,0);vFlame(root,0,1.86,0,.14,root.userData.lights,1.2);return root;}
function lWallTorch(){const root=iRoot(1);bx(root,.5,1.4,.12,vm('stoneBrick'),0,.7,-.2);bx(root,.12,.08,.2,iron(),0,.85,-.06);bx(root,.1,.06,.1,iron(),0,.95,.04);const t=new THREE.Group();put(root,t,0,.92,.06,.4,0,0);bx(t,.06,.5,.06,wd(),0,.2,0);bx(t,.1,.12,.1,vm('cattail'),0,.48,0);vFlame(t,0,.54,0,.1,root.userData.lights,1);return root;}
function lBrazier(){const root=iRoot(1.4);for(const[a,b]of[[1,1],[1,-1],[-1,1],[-1,-1]])bx(root,.05,.7,.05,iron(),a*.24,.35,b*.24);bx(root,.62,.2,.62,iron(),0,.8,0);bx(root,.54,.06,.54,EMBER,0,.9,0);
  for(const[x,z,s]of[[-.1,0,.16],[.12,.08,.12],[.02,-.12,.11]])vFlame(root,x,.92,z,s,x<0?root.userData.lights:null,1.4);return root;}
function lCampfire(){const root=iRoot(1.6);const L=root.userData.lights;vFirePit(root,0,0,L);for(let i=0;i<4;i++){const a=i/4*Math.PI*2+.4;vlog(root,.12,.12,.7,'z',Math.cos(a)*.2,.16,Math.sin(a)*.2).rotation.y=-a;}vlog(root,.9,.14,.14,'x',0,.06,.85);vlog(root,.9,.14,.14,'x',.2,.06,-.85);return root;}

/* ---------- registry ---------- */
FOLDERS['items']={name:'Items',blurb:'Tools, weapons, armour, potions, containers, farm goods, furniture and lighting',children:['tools','weapons','armor','potions','containers','farm','furniture','lighting'].map(k=>'items/'+k)};
Object.assign(FOLDERS,{'items/tools':{name:'Tools',blurb:'Work tools',children:[]},'items/weapons':{name:'Weapons',blurb:'Blades, polearms, bows and shields',children:[]},'items/armor':{name:'Armour',blurb:'Helmets, body armour, gloves and boots',children:[]},
  'items/potions':{name:'Potions',blurb:'Bottled brews that glow faintly',children:[]},'items/containers':{name:'Containers',blurb:'Barrels, sacks, crates, baskets, pots and chests',children:[]},'items/farm':{name:'Farm goods',blurb:'Hay, straw and farm equipment',children:[]},
  'items/furniture':{name:'Furniture',blurb:'Tables, seats, beds and storage',children:[]},'items/lighting':{name:'Lighting',blurb:'Candles, lamps, lanterns, torches and fires',children:[]}});
const IT=(id,f,name,build,desc,opts)=>ASSETS.push({id:'it-'+id,folder:'items/'+f,name,build,desc,opts});
for(const n of['Axe','Pickaxe','Sledgehammer','Hammer','Hoe','Shovel','Pitchfork','Sickle','Scythe','Saw','Tongs','Bucket','Fishing rod','Crook','Ladle'])IT('tool-'+n.toLowerCase().replace(' ','-'),'tools',n,()=>upright(TOOLS[n].build()),`${n}, shown standing on end.`);
const BOOKC=[['#7b3a38','Red'],['#3b4782','Blue'],['#3a683b','Green'],['#664834','Brown'],['#262428','Black'],['#58345f','Purple'],['#bfa356','Ochre'],['#396e61','Teal'],['#a26949','Orange'],['#6e6966','Grey']];
IT('book','tools','Book',(s,o)=>upright(TOOLS.Book.build(o.cover||'#7b3a38'),true),'Book with stiff covers larger than its white pages, a spine and gilt bands.',[{key:'cover',label:'Cover colour',choices:BOOKC,def:'#7b3a38'}]);
IT('books','tools','Book stack',()=>{const root=iRoot(1.2);BOOKC.forEach(([c],i)=>{const b=TOOLS.Book.build(c);const g=new THREE.Group();g.add(b);b.rotation.set(0,0,Math.PI/2);put(root,g,(i%2-.5)*.06,.05+i*.08,0,0,(i*.37)%1-.5,0);});return root;},'Stack of ten books, one in each cover colour.');
[['sword','Arming sword',()=>wSword()],['longsword','Longsword',()=>wSword(1.15,.08,.24)],['dagger','Dagger',()=>wSword(.34,.05,.12)],['falchion','Falchion',wFalchion],['mace','Flanged mace',wMace],['warhammer','War hammer',wWarhammer],['battleaxe','Battle axe',wBattleAxe],['halberd','Halberd',wHalberd],['spear','Spear',()=>TOOLS.Spear.build()],['bow','Bow',()=>TOOLS.Bow.build()],['arrows','Arrow bundle',wArrows],['roundshield','Round shield',()=>wRoundShield()],['heater','Heater shield',()=>wHeater()]]
  .forEach(([id,name,f])=>IT('w-'+id,'weapons',name,()=>upright(f()),`${name}.`));
IT('a-kettle','armor','Kettle helm',()=>upright(aHelmKettle()),'Iron kettle helm with a wide brim.');IT('a-nasal','armor','Nasal helm',()=>upright(aHelmNasal()),'Rounded iron helm with a nose guard.');IT('a-great','armor','Great helm',()=>upright(aHelmGreat()),'Flat-topped great helm with an eye slit, breathing holes and a gold band.');
IT('a-coif','armor','Mail coif',()=>upright(aCoif()),'Hood of chain mail.');IT('a-mail','armor','Mail shirt',()=>aOnStand('mail'),'Chain-mail shirt and coif on a wooden stand.');IT('a-leather','armor','Leather armour',()=>aOnStand('leather'),'Hardened leather cuirass with straps and a belt.');IT('a-gambeson','armor','Gambeson',()=>aOnStand('gambeson'),'Quilted padded jacket and kettle helm on a stand.');
IT('a-gauntlets','armor','Gauntlets',aGauntlets,'Pair of iron gauntlets.');IT('a-boots','armor','Riding boots',aBoots,'Pair of tall leather boots.');
[['health','Health potion','round','#b15350'],['mana','Mana potion','tall','#46659b'],['stamina','Stamina potion','square','#52a550'],['poison','Poison','vial','#743c84'],['elixir','Elixir','vial','#d9bb62'],['fire','Fire tonic','jug','#c8875a']].forEach(([id,name,sh,c])=>IT('p-'+id,'potions',name,()=>pBottle(sh,c),`${name} in a glass ${sh==='jug'?'jug':sh+' bottle'} with a cork.`));
IT('p-rack','potions','Potion shelf',pRack,'Shelf of fifteen bottles in six colours.');
const BAR=[['water','Water'],['wine','Wine'],['ale','Ale'],['oil','Oil'],['milk','Milk'],['grain','Grain'],['flour','Flour'],['apples','Apples'],['potatoes','Potatoes'],['fish','Fish'],['nails','Nails'],['arrows','Arrows'],['coal','Coal'],['empty','Empty'],['closed','Closed']];
IT('c-barrel','containers','Barrel',(s,o)=>iBarrel(o),'Open barrel; pick its contents.',[{key:'contents',label:'Contents',choices:BAR,def:'wine'}]);
IT('c-cask','containers','Cask on stand',iCask,'Cask on its side on a cradle, with a tap and a drip tray.');IT('c-barrels','containers','Barrel stack',iBarrelStack,'Five sealed barrels stacked in a pyramid.');
IT('c-sack','containers','Sack',(s,o)=>iSack(o),'Burlap sack, open or tied shut.',[{key:'contents',label:'Contents',choices:[['grain','Grain'],['flour','Flour'],['potatoes','Potatoes'],['coal','Coal'],['apples','Apples'],['closed','Tied']],def:'grain'}]);
IT('c-sacks','containers','Sack pile',iSackPile,'Five tied sacks piled up.');
IT('c-crate','containers','Crate',(s,o)=>iCrate(o),'Wooden crate, closed or open with goods.',[{key:'contents',label:'Contents',choices:[['closed','Closed'],['apples','Apples'],['cabbages','Cabbages'],['carrots','Carrots'],['fish','Fish'],['bottles','Bottles'],['ingots','Gold ingots']],def:'apples'}]);
IT('c-basket','containers','Basket',(s,o)=>iBasket(o),'Woven basket with a handle.',[{key:'contents',label:'Contents',choices:[['apples','Apples'],['bread','Bread'],['eggs','Eggs'],['mushrooms','Mushrooms'],['flowers','Flowers'],['carrots','Carrots']],def:'bread'}]);
IT('c-chest','containers','Chest',(s,o)=>iChestItem(o),'Iron-bound chest.',[{key:'open',label:'Lid',choices:[[0,'Closed'],[1,'Open with gold']],def:1}]);
[['pot','Clay pot'],['jug','Jug'],['amphora','Amphora'],['cauldron','Cauldron'],['set','Pot set']].forEach(([k,n])=>IT('c-'+k,'containers',n,()=>iPots(k),`${n}${k==='cauldron'?' of iron with stew':k==='set'?' of five clay pots':' of fired clay'}.`));
IT('f-haystack','farm','Haystack',iHaystack,'Round stepped haystack with a centre pole.');IT('f-bale','farm','Hay bale',()=>iHayBales(1),'Single square hay bale tied with rope.');IT('f-bales','farm','Hay bale stack',()=>iHayBales(5),'Five tied hay bales stacked.');
IT('f-stook','farm','Wheat stook',iStook,'Six wheat sheaves leaned together to dry.');IT('f-straw','farm','Straw pack',iStrawPack,'Two compressed straw packs bound with rope.');IT('f-wheelbarrow','farm','Wheelbarrow',iWheelbarrow,'Wooden wheelbarrow carrying hay.');
IT('f-trough','farm','Water trough',()=>iTrough(true),'Plank water trough.');IT('f-feeder','farm','Feed trough',()=>iTrough(false),'Plank trough filled with hay.');
IT('u-table','furniture','Table',()=>iTable('plain'),'Plain plank table.');IT('u-longtable','furniture','Feast table',()=>iTable('long'),'Long table laid with a cloth, plates, cups, bread and fruit.');IT('u-roundtable','furniture','Square side table',()=>iTable('round'),'Small table with a potted plant.');
IT('u-bench','furniture','Bench',iBench,'Plank bench.');IT('u-chair','furniture','Chair',iChair,'Wooden chair with a slatted back.');IT('u-stool','furniture','Stool',iStool,'Splayed-leg stool.');IT('u-bed','furniture','Bed',iBed,'Wooden bed with a straw mattress, a checked blanket and a pillow.');
IT('u-shelf','furniture','Shelf',iShelf,'Open shelf of pots, boxes and cloth.');IT('u-cupboard','furniture','Cupboard',iCupboard,'Two-door cupboard with a drawer.');IT('u-workbench','furniture','Workbench',iWorkbench,'Workbench with a vise, hammer, saw and a log.');
[['candle','Candle',lCandle,'Candle in a clay dish.'],['candlestick','Candlestick',lCandlestick,'Three-branch iron candlestick.'],['oillamp','Oil lamp',lOilLamp,'Clay oil lamp with a burning wick.'],['lantern','Lantern',lHandLantern,'Iron hand lantern with glass sides and a carry handle.'],
 ['walllantern','Wall lantern',lWallLantern,'Lantern hung from an iron bracket on a stone wall.'],['streetlantern','Street lantern',lStreetLantern,'Lantern hung from a log post on a stone base.'],['standingtorch','Standing torch',lStandingTorch,'Pole torch with an iron cage on a stone base.'],
 ['walltorch','Wall torch',lWallTorch,'Torch in an iron sconce on a stone wall.'],['brazier','Brazier',lBrazier,'Iron fire bowl of glowing coals on splayed legs.'],['campfire','Campfire',lCampfire,'Stone-ringed fire with logs and spare wood.']]
  .forEach(([id,n,f,d])=>IT('l-'+id,'lighting',n,f,d+' Flames flicker and light up at dusk and night.'));
