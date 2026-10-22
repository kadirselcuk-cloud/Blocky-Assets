/* ======================= GEAR KIT, part 3: every wearable piece on the ground (docs/GEAR.md) =======================
   gr-<slot>-<key>: the very boxes the Mercenary wears (MC_GEAR builders run on a bare rest-pose rig), shown
   - On the ground: weapons lie flat on both ends, shields on their back, helmets on the rim, gloves side by side, boots standing, belts flat
   - On a stand: body armour, shoulders, leg armour and capes on a wooden stand
   - Stuck in the ground: blades point down, about 12 cm deep
   - Pickup: hovering and turning above a glowing pool
   Clips (propAnim, then the effects by gfBake): Idle (loop), Appear, Drop (falls, bounces, settles), Pick up (rises, spins and shrinks away).
   Options: display, metal, cloth or shield colour, effect, effect colour and strength (the same effects as on the Mercenary). */
FOLDERS[''].children.push('gear');
FOLDERS['gear']={name:'Gear',blurb:'Everything the Mercenary can wear or carry, on the ground with animations and effects; potions and power-ups',
  children:['gear/weapons','gear/shields','gear/helmets','gear/armour','gear/shoulders','gear/gloves','gear/boots','gear/legs','gear/capes','gear/belts']};
const GR_SLOTS={weapon:['weapons','Weapons','One-handed weapons, each with its holder on the Mercenary'],shield:['shields','Shields','Shields for the left arm or fist'],
  helmet:['helmets','Helmets','Helmets, hoods, hats and a crown'],armor:['armour','Body armour','Body armour from linen to full plate'],shoulders:['shoulders','Shoulders','Pauldrons and mantles'],
  gloves:['gloves','Gloves','Gloves and gauntlets'],boots:['boots','Boots','Boots and sabatons'],pants:['legs','Leg armour','Trousers, chausses and cuisses'],cape:['capes','Capes','Capes and cloaks'],belt:['belts','Belts','Belts, sash and potion belt']};
for(const[k,[f,n,b]]of Object.entries(GR_SLOTS))FOLDERS['gear/'+f]={name:n,blurb:b,children:[]};
const GR_BLADE=new Set(['sword','falchion','longsword','broadsword','scimitar','shortsword','dagger','rapier','cleaver']);
const GR_CLOTH=new Set(['cape','belt:sash','helmet:hood','helmet:mage','helmet:crested','armor:gambeson','armor:none','armor:brigandine','armor:surcoat','armor:robe','pants:padded']);
const GR_METALLESS=new Set(['helmet:hood','helmet:mage','helmet:cap','helmet:crown','armor:gambeson','armor:none','armor:robe','armor:ranger','armor:barbarian','armor:leather','gloves:leather','gloves:bracers','gloves:studded',
  'boots:leather','boots:riding','boots:fur','pants:wool','pants:leather','pants:padded','pants:fur','shoulders:leather','shoulders:fur','belt:plain','belt:pouches','belt:potions','belt:gilded','belt:sash','belt:rope','shield:targe','weapon:club','weapon:sceptre','weapon:torch']);

/* the piece on a bare rig: returns {g (meshes in the piece frame), M, sel} */
function grPiece(slot,key,o){const sel=Object.assign({},MC_DEF,{cloth:o.cloth||'natural',shieldCol:o.shieldCol||'red',wmetal:o.metal||'steel',ametal:o.metal||'steel',belt:slot==='armor'?'plain':'none',shoulders:'armor'});
  sel[slot]=key;const M=mcMats(sel),Mx=mcMetal(M,o.metal||'steel'),tmp=new THREE.Group(),J=mcJoints(tmp);
  if(slot==='helmet')MC_GEAR.helmet[key](J,Mx,MC_FACE.square);else MC_GEAR[slot][key](J,slot==='cape'?M:Mx);
  tmp.updateMatrixWorld(true);const g=new THREE.Group();
  const frame=slot==='weapon'?J.socket_R.children.find(q=>q.name==='mc_sword'):slot==='shield'?tmp.getObjectByName('mc_shield'):slot==='helmet'?J.head:null;
  const fi=frame?new THREE.Matrix4().copy(frame.matrixWorld).invert():new THREE.Matrix4(),side=[];
  tmp.traverse(q=>{if(!q.isMesh||M.bodyMats.has(q.material))return;let p=q,ok=true;while(p){if(p.name==='mc_scab')ok=false;if((slot==='weapon'||slot==='shield')&&p===frame)break;p=p.parent;}
    if((slot==='weapon'||slot==='shield')&&!p)ok=false;if(!ok)return;
    const m=new THREE.Mesh(q.geometry,q.material);new THREE.Matrix4().multiplyMatrices(fi,q.matrixWorld).decompose(m.position,m.quaternion,m.scale);
    /* the side a piece belongs to, for pairs */let j=q.parent;while(j&&!/_(L|R)$/.test(j.name))j=j.parent;m.userData.side=j?j.name.slice(-1):'';m.userData.joint=j?j.name:'';side.push(m);g.add(m);});
  return{g,M,sel,J};}
