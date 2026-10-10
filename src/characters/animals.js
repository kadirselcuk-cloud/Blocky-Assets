/* ======================= ANIMALS: rigs, coats and clips ======================= */
/* coat textures are made per colour on demand */
function coatKind(style,hex){const k=style+hex.slice(1);if(VXD[k])return k;const c=new THREE.Color(hex),dk='#'+c.clone().multiplyScalar(.82).getHexString(),lt='#'+c.clone().lerp(new THREE.Color(1,1,1),.12).getHexString();
  VXD[k]=style==='wool'?(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++){const blob=((x>>1)+(y>>1)*3)%4;P(x,y,blob===0?dk:blob===1?lt:hex,nz(r,.9,1.06));}}
   :style==='hair'?(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,(y+(x>>2))%5===0?dk:hex,nz(r,.92,1.05));}
   :style==='speck'?(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,r()<.3?'#f0ece4':r()<.5?dk:hex,nz(r,.9,1.06));}
   :(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,hex,nz(r,.93,1.04));};return k;}
const cm=(style,hex)=>vm(coatKind(style,hex));
const darker=(hex,f=.6)=>'#'+new THREE.Color(hex).multiplyScalar(f).getHexString();

/* clip sampler: fn(u) returns {joint:[rx,ry,rz] degrees, _pos:[dx,dy,dz] for the body} */
function aClip(model,name,dur,loop,fn){const fps=30,n=Math.max(2,Math.round(dur*fps)+1),times=[],J=model.userData.ajoints,vals={},pos=[],body=model.getObjectByName('body'),bp=body.position.clone();
  for(const j of J)vals[j]=[];const e=new THREE.Euler(),q=new THREE.Quaternion(),D=Math.PI/180;
  for(let i=0;i<n;i++){const t=i/(n-1)*dur,u=t/dur,p=fn(u,t)||{};times.push(t);for(const j of J){const a=p[j]||[0,0,0];e.set(a[0]*D,a[1]*D,a[2]*D);q.setFromEuler(e);vals[j].push(q.x,q.y,q.z,q.w);}const o=p._pos||[0,0,0];pos.push(bp.x+o[0],bp.y+o[1],bp.z+o[2]);}
  const tracks=J.map(j=>new THREE.QuaternionKeyframeTrack(j+'.quaternion',times,vals[j]));tracks.push(new THREE.VectorKeyframeTrack('body.position',times,pos));
  const c=new THREE.AnimationClip(name,dur,tracks);c.loopMode=loop;return c;}
const S=x=>Math.sin(x*Math.PI*2),C=x=>Math.cos(x*Math.PI*2);
/* joint helper: a static rest group with an animated joint inside it */
function aJ(par,name,x,y,z,rest=[0,0,0]){const r=new THREE.Group();r.position.set(x,y,z);r.rotation.set(rest[0],rest[1],rest[2]);par.add(r);const j=new THREE.Group();j.name=name;j.userData.joint=true;r.add(j);return j;}

/* ---------- quadrupeds ---------- */
const QUAD={
  sheep:{bl:.95,bw:.6,bh:.55,lh:.42,lw:.12,nl:.22,na:.75,hl:.32,hw:.24,hh:.24,tail:.14,tt:'hang',ears:'side',fur:'wool',group:'grazer'},
  goat:{bl:.85,bw:.42,bh:.42,lh:.5,lw:.1,nl:.32,na:.55,hl:.32,hw:.2,hh:.2,tail:.12,tt:'up',ears:'side',horns:'goat',beard:true,group:'grazer'},
  horse:{bl:1.6,bw:.58,bh:.66,lh:.95,lw:.16,nl:.75,na:.62,hl:.6,hw:.26,hh:.28,tail:.75,tt:'horse',ears:'up',mane:true,muz:.2,chest:true,group:'grazer'},
  donkey:{bl:1.15,bw:.48,bh:.5,lh:.68,lw:.13,nl:.48,na:.7,hl:.48,hw:.24,hh:.26,tail:.55,tt:'tuft',ears:'big',mane:'short',muz:.2,chest:true,group:'grazer'},
  pig:{bl:1,bw:.56,bh:.5,lh:.28,lw:.14,nl:.1,na:1.3,hl:.3,hw:.32,hh:.3,tail:.12,tt:'curl',ears:'flop',snout:true,group:'pig'},
  boar:{bl:1.05,bw:.5,bh:.52,lh:.36,lw:.13,nl:.12,na:1.25,hl:.4,hw:.3,hh:.32,tail:.18,tt:'hang',ears:'up',snout:true,tusks:true,mane:'ridge',group:'pig'},
  cow:{bl:1.6,bw:.72,bh:.74,lh:.68,lw:.17,nl:.36,na:.95,hl:.5,hw:.36,hh:.36,tail:.7,tt:'tuft',ears:'side',horns:'cow',muz:.14,group:'grazer'},
  bison:{bl:1.9,bw:.9,bh:.9,lh:.72,lw:.22,nl:.3,na:1.25,hl:.55,hw:.5,hh:.5,tail:.45,tt:'tuft',ears:'side',horns:'bison',beard:true,hump:true,shag:true,muz:.12,group:'grazer'},
  deer:{bl:1,bw:.34,bh:.42,lh:.78,lw:.08,nl:.5,na:.42,hl:.34,hw:.2,hh:.2,tail:.12,tt:'up',ears:'big',muz:.1,group:'deer'},
  dog:{bl:.7,bw:.28,bh:.3,lh:.36,lw:.08,nl:.2,na:.55,hl:.26,hw:.2,hh:.2,tail:.32,tt:'wag',ears:'up',muz:.12,group:'canine'},
  wolf:{bl:.9,bw:.32,bh:.36,lh:.48,lw:.09,nl:.24,na:.5,hl:.3,hw:.22,hh:.22,tail:.42,tt:'bushy',ears:'up',muz:.15,group:'canine'},
  bear:{bl:1.4,bw:.76,bh:.72,lh:.55,lw:.22,nl:.22,na:.95,hl:.4,hw:.36,hh:.32,tail:.1,tt:'short',ears:'round',muz:.15,group:'bear'},
  rabbit:{bl:.36,bw:.22,bh:.2,lh:.12,lw:.06,nl:.06,na:.5,hl:.16,hw:.14,hh:.14,tail:.07,tt:'puff',ears:'tall',group:'rabbit'}};
