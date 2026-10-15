/* ================= Asset Forge — app ================= */
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const assetsIn=(path,deep)=>ASSETS.filter(a=>deep?(!path||a.folder===path||a.folder.startsWith(path+'/')):a.folder===path);
const store={get(k,d){try{const v=localStorage.getItem('forge:'+k);return v==null?d:v;}catch(e){return d;}},set(k,v){try{localStorage.setItem('forge:'+k,v);}catch(e){}}};

/* ---------- lighting presets ---------- */
const PRESETS={
  day:{sky:'#a9c4dc',hor:'#e3e1d6',hemiSky:0xdfeaff,hemiGround:0x5b4a32,hemiI:.62,sun:0xfff0d8,sunI:2.3,dir:[.95,1.15,1.05],glow:0,lamp:0,exp:1.0},
  dusk:{sky:'#36426b',hor:'#e89a5c',hemiSky:0x8a7fb0,hemiGround:0x3a2a20,hemiI:.55,sun:0xff9a50,sunI:1.5,dir:[-1.2,.42,.9],glow:1.3,lamp:1.4,exp:1.05},
  night:{sky:'#060a16',hor:'#1d2a48',hemiSky:0x3a4c7a,hemiGround:0x0c0a10,hemiI:.36,sun:0x9fb4ff,sunI:.38,dir:[-.6,1.3,-.8],glow:2.6,lamp:2.6,exp:1.2},
};
const skyCache={};
function skyTex(name){if(skyCache[name])return skyCache[name];const p=PRESETS[name],c=document.createElement('canvas');c.width=4;c.height=256;const g=c.getContext('2d');
  const gr=g.createLinearGradient(0,0,0,256);gr.addColorStop(0,p.sky);gr.addColorStop(.62,p.hor);gr.addColorStop(1,p.hor);g.fillStyle=gr;g.fillRect(0,0,4,256);
  const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;return skyCache[name]=t;}

function frameOf(model){const b=new THREE.Box3();model.children.forEach(ch=>{if(!ch.userData.noFrame)b.expandByObject(ch);});
  const size=b.getSize(new THREE.Vector3()),center=b.getCenter(new THREE.Vector3());return{box:b,size,center,radius:size.length()/2};}
function markDecor(model){model.children.forEach(ch=>{let hasTuft=false;ch.traverse(o=>{if(o.isMesh&&o.geometry.type==='ConeGeometry'&&o.geometry.parameters.radius===.08)hasTuft=true;});if(hasTuft||(ch.isMesh&&ch.geometry.type==='PlaneGeometry'))ch.userData.noFrame=true;});}

function buildEnv(scene,fr,gr,gk){const hemi=new THREE.HemisphereLight(),sun=new THREE.DirectionalLight();
  sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);const ext=Math.max(fr.size.x,fr.size.z)*.75+2,sc=sun.shadow.camera,sunD=Math.max(60,fr.radius*1.3);sc.left=-ext;sc.right=ext;sc.top=ext;sc.bottom=-ext;sc.near=1;sc.far=sunD+fr.radius*2+20;sun.shadow.bias=-.0004;sun.shadow.normalBias=.035;
  scene.add(hemi,sun,sun.target);
  const noG=gr===-1,GR=noG?Math.max(6,fr.radius*.9):Math.round((gr||Math.max(9,Math.max(fr.size.x,fr.size.z)*.85))/.8)*.8,sd=vm(gk==='waste'?'wDustSide':gk==='grave'?'gGrassSide':'grassSide'),dt=vm('dirt');let ground=null;
  if(!noG){ground=box(2*GR,.8,2*GR,[sd,sd,vm(gk==='waste'?'wDust':gk==='grave'?'gGrass':'grassTop'),dt,sd,sd],{s:.8,ox:0,oy:0,oz:0});ground.position.y=-.4;ground.castShadow=false;ground.receiveShadow=true;scene.add(ground);}
  scene.fog=new THREE.Fog(0xffffff,GR*3.5,GR*9);
  return{hemi,sun,ground,GR,sunD,center:fr.center.clone(),radius:fr.radius,follow:fr.radius>160};}
/* big scenes: the sun's shadow box follows the orbit target and shrinks when zoomed in (sharper shadows, much less to draw) */
function followShadow(env,ctl){if(!env.follow||!env.dir)return;const t=ctl.target,ext=Math.min(220,Math.max(35,ctl.sph.radius*.85)),sc=env.sun.shadow.camera,D=Math.max(120,ext*1.6);
  env.sun.target.position.copy(t);env.sun.position.copy(t).addScaledVector(env.dir,D);if(Math.abs(sc.right-ext)>ext*.08||sc.far!==D+ext*2+60){sc.left=-ext;sc.right=ext;sc.top=ext;sc.bottom=-ext;sc.near=1;sc.far=D+ext*2+60;sc.updateProjectionMatrix();}}
const ENVC=new WeakMap();
function envFor(r,name){let m=ENVC.get(r);if(!m){m={};ENVC.set(r,m);}if(!m[name]){const t=new THREE.CanvasTexture(skyTex(name).image);t.encoding=THREE.sRGBEncoding;t.mapping=THREE.EquirectangularReflectionMapping;const pg=new THREE.PMREMGenerator(r);m[name]=pg.fromEquirectangular(t).texture;pg.dispose();}return m[name];}
function applyPreset(scene,env,model,name,renderer){const p=PRESETS[name];if(typeof WATERMAT!=='undefined'){WATERMAT.envMap=envFor(renderer,name);WATERMAT.needsUpdate=true;}
  env.hemi.color.set(p.hemiSky);env.hemi.groundColor.set(p.hemiGround);env.hemi.intensity=p.hemiI;env.sun.color.set(p.sun);env.sun.intensity=p.sunI;
  const d=new THREE.Vector3(...p.dir).normalize();env.dir=d;env.sun.position.copy(env.center).addScaledVector(d,env.sunD||60);env.sun.target.position.copy(env.center);
  scene.background=skyTex(name);scene.fog.color.set(p.hor);
  for(const m of GLOW)m.emissiveIntensity=(m.userData.base||0)+p.glow*(m.userData.glowScale||1);
  (model.userData.lights||[]).forEach(l=>{l.userData.base=Math.max(p.lamp,l.userData.min||0);l.intensity=l.userData.base;l.visible=!(model.userData.ground===-1&&p.lamp===0);});renderer.toneMappingExposure=p.exp;}
