/* ======================= UNDEAD KIT: the necromancer's castle (ud-castle-) =======================
   Gothic walls 4 m long, 1.6 m thick, centred on the grid line, outside towards +z; wall walk at 7.2 m behind a parapet with pointed merlons
   (0.8 m merlon, 1.2 m gap, period 2 m). Towers sit on the grid vertices; the keep covers 2 × 2 cells centred on a vertex. */
VXD.gothStone=(P,r)=>{const tone=[];for(let i=0;i<8;i++)tone.push(['#4c4b55','#55535e','#46454e','#5a5764','#4a4752'][Math.floor(r()*5)]);
  for(let y=0;y<16;y++){const row=y>>3,off=(row%2)*4;for(let x=0;x<16;x++){const id=row*2+(((x+off)>>3)&1),m=y%8===7||(x+off)%8===7;P(x,y,m?'#26252c':tone[id],m?nz(r,.9,1.05):nz(r,.88,1.06)*(r()<.05?.82:1));}}};
VXD.gothDark=(P,r)=>{for(let y=0;y<16;y++){const row=y>>3,off=(row%2)*4;for(let x=0;x<16;x++){const m=y%8===7||(x+off)%8===7;P(x,y,m?'#1a1a20':'#34333b',nz(r,.88,1.06));}}};
VXD.slateN=rows('#33343e',4,5,.62,.72,2);
VXD.necroGlass=(P,r)=>{const S=[];const m=mulberry32(5150);for(let i=0;i<9;i++)S.push([m()*16,m()*16,['#5a2a7a','#2a7a4a','#3a1a5a','#6a3a8a','#1a5a3a','#7a2a3a'][Math.floor(m()*6)]]);
  for(let y=0;y<16;y++)for(let x=0;x<16;x++){const ds=S.map(s=>{const dx=Math.min(Math.abs(x+.5-s[0]),16-Math.abs(x+.5-s[0])),dy=Math.min(Math.abs(y+.5-s[1]),16-Math.abs(y+.5-s[1]));return[Math.hypot(dx,dy),s[2]];}).sort((a,b)=>a[0]-b[0]);
    P(x,y,ds[1][0]-ds[0][0]<1?'#141218':ds[0][1],nz(r,.9,1.08));}};
const NGLASS=new THREE.MeshStandardMaterial({map:vxTex('necroGlass'),emissiveMap:vxTex('necroGlass'),emissive:new THREE.Color(0xffffff),emissiveIntensity:.5,roughness:.3,metalness:.1});NGLASS.userData={glowScale:2.2,base:.5};GLOW.push(NGLASS);
FOLDERS['undead/castle']={name:'Necromancer\'s castle',blurb:'Gothic walls, stained-glass windows, gatehouse with portcullis, spired towers, the keep, obelisk, gargoyle, banner, throne',children:[]};
const NC_T=1.6,NC_ROWS=18;
function ncGargoyle(par,x,y,z,ry=0,s=1){const g=new THREE.Group();put(par,g,x,y,z,0,ry,0);g.scale.setScalar(s);const m=vm('gothDark');
  for(const sd of[-1,1]){bx(g,.16,.3,.34,m,sd*.16,.15,-.02);bx(g,.12,.1,.2,m,sd*.16,.05,.18);}bx(g,.44,.44,.36,m,0,.46,-.04);bx(g,.36,.3,.3,m,0,.72,.08,-.4,0,0);
  const h=new THREE.Group();put(g,h,0,.82,.24);bx(h,.3,.26,.3,m,0,.06,0);bx(h,.22,.08,.16,m,0,-.04,.18);bx(h,.22,.06,.12,m,0,.1,.2);for(const sd of[-1,1]){bx(h,.06,.05,.02,RUNEMAT,sd*.07,.08,.155);const hn=new THREE.Group();put(h,hn,sd*.12,.18,-.04,0,0,-sd*.5);bx(hn,.06,.22,.06,m,0,.1,0);}
  for(const sd of[-1,1]){bx(g,.1,.32,.1,m,sd*.2,.42,.16);bx(g,.12,.06,.14,m,sd*.2,.27,.2);const w=new THREE.Group();put(g,w,sd*.2,.6,-.18,0,sd*.3,0);for(let i=0;i<4;i++)bx(w,.06,.4+i*.12,.26,m,sd*(.05+i*.06),.22+i*.08,-.06);}
  bx(g,.12,.12,.4,m,0,.18,-.36);return g;}
