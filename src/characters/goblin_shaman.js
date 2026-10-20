/* ======================= GOBLIN SHAMAN: a taller, bulkier goblin who walks with a staff =======================
   Built by buildGoblin (body type VB.gshaman plus the shaman's belt, necklace and earring) inside a group scaled by SH_SC, so
   every clip is authored in goblin metres on the goblin's leg lengths. The staff is held in the right hand SH_LB above its foot.
   Staff channels in the IK keys: T = staff foot [x,y,z] and G = grip [x,z], both absolute (not relative to the hips);
   pl = how far the staff follows T/G (1 = planted: the grip height follows from the staff length), otherwise gR/dR place it;
   sl slides the hand up the staff towards its foot for swings (a weapon_R.position track). After solving, the staff's lowest
   corner is put on the ground when planted and is never let below it. */
VB.gshaman=Object.assign({},VB.goblin,{g:1.15,td:1.55,arm:1.3,shW:.25,hipW:.095,hand:1.25});
{const b=VB.gshaman;b.key='gshaman';b.hipH=b.thigh+b.shin+b.ankle+b.hipOff;b.legS=(b.thigh+b.shin)/.84;b.tS=(b.spine+b.chest)/.3;b.cS=b.neck/.22;}
const SH_SC=1.22,SH_LB=.62,SH_STAFF={gnarled:'gnarled staff',banner:'ragged banner',bulky:'bulky staff'};
/* staff axis (+y) along the thumb side, its +x towards the knuckles, +z out of the back of the hand */
const SH_BASIS=()=>new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(new THREE.Vector3(0,-1,0),new THREE.Vector3(0,0,1),new THREE.Vector3(-1,0,0)));

/* staffs: grip at the origin, foot at -SH_LB, top about 0.81 above the grip; hooks and the banner reach out towards +z */
function shStaff(kind,clothC,patchC){const w=new THREE.Group(),r=mulberry32(7),wd=bm('#4f3e2d','leather'),wdD=bm('#3a2d21','leather'),bone=bm('#d6ccb2','plain'),rope=vm('rope'),ir=vm('iron'),moss=bm('#4a5230','plain');
  if(kind==='gnarled'){
    /* crooked shaft of knotted segments, a knotted lump on top curling into a hook, a bone hung from the hook */
    for(const[y0,y1,x,z,rx,rz]of[[-.62,-.4,.004,0,0,.04],[-.42,-.18,-.006,.004,.03,-.04],[-.2,.04,.004,-.004,-.03,.03],[.02,.26,-.006,.004,.03,-.05],[.24,.48,.006,-.004,-.02,.04],[.46,.62,-.002,0,.02,-.03]])
      bx(w,.046,y1-y0+.02,.046,wd,x,(y0+y1)/2,z,rx,0,rz);
    bx(w,.052,.045,.052,wdD,0,-.597,0);bx(w,.032,.04,.03,wdD,.026,-.1,0);bx(w,.03,.036,.03,wdD,0,.3,.026);bx(w,.03,.03,.03,wdD,-.026,.12,0);bx(w,.03,.03,.028,wdD,.022,.44,0);
    bx(w,.05,.06,.014,moss,.002,-.3,.026);bx(w,.014,.05,.04,moss,-.026,.18,0);
    bx(w,.056,.03,.056,rope,0,.56,0);bx(w,.085,.11,.08,wdD,0,.63,0);bx(w,.016,.04,.016,bone,.05,.66,0,0,0,-.7);bx(w,.016,.035,.016,bone,0,.64,-.048,.7,0,0);
    bx(w,.045,.12,.045,wd,0,.71,.035,.5,0,0);bx(w,.042,.042,.11,wd,0,.775,.1);bx(w,.04,.08,.04,wd,0,.745,.15);
    bx(w,.01,.06,.01,rope,0,.675,.15);bx(w,.022,.05,.02,bone,0,.625,.15);bx(w,.03,.016,.016,bone,0,.6,.15);}
  else if(kind==='banner'){
    /* straight pole with an iron foot and a fang on top; a short arm out to one side carries a ragged cloth with a blank diamond */
    const cl=bm(clothC),pt=bm(patchC),clD=bm('#'+new THREE.Color(clothC).multiplyScalar(.7).getHexString());
    bx(w,.042,1.38,.042,wd,0,.07,0);bx(w,.05,.05,.05,ir,0,-.595,0);bx(w,.03,.05,.03,bone,0,.78,0);bx(w,.05,.045,.05,rope,0,.72,0);
    bx(w,.032,.032,.31,wd,0,.72,.165);bx(w,.036,.04,.02,rope,0,.716,.06);bx(w,.036,.04,.02,rope,0,.716,.28);
    bx(w,.012,.37,.26,cl,0,.52,.17);bx(w,.016,.075,.075,pt,0,.55,.17,Math.PI/4,0,0);bx(w,.014,.06,.05,clD,0,.4,.08);bx(w,.014,.04,.03,clD,0,.64,.25);
    for(let i=0;i<6;i++){const tw=.26/6*(.6+.3*r()),L=.03+.07*r(),z=.04+(i+.5)*.26/6;bx(w,.012,L,tw,cl,0,.335-L/2+.004,z);}}
  else{
    /* thick shaft with iron bands, a wooden knob with bone spikes, and a big stone bound on top with an iron strap */
    const stone=bm('#64615b','plain'),stD=bm('#4f4c47','plain'),wrap=bm('#382b21','leather');
    bx(w,.068,1.2,.068,wd,0,-.02,0);bx(w,.078,.05,.078,ir,0,-.585,0);bx(w,.076,.035,.076,ir,0,-.24,0);bx(w,.074,.16,.074,wrap,0,0,0);bx(w,.03,.04,.03,wdD,.04,.3,0);
    bx(w,.13,.1,.13,wdD,0,.6,0);bx(w,.14,.03,.14,rope,0,.57,0);
    for(const[x,z,rx,rz]of[[.075,0,0,-.9],[-.075,0,0,.9],[0,.075,.9,0],[0,-.075,-.9,0]])bx(w,.022,.06,.022,bone,x,.615,z,rx,0,rz);
    bx(w,.17,.14,.16,stone,0,.72,0);bx(w,.06,.05,.012,stD,.03,.7,.083);bx(w,.012,.05,.06,stD,-.088,.74,-.02);
    for(const s of[-1,1])bx(w,.012,.15,.04,ir,s*.091,.715,0);bx(w,.194,.012,.04,ir,0,.796,0);}
  return w;}