function setupRenderer(r){r.shadowMap.enabled=true;r.shadowMap.type=THREE.PCFSoftShadowMap;r.outputEncoding=THREE.sRGBEncoding;r.toneMapping=THREE.ACESFilmicToneMapping;r.physicallyCorrectLights=false;}
function disposeModel(m){m.traverse(o=>{if(o.geometry)o.geometry.dispose();});}
function statsOf(model){let tris=0,meshes=0;model.traverse(o=>{if(o.isMesh&&!o.parent.userData.noFrame&&!o.userData.noFrame){meshes++;const g=o.geometry;tris+=(g.index?g.index.count:g.attributes.position.count)/3;}});return{tris:Math.round(tris),meshes};}
function poseStill(model,name,t){const clips=model.userData.clips;if(!clips)return;const mx=new THREE.AnimationMixer(model);mx.clipAction(clips.find(c=>c.name===name)).play();mx.update(t);model.userData.post&&model.userData.post();model.updateMatrixWorld(true);}
function optVals(a){const o={};(a.opts||[]).forEach(p=>{const v=store.get('opt:'+a.id+':'+p.key,null),c=p.choices.find(c=>String(c[0])===v);o[p.key]=c?c[0]:p.def;});return o;}
function buildAsset(a,s){seed(hashStr(a.id));const m=a.build(a.variants?(s??a.defaultSeed):undefined,optVals(a));markDecor(m);return m;}
const fmt=n=>n.toLocaleString('en-US');
const dims=s=>`${s.x.toFixed(1)} × ${s.z.toFixed(1)} m, ${s.y.toFixed(1)} m tall`;

/* ---------- search ---------- */
const norm=s=>String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
function folderPath(path){let acc='';return path.split('/').map(p=>{acc=acc?acc+'/'+p:p;return FOLDERS[acc]?FOLDERS[acc].name:p;}).join(' / ');}
let SIDX=null;
function searchIndex(){if(SIDX)return SIDX;
  const fs=Object.keys(FOLDERS).filter(Boolean).map(p=>({href:'#/f/'+p,label:FOLDERS[p].name,path:p.includes('/')?folderPath(p.split('/').slice(0,-1).join('/')):'Library',tag:'Folder',name:norm(FOLDERS[p].name),id:norm(p),fold:'',desc:norm(FOLDERS[p].blurb||'')}));
  const as=ASSETS.map(a=>({href:'#/a/'+a.id,label:a.name,path:folderPath(a.folder),tag:'',name:norm(a.name),id:norm(a.id),fold:norm(folderPath(a.folder)),desc:norm(a.desc||'')}));
  return SIDX=[...fs,...as];}
/* every word must match somewhere; name matches rank above id, folder and description matches */
function search(q){const words=norm(q).trim().split(/\s+/).filter(Boolean);if(!words.length)return[];const out=[];
  for(const e of searchIndex()){let sc=0;for(const w of words){const s=e.name.startsWith(w)?60:(' '+e.name).includes(' '+w)?45:e.name.includes(w)?30:e.id.includes(w)?20:e.fold.includes(w)?12:e.desc.includes(w)?4:0;if(!s){sc=-1;break;}sc+=s;}
    if(sc>0)out.push([sc+(e.tag?5:0),e]);}
  return out.sort((x,y)=>y[0]-x[0]||x[1].label.localeCompare(y[1].label)).map(x=>x[1]);}
function attachSearch(inp,list){let items=[],act=0;
  const close=()=>{list.hidden=true;inp.setAttribute('aria-expanded','false');};
  const mark=()=>{list.querySelectorAll('li[data-i]').forEach(li=>li.setAttribute('aria-selected',String(+li.dataset.i===act)));const c=list.querySelector(`li[data-i="${act}"]`);c&&c.scrollIntoView({block:'nearest'});};
  const render=()=>{const q=inp.value.trim();if(!q){close();return;}items=search(q).slice(0,80);act=0;
    list.innerHTML=items.length?items.map((e,i)=>`<li role="option" data-i="${i}" aria-selected="${i===0}"><a href="${e.href}"><span class="sr-name">${e.tag?`<span class="sr-tag">${e.tag}</span>`:''}${esc(e.label)}</span><span class="sr-path">${esc(e.path)}</span></a></li>`).join(''):`<li class="sr-none">Nothing matches “${esc(q)}”</li>`;
    list.hidden=false;inp.setAttribute('aria-expanded','true');};
  const go=e=>{if(!e)return;inp.value='';close();inp.blur();location.hash=e.href;};
  inp.addEventListener('input',render);inp.addEventListener('focus',render);inp.addEventListener('blur',close);
  list.addEventListener('mousedown',e=>e.preventDefault());
  list.addEventListener('click',e=>{const li=e.target.closest('li[data-i]');if(!li)return;e.preventDefault();go(items[+li.dataset.i]);});
  inp.addEventListener('keydown',e=>{e.stopPropagation();
    if(e.key==='ArrowDown'||e.key==='ArrowUp'){if(!items.length||list.hidden)return;act=(act+(e.key==='ArrowDown'?1:-1)+items.length)%items.length;mark();e.preventDefault();}
    else if(e.key==='Enter'){if(!list.hidden)go(items[act]);e.preventDefault();}
    else if(e.key==='Escape'){if(inp.value){inp.value='';close();}else inp.blur();e.preventDefault();}});}