function youngP(P,sp){const L=['horse','donkey','deer','cow','bison','goat'].includes(sp)?.78:.62;return Object.assign({},P,{bl:P.bl*.55,bw:P.bw*.6,bh:P.bh*.58,lh:P.lh*L,lw:P.lw*.75,nl:P.nl*.65,hl:P.hl*.72,hw:P.hw*.82,hh:P.hh*.82,tail:P.tail*.55,muz:P.muz&&P.muz*.8,horns:null,beard:false,tusks:false,hump:false,shag:false,mane:P.mane&&'short',young:true});}
function buildQuad(sp,o){const P=o.young?youngP(QUAD[sp],sp):QUAD[sp],root=new THREE.Group();root.userData.animal=sp;root.userData.lights=[];root.userData.P=P;
  const coat=o.coat,face=o.face||coat,leg=o.leg||face,hoof=vm(['pig','boar'].includes(sp)?coatKind('flat',darker(coat,.8)):['dog','wolf','bear','rabbit'].includes(sp)?coatKind('flat',darker(coat,.55)):'dark');
  const bodyM=o.bodyM||cm(P.fur==='wool'?'wool':'hair',coat),faceM=o.faceM||cm('hair',face),legM=cm('hair',leg);
  const yB=P.lh+P.bh/2,body=new THREE.Group();body.name='body';body.position.set(0,yB,0);root.add(body);
  bx(body,P.bw,P.bh,P.bl,bodyM,0,0,0);if(P.fur==='wool')bx(body,P.bw+.06,P.bh*.6,P.bl*.8,bodyM,0,.06,0);
  if(P.chest)bx(body,P.bw*.92,P.bh*.86,.3,bodyM,0,.04,P.bl/2+.08);
  if(P.hump){bx(body,P.bw*.9,P.bh*.35,P.bl*.42,bodyM,0,P.bh*.55,P.bl*.18);}
  if(P.shag){const sg=cm('wool',darker(coat,.75));bx(body,P.bw+.1,P.bh+.08,P.bl*.5,sg,0,.06,P.bl*.24);bx(body,P.bw*.95,P.bh*.4,P.bl*.42,sg,0,P.bh*.62,P.bl*.2);}
  if(o.udder)bx(body,P.bw*.4,.14,.3,cm('flat','#e8b0a8'),0,-P.bh/2-.05,-P.bl*.25);
  if(o.belly)bx(body,P.bw*.8,.02,P.bl*.7,cm('hair',o.belly),0,-P.bh/2-.006,0);
  const legs={};for(const[k,sx,sz]of[['FL',1,1],['FR',-1,1],['BL',1,-1],['BR',-1,-1]]){const up=aJ(body,'leg_'+k,sx*(P.bw/2-P.lw/2-.02),-P.bh/2+.04,sz*(P.bl/2-P.lw*.9));const hb=sp==='rabbit'&&k[0]==='B'?1.6:1,ul=P.lh*.55*hb,ll=P.lh*.45*hb;
    bx(up,P.lw*1.15*hb,ul+.06,P.lw*1.2*hb,P.fur==='wool'?legM:bodyM,0,-ul/2+.03,0);const kn=aJ(up,'knee_'+k,0,-ul,0);bx(kn,P.lw*hb,ll,P.lw*hb,legM,0,-ll/2,0);bx(kn,P.lw*1.05*hb,.06,P.lw*1.12*hb+(sp==='rabbit'&&hb>1?.08:0),hoof,0,-ll+.03,.01+(hb>1?.04:0));legs[k]={up,kn};}
  const neck=aJ(body,'neck',0,P.bh*.2,P.bl/2-.04,[P.na,0,0]);bx(neck,P.hw*.9,P.nl+.1,P.hw*.95,P.fur==='wool'?faceM:bodyM,0,P.nl/2,0);
  if(P.mane){const mn=o.mane||darker(coat,.45);if(P.mane==='ridge')bx(body,.08,.1,P.bl*.6,cm('hair',mn),0,P.bh/2+.04,P.bl*.15);else{bx(neck,.08,P.nl+.12,P.hw*.5,cm('hair',mn),0,P.nl/2+.02,-P.hw*.45);if(P.mane===true)bx(body,.07,.08,.5,cm('hair',mn),0,P.bh/2+.02,P.bl/2-.25);}}
  const head=aJ(neck,'head',0,P.nl,.02,[-P.na-.15,0,0]);bx(head,P.hw,P.hh,P.hl,faceM,0,0,P.hl/2-.04);
  if(P.muz){bx(head,P.hw*.72,P.hh*.62,P.muz,cm('hair',o.muzzle||face),0,-P.hh*.12,P.hl-.04+P.muz/2);bx(head,P.hw*.3,P.hh*.18,.02,vm('dark'),0,-P.hh*.02,P.hl-.03+P.muz);}
  if(P.snout){bx(head,P.hw*.6,P.hh*.5,.1,cm('flat',darker(coat,.9)),0,-.04,P.hl+.01);for(const s of[-1,1])bx(head,.04,.04,.01,vm('dark'),s*.05,-.04,P.hl+.065);}
  if(P.tusks)for(const s of[-1,1])bx(head,.03,.08,.03,vm('woolWhite'),s*P.hw*.32,0,P.hl-.02,-.4,0,0);
  if(P.fur==='wool')bx(head,P.hw+.06,.1,P.hl*.5,bodyM,0,P.hh/2,P.hl*.1);
  for(const s of[-1,1])bx(head,.03,.04,.03,vm('dark'),s*(P.hw/2+.003),P.hh*.15,P.hl*.45);
  const er={side:[0,0,1.3],flop:[.6,0,.9],up:[0,0,.15],big:[0,0,.5],round:[0,0,.2],tall:[-.2,0,.12]};const eh={side:.12,flop:.12,up:P.hl*.4,big:.22,round:.08,tall:.22}[P.ears]*(P.young?.85:1);
  for(const s of[-1,1]){const ear=aJ(head,'ear_'+(s>0?'L':'R'),s*P.hw*.32,P.hh/2,0,[er[P.ears][0],0,-s*er[P.ears][2]]);bx(ear,P.ears==='round'?.09:P.ears==='tall'?.06:.06,eh,.04,P.ears==='flop'||o.flop?bodyM:faceM,0,eh/2,0);if(P.ears==='tall')bx(ear,.04,eh*.8,.045,cm('flat','#e8b8b0'),0,eh/2,.003);}
  if(P.horns==='goat')for(const s of[-1,1]){const hn=new THREE.Group();put(head,hn,s*.07,P.hh/2,0,-.6,0,-s*.2);bx(hn,.05,.18,.05,vm('stone'),0,.09,0);bx(hn,.04,.12,.04,vm('stone'),0,.18,-.05,-.7,0,0);}
  if(P.horns==='cow'&&!o.polled)for(const s of[-1,1]){bx(head,.16,.05,.05,vm('woolWhite'),s*(P.hw/2+.06),P.hh/2-.04,P.hl*.25);bx(head,.05,.1,.05,vm('woolWhite'),s*(P.hw/2+.13),P.hh/2+.02,P.hl*.25);}
  if(P.horns==='bison')for(const s of[-1,1]){bx(head,.12,.07,.07,vm('dark'),s*(P.hw/2+.04),P.hh/2-.06,P.hl*.3);bx(head,.06,.12,.06,vm('dark'),s*(P.hw/2+.08),P.hh/2+.02,P.hl*.3);}
  if(o.antlers&&!P.young){for(const s of[-1,1]){const an=new THREE.Group();put(head,an,s*.07,P.hh/2,P.hl*.2,-.2,0,-s*.4);const am=vm('woolWhite');bx(an,.04,.38,.04,am,0,.19,0);for(const[y,z,l]of[[.12,.06,.14],[.24,.07,.16],[.34,-.04,.12]])bx(an,.03,l,.03,am,0,y+l/2*.6,z,z>0?.8:-.8,0,0);}}
  if(P.beard)bx(head,P.hw*.4,P.hh*.6,P.hl*.25,cm('hair',darker(face,.7)),0,-P.hh/2-P.hh*.25,P.hl*.6);
  if(P.shag)bx(head,P.hw+.08,P.hh*.5,P.hl*.4,cm('wool',darker(coat,.75)),0,P.hh*.35,P.hl*.1);
  const tr={hang:.35,up:-.5,horse:.35,tuft:.25,curl:-.6,bushy:.7,wag:-.6,short:.2,puff:-.3}[P.tt];const tail=aJ(body,'tail',0,P.bh*.32,-P.bl/2,[tr,0,0]);const tm=cm('hair',o.mane||darker(coat,.45));
  if(P.tt==='curl'){bx(tail,.04,.1,.04,bodyM,0,-.05,0);bx(tail,.04,.04,.08,bodyM,0,-.1,-.03);}
  else if(P.tt==='horse'){bx(tail,.06,.18,.06,bodyM,0,-.09,0);bx(tail,.14,P.tail,.1,tm,0,-P.tail/2-.12,0);}
  else if(P.tt==='tuft'){bx(tail,.05,P.tail,.05,bodyM,0,-P.tail/2,0);bx(tail,.1,.16,.1,tm,0,-P.tail-.04,0);}
  else if(P.tt==='bushy')bx(tail,.12,P.tail,.12,o.tailM||bodyM,0,-P.tail/2,0);
  else if(P.tt==='puff')bx(tail,.09,.09,.09,cm('flat','#f0ece4'),0,-.03,-.02);
  else if(P.tt==='up'&&sp==='deer')bx(tail,.08,P.tail,.04,cm('flat','#f0ece4'),0,-P.tail/2,-.01);
  else bx(tail,P.tt==='wag'?.06:.08,P.tail,.07,bodyM,0,-P.tail/2,0);
  root.userData.parts={body,legs,neck,head,tail};
  root.userData.ajoints=['body','leg_FL','leg_FR','leg_BL','leg_BR','knee_FL','knee_FR','knee_BL','knee_BR','neck','head','tail','ear_L','ear_R'];
  const joints=[];root.traverse(q=>{if(q.userData.joint)joints.push(q);});root.userData.joints=joints;quadClips(root,sp,P);root.userData.ground=Math.max(1.4,P.bl*1.6);return root;}
