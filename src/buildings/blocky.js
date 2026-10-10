/* ======================= BLOCKY BUILDINGS (16 px per 0.8 m, same pixel size as the villagers) ======================= */
const VXT={},VXM={};
function vxTex(kind){if(VXT[kind])return VXT[kind];const N=16,c=document.createElement('canvas');c.width=c.height=N;const g=c.getContext('2d'),r=mulberry32(hashStr('vx'+kind));
  const P=(x,y,hex,f=1)=>{g.fillStyle=col(hex,f);g.fillRect(x,y,1,1);};(VXD[kind]||VXD.plain)(P,r,kind);
  const t=new THREE.CanvasTexture(c);t.magFilter=THREE.NearestFilter;t.minFilter=THREE.NearestFilter;t.generateMipmaps=false;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.encoding=THREE.sRGBEncoding;return VXT[kind]=t;}
const nz=(r,a=.9,b=1.05)=>a+(b-a)*r();
const rows=(base,h,gap,seamF,gapF,stagger)=>(P,r)=>{for(let y=0;y<16;y++){const row=Math.floor(y/h),off=(row%2)*stagger;for(let x=0;x<16;x++){let f=nz(r,.86,1.06);if(y%h===h-1)f=seamF;else if(gap&&(x+off)%gap===0)f=gapF;P(x,y,base,f);}}};
const VXD={
  plain:(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,'#888888',nz(r));},
  planks:rows('#a8804e',4,16,.62,.7,8),planksDark:rows('#6e5034',4,16,.6,.68,8),
  planksV:(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++){let f=nz(r,.86,1.06);if(x%4===3)f=.62;else if((y+(Math.floor(x/4)%2)*8)%16===0)f=.72;P(x,y,'#7a5a3c',f);}},
  bark:(P,r)=>{const c=[];for(let x=0;x<16;x++)c.push(nz(r,.78,1.08));for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,'#5e4430',c[x]*nz(r,.92,1.06)*(x%4===0?.82:1));},
  barkH:(P,r)=>{const c=[];for(let y=0;y<16;y++)c.push(nz(r,.78,1.08));for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,'#5e4430',c[y]*nz(r,.92,1.06)*(y%4===0?.82:1));},
  logH:(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++){const yy=y%8;let f=nz(r,.84,1.06)*(yy===0||yy===7?.6:yy===1?.85:1);if((x*3+y)%7===0)f*=.88;P(x,y,'#6e4e34',f);}},
  logEnd:(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++){const d=Math.max(Math.abs(x-7.5),Math.abs(y-7.5));P(x,y,d>6.5?'#5e4430':Math.floor(d)%2?'#b08a58':'#c9a46c',nz(r,.93,1.04));}},
  cobble:(P,r)=>{const S=[];for(let i=0;i<10;i++)S.push([r()*16,r()*16,['#8e8e8a','#7a7a76','#9e9e98','#6e6e6a'][Math.floor(r()*4)]]);
    for(let y=0;y<16;y++)for(let x=0;x<16;x++){const ds=S.map(s=>{const dx=Math.min(Math.abs(x+.5-s[0]),16-Math.abs(x+.5-s[0])),dy=Math.min(Math.abs(y+.5-s[1]),16-Math.abs(y+.5-s[1]));return[Math.hypot(dx,dy),s[2]];}).sort((a,b)=>a[0]-b[0]);
      P(x,y,ds[1][0]-ds[0][0]<1.1?'#4e4e4a':ds[0][1],nz(r,.9,1.06));}},
  stoneBrick:(P,r)=>{for(let y=0;y<16;y++){const off=(Math.floor(y/4)%2)*4;for(let x=0;x<16;x++){const m=y%4===3||(x+off)%8===7;P(x,y,m?'#626260':'#9c9a94',m?1:nz(r,.88,1.06));}}},
  plaster:(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,'#e8dfca',r()<.06?.88:nz(r,.95,1.02));},
  plasterOchre:(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,'#ead096',r()<.06?.88:nz(r,.95,1.02));},
  timber:(P,r)=>{const c=[];for(let x=0;x<16;x++)c.push(nz(r,.85,1.1));for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,'#4a3424',c[x]*nz(r,.94,1.04));},
  thatch:(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++){let f=nz(r,.82,1.1);if(y%4===3)f=.68;else if((x+Math.floor(y/4)*2)%3===0)f*=.88;P(x,y,'#c8a050',f);}},
  tiles:rows('#b0583a',4,4,.58,.74,2),slate:rows('#56606c',4,5,.62,.72,2),shingle:rows('#7c5e42',4,5,.6,.7,3),
  hay:(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++){let f=nz(r,.84,1.1);if(y===4||y===11)f=.62;if((x*5+y)%6===0)f*=.86;P(x,y,'#d8b850',f);}},
  leaves:(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,'#4e7a36',r()<.2?.6:nz(r,.85,1.1));},
  dirt:(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,r()<.08?'#8a8a80':'#7a5a3c',nz(r,.85,1.08));},
  iron:(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,'#8a8e94',(x===0||y===0||x===15||y===15)?.75:nz(r,.94,1.04));},
  dark:(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,'#1a1410',nz(r,.9,1.1));},
  glass:(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++){const hl=(x+y)%9===0||(x+y)%9===1;P(x,y,hl?'#e8f4f8':'#9cc0d4',hl?1:nz(r,.96,1.02));}},
  glassE:(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,'#ffffff',nz(r,.85,1));},
  woolRed:(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,'#b03a2e',nz(r,.9,1.05));},
  woolWhite:(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,'#e8e4dc',nz(r,.92,1.03));},
  awning:(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,Math.floor(x/4)%2?'#e8e4dc':'#b03a2e',nz(r,.92,1.04));},
  gold:(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,'#e0b840',nz(r,.88,1.08));},
  burlap:(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,'#c8ad80',((x+y)%2?.92:1)*nz(r,.94,1.04));},
  grassTop:(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,r()<.12?'#4f7a30':'#62903c',nz(r,.86,1.1));},
  grassSide:(P,r)=>{const e=[];for(let x=0;x<16;x++)e.push(2+Math.floor(r()*3));for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,y<e[x]?'#62903c':'#7a5a3c',nz(r,.85,1.08));},
  water:(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++)P(x,y,'#3a6a8a',(x+y*2)%7===0?1.25:nz(r,.92,1.04));},
  barrel:(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++){let f=nz(r,.86,1.06);if(x%4===3)f=.62;const band=y===2||y===13;P(x,y,band?'#55585e':'#8a6238',band?nz(r,.9,1.05):f);}},
  crate:(P,r)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++){const e=x<2||y<2||x>13||y>13||x===y||x===y+1;P(x,y,e?'#6e5034':'#b08a58',nz(r,.88,1.06));}},
};
function vm(kind){if(VXM[kind])return VXM[kind];let m;
  if(kind==='glass'){m=new THREE.MeshStandardMaterial({map:vxTex('glass'),emissiveMap:vxTex('glassE'),emissive:new THREE.Color(0xffa24a).convertSRGBToLinear(),emissiveIntensity:0,roughness:.2,metalness:.2});m.userData.glowScale=1.1;GLOW.push(m);}
  else m=new THREE.MeshStandardMaterial({map:vxTex(kind),roughness:kind==='iron'?.5:.92,metalness:kind==='iron'?.4:0});
  return VXM[kind]=m;}
