'use client';
import {useEffect} from 'react';
import {useRouter} from 'next/navigation';
export default function LegacyAbout(){const router=useRouter();useEffect(()=>{router.replace('/'+(location.hash==='#contact'?'#contact':'#about'));},[router]);return <p>正在打开个人简介与联系方式…</p>;}