function quadClips(m,sp,P){const g=P.group,drop=P.lh*.7,big=P.bl>1.1;
  /* knees bend while the foot travels forward, so the gait reads as moving forwards */
  const legsAt=(u,A,K,ph)=>{const r={};for(const[k,o]of Object.entries(ph)){const sw=Math.max(0,-C(u+o));r['leg_'+k]=[S(u+o)*A,0,0];r['knee_'+k]=[k[0]==='F'?sw*K:-sw*K*.8,0,0];}return r;};
  const W={BL:0,FL:.25,BR:.5,FR:.75},Tr={FL:0,BR:0,FR:.5,BL:.5},G={BL:0,BR:.1,FL:.45,FR:.55};
  const tailIdle=u=>g==='canine'&&sp==='dog'?[0,S(u*8)*28,0]:[0,S(u*2)*14,S(u)*4];
  if(g==='rabbit'){m.userData.clips=[
    aClip(m,'Idle',3,true,u=>({head:[S(u*6)*2,S(u)*10,0],ear_L:[S(u*2)*8,0,0],ear_R:[S(u*2+.4)*8,0,0],_pos:[0,S(u*4)*.003,0]})),
    aClip(m,'Hop',.7,true,u=>{const k=Math.max(0,Math.sin(u*Math.PI*2));return{_pos:[0,k*.16,0],body:[-k*15,0,0],leg_BL:[k*-50,0,0],leg_BR:[k*-50,0,0],knee_BL:[k*40,0,0],knee_BR:[k*40,0,0],leg_FL:[k*40,0,0],leg_FR:[k*40,0,0],ear_L:[k*25,0,0],ear_R:[k*25,0,0]};}),
    aClip(m,'Run',.4,true,u=>{const k=Math.max(0,Math.sin(u*Math.PI*2));return{_pos:[0,k*.22,0],body:[-k*10,0,0],leg_BL:[-60*k,0,0],leg_BR:[-60*k,0,0],leg_FL:[50*k,0,0],leg_FR:[50*k,0,0],ear_L:[40,0,0],ear_R:[40,0,0]};}),
    aClip(m,'Sit up',2.5,true,u=>({body:[-55,0,0],_pos:[0,.1,-.06],leg_BL:[55,0,0],leg_BR:[55,0,0],leg_FL:[40,0,0],leg_FR:[40,0,0],knee_FL:[40,0,0],knee_FR:[40,0,0],head:[45+S(u*3)*4,S(u)*20,0],neck:[-20,0,0]})),
    aClip(m,'Eat',2,true,u=>({neck:[40,0,0],head:[20+S(u*8)*5,0,0]})),
    aClip(m,'Lie down',3,true,u=>({_pos:[0,-P.lh*.8,0],leg_FL:[80,0,0],leg_FR:[80,0,0],leg_BL:[-70,0,0],leg_BR:[-70,0,0],ear_L:[60,0,0],ear_R:[60,0,0]}))];return;}
  const clips=[
    aClip(m,'Idle',4,true,u=>({neck:[S(u)*3,S(u*.5)*6,0],head:[S(u+.2)*3,S(u)*5,0],tail:tailIdle(u),ear_L:[S(u*2)*6,0,0],ear_R:[S(u*2+.3)*6,0,0],_pos:[0,S(u*2)*.004,0]})),
    aClip(m,'Walk',big?1.2:g==='canine'?.7:.9,true,u=>Object.assign(legsAt(u,22,40,W),{neck:[S(u*2)*4,0,0],head:[-S(u*2)*3,0,0],tail:sp==='dog'?[0,S(u*2)*20,0]:[0,S(u)*10,0],_pos:[0,Math.abs(S(u*2))*.02,0]})),
    aClip(m,sp==='horse'?'Gallop':'Run',sp==='horse'?.6:g==='canine'?.42:.5,true,u=>Object.assign(legsAt(u,sp==='horse'||g==='canine'||g==='deer'?40:30,70,sp==='horse'||g==='canine'||g==='deer'?G:Tr),{body:[S(u)*(g==='canine'||g==='deer'?6:2),0,0],neck:[S(u)*8,0,0],head:[-S(u)*6,0,0],tail:[20,S(u)*8,0],_pos:[0,Math.abs(S(u))*.06*P.lh,0]})),
    aClip(m,'Lie down',3,true,u=>({leg_FL:[80,0,0],knee_FL:[-160,0,0],leg_FR:[80,0,0],knee_FR:[-160,0,0],leg_BL:[-75,0,0],knee_BL:[150,0,0],leg_BR:[-75,0,0],knee_BR:[150,0,0],neck:[-10+S(u)*2,S(u*.5)*6,0],head:[10,0,0],tail:[30,0,0],_pos:[0,-drop+S(u)*.006,0]})),
    aClip(m,'Shake head',1,false,u=>({neck:[-6,S(u*3)*14*(1-u),0],head:[0,S(u*3)*24*(1-u),S(u*3)*10*(1-u)],ear_L:[0,0,S(u*6)*20*(1-u)],ear_R:[0,0,-S(u*6)*20*(1-u)]}))];
  const sit=u=>({body:[-28,0,0],_pos:[0,-P.lh*.22,-P.bl*.12],leg_FL:[28,0,0],leg_FR:[28,0,0],leg_BL:[-62,0,0],knee_BL:[120,0,0],leg_BR:[-62,0,0],knee_BR:[120,0,0],neck:[-15,0,0],head:[20+S(u)*3,S(u*.5)*10,0],tail:[50,S(u*4)*(sp==='dog'?25:3),0]});
  if(g==='grazer'||g==='pig'||g==='deer')clips.push(aClip(m,'Graze',3,true,u=>({neck:[62+S(u*2)*4,S(u)*8,0],head:[8+S(u*6)*6,0,0],tail:[0,S(u*1.5)*12,0],leg_FL:[6,0,0],leg_FR:[-4,0,0],ear_L:[-10,0,0],ear_R:[-10,0,0]})));
  if(sp==='horse')clips.push(aClip(m,'Rear',1.8,false,u=>{const k=Math.sin(Math.min(1,u*1.25)*Math.PI);return{body:[-35*k,0,0],_pos:[0,k*.3,-k*.25],leg_FL:[-40*k,0,0],knee_FL:[100*k,0,0],leg_FR:[-30*k,0,0],knee_FR:[90*k,0,0],leg_BL:[35*k,0,0],leg_BR:[35*k,0,0],neck:[-10*k,0,0],head:[15*k,0,0],tail:[-20*k,0,0]};}));
  if(sp==='sheep'||sp==='goat')clips.push(aClip(m,'Hop',.8,false,u=>{const k=Math.sin(u*Math.PI);return{_pos:[0,k*.35,0],leg_FL:[-30*k,0,0],leg_FR:[-30*k,0,0],leg_BL:[30*k,0,0],leg_BR:[30*k,0,0],tail:[-20*k,0,0]};}));
  if(g==='pig')clips.push(aClip(m,'Root around',2,true,u=>({neck:[40,S(u*2)*14,0],head:[30+S(u*4)*8,0,0],tail:[0,0,S(u*4)*30]})));
  if(sp==='cow'||sp==='bison')clips.push(aClip(m,'Moo',2,false,u=>{const k=Math.sin(u*Math.PI);return{neck:[-20*k,0,0],head:[-25*k,0,0],ear_L:[0,0,15*k],ear_R:[0,0,-15*k]};}));
  if(g==='deer')clips.push(aClip(m,'Alert',2.5,true,u=>({neck:[-22,S(u*.5)*12,0],head:[-8,S(u)*8,0],ear_L:[-25,0,S(u*3)*10],ear_R:[-25,0,-S(u*3)*10],tail:[-30,0,0]})));
  if(g==='canine'){clips.push(aClip(m,'Sit',3,true,sit));clips.push(aClip(m,'Sniff',2,true,u=>({neck:[45,S(u)*18,0],head:[25+S(u*8)*4,S(u*2)*10,0],tail:[0,S(u*4)*(sp==='dog'?25:6),0],leg_FL:[4,0,0]})));
    clips.push(sp==='dog'?aClip(m,'Bark',1.2,true,u=>{const k=Math.max(0,Math.sin(u*Math.PI*4));return{neck:[-10-k*10,0,0],head:[-k*12,0,0],_pos:[0,k*.02,0],tail:[0,S(u*6)*30,0]};})
      :aClip(m,'Howl',3,false,u=>{const k=u<.2?u/.2:u<.8?1:(1-u)/.2;return Object.assign(sit(u),{neck:[-55*k-15,0,0],head:[-30*k,0,0],ear_L:[-20*k,0,0],ear_R:[-20*k,0,0]});}));}
  if(g==='bear'){clips.push(aClip(m,'Sit',3,true,sit));clips.push(aClip(m,'Stand up',3,false,u=>{const k=u<.25?u/.25:u<.75?1:(1-u)/.25;return{body:[-70*k,0,0],_pos:[0,k*P.bl*.38,-k*P.bl*.32],leg_BL:[70*k,0,0],leg_BR:[70*k,0,0],leg_FL:[30*k,0,0],leg_FR:[30*k,0,0],knee_FL:[-40*k,0,0],knee_FR:[-40*k,0,0],neck:[30*k,0,0],head:[30*k,S(u*2)*10*k,0]};}));
    clips.push(aClip(m,'Roar',1.8,false,u=>{const k=Math.sin(u*Math.PI);return{neck:[-20*k,0,0],head:[-25*k,S(u*4)*6*k,0],body:[-6*k,0,0],ear_L:[30*k,0,0],ear_R:[30*k,0,0]};}));
    clips.push(aClip(m,'Sniff',2,true,u=>({neck:[40,S(u)*18,0],head:[25+S(u*8)*4,0,0]})));}
  m.userData.clips=clips;}