attachSearch($('#q'),$('#qres'));attachSearch($('#vq'),$('#vqres'));
addEventListener('keydown',e=>{if(e.key!=='/'||e.ctrlKey||e.metaKey||e.altKey||(e.target.closest&&e.target.closest('input,textarea,select')))return;const inp=$('#viewer').hidden?$('#q'):$('#vq');if(!inp.offsetParent)return;e.preventDefault();inp.focus();});

/* ---------- library pages (names only: no rendered previews, so the library opens instantly) ---------- */
function crumbs(path,extra){const parts=path?path.split('/'):[];let html=`<a href="#/">Library</a>`,acc='';
  for(const p of parts){acc=acc?acc+'/'+p:p;html+=`<span aria-hidden="true">/</span><a href="#/f/${acc}">${esc(FOLDERS[acc].name)}</a>`;}
  if(extra)html+=`<span aria-hidden="true">/</span><span aria-current="page">${esc(extra)}</span>`;return html;}
const SHELF_NAMES=14;
function shelf(path){const f=FOLDERS[path],list=assetsIn(path,true),n=list.length;
  const names=n?`<ul class="chips">${list.slice(0,SHELF_NAMES).map(a=>`<li><a class="chip" href="#/a/${a.id}">${esc(a.name)}</a></li>`).join('')}${n>SHELF_NAMES?`<li><a class="chip more" href="#/f/${path}">+${n-SHELF_NAMES} more</a></li>`:''}</ul>`:`<p class="chips-empty">Empty for now. Ask for one in the chat.</p>`;
  return `<li><div class="shelf"><a class="shelf-label" href="#/f/${path}"><span class="shelf-name">${esc(f.name)}</span><span class="shelf-blurb">${esc(f.blurb||'')}</span><span class="shelf-count">${n?`${n} asset${n>1?'s':''}`:'No assets yet'}</span></a>${names}</div></li>`;}
function showFolder(path){
  if(!FOLDERS[path])path='';const f=FOLDERS[path];closeViewer();$('#library').hidden=false;
  $('#crumbs').innerHTML=path?crumbs(path.split('/').slice(0,-1).join('/'))+`<span aria-hidden="true">/</span><span aria-current="page">${esc(f.name)}</span>`:'';
  let html='';
  if(!path)html+=`<section class="intro"><h1>Asset library</h1><p>Each model is built in code and opens in a 3D viewer you can orbit, zoom and relight. Search for anything with the box above, or press / to start typing.</p></section>`;
  else html+=`<section class="intro"><h1>${esc(f.name)}</h1>${f.blurb?`<p>${esc(f.blurb)}</p>`:''}</section>`;
  if(f.children.length)html+=`<ul class="shelves">${f.children.map(shelf).join('')}</ul>`;
  const own=assetsIn(path,false);
  if(own.length)html+=(f.children.length?`<h2 class="list-head">In ${esc(f.name)}</h2>`:'')+`<ul class="names">${own.map(a=>`<li><a href="#/a/${a.id}" title="${esc(a.desc||'')}"><span class="card-name">${esc(a.name)}</span></a></li>`).join('')}</ul>`;
  if(!f.children.length&&!own.length)html+=`<div class="empty"><p>Nothing here yet.</p><p>Name an asset in the chat, for example “a knight in plate armor” or “a set of healing potions”, and it will appear in this folder.</p></div>`;
  $('#app').innerHTML=html;window.scrollTo(0,0);}

