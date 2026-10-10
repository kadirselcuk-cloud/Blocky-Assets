/* ======================= Fortified city =======================
   Plan (x east, z south, 500 × 500 m):
   - North: a mountain range with four mines and two quarries cut into its foot; the mining quarter (stonemasons, smiths,
     builders, a clay pit, a kiln, stone houses, donkeys) sits below it.
   - Centre (-30,-10): an irregular hill. Its top is the inner city inside stone walls whose segments step with the ground:
     central square with stalls and wells, town hall, church, manor in a drystone enclosure, clinic, mint, tavern, barracks
     and merchant townhouses. Four stone gates.
   - Around the hill: the outer town, inside an irregular (but closed) wooden palisade with towers and five gates:
     merchant, brick and stone houses, cottages, boarding houses, shops, taverns, school, sickhouse, a small market,
     barracks and archery ranges.
   - West: the sea; docks, shipyard and fisheries on the stretch of shore next to the mountain, with a few houses.
   - A river comes out of the mountain, runs down the east side and curves west along the south into the sea.
     Bridge to the east: the forest (pine) with the woodsmen's settlement (log houses, hunters, gatherers, herbalists,
     tanners, woodcutters, foresters, charcoal), wildlife, a lake, and a bandit camp far in the north-east.
   - South and south-east: large farms with fields, orchards, windmills on hills, pens and a pond; mills on the river.
   Roads are curved ribbons; houses follow them with small irregularities. 350 people (250 adults, 100 children).
*/
function vxSceneCity(){const root=new THREE.Group();root.userData.lights=[];root.userData.ground=-1;
  const rng=mulberry32(4242),S=500,HALF=250,CS=2,NG=S/CS,PI=Math.PI,H90=PI/2,LOG=root.userData._log=[];
  const cl=(v,a=0,b=1)=>Math.max(a,Math.min(b,v)),ss=(a,b,v)=>{const t=cl((v-a)/(b-a));return t*t*(3-2*t);},lerp=(a,b,t)=>a+(b-a)*t,r5=v=>Math.round(v/.5)*.5;
  const Hash=cs=>{const m=new Map(),K=(i,j)=>i*100003+j;return{add(x0,x1,z0,z1,o){for(let i=Math.floor(x0/cs);i<=Math.floor(x1/cs);i++)for(let j=Math.floor(z0/cs);j<=Math.floor(z1/cs);j++){const k=K(i,j);let l=m.get(k);if(!l)m.set(k,l=[]);l.push(o);}},
    at(x,z){return m.get(K(Math.floor(x/cs),Math.floor(z/cs)))||[];},
    near(x0,x1,z0,z1){const s=new Set();for(let i=Math.floor(x0/cs);i<=Math.floor(x1/cs);i++)for(let j=Math.floor(z0/cs);j<=Math.floor(z1/cs);j++)for(const o of m.get(K(i,j))||[])s.add(o);return s;}};};
  const spline=(P,closed,step=1)=>{const n=P.length,g=i=>closed?P[(i%n+n)%n]:P[cl(i,0,n-1)],pts=[],segs=closed?n:n-1;
    for(let i=0;i<segs;i++){const p0=g(i-1),p1=g(i),p2=g(i+1),p3=g(i+2);for(let t=0;t<1;t+=.04){const t2=t*t,t3=t2*t;pts.push([0,1].map(c=>.5*(2*p1[c]+(-p0[c]+p2[c])*t+(2*p0[c]-5*p1[c]+4*p2[c]-p3[c])*t2+(-p0[c]+3*p1[c]-3*p2[c]+p3[c])*t3)));}}
    pts.push(closed?pts[0]:P[n-1]);const out=[[pts[0][0],pts[0][1]]];let rem=step;
    for(let i=1;i<pts.length;i++){let[ax,az]=pts[i-1];const[bx2,bz]=pts[i];let d=Math.hypot(bx2-ax,bz-az);while(d>=rem){const t=rem/d;ax+=(bx2-ax)*t;az+=(bz-az)*t;out.push([ax,az]);d-=rem;rem=step;}rem-=d;}return out;};
  const toW=(x,z,ry,lx,lz)=>[x+lx*Math.cos(ry)+lz*Math.sin(ry),z-lx*Math.sin(ry)+lz*Math.cos(ry)];
  const inPoly=(P,x,z)=>{let c=false;for(let i=0,j=P.length-1;i<P.length;j=i++){const[xi,zi]=P[i],[xj,zj]=P[j];if((zi>z)!==(zj>z)&&x<(xj-xi)*(z-zi)/(zj-zi)+xi)c=!c;}return c;};

  /* ---------- natural ground ---------- */
  const C=[-30,-10],Rin=a=>62+9*Math.sin(3*a+.5)+6*Math.sin(5*a+2)+4*Math.sin(7*a+1),Rout=a=>Math.max(128+16*Math.sin(2*a+1)+10*Math.sin(3*a+2.5)+6*Math.sin(5*a),Rin(a)*1.75);
  const polar=(x,z)=>{const dx=x-C[0],dz=z-C[1];return[Math.hypot(dx,dz),Math.atan2(dz,dx)];};
  const ridge=x=>-195+10*Math.sin(x*.015+.4)+6*Math.sin(x*.04+1.3);
  const SX=z=>lerp(-208,-205+8*Math.sin(z*.02+1)+5*Math.sin(z*.05+2),cl((Math.abs(z+110)-62)/20));
  const RIVER=spline([[85,-262],[86,-215],[92,-175],[118,-120],[146,-60],[152,-20],[150,30],[132,88],[84,140],[20,170],[-60,184],[-130,192],[-200,204],[-270,214]],false,2),RH=7;
  const RVH=Hash(16);RIVER.forEach((p,i)=>RVH.add(p[0],p[0],p[1],p[1],i));
  const riverD=(x,z)=>{let d=99;for(const i of RVH.near(x-40,x+40,z-40,z+40)){const p=RIVER[i],e=Math.hypot(x-p[0],z-p[1]);if(e<d)d=e;}return d;};
  const riverAt=(x,z)=>{let d=1e9,b=0;for(let i=0;i<RIVER.length;i++){const p=RIVER[i],e=(x-p[0])**2+(z-p[1])**2;if(e<d){d=e;b=i;}}return b;};
  const LAKES=[[205,100,20,15],[-118,148,12,9]],lakeD=(x,z)=>{let m=9;for(const[lx,lz,rx,rz]of LAKES){const u=(x-lx)/rx,v=(z-lz)/rz,a=Math.atan2(v,u),f=1+.15*Math.sin(3*a+1)+.08*Math.sin(5*a+2);m=Math.min(m,(u*u+v*v)/(f*f));}return m;};
  const MINES=[-112,-72,8,46].map(x=>({x,z:ridge(x)-6})),QUARRIES=[-150,-30].map(x=>({x,z:ridge(x)-8}));
  const notched=(x,z)=>{for(const m of MINES)if(Math.abs(x-m.x)<6&&z>m.z-6.4&&z<m.z+16)return true;for(const q of QUARRIES)if(Math.abs(x-q.x)<8.4&&z>q.z-8.4&&z<q.z+16)return true;return false;};
  const mountain=(x,z)=>{const z0=ridge(x);if(z>=z0||notched(x,z))return 0;const k=Math.min(1,(z0-z)/70);return(55*Math.pow(k,.7)+(Math.sin(x*.17)+Math.cos(x*.11+z*.23))*k*4)*ss(8,45,riverD(x,z));};
  const hills=(x,z)=>4.5*Math.max(0,Math.sin(x*.019+1.3)*Math.cos(z*.023+.4)+.45*Math.sin(x*.047-z*.039+2.1)-.25);
  const mound=(x,z)=>{const[r,a]=polar(x,z),q=r/Rin(a);if(q>1.32)return 0;const top=8.5+2.2*Math.sin(x*.07+.3)*Math.cos(z*.06+1)+1.5*Math.sin((x+z)*.05)+1.5*cl((-z-10)/40);return top*(q<.84?1:ss(1.32,.84,q));};
  const ringF=(x,z)=>{const[r,a]=polar(x,z);return ss(Rout(a)*.9,Rout(a)*1.12,r);};
  const waterAt=(x,z)=>{const sx=SX(z);if(x<sx)return-1-Math.min(2.5,(sx-x)*.12);const rd=riverD(x,z);if(rd<RH)return-1-(1-rd/RH)*1.6;const ld=lakeD(x,z);if(ld<1)return-1-(1-ld)*2;return null;};
  const natural=(x,z)=>{const rd=riverD(x,z),ld=lakeD(x,z),sd=x-SX(z);let h=hills(x,z)*(.3+.7*ringF(x,z))+mound(x,z);h*=ss(RH,RH+30,rd)*ss(1,2.4,ld)*ss(0,25,sd);h+=mountain(x,z);
    if(x>244)h=Math.max(h,(x-244)*.6);if(z>244)h=Math.max(h,(z-244)*.5);return Math.max(0,h);};
  const nearWater=(x,z,m)=>x<SX(z)+m||riverD(x,z)<RH+m||lakeD(x,z)<1+m/12;

  /* ---------- walls: inner stone ring, outer wooden ring, gates ---------- */
  const polyV=(N,Rf,frac,jit,sd)=>{const r=mulberry32(sd),V=[];for(let i=0;i<N;i++){const a=(i+(r()-.5)*jit)/N*2*PI-PI;V.push([C[0]+Math.cos(a)*Rf(a)*frac,C[1]+Math.sin(a)*Rf(a)*frac]);}return V;};
  const IN=polyV(13,Rin,.88,.5,11),OUT=polyV(24,Rout,1,.4,12);
  const edges=V=>V.map((a,i)=>{const b=V[(i+1)%V.length],L=Math.hypot(b[0]-a[0],b[1]-a[1]),d=[(b[0]-a[0])/L,(b[1]-a[1])/L],m=[(a[0]+b[0])/2,(a[1]+b[1])/2];let n=[d[1],-d[0]];if((m[0]-C[0])*n[0]+(m[1]-C[1])*n[1]<0)n=[-n[0],-n[1]];return{a,b,L,d,m,n,ry:Math.atan2(n[0],n[1]),gates:[]};});
  const EIN=edges(IN),EOUT=edges(OUT);
  const pickGate=(E,ang,half,stone)=>{let best=null,bd=9;for(const e of E){const a=Math.atan2(e.m[1]-C[1],e.m[0]-C[0]),d=Math.abs(Math.atan2(Math.sin(a-ang),Math.cos(a-ang)));if(d<bd&&e.L>2*half+8&&!e.gates.length){bd=d;best=e;}}
    const g={x:best.m[0],z:best.m[1],ry:best.ry,n:best.n,half,stone};g.y=r5(natural(g.x,g.z));best.gates.push(g);return g;};
  const GI={N:pickGate(EIN,-H90,5,1),E:pickGate(EIN,0,5,1),S:pickGate(EIN,H90,5,1),W:pickGate(EIN,PI,5,1)};
  const GO={N:pickGate(EOUT,-H90,3.8,0),E:pickGate(EOUT,-.15,3.8,0),SE:pickGate(EOUT,.8,3.8,0),S:pickGate(EOUT,H90+.15,3.8,0),W:pickGate(EOUT,PI,3.8,0)};
  const gOut=(g,d)=>[g.x+g.n[0]*d,g.z+g.n[1]*d];

  /* ---------- roads (curved ribbons) ---------- */
  const ROADS=[],RD=Hash(8);
  const road=(P,o={})=>{const pts=spline(P,!!o.closed,1),r={pts,closed:!!o.closed,hw:o.hw||1.6,stone:!!o.stone,pins:o.pins||[],y:[],br:[]};ROADS.push(r);return r;};
  const S0=[-30,-14],sqY=r5(natural(S0[0],S0[1]));
  // inner city: from the square to the four inner gates, plus a lane round the square
  for(const k of['N','E','S','W']){const g=GI[k],p=gOut(g,-12),q=[lerp(S0[0],p[0],.5)+(k==='N'||k==='S'?6:0),lerp(S0[1],p[1],.5)+(k==='E'||k==='W'?-5:0)];road([[S0[0]+(p[0]-S0[0])*.18,S0[1]+(p[1]-S0[1])*.18],q,p,[g.x,g.z],gOut(g,6)],{stone:1,hw:1.5,pins:[[g.x,g.z,g.y],[S0[0]+(p[0]-S0[0])*.18,S0[1]+(p[1]-S0[1])*.18,sqY]]});}
  // main roads: inner gate → outer gate → beyond
  const mid=(gi,go,s)=>{const a=gOut(gi,14),b=gOut(go,-14);return[[a[0],a[1]],[lerp(a[0],b[0],.5)+s[0],lerp(a[1],b[1],.5)+s[1]],[b[0],b[1]]];};
  const RN=road([gOut(GI.N,-2),[GI.N.x,GI.N.z],...mid(GI.N,GO.N,[8,0]),[GO.N.x,GO.N.z],gOut(GO.N,14),[-20,-152],[-58,-172],[-100,-188],[-124,-198]],{pins:[[GI.N.x,GI.N.z,GI.N.y],[GO.N.x,GO.N.z,GO.N.y]]});
  road([[-20,-152],[10,-165],[30,-176],[46,-184]]);road([[-58,-172],[-30,-182],[-30,-192]]);road([[-100,-188],[-150,-196],[-150,-204]]);
  const RW=road([gOut(GI.W,-2),[GI.W.x,GI.W.z],...mid(GI.W,GO.W,[0,-6]),[GO.W.x,GO.W.z],gOut(GO.W,14),[-182,-36],[-192,-70],[-196,-104],[-197,-140],[-196,-166]],{pins:[[GI.W.x,GI.W.z,GI.W.y],[GO.W.x,GO.W.z,GO.W.y]]});
  const RE=road([gOut(GI.E,-2),[GI.E.x,GI.E.z],...mid(GI.E,GO.E,[0,6]),[GO.E.x,GO.E.z],gOut(GO.E,14),[126,-24],[136,-23],[168,-21],[178,-22]],{pins:[[GI.E.x,GI.E.z,GI.E.y],[GO.E.x,GO.E.z,GO.E.y]]});
  const RF=road([[178,-22],[200,-44],[226,-36],[234,-4],[218,26],[192,32],[172,12]]);
  const RS=road([gOut(GI.S,-2),[GI.S.x,GI.S.z],...mid(GI.S,GO.S,[-6,0]),[GO.S.x,GO.S.z],gOut(GO.S,14),[-28,146],[-36,162]],{pins:[[GI.S.x,GI.S.z,GI.S.y],[GO.S.x,GO.S.z,GO.S.y]]});
  const RSW=road([[-28,140],[-70,134],[-100,118],[-150,100],[-184,72],[-190,40]]);
  const RSE=road([gOut(GO.SE,-2),[GO.SE.x,GO.SE.z],gOut(GO.SE,14),[52,112],[84,96],[104,62]],{pins:[[GO.SE.x,GO.SE.z,GO.SE.y]]});
  // ring road between the walls, lanes and arcs of the outer town
  const ringR=a=>Rin(a)*1.3+(Rout(a)-Rin(a)*1.3)*.2,RING=road(Array.from({length:24},(_,i)=>{const a=i/24*2*PI-PI+.1;return[C[0]+Math.cos(a)*ringR(a),C[1]+Math.sin(a)*ringR(a)];}),{closed:1});
  const LANES=[];for(const a of[-2.35,-1.0,.35,1.15,2.1,2.85]){const p=r=>[C[0]+Math.cos(a)*r,C[1]+Math.sin(a)*r],ri=ringR(a),ro=Rout(a)*.84;LANES.push(road([p(ri),[p((ri+ro)/2)[0]+Math.sin(a)*6,p((ri+ro)/2)[1]-Math.cos(a)*6],p(ro)]));}
  const ARCS=[[-2.8,-1.6],[-.85,.3],[.55,1.0],[1.35,1.9]].map(([a0,a1])=>road(Array.from({length:6},(_,i)=>{const a=lerp(a0,a1,i/5);return[C[0]+Math.cos(a)*Rout(a)*.72,C[1]+Math.sin(a)*Rout(a)*.72];})));
  // heights: follow the ground, smoothed, pinned at gates; spans over water become bridges
  for(const r of ROADS){const n=r.pts.length;let y=r.pts.map(([x,z])=>waterAt(x,z)!=null?NaN:natural(x,z));
    for(let i=0;i<n;i++)if(isNaN(y[i])){let a=i;while(a>0&&isNaN(y[a]))a--;let b=i;while(b<n-1&&isNaN(y[b]))b++;const ya=isNaN(y[a])?0:y[a],yb=isNaN(y[b])?ya:y[b];for(let k=i;k<=b;k++)if(isNaN(y[k]))y[k]=Math.max(ya,yb)+.2;if(b>i){r.br.push([Math.max(0,i-3),Math.min(n-1,b+3)]);}i=b;}
    for(let it=0;it<3;it++){const z2=y.slice();for(let i=0;i<n;i++){let s=0,c=0;for(let k=-5;k<=5;k++){const j=r.closed?(i+k+n)%n:cl(i+k,0,n-1);s+=y[j];c++;}z2[i]=s/c;}y=z2;}
    for(const[px,pz,py]of r.pins){let bi=0,bd=1e9;r.pts.forEach(([x,z],i)=>{const d=Math.hypot(x-px,z-pz);if(d<bd){bd=d;bi=i;}});for(let i=0;i<n;i++){const k=Math.abs(i-bi),w=k<=7?1:k<20?1-(k-7)/13:0;y[i]=lerp(y[i],py,w);}}
    for(const[a,b]of r.br){const yy=Math.max(y[a],y[b],.2)+.15;for(let k=a;k<=b;k++)y[k]=yy;}r.y=y;r.pts.forEach(([x,z],i)=>RD.add(x,x,z,z,[x,z,y[i],r.hw,r,i]));}
  const roadNear=(x,z,ext=0)=>{let best=null,bd=1e9;for(const s of RD.near(x-6,x+6,z-6,z+6)){const d=Math.hypot(x-s[0],z-s[1]);if(d<s[3]+ext&&d<bd){bd=d;best=s;}}return best;};

  /* ---------- placement: oriented footprints, flat pads, regions ---------- */
  const OBB=[],OH=Hash(16),PADC=[];
  const mkObb=(cx,cz,ry,hx,hz)=>{const c=Math.cos(ry),s=Math.sin(ry),ux=c,uz=-s,vx=s,vz=c,ex=hx*Math.abs(ux)+hz*Math.abs(vx),ez=hx*Math.abs(uz)+hz*Math.abs(vz);return{cx,cz,ux,uz,vx,vz,hx,hz,ex,ez};};
  const sep=(A,B)=>{for(const[ax,az]of[[A.ux,A.uz],[A.vx,A.vz],[B.ux,B.uz],[B.vx,B.vz]]){const ra=A.hx*Math.abs(A.ux*ax+A.uz*az)+A.hz*Math.abs(A.vx*ax+A.vz*az),rb=B.hx*Math.abs(B.ux*ax+B.uz*az)+B.hz*Math.abs(B.vx*ax+B.vz*az);if(Math.abs((B.cx-A.cx)*ax+(B.cz-A.cz)*az)>ra+rb)return true;}return false;};
  const inObb=(o,x,z,m=0)=>{const dx=x-o.cx,dz=z-o.cz;return Math.abs(dx*o.ux+dz*o.uz)<=o.hx+m&&Math.abs(dx*o.vx+dz*o.vz)<=o.hz+m;};
  const addObb=(o,pad,tag)=>{o.pad=pad;o.tag=tag;OBB.push(o);OH.add(o.cx-o.ex-1,o.cx+o.ex+1,o.cz-o.ez-1,o.cz+o.ez+1,o);};
  const hits=o=>{for(const q of OH.near(o.cx-o.ex,o.cx+o.ex,o.cz-o.ez,o.cz+o.ez))if(!sep(o,q))return q;return null;};
  const obbPts=(o,f=1)=>{const P=[[o.cx,o.cz]];for(const a of[-1,-.5,0,.5,1])for(const b of[-1,-.5,0,.5,1])if(Math.abs(a)===1||Math.abs(b)===1)P.push([o.cx+o.ux*o.hx*a*f+o.vx*o.hz*b*f,o.cz+o.uz*o.hx*a*f+o.vz*o.hz*b*f]);return P;};
  const roadHit=o=>{for(const s of RD.near(o.cx-o.ex-3,o.cx+o.ex+3,o.cz-o.ez-3,o.cz+o.ez+3))if(inObb(o,s[0],s[1],s[3]+.3))return true;return false;};
  const regionOf=(x,z)=>inPoly(IN,x,z)?'inner':inPoly(OUT,x,z)?'outer':'out';
  const stat=new THREE.Group();root.add(stat);const BLD=[],CNT={house:0,production:0,military:0,farm:0,civil:0,other:0};let NT=0;
  const MIL=new Set(['vx-barracks','vx-archery','vx-woodtower','vx-stonetower']),FARMB=new Set(['vx-barn','vx-granary','vx-stable','vx-sheepfold','vx-coop','vx-orchard','vx-pigpen','vx-donkeyshelter','vx-cowpen','field']),
    CIVIL=new Set(['vx-tavern','vx-market','vx-stall-2','vx-stall-3','vx-stall-4','vx-stall-5','vx-well','vx-dock','vx-clinic','vx-sickhouse','vx-school','vx-church','vx-townhall','vx-manor']);
  const catOf=id=>SC_HOUSE(id)?'house':MIL.has(id)?'military':FARMB.has(id)?'farm':CIVIL.has(id)?'civil':id.startsWith('vx-')?'production':'other';
  const shade=o=>o.traverse(q=>{if(q.isMesh){q.castShadow=true;q.receiveShadow=true;}});
  const put2=(obj,x,z,ry=0,y=0)=>{obj.position.set(x,y,z);obj.rotation.y=ry;obj.userData.isAsset=true;shade(obj);stat.add(obj);return obj;};
  const mk=(id,o={})=>{const a=SC_A(id);return a.build(a.defaultSeed??1,Object.assign((a.opts||[]).reduce((q,p)=>(q[p.key]=p.def,q),{}),o));};
  /* place(idOrBuilder, x, z, ry, o): o.region, o.opts, o.y, o.m (margin), o.slope, o.water (allowed), o.noRoad, o.cat, o.pad */
  const BBC=new Map(),bbOf=(id,opts)=>{const k=id+JSON.stringify(opts||{});let v=BBC.get(k);if(!v){const t=mk(id,opts||{});pineSwap(t,1);v=new THREE.Box3().setFromObject(t);BBC.set(k,v);}return v;};
  const place=(id,x,z,ry,o={})=>{let obj=typeof id==='function'?id():null;const b=obj?new THREE.Box3().setFromObject(obj):bbOf(id,o.opts);
    const lcx=(b.min.x+b.max.x)/2,lcz=(b.min.z+b.max.z)/2,[cx,cz]=toW(x,z,ry,lcx,lcz),m=o.m??.8,ob=mkObb(cx,cz,ry,(b.max.x-b.min.x)/2+m,(b.max.z-b.min.z)/2+m);
    const why=t=>{if(o.dbg)LOG.push('  '+(typeof id==='string'?id:'fn')+' @'+x.toFixed(0)+','+z.toFixed(0)+': '+t);return null;};if(Math.abs(cx)+ob.ex>HALF-3||Math.abs(cz)+ob.ez>HALF-3)return why('edge');{const q=hits(ob);if(q)return why('hits '+q.tag);}if(!o.noRoad&&roadHit(ob))return why('road');
    const P=obbPts(ob,1);let lo=1e9,hi=-1e9;for(const[px,pz]of P){if(o.region&&regionOf(px,pz)!==o.region)return why('region');if(!o.water&&nearWater(px,pz,2.5))return why('water');if(!o.mtn&&mountain(px,pz)>.5)return why('mountain');const h=natural(px,pz);lo=Math.min(lo,h);hi=Math.max(hi,h);}
    if(hi-lo>(o.slope??3))return why('slope '+(hi-lo).toFixed(1));const y=o.y??r5(natural(x,z));if(!obj)obj=mk(id,o.opts||{});NT+=pineSwap(obj,1);put2(obj,x,z,ry,y);addObb(ob,o.pad===false?null:y,id);
    const tag=typeof id==='function'?(o.cat||'other'):id,cat=o.cat||catOf(tag);CNT[cat]++;const rec={id:tag,x,z,ry,y,b,ob,cat,obj};BLD.push(rec);return rec;};
  const tryAround=(id,x,z,ry,o={},rad=10)=>{for(let k=0;k<40;k++){const a=k*2.4,d=k?rad*Math.sqrt(k/40):0,r=place(id,x+Math.cos(a)*d,z+Math.sin(a)*d,ry+(o.face?0:(rng()-.5)*.1),o);if(r)return r;}LOG.push('failed '+(typeof id==='string'?id:o.cat)+' near '+x.toFixed(0)+','+z.toFixed(0));return null;};
  const must=(id,C2,o={},rad=16)=>{for(const[x,z]of C2){for(const rr of[rad,rad*1.8]){for(let k=0;k<50;k++){const a=k*2.4,d=rr*Math.sqrt(k/50),px=x+Math.cos(a)*d,pz=z+Math.sin(a)*d,rn=roadNear(px,pz,40);let ry=rng()*6;if(rn){ry=Math.atan2(rn[0]-px,rn[1]-pz);}const r=place(id,px,pz,ry,o);if(r)return r;}}}LOG.push('must failed '+id);return null;};
  /* fill both sides of a road with buildings facing it, with small random set-backs, gaps and turns */
  const fill=(r,queue,o={})=>{const n=r.pts.length,i0=Math.floor((o.from??0)*(n-1)),i1=Math.floor((o.to??1)*(n-1)),out=[],sides=o.sides||[1,-1],left=[],per=sides.length===1?[queue]:[queue.filter((_,k)=>k%2===0),queue.filter((_,k)=>k%2===1)];
    sides.forEach((side,si)=>{const list=per[si];let i=i0+2+Math.floor(rng()*4),qi=0,miss=0;
      while(i<i1-2&&qi<list.length){const id=list[qi],[x,z]=r.pts[i],[x2,z2]=r.pts[Math.min(n-1,i+1)],tl=Math.hypot(x2-x,z2-z)||1,nx=-(z2-z)/tl*side,nz=(x2-x)/tl*side,ry=Math.atan2(-nx,-nz)+(rng()-.5)*(o.turn??.14);
        const b=typeof id==='function'?new THREE.Box3().setFromObject(id()):bbOf(id,o.opts),off=r.hw+(o.set??1.6)+rng()*(o.jit??1.6)+b.max.z,rec=place(id,x+nx*off,z+nz*off,ry,o);
        if(rec){out.push(rec);qi++;i+=Math.ceil((b.max.x-b.min.x)+(o.gap??2)+rng()*(o.gapJ??3));miss=0;}else{i+=2;if(++miss>30){miss=0;left.push(id);qi++;}}}left.push(...list.slice(qi));});out.left=left;return out;};
  /* ---------- walls ---------- */
  const wallLine=(E,stone)=>{const tr=stone?3.1:2.2,maxL=stone?9:8;for(const e of E){const cuts=[[0,tr],[e.L-tr,e.L]];for(const g of e.gates){const t=(g.x-e.a[0])*e.d[0]+(g.z-e.a[1])*e.d[1];cuts.push([t-g.half,t+g.half]);}cuts.sort((p,q)=>p[0]-q[0]);
    let cur=0;const segs=[];for(const[a,b]of cuts){if(a>cur+.3)segs.push([cur,a]);cur=Math.max(cur,b);}
    for(const[a,b]of segs){const n=Math.ceil((b-a)/maxL);for(let k=0;k<n;k++){const s0=a+(b-a)*k/n,s1=a+(b-a)*(k+1)/n,len=s1-s0,cm=(s0+s1)/2,cx=e.a[0]+e.d[0]*cm,cz=e.a[1]+e.d[1]*cm;
      let y=1e9;for(let t=0;t<=4;t++){const s=lerp(s0,s1,t/4);for(const w of[-1,1])y=Math.min(y,r5(natural(e.a[0]+e.d[0]*s+e.n[0]*w,e.a[1]+e.d[1]*s+e.n[1]*w)));}y-=.15;
      const g=new THREE.Group();if(stone)vStoneWallSeg(g,len,0,0,0);else vPalisadeSeg(g,len,0,0,0,k+7);put2(g,cx,cz,e.ry,y);addObb(mkObb(cx-(stone?0:e.n[0]*.5),cz-(stone?0:e.n[1]*.5),e.ry,len/2,stone?1.25:1),null,'wall');}}}
    const V=E.map(e=>e.a);for(const[x,z]of V){let y=1e9;for(const[a,b]of[[0,0],[3,0],[-3,0],[0,3],[0,-3]])y=Math.min(y,r5(natural(x+a,z+b)));const t=mk(stone?'vx-stonetower':'vx-woodtower');put2(t,x,z,Math.atan2(x-C[0],z-C[1]),y-.2);addObb(mkObb(x,z,0,stone?3.1:2.3,stone?3.1:2.3),null,'tower');}
    for(const e of E)for(const g of e.gates){const m=mk(stone?'vx-stonegate':'vx-woodgate',{state:1});put2(m,g.x,g.z,g.ry,g.y-.25);for(const s of[-1,1])addObb(mkObb(g.x+e.d[0]*s*(g.half-1.2),g.z+e.d[1]*s*(g.half-1.2),g.ry,1.3,stone?1.8:1.2),null,'gatetower');addObb(mkObb(g.x,g.z,g.ry,g.half,stone?2.4:1.6),g.y,'gatepad');}};
  wallLine(EIN,true);wallLine(EOUT,false);const NTOW=IN.length+OUT.length,NGATE=9;

  /* ---------- inner city ---------- */
  PADC.push([S0[0],S0[1],13.5,sqY]);
  const faceSq=(x,z)=>Math.atan2(S0[0]-x,S0[1]-z),atSq=(id,a,d,o={})=>{const b=bbOf(id),dep=b.max.z;for(let k=0;k<14;k++)for(const da of[0,.22,-.22,.45,-.45,.7,-.7]){const dd=14.5+dep+k*1.6,aa=a+da,x=S0[0]+Math.cos(aa)*dd,z=S0[1]+Math.sin(aa)*dd,r=place(id,x,z,faceSq(x,z),Object.assign({region:'inner',slope:5},o));if(r)return r;}LOG.push('failed '+id+' at square');return null;};

  const manorB=()=>{const g=new THREE.Group(),mn=mk('vx-manor');g.add(mn);const b=new THREE.Box3().setFromObject(mn),E=[b.min.x-4,b.max.x+4,b.min.z-3,b.max.z+5],gx=0;
    fStone(g,E[1]-E[0]+.5,(E[0]+E[1])/2,E[2],0,3);for(const x of[E[0],E[1]])fStone(g,E[3]-E[2]-.5,x,(E[2]+E[3])/2,H90,x>0?5:9);fStone(g,gx-3.4-E[0]+.25,(E[0]-.25+gx-3.4)/2,E[3],0,4);fStone(g,E[1]+.25-gx-3.4,(gx+3.4+E[1]+.25)/2,E[3],0,6);put(g,fGate(true)(0,{state:1}),gx,0,E[3]);
    for(const[x,z,k]of[[E[0]+2,E[2]+2.4,'apple'],[E[0]+2,(E[2]+E[3])/2,'pear'],[E[1]-2,E[2]+2.4,'cherry'],[E[1]-2,(E[2]+E[3])/2,'plum'],[E[0]+2,E[3]-2.6,'apple'],[E[1]-2,E[3]-2.6,'pear']]){NT++;put(g,vxFruitTree(k)(Math.abs(x*13+z)|1,{size:'mature'}),x,0,z);}
    for(const x of[-5,5])put(g,iBench(),x,0,E[3]-2);for(const x of[-8,-3.5,3.5,8])put(g,vxFlowers(Math.abs(x*3)|1),x,0,E[3]-.9);g.userData.manor=E;return g;};
  const manor=(()=>{for(let k=0;k<16;k++)for(const da of[0,.3,-.3,.6,-.6,.9,-.9,1.2,-1.2,1.6,-1.6,2.1,-2.1,2.7,-2.7]){const a=-2.25+da,d=30+k*1.6,x=S0[0]+Math.cos(a)*d,z=S0[1]+Math.sin(a)*d,r=place(manorB,x,z,faceSq(x,z),{region:'inner',slope:5,cat:'civil'});if(r){r.id='vx-manor';CNT.civil++;return r;}}LOG.push('failed manor');return null;})();
  const hall=atSq('vx-townhall',-H90-.35),church=atSq('vx-church',.2),clinic=atSq('vx-clinic',1.15),mint=atSq('vx-mint',-.9);
  const INC=Array.from({length:10},(_,i)=>{const a=i/10*2*PI;return[C[0]+Math.cos(a)*Rin(a)*.55,C[1]+Math.sin(a)*Rin(a)*.55];}),tav0=atSq('vx-tavern',2.05)||must('vx-tavern',INC,{region:'inner',slope:5},10),bar0=atSq('vx-barracks',2.75)||must('vx-barracks',INC,{region:'inner',slope:5},10);

  
  const STALLS=[];for(let i=0;i<6;i++){const a=i/6*2*PI+.3,x=S0[0]+Math.cos(a)*8.6,z=S0[1]+Math.sin(a)*8.6;const r=place(['vx-market','vx-stall-2','vx-stall-3','vx-stall-4','vx-stall-5','vx-market'][i],x,z,faceSq(x,z)+PI,{y:sqY,noRoad:1,m:.2});if(r)STALLS.push(r);}
  place('vx-well',S0[0]+2,S0[1]-1.5,0,{y:sqY,noRoad:1,m:.2});place('vx-well',S0[0]-3.2,S0[1]+3,0,{y:sqY,noRoad:1,m:.2});
  const INNERR=ROADS.slice(0,4);for(const[i,r]of INNERR.entries())fill(r,['vx-twn-'+(i+1),'vx-twn-'+(i%5+2),'vx-twn-'+((i+2)%5+1)].concat(i<2?['vx-twn-5']:[]),{region:'inner',slope:3.5,set:1,gap:1,gapJ:2,from:.15,to:.92});
  {const have=BLD.filter(b=>b.id.startsWith('vx-twn')).length;for(let k=have;k<10;k++){const a=rng()*2*PI;atSq('vx-twn-'+(k%5+1),a,22+rng()*14);}}

  /* ---------- outer town (between the walls) ---------- */
  const ringAt=f=>RING.pts[Math.floor(f*RING.pts.length)%RING.pts.length];
  const OTQ=[];const addQ=(l,n)=>{for(let i=0;i<n;i++)OTQ.push(l[i%l.length]);};
  addQ(['vx-twn-1','vx-twn-2','vx-twn-3','vx-twn-4','vx-twn-5'],8);addQ(['vx-brk-1','vx-brk-2','vx-brk-3','vx-brk-4','vx-brk-5'],16);addQ(['vx-crf-1','vx-crf-2','vx-crf-3','vx-crf-4','vx-crf-5'],10);addQ(['vx-cot-1','vx-cot-2','vx-cot-3','vx-cot-4','vx-cot-5'],10);OTQ.push('vx-boarding','vx-boarding');
  const SHOPS=['vx-bakery','vx-bakery','vx-bakery','vx-oven','vx-oven','vx-tailor','vx-tailor','vx-weaver','vx-weaver','vx-loom','vx-kitchen','vx-carpenter','vx-carpenter','vx-blacksmith','vx-toolsmith','vx-tavern','vx-tavern','vx-school','vx-sickhouse','vx-barracks','vx-barracks','vx-archery','vx-archery'];
  // interleave shops among the houses, then fill the ring road, the lanes, the arcs and the outer stretches of the main roads
  const mixQ=[];{let s=0;OTQ.forEach((h,i)=>{mixQ.push(h);if(i%2===1&&s<SHOPS.length)mixQ.push(SHOPS[s++]);});while(s<SHOPS.length)mixQ.push(SHOPS[s++]);}
  const OT=[];
  for(const[r,n]of[[RING,30],[LANES[0],6],[LANES[1],6],[LANES[2],6],[LANES[3],6],[LANES[4],6],[LANES[5],6],...ARCS.map(a=>[a,6]),[RN,4],[RE,4],[RS,4],[RW,4]]){const take=mixQ.splice(0,n),res=fill(r,take,{region:'outer',slope:3});OT.push(...res);const used=res.map(q=>q.id);for(const id of take){const k=used.indexOf(id);if(k>=0)used.splice(k,1);else mixQ.push(id);}}
  for(let pass=0;pass<3&&mixQ.length;pass++){const left=mixQ.splice(0);for(const id of left){let ok=null;for(let t=0;t<60&&!ok;t++){const r=[RING,...LANES,...ARCS][Math.floor(rng()*(7+ARCS.length))],i=Math.floor(rng()*r.pts.length),[x,z]=r.pts[i],[x2,z2]=r.pts[Math.min(r.pts.length-1,i+1)],tl=Math.hypot(x2-x,z2-z)||1,sd=rng()<.5?1:-1,nx=-(z2-z)/tl*sd,nz=(x2-x)/tl*sd,d=8+rng()*10;ok=place(id,x+nx*d,z+nz*d,Math.atan2(-nx,-nz)+(rng()-.5)*.2,{region:'outer',slope:3});}if(!ok)mixQ.push(id);}}
  {const RP=Array.from({length:16},(_,i)=>{const a=i/16*2*PI-PI;return[C[0]+Math.cos(a)*(Rin(a)*1.45+(Rout(a)-Rin(a)*1.45)*.5),C[1]+Math.sin(a)*(Rin(a)*1.45+(Rout(a)-Rin(a)*1.45)*.5)];});for(const id of mixQ.splice(0)){RP.push(RP.shift());must(id,RP.slice(0,8),{region:'outer',slope:4},14);}}
  // a small market in the outer town, near the south gate
  {const gp=gOut(GO.S,-30);for(let i=0;i<4;i++)must(['vx-stall-2','vx-stall-3','vx-stall-4','vx-stall-5'][i],[[gp[0]+Math.cos(i*1.6)*10,gp[1]+Math.sin(i*1.6)*10],gOut(GO.E,-30),gOut(GO.W,-30)],{region:'outer',slope:2},10);for(const g of[GO.N,GO.W,GO.SE])must('vx-well',[gOut(g,-24)],{region:'outer',slope:2},12);}

  /* ---------- outside the walls ---------- */
  const OUTR={region:'out'};
  // mining quarter
  for(const m of MINES)place('vx-mine',m.x,m.z,0,{mtn:1,noRoad:1,slope:99,y:0,m:.3,dbg:1});for(const q of QUARRIES)place('vx-quarry',q.x,q.z,0,{mtn:1,noRoad:1,slope:99,y:0,m:.3,dbg:1});
  const MINEQ=['vx-stonemason','vx-blacksmith','vx-builder','vx-crf-1','vx-crf-2','vx-toolsmith','vx-crf-3','vx-claypit','vx-stonemason','vx-crf-4','vx-blacksmith','vx-kiln','vx-builder','vx-crf-5','vx-donkeyshelter','vx-crf-1','vx-crf-2','vx-crf-3'];
  const mq=[],mqLeft=[];for(const r of ROADS.slice(ROADS.indexOf(RN)+1,ROADS.indexOf(RN)+4).concat([RN]))mq.push(...(t=>(mqLeft.push(...t.left),t))(fill(r,MINEQ.splice(0,r===RN?8:4),Object.assign({slope:4,from:r===RN?.62:0},OUTR))));
  {const left=mq.left||[];for(const id of[...MINEQ.splice(0),...mqLeft])must(id,[[-20,-152],[-58,-168],[10,-162],[-100,-182],[30,-170]],Object.assign({slope:4},OUTR),18);}
  // shore near the mountain: docks, shipyard, fisheries on the straight shore, then smokehouses and houses along the road
  const SHL=-208;for(const[id,z,lz]of[['vx-shipyard',-160,-2],['vx-dock',-136,1.9],['vx-dock',-113,1.9],['vx-fishery',-93.5,-1.2],['vx-fishery',-76.5,-1.2],['vx-fishery',-59.5,-1.2]]){const r=place(id,SHL-lz,z,H90,{water:1,y:-.49,pad:false,m:.3,noRoad:1,opts:id==='vx-dock'?{stock:3}:{}});if(r){r.obj.traverse(q=>{if(q.isMesh&&(q.material===WATERMAT||q.material===vm('deepWater')))q.visible=false;});const b=r.b;addObb(mkObb(...toW(r.x,r.z,H90,(b.min.x+b.max.x)/2,(lz+b.max.z)/2),H90,(b.max.x-b.min.x)/2,(b.max.z-lz)/2),-1,'sunk');}}
  for(const id of fill(RW,['vx-smokehouse','vx-cot-1','vx-crf-4','vx-smokehouse','vx-cot-2','vx-crf-5','vx-cot-3'],Object.assign({from:.6,sides:[1]},OUTR)).left)must(id,[[-186,-100],[-186,-130],[-184,-70]],OUTR,14);
  // river: two sawmills by the east bridge, two watermills on the south bend
  const mill=(id,i)=>{const p=RIVER[i],q=RIVER[i+2],tx=q[0]-p[0],tz=q[1]-p[1],tl=Math.hypot(tx,tz);for(const sd of[1,-1]){const nx=-tz/tl*sd,nz=tx/tl*sd,ry=Math.atan2(nz,-nx);
      const lx=id==='vx-sawmill'?7.4:6.4,cx=p[0]+nx*(RH+lx+.3),cz=p[1]+nz*(RH+lx+.3);const r=place(id,cx,cz,ry,{water:1,slope:3,m:.3});if(r)return r;}LOG.push('failed '+id+' '+i);return null;};
  const near=(x,z)=>riverAt(x,z);mill('vx-sawmill',near(150,-48)-1);mill('vx-sawmill',near(142,-78));mill('vx-watermill',near(-10,176));mill('vx-watermill',near(-80,187));
  for(const id of fill(RS,['vx-log-1','vx-cot-4','vx-log-2','vx-cot-5'],Object.assign({from:.55},OUTR)).left)must(id,[[-20,150],[-50,160],[10,155]],OUTR,14);
  // forest settlement beyond the east bridge
  const rfl=fill(RF,['vx-log-1','vx-hunter','vx-log-2','vx-gatherer','vx-log-3','vx-herbalist','vx-leather','vx-log-4','vx-cabin','vx-log-5','vx-forester','vx-kiln','vx-log-1','vx-hunter','vx-log-2','vx-gatherer','vx-log-3','vx-herbalist','vx-leather','vx-log-4','vx-cabin','vx-log-5','vx-forester','vx-kiln'],Object.assign({slope:3.5},OUTR));for(const id of rfl.left)must(id,[[200,-30],[222,0],[196,24],[186,-10]],Object.assign({slope:4},OUTR),16);
  // farms: farmhouses on the farm roads with barn, granary and fields behind; cottages; orchards, windmills on hill tops, pens
  const FARMS=[];const farmQ=['vx-farmhouse','vx-farm-2','vx-farm-3','vx-farm-4','vx-farm-5','vx-farmhouse','vx-farm-2','vx-farm-3','vx-farm-4','vx-farm-5'];
  const farmRest=f=>{const L=(id,lx,lz,r=0,o={})=>{const[x,z]=toW(f.x,f.z,f.ry,lx,lz);return place(id,x,z,f.ry+r,Object.assign({slope:3},OUTR,o));};const b=f.b;
    f.barn=L('vx-barn',b.min.x-10,-2)||L('vx-barn',b.max.x+10,-2);f.gran=L('vx-granary',b.max.x+6,-4);
    const crops=['wheat','cabbage','carrot','mixed','pumpkin','tomato'];f.fields=[];for(const[lx,lz]of[[0,b.min.z-11],[-21,b.min.z-11],[21,b.min.z-11],[0,b.min.z-26]]){const w=18,l=12,k=Math.floor(rng()*6),r=L(()=>vxFarmField(Math.floor(rng()*99)+1,{crop:crops[k],width:w,length:l}),lx,lz,0,{cat:'farm',slope:2.5});if(r){r.id='field';r.w=w;r.l=l;f.fields.push(r);}}};
  for(const[r,k]of[[RSW,4],[RSE,4],[RS,2]]){const res=fill(r,farmQ.splice(0,k),Object.assign({set:3,jit:3,gap:40,gapJ:10,from:r===RS?.6:0},OUTR));for(const f of res){FARMS.push(f);farmRest(f);}}
  for(const id of farmQ.splice(0)){const f=must(id,[[-130,90],[-70,155],[60,140],[100,70],[-170,130],[20,150]],Object.assign({slope:3},OUTR),24);if(f){FARMS.push(f);farmRest(f);}}
  fill(RSW,['vx-cot-1','vx-cot-2','vx-cot-3'],Object.assign({from:.15,gap:14},OUTR));fill(RSE,['vx-cot-4','vx-cot-5','vx-cot-1'],Object.assign({from:.2,gap:14},OUTR));
  const PENS=[];
  const randFarm=(id,o={})=>{for(let t=0;t<80;t++){const x=-190+rng()*310,z=50+rng()*130;const f=FARMS[Math.floor(rng()*FARMS.length)],px=f?f.x+(rng()-.5)*70:x,pz=f?f.z+(rng()-.5)*60:z;if(regionOf(px,pz)!=='out'||riverD(px,pz)<16||across(px,pz))continue;const r=place(id,px,pz,rng()*6,Object.assign({slope:3},OUTR,o));if(r)return r;}LOG.push('failed '+id);return null;};
  const across=(x,z)=>{const i=riverAt(x,z),p=RIVER[i],q=RIVER[Math.min(RIVER.length-1,i+1)];return((q[0]-p[0])*(z-p[1])-(q[1]-p[1])*(x-p[0]))<0;};
  const FL=[[-120,100],[-60,150],[40,130],[90,80],[-160,60],[0,165],[70,40],[-100,175],[-170,120],[-30,140],[110,60],[-140,40]];
  for(let i=0;i<4;i++){const r=randFarm('vx-orchard',{opts:{size:'medium',trees:['apple','pear','cherry','mixed'][i]}})||must('vx-orchard',FL.slice(i*3).concat(FL.slice(0,i*3)),Object.assign({slope:4.5,opts:{size:'medium',trees:['apple','pear','cherry','mixed'][i]}},OUTR),30);if(r)PENS.push(r);}
  for(const id of['vx-stable','vx-stable','vx-cowpen','vx-cowpen','vx-sheepfold','vx-sheepfold','vx-pigpen','vx-pigpen','vx-coop','vx-coop','vx-coop','vx-oven','vx-oven']){const r=randFarm(id)||must(id,FL,Object.assign({slope:3},OUTR),30);if(r)PENS.push(r);}
  {const cand=[];for(let t=0;t<900;t++){const x=-190+rng()*320,z=40+rng()*150;if(regionOf(x,z)!=='out'||riverD(x,z)<25||across(x,z))continue;cand.push([hills(x,z),x,z]);}cand.sort((a,b)=>b[0]-a[0]);let n=0;
    for(const[,x,z]of cand){if(n>=3)break;if(BLD.some(b=>b.id==='vx-windmill'&&Math.hypot(b.x-x,b.z-z)<60))continue;if(place('vx-windmill',x,z,rng()*6,Object.assign({slope:2.5},OUTR)))n++;}if(n<3)LOG.push('windmills '+n);}
  // military outposts: two stone towers and three wooden watchtowers
  for(const[id,x,z]of[['vx-stonetower',118,-36],['vx-stonetower',-36,-138],['vx-woodtower',-60,100],['vx-woodtower',168,48],['vx-woodtower',-186,-20]])must(id,[[x,z]],OUTR,12);
  // bandit camp, far in the north-east forest
  const CAMP=tryAround('cp-camp',214,-158,.4,Object.assign({cat:'other',mtn:1,slope:4},OUTR),12);

  // top up to the planned totals: 100 houses, 60 production and extraction buildings, 10 military
  const FL2=[[-120,80],[60,150],[-170,40],[100,100],[-140,170],[-40,175],[20,120],[-180,-60],[170,-80],[-150,140],[90,140]];
  const topUp=(cat,target,ids,cands,o)=>{for(let k=0;CNT[cat]<target&&k<30;k++)must(ids[k%ids.length],cands.slice(k%cands.length).concat(cands.slice(0,k%cands.length)),o,30);if(CNT[cat]<target)LOG.push('short '+cat+' '+CNT[cat]);};
  topUp('house',100,['vx-cot-1','vx-crf-2','vx-cot-3','vx-log-4','vx-farm-4'],FL2,Object.assign({slope:3},OUTR));topUp('production',60,['vx-oven','vx-smokehouse','vx-kiln'],FL2,Object.assign({slope:3},OUTR));topUp('military',10,['vx-woodtower'],FL2,Object.assign({slope:3},OUTR));
  /* ---------- final ground ---------- */
  const PH=Hash(16);for(const o of OBB)if(o.pad!=null)PH.add(o.cx-o.ex-1,o.cx+o.ex+1,o.cz-o.ez-1,o.cz+o.ez+1,o);
  const padAt=(x,z)=>{for(const o of PH.at(x,z))if(inObb(o,x,z,.6))return o.pad;for(const[px,pz,r,y]of PADC)if(Math.hypot(x-px,z-pz)<r)return y;return null;};
  const roadCell=(x,z)=>{if(Math.hypot(x-S0[0],z-S0[1])<13.5)return null;let lo=1e9,on=false;for(const[a,b]of[[0,0],[-1,-1],[1,-1],[-1,1],[1,1]]){const s=roadNear(x+a,z+b,.9);if(s){on=true;lo=Math.min(lo,s[2]);}}return on?lo:null;};
  const HG=new Float32Array(NG*NG),SF=new Array(NG*NG),WY=new Float32Array(NG*NG);
  for(let i=0;i<NG;i++)for(let k=0;k<NG;k++){const x=-HALF+CS/2+i*CS,z=-HALF+CS/2+k*CS,w=waterAt(x,z),ry=roadCell(x,z);let h,s;
    if(w!=null){const p=padAt(x,z);h=p!=null&&p<0?p:r5(w);s='bed';WY[i*NG+k]=ry!=null?ry+.06:h;}
    else if(ry!=null){h=ry-.08;s=inPoly(IN,x,z)?'plaza':'dirt';WY[i*NG+k]=ry+.03;}
    else{const p=padAt(x,z);h=p!=null?p:r5(natural(x,z));s=nearWater(x,z,2.5)&&h<=.5?'sand':notched(x,z)?'dirt':(mountain(x,z)>14||(mountain(x,z)>4&&Math.sin(x*1.7+z)*Math.cos(z*1.3)>-.1))?'rock':Math.hypot(x-S0[0],z-S0[1])<13.5?'plaza':'grass';WY[i*NG+k]=h;}
    HG[i*NG+k]=h;SF[i*NG+k]=s;}
  const cellI=(x,z)=>cl(Math.floor((x+HALF)/CS),0,NG-1)*NG+cl(Math.floor((z+HALF)/CS),0,NG-1);
  sceneTerrain(root,S,CS,(x,z)=>HG[cellI(x,z)],(x,z)=>SF[cellI(x,z)]);
  const walkY=(x,z)=>WY[cellI(x,z)];
  // water: sea strip, river pieces, lakes
  vWaterSurface(root,52,500,-224,-.35,0,.45);
  for(let i=0;i<RIVER.length-1;i+=20){const seg=RIVER.slice(i,i+21);let x0=1e9,x1=-1e9,z0=1e9,z1=-1e9;for(const[x,z]of seg){x0=Math.min(x0,x-RH-2);x1=Math.max(x1,x+RH+2);z0=Math.min(z0,z-RH-2);z1=Math.max(z1,z+RH+2);}vWaterSurface(root,x1-x0,z1-z0,(x0+x1)/2,-.35,(z0+z1)/2,.45);}
  for(const[lx,lz,rx,rz]of LAKES)vWaterSurface(root,rx*2.6,rz*2.6,lx,-.35,lz,.5);
  // road ribbons and bridges
  const rmat=(k,off)=>{const b=vm(k),m=b.clone();m.map=b.map.clone();m.map.wrapS=m.map.wrapT=THREE.RepeatWrapping;m.map.needsUpdate=true;m.polygonOffset=true;m.polygonOffsetFactor=-off;m.polygonOffsetUnits=-off;return m;};
  const RM={dirt:rmat('dirtRoad',2),edge:rmat('grassDirt',1),stone:rmat('cobble',3)};for(const k in RM)RM[k].side=THREE.DoubleSide;
  const ribbon=(r,w,mat,lift,skirt)=>{const P=[],U=[],I=[],n=r.pts.length,isBr=i=>r.br.some(([a,b])=>i>a&&i<b);let run=[];const flush=()=>{if(run.length<2){run=[];return;}const base=P.length/3;let acc=0;
      run.forEach((i,k)=>{const[x,z]=r.pts[i],j=Math.min(n-1,i+1),jj=Math.max(0,i-1),tx=r.pts[j][0]-r.pts[jj][0],tz=r.pts[j][1]-r.pts[jj][1],tl=Math.hypot(tx,tz)||1,nx=-tz/tl,nz=tx/tl,y=r.y[i]+lift;if(k)acc+=Math.hypot(x-r.pts[run[k-1]][0],z-r.pts[run[k-1]][1]);
        P.push(x+nx*w,y,z+nz*w,x-nx*w,y,z-nz*w,x+nx*w,y-skirt,z+nz*w,x-nx*w,y-skirt,z-nz*w);U.push(0,acc/.8,2*w/.8,acc/.8,0,acc/.8,2*w/.8,acc/.8);
        if(k){const a=base+(k-1)*4,b=base+k*4;I.push(a,b,a+1,a+1,b,b+1, a+2,b+2,a,a,b+2,b, a+1,b+1,a+3,a+3,b+1,b+3);}});run=[];};
    for(let i=0;i<n;i++){if(isBr(i))flush();else run.push(i);}flush();if(!P.length)return;const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(P,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(U,2));g.setIndex(I);g.computeVertexNormals();
    const m=new THREE.Mesh(g,mat);m.receiveShadow=true;root.add(m);};
  for(const r of ROADS){if(r.stone)ribbon(r,r.hw,RM.stone,.03,.4);else{ribbon(r,r.hw+.45,RM.edge,.015,.35);ribbon(r,r.hw,RM.dirt,.03,.05);}
    for(const[a,b]of r.br){const[x0,z0]=r.pts[a],[x1,z1]=r.pts[b],L=Math.hypot(x1-x0,z1-z0)+1,y=r.y[a],g=new THREE.Group();bx(g,L,.12,2.8,vm('planks'),0,0,0);bx(g,L,.1,.2,vm('planksDark'),0,-.1,0);
      for(const s of[-1,1]){bx(g,L,.08,.1,vm('planksDark'),0,.75,s*1.35);for(let x=-L/2+.2;x<=L/2;x+=.9)bx(g,.1,.75,.1,vm('planksDark'),x,.38,s*1.35);}for(let x=-L/2+2;x<L/2-1;x+=2.6)for(const s of[-1,1])vlog(g,.26,3,.26,'y',x,-1.5,s*1.1);
      put2(g,(x0+x1)/2,(z0+z1)/2,Math.atan2(-(z1-z0),x1-x0),y-.06);CNT.other++;}}

  /* ---------- trees: pine only, crowns apart, well clear of buildings and roads ---------- */
  const TR=new Map(),tk=(x,z)=>Math.floor(x/6)*1000+Math.floor(z/6);
  const fits=(x,z,r)=>{const i=Math.floor(x/6),k=Math.floor(z/6);for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++)for(const t of TR.get((i+a)*1000+(k+b))||[])if(Math.hypot(x-t[0],z-t[1])<r+t[2]+.4)return false;return true;};
  const CLEAR=[[200,-90,10],[222,-120,9],[180,60,9],[230,140,10],[196,170,9],[175,-150,8],[214,-158,20],[160,210,12],[60,-140,10]];
  const blockedT=(x,z,r)=>{if(roadNear(x,z,r+1.5))return true;for(const o of OH.near(x-r-4,x+r+4,z-r-4,z+r+4))if(inObb(o,x,z,r+2.2))return true;for(const[cx,cz,rr]of CLEAR)if(Math.hypot(x-cx,z-cz)<rr)return true;return false;};
  for(let gx=-246;gx<=246;gx+=2.8)for(let gz=-246;gz<=246;gz+=2.8){const x=gx+(rng()-.5)*2.2,z=gz+(rng()-.5)*2.2;const reg=regionOf(x,z);if(reg!=='out')continue;
    const mt=mountain(x,z),east=riverD(x,z)>RH+5&&across(x,z),h=natural(x,z),p=mt>.5?(mt<30?.4:mt<42?.1:0):east?.72:z<-120?.25:.008;if(rng()>p)continue;
    const big=rng()<.6,r=big?2.7:1.8;if(waterAt(x,z)!=null||nearWater(x,z,3)||blockedT(x,z,r)||!fits(x,z,r))continue;(TR.get(tk(x,z))||TR.set(tk(x,z),[]).get(tk(x,z))).push([x,z,r]);
    const hh=Math.min(HG[cellI(x,z)],HG[cellI(x-.6,z-.6)],HG[cellI(x+.6,z-.6)],HG[cellI(x-.6,z+.6)],HG[cellI(x+.6,z+.6)]);NT++;put2(vxTree('pine',big?'large':'small')(Math.floor(rng()*999)+1),x,z,rng()*6,hh);}
  // berries and plants near the gatherers, rocks on the mountain
  for(const b of BLD.filter(b=>b.id==='vx-gatherer'||b.id==='vx-herbalist'))for(let k=0;k<6;k++){const a=rng()*6.28,d=9+rng()*6,x=b.x+Math.cos(a)*d,z=b.z+Math.sin(a)*d;if(blockedT(x,z,.6))continue;put2(k%3?vxBushAsset('woolRed')(k+3):vxFern(k+1),x,z,rng()*6,HG[cellI(x,z)]);}
  for(let n=0;n<60;n++){const x=-240+rng()*330,z=ridge(x)-8-rng()*40;if(blockedT(x,z,1.5)||notched(x,z))continue;const b=(n%5?vxLargeRock(['granite','basalt','sandstone'][n%3]):vxOreBoulder(['iron','copper','tin','gold'][n%4]))(n+3),sc=.7+rng()*.8;b.scale.setScalar(sc);
    put2(b,x,z,rng()*6,Math.min(HG[cellI(x-1.5,z-1.5)],HG[cellI(x+1.5,z+1.5)],HG[cellI(x-1.5,z+1.5)],HG[cellI(x+1.5,z-1.5)])-.3);}
  for(let n=0;n<70;n++){const i=Math.floor(rng()*RIVER.length),p=RIVER[i],sd=rng()<.5?1:-1,q=RIVER[Math.min(RIVER.length-1,i+1)],tl=Math.hypot(q[0]-p[0],q[1]-p[1])||1,x=p[0]-(q[1]-p[1])/tl*sd*(RH+.4),z=p[1]+(q[0]-p[0])/tl*sd*(RH+.4);if(blockedT(x,z,.5)||HG[cellI(x,z)]>0)continue;const rd=vxReeds(n+1);rd.traverse(q=>{if(q.isMesh&&q.material===WATERMAT)q.visible=false;});put2(rd,x,z,rng()*6,-.1);}
  /* lights */
  const lights=[];stat.traverse(o=>{if(o.isPointLight)lights.push(o);});const rank=l=>l.userData.min>=.6?0:l.distance===7?1:2,lp=new THREE.Vector3();
  lights.forEach(l=>{l.getWorldPosition(lp);l._d=Math.hypot(lp.x-S0[0],lp.z-S0[1]);});lights.sort((a,b)=>rank(a)-rank(b)||a._d-b._d);lights.forEach(l=>{if(rank(l)<2&&root.userData.lights.length<12)root.userData.lights.push(l);else l.parent.remove(l);});
  root.userData._bld=BLD;root.userData._roads=ROADS;root.userData._obb=OBB;root.userData._inObb=inObb;root.userData._water=waterAt;root.userData._gates={GI,GO};mergeStatic(stat,128);

  /* ---------- people ---------- */
  const dynG=new THREE.Group();dynG.userData.dynamic=true;root.add(dynG);const ag=[],tick=[],work=[];let sd=1000;
  const V_=(kind,job,force)=>{const m=buildVillager(kind,sd++,job,force||{});dynG.add(m);const a=agentOf(m);ag.push(a);if(m.userData.occTool)giveTool(m,m.userData.occTool);return a;};
  const M=(job,f)=>V_(f?'female':'male',job),K=()=>V_('child',null,{girl:rng()<.5});
  const tool=(a,name)=>{const t=a.m.userData.toolObj;if(t)t.parent.remove(t);a.m.userData.occTool=name;giveTool(a.m,name);return a;};
  const still=(a,x,z,ry,clip,t,y)=>{a.m.position.set(x,y??walkY(x,z),z);if(y!=null){a.fixed=true;a.fy=y;}a.m.rotation.y=ry;a.play(clip,0);if(a.cur)a.cur.time=t??rng()*3;if(clip==='Tool strike'||clip==='Hammering')work.push([a,clip]);return a;};
  const at=(b,lx,lz)=>toW(b.x,b.z,b.ry,lx,lz),front=(b,d=1.3,lx=0)=>at(b,lx,b.b.max.z+d);
  const walkPath=(r,i0,len,side)=>{const n=r.pts.length,P=[];for(let k=0;k<len;k+=5){const i=(i0+k)%n;if(!r.closed&&i0+k>=n)break;const[x,z]=r.pts[i],[x2,z2]=r.pts[Math.min(n-1,i+1)],tl=Math.hypot(x2-x,z2-z)||1;P.push([x-(z2-z)/tl*side*.7,z+(x2-x)/tl*side*.7]);}return P.length>2?P.concat(P.slice(1,-1).reverse()):null;};
  const walker=(a,sp)=>{for(let t=0;t<20;t++){const r=ROADS[Math.floor(rng()*ROADS.length)];if(r.br.length&&rng()<.5)continue;const P=walkPath(r,Math.floor(rng()*r.pts.length),40+Math.floor(rng()*140),rng()<.5?1:-1);if(P){tick.push(behPath(a,P,sp||1.1+rng()*.3,'Walk',{[Math.floor(P.length/2)]:[rng()<.5?'Talk':'Look around',3+rng()*3]}));return a;}}return a;};
  let ADULT=0,KID=0;const OPT=[];const A1=a=>(ADULT++,a),K1=a=>(KID++,a),AO=a=>(OPT.push(a),A1(a));
  // workers at every production building
  const JOB={'vx-mine':[['miner','Tool strike',-3.6,2],['miner','Tool strike',3.6,2.2]],'vx-quarry':[['miner','Tool strike',-5,3,'Sledgehammer'],['miner','Tool strike',4.8,3,'Sledgehammer']],'vx-stonemason':[[null,'Tool strike',-2,1.4,'Sledgehammer']],
    'vx-blacksmith':[['blacksmith','Hammering',-3.8,3.4,null,PI]],'vx-toolsmith':[['toolsmith','Hammering',0,1,null,PI]],'vx-builder':[['toolsmith','Hammering',1.5,1,null,PI]],'vx-claypit':[['farmer','Pick up',0,2]],'vx-kiln':[['woodcutter','Tool strike',4,1.2,null,-H90]],
    'vx-cabin':[['woodcutter','Tool strike',-3,1.6]],'vx-forester':[['woodcutter','Look around',0,1.4]],'vx-hunter':[['hunter','Look around',0,1.4]],'vx-gatherer':[['herbalist','Pick up',1,1.6,null,0,1]],'vx-herbalist':[['herbalist','Pick up',0,1.4,null,0,1]],
    'vx-leather':[['leatherworker','Idle',0,1.4]],'vx-fishery':[['fisher','Idle',-1.8,-4.4-7.4,null,PI,0,-.49+.62]],'vx-shipyard':[['woodcutter','Tool strike',0,-4,'Axe']],'vx-smokehouse':[['fisher','Pick up',0,1.2,null,0,1]],
    'vx-watermill':[['miller','Idle',0,1.4]],'vx-sawmill':[['woodcutter','Tool strike',-2,1.6]],'vx-bakery':[['baker','Idle',0,1.2,null,0,1]],'vx-oven':[['baker','Idle',0,1.2,null,0,1]],'vx-tailor':[['tailor','Idle',0,1.2,null,0,1]],
    'vx-weaver':[['weaver','Talk',0,1.2,null,0,1]],'vx-loom':[['weaver','Idle',0,1.2,null,0,1]],'vx-kitchen':[['cook','Idle',0,1.2,null,0,1]],'vx-carpenter':[[null,'Tool strike',-2,1.6,'Axe']],'vx-mint':[['merchant','Idle',0,1.2]],
    'vx-windmill':[['miller','Look around',0,1.4]],'vx-barracks':[['guard','Talk',-1,1.6],['guard','Talk',1,1.8,null,PI],['guard','Idle',3,1.4]],'vx-archery':[['archer','Idle',-2,-2],['archer','Idle',2,-2]],
    'vx-tavern':[['cook','Talk',0,1.2,null,0,1],['miner','Talk',0,2.6,null,PI]],'vx-townhall':[['noble','Idle',0,1.4]],'vx-church':[['teacher','Idle',0,1.4]],'vx-clinic':[['healer','Idle',0,1.4,null,0,1],[null,'Sit',2,2.4]],
    'vx-school':[['teacher','Talk',0,1.6,null,0,1]],'vx-sickhouse':[['healer','Idle',0,1.4,null,0,1]],'vx-dock':[[null,'Pick up',-2,4.5],[null,'Pick up',2,5,null,0,1],['merchant','Talk',0,6.5]],'vx-stonetower':[['guard','Look around',0,3.6]]};
  for(const b of BLD){const J=JOB[b.id];if(!J)continue;for(const[job,clip,lx,lz,tl,rot,fem,yy]of J){const[x,z]=b.id==='vx-fishery'?at(b,lx,lz+7.4):at(b,lx,b.b.max.z+lz);const a=A1(M(job,fem));if(tl)tool(a,tl);still(a,x,z,b.ry+(rot??0),clip,undefined,yy!=null?b.y+yy+.49:undefined);}}
  for(const b of BLD.filter(b=>b.id==='vx-woodtower'))still(A1(M('archer')),b.x+.6,b.z+.6,rng()*6,'Look around',0,b.y+6.1);
  // gate guards
  for(const g of[...Object.values(GI),...Object.values(GO)])for(const s of[-1,1]){const e=[Math.cos(g.ry),-Math.sin(g.ry)],x=g.x+g.n[0]*3.2+e[0]*s*2.4,z=g.z+g.n[1]*3.2+e[1]*s*2.4;still(A1(M('guard')),x,z,g.ry,'Look around');}
  // square: merchants at the stalls, customers, people at the wells
  for(const s of STALLS){const[x,z]=at(s,0,-2.4);still(A1(M('merchant',rng()<.4)),x,z,s.ry+PI,'Talk');const[cx,cz]=at(s,(rng()-.5)*2,-4.4);still(AO(M(null,rng()<.6)),cx,cz,s.ry,'Talk',rng()*2);}
  for(let i=0;i<8;i++){const a=rng()*6.28,d=3+rng()*3.5;still(AO(M(null,i%2)),S0[0]+Math.cos(a)*d,S0[1]+Math.sin(a)*d,rng()*6,i%3?'Talk':'Look around');}
  if(manor){const E=manor.obj.userData.manor;for(const[lx,lz,f,clip]of[[-3,E[3]-3.4,0,'Talk'],[-1.4,E[3]-3.6,1,'Talk'],[E[0]+5,(E[2]+E[3])/2,1,'Pick up']]){const[x,z]=at(manor,lx,lz);still(A1(M(clip==='Pick up'?'farmer':'noble',f)),x,z,manor.ry+(lx<-2?H90:-H90),clip);}}
  // farms: a farmer walking the rows of each first field, another picking; shepherds and herders at the pens; pickers in orchards
  for(const f of FARMS){const fl=f.fields[0];if(fl){const P=[];for(let k=0;k<4;k++){const lz=-fl.l/2+1.6+k*2.4,L=at(fl,-fl.w/2+1,lz),Rr=at(fl,fl.w/2-1,lz);if(k%2)P.push(Rr,L);else P.push(L,Rr);}tick.push(behPath(A1(M('farmer',rng()<.3)),P,.8));
      const[x,z]=at(fl,3,fl.l/2-.8);still(A1(M('farmer',1)),x,z,fl.ry+PI,'Pick up');}else{const[x,z]=front(f);still(A1(M('farmer')),x,z,f.ry,'Idle');}}
  for(const p of PENS){const[x,z]=front(p,1.6,2);const job=p.id==='vx-sheepfold'?'shepherd':p.id==='vx-orchard'?'farmer':p.id==='vx-oven'?'baker':'farmer';still(AO(M(job,rng()<.5)),x,z,p.ry+PI,p.id==='vx-orchard'?'Pick up':'Idle');}
  // bandits around the camp
  if(CAMP){for(const[k,lx,lz,clip]of[['bandit',-3,4,'Talk'],['bandit',-1.6,5,'Talk'],['bandit-archer',4,-4,'Look around'],['marauder',0,-1.6,'Idle'],['bandit',3,3,'Sit'],['poacher',-5,-3,'Pick up']]){const m=SC_A('ol-'+k).build(sd++,{sex:rng()<.25?'female':'male'});dynG.add(m);const a=agentOf(m);ag.push(a);if(m.userData.occTool)giveTool(m,m.userData.occTool);const[x,z]=at(CAMP,lx,lz);still(A1(a),x,z,rng()*6,clip);}}
  if(CAMP)CAMP.obj.traverse(q=>{if(q.userData.traits)ADULT++;});
  while(ADULT>250&&OPT.length){const a=OPT.pop();dynG.remove(a.m);ag.splice(ag.indexOf(a),1);ADULT--;}
  // walkers on the roads until there are 250 adults
  while(ADULT<250)walker(A1(M([null,null,'merchant','farmer','miner','guard','weaver','woodcutter'][Math.floor(rng()*8)],rng()<.5)));
  // children: games on open ground, by their houses, on the roads, by the water, at the school
  const open=(reg,cx,cz,rad)=>{for(let t=0;t<200;t++){const x=cx+(rng()-.5)*rad*2,z=cz+(rng()-.5)*rad*2;if(regionOf(x,z)!==reg||nearWater(x,z,4)||roadNear(x,z,3))continue;const o=mkObb(x,z,0,3.4,3.4);if(hits(o))continue;let lo=1e9,hi=-1e9;for(const[a,b]of[[0,0],[-3,-3],[3,3],[-3,3],[3,-3]]){const h=walkY(x+a,z+b);lo=Math.min(lo,h);hi=Math.max(hi,h);}if(hi-lo>.01)continue;addObb(o,null,'play');return[x,z];}return null;};
  const circ=(p)=>{for(let i=0;i<3;i++)tick.push(behCircle(K1(K()),p[0],p[1],2.2,2.6,i*PI*.66));};
  for(const[reg,cx,cz,rad,n]of[['inner',S0[0],S0[1],40,2],['outer',C[0],C[1],120,8],['out',-40,130,110,3]])for(let i=0;i<n;i++){const p=open(reg,cx,cz,rad);if(p)circ(p);}
  const sch=BLD.find(b=>b.id==='vx-school');if(sch){const[x,z]=front(sch,4.6);const o=mkObb(x,z,0,3,3);if(!hits(o))circ([x,z]);}
  const houses=BLD.filter(b=>b.cat==='house');for(const h of houses){if(KID>=84)break;if(rng()<.45)continue;const[x,z]=front(h,1.6,(rng()-.5)*3);still(K1(K()),x,z,h.ry+(rng()-.5),['Jump','Wave','Idle','Pick up','Look around'][Math.floor(rng()*5)]);}
  for(let i=0;i<4;i++){const i0=Math.floor(rng()*RIVER.length*.3)+Math.floor(RIVER.length*.5),p=RIVER[i0],q=RIVER[i0+1],tl=Math.hypot(q[0]-p[0],q[1]-p[1]),x=p[0]-(q[1]-p[1])/tl*(RH+2),z=p[1]+(q[0]-p[0])/tl*(RH+2);if(!roadNear(x,z,2)&&!OH.near(x-2,x+2,z-2,z+2).size)still(K1(K()),x,z,Math.atan2(p[0]-x,p[1]-z),'Sit');}
  while(KID<100)walker(K1(K()),1.05);
  for(const[a]of work){a.mx.update(0);a.m.userData.post&&a.m.userData.post();}root.updateMatrixWorld(true);for(const[a,c]of work)workPiece(dynG,a.m,c);

  /* ---------- animals ---------- */
  const AN_=m=>{dynG.add(m);const a=agentOf(m);ag.push(a);return a;};
  const wanderL=(a,b,box,sp,idles,r,walk='Walk')=>{let tgt=null,wait=r()*3,lx=box[0]+r()*(box[1]-box[0]),lz=box[2]+r()*(box[3]-box[2]);const set=()=>{const[x,z]=at(b,lx,lz);a.m.position.x=x;a.m.position.z=z;};set();a.m.rotation.y=r()*6.28;a.play(idles[0],0);
    tick.push(dt=>{if(wait>0){wait-=dt;if(wait<=0){tgt=[box[0]+r()*(box[1]-box[0]),box[2]+r()*(box[3]-box[2])];a.play(walk);}return;}const dx=tgt[0]-lx,dz=tgt[1]-lz,d=Math.hypot(dx,dz),st=sp*dt;if(d<=st){wait=3+r()*6;a.play(idles[Math.floor(r()*idles.length)]);return;}
      lx+=dx/d*st;lz+=dz/d*st;set();face(a.m,dx*Math.cos(b.ry)+dz*Math.sin(b.ry),-dx*Math.sin(b.ry)+dz*Math.cos(b.ry),dt,5);});};
  const PENBOX={'vx-pigpen':[-1,2.6,-1.4,2],'vx-cowpen':[-1,5,-3,3.5],'vx-sheepfold':[-4,4,0,4],'vx-coop':[-2.2,2.2,.8,2.2],'vx-donkeyshelter':[-2.6,3,2,3.2],'vx-stable':[-10.5,-3,-4.5,5]};
  let sdA=2000;const R_=()=>mulberry32(sdA++);
  for(const b of BLD){const bx_=PENBOX[b.id];if(!bx_)continue;const n={'vx-pigpen':4,'vx-cowpen':5,'vx-sheepfold':6,'vx-coop':5,'vx-donkeyshelter':2,'vx-stable':4}[b.id];
    for(let i=0;i<n;i++){const mkA=b.id==='vx-pigpen'?()=>pigB(0,{coat:['pink','spotted','black'][i%3],young:i===n-1}):b.id==='vx-cowpen'?()=>cowB(0,{coat:['#26242a','#7a4a2a','#d8c8a8','#8a3a22'][i%4],pattern:['patches','none','face'][i%3],young:i===n-1}):
      b.id==='vx-sheepfold'?()=>sheepB(0,{coat:i===2?'#2a2826':'#ece8dc',young:i===n-1}):b.id==='vx-coop'?()=>i?buildBird('hen',HEN[['brown','white','buff','speckled'][i%4]]):buildBird('rooster',ROOSTER.red):b.id==='vx-donkeyshelter'?()=>donkeyB(0,{coat:['#8a8680','#5a5856'][i]}):()=>horseB(0,{coat:['#6e4a2e','#26242a','#a8784a','#e8e4dc'][i],pattern:['head','feet','spots','none'][i],young:i===3});
      const a=AN_(mkA()),id=b.id;wanderL(a,b,bx_,id==='vx-coop'?.35:.45,id==='vx-coop'?['Peck','Idle']:id==='vx-pigpen'?['Root around','Idle','Lie down']:['Graze','Idle','Graze'],R_());}}
  for(let i=0;i<8;i++){const d=AN_(dogB(0,{coat:['#c8963e','#26242a','#ece8dc','#7a4a28'][i%4],ears:i%2?'flop':undefined}));if(i<4)walker(d,1.25);else{const h=houses[Math.floor(rng()*houses.length)],[x,z]=front(h,2.4,2.4);still(d,x,z,h.ry,i%2?'Sit':'Lie down');}}
  const wild=(n,mkA,cx,cz,rad,sp,idles,walk)=>{for(let i=0;i<n;i++){const a=AN_(mkA(i));tick.push(behWander(a,cx-rad,cx+rad,cz-rad,cz+rad,sp,idles,R_(),walk));}};
  wild(4,i=>deerB(0,{coat:'#7a5236',sex:i?'doe':'stag',young:i===3}),200,-90,6,.5,['Graze','Alert','Idle']);wild(4,i=>deerB(0,{coat:'#8a4a2a',sex:i?'doe':'stag'}),230,140,6,.5,['Graze','Alert','Idle']);wild(3,i=>deerB(0,{coat:'#7a5236',sex:i?'doe':'stag'}),60,-140,6,.5,['Graze','Alert','Idle']);
  wild(4,i=>boarB(0,{young:i>1}),180,60,5.5,.45,['Root around','Idle']);wild(3,i=>boarB(0,{young:i>1}),160,210,7,.45,['Root around','Idle']);
  wild(4,i=>wolfB(0,{coat:['#8a8884','#5a5856','#8a8884','#ece8dc'][i]}),222,-120,5.5,.55,['Idle','Sniff','Howl','Lie down']);wild(4,i=>wolfB(0,{coat:['#5a5856','#8a8884'][i%2]}),175,-150,5,.55,['Idle','Sniff','Lie down']);
  wild(2,i=>bearB(0,{coat:['#6a4428','#3e2a1c'][i]}),196,170,6,.4,['Sniff','Idle','Sit','Stand up']);wild(1,()=>bearB(0,{young:true}),196,170,5,.4,['Sniff','Idle']);
  wild(5,i=>rabbitB(0,{coat:['#8a6a4a','#8a8884','#c8a878'][i%3]}),180,60,5,.6,['Eat','Idle','Sit up'],'Hop');wild(5,i=>rabbitB(0,{coat:['#8a6a4a','#ece8dc'][i%2]}),230,140,6,.6,['Eat','Idle','Sit up'],'Hop');
  wild(5,i=>bisonB(0,{young:i===4}),160,210,8,.45,['Graze','Idle']);
  for(let i=0;i<10;i++){const d=AN_(buildAvian('duck',DUCK[['mallard','hen','white'][i%3]]));const[lx,lz,rx,rz]=LAKES[i%2];tick.push(behWander(d,lx-rx*.5,lx+rx*.5,lz-rz*.5,lz+rz*.5,.35,['Swim'],R_(),'Swim'));d.fixed=true;d.fy=-.32;}
  for(const f of FARMS.slice(0,8)){const fl=f.fields[0];if(!fl)continue;const c=AN_(buildAvian('crow',CROW.black));wanderL(c,fl,[-fl.w/2+1,fl.w/2-1,-fl.l/2+1,fl.l/2-1],.5,['Peck','Idle','Caw'],R_(),'Hop');}

  /* level of detail: far agents animate less often and drop their shadows */
  for(const a of ag){compactRig(a.m);a.sk=[];a.m.traverse(q=>{if(q.isSkinnedMesh)a.sk.push(q);});a.ph=Math.floor(rng()*8);a.acc=0;a.sh=true;}
  let fr=0;root.userData.tick=(dt,cam)=>{fr++;for(const f of tick)f(dt);const cp=cam&&cam.position;
    for(const a of ag){const p=a.m.position;p.y=a.fixed?a.fy:walkY(p.x,p.z);let st=1;if(cp){const d=Math.hypot(p.x-cp.x,p.z-cp.z,p.y-cp.y);st=d<130?1:d<240?3:6;const sh=d<120;if(sh!==a.sh){a.sh=sh;for(const q of a.sk)q.castShadow=sh;}const vis=d<330;if(vis!==a.m.visible)a.m.visible=vis;if(!vis)continue;}
      a.acc+=dt;if((fr+a.ph)%st===0){a.mx.update(a.acc);a.acc=0;a.m.userData.post&&a.m.userData.post();}}};
  root.userData.tick(.01);
  sceneStats(root,{buildings:BLD.length,houses:CNT.house,production:CNT.production,military:CNT.military,farm:CNT.farm,trees:NT,towers:NTOW,gates:NGATE});return root;}
ASSETS.push({id:'sc-city',folder:'scenes',name:'Fortified city',kind:'scene',build:vxSceneCity,groundR:-1,
  desc:'A 500 × 500 m fortified city of 350 people (250 adults, 100 children). The inner city crowns an irregular hill inside stone walls that step with the ground, with four stone gates: a central square with stalls and wells, town hall, church, manor in its drystone enclosure, clinic, mint, tavern, barracks and merchant townhouses. Around it the outer town (merchant, brick and stone houses, cottages, boarding houses, shops, taverns, school, sickhouse, barracks, archery ranges, a small market) lies inside an irregular wooden palisade with towers and five gates. Mines and quarries are cut into the mountain to the north, with the mining quarter below; docks, shipyard and fisheries line the shore next to the mountain. A river from the mountain runs down to the sea, with sawmills and watermills and a bridge to the pine forest, where woodsmen, hunters, gatherers, herbalists and tanners live in log houses among wildlife, a lake and, far off, a bandit camp. Large farms with fields, orchards, windmills on the hills and a pond spread to the south. Roads are curved and houses follow them loosely.'});
