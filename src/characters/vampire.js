/* ======================= VAMPIRE: the vampire lord, a mini boss (phase 1: floats, summons vampire spawn, casts spells, vanishes) =======================
   A tall, well-dressed gentleman (VB.vlord is the villager male's proportions, about 1.86 m) who never touches the ground: pale, slicked
   back hair with a widow's peak, pointed ears, glowing eyes, two fangs and a lower jaw that opens (g_jaw); a frock coat over a waistcoat,
   a white cravat with a ruby brooch, tall boots, long pale fingers with dark nails, and a long cape with a high stand-up collar.
   Built from its own meshes on the villager's 25 joints inside a body group (vbody), so the warrior's IK (wrSolve) fits unchanged.
   Clips use the vampire spawn's arm machinery (hand targets in the torso's frame, keyed wrists, elbow poles by a cost search) plus the
   lich's float lift (fl). The cape is cloth: a 9 x 7 grid of points hanging from the shoulders, simulated while each clip is made
   (gravity, wind, the body as capsules, the hands may hold its edges) and baked into position/rotation/scale tracks of its 54
   pieces (cape_i_k), so it moves the same in the viewer and in the GLB. Vanish wraps him in the cape, smoke billows (vsmoke_*), and
   he spins and shrinks to nothing inside it (vbody scale); Reappear is the way back. */
VB.vlord=Object.assign({},VB.male,{sex:'male'});
{const b=VB.vlord;b.key='vlord';b.hipH=b.thigh+b.shin+b.ankle+b.hipOff;b.legS=(b.thigh+b.shin)/.84;b.tS=(b.spine+b.chest)/.3;b.cS=b.neck/.22;}
const VL_SKIN={pale:['#d9d4cb','pale ivory'],ashen:['#afada9','ashen'],grey:['#a1a6aa','grey-blue']};
const VL_HAIR={black:['#151419','black'],silver:['#9b9ea7','silver'],brown:['#3a2927','dark brown']};
const VL_EYES={red:['#ffe3dc','#c9524d','red glowing eyes'],amber:['#fff3d5','#e4ae58','amber glowing eyes'],violet:['#f3e7ff','#9568c6','violet glowing eyes']};
const VL_COAT={black:['#1e1c21','black'],blue:['#202533','midnight blue'],wine:['#3d222e','burgundy']};
const VL_LINING={crimson:['#613542','crimson'],purple:['#3d2b4e','purple'],black:['#29262d','black']};
/* float height (metres above the ground; the clips are authored for 0.3 and scaled to it) */
const VL_FLOAT={low:[.15,'just off the ground'],medium:[.3,'knee height'],high:[.5,'half a metre']};
/* cape grid: VL_CN strips round the back from the right shoulder (0) to the left (VL_CN-1), VL_CK points each, VL_SEG apart;
   the last piece of each strip is a little longer or shorter (VL_HEM), so the hem is pointed */
const VL_CN=9,VL_CK=7,VL_SEG=.235,VL_HEM=[.0,-.05,.03,-.05,.06,-.05,.03,-.05,.0];
/* smoke puffs for Vanish/Reappear: angle, radius, height, size, delay (lower puffs come first, so the smoke rises from the hem), swirl */
const VL_PUFF=(()=>{const r=mulberry32(4711),P=[];for(let i=0;i<44;i++){const y=.12+1.9*(i%11)/10+.08*r();P.push({a:i*2.39996+r()*.5,r:.08+.22*r(),y,z:.26+.18*r(),d:.22*y/2+.04*r(),sp:.7+.6*r()});}return P;})();
function vlPuff(P,sm,fy){const g=Math.min(1,Math.max(0,(sm-P.d)/.25)),eg=1-(1-g)*(1-g),f=Math.min(1,Math.max(0,(sm-.6-P.d*.3)/.3)),a=P.a+sm*3.2*P.sp,r=P.r+.14*eg+.8*f*f;
  return{p:[Math.sin(a)*r,fy+P.y+.15*sm+.6*f,Math.cos(a)*r],s:Math.max(.001,P.z*eg*(1+.5*f)*(1-f))};}
const VLM={};
function vlSmokeMat(hex,op){const k=hex+op;return VLM[k]||(VLM[k]=new THREE.MeshStandardMaterial({map:pxTex('plain'),color:new THREE.Color(hex).convertSRGBToLinear(),transparent:true,opacity:op,roughness:1,depthWrite:false}));}

