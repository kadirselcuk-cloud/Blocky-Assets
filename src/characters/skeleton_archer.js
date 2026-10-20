/* ======================= SKELETON ARCHER: the skeleton with a bow, an arrow and a quiver =======================
   Same body, armour, eyes and Death/Rise as the skeleton (buildSkeleton with archer:true). The bow is bow_L in the left socket
   (limbs along the socket's z, string towards +y), the arrow arrow_R on the right socket, the quiver on the back (its own piece, so it
   falls off in Death). The two halves of the string and the arrow are placed every frame by skaGearPose from where the right hand is:
     pull  0..1  the string's nock point moves from its rest to the right fist
     aw    0..1  the arrow sits in the right fist (0) or lies nocked from the string through the arrow rest (1)
     av    0/1   the arrow is shown (it is hidden from the release until a new one is pulled from the quiver)
   Clips are keyed in aim terms (bow grip G, aim yaw/pitch A, draw length dd, cant) and solved with the warrior's arm and leg IK;
   the right hand can leave the string for a free target (rh = position weight, rq = direction weight, hR/hD). */

/* bow: limbs along z curving back towards the string (+y), leather grip at the origin; string halves are scaled boxes */
function skaBow(){const g=new THREE.Group(),w=bm('#634036','leather'),wrap=bm('#3a2823','leather'),tip=bm('#cdc4ad','plain'),str=bm('#d7d0be','plain');
  for(const s of[-1,1]){for(const[z0,z1,y,t,wd]of[[.05,.2,0,.04,.034],[.19,.34,.016,.036,.03],[.33,.46,.038,.032,.026],[.45,.57,.07,.028,.022]])bx(g,wd,t,z1-z0,w,0,y,s*(z0+z1)/2);
    bx(g,.024,.034,.05,tip,0,.098,s*.585);}
  bx(g,.044,.052,.12,wrap,0,0,0);
  const U=g.userData;U.tipT=new THREE.Vector3(0,.11,.6);U.tipB=new THREE.Vector3(0,.11,-.6);U.nock=new THREE.Vector3(0,.11,0);U.rest=new THREE.Vector3(.026,0,.075);
  for(const[n,t]of[['string_top',U.tipT],['string_bot',U.tipB]]){const s=new THREE.Group();s.name=n;s.position.copy(t);bx(s,.008,1,.008,str,0,-.5,0);g.add(s);}
  return g;}
/* arrow: nock at the origin, shaft along +z, flat iron head and one flat vane (no crossed fletching) */
function skaArrow(){const g=new THREE.Group(),sh=bm('#8a6c50','leather'),ir=vm('iron'),fe=bm('#d7d2c4','plain'),nk=bm('#3a2823','leather');
  bx(g,.012,.012,.7,sh,0,0,.36);bx(g,.016,.016,.02,nk,0,0,.01);bx(g,.004,.044,.11,fe,0,0,.09);bx(g,.01,.034,.05,ir,0,0,.73);bx(g,.008,.016,.025,ir,0,0,.765);return g;}

/* quiver on the back (top behind the right shoulder) with a strap across the chest, bow in the left hand, arrow on the right */
function skaGear(root,chest,has,arm){const lea=bm('#573830','leather'),leaD=bm('#3d2621','leather'),rim=bm('#2f1f1c','leather'),shM=bm('#8a6c50','leather'),fe=bm('#d7d2c4','plain');
  const q=new THREE.Group();q.name='quiver';q.userData.piece=true;q.userData.longAx=new THREE.Vector3(-Math.sin(.35),Math.cos(.35),0);chest.add(q);
  const zb=has.chest?(arm==='plate'?-.145:-.12):-.105,zf=has.chest?(arm==='plate'?.14:.115):.1,tube=new THREE.Group();put(q,tube,-.07,.1,zb-.065,0,0,.35);
  bx(tube,.12,.46,.12,lea,0,0,0);bx(tube,.13,.04,.13,rim,0,.215,0);bx(tube,.13,.03,.13,rim,0,-.215,0);bx(tube,.125,.03,.125,leaD,0,.03,0);
  [[-.03,-.03],[.03,-.025],[0,.0],[-.028,.03],[.03,.03]].forEach(([x,z],i)=>{bx(tube,.012,.12,.012,shM,x,.26+.01*(i%2),z);bx(tube,.004,.1,.035,fe,x,.29+.01*(i%2),z);});
  /* strap (stays on the ribcage when the bones fall apart): over the right collarbone, then across the front to the left side */
  const rc=root.getObjectByName('bone_ribs');bx(rc,.035,.012,zf-zb+.02,leaD,-.1,.222,(zf+zb)/2);bx(rc,.34,.03,.012,leaD,.01,.075,zf,0,0,-.87);
  const bw=skaBow();bw.name='bow_L';bw.userData.piece=bw.userData.gear=true;bw.userData.dropDt=.03;root.getObjectByName('socket_L').add(bw);
  const ar=new THREE.Group();ar.name='arrow_R';ar.userData.piece=ar.userData.gear=true;ar.userData.dropDt=-.06;ar.add(skaArrow());root.getObjectByName('socket_R').add(ar);
  root.userData.gearPose=skaGearPose(root);root.userData.gearTracks=[[bw.getObjectByName('string_top'),'pqs'],[bw.getObjectByName('string_bot'),'pqs'],[ar,'s']];
  root.userData.gearPose({pull:0,aw:0,av:0});}

