/* ======================= HELLHOUND: hunched fire-gutted hound of Hell =======================
   The warg's quadruped rig and clip sampler (wgClip, wargClips) on a new body after the owner's reference: a massive chest and
   shoulder hump, the back falling steeply to a small rump and thin hind legs, a huge low-slung head with big jaws full of fangs,
   shaggy dark fur, fire glowing through the throat, chest and belly and inside the mouth, a thin rat-like tail. Fronts face +z. */
const HH_FUR={blueblack:['#292936','Blue-black'],charcoal:['#2d2a2a','Charcoal'],dkbrown:['#322823','Dark brown'],ashgrey:['#4a4546','Ash grey']};
const HH_GLOW={red:['#dc664b','Ember red'],orange:['#ed964e','Fire orange'],green:['#bded9b','Hellfire green'],blue:['#6fb3dd','Blue flame']};
const HHM={};
/* leg layout shared by the builder and the gait IK (body-frame y,z; angles in radians): shoulder/hip pivots, rest angles, bone lengths, sole depth below the paw joint */
const HHL={fk:1.1,bk:.95,bdy:.03,F:{o:.3,p:[-.12,.45],r1:.15,r2:-.15,a:.36,b:.42},B:{o:-.3,p:[-.06,-.25],rt:-.35,rk:.75,rh:-.4,a:.32,b:.29,c:.21}};
HHL.F.sole=.157*HHL.fk;HHL.B.sole=.157*HHL.bk-HHL.bdy;
function hhGlow(hex,k=1){const key=hex+k;return HHM[key]||(HHM[key]=new THREE.MeshStandardMaterial({color:new THREE.Color(hex).convertSRGBToLinear(),emissive:new THREE.Color(hex).convertSRGBToLinear(),emissiveIntensity:k,roughness:.6}));}

