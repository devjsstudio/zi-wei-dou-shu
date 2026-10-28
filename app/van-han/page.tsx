'use client';
import { useState } from 'react';
import AppHeader from '@/components/AppHeader';
import { useStoredChart } from '@/lib/useStoredChart';
import { useLocale } from '@/components/LocaleProvider';
import { getYearStemIndex, buildSiHuaOverlay } from '@/components/TimeNav';
import { BRANCHES, STEMS } from '@/lib/ziwei/constants';

const HUA = {
  '禄': { label: 'Lộc', color: '#10B981' },
  '权': { label: 'Quyền', color: '#38BDF8' },
  '科': { label: 'Khoa', color: '#F59E0B' },
  '忌': { label: 'Kỵ', color: '#F43F5E' },
} as const;

function Loading() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-space-md bg-background text-on-surface-variant">
      <span className="material-symbols-outlined text-primary text-[40px] animate-spin">progress_activity</span>
      <p className="font-body-md text-body-md">Đang chuyển về Trang Chủ để lập lá số…</p>
    </main>
  );
}

export default function VanHanPage() {
  const chart = useStoredChart();
  const { term } = useLocale();
  const nowYear = new Date().getFullYear();
  const [year, setYear] = useState(nowYear);

  if (!chart) return <Loading />;

  const dxList = chart.daXians;
  const cur = chart.currentDaXianIndex;

  // Tứ hóa lưu niên (theo can năm)
  const overlay = buildSiHuaOverlay(getYearStemIndex(year));
  const yearStem = getYearStemIndex(year);
  const yearBranch = (year - 4) % 12; // 地支：甲子年 branch 0
  const luuNienHoa = Object.entries(overlay).map(([star, h]) => ({ star, h: h as keyof typeof HUA }));

  return (
    <div className="bg-background font-body-md text-on-surface min-h-screen selection:bg-primary selection:text-on-primary">
      <AppHeader active="van-han" />
      <main className="w-full pt-16 md:pt-20 bg-background min-h-screen">
        <div className="w-full max-w-[1280px] mx-auto px-margin-mobile md:px-space-lg lg:px-margin py-space-lg">
          {/* Tiêu đề */}
          <div className="flex flex-col gap-1 mb-space-lg">
            <div className="flex items-center gap-space-sm flex-wrap">
              <span className="px-space-sm py-0.5 rounded-full bg-surface-container-high text-secondary font-label-esoteric text-label-esoteric uppercase tracking-wider">Thiên Vận Tuần Hoàn</span>
              <span className="inline-flex items-center gap-1 text-tertiary font-label-sm text-label-sm">
                <span className="w-2 h-2 rounded-full bg-tertiary animate-ping" />
                {chart.birthInfo.name ? chart.birthInfo.name : 'Đương Số'} · {chart.currentAge} tuổi
              </span>
            </div>
            <h1 className="font-headline-lg text-[28px] md:text-headline-lg text-primary tracking-tight">Vận Hạn Tiểu Lưu &amp; Đại Vận 10 Năm</h1>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl">
              Hành trình đại vận mỗi 10 năm một giai đoạn, tứ hóa dẫn động cát hung; lưu niên từng năm soi chiếu thời vận hiện tại.
            </p>
          </div>

          {/* Đại vận timeline */}
          <section className="mb-space-xl">
            <h2 className="font-headline-md text-[20px] text-primary font-bold mb-space-md flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">timeline</span>
              Đại Vận Đời Người
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 gap-space-md">
              {dxList.map((dx, i) => {
                const active = i === cur;
                const hoas = dx.siHua
                  ? [
                      { label: 'Lộc', star: dx.siHua.lu, color: '#10B981' },
                      { label: 'Quyền', star: dx.siHua.quan, color: '#38BDF8' },
                      { label: 'Khoa', star: dx.siHua.ke, color: '#F59E0B' },
                      { label: 'Kỵ', star: dx.siHua.ji, color: '#F43F5E' },
                    ]
                  : [];
                return (
                  <div
                    key={i}
                    className={active
                      ? 'rounded-xl p-space-md bg-surface-container-high ring-2 ring-primary shadow-2xl'
                      : 'rounded-xl p-space-md bg-surface-container-low/95 hover:bg-surface-container shadow-md transition-all'}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-headline-sm text-[15px] text-primary font-bold tabular-nums">{dx.startAge}–{dx.endAge}</span>
                      {active && <span className="px-1.5 py-0.5 rounded bg-primary text-on-primary text-[9px] font-bold">HIỆN TẠI</span>}
                    </div>
                    <div className="font-title-sm text-[14px] text-on-surface font-semibold">{term(dx.palaceName)}</div>
                    <div className="text-[11px] text-on-surface-variant mb-2">
                      {dx.stemName ? term(dx.stemName) : ''} {term(BRANCHES[dx.palaceBranch])}
                    </div>
                    <div className="flex flex-col gap-0.5">
                      {hoas.map((h) => (
                        <div key={h.label} className="flex items-center gap-1.5 text-[11px]">
                          <span className="w-8 shrink-0 font-semibold" style={{ color: h.color }}>{h.label}</span>
                          <span className="text-on-surface-variant truncate">{term(h.star)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Lưu niên */}
          <section>
            <div className="flex items-center justify-between flex-wrap gap-space-md mb-space-md">
              <h2 className="font-headline-md text-[20px] text-primary font-bold flex items-center gap-2">
                <span className="material-symbols-outlined text-tertiary">event</span>
                Lưu Niên Vận Trình
              </h2>
              <div className="flex items-center gap-space-sm bg-surface-container-low/90 p-1 rounded-full">
                <button type="button" onClick={() => setYear((y) => y - 1)} className="w-8 h-8 rounded-full hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant">
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                </button>
                <span className="font-headline-sm text-[18px] text-primary font-bold tabular-nums px-2 min-w-[72px] text-center">{year}</span>
                <button type="button" onClick={() => setYear((y) => y + 1)} className="w-8 h-8 rounded-full hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant">
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              </div>
            </div>

            <div className="rounded-2xl bg-surface-container/95 p-space-lg shadow-2xl">
              <div className="flex items-center gap-space-md flex-wrap mb-space-md pb-space-md border-b border-outline-variant/30">
                <div className="px-space-md py-1.5 rounded-full bg-primary/10 text-primary font-semibold">
                  Năm {term(STEMS[yearStem])} {term(BRANCHES[yearBranch])} · {year}
                </div>
                <span className="text-on-surface-variant font-body-sm text-body-sm">Tứ hóa lưu niên dẫn động theo can năm</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-md">
                {luuNienHoa.length === 0 && (
                  <p className="text-on-surface-variant col-span-full">Năm này không có sao hóa trong lá số.</p>
                )}
                {luuNienHoa.map(({ star, h }) => {
                  const info = HUA[h];
                  return (
                    <div key={star + h} className="rounded-xl p-space-md bg-surface-container-low/80 flex flex-col items-center text-center gap-1">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ color: info.color, background: `${info.color}1a` }}>Hóa {info.label}</span>
                      <span className="font-headline-md text-[18px] font-bold" style={{ color: info.color }}>{term(star)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
