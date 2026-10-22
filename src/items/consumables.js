/* ======================= GEAR KIT, part 4: potions and power-ups (docs/GEAR.md) =======================
   gr-potion-<brew>: a hollow glass bottle (six shapes, three sizes) with a glowing brew inside, a cork and bubbles.
     Clips: Idle (bubbles; a pickup hovers and turns), Appear, Drop (lands upright and wobbles), Pick up, Drink (the cork pops, the brew
     drains, sparkles rise), Shatter (the glass bursts into shards that settle, the brew splashes into a puddle that soaks away).
   gr-pu-<kind>: a glowing voxel icon for a game power-up, floating, on a pedestal or in a light beam.
     Clips: Idle (hover, turn, pulse, orbiting sparkles), Appear (the beam strikes, the icon grows), Collect (spins up, bursts into sparkles).
   All motion is baked with propAnim, so it plays in the viewer and exports in the GLB. */
FOLDERS['gear'].children.push('gear/potions','gear/powerups');
FOLDERS['gear/potions']={name:'Potions',blurb:'Twelve brews in six bottles: drink and shatter clips',children:[]};
FOLDERS['gear/powerups']={name:'Power-ups',blurb:'Glowing pickups for health, mana, protection, strength, speed and more',children:[]};

/* brews: name, light ramp (hot, light, core, deep, smoke), what it does */
const PO_BREW={health:['Health potion',PAL.bloodGlow,'restores health'],mana:['Mana potion',PAL.soul,'restores mana'],stamina:['Stamina potion',PAL.fel,'restores stamina'],
  strength:['Strength potion',PAL.fire,'more damage for a while'],swift:['Swiftness potion',PAL.storm,'faster movement'],invis:['Invisibility potion',PAL.frost,'turns the drinker unseen'],
  fireres:['Fire resistance potion',PAL.hellfire,'protects from fire'],antidote:['Antidote',PAL.poison,'cures poison'],elixir:['Elixir of life',PAL.holy,'a full heal'],
  shadow:['Shadow draught',PAL.shadow,'shadow powers'],charm:['Charm philtre',PAL.charm,'charms the target'],grave:['Grave draught',PAL.necro,'necrotic powers']};
/* bottles: slabs [width, height, depth] from the bottom (hollow: walls 1 cm, the brew fills the inside up to `fill` of the body), neck, cork */
const PO_BOTTLE={round:['Round flask',[[.09,.016],[.12,.03],[.13,.06],[.12,.03],[.09,.016]],[.036,.05],.7],tall:['Tall vial',[[.05,.012],[.056,.16]],[.03,.03],.8],
  square:['Square bottle',[[.09,.012],[.09,.12]],[.034,.045],.75],cone:['Conical flask',[[.12,.012],[.11,.03],[.09,.03],[.07,.03],[.05,.03]],[.032,.05],.7],
  heart:['Heart flask',null,[.032,.04],.75],jug:['Big jug',[[.12,.014],[.15,.1],[.14,.03],[.1,.02]],[.05,.05],.8]};
const PO_SIZE={small:['Small',.7],medium:['Medium',1],large:['Large',1.35]};
const PO_HEART=['.##.##.','#######','#######','.#####.','..###..','...#...'];