function buildVampire(seed,o={}){const B=VB.vlord,r=mulberry32(((seed*2654435761)>>>0)^0x7a3c),pick=a=>a[Math.floor(r()*a.length)],root=new THREE.Group();root.userData.lights=[];
  /* roll everything, then let the options override */
  const skin0=pick(Object.keys(VL_SKIN)),hair0=pick(['black','black','silver','brown']),eye0=pick(['red','red','amber','violet']),coat0=pick(Object.keys(VL_COAT)),lin0=pick(['crimson','crimson','purple','black']);
  const opt=(k,d)=>o[k]&&o[k]!=='random'?o[k]:d,skinK=opt('skin',skin0),hairK=opt('hair',hair0),eyeK=opt('eyes',eye0),coatK=opt('coat',coat0),linK=opt('lining',lin0);
  const shade=(h,f)=>'#'+new THREE.Color(h).multiplyScalar(f).getHexString(),SK=VL_SKIN[skinK][0],HC=VL_HAIR[hairK][0],CC=VL_COAT[coatK][0],LC=VL_LINING[linK][0];
  const skin=bm(SK,'skin'),skinD=bm(shade(SK,.8),'skin'),hair=bm(HC,'hair'),hairD=bm(shade(HC,.75),'hair'),dark=bm('#150f12','plain'),teeth=bm('#d9d4c9','plain'),lip=bm(shade('#653c49',.9),'plain'),nail=bm('#271b23','plain');
  const coat=bm(CC,'cloth'),coatD=bm(shade(CC,.7),'cloth'),vest=bm(linK==='black'?'#38363d':shade(LC,.75),'cloth'),white=bm('#d9d6cf','cloth'),trous=bm('#1c1a1e','cloth'),boot=bm('#1a1615','leather'),bootD=bm('#2a221f','leather');
  const silver=bm('#a1a4a9','plain'),gold=bm('#a6905c','plain'),capeO=bm('#151417','cloth'),capeL=bm(LC,'cloth');
  const ey=VL_EYES[eyeK],eyeM=wrGlow(ey[0],ey[1],1.7,pxTex('plain')),ruby=wrGlow('#e49d94','#c9524d',1.4,pxTex('plain')),blood=wrGlow('#e49d94','#c9524d',2.2,pxTex('plain'));
  const vb=new THREE.Group();vb.name='vbody';root.add(vb);
  const hips=J('hips',vb,0,B.hipH,0),spine=J('spine',hips,0,B.spine,0),chest=J('chest',spine,0,B.chest,0),neck=J('neck',chest,0,B.neck,0),head=J('head',neck,0,B.headY,0);
  /* hips: trousers, belt with a silver buckle, the short skirt of the coat */
  bx(hips,.3,.16,.18,trous,0,-.04,0);bx(hips,.33,.11,.21,coat,0,-.01,0);bx(hips,.335,.035,.215,bootD,0,.045,0);bx(hips,.05,.04,.012,silver,0,.045,.11);
  /* waist and chest: waistcoat with silver buttons, the coat open in front over it, lapels, shoulders */
  bx(spine,.27,.25,.18,vest,0,.08,0);bx(spine,.3,.25,.03,coat,0,.08,-.085);for(const s of[-1,1]){bx(spine,.03,.25,.2,coat,s*.135,.08,0);bx(spine,.075,.25,.03,coat,s*.11,.08,.088);}
  for(const y of[.02,.09,.16])bx(spine,.022,.022,.01,silver,0,y,.093);
  bx(chest,.28,.27,.18,vest,0,.1,0);bx(chest,.32,.29,.03,coat,0,.1,-.09);
  for(const s of[-1,1]){bx(chest,.03,.29,.2,coat,s*.15,.1,0);bx(chest,.085,.29,.03,coat,s*.11,.1,.09);bx(chest,.035,.17,.012,coatD,s*.08,.15,.108,0,0,s*.18);bx(chest,.1,.05,.2,coat,s*.15,.225,0);}
  bx(chest,.022,.022,.01,silver,0,.03,.093);
  /* shirt collar and a white cravat falling in ruffles, a ruby brooch in gold */
  bx(neck,.08,.13,.08,skin,0,.05,0);bx(neck,.11,.07,.11,white,0,.005,0);
  for(const[w,y,z]of[[.09,.215,.098],[.11,.17,.102],[.085,.125,.1]])bx(chest,w,.05,.03,white,0,y,z);bx(chest,.04,.04,.012,gold,0,.2,.118);bx(chest,.024,.024,.01,ruby,0,.2,.126,0,0,Math.PI/4);
  /* the high stand-up collar of the cape, black outside, lined inside, flaring behind the head */
  bx(chest,.36,.32,.025,capeO,0,.39,-.16,-.28,0,0);bx(chest,.34,.3,.012,capeL,0,.39,-.142,-.28,0,0);
  for(const s of[-1,1]){bx(chest,.025,.28,.13,capeO,s*.185,.37,-.09,0,0,-s*.3);bx(chest,.012,.26,.12,capeL,s*.172,.37,-.09,0,0,-s*.3);}
  /* head: long pale face, slicked-back hair with a widow's peak, brows slanting down to the nose, glowing eyes, a long nose,
     pointed ears; the lower face is the jaw (g_jaw), two fangs hang from the upper lip */
  bx(head,.23,.215,.25,skin,0,.178,0);bx(head,.19,.07,.12,skin,0,.04,-.055);bx(head,.12,.03,.1,dark,0,.062,.07);
  for(const s of[-1,1]){bx(head,.06,.03,.01,dark,s*.054,.17,.126);bx(head,.03,.016,.008,eyeM,s*.054,.17,.131);bx(head,.07,.016,.014,hair,s*.055,.197,.13,0,0,s*.26);
    bx(head,.03,.05,.01,skinD,s*.085,.105,.126);bx(head,.012,.03,.012,teeth,s*.026,.062,.12);}
  bx(head,.036,.075,.036,skin,0,.13,.14);bx(head,.03,.02,.03,skinD,0,.1,.15);bx(head,.1,.012,.012,lip,0,.078,.126);
  bx(head,.25,.04,.26,hair,0,.3,-.01);bx(head,.25,.2,.04,hair,0,.2,-.135);bx(head,.2,.06,.04,hair,0,.085,-.13);
  for(const s of[-1,1])bx(head,.02,.08,.17,hair,s*.124,.245,-.03);bx(head,.24,.03,.02,hair,0,.27,.126);bx(head,.05,.04,.02,hair,0,.25,.127);bx(head,.22,.02,.2,hairD,0,.325,-.02);
  for(const s of[-1,1]){const eg=new THREE.Group();eg.position.set(s*.118,.165,-.015);eg.rotation.set(-.35,s*.3,-s*.18);head.add(eg);
    bx(eg,.02,.07,.05,skin,s*.012,0,0);bx(eg,.018,.05,.038,skin,s*.018,.045,-.012);bx(eg,.015,.035,.026,skinD,s*.022,.08,-.02);bx(eg,.012,.025,.016,skinD,s*.025,.105,-.026);}
  const jw=new THREE.Group();jw.name='g_jaw';head.add(jw);jw.position.set(0,.07,0);
  bx(jw,.19,.065,.13,skin,0,-.032,.06);bx(jw,.1,.03,.05,skin,0,-.058,.1);bx(jw,.09,.01,.012,lip,0,-.004,.122);bx(jw,.09,.012,.04,teeth,0,-.006,.1);
  /* arms: coat sleeves with turned-back cuffs and white lace, long pale fingers with dark pointed nails */
  for(const[sd,s]of[['L',1],['R',-1]]){const sh=J('shoulder_'+sd,chest,s*B.shW*.325,.165*B.cS,0),ua=J('upperArm_'+sd,sh,s*B.shW*.675,0,0),fa=J('foreArm_'+sd,ua,0,-B.ua,0),hd=J('hand_'+sd,fa,0,-B.fa,0);
    const fg=J('fingers_'+sd,hd,0,-.095,0),ft=J('fingerTips_'+sd,fg,0,-.045,0),th=J('thumb_'+sd,hd,-s*.018,-.03,.045),so=J('socket_'+sd,hd,-s*.012,-.07,0);so.userData.socket=true;
    bx(ua,.1,.08,.1,coat,s*-.005,-.01,0);bx(ua,.085,.27,.085,coat,0,-.15,0);bx(fa,.08,.2,.08,coat,0,-.1,0);bx(fa,.096,.06,.096,coatD,0,-.195,0);bx(fa,.088,.04,.088,white,0,-.24,0);
    bx(hd,.045,.1,.09,skin,0,-.05,0);
    for(const[z,Lp]of[[.033,.045],[.011,.05],[-.011,.045],[-.033,.036]]){const g1=new THREE.Group(),g2=new THREE.Group();g1.position.set(0,0,z);fg.add(g1);g2.position.set(0,.045-Lp,z);ft.add(g2);
      bx(g1,.019,Lp,.019,skin,0,-Lp/2+.003,0);bx(g2,.017,.035,.017,skin,0,-.017,0);bx(g2,.013,.018,.013,nail,-s*.002,-.04,0);bx(g2,.008,.012,.008,nail,-s*.004,-.054,0);}
    const tg=new THREE.Group();tg.rotation.set(-.6,0,-s*.15);th.add(tg);bx(tg,.022,.045,.022,skin,0,-.02,0);bx(tg,.02,.03,.02,skin,0,-.05,0);bx(tg,.012,.016,.012,nail,0,-.07,0);
    if(sd==='R'){const rg=new THREE.Group();rg.position.set(0,0,.011);fg.add(rg);bx(rg,.024,.012,.024,gold,0,-.02,0);bx(rg,.012,.01,.012,ruby,-s*.012,-.02,0);}
    /* blood orb in front of the palm, hidden (tiny) unless a clip grows it */
    const orb=new THREE.Group();orb.name='orb_'+sd;orb.userData.gear=true;orb.position.set(-s*.07,-.08,.02);orb.scale.setScalar(.001);hd.add(orb);
    bx(orb,.09,.09,.09,blood,0,0,0,.6,.6,0);bx(orb,.055,.055,.055,wrGlow('#ffe3dc','#c9524d',2.4,pxTex('plain')),0,0,0,0,.8,.6);}
  /* legs: dark trousers, tall black riding boots with turned-down cuffs and pointed toes */
  for(const[sd,s]of[['L',1],['R',-1]]){const th=J('thigh_'+sd,hips,s*B.hipW,-(B.hipOff+.01),0),sn=J('shin_'+sd,th,0,-B.thigh,0),ft=J('foot_'+sd,sn,0,-B.shin,0);
    bx(th,.12,.43,.13,trous,0,-.2,0);
    bx(sn,.105,.08,.115,trous,0,-.02,0);bx(sn,.125,.07,.135,bootD,0,-.095,0);bx(sn,.11,.3,.12,boot,0,-.265,0);
    bx(ft,.105,.08,.11,boot,0,-.03,-.01);bx(ft,.1,.04,.23,boot,0,-.05,.035);bx(ft,.07,.035,.05,boot,0,-.052,.17);bx(ft,.09,.02,.07,bootD,0,-.06,-.06);}
  const joints=[];root.traverse(q=>{if(q.userData.joint&&!q.userData.socket)joints.push(q);});root.userData.joints=joints;
  if(o.bare)return root;
  /* cape: 54 pieces, black outside and lined inside; each is one unit long and wide, its clips set where it hangs and how big it is */
  for(let i=0;i<VL_CN;i++)for(let k=0;k<VL_CK-1;k++){const g=new THREE.Group();g.name=`cape_${i}_${k}`;vb.add(g);bx(g,1,1,.014,capeO,0,-.5,.007);bx(g,.97,1,.01,capeL,0,-.5,-.006);}
  /* smoke for Vanish and Reappear (hidden unless those clips play) */
  const sm=new THREE.Group();sm.name='vsmoke';sm.scale.setScalar(.001);root.add(sm);
  VL_PUFF.forEach((P,j)=>{const g=new THREE.Group();g.name='vsmoke_'+j;g.scale.setScalar(.001);sm.add(g);const m1=vlSmokeMat(j%3===0?'#43394a':'#2d2b32',.78),m2=vlSmokeMat(j%4===1?'#482836':'#3b3741',.7);
    bx(g,1,1,1,m1,0,0,0,0,P.a,0);bx(g,.62,.62,.62,m2,.36*Math.sin(P.a*3),.28,.3*Math.cos(P.a*2),.3,P.a,0);});
  const flK=VL_FLOAT[o.float]?o.float:'medium';
  if(!o.noClips){root.userData.clips=vampireClips(VL_FLOAT[flK][0]/.3);const mx=new THREE.AnimationMixer(root);mx.clipAction(root.userData.clips[0]).play();mx.update(0);}
  root.userData.ground=2.2;
  const cap=s=>s.charAt(0).toUpperCase()+s.slice(1);
  root.userData.variantText=`${cap(VL_SKIN[skinK][1])} skin, ${VL_HAIR[hairK][1]} hair, ${ey[2]}; ${VL_COAT[coatK][1]} coat over a waistcoat, white cravat with a ruby; black cape lined in ${VL_LINING[linK][1]}. Floats ${VL_FLOAT[flK][1]}.`;
  return root;}

