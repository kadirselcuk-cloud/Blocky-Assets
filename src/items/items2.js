/* ======================= ITEMS 2: decoration, trophies, armoury, stores, provisions ======================= */
/* pixel-art pictures (tapestries, paintings, rugs, maps): one canvas per design, nearest filtered, shown on the front face of a box */
const ARTT={},ARTM={};
function artTex(key,W,H,draw){if(ARTT[key])return ARTT[key];const c=document.createElement('canvas');c.width=W;c.height=H;const g=c.getContext('2d'),r=mulberry32(hashStr('art'+key));
  const P=(x,y,hex,f)=>{if(x<0||y<0||x>=W||y>=H)return;g.fillStyle=col(hex,f??(.92+r()*.1));g.fillRect(x|0,y|0,1,1);};
  const F=(x,y,w,h,hex)=>{for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)P(i,j,hex);};
  const D=(cx,cy,rad,hex)=>{for(let j=-rad;j<=rad;j++)for(let i=-(rad-Math.abs(j));i<=rad-Math.abs(j);i++)P(cx+i,cy+j,hex);};
  const C=(cx,cy,rad,hex)=>{for(let j=-rad;j<=rad;j++)for(let i=-rad;i<=rad;i++)if(i*i+j*j<=rad*rad+rad)P(cx+i,cy+j,hex);};
  draw({P,F,D,C,W,H,r});const t=new THREE.CanvasTexture(c);t.magFilter=THREE.NearestFilter;t.minFilter=THREE.NearestFilter;t.generateMipmaps=false;t.encoding=THREE.sRGBEncoding;return ARTT[key]=t;}
function artPanel(par,w,h,d,key,side,x,y,z,rx,ry,rz){const m=ARTM[key]||(ARTM[key]=new THREE.MeshStandardMaterial({map:ARTT[key],roughness:.92}));const s=side||vm('dark');
  const mesh=shadowed(new THREE.Mesh(new THREE.BoxGeometry(w,h,d),[s,s,s,s,m,s]));put(par,mesh,x,y,z,rx,ry,rz);return mesh;}
/* lay an object flat: its +y axis turned to point along the given yaw on the ground plane */
function iLay(par,obj,x,y,z,yaw=0,roll=0){const o=new THREE.Group();put(par,o,x,y,z,0,yaw,0);const i=new THREE.Group();i.rotation.set(-Math.PI/2,0,roll);i.add(obj);o.add(i);return o;}
/* wall piece behind hung items; the wall's front face is z = 0 */
const WALLC=[['stone','Stone wall'],['plaster','Plaster wall'],['none','None (hang it yourself)']];
function iWall(root,o,w,h){const k=o.wall||'stone';if(k==='none'){root.userData.ground=-1;return;}bx(root,w,h,.2,vm(k==='stone'?'stoneBrick':'plaster'),0,h/2,-.1);if(k==='plaster')bx(root,w,.16,.24,vm('timber'),0,.08,-.1);}
const fur=h=>bm(h,'hair'),plain=h=>bm(h,'plain');

/* ---------- tapestries ---------- */
const TAPD={
  diamonds:a=>{const{F,D,W,H}=a;F(0,0,W,H,'#c0a25a');F(1,1,W-2,H-2,'#68322f');F(2,2,W-4,H-4,'#c8ab62');F(3,3,W-6,H-6,'#763935');
    for(let k=0;k<5;k++){const y=8+k*8;for(const x of(k%2?[16]:[9,23])){D(x,y,4,'#d0b26a');D(x,y,2,'#393b75');D(x,y,0,'#d9cda4');}}},
  tree:a=>{const{F,C,P,W,H,r}=a;F(0,0,W,H,'#c0a25a');F(1,1,W-2,H-2,'#363766');F(2,2,W-4,H-4,'#374f34');F(3,40,W-6,5,'#536639');
    F(14,24,4,17,'#634730');F(12,39,8,2,'#634730');F(11,40,3,1,'#634730');F(18,40,3,1,'#634730');C(16,17,10,'#4e7542');C(13,14,4,'#5d8a4f');C(20,19,4,'#5d8a4f');
    for(let i=0;i<14;i++){const a2=r()*6.28,d=r()*8;P(16+Math.cos(a2)*d,17+Math.sin(a2)*d,'#ab584d');}for(let i=0;i<10;i++)P(4+r()*24,41+r()*3,i%2?'#d9cda4':'#b56170');},
  hunt:a=>{const{F,P,C,W,H,r}=a;F(0,0,W,H,'#c0a25a');F(1,1,W-2,H-2,'#5e2f2b');F(2,2,W-4,H-4,'#344833');
    for(let i=0;i<60;i++){const x=3+r()*26,y=3+r()*42;P(x,y,['#b56170','#d9cda4','#d1b25e','#708db2'][i%4]);}
    for(const[x,y]of[[6,12],[26,10],[5,34]]){F(x,y+3,2,7,'#543c2a');C(x+1,y,3,'#4b663e');}
    F(10,27,11,5,'#815e40');F(19,22,3,6,'#815e40');F(20,20,5,3,'#815e40');P(25,21,'#271c14');P(22,20,'#1a1a19');for(const x of[11,13,18,20])F(x,32,1,6,'#634730');P(9,27,'#d9cdbc');
    for(const[x,y]of[[21,18],[20,17],[19,16],[18,15],[18,14],[20,15],[23,18],[24,17],[25,16],[26,15],[26,14],[24,15]])P(x,y,'#d9d0bc');
    F(4,30,6,3,'#8f8a85');F(9,28,2,3,'#8f8a85');P(10,28,'#1a1a19');F(4,33,1,4,'#6e6966');F(8,33,1,4,'#6e6966');F(2,30,2,1,'#8f8a85');},
  stripes:a=>{const{F,D,W,H}=a;const c=['#3b4782','#d9d0bc','#c0a25a','#d9d0bc'];for(let x=0;x<W;x++)F(x,0,1,H,c[Math.floor(x/4)%4]);F(0,0,W,8,'#68322f');F(0,H-6,W,6,'#68322f');
    for(let x=2;x<W;x+=8){F(x+1,2,4,4,"#d0b26a");F(x+2,H-4,2,2,"#d0b26a");}},
};
const TAPC=[['diamonds','Diamonds'],['tree','Tree of life'],['hunt','Stag hunt'],['stripes','Bands']];
function iTapestry(o={}){const root=iRoot(1.6),k=TAPD[o.design]?o.design:'diamonds';iWall(root,o,1.8,2.7);artTex('tap-'+k,32,48,TAPD[k]);
  const cl=bm('#c0a25a','cloth');artPanel(root,1.2,1.8,.03,'tap-'+k,cl,0,1.3,.08);
  bx(root,1.44,.05,.05,wdd(),0,2.24,.08);for(const s of[-1,1]){bx(root,.08,.08,.08,gold(),s*.74,2.24,.08);bx(root,.04,.04,.06,iron(),s*.66,2.24,.03);bx(root,.04,.1,.04,iron(),s*.66,2.17,.02);}
  for(let i=0;i<6;i++)bx(root,.08,.09,.07,cl,-.5+i*.2,2.2,.08);for(let i=0;i<12;i++)bx(root,.04,.08,.02,gold(),-.55+i*.1,.36,.08);return root;}

