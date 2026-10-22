// Checks every clip of a character for the mistakes we keep making: twisted or flipping arms and legs, and parts below the ground.
// Usage: node tools/check-character.mjs <asset-id> [options as JSON] [seed]
//   e.g. node tools/check-character.mjs lich '{"staff":"ruby","head":"crown"}' 2
// Per clip, sampled at 60 fps:
//   jump  = the largest rotation of any arm or leg joint from one frame to the next (a flip shows as a jump; flagged over 25°)
//   twist = the largest roll of a limb about its own bone axis (swing-twist about local y): upper arms, hands, thighs, feet
//           (flagged over 100° for upper arms and hands, 50° for thighs and feet)
//   low   = the lowest point of the model (effect meshes, userData.fx, are skipped: glow shells and particles are not solid)
//           (ground is 0; flagged below -0.005 m; skinned meshes, e.g. wing membranes, per vertex). Death clips are checked too; clips marked
//           clip.underground (a character climbing out of the ground) are not flagged.
//   pile  = for clips named Death…/Fall…: the highest point of the body at the end (flagged over 0.55 m: a heap stacked up or
//           pieces resting on other pieces in the air instead of lying on the ground)
// Exit code 1 when anything is flagged.
import fs from 'fs';import path from 'path';import vm from 'vm';import {fileURLToPath} from 'url';
const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const grad={addColorStop(){}},ctx=new Proxy({},{get:(t,k)=>k in t?t[k]:(String(k).startsWith('create')?()=>grad:()=>{}),set:(t,k,v)=>{t[k]=v;return true;}});
const sb={console,performance,Math,Date,JSON,Promise,setTimeout,clearTimeout,URL,Blob:class{}};sb.window=sb;sb.globalThis=sb;sb.self=sb;
sb.document={createElement:()=>({width:0,height:0,getContext:()=>ctx,style:{}}),addEventListener(){},getElementById:()=>null,querySelector:()=>null,querySelectorAll:()=>[],body:{appendChild(){}}};
vm.createContext(sb);const m=JSON.parse(read('src/manifest.json'));vm.runInContext(read('vendor/three.min.js'),sb);
vm.runInContext(m.library.filter(f=>!f.includes('export/')).map(read).join('\n')+'\n;globalThis.__out={ASSETS,THREE};',sb);
const{ASSETS,THREE}=sb.__out,[id,optJ,seedS]=process.argv.slice(2),A=ASSETS.find(a=>a.id===id);
if(!A){console.error('unknown asset id: '+id);process.exit(2);}
const root=A.build(seedS?+seedS:A.defaultSeed||1,optJ?JSON.parse(optJ):{}),mx=new THREE.AnimationMixer(root),D=180/Math.PI;
const LIMB=['upperArm_L','foreArm_L','hand_L','upperArm_R','foreArm_R','hand_R','thigh_L','shin_L','foot_L','thigh_R','shin_R','foot_R'];
const TW={upperArm_L:100,upperArm_R:100,hand_L:100,hand_R:100,thigh_L:50,thigh_R:50,foot_L:50,foot_R:50};
const J={};root.traverse(q=>{if(LIMB.includes(q.name)&&!J[q.name])J[q.name]=q;});
const highest=()=>{root.updateMatrixWorld(true);let y=-1e9;root.traverse(q=>{if(!q.isMesh||!q.visible)return;let p=q,s=1,gear=false;while(p){s*=Math.min(p.scale.x,p.scale.y,p.scale.z);if(p.userData.gear)gear=true;p=p.parent;}if(s<.01||gear)return;
  const g=q.geometry.parameters;if(!g||g.width===undefined)return;for(let i=0;i<8;i++){v.set((i&1?.5:-.5)*g.width,(i&2?.5:-.5)*g.height,(i&4?.5:-.5)*g.depth).applyMatrix4(q.matrixWorld);if(v.y>y)y=v.y;}});return y;};
let lowWho='';const v=new THREE.Vector3(),lowest=()=>{root.updateMatrixWorld(true);let y=1e9,w='';root.traverse(q=>{if(!q.isMesh||!q.visible||q.userData.fx)return;let p=q,s=1;while(p){s*=Math.min(p.scale.x,p.scale.y,p.scale.z);p=p.parent;}if(s<.01)return;
  if(q.isSkinnedMesh){q.skeleton.update();const n=q.geometry.attributes.position.count;for(let i=0;i<n;i++){q.boneTransform(i,v);v.applyMatrix4(q.matrixWorld);if(v.y<y){y=v.y;w=q.name;}}return;}
  const g=q.geometry.parameters;if(!g||g.width===undefined)return;for(let i=0;i<8;i++){v.set((i&1?.5:-.5)*g.width,(i&2?.5:-.5)*g.height,(i&4?.5:-.5)*g.depth).applyMatrix4(q.matrixWorld);if(v.y<y){y=v.y;let p=q.parent;while(p&&!p.name)p=p.parent;w=p?p.name:'';}}});lowWho=w;return y;};
const twist=q=>Math.abs(2*Math.atan2(q.y,q.w)*D),wrap=a=>a>180?360-a:a;
let bad=0;console.log(`${id} ${optJ||''} seed ${seedS||A.defaultSeed||1}: ${root.userData.variantText||''}`);
for(const c of root.userData.clips||[]){const a=mx.clipAction(c);a.play();const n=Math.max(2,Math.round(c.duration*60)),prev={};let lw='',jump=0,jw='',tw=0,twR=0,tww='',low=1e9,lt=0;
  for(let i=0;i<=n;i++){a.time=i/n*c.duration;mx.update(0);root.userData.post&&root.userData.post();const y=lowest();if(y<low){low=y;lt=a.time;lw=lowWho;}
    for(const k in J){const q=J[k].quaternion.clone();if(prev[k]){const d=2*Math.acos(Math.min(1,Math.abs(prev[k].dot(q))))*D;if(d>jump){jump=d;jw=`${k} at ${a.time.toFixed(2)}s`;}}prev[k]=q;
      if(TW[k]){const t=wrap(twist(q));if(t/TW[k]>twR){twR=t/TW[k];tw=t;tww=`${k} at ${a.time.toFixed(2)}s`;}}}}
  const dead=/^(Death|Fall)/.test(c.name),pile=dead?highest():0;
  a.stop();mx.uncacheAction(c);
  const twBad=twR>1,flags=[jump>25&&'JUMP',twBad&&'TWIST',low<-.005&&!c.underground&&'BELOW GROUND',pile>.55&&'PILE TOO HIGH'].filter(Boolean);if(flags.length)bad++;
  console.log(`${flags.length?'!!':'ok'} ${c.name.padEnd(28)} jump ${jump.toFixed(0).padStart(3)}° (${jw})  twist ${tw.toFixed(0).padStart(3)}° (${tww})  low ${low.toFixed(3)} (${lw} at ${lt.toFixed(2)}s)${dead?'  pile '+pile.toFixed(2)+' m':''}${c.underground?'  (starts underground)':''} ${flags.join(' ')}`);}
console.log(bad?`${bad} clip(s) flagged`:'all clips pass');process.exit(bad?1:0);