/* ---------- cape cloth ----------
   Points hang in strips from anchors round the shoulders (in the chest's frame); each step: gravity and wind, then a few rounds of
   constraints: strip lengths; neighbours across no further apart than the cloth allows (more towards the hem, so the cape can spread
   into wings) and not bunched closer than its gentle flare; no folding back on itself; pushed out of the body's capsules (torso,
   head, arms, legs, boots) and above the ground; a hand holding an edge pins that strip's point k to the palm (weight w).
   Positions are in the body group's space (the rig's world), kept in flat arrays so a clip's cloth takes a fraction of a second. */
function vlCape(R){const V=THREE.Vector3,N=VL_CN,K=VL_CK,NK=N*K,A=[],L=new Float64Array(NK),X=new Float64Array(NK*3),Q=new Float64Array(NK*3),col=[];
  for(let i=0;i<N;i++){const s=-1+2*i/(N-1),a=s*1.42;A.push(new V(Math.sin(a)*.205,.245,-Math.cos(a)*.135));}
  let sp0=0;for(let i=1;i<N;i++)sp0+=A[i].distanceTo(A[i-1]);sp0/=N-1;
  for(let i=0;i<N;i++)for(let k=0;k<K-1;k++)L[i*K+k]=VL_SEG+(k===K-2?VL_HEM[i]:0);
  const Jn=R.J,W=(j,x,y,z)=>new V(x,y,z).applyMatrix4(Jn[j].matrixWorld),wp=j=>Jn[j].getWorldPosition(new V());
  /* body capsules, packed flat (start, axis, radius, 1/|axis|², bounding sphere) */
  const CB=new Float64Array(24*12);let nc=0;
  const caps=()=>{R.m.updateMatrixWorld(true);col.length=0;const c=(a,b,r)=>col.push([a,b,r+.024]);
    for(const s of[-1,1])c(W('hips',s*.07,-.07,0),W('chest',s*.06,.2,0),.115);
    c(W('chest',-.15,.22,0),W('chest',.15,.22,0),.075);c(W('chest',0,.22,0),W('head',0,.06,0),.07);c(W('head',0,.1,-.01),W('head',0,.24,-.01),.155);
    for(const sd of['L','R']){const E=wp('foreArm_'+sd),H=wp('hand_'+sd),dir=H.clone().sub(E).normalize();
      c(wp('upperArm_'+sd),E,.065);c(E,H,.06);c(H,H.clone().addScaledVector(dir,.13),.05);
      c(wp('thigh_'+sd),wp('shin_'+sd),.085);c(wp('shin_'+sd),wp('foot_'+sd),.075);c(W('foot_'+sd,0,-.035,-.06),W('foot_'+sd,0,-.035,.16),.06);}
    nc=col.length;col.forEach(([a,b,r],j)=>{const o=j*12,dx=b.x-a.x,dy=b.y-a.y,dz=b.z-a.z,l2=dx*dx+dy*dy+dz*dz;CB[o]=a.x;CB[o+1]=a.y;CB[o+2]=a.z;CB[o+3]=dx;CB[o+4]=dy;CB[o+5]=dz;CB[o+6]=r;CB[o+7]=1/Math.max(1e-9,l2);
      CB[o+8]=a.x+dx/2;CB[o+9]=a.y+dy/2;CB[o+10]=a.z+dz/2;const br=Math.sqrt(l2)/2+r;CB[o+11]=br*br;});};
  const push=n=>{const q=n*3;let x=X[q],y=X[q+1],z=X[q+2];for(let j=0;j<nc;j++){const o=j*12,mx=x-CB[o+8],my=y-CB[o+9],mz=z-CB[o+10];if(mx*mx+my*my+mz*mz>CB[o+11])continue;
      const px=x-CB[o],py=y-CB[o+1],pz=z-CB[o+2];let u=(px*CB[o+3]+py*CB[o+4]+pz*CB[o+5])*CB[o+7];u=u<0?0:u>1?1:u;const cx=CB[o]+CB[o+3]*u,cy=CB[o+1]+CB[o+4]*u,cz=CB[o+2]+CB[o+5]*u;
      let tx=x-cx,ty=y-cy,tz=z-cz,d=Math.sqrt(tx*tx+ty*ty+tz*tz);const r=CB[o+6];if(d>=r)continue;if(d<1e-6){tx=0;ty=0;tz=-1;d=1;}x=cx+tx*r/d;y=cy+ty*r/d;z=cz+tz*r/d;}
    X[q]=x;X[q+1]=Math.max(.035,y);X[q+2]=z;};
  /* keep two points between lo and hi apart; a fixed first point (an anchor) does not move */
  const link=(a,b,lo,hi,fa)=>{const p=a*3,q=b*3,dx=X[q]-X[p],dy=X[q+1]-X[p+1],dz=X[q+2]-X[p+2],d=Math.sqrt(dx*dx+dy*dy+dz*dz)||1e-6,l=d>hi?hi:d<lo?lo:d;if(l===d)return;
    const e=(d-l)/d,wa=fa?0:.5,wb=fa?1:.5;X[p]+=dx*e*wa;X[p+1]+=dy*e*wa;X[p+2]+=dz*e*wa;X[q]-=dx*e*wb;X[q+1]-=dy*e*wb;X[q+2]-=dz*e*wb;};
  const anchors=()=>A.map(a=>a.clone().applyMatrix4(Jn.chest.matrixWorld));
  const hold=(sd,w,k)=>{const E=wp('foreArm_'+sd),H=wp('hand_'+sd);return{n:(sd==='R'?0:N-1)*K+Math.max(1,Math.min(K-1,Math.round(k))),p:H.addScaledVector(H.clone().sub(E).normalize(),.07),w};};
  return{
    /* hang down and a little back from the anchors, behind the body */
    reset(){caps();const an=anchors(),bk=new V(0,0,-1).applyQuaternion(Jn.hips.getWorldQuaternion(new THREE.Quaternion()));bk.y=0;bk.normalize();const d=new V(0,-1,0).addScaledVector(bk,.3).normalize();
      for(let i=0;i<N;i++)for(let k=0;k<K;k++){const n=i*K+k,p=an[i].clone().addScaledVector(d,k*VL_SEG);X[n*3]=p.x;X[n*3+1]=p.y;X[n*3+2]=p.z;if(k)push(n);for(let c=0;c<3;c++)Q[n*3+c]=X[n*3+c];}},
    step(pose,wind,dt,front){caps();const hp=wp("hips"),fq=Jn.hips.getWorldQuaternion(new THREE.Quaternion()),fw=new V(0,0,1).applyQuaternion(fq),rt=new V(1,0,0).applyQuaternion(fq),top=W("chest",0,.3,0).y;const an=anchors(),sub=2,h=dt/sub,gx=wind[0]*h*h,gy=(-9.8+wind[1])*h*h,gz=wind[2]*h*h,IT=8,hs=[],
        /* free cloth stays behind the body: a point in front of the middle of the torso and legs goes back behind it (the capsules
           then put it on the back); clips where the hands wrap the cape round the front (front) skip this */
        back=n=>{const q=n*3,dx=X[q]-hp.x,dy=X[q+1]-hp.y,dz=X[q+2]-hp.z,lx=dx*rt.x+dy*rt.y+dz*rt.z,lz=dx*fw.x+dy*fw.y+dz*fw.z;if(Math.abs(lx)>.24||lz<-.02||X[q+1]>top||X[q+1]<hp.y-.95)return;
          const m=lz+.02;X[q]-=fw.x*m;X[q+1]-=fw.y*m;X[q+2]-=fw.z*m;};
      for(const sd of['R','L']){const c=pose['c'+sd];if(c&&c[0]>.001){const H=hold(sd,c[0],c[1]);H.w=c[0]>=.999?1:1-Math.pow(1-c[0],1/(sub*IT));hs.push(H);}}
      for(let s=0;s<sub;s++){
        for(let i=0;i<N;i++){const a=i*K*3,f=1/(sub-s);for(let c=0;c<3;c++){X[a+c]+=(an[i].getComponent(c)-X[a+c])*f;Q[a+c]=X[a+c];}
          for(let k=1;k<K;k++){const q=(i*K+k)*3;for(let c=0;c<3;c++){const v=(X[q+c]-Q[q+c])*.94;Q[q+c]=X[q+c];X[q+c]+=v+(c===0?gx:c===1?gy:gz);}}}
        for(let it=0;it<IT;it++){
          for(let i=0;i<N;i++)for(let k=0;k<K-1;k++){const l=L[i*K+k];link(i*K+k,i*K+k+1,l,l,k===0);}
          for(let i=0;i<N;i++)for(let k=0;k<K-2;k++)link(i*K+k,i*K+k+2,1.55*VL_SEG,1e9,k===0);
          for(let k=1;k<K;k++){const mx=sp0+.04*k,mn=sp0*(1+.5*k/(K-1))*.85;for(let st=1;st<3;st++)for(let i=0;i<N-st;i++)link(i*K+k,(i+st)*K+k,mn*st,mx*st,false);}
          if(it%2||it===IT-1)for(let n=0;n<NK;n++)if(n%K){if(!front)back(n);push(n);}
          for(const H of hs){const q=H.n*3;X[q]+=(H.p.x-X[q])*H.w;X[q+1]+=(H.p.y-X[q+1])*H.w;X[q+2]+=(H.p.z-X[q+2])*H.w;}}}},
    snap(){return Float32Array.from(X);}};}