/* ---------- orbit controls ---------- */
class Orbit{
  constructor(cam,el){this.cam=cam;this.el=el;this.target=new THREE.Vector3();this.sph=new THREE.Spherical();this.goal={r:10,th:0,ph:1,t:new THREE.Vector3()};this.minR=2;this.maxR=80;this.auto=false;this.ptrs=new Map();this.busy=false;this.keys=new Set();this.bind();}
  set(target,r,ph,th){this.target.copy(target);this.goal.t.copy(target);this.sph.set(r,ph,th);Object.assign(this.goal,{r,ph,th});this.home={t:target.clone(),r,ph,th};}
  reset(){const h=this.home;this.goal.t.copy(h.t);this.goal.r=h.r;this.goal.ph=h.ph;const d=((this.goal.th-h.th)%(Math.PI*2)+Math.PI*3)%(Math.PI*2)-Math.PI;this.goal.th-=d;}
  bind(){const el=this.el;
    el.addEventListener('pointerdown',e=>{el.setPointerCapture(e.pointerId);this.ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY,pan:e.button===2||e.button===1||e.shiftKey});this.pinch=null;this.busy=true;});
    el.addEventListener('pointermove',e=>{const p=this.ptrs.get(e.pointerId);if(!p)return;const dx=e.clientX-p.x,dy=e.clientY-p.y;p.x=e.clientX;p.y=e.clientY;
      if(this.ptrs.size===1){if(p.pan)this.pan(dx,dy);else{this.goal.th-=dx*.0075;this.goal.ph=Math.min(Math.PI/2-.03,Math.max(.12,this.goal.ph-dy*.0075));}}
      else if(this.ptrs.size===2){const[a,b]=[...this.ptrs.values()];const d=Math.hypot(a.x-b.x,a.y-b.y);if(this.pinch)this.zoom(this.pinch/d);this.pinch=d;this.pan(dx/2,dy/2);}});
    const up=e=>{this.ptrs.delete(e.pointerId);this.pinch=null;if(!this.ptrs.size)this.busy=false;};el.addEventListener('pointerup',up);el.addEventListener('pointercancel',up);
    el.addEventListener('wheel',e=>{e.preventDefault();this.zoom(Math.exp(e.deltaY*(e.deltaMode?.05:.0012)));},{passive:false});
    el.addEventListener('contextmenu',e=>e.preventDefault());el.addEventListener('dblclick',()=>this.reset());
    const ok=e=>!(e.target&&/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))&&!document.getElementById('viewer').hidden;
    addEventListener('keydown',e=>{const k=e.key.toLowerCase();if('wasdqe'.includes(k)&&k.length===1&&ok(e)&&!e.ctrlKey&&!e.metaKey){this.keys.add(k);this.fast=e.shiftKey;e.preventDefault();}});
    addEventListener('keyup',e=>{this.keys.delete(e.key.toLowerCase());this.fast=e.shiftKey;});addEventListener('blur',()=>this.keys.clear());}
  zoom(k){this.goal.r=Math.min(this.maxR,Math.max(.05,this.goal.r*k));}
  pan(dx,dy){const k=this.sph.radius*.0015,right=new THREE.Vector3().setFromMatrixColumn(this.cam.matrix,0),up=new THREE.Vector3().setFromMatrixColumn(this.cam.matrix,1);
    this.goal.t.addScaledVector(right,-dx*k).addScaledVector(up,dy*k);this.goal.t.y=Math.max(0,this.goal.t.y);}
  update(dt){if(this.auto&&!this.busy)this.goal.th+=dt*.22;const f=1-Math.exp(-dt*9);
    if(this.keys.size){const th=this.sph.theta,sp=Math.max(1.5,this.sph.radius*.9)*(this.fast?3:1)*dt,K=this.keys,fw=(K.has('w')?1:0)-(K.has('s')?1:0),rt=(K.has('d')?1:0)-(K.has('a')?1:0),upd=(K.has('e')?1:0)-(K.has('q')?1:0);
      this.goal.t.x+=(-Math.sin(th)*fw+Math.cos(th)*rt)*sp;this.goal.t.z+=(-Math.cos(th)*fw-Math.sin(th)*rt)*sp;this.goal.t.y=Math.max(0,this.goal.t.y+upd*sp);this.auto=false;}
    this.sph.radius+=(this.goal.r-this.sph.radius)*f;this.sph.phi+=(this.goal.ph-this.sph.phi)*f;this.sph.theta+=(this.goal.th-this.sph.theta)*f;this.target.lerp(this.goal.t,f);
    this.cam.position.setFromSpherical(this.sph).add(this.target);this.cam.lookAt(this.target);}
}

/* ---------- viewer ---------- */
const V={tool:'',toolObj:null,piece:null,mixer:null,cur:null,speed:1,rigOn:false,rig:null,renderer:null,scene:null,cam:null,ctl:null,model:null,env:null,mode:store.get('mode','day'),wire:false,raf:0,asset:null};
if(!PRESETS[V.mode])V.mode='day';
const wireMat=new THREE.MeshBasicMaterial({color:0x9fb6c4,wireframe:true});
function ensureViewer(){if(V.renderer)return;const r=new THREE.WebGLRenderer({antialias:true});r.setPixelRatio(Math.min(devicePixelRatio,2));setupRenderer(r);$('#stage').appendChild(r.domElement);V.renderer=r;
  V.cam=new THREE.PerspectiveCamera(38,1,.03,700);V.ctl=new Orbit(V.cam,r.domElement);V.ctl.auto=false;
  new ResizeObserver(resize).observe($('#stage'));
  document.querySelectorAll('[data-mode]').forEach(b=>b.addEventListener('click',()=>setMode(b.dataset.mode)));
  $('#tTurn').addEventListener('click',()=>{V.ctl.auto=!V.ctl.auto;syncBar();});
  $('#tWire').addEventListener('click',()=>{V.wire=!V.wire;applyWire();syncBar();});
  $('#tReset').addEventListener('click',()=>V.ctl.reset());
  $('#tPair').addEventListener('click',()=>{if(V.asset&&V.asset.pair)location.hash='#/a/'+V.asset.pair;});
  $('#tVar').addEventListener('click',()=>{location.hash=`#/a/${V.asset.id}/${1+Math.floor(Math.random()*99999)}`;});
  $('#tRig').addEventListener('click',()=>{V.rigOn=!V.rigOn;if(V.rig)V.rig.group.visible=V.rigOn;syncBar();});
  document.querySelectorAll('[data-speed]').forEach(b=>b.addEventListener('click',()=>{V.speed=+b.dataset.speed;syncBar();}));
  addEventListener('keydown',e=>{if($('#viewer').hidden||e.target.closest('input,textarea'))return;if(e.key==='ArrowRight')step(1);else if(e.key==='ArrowLeft')step(-1);else if(e.key==='Escape')location.hash='#/f/'+V.asset.folder;});
  $('#dPrev').addEventListener('click',()=>turnPage(-1));$('#dNext').addEventListener('click',()=>turnPage(1));
  makeDraggable($('#vhead'),$('#vhead'),'head');makeDraggable($('#vdock'),$('#dockHead'),'dock',true);
  new ResizeObserver(()=>$('#viewer').style.setProperty('--dockh',$('#vdock').offsetHeight+'px')).observe($('#vdock'));
  $('#vprev').addEventListener('click',()=>step(-1));$('#vnext').addEventListener('click',()=>step(1));}
