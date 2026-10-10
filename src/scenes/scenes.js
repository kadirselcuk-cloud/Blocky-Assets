/* ======================= SCENES ======================= */
const SC_A=id=>ASSETS.find(a=>a.id===id);
/* terrain: 2 m voxel columns on a height grid, one instanced mesh per surface type */
function sceneTerrain(root,size,cell,heightAt,surfAt){const N=Math.round(size/cell),half=size/2,defs={grass:['grassTop','grassSide'],path:['dirtRoad','dirt'],plaza:['cobble','cobble'],sand:['sand','sandSide'],dirt:['dirt','dirt'],bed:['riverbed','dirt'],rock:['stone','stone']};
  const mat=(k,rep)=>{const b=vm(k),m=b.clone();m.map=b.map.clone();m.map.wrapS=m.map.wrapT=THREE.RepeatWrapping;m.map.repeat.set(rep,rep);m.map.needsUpdate=true;return m;};
  /* only the faces that can be seen: every top, and the side walls down to the lower neighbour (same look as full columns, far fewer triangles) */
  const Hh=new Float32Array(N*N),Sf=new Array(N*N),cells={};for(let i=0;i<N;i++)for(let k=0;k<N;k++){const x=-half+cell/2+i*cell,z=-half+cell/2+k*cell,h=heightAt(x,z),sf=surfAt(x,z,h);Hh[i*N+k]=h;Sf[i*N+k]=sf;(cells[sf]=cells[sf]||[]).push([x,z,h]);}
  const G={};const gOf=(sf,side)=>{const key=sf+(side?'|s':'|t');return G[key]||(G[key]={sf,side,P:[],Nn:[],U:[]});};
  const quad=(g,v,n,uv)=>{const[a,b,c,d]=v,e1=[b[0]-a[0],b[1]-a[1],b[2]-a[2]],e2=[c[0]-a[0],c[1]-a[1],c[2]-a[2]],cr=[e1[1]*e2[2]-e1[2]*e2[1],e1[2]*e2[0]-e1[0]*e2[2],e1[0]*e2[1]-e1[1]*e2[0]],f=cr[0]*n[0]+cr[1]*n[1]+cr[2]*n[2]<0;
    const o=f?[0,2,1,0,3,2]:[0,1,2,0,2,3];for(const j of o){g.P.push(...v[j]);g.Nn.push(...n);g.U.push(...uv[j]);}};
  for(let i=0;i<N;i++)for(let k=0;k<N;k++){const h=Hh[i*N+k],sf=Sf[i*N+k],b=Math.min(-1,h-1.2),x0=-half+i*cell,x1=x0+cell,z0=-half+k*cell,z1=z0+cell;
    quad(gOf(sf,false),[[x0,h,z0],[x0,h,z1],[x1,h,z1],[x1,h,z0]],[0,1,0],[[0,1],[0,0],[1,0],[1,1]]);
    for(const[di,dk,n,fx]of[[1,0,[1,0,0],x1],[-1,0,[-1,0,0],x0],[0,1,[0,0,1],z1],[0,-1,[0,0,-1],z0]]){const ni=i+di,nk=k+dk,nh=ni<0||nk<0||ni>=N||nk>=N?-1e9:Hh[ni*N+nk];if(nh>=h)continue;
      const y0=Math.max(nh,b),v0=(y0-b)/(h-b),g=gOf(sf,true);
      if(di)quad(g,[[fx,y0,z0],[fx,h,z0],[fx,h,z1],[fx,y0,z1]],n,[[0,v0],[0,1],[1,1],[1,v0]]);else quad(g,[[x0,y0,fx],[x0,h,fx],[x1,h,fx],[x1,y0,fx]],n,[[0,v0],[0,1],[1,1],[1,v0]]);}}
  for(const key in G){const{sf,side,P,Nn,U}=G[key],[t,sd]=defs[sf],geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(P,3));geo.setAttribute('normal',new THREE.Float32BufferAttribute(Nn,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute(U,2));
    const m=new THREE.Mesh(geo,mat(side?sd:t,cell/.8));m.receiveShadow=true;m.castShadow=true;root.add(m);}
  return cells;}