/* ---------- paintings ---------- */
const PAINT={
  landscape:[24,18,a=>{const{F,P,C,W,r}=a;for(let y=0;y<9;y++)F(0,y,W,1,['#729dbe','#7ba5c4','#86acc9','#91b6d0','#9cbdd4','#a8c5d9','#b1cad9','#b9cdd9','#c1d2d9'][y]);C(18,3,2,'#d9ca8f');
    for(let x=0;x<W;x++){const h=8+Math.round(Math.sin(x*.45)*1.5+Math.sin(x*.2+1));F(x,h,1,18-h,'#71876f');const h2=11+Math.round(Math.sin(x*.3+2)*1.2);F(x,h2,1,18-h2,'#577646');}
    for(let y=11;y<18;y++){const x=Math.round(8+Math.sin(y*.6)*2+(y-11)*.6);F(x,y,2+((y-11)>>1),1,'#5879a1');}F(3,9,1,4,'#453226');C(3,8,2,'#3c5733');for(let i=0;i<8;i++)P(r()*24,13+r()*5,'#d5c866');}],
  castle:[24,18,a=>{const{F,P,W}=a;for(let y=0;y<10;y++)F(0,y,W,1,y<5?'#d0987a':'#d9b28d');F(0,10,W,8,'#536642');for(let x=0;x<W;x++){const h=12-Math.round(Math.max(0,4-Math.abs(x-12)*.45));F(x,h,1,18-h,'#62764b');}
    F(8,5,8,4,'#8f8a85');F(6,3,3,6,'#7b7a80');F(15,3,3,6,'#7b7a80');F(10,2,3,4,'#9f9a94');for(const x of[6,8,15,17,10,12])P(x,x>=10&&x<=12?1:2,'#7b7a80');F(11,7,2,2,'#292521');P(7,5,'#292521');P(16,5,'#292521');P(11,3,'#292521');F(11,0,1,2,'#3c3938');P(12,0,'#a54b4a');}],
  ship:[24,18,a=>{const{F,P,W,r}=a;for(let y=0;y<11;y++)F(0,y,W,1,['#aac8d9','#b0cad9','#b5cbd9','#b9cdd9','#bed0d9','#c3d2d9','#c9d4d9','#cfd4d9','#d2d6d9','#d4d7d9','#d7d9d9'][y]);for(let y=11;y<18;y++)F(0,y,W,1,y%2?'#3e5788':'#4b6792');
    for(let i=0;i<16;i++)P(r()*24,11+r()*7,'#90b5c8');F(6,10,12,2,'#634730');F(7,12,10,1,'#543c28');P(5,10,'#634730');P(18,9,'#634730');F(11,2,1,8,'#453226');for(let y=3;y<10;y++)F(12,y,y-2,1,y%2?'#b35c50':'#d9cdb0');for(const[x,y]of[[3,3],[19,2],[16,5]]){P(x,y,'#3c3938');P(x+1,y-1,'#3c3938');P(x-1,y-1,'#3c3938');}}],
  stilllife:[24,18,a=>{const{F,C,P,W}=a;F(0,0,W,18,'#2b231b');F(0,12,W,6,'#634730');F(0,12,W,1,'#815e40');F(3,6,4,6,'#9f9a94');F(4,4,2,2,'#9f9a94');P(7,7,'#9f9a94');P(7,8,'#9f9a94');
    F(9,10,9,2,'#a98d61');F(10,12,7,1,'#846b4d');C(11,8,1,'#a54b4a');C(14,8,2,'#a54b4a');C(16,9,1,'#cdb35c');for(const[x,y]of[[12,10],[13,9],[12,8],[11,9]])P(x,y,'#66346a');P(14,5,'#453226');P(15,5,'#4c7539');C(20,11,1,'#d5c866');}],
  portrait:[18,24,a=>{const{F,P,C,W}=a;F(0,0,W,24,'#263729');F(3,17,12,7,'#6a3035');F(2,19,14,5,'#6a3035');F(7,14,4,4,'#ceab92');C(9,10,3,'#d6b49a');F(6,6,7,3,'#453226');F(5,5,9,2,'#1d1a1a');F(6,3,7,2,'#1d1a1a');P(8,10,'#271c14');P(10,10,'#271c14');F(8,12,3,1,'#9d7064');
    for(let x=5;x<14;x++)P(x,17+((x-9)*(x-9)>>3),'#d1b25e');P(9,20,'#d1b25e');}],
};
const PAINTC=[['landscape','Landscape'],['castle','Castle at dusk'],['ship','Ship at sea'],['stilllife','Still life'],['portrait','Portrait']];
/* framed painting, back at z = 0, bottom at y = 0 */
function iPainting(subj){const k=PAINT[subj]?subj:'landscape',[W,H,f]=PAINT[k];artTex('pt-'+k,W,H,f);const g=new THREE.Group(),s=.035,w=W*s,h=H*s,fr=gold();
  artPanel(g,w,h,.02,'pt-'+k,vm('planks'),0,h/2+.07,.03);for(const sy of[0,1])bx(g,w+.14,.07,.07,fr,0,sy?h+.105:.035,.035);for(const sx of[-1,1])bx(g,.07,h,.07,fr,sx*(w/2+.035),h/2+.07,.035);
  for(const sx of[-1,1])for(const sy of[0,1])bx(g,.09,.09,.08,fr,sx*(w/2+.035),sy?h+.105:.035,.04);g.userData.size=[w+.14,h+.14];return g;}
function iPaintingWall(o={}){const root=iRoot(1.4);iWall(root,o,1.6,2.4);const p=iPainting(o.subject);const[,h]=p.userData.size;put(root,p,0,1.55-h/2,0);return root;}
function iEasel(o={}){const root=iRoot(1.4),w=wd(),t=new THREE.Group();put(root,t,0,0,0,-.12,0,0);
  for(const s of[-1,1])bx(t,.06,1.78,.05,w,s*.24,.88,0,0,0,s*.13);bx(t,.6,.05,.05,w,0,1.5,0);bx(t,.7,.05,.12,w,0,.78,.06);bx(t,.7,.06,.03,w,0,.82,.11);
  const p=iPainting(o.subject);put(t,p,0,.805,.03);
  bx(root,.06,1.78,.05,w,0,.845,-.475,.315,0,0);bx(root,.05,.05,.32,wdd(),0,.55,-.32);return root;}

/* ---------- taxidermy ---------- */
function iPlaque(par,w,h){const p=wdd();bx(par,w,h,.05,p,0,0,.025);bx(par,w*.8,.06,.05,p,0,h/2+.03,.025);bx(par,w*.8,.06,.05,p,0,-h/2-.03,.025);bx(par,w*.5,.06,.05,p,0,-h/2-.09,.025);bx(par,w-.08,h-.08,.02,vm('planks'),0,0,.06);}
function tHead(kind){const g=new THREE.Group();const eye=plain('#15120e'),ey=(x,y,z)=>{for(const s of[-1,1])bx(g,.025,.035,.035,eye,s*x,y,z);};
  if(kind==='deer'){const f=fur('#815e43'),fl=fur('#c0a384'),an=plain('#d5c8aa');bx(g,.22,.3,.16,f,0,-.06,.08);bx(g,.2,.2,.22,f,0,.04,.24);bx(g,.14,.12,.2,f,0,.0,.44);bx(g,.1,.06,.03,plain('#1d1915'),0,.02,.55);bx(g,.12,.04,.16,fl,0,-.07,.44);ey(.1,.08,.3);
    for(const s of[-1,1]){bx(g,.04,.16,.08,f,s*.14,.15,.2,0,0,-s*.95);bx(g,.03,.1,.05,fl,s*.145,.155,.225,0,0,-s*.95);
      bx(g,.04,.12,.04,an,s*.07,.19,.22,0,0,-s*.35);bx(g,.035,.22,.035,an,s*.13,.33,.2,-.15,0,-s*.45);bx(g,.035,.2,.035,an,s*.2,.51,.17,-.1,0,-s*.15);bx(g,.03,.16,.03,an,s*.22,.68,.15,0,0,s*.15);
      bx(g,.03,.12,.03,an,s*.12,.36,.27,.7,0,0);bx(g,.03,.12,.03,an,s*.2,.56,.23,.6,0,0);bx(g,.03,.1,.03,an,s*.27,.6,.17,0,0,-s*.6);}}
  else if(kind==='boar'){const f=fur('#473a2f'),d=fur('#28201b'),tk=plain('#d9d3c2');bx(g,.3,.32,.18,f,0,-.04,.09);bx(g,.28,.26,.24,f,0,.0,.28);bx(g,.18,.15,.16,f,0,-.04,.48);bx(g,.15,.12,.03,plain('#af8981'),0,-.04,.57);for(const s of[-1,1])bx(g,.03,.04,.01,plain('#352723'),s*.035,-.04,.585);
    bx(g,.06,.06,.36,d,0,.15,.22);ey(.141,.05,.36);for(const s of[-1,1]){bx(g,.07,.13,.05,f,s*.15,.15,.24,0,0,-s*.6);const t=bx(g,.03,.1,.03,tk,s*.1,-.06,.52,0,0,-s*.35);t.rotation.x=-.3;}}
  else if(kind==='wolf'){const f=fur('#7d7975'),l=fur('#b8b4ae'),dk=plain('#1a1a19'),th=plain('#d9d6cd');bx(g,.3,.32,.16,f,0,-.06,.08);bx(g,.36,.24,.1,l,0,-.1,.14);bx(g,.24,.22,.2,f,0,.02,.24);bx(g,.12,.1,.2,f,0,-.01,.42);bx(g,.08,.05,.04,dk,0,.02,.53);
    bx(g,.11,.04,.16,l,0,-.1,.4,.3,0,0);for(const s of[-1,1]){bx(g,.02,.04,.02,th,s*.04,-.07,.49);bx(g,.07,.13,.04,f,s*.1,.17,.2,0,0,-s*.28);bx(g,.03,.07,.02,plain('#373130'),s*.1,.17,.222,0,0,-s*.28);}ey(.121,.07,.3);bx(g,.1,.03,.12,plain('#7b3a38'),0,-.065,.43);}
  else if(kind==='ram'){const f=fur('#d7d0c4'),fc=fur('#b5a996'),hn=plain('#a59980');bx(g,.3,.3,.16,f,0,-.06,.08);bx(g,.22,.2,.2,f,0,.06,.22);bx(g,.15,.15,.22,fc,0,.0,.38);bx(g,.08,.05,.03,plain('#473b34'),0,.02,.5);ey(.111,.06,.3);
    for(const s of[-1,1]){for(let i=0;i<10;i++){const a=-.3+i/9*Math.PI*1.7,R=.13-i*.006;bx(g,.07,.07,.07,hn,s*(.14+i*.014),.12+Math.sin(a)*R,.18+Math.cos(a)*R);}bx(g,.08,.04,.06,fc,s*.13,.02,.26,0,0,-s*.4);}}
  else{const f=fur('#533d2b'),m=fur('#856c53'),dk=plain('#191411'),th=plain('#d9d6cd');bx(g,.36,.36,.16,f,0,-.06,.08);bx(g,.3,.28,.24,f,0,.02,.26);bx(g,.16,.12,.14,m,0,-.04,.44);bx(g,.08,.05,.03,dk,0,-.01,.52);bx(g,.14,.04,.12,m,0,-.13,.42,.3,0,0);
    for(const s of[-1,1]){bx(g,.08,.08,.05,f,s*.14,.18,.24);bx(g,.02,.04,.02,th,s*.05,-.1,.48);}ey(.151,.06,.36);bx(g,.1,.03,.1,plain('#7b3a38'),0,-.085,.43);}
  return g;}
