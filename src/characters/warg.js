/* ======================= WARG: large hyena-like wolf, enemy mount =======================
   Own quadruped rig (split spine, three-segment legs, opening jaw, two-part tail). Clips are FK poses in degrees,
   sampled by wgClip, which grounds every frame on the lowest point of the model and, for most clips, also pitches
   the body so the front half and the hind half both touch the ground ("level"). Fronts face +z. */
const WG_COAT={dkgrey:['#4a4846','Dark grey'],black:['#2a2826','Black'],brown:['#5a4232','Brown'],tan:['#8a7456','Dusty tan'],greybrown:['#6a5e50','Grey-brown'],pale:['#9a968e','Pale grey']};
const WG_EYE={yellow:['#ffc830','Yellow'],red:['#ff3a22','Red'],green:['#a0e040','Green'],pale:['#e8ecd8','Pale']};
const WGEM={};
function wgEye(hex){return WGEM[hex]||(WGEM[hex]=new THREE.MeshStandardMaterial({color:new THREE.Color(hex).convertSRGBToLinear(),emissive:new THREE.Color(hex).convertSRGBToLinear(),emissiveIntensity:.9,roughness:.5}));}

function buildWarg(seed,o={}){const r=mulberry32(((seed*2654435761)>>>0)^0x3a91),pick=a=>a[Math.floor(r()*a.length)],opt=(k,list)=>o[k]&&o[k]!=='random'?o[k]:pick(list);
  const ck=opt('coat',Object.keys(WG_COAT)),pat=opt('pattern',['none','spots','stripes','saddle']),maneK=opt('mane',['ridge','shaggy']),earK=opt('ears',['pointed','round','torn']),scars=opt('scars',['yes','no'])==='yes',
    eye=WG_EYE[o.eyes||'yellow'][0],gear=o.gear||'none',coat=WG_COAT[ck][0],lite='#'+new THREE.Color(coat).lerp(new THREE.Color('#d8ccb0'),.3).getHexString();
  const cM=cm('hair',coat),dM=cm('hair',darker(coat,.55)),mnM=cm('hair',darker(coat,.42)),ltM=cm('hair',lite),mkM=cm('hair',darker(coat,ck==='black'?1.5:.5)),
    pad=bm('#241e1a','plain'),claw=bm('#3a322a','plain'),ivory=bm('#e2d8b8','plain'),gum=bm('#8a3a3a','skin'),mouth=bm('#3a1a1a','plain'),nose=bm('#1a1614','plain'),scarM=bm('#b8968a','skin'),
    leather=bm('#5a3a24','leather'),leaD=bm('#3e2818','leather'),iron=vm('iron'),cloth=bm(pick(['#6e2e26','#3e4a5e','#4e5a34','#5a4a3a']),'cloth');
  const shag=maneK==='shaggy',root=new THREE.Group();root.userData.lights=[];root.userData.animal='warg';
  const body=new THREE.Group();body.name='body';body.userData.joint=true;body.position.set(0,1.08,0);root.add(body);
  const chest=aJ(body,'chest',0,0,.3),hips=aJ(body,'hips',0,0,-.25);
  /* torso: deep chest and withers hump, sloping back down to a lower, narrower rump */
  bx(chest,.62,.78,.75,cM,0,.05,.325);bx(chest,.5,.16,.45,cM,0,.46,.275);bx(chest,.56,.6,.6,cM,0,.08,-.25);
  bx(chest,.44,.42,.02,ltM,0,-.04,.705);bx(chest,.4,.02,.6,ltM,0,-.341,.3);bx(chest,.42,.02,.5,ltM,0,-.221,-.25);
  bx(hips,.5,.48,.5,cM,0,.06,.05);bx(hips,.54,.48,.5,cM,0,0,-.38);bx(hips,.36,.02,.4,ltM,0,-.181,.05);
  /* mane: a dark crest down the neck and over the withers, or a shaggy ruff */
  if(shag){bx(chest,.5,.46,.1,mnM,0,.02,.73);for(const s of[-1,1])bx(chest,.04,.3,.5,mnM,s*.32,.2,.35);bx(chest,.2,.1,.5,mnM,0,.58,.25);bx(hips,.12,.06,.4,mnM,0,.31,-.1);}
  else{bx(chest,.12,.08,.5,mnM,0,.57,.25);if(gear!=='saddle')bx(chest,.1,.05,.5,mnM,0,.405,-.25);}
  /* legs: front (shoulder, elbow, wrist) and hind (hip, stifle, hock, paw); paws with dark pads and claws */
  const paw=(p,w,d,z,y)=>{bx(p,w,.07,d,cM,0,y-.035,z);bx(p,w*.9,.012,d*.85,pad,0,y-.066,z);for(const x of[-1,0,1])bx(p,.028,.03,.04,claw,x*w*.3,y-.052,z+d/2+.01);};
  for(const[k,s]of[['FL',1],['FR',-1]]){const up=aJ(chest,'leg_'+k,s*.26,-.083,.45,[.25,0,0]);bx(up,.19,.3,.28,cM,0,.05,0);bx(up,.22,.44,.26,cM,0,-.17,0);
    const kn=aJ(up,'knee_'+k,0,-.38,0,[-.25,0,0]);bx(kn,.17,.48,.17,cM,0,-.23,0);bx(kn,.13,.14,.06,shag?mnM:dM,0,-.04,-.1);
    const pw=aJ(kn,'paw_'+k,0,-.46,0);bx(pw,.14,.12,.14,cM,0,-.05,0);paw(pw,.19,.24,.04,-.1);}
  for(const[k,s]of[['BL',1],['BR',-1]]){const up=aJ(hips,'leg_'+k,s*.21,-.1,-.4,[-.35,0,0]);bx(up,.24,.2,.34,cM,0,0,0);bx(up,.22,.42,.3,cM,0,-.15,0);
    const kn=aJ(up,'knee_'+k,0,-.32,0,[.75,0,0]);bx(kn,.15,.34,.17,cM,0,-.15,0);
    const hk=aJ(kn,'hock_'+k,0,-.3,0,[-.4,0,0]);bx(hk,.11,.26,.12,cM,0,-.11,0);bx(hk,.08,.07,.05,dM,0,0,-.07);
    const pw=aJ(hk,'paw_'+k,0,-.22,0);paw(pw,.16,.21,.05,0);}
  /* neck and head: heavy skull, brow ridge, long muzzle, fangs, glowing eyes, opening jaw */
  const neck=aJ(chest,'neck',0,.22,.68,[.95,0,0]);bx(neck,.36,.56,.4,cM,0,.2,0);bx(neck,.26,.4,.02,ltM,0,.18,.205);
  if(shag){bx(neck,.5,.36,.5,mnM,0,.08,0);bx(neck,.16,.56,.14,mnM,0,.22,-.25);}else bx(neck,.1,.52,.1,mnM,0,.2,-.24);
  const head=aJ(neck,'head',0,.46,.02,[-.8,0,0]);
  bx(head,.36,.3,.34,cM,0,.04,.06);bx(head,.42,.18,.2,cM,0,-.03,.04);bx(head,.36,.07,.07,dM,0,.15,.22);
  bx(head,.22,.15,.3,cM,0,0,.37);bx(head,.18,.04,.26,dM,0,.085,.35);bx(head,.12,.07,.04,nose,0,.04,.53);
  for(const s of[-1,1]){bx(head,.06,.035,.02,wgEye(eye),s*.13,.1,.235);bx(head,.08,.025,.02,mnM,s*.13,.125,.24,0,0,s*.25);bx(head,.03,.07,.03,ivory,s*.095,-.105,.47);}
  bx(head,.2,.02,.24,ivory,0,-.083,.38);bx(head,.16,.05,.22,mouth,0,-.1,.28);
  const jaw=aJ(head,'jaw',0,-.085,.1);bx(jaw,.16,.07,.42,cM,0,-.035,.2);bx(jaw,.22,.1,.16,cM,0,-.045,.04);bx(jaw,.14,.02,.02,ltM,0,-.06,.405);
  bx(jaw,.1,.015,.26,gum,0,.003,.2);bx(jaw,.14,.015,.2,ivory,0,.005,.27);for(const s of[-1,1])bx(jaw,.025,.035,.025,ivory,s*.055,.015,.37);
  for(const s of[-1,1]){const ear=aJ(head,'ear_'+(s>0?'L':'R'),s*.12,.18,-.02,[-.25,0,-s*.35]);
    if(earK==='round'){bx(ear,.15,.14,.04,cM,0,.07,0);bx(ear,.1,.04,.04,cM,0,.155,0);bx(ear,.09,.1,.01,dM,0,.07,.022);}
    else{const torn=earK==='torn'&&s>0;bx(ear,.11,.12,.05,cM,0,.06,0);bx(ear,.07,.1,.01,dM,0,.07,.027);
      if(torn)bx(ear,.04,.05,.05,cM,-.025,.14,0);else{bx(ear,.08,.08,.05,cM,0,.15,0);bx(ear,.04,.06,.05,cM,0,.21,0);}}}
  /* tail: two segments, bushy and dark-tipped */
  const tail=aJ(hips,'tail',0,.14,-.62,[.6,0,0]);bx(tail,.13,.34,.13,cM,0,-.15,0);const t2=aJ(tail,'tail2',0,-.3,0,[.15,0,0]);
  bx(t2,shag?.22:.17,.36,shag?.22:.17,shag?mnM:cM,0,-.17,0);bx(t2,.12,.1,.12,mnM,0,-.38,0);
  /* coat pattern: hyena spots, brindle stripes or a dark saddle */
  const side=(par,y0,y1,z0,z1,hw,n,f)=>{for(let i=0;i<n;i++)for(const s of[-1,1])f(par,s,hw,y0+(y1-y0)*r(),z0+(z1-z0)*r(),i);};
  if(pat==='spots'){const sp=(par,s,hw,y,z)=>{const w=.05+r()*.05;bx(par,.012,w,w*1.2,mkM,s*(hw+.006),y,z);};
    side(chest,-.2,.3,.05,.6,.31,7,sp);side(chest,-.1,.3,-.5,0,.28,5,sp);side(hips,-.12,.2,-.55,.2,.27,7,sp);
    for(const k of['FL','FR','BL','BR']){const j=root.getObjectByName((k[0]==='F'?'knee_':'leg_')+k),hw=k[0]==='F'?.07:.11;for(let i=0;i<3;i++)bx(j,.012,.04,.045,mkM,(k[1]==='L'?1:-1)*(hw+.006),-.08-r()*.25,(r()-.5)*.08);}}
  if(pat==='stripes'){
    for(let i=0;i<4;i++)for(const s of[-1,1]){bx(chest,.012,.3+r()*.1,.04,mkM,s*.316,.12,-.45+i*.13);bx(hips,.012,.26+r()*.1,.04,mkM,s*.276,.02,-.55+i*.15);}
    for(const k of['BL','BR'])for(let i=0;i<3;i++)bx(root.getObjectByName('leg_'+k),.012,.03,.2,mkM,(k[1]==='L'?1:-1)*.116,-.06-i*.1,0,.3,0,0);}
  if(pat==='saddle'&&gear!=='saddle'){bx(chest,.5,.012,.6,mkM,0,.386,-.25);for(const s of[-1,1])bx(chest,.012,.18,.6,mkM,s*.286,.29,-.25);bx(hips,.4,.012,.5,mkM,0,.306,.05);}
  /* scars: pale claw marks over the right eye and across the left flank */
  if(scars){bx(head,.015,.12,.02,scarM,-.14,.1,.236,0,0,.4);bx(head,.015,.06,.08,scarM,.111,.03,.4,.3,0,0);for(let i=0;i<3;i++)bx(chest,.012,.26,.025,scarM,.316,.05,-.1+i*.07,.5,0,0);}
  /* gear: spiked collar; the saddle adds a blanket, girth and stirrups for a rider */
  if(gear!=='none'){bx(neck,.42,.08,.46,leather,0,.34,0);for(const[x,z]of[[.21,0],[-.21,0],[0,.23],[0,-.23]])bx(neck,x?.06:.03,.03,z?.06:.03,iron,x*1.12,.34,z*1.12);
    bx(neck,.06,.06,.02,iron,0,.3,.235);}
  if(gear==='saddle'){bx(chest,.64,.025,.46,cloth,0,.3925,-.3);for(const s of[-1,1]){bx(chest,.02,.3,.46,cloth,s*.29,.255,-.3);bx(chest,.022,.34,.07,leaD,s*.302,-.06,-.28);
      bx(chest,.025,.3,.04,leaD,s*.318,.27,-.22);bx(chest,.03,.03,.1,iron,s*.318,.11,-.22);bx(chest,.03,.06,.02,iron,s*.318,.14,-.18);bx(chest,.03,.06,.02,iron,s*.318,.14,-.26);}
    bx(chest,.6,.022,.07,leaD,0,-.232,-.28);bx(chest,.44,.08,.36,leather,0,.445,-.28);bx(chest,.2,.1,.06,leather,0,.53,-.13);bx(chest,.34,.12,.06,leather,0,.54,-.44);}
  /* contact points: the 8 corners of every box, split into the front half (chest) and the hind half (hips) */
  const pts=par=>{const L=[];par.traverse(q=>{if(!q.isMesh)return;q.geometry.computeBoundingBox();const b=q.geometry.boundingBox,c=[];for(const x of[b.min.x,b.max.x])for(const y of[b.min.y,b.max.y])for(const z of[b.min.z,b.max.z])c.push(new THREE.Vector3(x,y,z));L.push([q,c]);});return L;};
  const U={F:pts(chest),B:pts(hips),J:{}};U.A=U.F.concat(U.B);root.userData.wg=U;
  root.userData.ajoints=['body','chest','hips','neck','head','jaw','ear_L','ear_R','tail','tail2','leg_FL','knee_FL','paw_FL','leg_FR','knee_FR','paw_FR','leg_BL','knee_BL','hock_BL','paw_BL','leg_BR','knee_BR','hock_BR','paw_BR'];
  for(const n of root.userData.ajoints)U.J[n]=n==='body'?body:root.getObjectByName(n);
  root.updateMatrixWorld(true);body.position.y-=wgLow(U.A);U.bp=body.position.clone();
  const joints=[];root.traverse(q=>{if(q.userData.joint)joints.push(q);});root.userData.joints=joints;
  const key=maneK+gear+earK;root.userData.clips=WGCLIPS[key]||(WGCLIPS[key]=wargClips(root));root.userData.ground=2;root.userData.look={coat:ck,pattern:pat,mane:maneK,ears:earK,scars};return root;}

