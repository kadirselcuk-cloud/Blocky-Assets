/* ================= Asset Forge — procedural asset library ================= */
'use strict';

/* ---------- deterministic randomness ---------- */
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function hashStr(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;}
let R=mulberry32(1);
function seed(n){R=mulberry32(n);}
const rnd=(a=0,b=1)=>a+(b-a)*R();

/* ---------- canvas texture kit ---------- */
function hexRGB(h){const n=parseInt(h.slice(1),16);return[n>>16&255,n>>8&255,n&255];}
function col(h,f=1,a=1){const[r,g,b]=hexRGB(h);const c=v=>Math.max(0,Math.min(255,Math.round(v*f)));return `rgba(${c(r)},${c(g)},${c(b)},${a})`;}
function wrapDraw(S,x,y,w,h,fn){for(const dx of[-S,0,S])for(const dy of[-S,0,S]){if(x+dx+w<0||x+dx>S||y+dy+h<0||y+dy>S)continue;fn(x+dx,y+dy);}}
function speckle(g,S,r,n,colors,a0=.05,a1=.2,s0=1,s1=3){for(let i=0;i<n;i++){g.fillStyle=colors[Math.floor(r()*colors.length)];g.globalAlpha=a0+(a1-a0)*r();const s=s0+(s1-s0)*r();g.fillRect(r()*S,r()*S,s,s);}g.globalAlpha=1;}
function blotches(g,S,r,n,color,r0=20,r1=80,a0=.03,a1=.1){for(let i=0;i<n;i++){const x=r()*S,y=r()*S,rr=r0+(r1-r0)*r(),a=a0+(a1-a0)*r();wrapDraw(S,x-rr,y-rr,2*rr,2*rr,(X,Y)=>{const cx=X+rr,cy=Y+rr;const gr=g.createRadialGradient(cx,cy,0,cx,cy,rr);gr.addColorStop(0,col(color,1,a));gr.addColorStop(1,col(color,1,0));g.fillStyle=gr;g.fillRect(X,Y,2*rr,2*rr);});}}
function strokes(g,S,r,n,colors,l0,l1,w0,w1,a0,a1,angFn){for(let i=0;i<n;i++){const x=r()*S,y=r()*S,len=l0+(l1-l0)*r(),ang=angFn(r),c=colors[Math.floor(r()*colors.length)],a=a0+(a1-a0)*r(),lw=w0+(w1-w0)*r();const dx=Math.sin(ang)*len,dy=Math.cos(ang)*len;wrapDraw(S,Math.min(x,x+dx)-2,Math.min(y,y+dy)-2,Math.abs(dx)+4,Math.abs(dy)+4,(X,Y)=>{g.strokeStyle=col(c,1,a);g.lineWidth=lw;g.beginPath();g.moveTo(X,Y);g.lineTo(X+dx,Y+dy);g.stroke();});}}
function rrPath(g,x,y,w,h,rad,j){g.beginPath();g.moveTo(x+rad+j[0],y+j[1]);g.lineTo(x+w-rad+j[2],y+j[3]);g.quadraticCurveTo(x+w,y,x+w+j[4]*.3,y+rad);g.lineTo(x+w+j[4],y+h-rad);g.quadraticCurveTo(x+w,y+h,x+w-rad,y+h+j[5]);g.lineTo(x+rad,y+h+j[6]);g.quadraticCurveTo(x,y+h,x+j[7],y+h-rad);g.lineTo(x+j[7]*.5,y+rad);g.quadraticCurveTo(x,y,x+rad+j[0],y+j[1]);g.closePath();}

const TEXCACHE={};
function makeTex(key,draw,size=512){
  if(TEXCACHE[key])return TEXCACHE[key];
  const c=document.createElement('canvas');c.width=c.height=size;const g=c.getContext('2d');
  draw(g,size,mulberry32(hashStr(key)));
  const map=new THREE.CanvasTexture(c);map.wrapS=map.wrapT=THREE.RepeatWrapping;map.encoding=THREE.sRGBEncoding;map.anisotropy=8;
  const bump=new THREE.CanvasTexture(c);bump.wrapS=bump.wrapT=THREE.RepeatWrapping;
  return TEXCACHE[key]={map,bump,canvas:c};
}

/* texture recipes — every texture represents a 2 m × 2 m patch unless noted.
   Roof textures: courses run horizontally, "down the slope" is vertical. */
