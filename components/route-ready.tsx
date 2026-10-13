'use client';
import {useEffect} from 'react';
import {usePathname} from 'next/navigation';
export default function RouteReady(){const path=usePathname();useEffect(()=>{document.dispatchEvent(new Event('portfolio-ready'));},[path]);return null;}
