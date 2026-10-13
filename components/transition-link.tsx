'use client';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import type {ComponentProps} from 'react';
let active:{skipTransition:()=>void;ready:Promise<void>}|undefined;
export default function TransitionLink(props:ComponentProps<typeof Link>){const router=useRouter();return <Link {...props} onClick={e=>{props.onClick?.(e);if(e.defaultPrevented||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||matchMedia('(prefers-reduced-motion: reduce)').matches)return;const doc=document as Document&{startViewTransition?:(fn:()=>Promise<void>)=>{skipTransition:()=>void;ready:Promise<void>}};if(!doc.startViewTransition||new URL(String(props.href),location.href).pathname===location.pathname)return;e.preventDefault();active?.skipTransition();active=doc.startViewTransition(()=>new Promise<void>(resolve=>{const done=()=>{clearTimeout(timer);document.removeEventListener('portfolio-ready',done);resolve();};const timer=setTimeout(done,800);document.addEventListener('portfolio-ready',done);router.push(String(props.href));}));active.ready.catch(()=>{});}}/>;}



