/* ======================= HELLHOUND: lean fiery hound of Hell =======================
   The warg's quadruped rig and clip sampler (wgClip, wargClips) on a leaner, level-backed hound, about 1.25 m at the withers.
   Charred hide with glowing ember cracks, glowing eyes and mouth, bony spines, a flame mane (flame joints fl_* that sway and
   flicker through U.fx, baked as tracks), whip tail with a bony spike. Fronts face +z. */
const HH_HIDE={charcoal:['#2c2826','Charcoal'],obsidian:['#1c1a20','Obsidian'],ash:['#5a5652','Ash grey'],rust:['#5a2c20','Rust red']};
const HH_GLOW={ember:['#ff6a1a','Ember orange'],red:['#ff2e12','Blood red'],green:['#7aff3a','Hellfire green'],blue:['#4aa8ff','Blue flame']};
const HHM={};
function hhGlow(hex,k=1){const key=hex+k;return HHM[key]||(HHM[key]=new THREE.MeshStandardMaterial({color:new THREE.Color(hex).convertSRGBToLinear(),emissive:new THREE.Color(hex).convertSRGBToLinear(),emissiveIntensity:k,roughness:.6}));}

function buildHellhound(seed,o={}){const r=mulberry32(((seed*2654435761)>>>0)^0x4e11),pick=a=>a[Math.floor(r()*a.length)],opt=(k,list)=>o[k]&&o[k]!=='random'?o[k]:pick(list);
  const hk=opt('hide',Object.keys(HH_HIDE)),gk=opt('glow',Object.keys(HH_GLOW)),back=opt('back',['flames','spines']),horns=opt('horns',['none','short','curved']),gear=o.gear||'none',
    hide=HH_HIDE[hk][0],glow=HH_GLOW[gk][0],core='#'+new THREE.Color(glow).lerp(new THREE.Color('#fff4b0'),.6).getHexString();
  const cM=cm('plain',hide),dM=cm('plain',darker(hide,.6)),
    gM=hhGlow(glow,1),mouth=hhGlow(darker(glow,.55),.7),flM=hhGlow(glow,1.3),coreM=hhGlow(core,1.4),eyeM=hhGlow(glow,1.6),
    pad=bm('#1a1614','plain'),claw=bm('#141210','plain'),bone=bm('#2e2826','plain'),ivory=bm('#d8ccae','plain'),gum=bm('#5a1a16','skin'),nose=bm('#141210','plain'),
    leather=bm('#3a2418','leather'),iron=vm('iron');
  const root=new THREE.Group();root.userData.lights=[];root.userData.animal='hellhound';
  const body=new THREE.Group();body.name='body';body.userData.joint=true;body.position.set(0,.8,0);root.add(body);
  const chest=aJ(body,'chest',0,0,.25),hips=aJ(body,'hips',0,0,-.25);
  /* torso: deep chest with a withers ridge, tucked waist, muscular level loin and rump */
  bx(chest,.5,.6,.7,cM,0,0,.3);bx(chest,.4,.1,.4,cM,0,.34,.35);bx(chest,.42,.42,.4,cM,0,.08,-.2);bx(chest,.36,.04,.3,dM,0,-.31,.32);
  bx(hips,.4,.36,.3,cM,0,.12,.15);bx(hips,.46,.44,.45,cM,0,.08,-.25);bx(hips,.38,.3,.12,cM,0,.1,-.5);
  /* legs (same joints as the warg): lean, muscled at the shoulder and haunch, long black claws */
  const paw=(p,w,d,z,y)=>{bx(p,w,.06,d,cM,0,y-.03,z);bx(p,w*.9,.012,d*.85,pad,0,y-.056,z);for(const x of[-1,0,1])bx(p,.026,.03,.06,claw,x*w*.3,y-.045,z+d/2+.02);};
  for(const[k,s]of[['FL',1],['FR',-1]]){const up=aJ(chest,'leg_'+k,s*.22,-.1,.5,[.2,0,0]);bx(up,.17,.28,.24,cM,0,.02,0);bx(up,.15,.34,.17,cM,0,-.16,0);
    const kn=aJ(up,'knee_'+k,0,-.3,0,[-.2,0,0]);bx(kn,.12,.38,.13,cM,0,-.18,0);bx(kn,.1,.1,.05,dM,0,-.02,-.08);
    const pw=aJ(kn,'paw_'+k,0,-.36,0);bx(pw,.1,.1,.11,cM,0,-.04,0);paw(pw,.15,.19,.03,-.08);}
  for(const[k,s]of[['BL',1],['BR',-1]]){const up=aJ(hips,'leg_'+k,s*.19,-.02,-.3,[-.35,0,0]);bx(up,.2,.22,.32,cM,0,0,0);bx(up,.18,.38,.26,cM,0,-.15,.02);
    const kn=aJ(up,'knee_'+k,0,-.32,0,[.75,0,0]);bx(kn,.13,.34,.14,cM,0,-.15,0);
    const hk2=aJ(kn,'hock_'+k,0,-.3,0,[-.4,0,0]);bx(hk2,.09,.26,.1,cM,0,-.11,0);bx(hk2,.07,.06,.04,dM,0,0,-.06);
    const pw=aJ(hk2,'paw_'+k,0,-.22,0);paw(pw,.14,.18,.04,0);}
  /* neck and head: thick neck, blocky mastiff skull, heavy brow over glowing eyes, fangs, a mouth that glows inside */
  const neck=aJ(chest,'neck',0,.2,.6,[1.05,0,0]);bx(neck,.36,.3,.38,cM,0,.05,0);bx(neck,.3,.42,.32,cM,0,.18,0);
  const head=aJ(neck,'head',0,.36,.04,[-.95,0,0]),hg=new THREE.Group();hg.scale.setScalar(1.2);head.add(hg);
  bx(hg,.3,.24,.3,cM,0,.05,.02);bx(hg,.36,.14,.18,cM,0,-.02,.02);bx(hg,.32,.06,.08,dM,0,.15,.16);
  bx(hg,.2,.13,.28,cM,0,0,.3);bx(hg,.16,.03,.24,dM,0,.075,.3);bx(hg,.11,.06,.05,nose,0,.04,.45);
  for(const s of[-1,1]){bx(hg,.055,.04,.05,eyeM,s*.13,.095,.165);bx(hg,.08,.025,.02,dM,s*.115,.125,.18,0,0,s*.3);bx(hg,.03,.07,.03,ivory,s*.08,-.09,.4);}
  bx(hg,.17,.02,.22,ivory,0,-.068,.31);bx(hg,.14,.04,.2,mouth,0,-.08,.24);
  const jaw=aJ(hg,'jaw',0,-.07,.08);bx(jaw,.15,.06,.36,cM,0,-.03,.18);bx(jaw,.2,.09,.14,cM,0,-.04,.03);
  bx(jaw,.1,.015,.24,mouth,0,.003,.18);bx(jaw,.13,.015,.16,ivory,0,.005,.25);for(const s of[-1,1])bx(jaw,.025,.035,.025,ivory,s*.05,.015,.33);
  for(const s of[-1,1]){const ear=aJ(hg,'ear_'+(s>0?'L':'R'),s*.14,.15,-.06,[-1,0,-s*.35]);
    bx(ear,.08,.09,.035,cM,0,.045,0);bx(ear,.055,.08,.035,cM,0,.12,0);bx(ear,.025,.06,.035,cM,0,.18,0);bx(ear,.05,.09,.008,dM,0,.07,.019);}
  /* horns: short spikes or long horns curving back over the skull */
  const seg=(par,x,y,z,rx,rz)=>{const g=new THREE.Group();g.position.set(x,y,z);g.rotation.set(rx,0,rz);par.add(g);return g;};
  if(horns==='short')for(const s of[-1,1]){const h=seg(hg,s*.08,.16,.08,-.6,-s*.25);bx(h,.06,.08,.06,bone,0,.03,0);bx(h,.04,.08,.04,bone,0,.1,0);bx(h,.02,.06,.02,bone,0,.16,0);}
  if(horns==='curved')for(const s of[-1,1]){const h=seg(hg,s*.07,.16,.08,-1.1,-s*.15);bx(h,.06,.1,.06,bone,0,.04,0);bx(h,.045,.09,.045,bone,0,.12,0);
    const h2=seg(h,0,.16,0,.6,0);bx(h2,.04,.1,.04,bone,0,.05,0);const h3=seg(h2,0,.1,0,.6,0);bx(h3,.03,.08,.03,bone,0,.04,0);bx(h3,.016,.06,.016,bone,0,.1,0);}
  /* back: bony spines all along, or a flame mane on the neck and withers with spines down the rump */
  const spike=(par,x,y,z,rx,k)=>{const g=seg(par,x,y,z,rx,0);bx(g,.06*k,.08*k,.07*k,bone,0,.03*k,0);bx(g,.04*k,.08*k,.045*k,bone,0,.1*k,0);bx(g,.02*k,.06*k,.025*k,bone,0,.16*k,0);};
  const FL=[],flame=(par,x,y,z,rx,k)=>{const f=aJ(par,'fl_'+FL.length,x,y,z,[rx,0,0]);FL.push(f);
    bx(f,.12*k,.12*k,.1*k,flM,0,.05*k,0);bx(f,.09*k,.12*k,.075*k,flM,.01*k,.16*k,0);bx(f,.05*k,.1*k,.045*k,flM,-.01*k,.26*k,0);bx(f,.025*k,.07*k,.025*k,flM,0,.34*k,0);
    bx(f,.07*k,.14*k,.11*k,coreM,0,.07*k,0);bx(f,.04*k,.1*k,.085*k,coreM,0,.17*k,0);};
  const NK=[[.06,-.18],[.19,-.18],[.34,-.17]],CH=[[.39,.47,1],[.39,.27,1],[.29,-.1,.8]];
  if(back==='flames'){for(const[y,z]of NK)flame(neck,0,y,z,-1.4,.9);for(const[y,z,k]of CH)flame(chest,0,y,z,-.6,k);}
  else{for(const[y,z]of NK)spike(neck,0,y,z,-1.4,.9);for(const[y,z,k]of CH)spike(chest,0,y,z,-.6,k);}
  spike(hips,0,.3,-.05,-.6,.9);spike(hips,0,.3,-.3,-.6,.8);spike(hips,0,.25,-.52,-.7,.7);
  /* ember cracks: glowing seams on the flanks, shoulders and haunches */
  const crack=(par,s,x,y,z,n)=>{let py=y,pz=z,a;const d=r()<.5?1:-1;for(let i=0;i<n;i++){const L=.06+r()*.04;a=(i%2?d:-d)*(.35+r()*.5);const dy=-Math.cos(a)*L,dz=Math.sin(a)*L;
    bx(par,.012,L+.015,.02,gM,s*x,py+dy/2,pz+dz/2,-a,0,0);py+=dy;pz+=dz;}};
  for(const s of[-1,1]){for(let i=0;i<3;i++)crack(chest,s,.256,.12+r()*.12,.12+i*.18+r()*.06,3+(r()*2|0));crack(chest,s,.216,.2,-.3+r()*.15,3);
    for(let i=0;i<2;i++)crack(hips,s,.236,.2,-.4+i*.2+r()*.06,3);
    crack(root.getObjectByName(s>0?'leg_FL':'leg_FR'),s,.081,-.02,0,3);crack(root.getObjectByName(s>0?'leg_BL':'leg_BR'),s,.096,0,.02,3);}
  /* whip tail ending in a bony spike */
  const tail=aJ(hips,'tail',0,.18,-.55,[.7,0,0]);bx(tail,.08,.36,.08,cM,0,-.16,0);const t2=aJ(tail,'tail2',0,-.32,0,[.2,0,0]);
  bx(t2,.06,.36,.06,cM,0,-.17,0);bx(t2,.07,.07,.07,bone,0,-.36,0);bx(t2,.045,.08,.045,bone,0,-.43,0);bx(t2,.02,.06,.02,bone,0,-.5,0);
  /* gear: spiked iron collar */
  if(gear==='collar'){bx(neck,.38,.06,.4,leather,0,.265,0);for(const[x,z]of[[.18,0],[-.18,0],[0,.19],[0,-.19],[.13,.13],[-.13,.13]]){const g=seg(neck,x*1.06,.265,z*1.06,0,0);g.rotation.y=Math.atan2(x,z);bx(g,.035,.035,.05,iron,0,0,.03);}
    bx(neck,.06,.06,.02,iron,0,.22,.21);}
  /* contact points (the warg's sampler grounds every frame on these) */
  const pts=par=>{const L=[];par.traverse(q=>{if(!q.isMesh)return;q.geometry.computeBoundingBox();const b=q.geometry.boundingBox,c=[];for(const x of[b.min.x,b.max.x])for(const y of[b.min.y,b.max.y])for(const z of[b.min.z,b.max.z])c.push(new THREE.Vector3(x,y,z));L.push([q,c]);});return L;};
  const U={F:pts(chest),B:pts(hips),J:{},fxJ:FL};U.A=U.F.concat(U.B);root.userData.wg=U;U.fx=hhFlames(FL);U.fps=60;
  root.userData.ajoints=['body','chest','hips','neck','head','jaw','ear_L','ear_R','tail','tail2','leg_FL','knee_FL','paw_FL','leg_FR','knee_FR','paw_FR','leg_BL','knee_BL','hock_BL','paw_BL','leg_BR','knee_BR','hock_BR','paw_BR'];
  for(const n of root.userData.ajoints)U.J[n]=n==='body'?body:root.getObjectByName(n);
  root.updateMatrixWorld(true);body.position.y-=wgLow(U.A);U.bp=body.position.clone();
  const joints=[];root.traverse(q=>{if(q.userData.joint)joints.push(q);});root.userData.joints=joints;
  const key=back+horns+gear;root.userData.clips=HHCLIPS[key]||(HHCLIPS[key]=hellhoundClips(root));root.userData.ground=1.6;root.userData.look={hide:hk,glow:gk,back,horns};return root;}

