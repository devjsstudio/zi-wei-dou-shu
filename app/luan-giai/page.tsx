'use client';
import { useState, useEffect, useMemo, useRef } from 'react';
import AppHeader from '@/components/AppHeader';
import { useStoredChart } from '@/lib/useStoredChart';
import { useLocale } from '@/components/LocaleProvider';
import { aiHeaders } from '@/lib/ai/config';
import { BRANCHES, STEMS } from '@/lib/ziwei/constants';
import type { Palace, ZiweiChart } from '@/lib/ziwei/types';

const ROLES = ['Mệnh', 'Huynh Đệ', 'Phu Thê', 'Tử Nữ', 'Tài Bạch', 'Tật Ách', 'Thiên Di', 'Nô Bộc', 'Quan Lộc', 'Điền Trạch', 'Phúc Đức', 'Phụ Mẫu'];
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

function palaceScore(p?: Palace): number {
  if (!p) return 60;
  let s = 62;
  for (const st of p.stars) {
    if (st.type === 'major') {
      if (st.brightnessRaw === '庙' || st.brightnessRaw === '旺') s += 9;
      else if (st.brightnessRaw === '得' || st.brightnessRaw === '利') s += 5;
      else if (st.brightnessRaw === '陷') s -= 6;
      else s += 3;
    } else if (st.type === 'lucky') s += 3;
    else if (st.type === 'sha') s -= 3;
    if (st.siHua === '禄' || st.siHua === '科') s += 4;
    if (st.siHua === '忌') s -= 4;
  }
  return Math.max(52, Math.min(98, s));
}

