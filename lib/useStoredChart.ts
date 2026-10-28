'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { generateChart } from '@/lib/ziwei/algorithm';
import type { BirthInfo, ZiweiChart } from '@/lib/ziwei/types';

export const BIRTH_STORAGE_KEY = 'ziwei-birth';

/**
 * Đọc thông tin sinh đã lưu (ziwei-birth) và lập lại lá số.
 * Dùng chung cho các màn: Bảng Lá Số, Vận Hạn, Sách Luận Giải, Đại Sư AI.
 * Không có dữ liệu → tự chuyển về Trang Chủ.
 */
export function useStoredChart(): ZiweiChart | null {
  const router = useRouter();
  const [chart, setChart] = useState<ZiweiChart | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(BIRTH_STORAGE_KEY);
      if (raw) {
        setChart(generateChart(JSON.parse(raw) as BirthInfo));
        return;
      }
    } catch { /* ignore */ }
    router.replace('/');
  }, [router]);

  return chart;
}