/* ---------- birds ---------- */
function buildBird(kind,o){const root=new THREE.Group();root.userData.animal=kind;root.userData.lights=[];const s=kind==='chick'?.45:kind==='rooster'?1.15:1,L=.22*s;
  const main=o.body,neckC=o.neck||main,tailC=o.tail||main,bm_=cm(o.speck?'speck':'flat',main),nm=cm(o.speck?'speck':'flat',neckC),tm=cm('flat',tailC),yel=cm('flat','#e0b030'),red=cm('flat','#c02a22');
  const body=new THREE.Group();body.name='body';body.position.set(0,.2*s+(kind==='chick'?.02:0),0);root.add(body);bx(body,.22*s,.2*s,.3*s,bm_,0,.04*s,0);bx(body,.18*s,.12*s,.12*s,bm_,0,-.02*s,.12*s);
  for(const sd of[-1,1]){const lg=aJ(body,'leg_'+(sd>0?'L':'R'),sd*.05*s,-.04*s,0);bx(lg,.03*s,.16*s,.03*s,yel,0,-.08*s,0);bx(lg,.07*s,.015,.09*s,yel,0,-.16*s,.02*s);
    const wg=aJ(body,'wing_'+(sd>0?'L':'R'),sd*.115*s,.1*s,.06*s);bx(wg,.03*s,.14*s,.24*s,cm(o.speck?'speck':'flat',o.wing||main),0,-.06*s,-.1*s);}
  const neck=aJ(body,'neck',0,.1*s,.12*s,[.25,0,0]);bx(neck,.12*s,.16*s,.12*s,nm,0,.08*s,0);const head=aJ(neck,'head',0,.16*s,0,[-.25,0,0]);bx(head,.12*s,.12*s,.13*s,nm,0,.04*s,.01*s);
  bx(head,.04*s,.035*s,.06*s,yel,0,.03*s,.1*s);for(const sd of[-1,1])bx(head,.02,.02*s+.005,.02,vm('dark'),sd*.061*s,.06*s,.04*s);
  if(kind!=='chick'){const cb=kind==='rooster'?1.8:1;bx(head,.03*s,.06*s*cb,.1*s*cb,red,0,.12*s+.02*cb*s,0);bx(head,.03*s,.05*s*cb,.03*s,red,0,-.01*s,.09*s);}
  const tail=aJ(body,'tail',0,.1*s,-.14*s,[-.5,0,0]);if(kind==='rooster'){for(let i=0;i<4;i++)bx(tail,.04*s,.3*s,.06*s,tm,(i-1.5)*.025*s,.15*s,-.02*s*i,-.25*i,0,0);}else if(kind==='hen')bx(tail,.14*s,.14*s,.06*s,tm,0,.07*s,0);else bx(tail,.06*s,.04*s,.04*s,bm_,0,.02*s,0);
  root.userData.ajoints=['leg_L','leg_R','wing_L','wing_R','neck','head','tail'];const joints=[];root.traverse(q=>{if(q.userData.joint)joints.push(q);});root.userData.joints=joints;
  const B=kind==='chick'?1.4:1,clips=[
    aClip(root,'Idle',3,true,u=>{const st=Math.floor(u*6)%3;return{head:[0,[0,40,-35][st],0],neck:[S(u*2)*4,0,0],tail:[S(u*3)*4,0,0]};}),
    aClip(root,'Walk',.6/B,true,u=>({leg_L:[S(u)*35,0,0],leg_R:[-S(u)*35,0,0],neck:[S(u*2)*14,0,0],head:[-S(u*2)*12,0,0],_pos:[0,Math.abs(S(u))*.01*s,0],tail:[S(u*2)*6,0,0]})),
    aClip(root,'Peck',1.2,true,u=>{const k=Math.max(0,Math.sin(u*Math.PI*4));return{_pos:[0,-.01*s,0],neck:[25+k*45,0,0],head:[20+k*25,0,0],tail:[-12,0,0]};}),
    aClip(root,'Flap',.9,true,u=>({wing_L:[0,0,-50-S(u*3)*45],wing_R:[0,0,50+S(u*3)*45],neck:[-10,0,0],_pos:[0,Math.abs(S(u*1.5))*.06*s,0],leg_L:[15,0,0],leg_R:[15,0,0]})),
    aClip(root,'Sit',2.5,true,u=>({leg_L:[-70,0,0],leg_R:[-70,0,0],_pos:[0,-.12*s,0],neck:[-15+S(u)*3,0,0],head:[S(u*.5)*20,0,0]}))];
  if(kind==='rooster')clips.push(aClip(root,'Crow',2.2,false,u=>{const k=u<.15?u/.15:u<.75?1:(1-u)/.25;return{neck:[-35*k,0,0],head:[-30*k,0,0],wing_L:[0,0,-35*k],wing_R:[0,0,35*k],tail:[10*k,0,0],_pos:[0,.03*k*s,0]};}));
  root.userData.clips=clips;root.userData.ground=1.2;return root;}