const TEX={
  plaster:()=>makeTex('plaster',(g,S,r)=>{g.fillStyle='#e4d8bf';g.fillRect(0,0,S,S);
    blotches(g,S,r,70,'#a8946c',30,120,.05,.14);blotches(g,S,r,40,'#fff9ea',20,70,.06,.16);blotches(g,S,r,10,'#7d8a5a',20,50,.03,.08);
    speckle(g,S,r,10000,['#8d7b5c','#fffaf0','#a89270'],.05,.25,1,2.5);
    g.strokeStyle='rgba(90,75,55,.35)';g.lineWidth=1;
    for(let i=0;i<7;i++){let x=40+r()*(S-80),y=40+r()*(S-120);g.beginPath();g.moveTo(x,y);for(let k=0;k<7;k++){x+=(r()-.5)*24;y+=r()*14;g.lineTo(x,y);}g.stroke();}}),
  timber:()=>makeTex('timber',(g,S,r)=>{g.fillStyle='#3b291c';g.fillRect(0,0,S,S);
    for(let i=0;i<300;i++){const y=r()*S,a=.05+r()*.18,c=r()<.5?'#1a110a':'#6e4d33',lw=.5+r()*2.5,ph=r()*6.28,amp=1+r()*3;g.strokeStyle=col(c,1,a);g.lineWidth=lw;g.beginPath();for(let x=0;x<=S;x+=16){const yy=y+Math.sin(x/S*Math.PI*4+ph)*amp;x?g.lineTo(x,yy):g.moveTo(x,yy);}g.stroke();}
    blotches(g,S,r,30,'#120b06',20,60,.05,.15);speckle(g,S,r,4000,['#000','#8a6a4a'],.05,.15,1,2);}),
  planks:()=>planksTex('planks','#7a5a3c',8,{nails:[.12,.88]}),
  planksDark:()=>planksTex('planksDark','#5e4c3c',8,{joints:true}),
  door:()=>planksTex('door','#6a4428',10,{}),
  staves:()=>planksTex('staves','#80562f',8,{}),
  weather:()=>makeTex('weather',(g,S,r)=>{const n=8,bh=S/n;for(let i=0;i<n;i++){const y=i*bh,f=.85+r()*.3;g.fillStyle=col('#7d6249',f);g.fillRect(0,y,S,bh);
      for(let k=0;k<25;k++){const yy=y+4+r()*(bh-8);g.strokeStyle=col(r()<.5?'#2a1a10':'#c4a27c',1,.06+r()*.12);g.lineWidth=.5+r()*1.5;g.beginPath();const ph=r()*6.28;for(let x=0;x<=S;x+=16){const v=yy+Math.sin(x/S*Math.PI*6+ph)*1.5;x?g.lineTo(x,v):g.moveTo(x,v);}g.stroke();}
      const gr=g.createLinearGradient(0,y,0,y+bh);gr.addColorStop(0,'rgba(255,240,215,.16)');gr.addColorStop(.75,'rgba(0,0,0,0)');gr.addColorStop(1,'rgba(10,5,2,.55)');g.fillStyle=gr;g.fillRect(0,y,S,bh);
      const jx=r()*S;g.fillStyle='rgba(15,8,4,.6)';g.fillRect(jx,y,2,bh);}
    speckle(g,S,r,4000,['#000','#fff'],.03,.08,1,2);}),
  stone:()=>stoneTex('stone',{mortar:'#8b8576',colors:['#9a9384','#a79f8c','#8a8478','#b3aa95','#7e7a70','#a0937a'],rowH:[38,62],w:[55,120],jit:8,gap:5}),
  ashlar:()=>stoneTex('ashlar',{mortar:'#a49c88',colors:['#c8bda3','#bfb398','#d3c8ae','#b8ab90'],rowH:[64,64],w:[100,150],jit:2,gap:4,rad:3}),
  field:()=>stoneTex('field',{mortar:'#6f6a60',colors:['#8c8577','#9b9283','#7a756c','#a69a83','#6f6c66','#8d7e6a'],rowH:[30,70],w:[40,100],jit:14,gap:7}),
  thatch:()=>makeTex('thatch',(g,S,r)=>{g.fillStyle='#5e4626';g.fillRect(0,0,S,S);
    strokes(g,S,r,9000,['#7a6034','#6a5230','#8a7040'],30,80,1,2.4,.4,.8,r=>(r()-.5)*.12);
    strokes(g,S,r,14000,['#b8955a','#a3824b','#c4a468','#8c6d3e','#9a8558','#ad9a6e'],22,64,.6,1.6,.35,.8,r=>(r()-.5)*.16);
    for(let k=0;k<3;k++){const y=k*S/3;const gr=g.createLinearGradient(0,y,0,y+S/3);gr.addColorStop(0,'rgba(30,20,8,0)');gr.addColorStop(.85,'rgba(30,20,8,0)');gr.addColorStop(1,'rgba(30,20,8,.22)');g.fillStyle=gr;g.fillRect(0,y,S,S/3);}
    blotches(g,S,r,30,'#4a5428',15,60,.06,.18);blotches(g,S,r,30,'#2e2214',20,80,.06,.16);blotches(g,S,r,15,'#d8c48e',20,60,.04,.1);}),
  tiles:()=>makeTex('tiles',(g,S,r)=>{g.fillStyle='#2e150c';g.fillRect(0,0,S,S);const rows=8,cols=10,rh=S/rows,tw=S/cols;
    const pal=['#a4502f','#b35d36','#8f4329','#9c4b2c','#ba6a40','#874030'];const cs=[];for(let i=0;i<rows;i++){cs.push([]);for(let j=0;j<cols;j++)cs[i].push([pal[Math.floor(r()*pal.length)],.85+r()*.3]);}
    for(let row=rows-1;row>=0;row--){const y=row*rh,off=(row%2)*tw/2;
      for(let i=-1;i<=cols;i++){const x=i*tw+off,[c,f]=cs[row][(i+cols)%cols];
        wrapDraw(S,x,y,tw,rh+14,(X,Y)=>{const h=rh+10;
          g.fillStyle='rgba(0,0,0,.35)';g.fillRect(X+2,Y+h-2,tw-2,6);
          g.beginPath();g.moveTo(X+1,Y);g.lineTo(X+tw-1,Y);g.lineTo(X+tw-1,Y+h-7);g.quadraticCurveTo(X+tw-1,Y+h,X+tw/2,Y+h);g.quadraticCurveTo(X+1,Y+h,X+1,Y+h-7);g.closePath();
          const gr=g.createLinearGradient(X,0,X+tw,0);gr.addColorStop(0,col(c,f*.72));gr.addColorStop(.45,col(c,f*1.12));gr.addColorStop(1,col(c,f*.7));g.fillStyle=gr;g.fill();
          const gv=g.createLinearGradient(0,Y,0,Y+h);gv.addColorStop(0,'rgba(0,0,0,.25)');gv.addColorStop(.3,'rgba(0,0,0,0)');gv.addColorStop(1,'rgba(255,220,180,.08)');g.fillStyle=gv;g.fill();});}}
    speckle(g,S,r,6000,['#000','#f3d2b0','#3a4a2a'],.05,.15,1,2.5);blotches(g,S,r,18,'#4c5a2c',10,40,.06,.2);}),
  shingles:()=>shingleTex('shingles',['#6e5a45','#7d6750','#5f4c3a','#86705a','#6a5848'],8,[34,62]),
  slate:()=>shingleTex('slate',['#4b5560','#57616b','#424b55','#5d6670','#3d454e'],10,[52,84]),
  grass:()=>makeTex('grass',(g,S,r)=>{g.fillStyle='#52703a';g.fillRect(0,0,S,S);
    blotches(g,S,r,50,'#7a8a40',30,100,.08,.2);blotches(g,S,r,40,'#2f4a24',30,90,.08,.2);
    strokes(g,S,r,22000,['#6a8a45','#4a6a32','#85a055','#3c5a2a','#9aa860'],3,9,.6,1.4,.35,.8,r=>(r()-.5)*1.4);}),
  dirt:()=>makeTex('dirt',(g,S,r)=>{g.fillStyle='#6f5a42';g.fillRect(0,0,S,S);blotches(g,S,r,60,'#3f3022',20,80,.08,.2);blotches(g,S,r,40,'#9a8466',20,60,.06,.16);
    speckle(g,S,r,12000,['#2a2018','#a89070','#5a4a3a'],.1,.4,1,3);
    for(let i=0;i<160;i++){const x=r()*S,y=r()*S,w=2+r()*6,h=2+r()*4,c=['#8a8070','#9a9080','#6a6258'][Math.floor(r()*3)];g.fillStyle=col(c,1,.8);g.beginPath();g.ellipse(x,y,w,h,r()*3,0,7);g.fill();}}),
  hay:()=>makeTex('hay',(g,S,r)=>{g.fillStyle='#a8873e';g.fillRect(0,0,S,S);strokes(g,S,r,14000,['#d9bb6a','#c9a550','#e8d08a','#a8873e','#b89a4e'],10,40,.6,1.6,.4,.9,r=>(r()-.5)*1.2);blotches(g,S,r,20,'#6a5426',20,60,.05,.15);}),
  bark:()=>makeTex('bark',(g,S,r)=>{g.fillStyle='#4a3727';g.fillRect(0,0,S,S);strokes(g,S,r,5000,['#2a1d14','#6a5440','#3a2a1e','#7a6450'],15,60,1,4,.3,.7,r=>(r()-.5)*.15);
    for(let i=0;i<80;i++){const x=r()*S,y=r()*S,l=20+r()*60;g.strokeStyle='rgba(15,10,6,.7)';g.lineWidth=1.5+r()*2;g.beginPath();g.moveTo(x,y);g.lineTo(x+(r()-.5)*6,y+l);g.stroke();}blotches(g,S,r,15,'#6a7040',15,40,.06,.15);}),
  endgrain:()=>makeTex('endgrain',(g,S,r)=>{g.fillStyle='#c09a64';g.fillRect(0,0,S,S);const c=S/2;
    for(let k=1;k<34;k++){const rad=k*S/72+r()*2;g.strokeStyle=`rgba(${110+r()*30|0},${68+r()*20|0},35,${.25+r()*.35})`;g.lineWidth=1+r()*2.2;g.beginPath();for(let a=0;a<=64;a++){const t=a/64*Math.PI*2,w=rad+Math.sin(t*3+k)*1.5;const x=c+Math.cos(t)*w,y=c+Math.sin(t)*w;a?g.lineTo(x,y):g.moveTo(x,y);}g.stroke();}
    g.strokeStyle='rgba(50,30,15,.6)';g.lineWidth=2;for(let i=0;i<3;i++){const a=r()*6.28;g.beginPath();g.moveTo(c+Math.cos(a)*10,c+Math.sin(a)*10);g.lineTo(c+Math.cos(a)*S*.42,c+Math.sin(a)*S*.42);g.stroke();}
    g.lineWidth=S*.07;g.strokeStyle='#3d2a1c';g.beginPath();g.arc(c,c,S/2-S*.035,0,7);g.stroke();},256),
  burlap:()=>makeTex('burlap',(g,S,r)=>{g.fillStyle='#b99d72';g.fillRect(0,0,S,S);for(let i=0;i<S;i+=4){g.fillStyle=`rgba(80,60,35,${.15+r()*.15})`;g.fillRect(i,0,1.5,S);g.fillRect(0,i,S,1.5);}blotches(g,S,r,30,'#6a5434',20,60,.05,.15);speckle(g,S,r,5000,['#3a2a18','#e0c89a'],.1,.3,1,2);},256),
  glass:()=>leadedTex('glass',false),
  glassE:()=>leadedTex('glassE',true),
  sign:()=>makeTex('sign',(g,S,r)=>{g.fillStyle='#5a3a20';g.fillRect(0,0,S,S);for(let i=0;i<40;i++){g.strokeStyle=`rgba(20,10,5,${.1+r()*.2})`;g.lineWidth=1+r()*2;const y=r()*S;g.beginPath();g.moveTo(0,y);g.lineTo(S,y+(r()-.5)*8);g.stroke();}
    g.fillStyle='#2c4a3a';g.fillRect(S*.08,S*.08,S*.84,S*.84);g.strokeStyle='#c9a24a';g.lineWidth=S*.03;g.strokeRect(S*.13,S*.13,S*.74,S*.74);
    g.fillStyle='#d9b24e';g.beginPath();g.arc(S*.38,S*.5,S*.14,0,7);g.fill();g.fillStyle='#2c4a3a';g.beginPath();g.arc(S*.38,S*.5,S*.07,0,7);g.fill();g.fillStyle='#d9b24e';g.fillRect(S*.5,S*.46,S*.3,S*.08);g.fillRect(S*.66,S*.54,S*.05,S*.1);g.fillRect(S*.74,S*.54,S*.05,S*.13);
    speckle(g,S,r,3000,['#000','#fff'],.05,.12,1,2);},256),
};
function planksTex(key,base,boards,opts){return makeTex(key,(g,S,r)=>{const bw=S/boards;
  for(let i=0;i<boards;i++){const x0=i*bw,f=.8+r()*.35;g.fillStyle=col(base,f);g.fillRect(x0,0,bw,S);
    for(let k=0;k<45;k++){const x=x0+r()*bw,c=r()<.55?'#1a0f08':'#c9a77f',a=.05+r()*.13,lw=.5+r()*1.5,ph=r()*6.28,amp=r()*2;g.strokeStyle=col(c,1,a);g.lineWidth=lw;g.beginPath();g.moveTo(x,0);for(let y=16;y<=S;y+=16)g.lineTo(x+Math.sin(y/S*Math.PI*4+ph)*amp,y);g.stroke();}
    if(r()<.55){const kx=x0+bw*(.3+r()*.4),ky=r()*S,kr=5+r()*6;const gr=g.createRadialGradient(kx,ky,0,kx,ky,kr*2);gr.addColorStop(0,'rgba(30,18,10,.75)');gr.addColorStop(.5,'rgba(30,18,10,.3)');gr.addColorStop(1,'rgba(30,18,10,0)');g.fillStyle=gr;g.fillRect(kx-kr*2,ky-kr*2,kr*4,kr*4);}
    const gv=g.createLinearGradient(x0,0,x0+bw,0);gv.addColorStop(0,'rgba(0,0,0,.25)');gv.addColorStop(.15,'rgba(0,0,0,0)');gv.addColorStop(.85,'rgba(0,0,0,0)');gv.addColorStop(1,'rgba(0,0,0,.2)');g.fillStyle=gv;g.fillRect(x0,0,bw,S);
    g.fillStyle='rgba(12,7,4,.9)';g.fillRect(x0,0,2.5,S);g.fillStyle='rgba(255,240,220,.08)';g.fillRect(x0+2.5,0,1.5,S);
    if(opts.joints&&r()<.6){const jy=r()*S;g.fillStyle='rgba(12,7,4,.75)';g.fillRect(x0,jy,bw,2.5);}
    if(opts.nails)for(const ny of opts.nails)for(const nx of[.3,.7]){g.fillStyle='rgba(25,25,28,.85)';g.beginPath();g.arc(x0+bw*nx,ny*S,2.2,0,7);g.fill();}}
  blotches(g,S,r,20,'#20140a',20,70,.04,.12);speckle(g,S,r,4000,['#000','#fff'],.03,.08,1,2);});}
function stoneTex(key,o){return makeTex(key,(g,S,r)=>{g.fillStyle=o.mortar;g.fillRect(0,0,S,S);speckle(g,S,r,6000,['#000','#fff'],.05,.15,1,2);
  const rows=[];let y=0;while(y<S-1){let h=o.rowH[0]+r()*(o.rowH[1]-o.rowH[0]);if(S-(y+h)<o.rowH[0])h=S-y;rows.push([y,h]);y+=h;}
  for(const[ry,rh]of rows){const x0=-r()*60;let x=x0;while(x<x0+S-1){let w=o.w[0]+r()*(o.w[1]-o.w[0]);if(x0+S-(x+w)<o.w[0]*.6)w=x0+S-x;
      const c=o.colors[Math.floor(r()*o.colors.length)],f=.85+r()*.3,gap=o.gap,J=[];for(let k=0;k<8;k++)J.push((r()-.5)*o.jit);const rad=o.rad??Math.min(w,rh)*.28;
      const sx=x+gap/2,sy=ry+gap/2,sw=w-gap,sh=rh-gap;
      wrapDraw(S,sx-10,sy-10,sw+20,sh+20,(X,Y)=>{rrPath(g,X,Y,sw,sh,rad,J);const gr=g.createLinearGradient(0,Y,0,Y+sh);gr.addColorStop(0,col(c,f*1.14));gr.addColorStop(1,col(c,f*.78));g.fillStyle=gr;g.fill();g.strokeStyle='rgba(20,18,14,.35)';g.lineWidth=2;g.stroke();});
      x+=w;}}
  speckle(g,S,r,9000,['#3a3630','#e8e2d0','#6a6658'],.06,.22,1,2.5);blotches(g,S,r,25,'#4a5a30',15,50,.05,.14);blotches(g,S,r,25,'#2a2620',20,70,.05,.12);});}
function shingleTex(key,pal,rows,wr){return makeTex(key,(g,S,r)=>{g.fillStyle='#1c1814';g.fillRect(0,0,S,S);const rh=S/rows;
  for(let row=rows-1;row>=0;row--){const y=row*rh,ws=[];let tot=0;while(tot<S){let w=wr[0]+r()*(wr[1]-wr[0]);if(S-(tot+w)<wr[0])w=S-tot;ws.push(w);tot+=w;}
    let x=r()*-30;for(const w of ws){const c=pal[Math.floor(r()*pal.length)],f=.82+r()*.3,cut=(r()-.5)*4,X0=x;
      wrapDraw(S,X0,y,w,rh+14,(X,Y)=>{const h=rh+9;g.fillStyle='rgba(0,0,0,.45)';g.fillRect(X+1,Y+h-1,w-1,6);g.fillStyle=col(c,f);g.beginPath();g.moveTo(X+1,Y);g.lineTo(X+w-1,Y);g.lineTo(X+w-1,Y+h+cut);g.lineTo(X+1,Y+h-cut);g.closePath();g.fill();
        g.strokeStyle='rgba(0,0,0,.18)';g.lineWidth=1;for(let k=0;k<5;k++){const gx=X+3+((k*37+w*7)%Math.max(4,w-6));g.beginPath();g.moveTo(gx,Y);g.lineTo(gx,Y+h);g.stroke();}
        const gv=g.createLinearGradient(0,Y,0,Y+h);gv.addColorStop(0,'rgba(0,0,0,.3)');gv.addColorStop(.35,'rgba(0,0,0,0)');gv.addColorStop(1,'rgba(255,255,255,.07)');g.fillStyle=gv;g.fillRect(X+1,Y,w-2,h);});
      x+=w;}}
  speckle(g,S,r,5000,['#000','#ddd'],.04,.12,1,2);blotches(g,S,r,20,'#5a6a3a',10,40,.05,.18);});}
