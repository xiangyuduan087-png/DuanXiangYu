const fs=require('node:fs'),cp=require('node:child_process');
const files=JSON.parse(fs.readFileSync('content/publication-assets.json','utf8'));
const wanted=new Set(files.map(f=>'public'+f.url));
for(const f of files){const name='public'+f.url;if(!fs.existsSync(name)||fs.statSync(name).size!==f.bytes)throw Error('缺少或已改变发布资源：'+name);if(f.bytes>100*1024*1024)throw Error('资源超出GitHub单文件100MiB限制：'+name);}
const tracked=cp.execFileSync('git',['ls-files','-z','--','public'],{encoding:'utf8'}).split('\0').filter(Boolean);
for(const name of tracked)if(!wanted.has(name))cp.execFileSync('git',['rm','--cached','--',name],{stdio:'pipe'});
const names=Array.from(wanted);for(let i=0;i<names.length;i+=40)cp.execFileSync('git',['add','-f','--',...names.slice(i,i+40)],{stdio:'pipe'});
console.log(`已暂存 ${files.length} 个发布资源；本地原文件未删除。`);
