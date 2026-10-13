import Link from 'next/link';
import FooterBackground from '@/app/footer-background';
import { profile } from '@/content/profile';
import BrandLogo from '@/app/brand-logo';
import { Arrow } from './icons';

export default function SiteFooter() {
  return <footer className="site-footer" aria-label="品牌页脚"><div className="shell"><div className="footer-main"><div className="footer-invitation"><p className="eyebrow">LET’S CONNECT / 联系</p><h2>下一个想法，<br/>从这里开始。</h2><Link href="/about#contact" className="button button-dark">联系我 <Arrow diagonal/></Link><p className="footer-pending">{profile.email || profile.wechat || profile.socials.length ? '联系方式已更新，欢迎进一步沟通。' : '邮箱与微信待补充 · 联系信息将在简历页更新'}</p></div><div className="footer-character"><FooterBackground/><span>品牌角色 <span aria-hidden="true">/</span> A LITTLE IMAGINATION</span></div></div><div className="footer-bottom"><Link href="/" className="footer-brand"><BrandLogo/>{profile.name || '个人作品集'}</Link><span>DESIGN & AI FILM</span><Link href="/about">简历与联系方式 <Arrow diagonal/></Link><a href="#top">回到顶部 ↑</a></div></div></footer>;
}
