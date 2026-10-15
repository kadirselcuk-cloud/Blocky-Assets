/* ======================= WASTELAND KIT: ruined castle (wl-ruin-) =======================
   Walls are 4 m long (10 columns of 0.4 m) and 1.2 m thick, centred on the grid line, outside towards +z.
   Row 0 is a thicker plinth course; the body reaches the wall walk at 4.4 m; parapet and merlons on the outer edge reach 5.6 m.
   Every wall has the same merlon rhythm (1.2 m merlon, 0.8 m gap), so runs of walls continue the pattern.
   Pillars and tower stubs sit on the grid vertices and hide the wall ends that meet there. */
VXD.ruin=(P,r)=>{const tone=[];for(let i=0;i<8;i++)tone.push(['#7a7468','#857e70','#6e695f','#8c8576','#67635a','#7e7666'][Math.floor(r()*6)]);
  for(let y=0;y<16;y++){const row=y>>2,off=(row%2)*4;for(let x=0;x<16;x++){const id=row*2+(((x+off)>>3)&1),m=y%4===3||(x+off)%8===7;P(x,y,m?'#45423c':tone[id],m?nz(r,.9,1.05):nz(r,.86,1.06)*(r()<.05?.82:1));}}};
VXD.ruinDark=(P,r)=>{const tone=[];for(let i=0;i<8;i++)tone.push(['#56524b','#5e5a52','#4c4944','#635e55'][Math.floor(r()*4)]);
  for(let y=0;y<16;y++){const row=y>>2,off=(row%2)*4;for(let x=0;x<16;x++){const id=row*2+(((x+off)>>3)&1),m=y%4===3||(x+off)%8===7;P(x,y,m?'#2e2c29':tone[id],m?nz(r,.9,1.05):nz(r,.86,1.06));}}};
VXD.ruinFloor=(P,r)=>{const tone=[];for(let i=0;i<8;i++)tone.push(nz(r,.84,1.08));for(let y=0;y<16;y++){const row=y>>3,off=(row%2)*4;for(let x=0;x<16;x++){const id=row*2+(((x+off)>>3)&1),j=y%8===7||(x+off)%8===7;
  P(x,y,j?(r()<.35?'#5a6a34':'#4a4840'):'#8a857a',j?nz(r,.9,1.05):tone[id]*nz(r,.92,1.05));}}};
VXD.statue=(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,r()<.12?'#5e5a52':'#76726a',nz(r,.9,1.06));};
FOLDERS['wasteland/ruins']={name:'Ruined castle',blurb:'Modular castle walls, pillars, towers, gateway, keep and ruin props; worn, cracked or mossy',children:[]};
const RU_C=.4,RU_T=1.2,RU_FULL=11;
const RU_WEAR={key:'wear',label:'Condition',choices:[['clean','Weathered'],['cracked','Cracked'],['mossy','Mossy'],['both','Cracked and mossy']],def:'clean'};
function ruBox(par,w,h,d,mat,x,y,z,ox,oy){const m=box(w,h,d,mat,{s:.8,ox,oy,oz:0});put(par,m,x,y,z);return m;}
/* masonry from a cell grid G(col,row): horizontal runs per row, grown upwards; row 0 is the plinth course (0.2 m thicker, darker) */
function ruGrid(par,nc,nr,G,o={}){const c=RU_C,t=o.t??RU_T,L=nc*c,used=[];for(let r=0;r<nr;r++)used.push(new Array(nc).fill(false));
  for(let r=0;r<nr;r++)for(let i=0;i<nc;i++){if(used[r][i]||!G(i,r))continue;let j=i;while(j+1<nc&&G(j+1,r)&&!used[r][j+1])j++;let r2=r;
    if(r>0||o.noPlinth)while(r2+1<nr){let ok=true;for(let k=i;k<=j;k++)if(!G(k,r2+1)||used[r2+1][k]){ok=false;break;}if(!ok)break;r2++;}
    for(let rr=r;rr<=r2;rr++)for(let k=i;k<=j;k++)used[rr][k]=true;
    const w=(j-i+1)*c,h=(r2-r+1)*c,x0=-L/2+i*c,y0=r*c,pl=r===0&&!o.noPlinth;ruBox(par,w,h,pl?t+.2:t,pl?(o.pmat||vm('ruinDark')):(o.mat||vm('ruin')),x0+w/2,y0+h/2,o.z||0,x0,y0);}}
