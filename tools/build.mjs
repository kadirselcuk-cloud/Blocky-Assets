// Builds dist/ from src/: a single-file viewer (asset-forge.html) and a drop-in library (asset-forge-lib.js).
import fs from 'fs';import path from 'path';import {fileURLToPath} from 'url';
const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
export function build({quiet=false}={}){
  const m=JSON.parse(read('src/manifest.json'));const t0=Date.now();
  const lib=m.library.map(f=>`/* ---- ${f} ---- */\n`+read(f)).join('\n');
  const vendor=m.vendor.map(read).join('\n');const app=m.app.map(read).join('\n');
  const html=read('index.html').replace(/<!--LOADER-->[\s\S]*<!--\/LOADER-->/,()=>`<script>\n${vendor}\n</script>\n<script>\n${lib}\n${app}\n</script>`);
  fs.mkdirSync(path.join(ROOT,'dist'),{recursive:true});
  fs.writeFileSync(path.join(ROOT,'dist/asset-forge.html'),html);
  fs.writeFileSync(path.join(ROOT,'dist/asset-forge-lib.js'),`/* Blocky Assets library. Needs THREE r128 loaded first (and vendor/GLTFExporter.js for GLB export). Exposes window.AssetForge, ASSETS, FOLDERS. */\n${lib}\n`);
  if(!quiet)console.log(`built dist/asset-forge.html and dist/asset-forge-lib.js in ${Date.now()-t0} ms`);}
if(process.argv[1]&&fileURLToPath(import.meta.url)===path.resolve(process.argv[1]))build();
