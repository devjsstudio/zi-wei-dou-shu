'use client';
import { useMemo, useState } from 'react';
import AppHeader from '@/components/AppHeader';
import { useStoredChart } from '@/lib/useStoredChart';
import { useLocale } from '@/components/LocaleProvider';
import { getYearStemIndex, buildSiHuaOverlay } from '@/components/TimeNav';
import { BRANCHES, STEMS } from '@/lib/ziwei/constants';
import type { ZiweiChart } from '@/lib/ziwei/types';

const JU_WX: Record<number, string> = { 2: 'Thủy', 3: 'Mộc', 4: 'Kim', 5: 'Thổ', 6: 'Hỏa' };
const SHENG: Record<string, string> = { 'Thủy': 'Mộc', 'Mộc': 'Hỏa', 'Hỏa': 'Thổ', 'Thổ': 'Kim', 'Kim': 'Thủy' };
const KE: Record<string, string> = { 'Thủy': 'Hỏa', 'Hỏa': 'Kim', 'Kim': 'Mộc', 'Mộc': 'Thổ', 'Thổ': 'Thủy' };
const WX_COLOR: Record<string, string> = { 'Thủy': '#38BDF8', 'Mộc': '#10B981', 'Kim': '#E2E8F0', 'Thổ': '#F59E0B', 'Hỏa': '#F43F5E' };
const HUA = { '禄': { l: 'Lộc', c: '#10B981' }, '权': { l: 'Quyền', c: '#38BDF8' }, '科': { l: 'Khoa', c: '#F59E0B' }, '忌': { l: 'Kỵ', c: '#F43F5E' } } as const;
const MONTH_VI = ['', 'Giêng', 'Hai', 'Ba', 'Tư', 'Năm', 'Sáu', 'Bảy', 'Tám', 'Chín', 'Mười', 'Mười Một', 'Chạp'];
const KEYWORDS = ['Đèn sách • Thi đậu', 'Lập thân • Quý nhân', 'Tích lũy sản nghiệp', 'Quyền bính cực đại', 'Hậu vận viên mãn', 'Chuyển hóa khai mở', 'Danh lợi song toàn', 'An định tề gia', 'Quảng giao đắc lực', 'Thu hoạch viên mãn', 'Tùy duyên an lạc', 'Di dưỡng thiên niên'];

function epochScore(stem: number, branch: number, startAge: number) {
  return Math.max(68, Math.min(97, 70 + ((branch * 7 + stem * 11 + startAge) % 28)));
}
function monthData(yearStem: number, m: number) {
  const branchIdx = (m + 1) % 12;
  const stemIdx = ((yearStem % 5) * 2 + 2 + (m - 1)) % 10;
  const score = 3 + ((branchIdx * 3 + stemIdx * 2) % 3);
  return { branch: BRANCHES[branchIdx], stem: STEMS[stemIdx], score };
}