/* faces: px nx py ny pz nz; end faces of logs get a full ring texture */
function vlog(par,w,h,d,axis,x,y,z){const bk=vm(axis==='y'?'bark':'barkH'),en=vm('logEnd'),ms=[bk,bk,bk,bk,bk,bk],ei=axis==='x'?[0,1]:axis==='y'?[2,3]:[4,5];ei.forEach(i=>ms[i]=en);
  const geo=new THREE.BoxGeometry(w,h,d),uv=geo.attributes.uv,fd=[[d,h,0,0],[d,h,0,0],[w,d,0,0],[w,d,0,0],[w,h,0,0],[w,h,0,0]];
  for(let f=0;f<6;f++)if(!ei.includes(f))for(let i=0;i<4;i++){const k=f*4+i;uv.setXY(k,uv.getX(k)*fd[f][0]/.8,uv.getY(k)*fd[f][1]/.8);}
  const m=shadowed(new THREE.Mesh(geo,ms));put(par,m,x,y,z);return m;}

function vFrame(wg,len,h,ops,mat){const pw=.2,xs=[-len/2+pw/2,len/2-pw/2];for(const op of ops)xs.push(op.x-op.w/2-pw/2,op.x+op.w/2+pw/2);xs.sort((a,b)=>a-b);
  const X=[];for(const x of xs)if(!X.length||x-X[X.length-1]>pw*1.2)X.push(x);
  for(const x of X)bx(wg,pw,h,.08,mat,x,h/2,.03);bx(wg,len,pw,.1,mat,0,h-pw/2,.035);
  let cur=-len/2;for(const op of ops.filter(q=>q.y0<.05).sort((a,b)=>a.x-b.x)){const a=op.x-op.w/2-pw;if(a>cur)bx(wg,a-cur,pw,.1,mat,(a+cur)/2,pw/2,.035);cur=op.x+op.w/2+pw;}if(len/2>cur)bx(wg,len/2-cur,pw,.1,mat,(len/2+cur)/2,pw/2,.035);
  for(let i=0;i<X.length-1;i++){const a=X[i],b=X[i+1];if(!ops.some(q=>q.x>a&&q.x<b))bx(wg,b-a-pw,pw*.8,.08,mat,(a+b)/2,h*.5,.03);}}