/* wear on one face (face plane at z = fz, sd = which side): crack chains, moss patches, ivy */
function ruCracks(par,nc,G,top,r,n,fz,sd){const c=RU_C,L=nc*c;for(let k=0;k<n;k++){let i=Math.floor(r()*nc),row=top(i)-1;if(row<3)continue;let x=-L/2+i*c+c/2+(r()-.5)*.2;const steps=6+Math.floor(r()*8);
  for(let s=0;s<steps&&row>=1;s++){const ci=Math.floor((x+L/2)/c);if(ci<0||ci>=nc||!G(ci,row))break;bx(par,.06,.22,.02,vm('dark'),x,row*c+c*.75-(s%2)*.2,sd*(fz+.01));x+=(r()<.5?-1:1)*.06;if(s%2)row--;}}}
function ruMossFace(par,nc,G,r,n,fz,sd){const c=RU_C,L=nc*c;for(let k=0;k<n;k++){const i=Math.floor(r()*nc),w=1+Math.floor(r()*3),row=1+Math.floor(r()*3),h=1+Math.floor(r()*2);let ok=true;
  for(let a=i;a<i+w;a++)for(let b=row;b<row+h;b++)if(a>=nc||!G(a,b))ok=false;if(!ok)continue;const ww=w*c-.06-r()*.1,hh=h*c-.06-r()*.1;bx(par,ww,hh,.02,vm('moss'),-L/2+(i+w/2)*c,(row+h/2)*c,sd*(fz+.01));}}
function ruIvy(par,nc,G,top,r,n,fz,sd){const c=RU_C,L=nc*c,lv=vm('oakLeaves');for(let k=0;k<n;k++){const i=Math.floor(r()*nc);let row=top(i)-1;if(row<5)continue;let x=-L/2+i*c+c/2,y=row*c+c*.6;const steps=6+Math.floor(r()*8);
  for(let s=0;s<steps;s++){const ci=Math.floor((x+L/2)/c),cr=Math.floor(y/c);if(ci<0||ci>=nc||cr<1||!G(ci,cr))break;bx(par,.28,.28,.06,lv,x,y,sd*(fz+.03));if(r()<.4){const ox=x+(r()<.5?-.24:.24),oc=Math.floor((ox+L/2)/c);if(oc>=0&&oc<nc&&G(oc,cr))bx(par,.18,.18,.05,lv,ox,y-.06,sd*(fz+.025));}
    x=Math.max(-L/2+.16,Math.min(L/2-.16,x+(r()-.5)*.24));y-=.26;}}}
function ruCapsMoss(par,caps,r,p=.6){for(const[x,y,w,d,z]of caps)if(r()<p){const dm=d*(.5+r()*.5);bx(par,w,.06,dm,vm('moss'),x,y+.03,z+(r()-.5)*(d-dm));}}
/* loose stones lying at the foot of a face */
function ruFootStones(par,L,fz,r,n){for(let k=0;k<n;k++){const sd=r()<.6?1:-1,s=.16+r()*.26,h=s*(.6+r()*.4);bx(par,s*(1+r()*.4),h,s,vm(r()<.7?'ruin':'ruinDark'),(r()-.5)*L*.9,h/2,sd*(fz+.3+r()*.8),0,r()*3,0);}}
function ruTufts(par,L,fz,r,n){for(let k=0;k<n;k++){const sd=r()<.5?1:-1;wlTuft(par,(r()-.5)*L,0,sd*(fz+.25+r()*.5),r,r()<.5);}}
function ruApplyWear(root,wear,nc,G,top,caps,r,t=RU_T,noFoot){const L=nc*RU_C,crk=wear==='cracked'||wear==='both',mos=wear==='mossy'||wear==='both';
  if(crk){ruCracks(root,nc,G,top,r,Math.max(1,Math.round(nc/5)),t/2,1);ruCracks(root,nc,G,top,r,Math.max(1,Math.round(nc/7)),t/2,-1);if(!noFoot)ruFootStones(root,L,t/2,r,3+Math.floor(nc/3));}
  if(mos){ruCapsMoss(root,caps,r);ruMossFace(root,nc,G,r,2+Math.floor(nc/4),t/2,1);ruMossFace(root,nc,G,r,1+Math.floor(nc/5),t/2,-1);ruIvy(root,nc,G,top,r,1+Math.floor(nc/8),t/2,1);ruIvy(root,nc,G,top,r,nc>12?1:0,t/2,-1);
    for(let k=0;k<Math.floor(nc/2);k++)if(r()<.6){const i=Math.floor(r()*nc);if(G(i,0)&&!G(i,1)===false)bx(root,RU_C,.04,.1,vm('moss'),-L/2+i*RU_C+RU_C/2,RU_C+.02,(r()<.5?1:-1)*(t/2+.05));}
    ruTufts(root,L,t/2,r,4+Math.floor(nc/3));}
  if(!crk&&!mos)ruTufts(root,L,t/2,r,2);}

