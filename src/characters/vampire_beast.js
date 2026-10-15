/* ======================= VAMPIRE BEAST: the vampire lord's creature form (mini boss, phase 2) =======================
   After the vampire lord vanishes in smoke (phase 1, `vampire`), he comes back as this: a 2.2 m, gaunt, bald, grey creature whose
   arms are bat wings. Big pointed bat ears, a flat bat nose, glowing eyes in deep sockets, a wide red mouth full of small teeth with
   long fangs and a lower jaw that opens (g_jaw), ribs showing, spine knobs on a hunched back, long bird-like feet with four taloned
   toes that curl (toe groups tt0..3 and tu0..3). He never lands: every clip flies.
   Built from its own meshes on the villager's 25 joints inside a body group (vbody), so the warrior's IK (wrSolve) fits unchanged.
   Wings: each hand carries four long wing fingers (wf{k}_{L|R}, rotated about the palm normal: folded along the forearm or fanned
   open, keyed by the spread channel). The membrane is one flat skinned mesh per wing (vwing_L, vwing_R): its corners are bound
   to the wrist, the finger tips, the elbow, shoulder, chest, waist and hip, so its four panels stretch with the bones like a real
   wing (and export with the GLB's skin).
   Clip machinery: hand targets and elbow poles keyed in the chest's frame (tilted back by wp so wing beats stay vertical when the
   body leans into flight), wrists keyed, feet keyed in the hips' frame; all solved by wrSolve. Appear reuses the phase 1 smoke. */
VB.vbeast=Object.assign({},VB.male,{thigh:.52,shin:.5,ankle:.07,hipOff:.06,spine:.12,chest:.24,neck:.3,headY:.1,shW:.25,ua:.38,fa:.37,g:1.2,hipW:.085,sex:'male'});
{const b=VB.vbeast;b.key='vbeast';b.hipH=b.thigh+b.shin+b.ankle+b.hipOff;b.legS=(b.thigh+b.shin)/.84;b.tS=(b.spine+b.chest)/.3;b.cS=b.neck/.22;}
const VBB_SKIN={pale:['#bdb8ae','ashen grey'],ashen:['#a3a29e','grey'],grey:['#8f98a2','blue-grey']};
const VBB_WING={brown:['#6a5446','dusky brown'],dark:['#3c3438','charcoal'],red:['#5a2226','blood red']};
/* wing fingers, leading to trailing: length (m), bend of the outer half (°), angle from the forearm towards the elbow side when
   folded and when fully open (°) */
const VBB_F=[[1.3,0,150,0],[1.45,0,158,25],[1.25,0,166,52],[1.0,0,174,82]],VBB_WB=-.07;
/* screech rings: 3 octagons that fly out of the mouth */
const VBB_RING=3;