function leadedTex(key,emissive){return makeTex(key,(g,S,r)=>{
  if(emissive){g.fillStyle='#fff';g.fillRect(0,0,S,S);blotches(g,S,r,20,'#ffb060',20,60,.2,.4);}
  else{const gr=g.createLinearGradient(0,0,S,S);gr.addColorStop(0,'#5f7286');gr.addColorStop(.5,'#2a3646');gr.addColorStop(1,'#4b5d70');g.fillStyle=gr;g.fillRect(0,0,S,S);blotches(g,S,r,25,'#9fb0c0',20,60,.05,.18);}
  g.strokeStyle=emissive?'#000':'#1b1e22';g.lineWidth=S*.022;const n=6,d=S/n;
  for(let i=-n;i<=2*n;i++){g.beginPath();g.moveTo(i*d,0);g.lineTo(i*d+S,S);g.stroke();g.beginPath();g.moveTo(i*d,0);g.lineTo(i*d-S,S);g.stroke();}},256);}

/* ---------- materials ---------- */
const GLOW=[];          // materials whose emissive follows the lighting mode
let MATS=null;
function mats(){
  if(MATS)return MATS;
  const std=(t,o={})=>{const T=t?TEX[t]():null;const p=Object.assign({},o.p||{});if(p.color!==undefined)p.color=new THREE.Color(p.color).convertSRGBToLinear();return new THREE.MeshStandardMaterial(Object.assign({map:T&&T.map,bumpMap:T&&T.bump,bumpScale:o.bump??.025,color:0xffffff,roughness:.92,metalness:0},p));};
  const lin=c=>new THREE.Color(c).convertSRGBToLinear();
  const plain=(c,o={})=>new THREE.MeshStandardMaterial(Object.assign({roughness:.85,metalness:0},o,{color:lin(c)}));
  MATS={
    plaster:std('plaster',{bump:.015}),plasterOchre:std('plaster',{bump:.015,p:{color:0xf0d39a}}),plasterWhite:std('plaster',{bump:.015,p:{color:0xf6f1e6}}),
    timber:std('timber',{bump:.02}),planks:std('planks'),planksDark:std('planksDark'),door:std('door'),staves:std('staves'),
    shutterGreen:std('planks',{p:{color:0x6f9a7a}}),shutterBlue:std('planks',{p:{color:0x7f98b8}}),shutterRed:std('planks',{p:{color:0xb06a58}}),
    weather:std('weather'),stone:std('stone',{bump:.04,p:{color:0xc9c0ad}}),ashlar:std('ashlar',{bump:.03,p:{color:0xd6cfc2}}),field:std('field',{bump:.05,p:{color:0xd2cab8}}),
    thatch:std('thatch',{bump:.05,p:{color:0xd9c8a6}}),tiles:std('tiles',{bump:.03,p:{color:0xe8d6c8}}),shingles:std('shingles',{bump:.03}),slate:std('slate',{bump:.025,p:{roughness:.7}}),
    grass:std('grass',{bump:.02}),dirt:std('dirt',{bump:.03}),hay:std('hay',{bump:.04}),bark:std('bark',{bump:.05}),endgrain:std('endgrain',{bump:.02}),burlap:std('burlap',{bump:.03}),
    iron:plain(0x2a2a2d,{roughness:.55,metalness:.7}),rust:plain(0x4a3020,{roughness:.8,metalness:.4}),
    clay:plain(0x9a5a3a,{roughness:.9}),leaf:plain(0x4c6e36,{flatShading:true}),leafDark:plain(0x37552a,{flatShading:true}),
    red:plain(0xb8423a),yellow:plain(0xe0b84a),purple:plain(0x8a5aa8),white:plain(0xeeeadf),cloth:plain(0x6a3a4a),clothB:plain(0x3f5a7a),rope:plain(0xa08860),
    dark:plain(0x120d09,{roughness:1}),water:plain(0x2a3a42,{roughness:.15,metalness:.2}),sign:std('sign',{bump:.01}),
  };
  const gT=TEX.glass(),gE=TEX.glassE();
  MATS.glass=new THREE.MeshStandardMaterial({map:gT.map,emissiveMap:gE.map,emissive:lin(0xffa24a),emissiveIntensity:0,roughness:.18,metalness:.35});
  MATS.flame=new THREE.MeshStandardMaterial({color:lin(0xffd08a),emissive:lin(0xffa040),emissiveIntensity:.3,roughness:.5});
  MATS.glass.userData.glowScale=1;MATS.flame.userData.glowScale=1.6;MATS.flame.userData.base=.3;
  GLOW.push(MATS.glass,MATS.flame);
  return MATS;
}

/* ---------- geometry helpers ---------- */
function shadowed(m){m.castShadow=true;m.receiveShadow=true;return m;}
function worldUV(geo,w,h,d,s,ox,oy,oz){const uv=geo.attributes.uv;const fd=[[d,h,oz,oy],[d,h,oz,oy],[w,d,ox,oz],[w,d,ox,oz],[w,h,ox,oy],[w,h,ox,oy]];
  for(let f=0;f<6;f++)for(let i=0;i<4;i++){const k=f*4+i;uv.setXY(k,(uv.getX(k)*fd[f][0]+fd[f][2])/s,(uv.getY(k)*fd[f][1]+fd[f][3])/s);}uv.needsUpdate=true;}
function box(w,h,d,mat,o={}){const g=new THREE.BoxGeometry(w,h,d);worldUV(g,w,h,d,o.s||2,o.ox??R()*4,o.oy??R()*4,o.oz??R()*4);return shadowed(new THREE.Mesh(g,mat));}
function scaleUV(geo,k,ou=0,ov=0,from=0,to){const uv=geo.attributes.uv;to=to??uv.count;for(let i=from;i<to;i++)uv.setXY(i,uv.getX(i)*k+ou,uv.getY(i)*k+ov);uv.needsUpdate=true;}
function swapUV(geo){const uv=geo.attributes.uv;for(let i=0;i<uv.count;i++){const x=uv.getX(i);uv.setX(i,uv.getY(i));uv.setY(i,x);}uv.needsUpdate=true;}
function cyl(rt,rb,h,seg,mat,o={}){const hs=o.hs||1;const g=new THREE.CylinderGeometry(rt,rb,h,seg,hs,!!o.open);const uv=g.attributes.uv;const n=(hs+1)*(seg+1),s=o.s||2,circ=Math.PI*(rt+rb),uo=R(),vo=R();
  for(let i=0;i<n;i++)uv.setXY(i,uv.getX(i)*circ/s+uo,uv.getY(i)*h/s+vo);uv.needsUpdate=true;return shadowed(new THREE.Mesh(g,mat));}
function put(parent,obj,x,y,z,rx,ry,rz){if(x!==undefined)obj.position.set(x,y||0,z||0);if(rx!==undefined)obj.rotation.set(rx,ry||0,rz||0);parent.add(obj);return obj;}
const UP=new THREE.Vector3(0,1,0);
function beam(a,b,r,mat,seg=6){const A=new THREE.Vector3(...a),B=new THREE.Vector3(...b),d=B.clone().sub(A),L=d.length();const m=cyl(r,r,L,seg,mat);m.position.copy(A).add(B).multiplyScalar(.5);m.quaternion.setFromUnitVectors(UP,d.normalize());return m;}
function sqBeam(a,b,w,mat){const A=new THREE.Vector3(...a),B=new THREE.Vector3(...b),d=B.clone().sub(A),L=d.length();const m=box(w,L,w,mat);m.position.copy(A).add(B).multiplyScalar(.5);m.quaternion.setFromUnitVectors(UP,d.normalize());return m;}
function jitterGeo(geo,amt,rng=R){const p=geo.attributes.position;const map=new Map();for(let i=0;i<p.count;i++){const k=`${p.getX(i).toFixed(3)},${p.getY(i).toFixed(3)},${p.getZ(i).toFixed(3)}`;if(!map.has(k))map.set(k,[(rng()-.5)*amt,(rng()-.5)*amt,(rng()-.5)*amt]);const j=map.get(k);p.setXYZ(i,p.getX(i)+j[0],p.getY(i)+j[1],p.getZ(i)+j[2]);}geo.computeVertexNormals();return geo;}

/* ---------- architectural parts ---------- */
// Wall in local space: runs along x (centered), y from 0..h, outer face at z=0, inner at z=-t. Openings are cut as real holes.
function wall(len,h,t,mat,openings=[],o={}){const grp=new THREE.Group(),s=o.s||2,uo=o.uo??R()*4,vo=o.vo??R()*4;
  const seg=(x0,x1,y0,y1)=>{if(x1-x0<1e-3||y1-y0<1e-3)return;const m=box(x1-x0,y1-y0,t,mat,{s,ox:x0+len/2+uo,oy:y0+vo,oz:0});m.position.set((x0+x1)/2,(y0+y1)/2,-t/2);grp.add(m);};
  let cur=-len/2;for(const op of[...openings].sort((a,b)=>a.x-b.x)){const a=op.x-op.w/2,b=op.x+op.w/2;seg(cur,a,0,h);seg(a,b,0,op.y0);seg(a,b,op.y1,h);cur=b;}seg(cur,len/2,0,h);return grp;}

function windowUnit(w,h,t,M,o={}){const g=new THREE.Group(),fw=.07,dep=o.recess??t*.45,fm=o.frame||M.timber;
  const gl=box(w,h,.03,M.glass,{s:.5,ox:0,oy:0,oz:0});gl.castShadow=false;put(g,gl,0,h/2,-dep);
  put(g,box(w,fw,.1,fm),0,fw/2,-dep+.02);put(g,box(w,fw,.1,fm),0,h-fw/2,-dep+.02);put(g,box(fw,h,.1,fm),-w/2+fw/2,h/2,-dep+.02);put(g,box(fw,h,.1,fm),w/2-fw/2,h/2,-dep+.02);
  if(w>.75)put(g,box(fw*.8,h,.08,fm),0,h/2,-dep+.03);if(h>.8)put(g,box(w,fw*.8,.08,fm),0,h*.62,-dep+.03);
  const sm=o.sillMat||fm;put(g,box(w+.18,.07,dep+.14,sm),0,-.035,(-dep+.14)/2);
  if(o.lintel)put(g,box(w+.36,.2,.1,o.lintel),0,h+.1,.04);
  if(o.shutters){for(const sd of[-1,1]){const sh=box(w/2+.03,h+.04,.05,o.shutters,{s:2});put(g,sh,sd*(w/2+w/4+.07),h/2,.035);for(const yy of[.18,.82])put(g,box(w/2-.04,.07,.03,o.shutters),sd*(w/2+w/4+.07),h*yy,.07);put(g,box(.035,.03,.06,M.iron),sd*(w/2+.03),h*.2,.03);}}
  if(o.flowers){const fb=box(w+.1,.2,.22,M.planks);put(g,fb,0,-.2,.14);for(let i=0;i<7;i++){const x=-w/2+.05+i*(w/6.4);const b=shadowed(new THREE.Mesh(new THREE.IcosahedronGeometry(.09+R()*.04,0),R()<.5?M.leaf:M.leafDark));put(g,b,x,-.06,.15+rnd(-.04,.04));
      const f=shadowed(new THREE.Mesh(new THREE.IcosahedronGeometry(.035,0),[M.red,M.yellow,M.purple,M.white][Math.floor(R()*4)]));put(g,f,x+rnd(-.05,.05),.02+R()*.05,.2);}}
  return g;}

