'use client';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import AppHeader from '@/components/AppHeader';
import { useLocale } from '@/components/LocaleProvider';
import { generateChart } from '@/lib/ziwei/algorithm';
import type { BirthInfo, ZiweiChart } from '@/lib/ziwei/types';
import { BIRTH_STORAGE_KEY } from '@/lib/useStoredChart';
import { CANH_GIO, BRANCH_VI } from '@/lib/tools';

const STEPS = [
  { t: 'Biên độ giờ sinh', icon: 'schedule' },
  { t: 'Lục thân & Huynh đệ', icon: 'groups' },
  { t: 'Tướng mạo & Khí chất', icon: 'face' },
  { t: 'Niên biểu đại hạn', icon: 'timeline' },
  { t: 'Quyết định thiên bàn', icon: 'verified' },
];

// Câu hỏi khảo đính — mỗi câu nghiêng về giờ nào (trước / giữ / sau)
const SURVEY: { q: string; opts: { label: string; w: number }[] }[] = [
  { q: 'Bạn có hay thức giấc rất sớm, tinh thần minh mẫn lúc rạng sáng?', opts: [{ label: 'Rất đúng', w: -1 }, { label: 'Bình thường', w: 0 }, { label: 'Không, tôi ngủ muộn', w: 1 }] },
  { q: 'Anh chị em ruột trong nhà: bạn thiên về nhường nhịn hay dẫn dắt?', opts: [{ label: 'Hay dẫn dắt', w: 1 }, { label: 'Tùy việc', w: 0 }, { label: 'Hay nhường nhịn', w: -1 }] },
  { q: 'Tướng mạo bạn thường được nhận xét là?', opts: [{ label: 'Sắc sảo, cương nghị', w: 1 }, { label: 'Hài hòa', w: 0 }, { label: 'Hiền hòa, nhu mì', w: -1 }] },
  { q: 'Giai đoạn 25–34 tuổi, vận của bạn nghiêng về?', opts: [{ label: 'Bùng nổ sự nghiệp', w: 1 }, { label: 'Ổn định dần', w: 0 }, { label: 'Trầm lắng, tích lũy', w: -1 }] },
];

interface Candidate {
  hour: number;
  rel: 'trước' | 'khuyên' | 'sau';
  mingPalace: string;
  majorStars: string;
  ju: string;
  shenPalace: string;
  score: number;
}

