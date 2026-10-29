'use client';
import { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import AppHeader from '@/components/AppHeader';
import AiSettingsModal from '@/components/AiSettingsModal';
import { useStoredChart, BIRTH_STORAGE_KEY } from '@/lib/useStoredChart';
import { useLocale } from '@/components/LocaleProvider';
import { aiHeaders } from '@/lib/ai/config';
import { BRANCHES } from '@/lib/ziwei/constants';
import type { BirthInfo } from '@/lib/ziwei/types';

const VAULT_KEY = 'ziwei-vault';
const BRANCHES_VI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];
const MASTER_IMG = '/_assets/stitch/img16.png';

interface VaultEntry { id: string; info: BirthInfo; savedAt: number; }
interface ChatMsg { role: 'user' | 'assistant'; content: string; }

function loadVault(): VaultEntry[] { try { return JSON.parse(localStorage.getItem(VAULT_KEY) || '[]'); } catch { return []; } }
function saveVault(v: VaultEntry[]) { try { localStorage.setItem(VAULT_KEY, JSON.stringify(v)); } catch { /* ignore */ } }

const SUGGESTIONS = ['Năm nay tôi có nên chuyển việc không?', 'Đường tình duyên của tôi thế nào?', 'Tài vận 5 năm tới ra sao?', 'Điểm mạnh lớn nhất của mệnh tôi là gì?'];