function buildHellhound(seed,o={}){const r=mulberry32(((seed*2654435761)>>>0)^0x4e11),pick=a=>a[Math.floor(r()*a.length)],opt=(k,list)=>o[k]&&o[k]!=='random'?o[k]:pick(list);
  const fk=opt('fur',Object.keys(HH_FUR)),gk=opt('glow',Object.keys(HH_GLOW)),maneK=opt('mane',['shaggy','short']),scars=opt('scars',['yes','no'])==='yes',gear=o.gear||'none',
    fur=HH_FUR[fk][0],glow=HH_GLOW[gk][0],shag=maneK==='shaggy';
  const cM=cm('hair',fur),dM=cm('hair',darker(fur,.6)),sM=cm('hair','#'+new THREE.Color(fur).lerp(new THREE.Color('#7b7b89'),.18).getHexString()),
    eyeM=hhGlow(glow,1.6),hotM=hhGlow(glow,.9),skinM=hhGlow(darker(glow,.5),.55),inM=hhGlow(darker(glow,.65),.8),
    claw=bm('#131013','plain'),nail=bm('#39322e','plain'),pad=bm('#1a1618','plain'),ivory=bm('#d9d0b5','plain'),gum=bm('#4f2d2c','skin'),nose=bm('#131013','plain'),scarM=bm('#695453','skin'),
    leather=bm('#37251f','leather'),iron=vm('iron');
  const root=new THREE.Group();root.userData.lights=[];root.userData.animal='hellhound';
  const body=new THREE.Group();body.name='body';body.userData.joint=true;body.position.set(0,.85,0);root.add(body);
  const chest=aJ(body,'chest',0,0,.3),hips=aJ(body,'hips',0,0,-.3);
  /* front half: deep, wide ribcage under a big shoulder hump; fire glows through the brisket and belly */
  bx(chest,.66,.78,.72,cM,0,0,.3);bx(chest,.56,.2,.52,cM,0,.48,.32);bx(chest,.52,.6,.4,cM,0,.06,-.18);
  bx(chest,.44,.16,.02,skinM,0,.0,.665);bx(chest,.34,.16,.02,skinM,0,-.16,.665);bx(chest,.2,.12,.02,skinM,0,-.3,.665);bx(chest,.2,.14,.022,hotM,0,-.06,.668);bx(chest,.12,.14,.022,hotM,0,-.2,.668);
  for(const s of[-1,1]){bx(chest,.08,.3,.04,dM,s*.25,-.08,.675,0,0,s*.15);bx(chest,.06,.16,.04,sM,s*.15,.08,.675);}bx(chest,.44,.02,.6,skinM,0,-.391,.3);bx(chest,.3,.02,.36,hotM,0,-.392,.36);bx(chest,.34,.02,.36,skinM,0,-.241,-.16);
  for(const s of[-1,1]){bx(chest,.04,.1,.56,dM,s*.3,-.43,.32);bx(chest,.04,.08,.3,dM,s*.24,-.27,-.16);}
  /* hind half: small rump and loin, well below the hump */
  bx(hips,.42,.4,.32,cM,0,.1,.2);bx(hips,.42,.4,.4,cM,0,.02,-.12);bx(hips,.3,.02,.3,skinM,0,-.091,.2);
  /* mane: shaggy tufts along the hump and down the neck, or a short ridge */
  const tuft=(par,x,y,z,w,h,d,rx)=>bx(par,w,h,d,r()<.5?dM:sM,x,y,z,rx,0,0);
  if(shag){for(let i=0;i<6;i++)tuft(chest,(r()-.5)*.24,.6+r()*.05,.5-i*.1,.14+r()*.1,.12+r()*.06,.12,-.5);for(const s of[-1,1])for(let i=0;i<4;i++)tuft(chest,s*(.29+r()*.02),.36-r()*.06,.55-i*.12,.06,.16+r()*.06,.12,-.3);
    for(let i=0;i<3;i++)tuft(chest,(r()-.5)*.16,.4-i*.05,-.05-i*.1,.14,.08,.12,-.5);}
  else bx(chest,.24,.06,.5,dM,0,.6,.3);
  /* legs (the warg's joints): heavy shoulders and forearms, big paws with long hooked claws; thin hind legs */
  /* rottweiler-like paws: thick pastern, broad compact foot, four heavy toes with knuckles, short dark nails, a dark pad underneath; k scales, dy shifts */
  const paw=(p,k,dy)=>{const B=(w,h,d,m,x,y,z,rx)=>bx(p,w*k,h*k,d*k,m,x*k,y*k+dy,z*k,rx);B(.15,.12,.15,cM,0,-.04,0);B(.2,.06,.16,cM,0,-.125,-.005);B(.19,.008,.2,pad,0,-.153,.04);
    for(const[x,z]of[[-.085,.085],[-.03,.1],[.03,.1],[.085,.085]]){B(.052,.08,.09,cM,x,-.115,z);B(.04,.03,.07,cM,x,-.062,z-.005);B(.04,.05,.02,cM,x,-.11,z+.053);B(.024,.045,.03,nail,x,-.13,z+.068,.5);}};
  for(const[k,s]of[['FL',1],['FR',-1]]){const up=aJ(chest,'leg_'+k,s*.28,-.12,.45,[.15,0,0]);bx(up,.2,.36,.32,cM,0,0,0);bx(up,.18,.34,.22,cM,0,-.2,0);if(shag)bx(up,.12,.16,.08,dM,0,-.3,-.13);
    const kn=aJ(up,'knee_'+k,0,-.36,0,[-.15,0,0]);bx(kn,.15,.42,.16,cM,0,-.2,0);bx(kn,.1,.14,.06,dM,0,-.04,-.1);
    const pw=aJ(kn,'paw_'+k,0,-.42,0);paw(pw,HHL.fk,0);}
  for(const[k,s]of[['BL',1],['BR',-1]]){const up=aJ(hips,'leg_'+k,s*.17,-.06,-.25,[-.35,0,0]);bx(up,.17,.2,.28,cM,0,0,0);bx(up,.15,.36,.22,cM,0,-.15,.02);
    const kn=aJ(up,'knee_'+k,0,-.32,0,[.75,0,0]);bx(kn,.11,.32,.12,cM,0,-.14,0);
    const hk2=aJ(kn,'hock_'+k,0,-.29,0,[-.4,0,0]);bx(hk2,.09,.24,.1,cM,0,-.1,0);
    const pw=aJ(hk2,'paw_'+k,0,-.21,0);paw(pw,HHL.bk,HHL.bdy);}
  /* neck: thick, carried forward and low; the throat glows */
  const neck=aJ(chest,'neck',0,.16,.6,[1.25,0,0]);bx(neck,.46,.42,.46,cM,0,.08,0);bx(neck,.4,.36,.4,cM,0,.3,0);
  bx(neck,.28,.42,.02,skinM,0,.2,.211);bx(neck,.14,.3,.022,hotM,0,.2,.212);
  if(shag){bx(neck,.36,.5,.1,dM,0,.2,-.24);for(let i=0;i<4;i++)tuft(neck,(r()-.5)*.2,.05+i*.12,-.3,.16,.1,.1,-1.2);for(const s of[-1,1])bx(neck,.08,.36,.36,sM,s*.24,.12,-.02);}
  else bx(neck,.14,.46,.08,dM,0,.2,-.22);
  /* head: big and broad, heavy brow over small glowing eyes, short muzzle, huge jaw, rows of fangs, the mouth glows inside */
  const head=aJ(neck,'head',0,.46,.02,[-1.35,0,0]);
  bx(head,.46,.36,.4,cM,0,.1,0);bx(head,.56,.22,.3,cM,0,-.02,.02);bx(head,.48,.08,.1,dM,0,.24,.2);
  bx(head,.3,.18,.34,cM,0,.04,.36);bx(head,.24,.04,.3,dM,0,.14,.36);bx(head,.16,.08,.06,nose,0,.1,.54);
  bx(head,.24,.012,.32,inM,0,-.051,.34);bx(head,.26,.02,.3,gum,0,-.055,.36);
  for(const s of[-1,1]){bx(head,.06,.04,.04,eyeM,s*.2,.15,.2);bx(head,.1,.03,.03,dM,s*.19,.19,.215,0,0,s*.35);
    bx(head,.045,.13,.045,ivory,s*.105,-.12,.48);for(const[z,h]of[[.25,.05],[.33,.07],[.41,.05]])bx(head,.03,h,.03,ivory,s*.13,-.06-h/2,z);for(const x of[.03,.065])bx(head,.025,.04,.025,ivory,s*x,-.075,.515);}
  const jaw=aJ(head,'jaw',0,-.1,.06);bx(jaw,.3,.1,.46,cM,0,-.05,.22);bx(jaw,.44,.14,.2,cM,0,-.06,.02);bx(jaw,.22,.06,.04,cM,0,-.07,.43);
  bx(jaw,.2,.012,.36,inM,0,.006,.22);bx(jaw,.24,.015,.4,gum,0,.003,.22);
  for(const s of[-1,1]){bx(jaw,.045,.1,.045,ivory,s*.16,.05,.4);for(const[z,h]of[[.17,.05],[.25,.06],[.32,.05]])bx(jaw,.03,h,.03,ivory,s*.12,h/2,z);for(const x of[.03,.065])bx(jaw,.025,.035,.025,ivory,s*x,.017,.43);}
  for(const s of[-1,1]){const ear=aJ(head,'ear_'+(s>0?'L':'R'),s*.18,.27,-.1,[-.6,0,-s*.35]);bx(ear,.13,.1,.05,cM,0,.05,0);bx(ear,.09,.06,.05,cM,0,.12,0);bx(ear,.08,.08,.01,skinM,0,.07,.026);}
  if(shag)for(const s of[-1,1])bx(head,.06,.2,.24,dM,s*.29,-.02,-.02);
  /* tail: long, thin and nearly bare, carried up and back (never tucked) */
  const tail=aJ(hips,'tail',0,.12,-.32,[1.75,0,0]);bx(tail,.08,.42,.08,cM,0,-.19,0);const t2=aJ(tail,'tail2',0,-.4,0,[-.45,0,0]);
  bx(t2,.055,.36,.055,cM,0,-.17,0);bx(t2,.035,.16,.035,dM,0,-.42,0);
  /* scars: pale claw marks over the left eye and across the right shoulder */
  if(scars){bx(head,.015,.14,.02,scarM,.17,.17,.205,0,0,-.4);for(let i=0;i<3;i++)bx(chest,.012,.3,.025,scarM,-.331,.12,.3+i*.07,.5,0,0);}
  /* gear: spiked iron collar */
  if(gear==='collar'){bx(neck,.5,.08,.5,leather,0,.3,0);for(const[x,z]of[[.25,0],[-.25,0],[0,.25],[0,-.25],[.18,.18],[-.18,.18],[.18,-.18],[-.18,-.18]]){const g=new THREE.Group();g.position.set(x,.3,z);g.rotation.y=Math.atan2(x,z);neck.add(g);bx(g,.04,.04,.06,iron,0,0,.03);}
    bx(neck,.08,.08,.025,iron,0,.24,.26);}
  /* contact points (the warg's sampler grounds every frame on these) */
  const pts=par=>{const L=[];par.traverse(q=>{if(!q.isMesh)return;q.geometry.computeBoundingBox();const b=q.geometry.boundingBox,c=[];for(const x of[b.min.x,b.max.x])for(const y of[b.min.y,b.max.y])for(const z of[b.min.z,b.max.z])c.push(new THREE.Vector3(x,y,z));L.push([q,c]);});return L;};
  const U={F:pts(chest),B:pts(hips),J:{},fps:60};U.A=U.F.concat(U.B);root.userData.wg=U;
  root.userData.ajoints=['body','chest','hips','neck','head','jaw','ear_L','ear_R','tail','tail2','leg_FL','knee_FL','paw_FL','leg_FR','knee_FR','paw_FR','leg_BL','knee_BL','hock_BL','paw_BL','leg_BR','knee_BR','hock_BR','paw_BR'];
  for(const n of root.userData.ajoints)U.J[n]=n==='body'?body:root.getObjectByName(n);
  root.updateMatrixWorld(true);body.position.y-=wgLow(U.A);U.bp=body.position.clone();
  const joints=[];root.traverse(q=>{if(q.userData.joint)joints.push(q);});root.userData.joints=joints;
  const key=maneK+gear;root.userData.clips=HHCLIPS[key]||(HHCLIPS[key]=hellhoundClips(root));root.userData.ground=2;root.userData.look={fur:fk,glow:gk,mane:maneK,scars};return root;}

