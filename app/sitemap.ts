/**
 * sitemap.xml —— các màn hình công khai của ứng dụng.
 */

import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

const BASE_URL = SITE_URL;

const PATHS = [
  '', '/chart', '/luan-giai', '/van-han', '/dai-su-ai',
  '/hop-duyen', '/van-khi', '/phong-thuy', '/bach-khoa', '/chia-se',
  '/trach-nhat', '/dinh-gio',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastmod = new Date();
  return PATHS.map((p, i) => ({
    url: `${BASE_URL}${p}`,
    priority: i === 0 ? 1.0 : 0.9,
    changeFrequency: 'weekly' as const,
    lastModified: lastmod,
  }));
}