const TROPHY=[['deer','Stag'],['boar','Boar'],['wolf','Wolf'],['ram','Ram'],['bear','Bear']];
function iTrophy(o={}){const root=iRoot(1.4);iWall(root,o,1.4,2.4);const k=o.animal||'deer',pl=new THREE.Group();put(root,pl,0,1.55,0);iPlaque(pl,k==='bear'?.56:.46,.56);put(pl,tHead(k),0,-.02,.07);return root;}
function iFishMount(o={}){const root=iRoot(1.4);iWall(root,o,1.6,2.2);const pl=new THREE.Group();put(root,pl,0,1.5,0);const p=wdd();bx(pl,1.0,.3,.05,p,0,0,.025);bx(pl,.86,.06,.05,p,0,.18,.025);bx(pl,.86,.06,.05,p,0,-.18,.025);bx(pl,.9,.22,.02,vm('planks'),0,0,.06);
  const f=bm('#6e7747','plain'),b=bm('#c7c79c','plain'),sp=bm('#a8af71','plain');const segs=[[-.32,.06],[-.24,.1],[-.14,.13],[-.02,.14],[.1,.13],[.2,.11],[.28,.08]];
  for(const[x,h]of segs){bx(pl,.12,h,.08,f,x,.01,.11);bx(pl,.12,h*.35,.082,b,x,.01-h*.32,.11);}for(let i=0;i<7;i++)bx(pl,.03,.02,.084,sp,-.25+i*.08,.03+(i%2)*.025,.11);
  bx(pl,.12,.07,.07,f,.38,0,.11);bx(pl,.08,.03,.06,b,.4,-.03,.11);bx(pl,.03,.03,.084,plain('#14100d'),.33,.025,.11);bx(pl,.06,.16,.03,f,-.42,.0,.11);bx(pl,.04,.1,.03,f,-.46,.06,.11,0,0,.5);bx(pl,.04,.1,.03,f,-.46,-.06,.11,0,0,-.5);bx(pl,.1,.04,.03,f,-.18,.1,.11,0,0,.3);bx(pl,.1,.04,.03,f,.1,-.09,.11,0,0,-.3);
  bx(pl,.12,.035,.02,gold(),0,-.155,.075);return root;}
function iOwl(o={}){const root=iRoot(1);const p=wdd();bx(root,.44,.06,.44,p,0,.03,0);bx(root,.38,.04,.38,vm('planks'),0,.08,0);bx(root,.05,.22,.05,p,0,.21,0);vlog(root,.36,.06,.06,'x',0,.35,0);
  const br=fur('#745c45'),lt=fur('#d5c9b0'),dk=fur('#46362a'),ey=plain('#d7b561'),pu=plain('#14100d'),bk=plain('#38302a');
  bx(root,.22,.26,.18,br,0,.51,0);bx(root,.14,.2,.02,lt,0,.5,.095);for(let i=0;i<3;i++)bx(root,.1,.015,.021,dk,0,.44+i*.05,.096);for(const s of[-1,1])bx(root,.04,.22,.14,dk,s*.12,.5,-.01);bx(root,.18,.04,.08,br,0,.4,-.1,.4,0,0);
  bx(root,.22,.18,.18,br,0,.73,0);bx(root,.18,.12,.02,lt,0,.72,.095);for(const s of[-1,1]){bx(root,.055,.055,.02,ey,s*.045,.73,.105);bx(root,.025,.025,.02,pu,s*.045,.73,.115);bx(root,.04,.08,.04,br,s*.085,.84,0,0,0,-s*.35);}bx(root,.03,.04,.03,bk,0,.69,.11);
  for(const s of[-1,1])bx(root,.06,.03,.06,plain('#574b3f'),s*.05,.39,.03);
  if(o.dome!==0){const gm=GLASSMAT;for(const s of[-1,1]){bx(root,.36,.84,.01,gm,0,.52,s*.175);bx(root,.01,.84,.34,gm,s*.175,.52,0);}bx(root,.36,.01,.36,gm,0,.945,0);bx(root,.06,.04,.06,gold(),0,.97,0);}
  return root;}
function iBearRug(){const root=iRoot(1.8);const f=fur('#453226'),e=fur('#36261d'),cl=plain('#d9d3c4'),dk=plain('#191411'),th=plain('#d9d6cd'),lin=bm('#7b3a38','cloth');
  bx(root,.84,.03,1.26,lin,0,.015,-.1);bx(root,.8,.04,1.2,f,0,.035,-.1);for(const[x,z]of[[-.42,-.4],[.42,-.2],[-.42,.1],[.42,.3],[0,-.72]])bx(root,.12,.036,.16,e,x,.032,z);
  for(const s of[-1,1])for(const fz of[-1,1]){const lg=new THREE.Group();put(root,lg,s*.4,0,fz>0?.3:-.55,0,-s*fz*.5,0);bx(lg,.4,.04,.22,f,s*.18,.035,0);bx(lg,.12,.045,.22,e,s*.42,.035,0);for(let i=0;i<3;i++)bx(lg,.05,.03,.03,cl,s*.49,.03,-.06+i*.06);}
  bx(root,.3,.24,.3,f,0,.12,.65);bx(root,.18,.12,.16,fur('#856c53'),0,.1,.86);bx(root,.08,.05,.03,dk,0,.14,.94);bx(root,.16,.04,.14,fur('#856c53'),0,.02,.86);bx(root,.12,.04,.12,plain('#7b3a38'),0,.06,.86);
  for(const s of[-1,1]){bx(root,.08,.08,.05,f,s*.12,.27,.62);bx(root,.03,.04,.03,plain('#14100d'),s*.08,.18,.8);bx(root,.025,.05,.025,th,s*.05,.07,.92);}return root;}

/* ---------- rug ---------- */
const RUGC=[['red','Red'],['blue','Blue'],['green','Green']];
function iRug(o={}){const root=iRoot(1.8),k=o.colour||'red',c={red:['#763935','#c0a25a','#363766','#d9cdb0'],blue:['#393b75','#d0b26a','#68322f','#d9cdb0'],green:['#374f34','#c0a25a','#5e2f2b','#d9cdb0']}[k];
  artTex('rug-'+k,24,36,({F,D,P,W,H})=>{F(0,0,W,H,c[1]);F(1,1,W-2,H-2,c[2]);F(3,3,W-6,H-6,c[1]);F(4,4,W-8,H-8,c[0]);D(12,18,7,c[1]);D(12,18,5,c[2]);D(12,18,2,c[3]);for(const[x,y]of[[7,8],[17,8],[7,28],[17,28]])F(x-1,y-1,3,3,c[1]);
    for(let x=2;x<W-2;x+=3){P(x,2,c[3]);P(x,H-3,c[3]);}for(let y=2;y<H-2;y+=3){P(2,y,c[3]);P(W-3,y,c[3]);}});
  artPanel(root,1.6,2.4,.02,'rug-'+k,bm(c[0],'cloth'),0,.01,0,-Math.PI/2,0,0);for(const s of[-1,1])for(let i=0;i<14;i++)bx(root,.05,.01,.08,bm('#d9cdb0','cloth'),-.65+i*.1,.005,s*1.24);return root;}

