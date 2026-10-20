/* ======================= CERBERUS: three-headed guardian hound of Hell =======================
   The hellhound's body (materials, rottweiler paws, gait IK hhGaitFn) scaled up 1.35x, with an even wider, heavier front and three
   big heads on three thick necks: the centre head forward and low, the side heads higher and splayed outwards. Built in the hellhound's
   units and scaled by CBK, so the hellhound's leg layout (HHL) scales straight into CBL. The warg's sampler (wgClip). Fronts face +z. */
const CBK=1.35;
const CBL=(()=>{const k=CBK,F=HHL.F,B=HHL.B,L={fk:HHL.fk,bk:HHL.bk,bdy:HHL.bdy*k,F:{o:F.o*k,p:F.p.map(v=>v*k),r1:F.r1,r2:F.r2,a:F.a*k,b:F.b*k,sole:F.sole*k},
  B:{o:B.o*k,p:B.p.map(v=>v*k),rt:B.rt,rk:B.rk,rh:B.rh,a:B.a*k,b:B.b*k,c:B.c*k,sole:B.sole*k}};return L;})();
/* head joints: the centre head keeps the warg's names (so the shared poses drive it), the side heads get L / R suffixes */
const CB_HK=['neck','head','jaw','ear_L','ear_R'],CB_SN={L:['neckL','headL','jawL','earL_L','earL_R'],R:['neckR','headR','jawR','earR_L','earR_R']};

