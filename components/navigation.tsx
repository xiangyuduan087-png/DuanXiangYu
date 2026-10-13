'use client';

import Link from './transition-link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import BrandLogo from '@/app/brand-logo';
import { profile } from '@/content/profile';

const links = [
  { label: '首页', href: '/' }, { label: '设计作品', href: '/design' },
  { label: '视频作品', href: '/video' }, { label: '关于我', href: '/about' },
  { label: '联系我', href: '/about#contact' },
];
export default function Navigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  return <header className="site-header"><div className="shell header-inner">
    <Link href="/" className="brand" aria-label="个人作品集首页" onClick={() => setOpen(false)}><BrandLogo/><span>{profile.name || '个人作品集'}<small>DESIGN & AI FILM</small></span></Link>
    <button className="menu-toggle" aria-expanded={open} aria-controls="main-navigation" onClick={() => setOpen(!open)}>{open ? '关闭' : '菜单'}<span aria-hidden="true">{open ? '×' : '+'}</span></button>
    <nav id="main-navigation" aria-label="主导航" className={`main-navigation ${pathname === "/" ? "home-simple" : ""} ${open ? 'is-open' : ''}`}>
      {links.map(link => <Link key={link.href} href={link.href} onClick={() => setOpen(false)} aria-current={link.href === pathname ? 'page' : undefined} className={link.href.includes('#') ? 'contact-nav' : ''}>{link.label}{link.href.includes('#') && <span aria-hidden="true">↗</span>}</Link>)}
    </nav>
  </div></header>;
}