function vWin(par,op,t,o={}){const w=op.w,h=op.y1-op.y0,g=new THREE.Group();put(par,g,op.x,op.y0,0);const fm=o.frame||vm('planksDark');
  const gl=box(w,h,.04,vm('glass'),{s:.8,ox:0,oy:0,oz:0});gl.castShadow=false;put(g,gl,0,h/2,-t/2);
  bx(g,w,.08,t*.8,fm,0,.04,-t/2);bx(g,w,.08,t*.8,fm,0,h-.04,-t/2);bx(g,.08,h,t*.8,fm,-w/2+.04,h/2,-t/2);bx(g,.08,h,t*.8,fm,w/2-.04,h/2,-t/2);
  bx(g,.06,h,.07,fm,0,h/2,-t/2);bx(g,w,.06,.07,fm,0,h/2,-t/2);bx(g,w+.16,.08,.22,o.sill||fm,0,-.04,.06);
  if(o.shutter)for(const s of[-1,1])bx(g,w/2,h,.06,o.shutter,s*(w*.75+.06),h/2,.03);
  if(o.flowers){bx(g,w+.08,.18,.22,vm('planks'),0,-.17,.16);const n=Math.max(2,Math.round(w/.2));for(let i=0;i<n;i++){const fx=-w/2+.1+i*(w-.2)/(n-1);bx(g,.16,.14,.16,vm('leaves'),fx,-.01,.16);if(i%2===0)bx(g,.08,.08,.08,vm(['woolRed','gold','woolWhite'][i%3]),fx,.1,.17);}}
  if(o.lintel)bx(g,w+.4,.2,.08,o.lintel,0,h+.1,.04);return g;}
function vDoor(par,op,t,o={}){const w=op.w,h=op.y1-op.y0,g=new THREE.Group();put(par,g,op.x,op.y0,0);bx(g,w,h,.04,vm('dark'),0,h/2,-t+.03);
  const lf=new THREE.Group();put(g,lf,-w/2,0,-t*.45);if(o.open)lf.rotation.y=-o.open;bx(lf,w,h,.08,vm(o.leaf||'planksV'),w/2,h/2,0);
  for(const yy of[.2,.8])bx(lf,w*.8,.06,.03,vm('iron'),w*.45,h*yy,.05);bx(lf,.06,.1,.05,vm('iron'),w*.82,h*.48,.06);
  const fm=vm('planksDark');bx(g,.1,h,t,fm,-w/2+.05,h/2,-t/2);bx(g,.1,h,t,fm,w/2-.05,h/2,-t/2);bx(g,w+.24,.14,t+.04,o.lintel||fm,0,h+.07,-t/2);return g;}
function vWalls(p){const G=new THREE.Group(),faces={},defs={front:[0,p.Dz/2,0,p.Lx],back:[0,-p.Dz/2,Math.PI,p.Lx],right:[p.Lx/2,0,Math.PI/2,p.Dz],left:[-p.Lx/2,0,-Math.PI/2,p.Dz]};
  for(const k in defs){const[x,z,ry,len]=defs[k],ops=(p.ops&&p.ops[k])||[],side=k==='left'||k==='right',wg=new THREE.Group();wg.position.set(x,p.y||0,z);wg.rotation.y=ry;
    wg.add(wall(side?len-2*p.t:len,p.h,p.t,p.mat,ops,{s:.8,uo:0,vo:0}));if(p.frame)vFrame(wg,len,p.h,ops,p.frame);
    for(const op of ops){const oo=Object.assign({},p.unit||{},op);if(op.type==='door')vDoor(wg,op,p.t,oo);else if(op.type!=='hole')vWin(wg,op,p.t,oo);}
    G.add(wg);faces[k]=wg;}return{group:G,faces};}
/* stepped gable roof, ridge along x, base at y=0 */
function vRoof(W,L,H,mat,o={}){const g=new THREE.Group(),ov=o.ov??.7,ovL=o.ovL??.6,n=Math.max(2,Math.round(H/(o.step||.4))),st=H/n,half=W/2+ov,dw=half/n,len=L+2*ovL;
  for(let i=0;i<n;i++){const hw=half-i*dw,dp=Math.min(hw,dw*2.5);for(const s of[-1,1])bx(g,len,st,dp+.002,mat,0,i*st+st/2,s*(hw-dp/2));}
  for(const s of[-1,1])bx(g,len,st*.5,dw,mat,0,-st*.25,s*(half-dw/2));
  bx(g,len+.04,st*.5,dw*1.3,o.ridge||mat,0,n*st+st/4,0);
  if(o.gable)for(let i=0;i<n;i++){const hw=Math.min(half-i*dw-dw,W/2);if(hw<=.01)break;for(const s of[-1,1])bx(g,o.gt||.2,st,2*hw,o.gable,s*(L/2-(o.gt||.2)/2),i*st+st/2,0);}
  g.userData={n,st,dw,half};return g;}
function vArchRoof(W,L,H,mat,o={}){const g=new THREE.Group(),ov=o.ov??.6,ovL=o.ovL??.6,st=o.step||.4,n=Math.max(3,Math.round(H/st)),half=W/2+ov,len=L+2*ovL;
  const hwOf=i=>half*Math.sqrt(Math.max(0,1-Math.pow((i*st)/(n*st),2.2)));
  for(let i=0;i<n;i++){const hw=hwOf(i),nx=hwOf(i+1),dp=i>=n-2?hw:Math.min(hw,hw-nx+.7);if(dp>=hw)bx(g,len,st,2*hw,mat,0,i*st+st/2,0);else for(const s of[-1,1])bx(g,len,st,dp,mat,0,i*st+st/2,s*(hw-dp/2));
    if(o.gable){const fw=Math.min(hw-.05,W/2);if(fw>.05&&dp<hw)for(const s of[-1,1])bx(g,.2,st,2*fw,o.gable,s*(L/2-.1),i*st+st/2,0);}}
  for(const s of[-1,1])bx(g,len,st*.5,.4,mat,0,-st*.25,s*(half-.2));
  if(o.ridge)bx(g,len+.04,.12,Math.max(.8,hwOf(n-1)),o.ridge,0,n*st+.06,0);return g;}
