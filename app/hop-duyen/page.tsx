'use client';
import { useMemo, useState } from 'react';
import AppHeader from '@/components/AppHeader';
import { useStoredChart } from '@/lib/useStoredChart';
import { useLocale } from '@/components/LocaleProvider';
import { generateChart } from '@/lib/ziwei/algorithm';
import { BRANCHES, STEMS } from '@/lib/ziwei/constants';
import type { BirthInfo, ZiweiChart } from '@/lib/ziwei/types';

const BRANCHES_VI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];
const JU_WX: Record<number, string> = { 2: 'Thủy', 3: 'Mộc', 4: 'Kim', 5: 'Thổ', 6: 'Hỏa' };
const WX_COLOR: Record<string, string> = { 'Thủy': '#38BDF8', 'Mộc': '#10B981', 'Kim': '#E2E8F0', 'Thổ': '#F59E0B', 'Hỏa': '#F43F5E' };
const SHENG: Record<string, string> = { 'Thủy': 'Mộc', 'Mộc': 'Hỏa', 'Hỏa': 'Thổ', 'Thổ': 'Kim', 'Kim': 'Thủy' };
const TAM_HOP = [[8, 0, 4], [11, 3, 7], [2, 6, 10], [5, 9, 1]];
const LUC_HOP: Record<number, number> = { 0: 1, 1: 0, 2: 11, 11: 2, 3: 10, 10: 3, 4: 9, 9: 4, 5: 8, 8: 5, 6: 7, 7: 6 };
const IMG_MALE = '/_assets/stitch/img02.png';
const IMG_FEMALE = '/_assets/stitch/img05.png';

function compat(a: ZiweiChart, b: ZiweiChart) {
  const wxA = JU_WX[a.wuxingJu] || 'Thổ';
  const wxB = JU_WX[b.wuxingJu] || 'Thổ';
  const bA = a.mingGongBranch, bB = b.mingGongBranch;
  let persona = 60; let branchTag = '';
  if (bA === bB) { persona = 82; branchTag = 'Đồng Cung Tị Hòa'; }
  else if (LUC_HOP[bA] === bB) { persona = 95; branchTag = 'Lục Hợp Nhân Duyên'; }
  else if (TAM_HOP.some((g) => g.includes(bA) && g.includes(bB))) { persona = 90; branchTag = 'Tam Hợp Thân Mệnh'; }
  else if ((bA + 6) % 12 === bB) { persona = 48; branchTag = 'Lục Xung Đối Chiếu'; }
  else { persona = 68; branchTag = 'Nhị Hợp Tương Giao'; }
  let element = 62; let wxTag = '';
  if (SHENG[wxA] === wxB || SHENG[wxB] === wxA) { element = 92; wxTag = 'Ngũ Hành Tương Sinh'; }
  else if (wxA === wxB) { element = 78; wxTag = 'Đồng Khí Liên Chi'; }
  else { element = 56; wxTag = 'Cần Dung Hòa Khắc'; }
  const phuA = a.palaces.find((p) => p.name.includes('夫妻'))?.stars.filter((s) => s.type === 'major').length ?? 0;
  const phuB = b.palaces.find((p) => p.name.includes('夫妻'))?.stars.filter((s) => s.type === 'major').length ?? 0;
  const destiny = 60 + Math.min(20, (phuA + phuB) * 6) + ((persona + element) % 11);
  const score = Math.round(Math.max(50, Math.min(98, persona * 0.38 + element * 0.34 + destiny * 0.28)));
  const verdict = score >= 88 ? 'Thiên Định Lương Duyên' : score >= 75 ? 'Lương Duyên Tốt Đẹp' : score >= 62 ? 'Hòa Hợp Cần Vun Đắp' : 'Cần Dung Hòa Nhiều';
  const sub = score >= 88 ? 'Đại Cát Thượng Cách • Tương Sinh Tương Lạc' : score >= 75 ? 'Cát Cách • Thuận Hòa Bền Lâu' : 'Trung Cách • Cần Thấu Hiểu';
  return {
    score, verdict, sub, wxA, wxB,
    stars: Math.round(score / 20),
    tags: [branchTag, wxTag, phuA + phuB >= 2 ? 'Quý Tinh Phò Trợ' : 'Tâm Giao Chân Thành'],
    dims: [
      { label: 'Hòa hợp tính cách', value: Math.round(persona), note: branchTag, color: '#f2ca50' },
      { label: 'Bổ trợ ngũ hành', value: Math.round(element), note: wxTag, color: '#58e7aa' },
      { label: 'Duyên phận phối hợp', value: Math.round(Math.min(98, destiny)), note: phuA + phuB >= 2 ? 'Cung Phu Thê vượng' : 'Cần chủ động vun đắp', color: '#ffb95f' },
    ],
  };
}