function buildGShaman(seed,o={}){const r=mulberry32(((seed*2654435761)>>>0)^0x5a3c),pick=a=>a[Math.floor(r()*a.length)];
  const kind=o.staff&&o.staff!=='random'?o.staff:pick(Object.keys(SH_STAFF)),ear=pick(['L','R','both']),cloth=pick(GB_RAG),patch=pick(GB_RAG.filter(c=>c!==cloth));
  const body=buildGoblin(seed,{skin:o.skin,top:o.top,legs:o.legs,B:VB.gshaman,weapon:'none',noClips:true,shaman:{ear}});
  const wr=new THREE.Group();wr.name='weapon_R';body.getObjectByName('socket_R').add(wr);const wp=shStaff(kind,cloth[0],patch[0]);wp.quaternion.copy(SH_BASIS());wr.add(wp);
  if(o.bare)return body;
  const root=new THREE.Group();root.userData.lights=[];body.scale.setScalar(SH_SC);root.add(body);
  const D2=Math.PI/180,Jn=n=>root.getObjectByName(n);
  /* the fist stays closed while the staff is held (the hand may slide along it); a death turns it loose */
  root.userData.post=()=>{if(Math.abs(wr.quaternion.w)<.9999||Math.abs(wr.position.x)+Math.abs(wr.position.y)>1e-4)return;Jn('fingers_R').rotation.set(0,0,95*D2);Jn('fingerTips_R').rotation.set(0,0,90*D2);Jn('thumb_R').rotation.set(14*D2,0,33*D2);};
  root.userData.joints=body.userData.joints;
  if(!o.noClips)root.userData.clips=shamanClips(kind);root.userData.ground=1.8;
  const earT={L:'earring in the left ear',R:'earring in the right ear',both:'earrings in both ears'}[ear];
  root.userData.variantText=body.userData.variantText.replace(/\.$/,'')+`; thick belt, tooth necklace, ${earT}; ${SH_STAFF[kind]}${kind==='banner'?` (${cloth[1]})`:''}.`;
  return root;}

/* ---------- clips ---------- */
const SHCLIPS={};
/* planted staff: the grip sits on the line from the foot T, SH_LB - sl along the staff */
function shPlanted(o){const Lb=SH_LB-o.sl[0],T=o.T,G=o.G,hx=G[0]-T[0],hz=G[1]-T[2],hy=Math.sqrt(Math.max(1e-4,Lb*Lb-hx*hx-hz*hz));
  return{g:[G[0]-o.HP[0],T[1]+hy,G[1]-o.HP[2]],d:[hx/Lb,hy/Lb,hz/Lb]};}
function shStaffPose(o){const w=o.pl[0],n=v=>{const l=Math.hypot(...v)||1;return v.map(x=>x/l);};let g=o.gR.slice(),d=n(o.dR);
  if(w>0){const p=shPlanted(o);g=g.map((v,i)=>v+(p.g[i]-v)*w);d=n(d.map((v,i)=>v+(p.d[i]-v)*w));}o.gR=g;o.dR=d;return o;}
/* stances (goblin metres). Normal: hunched, leaning on the staff planted ahead on the right. War: low and wide, left side
   forward, staff planted further out, left claw raised */
const SH_N=shStaffPose({HP:[0,-.05,0],h:[8,0,0],sp:[10,0,0],ch:[6,0,0],nk:[0,0,0],hd:[0,0,0],FL:[.1,.03,6,0,0],FR:[-.1,.03,-6,0,0],
  T:[-.42,.012,.52],G:[-.41,.38],pl:[1],sl:[0],ap:[1],gR:[0,0,0],dR:[0,1,0],eR:[0,0,1],pR:[-.8,-.4,-.4],gL:[.28,.45,.1],dL:[1,0,0],pL:[.8,-.5,-.3],fist:[30,95]});
const SH_W=shStaffPose({HP:[0,-.08,0],h:[12,-14,0],sp:[10,-4,0],ch:[6,-4,0],nk:[0,0,0],hd:[0,0,0],FL:[.12,.11,-10,0,0],FR:[-.13,-.13,-36,0,0],
  T:[-.47,.012,.58],G:[-.45,.4],pl:[1],sl:[0],ap:[1],gR:[0,0,0],dR:[0,1,0],eR:[0,0,1],pR:[-.8,-.4,-.4],gL:[.24,.74,.36],dL:[.3,.6,.7],pL:[.85,-.5,-.2],fist:[45,95]});
/* IK rig whose right socket matches the goblin's (deeper in the fist), and the staff's corners in socket space for the ground check */
function shRig(B,kind){const R=wrRig(B,false),V=THREE.Vector3,hk=B.hand;R.J.socket_R.position.set(.012*hk,-.088*hk,0);
  const st=shStaff(kind,'#76726e','#76726e'),bq=SH_BASIS(),C8=[];st.updateMatrixWorld(true);
  st.traverse(m=>{if(!m.isMesh)return;const p=m.geometry.parameters;for(let i=0;i<8;i++)C8.push(new V((i&1?.5:-.5)*p.width,(i&2?.5:-.5)*p.height,(i&4?.5:-.5)*p.depth).applyMatrix4(m.matrix).applyQuaternion(bq));});
  const v=new V();R.low=sl=>{R.m.updateMatrixWorld(true);const M=R.J.socket_R.matrixWorld;let y=1e9;for(const c of C8){v.copy(c);v.z+=sl;v.applyMatrix4(M);if(v.y<y)y=v.y;}return y;};
  return R;}