function vPyramid(w,d,H,mat,step=.3){const g=new THREE.Group(),n=Math.max(2,Math.round(H/step));for(let i=0;i<n;i++){const k=1-i/n;bx(g,w*k,step,d*k,mat,0,i*step+step/2,0);}return g;}
/* props */
function vBarrel(par,x,z,water){const g=new THREE.Group();put(par,g,x,0,z);bx(g,.6,.8,.6,vm('barrel'),0,.4,0);bx(g,.52,.02,.52,vm(water?'water':'planks'),0,.805,0);return g;}
function vCrate(par,s,x,y,z,ry=0){const g=new THREE.Group();put(par,g,x,y,z,0,ry,0);bx(g,s,s,s,vm('crate'),0,s/2,0);return g;}
function vHay(par,x,y,z,ry=0){const m=bx(par,.8,.8,.8,vm('hay'),x,y+.4,z,0,ry,0);return m;}
function vBush(par,x,z,s=1){const g=new THREE.Group();put(par,g,x,0,z);const r=mulberry32(hashStr('b'+x+z));bx(g,.8*s,.6*s,.8*s,vm('leaves'),0,.3*s,0);for(let i=0;i<3;i++)bx(g,.4*s,.4*s,.4*s,vm('leaves'),(r()-.5)*.6*s,.6*s+r()*.1,(r()-.5)*.6*s);if(r()<.6)bx(g,.1,.1,.1,vm('woolRed'),.2*s,.62*s,.41*s);return g;}
function vPath(par,from,to,n){for(let i=0;i<n;i++){const t=(i+.5)/n;bx(par,.6,.06,.6,vm(i%2?'stoneBrick':'cobble'),from[0]+(to[0]-from[0])*t,.03,from[1]+(to[1]-from[1])*t);}}
const VFLAME=new THREE.MeshStandardMaterial({color:0xffd08a,emissive:0xffa040,emissiveIntensity:.3,roughness:.5});VFLAME.userData={glowScale:1.6,base:.3};GLOW.push(VFLAME);
function vLantern(par,lights,x,y,z){const g=new THREE.Group();put(par,g,x,y,z);bx(g,.06,.06,.3,vm('iron'),0,0,.15);bx(g,.24,.04,.24,vm('iron'),0,-.06,.3);bx(g,.24,.04,.24,vm('iron'),0,-.36,.3);
  const fl=new THREE.Mesh(new THREE.BoxGeometry(.18,.26,.18),VFLAME);fl.position.set(0,-.21,.3);g.add(fl);const pl=new THREE.PointLight(0xffb060,0,7,2);pl.position.set(0,-.21,.5);pl.userData.lamp=true;g.add(pl);lights.push(pl);return g;}
function vFence(par,L,x,z,ry=0){const g=new THREE.Group();put(par,g,x,0,z,0,ry,0);const n=Math.max(2,Math.round(L/1.2)+1);for(let i=0;i<n;i++)vlog(g,.16,1,.16,'y',-L/2+L*i/(n-1),.5,0);for(const y of[.45,.8])bx(g,L,.1,.08,vm('planks'),0,y,0);return g;}
function vWoodpile(par,cols,rows,x,z,ry=0){const g=new THREE.Group();put(par,g,x,0,z,0,ry,0);for(let r=0;r<rows;r++)for(let c=0;c<cols-(r%2);c++)vlog(g,.26,.26,.6,'z',-(cols-1)*.14+c*.28+(r%2)*.14,.13+r*.26,0);return g;}
function vCart(par,x,z,ry,load){const g=new THREE.Group();put(par,g,x,0,z,0,ry,0);bx(g,1.2,.1,2.2,vm('planks'),0,.7,0);
  for(const s of[-1,1]){bx(g,.08,.4,2.2,vm('planks'),s*.56,.95,0);bx(g,1.2,.4,.08,vm('planks'),0,.95,s*1.06);bx(g,.1,1,1,vm('planksDark'),s*.7,.55,-.1);bx(g,.12,.3,.3,vm('iron'),s*.72,.55,-.1);bx(g,.1,.1,1.7,vm('planksDark'),s*.4,.6,1.9,.21,0,0);}bx(g,.9,.1,.1,vm('planksDark'),0,.42,2.72);
  if(load==='hay'){vHay(g,0,.75,-.5);vHay(g,0,.75,.4);bx(g,.7,.4,.7,vm('hay'),0,1.75,0);}
  if(load==='sacks')for(let i=0;i<3;i++){bx(g,.4,.5,.36,vm('burlap'),(i-1)*.36,1,-.3+i*.3);bx(g,.16,.08,.16,vm('planksDark'),(i-1)*.36,1.29,-.3+i*.3);}return g;}