/* ---------- the wall builder: o.prof(i,r) = rows per column, o.hole(i,row) = openings, o.mound = rubble mounds [[x,R],…] ---------- */
function ruWall(o){return(s,op)=>{const wear=(op&&op.wear)||'clean',root=wlRoot(o.g||4.8),r=mulberry32(hashStr(o.key)+(s||1)*7919),nc=10,c=RU_C,t=RU_T,L=nc*c,F=RU_FULL;
  let side=(op&&op.side)==='right'?-1:1;const prof=[];for(let i=0;i<nc;i++)prof.push(o.prof?o.prof(side>0?i:nc-1-i,r):F);
  const crk=wear==='cracked'||wear==='both';if(crk&&!o.prof)prof[2+Math.floor(r()*6)]=F-1;
  const hole=o.hole||(()=>false),G=(i,row)=>row<prof[i]&&!hole(i,row),top=i=>prof[i],caps=[];
  ruGrid(root,nc,16,G,{t});
  let i=0;const skip=crk&&!o.prof?Math.floor(r()*2):-1;
  while(i<nc){if(prof[i]<F){if(!hole(i,prof[i]-1))caps.push([-L/2+i*c+c/2,prof[i]*c,c,t,0]);i++;continue;}let j=i;while(j+1<nc&&prof[j+1]>=F)j++;
    const x0=-L/2+i*c,w=(j-i+1)*c;ruBox(root,w,.4,.4,vm('ruin'),x0+w/2,F*c+.2,t/2-.2,x0,F*c);caps.push([x0+w/2,F*c,w,t-.4,-.2]);
    let k=i,mi=0;while(k<=j){if(k%5>=3){caps.push([-L/2+k*c+c/2,F*c+.4,c,.4,t/2-.2]);k++;continue;}let m=k;while(m+1<=j&&(m+1)%5<3)m++;const mx0=-L/2+k*c,mw=(m-k+1)*c;
      if(mi++!==skip){ruBox(root,mw,.8,.4,vm('ruin'),mx0+mw/2,F*c+.8,t/2-.2,mx0,F*c+.4);caps.push([mx0+mw/2,F*c+1.2,mw,.4,t/2-.2]);}else{caps.push([mx0+mw/2,F*c+.4,mw,.4,t/2-.2]);ruFootStones(root,mw,t/2,r,2);}k=m+1;}
    i=j+1;}
  if(o.sill)for(const[a,b,row]of o.sill)bx(root,(b-a+1)*c+.2,.1,.18,vm('ruinDark'),-L/2+(a+b+1)/2*c,row*c-.05,t/2+.09);
  if(o.mound)for(const[mx,R]of o.mound)wlMound(root,mx*side,0,R,r,vm('ruin'),(px,pz,y)=>{if(Math.abs(px)>L/2-.2)return true;const ci=Math.floor((px+L/2)/c);return Math.abs(pz)<(y<c?(t+.2)/2:t/2)&&ci>=0&&ci<nc&&prof[ci]>Math.floor(y/c);});
  if(o.extra)o.extra(root,r,side);
  ruApplyWear(root,wear,nc,G,top,caps,r);return root;};}
const ruW=(id,name,o,desc,extraOpts=[])=>WL('ruin-'+id,'ruins',name,ruWall(Object.assign({key:id},o)),desc+' 4 m long, 1.2 m thick, centred on the grid line, outside towards +z.',{opts:[RU_WEAR,...extraOpts],variants:true,defaultSeed:1});
ruW('wall','Castle wall',{},'Intact stretch of old castle wall: dark plinth course, weathered stone body up to a 4.4 m wall walk, parapet and merlons on the outside.');
ruW('wall-slit','Castle wall with slits',{hole:(i,row)=>(i===2||i===7)&&row>=4&&row<=6},'Castle wall pierced by two plain arrow slits, open right through.');
ruW('wall-window','Castle wall with window',{hole:(i,row)=>(i>=3&&i<=6&&row>=4&&row<=8)||((i===4||i===5)&&row===9),sill:[[3,6,4]]},'Castle wall with a tall stepped-arch window and a stone sill.');
ruW('wall-door','Castle wall with doorway',{hole:(i,row)=>(i>=3&&i<=6&&row<=6)||((i===4||i===5)&&row===7)},'Castle wall with a stepped-arch doorway 1.6 m wide and 3.2 m high, open at ground level.');
ruW('gateway','Ruined gateway',{hole:(i,row)=>(i>=2&&i<=7&&row<=7)||(i>=3&&i<=6&&row===8)||((i===4||i===5)&&row===9)},'Castle gateway: a 2.4 m wide, 4 m high stepped arch through the wall, open at ground level.');
ruW('wall-breach','Breached wall',{prof:i=>[11,11,9,6,3,2,3,5,8,11][i],mound:[[0,1.7]]},'Castle wall smashed open in a V-shaped breach down to 0.8 m, a mound of fallen stones heaped through the gap on both sides.');
ruW('wall-low','Tumbled wall',{prof:(i,r)=>{const b=[3,4,3,2,3,5,4,3,2,3];return b[i]+(r()<.3?1:0);},mound:[[-1,.8],[1.2,.7]]},'Wall tumbled down to 0.8–2 m, ragged top, fallen stones on both sides. Use it for long ruined stretches.');
ruW('wall-end','Broken wall end',{prof:i=>[11,11,11,10,8,7,5,4,3,2][i],mound:[[1.4,1]]},'Transition from full height to a stump: full wall at one end, stepping down to a heap of stones at the other.',[{key:'side',label:'High end',choices:[['left','Left (-x)'],['right','Right (+x)']],def:'left'}]);

