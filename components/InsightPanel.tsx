'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ZiweiChart, Palace } from '@/lib/ziwei/types';
import type { TimeView } from './TimeNav';
import { useLocale } from './LocaleProvider';
import AiSettingsModal from './AiSettingsModal';
import { aiHeaders } from '@/lib/ai/config';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  hidden?: boolean; // không hiện bong bóng người dùng cho tin nhắn tự động / theo chủ đề
}

interface SelectedSiHua {
  starName: string;
  siHua: string;
  view: TimeView;
}

interface InsightPanelProps {
  chart: ZiweiChart;
  selectedPalace?: Palace | null;
  selectedSiHua?: SelectedSiHua | null;
}

const TOPICS = ['overview', 'love', 'career', 'wealth', 'health', 'personality'] as const;

const TOPIC_PROMPTS: Record<string, string> = {
  overview: `Hãy luận giải tổng quan mệnh cách, theo cấu trúc:

**【Định tính mệnh cách】**
Một câu khái quát cục diện cốt lõi và khí chất của mệnh chủ.

**【Luận chính tinh】**
Đặc tính cốt lõi của chính tinh cung Mệnh, theo quan điểm của Nghê Hải Hạ.

**【Tam phương tứ chính】**
Phân tích liên động ba cung Tài, Quan, Thiên và cục diện tổng thể.

**【Đại hạn hiện tại】**
Hướng vận của đại hạn hiện tại và điều đáng lưu ý nhất.

**【Ưu thế & lưu ý】**
Ưu thế bẩm sinh của lá số, cùng rủi ro hoặc bài học cần lưu ý.`,

  love: `Hãy phân tích sâu vận tình cảm – hôn nhân, theo cấu trúc:

**【Định tính tình cảm】**
Một câu định tính mệnh cách tình cảm.

**【Phân tích cung Phu Thê】**
Chính tinh, Tứ hóa cung Phu Thê và cách luận cụ thể theo hệ Nghê Hải Hạ.

**【Liên động tam phương】**
Ảnh hưởng của các cung liên quan tới tình cảm.

**【Vận tình cảm đại hạn hiện tại】**
Chiều hướng tình cảm 10 năm hiện tại và các mốc then chốt.

**【Lời khuyên thực tế】**
Lời khuyên tình cảm cụ thể, khả thi.`,

  career: `Hãy phân tích sâu vận sự nghiệp, theo cấu trúc:

**【Định tính sự nghiệp】**
Một câu định tính mệnh cách sự nghiệp, nên làm công hay nên khởi nghiệp.

**【Phân tích cung Quan Lộc】**
Chính tinh, Tứ hóa cung Quan Lộc và nhận định của thầy Nghê về cách phối trí này.

**【Liên động cung Tài Bạch】**
Quan hệ giữa tài vận và sự nghiệp, nguồn tài đến từ đâu.

**【Vận sự nghiệp đại hạn hiện tại】**
Chiều hướng sự nghiệp 10 năm hiện tại.

**【Lời khuyên thực tế】**
Hướng đi, ngành nghề và chiến lược phù hợp.`,

  wealth: `Hãy phân tích sâu tài vận, theo cấu trúc:

**【Định tính tài vận】**
Một câu định tính mô hình tài vận: tài chủ động hay tài thụ động.

**【Phân tích cung Tài Bạch】**
Chính tinh, Tứ hóa cung Tài Bạch, nguồn tài và cách tiền luân chuyển.

**【Cung Điền Trạch (kho tài)】**
Khả năng tích lũy và vận bất động sản.

**【Tài vận đại hạn hiện tại】**
Chiều hướng tài vận hiện tại và điều cần lưu ý.

**【Lời khuyên quản lý tài chính】**
Lời khuyên tài chính cụ thể.`,

  health: `Hãy phân tích vận sức khỏe, theo cấu trúc:

**【Chính tinh cung Tật Ách】**
Các sao ở cung Tật Ách và ý nghĩa về sức khỏe.

**【Rủi ro chính】**
Kết hợp lý thuyết Tý Ngọ lưu chú của Nghê Hải Hạ, phân tích nguy cơ sức khỏe và bộ phận cần chú ý.

**【Xu hướng sức khỏe theo đại hạn】**
Xu hướng sức khỏe hiện tại và giai đoạn then chốt.

**【Lời khuyên phòng ngừa】**
Điều cần lưu ý cụ thể và hướng dưỡng sinh.`,

  personality: `Hãy luận giải sâu về tính cách, theo cấu trúc:

**【Tính cách chính tinh cung Mệnh】**
Đặc tính cốt lõi của chính tinh cung Mệnh, theo quan điểm thầy Nghê.

**【Tổng hợp tính cách tam phương】**
Ảnh hưởng của ba cung Tài, Quan, Thiên tới tính cách, mô tả toàn cảnh.

**【Cách ứng xử, quan hệ】**
Cách tương tác với người khác, phong cách đối nhân xử thế.

**【Ưu thế & bài học đời người】**
Ưu thế bẩm sinh và bài học cần đối mặt.`,
};