/* ---------- armoury ---------- */
function iWeaponBarrel(o={}){const root=iRoot(1.6),c=o.contents||'mixed';hollow(root,.6,.8,.6,.06,vm('barrel'));bx(root,.48,.02,.48,vm('dark'),0,.07,0);for(const y of[.16,.64])bx(root,.62,.05,.62,iron(),0,y,0);
  const lean=(obj,x,z,yaw,base)=>{const g=new THREE.Group();put(root,g,x,.08,z);const d=Math.hypot(x,z)||1,th=.09;g.rotation.set(th*z/d,0,-th*x/d);const y=new THREE.Group();y.rotation.y=yaw;g.add(y);obj.position.y=base;y.add(obj);return obj;};
  const sword=(f,x,z,yaw)=>{const s=f();s.rotation.z=Math.PI;const b=new THREE.Box3().setFromObject(s);lean(s,x,z,yaw,-b.min.y);};
  const pole=(f,x,z,yaw)=>{const s=f();const b=new THREE.Box3().setFromObject(s);lean(s,x,z,yaw,-b.min.y);};
  const ring=(n,R,a0=0)=>Array.from({length:n},(_,i)=>{const a=a0+i/n*Math.PI*2;return[Math.cos(a)*R,Math.sin(a)*R,-a];});
  if(c==='swords'){ring(5,.12,.3).forEach(([x,z,a],i)=>sword(i%2?()=>wSword(1.0,.075,.22):()=>wSword(),x,z,a));sword(()=>wSword(.62,.06,.16),0,0,.8);}
  else if(c==='spears'){ring(5,.12).forEach(([x,z,a],i)=>pole(i===2?wHalberd:()=>TOOLS.Spear.build(),x,z,a));pole(()=>TOOLS.Spear.build(),0,0,1);}
  else{const R=ring(5,.12,.6);pole(()=>TOOLS.Spear.build(),...R[0]);pole(wHalberd,...R[1]);sword(()=>wSword(),...R[2]);sword(()=>wSword(1.0,.075,.22),...R[3]);pole(wBattleAxe,...R[4]);pole(()=>TOOLS.Spear.build(),0,0,2);}
  return root;}
function iWeaponRack(o={}){const root=iRoot(1.6),k=o.kind||'polearms',d=wdd(),w=wd();bx(root,1.6,.08,.44,d,0,.04,0);for(const s of[-1,1]){bx(root,.1,1.7,.1,d,s*.75,.93,0);bx(root,.1,.1,.44,d,s*.75,.13,0);}
  if(k==='polearms'){for(const z of[-.06,.06])bx(root,1.4,.06,.04,w,0,1.45,z);for(let i=0;i<6;i++)bx(root,.04,.06,.16,w,-.6+i*.24,1.45,0);for(let i=0;i<6;i++)bx(root,.06,.06,.2,w,-.6+i*.24,.11,0);
    const P=[()=>TOOLS.Spear.build(),wHalberd,()=>TOOLS.Spear.build(),wHalberd,()=>TOOLS.Spear.build()];P.forEach((f,i)=>{const s=f();const b=new THREE.Box3().setFromObject(s);put(root,s,-.48+i*.24,.08-b.min.y,0,0,i%2?Math.PI/2:0,0);});}
  else{bx(root,1.4,.06,.08,w,0,.9,-.08);bx(root,1.4,.06,.08,w,0,.11,.14);for(let i=0;i<5;i++){const s=wSword(i%2?1.0:.8,i%2?.075:.07,i%2?.22:.18);s.rotation.z=Math.PI;const b=new THREE.Box3().setFromObject(s);
      const g=new THREE.Group();put(root,g,-.5+i*.25,.08,.06,-.1,0,0);s.position.y=-b.min.y;g.add(s);}}
  return root;}
function iCrossbow(){const root=iRoot(1);const w=bm('#735641','leather'),ir=iron(),st=plain('#d9d4c9');bx(root,.08,.08,.84,w,0,.06,0);bx(root,.1,.12,.24,w,0,.07,-.34);bx(root,.03,.012,.6,vm('dark'),0,.106,.08);
  for(const[x,z]of[[0,.4],[.12,.39],[.22,.37],[.3,.34],[.36,.3]])for(const s of(x?[-1,1]:[1]))bx(root,.12,.05,.04,ir,s*x,.08,z);for(const s of[-1,1])bx(root,.01,.01,.36,st,s*.18,.09,.15,0,s*.97,0);
  bx(root,.12,.04,.04,ir,0,.06,.47);bx(root,.03,.04,.1,ir,0,.06,.44);bx(root,.03,.05,.03,ir,0,.03,-.06);bx(root,.025,.025,.42,wd(),0,.115,.14);bx(root,.04,.03,.06,ir,0,.115,.37);bx(root,.05,.02,.06,vm('woolWhite'),0,.12,-.04);return root;}
function iDummy(){const root=iRoot(1.2);const h=vm('hay'),rp=vm('rope');bx(root,.7,.08,.7,wdd(),0,.04,0);for(const s of[-1,1])bx(root,.08,.16,.08,wdd(),s*.12,.16,0);bx(root,.1,1.5,.1,wd(),0,.83,0);
  bx(root,.42,.6,.28,h,0,1.3,0);for(const y of[1.08,1.3,1.52])bx(root,.44,.04,.3,rp,0,y,0);bx(root,.12,.1,.12,vm('burlap'),0,1.65,0);bx(root,.28,.28,.26,vm('burlap'),0,1.84,0);for(const s of[-1,1])bx(root,.05,.03,.02,vm('dark'),s*.06,1.88,.135);bx(root,.1,.02,.02,vm('dark'),0,1.79,.135);
  for(const s of[-1,1]){const a=new THREE.Group();put(root,a,s*.22,1.52,0,0,0,s*.35);bx(a,.13,.5,.13,h,s*.0,-.25,0);bx(a,.15,.04,.15,rp,0,-.4,0);}return root;}
function iTarget(){const root=iRoot(1.4),t=new THREE.Group();put(root,t,0,0,0,-.15,0,0);const R=.55,c=.06;
  for(const s of[-1,1])bx(t,.07,1.5,.07,wd(),s*.42,.75,-.18);bx(t,1.0,.07,.12,wd(),0,.4,-.06);
  const disc=(r,z,dz,m)=>{for(let x=-r+c/2;x<r;x+=c){const hz=Math.round(Math.sqrt(Math.max(0,r*r-x*x))/c)*c;if(hz>0)bx(t,c,2*hz,dz,m,x,.44+R+0,z);}};
  disc(R,0,.26,vm('hay'));[[.48,'woolWhite'],[.38,'dark'],[.28,'woolBlue'],[.18,'woolRed'],[.08,'gold']].forEach(([r,m],i)=>disc(r,.131+i*.003,.006,vm(m)));
  for(const[x,y,a,b]of[[.06,1.04,.1,.2],[-.16,.9,-.2,.05],[.2,.82,.15,-.1]]){const g=new THREE.Group();put(t,g,x,y,.13,Math.PI/2+b,0,a);bx(g,.02,.4,.02,wd(),0,.2,0);bx(g,.05,.1,.01,vm('woolWhite'),0,.36,0);bx(g,.01,.1,.05,vm('woolWhite'),0,.36,0);}
  bx(root,.06,1.5,.06,wd(),0,.72,-.48,.4,0,0);return root;}
