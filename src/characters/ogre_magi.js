/* ======================= OGRE MAGI: the ogre in a hide robe, casting with a big staff in the right hand =======================
   Built by buildOgre with the robe option (open hide robe, half sleeves, robe skirt, cloth sash, talisman, gold earrings) and the
   staff as its weapon, so the body is the ogre's, in real metres. The staff is held in the right hand OM_LB above its foot; the
   left hand is free. Staff channels in the IK keys work like the goblin shaman's: T = staff foot [x,y,z] and G = grip [x,z], both
   absolute; pl = how far the staff follows T/G (1 = planted), otherwise gR/dR place it; sl slides the hand down towards the foot
   for swings (a weapon_R.position track); ap places the elbow so the forearm crosses the staff. After every solve the staff is
   pushed out of the body like the ogre's club, a planted staff is put on the ground and a carried one is never let below it. */
const OM_LB=1.5,OM_STAFF={gnarled:'gnarled crystal staff',skull:'horned skull staff',stone:'bound stone staff'};
const OM_SASH=[['#3e4a6a','deep blue'],['#4e3a5e','dark purple'],['#6a2e2a','dark red'],['#3e5236','moss green'],['#2e2a2a','soot black'],['#8a6a2a','ochre']];
const OM_GEM=[['#4a7a9a','blue stone'],['#5a8a5a','green stone'],['#8a3a3a','red stone'],['#6a5a8a','violet stone']];
const OMM={};function omGlow(hex){return OMM[hex]||(OMM[hex]=new THREE.MeshStandardMaterial({color:new THREE.Color(hex).convertSRGBToLinear(),emissive:new THREE.Color(hex).convertSRGBToLinear(),emissiveIntensity:1.1,roughness:.4}));}

/* staffs: grip at the origin, foot at -OM_LB, top about 1.6 above the grip; skull face and hooks towards +z */
function omStaff(kind){const w=new THREE.Group(),wd=bm('#5a4028','leather'),wdD=bm('#3e2c1c','leather'),wrap=bm('#3c2a1c','leather'),bone=bm('#d8ccaa','plain'),boneD=bm('#a89c7a','plain'),
    rope=vm('rope'),ir=vm('iron'),moss=bm('#4a5a2a','plain'),dark=bm('#1c1410','plain');
  if(kind==='gnarled'){
    /* crooked knotted shaft; at the top four roots curl up round a glowing crystal */
    for(const[y0,y1,x,z,rx,rz]of[[-1.5,-1.02,.01,0,0,.03],[-1.05,-.5,-.014,.01,.025,-.03],[-.53,.02,.01,-.01,-.025,.025],[0,.55,-.014,.01,.025,-.04],[.52,1.05,.014,-.01,-.02,.03],[1.02,1.32,-.004,0,.02,-.02]])
      bx(w,.12,y1-y0+.04,.12,wd,x,(y0+y1)/2,z,rx,0,rz);
    bx(w,.135,.1,.135,wdD,0,-1.45,0);for(const[x,y,z]of[[.07,-.7,0],[0,.3,.07],[-.07,.75,0],[.065,1.0,0],[0,-.25,-.07]])bx(w,.07,.09,.07,wdD,x,y,z);
    bx(w,.13,.14,.035,moss,.005,-.95,.065);bx(w,.035,.12,.1,moss,-.068,.42,0);bx(w,.14,.2,.14,wrap,0,0,0);
    bx(w,.18,.12,.18,wdD,0,1.32,0);
    for(const[x,z]of[[1,0],[-1,0],[0,1],[0,-1]]){bx(w,.06,.24,.06,wd,x*.11,1.46,z*.11,-z*.35,0,x*.35);bx(w,.055,.18,.055,wd,x*.13,1.66,z*.13,z*.3,0,-x*.3);bx(w,.05,.05,.05,wdD,x*.08,1.76,z*.08);}
    bx(w,.16,.3,.16,omGlow('#7cc4f0'),0,1.6,0,0,Math.PI/4,0);bx(w,.1,.1,.1,omGlow('#ccecfc'),0,1.78,0,0,Math.PI/4,0);}
  else if(kind==='skull'){
    /* straight pole with an iron foot and a leather grip; a horned beast skull on top, horns sweeping out and up; bones on cords */
    bx(w,.11,2.86,.11,wd,0,-.07,0);bx(w,.13,.1,.13,ir,0,-1.45,0);bx(w,.13,.36,.13,wrap,0,0,0);bx(w,.125,.04,.125,ir,0,-.2,0);bx(w,.125,.04,.125,ir,0,.2,0);
    bx(w,.16,.08,.16,rope,0,1.3,0);
    bx(w,.3,.26,.32,bone,0,1.5,0);bx(w,.2,.16,.26,bone,0,1.43,.26);bx(w,.16,.06,.04,boneD,0,1.38,.39);
    for(const s of[-1,1]){bx(w,.07,.07,.02,dark,s*.08,1.53,.161);bx(w,.03,.05,.02,dark,s*.04,1.44,.391);
      bx(w,.2,.09,.09,boneD,s*.24,1.58,0,0,0,s*.25);bx(w,.16,.08,.08,boneD,s*.38,1.66,0,0,0,s*.7);bx(w,.08,.15,.07,boneD,s*.45,1.79,0,0,0,s*.25);bx(w,.05,.1,.05,bone,s*.47,1.9,0);}
    for(const[x,z,L]of[[.08,.08,.32],[-.08,.06,.26],[0,-.09,.36]]){bx(w,.012,L,.012,rope,x,1.26-L/2,z);bx(w,.04,.13,.04,bone,x,1.26-L-.06,z);bx(w,.08,.03,.04,bone,x,1.26-L-.12,z);}}
  else{
    /* thick shaft with iron bands and a leather grip; a wooden knob with bone spikes holds a big stone, bound with iron straps */
    const stone=bm('#6e6a62','plain'),stD=bm('#54504a','plain');
    bx(w,.16,2.82,.16,wd,0,-.09,0);bx(w,.18,.1,.18,ir,0,-1.45,0);bx(w,.175,.06,.175,ir,0,-.75,0);bx(w,.175,.38,.175,wrap,0,0,0);bx(w,.175,.06,.175,ir,0,.7,0);
    bx(w,.07,.09,.07,wdD,.09,.4,0);bx(w,.3,.22,.3,wdD,0,1.36,0);bx(w,.32,.06,.32,rope,0,1.3,0);
    for(const[x,z,rx,rz]of[[.17,0,0,-.9],[-.17,0,0,.9],[0,.17,.9,0],[0,-.17,-.9,0]])bx(w,.05,.14,.05,bone,x,1.42,z,rx,0,rz);
    bx(w,.4,.34,.38,stone,0,1.62,0);bx(w,.14,.12,.03,stD,.07,1.58,.19);bx(w,.03,.12,.14,stD,-.2,1.67,-.05);bx(w,.3,.05,.26,stone,0,1.81,0);
    for(const s of[-1,1])bx(w,.03,.36,.09,ir,s*.215,1.61,0);bx(w,.46,.03,.09,ir,0,1.8,0);}
  w.userData.len=0;for(const m of w.children)w.userData.len=Math.max(w.userData.len,m.position.y);
  return w;}