function buildVampireBeast(seed,o={}){const B=VB.vbeast,r=mulberry32(((seed*2654435761)>>>0)^0x3b9d),pick=a=>a[Math.floor(r()*a.length)],root=new THREE.Group();root.userData.lights=[];
  const skin0=pick(Object.keys(VBB_SKIN)),eye0=pick(['red','red','amber','violet']),wing0=pick(['brown','brown','dark','red']),notch=r()<.35,scar=r()<.4;
  const opt=(k,d)=>o[k]&&o[k]!=='random'?o[k]:d,skinK=opt('skin',skin0),eyeK=opt('eyes',eye0),wingK=opt('wings',wing0);
  const shade=(h,f)=>'#'+new THREE.Color(h).multiplyScalar(f).getHexString(),SK=VBB_SKIN[skinK][0],WC=VBB_WING[wingK][0];
  const skin=bm(SK,'skin'),skinD=bm(shade(SK,.78),'skin'),skinX=bm(shade(SK,.6),'skin'),dark=bm('#140c0e','plain'),claw=bm('#1e1816','plain'),teeth=bm('#e6dcc6','plain'),
    lip=bm('#96343a','plain'),gum=bm('#73282f','plain'),tongue=bm('#b4444c','plain'),earIn=bm('#'+new THREE.Color(SK).multiplyScalar(.85).lerp(new THREE.Color('#b07070'),.35).getHexString(),'skin'),memb=bm(WC,'plain');
  const ey=VL_EYES[eyeK],eyeM=wrGlow(ey[0],ey[1],1.8,pxTex('plain'));
  const vb=new THREE.Group();vb.name='vbody';root.add(vb);
  const hips=J('hips',vb,0,B.hipH,0),spine=J('spine',hips,0,B.spine,0),chest=J('chest',spine,0,B.chest,0),neck=J('neck',chest,0,B.neck,0),head=J('head',neck,0,B.headY,0);
  /* pelvis: bony hips, darker groin */
  bx(hips,.25,.16,.16,skin,0,-.02,0);bx(hips,.14,.08,.12,skinD,0,-.09,.01);for(const s of[-1,1])bx(hips,.05,.06,.1,skinD,s*.12,.04,.02);
  /* waist: sunken belly, a line down the middle */
  bx(spine,.19,.25,.13,skin,0,.07,-.005);bx(spine,.012,.18,.01,skinD,0,.07,.06);for(const s of[-1,1])bx(spine,.04,.2,.012,skinD,s*.075,.08,.058);
  /* chest: narrow ribcage with the ribs showing, sternum, collarbones, shoulder blades and spine knobs on the hunched back */
  bx(chest,.3,.28,.19,skin,0,.13,0);bx(chest,.016,.22,.01,skinD,0,.14,.1);
  for(const[y,w]of[[.03,.22],[.08,.25],[.13,.26],[.18,.25]])for(const s of[-1,1]){bx(chest,w/2-.03,.014,.012,skinD,s*(w/4+.01),y,.098);bx(chest,.012,.014,.12,skinD,s*.151,y,.01);}
  for(const s of[-1,1]){bx(chest,.13,.024,.03,skinD,s*.08,.265,.08,0,0,-s*.15);bx(chest,.1,.12,.04,skin,s*.08,.18,-.1);}
  bx(chest,.24,.16,.08,skin,0,.2,-.11);for(const[y,z]of[[.02,-.09],[.1,-.1],[.18,-.155],[.26,-.15]])bx(chest,.035,.03,.035,skinD,0,y,z);for(const y of[.0,.1,.2])bx(spine,.032,.03,.03,skinD,0,y,-.08);
  /* neck: long and thin with two tendons, leaning forward */
  bx(neck,.1,.2,.1,skin,0,-.02,0);for(const s of[-1,1])bx(neck,.022,.18,.02,skinD,s*.035,-.02,.045,-.2,0,0);bx(neck,.04,.04,.03,skinD,0,0,.055);
  /* head: big bald cranium, heavy brow, deep sockets with glowing eyes, a flat bat nose with an upturned leaf, gaunt cheeks,
     a wide red mouth with rows of small teeth and long fangs; the lower jaw (g_jaw) carries lower teeth, fangs and the tongue */
  bx(head,.26,.24,.27,skin,0,.2,-.01);bx(head,.22,.05,.23,skin,0,.33,-.015);bx(head,.2,.18,.05,skin,0,.21,-.16);bx(head,.16,.035,.16,skinD,0,.355,-.02);
  for(const s of[-1,1]){bx(head,.13,.04,.06,skinD,s*.062,.215,.12,0,0,s*.28);bx(head,.085,.065,.02,dark,s*.06,.168,.13);bx(head,.034,.026,.01,eyeM,s*.062,.166,.137);
    bx(head,.05,.06,.07,skinX,s*.112,.115,.085);bx(head,.03,.08,.08,skinD,s*.128,.15,.05);bx(head,.05,.01,.01,skinX,s*.085,.13,.131,0,0,-s*.5);}
  bx(head,.13,.08,.07,skin,0,.118,.15);bx(head,.075,.075,.02,skinD,0,.17,.188,-.5,0,0);bx(head,.1,.01,.01,skinX,0,.138,.186);for(const s of[-1,1])bx(head,.022,.016,.01,dark,s*.024,.108,.186);
  bx(head,.22,.06,.11,dark,0,.07,.08);bx(head,.23,.024,.035,lip,0,.086,.13);bx(head,.21,.02,.08,gum,0,.073,.1);for(const s of[-1,1])bx(head,.03,.032,.07,lip,s*.115,.072,.098);
  for(let i=0;i<9;i++){const x=(i-4)*.021;bx(head,.012,.024,.01,teeth,x,.055,.135-Math.abs(x)*.28);}for(const s of[-1,1])bx(head,.018,.075,.018,teeth,s*.07,.04,.112);
  if(scar)bx(head,.012,.12,.012,skinX,-.07,.27,.125,0,0,.3);
  for(const s of[-1,1]){const eg=new THREE.Group();eg.position.set(s*.12,.25,-.035);eg.rotation.set(-.25,s*.35,-s*.68);head.add(eg);
    for(const[w,h,y]of[[.16,.07,.03],[.135,.07,.1],[.1,.07,.17],[.064,.06,.235],[.03,.06,.29]]){bx(eg,w,h,.024,skin,0,y,0);bx(eg,w*.62,h,.008,earIn,0,y,.014);}
    for(const y of[.08,.16])bx(eg,.012,.07,.012,skinD,0,y,.02);
    if(notch&&s<0)bx(eg,.035,.04,.03,dark,-.05,.13,0);}
  const jw=new THREE.Group();jw.name='g_jaw';head.add(jw);jw.position.set(0,.075,.02);
  bx(jw,.22,.06,.14,skin,0,-.04,.05);bx(jw,.11,.04,.05,skin,0,-.07,.095);bx(jw,.22,.022,.03,lip,0,-.008,.115);bx(jw,.2,.016,.07,gum,0,-.012,.08);bx(jw,.06,.016,.12,tongue,0,-.008,.055);
  for(let i=0;i<8;i++){const x=(i-3.5)*.022;bx(jw,.012,.02,.01,teeth,x,.004,.112-Math.abs(x)*.28);}for(const s of[-1,1])bx(jw,.016,.045,.016,teeth,s*.062,.012,.1);
  /* arms: thin, knobby elbows; the hand is a short palm with a hooked thumb claw and the four wing fingers */
  for(const[sd,s]of[['L',1],['R',-1]]){const sh=J('shoulder_'+sd,chest,s*B.shW*.325,.165*B.cS,0),ua=J('upperArm_'+sd,sh,s*B.shW*.675,0,0),fa=J('foreArm_'+sd,ua,0,-B.ua,0),hd=J('hand_'+sd,fa,0,-B.fa,0);
    const fg=J('fingers_'+sd,hd,0,VBB_WB,0),ft=J('fingerTips_'+sd,fg,0,-.04,0),th=J('thumb_'+sd,hd,0,-.03,.03),so=J('socket_'+sd,hd,0,0,0);so.userData.socket=true;
    bx(ua,.11,.1,.1,skin,0,-.01,0);bx(ua,.075,B.ua*.92,.075,skin,0,-B.ua/2,0);bx(fa,.08,.07,.08,skinD,0,-.01,0);bx(fa,.065,B.fa*.95,.065,skin,0,-B.fa/2,0);bx(fa,.05,.05,.05,skinD,0,-B.fa+.02,0);
    bx(hd,.055,.09,.07,skin,0,-.035,0);
    const tg=new THREE.Group();tg.rotation.set(.5,0,0);th.add(tg);bx(tg,.03,.03,.08,skin,0,0,.035);bx(tg,.02,.05,.02,claw,0,-.012,.08,-.4,0,0);bx(tg,.014,.03,.014,claw,0,-.045,.075,.5,0,0);
    VBB_F.forEach(([L,bd,f0,f1],k)=>{const g=new THREE.Group();g.name=`wf${k}_${sd}`;g.position.set(0,VBB_WB,0);g.rotation.x=f1*Math.PI/180;hd.add(g);
      bx(g,.042-k*.004,L*.5,.042-k*.004,skin,0,-L*.25,0);bx(g,.046,.046,.046,skinD,0,-L*.5,0);
      const g2=new THREE.Group();g2.position.set(0,-L*.5,0);g2.rotation.x=bd*Math.PI/180;g.add(g2);bx(g2,.026,L*.5,.026,skin,0,-L*.25,0);
      if(k===0){bx(g2,.02,.06,.02,claw,0,-L*.5-.02,.01,.5,0,0);}else bx(g2,.014,.03,.014,claw,0,-L*.5-.01,0);});}
  /* legs: thin thighs, knobby knees; long bird-like feet: three front toes and one back toe, two joints each, black talons */
  for(const[sd,s]of[['L',1],['R',-1]]){const th=J('thigh_'+sd,hips,s*B.hipW,-(B.hipOff+.01),0),sn=J('shin_'+sd,th,0,-B.thigh,0),ft=J('foot_'+sd,sn,0,-B.shin,0);
    bx(th,.11,.12,.12,skin,0,-.03,0);bx(th,.095,B.thigh*.9,.1,skin,0,-B.thigh/2,0);
    bx(sn,.1,.09,.11,skinD,0,-.01,.01);bx(sn,.072,B.shin*.9,.08,skin,0,-B.shin/2,0);bx(sn,.05,.18,.03,skinD,0,-B.shin*.45,-.04);
    bx(ft,.08,.09,.09,skin,0,-.035,0);
    [[-.035,.12,.08,-.18],[0,.14,.09,0],[.035,.12,.08,.18],[0,.08,.06,Math.PI]].forEach(([x,l1,l2,yw],k)=>{const a=new THREE.Group();a.name=`tt${k}_${sd}`;a.position.set(x,-.06,k===3?-.03:.03);a.rotation.y=yw;ft.add(a);
      bx(a,.03,.03,l1,skin,0,0,l1/2);const b=new THREE.Group();b.name=`tu${k}_${sd}`;b.position.set(0,0,l1);a.add(b);bx(b,.025,.025,l2,skinD,0,0,l2/2);
      bx(b,.018,.03,.05,claw,0,-.01,l2+.015,.6,0,0);});}
  const joints=[];root.traverse(q=>{if(q.userData.joint&&!q.userData.socket)joints.push(q);});root.userData.joints=joints;
  if(o.bare)return root;
  /* wing membrane: 48 pieces per wing, each one unit wide and high; the clips set where each sits and how big it is */
  for(const sd of['L','R'])vbbWing(root,vb,sd,WC);
  /* smoke for Appear (the phase 1 smoke) and the screech rings (hidden unless a clip uses them) */
  const sm=new THREE.Group();sm.name='vsmoke';sm.scale.setScalar(.001);root.add(sm);
  VL_PUFF.forEach((P,j)=>{const g=new THREE.Group();g.name='vsmoke_'+j;g.scale.setScalar(.001);sm.add(g);const m1=vlSmokeMat(j%3===0?'#4a3a52':'#2e2a34',.78),m2=vlSmokeMat(j%4===1?'#5a1e2a':'#3e3846',.7);
    bx(g,1,1,1,m1,0,0,0,0,P.a,0);bx(g,.62,.62,.62,m2,.36*Math.sin(P.a*3),.28,.3*Math.cos(P.a*2),.3,P.a,0);});
  const rm=vlSmokeMat('#eba6a6',.6);
  for(let i=0;i<VBB_RING;i++){const g=new THREE.Group();g.name='vring_'+i;g.scale.setScalar(.001);root.add(g);for(let a=0;a<8;a++){const an=a*Math.PI/4;bx(g,.8,.07,.03,rm,Math.sin(an)*.97,Math.cos(an)*.97,0,0,0,-an);}}
  if(!o.noClips){root.userData.clips=vampireBeastClips();const mx=new THREE.AnimationMixer(root);mx.clipAction(root.userData.clips[0]).play();mx.update(0);}
  root.userData.ground=3.1;
  const cap=s=>s.charAt(0).toUpperCase()+s.slice(1);
  root.userData.variantText=`${cap(VBB_SKIN[skinK][1])} skin, ${ey[2]}, ${VBB_WING[wingK][1]} wings${notch?', a notched ear':''}${scar?', a scar on the brow':''}.`;
  return root;}

