/* ======================= CHARACTERS: low-poly villagers ======================= */
const VB={
  male:  {thigh:.43,shin:.41,ankle:.06,hipOff:.05,spine:.1,chest:.2,neck:.22,headY:.07,shW:.21,ua:.285,fa:.255,g:1,hipW:.068,head:1,chestSx:1.14,hipsR:1,waist:1,hand:1},
  female:{thigh:.41,shin:.39,ankle:.056,hipOff:.045,spine:.095,chest:.19,neck:.205,headY:.065,shW:.18,ua:.27,fa:.24,g:.9,hipW:.064,head:.97,chestSx:1.04,hipsR:1.16,waist:.88,hand:.9},
  child: {thigh:.26,shin:.245,ankle:.045,hipOff:.035,spine:.075,chest:.13,neck:.14,headY:.045,shW:.135,ua:.18,fa:.155,g:.66,hipW:.045,head:1.06,chestSx:.98,hipsR:1,waist:1.04,hand:.72},
};
for(const k in VB){const b=VB[k];b.key=k;b.hipH=b.thigh+b.shin+b.ankle+b.hipOff;b.legS=(b.thigh+b.shin)/.84;b.tS=(b.spine+b.chest)/.3;b.cS=b.neck/.22;}

const SKINS=[['#f3d2bc','fair'],['#e8b896','light'],['#d9a27c','medium'],['#c08860','olive'],['#a06a46','tan'],['#7e5034','brown'],['#5a3824','dark brown']];
const HAIRC=[['#1e1a18','black'],['#3a2618','dark brown'],['#5a3a22','brown'],['#7a4a26','chestnut'],['#a8642e','auburn'],['#c8a060','blond'],['#e0c890','flaxen'],['#8a8580','grey']];
const CLOTH=[['#76804c','olive'],['#5e6e8a','woad-blue'],['#8a4a32','madder-red'],['#a08a5a','undyed'],['#6a5a7a','heather'],['#4f6a5a','sage'],['#8c7a62','russet'],['#b0a080','oatmeal'],['#7a3a3a','maroon'],['#c2a24e','weld-yellow'],['#4a5a7a','indigo'],['#9a6a4a','ochre']];
const LEGC=[['#6e5a44','brown'],['#5a5650','grey'],['#4a3a30','dark brown'],['#7a6a50','fawn'],['#3e4a5a','slate']];
const LEATHER=['#5a3e2a','#3c2a1c','#6e4a2e','#4a3a2e'],APRONC=[['#e8e0cc','linen'],['#d8ccb0','flax'],['#cfc2a6','canvas']];
const HAIR_NAMES={bald:'bald',bowl:'bowl cut',short:'cropped hair',long:'shoulder-length hair',ponytail:'ponytail',loose:'long loose hair',braid:'braid',bun:'bun',twinBraids:'twin braids',messy:'tousled hair',pigtails:'pigtails'};
const BEARD_NAMES={none:'clean-shaven',mustache:'moustache',beard:'full beard',goatee:'goatee',longBeard:'long beard',chinstrap:'chin beard'};

function villagerTraits(kind,seedN,force={}){const r=mulberry32(((seedN*2654435761)>>>0)^0x51ed),pick=a=>a[Math.floor(r()*a.length)];
  const T={kind,seed:seedN,child:kind==='child'};{const rr=r();T.girl=kind==='female'||(T.child&&(force.girl!==undefined?force.girl:rr<.5));}
  T.skin=pick(SKINS);T.hair=(kind==='male'&&r()<.14)?HAIRC[7]:pick(HAIRC.slice(0,7));
  T.hairStyle=kind==='male'?pick(['bald','bowl','short','short','long','ponytail','bowl']):kind==='female'?pick(['loose','braid','bun','twinBraids','loose','braid']):T.girl?pick(['pigtails','braid','loose','bowl']):pick(['messy','bowl','short','messy']);
  T.beard=kind==='male'?pick(['none','none','mustache','beard','beard','goatee','longBeard','chinstrap']):'none';
  if(T.hairStyle==='bald'&&T.beard==='none'&&r()<.7)T.beard='beard';
  T.outfit=kind==='male'?pick(['tunic','tunic','shortTunic','apron','jerkin']):kind==='female'?pick(['kirtle','apron','bodice','kirtle']):T.girl?pick(['dress','dress','apron']):pick(['tunic','shortTunic']);
  T.main=pick(CLOTH);do{T.second=pick(CLOTH);}while(T.second===T.main);T.legs=pick(LEGC);T.boots=pick(LEATHER);T.belt=pick(LEATHER);T.apron=pick(APRONC);
  T.rolled=r()<.3;T.legwear=kind==='male'?pick(['wraps','hose','wraps','tallBoots']):kind==='child'&&!T.girl?pick(['hose','wraps']):'hose';
  T.head=kind==='male'?pick(['none','none','cowl','cowl','hoodUp','strawHat','cap','coif']):kind==='female'?pick(['none','kerchief','kerchief','wimple','none','shawl']):pick(['none','none','none',T.girl?'kerchief':'cap']);
  T.dagged=r()<.5;T.pouch=r()<.7;T.knife=kind==='male'&&r()<.55;
  if((T.head==='kerchief'||T.head==='wimple')&&['loose','twinBraids','pigtails'].includes(T.hairStyle))T.hairStyle='bun';
  return T;}
