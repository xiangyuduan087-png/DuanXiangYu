import Link from './transition-link';
import type { Project } from '@/lib/types';
import { Arrow, Play } from './icons';

export default function ProjectCard({ project, wide = false }: { project: Project; wide?: boolean }) {
  return <article className={`project-card ${wide ? 'project-wide' : ''}`} data-project-id={project.id}>
    <Link href={`/work/${project.id}`} className="project-link" aria-label={`查看${project.title}`}>
      <div style={{viewTransitionName:`cover-${project.id}`}} className={`project-cover ${project.direction === 'video' ? 'video-cover' : ''} cover-${project.id}`}>
        {project.cover ? <img src={project.cover.thumbnail || project.cover.src} alt={project.cover.alt} width={project.cover.width} height={project.cover.height} loading="lazy" decoding="async"/> : <div className="missing-cover"><Play/><span>封面与视频待补充</span></div>}
        {project.isPlaceholder && <span className="sample-badge">{project.placeholderLabel || '布局示例 · 非个人作品'}</span>}
        {project.direction === 'video' && project.video && <span className="play-badge" aria-hidden="true"><Play/></span>}
        {project.direction === 'video' && <span className="duration">{project.duration || '时长待补充'}</span>}
      </div>
      <div className="project-caption"><div className="project-categories">{project.categories.join(' / ') || '分类待确认'}</div><div className="card-title"><h3>{project.title}</h3><Arrow diagonal/></div><p>{project.summary}</p><span className="responsibility">我的职责：{project.responsibility || '待补充'}</span></div>
    </Link>
  </article>;
}