/* the cape's tracks from the recorded point grids: each piece sits at its upper point, its y axis along the strip, its x across to the
   neighbours (z, the black outside, then faces away from the body), scaled to the piece's length and the strips' spacing */
function vlCapeTracks(c,F){const V=THREE.Vector3,N=VL_CN,K=VL_CK,T=Array.from(c.tracks[0].times),M=new THREE.Matrix4(),q=new THREE.Quaternion();
  const at=(f,i,k)=>new V(f[(i*K+k)*3],f[(i*K+k)*3+1],f[(i*K+k)*3+2]);
  for(let i=0;i<N;i++)for(let k=0;k<K-1;k++){const PP=[],QQ=[],SS=[];let pq=null;
    for(const f of F){const a=at(f,i,k),b=at(f,i,k+1),Y=a.clone().sub(b),len=Y.length();Y.normalize();const il=Math.max(0,i-1),ir=Math.min(N-1,i+1);
      const mid=j=>at(f,j,k).add(at(f,j,k+1)).multiplyScalar(.5),lat=mid(il).sub(mid(ir)),w=lat.length()/(ir-il)*1.2;const X=lat.addScaledVector(Y,-lat.dot(Y)).normalize(),Z=new V().crossVectors(X,Y);
      q.setFromRotationMatrix(M.makeBasis(X,Y,Z));if(pq&&pq.dot(q)<0){q.x=-q.x;q.y=-q.y;q.z=-q.z;q.w=-q.w;}pq=q.clone();
      PP.push(a.x,a.y,a.z);QQ.push(q.x,q.y,q.z,q.w);SS.push(Math.max(.02,w),Math.max(.02,len),1);}
    const n=`cape_${i}_${k}`;c.tracks.push(new THREE.VectorKeyframeTrack(n+'.position',T,PP),new THREE.QuaternionKeyframeTrack(n+'.quaternion',T,QQ),new THREE.VectorKeyframeTrack(n+'.scale',T,SS));}}

