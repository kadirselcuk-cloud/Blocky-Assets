/* ======================= TWO-HEADED OGRE (boss): 3.8 m, a warrior head and a mage head, a club in the right hand and a staff in the left =======================
   Built by buildOgre (o.heads replaces its head) and then rescaled by OB_F (1.05): every joint offset and every box grows by OB_F, so the
   body is the ogre's at 1.05x in real metres and the 5 cm texture pixels stay the same (no group scale). Two necks: the warrior head
   (right, ogre size, wooden helmet with two horns) sits on the 'head' joint, the mage head (left, 0.74x, leaning out from the left shoulder, diadem with a ruby) on a plain group
   'headM' whose track follows the head track plus a per-clip offset (mh), so the two heads can look at each other.
   The knotted club is held in the right hand only; one of the ogre magi's staffs in the left (weapon_L, R.lprop in wrSolve).
   Both arms get their elbow from a search round the shoulder-wrist line that points the thumb side along the prop (no hand twist),
   keeps the elbow out of the body and, in one-shot clips, close to where it was the frame before. */
const OB_HINT=1,OB_CONT=2.5,OB_F=1.05,OB_HX=-.31,OB_MX=.45,OB_LB=OM_LB*OB_F;
VB.ogreBoss=Object.assign({},VB.ogre);
{const b=VB.ogreBoss;for(const k of['thigh','shin','ankle','hipOff','spine','chest','neck','headY','shW','ua','fa','g','hipW','hand'])b[k]=VB.ogre[k]*OB_F;
  b.key='ogreBoss';b.hipH=b.thigh+b.shin+b.ankle+b.hipOff;b.legS=(b.thigh+b.shin)/.84;b.tS=(b.spine+b.chest)/.3;b.cS=b.neck/.22;}
/* staff in the left hand: its +y along the thumb side, its +z (skull face, hooks) out of the back of the hand */
const OB_BASIS_L=()=>new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(new THREE.Vector3(0,1,0),new THREE.Vector3(0,0,1),new THREE.Vector3(1,0,0)));
/* every offset and every box times f (boxes are rebuilt, so the texture pixels keep their size) */
function obRescale(root,f){const ms=[];root.traverse(q=>{if(q===root)return;q.position.multiplyScalar(f);if(q.isMesh)ms.push(q);});
  for(const q of ms){const p=q.geometry.parameters;if(!p||p.width===undefined)continue;q.geometry.dispose();q.geometry=box(p.width*f,p.height*f,p.depth*f,q.material,{s:.8,ox:0,oy:0,oz:0}).geometry;}}