/* flames sway and flicker in whole cycles per clip (seamless loops), stream back when running or leaping, burn low in Death */
function hhFlames(FL){return(name,u,t,dur)=>{const n=Math.max(1,Math.round(dur*1.6)),lean=name==='Run'?-28:name==='Pounce'?-18*Math.sin(Math.PI*Math.max(0,Math.min(1,(u-.3)/.32))):0,
  die=name==='Death'?1-.8*wgSeg(u,.3,1):1;
  FL.forEach((f,i)=>{const a=u*n+i*.37,b=u*n*2+i*.21;f.rotation.set((S(a)*7+lean)*Math.PI/180,0,S(b)*4*Math.PI/180);const k=1+.12*S(b+.3);f.scale.set((2-k)*die,k*die,(2-k)*die);});};}

const HHCLIPS={};
function hellhoundClips(m){const C1=wargClips(m),get=n=>C1.find(c=>c.name===n);
  for(const n of['Growl','Bite','Pounce','Claw swipe','Hit'])get(n).next='Idle (war mode)';
  const WAR={chest:[4,0,0],leg_FL:[-38,0,6],leg_FR:[-38,0,-6],knee_FL:[62,0,0],knee_FR:[62,0,0],paw_FL:[-24,0,0],paw_FR:[-24,0,0],
    leg_BL:[-24,0,5],leg_BR:[-24,0,-5],knee_BL:[40,0,0],knee_BR:[40,0,0],hock_BL:[-32,0,0],hock_BR:[-32,0,0],paw_BL:[16,0,0],paw_BR:[16,0,0],
    neck:[25,0,0],head:[-20,0,0],jaw:[10,0,0],ear_L:[-35,0,0],ear_R:[-35,0,0],tail:[-25,0,0],tail2:[-10,0,0]};
  /* fire breath: draws a breath with the head raised, then thrusts the head forward and low, jaw wide, sweeping left to right
     (the fire itself is left to a separate effect; the mouth glows) */
  const fb=wgClip(m,'Fire breath',2.8,false,u=>{const inh=wgSeg(u,0,.25)*(1-wgSeg(u,.28,.36)),br=wgSeg(u,.28,.36)*(1-wgSeg(u,.8,.95)),sw=Math.sin(wgSeg(u,.36,.8)*Math.PI*2)*br,q=Math.sin(u*Math.PI*40)*br,dz=-.1*inh+.06*br;
    return wgPlant(wgAdd(WAR,{chest:[-8*inh+4*br,0,0],neck:[-30*inh+12*br,-10*sw,0],head:[-14*inh-8*br+q,-18*sw,0],jaw:[6*inh+38*br+q*2,0,0],ear_L:[-15*br,0,0],ear_R:[-15*br,0,0],tail:[-10*br,0,0],_pos:[0,0,dz]}),dz);});
  fb.next='Idle (war mode)';C1.splice(C1.indexOf(get('Claw swipe'))+1,0,fb);
  /* death: the warg's fall onto the right side, but the lower legs lie flat instead of propping the body up; the flames burn low */
  C1[C1.indexOf(get('Death'))]=wgClip(m,'Death',2.8,false,u=>{const hit=wgSeg(u,0,.1)*(1-wgSeg(u,.15,.35)),buck=wgSeg(u,.15,.42),roll=wgSeg(u,.38,.7),settle=wgSeg(u,.7,.85),bob=Math.sin(wgSeg(u,.68,.8)*Math.PI)*.04;
    return wgAdd(wgMix(WAR,{},buck),{neck:[-20*hit+30*buck*(1-roll)-25*roll,0,26*roll],head:[-15*hit+10*buck,0,14*roll],jaw:[18*hit+22*settle,0,0],
      leg_FL:[40*buck*(1-roll)-30*roll,0,-14*roll],leg_FR:[40*buck*(1-roll)-12*roll,0,10*roll],knee_FL:[-90*buck*(1-roll)+25*roll,0,0],knee_FR:[-90*buck*(1-roll)+10*roll,0,0],paw_FL:[20*buck*(1-roll),0,0],paw_FR:[20*buck*(1-roll),0,0],
      leg_BL:[-20*buck+45*roll,0,-14*roll],leg_BR:[-10*buck+25*roll,0,10*roll],knee_BL:[40*buck*(1-roll)+15*roll,0,0],knee_BR:[40*buck*(1-roll)+8*roll,0,0],hock_BL:[-30*buck*(1-roll)-15*roll,0,0],hock_BR:[-30*buck*(1-roll)-8*roll,0,0],
      body:[0,0,90*roll],ear_L:[25*settle,0,0],ear_R:[25*settle,0,0],tail:[25*roll,0,20*roll],tail2:[0,0,10*roll],_pos:[0,bob,-.1*hit]});});
  return C1;}

