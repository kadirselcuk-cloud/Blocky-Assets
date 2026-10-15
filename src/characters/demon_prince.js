/* ======================= DEMON PRINCE: a huge winged fire demon with a whip and a burning weapon (Enemies → Hell) =======================
   After the owner's request: basically a balrog, made to look like the one in the Lord of the Rings films. A hunched, massive demon
   about 4.2 m to the top of the head (VB.dprince: the devil lord's proportions x DP_F 1.9, broader shoulders): charred rock-black
   skin in plates, crossed by glowing lava cracks; a bestial head with a heavy brow, deep glowing eyes, a short muzzle, fangs and a jaw
   that opens onto fire (g_jaw); great horns sweeping out and forward like a bull's (or ram, or swept back); bony spikes on the
   shoulders, forearms and down the back; clawed hands and clawed beast feet. A mane of square fire (the efreet's voxel smoke) burns on
   the head, the neck, the shoulders and down the back, and at the tip of the long spined tail (dptail_0..13). Huge dark tattered
   wings (dwing_{L,R} / dwingO_{L,R}, the devil lord's wing x 1.15) with ember edges, half closed on the ground.
   Left hand: a long whip of fire (handle dp_prop_L, lash dpw_0..13). Right hand (dp_prop_R): a burning curved sword, a fiery axe or a
   burning flail (chain dpc_0..5, the last one carries the ball). The lash and the chain are ropes simulated while the clips are made
   (verlet points, fixed lengths, the ground with friction, capsules round the body, legs and tail) and baked into quaternion tracks.
   Clips use the devil lord's machinery (the succubus's arms with a prop in each hand, wing beat, tail) on this rig; the fire cubes
   are baked as position and scale tracks (whole cycles per clip, so loops close); fi scales the fire (Roar and Flame burst flare it,
   Death puts it out). */
const DP_F=1.9;
/* strong goat legs (the fiend's, x DP_LG 1.4): the hips stand lower than the straight leg reaches, so the knee bends forward and the
   shin runs back to a raised hock; the IK 'ankle' is the hock and the IK foot is the cannon bone and the cloven hoof (R.noHeel). legS
   is kept at the devil lord's x DP_F, so his keys carry over */
const DP_LG=1.4;
VB.dprince=Object.assign({},VB.male,{thigh:.62*DP_LG,shin:.6*DP_LG,ankle:.5*DP_LG,hipOff:.08*DP_LG,spine:.13*DP_F,chest:.26*DP_F,neck:.26*DP_F,headY:.08*DP_F,shW:.38*DP_F,ua:.36*DP_F,fa:.32*DP_F,g:1.22*DP_F,hipW:.29,sex:'male'});
{const b=VB.dprince;b.key='dprince';b.hipH=1.52*DP_LG;b.legS=(.52+.5)*DP_F/.84;b.tS=(b.spine+b.chest)/.3;b.cS=b.neck/.22;}
const DP_SKIN={charred:['#1e1a1a','charred black'],ash:['#363032','ash grey'],ember:['#2a1a16','smouldering brown']};
const DP_FIRE={orange:['#ffcc5c','#ff8a2a','#d8481a','#ff8a2a','orange'],crimson:['#ff9a5a','#f0502a','#a8281a','#f0502a','crimson'],green:['#a4ecbc','#4cd88a','#1e8a54','#4cd88a','green']};
const DP_HORN={great:'great horns sweeping out and forward like a bull\'s',ram:'curling ram horns',swept:'long horns swept back'};
const DP_WPN={sword:'a burning curved sword',axe:'a fiery axe',flail:'a burning flail'};
const DP_BEND=110*Math.PI/180,DP_WS=1.6*DP_F*1.15,DP_TAIL=18,DP_TL=.105*DP_F;
/* the balrog wing (after the film: huge bat wings held raised and half open, long fanned fingers, a torn membrane of shadow whose
   edges dissolve into smoke): four fingers from the wrist [angle° from straight out, length] in wing units, and the membrane between
   them in fan slices (3 per sector), each with its scalloped, ragged edge radius Re */
const DP_FING=[[-20,1.0],[-50,.95],[-78,.85],[-105,.65]];
function dpWingSlices(){const out=[],S=[[-20,1.0,-50,.95],[-50,.95,-78,.85],[-78,.85,-105,.65],[-105,.65,-140,.45]];
  S.forEach(([a1,R1,a2,R2],si)=>{for(let k=0;k<3;k++){const u=(k+.5)/3;out.push({si,k,th:(a1+(a2-a1)*u)*Math.PI/180,dth:Math.abs(a2-a1)/3*Math.PI/180,Re:(R1+(R2-R1)*u)*(1-.26*Math.sin(Math.PI*u))*(.9+.1*Math.sin(si*7.3+k*3.1))});}});return out;}
const DP_WSL=dpWingSlices(),DP_WA=.45;
/* smoke always drifting off the wings' edges (dark, a few embers), on the outer wing dwingO_{L,R}; base points in wing units / DP_F */
const DP_WSMOKE=(()=>{const r=mulberry32(909),L=[];for(const[sd,s]of[['L',1],['R',-1]])DP_WSL.forEach(sl=>{for(let k=0;k<2;k++){const rr=sl.Re*(.9+.1*r()),th=sl.th+(r()-.5)*sl.dth,ty=k?(r()<.3?0:1):2;
    L.push({par:'dwingO_'+sd,p:[s*rr*Math.cos(th)/DP_F,rr*Math.sin(th)/DP_F,0],ty,P:[1.4,1.8,2.2][ty]*(.85+.3*r()),ph:r(),sz:[.07,.11,.14][ty]*(.8+.4*r()),rise:[.6,.9,1.2][ty]*(.8+.4*r()),dx:(r()-.5)*.5,dz:(r()-.5)*.5-.15,smoke:true,wing:true});}});return L;})();
/* rope specs: the whip's lash (14 segments, about 4.5 m) and the flail's chain (5 links and the ball's stem). L segment lengths, th
   thickness, w inverse mass per point (0 = the anchor), ymin lowest centre height per point, rad collision radius per point, kh pull
   of the first segment along the handle, kb bending stiffness */
const DP_ROPE=(()=>{const F=DP_F,W={pre:'dpw_',sd:'L',N:14,anc:.28*F,L:[],th:[],w:[0],ymin:[0],rad:[0],kh:.03,kb:0,damp:.992},C={pre:'dpc_',sd:'R',N:6,anc:.42*F,L:[],th:[],w:[0],ymin:[0],rad:[0],kh:0,kb:0,damp:.995};
  for(let i=0;i<14;i++){const t=(.045-.029*i/13)*F;W.L.push(.17*F);W.th.push(t);W.w.push(1);W.ymin.push(t*.8+.04);W.rad.push(t*.6);}
  for(let i=0;i<6;i++){C.L.push(i<5?.09*F:.1*F);C.th.push(.035*F);const ball=i===5;C.w.push(ball?1/6:1);C.ymin.push(ball?.19*F+.01:.03*F);C.rad.push(ball?.17*F:.02*F);}
  return{whip:W,flail:C};})();
/* square fire: cubes born at a point on their parent, swelling, then shrinking and darkening as they rise and drift (the efreet's
   voxel smoke). par parent name, p base point (devil-lord units, x DP_F), ty 0 hot / 1 mid / 2 deep, P period, ph phase, sz size,
   rise, drift dx dz */
function dpFx(seed,list){const r=mulberry32(seed),L=[];for(const[par,n,c,s,k]of list)for(let i=0;i<n;i++){const ty=i%3,kk=k||1;
    L.push({par,p:[c[0]+(r()-.5)*s[0],c[1]+(r()-.5)*s[1],c[2]+(r()-.5)*s[2]],ty,P:[.6,.8,1.0][ty]*(.85+.3*r()),ph:r(),sz:[.075,.052,.034][ty]*(.8+.4*r())*kk,rise:[.22,.42,.66][ty]*(.8+.4*r())*kk,dx:(r()-.5)*.2,dz:(r()-.5)*.2});}
  return L;}
const DP_MANE=dpFx(4242,[['head',24,[0,.31,-.06],[.24,.05,.24],1.7],['neck',12,[0,.13,.07],[.18,.05,.2],1.5],['chest',20,[0,.33,-.04],[.5,.05,.24],1.5],['chest',14,[0,.18,-.19],[.4,.24,.03],1.3],
  ['spine',8,[0,.12,-.15],[.2,.2,.03],1.1],['upperArm_L',6,[.04,.1,0],[.14,.03,.18],1.1],['upperArm_R',6,[-.04,.1,0],[.14,.03,.18],1.1]]);
/* black smoke for Death: big dark cubes rising slowly from the body, growing as they go (sm scales them) */
const DP_SMOKE=dpFx(777,[['chest',14,[0,.18,0],[.5,.3,.3]],['spine',8,[0,.1,0],[.36,.3,.24]],['hips',5,[0,-.04,0],[.4,.2,.28]],['head',5,[0,.2,0],[.24,.2,.24]],
  ['upperArm_L',3,[0,-.15,0],[.15,.3,.15]],['upperArm_R',3,[0,-.15,0],[.15,.3,.15]],['thigh_L',3,[0,-.25,0],[.18,.4,.18]],['thigh_R',3,[0,-.25,0],[.18,.4,.18]]]).map(P=>Object.assign(P,{P:P.P*2.8,sz:P.sz*2.2,rise:P.rise*3.2,dx:P.dx*3,dz:P.dz*3,smoke:true}));
const DP_HOT=(L,n)=>{L.forEach((P,i)=>{if(P.ty===0&&i%n===0)P.hot=true;});return L;};
const DP_WFX={sword:dpFx(51,[]),axe:dpFx(52,[['dp_prop_R',24,[.19,.94,0],[.18,.34,.04]]]),flail:dpFx(53,[['dpc_5',24,[0,.1,0],[.24,.24,.24],.9]]),whip:dpFx(54,[])};
{const r=mulberry32(55);for(let k=0;k<30;k++){const u=.06+.94*r(),ty=k%3;DP_WFX.sword.push({par:'dp_prop_R',p:[-.16*u*u+(r()-.5)*.08,.13+1.05*u,(r()<.5?-1:1)*(.012+.02*r())],ty,P:[.6,.8,1.0][ty]*(.85+.3*r()),ph:r(),sz:[.06,.042,.028][ty]*(.85+.3*r()),rise:[.16,.3,.46][ty]*(.8+.4*r()),dx:(r()-.5)*.14,dz:(r()-.5)*.14});}
  for(let k=0;k<20;k++){const ty=k%3,i=2+Math.floor(r()*12);DP_WFX.whip.push({par:'dpw_'+i,p:[0,.17*r(),0],ty,P:[.5,.7,.9][ty]*(.85+.3*r()),ph:r(),sz:[.04,.03,.02][ty]*(.85+.3*r()),rise:[.12,.22,.34][ty]*(.8+.4*r()),dx:(r()-.5)*.1,dz:(r()-.5)*.1});}}
/* a few cubes keep the bright colour for a feeling of fire; the wings' dark cubes stay in Death, their coloured ones fade with the fire */
DP_HOT(DP_MANE,15);for(const k in DP_WFX)DP_HOT(DP_WFX[k],12);DP_WSMOKE.forEach((P,i)=>{P.dark=P.ty!==0;if(P.ty===0&&i%4===0)P.hot=true;});

/* the right-hand weapons: grip at the origin, along local y, the edge towards +x (devil-lord units, scaled by DP_F) */
function dpWeapon(kind,M){const F=DP_F,w=new THREE.Group(),X=(w0,h,d,m,x,y,z,rx,ry,rz)=>bx(w,w0*F,h*F,d*F,m,x*F,y*F,z*F,rx,ry,rz),H=(P,a,b,m,mD)=>ncHorn(w,P.map(p=>p.map(v=>v*F)),a*F,b*F,m,mD);
  const{iron,ironL,ironD,grip,hot,mid,deep,crack}=M;
  if(kind==='sword'){X(.045,.2,.045,grip,0,-.02,0);for(const y of[-.08,.04])X(.05,.015,.05,iron,0,y,0);X(.06,.05,.06,ironL,0,-.14,0,0,Math.PI/4,0);X(.025,.04,.025,iron,0,-.18,0);
    /* an eight-sided guard (no cross) and a collar */
    X(.11,.03,.11,iron,0,.095,0);X(.11,.03,.11,iron,0,.095,0,0,Math.PI/4,0);X(.07,.04,.05,ironD,0,.12,0);
    const n=8,y0=.13,Lb=1.05;
    for(let i=0;i<n;i++){const u=(i+.5)/n,wd=.08+.045*Math.sin(Math.min(1,u*1.15)*Math.PI*.55),x=-.16*u*u,a=Math.atan(-.32*u),h=Lb/n,cy=y0+h*(i+.5),g=new THREE.Group();
      put(w,g,x*F,cy*F,0,0,0,-a);const Y=(w0,hh,d,m,xx,yy,zz,rz)=>bx(g,w0*F,hh*F,d*F,m,xx*F,yy*F,zz*F,0,0,rz||0);
      if(i<n-1){Y(wd,h*1.06,.02,iron,0,0,0);Y(.016,h*1.06,.024,ironD,-wd/2+.008,0,0);Y(.014,h*1.06,.026,hot,wd/2-.006,0,0);Y(.012,h*1.06,.024,mid,wd/2-.02,0,0);
        if(i>0)Y(i%2?.012:.02,h*.55,.026,crack,-wd*.12,0,0,i%2?0:.6);}
      else{Y(wd*.7,h*.6,.02,iron,-wd*.1,-h*.2,0);Y(wd*.45,h*.45,.02,iron,-wd*.22,h*.22,0,.55);Y(.014,h*.75,.026,hot,wd*.22,-.01,0,.5);}}}
  else if(kind==='axe'){X(.05,1.2,.05,grip,0,.46,0);for(const y of[-.06,.08,.5,.78])X(.058,.03,.058,iron,0,y,0);X(.075,.06,.075,ironL,0,-.15,0,0,Math.PI/4,0);
    X(.09,.22,.09,iron,0,.94,0);X(.1,.02,.1,ironL,0,.84,0);X(.1,.02,.1,ironL,0,1.04,0);
    /* the crescent bit towards +x with a molten edge, a back spike, a top spike, glowing runes */
    X(.17,.24,.028,iron,.13,.94,0);X(.07,.36,.028,iron,.24,.94,0);X(.07,.1,.028,iron,.24,1.12,0,0,0,-.55);X(.07,.1,.028,iron,.24,.76,0,0,0,.55);
    X(.026,.38,.034,hot,.28,.94,0);X(.024,.1,.034,hot,.275,1.14,0,0,0,-.55);X(.024,.1,.034,hot,.275,.74,0,0,0,.55);X(.02,.3,.032,mid,.255,.94,0);
    X(.03,.03,.032,crack,.12,.94,0,0,0,Math.PI/4);X(.012,.1,.032,crack,.17,.94,0);
    H([[-.04,.94,0],[-.12,.96,0],[-.19,.93,0]],.07,.016,iron,ironD);H([[0,1.05,0],[0,1.13,0],[0,1.21,0]],.045,.012,iron,ironD);}
  else{/* flail: a banded handle and a cap; the chain (dpc_*) and ball are added by dpChain */
    X(.05,.5,.05,grip,0,.12,0);for(const y of[-.1,.12,.34])X(.058,.025,.058,iron,0,y,0);X(.07,.05,.07,ironL,0,-.15,0,0,Math.PI/4,0);
    X(.08,.06,.08,iron,0,.38,0);X(.03,.04,.012,ironD,0,.42,0);}
  return w;}
