/* ======================= SKELETAL WARRIOR: a big, heavy-boned skeleton with a two-handed sword =======================
   buildSkeleton on its own body type (VB.skeletonWarrior: the skeleton's bone lengths, broader shoulders and hips, every bone
   thicker through B.boneK) inside a group scaled by SKW_SC, so it stands about 2.2 m. The warrior's two-handed (battle axe)
   clips are reused unchanged in body units; the right fist holds the sword under the guard, the left fist WR_HAFT lower on the
   long handle. Armour, bone tints, eyes and Death/Rise are the skeleton's; armour rolls chain mail or plate on most areas. */
VB.skeletonWarrior=Object.assign({},VB.skeleton,{shW:.24,hipW:.08,g:1.2,
  boneK:{pelvis:1.2,spine:1.35,ribs:1.2,neck:1.3,humerus:1.4,forearm:1.4,hand:1.2,fingers:1.2,tips:1.2,thumb:1.2,femur:1.4,shin:1.4,foot:1.2}});
{const b=VB.skeletonWarrior;b.key='skeletonWarrior';b.hipH=b.thigh+b.shin+b.ankle+b.hipOff;b.legS=(b.thigh+b.shin)/.84;b.tS=(b.spine+b.chest)/.3;b.cS=b.neck/.22;}
const SKW_SC=1.21;

/* two-handed sword: right grip at the origin, left grip at -WR_HAFT, blade along +y, edges towards ±x. Wrapped handle with a
   band between the fists, heavy pommel, straight guard, ricasso, a tapering blade with a dark fuller and rust patches */
function skwSword(){const w=new THREE.Group(),ir=vm('iron'),dk=bm('#4a4e54','plain'),wrap=bm('#3c2a1c','leather'),wrD=bm('#2a1e16','leather'),rust=bm('#7a4a2e','plain');
  bx(w,.042,.42,.042,wrap,0,-.16,0);bx(w,.047,.018,.047,wrD,0,-.15,0);bx(w,.07,.07,.07,dk,0,-.4,0);bx(w,.05,.03,.05,ir,0,-.448,0);
  bx(w,.32,.04,.06,ir,0,.07,0);bx(w,.08,.06,.07,dk,0,.07,0);bx(w,.06,.14,.03,ir,0,.17,0);
  for(const[y0,y1,wd]of[[.24,.62,.09],[.62,.86,.08],[.86,.98,.062],[.98,1.04,.04],[1.04,1.08,.02]])bx(w,wd,y1-y0,.024,ir,0,(y0+y1)/2,0);
  bx(w,.018,.7,.03,dk,0,.56,0);bx(w,.03,.05,.028,rust,.02,.4,0);bx(w,.025,.04,.028,rust,-.025,.78,0);w.userData.len=1.08;return w;}

function buildSkeletonWarrior(seed,o={}){const body=buildSkeleton(seed,Object.assign({},o,{B:VB.skeletonWarrior,great:true,armorRoll:['chain','plate','plate'],coverDef:'most'}));
  const root=new THREE.Group();root.userData.lights=body.userData.lights;body.scale.setScalar(SKW_SC);root.add(body);
  root.userData.post=body.userData.post;root.userData.joints=body.userData.joints;
  /* the clips are in body units: walking speeds grow with the group */
  if(body.userData.clips){for(const c of body.userData.clips)if(c.speed&&!c.skwScaled){c.speed*=SKW_SC;c.note=c.note.replace(/([\d.]+) m\/s/,(m,v)=>(v*SKW_SC).toFixed(1)+' m/s');c.skwScaled=true;}root.userData.clips=body.userData.clips;}
  root.userData.ground=2.6;root.userData.variantText=body.userData.variantText;
  return root;}

ASSETS.push({id:'skeleton-warrior',folder:'characters/enemies/undead',name:'Skeletal warrior',kind:'character',variants:true,defaultSeed:1,groundR:2.6,build:(s,o)=>buildSkeletonWarrior(s,o||{}),
  opts:[SK_OPT.bones,SK_OPT.armor,SK_OPT.cover('most'),SK_OPT.eyes],
  desc:'Big skeleton, about 2.2 m: heavy, thick bones, broad shoulders and a wide ribcage, with a two-handed sword (long wrapped handle, straight guard, rusty blade). Same bone tints, eye glow and armour areas as the skeleton; "New look" rolls chain mail or plate on most areas. The warrior\'s two-handed clips (idle, walk, run, war mode, crouch, jumps, hits, shout, roar, taunt, kicks, four two-handed attacks and the two-handed block), plus Death (falls apart into a pile of bones) and Rise (reassembles from the pile into the war stance).'});
