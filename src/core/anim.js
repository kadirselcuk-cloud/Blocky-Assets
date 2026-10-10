
/* ---------- animation authoring ---------- */
const JALIAS={h:'hips',sp:'spine',ch:'chest',nk:'neck',hd:'head',sL:'shoulder_L',sR:'shoulder_R',uL:'upperArm_L',uR:'upperArm_R',fL:'foreArm_L',fR:'foreArm_R',wL:'hand_L',wR:'hand_R',tL:'thigh_L',tR:'thigh_R',kL:'shin_L',kR:'shin_R',aL:'foot_L',aR:'foot_R'};
const RIG_JOINTS=['hips','spine','chest','neck','head','shoulder_L','upperArm_L','foreArm_L','hand_L','fingers_L','fingerTips_L','thumb_L','shoulder_R','upperArm_R','foreArm_R','hand_R','fingers_R','fingerTips_R','thumb_R','thigh_L','shin_L','foot_L','thigh_R','shin_R','foot_R'];
const BASEPOSE={upperArm_L:[0,0,9],upperArm_R:[0,0,-9],foreArm_L:[-8,0,0],foreArm_R:[-8,0,0]};
function keyed(keys){const ch=new Set();keys.forEach(k=>Object.keys(k[1]).forEach(c=>ch.add(c)));const zero=c=>c==='fist'?[0,0]:[0,0,0];
  return t=>{let i=0;while(i<keys.length-2&&t>keys[i+1][0])i++;const[t0,p0]=keys[i],[t1,p1]=keys[i+1];let u=t1>t0?Math.min(1,Math.max(0,(t-t0)/(t1-t0))):0;u=u*u*(3-2*u);
    const o={};for(const c of ch){const A=p0[c]||zero(c),B=p1[c]||zero(c);o[c]=A.map((v,j)=>v+((B[j]??0)-v)*u);}return o;};}
function addPose(a,b){const o=Object.assign({},a);for(const k in b)o[k]=o[k]?o[k].map((v,i)=>v+(b[k][i]||0)):b[k];return o;}
function sampleClip(name,dur,fn,o={},B){const hipH=B?B.hipH:.95,ps=B?B.legS:1;const fps=30,n=Math.max(2,Math.round(dur*fps)),times=[],Q={},P=[],e=new THREE.Euler(),q=new THREE.Quaternion(),D2R=Math.PI/180;
  for(const j of RIG_JOINTS)Q[j]=[];
  for(let i=0;i<=n;i++){const t=i/n*dur;times.push(t);const p=fn(t),pose={};
    for(const k in p){if(k==='pos'||k==='fist')continue;pose[JALIAS[k]||k]=p[k];}
    if(o.autoFeet!==false)for(const sd of['L','R']){if(!p['a'+sd]){const th=(p['t'+sd]||[0])[0],kn=(p['k'+sd]||[0])[0];pose['foot_'+sd]=[-(th+kn),0,0];}}
    const f=p.fist||[0,0];pose.fingers_L=[0,0,-f[0]];pose.fingerTips_L=[0,0,-f[0]*.95];pose.thumb_L=[f[0]*.15,0,-f[0]*.35];pose.fingers_R=[0,0,f[1]];pose.fingerTips_R=[0,0,f[1]*.95];pose.thumb_R=[f[1]*.15,0,f[1]*.35];
    for(const j of RIG_JOINTS){const b=BASEPOSE[j]||[0,0,0],v=pose[j]||[0,0,0];e.set((b[0]+v[0])*D2R,(b[1]+v[1])*D2R,(b[2]+v[2])*D2R);q.setFromEuler(e);Q[j].push(q.x,q.y,q.z,q.w);}
    const pp=p.pos||[0,0,0];P.push(pp[0]*ps,hipH+pp[1]*ps,pp[2]*ps);}
  const tracks=RIG_JOINTS.map(j=>new THREE.QuaternionKeyframeTrack(j+'.quaternion',times,Q[j]));tracks.push(new THREE.VectorKeyframeTrack('hips.position',times,P));
  const clip=new THREE.AnimationClip(name,dur,tracks);clip.loopMode=!!o.loop;clip.note=o.note||'';return clip;}