// Chủ quản của từng cung — key bằng tên cung tiếng Việt (khớp output của term()).
const PALACE_ROLES: Record<string, string> = {
  'Mệnh': 'bản thân, tính cách, cục diện tiên thiên',
  'Huynh Đệ': 'quan hệ anh em, người hợp tác',
  'Phu Thê': 'quan hệ tình cảm, hôn nhân',
  'Tử Nữ': 'duyên con cái, cấp dưới',
  'Tài Bạch': 'nguồn tài, cách kiếm tiền',
  'Tật Ách': 'sức khỏe, tai nạn',
  'Thiên Di': 'cơ hội xuất ngoại, cục diện giao tiếp',
  'Nô Bộc': 'bạn bè, quý nhân, tiểu nhân',
  'Quan Lộc': 'thành tựu sự nghiệp, địa vị xã hội',
  'Điền Trạch': 'bất động sản, môi trường gia đình',
  'Phúc Đức': 'hưởng thụ tinh thần, phúc phận nội tâm',
  'Phụ Mẫu': 'quan hệ cha mẹ, văn thư khế ước',
};

/** Render AI markdown: **【Tiêu đề】** → tiêu đề vàng, **đậm** → strong */
function AiContent({ text, streaming }: { text: string; streaming?: boolean }) {
  const lines = text.split('\n');
  return (
    <div className="space-y-0.5" style={{ maxWidth: 820 }}>
      {lines.map((line, i) => {
        const sectionMatch = line.match(/^\*\*【(.+?)】\*\*$/);
        if (sectionMatch) {
          return (
            <div key={i} className="pt-3 pb-0.5 first:pt-0">
              <span className="text-[13px] font-semibold tracking-wide" style={{ color: 'var(--t-gold)' }}>
                【{sectionMatch[1]}】
              </span>
            </div>
          );
        }
        if (line.trim() === '') return <div key={i} className="h-1" />;
        const parts = line.split(/\*\*(.+?)\*\*/);
        return (
          <div key={i} className="text-[13.5px] leading-[1.75]" style={{ color: 'var(--t-text2)' }}>
            {parts.map((part, j) =>
              j % 2 === 0
                ? part
                : <strong key={j} className="font-medium" style={{ color: 'var(--t-text)' }}>{part}</strong>
            )}
          </div>
        );
      })}
      {streaming && (
        <span
          className="inline-block w-1.5 h-3 ml-0.5 animate-pulse rounded-sm align-middle"
          style={{ background: 'var(--t-gold)', opacity: 0.6 }}
        />
      )}
    </div>
  );
}