/* ---------- clips ---------- */
const VLCLIPS={};
/* stances (body units; fl lifts the hips, feet and hands together and is scaled by the Float height option).
   Hover (VL_H): upright and proud, chest out, legs hanging with the toes pointing down, hands by the sides.
   War (VL_W): higher, leaning in a little, both clawed hands raised in front. Hand targets: x,z hips-relative, y absolute.
   Extra channels: jw jaw, oR/oL blood orb sizes, cR/cL a hand holding the cape's edge [weight, point], vb body [scale, spin°], sm smoke */
const VL_H={fl:[.3],HP:[0,0,0],h:[0,0,0],sp:[-2,0,0],ch:[-3,0,0],nk:[3,0,0],hd:[2,0,0],FL:[.08,-.01,6,-.06,46],FR:[-.08,-.05,-6,-.05,42],
  gR:[-.27,.87,.07],dR:[0,-.7,.7],pR:[-.5,-.3,-.8],gL:[.27,.87,.07],dL:[1,0,0],pL:[.5,-.3,-.8],wr:[0,0,-4],wl:[0,0,-4],fist:[28,28],jw:[0],oR:[0],oL:[0],cR:[0,2],cL:[0,3],vb:[1,0],sm:[0]};
const VL_W=wrP(VL_H,{fl:[.4],h:[6,0,0],sp:[3,0,0],ch:[2,0,0],nk:[0,0,0],hd:[-2,0,0],FL:[.1,.04,4,-.05,44],FR:[-.09,-.1,-16,-.04,40],
  gR:[-.36,1.2,.34],gL:[.36,1.22,.36],wr:[12,0,-22],wl:[12,0,-22],fist:[18,18],jw:[.05]});
/* wrapped in the cape (Vanish, Reappear): the right forearm across the face holding the cape's right edge, the left hand drawing the
   left edge across the waist */
const VL_WRAP={fl:[.34],h:[2,-8,0],sp:[2,-4,0],ch:[0,-4,0],nk:[8,0,0],hd:[10,6,0],gR:[.06,1.56,.3],wr:[0,0,10],gL:[-.04,1.1,.26],wl:[0,0,0],fist:[60,70],cR:[1,2],cL:[1,3],jw:[0]};
function vlRig(){const B=VB.vlord,m=buildVampire(1,{bare:true}),J={};m.traverse(q=>{if(q.userData.joint)J[q.name]=q;});return{m,J,B,two:false};}