function buildOgreBoss(seed,o={}){const r=mulberry32(((seed*2654435761)>>>0)^0x2b05),pick=a=>a[Math.floor(r()*a.length)];
  const kind=o.staff&&o.staff!=='random'?o.staff:pick(Object.keys(OM_STAFF)),hornC=pick([['#d6ccb2','ivory'],['#ab9d81','yellowed'],['#877e71','grey']]),hairC=pick(['#1d1b19','#372b22','#615e59','#93918a']);
  const heads=({head,neck,skin,skinD,skinM,skinX,eyeM,dark,ivory,ir,warts})=>{
    const wood=bm('#68503a','leather'),woodD=bm('#4c3e2e','leather'),horn=bm(hornC[0],'plain'),hornD=bm('#'+new THREE.Color(hornC[0]).multiplyScalar(.55).getHexString(),'plain'),
      gold=bm('#a78e5c','plain'),goldD=bm('#816d47','plain'),ruby=wrGlow('#e49d94','#c9524d',1.2,pxTex('plain')),hairM=bm(hairC,'hair');
    /* the main neck under the warrior head, a little right of the middle; the mage head grows out of the left shoulder on a
       thinner neck of its own, leaning out (a second, smaller head grown later) */
    bx(neck,1.1,.24,.58,skin,.08,-.04,.08);bx(neck,.6,.34,.56,skin,OB_HX,.06,.1);
    head.position.x=OB_HX;const mb=new THREE.Group();mb.name='headM_base';mb.position.set(OB_MX,head.position.y+.08,-.02);mb.rotation.set(0,.16,-.3);neck.add(mb);
    bx(mb,.38,.3,.38,skin,0,-.04,.12);const hm=new THREE.Group();hm.name='headM';mb.add(hm);
    /* warrior head (right), ogre size: the ogre's head with angry brows, big tusks and a scar over the eye; wooden helmet, two horns */
    {const k=1,hg=new THREE.Group();head.add(hg);hg.position.z=.12;const W=(w,h,d,m,x,y,z,rx,ry,rz)=>bx(hg,w*k,h*k,d*k,m,x*k,y*k,z*k,rx,ry,rz);
      W(.62,.5,.6,skin,0,.36,-.02);W(.72,.22,.62,skin,0,.1,.06);W(.56,.12,.44,skin,0,-.04,.06);W(.5,.03,.02,skinX,0,.213,.37);
      for(const s of[-1,1]){W(.36,.1,.13,skinM,s*.16,.455,.3,0,0,s*.2);W(.09,.06,.02,eyeM,s*.14,.38,.285);W(.035,.05,.022,dark,s*.13,.38,.287);
        W(.08,.17,.08,ivory,s*.23,.285,.33);W(.055,.055,.055,ivory,s*.225,.395,.33);W(.03,.012,.012,dark,s*.06,.235,.4);
        W(.1,.18,.12,skin,s*.36,.37,-.02);W(.06,.12,.02,skinX,s*.37,.36,.04);W(.07,.07,.1,skin,s*.42,.43,-.04,0,0,-s*.3);}
      for(const x of[-.1,0,.1])W(.05,.04,.04,ivory,x,.225,.33);
      W(.2,.14,.12,skin,0,.3,.33);W(.26,.07,.1,skinD,0,.25,.35);W(.03,.22,.012,skinX,.15,.38,.297,0,0,.3);
      if(warts){W(.04,.04,.03,skinD,-.2,.3,.29);W(.03,.03,.03,skinD,.12,.06,.37);}
      /* helmet: a shell of wooden staves on the skull, an iron rim with rivets, a stepped crown and an iron knob */
      W(.68,.17,.66,wood,0,.565,-.02);W(.71,.06,.69,ir,0,.5,-.02);W(.6,.07,.58,wood,0,.68,-.02);W(.46,.06,.44,wood,0,.74,-.02);W(.07,.04,.6,ir,0,.785,-.02);for(const s of[-1,1])W(.012,.08,.5,woodD,s*.231,.74,-.02);
      for(const x of[-.2,.2])W(.025,.15,.012,woodD,x,.575,.315);for(const s of[-1,1])for(const z of[-.2,.14])W(.012,.15,.025,woodD,s*.343,.575,z);
      for(const x of[-.26,-.09,.09,.26])W(.035,.035,.02,ir,x,.5,.34);
      /* horns: out of a wooden boss on each side, sweeping outwards and up */
      for(const s of[-1,1]){W(.06,.18,.18,woodD,s*.37,.6,-.02);W(.2,.14,.14,horn,s*.47,.64,-.02,0,0,s*.4);W(.17,.12,.12,horn,s*.59,.71,-.02,0,0,s*.7);
        W(.1,.12,.1,horn,s*.66,.79,-.02,0,0,s*.3);W(.06,.07,.06,hornD,s*.68,.865,-.02);}}
    /* mage head (left): narrower jaw, hooked nose, small tusks, heavy lids, long ears with gold rings, hair down the back; gold diadem with a ruby */
    {const k=.74,hg=new THREE.Group();hm.add(hg);hg.position.z=.12;const M=(w,h,d,m,x,y,z,rx,ry,rz)=>bx(hg,w*k,h*k,d*k,m,x*k,y*k,z*k,rx,ry,rz);
      M(.58,.52,.56,skin,0,.37,-.02);M(.62,.2,.56,skin,0,.11,.05);M(.42,.1,.38,skin,0,-.02,.06);M(.58,.07,.1,skinM,0,.47,.27);M(.42,.025,.02,skinX,0,.205,.335);
      for(const s of[-1,1]){M(.08,.05,.02,eyeM,s*.13,.4,.265);M(.03,.04,.022,dark,s*.12,.4,.267);M(.1,.025,.03,skinD,s*.13,.43,.27);
        M(.05,.09,.05,ivory,s*.18,.245,.31);M(.08,.16,.1,skin,s*.32,.37,-.03);M(.07,.09,.08,skin,s*.38,.3,-.05,0,0,s*.5);
        M(.025,.08,.025,gold,s*.34,.21,-.03);M(.07,.025,.025,gold,s*.34,.16,-.03);
        M(.03,.07,.5,gold,s*.302,.555,-.04);}
      M(.14,.16,.12,skin,0,.31,.31);M(.1,.07,.1,skinD,0,.24,.34);
      if(warts)M(.035,.035,.03,skinD,-.17,.12,.33);
      M(.6,.46,.07,hairM,0,.34,-.33);M(.5,.12,.06,hairM,0,.56,-.3);for(const[x,L]of[[-.2,.14],[0,.2],[.2,.12]])M(.16,L,.06,hairM,x,.11-L/2+.02,-.33);
      M(.6,.07,.03,gold,0,.555,.275);M(.16,.16,.03,gold,0,.62,.285,0,0,Math.PI/4);M(.09,.09,.04,ruby,0,.62,.296,0,0,Math.PI/4);
      for(const s of[-1,1])M(.04,.04,.03,goldD,s*.17,.555,.29,0,0,Math.PI/4);}};
  const root=buildOgre(seed,{skin:o.skin,mantle:o.mantle,weapon:'club',heads,noClips:true,bare:o.bare});
  /* warrior side: an iron pauldron on the right shoulder; mage side: a gold arm ring and a bead bracelet on the left */
  const ir=vm('iron'),gold=bm('#a78e5c','plain'),uaR=root.getObjectByName('upperArm_R'),uaL=root.getObjectByName('upperArm_L'),faL=root.getObjectByName('foreArm_L');
  bx(uaR,.62,.08,.6,ir,-.02,.25,0);bx(uaR,.08,.3,.6,ir,-.3,.12,0,0,0,-.2);for(const z of[-.2,0,.2])bx(uaR,.03,.04,.04,bm('#565350','plain'),-.345,.18,z);
  bx(uaL,.47,.06,.47,gold,0,-.42,0);for(const z of[-.12,.12])bx(faL,.43,.06,.43,z<0?bm('#292421','plain'):bm('#d9d1b9','plain'),0,-.32+z*.2,0);
  /* staff in the left hand */
  const wl=new THREE.Group();wl.name='weapon_L';root.getObjectByName('socket_L').add(wl);const st=omStaff(kind);st.quaternion.copy(OB_BASIS_L());wl.add(st);
  obRescale(root,OB_F);
  const post=root.userData.post,D2=Math.PI/180,Jn=n=>root.getObjectByName(n);
  root.userData.post=()=>{post();if(Math.abs(wl.quaternion.w)<.9999||wl.position.lengthSq()>1e-6)return;Jn('fingers_L').rotation.set(0,0,-95*D2);Jn('fingerTips_L').rotation.set(0,0,-90*D2);Jn('thumb_L').rotation.set(14*D2,0,-33*D2);};
  if(o.bare)return root;
  if(!o.noClips)root.userData.clips=obClips(kind,root.userData.mantle);root.userData.ground=4.8;
  root.userData.variantText=root.userData.variantText.replace(/, (bald|a topknot|shaggy hair)/,'').replace(/; knotted club\.$/,
    `; wooden helmet with ${hornC[1]} horns, gold diadem with a ruby, iron pauldron, gold arm ring; knotted club and ${OM_STAFF[kind]}.`);
  return root;}

/* ---------- clips (keys in the ogre's metres, scaled by OB_F before solving) ---------- */
const OBCLIPS={};
/* IK rig: a bare boss with both props (fur mantle, so it covers every look). low(sd) = the lowest corner of that prop;
   pen(sd) = the deepest point of that prop inside the body (heads included; hands and forearms excepted) and the way out */
function obRig(kind){const B=VB.ogreBoss,m=buildOgreBoss(1,{staff:kind,mantle:'fur',bare:true}),J={},V=THREE.Vector3;m.traverse(q=>{if(q.userData.joint)J[q.name]=q;});
  const R={m,J,B,two:false,lprop:true,heelFade:.12},WG={R:m.getObjectByName('weapon_R'),L:m.getObjectByName('weapon_L')},W={R:[],L:[]},BD=[],v=new V(),inv=new THREE.Matrix4();
  const jointOf=q=>{let p=q.parent;while(p&&!p.userData.joint)p=p.parent;return p?p.name:'';},under=(q,w)=>{while(q){if(q===w)return true;q=q.parent;}return false;};
  const drop=[];m.traverse(q=>{if(!q.isMesh)return;const p=q.geometry.parameters;if(under(q,WG.R))W.R.push(q);else if(under(q,WG.L))W.L.push(q);
    else if(!/hand|finger|thumb|foreArm/.test(jointOf(q))&&p.width*p.height*p.depth>4e-4)BD.push(q);else drop.push(q);});
  for(const q of drop)q.parent.remove(q);
  const box=new THREE.Box3(),ctr=new V();for(const q of BD){const p=q.geometry.parameters;q.userData.rad=Math.hypot(p.width,p.height,p.depth)/2;}
  const corners=(q,f)=>{const p=q.geometry.parameters;for(let i=0;i<9;i++){if(i<8)v.set((i&1?.5:-.5)*p.width,(i&2?.5:-.5)*p.height,(i&4?.5:-.5)*p.depth);else v.set(0,0,0);f(v.applyMatrix4(q.matrixWorld));}};
  R.low=sd=>{m.updateMatrixWorld(true);let y=1e9;for(const q of W[sd])corners(q,c=>{if(c.y<y)y=c.y;});return y;};
  R.pen=sd=>{m.updateMatrixWorld(true);const P=[];box.makeEmpty();for(const q of W[sd])corners(q,c=>{P.push(c.clone());box.expandByPoint(c);});let best=0,out=null;
    for(const q of BD){ctr.setFromMatrixPosition(q.matrixWorld);const rd=q.userData.rad,r2=rd*rd;if(box.distanceToPoint(ctr)>rd)continue;const p=q.geometry.parameters;inv.copy(q.matrixWorld).invert();for(const c of P){if(c.distanceToSquared(ctr)>r2)continue;v.copy(c).applyMatrix4(inv);const d=Math.min(p.width/2-Math.abs(v.x),p.height/2-Math.abs(v.y),p.depth/2-Math.abs(v.z));
      if(d>best){best=d;out=c.clone().sub(new V().setFromMatrixPosition(q.matrixWorld));out.y*=.3;out.normalize();}}}
    return best>0?{d:best,n:out}:null;};
  return R;}

