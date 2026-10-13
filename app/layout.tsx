import {publicUrl} from '@/lib/public-url';
import type { Metadata } from 'next';
import './globals.css';
import { profile } from '@/content/profile';
import CustomCursor from '@/components/custom-cursor';

const siteName = profile.name ? `${profile.name} · 个人作品集` : '个人作品集';
export const metadata: Metadata = {
  title: { default: `${siteName} · 设计与 AI 视频`, template: `%s | ${siteName}` },
  description: `${profile.name || '个人作品集'}：视觉设计、AI 视频创作、职业经历与联系方式。`,
  icons: { icon: publicUrl('/logo.svg') },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body id="top"><a href="#main-content" className="skip-link">跳转到主要内容</a>{children}<CustomCursor/></body></html>;
}



