'use client';
import {useEffect} from 'react';

export default function CustomCursor(){
 useEffect(()=>{
  const fine=matchMedia('(hover: hover) and (pointer: fine)'),reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const layer=document.createElement('div');layer.className='custom-cursor-layer';layer.setAttribute('aria-hidden','true');layer.setAttribute('popover','manual');
  const dot=document.createElement('div'),ring=document.createElement('div');dot.className='custom-cursor-dot';ring.className='custom-cursor-ring';dot.append(document.createElement('span'));ring.append(document.createElement('span'));layer.append(dot,ring);document.body.append(layer);
  const native='video,audio,iframe,input,textarea,select,[contenteditable="true"],[role="slider"],[draggable="true"],[data-system-cursor]';
  const interactive='a[href],button:not(:disabled),[role="button"],summary,.portfolio-card,.ring-card,.image-button';
  let x=0,y=0,rx=0,ry=0,inside=false,visible=false,dragging=false,frame=0,last=0,clickTimer=0,topDialog:Element|null=null;
  const position=()=>{dot.style.transform=`translate3d(${x}px,${y}px,0)`;ring.style.transform=`translate3d(${rx}px,${ry}px,0)`;};
  const hide=()=>{visible=false;layer.dataset.visible='false';document.documentElement.classList.remove('custom-cursor-active');cancelAnimationFrame(frame);frame=0;last=0;};
  const top=()=>{
   const dialogs=Array.from(document.querySelectorAll('dialog[open]')),current=dialogs.at(-1)||null;
   if(typeof layer.showPopover==='function'){
    try{if(current!==topDialog||!layer.matches(':popover-open')){if(layer.matches(':popover-open'))layer.hidePopover();layer.showPopover();}topDialog=current;return;}catch{/* Older engines retain a normal system cursor until the fallback is ready. */}
   }
   layer.removeAttribute('popover');const parent=current||document.body;if(layer.parentElement!==parent)parent.append(layer);topDialog=current;
  };
  const tick=(now:number)=>{frame=0;if(!visible)return;const dt=Math.min((now-last)/1000||1/60,.05);last=now;const ease=reduced.matches?1:1-Math.exp(-dt/.085);rx+=(x-rx)*ease;ry+=(y-ry)*ease;if(Math.hypot(x-rx,y-ry)<.08){rx=x;ry=y;}position();if(rx!==x||ry!==y)frame=requestAnimationFrame(tick);else last=0;};
  const wake=()=>{if(!frame)frame=requestAnimationFrame(tick);};
  const sync=()=>{
   if(!fine.matches||!inside||dragging||document.hidden||document.fullscreenElement||document.pointerLockElement){hide();return;}
   const target=document.elementFromPoint(x,y);if(!target||target.closest(native)){hide();return;}
   top();layer.dataset.reduced=String(reduced.matches);layer.dataset.hover=String(!!target.closest(interactive));layer.dataset.artwork=String(!!target.closest('.portfolio-cover,.image-button,.viewer-canvas,[data-cursor-artwork]'));
   if(!visible){rx=x;ry=y;position();layer.dataset.visible='true';visible=true;}
   // System arrows are hidden only after the mounted visual layer has a valid position.
   document.documentElement.classList.add('custom-cursor-active');
   if(reduced.matches){rx=x;ry=y;position();cancelAnimationFrame(frame);frame=0;}else wake();
  };
  const move=(event:PointerEvent)=>{if(event.pointerType!=='mouse'){inside=false;hide();return;}inside=true;x=event.clientX;y=event.clientY;dot.style.transform=`translate3d(${x}px,${y}px,0)`;sync();};
  const leave=(event:PointerEvent)=>{if(event.relatedTarget===null){inside=false;hide();}};
  const click=(event:PointerEvent)=>{if(!visible)move(event);if(event.button!==0||!visible||reduced.matches)return;window.clearTimeout(clickTimer);layer.dataset.pressed='true';clickTimer=window.setTimeout(()=>{layer.dataset.pressed='false';},135);};
  const drag=()=>{dragging=true;hide();},endDrag=(event:DragEvent)=>{dragging=false;x=event.clientX;y=event.clientY;inside=x>=0&&y>=0&&x<innerWidth&&y<innerHeight;sync();},blur=()=>{inside=false;hide();};
  const resume=()=>{const saved=(window as Window & {__portfolioPointer?:{x:number;y:number;inside:boolean;seen:boolean}}).__portfolioPointer;if(saved?.seen&&saved.inside){x=saved.x;y=saved.y;inside=true;}sync();};
  const mouseMove=(event:MouseEvent)=>{if(!fine.matches)return;inside=true;x=event.clientX;y=event.clientY;dot.style.transform=`translate3d(${x}px,${y}px,0)`;sync();};
  const observer=new MutationObserver(sync);observer.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['open','data-system-cursor']});
  document.addEventListener('mousemove',mouseMove,{passive:true});window.addEventListener('pageshow',resume);window.addEventListener('focus',resume);resume();
  document.addEventListener('pointermove',move,{passive:true});document.addEventListener('pointerover',move,{passive:true});document.addEventListener('pointerout',leave,{passive:true});document.addEventListener('pointerdown',click,{passive:true});document.addEventListener('dragstart',drag);document.addEventListener('dragend',endDrag);document.addEventListener('scroll',sync,{passive:true,capture:true});document.addEventListener('fullscreenchange',sync);document.addEventListener('pointerlockchange',sync);document.addEventListener('visibilitychange',sync);window.addEventListener('blur',blur);window.addEventListener('resize',sync);fine.addEventListener('change',sync);reduced.addEventListener('change',sync);
  return()=>{document.removeEventListener('mousemove',mouseMove);window.removeEventListener('pageshow',resume);window.removeEventListener('focus',resume);hide();window.clearTimeout(clickTimer);observer.disconnect();document.removeEventListener('pointermove',move);document.removeEventListener('pointerover',move);document.removeEventListener('pointerout',leave);document.removeEventListener('pointerdown',click);document.removeEventListener('dragstart',drag);document.removeEventListener('dragend',endDrag);document.removeEventListener('scroll',sync,true);document.removeEventListener('fullscreenchange',sync);document.removeEventListener('pointerlockchange',sync);document.removeEventListener('visibilitychange',sync);window.removeEventListener('blur',blur);window.removeEventListener('resize',sync);fine.removeEventListener('change',sync);reduced.removeEventListener('change',sync);layer.remove();};
 },[]);
 return null;
}

