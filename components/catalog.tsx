'use client';
import {useEffect,useMemo,useRef,useState} from 'react';
import type {Project,Direction} from '@/lib/types';
import {designCategories,videoCategories} from '@/lib/types';
import {categoryCovers} from '@/content/category-covers';
import {formatDuration} from '@/lib/media';
import Ring from './ring';
import {presentationEntries} from '@/lib/presentation';
import previewPositions from '@/content/preview-positions.json';
import ArtworkImage from './artwork-image';
export default function Catalog({direction,projects,category,onCategory,onOpen}:{direction:Direction;projects:Project[];category:string;onCategory:(category:string)=>void;onOpen:(id:string)=>void}){
 const angle=useRef(Math.PI/2),[shown,setShown]=useState(category),[phase,setPhase]=useState('enter');
 useEffect(()=>{if(category===shown)return;setPhase('exit');const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;const timer=setTimeout(()=>{setShown(category);setPhase('enter');requestAnimationFrame(()=>{const section=document.getElementById(direction);if(section&&location.hash.slice(1)===direction)window.scrollTo({top:section.getBoundingClientRect().top+scrollY-64,behavior:'instant'});});},reduced?0:160);return()=>clearTimeout(timer);},[category,shown,direction]);
 const selected=useMemo(()=>projects.filter(p=>p.categories[0]===shown).sort((a,b)=>a.order-b.order),[projects,shown]);
 const categories=direction==='design'?designCategories:videoCategories;
 const items=categories.map(name=>({id:name,title:name,subtitle:`${projects.filter(p=>p.categories[0]===name).length} 个项目`,cover:categoryCovers[name],alt:`${name}分类封面`}));
 const ip=direction==='design'&&shown==='IP',entries=presentationEntries(selected);
 const [compact,setCompact]=useState(false);
 useEffect(()=>{const media=matchMedia('(max-width: 700px)'),update=()=>setCompact(media.matches);update();media.addEventListener('change',update);return()=>media.removeEventListener('change',update);},[]);
 return <section id={direction} className="catalog-section page-zone" data-category={shown} data-view={shown?'grid':'categories'}><div className="catalog-panel"><header className="catalog-heading"><p className="eyebrow">{direction==='design'?'DESIGN':'MOTION'} / {shown?'WORKS':'CATEGORIES'}</p><h2>{direction==='design'?'设计作品':'视频作品'}{shown&&<span> / {shown}</span>}</h2><span>{shown?ip?`${selected.length} 个项目 · ${entries.length} 张展示图`:`${selected.length} 个作品`:`${projects.length} 个项目 · ${categories.length} 个分类`}</span></header>{shown&&<nav className="category-tabs" aria-label={direction==='design'?'设计作品分类':'视频作品分类'}>{categories.map(name=><button key={name} aria-pressed={shown===name} onClick={()=>onCategory(name)}>{name}<span>{projects.filter(p=>p.categories[0]===name).length}</span></button>)}</nav>}<div className="catalog-toolbar">{shown?<><button onClick={()=>onCategory('')}>← 返回分类</button><p>点击作品，查看完整内容</p></>:<p>选择一个分类，开始浏览</p>}</div><div className={`catalog-view view-${phase}`} key={shown||'categories'}>{!shown?<Ring items={items} onSelect={onCategory} angle={angle} onPage={()=>{}} kind="categories" grid={compact}/>:entries.length?<div className="portfolio-grid" data-direction={direction} data-category={shown}>{entries.map(p=><button className="portfolio-card" key={p.id} data-project-id={p.id} onClick={()=>onOpen(p.id)}><span className="portfolio-cover" data-portrait={p.cover? p.cover.height>p.cover.width:false}>{p.cover&&<ArtworkImage src={p.cover.src} alt={p.cover.alt} width={p.cover.width} height={p.cover.height} style={p.direction==='design'?{objectPosition:(previewPositions as Record<string,string>)[p.id]||'50% 50%'}:undefined} loading="lazy" decoding="async"/>}{p.direction==='video'&&<span className="play-cue" aria-hidden="true">▶</span>}</span><span className="portfolio-caption"><strong>{p.title}</strong><small>{p.direction==='video'?`${formatDuration(p.duration)} · ${p.episodes?.[0]&&p.episodes[0].height>p.episodes[0].width?'竖屏':'横屏'}`:p.categories[0]}</small></span></button>)}</div>:<div className="empty-state">暂无作品</div>}</div></div></section>;
}