function describeTraits(T){const hairN=T.hairStyle==='bald'?'bald':`${T.hair[1]} ${HAIR_NAMES[T.hairStyle]}`;
  const dressy=T.kind!=='male';
  const outfit={tunic:`${T.main[1]} tunic`,shortTunic:`short ${T.main[1]} tunic and ${T.legs[1]} hose`,apron:`${T.main[1]} ${dressy&&T.girl?'dress':'tunic'} with a ${T.apron[1]} apron`,jerkin:`${T.main[1]} tunic under a ${T.second[1]} jerkin`,
    kirtle:`${T.main[1]} kirtle`,robe:`long ${T.main[1]} robe`,gambeson:`quilted ${T.main[1]} gambeson`,bodice:`${T.main[1]} gown with a laced ${T.second[1]} bodice`,dress:`${T.main[1]} dress`}[T.outfit];
  const head={none:'',cowl:`, ${T.second[1]} hood down`,hoodUp:`, ${T.second[1]} hood up`,strawHat:', straw hat',hunterHat:', feathered hunting hat',spikedHelm:', spiked iron helm',slouchHat:', slouch hat',chefCap:', baker\'s cap',kettleHelm:', iron kettle helm',beret:`, ${T.second[1]} beret`,knitCap:`, ${T.second[1]} knit cap`,leatherCap:', leather cap',flatCap:`, ${T.second[1]} cap`,cap:`, ${T.second[1]} felt cap`,coif:', linen coif',kerchief:`, ${T.second[1]} kerchief`,wimple:', linen wimple',shawl:`, ${T.second[1]} shawl`}[T.head];
  const hidden=['kerchief','wimple','hoodUp'].includes(T.head)&&!['braid','bun'].includes(T.hairStyle);
  const jobN=T.job?OCC[T.job].name+'. ':'';
  const s0=[(hidden?`${T.hair[1]} hair`:hairN)+(T.beard!=='none'?`, ${BEARD_NAMES[T.beard]}`:''),outfit+head,`${T.skin[1]} skin`].join('; '),s=s0.replace(/\ba ([aeiou])/g,'an $1');return jobN+s.charAt(0).toUpperCase()+s.slice(1)+'.';}

/* ---------- blocky kit: pixel-noise textures on boxes, 5 cm pixels ---------- */
const PXT={},BXM={};
function pxTex(kind){if(PXT[kind])return PXT[kind];const N=16,c=document.createElement('canvas');c.width=c.height=N;const g=c.getContext('2d'),r=mulberry32(hashStr('px'+kind));
  const rng={skin:[.93,1],cloth:[.87,1],hair:[.74,1],leather:[.78,1],straw:[.72,1],plain:[.9,1]}[kind]||[.85,1];
  for(let y=0;y<N;y++)for(let x=0;x<N;x++){let v=rng[0]+(rng[1]-rng[0])*r();if(kind==='quilt'&&(x%5===0||y%4===0))v*=.78;if(kind==='hair'&&x%3===0)v*=.88;if(kind==='straw'&&(x+y)%4===0)v*=.85;const b=Math.round(v*255);g.fillStyle=`rgb(${b},${b},${b})`;g.fillRect(x,y,1,1);}
  const t=new THREE.CanvasTexture(c);t.magFilter=THREE.NearestFilter;t.minFilter=THREE.NearestFilter;t.generateMipmaps=false;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.encoding=THREE.sRGBEncoding;return PXT[kind]=t;}
function bm(hex,kind='cloth'){const k=hex+kind;return BXM[k]||(BXM[k]=new THREE.MeshStandardMaterial({map:pxTex(kind),color:new THREE.Color(hex).convertSRGBToLinear().multiplyScalar(.9),roughness:.92}));}
function bx(par,w,h,d,mat,x=0,y=0,z=0,rx,ry,rz){const m=box(w,h,d,mat,{s:.8,ox:0,oy:0,oz:0});put(par,m,x,y,z,rx,ry,rz);return m;}