export default function VanHanPage() {
  const chart = useStoredChart();
  const { term } = useLocale();
  const nowYear = new Date().getFullYear();

  const data = useMemo(() => {
    if (!chart) return null;
    const epochs = chart.daXians.map((dx) => ({
      ...dx,
      score: epochScore(dx.stemIndex ?? 0, dx.palaceBranch, dx.startAge),
      palaceVi: term(dx.palaceName),
      kw: KEYWORDS[dx.palaceBranch % 12],
    }));
    const wxA = JU_WX[chart.wuxingJu] || 'Thổ';
    const yStem = getYearStemIndex(nowYear);
    const yBranch = (nowYear - 4) % 12;
    const wxYear = JU_WX[[6, 4, 2, 3, 5][(yStem) % 5]] || 'Thủy'; // thô: can năm → ngũ hành (giáp ất mộc...)
    const overlay = buildSiHuaOverlay(yStem);
    const luu = Object.entries(overlay).map(([star, h]) => {
      const pal = chart.palaces.find((p) => p.stars.some((s) => s.name === star));
      return { star: term(star), h: h as keyof typeof HUA, palace: pal ? term(pal.name) : 'Đối cung' };
    });
    const months = Array.from({ length: 12 }, (_, i) => {
      const md = monthData(yStem, i + 1);
      return { m: i + 1, name: MONTH_VI[i + 1], branch: term(md.branch), stem: term(md.stem), score: md.score };
    });
    const relation = SHENG[wxA] === wxYear ? 'sinh-out' : SHENG[wxYear] === wxA ? 'sinh-in' : KE[wxA] === wxYear ? 'khac-out' : KE[wxYear] === wxA ? 'khac-in' : 'hoa';
    return { epochs, wxA, wxYear, yStem, yBranch, luu, months, relation,
      yearGz: `${term(STEMS[yStem])} ${term(BRANCHES[yBranch])}` };
  }, [chart, term, nowYear]);

  const [sel, setSel] = useState(0);

  if (!chart || !data) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-space-md bg-background text-on-surface-variant">
        <span className="material-symbols-outlined text-primary text-[40px] animate-spin">progress_activity</span>
        <p className="font-body-md text-body-md">Đang chuyển về Trang Chủ để lập lá số…</p>
      </main>
    );
  }

  const curIdx = chart.currentDaXianIndex >= 0 ? chart.currentDaXianIndex : 0;
  const selIdx = sel || curIdx;
  const ep = data.epochs;
  const n = ep.length;
  const X = (i: number) => 50 + (i / Math.max(1, n - 1)) * 900;
  const Y = (s: number) => 160 - ((s - 65) / 32) * 130;
  const pathD = ep.map((e, i) => `${i === 0 ? 'M' : 'L'} ${X(i).toFixed(0)} ${Y(e.score).toFixed(0)}`).join(' ');
  const areaD = `${pathD} L ${X(n - 1).toFixed(0)} 170 L ${X(0).toFixed(0)} 170 Z`;
  const e = ep[selIdx];
  const luuGood = data.luu.filter((x) => x.h !== '忌');
  const luuBad = data.luu.filter((x) => x.h === '忌');

  const radialOffset = data.relation.includes('sinh') ? 60 : data.relation.includes('khac') ? 150 : 100;
  const catPct = data.relation.includes('sinh') ? 82 : data.relation === 'hoa' ? 72 : 64;

  return (
    <div className="bg-background font-body-md text-on-surface min-h-screen selection:bg-primary selection:text-on-primary">
      <AppHeader active="van-han" />
      <main className="w-full pt-16 md:pt-20 bg-background min-h-screen relative">
        <div className="w-full max-w-[1280px] mx-auto px-margin-mobile md:px-space-lg lg:px-margin py-space-lg">
          {/* Banner */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-space-lg">
            <div className="flex flex-col gap-1">
              <span className="font-label-esoteric text-label-esoteric text-secondary tracking-widest uppercase">Thiên Vận Tuần Hoàn • {chart.birthInfo.name || 'Đương số'}</span>
              <h1 className="font-headline-lg text-[26px] md:text-headline-lg text-primary tracking-tight uppercase">Vận Hạn Tiểu Lưu & Đại Vận 10 Năm</h1>
            </div>
            <span className="px-space-md py-1.5 rounded-full bg-surface-container-high text-secondary font-label-sm text-label-sm self-start">Lưu Niên {nowYear} · {data.yearGz}</span>
          </div>

          {/* SECTION 2: Trendline + epochs */}
          <section className="mb-space-xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-md gap-space-sm">
              <div className="flex flex-col">
                <span className="font-label-esoteric text-label-esoteric text-secondary tracking-widest uppercase">Trường Cửu Mệnh Đồ</span>
                <h3 className="font-headline-md text-[20px] text-on-surface">Đại Vận Đời Người (10 Năm Một Giai Kỳ)</h3>
              </div>
              <div className="flex items-center gap-space-md font-label-sm text-label-sm text-on-surface-variant">
                <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-primary inline-block" /> Độ Vượng Khí Vận</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-secondary inline-block" /> Cung Đang Hành Vận</span>
              </div>
            </div>
            <div className="w-full bg-surface-container-low rounded-xl p-space-md lg:p-space-lg shadow-xl mb-space-md">
              <div className="h-44 w-full relative">
                <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 1000 180">
                  <defs>
                    <linearGradient id="trendGlow" x1="0%" x2="0%" y1="0%" y2="100%"><stop offset="0%" stopColor="#f2ca50" stopOpacity="0.35" /><stop offset="100%" stopColor="#f2ca50" stopOpacity="0" /></linearGradient>
                    <linearGradient id="strokeGold" x1="0%" x2="100%" y1="0%" y2="0%"><stop offset="0%" stopColor="#d0c5af" /><stop offset="40%" stopColor="#ffb95f" /><stop offset="70%" stopColor="#f2ca50" /><stop offset="100%" stopColor="#4edea3" /></linearGradient>
                  </defs>
                  {[30, 80, 130].map((y) => <line key={y} stroke="#313540" strokeDasharray="4 4" strokeWidth="1" x1="50" x2="950" y1={y} y2={y} />)}
                  <polygon fill="url(#trendGlow)" points={ep.map((x, i) => `${X(i).toFixed(0)},${Y(x.score).toFixed(0)}`).join(' ') + ` ${X(n - 1).toFixed(0)},170 ${X(0).toFixed(0)},170`} />
                  <path d={pathD} fill="none" stroke="url(#strokeGold)" strokeLinecap="round" strokeWidth="4" />
                  {ep.map((x, i) => {
                    const active = i === selIdx;
                    return (
                      <g key={i} className="cursor-pointer" onClick={() => setSel(i)}>
                        {active && <circle cx={X(i)} cy={Y(x.score)} fill="#f2ca50" r="14" className="opacity-25 animate-pulse" />}
                        <circle cx={X(i)} cy={Y(x.score)} r={active ? 8 : 6} fill={active ? '#0a0e18' : '#1c1f2a'} stroke={active ? '#f2ca50' : '#99907c'} strokeWidth={active ? 3 : 2} />
                        <circle cx={X(i)} cy={Y(x.score)} r="3" fill={active ? '#f2ca50' : '#d0c5af'} />
                        <text x={X(i)} y={Y(x.score) - 14} textAnchor="middle" fontSize="12" fontWeight={active ? 700 : 400} fill={active ? '#f2ca50' : '#d0c5af'}>{x.score}đ</text>
                      </g>
                    );
                  })}
                </svg>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-space-xs mt-space-sm">
                {ep.map((x, i) => {
                  const active = i === selIdx; const isCur = i === curIdx;
                  return (
                    <button key={i} type="button" onClick={() => setSel(i)}
                      className={active ? 'flex flex-col items-start p-space-sm rounded-lg bg-primary-container text-on-primary-container shadow-xl text-left' : 'flex flex-col items-start p-space-sm rounded-lg bg-surface-container hover:bg-surface-container-high transition-all text-left'}>
                      <div className="flex items-center justify-between w-full gap-1">
                        <span className={`font-label-esoteric text-[10px] uppercase ${active ? 'font-bold' : 'text-on-surface-variant'}`}>{x.startAge}-{x.endAge} Tuổi</span>
                        {isCur && <span className="text-[8px] px-1 rounded bg-on-primary-container text-primary font-bold">ĐANG HÀNH</span>}
                      </div>
                      <span className={`font-title-sm text-[13px] ${active ? 'font-bold' : 'text-on-surface'}`}>{x.palaceVi}</span>
                      <span className={`font-label-sm text-[10px] mt-0.5 ${active ? 'text-on-primary-fixed-variant' : 'text-outline'}`}>{x.kw}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Epoch detail */}
            <div className="w-full bg-surface-container p-space-lg rounded-xl shadow-2xl">
              <div className="flex items-center gap-space-sm flex-wrap mb-space-sm">
                <span className="px-space-sm py-1 rounded bg-primary text-on-primary font-label-md text-label-md font-bold">{e.startAge} - {e.endAge} TUỔI</span>
                <span className="font-headline-sm text-[16px] text-primary">Đại Vận {e.palaceVi} ({term(BRANCHES[e.palaceBranch])})</span>
                <span className="px-space-xs py-0.5 rounded bg-tertiary-container/30 text-tertiary font-label-sm text-label-sm">Điểm Cát: {e.score} / 100</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm">
                <div className="p-space-sm rounded bg-surface-container-low flex flex-col">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Sao Chủ Vận (Tứ Hóa)</span>
                  <span className="font-title-sm text-[13px] text-secondary">{e.siHua ? `${term(e.siHua.lu)} Lộc · ${term(e.siHua.quan)} Quyền` : '—'}</span>
                </div>
                <div className="p-space-sm rounded bg-surface-container-low flex flex-col">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Hạn Cần Phòng Tránh</span>
                  <span className="font-title-sm text-[13px] text-error">{e.siHua ? `${term(e.siHua.ji)} Hóa Kỵ` : '—'}</span>
                </div>
                <div className="p-space-sm rounded bg-surface-container-low flex flex-col">
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Cục Diện</span>
                  <span className="font-title-sm text-[13px] text-tertiary-fixed-dim">{e.score >= 88 ? 'Đại vận hưng thịnh' : e.score >= 78 ? 'Vận trình hanh thông' : 'Giai đoạn ổn định'}</span>
                </div>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mt-space-md">
                Đại vận {e.startAge}-{e.endAge} tuổi hành tại cung {e.palaceVi}. {e.score >= 88 ? 'Chư tinh hội tụ, tứ hóa dẫn cát — giai đoạn rực rỡ để khởi sự lớn và tích lũy thành quả.' : e.score >= 78 ? 'Vận khí vững vàng, thuận lợi phát triển bền vững, nên chủ động nắm bắt cơ hội.' : 'Vận trình bình hòa, nên giữ ổn định, bồi đắp nội lực và tránh biến động lớn.'}
              </p>
            </div>
          </section>

          {/* SECTION 3: Lưu niên */}
          <section className="mb-space-xl">
            <div className="flex items-center gap-space-xs mb-space-sm">
              <span className="w-2 h-2 rounded-full bg-secondary" />
              <h3 className="font-headline-md text-[20px] text-on-surface">Lưu Niên Chi Tiết Năm {nowYear} ({data.yearGz})</h3>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md">
              <div className="lg:col-span-8 bg-surface-container-low p-space-lg rounded-xl shadow-xl flex flex-col gap-space-md">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-space-sm">
                  {luuGood.slice(0, 2).map((x) => {
                    const info = HUA[x.h];
                    return (
                      <div key={x.star + x.h} className="p-space-md rounded-xl bg-surface-container flex flex-col gap-space-xs">
                        <span className="font-label-sm text-label-sm text-on-surface-variant font-bold uppercase">Lưu {info.l}</span>
                        <span className="font-headline-sm text-[16px]" style={{ color: info.c }}>{x.star} · Cung {x.palace}</span>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">Hóa {info.l} dẫn động cung {x.palace} — khí vận hanh thông, nên chủ động nắm bắt cơ hội.</p>
                      </div>
                    );
                  })}
                  {luuBad.slice(0, 1).map((x) => (
                    <div key={x.star + x.h} className="p-space-md rounded-xl bg-surface-container flex flex-col gap-space-xs">
                      <span className="font-label-sm text-label-sm text-on-surface-variant font-bold uppercase">Lưu Kỵ</span>
                      <span className="font-headline-sm text-[16px] text-error">{x.star} · Cung {x.palace}</span>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">Hóa Kỵ chiếu cung {x.palace} — dễ vướng mắc thị phi, cần thận trọng và nhẫn nại.</p>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col gap-space-xs pt-space-xs">
                  <span className="font-label-esoteric text-label-esoteric text-on-surface-variant uppercase">Lời Bàn Khâm Thiên Sư</span>
                  <p className="font-body-md text-body-md text-on-surface">Năm {nowYear} {data.yearGz} là niên hạn bản lề. {data.luu[0] ? `Sao ${data.luu[0].star} hóa ${HUA[data.luu[0].h].l} trợ lực cung ${data.luu[0].palace}.` : ''} Nên giữ cốt cách kiêm nhu, tránh vội vã, chủ động vun bồi quan hệ và tích lũy thực lực.</p>
                </div>
              </div>
              {/* Radial elemental */}
              <div className="lg:col-span-4 bg-surface-container-low p-space-lg rounded-xl shadow-xl flex flex-col justify-between">
                <div>
                  <span className="font-label-esoteric text-label-esoteric text-secondary uppercase">Đồ Hình Ngũ Hành Năm {nowYear}</span>
                  <h4 className="font-title-md text-title-md text-primary mt-1">Cân Bằng Sinh Khắc</h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-xs">Bản mệnh {data.wxA} đối ứng niên vận {data.wxYear} — {data.relation.includes('sinh') ? 'tương sinh vượng khí' : data.relation.includes('khac') ? 'tương khắc cần dung hòa' : 'đồng hành cộng hưởng'}.</p>
                </div>
                <div className="my-space-md flex items-center justify-center">
                  <div className="relative w-40 h-40 rounded-full bg-surface-container flex items-center justify-center shadow-inner">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" fill="transparent" r="40" stroke="#313540" strokeWidth="8" />
                      <circle cx="50" cy="50" fill="transparent" r="40" stroke={WX_COLOR[data.wxYear]} strokeDasharray="251.2" strokeDashoffset={radialOffset} strokeLinecap="round" strokeWidth="8" />
                      <circle cx="50" cy="50" fill="transparent" r="40" stroke={WX_COLOR[data.wxA]} strokeDasharray="251.2" strokeDashoffset={radialOffset + 85} strokeLinecap="round" strokeWidth="8" />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="font-label-sm text-[10px] text-on-surface-variant">VẬN THỊNH</span>
                      <span className="font-headline-sm text-[16px] text-primary font-bold">Cát {catPct}%</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-1 font-label-sm text-label-sm">
                  <div className="flex justify-between text-on-surface-variant"><span>{data.wxA} (Bản Mệnh)</span><span className="text-primary font-bold">Vượng</span></div>
                  <div className="flex justify-between text-on-surface-variant"><span>{data.wxYear} (Niên Vận)</span><span className="text-tertiary-fixed-dim font-bold">Đắc Khí</span></div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION 4: 12-month matrix */}
          <section>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-space-md gap-space-xs">
              <div>
                <span className="font-label-esoteric text-label-esoteric text-secondary tracking-wider uppercase">Nguyệt Lệnh Vận Số</span>
                <h3 className="font-headline-md text-[20px] text-on-surface">Bảng Ma Trận Vận Hạn 12 Tháng Âm Lịch ({nowYear})</h3>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-space-sm">
              {data.months.map((mo) => (
                <div key={mo.m} className="p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container transition-all flex flex-col justify-between shadow-md">
                  <div>
                    <div className="flex items-center justify-between mb-space-xs">
                      <span className="font-headline-sm text-[15px] text-primary">Tháng {mo.m} • {mo.name}</span>
                      <div className="flex text-secondary">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1", color: i < mo.score ? '#ffb95f' : 'rgba(255,255,255,0.18)' }}>star</span>
                        ))}
                      </div>
                    </div>
                    <span className="inline-block px-space-xs py-0.5 rounded bg-surface-container-highest text-on-surface font-label-esoteric text-[10px] mb-space-xs">Tháng {mo.stem} {mo.branch}</span>
                    <p className="font-body-sm text-body-sm text-on-surface">{mo.score >= 4 ? 'Vận khí hanh thông, thuận lợi khởi sự và đón lộc cát thần.' : 'Vận bình hòa, nên giữ ổn định và dưỡng sức chờ thời.'}</p>
                  </div>
                  <div className="mt-space-md pt-space-xs flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm">
                    <span className="text-tertiary">Điểm: {mo.score}.0 / 5</span>
                    <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