/* ---------- vertex pieces: pillar and round tower stub ---------- */
function ruCols(par,cells,c,mat,ox0=0){const rows=new Map();for(const q of cells){const k=q.z.toFixed(2)+'|'+q.y0.toFixed(2)+'|'+q.h.toFixed(2);(rows.get(k)||rows.set(k,[]).get(k)).push(q);}
  for(const list of rows.values()){list.sort((a,b)=>a.x-b.x);let s=0;while(s<list.length){let e=s;while(e+1<list.length&&Math.abs(list[e+1].x-list[e].x-c)<1e-4)e++;const x0=list[s].x-c/2,w=(e-s+1)*c,q=list[s];
    const m=box(w,q.h,c,q.mat||mat,{s:.8,ox:x0+ox0,oy:q.y0,oz:q.z});put(par,m,x0+w/2,q.y0+q.h/2,q.z);s=e+1;}}}
function ruPillar(s,op){const wear=(op&&op.wear)||'clean',broken=(op&&op.state)==='broken',root=wlRoot(3.2),r=mulberry32((s||1)*613+(broken?5:0)),c=RU_C;
  ruBox(root,2,.4,2,vm('ruinDark'),0,.2,0,-1,0);const cells=[],caps=[],HP=[];for(let i=0;i<4;i++){HP.push([]);for(let k=0;k<4;k++)HP[i].push(broken?Math.max(5,Math.round(13-(i+k)*1.1-r()*2.5)):13);}const hAt=(i,k)=>HP[i][k];
  for(let i=0;i<4;i++)for(let k=0;k<4;k++){const x=-.6+i*c,z=-.6+k*c,h=hAt(i,k);cells.push({x,z,y0:.4,h:h*c});caps.push([x,.4+h*c,c,c,z]);}ruCols(root,cells,c,vm('ruin'));
  if(!broken){ruBox(root,1.8,.4,1.8,vm('ruinDark'),0,5.8,0,-.9,5.6);ruBox(root,1.2,.4,1.2,vm('ruin'),0,6.2,0,-.6,6);ruBox(root,.6,.4,.6,vm('ruin'),0,6.6,0,-.3,6.4);caps.length=0;caps.push([0,6.8,.6,.6,0],[0,6.4,1.2,.3,.45],[0,6,1.8,.3,.75]);}
  else wlRubble(root,.9,.9,6,r,.9,[vm('ruin'),vm('ruinDark')],.35);
  for(let f=0;f<4;f++){const g=new THREE.Group();put(root,g,0,0,0,0,f*Math.PI/2,0);const top=i=>{const a=[[i,3],[3,3-i],[3-i,0],[0,i]][f];return 1+hAt(a[0],a[1]);};
    const G=(i,row)=>row<top(i);if(wear==='cracked'||wear==='both')ruCracks(g,4,G,top,r,1,.8,1);if(wear==='mossy'||wear==='both'){ruMossFace(g,4,G,r,1,.8,1);if(f===1)ruIvy(g,4,G,top,r,1,.8,1);}}
  if(wear==='mossy'||wear==='both'){ruCapsMoss(root,caps,r,.7);ruTufts(root,1.6,1,r,4);}else ruTufts(root,1.6,1,r,2);return root;}