/* the wall builder: o.hole(i,row), o.rows, o.glass, o.buttress, o.skulls */
function ncWall(o){return(s,op)=>{const wear=(op&&op.wear)||'clean',root=udRoot(5),L=root.userData.lights,r=mulberry32(hashStr(o.key)+(s||1)*131),nc=10,rows=o.rows||NC_ROWS,t=NC_T,Hh=rows*.4,mat=vm('gothStone'),dk=vm('gothDark');
  const hole=o.hole||(()=>false),G=(i,row)=>row<rows&&!hole(i,row);ruGrid(root,nc,rows+1,G,{t,mat,pmat:dk});
  bx(root,4,.4,.4,mat,0,Hh+.2,t/2-.2);const caps=[];for(let k=0;k<nc;k++){const x=-1.8+k*.4;if(k%5<2){if(k%5===0){bx(root,.8,.8,.4,mat,x+.2,Hh+.8,t/2-.2);bx(root,.4,.3,.4,mat,x+.2,Hh+1.35,t/2-.2);bx(root,.2,.2,.2,mat,x+.2,Hh+1.6,t/2-.2);}}else caps.push([x,Hh+.4,.4,.4,t/2-.2]);caps.push([x,Hh,.4,t-.4,-.2]);}
  if(o.course!==false)for(const y of[3.2])for(let k=0;k<nc;k++)if(!hole(k,8)&&!hole(k,7))bx(root,.4,.2,.16,dk,-1.8+k*.4,y,t/2+.08);
  if(o.buttress&&(op?op.buttress!=='no':true)){bx(root,.8,4,.6,dk,0,2,t/2+.3);bx(root,.8,2,.36,dk,0,5,t/2+.18);bx(root,.8,.3,.6,dk,0,4.15,t/2+.3);}
  if(o.skulls!==false)for(const x of[-1,1])if(!hole(Math.floor((x+2)/.4),15))wlSkull(root,x,6,t/2+.12,1.1,0);
  if(o.glass)o.glass(root,r,t);if(o.extra)o.extra(root,r,t,L);
  if(wear!=='clean')ruApplyWear(root,wear,nc,G,()=>rows,caps,r,t,true);else ruTufts(root,4,t/2,r,2);return root;}}
const NC_WEAR={key:'wear',label:'Condition',choices:[['clean','Weathered'],['cracked','Cracked'],['mossy','Mossy'],['both','Cracked and mossy']],def:'clean'};
/* glass panes filling a hole mask at the middle of the wall, with a vertical mullion */
function ncGlass(root,cols,r0,r1,tip){const g=new THREE.Group();root.add(g);const w=(cols[1]-cols[0]+1)*.4,cx=-2+(cols[0]+cols[1]+1)/2*.4;const p=bx(g,w,(r1-r0+1)*.4,.06,NGLASS,cx,(r0+r1+1)/2*.4,0);p.castShadow=false;
  if(tip)for(const[a,b,row]of tip){const q=bx(g,(b-a+1)*.4,.4,.06,NGLASS,-2+(a+b+1)/2*.4,row*.4+.2,0);q.castShadow=false;}bx(g,.08,(r1-r0+1)*.4,.1,vm('gothDark'),cx,(r0+r1+1)/2*.4,0);bx(g,w+.2,.1,.3,vm('gothDark'),cx,r0*.4-.05,NC_T/2+.1);}
