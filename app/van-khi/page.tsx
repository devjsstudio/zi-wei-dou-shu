'use client';
import { useMemo } from 'react';
import AppHeader from '@/components/AppHeader';
import { useStoredChart } from '@/lib/useStoredChart';
import { useLocale } from '@/components/LocaleProvider';
import { STEMS, BRANCHES } from '@/lib/ziwei/constants';
import { buildSiHuaOverlay } from '@/components/TimeNav';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Solar } from 'lunar-javascript';

const HUA_INFO: Record<string, { label: string; color: string; good: boolean }> = {
  '禄': { label: 'Lộc', color: '#10B981', good: true },
  '权': { label: 'Quyền', color: '#38BDF8', good: true },
  '科': { label: 'Khoa', color: '#F59E0B', good: true },
  '忌': { label: 'Kỵ', color: '#F43F5E', good: false },
};

const ZHIXING_VI: Record<string, string> = {
  '建': 'Kiến', '除': 'Trừ', '满': 'Mãn', '平': 'Bình', '定': 'Định', '执': 'Chấp',
  '破': 'Phá', '危': 'Nguy', '成': 'Thành', '收': 'Thu', '开': 'Khai', '闭': 'Bế',
};
// 建除12神 cát/hung
const ZHIXING_CAT: Record<string, 'cat' | 'hung' | 'binh'> = {
  '建': 'binh', '除': 'cat', '满': 'cat', '平': 'binh', '定': 'cat', '执': 'binh',
  '破': 'hung', '危': 'hung', '成': 'cat', '收': 'binh', '开': 'cat', '闭': 'hung',
};
const HY_THAN = ['Đông Bắc', 'Tây Bắc', 'Chính Nam', 'Đông Nam', 'Đông Bắc', 'Tây Bắc', 'Chính Nam', 'Đông Nam', 'Tây Nam', 'Tây Nam'];
const STEM_WUXING = ['Mộc', 'Mộc', 'Hỏa', 'Hỏa', 'Thổ', 'Thổ', 'Kim', 'Kim', 'Thủy', 'Thủy'];
const WX_COLOR: Record<string, { name: string; hex: string }[]> = {
  'Mộc': [{ name: 'Xanh lá', hex: '#10B981' }, { name: 'Xanh ngọc', hex: '#58e7aa' }],
  'Hỏa': [{ name: 'Đỏ son', hex: '#F43F5E' }, { name: 'Hồng cam', hex: '#ff8a5c' }],
  'Thổ': [{ name: 'Vàng kim', hex: '#F59E0B' }, { name: 'Nâu đất', hex: '#c89b5a' }],
  'Kim': [{ name: 'Trắng ngọc', hex: '#E2E8F0' }, { name: 'Ánh kim', hex: '#d4af37' }],
  'Thủy': [{ name: 'Xanh dương', hex: '#38BDF8' }, { name: 'Xanh đen', hex: '#1e3a5f' }],
};

const NEN_POOL = [
  'Khởi sự, ký kết hợp đồng quan trọng', 'Gặp gỡ quý nhân, mở rộng quan hệ', 'Đầu tư, bàn chuyện tài chính',
  'Học hỏi, thi cử, nâng cao kỹ năng', 'Dọn dẹp, thanh lọc không gian sống', 'Cầu tài, khai trương, xuất hành',
  'Hòa giải mâu thuẫn, kết nối tình thân', 'Chăm sóc sức khỏe, dưỡng sinh',
];
const TRANH_POOL = [
  'Tranh cãi, ký kết vội vàng', 'Đầu tư mạo hiểm, vay mượn lớn', 'Quyết định quan trọng khi nóng giận',
  'Đi xa một mình vào giờ xấu', 'Thay đổi lớn chưa chuẩn bị kỹ', 'Tin lời hứa hẹn thiếu căn cứ',
  'Khai trương, động thổ', 'Tiêu xài phung phí',
];