function buildOgreMagi(seed,o={}){const r=mulberry32(((seed*2654435761)>>>0)^0x3a61),pick=a=>a[Math.floor(r()*a.length)];
  const kind=o.staff&&o.staff!=='random'?o.staff:pick(Object.keys(OM_STAFF)),sash=pick(OM_SASH),gem=pick(OM_GEM);
  const root=buildOgre(seed,{skin:o.skin,hair:o.hair,mantle:o.mantle,robe:{sash,gem},wpnObj:omStaff(kind),noClips:true,bare:o.bare});
  if(o.bare)return root;
  if(!o.noClips)root.userData.clips=omClips(kind);root.userData.ground=4.2;
  root.userData.variantText=root.userData.variantText.replace(/breeches and belt/,'robe').replace(/, bone necklace/,`, ${sash[1]} sash, talisman with a ${gem[1]}, gold earrings`).replace(/; [^;]*\.$/,`; ${OM_STAFF[kind]}.`);
  return root;}

/* ---------- clips (real metres) ---------- */
const OMCLIPS={};
/* planted staff: the grip sits on the line from the foot T, OM_LB - sl along the staff */
function omStaffPose(o){const n=v=>{const l=Math.hypot(...v)||1;return v.map(x=>x/l);},w=o.pl[0];let g=o.gR.slice(),d=n(o.dR);
  if(w>0){const Lb=OM_LB-o.sl[0],T=o.T,G=o.G,hx=G[0]-T[0],hz=G[1]-T[2],hy=Math.sqrt(Math.max(1e-4,Lb*Lb-hx*hx-hz*hz)),pg=[G[0]-o.HP[0],T[1]+hy,G[1]-o.HP[2]],pd=[hx/Lb,hy/Lb,hz/Lb];
    g=g.map((v,i)=>v+(pg[i]-v)*w);d=n(d.map((v,i)=>v+(pd[i]-v)*w));}o.gR=g;o.dR=d;return o;}
/* stances. Normal: hunched, leaning on the staff planted ahead on the right, left arm hanging clear of the gut.
   War: low and wide, left side forward, staff planted further out, left hand raised with the fingers spread */
const OM_N=omStaffPose({HP:[0,-.08,0],h:[8,0,0],sp:[6,0,0],ch:[10,0,0],nk:[0,0,0],hd:[0,0,0],FL:[.36,.03,12,0,0],FR:[-.36,-.03,-12,0,0],
  T:[-1.3,.012,1.0],G:[-1.2,.8],pl:[1],sl:[0],ap:[1],gR:[0,0,0],dR:[0,1,0],eR:[0,0,1],pR:[-.8,-.3,-.5],gL:[1.08,1.28,.3],dL:[1,0,.2],pL:[.5,-.3,-.8],fist:[30,95]});
const OM_W=omStaffPose({HP:[0,-.2,0],h:[12,-20,0],sp:[8,-4,0],ch:[6,-6,0],nk:[0,0,0],hd:[0,0,0],FL:[.42,.36,-12,0,0],FR:[-.42,-.3,-42,0,0],
  T:[-1.45,.012,1.0],G:[-1.35,.8],pl:[1],sl:[0],ap:[1],gR:[0,0,0],dR:[0,1,0],eR:[0,0,1],pR:[-.8,-.3,-.5],gL:[.8,2.0,.95],dL:[.3,.6,.7],pL:[.6,-.7,-.3],fist:[10,95]});
/* IK rig: a bare magi with the staff in hand (fur mantle and topknot so it covers every look). low() = the staff's lowest corner
   with the hand slid sl along it; pen() = the deepest staff point inside the body (hands, forearms and the robe skirt excepted) */