/* the whip's handle (a black leather grip with glowing bands and an iron pommel) and the lash dpw_0..13 hanging from its end */
function dpWhip(M){const F=DP_F,w=new THREE.Group(),X=(w0,h,d,m,x,y,z,rx,ry,rz)=>bx(w,w0*F,h*F,d*F,m,x*F,y*F,z*F,rx,ry,rz);const{iron,ironL,grip,hot,mid,deep,crack}=M,R=DP_ROPE.whip;
  X(.05,.4,.05,grip,0,.06,0);for(const y of[-.06,.08,.2])X(.056,.02,.056,crack,0,y,0);X(.07,.05,.07,ironL,0,-.16,0,0,Math.PI/4,0);X(.06,.04,.06,iron,0,.27,0);
  let p=w;for(let i=0;i<R.N;i++){const g=new THREE.Group();g.name=R.pre+i;g.position.set(0,i?R.L[i-1]:R.anc,0);p.add(g);const t=R.th[i],L=R.L[i];
    bx(g,t,L*1.04,t,i%2?deep:mid,0,L/2,0);bx(g,t*1.12,L*.18,t*1.12,i%3===1?hot:grip,0,L*.5,0);if(i===R.N-1){bx(g,t*1.4,L*.3,t*.6,hot,0,L*.9,0);}p=g;}
  return w;}
/* the flail's chain: five links (alternating flat plates) and the ball's stem dpc_5 carrying a spiked, glowing iron ball */
function dpChain(w,M){const F=DP_F,{iron,ironL,ironD,hot,crack}=M,R=DP_ROPE.flail;let p=w;
  for(let i=0;i<R.N;i++){const g=new THREE.Group();g.name=R.pre+i;g.position.set(0,i?R.L[i-1]:R.anc,0);p.add(g);const L=R.L[i];
    if(i<5){bx(g,.035*F,L*1.06,.012*F,i%2?iron:ironL,0,L/2,0,0,i%2?Math.PI/2:0,0);}
    else{const b=new THREE.Group();b.position.set(0,L,0);g.add(b);bx(b,.2*F,.2*F,.2*F,iron,0,0,0);bx(b,.17*F,.17*F,.17*F,ironD,0,0,0,Math.PI/4,Math.PI/4,0);
      for(const[x,y,z]of[[1,0,0],[0,0,1],[0,-1,0]])bx(b,.205*F*(x?0:1)+.012*F,.205*F*(y?0:1)+.012*F,.205*F*(z?0:1)+.012*F,crack,0,0,0);
      const V=THREE.Vector3;[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1],[1,1,1],[-1,1,1],[1,-1,1],[-1,-1,1],[1,1,-1],[-1,1,-1],[1,-1,-1],[-1,-1,-1]].forEach(d=>{const v=new V(...d).normalize(),m=bx(b,.04*F,.08*F,.04*F,ironD,v.x*.13*F,v.y*.13*F,v.z*.13*F);m.quaternion.setFromUnitVectors(new V(0,1,0),v);});
      bx(b,.06*F,.06*F,.06*F,hot,0,0,0);}
    p=g;}}