function doorUnit(w,h,t,M,o={}){const g=new THREE.Group(),dep=o.recess??t*.55,lm=o.leaf||M.door,arch=o.arch;
  put(g,box(w,h,.02,M.dark),0,h/2,-dep-.05);
  const leaf=new THREE.Group();let lg;
  if(arch){const s=new THREE.Shape();s.moveTo(-w/2,0);s.lineTo(w/2,0);s.lineTo(w/2,h-w/2);s.absarc(0,h-w/2,w/2,0,Math.PI,false);s.lineTo(-w/2,0);const geo=new THREE.ExtrudeGeometry(s,{depth:.07,bevelEnabled:false,curveSegments:16});scaleUV(geo,.5);lg=shadowed(new THREE.Mesh(geo,lm));put(leaf,lg,w/2,0,-.035);
    const inf=new THREE.Shape();inf.moveTo(-w/2,0);inf.lineTo(-w/2,w/2+.001);inf.lineTo(w/2,w/2+.001);inf.lineTo(w/2,0);inf.absarc(0,0,w/2-.001,0,Math.PI,false);const ig=new THREE.ExtrudeGeometry(inf,{depth:t,bevelEnabled:false,curveSegments:16});scaleUV(ig,.5);const im=shadowed(new THREE.Mesh(ig,o.wallMat||M.stone));put(g,im,0,h-w/2,-t);
  }else{lg=box(w,h,.07,lm,{s:2,ox:0});put(leaf,lg,w/2,h/2,0);}
  const straps=arch?[.18,.55]:[.15,.5,.85];for(const sy of straps){put(leaf,box(w*.8,.06,.02,M.iron),w*.45,h*sy,.045);for(let k=0;k<4;k++)put(leaf,shadowed(new THREE.Mesh(new THREE.SphereGeometry(.013,6,4),M.iron)),w*.15+k*w*.2,h*sy,.06);}
  if(!arch&&o.brace!==false){const L=Math.hypot(w*.8,(h*.5-h*.15)),a=Math.atan2(h*.35,w*.8);const br=box(L,.09,.03,lm);put(leaf,br,w/2,h*.325,.045,0,0,a);}
  const ring=shadowed(new THREE.Mesh(new THREE.TorusGeometry(.06,.012,6,14),M.iron));put(leaf,ring,w*.8,h*.47,.07);put(leaf,box(.05,.05,.03,M.iron),w*.8,h*.53,.05);
  leaf.position.set(-w/2,0,-dep);leaf.rotation.y=-(o.open||0);g.add(leaf);
  if(!arch){const fm=o.frame||M.timber;put(g,box(.09,h,.12,fm),-w/2+.045,h/2,-dep+.02);put(g,box(.09,h,.12,fm),w/2-.045,h/2,-dep+.02);put(g,box(w,.1,.12,fm),0,h-.05,-dep+.02);}
  if(o.lintel)put(g,box(w+.4,.24,.12,o.lintel),0,h+.12,.05);
  return g;}

function gableRoof(W,L,H,mat,o={}){const g=new THREE.Group(),ov=o.over??.35,ovL=o.overL??.35,t=o.t??.14,ang=Math.atan2(H,W/2),run=W/2+ov,e=t*.9,slope=run/Math.cos(ang)+e;
  for(const sd of[-1,1]){const slab=box(slope,t,L+2*ovL,mat,{s:o.s||2});swapUV(slab.geometry);
    const ex=sd*run,ey=H-run*Math.tan(ang),dirx=-sd*Math.cos(ang),diry=Math.sin(ang);
    slab.position.set(ex/2+sd*Math.sin(ang)*t/2+dirx*e/2,(H+ey)/2+Math.cos(ang)*t/2+diry*e/2,0);slab.rotation.z=-sd*ang;g.add(slab);
    if(o.barge)for(const zz of[-1,1]){const b=box(slope-.05,.24,.05,o.barge);b.position.set(slab.position.x-sd*Math.sin(ang)*(t/2+.06),slab.position.y-Math.cos(ang)*(t/2+.06),zz*(L/2+ovL-.02));b.rotation.z=-sd*ang;g.add(b);}}
  const ridgeY=H+t/Math.cos(ang);
  if(o.ridge==='thatch'){const rc=cyl(t*.95,t*.95,L+2*ovL+.04,12,mat,{s:2});rc.rotation.x=Math.PI/2;rc.position.y=ridgeY-t*.55;g.add(rc);}
  else{const rm=o.ridgeMat||mat;const rc=cyl(t*.7,t*.7,L+2*ovL+.04,8,rm);rc.rotation.x=Math.PI/2;rc.position.y=ridgeY-t*.35;g.add(rc);}
  return g;}

function gableTri(W,H,t,mat,o={}){const s=new THREE.Shape();s.moveTo(-W/2,0);s.lineTo(W/2,0);s.lineTo(0,H);s.closePath();
  if(o.hole){const{x,y0,w,h}=o.hole,p=new THREE.Path();p.moveTo(x-w/2,y0);p.lineTo(x-w/2,y0+h);p.lineTo(x+w/2,y0+h);p.lineTo(x+w/2,y0);p.closePath();s.holes.push(p);}
  const geo=new THREE.ExtrudeGeometry(s,{depth:t,bevelEnabled:false});geo.translate(0,0,-t);scaleUV(geo,1/(o.s||2),R()*4,R()*4);return shadowed(new THREE.Mesh(geo,mat));}

// Exposed timber framing over a wall face (local coords like wall()).
function timberFrame(len,h,ops,M,o={}){const g=new THREE.Group(),pw=o.pw||.18,T=M.timber,gap=o.gap||1.15,railY=o.rail??h*.5;
  const bm=(x0,y0,x1,y1,wd=pw)=>{const L=Math.hypot(x1-x0,y1-y0);const b=box(L,wd,.1,T);b.position.set((x0+x1)/2,(y0+y1)/2,.025);b.rotation.z=Math.atan2(y1-y0,x1-x0);g.add(b);};
  let xs=[-len/2+pw/2,len/2-pw/2];for(const op of ops){xs.push(op.x-op.w/2-pw/2,op.x+op.w/2+pw/2);}xs.sort((a,b)=>a-b);
  const ded=[];for(const x of xs)if(!ded.length||x-ded[ded.length-1]>pw*1.2)ded.push(x);xs=[];
  for(let i=0;i<ded.length;i++){xs.push(ded[i]);if(i<ded.length-1){const a=ded[i],b=ded[i+1],inOp=ops.some(op=>op.x>a&&op.x<b);if(!inOp&&b-a>gap){const n=Math.ceil((b-a)/gap);for(let k=1;k<n;k++)xs.push(a+(b-a)*k/n);}}}
  // sill (split at doors) + top plate
  let cur=-len/2;for(const op of ops.filter(q=>q.y0<.05).sort((a,b)=>a.x-b.x)){bm(cur,pw/2,op.x-op.w/2,pw/2);cur=op.x+op.w/2;}bm(cur,pw/2,len/2,pw/2);
  bm(-len/2,h-pw/2,len/2,h-pw/2);
  for(const x of xs)bm(x,pw,x,h-pw);
  for(let i=0;i<xs.length-1;i++){const a=xs[i],b=xs[i+1],op=ops.find(q=>q.x>a&&q.x<b);
    if(!op){bm(a,railY,b,railY,pw*.85);if(o.braces!==false){if(i===0)bm(a,pw,b,railY);else if(i===xs.length-2)bm(b,pw,a,railY);else if(o.chevron&&i%2===1){bm(a,railY,(a+b)/2,h-pw);bm(b,railY,(a+b)/2,h-pw);}}}
    else{if(op.y0>pw*2)bm(a,op.y0-pw*.4,b,op.y0-pw*.4,pw*.8);if(op.y1<h-pw*1.6)bm(a,op.y1+pw*.4,b,op.y1+pw*.4,pw*.8);}}
  return g;}
function gableTimber(W,H,M,o={}){const g=new THREE.Group(),pw=.17,T=M.timber,ang=Math.atan2(H,W/2);
  const bm=(x0,y0,x1,y1,wd=pw)=>{const L=Math.hypot(x1-x0,y1-y0);const b=box(L,wd,.1,T);b.position.set((x0+x1)/2,(y0+y1)/2,.025);b.rotation.z=Math.atan2(y1-y0,x1-x0);g.add(b);};
  const cy=H*.42,cx=(H-cy)/Math.tan(ang);bm(-cx,cy,cx,cy,pw*.9);
  if(o.hole){const hw=o.hole.w/2+pw/2;bm(-hw,pw/2,-hw,cy);bm(hw,pw/2,hw,cy);}
  else{bm(0,pw/2,0,H-.25);bm(-W*.32,pw/2,-.04,cy);bm(W*.32,pw/2,.04,cy);}
  bm(0,cy,-cx*.55,cy+(cx-cx*.55)*Math.tan(ang)*.92);bm(0,cy,cx*.55,cy+(cx-cx*.55)*Math.tan(ang)*.92);
  return g;}

// Four walls with openings, optional timber framing; returns {group, faces}.
function walls4(p,M){const G=new THREE.Group(),faces={},defs={front:[0,p.Dz/2,0,p.Lx],back:[0,-p.Dz/2,Math.PI,p.Lx],right:[p.Lx/2,0,Math.PI/2,p.Dz],left:[-p.Lx/2,0,-Math.PI/2,p.Dz]};
  for(const k in defs){const[x,z,ry,len]=defs[k],ops=(p.ops&&p.ops[k])||[],side=k==='left'||k==='right';
    const wg=new THREE.Group();wg.position.set(x,p.y||0,z);wg.rotation.y=ry;
    wg.add(wall(side?len-2*p.t:len,p.h,p.t,p.mat,ops));
    if(p.frame)wg.add(timberFrame(len,p.h,ops,M,p.frameOpts||{}));
    if(!p.noUnits)for(const op of ops){const oo=Object.assign({},p.unit||{},op);const u=op.type==='door'?doorUnit(op.w,op.y1-op.y0,p.t,M,oo):windowUnit(op.w,op.y1-op.y0,p.t,M,oo);u.position.set(op.x,op.y0,0);wg.add(u);}
    G.add(wg);faces[k]=wg;}
  return{group:G,faces};}

function chimney(w,d,h,M,o={}){const g=new THREE.Group(),m=o.mat||M.stone;put(g,box(w,h,d,m),0,h/2,0);put(g,box(w+.14,.14,d+.14,o.cap||M.ashlar),0,h+.07,0);
  const n=o.pots??1;for(let i=0;i<n;i++)put(g,cyl(.08,.1,.32,10,M.clay),(i-(n-1)/2)*.26,h+.3,0);
  if(o.band)put(g,box(w+.08,.1,d+.08,M.ashlar),0,h*.7,0);return g;}