/* ---------- wing membrane ----------
   One flat mesh per wing, skinned to the rig (every corner follows one joint, the scallops between two fingers follow both):
   three panels between the four fingers with a scalloped trailing edge, one from the arm and the last finger back to the side of the
   chest, the waist and the hip (its trailing edge dips in at a point behind the forearm), and a small one in front of the elbow.
   Bound with the fingers fanned open and the arms hanging, so the panels stretch and fold with the bones. */
const vbbAngles=sp=>VBB_F.map(f=>(f[2]+(f[3]-f[2])*sp)*Math.PI/180);
const VBBW={};
function vbbWing(root,vb,sd,col){const V=THREE.Vector3,s=sd==='L'?1:-1,B=VB.vbeast,J={};root.traverse(q=>{if(q.name)J[q.name]=q;});root.updateMatrixWorld(true);
  const bones=[],bi=n=>{let i=bones.indexOf(J[n]);if(i<0){bones.push(J[n]);i=bones.length-1;}return i;},P=[],SI=[],SW=[],idx=[];
  const vert=(ws,p)=>{P.push(p.x,p.y,p.z);const w=ws.concat([[ws[0][0],0]]).slice(0,4);while(w.length<4)w.push([ws[0][0],0]);w.forEach(([n,wt])=>{SI.push(bi(n));SW.push(wt);});return P.length/3-1;};
  const at=(n,x,y,z)=>new V(x,y,z).applyMatrix4(J[n].matrixWorld),one=(n,x,y,z)=>vert([[n,1]],at(n,x,y,z));
  const W=one('hand_'+sd,0,VBB_WB,0),T=VBB_F.map((f,k)=>one('wf'+k+'_'+sd,0,-f[0],0)),w0=at('hand_'+sd,0,VBB_WB,0);
  const Sc=[0,1,2].map(k=>{const a=at('wf'+k+'_'+sd,0,-VBB_F[k][0],0),b=at('wf'+(k+1)+'_'+sd,0,-VBB_F[k+1][0],0),m=a.add(b).multiplyScalar(.5);m.lerp(w0,.2);
    return vert([['wf'+k+'_'+sd,.5],['wf'+(k+1)+'_'+sd,.5]],m);});
  const E=one('foreArm_'+sd,0,-.02,-.03),S=one('upperArm_'+sd,0,-.04,0),A=one('chest',s*.13,.12,-.03),Wa=one('spine',s*.09,.04,-.02),H=one('thigh_'+sd,s*.04,-.14,-.03),Pb=one('foreArm_'+sd,0,-B.fa*.55,-.62);
  const tri=(a,b,c)=>idx.push(a,b,c);
  for(let k=0;k<3;k++){tri(W,T[k],Sc[k]);tri(W,Sc[k],T[k+1]);}
  [[W,T[3]],[T[3],Pb],[Pb,H],[H,Wa],[Wa,A],[A,S]].forEach(([a,b])=>tri(E,a,b));tri(S,W,E);
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(P,3));g.setAttribute('skinIndex',new THREE.Uint16BufferAttribute(SI,4));g.setAttribute('skinWeight',new THREE.Float32BufferAttribute(SW,4));
  g.setIndex(idx);const g2=g.toNonIndexed();g2.computeVertexNormals();
  const uv=[];for(let i=0;i<g2.attributes.position.count;i++)uv.push(g2.attributes.position.getX(i)*1.5,g2.attributes.position.getY(i)*1.5+g2.attributes.position.getZ(i)*1.5);g2.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));
  const k=col,mat=VBBW[k]||(VBBW[k]=new THREE.MeshStandardMaterial({map:pxTex('skin'),color:new THREE.Color(col).convertSRGBToLinear(),roughness:.9,side:THREE.DoubleSide,flatShading:true,skinning:true}));
  const m=new THREE.SkinnedMesh(g2,mat);m.name='vwing_'+sd;m.frustumCulled=false;m.castShadow=m.receiveShadow=true;vb.add(m);m.bind(new THREE.Skeleton(bones));return m;}

/* ---------- clips ----------
   Pose channels (metres and degrees):
   alt hip height above standing, HP hip offset [x,0,z]; h/sp/ch/nk/hd body joints (wrSolve, the head keeps level as the body leans);
   FL/FR ankle [x,y,z] in the hips' frame and the foot's pitch (toe down +) relative to the hips; KN knee direction in the hips' frame;
   tl toe curl [L,R] (0 spread, 1 clenched); wp tilt of the wing frame (the chest's frame turned back about x);
   gL/gR wrist targets and pL/pR elbow poles in the wing frame; sL/sR wing spread (0 folded, 1 open); wl/wr wrist bend [x,y,z] (x turns
   the whole fan towards the elbow side); jw jaw; vb body [scale, spin°]; sm smoke phase; rg screech ring phase. */
