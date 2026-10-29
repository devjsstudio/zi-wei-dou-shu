'use client';
import { useMemo, useRef, useState } from 'react';
import AppHeader from '@/components/AppHeader';
import { useStoredChart } from '@/lib/useStoredChart';
import { useLocale } from '@/components/LocaleProvider';
import { BRANCHES, STEMS } from '@/lib/ziwei/constants';
import type { ZiweiChart } from '@/lib/ziwei/types';

type Ratio = 'story' | 'square' | 'landscape';
type Theme = 'gold' | 'emerald' | 'ruby';

const RATIOS: { key: Ratio; label: string; sub: string; aspect: string; badge: string }[] = [
  { key: 'story', label: '9:16', sub: 'Story / TikTok', aspect: '9 / 16', badge: '9:16 (Story / TikTok)' },
  { key: 'square', label: '1:1', sub: 'Instagram Feed', aspect: '1 / 1', badge: '1:1 (Instagram Feed)' },
  { key: 'landscape', label: '16:9', sub: 'Cover Banner', aspect: '16 / 9', badge: '16:9 (Cover Banner)' },
];

const THEMES: Record<Theme, { label: string; desc: string; from: string; via: string; to: string; accent: string }> = {
  gold: { label: 'Hoàng Gia Kim', desc: 'Quyền quý, đế vương', from: '#1c1f2a', via: '#262a35', to: '#0a0e18', accent: '#f2ca50' },
  emerald: { label: 'Thanh Huyền Thủy', desc: 'Trí tuệ, thanh tao', from: '#0a1a16', via: '#0f231d', to: '#0a0e18', accent: '#58e7aa' },
  ruby: { label: 'Hỏa Diệm', desc: 'Nhiệt huyết, đam mê', from: '#1f0e12', via: '#2a1016', to: '#0a0e18', accent: '#ff6b7a' },
};

/** Chỉ số vượng khí (0-100) suy từ độ sáng sao + cát/sát tinh. */
function vuongKhi(chart: ZiweiChart): number {
  let s = 62;
  for (const p of chart.palaces) {
    for (const star of p.stars) {
      if (star.type === 'major') {
        if (star.brightnessRaw === '庙' || star.brightnessRaw === '旺') s += 3;
        else if (star.brightnessRaw === '得' || star.brightnessRaw === '利') s += 1.5;
        else if (star.brightnessRaw === '陷') s -= 2;
      } else if (star.type === 'lucky') s += 0.8;
      else if (star.type === 'sha') s -= 0.6;
      if (star.siHua === '禄' || star.siHua === '科') s += 1.2;
      if (star.siHua === '忌') s -= 1;
    }
  }
  return Math.max(55, Math.min(99, Math.round(s)));
}