/* stances (ogre metres). Staff: T = foot [x,y,z] and G = grip [x,z], absolute; pl = how far it follows them (1 = planted).
   mh = the mage head's turn on top of the head's [x,y,z]°.
   Normal: hunched, club on the right shoulder angled out past the horn, staff planted at the left.
   War: low and wide, club held ready at the right hip pointing up, forward and out, staff planted ahead on the left */
const OB_N={HP:[0,-.08,0],h:[8,0,0],sp:[6,0,0],ch:[10,0,0],nk:[0,0,0],hd:[0,0,0],mh:[0,0,0],FL:[.36,.03,12,0,0],FR:[-.36,-.03,-12,0,0],
  gR:[-1.0,2.6,.75],dR:[-.3,.55,-.78],eR:[0,0,1],pR:[-.5,-.8,0],T:[1.3,.012,1.0],G:[1.2,.8],pl:[1],gL:[1.1,1.6,.6],dL:[0,1,0],eL:[0,0,1],pL:[.5,-.5,-.6],fist:[95,95]};
const OB_W=wrP(OB_N,{HP:[0,-.2,0],h:[12,-6,0],sp:[8,-2,0],ch:[6,-2,0],FL:[.44,.3,-8,0,0],FR:[-.44,-.25,-34,0,38],
  gR:[-1.5,1.75,.7],dR:[-.45,.65,.6],pR:[-.6,-.6,-.4],T:[1.45,.012,1.15],G:[1.3,.88],pL:[.6,-.6,-.4]});
