'use client';
import {useEffect,useRef,useState} from 'react';
import {flushSync} from 'react-dom';
import {designCategories,videoCategories,type Project,type Direction} from '@/lib/types';
import ProjectCard from './project-card';
export default function ProjectList({projects,direction}:{projects:Project[];direction:Direction}) {
 const [category,setCategory]=useState('全部'),[page,setPage]=useState(0),[grid,setGrid]=useState(false);
 const stage=useRef<HTMLDivElement>(null),angle=useRef(Math.PI/2),pause=useRef(false),hover=useRef(false),focus=useRef(false),selection=useRef(0),manual=useRef<number|null>(null);
 const key='browse-'+direction;
 const update=(fn:()=>void)=>{const doc=document as Document & {startViewTransition?:(fn:()=>void)=>{ready:Promise<void>}};if(doc.startViewTransition&&!matchMedia('(prefers-reduced-motion: reduce)').matches)doc.startViewTransition(()=>flushSync(fn)).ready.catch(()=>{});else fn();};
 useEffect(()=>{const saved=sessionStorage.getItem(key);if(saved){const s=JSON.parse(saved);setCategory(s.category);setPage(s.page);setGrid(s.grid);angle.current=s.angle;requestAnimationFrame(()=>window.scrollTo(0,s.scroll||0));}},[key]);
 const visible=projects.filter(p=>category==='全部'||category==='分类待确认'&&!p.categories.length||(p.categories as string[]).includes(category));
 const pages=Math.ceil(visible.length/8),items=visible.slice(page*8,page*8+8);
 const step=(delta:number)=>{if(items.length<=3){selection.current=(selection.current+(delta>0?-1:1)+items.length)%items.length;(stage.current?.querySelectorAll("a")[selection.current] as HTMLElement)?.focus();return;}manual.current=angle.current+delta;stage.current?.dispatchEvent(new Event("orbit-wake"));};
 const save=()=>sessionStorage.setItem(key,JSON.stringify({category,page,grid,angle:angle.current,scroll:window.scrollY}));
 useEffect(()=>{if(grid||!stage.current)return;const el=stage.current;hover.current=false;focus.current=el.contains(document.activeElement);pause.current=focus.current;let raf=0,last=0,speed=0,onscreen=true;const reduced=matchMedia('(prefers-reduced-motion: reduce)');const wake=()=>{if(!raf)raf=requestAnimationFrame(tick);};const observer=new IntersectionObserver(e=>{onscreen=e[0].isIntersecting;wake();});observer.observe(el);el.addEventListener("orbit-wake",wake);document.addEventListener("visibilitychange",wake);reduced.addEventListener("change",wake);
 const tick=(now:number)=>{raf=0;const dt=Math.min((now-last)/1000||0,.05);last=now;const running=onscreen&&!document.hidden&&!reduced.matches;const target=running&&!pause.current?.085:0;speed+=(target-speed)*Math.min(1,dt*6);
 if(manual.current!==null){if(!running){angle.current=manual.current;manual.current=null;}} if(manual.current!==null){const delta=manual.current-angle.current;angle.current+=delta*Math.min(1,dt*8);if(Math.abs(delta)<.002)manual.current=null;}else if(items.length>3)angle.current+=speed*dt;
 const radius=Math.min(el.clientWidth*.39,560);Array.from(el.children).forEach((node,i)=>{const card=node as HTMLElement;const t=items.length<=3?Math.PI/2+(i-(items.length-1)/2)*.55:angle.current+i*Math.PI*2/items.length;const depth=(Math.sin(t)+1)/2;card.style.transform=`translate(calc(-50% + ${Math.cos(t)*radius}px),calc(-50% + ${Math.sin(t)*125+Math.cos(t)*22}px)) scale(${.65+depth*.35})`;card.style.zIndex=String(Math.round(depth*100));card.style.opacity=String(.78+depth*.22);});el.dataset.angle=String(angle.current);if(running)raf=requestAnimationFrame(tick);};raf=requestAnimationFrame(tick);return()=>{cancelAnimationFrame(raf);observer.disconnect();el.removeEventListener("orbit-wake",wake);document.removeEventListener("visibilitychange",wake);reduced.removeEventListener("change",wake);};},[grid,items.length,category,page]);
 return <><div className="filters" role="group" aria-label="作品分类">{['全部',...(direction==='design'?designCategories:videoCategories),...(projects.some(p=>!p.categories.length)?['分类待确认']:[])].map(c=><button key={c} aria-pressed={c===category} onClick={()=>update(()=>{setCategory(c);setPage(0);})}>{c}</button>)}</div><div className="list-summary"><span>{category} / {visible.length} 件作品</span><button onClick={()=>update(()=>setGrid(!grid))}>{grid?'环形浏览':'网格浏览'}</button></div>{items.length?<><div className={grid?'project-grid':'orbit-stage'} ref={stage} onMouseOver={e=>{hover.current=!!(e.target as HTMLElement).closest(".project-card");pause.current=hover.current||focus.current;}} onMouseLeave={()=>{hover.current=false;pause.current=focus.current;}} onFocusCapture={()=>{focus.current=true;pause.current=true;}} onBlurCapture={e=>{if(!e.currentTarget.contains(e.relatedTarget)){focus.current=false;pause.current=hover.current;}}} onClickCapture={save}>{items.map(p=><div className={grid?'':'orbit-item'} key={p.id}><ProjectCard project={p}/></div>)}</div><div className="orbit-controls">{!grid&&<><button onClick={()=>step(Math.PI*2/items.length)}>← 上一件</button><button onClick={()=>step(-Math.PI*2/items.length)}>下一件 →</button></>}<button disabled={page===0} onClick={()=>update(()=>setPage(page-1))}>上一组</button><span>{page+1} / {pages}</span><button disabled={page+1>=pages} onClick={()=>update(()=>setPage(page+1))}>下一组</button></div></>:<div className="empty-state"><h2>「{category}」暂无作品</h2><p>保留分类入口，等待真实作品补充。</p></div>}</>;
}