/* merge every static mesh by material to cut draw calls; animated pieces stay separate */
/* chunk (metres, optional): merge per material and per chunk, so big scenes can cull what is off screen */
function mergeStatic(root,chunk){root.updateMatrixWorld(true);const dyn=new Set(),proto=THREE.Object3D.prototype.onBeforeRender;
  root.traverse(o=>{if(o.isMesh&&o.onBeforeRender!==proto){const p=o.parent;if(p&&!p.userData.isAsset&&p!==root)p.traverse(q=>dyn.add(q));else dyn.add(o);}if(o.userData.dynamic)o.traverse(q=>dyn.add(q));});
  const B=new Map(),rm=[];
  root.traverseVisible(o=>{if(!o.isMesh||o.isInstancedMesh||dyn.has(o)||!o.geometry.index)return;const g=o.geometry,multi=Array.isArray(o.material),mats=multi?o.material:[o.material],grs=multi&&g.groups.length?g.groups:[{start:0,count:g.index.count,materialIndex:0}];
    const ck=chunk?Math.floor(o.matrixWorld.elements[12]/chunk)+','+Math.floor(o.matrixWorld.elements[14]/chunk):'';for(const gr of grs){const m=mats[gr.materialIndex];if(!m)continue;const key=chunk?m.uuid+ck:m;let b=B.get(key);if(!b){b={m,items:[]};B.set(key,b);}b.items.push([g,gr.start,gr.count,o.matrixWorld]);}rm.push(o);});
  rm.forEach(o=>o.parent.remove(o));const nm=new THREE.Matrix3(),v=new THREE.Vector3();
  for(const{m,items}of B.values()){let nv=0,ni=0;for(const[g,,c]of items){nv+=g.attributes.position.count;ni+=c;}const P=new Float32Array(nv*3),Nn=new Float32Array(nv*3),U=new Float32Array(nv*2),I=nv>65535?new Uint32Array(ni):new Uint16Array(ni);let vo=0,io=0;
    for(const[g,st,c,mw]of items){const p=g.attributes.position,n=g.attributes.normal,u=g.attributes.uv;nm.getNormalMatrix(mw);
      for(let i=0;i<p.count;i++){v.fromBufferAttribute(p,i).applyMatrix4(mw);P.set([v.x,v.y,v.z],(vo+i)*3);if(n){v.fromBufferAttribute(n,i).applyMatrix3(nm).normalize();Nn.set([v.x,v.y,v.z],(vo+i)*3);}if(u)U.set([u.getX(i),u.getY(i)],(vo+i)*2);}
      for(let i=0;i<c;i++)I[io+i]=g.index.getX(st+i)+vo;vo+=p.count;io+=c;}
    const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(P,3));geo.setAttribute('normal',new THREE.BufferAttribute(Nn,3));geo.setAttribute('uv',new THREE.BufferAttribute(U,2));geo.setIndex(new THREE.BufferAttribute(I,1));geo.computeBoundingSphere();
    const mesh=new THREE.Mesh(geo,m);mesh.castShadow=!m.transparent;mesh.receiveShadow=true;mesh.matrixAutoUpdate=false;root.add(mesh);}
  const keep=o=>{let k=false;o.traverse(q=>{if(q.isMesh||q.isLight||q.isSprite||q.isPoints)k=true;});return k;};for(const c of root.children.slice())if(!c.isMesh&&!keep(c))root.remove(c);}

/* swap the leafy vTree decorations inside a building for small pines, for scenes whose woods are pine only; returns how many */
function pineSwap(obj,seed=1){const lv=vm('leaves'),hit=[];const lw=g=>Math.max(...g.children.filter(c=>c.isMesh&&c.material===lv).map(c=>c.geometry.parameters?c.geometry.parameters.width:0));
  obj.traverse(g=>{if(g.isGroup&&g!==obj&&g.children.length===5&&g.children.filter(c=>c.isMesh&&c.material===lv).length===4&&lw(g)>=1.8)hit.push(g);});
  hit.forEach((g,i)=>{const t=vxTree('pine','small')(seed+i),w=lw(g);t.scale.setScalar(Math.min(1,w/3.6));t.position.copy(g.position);g.parent.add(t);g.parent.remove(g);});return hit.length;}
/* scene statistics shown in the viewer: people and animals are counted from the agents, buildings and trees by the scene */
const WILD_SP=new Set(['wolf','deer','boar','bison','bear','rabbit','duck','crow','songbird']);
const SC_BLD=id=>{const a=SC_A(id);return!!a&&a.folder.startsWith('buildings')&&!a.folder.endsWith('fences')&&!/palisade|stonewall|gate|tower/.test(id);};
const SC_HOUSE=id=>{const a=SC_A(id);return!!a&&(a.folder.endsWith('housing')||/^vx-farm/.test(id));};
function sceneStats(root,o){let ad=0,ch=0,an=0,wi=0;root.traverse(q=>{const u=q.userData;if(u.traits){u.traits.child?ch++:ad++;}else if(u.animal){WILD_SP.has(u.animal)?wi++:an++;}});
  root.userData.stats=Object.assign({},o,{adults:ad,children:ch,animals:an,wildlife:wi});}

/* scene agents: fold each character's box meshes into one skinned mesh per material, using its joints as bones.
   The mixer keeps driving the same joints, so clips, skirts and held tools still work, with far fewer draw calls. */
/* materials that differ only by tint share one skinned material; the tint goes into vertex colours */
const SKMAT=new Map(),skKey=m=>[m.map?m.map.uuid:'-',m.roughness,m.metalness,m.emissive?m.emissive.getHexString():'',m.emissiveIntensity,m.transparent,m.opacity,m.side].join('|'),
  skMat=(k,m)=>{let s=SKMAT.get(k);if(!s){s=m.clone();s.color=new THREE.Color(1,1,1);s.vertexColors=true;s.skinning=true;SKMAT.set(k,s);}return s;};