function vSack(par,x,z,y=0){bx(par,.4,.5,.36,vm('burlap'),x,y+.25,z);bx(par,.16,.08,.16,vm('planksDark'),x,y+.54,z);}
function vYard(par,w,d,x=0,z=0){const m=box(w,.02,d,vm('dirt'),{s:.8,ox:0,oy:0,oz:0});m.castShadow=false;put(par,m,x,.01,z);m.userData.noFrame=true;return m;}

/* ======================= the six blocky buildings ======================= */
function vxCottage(){const root=new THREE.Group(),L=[];root.userData.lights=L;const Lx=5.6,Dz=4.4,base=.4,hw=2.4,t=.2,H=2.6;
  vYard(root,8.8,7.2,0,.6);bx(root,Lx+.2,base,Dz+.2,vm('cobble'),0,base/2,0);
  const ops={front:[{type:'door',x:-.6,w:1,y0:0,y1:2},{x:-1.9,w:.6,y0:.8,y1:1.6,flowers:true},{x:1.3,w:1,y0:.8,y1:1.6,flowers:true}],back:[{x:0,w:.8,y0:.8,y1:1.6}],right:[{x:0,w:.8,y0:.8,y1:1.6}],left:[]};
  root.add(vWalls({Lx,Dz,y:base,h:hw,t,mat:vm('plaster'),ops,frame:vm('timber'),unit:{shutter:vm('planksDark')}}).group);
  const rf=vRoof(Dz,Lx,H,vm('thatch'),{ov:.7,ovL:.6,step:.4,gable:vm('plaster'),ridge:vm('hay')});put(root,rf,0,base+hw,0);
  for(const s of[-1,1]){bx(root,.1,.2,Dz,vm('timber'),s*(Lx/2+.04),base+hw+.1,0);}
  bx(root,.8,base+hw+H+.8,1.2,vm('cobble'),-Lx/2-.5,(base+hw+H+.8)/2,0);bx(root,1,.2,1.4,vm('stoneBrick'),-Lx/2-.5,base+hw+H+.9,0);
  bx(root,1.4,.2,.6,vm('cobble'),-.6,.1,Dz/2+.4);bx(root,1.2,.2,.4,vm('cobble'),-.6,.3,Dz/2+.2);
  vLantern(root,L,.2,base+2.1,Dz/2);vBarrel(root,2.4,Dz/2+.5,true);bx(root,1.2,.1,.4,vm('planks'),1.2,.45,Dz/2+.45);for(const s of[-1,1])bx(root,.1,.4,.4,vm('planks'),1.2+s*.5,.2,Dz/2+.45);
  vWoodpile(root,8,4,1,-Dz/2-.45);vBush(root,-2.6,Dz/2+.8);vBush(root,3.3,-1.2,.9);vBush(root,-4,-1.8,.8);return root;}

function vxCroft(){const root=new THREE.Group(),L=[];root.userData.lights=L;const Lx=4.8,Dz=4,hw=2.4,t=.4,H=2;
  vYard(root,8,6.4,0,.8);const sb=vm('stoneBrick');
  const ops={front:[{type:'door',x:0,w:1,y0:0,y1:2,lintel:sb},{x:-1.4,w:.6,y0:.8,y1:1.6,lintel:sb,sill:sb,shutter:vm('planksV')},{x:1.4,w:.6,y0:.8,y1:1.6,lintel:sb,sill:sb,shutter:vm('planksV')}],back:[{x:.8,w:.6,y0:.8,y1:1.6,lintel:sb,sill:sb}],right:[{x:-.6,w:.6,y0:1,y1:1.6,sill:sb}],left:[]};
  root.add(vWalls({Lx,Dz,y:0,h:hw,t,mat:vm('cobble'),ops}).group);
  for(let i=0,y=0;y<hw-.05;i++,y+=.4)for(const[sx,sz]of[[1,1],[1,-1],[-1,1],[-1,-1]]){const lx=i%2?.6:.4,lz=i%2?.4:.6;bx(root,lx,.4,lz,sb,sx*(Lx/2-lx/2+.02),y+.2,sz*(Dz/2-lz/2+.02));}
  const rf=vRoof(Dz,Lx,H,vm('slate'),{ov:.6,ovL:.5,step:.35,gable:vm('cobble'),gt:.4,ridge:sb});put(root,rf,0,hw,0);
  for(const s of[-1,1]){bx(root,.8,hw+H+.8,1,sb,s*(Lx/2-.4),(hw+H+.8)/2,0);bx(root,1,.16,1.2,vm('cobble'),s*(Lx/2-.4),hw+H+.88,0);}
  const sh=new THREE.Group();put(root,sh,Lx/2,0,-.3);for(const z of[-1.4,1])vlog(sh,.2,1.8,.2,'y',1.4,.9,z);for(let i=0;i<3;i++)bx(sh,1.8-i*.5,.2,3,vm('planksDark'),.9-i*.25,1.9+i*.2,-.2);
  vWoodpile(sh,6,5,.7,-.2,Math.PI/2);
  bx(root,1.4,.16,.6,sb,0,.08,Dz/2+.3);vLantern(root,L,.9,2,Dz/2);
  vBarrel(root,-Lx/2+.1,Dz/2+.5,true);vSack(root,-2.2,Dz/2+.5);vBush(root,2.1,Dz/2+.7);vBush(root,-3.2,-1.4,1.1);vFence(root,3.2,-1.8,Dz/2+2.2);return root;}