function buildDemonPrince(seed,o={}){const B=VB.dprince,F=DP_F,r=mulberry32(((seed*2654435761)>>>0)^0xba1e),pick=a=>a[Math.floor(r()*a.length)],root=new THREE.Group();root.userData.lights=[];
  /* roll everything, then let the options override */
  const skin0=pick(['charred','charred','ash','ember']),fire0=pick(['orange','orange','orange','crimson','green']),horn0=pick(['great','great','ram','swept']),wpn0=pick(['sword','sword','axe','flail']);
  const opt=(k,d)=>o[k]&&o[k]!=='random'?o[k]:d,skinK=opt('skin',skin0),fireK=opt('fire',fire0),hornK=opt('horns',horn0),wpnK=opt('weapon',wpn0);
  const shade=(h,f)=>'#'+new THREE.Color(h).multiplyScalar(f).getHexString(),SK=DP_SKIN[skinK][0],FC=DP_FIRE[fireK];
  const skin=bm(SK,'skin'),skinL=bm(shade(SK,1.45),'skin'),skinD=bm(shade(SK,.65),'skin'),dark=bm('#160f0f','plain'),claw=bm('#161212','plain'),teeth=bm('#cfc0a4','plain');
  const horn=bm('#141012','plain'),hornD=bm('#2a2224','plain'),iron=bm('#1c1a1e','plain'),ironL=bm('#3a363c','plain'),ironD=bm('#131116','plain'),grip=bm('#1e1212','leather');
  const hot=efGlow(FC[0],1.3),mid=efGlow(FC[1],1.0),deep=efGlow(FC[2],.8),crackM=wrGlow(shade(FC[3],.8),FC[3],1.0,pxTex('plain')),eyeM=wrGlow(FC[0],FC[1],1.8,pxTex('plain')),glowB=wrGlow('#f6f0e4',FC[1],2.4,pxTex('plain'));
  const wingB=bm(shade(SK,.9),'skin'),memb=bm(skinK==='ember'?'#2a1612':'#1c1616','plain'),membD=bm(skinK==='ember'?'#1c0e0a':'#161111','plain');
  const FM=[efGlow(shade(FC[1],.14),.25),mid,deep],M={iron,ironL,ironD,grip,hot,mid,deep,crack:crackM};
  /* boxes and horns in devil-lord units, scaled to metres */
  const X=(par,w,h,d,m,x,y,z,rx,ry,rz)=>bx(par,w*F,h*F,d*F,m,x*F,y*F,z*F,rx,ry,rz),H=(par,P,a,b,m,mD)=>ncHorn(par,P.map(p=>p.map(v=>v*F)),a*F,b*F,m,mD);
  const vb=new THREE.Group();vb.name='vbody';root.add(vb);
  const hips=J('hips',vb,0,B.hipH,0),spine=J('spine',hips,0,B.spine,0),chest=J('chest',spine,0,B.chest,0),neck=J('neck',chest,0,.28*F,.1*F),head=J('head',neck,0,.06*F,.2*F);
  /* glowing lava cracks: thin glowing bars laid on a surface, in a zigzag */
  const crack=(par,x,y,z,len,rz,ry=0)=>{X(par,.008,len*.55,.006,crackM,x,y+len*.22,z,0,ry,rz);X(par,.008,len*.5,.006,crackM,x+.006,y-len*.22,z,0,ry,rz-.5);};
  /* hips: rocky plates, a dark crotch plate */
  X(hips,.44,.24,.32,skin,0,-.04,0);X(hips,.46,.06,.3,skinD,0,.06,0);X(hips,.2,.16,.06,skinD,0,-.1,.15);X(hips,.12,.08,.04,skinL,0,-.03,.17);crack(hips,.1,-.06,.161,.1,.4);crack(hips,-.12,-.02,.161,.08,-.3);
  /* waist: abs as rock plates, obliques, a row of bony spikes down the back, cracks */
  X(spine,.4,.36,.28,skin,0,.08,0);for(const s of[-1,1])for(const y of[.0,.08,.16])X(spine,.08,.065,.02,y===.08?skinD:skinL,s*.046,y,.14);X(spine,.014,.24,.012,crackM,0,.08,.141);
  for(const s of[-1,1])X(spine,.05,.28,.22,skinD,s*.19,.08,0,0,0,-s*.08);for(const y of[.02,.16])H(spine,[[0,y,-.13],[0,y+.02,-.19],[0,y+.05,-.24]],.05,.014,horn,hornD);
  crack(spine,.12,.04,.141,.12,.5);crack(spine,-.13,.18,.141,.08,-.3);crack(spine,.15,.14,-.141,.1,.3);
  /* chest: massive (pecs, lats, a hump between the shoulders), rock plates on the back, spikes, cracks glowing through */
  X(chest,.58,.32,.34,skin,0,.12,0);X(chest,.66,.14,.3,skin,0,.08,-.01);X(chest,.44,.16,.26,skin,0,.27,-.05);
  for(const s of[-1,1]){X(chest,.25,.13,.06,skin,s*.12,.17,.17);X(chest,.24,.02,.05,skinD,s*.12,.105,.18);X(chest,.07,.14,.22,skinD,s*.3,.09,-.01);X(chest,.2,.18,.04,skinD,s*.12,.16,-.18);X(chest,.12,.1,.03,skinL,s*.14,.24,-.19);}
  for(const y of[.06,.18])H(chest,[[0,y,-.19],[0,y+.02,-.26],[0,y+.04,-.32]],.06,.016,horn,hornD);
  X(chest,.014,.16,.012,skinD,0,.17,.201);crack(chest,.13,.18,.201,.14,.7);crack(chest,.18,.12,.201,.08,-.4);crack(chest,-.08,.2,.201,.1,-.9);crack(chest,-.16,.15,.201,.12,.3);crack(chest,.03,.04,.171,.1,.2);
  crack(chest,.2,.1,-.201,.12,.5);crack(chest,-.18,.2,-.211,.1,-.4);
  /* neck: thick, a rock plate at the back */
  /* the neck rises out of the top of the chest between the shoulders and leans forward (a group ng tilted up 7° from level): short and
     thick, rounded (each ring a cross of a wide flat box and a narrow tall box with a box between, so the corners are cut off, no
     sharp edges), tapering towards the head; muscle bands along the sides, small spines along the top, a glowing seam under the throat */
  {const ng=new THREE.Group();ng.rotation.x=-7*Math.PI/180;neck.add(ng);X(ng,.3,.24,.12,skin,0,-.04,-.05);
  [[.29,.26,.08,0],[.26,.23,.08,.065],[.22,.2,.08,.125],[.19,.18,.08,.18]].forEach(([w,h,d,z],i)=>{X(ng,w,h*.7,d,i%2?skinD:skin,0,0,z);X(ng,w*.7,h,d,skin,0,0,z);X(ng,w*.88,h*.88,d*.98,skin,0,0,z);
    for(const sx of[-1,1])X(ng,.02,h*.55,d*.9,skinL,sx*(w/2+.005),-.01,z);X(ng,.012,.008,d,crackM,0,-h/2-.004,z);if(i<3)H(ng,[[0,h/2-.01,z],[0,h/2+.04,z-.03],[0,h/2+.07,z-.07]],.035,.01,horn,hornD);});}
  /* head: bestial: a skull with a crown plate, a heavy brow slanting down to the middle over deep glowing eyes, a short muzzle with a
     sloping bridge and nostrils, upper fangs, cheek spikes swept back, fire in the mouth; the jaw (g_jaw) opens */
  X(head,.28,.24,.28,skin,0,.2,-.03);X(head,.24,.08,.2,skinD,0,.33,-.05);X(head,.22,.1,.14,skin,0,.08,-.08);
  X(head,.3,.06,.08,skinD,0,.275,.1);X(head,.05,.06,.06,skinD,0,.235,.13);
  for(const s of[-1,1]){X(head,.15,.05,.06,skinD,s*.08,.262,.125,0,0,s*.22);X(head,.105,.06,.016,dark,s*.075,.222,.119);X(head,.085,.035,.014,eyeM,s*.075,.222,.126,0,0,s*.12);X(head,.03,.02,.01,glowB,s*.07,.224,.133);
    X(head,.07,.06,.1,skin,s*.12,.17,.1);X(head,.025,.012,.01,dark,s*.04,.165,.201);X(head,.018,.05,.018,teeth,s*.075,.085,.185);H(head,[[s*.13,.15,.04],[s*.17,.16,-.02],[s*.21,.18,-.08]],.045,.012,horn,hornD);}
  X(head,.22,.08,.12,skin,0,.14,.14);X(head,.2,.025,.1,skinL,0,.19,.135);X(head,.19,.02,.012,eyeM,0,.102,.196);X(head,.14,.05,.12,eyeM,0,.075,.1);X(head,.09,.035,.08,glowB,0,.07,.09);
  crack(head,.07,.29,.111,.07,.5);crack(head,-.11,.14,.111,.06,.25);
  const jw=new THREE.Group();jw.name='g_jaw';head.add(jw);jw.position.set(0,.1*F,.03*F);
  X(jw,.24,.07,.2,skin,0,-.04,.05);X(jw,.15,.05,.08,skin,0,-.07,.13);X(jw,.14,.02,.05,skinD,0,-.095,.14);X(jw,.12,.012,.012,dark,0,-.003,.171);for(const s of[-1,1])X(jw,.016,.04,.016,teeth,s*.05,.0,.14);crack(jw,.08,-.05,.151,.05,.4);
  /* horns from the upper sides of the skull, black and ridged, pointing outwards */
  const HP={great:[[.12,.3,0],[.2,.33,0],[.29,.35,.04],[.36,.38,.11],[.4,.43,.19],[.41,.49,.27],[.39,.54,.33]],
    ram:[[.11,.3,.02],[.18,.37,-.02],[.26,.38,-.09],[.31,.31,-.15],[.31,.21,-.12],[.27,.15,-.05],[.24,.16,.03]],
    swept:[[.1,.31,.03],[.15,.39,0],[.19,.46,-.07],[.21,.52,-.17],[.21,.56,-.29],[.19,.57,-.4],[.16,.55,-.48]]}[hornK];
  for(const s of[-1,1])H(head,HP.map(([x,y,z])=>[s*x,y,z]),hornK==='great'?.12:.1,.03,horn,hornD);
  /* arms: a rocky deltoid with spikes, big bare arms with cracks, a spiked elbow, spines on the forearms, big clawed hands */
  for(const[sd,s]of[['L',1],['R',-1]]){const sh=J('shoulder_'+sd,chest,s*B.shW*.325,.165*B.cS,0),ua=J('upperArm_'+sd,sh,s*B.shW*.675,0,0),fa=J('foreArm_'+sd,ua,0,-B.ua,0),hd=J('hand_'+sd,fa,0,-B.fa,0);
    const fg=J('fingers_'+sd,hd,0,-.12*F,0),ft=J('fingerTips_'+sd,fg,0,-.055*F,0),th=J('thumb_'+sd,hd,-s*.024*F,-.04*F,.055*F),so=J('socket_'+sd,hd,-s*.016*F,-.09*F,0);so.userData.socket=true;
    X(ua,.27,.2,.27,skin,s*.02,-.02,0);X(ua,.28,.06,.28,skinD,s*.025,.06,0);H(ua,[[s*.06,.08,0],[s*.11,.14,-.02],[s*.17,.18,-.04]],.06,.015,horn,hornD);H(ua,[[s*.13,.02,-.02],[s*.2,.06,-.04],[s*.25,.06,-.06]],.05,.012,horn,hornD);
    X(ua,.19,.34,.19,skin,0,-.2,0);X(ua,.13,.16,.07,skinL,0,-.2,.08);crack(ua,s*.096,-.22,.02,.14,.4,Math.PI/2);crack(ua,-s*.02,-.14,-.096,.1,-.3);
    X(fa,.19,.32,.19,skin,0,-.16,0);X(fa,.2,.07,.2,skinD,0,-.25,0);X(fa,.15,.1,.06,skinL,0,-.08,.07);H(fa,[[0,-.02,-.08],[0,0,-.15],[0,.05,-.2]],.05,.012,horn,hornD);
    for(const y of[-.12,-.22])H(fa,[[s*.09,y,-.02],[s*.14,y+.01,-.04],[s*.17,y+.03,-.05]],.035,.01,horn,hornD);crack(fa,s*.096,-.14,0,.1,.3,Math.PI/2);
    X(hd,.075,.12,.13,skin,0,-.06,0);
    for(const[z,Lp]of[[.042,.055],[.014,.062],[-.014,.058],[-.042,.048]]){const g1=new THREE.Group(),g2=new THREE.Group();g1.position.set(0,0,z*F);fg.add(g1);g2.position.set(0,(.055-Lp)*F,z*F);ft.add(g2);
      X(g1,.028,Lp,.028,skin,0,-Lp/2+.003,0);X(g2,.025,.04,.025,skin,0,-.02,0);X(g2,.018,.032,.018,claw,-s*.002,-.05,0);X(g2,.011,.024,.011,claw,-s*.005,-.073,0);}
    const tg=new THREE.Group();tg.rotation.set(-.6,0,-s*.15);th.add(tg);X(tg,.032,.055,.032,skin,0,-.024,0);X(tg,.027,.036,.027,skin,0,-.06,0);X(tg,.017,.03,.017,claw,0,-.088,0);}
  /* legs: the fiend's goat legs x DP_LG in rock skin: a heavy haunch with big quads and hamstrings forward to the knee, a thick-muscled
     shin back down to a pointed hock, a long cannon bone down to the fetlock (dewclaws behind) and a big cloven hoof on its toes (two
     wedge-shaped black claws stepping up towards the heel, ember seams); lava cracks. Rest pose: legs bent so the hooves stand */
  {const Lg=DP_LG,Y=(par,w,h,d,m,x,y,z,rx,ry,rz)=>bx(par,w*Lg,h*Lg,d*Lg,m,x*Lg,y*Lg,z*Lg,rx,ry,rz),TH=.62,fk=.5/.06,D2=Math.PI/180,hoof=bm('#2a2220','plain'),hoofL=bm('#4a3c34','plain'),restT=-42.5,restK=86.7;
  for(const[sd,s]of[['L',1],['R',-1]]){const th=J('thigh_'+sd,hips,s*B.hipW,-(B.hipOff+.014),0),sn=J('shin_'+sd,th,0,-B.thigh,0),ft=J('foot_'+sd,sn,0,-B.shin,0);
    th.rotation.x=restT*D2;sn.rotation.x=restK*D2;ft.rotation.x=-(restT+restK)*D2;
    Y(th,.46,TH+.16,.5,skin,0,-TH/2+.05,0);Y(th,.38,.32,.07,skinL,0,-.42,.27);Y(th,.07,.34,.38,skinD,s*.25,-.38,.02);Y(th,.36,.3,.07,skin,0,-.26,-.27);
    for(const[x,y,z]of[[.12,-.2,.26],[-.1,-.34,.26],[s*.25,-.14,-.1],[0,-.24,-.31],[-s*.22,-.48,.12]])Y(th,.09,.13,.05,skinD,x,y,z,0,0,(r()-.5)*.6);
    Y(th,.38,.12,.4,skinD,0,-TH+.03,.02);crack(th,.04,-.22,.239,.12,.4);crack(th,s*.188,-.12,0,.1,-.3,Math.PI/2);crack(th,-.05,-.3,-.199,.1,.5);
    Y(sn,.34,.3,.36,skin,0,-.14,-.01);Y(sn,.27,.34,.27,skin,0,-.42,-.01);Y(sn,.26,.14,.15,skinD,0,-.26,-.15);
    for(const[x,y,z]of[[.08,-.1,.19],[-.08,-.24,.19],[s*.18,-.18,-.02],[0,-.36,-.15]])Y(sn,.07,.11,.05,skinD,x,y,z,0,0,(r()-.5)*.6);crack(sn,.02,-.12,.135,.1,.3);
    const S=-.07*fk+.005;
    Y(ft,.22,.2,.22,skin,0,-.01,-.01);Y(ft,.12,.12,.1,skinD,0,0,-.15);
    const cn=new THREE.Group();put(ft,cn,0,-.05*Lg,-.01*Lg,-.12,0,0);Y(cn,.15,.3,.15,skin,0,-.15,0);Y(cn,.016,.2,.012,crackM,0,-.15,.08);
    Y(ft,.23,.1,.23,skinD,0,S+.21,0);Y(ft,.18,.06,.18,skin,0,S+.155,.02);
    Y(ft,.018,.11,.24,crackM,0,S+.06,.05);
    for(const t of[-1,1]){const x=t*.06;
      Y(ft,.1,.06,.28,hoof,x,S+.03,.05);Y(ft,.095,.06,.21,hoof,x,S+.085,.02);Y(ft,.09,.05,.13,hoof,x,S+.135,-.015);
      Y(ft,.085,.035,.05,hoofL,x,S+.0175,.16);Y(ft,.09,.06,.05,hoofL,x,S+.035,-.075);Y(ft,.05,.05,.05,hoof,t*.055,S+.21,-.12);}}}
  /* a stronger upper body: the chest, waist, neck, hips and arms made broader and deeper */
  {const bulk=(j,sx,sy,sz)=>{for(const m of j.children)if(m.isMesh){m.position.x*=sx;m.position.y*=sy;m.position.z*=sz;m.scale.x*=sx;m.scale.y*=sy;m.scale.z*=sz;}};
    bulk(chest,1.24,1.08,1.22);for(const sd of['L','R']){const ft=root.getObjectByName('foot_'+sd);bulk(root.getObjectByName('thigh_'+sd),1.12,1,1.12);bulk(root.getObjectByName('shin_'+sd),1.18,1,1.15);bulk(ft,1.45,1,1.15);for(const g of ft.children)if(!g.isMesh)bulk(g,1.5,1,1.4);}bulk(spine,1.16,1,1.16);bulk(neck,1.18,1,1.18);bulk(hips,1.3,1,1.2);for(const sd of['L','R']){bulk(root.getObjectByName('upperArm_'+sd),1.32,1,1.32);bulk(root.getObjectByName('foreArm_'+sd),1.3,1,1.3);}}
  /* wings on the shoulder blades, the film's balrog wing: a thick arm bone (dwing_*) to the wrist, then four long fanned fingers
     (dwingO_*) with glowing undersides and claws at the tips, a dark torn membrane in fan slices with scalloped edges and holes, a
     hooked thumb claw; smoke drifts off the edges (DP_WSMOKE) */
  const spike=(par,x,y,w,len,m,rz=0)=>{const g=new THREE.Group();g.position.set(x,y,0);g.rotation.z=rz;g.scale.set(1,len/w,1);par.add(g);bx(g,w*.7071,w*.7071,.01,m,0,0,0,0,0,Math.PI/4);return g;};
  for(const[sd,s]of[['L',1],['R',-1]]){const w0=new THREE.Group();w0.name='dwing_'+sd;w0.position.set(s*.17*F,.21*F,-.23*F);chest.add(w0);const w=new THREE.Group();w.scale.setScalar(DP_WS);w0.add(w);
    const a=DP_WA;bx(w,.09,.09,.09,wingB,0,0,0);bx(w,a,.06,.06,wingB,s*a/2,0,0);bx(w,a*.9,.01,.01,crackM,s*a/2,-.031,0);spike(w,s*.08,.06,.035,.1,claw,-s*.3);
    [[.44,.1],[.5,.22],[.52,.34]].forEach(([h,x],i)=>{bx(w,.125,h,.008,i===1?membD:memb,s*x,-h/2,0);if(i!==1)bx(w,.05,.06,.008,memb,s*(x+.04),-h-.03,0);});
    const wo=new THREE.Group();wo.name='dwingO_'+sd;wo.position.set(s*a,0,0);w.add(wo);bx(wo,.08,.08,.08,wingB,0,0,0);
    ncHorn(wo,[[0,.03,0],[s*.01,.11,.01],[-s*.02,.18,.03]],.04,.014,claw,claw);
    for(const[an,L]of DP_FING){const t=an*Math.PI/180,c=Math.cos(t),sn=Math.sin(t);
      bx(wo,L*.5,.034,.034,wingB,s*c*L*.25,sn*L*.25,.006,0,0,s*t);bx(wo,L*.5,.024,.024,wingB,s*c*L*.75,sn*L*.75,.006,0,0,s*t);
      for(const z of[-.018,.018])bx(wo,L*.85,.008,.004,crackM,s*c*L*.45,sn*L*.45,z,0,0,s*t);spike(wo,s*c*(L+.04),sn*(L+.04),.035,.12,claw,s*(t-Math.PI/2));}
    DP_WSL.forEach(sl=>{const n=4;for(let j=0;j<n;j++){if((sl.si===1&&sl.k===1&&j===2)||(sl.si===2&&sl.k===0&&j===1)||(sl.si===0&&sl.k===2&&j===3))continue;
      const r0=.03+(sl.Re-.03)*j/n,r1=.03+(sl.Re-.03)*(j+1)/n,rm=(r0+r1)/2;bx(wo,rm*sl.dth*1.12+.012,(r1-r0)*1.06,.008,j===n-1?membD:memb,s*rm*Math.cos(sl.th),rm*Math.sin(sl.th),0,0,0,s*(sl.th-Math.PI/2));}});}
  /* tail: eighteen segments from the base of the spine, about 4.9 m, very thick at the root and tapering to a thin end; spines along
     the top, cracks, a claw spike at the end */
  {let p=hips;for(let i=0;i<DP_TAIL;i++){const g=new THREE.Group();g.name='dptail_'+i;g.position.set(0,i?0:-.06*F,i?-DP_TL:-.17*F);p.add(g);const u=i/(DP_TAIL-1),t=(.27*Math.pow(1-u,1.2)+.035)*F;
    bx(g,t,t,DP_TL+.014*F,i%3===1?skinD:skin,0,0,-DP_TL/2);if(i<DP_TAIL-1)bx(g,Math.max(.012,t*.18),t*.5,.04*F,claw,0,t/2+t*.18,-DP_TL/2,-.5,0,0);if(i%3===2)bx(g,.008*F,.006*F,DP_TL*.6,crackM,t*.3,-t/2-.002,-DP_TL/2);p=g;}
    const z=-DP_TL;bx(p,.03*F,.03*F,.12*F,claw,0,0,z-.05*F);}
  const joints=[];root.traverse(q=>{if(q.userData.joint&&!q.userData.socket)joints.push(q);});root.userData.joints=joints;
  /* the whip in the left hand, the weapon in the right */
  const mk=(sd,g)=>{const wg=new THREE.Group();wg.name='weapon_'+sd;wg.userData.gear=true;root.getObjectByName('socket_'+sd).add(wg);const pr=new THREE.Group();pr.name='dp_prop_'+sd;pr.quaternion.copy(SH_BASIS());wg.add(pr);pr.add(g);return pr;};
  mk('L',dpWhip(M));const wp=mk('R',dpWeapon(wpnK,M));if(wpnK==='flail')dpChain(wp.children[0],M);
  /* the fire cubes (named dpf_ on the body, dpq_ on the weapon, dpz_ on the whip) */
  const cubes=(L,pre,mats=FM)=>L.forEach((P,k)=>{const par=root.getObjectByName(P.par),g=new THREE.Group();g.name=pre+k;g.userData.gear=true;g.position.set(P.p[0]*F,P.p[1]*F,P.p[2]*F);g.scale.setScalar(P.sz*F*.5);par.add(g);bx(g,1,1,1,P.hot?hot:mats[P.ty]);});
  cubes(DP_MANE,'dpf_');cubes(DP_WFX[wpnK],'dpq_');cubes(DP_WFX.whip,'dpz_');cubes(DP_SMOKE,'dps_',[bm('#161212','plain'),bm('#141111','plain'),bm('#1b1616','plain')]);cubes(DP_WSMOKE,'dpk_',[deep,FM[0],bm('#161212','plain')]);
  if(o.bare)return root;
  if(!o.noClips){root.userData.clips=demonPrinceClips(wpnK,hornK);const mx=new THREE.AnimationMixer(root);mx.clipAction(root.userData.clips[0]).play();mx.update(0);}
  root.userData.ground=7;
  const cap=s=>s.charAt(0).toUpperCase()+s.slice(1);
  root.userData.variantText=`${cap(DP_SKIN[skinK][1])} rock skin with glowing ${FC[4]} cracks and a mane of ${FC[4]} fire, ${DP_HORN[hornK]}, huge tattered wings and a long spined tail. A whip of fire in the left hand, ${DP_WPN[wpnK]} in the right.`;
  return root;}

