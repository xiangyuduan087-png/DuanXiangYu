'use client';
import {useEffect,useLayoutEffect,useRef,useState} from 'react';
import type {Project} from '@/lib/types';
import ProjectContent from './project-content';
type Gesture={last:number;sum:number;direction:number;used:boolean;boundary:boolean};
export default function WorkOverlay({project,sequence,onNavigate,onClose}:{project:Project|null;sequence:Project[];onNavigate:(id:string)=>void;onClose:()=>void}){
 const dialog=useRef<HTMLDialogElement>(null),body=useRef<HTMLDivElement>(null),closeButton=useRef<HTMLButtonElement>(null),returnFocus=useRef<HTMLElement|null>(null),saved=useRef({y:0,overflow:'',direct:false}),fullscreenAt=useRef(-1000),timers=useRef<ReturnType<typeof setTimeout>[]>([]),busy=useRef(false);
 const [shown,setShown]=useState<Project|null>(project),[phase,setPhase]=useState('idle'),[switching,setSwitching]=useState(false),[closing,setClosing]=useState(false);
 const gesture=useRef<Gesture>({last:0,sum:0,direction:0,used:false,boundary:false});
 const clear=()=>{timers.current.forEach(clearTimeout);timers.current=[];};
 useEffect(()=>{const handler=()=>{if(!document.fullscreenElement)fullscreenAt.current=performance.now();};document.addEventListener('fullscreenchange',handler);return()=>document.removeEventListener('fullscreenchange',handler);},[]);
 useEffect(()=>{
  clear();const el=dialog.current!;const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(project){
   setClosing(false);
   if(!el.open){saved.current={y:scrollY,overflow:document.body.style.overflow,direct:!history.state?.portfolioWork};returnFocus.current=document.activeElement as HTMLElement;setShown(project);setPhase('enter');setSwitching(false);busy.current=false;el.showModal();document.body.style.overflow='hidden';document.dispatchEvent(new Event('portfolio-overlay'));requestAnimationFrame(()=>{body.current?.scrollTo({top:0,behavior:'instant'});closeButton.current?.focus();});}
   else if(shown?.id!==project.id){el.querySelectorAll('video').forEach(v=>v.pause());busy.current=true;setSwitching(true);setPhase('exit');timers.current.push(setTimeout(()=>{setShown(project);setPhase('enter');requestAnimationFrame(()=>body.current?.scrollTo({top:0,behavior:'instant'}));timers.current.push(setTimeout(()=>{busy.current=false;setSwitching(false);setPhase('idle');},reduced?0:160));},reduced?0:160));}
   else {busy.current=false;setSwitching(false);setPhase('idle');}
  }else if(el.open){
   busy.current=true;setClosing(true);el.querySelectorAll('video').forEach(v=>v.pause());
   const finish=()=>{const direction=el.dataset.direction;el.close();document.body.style.overflow=saved.current.overflow;setShown(null);setClosing(false);setSwitching(false);busy.current=false;if(location.hash.slice(1)===direction){if(saved.current.direct){const card=document.querySelector<HTMLElement>(`.portfolio-card[data-project-id="${shown?.id}"]`),section=document.getElementById(direction||'');if(card){card.scrollIntoView({block:'center',behavior:'instant'});card.focus({preventScroll:true});}else if(section)window.scrollTo({top:section.getBoundingClientRect().top+scrollY-64,behavior:'instant'});}else{window.scrollTo({top:saved.current.y,behavior:'instant'});if(returnFocus.current?.isConnected)returnFocus.current.focus({preventScroll:true});}}document.dispatchEvent(new Event('portfolio-overlay'));};
   if(reduced)finish();else timers.current.push(setTimeout(finish,240));
  }
  return clear;
 // shown is intentionally retained while the outgoing project fades; the URL drives cancellation.
 // eslint-disable-next-line react-hooks/exhaustive-deps
 },[project]);
 useEffect(()=>()=>{clear();if(dialog.current?.open){dialog.current.close();document.body.style.overflow=saved.current.overflow;}},[]);
 const remembered=useRef(sequence);if(sequence.length)remembered.current=sequence;
 const ordered=sequence.length?sequence:remembered.current;
 const index=shown?ordered.findIndex(p=>p.id===shown.id):-1;
 const lead=shown?.direction==='design'?shown.detail.images[0]:shown?.episodes?.[0];
 useLayoutEffect(()=>{const el=dialog.current;if(!el||shown?.categories[0]!=='字体'||!lead)return;const size=()=>{const narrow=innerWidth<=700,padding=narrow?24:40,width=Math.min(1180,document.documentElement.clientWidth-(narrow?16:48)),chrome=(el.querySelector('.detail-header')?.clientHeight||74)+(el.querySelector('.detail-navigation')?.clientHeight||56),height=(width-padding)*lead.height/lead.width+chrome+padding+28;el.style.setProperty('--font-dialog-height',`${Math.min(innerHeight-(narrow?16:40),Math.ceil(height))}px`);};size();addEventListener('resize',size);return()=>removeEventListener('resize',size);},[shown,lead]);
 const format=lead&&lead.height>lead.width*2.2?'long':lead&&lead.height>lead.width*1.2?'portrait':'landscape';
 useEffect(()=>{const el=body.current;if(!el)return;const observer=new ResizeObserver(()=>el.style.setProperty('--detail-room',`${el.clientHeight}px`));observer.observe(el);return()=>observer.disconnect();},[shown?.id]);
 useEffect(()=>{if(index<0)return;for(const offset of [-1,1]){const neighbor=ordered[index+offset];if(neighbor){const image=new Image();image.src=neighbor.direction==='design'?neighbor.detail.images[0]?.src||neighbor.cover?.src||'':neighbor.episodes?.[0]?.poster||neighbor.cover?.src||'';}}},[index,ordered]);
 const move=(delta:number)=>{if(busy.current||closing)return;const next=ordered[index+delta];if(!next)return;busy.current=true;setSwitching(true);dialog.current?.querySelectorAll('video').forEach(v=>v.pause());onNavigate(next.id);};
 useEffect(()=>{
  const el=dialog.current!;
  const blocked=(target:EventTarget|null)=>document.querySelector('.lightbox[open]')||document.fullscreenElement||(target instanceof Element&&target.closest('video,input,textarea,select,[contenteditable="true"],.script-text'));
  const key=(event:KeyboardEvent)=>{if(!el.open||blocked(event.target)||event.altKey||event.ctrlKey||event.metaKey)return;if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();move(event.key==='ArrowLeft'?-1:1);}};
  const wheel=(event:WheelEvent)=>{
   if(!el.open||blocked(event.target)||event.ctrlKey||!body.current)return;
   const now=performance.now(),direction=Math.sign(event.deltaY);if(!direction)return;
   const container=body.current,atBoundary=direction>0?container.scrollTop+container.clientHeight>=container.scrollHeight-3:container.scrollTop<=2;
   const state=gesture.current,fresh=now-state.last>280;if(fresh){state.sum=0;state.direction=direction;state.used=false;state.boundary=atBoundary;}state.last=now;
   if(busy.current||state.used)return;
   if(event.target instanceof Element){let ancestor:Element|null=event.target;while(ancestor&&ancestor!==container&&ancestor!==el){if(ancestor instanceof HTMLElement&&ancestor.scrollHeight>ancestor.clientHeight+3&&/(auto|scroll)/.test(getComputedStyle(ancestor).overflowY)){const canScroll=direction>0?ancestor.scrollTop+ancestor.clientHeight<ancestor.scrollHeight-3:ancestor.scrollTop>2;if(canScroll){state.boundary=false;return;}}ancestor=ancestor.parentElement;}}
   if(!atBoundary){state.boundary=false;return;}
   if(!state.boundary||state.direction!==direction)return;
   event.preventDefault();state.sum+=Math.abs(event.deltaY)*(event.deltaMode===1?16:event.deltaMode===2?container.clientHeight:1);
   if(state.sum>=110){state.used=true;move(direction);}
  };
  document.addEventListener('keydown',key);el.addEventListener('wheel',wheel,{passive:false});return()=>{document.removeEventListener('keydown',key);el.removeEventListener('wheel',wheel);};
 // Navigation reads the currently displayed project; repeated wheel events remain the same gesture.
 // eslint-disable-next-line react-hooks/exhaustive-deps
 },[index,ordered,onNavigate,closing]);
 return <dialog ref={dialog} className={`work-overlay ${closing?'overlay-closing':''}`} data-direction={shown?.direction} data-category={shown?.categories[0]} data-format={format} aria-label={shown?.title||'作品详情'} onClick={event=>{if(event.target!==event.currentTarget)return;const r=event.currentTarget.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)onClose();}} onCancel={event=>{if(event.target!==event.currentTarget)return;event.preventDefault();if(document.fullscreenElement){void document.exitFullscreen().catch(()=>{});return;}if(performance.now()-fullscreenAt.current>250&&!closing)onClose();}}>{shown&&<><header className="detail-header"><div className="detail-heading"><small>{shown.categories[0]} / 作品详情</small><h2>{shown.title}</h2></div><button ref={closeButton} className="detail-close" onClick={onClose} aria-label="关闭作品详情">关闭 ×</button></header><nav className="detail-navigation" aria-label="当前分类作品切换"><button disabled={index<=0||switching||closing} onClick={()=>move(-1)}>← 上一件</button><span aria-live="polite">{index+1} / {ordered.length}</span><button disabled={index+1>=ordered.length||switching||closing} onClick={()=>move(1)}>下一件 →</button></nav><div ref={body} className={`detail-scroll detail-${phase}`}><ProjectContent key={shown.id} project={shown}/></div></>}</dialog>;
}


