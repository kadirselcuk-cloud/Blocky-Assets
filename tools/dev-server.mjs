// Zero-dependency dev server: serves the project on the first free port from 5173,
// reloads the browser on every save, and rebuilds dist/ and the asset catalog in the background.
import http from 'http';import fs from 'fs';import path from 'path';import net from 'net';import {exec} from 'child_process';import {fileURLToPath} from 'url';
import {build} from './build.mjs';import {catalog} from './gen-catalog.mjs';
const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');const NO_OPEN=process.argv.includes('--no-open');
const TYPES={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.json':'application/json','.css':'text/css','.png':'image/png','.svg':'image/svg+xml','.glb':'model/gltf-binary','.md':'text/markdown; charset=utf-8'};
const clients=new Set();
const LIVE=`<script>(()=>{const es=new EventSource('/__live');es.onmessage=e=>{if(e.data==='reload')location.reload();};})();</script>`;
const free=p=>new Promise(r=>{const s=net.createServer().once('error',()=>r(false)).once('listening',()=>s.close(()=>r(true))).listen(p,'127.0.0.1');});
let port=+process.env.PORT||5173;while(!(await free(port)))port++;
http.createServer((req,res)=>{const u=decodeURIComponent(req.url.split('?')[0]);
  if(u==='/__live'){res.writeHead(200,{'Content-Type':'text/event-stream','Cache-Control':'no-cache',Connection:'keep-alive'});res.write('data: hello\n\n');clients.add(res);req.on('close',()=>clients.delete(res));return;}
  let f=path.join(ROOT,u==='/'?'index.html':u);if(!f.startsWith(ROOT)){res.writeHead(403);return res.end();}
  fs.stat(f,(e,st)=>{if(e||!st.isFile()){res.writeHead(404);return res.end('Not found: '+u);}
    const ext=path.extname(f);res.setHeader('Cache-Control','no-store');res.setHeader('Content-Type',TYPES[ext]||'application/octet-stream');
    if(path.basename(f)==='index.html'){return res.end(fs.readFileSync(f,'utf8').replace('</body>',LIVE+'</body>'));}fs.createReadStream(f).pipe(res);});
}).listen(port,'127.0.0.1',()=>{const url=`http://localhost:${port}/`;fs.writeFileSync(path.join(ROOT,'.devserver.json'),JSON.stringify({port,url},null,1));
  console.log(`\n  Blocky Assets running at ${url}\n  Watching src/, index.html, vendor/ - the browser reloads on every save.\n  Ctrl+C to stop.\n`);
  if(!NO_OPEN)exec(process.platform==='win32'?`start "" "${url}"`:process.platform==='darwin'?`open ${url}`:`xdg-open ${url}`,()=>{});});
const rebuild=()=>{try{build({quiet:true});}catch(e){console.error('build failed:',e.message);}try{const n=catalog({quiet:true});console.log(`  rebuilt (${n} assets) ${new Date().toLocaleTimeString()}`);}catch(e){console.error('catalog failed (the page will show the real error):',e.message);}};
let timer=null;const changed=(f)=>{if(f&&/\.(swp|tmp)$|~$/.test(f))return;clearTimeout(timer);timer=setTimeout(()=>{for(const c of clients)c.write('data: reload\n\n');setTimeout(rebuild,50);},120);};
for(const d of['src','vendor'])try{fs.watch(path.join(ROOT,d),{recursive:true},(e,f)=>changed(f));}catch{for(const sub of fs.readdirSync(path.join(ROOT,d),{withFileTypes:true}))if(sub.isDirectory())fs.watch(path.join(ROOT,d,sub.name),(e,f)=>changed(f));fs.watch(path.join(ROOT,d),(e,f)=>changed(f));}
fs.watch(path.join(ROOT,'index.html'),()=>changed('index.html'));
rebuild();