function poBuild(brew,o){const B=PO_BREW[brew],L=B[1],sc=(PO_SIZE[o.size]||PO_SIZE.medium)[1],sh=PO_BOTTLE[o.bottle]||PO_BOTTLE.round,disp=o.display||'ground',kGlow=(GF_STR[o.glow]||GF_STR.medium)[1];
  const root=new THREE.Group();root.userData.lights=[];const item=new THREE.Group();item.name='po_item';root.add(item);const bot=new THREE.Group();bot.name='po_bottle';item.add(bot);bot.scale.setScalar(sc);
  const glass=GI.glass(),liq=ltLiquid(L[2],.86),liqD=ltLiquid(L[3],.9),cork=bm(PAL.wood[2],'leather'),wax=bm(PAL.blood[3],'plain'),paper=bm(PAL.bone[4],'cloth');
  /* the body: glass slabs (an outer skin of four walls per slab and a base), the brew inside as one group that drains from the top */
  const lq=new THREE.Group();lq.name='po_liquid';bot.add(lq);let y=0,slabs=sh[1];
  if(!slabs){slabs=[];const px=.022;for(let r=PO_HEART.length-1;r>=0;r--){const row=PO_HEART[r];const n=row.split('').filter(c=>c==='#').length;slabs.push([n*px,px]);}}
  const body=[];for(const[w,h]of slabs){const d=o.bottle==='heart'?.06:w,t=.008;bx(bot,w,h,t,glass,0,y+h/2,d/2-t/2);bx(bot,w,h,t,glass,0,y+h/2,-d/2+t/2);bx(bot,t,h,d-2*t,glass,w/2-t/2,y+h/2,0);bx(bot,t,h,d-2*t,glass,-w/2+t/2,y+h/2,0);
    body.push([w,h,d,y]);y+=h;}
  bx(bot,slabs[0][0],.008,o.bottle==='heart'?.06:slabs[0][0],glass,0,.004,0);
  const top=y,fillTop=top*sh[3];for(const[w,h,d,y0]of body){if(y0>=fillTop)break;const hh=Math.min(h,fillTop-y0)-(y0===0?.008:0);bx(lq,w-.02,hh,d-.02,y0===0?liqD:liq,0,y0+(y0===0?.008:0)+hh/2,0);}
  const[nw,nh]=sh[2];bx(bot,nw+.006,nh,nw+.006,glass,0,top+nh/2,0);bx(bot,nw+.014,.012,nw+.014,glass,0,top+nh-.006,0);
  const ck=new THREE.Group();ck.name='po_cork';bot.add(ck);ck.position.y=top+nh;bx(ck,nw-.004,.03,nw-.004,cork,0,.005,0);bx(ck,nw+.012,.012,nw+.012,wax,0,-.004,0);
  if(o.bottle==='square'){bx(bot,.07,.06,.004,paper,0,.07,.047);bx(bot,.03,.03,.005,liqD,0,.07,.05);}
  if(o.bottle==='jug'){bx(bot,.02,.08,.02,glass,.085,.07,0);bx(bot,.03,.016,.02,glass,.075,.115,0);bx(bot,.03,.016,.02,glass,.075,.03,0);}
  const W=Math.max(...body.map(b=>b[0])),D=Math.max(...body.map(b=>b[2])),H=top+nh+.035;
  /* bubbles inside the brew, a pool of light, a PointLight */
  const bub=[];for(let i=0;i<6;i++){const m=new THREE.Mesh(SPG,ltLiquid(L[0],.9));m.name='po_bub'+i;m.scale.setScalar(1e-4);bot.add(m);bub.push(m);}
  const pickup=disp==='pickup',restY=pickup?.3:0;item.position.y=restY;
  const pool=new THREE.Mesh(new THREE.PlaneGeometry(1,1),ltAdd(L[2],.45*Math.min(1.4,kGlow),ltPoolTex()));pool.name='po_pool';pool.rotation.x=-Math.PI/2;pool.position.y=.01;pool.scale.setScalar(Math.max(W,D)*sc*3);root.add(pool);
  const lt=new THREE.PointLight(new THREE.Color(L[2]).getHex(),.7*kGlow,2.2,2);lt.position.set(0,H*sc*.5+restY,0);root.add(lt);root.userData.lights.push(lt);
  /* shards (hidden until Shatter), a puddle, sparkles */
  const shards=[];for(let i=0;i<10;i++){const m=new THREE.Mesh(SPG,glass);m.name='po_shard'+i;m.scale.setScalar(1e-4);root.add(m);shards.push(m);}
  const puddle=new THREE.Mesh(SPG,ltLiquid(L[3],.8));puddle.name='po_puddle';puddle.scale.setScalar(1e-4);root.add(puddle);
  const spk=[];for(let i=0;i<12;i++){const m=new THREE.Mesh(SPG,spM(L[i%2])); m.name='po_spark'+i;m.scale.setScalar(1e-4);root.add(m);spk.push(m);}
  /* clips */
  const h=n=>spHash(n*97+hashStr(brew)),inner=W-.03,fillH=fillTop;
  const bubbles=(t,S,speed,D)=>{bub.forEach((m,i)=>{const n=Math.max(1,Math.round(D/(1.1/speed))),x=t/D*n+h(i),u=x-Math.floor(x),c=Math.floor(x);
    const lvl=S.po_liquid?S.po_liquid.s[1]:1,yy=.012+u*(fillH*lvl-.03);S[m.name]={p:[(h(i+c*7)-.5)*inner*.6,yy,(h(i+c*11)-.5)*inner*.6],s:fillH*lvl>.03?.012*(1-u*.4):1e-4};});};
  const pidle=t=>pickup?{p:[0,restY+.03*Math.sin(GF_TAU*t/2),0],r:[0,GF_TAU*t/4,0]}:{p:[0,0,0]};
  const hide=S=>{for(const m of shards)S[m.name]={s:1e-4};S.po_puddle={s:1e-4};for(const m of spk)S[m.name]={s:1e-4};};
  const defs=[{name:'Idle',dur:4,loop:true,fn:(t,S)=>{S.po_item=pidle(t);bubbles(t,S,1,4);S.po_pool={s:[pool.scale.x*(1+.06*Math.sin(GF_TAU*t/2)),pool.scale.y*(1+.06*Math.sin(GF_TAU*t/2)),1],r:[-Math.PI/2,0,0]};hide(S);}},
    {name:'Appear',dur:.9,next:'Idle',fn:(t,S)=>{const u=paClamp(t/.7),s=Math.max(1e-4,Math.sin(u*Math.PI*.5)*(1+.15*Math.sin(u*Math.PI)));S.po_item={p:[0,restY,0],r:[0,GF_TAU*paEase(u),0],s};bubbles(t,S,1,.9);
      S.po_pool={s:[pool.scale.x*u+1e-4,pool.scale.y*u+1e-4,1],r:[-Math.PI/2,0,0]};hide(S);}},
    {name:'Pick up',dur:.9,hold:true,fn:(t,S)=>{const u=paClamp(t/.8);S.po_item={p:[0,restY+.8*paEase(u),0],r:[0,GF_TAU*2*u*u,0],s:Math.max(1e-4,1-paEase(u))};S.po_pool={s:[pool.scale.x*(1-u)+1e-4,pool.scale.y*(1-u)+1e-4,1],r:[-Math.PI/2,0,0]};bubbles(t,S,1,.9);hide(S);}},
    /* drink: the cork pops and falls beside the bottle, the brew drains, sparkles rise from the neck */
    {name:'Drink',dur:2.2,hold:true,fn:(t,S)=>{S.po_item={p:[0,restY,0]};const ct=.25,u=paClamp((t-ct)/.7);
      const cf=paFly(t,{t0:ct,p0:[0,top+nh,0],v:[.35,1.4,.1],rest:(.012-restY)/sc,q0:new THREE.Quaternion(),q1:paQ(Math.PI/2,0,.4)});S.po_cork=cf?{p:cf.p,q:cf.q}:{p:[0,top+nh,0]};
      const lvl=Math.max(.02,1-paEase(paClamp((t-.6)/1.2)));S.po_liquid={p:[0,0,0],s:[1,lvl,1]};bubbles(t,S,3,2.2);
      spk.forEach((m,i)=>{const t0=.6+i*.1,v=paClamp((t-t0)/.8);S[m.name]=t<t0||v>=1?{s:1e-4}:{p:[(h(i)-.5)*.2*v,restY+(top+nh)*sc+v*.6,(h(i+20)-.5)*.2*v],s:.03*Math.sin(Math.PI*v)};});
      for(const m of shards)S[m.name]={s:1e-4};S.po_puddle={s:1e-4};}},
    /* shatter: the glass bursts into shards, the brew splashes into a puddle that soaks away */
    {name:'Shatter',dur:2.4,hold:true,fn:(t,S)=>{const tb=.08;S.po_item={p:[0,restY,0],s:t<tb?1:1e-4};
      shards.forEach((m,i)=>{const a=GF_TAU*h(i),sp=.8+.8*h(i+5),f=paFly(t,{t0:tb,p0:[0,restY+H*sc*(.2+.6*h(i+9)),0],v:[Math.cos(a)*sp,1+h(i+3),Math.sin(a)*sp],rest:.008,q0:new THREE.Quaternion(),q1:paQ(h(i+1)*6,h(i+2)*6,Math.PI/2)});
        S[m.name]=f?{p:f.p,q:f.q,s:[.03*sc*(.6+h(i+4)),.016,.008]}:{s:1e-4};});
      const pu=paClamp((t-.2)/.4),soak=paClamp((t-1.4)/1),r=W*sc*2.2*paEase(pu)*(1-.4*soak);S.po_puddle={p:[0,.004,0],s:t<.2||soak>=1?1e-4:[r,.008*(1-soak)+1e-4,r*.8]};
      spk.forEach((m,i)=>{const a=GF_TAU*i/12,v=paClamp((t-tb)/.6);S[m.name]=t<tb||v>=1?{s:1e-4}:{p:[Math.cos(a)*.4*v,restY+H*sc*.4+.3*v-.4*v*v,Math.sin(a)*.4*v],s:.04*(1-v)};});
      S.po_pool={s:[pool.scale.x*(1-paClamp(t/1))+1e-4,pool.scale.y*(1-paClamp(t/1))+1e-4,1],r:[-Math.PI/2,0,0]};}}];
  if(!pickup)defs.splice(2,0,{name:'Drop',dur:1.4,hold:true,next:'Idle',fn:(t,S)=>{const tl=.45,u=paClamp(t/tl);let y,rz=0,rx=0;
    if(t<tl){y=1.1*(1-u*u);rz=1.2*(1-u);}else{const w=t-tl,e=Math.exp(-w*5);rz=.22*Math.sin(w*18)*e;rx=.1*Math.sin(w*14)*e;y=0;}
    /* tilted, it stands on one edge of its base */y+=Math.abs(Math.sin(rz))*W*sc/2+Math.abs(Math.sin(rx))*D*sc/2;S.po_item={p:[0,y,0],r:[rx,0,rz]};bubbles(t,S,2,1.4);hide(S);}});
  propAnim(root,[item,lq,ck,pool,puddle,...bub,...shards,...spk],defs);
  root.userData.ground=.6;root.userData.variantText=`${B[0]} (${B[2]}): ${(PO_SIZE[o.size]||PO_SIZE.medium)[0].toLowerCase()} ${sh[0].toLowerCase()}${pickup?', as a pickup':''}.`;return root;}

