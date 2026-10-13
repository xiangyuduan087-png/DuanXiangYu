'use client';
import {useEffect} from 'react';
import {publicUrl} from '@/lib/public-url';
export default function LegacyRedirect({target}:{target:string}){
 useEffect(()=>{location.replace(publicUrl(target));},[target]);
 return <p>正在打开作品集…</p>;
}