function ruTower(s,op){const wear=(op&&op.wear)||'clean',broken=(op&&op.state)!=='intact',root=wlRoot(4),r=mulberry32((s||1)*631),c=RU_C,R=2.2,N=Math.ceil(R/c),cells=[],caps=[],gapA=r()*6.28,SH=[];for(let k=0;k<16;k++)SH.push(Math.round(11+2.5*Math.sin(k*.8+r()*6)+r()*2));
  const plinth=[];for(let i=-N-1;i<=N;i++)for(let k=-N-1;k<=N;k++){const x=(i+.5)*c,z=(k+.5)*c,d=Math.hypot(x,z);if(d<R+.2)plinth.push({x,z,y0:0,h:.4,mat:vm('ruinDark')});
    if(d>=R)continue;const a=Math.atan2(z,x);let h;if(broken){const sec=((Math.round(a/(Math.PI/8))%16)+16)%16,da=Math.abs(Math.atan2(Math.sin(a-gapA),Math.cos(a-gapA)));h=SH[sec]-(da<.9?Math.round(7*(1-da/.9)):0);h=Math.max(3,h)-(d<R-.9?3:0)-(d<R-1.7?2:0);h=Math.max(2,h);}
    else h=d>R-c*1.5?(((Math.round(a/(Math.PI/8))+16)%2)?20:18):17;cells.push({x,z,y0:.4,h:h*c});caps.push([x,.4+h*c,c,c,z]);}
  ruCols(root,plinth,c,vm('ruinDark'));ruCols(root,cells,c,vm('ruin'));
  /* the voxel circle has a flat 2.4 m face at 2 m on each axis: slits, cracks and moss go there */
  const AX=[0,1,2,3].map(k=>{const a=k*Math.PI/2,ca=Math.round(Math.cos(a)),sa=Math.round(Math.sin(a));return{a,ca,sa,h:cells.filter(q=>(q.x*ca+q.z*sa)>1.7&&Math.abs(q.x*sa-q.z*ca)<1.2).reduce((m,q)=>Math.min(m,q.y0+q.h),99)};});
  AX.forEach((A,k)=>{for(const y of[2.2,4.6])if(A.h>y+1&&(k+(y>3?1:0))%2===0){const sl=vSlit(root,A.ca*2.03,y,A.sa*2.03,Math.PI/2-A.a);sl.children[0].scale.set(1.6,1,1);}});
  if(broken)wlRubble(root,Math.cos(gapA)*(R+.9),Math.sin(gapA)*(R+.9),10,r,1,[vm('ruin'),vm('ruinDark')],.4);
  if(wear==='mossy'||wear==='both'){ruCapsMoss(root,caps,r,.55);for(const A of AX)for(let k=0;k<2;k++){const w=.5+r()*.5,h=.3+r()*.4,u=(r()-.5)*(2.2-w),y=.5+r()*1.2;if(y+h/2<A.h)bx(root,A.sa?w:.04,h,A.sa?.04:w,vm('moss'),A.ca*2.02+A.sa*u,y,A.sa*2.02+A.ca*u);}ruTufts(root,4,R,r,8);}
  if(wear==='cracked'||wear==='both')for(const A of AX){if(A.h<2)continue;const g=new THREE.Group();put(root,g,0,0,0,0,Math.PI/2-A.a,0);const top=()=>Math.floor(A.h/c);ruCracks(g,5,()=>true,top,r,1,2,1);}
  ruTufts(root,4,R,r,3);return root;}
WL('ruin-pillar','ruins','Corner pillar',ruPillar,'Square buttress pillar for a grid vertex, 1.6 m with a 2 m plinth: hides the wall ends that meet there. Intact with a stepped cap, or broken into a jagged stump with fallen stones.',{opts:[{key:'state',label:'State',choices:[['intact','Intact'],['broken','Broken']],def:'intact'},RU_WEAR],variants:true,defaultSeed:1});
WL('ruin-tower','ruins','Tower stump',ruTower,'Round solid tower, 4.4 m across, for a grid vertex where walls meet. Broken: ragged top with one side fallen into a heap of stones; intact: 7 m with a crenellated rim. Arrow slits where the stone is high enough.',{opts:[{key:'state',label:'State',choices:[['broken','Broken'],['intact','Intact']],def:'broken'},RU_WEAR],variants:true,defaultSeed:1});