/* ---------- wild birds: duck, crow, songbird ---------- */
const AVIAN={duck:{s:1,bw:.26,bh:.18,bl:.38,leg:.07,legC:'#e08a2a',beak:'flat',beakC:'#e0b030',tail:'up',neckL:.12},crow:{s:.9,bw:.16,bh:.15,bl:.32,leg:.12,legC:'#26242a',beak:'long',beakC:'#26242a',tail:'long',neckL:.08},songbird:{s:.55,bw:.12,bh:.12,bl:.18,leg:.07,legC:'#8a6a4a',beak:'short',beakC:'#4a3a2a',tail:'up',neckL:.04}};
function buildAvian(kind,o){const A=AVIAN[kind],root=new THREE.Group();root.userData.animal=kind;root.userData.lights=[];const s=A.s,mb=cm('flat',o.body),mh=cm('flat',o.head||o.body),mw=cm('flat',o.wing||o.body),mbr=cm('flat',o.breast||o.body),lg=cm('flat',A.legC),bk=cm('flat',o.beak||A.beakC);
  const body=new THREE.Group();body.name='body';body.position.set(0,(A.leg+A.bh/2)*s,0);root.add(body);bx(body,A.bw*s,A.bh*s,A.bl*s,mb,0,0,0);bx(body,A.bw*.86*s,A.bh*.6*s,A.bl*.5*s,mbr,0,-A.bh*.15*s,A.bl*.2*s);
  for(const sd of[-1,1]){const l=aJ(body,'leg_'+(sd>0?'L':'R'),sd*A.bw*.25*s,-A.bh*.4*s,0);bx(l,.025*s+.005,A.leg*s+.02,.025*s+.005,lg,0,-A.leg*s/2,0);bx(l,kind==='duck'?.1*s:.05*s,.012,kind==='duck'?.1*s:.07*s,lg,0,-A.leg*s,.02*s);
    const w=aJ(body,'wing_'+(sd>0?'L':'R'),sd*A.bw*.5*s,A.bh*.3*s,A.bl*.2*s);bx(w,.025*s,A.bh*.7*s,A.bl*.8*s,mw,0,-A.bh*.25*s,-A.bl*.3*s);}
  const neck=aJ(body,'neck',0,A.bh*.3*s,A.bl*.38*s,[.2,0,0]);bx(neck,A.bw*.5*s,(A.neckL+.04)*s,A.bw*.5*s,mh,0,A.neckL*s/2,0);const head=aJ(neck,'head',0,A.neckL*s,0,[-.2,0,0]);bx(head,A.bw*.55*s,A.bw*.55*s,A.bw*.6*s,mh,0,A.bw*.2*s,0);
  if(A.beak==='flat')bx(head,.07*s,.025*s,.1*s,bk,0,A.bw*.12*s,A.bw*.3*s+.05*s);else bx(head,.025*s+.005,.025*s+.005,(A.beak==='long'?.09:.04)*s,bk,0,A.bw*.2*s,A.bw*.3*s+(A.beak==='long'?.045:.02)*s);
  for(const sd of[-1,1])bx(head,.012,.016,.016,vm('dark'),sd*A.bw*.28*s,A.bw*.28*s,A.bw*.12*s);if(o.ring)bx(neck,A.bw*.52*s,.015,A.bw*.52*s,cm('flat','#f0ece4'),0,.01,0);
  const tail=aJ(body,'tail',0,A.bh*.15*s,-A.bl*.5*s,[A.tail==='up'?-.6:-.15,0,0]);bx(tail,A.bw*.7*s,(A.tail==='long'?.16:.08)*s,.02*s+.005,cm('flat',o.tail||o.wing||o.body),0,(A.tail==='long'?.08:.04)*s,0);
  root.userData.ajoints=['body','leg_L','leg_R','wing_L','wing_R','neck','head','tail'];const joints=[];root.traverse(q=>{if(q.userData.joint)joints.push(q);});root.userData.joints=joints;
  const hopper=kind!=='duck',fly=u=>({wing_L:[0,0,-30-S(u*4)*55],wing_R:[0,0,30+S(u*4)*55],leg_L:[70,0,0],leg_R:[70,0,0],tail:[10,0,0],body:[S(u*2)*4,0,0],_pos:[0,.45+S(u*2)*.05,0]});
  const clips=[aClip(root,'Idle',3,true,u=>{const st=Math.floor(u*6)%3;return{head:[0,[0,35,-30][st],0],tail:[S(u*4)*6,0,0]};}),
    hopper?aClip(root,'Hop',.5,true,u=>{const k=Math.max(0,Math.sin(u*Math.PI*2));return{_pos:[0,k*.06*s,0],leg_L:[-20*k,0,0],leg_R:[-20*k,0,0],tail:[-k*15,0,0]};})
      :aClip(root,'Walk',.7,true,u=>({body:[0,0,S(u)*10],leg_L:[S(u)*30,0,0],leg_R:[-S(u)*30,0,0],neck:[S(u*2)*6,0,0],_pos:[0,Math.abs(S(u))*.01,0]})),
    aClip(root,kind==='duck'?'Dabble':'Peck',1.2,true,u=>{const k=Math.max(0,Math.sin(u*Math.PI*4));return{body:[kind==='duck'?20+k*20:10,0,0],neck:[30+k*35,0,0],head:[20+k*20,0,0],tail:[-15,0,0]};}),
    aClip(root,'Fly',.6,true,fly),
    aClip(root,'Flap',.8,true,u=>({wing_L:[0,0,-40-S(u*3)*40],wing_R:[0,0,40+S(u*3)*40],neck:[-10,0,0]}))];
  if(kind==='duck')clips.push(aClip(root,'Swim',2,true,u=>({_pos:[0,-A.leg*s+S(u)*.01,0],leg_L:[S(u*2)*40,0,0],leg_R:[-S(u*2)*40,0,0],neck:[S(u)*5,0,0],tail:[S(u*2)*8,0,0]})));
  else clips.push(aClip(root,kind==='crow'?'Caw':'Sing',1.6,false,u=>{const k=Math.sin(u*Math.PI);return{neck:[-25*k,0,0],head:[-30*k,0,0],wing_L:[0,0,-15*k],wing_R:[0,0,15*k],_pos:[0,.004*Math.sin(u*Math.PI*10)*k,0]};}));
  root.userData.clips=clips;root.userData.ground=1.2;return root;}