/* clips depend only on the shape (mane, gear, ears), so they are shared between looks */
const WGCLIPS={};
function wgLow(L){let lo=1e9;for(const[m,c]of L){const e=m.matrixWorld.elements;for(const v of c){const y=e[1]*v.x+e[5]*v.y+e[9]*v.z+e[13];if(y<lo)lo=y;}}return lo;}
/* sampler: fn(u,t) returns joint angles in degrees and _pos [x, lift, z]; o.level (bool or fn(u)) pitches the body so both halves touch */
function wgClip(m,name,dur,loop,fn,o={}){const U=m.userData.wg,J=m.userData.ajoints,body=U.J.body,bp=U.bp,fps=30,n=Math.max(2,Math.round(dur*fps)+1),times=[],vals={},pos=[],D=Math.PI/180;
  for(const j of J)vals[j]=[];
  for(let i=0;i<n;i++){const t=i/(n-1)*dur,u=t/dur,p=fn(u,t)||{},P=p._pos||[0,0,0];
    for(const j of J){const a=p[j]||[0,0,0];U.J[j].rotation.set(a[0]*D,a[1]*D,a[2]*D);}body.position.set(bp.x+P[0],bp.y,bp.z+P[2]);
    const lv=typeof o.level==='function'?o.level(u):o.level!==false;
    if(lv){const x0=body.rotation.x,f=d=>{body.rotation.x=x0+d;m.updateMatrixWorld(true);return wgLow(U.F)-wgLow(U.B);};let d0=0,f0=f(0),d1=.03,f1=f(d1);
      for(let k=0;k<8&&Math.abs(f1)>2e-4;k++){const d2=Math.abs(f1-f0)<1e-8?d1:d1-f1*(d1-d0)/(f1-f0);d0=d1;f0=f1;d1=Math.max(-.9,Math.min(.9,d2));f1=f(d1);}body.rotation.x=x0+d1;}
    m.updateMatrixWorld(true);body.position.y+=P[1]-wgLow(U.A);
    times.push(t);for(const j of J){const q=U.J[j].quaternion;vals[j].push(q.x,q.y,q.z,q.w);}pos.push(body.position.x,body.position.y,body.position.z);}
  for(const j of J)U.J[j].rotation.set(0,0,0);body.position.copy(bp);m.updateMatrixWorld(true);
  const tracks=J.map(j=>new THREE.QuaternionKeyframeTrack(j+'.quaternion',times,vals[j]));tracks.push(new THREE.VectorKeyframeTrack('body.position',times,pos));
  const c=new THREE.AnimationClip(name,dur,tracks);c.loopMode=loop;return c;}