function omRig(kind){const B=VB.ogre,m=buildOgreMagi(1,{staff:kind,mantle:'fur',hair:'topknot',bare:true}),J={},V=THREE.Vector3;m.traverse(q=>{if(q.userData.joint)J[q.name]=q;});
  const R={m,J,B,two:false},wr=m.getObjectByName('weapon_R'),W=[],BD=[],v=new V(),inv=new THREE.Matrix4();R.wr=wr;
  const jointOf=q=>{let p=q.parent;while(p&&!p.userData.joint&&!/^skirt/.test(p.name))p=p.parent;return p?p.name:'';},under=q=>{while(q){if(q===wr)return true;q=q.parent;}return false;};
  const drop=[];m.traverse(q=>{if(!q.isMesh)return;const p=q.geometry.parameters;if(under(q))W.push(q);else if(!/hand|finger|thumb|foreArm|skirt/.test(jointOf(q))&&p.width*p.height*p.depth>4e-4)BD.push(q);else drop.push(q);});
  for(const q of drop)q.parent.remove(q);
  const box=new THREE.Box3(),ctr=new V();for(const q of BD){const p=q.geometry.parameters;q.userData.rad=Math.hypot(p.width,p.height,p.depth)/2;}
  const corners=(q,f)=>{const p=q.geometry.parameters;for(let i=0;i<9;i++){if(i<8)v.set((i&1?.5:-.5)*p.width,(i&2?.5:-.5)*p.height,(i&4?.5:-.5)*p.depth);else v.set(0,0,0);f(v.applyMatrix4(q.matrixWorld));}};
  R.low=()=>{m.updateMatrixWorld(true);let y=1e9;for(const q of W)corners(q,c=>{if(c.y<y)y=c.y;});return y;};
  R.pen=()=>{m.updateMatrixWorld(true);const P=[];box.makeEmpty();for(const q of W)corners(q,c=>{P.push(c.clone());box.expandByPoint(c);});let best=0,out=null;
    for(const q of BD){ctr.setFromMatrixPosition(q.matrixWorld);const rd=q.userData.rad,r2=rd*rd;if(box.distanceToPoint(ctr)>rd)continue;const p=q.geometry.parameters;inv.copy(q.matrixWorld).invert();for(const c of P){if(c.distanceToSquared(ctr)>r2)continue;v.copy(c).applyMatrix4(inv);const dx=p.width/2-Math.abs(v.x),dy=p.height/2-Math.abs(v.y),dz=p.depth/2-Math.abs(v.z),d=Math.min(dx,dy,dz);
      if(d>best){best=d;out=c.clone().sub(new V().setFromMatrixPosition(q.matrixWorld));out.y*=.3;out.normalize();}}}
    return best>0?{d:best,n:out}:null;};
  return R;}

