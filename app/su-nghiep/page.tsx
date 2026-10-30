'use client';
import { useMemo } from 'react';
import AppHeader from '@/components/AppHeader';
import { useLocale } from '@/components/LocaleProvider';
import { useStoredChart } from '@/lib/useStoredChart';
import type { Palace } from '@/lib/ziwei/types';
import { nayinOf, hanhSinh, HANH_COLOR, HANH_ICON, BRANCH_VI, type NguHanh } from '@/lib/tools';

/** Đóng góp của từng chính tinh (khóa Hán khớp engine) vào 3 nguyên mẫu nghề. */
const STAR_PROFILE: Record<string, [number, number, number]> = {
  // [Làm chủ, Ngoại giao, Chuyên gia]
  '紫微': [9, 6, 4], '天府': [7, 5, 6], '武曲': [8, 4, 7], '七杀': [9, 2, 5], '破军': [8, 3, 4],
  '太阳': [8, 7, 4], '贪狼': [7, 8, 4], '廉贞': [7, 6, 5], '天机': [4, 6, 9], '天梁': [4, 6, 8],
  '天相': [5, 8, 6], '天同': [3, 8, 5], '太阴': [4, 7, 7], '巨门': [5, 8, 6],
  '文昌': [3, 5, 8], '文曲': [3, 7, 7], '左辅': [6, 6, 5], '右弼': [5, 7, 5],
  '天魁': [6, 7, 5], '天钺': [5, 7, 6], '禄存': [7, 5, 6],
};

const ARCHETYPES = [
  { key: 0, label: 'Làm Chủ & Khởi Nghiệp', en: 'Entrepreneurship', icon: 'crown' },
  { key: 1, label: 'Ngoại Giao & Đàm Phán', en: 'Diplomat & Alliances', icon: 'handshake' },
  { key: 2, label: 'Chuyên Gia Độc Lập', en: 'Independent Specialist', icon: 'psychology' },
] as const;

/** 4 khối ngành theo ngũ hành. */
const INDUSTRY: Record<NguHanh, { title: string; sub: string }> = {
  Kim: { title: 'Kim / Thủy Vượng', sub: 'Tài Chính · Ngân Hàng · Quản Lý Quỹ Đầu Tư' },
  Thủy: { title: 'Thủy Lưu Thiên Lý', sub: 'Thương Mại Xuất Nhập Khẩu · Logistics · Du Lịch' },
  Mộc: { title: 'Mộc Tú Sinh Phát', sub: 'Giáo Dục · Y Dược · Xuất Bản · Nông Lâm' },
  Hỏa: { title: 'Hỏa Minh Mộc Tráng', sub: 'Công Nghệ Cao · AI · Truyền Thông · Năng Lượng' },
  Thổ: { title: 'Thổ / Kim Tương Sinh', sub: 'Bất Động Sản Cao Cấp · Hạ Tầng · Xây Dựng' },
};