/* places the string halves and the arrow for the current joint pose */
function skaGearPose(root){const bow=root.getObjectByName('bow_L'),ar=root.getObjectByName('arrow_R'),sR=root.getObjectByName('socket_R'),U=bow.userData,V=THREE.Vector3,Q=THREE.Quaternion,M4=THREE.Matrix4;
  const st=[bow.getObjectByName('string_top'),bow.getObjectByName('string_bot')],tips=[U.tipT,U.tipB],dn=new V(0,-1,0),HAND=new M4().makeTranslation(0,0,-.1),cl=x=>Math.min(1,Math.max(0,x));
  const pa=new V(),pb=new V(),qa=new Q(),qb=new Q(),sc=new V();
  return s=>{root.updateMatrixWorld(true);const Bi=bow.matrixWorld.clone().invert(),h=sR.getWorldPosition(new V()).applyMatrix4(Bi),nock=U.nock.clone().lerp(h,cl(s.pull));
    st.forEach((o,i)=>{const d=nock.clone().sub(tips[i]),L=Math.max(d.length(),1e-4);o.position.copy(tips[i]);o.quaternion.setFromUnitVectors(dn,d.divideScalar(L));o.scale.set(1,L,1);});
    /* nocked: from the nock through the arrow rest, the vane in the plane of the limbs */
    const Z=U.rest.clone().sub(nock).normalize(),Y=new V(0,0,1).addScaledVector(Z,-Z.z).normalize(),X=new V().crossVectors(Y,Z);
    const Mn=bow.matrixWorld.clone().multiply(new M4().makeBasis(X,Y,Z).setPosition(nock)),Mh=sR.matrixWorld.clone().multiply(HAND);
    Mh.decompose(pa,qa,sc);Mn.decompose(pb,qb,sc);const w=cl(s.aw);pa.lerp(pb,w);qa.slerp(qb,w);
    const Lm=sR.matrixWorld.clone().invert().multiply(new M4().compose(pa,qa,new V(1,1,1)));Lm.decompose(ar.position,ar.quaternion,sc);const v=s.av>.5?1:.001;ar.scale.set(v,v,v);
    bow.updateMatrixWorld(true);ar.updateMatrixWorld(true);};}

/* gear tracks for every clip: the clip is played on the model frame by frame and the string and arrow are placed and recorded */
function skaGearTracks(root,clips){const mx=new THREE.AnimationMixer(root),post=root.userData.post,gp=root.userData.gearPose,objs=['string_top','string_bot','arrow_R'].map(n=>root.getObjectByName(n));
  for(const c of clips){const T=c.tracks[0].times,act=mx.clipAction(c);act.setLoop(THREE.LoopOnce);act.clampWhenFinished=true;act.play();const R=objs.map(()=>({p:[],q:[],s:[]}));
    for(const t of T){act.time=t;mx.update(0);post();root.updateMatrixWorld(true);gp(c.gearFn?c.gearFn(t):{pull:0,aw:0,av:0});
      objs.forEach((o,i)=>{R[i].p.push(...o.position.toArray());R[i].q.push(...o.quaternion.toArray());R[i].s.push(...o.scale.toArray());});}
    act.stop();objs.forEach((o,i)=>c.tracks.push(new THREE.VectorKeyframeTrack(o.name+'.position',T,R[i].p),new THREE.QuaternionKeyframeTrack(o.name+'.quaternion',T,R[i].q),new THREE.VectorKeyframeTrack(o.name+'.scale',T,R[i].s)));}
  mx.uncacheRoot(root);root.traverse(q=>{if(q.userData.joint&&RIG_JOINTS.includes(q.name))q.quaternion.set(0,0,0,1);});root.getObjectByName('hips').position.set(0,VB.skeleton.hipH,0);gp({pull:0,aw:0,av:0});}