const ncW=(id,name,o,desc,extra=[])=>UD('castle-'+id,'castle',name,ncWall(Object.assign({key:id},o)),desc+' 4 m long, 1.6 m thick, centred on the grid line, outside towards +z.',{opts:[NC_WEAR,...extra],variants:true,defaultSeed:1});
ncW('wall','Castle wall',{buttress:true},'Dark gothic curtain wall 7.2 m to the wall walk: plinth course, string course, a stepped buttress in the middle, two skulls set in the stone, parapet with pointed merlons.',[{key:'buttress',label:'Buttress',choices:[['yes','Yes'],['no','No']],def:'yes'}]);
ncW('wall-window','Castle wall with window',{hole:(i,row)=>(i>=3&&i<=6&&row>=7&&row<=13)||((i===4||i===5)&&row===14),glass:(root)=>ncGlass(root,[3,6],7,13,[[4,5,14]])},'Castle wall with a tall stepped-arch window of dark purple and green stained glass that glows at night, a single mullion and a sill.');
ncW('gate','Gatehouse',{rows:22,course:false,skulls:false,hole:(i,row)=>(i>=2&&i<=7&&row<=9)||(i>=3&&i<=6&&row===10)||((i===4||i===5)&&row===11),
  extra:(root,r,t,L)=>{const dk=vm('gothDark');bx(root,.8,.5,.3,dk,0,5.05,t/2+.15);wlHornSkull(root,0,5.3,t/2+.05,1.4,0);for(const sd of[-1,1]){bx(root,.6,.3,.6,dk,sd*1.6,7.45,t/2+.3);ncGargoyle(root,sd*1.6,7.6,t/2+.32,0,1.1);const w=bx(root,.3,1.2,.06,NGLASS,sd*.9,6.6,t/2+.01);w.castShadow=false;}
    const g=new THREE.Group();root.add(g);const ib=vm('ironB');for(let i=0;i<8;i++){const x=-1.05+i*.3;bx(g,.08,4.2,.08,ib,x,2.25,0);bx(g,.05,.16,.05,ib,x,.08,0);}bx(g,2.4,.14,.14,ib,0,4.2,0);
    root.userData.portcullis=g;}},'Gatehouse 8.8 m high with a 2.4 m wide, 4.8 m high pointed arch, an iron portcullis of bars that slides up into the wall, a horned skull keystone, two glowing windows and two gargoyles on corbels.',[{key:'state',label:'Portcullis',choices:[['closed','Closed'],['open','Open']],def:'closed',live:true}]);
{const a=ASSETS.find(x=>x.id==='ud-castle-gate'),b0=a.build;a.build=(s,op)=>{const root=b0(s,op),g=root.userData.portcullis;vGateAnim(root,(op&&op.state)==='open'?1:0,e=>{g.position.y=e*3.9;});return root;};}
function ncTower(s,op){const root=udRoot(4.4),r=mulberry32((s||1)*1093),c=.4,R=2.8,N=Math.ceil(R/c),H=13.2,cells=[],plinth=[],ring=[],mer=[];
  for(let i=-N-1;i<=N;i++)for(let k=-N-1;k<=N;k++){const x=(i+.5)*c,z=(k+.5)*c,d=Math.hypot(x,z);if(d<R+.2)plinth.push({x,z,y0:0,h:.4,mat:vm('gothDark')});if(d<R)cells.push({x,z,y0:.4,h:H-.4});
    if(d<R+.3&&d>=R-.4){ring.push({x,z,y0:H,h:.4,mat:vm('gothDark')});const a=Math.round(Math.atan2(z,x)/(Math.PI/8));if(d>=R-.1&&((a%2)+2)%2===0)mer.push({x,z,y0:H+.4,h:.8});}}
  ruCols(root,plinth,c,vm('gothDark'));ruCols(root,cells,c,vm('gothStone'));ruCols(root,ring,c,vm('gothDark'));ruCols(root,mer,c,vm('gothStone'));
  for(let i=0;i<9;i++){const rr=R-.2-i*.32;if(rr<.3)break;vDisc(root,0,0,rr,H+.4+i*.7,.7,vm('slateN'),.4);}bx(root,.16,1,.16,vm('ironB'),0,H+.4+6.3+.5,0);bx(root,.3,.3,.3,vm('gold'),0,H+.4+7.4,0);
  for(let k=0;k<4;k++){const a=k*Math.PI/2,ca=Math.round(Math.cos(a)),sa=Math.round(Math.sin(a));for(const y of[3.6,7.2,10.4]){if((k+Math.round(y))%2)continue;const w=bx(root,sa?.24:.04,1.2,sa?.04:.24,NGLASS,ca*2.82,y,sa*2.82);w.castShadow=false;w.scale.set(sa?1:1,1,1);}}
  for(let k=0;k<6;k++){const a=k/6*Math.PI*2;bx(root,.3,.3,.3,vm('gothDark'),Math.cos(a)*(R+.15),H-.15,Math.sin(a)*(R+.15));}
  ruTufts(root,5,R,r,4);return root;}
