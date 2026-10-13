'use client';
import {publicUrl} from '@/lib/public-url';
export default function Eyelids(){return <svg className="eyelids" viewBox="0 0 1920 1080" aria-hidden="true"><defs><clipPath id="eye-left"><ellipse cx="883" cy="417" rx="62" ry="64"/></clipPath><clipPath id="eye-right"><ellipse cx="1017" cy="415" rx="62" ry="64"/></clipPath></defs>{[{id:'eye-left',x:821,y:353},{id:'eye-right',x:955,y:351}].map(eye=><g key={eye.id} clipPath={`url(#${eye.id})`}>{['top','bottom'].map(side=><svg key={side} className={`lid-${side}`} x={eye.x} y={eye.y} width="124" height="128" viewBox="900 900 124 128" preserveAspectRatio="none"><image href={publicUrl('/images/brand-character.webp')} width="1920" height="1080" style={{filter:"brightness(1.08)"}}/></svg>)}<path className="lid-seam" d={`M ${eye.x+5} ${eye.y+68} Q ${eye.x+60} ${eye.y+83} ${eye.x+114} ${eye.y+68}`} fill="none" stroke="#9d88b1" strokeWidth="3" strokeLinecap="round"/></g>)}</svg>;}