/* one shared atlas of the 16 × 16 pixel textures, so a whole character draws in one call; the shader wraps uv inside its cell */
const SK_ATLAS=(()=>{const S=16,W=1024,PER=W/S,slot=new Map();let cv,ctx,tex,n=0;
  const init=()=>{cv=document.createElement('canvas');cv.width=cv.height=W;ctx=cv.getContext('2d');ctx.fillStyle='#ffffff';ctx.fillRect(0,0,S,S);n=1;tex=new THREE.CanvasTexture(cv);tex.magFilter=tex.minFilter=THREE.NearestFilter;tex.generateMipmaps=false;tex.encoding=THREE.sRGBEncoding;};
  return{ok:m=>m.isMeshStandardMaterial&&!m.transparent&&!m.emissiveMap&&!m.alphaMap&&!m.normalMap&&m.emissive.getHex()===0&&(!m.map||(m.map.image&&m.map.image.width===S&&m.map.image.height===S&&m.map.repeat.x===1&&m.map.repeat.y===1&&m.map.offset.x===0&&m.map.offset.y===0)),
    cell(t){if(!tex)init();if(!t)return[0,1-1/PER];let k=slot.get(t.uuid);if(k==null){if(n>=PER*PER)return null;k=n++;slot.set(t.uuid,k);try{ctx.drawImage(t.image,(k%PER)*S,Math.floor(k/PER)*S);}catch(e){}tex.needsUpdate=true;}return[(k%PER)/PER,1-(Math.floor(k/PER)+1)/PER];},
    get tex(){if(!tex)init();return tex;},size:1/PER};})();
const skAtlasMat=m=>{const k='A|'+[m.roughness,m.metalness,m.side].join('|');let s=SKMAT.get(k);if(s)return s;
  s=new THREE.MeshStandardMaterial({map:SK_ATLAS.tex,vertexColors:true,skinning:true,roughness:m.roughness,metalness:m.metalness,side:m.side});const sz=SK_ATLAS.size.toFixed(8);
  s.onBeforeCompile=sh=>{sh.vertexShader='attribute vec2 aCell;\nvarying vec2 vCell;\n'+sh.vertexShader.replace('#include <uv_vertex>','#include <uv_vertex>\nvCell=aCell;');
    sh.fragmentShader='varying vec2 vCell;\n'+sh.fragmentShader.replace('#include <map_fragment>','vec4 texelColor=texture2D(map,vCell+fract(vUv)*'+sz+');texelColor=mapTexelToLinear(texelColor);diffuseColor*=texelColor;');};
  s.customProgramCacheKey=()=>'skatlas';SKMAT.set(k,s);return s;};