function iArmourSuit(o={}){const root=iRoot(1.4),im=iron(),gd=gold(),y0=.12;bx(root,.8,y0,.6,vm('stoneBrick'),0,y0/2,0);
  for(const s of[-1,1]){const x=s*.12;bx(root,.14,.08,.26,im,x,y0+.04,.04);bx(root,.13,.42,.14,im,x,y0+.29,0);bx(root,.15,.1,.17,im,x,y0+.52,.01);bx(root,.15,.36,.16,im,x,y0+.75,0);}
  bx(root,.42,.18,.26,im,0,y0+1.0,0);bx(root,.44,.03,.27,gd,0,y0+.92,0);for(const s of[-1,1])bx(root,.16,.16,.04,im,s*.12,y0+.86,.12);
  bx(root,.44,.44,.28,im,0,y0+1.31,0);bx(root,.04,.4,.02,im,0,y0+1.31,.15);bx(root,.46,.03,.29,gd,0,y0+1.52,0);bx(root,.24,.08,.22,im,0,y0+1.57,0);
  for(const s of[-1,1]){const x=s*.29;bx(root,.2,.16,.28,im,s*.28,y0+1.48,0);bx(root,.21,.03,.29,gd,s*.28,y0+1.42,0);bx(root,.11,.28,.12,im,x,y0+1.27,0);bx(root,.13,.1,.14,im,x,y0+1.1,.01);bx(root,.11,.26,.12,im,x,y0+.93,.01);bx(root,.12,.14,.12,im,x,y0+.73,.02);}
  const h=aHelmGreat();put(root,h,0,y0+1.61,0);if(o.weapon!=='none'){const hb=wHalberd();put(root,hb,.37,y0+.6,.03);}return root;}

/* ---------- stores and treasure ---------- */
function iCratePile(){const root=iRoot(1.8);vCrate(root,.7,-.36,0,0,0);vCrate(root,.7,.36,0,-.05,.06);vCrate(root,.62,0,.7,-.02,.25);vCrate(root,.5,.42,0,.7,-.4);
  const op=iCrate({contents:'cabbages'});op.position.set(-1.25,0,.3);op.rotation.y=.3;root.add(op);return root;}
function iWeaponCrate(){const root=iRoot(1.6),cm=vm('crate'),L=1.5,D=.55,H=.42;hollow(root,L,H,D,.05,cm);for(const s of[-1,1])bx(root,.06,H+.02,D+.02,wdd(),s*(L/2-.2),H/2,0);bx(root,L-.1,.04,D-.1,vm('hay'),0,.25,0);
  for(let i=0;i<3;i++){const s=wSword();const z=-.15+i*.15;iLay(root,s,(i%2?.38:-.38),.31,z,i%2?Math.PI/2:-Math.PI/2);}
  for(let i=0;i<8;i++)bx(root,.14,.05,.1,vm('hay'),-.6+i*.17,.29,((i*3)%5-2)*.08,0,i*.7,0);
  bx(root,L,.6,.04,cm,0,.275,D/2+.2,-.75,0,0);bx(root,.4,.6,.045,wdd(),-.5,.275,D/2+.2,-.75,0,0);bx(root,.4,.6,.045,wdd(),.5,.275,D/2+.2,-.75,0,0);return root;}
function iStrongbox(){const root=iRoot(1),w=wdd(),ir=iron(),W=.44,H=.26,D=.32;hollow(root,W,H,D,.04,w);for(const s of[-1,1]){bx(root,.05,H+.01,D+.01,ir,s*.13,H/2,0);bx(root,W+.01,.04,.04,ir,0,H-.02,s*(D/2-.01));}bx(root,.08,.08,.02,ir,0,H-.06,D/2+.005);
  bx(root,W-.08,.04,D-.08,gold(),0,.2,0);const gems=['#b15350','#4872a0','#469c59','#934daa'];for(let i=0;i<7;i++)bx(root,.05,.03,.05,i<4?plain(gems[i]):gold(),-.14+i*.045,.235,((i*5)%3-1)*.07,0,i,0);
  const lid=new THREE.Group();put(root,lid,0,H,-D/2,-1.95,0,0);bx(lid,W,.05,D,w,0,.025,D/2);for(const s of[-1,1])bx(lid,.05,.06,D+.01,ir,s*.13,.03,D/2);return root;}
function iGoblet(par,x,y,z,s=1){bx(par,.08*s,.015,.08*s,gold(),x,y+.008,z);bx(par,.02*s,.08*s,.02*s,gold(),x,y+.015+.04*s,z);hollow(par,.08*s,.07*s,.08*s,.01,gold(),x,y+.015+.08*s,z);bx(par,.03,.025,.03,plain('#b15350'),x,y+.05*s+.015,z+.04*s);}
function iTreasure(){const root=iRoot(1.6),g=gold();const L=[.9,.72,.54,.36,.2];L.forEach((r,i)=>vDisc(root,0,0,r,i*.1,.1,g,.1));
  iGoblet(root,.6,.2,.2);iGoblet(root,-.35,.3,-.25,1.2);
  const cr=new THREE.Group();put(root,cr,0,.5,0,0,.3,0);for(let i=0;i<12;i++){const a=i/12*Math.PI*2;bx(cr,.06,.08,.025,g,Math.cos(a)*.11,.04,Math.sin(a)*.11,0,-a+Math.PI/2,0);if(i%2===0)bx(cr,.03,.06,.025,g,Math.cos(a)*.11,.11,Math.sin(a)*.11,0,-a+Math.PI/2,0);}
  for(let i=0;i<4;i++){const a=i/4*Math.PI*2;bx(cr,.03,.03,.03,plain(['#b15350','#4872a0','#469c59','#b15350'][i]),Math.cos(a)*.122,.04,Math.sin(a)*.122);}
  const gems=['#b15350','#4872a0','#469c59','#934daa','#d3d3d9'],r=mulberry32(5);for(let i=0;i<14;i++){const k=Math.floor(r()*5),ring=Math.floor(r()*4),rr=(L[ring]+L[ring+1])/2,a=r()*6.28;bx(root,.05,.04,.05,plain(gems[k]),Math.cos(a)*rr,ring*.1+.1+.02,Math.sin(a)*rr,0,a,0);}
  for(let i=0;i<26;i++){const a=r()*6.28,rr=.95+r()*.35,n=1+Math.floor(r()*3);for(let k=0;k<n;k++)bx(root,.07,.015,.07,g,Math.cos(a)*rr,.008+k*.016,Math.sin(a)*rr,0,r()*1.5,0);}
  iLay(root,wSword(.8,.07,.18),-.1,.24,.62,1.2);return root;}
function iWineRack(){const root=iRoot(1.4),d=wdd(),n=4,cw=.28,W=n*cw+.06,H=n*cw+.06,D=.36;bx(root,W,H,.03,d,0,H/2,-D/2+.015);
  for(let i=0;i<=n;i++){bx(root,.04,H,D,d,-W/2+.03+i*cw,H/2,0);bx(root,W,.04,D,d,0,.02+i*cw,0);}const r=mulberry32(9);
  for(let i=0;i<n;i++)for(let j=0;j<n;j++){if(r()<.2)continue;const x=-W/2+.03+cw/2+i*cw,y=.04+j*cw;for(const ox of[-.055,.055]){if(r()<.15)continue;
    bx(root,.09,.09,.26,GLASSMAT,x+ox,y+.045,-.02);bx(root,.07,.07,.22,liquidMat(j%2?'#3f1c22':'#6f7736'),x+ox,y+.045,-.02);bx(root,.035,.035,.1,GLASSMAT,x+ox,y+.045,.16);bx(root,.03,.03,.03,vm('cattail'),x+ox,y+.045,.21);}}
  return root;}