function resize(){if(!V.renderer)return;const el=$('#stage'),w=el.clientWidth,h=el.clientHeight;if(!w||!h)return;V.renderer.setSize(w,h,false);V.cam.aspect=w/h;V.cam.updateProjectionMatrix();}
function syncBar(){document.querySelectorAll('[data-mode]').forEach(b=>b.setAttribute('aria-checked',String(b.dataset.mode===V.mode)));$('#tTurn').setAttribute('aria-pressed',String(V.ctl.auto));$('#tWire').setAttribute('aria-pressed',String(V.wire));$('#tRig').setAttribute('aria-pressed',String(V.rigOn));document.querySelectorAll('[data-speed]').forEach(b=>b.setAttribute('aria-checked',String(+b.dataset.speed===V.speed)));}
function setMode(m){V.mode=m;store.set('mode',m);if(V.scene)applyPreset(V.scene,V.env,V.model,m,V.renderer);syncBar();}
function step(d){const sib=assetsIn(V.asset.folder,false),i=sib.indexOf(V.asset);V.asset=null;location.hash='#/a/'+sib[(i+d+sib.length)%sib.length].id;}
function showAsset(id,vs){const a=ASSETS.find(x=>x.id===id);if(!a){location.hash='#/';return;}const sameAsset=V.asset&&(V.asset.id===a.id||V.asset.pair===a.id)&&!$('#viewer').hidden&&V.model,keep=sameAsset&&V.cur&&V.cur.getClip().loopMode?V.cur.getClip().name:'Idle';if(!sameAsset)V.tool='';const seedN=a.variants?(vs||a.defaultSeed):undefined;V.seed=seedN;
  $('#library').hidden=true;$('#viewer').hidden=false;document.title=a.name+' — Asset Forge';ensureViewer();resize();
  $('#vcrumbs').innerHTML=crumbs(a.folder);$('#vname').textContent=a.name;$('#vdesc').textContent=a.desc;$('#vvar').hidden=true;$('#tVar').hidden=!a.variants;$('#tPair').hidden=!a.pair;if(a.pair)$('#tPair').textContent=a.folder.endsWith('blocky')?'Smooth version':'Blocky version';$('#vspecs').innerHTML='';$('#loading').hidden=false;
  const sib=assetsIn(a.folder,false);$('#vprev').hidden=$('#vnext').hidden=sib.length<2;
  V.asset=a;
  setTimeout(()=>{if(V.asset!==a)return;
    if(V.model){disposeModel(V.model);}
    const scene=new THREE.Scene(),model=buildAsset(a,seedN);scene.add(model);poseStill(model,'Idle',.6);const fr=frameOf(model),env=buildEnv(scene,fr,model.userData.ground??a.groundR,model.userData.groundKind);
    if(model.userData.variantText){$('#vvar').hidden=false;$('#vvar').innerHTML=`<span>Look ${seedN}</span> ${esc(model.userData.variantText)}`;}
    applyWire(false);Object.assign(V,{scene,model,env});applyWire();applyPreset(scene,env,model,V.mode,V.renderer);
    const ch=a.kind==='character',it=a.folder.startsWith('items'),scn=a.kind==='scene',r=Math.max(.6,fr.radius)/Math.sin(THREE.MathUtils.degToRad(19))*(ch?1.45:it?1.5:scn?.5:.82);V.ctl.minR=ch?.6:fr.radius*.35;V.ctl.maxR=env.GR*2.2;
    const asp=V.cam.aspect||1,rr=asp<1?r*Math.pow(1/asp,.4):r;if(!sameAsset)V.ctl.set(fr.center.clone().setY(it?fr.center.y:scn?0:fr.size.y*(ch?(asp<1?.56:.47):.36)),rr,ch?1.38:scn?.95:1.12,ch?.5:.58);V.ctl.minR=Math.min(V.ctl.minR,it?.3:V.ctl.minR);V.ctl.maxR=Math.max(V.ctl.maxR,rr*1.6);
    const s=statsOf(model);$('#vspecs').innerHTML=`<div><dt>Size</dt><dd>${dims(fr.size)}</dd></div><div><dt>Triangles</dt><dd>${fmt(s.tris)}</dd></div>`+(ch?`<div><dt>Joints</dt><dd>${model.userData.joints.length}</dd></div><div><dt>Clips</dt><dd>${model.userData.clips.length}</dd></div>`:`<div><dt>Meshes</dt><dd>${fmt(s.meshes)}</dd></div>`);
    const st=model.userData.stats;if(scn&&st)$('#vspecs').innerHTML+=`<div><dt>FPS</dt><dd id="vfps">…</dd></div><div><dt>Buildings</dt><dd>${fmt(st.buildings)}${st.houses!=null?` (${st.houses} houses)`:''}</dd></div>${st.production!=null?`<div><dt>Production</dt><dd>${st.production}</dd></div>`:''}${st.military!=null?`<div><dt>Military</dt><dd>${st.military}</dd></div>`:''}${st.farm!=null?`<div><dt>Farm buildings</dt><dd>${st.farm}</dd></div>`:''}${st.enemies!=null?`<div><dt>Enemies</dt><dd>${st.enemies}</dd></div>`:`<div><dt>Population</dt><dd>${st.adults+st.children} (${st.adults} adults, ${st.children} children)</dd></div>`}<div><dt>Animals</dt><dd>${fmt(st.animals)}</dd></div><div><dt>Wildlife</dt><dd>${fmt(st.wildlife)}</dd></div><div><dt>Trees</dt><dd>${fmt(st.trees)}</dd></div>`;
    setupAnim(model,keep);setupOpts(model,a);setDock();
    $('#loading').hidden=true;syncBar();
    if(!V.raf){let last=performance.now();const loop=t=>{V.raf=requestAnimationFrame(loop);const dt=Math.min(.05,(t-last)/1000);last=t;V.ctl.update(dt);if(V.env)followShadow(V.env,V.ctl);if(V.model&&V.model.userData.tick)V.model.userData.tick(dt,V.cam);if(V.mixer){V.mixer.update(dt*V.speed);V.model.userData.post&&V.model.userData.post();toolPost();}if(V.rig)updateRig();V.renderer.render(V.scene,V.cam);V.fpsN=(V.fpsN||0)+1;if(!V.fpsT0)V.fpsT0=t;if(t-V.fpsT0>=500){const e=document.getElementById('vfps');if(e)e.textContent=Math.round(V.fpsN*1000/(t-V.fpsT0));V.fpsN=0;V.fpsT0=t;}};V.raf=requestAnimationFrame(loop);}
  },30);}