/* corners of every box under g in the frame of `rel` */
function grCorners(g,rel){g.updateMatrixWorld(true);const inv=new THREE.Matrix4().copy(rel.matrixWorld).invert(),out=[],V=new THREE.Vector3();
  g.traverse(q=>{if(!q.isMesh||q.userData.fx)return;const p=q.geometry.parameters;if(!p||p.width===undefined)return;const M=new THREE.Matrix4().multiplyMatrices(inv,q.matrixWorld);
    for(let i=0;i<8;i++)out.push(V.set((i&1?.5:-.5)*p.width,(i&2?.5:-.5)*p.height,(i&4?.5:-.5)*p.depth).applyMatrix4(M).clone());});return out;}
const grBox=pts=>{const b=new THREE.Box3();for(const p of pts)b.expandByPoint(p);return b;};
/* rest a piece on both ends: tip it about z (a long piece along x) or x (front and back, along z) until the lowest points of its two halves touch */
function grSettle(inner,ax='z'){const holder=new THREE.Group(),top=new THREE.Group();holder.add(inner);top.add(holder);const k=ax==='z'?'x':'z';
  const f=a=>{holder.rotation[ax]=a;const P=grCorners(inner,top),b=grBox(P),cx=(b.min[k]+b.max[k])/2;let l=1e9,r=1e9;for(const p of P){if(p[k]<cx)l=Math.min(l,p.y);else r=Math.min(r,p.y);}return r-l;};
  let lo=-.5,hi=.5;if(Math.abs(f(0))<.002)holder.rotation[ax]=0;else if(f(lo)*f(hi)<0){for(let i=0;i<30;i++){const m=(lo+hi)/2;if(f(lo)*f(m)<=0)hi=m;else lo=m;}holder.rotation[ax]=(lo+hi)/2;}else holder.rotation[ax]=0;
  top.remove(holder);return holder;}
function grStand(root,h,bar,w,z=0){const wd=bm(PAL.wood[1],'leather'),wl=bm(PAL.wood[2],'leather');bx(root,.5,.04,.4,wl,0,.02,z);bx(root,.06,h-.04,.06,wd,0,.04+(h-.04)/2,z);
  bx(root,w,.05,.05,wd,0,bar,z);return root;}

