/* ======================= WARRIORS: fighters on a bulkier villager rig, with grounded gait clips and IK combat clips =======================
   Gaits are authored per leg as periodic curves over the stride phase (0 = heel strike): thigh and knee angles plus the
   foot's pitch in the world. Hip height is then solved from the leg geometry every frame, so the planted foot sits exactly
   on the ground (no sinking, no floating) and the run gets a real flight phase. Angles in degrees: thigh < 0 swings forward,
   knee > 0 folds back, foot > 0 points the toe down.
   Combat clips are keyframed in world terms instead (hip offset, foot placements, sword grip + blade direction, shield grip +
   facing) and solved with leg and arm IK on a copy of the rig, so planted feet never slide and the weapon follows its path. */
VB.warrior=Object.assign({},VB.male,{thigh:.44,shin:.42,spine:.11,chest:.23,shW:.28,ua:.29,fa:.26,g:1.22,hipW:.085,hand:1.12,arm:1.15,td:1.18,hipK:.86,waistK:.9,sex:'male'});
VB.warriorF=Object.assign({},VB.female,{shW:.22,g:1.06,hipW:.072,hand:.95,arm:1.1,td:1.1,hipK:.92,waistK:.95,sex:'female'});
for(const k of['warrior','warriorF']){const b=VB[k];b.key=k;b.hipH=b.thigh+b.shin+b.ankle+b.hipOff;b.legS=(b.thigh+b.shin)/.84;b.tS=(b.spine+b.chest)/.3;b.cS=b.neck/.22;}
/* one occupation per helmet/plate combination: plate wants a short tunic and a clear belt, a helmet wants hair that fits under it */
for(const hp of['','h','p','hp'])OCC['warrior'+hp]={name:'Warrior',fn(T){const r=mulberry32(((T.seed*40503)>>>0)^0x3a7),pick=a=>a[Math.floor(r()*a.length)];
  T.outfit=pick(['shortTunic','shortTunic','jerkin','tunic']);T.legwear=pick(['wraps','hose','tallBoots','tallBoots']);
  T.head=pick(['none','none','none','cowl','hoodUp']);T.rolled=r()<.4;
  if(hp.includes('p')){T.outfit='shortTunic';T.pouch=false;T.knife=false;if(T.head==='cowl')T.head='none';}
  if(hp.includes('h')){T.head='none';T.hairStyle={messy:'short',bowl:'short',bun:'braid',ponytail:'long',loose:'braid',twinBraids:'braid'}[T.hairStyle]||T.hairStyle;}}};

/* periodic cubic (Catmull-Rom) through [[phase,value],...], phase in [0,1) */
function pcurve(K){const n=K.length;return u=>{u=((u%1)+1)%1;let i=n-1;for(let k=0;k<n;k++)if(K[k][0]<=u)i=k;
  const at=j=>{const k=((j%n)+n)%n;return[K[k][0]+Math.floor(j/n),K[k][1]];},p0=at(i-1),p1=at(i),p2=at(i+1),p3=at(i+2);let x=u;if(x<p1[0])x+=1;
  const h=p2[0]-p1[0],s=(x-p1[0])/h,m1=(p2[1]-p0[1])/(p2[0]-p0[0])*h,m2=(p3[1]-p1[1])/(p3[0]-p1[0])*h,s2=s*s,s3=s2*s;
  return(2*s3-3*s2+1)*p1[1]+(s3-2*s2+s)*m1+(-2*s3+3*s2)*p2[1]+(s3-s2)*m2;};}

/* leg forward kinematics matching buildVillager: returns the lowest sole point (heel or toe) of each leg with the hips at y = 0 */
function legFK(B){const g=B.g,fk=B.ankle/.06,lw=.13*g,hips=new THREE.Object3D(),L={},D2R=Math.PI/180,v=new THREE.Vector3();
  for(const[sd,s]of[['L',1],['R',-1]]){const th=new THREE.Object3D(),sn=new THREE.Object3D(),ft=new THREE.Object3D(),heel=new THREE.Object3D(),toe=new THREE.Object3D();
    th.position.set(s*B.hipW,-(B.hipOff+.01),0);sn.position.y=-B.thigh;ft.position.y=-B.shin;heel.position.set(0,-.07*fk,.03*g-lw*.8);toe.position.set(0,-.07*fk,.03*g+lw*.8);
    hips.add(th);th.add(sn);sn.add(ft);ft.add(heel,toe);L[sd]={th,sn,ft,heel,toe};}
  const rot=(o,a)=>{a=a||[0,0,0];o.rotation.set(a[0]*D2R,a[1]*D2R,a[2]*D2R);};
  return p=>{rot(hips,p.h);for(const sd of['L','R']){const l=L[sd];rot(l.th,p['t'+sd]);rot(l.sn,p['k'+sd]);rot(l.ft,p['a'+sd]);}hips.updateMatrixWorld(true);
    const o={};for(const sd of['L','R']){const l=L[sd],hy=l.heel.getWorldPosition(v).y,ty=l.toe.getWorldPosition(v).y;o[sd]=Math.min(hy,ty);o[sd+'z']=l.ft.getWorldPosition(v).z;}return o;};}

/* turns per-leg curves and a body function into a pose function; G = {dur, duty, apex, abd (stance width), circ (swing leg clears the other), thigh, knee, foot, body(u)} */
function gaitPose(B,G){const fk=legFK(B),R2D=180/Math.PI,legL=B.thigh+B.shin+B.ankle;
  const raw=u=>{const P=G.body(((u%1)+1)%1),p=Object.assign({},P);delete p.sway;const hx=(P.h||[0])[0],hz=(P.h||[0,0,0])[2],sw=P.sway||0;
    for(const[sd,off,s]of[['L',0,1],['R',.5,-1]]){const ph=u+off,q=((ph%1)+1)%1,t=G.thigh(ph),k=G.knee(ph),f=G.foot(ph),out=G.abd+(q>G.duty?G.circ*Math.sin(Math.PI*(q-G.duty)/(1-G.duty)):0),z=s*out-hz-Math.asin(sw/legL)*R2D;
      p['t'+sd]=[t-hx,0,z];p['k'+sd]=[k,0,0];p['a'+sd]=[f-(t+k),0,-(hz+z)];}
    return p;};
  const inSt=(u,off)=>(((u+off)%1)+1)%1<=G.duty+1e-6;
  const need=u=>{const s=fk(raw(u));let H=-1e9;for(const[sd,off]of[['L',0],['R',.5]])H=Math.max(H,-s[sd]+(inSt(u,off)?0:.004));return H;};
  /* hip height: the stance foot touches the ground (a swing foot never dips below it); in flight the hips follow an arc from take-off to landing */
  const height=u=>{u=((u%1)+1)%1;if(inSt(u,0)||inSt(u,.5))return need(u);
    const a=u<.5?G.duty:.5+G.duty,b=u<.5?.5:1,s=(u-a)/(b-a),y=need(a)+(need(b)-need(a))*s+4*G.apex*s*(1-s);return Math.max(y,need(u));};
  const fn=u=>{const p=raw(u);p.pos=[(G.body(((u%1)+1)%1).sway||0)/B.legS,(height(u)-B.hipH)/B.legS,0];return p;};
  /* ground speed: how fast the planted ankle travels backwards in mid-stance */
  const a=G.duty*.3,b=G.duty*.7,za=fk(raw(a)).Lz,zb=fk(raw(b)).Lz;fn.speed=(za-zb)/((b-a)*G.dur);return fn;}

/* ---------- keyframes: monotone cubic per channel (smooth through keys, never overshoots, so feet never dip below a key) ---------- */
function wrKeys(keys){const n=keys.length,T=keys.map(k=>k[0]),chs=Object.keys(keys[0][1]),C={};
  for(const c of chs){C[c]=keys[0][1][c].map((_,j)=>{const y=keys.map(k=>k[1][c][j]),h=[],dl=[],m=new Array(n).fill(0);
    for(let i=0;i<n-1;i++){h[i]=T[i+1]-T[i];dl[i]=(y[i+1]-y[i])/h[i];}
    for(let i=1;i<n-1;i++)if(dl[i-1]*dl[i]>0)m[i]=3*(h[i-1]+h[i])/((2*h[i]+h[i-1])/dl[i-1]+(h[i]+2*h[i-1])/dl[i]);return{y,m};});}
  return t=>{let i=0;while(i<n-2&&t>T[i+1])i++;const hh=T[i+1]-T[i],s=Math.min(1,Math.max(0,(t-T[i])/hh)),s2=s*s,s3=s2*s,o={};
    for(const c of chs)o[c]=C[c].map(({y,m})=>(2*s3-3*s2+1)*y[i]+(s3-2*s2+s)*hh*m[i]+(-2*s3+3*s2)*y[i+1]+(s3-s2)*hh*m[i+1]);return o;};}
const wrP=(base,o)=>Object.assign({},base,o);

/* ---------- IK on a bare copy of the rig ----------
   pose channels: HP hip offset [x,y,z] m; h/sp/ch/nk/hd joint angles; FL/FR foot [x, z, yaw°, lift m, pitch° (toe down), roll°]; nL/nR knee direction;
   gR/gL grip point [x,y,z] m (x,z relative to the hips); dR blade direction; dL shield facing; pR/pL elbow pole. Lengths are
   authored for the male warrior and scaled for other bodies. */
