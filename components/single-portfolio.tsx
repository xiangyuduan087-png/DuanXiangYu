'use client';
import {useCallback,useEffect,useMemo,useRef,useState} from 'react';
import type {Project} from '@/lib/types';
import {presentationEntries} from '@/lib/presentation';
import {profile} from '@/content/profile';
import FooterBackground from '@/app/footer-background';
import Eyelids from './eyelids';
import Contacts from './contacts';
import Catalog from './catalog';
import WorkOverlay from './work-overlay';
import SiteHeader from './site-header';
import AboutProfile from './about-profile';
const entrances=[{label:'设计作品',id:'design'},{label:'视频作品',id:'video'},{label:'关于我',id:'about'},{label:'联系我',id:'contact'}];
export default function SinglePortfolio({projects}:{projects:Project[]}){
 const [query,setQuery]=useState<Record<string,string>>({}),[ready,setReady]=useState(false);
 const frame=useRef(0),pendingSection=useRef<string|null>(null);
 const sync=useCallback(()=>setQuery(Object.fromEntries(new URLSearchParams(location.search))),[]);
 const finish=useCallback(()=>{setReady(true);sessionStorage.setItem('duan-opening','seen');},[]);
 useEffect(()=>{sync();const preference=matchMedia('(prefers-reduced-motion: reduce)');if(preference.matches||sessionStorage.getItem('duan-opening'))finish();const timer=setTimeout(finish,4550);const change=()=>{if(preference.matches)finish();};preference.addEventListener('change',change);return()=>{clearTimeout(timer);preference.removeEventListener('change',change);};},[sync,finish]);
 const scroll=useCallback((id:string,push=true)=>{
  if(!['home','design','video','about','contact'].includes(id))return;
  cancelAnimationFrame(frame.current);
  document.dispatchEvent(new CustomEvent('portfolio-navigation',{detail:id}));
  if(push){const url=new URL(location.href);url.hash=id;url.searchParams.delete('work');url.searchParams.delete('image');history.pushState({...history.state,portfolioWork:false},'',url);sync();}
  const start=performance.now(),from=scrollY;
  const tick=(now:number)=>{const el=document.getElementById(id);if(!el){frame.current=0;return;}const target=Math.max(0,el.getBoundingClientRect().top+scrollY-(id==='home'?0:64)),t=matchMedia('(prefers-reduced-motion: reduce)').matches?1:Math.min(1,(now-start)/520),ease=t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;window.scrollTo({top:from+(target-from)*ease,behavior:'instant'});frame.current=t<1?requestAnimationFrame(tick):0;};
  frame.current=requestAnimationFrame(tick);
 },[sync]);
 useEffect(()=>{
  const previousRestoration=history.scrollRestoration;history.scrollRestoration='manual';
  const pop=()=>{sync();if(new URLSearchParams(location.search).has('work'))return;const id=location.hash.slice(1)||'home',modal=document.querySelector<HTMLDialogElement>('.work-overlay[open]');if(modal){if(id!==modal.dataset.direction)pendingSection.current=id;}else{const expected=new URLSearchParams(location.search).get(id==='design'?'dc':'vc')||'';if((id==='design'||id==='video')&&document.getElementById(id)?.dataset.category!==expected){cancelAnimationFrame(frame.current);frame.current=0;return;}scroll(id,false);}};
  const closed=()=>{if(pendingSection.current&&!document.querySelector('.work-overlay[open]')){scroll(pendingSection.current,false);pendingSection.current=null;}};
  const interrupt=()=>{cancelAnimationFrame(frame.current);frame.current=0;};
  addEventListener('popstate',pop);addEventListener('hashchange',pop);addEventListener('wheel',interrupt,{passive:true});document.addEventListener('portfolio-overlay',closed);
  const initial=location.hash.slice(1),timer=setTimeout(()=>{if(initial&&location.hash.slice(1)===initial&&!frame.current)scroll(initial,false);},80);
  return()=>{clearTimeout(timer);cancelAnimationFrame(frame.current);history.scrollRestoration=previousRestoration;removeEventListener('popstate',pop);removeEventListener('hashchange',pop);removeEventListener('wheel',interrupt);document.removeEventListener('portfolio-overlay',closed);};
 },[scroll,sync]);
 const category=useCallback((direction:string,name:string)=>{const url=new URL(location.href),prefix=direction==='design'?'d':'v';for(const key of [prefix+'c',prefix+'p',prefix+'g','work','image'])url.searchParams.delete(key);if(name)url.searchParams.set(prefix+'c',name);url.hash=direction;history.pushState({...history.state,portfolioWork:false},'',url);sync();},[sync]);
 const open=useCallback((id:string)=>{const url=new URL(location.href);const [projectId,image]=id.split('~');url.searchParams.set('work',projectId);if(image!==undefined)url.searchParams.set('image',image);else url.searchParams.delete('image');history.pushState({...history.state,portfolioWork:true},'',url);sync();},[sync]);
 const navigate=useCallback((id:string)=>{const url=new URL(location.href);const [projectId,image]=id.split('~');url.searchParams.set('work',projectId);if(image!==undefined)url.searchParams.set('image',image);else url.searchParams.delete('image');history.replaceState(history.state,'',url);sync();},[sync]);
 const close=useCallback(()=>{if(history.state?.portfolioWork)history.back();else{const url=new URL(location.href);url.searchParams.delete('work');url.searchParams.delete('image');history.replaceState(history.state,'',url);sync();}},[sync]);
 const entries=useMemo(()=>presentationEntries(projects),[projects]);
 const current=entries.find(p=>p.id===(query.image!==undefined?`${query.work}~${query.image}`:query.work))||entries.find(p=>p.id===`${query.work}~0`)||null;
 const sequence=useMemo(()=>current?entries.filter(p=>p.direction===current.direction&&p.categories[0]===current.categories[0]).sort((a,b)=>a.order-b.order):[],[current,entries]);
 return <div className={`single-site local-refresh ${ready?'opening-complete':'opening-active'}`}><SiteHeader onNavigate={scroll}/><main id="main-content"><section id="home" className="character-hero page-zone"><div className="character-world"><div className="opening-character"><FooterBackground enabled={ready}/>{!ready&&<Eyelids/>}</div><nav className="body-navigation" aria-label="首页导航">{entrances.map(entry=><button key={entry.id} className={`entrance nav-${entry.id}`} onClick={()=>scroll(entry.id)}>{entry.label}<span aria-hidden="true">→</span></button>)}</nav></div>{!ready&&<button className="skip-opening" onClick={finish}>跳过开屏 →</button>}</section><Catalog direction="design" projects={projects.filter(p=>p.direction==='design')} category={query.dc||''} onCategory={name=>category('design',name)} onOpen={open}/><Catalog direction="video" projects={projects.filter(p=>p.direction==='video')} category={query.vc||''} onCategory={name=>category('video',name)} onOpen={open}/><AboutProfile/><section id="contact" className="page-zone single-contact"><div><p className="eyebrow">CONTACT / 联系我</p><h2>聊聊工作，<br/>也聊聊创意。</h2><p>作品交流与招聘沟通，从这里开始。</p></div><Contacts email={profile.email} wechat={profile.wechat} socials={profile.socials}/></section></main><footer className="single-footer"><span>段翔宇 · DESIGN & MOTION</span><button onClick={()=>scroll('home')}>回到首页 ↑</button></footer><WorkOverlay project={current} sequence={sequence} onNavigate={navigate} onClose={close}/></div>;
}