/* ---------- species builders and colours ---------- */
const COAT6=[['#ece8dc','White'],['#c4c2bc','Light grey'],['#9a9894','Grey'],['#5e5c5a','Dark grey'],['#2a2826','Black'],['#7a5a3e','Brown']];
const HORSE7=[['#e8e4dc','White'],['#bab8b2','Light grey'],['#8a8884','Grey'],['#5a5856','Dark grey'],['#26242a','Black'],['#a8784a','Light brown'],['#6e4a2e','Brown']];
function sheepB(s,o){const c=o.coat||'#ece8dc',dkf=['#2a2826','#5e5c5a','#7a5a3e'].includes(c);return buildQuad('sheep',{coat:c,face:dkf?darker(c,.8):'#d8c0a0',leg:dkf?darker(c,.7):'#c8b090',young:o.young});}
function goatB(s,o){const c=o.coat||'#ece8dc';return buildQuad('goat',{coat:c,young:o.young});}
function horseB(s,o){const c=o.coat||'#6e4a2e',pc=o.pcol||'#e8e4dc',pat=o.pattern||'none',dark=['#26242a','#5a5856','#6e4a2e','#a8784a'].includes(c);
  const m=buildQuad('horse',{coat:c,mane:dark?'#1e1c1e':darker(c,.7),muzzle:darker(c,.75),young:o.young});const{legs,head,body,neck}=m.userData.parts,P=m.userData.P,pm=cm('hair',pc);
  if(pat==='head'){bx(head,.1*P.hw/.26,.06,P.hl*.95,pm,0,P.hh/2+.005,P.hl*.45);bx(head,.08*P.hw/.26,P.hh*.5,.02,pm,0,.0,P.hl+P.muz-.03);}
  if(pat==='feet')for(const k in legs)bx(legs[k].kn,P.lw*1.08,P.lh*.24,P.lw*1.08,pm,0,-P.lh*.45+P.lh*.12+.06,0);
  if(pat==='large'){for(const sd of[-1,1]){bx(body,.02,P.bh*.7,P.bl*.45,pm,sd*(P.bw/2+.005),-.02,-P.bl*.08);bx(body,.02,P.bh*.4,P.bl*.2,pm,sd*(P.bw/2+.006),P.bh*.18,P.bl*.14);}bx(body,P.bw*.6,.02,P.bl*.4,pm,0,P.bh/2+.005,-P.bl*.12);}
  if(pat==='spots'){const r=mulberry32(hashStr(c+pc));for(let i=0;i<22;i++){const sd=i%2?1:-1,w=(.06+r()*.08)*P.bh/.66;if(i<18)bx(body,.02,w,w*1.3,pm,sd*(P.bw/2+.006),(r()-.5)*P.bh*.75,(r()-.5)*P.bl*.85);else bx(neck,.02,w,w,pm,sd*(P.hw*.45+.006),P.nl*(.25+r()*.5),0);}}
  return m;}
function donkeyB(s,o){const c=o.coat||'#8a8680';const m=buildQuad('donkey',{coat:c,mane:darker(c,.5),muzzle:'#d8d0c4',young:o.young});const{body,head}=m.userData.parts,P=m.userData.P;
  bx(body,.08,.02,P.bl*.9,cm('hair',darker(c,.55)),0,P.bh/2+.006,0);bx(body,P.bw*.9,.02,P.bl*.7,cm('hair','#d8d0c4'),0,-P.bh/2-.006,0);for(const sd of[-1,1])bx(head,.02,.08,.08,cm('hair','#e8e2d8'),sd*(P.hw/2+.004),.04,P.hl*.4);return m;}
function pigB(s,o){const k=o.coat||'pink',c=k==='black'?'#3a3434':k==='spotted'?'#e6b0a6':'#e8a8a0';const m=buildQuad('pig',{coat:c,bodyM:cm('flat',c),young:o.young});
  if(k==='spotted'){const{body}=m.userData.parts,P=m.userData.P,r=mulberry32(4);for(let i=0;i<10;i++){const sd=i%2?1:-1,w=(.08+r()*.1)*P.bh/.5;bx(body,.02,w,w*1.2,cm('flat','#3a3434'),sd*(P.bw/2+.005),(r()-.5)*P.bh*.6,(r()-.5)*P.bl*.8);}}return m;}
function boarB(s,o){const c=o.coat||'#4a3424';const m=buildQuad('boar',{coat:c,mane:darker(c,.6),young:o.young});
  if(o.young){const{body}=m.userData.parts,P=m.userData.P;for(const sd of[-1,1])for(let i=0;i<3;i++)bx(body,.02,.03,P.bl*.85,cm('flat','#e0c890'),sd*(P.bw/2+.004),P.bh*(.3-i*.2),0);}return m;}
