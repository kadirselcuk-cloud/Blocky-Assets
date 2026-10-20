/* ======================= GOBLINS: short, bulky enemies on the villager joint layout =======================
   The goblin builds its own meshes on the same 25 joints as the villager (so the warrior's leg/arm IK and gait tools work
   unchanged): short bent legs, long thick arms, a pot belly, a big head with a long nose, tusks and long pointed ears.
   Clips are authored in metres (the warrior's are in leg-length units) and converted by gbU before solving. */
VB.goblin={thigh:.25,shin:.23,ankle:.05,hipOff:.04,spine:.08,chest:.15,neck:.2,headY:.04,shW:.23,ua:.235,fa:.22,g:1.05,hipW:.088,head:1.25,chestSx:1,hipsR:1,waist:1,hand:1.2,arm:1.2,td:1.4,hipK:1.05,waistK:1,sex:'male'};
{const b=VB.goblin;b.key='goblin';b.hipH=b.thigh+b.shin+b.ankle+b.hipOff;b.legS=(b.thigh+b.shin)/.84;b.tS=(b.spine+b.chest)/.3;b.cS=b.neck/.22;}
const GB_SKIN={yellow:['#887b4b','dark yellow'],green:['#627d45','green'],dkgreen:['#435830','dark green'],red:['#5e3b34','dark red'],grey:['#524f4c','dark grey']};
const GB_RAG=[['#625645','mud-brown'],['#534e45','grey-brown'],['#6c604b','sackcloth'],['#453c33','dark brown'],['#57533d','dirty olive'],['#5c473b','rust-brown'],
  ['#6a423b','faded red'],['#4b4f6d','dull blue'],['#897b4b','mustard'],['#4f5e39','moss-green'],['#57465b','faded purple'],['#416056','grimy teal'],['#7f6246','ochre'],['#99927f','dirty white'],['#2d2b29','soot-black'],['#7b5544','rust-orange'],['#663c49','wine']];
const GB_WPN={sword:'crude shortsword',axe:'one-handed axe',club:'spiked club'};

/* weapons: grip at the origin, along +y, striking edge towards +x */
function gbWeapon(kind){const w=new THREE.Group(),ir=vm('iron'),dk=bm('#55565c','plain'),rust=bm('#654937','plain'),wood=bm('#5c4633','leather'),wdD=bm('#46372a','leather'),wrap=bm('#382b21','leather');
  if(kind==='sword'){bx(w,.046,.15,.046,wrap,0,.015,0);bx(w,.056,.03,.056,dk,0,-.072,0);bx(w,.15,.035,.05,dk,.005,.09,0,0,0,.06);
    bx(w,.075,.17,.022,ir,0,.19,0);bx(w,.07,.16,.022,ir,.004,.355,0);bx(w,.06,.12,.022,ir,-.002,.49,0);bx(w,.035,.06,.022,ir,-.012,.58,0);
    bx(w,.03,.05,.026,rust,.018,.16,0);bx(w,.025,.07,.026,rust,-.015,.4,0);bx(w,.02,.03,.026,rust,.012,.5,0);w.userData.len=.61;}
  else if(kind==='axe'){bx(w,.045,.6,.045,wood,0,.23,0);bx(w,.05,.13,.05,wrap,0,-.005,0);
    bx(w,.06,.12,.034,dk,.04,.44,0);bx(w,.06,.17,.024,ir,.095,.44,0);bx(w,.02,.2,.026,bm('#9ea2a6','plain'),.132,.44,0);bx(w,.045,.06,.04,dk,-.035,.44,0);
    for(const y of[.37,.51])bx(w,.055,.025,.055,vm('rope'),0,y,0);bx(w,.025,.04,.028,rust,.08,.4,0);w.userData.len=.53;}
  else{bx(w,.046,.17,.046,wrap,0,.015,0);bx(w,.062,.16,.062,wood,0,.17,0);bx(w,.09,.16,.09,wood,.005,.31,0);bx(w,.115,.15,.105,wdD,0,.45,.005,0,.2,0);bx(w,.08,.05,.08,wood,0,.545,0);
    bx(w,.04,.05,.04,wdD,-.06,.3,.01);for(const[x,y,z]of[[.065,.44,0],[-.065,.47,.02],[0,.4,.06],[.02,.5,-.06]])bx(w,Math.abs(x)?.05:.018,.018,Math.abs(z)?.05:.018,ir,x,y,z);w.userData.len=.57;}
  return w;}

