/* Reversed elbows (decision 2026-10-24, docs/CHARACTER_CREATION.md): while a hand works below its shoulder the elbow points down and
   out, never up or into the body. fixElbows(root) turns any reversed elbow of a built character round the shoulder-hand line (the
   hand stays where it is) and puts a hand that holds something back to its old world rotation, so the weapon and the grip do not move. Over the clip the
   turn is found by a path search: no reversed frame if it can be helped, then the smallest turn; the upper arm and the hand never
   move more from one frame to the next (at 60 fps) than 22° or what they already moved (or the clip's own largest jump, when that arm already jumps past 25°), and never twist about their own bone past
   95° or what they already had (unless the clip already twists that arm past 100°), so nothing new jumps or twists. Same test as
   tools/check-character.mjs (with a margin); Death…/Fall… clips and clip.elbowFree are left alone. A clip shared with other builds
   (other bodies) is copied before it is changed. */
function fixElbows(root){
  const clips=root.userData.clips&&(root.userData.clips=root.userData.clips.slice()),CH=root.getObjectByName('chest');if(!clips||!clips.length||!CH)return;
  const J={};root.traverse(q=>{if(/^(upperArm|foreArm|hand)_[LR]$/.test(q.name)&&!J[q.name])J[q.name]=q;});if(!J.upperArm_L||!J.foreArm_L||!J.hand_L)return;
  const V=THREE.Vector3,Q=THREE.Quaternion,D=180/Math.PI,UP=.45,IN=.25,JMP=22/D,K=60,M=2*K,ST=180/K/D,W=10,mx=new THREE.AnimationMixer(root),keep=[],own=new Set(),done=new Set();
  /* an empty hand (nothing in its socket) simply follows the forearm; a hand that holds something, or is near the ground (pushing up
     from it), keeps its world rotation */
  const holds={};for(const sd of['L','R']){const so=root.getObjectByName('socket_'+sd);let m=!so;if(so)so.traverse(q=>{if(q.isMesh)m=true;});holds[sd]=m;}
  root.updateMatrixWorld(true);const GY=CH.getWorldPosition(new V()).y*.45;
  root.traverse(o=>keep.push([o,o.position.clone(),o.quaternion.clone(),o.scale.clone()]));
  const ang=(a,b)=>2*Math.acos(Math.min(1,Math.abs(a.dot(b)))),tw=q=>{const t=Math.abs(2*Math.atan2(q.y,q.w));return t>Math.PI?2*Math.PI-t:t;},TW=95/D;
  /* up to five passes: a later pass catches what the jump limit held back */
  for(let pass=0;pass<5;pass++)for(let ci=0;ci<clips.length;ci++){let c=clips[ci];if(c.elbowFree||/^(Death|Fall)/.test(c.name)||pass&&(!own.has(c)||done.has(c)))continue;
    const n=Math.max(2,Math.round(c.duration*60)),T=[],fr=[],a=mx.clipAction(c);a.play();
    for(let i=0;i<=n;i++){a.time=i/n*c.duration;mx.update(0);for(const sd of['L','R'])J['hand_'+sd].updateWorldMatrix(true,false);T.push(a.time);const cq=CH.getWorldQuaternion(new Q()).invert(),f={};
      for(const[sd,sg]of[['L',1],['R',-1]]){const U=J['upperArm_'+sd],Hn=J['hand_'+sd],S=U.getWorldPosition(new V()),E=J['foreArm_'+sd].getWorldPosition(new V()),H=Hn.getWorldPosition(new V());
        const g={uq:U.quaternion.clone(),hq:Hn.quaternion.clone(),hw:Hn.getWorldQuaternion(new Q()),pw:U.parent.getWorldQuaternion(new Q()),bad:null};f[sd]=g;
        g.keep=holds[sd]||H.y<GY;g.uw=g.pw.clone().multiply(g.uq);g.fw=g.hw.clone().multiply(g.hq.clone().invert());
        const ax=H.clone().sub(S);if(ax.length()<1e-4)continue;g.u=ax.normalize();if(H.y>S.y-.05)continue;const e=E.clone().sub(S);if(e.angleTo(H.clone().sub(E))*D<20)continue;
        const uc=g.u.clone().applyQuaternion(cq),pc=e.sub(g.u.clone().multiplyScalar(e.dot(g.u))).normalize().applyQuaternion(cq);
        g.bad=th=>{const r=pc.clone().applyAxisAngle(uc,th);return Math.max(r.y-UP,-sg*r.x-IN);};}
      fr.push(f);}
    a.stop();mx.uncacheAction(c);let any=false;
    for(const sd of['L','R']){if(!fr.some(f=>f[sd].bad&&f[sd].bad(0)>0))continue;any=true;
      if(!own.has(c)){const k=c.clone();for(const p in c)if(!(p in k))k[p]=c[p];clips[ci]=c=k;own.add(k);}
      const N=fr.length,loop=c.loopMode,r=new Q(),TX=fr.some(f=>tw(f[sd].uq)>100/D||tw(f[sd].hq)>100/D)?1e9:TW;
      /* every frame, every turn (3° steps all round): the upper arm and hand rotations it gives, and what it costs */
      const S=fr.map(f=>{const g=f[sd],U=[],H=[],C=new Float64Array(M);for(let k=0;k<M;k++){const t=(k-K)*ST;
        if(!g.u){U.push(g.uq);H.push(g.hq);C[k]=k===K?0:1e9;continue;}r.setFromAxisAngle(g.u,t);
        const uq=g.pw.clone().invert().multiply(r).multiply(g.uw),hq=g.keep?g.fw.clone().premultiply(r).invert().multiply(g.hw):g.hq,b=g.bad?g.bad(t):0;U.push(uq);H.push(hq);
        /* nor twist the upper arm or the hand about its own bone past 95° (or what it already had) */
        const tx=Math.max(tw(uq)-Math.max(TX,tw(g.uq)),tw(hq)-Math.max(TX,tw(g.hq)));C[k]=(b>0?1e3+b*1e3:0)+(tx>0?2e3+tx*1e3:0)+Math.abs(t);}return{U,H,C};});
      const mv=fr.map((f,i)=>i?Math.max(ang(f[sd].uq,fr[i-1][sd].uq),ang(f[sd].hq,fr[i-1][sd].hq)):0),top=Math.max(...mv);
      /* a clip whose arm already jumps more than 25° somewhere may use up to that much, never more */
      const lim=mv.map(o=>top>25/D?Math.max(JMP,o+1/D,top):Math.max(JMP,Math.min(o+1/D,24.5/D)));
      const cl=lim.map(l=>Math.cos(l/2));
      const run=s0=>{let P=new Float64Array(M).fill(1e12);for(let k=0;k<M;k++)if(s0==null||k===s0)P[k]=S[0].C[k]+(s0==null&&!loop?Math.abs(k-K)*.7:0);const B=[];
        for(let i=1;i<N;i++){const nP=new Float64Array(M).fill(1e12),b=new Int16Array(M),s=S[i],p=S[i-1];
          for(let k=0;k<M;k++){let m=1e12,mk=k;for(let d=-W;d<=W;d++){const j=(k+d+M)%M;if(P[j]>=1e12)continue;const v=P[j]+d*d*.002+(Math.abs(s.U[k].dot(p.U[j]))<cl[i]||Math.abs(s.H[k].dot(p.H[j]))<cl[i]?1e4:0);if(v<m){m=v;mk=j;}}nP[k]=m+s.C[k];b[k]=mk;}
          B.push(b);P=nP;}
        let e=s0==null?K:s0;if(s0==null)for(let k=0;k<M;k++){const w=loop?0:.7;if(P[k]+Math.abs(k-K)*w<P[e]+Math.abs(e-K)*w)e=k;}
        const path=[e];for(let i=N-2;i>=0;i--)path.unshift(e=B[i][e]);return{v:P[path[N-1]],path};};
      /* a looping clip ends on the turn it starts with; a clip played once starts and ends unturned when it can (it blends with the idle) */
      let best=run(null);if(loop){const a0=run(best.path[0]),a1=run(best.path[N-1]);best=a0.v<a1.v?a0:a1;}
      const UQ=[],HQ=[];let pu=null,ph=null;
      for(let i=0;i<N;i++){const k=best.path[i],uq=S[i].U[k].clone(),hq=S[i].H[k].clone();
        if(pu&&pu.dot(uq)<0)uq.set(-uq.x,-uq.y,-uq.z,-uq.w);if(ph&&ph.dot(hq)<0)hq.set(-hq.x,-hq.y,-hq.z,-hq.w);pu=uq;ph=hq;UQ.push(uq.x,uq.y,uq.z,uq.w);HQ.push(hq.x,hq.y,hq.z,hq.w);}
      c.tracks=c.tracks.filter(t=>t.name!=='upperArm_'+sd+'.quaternion'&&t.name!=='hand_'+sd+'.quaternion');
      c.tracks.push(new THREE.QuaternionKeyframeTrack('upperArm_'+sd+'.quaternion',T.slice(),UQ),new THREE.QuaternionKeyframeTrack('hand_'+sd+'.quaternion',T.slice(),HQ));}
    if(!any)done.add(c);}
  mx.uncacheRoot(root);for(const[o,p,q,sc]of keep){o.position.copy(p);o.quaternion.copy(q);o.scale.copy(sc);}}
/* every asset is built through here (only rigged characters with clips are touched); buildRaw is the builder without the fix */
for(const A of ASSETS){if(A.elbowsWrapped)continue;const b=A.build;A.elbowsWrapped=true;A.buildRaw=b;A.build=(s,o)=>{const r=b(s,o);try{fixElbows(r);}catch(e){console.warn('fixElbows',A.id,e);}return r;};}