function applyWire(on=V.wire){if(!V.model)return;V.model.traverse(o=>{if(o.isMesh)(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>m.wireframe=on);});}
function closeViewer(){applyWire(false);$('#viewer').hidden=true;document.title='Asset Forge';if(V.raf){cancelAnimationFrame(V.raf);V.raf=0;}}

/* ---------- dock (Animations, Options, Details in one window) and draggable panels ---------- */
const PAGES={anims:'Animations',tools:'Tool in hand',opts:'Options',specs:'Details'};
function setDock(){const list=[V.hasAnims&&'anims',V.usesTools&&'tools',V.hasOpts&&'opts','specs'].filter(Boolean),pick=store.get('page','');V.pages=list;
  showPage(list.includes(pick)?pick:list[0]);
  $('#dPrev').disabled=$('#dNext').disabled=list.length<2;
  $('#dDots').innerHTML=list.length<2?'':list.map(p=>`<button data-page="${p}" aria-label="${PAGES[p]}" title="${PAGES[p]}"></button>`).join('');
  $('#dDots').querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{store.set('page',b.dataset.page);showPage(b.dataset.page);}));syncDots();}
function showPage(p){V.page=p;document.querySelectorAll('.dock-page').forEach(s=>s.hidden=s.dataset.page!==p);$('#dTitle').textContent=PAGES[p];syncDots();}
function syncDots(){$('#dDots').querySelectorAll('button').forEach(b=>b.setAttribute('aria-current',String(b.dataset.page===V.page)));}
function turnPage(d){const L=V.pages||[];if(L.length<2)return;const p=L[(L.indexOf(V.page)+d+L.length)%L.length];store.set('page',p);showPage(p);}
const MOBILE=matchMedia('(max-width:720px)');
function makeDraggable(panel,handle,key,fit){
  const place=(x,y)=>{const vw=innerWidth,vh=innerHeight,w=panel.offsetWidth;x=Math.min(Math.max(x,60-w),vw-60);y=Math.min(Math.max(y,0),vh-(fit?180:40));
    Object.assign(panel.style,{left:x+'px',top:y+'px',right:'auto',bottom:'auto'});if(fit)panel.style.maxHeight=(vh-y-16)+'px';panel.classList.add('moved');};
  const apply=()=>{let p=null;try{p=JSON.parse(store.get('pos:'+key,'null'));}catch(e){}
    if(p&&!MOBILE.matches)place(p.x,p.y);else{Object.assign(panel.style,{left:'',top:'',right:'',bottom:'',maxHeight:''});panel.classList.remove('moved');}};
  handle.addEventListener('pointerdown',e=>{if(MOBILE.matches||e.button!==0||e.target.closest('button,a,input,select,textarea,.sr'))return;
    const r=panel.getBoundingClientRect(),ox=e.clientX-r.left,oy=e.clientY-r.top;handle.setPointerCapture(e.pointerId);panel.classList.add('dragging');e.preventDefault();
    const mv=ev=>place(ev.clientX-ox,ev.clientY-oy);
    const up=()=>{handle.removeEventListener('pointermove',mv);handle.removeEventListener('pointerup',up);handle.removeEventListener('pointercancel',up);panel.classList.remove('dragging');
      if(panel.classList.contains('moved'))store.set('pos:'+key,JSON.stringify({x:parseFloat(panel.style.left),y:parseFloat(panel.style.top)}));};
    handle.addEventListener('pointermove',mv);handle.addEventListener('pointerup',up);handle.addEventListener('pointercancel',up);});
  handle.addEventListener('dblclick',e=>{if(e.target.closest('button,a,input,.sr'))return;store.set('pos:'+key,'null');apply();});
  MOBILE.addEventListener('change',apply);addEventListener('resize',()=>{if(panel.classList.contains('moved'))place(parseFloat(panel.style.left),parseFloat(panel.style.top));});apply();}

