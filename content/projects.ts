import hidden from './hidden-projects.json';
import playbackMetadata from './video-playback-metadata.json';
import {publicResources} from '@/lib/public-url';
import imported from './imported-projects.json';
import presentation from './design-display.json';
import verifiedBilibili from './bilibili-matches.json';
import type {Project} from '@/lib/types';
const names=presentation.names as Record<string,string>;
export const projects:Project[]=publicResources(imported as unknown as Project[]).filter(p=>!presentation.excluded.includes(p.id)&&!hidden.projectIds.includes(p.id)).map(project=>{
 let p=project;
 if(p.direction==='video'&&p.episodes?.length){
  const verified=playbackMetadata as Record<string,{width:number;height:number;duration:string}>;
  const episodes=p.episodes.map(e=>({...e,...verified[e.id]}));
  const seconds=episodes.reduce((sum,e)=>sum+e.duration.split(':').reduce((n,v)=>n*60+Number(v),0),0);
  const cents=Math.round(seconds*100);
  p={...p,episodes,duration: `${String(Math.floor(cents/6000)).padStart(2,'0')}:${String(Math.floor(cents/100)%60).padStart(2,'0')}.${String(cents%100).padStart(2,'0')}`};
 }
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