function cowB(s,o){const c=o.coat||'#26242a',pat=o.pattern||'patches';const m=buildQuad('cow',{coat:c,muzzle:'#e8b8b0',udder:!o.young&&!o.bull,polled:o.young,young:o.young});const{body,head,neck,legs}=m.userData.parts,P=m.userData.P,wm=cm('hair','#f0ece4');
  if(pat==='patches'){const r=mulberry32(hashStr(c));for(let i=0;i<10;i++){const sd=i%2?1:-1,w=(.18+r()*.2)*P.bh/.74;bx(body,.02,w,w*1.3,wm,sd*(P.bw/2+.006),(r()-.5)*P.bh*.6,(r()-.5)*P.bl*.8);}bx(head,P.hw*.4,P.hh*.7,.02,wm,0,.02,P.hl-.04);for(const k of['FL','BR'])bx(legs[k].kn,P.lw*1.06,P.lh*.3,P.lw*1.06,wm,0,-P.lh*.3+.04,0);}
  if(pat==='face')bx(head,P.hw*1.02,P.hh*.8,P.hl*.7,wm,0,.02,P.hl*.4);return m;}
function bisonB(s,o){const c=o.coat||'#3e2a1c';return buildQuad('bison',{coat:c,face:darker(c,.8),leg:darker(c,.85),mane:darker(c,.6),young:o.young});}
function deerB(s,o){const c=o.coat||'#7a5236',stag=o.sex!=='doe'&&!o.young;const m=buildQuad('deer',{coat:c,muzzle:darker(c,.6),belly:'#e8dcc8',antlers:stag,young:o.young});const{body,head}=m.userData.parts,P=m.userData.P;
  if(o.coat==='#a8784a'||o.young){const r=mulberry32(11);for(let i=0;i<18;i++){const sd=i%2?1:-1;bx(body,.02,.04,.04,cm('flat','#f0e8d8'),sd*(P.bw/2+.005),P.bh*(.1+r()*.35),(r()-.5)*P.bl*.8);}}
  bx(body,P.bw*.7,P.bh*.4,.02,cm('flat','#f0ece4'),0,P.bh*.05,-P.bl/2-.006);return m;}
function dogB(s,o){const c=o.coat||'#7a4a28',fl=o.ears==='flop';const m=buildQuad('dog',{coat:c,muzzle:o.coat==='#26242a'?'#8a6a4a':darker(c,.9),belly:o.chest!==0?'#ece8dc':null,young:o.young});
  if(fl){const{head}=m.userData.parts;['ear_L','ear_R'].forEach((n,i)=>{const e=m.getObjectByName(n);e.parent.rotation.set(.3,0,(i?1:-1)*2.6);});}
  if(o.chest!==0){const{neck}=m.userData.parts,P=m.userData.P;bx(neck,P.hw*.7,P.nl*.8,.02,cm('flat','#ece8dc'),0,P.nl*.4,P.hw*.48);}return m;}
function wolfB(s,o){const c=o.coat||'#8a8884';return buildQuad('wolf',{coat:c,muzzle:darker(c,1.1),belly:darker(c,1.25),young:o.young});}
function bearB(s,o){const c=o.coat||'#6a4428';return buildQuad('bear',{coat:c,face:c,muzzle:c==='#1e1c1e'?'#8a6a4a':darker(c,1.2),young:o.young});}
function rabbitB(s,o){const c=o.coat||'#8a6a4a';return buildQuad('rabbit',{coat:c,belly:'#e8e0d0',young:o.young});}
const HEN={white:{body:'#f0ece4',tail:'#e8e4dc'},brown:{body:'#8a4a22',neck:'#b06a30',tail:'#3a2a1e'},black:{body:'#24222a',tail:'#1a2a24'},buff:{body:'#d8a050',neck:'#e8b868',tail:'#b07a30'},speckled:{body:'#6a6a70',speck:true,tail:'#3a3a40'}};
const ROOSTER={red:{body:'#8a2e1a',neck:'#e0a040',wing:'#6a2414',tail:'#1e3a2e'},white:{body:'#f0ece4',tail:'#e8e4dc'},black:{body:'#24222a',neck:'#2e3a3a',tail:'#1a3a2e'},golden:{body:'#c8802e',neck:'#f0c060',tail:'#2a2a24'}};
const CHICK={yellow:{body:'#f0d850'},brown:{body:'#a0784a',neck:'#c8a070'},black:{body:'#3a3634'},white:{body:'#f4f0e4'}};
const DUCK={mallard:{body:'#8a8278',head:'#1e5a3a',breast:'#6a3a2a',wing:'#6a6460',tail:'#2a2a2a',ring:true},hen:{body:'#8a6a4a',head:'#7a5a3e',wing:'#6a4e34',beak:'#c88a3a'},white:{body:'#f0ece4',beak:'#e0a030'}};
const CROW={black:{body:'#1e1e24',wing:'#24242e'},hooded:{body:'#8a8884',head:'#1e1e24',wing:'#1e1e24',tail:'#1e1e24'}};
const SONG={robin:{body:'#6a5a4a',breast:'#d8622a',head:'#6a5a4a'},bluebird:{body:'#3a6ab0',breast:'#c8783a',wing:'#2a5aa0'},sparrow:{body:'#8a6a4a',breast:'#c8b498',head:'#6a5038',wing:'#7a5a3a'},goldfinch:{body:'#e8c830',wing:'#26242a',head:'#e8c830',tail:'#26242a'}};
const cap=k=>k[0].toUpperCase()+k.slice(1);