function omClips(kind){if(OMCLIPS[kind])return OMCLIPS[kind];const B=VB.ogre,D=Math.PI*2,S=Math.sin,C=Math.cos,L=[],R=omRig(kind),V=THREE.Vector3,gU=o=>gbU(B,o),k=B.legS,cl=x=>Math.min(1,Math.max(-1,x));
  /* elbow pole (weighted by ap): searched round the shoulder-wrist line for a forearm that crosses the staff at a right angle and an
     elbow out from the chest; the knuckles then continue the forearm, so the staff never runs back through the arm */
  const pole=q=>{const w=q.ap[0];if(w<=0)return;R.m.updateMatrixWorld(true);const Sh=R.J.upperArm_R.getWorldPosition(new V()),W=R.J.hand_R.getWorldPosition(new V()),d=new V(...q.dR).normalize(),a=B.ua,b=B.fa;
    const out=new V(-1,0,0).applyQuaternion(R.J.chest.getWorldQuaternion(new THREE.Quaternion()));
    const Dv=W.clone().sub(Sh),Dl=Math.min(Math.max(Dv.length(),.05),(a+b)*.999),u=Dv.normalize(),al=Math.acos(cl((a*a+Dl*Dl-b*b)/(2*a*Dl)));
    const pA=new V(...q.pR0);pA.addScaledVector(u,-pA.dot(u)).normalize();const e2=new V().crossVectors(u,pA);
    let best=pA,bs=-1e9;for(let i=0;i<72;i++){const f=i/72*Math.PI*2,qq=pA.clone().multiplyScalar(Math.cos(f)).addScaledVector(e2,Math.sin(f));
      const E=Sh.clone().addScaledVector(u,a*Math.cos(al)).addScaledVector(qq,a*Math.sin(al)),F=W.clone().sub(E).normalize();
      const sc=-2*Math.abs(F.dot(d))+.4*qq.dot(pA)-4*Math.max(0,.5-qq.dot(out));if(sc>bs){bs=sc;best=qq;}}
    const pp=pA.clone().lerp(best,w).normalize(),E=Sh.clone().addScaledVector(u,a*Math.cos(al)).addScaledVector(pp,a*Math.sin(al));
    q.pR=pp.toArray();q.eR=new V(...q.eR0).normalize().lerp(W.clone().sub(E).normalize(),w).toArray();};
  /* while the staff cuts into the body, move the grip out of it; then the ground: a planted staff is put on it, a staff swung by its
     foot (sl > 0.5) is tilted up about the level axis across it, a carried one is lifted */
  const clear=(q,s)=>{for(let i=0;i<10;i++){const p=R.pen();if(!p||p.d<.005)break;const m=(p.d+.05)/k;q.gR=[q.gR[0]+p.n.x*m,q.gR[1]+p.n.y*m,q.gR[2]+p.n.z*m];s=wrSolve(R,q);}return s;};
  const ground=(q,s)=>{const y=R.low();if(q.pl[0]>.999){if(Math.abs(y-.003)<3e-4)return s;for(let it=0;it<3;it++){const dy=.003-R.low();if(Math.abs(dy)<3e-4)break;q.gR=[q.gR[0],q.gR[1]+dy/k,q.gR[2]];s=wrSolve(R,q);}return s;}
    if(y>=.005)return s;
    if(q.sl[0]<=.5){for(let it=0;it<3;it++){const dy=.005-R.low();if(dy<=0)break;q.gR=[q.gR[0],q.gR[1]+dy/k,q.gR[2]];s=wrSolve(R,q);}return s;}
    const d0=new V(...q.dR).normalize(),ax=new V().crossVectors(d0,new V(0,1,0));if(ax.lengthSq()<1e-6)return s;ax.normalize();
    let lo=0,hi=Math.PI*.6;for(let i=0;i<10;i++){const a=(lo+hi)/2;q.dR=d0.clone().applyAxisAngle(ax,a).toArray();wrSolve(R,q);if(R.low()>=.005)hi=a;else lo=a;}
    q.dR=d0.clone().applyAxisAngle(ax,hi).toArray();return wrSolve(R,q);};
  /* continuity (one-shot clips): each elbow pole leans towards where that elbow pointed in the frame before, and when the elbow is
     not placed automatically the fist keeps its roll about the staff from the frame before */
  let EL=null,HR=null;const elbows=()=>{const e={};R.m.updateMatrixWorld(true);for(const sd of['L','R']){const Sh=R.J['upperArm_'+sd].getWorldPosition(new V()),E=R.J['foreArm_'+sd].getWorldPosition(new V()),W=R.J['hand_'+sd].getWorldPosition(new V()),u=W.sub(Sh).normalize();
    E.sub(Sh);E.addScaledVector(u,-E.dot(u));if(E.lengthSq()>1e-6)e[sd]=E.normalize();}return e;};
  const solve=(o,cont)=>{omStaffPose(o);R.wr.position.set(0,0,o.sl[0]);const q=gU(o);
    if(cont&&EL)for(const sd of['L','R'])if(EL[sd]&&!(sd==='R'&&q.ap[0]>.5)){const p=new V(...q['p'+sd]).normalize().lerp(EL[sd],.75).normalize();q['p'+sd]=p.toArray();}
    if(cont&&HR&&q.ap[0]<=0)q.eR=HR;q.pR0=q.pR;q.eR0=q.eR;
    let s=wrSolve(R,q);if(q.ap[0]>0)for(let i=0;i<2;i++){pole(q);s=wrSolve(R,q);}
    s=clear(q,s);s=ground(q,s);if(R.pen()){s=clear(q,s);s=ground(q,s);}
    if(cont){EL=elbows();const hq=R.J.hand_R.getWorldQuaternion(new THREE.Quaternion()),Dh=new V(0,0,1).applyQuaternion(R.J.socket_R.getWorldQuaternion(new THREE.Quaternion())),yw=new V(0,1,0).applyQuaternion(hq);
      HR=yw.addScaledVector(Dh,-yw.dot(Dh)).negate().normalize().toArray();}return s;};
  const CC=(name,dur,fn,o)=>{EL=HR=null;const cont=!(o&&o.loop),c=sampleClip(name,dur,t=>solve(fn(t),cont),Object.assign({autoFeet:false},o),B);
    const T=c.tracks[0].times,P=[];for(const t of T)P.push(0,0,fn(t).sl[0]);c.tracks.push(new THREE.VectorKeyframeTrack('weapon_R.position',Array.from(T),P));L.push(c);return c;};
  const KC=(name,dur,keys,note,base=OM_W)=>CC(name,dur,wrKeys(keys.map(q=>[q[0],wrP(base,q[1])])),{note});
  const lift=(o,dy)=>{o.gR=[o.gR[0],o.gR[1]+dy,o.gR[2]];o.gL=[o.gL[0],o.gL[1]+dy,o.gL[2]];return o;};
  /* in-place IK gait: feet slide back while planted and swing forward lifted. With st the staff is planted a little after the left
     heel, slides back with the ground (a shorter stance, same speed) and swings forward lifted */
  const GAIT=(name,dur,G,note)=>{const fn=t=>{const u=t/dur,o=G.body(u),c2=C(D*(u-G.duty/2));o.HP=[G.sw*c2,G.y0-G.b*C(2*D*(u-G.duty/2)),0];lift(o,o.HP[1]-G.y0);
      for(const[sd,off,x,yaw]of[['L',0,G.x,G.yaw[0]],['R',.5,-G.x,G.yaw[1]]]){const q=(((u+off)%1)+1)%1;let z,l,pt;
        if(q<G.duty){const v=q/G.duty;z=G.s*(1-2*v);l=0;pt=v<.15?-10*(1-v/.15):v>.7?G.toe*(v-.7)/.3:0;}
        else{const v=(q-G.duty)/(1-G.duty),sm=v*v*(3-2*v);z=-G.s+2*G.s*sm;l=G.lift*Math.sin(Math.PI*Math.pow(v,G.lp||1));pt=G.toe*(1-v)*(1-v)-12*v*v;}
        o['F'+sd]=[x,z,yaw,l,pt];}
      if(G.st){const s=G.st,q=(((u-s.off)%1)+1)%1,ss=G.s*s.duty/G.duty;let z,l=0;
        if(q<s.duty)z=ss*(1-2*q/s.duty);else{const v=(q-s.duty)/(1-s.duty),sm=v*v*(3-2*v);z=-ss+2*ss*sm;l=s.lift*Math.sin(Math.PI*v);}
        o.T=[s.x,.012+l,s.z+z];o.G=[s.gx,s.gz+.45*z];o.pl=[1];}
      return o;};
    const sp=2*G.s/(G.duty*dur),c=CC(name,dur,fn,{loop:true,note:`${note}, in place, ${sp.toFixed(1)} m/s`});c.speed=sp;};

  /* ---- normal mode ---- */
  /* Idle: leaning on the planted staff, heavy breathing, looks around, scratches the gut with the free hand */
  CC('Idle',5,t=>{const p=D*t/5,b=S(p),b2=S(2*p),kk=t>2.1&&t<4.1?S(Math.PI*(t-2.1)/2):0,sc=kk*kk*(3-2*kk),rub=.05*S(D*t*2.6)*sc;
    return wrP(OM_N,{HP:[.02*b,-.08-.012*b2,0],h:[8,0,1.2*b],sp:[6+1*b2,0,0],ch:[10+1.8*b2,0,0],hd:[2*S(2*p+1)+14*sc,26*S(p+.6)*(1-sc),0],
      gL:[1.08-.5*sc,1.28+.42*sc+rub,.3+.5*sc],dL:[1-.6*sc,0,.2+.6*sc],fist:[30+30*sc,95]});},{loop:true,note:'Leaning on the staff, heavy breathing, looking around, scratches the gut'});
  GAIT('Walk',1.5,{duty:.64,s:.42,lift:.16,toe:18,x:.38,yaw:[12,-12],y0:-.1,b:.03,sw:.07,st:{off:.04,duty:.55,lift:.16,x:-1.3,z:1.0,gx:-1.2,gz:.8},
    body:u=>{const yw=C(D*(u-.97)),a=C(D*(u-.99));return wrP(OM_N,{h:[8,-6*yw,5*S(D*(u+.05))],sp:[6,2*yw,-2*S(D*(u+.05))],ch:[10+1.5*C(2*D*(u-.18)),3*yw,0],
      gL:[1.08,1.3+.04*a,.3+.35*a],dL:[1,0,.2]});}},'Heavy steps, the staff planted with every left step');
  GAIT('Run',.8,{duty:.42,s:.62,lift:.3,lp:.7,toe:28,x:.36,yaw:[8,-8],y0:-.12,b:.05,sw:.05,
    body:u=>{const yw=C(D*(u-.92)),a=C(D*(u-.9));return wrP(OM_N,{h:[18,-8*yw,5*S(D*(u+.1))],sp:[8,3*yw,0],ch:[8+2*C(2*D*(u-.12)),4*yw,0],pl:[0],ap:[0],
      gR:[-1.0,1.55+.03*C(2*D*u),.55-.1*a],dR:[-.05,.5,.86],eR:[0,1,0],pR:[-.6,-.6,-.5],gL:[1.0,1.55+.12*a,.35+.55*a],dL:[.8,0,.6],pL:[.6,-.4,-.7],fist:[80,95]});}},'Lumbering run, staff carried pointing ahead, free arm pumping');

  /* ---- war mode ---- */
  CC('Idle (war mode)',2.8,t=>{const p=D*t/2.8,b=S(p),b2=S(p+.6),o=wrP(OM_W,{HP:[.015*S(p*.5),-.2-.014*b,0],sp:[8+1.2*b,-4,0],ch:[6+1.8*b,-6,0],hd:[0,8*S(p*.5),0]});
    o.gL=[o.gL[0],o.gL[1]-.02*b2,o.gL[2]];return o;},{loop:true,note:'Low and wide, leaning on the planted staff, hand raised'});
  GAIT('Walk (war mode)',1.3,{duty:.64,s:.3,lift:.12,toe:20,x:.42,yaw:[-10,-40],y0:-.22,b:.02,sw:.04,st:{off:.04,duty:.55,lift:.14,x:-1.45,z:1.0,gx:-1.35,gz:.8},
    body:u=>wrP(OM_W,{h:[12,-18-5*C(D*u),4*S(D*(u+.1))],sp:[8,-4,0],ch:[6,-6,0]})},'Advancing, the staff planted with every left step');
  GAIT('Run (war mode)',.75,{duty:.4,s:.58,lift:.28,lp:.7,toe:30,x:.38,yaw:[-4,-14],y0:-.14,b:.05,sw:.03,
    body:u=>wrP(OM_W,{h:[22,-10-6*C(D*u),4*S(D*(u+.1))],sp:[8,-3,0],ch:[4,-4,0],pl:[0],ap:[0],gR:[-.95,1.75,.75],dR:[.02,.45,.89],eR:[0,1,0],pR:[-.6,-.6,-.5],gL:[.75,1.9,.9]})},'Charging, staff pointed ahead');

  /* Roar: crouches, rears up with the staff held high, head back, pounds the chest three times with the free fist */
  {const up={HP:[0,-.12,0],h:[-2,-8,0],sp:[-8,0,0],ch:[-14,0,0],nk:[-8,0,0],hd:[-24,0,0],pl:[0],ap:[0],gR:[-1.05,3.2,.35],dR:[-.15,.98,.1],eR:[0,0,1],pR:[-.8,-.4,-.3],gL:[.3,2.3,.85],dL:[.2,.3,1],pL:[.8,-.4,-.3],fist:[95,95]},
    hit=wrP(up,{gL:[.3,2.3,.6],ch:[-12,0,0]});
  KC('Roar',3,[[0,{}],
    [.45,{HP:[0,-.32,0],h:[22,-16,0],sp:[14,-4,0],ch:[10,-4,0],hd:[12,0,0],gL:[.8,1.3,.8],dL:[.6,0,.8],fist:[60,95]}],
    [.85,up],[1.0,hit],[1.2,up],[1.35,hit],[1.55,up],[1.7,hit],[1.9,wrP(up,{hd:[-28,4,0]})],[2.3,wrP(up,{hd:[-26,-4,0]})],
    [2.65,{HP:[0,-.16,0],h:[8,-16,0],ch:[0,-4,0]}],[3,{}]],'Rears up with the staff held high, head back, pounds the chest');}

  /* attacks: the hand slides down to the foot of the staff and swings it like a club; the left hand lets go to the side */
  KC('Attack 1',1.85,[[0,{}],
    [.3,{pl:[0],sl:[.6],ap:[0],gR:[-1.15,2.1,.5],dR:[-.4,.8,-.45],eR:[0,0,1],gL:[.95,1.6,.9],dL:[1,.1,.1],pL:[.3,0,-1],fist:[60,95]}],
    [.55,{pl:[0],sl:[1.1],ap:[0],HP:[0,-.24,-.06],h:[10,-50,0],sp:[8,-10,0],ch:[4,-24,0],gR:[-.95,2.05,-.15],dR:[-.7,.25,-.65],eR:[0,1,0],pR:[-.4,-.6,-.7],gL:[1.2,1.55,.6],dL:[1,.1,.1],pL:[.3,0,-1],fist:[70,95]}],
    [.8,{pl:[0],sl:[1.1],ap:[0],HP:[0,-.26,.1],h:[12,-12,0],sp:[8,-2,0],ch:[6,4,0],FL:[.42,.62,-10,.08,0],gR:[-.4,1.85,.9],dR:[-.8,.05,.6],eR:[0,1,0],pR:[-.4,-.8,-.4],gL:[1.25,1.6,.7],dL:[1,.1,.1],pL:[.3,0,-1],fist:[70,95]}],
    [.9,{pl:[0],sl:[1.1],ap:[0],HP:[0,-.28,.16],h:[14,8,0],sp:[8,4,0],ch:[8,20,0],FL:[.42,.72,-8,0,0],gR:[.05,1.8,1.05],dR:[-.1,-.05,1],eR:[0,1,0],pR:[-.4,-.8,-.4],gL:[1.25,1.6,.4],dL:[1,.1,-.2],pL:[.3,0,-1],fist:[70,95]}],
    [1.0,{pl:[0],sl:[1.1],ap:[0],HP:[0,-.28,.16],h:[14,20,0],sp:[8,8,0],ch:[8,30,0],FL:[.42,.72,-8,0,0],gR:[.9,1.85,1.15],dR:[.85,-.05,.5],eR:[0,1,0],pR:[-.3,-.9,-.3],gL:[1.2,1.55,-.1],dL:[1,.1,-.3],pL:[.3,-.2,-1],fist:[70,95]}],
    [1.18,{pl:[0],sl:[1.1],ap:[0],HP:[0,-.27,.14],h:[14,24,0],sp:[8,8,0],ch:[8,34,0],FL:[.42,.72,-8,0,0],gR:[1.15,1.8,.6],dR:[.95,-.1,-.25],eR:[0,1,0],pR:[-.3,-.9,-.3],gL:[1.15,1.5,-.2],dL:[1,.1,-.3],pL:[.3,-.2,-1],fist:[70,95]}],
    [1.34,{pl:[0],sl:[1.0],ap:[0],HP:[0,-.25,.1],h:[13,5,0],sp:[8,2,0],ch:[7,10,0],FL:[.42,.65,-10,.04,0],gR:[.3,1.75,1.3],dR:[.35,.25,.9],eR:[0,1,0],pR:[-.4,-.8,-.4],gL:[1.2,1.55,.5],dL:[1,.1,.1],pL:[.3,0,-1],fist:[70,95]}],
    [1.58,{pl:[.4],sl:[.4],ap:[.4],HP:[0,-.22,.05],h:[12,-6,0],ch:[6,-2,0],FL:[.42,.55,-10,.08,0],gR:[-1.0,1.8,.95],dR:[-.1,.95,0],eR:[0,0,1],gL:[1.0,1.8,.9],dL:[.3,.6,.7],fist:[40,95]}],
    [1.85,{}]],'Hand slides down the staff, wide sweep right to left with a step in');
  KC('Attack 2',1.8,[[0,{}],
    [.3,{pl:[0],sl:[.5],ap:[0],gR:[-1.05,2.3,.55],dR:[-.2,.9,-.3],eR:[0,0,1],gL:[.95,1.6,.9],dL:[1,.1,.1],pL:[.3,0,-1],fist:[60,95]}],
    [.65,{pl:[0],sl:[1.1],ap:[0],HP:[0,-.14,-.08],h:[0,-14,0],sp:[-8,-2,0],ch:[-10,-4,0],hd:[-10,0,0],gR:[-.45,3.3,.1],dR:[0,.35,-.94],eR:[0,1,0],pR:[-.8,.2,-.3],gL:[1.2,1.75,.5],dL:[1,.1,.1],pL:[.3,0,-1],fist:[70,95]}],
    [.85,{pl:[0],sl:[1.1],ap:[0],HP:[0,-.24,.1],h:[10,-10,0],sp:[6,0,0],ch:[4,0,0],FL:[.42,.6,-10,.08,0],gR:[-.4,3.0,1.0],dR:[0,.95,.3],eR:[0,0,1],pR:[-.8,0,-.3],gL:[1.2,1.6,.7],dL:[1,.1,.1],pL:[.3,0,-1],fist:[70,95]}],
    [1.0,{pl:[0],sl:[1.1],ap:[0],HP:[0,-.4,.2],h:[20,-8,0],sp:[10,0,0],ch:[4,0,0],FL:[.42,.7,-8,0,0],gR:[-.4,1.55,1.4],dR:[0,-.8,.6],eR:[0,1,0],pR:[-.7,-.6,-.3],gL:[1.15,1.35,.8],dL:[1,.1,.1],pL:[.3,0,-1],fist:[70,95]}],
    [1.25,{pl:[0],sl:[1.1],ap:[0],HP:[0,-.42,.2],h:[21,-8,0],sp:[11,0,0],ch:[4,0,0],FL:[.42,.7,-8,0,0],gR:[-.4,1.52,1.4],dR:[0,-.8,.6],eR:[0,1,0],pR:[-.7,-.6,-.3],gL:[1.15,1.33,.8],dL:[1,.1,.1],pL:[.3,0,-1],fist:[70,95]}],
    [1.55,{pl:[.4],sl:[.4],ap:[.4],HP:[0,-.26,.08],h:[14,-14,0],sp:[8,-2,0],FL:[.42,.5,-10,.08,0],gR:[-1.05,1.9,.9],dR:[-.1,.95,.1],eR:[0,0,1],gL:[1.0,1.8,.9],dL:[.3,.6,.7],fist:[40,95]}],
    [1.8,{}]],'Hand slides down, staff swung up overhead and smashed straight down onto the ground');
  KC('Heavy attack',2.6,[[0,{}],
    [.4,{pl:[0],sl:[.6],ap:[0],gR:[-1.05,2.4,.45],dR:[-.2,.9,-.35],eR:[0,0,1],gL:[1.0,1.7,.8],dL:[.3,.6,.7],fist:[40,95]}],
    [.9,{pl:[0],sl:[1.1],ap:[0],HP:[0,-.12,-.16],h:[-4,-30,0],sp:[-10,-6,0],ch:[-14,-14,0],hd:[-14,0,0],FR:[-.42,-.3,-42,0,20],gR:[-.5,3.3,-.3],dR:[-.1,-.1,-.99],eR:[0,1,0],pR:[-.8,.3,-.3],gL:[.9,2.6,.5],dL:[.2,.4,.9],pL:[.8,.3,-.3],fist:[95,95]}],
    [1.15,{pl:[0],sl:[1.1],ap:[0],HP:[0,-.22,.15],h:[6,-16,0],sp:[0,-2,0],ch:[-6,-4,0],FL:[.42,.9,-10,.12,0],gR:[-.4,3.15,.9],dR:[-.05,.98,.2],eR:[0,0,1],pR:[-.8,.1,-.3],gL:[.9,2.4,.9],dL:[.2,.4,.9],pL:[.8,.1,-.3],fist:[95,95]}],
    [1.34,{pl:[0],sl:[1.1],ap:[0],HP:[0,-.55,.35],h:[26,-6,0],sp:[14,0,0],ch:[6,4,0],FL:[.42,1.0,-8,0,0],gR:[-.35,1.3,1.5],dR:[0,-.9,.45],eR:[0,1,0],pR:[-.7,-.6,-.3],gL:[1.1,1.25,1.0],dL:[1,.1,.2],pL:[.5,-.4,-.8],fist:[60,95]}],
    [1.75,{pl:[0],sl:[1.1],ap:[0],HP:[0,-.58,.35],h:[27,-6,0],sp:[15,0,0],ch:[6,4,0],FL:[.42,1.0,-8,0,0],gR:[-.35,1.26,1.5],dR:[0,-.9,.45],eR:[0,1,0],pR:[-.7,-.6,-.3],gL:[1.1,1.22,1.0],dL:[1,.1,.2],pL:[.5,-.4,-.8],fist:[60,95]}],
    [2.2,{pl:[.4],sl:[.4],ap:[.4],HP:[0,-.34,.22],h:[18,-10,0],sp:[10,-2,0],ch:[6,0,0],FL:[.42,.8,-10,.08,0],gR:[-1.05,1.95,.95],dR:[-.1,.95,.1],eR:[0,0,1],gL:[1.0,1.7,.9],dL:[.3,.6,.7],fist:[40,95]}],
    [2.6,{}]],'Wind-up behind the back with both arms raised, a lunging step and the staff head slammed into the ground');

  /* ---- spells ---- */
  KC('Spell 1 (staff forward)',2.4,[[0,{}],
    [.35,{pl:[0],ap:[.5],HP:[0,-.17,-.06],h:[8,-26,0],sp:[4,-6,0],ch:[-2,-8,0],hd:[-6,0,0],gR:[-1.0,1.65,.55],dR:[-.05,1,-.12],gL:[.4,1.85,.75],dL:[0,.3,1],fist:[20,95]}],
    [.6,{pl:[0],ap:[.5],HP:[0,-.24,.18],h:[14,-6,0],sp:[12,0,0],ch:[8,4,0],nk:[6,0,0],hd:[-4,0,0],FL:[.42,.62,-8,0,0],gR:[-.7,1.75,1.4],dR:[.06,.74,.67],gL:[.35,1.9,1.35],dL:[0,.3,-1],pL:[.85,-.4,-.3],fist:[0,95]}],
    [.95,{pl:[0],ap:[.5],HP:[0,-.245,.19],h:[15,-6,0],sp:[13,0,0],ch:[8,4,0],nk:[6,0,0],hd:[-5,1,0],FL:[.42,.62,-8,0,0],gR:[-.69,1.77,1.42],dR:[.06,.72,.69],gL:[.36,1.92,1.37],dL:[0,.3,-1],pL:[.85,-.4,-.3],fist:[0,95]}],
    [1.3,{pl:[0],ap:[.5],HP:[0,-.24,.185],h:[14,-6,0],sp:[12,0,0],ch:[8,4,0],nk:[6,0,0],hd:[-4,-1,0],FL:[.42,.62,-8,0,0],gR:[-.7,1.74,1.41],dR:[.05,.75,.66],gL:[.35,1.89,1.36],dL:[0,.3,-1],pL:[.85,-.4,-.3],fist:[8,95]}],
    [1.65,{pl:[0],ap:[.5],HP:[0,-.245,.19],h:[15,-6,0],sp:[13,0,0],ch:[8,4,0],nk:[6,0,0],hd:[-5,1,0],FL:[.42,.62,-8,0,0],gR:[-.69,1.76,1.42],dR:[.06,.73,.68],gL:[.36,1.91,1.37],dL:[0,.3,-1],pL:[.85,-.4,-.3],fist:[0,95]}],
    [1.95,{pl:[.3],HP:[0,-.22,.06],h:[12,-12,0],FL:[.42,.44,-9,.06,0],gR:[-1.1,1.7,1.1],dR:[-.04,.97,.2]}],
    [2.4,{}]],'Draws the staff in, then thrusts it out at arm length with a step, head tilted at the target, open hand beside it; holds');
  KC('Spell 2 (staff slam)',2.2,[[0,{}],
    [.45,{pl:[0],HP:[0,-.08,-.04],h:[2,-14,0],sp:[-2,-4,0],ch:[-8,-4,0],hd:[-14,0,0],gR:[-1.05,2.5,.8],dR:[-.1,.97,-.22],eR:[0,0,1],gL:[.9,2.4,.85],dL:[.4,.3,.85],fist:[0,95]}],
    [.6,{HP:[0,-.4,.04],h:[16,-14,0],sp:[10,-4,0],ch:[4,-4,0],hd:[-10,0,0],gL:[1.0,1.15,.75],dL:[.7,.7,.2],pL:[.9,-.3,-.2],fist:[0,95]}],
    [.72,{HP:[0,-.44,.04],h:[17,-14,0],sp:[11,-4,0],ch:[5,-4,0],hd:[-8,0,0],gL:[1.02,1.1,.72],dL:[.7,.7,.2],pL:[.9,-.3,-.2],fist:[0,95]}],
    [1.3,{HP:[0,-.4,.04],h:[16,-14,0],sp:[10,-4,0],ch:[4,-4,0],hd:[-14,0,0],gL:[1.01,1.14,.74],dL:[.7,.7,.2],pL:[.9,-.3,-.2],fist:[10,95]}],
    [1.7,{HP:[0,-.26,0],h:[14,-14,0],hd:[-2,0,0],gL:[.85,1.6,.9]}],
    [2.2,{}]],'Lifts the staff high, slams its foot into the ground, crouches over it with the hand spread, holds');
  {const hi={pl:[0],ap:[0],HP:[0,-.1,-.04],h:[-2,-4,0],sp:[-6,0,0],ch:[-12,-2,0],nk:[-8,0,0],hd:[-18,0,0],gR:[-.6,3.15,.55],dR:[1,.04,0],eR:[0,0,1],pR:[-.9,-.1,-.3],gL:[.6,3.15,.55],dL:[0,.3,-1],pL:[.9,-.1,-.3],fist:[95,95]},
    sh=(dy,a)=>wrP(hi,{gR:[-.6,3.15+dy,.55],gL:[.6,3.15+dy,.55],ch:[-14,-2,0],hd:[-22+a,0,0]});
  KC('Spell 3 (staff raised)',2.8,[[0,{}],
    [.25,{pl:[0],ap:[0],HP:[0,-.14,-.02],h:[4,-8,0],sp:[0,-2,0],ch:[-6,-2,0],hd:[-8,0,0],gR:[-1.05,2.2,.7],dR:[-.05,1,0],eR:[0,0,1],gL:[.5,2.3,.8],dL:[0,.3,-1],fist:[40,95]}],
    [.5,hi],[.85,sh(.04,0)],[1.1,sh(0,1)],[1.35,sh(.04,0)],[1.6,sh(0,1)],[1.9,sh(.04,0)],
    [2.35,{pl:[.4],ap:[.4],HP:[0,-.16,0],h:[10,-12,0],sp:[6,-4,0],ch:[2,-4,0],hd:[-4,0,0],gR:[-1.1,1.9,.9],dR:[-.04,1,-.1],eR:[0,0,1],gL:[.8,1.9,.9],fist:[45,95]}],
    [2.8,{}]],'Grabs the staff with both hands and lifts it level above the head, head thrown back, holds it up shaking');}

  /* ---- hits: the staff stays planted (or is carried back with him) ---- */
  KC('Hit',.9,[[0,{}],
    [.08,{HP:[0,-.22,-.08],h:[4,-22,0],sp:[-8,-4,0],ch:[-18,-6,0],nk:[-10,0,0],hd:[-24,0,0],gL:[.7,2.15,.7],dL:[.2,.8,.5],fist:[20,95]}],
    [.18,{HP:[0,-.23,-.09],h:[3,-22,0],sp:[-9,-4,0],ch:[-20,-6,0],nk:[-12,0,0],hd:[-26,0,3],gL:[.7,2.17,.68],dL:[.2,.8,.5],fist:[20,95]}],
    [.45,{HP:[0,-.21,-.03],h:[10,-21,0],sp:[4,-4,0],ch:[2,-6,0],hd:[-6,0,0]}],
    [.9,{}]],'Blow to the face: head and shoulders snap back, then recover');
  KC('Heavy hit',1.9,[[0,{}],
    [.12,{HP:[0,-.16,-.12],h:[-6,-28,0],sp:[-14,-4,0],ch:[-16,-8,0],hd:[-20,0,4],T:[-1.45,.08,.94],G:[-1.35,.72],gL:[.9,2.3,.6],dL:[.5,.6,.6]}],
    [.35,{HP:[0,-.2,-.3],h:[0,-26,0],sp:[-6,-4,0],ch:[-8,-8,0],hd:[-8,0,0],FR:[-.42,-.62,-44,.12,0],T:[-1.45,.12,.8],G:[-1.35,.56],gL:[.8,2.1,.8]}],
    [.55,{HP:[0,-.26,-.44],h:[10,-24,0],sp:[6,-4,0],ch:[4,-8,0],FR:[-.42,-.8,-44,0,0],T:[-1.45,.012,.6],G:[-1.35,.38]}],
    [.78,{HP:[0,-.24,-.48],FL:[.42,-.05,-14,.1,0],FR:[-.42,-.8,-44,0,0],T:[-1.45,.012,.56],G:[-1.35,.34]}],
    [.98,{HP:[0,-.22,-.5],FL:[.42,-.24,-12,0,0],FR:[-.42,-.8,-44,0,0],T:[-1.45,.012,.52],G:[-1.35,.3]}],
    [1.28,{HP:[0,-.21,-.28],FL:[.42,.04,-12,.1,0],FR:[-.42,-.8,-44,0,0],T:[-1.45,.06,.74],G:[-1.35,.52]}],
    [1.45,{HP:[0,-.2,-.18],FR:[-.42,-.8,-44,0,0],T:[-1.45,.04,.84],G:[-1.35,.62]}],
    [1.68,{HP:[0,-.2,-.08],FR:[-.42,-.55,-43,.1,0],T:[-1.45,.012,.94],G:[-1.35,.72]}],
    [1.9,{}]],'Knocked back two heavy steps with the staff, then steps in again');

  /* ---- deaths: the goblin's falls on the ogre's body; he lets go of the staff at once, it falls to the right and lies along him */
  const deaths=goblinDeaths(B,'magi-'+kind,{st:OM_W,R,M:buildOgreMagi(1,{staff:kind,mantle:'fur',hair:'topknot',bare:true}),drop:{'Death 1':[.01,[-1.8,.8,0]],'Death 2':[.01,[-1.8,.6,.2]]},lieZ:true});
  return OMCLIPS[kind]=L.concat(deaths);}

ASSETS.push({id:'ogre-magi',folder:'characters/enemies/brutes',name:'Ogre magi',kind:'character',variants:true,defaultSeed:1,groundR:4.2,build:(s,o)=>buildOgreMagi(s,o||{}),
  opts:[...ASSETS.find(a=>a.id==='ogre').opts.slice(0,3),{key:'staff',label:'Staff',choices:[['random','Random'],['gnarled','Gnarled crystal staff'],['skull','Horned skull staff'],['stone','Bound stone staff']],def:'random'}],
  desc:'Ogre magi, about 3.4 m: the ogre\'s body and looks (skin, hair, fur mantle or bare shoulders) in an open hide robe with half sleeves and a skirt to the knees, a cloth sash, a talisman with a stone in a gold diamond and gold earrings. Leans on a gnarled staff with a glowing crystal, a horned skull staff or a bound stone staff held in the right hand. Idle, walk (staff planted with every left step) and run; war-mode idle, walk and charge; roar, three staff attacks (the hand slides down and swings it), three spells (staff thrust forward, slammed into the ground, raised overhead), hit, heavy hit and two deaths.'});