/* ---------- power-ups ---------- */
const PU_KIND={heart:['Health heart',PAL.bloodGlow,'restores health'],mana:['Mana crystal',PAL.soul,'restores mana'],aegis:['Aegis',PAL.holy,'a protective ward'],
  fist:['Strength gauntlet',PAL.fire,'more damage'],bolt:['Swiftness bolt',PAL.storm,'faster movement'],hourglass:['Haste hourglass',PAL.amber,'faster attacks'],
  life:['Extra life',PAL.holy,'one more life'],gem:['Experience gem',PAL.necro,'experience'],coin:['Gold coin',PAL.amber,'gold'],magnet:['Loot magnet',PAL.bloodGlow,'pulls loot in'],
  rage:['Rage orb',PAL.hellfire,'berserk fury'],shadow:['Shadow cloak',PAL.shadow,'turns the player unseen']};
/* pixel icon: rows of '#' (core colour), '+' (light), '-' (deep), extruded d deep, centred, px per pixel */
function puPix(g,rows,px,d,mats,y0=0){const H=rows.length,Wd=Math.max(...rows.map(r=>r.length));rows.forEach((r,ri)=>{for(let c=0;c<r.length;c++){const ch=r[c],m=mats[ch];if(!m)continue;
  bx(g,px,px,ch==='+'?d+.01:d,m,(c-(Wd-1)/2)*px,y0+(H-1-ri)*px,0);}});return[Wd*px,H*px];}