const VBBCLIPS={};
const vbbM=v=>[-v[0],v[1],v[2]];
/* hover: upright, a little hunched, legs hanging with the toes curled down */
const VBB_H={alt:[.45],HP:[0,0,0],h:[8,0,0],sp:[4,0,0],ch:[6,0,0],nk:[8,0,0],hd:[-4,0,0],FL:[.1,-.9,.06,50],FR:[-.1,-.88,.02,46],KN:[0,0,1],tl:[.75,.75],wp:[0],
  gL:[.86,.28,.06],gR:[-.86,.28,.06],pL:[0,-.25,-1],pR:[0,-.25,-1],sL:[1],sR:[1],wl:[0,0,0],wr:[0,0,0],jw:[.05],vb:[1,0],sm:[0],rg:[0],pw:[1],cl:[0,0]};
/* war hover: higher, leaning in, knees drawn up with the talons open, mouth open */
const VBB_W=wrP(VBB_H,{alt:[.6],h:[14,0,0],sp:[6,0,0],ch:[6,0,0],nk:[10,0,0],hd:[-6,0,0],FL:[.13,-.74,.24,24],FR:[-.13,-.76,.2,20],KN:[0,.3,1],tl:[.15,.15],jw:[.3]});
/* one wing beat (left wing; the right mirrors): wrist path through the stroke in the wing frame, spread and a little feathering */
const VBB_BEAT={g:[[0,[.74,.56,.02]],[.25,[.88,.28,.06]],[.45,[.66,-.16,.24]],[.7,[.78,.32,-.02]],[.88,[.72,.5,0]]],s:[[0,.78],[.25,1],[.45,.95],[.7,.5],[.88,.62]],w:[[0,0],[.25,-4],[.45,-8],[.7,12],[.88,6]]};
const VBB_BC={x:pcurve(VBB_BEAT.g.map(k=>[k[0],k[1][0]])),y:pcurve(VBB_BEAT.g.map(k=>[k[0],k[1][1]])),z:pcurve(VBB_BEAT.g.map(k=>[k[0],k[1][2]])),s:pcurve(VBB_BEAT.s),w:pcurve(VBB_BEAT.w)};
/* the beat at phase u, amplitude a (1 = the full stroke above; less pulls the wrist towards the middle of the stroke) */
function vbbBeat(u,a=1,o={}){const m=[.7,.3,0],x=m[0]+(VBB_BC.x(u)-m[0])*a,y=m[1]+(VBB_BC.y(u)-m[1])*a,z=m[2]+(VBB_BC.z(u)-m[2])*a,s=Math.min(1,VBB_BC.s(u)),w=VBB_BC.w(u);
  const g=[x+(o.dx||0),y+(o.dy||0),z+(o.dz||0)];return{gL:g,gR:vbbM(g),sL:[s],sR:[s],wl:[0,w,0],wr:[0,w,0]};}
function vbbRig(){const B=VB.vbeast,m=buildVampireBeast(1,{bare:true}),J={};m.traverse(q=>{if(q.userData.joint||/^(wf|tt|tu)\d/.test(q.name))J[q.name]=q;});return{m,J,B,two:false};}

