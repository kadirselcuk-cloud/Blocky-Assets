/* ======================= occupations: clothing, headwear, accessories and a held tool ======================= */
const OCC={
  none:{name:'Villager'},
  farmer:{name:'Farmer',outfit:'shortTunic',fOutfit:'apron',main:['#8c7a62','russet'],legwear:'wraps',head:'strawHat',rolled:true,tool:'Hoe'},
  blacksmith:{name:'Blacksmith',outfit:'shortTunic',fOutfit:'shortTunic',main:['#5a5650','charcoal'],legs:['#3a3430','dark'],legwear:'tallBoots',head:'none',rolled:true,acc:['apron:leather','gloves'],tool:'Hammer'},
  toolsmith:{name:'Toolsmith',outfit:'shortTunic',fOutfit:'shortTunic',main:['#6e5a44','brown'],legwear:'hose',head:'leatherCap',rolled:true,acc:['apron:leather','gloves'],tool:'Hammer'},
  hunter:{name:'Hunter',outfit:'shortTunic',fOutfit:'shortTunic',main:['#4f6a3a','forest-green'],second:['#7a5a3a','brown'],legs:['#4a3a30','dark brown'],legwear:'tallBoots',boots:'#5a3a22',head:'hunterHat',acc:['quiver','knife'],tool:'Bow'},
  woodcutter:{name:'Woodcutter',outfit:'jerkin',fOutfit:'jerkin',main:['#8a3a2e','red'],second:['#6e4a2e','leather'],legwear:'tallBoots',head:'knitCap',rolled:true,tool:'Axe'},
  miner:{name:'Miner',outfit:'shortTunic',fOutfit:'shortTunic',main:['#6a6a64','grey'],legs:['#4a4440','dark grey'],legwear:'tallBoots',head:'leatherCap',rolled:true,acc:['gloves'],tool:'Pickaxe'},
  fisher:{name:'Fisher',outfit:'shortTunic',fOutfit:'shortTunic',main:['#5e6e8a','woad-blue'],legs:['#5a5650','grey'],legwear:'tallBoots',boots:'#3a3a3a',head:'knitCap',second:['#3a4a7a','indigo'],acc:['satchel'],tool:'Fishing rod'},
  baker:{name:'Baker',outfit:'tunic',fOutfit:'kirtle',main:['#d8ccb0','flax'],head:'chefCap',rolled:true,acc:['apron:white']},
  cook:{name:'Cook',outfit:'tunic',fOutfit:'kirtle',main:['#8c7a62','russet'],head:'chefCap',rolled:true,acc:['apron:white'],tool:'Ladle'},
  miller:{name:'Miller',outfit:'tunic',fOutfit:'kirtle',main:['#cfc2a6','canvas'],second:['#e8e0cc','white'],head:'cap',legwear:'hose',acc:['apron:white']},
  leatherworker:{name:'Leatherworker',outfit:'shortTunic',fOutfit:'shortTunic',main:['#9a6a4a','ochre'],legwear:'hose',rolled:true,head:'none',acc:['apron:leather']},
  tailor:{name:'Tailor',outfit:'tunic',fOutfit:'bodice',main:['#6a5a7a','heather'],second:['#3a2a4a','plum'],head:'beret',acc:['tape']},
  weaver:{name:'Weaver',outfit:'tunic',fOutfit:'bodice',main:['#4a5a7a','indigo'],second:['#c2a24e','weld-yellow'],head:'cap',fHead:'kerchief',acc:['apron:second']},
  herbalist:{name:'Herbalist',outfit:'tunic',fOutfit:'kirtle',main:['#4f6a5a','sage'],second:['#3a5a3a','green'],head:'hoodUp',acc:['satchel']},
  healer:{name:'Healer',outfit:'robe',fOutfit:'kirtle',main:['#a8a296','grey'],second:['#e8e0cc','linen'],head:'coif',fHead:'wimple',acc:['satchel'],tool:'Book'},
  guard:{name:'Guard',outfit:'gambeson',fOutfit:'gambeson',main:['#a08a5a','padded'],second:['#8a2a2a','red'],legs:['#4a3a30','dark'],legwear:'tallBoots',head:'kettleHelm',acc:['tabard','scabbard'],tool:'Spear'},
  archer:{name:'Archer',outfit:'gambeson',fOutfit:'gambeson',main:['#8c7a62','padded'],second:['#4a6a3a','green'],legwear:'wraps',head:'hoodUp',acc:['quiver'],tool:'Bow'},
  merchant:{name:'Merchant',outfit:'jerkin',fOutfit:'bodice',main:['#7a3a3a','maroon'],second:['#4a5a7a','indigo'],head:'beret',acc:['chain','bigPouch'],tool:'Book'},
  shepherd:{name:'Shepherd',outfit:'tunic',fOutfit:'kirtle',main:['#b0a080','oatmeal'],second:['#6e5a44','brown'],legwear:'wraps',head:'hoodUp',acc:['cloak'],tool:'Crook'},
  teacher:{name:'Teacher',outfit:'robe',fOutfit:'kirtle',main:['#2e3440','black'],second:['#4a5a7a','indigo'],head:'flatCap',fHead:'coif',tool:'Book'},
  noble:{name:'Noble',outfit:'robe',fOutfit:'kirtle',main:['#8a2a3a','crimson'],second:['#c2a24e','gold'],head:'beret',acc:['chain','feather']},
};
const OCC_CHOICES=Object.keys(OCC).map(k=>[k,OCC[k].name]);
function applyOccupation(T,job){if(!job||job==='none'||!OCC[job])return T;const o=OCC[job],f=T.kind==='female';T.job=job;
  T.outfit=(f?o.fOutfit:o.outfit)||T.outfit;if(o.main)T.main=o.main;if(o.second)T.second=o.second;if(o.legs)T.legs=o.legs;if(o.legwear&&!(f&&['kirtle','bodice','apron','robe'].includes(T.outfit)))T.legwear=o.legwear;
  if(o.boots)T.boots=o.boots;T.head=(f&&o.fHead)||o.head||T.head;if(o.rolled!=null)T.rolled=o.rolled;T.acc=(o.acc||[]).slice();if(T.acc.includes('knife'))T.knife=true;
  if(['hoodUp','kettleHelm','chefCap','knitCap','leatherCap','hunterHat','beret','flatCap','strawHat','cap','coif','spikedHelm','slouchHat'].includes(T.head)&&['loose','twinBraids','pigtails'].includes(T.hairStyle))T.hairStyle='bun';
  if(T.head==='kerchief'||T.head==='wimple'){if(['loose','twinBraids','pigtails'].includes(T.hairStyle))T.hairStyle='bun';}
  T.tool=o.tool||null;return T;}