const PU_PIX={heart:['.++.##.','+######','#######','-#####-','..###..','...#...'],
  life:['.++.##.','+######','#######','-#####-','..###..','...#...'],
  bolt:['....++','...##.','..##..','.#####','...##.','..##..','.#....'],
  fist:['.++++.','######','######','+#####','######','.####.','.-##-.'],
  magnet:['##..##','##..##','##..##','##..##','-####-','.-##-.'],
  coin:['..####..','.#++++#.','#+#--#+#','#+-##-+#','#+-##-+#','#+#--#+#','.#++++#.','..####..'],
  hourglass:['######','.+##+.','..##..','..##..','.#--#.','######']};
function puBuild(kind,o){const K=PU_KIND[kind],L=K[1],disp=o.display||'float',kGlow=(GF_STR[o.glow]||GF_STR.medium)[1];
  const root=new THREE.Group();root.userData.lights=[];const item=new THREE.Group();item.name='pu_item';root.add(item);const ic=new THREE.Group();ic.name='pu_icon';item.add(ic);
  const core=spM(L[2]),lite=spM(L[1]),deep=spM(L[3]),hot=spM(L[0]),au=GI.gold(),ag=mcMat(PAL.silver[2],'steel'),mats={'#':core,'+':lite,'-':deep};let size=[.3,.3];
  if(kind==='mana'||kind==='gem'){[[.06,.02],[.12,.05],[.16,.07],[.12,.06],[.07,.05],[.03,.04]].reduce((y,[w,h])=>{const b=bx(ic,w,h,w,y>.08?lite:core,0,y+h/2,0);b.rotation.y=Math.PI/4;return y+h;},0);
    bx(ic,.05,.05,.05,hot,0,.13,.0).rotation.set(Math.PI/4,Math.PI/4,0);size=[.17,.29];}
  else if(kind==='aegis'){const rows=giRound(.15,.04);for(const[w,h,y]of rows)if(w>0)bx(ic,w,h,.03,core,0,y+.15,0);for(const[w,h,y]of giRound(.17,.04))if(w>0){bx(ic,.02,h,.035,au,w/2,y+.15,0);bx(ic,.02,h,.035,au,-w/2,y+.15,0);}
    const dm=bx(ic,.08,.08,.04,lite,0,.15,.02);dm.rotation.z=Math.PI/4;size=[.34,.34];}
  else if(kind==='rage'||kind==='shadow'){const m=kind==='rage'?core:deep;bx(ic,.2,.14,.14,m,0,.1,0);bx(ic,.14,.2,.14,m,0,.1,0);bx(ic,.14,.14,.2,m,0,.1,0);bx(ic,.1,.1,.22,lite,0,.1,0);bx(ic,.08,.08,.08,hot,0,.1,.105);size=[.22,.2];}
  else if(PU_PIX[kind]){const mm=kind==='life'?{'#':au,'+':mcMat(PAL.gold[4],'steel'),'-':GI.goldD()}:kind==='magnet'?{'#':bm(PAL.blood[3],'plain'),'+':ag,'-':bm(PAL.blood[2],'plain')}:kind==='coin'?{'#':au,'+':mcMat(PAL.gold[4],'steel'),'-':GI.goldD()}:kind==='hourglass'?{'#':bm(PAL.wood[1],'leather'),'+':lite,'-':core}:mats;
    size=puPix(ic,PU_PIX[kind],.04,.05,mm);if(kind==='magnet'){bx(ic,.08,.04,.054,ag,-.08,.22,0);bx(ic,.08,.04,.054,ag,.08,.22,0);}
    if(kind==='life')for(const s of[1,-1])[[.12,.18],[.1,.14],[.08,.1]].forEach(([l,y],i)=>bx(ic,l,.03,.02,mcMat(PAL.gold[4],'steel'),s*(.16+l/2-i*.01),y,0,0,0,s*(.35-i*.2)));
    if(kind==='hourglass'){for(const x of[-.11,.11])bx(ic,.02,.24,.02,bm(PAL.wood[1],'leather'),x,.12,0);}}
  /* centre the icon on the item origin */
  {const b=new THREE.Box3().setFromObject(ic),c=b.getCenter(new THREE.Vector3());ic.position.sub(c);}
  const H=disp==='pedestal'?.9:.55;item.position.y=H;
  /* halo: a back-faced additive shell of the icon's bounds */
  const hb=new THREE.Box3().setFromObject(ic),hs=hb.getSize(new THREE.Vector3());const halo=new THREE.Mesh(new THREE.BoxGeometry(hs.x+.08,hs.y+.08,Math.max(.08,hs.z)+.08),ltAdd(L[2],.22*kGlow,null,THREE.BackSide));halo.name='pu_halo';item.add(halo);
  const pool=new THREE.Mesh(new THREE.PlaneGeometry(1,1),ltAdd(L[2],.5*Math.min(1.4,kGlow),ltPoolTex()));pool.name='pu_pool';pool.rotation.x=-Math.PI/2;pool.position.y=disp==='pedestal'?.52:.012;pool.scale.setScalar(.9);root.add(pool);
  let beam=null;if(disp==='beam'){beam=new THREE.Mesh(new THREE.BoxGeometry(.34,2.4,.34),ltAdd(L[1],.3*kGlow,ltBeamTex()));beam.geometry.translate(0,1.2,0);beam.name='pu_beam';root.add(beam);}
  if(disp==='pedestal'){const st=bm(PAL.neutral[3],'plain'),sd=bm(PAL.neutral[2],'plain');bx(root,.5,.1,.5,sd,0,.05,0);bx(root,.34,.32,.34,st,0,.26,0);bx(root,.46,.08,.46,sd,0,.46,0);bx(root,.4,.02,.4,st,0,.51,0);
    for(const[x,z,ry]of[[0,.176,0],[0,-.176,0],[.176,0,Math.PI/2],[-.176,0,Math.PI/2]]){const d=bx(root,.04,.04,.012,spM(L[1]),x,.28,z,0,ry,0);d.rotation.set(0,ry,Math.PI/4,'YXZ');}}
  const lt=new THREE.PointLight(new THREE.Color(L[2]).getHex(),1.1*kGlow,3,2);lt.position.set(0,H,0);root.add(lt);root.userData.lights.push(lt);
  /* sparkles orbiting, and a burst for Collect */
  const orb=[];for(let i=0;i<8;i++){const m=new THREE.Mesh(SPG,i%2?hot:lite);m.name='pu_orb'+i;m.scale.setScalar(1e-4);root.add(m);orb.push(m);}
  const burst=[];for(let i=0;i<16;i++){const m=new THREE.Mesh(SPG,i%3?lite:hot);m.name='pu_burst'+i;m.scale.setScalar(1e-4);root.add(m);burst.push(m);}
  const R=Math.max(size[0],size[1])*.7+.08,h=n=>spHash(n*31+hashStr(kind));
  const orbit=(t,S,D,k=1)=>{const steps=Math.max(1,Math.round(D*.35*8));orb.forEach((m,i)=>{const a=GF_TAU*(i/8+(steps/8)*t/D),yy=H+Math.sin(GF_TAU*(Math.round(D/2)||1)*t/D+i)*.12;S[m.name]={p:[Math.cos(a)*R*k,yy,Math.sin(a)*R*k],s:k>0?.025*(.7+.3*Math.sin(GF_TAU*t/D*Math.max(1,Math.round(D))+i)):1e-4};});};
  const nob=S=>burst.forEach(m=>S[m.name]={s:1e-4});
  const defs=[{name:'Idle',dur:4,loop:true,fn:(t,S)=>{const pul=1+.06*Math.sin(GF_TAU*t/1);S.pu_item={p:[0,H+.05*Math.sin(GF_TAU*t/2),0],r:[0,GF_TAU*t/4,0],s:pul};orbit(t,S,4);nob(S);
      S.pu_pool={s:[.9*(1+.1*Math.sin(GF_TAU*t/2)),.9*(1+.1*Math.sin(GF_TAU*t/2)),1],r:[-Math.PI/2,0,0]};if(beam)S.pu_beam={s:[1+.08*Math.sin(GF_TAU*t/1),1,1+.08*Math.sin(GF_TAU*t/1)]};}},
    {name:'Appear',dur:1.1,next:'Idle',fn:(t,S)=>{const b=paClamp(t/.3),u=paClamp((t-.25)/.7),s=Math.max(1e-4,Math.sin(u*Math.PI*.5)*(1+.2*Math.sin(u*Math.PI)));S.pu_item={p:[0,H,0],r:[0,GF_TAU*1.5*paEase(u),0],s};orbit(t,S,1.1,u);nob(S);
      S.pu_pool={s:[.9*b+1e-4,.9*b+1e-4,1],r:[-Math.PI/2,0,0]};if(beam)S.pu_beam={s:[Math.max(1e-4,1.6-.6*b),Math.max(1e-4,b),Math.max(1e-4,1.6-.6*b)]};}},
    {name:'Collect',dur:1.2,hold:true,fn:(t,S)=>{const u=paClamp(t/.45),v=paClamp((t-.4)/.7);S.pu_item={p:[0,H+.25*paEase(u),0],r:[0,GF_TAU*3*u*u,0],s:Math.max(1e-4,(1+.3*u)*(t<.45?1:1-paClamp((t-.45)/.08)))};
      orbit(t,S,1.2,Math.max(0,1-u*1.5));burst.forEach((m,i)=>{const a=GF_TAU*i/16,e=(h(i)-.5)*1.2;S[m.name]=t<.45||v>=1?{s:1e-4}:{p:[Math.cos(a)*v*.7,H+.25+e*v*.6+.2*v-.3*v*v,Math.sin(a)*v*.7],s:.035*(1-v)};});
      S.pu_pool={s:[.9*(1-paClamp(t/1))+1e-4,.9*(1-paClamp(t/1))+1e-4,1],r:[-Math.PI/2,0,0]};if(beam)S.pu_beam={s:[Math.max(1e-4,1-paClamp((t-.4)/.5)),1,Math.max(1e-4,1-paClamp((t-.4)/.5))]};}}];
  propAnim(root,[item,pool,...orb,...burst].concat(beam?[beam]:[]),defs);
  root.userData.ground=.6;root.userData.variantText=`${K[0]}: ${K[2]}; ${({float:'floating',pedestal:'on a pedestal',beam:'in a light beam'})[disp]}.`;return root;}