/* ---------- props ---------- */
function barrel(M,o={}){const g=new THREE.Group(),r=o.r||.3,h=o.h||.8;const pts=[];for(let i=0;i<=10;i++){const t=i/10;pts.push(new THREE.Vector2(r*(.84+.16*Math.sin(t*Math.PI)),t*h));}
  const geo=new THREE.LatheGeometry(pts,18);const uv=geo.attributes.uv;for(let i=0;i<uv.count;i++)uv.setXY(i,uv.getX(i)*2,uv.getY(i)*h/2);put(g,shadowed(new THREE.Mesh(geo,M.staves)));
  for(const t of[.1,.3,.7,.9]){const rr=r*(.84+.16*Math.sin(t*Math.PI))+.004;const hp=shadowed(new THREE.Mesh(new THREE.TorusGeometry(rr,.014,4,24),M.iron));put(g,hp,0,t*h,0,Math.PI/2);}
  const lid=cyl(r*.84,r*.84,.02,18,o.water?M.water:M.staves);put(g,lid,0,h-.03,0);return g;}
function crate(M,s=.6){const g=new THREE.Group();put(g,box(s,s,s,M.planks,{s:2}),0,s/2,0);const T=M.timber,b=.06;
  for(const[x,z]of[[1,1],[1,-1],[-1,1],[-1,-1]])put(g,box(b,s+.01,b,T),x*(s/2-b/2+.005),s/2,z*(s/2-b/2+.005));
  for(const y of[b/2,s-b/2]){put(g,box(s+.01,b,b,T),0,y,s/2-b/2+.005);put(g,box(s+.01,b,b,T),0,y,-s/2+b/2-.005);put(g,box(b,b,s+.01,T),s/2-b/2+.005,y,0);put(g,box(b,b,s+.01,T),-s/2+b/2-.005,y,0);}return g;}
function sack(M,o={}){const g=new THREE.Group(),geo=new THREE.SphereGeometry(.25,14,10);const p=geo.attributes.position;
  for(let i=0;i<p.count;i++){let x=p.getX(i),y=p.getY(i),z=p.getZ(i);if(y<-.14)y=-.14+(y+.14)*.2;if(y>.1){x*=1-(y-.1)*2.2;z*=1-(y-.1)*2.2;}x*=1+(R()-.5)*.06;z*=1+(R()-.5)*.06;p.setXYZ(i,x,y*1.25,z*.8);}geo.computeVertexNormals();
  put(g,shadowed(new THREE.Mesh(geo,M.burlap)),0,.18,0);put(g,cyl(.04,.05,.06,8,M.rope),0,.43,0);put(g,cyl(.07,.02,.1,8,M.burlap),0,.5,0);g.rotation.y=R()*6;return g;}
function logMesh(r,L,M){const m=cyl(r,r*1.04,L,10,[M.bark,M.endgrain,M.endgrain],{s:2});return m;}
function woodpile(M,o={}){const g=new THREE.Group(),rows=o.rows||5,cols=o.cols||8,r=o.r||.08,L=o.L||.55;
  for(let y=0;y<rows;y++)for(let i=0;i<cols-(y%2);i++){const lg=logMesh(r*(.85+R()*.3),L+rnd(-.05,.05),M);lg.rotation.x=Math.PI/2;lg.rotation.y=rnd(-.08,.08);lg.position.set(-((cols-1)*r)+i*2*r+(y%2)*r,r+y*r*1.75,rnd(-.03,.03));g.add(lg);}return g;}
function bush(M,s=1){const g=new THREE.Group();for(let i=0;i<7;i++){const geo=jitterGeo(new THREE.IcosahedronGeometry((.28+R()*.18)*s,1),.08*s);const m=shadowed(new THREE.Mesh(geo,R()<.5?M.leaf:M.leafDark));put(g,m,rnd(-.3,.3)*s,(.25+R()*.25)*s,rnd(-.25,.25)*s);}return g;}
function stepStones(M,n,from,to,o={}){const g=new THREE.Group();for(let i=0;i<n;i++){const t=(i+.5)/n,x=from[0]+(to[0]-from[0])*t+rnd(-.1,.1),z=from[1]+(to[1]-from[1])*t+rnd(-.1,.1);const geo=jitterGeo(new THREE.CylinderGeometry(.28+R()*.1,.3+R()*.1,.08,7),.05);scaleUV(geo,.4);const m=shadowed(new THREE.Mesh(geo,o.mat||M.field));put(g,m,x,.02,z,0,R()*6);}return g;}
function bench(M,len=1.4){const g=new THREE.Group();put(g,box(len,.07,.32,M.planks),0,.45,0);for(const s of[-1,1]){put(g,box(.07,.42,.26,M.planks),s*(len/2-.15),.21,0);}put(g,box(len*.8,.05,.05,M.timber),0,.2,0);return g;}
function wheel(M,r=.55){const g=new THREE.Group();put(g,shadowed(new THREE.Mesh(new THREE.TorusGeometry(r,.045,6,28),M.timber)));put(g,shadowed(new THREE.Mesh(new THREE.TorusGeometry(r+.035,.018,4,28),M.iron)));
  put(g,cyl(.09,.09,.16,10,M.timber),0,0,0,Math.PI/2);for(let i=0;i<10;i++){const a=i/10*Math.PI*2;const sp=box(.04,r,.04,M.timber);sp.position.set(Math.cos(a)*r/2,Math.sin(a)*r/2,0);sp.rotation.z=a-Math.PI/2;g.add(sp);}return g;}
function cart(M,o={}){const g=new THREE.Group(),L=2.2,W=1.2,h=.7;put(g,box(W,.08,L,M.planks),0,h,0);
  for(const s of[-1,1]){put(g,box(.06,.4,L,M.planks),s*(W/2-.03),h+.24,0);put(g,box(W,.4,.06,M.planks),0,h+.24,s*(L/2-.03));}
  for(const s of[-1,1]){const wl=wheel(M,.55);put(g,wl,s*(W/2+.12),.58,-.1,0,Math.PI/2);}
  put(g,cyl(.05,.05,W+.4,8,M.timber),0,.58,-.1,0,0,Math.PI/2);
  for(const s of[-1,1]){const sh=sqBeam([s*.4,h-.02,L/2-.2],[s*.32,.12,L/2+1.6],.08,M.timber);g.add(sh);}
  if(o.load==='hay'){const hg=jitterGeo(new THREE.SphereGeometry(.7,12,8,0,Math.PI*2,0,Math.PI/2),.12);scaleUV(hg,2);const hm=shadowed(new THREE.Mesh(hg,M.hay));hm.scale.set(.85,.7,1.4);put(g,hm,0,h+.05,0);}
  if(o.load==='sacks')for(let i=0;i<4;i++)put(g,sack(M),rnd(-.25,.25),h+.04,-.7+i*.45);
  return g;}
function haystack(M,o={}){const g=new THREE.Group(),r=o.r||1.3,h=o.h||1.5;const body=jitterGeo(new THREE.CylinderGeometry(r,r*1.05,h,18,3),.12);scaleUV(body,2.5);put(g,shadowed(new THREE.Mesh(body,M.hay)),0,h/2,0);
  const top=jitterGeo(new THREE.ConeGeometry(r*1.12,h*.95,18,3),.1);scaleUV(top,2.5);put(g,shadowed(new THREE.Mesh(top,M.hay)),0,h+h*.45,0);
  put(g,cyl(.035,.035,.7,6,M.timber),0,h*2,0);for(let i=0;i<3;i++){const t=shadowed(new THREE.Mesh(new THREE.TorusGeometry(r*1.06-i*.03,.02,4,30),M.rope));t.position.y=h*.3+i*h*.25;t.rotation.x=Math.PI/2;g.add(t);}return g;}
function sheaf(M){const g=new THREE.Group();const geo=jitterGeo(new THREE.CylinderGeometry(.16,.12,.9,10,2),.04);scaleUV(geo,1);put(g,shadowed(new THREE.Mesh(geo,M.hay)),0,.45,0);const tp=jitterGeo(new THREE.ConeGeometry(.24,.35,10),.06);put(g,shadowed(new THREE.Mesh(tp,M.hay)),0,1.05,0);put(g,cyl(.13,.13,.05,10,M.rope),0,.6,0);return g;}
function pitchfork(M){const g=new THREE.Group();put(g,cyl(.02,.022,1.6,6,M.timber),0,.8,0);put(g,box(.22,.03,.03,M.iron),0,1.62,0);for(const x of[-.1,0,.1])put(g,cyl(.008,.004,.32,4,M.iron),x,1.79,0);return g;}
function axe(M){const g=new THREE.Group();put(g,cyl(.018,.022,.8,6,M.timber),0,.4,0);const s=new THREE.Shape();s.moveTo(0,0);s.lineTo(.08,0);s.quadraticCurveTo(.2,-.08,.2,-.02);s.lineTo(.2,.18);s.quadraticCurveTo(.2,.24,.08,.14);s.lineTo(0,.14);s.closePath();
  const geo=new THREE.ExtrudeGeometry(s,{depth:.025,bevelEnabled:false});geo.translate(-.02,0,-.0125);put(g,shadowed(new THREE.Mesh(geo,M.iron)),0,.66,0);return g;}
function choppingBlock(M){const g=new THREE.Group();const st=cyl(.32,.36,.55,12,[M.bark,M.endgrain,M.endgrain]);put(g,st,0,.275,0);const ax=axe(M);put(g,ax,.05,.42,0,0,0,-.5);g.add(ax);
  for(let i=0;i<5;i++){const s=box(.08,.07,.4,M.endgrain,{s:.5});put(g,s,rnd(-.7,.7),.04,rnd(-.6,.6),0,R()*6,0);}return g;}
function lantern(M,lights){const g=new THREE.Group();put(g,box(.05,.25,.25,M.iron),0,0,-.12);put(g,box(.04,.04,.3,M.iron),0,.08,.0);
  const cage=new THREE.Group();put(cage,box(.16,.02,.16,M.iron),0,-.02,0);put(cage,box(.16,.02,.16,M.iron),0,-.26,0);for(const[x,z]of[[1,1],[1,-1],[-1,1],[-1,-1]])put(cage,box(.015,.24,.015,M.iron),x*.075,-.14,z*.075);
  put(cage,cyl(.02,.08,.07,4,M.iron),0,.03,0);const fl=new THREE.Mesh(new THREE.BoxGeometry(.12,.2,.12),M.flame);put(cage,fl,0,-.14,0);put(g,cage,0,.0,.16);
  const pl=new THREE.PointLight(0xffb060,0,7,2);pl.position.set(0,-.14,.32);pl.userData.lamp=true;g.add(pl);if(lights)lights.push(pl);return g;}
function trough(M,L=1.6){const g=new THREE.Group();put(g,box(L,.06,.5,M.planks),0,.3,0);for(const s of[-1,1]){put(g,box(L,.28,.05,M.planks),0,.47,s*.225);put(g,box(.05,.28,.5,M.planks),s*(L/2-.025),.47,0);put(g,box(.08,.3,.08,M.timber),s*(L/2-.2),.15,0);}
  const w=box(L-.1,.02,.4,M.water,{s:1});w.castShadow=false;put(g,w,0,.55,0);return g;}