function buildGoblin(seed,o={}){const B=o.B||VB.goblin,r=mulberry32(((seed*2654435761)>>>0)^0x9b17),pick=a=>a[Math.floor(r()*a.length)],g=B.g,root=new THREE.Group();root.userData.lights=[];
  /* roll everything, then let the options override */
  const SK=o.skins||GB_SKIN,hb=o.hob,rk=pick(Object.keys(SK)),rt=pick(['shirt','shirt','none']),rl=pick(['shorts','pants']),hairS0=pick(['bald','bald','tufts','strands']),hairC=pick(['#1d1b19','#372b22','#615e59']);
  let hairS=hairS0;const shirtC=pick(GB_RAG);let legC;do{legC=pick(GB_RAG);}while(legC===shirtC);let patchC;do{patchC=pick(GB_RAG);}while(patchC===shirtC||patchC===legC);
  const skinK=o.skin&&o.skin!=='random'?o.skin:rk,top=o.top&&o.top!=='random'?o.top:(hb?hb.top:rt),legs=o.legs&&o.legs!=='random'?o.legs:rl,wpn=o.weapon||'sword',jerk=top==='jerkin',shirt=top==='shirt'||jerk;
  if(hb&&hb.hair)hairS=hb.hair;
  const sk=SK[skinK],shade=(h,f)=>'#'+new THREE.Color(h).multiplyScalar(f).getHexString(),skin=bm(sk[0],'skin'),skinD=bm(shade(sk[0],.74),'skin'),skinM=bm(shade(sk[0],.55),'skin'),skinX=bm(shade(sk[0],.4),'skin'),browM=bm(shade(sk[0],.3),'skin'),
    shirtM=jerk?bm(hb.jerkC[0],'leather'):bm(shirtC[0]),legM=bm(legC[0]),patchM=bm(patchC[0]),dark=bm('#1a1411','plain'),eyeM=bm('#b9aa66','plain'),ivory=bm('#d9d1b9','plain'),claw=bm('#38302a','plain'),hairM=bm(hairC,'hair'),rope=vm('rope');
  const torso=shirt?shirtM:skin;
  /* joints: same names, offsets and order as buildVillager */
  const hips=J('hips',root,0,B.hipH,0),spine=J('spine',hips,0,B.spine,0),chest=J('chest',spine,0,B.chest,0),neck=J('neck',chest,0,B.neck,0),head=J('head',neck,0,B.headY,0);
  const aw=.12*g*B.arm,lw=.13*g,TW=2*(B.shW-aw/2),TD=.18*g*B.td,HW=TW*B.hipK,fk=B.ankle/.06,hk=B.hand;
  /* ragged hem: teeth of random length hanging below y around a w x d garment */
  const hem=(par,w,d,y,m,n,L0,L1)=>{for(const[f,s]of[[1,1],[1,-1],[0,1],[0,-1]]){const span=f?w:d;for(let i=0;i<n;i++){if(r()<.3)continue;const tw=span/n*(.55+.35*r()),L=L0+(L1-L0)*r(),c=-span/2+(i+.5)*span/n;
    if(f)bx(par,tw,L,.022,m,c,y-L/2+.004,s*(d/2+.004));else bx(par,.022,L,tw,m,s*(w/2+.004),y-L/2+.004,c);}}};
  /* torso: hips (in the legwear cloth), pot belly, chest, heavy shoulders */
  bx(hips,HW,.15,TD*.94,legM,0,-.03,0);
  bx(spine,TW*1.07,.2,TD,torso,0,.06,0);bx(spine,TW*.8,.13,.05,torso,0,.04,TD/2+.02);
  bx(chest,TW,.21,TD*.92,torso,0,.1,0);bx(chest,TW*.82,.075,TD*.62,torso,0,.2,-.02);
  if(shirt){bx(spine,TW*1.07+.012,.05,TD+.012,shirtM,0,-.035,0);hem(spine,TW*1.07+.012,TD+.012,-.06,shirtM,4,.025,.07);
    const fz=TD*.92/2+.004,bz=TD/2+.004;bx(chest,.06,.06,.008,patchM,(r()-.5)*.14,.07+r()*.05,fz);bx(chest,.06,.05,.008,patchM,(r()-.5)*.14,.08,-fz);
    if(!jerk){bx(spine,.045,.035,.008,skin,(r()<.5?-1:1)*(.06+r()*.04),.09,bz+.045*0+.001);bx(chest,.04,.04,.008,skin,(r()-.5)*.16,.14,-fz-.001);}
    else{/* hobgoblin jerkin: rows of iron studs front and back, a darker collar */
      const st=vm('iron'),cz=TD*.92/2+.005,sz=TD/2+.005;for(const y of[.04,.11,.18])for(const x of[-.1,-.035,.035,.1]){bx(chest,.02,.02,.01,st,x,y,cz);bx(chest,.02,.02,.01,st,x,y,-cz);}
      for(const x of[-.12,-.04,.04,.12])bx(spine,.02,.02,.01,st,x,.1,sz);bx(chest,TW*.86,.04,TD*.66,bm(shade(hb.jerkC[0],.7),'leather'),0,.235,-.02);}}
  else{bx(chest,.1,.012,.008,skinX,.06,.07,TD*.46+.002,0,0,-.15);bx(chest,.1,.012,.008,skinX,-.06,.07,TD*.46+.002,0,0,.15);bx(spine,.02,.02,.008,skinX,0,.05,TD/2+.046);}
  if(!o.shaman&&!hb){bx(hips,HW+.03,.035,TD*.94+.03,rope,0,.035,0);bx(hips,.05,.05,.035,rope,.07,.03,TD*.47+.03);bx(hips,.02,.08,.02,rope,.08,-.02,TD*.47+.035,0,0,.2);}
  else{/* shaman and hobgoblin: thick leather belt with a crude iron buckle, and a necklace of teeth with a big fang */
    const belt=bm('#36281d','leather'),ir=vm('iron'),bz=(TD*.94+.05)/2;bx(hips,HW+.05,.07,TD*.94+.05,belt,0,.03,0);bx(hips,.08,.08,.014,ir,0,.03,bz+.005);bx(hips,.04,.04,.016,belt,0,.03,bz+.007);bx(hips,.05,.07,.012,belt,-.06,-.03,bz+.002);if(o.shaman){
    const cord=bm('#271f19','leather'),fz=TD*.46,uz=TD*.31-.02,cy=.205;bx(chest,.21,.012,.012,cord,0,cy-.016,fz+.006);for(const s of[-1,1]){bx(chest,.012,.012,fz-uz,cord,s*.1,cy+.006,(fz+uz)/2);bx(chest,.012,.045,.012,cord,s*.1,cy+.022,uz+.006);}
    bx(chest,.212,.012,.012,cord,0,.244,uz+.006);bx(chest,.212,.012,.012,cord,0,.244,-.072);for(const s of[-1,1])bx(chest,.012,.012,uz+.078,cord,s*.1,.244,(uz-.072)/2);
    for(const x of[-.08,-.045,.045,.08])bx(chest,.016,.034,.012,ivory,x,cy-.04,fz+.008);bx(chest,.03,.06,.016,ivory,0,cy-.05,fz+.01);bx(chest,.014,.02,.014,dark,-.063,cy-.016,fz+.01);bx(chest,.014,.02,.014,dark,.063,cy-.016,fz+.01);}}
  bx(neck,.15,.08,.14,skin,0,.02,.01);
  /* head: wide jaw, brow ridge, yellow eyes, long hooked nose, tusks, long ears pointing out and back */
  const hg=new THREE.Group();head.add(hg);hg.scale.setScalar(B.head);hg.position.z=.02;const S=.28,FZ=.123;
  bx(hg,S,S*.86,S*.95,skin,0,S*.57,-.01);bx(hg,S*1.04,.09,S*.9,skin,0,.045,.01);
  bx(hg,S*.98,.035,.04,skinM,0,.178,FZ+.01);
  for(const s of[-1,1]){bx(hg,.06,.035,.012,eyeM,s*.06,.143,FZ+.004);bx(hg,.022,.03,.014,dark,s*.05,.141,FZ+.006);bx(hg,.085,.024,.03,browM,s*.06,.168,FZ+.022,0,0,s*.3);bx(hg,.02,.012,.01,skinX,s*.012,.058,FZ+.116);}
  bx(hg,.05,.07,.05,skin,0,.11,FZ+.022);bx(hg,.042,.05,.05,skin,0,.09,FZ+.065);bx(hg,.03,.035,.03,skinD,0,.072,FZ+.1);
  bx(hg,.17,.018,.012,dark,0,.048,.142);for(const s of[-1,1])bx(hg,.022,.045,.022,ivory,s*.055,.07,.142);
  for(const s of[-1,1]){const e=new THREE.Group();put(hg,e,s*S/2,.16,-.03,0,s*.6,s*.32);
    bx(e,.06,.1,.03,skin,s*.03,0,0);bx(e,.05,.07,.025,skin,s*.08,.005,0);bx(e,.045,.045,.02,skin,s*.122,.01,0);bx(e,.035,.022,.018,skin,s*.16,.014,0);bx(e,.07,.05,.01,skinX,s*.055,0,.016);bx(e,.035,.025,.01,skinX,s*.11,.008,.012);
    if(o.shaman&&(o.shaman.ear==='both'||o.shaman.ear===(s>0?'L':'R'))){const au=bm('#a78e5c','plain'),x=s*.035;bx(e,.012,.012,.05,au,x,-.048,0);for(const z of[-.019,.019])bx(e,.012,.05,.012,au,x,-.068,z);bx(e,.012,.012,.05,au,x,-.088,0);}}
  if(hb&&hb.helm==='cap'&&hairS!=='strands')hairS='bald';
  if(hairS==='tufts')for(const[x,z,h]of[[0,0,.05],[-.05,-.05,.04],[.05,-.03,.035],[0,-.09,.04]])bx(hg,.04,h,.04,hairM,x,.28+h/2-.005,z);
  if(hairS==='strands'){bx(hg,S*.7,.1,.03,hairM,0,.2,-.148);for(const s of[-1,1])bx(hg,.03,.08,.06,hairM,s*(S/2+.008),.2,-.09);}
  if(hairS==='crest')for(let i=0;i<5;i++){const h=.05+.025*Math.sin(Math.PI*i/4);bx(hg,.035,h,.05,hairM,0,.28+h/2-.005,.08-i*.052);}
  if(hb&&hb.helm==='cap'){/* hobgoblin iron cap: riveted dome with a darker rim, a low boss on top */
    const ir=vm('iron'),irD=bm('#48494f','plain'),HZ=-.01,HD=S*.95+.026;bx(hg,S+.026,.075,HD,ir,0,.25,HZ);bx(hg,S*.84,.035,HD*.84,ir,0,.304,HZ);bx(hg,S*.4,.025,HD*.4,irD,0,.333,HZ);
    bx(hg,S+.034,.026,HD+.008,irD,0,.207,HZ);for(const x of[-.09,0,.09]){bx(hg,.014,.014,.008,irD,x,.26,HZ+HD/2+.003);bx(hg,.014,.014,.008,irD,x,.26,HZ-HD/2-.003);}}
  const sockHead=J('socket_head',head,0,(S+.03)*B.head,0);sockHead.userData.socket=true;
  /* arms: long and thick, clawed hands */
  for(const[sd,s]of[['L',1],['R',-1]]){const sh=J('shoulder_'+sd,chest,s*B.shW*.325,.165*B.cS,0),ua=J('upperArm_'+sd,sh,s*B.shW*.675,0,0),fa=J('foreArm_'+sd,ua,0,-B.ua,0),hd=J('hand_'+sd,fa,0,-B.fa,0);
    bx(ua,aw,B.ua+aw/2,aw,skin,0,-B.ua/2+aw/4,0);
    if(shirt){bx(ua,aw*1.25,.15,aw*1.2,shirtM,s*.008,-.03,0);hem(ua,aw*1.25,aw*1.2,-.105,shirtM,2,.02,.05);}else bx(ua,aw*1.2,.11,aw*1.14,skin,s*.008,0,0);
    bx(fa,aw*1.1,B.fa*.7,aw*1.1,skin,0,-B.fa*.35,0);bx(fa,aw*.82,B.fa*.32,aw*.82,skin,0,-B.fa*.82,0);
    if(hb){/* hobgoblin: leather bracers bound with cord; an iron pauldron on the left shoulder */
      bx(fa,aw*1.18,B.fa*.42,aw*1.18,bm(hb.bracerC,'leather'),0,-B.fa*.38,0);for(const y of[-.22,-.54])bx(fa,aw*1.22,.016,aw*1.22,rope,0,B.fa*y,0);
      if(sd==='L'&&hb.pauldron){const ir=vm('iron'),irD=bm('#48494f','plain');bx(ua,aw*1.36,.04,aw*1.32,ir,s*.01,.04,0);bx(ua,aw*1.4,.05,aw*1.36,ir,s*.016,.0,0,0,0,-s*.1);bx(ua,aw*1.42,.014,aw*1.38,irD,s*.02,-.027,0,0,0,-s*.1);
        for(const z of[-1,1])bx(ua,.014,.014,.008,irD,s*.016,.0,z*(aw*.68+.004));}}
    const hw=aw*.85;bx(hd,hw*1.08,.09*hk,hw*1.1,skin,0,-.04*hk,0);
    const fg=J('fingers_'+sd,hd,0,-.085*hk,0),ft=J('fingerTips_'+sd,fg,0,-.035*hk,0),th=J('thumb_'+sd,hd,-s*.02*hk,-.04*hk,hw/2);
    bx(fg,hw*.85,.04*hk,hw*.98,skin,s*.005,-.016*hk,0);bx(ft,hw*.75,.03*hk,hw*.92,skin,s*.005,-.012*hk,0);bx(th,.03*hk,.05*hk,.03*hk,skin,0,-.018*hk,.006);
    for(let i=-1;i<=1;i++)bx(ft,.014,.022,.016,claw,s*.005,-.036*hk,i*hw*.32);bx(th,.016,.02,.016,claw,0,-.05*hk,.006);
    const so=J('socket_'+sd,hd,-s*.012*hk,-.088*hk,0);so.userData.socket=true;}
  /* legs: short and thick; ragged shorts or pants; bare feet with toes */
  for(const[sd,s]of[['L',1],['R',-1]]){const th=J('thigh_'+sd,hips,s*B.hipW,-(B.hipOff+.01),0),sn=J('shin_'+sd,th,0,-B.thigh,0),ft=J('foot_'+sd,sn,0,-B.shin,0);
    const tw=lw*1.12,tl=B.thigh+lw/2;
    if(legs==='shorts'){bx(th,tw,tl,tw,skin,0,-B.thigh/2+lw/4,0);const Lc=B.thigh*.58;bx(th,tw+.02,Lc+lw/2,tw+.02,legM,0,(-Lc+lw/2)/2,0);hem(th,tw+.02,tw+.02,-Lc,legM,2,.02,.05);}
    else{bx(th,tw+.012,tl,tw+.012,legM,0,-B.thigh/2+lw/4,0);if(r()<.6)bx(th,.06,.06,.008,patchM,0,-B.thigh*.85,(tw+.012)/2+.003);}
    bx(sn,lw*.98,B.shin,lw,skin,0,-B.shin/2,0);
    if(legs==='pants'){const Lp=B.shin*.68;bx(sn,lw*.98+.02,Lp,lw+.02,legM,0,-Lp/2,0);hem(sn,lw*.98+.02,lw+.02,-Lp,legM,2,.02,.045);}
    const zh=.03*g-lw*.8,zt=.03*g+lw*.8,fl=lw*1.36;bx(ft,lw*1.04,.07*fk,fl,skin,0,-.035*fk,zh+fl/2);
    for(let i=-1;i<=1;i++){const big=i===-s?1.2:1,tz=zh+fl+(zt-zh-fl)/2;bx(ft,lw*.3*big,.036*fk*big,zt-zh-fl+.004,skin,i*lw*.34,-.07*fk+.018*fk*big,tz-.002);bx(ft,lw*.2*big,.012,.012,claw,i*lw*.34,-.07*fk+.032*fk*big,zt-.008);}}
  /* weapon in the right hand: grip on the socket, blade or head along the thumb side, edge towards the fingers */
  const D2=Math.PI/180,Jn=n=>root.getObjectByName(n);
  if(wpn!=='none'){const wr=new THREE.Group();wr.name='weapon_R';root.getObjectByName('socket_R').add(wr);const wp=(o.wpnFn||gbWeapon)(wpn);wp.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(new THREE.Vector3(0,-1,0),new THREE.Vector3(0,0,1),new THREE.Vector3(-1,0,0)));wr.add(wp);
  /* the fist closes around the weapon while it is held (the death clips let it fall) */
  root.userData.post=()=>{if(wr.position.lengthSq()>1e-6)return;Jn('fingers_R').rotation.set(0,0,95*D2);Jn('fingerTips_R').rotation.set(0,0,90*D2);Jn('thumb_R').rotation.set(14*D2,0,33*D2);};}
  const joints=[];root.traverse(q=>{if(q.userData.joint&&!q.userData.socket)joints.push(q);});root.userData.joints=joints;
  if(!o.noClips)root.userData.clips=goblinClips(B,wpn);root.userData.ground=1.6;
  root.userData.look={sk,top,legs,shirtC,legC,hairS};
  const hairT={bald:'bald',tufts:'tufts of hair',strands:'straggly hair'}[hairS];
  root.userData.variantText=`${sk[1].charAt(0).toUpperCase()+sk[1].slice(1)} skin, ${hairT}; ${shirt?`ragged ${shirtC[1]} shirt`:'no shirt'}, ragged ${legC[1]} ${legs}${wpn==='none'?'':'; '+GB_WPN[wpn]}.`;
  return root;}