/* registration */
for(const[k,[name,,what]]of Object.entries(PO_BREW)){const opts=[{key:'bottle',label:'Bottle',choices:Object.entries(PO_BOTTLE).map(([b,v])=>[b,v[0]]),def:'round'},{key:'size',label:'Size',choices:grCh(PO_SIZE),def:'medium'},
  {key:'display',label:'Display',choices:[['ground','On the ground'],['pickup','Pickup (hovering)']],def:'ground'},{key:'glow',label:'Glow',choices:Object.entries(GF_STRN),def:'medium'}];
  ASSETS.push({id:'gr-potion-'+k,folder:'gear/potions',name,opts,build:(sd,o)=>poBuild(k,Object.assign({bottle:'round',size:'medium',display:'ground',glow:'medium'},o||{})),
    desc:`${name}: ${what}. A hollow glass bottle with a glowing brew, a waxed cork and bubbles; six bottles (round flask, tall vial, square bottle, conical flask, heart flask, big jug) in three sizes. Clips: Idle, Appear, Drop, Pick up, Drink (the cork pops, the brew drains), Shatter (shards and a puddle).`});}
for(const[k,[name,,what]]of Object.entries(PU_KIND)){const opts=[{key:'display',label:'Display',choices:[['float','Floating'],['pedestal','On a pedestal'],['beam','In a light beam']],def:'float'},{key:'glow',label:'Glow',choices:Object.entries(GF_STRN),def:'medium'}];
  ASSETS.push({id:'gr-pu-'+k,folder:'gear/powerups',name,opts,build:(sd,o)=>puBuild(k,Object.assign({display:'float',glow:'medium'},o||{})),
    desc:`${name}: a power-up (${what}). A glowing voxel icon that hovers, turns and pulses with orbiting sparkles, floating, on a stone pedestal or in a light beam. Clips: Idle, Appear (the light strikes, the icon grows), Collect (spins up and bursts into sparkles).`});}