const WR_HAFT=.3,WR_JUMP=20*Math.PI/180,WR_FRONT=.22;
function wrRig(B,two){const m=buildVillager(B.sex,1,null,{B}),J={};m.traverse(o=>{if(o.userData.joint)J[o.name]=o;});return{m,J,B,two};}
function wrSolve(R,p){const{m,J,B}=R,D=Math.PI/180,V=THREE.Vector3,Q=THREE.Quaternion,k=B.legS,g=B.g,fk=B.ankle/.06,lw=.13*g,cl=x=>Math.min(1,Math.max(-1,x));
  const deg=q=>{const e=new THREE.Euler().setFromQuaternion(q,'XYZ');return[e.x/D,e.y/D,e.z/D];},rot=(j,a)=>{a=a||[0,0,0];J[j].rotation.set(a[0]*D,a[1]*D,a[2]*D);};
  const basis=(X,Y,Z)=>new Q().setFromRotationMatrix(new THREE.Matrix4().makeBasis(X,Y,Z));
  const hp=(p.HP||[0,0,0]).map(v=>v*k);let hy=hp[1];
  const h=p.h||[0,0,0],sp=p.sp||[0,0,0],ch=p.ch||[0,0,0],hd0=p.hd||[0,0,0],head=[hd0[0]-(h[0]+sp[0]+ch[0])*.7,hd0[1]-(h[1]+sp[1]+ch[1])*.9,hd0[2]-(h[2]+sp[2]+ch[2])*.8];
  rot('hips',h);rot('spine',sp);rot('chest',ch);rot('neck',p.nk);rot('head',head);
  /* feet: ankle target so the lowest sole point (heel or toe) sits at the lift height; heel[sd] lifts the heel further */
  const a=B.thigh,b=B.shin,Lmax=(a+b)*.998,heel={L:0,R:0},feet={},out={h,sp,ch,nk:p.nk||[0,0,0],hd:head,fist:p.fist||[95,95]};
  for(let pass=0;pass<3;pass++){
    for(const sd of['L','R']){const F=p['F'+sd],yaw=F[2]*D,pit=Math.max(F[4]||0,heel[sd])*D,hs=.07*fk,zt=.03*g+lw*.8,zh=.03*g-lw*.8;
      const low=Math.min(-hs*Math.cos(pit)-zt*Math.sin(pit),-hs*Math.cos(pit)-zh*Math.sin(pit));
      feet[sd]={A:new V(F[0]*k,(F[3]||0)*k-low,F[1]*k),yaw,q:new Q().setFromEuler(new THREE.Euler(pit,yaw,(F[5]||0)*D,'YXZ')),air:(F[3]||0)>.02,lift:(F[3]||0)*k};}
    /* lower the hips when a leg can't reach its foot, so nothing floats */
    hy=hp[1]*1;for(let it=0;it<4;it++){J.hips.position.set(hp[0],B.hipH+hy,hp[2]);m.updateMatrixWorld(true);let drop=0;
      for(const sd of['L','R']){const H=J['thigh_'+sd].getWorldPosition(new V()),A=feet[sd].A,hz=Math.hypot(A.x-H.x,A.z-H.z);drop=Math.max(drop,(H.y-A.y)-Math.sqrt(Math.max(0,Lmax*Lmax-hz*hz)));}
      if(drop<=1e-5)break;hy-=drop+1e-4;}
    /* legs: knee points over the toes; a shin leaning far forward lifts its heel (deep lunges and crouches) */
    let again=false;
    for(const sd of['L','R']){const th=J['thigh_'+sd],H=th.getWorldPosition(new V()),f=feet[sd],Dv=f.A.clone().sub(H),d=Math.min(Dv.length(),Lmax),u=Dv.normalize();
      const be=Math.acos(cl((a*a+d*d-b*b)/(2*a*d))),fw=new V(Math.sin(f.yaw),0,Math.cos(f.yaw)),kp=p['n'+sd]?new V(...p['n'+sd]).normalize():fw,pp=kp.clone().addScaledVector(u,-kp.dot(u)).normalize();
      const t=u.clone().multiplyScalar(Math.cos(be)).addScaledVector(pp,Math.sin(be)),Y=t.clone().negate(),Z=pp.clone().addScaledVector(t,-pp.dot(t)).normalize();
      const tq=basis(new V().crossVectors(Y,Z),Y,Z),tl=th.parent.getWorldQuaternion(new Q()).invert().multiply(tq),kn=Math.PI-Math.acos(cl((a*a+b*b-d*d)/(2*a*b))),kq=new Q().setFromEuler(new THREE.Euler(kn,0,0));
      const fl=tq.clone().multiply(kq).invert().multiply(f.q);th.quaternion.copy(tl);J['shin_'+sd].quaternion.copy(kq);J['foot_'+sd].quaternion.copy(fl);
      out['t'+sd]=deg(tl);out['k'+sd]=[kn/D,0,0];out['a'+sd]=deg(fl);
      const K=H.clone().addScaledVector(t,a),tilt=Math.atan2(K.clone().sub(f.A).dot(fw),K.y-f.A.y)/D,want=R.heelFade?Math.min(50,(tilt-30)*1.3)*Math.max(0,1-f.lift/R.heelFade)/* R.heelFade (m): the heel lift fades out as the foot rises instead of stopping at once */:f.air?0:Math.min(50,(tilt-30)*1.3);if(want>heel[sd]+.5){heel[sd]=want;again=true;}}
    if(!again)break;}
  out.pos=[hp[0]/k,hy/k,hp[2]/k];
  m.updateMatrixWorld(true);
  /* arms: grip point, then the hand turns the blade (R) or the shield face (L) where asked. Right first: with a two-handed
     weapon (R.two) the left hand grips the haft WR_HAFT (or R.haft) behind the right one; lf (0..1) frees it towards gL/dL */
  let haft=null;
  for(const sd of['R','L']){const G=p['g'+sd];if(!G)continue;const s=sd==='L'?1:-1,ua=J['upperArm_'+sd],fa=J['foreArm_'+sd],hd=J['hand_'+sd],skL=J['socket_'+sd].position.clone();
    const lf=R.two&&sd==='L'?Math.min(1,Math.max(0,(p.lf||[0])[0])):1,dir=new V(...p['d'+sd]).normalize(),pole=new V(...(p['p'+sd]||[s*.6,-.6,-.5])).normalize();
    let tgt=new V(G[0]*k+hp[0],G[1]*k,G[2]*k+hp[2]);if(R.two&&sd==='L')tgt=haft.P.clone().lerp(tgt,lf);
    /* hand = forearm turned by the smallest rotation that points the thumb side along the blade/haft, or the back of the hand at the shield facing */
    const handQ=faq=>{const ax=v=>v.applyQuaternion(faq),zf=ax(new V(0,0,1)),xf=ax(new V(1,0,0)),fy=ax(new V(0,1,0)),blade=d=>new Q().setFromUnitVectors(zf,d).multiply(faq);
      /* R.lprop: the left hand holds a prop of its own (dL its direction, eL its roll), aimed like the right */
      if(sd==='R'||R.lprop){const q=blade(dir),e0=sd==='R'?p.eR:p.eL;if(e0){const e=new V(...e0),yw=new V(0,1,0).applyQuaternion(q),A=yw.addScaledVector(dir,-yw.dot(dir)).negate().normalize(),Bv=e.addScaledVector(dir,-e.dot(dir)).normalize();
        if(Bv.lengthSq()>.5)q.premultiply(new Q().setFromAxisAngle(dir,Math.atan2(new V().crossVectors(A,Bv).dot(dir),A.dot(Bv))));}return q;}
      const f=dir.clone().addScaledVector(fy,-dir.dot(fy)).normalize(),qs=new Q().setFromUnitVectors(xf,f).multiply(faq);if(!R.two)return qs;
      /* R.lroll: the left fist turns about the haft so its fingers wrap the same way as the right's (no flips when the forearm points back along the haft) */
      const qh=blade(haft.D.clone());if(R.lroll){const Dh=haft.D,yw=new V(0,1,0).applyQuaternion(qh),A=yw.addScaledVector(Dh,-yw.dot(Dh)).negate().normalize();qh.premultiply(new Q().setFromAxisAngle(Dh,Math.atan2(new V().crossVectors(A,haft.A).dot(Dh),A.dot(haft.A))));}
      return qh.slerp(qs,lf);};
    const a2=B.ua,b2=B.fa,S=ua.getWorldPosition(new V());let hq=null,faq=null;
    for(let it=0;it<4;it++){if(faq)hq=handQ(faq);
      const W=hq?tgt.clone().sub(skL.clone().applyQuaternion(hq)):tgt.clone(),Dv=W.clone().sub(S),d=Math.min(Math.max(Dv.length(),.05),(a2+b2)*.999),u=Dv.normalize();
      const al=Math.acos(cl((a2*a2+d*d-b2*b2)/(2*a2*d))),pp=pole.clone().addScaledVector(u,-pole.dot(u)).normalize(),e=u.clone().multiplyScalar(Math.cos(al)).addScaledVector(pp,Math.sin(al));
      const Ye=e.clone().negate(),Ze=pp.clone().addScaledVector(e,-pp.dot(e)).normalize().negate(),uq=basis(new V().crossVectors(Ye,Ze),Ye,Ze),fq=new Q().setFromEuler(new THREE.Euler(-(Math.PI-Math.acos(cl((a2*a2+b2*b2-d*d)/(2*a2*b2)))),0,0));
      ua.quaternion.copy(ua.parent.getWorldQuaternion(new Q()).invert().multiply(uq));fa.quaternion.copy(fq);faq=uq.clone().multiply(fq);}
    hq=handQ(faq);m.updateMatrixWorld(true);hd.quaternion.copy(fa.getWorldQuaternion(new Q()).invert().multiply(hq));
    if(sd==='R'){const D2=new V(0,0,1).applyQuaternion(hq),yw=new V(0,1,0).applyQuaternion(hq);haft={D:D2,P:tgt.clone().addScaledVector(D2,-(R.haft||WR_HAFT)),A:yw.addScaledVector(D2,-yw.dot(D2)).negate().normalize()};}
    const bu=BASEPOSE['upperArm_'+sd],bf=BASEPOSE['foreArm_'+sd];out['u'+sd]=deg(ua.quaternion).map((v,i)=>v-bu[i]);out['f'+sd]=deg(fa.quaternion).map((v,i)=>v-bf[i]);out['w'+sd]=deg(hd.quaternion);}
  return out;}

/* ---------- clips ----------
   E: equipment flags. Sword and shield, or the two-handed axe (E.axe), pick the stance and which clips exist: one-handed attacks
   need no axe, shield bash and shield block need the shield in hand, two-handed attacks and the haft block need the axe. E.long: a longer two-handed blade (the skeletal warrior's sword), so the heavy attack ends with the tip on the ground rather than in it.
   Keyframes are [time, common, sword-and-shield overrides, two-handed overrides]; anything a key leaves out comes from the stance. */