function vxTownhouse(){const root=new THREE.Group(),L=[];root.userData.lights=L;const Lx=5,Dz=5.6,h1=2.8,t=.3,band=.3,Lx2=5.6,Dz2=6,h2=2.4,H=3.2;
  vYard(root,8,8.4,0,1);const sb=vm('stoneBrick');
  const ops1={front:[{type:'hole',x:-.9,w:2.2,y0:.8,y1:2.2},{type:'door',x:1.6,w:1,y0:0,y1:2.2,lintel:sb}],back:[{x:0,w:.8,y0:.8,y1:1.6,sill:sb}],right:[{x:.8,w:.6,y0:.8,y1:1.6,sill:sb}],left:[{x:-.8,w:.6,y0:.8,y1:1.6,sill:sb}]};
  const W1=vWalls({Lx,Dz,y:0,h:h1,t,mat:vm('cobble'),ops:ops1});root.add(W1.group);const F=W1.faces.front;
  bx(F,2.2,1.4,.04,vm('dark'),-.9,1.5,-t+.03);bx(F,2.4,.2,.12,vm('timber'),-.9,2.3,.04);bx(F,2.3,.1,.6,vm('planks'),-.9,.8,.26);
  for(let i=0;i<2;i++)bx(F,2.4,.1,.5,vm('awning'),-.9,2.45-i*.12,.3+i*.42);
  for(let i=0;i<5;i++)bx(F,.14,.18,.14,vm(i%2?'gold':'woolWhite'),-1.8+i*.4,.94,.3);
  bx(root,Lx2,band,Dz2,vm('timber'),0,h1+band/2,.2);for(let i=0;i<10;i++)bx(root,.16,.16,.4,vm('timber'),-Lx2/2+.3+i*(Lx2-.6)/9,h1-.08,Dz/2+.15);
  const ops2={front:[{x:-1.4,w:1.2,y0:.8,y1:1.6},{x:1.4,w:1.2,y0:.8,y1:1.6}],back:[{x:.9,w:.8,y0:.8,y1:1.6}],right:[{x:-.6,w:.8,y0:.8,y1:1.6}],left:[{x:.6,w:.8,y0:.8,y1:1.6}]};
  const W2=vWalls({Lx:Lx2,Dz:Dz2,y:h1+band,h:h2,t:.2,mat:vm('plasterOchre'),ops:ops2,frame:vm('timber')});W2.group.position.z=.2;root.add(W2.group);
  for(const k of['front','back'])for(let x=-2.4;x<=2.41;x+=.8)if(Math.abs(x)>.3&&!ops2[k].some(o=>Math.abs(o.x-x)<o.w/2+.15))bx(W2.faces[k],.12,h2-.4,.06,vm('timber'),x,h2/2,.04);
  const rf=vRoof(Lx2,Dz2,H,vm('tiles'),{ov:.6,ovL:.5,step:.4,gable:vm('plasterOchre'),ridge:vm('timber')});put(root,rf,0,h1+band+h2,.2,0,Math.PI/2,0);
  vWin(W2.faces.front,{x:0,w:.8,y0:h2+.4,y1:h2+1.2},.2,{});bx(W2.faces.front,.1,.1,.1,vm('dark'),0,h2+.8,-.25);
  bx(root,.8,H+.8,.8,sb,1.4,h1+band+h2+(H+.8)/2,-1.6);bx(root,1,.16,1,vm('cobble'),1.4,h1+band+h2+H+.88,-1.6);
  const sg=new THREE.Group();put(F,sg,Lx/2-.2,h1-.3,0);bx(sg,.06,.06,1,vm('iron'),0,0,.5);bx(sg,.08,.6,.6,vm('planks'),0,-.36,.7);bx(sg,.1,.3,.3,vm('gold'),0,-.36,.7);
  bx(root,1.2,.16,.5,sb,1.6,.08,Dz/2+.25);vLantern(root,L,.8,2.3,Dz/2);vBarrel(root,-2.3,Dz/2+.6);vBarrel(root,-1.6,Dz/2+.8);vCrate(root,.6,2.6,0,Dz/2+.6,.3);vCrate(root,.45,2.6,.6,Dz/2+.6,.6);vSack(root,-1.9,Dz/2+1.4);
  return root;}

