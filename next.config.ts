import type { NextConfig } from 'next';

const pages = process.env.PAGES_EXPORT === 'true';
const config: NextConfig = {
  devIndicators: false,
  ...(pages ? {output: 'export', basePath: '/DuanXiangYu', trailingSlash: true} : {}),
  images: {unoptimized: true},
  env: {NEXT_PUBLIC_BASE_PATH: pages ? '/DuanXiangYu' : ''},
};
export default config;