/* ---------- clips ---------- */
const GCLIPS={};
/* war stance (metres): low and wide, left side forward, weapon raised, left claw reaching out */
const GB_ST={HP:[0,-.08,0],h:[14,-20,0],sp:[12,-4,0],ch:[8,-6,0],nk:[0,0,0],hd:[0,0,0],FL:[.12,.11,-14,0,0],FR:[-.13,-.13,-42,0,0],
    gR:[-.3,.7,.34],dR:[-.1,.8,.6],eR:[0,0,1],pR:[-.8,-.4,-.4],gL:[.18,.7,.42],dL:[.3,.6,.7],pL:[.85,-.5,-.2],fist:[45,95]};
/* IK keys are authored in metres; the solver wants leg-length units */
function gbU(B,o){const k=B.legS,q=Object.assign({},o);q.HP=q.HP.map(v=>v/k);for(const c of['FL','FR']){const F=q[c].slice();F[0]/=k;F[1]/=k;F[3]=(F[3]||0)/k;q[c]=F;}for(const c of['gR','gL'])q[c]=q[c].map(v=>v/k);return q;}
function goblinBaseClips(B){if(GCLIPS[B.key])return GCLIPS[B.key];const D=Math.PI*2,S=Math.sin,C=Math.cos,L=[],k=B.legS,R2D=180/Math.PI;
  const headFix=(o,kk=.85)=>{const h=o.h||[0,0,0],sp=o.sp||[0,0,0],ch=o.ch||[0,0,0];o.hd=[(o.hd?o.hd[0]:0)-(h[0]+sp[0]+ch[0])*.7,(o.hd?o.hd[1]:0)-(h[1]+sp[1]+ch[1])*kk,-(h[2]+ch[2])*.8];return o;};
  /* arms hang from a hunched chest: turn them back by most of the forward lean */
  const armFix=o=>{const p=o.h[0]+o.sp[0]+o.ch[0];o.uL=[o.uL[0]+p*.7,o.uL[1],o.uL[2]];o.uR=[o.uR[0]+p*.7,o.uR[1],o.uR[2]];return o;};
  const FKgait=(name,G,note,o={})=>{const fn=gaitPose(B,G),n=o.strides||1,dur=G.dur*n,c=sampleClip(name,dur,t=>{const p=fn(n*t/dur);return o.mod?o.mod(p,t/dur):p;},{loop:true,autoFeet:false,note:`${note}, in place, ${fn.speed.toFixed(1)} m/s`},B);c.speed=fn.speed;L.push(c);};
  /* Idle: hunched on bent knees, weight shifting, head looking around */
  {const fk=legFK(B),dur=3.6;const pose=t=>{const p=D*t/dur,b=S(p),b2=S(2*p),sw=.01*S(p),hz=2*S(p);
      const o={h:[7,0,hz],sp:[10+.8*b2,0,-.5*hz],ch:[6+1.2*b2,2*S(p+.8),-.4*hz],uL:[-4+2*S(p+.5),0,10+1.5*b2],uR:[-12+2*S(p+.3),0,-10-1.5*b2],fL:[-22-3*b2,0,0],fR:[-34+2*b2,0,0],wL:[0,-10,0],wR:[20,10,0],fist:[30,95]};armFix(o);
      for(const[sd,s]of[['L',1],['R',-1]]){const z=s*5-hz-Math.asin(sw/(B.thigh+B.shin))*R2D,th=-16+s*1.2*b,kn=30-s*2*b;o['t'+sd]=[th-o.h[0],0,z];o['k'+sd]=[kn,0,0];o['a'+sd]=[-(th+kn),0,-(hz+z)];}
      headFix(o);o.hd[0]+=2*S(2*p+1);o.hd[1]+=22*S(p+.6);const s=fk(o);o.pos=[sw/k,(Math.max(-s.L,-s.R)-B.hipH)/k,0];return o;};
    L.push(sampleClip('Idle',dur,pose,{loop:true,autoFeet:false,note:'Hunched, weight shift, looking around'},B));}
  /* Walk: short quick waddling steps on bent knees */
  FKgait('Walk',{dur:.78,duty:.6,apex:0,abd:3,circ:3,
    thigh:pcurve([[0,-30],[.12,-24],[.3,-10],[.5,8],[.6,4],[.72,-16],[.86,-34],[.95,-33]]),
    knee:pcurve([[0,14],[.12,26],[.3,16],[.45,18],[.6,46],[.72,70],[.85,40],[.95,15]]),
    foot:pcurve([[0,-14],[.07,-1],[.2,0],[.4,1],[.52,11],[.6,28],[.7,10],[.82,-6],[.93,-13]]),
    body(u){const yaw=C(D*(u-.97)),arm=C(D*(u-.99)),el=C(D*(u-1.05)),hz=5*S(D*(u+.1));
      return headFix(armFix({sway:.03*S(D*(u-.05)),h:[7,-8*yaw,hz],sp:[10,2*yaw,-.3*hz],ch:[6+1.2*C(2*D*(u-.18)),8*yaw,-.5*hz],
        uL:[-4+24*arm,0,10+2*arm],uR:[-12-14*arm,0,-10+2*arm],fL:[-22-18*(.5-.5*el),0,0],fR:[-34-10*(.5+.5*el),0,0],wL:[4*arm,-8,0],wR:[20+8*arm,10,0],fist:[30,95]}));}},'Short waddling steps');
  /* Run: leaning in, knees high, arms pumping, flight phase */
  FKgait('Run',{dur:.5,duty:.32,apex:.03,abd:2,circ:3,
    thigh:pcurve([[0,-34],[.08,-20],[.2,2],[.32,20],[.42,16],[.56,-22],[.7,-56],[.82,-54],[.92,-42]]),
    knee:pcurve([[0,30],[.08,46],[.2,34],[.32,38],[.45,92],[.57,116],[.7,96],[.82,52],[.92,30]]),
    foot:pcurve([[0,2],[.06,0],[.16,2],[.26,18],[.34,42],[.46,55],[.6,34],[.76,2],[.88,-5]]),
    body(u){const yaw=C(D*(u-.92)),arm=C(D*(u-.9)),el=C(D*(u-.96)),hz=5*S(D*(u+.15));
      return headFix(armFix({sway:.016*S(D*(u+.07)),h:[16,-10*yaw,hz],sp:[12,3*yaw,-.3*hz],ch:[8+1.5*C(2*D*(u-.12)),12*yaw,-.5*hz],
        uL:[-10+40*arm,0,12+4*arm],uR:[-14-30*arm,0,-12+4*arm],fL:[-70-20*(.5-.5*el),0,0],fR:[-70-16*(.5+.5*el),0,0],wL:[-8,-6,0],wR:[12+35*arm,8,0],fist:[60,95]}),.8);}},'Leaning in, arms pumping');
  /* Run away: panicked flight, weapon waved overhead, free arm flailing, looking back over each shoulder in turn (4 strides) */
  FKgait('Run away',{dur:.46,duty:.3,apex:.035,abd:2,circ:3,
    thigh:pcurve([[0,-36],[.08,-22],[.2,2],[.3,22],[.4,18],[.55,-26],[.7,-62],[.82,-60],[.92,-46]]),
    knee:pcurve([[0,28],[.08,44],[.2,32],[.3,36],[.44,96],[.56,120],[.7,98],[.82,54],[.92,28]]),
    foot:pcurve([[0,2],[.06,0],[.16,2],[.24,18],[.32,42],[.45,55],[.6,34],[.76,2],[.88,-5]]),
    body(u){const yaw=C(D*(u-.92)),arm=S(D*u),hz=5*S(D*(u+.15));
      return armFix({sway:.016*S(D*(u+.07)),h:[10,-8*yaw,hz],sp:[6,3*yaw,-.3*hz],ch:[2,8*yaw,-.5*hz],
        uL:[-70+50*arm,0,35+15*S(2*D*u)],uR:[-130+18*arm,0,-40-8*arm],fL:[-60-35*S(D*(u+.2)),0,0],fR:[-30,0,0],wL:[-10,-10,0],wR:[70,0,0],fist:[15,95]});}},
    'Panicked flight, looking back over each shoulder',{strides:4,mod:(p,T)=>{const lk=S(D*T),tw=Math.sign(lk)*Math.pow(Math.abs(lk),.6);
      p.ch=[p.ch[0],p.ch[1]+22*tw,p.ch[2]];p.nk=[0,28*tw,0];headFix(p);p.hd[1]+=60*tw;p.hd[0]-=8;return p;}});

  /* ---- IK clips (metres): stance low and wide, left side forward, weapon raised by the head, left claw reaching out ---- */
  const R=wrRig(B,false);
  const gU=o=>gbU(B,o);
  const ST=GB_ST;
  const CC=(name,dur,fn,o)=>{const c=sampleClip(name,dur,t=>wrSolve(R,gU(fn(t))),Object.assign({autoFeet:false},o),B);L.push(c);return c;};
  const KC=(name,dur,keys,note)=>{const f=wrKeys(keys.map(q=>[q[0],wrP(ST,q[1])]));return CC(name,dur,f,{note});};
  const bob=(o,dy,dz=0)=>{o.gR=[o.gR[0],o.gR[1]+dy,o.gR[2]+dz];o.gL=[o.gL[0],o.gL[1]+dy*1.2,o.gL[2]+dz];return o;};
  const GAIT=(name,dur,G,note)=>{const fn=t=>{const u=t/dur,o=G.body(u),c2=C(D*(u-G.duty/2));o.HP=[G.sw*c2,G.y0-G.b*C(2*D*(u-G.duty/2)),0];
      for(const[sd,off,x,yaw]of[['L',0,G.x,G.yaw[0]],['R',.5,-G.x,G.yaw[1]]]){const q=(((u+off)%1)+1)%1;let z,l,pt;
        if(q<G.duty){const v=q/G.duty;z=G.s*(1-2*v);l=0;pt=v<.15?-10*(1-v/.15):v>.7?G.toe*(v-.7)/.3:0;}
        else{const v=(q-G.duty)/(1-G.duty),sm=v*v*(3-2*v);z=-G.s+2*G.s*sm;l=G.lift*Math.sin(Math.PI*Math.pow(v,G.lp||1));pt=G.toe*(1-v)*(1-v)-12*v*v;}
        o['F'+sd]=[x,z,yaw,l,pt];}return o;};
    const sp=2*G.s/(G.duty*dur),c=CC(name,dur,fn,{loop:true,note:`${note}, in place, ${sp.toFixed(1)} m/s`});c.speed=sp;};
  CC('Idle (war mode)',2.2,t=>{const p=D*t/2.2,b=S(p),b2=S(p+.6);return bob(wrP(ST,{HP:[.01*S(p*.5),-.08-.008*b,0],sp:[12+1.2*b,-4,0],ch:[8+1.5*b,-6,0],hd:[0,8*S(p*.5),0]}),-.012*b2);},{loop:true,note:'Low and wide, weapon raised, claw out'});
  GAIT('Walk (war mode)',.8,{duty:.62,s:.12,lift:.06,toe:22,x:.12,yaw:[-8,-26],y0:-.09,b:.008,sw:.012,
    body:u=>bob(wrP(ST,{h:[14,-12-4*C(D*u),3*S(D*(u+.1))],sp:[12,-3,0],ch:[8,-6,0]}),.01*C(2*D*u))},'Stalking, weapon raised');
  GAIT('Run (war mode)',.5,{duty:.36,s:.2,lift:.14,lp:.7,toe:32,x:.1,yaw:[-4,-12],y0:-.06,b:.016,sw:.01,
    body:u=>bob(wrP(ST,{h:[20,-8-6*C(D*u),3*S(D*(u+.1))],sp:[12,-3,0],ch:[6,-4,0],gL:[.2,.68,.36]}),.015*C(2*D*(u-.1)),.015*S(2*D*u))},'Charging, weapon ready');
  /* attacks: the edge (eR) faces the direction of the cut; downward cuts land to the right of the big head */
  KC('Light attack 1',.85,[[0,{}],
    [.2,{HP:[0,-.09,-.03],h:[12,-40,0],sp:[12,-8,0],ch:[6,-22,0],gR:[-.36,.9,-.08],dR:[-.4,.45,-.8],eR:[.3,0,1],pR:[-.5,-.3,-.8],gL:[.24,.74,.36]}],
    [.3,{HP:[0,-.1,.04],h:[14,-14,0],ch:[8,0,0],FL:[.12,.22,-10,.04,0],gR:[-.34,.84,.26],dR:[-.95,.1,.25],eR:[.2,0,1],pR:[-.4,-.8,-.4],gL:[.28,.72,.3]}],
    [.36,{HP:[0,-.11,.08],h:[16,4,0],sp:[12,4,0],ch:[8,18,0],FL:[.12,.27,-8,0,0],gR:[-.06,.78,.42],dR:[-.25,.05,.95],eR:[1,0,.2],pR:[-.4,-.8,-.4],gL:[.34,.7,.16],dL:[.8,.4,.4]}],
    [.44,{HP:[0,-.11,.08],h:[16,16,0],sp:[12,8,0],ch:[8,28,0],FL:[.12,.27,-8,0,0],gR:[.28,.7,.4],dR:[.7,-.1,.7],eR:[.7,0,-.7],pR:[-.3,-.9,-.3],gL:[.38,.7,0],dL:[.9,.3,-.1]}],
    [.56,{HP:[0,-.11,.07],h:[16,20,0],sp:[12,8,0],ch:[8,30,0],FL:[.12,.27,-8,0,0],gR:[.36,.66,.26],dR:[.8,-.1,.5],eR:[.3,0,-1],pR:[-.3,-.9,-.3],gL:[.38,.7,-.02],dL:[.9,.3,-.1]}],
    [.7,{HP:[0,-.09,.02],h:[14,-8,0],ch:[8,-4,0],FL:[.12,.18,-12,.04,0],gR:[-.22,.62,.42],dR:[-.3,.45,.85]}],
    [.85,{}]],'Quick slash, right to left, with a skip forward');
  KC('Light attack 2',.8,[[0,{}],
    [.22,{HP:[0,-.06,-.04],h:[6,-24,0],sp:[2,-4,0],ch:[-6,-10,0],gR:[-.24,1.34,0],dR:[-.1,.6,-.8],eR:[0,1,0],pR:[-.8,.3,-.2],gL:[.2,.78,.4]}],
    [.31,{HP:[0,-.09,.04],h:[12,-18,0],sp:[8,-2,0],ch:[2,-4,0],FL:[.12,.22,-10,.04,0],gR:[-.26,1.2,.4],dR:[0,.8,.6],eR:[0,0,1],pR:[-.8,.1,-.3]}],
    [.37,{HP:[0,-.12,.08],h:[16,-14,0],sp:[12,0,0],ch:[6,0,0],FL:[.12,.27,-8,0,0],gR:[-.24,.74,.6],dR:[0,0,1],eR:[0,-1,0],pR:[-.7,-.5,-.3],gL:[.26,.66,.3],dL:[.4,.5,.75]}],
    [.44,{HP:[0,-.15,.1],h:[18,-12,0],sp:[14,0,0],ch:[6,2,0],FL:[.12,.27,-8,0,0],gR:[-.24,.4,.52],dR:[0,-.42,.9],eR:[0,-.9,-.4],pR:[-.7,-.6,-.3],gL:[.3,.62,.22],dL:[.5,.4,.75]}],
    [.58,{HP:[0,-.14,.09],h:[17,-12,0],sp:[13,0,0],ch:[6,2,0],FL:[.12,.27,-8,0,0],gR:[-.24,.41,.5],dR:[0,-.4,.9],eR:[0,-.9,-.4],pR:[-.7,-.6,-.3],gL:[.28,.63,.24],dL:[.5,.4,.75]}],
    [.68,{HP:[0,-.1,.03],h:[14,-16,0],FL:[.12,.18,-12,.04,0],gR:[-.26,.66,.4],dR:[-.1,.6,.8]}],
    [.8,{}]],'Quick overhead chop, straight down');
  KC('Heavy attack',1.5,[[0,{}],
    [.42,{HP:[0,-.17,-.06],h:[10,-40,0],sp:[-2,-8,0],ch:[-10,-20,0],gR:[-.3,1.3,-.14],dR:[-.2,-.05,-.98],eR:[0,1,0],pR:[-.8,.3,-.3],gL:[.32,.94,.38],dL:[.3,.8,.5],pL:[.9,-.2,-.3],fist:[10,95]}],
    [.56,{HP:[0,-.05,.1],h:[4,-18,0],sp:[2,-4,0],ch:[-6,-8,0],FL:[.12,.3,-8,.07,0],gR:[-.32,1.32,.08],dR:[-.1,.95,.25],eR:[0,0,1],pR:[-.8,.2,-.3],gL:[.3,.9,.4],dL:[.3,.8,.5],fist:[10,95]}],
    [.64,{HP:[0,-.14,.2],h:[16,-6,0],sp:[12,2,0],ch:[6,6,0],FL:[.12,.38,-8,0,0],gR:[-.28,.96,.56],dR:[.05,.6,.8],eR:[0,-.6,.8],pR:[-.7,-.4,-.4],gL:[.32,.78,.24],dL:[.6,.5,.6]}],
    [.72,{HP:[0,-.22,.24],h:[18,-8,0],sp:[12,0,0],ch:[6,2,0],FL:[.12,.4,-8,0,0],gR:[-.22,.37,.52],dR:[0,-.4,.92],eR:[0,-.92,-.4],pR:[-.6,-.7,-.3],gL:[.34,.6,.14],dL:[.7,.5,.4]}],
    [.95,{HP:[0,-.23,.24],h:[18,-8,0],sp:[12,0,0],ch:[6,2,0],FL:[.12,.4,-8,0,0],gR:[-.22,.37,.52],dR:[0,-.4,.92],eR:[0,-.92,-.4],pR:[-.6,-.7,-.3],gL:[.34,.6,.14],dL:[.7,.5,.4]}],
    [1.15,{HP:[0,-.17,.18],h:[18,-4,0],sp:[14,2,0],ch:[6,4,0],FL:[.12,.4,-8,0,0],gR:[-.24,.6,.5],dR:[-.1,.5,.85],pR:[-.6,-.7,-.3]}],
    [1.32,{HP:[0,-.1,.04],h:[14,-14,0],FL:[.12,.22,-10,.05,0],gR:[-.28,.68,.36],dR:[-.1,.8,.55]}],
    [1.5,{}]],'Wind-up behind the head, lunge and smash down to the ground');
  /* jumps */
  const dip={HP:[0,-.18,-.02],h:[24,-18,0],sp:[16,-4,0],ch:[8,-6,0],gR:[-.34,.58,.12],dR:[-.2,.3,.93],gL:[.26,.5,-.02],dL:[.4,.3,.85]};
  KC('Jump',1.2,[[0,{}],[.22,dip],
    [.36,{HP:[0,0,.02],h:[2,-20,0],sp:[2,-4,0],ch:[0,-6,0],FL:[.12,.11,-14,0,30],FR:[-.13,-.13,-42,0,30],gR:[-.34,1.1,.36],dR:[-.1,.6,.8],gL:[.26,1.08,.32]}],
    [.56,{HP:[0,.2,0],h:[12,-20,0],sp:[10,-4,0],FL:[.12,.12,-14,.16,15],FR:[-.13,-.12,-42,.13,15],gR:[-.34,1.2,.36],dR:[-.1,.6,.8],gL:[.26,1.26,.34]}],
    [.76,{HP:[0,.0,0],h:[8,-20,0],FL:[.12,.11,-14,0,16],FR:[-.13,-.13,-42,0,16],gR:[-.3,.95,.32],dR:[-.1,.5,.86],gL:[.22,.94,.4]}],
    [.9,{HP:[0,-.17,-.02],h:[24,-20,0],sp:[16,-4,0],ch:[8,-6,0],gR:[-.32,.66,.32],dR:[-.15,.6,.78],gL:[.22,.6,.42]}],
    [1.2,{}]],'Squat, spring up about 0.2 m, land and absorb');
  {const hi={gR:[-.26,1.34,-.06],dR:[0,.3,-.95],eR:[0,1,0],pR:[-.8,.3,-.2],gL:[.24,1.0,.36]};
  KC('Jump & attack',1.5,[[0,{}],[.22,dip],
    [.3,{HP:[0,-.08,.01],h:[10,-18,0],sp:[6,-4,0],ch:[0,-6,0],gR:[-.44,1.0,.06],dR:[-.3,.9,-.3],eR:[0,1,0],pR:[-.9,0,-.3],gL:[.24,.8,.3]}],
    [.38,wrP(hi,{HP:[0,0,.03],h:[-2,-18,0],sp:[-4,-4,0],ch:[-8,-6,0],FL:[.12,.11,-14,0,30],FR:[-.13,-.13,-42,0,30]})],
    [.58,wrP(hi,{HP:[0,.22,.04],h:[0,-14,0],sp:[-4,0,0],ch:[-8,-4,0],FL:[.12,.14,-14,.18,15],FR:[-.13,-.1,-42,.15,15],gR:[-.28,1.58,-.06]})],
    [.76,{HP:[0,.01,.06],h:[10,-8,0],sp:[8,0,0],ch:[2,0,0],FL:[.12,.14,-14,0,16],FR:[-.13,-.1,-42,0,16],gR:[-.26,.95,.5],dR:[0,.3,.95],eR:[0,-.95,.3],pR:[-.7,-.5,-.3],gL:[.3,.8,.3]}],
    [.88,{HP:[0,-.2,.08],h:[20,-6,0],sp:[14,0,0],ch:[8,2,0],FL:[.12,.14,-14,0,0],FR:[-.13,-.1,-42,0,0],gR:[-.22,.34,.44],dR:[0,-.35,.94],eR:[0,-.94,-.35],pR:[-.7,-.6,-.3],gL:[.32,.58,.12],dL:[.6,.5,.5]}],
    [1.12,{HP:[0,-.19,.07],h:[19,-6,0],sp:[13,0,0],ch:[7,2,0],FL:[.12,.14,-14,0,0],FR:[-.13,-.1,-42,0,0],gR:[-.22,.35,.43],dR:[0,-.35,.94],eR:[0,-.94,-.35],pR:[-.7,-.6,-.3],gL:[.32,.6,.14],dL:[.6,.5,.5]}],
    [1.5,{}]],'Leap with the weapon raised, strike down on landing');}
  /* hit reactions: every one starts and ends in the war stance */
  /* light hits: a sharp snap on a fast first key, a short hold, then a slower recovery to the stance */
  KC('Hit 1',.65,[[0,{}],
    [.06,{HP:[0,-.08,-.07],h:[6,-22,0],sp:[-10,-4,0],ch:[-22,-6,0],nk:[-12,0,0],hd:[-28,0,0],gR:[-.36,.8,.14],dR:[-.4,.8,.35],gL:[.22,.8,.24],dL:[.2,.8,.5],fist:[20,95]}],
    [.13,{HP:[0,-.085,-.08],h:[5,-22,0],sp:[-12,-4,0],ch:[-24,-6,0],nk:[-14,0,0],hd:[-30,0,2],gR:[-.36,.82,.12],dR:[-.4,.8,.35],gL:[.22,.82,.22],dL:[.2,.8,.5],fist:[20,95]}],
    [.32,{HP:[0,-.09,-.03],h:[12,-21,0],sp:[6,-4,0],ch:[2,-6,0],hd:[-6,0,0],gR:[-.3,.72,.3],gL:[.19,.72,.38]}],
    [.65,{}]],'Blow to the face: head and shoulders snap back, then recover');
  KC('Hit 2',.7,[[0,{}],
    [.06,{HP:[0,-.12,-.02],h:[18,-20,0],sp:[18,-4,0],ch:[16,-6,0],nk:[20,0,0],hd:[30,0,0],gR:[-.44,.56,.24],dR:[-.6,.5,.6],gL:[.18,.6,.36],fist:[30,95]}],
    [.13,{HP:[0,-.13,-.02],h:[19,-20,0],sp:[19,-4,0],ch:[17,-6,0],nk:[22,0,0],hd:[34,0,2],gR:[-.45,.55,.24],dR:[-.6,.5,.6],gL:[.18,.58,.36],fist:[30,95]}],
    [.35,{HP:[0,-.09,0],h:[13,-20,0],sp:[11,-4,0],ch:[6,-6,0],nk:[2,0,0],hd:[4,0,0],gR:[-.36,.66,.32],dR:[-.3,.7,.6],gL:[.18,.69,.41]}],
    [.7,{}]],'Blow on top of the head: head ducks down sharply, then recovers');
  KC('Heavy hit 1',1.5,[[0,{}],
    [.1,{HP:[0,-.06,-.07],h:[-6,-26,0],sp:[-14,-4,0],ch:[-16,-8,0],hd:[-20,0,4],gR:[-.44,.9,.06],dR:[-.7,.6,-.1],gL:[.34,.9,.2],dL:[.5,.6,.6],fist:[10,95]}],
    [.28,{HP:[0,-.08,-.16],h:[0,-24,0],sp:[-6,-4,0],ch:[-8,-8,0],hd:[-8,0,0],FR:[-.13,-.32,-44,.06,0],gR:[-.42,.84,.12],dR:[-.6,.7,0],gL:[.3,.84,.24]}],
    [.45,{HP:[0,-.12,-.24],h:[12,-24,0],sp:[8,-4,0],ch:[4,-8,0],hd:[2,0,0],FR:[-.13,-.42,-44,0,0],gR:[-.34,.72,.28],gL:[.22,.74,.38]}],
    [.6,{HP:[0,-.1,-.26],FL:[.12,-.04,-15,.05,0],FR:[-.13,-.42,-44,0,0]}],
    [.75,{HP:[0,-.09,-.28],FL:[.12,-.15,-12,0,0],FR:[-.13,-.42,-44,0,0]}],
    [1.0,{HP:[0,-.08,-.16],FL:[.12,0,-12,.05,0],FR:[-.13,-.42,-44,0,0]}],
    [1.12,{HP:[0,-.08,-.1],FR:[-.13,-.42,-44,0,0]}],
    [1.3,{HP:[0,-.08,-.04],FR:[-.13,-.28,-43,.05,0]}],
    [1.5,{}]],'Knocked back two steps, then steps in again');
  KC('Heavy hit 2',1.9,[[0,{}],
    [.1,{HP:[.02,-.08,-.06],h:[-4,-32,4],sp:[-12,-6,4],ch:[-14,-10,4],hd:[-16,0,6],gR:[-.46,.86,.06],dR:[-.7,.6,-.1],gL:[.34,.88,.2],dL:[.5,.6,.6],fist:[10,95]}],
    [.3,{HP:[0,-.14,-.12],h:[10,-24,0],sp:[0,-4,0],ch:[-4,-6,0],hd:[-6,0,0],FR:[-.13,-.34,-42,.06,0],gR:[-.4,.7,.16],dR:[-.4,.7,.5],gL:[.3,.7,.3]}],
    [.55,{HP:[0,-.25,-.1],h:[24,-16,0],sp:[16,-4,0],ch:[8,-6,0],hd:[4,0,0],FL:[.12,.2,-14,0,0],FR:[-.13,-.32,-30,0,70],gR:[-.34,.38,.42],dR:[-.1,.7,.7],pR:[-.85,-.5,.1],gL:[.12,.37,.26],dL:[.3,.8,.4],pL:[.85,-.5,.1],fist:[60,95]}],
    [.68,{HP:[0,-.27,-.1],h:[26,-16,0],sp:[18,-4,0],ch:[9,-6,0],hd:[6,0,0],FL:[.12,.2,-14,0,0],FR:[-.13,-.32,-30,0,70],gR:[-.34,.36,.42],dR:[-.1,.7,.7],pR:[-.85,-.5,.1],gL:[.12,.36,.26],dL:[.3,.8,.4],pL:[.85,-.5,.1],fist:[60,95]}],
    [1.05,{HP:[0,-.26,-.1],h:[24,-14,0],sp:[16,-4,0],ch:[8,-6,0],hd:[-4,4,0],FL:[.12,.2,-14,0,0],FR:[-.13,-.32,-30,0,70],gR:[-.34,.38,.42],dR:[-.1,.7,.7],pR:[-.85,-.5,.1],gL:[.12,.37,.26],dL:[.3,.8,.4],pL:[.85,-.5,.1],fist:[60,95]}],
    [1.3,{HP:[0,-.18,-.08],h:[28,-18,0],sp:[18,-4,0],ch:[8,-6,0],FL:[.12,.16,-14,0,0],FR:[-.13,-.3,-36,0,30],gR:[-.32,.54,.4],dR:[-.1,.75,.65],pR:[-.85,-.45,-.1],gL:[.18,.42,.36],pL:[.85,-.5,0]}],
    [1.55,{HP:[0,-.11,-.05],h:[16,-20,0],FR:[-.13,-.22,-42,.05,0],gL:[.2,.62,.46],pL:[.85,-.5,-.1]}],
    [1.9,{}]],'Knocked down to one knee, then gets back up');
  return GCLIPS[B.key]=L;}