function compactRig(root){root.updateMatrixWorld(true);const inv=new THREE.Matrix4().copy(root.matrixWorld).invert(),proto=THREE.Object3D.prototype.onBeforeRender,keep=new Set(),cp=root.userData.clipProps||{};
  for(const k in cp)cp[k].traverse(q=>keep.add(q));const shown=o=>{for(let q=o;q&&q!==root;q=q.parent)if(!q.visible)return false;return true;};
  const bones=[],bi=new Map(),B=new Map(),rm=[];
  root.traverse(o=>{if(!o.isMesh||o.isSkinnedMesh||keep.has(o)||o.onBeforeRender!==proto||!shown(o)||!o.geometry.index)return;const p=o.parent;let i=bi.get(p);if(i==null){i=bones.length;bones.push(p);bi.set(p,i);}
    const g=o.geometry,multi=Array.isArray(o.material),mats=multi?o.material:[o.material],grs=multi&&g.groups.length?g.groups:[{start:0,count:g.index.count,materialIndex:0}],mw=new THREE.Matrix4().multiplyMatrices(inv,o.matrixWorld);
    for(const gr of grs){const m=mats[gr.materialIndex];if(!m)continue;const ce=SK_ATLAS.ok(m)?SK_ATLAS.cell(m.map):null,k=ce?'A|'+[m.roughness,m.metalness,m.side].join('|'):skKey(m);(B.get(k)||B.set(k,{m,items:[],atlas:!!ce}).get(k)).items.push([g,gr.start,gr.count,mw,i,m.color||new THREE.Color(1,1,1),ce]);}rm.push(o);});
  if(!rm.length)return;rm.forEach(o=>o.parent.remove(o));const sk=new THREE.Skeleton(bones),nm=new THREE.Matrix3(),v=new THREE.Vector3();
  /* bones are kept relative to the character's root, so moving the character costs nothing; the bone data is only re-sent when the pose changes */
  sk.boneInverses=bones.map(b=>new THREE.Matrix4().multiplyMatrices(inv,b.matrixWorld).invert());const ri=new THREE.Matrix4(),tm=new THREE.Matrix4();sk.dirty=true;
  sk.update=function(){if(!this.dirty)return;this.dirty=false;ri.copy(root.matrixWorld).invert();for(let i=0;i<bones.length;i++){tm.multiplyMatrices(ri,bones[i].matrixWorld).multiply(this.boneInverses[i]);tm.toArray(this.boneMatrices,i*16);}if(this.boneTexture)this.boneTexture.needsUpdate=true;};
  const prevPost=root.userData.post;let pose=true;root.userData.post=()=>{prevPost&&prevPost();sk.dirty=true;pose=true;};
  const rig=new THREE.Group();rig.visible=false;const stay=new Set(Object.values(cp));for(const c of root.children.slice())if(!stay.has(c))rig.add(c);root.add(rig);const SKM=[];
  root.updateMatrixWorld=function(force){if(this.matrixAutoUpdate)this.updateMatrix();if(this.parent)this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix);else this.matrixWorld.copy(this.matrix);
    for(const m of SKM)m.matrixWorld.copy(this.matrixWorld);for(const c of this.children)if(c!==rig&&!c.isSkinnedMesh)c.updateMatrixWorld(true);if(pose||force){pose=false;rig.updateMatrixWorld(true);}};
  root.userData.skm=SKM;
  for(const[k,{m,items,atlas}]of B){let nv=0,ni=0;for(const[g,,c]of items){nv+=g.attributes.position.count;ni+=c;}
    const P=new Float32Array(nv*3),N=new Float32Array(nv*3),U=new Float32Array(nv*2),SI=new Uint16Array(nv*4),SW=new Float32Array(nv*4),C=new Float32Array(nv*3),AC=atlas?new Float32Array(nv*2):null,I=new Uint32Array(ni);let vo=0,io=0;
    for(const[g,st,c,mw,bn,col,ce]of items){const pa=g.attributes.position,na=g.attributes.normal,ua=g.attributes.uv;nm.getNormalMatrix(mw);
      for(let i=0;i<pa.count;i++){v.fromBufferAttribute(pa,i).applyMatrix4(mw);P.set([v.x,v.y,v.z],(vo+i)*3);if(na){v.fromBufferAttribute(na,i).applyMatrix3(nm).normalize();N.set([v.x,v.y,v.z],(vo+i)*3);}if(ua)U.set([ua.getX(i),ua.getY(i)],(vo+i)*2);SI[(vo+i)*4]=bn;SW[(vo+i)*4]=1;C[(vo+i)*3]=col.r;C[(vo+i)*3+1]=col.g;C[(vo+i)*3+2]=col.b;if(AC){AC[(vo+i)*2]=ce[0];AC[(vo+i)*2+1]=ce[1];}}
      for(let i=0;i<c;i++)I[io+i]=g.index.getX(st+i)+vo;vo+=pa.count;io+=c;}
    const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(P,3));geo.setAttribute('normal',new THREE.BufferAttribute(N,3));geo.setAttribute('uv',new THREE.BufferAttribute(U,2));
    geo.setAttribute('skinIndex',new THREE.BufferAttribute(SI,4));geo.setAttribute('skinWeight',new THREE.BufferAttribute(SW,4));geo.setAttribute('color',new THREE.BufferAttribute(C,3));if(AC)geo.setAttribute('aCell',new THREE.BufferAttribute(AC,2));geo.setIndex(new THREE.BufferAttribute(I,1));geo.computeBoundingSphere();geo.boundingSphere.radius*=1.5;
    const mesh=new THREE.SkinnedMesh(geo,atlas?skAtlasMat(m):skMat(k,m));mesh.castShadow=true;mesh.receiveShadow=false;root.add(mesh);SKM.push(mesh);mesh.matrixAutoUpdate=false;mesh.bind(sk,new THREE.Matrix4());mesh.bindMode='detached';mesh.bindMatrixInverse.identity();sk.boneInverses=bones.map(b=>new THREE.Matrix4().multiplyMatrices(inv,b.matrixWorld).invert());}}

/* ---------- agents ---------- */
function agentOf(m){const mx=new THREE.AnimationMixer(m),acts={};let cur=null;const play=(n,f=.3)=>{const c=m.userData.clips.find(c=>c.name===n);if(!c||(cur&&cur._n===n))return;const a=acts[n]||(acts[n]=mx.clipAction(c));a._n=n;a.reset();a.setLoop(THREE.LoopRepeat,Infinity);a.play();if(cur&&f)a.crossFadeFrom(cur,f,false);else if(cur)cur.stop();cur=a;
  const pr=m.userData.clipProps||{};for(const k in pr)pr[k].visible=k===n;};return{m,mx,play,get cur(){return cur;}};}
