/* ======================= HELLHOUND: hunched fire-gutted hound of Hell =======================
   The warg's quadruped rig and clip sampler (wgClip, wargClips) on a new body after the owner's reference: a massive chest and
   shoulder hump, the back falling steeply to a small rump and thin hind legs, a huge low-slung head with big jaws full of fangs,
   shaggy dark fur, fire glowing through the throat, chest and belly and inside the mouth, a thin rat-like tail. Fronts face +z. */
const HH_FUR={blueblack:['#262a36','Blue-black'],charcoal:['#2c2a2a','Charcoal'],dkbrown:['#33281f','Dark brown'],ashgrey:['#4a4a4c','Ash grey']};
const HH_GLOW={red:['#ff3a1a','Ember red'],orange:['#ff7a1a','Fire orange'],green:['#7aff3a','Hellfire green'],blue:['#3aa8ff','Blue flame']};
const HHM={};
function hhGlow(hex,k=1){const key=hex+k;return HHM[key]||(HHM[key]=new THREE.MeshStandardMaterial({color:new THREE.Color(hex).convertSRGBToLinear(),emissive:new THREE.Color(hex).convertSRGBToLinear(),emissiveIntensity:k,roughness:.6}));}

function buildHellhound(seed,o={}){const r=mulberry32(((seed*2654435761)>>>0)^0x4e11),pick=a=>a[Math.floor(r()*a.length)],opt=(k,list)=>o[k]&&o[k]!=='random'?o[k]:pick(list);
  const fk=opt('fur',Object.keys(HH_FUR)),gk=opt('glow',Object.keys(HH_GLOW)),maneK=opt('mane',['shaggy','short']),scars=opt('scars',['yes','no'])==='yes',gear=o.gear||'none',
    fur=HH_FUR[fk][0],glow=HH_GLOW[gk][0],shag=maneK==='shaggy';
  const cM=cm('hair',fur),dM=cm('hair',darker(fur,.6)),sM=cm('hair','#'+new THREE.Color(fur).lerp(new THREE.Color('#8a8aa0'),.18).getHexString()),
    eyeM=hhGlow(glow,1.6),hotM=hhGlow(glow,.9),skinM=hhGlow(darker(glow,.5),.55),inM=hhGlow(darker(glow,.65),.8),
    claw=bm('#121014','plain'),pad=bm('#1a1618','plain'),ivory=bm('#e0d4b0','plain'),gum=bm('#6a1c18','skin'),nose=bm('#121014','plain'),scarM=bm('#7a5a5a','skin'),
    leather=bm('#3a2418','leather'),iron=vm('iron');
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
  const paw=(p,w,d,z,y,cl)=>{bx(p,w,.07,d,cM,0,y-.035,z);bx(p,w*.9,.012,d*.85,pad,0,y-.066,z);
    for(const x of[-1.5,-.5,.5,1.5]){const cx=x*w*.22;bx(p,.03,.035,.07*cl,claw,cx,y-.04,z+d/2+.03*cl);bx(p,.024,.05*cl,.03,claw,cx,y-.06,z+d/2+.075*cl);}};
  for(const[k,s]of[['FL',1],['FR',-1]]){const up=aJ(chest,'leg_'+k,s*.28,-.12,.45,[.15,0,0]);bx(up,.2,.36,.32,cM,0,0,0);bx(up,.18,.34,.22,cM,0,-.2,0);if(shag)bx(up,.12,.16,.08,dM,0,-.3,-.13);
    const kn=aJ(up,'knee_'+k,0,-.36,0,[-.15,0,0]);bx(kn,.15,.42,.16,cM,0,-.2,0);bx(kn,.1,.14,.06,dM,0,-.04,-.1);
    const pw=aJ(kn,'paw_'+k,0,-.42,0);bx(pw,.13,.1,.14,cM,0,-.04,0);paw(pw,.21,.24,.04,-.08,1.3);}
  for(const[k,s]of[['BL',1],['BR',-1]]){const up=aJ(hips,'leg_'+k,s*.17,-.06,-.25,[-.35,0,0]);bx(up,.17,.2,.28,cM,0,0,0);bx(up,.15,.36,.22,cM,0,-.15,.02);
    const kn=aJ(up,'knee_'+k,0,-.32,0,[.75,0,0]);bx(kn,.11,.32,.12,cM,0,-.14,0);
    const hk2=aJ(kn,'hock_'+k,0,-.29,0,[-.4,0,0]);bx(hk2,.08,.24,.09,cM,0,-.1,0);
    const pw=aJ(hk2,'paw_'+k,0,-.21,0);paw(pw,.16,.2,.04,0,1);}
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
  /* tail: long, thin and nearly bare, hanging low */
  const tail=aJ(hips,'tail',0,.12,-.32,[.3,0,0]);bx(tail,.07,.42,.07,cM,0,-.19,0);const t2=aJ(tail,'tail2',0,-.4,0,[.35,0,0]);
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
function hellhoundClips(m){const C1=wargClips(m),get=n=>C1.find(c=>c.name===n);
  for(const n of['Growl','Bite','Pounce','Claw swipe','Hit'])get(n).next='Idle (war mode)';
  const WAR={chest:[4,0,0],leg_FL:[-38,0,6],leg_FR:[-38,0,-6],knee_FL:[62,0,0],knee_FR:[62,0,0],paw_FL:[-24,0,0],paw_FR:[-24,0,0],
    leg_BL:[-24,0,5],leg_BR:[-24,0,-5],knee_BL:[40,0,0],knee_BR:[40,0,0],hock_BL:[-32,0,0],hock_BR:[-32,0,0],paw_BL:[16,0,0],paw_BR:[16,0,0],
    neck:[25,0,0],head:[-20,0,0],jaw:[10,0,0],ear_L:[-35,0,0],ear_R:[-35,0,0],tail:[-25,0,0],tail2:[-10,0,0]};
  /* fire breath: draws a breath with the head raised, then thrusts the head forward and low, jaw wide, sweeping left to right
     (the fire itself is left to a separate effect; the mouth glows) */
  const fb=wgClip(m,'Fire breath',2.8,false,u=>{const inh=wgSeg(u,0,.25)*(1-wgSeg(u,.28,.36)),br=wgSeg(u,.28,.36)*(1-wgSeg(u,.8,.95)),sw=Math.sin(wgSeg(u,.36,.8)*Math.PI*2)*br,q=Math.sin(u*Math.PI*40)*br,dz=-.1*inh+.06*br;
    return wgPlant(wgAdd(WAR,{chest:[-8*inh+4*br,0,0],neck:[-30*inh+8*br,-10*sw,0],head:[-14*inh-12*br+q,-18*sw,0],jaw:[6*inh+38*br+q*2,0,0],ear_L:[-15*br,0,0],ear_R:[-15*br,0,0],tail:[-10*br,0,0],_pos:[0,0,dz]}),dz);});
  fb.next='Idle (war mode)';C1.splice(C1.indexOf(get('Claw swipe'))+1,0,fb);
  /* death: the warg's fall onto the right side, but the lower legs lie flat instead of propping the body up */
  C1[C1.indexOf(get('Death'))]=wgClip(m,'Death',2.8,false,u=>{const hit=wgSeg(u,0,.1)*(1-wgSeg(u,.15,.35)),buck=wgSeg(u,.15,.42),roll=wgSeg(u,.38,.7),settle=wgSeg(u,.7,.85),bob=Math.sin(wgSeg(u,.68,.8)*Math.PI)*.04;
    return wgAdd(wgMix(WAR,{},buck),{neck:[-20*hit+30*buck*(1-roll)-25*roll,0,26*roll],head:[-15*hit+10*buck,0,14*roll],jaw:[18*hit+22*settle,0,0],
      leg_FL:[40*buck*(1-roll)-30*roll,0,-14*roll],leg_FR:[40*buck*(1-roll)-12*roll,0,10*roll],knee_FL:[-90*buck*(1-roll)+25*roll,0,0],knee_FR:[-90*buck*(1-roll)+10*roll,0,0],paw_FL:[20*buck*(1-roll),0,0],paw_FR:[20*buck*(1-roll),0,0],
      leg_BL:[-20*buck+45*roll,0,-14*roll],leg_BR:[-10*buck+25*roll,0,10*roll],knee_BL:[40*buck*(1-roll)+15*roll,0,0],knee_BR:[40*buck*(1-roll)+8*roll,0,0],hock_BL:[-30*buck*(1-roll)-15*roll,0,0],hock_BR:[-30*buck*(1-roll)-8*roll,0,0],
      body:[0,0,90*roll],ear_L:[25*settle,0,0],ear_R:[25*settle,0,0],tail:[25*roll,0,20*roll],tail2:[0,0,10*roll],_pos:[0,bob,-.1*hit]});});
  return C1;}

ASSETS.push({id:'hellhound',folder:'characters/enemies/hell',name:'Hellhound',kind:'character',variants:true,defaultSeed:1,groundR:2.4,build:(s,o)=>buildHellhound(s,o||{}),
  opts:[{key:'fur',label:'Fur',choices:[['random','Random'],...Object.entries(HH_FUR).map(([k,v])=>[k,v[1]])],def:'random'},
    {key:'glow',label:'Fire',choices:[['random','Random'],...Object.entries(HH_GLOW).map(([k,v])=>[k,v[1]])],def:'random'},
    {key:'mane',label:'Mane',choices:[['random','Random'],['shaggy','Shaggy'],['short','Short']],def:'random'},
    {key:'scars',label:'Scars',choices:[['random','Random'],['yes','Yes'],['no','No']],def:'random'},
    {key:'gear',label:'Gear',choices:[['none','None'],['collar','Spiked collar']],def:'none'}],
  desc:'Hunched hound of Hell: massive chest and shoulder hump, back falling to a small rump and thin hind legs, a huge head with big jaws full of fangs, shaggy dark fur, fire glowing through the throat, chest and belly and inside the mouth, long hooked claws, thin bare tail. Fur, fire colour, mane, scars, spiked collar. Idle, walk, run, sniff, sit, lie down, howl, war-mode idle, stalk, growl, bite, pounce, claw swipe, fire breath, hit and death.'});