FOLDERS['characters'].children=['characters/villagers','characters/animals','characters/wildlife','characters/young'];
FOLDERS['characters/animals']={name:'Farm animals',blurb:'Livestock and poultry with coat options and animations',children:[]};
FOLDERS['characters/wildlife']={name:'Wildlife',blurb:'Wild and working animals, and birds',children:[]};
FOLDERS['characters/young']={name:'Young animals',blurb:'Foals, lambs, calves, cubs, pups and more',children:[]};
const AN=(id,f,name,build,desc,opts,young)=>ASSETS.push({id:'an-'+id,folder:'characters/'+f,name,kind:'character',build:(s,o)=>build(s,Object.assign({},o||{},young?{young:true}:{})),desc,opts});
const HC=[{key:'coat',label:'Body colour',choices:HORSE7,def:'#6e4a2e'},{key:'pcol',label:'Marking colour',choices:HORSE7,def:'#e8e4dc'},{key:'pattern',label:'Markings',choices:[['none','None'],['head','Head blaze'],['feet','Four socks'],['large','Large patch'],['spots','Small patches']],def:'head'}];
const SH=[{key:'coat',label:'Fleece',choices:COAT6,def:'#ece8dc'}],GO=[{key:'coat',label:'Coat',choices:COAT6,def:'#ece8dc'}],DO=[{key:'coat',label:'Coat',choices:[['#8a8680','Grey'],['#5a5650','Dark grey']],def:'#8a8680'}];
const PG=[{key:'coat',label:'Coat',choices:[['pink','Pink'],['spotted','Spotted'],['black','Black']],def:'pink'}];
const CW=[{key:'coat',label:'Coat',choices:[['#26242a','Black'],['#7a4a2a','Brown'],['#8a3a22','Red'],['#d8c8a8','Cream']],def:'#26242a'},{key:'pattern',label:'Markings',choices:[['patches','White patches'],['face','White face'],['none','Plain']],def:'patches'}];
const BI=[{key:'coat',label:'Coat',choices:[['#3e2a1c','Dark brown'],['#5e3e26','Brown'],['#e0dcd2','White']],def:'#3e2a1c'}];
const DE=[{key:'coat',label:'Coat',choices:[['#7a5236','Brown'],['#9a5a32','Red'],['#a8784a','Fallow spotted']],def:'#7a5236'}];
const DG=[{key:'coat',label:'Coat',choices:[['#7a4a28','Brown'],['#26242a','Black'],['#ece8dc','White'],['#c8963e','Golden'],['#8a8884','Grey']],def:'#c8963e'},{key:'ears',label:'Ears',choices:[['up','Pricked'],['flop','Floppy']],def:'up'},{key:'chest',label:'White chest',choices:[[1,'Yes'],[0,'No']],def:1}];
const WO=[{key:'coat',label:'Coat',choices:[['#8a8884','Grey'],['#5a5856','Dark grey'],['#e8e4dc','White'],['#26242a','Black'],['#7a6a5a','Brown-grey']],def:'#8a8884'}];
const BE=[{key:'coat',label:'Coat',choices:[['#6a4428','Brown'],['#3e2a1c','Dark brown'],['#8a5a32','Cinnamon'],['#1e1c1e','Black']],def:'#6a4428'}];
const RA=[{key:'coat',label:'Coat',choices:[['#8a6a4a','Brown'],['#8a8884','Grey'],['#ece8dc','White'],['#2a2826','Black'],['#c8a878','Sandy']],def:'#8a6a4a'}];
const BO=[{key:'coat',label:'Coat',choices:[['#4a3424','Dark brown'],['#26242a','Black'],['#6a5a4a','Grey-brown']],def:'#4a3424'}];
const pl=(m,k)=>[{key:'col',label:k,choices:Object.keys(m).map(x=>[x,cap(x)]),def:Object.keys(m)[0]}];
AN('sheep','animals','Sheep',sheepB,'Woolly sheep with a pale or dark face to match its fleece.',SH);
AN('goat','animals','Goat',goatB,'Goat with swept-back horns, a beard and a short tail.',GO);
AN('cow','animals','Cow',cowB,'Dairy cow with short horns, an udder and a tufted tail.',CW);
AN('horse','animals','Horse',horseB,'Horse with a mane and long tail. Pick body colour, marking colour and marking pattern.',HC);
AN('donkey','animals','Donkey',donkeyB,'Donkey with long ears, a pale muzzle and belly, a dark stripe along the back and a tufted tail.',DO);
AN('pig','animals','Pig',pigB,'Farm pig with a snout, floppy ears and a curly tail.',PG);
AN('hen','animals','Hen',(s,o)=>buildBird('hen',HEN[o.col||'brown']),'Hen with comb and wattle.',[{key:'col',label:'Plumage',choices:Object.keys(HEN).map(k=>[k,cap(k)]),def:'brown'}]);
AN('rooster','animals','Rooster',(s,o)=>buildBird('rooster',ROOSTER[o.col||'red']),'Rooster with a tall comb and sweeping tail feathers; can crow.',pl(ROOSTER,'Plumage'));
AN('dog','animals','Dog',dogB,'Farm dog: pick coat, ear shape and chest blaze. Wags its tail, sits, sniffs and barks.',DG);
AN('wolf','wildlife','Wolf',wolfB,'Grey wolf with a bushy tail and pale underside; sits, sniffs and howls.',WO);
AN('deer','wildlife','Deer',deerB,'Slender deer with a white tail; stags carry antlers. Grazes, stands alert and bounds away.',DE.concat([{key:'sex',label:'Sex',choices:[['stag','Stag'],['doe','Doe']],def:'stag'}]));
AN('boar','wildlife','Wild boar',boarB,'Bristly boar with tusks and a ridge of hair down the back; roots for food.',BO);
AN('bison','wildlife','Bison',bisonB,'Heavy bison with a shoulder hump, shaggy front, beard and short black horns.',BI);
AN('bear','wildlife','Bear',bearB,'Big bear that can sit, sniff, rise up on its hind legs and roar.',BE);
AN('rabbit','wildlife','Rabbit',rabbitB,'Rabbit with tall ears and a white tail; hops, sits up and nibbles.',RA);
AN('duck','wildlife','Duck',(s,o)=>buildAvian('duck',DUCK[o.col||'mallard']),'Duck with a flat bill and webbed feet; waddles, dabbles, swims and flies.',pl(DUCK,'Plumage'));
AN('crow','wildlife','Crow',(s,o)=>buildAvian('crow',CROW[o.col||'black']),'Crow with a long beak and tail; hops, pecks, flies and caws.',pl(CROW,'Plumage'));
AN('songbird','wildlife','Songbird',(s,o)=>buildAvian('songbird',SONG[o.col||'robin']),'Small songbird; hops, pecks, flies and sings.',pl(SONG,'Species'));
AN('foal','young','Foal',horseB,'Long-legged foal with the same coat and marking options as the horse.',HC,true);
AN('donkeyfoal','young','Donkey foal',donkeyB,'Fluffy-eared donkey foal.',DO,true);
AN('lamb','young','Lamb',sheepB,'Lamb in any fleece colour.',SH,true);
AN('kid','young','Goat kid',goatB,'Goat kid, no horns yet.',GO,true);
AN('calf','young','Calf',cowB,'Calf with the same coat options as the cow.',CW,true);
AN('piglet','young','Piglet',pigB,'Piglet.',PG,true);
AN('chick','young','Chick',(s,o)=>buildBird('chick',CHICK[o.col||'yellow']),'Small fluffy chick.',pl(CHICK,'Down'));
AN('pup','young','Pup',dogB,'Puppy with the same coat, ear and chest options as the dog.',DG,true);
AN('wolfpup','young','Wolf pup',wolfB,'Wolf pup.',WO,true);
AN('fawn','young','Fawn',deerB,'Spotted fawn.',DE,true);
AN('boarlet','young','Boar piglet',boarB,'Striped wild boar piglet.',BO,true);
AN('bisoncalf','young','Bison calf',bisonB,'Bison calf.',BI,true);
AN('cub','young','Bear cub',bearB,'Bear cub; can sit, sniff, stand and roar.',BE,true);

/* pose a built animal for use inside buildings */
function posedAnimal(m,clip,t){const c=m.userData.clips.find(c=>c.name===clip);if(c){const mx=new THREE.AnimationMixer(m);mx.clipAction(c).play();mx.update(t);}return m;}