/* ---------- furniture and curiosities ---------- */
function iTableTop(root,w,d,h=.8){bx(root,w,.08,d,wd(),0,h-.04,0);for(const[a,b]of[[1,1],[1,-1],[-1,1],[-1,-1]])bx(root,.08,h-.08,.08,wdd(),a*(w/2-.08),(h-.08)/2,b*(d/2-.08));for(const s of[-1,1])bx(root,w-.2,.06,.05,wdd(),0,.18,s*(d/2-.08));return h;}
function iCandleAt(root,x,y,z){bx(root,.12,.025,.12,vm('clayPot'),x,y+.0125,z);bx(root,.05,.14,.05,vm('woolWhite'),x,y+.095,z);vFlame(root,x,y+.165,z,.03,root.userData.lights,.4);}
function iMapTable(){const root=iRoot(1.6),h=iTableTop(root,1.6,1.0);
  artTex('map',32,20,({F,P,C,W,H,r})=>{F(0,0,W,H,'#d4c4a3');for(let i=0;i<60;i++)P(r()*W,r()*H,'#c4b193');for(let y=0;y<H;y++){const x=20+Math.round(Math.sin(y*.5)*2+Math.sin(y*.21)*2);F(x,y,W-x,1,'#819eaa');P(x,y,'#5d7a79');}
    F(0,0,W,1,'#846b4d');F(0,H-1,W,1,'#846b4d');F(0,0,1,H,'#846b4d');F(W-1,0,1,H,'#846b4d');for(const[x,y]of[[4,4],[7,3],[10,5],[5,7]]){P(x,y,'#675a4d');P(x-1,y+1,'#675a4d');P(x+1,y+1,'#675a4d');}
    for(let i=0;i<14;i++)P(4+r()*10,11+r()*6,'#577646');for(let y=2;y<17;y++)P(Math.round(9+Math.sin(y*.4)*3+y*.5),y,'#5879a1');for(const[x,y]of[[13,9],[6,14],[17,4]])F(x,y,2,2,'#8c403f');P(25,14,'#473a2f');P(26,14,'#473a2f');P(27,13,'#473a2f');});
  artPanel(root,1.12,.7,.01,'map',vm('paper'),0,h+.005,-.05,-Math.PI/2,0,.04);bx(root,.1,.06,.06,vm('paper'),-.6,h+.03,.3);bx(root,.1,.07,.07,vm('paper'),.62,h+.035,-.35);
  iCandleAt(root,.62,h,.32);put(root,TOOLS.Book.build('#3b4782'),-.6,h+.04,-.3,0,.4,Math.PI/2);bx(root,.06,.06,.06,plain('#1b191e'),.38,h+.03,.36);bx(root,.01,.2,.01,vm('woolWhite'),.39,h+.14,.37,0,0,-.25);
  for(const s of[-1,1])bx(root,.015,.005,.18,iron(),.1+s*.03,h+.012,.1,0,s*.18,0);bx(root,.05,.03,.05,plain('#4b494e'),-.2,h+.015,.2);return root;}
function iAlchemy(){const root=iRoot(1.6),h=iTableTop(root,1.4,.8);const G=GLASSMAT,gl=liquidMat('#55bb5f');
  bx(root,.22,.02,.22,iron(),-.35,h+.01,0);for(const[a,b]of[[1,1],[1,-1],[-1,1],[-1,-1]])bx(root,.02,.16,.02,iron(),-.35+a*.09,h+.1,b*.09);bx(root,.2,.02,.2,iron(),-.35,h+.19,0);vFlame(root,-.35,h+.02,0,.04,root.userData.lights,.5);
  const fl=new THREE.Mesh(new THREE.BoxGeometry(.18,.16,.18),G);fl.position.set(-.35,h+.28,0);root.add(fl);bx(root,.15,.09,.15,gl,-.35,h+.245,0);const nk=new THREE.Mesh(new THREE.BoxGeometry(.05,.14,.05),G);nk.position.set(-.35,h+.43,0);root.add(nk);
  const tb=new THREE.Mesh(new THREE.BoxGeometry(.035,.5,.035),G);tb.position.set(-.165,h+.31,0);tb.rotation.z=.81;root.add(tb);const rc=new THREE.Mesh(new THREE.BoxGeometry(.14,.12,.14),G);rc.position.set(.02,h+.06,0);root.add(rc);bx(root,.11,.04,.11,gl,.02,h+.025,0);
  bx(root,.16,.1,.16,vm('stone'),.32,h+.05,.18);bx(root,.1,.02,.1,vm('dark'),.32,h+.095,.18);bx(root,.035,.18,.035,vm('stone'),.34,h+.16,.18,0,0,-.4);
  [['#b15350',.38,-.2],['#46659b',.5,-.12],['#934daa',.48,.08]].forEach(([c,x,z])=>{const b=new THREE.Mesh(new THREE.BoxGeometry(.08,.16,.08),G);b.position.set(x,h+.08,z);root.add(b);bx(root,.065,.1,.065,liquidMat(c),x,h+.05,z);bx(root,.035,.03,.035,vm('cattail'),x,h+.175,z);});
  const sk=plain('#d9d3c1'),dk=plain('#191411');bx(root,.16,.14,.18,sk,.15,h+.07,-.25);bx(root,.12,.05,.06,sk,.15,h+.025,-.15);for(const s of[-1,1])bx(root,.04,.04,.01,dk,.15+s*.04,h+.09,-.155);bx(root,.03,.03,.01,dk,.15,h+.05,-.155);
  put(root,TOOLS.Book.build('#58345f'),.55,h+.04,.25,0,-.3,Math.PI/2);return root;}
function iLectern(){const root=iRoot(1),w=wdd();bx(root,.5,.06,.5,w,0,.03,0);bx(root,.12,1.0,.12,w,0,.55,0);const t=new THREE.Group();put(root,t,0,1.06,0,.45,0,0);bx(t,.6,.04,.44,wd(),0,0,0);bx(t,.6,.06,.04,w,0,.03,.22);
  const pg=plain('#d9d7d3'),cv=bm('#613432','leather');for(const s of[-1,1]){bx(t,.27,.02,.34,cv,s*.14,.03,0,0,0,s*.08);bx(t,.25,.02,.32,pg,s*.135,.05,0,0,0,s*.12);for(let i=0;i<5;i++)bx(t,.18,.003,.01,plain('#675a4d'),s*.14,.062+.0*i,-.1+i*.05,0,0,s*.12);}bx(t,.02,.03,.02,plain('#a54b4a'),0,.04,.16);bx(t,.01,.002,.2,plain('#a54b4a'),0,.062,.08);return root;}
function iNoticeBoard(){const root=iRoot(1.6),w=wdd();for(const s of[-1,1]){bx(root,.12,2.2,.12,w,s*.78,1.1,0);bx(root,.3,.08,.3,vm('cobble'),s*.78,.04,0);}bx(root,1.44,.9,.06,wd(),0,1.45,0);bx(root,1.56,.08,.1,w,0,1.94,0);bx(root,1.56,.08,.1,w,0,.96,0);
  for(const s of[-1,1])bx(root,.95,.05,.5,vm('tiles'),s*.42,2.28,0,0,0,-s*.55);bx(root,.1,.1,.52,w,0,2.5,0);
  artTex('wanted',12,16,({F,P,C})=>{F(0,0,12,16,'#d9d0bc');F(1,1,10,1,'#372b20');C(6,6,3,'#473a2f');F(3,9,6,3,'#473a2f');F(5,7,2,1,'#d9d0bc');for(const y of[13,14])F(2,y,8,1,'#877b67');});
  artPanel(root,.3,.4,.01,'wanted',vm('paper'),-.4,1.5,.035,0,0,.04);bx(root,.36,.26,.01,vm('paper'),.12,1.6,.035,0,0,-.05);bx(root,.26,.32,.01,vm('paper'),.45,1.3,.035,0,0,.08);bx(root,.3,.2,.01,vm('paper'),.05,1.22,.035,0,0,.03);
  for(const[x,y]of[[-.4,1.68],[.12,1.71],[.45,1.44],[.05,1.3]])bx(root,.025,.025,.02,iron(),x,y,.045);return root;}
function iChessTable(){const root=iRoot(1.2),h=iTableTop(root,.76,.76,.72);artTex('chess',16,16,({F})=>{for(let j=0;j<8;j++)for(let i=0;i<8;i++)F(i*2,j*2,2,2,(i+j)%2?'#36261d':'#d9caa8');});
  bx(root,.6,.03,.6,wdd(),0,h+.015,0);artPanel(root,.56,.56,.01,'chess',wdd(),0,h+.035,0,-Math.PI/2,0,0);const L=plain('#d9d3c5'),D=plain('#292521'),q=.07,y=h+.04;
  const pc=(i,j,m,t)=>{const x=(i-3.5)*q,z=(j-3.5)*q;bx(root,.045,.015,.045,m,x,y+.0075,z);const hh=t==='k'?.09:t==='r'?.05:t==='n'?.06:.04;bx(root,.03,hh,.03,m,x,y+.015+hh/2,z);
    if(t==='k'||t==='q')bx(root,.022,.022,.022,m,x,y+.015+hh+.011,z);if(t==='n')bx(root,.03,.025,.04,m,x,y+.015+hh-.0125,z+(m===L?-.012:.012));if(t==='r')bx(root,.04,.02,.04,m,x,y+.015+hh+.01,z);};
  const back=['r','n','b','q','k','b','n','r'];[[0,L,1],[7,D,6]].forEach(([row,m,pr])=>{back.forEach((t,i)=>{if((i===1&&m===L)||(i===5&&m===D))return;pc(i,row,m,t);});for(let i=0;i<8;i++)if(i!==4&&i!==3)pc(i,pr,m,'p');});
  pc(4,3,L,'p');pc(3,4,D,'p');pc(2,2,L,'n');pc(5,5,D,'n');return root;}