/* ---------- deaths ----------
   FK keyframes of joint angles that start from the war stance (solved once with the IK). Each key carries the previous one's
   values forward, and each segment has its own easing ('in' accelerates like a fall, 'out' settles after an impact).
   Every frame the whole body is dropped onto its lowest point, so it rests on its feet, knees, seat, back or chest as it
   goes down; planted feet stay pinned while their anchor weight (anc) is on; flat keeps a foot level on the ground.
   At tRel the hand lets go: the weapon is flung to the side, falls under gravity, turns flat and lies on the ground. */
const GB_EASE={io:s=>s*s*(3-2*s),in:s=>s*s,out:s=>1-(1-s)*(1-s),lin:s=>s};
function gbDeathKeys(K0,keys){const K=[[0,K0,'io']];for(const[t,p,e]of keys)K.push([t,Object.assign({},K[K.length-1][1],p),e||'io']);
  return t=>{let i=1;while(i<K.length-1&&t>K[i][0])i++;const[t0,a]=K[i-1],[t1,b,e]=K[i],s=GB_EASE[e](Math.min(1,Math.max(0,(t-t0)/(t1-t0)))),o={};
    for(const c in b){const A=a[c]||b[c];o[c]=b[c].map((v,j)=>A[j]+(v-A[j])*s);}return o;};}