export default function HopDuyenPage() {
  const chartA = useStoredChart();
  const { term } = useLocale();
  const [mode, setMode] = useState<'phu-the' | 'doi-tac'>('phu-the');
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('female');
  const [day, setDay] = useState('20');
  const [month, setMonth] = useState('5');
  const [year, setYear] = useState('1992');
  const [hour, setHour] = useState(6);
  const [chartB, setChartB] = useState<ZiweiChart | null>(null);

  const person = useMemo(() => {
    const build = (c: ZiweiChart) => {
      const ming = c.palaces.find((p) => p.branch === c.mingGongBranch);
      const majors = ming?.stars.filter((s) => s.type === 'major').map((s) => term(s.name)) ?? [];
      const shen = c.palaces.find((p) => p.branch === c.shenGongBranch);
      const phu = c.palaces.find((p) => p.name.includes('夫妻'));
      const phuStars = phu?.stars.filter((s) => s.type === 'major').map((s) => term(s.name)) ?? [];
      return {
        name: c.birthInfo.name || 'Đương số',
        meta: `${c.yinYangGender ? term(c.yinYangGender) : (c.birthInfo.gender === 'male' ? 'Nam' : 'Nữ')} • ${term(STEMS[c.lunarInfo.yearStem])} ${term(BRANCHES[c.lunarInfo.yearBranch])} (${c.birthInfo.year})`,
        gender: c.birthInfo.gender,
        cungMenh: `Cung ${term(BRANCHES[c.mingGongBranch])}`,
        banMenh: term(c.wuxingJuName),
        cachCuc: majors.join(' ') || 'Vô Chính Diệu',
        thanCu: shen ? `Thân cư ${term(shen.name)}` : '—',
        phuThe: phuStars.join(' ') || 'Vô Chính Diệu',
        keynote: majors.length ? `Mệnh ${majors.join(' – ')} thủ cung ${term(BRANCHES[c.mingGongBranch])}, định hình cốt cách và phong thái của đương số.` : 'Mệnh vô chính diệu, mượn khí đối cung, uyển chuyển tùy duyên.',
      };
    };
    return { a: chartA ? build(chartA) : null, b: chartB ? build(chartB) : null };
  }, [chartA, chartB, term]);

  const result = useMemo(() => (chartA && chartB ? compat(chartA, chartB) : null), [chartA, chartB]);
  const years = Array.from({ length: 100 }, (_, i) => 2024 - i);
  const genB = () => setChartB(generateChart({ year: +year, month: +month, day: +day, hour, gender, name: name.trim() || undefined }));

  if (!chartA || !person.a) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-space-md bg-background text-on-surface-variant">
        <span className="material-symbols-outlined text-primary text-[40px] animate-spin">progress_activity</span>
        <p className="font-body-md text-body-md">Đang chuyển về Trang Chủ để lập lá số…</p>
      </main>
    );
  }
  const personLabel = mode === 'phu-the' ? 'Bạn đời' : 'Đối tác';

  const PersonCard = ({ p, idx, portrait }: { p: NonNullable<typeof person.a>; idx: number; portrait: string }) => (
    <div className="lg:col-span-4 flex flex-col gap-space-md p-space-lg rounded-xl bg-surface-container-low/90 shadow-xl transition-transform hover:-translate-y-1 duration-300">
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          <span className="font-label-esoteric text-label-esoteric text-secondary tracking-widest uppercase">{idx === 1 ? 'Chủ Khí • Đương Số 1' : `Phối Khí • Đương Số 2`}</span>
          <h3 className="font-headline-md text-[20px] text-primary font-bold mt-1">{p.name}</h3>
          <span className="font-label-md text-label-md text-on-surface-variant">{p.meta}</span>
        </div>
        <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center shadow-inner shrink-0">
          <span className="material-symbols-outlined text-primary text-[24px]">{p.gender === 'male' ? 'male' : 'female'}</span>
        </div>
      </div>
      <div className="w-full h-44 rounded-lg overflow-hidden relative shadow-md">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt={p.name} src={portrait} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-transparent" />
        <div className="absolute bottom-2 left-3 right-3 flex justify-between items-center">
          <span className="font-label-esoteric text-label-esoteric text-primary">Cung Mệnh: {p.cungMenh}</span>
          <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-surface-container-highest/80 text-secondary">{p.banMenh}</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-space-sm">
        {[['Bản Mệnh', p.banMenh, 'text-tertiary-fixed-dim'], ['Cách Cục Mệnh', p.cachCuc, 'text-primary'], ['Thân Cư', p.thanCu, 'text-secondary'], ['Cung Phu Thê', p.phuThe, 'text-on-surface']].map(([l, v, c]) => (
          <div key={l} className="p-space-sm rounded bg-surface-container-high/60 flex flex-col">
            <span className="font-label-sm text-label-sm text-on-surface-variant">{l}</span>
            <span className={`font-title-sm text-[13px] font-bold ${c}`}>{v}</span>
          </div>
        ))}
      </div>
      <p className="font-body-sm text-body-sm text-on-surface-variant italic bg-surface-container/40 p-space-sm rounded">&quot;{p.keynote}&quot;</p>
    </div>
  );

  return (
    <div className="bg-background font-body-md text-on-surface min-h-screen selection:bg-primary selection:text-on-primary">
      <AppHeader active="hop-duyen" />
      <main className="w-full pt-16 md:pt-20 bg-background min-h-screen relative overflow-hidden">
        <div className="absolute -top-24 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
        <div className="w-full max-w-[1280px] mx-auto px-margin-mobile md:px-space-lg lg:px-margin py-space-lg relative">
          <div className="flex flex-col items-center text-center gap-space-sm mb-space-lg">
            <span className="font-label-esoteric text-label-esoteric text-primary tracking-widest uppercase">✦ Khâm Thiên Giám Ngự Bút • Bát Tự Tương Hợp Chiêm Nghiệm ●</span>
            <h1 className="font-headline-lg text-[26px] md:text-headline-lg text-primary font-bold tracking-tight uppercase">Hợp Duyên Bách Niên & Đồng Minh Đối Tác</h1>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">Huyền cơ giải mã tương hợp đa chiều qua Thập Nhị Cung Vị, Bản Mệnh Ngũ Hành, Thiên Can Địa Chi và Cát Tinh quy tụ.</p>
            <div className="flex items-center gap-1 bg-surface-container-low rounded-full p-1 mt-space-sm">
              {([['phu-the', '♥ Lương Duyên Phu Thê (Tình Cảm)'], ['doi-tac', '◈ Minh Ước Đối Tác (Kinh Doanh / Sự Nghiệp)']] as const).map(([k, label]) => (
                <button key={k} type="button" onClick={() => setMode(k)}
                  className={mode === k ? 'px-space-md py-2 rounded-full font-label-md text-label-md bg-primary text-on-primary font-semibold whitespace-nowrap' : 'px-space-md py-2 rounded-full font-label-md text-label-md text-on-surface-variant hover:text-on-surface whitespace-nowrap'}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          <section className="relative rounded-2xl bg-surface-container/70 shadow-2xl p-space-md md:p-space-xl overflow-hidden backdrop-blur-xl">
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none rounded-tl-2xl" />
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-secondary/10 via-transparent to-transparent pointer-events-none rounded-br-2xl" />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-center relative z-10">
              <PersonCard p={person.a} idx={1} portrait={person.a.gender === 'male' ? IMG_MALE : IMG_FEMALE} />

              {/* Trung tâm */}
              <div className="lg:col-span-4 flex flex-col items-center justify-center py-space-md text-center">
                {result ? (
                  <>
                    <div className="relative w-52 h-52 flex items-center justify-center">
                      <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
                      <svg className="w-full h-full text-primary drop-shadow-[0_0_15px_rgba(242,202,80,0.5)]" viewBox="0 0 200 200">
                        <circle cx="100" cy="100" fill="none" opacity="0.4" r="94" stroke="currentColor" strokeDasharray="4 4" strokeWidth="1" />
                        <circle cx="100" cy="100" fill="none" opacity="0.6" r="86" stroke="currentColor" strokeWidth="1.5" />
                        <circle cx="100" cy="100" fill="none" opacity="0.3" r="76" stroke="currentColor" strokeWidth="0.5" />
                        <path d="M 100 24 A 76 76 0 0 1 100 176 A 38 38 0 0 1 100 100 A 38 38 0 0 0 100 24 Z" fill="currentColor" fillOpacity="0.15" />
                        <circle cx="100" cy="62" fill="currentColor" opacity="0.9" r="5" />
                        <circle cx="100" cy="138" fill="#0f131d" r="5" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="font-label-esoteric text-[9px] text-secondary tracking-widest uppercase">Chỉ Số Tương Hợp</span>
                        <div className="flex items-baseline gap-0.5">
                          <span className="font-headline-xl text-[42px] text-primary font-extrabold tracking-tighter">{result.score}</span>
                          <span className="font-headline-md text-secondary font-bold">%</span>
                        </div>
                        <div className="flex items-center gap-0.5 mt-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i} className="material-symbols-outlined text-[13px]" style={{ color: i < result.stars ? '#f2ca50' : 'rgba(255,255,255,0.2)', fontVariationSettings: "'FILL' 1" }}>star</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="mt-space-md py-space-sm px-space-lg rounded-full bg-gradient-to-r from-primary-container/30 via-primary/20 to-primary-container/30 shadow-lg flex flex-col items-center">
                      <span className="font-headline-sm text-[15px] text-primary font-bold tracking-wide uppercase">{result.verdict}</span>
                      <span className="font-label-sm text-label-sm text-secondary tracking-widest uppercase mt-0.5 text-center">{result.sub}</span>
                    </div>
                    <div className="flex flex-wrap justify-center gap-space-xs mt-space-md max-w-xs">
                      {result.tags.map((t, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-full bg-surface-container-high text-label-sm font-label-sm" style={{ color: ['#6ffbbe', '#f2ca50', '#ffb95f'][i] }}>{t}</span>
                      ))}
                    </div>
                    <button type="button" onClick={() => setChartB(null)} className="mt-space-md text-on-surface-variant font-label-md text-label-md hover:text-primary flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">refresh</span> Xem người khác
                    </button>
                  </>
                ) : (
                  <div className="rounded-2xl bg-surface-container-low/90 p-space-lg shadow-2xl w-full flex flex-col gap-space-sm">
                    <span className="font-headline-sm text-[16px] text-primary font-bold text-center mb-1">Nhập {personLabel}</span>
                    <input value={name} onChange={(e) => setName(e.target.value)} placeholder={`Tên ${personLabel.toLowerCase()}`}
                      className="h-11 px-space-md rounded-lg bg-surface-container-lowest text-on-surface font-title-sm text-title-sm placeholder:text-on-surface-variant/40 focus:outline-none focus:shadow-[0_0_0_2px_rgba(242,202,80,0.4)]" />
                    <div className="grid grid-cols-2 gap-space-sm">
                      {(['female', 'male'] as const).map((g) => (
                        <button key={g} type="button" onClick={() => setGender(g)}
                          className={gender === g ? 'py-2.5 rounded-lg bg-primary text-on-primary font-title-sm text-title-sm font-semibold' : 'py-2.5 rounded-lg bg-surface-container text-on-surface-variant font-title-sm text-title-sm'}>
                          {g === 'female' ? 'Nữ' : 'Nam'}
                        </button>
                      ))}
                    </div>
                    <div className="grid grid-cols-3 gap-space-sm">
                      <select value={day} onChange={(e) => setDay(e.target.value)} className="h-10 px-2 rounded-lg bg-surface-container-lowest text-on-surface text-title-sm">{Array.from({ length: 31 }, (_, i) => i + 1).map((n) => <option key={n} value={n}>Ngày {n}</option>)}</select>
                      <select value={month} onChange={(e) => setMonth(e.target.value)} className="h-10 px-2 rounded-lg bg-surface-container-lowest text-on-surface text-title-sm">{Array.from({ length: 12 }, (_, i) => i + 1).map((n) => <option key={n} value={n}>Tháng {n}</option>)}</select>
                      <select value={year} onChange={(e) => setYear(e.target.value)} className="h-10 px-2 rounded-lg bg-surface-container-lowest text-on-surface text-title-sm">{years.map((n) => <option key={n} value={n}>{n}</option>)}</select>
                    </div>
                    <select value={hour} onChange={(e) => setHour(+e.target.value)} className="h-10 px-2 rounded-lg bg-surface-container-lowest text-on-surface text-title-sm">{BRANCHES_VI.map((b, i) => <option key={b} value={i}>Giờ {b}</option>)}</select>
                    <button type="button" onClick={genB} className="mt-1 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-on-primary font-title-sm text-title-sm font-bold shadow-[0_0_20px_rgba(242,202,80,0.4)] flex items-center justify-center gap-2">
                      <span className="material-symbols-outlined">favorite</span> Xem Tương Hợp
                    </button>
                  </div>
                )}
              </div>

              {person.b ? (
                <PersonCard p={person.b} idx={2} portrait={person.b.gender === 'male' ? IMG_MALE : IMG_FEMALE} />
              ) : (
                <div className="lg:col-span-4 flex flex-col items-center justify-center gap-space-sm p-space-xl rounded-xl bg-surface-container-low/50 text-on-surface-variant/60 min-h-[320px]">
                  <span className="material-symbols-outlined text-[48px]">person_add</span>
                  <span className="font-body-md text-center">Nhập thông tin {personLabel.toLowerCase()} ở giữa để hiện lá số đối chiếu</span>
                </div>
              )}
            </div>
          </section>

          {result && (
            <section className="mt-space-xl">
              <h2 className="font-headline-md text-[20px] text-primary font-bold mb-space-md text-center">Phân Tích Tương Hợp Đa Chiều</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
                {result.dims.map((d) => (
                  <div key={d.label} className="rounded-2xl bg-surface-container/95 p-space-lg shadow-xl flex flex-col gap-space-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-title-sm text-title-sm text-on-surface font-semibold">{d.label}</span>
                      <span className="font-headline-sm text-[18px] font-bold" style={{ color: d.color }}>{d.value}</span>
                    </div>
                    <div className="h-2 rounded-full bg-surface-container-lowest overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${d.value}%`, background: d.color }} />
                    </div>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">{d.note}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
