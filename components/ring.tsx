'use client';
import {useEffect,useRef} from 'react';
export type RingItem={id:string;title:string;subtitle:string;cover?:string;alt?:string;aspect?:number;category?:string};
export default function Ring({items,onSelect,angle,grid=false,kind="categories",onPage,page=0,pages=1}:{items:RingItem[];onSelect:(id:string)=>void;angle:{current:number};grid?:boolean;kind?:"categories"|"works";onPage:(n:number)=>void;page?:number;pages?:number}){
 const stage=useRef<HTMLDivElement>(null),paused=useRef(false),hover=useRef(false),target=useRef<number|null>(null),selected=useRef(0);
 useEffect(()=>{if(grid||!stage.current)return;const el=stage.current;hover.current=false;paused.current=!!el.querySelector(".ring-card:focus-visible");let raf=0,last=0,speed=0,visible=false;const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const paint=(now:number)=>{raf=0;const dt=Math.min((now-last)/1000||0,.045);last=now;const running=visible&&!document.hidden&&!reduced.matches&&!document.querySelector(".work-overlay[open]");speed+=((running&&!paused.current?.075:0)-speed)*Math.min(1,dt*7);
 if(target.current!==null){if(!running){angle.current=target.current;target.current=null;}else{const d=target.current-angle.current;angle.current+=d*Math.min(1,dt*9);if(Math.abs(d)<.002)target.current=null;}}else if(items.length>1&&running)angle.current+=speed*dt;
 const cards=Array.from(el.querySelectorAll<HTMLElement>('.orbit-item'));
 const {width,height}=el.getBoundingClientRect();const cardWidth=cards[0]?.offsetWidth||200,cardHeight=Math.max(...cards.map(card=>card.offsetHeight),0)||200;
 const rx=Math.max(0,Math.min(width/2-cardWidth/2-24,520));
 const safeY=Math.max(0,(height-cardHeight)/2-16);const tilt=-Math.min(Math.PI/36,Math.asin(Math.min(.5,safeY*.35/Math.max(rx,1))));
 const ry=Math.min(height*.25,Math.sqrt(Math.max(0,safeY*safeY-(rx*Math.sin(tilt))**2))/Math.cos(tilt));
 const point=(t:number)=>({x:Math.cos(t)*rx*Math.cos(tilt)-Math.sin(t)*ry*Math.sin(tilt),y:Math.cos(t)*rx*Math.sin(tilt)+Math.sin(t)*ry*Math.cos(tilt)});
 const geometry=JSON.stringify({width,height,rx,ry,tilt});
 if(el.dataset.geometry!==geometry){
 const path=el.querySelector('path');
 el.querySelector('svg')?.setAttribute('viewBox',`0 0 ${width} ${height}`);
 path?.setAttribute('d',Array.from({length:181},(_,i)=>{const p=point(i*Math.PI*2/180);return `${i?'L':'M'}${width/2+p.x},${height/2+p.y}`;}).join(' ')+' Z');
 el.dataset.geometry=geometry;
 }
 cards.forEach((card,i)=>{const t=items.length<=3?Math.PI/2+(i-(items.length-1)/2)*.7+(items.length>1?.12*Math.sin(angle.current-Math.PI/2):0):angle.current+i*Math.PI*2/items.length;const depth=(Math.sin(t)+1)/2;const p=point(t);card.style.transform=`translate(calc(-50% + ${p.x}px),calc(-50% + ${p.y}px)) scale(${.84+depth*.16})`;card.dataset.phase=String(t);card.style.zIndex=card.matches(":hover")||card.querySelector(":focus-visible")?"1000":String(Math.round(depth*100));card.style.opacity=String(.94+depth*.06);});el.dataset.angle=String(angle.current);if(running&&items.length>1)raf=requestAnimationFrame(paint);};
 const wake=()=>{if(!raf)raf=requestAnimationFrame(paint);};const resizeObserver=new ResizeObserver(wake);resizeObserver.observe(el);const observer=new IntersectionObserver(e=>{visible=e[0].isIntersecting;wake();},{threshold:.12});observer.observe(el);el.addEventListener('ring-wake',wake);window.addEventListener('resize',wake);document.addEventListener('portfolio-overlay',wake);document.addEventListener('visibilitychange',wake);reduced.addEventListener('change',wake);wake();return()=>{resizeObserver.disconnect();observer.disconnect();cancelAnimationFrame(raf);el.removeEventListener('ring-wake',wake);window.removeEventListener('resize',wake);document.removeEventListener('portfolio-overlay',wake);document.removeEventListener('visibilitychange',wake);reduced.removeEventListener('change',wake);};
 },[items,angle,grid]);
 const step=(delta:number)=>{if(items.length<=3){selected.current=(selected.current+delta+items.length)%items.length;(stage.current?.querySelectorAll('button')[selected.current] as HTMLElement)?.focus();}else{target.current=angle.current-delta*Math.PI*2/items.length;stage.current?.dispatchEvent(new Event('ring-wake'));}};
 return <div className="single-ring" data-kind={kind}><div ref={stage} data-density={items.length>5?'dense':'normal'} className={grid?'ring-grid':'orbit-stage'} onMouseOver={e=>{hover.current=!!(e.target as HTMLElement).closest('.ring-card');paused.current=hover.current||!!stage.current?.querySelector('.ring-card:focus-visible');}} onMouseLeave={()=>{hover.current=false;paused.current=!!stage.current?.querySelector('.ring-card:focus-visible');}} onFocusCapture={()=>paused.current=hover.current||!!stage.current?.querySelector('.ring-card:focus-visible')} onBlurCapture={e=>{if(!e.currentTarget.contains(e.relatedTarget))paused.current=hover.current;}}>{!grid&&items.length>3&&<svg className="orbit-track" aria-hidden="true"><path fill="none"/></svg>}{items.map(item=><div key={item.id} data-format={item.category==='字体'?'type':item.aspect&&item.aspect<.85?'portrait':'landscape'} className={grid?'':'orbit-item'}><button className="ring-card" onClick={()=>onSelect(item.id)} aria-label={item.title}><span className="ring-cover" style={{aspectRatio:item.category==='字体'||item.aspect&&item.aspect>=.85?item.aspect:undefined,...(item.aspect&&item.aspect<.85?{backgroundImage:`linear-gradient(#eee8f0b8,#eee8f0b8),url("${item.cover}")`}:{})}}>{item.cover&&<img src={item.cover} alt={item.alt||item.title} loading="lazy"/>}</span><span className="ring-caption"><strong>{item.title}</strong><small>{item.subtitle}</small></span></button></div>)}</div><div className="orbit-controls">{!grid&&<><button onClick={()=>step(-1)} disabled={!items.length}>← {kind==="categories"?"上一分类":"上一件"}</button><button onClick={()=>step(1)} disabled={!items.length}>{kind==="categories"?"下一分类":"下一件"} →</button></>}{pages>1&&<><button disabled={page===0} onClick={()=>onPage(page-1)}>上一组</button><span>{page+1} / {pages}</span><button disabled={page+1>=pages} onClick={()=>onPage(page+1)}>下一组</button></>}</div></div>;
}