function fence(M,L,o={}){const g=new THREE.Group(),n=Math.max(2,Math.round(L/1.6)+1);for(let i=0;i<n;i++){const x=-L/2+L*i/(n-1);const p=cyl(.06,.07,1.05,7,M.bark);put(g,p,x,.5,0,rnd(-.04,.04),0,rnd(-.04,.04));}
  for(const y of[.45,.85]){const r=beam([-L/2-.1,y+rnd(-.03,.03),.06],[L/2+.1,y+rnd(-.03,.03),.06],.035,M.bark);g.add(r);}return g;}
function grassTufts(M,n,R0,R1,avoid){const g=new THREE.Group(),geo=new THREE.ConeGeometry(.08,.3,4);for(let i=0;i<n;i++){const a=R()*6.28,r=R0+R()*(R1-R0),x=Math.cos(a)*r,z=Math.sin(a)*r;if(avoid&&avoid(x,z))continue;for(let k=0;k<3;k++){const m=new THREE.Mesh(geo,R()<.5?M.leaf:M.leafDark);m.receiveShadow=true;put(g,m,x+rnd(-.08,.08),.12,z+rnd(-.08,.08),rnd(-.3,.3),0,rnd(-.3,.3));m.scale.setScalar(.6+R()*.8);}}return g;}
const inRect=(x0,x1,z0,z1)=>(x,z)=>x>x0&&x<x1&&z>z0&&z<z1;
const YARDS={};
function yardTex(){if(YARDS.t)return YARDS.t;const D=TEX.dirt().canvas,S=1024,c=document.createElement('canvas');c.width=c.height=S;const g=c.getContext('2d');
  for(let i=0;i<4;i++)for(let j=0;j<4;j++)g.drawImage(D,i*S/4,j*S/4,S/4,S/4);
  const m=document.createElement('canvas');m.width=m.height=S;const mg=m.getContext('2d'),rr=mulberry32(77);
  const gr=mg.createRadialGradient(S/2,S/2,S*.18,S/2,S/2,S*.5);gr.addColorStop(0,'rgba(0,0,0,1)');gr.addColorStop(.7,'rgba(0,0,0,.75)');gr.addColorStop(1,'rgba(0,0,0,0)');mg.fillStyle=gr;mg.fillRect(0,0,S,S);
  mg.globalCompositeOperation='destination-out';for(let i=0;i<260;i++){const a=rr()*6.28,d=S*(.3+rr()*.22),x=S/2+Math.cos(a)*d,y=S/2+Math.sin(a)*d,rad=10+rr()*40;const q=mg.createRadialGradient(x,y,0,x,y,rad);q.addColorStop(0,'rgba(0,0,0,.6)');q.addColorStop(1,'rgba(0,0,0,0)');mg.fillStyle=q;mg.fillRect(x-rad,y-rad,2*rad,2*rad);}
  g.globalCompositeOperation='destination-in';g.drawImage(m,0,0);
  const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;t.anisotropy=8;
  YARDS.t=new THREE.MeshStandardMaterial({map:t,transparent:true,depthWrite:false,roughness:.95});return YARDS.t;}
function yard(M,w,d,x=0,z=0){const m=new THREE.Mesh(new THREE.PlaneGeometry(1,1),yardTex());m.receiveShadow=true;m.rotation.x=-Math.PI/2;m.scale.set(w*1.15,d*1.15,1);m.position.set(x,.025,z);return m;}

/* ======================= BUILDINGS ======================= */
function buildTimberCottage(){const M=mats(),root=new THREE.Group(),lights=[];root.userData.lights=lights;
  const Lx=6.4,Dz=4.6,base=.45,hw=2.3,t=.22,H=2.9;
  put(root,yard(M,9,7.5,0,.6));
  put(root,box(Lx+.14,base,Dz+.14,M.field),0,base/2,0);
  const ops={front:[{type:'door',x:-.9,w:1,y0:0,y1:1.95},{x:-2.3,w:.8,y0:.85,y1:1.7,flowers:true},{x:1.4,w:1.2,y0:.85,y1:1.75,flowers:true}],back:[{x:.2,w:.9,y0:.9,y1:1.7}],right:[{x:0,w:.7,y0:.9,y1:1.6}],left:[]};
  const W=walls4({Lx,Dz,y:base,h:hw,t,mat:M.plaster,ops,frame:true,frameOpts:{chevron:true},unit:{shutters:M.shutterGreen}},M);root.add(W.group);
  for(const k of['right','left']){const tri=gableTri(Dz,H,t,M.plaster);put(W.faces[k],tri,0,hw,0);put(W.faces[k],gableTimber(Dz,H,M),0,hw,0);}
  const roof=gableRoof(Dz,Lx,H,M.thatch,{t:.4,over:.5,overL:.45,ridge:'thatch'});put(root,roof,0,base+hw,0,0,Math.PI/2,0);
  const ch=chimney(.8,1.1,base+hw+H+.9,M,{pots:2});put(root,ch,-Lx/2-.28,0,0);
  put(root,box(1.4,.18,.6,M.field),-.9,.09,Dz/2+.3);put(root,box(1.2,.18,.35,M.field),-.9,.27,Dz/2+.16);
  put(root,stepStones(M,6,[-.9,Dz/2+.9],[-.4,Dz/2+3.6]));
  const lt=lantern(M,lights);put(root,lt,-.1,base+2.05,Dz/2);
  put(root,barrel(M,{water:true}),2.75,0,Dz/2+.45);put(root,bench(M,1.3),1.4,0,Dz/2+.45);
  const wp=woodpile(M,{rows:5,cols:9});put(root,wp,1.2,0,-Dz/2-.45);
  put(root,bush(M,1.1),-2.8,0,Dz/2+.7);put(root,bush(M,.9),3.6,0,-1.3);put(root,bush(M,.8),-3.9,0,-1.9);
  put(root,grassTufts(M,90,3.5,9,(x,z)=>Math.abs(x)<4&&Math.abs(z)<3.2));
  return root;}

function buildStoneCroft(){const M=mats(),root=new THREE.Group(),lights=[];root.userData.lights=lights;
  const Lx=5.6,Dz=4.4,hw=2.3,t=.5,H=2.1;
  put(root,yard(M,8,7,0,.8));
  const ops={front:[{type:'door',x:0,w:.95,y0:0,y1:1.95,arch:true,wallMat:M.stone},{x:-1.75,w:.6,y0:.9,y1:1.55,lintel:M.ashlar,sillMat:M.ashlar,shutters:M.shutterBlue},{x:1.75,w:.6,y0:.9,y1:1.55,lintel:M.ashlar,sillMat:M.ashlar,shutters:M.shutterBlue}],back:[{x:1,w:.6,y0:.9,y1:1.55,lintel:M.ashlar,sillMat:M.ashlar}],right:[{x:-.6,w:.45,y0:1,y1:1.5,lintel:M.ashlar,sillMat:M.ashlar}],left:[]};
  const W=walls4({Lx,Dz,y:0,h:hw,t,mat:M.stone,ops},M);root.add(W.group);
  // quoins
  for(let i=0,y=0;y<hw-.05;i++,y+=.3)for(const[sx,sz]of[[1,1],[1,-1],[-1,1],[-1,-1]]){const lx=i%2?.52:.32,lz=i%2?.32:.52;const q=box(lx,.28,lz,M.ashlar);q.position.set(sx*(Lx/2-lx/2+.02),y+.15,sz*(Dz/2-lz/2+.02));root.add(q);}
  for(const k of['right','left'])put(W.faces[k],gableTri(Dz,H,t,M.stone),0,hw,0);
  put(root,gableRoof(Dz,Lx,H,M.slate,{t:.12,over:.3,overL:.18,ridgeMat:M.ashlar}),0,hw,0,0,Math.PI/2,0);
  for(const s of[-1,1])put(root,chimney(.75,.95,hw+H+.75-0,M,{pots:1}),s*(Lx/2-.38),0,0);
  // lean-to woodshed
  const sh=new THREE.Group();put(root,sh,Lx/2,0,-.3);
  for(const z of[-1.5,.9])put(sh,box(.14,1.7,.14,M.timber),1.35,.85,z);
  const rs=box(1.75,.08,2.9,M.slate,{s:2});swapUV(rs.geometry);put(sh,rs,.75,1.92,-.3,0,0,-.32);
  put(sh,box(1.5,.1,.12,M.timber),.75,1.68,.9);put(sh,box(1.5,.1,.12,M.timber),.75,1.68,-1.5);
  const wp=woodpile(M,{rows:7,cols:7,r:.075,L:.5});put(sh,wp,.65,0,-.3,0,Math.PI/2,0);
  put(root,box(1.3,.14,.55,M.ashlar),0,.07,Dz/2+.25);
  put(root,stepStones(M,5,[0,Dz/2+.8],[.6,Dz/2+3.4]));
  const lt=lantern(M,lights);put(root,lt,.8,1.95,Dz/2);
  put(root,barrel(M,{water:true}),-Lx/2+.1,0,Dz/2+.4);put(root,bench(M,1.2),-1.7,0,Dz/2+.45);
  put(root,sack(M),-2.6,0,Dz/2+.5);
  put(root,bush(M,.9),2.2,0,Dz/2+.6);put(root,bush(M,1.2),-3.6,0,-1.4);
  const fn=fence(M,3.2);put(root,fn,-2.2,0,Dz/2+2.4);
  put(root,grassTufts(M,90,3.4,9,(x,z)=>x>-3.2&&x<4.6&&z>-2.6&&z<2.6));
  return root;}