const WCLIPS={};
function warriorClips(B,E={}){const key=B.key+(E.sword?'s':'')+(E.axe?'a':'')+(E.shield?'h':'')+(E.plate?'p':'')+(E.long?'l':'');if(WCLIPS[key])return WCLIPS[key];const D=Math.PI*2,S=Math.sin,C=Math.cos,L=[],two=!!E.axe,held=E.sword||E.axe;
  const headFix=(o,k=.85)=>{const h=o.h||[0,0,0],sp=o.sp||[0,0,0],ch=o.ch||[0,0,0];o.hd=[(o.hd?o.hd[0]:0)-(h[0]+sp[0]+ch[0])*.7,-(h[1]+sp[1]+ch[1])*k,-(h[2]+ch[2])*.8];return o;};
  const out=(E.plate?5:0),shieldHand=E.shield&&!two,outL=out+(shieldHand?6:0);
  /* Idle: planted, chest up, weight shifting slowly between the feet */
  {const fk=legFK(B),dur=4;const pose=t=>{const p=D*t/dur,b=S(p),b2=S(2*p),sw=.012*S(p),hz=1.4*S(p);const o={h:[1,0,hz],sp:[1+.6*b2,0,-.5*hz],ch:[-2+1.2*b2,1.5*S(p+.8),-.4*hz],
      uL:[1.5*S(p+.5),0,3+outL+1.2*b2],uR:[-1.5*S(p+.3),0,-3-out-1.2*b2],fL:[-12-2*b2,0,0],fR:[-12+2*b2,0,0],wL:[0,-12,0],wR:[held?50:0,12,0],fist:[34,34]};
      for(const[sd,s]of[['L',1],['R',-1]]){const z=s*3.5-hz-Math.asin(sw/(B.thigh+B.shin))*180/Math.PI,th=-3+s*.8*b,kn=6-s*1.2*b;o['t'+sd]=[th-1,0,z];o['k'+sd]=[kn,0,0];o['a'+sd]=[-(th+kn),0,-(hz+z)];}
      headFix(o);o.hd[0]+=1.5*S(2*p+1);o.hd[1]+=6*S(p*.5+.6);const s=fk(o);o.pos=[sw/B.legS,(Math.max(-s.L,-s.R)-B.hipH)/B.legS,0];return o;};
    L.push(sampleClip('Idle',dur,pose,{loop:true,autoFeet:false,note:'Breathing, weight shift'},B));}
  /* Walk: heel strike, foot flat, heel-off and toe-off; pelvis drops over the swing leg and sways over the stance leg */
  {const dur=1.05,G={dur,duty:.6,apex:0,abd:1.5,circ:2.5,
      thigh:pcurve([[0,-25],[.12,-19],[.3,-4],[.5,14],[.6,9],[.72,-11],[.86,-28],[.95,-27]]),
      knee:pcurve([[0,3],[.12,15],[.3,5],[.45,7],[.6,36],[.72,60],[.85,30],[.95,4]]),
      foot:pcurve([[0,-14],[.07,-1],[.2,0],[.4,1],[.52,11],[.6,28],[.7,10],[.82,-6],[.93,-13]]),
      body(u){const yaw=C(D*(u-.97)),arm=C(D*(u-.99)),el=C(D*(u-1.05)),hz=3.5*S(D*(u+.1));
        return headFix({sway:.02*S(D*(u-.05)),h:[2,-6*yaw,hz],sp:[2.5,2*yaw,-.3*hz],ch:[-1+1.2*C(2*D*(u-.18)),7*yaw,-.5*hz],
          uL:shieldHand?[-6+7*arm,0,outL+2]:[-2+19*arm,0,2*arm+out],uR:held?[-4-12*arm,0,2*arm-out-2]:[-2-19*arm,0,2*arm-out],fL:shieldHand?[-42-6*(.5-.5*el),0,0]:[-13-16*(.5-.5*el),0,0],fR:[-13-16*(.5+.5*el),0,0],
          wL:shieldHand?[0,0,0]:[4*arm,-8,0],wR:[held?48+16*arm:-4*arm,8,0],fist:[30,30]});}};
    const fn=gaitPose(B,G),c=sampleClip('Walk',dur,t=>fn(t/dur),{loop:true,autoFeet:false,note:`Heel to toe, in place, ${fn.speed.toFixed(1)} m/s`},B);c.speed=fn.speed;L.push(c);}
  /* Run: leaning, knees high, heel tucked under the hip in swing, a flight phase between steps and pumping arms */
  {const dur=.68,G={dur,duty:.3,apex:.035,abd:1,circ:3,
      thigh:pcurve([[0,-30],[.08,-16],[.2,6],[.3,22],[.4,18],[.55,-20],[.7,-52],[.82,-50],[.92,-38]]),
      knee:pcurve([[0,22],[.08,40],[.2,28],[.3,32],[.44,90],[.56,116],[.7,95],[.82,48],[.92,24]]),
      foot:pcurve([[0,2],[.06,0],[.16,2],[.24,18],[.32,42],[.45,55],[.6,34],[.76,2],[.88,-5]]),
      body(u){const yaw=C(D*(u-.92)),arm=C(D*(u-.9)),el=C(D*(u-.96)),hz=4.5*S(D*(u+.15));
        return headFix({sway:.012*S(D*(u+.07)),h:[6,-9*yaw,hz],sp:[8,3*yaw,-.3*hz],ch:[4+1.5*C(2*D*(u-.12)),11*yaw,-.5*hz],
          uL:shieldHand?[-14+16*arm,0,10+outL]:[-10+36*arm,0,6+4*arm+out],uR:[-10-36*arm,0,-6+4*arm-out],fL:shieldHand?[-78,0,0]:[-72-20*(.5-.5*el),0,0],fR:[-72-20*(.5+.5*el),0,0],
          wL:shieldHand?[0,0,0]:[-8,-6,0],wR:[held?55:-8,6,0],fist:[72,72]},.8);}};
    const fn=gaitPose(B,G),c=sampleClip('Run',dur,t=>fn(t/dur),{loop:true,autoFeet:false,note:`Flight phase between steps, in place, ${fn.speed.toFixed(1)} m/s`},B);c.speed=fn.speed;L.push(c);}

  /* ---- IK clips ---- stance: left side forward, knees bent. Sword and shield: shield forward, sword up on the right.
     Two-handed: axe held diagonally across the body, head up by the right shoulder, left hand low on the haft */
  const R=wrRig(B,two),M=two?3:2,
    ST1={HP:[0,-.09,0],h:[4,-22,0],sp:[5,-4,0],ch:[3,-8,0],nk:[0,0,0],hd:[0,0,0],FL:[.15,.19,-12,0,0],FR:[-.15,-.21,-48,0,0],
      gR:[-.3,1.02,.24],dR:[-.15,.85,.5],pR:[-.7,-.6,-.4],gL:[.12,1.0,.34],dL:[.15,.05,1],pL:[.9,-.4,-.2],fist:[95,95]},
    ST2=wrP(ST1,{h:[4,-18,0],ch:[3,-6,0],gR:[-.16,1.12,.36],dR:[-.45,.85,.2],eR:[0,.15,1],pR:[-.8,-.5,-.3],gL:[.15,1.0,.3],pL:[.7,-.6,-.3],lf:[0]}),ST=two?ST2:ST1;
  const pick=k=>wrP(wrP(k[1]||{},{}),k[M]||{});
  /* continuity (one-shot clips, solved in time order): when an elbow would swing over to the other side, or the blade's roll would
     spin, by more than WR_JUMP in one frame, the frame is solved again with the elbow pole leaning towards where that elbow pointed
     the frame before, and the blade turning about its own axis by at most WR_JUMP towards the keyed roll (so it catches up);
     while the keyed roll is flipped over (more than 90° away) the blade simply keeps its roll. Over the last 0.25 s the
     corrections fade out, so every clip still ends exactly on its keyed last frame. Frames without a jump are exactly as keyed, so clips still start and
     end on the stance. */
  const V3=THREE.Vector3;let EL=null,HR=null;
  const elbows=()=>{const e={};R.m.updateMatrixWorld(true);for(const sd of['L','R']){const Sh=R.J['upperArm_'+sd].getWorldPosition(new V3()),E=R.J['foreArm_'+sd].getWorldPosition(new V3()),W=R.J['hand_'+sd].getWorldPosition(new V3()),u=W.sub(Sh).normalize();
    E.sub(Sh);E.addScaledVector(u,-E.dot(u));if(E.lengthSq()>1e-6)e[sd]=E.normalize();}return e;};
  const roll=()=>{const hq=R.J.hand_R.getWorldQuaternion(new THREE.Quaternion()),Dh=new V3(0,0,1).applyQuaternion(hq),yw=new V3(0,1,0).applyQuaternion(hq);return{D:Dh,A:yw.addScaledVector(Dh,-yw.dot(Dh)).negate().normalize()};};
  /* the previous roll carried along with the blade: turned by the rotation that takes last frame's blade direction to this one's */
  const carry=(H,D)=>{const A=H.A.clone().applyQuaternion(new THREE.Quaternion().setFromUnitVectors(H.D,D));return A.addScaledVector(D,-A.dot(D)).normalize();};
  const solve=(p,cont,w=1)=>{let s=wrSolve(R,p);if(!cont)return s;let e=elbows(),h=roll();
    if(EL){const q=Object.assign({},p);let again=false;
      for(const sd of['L','R'])if(EL[sd]&&e[sd]&&e[sd].angleTo(EL[sd])>WR_JUMP){q['p'+sd]=new V3(...(p['p'+sd]||[sd==='L'?.6:-.6,-.6,-.5])).normalize().lerp(EL[sd],.85*w).normalize().toArray();again=true;}
      if(again){s=wrSolve(R,q);e=elbows();h=roll();}
      /* the roll is checked on the arm as finally solved (a corrected elbow changes it too) */
      if(HR&&!two){const A=carry(HR,h.D),th=Math.atan2(new V3().crossVectors(A,h.A).dot(h.D),A.dot(h.A));const J=WR_JUMP/Math.max(w,1e-3);if(Math.abs(th)>J){q.eR=(Math.abs(th)>Math.PI/2&&w>=1?A:A.applyAxisAngle(h.D,Math.sign(th)*J)).toArray();s=wrSolve(R,q);e=elbows();h=roll();}}}
    EL=e;HR=h;return s;};
  const CC=(name,dur,fn,o)=>{EL=HR=null;const cont=!(o&&o.loop),c=sampleClip(name,dur,t=>solve(fn(t),cont,Math.min(1,(dur-t)/.25)),Object.assign({autoFeet:false},o),B);L.push(c);return c;};
  /* two-handed swings twist and bend the torso far from the stance. In these clips: (1) the left elbow pole is fixed in the chest's frame
     (hips, spine and chest turns), since a pole fixed in the world stops meaning "out to the side": the stance's pole while the left
     grip is at its stance height (GL0 below the chest joint), turning to straight out to the side (PLs) as the grip rises 0.25 above
     that (the stance pole points down and back, which collapses onto a raised arm and leaves the elbow pointing in); (2) when the
     left grip (WR_HAFT down the haft from the right one) would come closer than WR_FRONT in front of the chest joint, both grips
     move straight forward (level, along the chest's facing), so the bent-over strikes no longer pull the hands into the ribs and the left elbow
     inward. Both leave the stance untouched, so the clips still start and end on it */
  const TWIST=new Set(['Two-handed attack 1','Two-handed attack 2','Two-handed heavy attack']),D2R=Math.PI/180;
  const chestQ=o=>{const q=new THREE.Quaternion();for(const a of[o.h,o.sp,o.ch])if(a)q.multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(a[0]*D2R,a[1]*D2R,a[2]*D2R)));return q;};
  const PLc=two?new V3(...ST2.pL).normalize().applyQuaternion(chestQ(ST2).invert()):null,PLs=new V3(1,-.25,-.1).normalize(),GL0=-.2;
  const KC=(name,dur,keys,note,base=ST)=>{const f0=wrKeys(keys.map(k=>[k[0],wrP(base,pick(k))]));
    const f=two&&TWIST.has(name)?t=>{const o=f0(t),qc=chestQ(o),k=B.legS,hp=new V3(...(o.HP||[0,0,0])).multiplyScalar(k);
      const qs=new THREE.Quaternion();for(const a of[o.h,o.sp])qs.multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(a[0]*D2R,a[1]*D2R,a[2]*D2R)));
      const C=new V3(hp.x,B.hipH+hp.y,hp.z).add(new V3(0,B.spine,0).applyQuaternion(new THREE.Quaternion().setFromEuler(new THREE.Euler(o.h[0]*D2R,o.h[1]*D2R,o.h[2]*D2R)))).add(new V3(0,B.chest,0).applyQuaternion(qs));
      const F=new V3(0,0,1).applyQuaternion(qc),gl=new V3(o.gR[0]*k+hp.x,o.gR[1]*k,o.gR[2]*k+hp.z).addScaledVector(new V3(...o.dR).normalize(),-WR_HAFT),rel=gl.sub(C),dz=WR_FRONT-rel.dot(F),w=Math.min(1,Math.max(0,(rel.dot(new V3(0,1,0).applyQuaternion(qc))-GL0)/.25));
      o.pL=PLc.clone().lerp(PLs,w*w*(3-2*w)).normalize().applyQuaternion(qc).toArray();
      if(dz>0){const Fh=F.clone().setY(0).normalize(),m=dz/Math.max(.3,Fh.dot(F))/k;o.gR=[o.gR[0]+Fh.x*m,o.gR[1],o.gR[2]+Fh.z*m];}return o;}:f0;return CC(name,dur,f,{note});};
  const bob=(o,dy,dz=0)=>{o.gR=[o.gR[0],o.gR[1]+dy,o.gR[2]+dz];o.gL=[o.gL[0],o.gL[1]+dy*1.2,o.gL[2]+dz];return o;};
  /* in-place IK gait: each foot slides back at a steady speed while planted (heel strike, heel-off) and swings forward lifted */
  const GAIT=(name,dur,G,note)=>{const fn=t=>{const u=t/dur,o=G.body(u),c2=C(D*(u-G.duty/2));
      o.HP=[G.sw*c2,G.y0-G.b*C(2*D*(u-G.duty/2)),G.zc||0];
      for(const[sd,off,x,yaw]of[['L',0,G.x,G.yaw[0]],['R',.5,-G.x,G.yaw[1]]]){const q=(((u+off)%1)+1)%1;let z,l,pt;
        if(q<G.duty){const v=q/G.duty;z=G.s*(1-2*v);l=0;pt=v<.15?-10*(1-v/.15):v>.7?G.toe*(v-.7)/.3:0;}
        else{const v=(q-G.duty)/(1-G.duty),sm=v*v*(3-2*v);z=-G.s+2*G.s*sm;l=G.lift*Math.sin(Math.PI*Math.pow(v,G.lp||1));pt=G.toe*(1-v)*(1-v)-12*v*v;}
        o['F'+sd]=[x,z+(G.zc||0),yaw,l,pt];}return o;};
    const sp=2*G.s*B.legS/(G.duty*dur),c=CC(name,dur,fn,{loop:true,note:`${note}, in place, ${sp.toFixed(1)} m/s`});c.speed=sp;};
  const crouch={HP:[0,-.4,-.04],h:[20,-15,0],sp:[12,-4,0],ch:[8,-6,0],hd:[-6,0,0],FL:[.2,.24,-8,0,0],FR:[-.2,-.2,-35,0,12]},
    crouchArms=two?{gR:[-.2,.85,.42],dR:[-.55,.65,.45]}:{gR:[-.38,.74,.3],dR:[-.15,.6,.8],gL:[.16,.98,.42],dL:[.15,.12,1]},CRB=wrP(wrP(ST,crouch),crouchArms);

  CC('Idle (war mode)',2.6,t=>{const p=D*t/2.6,b=S(p),b2=S(p+.6);return bob(wrP(ST,{HP:[0,-.09-.007*b,0],sp:[5+.8*b,-4,0],ch:[3+1.2*b,ST.ch[1],0],hd:[0,3*S(p*.5),0]}),-.01*b2);},{loop:true,note:two?'Axe across the body, ready':'Guard up, shield forward, sword ready'});
  GAIT('Walk (war mode)',1.1,{duty:.62,s:.28,lift:.09,toe:24,x:.14,yaw:[-6,-16],y0:-.11,b:.012,sw:.015,
    body:u=>bob(wrP(ST,{h:[5,ST.h[1]*.55-4*C(D*u),2.5*S(D*(u+.1))],sp:[6,-3,0],ch:[3,ST.ch[1],0]}),.012*C(2*D*u))},'Guard up, short steps');
  GAIT('Run (war mode)',.72,{duty:.36,s:.42,lift:.24,lp:.7,toe:34,x:.12,yaw:[-4,-10],y0:-.07,b:.028,sw:.012,
    body:u=>bob(wrP(wrP(ST,{h:[12,-10-6*C(D*u),3*S(D*(u+.1))],sp:[10,-3,0],ch:[4,-5,0]}),two?{gR:[-.2,1.1,.3],dR:[-.45,.85,.15]}:{gR:[-.36,1.02,.1],dR:[-.25,.9,-.15],gL:[.14,1.05,.38]}),.02*C(2*D*(u-.1)),.02*S(2*D*u))},'Weapon ready, leaning in');
  CC('Crouch',3,t=>{const p=D*t/3,b=S(p);return bob(wrP(CRB,{HP:[0,-.4-.008*b,-.04],sp:[12+.8*b,-4,0],ch:[8+1.2*b,-6,0],hd:[-6,4*S(p*.5),0]}),-.01*b);},{loop:true,note:'Low guard'});
  GAIT('Crouch & move forward',1.3,{duty:.64,s:.2,lift:.08,toe:16,x:.17,yaw:[-6,-20],y0:-.37,b:.01,sw:.018,
    body:u=>bob(wrP(CRB,{h:[20,-12-4*C(D*u),2*S(D*(u+.1))],sp:[12,-4,0],ch:[8,-6,0],hd:[-6,0,0]}),.01*C(2*D*u))},'Sneaking low behind the guard');
  KC('Crouching attack',1.15,[[0,{}],
    [.25,{HP:[0,-.43,-.07],h:[20,-26,0],ch:[6,-16,0]},{gR:[-.32,.76,-.04],dR:[0,.15,1]},{gR:[-.36,.82,.0],dR:[-.55,.45,-.7],eR:[0,0,1]}],
    [.33,{HP:[0,-.4,0],FL:[.2,.36,-8,.05,0]},{gR:[-.28,.8,.2],dR:[0,.12,1]},{gR:[-.42,.78,.35],dR:[-.85,-.1,.5],eR:[.3,0,1]}],
    [.42,{HP:[0,-.36,.12],h:[16,0,0],sp:[14,0,0],ch:[6,10,0],FL:[.2,.46,-8,0,0]},{gR:[-.06,.9,.66],dR:[.05,.1,1],gL:[.3,.88,.3],dL:[.7,.1,.7]},{gR:[-.05,.72,.6],dR:[.2,-.25,.95],eR:[1,0,0]}],
    [.52,{HP:[0,-.36,.12],h:[16,10,0],sp:[14,4,0],ch:[6,20,0],FL:[.2,.46,-8,0,0]},{gR:[-.08,.9,.62],dR:[.05,.1,1],gL:[.3,.88,.3],dL:[.7,.1,.7]},{gR:[.25,.74,.4],dR:[.9,-.2,.3],eR:[.3,0,-1]}],
    [.75,{HP:[0,-.38,.06],h:[18,-6,0],FL:[.2,.46,-8,0,0]},{gR:[-.25,.8,.4],dR:[-.1,.5,.85]},{gR:[0,.8,.45],dR:[-.2,.6,.75]}],
    [.95,{HP:[0,-.39,-.02],FL:[.2,.32,-8,.05,0]}],[1.15,{}]],'Low lunge from the crouch',CRB);
  /* jumps */
  const up1={gR:[-.34,1.48,.26],dR:[-.1,.95,.3],gL:[.18,1.42,.34]},up2={gR:[-.15,1.45,.3],dR:[-.3,.9,.1]};
  KC('Jump',1.3,[[0,{}],
    [.24,{HP:[0,-.3,-.02],h:[18,-18,0],sp:[16,-4,0],ch:[8,-6,0]},{gR:[-.38,.8,0],dR:[-.2,.45,.9],gL:[.26,.86,.12],dL:[.45,0,.9]},{gR:[-.25,.85,.2],dR:[-.5,.6,.5]}],
    [.38,{HP:[0,0,.02],h:[-2,-20,0],sp:[-2,-4,0],ch:[-4,-8,0],FL:[.15,.19,-12,0,30],FR:[-.15,-.21,-48,0,30]},up1,up2],
    [.6,{HP:[0,.34,0],h:[8,-20,0],sp:[6,-4,0],FL:[.15,.2,-12,.28,15],FR:[-.15,-.19,-48,.22,15]},wrP(up1,{gR:[-.34,1.5,.26],dR:[-.1,.9,.4],gL:[.18,1.42,.36]}),up2],
    [.82,{HP:[0,.02,0],h:[4,-20,0],FL:[.15,.19,-12,0,16],FR:[-.15,-.21,-48,0,16]},{gR:[-.32,1.22,.28],gL:[.15,1.25,.36]},{gR:[-.16,1.25,.33]}],
    [.96,{HP:[0,-.27,-.02],h:[16,-20,0],sp:[14,-4,0],ch:[6,-8,0]},{gR:[-.36,.86,.3],dR:[-.15,.7,.7],gL:[.17,.98,.38]},{gR:[-.2,.95,.33]}],
    [1.3,{}]],'Standing jump, about 0.3 m');
  {const hi1={gR:[-.2,1.75,-.05],dR:[0,.3,-.95],pR:[-.8,.3,-.2],gL:[.2,1.25,.4]},hi2={gR:[-.12,1.85,-.02],dR:[0,.2,-1],eR:[0,1,0],pR:[-.8,.3,-.2],pL:[.8,.3,-.2]};
  KC('Jump & attack',1.6,[[0,{}],
    [.25,{HP:[0,-.3,-.02],h:[18,-18,0],sp:[16,-4,0],ch:[8,-6,0]},{gR:[-.38,.8,0],dR:[-.2,.45,.9],gL:[.26,.86,.12],dL:[.45,0,.9]},{gR:[-.3,.85,.1],dR:[-.5,.5,.6]}],
    [.4,{HP:[0,0,.02],h:[-6,-20,0],sp:[-6,-4,0],ch:[-8,-8,0],FL:[.15,.19,-12,0,30],FR:[-.15,-.21,-48,0,30]},hi1,hi2],
    [.62,{HP:[0,.36,0],h:[-4,-16,0],sp:[-6,0,0],ch:[-8,-4,0],FL:[.15,.2,-12,.3,15],FR:[-.15,-.19,-48,.24,15]},wrP(hi1,{gR:[-.2,1.8,-.08],gL:[.2,1.52,.38]}),wrP(hi2,{gR:[-.12,1.9,-.06]})],
    [.82,{HP:[0,.02,.02],h:[8,-8,0],sp:[8,0,0],ch:[4,0,0],FL:[.15,.19,-12,0,16],FR:[-.15,-.21,-48,0,16]},{gR:[-.08,1.3,.6],dR:[0,0,1],pR:[-.7,-.5,-.3],gL:[.2,1.16,.36],dL:[.3,0,.95]},{gR:[-.08,1.35,.58],dR:[0,0,1],eR:[0,-1,0]}],
    [.95,{HP:[0,-.32,.04],h:[18,-6,0],sp:[22,0,0],ch:[10,2,0]},{gR:[-.05,.85,.55],dR:[0,-.65,.75],pR:[-.7,-.6,-.3],gL:[.25,.8,.6],dL:[.3,0,.95]},{gR:[-.06,.85,.55],dR:[0,-.6,.8],eR:[0,-.8,-.6]}],
    [1.25,{HP:[0,-.26,.03],h:[14,-8,0],sp:[16,0,0]},{gR:[-.07,.9,.5],dR:[0,-.55,.85],gL:[.24,.84,.56],dL:[.28,0,.96]},{gR:[-.07,.88,.52],dR:[0,-.55,.85],eR:[0,-.8,-.6]}],
    [1.6,{}]],'Leap with the weapon raised, strike down on landing');}
  /* reactions */
  KC('Hit 1',.75,[[0,{}],
    [.1,{HP:[0,-.1,-.07],h:[-6,-24,0],sp:[-12,-4,0],ch:[-16,-6,0],hd:[-14,0,0]},{gR:[-.42,1.12,.06],dR:[-.5,.75,.2],gL:[.12,1.18,.24],dL:[0,.2,1]},{gR:[-.18,1.2,.18],dR:[-.5,.8,.1]}],
    [.3,{HP:[0,-.11,-.04],h:[0,-22,0],sp:[-2,-4,0],ch:[-4,-8,0],hd:[-4,0,0]},{gR:[-.36,1.04,.18],gL:[.12,1.14,.3]},{gR:[-.17,1.14,.3]}],
    [.75,{}]],'Blow to the chest, rocks back');
  KC('Hit 2',.8,[[0,{}],
    [.1,{HP:[.05,-.11,-.02],h:[2,-36,8],sp:[2,-10,10],ch:[-4,-20,12],hd:[-6,-18,14]},{gR:[-.46,1.08,.12],dR:[-.6,.7,.3],gL:[.24,1.0,.3],dL:[.5,0,.85]},{gR:[-.26,1.05,.25],dR:[-.7,.6,.3]}],
    [.32,{HP:[.02,-.1,0],h:[3,-28,3],sp:[4,-6,4],ch:[0,-12,5],hd:[-2,-6,5]},{gR:[-.36,1.02,.2],gL:[.16,1.08,.32]},{gR:[-.2,1.08,.33]}],
    [.8,{}]],'Blow from the left, twists and bends away');
  KC('Heavy hit',1.6,[[0,{}],
    [.1,{HP:[0,-.08,-.1],h:[-14,-26,0],sp:[-16,-4,0],ch:[-18,-8,0],hd:[-20,0,4]},{gR:[-.5,1.3,-.05],dR:[-.7,.6,-.1],gL:[.35,1.3,.1],dL:[.6,.3,.7],pL:[.9,-.2,-.3]},{gR:[-.25,1.35,0],dR:[-.5,.8,-.2]}],
    [.28,{HP:[0,-.12,-.25],h:[-8,-24,0],sp:[-8,-4,0],ch:[-10,-8,0],hd:[-8,0,0],FR:[-.17,-.48,-50,.09,0]},{gR:[-.48,1.2,0],dR:[-.6,.7,0],gL:[.3,1.2,.15],dL:[.5,.2,.8]},{gR:[-.24,1.25,.1],dR:[-.5,.8,-.1]}],
    [.45,{HP:[0,-.2,-.38],h:[8,-24,0],sp:[10,-4,0],ch:[4,-8,0],hd:[4,0,0],FR:[-.18,-.62,-50,0,0]},{gR:[-.4,1.0,.12],dR:[-.3,.8,.5],gL:[.2,1.05,.28]},{gR:[-.2,1.05,.3]}],
    [.6,{HP:[0,-.16,-.4],FL:[.14,-.04,-15,.07,0],FR:[-.18,-.62,-50,0,0]}],
    [.75,{HP:[0,-.12,-.42],FL:[.15,-.2,-12,0,0],FR:[-.18,-.62,-50,0,0]}],
    [1.0,{HP:[0,-.1,-.25],FL:[.15,0,-12,.06,0],FR:[-.18,-.62,-50,0,0]}],
    [1.12,{HP:[0,-.09,-.18],FL:[.15,.19,-12,0,0],FR:[-.18,-.62,-50,0,0]}],
    [1.3,{HP:[0,-.09,-.08],FR:[-.16,-.42,-49,.06,0]}],
    [1.45,{}],[1.6,{}]],'Knocked back two steps, then steps in again');
  /* voice and gestures */
  KC('Shout',1.6,[[0,{}],
    [.25,{HP:[0,-.07,-.02],sp:[-4,-4,0],ch:[-7,-8,0],hd:[-12,0,0]},{gR:[-.36,1.06,.12],gL:[.16,1.02,.3]},{gR:[-.18,1.15,.3]}],
    [.42,{HP:[0,-.13,.04],h:[8,-18,0],sp:[10,-2,0],ch:[8,-4,0],nk:[14,0,0],hd:[-10,0,0]},{gR:[-.42,.95,.05],dR:[-.3,.8,.3],gL:[.34,.95,.18],dL:[.6,0,.8]},{gR:[-.22,1.0,.28]}],
    [.8,{HP:[0,-.13,.04],h:[8,-18,0],sp:[11,-2,0],ch:[9,-4,0],nk:[15,0,0],hd:[-9,2,0]},{gR:[-.43,.94,.04],dR:[-.3,.8,.3],gL:[.35,.94,.17],dL:[.6,0,.8]},{gR:[-.23,.99,.27]}],
    [1.1,{HP:[0,-.12,.03],h:[7,-18,0],sp:[9,-2,0],ch:[7,-4,0],nk:[12,0,0],hd:[-9,-2,0]},{gR:[-.42,.95,.06],dR:[-.3,.8,.3],gL:[.34,.95,.18],dL:[.6,0,.8]},{gR:[-.22,1.0,.28]}],
    [1.6,{}]],'Short battle cry, leaning in');
  KC('Roar',2.6,[[0,{}],
    [.4,{HP:[0,-.17,-.02],h:[14,-14,0],sp:[16,-2,0],ch:[10,-4,0],hd:[6,0,0]},{gR:[-.36,.82,.2],dR:[-.2,.6,.8],gL:[.22,.86,.3]},{gR:[-.2,.85,.38],dR:[-.6,.6,.5]}],
    [.8,{HP:[0,-.07,0],h:[-4,-8,0],sp:[-8,0,0],ch:[-14,-2,0],nk:[-6,0,0],hd:[-22,0,0]},{gR:[-.62,1.72,.12],dR:[-.3,.95,0],pR:[-.9,-.2,-.3],gL:[.6,1.62,.18],dL:[.4,.3,.9],pL:[.9,-.2,-.3]},{gR:[-.15,1.95,.18],dR:[-.98,.15,.05],eR:[0,1,0],pR:[-.9,0,-.3],pL:[.9,0,-.3]}],
    [1.3,{HP:[0,-.08,0],h:[-4,-8,2],sp:[-9,0,1],ch:[-15,-2,0],nk:[-6,0,0],hd:[-24,2,0]},{gR:[-.63,1.74,.1],dR:[-.3,.95,0],pR:[-.9,-.2,-.3],gL:[.61,1.63,.16],dL:[.4,.3,.9],pL:[.9,-.2,-.3]},{gR:[-.15,1.97,.16],dR:[-.98,.15,.05],eR:[0,1,0],pR:[-.9,0,-.3],pL:[.9,0,-.3]}],
    [1.8,{HP:[0,-.07,0],h:[-4,-8,-2],sp:[-8,0,-1],ch:[-14,-2,0],nk:[-6,0,0],hd:[-22,-2,0]},{gR:[-.62,1.72,.12],dR:[-.3,.95,0],pR:[-.9,-.2,-.3],gL:[.6,1.62,.18],dL:[.4,.3,.9],pL:[.9,-.2,-.3]},{gR:[-.15,1.95,.18],dR:[-.98,.15,.05],eR:[0,1,0],pR:[-.9,0,-.3],pL:[.9,0,-.3]}],
    [2.6,{}]],'Arms and weapon flung up, head thrown back');
  KC('Taunt',2.6,[[0,{}],
    [.4,{HP:[0,-.05,0],h:[0,-4,0],sp:[-3,0,0],ch:[-6,10,0],hd:[-10,0,8]},{gR:[.05,1.23,.44],dR:[-.2,.9,.3],gL:[.12,1.1,.22],dL:[-.2,0,1],pR:[-.8,-.4,-.3]},{gR:[-.32,1.0,.25],dR:[-.15,.98,.1],eR:[0,0,1],lf:[1],gL:[.45,1.15,.38],dL:[.2,.4,1],fist:[30,95]}],
    [.62,{HP:[0,-.05,0],h:[0,-4,0],ch:[-6,10,0],hd:[-10,0,8]},{gR:[.05,1.3,.6],gL:[.12,1.1,.22],dL:[-.2,0,1]},{gR:[-.32,1.0,.25],lf:[1],gL:[.4,1.15,.3],fist:[90,95]}],
    [.78,{HP:[0,-.05,0],h:[0,-4,0],ch:[-6,10,0],hd:[-6,0,6]},{gR:[.05,1.23,.44],gL:[.12,1.1,.22],dL:[-.2,0,1]},{gR:[-.32,1.0,.25],lf:[1],gL:[.46,1.16,.4],fist:[25,95]}],
    [1.0,{HP:[0,-.05,0],h:[0,-4,0],ch:[-6,10,0],hd:[-10,0,8]},{gR:[.05,1.3,.6],gL:[.12,1.1,.22],dL:[-.2,0,1]},{gR:[-.32,1.0,.25],lf:[1],gL:[.4,1.15,.3],fist:[90,95]}],
    [1.16,{HP:[0,-.05,0],h:[0,-4,0],ch:[-6,10,0],hd:[-6,0,6]},{gR:[.05,1.23,.44],gL:[.12,1.1,.22],dL:[-.2,0,1]},{gR:[-.32,1.0,.25],lf:[1],gL:[.46,1.16,.4],fist:[25,95]}],
    [1.6,{HP:[0,-.04,0],h:[2,-6,0],sp:[-4,0,0],ch:[-8,6,0],hd:[-14,0,-6]},{gR:[-.45,.9,.15],dR:[-.1,-.5,.85],gL:[.45,1.05,.25],dL:[.5,.2,.85]},{gR:[-.32,1.0,.25],lf:[1],gL:[.46,1.05,.3],fist:[40,95]}],
    [2.0,{HP:[0,-.04,0],h:[2,-6,0],sp:[-4,0,0],ch:[-8,6,0],hd:[-12,0,-4]},{gR:[-.45,.9,.15],dR:[-.1,-.5,.85],gL:[.45,1.05,.25],dL:[.5,.2,.85]},{gR:[-.32,1.0,.25],lf:[1],gL:[.46,1.05,.3],fist:[40,95]}],
    [2.6,{}]],two?'Beckons with the free hand, chin up':'Bangs the sword on the shield, then opens the arms, chin up');
  KC('Cast spell',2.6,[[0,{}],
    [.55,{HP:[0,-.06,0],h:[0,-10,0],sp:[-4,-2,0],ch:[-6,-4,0],hd:[-18,0,0]},{gR:[-.2,2.0,.15],dR:[0,1,.04],pR:[-.9,0,-.3],gL:[.28,.95,.28],dL:[.4,0,.9]},{gR:[-.1,2.0,.16],dR:[0,1,.04],eR:[0,0,1],pR:[-.9,0,-.3],pL:[.9,0,-.3]}],
    [1.0,{HP:[0,-.065,0],h:[0,-10,0],sp:[-4,-2,0],ch:[-6,-4,0],hd:[-19,1,0]},{gR:[-.21,2.01,.14],dR:[.02,1,.03],pR:[-.9,0,-.3],gL:[.28,.94,.28],dL:[.4,0,.9]},{gR:[-.11,2.01,.15],dR:[.02,1,.03],eR:[0,0,1],pR:[-.9,0,-.3],pL:[.9,0,-.3]}],
    [1.5,{HP:[0,-.06,0],h:[0,-10,0],sp:[-4,-2,0],ch:[-6,-4,0],hd:[-18,-1,0]},{gR:[-.19,2.0,.16],dR:[-.02,1,.05],pR:[-.9,0,-.3],gL:[.28,.95,.28],dL:[.4,0,.9]},{gR:[-.09,2.0,.17],dR:[-.02,1,.05],eR:[0,0,1],pR:[-.9,0,-.3],pL:[.9,0,-.3]}],
    [2.0,{HP:[0,-.065,0],h:[0,-10,0],sp:[-4,-2,0],ch:[-6,-4,0],hd:[-19,0,0]},{gR:[-.2,2.01,.15],dR:[0,1,.04],pR:[-.9,0,-.3],gL:[.28,.94,.28],dL:[.4,0,.9]},{gR:[-.1,2.01,.16],dR:[0,1,.04],eR:[0,0,1],pR:[-.9,0,-.3],pL:[.9,0,-.3]}],
    [2.6,{}]],'Holds the weapon straight up overhead');
  /* kicks with the rear (right) leg, standing on the left */
  KC('Kick',1.0,[[0,{}],
    [.2,{HP:[.08,-.07,.02],h:[-4,-10,0],sp:[-6,-4,0],ch:[-2,-8,0],FR:[-.1,.12,-12,.42,-15],nR:[0,1,.5]}],
    [.34,{HP:[.09,-.04,-.02],h:[-14,-4,0],sp:[-10,-2,0],ch:[-6,-6,0],FR:[-.06,.72,-4,.72,-75],nR:[0,1,.2]},{gL:[.18,1.0,.3]},{}],
    [.44,{HP:[.09,-.04,-.03],h:[-14,-4,0],sp:[-10,-2,0],ch:[-6,-6,0],FR:[-.06,.74,-4,.72,-75],nR:[0,1,.2]},{gL:[.18,1.0,.3]},{}],
    [.58,{HP:[.08,-.07,.02],h:[-4,-10,0],sp:[-6,-4,0],ch:[-2,-8,0],FR:[-.1,.16,-12,.4,-15],nR:[0,1,.5]}],
    [.76,{HP:[.03,-.09,0],FR:[-.14,-.12,-35,.1,0],nR:[0,.3,1]}],
    [1.0,{}]],'Front push kick, sole to the belly');
  KC('Hip kick',1.25,[[0,{}],
    [.28,{HP:[.08,-.08,-.04],h:[-4,-14,0],sp:[-6,-4,0],ch:[-2,-8,0],FL:[.15,.19,-22,0,0],FR:[-.09,.12,-22,.6,-35],nR:[0,1,.6]},{gL:[.16,1.06,.3]},{}],
    [.4,{HP:[.1,-.05,.12],h:[-22,-6,0],sp:[-14,-2,0],ch:[-8,-6,0],hd:[8,0,0],FL:[.15,.19,-30,0,0],FR:[-.06,.84,-28,.74,-88],nR:[0,1,.1]},{gL:[.2,1.02,.26],dL:[.4,0,.9]},{}],
    [.52,{HP:[.1,-.05,.13],h:[-22,-6,0],sp:[-14,-2,0],ch:[-8,-6,0],hd:[8,0,0],FL:[.15,.19,-30,0,0],FR:[-.06,.86,-28,.73,-88],nR:[0,1,.1]},{gL:[.2,1.02,.26],dL:[.4,0,.9]},{}],
    [.68,{HP:[.08,-.08,-.02],h:[-6,-12,0],sp:[-6,-4,0],ch:[-2,-8,0],FL:[.15,.19,-22,0,0],FR:[-.1,.2,-22,.5,-30],nR:[0,1,.6]}],
    [.9,{HP:[.03,-.09,0],FR:[-.14,-.12,-38,.1,0],nR:[0,.3,1]}],
    [1.25,{}]],'Door-busting stomp: knee to the chest, hips drive in, heel and sole straight ahead at hip height');
  /* attacks for the weapon in hand */
  if(!two){
  KC('Low swing one-handed',1.1,[[0,{}],
    [.3,{HP:[0,-.16,-.04],h:[10,-34,0],sp:[14,-8,0],ch:[6,-20,0],gR:[-.55,.95,-.05],dR:[-.5,.2,-.85],pR:[-.6,-.5,-.6],gL:[.25,1.05,.35]}],
    [.44,{HP:[0,-.3,.08],h:[14,-14,0],sp:[20,-4,0],ch:[8,-6,0],FL:[.15,.42,-10,.06,0],gR:[-.5,.62,.35],dR:[-.85,-.3,.35],pR:[-.5,-.8,-.3],gL:[.28,1.0,.3]}],
    [.52,{HP:[0,-.4,.16],h:[18,0,0],sp:[26,4,0],ch:[10,14,0],FL:[.15,.48,-8,0,0],gR:[-.1,.52,.6],dR:[-.25,-.3,.92],pR:[-.5,-.8,-.3],gL:[.34,.98,.2],dL:[.8,0,.6]}],
    [.6,{HP:[0,-.4,.16],h:[18,12,0],sp:[26,8,0],ch:[10,26,0],FL:[.15,.48,-8,0,0],gR:[.25,.52,.48],dR:[.75,-.3,.6],pR:[-.3,-.9,-.3],gL:[.4,.98,.05],dL:[.95,0,-.1]}],
    [.72,{HP:[0,-.38,.14],h:[16,16,0],sp:[24,8,0],ch:[10,30,0],FL:[.15,.48,-8,0,0],gR:[.35,.58,.2],dR:[.9,-.25,-.3],pR:[-.3,-.9,-.3],gL:[.42,.98,0],dL:[.95,0,-.15]}],
    [.9,{HP:[0,-.16,.04],h:[8,-8,0],sp:[8,0,0],ch:[4,-4,0],FL:[.15,.3,-10,.06,0],gR:[-.15,1.0,.3],dR:[-.1,.8,.55]}],
    [1.1,{}]],'Lunging sweep at shin height, right to left');
  KC('One-handed attack 1',1.1,[[0,{}],
    [.3,{HP:[0,-.1,-.04],h:[4,-34,0],sp:[4,-8,0],ch:[0,-22,0],gR:[-.5,1.38,-.12],dR:[-.35,.45,-.82],pR:[-.5,-.3,-.8],gL:[.2,1.12,.34],dL:[.3,0,1]}],
    [.42,{HP:[0,-.12,.04],h:[6,-12,0],sp:[5,-4,0],ch:[4,0,0],FL:[.15,.34,-10,.05,0],gR:[-.48,1.3,.28],dR:[-.95,.15,.25],pR:[-.4,-.8,-.4],gL:[.24,1.1,.3],dL:[.5,0,.9]}],
    [.5,{HP:[0,-.14,.1],h:[6,5,0],sp:[6,4,0],ch:[6,18,0],FL:[.15,.42,-8,0,0],gR:[-.1,1.25,.55],dR:[-.3,.05,.95],pR:[-.4,-.8,-.4],gL:[.32,1.06,.2],dL:[.85,0,.5]}],
    [.58,{HP:[0,-.14,.1],h:[8,14,0],sp:[8,8,0],ch:[8,26,0],FL:[.15,.42,-8,0,0],gR:[.24,1.18,.45],dR:[.65,-.05,.75],pR:[-.3,-.9,-.3],gL:[.4,1.0,.05],dL:[.95,0,-.1]}],
    [.7,{HP:[0,-.14,.08],h:[8,18,0],sp:[8,8,0],ch:[8,30,0],FL:[.15,.42,-8,0,0],gR:[.3,1.08,.28],dR:[.95,-.15,.15],pR:[-.3,-.9,-.3],gL:[.42,.98,0],dL:[.95,0,-.15]}],
    [.88,{HP:[0,-.1,.02],h:[6,-6,0],ch:[4,-4,0],FL:[.15,.3,-10,.05,0],gR:[-.12,1.1,.3],dR:[-.1,.85,.5],gL:[.2,1.08,.3]}],
    [1.1,{}]],'Forehand slash, right to left, with a step in');
  KC('One-handed attack 2',1.05,[[0,{}],
    [.32,{HP:[0,-.06,-.05],h:[-4,-26,0],sp:[-8,-4,0],ch:[-8,-14,0],gR:[-.22,1.9,-.08],dR:[0,.25,-.97],pR:[-.8,.3,-.2],gL:[.15,1.18,.4]}],
    [.44,{HP:[0,-.1,.04],h:[2,-18,0],sp:[0,-4,0],ch:[0,-6,0],FL:[.15,.34,-10,.05,0],gR:[-.14,1.78,.3],dR:[0,.9,.35],pR:[-.8,.1,-.3],gL:[.18,1.15,.38]}],
    [.5,{HP:[0,-.18,.12],h:[10,-10,0],sp:[16,0,0],ch:[10,0,0],FL:[.15,.42,-8,0,0],gR:[-.08,1.25,.62],dR:[0,-.05,1],pR:[-.7,-.5,-.3],gL:[.22,.98,.5],dL:[.3,0,.95]}],
    [.58,{HP:[0,-.24,.14],h:[14,-8,0],sp:[22,0,0],ch:[12,2,0],FL:[.15,.42,-8,0,0],gR:[-.05,.92,.56],dR:[0,-.65,.75],pR:[-.7,-.6,-.3],gL:[.24,.86,.6],dL:[.32,0,.95]}],
    [.76,{HP:[0,-.22,.13],h:[12,-8,0],sp:[18,0,0],ch:[10,2,0],FL:[.15,.42,-8,0,0],gR:[-.07,.92,.5],dR:[0,-.55,.85],pR:[-.7,-.6,-.3],gL:[.23,.88,.58],dL:[.32,0,.95]}],
    [.9,{HP:[0,-.12,.04],h:[6,-16,0],sp:[6,-2,0],FL:[.15,.3,-10,.05,0],gR:[-.2,1.0,.3],dR:[-.1,.6,.8],gL:[.17,.96,.44],dL:[.22,.03,.97]}],
    [1.05,{}]],'Overhead chop, straight down');
  KC('One-handed heavy attack',1.7,[[0,{}],
    [.55,{HP:[0,-.16,-.08],h:[2,-42,0],sp:[2,-10,0],ch:[-6,-22,0],gR:[-.38,1.72,-.22],dR:[-.15,-.35,-.92],pR:[-.8,.1,-.3],gL:[.26,1.25,.42],dL:[.2,.1,1]}],
    [.72,{HP:[0,-.18,.1],h:[4,-20,0],sp:[6,-4,0],ch:[0,-8,0],FL:[.15,.5,-10,.07,0],gR:[-.36,1.75,.22],dR:[-.3,.9,.3],pR:[-.8,0,-.3],gL:[.3,1.2,.38],dL:[.4,.1,.9]}],
    [.8,{HP:[0,-.26,.22],h:[10,0,0],sp:[14,4,0],ch:[8,14,0],FL:[.15,.6,-8,0,0],gR:[-.12,1.35,.62],dR:[.25,.35,.9],pR:[-.7,-.4,-.4],gL:[.36,1.12,.3],dL:[.7,0,.7]}],
    [.88,{HP:[0,-.3,.24],h:[14,14,0],sp:[18,8,0],ch:[10,24,0],FL:[.15,.6,-8,0,0],gR:[.2,.95,.55],dR:[.55,-.5,.65],pR:[-.5,-.8,-.3],gL:[.42,1.06,.1],dL:[.95,0,0]}],
    [1.0,{HP:[0,-.3,.22],h:[14,20,0],sp:[18,8,0],ch:[10,30,0],FL:[.15,.6,-8,0,0],gR:[.32,.76,.28],dR:[.75,-.55,-.2],pR:[-.3,-.9,-.3],gL:[.44,1.04,0],dL:[.95,0,-.2]}],
    [1.25,{HP:[0,-.24,.18],h:[10,8,0],sp:[12,4,0],ch:[6,12,0],FL:[.15,.6,-8,0,0],gR:[.12,.88,.4],dR:[.3,.5,.8],pR:[-.5,-.8,-.3],gL:[.3,1.08,.25],dL:[.6,0,.8]}],
    [1.45,{HP:[0,-.14,.06],h:[6,-14,0],FL:[.15,.36,-10,.07,0],gR:[-.2,1.0,.3],dR:[-.1,.8,.55]}],
    [1.7,{}]],'Wind-up over the shoulder, lunge and diagonal cut to the ground');}
  if(shieldHand){
  KC('Shield bash',1.0,[[0,{}],
    [.25,{HP:[0,-.12,-.06],h:[4,-36,0],sp:[4,-6,0],ch:[0,-14,0],gL:[.2,1.08,.14],dL:[.3,0,1],gR:[-.36,1.0,.05]}],
    [.38,{HP:[0,-.12,.08],h:[4,-24,0],FL:[.15,.4,-12,.06,0],gL:[.16,1.12,.4],dL:[.1,.05,1],gR:[-.36,1.0,.1]}],
    [.45,{HP:[0,-.13,.2],h:[6,-12,0],sp:[8,-4,0],ch:[6,-22,0],FL:[.15,.5,-12,0,0],gL:[.1,1.15,.66],dL:[0,.05,1],pL:[.9,-.3,-.3],gR:[-.38,1.0,.16]}],
    [.56,{HP:[0,-.13,.2],h:[6,-12,0],sp:[8,-4,0],ch:[6,-20,0],FL:[.15,.5,-12,0,0],gL:[.1,1.14,.6],dL:[0,.05,1],pL:[.9,-.3,-.3],gR:[-.38,1.0,.16]}],
    [.8,{HP:[0,-.1,.06],FL:[.15,.32,-12,.05,0]}],[1.0,{}]],'Steps in and drives the shield forward');
  KC('Block with shield',1.4,[[0,{}],
    [.15,{HP:[0,-.18,-.04],h:[6,-26,0],sp:[8,-4,0],ch:[4,-10,0],hd:[10,0,0],gL:[.08,1.42,.4],dL:[0,-.3,1],pL:[.9,-.2,-.2],gR:[-.36,1.0,.12]}],
    [.5,{HP:[0,-.2,-.1],h:[4,-26,0],sp:[6,-4,0],ch:[2,-10,0],hd:[14,0,0],gL:[.07,1.4,.3],dL:[0,-.25,1],pL:[.9,-.2,-.2],gR:[-.36,.98,.06]}],
    [.7,{HP:[0,-.19,-.05],h:[6,-26,0],sp:[8,-4,0],ch:[4,-10,0],hd:[11,0,0],gL:[.08,1.42,.38],dL:[0,-.3,1],pL:[.9,-.2,-.2],gR:[-.36,1.0,.1]}],
    [1.05,{HP:[0,-.18,-.04],h:[6,-26,0],sp:[8,-4,0],ch:[4,-10,0],hd:[10,0,0],gL:[.08,1.42,.4],dL:[0,-.3,1],pL:[.9,-.2,-.2],gR:[-.36,1.0,.12]}],
    [1.4,{}]],'Shield up over the face, takes the blow and pushes back');}
  if(two){
  KC('Low swing two-handed',1.25,[[0,{}],
    [.38,{HP:[0,-.15,-.05],h:[8,-40,0],sp:[10,-8,0],ch:[2,-25,0],gR:[-.45,1.15,-.15],dR:[-.45,.1,-.88],eR:[0,-.2,1],pR:[-.5,-.5,-.7],pL:[.6,-.6,-.4]}],
    [.52,{HP:[0,-.3,.06],h:[14,-14,0],sp:[20,-4,0],ch:[6,-6,0],FL:[.15,.4,-10,.06,0],gR:[-.45,.72,.3],dR:[-.9,-.3,.3],eR:[0,0,1],pR:[-.5,-.8,-.3]}],
    [.6,{HP:[0,-.42,.16],h:[18,4,0],sp:[28,4,0],ch:[10,16,0],FL:[.15,.48,-8,0,0],gR:[-.08,.62,.55],dR:[-.25,-.35,.9],eR:[1,0,.2],pR:[-.5,-.8,-.3]}],
    [.68,{HP:[0,-.42,.16],h:[18,14,0],sp:[28,8,0],ch:[10,26,0],FL:[.15,.48,-8,0,0],gR:[.25,.62,.42],dR:[.75,-.3,.6],eR:[.6,0,-.8],pR:[-.3,-.9,-.3]}],
    [.82,{HP:[0,-.4,.14],h:[16,20,0],sp:[26,8,0],ch:[10,32,0],FL:[.15,.48,-8,0,0],gR:[.32,.68,.15],dR:[.9,-.2,-.4],eR:[0,0,-1],pR:[-.3,-.9,-.3]}],
    [1.05,{HP:[0,-.14,.04],h:[6,-10,0],sp:[8,-2,0],ch:[4,-4,0],FL:[.15,.3,-10,.06,0],gR:[-.12,1.05,.38],dR:[-.4,.85,.3]}],
    [1.25,{}]],'Lunging sweep at shin height, right to left');
  KC('Two-handed attack 1',1.2,[[0,{}],
    [.35,{HP:[0,-.1,-.04],h:[4,-40,0],sp:[4,-8,0],ch:[0,-25,0],gR:[-.45,1.3,-.15],dR:[-.4,.4,-.8],eR:[0,0,1],pR:[-.5,-.4,-.8],pL:[.6,-.6,-.4]}],
    [.5,{HP:[0,-.12,.04],h:[6,-12,0],sp:[5,-4,0],ch:[4,0,0],FL:[.15,.36,-10,.06,0],gR:[-.45,1.25,.25],dR:[-.95,.1,.2],eR:[0,0,1],pR:[-.5,-.8,-.3]}],
    [.58,{HP:[0,-.15,.1],h:[6,8,0],sp:[6,4,0],ch:[6,20,0],FL:[.15,.42,-8,0,0],gR:[-.08,1.18,.5],dR:[-.25,0,.97],eR:[1,0,.2],pR:[-.5,-.8,-.3]}],
    [.66,{HP:[0,-.15,.1],h:[8,18,0],sp:[8,8,0],ch:[8,30,0],FL:[.15,.42,-8,0,0],gR:[.25,1.12,.38],dR:[.7,-.05,.7],eR:[.7,0,-.7],pR:[-.3,-.9,-.3]}],
    [.8,{HP:[0,-.14,.08],h:[8,24,0],sp:[8,8,0],ch:[8,36,0],FL:[.15,.42,-8,0,0],gR:[.3,1.0,.1],dR:[.9,-.2,-.35],eR:[0,0,-1],pR:[-.3,-.9,-.3]}],
    [1.0,{HP:[0,-.1,.02],h:[6,-6,0],ch:[4,-4,0],FL:[.15,.3,-10,.06,0],gR:[-.1,1.1,.35],dR:[-.4,.85,.25]}],
    [1.2,{}]],'Horizontal swing, right to left, with a step in');
  KC('Two-handed attack 2',1.15,[[0,{}],
    [.38,{HP:[0,-.06,-.06],h:[-4,-18,0],sp:[-10,-4,0],ch:[-10,-8,0],gR:[-.1,1.95,-.15],dR:[0,.2,-.98],eR:[0,1,0],pR:[-.8,.3,-.2],pL:[.8,.3,-.2]}],
    [.5,{HP:[0,-.1,.04],h:[2,-12,0],sp:[0,-2,0],ch:[0,-4,0],FL:[.15,.34,-10,.06,0],gR:[-.06,1.85,.25],dR:[0,.95,.3],eR:[0,0,1],pR:[-.8,.1,-.3],pL:[.8,.1,-.3]}],
    [.56,{HP:[0,-.2,.12],h:[10,-6,0],sp:[18,0,0],ch:[10,0,0],FL:[.15,.42,-8,0,0],gR:[-.04,1.3,.6],dR:[0,0,1],eR:[0,-1,0],pR:[-.7,-.5,-.3],pL:[.7,-.5,-.3]}],
    [.64,{HP:[0,-.28,.14],h:[16,-6,0],sp:[26,0,0],ch:[14,0,0],FL:[.15,.42,-8,0,0],gR:[-.03,.88,.58],dR:[0,-.7,.7],eR:[0,-.7,-.7],pR:[-.7,-.6,-.3],pL:[.7,-.6,-.3]}],
    [.85,{HP:[0,-.26,.13],h:[14,-6,0],sp:[22,0,0],ch:[12,0,0],FL:[.15,.42,-8,0,0],gR:[-.04,.9,.55],dR:[0,-.65,.75],eR:[0,-.7,-.7],pR:[-.7,-.6,-.3],pL:[.7,-.6,-.3]}],
    [1.0,{HP:[0,-.12,.04],h:[6,-14,0],sp:[6,-2,0],FL:[.15,.3,-10,.06,0],gR:[-.12,1.05,.38],dR:[-.4,.85,.3]}],
    [1.15,{}]],'Overhead chop, straight down');
  KC('Two-handed heavy attack',1.9,[[0,{}],
    [.6,{HP:[0,-.18,-.1],h:[0,-45,0],sp:[-6,-10,0],ch:[-10,-25,0],gR:[-.35,1.85,-.3],dR:[-.2,-.2,-.96],eR:[0,1,0],pR:[-.8,.3,-.3],pL:[.8,.3,-.3]}],
    [.8,{HP:[0,-.2,.1],h:[2,-20,0],sp:[2,-4,0],ch:[-4,-8,0],FL:[.15,.55,-10,.07,0],gR:[-.3,2.0,.15],dR:[-.2,.95,.2],eR:[.1,0,1],pR:[-.8,.2,-.3],pL:[.8,.2,-.3]}],
    [.88,{HP:[0,-.3,.24],h:[12,0,0],sp:[18,4,0],ch:[10,14,0],FL:[.15,.62,-8,0,0],gR:[-.1,1.4,.62],dR:[.2,.3,.93],eR:[.3,-.9,.2],pR:[-.7,-.4,-.4],pL:[.7,-.4,-.4]}],
    [.96,{HP:[0,-.4,.26],h:[18,12,0],sp:[26,8,0],ch:[12,22,0],FL:[.15,.62,-8,0,0],gR:[.08,.82,.6],dR:E.long?[.36,-.64,.68]:[.35,-.7,.62],eR:[.3,-.6,-.7],pR:[-.6,-.7,-.3],pL:[.7,-.6,-.3]}],
    [1.1,{HP:[0,-.42,.26],h:[18,14,0],sp:[28,8,0],ch:[12,24,0],FL:[.15,.62,-8,0,0],gR:[.1,.82,.56],dR:E.long?[.37,-.71,.6]:[.35,-.82,.45],eR:[.2,-.5,-.8],pR:[-.6,-.7,-.3],pL:[.7,-.6,-.3]}],
    [1.4,{HP:[0,-.26,.2],h:[10,4,0],sp:[14,4,0],ch:[6,10,0],FL:[.15,.62,-8,0,0],gR:[-.05,1.0,.45],dR:[-.3,.8,.5]}],
    [1.62,{HP:[0,-.14,.06],h:[6,-12,0],FL:[.15,.36,-10,.07,0]}],
    [1.9,{}]],'Wind-up behind the back, lunge and smash into the ground');
  KC('Block with two-handed weapon',1.4,[[0,{}],
    [.15,{HP:[0,-.17,-.03],h:[4,-10,0],sp:[6,-2,0],ch:[2,-4,0],hd:[8,0,0],gR:[-.1,1.62,.36],dR:[-1,.06,0],eR:[0,1,.2],pR:[-.8,-.4,-.3],pL:[.8,-.4,-.3]}],
    [.5,{HP:[0,-.2,-.09],h:[2,-10,0],sp:[4,-2,0],ch:[0,-4,0],hd:[12,0,0],gR:[-.1,1.56,.28],dR:[-1,.06,0],eR:[0,1,.2],pR:[-.8,-.4,-.3],pL:[.8,-.4,-.3]}],
    [.7,{HP:[0,-.18,-.04],h:[4,-10,0],sp:[6,-2,0],ch:[2,-4,0],hd:[9,0,0],gR:[-.1,1.61,.34],dR:[-1,.06,0],eR:[0,1,.2],pR:[-.8,-.4,-.3],pL:[.8,-.4,-.3]}],
    [1.05,{HP:[0,-.17,-.03],h:[4,-10,0],sp:[6,-2,0],ch:[2,-4,0],hd:[8,0,0],gR:[-.1,1.62,.36],dR:[-1,.06,0],eR:[0,1,.2],pR:[-.8,-.4,-.3],pL:[.8,-.4,-.3]}],
    [1.4,{}]],'Haft held level above the head, takes the blow');}
  return WCLIPS[key]=L;}