const VCLIPS={};
function villagerClips(B){if(VCLIPS[B.key])return VCLIPS[B.key];const SC=(n,d,f,o)=>sampleClip(n,d,f,o,B);const S=Math.sin,C=Math.cos,mx=Math.max,D=Math.PI*2,pw=Math.pow;
  const idle=t=>{const p=D*t/3,b=S(p),b2=S(2*p),hz=.6*S(p);return{pos:[0,-.006+.003*b2,0],h:[0,0,hz],tL:[-3,0,-hz],kL:[6,0,0],tR:[-2,0,-hz],kR:[4,0,0],sp:[1+b*.8,0,-.6*S(p)],ch:[1.6*b,0,0],
    hd:[-2+1.5*S(2*p+1),4*S(p+.6),1.2*S(p)],uL:[2*S(p+.5),0,1.5*b],uR:[-2*S(p+.3),0,-1.5*b],fL:[-6-2*b,0,0],fR:[-6+2*b,0,0],wL:[0,-10,0],wR:[0,10,0],fist:[18,18]};};
  const look=keyed([[0,{}],[.9,{hd:[2,55,0],nk:[0,12,0],ch:[0,14,0]}],[2.1,{hd:[4,52,-3],nk:[0,12,0],ch:[0,14,0]}],[3.0,{hd:[-8,-55,0],nk:[0,-12,0],ch:[0,-14,0]}],[4.2,{hd:[-6,-50,3],nk:[0,-12,0],ch:[0,-14,0]}],[5.2,{hd:[10,0,0]}],[6,{}]]);
  const L=[];
  L.push(SC('Idle',3,idle,{loop:true,note:'Breathing, weight shift'}));
  L.push(SC('Look around',6,t=>addPose(idle(t%3),look(t)),{loop:true,note:'Idle variant'}));
  L.push(SC('Walk',1.05,t=>{const p=D*t/1.05,s=S(p);const thL=-24*s-2,thR=24*s-2,kL=6+52*pw(mx(0,C(p+.35)),2),kR=6+52*pw(mx(0,-C(p+.35)),2);
    return{pos:[0,-.025+.018*C(2*p),0],h:[0,-7*s,0],sp:[4,2*s,0],ch:[2,8*s,0],hd:[-4,-3*s,0],tL:[thL,0,0],tR:[thR,0,0],kL:[kL,0,0],kR:[kR,0,0],
      aL:[-(thL+kL)*.85+16*pw(mx(0,-s),3)-8*pw(mx(0,s),4),0,0],aR:[-(thR+kR)*.85+16*pw(mx(0,s),3)-8*pw(mx(0,-s),4),0,0],
      uL:[22*s,0,0],uR:[-22*s,0,0],fL:[-14-16*mx(0,-s),0,0],fR:[-14-16*mx(0,s),0,0],wL:[0,-8,0],wR:[0,8,0],fist:[25,25]};},{loop:true,autoFeet:false,note:'In place, 1.4 m/s'}));
  L.push(SC('Run',.7,t=>{const p=D*t/.7,s=S(p);const thL=-48*s-12,thR=48*s-12,kL=20+85*pw(mx(0,C(p+.5)),1.5),kR=20+85*pw(mx(0,-C(p+.5)),1.5);
    return{pos:[0,-.07+.045*C(2*p+.6),0],h:[0,-10*s,0],sp:[12,4*s,0],ch:[6,14*s,0],hd:[-14,-6*s,0],tL:[thL,0,0],tR:[thR,0,0],kL:[kL,0,0],kR:[kR,0,0],
      aL:[-(thL+kL)*.6+12,0,0],aR:[-(thR+kR)*.6+12,0,0],uL:[50*s-5,0,10],uR:[-50*s-5,0,-10],fL:[-90+20*s,0,0],fR:[-90-20*s,0,0],wL:[-10,0,0],wR:[-10,0,0],fist:[75,75]};},{loop:true,autoFeet:false,note:'In place, 4 m/s'}));
  L.push(SC('Jump',1.3,keyed([[0,{}],
    [.28,{pos:[0,-.25,0],tL:[-55,0,0],kL:[95,0,0],aL:[-40,0,0],tR:[-55,0,0],kR:[95,0,0],aR:[-40,0,0],sp:[28,0,0],ch:[10,0,0],hd:[-20,0,0],uL:[45,0,8],uR:[45,0,-8],fL:[-10,0,0],fR:[-10,0,0],fist:[40,40]}],
    [.42,{pos:[0,.02,0],tL:[8,0,0],kL:[4,0,0],aL:[40,0,0],tR:[8,0,0],kR:[4,0,0],aR:[40,0,0],sp:[-4,0,0],ch:[-4,0,0],hd:[-6,0,0],uL:[-150,0,15],uR:[-150,0,-15],fL:[-10,0,0],fR:[-10,0,0],fist:[20,20]}],
    [.64,{pos:[0,.42,0],tL:[-45,0,0],kL:[85,0,0],aL:[-15,0,0],tR:[-35,0,0],kR:[70,0,0],aR:[-15,0,0],sp:[8,0,0],ch:[4,0,0],hd:[-6,0,0],uL:[-110,0,25],uR:[-110,0,-25],fL:[-25,0,0],fR:[-25,0,0],fist:[30,30]}],
    [.88,{pos:[0,.03,0],tL:[-18,0,0],kL:[20,0,0],aL:[5,0,0],tR:[-18,0,0],kR:[20,0,0],aR:[5,0,0],sp:[6,0,0],uL:[-50,0,20],uR:[-50,0,-20],fL:[-20,0,0],fR:[-20,0,0]}],
    [1.0,{pos:[0,-.22,0],tL:[-50,0,0],kL:[90,0,0],aL:[-40,0,0],tR:[-50,0,0],kR:[90,0,0],aR:[-40,0,0],sp:[25,0,0],ch:[8,0,0],hd:[-18,0,0],uL:[-20,0,25],uR:[-20,0,-25],fL:[-30,0,0],fR:[-30,0,0],fist:[30,30]}],
    [1.3,{}]]),{autoFeet:false,note:'Standing jump, 0.4 m'}));
  const guard={uL:[-35,0,12],fL:[-120,0,0],uR:[-25,0,-12],fR:[-125,0,0],fist:[95,95],h:[0,-12,0],sp:[6,-6,0],ch:[0,-12,0],hd:[2,30,0],tL:[-12,0,0],kL:[16,0,0],tR:[8,0,0],kR:[14,0,0],pos:[0,-.03,0]};
  const punch=Object.assign({},guard,{uR:[-88,0,4],fR:[-6,0,0],h:[0,6,0],sp:[8,10,0],ch:[2,24,0],hd:[0,-38,0],tR:[14,0,0],kR:[8,0,0],pos:[0,-.04,0]});
  L.push(SC('Punch',.85,keyed([[0,{}],[.16,guard],[.3,punch],[.42,Object.assign({},punch,{fR:[-14,0,0]})],[.62,guard],[.85,{}]]),{note:'Unarmed attack'}));
  const wind={uR:[-165,0,-25],fR:[-80,0,0],uL:[-35,0,20],fL:[-40,0,0],ch:[-6,-18,0],sp:[-8,-8,0],hd:[8,22,0],h:[0,-8,0],tL:[-14,0,0],kL:[18,0,0],tR:[10,0,0],kR:[10,0,0],fist:[60,95],pos:[0,-.03,0]};
  const strike={uR:[-55,0,-5],fR:[-15,0,0],uL:[20,0,15],fL:[-30,0,0],ch:[18,20,0],sp:[22,10,0],hd:[-25,-25,0],h:[0,8,0],tL:[-30,0,0],kL:[40,0,0],tR:[18,0,0],kR:[15,0,0],fist:[60,95],pos:[0,-.09,0]};
  const follow=Object.assign({},strike,{uR:[-15,0,10],fR:[-25,0,0],ch:[22,26,0],sp:[26,12,0]});
  L.push(SC('Swing',1.1,keyed([[0,{}],[.38,wind],[.5,strike],[.62,follow],[.86,{uR:[-20,0,-8],fR:[-30,0,0],ch:[6,8,0],sp:[6,4,0],tL:[-10,0,0],kL:[14,0,0],fist:[40,95]}],[1.1,{}]]),{note:'One-handed attack; use with socket_R'}));
  {const legs={tL:[-12,0,0],kL:[14,0,0],tR:[7,0,0],kR:[10,0,0]};
   const ready=Object.assign({},legs,{uR:[-45,0,18],fR:[-60,0,0],wR:[30,0,0],ch:[2,-8,0],pos:[0,-.03,0]});
   const wind=Object.assign({},legs,{uR:[-168,0,10],fR:[-38,0,0],wR:[10,0,0],sp:[-12,0,0],ch:[-6,-10,0],hd:[-8,8,0],pos:[0,-.025,0]});
   const hit={uR:[-58,0,22],fR:[-4,0,0],wR:[60,0,0],sp:[24,0,0],ch:[12,-15,0],hd:[8,12,0],tL:[-26,0,0],kL:[38,0,0],tR:[12,0,0],kR:[24,0,0],pos:[0,-.1,0]};
   const c=SC('Tool strike',1.3,keyed([[0,ready],[.42,wind],[.58,hit],[.68,Object.assign({},hit,{uR:[-55,0,22],wR:[56,0,0]})],[1.0,Object.assign({},ready,{uR:[-70,0,18],fR:[-45,0,0]})],[1.3,ready]]),{loop:true,note:'Two-handed: axe, pickaxe, sledgehammer'});
   c.tool='two';c.defTool='Axe';c.strikeT=.6;L.push(c);}
  {const base={sp:[14,0,0],ch:[8,-6,0],hd:[10,8,0],uL:[-42,0,6],fL:[-48,0,0],wL:[0,0,0],tL:[-8,0,0],kL:[10,0,0],tR:[4,0,0],kR:[8,0,0],pos:[0,-.02,0],fist:[70,95]};
   const up=Object.assign({},base,{uR:[-90,0,-6],fR:[-110,0,0],wR:[-10,0,0]}),dn=Object.assign({},base,{uR:[-30,0,-2],fR:[-50,0,0],wR:[60,0,0]});
   const c=SC('Hammering',.8,keyed([[0,Object.assign({},up,{uR:[-70,0,-5],fR:[-95,0,0],wR:[10,0,0]})],[.22,up],[.36,dn],[.44,Object.assign({},dn,{uR:[-36,0,-2],wR:[50,0,0]})],[.8,Object.assign({},up,{uR:[-70,0,-5],fR:[-95,0,0],wR:[10,0,0]})]]),{loop:true,note:'One-handed at bench height: hammer'});
   c.tool='one';c.defTool='Hammer';c.strikeT=.37;L.push(c);}
  L.push(SC('Hit',.6,keyed([[0,{}],[.08,{ch:[-16,8,0],sp:[-10,0,0],hd:[-22,12,6],uL:[-10,0,30],uR:[-10,0,-30],fL:[-30,0,0],fR:[-30,0,0],pos:[0,-.02,-.05],tL:[6,0,0],kL:[10,0,0],tR:[-4,0,0],kR:[12,0,0],fist:[40,40]}],
    [.25,{ch:[-6,4,0],sp:[-3,0,0],hd:[-8,5,0],uL:[0,0,12],uR:[0,0,-12],fL:[-20,0,0],fR:[-20,0,0],pos:[0,-.015,-.03]}],[.6,{}]]),{note:'Damage reaction'}));
  const down={pos:[0,-.83,-.25],h:[-90,0,0],tL:[-18,0,0],kL:[30,0,0],tR:[-8,0,0],kR:[20,0,0],aL:[30,0,0],aR:[30,0,0],hd:[-6,32,0],uL:[-10,0,60],uR:[-20,0,-55],fL:[-25,0,0],fR:[-35,0,0],fist:[25,25]};
  L.push(SC('Death',2.2,keyed([[0,{}],
    [.12,{ch:[-18,10,0],sp:[-10,0,0],hd:[-25,15,0],uL:[-20,0,35],uR:[-25,0,-35],fL:[-50,0,0],fR:[-40,0,0],pos:[0,-.02,-.06],fist:[30,30]}],
    [.65,{pos:[0,-.32,0],tL:[-45,0,0],kL:[100,0,0],aL:[-55,0,0],tR:[-35,0,0],kR:[85,0,0],aR:[-50,0,0],sp:[18,0,0],ch:[12,0,0],hd:[20,10,0],uL:[0,0,20],uR:[0,0,-20],fL:[-30,0,0],fR:[-30,0,0]}],
    [1.05,{pos:[0,-.55,-.15],h:[-45,0,0],tL:[-20,0,0],kL:[70,0,0],aL:[20,0,0],tR:[-10,0,0],kR:[60,0,0],aR:[20,0,0],sp:[-5,0,0],ch:[-5,0,0],hd:[-15,10,0],uL:[-60,0,40],uR:[-60,0,-40],fL:[-30,0,0],fR:[-30,0,0]}],
    [1.32,Object.assign({},down,{h:[-93,0,0],hd:[-10,22,0]})],[1.48,Object.assign({},down,{pos:[0,-.79,-.25],h:[-86,0,0]})],[1.78,down],[2.2,down]]),{autoFeet:false,note:'Holds the last frame'}));
  const kneel={pos:[0,-.4,0],tL:[-75,0,4],kL:[112,0,0],tR:[-5,0,-4],kR:[118,0,0],sp:[40,0,0],ch:[18,0,0],hd:[-15,0,0],uR:[-45,0,-8],fR:[-15,0,0],uL:[-10,0,15],fL:[-60,0,0],fist:[20,10]};
  L.push(SC('Pick up',1.7,keyed([[0,{}],[.55,kneel],[.75,Object.assign({},kneel,{uR:[-50,0,-8],fist:[20,90]})],
    [1.15,{pos:[0,-.08,0],tL:[-25,0,0],kL:[40,0,0],tR:[-15,0,0],kR:[30,0,0],sp:[15,0,0],ch:[5,0,0],uR:[-20,0,-10],fR:[-95,0,0],fist:[20,90]}],[1.7,{}]]),{note:'Kneel and grab from the ground'}));
  const raise={uR:[-10,0,-135],fR:[-85,0,0],hd:[-4,-10,8],ch:[0,-6,-3],uL:[0,0,6],fist:[18,0]};
  const wa=Object.assign({},raise,{uR:[-10,25,-140]}),wb=Object.assign({},raise,{uR:[-10,-15,-140]});
  L.push(SC('Wave',2.4,keyed([[0,{}],[.35,raise],[.55,wa],[.75,wb],[.95,wa],[1.15,wb],[1.35,wa],[1.55,wb],[1.75,wa],[2.0,Object.assign({},raise,{uR:[-5,0,-60],fR:[-30,0,0]})],[2.4,{}]]),{note:'Greeting'}));
  L.push(SC('Talk',3,t=>{const p=D*t/3;return{uL:[-18+6*S(p),0,14],uR:[-22+8*S(p+1.5),0,-14],fL:[-70+15*S(2*p),0,0],fR:[-65+18*S(2*p+2),0,0],wL:[0,70+10*S(p),0],wR:[0,-70+10*S(p+1),0],fist:[10,10],
    hd:[2+3*S(4*p),8*S(p),3*S(p+1)],ch:[0,4*S(p),0],sp:[2,0,0],h:[0,0,.6*S(p)],tL:[-2,0,-.6*S(p)],kL:[4,0,0],tR:[-2,0,-.6*S(p)],kR:[4,0,0]};},{loop:true,note:'Conversation gestures'}));
  L.push(SC('Sit',3,t=>{const p=D*t/3;return{pos:[0,-.42,0],tL:[-88,0,4],kL:[88,0,0],tR:[-88,0,-4],kR:[88,0,0],sp:[-4+S(p),0,0],ch:[2+1.5*S(p),0,0],hd:[2*S(2*p),10*S(p),0],
    uL:[-30,0,6],fL:[-40,0,0],uR:[-30,0,-6],fR:[-40,0,0],fist:[25,25]};},{loop:true,note:'Seat height '+Math.round(42*B.legS)+' cm'}));
  return VCLIPS[B.key]=L;}