export default function VanKhiPage() {
  const chart = useStoredChart();
  const { term } = useLocale();

  const d = useMemo(() => {
    if (!chart) return null;
    const now = new Date();
    const solar = (Solar as any).fromDate(now);
    const lunar = solar.getLunar();
    const dayGan: string = lunar.getDayGan();
    const dayZhi: string = lunar.getDayZhi();
    const ganIdx = STEMS.indexOf(dayGan);
    const zhiIdx = BRANCHES.indexOf(dayZhi);
    const zhixing: string = (lunar.getZhiXing && lunar.getZhiXing()) || '建';

    // Điểm cát khí (deterministic theo ngày + lá số)
    const seed = Math.abs((ganIdx + 1) * 13 + (zhiIdx + 1) * 7 + chart.mingGongBranch * 3 + chart.wuxingJu * 5);
    let score = 6.2 + ((seed * 7) % 36) / 10; // 6.2 - 9.7
    if (ZHIXING_CAT[zhixing] === 'cat') score += 0.3;
    if (ZHIXING_CAT[zhixing] === 'hung') score -= 0.5;
    score = Math.max(5.5, Math.min(9.8, Math.round(score * 10) / 10));

    const wx = STEM_WUXING[ganIdx] || 'Thổ';
    const colors = WX_COLOR[wx];
    const numbers = [((ganIdx % 9) + 1), ((zhiIdx % 9) + 1), (((ganIdx + zhiIdx) % 9) + 1), ((seed % 90) + 10)];
    const nen = [NEN_POOL[seed % NEN_POOL.length], NEN_POOL[(seed + 3) % NEN_POOL.length], NEN_POOL[(seed + 5) % NEN_POOL.length]];
    const tranh = [TRANH_POOL[seed % TRANH_POOL.length], TRANH_POOL[(seed + 2) % TRANH_POOL.length], TRANH_POOL[(seed + 4) % TRANH_POOL.length]];

    // Chiếu mệnh lưu nhật: tứ hóa theo can NGÀY chiếu vào cung nào của lá số
    const dayHua = buildSiHuaOverlay(ganIdx);
    const transits = Object.entries(dayHua).map(([star, h]) => {
      const pal = chart.palaces.find((p) => p.stars.some((s) => s.name === star));
      const info = HUA_INFO[h as string];
      return { star: term(star), label: info?.label || '', color: info?.color || '#f2ca50', good: info?.good ?? true, palace: pal ? term(pal.name) : 'Đối cung' };
    }).sort((a, b) => Number(b.good) - Number(a.good));

    return {
      dateStr: `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`,
      weekday: ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'][now.getDay()],
      lunarStr: `${lunar.getMonth() < 0 ? 'Nhuận ' : ''}${Math.abs(lunar.getMonth())}/${lunar.getDay()} Âm lịch`,
      dayGz: `${term(dayGan)} ${term(dayZhi)}`,
      yearGz: `${term(lunar.getYearGan())} ${term(lunar.getYearZhi())}`,
      zhixingVi: ZHIXING_VI[zhixing] || zhixing,
      zhixingCat: ZHIXING_CAT[zhixing] || 'binh',
      score,
      wx, colors, numbers, nen, tranh, transits,
      hyThan: HY_THAN[ganIdx] || 'Đông Nam',
      cfgHour: term(BRANCHES[(zhiIdx + 1) % 12]),
    };
  }, [chart, term]);

  if (!chart || !d) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-space-md bg-background text-on-surface-variant">
        <span className="material-symbols-outlined text-primary text-[40px] animate-spin">progress_activity</span>
        <p className="font-body-md text-body-md">Đang chuyển về Trang Chủ để lập lá số…</p>
      </main>
    );
  }

  const pct = Math.round((d.score / 10) * 100);
  const catLabel = d.zhixingCat === 'cat' ? 'Đại Cát' : d.zhixingCat === 'hung' ? 'Tiểu Hung' : 'Bình Hòa';

  return (
    <div className="bg-background font-body-md text-on-surface min-h-screen selection:bg-primary selection:text-on-primary">
      <AppHeader active="van-khi" />
      <main className="w-full pt-16 md:pt-20 bg-background min-h-screen relative overflow-hidden">
        <div className="absolute -top-24 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 -right-20 w-80 h-80 rounded-full bg-secondary/10 blur-[100px] pointer-events-none" />
        <div className="w-full max-w-[1280px] mx-auto px-margin-mobile md:px-space-lg lg:px-margin py-space-lg relative">
          {/* Header ngày */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-space-lg">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-space-sm flex-wrap">
                <span className="px-space-sm py-0.5 rounded-full bg-surface-container-high text-secondary font-label-esoteric text-label-esoteric uppercase tracking-wider">Khâm Thiên Lịch Nhật</span>
                <span className="font-label-sm text-label-sm text-tertiary">Ngày {d.zhixingVi} ({catLabel})</span>
              </div>
              <h1 className="font-headline-lg text-[26px] md:text-headline-lg text-primary tracking-tight">Vận Khí Hàng Ngày</h1>
              <p className="font-body-md text-body-md text-on-surface-variant">{d.weekday}, {d.dateStr} · {d.lunarStr} · Ngày {d.dayGz} / Năm {d.yearGz}</p>
            </div>
            <div className="bg-surface-container-high/60 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-2 self-start">
              <span className="material-symbols-outlined text-secondary text-[18px]">person</span>
              <span className="font-label-sm text-label-sm text-on-surface">Lá số: <span className="text-primary font-bold">{chart.birthInfo.name || 'Đương số'}</span></span>
            </div>
          </div>

          {/* Bento: điểm + nên/tránh */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg mb-space-lg">
            {/* Điểm cát khí */}
            <div className="lg:col-span-5 rounded-2xl bg-surface-container/95 p-space-lg shadow-2xl flex flex-col items-center relative overflow-hidden">
              <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-primary/10 blur-2xl pointer-events-none" />
              <h2 className="font-title-md text-title-md text-primary self-start">Điểm Cát Khí Lưu Nhật</h2>
              <span className="self-start font-label-esoteric text-label-esoteric text-secondary uppercase tracking-wider mb-space-md">Cấp độ {d.score}</span>
              <div className="relative w-48 h-48">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path d="M18 2.08a15.9155 15.9155 0 0 1 0 31.83 15.9155 15.9155 0 0 1 0 -31.83" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="2.5" />
                  <path d="M18 2.08a15.9155 15.9155 0 0 1 0 31.83 15.9155 15.9155 0 0 1 0 -31.83" fill="none" stroke="#f2ca50" strokeDasharray={`${pct}, 100`} strokeLinecap="round" strokeWidth="2.5" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-headline-xl text-[44px] text-primary font-bold leading-none">{d.score}</span>
                  <span className="font-label-esoteric text-[10px] text-on-surface-variant uppercase mt-1 tracking-widest">Thang 10 Cát Khí</span>
                </div>
              </div>
              <p className="text-center font-body-md text-on-surface-variant mt-space-md">
                {d.score >= 8.5 ? 'Ngày đại cát, chư tinh hội chiếu — nên chủ động khởi sự lớn.'
                  : d.score >= 7 ? 'Ngày cát lợi, hanh thông — thuận lợi cho công việc thường nhật.'
                  : 'Ngày bình hòa — giữ ổn định, tránh quyết định mạo hiểm.'}
              </p>
            </div>

            {/* Chiếu Mệnh Lưu Nhật */}
            <div className="lg:col-span-7 rounded-2xl bg-surface-container/95 p-space-lg shadow-2xl">
              <div className="flex items-center justify-between flex-wrap gap-2 mb-space-md">
                <h2 className="font-title-md text-title-md text-primary flex items-center gap-2"><span className="material-symbols-outlined text-secondary">hub</span> Chiếu Mệnh Lưu Nhật Bản Đồ</h2>
                <span className="font-label-sm text-label-sm text-secondary">Tứ hóa can ngày {d.dayGz}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                {d.transits.map((t, i) => (
                  <div key={i} className="rounded-xl bg-surface-container-low/80 p-space-md flex items-start gap-space-sm">
                    <span className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 font-bold" style={{ background: `${t.color}1a`, color: t.color }}>
                      {t.label.charAt(0)}
                    </span>
                    <div className="flex flex-col min-w-0">
                      <span className="font-title-sm text-[14px] text-on-surface font-semibold">{t.star} hóa {t.label}</span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">Chiếu cung {t.palace} · {t.good ? 'khí vận hanh thông, nên nắm bắt' : 'dễ vướng mắc, cần thận trọng'}</span>
                    </div>
                  </div>
                ))}
                {d.transits.length === 0 && <p className="text-on-surface-variant col-span-full">Hôm nay không có sao hóa chiếu trong lá số.</p>}
              </div>
              <div className="mt-space-md pt-space-md border-t border-outline-variant/30 flex items-center gap-space-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-primary text-[18px]">auto_graph</span>
                <span className="font-body-sm text-body-sm">Cung vị trọng yếu hôm nay: <span className="text-primary font-semibold">{d.transits[0] ? `${d.transits[0].palace} (hóa ${d.transits[0].label})` : '—'}</span></span>
              </div>
            </div>
          </div>

          {/* Nên làm / Cần tránh */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-lg mb-space-lg">
            <div className="rounded-2xl bg-surface-container-low/90 p-space-lg shadow-xl">
              <h3 className="font-title-md text-title-md text-tertiary flex items-center gap-2 mb-space-md"><span className="material-symbols-outlined">check_circle</span> Khuyên Làm (Nên Làm)</h3>
              <ul className="flex flex-col gap-space-sm">
                {d.nen.map((x, i) => (
                  <li key={i} className="flex items-start gap-2 font-body-md text-body-md text-on-surface-variant"><span className="material-symbols-outlined text-tertiary text-[18px] mt-0.5">done</span>{x}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-surface-container-low/90 p-space-lg shadow-xl">
              <h3 className="font-title-md text-title-md text-error flex items-center gap-2 mb-space-md"><span className="material-symbols-outlined">cancel</span> Cần Tránh (Kiêng Kỵ)</h3>
              <ul className="flex flex-col gap-space-sm">
                {d.tranh.map((x, i) => (
                  <li key={i} className="flex items-start gap-2 font-body-md text-body-md text-on-surface-variant"><span className="material-symbols-outlined text-error text-[18px] mt-0.5">block</span>{x}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Ma trận: màu / số / hướng */}
          <h2 className="font-headline-md text-[20px] text-primary font-bold mb-space-md">Ma Trận Gợi Ý Thực Hành</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
            <div className="rounded-2xl bg-surface-container/95 p-space-lg shadow-xl">
              <h3 className="font-title-md text-title-md text-secondary flex items-center gap-2 mb-space-md"><span className="material-symbols-outlined">palette</span> Màu May Mắn</h3>
              <div className="flex gap-space-md">
                {d.colors.map((c) => (
                  <div key={c.name} className="flex flex-col items-center gap-1.5">
                    <span className="w-12 h-12 rounded-full shadow-inner" style={{ background: c.hex, boxShadow: `0 0 16px ${c.hex}66` }} />
                    <span className="font-body-sm text-[12px] text-on-surface-variant">{c.name}</span>
                  </div>
                ))}
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-md">Hành ngày: <span className="text-primary font-semibold">{d.wx}</span> — hợp phối trang phục tông màu trên.</p>
            </div>
            <div className="rounded-2xl bg-surface-container/95 p-space-lg shadow-xl">
              <h3 className="font-title-md text-title-md text-primary flex items-center gap-2 mb-space-md"><span className="material-symbols-outlined">tag</span> Con Số Cát Lợi</h3>
              <div className="grid grid-cols-4 gap-space-sm">
                {d.numbers.map((n, i) => (
                  <div key={i} className="aspect-square rounded-xl bg-surface-container-low flex items-center justify-center font-headline-md text-[20px] font-bold" style={{ color: ['#f2ca50', '#ffb95f', '#58e7aa', '#38BDF8'][i] }}>
                    {String(n).padStart(2, '0')}
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl bg-surface-container/95 p-space-lg shadow-xl">
              <h3 className="font-title-md text-title-md text-secondary flex items-center gap-2 mb-space-md"><span className="material-symbols-outlined">explore</span> Hướng Xuất Hành</h3>
              <div className="flex items-center gap-space-md">
                <span className="material-symbols-outlined text-primary text-[48px]">near_me</span>
                <div className="flex flex-col">
                  <span className="font-label-esoteric text-label-esoteric text-on-surface-variant uppercase">Hỷ Thần Tọa</span>
                  <span className="font-headline-md text-[22px] text-primary font-bold">{d.hyThan}</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Giờ cát: Giờ {d.cfgHour}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