/* ---------- equipment ---------- */
const WRM={};
function wrGlow(hex,em,ei,map,metal=0){const k=[hex,em,ei,map.uuid,metal].join();return WRM[k]||(WRM[k]=new THREE.MeshStandardMaterial({map,color:new THREE.Color(hex).convertSRGBToLinear(),emissive:new THREE.Color(em).convertSRGBToLinear(),emissiveIntensity:ei,emissiveMap:map,roughness:metal?.5:.9,metalness:metal}));}
function wrEquip(m,B,T,E){const J=n=>m.getObjectByName(n),g=B.g,aw=.12*g*(B.arm||1),lw=.13*g,TW=2*(B.shW-aw/2),TD=.18*g*(B.td||1),vs=B.tS,cS=B.cS,chH=.27*cS,adultF=T.kind==='female',HW=(adultF?TW*1.12:TW)*(B.hipK||1),SW=TW*(adultF?.92:1)*(B.waistK||1),fk=B.ankle/.06,hk=B.hand;
  if(E.helm){const H=wrGlow('#6a3424','#ff2a14',.55,pxTex('leather')),Hd=wrGlow('#3e2014','#ff2a14',.4,pxTex('leather')),hg=J('head').children.find(c=>!c.userData.joint),S=.28,F=S/2,e=.035;
    bx(hg,S+2*e,.05,S+2*e,H,0,S+.025,0);bx(hg,S+2*e,.13,.035,H,0,S-.065,-F-e/2);for(const s of[-1,1]){bx(hg,.035,.16,S+2*e,H,s*(F+e/2),S-.08,0);bx(hg,.04,.14,.1,H,s*(F+e/2+.004),.1,F-.03);}
    bx(hg,S+2*e+.012,.045,S+2*e+.012,Hd,0,S-.02,0);bx(hg,.05,.04,S+2*e-.04,Hd,0,S+.07,0);for(const s of[-1,1])bx(hg,.03,.03,.012,bm('#c8a050','plain'),s*.07,S-.02,F+e+.007);}
  if(E.plate){const P=wrGlow('#b4bec8','#2a7cff',.42,vm('iron').map,.5),Pd=wrGlow('#7a8490','#2a7cff',.3,vm('iron').map,.5),ch=J('chest'),sp=J('spine'),hips=J('hips'),bz=adultF?.05:0;
    bx(ch,TW+.05,chH+.02,TD+.06+bz,P,0,.1*cS,bz/2);bx(ch,.045,chH*.8,.02,Pd,0,.09*cS,(TD+.06)/2+bz+.008);bx(J('neck'),.17*g,.08,.16*g,P,0,.02,0);bx(ch,TW*.6,.05,TD*.75,Pd,0,.1*cS+chH/2+.02,0);
    for(let i=0;i<3;i++)bx(sp,SW+.05-i*.006,.088*vs,TD+.06,i%2?Pd:P,0,(-.02+i*.08)*vs,0);
    bx(hips,HW+.06,.1*vs,TD+.07,P,0,.02*vs,0);bx(hips,HW+.08,.04,TD+.09,bm(T.belt,'leather'),0,.06*vs,0);bx(hips,.06,.045,.012,bm('#c8a050','plain'),0,.06*vs,(TD+.09)/2+.007);
    for(const[sd,s]of[['L',1],['R',-1]]){const ua=J('upperArm_'+sd),fa=J('foreArm_'+sd),th=J('thigh_'+sd),sn=J('shin_'+sd),ft=J('foot_'+sd);
      bx(ua,aw*1.8,.09,aw*1.8,P,s*.012,.07,0);bx(ua,aw*1.62,.07,aw*1.62,Pd,s*.01,-.01,0);bx(ua,aw*1.46,.06,aw*1.46,P,s*.008,-.075,0);bx(ua,aw*1.18,B.ua*.42,aw*1.18,P,0,-B.ua*.66,0);
      bx(fa,aw*1.3,.08,aw*1.3,Pd,0,0,0);bx(fa,aw*1.16,B.fa*.58,aw*1.16,P,0,-B.fa*.42,0);
      bx(th,lw*1.2,B.thigh*.66,lw*1.24,P,0,-B.thigh*.42,0);bx(th,lw*1.24,.06,lw*1.28,Pd,0,-B.thigh*.1,0);
      bx(sn,lw*1.18,.1,lw*.5,Pd,0,-.01,lw*.42);bx(sn,lw*1.18,B.shin*.7,lw*1.22,P,0,-B.shin*.52,0);bx(ft,lw*1.1,.06,lw*1.66,P,0,-.022*fk,.03*g);}}
  if(E.gloves){const Gm=wrGlow('#7a4626','#ff7a10',.55,pxTex('leather'));
    for(const[sd,s]of[['L',1],['R',-1]]){const hd=J('hand_'+sd),fg=J('fingers_'+sd),ft=J('fingerTips_'+sd),th=J('thumb_'+sd),fa=J('foreArm_'+sd),hw=aw*.85;
      bx(hd,hw*1.12,.1*hk,hw*1.12,Gm,0,-.04*hk,0);bx(fg,hw*.86,.046*hk,hw*1.02,Gm,s*.005,-.016*hk,0);bx(ft,hw*.76,.036*hk,hw*.96,Gm,s*.005,-.012*hk,0);bx(th,.032*hk,.05*hk,.032*hk,Gm,0,-.018*hk,.006);
      bx(fa,aw*(E.plate?1.26:1.18),.1,aw*(E.plate?1.26:1.18),Gm,0,-B.fa+.045,0);}}
  if(E.sword){const w=new THREE.Group(),sw=wSword(.8,.075,.2);sw.rotation.x=Math.PI/2;sw.position.z=.1;w.add(sw);J('socket_R').add(w);}
  /* battle axe: haft along the thumb side, edge towards the fingers, right hand WR_HAFT above the left */
  if(E.axe){const w=new THREE.Group(),ax=wBattleAxe();ax.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(new THREE.Vector3(0,-1,0),new THREE.Vector3(0,0,1),new THREE.Vector3(-1,0,0)));ax.position.z=-.15;w.add(ax);J('socket_R').add(w);}
  /* the shield is gripped in the left hand, or slung on the back while both hands hold the axe */
  if(E.shield&&!E.axe){const sh=wRoundShield('woolRed');sh.rotation.y=Math.PI/2;sh.position.x=.12;J('socket_L').add(sh);}
  if(E.shield&&E.axe){const sh=wRoundShield('woolRed');sh.scale.setScalar(.85);sh.rotation.y=Math.PI;sh.position.set(0,-.02,-TD/2-(E.plate?.12:.09));J('chest').add(sh);}
  const D2=Math.PI/180,post0=m.userData.post;
  m.userData.post=()=>{post0&&post0();for(const[sd,on,s]of[['R',E.sword||E.axe,1],['L',E.shield&&!E.axe,-1]])if(on){J('fingers_'+sd).rotation.set(0,0,s*95*D2);J('fingerTips_'+sd).rotation.set(0,0,s*90*D2);J('thumb_'+sd).rotation.set(14*D2,0,s*33*D2);}};}

