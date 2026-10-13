import Link from 'next/link';
export default function NotFound() {
  return <main id="main-content" className="shell not-found"><p className="eyebrow">404 / NOT FOUND</p><h1>这一页还未出现。</h1><p>作品可能已更新，或这个地址暂不存在。</p><Link href="/" className="button button-dark">返回首页 →</Link></main>;
}