const HHCLIPS={};
/* gait IK: paws follow a flat stance line and a lifted swing arc; each leg is solved in the body's side plane so the paw lands flat and
   stays planted, and the body keeps an even height (no pendulum bob). o: stride time T, speed v, stance share beta, lift, phases,
   slack (share of the leg length used at the neutral stance, sets the crouch), flex (paw fold in swing, degrees), extra(u) (other joints; pitch, drop, lift), L (leg layout, default HHL) */
function hhGaitFn(o){const F=(o.L||HHL).F,B=(o.L||HHL).B,D=180/Math.PI,R=(th,y,z)=>[y*Math.cos(th)-z*Math.sin(th),y*Math.sin(th)+z*Math.cos(th)],dir=f=>[-Math.cos(f),-Math.sin(f)],ang=(y,z)=>Math.atan2(-z,-y);
  const two=(P,T,a,b,sg)=>{const dy=T[0]-P[0],dz=T[1]-P[1],d=Math.min(Math.hypot(dy,dz),(a+b)*.999),c=Math.max(-1,Math.min(1,(a*a+d*d-b*b)/(2*a*d))),f1=ang(dy,dz)+sg*Math.acos(c),e=dir(f1),E=[P[0]+a*e[0],P[1]+a*e[1]];return[f1,ang(T[0]-E[0],T[1]-E[1])];};
  const pivots=(th,c,h)=>{const cf=R(th,0,F.o),pf=R(th+c,...F.p),cb=R(th,0,B.o),pb=R(th+h,...B.p);return[[cf[0]+pf[0],cf[1]+pf[1]],[cb[0]+pb[0],cb[1]+pb[1]]];};
  /* body pitch and height so that the front and the hind legs both stand at the requested slack */
  const fit=sl=>{let best=null;for(let th=-.3;th<=.15;th+=.0025){const[S,Hp]=pivots(th,0,0),H=-S[0]+F.sole+sl*(F.a+F.b),hy=-H+B.sole+B.c,e=Math.abs(Math.abs(hy-Hp[0])/(B.a+B.b)-sl);if(!best||e<best.e)best={e,th,H};}return best;};
  const base=fit(o.slack),P0=pivots(base.th,0,0);
  return u=>{const x=o.extra?o.extra(u):{},c=(x.chest||[0])[0]/D,h=(x.hips||[0])[0]/D,th=base.th+(x.pitch||0)/D,H=base.H-(x.drop||0),[S,Hp]=pivots(th,c,h),p={},lifts=[];
    for(const k in o.ph){const ph=((u+o.ph[k])%1+1)%1,st=ph<o.beta,q=st?ph/o.beta:(ph-o.beta)/(1-o.beta),E=o.v*o.beta*o.T,sm=q*q*(3-2*q),
      dz=st?E/2-E*q:-E/2+E*sm,ly=st?0:o.lift*Math.sin(Math.PI*q),sw=st?0:Math.sin(Math.PI*q);lifts.push(ly);
      if(k[0]==='F'){const W=[-H+ly+F.sole,P0[0][1]+.02+dz],[f1,f2]=two(S,W,F.a,F.b,1);
        p['leg_'+k]=[(f1-th-c-F.r1)*D,0,0];p['knee_'+k]=[(f2-f1-F.r2)*D,0,0];p['paw_'+k]=[-f2*D+o.flex[0]*sw*sw,0,0];}
      else{const fc=st?-.12+.3*q:.18-.3*sm+.5*sw,P=[-H+ly+B.sole,P0[1][1]+.02+dz],dc=dir(fc),K=[P[0]-B.c*dc[0],P[1]-B.c*dc[1]],[ft,fs]=two(Hp,K,B.a,B.b,-1);
        p['leg_'+k]=[(ft-th-h-B.rt)*D,0,0];p['knee_'+k]=[(fs-ft-B.rk)*D,0,0];p['hock_'+k]=[(fc-fs-B.rh)*D,0,0];p['paw_'+k]=[-fc*D+o.flex[1]*sw*sw,0,0];}}
    Object.assign(p,x);const lf=x.lift||0;delete p.pitch;delete p.drop;delete p.lift;p.body=[th*D,0,0];p._pos=[0,Math.min(...lifts)+lf,0];return p;};}

