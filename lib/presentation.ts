import type {Project} from './types';

// IP images are presentation entries, not additional projects in the content data.
export function presentationEntries(projects:Project[]):Project[]{
 return projects.flatMap(project=>project.direction==='design'&&project.categories[0]==='IP'
  ?project.detail.images.map((image,index)=>({...project,id:`${project.id}~${index}`,title:`${project.title} · 图 ${String(index+1).padStart(2,'0')}`,cover:image,detail:{...project.detail,images:[{...image,alt:`${project.title} · 图 ${String(index+1).padStart(2,'0')}`,caption:`${project.title} · 图 ${String(index+1).padStart(2,'0')}`}]}}))
  :[project]);
}