function vxCabin(){const root=new THREE.Group(),L=[];root.userData.lights=L;const Lx=5.2,Dz=4.4,base=.2,hw=2.4,t=.3,H=2;
  vYard(root,8.8,7.6,.2,.6);bx(root,Lx+.1,base,Dz+.1,vm('cobble'),0,base/2,0);
  const ops={front:[{type:'door',x:-.6,w:1,y0:0,y1:2},{x:1.4,w:.8,y0:.8,y1:1.6,shutter:vm('woolRed')}],back:[{x:.6,w:.6,y0:.8,y1:1.6}],right:[{x:.2,w:.8,y0:.8,y1:1.6}],left:[]};
  root.add(vWalls({Lx:Lx-.4,Dz:Dz-.4,y:base,h:hw,t,mat:vm('logH'),ops,unit:{frame:vm('planks')}}).group);
  for(const[sx,sz]of[[1,1],[1,-1],[-1,1],[-1,-1]])vlog(root,.4,hw+.2,.4,'y',sx*(Lx/2-.2),base+(hw+.2)/2,sz*(Dz/2-.2));
  const rf=vRoof(Dz,Lx,H,vm('shingle'),{ov:.8,ovL:.6,step:.4,gable:vm('planksV'),ridge:vm('planksDark')});put(root,rf,0,base+hw,0);
  const cg=new THREE.Group();put(root,cg,-Lx/2-.5,0,.2);bx(cg,1.2,1.6,1.2,vm('cobble'),0,.8,0);bx(cg,.8,base+hw+H+.6-1.6,.8,vm('cobble'),.1,1.6+(base+hw+H+.6-1.6)/2,0);bx(cg,1,.16,1,vm('stoneBrick'),.1,base+hw+H+.66,0);
  vlog(root,1.2,.2,.4,'x',-.6,.1,Dz/2+.25);vLantern(root,L,.3,base+1.9,Dz/2-.2);
  const cb=new THREE.Group();put(root,cb,2.1,0,Dz/2+1.6);vlog(cb,.6,.6,.6,'y',0,.3,0);const ax=TOOLS.Axe.build();put(cb,ax,-.05,.95,.05,1.25,.4,0);
  vWoodpile(root,12,5,Lx/2+.45,-.1,Math.PI/2);vBarrel(root,Lx/2+.1,Dz/2+.5,true);
  const sh=new THREE.Group();put(root,sh,-1.9,0,Dz/2+1.8,0,.4,0);for(const s of[-1,1])bx(sh,.12,.7,.12,vm('planksDark'),s*.6,.35,0);vlog(sh,1.8,.3,.3,'x',0,.85,0);
  vBush(root,-3.2,-1.6,1.1);vBush(root,3.6,1.9,.8);vBush(root,1.4,-3,.9);return root;}

function vxBarn(){const root=new THREE.Group(),L=[];root.userData.lights=L;const Lx=12,Dz=7.6,hw=3.6,t=.2,H=3.6;
  vYard(root,15.2,11.2,0,1.2);const door={type:'hole',x:0,w:3.6,y0:0,y1:3.1};
  const W=vWalls({Lx,Dz,y:0,h:hw,t,mat:vm('planksV'),ops:{front:[door,{x:-4,w:.6,y0:2.2,y1:3}, {x:4,w:.6,y0:2.2,y1:3}],back:[{type:'door',x:3.4,w:1.2,y0:0,y1:2.2,leaf:'planks'}]}});root.add(W.group);
  root.add(vWalls({Lx:Lx+.16,Dz:Dz+.16,y:0,h:.6,t:.3,mat:vm('cobble'),ops:{front:[Object.assign({},door,{y1:.6})],back:[{type:'hole',x:3.4,w:1.2,y0:0,y1:.6}]}}).group);
  for(const x of[-6,-3,3,6])for(const z of[-1,1])vlog(root,.3,hw,.3,'y',x*(Lx/12)-Math.sign(x)*.1,hw/2,z*(Dz/2+.04));
  for(const x of[-1,1])vlog(root,.3,hw,.3,'y',x*(Lx/2+.04),hw/2,0);
  const F=W.faces.front;for(const s of[-1,1]){const lf=new THREE.Group(),lw=door.w/2;put(F,lf,s*lw,0,.02);bx(lf,lw,door.y1,.1,vm('planksV'),-s*lw/2,door.y1/2,0);for(const y of[.4,door.y1/2,door.y1-.4])bx(lf,lw-.1,.16,.05,vm('timber'),-s*lw/2,y,.07);if(s>0)lf.rotation.y=-1.2;}
  bx(F,door.w+.4,.3,.16,vm('timber'),0,door.y1+.15,.05);
  bx(root,Lx-.4,.04,Dz-.4,vm('dirt'),0,.02,0);vHay(root,-2.4,0,-1.4);vHay(root,-3.2,0,-1.4);vHay(root,-2.8,.8,-1.4);vHay(root,-1.6,0,-2.4);vCrate(root,.7,2.4,0,-2.2);
  const rf=vArchRoof(Dz,Lx,3.6,vm('thatch'),{ov:.7,ovL:.6,step:.4,gable:vm('planksV'),ridge:vm('hay')});put(root,rf,0,hw,0);
  bx(root,.24,1.4,1.4,vm('dark'),Lx/2+.02,hw+1.1,0);bx(root,.2,1.4,.7,vm('planksV'),Lx/2+.5,hw+1.1,.95,0,.9,0);bx(root,.5,.4,.8,vm('hay'),Lx/2+.15,hw+.6,0);
  bx(root,2,.2,.2,vm('timber'),Lx/2+.8,hw+2.1,0);bx(root,.04,1.5,.04,vm('planks'),Lx/2+1.6,hw+1.3,0);
  vLantern(root,L,-2.3,2.7,Dz/2);
  for(const[x,z]of[[-8,1.2],[-8.8,1.2],[-8,2],[-8.8,2],[-8.4,-2.2],[-7.6,-2.2]])vHay(root,x,0,z);vHay(root,-8.4,.8,1.6);vHay(root,-8,.8,-2.2);
  vCart(root,4.2,Dz/2+2.6,-.6,'hay');const tr=new THREE.Group();put(root,tr,6.8,0,1.2,0,Math.PI/2,0);bx(tr,1.6,.5,.6,vm('planksDark'),0,.25,0);bx(tr,1.4,.04,.4,vm('water'),0,.48,0);
  vBarrel(root,6.7,-1.1);vFence(root,5,6.9,-.2,Math.PI/2);return root;}