export default function InsightPanel({ chart, selectedPalace, selectedSiHua }: InsightPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTopic, setActiveTopic] = useState<string>('overview');
  const messagesRef = useRef<Message[]>([]); // bản luôn mới cho các closure
  const loadingRef = useRef(false);
  const autoLoaded = useRef(false);
  const lastPalaceBranch = useRef<number | undefined>(undefined);
  const lastSiHuaKey = useRef<string | undefined>(undefined);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { m, term } = useLocale();
  const [showSettings, setShowSettings] = useState(false);
  const roleOf = (n: string) => PALACE_ROLES[term(n)] ?? '';

  // Giữ các ref đồng bộ
  useEffect(() => { messagesRef.current = messages; }, [messages]);
  useEffect(() => { loadingRef.current = loading; }, [loading]);

  // Tự cuộn xuống cuối
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Tự sinh tổng quan mệnh cách khi mount
  useEffect(() => {
    if (autoLoaded.current) return;
    autoLoaded.current = true;
    sendMessage(TOPIC_PROMPTS.overview, true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Chèn phân tích cung khi chọn một cung
  useEffect(() => {
    if (!selectedPalace || selectedPalace.branch === lastPalaceBranch.current) return;
    lastPalaceBranch.current = selectedPalace.branch;

    const majorStars = selectedPalace.stars.filter(s => s.type === 'major');
    const role = roleOf(selectedPalace.name);
    const pName = term(selectedPalace.name);
    const starDesc = majorStars.length > 0
      ? majorStars.map(s => `${term(s.name)}${s.siHua ? ` hóa ${term(s.siHua)}` : ''}`).join(', ')
      : 'vô chính diệu (mượn cung đối)';

    const prompt = `Hãy phân tích trọng tâm cung 【${pName}】 (chủ quản: ${role}), chính tinh của cung là ${starDesc}, theo cấu trúc:

**【Định tính cung vị】**
Ý nghĩa của cung ${pName} trong lá số và nhận định tổng thể về cách phối trí sao này.

**【Luận chính tinh】**
Cách luận chính tinh tại cung này theo hệ Nghê Hải Hạ.

**【Liên động tam phương tứ chính】**
Ảnh hưởng của tam phương tứ chính tới cung này.

**【Lời khuyên thực tế】**
Lời khuyên cụ thể dựa trên cung này.`;

    sendMessage(prompt, true);
  }, [selectedPalace]); // eslint-disable-line react-hooks/exhaustive-deps

  // Chèn phân tích phi hóa tứ hóa
  useEffect(() => {
    if (!selectedSiHua) return;
    const key = `${selectedSiHua.starName}-${selectedSiHua.siHua}-${selectedSiHua.view}`;
    if (key === lastSiHuaKey.current) return;
    lastSiHuaKey.current = key;

    // Tìm cung chứa sao này
    const palaceOfStar = chart.palaces.find(p =>
      p.stars.some(s => s.name === selectedSiHua.starName)
    );
    const palaceName = palaceOfStar?.name ?? 'cung chưa rõ';
    const pName = term(palaceName);
    const starV = term(selectedSiHua.starName);
    const huaV = term(selectedSiHua.siHua);
    const viewLabel = selectedSiHua.view === 'daxian' ? 'đại hạn' : 'lưu niên';

    const prompt = `Hãy phân tích ảnh hưởng phi hóa của 【${starV} hóa ${huaV} (${viewLabel})】, theo cấu trúc:

**【Ý nghĩa cơ bản của hóa ${huaV}】**
Ý nghĩa cốt lõi của hóa ${huaV} theo hệ Nghê Hải Hạ, và ý nghĩa đặc biệt khi ${starV} hóa ${huaV}.

**【Ảnh hưởng tại cung rơi vào】**
${starV} hóa ${huaV} rơi vào cung 【${pName}】; lĩnh vực cung này chủ quản bị ảnh hưởng ra sao, thầy Nghê luận thế nào.

**【Đường phi hóa tam phương tứ chính】**
Sau khi hóa ${huaV} nhập cung ${pName}, ảnh hưởng liên động tới tam phương tứ chính (cung đối và hai cung tam hợp).

**【Ảnh hưởng vận hiện tại】**
Ở chiều thời gian ${viewLabel}, hóa ${huaV} này ảnh hưởng cụ thể thế nào tới vận gần đây của mệnh chủ.

**【Lời khuyên thực tế】**
Lời khuyên cụ thể, khả thi dựa trên tứ hóa này.`;

    sendMessage(prompt, true);
  }, [selectedSiHua]); // eslint-disable-line react-hooks/exhaustive-deps

  const streamResponse = async (apiMessages: { role: 'user' | 'assistant'; content: string }[]) => {
    try {
      const res = await fetch('/api/interpret', {
        method: 'POST',
        headers: aiHeaders(),
        body: JSON.stringify({ chart, messages: apiMessages }),
      });
      if (res.status === 401) throw new Error('api-missing');
      if (res.status === 404) throw new Error('api-missing');
      if (!res.ok) throw new Error('Yêu cầu thất bại');
      if (!res.body) throw new Error('Không có luồng phản hồi');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = '';

      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        for (const line of chunk.split('\n')) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6);
          if (data === '[DONE]') break;
          try {
            const delta = JSON.parse(data).delta?.text ?? '';
            assistantText += delta;
            setMessages(prev => {
              const updated = [...prev];
              updated[updated.length - 1] = { role: 'assistant', content: assistantText };
              return updated;
            });
          } catch { /* bỏ qua */ }
        }
      }
    } catch (e) {
      const missing = e instanceof Error && (e.message === 'api-missing' || e.message === 'no-key');
      setMessages(prev => [...prev, { role: 'assistant', content: missing ? m.insight.needKey : m.insight.failed }]);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  };

  const sendMessage = (text: string, hidden = false) => {
    if (!text.trim() || loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);

    const userMsg: Message = { role: 'user', content: text, hidden };
    // Chụp messages hiện tại qua ref (tránh closure cũ)
    const apiMessages = [...messagesRef.current, userMsg].map(m => ({
      role: m.role,
      content: m.content,
    }));

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    streamResponse(apiMessages);
  };

  const handleTopicClick = (topicKey: string) => {
    if (loadingRef.current) return;
    setActiveTopic(topicKey);
    sendMessage(TOPIC_PROMPTS[topicKey], true);
  };

  const handleSend = () => {
    sendMessage(input);
  };

  return (
    <div className="flex flex-col h-full rounded-xl overflow-hidden card-glass">

      {/* ── Nút chủ đề ── */}
      <div className="flex-shrink-0 flex items-center gap-1.5 px-2 pt-2.5 pb-2" style={{ borderBottom: '1px solid var(--t-border)' }}>
        <div className="grid grid-cols-6 gap-1 flex-1">
          {TOPICS.map(key => {
            const isActive = activeTopic === key;
            return (
              <button
                key={key}
                onClick={() => handleTopicClick(key)}
                disabled={loading}
                className="py-2 text-[12px] font-medium rounded-lg transition-all duration-150 disabled:opacity-40"
                style={{
                  background: isActive ? 'rgba(212,168,67,0.12)' : 'transparent',
                  border: `1px solid ${isActive ? 'rgba(212,168,67,0.3)' : 'var(--t-border)'}`,
                  color: isActive ? 'var(--t-gold)' : 'var(--t-faint)',
                }}
              >
                {m.insight.topics[key]}
              </button>
            );
          })}
        </div>
        <button
          onClick={() => setShowSettings(true)}
          title={m.insight.settings}
          aria-label={m.insight.settings}
          className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-lg text-[14px] transition-all"
          style={{ border: '1px solid var(--ac-bdr)', color: 'var(--ac)', background: 'var(--ac-bg)' }}
        >
          ⚙
        </button>
      </div>

      <AiSettingsModal open={showSettings} onClose={() => setShowSettings(false)} />

      {/* ── Tin nhắn ── */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-5 space-y-4 min-h-0">

        {/* Trạng thái chờ trước tin nhắn đầu tiên */}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-4xl mb-3" style={{ color: 'var(--t-gold)', opacity: 0.1 }}>✦</div>
            <p className="text-[10px] animate-pulse" style={{ color: 'var(--t-faint)' }}>{m.insight.loading}</p>
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg, i) => {
            if (msg.role === 'user' && msg.hidden) return null;

            if (msg.role === 'user') {
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-end"
                >
                  <div
                    className="max-w-[85%] rounded-xl px-3 py-2 text-[11px]"
                    style={{
                      background: 'rgba(212,168,67,0.08)',
                      border: '1px solid rgba(212,168,67,0.18)',
                      color: 'var(--t-gold)',
                    }}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              );
            }

            // Tin nhắn trợ lý
            const isLastMsg = i === messages.length - 1;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div
                  className="text-[9px] tracking-widest mb-2 flex items-center gap-1.5"
                  style={{ color: 'var(--t-faint)' }}
                >
                  <span style={{ color: 'var(--t-gold)', opacity: 0.4 }}>✦</span>
                  {m.insight.header}
                </div>
                <AiContent text={msg.content} streaming={loading && isLastMsg} />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* ── Ô nhập ── */}
      <div className="flex-shrink-0 px-3 pb-3 pt-2" style={{ borderTop: '1px solid var(--t-border)' }}>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder={m.insight.placeholder}
            disabled={loading}
            className="flex-1 rounded-lg px-3 py-2.5 text-[13px] focus:outline-none transition-colors"
            style={{
              background: 'var(--t-card)',
              border: '1px solid var(--t-border)',
              color: 'var(--t-text)',
            }}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="px-4 py-2.5 rounded-lg text-[13px] font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              background: 'rgba(212,168,67,0.15)',
              border: '1px solid rgba(212,168,67,0.25)',
              color: 'var(--t-gold)',
            }}
          >
            {loading ? '…' : m.insight.send}
          </button>
        </div>
      </div>

    </div>
  );
}