function buildCerberus(seed,o={}){const r=mulberry32(((seed*2654435761)>>>0)^0x3c3b),pick=a=>a[Math.floor(r()*a.length)],opt=(k,list)=>o[k]&&o[k]!=='random'?o[k]:pick(list);
  const fk=opt('fur',Object.keys(HH_FUR)),gk=opt('glow',Object.keys(HH_GLOW)),maneK=opt('mane',['shaggy','short']),scars=opt('scars',['yes','no'])==='yes',gear=o.gear||'none',
    fur=HH_FUR[fk][0],glow=HH_GLOW[gk][0],shag=maneK==='shaggy',K=CBK;
  const cM=cm('hair',fur),dM=cm('hair',darker(fur,.6)),sM=cm('hair','#'+new THREE.Color(fur).lerp(new THREE.Color('#7b7b89'),.18).getHexString()),
    eyeM=hhGlow(glow,1.6),hotM=hhGlow(glow,.9),skinM=hhGlow(darker(glow,.5),.55),inM=hhGlow(darker(glow,.65),.8),
    nail=bm('#39322e','plain'),pad=bm('#1a1618','plain'),ivory=bm('#d9d0b5','plain'),gum=bm('#4f2d2c','skin'),nose=bm('#131013','plain'),scarM=bm('#695453','skin'),
    leather=bm('#37251f','leather'),iron=vm('iron');
  /* everything is laid out in hellhound units and scaled by K here */
  const b=(p,w,h,d,m,x,y,z,rx,ry,rz)=>bx(p,w*K,h*K,d*K,m,x*K,y*K,z*K,rx,ry,rz),J=(p,n,x,y,z,rest)=>aJ(p,n,x*K,y*K,z*K,rest);
  const root=new THREE.Group();root.userData.lights=[];root.userData.animal='cerberus';
  const body=new THREE.Group();body.name='body';body.userData.joint=true;body.position.set(0,.85*K,0);root.add(body);
  const chest=J(body,'chest',0,0,.3),hips=J(body,'hips',0,0,-.3);
  /* front half: a very wide, deep ribcage under a broad shoulder hump that carries three necks; fire glows through the brisket and belly */
  b(chest,.94,.8,.74,cM,0,.01,.3);b(chest,.8,.22,.56,cM,0,.5,.3);b(chest,.7,.62,.4,cM,0,.06,-.18);
  b(chest,.6,.16,.02,skinM,0,0,.675);b(chest,.46,.16,.02,skinM,0,-.16,.675);b(chest,.28,.12,.02,skinM,0,-.3,.675);b(chest,.28,.14,.022,hotM,0,-.06,.678);b(chest,.16,.14,.022,hotM,0,-.2,.678);
  for(const s of[-1,1]){b(chest,.08,.3,.04,dM,s*.36,-.08,.685,0,0,s*.15);b(chest,.06,.16,.04,sM,s*.22,.08,.685);}b(chest,.6,.02,.6,skinM,0,-.391,.3);b(chest,.4,.02,.36,hotM,0,-.392,.36);b(chest,.44,.02,.36,skinM,0,-.241,-.16);
  for(const s of[-1,1]){b(chest,.04,.1,.56,dM,s*.44,-.43,.32);b(chest,.04,.08,.3,dM,s*.33,-.27,-.16);}
  /* hind half: rump and loin, well below the hump */
  b(hips,.48,.42,.34,cM,0,.1,.2);b(hips,.46,.4,.4,cM,0,.02,-.12);b(hips,.34,.02,.3,skinM,0,-.091,.2);
  const tuft=(par,x,y,z,w,h,d,rx)=>b(par,w,h,d,r()<.5?dM:sM,x,y,z,rx,0,0);
  if(shag){for(let i=0;i<6;i++)tuft(chest,(r()-.5)*.4,.62+r()*.05,.5-i*.1,.16+r()*.1,.12+r()*.06,.12,-.5);for(const s of[-1,1])for(let i=0;i<4;i++)tuft(chest,s*(.43+r()*.02),.36-r()*.06,.55-i*.12,.06,.16+r()*.06,.12,-.3);
    for(let i=0;i<3;i++)tuft(chest,(r()-.5)*.2,.42-i*.05,-.05-i*.1,.16,.08,.12,-.5);}
  else b(chest,.3,.06,.5,dM,0,.62,.3);
  /* legs: the hellhound's skeleton, set wider; massive shoulders and forearms, rottweiler paws; slimmer hind legs */
  const paw=(p,k,dy)=>{const B=(w,h,d,m,x,y,z,rx)=>bx(p,w*k,h*k,d*k,m,x*k,y*k+dy,z*k,rx);B(.15,.12,.15,cM,0,-.04,0);B(.2,.06,.16,cM,0,-.125,-.005);B(.19,.008,.2,pad,0,-.153,.04);
    for(const[x,z]of[[-.085,.085],[-.03,.1],[.03,.1],[.085,.085]]){B(.052,.08,.09,cM,x,-.115,z);B(.04,.03,.07,cM,x,-.062,z-.005);B(.04,.05,.02,cM,x,-.11,z+.053);B(.024,.045,.03,nail,x,-.13,z+.068,.5);}};
  for(const[k,s]of[['FL',1],['FR',-1]]){const up=J(chest,'leg_'+k,s*.38,-.12,.45,[.15,0,0]);b(up,.26,.38,.36,cM,0,0,0);b(up,.22,.34,.26,cM,0,-.2,0);if(shag)b(up,.14,.16,.08,dM,0,-.3,-.15);
    const kn=J(up,'knee_'+k,0,-.36,0,[-.15,0,0]);b(kn,.18,.42,.19,cM,0,-.2,0);b(kn,.12,.14,.06,dM,0,-.04,-.115);
    const pw=J(kn,'paw_'+k,0,-.42,0);paw(pw,HHL.fk*1.08*K,0);}
  for(const[k,s]of[['BL',1],['BR',-1]]){const up=J(hips,'leg_'+k,s*.2,-.06,-.25,[-.35,0,0]);b(up,.18,.2,.28,cM,0,0,0);b(up,.16,.36,.22,cM,0,-.15,.02);
    const kn=J(up,'knee_'+k,0,-.32,0,[.75,0,0]);b(kn,.12,.32,.12,cM,0,-.14,0);
    const hk2=J(kn,'hock_'+k,0,-.29,0,[-.4,0,0]);b(hk2,.1,.24,.1,cM,0,-.1,0);
    const pw=J(hk2,'paw_'+k,0,-.21,0);paw(pw,HHL.bk*K,HHL.bdy*K);}
  /* three necks and heads: n names the joints, the rest group sets where the neck grows from and how it splays (yaw, then pitch) */
  const headOn=(n,x,y,z,yaw,pitch,hp)=>{const neck=J(chest,n[0],x,y,z);neck.parent.rotation.set(pitch,yaw,0,'YXZ');
    b(neck,.44,.42,.44,cM,0,.08,0);b(neck,.38,.36,.38,cM,0,.3,0);b(neck,.26,.42,.02,skinM,0,.2,.201);b(neck,.13,.3,.022,hotM,0,.2,.202);
    if(shag){b(neck,.34,.5,.1,dM,0,.2,-.23);for(let i=0;i<4;i++)tuft(neck,(r()-.5)*.2,.05+i*.12,-.29,.16,.1,.1,-1.2);for(const s of[-1,1])b(neck,.08,.36,.34,sM,s*.23,.12,-.02);}
    else b(neck,.14,.46,.08,dM,0,.2,-.21);
    /* head: big and broad, heavy brow over small glowing eyes, short muzzle, huge jaw, separate teeth and long fangs, glowing mouth */
    const head=J(neck,n[1],0,.46,.02,[hp,0,0]);
    b(head,.46,.36,.4,cM,0,.1,0);b(head,.56,.22,.3,cM,0,-.02,.02);b(head,.48,.08,.1,dM,0,.24,.2);
    b(head,.3,.18,.34,cM,0,.04,.36);b(head,.24,.04,.3,dM,0,.14,.36);b(head,.16,.08,.06,nose,0,.1,.54);
    b(head,.24,.012,.32,inM,0,-.051,.34);b(head,.26,.02,.3,gum,0,-.055,.36);
    for(const s of[-1,1]){b(head,.06,.04,.04,eyeM,s*.2,.15,.2);b(head,.1,.03,.03,dM,s*.19,.19,.215,0,0,s*.35);
      b(head,.045,.13,.045,ivory,s*.105,-.12,.48);for(const[z,h]of[[.25,.05],[.33,.07],[.41,.05]])b(head,.03,h,.03,ivory,s*.13,-.06-h/2,z);for(const x of[.03,.065])b(head,.025,.04,.025,ivory,s*x,-.075,.515);}
    const jaw=J(head,n[2],0,-.1,.06);b(jaw,.3,.1,.46,cM,0,-.05,.22);b(jaw,.44,.14,.2,cM,0,-.06,.02);b(jaw,.22,.06,.04,cM,0,-.07,.43);
    b(jaw,.2,.012,.36,inM,0,.006,.22);b(jaw,.24,.015,.4,gum,0,.003,.22);
    for(const s of[-1,1]){b(jaw,.045,.1,.045,ivory,s*.16,.05,.4);for(const[z,h]of[[.17,.05],[.25,.06],[.32,.05]])b(jaw,.03,h,.03,ivory,s*.12,h/2,z);for(const x of[.03,.065])b(jaw,.025,.035,.025,ivory,s*x,.017,.43);}
    for(const s of[-1,1]){const ear=J(head,n[s>0?3:4],s*.18,.27,-.1,[-.6,0,-s*.35]);b(ear,.13,.1,.05,cM,0,.05,0);b(ear,.09,.06,.05,cM,0,.12,0);b(ear,.08,.08,.01,skinM,0,.07,.026);}
    if(shag)for(const s of[-1,1])b(head,.06,.2,.24,dM,s*.29,-.02,-.02);
    /* gear: a spiked iron collar on every neck */
    if(gear==='collar'){b(neck,.48,.08,.48,leather,0,.3,0);for(const[cx,cz]of[[.24,0],[-.24,0],[0,.24],[0,-.24],[.17,.17],[-.17,.17],[.17,-.17],[-.17,-.17]]){const g=new THREE.Group();g.position.set(cx*K,.3*K,cz*K);g.rotation.y=Math.atan2(cx,cz);neck.add(g);b(g,.04,.04,.06,iron,0,0,.03);}
      b(neck,.08,.08,.025,iron,0,.24,.25);}
    return{neck,head};};
  /* centre head forward and low; side heads higher, further back and turned out so the three skulls stand clear of each other */
  const HC=headOn(CB_HK,0,.04,.74,0,1.42,-1.52),HL=headOn(CB_SN.L,.4,.3,.44,.8,.9,-.98),HR=headOn(CB_SN.R,-.4,.3,.44,-.8,.9,-.98);
  /* tail: long, thin and nearly bare, carried up and back */
  const tail=J(hips,'tail',0,.12,-.32,[1.75,0,0]);b(tail,.09,.42,.09,cM,0,-.19,0);const t2=J(tail,'tail2',0,-.4,0,[-.45,0,0]);
  b(t2,.06,.36,.06,cM,0,-.17,0);b(t2,.04,.16,.04,dM,0,-.42,0);
  /* scars: a claw mark over the left head's left eye, three across the right shoulder */
  if(scars){b(HL.head,.015,.14,.02,scarM,.17,.17,.205,0,0,-.4);for(let i=0;i<3;i++)b(chest,.012,.3,.025,scarM,-.471,.12,.3+i*.07,.5,0,0);}
  const pts=par=>{const L=[];par.traverse(q=>{if(!q.isMesh)return;q.geometry.computeBoundingBox();const bb=q.geometry.boundingBox,c=[];for(const x of[bb.min.x,bb.max.x])for(const y of[bb.min.y,bb.max.y])for(const z of[bb.min.z,bb.max.z])c.push(new THREE.Vector3(x,y,z));L.push([q,c]);});return L;};
  const U={F:pts(chest),B:pts(hips),J:{},fps:60};U.A=U.F.concat(U.B);root.userData.wg=U;
  root.userData.ajoints=['body','chest','hips',...CB_HK,...CB_SN.L,...CB_SN.R,'tail','tail2','leg_FL','knee_FL','paw_FL','leg_FR','knee_FR','paw_FR','leg_BL','knee_BL','hock_BL','paw_BL','leg_BR','knee_BR','hock_BR','paw_BR'];
  for(const n of root.userData.ajoints)U.J[n]=n==='body'?body:root.getObjectByName(n);
  root.updateMatrixWorld(true);body.position.y-=wgLow(U.A);U.bp=body.position.clone();
  const joints=[];root.traverse(q=>{if(q.userData.joint)joints.push(q);});root.userData.joints=joints;
  const key=maneK+gear;root.userData.clips=CBCLIPS[key]||(CBCLIPS[key]=cerberusClips(root));root.userData.ground=2.8;root.userData.look={fur:fk,glow:gk,mane:maneK,scars};return root;}

