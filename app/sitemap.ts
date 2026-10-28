/**
 * sitemap.xml —— chỉ gồm 5 màn hình theo thiết kế:
 * Trang Chủ, Bảng Lá Số, Sách Luận Giải, Vận Hạn & Lưu Niên, Đại Sư AI & Tủ Lá Số.
 */

import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

const BASE_URL = SITE_URL;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastmod = new Date();
  return [
    { url: BASE_URL, priority: 1.0, changeFrequency: 'weekly', lastModified: lastmod },
    { url: `${BASE_URL}/chart`, priority: 0.95, changeFrequency: 'weekly', lastModified: lastmod },
    { url: `${BASE_URL}/luan-giai`, priority: 0.9, changeFrequency: 'weekly', lastModified: lastmod },
    { url: `${BASE_URL}/van-han`, priority: 0.9, changeFrequency: 'weekly', lastModified: lastmod },
    { url: `${BASE_URL}/dai-su-ai`, priority: 0.9, changeFrequency: 'weekly', lastModified: lastmod },
  ];
}
