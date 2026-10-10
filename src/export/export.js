/* ======================= AssetForge API + GLB export =======================
   window.AssetForge lets other projects (or the browser console) list, build and export any asset.
     AssetForge.list()                         -> [{id,name,folder,kind,options,variants,desc}]
     AssetForge.build(id,{seed,options})       -> THREE.Group (clips in userData.clips for characters)
     AssetForge.exportGLB(id,{seed,options})   -> Promise<ArrayBuffer>  (binary glTF, textures embedded, animations included)
     AssetForge.download(id,{seed,options})    -> saves <id>.glb
   See docs/EXPORT.md. */
(function(){
  const defaults=a=>(a.opts||[]).reduce((o,p)=>(o[p.key]=p.def,o),{});
  const AF={version:'1.0'};
  AF.find=id=>ASSETS.find(a=>a.id===id);
  AF.folders=()=>FOLDERS;
  AF.list=()=>ASSETS.map(a=>({id:a.id,name:a.name,folder:a.folder,kind:a.kind||(a.folder.startsWith('items')?'item':a.folder.startsWith('terrain')?'terrain':a.folder.startsWith('environment')?'environment':'building'),
    options:(a.opts||[]).map(p=>({key:p.key,label:p.label,choices:p.choices.map(c=>({value:c[0],label:c[1]})),default:p.def,live:!!p.live})),variants:!!a.variants,defaultSeed:a.defaultSeed,desc:a.desc}));
  AF.build=(id,{seed,options}={})=>{const a=AF.find(id);if(!a)throw new Error('Unknown asset: '+id);const m=a.build(a.variants?(seed??a.defaultSeed):undefined,Object.assign(defaults(a),options||{}));m.name=id;m.userData.assetId=id;
    m.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;}});return m;};
  /* glTF cannot hold InstancedMesh in this exporter version, so instances become plain meshes */
  function deinstance(root){const list=[];root.traverse(o=>{if(o.isInstancedMesh)list.push(o);});const m4=new THREE.Matrix4();
    for(const im of list){const g=new THREE.Group();g.name=im.name||'terrain';for(let i=0;i<im.count;i++){im.getMatrixAt(i,m4);const m=new THREE.Mesh(im.geometry,im.material);m.applyMatrix4(m4);g.add(m);}g.position.copy(im.position);g.quaternion.copy(im.quaternion);g.scale.copy(im.scale);im.parent.add(g);im.parent.remove(im);}}
  AF.toGLB=(obj,{animations}={})=>new Promise((res,rej)=>{if(!THREE.GLTFExporter)return rej(new Error('vendor/GLTFExporter.js not loaded'));
    deinstance(obj);obj.updateMatrixWorld(true);const saved=[];obj.traverse(o=>{saved.push([o,o.userData]);o.userData=o===obj?{assetId:obj.userData.assetId}:{};});
    const anims=animations||(saved[0][1].clips)||[];
    try{new THREE.GLTFExporter().parse(obj,r=>{saved.forEach(([o,u])=>o.userData=u);res(r);},{binary:true,animations:anims,onlyVisible:true,embedImages:true,forceIndices:true,truncateDrawRange:true});}catch(e){saved.forEach(([o,u])=>o.userData=u);rej(e);}});
  AF.exportGLB=async(id,opts={})=>AF.toGLB(AF.build(id,opts));
  AF.download=async(id,opts={})=>{const buf=await AF.exportGLB(id,opts);const url=URL.createObjectURL(new Blob([buf],{type:'model/gltf-binary'}));const a=document.createElement('a');a.href=url;a.download=id+(opts.seed?'-'+opts.seed:'')+'.glb';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),4000);};
  /* "Export GLB" button in the viewer */
  if(typeof document!=='undefined'&&document.addEventListener)document.addEventListener('click',async e=>{const b=e.target.closest&&e.target.closest('#tExport');if(!b)return;
    const m=location.hash.match(/^#\/a\/([^/?]+)(?:\/(\d+))?/);if(!m)return;const a=AF.find(m[1]);if(!a)return;b.disabled=true;const t=b.textContent;b.textContent='Exporting…';
    try{await AF.download(a.id,{seed:m[2]?+m[2]:(typeof V!=='undefined'?V.seed:undefined),options:typeof optVals==='function'?optVals(a):{}});}catch(err){console.error(err);alert('Export failed: '+err.message);}b.disabled=false;b.textContent=t;});
  if(typeof window!=='undefined')window.AssetForge=AF;
})();