function hellhoundClips(m){
  /* poses; the tail is carried up and back at rest, these are offsets from that */
  const WAR={chest:[4,0,0],leg_FL:[-38,0,6],leg_FR:[-38,0,-6],knee_FL:[62,0,0],knee_FR:[62,0,0],paw_FL:[-24,0,0],paw_FR:[-24,0,0],
    leg_BL:[-24,0,5],leg_BR:[-24,0,-5],knee_BL:[40,0,0],knee_BR:[40,0,0],hock_BL:[-32,0,0],hock_BR:[-32,0,0],paw_BL:[16,0,0],paw_BR:[16,0,0],
    neck:[25,0,0],head:[-20,0,0],jaw:[10,0,0],ear_L:[-35,0,0],ear_R:[-35,0,0],tail:[12,0,0],tail2:[-8,0,0]};
  const SIT={body:[-40,0,0],hips:[-8,0,0],leg_FL:[34,0,0],leg_FR:[34,0,0],knee_FL:[6,0,0],knee_FR:[6,0,0],
    leg_BL:[-10,0,14],leg_BR:[-10,0,-14],knee_BL:[137,0,0],knee_BR:[137,0,0],hock_BL:[-162,0,0],hock_BR:[-162,0,0],paw_BL:[90,0,0],paw_BR:[90,0,0],
    neck:[-10,0,0],head:[10,0,0],tail:[30,25,0],tail2:[40,0,0]};
  const LIE={leg_FL:[46,0,0],leg_FR:[46,0,0],knee_FL:[-136,0,0],knee_FR:[-136,0,0],paw_FL:[90,0,0],paw_FR:[90,0,0],
    leg_BL:[-50,0,16],leg_BR:[-50,0,-16],knee_BL:[122,0,0],knee_BR:[122,0,0],hock_BL:[-162,0,0],hock_BR:[-162,0,0],paw_BL:[90,0,0],paw_BR:[90,0,0],
    neck:[-5,0,0],head:[5,0,0],tail:[-45,15,0],tail2:[30,0,0]};
  const idleHead=u=>({neck:[S(u)*3,S(u*.5)*8,0],head:[S(u+.2)*3,S(u)*6,0],jaw:[4+S(u*8)*2,0,0],ear_L:[S(u*2)*5,0,0],ear_R:[S(u*2+.3)*5,0,0],tail:[S(u)*3,S(u*2)*6,0],chest:[S(u*4)*.8,0,0]});
  const war=u=>wgAdd(WAR,{body:[0,0,S(u)*1.5],neck:[S(u*2)*2,S(u)*6,0],head:[0,-S(u)*4,0],jaw:[S(u*12)*2,0,0],tail2:[0,S(u*2)*4,0],chest:[S(u*4)*1,0,0]});
  const C1=[];const add=(name,dur,loop,fn,o)=>{const c=wgClip(m,name,dur,loop,fn,o);C1.push(c);return c;};
  add('Idle',4,true,u=>idleHead(u));
  /* walk: lateral sequence; run: rotary gallop with a short suspension; stalk (below): low crouch, head down */
  add('Walk',1.1,true,hhGaitFn({T:1.1,v:.85,beta:.62,lift:.17,slack:.93,flex:[40,15],ph:{BL:0,FL:.25,BR:.5,FR:.75},
    extra:u=>({chest:[0,S(u)*3,0],hips:[0,-S(u)*3,0],neck:[S(u*2)*2,-S(u)*3,0],head:[-S(u*2)*2,0,0],tail:[S(u*2)*2,S(u)*7,0],tail2:[0,S(u+.1)*6,0],jaw:[4,0,0]})}),{level:false}).speed=.85;
  add('Run',.5,true,hhGaitFn({T:.5,v:4.5,beta:.32,lift:.24,slack:.88,flex:[60,15],ph:{BL:0,BR:.08,FL:.45,FR:.53},
    extra:u=>{const fl=S(u+.05);return{chest:[fl*5,0,0],hips:[-fl*5,0,0],pitch:S(u+.3)*2,neck:[14+S(u*2)*3,0,0],head:[-10-S(u*2)*3,0,0],jaw:[14,0,0],ear_L:[-40,0,0],ear_R:[-40,0,0],tail:[-12+S(u)*4,0,0],tail2:[10,0,0]};}}),{level:false}).speed=4.5;
  add('Sniff',3,true,u=>({neck:[50+S(u)*4,S(u*.5)*15,0],head:[28+S(u*8)*4,S(u)*10,0],jaw:[2,0,0],ear_L:[10,0,0],ear_R:[10,0,0],tail:[0,S(u*2)*8,0],leg_FL:[-6,0,0],paw_FL:[6,0,0]}));
  add('Sit',3,true,u=>wgAdd(SIT,{neck:[S(u)*3,S(u*.5)*10,0],head:[S(u+.2)*3,S(u)*6,0],jaw:[4+S(u*8)*2,0,0],ear_L:[S(u*2)*5,0,0],ear_R:[S(u*2+.3)*5,0,0]}));
  add('Lie down',4,true,u=>wgAdd(LIE,{neck:[S(u)*2,S(u*.5)*8,0],head:[S(u+.2)*2,S(u)*5,0],ear_L:[S(u*2)*4,0,0],ear_R:[S(u*2+.3)*4,0,0],tail2:[0,S(u)*6,0],chest:[S(u*3)*.8,0,0]}));
  add('Howl',5,false,u=>{const sit=wgSeg(u,0,.16)*(1-wgSeg(u,.86,1)),up=wgSeg(u,.16,.26)*(1-wgSeg(u,.76,.86)),voice=wgSeg(u,.24,.3)*(1-wgSeg(u,.72,.78)),w=Math.sin(u*Math.PI*14)*voice;
    return wgAdd(wgMix({},SIT,sit),{neck:[-50*up,0,0],head:[-38*up+w*1.5,0,0],jaw:[3+26*voice+w*3,0,0],ear_L:[-28*up,0,0],ear_R:[-28*up,0,0],chest:[-3*voice,0,0]});});
  add('Idle (war mode)',2.4,true,war);
  add('Stalk',1.6,true,hhGaitFn({T:1.6,v:.5,beta:.7,lift:.14,slack:.8,flex:[30,10],ph:{BL:0,FL:.25,BR:.5,FR:.75},
    extra:u=>({chest:[4,S(u)*3,0],hips:[0,-S(u)*3,0],neck:[25+S(u*2)*2,S(u)*3,0],head:[-20,0,0],jaw:[10+S(u*4)*2,0,0],ear_L:[-35,0,0],ear_R:[-35,0,0],tail:[12,S(u)*4,0],tail2:[-8,0,0]})}),{level:false}).speed=.5;
  add('Growl',2,false,u=>{const k=wgSeg(u,0,.15)*(1-wgSeg(u,.8,1)),q=Math.sin(u*Math.PI*30)*k;
    return wgAdd(war(0),{neck:[8*k,0,0],head:[-10*k+q*1.5,q*1.5,0],jaw:[20*k+q*3,0,0],ear_L:[-15*k,0,0],ear_R:[-15*k,0,0],body:[0,0,q*.6],_pos:[0,0,.05*k]});});
  add('Bite',1.1,false,u=>{const back=wgSeg(u,0,.22)*(1-wgSeg(u,.22,.4)),lunge=wgSeg(u,.25,.42)*(1-wgSeg(u,.65,1)),open=wgSeg(u,.22,.36)*(1-wgSeg(u,.38,.45)),shake=Math.sin(wgSeg(u,.45,.66)*Math.PI*3)*(1-wgSeg(u,.62,.68));
    const dz=-.15*back+.4*lunge;return wgPlant(wgAdd(war(0),{neck:[12*back-22*lunge,0,0],head:[-8*back+18*lunge-14*open,shake*14,shake*6],jaw:[40*open-10*lunge*(1-open),0,0],chest:[-4*back+6*lunge,0,0],ear_L:[-10*lunge,0,0],ear_R:[-10*lunge,0,0],_pos:[0,0,dz]}),dz);});
  add('Pounce',1.8,false,u=>{const cr=wgSeg(u,0,.2)*(1-wgSeg(u,.26,.32)),air=wgSeg(u,.3,.36)*(1-wgSeg(u,.56,.62)),land=wgSeg(u,.6,.66)*(1-wgSeg(u,.72,.9)),fly=Math.max(0,Math.min(1,(u-.3)/.32)),
      dz=-.15*cr+(.95*wgSeg(u,.28,.62))*(1-wgSeg(u,.7,1)),lift=Math.sin(fly*Math.PI)*.55;
    let p=wgAdd(war(0),{leg_BL:[-20*cr+40*air,0,0],leg_BR:[-20*cr+42*air,0,0],knee_BL:[30*cr-20*air,0,0],knee_BR:[30*cr-20*air,0,0],hock_BL:[-30*cr+15*air,0,0],hock_BR:[-30*cr+15*air,0,0],paw_BL:[20*cr+30*air,0,0],paw_BR:[20*cr+30*air,0,0],
      leg_FL:[15*cr-60*air+10*land,0,0],leg_FR:[15*cr-55*air+10*land,0,0],knee_FL:[15*cr-30*air+25*land,0,0],knee_FR:[15*cr-30*air+25*land,0,0],paw_FL:[-10*cr+50*air-20*land,0,0],paw_FR:[-10*cr+50*air-20*land,0,0],
      chest:[6*cr-10*air+8*land,0,0],neck:[10*cr-15*air,0,0],head:[-10*cr+10*air,0,0],jaw:[35*air+10*land,0,0],ear_L:[-10*air,0,0],ear_R:[-10*air,0,0],tail:[-20*air,0,0],body:[-12*air+6*land,0,0],_pos:[0,lift,dz]});
    return u>.62?wgPlant(p,dz-.95):p;},{level:u=>u<.3||u>.64});
  add('Claw swipe',1.3,false,u=>{const up=wgSeg(u,0,.25)*(1-wgSeg(u,.65,.95)),sw=wgSeg(u,.28,.48),dn=1-wgSeg(u,.6,.9);
    return wgAdd(war(0),{body:[-16*up,0,0],chest:[-4*up,0,0],leg_FR:[(-85+70*sw)*up*dn+15*(1-dn),0,(-28+50*sw)*up],knee_FR:[(-30+90*sw)*up,0,0],paw_FR:[(60-30*sw)*up,0,0],
      leg_FL:[20*up,0,0],knee_FL:[-25*up,0,0],paw_FL:[5*up,0,0],leg_BL:[12*up,0,0],leg_BR:[12*up,0,0],knee_BL:[-10*up,0,0],knee_BR:[-10*up,0,0],
      neck:[-8*up+10*sw*up,0,0],head:[0,(-12+24*sw)*up,0],jaw:[22*up,0,0],hips:[4*up,(-8+16*sw)*up,0],_pos:[0,0,.12*sw*up]});},{level:false});
  /* fire breath: draws a breath with the head raised, then thrusts the head forward and low, jaw wide, sweeping left to right
     (the fire itself is left to a separate effect; the mouth glows) */
  add('Fire breath',2.8,false,u=>{const inh=wgSeg(u,0,.25)*(1-wgSeg(u,.28,.36)),br=wgSeg(u,.28,.36)*(1-wgSeg(u,.8,.95)),sw=Math.sin(wgSeg(u,.36,.8)*Math.PI*2)*br,q=Math.sin(u*Math.PI*40)*br,dz=-.1*inh+.06*br;
    return wgPlant(wgAdd(WAR,{chest:[-8*inh+4*br,0,0],neck:[-30*inh+8*br,-10*sw,0],head:[-14*inh-12*br+q,-18*sw,0],jaw:[6*inh+38*br+q*2,0,0],ear_L:[-15*br,0,0],ear_R:[-15*br,0,0],tail:[10*br,0,0],_pos:[0,0,dz]}),dz);});
  add('Hit',.7,false,u=>{const k=u<.08?wgSeg(u,0,.08):1-wgSeg(u,.25,1),dz=-.14*k;
    return wgPlant(wgAdd(war(0),{neck:[-22*k,-10*k,0],head:[-18*k,-22*k,8*k],jaw:[22*k,0,0],ear_L:[-25*k,0,0],ear_R:[-25*k,0,0],chest:[-5*k,0,0],tail:[-15*k,0,0],_pos:[0,0,dz]}),dz);});
  /* death: rears back, forelegs buckle, falls onto the right side with the lower legs lying flat; jaw slack, tail on the ground */
  add('Death',2.8,false,u=>{const hit=wgSeg(u,0,.1)*(1-wgSeg(u,.15,.35)),buck=wgSeg(u,.15,.42),roll=wgSeg(u,.38,.7),settle=wgSeg(u,.7,.85),bob=Math.sin(wgSeg(u,.68,.8)*Math.PI)*.04;
    return wgAdd(wgMix(WAR,{},buck),{neck:[-20*hit+30*buck*(1-roll)-25*roll,0,26*roll],head:[-15*hit+10*buck,0,14*roll],jaw:[18*hit+22*settle,0,0],
      leg_FL:[40*buck*(1-roll)-30*roll,0,-14*roll],leg_FR:[40*buck*(1-roll)-12*roll,0,10*roll],knee_FL:[-90*buck*(1-roll)+25*roll,0,0],knee_FR:[-90*buck*(1-roll)+10*roll,0,0],paw_FL:[20*buck*(1-roll),0,0],paw_FR:[20*buck*(1-roll),0,0],
      leg_BL:[-20*buck+45*roll,0,-14*roll],leg_BR:[-10*buck+25*roll,0,10*roll],knee_BL:[40*buck*(1-roll)+15*roll,0,0],knee_BR:[40*buck*(1-roll)+8*roll,0,0],hock_BL:[-30*buck*(1-roll)-15*roll,0,0],hock_BR:[-30*buck*(1-roll)-8*roll,0,0],
      body:[0,0,90*roll],ear_L:[25*settle,0,0],ear_R:[25*settle,0,0],tail:[-30*roll,0,0],tail2:[15*roll,0,0],_pos:[0,bob,-.1*hit]});});
  for(const n of['Growl','Bite','Pounce','Claw swipe','Fire breath','Hit'])C1.find(c=>c.name===n).next='Idle (war mode)';
  return C1;}

