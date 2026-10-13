import hidden from '@/content/hidden-projects.json';
import {notFound} from 'next/navigation';
import LegacyRedirect from '@/components/legacy-redirect';
import {projects,getProject} from '@/content/projects';
export function generateStaticParams(){return [...projects.map(p=>({slug:p.id})),...hidden.projectIds.map(slug=>({slug}))];}
export default async function Work({params}:{params:Promise<{slug:string}>}){const slug=(await params).slug;if(hidden.projectIds.includes(slug))return <LegacyRedirect target={`/?work=${slug}#video`}/>;const p=getProject(slug);if(!p)notFound();return <LegacyRedirect target={`/?${p.direction==='design'?'dc':'vc'}=${encodeURIComponent(p.categories[0])}&work=${p.id}#${p.direction}`}/>;}
