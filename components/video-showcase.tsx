'use client';
import {useEffect,useLayoutEffect,useRef,useState} from 'react';
import type {VideoProject} from '@/lib/types';
import Gallery from './gallery';
import {formatDuration} from '@/lib/media';
export default function VideoShowcase({project}:{project:VideoProject}){
 const [index,setIndex]=useState(0),[failed,setFailed]=useState(false),ref=useRef<HTMLVideoElement>(null);const episode=project.episodes?.[index];
 useLayoutEffect(()=>{const video=ref.current,body=video?.closest<HTMLElement>('.detail-scroll');if(!video||!body)return;const fit=()=>{const before=video.getBoundingClientRect().top-body.getBoundingClientRect().top+body.scrollTop;video.style.setProperty('--video-room',`${Math.max(140,body.clientHeight-before-16)}px`);};fit();const observer=new ResizeObserver(fit);observer.observe(body);if(video.parentElement)observer.observe(video.parentElement);return()=>observer.disconnect();},[index]);
 useEffect(()=>{const el=ref.current;const hide=()=>{if(document.hidden)el?.pause();};document.addEventListener('visibilitychange',hide);return()=>{document.removeEventListener('visibilitychange',hide);el?.pause();};},[index]);
 return <><div className="episode-tabs">{project.episodes?.map((e,i)=><button key={e.id} aria-pressed={i===index} onClick={()=>{ref.current?.pause();setFailed(false);setIndex(i);}}>{e.title} · {formatDuration(e.duration)}</button>)}</div><video key={episode?.id} ref={ref} style={{viewTransitionName:`cover-${project.id}`}} className="work-video" data-orientation={episode&&episode.height>episode.width?'portrait':'landscape'} onError={()=>setFailed(true)} controls playsInline preload="none" src={episode?.src||project.video||undefined} poster={episode?.poster||project.cover?.src} aria-label={project.title+'视频播放器'}/>{failed&&<p className="media-error" role="status">视频暂时无法加载，请稍后重试。</p>}{episode?.bilibiliUrl&&<a className="bilibili-watch" href={episode.bilibiliUrl} target="_blank" rel="noopener noreferrer">在 B 站观看 · {episode.title} ↗</a>}<p className="media-caption">{episode&&episode.width>=episode.height?'横屏':'竖屏'} · {episode?.width} × {episode?.height} · {formatDuration(episode?.duration)}</p>{project.detail.background&&<section className="case-section"><h2>故事与创作内容</h2><p>{project.detail.background}</p></section>}<section className="process-assets"><h2>制作过程素材</h2><p className="muted">随成片提供的剧本、分镜与资产。</p>{project.processGroups?.filter(g=>g.episodeId===episode?.id).map(g=><details key={g.episodeId+g.label}><summary>{g.label} · {g.images.length+g.documents.length} 份素材</summary>{g.documents.map(d=><div key={d.src}><h3>{d.title}</h3><a href={d.src} download>下载原文 ↓</a><pre className="script-text">{d.text}</pre></div>)}{!!g.images.length&&<Gallery images={g.images} compact/>}</details>)}</section></>;
}