const CBCLIPS={};
/* gives the side heads their keys: L and R (poses, only the head keys are read) are added to the centre head's keys when add is set, else used as they are */
function cbTri(p,L,R,add){const q=Object.assign({},p);for(const[s,P]of[['L',L],['R',R]])CB_HK.forEach((k,i)=>{const a=add?(p[k]||[0,0,0]):[0,0,0],c=(P&&P[k])||[0,0,0];q[CB_SN[s][i]]=[a[0]+c[0],a[1]+c[1],a[2]+c[2]];});return q;}

function cerberusClips(m){
  const K=CBK;
  const WAR={chest:[4,0,0],leg_FL:[-38,0,6],leg_FR:[-38,0,-6],knee_FL:[62,0,0],knee_FR:[62,0,0],paw_FL:[-24,0,0],paw_FR:[-24,0,0],
    leg_BL:[-24,0,5],leg_BR:[-24,0,-5],knee_BL:[40,0,0],knee_BR:[40,0,0],hock_BL:[-32,0,0],hock_BR:[-32,0,0],paw_BL:[16,0,0],paw_BR:[16,0,0],
    neck:[25,0,0],head:[-20,0,0],jaw:[10,0,0],ear_L:[-35,0,0],ear_R:[-35,0,0],tail:[12,0,0],tail2:[-8,0,0]};
  const SIT={body:[-40,0,0],hips:[-8,0,0],leg_FL:[34,0,0],leg_FR:[34,0,0],knee_FL:[6,0,0],knee_FR:[6,0,0],
    leg_BL:[-10,0,14],leg_BR:[-10,0,-14],knee_BL:[137,0,0],knee_BR:[137,0,0],hock_BL:[-162,0,0],hock_BR:[-162,0,0],paw_BL:[90,0,0],paw_BR:[90,0,0],
    neck:[-10,0,0],head:[10,0,0],tail:[30,25,0],tail2:[40,0,0]};
  const LIE={leg_FL:[46,0,0],leg_FR:[46,0,0],knee_FL:[-136,0,0],knee_FR:[-136,0,0],paw_FL:[90,0,0],paw_FR:[90,0,0],
    leg_BL:[-50,0,16],leg_BR:[-50,0,-16],knee_BL:[122,0,0],knee_BR:[122,0,0],hock_BL:[-162,0,0],hock_BR:[-162,0,0],paw_BL:[90,0,0],paw_BR:[90,0,0],
    neck:[-5,0,0],head:[5,0,0],tail:[-45,15,0],tail2:[30,0,0]};
  /* each head keeps its own watch: own phases, the side heads look outwards (L +y, R -y) */
  const look=(u,s,ph)=>({neck:[S(u+ph)*3,0,0],head:[S(u*2+ph)*3,s*(12+S(u+ph+.25)*8),0],jaw:[4+S(u*6+ph)*2,0,0],ear_L:[S(u*3+ph)*5,0,0],ear_R:[S(u*3+ph+.3)*5,0,0]});
  const idleHead=u=>({neck:[S(u)*3,S(u*2)*4,0],head:[S(u+.2)*3,S(u)*8,0],jaw:[4+S(u*8)*2,0,0],ear_L:[S(u*2)*5,0,0],ear_R:[S(u*2+.3)*5,0,0],tail:[S(u)*3,S(u*2)*6,0],chest:[S(u*4)*.8,0,0]});
  const sides=(p,u,amp=1)=>cbTri(p,{head:[S(u+.3)*2*amp,(6+S(u+.15)*5)*amp,0],jaw:[S(u*3+.4)*3*amp,0,0]},{head:[S(u+.7)*2*amp,(-6-S(u+.55)*5)*amp,0],jaw:[S(u*3+.8)*3*amp,0,0]},true);
  const war=u=>cbTri(wgAdd(WAR,{body:[0,0,S(u)*1.5],neck:[S(u*2)*2,S(u)*6,0],head:[0,-S(u)*4,0],jaw:[S(u*12)*2,0,0],tail2:[0,S(u*2)*4,0],chest:[S(u*4)*1,0,0]}),
    {neck:[S(u*2+.3)*2,0,0],head:[S(u+.4)*3,8+S(u+.2)*6,0],jaw:[8+S(u*12+.3)*3,0,0]},{neck:[S(u*2+.6)*2,0,0],head:[S(u+.8)*3,-8-S(u+.7)*6,0],jaw:[8+S(u*12+.6)*3,0,0]},true);
  /* poses without side-head keys get the default: side heads follow the centre and keep looking outwards */
  const C1=[];const add=(name,dur,loop,fn,o)=>{const c=wgClip(m,name,dur,loop,(u,t)=>{const p=fn(u,t);return p.neckL?p:sides(p,u);},o);C1.push(c);return c;};
  add('Idle',4,true,u=>cbTri(idleHead(u),look(u,1,.35),look(u,-1,.7),false));
  add('Walk',1.25,true,hhGaitFn({L:CBL,T:1.25,v:1,beta:.62,lift:.17*K,slack:.93,flex:[40,15],ph:{BL:0,FL:.25,BR:.5,FR:.75},
    extra:u=>sides({chest:[0,S(u)*3,0],hips:[0,-S(u)*3,0],neck:[S(u*2)*2,-S(u)*3,0],head:[-S(u*2)*2,0,0],tail:[S(u*2)*2,S(u)*7,0],tail2:[0,S(u+.1)*6,0],jaw:[4,0,0]},u)}),{level:false}).speed=1;
  add('Run',.58,true,hhGaitFn({L:CBL,T:.58,v:5.2,beta:.32,lift:.24*K,slack:.88,flex:[60,15],ph:{BL:0,BR:.08,FL:.45,FR:.53},
    extra:u=>{const fl=S(u+.05);return cbTri({chest:[fl*5,0,0],hips:[-fl*5,0,0],pitch:S(u+.3)*2,neck:[14+S(u*2)*3,0,0],head:[-10-S(u*2)*3,0,0],jaw:[14,0,0],ear_L:[-40,0,0],ear_R:[-40,0,0],tail:[-12+S(u)*4,0,0],tail2:[10,0,0]},
      {neck:[-4,0,0],head:[0,6,0],jaw:[4,0,0]},{neck:[-4,0,0],head:[0,-6,0],jaw:[4,0,0]},true);}}),{level:false}).speed=5.2;
  /* sniff: the centre head noses the ground while the side heads stand guard */
  add('Sniff',3,true,u=>cbTri({neck:[50+S(u)*4,S(u)*12,0],head:[28+S(u*8)*4,S(u)*10,0],jaw:[2,0,0],ear_L:[10,0,0],ear_R:[10,0,0],tail:[0,S(u*2)*8,0],leg_FL:[-6,0,0],paw_FL:[6,0,0]},
    wgAdd(look(u,1,.2),{ear_L:[-20,0,0],ear_R:[-20,0,0]}),wgAdd(look(u,-1,.6),{ear_L:[-20,0,0],ear_R:[-20,0,0]}),false));
  add('Sit',3,true,u=>cbTri(wgAdd(SIT,{neck:[S(u)*3,S(u*2)*3,0],head:[S(u+.2)*3,S(u)*4,0],jaw:[4+S(u*8)*2,0,0],ear_L:[S(u*2)*5,0,0],ear_R:[S(u*2+.3)*5,0,0]}),
    wgAdd({neck:[8,0,-14],head:[-2,0,0]},look(u,1,.4)),wgAdd({neck:[8,0,14],head:[-2,0,0]},look(u,-1,.75)),false));
  add('Lie down',4,true,u=>cbTri(wgAdd(LIE,{neck:[S(u)*2,S(u*2)*4,0],head:[S(u+.2)*2,S(u)*5,0],ear_L:[S(u*2)*4,0,0],ear_R:[S(u*2+.3)*4,0,0],tail2:[0,S(u)*6,0],chest:[S(u*3)*.8,0,0]}),
    wgAdd({neck:[-5,0,0],head:[5,0,0]},look(u,1,.3)),wgAdd({neck:[-5,0,0],head:[5,0,0]},look(u,-1,.65)),false));
  /* howl: sits, the three heads throw back one after another and howl together, jaws trembling out of step */
  add('Howl',5,false,u=>{const sit=wgSeg(u,0,.16)*(1-wgSeg(u,.86,1)),hd=d=>{const up=wgSeg(u,.16+d,.26+d)*(1-wgSeg(u,.76,.86)),voice=wgSeg(u,.24+d,.3+d)*(1-wgSeg(u,.72,.78)),w=Math.sin((u+d)*Math.PI*14)*voice;
      return{neck:[-(d?10:28)*up,0,0],head:[-(d?44:46)*up+w*1.5,0,0],jaw:[3+26*voice+w*3,0,0],ear_L:[-28*up,0,0],ear_R:[-28*up,0,0]};},base=wgMix({},SIT,sit);
    const L=hd(.04),R=hd(.08);L.head[1]+=22*sit;R.head[1]-=22*sit;L.neck[0]+=18*sit;R.neck[0]+=18*sit;L.neck[2]-=14*sit;R.neck[2]+=14*sit;
    return cbTri(wgAdd(wgAdd(base,hd(0)),{chest:[-3*wgSeg(u,.24,.3)*(1-wgSeg(u,.72,.78)),0,0]}),wgAdd({neck:base.neck,head:base.head},L),wgAdd({neck:base.neck,head:base.head},R),false);});
  add('Idle (war mode)',2.4,true,war);
  add('Stalk',1.8,true,hhGaitFn({L:CBL,T:1.8,v:.6,beta:.7,lift:.14*K,slack:.8,flex:[30,10],ph:{BL:0,FL:.25,BR:.5,FR:.75},
    extra:u=>cbTri({chest:[4,S(u)*3,0],hips:[0,-S(u)*3,0],neck:[25+S(u*2)*2,S(u)*3,0],head:[-20,0,0],jaw:[10+S(u*4)*2,0,0],ear_L:[-35,0,0],ear_R:[-35,0,0],tail:[12,S(u)*4,0],tail2:[-8,0,0]},
      {neck:[-4,0,0],head:[S(u+.3)*3,8+S(u+.2)*5,0],jaw:[4+S(u*4+.3)*3,0,0]},{neck:[-4,0,0],head:[S(u+.6)*3,-8-S(u+.7)*5,0],jaw:[4+S(u*4+.6)*3,0,0]},true)}),{level:false}).speed=.6;
  /* growl: all three snarl, out of step */
  add('Growl',2,false,u=>{const k=wgSeg(u,0,.15)*(1-wgSeg(u,.8,1)),q=d=>Math.sin((u+d)*Math.PI*30)*k,g=d=>({neck:[8*k,0,0],head:[-10*k+q(d)*1.5,q(d)*1.5,0],jaw:[20*k+q(d)*3,0,0],ear_L:[-15*k,0,0],ear_R:[-15*k,0,0]});
    const w=war(0);return cbTri(wgAdd(w,Object.assign(g(0),{body:[0,0,q(0)*.6],_pos:[0,0,.05*k*K]})),g(.013),g(.027),true);});
  /* bites: the centre head lunges straight ahead; Bite left / right lunge the side head outwards; Triple bite snaps left, centre, right */
  const lunge=(u,a,s)=>{const T=(x,y)=>wgSeg(u,a+x*s,a+y*s),back=T(0,.22)*(1-T(.22,.4)),ln=T(.25,.42)*(1-T(.65,1)),open=T(.22,.36)*(1-T(.38,.45)),shake=Math.sin(T(.45,.66)*Math.PI*3)*(1-T(.62,.68));
    return{back,ln,p:{neck:[12*back-22*ln,0,0],head:[-8*back+18*ln-14*open,shake*14,shake*6],jaw:[40*open-10*ln*(1-open),0,0],ear_L:[-10*ln,0,0],ear_R:[-10*ln,0,0]}};};
  add('Bite',1.1,false,u=>{const B=lunge(u,0,1),dz=(-.15*B.back+.4*B.ln)*K;
    return wgPlant(cbTri(wgAdd(war(0),Object.assign(B.p,{chest:[-4*B.back+6*B.ln,0,0],_pos:[0,0,dz]})),{jaw:[12*B.ln,0,0],head:[0,12*B.ln,0]},{jaw:[12*B.ln,0,0],head:[0,-12*B.ln,0]},true),dz/K);});
  const sideBite=s=>u=>{const B=lunge(u,0,1),dz=(-.08*B.back+.2*B.ln)*K,w=war(0),bp=wgAdd(B.p,{head:[0,s*16*B.ln,0],neck:[-6*B.ln,0,0]}),calm={jaw:[10*B.ln,0,0],head:[0,-s*6*B.ln,0]};
    return wgPlant(cbTri(wgAdd(w,{chest:[-3*B.back+4*B.ln,0,0],_pos:[0,0,dz]}),s>0?bp:calm,s>0?calm:bp,true),dz/K);};
  add('Bite left',1.1,false,sideBite(1));add('Bite right',1.1,false,sideBite(-1));
  add('Triple bite',2,false,u=>{const L=lunge(u,0,.5),C=lunge(u,.25,.5),R=lunge(u,.5,.5),dz=(.12*L.ln+.3*C.ln+.12*R.ln-.1*C.back)*K;
    return wgPlant(cbTri(wgAdd(war(0),Object.assign(C.p,{chest:[-3*C.back+5*C.ln,0,0],_pos:[0,0,dz]})),wgAdd(L.p,{head:[0,14*L.ln,0]}),wgAdd(R.p,{head:[0,-14*R.ln,0]}),true),dz/K);});
  /* pounce: crouches, leaps forward with the forelegs reaching and all three jaws open, lands, backs off */
  add('Pounce',1.9,false,u=>{const cr=wgSeg(u,0,.2)*(1-wgSeg(u,.26,.32)),air=wgSeg(u,.3,.36)*(1-wgSeg(u,.56,.62)),land=wgSeg(u,.6,.66)*(1-wgSeg(u,.72,.9)),fly=Math.max(0,Math.min(1,(u-.3)/.32)),
      dz=(-.15*cr+(.95*wgSeg(u,.28,.62))*(1-wgSeg(u,.7,1)))*K,lift=Math.sin(fly*Math.PI)*.55*K;
    let p=wgAdd(war(0),{leg_BL:[-20*cr+40*air,0,0],leg_BR:[-20*cr+42*air,0,0],knee_BL:[30*cr-20*air,0,0],knee_BR:[30*cr-20*air,0,0],hock_BL:[-30*cr+15*air,0,0],hock_BR:[-30*cr+15*air,0,0],paw_BL:[20*cr+30*air,0,0],paw_BR:[20*cr+30*air,0,0],
      leg_FL:[15*cr-60*air+10*land,0,0],leg_FR:[15*cr-55*air+10*land,0,0],knee_FL:[15*cr-30*air+25*land,0,0],knee_FR:[15*cr-30*air+25*land,0,0],paw_FL:[-10*cr+50*air-20*land,0,0],paw_FR:[-10*cr+50*air-20*land,0,0],
      chest:[6*cr-10*air+8*land,0,0],tail:[-20*air,0,0],body:[-12*air+6*land,0,0],_pos:[0,lift,dz]});
    const hd={neck:[10*cr-15*air,0,0],head:[-10*cr+10*air,0,0],jaw:[35*air+10*land,0,0],ear_L:[-10*air,0,0],ear_R:[-10*air,0,0]};
    for(const n of CB_HK)p=wgAdd(p,{[n]:hd[n]});for(const s of['L','R'])CB_HK.forEach((n,i)=>{p=wgAdd(p,{[CB_SN[s][i]]:hd[n]});});
    return u>.62?wgPlant(p,dz/K-.95):p;},{level:u=>u<.3||u>.64});
  add('Claw swipe',1.3,false,u=>{const up=wgSeg(u,0,.25)*(1-wgSeg(u,.65,.95)),sw=wgSeg(u,.28,.48),dn=1-wgSeg(u,.6,.9),w=war(0),hd={neck:[-8*up+10*sw*up,0,0],head:[0,(-12+24*sw)*up,0],jaw:[22*up,0,0]};
    let p=wgAdd(w,Object.assign({body:[-16*up,0,0],chest:[-4*up,0,0],leg_FR:[(-85+70*sw)*up*dn+15*(1-dn),0,(-28+50*sw)*up],knee_FR:[(-30+90*sw)*up,0,0],paw_FR:[(60-30*sw)*up,0,0],
      leg_FL:[20*up,0,0],knee_FL:[-25*up,0,0],paw_FL:[5*up,0,0],leg_BL:[12*up,0,0],leg_BR:[12*up,0,0],knee_BL:[-10*up,0,0],knee_BR:[-10*up,0,0],hips:[4*up,(-8+16*sw)*up,0],_pos:[0,0,.12*sw*up*K]},hd));
    for(const s of['L','R'])CB_HK.forEach((n,i)=>{if(hd[n])p=wgAdd(p,{[CB_SN[s][i]]:[hd[n][0],hd[n][1]*.5,0]});});return p;},{level:false});
  /* fire breath: the three heads draw breath raised, then thrust forward and low with the jaws wide; the centre sweeps left to right, the side heads sweep their own flanks
     (the fire itself is left to a separate effect; the mouths glow) */
  add('Fire breath',2.8,false,u=>{const inh=wgSeg(u,0,.25)*(1-wgSeg(u,.28,.36)),br=wgSeg(u,.28,.36)*(1-wgSeg(u,.8,.95)),sw=Math.sin(wgSeg(u,.36,.8)*Math.PI*2)*br,dz=(-.1*inh+.06*br)*K;
    const hd=(d,yaw,ys)=>{const q=Math.sin((u+d)*Math.PI*40)*br,s2=Math.sin(wgSeg(u,.36+d,.8)*Math.PI*2)*br;return{neck:[-24*inh+8*br,0,0],head:[-22*inh-12*br+q,yaw*(br+inh)+ys*s2,0],jaw:[6*inh+38*br+q*2,0,0],ear_L:[-15*br,0,0],ear_R:[-15*br,0,0]};};
    return wgPlant(cbTri(wgAdd(WAR,Object.assign(hd(0,0,0),{chest:[-8*inh+4*br,0,0],neck:[-12*inh+8*br,-6*sw,0],tail:[10*br,0,0],_pos:[0,0,dz]})),wgAdd({neck:WAR.neck,head:WAR.head},hd(.02,10,8)),wgAdd({neck:WAR.neck,head:WAR.head},hd(.04,-10,-8)),false),dz/K);});
  add('Hit',.7,false,u=>{const k=u<.08?wgSeg(u,0,.08):1-wgSeg(u,.25,1),dz=-.14*k*K;
    return wgPlant(cbTri(wgAdd(war(0),{neck:[-14*k,-5*k,0],head:[-18*k,-12*k,8*k],jaw:[22*k,0,0],ear_L:[-25*k,0,0],ear_R:[-25*k,0,0],chest:[-5*k,0,0],tail:[-15*k,0,0],_pos:[0,0,dz]}),
      {neck:[10*k,0,0],head:[6*k,14*k,-6*k],jaw:[-8*k,0,0]},{neck:[10*k,0,0],head:[6*k,-14*k,6*k],jaw:[-8*k,0,0]},true),dz/K);});
  /* death: rears back from the blow, the legs buckle and it slumps onto its belly, leaning onto the right; the three heads drop to the ground fanned out, jaws slack */
  add('Death',3,false,u=>{const hit=wgSeg(u,0,.1)*(1-wgSeg(u,.15,.35)),drop=wgSeg(u,.16,.5),slump=wgSeg(u,.4,.72),settle=wgSeg(u,.68,.85),bob=Math.sin(wgSeg(u,.6,.75)*Math.PI)*.03*K;
    const p=wgAdd(wgMix(WAR,LIE,drop),{leg_FL:[0,0,10*drop],leg_FR:[0,0,-10*drop],body:[0,0,3*slump],chest:[-6*hit,0,0],tail:[65*slump,0,0],tail2:[-74*slump,0,0],_pos:[0,bob,-.12*hit*K]});
    const hd=(s,ph)=>{const fl=wgSeg(u,.42+ph,.74+ph);return{neck:[-22*hit+(s?76:56)*fl,0,-s*10*fl],head:[-14*hit+10*drop-(s?65:22)*fl,0,0],jaw:[16*hit+24*wgSeg(u,.7+ph,.86+ph),0,0],ear_L:[25*settle,0,0],ear_R:[25*settle,0,0]};};
    const base={neck:[WAR.neck[0]*(1-drop)+LIE.neck[0]*drop,0,0],head:[WAR.head[0]*(1-drop)+LIE.head[0]*drop,0,0]};
    return cbTri(wgAdd(Object.assign(p,base),hd(0,0)),wgAdd(base,hd(1,.04)),wgAdd(base,hd(-1,-.02)),false);});
  for(const n of['Growl','Bite','Bite left','Bite right','Triple bite','Pounce','Claw swipe','Fire breath','Hit'])C1.find(c=>c.name===n).next='Idle (war mode)';
  return C1;}

