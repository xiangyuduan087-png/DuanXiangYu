import imported from './imported-projects.json';
import presentation from './design-display.json';
import verifiedBilibili from './bilibili-matches.json';
import type {Project} from '@/lib/types';
const names=presentation.names as Record<string,string>;
export const projects:Project[]=(imported as unknown as Project[]).filter(p=>!presentation.excluded.includes(p.id)).map(p=>{
 if(p.direction!=='design'){
  const matches=verifiedBilibili as Record<string,{title:string;episodes:Record<string,{title:string;bvid:string;evidence:string}>}>;
  const match=matches[p.id];if(!match)return p;
  return {...p,title:match.title,titleTemporary:false,summary:p.summary.replace('提供脚本中的暂定名；',''),cover:p.cover?{...p.cover,alt:match.title,caption:match.title}:null,episodes:p.episodes?.map(episode=>{const verified=match.episodes[episode.id];return verified?{...episode,title:verified.title,bilibiliUrl:`https://www.bilibili.com/video/${verified.bvid}/`}:episode;})};
 }
 const title=names[p.id]||p.title;
 return {...p,title,summary:'',cover:p.cover?{...p.cover,alt:title,caption:title}:null,detail:{...p.detail,images:p.detail.images.map((image,i)=>({...image,alt:`${title} · 图 ${String(i+1).padStart(2,'0')}`,caption:p.detail.images.length>1?`${title} · 图 ${String(i+1).padStart(2,'0')}`:title}))}};
});
export const getProjects=(direction:Project['direction'])=>projects.filter(p=>p.direction===direction).sort((a,b)=>a.order-b.order);
export const getFeatured=(direction:Project['direction'])=>getProjects(direction).filter(p=>p.featured).slice(0,3);
export const getProject=(id:string)=>projects.find(p=>p.id===id);