/* ---------- animation panel & rig overlay ---------- */
function setupOpts(model,a){const aw=!!model.userData.awning,ok=aw||!!(a.opts&&a.opts.length);V.hasOpts=ok;if(!ok){$('#optbody').innerHTML='';return;}
  const vals=optVals(a);let h='';
  if(aw)h+=`<div class="opt-row"><h3>Awning colour</h3><div class="sw" id="swatches">${AWNING_COLORS.map(([c,n])=>`<button data-c="${c}" title="${n}" aria-label="${n}" style="background:repeating-linear-gradient(90deg,${c} 0 8px,#e8e4dc 8px 16px)"></button>`).join('')}</div></div>`;
  for(const p of a.opts||[])h+=`<div class="opt-row"><h3>${esc(p.label)}</h3><div class="opt-seg" role="group" aria-label="${esc(p.label)}">${p.choices.map(([v,l])=>`<button data-k="${p.key}" data-v="${esc(v)}" aria-pressed="${String(v)===String(vals[p.key])}">${esc(l)}</button>`).join('')}</div></div>`;
  $('#optbody').innerHTML=h;
  if(aw){const apply=hex=>{model.userData.awning.forEach(m=>{m.material=vm(awnKind(hex,m.userData.awnRole==='solid'));if(V.wire)m.material.wireframe=true;});store.set('awn:'+a.id,hex);$('#swatches').querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.c===hex)));};
    $('#swatches').querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>apply(b.dataset.c)));apply(store.get('awn:'+a.id,model.userData.awnColor));}
  $('#optbody').querySelectorAll('[data-k]').forEach(b=>b.addEventListener('click',()=>{const p=a.opts.find(q=>q.key===b.dataset.k);store.set('opt:'+a.id+':'+b.dataset.k,b.dataset.v);
    if(p&&p.live&&model.userData.setOpt){const c=p.choices.find(c=>String(c[0])===b.dataset.v);model.userData.setOpt(p.key,c?c[0]:b.dataset.v);b.parentNode.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));return;}
    showAsset(a.id,V.seed);}));}
function setupAnim(model,first='Idle'){const clips=model.userData.clips;V.mixer=null;V.cur=null;if(V.piece){V.piece.parent&&V.piece.parent.remove(V.piece);V.piece=null;}V.toolObj=null;
  if(V.rig){V.scene.remove(V.rig.group);V.rig=null;}
  $('#tRig').hidden=!clips;V.hasAnims=!!clips;V.usesTools=false;if(!clips)return;
  V.mixer=new THREE.AnimationMixer(model);V.mixer.addEventListener('finished',e=>{if(e.action===V.cur&&!e.action.getClip().hold&&(!/^(Death|Fall)/.test(e.action.getClip().name)||e.action.getClip().nextAlways))playClip(e.action.getClip().next||'Idle');});
  $('#animList').innerHTML=clips.map(c=>`<li><button data-clip="${esc(c.name)}" aria-pressed="false"><span class="an-name">${esc(c.name)}</span><span class="an-meta">${c.duration.toFixed(c.duration<1?2:1)} s, ${c.loopMode?'loop':'once'}</span></button></li>`).join('');
  $('#animList').querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>playClip(b.dataset.clip)));
  $('#toolRow').innerHTML=['',...Object.keys(TOOLS)].map(n=>`<button data-tool="${n}" aria-pressed="false">${n||'No tool'}</button>`).join('');
  $('#toolRow').querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{equipTool(b.dataset.tool);const c=V.cur&&V.cur.getClip();if(c&&c.tool&&!toolFits(c))playClip('Idle');else if(c&&c.tool)placePiece(c);}));
  /* the Tool in hand page only shows for characters that can hold villager tools (clips that use them, or a job tool) */
  const usesTools=!model.userData.animal&&(clips.some(c=>c.tool)||!!model.userData.occTool);
  V.usesTools=usesTools;buildRig(model);if(usesTools){const t=model.userData.occTool||(model.userData.traits&&model.userData.traits.job?'':V.tool);V.tool='';equipTool(t);}else{V.tool='';V.toolObj=null;}playClip(first,0);}