/* GX (optional, for other goblin kinds): fps = sampling rate (default 30), st = war stance, R = IK rig, M = model to measure, drop = {clip name: [release time, push]}, lieZ = the dropped weapon lies along z */
function goblinDeaths(B,wpn,GX={}){const ck=B.key+':'+wpn+':death';if(GCLIPS[ck])return GCLIPS[ck];const k=B.legS,D2R=Math.PI/180,V=THREE.Vector3,L=[];
  const S0=wrSolve(GX.R||wrRig(B,false),gbU(B,GX.st||GB_ST)),K0={X:[S0.pos[0]*k,S0.pos[2]*k],anc:[1,1],flat:[1,1]};
  for(const c of['h','sp','ch','nk','hd','tL','kL','aL','tR','kR','aR','uL','fL','wL','uR','fR','wR','fist'])K0[c]=S0[c].slice();
  /* a goblin to measure against: its meshes give the ground contact, its socket the weapon's start */
  const M=GX.M||buildGoblin(1,{skin:'green',top:'shirt',legs:'pants',weapon:wpn,noClips:true}),JN={};M.traverse(q=>{if(q.userData.joint)JN[q.name]=q;});
  /* GX.left = {clip name: [release time, push, share of the hand's velocity (default 0.35)]}: a prop in the left hand (weapon_L) is dropped the same way */
  const WP=['R','L'].map(sd=>M.getObjectByName('weapon_'+sd)).filter(Boolean),under=q=>{while(q){if(WP.includes(q))return true;q=q.parent;}return false;},body=[];M.traverse(q=>{if(q.isMesh&&!under(q))body.push(q);});
  const corner=new V(),lowest=()=>{let y=1e9;for(const q of body){const p=q.geometry.parameters;for(let i=0;i<8;i++){corner.set((i&1?.5:-.5)*p.width,(i&2?.5:-.5)*p.height,(i&4?.5:-.5)*p.depth).applyMatrix4(q.matrixWorld);if(corner.y<y)y=corner.y;}}return y;};
  const pose=p=>{const P={};for(const c in p)if(JALIAS[c])P[JALIAS[c]]=p[c];const f=p.fist;P.fingers_L=[0,0,-f[0]];P.fingerTips_L=[0,0,-f[0]*.95];P.thumb_L=[f[0]*.15,0,-f[0]*.35];P.fingers_R=[0,0,f[1]];P.fingerTips_R=[0,0,f[1]*.95];P.thumb_R=[f[1]*.15,0,f[1]*.35];
    for(const j of RIG_JOINTS){const b=BASEPOSE[j]||[0,0,0],v=P[j]||[0,0,0];JN[j].rotation.set((b[0]+v[0])*D2R,(b[1]+v[1])*D2R,(b[2]+v[2])*D2R);}};
  const DC=(name,dur,tR0,pu0,keys,note)=>{if(GX.drop&&GX.drop[name])[tR0,pu0]=GX.drop[name];const f=gbDeathKeys(K0,keys);let ref=null,full=[0,0];
    const fn=t=>{const p=f(t);
      /* flat feet: the foot turns so its sole stays level while the leg folds */
      for(const[i,sd]of[[0,'L'],[1,'R']]){const w=p.flat[i];if(w>0){const a=p['a'+sd].slice();a[0]=a[0]*(1-w)-(p.h[0]+p['t'+sd][0]+p['k'+sd][0])*w;p['a'+sd]=a;}}
      pose(p);JN.hips.position.set(p.X[0],B.hipH,p.X[1]);M.updateMatrixWorld(true);
      const ft={L:JN.foot_L.getWorldPosition(new V()),R:JN.foot_R.getWorldPosition(new V())};if(!ref)ref={L:ft.L.clone(),R:ft.R.clone()};
      const wsum=p.anc[0]+p.anc[1];let cx=0,cz=0;if(wsum>1e-3){for(const[i,sd]of[[0,'L'],[1,'R']]){cx+=p.anc[i]*(ref[sd].x-ft[sd].x);cz+=p.anc[i]*(ref[sd].z-ft[sd].z);}cx/=wsum;cz/=wsum;}
      const w=Math.min(1,Math.max(p.anc[0],p.anc[1]));if(w>.999)full=[cx,cz];const X=[p.X[0]+w*cx+(1-w)*full[0],p.X[1]+w*cz+(1-w)*full[1]];
      JN.hips.position.set(X[0],B.hipH,X[1]);M.updateMatrixWorld(true);const y=-lowest();
      const o={};for(const c in p)if(JALIAS[c]||c==='fist')o[c]=p[c];o.pos=[X[0]/k,y/k,X[1]/k];return o;};
    const c=sampleClip(name,dur,fn,{autoFeet:false,note,fps:GX.fps},B);
    /* weapon: held until tRel, then flung clear of the body (part of the hand's velocity plus a push to the side), falls, turns flat, bounces once and lies still */
    for(const sd of['R','L']){const wr=M.getObjectByName('weapon_'+sd);if(!wr||sd==='L'&&!(GX.left&&GX.left[name]))continue;const wp=wr.children[0],[tRel,push,vk=.35]=sd==='R'?[tR0,pu0]:GX.left[name];
    const mx=new THREE.AnimationMixer(M),act=mx.clipAction(c);act.play();const n=Math.round(dur*(GX.fps||30)),T=[],PV=[],QV=[],wpQ=wp.quaternion.clone(),wpQi=wpQ.clone().invert();
    let prev=null,rel=null;
    for(let i=0;i<=n;i++){const t=i/n*dur;act.time=t;mx.update(0);M.updateMatrixWorld(true);const SW=JN['socket_'+sd].matrixWorld,sp=new V().setFromMatrixPosition(SW);T.push(t);
      if(t<tRel){PV.push(0,0,0);QV.push(0,0,0,1);prev=sp;continue;}
      if(!rel){const q0=new THREE.Quaternion().setFromRotationMatrix(SW).multiply(wpQ),v0=sp.clone().sub(prev).multiplyScalar(vk*n/dur).add(new V(...push));
        const Y=new V(0,1,0).applyQuaternion(q0).setY(0);if(GX.lieZ)Y.set(0,0,Y.z<0?-1:1);if(Y.lengthSq()<1e-4)Y.set(1,0,0);Y.normalize();const Z=new V(0,new V(0,0,1).applyQuaternion(q0).y>=0?1:-1,0),X=new V().crossVectors(Y,Z);
        const qF=new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(X,Y,Z));let lo=1e9;wp.updateMatrixWorld(true);
        wp.traverse(q=>{if(!q.isMesh)return;const pr=q.geometry.parameters;for(let j=0;j<8;j++){corner.set((j&1?.5:-.5)*pr.width,(j&2?.5:-.5)*pr.height,(j&4?.5:-.5)*pr.depth).applyMatrix4(q.matrix).applyQuaternion(qF);lo=Math.min(lo,corner.y);}});
        const yR=-lo+.002,tl=(v0.y+Math.sqrt(v0.y*v0.y+19.6*Math.max(0,sp.y-yR)))/9.8;rel={p0:sp.clone(),v0,q0,qF,yR,tl,t0:t};}
      const tau=t-rel.t0,tf=Math.min(tau,rel.tl),pos=rel.p0.clone().addScaledVector(rel.v0,tf);pos.y=tau<rel.tl?rel.p0.y+rel.v0.y*tau-4.9*tau*tau:rel.yR;
      let q;if(tau<rel.tl){const s=tau/rel.tl;q=rel.q0.clone().slerp(rel.qF,s*s*(3-2*s));let lo=1e9;wp.traverse(m=>{if(!m.isMesh)return;const pr=m.geometry.parameters;for(let j=0;j<8;j++){corner.set((j&1?.5:-.5)*pr.width,(j&2?.5:-.5)*pr.height,(j&4?.5:-.5)*pr.depth).applyMatrix4(m.matrix).applyQuaternion(q);lo=Math.min(lo,corner.y);}});pos.y=Math.max(pos.y,rel.yR,.002-lo);}
      else{const b=tau-rel.tl;if(b<.16)pos.y+=.03*Math.sin(Math.PI*b/.16);const sl=Math.min(b,.25)/.25;pos.addScaledVector(rel.v0.clone().setY(0),.04*sl);q=rel.qF.clone();}
      const W=new THREE.Matrix4().compose(pos,q.multiply(wpQi),new V(1,1,1)),Lm=SW.clone().invert().multiply(W),lp=new V(),lq=new THREE.Quaternion(),ls=new V();Lm.decompose(lp,lq,ls);PV.push(lp.x,lp.y,lp.z);QV.push(lq.x,lq.y,lq.z,lq.w);}
    act.stop();mx.uncacheRoot(M);c.tracks.push(new THREE.VectorKeyframeTrack(wr.name+'.position',T,PV),new THREE.QuaternionKeyframeTrack(wr.name+'.quaternion',T,QV));}L.push(c);};
  DC('Death 1',2.4,.62,[-1.1,.8,.1],[
    [.12,{h:[-2,-14,0],sp:[-12,-2,0],ch:[-16,-2,0],nk:[-6,0,0],hd:[-14,0,0],uL:[-50,0,45],fL:[-30,0,0],uR:[-40,-10,-55],fR:[-35,0,0],wR:[20,0,0],fist:[10,95]},'out'],
    [.4,{h:[0,-8,0],sp:[-6,0,0],ch:[-8,0,0],nk:[8,0,0],hd:[10,0,0],tL:[-45,0,6],kL:[80,0,0],tR:[-40,0,-8],kR:[75,0,0],X:[0,-.06],uL:[-30,0,35],uR:[-30,0,-45],fL:[-40,0,0],fR:[-30,0,0]}],
    [.62,{h:[-35,-4,4],sp:[-8,0,0],ch:[-6,0,0],tL:[-75,0,10],kL:[95,0,0],tR:[-70,0,-12],kR:[90,0,0],X:[0,-.16],uL:[-60,0,40],uR:[-55,0,-65],fist:[10,50]},'in'],
    [.95,{h:[-80,0,4],sp:[-6,0,0],ch:[-4,0,0],nk:[10,0,0],hd:[10,0,10],tL:[-60,0,12],kL:[70,0,0],tR:[-55,0,-14],kR:[65,0,0],anc:[0,0],flat:[0,0],aL:[20,0,0],aR:[20,0,0],X:[0,-.26],uL:[-40,0,60],uR:[-30,0,-75],fL:[-20,0,0],fR:[-15,0,0],fist:[20,20]},'in'],
    [1.05,{h:[-88,0,4],nk:[18,0,0],hd:[18,0,6],tL:[-40,8,14],kL:[65,0,0],tR:[-30,-10,-16],kR:[50,0,0],uL:[20,0,72],uR:[-10,0,-82],fL:[-5,0,0],fR:[-5,0,0]},'out'],
    [1.18,{h:[-84,0,4],hd:[12,0,4]}],
    [1.8,{h:[-86,0,4],sp:[-6,0,0],ch:[-4,0,0],nk:[15,0,0],hd:[15,0,0],tL:[-30,8,14],kL:[60,0,0],aL:[0,0,0],tR:[-20,-10,-16],kR:[45,0,0],aR:[60,0,0],uL:[30,0,75],fL:[0,0,0],wL:[0,0,-30],uR:[20,0,-60],fR:[0,0,0],wR:[0,0,0],fist:[35,30]},'out'],
    [2.4,{}]],'Struck in the chest: knees buckle, falls back onto the seat and back, the weapon drops, lies still');
  DC('Death 2',2.6,.55,[-1.1,.5,.3],[
    [.15,{h:[24,-12,0],sp:[22,0,0],ch:[14,0,0],nk:[10,0,0],hd:[-10,0,0],uL:[-50,0,-5],fL:[-80,0,0],uR:[-20,0,-20],fR:[-30,0,0],wR:[-25,0,0],fist:[70,95]},'out'],
    [.45,{h:[30,-6,0],tL:[-30,0,4],kL:[50,0,0],tR:[-26,0,-4],kR:[48,0,0],uR:[-15,0,-40],fist:[70,55]}],
    [.8,{h:[20,-4,0],sp:[18,0,0],ch:[12,0,0],tL:[-20,0,4],kL:[90,0,0],tR:[-18,0,-4],kR:[88,0,0],flat:[0,0],aL:[35,0,0],aR:[35,0,0],uR:[-5,0,-25],fR:[-20,0,0],fist:[70,25]},'in'],
    [.9,{h:[24,-4,0]},'out'],
    [1.25,{h:[28,0,-4],sp:[20,0,-4],hd:[-6,0,4],tL:[-28,0,4],kL:[90,0,0],tR:[-26,0,-4],kR:[88,0,0]}],
    [1.6,{h:[60,0,-6],sp:[10,0,-4],ch:[6,0,0],tL:[-10,0,6],kL:[40,0,0],tR:[-8,0,-6],kR:[40,0,0],uL:[-30,0,20],anc:[0,0]},'in'],
    [1.85,{h:[90,0,-8],sp:[6,0,0],ch:[6,0,0],nk:[-26,0,0],hd:[-24,60,0],tL:[-15,4,6],kL:[25,0,0],tR:[-15,-4,-6],kR:[25,0,0],aL:[45,0,0],aR:[45,0,0],uL:[-5,0,15],uR:[5,0,-35],fL:[-25,0,0],fR:[-30,0,0],wL:[0,40,0],wR:[0,40,0]},'in'],
    [1.95,{h:[86,0,-8]},'out'],
    [2.6,{h:[90,0,-8],nk:[-30,0,0],hd:[-30,85,0],tL:[-20,4,6],kL:[20,0,0],tR:[-20,-4,-6],kR:[20,0,0],uL:[-10,0,40],fL:[0,0,0],wL:[0,60,0],uR:[10,0,-40],fR:[-30,0,0],wR:[0,60,0],fist:[35,30]},'out']],'Gut blow: doubles over, drops to the knees, topples face-first, the weapon slips away');
  return GCLIPS[ck]=L;}