/* ---------- clips ---------- */
const DP_CLIPS={};
/* Pose channels: the devil lord's (fl lifts the hips, feet and hands together; x,z of the hands hips-relative, y absolute, in units of
   legS) with a prop in each hand: dL the whip handle's direction, dR the weapon's; wl, wr extra wrist bends; jw jaw, vb body [scale,
   spin°], fi fire size; wings wg [elevation, sweep back, pitch back, outer fold back, outer droop] and ba wing-beat amplitude; tail
   tc curl per segment (14), tw wave, tsw sway. A hunch (DP_HUNCH) is added to every pose.
   Relaxed (DP_N): standing heavy, feet apart, the whip handle pointing forward and down (the lash lies on the ground before him), the
   weapon low; wings half closed. War (DP_W): wider, left foot forward, the whip handle forward, the weapon raised. */
const DP_N={fl:[0],HP:[0,-.02,0],h:[0,0,0],sp:[1,0,0],ch:[-2,0,0],nk:[2,0,0],hd:[2,0,0],FL:[.12,.03,6,0,0],FR:[-.12,-.01,-8,0,0],
  gL:[.4,.94,.16],dL:[.15,-.55,.82],pL:[.6,-.3,-.7],gR:[-.38,.92,.1],dR:[0,-.45,.9],pR:[-.6,-.3,-.7],wl:[0,0,0],wr:[0,0,0],fist:[95,95],jw:[0],vb:[1,0],fi:[1],
  wg:[12,18,10,20,-28],ba:[0],tc:[-40,4,4,4,4,6,6,6,8,8,10,14,18,22],tw:[.4],tsw:[0]};
const DP_HUNCH={sp:4,ch:12,nk:8,hd:-16};
function dpRig(wpn,horns){const B=VB.dprince,m=buildDemonPrince(1,{bare:true,weapon:wpn,horns}),J={};m.traverse(q=>{if(q.userData.joint||q.name)J[q.name]=q;});
  const tail=[];for(let i=0;i<DP_TAIL;i++)tail.push(J['dptail_'+i]);return{m,J,B,two:false,lprop:true,noHeel:true,tail};}

