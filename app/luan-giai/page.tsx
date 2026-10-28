'use client';
import { useState, useEffect, useRef } from 'react';
import AppHeader from '@/components/AppHeader';
import { useStoredChart } from '@/lib/useStoredChart';
import { aiHeaders } from '@/lib/ai/config';

interface Chapter { key: string; roman: string; title: string; icon: string; prompt: string; }

const CHAPTERS: Chapter[] = [
  { key: 'overview', roman: 'I', title: 'Tổng Quan Mệnh Cách', icon: 'account_circle',
    prompt: 'Luận giải tổng quan mệnh cách của lá số này: định tính chính tinh thủ Mệnh, cục diện tam phương tứ chính, cách cục nổi bật, và nét lớn của cuộc đời đương số.' },
  { key: 'personality', roman: 'II', title: 'Tính Cách & Nội Tâm', icon: 'psychology',
    prompt: 'Luận giải tính cách, khí chất, nội tâm và cung Phúc Đức của đương số: điểm mạnh, điểm yếu, xu hướng tâm lý và cách tu dưỡng.' },
  { key: 'love', roman: 'III', title: 'Tình Cảm & Hôn Nhân', icon: 'favorite',
    prompt: 'Luận giải tình cảm và hôn nhân qua cung Phu Thê: mẫu người bạn đời, chất lượng hôn nhân, thời điểm và lời khuyên về đường tình duyên.' },
  { key: 'career', roman: 'IV', title: 'Sự Nghiệp & Công Danh', icon: 'work',
    prompt: 'Luận giải sự nghiệp và công danh qua cung Quan Lộc và Mệnh: ngành nghề hợp, xu hướng thăng tiến, và lời khuyên phát triển sự nghiệp.' },
  { key: 'wealth', roman: 'V', title: 'Tài Vận & Phú Quý', icon: 'paid',
    prompt: 'Luận giải tài vận qua cung Tài Bạch và Điền Trạch: nguồn tài, cách kiếm và giữ tiền, bất động sản, và lời khuyên về tài chính.' },
  { key: 'health', roman: 'VI', title: 'Sức Khỏe & Tật Ách', icon: 'ecg_heart',
    prompt: 'Luận giải sức khỏe qua cung Tật Ách: thể trạng, bộ phận cần chú ý, xu hướng bệnh tật và lời khuyên dưỡng sinh.' },
];

/** Hiển thị văn bản AI: tiêu đề 【...】 vàng, **đậm**, đoạn văn. */
function BookContent({ text }: { text: string }) {
  if (!text) return null;
  const lines = text.split('\n');
  return (
    <div className="flex flex-col gap-space-md">
      {lines.map((raw, i) => {
        const line = raw.trim();
        if (!line) return null;
        const head = line.match(/^[【\[](.+?)[】\]]\s*$/);
        if (head) {
          return (
            <h3 key={i} className="font-headline-sm text-[18px] text-primary font-bold tracking-wide mt-space-sm flex items-center gap-2">
              <span className="w-1.5 h-5 rounded-full bg-gradient-to-b from-primary to-secondary inline-block" />
              {head[1]}
            </h3>
          );
        }
        const parts = line.split(/(\*\*[^*]+\*\*)/g);
        return (
          <p key={i} className="font-body-lg text-body-lg text-on-surface-variant leading-[1.9]">
            {parts.map((p, j) =>
              p.startsWith('**') && p.endsWith('**')
                ? <strong key={j} className="text-on-surface font-semibold">{p.slice(2, -2)}</strong>
                : p,
            )}
          </p>
        );
      })}
    </div>
  );
}