function face(m,dx,dz,dt,k=8){const t=Math.atan2(dx,dz);let d=t-m.rotation.y;d=Math.atan2(Math.sin(d),Math.cos(d));m.rotation.y+=d*Math.min(1,dt*k);}
function behPath(A,pts,speed,clip='Walk',stops={}){let i=0,wait=0;A.m.position.set(pts[0][0],0,pts[0][1]);A.play(clip,0);return dt=>{if(wait>0){wait-=dt;if(wait<=0)A.play(clip);return;}
  const[tx,tz]=pts[(i+1)%pts.length],dx=tx-A.m.position.x,dz=tz-A.m.position.z,d=Math.hypot(dx,dz),st=speed*dt;if(d<=st){A.m.position.x=tx;A.m.position.z=tz;i=(i+1)%pts.length;const s=stops[i];if(s){wait=s[1];A.play(s[0]);}return;}
  A.m.position.x+=dx/d*st;A.m.position.z+=dz/d*st;face(A.m,dx,dz,dt);};}
function behCircle(A,cx,cz,r,speed,ph,clip='Run'){let a=ph;A.play(clip,0);return dt=>{a+=speed/r*dt;const x=cx+Math.cos(a)*r,z=cz+Math.sin(a)*r;A.m.position.set(x,0,z);A.m.rotation.y=Math.atan2(-Math.sin(a),Math.cos(a));};}
function behWander(A,x0,x1,z0,z1,speed,idles,rng,walk='Walk'){let tgt=null,wait=rng()*3;A.m.position.set(x0+rng()*(x1-x0),0,z0+rng()*(z1-z0));A.m.rotation.y=rng()*6.28;A.play(idles[0],0);
  return dt=>{if(wait>0){wait-=dt;if(wait<=0){tgt=[x0+rng()*(x1-x0),z0+rng()*(z1-z0)];A.play(walk);}return;}const dx=tgt[0]-A.m.position.x,dz=tgt[1]-A.m.position.z,d=Math.hypot(dx,dz),st=speed*dt;
    if(d<=st){wait=3+rng()*6;A.play(idles[Math.floor(rng()*idles.length)]);return;}A.m.position.x+=dx/d*st;A.m.position.z+=dz/d*st;face(A.m,dx,dz,dt,5);};}
function giveTool(m,name){if(!name||!TOOLS[name])return null;const o=TOOLS[name].build(),k=m.userData.traits;o.scale.setScalar(k&&k.child?.72:k&&k.kind==='female'?.92:1);m.getObjectByName('socket_R').add(o);m.userData.toolObj=o;return o;}
function workPiece(scene,m,clipName){const clip=m.userData.clips.find(c=>c.name===clipName),tool=m.userData.toolObj;if(!clip||!tool||!clip.strikeT)return;const mx=new THREE.AnimationMixer(m),act=mx.clipAction(clip);act.play();act.time=clip.strikeT;mx.update(0);m.userData.post&&m.userData.post();scene.updateMatrixWorld(true);
  const tip=tool.localToWorld(tool.userData.tip.clone());act.stop();mx.uncacheRoot(m);const kind=TOOLS[m.userData.occTool||'Axe'].piece||'log',p=buildWorkpiece(kind,tip.y-.01);p.position.set(tip.x+(kind==='anvil'?.06:0),0,tip.z+(kind==='log'?0:.05));p.traverse(o=>{if(o.isMesh)o.castShadow=o.receiveShadow=true;});scene.add(p);}