ASSETS.push({id:'hellhound',folder:'characters/enemies/hell',name:'Hellhound',kind:'character',variants:true,defaultSeed:1,groundR:2.4,build:(s,o)=>buildHellhound(s,o||{}),
  opts:[{key:'fur',label:'Fur',choices:[['random','Random'],...Object.entries(HH_FUR).map(([k,v])=>[k,v[1]])],def:'random'},
    {key:'glow',label:'Fire',choices:[['random','Random'],...Object.entries(HH_GLOW).map(([k,v])=>[k,v[1]])],def:'random'},
    {key:'mane',label:'Mane',choices:[['random','Random'],['shaggy','Shaggy'],['short','Short']],def:'random'},
    {key:'scars',label:'Scars',choices:[['random','Random'],['yes','Yes'],['no','No']],def:'random'},
    {key:'gear',label:'Gear',choices:[['none','None'],['collar','Spiked collar']],def:'none'}],
  desc:'Hunched hound of Hell: massive chest and shoulder hump, back falling to a small rump and thin hind legs, a huge head with big jaws full of fangs, shaggy dark fur, fire glowing through the throat, chest and belly and inside the mouth, long hooked claws, thin bare tail. Fur, fire colour, mane, scars, spiked collar. Idle, walk, run, sniff, sit, lie down, howl, war-mode idle, stalk, growl, bite, pounce, claw swipe, fire breath, hit and death.'});
