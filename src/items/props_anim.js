/* ======================= animated props: clips for objects that open, break, swing or bubble =======================
   propAnim(root, parts, defs) bakes AnimationClips (30 fps) from functions, so they play in the viewer and export in the GLB.
   - parts: the Object3Ds that move; each gets a unique name (tracks bind by name) and goes into userData.joints (the viewer's rig dots).
   - defs: [{name, dur, loop, hold, next, fn(t, S)}]; fn writes S[part.name] = {p:[x,y,z], r:[x,y,z,order], q:Quaternion, s:number|[x,y,z]} (absolute local values);
     a part a clip never writes gets no track, so it keeps whatever pose it has.
   - An empty 'Idle' clip is added first unless a def is called Idle: the viewer poses every asset on Idle, and fading to it returns
     the parts to the pose they were built in (the mixer blends towards the original state). One-shot clips use hold so they stay put. */
function propAnim(root,parts,defs){const cnt=new Map();root.traverse(o=>{if(o.name)cnt.set(o.name,(cnt.get(o.name)||0)+1);});
  for(const o of parts)if(!o.name||cnt.get(o.name)>1){o.name=(o.name||'part')+'_'+o.id;cnt.set(o.name,1);}
  const rest=new Map(parts.map(o=>[o,{p:o.position.toArray(),q:o.quaternion.clone(),s:o.scale.toArray()}])),E=new THREE.Euler(),Q=new THREE.Quaternion();
  const out=[];if(!defs.some(d=>d.name==='Idle')){const c=new THREE.AnimationClip('Idle',1,[]);c.loopMode=1;out.push(c);}
  for(const d of defs){const n=Math.max(2,Math.round(d.dur*30)+1),times=[],rec=new Map();
    for(let k=0;k<n;k++){const t=k/(n-1)*d.dur;times.push(t);const S={};d.fn(t,S);
      for(const o of parts){const st=S[o.name];if(!st&&!rec.has(o))continue;let R=rec.get(o);if(!R){R={p:[],q:[],s:[],P:false,Qd:false,Sd:false,k0:k};rec.set(o,R);for(let j=0;j<k;j++)pushRest(R,o);}
        const rs=rest.get(o);if(st&&st.p){R.p.push(...st.p);R.P=true;}else R.p.push(...rs.p);
        if(st&&st.q){R.q.push(st.q.x,st.q.y,st.q.z,st.q.w);R.Qd=true;}else if(st&&st.r){E.set(st.r[0],st.r[1],st.r[2],st.r[3]||'XYZ');Q.setFromEuler(E);R.q.push(Q.x,Q.y,Q.z,Q.w);R.Qd=true;}else R.q.push(rs.q.x,rs.q.y,rs.q.z,rs.q.w);
        if(st&&st.s!==undefined){const v=typeof st.s==='number'?[st.s,st.s,st.s]:st.s;R.s.push(...v.map(x=>Math.max(1e-4,x)));R.Sd=true;}else R.s.push(...rs.s);}}
    const tracks=[];for(const[o,R]of rec){if(R.P)tracks.push(new THREE.VectorKeyframeTrack(o.name+'.position',times,R.p));if(R.Qd)tracks.push(new THREE.QuaternionKeyframeTrack(o.name+'.quaternion',times,R.q));if(R.Sd)tracks.push(new THREE.VectorKeyframeTrack(o.name+'.scale',times,R.s));}
    const c=new THREE.AnimationClip(d.name,d.dur,tracks);c.loopMode=d.loop?1:0;if(d.hold)c.hold=true;if(d.next)c.next=d.next;out.push(c);}
  function pushRest(R,o){const rs=rest.get(o);R.p.push(...rs.p);R.q.push(rs.q.x,rs.q.y,rs.q.z,rs.q.w);R.s.push(...rs.s);}
  root.userData.clips=(root.userData.clips||[]).concat(out);root.userData.joints=(root.userData.joints||[]).concat(parts.filter(o=>!(root.userData.joints||[]).includes(o)));return out;}
const paEase=x=>x<=0?0:x>=1?1:x<.5?2*x*x:1-Math.pow(-2*x+2,2)/2,paLerp=(a,b,k)=>a.map((v,i)=>v+(b[i]-v)*k),paClamp=x=>Math.max(0,Math.min(1,x));
/* debris: thrown from p0 with velocity v at time t0, lands at height rest, turning from q0 to q1 on the way; returns {p,q} or null before t0 */
function paFly(t,o){if(t<o.t0)return null;const dt=t-o.t0,vy=o.v[1],h=o.p0[1]-o.rest,tl=(vy+Math.sqrt(vy*vy+19.6*Math.max(0,h)))/9.8,tt=Math.min(dt,tl);
  const y=dt<tl?o.p0[1]+vy*dt-4.9*dt*dt:o.rest,p=[o.p0[0]+o.v[0]*tt,y,o.p0[2]+o.v[2]*tt],q=o.q0.clone().slerp(o.q1,paEase(Math.min(1,dt/tl)));return{p,q};}
