'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import AppHeader from '@/components/AppHeader';
import { TRIGRAMS, HEX, TOPICS, castLine, trigramIndex, type Hexagram } from '@/lib/iching';

interface Line { yang: boolean; moving: boolean; }
const HAO_NAMES = ['Sơ', 'Nhị', 'Tam', 'Tứ', 'Ngũ', 'Thượng'];

function hexOf(lines: Line[]): { hex: Hexagram; upper: number; lower: number } {
  const lower = trigramIndex(lines[0].yang ? 1 : 0, lines[1].yang ? 1 : 0, lines[2].yang ? 1 : 0);
  const upper = trigramIndex(lines[3].yang ? 1 : 0, lines[4].yang ? 1 : 0, lines[5].yang ? 1 : 0);
  return { hex: HEX[`${upper}${lower}`], upper, lower };
}

function HaoBar({ line, moving }: { line: Line; moving: boolean }) {
  return (
    <div className="flex items-center gap-space-sm">
      <div className="flex-1 flex items-center justify-center gap-1.5 h-4">
        {line.yang ? (
          <span className="h-[7px] w-full rounded-sm bg-primary" />
        ) : (
          <>
            <span className="h-[7px] flex-1 rounded-sm bg-primary/80" />
            <span className="h-[7px] flex-1 rounded-sm bg-primary/80" />
          </>
        )}
      </div>
      {moving && <span className="material-symbols-outlined text-secondary text-[14px] shrink-0" title="Hào động">change_circle</span>}
    </div>
  );
}