/* pose tools: blend two poses, eased segments, keep paws planted while the body shifts */
const wgMix=(a,b,k)=>{const p={};for(const key of new Set(Object.keys(a).concat(Object.keys(b)))){const x=a[key]||[0,0,0],y=b[key]||[0,0,0];p[key]=[0,1,2].map(i=>x[i]+(y[i]-x[i])*k);}return p;};
const wgAdd=(a,b)=>{const p=Object.assign({},a);for(const key in b){const x=p[key]||[0,0,0],y=b[key];p[key]=[0,1,2].map(i=>x[i]+y[i]);}return p;};
const wgSeg=(u,a,b)=>{const x=Math.max(0,Math.min(1,(u-a)/(b-a)));return x*x*(3-2*x);};
function wgPlant(p,dz){const a=Math.atan2(dz,1)*180/Math.PI;for(const k of['FL','FR','BL','BR'])p=wgAdd(p,{['leg_'+k]:[a,0,0],['paw_'+k]:[-a,0,0]});return p;}
/* gait: sine leg swing; while a foot swings forward the elbow / stifle and hock fold it up, in stance the paw stays flat */
function wgGait(u,ph,Af,Ab,f){const p={};for(const k in ph){const a=u+ph[k],s=S(a),sw=Math.max(0,-C(a));
  if(k[0]==='F'){p['leg_'+k]=[s*Af-sw*f.fu,0,0];p['knee_'+k]=[sw*f.fe,0,0];p['paw_'+k]=[-s*Af*(1-sw)+sw*f.fw,0,0];}
  else{p['leg_'+k]=[s*Ab,0,0];p['knee_'+k]=[sw*f.bk,0,0];p['hock_'+k]=[-sw*f.bh,0,0];p['paw_'+k]=[-s*Ab*(1-sw)+sw*f.bp,0,0];}}return p;}