const paQ=(x,y,z,order='XYZ')=>new THREE.Quaternion().setFromEuler(new THREE.Euler(x,y,z,order));
const paHide=o=>{o.scale.setScalar(1e-4);return o;};

/* ---------- gates, doors and portcullises: every vGateAnim gets Open and Close clips; the moving parts are found by trying the gate shut and open ---------- */
const vGateAnim0=vGateAnim;
vGateAnim=function(root,start,applyFn){vGateAnim0(root,start,applyFn);const objs=[];root.traverse(o=>{if(o!==root)objs.push(o);});
  const snap=()=>objs.map(o=>[o.position.toArray(),o.quaternion.toArray()]);applyFn(0);const a=snap();applyFn(1);const b=snap();
  const moving=objs.filter((o,i)=>a[i][0].some((v,j)=>Math.abs(v-b[i][0][j])>1e-4)||a[i][1].some((v,j)=>Math.abs(v-b[i][1][j])>1e-4));applyFn(+start);
  if(!moving.length)return;moving.forEach((o,i)=>{if(!o.name)o.name='gate_part_'+i;});
  const dur=2.2,pose=e=>{applyFn(e);const S={};for(const o of moving)S[o.name]={p:o.position.toArray(),q:o.quaternion.clone()};return S;};
  propAnim(root,moving,[{name:'Open',dur,hold:true,fn:(t,S)=>Object.assign(S,pose(paEase(t/dur)))},{name:'Close',dur,hold:true,fn:(t,S)=>Object.assign(S,pose(1-paEase(t/dur)))}]);applyFn(+start);};

/* ---------- breakable barrel ---------- */
function paBarrelBreak(root,body,o={}){const r=mulberry32(o.seed||7),deb=[],H=o.h||.8,R=o.r||.3,y0=o.y||0;
  for(let i=0;i<8;i++){const a=i/8*Math.PI*2,g=new THREE.Group();g.name='stave_'+i;put(root,g,Math.cos(a)*(R-.03),y0+H/2,Math.sin(a)*(R-.03),0,-a+Math.PI/2,0);bx(g,.24,H,.05,vm('barrel'),0,0,0);paHide(g);
    const ψ=r()*6.28,d=.5+r()*.8;deb.push({g,f:{t0:.1,p0:g.position.toArray(),v:[Math.cos(a)*(1.4+r()),1.2+r()*1.6,Math.sin(a)*(1.4+r())],rest:.025,q0:g.quaternion.clone(),q1:paQ(Math.PI/2,ψ,0,'YXZ')}});}
  for(let i=0;i<2;i++){const g=new THREE.Group();g.name='hoop_'+i;put(root,g,0,y0+(i?H*.85:H*.15),0);for(const s of[-1,1]){bx(g,2*R+.04,.04,.03,vm('iron'),0,0,s*(R+.005));bx(g,.03,.04,2*R+.04,vm('iron'),s*(R+.005),0,0);}paHide(g);
    const a=r()*6.28;deb.push({g,f:{t0:.1,p0:g.position.toArray(),v:[Math.cos(a)*.8,.6+r(),Math.sin(a)*.8],rest:.02+i*.04,q0:new THREE.Quaternion(),q1:paQ(0,r()*3,0)}});}
  let pud=null;if(o.liquid){pud=new THREE.Group();pud.name='puddle';put(root,pud,0,.006,0);for(const[x,z,w,d]of[[0,0,.8,.7],[.35,.2,.5,.4],[-.3,-.2,.45,.5],[.1,-.38,.3,.25]])bx(pud,w,.012,d,vm(o.liquid),x,0,z);paHide(pud);}
  const parts=[body,...deb.map(d=>d.g)];if(pud)parts.push(pud);
  propAnim(root,parts,[{name:'Hit',dur:.6,next:'Idle',fn:(t,S)=>{S[body.name]={r:[0,0,Math.sin(t*30)*.1*(1-t/.6)]};}},
    {name:'Break',dur:1.8,hold:true,fn:(t,S)=>{S[body.name]={s:t<.06?[1,1,1]:t<.1?[1.08,.88,1.08]:1e-4};for(const d of deb){const f=paFly(t,d.f);S[d.g.name]=f?{p:f.p,q:f.q,s:1}:{s:1e-4};}
      if(pud)S.puddle={s:t<.1?1e-4:[paClamp((t-.1)/1.2),1,paClamp((t-.1)/1.2)]};}}]);}
