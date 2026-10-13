'use client';
import {useEffect} from 'react';
import {publicUrl} from '@/lib/public-url';
export default function LegacyAbout(){useEffect(()=>{location.replace(publicUrl('/'+(location.hash==='#contact'?'#contact':'#about')));},[]);return <p>正在打开个人简介与联系方式…</p>;}