function iLute(){const root=iRoot(1),w=bm('#9d7048','leather'),dk=bm('#543c2a','leather'),st=plain('#d9d4c9');[[.2,.02,.08],[.24,.06,.08],[.25,.12,.06]].forEach(([r,y,hh])=>vDisc(root,0,0,r,y,hh,w,.04));bx(root,.04,.02,.04,dk,0,.01,0);
  vDisc(root,0,0,.25,.18,.012,plain('#d0b288'),.04);vDisc(root,0,.04,.05,.188,.006,vm('dark'),.02);
  bx(root,.08,.05,.5,dk,0,.17,.47);bx(root,.09,.04,.2,dk,0,.12,.78,.6,0,0);for(let i=0;i<4;i++)for(const s of[-1,1])bx(root,.04,.015,.015,plain('#d9d0bc'),s*.05,.13,.72+i*.04,.6,0,0);
  bx(root,.1,.03,.04,dk,0,.2,-.17);for(let i=0;i<4;i++)bx(root,.005,.004,.86,st,-.024+i*.016,.205,.27);return root;}
function iDrum(){const root=iRoot(1),r=.26;vDisc(root,0,0,r,0,.4,bm('#7c4539','cloth'),.04);vDisc(root,0,0,r+.02,0,.05,wdd(),.04);vDisc(root,0,0,r+.02,.36,.05,wdd(),.04);vDisc(root,0,0,r-.02,.41,.005,plain('#d9d0bc'),.04);
  for(let i=0;i<10;i++){const a=i/10*Math.PI*2,a2=(i+.5)/10*Math.PI*2;bx(root,.02,.34,.02,vm('rope'),Math.cos(a)*(r+.01),.2,Math.sin(a)*(r+.01),0,-a,(i%2?.32:-.32));}
  for(const s of[-1,1]){const g=new THREE.Group();put(root,g,s*.06,.43,s*.03,0,.35,0);bx(g,.025,.025,.42,wd(),0,0,0);bx(g,.04,.04,.04,plain('#d9d0bc'),0,0,.2);}return root;}
function iHourglass(){const root=iRoot(.8),w=wdd(),G=GLASSMAT,sd=plain('#d9c190');for(const y of[0,.36])bx(root,.2,.04,.2,w,0,y+.02,0);for(let i=0;i<3;i++){const a=i/3*Math.PI*2;bx(root,.025,.32,.025,w,Math.cos(a)*.075,.2,Math.sin(a)*.075);}
  for(const[y,s]of[[.08,.11],[.14,.07],[.18,.03],[.22,.07],[.28,.11]]){const m=new THREE.Mesh(new THREE.BoxGeometry(s,.06,s),G);m.position.y=y+.01;root.add(m);}bx(root,.09,.04,.09,sd,0,.07,0);bx(root,.05,.03,.05,sd,0,.105,0);bx(root,.07,.03,.07,sd,0,.27,0);bx(root,.008,.1,.008,sd,0,.17,0);return root;}
function iScrollRack(){const root=iRoot(1.4),d=wdd(),n=3,m=4,cw=.26,W=m*cw+.06,H=n*cw+.06,D=.4;bx(root,W,H,.03,d,0,H/2,-D/2+.015);for(let i=0;i<=m;i++)bx(root,.04,H,D,d,-W/2+.03+i*cw,H/2,0);for(let j=0;j<=n;j++)bx(root,W,.04,D,d,0,.02+j*cw,0);
  const r=mulberry32(3),pp=vm('paper'),rib=plain('#8c403f');for(let i=0;i<m;i++)for(let j=0;j<n;j++){const x=-W/2+.03+cw/2+i*cw,y=.04+j*cw,k=1+Math.floor(r()*3);for(let q=0;q<k;q++){const px=x-.07+q*.07,py=y+.03;bx(root,.06,.06,.34,pp,px,py,0);bx(root,.065,.065,.02,plain('#c4b193'),px,py,.16);if(r()<.4)bx(root,.07,.07,.02,rib,px,py,.02);}
    if(k<3&&r()<.6)bx(root,.06,.06,.3,pp,x+.06,y+.09,-.02);}return root;}
function iSpinningWheel(){const root=iRoot(1.2),w=wd(),d=wdd();const b=new THREE.Group();put(root,b,0,.35,0,0,0,.1);bx(b,1.0,.08,.22,d,0,0,0);
  for(const[x,z]of[[-.42,-.08],[-.42,.08],[.42,0]])bx(root,.05,.4,.05,d,x,x<0?.23:.2,z,0,0,x<0?.08:-.08);
  const cx=-.15,cy=.42+.36;for(const s of[-1,1])bx(b,.05,.5,.05,d,-.15,.27,s*.06);const wh=new THREE.Group();put(b,wh,cx,.38,0);for(let i=0;i<18;i++){const a=i/18*Math.PI*2;bx(wh,.045,.12,.03,w,Math.cos(a)*.3,Math.sin(a)*.3,0,0,0,a);}
  for(let i=0;i<3;i++){const a=i/3*Math.PI+Math.PI/6;bx(wh,.02,.58,.02,w,0,0,0,0,0,a);}bx(wh,.06,.06,.16,d,0,0,0);
  bx(b,.04,.3,.04,d,.35,.18,0);bx(b,.14,.06,.06,d,.35,.35,0);bx(b,.08,.08,.05,vm('woolWhite'),.35,.42,0);bx(b,.03,.4,.03,d,.42,.2,-.08,0,0,-.4);bx(b,.1,.16,.1,vm('woolFluff'),.5,.42,-.08);
  bx(root,.3,.03,.12,d,-.3,.04,.18,.15,0,0);bx(root,.02,.6,.02,d,-.22,.37,.07,0,0,.08);return root;}

/* ---------- provisions ---------- */
function iCheese(){const root=iRoot(1.2),rind=plain('#d6b360'),inn=plain('#d9c888'),wax=plain('#9a4f45');bx(root,1.0,.05,.6,wd(),0,.025,0);
  vDisc(root,-.2,0,.24,.05,.14,rind,.04);vDisc(root,-.2,0,.22,.19,.14,wax,.04);vDisc(root,-.2,0,.2,.33,.12,rind,.04);
  for(let i=0;i<5;i++)bx(root,.04,.14,.24-i*.045,inn,.2+i*.04,.12,.06-i*.02);bx(root,.2,.14,.02,rind,.28,.12,.18);bx(root,.03,.03,.03,plain('#c0a25a'),.24,.19,.05);
  bx(root,.02,.01,.16,iron(),.34,.055,-.18,0,.4,0);bx(root,.03,.02,.07,wdd(),.38,.06,-.27,0,.4,0);return root;}
function iMeatRack(){const root=iRoot(1.6),d=wdd(),rp=vm('rope');for(const s of[-1,1]){bx(root,.12,1.9,.12,d,s*.7,.95,0);bx(root,.4,.1,.12,d,s*.7,.05,0);bx(root,.04,.3,.04,d,s*.62,.2,0,0,0,s*.6);}bx(root,1.6,.12,.12,d,0,1.86,0);
  const ham=(x,l)=>{bx(root,.02,l,.02,rp,x,1.8-l/2,0);const y=1.8-l;bx(root,.04,.08,.04,plain('#d9d3c2'),x,y-.04,0);bx(root,.16,.18,.14,plain('#8b553e'),x,y-.17,0);bx(root,.2,.2,.18,plain('#7a4637'),x,y-.36,0);bx(root,.14,.08,.12,plain('#6b3f30'),x,y-.5,0);};
  ham(-.45,.1);ham(.5,.18);bx(root,.02,.06,.02,rp,0,1.77,0);for(let i=0;i<5;i++){const y=1.7-i*.12;bx(root,.07,.11,.07,plain('#5e342a'),Math.sin(i*1.3)*.04,y,0);}
  bx(root,.02,.08,.02,rp,-.2,1.76,0);for(let i=0;i<6;i++)bx(root,.07,.07,.07,plain('#d9d3c4'),-.2+(i%2-.5)*.06,1.68-i*.07,.0);bx(root,.02,.08,.02,rp,.22,1.76,0);for(let i=0;i<4;i++)bx(root,.06,.12,.06,plain('#846c3c'),.22,1.66-i*.13,0);return root;}