export default function DaiSuAiPage() {
  const router = useRouter();
  const chart = useStoredChart();
  const { term } = useLocale();
  const [vault, setVault] = useState<VaultEntry[]>([]);
  const [q, setQ] = useState('');
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const loadingRef = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setVault(loadVault()); }, []);
  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }); }, [messages]);

  const welcome = useMemo(() => {
    if (!chart) return '';
    const ming = chart.palaces.find((p) => p.branch === chart.mingGongBranch);
    const majors = ming?.stars.filter((s) => s.type === 'major').map((s) => term(s.name)) ?? [];
    return `Thiện tai, ${chart.birthInfo.name || 'đương số'}! Bần đạo đã khởi lập thiên bàn. Mệnh tọa cung ${term(BRANCHES[chart.mingGongBranch])} có ${majors.length ? majors.join(' – ') : 'cách vô chính diệu'}, cục ${term(chart.wuxingJuName)}. Hãy hỏi bần đạo bất cứ điều gì về vận mệnh, tình duyên, sự nghiệp hay tài lộc.`;
  }, [chart, term]);

  const saveCurrent = () => {
    if (!chart) return;
    const info = chart.birthInfo;
    if (vault.find((e) => e.info.year === info.year && e.info.month === info.month && e.info.day === info.day && e.info.hour === info.hour && e.info.gender === info.gender)) return;
    const next = [{ id: Date.now().toString(), info, savedAt: Date.now() }, ...vault].slice(0, 20);
    setVault(next); saveVault(next);
  };
  const loadEntry = (e: VaultEntry) => { try { sessionStorage.setItem(BIRTH_STORAGE_KEY, JSON.stringify(e.info)); } catch { /* ignore */ } router.push('/chart'); };
  const removeEntry = (id: string) => { const next = vault.filter((e) => e.id !== id); setVault(next); saveVault(next); };

  const send = async (text: string) => {
    if (!text.trim() || loadingRef.current || !chart) return;
    loadingRef.current = true; setLoading(true);
    const apiMessages = [...messages, { role: 'user' as const, content: text }];
    setMessages([...apiMessages, { role: 'assistant', content: '' }]); setInput('');
    try {
      const res = await fetch('/api/interpret', { method: 'POST', headers: aiHeaders(), body: JSON.stringify({ chart, messages: apiMessages }) });
      if (!res.ok || !res.body) throw new Error(res.status === 401 || res.status === 404 ? 'no-key' : 'failed');
      const reader = res.body.getReader(); const dec = new TextDecoder(); let acc = '';
      while (true) {
        const { done, value } = await reader.read(); if (done) break;
        for (const line of dec.decode(value, { stream: true }).split('\n')) {
          if (!line.startsWith('data: ')) continue; const dt = line.slice(6); if (dt === '[DONE]') break;
          try { acc += JSON.parse(dt).delta?.text ?? ''; setMessages((m) => { const u = [...m]; u[u.length - 1] = { role: 'assistant', content: acc }; return u; }); } catch { /* skip */ }
        }
      }
    } catch (e) {
      const missing = e instanceof Error && e.message === 'no-key';
      setMessages((m) => { const u = [...m]; u[u.length - 1] = { role: 'assistant', content: missing ? 'Chưa cấu hình API key. Bấm ⚙ để thêm key DeepSeek.' : 'Luận giải thất bại, thử lại sau.' }; return u; });
    } finally { setLoading(false); loadingRef.current = false; }
  };

  if (!chart) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-space-md bg-background text-on-surface-variant">
        <span className="material-symbols-outlined text-primary text-[40px] animate-spin">progress_activity</span>
        <p className="font-body-md text-body-md">Đang chuyển về Trang Chủ để lập lá số…</p>
      </main>
    );
  }

  const fmt = (info: BirthInfo) => `${String(info.day).padStart(2, '0')}/${String(info.month).padStart(2, '0')}/${info.year} · Giờ ${BRANCHES_VI[info.hour]} · ${info.gender === 'male' ? 'Nam' : 'Nữ'}`;
  const vaultShown = vault.filter((e) => !q.trim() || (e.info.name || '').toLowerCase().includes(q.trim().toLowerCase()));

  return (
    <div className="bg-background font-body-md text-on-surface min-h-screen selection:bg-primary selection:text-on-primary">
      <AppHeader active="dai-su-ai" />
      <main className="w-full pt-16 md:pt-20 bg-background min-h-screen">
        <div className="w-full max-w-[1280px] mx-auto px-margin-mobile md:px-space-lg lg:px-margin py-space-lg">
          <div className="flex flex-col gap-1 mb-space-lg">
            <span className="px-space-sm py-0.5 rounded-full bg-surface-container-high text-secondary font-label-esoteric text-label-esoteric uppercase tracking-wider w-fit">Huyền Không Chân Nhân</span>
            <h1 className="font-headline-lg text-[26px] md:text-headline-lg text-primary tracking-tight">Đại Sư AI &amp; Tủ Lá Số</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
            {/* Tủ lá số (5) */}
            <section className="lg:col-span-5 flex flex-col gap-space-md bg-surface-container-low/80 p-space-md lg:p-space-lg rounded-xl shadow-xl">
              <div className="flex items-center justify-between">
                <h2 className="font-headline-sm text-[16px] text-primary tracking-wide font-bold flex items-center gap-1.5"><span className="material-symbols-outlined text-[20px]">inventory_2</span> TỦ LÁ SỐ BẢO TÀNG</h2>
                <span className="font-label-sm text-label-sm text-on-surface-variant">{vault.length} lá số</span>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined text-on-surface-variant/50 text-[18px] absolute left-3 top-1/2 -translate-y-1/2">search</span>
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm danh tính trong tủ lá số…"
                  className="w-full pl-10 pr-space-md py-2.5 rounded-lg bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant/50 font-body-sm text-body-sm focus:outline-none focus:bg-surface-container-high transition-colors" />
              </div>
              <button type="button" onClick={saveCurrent} className="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-gradient-to-r from-primary-container to-primary text-on-primary font-label-md text-label-md font-semibold hover:shadow-[0_0_20px_rgba(242,202,80,0.4)] transition-all">
                <span className="material-symbols-outlined text-[18px]">bookmark_add</span> Lưu lá số hiện tại vào tủ
              </button>
              <div className="flex flex-col gap-space-xs max-h-[560px] overflow-y-auto no-scrollbar">
                {vaultShown.length === 0 && <p className="text-on-surface-variant font-body-sm text-body-sm text-center py-space-lg opacity-70">Chưa có lá số nào trong tủ.</p>}
                {vaultShown.map((e) => (
                  <div key={e.id} className="group flex items-center gap-space-sm p-space-sm rounded-xl bg-surface-container hover:bg-surface-container-high transition-all">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-on-primary font-bold font-serif shrink-0">{(e.info.name || 'VD').charAt(0)}</div>
                    <button type="button" onClick={() => loadEntry(e)} className="flex-1 min-w-0 text-left">
                      <span className="font-title-sm text-[14px] text-on-surface group-hover:text-primary font-bold truncate block">{e.info.name || 'Vô danh'}</span>
                      <span className="font-body-sm text-[11px] text-on-surface-variant truncate block">{fmt(e.info)}</span>
                    </button>
                    <button type="button" onClick={() => removeEntry(e.id)} title="Xóa" className="w-7 h-7 shrink-0 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-error hover:bg-error/10"><span className="material-symbols-outlined text-[16px]">delete</span></button>
                  </div>
                ))}
              </div>
            </section>

            {/* Đại Sư AI (7) */}
            <section className="lg:col-span-7 flex flex-col rounded-xl bg-surface-container-low/90 shadow-2xl min-h-[640px] overflow-hidden">
              {/* Master header */}
              <div className="flex items-center justify-between gap-space-md p-space-md bg-surface-container-lowest/60">
                <div className="flex items-center gap-space-md">
                  <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary via-secondary to-primary-container animate-spin opacity-40 blur-sm" style={{ animationDuration: '18s' }} />
                    <div className="relative w-14 h-14 rounded-full overflow-hidden bg-surface-container-lowest shadow-[0_0_16px_rgba(242,202,80,0.4)]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img alt="Đại Sư Huyền Không" src={MASTER_IMG} className="w-full h-full object-cover" />
                    </div>
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-tertiary shadow-[0_0_8px_rgba(88,231,170,0.8)]" />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-space-xs flex-wrap">
                      <h3 className="font-headline-sm text-[16px] text-primary font-bold">Đại Sư Huyền Không</h3>
                      <span className="px-2 py-0.5 rounded-full bg-primary-container text-on-primary-container font-label-sm text-[10px] font-semibold">Khâm Thiên Môn AI</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
                      <p className="font-label-esoteric text-[10px] text-on-surface-variant">Hội tụ 108 vì tinh tú cho <span className="text-secondary font-semibold">{chart.birthInfo.name || 'đương số'}</span></p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button type="button" onClick={() => setMessages([])} title="Làm mới đàm đạo" className="w-9 h-9 rounded-lg bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors"><span className="material-symbols-outlined text-[18px]">restart_alt</span></button>
                  <button type="button" onClick={() => setShowSettings(true)} title="Cấu hình AI" className="w-9 h-9 rounded-lg bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-primary transition-colors"><span className="material-symbols-outlined text-[18px]">settings</span></button>
                </div>
              </div>

              {/* Chat stream */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto px-space-lg py-space-md flex flex-col gap-space-md">
                {/* Welcome message */}
                <div className="flex items-start gap-space-sm max-w-[92%]">
                  <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-md"><span className="material-symbols-outlined text-[18px]">neurology</span></div>
                  <div className="flex flex-col gap-1.5">
                    <span className="font-label-md text-label-md text-primary font-semibold">Đại Sư Huyền Không</span>
                    <div className="p-space-md rounded-xl rounded-tl-none bg-surface-container text-on-surface shadow-md">
                      <p className="font-body-md text-body-md leading-relaxed">{welcome}</p>
                    </div>
                  </div>
                </div>

                {messages.length === 0 && (
                  <div className="flex flex-wrap gap-space-sm mt-space-sm">
                    {SUGGESTIONS.map((s) => (
                      <button key={s} type="button" onClick={() => send(s)} className="px-space-md py-2 rounded-full bg-surface-container text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-label-md text-label-md transition-all">{s}</button>
                    ))}
                  </div>
                )}

                {messages.map((msg, i) => msg.role === 'user' ? (
                  <div key={i} className="flex items-start gap-space-sm max-w-[85%] self-end flex-row-reverse">
                    <div className="w-8 h-8 rounded-full bg-surface-container-highest text-secondary flex items-center justify-center shrink-0"><span className="material-symbols-outlined text-[18px]">person</span></div>
                    <div className="p-space-md rounded-xl rounded-tr-none bg-primary/15 text-on-surface font-body-md text-body-md">{msg.content}</div>
                  </div>
                ) : (
                  <div key={i} className="flex items-start gap-space-sm max-w-[92%]">
                    <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-md"><span className="material-symbols-outlined text-[18px]">neurology</span></div>
                    <div className="p-space-md rounded-xl rounded-tl-none bg-surface-container text-on-surface-variant font-body-md text-body-md leading-[1.8] whitespace-pre-wrap">{msg.content || <span className="inline-block w-2 h-4 bg-primary animate-pulse align-middle" />}</div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className="p-space-md border-t border-outline-variant/30">
                <div className="flex items-center gap-space-sm bg-surface-container-lowest rounded-full pl-space-md pr-1 py-1">
                  <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); } }}
                    placeholder="Thỉnh giáo Đại Sư về vận mệnh, tình duyên, sự nghiệp…"
                    className="flex-1 bg-transparent outline-none text-on-surface font-body-md text-body-md placeholder:text-on-surface-variant/40 py-2" />
                  <button type="button" onClick={() => send(input)} disabled={loading || !input.trim()} className="w-10 h-10 shrink-0 rounded-full bg-gradient-to-tr from-primary-container to-primary text-on-primary flex items-center justify-center disabled:opacity-40 hover:shadow-[0_0_16px_rgba(242,202,80,0.4)] transition-all"><span className="material-symbols-outlined text-[20px]">{loading ? 'hourglass_top' : 'send'}</span></button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
      <AiSettingsModal open={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  );
}