/* the clips are made per weapon; Death and Dead (smouldering) also per horns (the head rests on them) */
function demonPrinceClips(wpn,horns){return dpClips(wpn,'ram',false).concat(dpClips(wpn,horns,true));}
function dpClips(wpn,horns,dead){const ck=wpn+':'+(dead?horns:'')+':'+dead;if(DP_CLIPS[ck])return DP_CLIPS[ck];const B=VB.dprince,F=DP_F,D=Math.PI*2,S=Math.sin,C=Math.cos,V=THREE.Vector3,Q=THREE.Quaternion,E3=THREE.Euler,M4=THREE.Matrix4,L=[],R=dpRig(wpn,horns),k=B.legS,R2=Math.PI/180;
  const vv=new V();
  const lowOwn=g=>{g.updateMatrixWorld(true);let y=1e9;for(const q of g.children){if(!q.isMesh)continue;const P=q.geometry.parameters;for(let i=0;i<8;i++){vv.set((i&1?.5:-.5)*P.width,(i&2?.5:-.5)*P.height,(i&4?.5:-.5)*P.depth).applyMatrix4(q.matrixWorld);if(vv.y<y)y=vv.y;}}return y;};
  const lowAll=g=>{g.updateMatrixWorld(true);let y=1e9;g.traverse(q=>{if(!q.isMesh)return;const P=q.geometry.parameters;for(let i=0;i<8;i++){vv.set((i&1?.5:-.5)*P.width,(i&2?.5:-.5)*P.height,(i&4?.5:-.5)*P.depth).applyMatrix4(q.matrixWorld);if(vv.y<y)y=vv.y;}});return y;};
  /* each rigid prop's box corners in its socket's space, for the ground check (the whip's handle; the sword, the axe or the flail's
     handle; not the ropes or the fire) */
  const C8={L:[],R:[]};{const sk=(sd)=>{R.m.updateMatrixWorld(true);const so=R.J['socket_'+sd],Mi=so.matrixWorld.clone().invert();
      R.J['dp_prop_'+sd].traverse(q=>{if(!q.isMesh)return;let p=q.parent;while(p&&p!==so){if(/^(dpw_|dpc_|dpq_|dpz_)/.test(p.name))return;p=p.parent;}const gp=q.geometry.parameters;
        for(let i=0;i<8;i++)C8[sd].push(new V((i&1?.5:-.5)*gp.width,(i&2?.5:-.5)*gp.height,(i&4?.5:-.5)*gp.depth).applyMatrix4(q.matrixWorld).applyMatrix4(Mi));});};sk('L');sk('R');}
  const cv=new V(),propLow=sd=>{R.m.updateMatrixWorld(true);const Mw=R.J['socket_'+sd].matrixWorld,wq=R.J['weapon_'+sd].quaternion;let y=1e9;for(const c of C8[sd]){cv.copy(c).applyQuaternion(wq).applyMatrix4(Mw);if(cv.y<y)y=cv.y;}return y;};
  /* hand targets and prop directions turn with the body's yaw (hips + spine + chest) */
  const yawF=p=>{const y=(p.h[1]+p.sp[1]+p.ch[1])*R2,c=Math.cos(y),sn=Math.sin(y),rt=v=>[v[0]*c+v[2]*sn,v[1],-v[0]*sn+v[2]*c],o=Object.assign({},p);for(const q of['gR','gL','dR','dL'])o[q]=rt(p[q]);return o;};
  const restQ={L:new Q().setFromEuler(new E3(0,0,BASEPOSE.upperArm_L[2]*R2)),R:new Q().setFromEuler(new E3(0,0,BASEPOSE.upperArm_R[2]*R2))};
  /* elbow poles by score round the shoulder-to-hand line, with the carried-prop term on both arms (the devil lord's) */
  let MIN=.4*F,PP=null;const M4b=new M4();
  const poles=p=>{R.m.updateMatrixWorld(true);const o=Object.assign({},p),hp=(p.HP||[0,0,0]).map(v=>v*k),cq=R.J.chest.getWorldQuaternion(new Q()),up=new V(0,1,0),fw=new V(0,0,1).applyQuaternion(cq),nx={};
    for(const[sd,s]of[['L',1],['R',-1]]){const G=p['g'+sd],Sh=R.J['upperArm_'+sd].getWorldPosition(new V()),shW=R.J['shoulder_'+sd].getWorldQuaternion(new Q()),shq=shW.clone().invert(),sq=shW.clone().multiply(restQ[sd]);
      const T=new V(G[0]*k+hp[0],G[1]*k,G[2]*k+hp[2]).sub(Sh);if(T.length()<MIN){T.setLength(MIN);o['g'+sd]=[(Sh.x+T.x-hp[0])/k,(Sh.y+T.y)/k,(Sh.z+T.z-hp[2])/k];}const d=Math.min(T.length(),(B.ua+B.fa)*.999),u=T.normalize(),bone=new V(0,-1,0).applyQuaternion(sq);
      const al=Math.acos(Math.min(1,Math.max(-1,(B.ua*B.ua+d*d-B.fa*B.fa)/(2*B.ua*d)))),inw=new V(-s,0,0).applyQuaternion(cq),dS=new V(...p['d'+sd]).normalize(),Wp=u.clone().multiplyScalar(d);
      const el0=new V(0,0,-1).applyQuaternion(sq).applyQuaternion(new Q().setFromUnitVectors(bone,u)),b1=el0.clone().addScaledVector(u,-el0.dot(u)).normalize(),b2=new V().crossVectors(u,b1);
      let prev=PP&&PP[sd]?PP[sd].clone().addScaledVector(u,-PP[sd].dot(u)):null;if(prev&&prev.lengthSq()<.04)prev=null;if(prev)prev.normalize();let best=null,bc=1e9;
      for(const lim of[.866,-2])if(!best)
      for(let i=0;i<120;i++){const f=i/120*D,pp=b1.clone().multiplyScalar(C(f)).addScaledVector(b2,S(f)),e=u.clone().multiplyScalar(C(al)).addScaledVector(pp,S(al));
        const Y=e.clone().negate(),Z=pp.clone().addScaledVector(e,-pp.dot(e)).normalize().negate(),lq=shq.clone().multiply(new Q().setFromRotationMatrix(M4b.makeBasis(new V().crossVectors(Y,Z),Y,Z)));let rr=Math.abs(2*Math.atan2(lq.y,lq.w));if(rr>Math.PI)rr=D-rr;
        if(prev&&pp.dot(prev)<lim||pp.dot(inw)>.35)continue;let c=(rr/1.4)**2+3*Math.max(0,pp.dot(inw)+.1)**2+3*Math.max(0,pp.dot(up)+.15)**2+1.5*Math.max(0,-pp.dot(inw)-.55)**2+2*Math.max(0,pp.dot(fw)-.2)**2+(prev?.5*(1-pp.dot(prev)):0);
        const E=e.clone().multiplyScalar(B.ua),Fv=Wp.clone().sub(E).normalize(),inn=E.negate();inn.addScaledVector(Fv,-inn.dot(Fv));
        if(inn.lengthSq()>1e-8){inn.normalize();const yf=Fv.clone().negate(),xf=new V().crossVectors(yf,inn),side=dS.dot(xf),fx=Math.atan2(-dS.dot(yf),dS.dot(inn));c+=8*side*side+.4*fx*fx+4*Math.max(0,Math.abs(fx)-1.05)**2;}
        if(c<bc){bc=c;best=pp;}}
      if(!best)best=prev||el0;nx[sd]=best;o['p'+sd]=best.toArray();}
    PP=nx;return o;};
  const lift=p=>{const o=Object.assign({},p),f=p.fl[0];o.HP=[p.HP[0],p.HP[1]+f,p.HP[2]];for(const c of['FL','FR']){const Fq=p[c].slice();Fq[0]*=1.3;Fq[3]=(Fq[3]||0)+f;o[c]=Fq;}o.gR=[p.gR[0],p.gR[1]+f,p.gR[2]];o.gL=[p.gL[0],p.gL[1]+f,p.gL[2]];
    o.sp=[p.sp[0]+DP_HUNCH.sp,p.sp[1],p.sp[2]];o.ch=[p.ch[0]+DP_HUNCH.ch,p.ch[1],p.ch[2]];o.nk=[p.nk[0]+DP_HUNCH.nk,p.nk[1],p.nk[2]];o.hd=[p.hd[0]+DP_HUNCH.hd,p.hd[1],p.hd[2]];return o;};
  /* each hand follows its forearm, bent by the wrist towards its prop's direction (clamped), plus the keyed bend */
  const wrist=(s,p,sd)=>{R.m.updateMatrixWorld(true);const fq=R.J['foreArm_'+sd].getWorldQuaternion(new Q()),d=new V(...p['d'+sd]).normalize().applyQuaternion(fq.invert());
    const th=Math.max(-95*R2,Math.min(95*R2,Math.atan2(-d.y,d.z))),ph=Math.max(-35*R2,Math.min(35*R2,Math.asin(Math.max(-1,Math.min(1,d.x))))),w=sd==='L'?[p.wl[0],-p.wl[1],-p.wl[2]]:p.wr;
    const q=new Q().setFromEuler(new E3(th,0,0)).multiply(new Q().setFromEuler(new E3(0,ph,0))).multiply(new Q().setFromEuler(new E3(w[0]*R2,w[1]*R2,w[2]*R2)));
    R.J['hand_'+sd].quaternion.copy(q);const e=new E3().setFromQuaternion(q);s['w'+sd]=[e.x/R2,e.y/R2,e.z/R2];};
  const wingQ=(s,el,sw,pi)=>new Q().setFromEuler(new E3(pi*R2,s*sw*R2,s*el*R2,'YZX'));
  /* ---- the ropes: verlet points from the anchor at the end of the handle, fixed segment lengths, gravity, damping, the ground (with
     friction against a ground that slides back in the gaits), capsules round the torso, head, legs, feet, arms and tail ---- */
  const ROPES=[DP_ROPE.whip];if(wpn==='flail')ROPES.push(DP_ROPE.flail);
  const anchorOf=rp=>{const Mp=R.J['dp_prop_'+rp.sd].matrixWorld;return{A:new V(0,rp.anc,0).applyMatrix4(Mp),hd:new V(0,1,0).transformDirection(Mp)};};
  const caps=()=>{const P=n=>R.J[n].getWorldPosition(new V()),c=[],add=(a,b,r,arm)=>c.push({a,b,r,arm});const nk=P('neck');add(P('hips'),nk,.27*F);add(nk,R.J.head.localToWorld(new V(0,.22*F,.04*F)),.2*F);
    for(const sd of['L','R']){add(P('thigh_'+sd),P('shin_'+sd),.17*F);add(P('shin_'+sd),P('foot_'+sd),.13*F);add(P('foot_'+sd),R.J['foot_'+sd].localToWorld(new V(0,-.7,.1)),.08*F);
      add(P('upperArm_'+sd),P('foreArm_'+sd),.13*F,1);add(P('foreArm_'+sd),P('hand_'+sd),.12*F,1);}
    for(let i=0;i<DP_TAIL-1;i+=2)add(P('dptail_'+i),P('dptail_'+(i+2<DP_TAIL?i+2:DP_TAIL-1)),(.11*Math.pow(1-i/DP_TAIL,1.3)+.015)*F);return c;};
  const t1=new V(),t2=new V(),t3=new V();
  const ropeInit=(rp)=>{const{A,hd}=anchorOf(rp),f=new V(hd.x,0,hd.z);if(f.lengthSq()<1e-4)f.set(0,0,1);f.normalize();const X=[A.clone()];let c=0;
    for(let i=0;i<rp.N;i++){c+=rp.L[i];const p=A.clone().addScaledVector(f,c);p.y=Math.max(rp.ymin[i+1],A.y-c*.2);X.push(p);}return{X,Xp:X.map(v=>v.clone()),A,hd};};
  const ropeStep=(rp,st,dt,gz,damp)=>{const{A:A1,hd:h1}=anchorOf(rp),A0=st.A,h0=st.hd,CP=caps(),n=Math.max(1,Math.ceil(dt*240)),sdt=dt/n,N=rp.N,X=st.X,Xp=st.Xp;
    for(let s=1;s<=n;s++){const u=s/n,A=A0.clone().lerp(A1,u),hd=h0.clone().lerp(h1,u).normalize();X[0].copy(A);Xp[0].copy(A);
      for(let j=1;j<=N;j++){t1.subVectors(X[j],Xp[j]).multiplyScalar(damp);Xp[j].copy(X[j]);X[j].add(t1);X[j].y-=9.8*sdt*sdt;}
      for(let it=0;it<12;it++){
        if(rp.kh){t2.copy(A).addScaledVector(hd,rp.L[0]);X[1].lerp(t2,rp.kh);}
        for(let i=0;i<N;i++){const a=X[i],b=X[i+1],wa=rp.w[i],wb=rp.w[i+1];t1.subVectors(b,a);const len=t1.length()||1e-6,df=(len-rp.L[i])/len/(wa+wb);a.addScaledVector(t1,wa*df);b.addScaledVector(t1,-wb*df);}
        /* no sharp folds: points two apart stay at least 1.2 segment lengths apart (a bend of at most about 106°) */
        for(let i=1;i<N;i++){const a=X[i-1],b=X[i+1],wa=rp.w[i-1],wb=rp.w[i+1],mn=1.2*Math.min(rp.L[i-1],rp.L[i]);t1.subVectors(b,a);const len=t1.length()||1e-6;if(len<mn&&wa+wb>0){const df=(len-mn)/len/(wa+wb);a.addScaledVector(t1,wa*df);b.addScaledVector(t1,-wb*df);}}
        for(let j=1;j<=N;j++){const x=X[j];if(j>=3)for(const c of CP){if(c.arm&&j<4)continue;t1.subVectors(c.b,c.a);const l2=t1.lengthSq(),tt=l2>1e-9?Math.max(0,Math.min(1,t2.subVectors(x,c.a).dot(t1)/l2)):0;
            t3.copy(c.a).addScaledVector(t1,tt);t2.subVectors(x,t3);const rr=c.r+rp.rad[j],dl=t2.length();if(dl<rr){if(dl<1e-6)t2.set(0,0,1);else t2.multiplyScalar(1/dl);x.copy(t3).addScaledVector(t2,rr);}}
          if(x.y<rp.ymin[j])x.y=rp.ymin[j];}}
      /* friction on the ground (which slides back at gz in the gaits) */
      for(let j=1;j<=N;j++)if(X[j].y<=rp.ymin[j]+1e-3){const g=gz*sdt;Xp[j].x=X[j].x-(X[j].x-Xp[j].x)*.4;Xp[j].z=X[j].z-(g+((X[j].z-Xp[j].z)-g)*.4);}}
    st.A=A1;st.hd=h1;};
  /* rebuild a rope from the anchor with exact lengths, lifting any segment that would go below its ground height */
  const recon=(P,A,rp,d0)=>{const out=[A.clone()];let c=A.clone(),dp=d0.clone();for(let i=0;i<rp.N;i++){const d=new V().subVectors(P[i+1],c);if(d.lengthSq()<1e-10)d.set(0,-1,0);d.normalize();const Ls=rp.L[i],ym=rp.ymin[i+1];const an=Math.acos(Math.max(-1,Math.min(1,d.dot(dp))));if(an>DP_BEND){const ax=new V().crossVectors(dp,d);if(ax.lengthSq()<1e-8)ax.set(1,0,0).cross(dp);if(ax.lengthSq()<1e-8)ax.set(0,0,1);ax.normalize();d.copy(dp).applyAxisAngle(ax,DP_BEND);}
      if(c.y+d.y*Ls<ym){const h=Math.hypot(d.x,d.z),dy=Math.min(1,Math.max(-1,(ym-c.y)/Ls)),hh=Math.sqrt(1-dy*dy);if(h>1e-6){d.x*=hh/h;d.z*=hh/h;}else{d.x=hh;d.z=0;}d.y=dy;}
      c=c.clone().addScaledVector(d,Ls);out.push(c);dp=d.clone();}return out;};
  /* ---- one pose ---- */
  const hq=new Q();let MEM=null,RS=null,SIM=null;
  const FXPAR=[...new Set([...DP_MANE,...DP_SMOKE,...DP_WSMOKE,...DP_WFX[wpn]].map(P=>P.par).filter(n=>!/^dpc_/.test(n)))];
  const solveIK=(p0,t,o)=>{let p=yawF(lift(p0));wrSolve(R,p);p=poles(p);let s=wrSolve(R,p);wrist(s,p,'L');wrist(s,p,'R');
    /* a prop that would go below the ground lifts its hand */
    for(let it=0;it<4;it++){let moved=false;for(const sd of['L','R']){const dy=.012-propLow(sd);if(dy>3e-4){const g=p['g'+sd];p['g'+sd]=[g[0],g[1]+dy/k,g[2]];moved=true;}}
      if(!moved)break;s=wrSolve(R,p);wrist(s,p,'L');wrist(s,p,'R');}
    s.fist=p.fist;R.m.updateMatrixWorld(true);return finish(p,t,o,s);};
  const finish=(p,t,o,s)=>{
    /* wings: the keyed pose plus the beat; lifted wherever they would touch the ground */
    const bt=suBeat(t/(o.beat||1.2)),ba=p.ba[0],wv=p.wg.map((v,i)=>v+bt[i]*ba),wing={};
    for(const[sd,s1]of[['L',1],['R',-1]]){const g=R.J['dwing_'+sd],go=R.J['dwingO_'+sd];let el=wv[0];go.quaternion.setFromEuler(new E3(0,s1*wv[3]*R2,s1*wv[4]*R2,'YZX'));
      g.quaternion.copy(wingQ(s1,el,wv[1],wv[2]));
      /* lying (Death): where a wing would go into the ground, its downward tilt (sweep and outer fold) is eased off instead */
      if(o.fk&&lowAll(g)<.012){let lo=0,hi=1;const at=f=>{go.quaternion.setFromEuler(new E3(0,s1*wv[3]*f*R2,s1*wv[4]*R2,'YZX'));g.quaternion.copy(wingQ(s1,el,wv[1]*f,wv[2]*f));};
        at(0);if(lowAll(g)>=.012){for(let i=0;i<10;i++){const f=(lo+hi)/2;at(f);if(lowAll(g)>=.012)lo=f;else hi=f;}at(lo);}}
      if(lowAll(g)<.012)for(let dd=3;dd<=120;dd+=3){g.quaternion.copy(wingQ(s1,el+dd,wv[1],wv[2]));if(lowAll(g)>=.012){el+=dd;break;}}
      wing[sd]=[g.quaternion.clone(),go.quaternion.clone()];}
    /* tail: curl and a travelling wave; a segment that would go into the ground curls away from it */
    const ph=D*t/(o.tp||2.6),tq=[];
    const tcAt=i=>{const u=i*(p.tc.length-1)/(DP_TAIL-1),i0=Math.floor(u),i1=Math.min(p.tc.length-1,i0+1),f=u-i0;return(p.tc[i0]*(1-f)+p.tc[i1]*f)*p.tc.length/DP_TAIL;};
    for(let i=0;i<DP_TAIL;i++){const g=R.tail[i];let ax=tcAt(i)+p.tw[0]*4*S(ph-.5*i);const ay=p.tsw[0]/DP_TAIL+p.tw[0]*5*S(ph-.5*i+1.3);
      const set=a=>g.quaternion.setFromEuler(new E3(a*R2,ay*R2,0,'YXZ'));set(ax);
      if(lowOwn(g)<.012){let ok=null;for(let dd=3;dd<=180&&ok===null;dd+=3)for(const sg of[1,-1]){set(ax+sg*dd);if(lowOwn(g)>=.012){ok=ax+sg*dd;break;}}ax=ok===null?ax:ok;set(ax);}
      tq.push(g.quaternion.clone());}
    R.m.updateMatrixWorld(true);
    /* the ropes step on from the last frame (SIM on), or start lying out from the handle */
    if(SIM){for(const rp of ROPES){if(!RS[rp.pre])RS[rp.pre]=ropeInit(rp);else ropeStep(rp,RS[rp.pre],SIM.dt,SIM.gz||0,SIM.damp||rp.damp);}}
    const mats={};for(const n of FXPAR)mats[n]=R.J[n].matrixWorld.clone();const prop={L:R.J.dp_prop_L.matrixWorld.clone(),R:R.J.dp_prop_R.matrixWorld.clone()};
    const rope={};if(RS)for(const rp of ROPES)if(RS[rp.pre])rope[rp.pre]=RS[rp.pre].X.map(v=>v.clone());
    MEM={wing,tq,mats,prop,rope,fi:p.fi[0],sm:(p.sm||[0])[0],wq:null};return s;};
  const ss=x=>x*x*(3-2*x);
  /* ---- the fall (Death): keyed joint angles (the fiend's way) on the rig, the feet anchored while they stand, the body dropped onto
     its lowest point every frame; a held weapon that would go into the ground turns up about the grip ---- */
  const BODY=[];R.m.traverse(q=>{if(!q.isMesh)return;let z=q;while(z){if(z.userData.gear||/^(dwing_|dptail_|dpf_|dps_|dpq_|dpz_|dpk_)/.test(z.name))return;z=z.parent;}BODY.push(q);});
  const lowB=()=>{let y=1e9;for(const q of BODY){const P=q.geometry.parameters;for(let i=0;i<8;i++){vv.set((i&1?.5:-.5)*P.width,(i&2?.5:-.5)*P.height,(i&4?.5:-.5)*P.depth).applyMatrix4(q.matrixWorld);if(vv.y<y)y=vv.y;}}return y;};
  const fkPose=p=>{const P={};for(const c in p)if(JALIAS[c])P[JALIAS[c]]=p[c];const f=p.fist;P.fingers_L=[0,0,-f[0]];P.fingerTips_L=[0,0,-f[0]*.95];P.thumb_L=[f[0]*.15,0,-f[0]*.35];P.fingers_R=[0,0,f[1]];P.fingerTips_R=[0,0,f[1]*.95];P.thumb_R=[f[1]*.15,0,f[1]*.35];
    for(const j of RIG_JOINTS){const b=BASEPOSE[j]||[0,0,0],v=P[j]||[0,0,0];R.J[j].rotation.set((b[0]+v[0])*R2,(b[1]+v[1])*R2,(b[2]+v[2])*R2);}};
  let FREF=null,FULL=[0,0],DROP={},LASTW={};
  const solveFK=(p0,t,o)=>{const p=Object.assign({},p0),J=R.J;for(const[i,sd]of[[0,'L'],[1,'R']]){const w=p.flat[i];if(w>0){const a=p['a'+sd].slice();a[0]=a[0]*(1-w)-(p.h[0]+p['t'+sd][0]+p['k'+sd][0])*w;p['a'+sd]=a;}}
    fkPose(p);J.hips.position.set(p.X[0],B.hipH,p.X[1]);R.m.updateMatrixWorld(true);const ft={L:J.foot_L.getWorldPosition(new V()),R:J.foot_R.getWorldPosition(new V())};if(!FREF)FREF={L:ft.L.clone(),R:ft.R.clone()};
    const ws=p.anc[0]+p.anc[1];let cx=0,cz=0;if(ws>1e-3){for(const[i,sd]of[[0,'L'],[1,'R']]){cx+=p.anc[i]*(FREF[sd].x-ft[sd].x);cz+=p.anc[i]*(FREF[sd].z-ft[sd].z);}cx/=ws;cz/=ws;}
    const w=Math.min(1,Math.max(p.anc[0],p.anc[1]));if(w>.999)FULL=[cx,cz];const X=[p.X[0]+w*cx+(1-w)*FULL[0],p.X[1]+w*cz+(1-w)*FULL[1]];
    J.hips.position.set(X[0],B.hipH,X[1]);R.m.updateMatrixWorld(true);const y=.005-lowB();J.hips.position.y=B.hipH+y;R.m.updateMatrixWorld(true);
    /* the weapons: held (turned up about the grip where they would go into the ground) until o.rel, then let go: they fall under
       gravity, turning to lie flat beside him (the whip's handle too; the lash and a flail's chain follow in the simulation) */
    const wq={},wp={};for(const sd of['L','R']){const wg=J['weapon_'+sd],so=J['socket_'+sd],rel=o.rel?o.rel[sd]:1e9;
      if(t<rel){wg.position.set(0,0,0);wg.quaternion.identity();R.m.updateMatrixWorld(true);
        if(propLow(sd)<.008){const sq=so.getWorldQuaternion(new Q()),dW=new V(0,0,1).applyQuaternion(sq),ax=new V().crossVectors(dW,new V(0,1,0));
          if(ax.lengthSq()>1e-6){ax.normalize().applyQuaternion(sq.clone().invert());let lo=0,hi=2.6;for(let i=0;i<14;i++){const a=(lo+hi)/2;wg.quaternion.setFromAxisAngle(ax,a);if(propLow(sd)>=.008)hi=a;else lo=a;}wg.quaternion.setFromAxisAngle(ax,hi);R.m.updateMatrixWorld(true);}}
        DROP[sd]=null;LASTW[sd]=wg.matrixWorld.clone();}
      else{if(!DROP[sd]){const A=LASTW[sd]||wg.matrixWorld.clone(),pa=new V(),qa=new Q(),sc=new V();A.decompose(pa,qa,sc);
          const Lh=new V(0,0,1).applyQuaternion(qa).setY(0);if(Lh.lengthSq()<1e-4)Lh.set(0,0,1);Lh.normalize();const U=new V(0,new V(1,0,0).applyQuaternion(qa).y>=0?1:-1,0);
          const qr=new Q().setFromRotationMatrix(new M4().makeBasis(U,new V().crossVectors(Lh,U),Lh)),hp=J.hips.getWorldPosition(new V()),out=new V(pa.x-hp.x,0,pa.z-hp.z);if(out.lengthSq()<1e-4)out.set(sd==='L'?1:-1,0,0);out.normalize();
          const pr=new V(pa.x,0,pa.z).addScaledVector(out,.5*F),R0=new M4().compose(pr,qr,new V(1,1,1));let lo=1e9;for(const c of C8[sd])lo=Math.min(lo,c.clone().applyMatrix4(R0).y);pr.y=.004-lo;R0.compose(pr,qr,new V(1,1,1));
          DROP[sd]={pa,qa,pr,qr,tl:Math.max(.25,Math.sqrt(2*Math.max(0,pa.y-pr.y)/9.8))};}
        const d=DROP[sd],tau=t-rel,u=Math.min(1,tau/d.tl),pw=d.pa.clone().lerp(d.pr,ss(u));pw.y=Math.max(d.pr.y,d.pa.y-4.9*tau*tau);if(u>=1)pw.copy(d.pr);
        const Wm=new M4().compose(pw,d.qa.clone().slerp(d.qr,ss(u)),new V(1,1,1)),Lm=so.matrixWorld.clone().invert().multiply(Wm),lp=new V(),lq=new Q(),ls=new V();Lm.decompose(lp,lq,ls);
        wg.position.copy(lp);wg.quaternion.copy(lq);R.m.updateMatrixWorld(true);}
      wq[sd]=wg.quaternion.clone();wp[sd]=wg.position.clone();}
    const s={};for(const c in p)if(JALIAS[c]||c==='fist')s[c]=p[c];s.pos=[X[0]/k,y/k,X[1]/k];finish(p,t,o,s);MEM.wq=wq;MEM.wp=wp;return s;};
  /* ---- tracks every clip carries: wings, tail, jaw, body group, the ropes and the fire cubes ---- */
    const cubeTrack=(Lst,pre,frames,T,dur,Tr,Vt)=>{const q=new M4(),inv=new M4();Lst.forEach((P,kk)=>{const PP=[],SC=[],key=P.wing?'fi':P.smoke?'sm':'fi';
      if(!P.wing&&!frames.some(fr=>fr[key]>0)){Vt.push(new THREE.VectorKeyframeTrack(pre+kk+'.position',[0,dur],[P.p[0]*F,P.p[1]*F,P.p[2]*F,P.p[0]*F,P.p[1]*F,P.p[2]*F]),new THREE.VectorKeyframeTrack(pre+kk+'.scale',[0,dur],[.0005,.0005,.0005,.0005,.0005,.0005]));return;}
      frames.forEach((fr,i)=>{const Mw=fr.W[P.par],fi=P.wing?(P.dark?Math.min(1,Math.max(.3,fr.fi,fr.sm||0)):Math.min(1,Math.max(0,fr.fi))):Math.max(0,fr[key]),t=T[i],n=Math.max(1,Math.round(dur/P.P)),tau=((t/dur*n+P.ph)%1+1)%1,
          env=P.smoke?Math.pow(Math.sin(Math.PI*tau),.7)*(.45+.55*tau):(tau<.15?tau/.15:(1-tau)/.85),sz=Math.max(.0005,P.sz*F*fi*env);
        const w=new V(P.p[0]*F,P.p[1]*F,P.p[2]*F).applyMatrix4(Mw);w.x+=P.dx*F*tau;w.z+=P.dz*F*tau;w.y+=P.rise*F*(P.smoke?1:Math.pow(Math.max(fi,.001),.7))*Math.pow(tau,.8);w.y=Math.max(w.y,sz*.9+.003);
        inv.copy(Mw).invert();w.applyMatrix4(inv);const sc=new V().setFromMatrixScale(Mw).x||1;PP.push(w.x,w.y,w.z);const z=sz/sc;SC.push(z,z,z);});
      Vt.push(new THREE.VectorKeyframeTrack(pre+kk+'.position',T,PP),new THREE.VectorKeyframeTrack(pre+kk+'.scale',T,SC));});};
  const extra=(c,fn,Mm,o)=>{const T=Array.from(c.tracks[0].times),dur=c.duration,q=new Q(),e=new E3(),Tr={},Vt={},add=(n,v,tb=Tr)=>{(tb[n]||(tb[n]=[])).push(...v);};
    T.forEach((t,i)=>{const p=fn(t),m=Mm[i];
      for(const sd of['L','R']){add(`dwing_${sd}.quaternion`,m.wing[sd][0].toArray());add(`dwingO_${sd}.quaternion`,m.wing[sd][1].toArray());}
      m.tq.forEach((tq,j)=>add(`dptail_${j}.quaternion`,tq.toArray()));
      q.setFromEuler(e.set(p.jw[0],0,0));add('g_jaw.quaternion',[q.x,q.y,q.z,q.w]);
      const s=Math.max(.001,p.vb[0]);add('vbody.scale',[s,s,s],Vt);add('vbody.position',[0,2.3*(1-s),0],Vt);q.setFromEuler(e.set(0,p.vb[1]*R2,0));add('vbody.quaternion',[q.x,q.y,q.z,q.w]);});
    /* the ropes: loops are bent so the last frame meets the first; one-shot clips start from the rope at rest in their first pose and
       blend back to it over the last half second (so clips join without a pop); then each frame is rebuilt with exact lengths above the
       ground and turned into segment rotations under the handle */
    const frames=Mm.map(m=>({W:Object.assign({},m.mats),fi:m.fi,sm:m.sm}));
    for(const rp of ROPES){const P=Mm.map(m=>m.rope[rp.pre]),n=P.length-1;if(!P[0])continue;
      /* smooth out frame-to-frame jitter: two passes of a [1,2,1] filter on the points relative to the anchor (wrapping round in loops) */
      for(let pass=0;pass<2;pass++){const R0=P.map(Pf=>Pf.map(v=>v.clone().sub(Pf[0])));for(let f=0;f<=n;f++){const a=f>0?f-1:(o.loop?n-1:0),b=f<n?f+1:(o.loop?1:n);if(!o.loop&&(f===0||f===n))continue;
        for(let j=1;j<=rp.N;j++)P[f][j].copy(P[f][0]).addScaledVector(R0[a][j],.25).addScaledVector(R0[f][j],.5).addScaledVector(R0[b][j],.25);}}
      if(o.loop){const cr=P[0].map((v,j)=>v.clone().sub(P[n][j]));P.forEach((Pf,f)=>{const w=ss(f/n);Pf.forEach((v,j)=>{if(j)v.addScaledVector(cr[j],w);});});}
      else if(!o.hold&&!o.noBlend){const Tb=Math.min(.5,dur*.3),P0=o.rest[rp.pre];P.forEach((Pf,f)=>{const t=T[f];if(t<=dur-Tb)return;const w=ss((t-(dur-Tb))/Tb);Pf.forEach((v,j)=>{if(j)v.lerp(P0[j],w);});});}
      P.forEach((Pf,f)=>{const Mp=Mm[f].prop[rp.sd],A=new V(0,rp.anc,0).applyMatrix4(Mp),pts=recon(Pf,A,rp,new V(0,1,0).transformDirection(Mp)),pq=new Q(),ps=new V(),pp=new V();Mp.decompose(pp,pq,ps);
        let Qp=pq.clone(),Mc=Mp.clone().multiply(new M4().makeTranslation(0,rp.anc,0));
        for(let i=0;i<rp.N;i++){const yw=new V(0,1,0).applyQuaternion(Qp),d=pts[i+1].clone().sub(pts[i]).normalize(),qw=new Q().setFromUnitVectors(yw,d).multiply(Qp),lq=Qp.clone().invert().multiply(qw);
          add(`${rp.pre}${i}.quaternion`,lq.toArray());if(i)Mc=Mc.clone().multiply(new M4().makeTranslation(0,rp.L[i-1],0));Mc=Mc.clone().multiply(new M4().makeRotationFromQuaternion(lq));frames[f].W[rp.pre+i]=Mc;Qp=qw;}});}
    for(const n in Tr)c.tracks.push(new THREE.QuaternionKeyframeTrack(n,T,Tr[n]));for(const n in Vt)c.tracks.push(new THREE.VectorKeyframeTrack(n,T,Vt[n]));
    const VT=[];cubeTrack(DP_MANE,'dpf_',frames,T,dur,null,VT);cubeTrack(DP_WSMOKE,'dpk_',frames,T,dur,null,VT);cubeTrack(DP_WFX[wpn],'dpq_',frames,T,dur,null,VT);cubeTrack(DP_WFX.whip,'dpz_',frames,T,dur,null,VT);cubeTrack(DP_SMOKE,'dps_',frames,T,dur,null,VT);
    /* the weapon groups: turned up about the grip in Death where they would go into the ground, otherwise still */
    for(const sd of['L','R']){if(Mm.some(m=>m.wq)){const A=[],P=[];Mm.forEach(m=>{A.push(...(m.wq?m.wq[sd].toArray():[0,0,0,1]));P.push(...(m.wp?m.wp[sd].toArray():[0,0,0]));});
        VT.push(new THREE.QuaternionKeyframeTrack('weapon_'+sd+'.quaternion',T,A),new THREE.VectorKeyframeTrack('weapon_'+sd+'.position',T,P));}
      else VT.push(new THREE.QuaternionKeyframeTrack('weapon_'+sd+'.quaternion',[0,dur],[0,0,0,1,0,0,0,1]),new THREE.VectorKeyframeTrack('weapon_'+sd+'.position',[0,dur],[0,0,0,0,0,0]));}
    c.tracks.push(...VT);};
  /* a clip: loops run two warm-up cycles first (elbows and ropes start where the cycle ends); one-shot clips let the ropes come to rest
     in the first pose */
  const CC=(name,dur,fn,o={})=>{if(/^(Death|Dead)/.test(name)!==dead)return null;PP=null;FREF=null;if(!o.keepDrop)DROP={};LASTW={};for(const sd of['L','R']){R.J['weapon_'+sd].quaternion.identity();R.J['weapon_'+sd].position.set(0,0,0);}const solve=o.fk?solveFK:solveIK;MIN=o.min||.4*F;const fps=o.fps||30,dt=1/fps;RS={};SIM={dt,gz:o.gz||0};
    if(o.loop){for(let c=0;c<2;c++)for(let i=0;i<Math.round(dur*fps);i++)solve(fn(i*dt),i*dt,o);}
    else{solve(fn(0),0,o);SIM.damp=.97;for(let i=0;i<150;i++)solve(fn(0),0,o);SIM.damp=undefined;solve(fn(0),0,o);o.rest={};for(const rp of ROPES)o.rest[rp.pre]=MEM.rope[rp.pre];}
    const Mm=[],c=sampleClip(name,dur,t=>{const s=solve(fn(t),t,o);Mm.push(MEM);return s;},Object.assign({autoFeet:false,fps},o),B);extra(c,fn,Mm,o);SIM=null;RS=null;
    if(o.next!==undefined){if(o.next)c.next=o.next;}else if(!o.loop)c.next='Idle (war mode)';if(o.hold)c.hold=true;if(o.speed)c.speed=o.speed;L.push(c);MIN=.4*F;return c;};
  const W=wrP(DP_N,{HP:[0,-.07,0],h:[4,-14,0],sp:[3,-4,0],ch:[3,-6,0],nk:[0,0,0],hd:[-4,14,0],FL:[.14,.17,-4,0,0],FR:[-.14,-.15,-30,0,0],
    gL:[.44,1.08,.3],dL:[.2,-.25,.95],gR:wpn==='flail'?[-.42,1.02,.4]:[-.38,1.12,.34],dR:wpn==='flail'?[-.1,-.15,.98]:[-.2,.55,.8],wg:[10,12,8,10,-24],tc:[-34,4,6,6,6,6,6,6,6,6,8,10,12,14],tw:[1],fi:[1.15]});
  const KC=(name,dur,keys,note,o={})=>{const f=wrKeys(keys.map(q=>[q[0],wrP(o.base||W,q[1]||{})]));return CC(name,dur,o.add?t=>o.add(t,f(t)):f,Object.assign({note,fps:60},o));};
  /* in-place IK gait: planted feet slide back at one steady speed, swinging feet come forward lifted; the ground under the ropes slides
     back at the same speed, so the lash trails behind */
  const GAIT=(name,dur,G,note)=>{const fn=t=>{const u=t/dur,o=G.body(u),c2=C(D*(u-G.duty/2)),dy=-G.b*C(2*D*(u-G.duty/2));o.HP=[o.HP[0]+G.sw*c2,o.HP[1]+dy,o.HP[2]];
      o.gR=[o.gR[0],o.gR[1]+dy,o.gR[2]];o.gL=[o.gL[0],o.gL[1]+dy,o.gL[2]];
      for(const[sd,off,x,yaw]of[['L',0,G.x,G.yaw[0]],['R',.5,-G.x,G.yaw[1]]]){const q=(((u+off)%1)+1)%1;let z,l,pt;
        if(q<G.duty){const v=q/G.duty;z=G.s*(1-2*v);l=0;pt=v<.15?-8*(1-v/.15):v>.7?G.toe*(v-.7)/.3:0;}
        else{const v=(q-G.duty)/(1-G.duty),sm=v*v*(3-2*v);z=-G.s+2*G.s*sm;l=G.lift*Math.sin(Math.PI*v);pt=G.toe*(1-v)*(1-v)-8*v*v;}
        o['F'+sd]=[x,z+(sd==='L'?1:-1)*(G.st||0),yaw,l,pt];}return o;};
    const sp=2*G.s/(G.duty*dur);CC(name,dur,fn,{loop:true,fps:60,tp:dur,gz:-sp*k,note:`${note}, in place, ${(sp*k).toFixed(1)} m/s`,speed:sp*k});};

  /* ---- on the ground ---- */
  CC('Idle',5,t=>{const p=D*t/5,b=S(p),b2=S(2*p);return wrP(DP_N,{HP:[0,-.02-.005*b2,0],ch:[-2+1*b2,0,0],hd:[2+1.5*S(2*p+1),12*S(p+.6),1.5*S(p)],
    gL:[.4,.94+.006*b2,.16],gR:[-.38,.92+.01*b2,.1],wg:[12+3*S(p),18,10,20+4*S(2*p),-28],tsw:[24*S(p)],fi:[1+.08*S(2*p)]});},
    {loop:true,tp:2.5,note:'Stands hunched and heavy, the whip lying out on the ground before him, the weapon low; breathes and looks slowly round, the fire of his mane flickering, wings half closed, the tail swaying'});
  GAIT('Walk',1.5,{duty:.62,s:.24,lift:.07,toe:12,x:.1,yaw:[4,-4],b:.012,sw:.02,
    body:u=>{const yw=C(D*u),a=C(D*(u-.06));return wrP(DP_N,{HP:[0,-.03,0],h:[3,-5*yw,0],sp:[1,2*yw,0],ch:[-1,4*yw,0],hd:[2,-3*yw,0],
      gL:[.44,1.0,.2+.05*a],dL:[.35,-.3,.89],gR:[-.4,.94,.08-.08*a],tsw:[30*C(D*u)]});}},'A slow, heavy stride, the whip dragging behind him, the tail swinging');

  /* ---- war mode ---- */
  CC('Idle (war mode)',2.6,t=>{const p=D*t/2.6,b=S(p);return wrP(W,{HP:[0,-.07-.008*b,0],ch:[3+1.2*S(2*p),-6,0],hd:[-4+1.5*S(2*p+1),14+5*S(p),0],
    gL:[.44,1.08+.015*S(p+1.2),.3],gR:[W.gR[0],W.gR[1]+.02*S(p+.4),W.gR[2]],wg:[10+4*S(p),12,8,10,-24],tsw:[-20*S(p)],fi:[1.15+.1*S(2*p)]});},
    {loop:true,tp:2.6,note:'Wider stance, left foot forward, the whip held out before him, the weapon raised, wings half open, the fire burning higher'});
  GAIT('Walk (war mode)',1.4,{duty:.64,s:.21,lift:.065,toe:12,x:.13,yaw:[-2,-28],b:.01,sw:.016,st:.07,
    body:u=>wrP(W,{h:[6,-14-3*C(D*u),0],gL:[.44,1.08,.3-.03*C(D*u)],dL:[.35,-.3,.89],gR:[W.gR[0],W.gR[1],W.gR[2]+.03*C(D*u)],tsw:[24*C(D*u)]})},'Advances, whip and weapon held ready');

  /* ---- the whip ---- */
  /* Whip crack: raises the whip high over his left shoulder, the lash streaming back, then snaps it forward and down; the lash flies
     over and cracks out before him */
  KC('Whip crack',2.1,[[0,{}],
    [.66,{HP:[0,-.04,-.04],h:[-2,-10,0],sp:[-4,-4,0],ch:[-8,-8,0],hd:[-8,12,0],FL:[.14,.12,-4,0,0],gL:[.46,1.76,.02],dL:[.1,.85,-.5],jw:[.3],wg:[44,40,8,36,0]}],
    [.92,{HP:[0,-.1,.08],h:[12,10,0],sp:[8,4,0],ch:[10,8,0],hd:[2,-6,0],FL:[.14,.28,-4,0,0],gL:[.34,1.36,.72],dL:[0,.15,1],jw:[.7],wg:[30,50,10,46,0]}],
    [1.1,{HP:[0,-.12,.1],h:[14,12,0],sp:[9,5,0],ch:[11,9,0],hd:[4,-8,0],FL:[.14,.28,-4,0,0],gL:[.32,1.08,.7],dL:[-.05,-.55,.83],jw:[.5],wg:[30,50,10,46,0]}],
    [2.1,{}]],'Raises the whip high over his head, the lash streaming back, then snaps it forward and down: the lash flies over and cracks out before him');
  /* Whip lash: draws the whip across to his right, then lashes it out to the left in a wide sweep at waist height */
  KC('Whip lash',1.9,[[0,{}],
    [.5,{h:[4,-24,0],sp:[2,-8,0],ch:[2,-12,0],hd:[0,22,0],gL:[.12,1.25,.62],dL:[-.75,.05,.66],jw:[.2]}],
    [.86,{h:[8,14,0],sp:[4,8,0],ch:[6,12,0],hd:[0,-14,0],FL:[.16,.22,-4,0,0],gL:[.75,1.2,.45],dL:[.85,-.1,.5],jw:[.7]}],
    [1.04,{h:[8,17,0],sp:[4,9,0],ch:[6,14,0],hd:[0,-16,0],FL:[.16,.22,-4,0,0],gL:[.8,1.12,.22],dL:[.85,-.3,.2],jw:[.4]}],
    [1.9,{}]],'Draws the whip across to his right, then lashes it out to the left in a wide sweep at waist height');

  /* ---- the weapon ---- */
  const RAISE={h:[2,12,0],sp:[-2,8,0],ch:[-6,12,0],hd:[-4,-10,0],gR:[-.52,1.6,.12],dR:[-.35,.88,-.3],gL:[.46,1.12,.3],jw:[.3],wg:[44,40,8,36,0]};
  KC('Attack 1',1.5,[[0,{}],[.42,RAISE],
    [.68,{h:[12,-16,0],sp:[8,-6,0],ch:[8,-10,0],hd:[0,10,0],FL:[.14,.27,-4,0,0],gR:[-.12,1.1,.62],dR:[.5,-.25,.83],gL:[.48,1.04,.2],jw:[.6],wg:[30,50,10,46,0]}],
    [.84,{h:[14,-22,0],sp:[9,-8,0],ch:[9,-12,0],hd:[2,14,0],FL:[.14,.27,-4,0,0],gR:[.0,.98,.58],dR:[.62,-.4,.67],gL:[.48,1.02,.18],jw:[.4],wg:[30,50,10,46,0]}],
    [1.5,{}]],'Raises the weapon high beside his right shoulder and cuts down and across with a step in');
  KC('Attack 2',2.1,[[0,{}],[.42,RAISE],
    [.68,{h:[12,-16,0],sp:[8,-6,0],ch:[8,-10,0],hd:[0,10,0],FL:[.14,.27,-4,0,0],gR:[-.12,1.1,.62],dR:[.5,-.25,.83],gL:[.48,1.04,.2],jw:[.6],wg:[30,50,10,46,0]}],
    [.86,{h:[14,-22,0],sp:[9,-8,0],ch:[9,-12,0],hd:[2,14,0],FL:[.14,.27,-4,0,0],gR:[.0,1.04,.56],dR:[.55,-.1,.83],gL:[.48,1.02,.18],jw:[.3],wg:[30,50,10,46,0]}],
    [1.16,{h:[8,8,0],sp:[4,6,0],ch:[4,8,0],hd:[0,-6,0],FL:[.14,.27,-4,0,0],gR:[-.62,1.26,.42],dR:[-.85,.1,.5],gL:[.46,1.08,.24],jw:[.7],wg:[30,50,10,46,0]}],
    [1.3,{h:[8,10,0],sp:[4,7,0],ch:[4,9,0],hd:[0,-8,0],FL:[.14,.27,-4,0,0],gR:[-.66,1.24,.32],dR:[-.9,.05,.42],gL:[.46,1.08,.24],jw:[.4],wg:[30,50,10,46,0]}],
    [2.1,{}]],'Cuts down and across with a step in, then a backhand cut out to the right');
  /* Heavy attack: rears up with the weapon raised high over his head, then smashes it down into the ground before him */
  KC('Heavy attack',2.4,[[0,{}],
    [.65,{HP:[0,-.02,-.06],h:[-4,6,0],sp:[-6,4,0],ch:[-10,6,0],hd:[-10,-4,0],gR:[-.3,1.92,.04],dR:[-.1,.75,-.65],gL:[.5,1.12,.3],jw:[.4],wg:[56,30,6,24,0],fi:[1.4]}],
    [.8,{HP:[0,-.12,.04],h:[8,-2,0],sp:[2,0,0],ch:[0,-2,0],hd:[0,2,0],gR:[-.24,1.5,.62],dR:[-.05,.25,.97],gL:[.5,1.06,.32],jw:[.6],wg:[44,34,8,30,0],fi:[1.5]}],
    [.96,{HP:[0,-.2,.09],h:[16,-5,0],sp:[7,-1,0],ch:[6,-3,0],hd:[5,5,0],FL:[.14,.3,-4,0,0],FR:[-.14,-.2,-30,0,0],gR:[-.22,1.12,.76],dR:[-.03,-.3,.95],gL:[.52,1.02,.34],jw:[.8],wg:[36,38,8,36,-6],fi:[1.55]}],
    [1.1,{HP:[0,-.26,.12],h:[22,-6,0],sp:[10,-2,0],ch:[10,-4,0],hd:[8,6,0],FL:[.14,.3,-4,0,0],FR:[-.14,-.2,-30,0,0],gR:[-.2,.78,.8],dR:[0,-.8,.6],gL:[.52,1.0,.34],jw:[.9],wg:[30,40,8,40,-10],fi:[1.6]}],
    [1.45,{HP:[0,-.25,.12],h:[21,-6,0],sp:[10,-2,0],ch:[10,-4,0],hd:[4,6,0],FL:[.14,.3,-4,0,0],FR:[-.14,-.2,-30,0,0],gR:[-.2,.8,.8],dR:[0,-.78,.62],gL:[.52,1.0,.34],jw:[.5],wg:[30,40,8,40,-10],fi:[1.3]}],
    [2.4,{}]],'Rears up with the weapon raised high over his head, then smashes it down into the ground before him');

  /* ---- wings, tail, fire ---- */
  KC('Wing buffet',1.6,[[0,{}],
    [.5,{HP:[0,-.08,-.04],h:[-6,0,0],sp:[-6,0,0],ch:[-8,0,0],hd:[-8,0,0],gL:[.5,1.14,.2],gR:[-.48,1.14,.2],wg:[72,64,0,20,0],jw:[.2]}],
    [.72,{HP:[0,-.06,.08],h:[16,0,0],sp:[8,0,0],ch:[6,0,0],hd:[8,0,0],FL:[.14,.24,-4,0,0],gL:[.44,1.06,.36],gR:[-.42,1.08,.36],wg:[-6,-36,-14,-20,0],jw:[.7],fi:[1.5]}],
    [.88,{HP:[0,-.06,.08],h:[16,0,0],sp:[8,0,0],ch:[6,0,0],hd:[8,0,0],FL:[.14,.24,-4,0,0],gL:[.44,1.06,.36],gR:[-.42,1.08,.36],wg:[-8,-38,-14,-22,0],jw:[.5],fi:[1.4]}],
    [1.6,{}]],'Raises his huge wings high and back, then slams them forward in a gust');
  KC('Tail lash',1.6,[[0,{}],
    [.42,{h:[4,-22,0],sp:[0,-8,0],ch:[0,-6,0],hd:[0,30,0],FL:[.15,.12,-6,0,0],FR:[-.13,-.12,-24,0,0],tc:[-14,6,6,6,4,4,4,2,2,2,2,2,2,2],tsw:[-100],tw:[0]}],
    [.68,{h:[4,34,0],sp:[0,10,0],ch:[0,8,0],hd:[0,-44,0],FL:[.15,.12,18,0,0],FR:[-.13,-.12,8,0,0],tc:[-6,4,4,2,0,0,0,0,0,0,0,0,0,0],tsw:[165],tw:[0],jw:[.3]}],
    [.84,{h:[4,38,0],sp:[0,11,0],ch:[0,9,0],hd:[0,-48,0],FL:[.15,.12,18,0,0],FR:[-.13,-.12,8,0,0],tc:[-6,4,4,2,0,0,0,0,0,-4,-6,-8,-8,-8],tsw:[185],tw:[0],jw:[.2]}],
    [1.6,{}]],'Turns away, then swings round and whips his spined tail round his right side at the enemy');
  KC('Roar',2.8,[[0,{}],
    [.5,{HP:[0,-.1,0],h:[8,0,0],sp:[6,0,0],ch:[6,0,0],nk:[4,0,0],hd:[6,0,0],gL:[.5,1.04,.3],gR:[-.48,1.04,.3],wg:[44,40,8,30,0],jw:[.1],fi:[.9]}],
    [.9,{HP:[0,-.04,0],h:[-2,0,0],sp:[-6,0,0],ch:[-10,0,0],nk:[-4,0,0],hd:[-4,0,0],FL:[.14,.12,-4,0,0],gL:[.66,1.28,.14],dL:[.6,.2,.6],gR:[-.66,1.28,.14],dR:[-.6,.5,.5],wg:[22,18,10,4,0],jw:[.6],fi:[2.0]}],
    [2.0,{HP:[0,-.04,0],h:[-2,0,0],sp:[-6,0,0],ch:[-11,0,0],nk:[-4,0,0],hd:[-6,0,0],FL:[.14,.12,-4,0,0],gL:[.67,1.29,.14],dL:[.6,.2,.6],gR:[-.67,1.29,.14],dR:[-.6,.5,.5],wg:[22,18,10,4,0],jw:[.58],fi:[2.1]}],
    [2.8,{}]],'Spreads his arms and his huge wings wide, chest out, and roars, the fire of his mane flaring up',
    {add:(t,p)=>{if(t<.9||t>2.0)return p;const o=Object.assign({},p),g=S(D*(t-.9)/.12)*Math.min(1,(t-.9)/.1,(2.0-t)/.1);o.hd=[p.hd[0]+1.5*g,p.hd[1]+2*g,p.hd[2]];return o;}});
  /* Flame burst: crouches, his fire sinking low, then rears up with arms and wings flung wide as the fire bursts out of him (the
     burst at 1.2 s; the effect is added separately) */
  KC('Flame burst',3.2,[[0,{}],
    [.7,{HP:[0,-.2,0],h:[18,0,0],sp:[10,0,0],ch:[10,0,0],nk:[6,0,0],hd:[10,0,0],FL:[.15,.14,-4,0,0],FR:[-.15,-.12,-20,0,0],gL:[.42,.86,.36],dL:[.2,-.6,.75],gR:[-.42,.86,.36],dR:[-.2,-.5,.84],wg:[52,64,6,56,-20],jw:[.1],fi:[.55]}],
    [1.2,{HP:[0,.0,0],h:[-4,0,0],sp:[-8,0,0],ch:[-12,0,0],nk:[-6,0,0],hd:[-14,0,0],FL:[.15,.14,-4,0,0],FR:[-.15,-.12,-20,0,0],gL:[.7,1.42,.08],dL:[.5,.6,.6],gR:[-.7,1.42,.08],dR:[-.4,.8,.45],wg:[14,10,12,0,0],jw:[.9],fi:[2.6]}],
    [2.3,{HP:[0,-.01,0],h:[-4,0,0],sp:[-8,0,0],ch:[-13,0,0],nk:[-6,0,0],hd:[-15,0,0],FL:[.15,.14,-4,0,0],FR:[-.15,-.12,-20,0,0],gL:[.71,1.43,.08],dL:[.5,.6,.6],gR:[-.71,1.43,.08],dR:[-.4,.8,.45],wg:[16,12,12,0,0],jw:[.7],fi:[2.4]}],
    [3.2,{}]],'Crouches with his fire sinking low, then rears up with arms and wings flung wide as the fire bursts out of him (the burst at 1.2 s; the effect is added separately)');

  /* ---- reactions ---- */
  KC('Hit 1',.9,[[0,{}],
    [.1,{HP:[0,-.06,-.1],h:[-8,-10,0],sp:[-8,-4,0],ch:[-12,-6,0],nk:[-8,0,0],hd:[-24,6,8],gL:[.54,1.26,.22],gR:[-.5,1.24,.22],jw:[.6],wg:[50,40,0,30,0],fi:[1.4]}],
    [.36,{HP:[0,-.06,-.05],h:[2,-12,0],sp:[2,-4,0],ch:[0,-6,0],hd:[-8,8,0],jw:[.2]}],
    [.9,{}]],'Blow to the face: his head snaps back, his arms fly up and the wings jerk open');
  KC('Hit 2',1.1,[[0,{}],
    [.15,{HP:[.06,-.08,0],h:[6,8,-10],sp:[4,4,-6],ch:[0,6,-8],hd:[-10,24,-12],gL:[.54,1.16,.28],jw:[.5],wg:[44,40,6,30,0],tsw:[-60]}],
    [.32,{HP:[.08,-.1,0],h:[6,0,-6],sp:[5,0,-4],ch:[2,0,-6],hd:[-2,16,-6],FL:[.21,.12,2,0,0],gL:[.52,1.16,.32],jw:[.2]}],
    [.62,{HP:[.05,-.08,0],FL:[.21,.12,2,0,0]}],
    [1.1,{}]],'Struck from the right: twists away and catches himself with a step, then turns back');
  KC('Heavy hit',2.5,[[0,{}],
    [.12,{HP:[0,-.08,-.1],h:[-8,-12,0],sp:[-10,-4,0],ch:[-14,-6,0],nk:[-8,0,0],hd:[-26,6,6],gL:[.54,1.26,.22],gR:[-.5,1.24,.22],jw:[.7],wg:[54,40,0,30,0],fi:[1.4]}],
    [.36,{HP:[0,-.24,-.12],h:[8,-12,0],sp:[2,-4,0],ch:[0,-6,0],hd:[-8,8,4],FL:[.14,-.04,-4,.06,30],gL:[.48,1.0,.3],gR:[-.44,1.0,.3],jw:[.4],wg:[34,44,6,40,0]}],
    [.64,{HP:[0,-.33,-.12],h:[18,-12,0],sp:[10,-4,0],ch:[8,-6,0],hd:[6,8,0],FL:[.14,-.38,-4,0,70],FR:[-.14,-.06,-30,0,0],gL:[.44,.92,.46],dL:[.2,-.5,.84],gR:[-.42,.84,.34],dR:[-.3,-.2,.93],jw:[.2],wg:[24,52,10,56,0],fi:[.8]}],
    [1.35,{HP:[0,-.33,-.12],h:[20,-12,0],sp:[11,-4,0],ch:[9,-6,0],hd:[-6,14,0],FL:[.14,-.38,-4,0,70],FR:[-.14,-.06,-30,0,0],gL:[.44,.92,.47],dL:[.2,-.5,.84],gR:[-.42,.84,.35],dR:[-.3,-.2,.93],jw:[.3],wg:[24,52,10,56,0],fi:[.8]}],
    [1.75,{HP:[0,-.3,-.08],h:[22,-12,0],sp:[10,-4,0],ch:[8,-6,0],hd:[-4,10,0],FL:[.14,-.3,-4,0,42],FR:[-.14,-.08,-30,0,0],gL:[.42,.94,.48],dL:[.05,-.55,.83],gR:[-.42,.92,.32],dR:[-.3,-.1,.95],jw:[.1],wg:[28,50,10,50,0]}],
    [2.12,{HP:[0,-.1,-.02],h:[8,-14,0],FL:[.14,.0,-4,.05,10]}],
    [2.5,{}]],'Knocked down onto his left knee, then rises again');
  /* Death: reels, sinks onto his knees and roars, then pitches forward and falls face down; his fire dies to embers and black smoke
     rises from him; then Dead (smouldering) loops, lying still and smoking */
  {PP=null;const S0=solveIK(W,0,{}),K0={X:[S0.pos[0]*k,S0.pos[2]*k],anc:[1,1],flat:[0,0],jw:[0],vb:[1,0],fi:[1.15],sm:[0],wg:W.wg.slice(),ba:[0],tc:W.tc.slice(),tw:[1],tsw:[0]};
  for(const c of['h','sp','ch','nk','hd','tL','kL','aL','tR','kR','aR','uL','fL','wL','uR','fR','wR','fist'])K0[c]=S0[c].slice();
  const dk=gbDeathKeys(K0,[
    [.2,{sp:[-8,0,0],ch:[-14,0,0],nk:[-6,0,0],hd:[-18,0,6],jw:[.7],fi:[1.5],wg:[54,40,0,30,0]},'out'],
    [.6,{h:[10,-10,0],sp:[8,0,0],ch:[10,0,0],nk:[6,0,0],hd:[4,0,8],tL:[-30,0,4],kL:[60,0,0],tR:[-26,0,-6],kR:[56,0,0],uL:[-30,0,14],fL:[-40,0,0],uR:[-30,0,-14],fR:[-40,0,0],jw:[.3],fi:[1.1],wg:[34,50,8,44,0]}],
    [1.0,{h:[12,-4,0],sp:[14,0,0],ch:[16,0,0],nk:[8,0,0],hd:[10,0,8],tL:[-16,0,4],kL:[104,0,0],tR:[-12,0,-4],kR:[102,0,0],aL:[44,0,0],aR:[44,0,0],anc:[0,0],X:[0,.14],
      uL:[-14,0,18],fL:[-30,0,0],uR:[-14,0,-18],fR:[-30,0,0],fi:[.9]},'io'],
    [1.1,{h:[16,-4,0]},'out'],
    [1.45,{sp:[6,0,0],ch:[-4,0,0],nk:[-10,0,0],hd:[-24,0,0],uL:[-6,0,24],fL:[-12,0,0],uR:[-6,0,-24],fR:[-12,0,0],jw:[.9],fi:[1.3]}],
    [1.8,{h:[50,-2,-4],sp:[16,0,-4],ch:[14,0,0],nk:[-4,0,0],hd:[-6,14,0],tL:[-30,0,6],kL:[70,0,0],tR:[-26,0,-6],kR:[68,0,0],X:[0,.42],uL:[-80,0,20],fL:[-40,0,0],uR:[-80,0,-20],fR:[-40,0,0],jw:[.4],fi:[.8],wg:[30,40,10,30,0]},'in'],
    [2.1,{h:[90,0,-4],sp:[2,0,-2],ch:[0,0,0],nk:[-68,0,0],hd:[-16,0,0],tL:[-6,4,6],kL:[14,0,0],tR:[-6,-4,-6],kR:[14,0,0],aL:[-6,0,0],aR:[-6,0,0],X:[0,1.2],
      uL:[-20,0,24],fL:[-20,0,0],uR:[-20,0,-24],fR:[-20,0,0],fi:[.5],sm:[.3],wg:[22,-4,0,-8,0],tc:[-60,-4,-2,0,0,0,0,0,0,0,0,0,0,0],tw:[.2]},'in'],
    [2.2,{h:[87,0,-4]},'out'],
    [3.0,{h:[90,0,-4],nk:[-72,0,0],hd:[-10,55,0],tL:[-4,4,6],kL:[10,0,0],tR:[-4,-4,-6],kR:[8,0,0],uL:[4,0,30],fL:[-12,0,0],uR:[6,0,-30],fR:[-10,0,0],jw:[.2],fi:[.18],sm:[1],tw:[0],wg:[20,-10,0,-18,0],tc:[-104,-8,-6,-4,-2,0,0,2,2,2,2,2,2,2],tsw:[10]},'out']]);
  const dc=CC('Death',3.2,dk,{fk:true,fps:60,noBlend:true,rel:{R:1.0,L:1.12},next:'Dead (smouldering)',note:'Reels, sinks onto his knees and roars, then pitches forward and falls face down; his fire dies to embers and black smoke rises from him'});
  if(dc)dc.nextAlways=true;CC('Dead (smouldering)',4,t=>Object.assign({},dk(3.2),{fi:[.18+.04*S(D*t/2)]}),{fk:true,loop:true,keepDrop:true,rel:{R:-10,L:-10},next:null,note:'Lies face down, still smouldering: embers glow in his mane and black smoke rises from him'});}
  return DP_CLIPS[ck]=L;}