function goblinClips(B,wpn='sword'){const ck=B.key+':'+wpn;return GCLIPS[ck]||(GCLIPS[ck]=goblinBaseClips(B).concat(goblinDeaths(B,wpn)));}


FOLDERS['characters'].children.push('characters/enemies');FOLDERS['characters/enemies']={name:'Enemies',blurb:'Hostile creatures, in groups',children:['characters/enemies/brutes','characters/enemies/undead']};
FOLDERS['characters/enemies/brutes']={name:'Brutes',blurb:'Goblins, ogres, trolls and their beasts',children:[]};FOLDERS['characters/enemies/undead']={name:'Undead',blurb:'Skeletons and other risen dead',children:[]};
ASSETS.push({id:'goblin',folder:'characters/enemies/brutes',name:'Goblin',kind:'character',variants:true,defaultSeed:2,groundR:1.6,build:(s,o)=>buildGoblin(s,o||{}),
  opts:[{key:'skin',label:'Skin',choices:[['random','Random'],...Object.entries(GB_SKIN).map(([kk,v])=>[kk,v[1].charAt(0).toUpperCase()+v[1].slice(1)])],def:'random'},
    {key:'top',label:'Top',choices:[['random','Random'],['shirt','Ragged shirt'],['none','No shirt']],def:'random'},
    {key:'legs',label:'Legs',choices:[['random','Random'],['shorts','Ragged shorts'],['pants','Ragged pants']],def:'random'},
    {key:'weapon',label:'Weapon',choices:[['sword','Crude shortsword'],['axe','One-handed axe'],['club','Club']],def:'sword'}],
  desc:'Short (about 1.3 m), bulky goblin: pot belly, long thick arms, big head with a hooked nose, tusks and long pointed ears. Skin dark yellow, green, dark green, dark red or dark grey; ragged shirt or bare chest, ragged shorts or pants; a crude shortsword, a one-handed axe or a spiked club. Walk, run, run away, idle, war-mode idle, walk and run, two light attacks, a heavy attack, jump and jump attack, two hits, two heavy hits and two deaths that fall to the ground and drop the weapon.'});