/* ---------- breakable crate: the lid flies, the sides fall outwards ---------- */
function paCrateBreak(root,body,hide=[],s=.7){const r=mulberry32(11),deb=[];
  for(let f=0;f<5;f++){const g=new THREE.Group();g.name='panel_'+f;if(f<4){const a=f*Math.PI/2;put(root,g,Math.sin(a)*(s/2-.03),s/2,Math.cos(a)*(s/2-.03),0,a,0);bx(g,s,s,.06,vm('crate'),0,0,0);
      deb.push({g,f:{t0:.08,p0:g.position.toArray(),v:[Math.sin(a)*(.8+r()*.6),.8+r()*.8,Math.cos(a)*(.8+r()*.6)],rest:.03,q0:g.quaternion.clone(),q1:paQ(Math.PI/2,a+(r()-.5)*.8,0,'YXZ')}});}
    else{put(root,g,0,s-.03,0);bx(g,s,.06,s,vm('crate'),0,0,0);deb.push({g,f:{t0:.08,p0:g.position.toArray(),v:[(r()-.5)*1.2,2.4,(r()-.5)*1.2],rest:.03,q0:new THREE.Quaternion(),q1:paQ(0,r()*3,0)}});}paHide(g);}
  const parts=[body,...hide,...deb.map(d=>d.g)];
  propAnim(root,parts,[{name:'Hit',dur:.6,next:'Idle',fn:(t,S)=>{S[body.name]={r:[0,Math.sin(t*28)*.06*(1-t/.6),Math.sin(t*34)*.05*(1-t/.6)]};}},
    {name:'Break',dur:1.6,hold:true,fn:(t,S)=>{S[body.name]={s:t<.08?1:1e-4};for(const h of hide)S[h.name]={s:t<.08?1:1e-4};for(const d of deb){const f=paFly(t,d.f);S[d.g.name]=f?{p:f.p,q:f.q,s:1}:{s:1e-4};}}}]);}
/* chest with a hinged lid (gold inside) */
function paChest(open){const root=iRoot(1.4),w=vm('planksDark'),ir=vm('iron');hollow(root,.8,.32,.5,.05,w,0,0,0);for(const s of[-.3,.3]){bx(root,.06,.33,.04,ir,s,.165,.255);bx(root,.06,.33,.04,ir,s,.165,-.255);}
  for(let i=0;i<14;i++){const r=mulberry32(i*7);bx(root,.1,.05,.1,vm('gold'),-.3+r()*.6,.27+r()*.03,-.15+r()*.3,0,r()*3,0);}bx(root,.7,.2,.4,vm('gold'),0,.15,0);
  const lid=new THREE.Group();lid.name='lid';put(root,lid,0,.32,-.25);bx(lid,.8,.14,.5,w,0,.07,.25);for(const s of[-.3,.3])bx(lid,.06,.15,.52,ir,s,.075,.25);bx(lid,.1,.12,.04,ir,0,.02,.51);
  lid.rotation.x=open?-1.9:0;propAnim(root,[lid],[{name:'Open',dur:1.2,hold:true,fn:(t,S)=>{S.lid={r:[-1.9*paEase(t/1.2),0,0]};}},{name:'Close',dur:1,hold:true,fn:(t,S)=>{const k=paEase(t/1);S.lid={r:[-1.9*(1-k)+(k>.92?Math.sin((k-.92)*80)*.03:0),0,0]};}}]);return root;}
{const pa=(id,fn)=>{const a=ASSETS.find(x=>x.id===id);if(!a)return;const b0=a.build;a.build=(s,o)=>fn(b0(s,o),s,o||{});};
  const LIQ={wine:'liqRed',ale:'ale',water:'water',oil:'oil',milk:'milk'};
  pa('it-c-barrel',(root,s,o)=>{const b=root.children[0];b.name='barrel';paBarrelBreak(root,b,{liquid:LIQ[o.contents||'wine']});return root;});
  pa('it-c-crate',(root,s,o)=>{const body=root.children[0];body.name='crate';const hide=root.children.slice(1).filter(c=>c!==body);const hg=new THREE.Group();hg.name='contents';hide.forEach(c=>hg.add(c));root.add(hg);paCrateBreak(root,body,[hg]);return root;});
  {const a=ASSETS.find(x=>x.id==='it-c-chest');if(a){a.build=(s,o)=>paChest(+((o||{}).open??1)===1);a.desc='Iron-bound chest with a hinged lid and gold inside; clips Open and Close.';}}
  for(const id of['it-c-barrel','it-c-crate']){const a=ASSETS.find(x=>x.id===id);if(a)a.desc+=' Clips: Hit (wobble) and Break (it bursts apart; '+(id==='it-c-barrel'?'staves and hoops fly and land flat, liquids spill':'the lid flies off and the sides fall outwards')+').';}}