function iBreadBoard(){const root=iRoot(.9),c=plain('#bc8f58'),cd=plain('#9a7045');bx(root,.6,.04,.4,wd(),0,.02,0);vDisc(root,-.12,0,.12,.04,.08,c,.04);vDisc(root,-.12,0,.09,.12,.03,cd,.03);
  bx(root,.08,.07,.34,c,.12,.075,0,0,.3,0);for(let i=0;i<4;i++)bx(root,.07,.01,.02,cd,.12,.115,-.12+i*.08,0,.3,0);for(let i=0;i<3;i++)bx(root,.04,.08,.12-i*.03,plain('#d9c27e'),.22+i*.03,.08,.12,0,0,0);
  bx(root,.012,.008,.14,iron(),-.02,.045,-.14,0,1.3,0);bx(root,.02,.02,.08,wdd(),.07,.05,-.11,0,1.3,0);bx(root,.07,.07,.07,plain('#a54b4a'),.24,.075,-.12);bx(root,.01,.03,.01,plain('#453226'),.24,.125,-.12);return root;}
function iSpitRoast(){const root=iRoot(1.8),L=root.userData.lights,d=wdd();vFirePit(root,0,0,L);for(const s of[-1,1]){const x=s*.85;bx(root,.1,.85,.1,d,x,.425,0);for(const q of[-1,1])bx(root,.05,.22,.05,d,x,.92,q*.05,q*.35,0,0);}
  bx(root,1.9,.03,.03,iron(),0,.92,0);bx(root,.03,.2,.03,iron(),1.0,.83,0);bx(root,.03,.03,.12,iron(),1.0,.74,.06);
  const p=plain('#916141'),pd=plain('#6d4731');bx(root,.7,.3,.32,p,0,.92,0);bx(root,.6,.04,.26,pd,0,1.08,0);bx(root,.22,.22,.22,p,.44,.92,0);bx(root,.12,.12,.14,p,.6,.9,0);bx(root,.07,.07,.07,plain('#a54b4a'),.69,.88,0);
  for(const s of[-1,1]){bx(root,.07,.08,.04,pd,.44,1.06,s*.08,0,0,-.3);bx(root,.22,.07,.07,p,.38,.82,s*.11,0,0,.3);bx(root,.22,.07,.07,p,-.38,.82,s*.11,0,0,-.3);}bx(root,.1,.04,.04,pd,-.4,.98,0,0,0,.5);
  bx(root,.03,.03,.03,plain('#14100d'),.5,.98,.111);bx(root,.03,.03,.03,plain('#14100d'),.5,.98,-.111);return root;}

/* ---------- registry ---------- */
FOLDERS['items'].children.push('items/decor','items/provisions');
Object.assign(FOLDERS,{'items/decor':{name:'Decoration',blurb:'Tapestries, paintings, hunting trophies, rugs, instruments and curiosities',children:[]},'items/provisions':{name:'Provisions',blurb:'Cheese, hams, bread and roasts',children:[]}});
const WALLO={key:'wall',label:'Wall',choices:WALLC,def:'stone'};
IT('d-tapestry','decor','Tapestry',(s,o)=>iTapestry(o),'Woven wall hanging on a wooden rod with gilt knobs, iron brackets and a gold fringe.',[{key:'design',label:'Design',choices:TAPC,def:'diamonds'},WALLO]);
IT('d-painting','decor','Painting',(s,o)=>iPaintingWall(o),'Oil painting in a gilt frame, hung on a wall.',[{key:'subject',label:'Subject',choices:PAINTC,def:'landscape'},WALLO]);
IT('d-easel','decor','Easel',(s,o)=>iEasel(o),'Painter\'s easel with three legs and a framed painting resting on the ledge.',[{key:'subject',label:'Subject',choices:PAINTC,def:'portrait'}]);
IT('d-trophy','decor','Hunting trophy',(s,o)=>iTrophy(o),'Mounted head on a carved wooden plaque. Ears, antlers and horns point outward.',[{key:'animal',label:'Animal',choices:TROPHY,def:'deer'},WALLO]);
IT('d-fish','decor','Mounted pike',(s,o)=>iFishMount(o),'Stuffed pike on an oval plaque with a brass plate.',[WALLO]);
IT('d-owl','decor','Stuffed owl',(s,o)=>iOwl(o),'Stuffed owl on a branch perch on a wooden stand, optionally under a glass dome.',[{key:'dome',label:'Glass dome',choices:[[1,'Yes'],[0,'No']],def:1}]);
IT('d-bearrug','decor','Bear-skin rug',iBearRug,'Bear pelt on a red felt lining, legs spread, head with open jaws.');
IT('d-rug','decor','Rug',(s,o)=>iRug(o),'Woven rug with a border, a central diamond medallion and fringes.',[{key:'colour',label:'Colour',choices:RUGC,def:'red'}]);
IT('d-lute','decor','Lute',iLute,'Lute lying face up: rounded back, rose, strings and a bent-back pegbox.');
IT('d-drum','decor','Drum',iDrum,'Rope-tensioned drum with a hide head and two sticks.');
IT('d-hourglass','decor','Hourglass',iHourglass,'Hourglass with wooden ends and three posts; sand running down.');
IT('d-chess','decor','Chess table',iChessTable,'Small table with a chessboard and a game in progress.');
IT('u-maptable','furniture','Map table',iMapTable,'Table with a map, scrolls, a book, an ink pot with a quill, dividers and a candle.');
IT('u-alchemy','furniture','Alchemist\'s table',iAlchemy,'Table with a flask boiling over a burner, a glass tube, mortar and pestle, potions, a skull and a book.');
IT('u-lectern','furniture','Lectern',iLectern,'Wooden lectern with a large open book and a red ribbon.');
IT('u-noticeboard','furniture','Notice board',iNoticeBoard,'Roofed notice board on two posts with pinned notices and a wanted poster.');
IT('u-scrollrack','furniture','Scroll rack',iScrollRack,'Shelf of pigeonholes filled with rolled scrolls.');
IT('u-spinning','furniture','Spinning wheel',iSpinningWheel,'Spinning wheel with a treadle and a distaff of wool.');
IT('w-barrel','weapons','Weapon barrel',(s,o)=>iWeaponBarrel(o),'Iron-hooped barrel of weapons standing in it.',[{key:'contents',label:'Contents',choices:[['mixed','Mixed'],['swords','Swords'],['spears','Spears']],def:'mixed'}]);
IT('w-rack','weapons','Weapon rack',(s,o)=>iWeaponRack(o),'Armoury rack: polearms standing in slots, or swords leaning on a rail.',[{key:'kind',label:'Holds',choices:[['polearms','Polearms'],['swords','Swords']],def:'polearms'}]);
IT('w-crossbow','weapons','Crossbow',iCrossbow,'Crossbow lying on the ground with a bolt loaded.');
IT('w-dummy','weapons','Training dummy',iDummy,'Straw dummy on a post with a sack head and arms.');
IT('w-target','weapons','Archery target',iTarget,'Straw target with painted rings on a leaning stand, three arrows in it.');
IT('a-plate','armor','Suit of armour',(s,o)=>iArmourSuit(o),'Full plate armour with a great helm on a stone plinth.',[{key:'weapon',label:'Halberd',choices:[['halberd','Yes'],['none','No']],def:'halberd'}]);
IT('c-cratepile','containers','Crate pile',iCratePile,'Stacked crates with an open crate of cabbages beside them.');
IT('c-weaponcrate','containers','Weapon crate',iWeaponCrate,'Long open crate of swords packed in straw, its lid leaning against the front.');
IT('c-strongbox','containers','Strongbox',iStrongbox,'Small iron-bound box, lid open, with gold and gems.');
IT('c-treasure','containers','Treasure hoard',iTreasure,'Heap of gold with goblets, a crown, gems, a sword and coins spilled around it.');
IT('c-winerack','containers','Wine rack',iWineRack,'Rack of pigeonholes holding wine bottles on their sides.');
IT('v-cheese','provisions','Cheese board',iCheese,'Three cheese wheels stacked on a board, a cut wedge and a knife.');
IT('v-meatrack','provisions','Hanging meats',iMeatRack,'Wooden frame with hanging hams, a string of sausages, garlic and onions.');
IT('v-bread','provisions','Bread board',iBreadBoard,'Board with a round loaf, a long loaf, cheese, a knife and an apple.');
IT('v-spit','provisions','Spit roast',iSpitRoast,'Pig roasting on an iron spit over a stone-ringed fire, with a crank. Flames flicker at dusk and night.');