ASSETS.push({id:'cerberus',folder:'characters/enemies/hell',name:'Cerberus',kind:'character',variants:true,defaultSeed:1,groundR:3.2,build:(s,o)=>buildCerberus(s,o||{}),
  opts:[{key:'fur',label:'Fur',choices:[['random','Random'],...Object.entries(HH_FUR).map(([k,v])=>[k,v[1]])],def:'random'},
    {key:'glow',label:'Fire',choices:[['random','Random'],...Object.entries(HH_GLOW).map(([k,v])=>[k,v[1]])],def:'random'},
    {key:'mane',label:'Mane',choices:[['random','Random'],['shaggy','Shaggy'],['short','Short']],def:'random'},
    {key:'scars',label:'Scars',choices:[['random','Random'],['yes','Yes'],['no','No']],def:'random'},
    {key:'gear',label:'Gear',choices:[['none','None'],['collar','Spiked collars']],def:'none'}],
  desc:'Three-headed guardian hound of Hell, about 2.2 m at the shoulder hump: the hellhound\'s build scaled up with an even wider front, three huge heads with big jaws full of fangs on thick splayed necks, fire glowing through the throats, chest, belly and mouths. Fur, fire colour, mane, scars, spiked collars. Idle, walk, run, sniff, sit, lie down, howl, war-mode idle, stalk, growl, bite, bite left, bite right, triple bite, pounce, claw swipe, fire breath, hit and death.'});