export default function LuanGiaiPage() {
  const chart = useStoredChart();
  const [active, setActive] = useState('overview');
  const [cache, setCache] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const loadingRef = useRef(false);

  const fetchChapter = async (ch: Chapter) => {
    if (loadingRef.current || cache[ch.key] !== undefined) return;
    loadingRef.current = true;
    setLoading(true);
    setCache((c) => ({ ...c, [ch.key]: '' }));
    try {
      const res = await fetch('/api/interpret', {
        method: 'POST',
        headers: aiHeaders(),
        body: JSON.stringify({ chart, messages: [{ role: 'user', content: ch.prompt }] }),
      });
      if (!res.ok || !res.body) throw new Error(res.status === 401 || res.status === 404 ? 'no-key' : 'failed');
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        for (const line of decoder.decode(value, { stream: true }).split('\n')) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6);
          if (data === '[DONE]') break;
          try { acc += JSON.parse(data).delta?.text ?? ''; setCache((c) => ({ ...c, [ch.key]: acc })); } catch { /* skip */ }
        }
      }
    } catch (e) {
      const missing = e instanceof Error && e.message === 'no-key';
      setCache((c) => ({ ...c, [ch.key]: missing
        ? 'Chưa cấu hình API key luận giải. Vào mục "Đại Sư AI & Tủ Lá Số" để thêm key DeepSeek.'
        : 'Luận giải thất bại, vui lòng thử lại sau.' }));
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  };

  useEffect(() => {
    if (chart) fetchChapter(CHAPTERS[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chart]);

  if (!chart) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-space-md bg-background text-on-surface-variant">
        <span className="material-symbols-outlined text-primary text-[40px] animate-spin">progress_activity</span>
        <p className="font-body-md text-body-md">Đang chuyển về Trang Chủ để lập lá số…</p>
      </main>
    );
  }

  const activeCh = CHAPTERS.find((c) => c.key === active)!;
  const content = cache[active];

  const selectChapter = (ch: Chapter) => { setActive(ch.key); fetchChapter(ch); };

  return (
    <div className="bg-background font-body-md text-on-surface min-h-screen selection:bg-primary selection:text-on-primary">
      <AppHeader active="luan-giai" />
      <main className="w-full pt-16 md:pt-20 bg-background min-h-screen">
        <div className="w-full max-w-[1280px] mx-auto px-margin-mobile md:px-space-lg lg:px-margin py-space-lg">
          <div className="flex flex-col gap-1 mb-space-lg">
            <span className="px-space-sm py-0.5 rounded-full bg-surface-container-high text-secondary font-label-esoteric text-label-esoteric uppercase tracking-wider w-fit">Khâm Thiên Mật Điển</span>
            <h1 className="font-headline-lg text-[28px] md:text-headline-lg text-primary tracking-tight">Sách Luận Giải Chi Tiết</h1>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl">
              Chân truyền luận giải lá số của {chart.birthInfo.name || 'đương số'} theo sáu chương: mệnh cách, tính cách, tình duyên, sự nghiệp, tài vận và sức khỏe.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
            {/* Mục lục */}
            <aside className="lg:col-span-4 2xl:col-span-3 lg:sticky lg:top-24">
              <div className="rounded-2xl bg-surface-container/95 p-space-md shadow-xl flex flex-col gap-1">
                <span className="font-label-esoteric text-label-esoteric text-primary uppercase tracking-widest px-space-sm py-space-xs">Mục Lục Chân Truyền</span>
                {CHAPTERS.map((ch) => (
                  <button
                    key={ch.key}
                    type="button"
                    onClick={() => selectChapter(ch)}
                    className={ch.key === active
                      ? 'flex items-center gap-space-sm px-space-sm py-space-sm rounded-xl bg-primary/15 text-primary text-left transition-all'
                      : 'flex items-center gap-space-sm px-space-sm py-space-sm rounded-xl text-on-surface-variant hover:bg-surface-container-high text-left transition-all'}
                  >
                    <span className="material-symbols-outlined text-[20px]">{ch.icon}</span>
                    <span className="flex flex-col">
                      <span className="font-label-sm text-[10px] opacity-70">CHƯƠNG {ch.roman}</span>
                      <span className="font-title-sm text-[14px] font-semibold">{ch.title}</span>
                    </span>
                  </button>
                ))}
              </div>
            </aside>

            {/* Nội dung chương */}
            <section className="lg:col-span-8 2xl:col-span-9 w-full">
              <div className="rounded-2xl bg-surface-container-low/90 p-space-lg md:p-space-xl shadow-2xl min-h-[60vh] relative overflow-hidden">
                {['top-3 left-3', 'top-3 right-3 rotate-90', 'bottom-3 left-3 -rotate-90', 'bottom-3 right-3 rotate-180'].map((pos) => (
                  <div key={pos} className={`absolute ${pos} w-8 h-8 pointer-events-none text-primary/30 flex items-center justify-center`}>
                    <svg className="w-full h-full fill-current" viewBox="0 0 32 32"><path d="M2 2h14v2H4v12H2V2zm4 4h8v2H8v6H6V6z" /></svg>
                  </div>
                ))}
                <div className="text-center mb-space-lg">
                  <span className="font-label-esoteric text-label-esoteric text-secondary uppercase tracking-[0.3em]">Chương {activeCh.roman}</span>
                  <h2 className="font-headline-xl text-[26px] md:text-[32px] text-primary font-bold mt-1">{activeCh.title}</h2>
                  <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mt-space-md" />
                </div>

                {content === undefined || (content === '' && loading) ? (
                  <div className="flex flex-col items-center justify-center py-space-xl gap-space-md text-on-surface-variant">
                    <span className="material-symbols-outlined text-primary text-[36px] animate-spin">progress_activity</span>
                    <p className="font-body-md animate-pulse">Đại sư đang luận giải chương này…</p>
                  </div>
                ) : (
                  <>
                    <BookContent text={content} />
                    {loading && <span className="inline-block w-2 h-4 bg-primary animate-pulse ml-1 align-middle" />}
                  </>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