function buildTownhouse(){const M=mats(),root=new THREE.Group(),lights=[];root.userData.lights=lights;
  const Lx=5,Dz=5.5,h1=2.7,t=.4,band=.28,Lx2=5.7,Dz2=5.9,h2=2.4,H=3.4,t2=.22;
  put(root,yard(M,8.5,8.5,0,1));
  const ops1={front:[{type:'shop',x:-.85,w:2.3,y0:.85,y1:2.15},{type:'door',x:1.55,w:.95,y0:0,y1:2.1,lintel:M.ashlar}],back:[{x:0,w:.7,y0:.9,y1:1.7,lintel:M.ashlar,sillMat:M.ashlar}],right:[{x:.8,w:.6,y0:.9,y1:1.6,lintel:M.ashlar,sillMat:M.ashlar}],left:[{x:-.8,w:.6,y0:.9,y1:1.6,lintel:M.ashlar,sillMat:M.ashlar}]};
  const W1=walls4({Lx,Dz,y:0,h:h1,t,mat:M.stone,ops:{front:ops1.front,back:ops1.back,right:ops1.right,left:ops1.left},noUnits:true},M);root.add(W1.group);
  for(const k in ops1)for(const op of ops1[k]){if(op.type==='shop')continue;const u=op.type==='door'?doorUnit(op.w,op.y1-op.y0,t,M,op):windowUnit(op.w,op.y1-op.y0,t,M,op);u.position.set(op.x,op.y0,0);W1.faces[k].add(u);}
  // shop front: dark interior, counter board, awning, goods
  const sp=ops1.front[0],F=W1.faces.front,sw=sp.w,shh=sp.y1-sp.y0;
  put(F,box(sw,shh,.02,M.dark),sp.x,sp.y0+shh/2,-t+.02);put(F,box(sw+.2,.22,.12,M.timber),sp.x,sp.y1+.11,.03);
  put(F,box(sw+.1,.07,.6,M.planks),sp.x,sp.y0,.24);for(const s of[-1,1])put(F,sqBeam([sp.x+s*(sw/2-.15),sp.y0-.5,.01],[sp.x+s*(sw/2-.15),sp.y0-.04,.5],.06,M.timber));
  const aw=box(sw+.1,.06,.75,M.planks);put(F,aw,sp.x,sp.y1+.12,.33,-.5,0,0);for(const s of[-1,1])put(F,beam([sp.x+s*(sw/2-.05),sp.y1+.3,.66],[sp.x+s*(sw/2-.05),sp.y1-.2,.02],.012,M.iron));
  for(let i=0;i<5;i++){const j=cyl(.07,.06,.18+R()*.1,10,M.clay);put(F,j,sp.x-sw/2+.25+i*.4,sp.y0+.13,.3);}
  for(let i=0;i<2;i++){const c=cyl(.09,.09,.7,12,i?M.clothB:M.cloth);put(F,c,sp.x+.5,sp.y0+.13+i*.18,.42,0,0,Math.PI/2);}
  // jetty band and joists
  put(root,box(Lx2,band,Dz2,M.timber),0,h1+band/2,.2);
  for(let i=0;i<12;i++){const x=-Lx2/2+.25+i*(Lx2-.5)/11;put(root,box(.12,.14,.5,M.timber),x,h1-.07,Dz/2+.15);}
  for(let i=0;i<9;i++){const z=-Dz/2+.4+i*(Dz-.2)/8;for(const s of[-1,1])put(root,box(.5,.14,.12,M.timber),s*(Lx/2+.1),h1-.07,z);}
  for(const s of[-1,1])put(root,sqBeam([s*(Lx/2-.05),h1-.9,Dz/2+.05],[s*(Lx/2+.25),h1-.05,Dz/2+.35],.12,M.timber));
  const ops2={front:[{x:-1.35,w:1.15,y0:.75,y1:1.75},{x:1.35,w:1.15,y0:.75,y1:1.75}],back:[{x:.9,w:.8,y0:.8,y1:1.7}],right:[{x:-.5,w:.8,y0:.8,y1:1.7}],left:[{x:.5,w:.8,y0:.8,y1:1.7}]};
  const W2=walls4({Lx:Lx2,Dz:Dz2,y:h1+band,h:h2,t:t2,mat:M.plasterOchre,ops:ops2,frame:true,frameOpts:{gap:.55,braces:false,rail:1.0},unit:{flowers:false}},M);W2.group.position.z=.2;root.add(W2.group);
  const hole={x:0,y0:.7,w:.75,h:.8};
  for(const k of['front','back']){const tri=gableTri(Lx2,H,t2,M.plasterOchre,k==='front'?{hole}:{});put(W2.faces[k],tri,0,h2,0);put(W2.faces[k],gableTimber(Lx2,H,M,k==='front'?{hole}:{}),0,h2,0);}
  const gw=windowUnit(hole.w,hole.h,t2,M,{});put(W2.faces.front,gw,0,h2+hole.y0,0);
  put(root,gableRoof(Lx2,Dz2,H,M.tiles,{t:.13,over:.3,overL:.35,barge:M.timber,ridgeMat:M.clay}),0,h1+band+h2,.2);
  const ch=chimney(.7,.8,H+.6,M,{pots:2,band:true});put(root,ch,1.25,h1+band+h2+.1,-1.6);
  // hanging sign
  const sg=new THREE.Group();put(F,sg,Lx/2-.22,h1-.25,0);put(sg,beam([0,0,0],[0,0,1.05],.025,M.iron));put(sg,beam([0,-.35,0],[0,0,.7],.018,M.iron));
  const board=box(.06,.55,.6,M.sign,{s:.6,ox:0,oy:0,oz:0});put(sg,board,0,-.38,.72);for(const z of[.5,.94])put(sg,beam([0,0,z],[0,-.1,z],.008,M.iron));
  put(root,box(1.15,.14,.5,M.ashlar),1.55,.07,Dz/2+.25);
  const lt=lantern(M,lights);put(root,lt,.75,2.15,Dz/2);
  put(root,barrel(M),-2.3,0,Dz/2+.55);put(root,barrel(M,{r:.26,h:.7}),-1.7,0,Dz/2+.75);put(root,crate(M,.55),2.55,0,Dz/2+.6,0,.3,0);put(root,crate(M,.45),2.6,.55,Dz/2+.6,0,.6,0);
  put(root,sack(M),-1.9,0,Dz/2+1.3);
  put(root,stepStones(M,6,[1.5,Dz/2+.8],[1.0,Dz/2+3.8]));
  put(root,grassTufts(M,80,4,9,(x,z)=>Math.abs(x)<4.3&&z>-3.3&&z<4.8));
  return root;}

function buildLogCabin(){const M=mats(),root=new THREE.Group(),lights=[];root.userData.lights=lights;
  const Lx=5.2,Dz=4.2,r=.16,n=8,step=2*r*.93,base=.22,H=1.9;
  const hw=n*step+r*.2;
  put(root,yard(M,9,8,.2,.7));
  put(root,box(Lx+.1,base,Dz+.1,M.field),0,base/2,0);
  const ops={front:[{type:'door',x:-.6,w:.95,y0:0,y1:1.9},{x:1.3,w:.8,y0:.9,y1:1.55}],back:[{x:.6,w:.6,y0:.95,y1:1.5}],right:[{x:.2,w:.7,y0:.9,y1:1.5}],left:[]};
  const faces={},defs={front:[0,Dz/2,0,Lx,0],back:[0,-Dz/2,Math.PI,Lx,0],right:[Lx/2,0,Math.PI/2,Dz,1],left:[-Lx/2,0,-Math.PI/2,Dz,1]};
  for(const k in defs){const[x,z,ry,len,phase]=defs[k],o=ops[k],wg=new THREE.Group();wg.position.set(x,base,z);wg.rotation.y=ry;root.add(wg);faces[k]=wg;
    const ch=wall(len-.3,hw,r*1.3,M.plasterWhite,o);ch.position.z=-r*.5;wg.add(ch);
    for(let i=0;i<n;i++){const y=r+i*step+(phase?step/2:0);if(y+r>hw+.02)continue;const ext=.28;let segs=[[-len/2-ext,len/2+ext]];
      for(const op of o){if(y+r*.6>op.y0&&y-r*.6<op.y1){const a=op.x-op.w/2,b=op.x+op.w/2,ns=[];for(const[s0,s1]of segs){if(b<=s0||a>=s1){ns.push([s0,s1]);continue;}if(a>s0)ns.push([s0,a]);if(b<s1)ns.push([b,s1]);}segs=ns;}}
      for(const[s0,s1]of segs){if(s1-s0<.05)continue;const lg=logMesh(r*(.93+R()*.12),s1-s0,M);lg.rotation.z=Math.PI/2;lg.position.set((s0+s1)/2,y,-r);wg.add(lg);}}
    for(const op of o){const oo=Object.assign({frame:M.planks,shutters:k==='front'?M.shutterRed:null},op);const u=op.type==='door'?doorUnit(op.w,op.y1-op.y0,2*r,M,oo):windowUnit(op.w,op.y1-op.y0,2*r,M,oo);u.position.set(op.x,op.y0,0);wg.add(u);
      if(op.type!=='door')put(wg,box(op.w+.25,.12,.1,M.planks),op.x,op.y1+.06,.02);}}
  for(const k of['left','right']){const tri=gableTri(Dz+.1,H,.08,M.planksDark);put(faces[k],tri,0,hw,-.06);}
  put(root,gableRoof(Dz,Lx,H,M.shingles,{t:.12,over:.65,overL:.55,barge:M.planksDark,ridgeMat:M.planksDark}),0,base+hw,0,0,Math.PI/2,0);
  // fieldstone chimney
  const cg=new THREE.Group();put(root,cg,-Lx/2-.55,0,.2);put(cg,box(1.1,1.7,1.2,M.field),0,.85,0);const sl=box(1.1,.5,1.2,M.field);put(cg,sl,.12,1.8,0,0,0,.45);
  put(cg,box(.62,base+hw+H+.6-1.7,.7,M.field),.12,1.7+(base+hw+H+.6-1.7)/2,0);put(cg,box(.72,.1,.8,M.field),.12,base+hw+H+.65,0);
  put(root,box(1.2,.16,.55,M.planks),-.6,.08,Dz/2+.3);
  const lt=lantern(M,lights);put(root,lt,.15,base+1.9,Dz/2);
  put(root,choppingBlock(M),2.2,0,Dz/2+1.7);
  const wp=woodpile(M,{rows:6,cols:12,r:.085,L:.6});put(root,wp,Lx/2+.55,0,-.2,0,Math.PI/2,0);
  // sawhorse with log
  const sh=new THREE.Group();put(root,sh,-1.8,0,Dz/2+1.9,0,.4,0);for(const s of[-1,1]){put(sh,sqBeam([s*.5,0,-.3],[s*.5,.75,.0],.06,M.timber));put(sh,sqBeam([s*.5,0,.3],[s*.5,.75,0],.06,M.timber));}
  const lg=logMesh(.13,1.8,M);put(sh,lg,0,.85,0,0,0,Math.PI/2);
  put(root,barrel(M,{water:true}),Lx/2+.1,0,Dz/2+.4);
  put(root,stepStones(M,5,[-.6,Dz/2+.9],[-.2,Dz/2+3.4]));
  for(const[x,z,s]of[[-3.2,-1.6,1.1],[3.6,1.9,.8],[1.5,-3.1,1]])put(root,bush(M,s),x,0,z);
  put(root,grassTufts(M,100,3.4,9,(x,z)=>x>-3.6&&x<4&&z>-2.8&&z<4.2));
  return root;}

