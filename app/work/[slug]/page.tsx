import {notFound} from 'next/navigation';
import LegacyRedirect from '@/components/legacy-redirect';
import {projects,getProject} from '@/content/projects';
export function generateStaticParams(){return projects.map(p=>({slug:p.id}));}
export default async function Work({params}:{params:Promise<{slug:string}>}){const p=getProject((await params).slug);if(!p)notFound();return <LegacyRedirect target={`/?${p.direction==='design'?'dc':'vc'}=${encodeURIComponent(p.categories[0])}&work=${p.id}#${p.direction}`}/>;}