export default function GieoQuePage() {
  const [topic, setTopic] = useState(TOPICS[0].key);
  const [lines, setLines] = useState<Line[]>([]);
  const [casting, setCasting] = useState(false);

  const cast = () => {
    if (casting) return;
    setCasting(true); setLines([]);
    let i = 0;
    const next = () => {
      i++;
      setLines((prev) => [...prev, castLine()]);
      if (i < 6) setTimeout(next, 420); else setCasting(false);
    };
    setTimeout(next, 300);
  };

  const result = useMemo(() => {
    if (lines.length < 6) return null;
    const primary = hexOf(lines);
    const hasMoving = lines.some((l) => l.moving);
    const changedLines: Line[] = lines.map((l) => (l.moving ? { yang: !l.yang, moving: false } : l));
    const changed = hasMoving ? hexOf(changedLines) : null;
    return { primary, changed, hasMoving };
  }, [lines]);

  const progress = Math.round((lines.length / 6) * 100);
  const topicLabel = TOPICS.find((t) => t.key === topic)?.label ?? '';

  return (
    <div className="bg-background font-body-md text-on-surface min-h-screen">
      <AppHeader active="gieo-que" />
      <main className="w-full pt-16 md:pt-20 min-h-screen relative overflow-hidden">
        <div className="absolute -top-24 left-1/3 w-96 h-96 rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
        <div className="w-full max-w-[1180px] mx-auto px-margin-mobile md:px-space-lg lg:px-margin py-space-lg relative">
          <div className="flex flex-col gap-1 mb-space-lg">
            <span className="px-space-sm py-0.5 rounded-full bg-surface-container-high text-secondary font-label-esoteric text-label-esoteric uppercase tracking-wider w-fit">Chu Dịch Thần Khảo</span>
            <h1 className="font-headline-lg text-[26px] md:text-headline-lg text-primary tracking-tight uppercase">Gieo Quẻ Kinh Dịch • Lục Hào Vấn Sự</h1>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl">Nhất tâm khấn khảo điều muốn hỏi, gieo ba đồng xu sáu lần để thành quẻ. Quẻ chủ ứng hiện tại, quẻ biến chỉ hướng tương lai.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
            {/* Trái: tâm niệm + gieo */}
            <aside className="lg:col-span-5 flex flex-col gap-space-md">
              <div className="rounded-2xl bg-surface-container/95 p-space-lg shadow-xl">
                <div className="flex items-center gap-space-xs mb-space-sm">
                  <span className="material-symbols-outlined text-primary">edit_note</span>
                  <span className="font-title-sm text-[14px] text-on-surface font-semibold">Sự Vụ Thỉnh Linh Khảo</span>
                </div>
                <p className="font-body-sm text-[11px] text-on-surface-variant mb-space-md">Chọn tâm niệm cầu khảo trước khi gieo:</p>
                <div className="grid grid-cols-2 gap-space-sm">
                  {TOPICS.map((t) => {
                    const active = t.key === topic;
                    return (
                      <button key={t.key} type="button" onClick={() => setTopic(t.key)} disabled={casting}
                        className={`flex items-center gap-space-sm px-space-sm py-2.5 rounded-xl text-left border transition-all ${active ? 'bg-primary-container/80 text-on-primary-container border-transparent' : 'bg-surface-container text-on-surface border-outline-variant/30 hover:border-primary/40'}`}>
                        <span className={`material-symbols-outlined text-[20px] ${active ? '' : 'text-primary'}`}>{t.icon}</span>
                        <span className="font-title-sm text-[12px] font-semibold leading-tight">{t.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-2xl bg-gradient-to-b from-primary-container/20 to-surface-container p-space-lg shadow-xl flex flex-col items-center text-center">
                <div className="relative w-40 h-40 flex items-center justify-center mb-space-md">
                  <div className="absolute inset-0 rounded-full border border-primary/30" />
                  <div className={`absolute inset-3 rounded-full border border-primary/20 ${casting ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }} />
                  <div className="grid grid-cols-4 absolute inset-0">
                    {TRIGRAMS.map((t) => <span key={t.id} className="flex items-center justify-center text-primary/40 text-[14px]">{t.symbol}</span>)}
                  </div>
                  <div className="relative flex flex-col items-center">
                    <span className="material-symbols-outlined text-primary text-[40px]" style={{ fontVariationSettings: "'FILL' 1" }}>{casting ? 'hourglass_top' : 'casino'}</span>
                    <span className="font-label-esoteric text-[10px] text-secondary uppercase mt-1">{lines.length}/6 Hào</span>
                  </div>
                </div>
                <div className="w-full h-1.5 rounded-full bg-surface-container-lowest overflow-hidden mb-space-md">
                  <div className="h-full rounded-full bg-primary transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>
                <button type="button" onClick={cast} disabled={casting}
                  className="w-full py-3 rounded-full bg-primary text-on-primary font-label-md text-label-md font-bold shadow-lg hover:brightness-110 disabled:opacity-50 flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">{casting ? 'pending' : lines.length === 6 ? 'restart_alt' : 'casino'}</span>
                  {casting ? 'Đang gieo…' : lines.length === 6 ? 'Gieo lại quẻ khác' : 'Gieo Quẻ Lục Hào'}
                </button>
                <p className="font-body-sm text-[10px] text-on-surface-variant mt-space-sm">Ba đồng xu · Thuật toán ngẫu nhiên · Vấn: <span className="text-secondary">{topicLabel}</span></p>
              </div>
            </aside>

            {/* Phải: sơ đồ hào + kết quả */}
            <section className="lg:col-span-7 flex flex-col gap-space-md">
              <div className="rounded-2xl bg-surface-container/95 p-space-lg shadow-xl">
                <div className="flex items-center justify-between mb-space-md">
                  <div className="flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-primary">format_list_numbered</span>
                    <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">Sơ Đồ Lục Hào</span>
                  </div>
                  <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-primary/15 text-primary font-bold">Thành quẻ {progress}%</span>
                </div>
                <div className="flex flex-col gap-2.5">
                  {[5, 4, 3, 2, 1, 0].map((idx) => {
                    const line = lines[idx];
                    return (
                      <div key={idx} className="flex items-center gap-space-md">
                        <span className="font-label-sm text-[10px] text-on-surface-variant w-20 shrink-0">Hào {HAO_NAMES[idx]}</span>
                        <div className="flex-1">
                          {line ? <HaoBar line={line} moving={line.moving} /> : <div className="h-4 flex items-center"><span className="h-[7px] w-full rounded-sm bg-surface-container-high" /></div>}
                        </div>
                        <span className="w-24 text-right font-body-sm text-[10px] shrink-0" style={{ color: line ? (line.yang ? '#f2ca50' : '#8fb6ff') : 'var(--t-faint)' }}>
                          {line ? `${line.yang ? 'Dương' : 'Âm'}${line.moving ? ' động' : ''}` : 'Chờ gieo…'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {result && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                  <HexCard tag="Quẻ Chủ (Gốc)" tagIcon="stars" hex={result.primary.hex} upper={result.primary.upper} lower={result.primary.lower} highlight />
                  {result.changed ? (
                    <HexCard tag="Quẻ Biến (Tương Lai)" tagIcon="transform" hex={result.changed.hex} upper={result.changed.upper} lower={result.changed.lower} />
                  ) : (
                    <div className="rounded-2xl bg-surface-container-low/90 p-space-lg shadow-xl flex flex-col items-center justify-center text-center">
                      <span className="material-symbols-outlined text-tertiary text-[32px]">lock</span>
                      <p className="font-title-sm text-[13px] text-tertiary font-semibold mt-2">Tĩnh Quái – Không Hào Động</p>
                      <p className="font-body-sm text-[11px] text-on-surface-variant mt-1">Quẻ không biến: ứng nghiệm trọn vẹn theo lời đoán quẻ chủ, cục diện ổn định.</p>
                    </div>
                  )}
                </div>
              )}

              {result && (
                <div className="rounded-2xl bg-surface-container/95 p-space-lg shadow-xl">
                  <div className="flex items-center gap-space-xs mb-space-sm">
                    <span className="material-symbols-outlined text-primary">gavel</span>
                    <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">Khâm Thiên Giám Khảo Định</span>
                  </div>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-[1.8]">
                    Vấn <span className="text-secondary font-semibold">{topicLabel}</span>: quẻ <span className="text-primary font-semibold">{result.primary.hex.name}</span> — {result.primary.hex.y}
                    {result.changed && <> Có hào động biến sang <span className="text-primary font-semibold">{result.changed.hex.name}</span>: {result.changed.hex.y} Cục diện đang chuyển, nên thuận biến mà hành.</>}
                  </p>
                  <Link href="/dai-su-ai" className="inline-flex items-center gap-2 mt-space-md px-space-md py-2 rounded-full bg-primary/15 text-primary font-label-md text-label-md font-bold border border-primary/30 hover:bg-primary/25">
                    <span className="material-symbols-outlined text-[18px]">smart_toy</span>Hỏi Sư Phụ AI luận sâu
                  </Link>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

function HexCard({ tag, tagIcon, hex, upper, lower, highlight }: { tag: string; tagIcon: string; hex: Hexagram; upper: number; lower: number; highlight?: boolean }) {
  const U = TRIGRAMS[upper], L = TRIGRAMS[lower];
  return (
    <div className={`rounded-2xl p-space-lg shadow-xl ${highlight ? 'bg-gradient-to-b from-primary-container/30 to-surface-container ring-2 ring-primary/60' : 'bg-surface-container-low/95'}`}>
      <span className="font-label-esoteric text-label-esoteric text-secondary uppercase flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px]">{tagIcon}</span>{tag}</span>
      <div className="flex items-center gap-space-md mt-space-sm">
        <div className="flex flex-col items-center leading-none">
          <span className="text-primary text-[30px]">{U.symbol}</span>
          <span className="text-primary text-[30px]">{L.symbol}</span>
        </div>
        <div className="min-w-0">
          <p className="font-headline-md text-[20px] text-primary font-bold leading-tight">{hex.name}</p>
          <span className="font-body-sm text-[11px] text-on-surface-variant">Quẻ số {hex.num}/64 · Thượng {U.name} ({U.element}) · Hạ {L.name} ({L.element})</span>
        </div>
      </div>
      <p className="font-body-md text-body-md text-on-surface-variant leading-[1.75] mt-space-sm">{hex.y}</p>
    </div>
  );
}