export default function DinhGioPage() {
  const router = useRouter();
  const { term } = useLocale();
  const [birth, setBirth] = useState<BirthInfo | null>(null);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [chosen, setChosen] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(BIRTH_STORAGE_KEY);
      if (raw) { setBirth(JSON.parse(raw) as BirthInfo); return; }
    } catch { /* ignore */ }
    router.replace('/');
  }, [router]);

  const bias = useMemo(() => Object.values(answers).reduce((a, b) => a + b, 0), [answers]);

  const candidates = useMemo<Candidate[]>(() => {
    if (!birth) return [];
    const base = birth.hour;
    const offs: { o: number; rel: Candidate['rel'] }[] = [
      { o: -1, rel: 'trước' }, { o: 0, rel: 'khuyên' }, { o: 1, rel: 'sau' },
    ];
    return offs.map(({ o, rel }) => {
      const hour = (base + o + 12) % 12;
      let chart: ZiweiChart;
      try { chart = generateChart({ ...birth, hour }); } catch { return null as unknown as Candidate; }
      const ming = chart.palaces.find((p) => p.branch === chart.mingGongBranch);
      const shen = chart.palaces.find((p) => p.branch === chart.shenGongBranch);
      const majors = (ming?.stars || []).filter((s) => s.type === 'major').map((s) => term(s.name));
      // Điểm tương thích: giờ giữa (giờ đang lưu) + thiên hướng khảo sát
      const biasMatch = rel === 'khuyên' ? (4 - Math.abs(bias)) : (o === Math.sign(bias) && bias !== 0 ? 3 + Math.abs(bias) : 1);
      const base0 = rel === 'khuyên' ? 78 : 44;
      const score = Math.min(97, base0 + biasMatch * 3 + (majors.length > 0 ? 6 : 0));
      return {
        hour, rel,
        mingPalace: BRANCH_VI[chart.mingGongBranch] ?? '',
        majorStars: majors.length ? majors.join(' • ') : 'Vô chính diệu',
        ju: term(chart.wuxingJuName),
        shenPalace: term(shen?.name || ''),
        score,
      };
    }).filter(Boolean) as Candidate[];
  }, [birth, bias, term]);

  const best = useMemo(() => candidates.slice().sort((a, b) => b.score - a.score)[0], [candidates]);

  const confirm = (hour: number) => {
    if (!birth) return;
    try {
      sessionStorage.setItem(BIRTH_STORAGE_KEY, JSON.stringify({ ...birth, hour }));
      setChosen(hour); setSaved(true);
    } catch { /* ignore */ }
  };

  const answered = Object.keys(answers).length;

  return (
    <div className="bg-background font-body-md text-on-surface min-h-screen">
      <AppHeader active="dinh-gio" />
      <main className="w-full pt-16 md:pt-20 min-h-screen relative overflow-hidden">
        <div className="absolute -top-24 right-1/4 w-96 h-96 rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
        <div className="w-full max-w-[1180px] mx-auto px-margin-mobile md:px-space-lg lg:px-margin py-space-lg relative">
          {/* Tiêu đề */}
          <div className="flex flex-col gap-1 mb-space-lg">
            <span className="px-space-sm py-0.5 rounded-full bg-surface-container-high text-secondary font-label-esoteric text-label-esoteric uppercase tracking-wider w-fit">Pháp Điển Khảo Đính Thời Thần</span>
            <h1 className="font-headline-lg text-[26px] md:text-headline-lg text-primary tracking-tight uppercase">Khâm Định Thời Thần • Trắc Nghiệm Khảo Giờ Sinh</h1>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl">So khảo ba canh giờ liền kề bằng cách lập lại lá số thật cho từng giờ, kết hợp trắc nghiệm lục thân – tướng mạo – đại hạn để định chính xác thời thần.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
            {/* Tiến trình + khảo sát */}
            <aside className="lg:col-span-4 flex flex-col gap-space-md">
              <div className="rounded-2xl bg-surface-container/95 p-space-lg shadow-xl">
                <div className="flex items-center justify-between mb-space-md">
                  <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">Tiến Trình Khảo Đính</span>
                  <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-primary/15 text-primary font-bold">{Math.min(step + 1, 5)}/5</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  {STEPS.map((s, i) => {
                    const done = i < step || (i === 4 && saved);
                    const cur = i === step;
                    return (
                      <button key={i} type="button" onClick={() => setStep(i)}
                        className={`flex items-center gap-space-sm px-space-sm py-2 rounded-xl text-left transition-all ${cur ? 'bg-primary-container/80 text-on-primary-container' : 'hover:bg-surface-container-high text-on-surface-variant'}`}>
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[14px] shrink-0 ${done ? 'bg-tertiary text-on-tertiary' : cur ? 'bg-primary text-on-primary' : 'bg-surface-container-high'}`}>
                          <span className="material-symbols-outlined text-[15px]">{done ? 'check' : s.icon}</span>
                        </span>
                        <span className="flex flex-col">
                          <span className="font-label-sm text-[10px] uppercase opacity-70">Bước {i + 1}</span>
                          <span className="font-title-sm text-[13px] font-semibold">{s.t}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {step < 4 && (
                <div className="rounded-2xl bg-surface-container-low/90 p-space-lg shadow-xl">
                  <span className="font-label-esoteric text-label-esoteric text-secondary uppercase">Hạng mục khảo sát</span>
                  <p className="font-body-md text-body-md text-on-surface mt-1 mb-space-md">{SURVEY[step].q}</p>
                  <div className="flex flex-col gap-2">
                    {SURVEY[step].opts.map((o, oi) => (
                      <button key={oi} type="button"
                        onClick={() => { setAnswers((a) => ({ ...a, [step]: o.w })); if (step < 3) setStep(step + 1); else setStep(4); }}
                        className={`px-space-md py-2.5 rounded-xl text-left font-body-md text-body-md border transition-all ${answers[step] === o.w ? 'bg-primary-container/80 text-on-primary-container border-transparent' : 'bg-surface-container text-on-surface border-outline-variant/40 hover:border-primary/50'}`}>
                        {o.label}
                      </button>
                    ))}
                  </div>
                  <div className="mt-space-md text-[11px] text-on-surface-variant">Đã trả lời {answered}/4 · thiên hướng: {bias > 0 ? 'giờ muộn hơn' : bias < 0 ? 'giờ sớm hơn' : 'cân bằng'}</div>
                </div>
              )}
            </aside>

            {/* 3 ứng viên */}
            <section className="lg:col-span-8">
              <div className="flex items-center gap-space-xs mb-space-md">
                <span className="material-symbols-outlined text-primary">balance</span>
                <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">Tam Thời Ứng Viên Đang So Khảo</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
                {candidates.map((c) => {
                  const isBest = best && c.hour === best.hour;
                  const isChosen = chosen === c.hour;
                  return (
                    <div key={c.hour}
                      className={`rounded-2xl p-space-md flex flex-col shadow-xl relative overflow-hidden transition-all ${isBest ? 'bg-gradient-to-b from-primary-container/30 to-surface-container ring-2 ring-primary' : 'bg-surface-container-low/95'}`}>
                      {isBest && <div className="absolute top-0 right-0 px-2 py-0.5 bg-primary text-on-primary text-[9px] font-bold rounded-bl-lg">KHUYÊN DÙNG</div>}
                      <span className="font-label-esoteric text-label-esoteric text-secondary uppercase">Canh giờ liền {c.rel === 'khuyên' ? 'ứng mệnh' : c.rel}</span>
                      <span className="font-headline-sm text-[18px] text-primary font-bold mt-0.5">{CANH_GIO[c.hour].name}</span>
                      <span className="font-body-sm text-[11px] text-on-surface-variant mb-space-sm">{CANH_GIO[c.hour].range}</span>
                      <div className="flex flex-col gap-1.5 text-[12px] py-space-sm border-y border-outline-variant/30">
                        <Row k="Mệnh an tại" v={`Cung ${c.mingPalace}`} />
                        <Row k="Chính tinh" v={c.majorStars} />
                        <Row k="Cục số" v={c.ju} />
                        <Row k="Thân cư" v={c.shenPalace} />
                      </div>
                      <div className="mt-space-sm">
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="text-on-surface-variant">Độ tương thích</span>
                          <span className="font-bold" style={{ color: c.score >= 75 ? '#58e7aa' : c.score >= 55 ? '#f2ca50' : '#ffb95f' }}>{c.score}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-surface-container-lowest overflow-hidden">
                          <div className="h-full rounded-full transition-all" style={{ width: `${c.score}%`, background: c.score >= 75 ? '#58e7aa' : '#f2ca50' }} />
                        </div>
                      </div>
                      <button type="button" onClick={() => confirm(c.hour)}
                        className={`mt-space-md py-2 rounded-full font-label-md text-label-md font-bold transition-all ${isChosen ? 'bg-tertiary text-on-tertiary' : isBest ? 'bg-primary text-on-primary hover:brightness-110' : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'}`}>
                        {isChosen ? '✓ Đã chọn thiên bàn' : 'Chọn giờ này'}
                      </button>
                    </div>
                  );
                })}
              </div>

              {saved && (
                <div className="mt-space-lg rounded-2xl bg-tertiary/10 border border-tertiary/30 p-space-lg flex items-center gap-space-md">
                  <span className="material-symbols-outlined text-tertiary text-[32px]">verified</span>
                  <div className="flex-1">
                    <p className="font-title-sm text-[14px] text-tertiary font-semibold">Đã khâm định thời thần: {chosen !== null ? CANH_GIO[chosen].name : ''}</p>
                    <p className="font-body-sm text-[12px] text-on-surface-variant">Lá số của bạn đã được cập nhật theo giờ mới. Xem lại ở Bảng Lá Số.</p>
                  </div>
                  <a href="/chart" className="px-space-md py-2 rounded-full bg-primary text-on-primary font-label-md text-label-md font-bold whitespace-nowrap">Xem Lá Số →</a>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-start justify-between gap-2">
      <span className="text-on-surface-variant shrink-0">{k}</span>
      <span className="text-on-surface font-semibold text-right">{v}</span>
    </div>
  );
}