function vxGranary(){const root=new THREE.Group(),L=[];root.userData.lights=L;const Lx=4,Dz=3.2,fy=1,hw=2,t=.2;
  vYard(root,6.8,6.4,0,.8);
  for(const x of[-1.6,0,1.6])for(const z of[-1.2,0,1.2]){bx(root,.3,.6,.3,vm('stoneBrick'),x,.3,z);bx(root,.7,.12,.7,vm('stoneBrick'),x,.66,z);}
  for(const z of[-1.2,0,1.2])vlog(root,Lx+.2,.2,.2,'x',0,.82,z);bx(root,Lx,.08,Dz,vm('planks'),0,fy-.04,0);
  const ops={front:[{type:'door',x:.8,w:.8,y0:0,y1:1.8,leaf:'planksDark'}],back:[],right:[{type:'hole',x:0,w:.8,y0:1.2,y1:1.6}],left:[]};
  const W=vWalls({Lx,Dz,y:fy,h:hw,t,mat:vm('planks'),ops});root.add(W.group);
  bx(W.faces.right,.8,.4,.04,vm('dark'),0,1.4,-t+.03);for(let i=0;i<3;i++)bx(W.faces.right,.8,.06,.08,vm('planksDark'),0,1.26+i*.13,-.06);
  for(const[sx,sz]of[[1,1],[1,-1],[-1,1],[-1,-1]])vlog(root,.24,hw,.24,'y',sx*Lx/2,fy+hw/2,sz*Dz/2);
  bx(root,Lx+.3,.16,Dz+.3,vm('timber'),0,fy+hw+.08,0);
  const rf=vPyramid(Lx+1.6,Dz+1.6,2.1,vm('tiles'),.3);bx(root,Lx+1.6,.12,Dz+1.6,vm('tiles'),0,fy+hw+.1,0);put(root,rf,0,fy+hw+.16,0);bx(root,.16,.4,.16,vm('timber'),0,fy+hw+2.4,0);bx(root,.24,.24,.24,vm('gold'),0,fy+hw+2.6,0);
  const stp=new THREE.Group();put(root,stp,.8,0,Dz/2);for(let i=0;i<4;i++){const z=.15+(3-i)*.3;bx(stp,.8,.06,.3,vm('planks'),0,(i+1)*.2-.03,z);bx(stp,.8,(i+1)*.2-.06,.3,vm('planksDark'),0,((i+1)*.2-.06)/2,z);}bx(stp,.8,.2,.3,vm('planks'),0,.9,-.01);
  vSack(root,-.6,Dz/2+.6);vSack(root,-1.05,Dz/2+.8);vSack(root,-.8,Dz/2+.65,.5);vSack(root,-1.5,Dz/2+.4);
  vBarrel(root,-1.9,-Dz/2-.6);vCrate(root,.6,2.4,0,-.4,.4);vCart(root,3.8,-1.4,-2.6,'sacks');vBush(root,-2.9,-.4,.9);
  vLantern(root,L,1.4,fy+1.65,Dz/2);return root;}

for(let i=ASSETS.length-1;i>=0;i--)if(ASSETS[i].folder==='buildings/medieval')ASSETS.splice(i,1);
FOLDERS['buildings/medieval'].blurb='Village and farmstead, in blocks';
[['vx-cottage','Half-timbered cottage',vxCottage,'half-timbered-cottage','Plaster and oak frame on a cobble plinth, stepped thatch, flower boxes and a cobble chimney.'],
 ['vx-croft','Stone croft',vxCroft,'stone-croft','Cobblestone walls with brick quoins, stepped slate roof, twin chimneys and a log lean-to.'],
 ['vx-townhouse',"Merchant's townhouse",vxTownhouse,'merchants-townhouse','Cobble shop floor with a striped awning, jettied ochre upper storey, stepped tile roof and a gold trade sign.'],
 ['vx-cabin',"Woodcutter's cabin",vxCabin,'woodcutters-cabin','Stacked-log walls with log corner posts, shingle roof, cobble chimney, and an axe left in the chopping block.'],
 ['vx-barn','Thatched barn',vxBarn,'thatched-barn','Board walls on a cobble plinth with log posts under a wide rounded thatch, open wagon door, hayloft and stacks of hay blocks.'],
 ['vx-granary','Staddle granary',vxGranary,'staddle-granary','Plank store on nine capped stone stilts under a stepped pyramid of tiles, with steps up to a dark oak door.'],
].forEach(([id,name,build,pair,desc])=>{ASSETS.push({id,folder:'buildings/medieval',name,build,desc});});