function vampireBeastClips(){if(VBBCLIPS.all)return VBBCLIPS.all;const B=VB.vbeast,D=Math.PI*2,R2=Math.PI/180,S=Math.sin,C=Math.cos,V=THREE.Vector3,Q=THREE.Quaternion,E3=THREE.Euler,L=[],R=vbbRig(),k=B.legS;
  const fk=B.ankle/.06,lw=.13*B.g,hs=.07*fk,zt=.03*B.g+lw*.8,zh=.03*B.g-lw*.8,low=p=>{const a=p*R2;return Math.min(-hs*C(a)-zt*S(a),-hs*C(a)-zh*S(a));};
  let MEM=null,PP=null;const M4=new THREE.Matrix4();
  const solve=p=>{const hq=new Q().setFromEuler(new E3(p.h[0]*R2,p.h[1]*R2,p.h[2]*R2)),hp=new V(p.HP[0],B.hipH+p.alt[0],p.HP[2]);
    const w={h:p.h,sp:p.sp,ch:p.ch,nk:p.nk,hd:p.hd,HP:[p.HP[0]/k,p.alt[0]/k,p.HP[2]/k],fist:[0,0]};
    for(const sd of['L','R']){const F=p['F'+sd],A=new V(F[0],F[1],F[2]).applyQuaternion(hq).add(hp),pit=p.h[0]+F[3],kn=new V(...p.KN);if(sd==='R')kn.x=-kn.x;
      w['F'+sd]=[A.x/k,A.z/k,p.h[1],(A.y+low(pit))/k,pit];w['n'+sd]=kn.applyQuaternion(hq).toArray();}
    for(const[sd,i]of[['L',0],['R',1]])R.J['shoulder_'+sd].rotation.set(p.cl[i]*R2,0,0);
    wrSolve(R,w);R.m.updateMatrixWorld(true);
    const cw=R.J.chest,fq=cw.getWorldQuaternion(new Q()).multiply(new Q().setFromAxisAngle(new V(1,0,0),-p.wp[0]*R2)),co=cw.getWorldPosition(new V());
    const nx={};
    for(const sd of['L','R']){const G=new V(...p['g'+sd]).applyQuaternion(fq).add(co);w['g'+sd]=[(G.x-p.HP[0])/k,G.y/k,(G.z-p.HP[2])/k];w['d'+sd]=[0,-1,0];
      /* elbow pole: the keyed one, unless it would roll the upper arm too far about itself; then the nearest one round the
         shoulder-to-wrist line that doesn't (scored like the vampire lord's arms, with frame-to-frame continuity) */
      const pref=new V(...p['p'+sd]).applyQuaternion(fq).normalize(),Sh=R.J['upperArm_'+sd].getWorldPosition(new V()),shq=R.J['shoulder_'+sd].getWorldQuaternion(new Q()).invert();
      const T=G.clone().sub(Sh),d=Math.min(Math.max(T.length(),.05),(B.ua+B.fa)*.999),u=T.normalize(),al=Math.acos(Math.min(1,Math.max(-1,(B.ua*B.ua+d*d-B.fa*B.fa)/(2*B.ua*d))));
      const b1=pref.clone().addScaledVector(u,-pref.dot(u));if(b1.lengthSq()<1e-6)b1.set(0,0,-1).addScaledVector(u,u.z);b1.normalize();const b2=new V().crossVectors(u,b1);
      let prev=PP&&PP[sd]?PP[sd].clone().addScaledVector(u,-PP[sd].dot(u)):null;if(prev&&prev.lengthSq()<.04)prev=null;if(prev)prev.normalize();let best=b1,bc=1e9;
      for(let i=0;i<96;i++){const f=i/96*D,pp=b1.clone().multiplyScalar(C(f)).addScaledVector(b2,S(f)),e=u.clone().multiplyScalar(C(al)).addScaledVector(pp,S(al));
        const Y=e.clone().negate(),Z=pp.clone().addScaledVector(e,-pp.dot(e)).normalize().negate(),lq=shq.clone().multiply(new Q().setFromRotationMatrix(M4.makeBasis(new V().crossVectors(Y,Z),Y,Z)));
        let rr=Math.abs(2*Math.atan2(lq.y,lq.w));if(rr>Math.PI)rr=D-rr;const c=2*(p.pw?p.pw[0]:1)*(1-C(f))+3*(rr/1.4)**4+(prev?1.5*(1-pp.dot(prev)):0);if(c<bc){bc=c;best=pp;}}
      nx[sd]=best;w['p'+sd]=best.toArray();}
    PP=nx;
    const s=wrSolve(R,w);s.wL=p.wl.slice();s.wR=[p.wr[0],-p.wr[1],-p.wr[2]];s.fist=[0,0];s.sL=[p.cl[0],0,0];s.sR=[p.cl[1],0,0];
    /* wrSolve keeps the toes from pointing up (planted feet); a kick or a dead bat's feet need it, so turn the foot on up */
    for(const sd of['L','R']){const pit=w['F'+sd][4];if(pit<0){const qa=new Q().setFromEuler(new E3(...s['a'+sd].map(v=>v*R2))).multiply(new Q().setFromAxisAngle(new V(1,0,0),pit*R2)),e=new E3().setFromQuaternion(qa,'XYZ');s['a'+sd]=[e.x/R2,e.y/R2,e.z/R2];}}
    for(const sd of['L','R'])R.J['hand_'+sd].rotation.set(s['w'+sd][0]*R2,s['w'+sd][1]*R2,s['w'+sd][2]*R2);R.m.updateMatrixWorld(true);
    MEM={aL:vbbAngles(p.sL[0]),aR:vbbAngles(p.sR[0])};return s;};
  /* extra tracks: wing fingers, toes, jaw, body group, smoke, rings, membrane */
  const extra=(c,fn,M,o)=>{const T=Array.from(c.tracks[0].times),q=new Q(),e=new E3(),Tr={},add=(n,v)=>{(Tr[n]||(Tr[n]=[])).push(...v);},pv=B.hipH+.5;
    T.forEach((t,i)=>{const p=fn(t),m=M[i];
      for(const sd of['L','R'])m['a'+sd].forEach((a,j)=>{q.setFromEuler(e.set(a,0,0));add(`wf${j}_${sd}.quaternion`,[q.x,q.y,q.z,q.w]);});
      for(const[sd,ci]of[['L',0],['R',1]])for(let j=0;j<4;j++){const cu=p.tl[ci],a1=(j===3?-1:1)*(-12+48*cu)*R2,a2=(j===3?-1:1)*(-6+62*cu)*R2;
        q.setFromEuler(e.set(a1,0,0));const q1=new Q().setFromEuler(new E3(0,[-.18,0,.18,Math.PI][j],0)).multiply(q);add(`tt${j}_${sd}.quaternion`,[q1.x,q1.y,q1.z,q1.w]);q.setFromEuler(e.set(a2,0,0));add(`tu${j}_${sd}.quaternion`,[q.x,q.y,q.z,q.w]);}
      q.setFromEuler(e.set(p.jw[0],0,0));add('g_jaw.quaternion',[q.x,q.y,q.z,q.w]);
      const sc=Math.max(.001,p.vb[0]);add('vbody.scale',[sc,sc,sc]);add('vbody.position',[0,pv*(1-sc),0]);q.setFromEuler(e.set(0,p.vb[1]*R2,0));add('vbody.quaternion',[q.x,q.y,q.z,q.w]);
      const sv=p.sm[0]>.002&&p.sm[0]<.998?1:.001;add('vsmoke.scale',[sv,sv,sv]);
      if(o.smoke)VL_PUFF.forEach((P,j)=>{const u=vlPuff(P,p.sm[0],.45);add(`vsmoke_${j}.position`,u.p);add(`vsmoke_${j}.scale`,[u.s,u.s,u.s]);});
      for(let j=0;j<VBB_RING;j++){const f=Math.min(1,Math.max(0,(p.rg[0]-j*.2)/.6)),on=f>0&&f<1,sz=on?.1+.75*f:.001,P=m.mouth.clone().addScaledVector(m.fw,.08+1.7*f);
        add(`vring_${j}.position`,P.toArray());add(`vring_${j}.scale`,[sz,sz,sz]);add(`vring_${j}.quaternion`,m.hq.toArray());}
      });
    for(const n in Tr)c.tracks.push(n.endsWith('quaternion')?new THREE.QuaternionKeyframeTrack(n,T,Tr[n]):new THREE.VectorKeyframeTrack(n,T,Tr[n]));};
  const CC=(name,dur,fn,o={})=>{PP=null;if(o.loop)solve(fn(dur*.97));const M=[],c=sampleClip(name,dur,t=>{const s=solve(fn(t)),hd=R.J.head,hq=hd.getWorldQuaternion(new Q());
      M.push(Object.assign({mouth:new V(0,.07,.16).applyMatrix4(hd.matrixWorld),fw:new V(0,0,1).applyQuaternion(hq),hq},MEM));return s;},Object.assign({autoFeet:false,fps:o.fps||30},o),B);
    extra(c,fn,M,o);if(o.next!==undefined){if(o.next)c.next=o.next;}else if(!o.loop)c.next='Idle (war mode)';if(o.hold)c.hold=true;if(o.speed)c.speed=o.speed;L.push(c);return c;};
  /* keys over a stance plus a wing beat running underneath: beat(t) gives the beat phase and amplitude (amplitude 0 = keys only) */
  const KC=(name,dur,keys,note,o={})=>{const f=wrKeys(keys.map(kk=>[kk[0],wrP(o.base||VBB_W,kk[1]||{})]));
    return CC(name,dur,t=>{let p=f(t);if(o.beat){const[u,a]=o.beat(t);if(a>0){const b=vbbBeat(u,1),q=Object.assign({},p);for(const c of['gL','gR'])q[c]=p[c].map((v,i)=>v+(b[c][i]-p[c][i])*a);
      for(const c of['sL','sR'])q[c]=[p[c][0]+(b[c][0]-p[c][0])*a];for(const c of['wl','wr'])q[c]=p[c].map((v,i)=>v+(b[c][i]-p[c][i])*a);p=q;}}return o.add?o.add(t,p):p;},Object.assign({note},o));};

  /* ---- flying ---- */
  CC('Idle',4.4,t=>{const u=t/1.1,ph=D*u,b=S(ph-1.2);return wrP(VBB_H,Object.assign(vbbBeat(u%1),{alt:[.45+.05*b],h:[8+2*S(ph),0,0],sp:[4+1.5*S(ph-.5),0,0],ch:[6+2*S(ph-.8),0,0],
    hd:[-4+3*S(ph-1.5),22*S(D*t/4.4+.5),0],FL:[.1,-.9,.06+.03*S(ph-2),50+6*S(ph-2)],FR:[-.1,-.88,.02+.03*S(ph-2.3),46+6*S(ph-2.3)],jw:[.05+.06*Math.max(0,S(D*t/4.4*2))]}));},
    {loop:true,note:'Hovers with slow, heavy wing beats, legs hanging with the talons curled, looking round'});
  CC('Fly',1.6,t=>{const u=t/.8,ph=D*u;return wrP(VBB_H,Object.assign(vbbBeat(u%1,1.1),{alt:[.6+.06*S(ph-1.2)],h:[72,0,0],sp:[5,0,0],ch:[5,0,0],nk:[-14,0,0],hd:[-22,0,0],wp:[82],
    FL:[.1,-.97,-.06,80],FR:[-.1,-.97,-.09,82],KN:[0,-.2,1],tl:[.85,.85]}));},{loop:true,speed:4,note:'Flies forward almost level, the wings beating hard, legs trailing behind, in place, 4 m/s'});
  CC('Idle (war mode)',2.4,t=>{const u=t/.8,ph=D*u,b=S(ph-1.2);return wrP(VBB_W,Object.assign(vbbBeat(u%1),{alt:[.6+.06*b],h:[14+2*S(ph),0,0],ch:[6+2*S(ph-.8),0,0],hd:[-6+3*S(ph-1.5),8*S(D*t/2.4),0],
    FL:[.13,-.74,.24+.03*S(ph-2),24],FR:[-.13,-.76,.2+.03*S(ph-2.4),20],tl:[.15+.15*Math.max(0,S(D*t/1.2)),.15+.15*Math.max(0,-S(D*t/1.2))],jw:[.3+.12*S(D*t/2.4)]}));},
    {loop:true,note:'Hovers higher with quick beats, leaning in, knees drawn up with the talons open, mouth open'});
  CC('Fly (war mode)',1.6,t=>{const u=t/.8,ph=D*u;return wrP(VBB_W,Object.assign(vbbBeat(u%1,1.05),{alt:[.6+.05*S(ph-1.2)],h:[40,0,0],sp:[6,0,0],ch:[4,0,0],hd:[-8,0,0],wp:[50],
    FL:[.13,-.7,.3,0],FR:[-.13,-.72,.26,-4],KN:[0,.5,1],tl:[.1,.1],jw:[.45]}));},{loop:true,speed:3,note:'Swoops forward leaning in, talons thrust ahead and open, mouth wide, in place, 3 m/s'});
  /* beat phase through a one-shot clip: piecewise linear over [time, phase] keys (whole numbers = wings at the top) and the
     beat's weight over [time, weight] keys */
  const lin=K=>t=>{if(t<=K[0][0])return K[0][1];for(let i=1;i<K.length;i++)if(t<=K[i][0]){const[a,b]=[K[i-1],K[i]];return a[1]+(b[1]-a[1])*(t-a[0])/(b[0]-a[0]);}return K[K.length-1][1];};
  const smo=K=>{const f=lin(K);return t=>{const v=f(t);return v*v*(3-2*v);};};
  const BT=(uK,aK)=>{const u=lin(uK),a=smo(aK);return t=>[((u(t)%1)+1)%1,a(t)];};
  const TOP={gL:[.66,.66,.02],gR:vbbM([.66,.66,.02]),sL:[.62],sR:[.62],wl:[0,0,0],wr:[0,0,0]},WIDE={gL:[.86,.36,.04],gR:vbbM([.86,.36,.04]),sL:[1],sR:[1],wl:[0,0,0],wr:[0,0,0]};
  const both=(o,F,tl)=>Object.assign(o,{FL:F,FR:[-F[0],F[1],F[2],F[3]]},tl!==undefined?{tl:[tl,tl]}:{});

  /* ---- appear ---- */
  /* Appear: the phase 1 smoke gathers out of nothing and he grows out of it spinning, wrapped in his wings like a hanging bat; the
     smoke clears, the wings burst open, he screeches (rings) and starts beating into the war hover */
  {const COC={alt:[.55],h:[4,0,0],sp:[2,0,0],ch:[4,0,0],nk:[10,0,0],hd:[4,0,0],FL:[.08,-.92,.04,55],FR:[-.08,-.92,.02,55],tl:[.9,.9],
      gL:[.12,.42,.34],gR:vbbM([.12,.42,.34]),pL:[.4,-1,.2],pR:[-.4,-1,.2],sL:[1],sR:[1],wl:[90,0,0],wr:[90,0,0],jw:[0]};
  const OPEN=both(wrP(WIDE,{alt:[.66],h:[-6,0,0],sp:[-6,0,0],ch:[-8,0,0],nk:[-12,0,0],hd:[-20,0,0],jw:[.95],KN:[0,.3,1]}),[.14,-.84,.14,36],0);
  KC('Appear',3.6,[[0,wrP(COC,{vb:[.001,-620],sm:[1]})],[.6,wrP(COC,{vb:[.001,-620],sm:[.55]})],[.85,wrP(COC,{vb:[.6,-200],sm:[.5]})],[1.3,wrP(COC,{sm:[.45]})],
    [1.9,wrP(COC,{sm:[.12]})],[2.15,wrP(OPEN,{sm:[.001],rg:[0]})],[2.95,wrP(OPEN,{alt:[.68],gL:[.84,.34,.08],gR:vbbM([.84,.34,.08]),rg:[1]})],[3.6,{rg:[1]}]],
    'Smoke gathers out of nothing and he grows out of it, spinning, wrapped in his wings; the smoke clears, the wings burst open and he screeches',
    {smoke:true,beat:BT([[0,0],[2.95,0],[3.6,1]],[[0,0],[2.95,0],[3.3,1]])});}

  /* ---- talon attacks ---- */
  /* Talon strike: draws the knees up under the chest with the wings high, then lunges through the air on a hard downstroke, both
     feet kicking forward with the talons spread; they clench and rake back down */
  KC('Talon strike',1.5,[[0,{}],
    [.35,both({alt:[.8],HP:[0,0,-.15],h:[-8,0,0],sp:[-6,0,0],ch:[0,0,0],hd:[4,0,0],KN:[0,.8,.6],jw:[.5]},[.13,-.42,.32,-10],0)],
    [.55,both({alt:[.66],HP:[0,0,.35],h:[-30,0,0],sp:[-8,0,0],ch:[4,0,0],nk:[14,0,0],hd:[6,0,0],KN:[0,.9,.4],jw:[.85]},[.14,-.62,.62,-45],0)],
    [.66,both({alt:[.64],HP:[0,0,.38],h:[-26,0,0],sp:[-8,0,0],ch:[4,0,0],nk:[14,0,0],hd:[6,0,0],KN:[0,.9,.4],jw:[.6]},[.14,-.72,.52,-20],1)],
    [.92,both({alt:[.62],HP:[0,0,.14],h:[2,0,0],KN:[0,.4,1],jw:[.4]},[.13,-.8,.16,30],1)],
    [1.5,{}]],'Draws the knees up, then lunges on a hard wing beat and kicks forward with both feet, the talons clenching and raking down',
    {beat:BT([[0,0],[.35,1],[.55,1.35],[1.5,3]],[[0,1],[1.5,1]])});
  /* Talon flurry: leaning back in the air, kicks left, right, left, each talon clenching as it hits */
  {const KK=(sd,t,on)=>{const a=[.14,-.62,.62,-45],b=[.13,-.82,.08,32],F=on?a:b,G=on?b:a;return sd==='L'?{FL:F,FR:[-G[0],G[1],G[2],G[3]]}:{FR:[-F[0],F[1],F[2],F[3]],FL:G};};
  const base={alt:[.66],h:[-18,0,0],sp:[-6,0,0],ch:[2,0,0],nk:[12,0,0],hd:[6,0,0],KN:[0,.8,.6],jw:[.6]};
  KC('Talon flurry',1.8,[[0,{}],[.2,wrP(base,{FL:[.13,-.7,.2,10],FR:[-.13,-.72,.18,10],tl:[0,0]})],
    [.38,wrP(base,Object.assign(KK('L',0,1),{tl:[.2,0],jw:[.85]}))],[.47,wrP(base,Object.assign(KK('L',0,1),{tl:[1,0]}))],
    [.72,wrP(base,Object.assign(KK('R',0,1),{tl:[.6,.2],jw:[.85]}))],[.81,wrP(base,Object.assign(KK('R',0,1),{tl:[.3,1]}))],
    [1.06,wrP(base,Object.assign(KK('L',0,1),{tl:[.2,.6],jw:[.9]}))],[1.15,wrP(base,Object.assign(KK('L',0,1),{tl:[1,.4]}))],
    [1.38,wrP(base,{FL:[.13,-.76,.18,20],FR:[-.13,-.76,.18,20],tl:[.8,.6],jw:[.4]})],[1.8,{}]],
    'Leans back in the air and kicks left, right, left, each set of talons clenching as it strikes',{beat:BT([[0,0],[1.8,3]],[[0,1],[1.8,1]])});}
  /* Dive kick: climbs high with the wings up, folds them back and dives at the enemy feet first, talons spread; they clench on
     impact and he beats his way back up */
  KC('Dive kick',2.6,[[0,{}],
    [.6,wrP(TOP,both({alt:[1.25],HP:[0,0,-.4],h:[24,0,0],sp:[8,0,0],ch:[6,0,0],nk:[-6,0,0],jw:[.4]},[.13,-.62,.2,20],.2))],
    [.95,both({alt:[1.1],HP:[0,0,-.22],h:[40,0,0],sp:[8,0,0],ch:[6,0,0],nk:[-12,0,0],gL:[.55,.2,-.26],gR:vbbM([.55,.2,-.26]),sL:[.25],sR:[.25],jw:[.6]},[.13,-.7,.05,40],0)],
    [1.25,both({alt:[.1],HP:[0,0,.9],h:[-34,0,0],sp:[-10,0,0],ch:[0,0,0],nk:[18,0,0],hd:[10,0,0],KN:[0,.9,.4],gL:[.62,.52,-.12],gR:vbbM([.62,.52,-.12]),sL:[.5],sR:[.5],jw:[.95]},[.14,-.6,.64,-45],0)],
    [1.36,both({alt:[.08],HP:[0,0,.94],h:[-30,0,0],sp:[-10,0,0],ch:[0,0,0],nk:[18,0,0],hd:[10,0,0],KN:[0,.9,.4],gL:[.62,.5,-.1],gR:vbbM([.62,.5,-.1]),sL:[.55],sR:[.55],jw:[.6]},[.14,-.7,.55,-25],1)],
    [1.7,both({alt:[.4],HP:[0,0,.62],h:[-6,0,0],jw:[.4]},[.13,-.78,.2,20],.9)],
    [2.6,{}]],'Climbs high, folds the wings back and dives feet first at the enemy, the talons clenching on impact, then beats back up',
    {beat:BT([[0,0],[.4,.5],[1.4,1],[2.6,3]],[[0,1],[.35,1],[.6,0],[1.4,0],[1.65,1],[2.6,1]])});

  /* ---- blood feast ---- */
  /* Blood feast: swoops in, seizes the enemy with his talons, sweeps both wings forward round them so they are covered, sinks his
     fangs in and gulps three times, then rips free, flinging the wings open and kicking off */
  {const WRAP={alt:[.4],HP:[0,0,.42],h:[12,0,0],sp:[6,0,0],ch:[8,0,0],nk:[34,0,0],hd:[34,0,0],KN:[0,.8,.5],
      wp:[26],gL:[.12,0,.46],gR:vbbM([.12,0,.46]),pL:[1,-1,.3],pR:[-1,-1,.3],pw:[6],sL:[.55],sR:[.55],wl:[30,0,0],wr:[30,0,0],jw:[.15]};
  both(WRAP,[.15,-.6,.46,-10],1);
  KC('Blood feast',4.6,[[0,{}],
    [.45,wrP(WIDE,both({alt:[.5],HP:[0,0,.25],h:[20,0,0],sp:[8,0,0],ch:[8,0,0],nk:[10,0,0],KN:[0,.8,.5],jw:[.75],sL:[.85],sR:[.85]},[.14,-.56,.55,-30],0))],
    [.85,wrP(WRAP,{gL:[.3,.3,.5],gR:vbbM([.3,.3,.5]),pw:[2],sL:[.8],sR:[.8],wl:[20,0,0],wr:[20,0,0],jw:[.95]})],
    [1.1,WRAP],[3.45,wrP(WRAP,{jw:[.12]})],
    [3.85,wrP(TOP,both({alt:[.58],HP:[0,0,.05],h:[-10,0,0],sp:[-4,0,0],ch:[-6,0,0],nk:[-10,0,0],hd:[-24,0,0],KN:[0,.8,.6],jw:[.95],sL:[.9],sR:[.9]},[.14,-.55,.52,-30],.3))],
    [4.6,{}]],'Swoops in, seizes the enemy with his talons, wraps both wings round them, sinks his fangs in and gulps three times, then rips free and kicks off',
    {beat:BT([[0,0],[.3,.4],[3.9,1],[4.6,2]],[[0,1],[.25,0],[3.9,0],[4.2,1]]),
     add:(t,p)=>{if(t<1||t>3.45)return p;const w=Math.min(1,(t-1)/.2,(3.45-t)/.2),g=Math.max(0,S(D*(t-1)/.82))*w;
       return Object.assign({},p,{jw:[p.jw[0]+.22*g],nk:[p.nk[0]+5*g,0,0],hd:[p.hd[0]+6*g,0,0],ch:[p.ch[0]-3*g,0,0],alt:[p.alt[0]+.02*g],gL:[p.gL[0]-.025*g,p.gL[1],p.gL[2]],gR:[p.gR[0]+.025*g,p.gR[1],p.gR[2]]});}});}

  /* ---- screech, hits, death ---- */
  /* Screech: rears back with the wings spread wide, thrusts the head forward and shrieks; rings of sound fly out of the mouth */
  {const SC=both(wrP(WIDE,{alt:[.7],HP:[0,0,-.1],h:[10,0,0],sp:[8,0,0],ch:[10,0,0],nk:[20,0,0],hd:[6,0,0],KN:[0,.3,1],jw:[1.0],gL:[.84,.32,.12],gR:vbbM([.84,.32,.12])}),[.14,-.84,.1,40],0);
  KC('Screech',2.8,[[0,{}],[.4,both(wrP(WIDE,{alt:[.72],HP:[0,0,-.12],h:[-8,0,0],sp:[-6,0,0],ch:[-8,0,0],nk:[-14,0,0],hd:[-24,0,0],jw:[.5]}),[.14,-.84,.1,40],0)],
    [.7,wrP(SC,{rg:[0]})],[2.1,wrP(SC,{rg:[1]})],[2.8,{rg:[1]}]],'Rears back with the wings spread wide, thrusts the head forward and shrieks; rings of sound fly out',
    {beat:BT([[0,0],[.3,.35],[2.2,1],[2.8,2]],[[0,1],[.35,0],[2.2,0],[2.5,1]]),
     add:(t,p)=>{if(t<.7||t>2.1)return p;const g=S(D*t*9)*Math.min(1,(t-.7)/.15,(2.1-t)/.15);return Object.assign({},p,{ch:[p.ch[0]+1.5*g,p.ch[1]+2*g,0],hd:[p.hd[0],p.hd[1]+3*g,0]});}});}
  KC('Hit 1',.9,[[0,{}],
    [.17,both({alt:[.72],HP:[0,0,-.3],h:[-22,0,0],sp:[-10,0,0],ch:[-14,0,0],nk:[-10,0,0],hd:[-20,0,0],KN:[0,.6,.8],jw:[.8],gL:[.64,.56,0],gR:vbbM([.64,.56,0]),sL:[.55],sR:[.55]},[.15,-.6,.45,-20],.6)],
    [.45,{alt:[.66],HP:[0,0,-.14],h:[4,0,0],jw:[.4]}],[.9,{}]],'Knocked back through the air, the head snapping back, wings jerking up and legs swinging forward',
    {beat:BT([[0,0],[.45,0],[.9,1]],[[0,1],[.16,0],[.45,0],[.7,1]])});
  KC('Hit 2',1.0,[[0,{}],
    [.17,{alt:[.64],HP:[.28,0,-.05],h:[6,22,-16],sp:[4,8,-6],ch:[0,10,-8],hd:[-10,24,-14],jw:[.6],gR:vbbM([.55,.6,0]),sR:[.4],gL:[.8,.1,.15],sL:[1],FL:[.16,-.7,.22,20],FR:[-.1,-.76,.2,20]}],
    [.45,{alt:[.62],HP:[.15,0,0],h:[8,-4,-4],jw:[.3]}],[1.0,{}]],'Struck from the right: twists away and drifts aside, one wing folding up, then turns back',
    {beat:BT([[0,0],[.5,0],[1.0,1]],[[0,1],[.16,0],[.5,0],[.75,1]])});
  /* Death: shrieks with the wings flung up, they crumple and he drops out of the air, landing face down with the wings spread flat
     on the ground; one last twitch of a wing (held) */
  {const DN=both({alt:[-.96],HP:[0,0,-.6],h:[-90,0,0],sp:[-2,0,0],ch:[0,0,0],nk:[0,0,0],hd:[-40,0,0],KN:[0,.1,1],
      gL:[.9,.1,-.08],gR:vbbM([.9,.1,-.08]),pL:[0,-1,.15],pR:[0,-1,.15],pw:[4],cl:[-90,-90],sL:[1],sR:[1],wl:[0,0,-8],wr:[0,0,-8],jw:[.7]},[.12,-1.06,.08,25],.95);
  KC('Death',3.4,[[0,{}],
    [.3,wrP(TOP,both({alt:[.85],h:[-18,0,0],sp:[-8,0,0],ch:[-10,0,0],nk:[-14,0,0],hd:[-30,0,0],jw:[1.0],sL:[.7],sR:[.7]},[.14,-.8,.2,30],0))],
    [.7,both({alt:[.45],HP:[0,0,-.1],h:[-36,0,0],sp:[-8,0,0],ch:[-8,0,0],hd:[-30,0,0],gL:[.55,.55,-.1],gR:vbbM([.55,.55,-.1]),sL:[.15],sR:[.15],jw:[.8]},[.13,-.8,.25,30],.5)],
    [1.05,both({alt:[-.45],HP:[0,0,-.4],h:[-66,0,0],sp:[-4,0,0],ch:[-2,0,0],hd:[-56,0,0],gL:[.8,.25,.05],gR:vbbM([.8,.25,.05]),pL:[0,-1,.15],pR:[0,-1,.15],sL:[.6],sR:[.6],cl:[-60,-60],jw:[.8]},[.12,-.9,.2,50],.8)],
    [1.25,DN],[1.38,wrP(DN,{alt:[-.91],gL:[.9,.14,-.04],gR:vbbM([.9,.14,-.04])})],[1.6,DN],
    [2.2,wrP(DN,{gL:[.86,.16,.0],gR:vbbM([.9,.1,-.08]),sL:[.85],jw:[.6]})],[2.6,wrP(DN,{jw:[.65]})],[3.4,wrP(DN,{jw:[.65]})]],
    'Shrieks with the wings flung up, they crumple and he drops out of the air onto his back, the wings spread flat and the talons curled up; one last twitch (held)',
    {fps:60,next:null,beat:BT([[0,0],[.3,0]],[[0,1],[.2,0]])});}
  return VBBCLIPS.all=L;}