/* ---------- builder ---------- */
function buildVillager(kind='male',seedN=1,job=null,force={}){
  const B=force.B||VB[kind],T=applyOccupation(villagerTraits(kind,seedN,force),job),g=B.g,root=new THREE.Group();root.userData.lights=[];root.userData.traits=T;
  const er=mulberry32(seedN*7919+11);T.eyes=['#3a2a1a','#3d5a78','#4a6a30','#2a1a10'][Math.floor(er()*4)];
  const skin=bm(T.skin[0],'skin'),skinD=bm('#'+new THREE.Color(T.skin[0]).multiplyScalar(.86).getHexString(),'skin'),hairM=bm(T.hair[0],'hair'),main=bm(T.main[0],T.outfit==='gambeson'?'quilt':'cloth'),second=bm(T.second[0]),legsM=bm(T.legs[0]),boots=bm(T.boots,'leather'),beltM=bm(T.belt,'leather'),
    apronM=bm(T.apron[0]),dark=bm('#1c1410','plain'),white=bm('#f0ece2','plain'),pupil=bm(T.eyes,'plain'),brass=bm('#c8a050','plain'),chemise=bm('#ece4d2'),linen=bm('#ece6d6'),wraps=bm('#b8ab8e'),straw=bm('#d2b060','straw'),wood=bm('#6a4a2e','leather');
  const lipC=new THREE.Color(T.skin[0]).lerp(new THREE.Color('#9a3a3a'),.4).multiplyScalar(.8),lip=bm('#'+lipC.getHexString(),'plain');
  const female=kind==='female'||T.girl,adultF=kind==='female',ch=T.child,isDress=['kirtle','bodice','dress','robe'].includes(T.outfit)||(T.outfit==='apron'&&female);
  const topM=T.outfit==='bodice'?chemise:main;
  const hips=J('hips',root,0,B.hipH,0),spine=J('spine',hips,0,B.spine,0),chest=J('chest',spine,0,B.chest,0),neck=J('neck',chest,0,B.neck,0),head=J('head',neck,0,B.headY,0);
  const aw=.12*g*(B.arm||1),lw=.13*g,TW=2*(B.shW-aw/2),TD=.18*g*(B.td||1),HW=(adultF?TW*1.12:TW)*(B.hipK||1),SW=TW*(adultF?.92:1)*(B.waistK||1),vs=B.tS;
  /* torso */
  bx(hips,HW,.16*vs,TD,isDress?main:legsM,0,-.04*vs,0);
  bx(spine,SW,.25*vs,TD,topM,0,.08*vs,0);
  const chH=.27*B.cS;bx(chest,TW,chH,TD,topM,0,.1*B.cS,0);
  if(adultF)bx(chest,TW*.78,.085*B.cS,.04,topM,0,.11*B.cS,TD/2+.018);
  if(T.outfit==='jerkin'||T.outfit==='bodice'){const v=second,e=.02;
    bx(chest,TW+e,chH*.92,TD+e,v,0,.08*B.cS,0);bx(spine,SW+e,.25*vs,TD+e,v,0,.08*vs,0);
    if(adultF)bx(chest,TW*.78+e,.085*B.cS,.04+e,v,0,.11*B.cS,TD/2+.02);
    const fz=TD/2+e/2+(adultF?.042:0)+.004;bx(chest,.06*g,chH*.8,.01,topM,0,.08*B.cS,fz);
    if(T.outfit==='bodice')for(let i=0;i<4;i++){bx(spine,.07*g,.012,.008,dark,0,(.0+i*.055)*vs,TD/2+e/2+.006,0,0,i%2?.6:-.6);}}
  bx(hips,HW+.02,.05*vs,TD+.02,beltM,0,.05*vs,0);bx(hips,.05*g,.045*vs,.012,brass,0,.05*vs,TD/2+.014);
  if(T.pouch)bx(hips,.07*g,.08*g,.05*g,boots,-HW/2+.02,-.01*vs,TD/2+.02);
  if(T.knife){bx(hips,.035,.14,.025,beltM,HW/2+.02,-.03,-.03,0,0,.2);bx(hips,.022,.06,.022,wood,HW/2+.005,.07,-.03,0,0,.2);}
  /* skirt: front/back/side panels pivot at the waist and follow the thighs */
  const ls=B.legS;let L1,L2=0;
  if(isDress){if(adultF||T.outfit==='robe'){L1=.42;L2=.43;}else L1=.3;}else if(T.outfit==='shortTunic')L1=.1*ls;else L1=.34*ls;
  const PW=HW+.03,PD=TD+.03,t=.03,yw=.06*vs,skirt={};
  const panel=(par,q,L,trim)=>{if(q==='F'||q==='B')bx(par,PW+2*t,L,t,main,0,-L/2,0);else bx(par,t,L,PD,main,0,-L/2,0);
    if(trim){if(q==='F'||q==='B')bx(par,PW+2*t+.004,.04,t+.006,second,0,-L+.02,0);else bx(par,t+.006,.04,PD+.004,second,0,-L+.02,0);}};
  const piv={F:[0,PD/2+t/2],B:[0,-PD/2-t/2],L:[PW/2+t/2,0],R:[-PW/2-t/2,0]};
  for(const q in piv){const sj=J('skirt_'+q,hips,piv[q][0],yw,piv[q][1]);sj.userData.joint=false;skirt[q]={up:sj};panel(sj,q,L1,!L2);
    if(L2){const lo=J('skirtLow_'+q,sj,0,-L1,0);lo.userData.joint=false;skirt[q].lo=lo;panel(lo,q,L2,true);}}
  if(T.outfit==='apron'){const la=L2?L1:L1*(ch?.9:1.05);bx(skirt.F.up,PW*.72,la,.016,apronM,0,-la/2,t/2+.01);if(L2)bx(skirt.F.lo,PW*.72,L2*.75,.016,apronM,0,-L2*.375,t/2+.01);
    if(adultF)bx(chest,TW*.62,.17*B.cS,.012,apronM,0,.06*B.cS,TD/2+.047);}
  /* shoulder wear */
  const collar=(m,dag)=>{bx(chest,TW+.07,.1*B.cS,TD+.07+(adultF?.05:0),m,0,.21*B.cS,adultF?.02:0);if(dag)for(let i=0;i<7;i++){const x=-TW/2+(i+.5)*TW/7;bx(chest,.035,.05,.03,m,x,.14*B.cS,TD/2+.035+(adultF?.045:0));}};
  if(T.head==='cowl'||T.head==='hoodUp'){collar(second,T.dagged);if(T.head==='cowl')bx(chest,TW*.6,.14*B.cS,.07,second,0,.24*B.cS,-TD/2-.03);}
  if(T.head==='shawl')collar(second,false);
  bx(neck,.11*g,.12*B.cS,.1*g,skin,0,.04*B.cS,0);
  /* head: a cube with block features */
  const hg=new THREE.Group();head.add(hg);hg.scale.setScalar(B.head);const S=.28,F=S/2,hy=S/2;
  bx(hg,S,S,S,skin,0,hy,0);
  const eyH=ch?.05:.036,eyY=ch?.115:.125;
  for(const s of[-1,1]){bx(hg,.055,eyH,.012,white,s*.058,eyY,F+.003);bx(hg,.026,eyH,.014,pupil,s*.045,eyY,F+.004);
    if(adultF)bx(hg,.06,.012,.012,dark,s*.058,eyY+eyH/2+.004,F+.005);
    bx(hg,.068,female||ch?.012:.02,.014,hairM,s*.058,eyY+eyH/2+(adultF?.026:.018),F+.004);
    bx(hg,.02,.05,.04,skinD,s*(F+.008),.12,-.01);}
  bx(hg,.045,ch?.045:.065,ch?.025:.04,skinD,0,ch?.085:.09,F+(ch?.012:.02));
  bx(hg,female?.06:.07,female?.016:.012,.012,lip,0,.045,F+.003);
  const hs=T.hairStyle,covered=['kerchief','wimple','hoodUp'].includes(T.head),cap=(f,sd,bk)=>{const e=.02;bx(hg,S+e,.05,S+e,hairM,0,S+.015,0);
    if(bk)bx(hg,S+e,bk,.03,hairM,0,S-bk/2,-F-.008);if(sd)for(const s of[-1,1])bx(hg,.03,sd,S+e,hairM,s*(F+.008),S-sd/2,0);if(f)bx(hg,S+e,f,.03,hairM,0,S-f/2,F+.008);};
  if(!covered&&hs!=='bald'){
    const P={bowl:[.07,.14,.17],short:[.035,.08,.12],ponytail:[.035,.08,.12],messy:[.045,.08,.12],long:[.05,.2,.28],loose:[.045,.25,.28],braid:[.04,.1,.15],bun:[.04,.1,.15],twinBraids:[.04,.12,.15],pigtails:[.045,.1,.14]}[hs];
    cap(...P);
    if(hs==='long')bx(hg,S+.02,.16,.04,hairM,0,-.02,-F-.012);
    if(hs==='loose'){bx(hg,S+.02,.3,.04,hairM,0,-.1,-F-.012);for(const s of[-1,1])bx(hg,.035,.08,.08,hairM,s*(F+.01),.0,-F+.04);}
    if(hs==='ponytail'){bx(hg,.06,.05,.05,beltM,0,.18,-F-.03);bx(hg,.06,.16,.06,hairM,0,.08,-F-.05,-.25,0,0);}
    if(hs==='messy'){const mr=mulberry32(seedN);for(let i=0;i<5;i++)bx(hg,.06,.04,.06,hairM,(mr()-.5)*S*.8,S+.05,(mr()-.5)*S*.8,0,mr()*1.5,0);}
    if(hs==='twinBraids')for(const s of[-1,1])for(let i=0;i<4;i++)bx(hg,.055-.006*i,.07,.055-.006*i,hairM,s*(F+.02),.08-i*.07,-.05+i*.025);
    if(hs==='pigtails')for(const s of[-1,1]){bx(hg,.03,.04,.04,second,s*(F+.03),.2,-.06);bx(hg,.06,.15,.06,hairM,s*(F+.06),.14,-.06,0,0,s*.4);}}
  if(hs==='braid')for(let i=0;i<5;i++)bx(hg,.065-.006*i,.07,.06-.005*i,hairM,0,.17-i*.07,-F-.035);
  if(hs==='bun')bx(hg,.11,.1,.1,covered?second:hairM,0,S*.82,-F-.04);
  const bd=T.beard;
  if(['beard','longBeard','chinstrap'].includes(bd)){bx(hg,S+.02,bd==='chinstrap'?.05:.075,.03,hairM,0,bd==='chinstrap'?.025:.038,F+.008);for(const s of[-1,1])bx(hg,.03,.12,S*.55,hairM,s*(F+.008),.06,F*.45);bx(hg,S+.02,.03,S*.6,hairM,0,-.005,F*.4);}
  if(bd==='longBeard')bx(hg,.16,.13,.05,hairM,0,-.06,F-.01);
  if(bd==='goatee')bx(hg,.07,.07,.03,hairM,0,.015,F+.008);
  if(['mustache','beard','longBeard','goatee'].includes(bd))bx(hg,.13,.03,.022,hairM,0,.068,F+.014);
  const shellBox=(m,e,low,face)=>{bx(hg,S+2*e,.04,S+2*e,m,0,S+.02,0);bx(hg,S+2*e,S-low+.02,.03,m,0,(S+low)/2,-F-e);for(const s of[-1,1])bx(hg,.03,S-low+.02,S+2*e,m,s*(F+e),(S+low)/2,0);if(face)bx(hg,S+2*e,face,.03,m,0,S-face/2+.02,F+e);};
  if(T.head==='hoodUp')shellBox(second,.035,-.04,.05);
  if(T.head==='kerchief'||T.head==='wimple'){const km=T.head==='wimple'?linen:second;shellBox(km,.022,.1,.035);bx(hg,.08,.07,.05,km,0,.12,-F-.05);if(T.head==='wimple'){bx(hg,S+.04,.08,S*.85,linen,0,-.02,0);bx(neck,.16*g,.12*B.cS,.15*g,linen,0,.04*B.cS,0);}}
  if(T.head==='coif'){shellBox(linen,.02,.12,.03);for(const s of[-1,1])bx(hg,.03,.1,.03,linen,s*(F+.02),.03,.06);bx(hg,S+.04,.03,.06,linen,0,-.015,.06);}
  if(T.head==='strawHat'){bx(hg,S+.24,.03,S+.24,straw,0,S+.02,0);bx(hg,S*.82,.11,S*.82,straw,0,S+.09,0);bx(hg,S*.84,.03,S*.84,beltM,0,S+.05,0);}
  const hatC=bm(T.job==='hunter'?'#5a4a2e':T.job==='noble'?T.second[0]:T.second[0]),y0=S+.04;
  if(T.head==='hunterHat'){bx(hg,S+.2,.03,S+.2,hatC,0,y0,0);bx(hg,S*.86,.12,S*.86,hatC,0,y0+.07,0);bx(hg,S*.6,.08,S*.72,hatC,0,y0+.16,-.02);bx(hg,.03,.03,.34,bm('#b03a2e','plain'),S*.42,y0+.12,-.05,.6,0,.3);bx(hg,.03,.03,.16,bm('#ece6d6','plain'),S*.44,y0+.2,-.18,.9,0,.3);}
  if(T.head==='chefCap'){bx(hg,S+.03,.08,S+.03,bm('#f0ece2','plain'),0,y0,0);bx(hg,S+.1,.18,S+.1,bm('#f0ece2','plain'),0,y0+.13,0);}
  if(T.head==='kettleHelm'){const im=bm('#8a8e94','plain');bx(hg,S+.06,.1,S+.06,im,0,S-.02,0);bx(hg,S*.92,.1,S*.92,im,0,S+.08,0);bx(hg,S*.6,.06,S*.6,im,0,S+.16,0);bx(hg,S+.26,.03,S+.26,im,0,S-.06,0);}
  if(T.head==='beret'){bx(hg,S+.12,.07,S+.12,hatC,.02,y0,0,0,0,-.12);bx(hg,.04,.05,.04,hatC,0,y0+.05,0);if((T.acc||[]).includes('feather'))bx(hg,.03,.03,.36,bm('#ece6d6','plain'),-S*.4,y0+.08,-.04,.5,0,-.4);}
  if(T.head==='knitCap'){bx(hg,S+.05,.13,S+.05,hatC,0,y0+.02,0);bx(hg,S+.07,.05,S+.07,hatC,0,y0-.04,0);bx(hg,.08,.06,.08,hatC,0,y0+.11,0);}
  if(T.head==='leatherCap'){const lm=bm('#5a3a24','leather');bx(hg,S+.04,.08,S+.04,lm,0,y0,0);for(const s of[-1,1])bx(hg,.03,.12,.12,lm,s*(F+.03),S-.06,.02);}
  if(T.head==='flatCap'){bx(hg,S+.04,.06,S+.04,hatC,0,y0,0);bx(hg,S*.7,.02,.1,hatC,0,y0-.02,F+.04);}
  if(T.head==='spikedHelm'){const im=bm('#7a7e84','plain');bx(hg,S+.06,.1,S+.06,im,0,S-.02,0);bx(hg,S*.92,.12,S*.92,im,0,S+.09,0);bx(hg,S*.6,.08,S*.6,im,0,S+.18,0);bx(hg,.05,.16,.05,im,0,S+.28,0);bx(hg,.05,.16,.03,im,0,S*.68,F+.02);for(const s of[-1,1])bx(hg,.03,.14,.1,im,s*(S/2+.025),S*.62,F*.45);}
  if(T.head==='slouchHat'){const sm=bm('#5a4a36','cloth');bx(hg,S+.28,.03,S+.28,sm,0,S+.03,.02,.08,0,0);bx(hg,S*.84,.15,S*.84,sm,0,S+.11,0);bx(hg,S*.86,.03,S*.86,bm('#3a2a1e','leather'),0,S+.06,0);}
  if(T.head==='cap'){bx(hg,S+.03,.08,S+.03,second,0,S+.02,0);bx(hg,.06,.04,.06,second,0,S+.08,0);}
  const sockHead=J('socket_head',head,0,(S+.03)*B.head,0);sockHead.userData.socket=true;
  /* arms */
  for(const[sd,s]of[['L',1],['R',-1]]){const sh=J('shoulder_'+sd,chest,s*B.shW*.325,.165*B.cS,0),ua=J('upperArm_'+sd,sh,s*B.shW*.675,0,0),fa=J('foreArm_'+sd,ua,0,-B.ua,0),hd=J('hand_'+sd,fa,0,-B.fa,0);
    bx(ua,aw,B.ua+aw/2,aw,topM,0,-B.ua/2+aw/4,0);
    if(T.rolled&&!female){bx(fa,aw*1.08,.05,aw*1.08,topM,0,-.02,0);bx(fa,aw*.92,B.fa,aw*.92,skin,0,-B.fa/2,0);}
    else{bx(fa,aw*.96,B.fa*.88,aw*.96,topM,0,-B.fa*.44,0);bx(fa,aw,.035,aw,T.outfit==='bodice'?chemise:second,0,-B.fa*.86,0);bx(fa,aw*.85,B.fa*.2,aw*.85,skin,0,-B.fa*.92,0);}
    const hk=B.hand,hw=aw*.85;bx(hd,hw,.09*hk,hw,skin,0,-.04*hk,0);
    const fg=J('fingers_'+sd,hd,s*.0,-.085*hk,0),ft=J('fingerTips_'+sd,fg,0,-.035*hk,0),th=J('thumb_'+sd,hd,-s*.02*hk,-.04*hk,hw/2);
    bx(fg,hw*.8,.04*hk,hw*.95,skin,s*.005,-.016*hk,0);bx(ft,hw*.7,.03*hk,hw*.9,skin,s*.005,-.012*hk,0);bx(th,.025*hk,.045*hk,.025*hk,skin,0,-.018*hk,.006);
    if((T.acc||[]).includes('gloves')){const gm=bm('#6e4a2e','leather');bx(hd,hw*1.12,.1*hk,hw*1.12,gm,0,-.04*hk,0);bx(fg,hw*.86,.046*hk,hw*1.02,gm,s*.005,-.016*hk,0);bx(ft,hw*.76,.036*hk,hw*.96,gm,s*.005,-.012*hk,0);bx(th,.032*hk,.05*hk,.032*hk,gm,0,-.018*hk,.006);bx(fa,aw*1.16,.09,aw*1.16,gm,0,-B.fa+.04,0);}
    const sk=J('socket_'+sd,hd,-s*.012*hk,-.075*hk,0);sk.userData.socket=true;}
  /* legs */
  const leg={};for(const[sd,s]of[['L',1],['R',-1]]){const th=J('thigh_'+sd,hips,s*B.hipW,-(B.hipOff+.01),0),sn=J('shin_'+sd,th,0,-B.thigh,0),ft=J('foot_'+sd,sn,0,-B.shin,0);leg[sd]=th;
    bx(th,lw,B.thigh+lw/2,lw*1.05,legsM,0,-B.thigh/2+lw/4,0);const sl=B.shin,lwx=T.legwear;
    bx(sn,lw*.95,sl,lw,lwx==='wraps'?wraps:legsM,0,-sl/2,0);
    if(lwx==='wraps')for(let i=0;i<3;i++)bx(sn,lw*.97,.025,lw*1.02,bm('#8a7a60'),0,-sl*(.2+i*.22),0,0,0,.18);
    const bt=lwx==='tallBoots'?sl*.62:adultF?.0:sl*.24;if(bt)bx(sn,lw*1.04,bt,lw*1.09,boots,0,-sl+bt/2,0);if(bt&&!adultF)bx(sn,lw*1.12,.035,lw*1.15,boots,0,-sl+bt,0);
    const fk=B.ankle/.06;bx(ft,lw*1.02,.075*fk,lw*1.6,boots,0,-.028*fk,.03*g);bx(ft,lw*1.04,.02*fk,lw*1.62,beltM,0,-.06*fk,.03*g);}
  /* occupation accessories */
  const A=T.acc||[],has=k=>A.some(a=>a===k||a.startsWith(k+':')),leatherM=bm('#5a3a24','leather'),gold=bm('#d8b040','plain');
  if(has('apron')){const kind=A.find(a=>a.startsWith('apron:')).split(':')[1],am=kind==='leather'?leatherM:kind==='white'?bm('#ece8de'):second,bz=TD/2+.012+(adultF?.045:0);
    bx(chest,TW*.66,chH*.78,.02,am,0,.06*B.cS,bz);for(const s of[-1,1])bx(chest,.03,.12,.02,am,s*TW*.24,.22*B.cS,TD/2+.01);bx(hips,HW+.03,.05,TD+.03,am,0,.08*vs,0);
    const la=Math.max(L1,.5*ls);bx(skirt.F.up,PW*.68,la,.018,am,0,-la/2,t/2+.012);if(L2)bx(skirt.F.lo,PW*.68,L2*.8,.018,am,0,-L2*.4,t/2+.012);}
  if(has('tabard')){const tm=second;for(const z of[1,-1]){bx(chest,TW*.82,chH*.95,.02,tm,0,.08*B.cS,z*(TD/2+.012+(adultF&&z>0?.045:0)));bx(spine,TW*.8,.25*vs,.02,tm,0,.08*vs,z*(TD/2+.012));}
    bx(chest,.12,.12,.025,gold,0,.08*B.cS,TD/2+.026+(adultF?.045:0),0,0,Math.PI/4);bx(skirt.F.up,PW*.62,L1*.95,.02,tm,0,-L1*.47,t/2+.013);bx(skirt.B.up,PW*.62,L1*.95,.02,tm,0,-L1*.47,-t/2-.013);}
  if(has('quiver')){const q=new THREE.Group();put(chest,q,TW*.18,.06*B.cS,-TD/2-.1,0,0,.35);bx(q,.16,.56*B.cS,.16,leatherM,0,0,0);for(let i=0;i<4;i++){bx(q,.025,.16,.025,wood,-.04+(i%2)*.08,.32*B.cS,-.03+(i>1?.06:0));bx(q,.05,.08,.012,white,-.04+(i%2)*.08,.4*B.cS,-.03+(i>1?.06:0));}
    bx(chest,.04,chH*1.1,.03,leatherM,0,.1*B.cS,TD/2+.02+(adultF?.04:0),0,0,-.65);}
  if(has('satchel')){bx(chest,.04,chH*1.15,.03,leatherM,0,.1*B.cS,TD/2+.02+(adultF?.04:0),0,0,.6);bx(hips,.1,.22,.26,leatherM,-HW/2-.06,-.02*vs,.06);bx(hips,.11,.07,.27,bm('#3c2a1c','leather'),-HW/2-.065,.07,.06);}
  if(has('bigPouch'))bx(hips,.14,.16,.08,leatherM,HW/2-.02,-.02*vs,TD/2+.04);
  if(has('scabbard')){const sc=new THREE.Group();put(hips,sc,HW/2+.05,-.05,-.04,.25,0,.12);bx(sc,.05,.62,.08,leatherM,0,-.3,0);bx(sc,.05,.12,.05,bm('#5a6068','plain'),0,.06,0);bx(sc,.05,.04,.2,gold,0,.0,0);}
  if(has('chain')){const cz=TD/2+.02+(adultF?.04:0);bx(chest,TW*.5,.03,.03,gold,0,.17*B.cS,cz);for(const s of[-1,1])bx(chest,.03,.12,.03,gold,s*TW*.24,.21*B.cS,cz-.01);bx(chest,.08,.08,.03,gold,0,.12*B.cS,cz+.01);}
  if(has('tape')){const tz=TD/2+.015+(adultF?.045:0);for(const s of[-1,1])bx(chest,.035,chH*.9,.012,bm('#e0c040','plain'),s*.07*g,.07*B.cS,tz);}
  if(has('cloak'))bx(chest,TW+.12,.95*B.legS,.04,second,0,.22*B.cS-.95*B.legS/2,-TD/2-.03);
  if(has('mask')){const mm=bm('#5a2420');bx(hg,S+.02,S*.34,.03,mm,0,S*.2,F+.012);for(const s of[-1,1])bx(hg,.02,S*.34,S*.8,mm,s*(S/2+.008),S*.2,F*.15);bx(hg,.04,.12,.03,mm,S*.2,S*.06,-F-.01,0,0,.3);}
  if(has('mail')){const ml=vm('mail');const tgt=[chest,spine,hips];for(const sd of['L','R']){const u=root.getObjectByName('upperArm_'+sd);if(u)tgt.push(u);}
    for(const g of tgt)for(const c of g.children.slice()){if(c.isMesh&&c.geometry.parameters&&(c.material===main||c.material===second)&&c.geometry.parameters.width>.08){const p=c.geometry.parameters;const m=bx(g,p.width+.035,p.height+.01,p.depth+.035,ml,c.position.x,c.position.y,c.position.z);m.rotation.copy(c.rotation);}}}
  if(has('pauldrons'))for(const sd of['L','R']){const u=root.getObjectByName('upperArm_'+sd);if(!u)continue;const pm=bm('#5a3a24','leather');bx(u,aw*1.9,.07,aw*1.9,pm,0,.03,0);bx(u,aw*1.7,.06,aw*1.7,bm('#8a8e94','plain'),0,-.03,0);bx(u,aw*1.5,.05,aw*1.5,pm,0,-.08,0);}
  if(has('furCloak')){const fm=vm('fur');bx(chest,TW+.14,.95*B.legS,.05,fm,0,.22*B.cS-.95*B.legS/2,-TD/2-.035);bx(chest,TW+.2,.12,TD+.16+(adultF?.08:0),fm,0,.22*B.cS,0);}
  if(has('shieldBack')&&typeof wRoundShield==='function'){const sh=wRoundShield('woolRed');sh.scale.setScalar(.75);put(chest,sh,0,-.02,-TD/2-.1,0,Math.PI,0);}
  if(has('sackBack')){bx(chest,.32,.4,.2,bm('#9a8462','cloth'),.04,-.02,-TD/2-.12,0,0,.1);bx(chest,.12,.08,.12,bm('#8a7a5a','cloth'),.05,.2,-TD/2-.12);bx(chest,.035,chH*1.15,.03,bm('#5a3a24','leather'),0,.1*B.cS,TD/2+.02+(adultF?.04:0),0,0,-.6);}
  if(has('bracer')){const fa=root.getObjectByName('foreArm_L');if(fa)bx(fa,aw*1.25,.16,aw*1.25,bm('#5a3a24','leather'),0,-B.fa*.55,0);}
  root.userData.occTool=T.tool;
  /* stool for Sit */
  const stool=new THREE.Group();stool.visible=false;const shh=.4*B.legS;put(root,stool,0,0,-.08*B.legS);const pl=bm('#8a6440','leather');
  bx(stool,.46*g+.08,.05,.34*g+.06,pl,0,shh,0);for(const[x,z]of[[1,1],[1,-1],[-1,1],[-1,-1]])bx(stool,.05,shh,.05,pl,x*(.18*g+.03),shh/2,z*(.12*g+.02));
  root.userData.clipProps={Sit:stool};
  const D2=Math.PI/180;
  root.userData.post=()=>{const a=leg.L.rotation.x,b=leg.R.rotation.x,lo=Math.min(a,b),hi=Math.max(a,b),av=(a+b)/2,kf=L2?.8:.85,ks=L2?.5:.65;
    const set=(q,v)=>{skirt[q].up.rotation.x=v;if(skirt[q].lo){const m=Math.abs(v),gv=Math.min(1,Math.max(0,(m-30*D2)/(40*D2)))*.95;skirt[q].lo.rotation.x=-v*gv;}};
    set('F',lo<0?lo*kf:lo*.4);set('B',hi>0?hi*kf:hi*.5);set('L',(a*.7+av*.3)*ks);set('R',(b*.7+av*.3)*ks);
    skirt.L.up.rotation.z=leg.L.rotation.z*.6;skirt.R.up.rotation.z=leg.R.rotation.z*.6;};
  const joints=[];root.traverse(o=>{if(o.userData.joint&&!o.userData.socket)joints.push(o);});root.userData.joints=joints;
  root.userData.clips=villagerClips(B);root.userData.variantText=describeTraits(T);
  return root;}