function obClips(kind,mantle='fur'){const ck=kind+':'+mantle;if(OBCLIPS[ck])return OBCLIPS[ck];if(OBCLIPS[kind])return OBCLIPS[ck]=OBCLIPS[kind].concat(obDeaths(kind,mantle));const B=VB.ogreBoss,F=OB_F,D=Math.PI*2,S=Math.sin,C=Math.cos,L=[],R=obRig(kind),V=THREE.Vector3,k=B.legS,cl=x=>Math.min(1,Math.max(-1,x));
  /* ogre metres -> boss metres; then a planted staff: the grip sits on the line from the foot T, OB_LB along the staff */
  const scl=o=>{const q=Object.assign({},o);q.HP=o.HP.map(x=>x*F);for(const c of['FL','FR']){const a=o[c].slice();a[0]*=F;a[1]*=F;a[3]=(a[3]||0)*F;q[c]=a;}for(const c of['gR','gL','T','G'])q[c]=o[c].map(x=>x*F);return q;};
  const plant=o=>{const w=o.pl[0];if(w<=0)return o;const n=a=>{const l=Math.hypot(...a)||1;return a.map(x=>x/l);},T=o.T,G=o.G,hx=G[0]-T[0],hz=G[1]-T[2],hy=Math.sqrt(Math.max(1e-4,OB_LB*OB_LB-hx*hx-hz*hz));
    const pg=[G[0]-o.HP[0],T[1]+hy,G[1]-o.HP[2]],pd=[hx/OB_LB,hy/OB_LB,hz/OB_LB];o.gL=o.gL.map((x,i)=>x+(pg[i]-x)*w);o.dL=n(o.dL.map((x,i)=>x+(pd[i]-x)*w));return o;};
  /* elbow search round the shoulder-wrist line: the thumb side (the forearm's z, which faces away from the elbow) along the prop,
     the elbow not into the body, not straight up or forward; a little towards the keyed pole and, in one-shot clips, towards last frame's */
  let PV=null;
  const autoPole=(q,sd)=>{R.m.updateMatrixWorld(true);const s=sd==='L'?1:-1,Sh=R.J['upperArm_'+sd].getWorldPosition(new V()),Wp=R.J['hand_'+sd].getWorldPosition(new V()),d=new V(...q['d'+sd]).normalize(),a=B.ua,b=B.fa;
    const cq=R.J.chest.getWorldQuaternion(new THREE.Quaternion()),out=new V(s,0,0).applyQuaternion(cq),fwd=new V(0,0,1).applyQuaternion(cq);
    const Dv=Wp.clone().sub(Sh),Dl=Math.min(Math.max(Dv.length(),.05),(a+b)*.999),u=Dv.normalize(),al=Math.acos(cl((a*a+Dl*Dl-b*b)/(2*a*Dl)));
    const pA=new V(...q['p'+sd+'0']);pA.addScaledVector(u,-pA.dot(u)).normalize();const e2=new V().crossVectors(u,pA),pv=PV&&PV[sd]?new V(...PV[sd]):null;if(pv)pv.addScaledVector(u,-pv.dot(u));
    /* the upper arm's own roll (what the shoulder joint would twist) for each candidate, from the same frame wrSolve builds */
    const shI=R.J['shoulder_'+sd].getWorldQuaternion(new THREE.Quaternion()).invert(),M4=new THREE.Matrix4(),uq=new THREE.Quaternion();
    let best=null,bs=-1e9;for(let i=0;i<120;i++){const f=i/120*Math.PI*2,qq=pA.clone().multiplyScalar(Math.cos(f)).addScaledVector(e2,Math.sin(f));
      const E=Sh.clone().addScaledVector(u,a*Math.cos(al)).addScaledVector(qq,a*Math.sin(al)),Fv=Wp.clone().sub(E).normalize(),zf=qq.clone().addScaledVector(Fv,-qq.dot(Fv)).negate().normalize();
      const e=E.clone().sub(Sh).normalize(),Ye=e.clone().negate(),Ze=qq.clone().addScaledVector(e,-qq.dot(e)).normalize().negate();uq.setFromRotationMatrix(M4.makeBasis(new V().crossVectors(Ye,Ze),Ye,Ze)).premultiply(shI);
      let tw=Math.abs(2*Math.atan2(uq.y,uq.w))*180/Math.PI;if(tw>180)tw=360-tw;
      /* the hand's turn from the forearm to the prop (zf -> d, the rotation wrSolve makes): its roll about the forearm and its bend */
      const xf=new V().crossVectors(Fv,zf).negate(),dx=d.dot(xf),dy=-d.dot(Fv),dz=d.dot(zf),th=Math.acos(cl(dz)),ay=Math.abs(dx)/(Math.hypot(dx,dy)||1);
      const twH=2*Math.atan2(Math.sin(th/2)*ay,Math.cos(th/2))*180/Math.PI,bend=th*180/Math.PI;
      const sq=x=>x*x,sc=-1.5*sq(twH/100)-1.5*sq(tw/100)-1.5*sq(Math.max(0,bend-90)/60)-3*Math.max(0,-qq.dot(out))-1.5*Math.max(0,qq.y-.55)-1.5*Math.max(0,qq.dot(fwd)-.5)+OB_HINT*qq.dot(pA)+(pv?OB_CONT*qq.dot(pv):0);
      if(sc>bs){bs=sc;best=qq;}}
    q['p'+sd]=best.toArray();q['e'+sd]=null;};
  /* while a prop cuts into the body, move its grip out; the club is tilted up off the ground, a planted staff is put on it, a carried one lifted */
  const clear=(q,sd,s)=>{for(let i=0;i<10;i++){const p=R.pen(sd);if(!p||p.d<.005)break;const m=(p.d+.05)/k,g='g'+sd;q[g]=[q[g][0]+p.n.x*m,q[g][1]+p.n.y*m,q[g][2]+p.n.z*m];s=wrSolve(R,q);}return s;};
  const groundR=(q,s)=>{if(R.low('R')>=.005)return s;const d0=new V(...q.dR).normalize(),ax=new V().crossVectors(d0,new V(0,1,0));if(ax.lengthSq()<1e-6)return s;ax.normalize();
    let lo=0,hi=Math.PI*.6;for(let i=0;i<10;i++){const a=(lo+hi)/2;q.dR=d0.clone().applyAxisAngle(ax,a).toArray();wrSolve(R,q);if(R.low('R')>=.005)hi=a;else lo=a;}
    q.dR=d0.clone().applyAxisAngle(ax,hi).toArray();return wrSolve(R,q);};
  const groundL=(q,s)=>{const planted=q.pl[0]>.999,want=planted?.003:.005;for(let it=0;it<4;it++){const dy=want-R.low('L');if(planted?Math.abs(dy)<3e-4:dy<=0)break;q.gL=[q.gL[0],q.gL[1]+dy/k,q.gL[2]];s=wrSolve(R,q);}return s;};
  const solve=o0=>{const q=gbU(B,plant(scl(o0)));q.pR0=q.pR;q.pL0=q.pL;
    /* elbows, then props out of the body and off the ground; again, since both move the hands */
    let s=wrSolve(R,q);for(let it=0;it<3;it++){autoPole(q,'R');autoPole(q,'L');s=wrSolve(R,q);s=clear(q,'R',s);s=clear(q,'L',s);s=groundR(q,s);s=groundL(q,s);}
    PV={R:q.pR,L:q.pL};FX.push({R:R.low('R')<.03,L:R.low('L')<.03});return s;};
  /* the mage head: the head's track turned by mh */
  const mhTrack=(c,f)=>{const ht=c.tracks.find(t=>t.name==='head.quaternion'),T=ht.times,Q=[],q=new THREE.Quaternion(),e=new THREE.Euler(),D2=Math.PI/180;
    for(let i=0;i<T.length;i++){q.fromArray(ht.values,i*4);const m=f(T[i]);q.multiply(new THREE.Quaternion().setFromEuler(e.set(m[0]*D2,m[1]*D2,m[2]*D2)));Q.push(q.x,q.y,q.z,q.w);}
    c.tracks.push(new THREE.QuaternionKeyframeTrack('headM.quaternion',Array.from(T),Q));};
  /* frames are solved in time order, each elbow leaning towards the frame before; a loop is run through two cycles first, at the sampling
     steps, so its first frame follows on from its last */
  /* arm tracks smoothed lightly (two passes of 1-2-1), so a frame where the elbow search or the push out of the body steps a little
     never shows as a twitch; one-shot clips keep their first and last frames, loops wrap round. Frames where the staff is planted
     or the club rests on the ground (FX) stay as solved, so nothing is pulled into the ground */
  let FX=[];
  const SMJ=['upperArm_R','foreArm_R','hand_R','upperArm_L','foreArm_L','hand_L'];
  const smooth=c=>{const fx=FX;for(const t of c.tracks){const sd=t.name.includes('_R')?'R':'L';if(!SMJ.includes(t.name.replace('.quaternion',''))||!/quaternion/.test(t.name))continue;const v=t.values,n=v.length/4,loop=c.loopMode,Q=i=>new THREE.Quaternion().fromArray(v,i*4);
    for(let pass=0;pass<2;pass++){const P=[];for(let i=0;i<n;i++)P.push(Q(i));for(let i=0;i<n;i++){let a=i-1,b=i+1;if(loop){if(i===n-1)continue;a=(i-1+n-1)%(n-1);b=(i+1)%(n-1);}else if(a<0||b>=n)continue;
      if(fx[i]&&fx[i][sd])continue;const m=P[a].clone().slerp(P[b],.5),q=P[i].clone().slerp(m,.5);q.toArray(v,i*4);}if(loop)Q(0).toArray(v,(n-1)*4);}}};
  const CC=(name,dur,fn,o)=>{PV=null;if(o&&o.loop){const n=Math.max(2,Math.round(dur*(o.fps||30)));for(let k=0;k<2;k++)for(let i=0;i<n;i++)solve(fn(dur*i/n));}FX=[];const c=sampleClip(name,dur,t=>solve(fn(t)),Object.assign({autoFeet:false},o),B);smooth(c);mhTrack(c,t=>fn(t).mh);L.push(c);return c;};
  /* one-shot clips start and end on the war stance, so the viewer goes on to Idle (war mode) */
  const KC=(name,dur,keys,note,base=OB_W,fps)=>{const c=CC(name,dur,wrKeys(keys.map(q=>[q[0],wrP(base,q[1])])),{note,fps});c.next='Idle (war mode)';return c;};
  const lift=(o,dy)=>{o.gR=[o.gR[0],o.gR[1]+dy,o.gR[2]];o.gL=[o.gL[0],o.gL[1]+dy,o.gL[2]];return o;};
  /* in-place IK gait (ogre metres): feet slide back while planted and swing forward lifted; with st the staff is planted a little
     after the right heel, slides back with the ground and swings forward lifted */
  const GAIT=(name,dur,G,note)=>{const fn=t=>{const u=t/dur,o=G.body(u),c2=C(D*(u-G.duty/2));o.HP=[G.sw*c2,G.y0-G.b*C(2*D*(u-G.duty/2)),0];lift(o,o.HP[1]-G.y0);
      for(const[sd,off,x,yaw]of[['L',0,G.x,G.yaw[0]],['R',.5,-G.x,G.yaw[1]]]){const q=(((u+off)%1)+1)%1;let z,l,pt;
        if(q<G.duty){const v=q/G.duty;z=G.s*(1-2*v);l=0;pt=v<.15?-10*(1-v/.15):v>.7?G.toe*(v-.7)/.3:0;}
        else{const v=(q-G.duty)/(1-G.duty),sm=v*v*(3-2*v);z=-G.s+2*G.s*sm;l=G.lift*Math.sin(Math.PI*Math.pow(v,G.lp||1));pt=G.toe*(1-v)*(1-v)-12*v*v;}
        o['F'+sd]=[x,z,yaw,l,pt];}
      if(G.st){const s=G.st,q=(((u-s.off)%1)+1)%1,ss=G.s*s.duty/G.duty;let z,l=0;
        if(q<s.duty)z=ss*(1-2*q/s.duty);else{const v=(q-s.duty)/(1-s.duty),sm=v*v*(3-2*v);z=-ss+2*ss*sm;l=s.lift*Math.sin(Math.PI*v);}
        o.T=[s.x,.012+l,s.z+z];o.G=[s.gx,s.gz+.45*z];o.pl=[1];}
      return o;};
    const sp=2*G.s/(G.duty*dur)*F,c=CC(name,dur,fn,{loop:true,fps:G.fps,note:`${note}, in place, ${sp.toFixed(1)} m/s`});c.speed=sp;};

  /* ---- normal mode ---- */
  /* Idle: leaning on the staff, heavy breathing; the warrior head looks about, the two heads turn to each other and grumble */
  CC('Idle',6,t=>{const p=D*t/6,b=S(p),b2=S(2*p),ease=(a,z)=>{const x=Math.min(1,Math.max(0,(t-a)/(z-a)));return x*x*(3-2*x);},at=ease(2.4,3.0)*(1-ease(4.2,4.8)),nod=at*S(D*(t-3)*1.6);
    return wrP(OB_N,{HP:[.02*b,-.08-.012*b2,0],h:[8,0,1.2*b],sp:[6+1*b2,0,0],ch:[10+1.8*b2,0,0],gR:[-1.0,2.6-.012*b2,.75],
      hd:[2*S(2*p+1)+4*nod,(-28*S(p*2+.4))*(1-at)+16*at,0],mh:[-3*nod-4*at,(20*S(p*2+.4)+10*S(p*3))*(1-at)-40*at,2*at]});},{loop:true,note:'Leaning on the staff, breathing; the heads look about, turn to each other and grumble'});
  GAIT('Walk',1.6,{duty:.64,s:.42,lift:.16,toe:18,x:.38,yaw:[12,-12],y0:-.1,b:.03,sw:.07,st:{off:.54,duty:.55,lift:.16,x:1.3,z:1.0,gx:1.2,gz:.8},
    body:u=>{const yw=C(D*(u-.97));return wrP(OB_N,{h:[8,-6*yw,5*S(D*(u+.05))],sp:[6,2*yw,-2*S(D*(u+.05))],ch:[10+1.5*C(2*D*(u-.18)),3*yw,0],mh:[0,4*S(D*u),2*C(D*u)]});}},'Heavy steps, club on the shoulder, the staff planted with every right step');
  GAIT('Run',.85,{fps:60,duty:.42,s:.54,lift:.3,lp:.7,toe:28,x:.36,yaw:[8,-8],y0:-.1,b:.05,sw:.05,
    body:u=>{const yw=C(D*(u-.92)),a=C(D*(u-.9));return wrP(OB_N,{h:[18,-8*yw,5*S(D*(u+.1))],sp:[8,3*yw,0],ch:[8+2*C(2*D*(u-.12)),4*yw,0],pl:[0],
      gR:[-1.0,2.6,.85],gL:[1.0,1.6-.06*a,.55+.12*a],dL:[.05,.5,.86],mh:[-4,0,0]});}},'Lumbering run, club on the shoulder, staff carried pointing ahead');

  /* ---- war mode ---- */
  CC('Idle (war mode)',2.8,t=>{const p=D*t/2.8,b=S(p),b2=S(p+.6);return wrP(OB_W,{HP:[.015*S(p),-.2-.014*b,0],sp:[8+1.2*b,-2,0],ch:[6+1.8*b,-2,0],hd:[0,8*S(p),0],mh:[0,-18*S(p+1),0],gR:[-1.5,1.75-.02*b2,.7]});},{loop:true,note:'Low and wide, club cocked, leaning on the planted staff'});
  GAIT('Walk (war mode)',1.4,{duty:.64,s:.3,lift:.12,toe:20,x:.44,yaw:[-8,-34],y0:-.22,b:.02,sw:.04,st:{off:.54,duty:.55,lift:.14,x:1.45,z:1.15,gx:1.3,gz:.88},
    body:u=>lift(wrP(OB_W,{h:[12,-6-4*C(D*u),4*S(D*(u+.1))]}),.02*C(2*D*u))},'Advancing, club ready, the staff planted with every right step');
  GAIT('Run (war mode)',.8,{fps:60,duty:.4,s:.52,lift:.28,lp:.7,toe:30,x:.38,yaw:[-4,-14],y0:-.12,b:.05,sw:.03,
    body:u=>lift(wrP(OB_W,{h:[22,-8-5*C(D*u),4*S(D*(u+.1))],sp:[8,-2,0],ch:[4,-2,0],pl:[0],gR:[-1.3,1.8,.8],dR:[-.3,.75,.6],gL:[.95,1.75,.8],dL:[-.02,.45,.89]}),.03*C(2*D*(u-.1)))},'Charging, club held up, staff pointed ahead');

  /* Roar: crouches, rears up with the club and the staff held high, both heads thrown back, shakes them three times */
  {const up={pl:[0],HP:[0,-.12,0],h:[-2,0,0],sp:[-8,0,0],ch:[-14,0,0],nk:[-8,0,0],hd:[-24,-10,0],mh:[0,22,-6],gR:[-1.05,3.3,.3],dR:[-.25,.95,-.15],gL:[1.3,3.15,.45],dL:[.3,.95,.1]},
    sh=wrP(up,{gR:[-1.05,3.15,.4],gL:[1.3,3.0,.52],ch:[-12,0,0],hd:[-20,-12,0]});
  KC('Roar',3.2,[[0,{}],
    [.5,{pl:[0],HP:[0,-.34,0],h:[22,-6,0],sp:[14,-2,0],ch:[10,-2,0],hd:[12,0,0],mh:[0,0,0],gR:[-1.2,1.55,.85],dR:[-.3,.75,.5],gL:[1.15,1.55,.8],dL:[.1,.9,.3]}],
    [.7,{pl:[0],HP:[0,-.22,0],h:[10,-3,0],sp:[4,-1,0],ch:[-2,-1,0],hd:[-6,-5,0],mh:[0,10,-3],gR:[-1.2,2.55,.95],dR:[-.3,.9,.3],gL:[1.4,2.4,1.0],dL:[.3,.92,.25]}],
    [.9,up],[1.08,sh],[1.26,up],[1.44,sh],[1.62,up],[1.8,sh],[2.0,wrP(up,{hd:[-28,-6,0]})],[2.4,wrP(up,{hd:[-26,-14,0]})],
    [2.8,{pl:[.5],HP:[0,-.18,0],h:[8,-6,0],ch:[0,-2,0],mh:[0,6,0]}],[3.2,{}]],'Rears up with club and staff held high, both heads roaring, shakes them');}

  /* club attacks (right hand only); the staff is lifted off the ground and held upright at the left side; the mage head flinches away */
  /* SD: the staff held upright at the left side, turned with the body's yaw (gL is only relative to the hips' position) */
  const SL={pl:[0],gL:[1.15,1.75,.45],dL:[.05,1,.12],pL:[.6,-.6,-.4]},SD=o=>{const q=wrP(OB_W,wrP(SL,o)),yw=(q.h[1]+q.sp[1]+q.ch[1])*.7*Math.PI/180,r=v=>[v[0]*C(yw)+v[2]*S(yw),v[1],-v[0]*S(yw)+v[2]*C(yw)];q.gL=r(q.gL);q.dL=r(q.dL);q.pL=r(q.pL);return q;};
  KC('Attack 1',2.05,[[0,{}],
    [.3,SD({dL:[.3,.92,.25],gR:[-1.3,2.2,.35],dR:[-.7,.7,-.1]})],
    [.55,SD({dL:[.3,.92,.25],HP:[0,-.24,-.06],h:[10,-44,0],sp:[8,-8,0],ch:[4,-20,0],mh:[0,-10,0],gR:[-1.25,2.3,-.05],dR:[-.6,.55,-.6],pR:[-.9,.2,.3],gL:[1.4,1.6,.55]})],
    [.8,SD({dL:[.3,.92,.25],HP:[0,-.26,.1],h:[12,-12,0],sp:[8,-2,0],ch:[6,4,0],FL:[.44,.62,-10,.08,0],gR:[-.4,1.85,.9],dR:[-.8,.05,.6],pR:[-.4,-.8,-.4],gL:[1.4,1.6,.55]})],
    [.9,SD({dL:[.3,.92,.25],HP:[0,-.28,.16],h:[14,8,0],sp:[8,4,0],ch:[8,16,0],FL:[.44,.72,-8,0,0],mh:[-6,-24,8],gR:[.05,1.8,1.05],dR:[-.1,-.05,1],pR:[-.4,-.8,-.4],gL:[1.4,1.6,.55]})],
    [1.05,SD({dL:[.3,.92,.25],HP:[0,-.28,.16],h:[14,14,0],sp:[8,6,0],ch:[8,22,0],FL:[.44,.72,-8,0,0],mh:[-8,-30,10],gR:[.6,1.75,1.3],dR:[.7,-.05,.7],pR:[-.3,-.9,-.3],gL:[1.3,1.6,-.1]})],
    [1.26,SD({dL:[.3,.92,.25],HP:[0,-.27,.14],h:[14,16,0],sp:[8,7,0],ch:[8,26,0],FL:[.44,.72,-8,0,0],mh:[-8,-30,10],gR:[.8,1.6,1.15],dR:[.85,-.15,.5],pR:[-.3,-.9,-.3],gL:[1.3,1.6,-.1]})],
    [1.46,SD({dL:[.3,.92,.25],HP:[0,-.25,.1],h:[13,5,0],sp:[8,2,0],ch:[7,10,0],FL:[.44,.65,-10,.04,0],mh:[-4,-14,4],gR:[.3,1.75,1.3],dR:[.35,.25,.9],pR:[-.4,-.8,-.4],gL:[1.4,1.6,.55]})],
    [1.75,SD({dL:[.3,.92,.25],HP:[0,-.22,.05],h:[12,-6,0],ch:[6,-2,0],FL:[.44,.5,-10,.08,0],gR:[-1.2,1.85,.85],dR:[-.3,.75,.6],gL:[1.4,1.6,.55]})],
    [2.05,{}]],'Club in one hand: wide sweep right to left with a step in');
  KC('Attack 2',1.9,[[0,{}],
    [.35,SD({gR:[-1.4,2.55,.45],dR:[-.5,.85,-.15]})],
    [.7,SD({HP:[0,-.14,-.08],h:[0,-10,0],sp:[-8,-2,0],ch:[-10,-4,0],hd:[-10,0,0],mh:[4,-16,0],gR:[-.8,3.25,.1],dR:[-.1,.35,-.93],pR:[-.8,.2,-.3]})],
    [.88,SD({HP:[0,-.24,.1],h:[10,-8,0],sp:[6,0,0],ch:[4,0,0],FL:[.44,.6,-10,.08,0],mh:[0,-20,0],gR:[-.45,3.0,1.0],dR:[0,.95,.3],pR:[-.8,0,-.3]})],
    [1.08,SD({HP:[0,-.4,.2],h:[20,-6,0],sp:[10,0,0],ch:[4,0,0],FL:[.44,.7,-8,0,0],mh:[-6,-22,6],gR:[-.4,1.25,1.35],dR:[0,-.45,.9],pR:[-.7,-.6,-.3],gL:[1.2,1.65,.6]})],
    [1.36,SD({HP:[0,-.42,.2],h:[21,-6,0],sp:[11,0,0],ch:[4,0,0],FL:[.44,.7,-8,0,0],mh:[-6,-22,6],gR:[-.4,1.22,1.35],dR:[0,-.45,.9],pR:[-.7,-.6,-.3],gL:[1.2,1.63,.6]})],
    [1.62,SD({HP:[0,-.26,.08],h:[14,-8,0],sp:[8,-2,0],FL:[.44,.5,-10,.08,0],gR:[-1.1,1.75,1.0],dR:[-.25,.6,.75]})],
    [1.9,{}]],'Club swung up overhead and smashed straight down onto the ground');
  KC('Heavy attack',2.7,[[0,{}],
    [.4,SD({gR:[-1.4,2.5,.45],dR:[-.5,.85,-.15]})],
    [.95,SD({HP:[0,-.12,-.16],h:[-4,-26,0],sp:[-10,-6,0],ch:[-14,-12,0],hd:[-14,0,0],mh:[0,-10,0],FR:[-.44,-.25,-34,0,38],gR:[-.85,3.25,-.3],dR:[-.15,-.1,-.98],pR:[-.8,.3,-.3],gL:[1.0,1.9,.6]})],
    [1.2,SD({HP:[0,-.22,.15],h:[6,-14,0],sp:[0,-2,0],ch:[-6,-4,0],FL:[.44,.9,-10,.12,0],mh:[0,-20,0],gR:[-.45,3.15,.9],dR:[-.05,.98,.2],pR:[-.8,.1,-.3]})],
    [1.46,SD({HP:[0,-.55,.35],h:[26,-6,0],sp:[14,0,0],ch:[6,4,0],FL:[.44,1.0,-8,0,0],mh:[-8,-26,8],gR:[-.3,1.05,1.3],dR:[0,-.4,.92],pR:[-.7,-.6,-.3],gL:[1.2,1.6,.9]})],
    [1.85,SD({HP:[0,-.58,.35],h:[27,-6,0],sp:[15,0,0],ch:[6,4,0],FL:[.44,1.0,-8,0,0],mh:[-8,-26,8],gR:[-.3,1.02,1.3],dR:[0,-.4,.92],pR:[-.7,-.6,-.3],gL:[1.2,1.58,.9]})],
    [2.3,SD({HP:[0,-.34,.22],h:[18,-8,0],sp:[10,-2,0],ch:[6,0,0],FL:[.44,.8,-10,.08,0],gR:[-1.1,1.7,1.0],dR:[-.25,.55,.8]})],
    [2.7,{}]],'Club wound up behind the back, a lunging step and a ground-shaking slam');

  /* ---- spells (staff in the left hand; the club stays cocked); the mage head leads, the warrior head watches ---- */
  KC('Spell 1 (staff forward)',2.4,[[0,{}],
    [.35,{pl:[0],HP:[0,-.17,-.06],h:[8,14,0],sp:[4,4,0],ch:[-2,6,0],hd:[-4,-10,0],mh:[-8,6,0],gL:[1.0,1.7,.55],dL:[.05,1,-.12]}],
    [.6,{pl:[0],HP:[0,-.24,.18],h:[14,8,0],sp:[12,0,0],ch:[8,-4,0],nk:[6,0,0],hd:[-2,-14,0],mh:[-10,10,0],FR:[-.44,.55,-10,0,0],gL:[.75,1.8,1.4],dL:[-.06,.74,.67]}],
    [.95,{pl:[0],HP:[0,-.245,.19],h:[15,8,0],sp:[13,0,0],ch:[8,-4,0],nk:[6,0,0],hd:[-2,-16,0],mh:[-12,11,-2],FR:[-.44,.55,-10,0,0],gL:[.74,1.82,1.42],dL:[-.06,.72,.69]}],
    [1.3,{pl:[0],HP:[0,-.24,.185],h:[14,8,0],sp:[12,0,0],ch:[8,-4,0],nk:[6,0,0],hd:[-2,-12,0],mh:[-9,9,2],FR:[-.44,.55,-10,0,0],gL:[.75,1.79,1.41],dL:[-.05,.75,.66]}],
    [1.65,{pl:[0],HP:[0,-.245,.19],h:[15,8,0],sp:[13,0,0],ch:[8,-4,0],nk:[6,0,0],hd:[-2,-16,0],mh:[-12,11,-2],FR:[-.44,.55,-10,0,0],gL:[.74,1.81,1.42],dL:[-.06,.73,.68]}],
    [1.95,{pl:[.3],HP:[0,-.22,.06],h:[12,0,0],FR:[-.44,.1,-20,.06,0],gL:[1.15,1.75,1.1],dL:[.04,.97,.2]}],
    [2.4,{}]],'Draws the staff in, then thrusts it out at arm length with a step; the mage head chants at the target; holds');
  KC('Spell 2 (staff slam)',2.3,[[0,{}],
    [.45,{pl:[0],HP:[0,-.08,-.04],h:[2,6,0],sp:[-2,2,0],ch:[-8,2,0],hd:[-6,-8,0],mh:[-18,6,0],gL:[1.05,2.5,.8],dL:[.1,.97,-.22]}],
    [.62,{HP:[0,-.4,.04],h:[16,4,0],sp:[10,2,0],ch:[4,2,0],hd:[6,0,0],mh:[-10,0,0],gR:[-1.3,1.4,.75],T:[1.45,.012,1.15],G:[1.3,.88]}],
    [.75,{HP:[0,-.44,.04],h:[17,4,0],sp:[11,2,0],ch:[5,2,0],hd:[8,0,0],mh:[-8,0,0],gR:[-1.3,1.36,.75]}],
    [1.35,{HP:[0,-.4,.04],h:[16,4,0],sp:[10,2,0],ch:[4,2,0],hd:[4,4,0],mh:[-14,-4,0],gR:[-1.3,1.4,.75]}],
    [1.8,{HP:[0,-.26,0],h:[14,-2,0],mh:[-4,0,0],gR:[-1.3,1.55,.7]}],
    [2.3,{}]],'Lifts the staff high and slams its foot into the ground, crouching over it; holds',OB_W,60);
  {const hi={pl:[0],HP:[0,-.12,-.03],h:[2,4,0],sp:[-4,2,0],ch:[-10,2,0],nk:[-4,0,0],hd:[-6,-14,0],mh:[-24,14,0],gL:[.85,3.15,.55],dL:[-.08,.99,.06]},
    sh=(dy,a)=>wrP(hi,{gL:[.85,3.15+dy,.55],mh:[-26+a,14,a*.5]});
  KC('Spell 3 (staff raised)',3,[[0,{}],
    [.35,{pl:[0],HP:[0,-.16,-.02],h:[6,4,0],sp:[0,2,0],ch:[-4,2,0],hd:[-4,-6,0],mh:[-10,6,0],gL:[1.1,2.3,.7],dL:[0,1,0]}],
    [.65,hi],[.95,sh(.05,0)],[1.2,sh(0,3)],[1.45,sh(.05,0)],[1.7,sh(0,3)],[2.0,wrP(sh(.05,0),{hd:[-6,10,0]})],
    [2.5,{pl:[.4],HP:[0,-.18,0],h:[10,-2,0],sp:[6,-2,0],ch:[2,-2,0],hd:[-2,0,0],mh:[-6,4,0],gL:[1.2,1.95,.95],dL:[.02,1,-.05]}],
    [3,{}]],'Raises the staff high overhead; the mage head thrown back, chanting, the staff shaking');}

  /* Taunt: the heads squabble: the warrior head snaps at the mage head, it pulls back and snaps back, then both laugh at the enemy */
  KC('Taunt',3.2,[[0,{}],
    [.4,{HP:[0,-.12,0],h:[10,0,0],sp:[6,0,0],ch:[4,0,0],hd:[0,24,0],mh:[0,-46,0]}],
    [.6,{HP:[0,-.12,0],h:[10,0,0],sp:[6,0,0],ch:[4,0,0],hd:[10,28,4],mh:[-12,-36,-6]}],
    [.75,{HP:[0,-.12,0],h:[10,0,0],sp:[6,0,0],ch:[4,0,0],hd:[-2,22,0],mh:[4,-52,0]}],
    [.95,{HP:[0,-.12,0],h:[10,0,0],sp:[6,0,0],ch:[4,0,0],hd:[8,26,2],mh:[-10,-38,-4]}],
    [1.15,{HP:[0,-.12,0],h:[10,0,0],sp:[6,0,0],ch:[4,0,0],hd:[-4,14,0],mh:[12,-62,0]}],
    [1.4,{HP:[0,-.12,0],h:[10,0,0],sp:[6,0,0],ch:[4,0,0],hd:[-6,10,-4],mh:[16,-60,4]}],
    [1.75,{HP:[0,-.1,0],h:[6,0,0],sp:[0,0,0],ch:[-6,0,0],hd:[-20,-6,0],mh:[0,8,0]}],
    [2.0,{HP:[0,-.13,0],h:[6,0,0],sp:[0,0,0],ch:[-4,0,0],hd:[-12,-4,4],mh:[-6,10,-4]}],
    [2.25,{HP:[0,-.1,0],h:[6,0,0],sp:[0,0,0],ch:[-6,0,0],hd:[-22,-8,0],mh:[2,6,0]}],
    [2.5,{HP:[0,-.13,0],h:[6,0,0],sp:[0,0,0],ch:[-4,0,0],hd:[-12,-4,-4],mh:[-6,10,4]}],
    [3.2,{}]],'The heads squabble: the warrior head snaps at the mage head, it snaps back; then both laugh at the enemy');

  /* ---- hits: the staff stays planted ---- */
  KC('Hit',.9,[[0,{}],
    [.08,{HP:[0,-.22,-.08],h:[4,-6,0],sp:[-8,-2,0],ch:[-18,-2,0],nk:[-10,0,0],hd:[-24,0,0],mh:[-6,12,6],gR:[-1.5,1.95,.6]}],
    [.18,{HP:[0,-.23,-.09],h:[3,-6,0],sp:[-9,-2,0],ch:[-20,-2,0],nk:[-12,0,0],hd:[-26,0,3],mh:[-8,14,8],gR:[-1.5,1.97,.58]}],
    [.45,{HP:[0,-.21,-.03],h:[10,-6,0],sp:[4,-2,0],ch:[2,-2,0],hd:[-6,0,0],mh:[-2,4,0]}],
    [.9,{}]],'Blow to the faces: heads and shoulders snap back, then recover');
  KC('Heavy hit',1.9,[[0,{}],
    [.12,{HP:[0,-.16,-.12],h:[-6,-10,0],sp:[-14,-2,0],ch:[-16,-4,0],hd:[-20,0,4],mh:[-10,16,8],gR:[-1.25,1.9,.5],T:[1.45,.08,1.09],G:[1.3,.82]}],
    [.32,{HP:[0,-.2,-.22],h:[-2,-12,0],sp:[-8,-2,0],ch:[-10,-4,0],hd:[-10,0,0],mh:[-4,8,4],FR:[-.44,-.38,-32,.12,38],T:[1.45,.1,1.0],G:[1.3,.72]}],
    [.5,{HP:[0,-.28,-.3],h:[8,-10,0],sp:[4,-2,0],ch:[2,-4,0],FR:[-.44,-.5,-30,0,38],T:[1.45,.012,.9],G:[1.3,.64]}],
    [.7,{HP:[0,-.3,-.32],h:[10,-10,0],sp:[6,-2,0],ch:[4,-4,0],FL:[.44,.12,-9,.1,0],FR:[-.44,-.5,-30,0,38],T:[1.45,.012,.9],G:[1.3,.64]}],
    [.9,{HP:[0,-.29,-.3],h:[10,-10,0],sp:[6,-2,0],ch:[4,-4,0],FL:[.44,.02,-8,0,0],FR:[-.44,-.5,-30,0,38],T:[1.45,.012,.88],G:[1.3,.62]}],
    [1.25,{HP:[0,-.25,-.22],h:[10,-8,0],FL:[.44,.02,-8,0,0],FR:[-.44,-.5,-30,0,38],T:[1.45,.05,.98],G:[1.3,.72]}],
    [1.45,{HP:[0,-.22,-.12],FL:[.44,.2,-8,.1,0],FR:[-.44,-.5,-30,0,38],T:[1.45,.012,1.09],G:[1.3,.82]}],
    [1.6,{HP:[0,-.21,-.06],FR:[-.44,-.38,-32,.1,38]}],
    [1.9,{}]],'Knocked back: staggers a step back on the staff, then steps in again',OB_W,60);

  OBCLIPS[kind]=L.slice();
  /* ---- deaths: the goblin's falls on the boss's body (measured on a boss with this mantle, so the gut or the fur takes the fall);
     the staff is let go at once, the club as he falls; the mage head lolls aside */
  OBX[kind]={R,plant,scl,autoPole,mhTrack,setPV:v=>{PV=v;}};
  return OBCLIPS[ck]=L.concat(obDeaths(kind,mantle));}