function shamanClips(kind){if(SHCLIPS[kind])return SHCLIPS[kind];const B=VB.gshaman,D=Math.PI*2,S=Math.sin,C=Math.cos,L=[],R=shRig(B,kind),gU=o=>gbU(B,o);
  /* elbow pole (weighted by ap): searched around the shoulder-wrist line for a forearm that crosses the staff at a right angle,
     keeping the elbow out from the chest and near the authored pole; the knuckles then continue the forearm (straight wrist),
     so the staff never runs back through the arm */
  const V=THREE.Vector3,cl=x=>Math.min(1,Math.max(-1,x));
  const pole=o=>{const w=o.ap[0];if(w<=0)return;R.m.updateMatrixWorld(true);const S=R.J.upperArm_R.getWorldPosition(new V()),W=R.J.hand_R.getWorldPosition(new V()),d=new V(...o.dR).normalize(),a=B.ua,b=B.fa;
    const out=new V(-1,0,0).applyQuaternion(R.J.chest.getWorldQuaternion(new THREE.Quaternion()));
    const Dv=W.clone().sub(S),Dl=Math.min(Math.max(Dv.length(),.05),(a+b)*.999),u=Dv.normalize(),al=Math.acos(cl((a*a+Dl*Dl-b*b)/(2*a*Dl)));
    const pA=new V(...o.pR0);pA.addScaledVector(u,-pA.dot(u)).normalize();const e2=new V().crossVectors(u,pA);
    let best=pA,bs=-1e9;for(let i=0;i<72;i++){const f=i/72*Math.PI*2,q=pA.clone().multiplyScalar(Math.cos(f)).addScaledVector(e2,Math.sin(f));
      const E=S.clone().addScaledVector(u,a*Math.cos(al)).addScaledVector(q,a*Math.sin(al)),F=W.clone().sub(E).normalize();
      const sc=-2*Math.abs(F.dot(d))+.4*q.dot(pA)-4*Math.max(0,.5-q.dot(out));if(sc>bs){bs=sc;best=q;}}
    const pp=pA.clone().lerp(best,w).normalize(),E=S.clone().addScaledVector(u,a*Math.cos(al)).addScaledVector(pp,a*Math.sin(al));
    o.pR=pp.toArray();o.eR=new V(...o.eR0).normalize().lerp(W.clone().sub(E).normalize(),w).toArray();};
  /* solve, then put the staff on the ground (planted) or lift the grip until nothing of it is below the ground */
  const solve=o=>{shStaffPose(o);o.pR0=o.pR;o.eR0=o.eR;let s=wrSolve(R,gU(o));for(let i=0;i<2;i++){pole(o);s=wrSolve(R,gU(o));}
    for(let it=0;it<3;it++){const y=R.low(o.sl[0]),dy=o.pl[0]>.999?.003-y:Math.max(0,.003-y);if(Math.abs(dy)<3e-4)break;o.gR=[o.gR[0],o.gR[1]+dy,o.gR[2]];s=wrSolve(R,gU(o));}return s;};
  const CC=(name,dur,fn,o)=>{const c=sampleClip(name,dur,t=>solve(fn(t)),Object.assign({autoFeet:false},o),B);
    const T=c.tracks[0].times,P=[];for(const t of T)P.push(0,0,fn(t).sl[0]);c.tracks.push(new THREE.VectorKeyframeTrack('weapon_R.position',Array.from(T),P));L.push(c);return c;};
  const KC=(name,dur,keys,note,base=SH_W)=>CC(name,dur,wrKeys(keys.map(q=>[q[0],wrP(base,q[1])])),{note});
  const bob=(o,dy)=>{o.gL=[o.gL[0],o.gL[1]+dy*1.2,o.gL[2]];return o;};
  /* in-place IK gait (n strides per clip). Feet slide back while planted and swing forward lifted; with st the staff is planted
     a little after the left heel, slides back with the ground (a shorter stance, same speed) and swings forward lifted */
  const GAIT=(name,dur,G,note)=>{const n=G.n||1,fn=t=>{const U=t/dur,u=(U*n)%1,o=G.body(u,U),c2=C(D*(u-G.duty/2));o.HP=[G.sw*c2,G.y0-G.b*C(2*D*(u-G.duty/2)),0];
      for(const[sd,off,x,yaw]of[['L',0,G.x,G.yaw[0]],['R',.5,-G.x,G.yaw[1]]]){const q=(((u+off)%1)+1)%1;let z,l,pt;
        if(q<G.duty){const v=q/G.duty;z=G.s*(1-2*v);l=0;pt=v<.15?-10*(1-v/.15):v>.7?G.toe*(v-.7)/.3:0;}
        else{const v=(q-G.duty)/(1-G.duty),sm=v*v*(3-2*v);z=-G.s+2*G.s*sm;l=G.lift*Math.sin(Math.PI*Math.pow(v,G.lp||1));pt=G.toe*(1-v)*(1-v)-12*v*v;}
        o['F'+sd]=[x,z,yaw,l,pt];}
      if(G.st){const s=G.st,q=(((u-s.off)%1)+1)%1,ss=G.s*s.duty/G.duty;let z,l=0;
        if(q<s.duty)z=ss*(1-2*q/s.duty);else{const v=(q-s.duty)/(1-s.duty),sm=v*v*(3-2*v);z=-ss+2*ss*sm;l=s.lift*Math.sin(Math.PI*v);}
        o.T=[s.x,.012+l,s.z+z];o.G=[s.gx,s.gz+.45*z];o.pl=[1];}
      return o;};
    const sp=2*G.s*n/(G.duty*dur),c=CC(name,dur,fn,{loop:true,note:`${note}, in place, ${(sp*SH_SC).toFixed(1)} m/s`});c.speed=sp*SH_SC;};

  /* ---- normal mode ---- */
  CC('Idle',3.6,t=>{const p=D*t/3.6,b=S(p),b2=S(2*p);return wrP(SH_N,{HP:[.01*b,-.05-.006*b2,0],h:[8,0,1.5*b],sp:[10+.8*b2,0,0],ch:[6+1.2*b2,2*S(p+.8),0],
      hd:[2*S(2*p+1),26*S(p+.6),0],gL:[.28,.45+.01*b2,.1+.02*S(p+.5)]});},{loop:true,note:'Leaning on the planted staff, weight shift, looking around'});
  GAIT('Walk',.95,{duty:.62,s:.13,lift:.06,toe:20,x:.1,yaw:[6,-6],y0:-.06,b:.008,sw:.015,st:{off:.04,duty:.55,lift:.07,x:-.42,z:.52,gx:-.41,gz:.38},
    body:u=>wrP(SH_N,{h:[8,-6*C(D*(u-.04)),3*S(D*(u+.1))],sp:[10,2*C(D*(u-.04)),0],ch:[6+1*C(2*D*(u-.18)),6*C(D*(u-.04)),0],gL:[.28,.46,.1-.12*C(D*(u-.04))],dL:[1,0,.2]})},'Hunched steps, the staff planted with every left step');
  GAIT('Run',.5,{duty:.32,s:.19,lift:.14,lp:.7,toe:30,x:.1,yaw:[2,-4],y0:-.06,b:.014,sw:.01,
    body:u=>{const a=C(D*(u-.9));return wrP(SH_N,{h:[16,-8*C(D*(u-.92)),4*S(D*(u+.15))],sp:[12,3*C(D*(u-.92)),0],ch:[8+1.5*C(2*D*(u-.12)),10*C(D*(u-.92)),0],pl:[0],
      gR:[-.38,.62+.02*C(2*D*u),.2+.1*a],dR:[-.06,.5,.86],eR:[0,1,0],pR:[-.8,-.4,-.4],gL:[.3,.6+.04*a,.12-.18*a],dL:[.6,0,.8],pL:[.8,-.5,-.3],fist:[60,95]});}},'Leaning in, the staff carried forward');
  /* run away: four strides, staff held up and flapping, free arm flailing, looking back over each shoulder in turn */
  GAIT('Run away',1.84,{n:4,duty:.3,s:.2,lift:.15,lp:.7,toe:32,x:.1,yaw:[2,-4],y0:-.05,b:.016,sw:.01,
    body:(u,U)=>{const lk=S(D*U),tw=Math.sign(lk)*Math.pow(Math.abs(lk),.6),a=S(D*u);return wrP(SH_N,{h:[10,-8*C(D*(u-.92)),4*S(D*(u+.15))],sp:[6,3*C(D*(u-.92)),0],ch:[2,8*C(D*(u-.92))+22*tw,0],nk:[0,28*tw,0],hd:[-8,60*tw,0],pl:[0],
      gR:[-.42,1.26+.05*a,.05],dR:[.08,.25+.15*a,-.96],eR:[0,1,0],pR:[-.8,-.2,-.5],gL:[.42,.9+.12*S(2*D*u),.2-.2*a],dL:[.6,.3,.7],pL:[.85,-.4,-.3],fist:[15,95]});}},'Panicked flight, staff waved high, looking back');

  /* ---- war mode ---- */
  CC('Idle (war mode)',2.2,t=>{const p=D*t/2.2,b=S(p),b2=S(p+.6);return bob(wrP(SH_W,{HP:[.01*S(p*.5),-.08-.008*b,0],sp:[10+1.2*b,-4,0],ch:[6+1.5*b,-4,0],hd:[0,8*S(p*.5),0]}),-.012*b2);},{loop:true,note:'Low and wide, leaning on the planted staff, claw raised'});
  GAIT('Walk (war mode)',.9,{duty:.62,s:.12,lift:.06,toe:22,x:.12,yaw:[-8,-26],y0:-.09,b:.008,sw:.012,st:{off:.04,duty:.55,lift:.07,x:-.47,z:.58,gx:-.45,gz:.4},
    body:u=>bob(wrP(SH_W,{h:[12,-12-4*C(D*u),3*S(D*(u+.1))],sp:[10,-3,0],ch:[6,-4,0]}),.01*C(2*D*u))},'Stalking, the staff planted with every left step');
  GAIT('Run (war mode)',.5,{duty:.36,s:.2,lift:.14,lp:.7,toe:32,x:.1,yaw:[-4,-12],y0:-.06,b:.016,sw:.01,
    body:u=>bob(wrP(SH_W,{h:[20,-8-6*C(D*u),3*S(D*(u+.1))],sp:[12,-3,0],ch:[6,-4,0],pl:[0],gR:[-.32,.66,.22+.04*C(D*u)],dR:[.04,.42,.9],eR:[0,1,0],gL:[.2,.68,.36]}),.015*C(2*D*(u-.1)))},'Charging, staff pointed ahead');

  /* ---- attacks: the hand slides down to the foot of the staff (sl) and swings it like a club ---- */
  KC('Light attack 1',1.0,[[0,{}],
    [.2,{pl:[0],sl:[.48],HP:[0,-.09,-.03],h:[12,-40,0],sp:[12,-8,0],ch:[6,-22,0],gR:[-.42,.84,-.04],dR:[-.55,.3,-.78],eR:[0,1,0],pR:[-.5,-.3,-.8],gL:[.24,.74,.36]}],
    [.32,{pl:[0],sl:[.5],HP:[0,-.1,.04],h:[14,-14,0],ch:[8,0,0],FL:[.12,.22,-10,.04,0],gR:[-.4,.8,.24],dR:[-.95,.12,.28],eR:[0,1,0],pR:[-.4,-.8,-.4],gL:[.28,.72,.3]}],
    [.4,{pl:[0],sl:[.5],HP:[0,-.11,.08],h:[16,4,0],sp:[12,4,0],ch:[8,18,0],FL:[.12,.27,-8,0,0],gR:[-.08,.78,.46],dR:[-.2,.08,.97],eR:[0,1,0],pR:[-.4,-.8,-.4],gL:[.34,.7,.16],dL:[.8,.4,.4]}],
    [.48,{pl:[0],sl:[.5],HP:[0,-.11,.08],h:[16,16,0],sp:[12,8,0],ch:[8,28,0],FL:[.12,.27,-8,0,0],gR:[.24,.74,.4],dR:[.82,-.04,.56],eR:[0,1,0],pR:[-.3,-.9,-.3],gL:[.38,.7,0],dL:[.9,.3,-.1]}],
    [.6,{pl:[0],sl:[.5],HP:[0,-.11,.07],h:[16,20,0],sp:[12,8,0],ch:[8,30,0],FL:[.12,.27,-8,0,0],gR:[.32,.72,.26],dR:[.96,-.08,.2],eR:[0,1,0],pR:[-.3,-.9,-.3],gL:[.38,.7,-.02],dL:[.9,.3,-.1]}],
    [.7,{pl:[0],sl:[.5],HP:[0,-.1,.05],h:[15,4,0],sp:[12,4,0],ch:[8,10,0],FL:[.12,.22,-9,.03,0],gR:[0,.62,.52],dR:[.2,-.25,.95],eR:[0,1,0],pR:[-.4,-.8,-.4]}],
    [.82,{pl:[0],sl:[.2],HP:[0,-.09,.02],h:[14,-8,0],ch:[8,-4,0],FL:[.12,.16,-10,0,0],gR:[-.34,.66,.42],dR:[-.25,.55,.8],eR:[0,0,1]}],
    [1.0,{}]],'Hand slides down the staff, sweep right to left with a skip forward');
  KC('Light attack 2',.9,[[0,{}],
    [.24,{pl:[0],sl:[.5],HP:[0,-.06,-.04],h:[6,-24,0],sp:[2,-4,0],ch:[-6,-10,0],gR:[-.26,1.28,.02],dR:[0,.5,-.86],eR:[0,1,0],pR:[-.8,.3,-.2],gL:[.2,.78,.4]}],
    [.34,{pl:[0],sl:[.5],HP:[0,-.09,.04],h:[12,-18,0],sp:[8,-2,0],ch:[2,-4,0],FL:[.12,.22,-10,.04,0],gR:[-.26,1.22,.36],dR:[0,.95,.3],eR:[0,0,1],pR:[-.8,.1,-.3]}],
    [.42,{pl:[0],sl:[.5],HP:[0,-.13,.09],h:[17,-14,0],sp:[13,0,0],ch:[6,0,0],FL:[.12,.27,-8,0,0],gR:[-.24,.62,.55],dR:[0,-.45,.9],eR:[0,1,0],pR:[-.7,-.5,-.3],gL:[.26,.66,.3],dL:[.4,.5,.75]}],
    [.58,{pl:[0],sl:[.5],HP:[0,-.13,.09],h:[17,-14,0],sp:[13,0,0],ch:[6,0,0],FL:[.12,.27,-8,0,0],gR:[-.24,.63,.54],dR:[0,-.44,.9],eR:[0,1,0],pR:[-.7,-.5,-.3],gL:[.27,.67,.3],dL:[.4,.5,.75]}],
    [.72,{pl:[.5],sl:[.15],HP:[0,-.1,.03],h:[14,-16,0],FL:[.12,.18,-12,.04,0],gR:[-.36,.7,.4],dR:[-.05,.95,.2],eR:[0,0,1]}],
    [.9,{}]],'Staff swung up and chopped straight down onto the ground ahead');
  KC('Heavy attack',1.5,[[0,{}],
    [.42,{pl:[0],sl:[.5],HP:[0,-.17,-.06],h:[10,-40,0],sp:[-2,-8,0],ch:[-10,-20,0],gR:[-.3,1.28,-.1],dR:[-.1,-.2,-.97],eR:[0,1,0],pR:[-.8,.3,-.3],gL:[.32,.94,.38],dL:[.3,.8,.5],pL:[.9,-.2,-.3],fist:[10,95]}],
    [.56,{pl:[0],sl:[.5],HP:[0,-.05,.1],h:[4,-18,0],sp:[2,-4,0],ch:[-6,-8,0],FL:[.12,.3,-8,.07,0],gR:[-.32,1.32,.1],dR:[0,.92,.38],eR:[0,0,1],pR:[-.8,.2,-.3],gL:[.3,.9,.4],dL:[.3,.8,.5],fist:[10,95]}],
    [.64,{pl:[0],sl:[.5],HP:[0,-.14,.2],h:[16,-6,0],sp:[12,2,0],ch:[6,6,0],FL:[.12,.38,-8,0,0],gR:[-.28,.96,.56],dR:[0,.4,.92],eR:[0,1,0],pR:[-.7,-.4,-.4],gL:[.32,.78,.24],dL:[.6,.5,.6]}],
    [.72,{pl:[0],sl:[.5],HP:[0,-.22,.24],h:[18,-8,0],sp:[12,0,0],ch:[6,2,0],FL:[.12,.4,-8,0,0],gR:[-.22,.42,.56],dR:[0,-.55,.84],eR:[0,1,0],pR:[-.6,-.7,-.3],gL:[.34,.6,.14],dL:[.7,.5,.4]}],
    [.95,{pl:[0],sl:[.5],HP:[0,-.23,.24],h:[18,-8,0],sp:[12,0,0],ch:[6,2,0],FL:[.12,.4,-8,0,0],gR:[-.22,.42,.56],dR:[0,-.55,.84],eR:[0,1,0],pR:[-.6,-.7,-.3],gL:[.34,.6,.14],dL:[.7,.5,.4]}],
    [1.15,{pl:[0],sl:[.3],HP:[0,-.17,.18],h:[18,-4,0],sp:[14,2,0],ch:[6,4,0],FL:[.12,.4,-8,0,0],gR:[-.26,.66,.5],dR:[0,.6,.8],eR:[0,1,0],pR:[-.6,-.7,-.3]}],
    [1.32,{pl:[.6],sl:[.1],HP:[0,-.1,.04],h:[14,-14,0],FL:[.12,.22,-10,.05,0],gR:[-.36,.7,.36],dR:[-.05,.95,.25],eR:[0,0,1]}],
    [1.5,{}]],'Wind-up behind the head, lunge and smash the staff head into the ground');

  /* ---- jumps: the staff leaves the ground with the body ---- */
  const dip={HP:[0,-.18,-.02],h:[24,-18,0],sp:[16,-4,0],ch:[8,-6,0],gL:[.34,.5,.12],dL:[.4,.3,.85]};
  KC('Jump',1.2,[[0,{}],[.22,dip],
    [.36,{HP:[0,0,.02],h:[2,-20,0],sp:[2,-4,0],ch:[0,-6,0],FL:[.12,.11,-10,0,30],FR:[-.13,-.13,-36,0,30],T:[-.47,.05,.58],gL:[.26,1.08,.32]}],
    [.56,{HP:[0,.2,0],h:[12,-20,0],sp:[10,-4,0],FL:[.12,.12,-10,.16,15],FR:[-.13,-.12,-36,.13,15],T:[-.47,.27,.58],gL:[.26,1.2,.34]}],
    [.76,{HP:[0,.0,0],h:[8,-20,0],FL:[.12,.11,-10,0,16],FR:[-.13,-.13,-36,0,16],T:[-.47,.012,.58],gL:[.22,.94,.4]}],
    [.9,{HP:[0,-.17,-.02],h:[24,-20,0],sp:[16,-4,0],ch:[8,-6,0],gL:[.3,.6,.46]}],
    [1.2,{}]],'Squat, spring up about 0.25 m with the staff, land on feet and staff');
  {const hi={pl:[0],sl:[.4],gR:[-.28,1.36,-.04],dR:[0,.3,-.95],eR:[0,1,0],pR:[-.8,.3,-.2],gL:[.24,1.0,.36]};
  KC('Jump & attack',1.5,[[0,{}],[.22,dip],
    [.3,{pl:[0],sl:[.3],HP:[0,-.08,.01],h:[10,-18,0],sp:[6,-4,0],ch:[0,-6,0],gR:[-.4,1.0,.08],dR:[-.1,.85,-.5],eR:[0,0,1],pR:[-.9,0,-.3],gL:[.24,.8,.3]}],
    [.38,wrP(hi,{HP:[0,0,.03],h:[-2,-18,0],sp:[-4,-4,0],ch:[-8,-6,0],FL:[.12,.11,-14,0,30],FR:[-.13,-.13,-36,0,30]})],
    [.58,wrP(hi,{HP:[0,.22,.04],h:[0,-14,0],sp:[-4,0,0],ch:[-8,-4,0],FL:[.12,.14,-14,.18,15],FR:[-.13,-.1,-36,.15,15],gR:[-.28,1.5,-.04]})],
    [.76,{pl:[0],sl:[.4],HP:[0,.01,.06],h:[10,-8,0],sp:[8,0,0],ch:[2,0,0],FL:[.12,.14,-14,0,16],FR:[-.13,-.1,-36,0,16],gR:[-.26,1.0,.5],dR:[0,.6,.8],eR:[0,1,0],pR:[-.7,-.5,-.3],gL:[.3,.8,.3]}],
    [.88,{pl:[0],sl:[.5],HP:[0,-.2,.08],h:[20,-6,0],sp:[14,0,0],ch:[8,2,0],FL:[.12,.14,-14,0,0],FR:[-.13,-.1,-36,0,0],gR:[-.22,.42,.5],dR:[0,-.5,.87],eR:[0,1,0],pR:[-.7,-.6,-.3],gL:[.32,.58,.12],dL:[.6,.5,.5]}],
    [1.12,{pl:[0],sl:[.5],HP:[0,-.19,.07],h:[19,-6,0],sp:[13,0,0],ch:[7,2,0],FL:[.12,.14,-14,0,0],FR:[-.13,-.1,-36,0,0],gR:[-.22,.43,.49],dR:[0,-.5,.87],eR:[0,1,0],pR:[-.7,-.6,-.3],gL:[.32,.6,.14],dL:[.6,.5,.5]}],
    [1.5,{}]],'Leap with the staff raised, smash it down on landing');}

  /* ---- hit reactions: start and end in the war stance; the staff stays planted (or is carried back with him) ---- */
  KC('Hit 1',.65,[[0,{}],
    [.06,{HP:[0,-.08,-.07],h:[6,-16,0],sp:[-10,-4,0],ch:[-22,-4,0],nk:[-12,0,0],hd:[-28,0,0],gL:[.22,.8,.24],dL:[.2,.8,.5],fist:[20,95]}],
    [.13,{HP:[0,-.085,-.08],h:[5,-16,0],sp:[-12,-4,0],ch:[-24,-4,0],nk:[-14,0,0],hd:[-30,0,2],gL:[.22,.82,.22],dL:[.2,.8,.5],fist:[20,95]}],
    [.32,{HP:[0,-.09,-.03],h:[12,-15,0],sp:[6,-4,0],ch:[2,-4,0],hd:[-6,0,0],gL:[.19,.72,.38]}],
    [.65,{}]],'Blow to the face: head and shoulders snap back, then recover');
  KC('Hit 2',.7,[[0,{}],
    [.06,{HP:[0,-.12,-.02],h:[18,-14,0],sp:[18,-4,0],ch:[16,-4,0],nk:[20,0,0],hd:[30,0,0],gL:[.18,.6,.36],fist:[30,95]}],
    [.13,{HP:[0,-.13,-.02],h:[19,-14,0],sp:[19,-4,0],ch:[17,-4,0],nk:[22,0,0],hd:[34,0,2],gL:[.18,.58,.36],fist:[30,95]}],
    [.35,{HP:[0,-.09,0],h:[13,-14,0],sp:[11,-4,0],ch:[6,-4,0],nk:[2,0,0],hd:[4,0,0],gL:[.18,.69,.41]}],
    [.7,{}]],'Blow on top of the head: head ducks down sharply, then recovers');
  KC('Heavy hit 1',1.5,[[0,{}],
    [.1,{HP:[0,-.06,-.07],h:[-6,-20,0],sp:[-14,-4,0],ch:[-16,-6,0],hd:[-20,0,4],T:[-.47,.05,.54],G:[-.45,.34],gL:[.34,.9,.2],dL:[.5,.6,.6],fist:[10,95]}],
    [.28,{HP:[0,-.08,-.16],h:[0,-18,0],sp:[-6,-4,0],ch:[-8,-6,0],hd:[-8,0,0],FR:[-.13,-.32,-38,.06,0],T:[-.47,.07,.46],G:[-.45,.26],gL:[.3,.84,.24]}],
    [.45,{HP:[0,-.12,-.24],h:[12,-18,0],sp:[8,-4,0],ch:[4,-6,0],hd:[2,0,0],FR:[-.13,-.34,-38,0,0],T:[-.47,.012,.34],G:[-.45,.16],gL:[.22,.74,.38]}],
    [.6,{HP:[0,-.1,-.26],FL:[.12,-.04,-11,.05,0],FR:[-.13,-.34,-38,0,0],T:[-.47,.012,.34],G:[-.45,.15]}],
    [.75,{HP:[0,-.09,-.28],FL:[.12,-.15,-10,0,0],FR:[-.13,-.34,-38,0,0],T:[-.47,.012,.34],G:[-.45,.13]}],
    [1.0,{HP:[0,-.08,-.16],FL:[.12,0,-10,.05,0],FR:[-.13,-.34,-38,0,0],T:[-.47,.06,.46],G:[-.45,.25]}],
    [1.12,{HP:[0,-.08,-.1],FR:[-.13,-.34,-38,0,0],T:[-.47,.04,.52],G:[-.45,.31]}],
    [1.3,{HP:[0,-.08,-.04],FR:[-.13,-.28,-37,.05,0],T:[-.47,.012,.58],G:[-.45,.37]}],
    [1.5,{}]],'Knocked back two steps with the staff, then steps in again');
  KC('Heavy hit 2',1.9,[[0,{}],
    [.1,{HP:[.02,-.08,-.06],h:[-4,-26,4],sp:[-12,-6,4],ch:[-14,-8,4],hd:[-16,0,6],gL:[.34,.88,.2],dL:[.5,.6,.6],fist:[10,95]}],
    [.3,{HP:[0,-.14,-.12],h:[10,-18,0],sp:[0,-4,0],ch:[-4,-4,0],hd:[-6,0,0],FR:[-.13,-.34,-36,.06,0],gL:[.3,.7,.3]}],
    [.55,{HP:[0,-.25,-.1],h:[24,-12,0],sp:[16,-4,0],ch:[8,-4,0],hd:[4,0,0],FL:[.12,.2,-10,0,0],FR:[-.13,-.32,-30,0,70],gL:[.2,.37,.3],dL:[.3,.8,.4],pL:[.85,-.5,.1],fist:[60,95]}],
    [.68,{HP:[0,-.27,-.1],h:[26,-12,0],sp:[18,-4,0],ch:[9,-4,0],hd:[6,0,0],FL:[.12,.2,-10,0,0],FR:[-.13,-.32,-30,0,70],gL:[.2,.36,.3],dL:[.3,.8,.4],pL:[.85,-.5,.1],fist:[60,95]}],
    [1.05,{HP:[0,-.26,-.1],h:[24,-10,0],sp:[16,-4,0],ch:[8,-4,0],hd:[-4,4,0],FL:[.12,.2,-10,0,0],FR:[-.13,-.32,-30,0,70],gL:[.2,.37,.3],dL:[.3,.8,.4],pL:[.85,-.5,.1],fist:[60,95]}],
    [1.3,{HP:[0,-.18,-.08],h:[28,-14,0],sp:[18,-4,0],ch:[8,-4,0],FL:[.12,.16,-10,0,0],FR:[-.13,-.3,-34,0,30],gL:[.18,.42,.36],pL:[.85,-.5,0]}],
    [1.55,{HP:[0,-.11,-.05],h:[16,-14,0],FR:[-.13,-.22,-36,.05,0],gL:[.2,.62,.46],pL:[.85,-.5,-.1]}],
    [1.9,{}]],'Knocked down to one knee, leans on the staff and gets back up');

  /* ---- spells ---- */
  KC('Spell 1 (staff forward)',2.4,[[0,{}],
    [.35,{pl:[0],HP:[0,-.07,-.04],h:[8,-26,0],sp:[4,-6,0],ch:[-2,-8,0],hd:[-6,0,0],gR:[-.4,.72,.24],dR:[-.05,1,-.12],gL:[.14,.86,.3],dL:[0,.3,1],fist:[20,95]}],
    [.6,{pl:[0],HP:[0,-.11,.08],h:[14,-6,0],sp:[12,0,0],ch:[8,4,0],nk:[6,0,0],hd:[-4,0,0],FL:[.12,.22,-8,0,0],gR:[-.26,.76,.62],dR:[.06,.74,.67],gL:[.14,.86,.55],dL:[0,.3,-1],pL:[.85,-.4,-.3],fist:[0,95]}],
    [.95,{pl:[0],HP:[0,-.115,.09],h:[15,-6,0],sp:[13,0,0],ch:[8,4,0],nk:[6,0,0],hd:[-5,1,0],FL:[.12,.22,-8,0,0],gR:[-.25,.77,.64],dR:[.06,.72,.69],gL:[.15,.87,.57],dL:[0,.3,-1],pL:[.85,-.4,-.3],fist:[0,95]}],
    [1.3,{pl:[0],HP:[0,-.11,.085],h:[14,-6,0],sp:[12,0,0],ch:[8,4,0],nk:[6,0,0],hd:[-4,-1,0],FL:[.12,.22,-8,0,0],gR:[-.26,.755,.63],dR:[.05,.75,.66],gL:[.14,.86,.56],dL:[0,.3,-1],pL:[.85,-.4,-.3],fist:[8,95]}],
    [1.65,{pl:[0],HP:[0,-.115,.09],h:[15,-6,0],sp:[13,0,0],ch:[8,4,0],nk:[6,0,0],hd:[-5,1,0],FL:[.12,.22,-8,0,0],gR:[-.25,.765,.64],dR:[.06,.73,.68],gL:[.15,.87,.57],dL:[0,.3,-1],pL:[.85,-.4,-.3],fist:[0,95]}],
    [1.95,{pl:[.3],HP:[0,-.09,.02],h:[12,-12,0],FL:[.12,.14,-9,.03,0],gR:[-.4,.68,.48],dR:[-.04,.97,.2]}],
    [2.4,{}]],'Draws the staff in, then thrusts it out at arm length, head tilted at the target, open claw beside it; holds');
  KC('Spell 2 (staff slam)',2.2,[[0,{}],
    [.45,{pl:[0],HP:[0,-.02,-.02],h:[2,-14,0],sp:[-2,-4,0],ch:[-8,-4,0],hd:[-14,0,0],gR:[-.38,1.08,.34],dR:[-.1,.97,-.22],eR:[0,0,1],gL:[.3,1.02,.34],dL:[.4,.3,.85],fist:[0,95]}],
    [.6,{HP:[0,-.17,.02],h:[16,-14,0],sp:[10,-4,0],ch:[4,-4,0],nk:[0,0,0],hd:[-10,0,0],gL:[.4,.5,.3],dL:[.7,.7,.2],pL:[.9,-.3,-.2],fist:[0,95]}],
    [.72,{HP:[0,-.19,.02],h:[17,-14,0],sp:[11,-4,0],ch:[5,-4,0],nk:[0,0,0],hd:[-8,0,0],gL:[.42,.48,.28],dL:[.7,.7,.2],pL:[.9,-.3,-.2],fist:[0,95]}],
    [1.3,{HP:[0,-.17,.02],h:[16,-14,0],sp:[10,-4,0],ch:[4,-4,0],nk:[0,0,0],hd:[-14,0,0],gL:[.41,.5,.3],dL:[.7,.7,.2],pL:[.9,-.3,-.2],fist:[10,95]}],
    [1.7,{HP:[0,-.1,0],h:[14,-14,0],hd:[-2,0,0],gL:[.28,.66,.36]}],
    [2.2,{}]],'Lifts the staff high, slams its foot into the ground, crouches over it with the claw spread, holds');
  KC('Spell 3 (staff raised)',2.8,[[0,{}],
    [.25,{pl:[0],HP:[0,-.05,-.01],h:[4,-8,0],sp:[0,-2,0],ch:[-6,-2,0],hd:[-8,0,0],gR:[-.42,1.08,.2],dR:[-.05,1,0],gL:[.3,1.0,.25],dL:[0,.3,-1],fist:[40,95]}],
    [.5,{pl:[0],HP:[0,-.03,-.02],h:[-2,-4,0],sp:[-6,0,0],ch:[-12,-2,0],nk:[-8,0,0],hd:[-18,0,0],gR:[-.25,1.4,.1],dR:[1,.04,0],pR:[-.9,-.1,-.3],gL:[.25,1.4,.1],dL:[0,.3,-1],pL:[.9,-.1,-.3],fist:[95,95]}],
    [0.85,{pl:[0],HP:[0,-.03,-.02],h:[-3,-4,0],sp:[-7,0,0],ch:[-14,-2,0],nk:[-10,0,0],hd:[-22,0,0],gR:[-.25,1.440,.1],dR:[1,.04,0],pR:[-.9,-.1,-.3],gL:[.25,1.440,.1],dL:[0,.3,-1],pL:[.9,-.1,-.3],fist:[95,95]}],
    [1.1,{pl:[0],HP:[0,-.03,-.02],h:[-3,-4,0],sp:[-7,0,0],ch:[-14,-2,0],nk:[-10,0,0],hd:[-22,0,0],gR:[-.25,1.410,.1],dR:[1,.04,0],pR:[-.9,-.1,-.3],gL:[.25,1.410,.1],dL:[0,.3,-1],pL:[.9,-.1,-.3],fist:[95,95]}],
    [1.35,{pl:[0],HP:[0,-.03,-.02],h:[-3,-4,0],sp:[-7,0,0],ch:[-14,-2,0],nk:[-10,0,0],hd:[-22,0,0],gR:[-.25,1.445,.1],dR:[1,.04,0],pR:[-.9,-.1,-.3],gL:[.25,1.445,.1],dL:[0,.3,-1],pL:[.9,-.1,-.3],fist:[95,95]}],
    [1.6,{pl:[0],HP:[0,-.03,-.02],h:[-3,-4,0],sp:[-7,0,0],ch:[-14,-2,0],nk:[-10,0,0],hd:[-22,0,0],gR:[-.25,1.410,.1],dR:[1,.04,0],pR:[-.9,-.1,-.3],gL:[.25,1.410,.1],dL:[0,.3,-1],pL:[.9,-.1,-.3],fist:[95,95]}],
    [1.9,{pl:[0],HP:[0,-.03,-.02],h:[-3,-4,0],sp:[-7,0,0],ch:[-14,-2,0],nk:[-10,0,0],hd:[-22,0,0],gR:[-.25,1.440,.1],dR:[1,.04,0],pR:[-.9,-.1,-.3],gL:[.25,1.440,.1],dL:[0,.3,-1],pL:[.9,-.1,-.3],fist:[95,95]}],
    [2.35,{pl:[.4],HP:[0,-.07,0],h:[10,-12,0],sp:[6,-4,0],ch:[2,-4,0],hd:[-4,0,0],gR:[-.38,.8,.4],dR:[-.04,1,-.1],gL:[.26,.8,.36],fist:[45,95]}],
    [2.8,{}]],'Grabs the staff with both hands and lifts it level high above the head, head thrown back, holds it up shaking');

  /* ---- deaths: the goblin's, with the staff let go at once; it falls to the right and lies along the body ---- */
  const deaths=goblinDeaths(B,kind,{st:SH_W,R,M:buildGShaman(1,{skin:'green',top:'shirt',legs:'pants',staff:kind,bare:true}),drop:{'Death 1':[.01,[-1.2,.6,0]],'Death 2':[.01,[-1.2,.4,.2]]},lieZ:true});
  return SHCLIPS[kind]=L.concat(deaths);}

ASSETS.push({id:'goblin-shaman',folder:'characters/enemies/brutes',name:'Goblin shaman',kind:'character',variants:true,defaultSeed:3,groundR:1.8,build:(s,o)=>buildGShaman(s,o||{}),
  opts:[...ASSETS.find(a=>a.id==='goblin').opts.slice(0,3),{key:'staff',label:'Staff',choices:[['random','Random'],['gnarled','Gnarled staff'],['banner','Ragged banner'],['bulky','Bulky staff']],def:'random'}],
  desc:'Goblin shaman, about 1.6 m: taller and bulkier than the goblin, with the same looks (skin, ragged clothes, hair) plus a thick belt, a tooth necklace and earrings. Walks leaning on a gnarled staff, a ragged banner or a bulky stone-headed staff. All goblin clips with the staff (planted with every left step when walking), and three spells: staff pointed forward, staff slammed into the ground, staff raised overhead.'});
