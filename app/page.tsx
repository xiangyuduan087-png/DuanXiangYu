import type {Metadata} from 'next';
import type {Project} from '@/lib/types';
import {projects} from '@/content/projects';
import SinglePortfolio from '@/components/single-portfolio';
export const metadata:Metadata={title:'段翔宇的个人作品集'};
export default function Home(){const visibleProjects=projects.map(p=>{const copy={...p} as Project&{titleSources?:unknown};delete copy.titleSources;return copy;});return <SinglePortfolio projects={visibleProjects}/>;}