/* ---------- Scene: small farm village ---------- */
function vxSceneFarm(){const root=new THREE.Group();root.userData.lights=[];root.userData.ground=-1;const rng=mulberry32(2026),S=100,FLAT=43;
  const PATHS=[[-2,2,-24,50],[-38,38,-2,2],[-7.4,-2,11,13],[-7.4,-2,25,27],[2,7.4,11,13],[2,7.4,25,27],[-31,-29,2,4],[-25,-23,2,24],[-31,-23,23,25],[29,31,2,10],[23,25,-21,-2],[-19,-17,-24,-2],[15,17,-6,-2],[-37,-35,-4,-2],[-8,-2,-12,-2],[-3.4,3.4,30,32],[-14,-12,16,18]];
  const TILES=[],TL=(k,x,z,ry=0)=>TILES.push([k,x,z,ry]),H90=Math.PI/2;
  for(let i=-1;i<=1;i++)for(let k=-1;k<=1;k++)TL('plaza',i*4,k*4);
  for(let z=8;z<=48;z+=4)TL(z===12||z===24?'cross':'straight',0,z);for(let z=-8;z>=-24;z-=4)TL('straight',0,z);
  const north={16:1,24:1,'-16':1},south={'-28':1,'-20':1,28:1};for(let x=8;x<=36;x+=4)for(const sx of[x,-x])TL(north[sx]?'t':south[sx]?'t':'straight',sx,0,north[sx]?H90:south[sx]?-H90:H90);
  TL('straight',16,-4);for(let z=-4;z>=-20;z-=4){TL('straight',24,z);TL('straight',-16,z);}TL('straight',-28,4);for(let z=4;z<=28;z+=4)TL('straight',-20,z);TL('corner',-20,32,Math.PI);TL('straight',-24,32,H90);
  for(let z=4;z<=12;z+=4)TL('straight',28,z);for(const z of[12,24])for(const x of[-4,4])TL('straight',x,z,H90);
  const underTile=(x,z)=>TILES.some(t=>Math.abs(x-t[1])<2&&Math.abs(z-t[2])<2);
  const inRect=(x,z,r)=>x>r[0]&&x<r[1]&&z>r[2]&&z<r[3];const POND=[-35,-35,7,5];const pondD=(x,z)=>((x-POND[0])/POND[2])**2+((z-POND[1])/POND[3])**2;
  const heightAt=(x,z)=>{const d=Math.max(Math.abs(x),Math.abs(z));if(underTile(x,z))return-.85;if(pondD(x,z)<1)return-1;if(d<FLAT)return 0;const k=(d-FLAT)/(S/2-FLAT),n=(Math.sin(x*.23)+Math.cos(z*.19)+Math.sin((x+z)*.13))*.6;return Math.max(0,Math.round((k*k*6+n*k*2)/.5)*.5);};
  const surfAt=(x,z,h)=>{const pd=pondD(x,z);if(pd<1)return'bed';if(pd<1.6)return'sand';if(h>3.5&&(Math.sin(x*1.3)*Math.cos(z*1.1))>.2)return'rock';return'grass';};
  sceneTerrain(root,S,2,heightAt,surfAt);
  const ws=vWaterSurface(root,POND[2]*2,POND[3]*2,POND[0],-.35,POND[1],2);
  const stat=new THREE.Group();root.add(stat);
  for(const[k,x,z,ry]of TILES){const t=k==='plaza'?SC_A('tr-plaza').build():k==='cross'?roadTile2('dirt','cross'):k==='t'?roadTile2('dirt','t'):roadTile('dirt',k==='corner');t.position.set(x,-T,z);t.rotation.y=ry;t.userData.isAsset=true;stat.add(t);}
  const put2=(obj,x,z,ry=0,y=0)=>{obj.position.set(x,y,z);obj.rotation.y=ry;obj.userData.isAsset=true;stat.add(obj);return obj;};
  const A=(id,x,z,ry,o={},s)=>{const a=SC_A(id);const m=a.build(s??a.defaultSeed,Object.assign((a.opts||[]).reduce((q,p)=>(q[p.key]=p.def,q),{}),o));m.traverse(q=>{if(q.isMesh){q.castShadow=true;q.receiveShadow=true;}});return put2(m,x,z,ry);};
  /* houses */
  A('vx-cot-1',-11,12,Math.PI/2);A('vx-cot-2',-11,24,Math.PI/2);A('vx-log-2',11,12,-Math.PI/2);A('vx-brk-2',11,24,-Math.PI/2);
  /* farm buildings */
  A('vx-farm-2',-24,-24,0);A('vx-barn',-6,-31,0);A('vx-granary',-36,-8,Math.PI/2);A('vx-sheepfold',24,-26,0);A('vx-coop',-30,8.5,0);
  /* production and gathering */
  A('vx-blacksmith',16,-10.5,0);A('vx-cabin',35,14,-Math.PI/2);A('vx-windmill',-30,32,Math.PI/4);
  /* village square and fields */
  A('vx-well',5,5,0);A('vx-market',-4.6,-4.6,Math.PI/4);put2(vxFarmField(1,{crop:'wheat',width:14,length:9,fence:1}),28,-37);put2(vxFarmField(2,{crop:'mixed',width:14,length:9,fence:1}),26,35);
  put2(vxFarmField(3,{crop:'cabbage',width:10,length:7,fence:1}),-12,38);
  for(const[x,z,ry]of[[-6,7.5,0],[7.5,-6,Math.PI/2],[-7.5,-1.5,Math.PI/2]])put2(iBench(),x,z,ry);
  for(const[x,z]of[[2.6,18],[-2.6,36],[2.6,-14],[-12,2.6],[12,-2.6],[-32,2.6],[32,-2.6],[2.6,44]])A('it-l-streetlantern',x,z,x>0?-Math.PI/2:Math.PI/2);
  /* props */
  A('it-f-bales',-14,-26,.3);A('it-f-haystack',2.6,-34,0);A('it-f-wheelbarrow',-1,-24,1.2);A('it-c-barrels',21.5,-4.5,0);A('it-c-crate',12,-3.8,.4,{contents:'closed'});A('it-f-trough',4,-27,Math.PI/2);
  A('it-c-sacks',-27,26,.4);A('it-f-stook',33,-31,0);A('it-f-stook',22,-31,.6);A('it-c-basket',22,30.5,0,{contents:'cabbages'});A('it-u-stool',-26,11,0);
  put2(vCart(new THREE.Group(),0,0,0,'hay'),-17,-31,.5);
  /* trees, rocks, plants on the hills and around the village */
  const TK=[['pine','large'],['pine','small'],['oak','large'],['birch','large'],['birch','small'],['oak','small'],['pine','large']];
  for(let n=0;n<90;n++){const x=(rng()-.5)*96,z=(rng()-.5)*96,d=Math.max(Math.abs(x),Math.abs(z));if(d<FLAT+1||pondD(x,z)<2)continue;const[k,s]=TK[Math.floor(rng()*TK.length)],t=vxTree(k,s)(n+1);t.traverse(q=>{if(q.isMesh){q.castShadow=true;q.receiveShadow=true;}});put2(t,x,z,rng()*6,heightAt(x,z));}
  for(const[x,z,k]of[[-20,15,'apple'],[-20,22,'pear'],[20,20,'cherry'],[19,30,'plum'],[-38,18,'apple'],[38,-12,'apple'],[-6,18,'pear'],[38,26,'plum']]){const t=vxFruitTree(k)(x*7|1,{size:'mature',season:'fruit'});put2(t,x,z,rng()*6);}
  for(const[x,z,k,s]of[[-40,-28,'birch','large'],[-28,-38,'birch','small'],[-41,-40,'oak','large'],[40,8,'pine','large'],[40,20,'pine','small'],[38,40,'oak','large'],[-41,40,'oak','small']]){put2(vxTree(k,s)(x*3+z|1),x,z,rng()*6);}
  for(let n=0;n<14;n++){const x=(rng()-.5)*94,z=(rng()-.5)*94;if(Math.max(Math.abs(x),Math.abs(z))<FLAT+2)continue;const k=['granite','granite','sandstone','basalt'][n%4],b=vxLargeRock(k)(n+3);b.scale.setScalar(.6+rng()*.6);put2(b,x,z,rng()*6,heightAt(x,z)-.2);}
  for(const[x,z]of[[-30,-32],[-40,-35],[-35,-29],[-33,-41],[-28,-36]])put2(vxReeds(Math.abs(x*z)|1),x,z,rng()*6,-.05).traverse(q=>{if(q.isMesh&&q.material===WATERMAT)q.visible=false;});
  for(const[x,z]of[[-15,8],[-15,30],[15,8],[15,30],[-7,30],[7,8],[-38,3],[36,-20],[-20,-8],[8,-20]]){put2(rng()<.5?vxBushAsset('woolRed')(Math.abs(x*z)|1):vxFlowers(Math.abs(x+z*3)|1),x,z,rng()*6);}
  vxSmallRocks(4).children.forEach(()=>{});put2(vxSmallRocks(4),-42,10,0,0);put2(vxSmallRocks(9),42,-36,0,heightAt(42,-36));put2(vxStump(3),32,8,0);put2(vxFallenLog(5),38,4,1.2);
  /* keep only a handful of the brightest point lights so the scene stays fast */
  const lights=[];stat.traverse(o=>{if(o.isPointLight)lights.push(o);});lights.forEach(l=>{const keep=l.distance>=6||l.userData.min>=1.5;if(!keep)l.parent.remove(l);else root.userData.lights.push(l);});
  mergeStatic(stat);
  /* ---------- people and animals ---------- */
  const dynG=new THREE.Group();dynG.userData.dynamic=true;root.add(dynG);const ag=[],tick=[];
  const V_=(kind,seed,job,force)=>{const m=buildVillager(kind,seed,job,force||{});m.traverse(q=>{if(q.isMesh)q.castShadow=true;});dynG.add(m);const A=agentOf(m);ag.push(A);if(m.userData.occTool)giveTool(m,m.userData.occTool);return A;};
  const still=(A,x,z,ry,clip,t)=>{A.m.position.set(x,0,z);A.m.rotation.y=ry;A.play(clip,0);if(A.cur)A.cur.time=t||rng()*3;};
  // adults (6 men, 6 women)
  const smith=V_('male',4,'blacksmith');still(smith,19,-3.6,Math.PI*1.1,'Hammering');
  const wood=V_('male',7,'woodcutter');still(wood,31,8,Math.PI/2+.2,'Tool strike');
  const farmer=V_('male',11,'farmer');tick.push(behPath(farmer,[[22,-34],[34,-34],[34,-36.4],[22,-36.4],[22,-38.8],[34,-38.8],[34,-41],[22,-41]],.8));
  const miller=V_('male',13,'miller');still(miller,-26.4,28.6,-2.4,'Look around');
  const shep=V_('male',17,'shepherd');still(shep,26.2,-20.6,Math.PI*.95,'Idle');
  const merch=V_('male',21,'merchant');still(merch,-5.8,-5.8,Math.PI/4,'Talk');
  const picker=V_('female',5,'farmer');still(picker,24,33.6,.4,'Pick up');
  const t1=V_('female',8);still(t1,3.4,8,Math.PI/2+.3,'Talk',.4);const t2=V_('female',12,'weaver');still(t2,5.6,8.4,-Math.PI/2-.2,'Talk',1.8);
  const cust=V_('female',15);still(cust,-3.3,-3.3,-Math.PI*.75,'Talk',1);
  const w1=V_('female',19);tick.push(behPath(w1,[[0.6,6],[0.6,24],[5.6,24.6],[0.6,25.4],[0.6,6],[-16,0.6],[-16,-12],[-16,0.6]],1.35,'Walk',{2:['Talk',4],5:['Look around',3]}));
  const w2=V_('female',23,'herbalist');tick.push(behPath(w2,[[-1,-6],[-1,-22],[-1,-6],[-30,-1],[-30,4.5],[-30,-1]],1.3,'Walk',{1:['Pick up',3],4:['Idle',4]}));
  // children (4 boys, 4 girls)
  const b1=V_('child',1,null,{girl:false}),g1=V_('child',4,null,{girl:true});tick.push(behCircle(b1,-6,1,2.6,2.8,0));tick.push(behCircle(g1,-6,1,2.6,2.8,Math.PI*.7));
  const g2=V_('child',6,null,{girl:true});still(g2,-8.2,18.5,Math.PI/2,'Jump');
  const b2=V_('child',3,null,{girl:false});still(b2,4.2,17.5,-Math.PI/2,'Wave');
  const g3=V_('child',9,null,{girl:true}),b3=V_('child',10,null,{girl:false});tick.push(behPath(g3,[[-1,16],[-1,31],[-6,31],[-6,17],[-1,16]],1.1));tick.push(behPath(b3,[[1,31],[1,15],[6,15],[6,30],[1,31]],1.1));
  const g4=V_('child',11,null,{girl:true});still(g4,-26,11,Math.PI,'Sit');
  const b4=V_('child',14,null,{girl:false});still(b4,-28.6,12.2,Math.PI*.9,'Pick up');
  [smith,wood].forEach(A=>{A.mx.update(0);A.m.userData.post&&A.m.userData.post();});root.updateMatrixWorld(true);workPiece(dynG,wood.m,'Tool strike');workPiece(dynG,smith.m,'Hammering');
  // animals
  const AN_=(m)=>{m.traverse(q=>{if(q.isMesh)q.castShadow=true;});dynG.add(m);const A=agentOf(m);ag.push(A);return A;};
  for(let i=0;i<5;i++){const s=AN_(sheepB(0,{coat:i===3?'#2a2826':'#ece8dc',young:i===4}));tick.push(behWander(s,20.5,27.5,-26.5,-22.6,.45,['Graze','Idle','Graze'],mulberry32(40+i)));}
  for(let i=0;i<4;i++){const h=AN_(buildBird('hen',HEN[['brown','white','buff','speckled'][i]]));tick.push(behWander(h,-32.2,-27.8,7.2,10.8,.35,['Peck','Idle','Peck'],mulberry32(60+i)));}
  {const r=AN_(buildBird('rooster',ROOSTER.red));tick.push(behWander(r,-32.2,-27.8,7.2,10.8,.35,['Idle','Peck','Crow'],mulberry32(70)));}
  for(let i=0;i<3;i++){const c=AN_(buildBird('chick',CHICK[['yellow','yellow','brown'][i]]));tick.push(behWander(c,-32,-28,7.4,10.6,.3,['Peck','Idle'],mulberry32(80+i)));}
  {const h=AN_(horseB(0,{coat:'#6e4a2e',pattern:'head'}));still(h,5.5,-24,-1.2,'Graze');}
  {const d=AN_(dogB(0,{coat:'#c8963e'}));tick.push(behPath(d,[[-.6,6],[-.6,24],[4.6,23.6],[-.6,24.6],[-.6,6],[-16,-.6],[-16,-11],[-16,-.6]],1.35));}
  {const c=AN_(buildAvian('crow',CROW.black));still(c,-14.2,-26,1,'Peck');}
  {const d=AN_(buildAvian('duck',DUCK.mallard));tick.push(behWander(d,-40,-30,-38,-32,.3,['Swim'],mulberry32(90),'Swim'));d.m.position.y=-.3;}
  root.userData.tick=dt=>{for(const f of tick)f(dt);for(const A of ag){A.mx.update(dt);A.m.userData.post&&A.m.userData.post();}};
  root.userData.tick(0.01);return root;}

FOLDERS[''].children.push('scenes');FOLDERS['scenes']={name:'Scenes',blurb:'Example scenes assembled from the library',children:[]};
ASSETS.push({id:'sc-farm',folder:'scenes',name:'Small farm village',kind:'scene',build:vxSceneFarm,groundR:-1,
  desc:'A 100 × 100 m farming hamlet of 20 people (12 adults, 8 children): four houses, a farmhouse with its field, a barn, granary, sheep fold and chicken coop, a blacksmith, woodcutter and windmill around a cobbled square with a well and market stall. Roads laid from the dirt road, T-junction, crossroads and corner tiles around a paved plaza, with street lanterns, wheat, cabbage and mixed fields, orchards, a reed pond, and wooded hills rising to 6 m. The smith hammers, the woodcutter chops, the farmer walks his rows, women talk at the well and walk the roads, children play tag, wave and sit; sheep graze, hens peck, a dog trots and a duck swims.'});