function vampireClips(flk=1){const key=flk.toFixed(3);if(VLCLIPS[key])return VLCLIPS[key];const B=VB.vlord,D=Math.PI*2,S=Math.sin,C=Math.cos,V=THREE.Vector3,Q=THREE.Quaternion,L=[],R=vlRig(),cape=vlCape(R);
  /* the vampire spawn's arms: hand targets turned with the body's yaw, elbow poles by score round the shoulder-to-hand line with
     frame-to-frame continuity, hands bent only by the keyed wrists (wr right, wl left) */
  const yawF=p=>{const y=(p.h[1]+p.sp[1]+p.ch[1])*Math.PI/180,c=Math.cos(y),sn=Math.sin(y),rt=v=>[v[0]*c+v[2]*sn,v[1],-v[0]*sn+v[2]*c],o=Object.assign({},p);for(const k of['gR','gL'])o[k]=rt(p[k]);return o;};
  const restQ={L:new Q().setFromEuler(new THREE.Euler(0,0,BASEPOSE.upperArm_L[2]*Math.PI/180)),R:new Q().setFromEuler(new THREE.Euler(0,0,BASEPOSE.upperArm_R[2]*Math.PI/180))};
  const MIN=.4;let PP=null;const M4=new THREE.Matrix4();
  const poles=p=>{R.m.updateMatrixWorld(true);const k=B.legS,o=Object.assign({},p),hp=(p.HP||[0,0,0]).map(v=>v*k),cq=R.J.chest.getWorldQuaternion(new Q()),up=new V(0,1,0),fw=new V(0,0,1).applyQuaternion(cq),nx={};
    for(const[sd,s]of[['L',1],['R',-1]]){const G=p['g'+sd],Sh=R.J['upperArm_'+sd].getWorldPosition(new V()),shW=R.J['shoulder_'+sd].getWorldQuaternion(new Q()),shq=shW.clone().invert(),sq=shW.clone().multiply(restQ[sd]);
      const T=new V(G[0]*k+hp[0],G[1]*k,G[2]*k+hp[2]).sub(Sh);if(T.length()<MIN){T.setLength(MIN);o['g'+sd]=[(Sh.x+T.x-hp[0])/k,(Sh.y+T.y)/k,(Sh.z+T.z-hp[2])/k];}const d=Math.min(T.length(),(B.ua+B.fa)*.999),u=T.normalize(),bone=new V(0,-1,0).applyQuaternion(sq);
      const al=Math.acos(Math.min(1,Math.max(-1,(B.ua*B.ua+d*d-B.fa*B.fa)/(2*B.ua*d)))),inw=new V(-s,0,0).applyQuaternion(cq);
      const el0=new V(0,0,-1).applyQuaternion(sq).applyQuaternion(new Q().setFromUnitVectors(bone,u)),b1=el0.clone().addScaledVector(u,-el0.dot(u)).normalize(),b2=new V().crossVectors(u,b1);
      let prev=PP&&PP[sd]?PP[sd].clone().addScaledVector(u,-PP[sd].dot(u)):null;if(prev&&prev.lengthSq()<.04)prev=null;if(prev)prev.normalize();let best=null,bc=1e9;
      for(const lim of[.866,-2])if(!best)
      for(let i=0;i<96;i++){const f=i/96*2*Math.PI,pp=b1.clone().multiplyScalar(Math.cos(f)).addScaledVector(b2,Math.sin(f)),e=u.clone().multiplyScalar(Math.cos(al)).addScaledVector(pp,Math.sin(al));
        const Y=e.clone().negate(),Z=pp.clone().addScaledVector(e,-pp.dot(e)).normalize().negate(),lq=shq.clone().multiply(new Q().setFromRotationMatrix(M4.makeBasis(new V().crossVectors(Y,Z),Y,Z)));let rr=Math.abs(2*Math.atan2(lq.y,lq.w));if(rr>Math.PI)rr=2*Math.PI-rr;
        if(prev&&pp.dot(prev)<lim||pp.dot(inw)>.35)continue;const c=(rr/1.4)**2+3*Math.max(0,pp.dot(inw)+.1)**2+3*Math.max(0,pp.dot(up)+.15)**2+1.5*Math.max(0,-pp.dot(inw)-.55)**2+2*Math.max(0,pp.dot(fw)-.2)**2+(prev?.5*(1-pp.dot(prev)):0);
        if(c<bc){bc=c;best=pp;}}
      if(!best)best=prev||el0;nx[sd]=best;o['p'+sd]=best.toArray();}
    PP=nx;return o;};
  const lift=p=>{const o=Object.assign({},p),f=p.fl[0]*flk;o.HP=[p.HP[0],p.HP[1]+f,p.HP[2]];for(const c of['FL','FR']){const F=p[c].slice();F[3]=(F[3]||0)+f;o[c]=F;}o.gR=[p.gR[0],p.gR[1]+f,p.gR[2]];o.gL=[p.gL[0],p.gL[1]+f,p.gL[2]];return o;};
  const solve=p0=>{let p=yawF(lift(p0));wrSolve(R,p);p=poles(p);const s=wrSolve(R,p);s.wR=[p.wr[0]*.4,p.wr[1],p.wr[2]];s.wL=[p.wl[0]*.4,-p.wl[1],-p.wl[2]];s.fist=p.fist;return s;};
  /* extra tracks every clip carries: jaw, the two blood orbs, the body group (scale about its middle and spin), the smoke (puffs only
     in the clips that use it) and the cape */
  const extra=(c,fn,F,smoke)=>{const T=Array.from(c.tracks[0].times),JQ=[],OR=[],OL=[],VS=[],VQ=[],VP=[],SM=[],q=new Q(),e=new THREE.Euler(),pv=1.1+.3*flk;
    for(const t of T){const p=fn(t);q.setFromEuler(e.set(p.jw[0],0,0));JQ.push(q.x,q.y,q.z,q.w);const or=Math.max(.001,p.oR[0]),ol=Math.max(.001,p.oL[0]);OR.push(or,or,or);OL.push(ol,ol,ol);
      const s=Math.max(.001,p.vb[0]);VS.push(s,s,s);VP.push(0,pv*(1-s),0);q.setFromEuler(e.set(0,p.vb[1]*Math.PI/180,0));VQ.push(q.x,q.y,q.z,q.w);const sv=p.sm[0]>.002&&p.sm[0]<.998?1:.001;SM.push(sv,sv,sv);}
    c.tracks.push(new THREE.QuaternionKeyframeTrack('g_jaw.quaternion',T,JQ),new THREE.VectorKeyframeTrack('orb_R.scale',T,OR),new THREE.VectorKeyframeTrack('orb_L.scale',T,OL),
      new THREE.VectorKeyframeTrack('vbody.scale',T,VS),new THREE.VectorKeyframeTrack('vbody.position',T,VP),new THREE.QuaternionKeyframeTrack('vbody.quaternion',T,VQ),new THREE.VectorKeyframeTrack('vsmoke.scale',T,SM));
    if(smoke)VL_PUFF.forEach((P,j)=>{const PP=[],SS=[];for(const t of T){const u=vlPuff(P,fn(t).sm[0],.3*flk);PP.push(...u.p);SS.push(u.s,u.s,u.s);}
      c.tracks.push(new THREE.VectorKeyframeTrack(`vsmoke_${j}.position`,T,PP),new THREE.VectorKeyframeTrack(`vsmoke_${j}.scale`,T,SS));});
    vlCapeTracks(c,F);};
  /* a clip: one-shot clips let the cape settle on the first pose first; looping clips run two warm-up cycles, then spread what is left
     of the cape's difference between the last and first frame over the cycle, so the loop seam never jumps */
  const CC=(name,dur,fn,o={})=>{PP=null;const n=Math.max(2,Math.round(dur*30)),dt=dur/n,wind=t=>o.wind?o.wind(t):[0,0,0],fr=t=>typeof o.front==="function"?o.front(t):!!o.front;solve(fn(0));cape.reset();
    if(o.loop){for(let c=0;c<2;c++)for(let i=0;i<n;i++){const t=i*dt,p=fn(t);solve(p);cape.step(p,wind(t),dt,fr(t));}}
    else{const p=fn(0);solve(p);for(let i=0;i<40;i++)cape.step(p,wind(0),1/30,fr(0));PP=null;}
    const F=[],c=sampleClip(name,dur,t=>{const p=fn(t),s=solve(p);cape.step(p,wind(t),dt,fr(t));F.push(cape.snap());return s;},Object.assign({autoFeet:false},o),B);
    if(o.loop){const E=F[F.length-1].map((v,j)=>v-F[0][j]);F.forEach((f,i)=>{const w=i/(F.length-1);for(let j=0;j<f.length;j++)f[j]-=E[j]*w;});}
    extra(c,fn,F,o.smoke);if(o.next)c.next=o.next;if(o.hold)c.hold=true;L.push(c);return c;};
  const KC=(name,dur,keys,note,o={})=>{const f=wrKeys(keys.map(k=>[k[0],wrP(o.base||VL_W,k[1]||{})]));return CC(name,dur,o.add?t=>o.add(t,f(t)):f,Object.assign({note,next:'Idle (war mode)'},o));};

  /* ---- floating ---- */
  CC('Idle',5,t=>{const p=D*t/5,b=S(p),b2=S(2*p);return wrP(VL_H,{fl:[.3+.025*b],h:[1.2*b2,0,1.2*S(p+.4)],sp:[-2+.6*b2,0,0],ch:[-3+b2,3*S(p+.8),0],hd:[2+2*S(2*p+1),26*S(p+.6),0],
    FL:[.08,-.01+.025*S(p+.6),6,-.06,46+5*S(p+.6)],FR:[-.08,-.05+.025*S(p+2.2),-6,-.05,42+5*S(p+2.2)],gR:[-.27,.87+.01*b2,.07+.015*S(p+.3)],gL:[.27,.87+.01*b2,.07+.015*S(p+.9)],
    fist:[28+14*Math.max(0,S(3*p)),28+14*Math.max(0,S(3*p+2))]});},{loop:true,note:'Floats upright at knee height, bobbing slowly, looks round, the long fingers twitch, the cape hanging'});
  {const F=CC('Float',2.4,t=>{const p=D*t/2.4,b=S(p),b2=S(2*p);return wrP(VL_H,{fl:[.34+.02*b2],h:[16+b2,0,1.5*b],sp:[4,0,0],ch:[2,0,-b],hd:[2*S(2*p+1),0,0],
    FL:[.08,-.2+.02*b,6,-.02,62],FR:[-.08,-.24-.02*b,-6,0,60],gR:[-.26,.94,-.03+.01*b2],gL:[.26,.94,-.03-.01*b2],fist:[35,35]});},
    {loop:true,note:'Glides forward leaning in, legs trailing, arms swept back, the cape streaming behind, in place, 1.4 m/s',wind:t=>[0,0,-7-1.5*S(D*t/1.2)]});F.speed=1.4;}
  CC('Idle (war mode)',2.6,t=>{const p=D*t/2.6,b=S(p);return wrP(VL_W,{fl:[.4+.03*b],ch:[2+1.2*S(2*p),0,0],hd:[-2+1.5*S(2*p+1),8*S(p),0],
    FL:[.1,.04+.02*S(p+.5),4,-.05,44+5*S(p+.5)],FR:[-.09,-.1+.02*S(p+2),-16,-.04,40+5*S(p+2)],gR:[-.36,1.2+.015*S(p+.4),.34],gL:[.36,1.22+.015*S(p+1.2),.36],
    wr:[12,0,-22-8*Math.max(0,S(2*p))],wl:[12,0,-22-8*Math.max(0,-S(2*p))],fist:[18+10*Math.max(0,S(2*p+.3)),18+10*Math.max(0,-S(2*p+.3))],jw:[.05+.12*Math.max(0,S(p+1))]});},
    {loop:true,note:'Hovers higher, leaning in a little, both clawed hands raised, fangs showing'});
  {const F=CC('Float (war mode)',2.0,t=>{const p=D*t/2,b=S(p),b2=S(2*p);return wrP(VL_W,{fl:[.42+.02*b2],h:[18,0,b],sp:[6,0,0],ch:[2,0,0],
    FL:[.1,-.16+.02*b,4,-.02,62],FR:[-.09,-.26-.02*b,-16,0,60],gR:[-.36,1.24,.4],gL:[.36,1.26,.42],jw:[.15]});},
    {loop:true,note:'Advances through the air, leaning in, claws forward, the cape streaming behind, in place, 1.0 m/s',wind:t=>[0,0,-6-1.2*S(D*t/1)]});F.speed=1.0;}

  /* ---- spells ---- */
  /* Spell 1 (blood bolt): draws a blood orb at the right side (elbow down), thrusts the open hand forward and hurls it */
  KC('Spell 1 (blood bolt)',2.0,[[0,{}],
    [.45,{fl:[.44],h:[4,18,0],sp:[2,6,0],ch:[0,10,0],hd:[-4,-16,0],gR:[-.4,1.1,.04],wr:[0,0,-30],fist:[18,4],oR:[.9],jw:[.25]}],
    [.7,{fl:[.4],h:[10,-12,0],sp:[6,-4,0],ch:[8,-10,0],hd:[-6,10,0],gR:[-.12,1.34,.62],wr:[20,0,10],fist:[18,0],oR:[1.15],jw:[.55]}],
    [.76,{fl:[.4],h:[10,-12,0],sp:[6,-4,0],ch:[8,-10,0],hd:[-6,10,0],gR:[-.12,1.35,.63],wr:[20,0,10],fist:[18,0],oR:[0],jw:[.55]}],
    [1.1,{h:[6,-6,0],ch:[4,-6,0],gR:[-.22,1.26,.52],fist:[18,10],oR:[0],jw:[.2]}],
    [2.0,{}]],'Draws a blood orb at its side, then thrusts the open hand forward and hurls it');
  /* Spell 2 (summon spawn): rises with both arms flung up and out, holding the cape's edges so it spreads like wings, blood orbs
     swelling in both hands and the head thrown back; then sweeps both hands down at the ground ahead on either side, the orbs dive
     into the earth (where the vampire spawn climb out: Rise from the ground), holds, lets the cape go and settles */
  {const WING={fl:[.55],h:[-2,0,0],sp:[-6,0,0],ch:[-8,0,0],nk:[-4,0,0],hd:[-18,0,0],gR:[-.66,1.6,-.04],gL:[.66,1.6,-.04],wr:[-10,0,-30],wl:[-10,0,-30],fist:[0,0],cR:[1,2],cL:[1,2]};
  const PT={fl:[.46],h:[16,0,0],sp:[10,0,0],ch:[8,0,0],nk:[6,0,0],hd:[8,0,0],gR:[-.5,1.0,.5],gL:[.5,1.0,.5],wr:[20,0,10],wl:[20,0,10],fist:[0,0],cR:[0,2],cL:[0,2]};
  KC('Spell 2 (summon spawn)',3.6,[[0,{}],
    [.35,{fl:[.44],h:[2,0,0],sp:[0,0,0],ch:[-2,0,0],gR:[-.5,1.3,.2],gL:[.5,1.32,.2],wr:[0,0,-26],wl:[0,0,-26],fist:[10,10],cR:[.6,2],cL:[.6,2],oR:[.2],oL:[.2],jw:[.2]}],
    [.8,wrP(WING,{oR:[.8],oL:[.8],jw:[.8]})],
    [1.45,wrP(WING,{fl:[.58],gR:[-.67,1.62,-.04],gL:[.67,1.62,-.04],oR:[1.1],oL:[1.1],jw:[.9]})],
    [1.75,wrP(PT,{oR:[.9],oL:[.9],jw:[.5]})],
    [1.82,wrP(PT,{oR:[0],oL:[0],jw:[.5]})],
    [2.7,wrP(PT,{gR:[-.5,1.0,.51],gL:[.5,1.0,.51],fist:[8,8],jw:[.3]})],
    [3.6,{}]],'Flings both arms up, spreading the cape like wings, blood orbs swelling in its hands; then sweeps them down at the ground on either side to call up the vampire spawn, and holds');}
  /* Spell 3 (blood drain): reaches out with an open left claw, clenches it and slowly drags the stolen blood back to its chest, the orb
     swelling, the head tipping back as it savours it */
  KC('Spell 3 (blood drain)',3.0,[[0,{}],
    [.5,{h:[10,-6,0],sp:[6,-2,0],ch:[8,-4,0],hd:[2,4,0],gL:[.16,1.38,.66],wl:[10,0,-10],fist:[0,18],oL:[.15],jw:[.3]}],
    [1.0,{h:[10,-6,0],sp:[6,-2,0],ch:[8,-4,0],hd:[2,4,0],gL:[.16,1.4,.64],wl:[10,0,-10],fist:[70,18],oL:[.35],jw:[.2]}],
    [2.0,{h:[0,4,0],sp:[-2,2,0],ch:[-6,4,0],hd:[-14,0,0],gL:[.2,1.3,.26],wl:[0,0,-10],fist:[80,18],oL:[.95],jw:[.5]}],
    [2.4,{h:[0,4,0],sp:[-3,2,0],ch:[-8,4,0],hd:[-18,0,0],gL:[.2,1.31,.25],wl:[0,0,-10],fist:[82,18],oL:[1.05],jw:[.55]}],
    [3.0,{}]],'Reaches out with an open claw, clenches it and drags the stolen blood back to its chest, the orb swelling, head tipping back');
  /* Claw slash: the right claw rises high beside the head and rakes down across to the left as he darts in through the air */
  KC('Claw slash',1.4,[[0,{}],
    [.38,{HP:[0,0,-.06],h:[2,22,0],sp:[0,8,0],ch:[-4,12,0],hd:[-4,-18,0],gR:[-.5,1.62,.12],wr:[-10,0,-30],fist:[18,0],jw:[.5]}],
    [.56,{HP:[0,0,.12],h:[14,4,0],sp:[8,2,0],ch:[8,4,0],hd:[0,-4,0],gR:[-.32,1.3,.6],wr:[10,0,-10],fist:[18,0],jw:[.7]}],
    [.72,{HP:[0,0,.18],h:[20,-14,0],sp:[10,-6,0],ch:[10,-10,0],hd:[4,12,0],gR:[.12,1.0,.56],wr:[20,0,20],fist:[18,10],jw:[.5]}],
    [.9,{HP:[0,0,.16],h:[18,-14,0],sp:[10,-6,0],ch:[10,-10,0],hd:[4,12,0],gR:[.14,1.0,.5],wr:[20,0,20],fist:[18,20],jw:[.3]}],
    [1.4,{}]],'The right claw rises beside the head and rakes down across as he darts in through the air');
  /* Taunt (laugh): spreads the arms low with the palms up, holding the cape open, throws the head back and laughs */
  {const T0={fl:[.44],h:[-2,0,0],sp:[-4,0,0],ch:[-6,0,0],nk:[-6,0,0],hd:[-20,0,0],gR:[-.58,1.1,.2],gL:[.58,1.1,.2],wr:[-20,0,-20],wl:[-20,0,-20],fist:[8,8],cR:[1,3],cL:[1,3]};
  KC('Taunt (laugh)',3.0,[[0,{}],[.5,wrP(T0,{jw:[.3]})],[2.4,wrP(T0,{fl:[.46],gR:[-.59,1.11,.21],gL:[.59,1.11,.21]})],[3.0,{}]],
    'Spreads the arms low, holding the cape open, throws the head back and laughs',
    {add:(t,p)=>{if(t<.5||t>2.5)return p;const w=Math.min(1,(t-.5)/.2,(2.5-t)/.2),g=Math.max(0,S(D*(t-.5)/.32))*w;return Object.assign({},p,{jw:[p.jw[0]+.45*g],ch:[p.ch[0]-2*g,0,0],hd:[p.hd[0]-3*g,p.hd[1],0]});}});}

  /* ---- reactions ---- */
  KC('Hit 1',.9,[[0,{}],
    [.1,{fl:[.44],HP:[0,0,-.16],h:[-8,0,0],sp:[-10,0,0],ch:[-14,0,0],nk:[-8,0,0],hd:[-24,0,6],gR:[-.44,1.36,.16],gL:[.46,1.4,.18],wr:[-10,0,-30],wl:[-10,0,-30],fist:[5,5],jw:[.6]}],
    [.36,{fl:[.42],HP:[0,0,-.08],h:[2,0,0],sp:[0,0,0],ch:[-2,0,0],hd:[-8,0,0],gR:[-.38,1.26,.26],gL:[.4,1.28,.28],jw:[.25]}],
    [.9,{}]],'Knocked back through the air, head snapping back, then drifts in again');
  KC('Hit 2',1.1,[[0,{}],
    [.1,{fl:[.42],HP:[.12,0,0],h:[6,16,-10],sp:[4,8,-6],ch:[0,10,-8],hd:[-10,20,-12],gR:[-.3,1.16,.36],gL:[.5,1.3,.22],wl:[-10,0,-30],fist:[15,5],jw:[.5]}],
    [.38,{fl:[.42],HP:[.08,0,0],h:[8,-2,-6],sp:[6,-2,-4],ch:[4,-2,-4],hd:[-2,6,-4],gL:[.4,1.24,.32],jw:[.2]}],
    [.7,{HP:[.02,0,0]}],
    [1.1,{}]],'Struck from the right: twists away and drifts aside, then turns back');

  /* ---- vanish and reappear ---- */
  /* Vanish: sweeps the cape up across the face with the right arm and draws the left edge round the waist; smoke billows up from the
     hem, he spins and shrinks to nothing inside it, the smoke swirls out and thins away. Held at the end (nothing left) */
  KC('Vanish',3.4,[[0,{}],
    [.55,wrP(VL_WRAP,{cR:[.85,2],cL:[.7,3]})],
    [.9,wrP(VL_WRAP,{sm:[.02]})],
    [1.4,wrP(VL_WRAP,{fl:[.36],sm:[.4]})],
    [1.62,wrP(VL_WRAP,{fl:[.38],sm:[.47],vb:[.75,160]})],
    [1.95,wrP(VL_WRAP,{fl:[.4],sm:[.58],vb:[.001,620]})],
    [3.4,wrP(VL_WRAP,{fl:[.4],sm:[1],vb:[.001,620]})]],
    'Sweeps the cape up across its face and wraps itself in it; smoke billows up from the hem, it spins and shrinks to nothing inside the smoke, which swirls away (held: gone)',{smoke:true,hold:true,next:null,front:true});
  /* Reappear: smoke gathers out of nothing and he grows out of it spinning, arms spread and holding the cape open behind him like
     wings; the smoke clears, he laughs, lets the cape go and settles into the war hover */
  {const OPEN={fl:[.46],h:[-2,0,0],sp:[-4,0,0],ch:[-6,0,0],nk:[-2,0,0],hd:[-8,0,0],gR:[-.62,1.42,0],gL:[.62,1.42,0],wr:[-10,0,-30],wl:[-10,0,-30],fist:[5,5],cR:[1,2],cL:[1,2],jw:[.2]};
  KC('Reappear',2.8,[[0,wrP(OPEN,{fl:[.4],sm:[1],vb:[.001,-620]})],
    [.55,wrP(OPEN,{fl:[.4],sm:[.6],vb:[.001,-620]})],
    [.85,wrP(OPEN,{fl:[.42],sm:[.5],vb:[.7,-160]})],
    [1.05,wrP(OPEN,{fl:[.44],sm:[.44],vb:[1,0]})],
    [1.6,wrP(OPEN,{fl:[.46],gR:[-.63,1.44,0],gL:[.63,1.44,0],hd:[-14,0,0],sm:[.15],jw:[.8]})],
    [2.0,wrP(OPEN,{fl:[.46],gR:[-.62,1.42,.02],gL:[.62,1.42,.02],sm:[.002],jw:[.4]})],
    [2.8,{}]],'Smoke gathers out of nothing and he grows out of it, spinning, holding the cape open behind him like wings; the smoke clears, he laughs and lets the cape go',{smoke:true});}
  return VLCLIPS[key]=L;}

