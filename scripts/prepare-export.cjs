const fs=require('node:fs'),path=require('node:path');
require('./audit-publish.cjs');
const root=path.resolve(__dirname,'..'),out=path.join(root,'out');
const report=JSON.parse(fs.readFileSync(path.join(root,'verification/publish-resources.json'),'utf8'));
const external=!!process.env.NEXT_PUBLIC_MEDIA_BASE_URL;
const required=JSON.parse(fs.readFileSync(path.join(root,'content/publication-assets.json'),'utf8'));
for(const item of required){if(external&&/^\/projects\/[^/]+\/videos\/.*\.mp4$/.test(item.url))continue;const file=path.join(root,'public',item.url);if(!fs.existsSync(file)||fs.statSync(file).size!==item.bytes)throw Error('发布资源未完整准备：'+item.url);}
const keep=new Set(report.files.filter(f=>!(external&&/^\/projects\/[^/]+\/videos\/.*\.mp4$/.test(f.url))).map(f=>f.url));
// Remove only copied public resources in the generated export; original public files stay intact.
for(const item of [...report.files,...report.unused]){const target=path.resolve(out,'.'+item.url);if(!target.startsWith(out+path.sep))throw Error('Invalid export path');if(!keep.has(item.url)&&fs.existsSync(target))fs.unlinkSync(target);}
let bytes=0;const visit=dir=>{for(const item of fs.readdirSync(dir,{withFileTypes:true})){const file=path.join(dir,item.name);if(item.isDirectory())visit(file);else{if(file.endsWith('.css')){const css=fs.readFileSync(file,'utf8').replace(/url\((['"]?)\/(fonts\/[^)'"\s]+)\1\)/g,'url($1/DuanXiangYu/$2$1)');fs.writeFileSync(file,css);}bytes+=fs.statSync(file).size;}}};visit(out);
fs.writeFileSync(path.join(out,'.nojekyll'),'');
console.log(JSON.stringify({exportBytes:bytes,externalVideo:external}));
if(bytes>1_000_000_000&&!process.argv.includes('--local-check'))throw Error('Pages发布包超过官方1 GB限制；请先配置已验证的外部视频存储。未发布任何文件。');