/* ---------- ruined keep: standalone 8 × 8 m shell (2 × 2 cells, centred on a vertex) ---------- */
function ruKeep(s,op){const wear=(op&&op.wear)||'mossy',root=wlRoot(7.6),r=mulberry32((s||1)*641),c=RU_C,t=RU_T,H=20;
  const face=(nc,ry,x,z,prof,hole)=>{const g=new THREE.Group();put(root,g,x,0,z,0,ry,0);const P=[];for(let i=0;i<nc;i++)P.push(prof(i));const G=(i,row)=>row<P[i]&&!(hole&&hole(i,row)),caps=[];
    ruGrid(g,nc,H+2,G,{t});for(let i=0;i<nc;i++)if(!(hole&&hole(i,P[i]-1)))caps.push([-nc*c/2+i*c+c/2,P[i]*c,c,t,0]);ruApplyWear(g,wear,nc,G,i=>P[i],caps,r,t,true);return P;};
  const jag=(b,a)=>i=>b+Math.round(Math.sin(i*1.7+a)*1.5+Math.cos(i*.9+a*2));
  const FP=face(20,0,0,3.4,i=>i<14?jag(18,1)(i):[16,13,10,8,6,4][i-14],(i,row)=>(i>=8&&i<=11&&row<=6)||((i===9||i===10)&&row===7)||((i===3||i===4)&&row>=11&&row<=14));
  face(20,Math.PI,0,-3.4,i=>jag(18,2)(i)-(i>=7&&i<=9?3:0),(i,row)=>(i===5||i===14)&&row>=12&&row<=14);
  const RP=face(14,Math.PI/2,3.4,0,i=>i<6?[3,5,7,9,12,15][i]:jag(18,3)(i),(i,row)=>(i===9||i===10)&&row>=11&&row<=14);
  face(14,-Math.PI/2,-3.4,0,jag(18,4),(i,row)=>(i===6||i===7)&&row>=4&&row<=6);
  for(let i=0;i<7;i++)for(let k=1;k<7;k++){const x=-2.4+i*.8,z=-2.4+k*.8;if(((i+k*3)%5===0&&r()<.7)||(x>.6&&z>.6))continue;bx(root,.8,.1,.8,vm('ruinFloor'),x,.05,z);}
  const wallH=(px,pz)=>{let h=0;if(pz>2.6&&pz<4.2&&Math.abs(px)<4.1)h=Math.max(h,FP[Math.max(0,Math.min(19,Math.floor((px+4)/c)))]*c);if(px>2.6&&px<4.2&&Math.abs(pz)<2.9)h=Math.max(h,RP[Math.max(0,Math.min(13,Math.floor((2.8-pz)/c)))]*c);
    if(px<-2.6||pz<-2.6)h=99;return h;};
  wlMound(root,2.4,2.6,1.9,r,vm('ruin'),(px,pz,y)=>Math.abs(px)>4.6||Math.abs(pz)>4.6||y<wallH(px,pz)+.01);
  wlRubble(root,4.8,4.6,9,r,1.2,[vm('ruin'),vm('ruinDark')],.4);
  const bm=vm('planksDark');for(const z of[0,-1.6]){vlog(root,6.2,.3,.3,'x',0,4.15,z);}wlBeam(root,[-3.1,4.1,1.6],[1.8,.15,1.4],.3,bm);
  for(let i=0;i<7;i++){if(i===2||i===5)continue;bx(root,.5,.08,2.1,vm('planks'),-2.6+i*.55+(r()-.5)*.04,4.34,-.85,0,(r()-.5)*.06,0);}
  for(let i=0;i<10;i++){const h=(i+1)*.4;ruBox(root,.5,h,1,vm('ruin'),-2.55+i*.5,h/2,-2.3,-2.8+i*.5,0);}
  bx(root,.8,.06,.3,vm('planks'),1.2,.03,.6,0,.4,0);wlBones(5).children.forEach(q=>{const p=q.clone();p.position.x-=1;p.position.z+=.6;root.add(p);});
  return root;}
WL('ruin-keep','ruins','Ruined keep',ruKeep,'Roofless shell of a square keep, 8 × 8 m (two cells by two, centred on a grid vertex) and up to 8 m high: doorway and windows, the front-right corner collapsed into a heap, a stone stair along the back wall, two floor beams with half the upper floor left and a fallen beam.',{opts:[Object.assign({},RU_WEAR,{def:'mossy'})],variants:true,defaultSeed:1});

/* ---------- stairs, column, arch, rubble, statue ---------- */
function ruStairs(s,op){const wear=(op&&op.wear)||'clean',root=wlRoot(3.6),r=mulberry32((s||1)*653),n=11,run=4/n,caps=[];
  for(let i=0;i<n;i++){const h=(i+1)*.4,x0=-2+i*run;ruBox(root,run,h,1.6,vm('ruin'),x0+run/2,h/2,-RU_T/2-.8,x0,0);caps.push([x0+run/2,h,run,1.6,-RU_T/2-.8]);}
  if(wear==='mossy'||wear==='both'){ruCapsMoss(root,caps,r,.45);for(let k=0;k<4;k++)wlTuft(root,-1.8+r()*3.6,0,-RU_T/2-1.8-r()*.4,r,r()<.5);}
  if(wear==='cracked'||wear==='both')for(let k=0;k<3;k++){const i=3+Math.floor(r()*7);bx(root,.06,.2,.02,vm('dark'),-2+i*run+run/2,(i+.5)*.4,-RU_T/2-1.61);}
  return root;}