function toolFits(c){const T=TOOLS[V.tool];return T&&(c.tool==='two')===T.two;}
function equipTool(name){if(V.toolObj){V.toolObj.parent&&V.toolObj.parent.remove(V.toolObj);V.toolObj=null;}V.tool=name||'';
  if(name&&TOOLS[name]&&V.model){const o=TOOLS[name].build(),k=V.model.userData.traits;o.scale.setScalar(k&&k.child?.72:k&&k.kind==='female'?.92:1);V.model.getObjectByName('socket_R').add(o);V.toolObj=o;applyWire();}
  document.querySelectorAll('[data-tool]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.tool===V.tool)));}
function placePiece(clip){if(V.piece){V.scene.remove(V.piece);V.piece=null;}if(!clip||!clip.tool||!V.toolObj)return;
  const m=V.model,mx=new THREE.AnimationMixer(m),act=mx.clipAction(clip);act.play();act.time=clip.strikeT;mx.update(0);m.userData.post&&m.userData.post();m.updateMatrixWorld(true);
  const tip=V.toolObj.localToWorld(V.toolObj.userData.tip.clone());act.stop();mx.uncacheRoot(m);
  const kind=TOOLS[V.tool].piece,p=buildWorkpiece(kind,tip.y-.01);p.position.set(tip.x+(kind==='anvil'?.06:0),0,tip.z+(kind==='log'?0:.05));p.traverse(o=>{if(o.isMesh){o.castShadow=o.receiveShadow=true;}});V.scene.add(p);V.piece=p;}
const _q=new THREE.Quaternion(),_m4=new THREE.Matrix4(),_t1=new THREE.Vector3(),_t2=new THREE.Vector3(),_t3=new THREE.Vector3();
function armIK(model,side,target,w){const ua=model.getObjectByName('upperArm_'+side),fa=model.getObjectByName('foreArm_'+side),hd=model.getObjectByName('hand_'+side),sk=model.getObjectByName('socket_'+side);
  model.updateMatrixWorld(true);const S=ua.getWorldPosition(new THREE.Vector3()),Ew=fa.getWorldPosition(new THREE.Vector3()),Hw=hd.getWorldPosition(new THREE.Vector3()),Gw=sk.getWorldPosition(new THREE.Vector3());
  const a=S.distanceTo(Ew),b=Ew.distanceTo(Hw)+Hw.distanceTo(Gw),D=target.clone().sub(S);const d=Math.min(Math.max(D.length(),.02),(a+b)*.999),dir=D.normalize();
  const alpha=Math.acos(Math.min(1,Math.max(-1,(a*a+d*d-b*b)/(2*a*d)))),beta=Math.acos(Math.min(1,Math.max(-1,(a*a+b*b-d*d)/(2*a*b))));
  const chest=model.getObjectByName('chest'),cq=chest.getWorldQuaternion(new THREE.Quaternion()),s=side==='L'?1:-1,pole=new THREE.Vector3(s*.7,-1,-.35).applyQuaternion(cq).normalize();
  let n=new THREE.Vector3().crossVectors(dir,pole);if(n.lengthSq()<1e-6)n.set(1,0,0);n.normalize();
  const u1=dir.clone().applyAxisAngle(n,alpha),u2=dir.clone().applyAxisAngle(n,-alpha),u=u1.dot(pole)>u2.dot(pole)?u1:u2;
  const E=S.clone().addScaledVector(u,a),f=target.clone().sub(E).normalize();let Z=f.clone().addScaledVector(u,-f.dot(u));if(Z.lengthSq()<1e-6)Z.copy(pole);Z.normalize();
  const Y=u.clone().negate(),X=new THREE.Vector3().crossVectors(Y,Z).normalize();_m4.makeBasis(X,Y,Z);const wq=new THREE.Quaternion().setFromRotationMatrix(_m4);
  const pq=ua.parent.getWorldQuaternion(new THREE.Quaternion()).invert(),lq=pq.multiply(wq);ua.quaternion.slerp(lq,w);
  const fq=new THREE.Quaternion().setFromEuler(new THREE.Euler(-(Math.PI-beta),0,0));fa.quaternion.slerp(fq,w);hd.quaternion.slerp(new THREE.Quaternion(),w);}
function toolPost(){if(!V.toolObj)return;const m=V.model,D=Math.PI/180;const fg=m.getObjectByName('fingers_R'),ft=m.getObjectByName('fingerTips_R');fg.rotation.set(0,0,95*D);ft.rotation.set(0,0,90*D);
  const c=V.cur&&V.cur.getClip();if(c&&c.tool==='one'&&V.piece&&V.piece.userData.grab){const w=V.cur.getEffectiveWeight();if(w>.01)armIK(m,'L',V.piece.localToWorld(V.piece.userData.grab.clone()),Math.min(1,w));}
  if(c&&c.tool==='two'&&TOOLS[V.tool]&&TOOLS[V.tool].two){const w=V.cur.getEffectiveWeight();if(w>.01){const tg=V.toolObj.localToWorld(new THREE.Vector3(0,0,-.14));armIK(m,'L',tg,Math.min(1,w));
    const fl=m.getObjectByName('fingers_L'),fl2=m.getObjectByName('fingerTips_L');fl.rotation.z=-95*D*w;fl2.rotation.z=-90*D*w;}}}
function playClip(name,fade=.3){const clip=V.model.userData.clips.find(c=>c.name===name);if(!clip)return;if(clip.tool&&!toolFits(clip))equipTool(clip.defTool);const act=V.mixer.clipAction(clip);
  act.reset();act.setLoop(clip.loopMode?THREE.LoopRepeat:THREE.LoopOnce,Infinity);act.clampWhenFinished=!clip.loopMode;act.enabled=true;act.setEffectiveTimeScale(1);act.setEffectiveWeight(1);act.play();
  if(V.cur&&V.cur!==act&&fade)act.crossFadeFrom(V.cur,fade,false);else if(V.cur&&V.cur!==act)V.cur.stop();V.cur=act;
  const props=V.model.userData.clipProps||{};for(const k in props)props[k].visible=k===name;
  $('#animList').querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.clip===name)));$('#animNote').textContent=clip.note||'';placePiece(clip);}
function buildRig(model){const js=model.userData.joints,g=new THREE.Group();g.visible=V.rigOn;g.renderOrder=999;
  const dm=new THREE.MeshBasicMaterial({color:0xf0c060,depthTest:false,transparent:true}),lm=new THREE.LineBasicMaterial({color:0xf0c060,depthTest:false,transparent:true,opacity:.85});
  const dots=js.map(j=>{const m=new THREE.Mesh(new THREE.SphereGeometry(j.name.includes('finger')||j.name.includes('thumb')?.006:.014,8,6),dm);m.renderOrder=999;g.add(m);return m;});
  const pairs=[];js.forEach((j,i)=>{let p=j.parent;while(p&&js.indexOf(p)<0)p=p.parent;const pi=js.indexOf(p);if(pi>=0)pairs.push([pi,i]);});
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(new Float32Array(pairs.length*6),3));const lines=new THREE.LineSegments(geo,lm);lines.renderOrder=998;lines.frustumCulled=false;g.add(lines);
  V.scene.add(g);V.rig={group:g,js,dots,pairs,geo};}
const _v=new THREE.Vector3();
function updateRig(){const R=V.rig;if(!R.group.visible)return;const p=R.geo.attributes.position;R.js.forEach((j,i)=>{j.getWorldPosition(_v);R.dots[i].position.copy(_v);});
  R.pairs.forEach(([a,b],k)=>{const A=R.dots[a].position,B=R.dots[b].position;p.setXYZ(k*2,A.x,A.y,A.z);p.setXYZ(k*2+1,B.x,B.y,B.z);});p.needsUpdate=true;}

/* ---------- router ---------- */
function route(){const h=location.hash.replace(/^#\/?/,'');if(h.startsWith('a/')){const[id,s]=h.slice(2).split('/');showAsset(id,s?+s:undefined);}else showFolder(h.startsWith('f/')?h.slice(2):'');}
addEventListener('hashchange',route);route();