function ncKeep(s,op){const root=udRoot(7),L=root.userData.lights,r=mulberry32((s||1)*1097),st=vm('gothStone'),dk=vm('gothDark'),W=7.2,H=18;
  ruBox(root,8,.6,8,dk,0,.3,0,-4,0);ruBox(root,W,H,W,st,0,.6+H/2,0,-W/2,.6);ruBox(root,W+.4,.4,W+.4,dk,0,H+.8,0,-W/2-.2,H+.6);
  for(const[a,b]of[[1,1],[1,-1],[-1,1],[-1,-1]]){const g=new THREE.Group();put(root,g,a*(W/2),0,b*(W/2));bx(g,1.2,10,1.2,dk,0,5.6,0);bx(g,1,4,1,dk,0,12.6,0);bx(g,.8,2,.8,st,0,15.6,0);bx(g,.5,1.2,.5,st,0,17.2,0);bx(g,.3,.6,.3,st,0,18.1,0);}
  for(let f=0;f<4;f++){const g=new THREE.Group();put(root,g,0,0,0,0,f*Math.PI/2,0);const z=W/2;for(const[y,h]of[[5,3.2],[11,3.6]])for(const x of f===0&&y<8?[-2]:[-1.6,1.6]){if(f===0&&y<8)continue;bx(g,1.1,h+.3,.1,dk,x,y+h/2,z+.05);const w=bx(g,.8,h,.1,NGLASS,x,y+h/2,z+.07);w.castShadow=false;bx(g,.6,.3,.1,dk,x,y+h+.3,z+.06);bx(g,.3,.2,.1,dk,x,y+h+.55,z+.06);}
    for(let k=0;k<18;k++){const x=-W/2-.2+.2+k*.42;if(k%3===0){bx(g,.42,.8,.4,st,x+.2,H+1.4,z);bx(g,.2,.3,.3,st,x+.2,H+1.95,z);}}}
  bx(root,2.2,3.6,.1,dk,0,2.4,W/2+.05);bx(root,1.8,3.2,.06,vm('dark'),0,2.2,W/2+.1);for(const sd of[-1,1]){const lf=new THREE.Group();put(root,lf,sd*.9,.6,W/2+.1,0,sd*1.1,0);bx(lf,.9,3,.06,vm('ironB'),-sd*.45,1.5,0);}
  bx(root,1,.5,.1,dk,0,4.25,W/2+.1);bx(root,.6,.3,.1,dk,0,4.6,W/2+.1);for(let i=0;i<3;i++)ruBox(root,3,.2*(i+1),.5,dk,0,.1*(i+1),W/2+1.15-i*.5+.0,-1.5,0);
  for(const sd of[-1,1])udFlame(root,L,sd*1.5,.6,W/2+.5,.2,1);for(const sd of[-1,1])bx(root,.3,.2,.3,vm('ironB'),sd*1.5,.6,W/2+.5);
  const by=10.2;bx(root,3.2,.3,1.4,dk,0,by,W/2+.7);for(const sd of[-1,0,1])bx(root,.3,.5,1.2,dk,sd*1.2,by-.4,W/2+.6);for(let i=0;i<11;i++){const x=-1.5+i*.3;bx(root,.05,.9,.05,vm('ironB'),x,by+.6,W/2+1.35);}
  for(const sd of[-1,1])for(let i=0;i<4;i++)bx(root,.05,.9,.05,vm('ironB'),sd*1.55,by+.6,W/2+.2+i*.3);bx(root,3.2,.06,.06,vm('ironB'),0,by+1.05,W/2+1.35);for(const sd of[-1,1])bx(root,.06,.06,1.3,vm('ironB'),sd*1.58,by+1.05,W/2+.7);
  bx(root,1.2,2.6,.06,vm('dark'),0,by+1.45,W/2+.03);
  let y=H+1;for(let i=0;i<8;i++){const w=5.6-i*.68;ruBox(root,w,1,w,vm('slateN'),0,y+.5,0,-w/2,y);y+=1;}bx(root,.3,1.2,.3,vm('ironB'),0,y+.6,0);
  const oy=y+1.6;for(let k=0;k<4;k++){const a=k*Math.PI/2+Math.PI/4;wlBeam(root,[Math.cos(a)*.1,y+1.1,Math.sin(a)*.1],[Math.cos(a)*.42,oy,Math.sin(a)*.42],.08,vm('ironB'));wlBeam(root,[Math.cos(a)*.42,oy,Math.sin(a)*.42],[Math.cos(a)*.2,oy+.6,Math.sin(a)*.2],.07,vm('ironB'));}
  bx(root,.56,.56,.56,RUNEMAT,0,oy+.25,0);bx(root,.36,.76,.36,RUNEMAT,0,oy+.25,0);const pl=new THREE.PointLight(0x60ff90,0,14,2);pl.position.set(0,oy+.3,0);pl.userData.lamp=true;pl.userData.min=1;root.add(pl);L.push(pl);
  for(let i=0;i<6;i++)wlTuft(root,(r()-.5)*8,0,4.4+r()*.4,r,false);return root;}