/* extra tools for occupations (grip at origin; long tools stand upright in the hand) */
Object.assign(TOOLS,{
  Bow:{two:false,build(){const g=new THREE.Group(),w=bm('#7a5236','leather');for(const[y,z,h]of[[0,.06,.18],[.2,.05,.2],[.4,.02,.2],[.58,-.02,.16],[-.2,.05,.2],[-.4,.02,.2],[-.58,-.02,.16]])bx(g,.04,h,.04,w,0,y,z);bx(g,.05,.12,.06,bm('#3c2a1c','leather'),0,0,.06);bx(g,.01,1.3,.01,bm('#ece6d6','plain'),0,0,-.05);g.userData.tip=new THREE.Vector3(0,.6,0);return g;}},
  Spear:{two:false,build(){const g=new THREE.Group();bx(g,.04,2.3,.04,bm('#8a6440','leather'),0,.2,0);bx(g,.06,.22,.02,bm('#9aa0a8','plain'),0,1.44,0);bx(g,.03,.08,.03,bm('#9aa0a8','plain'),0,1.58,0);bx(g,.05,.08,.05,bm('#5a6068','plain'),0,1.3,0);g.userData.tip=new THREE.Vector3(0,1.6,0);return g;}},
  Crook:{two:false,build(){const g=new THREE.Group(),w=bm('#7a5236','leather');bx(g,.045,1.9,.045,w,0,.3,0);bx(g,.045,.045,.22,w,0,1.25,.1);bx(g,.045,.2,.045,w,0,1.15,.2);g.userData.tip=new THREE.Vector3(0,1.25,0);return g;}},
  Hoe:{two:false,build(){const g=new THREE.Group();bx(g,.04,1.6,.04,bm('#8a6440','leather'),0,.35,0);bx(g,.04,.06,.2,bm('#5a6068','plain'),0,1.14,.09);bx(g,.16,.04,.04,bm('#9aa0a8','plain'),0,1.12,.18);g.userData.tip=new THREE.Vector3(0,1.1,.2);return g;}},
  'Fishing rod':{two:false,build(){const g=new THREE.Group(),r=new THREE.Group();g.add(r);r.rotation.x=-.85;bx(r,.035,.035,1.9,bm('#8a6440','leather'),0,0,.75);bx(r,.06,.06,.08,bm('#3c2a1c','leather'),0,0,.05);
    const tz=1.7*Math.cos(.85),ty=1.7*Math.sin(.85);bx(g,.01,ty-.06,.01,bm('#ece6d6','plain'),0,(ty+.06)/2,tz);bx(g,.05,.05,.05,bm('#b03a2e','plain'),0,.04,tz);g.userData.tip=new THREE.Vector3(0,ty,tz);return g;}},
  Book:{two:false,build(c='#6e4428'){const g=new THREE.Group(),cm=bm(c,'leather'),pg=bm('#f4f2ec','plain');for(const s of[-1,1])bx(g,.016,.28,.22,cm,s*.03,-.04,.04);bx(g,.076,.28,.02,cm,0,-.04,-.06);bx(g,.044,.26,.2,pg,0,-.04,.045);for(const y of[.06,-.14])bx(g,.078,.012,.024,bm('#d8b040','plain'),0,y,-.06);g.userData.tip=new THREE.Vector3(0,0,0);return g;}},
  Ladle:{two:false,build(){const g=new THREE.Group();bx(g,.03,.45,.03,bm('#8a6440','leather'),0,.15,0);bx(g,.12,.06,.12,bm('#9aa0a8','plain'),0,.4,.06);g.userData.tip=new THREE.Vector3(0,.4,.06);return g;}},
});