export default function ChiaSePage() {
  const chart = useStoredChart();
  const { term } = useLocale();
  const [ratio, setRatio] = useState<Ratio>('story');
  const [theme, setTheme] = useState<Theme>('gold');
  const [toast, setToast] = useState('');
  const cardRef = useRef<HTMLDivElement>(null);

  const data = useMemo(() => {
    if (!chart) return null;
    const ming = chart.palaces.find((p) => p.branch === chart.mingGongBranch);
    const majors = ming?.stars.filter((s) => s.type === 'major').map((s) => term(s.name)) ?? [];
    const menhCach = majors.length ? `Mệnh ${majors.join(' – ')} ${majors.length > 1 ? 'đồng cung' : 'thủ mệnh'}` : 'Mệnh Vô Chính Diệu';
    const score = vuongKhi(chart);
    const li = chart.lunarInfo;
    const bi = chart.birthInfo;
    const yearGz = `${term(STEMS[li.yearStem])} ${term(BRANCHES[li.yearBranch])}`;
    const tags = majors.slice(0, 3).map((s) => `#${s.replace(/\s/g, '')}`);
    return { menhCach, score, yearGz, majors, tags,
      name: bi.name || 'Đương Số',
      birth: `${String(bi.day).padStart(2, '0')}/${String(bi.month).padStart(2, '0')}/${bi.year} • Giờ ${term(BRANCHES[bi.hour])}`,
      nguHanh: term(chart.wuxingJuName),
      gender: chart.yinYangGender ? term(chart.yinYangGender) : '',
    };
  }, [chart, term]);

  const download = async () => {
    if (!cardRef.current) return;
    setToast('Đang kết xuất ảnh HD…');
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(cardRef.current, { scale: 3, backgroundColor: null, useCORS: true });
      const a = document.createElement('a');
      a.download = `thien-co-van-menh-${Date.now()}.png`;
      a.href = canvas.toDataURL('image/png');
      a.click();
      setToast('Đã tải ảnh HD! ✦');
    } catch {
      setToast('Không kết xuất được ảnh, thử lại sau.');
    }
    setTimeout(() => setToast(''), 2500);
  };

  const copyLink = async () => {
    try { await navigator.clipboard.writeText(window.location.origin); setToast('Đã sao chép liên kết!'); }
    catch { setToast('Không sao chép được liên kết.'); }
    setTimeout(() => setToast(''), 2000);
  };

  if (!chart || !data) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-space-md bg-background text-on-surface-variant">
        <span className="material-symbols-outlined text-primary text-[40px] animate-spin">progress_activity</span>
        <p className="font-body-md text-body-md">Đang chuyển về Trang Chủ để lập lá số…</p>
      </main>
    );
  }

  const th = THEMES[theme];
  const curRatio = RATIOS.find((r) => r.key === ratio)!;

  return (
    <div className="bg-background font-body-md text-on-surface min-h-screen selection:bg-primary selection:text-on-primary">
      <AppHeader active="chia-se" />
      <main className="w-full pt-16 md:pt-20 bg-background min-h-screen relative overflow-hidden">
        <div className="absolute -top-32 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[130px] pointer-events-none" />
        <div className="absolute top-1/3 -right-20 w-[420px] h-[420px] rounded-full bg-secondary-container/10 blur-[140px] pointer-events-none" />
        <div className="w-full max-w-[1280px] mx-auto px-margin-mobile md:px-space-lg lg:px-margin py-space-lg relative">
          <div className="flex flex-col gap-1 mb-space-lg">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
              <span className="font-label-esoteric text-label-esoteric text-primary tracking-widest uppercase">Khâm Thiên Giám • Độc Bản Khí Vận {new Date().getFullYear()}</span>
            </div>
            <h1 className="font-headline-lg text-[26px] md:text-headline-lg text-primary tracking-tight">Thiên Cơ Vận Mệnh Ký • Xuất Thẻ Chia Sẻ</h1>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl">Đóng gói chân mệnh Tử Vi thành tác phẩm nghệ thuật chuẩn tỷ lệ Story, Reels &amp; TikTok.</p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-xl items-start">
            {/* Thẻ */}
            <div className="xl:col-span-7 flex flex-col items-center">
              <div className="flex items-center justify-between w-full max-w-[420px] pb-space-sm">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary text-[18px]">visibility</span> Xem trước
                </span>
                <span className="flex items-center gap-1.5 bg-surface-container px-2.5 py-1 rounded-full text-secondary font-label-sm text-label-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary" />{curRatio.badge}
                </span>
              </div>
              <div className="relative w-full max-w-[420px]">
                <div className="absolute -inset-1 rounded-2xl blur-xl opacity-25" style={{ background: `linear-gradient(to bottom, ${th.accent}, ${th.accent}40)` }} />
                <div
                  ref={cardRef}
                  className="relative w-full rounded-xl overflow-hidden shadow-2xl flex flex-col justify-between p-6 select-none"
                  style={{ aspectRatio: curRatio.aspect, background: `radial-gradient(ellipse at top, ${th.via}, ${th.from} 60%, ${th.to})` }}
                >
                  {['top-3 left-3', 'top-3 right-3', 'bottom-3 left-3', 'bottom-3 right-3'].map((pos) => (
                    <span key={pos} className={`absolute ${pos} w-5 h-5 opacity-70`} style={{ color: th.accent }}>
                      <svg fill="currentColor" viewBox="0 0 24 24"><path d="M2 2h8v2H4v6H2V2zm20 0h-8v2h6v6h2V2zM2 22h8v-2H4v-6H2v8zm20 0h-8v-2h6v-6h2v8z" /></svg>
                    </span>
                  ))}
                  <div className="relative z-10 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="font-label-esoteric text-[10px] tracking-widest uppercase flex items-center gap-1.5" style={{ color: th.accent }}>
                        <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span> Thiên Cơ Vận Mệnh Ký
                      </span>
                      <span className="font-label-sm text-[10px] px-2 py-0.5 rounded-full" style={{ color: th.accent, background: `${th.accent}1a` }}>{new Date().getFullYear()} {data.yearGz}</span>
                    </div>
                    <div className="flex flex-col gap-0.5 pt-1">
                      <span className="font-label-esoteric text-[10px] text-on-surface-variant tracking-wider">ĐƯƠNG SỐ BẢN MỆNH</span>
                      <h2 className="font-headline-md text-[22px] font-bold" style={{ color: th.accent }}>{data.name}</h2>
                      <span className="flex items-center gap-1.5 text-on-surface-variant font-body-sm text-[12px]">
                        <span className="material-symbols-outlined text-[14px]" style={{ color: th.accent }}>calendar_month</span>{data.birth} · {data.gender}
                      </span>
                    </div>
                    <div className="bg-surface-container/70 backdrop-blur-md p-3 rounded-lg">
                      <div className="font-label-esoteric text-[10px] uppercase tracking-widest" style={{ color: th.accent }}>Đặc Cách Hoàng Gia</div>
                      <div className="font-title-sm text-[14px] text-on-surface pt-0.5 font-semibold leading-snug">{data.menhCach}</div>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {data.tags.map((t) => (
                        <span key={t} className="px-2.5 py-1 rounded-full bg-surface-container-high/80 font-label-sm text-[11px]" style={{ color: th.accent }}>{t}</span>
                      ))}
                    </div>
                  </div>

                  <div className="relative z-10 grid grid-cols-2 gap-2.5">
                    <div className="col-span-2 p-3.5 rounded-lg shadow-md flex items-center justify-between" style={{ background: `linear-gradient(to right, ${th.from}, ${th.via})` }}>
                      <div className="flex flex-col">
                        <span className="font-label-esoteric text-[10px] uppercase" style={{ color: th.accent }}>Chỉ Số Vượng Khí {new Date().getFullYear()}</span>
                        <span className="font-headline-lg text-[34px] font-bold leading-none pt-1" style={{ color: th.accent }}>{data.score}<span className="text-[14px] font-normal text-on-surface-variant">/100</span></span>
                        <span className="font-label-sm text-[11px] text-tertiary-fixed-dim pt-1 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">trending_up</span> {data.score >= 90 ? 'Top 1% Lá Số Đại Phú Quý' : data.score >= 80 ? 'Top 10% Vượng Cách' : 'Cách Cục Vững Vàng'}
                        </span>
                      </div>
                      <div className="w-16 h-16 relative flex items-center justify-center">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                          <path d="M18 2.08a15.9155 15.9155 0 0 1 0 31.83 15.9155 15.9155 0 0 1 0 -31.83" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3.5" />
                          <path d="M18 2.08a15.9155 15.9155 0 0 1 0 31.83 15.9155 15.9155 0 0 1 0 -31.83" fill="none" stroke={th.accent} strokeDasharray={`${data.score}, 100`} strokeLinecap="round" strokeWidth="3.5" />
                        </svg>
                        <span className="absolute material-symbols-outlined text-[22px]" style={{ color: th.accent, fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
                      </div>
                    </div>
                    <div className="bg-surface-container/60 p-3 rounded-lg flex flex-col gap-1">
                      <span className="font-label-esoteric text-[10px] uppercase flex items-center gap-1" style={{ color: th.accent }}><span className="material-symbols-outlined text-[14px]">water_drop</span> Ngũ Hành</span>
                      <span className="font-title-sm text-[13px] text-on-surface font-semibold">{data.nguHanh}</span>
                    </div>
                    <div className="bg-surface-container/60 p-3 rounded-lg flex flex-col gap-1">
                      <span className="font-label-esoteric text-[10px] uppercase flex items-center gap-1" style={{ color: th.accent }}><span className="material-symbols-outlined text-[14px]">hub</span> Chính Tinh</span>
                      <span className="font-title-sm text-[13px] text-on-surface font-semibold truncate">{data.majors.join(', ') || '—'}</span>
                    </div>
                  </div>
                  <div className="relative z-10 text-center font-label-esoteric text-[9px] text-on-surface-variant/70 tracking-widest uppercase pt-2">thiencotinhtuong.vn</div>
                </div>
              </div>
            </div>

            {/* Điều khiển */}
            <div className="xl:col-span-5 flex flex-col gap-space-lg">
              <div className="flex flex-col gap-space-sm">
                <label className="font-label-esoteric text-label-esoteric text-on-surface-variant uppercase tracking-wider">1. Tỉ Lệ Khung Hình</label>
                <div className="grid grid-cols-3 gap-space-sm">
                  {RATIOS.map((r) => (
                    <button key={r.key} type="button" onClick={() => setRatio(r.key)}
                      className={r.key === ratio
                        ? 'flex flex-col items-center justify-center p-3 rounded-lg bg-surface-container-high text-primary shadow-[0_0_15px_rgba(242,202,80,0.25)] transition-all'
                        : 'flex flex-col items-center justify-center p-3 rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container-high transition-all'}>
                      <span className="font-title-sm text-title-sm font-semibold">{r.label}</span>
                      <span className="font-label-sm text-[10px] text-on-surface-variant">{r.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-space-sm">
                <label className="font-label-esoteric text-label-esoteric text-on-surface-variant uppercase tracking-wider">2. Phong Cách Khí Vận (Aura Theme)</label>
                {(Object.keys(THEMES) as Theme[]).map((k) => {
                  const t = THEMES[k];
                  return (
                    <button key={k} type="button" onClick={() => setTheme(k)}
                      className={k === theme
                        ? 'w-full flex items-center justify-between p-3 rounded-lg bg-surface-container-high text-left shadow-sm transition-all ring-1 ring-primary/40'
                        : 'w-full flex items-center justify-between p-3 rounded-lg bg-surface-container-low text-left hover:bg-surface-container-high transition-all'}>
                      <div className="flex items-center gap-space-sm">
                        <span className="w-8 h-8 rounded-full shrink-0" style={{ background: `linear-gradient(135deg, ${t.accent}, ${t.via})` }} />
                        <span className="flex flex-col">
                          <span className="font-title-sm text-[14px] text-on-surface font-semibold">{t.label}</span>
                          <span className="font-body-sm text-[11px] text-on-surface-variant">{t.desc}</span>
                        </span>
                      </div>
                      {k === theme && <span className="material-symbols-outlined text-primary">check_circle</span>}
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-col gap-space-sm pt-space-sm">
                <button type="button" onClick={download} className="w-full py-4 px-6 rounded-full bg-gradient-to-r from-primary via-secondary to-primary-container text-on-primary font-title-sm text-title-sm font-bold shadow-[0_0_25px_rgba(242,202,80,0.45)] hover:shadow-[0_0_35px_rgba(242,202,80,0.65)] transition-all flex items-center justify-center gap-3">
                  <span className="material-symbols-outlined">download</span> Tải Ảnh HD 4K
                </button>
                <div className="grid grid-cols-2 gap-space-sm">
                  <button type="button" onClick={() => { setToast('Đang kết nối API Instagram & TikTok Story…'); setTimeout(() => setToast(''), 2200); }} className="py-3 px-4 rounded-full bg-surface-container-high hover:bg-surface-bright text-secondary font-label-md text-label-md flex items-center justify-center gap-2 transition-all">
                    <span className="material-symbols-outlined text-[18px]">share</span> Đăng Story / TikTok
                  </button>
                  <button type="button" onClick={copyLink} className="py-3 px-4 rounded-full bg-surface-container-high hover:bg-surface-bright text-on-surface font-label-md text-label-md flex items-center justify-center gap-2 transition-all">
                    <span className="material-symbols-outlined text-[18px]">link</span> Sao chép liên kết
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {toast && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-space-lg py-space-sm rounded-full bg-surface-container-highest text-on-surface shadow-2xl font-body-md text-body-md flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[18px]">auto_awesome</span>{toast}
          </div>
        )}
      </main>
    </div>
  );
}