function BookContent({ text }: { text: string }) {
  if (!text) return null;
  return (
    <div className="flex flex-col gap-space-md">
      {text.split('\n').map((raw, i) => {
        const line = raw.trim();
        if (!line) return null;
        const md = line.match(/^#{1,4}\s+(.*)$/);
        const br = line.match(/^[【\[](.+?)[】\]][：:]?\s*$/);
        if (md || br) {
          const txt = (br ? br[1] : md![1]).replace(/^[【\[]+|[】\]：:]+$/g, '').replace(/\*\*/g, '').trim();
          return <h3 key={i} className="font-headline-sm text-[18px] text-primary font-bold tracking-wide mt-space-sm flex items-center gap-2"><span className="w-1.5 h-5 rounded-full bg-gradient-to-b from-primary to-secondary inline-block" />{txt}</h3>;
        }
        const parts = line.split(/(\*\*[^*]+\*\*)/g);
        return <p key={i} className="font-body-lg text-body-lg text-on-surface-variant leading-[1.9]">{parts.map((p, j) => p.startsWith('**') && p.endsWith('**') ? <strong key={j} className="text-on-surface font-semibold">{p.slice(2, -2)}</strong> : p)}</p>;
      })}
    </div>
  );
}

export default function LuanGiaiPage() {
  const chart = useStoredChart();
  const { term } = useLocale();
  const [active, setActive] = useState(0);
  const [cache, setCache] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);
  const loadingRef = useRef(false);

  const data = useMemo(() => {
    if (!chart) return null;
    const byRole = (role: string) => chart.palaces.find((p) => term(p.name) === role);
    const palaces = ROLES.map((r) => byRole(r)).filter(Boolean) as Palace[];
    const list = (palaces.length === 12 ? palaces : chart.palaces).map((p) => {
      const sc = palaceScore(p);
      return { p, role: term(p.name), score: sc, majors: p.stars.filter((s) => s.type === 'major').map((s) => term(s.name)) };
    });
    const trus = [
      { label: 'Công Danh & Sự Nghiệp', score: palaceScore(byRole('Quan Lộc')), color: '#f2ca50', note: 'Luận từ cung Quan Lộc và tam hợp Mệnh' },
      { label: 'Tài Lộc & Kinh Doanh', score: palaceScore(byRole('Tài Bạch')), color: '#ffb95f', note: 'Luận từ cung Tài Bạch và Điền Trạch' },
      { label: 'Tình Duyên & Gia Đạo', score: palaceScore(byRole('Phu Thê')), color: '#ff6b7a', note: 'Luận từ cung Phu Thê hội chiếu' },
      { label: 'Sức Khỏe & Thể Chất', score: palaceScore(byRole('Tật Ách')), color: '#58e7aa', note: 'Luận từ cung Tật Ách và bản mệnh' },
      { label: 'Phúc Đức & Quý Nhân', score: palaceScore(byRole('Phúc Đức')), color: '#e9c349', note: 'Luận từ cung Phúc Đức và âm đức' },
    ];
    const avg = Math.round(trus.reduce((a, b) => a + b.score, 0) / trus.length);
    return { list, trus, avg };
  }, [chart, term]);

  const fetchPalace = async (idx: number) => {
    if (!chart || !data || loadingRef.current || cache[idx] !== undefined) return;
    const item = data.list[idx];
    loadingRef.current = true; setLoading(true);
    setCache((c) => ({ ...c, [idx]: '' }));
    try {
      const prompt = `Luận giải chi tiết cung ${item.role} của lá số: các chính tinh và phụ tinh tọa thủ (${item.majors.join(', ') || 'vô chính diệu'}), ý nghĩa cát hung, tam phương tứ chính hội chiếu, và lời khuyên cụ thể cho đương số về lĩnh vực của cung này.`;
      const res = await fetch('/api/interpret', { method: 'POST', headers: aiHeaders(), body: JSON.stringify({ chart, messages: [{ role: 'user', content: prompt }] }) });
      if (!res.ok || !res.body) throw new Error(res.status === 401 || res.status === 404 ? 'no-key' : 'failed');
      const reader = res.body.getReader(); const dec = new TextDecoder(); let acc = '';
      while (true) {
        const { done, value } = await reader.read(); if (done) break;
        for (const line of dec.decode(value, { stream: true }).split('\n')) {
          if (!line.startsWith('data: ')) continue; const dt = line.slice(6); if (dt === '[DONE]') break;
          try { acc += JSON.parse(dt).delta?.text ?? ''; setCache((c) => ({ ...c, [idx]: acc })); } catch { /* skip */ }
        }
      }
    } catch (e) {
      const missing = e instanceof Error && e.message === 'no-key';
      setCache((c) => ({ ...c, [idx]: missing ? 'Chưa cấu hình API key luận giải. Vào "Đại Sư AI & Tủ Lá Số" để thêm key DeepSeek.' : 'Luận giải thất bại, thử lại sau.' }));
    } finally { setLoading(false); loadingRef.current = false; }
  };

  useEffect(() => { if (chart && data) fetchPalace(0); /* eslint-disable-next-line */ }, [chart, data]);

  if (!chart || !data) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-space-md bg-background text-on-surface-variant">
        <span className="material-symbols-outlined text-primary text-[40px] animate-spin">progress_activity</span>
        <p className="font-body-md text-body-md">Đang chuyển về Trang Chủ để lập lá số…</p>
      </main>
    );
  }

  const cur = data.list[active];
  const content = cache[active];
  const badge = (s: number) => s >= 90 ? 'CỰC VƯỢNG' : s >= 80 ? 'VƯỢNG' : s >= 68 ? 'BÌNH HÒA' : 'CẦN BỒI';

  return (
    <div className="bg-background font-body-md text-on-surface min-h-screen selection:bg-primary selection:text-on-primary">
      <AppHeader active="luan-giai" />
      <main className="w-full pt-16 md:pt-20 bg-background min-h-screen">
        <div className="w-full max-w-[1280px] mx-auto px-margin-mobile md:px-space-lg lg:px-margin py-space-lg">
          <div className="flex flex-col gap-1 mb-space-lg">
            <span className="px-space-sm py-0.5 rounded-full bg-surface-container-high text-secondary font-label-esoteric text-label-esoteric uppercase tracking-wider w-fit">Khâm Thiên Mật Điển</span>
            <h1 className="font-headline-lg text-[26px] md:text-headline-lg text-primary tracking-tight">Sách Luận Giải Chi Tiết</h1>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg items-start">
            {/* Cột trái */}
            <div className="xl:col-span-4 flex flex-col gap-space-lg xl:sticky xl:top-24">
              {/* Thẻ đương số */}
              <div className="bg-surface-container-low/90 p-space-lg rounded-xl shadow-xl flex items-center justify-between gap-space-md">
                <div className="flex flex-col min-w-0">
                  <span className="font-label-esoteric text-label-esoteric text-secondary uppercase">Đương Số Bản Mệnh</span>
                  <h2 className="font-headline-sm text-[17px] text-primary font-bold truncate">{chart.birthInfo.name || 'Đương số'}</h2>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">{term(chart.wuxingJuName)} · Mệnh cư {term(BRANCHES[chart.mingGongBranch])} · {term(STEMS[chart.lunarInfo.yearStem])} {term(BRANCHES[chart.lunarInfo.yearBranch])}</span>
                </div>
                <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-on-primary shrink-0 shadow-lg">
                  <span className="material-symbols-outlined text-[28px]">approval</span>
                </div>
              </div>

              {/* Ngũ Trụ */}
              <div className="bg-surface-container-low/90 p-space-lg rounded-xl shadow-xl flex flex-col gap-space-md">
                <div className="flex items-center justify-between">
                  <h3 className="font-title-md text-title-md text-primary font-bold flex items-center gap-1.5"><span className="material-symbols-outlined text-[20px]">stars</span> Ngũ Trụ Vận Mệnh</h3>
                  <span className="font-label-esoteric text-label-esoteric text-secondary bg-surface-container px-2 py-0.5 rounded">{data.avg >= 85 ? 'Thượng Cách' : data.avg >= 72 ? 'Trung Thượng' : 'Trung Cách'}</span>
                </div>
                <div className="flex flex-col gap-space-md">
                  {data.trus.map((t) => (
                    <div key={t.label} className="flex flex-col gap-1">
                      <div className="flex items-center justify-between font-label-md text-label-md">
                        <span className="text-on-surface flex items-center gap-1.5 font-medium"><span className="w-1.5 h-1.5 rounded-full" style={{ background: t.color }} />{t.label}</span>
                        <span className="font-bold" style={{ color: t.color }}>{t.score}<span className="text-on-surface-variant font-normal text-[11px]">/100</span></span>
                      </div>
                      <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${t.score}%`, background: t.color }} />
                      </div>
                      <span className="font-body-sm text-[11px] text-on-surface-variant italic">{t.note}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mục lục 12 cung */}
              <div className="bg-surface-container-low/90 p-space-lg rounded-xl shadow-xl flex flex-col gap-space-md">
                <div className="flex items-center justify-between">
                  <h3 className="font-title-md text-title-md text-on-surface font-bold flex items-center gap-1.5"><span className="material-symbols-outlined text-secondary text-[20px]">auto_stories</span> Mục Lục Thập Nhị Cung</h3>
                  <span className="font-label-esoteric text-label-esoteric text-on-surface-variant">{active + 1} / {data.list.length}</span>
                </div>
                <nav className="flex flex-col gap-1.5 max-h-[380px] overflow-y-auto pr-1 no-scrollbar">
                  {data.list.map((it, i) => (
                    <button key={i} type="button" onClick={() => { setActive(i); fetchPalace(i); }}
                      className={i === active ? 'flex items-center justify-between p-space-sm rounded-lg bg-surface-container-highest text-primary shadow-md' : 'flex items-center justify-between p-space-sm rounded-lg hover:bg-surface-container transition-colors text-on-surface-variant hover:text-on-surface'}>
                      <div className="flex items-center gap-space-sm min-w-0">
                        <span className="font-label-esoteric text-label-esoteric w-6 text-center">{ROMAN[i]}</span>
                        <span className="font-title-sm text-[13px] font-semibold truncate">Cung {it.role}</span>
                      </div>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold shrink-0" style={{ background: it.score >= 80 ? '#f2ca501a' : 'transparent', color: it.score >= 80 ? '#f2ca50' : '#99907c' }}>{badge(it.score)}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Cột phải: trang sách */}
            <section className="xl:col-span-8 w-full">
              <div className="rounded-2xl bg-surface-container-low/90 p-space-lg md:p-space-xl shadow-2xl min-h-[60vh] relative overflow-hidden">
                {['top-3 left-3', 'top-3 right-3 rotate-90', 'bottom-3 left-3 -rotate-90', 'bottom-3 right-3 rotate-180'].map((pos) => (
                  <div key={pos} className={`absolute ${pos} w-8 h-8 pointer-events-none text-primary/30 flex items-center justify-center`}><svg className="w-full h-full fill-current" viewBox="0 0 32 32"><path d="M2 2h14v2H4v12H2V2zm4 4h8v2H8v6H6V6z" /></svg></div>
                ))}
                <div className="text-center mb-space-lg">
                  <span className="font-label-esoteric text-label-esoteric text-secondary uppercase tracking-[0.3em]">Chương {ROMAN[active]} · Thập Nhị Cung</span>
                  <h2 className="font-headline-xl text-[26px] md:text-[32px] text-primary font-bold mt-1">Cung {cur.role}</h2>
                  <div className="flex items-center justify-center gap-space-sm mt-space-sm flex-wrap">
                    {cur.majors.length ? cur.majors.map((s) => <span key={s} className="px-2.5 py-1 rounded-full bg-primary/10 text-primary font-label-sm text-label-sm">{s}</span>) : <span className="px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm">Vô Chính Diệu</span>}
                  </div>
                  <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mt-space-md" />
                </div>
                {content === undefined || (content === '' && loading) ? (
                  <div className="flex flex-col items-center justify-center py-space-xl gap-space-md text-on-surface-variant">
                    <span className="material-symbols-outlined text-primary text-[36px] animate-spin">progress_activity</span>
                    <p className="font-body-md animate-pulse">Đại sư đang luận giải cung {cur.role}…</p>
                  </div>
                ) : (
                  <><BookContent text={content} />{loading && <span className="inline-block w-2 h-4 bg-primary animate-pulse ml-1 align-middle" />}</>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