ASSETS.push({id:'vampire',folder:'characters/enemies/undead',name:'Vampire',kind:'character',variants:true,defaultSeed:1,groundR:2.2,build:(s,o)=>buildVampire(s,o||{}),
  opts:[{key:'skin',label:'Skin',choices:[['random','Random'],...Object.entries(VL_SKIN).map(([k,v])=>[k,v[1].charAt(0).toUpperCase()+v[1].slice(1)])],def:'random'},
    {key:'hair',label:'Hair',choices:[['random','Random'],['black','Black'],['silver','Silver'],['brown','Dark brown']],def:'random'},
    {key:'eyes',label:'Eyes',choices:[['random','Random'],['red','Red glow'],['amber','Amber glow'],['violet','Violet glow']],def:'random'},
    {key:'coat',label:'Coat',choices:[['random','Random'],['black','Black'],['blue','Midnight blue'],['wine','Burgundy']],def:'random'},
    {key:'lining',label:'Cape lining',choices:[['random','Random'],['crimson','Crimson'],['purple','Purple'],['black','Black']],def:'random'},
    {key:'float',label:'Float height',choices:[['medium','Medium (knee height)'],['low','Low (just off the ground)'],['high','High (half a metre)']],def:'medium'}],
  desc:'Vampire lord (mini boss, phase 1): a tall, pale gentleman of about 1.86 m who floats above the ground: slicked-back hair with a widow\'s peak, pointed ears, glowing eyes, two fangs, a frock coat over a waistcoat, a white cravat with a ruby brooch, tall boots, long fingers with dark nails, and a long black cape with a high collar and a coloured lining that moves as cloth. Clips: Idle, Float, war-mode Idle and Float, Spell 1 (blood bolt), Spell 2 (summon spawn: spreads the cape like wings and calls the vampire spawn up out of the ground), Spell 3 (blood drain), Claw slash, Taunt (laugh), Hit 1, Hit 2, Vanish (wraps himself in the cape and disappears in smoke) and Reappear.'});
