'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lunar, LunarMonth, Solar } from 'lunar-javascript';
import AppHeader from '@/components/AppHeader';
import type { BirthInfo } from '@/lib/ziwei/types';
import { BIRTH_STORAGE_KEY } from '@/lib/useStoredChart';
import { STEM_VI, BRANCH_VI, yearGanZhi, nayinOf, amDuong, yearBranchIndex, tamHop, lucHop, xungChi } from '@/lib/tools';

const STEMS_HAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const BRANCHES_HAN = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

const PURPOSES = [
  { key: 'khai-truong', label: 'Khai trương & Mở bán', sub: 'Thương Mại Hưng Vượng', icon: 'storefront' },
  { key: 'hop-dong', label: 'Ký kết hợp đồng', sub: 'Thương Ước Định Tài', icon: 'history_edu' },
  { key: 'cuoi-hoi', label: 'Đại hỷ Cưới hỏi', sub: 'Long Phụng Giao Hòa', icon: 'favorite' },
  { key: 'xuat-hanh', label: 'Xuất hành cầu tài', sub: 'Hỷ Thần Tọa Hướng', icon: 'explore' },
  { key: 'dong-tho', label: 'Mua đất & Động thổ', sub: 'An Thổ Định Trạch', icon: 'foundation' },
  { key: 'nhap-trach', label: 'Nhập trạch an gia', sub: 'Tụ Khí Tinh Anh', icon: 'roofing' },
];

const TAM_NUONG = [3, 7, 13, 18, 22, 27];
const NGUYET_KY = [5, 14, 23];

interface DayCell {
  lunarDay: number;
  solar: string;
  ganzhi: string;
  dayBranch: number;
  label: string;
  tone: 'cat' | 'daicat' | 'binh' | 'hung';
  score: number;
}

function rate(dayBranch: number, lunarDay: number, yob: number, purposeShift: number): { label: string; tone: DayCell['tone']; score: number } {
  if (xungChi(dayBranch, yob)) return { label: 'Xung Mệnh', tone: 'hung', score: 1 };
  if (TAM_NUONG.includes(lunarDay)) return { label: 'Tam Nương Sát', tone: 'hung', score: 1 };
  const tam = tamHop(yob);
  if (dayBranch === tam[1] || dayBranch === tam[2]) {
    const s = 8 + purposeShift;
    return { label: s >= 9 ? 'Đại Cát Cự Vượng' : 'Tam Hợp Cát', tone: s >= 9 ? 'daicat' : 'cat', score: Math.min(10, s) };
  }
  if (lucHop(dayBranch, yob)) return { label: 'Lục Hợp Cát', tone: 'cat', score: Math.min(10, 7 + purposeShift) };
  if (NGUYET_KY.includes(lunarDay)) return { label: 'Nguyệt Kỵ', tone: 'hung', score: 2 };
  const pool = ['Minh Đường', 'Thứ Cát', 'Bình Hòa', 'Kim Quỹ', 'Thiên Đức'];
  const label = pool[dayBranch % pool.length];
  const binh = label === 'Bình Hòa';
  return { label, tone: binh ? 'binh' : 'cat', score: (binh ? 4 : 5) + purposeShift };
}

