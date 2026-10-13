import { profile } from '@/content/profile';
import { Arrow } from './icons';

export default function ResumeLink({ light = false }: { light?: boolean }) {
  return profile.resume
    ? <a className={`button ${light ? 'button-light' : 'button-outline'}`} href={profile.resume.src} download={profile.resume.filename}>下载简历 <Arrow/></a>
    : <button type="button" className="button button-pending" disabled aria-label="下载简历：文件待补充">下载简历 <span className="pending-chip">待补充</span></button>;
}