/* one ground asset */
function grBuild(slot,key,o){const root=new THREE.Group();root.userData.lights=[];const disp=o.display||'ground',pc=grPiece(slot,key,o),g=pc.g,item=new THREE.Group();item.name='gr_item';root.add(item);
  const content=new THREE.Group();content.name='gr_content';item.add(content);const pickup=disp==='pickup';let restY=0,standH=0;
  if(slot==='weapon'){
    if(pickup){g.rotation.x=-Math.PI/2;content.add(g);}                                  /* business end up */
    else if(disp==='stuck'&&GR_BLADE.has(key)){g.rotation.set(Math.PI/2+.2,0,.15);content.add(g);}
    else{g.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(new THREE.Vector3(0,1,0),new THREE.Vector3(0,0,1),new THREE.Vector3(1,0,0)));const w=new THREE.Group();w.add(g);const h=grSettle(w);content.add(h);}}
  else if(slot==='shield'){if(!pickup)g.rotation.x=-Math.PI/2;content.add(g);}
  else if(slot==='helmet'&&!pickup)content.add(grSettle(g,'x'));
  else if(slot==='gloves'||slot==='boots'){
    for(const sd of['L','R']){const s=new THREE.Group(),base=pc.J[(slot==='gloves'?'foreArm_':'shin_')+sd];base.updateMatrixWorld(true);const bi=new THREE.Matrix4().copy(base.matrixWorld).invert();
      for(const m of g.children.slice())if(m.userData.side===sd){m.applyMatrix4(bi);s.add(m);}
      const P=grCorners(s,s),b=grBox(P),c=b.getCenter(new THREE.Vector3());s.children.forEach(m=>m.position.sub(c));
      const holder=new THREE.Group();holder.add(s);const sg=sd==='L'?1:-1;
      if(slot==='gloves'){if(pickup)holder.position.set(sg*.11,0,0);else{s.rotation.set(-Math.PI/2,0,0);holder.position.set(sg*.11,0,sg*.03);holder.rotation.y=sg*.12;}}
      else holder.position.set(sg*.12,0,sg*.02);content.add(holder);}}
  else{/* a belt off the body is a loop: its wide boxes become four strips */
    if(slot==='belt')for(const m of g.children.slice()){const q=m.geometry.parameters;if(q.width>.2&&q.depth>.2){const t=.022;
      for(const[w,d,x,z]of[[q.width,t,0,q.depth/2-t/2],[q.width,t,0,-q.depth/2+t/2],[t,q.depth-2*t,q.width/2-t/2,0],[t,q.depth-2*t,-q.width/2+t/2,0]]){bx(g,w,q.height,d,m.material,m.position.x+x,m.position.y,m.position.z+z);}g.remove(m);}}
    /* and what hangs from it (pouches, vials, tails) lies on the ground beside it: long tails fold out flat */
    if(slot==='belt'){let yb=1e9;const loop=new Set(g.children.filter(m=>{const q=m.geometry.parameters;return Math.min(q.width,q.depth)<.03&&Math.max(q.width,q.depth)>.2;}));
      for(const m of loop)yb=Math.min(yb,m.position.y-m.geometry.parameters.height/2);
      for(const m of g.children){if(loop.has(m))continue;const q=m.geometry.parameters;if(m.position.y-q.height/2>=yb-.001)continue;
        if(q.height>.09&&q.height>q.width&&q.height>q.depth){const sz=Math.sign(m.position.z)||1;m.rotation.x=sz*Math.PI/2;m.position.z+=sz*q.height/2;m.position.y=yb+q.depth/2;}else m.position.y=yb+q.height/2;}}
    content.add(g);}
  /* ground every display: the lowest corner on 0 (stuck: 12 cm below), centred on x and z */
  {const P=grCorners(content,item),b=grBox(P),c=b.getCenter(new THREE.Vector3());content.position.set(-c.x,0,-c.z);
    if(disp==='stand'&&['armor','shoulders','cape','pants'].includes(slot)){content.position.set(0,0,0);standH=1;}
    else content.position.y=-b.min.y+(disp==='stuck'&&slot==='weapon'&&GR_BLADE.has(key)?-.12:0);}
  /* stands: the post inside the torso (the hips for leg armour), the bar through the shoulders; a cape's collar rests on the bar */
  if(standH){const ch=MCB.hipsY+MCB.spine+MCB.chest;if(slot==='pants')grStand(root,MCB.hipsY-MCB.hipDrop-.015,.96,.32);else if(slot==='cape')grStand(root,ch+.28,ch+.28,.5,-.13);else grStand(root,slot==="shoulders"?ch+MCB.shY+.025:ch+.25,ch+MCB.shY,.78);}
  let P=grCorners(content,item),b=grBox(P);const half=b.getSize(new THREE.Vector3()).multiplyScalar(.5);
  /* pickup: the item turns about its centre, which hovers 0.3 m above the ground */
  if(pickup){content.position.y-=b.getCenter(new THREE.Vector3()).y;restY=half.y+.3;item.position.y=restY;P=grCorners(content,item);b=grBox(P);}
  /* effects: the glowing pool under a pickup, then the particles */
  const fxT=o.fx||'none',k=GF_STR[o.fxStr]?GF_STR[o.fxStr][1]:1,armourLike=!['weapon','shield'].includes(slot),rx=armourLike?GF_AX[fxT]:GF_RX[fxT],pal=gfPal(o.fxCol,fxT!=='none'?fxT:'holy');
  let pool=null;if(pickup){pool=new THREE.Mesh(new THREE.PlaneGeometry(1,1),ltAdd(pal.c[2],.5,ltPoolTex()));pool.rotation.x=-Math.PI/2;pool.position.y=.012;pool.scale.setScalar(Math.max(.6,Math.max(half.x,half.z)*2.4));pool.name='gr_pool';pool.userData.fx=true;root.add(pool);}
  const ms=[];content.traverse(q=>{if(q.isMesh)ms.push(q);});
  const zone=slot==='weapon'?ms.filter(q=>q.position.z>=(GF_WZ[key]??.1)):ms;
  const specs=[];if(rx){const cc=b.getCenter(new THREE.Vector3());/* centre in the item frame */
    specs.push({id:'g',rx,pal,k,meshes:zone,seed:hashStr(slot+key)%9973,center:{o:item,off:cc.toArray(),R:Math.max(.3,Math.max(half.x,half.z)+.15),H:Math.max(.25,half.y+.15)}});
    gfLight(root,item,pal.l,k*rx.light*.8,[cc.x,cc.y+.1,cc.z]);}
  /* clips */
  const corners=grCorners(content,item),q0=new THREE.Quaternion().setFromEuler(new THREE.Euler(.9,.6,.5)),I=new THREE.Quaternion(),V=new THREE.Vector3();
  const lift=(q,s)=>{let y=1e9;for(const p of corners){V.copy(p).multiplyScalar(s).applyQuaternion(q);if(V.y<y)y=V.y;}return y;};
  const spin=(t,D,turns)=>new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0),GF_TAU*turns*t/D);
  const defs=[];
  if(pickup){defs.push({name:'Idle',dur:4,loop:true,fn:(t,S)=>{S.gr_item={p:[0,restY+.035*Math.sin(GF_TAU*t/2),0],q:spin(t,4,1)};S.gr_pool={s:[pool.scale.x*(1+.08*Math.sin(GF_TAU*t/2)),pool.scale.y*(1+.08*Math.sin(GF_TAU*t/2)),1],r:[-Math.PI/2,0,0]};}});
    defs.push({name:'Appear',dur:.9,next:'Idle',fn:(t,S)=>{const u=paClamp(t/.7),sc=u<1?Math.sin(u*Math.PI*.5)*(1+.15*Math.sin(u*Math.PI)):1;S.gr_item={p:[0,restY*(.6+.4*paEase(u)),0],q:spin(paEase(u),1,1.5),s:Math.max(1e-4,sc)};S.gr_pool={s:[pool.scale.x*paEase(u)+1e-4,pool.scale.y*paEase(u)+1e-4,1],r:[-Math.PI/2,0,0]};}});
    defs.push({name:'Pick up',dur:.9,hold:true,fn:(t,S)=>{const u=paClamp(t/.8);S.gr_item={p:[0,restY+.8*paEase(u),0],q:spin(u*u,1,2.5),s:Math.max(1e-4,1-paEase(u))};S.gr_pool={s:[pool.scale.x*(1-u)+1e-4,pool.scale.y*(1-u)+1e-4,1],r:[-Math.PI/2,0,0]};}});}
  else{defs.push({name:'Idle',dur:4,loop:true,fn:(t,S)=>{S.gr_item={p:[0,0,0]};}});
    if(!standH&&disp!=='stuck')defs.push({name:'Drop',dur:1.6,hold:true,next:'Idle',fn:(t,S)=>{const tl=.5,u=paClamp(t/tl);let y,q;
      if(t<tl){y=1.3*(1-u*u);q=q0.clone().slerp(I,paEase(u));}else{const w=t-tl,bt=.28;y=w<bt?.07*Math.sin(Math.PI*w/bt):0;q=I.clone().slerp(new THREE.Quaternion().setFromEuler(new THREE.Euler(.06,0,.04)),w<bt?Math.sin(Math.PI*w/bt):0);}
      y=Math.max(y,-lift(q,1)+0);if(t>=tl+.28)y=0;S.gr_item={p:[0,y,0],q};}});
    defs.push({name:'Appear',dur:.9,next:'Idle',fn:(t,S)=>{const u=paClamp(t/.7),sc=Math.max(1e-4,u<1?Math.sin(u*Math.PI*.5)*(1+.12*Math.sin(u*Math.PI)):1),q=spin(paEase(u),1,1);S.gr_item={p:[0,Math.max(0,-lift(q,sc)),0],q,s:sc};}});
    defs.push({name:'Pick up',dur:.9,hold:true,fn:(t,S)=>{const u=paClamp(t/.8),sc=Math.max(1e-4,1-paEase(u));S.gr_item={p:[0,.9*paEase(u),0],q:spin(u*u,1,2),s:sc};}});}
  propAnim(root,pool?[item,pool]:[item],defs);
  if(specs.length){for(const sp of specs)sp.parts=gfSpec(root,sp);root.userData.clips=gfBake(root,root.userData.clips,specs,'gr|'+slot+'|'+key+'|'+JSON.stringify(o));}
  root.userData.ground=Math.max(.7,Math.max(half.x,half.z)+.4);
  root.userData.variantText=`${MC_SLOTS[slot][key]}${o.metal&&o.metal!=='steel'&&!GR_METALLESS.has(slot+':'+key)?', '+MC_METAL[o.metal][0].toLowerCase():''}; ${({ground:'on the ground',pickup:'as a pickup',stand:'on a stand',stuck:'stuck in the ground'})[disp]}${fxT!=='none'?'; '+(armourLike?GF_AFX:GF_WFX)[fxT].toLowerCase():''}.`;
  return root;}