function ncObelisk(s){const root=udRoot(2),dk=vm('gothDark');bx(root,1.6,.3,1.6,dk,0,.15,0);bx(root,1.2,.4,1.2,vm('gothStone'),0,.5,0);let y=.7;for(let i=0;i<6;i++){const w=.8-i*.07;bx(root,w,.8,w,dk,0,y+.4,0);
  for(let f=0;f<4;f++){if((i+f)%2)continue;const a=f*Math.PI/2;const q=bx(root,.12,.36,.03,RUNEMAT,Math.sin(a)*(w/2+.005),y+.4,Math.cos(a)*(w/2+.005),0,a,0);q.castShadow=false;}y+=.8;}
  bx(root,.36,.3,.36,dk,0,y+.15,0);bx(root,.2,.25,.2,RUNEMAT,0,y+.42,0);return root;}
function ncGargoyleAsset(s){const root=udRoot(1.4);bx(root,.9,.9,.9,vm('gothStone'),0,.45,0);bx(root,1,.1,1,vm('gothDark'),0,.95,0);ncGargoyle(root,0,1,0,0,1.2);return root;}
function ncBanner(s){const root=udRoot(1.6),ib=vm('ironB');bx(root,.6,.3,.6,vm('gothDark'),0,.15,0);bx(root,.1,4.4,.1,ib,0,2.5,0);bx(root,1.2,.08,.08,ib,.55,4.6,0);bx(root,.16,.16,.16,vm('gold'),0,4.78,0);bx(root,.12,.12,.12,vm('gold'),1.17,4.6,0);
  const b=new THREE.Group();put(root,b,.6,4.56,0);for(const x of[-.4,.4])bx(b,.04,.1,.04,vm('rope'),x,-.05,0);bx(b,1,1.9,.04,vm('woolPurple'),0,-1.05,0);bx(b,1,.12,.05,vm('dark'),0,-.3,0);bx(b,1,.12,.05,vm('dark'),0,-1.7,0);
  for(const[x,h]of[[-.37,.35],[0,.55],[.37,.3]])bx(b,.26,h,.04,vm('woolPurple'),x,-2-h/2+.02,0);return root;}