const OBX={};
function obDeaths(kind,mantle){const B=VB.ogreBoss,{R,plant,scl,autoPole,mhTrack,setPV}=OBX[kind];
  const st=plant(scl(wrP(OB_W,{T:[1.45,.04,1.15]}))),sq=gbU(B,st);sq.pR0=sq.pR;sq.pL0=sq.pL;setPV(null);wrSolve(R,sq);for(let it=0;it<2;it++){autoPole(sq,'R');autoPole(sq,'L');wrSolve(R,sq);}
  for(const c of['pR','pL','eR','eL'])st[c]=sq[c];
  const deaths=goblinDeaths(B,'boss-'+kind+'-'+mantle,{fps:60,st,R,M:buildOgreBoss(1,{staff:kind,mantle,bare:true}),left:{'Death 1':[.01,[2.8,.3,-.4],0],'Death 2':[.01,[1.6,.3,.2],0]},lieZ:false});
  for(const c of deaths){const T=c.duration;mhTrack(c,t=>{const x=Math.min(1,t/T);return[10*x,-30*x,14*x];});}
  return deaths;}

ASSETS.push({id:'ogre-boss',folder:'characters/enemies/brutes',name:'Two-headed ogre',kind:'character',variants:true,defaultSeed:1,groundR:4.8,build:(s,o)=>buildOgreBoss(s,o||{}),
  opts:[ASSETS.find(a=>a.id==='ogre').opts[0],ASSETS.find(a=>a.id==='ogre').opts[2],{key:'staff',label:'Staff',choices:[['random','Random'],['gnarled','Gnarled crystal staff'],['skull','Horned skull staff'],['stone','Bound stone staff']],def:'random'}],
  desc:'Boss of the brutes: a two-headed ogre, about 3.8 m, on the ogre\'s body at 1.05x. The right head is a warrior with angry brows, big tusks and a scar, in a wooden helmet with two horns; the left head, smaller and leaning out from the left shoulder, is a mage with a hooked nose, long ears with gold rings and a gold diadem with a ruby. Iron pauldron on the right shoulder, gold arm ring on the left; skin and fur mantle as the ogre. Swings the knotted club in the right hand and casts with an ogre magi staff (gnarled crystal, horned skull or bound stone) in the left. Idle (the heads grumble at each other), walk and run; war-mode idle, walk and charge; roar, taunt (the heads squabble), three club attacks (sweep, overhead smash, heavy slam), three spells (staff thrust forward, slammed into the ground, raised overhead), hit, heavy hit and two deaths.'});