/* registration: one asset per piece; the options each piece needs */
const grCh=t=>Object.entries(t).map(([k,v])=>[k,Array.isArray(v)?v[0]:v]);
function grOpts(slot,key){const armourLike=!['weapon','shield'].includes(slot),O=[];
  const disp=[['ground','On the ground']];if(['armor','shoulders','cape','pants'].includes(slot))disp.unshift(['stand','On a stand']);if(slot==='weapon'&&GR_BLADE.has(key))disp.push(['stuck','Stuck in the ground']);disp.push(['pickup','Pickup (hovering)']);
  O.push({key:'display',label:'Display',choices:disp,def:disp[0][0]});
  if(!GR_METALLESS.has(slot+':'+key))O.push({key:'metal',label:'Metal',choices:grCh(MC_METAL),def:'steel'});
  if(slot==='shield'&&!['targe','spikedbuckler','buckler'].includes(key))O.push({key:'shieldCol',label:'Shield colour',choices:grCh(MC_SHCOL).map(([k])=>[k,MC_SHCOL[k][1]]),def:'red'});
  if(GR_CLOTH.has(slot)||GR_CLOTH.has(slot+':'+key))O.push({key:'cloth',label:'Cloth colour',choices:Object.entries(MC_CLOTH).map(([k,v])=>[k,v[1]]),def:'natural'});
  const fx=armourLike?GF_AFX:GF_WFX,def=key==='torch'?'burn':'none';O.push({key:'fx',label:armourLike?'Protection effect':'Effect',choices:Object.entries(fx),def});
  O.push({key:'fxCol',label:'Effect colour',choices:Object.entries(GF_COLS),def:'auto'},{key:'fxStr',label:'Effect strength',choices:Object.entries(GF_STRN),def:'medium'});return O;}