export default function TrachNhatPage() {
  const router = useRouter();
  const [birth, setBirth] = useState<BirthInfo | null>(null);
  const [purpose, setPurpose] = useState(PURPOSES[0].key);
  const [ym, setYm] = useState<{ y: number; m: number } | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(BIRTH_STORAGE_KEY);
      if (raw) {
        setBirth(JSON.parse(raw) as BirthInfo);
        const l = (Solar as any).fromDate(new Date()).getLunar();
        setYm({ y: l.getYear(), m: Math.abs(l.getMonth()) });
        return;
      }
    } catch { /* ignore */ }
    router.replace('/');
  }, [router]);

  const yob = birth ? yearBranchIndex(birth.origInput?.year ?? birth.year) : 0;
  const purposeShift = PURPOSES.findIndex((p) => p.key === purpose) % 3; // 0..2 nhẹ

  const days = useMemo<DayCell[]>(() => {
    if (!ym) return [];
    let count = 30;
    try { count = (LunarMonth as any).fromYm(ym.y, ym.m)?.getDayCount() ?? 30; } catch { count = 30; }
    const out: DayCell[] = [];
    for (let d = 1; d <= count; d++) {
      try {
        const lu = (Lunar as any).fromYmd(ym.y, ym.m, d);
        const gi = STEMS_HAN.indexOf(lu.getDayGan());
        const zi = BRANCHES_HAN.indexOf(lu.getDayZhi());
        const sol = lu.getSolar();
        const r = rate(zi, d, yob, purposeShift);
        out.push({
          lunarDay: d,
          solar: `${sol.getMonth()}/${sol.getDay()}`,
          ganzhi: `${STEM_VI[gi] ?? ''} ${BRANCH_VI[zi] ?? ''}`.trim(),
          dayBranch: zi,
          label: r.label, tone: r.tone, score: r.score,
        });
      } catch { /* skip */ }
    }
    return out;
  }, [ym, yob, purposeShift]);

  const firstWeekday = useMemo(() => {
    if (!ym) return 0;
    try { const s = (Lunar as any).fromYmd(ym.y, ym.m, 1).getSolar(); return new Date(s.getYear(), s.getMonth() - 1, s.getDay()).getDay(); } catch { return 0; }
  }, [ym]);

  const top3 = useMemo(() => days.slice().sort((a, b) => b.score - a.score).slice(0, 3), [days]);
  const solarRange = useMemo(() => {
    if (!days.length) return '';
    return `${days[0].solar} – ${days[days.length - 1].solar}`;
  }, [days]);

  const birthYear = birth?.origInput?.year ?? birth?.year ?? 0;

  const tones: Record<DayCell['tone'], { bg: string; text: string }> = {
    daicat: { bg: 'bg-primary/20 border-primary/60', text: 'text-primary' },
    cat: { bg: 'bg-tertiary/10 border-tertiary/30', text: 'text-tertiary' },
    binh: { bg: 'bg-surface-container-low border-outline-variant/30', text: 'text-on-surface-variant' },
    hung: { bg: 'bg-error/10 border-error/30', text: 'text-error' },
  };
  const WD = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];

  return (
    <div className="bg-background font-body-md text-on-surface min-h-screen">
      <AppHeader active="trach-nhat" />
      <main className="w-full pt-16 md:pt-20 min-h-screen relative overflow-hidden">
        <div className="absolute -top-24 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
        <div className="w-full max-w-[1280px] mx-auto px-margin-mobile md:px-space-lg lg:px-margin py-space-lg relative">
          <div className="flex flex-col gap-1 mb-space-lg">
            <span className="px-space-sm py-0.5 rounded-full bg-surface-container-high text-secondary font-label-esoteric text-label-esoteric uppercase tracking-wider w-fit">Ngự Tiền Chiêm Tinh Viện</span>
            <h1 className="font-headline-lg text-[26px] md:text-headline-lg text-primary tracking-tight uppercase">Khâm Thiên Trạch Cát • Chọn Ngày Hoàng Đạo</h1>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl">Can chi từng ngày tính theo lịch thật; đánh giá cát – hung đối chiếu địa chi năm sinh của bạn (tam hợp, lục hợp, xung, tam nương).</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
            {/* Trái: đương số + bộ lọc + top3 */}
            <aside className="lg:col-span-4 flex flex-col gap-space-md">
              {birth && (
                <div className="rounded-2xl bg-surface-container/95 p-space-lg shadow-xl">
                  <div className="flex items-center gap-space-sm mb-space-sm">
                    <span className="material-symbols-outlined text-[#38BDF8]">water_drop</span>
                    <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">{birth.name || 'Đương Số'}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[12px]">
                    <Info k="Năm sinh" v={`${yearGanZhi(birthYear)} ${birthYear}`} />
                    <Info k="Âm/Dương" v={`${amDuong(birthYear)} ${birth.gender === 'male' ? 'Nam' : 'Nữ'}`} />
                    <Info k="Bản mệnh" v={nayinOf(birthYear).name} full />
                  </div>
                </div>
              )}

              <div className="rounded-2xl bg-surface-container-low/90 p-space-lg shadow-xl">
                <div className="flex items-center gap-space-xs mb-space-sm">
                  <span className="material-symbols-outlined text-primary">tune</span>
                  <span className="font-title-sm text-[14px] text-on-surface font-semibold">Bộ Lọc Mục Đích Khởi Sự</span>
                </div>
                <p className="font-label-esoteric text-[10px] text-on-surface-variant mb-space-md italic">Khẩu quyết: Sự khởi tại thiên – Cát tại nhân hòa</p>
                <div className="flex flex-col gap-1.5">
                  {PURPOSES.map((p) => {
                    const active = p.key === purpose;
                    return (
                      <button key={p.key} type="button" onClick={() => setPurpose(p.key)}
                        className={`flex items-center gap-space-sm px-space-sm py-2 rounded-xl text-left transition-all border ${active ? 'bg-primary-container/80 text-on-primary-container border-transparent' : 'bg-surface-container text-on-surface border-outline-variant/30 hover:border-primary/40'}`}>
                        <span className={`material-symbols-outlined text-[20px] ${active ? '' : 'text-primary'}`}>{p.icon}</span>
                        <span className="flex flex-col min-w-0">
                          <span className="font-title-sm text-[13px] font-semibold truncate">{p.label}</span>
                          <span className="font-body-sm text-[11px] opacity-70">{p.sub}</span>
                        </span>
                        {active && <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-tertiary/20 text-tertiary font-bold whitespace-nowrap">Đang lọc</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-2xl bg-gradient-to-b from-primary-container/20 to-surface-container p-space-lg shadow-xl">
                <div className="flex items-center gap-space-xs mb-space-md">
                  <span className="material-symbols-outlined text-primary">workspace_premium</span>
                  <span className="font-headline-sm text-headline-sm text-primary font-semibold">Top 3 Ngày Vàng Khởi Sự</span>
                </div>
                <div className="flex flex-col gap-space-sm">
                  {top3.map((d, i) => (
                    <div key={d.lunarDay} className="flex items-center gap-space-md rounded-xl bg-surface-container-low/80 p-space-sm">
                      <span className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-[14px] shrink-0">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-title-sm text-[13px] text-on-surface font-semibold">Mùng {d.lunarDay} ÂL · {d.solar} DL</p>
                        <p className="font-body-sm text-[11px] text-on-surface-variant">Ngày {d.ganzhi} · <span className="text-tertiary font-semibold">{d.label}</span></p>
                      </div>
                      <span className="font-bold text-primary text-[16px] shrink-0">{d.score}<span className="text-[10px] opacity-60">/10</span></span>
                    </div>
                  ))}
                </div>
              </div>
            </aside>

            {/* Phải: lịch */}
            <section className="lg:col-span-8">
              <div className="rounded-2xl bg-surface-container/95 p-space-md md:p-space-lg shadow-2xl">
                <div className="flex items-center justify-between mb-space-md">
                  <div className="flex flex-col">
                    <span className="font-label-esoteric text-label-esoteric text-secondary uppercase">Chu Kỳ Hoàng Lịch</span>
                    {ym && <span className="font-headline-sm text-headline-sm text-primary font-bold">Tháng {ym.m} Âm Lịch · {solarRange} DL</span>}
                  </div>
                  <div className="flex items-center gap-1">
                    <button type="button" onClick={() => setYm((v) => v && (v.m <= 1 ? { y: v.y - 1, m: 12 } : { ...v, m: v.m - 1 }))}
                      className="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface hover:text-primary"><span className="material-symbols-outlined text-[18px]">chevron_left</span></button>
                    <button type="button" onClick={() => setYm((v) => v && (v.m >= 12 ? { y: v.y + 1, m: 1 } : { ...v, m: v.m + 1 }))}
                      className="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface hover:text-primary"><span className="material-symbols-outlined text-[18px]">chevron_right</span></button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1.5 mb-1.5">
                  {WD.map((w) => <div key={w} className="text-center font-label-sm text-[10px] text-on-surface-variant uppercase py-1">{w}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-1.5">
                  {Array.from({ length: firstWeekday }, (_, k) => <div key={`pad${k}`} />)}
                  {days.map((d) => {
                    const t = tones[d.tone];
                    return (
                      <div key={d.lunarDay} className={`rounded-lg border p-1.5 flex flex-col min-h-[64px] ${t.bg} transition-all hover:brightness-110`}>
                        <div className="flex items-start justify-between">
                          <span className="font-headline-sm text-[14px] font-bold text-on-surface">{String(d.lunarDay).padStart(2, '0')}</span>
                          {d.tone === 'daicat' && <span className="material-symbols-outlined text-primary text-[14px]">auto_awesome</span>}
                        </div>
                        <span className="font-body-sm text-[9px] text-on-surface-variant">{d.solar}</span>
                        <span className="font-body-sm text-[9px] text-on-surface-variant/80 truncate">{d.ganzhi}</span>
                        <span className={`mt-auto font-label-sm text-[9px] font-semibold truncate ${t.text}`}>{d.label}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="flex flex-wrap items-center gap-space-md mt-space-md pt-space-md border-t border-outline-variant/30 text-[10px]">
                  <Legend c="bg-primary/20 border-primary/60" t="Đại Cát" />
                  <Legend c="bg-tertiary/10 border-tertiary/30" t="Cát / Hợp" />
                  <Legend c="bg-surface-container-low border-outline-variant/30" t="Bình Hòa" />
                  <Legend c="bg-error/10 border-error/30" t="Hung / Xung" />
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

function Info({ k, v, full }: { k: string; v: string; full?: boolean }) {
  return (
    <div className={`rounded-lg bg-surface-container-low/80 p-space-sm ${full ? 'col-span-2' : ''}`}>
      <span className="text-[10px] text-on-surface-variant uppercase block">{k}</span>
      <span className="text-[13px] text-on-surface font-semibold">{v}</span>
    </div>
  );
}
function Legend({ c, t }: { c: string; t: string }) {
  return <span className="flex items-center gap-1.5 text-on-surface-variant"><span className={`w-3 h-3 rounded border ${c}`} />{t}</span>;
}
