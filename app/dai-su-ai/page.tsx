'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import AppHeader from '@/components/AppHeader';
import AiSettingsModal from '@/components/AiSettingsModal';
import { useStoredChart } from '@/lib/useStoredChart';
import { BIRTH_STORAGE_KEY } from '@/lib/useStoredChart';
import { aiHeaders } from '@/lib/ai/config';
import type { BirthInfo } from '@/lib/ziwei/types';

const VAULT_KEY = 'ziwei-vault';
const BRANCHES_VI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];

interface VaultEntry { id: string; info: BirthInfo; savedAt: number; }
interface ChatMsg { role: 'user' | 'assistant'; content: string; }

function loadVault(): VaultEntry[] {
  try { return JSON.parse(localStorage.getItem(VAULT_KEY) || '[]'); } catch { return []; }
}
function saveVault(v: VaultEntry[]) {
  try { localStorage.setItem(VAULT_KEY, JSON.stringify(v)); } catch { /* ignore */ }
}

const SUGGESTIONS = [
  'Năm nay tôi có nên chuyển việc không?',
  'Đường tình duyên của tôi thế nào?',
  'Tài vận 5 năm tới ra sao?',
  'Điểm mạnh lớn nhất của mệnh tôi là gì?',
];

export default function DaiSuAiPage() {
  const router = useRouter();
  const chart = useStoredChart();
  const [vault, setVault] = useState<VaultEntry[]>([]);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const loadingRef = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setVault(loadVault()); }, []);
  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }); }, [messages]);

  const saveCurrent = () => {
    if (!chart) return;
    const info = chart.birthInfo;
    const dup = vault.find((e) =>
      e.info.year === info.year && e.info.month === info.month && e.info.day === info.day &&
      e.info.hour === info.hour && e.info.gender === info.gender);
    if (dup) return;
    const next = [{ id: Date.now().toString(), info, savedAt: Date.now() }, ...vault].slice(0, 20);
    setVault(next); saveVault(next);
  };

  const loadEntry = (e: VaultEntry) => {
    try { sessionStorage.setItem(BIRTH_STORAGE_KEY, JSON.stringify(e.info)); } catch { /* ignore */ }
    router.push('/chart');
  };

  const removeEntry = (id: string) => {
    const next = vault.filter((e) => e.id !== id);
    setVault(next); saveVault(next);
  };

  const send = async (text: string) => {
    if (!text.trim() || loadingRef.current || !chart) return;
    loadingRef.current = true;
    setLoading(true);
    const apiMessages = [...messages, { role: 'user' as const, content: text }];
    setMessages([...apiMessages, { role: 'assistant', content: '' }]);
    setInput('');
    try {
      const res = await fetch('/api/interpret', {
        method: 'POST',
        headers: aiHeaders(),
        body: JSON.stringify({ chart, messages: apiMessages }),
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
          try { acc += JSON.parse(data).delta?.text ?? ''; setMessages((m) => { const u = [...m]; u[u.length - 1] = { role: 'assistant', content: acc }; return u; }); } catch { /* skip */ }
        }
      }
    } catch (e) {
      const missing = e instanceof Error && e.message === 'no-key';
      setMessages((m) => { const u = [...m]; u[u.length - 1] = { role: 'assistant', content: missing ? 'Chưa cấu hình API key. Bấm nút ⚙ để thêm key DeepSeek.' : 'Luận giải thất bại, thử lại sau.' }; return u; });
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

  const fmt = (info: BirthInfo) =>
    `${String(info.day).padStart(2, '0')}/${String(info.month).padStart(2, '0')}/${info.year} · Giờ ${BRANCHES_VI[info.hour]} · ${info.gender === 'male' ? 'Nam' : 'Nữ'}`;

  return (
    <div className="bg-background font-body-md text-on-surface min-h-screen selection:bg-primary selection:text-on-primary">
      <AppHeader active="dai-su-ai" />
      <main className="w-full pt-16 md:pt-20 bg-background min-h-screen">
        <div className="w-full max-w-[1280px] mx-auto px-margin-mobile md:px-space-lg lg:px-margin py-space-lg">
          <div className="flex flex-col gap-1 mb-space-lg">
            <span className="px-space-sm py-0.5 rounded-full bg-surface-container-high text-secondary font-label-esoteric text-label-esoteric uppercase tracking-wider w-fit">Huyền Không Chân Nhân</span>
            <h1 className="font-headline-lg text-[28px] md:text-headline-lg text-primary tracking-tight">Đại Sư AI &amp; Tủ Lá Số</h1>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl">
              Đối thoại trực tiếp với Đại Sư Huyền Không AI về lá số, và lưu giữ các lá số đã lập trong tủ bảo tàng.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
            {/* Tủ lá số */}
            <aside className="lg:col-span-4 2xl:col-span-3">
              <div className="rounded-2xl bg-surface-container/95 p-space-md shadow-xl flex flex-col gap-space-sm">
                <div className="flex items-center justify-between">
                  <span className="font-headline-sm text-[16px] text-primary font-bold flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[20px]">inventory_2</span>
                    Tủ Lá Số Bảo Tàng
                  </span>
                </div>
                <button type="button" onClick={saveCurrent} className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-primary-container to-primary text-on-primary font-label-md text-label-md font-semibold hover:shadow-[0_0_20px_rgba(242,202,80,0.4)] transition-all">
                  <span className="material-symbols-outlined text-[18px]">bookmark_add</span>
                  Lưu lá số hiện tại
                </button>
                <div className="flex flex-col gap-space-xs mt-1">
                  {vault.length === 0 && (
                    <p className="text-on-surface-variant font-body-sm text-body-sm text-center py-space-md opacity-70">Chưa có lá số nào được lưu.</p>
                  )}
                  {vault.map((e) => (
                    <div key={e.id} className="group flex items-center gap-2 p-space-sm rounded-xl bg-surface-container-low/80 hover:bg-surface-container-high transition-all">
                      <button type="button" onClick={() => loadEntry(e)} className="flex-1 min-w-0 text-left">
                        <span className="font-title-sm text-[14px] text-on-surface group-hover:text-primary truncate block">{e.info.name || 'Vô danh'}</span>
                        <span className="font-body-sm text-[11px] text-on-surface-variant truncate block">{fmt(e.info)}</span>
                      </button>
                      <button type="button" onClick={() => removeEntry(e.id)} title="Xóa" className="w-7 h-7 shrink-0 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-error hover:bg-error/10">
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </aside>

            {/* Đại Sư AI chat */}
            <section className="lg:col-span-8 2xl:col-span-9 w-full">
              <div className="rounded-2xl bg-surface-container-low/90 shadow-2xl flex flex-col h-[calc(100vh-220px)] min-h-[520px] overflow-hidden">
                {/* header */}
                <div className="flex items-center justify-between gap-2 px-space-lg py-space-md border-b border-outline-variant/30">
                  <div className="flex items-center gap-space-sm">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary-container to-primary flex items-center justify-center text-on-primary">
                      <span className="material-symbols-outlined">auto_awesome</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-headline-sm text-[16px] text-primary font-bold">Đại Sư Huyền Không AI</span>
                      <span className="font-label-esoteric text-[10px] text-tertiary flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse" /> Trực tuyến · luận giải theo lá số
                      </span>
                    </div>
                  </div>
                  <button type="button" onClick={() => setShowSettings(true)} title="Cấu hình AI" className="w-9 h-9 rounded-full flex items-center justify-center text-primary border border-primary/30 bg-primary/5 hover:bg-primary/15 transition-all">
                    <span className="material-symbols-outlined text-[18px]">settings</span>
                  </button>
                </div>

                {/* messages */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto px-space-lg py-space-md flex flex-col gap-space-md">
                  {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center gap-space-md">
                      <span className="material-symbols-outlined text-primary/20 text-[56px]">forum</span>
                      <p className="font-body-md text-on-surface-variant max-w-sm">Hỏi Đại Sư bất cứ điều gì về lá số của {chart.birthInfo.name || 'bạn'}. Gợi ý:</p>
                      <div className="flex flex-wrap justify-center gap-space-sm max-w-lg">
                        {SUGGESTIONS.map((s) => (
                          <button key={s} type="button" onClick={() => send(s)} className="px-space-md py-2 rounded-full bg-surface-container text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface font-label-md text-label-md transition-all">
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {messages.map((msg, i) =>
                    msg.role === 'user' ? (
                      <div key={i} className="flex justify-end">
                        <div className="max-w-[85%] rounded-2xl rounded-tr-sm px-space-md py-space-sm bg-primary/15 text-on-surface font-body-md text-body-md">{msg.content}</div>
                      </div>
                    ) : (
                      <div key={i} className="flex justify-start">
                        <div className="max-w-[90%] rounded-2xl rounded-tl-sm px-space-md py-space-sm bg-surface-container text-on-surface-variant font-body-md text-body-md leading-[1.8] whitespace-pre-wrap">
                          {msg.content || <span className="inline-block w-2 h-4 bg-primary animate-pulse align-middle" />}
                        </div>
                      </div>
                    ),
                  )}
                </div>

                {/* input */}
                <div className="px-space-lg py-space-md border-t border-outline-variant/30">
                  <div className="flex items-center gap-space-sm bg-surface-container-lowest rounded-full pl-space-md pr-1 py-1">
                    <input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); } }}
                      placeholder="Hỏi Đại Sư về vận mệnh, tình duyên, sự nghiệp…"
                      className="flex-1 bg-transparent outline-none text-on-surface font-body-md text-body-md placeholder:text-on-surface-variant/40 py-2"
                    />
                    <button type="button" onClick={() => send(input)} disabled={loading || !input.trim()} className="w-10 h-10 shrink-0 rounded-full bg-gradient-to-tr from-primary-container to-primary text-on-primary flex items-center justify-center disabled:opacity-40 hover:shadow-[0_0_16px_rgba(242,202,80,0.4)] transition-all">
                      <span className="material-symbols-outlined text-[20px]">{loading ? 'hourglass_top' : 'send'}</span>
                    </button>
                  </div>
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