function ruColumn(s,op){const st=(op&&op.state)||'standing',wear=(op&&op.wear)||'clean',root=wlRoot(3),r=mulberry32((s||1)*659),sm=vm('statue'),dk=vm('ruinDark');
  bx(root,1.2,.4,1.2,dk,0,.2,0);bx(root,1,.2,1,sm,0,.5,0);const drum=(par,y,h)=>vDisc(par,0,0,.42,y,h,sm,.2);
  const hs=st==='standing'?4:st==='broken'?1.6+r()*1.2:.6;drum(root,.6,hs);
  if(st==='standing'){bx(root,1,.2,1,sm,0,4.7,0);bx(root,1.2,.3,1.2,dk,0,4.95,0);if(wear==='mossy'||wear==='both')bx(root,1,.06,.8,vm('moss'),.05,5.13,0);}
  else{for(let k=0;k<3;k++){const a=r()*6.28,d=.12+r()*.15;bx(root,.2,.1+r()*.2,.2,sm,Math.cos(a)*d,.6+hs+.05,Math.sin(a)*d);}
    const n=st==='broken'?2:4,L=st==='broken'?1:1.1,ang=r()*6.28;for(let k=0;k<n;k++){const g=new THREE.Group();put(root,g,Math.cos(ang)*(1.3+k*(L+.1)),.42,Math.sin(ang)*(1.3+k*(L+.1)),0,-ang,Math.PI/2);drum(g,-L/2,L);}
    if(st==='fallen'){const g=new THREE.Group();const d=1.3+n*(L+.1)+.2;put(root,g,Math.cos(ang)*d,.6,Math.sin(ang)*d,0,-ang,0);bx(g,.3,1.2,1.2,dk,0,0,0);}}
  if(wear==='mossy'||wear==='both'){bx(root,.5,.03,.1,vm('moss'),.2,.41,.55);ruTufts(root,1.4,.6,r,5);}if(wear==='cracked'||wear==='both')bx(root,.05,.6,.02,vm('dark'),.1,1.4,.43);return root;}
function ruArch(s,op){const wear=(op&&op.wear)||'clean',broken=(op&&op.state)!=='intact',root=wlRoot(4),r=mulberry32((s||1)*661),c=RU_C,nc=12,t=.8;
  const G=(i,row)=>{const x=-2.4+i*c+c/2,y=row*c+c/2;if(Math.abs(x)>=1.6)return row<(broken&&x>0?8:12);if(row>13)return false;const d=Math.hypot(x,y-3.6);if(y<3.6||d<1.6)return false;if(broken&&x>.4)return false;return true;};
  ruGrid(root,nc,15,G,{t});const top=i=>{let h=0;for(let row=0;row<15;row++)if(G(i,row))h=row+1;return h;},caps=[];for(let i=0;i<nc;i++)caps.push([-2.4+i*c+c/2,top(i)*c,c,t,0]);
  if(broken)wlMound(root,1,0,1.1,r,vm('ruin'),(px,pz)=>Math.abs(px)>=1.4&&Math.abs(pz)<.6);ruApplyWear(root,wear,nc,G,top,caps,r,t);return root;}
function ruRubble(s,op){const big=(op&&op.size)==='large',root=wlRoot(big?3.2:2),r=mulberry32((s||1)*673);wlMound(root,0,0,big?2:1.1,r,vm('ruin'));wlRubble(root,0,0,big?14:7,r,big?2.6:1.5,[vm('ruin'),vm('ruinDark')],.4);
  if(big){const g=new THREE.Group();put(root,g,1.6,0,-1,0,.5,0);ruBox(g,1.2,.8,.4,vm('ruin'),0,.4,0,0,0);}for(let k=0;k<5;k++){const a=r()*6.28;wlTuft(root,Math.cos(a)*(big?2.4:1.4),0,Math.sin(a)*(big?2.4:1.4),r,r()<.5);}return root;}