ASSETS.push({id:'vampire-beast',folder:'characters/enemies/undead',name:'Vampire (beast form)',kind:'character',variants:true,defaultSeed:1,groundR:3.1,build:(s,o)=>buildVampireBeast(s,o||{}),
  opts:[{key:'skin',label:'Skin',choices:[['random','Random'],...Object.entries(VBB_SKIN).map(([k,v])=>[k,v[1].charAt(0).toUpperCase()+v[1].slice(1)])],def:'random'},
    {key:'eyes',label:'Eyes',choices:[['random','Random'],['red','Red glow'],['amber','Amber glow'],['violet','Violet glow']],def:'random'},
    {key:'wings',label:'Wings',choices:[['random','Random'],...Object.entries(VBB_WING).map(([k,v])=>[k,v[1].charAt(0).toUpperCase()+v[1].slice(1)])],def:'random'}],
  desc:'Vampire lord, beast form (mini boss, phase 2): a gaunt, bald, grey creature of 2.2 m whose arms are bat wings, with big bat ears, a flat nose, glowing eyes, a wide mouth full of teeth and fangs, ribs showing and long taloned feet. Always flying. Clips: Idle, Fly, war-mode Idle and Fly, Appear (grows out of the phase 1 smoke, wings burst open), Talon strike, Talon flurry, Dive kick, Blood feast (wraps the enemy in his wings and drinks), Screech (rings of sound), Hit 1, Hit 2 and Death (falls out of the air onto his back).'});