for(const slot of Object.keys(GR_SLOTS))for(const[key,name]of Object.entries(MC_SLOTS[slot])){if(key==='none'||(slot==='shoulders'&&key==='armor'))continue;
  const opts=grOpts(slot,key);
  ASSETS.push({id:`gr-${slot}-${key}`,folder:'gear/'+GR_SLOTS[slot][0],name,opts,build:(sd,o)=>{const oo={};for(const p of opts)oo[p.key]=o&&o[p.key]!==undefined?o[p.key]:p.def;return grBuild(slot,key,oo);},
    desc:`${name}: the same piece the Mercenary wears (option "${({weapon:'Weapon',shield:'Shield',helmet:'Helmet',armor:'Armour',shoulders:'Shoulders',gloves:'Gloves',boots:'Boots',pants:'Pants',cape:'Cape',belt:'Belt'})[slot]}"), shown ${opts[0].choices.map(c=>c[1].toLowerCase()).join(', ')}. Clips: Idle, Appear, ${opts[0].def==='ground'?'Drop, ':''}Pick up. Effects as on the Mercenary: ${Object.values(['weapon','shield'].includes(slot)?GF_WFX:GF_AFX).slice(1).join(', ').toLowerCase()}, in any colour and strength.`});}

/* the Mercenary's options: the new slots, metals and effects */
function mcOptsAll(){const o=(key,label,t,def)=>({key,label,choices:MC_CH(t),def}),nm=t=>Object.fromEntries(Object.entries(t).map(([k,v])=>[k,Array.isArray(v)?v[0]:v]));
  return[o('skin','Skin',MC_SKIN,'light'),o('face','Face',MC_LOOK.face,'square'),o('eyes','Eyes',MC_EYE,'brown'),o('hair','Hair colour',MC_HAIR,'brown'),o('hairStyle','Hairstyle',MC_LOOK.hairStyle,'short'),
    o('beard','Facial hair',MC_LOOK.beard,'short'),o('scar','Scar',MC_LOOK.scar,'none'),
    o('weapon','Weapon',MC_SLOTS.weapon,'sword'),o('wmetal','Weapon metal',nm(MC_METAL),'steel'),o('wfx','Weapon effect',GF_WFX,'none'),o('wfxCol','Weapon effect colour',GF_COLS,'auto'),o('wfxStr','Weapon effect strength',GF_STRN,'medium'),
    o('shield','Shield',MC_SLOTS.shield,'heater'),o('shieldCol','Shield colour',MC_SHCOL,'red'),o('sfx','Shield effect',GF_WFX,'none'),
    o('helmet','Helmet',MC_SLOTS.helmet,'none'),o('armor','Armour',MC_SLOTS.armor,'mail'),o('ametal','Armour metal',nm(MC_METAL),'steel'),o('shoulders','Shoulders',MC_SLOTS.shoulders,'armor'),
    o('gloves','Gloves',MC_SLOTS.gloves,'leather'),o('boots','Boots',MC_SLOTS.boots,'leather'),o('pants','Pants',MC_SLOTS.pants,'wool'),o('belt','Belt',MC_SLOTS.belt,'plain'),
    o('cape','Cape',MC_SLOTS.cape,'none'),o('cloth','Cloth colour',MC_CLOTH,'natural'),
    o('afx','Protection effect',GF_AFX,'none'),o('afxCol','Protection colour (also the shield effect)',GF_COLS,'auto'),o('afxStr','Protection strength',GF_STRN,'medium')];}
{const A=ASSETS.find(a=>a.id==='mercenary');A.opts=mcOptsAll();
  A.desc=A.desc.replace(/Every gear slot can be changed:[\s\S]*$/,'Every gear slot can be changed (the Gear folder has each piece on the ground too): '+
    ['weapon','shield','helmet','armor','shoulders','gloves','boots','pants','belt','cape'].map(s=>`${s==='armor'?'armour':s} (${Object.values(MC_SLOTS[s]).join(', ').toLowerCase()})`).join('; ')+
    '; weapon metal and armour metal ('+Object.values(MC_METAL).map(m=>m[0].toLowerCase()).join(', ')+'), shield colour and cloth colour. Effects: weapon and shield ('+Object.values(GF_WFX).slice(1).join(', ').toLowerCase()+
    ') and protection ('+Object.values(GF_AFX).slice(1).join(', ').toLowerCase()+'), each in any spell colour and five strengths, baked into every clip. 43 clips with a weapon: Idle, Walk, Run, war-mode Idle and Walk, Walk back, Strafe left and right, Dodge left, right and back, Jump, Attack 1 to 4, Combo, Heavy attack, Spin attack, Shield bash, Kick, Block, Blocking (hold), Cast spell 1 to 4, Channel spell, Hit 1, Hit 2, Heavy hit, Taunt, Victory, Death, Sheathe, Idle and Walk with the weapon sheathed, Draw, Pick up, Interact, Turn left and right, and a forward Roll.');}