function wargClips(m){
  const WAR={chest:[4,0,0],leg_FL:[-38,0,6],leg_FR:[-38,0,-6],knee_FL:[62,0,0],knee_FR:[62,0,0],paw_FL:[-24,0,0],paw_FR:[-24,0,0],
    leg_BL:[-24,0,5],leg_BR:[-24,0,-5],knee_BL:[40,0,0],knee_BR:[40,0,0],hock_BL:[-32,0,0],hock_BR:[-32,0,0],paw_BL:[16,0,0],paw_BR:[16,0,0],
    neck:[25,0,0],head:[-20,0,0],jaw:[10,0,0],ear_L:[-35,0,0],ear_R:[-35,0,0],tail:[-25,0,0],tail2:[-10,0,0]};
  const SIT={body:[-40,0,0],hips:[-8,0,0],leg_FL:[34,0,0],leg_FR:[34,0,0],knee_FL:[6,0,0],knee_FR:[6,0,0],
    leg_BL:[-10,0,14],leg_BR:[-10,0,-14],knee_BL:[137,0,0],knee_BR:[137,0,0],hock_BL:[-162,0,0],hock_BR:[-162,0,0],paw_BL:[90,0,0],paw_BR:[90,0,0],
    neck:[-10,0,0],head:[10,0,0],tail:[100,0,0],tail2:[5,0,0]};
  const LIE={leg_FL:[46,0,0],leg_FR:[46,0,0],knee_FL:[-136,0,0],knee_FR:[-136,0,0],paw_FL:[90,0,0],paw_FR:[90,0,0],
    leg_BL:[-50,0,16],leg_BR:[-50,0,-16],knee_BL:[122,0,0],knee_BR:[122,0,0],hock_BL:[-162,0,0],hock_BR:[-162,0,0],paw_BL:[90,0,0],paw_BR:[90,0,0],
    neck:[-5,0,0],head:[5,0,0],tail:[12,0,12],tail2:[36,0,8]};
  const W={BL:0,FL:.2,BR:.5,FR:.7},G={BL:0,BR:.1,FL:.42,FR:.52},wf={fu:8,fe:45,fw:60,bk:30,bh:40,bp:30};
  const idleHead=u=>({neck:[S(u)*3,S(u*.5)*8,0],head:[S(u+.2)*3,S(u)*6,0],jaw:[4+S(u*8)*2,0,0],ear_L:[S(u*2)*5,0,0],ear_R:[S(u*2+.3)*5,0,0],tail:[S(u)*3,S(u*2)*6,0],chest:[S(u*4)*.8,0,0]});
  const war=u=>wgAdd(WAR,{body:[0,0,S(u)*1.5],neck:[S(u*2)*2,S(u)*6,0],head:[0,-S(u)*4,0],jaw:[S(u*12)*2,0,0],tail2:[0,S(u*2)*4,0],chest:[S(u*4)*1,0,0]});
  const C1=[];const add=(name,dur,loop,fn,o)=>{const c=wgClip(m,name,dur,loop,fn,o);C1.push(c);return c;};
  add('Idle',4,true,u=>idleHead(u));
  add('Walk',1.2,true,u=>Object.assign(wgGait(u,W,18,20,wf),{chest:[0,S(u)*3,0],hips:[0,-S(u)*3,0],neck:[S(u*2)*3,-S(u)*3,0],head:[-S(u*2)*3,0,0],tail:[0,S(u)*8,0],tail2:[0,S(u+.1)*6,0],jaw:[4,0,0]})).speed=1;
  add('Run',.5,true,u=>{const fl=-S(u+.05);return Object.assign(wgGait(u,G,40,36,{fu:20,fe:75,fw:90,bk:50,bh:60,bp:40}),{chest:[fl*8,0,0],hips:[-fl*8,0,0],body:[S(u+.3)*4,0,0],
    neck:[18+S(u)*6,0,0],head:[-12-S(u)*5,0,0],jaw:[14,0,0],ear_L:[-40,0,0],ear_R:[-40,0,0],tail:[-45+S(u)*6,0,0],tail2:[-10,0,0],_pos:[0,Math.max(0,S(u+.62))*.12,0]});},{level:false}).speed=5;
  add('Sniff',3,true,u=>({neck:[50+S(u)*4,S(u*.5)*15,0],head:[28+S(u*8)*4,S(u)*10,0],jaw:[2,0,0],ear_L:[10,0,0],ear_R:[10,0,0],tail:[0,S(u*2)*8,0],leg_FL:[-6,0,0],paw_FL:[6,0,0]}));
  add('Sit',3,true,u=>wgAdd(SIT,{neck:[S(u)*3,S(u*.5)*10,0],head:[S(u+.2)*3,S(u)*6,0],jaw:[4+S(u*8)*2,0,0],ear_L:[S(u*2)*5,0,0],ear_R:[S(u*2+.3)*5,0,0]}));
  add('Lie down',4,true,u=>wgAdd(LIE,{neck:[S(u)*2,S(u*.5)*8,0],head:[S(u+.2)*2,S(u)*5,0],ear_L:[S(u*2)*4,0,0],ear_R:[S(u*2+.3)*4,0,0],tail2:[0,S(u)*6,0],chest:[S(u*3)*.8,0,0]}));
  /* howl: sits down, throws the head back, long howl with the jaw wide and trembling, then stands up again */
  add('Howl',5,false,u=>{const sit=wgSeg(u,0,.16)*(1-wgSeg(u,.86,1)),up=wgSeg(u,.16,.26)*(1-wgSeg(u,.76,.86)),voice=wgSeg(u,.24,.3)*(1-wgSeg(u,.72,.78)),w=Math.sin(u*Math.PI*14)*voice;
    return wgAdd(wgMix({},SIT,sit),{neck:[-50*up,0,0],head:[-38*up+w*1.5,0,0],jaw:[3+26*voice+w*3,0,0],ear_L:[-28*up,0,0],ear_R:[-28*up,0,0],chest:[-3*voice,0,0]});});
  add('Idle (war mode)',2.4,true,war);
  add('Stalk',1.6,true,u=>wgAdd(WAR,Object.assign(wgGait(u,W,14,16,{fu:6,fe:40,fw:55,bk:25,bh:35,bp:25}),{chest:[0,S(u)*3,0],hips:[0,-S(u)*3,0],neck:[S(u*2)*2,S(u)*3,0],jaw:[S(u*8)*2,0,0]}))).speed=.5;
  add('Growl',2,false,u=>{const k=wgSeg(u,0,.15)*(1-wgSeg(u,.8,1)),q=Math.sin(u*Math.PI*30)*k;
    return wgAdd(war(0),{neck:[8*k,0,0],head:[-10*k+q*1.5,q*1.5,0],jaw:[20*k+q*3,0,0],ear_L:[-15*k,0,0],ear_R:[-15*k,0,0],body:[0,0,q*.6],_pos:[0,0,.05*k]});});
  add('Bite',1.1,false,u=>{const back=wgSeg(u,0,.22)*(1-wgSeg(u,.22,.4)),lunge=wgSeg(u,.25,.42)*(1-wgSeg(u,.65,1)),open=wgSeg(u,.22,.36)*(1-wgSeg(u,.38,.45)),shake=Math.sin(wgSeg(u,.45,.66)*Math.PI*3)*(1-wgSeg(u,.62,.68));
    const dz=-.15*back+.4*lunge;return wgPlant(wgAdd(war(0),{neck:[12*back-22*lunge,0,0],head:[-8*back+18*lunge-14*open,shake*14,shake*6],jaw:[40*open-10*lunge*(1-open),0,0],chest:[-4*back+6*lunge,0,0],ear_L:[-10*lunge,0,0],ear_R:[-10*lunge,0,0],_pos:[0,0,dz]}),dz);});
  /* pounce: crouches, leaps about 1 m forward with the forelegs reaching and the jaw open, lands, backs off */
  add('Pounce',1.8,false,u=>{const cr=wgSeg(u,0,.2)*(1-wgSeg(u,.26,.32)),air=wgSeg(u,.3,.36)*(1-wgSeg(u,.56,.62)),land=wgSeg(u,.6,.66)*(1-wgSeg(u,.72,.9)),fly=Math.max(0,Math.min(1,(u-.3)/.32)),
      dz=-.15*cr+(.95*wgSeg(u,.28,.62))*(1-wgSeg(u,.7,1)),lift=Math.sin(fly*Math.PI)*.55;
    let p=wgAdd(war(0),{leg_BL:[-20*cr+40*air,0,0],leg_BR:[-20*cr+42*air,0,0],knee_BL:[30*cr-20*air,0,0],knee_BR:[30*cr-20*air,0,0],hock_BL:[-30*cr+15*air,0,0],hock_BR:[-30*cr+15*air,0,0],paw_BL:[20*cr+30*air,0,0],paw_BR:[20*cr+30*air,0,0],
      leg_FL:[15*cr-60*air+10*land,0,0],leg_FR:[15*cr-55*air+10*land,0,0],knee_FL:[15*cr-30*air+25*land,0,0],knee_FR:[15*cr-30*air+25*land,0,0],paw_FL:[-10*cr+50*air-20*land,0,0],paw_FR:[-10*cr+50*air-20*land,0,0],
      chest:[6*cr-10*air+8*land,0,0],neck:[10*cr-15*air,0,0],head:[-10*cr+10*air,0,0],jaw:[35*air+10*land,0,0],ear_L:[-10*air,0,0],ear_R:[-10*air,0,0],tail:[-20*air,0,0],body:[-12*air+6*land,0,0],_pos:[0,lift,dz]});
    return u>.62?wgPlant(p,dz-.95):p;},{level:u=>u<.3||u>.64});
  /* claw swipe: rears the forequarters, the right foreleg rakes down and across from the outside in */
  add('Claw swipe',1.3,false,u=>{const up=wgSeg(u,0,.25)*(1-wgSeg(u,.65,.95)),sw=wgSeg(u,.28,.48),dn=1-wgSeg(u,.6,.9);
    return wgAdd(war(0),{body:[-16*up,0,0],chest:[-4*up,0,0],leg_FR:[(-85+70*sw)*up*dn+15*(1-dn),0,(-28+50*sw)*up],knee_FR:[(-30+90*sw)*up,0,0],paw_FR:[(60-30*sw)*up,0,0],
      leg_FL:[20*up,0,0],knee_FL:[-25*up,0,0],paw_FL:[5*up,0,0],leg_BL:[12*up,0,0],leg_BR:[12*up,0,0],knee_BL:[-10*up,0,0],knee_BR:[-10*up,0,0],
      neck:[-8*up+10*sw*up,0,0],head:[0,(-12+24*sw)*up,0],jaw:[22*up,0,0],hips:[4*up,(-8+16*sw)*up,0],_pos:[0,0,.12*sw*up]});},{level:false});
  add('Hit',.7,false,u=>{const k=u<.08?wgSeg(u,0,.08):1-wgSeg(u,.25,1),dz=-.14*k;
    return wgPlant(wgAdd(war(0),{neck:[-22*k,-10*k,0],head:[-18*k,-22*k,8*k],jaw:[22*k,0,0],ear_L:[-25*k,0,0],ear_R:[-25*k,0,0],chest:[-5*k,0,0],tail:[20*k,0,0],_pos:[0,0,dz]}),dz);});
  /* death: rears back from the blow, forelegs buckle, rolls onto the right side; legs go limp, jaw slack */
  add('Death',2.8,false,u=>{const hit=wgSeg(u,0,.1)*(1-wgSeg(u,.15,.35)),buck=wgSeg(u,.15,.42),roll=wgSeg(u,.38,.7),settle=wgSeg(u,.7,.85),bob=Math.sin(wgSeg(u,.68,.8)*Math.PI)*.04;
    const p=wgMix(war(0),{},buck);return wgAdd(p,{neck:[-20*hit+30*buck*(1-roll)-25*roll,0,32*roll],head:[-15*hit+10*buck,0,18*roll],jaw:[18*hit+22*settle,0,0],
      leg_FL:[40*buck*(1-roll)-25*roll,0,-20*roll],leg_FR:[40*buck*(1-roll)-15*roll,0,-12*roll],knee_FL:[-90*buck*(1-roll)+20*roll,0,0],knee_FR:[-90*buck*(1-roll)+15*roll,0,0],paw_FL:[20*buck*(1-roll),0,0],paw_FR:[20*buck*(1-roll),0,0],
      leg_BL:[-20*buck+40*roll,0,-25*roll],leg_BR:[-10*buck+28*roll,0,-12*roll],knee_BL:[40*buck*(1-roll)+15*roll,0,0],knee_BR:[40*buck*(1-roll)+10*roll,0,0],hock_BL:[-30*buck*(1-roll)-15*roll,0,0],hock_BR:[-30*buck*(1-roll)-10*roll,0,0],
      body:[0,0,88*roll],ear_L:[25*settle,0,0],ear_R:[25*settle,0,0],tail:[25*roll,0,20*roll],tail2:[0,0,10*roll],_pos:[0,bob,-.1*hit]});});
  return C1;}