function ncThrone(s){const root=udRoot(2),dk=vm('gothDark'),st=vm('gothStone');ruBox(root,2.4,.3,2,dk,0,.15,0,-1.2,0);ruBox(root,1.8,.3,1.5,st,0,.45,0,-.9,.3);bx(root,1.2,.4,1,st,0,.8,.1);bx(root,1.1,.12,.9,vm('woolPurple'),0,1.06,.12);
  bx(root,1.3,3,.3,st,0,2.1,-.45);for(let i=0;i<4;i++)bx(root,1.1-i*.26,.3,.3,st,0,3.75+i*.3,-.45);bx(root,.16,.4,.16,st,0,5.05,-.45);wlSkull(root,0,3.1,-.3,1.3,0);bx(root,.9,1.6,.04,vm('woolPurple'),0,1.9,-.28);
  for(const sd of[-1,1]){bx(root,.24,.8,1,st,sd*.66,1.2,.1);wlSkull(root,sd*.66,1.6,.4,.8,0);bx(root,.3,2.6,.3,dk,sd*.8,1.9,-.45);bx(root,.18,.5,.18,dk,sd*.8,3.45,-.45);bx(root,.08,.3,.08,dk,sd*.8,3.85,-.45);}return root;}
function ncPikes(s){const root=udRoot(2),r=mulberry32((s||1)*1103);bx(root,3,.3,.6,vm('gothDark'),0,.15,0);for(let i=0;i<3;i++){const x=-1+i,h=2+r()*.5;bx(root,.06,h,.06,vm('ironB'),x,.3+h/2,0);bx(root,.12,.12,.04,vm('ironB'),x,.3+h+.04,0,0,0,Math.PI/4);wlSkull(root,x,.3+h-.3,0,1,(r()-.5)*.5);}return root;}
UD('castle-tower','castle','Castle tower',ncTower,'Round tower for a grid vertex, 5.6 m across: 13 m of dark stone with glowing slit windows, corbels, a crenellated rim and a tall stepped slate spire with an iron finial and a gold ball (about 22 m in all).',{});
UD('castle-keep','castle','Necromancer\'s keep',ncKeep,'The necromancer\'s tower, 8 × 8 m (two cells by two, centred on a vertex), 19 m of dark stone with stepped corner buttresses and pinnacles, tall glowing stained-glass windows, a balcony with an iron railing at 10 m, a great iron door with green flames, a stepped slate spire and four iron claws holding a glowing green orb at 28 m.',{});
UD('obelisk','castle','Rune obelisk',ncObelisk,'Dark stone obelisk on a stepped plinth, glowing green runes on its faces and a glowing tip.',{});
UD('gargoyle','castle','Gargoyle',ncGargoyleAsset,'Crouching horned gargoyle with folded wings and glowing eyes on a stone block. The figure (ncGargoyle) also sits on the gatehouse corbels.',{});
UD('banner','castle','Necromancer\'s banner',ncBanner,'Iron pole with gold balls and a bent arm holding a long, tattered, blank purple banner with two black bands.',{});
UD('throne','castle','Necromancer\'s throne',ncThrone,'Dark stone throne on a dais: purple cushion and hanging, a tall stepped back with a skull, skulls on the armrests, spiked posts either side.',{});
UD('pikes','castle','Iron skull pikes',ncPikes,'Three iron spikes on a stone kerb with skulls stuck on them.',{variants:true,defaultSeed:1});