function buildWarrior(seed,o={}){const fem=o.sex==='female',B=VB[fem?'warriorF':'warrior'],w=o.weapon||'sword',E={helm:o.helm!=='none',plate:o.armor!=='none',gloves:o.gloves!=='none',sword:w==='sword',axe:w==='axe',shield:o.shield!=='none'};
  const m=buildVillager(fem?'female':'male',seed,'warrior'+(E.helm?'h':'')+(E.plate?'p':''),{B});wrEquip(m,B,m.userData.traits,E);m.userData.clips=warriorClips(B,E);
  const eq=[E.helm&&'leather helmet (red glow)',E.plate&&'plate armour (blue glow)',E.gloves&&'leather gloves (orange glow)',E.sword&&'sword',E.axe&&'two-handed battle axe',E.shield&&(E.axe?'round shield on the back':'round shield')].filter(Boolean);
  if(eq.length)m.userData.variantText+=' Equipped: '+eq.join(', ')+'.';return m;}
FOLDERS['characters'].children.push('characters/warriors');FOLDERS['characters/warriors']={name:'Warriors',blurb:'Fighters with armour, weapons and shields',children:[]};
const WOPT=(key,label,choices)=>({key,label,choices:[...choices,['none','None']],def:choices[0][0]});
ASSETS.push({id:'warrior',folder:'characters/warriors',name:'Warrior',kind:'character',variants:true,defaultSeed:4,groundR:2.6,build:(s,o)=>buildWarrior(s,o||{}),
  opts:[...SEX,WOPT('helm','Helmet',[['leather','Leather (red glow)']]),WOPT('armor','Armour',[['plate','Plate (blue glow)']]),WOPT('gloves','Gloves',[['leather','Leather (orange glow)']]),
    WOPT('weapon','Weapon',[['sword','Sword'],['axe','Battle axe (two-handed)']]),WOPT('shield','Shield',[['round','Round shield']])],
  desc:'Bulky warrior with a glowing leather helmet, plate armour and leather gloves, armed with a sword and round shield or a two-handed battle axe (the shield then hangs on the back); each piece can be taken off. Grounded walk and run, war-mode guard, walk and run, crouch and crouch walk, jumps, hit reactions, shout, roar, taunt, spell casting, blocks and attacks for the weapon in hand, solved with leg and arm IK so planted feet never slide.'});
