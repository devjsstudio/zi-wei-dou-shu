'use client';
import { useState } from 'react';
import ChartBoard from '@/components/ChartBoard';
import InsightPanel from '@/components/InsightPanel';
import AppHeader from '@/components/AppHeader';
import { useStoredChart } from '@/lib/useStoredChart';
import type { Palace } from '@/lib/ziwei/types';

/**
 * Trang Bảng Lá Số Tương Tác —— render lá số đầy đủ + luận giải AI.
 * Thông tin sinh được nhập ở Trang Chủ (form "Khởi Bàn An Mệnh"), lưu ở
 * sessionStorage. Nếu vào thẳng mà chưa có dữ liệu → tự chuyển về Trang Chủ.
 */
export default function ChartPage() {
  const chart = useStoredChart();
  const [selectedPalace, setSelectedPalace] = useState<Palace | null>(null);

  // ── Chưa có lá số: đang chuyển về Trang Chủ ──
  if (!chart) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-space-md bg-background text-on-surface-variant">
        <span className="material-symbols-outlined text-primary text-[40px] animate-spin">progress_activity</span>
        <p className="font-body-md text-body-md">Đang chuyển về Trang Chủ để lập lá số…</p>
      </main>
    );
  }

  const EL = [
    { c: '#E2E8F0', t: 'Kim (Bạch Kim)' },
    { c: '#10B981', t: 'Mộc (Thanh Mộc)' },
    { c: '#38BDF8', t: 'Thủy (Huyền Thủy)' },
    { c: '#F43F5E', t: 'Hỏa (Chu Sa Hỏa)' },
    { c: '#F59E0B', t: 'Thổ (Hoàng Thổ)' },
  ];

  // ── Đã có lá số: Bảng Lá Số Tương Tác ──
  return (
    <div className="bg-background font-body-md text-on-surface min-h-screen selection:bg-primary selection:text-on-primary">
      <AppHeader active="la-so" />

      <main className="w-full pt-16 md:pt-20 bg-background min-h-screen">
        <div className="w-full max-w-[1536px] mx-auto px-margin-mobile md:px-space-lg lg:px-margin py-space-lg">
          {/* Tiêu đề + hành động */}
          <div className="flex flex-col xl:flex-row items-start justify-between gap-space-lg mb-space-lg">
            <div className="flex flex-col gap-1 min-w-0">
              <div className="flex items-center gap-space-sm flex-wrap">
                <span className="px-space-sm py-0.5 rounded-full bg-surface-container-high text-secondary font-label-esoteric text-label-esoteric uppercase tracking-wider">Khâm Thiên Giám Tàng Bản</span>
                <span className="inline-flex items-center gap-1 text-tertiary font-label-sm text-label-sm">
                  <span className="w-2 h-2 rounded-full bg-tertiary animate-ping" />
                  Trận Đồ Thần Số Vận Hành
                </span>
              </div>
              <h1 className="font-headline-lg text-[28px] md:text-headline-lg text-primary tracking-tight">Lá Số Tử Vi Đẩu Số Hoàng Cung</h1>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl">
                Thập Nhị Cung đồ trận kết hợp Thiên Bàn Hoàng Gia. Nhấp vào từng cung vị để chiếu xạ Tam Hợp – Xung Chiếu và nhận mật ngữ giải mã chân truyền.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-space-sm bg-surface-container-low/90 p-space-sm rounded-xl shadow-xl shrink-0">
              <a href="/" className="group flex items-center gap-2 px-space-md py-2 rounded-lg bg-surface-container hover:bg-surface-container-high transition-all text-on-surface">
                <span className="material-symbols-outlined text-[18px] text-secondary">add_circle</span>
                <span className="font-label-md text-label-md">Lập Lá Số Khác</span>
              </a>
              <button type="button" onClick={() => window.print()} className="group flex items-center gap-2 px-space-md py-2 rounded-lg bg-surface-container hover:bg-surface-container-high transition-all text-on-surface">
                <span className="material-symbols-outlined text-[18px] text-tertiary">print</span>
                <span className="font-label-md text-label-md">In Lá Số</span>
              </button>
            </div>
          </div>

          {/* Legend ngũ hành */}
          <div className="flex flex-wrap items-center justify-between gap-space-md bg-surface-container/70 p-space-md rounded-xl mb-space-lg shadow-md">
            <div className="flex flex-wrap items-center gap-space-lg">
              <span className="font-label-esoteric text-label-esoteric text-on-surface-variant uppercase">Ngũ Hành Quy Chiếu:</span>
              {EL.map((e) => (
                <div key={e.t} className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full" style={{ background: e.c, boxShadow: `0 0 8px ${e.c}` }} />
                  <span className="font-label-sm text-label-sm" style={{ color: e.c }}>{e.t}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-space-sm text-on-surface-variant font-body-sm text-body-sm">
              <span className="material-symbols-outlined text-[16px] text-primary">touch_app</span>
              <span>Nhấp chọn cung để kích hoạt Tam Hợp Cục</span>
            </div>
          </div>

          {/* Lưới: bàn lá số (9/12) + luận giải (3/12) */}
          <div className="grid grid-cols-1 2xl:grid-cols-12 gap-space-lg items-start">
            <div className="2xl:col-span-8 w-full bg-surface-container-lowest p-2 sm:p-4 rounded-2xl shadow-2xl">
              <div className="aspect-[4/3.6] md:aspect-[4/3.2]">
                <ChartBoard chart={chart} onPalaceSelect={setSelectedPalace} />
              </div>
            </div>
            <div className="2xl:col-span-4 w-full">
              <div className="2xl:sticky 2xl:top-24 h-[600px] 2xl:h-[calc(100vh-130px)]">
                <InsightPanel chart={chart} selectedPalace={selectedPalace} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