ASSETS.push({id:'warg',folder:'characters/enemies/brutes',name:'Warg',kind:'character',variants:true,defaultSeed:1,groundR:2.4,build:(s,o)=>buildWarg(s,o||{}),
  opts:[{key:'coat',label:'Coat',choices:[['random','Random'],...Object.entries(WG_COAT).map(([k,v])=>[k,v[1]])],def:'random'},
    {key:'pattern',label:'Markings',choices:[['random','Random'],['none','None'],['spots','Spots'],['stripes','Stripes'],['saddle','Dark saddle']],def:'random'},
    {key:'mane',label:'Mane',choices:[['random','Random'],['ridge','Crest'],['shaggy','Shaggy']],def:'random'},
    {key:'ears',label:'Ears',choices:[['random','Random'],['pointed','Pointed'],['round','Round'],['torn','Torn']],def:'random'},
    {key:'eyes',label:'Eyes',choices:Object.entries(WG_EYE).map(([k,v])=>[k,v[1]]),def:'yellow'},
    {key:'scars',label:'Scars',choices:[['random','Random'],['yes','Yes'],['no','No']],def:'random'},
    {key:'gear',label:'Gear',choices:[['none','None'],['collar','Spiked collar'],['saddle','Collar and saddle']],def:'none'}],
  desc:'Huge hyena-like wolf, about 1.6 m at the withers: sloping back, heavy head with fangs and glowing eyes, mane, bushy tail. Coat, markings (spots, stripes, dark saddle), mane, ears, eyes, scars, and a spiked collar or a rider saddle. Idle, walk, run, sniff, sit, lie down, howl, war-mode idle, stalk, growl, bite, pounce, claw swipe, hit and death.'});