ASSETS.push({id:'demon-prince',folder:'characters/enemies/hell',name:'Demon Prince',kind:'character',variants:true,defaultSeed:14,groundR:7,build:(s,o)=>buildDemonPrince(s,o||{}),
  opts:[{key:'weapon',label:'Right hand',choices:[['random','Random'],['sword','Burning curved sword'],['axe','Fiery axe'],['flail','Burning flail']],def:'random'},
    {key:'skin',label:'Skin',choices:[['random','Random'],['charred','Charred black'],['ash','Ash grey'],['ember','Smouldering brown']],def:'random'},
    {key:'fire',label:'Fire',choices:[['random','Random'],['orange','Orange'],['crimson','Crimson'],['green','Hellfire green']],def:'random'},
    {key:'horns',label:'Horns',choices:[['random','Random'],['great','Great (forward)'],['ram','Ram'],['swept','Swept back']],def:'random'}],
  desc:'Demon Prince: a balrog-like fire demon about 4.2 m tall, hunched and massive: charred rock skin with glowing lava cracks, a bestial head with deep glowing eyes, fangs and fire in the mouth, great horns, a mane of square fire on the head, neck, shoulders and back, bony spikes, clawed hands and feet, huge tattered wings and a long spined tail with a burning tip. A simulated whip of fire in the left hand; a burning curved sword, a fiery axe or a burning flail in the right. Clips: Idle, Walk, war-mode Idle and Walk, Whip crack, Whip lash, Attack 1, Attack 2, Heavy attack, Wing buffet, Tail lash, Roar, Flame burst, Hit 1, Hit 2, Heavy hit, Death (falls face down, the fire dies and black smoke rises) and Dead (smouldering).'});