ASSETS.push({id:'hellhound',folder:'characters/enemies/hell',name:'Hellhound',kind:'character',variants:true,defaultSeed:1,groundR:2,build:(s,o)=>buildHellhound(s,o||{}),
  opts:[{key:'hide',label:'Hide',choices:[['random','Random'],...Object.entries(HH_HIDE).map(([k,v])=>[k,v[1]])],def:'random'},
    {key:'glow',label:'Fire',choices:[['random','Random'],...Object.entries(HH_GLOW).map(([k,v])=>[k,v[1]])],def:'random'},
    {key:'back',label:'Back',choices:[['random','Random'],['flames','Flame mane'],['spines','Bony spines']],def:'random'},
    {key:'horns',label:'Horns',choices:[['random','Random'],['none','None'],['short','Short'],['curved','Curved']],def:'random'},
    {key:'gear',label:'Gear',choices:[['none','None'],['collar','Spiked collar']],def:'none'}],
  desc:'Lean, muscular hound of Hell, about 1.25 m at the withers: charred hide with glowing ember cracks, glowing eyes and mouth, fangs, bony spines, a flickering flame mane, whip tail with a bony spike, optional horns and spiked collar. Idle, walk, run, sniff, sit, lie down, howl, war-mode idle, stalk, growl, bite, pounce, claw swipe, fire breath, hit and death.'});
