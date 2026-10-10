function J(name,parent,x,y,z){const j=new THREE.Group();j.name=name;j.position.set(x,y,z);j.userData.joint=true;parent.add(j);return j;}
FOLDERS['characters'].children=['characters/villagers'];
FOLDERS['characters/villagers']={name:'Villagers',blurb:'Base villagers to derive jobs from',children:[]};
ASSETS.push(
 {id:'villager',folder:'characters/villagers',name:'Villager',kind:'character',variants:true,defaultSeed:3,groundR:2.6,build:(s,o)=>buildVillager('male',s,o&&o.job),opts:[{key:'job',label:'Occupation',choices:OCC_CHOICES,def:'none'}],
  desc:'Blocky, voxel-style peasant man. Every roll picks a new hair style, facial hair, skin tone, outfit, headwear and dye colours. Pick an occupation to dress him for the job.'},
 {id:'villager-woman',folder:'characters/villagers',name:'Village woman',kind:'character',variants:true,defaultSeed:5,groundR:2.6,build:(s,o)=>buildVillager('female',s,o&&o.job),opts:[{key:'job',label:'Occupation',choices:OCC_CHOICES,def:'none'}],
  desc:'Blocky, voxel-style peasant woman in a floor-length gown whose panels part around the legs. Rolls hair, headwear, gown type and colours. Pick an occupation to dress her for the job.'},
 {id:'villager-boy',folder:'characters/villagers',name:'Village boy',kind:'character',variants:true,defaultSeed:1,groundR:2.2,build:s=>buildVillager('child',s,null,{girl:false}),
  desc:'Blocky boy, about 1.3 m tall, with a larger head and shorter limbs: hair, tunic, hose and cap roll with each look. Same skeleton and 13 clips, rescaled.'},
 {id:'villager-girl',folder:'characters/villagers',name:'Village girl',kind:'character',variants:true,defaultSeed:4,groundR:2.2,build:s=>buildVillager('child',s,null,{girl:true}),
  desc:'Blocky girl, about 1.3 m tall: braids, buns or pigtails, dresses and aprons roll with each look. Same skeleton and 13 clips, rescaled.'},
);