export default function SuNghiepPage() {
  const chart = useStoredChart();
  const { term } = useLocale();

  const data = useMemo(() => {
    if (!chart) return null;
    const ming = chart.palaces.find((p) => p.isMingGong) ?? chart.palaces[0];
    const quan = chart.palaces.find((p) => p.name.includes('官')) ?? ming;
    const tai = chart.palaces.find((p) => p.name.includes('财')) ?? ming;
    const majors = (p: Palace) => p.stars.filter((s) => s.type === 'major');
    const starsOf = (p: Palace) => majors(p).map((s) => term(s.name)).join(' · ') || 'Vô chính diệu';

    // Điểm 3 nguyên mẫu từ chính tinh Mệnh (x2) + Quan + Tài
    const raw = [0, 0, 0];
    const add = (p: Palace, w: number) => majors(p).forEach((s) => {
      const prof = STAR_PROFILE[s.name]; if (prof) prof.forEach((v, i) => { raw[i] += v * w; });
    });
    add(ming, 2); add(quan, 1.4); add(tai, 1);
    const max = Math.max(1, ...raw);
    const scores = raw.map((v) => Math.round(60 + (v / max) * 38)); // 60..98

    const banMenh = nayinOf(chart.birthInfo.origInput?.year ?? chart.birthInfo.year);
    const dungThan = hanhSinh(banMenh.hanh); // hành sinh ra bản mệnh = dụng thần nuôi dưỡng... đảo lại
    // Dụng thần thực: hành SINH bản mệnh (nuôi). hanhSinh(x) = x sinh ra; ta cần hành mà sinh ra banMenh:
    const nuoi = (['Mộc', 'Hỏa', 'Thổ', 'Kim', 'Thủy'] as NguHanh[]);
    const idx = nuoi.indexOf(banMenh.hanh);
    const dungThanReal = nuoi[(idx + 4) % 5]; // hành đứng trước = sinh ra bản mệnh

    // Xếp 4 khối ngành: ưu tiên dụng thần → bản mệnh → sinh xuất → còn lại
    const order: NguHanh[] = [];
    [dungThanReal, banMenh.hanh, dungThan, hanhSinh(banMenh.hanh)].forEach((h) => { if (!order.includes(h)) order.push(h); });
    (['Kim', 'Mộc', 'Thủy', 'Hỏa', 'Thổ'] as NguHanh[]).forEach((h) => { if (!order.includes(h)) order.push(h); });
    const compat = [99, 95, 91, 89];

    return {
      ming, quan, tai,
      mingStars: starsOf(ming), quanStars: starsOf(quan), taiStars: starsOf(tai),
      scores, banMenh, dungThan: dungThanReal,
      industries: order.slice(0, 4).map((h, i) => ({ hanh: h, ...INDUSTRY[h], compat: compat[i] })),
    };
  }, [chart, term]);

  if (!chart || !data) {
    return (
      <div className="bg-background min-h-screen"><AppHeader active="su-nghiep" />
        <div className="pt-24 text-center text-on-surface-variant">Đang lập lá số…</div>
      </div>
    );
  }

  const bestArch = data.scores.indexOf(Math.max(...data.scores));
  const TRI = [
    { label: 'MỆNH CUNG', stars: data.mingStars, pos: 'top', branch: BRANCH_VI[data.ming.branch] },
    { label: 'QUAN LỘC', stars: data.quanStars, pos: 'left', branch: BRANCH_VI[data.quan.branch] },
    { label: 'TÀI BẠCH', stars: data.taiStars, pos: 'right', branch: BRANCH_VI[data.tai.branch] },
  ];

  return (
    <div className="bg-background font-body-md text-on-surface min-h-screen">
      <AppHeader active="su-nghiep" />
      <main className="w-full pt-16 md:pt-20 min-h-screen relative overflow-hidden">
        <div className="absolute -top-24 right-1/4 w-96 h-96 rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
        <div className="w-full max-w-[1280px] mx-auto px-margin-mobile md:px-space-lg lg:px-margin py-space-lg relative">
          <div className="flex flex-col gap-1 mb-space-lg">
            <span className="px-space-sm py-0.5 rounded-full bg-surface-container-high text-secondary font-label-esoteric text-label-esoteric uppercase tracking-wider w-fit">Khâm Thiên Tinh Đồ · Pháp Giám Ngự Thừa</span>
            <h1 className="font-headline-lg text-[26px] md:text-headline-lg text-primary tracking-tight uppercase">La Bàn Khởi Nghiệp • Định Vị Tinh Bàn</h1>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl">Ma trận sự nghiệp dựng từ Tam Hợp Tinh Đồ Mệnh – Quan – Tài của lá số bạn, cùng tứ đại khối ngành cát tường theo dụng thần ngũ hành.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
            {/* Tam giác vàng */}
            <section className="lg:col-span-7">
              <div className="rounded-2xl bg-surface-container/95 p-space-lg shadow-2xl relative overflow-hidden">
                <div className="flex items-center gap-space-xs mb-space-md">
                  <span className="material-symbols-outlined text-primary">change_history</span>
                  <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">Ma Trận Sự Nghiệp & Tam Giác Vàng</span>
                </div>
                <p className="font-body-sm text-[12px] text-on-surface-variant mb-space-md">Cơ Cấu Tam Hợp Tinh Đồ: Mệnh Cung · Quan Lộc · Tài Bạch — Dụng Thần: <span className="text-primary font-semibold">{data.dungThan}</span> sinh {data.banMenh.hanh}.</p>

                <div className="relative aspect-[4/3] max-w-[520px] mx-auto">
                  <svg viewBox="0 0 400 320" className="absolute inset-0 w-full h-full">
                    <polygon points="200,36 44,276 356,276" fill="none" stroke="#f2ca50" strokeWidth="1.5" strokeOpacity="0.5" strokeDasharray="6 5" />
                    <polygon points="200,80 110,240 290,240" fill="rgba(242,202,80,0.06)" stroke="#f2ca50" strokeWidth="0.8" strokeOpacity="0.3" />
                    <circle cx="200" cy="160" r="150" fill="none" stroke="#f2ca50" strokeOpacity="0.12" />
                  </svg>
                  {TRI.map((t) => {
                    const posCls = t.pos === 'top' ? 'left-1/2 -translate-x-1/2 top-0' : t.pos === 'left' ? 'left-0 bottom-0' : 'right-0 bottom-0';
                    return (
                      <div key={t.label} className={`absolute ${posCls} w-[44%] max-w-[190px]`}>
                        <div className="rounded-xl bg-surface-container-low/95 border border-primary/30 p-space-sm shadow-xl text-center">
                          <span className="font-label-esoteric text-[10px] text-secondary uppercase tracking-wider">{t.label}</span>
                          <p className="font-headline-sm text-[14px] text-primary font-bold leading-tight mt-0.5">{t.stars}</p>
                          <span className="font-body-sm text-[10px] text-on-surface-variant">Cung {t.branch}</span>
                        </div>
                      </div>
                    );
                  })}
                  <div className="absolute left-1/2 top-[54%] -translate-x-1/2 -translate-y-1/2 text-center">
                    <span className="material-symbols-outlined text-primary text-[34px]" style={{ fontVariationSettings: "'FILL' 1" }}>hub</span>
                    <p className="font-label-esoteric text-[10px] text-secondary uppercase">Tam Trụ Hợp Nhất</p>
                  </div>
                </div>

                <div className="mt-space-md flex items-center justify-center gap-space-md flex-wrap text-[11px]">
                  <span className="px-space-sm py-1 rounded-full bg-primary/10 text-primary font-semibold">Cách cục: Phủ Tướng Triều Viên</span>
                  <span className="px-space-sm py-1 rounded-full bg-tertiary/10 text-tertiary font-semibold">Cường độ khí: Cực Thịnh</span>
                </div>
              </div>
            </section>

            {/* 3 nguyên mẫu */}
            <aside className="lg:col-span-5 flex flex-col gap-space-md">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary">insights</span>
                <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">Chỉ Số Thiên Hướng Sự Nghiệp</span>
              </div>
              {ARCHETYPES.map((a) => {
                const score = data.scores[a.key];
                const best = a.key === bestArch;
                return (
                  <div key={a.key} className={`rounded-2xl p-space-md shadow-xl ${best ? 'bg-gradient-to-b from-primary-container/30 to-surface-container ring-2 ring-primary' : 'bg-surface-container-low/95'}`}>
                    <div className="flex items-center gap-space-sm mb-space-sm">
                      <span className={`w-10 h-10 rounded-xl flex items-center justify-center ${best ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-primary'}`}>
                        <span className="material-symbols-outlined text-[22px]">{a.icon}</span>
                      </span>
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="font-title-sm text-[14px] text-on-surface font-semibold">{a.label}</span>
                        <span className="font-body-sm text-[11px] text-on-surface-variant italic">{a.en}</span>
                      </div>
                      <span className="font-headline-md text-[22px] text-primary font-bold">{score}<span className="text-[11px] text-on-surface-variant">/100</span></span>
                    </div>
                    <div className="h-2 rounded-full bg-surface-container-lowest overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${score}%`, background: best ? '#f2ca50' : '#58e7aa' }} />
                    </div>
                  </div>
                );
              })}
            </aside>
          </div>

          {/* 4 khối ngành */}
          <div className="mt-space-lg">
            <div className="flex items-center gap-space-xs mb-space-md">
              <span className="material-symbols-outlined text-primary">workspace_premium</span>
              <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">Tứ Đại Khối Ngành Cát Tường Theo Dụng Thần</span>
              <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-surface-container-high text-secondary">Bản mệnh {data.banMenh.name}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
              {data.industries.map((ind, i) => {
                const col = HANH_COLOR[ind.hanh];
                return (
                  <div key={ind.hanh} className="rounded-2xl bg-surface-container-low/95 p-space-md shadow-xl flex flex-col relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full blur-2xl" style={{ background: `${col}22` }} />
                    <div className="flex items-center justify-between mb-space-sm relative">
                      <span className="font-headline-md text-[20px] font-bold" style={{ color: col }}>{String(i + 1).padStart(2, '0')}</span>
                      <span className="material-symbols-outlined text-[22px]" style={{ color: col }}>{HANH_ICON[ind.hanh]}</span>
                    </div>
                    <p className="font-title-sm text-[13px] font-semibold" style={{ color: col }}>{ind.title}</p>
                    <p className="font-body-sm text-[12px] text-on-surface-variant mt-1 flex-1">{ind.sub}</p>
                    <div className="mt-space-sm pt-space-sm border-t border-outline-variant/30">
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="text-on-surface-variant">Tương thích dụng thần</span>
                        <span className="font-bold" style={{ color: col }}>{ind.compat}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-surface-container-lowest overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${ind.compat}%`, background: col }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