const SKA_CLIPS={};
function skaClips(B,root){if(SKA_CLIPS[B.key])return SKA_CLIPS[B.key];const D=Math.PI*2,S=Math.sin,C=Math.cos,D2R=Math.PI/180,V3=THREE.Vector3,Q=THREE.Quaternion,L=[];
  const headFix=(o,k=.85)=>{const h=o.h||[0,0,0],sp=o.sp||[0,0,0],ch=o.ch||[0,0,0];o.hd=[(o.hd?o.hd[0]:0)-(h[0]+sp[0]+ch[0])*.7,-(h[1]+sp[1]+ch[1])*k,-(h[2]+ch[2])*.8];return o;};
  /* ---- relaxed clips (arrow in the quiver): the bow hangs in the left hand, upper limb forward and up ---- */
  {const fk=legFK(B),dur=4;const pose=t=>{const p=D*t/dur,b=S(p),b2=S(2*p),sw=.012*S(p),hz=1.4*S(p);const o={h:[1,0,hz],sp:[1+.6*b2,0,-.5*hz],ch:[-2+1.2*b2,1.5*S(p+.8),-.4*hz],
      uL:[1.5*S(p+.5),0,5+1.2*b2],uR:[-1.5*S(p+.3),0,-3-1.2*b2],fL:[-14-2*b2,0,0],fR:[-12+2*b2,0,0],wL:[-40,-6,0],wR:[0,12,0],fist:[95,95]};
      for(const[sd,s]of[['L',1],['R',-1]]){const z=s*3.5-hz-Math.asin(sw/(B.thigh+B.shin))*180/Math.PI,th=-3+s*.8*b,kn=6-s*1.2*b;o['t'+sd]=[th-1,0,z];o['k'+sd]=[kn,0,0];o['a'+sd]=[-(th+kn),0,-(hz+z)];}
      headFix(o);o.hd[0]+=1.5*S(2*p+1);o.hd[1]+=6*S(p*.5+.6);const s=fk(o);o.pos=[sw/B.legS,(Math.max(-s.L,-s.R)-B.hipH)/B.legS,0];return o;};
    L.push(sampleClip('Idle',dur,pose,{loop:true,autoFeet:false,note:'Bow lowered at the side, breathing'},B));}
  {const dur=1.05,G={dur,duty:.6,apex:0,abd:1.5,circ:2.5,
      thigh:pcurve([[0,-25],[.12,-19],[.3,-4],[.5,14],[.6,9],[.72,-11],[.86,-28],[.95,-27]]),
      knee:pcurve([[0,3],[.12,15],[.3,5],[.45,7],[.6,36],[.72,60],[.85,30],[.95,4]]),
      foot:pcurve([[0,-14],[.07,-1],[.2,0],[.4,1],[.52,11],[.6,28],[.7,10],[.82,-6],[.93,-13]]),
      body(u){const yaw=C(D*(u-.97)),arm=C(D*(u-.99)),el=C(D*(u-1.05)),hz=3.5*S(D*(u+.1));
        return headFix({sway:.02*S(D*(u-.05)),h:[2,-6*yaw,hz],sp:[2.5,2*yaw,-.3*hz],ch:[-1+1.2*C(2*D*(u-.18)),7*yaw,-.5*hz],
          uL:[-2+14*arm,0,4],uR:[-2-19*arm,0,2*arm],fL:[-16-10*(.5-.5*el),0,0],fR:[-13-16*(.5+.5*el),0,0],wL:[-36,-6,0],wR:[-4*arm,8,0],fist:[95,95]});}};
    const fn=gaitPose(B,G),c=sampleClip('Walk',dur,t=>fn(t/dur),{loop:true,autoFeet:false,note:`Bow at the side, in place, ${fn.speed.toFixed(1)} m/s`},B);c.speed=fn.speed;L.push(c);}
  {const dur=.68,G={dur,duty:.3,apex:.035,abd:1,circ:3,
      thigh:pcurve([[0,-30],[.08,-16],[.2,6],[.3,22],[.4,18],[.55,-20],[.7,-52],[.82,-50],[.92,-38]]),
      knee:pcurve([[0,22],[.08,40],[.2,28],[.3,32],[.44,90],[.56,116],[.7,95],[.82,48],[.92,24]]),
      foot:pcurve([[0,2],[.06,0],[.16,2],[.24,18],[.32,42],[.45,55],[.6,34],[.76,2],[.88,-5]]),
      body(u){const yaw=C(D*(u-.92)),arm=C(D*(u-.9)),el=C(D*(u-.96)),hz=4.5*S(D*(u+.15));
        return headFix({sway:.012*S(D*(u+.07)),h:[6,-9*yaw,hz],sp:[8,3*yaw,-.3*hz],ch:[4+1.5*C(2*D*(u-.12)),11*yaw,-.5*hz],
          uL:[-10+24*arm,0,8],uR:[-10-36*arm,0,-6+4*arm],fL:[-62-12*(.5-.5*el),0,0],fR:[-72-20*(.5+.5*el),0,0],wL:[6,-6,0],wR:[-8,6,0],fist:[95,95]},.8);}};
    const fn=gaitPose(B,G),c=sampleClip('Run',dur,t=>fn(t/dur),{loop:true,autoFeet:false,note:`Bow carried upright, in place, ${fn.speed.toFixed(1)} m/s`},B);c.speed=fn.speed;L.push(c);}

  /* ---- IK clips: half turned, left side to the target ---- */
  const R=wrRig(B,false),dirA=a=>new V3(S(a[0]*D2R)*C(a[1]*D2R),S(a[1]*D2R),C(a[0]*D2R)*C(a[1]*D2R)),
    limbZ=(A,c)=>new V3(0,1,0).addScaledVector(A,-A.y).normalize().applyAxisAngle(A,c*D2R);
  const AST={HP:[0,-.08,0],h:[3,-40,0],sp:[3,-4,0],ch:[2,-12,0],nk:[0,0,0],hd:[4,0,0],FL:[.1,.18,-30,0,0],FR:[-.12,-.2,-70,0,0],
      G:[.1,1.02,.36],A:[-10,-28],dd:[.2],cant:[10],rh:[0],rq:[0],hR:[-.3,1,0],hD:[0,1,0],pR:[-.7,-.3,-.5],pL:[.8,-.5,-.1],pull:[1],aw:[1],av:[1],fist:[95,95]},
    AD=dirA(AST.A).toArray(),
    AIM=wrP(AST,{HP:[0,-.06,0],h:[0,-52,0],sp:[0,-6,0],ch:[-2,-26,0],hd:[4,0,-4],G:[-.12,1.4,.66],A:[0,0],dd:[.6],cant:[6],pR:[-.3,.3,-1],pL:[.8,-.3,.1]});
  /* elbow and blade-roll continuity, as in warriorClips */
  let EL=null,HR=null;
  const elbows=()=>{const e={};R.m.updateMatrixWorld(true);for(const sd of['L','R']){const Sh=R.J['upperArm_'+sd].getWorldPosition(new V3()),E=R.J['foreArm_'+sd].getWorldPosition(new V3()),W=R.J['hand_'+sd].getWorldPosition(new V3()),u=W.sub(Sh).normalize();
    E.sub(Sh);E.addScaledVector(u,-E.dot(u));if(E.lengthSq()>1e-6)e[sd]=E.normalize();}return e;};
  const roll=()=>{const hq=R.J.hand_R.getWorldQuaternion(new Q()),Dh=new V3(0,0,1).applyQuaternion(hq),yw=new V3(0,1,0).applyQuaternion(hq);return{D:Dh,A:yw.addScaledVector(Dh,-yw.dot(Dh)).negate().normalize()};};
  const carry=(H,Dv)=>{const A=H.A.clone().applyQuaternion(new Q().setFromUnitVectors(H.D,Dv));return A.addScaledVector(Dv,-A.dot(Dv)).normalize();};
  const solve=(p,cont,w=1)=>{let s=wrSolve(R,p);if(!cont)return s;let e=elbows(),h=roll();
    if(EL){const q=Object.assign({},p);let again=false;
      for(const sd of['L','R'])if(EL[sd]&&e[sd]&&e[sd].angleTo(EL[sd])>WR_JUMP){q['p'+sd]=new V3(...(p['p'+sd]||[sd==='L'?.6:-.6,-.6,-.5])).normalize().lerp(EL[sd],.85*w).normalize().toArray();again=true;}
      if(again){s=wrSolve(R,q);e=elbows();h=roll();}
      if(HR){const A=carry(HR,h.D),th=Math.atan2(new V3().crossVectors(A,h.A).dot(h.D),A.dot(h.A));const J=WR_JUMP/Math.max(w,1e-3);if(Math.abs(th)>J){q.eR=(Math.abs(th)>Math.PI/2&&w>=1?A:A.applyAxisAngle(h.D,Math.sign(th)*J)).toArray();s=wrSolve(R,q);e=elbows();h=roll();}}}
    EL=e;HR=h;return s;};
  /* aim terms -> grips: the right fist sits on the string (arrow height above the grip, dd behind it) unless it is sent elsewhere */
  const ik=(p,cont,w)=>{const A=dirA(p.A),Z=limbZ(A,p.cant[0]),cl=x=>Math.min(1,Math.max(0,x)),rh=cl(p.rh[0]),rq=cl(p.rq[0]);
    const Sp=new V3(...p.G).addScaledVector(Z,.075).addScaledVector(A,-p.dd[0]),Y=A.clone().negate(),X=new V3().crossVectors(Y,Z);
    const o=Object.assign({},p,{gL:p.G,dL:X.toArray(),gR:Sp.lerp(new V3(...p.hR),rh).toArray(),dR:Z.clone().lerp(new V3(...p.hD).normalize(),rq).normalize().toArray()});
    const s=solve(o,cont,w);
    /* bow hand: limbs along Z, string side towards the archer */
    R.m.updateMatrixWorld(true);const qd=new Q().setFromRotationMatrix(new THREE.Matrix4().makeBasis(X,Y,Z)),loc=R.J.foreArm_L.getWorldQuaternion(new Q()).invert().multiply(qd);
    const e=new THREE.Euler().setFromQuaternion(loc,'XYZ');s.wL=[e.x/D2R,e.y/D2R,e.z/D2R];return s;};
  const CC=(name,dur,fn,o)=>{EL=HR=null;const cont=!(o&&o.loop),c=sampleClip(name,dur,t=>ik(fn(t),cont,Math.min(1,(dur-t)/.25)),Object.assign({autoFeet:false},o),B);
    c.gearFn=t=>{const p=fn(t);return{pull:p.pull[0],aw:p.aw[0],av:p.av[0]};};L.push(c);return c;};
  const KC=(name,dur,keys,note,base=AST)=>{const f=wrKeys(keys.map(k=>[k[0],wrP(base,k[1]||{})]));return CC(name,dur,f,{note});};
  const bob=(o,dy)=>{o.G=[o.G[0],o.G[1]+dy,o.G[2]];return o;};
  const GAIT=(name,dur,G,note)=>{const fn=t=>{const u=t/dur,o=G.body(u),c2=C(D*(u-G.duty/2));
      o.HP=[G.sw*c2,G.y0-G.b*C(2*D*(u-G.duty/2)),G.zc||0];
      for(const[sd,off,x,yaw]of[['L',0,G.x,G.yaw[0]],['R',.5,-G.x,G.yaw[1]]]){const q=(((u+off)%1)+1)%1;let z,l,pt;
        if(q<G.duty){const v=q/G.duty;z=G.s*(1-2*v);l=0;pt=v<.15?-10*(1-v/.15):v>.7?G.toe*(v-.7)/.3:0;}
        else{const v=(q-G.duty)/(1-G.duty),sm=v*v*(3-2*v);z=-G.s+2*G.s*sm;l=G.lift*Math.sin(Math.PI*Math.pow(v,G.lp||1));pt=G.toe*(1-v)*(1-v)-12*v*v;}
        o['F'+sd]=[x,z+(G.zc||0),yaw,l,pt];}return o;};
    const sp=2*G.s*B.legS/(G.duty*dur),c=CC(name,dur,fn,{loop:true,note:`${note}, in place, ${sp.toFixed(1)} m/s`});c.speed=sp;};
  /* reload from the quiver, starting at t0 (s scales the timing): reach back, pull an arrow out, bring it to the string, nock it, take the string */
  const REL={pull:[0],aw:[0],av:[0]};
  const reload=(t0,s=1,dy=0,dp=0)=>{const g=y=>[.12,y+dy,.4],h=y=>[2+dp,y,0];return[
    [t0+.32*s,wrP(REL,{h:h(-34),ch:[0,-16,0],hd:[0,0,0],G:g(1.04),rh:[1],rq:[1],hR:[-.04,1.62+dy,-.22],hD:[.1,-1,.15],pR:[-.5,.8,.3]})],
    [t0+.36*s,wrP(REL,{h:h(-34),ch:[0,-16,0],hd:[0,0,0],G:g(1.04),rh:[1],rq:[1],hR:[-.04,1.62+dy,-.22],hD:[.1,-1,.15],pR:[-.5,.8,.3],av:[1]})],
    [t0+.6*s,wrP(REL,{h:h(-38),ch:[0,-14,0],G:g(1.03),rh:[1],rq:[1],hR:[-.28,1.74+dy,0],hD:[-.05,.1,1],pR:[-.7,.5,-.2],av:[1]})],
    [t0+.85*s,wrP(REL,{h:h(-40),G:g(1.02),dd:[.13],rh:[0],rq:[1],hD:AD,av:[1]})],
    [t0+.92*s,wrP(REL,{h:h(-40),G:g(1.02),dd:[.13],rh:[0],rq:[1],hD:AD,av:[1],aw:[1]})],
    [t0+1.02*s,{h:h(-40),G:g(1.02),dd:[.17]}],
    [t0+1.3*s,{}]];};
  /* release: the string snaps back, the arrow is gone, the drawing hand flies back past the ear */
  const shot=(t,P,s=1)=>[[t,P],[t+.03,wrP(P,{dd:[P.dd[0]+.06],pull:[0],av:[0]})],[t+.18*s,wrP(P,{dd:[P.dd[0]+.1],G:[P.G[0]+.02,P.G[1]-.03,P.G[2]-.02],pull:[0],av:[0]})]];
  const CRB=wrP(AST,{HP:[0,-.4,-.04],h:[20,-40,0],sp:[12,-4,0],ch:[8,-12,0],hd:[-6,0,0],FL:[.12,.24,-30,0,0],FR:[-.16,-.2,-70,0,12],G:[.1,.7,.38]});

  CC('Idle (war mode)',2.6,t=>{const p=D*t/2.6,b=S(p),b2=S(p+.6);return bob(wrP(AST,{HP:[0,-.08-.007*b,0],sp:[3+.8*b,-4,0],ch:[2+1.2*b,-12,0],hd:[4,3*S(p*.5),0]}),-.01*b2);},{loop:true,note:'Half turned, arrow nocked, bow low'});
  GAIT('Walk (war mode)',1.1,{duty:.62,s:.28,lift:.09,toe:24,x:.14,yaw:[-14,-30],y0:-.1,b:.012,sw:.015,
    body:u=>bob(wrP(AST,{h:[5,-24-4*C(D*u),2.5*S(D*u+.6)],sp:[6,-3,0],ch:[3,-12,0]}),.012*C(2*D*u))},'Arrow nocked, bow low, short steps');
  GAIT('Run (war mode)',.72,{duty:.36,s:.42,lift:.24,lp:.7,toe:34,x:.12,yaw:[-4,-10],y0:-.07,b:.028,sw:.012,
    body:u=>bob(wrP(AST,{h:[12,-14-6*C(D*u),3*S(D*(u+.1))],sp:[10,-3,0],ch:[4,-8,0],G:[.16,1.0,.3],dd:[.16]}),.02*C(2*D*(u-.1)))},'Arrow nocked, leaning in');
  CC('Crouch',3,t=>{const p=D*t/3,b=S(p);return bob(wrP(CRB,{HP:[0,-.4-.008*b,-.04],sp:[12+.8*b,-4,0],hd:[-6,4*S(p*.5),0]}),-.01*b);},{loop:true,note:'Low, arrow nocked'});
  GAIT('Crouch & move forward',1.3,{duty:.64,s:.2,lift:.08,toe:16,x:.17,yaw:[-14,-34],y0:-.37,b:.01,sw:.018,
    body:u=>bob(wrP(CRB,{h:[20,-26-4*C(D*u),2*S(D*(u+.1))]}),.01*C(2*D*u))},'Sneaking low, arrow nocked');
  CC('Aim (hold)',2.4,t=>{const p=D*t/2.4;return wrP(AIM,{G:[-.12,1.4+.004*S(3*p),.66],dd:[.6+.004*S(2*p)],hd:[4+.6*S(p),0,-4],ch:[-2+.6*S(p+1),-26,0]});},{loop:true,note:'Full draw, holding the aim'});
  KC('Shoot',2.5,[[0,{}],
    [.25,{HP:[0,-.07,0],h:[1,-48,0],sp:[1,-5,0],ch:[0,-20,0],G:[-.04,1.28,.56],A:[-4,-8],dd:[.34],cant:[8],pR:[-.4,.1,-.9]}],
    [.55,AIM],[.82,wrP(AIM,{dd:[.61],hd:[5,0,-4]})],...shot(.86,wrP(AIM,{dd:[.61],hd:[5,0,-4]})),...reload(1.1)],'Raises the bow while drawing, aims, looses, takes a new arrow from the quiver');
  KC('Quick shot',1.6,[[0,{}],
    [.22,wrP(AIM,{h:[1,-50,0],ch:[-1,-22,0],G:[-.1,1.36,.62],dd:[.5]})],...shot(.3,wrP(AIM,{h:[1,-50,0],ch:[-1,-22,0],G:[-.1,1.37,.63],dd:[.52]}),.7),...reload(.42,.85)],'Snap shot with a short draw, then reloads');
  {const UP=wrP(AIM,{HP:[0,-.07,-.02],h:[-2,-50,0],sp:[-6,-6,0],ch:[-10,-24,0],hd:[-16,0,-4],G:[-.12,1.74,.47],A:[0,40],dd:[.58],pL:[.8,-.4,0],pR:[-.3,-.2,-1]});
  KC('Shoot upward',2.7,[[0,{}],
    [.3,{HP:[0,-.07,0],h:[0,-48,0],sp:[-2,-5,0],ch:[-4,-20,0],G:[-.06,1.4,.52],A:[-4,16],dd:[.34],pR:[-.4,0,-.9]}],
    [.65,UP],[.95,wrP(UP,{dd:[.59],hd:[-17,0,-4]})],...shot(.99,wrP(UP,{dd:[.59],hd:[-17,0,-4]})),...reload(1.25)],'Volley: aims high, looses, reloads');}
  {const CA=wrP(AIM,{HP:[0,-.38,-.04],h:[18,-50,0],sp:[4,-6,0],ch:[-8,-24,0],hd:[-6,0,-4],FL:[.12,.26,-30,0,0],FR:[-.16,-.22,-70,0,12],G:[-.12,1.04,.68],A:[0,0],dd:[.58]});
  KC('Crouching shot',2.5,[[0,{}],
    [.28,wrP(CRB,{h:[18,-46,0],ch:[0,-20,0],G:[-.04,.92,.58],A:[-4,-8],dd:[.34]})],
    [.58,CA],[.84,wrP(CA,{dd:[.59]})],...shot(.88,wrP(CA,{dd:[.59]})),
    ...reload(1.12,1,-.32,18)],'Shoots from the crouch, reloads low',CRB);}
  /* melee: lets go of the string (the arrow stays in the right fist), sweeps the bow across at head height */
  {const LET={rq:[1],hD:AD};const FREE={rh:[1],rq:[1],aw:[0],pull:[0],hR:[-.34,1.0,.12],hD:[0,-.2,1],pR:[-.8,-.4,-.3]};
  KC('Bow bash',1.5,[[0,{}],[.1,LET],[.16,wrP(LET,{aw:[0],pull:[0]})],
    [.36,wrP(FREE,{HP:[0,-.1,-.04],h:[2,-58,0],sp:[2,-6,0],ch:[0,-28,0],G:[.3,1.42,.0],A:[70,0],cant:[80],pL:[.7,.3,-.5]})],
    [.5,wrP(FREE,{HP:[0,-.12,.1],h:[6,-14,0],sp:[6,0,0],ch:[4,6,0],FL:[.1,.4,-24,0,0],G:[0,1.45,.62],A:[-30,0],cant:[84],pL:[.6,.6,-.4],hR:[-.38,1.0,.2]})],
    [.62,wrP(FREE,{HP:[0,-.12,.1],h:[6,-6,0],sp:[6,2,0],ch:[4,14,0],FL:[.1,.4,-24,0,0],G:[-.28,1.36,.44],A:[-80,0],cant:[84],pL:[.4,.8,-.4],hR:[-.38,1.0,.2]})],
    [.9,wrP(FREE,{HP:[0,-.09,.03],h:[4,-30,0],FL:[.1,.26,-28,.04,0],G:[.04,1.1,.4],A:[-20,-20],cant:[20],hR:[-.3,1.0,.1]})],
    [1.08,{dd:[.13],rh:[0],rq:[1],hD:AD,aw:[0],pull:[0]}],[1.14,{dd:[.13],rq:[1],hD:AD,pull:[0]}],[1.24,{dd:[.17]}],[1.5,{}]],'Lets go of the string and sweeps the bow across at head height');}
  KC('Kick',1.0,[[0,{}],
    [.2,{HP:[.08,-.07,.02],h:[-4,-14,0],sp:[-6,-4,0],ch:[-2,-14,0],FR:[-.1,.12,-12,.42,-15]}],
    [.34,{HP:[.09,-.04,-.02],h:[-14,-6,0],sp:[-10,-2,0],ch:[-6,-14,0],FR:[-.06,.72,-4,.72,-75],G:[.12,1.06,.3]}],
    [.44,{HP:[.09,-.04,-.03],h:[-14,-6,0],sp:[-10,-2,0],ch:[-6,-14,0],FR:[-.06,.74,-4,.72,-75],G:[.12,1.06,.3]}],
    [.58,{HP:[.08,-.07,.02],h:[-4,-14,0],sp:[-6,-4,0],ch:[-2,-14,0],FR:[-.1,.16,-12,.4,-15]}],
    [.76,{HP:[.03,-.09,0],FR:[-.14,-.12,-45,.1,0]}],[1.0,{}]],'Front push kick to keep the enemy at bow range');
  KC('Jump',1.3,[[0,{}],
    [.24,{HP:[0,-.3,-.02],h:[18,-36,0],sp:[16,-4,0],ch:[8,-12,0],G:[.12,.8,.34]}],
    [.38,{HP:[0,0,.02],h:[-2,-38,0],sp:[-2,-4,0],ch:[-4,-12,0],FL:[.1,.18,-30,0,30],FR:[-.12,-.2,-70,0,30],G:[.1,1.12,.36]}],
    [.6,{HP:[0,.34,0],h:[8,-38,0],sp:[6,-4,0],FL:[.1,.19,-30,.28,15],FR:[-.12,-.19,-70,.22,15],G:[.1,1.32,.36]}],
    [.82,{HP:[0,.02,0],h:[4,-38,0],FL:[.1,.18,-30,0,16],FR:[-.12,-.2,-70,0,16],G:[.1,1.06,.36]}],
    [.96,{HP:[0,-.27,-.02],h:[16,-38,0],sp:[14,-4,0],ch:[6,-12,0],G:[.12,.8,.36]}],[1.3,{}]],'Standing jump, about 0.3 m');
  KC('Hit 1',.75,[[0,{}],
    [.1,{HP:[0,-.1,-.07],h:[-6,-42,0],sp:[-12,-4,0],ch:[-16,-12,0],hd:[-14,0,0],G:[.08,1.12,.3]}],
    [.3,{HP:[0,-.09,-.04],h:[0,-40,0],sp:[-2,-4,0],ch:[-4,-12,0],hd:[-4,0,0],G:[.1,1.06,.34]}],[.75,{}]],'Blow to the chest, rocks back');
  KC('Hit 2',.8,[[0,{}],
    [.1,{HP:[.05,-.09,-.02],h:[2,-56,8],sp:[2,-10,10],ch:[-4,-24,12],hd:[-6,-18,14],G:[.2,1.0,.28]}],
    [.32,{HP:[.02,-.08,0],h:[3,-46,3],sp:[4,-6,4],ch:[0,-16,5],hd:[-2,-6,5],G:[.13,1.01,.33]}],[.8,{}]],'Blow from the left, twists and bends away');
  KC('Heavy hit',1.6,[[0,{}],
    [.1,{HP:[0,-.06,-.1],h:[-14,-44,0],sp:[-16,-4,0],ch:[-18,-12,0],hd:[-20,0,4],G:[.2,1.22,.2],A:[10,0]}],
    [.28,{HP:[0,-.1,-.25],h:[-8,-42,0],sp:[-8,-4,0],ch:[-10,-12,0],hd:[-8,0,0],FR:[-.17,-.48,-70,.09,0],G:[.16,1.12,.26],A:[0,-14]}],
    [.45,{HP:[0,-.18,-.38],h:[8,-42,0],sp:[10,-4,0],ch:[4,-12,0],hd:[4,0,0],FR:[-.18,-.62,-70,0,0],G:[.12,.96,.3]}],
    [.6,{HP:[0,-.14,-.4],FL:[.1,-.04,-30,.07,0],FR:[-.18,-.62,-70,0,0]}],
    [.75,{HP:[0,-.1,-.42],FL:[.1,-.2,-30,0,0],FR:[-.18,-.62,-70,0,0]}],
    [1.0,{HP:[0,-.09,-.25],FL:[.1,0,-30,.06,0],FR:[-.18,-.62,-70,0,0]}],
    [1.12,{HP:[0,-.08,-.18],FL:[.1,.18,-30,0,0],FR:[-.18,-.62,-70,0,0]}],
    [1.3,{HP:[0,-.08,-.08],FR:[-.15,-.42,-70,.06,0]}],[1.45,{}],[1.6,{}]],'Knocked back two steps, then steps in again');
  {const UPR={HP:[0,-.07,0],h:[-4,-20,0],sp:[-8,-2,0],ch:[-14,-6,0],nk:[-6,0,0],hd:[-22,0,0],G:[.5,1.7,.24],A:[30,60],cant:[0],rh:[1],rq:[1],aw:[0],pull:[0],hR:[-.55,1.72,.14],hD:[0,1,.1],pR:[-.9,-.2,-.3],pL:[.9,-.2,-.3]};
  KC('Roar',2.8,[[0,{}],[.1,{rq:[1],hD:AD}],[.16,{rq:[1],hD:AD,aw:[0],pull:[0]}],
    [.45,{HP:[0,-.16,-.02],h:[14,-30,0],sp:[16,-2,0],ch:[10,-8,0],hd:[6,0,0],G:[.2,.9,.34],rh:[1],rq:[1],aw:[0],pull:[0],hR:[-.36,.86,.24],hD:[0,-.3,1]}],
    [.85,UPR],[1.35,wrP(UPR,{hd:[-24,2,0],G:[.51,1.72,.22]})],[1.85,wrP(UPR,{hd:[-22,-2,0]})],
    [2.25,{dd:[.13],rh:[0],rq:[1],hD:AD,aw:[0],pull:[0]}],[2.32,{dd:[.13],rq:[1],hD:AD,pull:[0]}],[2.45,{dd:[.17]}],[2.8,{}]],'Bow and arrow flung up, skull thrown back');}
  skaGearTracks(root,L);return SKA_CLIPS[B.key]=L;}

ASSETS.push({id:'skeleton-archer',folder:'characters/enemies/undead',name:'Skeleton archer',kind:'character',variants:true,defaultSeed:1,groundR:1.6,build:(s,o)=>buildSkeleton(s,Object.assign({},o||{},{archer:true})),
  opts:[SK_OPT.bones,SK_OPT.armor,SK_OPT.cover(),SK_OPT.eyes],
  desc:'The skeleton (about 1.8 m) as an archer: a wooden bow in the left hand, a nocked arrow and a quiver of arrows on the back. Same bone tints, armour (up to eight areas, all of one type) and eye glow options as the skeleton. Clips: relaxed and war-mode Idle, Walk and Run, Crouch, Aim, Shoot, Quick shot, Shoot upward, Crouching shot (each reloads from the quiver), Bow bash, Kick, Jump, hits, Roar, plus Death (falls apart into a pile of bones) and Rise (reassembles).'});
