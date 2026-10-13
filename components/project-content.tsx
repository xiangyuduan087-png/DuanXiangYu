import type {Project} from '@/lib/types';
import Gallery from './gallery';
import VideoShowcase from './video-showcase';
export default function ProjectContent({project,inline=false}:{project:Project;inline?:boolean}){return <div className={inline?'inline-project-content':'overlay-content'}><header><p className="eyebrow">{project.direction==='design'?'DESIGN':'MOTION'} / PROJECT</p><h2>{project.title}{project.titleTemporary&&<small>暂定名</small>}</h2>{project.direction==='video'&&project.summary&&<p>{project.summary}</p>}</header>{project.direction==='design'?<Gallery images={project.detail.images}/>:<VideoShowcase project={project}/>}</div>;}