function buildBarn(){const M=mats(),root=new THREE.Group(),lights=[];root.userData.lights=lights;
  const Lx=12,Dz=7.4,hw=4.2,t=.2,H=4.6;
  put(root,yard(M,15,12,0,1.2));
  const door={type:'barn',x:0,w:3.8,y0:0,y1:3.8};
  const ops={front:[door,{x:-3.8,w:.5,y0:2.2,y1:3},{x:3.8,w:.5,y0:2.2,y1:3}],back:[{type:'door',x:3.4,w:1.1,y0:0,y1:2.1}],right:[],left:[]};
  const W=walls4({Lx,Dz,y:0,h:hw,t,mat:M.planksDark,ops,frame:true,frameOpts:{pw:.22,gap:2,rail:2.1},noUnits:true},M);root.add(W.group);
  const P=walls4({Lx:Lx+.16,Dz:Dz+.16,y:0,h:.65,t:.32,mat:M.field,ops:{front:[Object.assign({},door,{y1:.65})],back:[{x:3.4,w:1.1,y0:0,y1:.65}]},noUnits:true},M);root.add(P.group);
  const F=W.faces.front;
  for(const op of ops.front.slice(1)){const u=windowUnit(op.w,op.y1-op.y0,t,M,{});F.add(u);u.position.set(op.x,op.y0,0);}
  put(W.faces.back,doorUnit(1.1,2.1,t,M,{leaf:M.planks}),3.4,0,0);
  // great doors: left closed, right swung open
  for(const s of[-1,1]){const lf=new THREE.Group(),lw=door.w/2;put(lf,box(lw,door.y1,.09,M.planks,{s:2,ox:0}),s*lw/2,door.y1/2,0);
    for(const y of[.35,door.y1/2,door.y1-.35])put(lf,box(lw-.1,.16,.05,M.timber),s*lw/2,y,.07);
    const L=Math.hypot(lw-.2,door.y1/2-.7),a=Math.atan2(door.y1/2-.7,(lw-.2));for(const yb of[.35,door.y1/2])put(lf,box(L,.13,.04,M.timber),s*lw/2,yb+(door.y1/2-.7)/2+.0,.07,0,0,s*a);
    for(const y of[.35,door.y1-.35])put(lf,box(lw*.6,.06,.02,M.iron),s*lw*.3,y,.1);
    lf.position.set(s*lw,0,.02);if(s>0)lf.rotation.y=1.25;F.add(lf);}
  put(F,box(door.w+.5,.26,.16,M.timber),0,door.y1+.13,.05);
  // interior
  put(root,box(Lx-.4,.04,Dz-.4,M.dirt,{s:2}),0,.02,0);
  const pile=haystack(M,{r:1.5,h:1.2});put(root,pile,-2.6,0,-1.2);put(root,crate(M,.7),2.6,0,-2.2);
  const posts=[-3,3];for(const x of posts)put(root,box(.25,hw,.25,M.timber),x,hw/2,0);put(root,box(Lx-.4,.25,.25,M.timber),0,hw-.2,0);
  // gables: hayloft on the right
  const loft={x:0,y0:.4,w:1.4,h:1.5};
  for(const k of['right','left']){const tri=gableTri(Dz,H,t,M.planksDark,k==='right'?{hole:loft}:{});put(W.faces[k],tri,0,hw,0);}
  const R_=W.faces.right;put(R_,box(loft.w,loft.h,.02,M.dark),0,hw+loft.y0+loft.h/2,-t+.02);
  const ld=new THREE.Group();put(ld,box(loft.w,loft.h,.07,M.planks,{s:2,ox:0}),loft.w/2,loft.h/2,0);put(ld,box(loft.w-.1,.12,.04,M.timber),loft.w/2,.3,.05);put(ld,box(loft.w-.1,.12,.04,M.timber),loft.w/2,loft.h-.3,.05);
  ld.position.set(-loft.w/2,hw+loft.y0,.03);ld.rotation.y=-1.9;R_.add(ld);
  const hy=jitterGeo(new THREE.SphereGeometry(.6,10,6,0,Math.PI*2,0,Math.PI/2),.15);scaleUV(hy,1.5);const hm=shadowed(new THREE.Mesh(hy,M.hay));hm.scale.set(1.1,.6,.5);put(R_,hm,0,hw+loft.y0,0);
  const hb=box(.22,.22,1.9,M.timber);put(R_,hb,0,hw+loft.y0+loft.h+.35,.6);
  put(R_,cyl(.12,.12,.08,12,M.timber),0,hw+loft.y0+loft.h+.22,1.35,0,0,Math.PI/2);put(R_,beam([0,hw+loft.y0+loft.h+.12,1.47],[0,1.2,1.47],.012,M.rope));put(R_,shadowed(new THREE.Mesh(new THREE.TorusGeometry(.06,.01,4,10),M.iron)),0,1.15,1.47);
  put(root,gableRoof(Dz,Lx,H,M.thatch,{t:.45,over:.6,overL:.5,ridge:'thatch'}),0,hw,0,0,Math.PI/2,0);
  const lt=lantern(M,lights);put(root,lt,-2.3,2.7,Dz/2);
  // yard props
  put(root,haystack(M),-8,0,1.2);put(root,haystack(M,{r:1.1,h:1.3}),-8.2,0,-2.2);
  put(root,cart(M,{load:'hay'}),4.2,0,Dz/2+2.6,0,-.6,0);
  const pf=pitchfork(M);put(root,pf,-1.95,0,Dz/2+.18,-.22,0,0);
  for(let i=0;i<4;i++)put(root,sheaf(M),-4.4+i*.42,0,Dz/2+.45,rnd(-.1,.1),0,rnd(-.15,.15));
  put(root,trough(M),6.8,0,1.2,0,Math.PI/2,0);put(root,barrel(M),6.7,0,-1.1);
  const fn=fence(M,5);put(root,fn,6.9,0,-.2,0,Math.PI/2,0);
  put(root,grassTufts(M,140,6.5,14,(x,z)=>Math.abs(x)<9.5&&z>-4.5&&z<7.5));
  return root;}

function buildGranary(){const M=mats(),root=new THREE.Group(),lights=[];root.userData.lights=lights;
  const Lx=3.8,Dz=3,fy=.96,hw=2.1,t=.14,H=2.1,ov=.4;
  put(root,yard(M,7,7,0,.8));
  // staddle stones
  for(const x of[-1.6,0,1.6])for(const z of[-1.2,0,1.2]){const st=new THREE.Group();put(root,st,x,0,z);put(st,cyl(.12,.2,.56,10,M.ashlar),0,.28,0);put(st,cyl(.4,.38,.1,16,M.ashlar),0,.6,0);
    const dome=new THREE.Mesh(new THREE.SphereGeometry(.4,16,6,0,Math.PI*2,0,Math.PI/2),M.ashlar);shadowed(dome);dome.scale.y=.22;put(st,dome,0,.65,0);}
  for(const z of[-1.2,0,1.2])put(root,box(Lx+.1,.2,.2,M.timber),0,.79,z);
  for(const x of[-1.75,-.6,.6,1.75])put(root,box(.16,.12,Dz+.1,M.timber),x,.89,0);
  put(root,box(Lx,.06,Dz,M.planks),0,fy-.03,0);
  const ops={front:[{type:'door',x:.7,w:.85,y0:0,y1:1.8,leaf:M.planks,frame:M.timber,recess:.07}],back:[],right:[{type:'vent',x:0,w:.7,y0:1.2,y1:1.7}],left:[]};
  const W=walls4({Lx,Dz,y:fy,h:hw,t,mat:M.weather,ops,noUnits:true},M);root.add(W.group);
  put(W.faces.front,doorUnit(.85,1.8,t,M,ops.front[0]),.7,0,0);
  const V=W.faces.right;for(let i=0;i<5;i++)put(V,box(.7,.06,.1,M.timber),0,1.25+i*.1,-.05,-.6,0,0);put(V,box(.7,.5,.02,M.dark),0,1.45,-t+.02);
  for(const[x,z]of[[1,1],[1,-1],[-1,1],[-1,-1]])put(root,box(.18,hw+.06,.18,M.timber),x*(Lx/2+.01),fy+hw/2,z*(Dz/2+.01));
  put(root,box(Lx+.12,.16,Dz+.12,M.timber),0,fy+hw+.08,0);
  put(root,box(Lx+.06,.12,Dz+.06,M.timber),0,fy+.06,0);
  // pyramid hip roof
  const top=fy+hw+.16,hx=Lx/2+ov,hz=Dz/2+ov;
  let geo=new THREE.ConeGeometry(1,H,4,1);geo.rotateY(Math.PI/4);const uv=geo.attributes.uv;const per=2*(2*hx+2*hz),sl=Math.hypot(H,Math.min(hx,hz));for(let i=0;i<uv.count;i++)uv.setXY(i,uv.getX(i)*per/2,uv.getY(i)*sl/2);
  geo=geo.toNonIndexed();geo.computeVertexNormals();const rf=shadowed(new THREE.Mesh(geo,M.tiles));rf.scale.set(hx*Math.SQRT2,1,hz*Math.SQRT2);put(root,rf,0,top+H/2-.18,0);
  for(const[sx,sz]of[[1,1],[1,-1],[-1,1],[-1,-1]])root.add(beam([0,top+H-.12,0],[sx*hx,top-.16,sz*hz],.065,M.clay,8));
  put(root,cyl(.05,.07,.25,8,M.clay),0,top+H-.05,0);const fin=shadowed(new THREE.Mesh(new THREE.SphereGeometry(.09,10,8),M.clay));put(root,fin,0,top+H+.15,0);
  // detached steps (the gap keeps rats out)
  const stp=new THREE.Group();put(root,stp,.7,0,Dz/2+.35);
  for(const s of[-1,1])put(stp,sqBeam([s*.42,0,.95],[s*.42,fy-.12,.05],.08,M.timber));
  for(let i=0;i<4;i++){const f=(i+1)/5;put(stp,box(.9,.06,.28,M.planks),0,f*(fy-.1),.95-f*.9);}
  // props
  put(root,sack(M),-.6,0,Dz/2+.55);put(root,sack(M),-1.05,0,Dz/2+.75);put(root,sack(M),-.8,.38,Dz/2+.62);put(root,sack(M),-1.5,0,Dz/2+.4);
  put(root,barrel(M,{r:.25,h:.65}),-1.9,0,-Dz/2-.6);put(root,crate(M,.55),2.4,0,-.4,0,.4,0);
  put(root,cart(M,{load:'sacks'}),3.8,0,-1.4,0,-2.6,0);
  const lt=lantern(M,lights);put(W.faces.front,lt,1.3,1.65,0);
  put(root,bush(M,.9),-2.9,0,-.4);
  put(root,grassTufts(M,90,3,8,(x,z)=>x>-3&&x<5.5&&z>-2.6&&z<3.6));
  return root;}

/* ---------- registry ---------- */
const FOLDERS={
  '':{name:'Library',children:['characters','buildings','items']},
  'characters':{name:'Characters',blurb:'Heroes, villagers, creatures',children:[]},
  'buildings':{name:'Buildings',blurb:'Houses, farmsteads, fortifications',children:['buildings/medieval']},
  'buildings/medieval':{name:'Medieval',blurb:'Village and farmstead',children:[]},
  'items':{name:'Items',blurb:'Weapons, armor, potions',children:['items/weapons','items/armor','items/potions']},
  'items/weapons':{name:'Weapons',blurb:'Blades, bows, polearms',children:[]},
  'items/armor':{name:'Armor',blurb:'Helms, mail, shields',children:[]},
  'items/potions':{name:'Potions',blurb:'Flasks, vials, elixirs',children:[]},
};
const ASSETS=[
  {id:'half-timbered-cottage',folder:'buildings/medieval',name:'Half-timbered cottage',build:buildTimberCottage,
   desc:'Oak-framed cottage with lime-plaster infill and chevron bracing, a long-straw thatch and a gable-end stone chimney. Green shutters, window boxes and a lantern by the door.'},
  {id:'stone-croft',folder:'buildings/medieval',name:'Stone croft',build:buildStoneCroft,
   desc:'Thick rubble-stone walls with dressed quoins, an arched plank door and slate roof between twin gable chimneys. A slate lean-to keeps the firewood dry.'},
  {id:'merchants-townhouse',folder:'buildings/medieval',name:"Merchant's townhouse",build:buildTownhouse,
   desc:'Stone shop floor with a drop-down counter and awning, jettied upper storey in close-studded timber, a clay-tile roof and a painted trade sign.'},
  {id:'woodcutters-cabin',folder:'buildings/medieval',name:"Woodcutter's cabin",build:buildLogCabin,
   desc:'Saddle-notched log walls with lime chinking, a cedar-shingle roof and a fieldstone chimney. Chopping block, sawhorse and a season of split firewood.'},
  {id:'thatched-barn',folder:'buildings/medieval',name:'Thatched barn',build:buildBarn,
   desc:'Twelve-metre aisled barn of tarred boards on a stone plinth, with wagon doors, a hayloft hoist and a deep thatch. Haystacks, a hay cart and a water trough in the yard.'},
  {id:'staddle-granary',folder:'buildings/medieval',name:'Staddle granary',build:buildGranary,
   desc:'Weatherboarded grain store raised on nine mushroom-shaped staddle stones to keep out damp and rats, under a pyramid tile roof. The steps stop short of the door on purpose.'},
];