/* ---------- tools (grip at origin, handle along +z, striking face toward -y) ---------- */
const TOOLS={
  Axe:{two:true,work:'Tool strike',piece:'log',build(){const g=new THREE.Group(),w=bm('#8a6440','leather'),ir=bm('#9aa0a8','plain'),dk=bm('#5a6068','plain');
    bx(g,.04,.04,.78,w,0,0,.13);bx(g,.035,.13,.13,dk,0,-.045,.45);bx(g,.03,.06,.17,ir,0,-.13,.45);bx(g,.04,.05,.06,dk,0,.04,.45);g.userData.tip=new THREE.Vector3(0,-.16,.45);return g;}},
  Pickaxe:{two:true,work:'Tool strike',piece:'rock',build(){const g=new THREE.Group(),w=bm('#8a6440','leather'),ir=bm('#9aa0a8','plain'),dk=bm('#5a6068','plain');
    bx(g,.04,.04,.78,w,0,0,.13);bx(g,.06,.07,.07,dk,0,0,.47);for(const s of[-1,1]){bx(g,.04,.13,.045,ir,0,s*.09,.46);bx(g,.032,.07,.035,ir,0,s*.18,.43);}g.userData.tip=new THREE.Vector3(0,-.21,.43);return g;}},
  Sledgehammer:{two:true,work:'Tool strike',piece:'rock',build(){const g=new THREE.Group(),w=bm('#8a6440','leather'),dk=bm('#5a6068','plain');
    bx(g,.045,.045,.8,w,0,0,.14);bx(g,.1,.22,.1,dk,0,-.01,.48);g.userData.tip=new THREE.Vector3(0,-.12,.48);return g;}},
  Hammer:{two:false,work:'Hammering',piece:'anvil',build(){const g=new THREE.Group(),w=bm('#8a6440','leather'),dk=bm('#5a6068','plain');
    bx(g,.03,.03,.34,w,0,0,.1);bx(g,.05,.14,.055,dk,0,-.02,.28);bx(g,.035,.03,.035,dk,0,.06,.28);g.userData.tip=new THREE.Vector3(0,-.09,.28);return g;}},
};
function buildWorkpiece(kind,top){const g=new THREE.Group(),h=Math.max(.12,top);
  if(kind==='log'){const bark=bm('#5a4230','leather'),end=bm('#c49a64','straw');const bh=Math.max(.06,h-.32);bx(g,.42,bh,.42,bark,0,bh/2,0);bx(g,.36,.012,.36,end,0,bh+.004,0);bx(g,.22,.3,.22,bark,0,bh+.15,0);bx(g,.18,.012,.18,end,0,h+.004,0);}
  else if(kind==='rock'){const st=bm('#8a8a86','straw'),st2=bm('#6e6e6a','straw'),ore=bm('#d8b04a','plain');bx(g,.6,h,.5,st,0,h/2,0);bx(g,.32,h*.7,.3,st2,.32,h*.35,-.1);bx(g,.3,h*.55,.3,st2,-.3,h*.27,.12);
    for(const[x,y,z]of[[.1,h*.8,.251],[-.15,h*.45,.251],[.2,h*.3,.251],[-.05,h+.001,.05]])bx(g,.06,.06,.01,ore,x,y,z);}
  else if(kind==='anvil'){const ir=bm('#4a4e54','plain'),wd=bm('#6a4a2e','leather'),hot=new THREE.MeshStandardMaterial({color:0xffa040,emissive:0xff6010,emissiveIntensity:1.4,roughness:.5});
    const sh=Math.max(.1,h-.36);bx(g,.36,sh,.36,wd,0,sh/2,0);bx(g,.26,.08,.18,ir,0,sh+.04,0);bx(g,.12,.16,.12,ir,0,sh+.16,0);bx(g,.42,.12,.18,ir,0,h-.06,0);bx(g,.12,.08,.1,ir,.27,h-.07,0);
    const bar=new THREE.Mesh(new THREE.BoxGeometry(.3,.025,.035),hot);bar.position.set(.03,h+.012,0);g.add(bar);g.userData.hot=bar;g.userData.grab=new THREE.Vector3(.2,h+.03,0);}
  return g;}