function ruStatue(s,op){const wear=(op&&op.wear)||'mossy',root=wlRoot(2.4),r=mulberry32((s||1)*677),sm=vm('statue'),dk=vm('ruinDark');
  bx(root,1.6,.4,1.6,dk,0,.2,0);bx(root,1.2,1,1.2,vm('ruin'),0,.9,0);bx(root,1.4,.2,1.4,dk,0,1.5,0);const y=1.6;
  for(const sd of[-1,1]){bx(root,.28,.9,.32,sm,sd*.17,y+.45,0);bx(root,.32,.16,.42,sm,sd*.17,y+.08,.04);}
  bx(root,.72,.5,.42,sm,0,y+1.1,0);bx(root,.66,.7,.4,sm,0,y+1.7,0);bx(root,.9,.22,.46,sm,0,y+2.1,0);bx(root,.2,.12,.2,sm,0,y+2.27,0);
  bx(root,.22,.62,.26,sm,-.45,y+1.72,.02);bx(root,.22,.3,.24,sm,-.45,y+1.3,.19);bx(root,.22,.24,.22,sm,.45,y+1.88,0);
  const sh=new THREE.Group();put(root,sh,-.18,y,.36);bx(sh,.62,.9,.1,sm,0,.75,0);bx(sh,.46,.3,.1,sm,0,.15,0);
  const hd=new THREE.Group();put(root,hd,1.08,0,.78,0,.6,0);bx(hd,.34,.36,.36,sm,0,.18,0);bx(hd,.38,.06,.4,sm,0,.03,0);bx(hd,.22,.04,.02,vm('dark'),0,.24,.181);
  bx(root,.22,.4,.22,sm,1.1,.11,-.5,Math.PI/2,.4,0);
  if(wear==='mossy'||wear==='both'){for(const sd of[-1,1])bx(root,.26,.06,.36,vm('moss'),sd*.31,y+2.24,0);bx(root,.3,.06,.28,vm('moss'),.45,y+2.03,0);bx(root,1,.04,.3,vm('moss'),.1,1.62,.55);bx(hd,.3,.04,.3,vm('moss'),0,.38,0);ruTufts(root,1.6,.8,r,6);}
  if(wear==='cracked'||wear==='both'){bx(root,.05,.5,.02,vm('dark'),.1,1.,.61);bx(root,.05,.3,.02,vm('dark'),.15,y+1.6,.21);}return root;}
WL('ruin-stairs','ruins','Wall stairs',ruStairs,'Solid stone stair, 1.6 m wide, climbing 4.4 m to the wall walk in 11 steps. It uses the same origin as the wall it serves: place it with the wall and it sits against the inner (-z) side.',{opts:[RU_WEAR],variants:true,defaultSeed:1});
WL('ruin-column','ruins','Column',ruColumn,'Round stone column on a square base: standing (5 m with a capital), broken off with its drums lying where they fell, or fallen in a line.',{opts:[{key:'state',label:'State',choices:[['standing','Standing'],['broken','Broken'],['fallen','Fallen']],def:'broken'},RU_WEAR],variants:true,defaultSeed:1});
WL('ruin-arch','ruins','Freestanding arch',ruArch,'Arch on two piers 4 m apart (the piers sit on grid vertices), 5.6 m high. Broken: the right half of the arch and the top of its pier have fallen into a heap.',{opts:[{key:'state',label:'State',choices:[['broken','Broken'],['intact','Intact']],def:'broken'},RU_WEAR],variants:true,defaultSeed:1});
WL('ruin-rubble','ruins','Rubble heap',ruRubble,'Heap of fallen masonry blocks with loose stones around it; the large one has a whole slab of wall lying in it.',{opts:[{key:'size',label:'Size',choices:[['small','Small'],['large','Large']],def:'small'}],variants:true,defaultSeed:1});
WL('ruin-statue','ruins','Headless statue',ruStatue,'Weathered stone knight on a plinth, resting a plain shield on the ground; the head has broken off and lies at the foot, the right forearm is gone.',{opts:[Object.assign({},RU_WEAR,{def:'mossy'})],variants:true,defaultSeed:1});
WL('ruin-floor','ruins','Flagstone floor',()=>vTile((x,z)=>{const n=wlNoise(x,z,1.3);return n>1.8?'wDust':n>1.1?'ruinMoss':'ruinFloor';},(root,at)=>{wlDeco(14,.3,['wDust'],51)(root,at);const r=mulberry32(53);for(let i=0;i<6;i++){const x=(r()-.5)*3.4,z=(r()-.5)*3.4;if(at(x,z)==='ruinFloor')bx(root,.05,.01,.3,vm('dark'),x,T+.005,z,0,r()*3,0);}}),'Old flagstone floor, 4 × 4 m tile: cracked slabs, moss in the joints, a few slabs gone to dust and dry grass. Top at 0.8 m like the terrain tiles.',{groundR:-1});
const wlTileMats1=tileMats;tileMats=function(){const m=wlTileMats1();Object.assign(m,{ruinFloor:{top:vm('ruinFloor'),side:vm('ruinDark')},ruinMoss:{top:vm('moss'),side:vm('ruinDark'),h:T+.02}});return m;};
