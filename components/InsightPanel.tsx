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
  hidden?: boolean; // don't show user bubble for auto/topic messages
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
  overview: `请生成命格总览，按以下结构输出：

**【命格定性】**
用一句话概括这个命盘的核心格局与命主气质。

**【主星解读】**
命宫主星的核心特质，引用倪海厦原话或观点。

**【三方四正】**
财、官、迁三宫的联动分析及整体格局。

**【当前大限】**
当下大限运势方向与最值得关注的事项。

**【优势与注意】**
命盘天赋优势，以及需要注意的风险或功课。`,

  love: `请深度分析感情婚姻运，按以下结构输出：

**【感情格局】**
一句话定性感情命格。

**【夫妻宫分析】**
夫妻宫主星、四化，以及倪海厦体系的具体解读。

**【三方联动】**
相关宫位对感情的影响。

**【当前大限感情运】**
当下10年感情走向与关键节点。

**【实际建议】**
具体可行的感情建议。`,

  career: `请深度分析事业运，按以下结构输出：

**【事业格局】**
一句话定性事业命格，宜任职或宜创业。

**【官禄宫分析】**
官禄宫主星、四化，以及倪师对这种配置的判断。

**【财帛宫联动】**
财运与事业的关系，财路来源分析。

**【当前大限事业运】**
当下10年事业走向。

**【实际建议】**
适合的方向、行业与策略。`,

  wealth: `请深度分析财运，按以下结构输出：

**【财运格局】**
一句话定性财运模式，是主动财还是被动财。

**【财帛宫分析】**
财帛宫主星、四化，财富来源与流动模式。

**【田宅宫（财库）】**
积蓄能力与不动产运势分析。

**【当前大限财运】**
当下财运走向与注意事项。

**【理财建议】**
具体的财务建议。`,

  health: `请分析健康运势，按以下结构输出：

**【疾厄宫主星】**
疾厄宫星曜与健康含义。

**【主要风险】**
结合倪海厦子午流注理论，分析主要健康隐患与需关注的部位。

**【大限健康走势】**
当下健康趋势与关键时间段。

**【预防建议】**
具体注意事项与养生方向。`,

  personality: `请深度解析性格特质，按以下结构输出：

**【命宫主星性格】**
命宫主星的核心性格特质，引用倪师原话。

**【三方性格综合】**
财、官、迁三宫对性格的影响，全貌描绘。

**【人际关系模式】**
与他人互动方式、待人处世风格。

**【优势与人生课题】**
天赋优势，以及需要面对的人生功课。`,
};

const TOPIC_PROMPTS_VI: Record<string, string> = {
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

const PALACE_ROLES: Record<string, string> = {
  '命宫':   '自我、性格、先天格局',
  '兄弟宫': '兄弟关系、合伙人',
  '夫妻宫': '感情关系、婚姻状态',
  '子女宫': '子女缘分、下属关系',
  '财帛宫': '财运来源、收入方式',
  '疾厄宫': '身体健康、意外',
  '迁移宫': '外出机遇、人际格局',
  '交友宫': '朋友圈、贵人、小人',
  '官禄宫': '事业成就、社会地位',
  '田宅宫': '不动产、家庭环境',
  '福德宫': '精神享受、内心福分',
  '父母宫': '父母关系、文书契约',
};

const PALACE_ROLES_VI: Record<string, string> = {
  '命宫':   'bản thân, tính cách, cục diện tiên thiên',
  '兄弟宫': 'quan hệ anh em, người hợp tác',
  '夫妻宫': 'quan hệ tình cảm, hôn nhân',
  '子女宫': 'duyên con cái, cấp dưới',
  '财帛宫': 'nguồn tài, cách kiếm tiền',
  '疾厄宫': 'sức khỏe, tai nạn',
  '迁移宫': 'cơ hội xuất ngoại, cục diện giao tiếp',
  '交友宫': 'bạn bè, quý nhân, tiểu nhân',
  '官禄宫': 'thành tựu sự nghiệp, địa vị xã hội',
  '田宅宫': 'bất động sản, môi trường gia đình',
  '福德宫': 'hưởng thụ tinh thần, phúc phận nội tâm',
  '父母宫': 'quan hệ cha mẹ, văn thư khế ước',
};

/** Render AI markdown: **【Title】** → gold header, **bold** → strong */
function AiContent({ text, streaming }: { text: string; streaming?: boolean }) {
  const lines = text.split('\n');
  return (
    <div className="space-y-0.5">
      {lines.map((line, i) => {
        const sectionMatch = line.match(/^\*\*【(.+?)】\*\*$/);
        if (sectionMatch) {
          return (
            <div key={i} className="pt-3 pb-0.5 first:pt-0">
              <span className="text-[11px] font-semibold tracking-wide" style={{ color: 'var(--t-gold)' }}>
                【{sectionMatch[1]}】
              </span>
            </div>
          );
        }
        if (line.trim() === '') return <div key={i} className="h-1" />;
        const parts = line.split(/\*\*(.+?)\*\*/);
        return (
          <div key={i} className="text-[11px] leading-relaxed" style={{ color: 'var(--t-text2)' }}>
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
  const messagesRef = useRef<Message[]>([]); // always-current copy for closures
  const loadingRef = useRef(false);
  const autoLoaded = useRef(false);
  const lastPalaceBranch = useRef<number | undefined>(undefined);
  const lastSiHuaKey = useRef<string | undefined>(undefined);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { m, locale, term } = useLocale();
  const [showSettings, setShowSettings] = useState(false);
  const vi = locale === 'vi';
  const topicPrompts = vi ? TOPIC_PROMPTS_VI : TOPIC_PROMPTS;
  const roleOf = (n: string) => {
    const map = vi ? PALACE_ROLES_VI : PALACE_ROLES;
    return map[n] ?? map[`${n}宫`] ?? map[n.replace(/宫$/, '')] ?? '';
  };

  // Keep refs in sync
  useEffect(() => { messagesRef.current = messages; }, [messages]);
  useEffect(() => { loadingRef.current = loading; }, [loading]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Auto-generate 命格总览 on mount
  useEffect(() => {
    if (autoLoaded.current) return;
    autoLoaded.current = true;
    sendMessage(topicPrompts.overview, true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Inject palace analysis when palace selected
  useEffect(() => {
    if (!selectedPalace || selectedPalace.branch === lastPalaceBranch.current) return;
    lastPalaceBranch.current = selectedPalace.branch;

    const majorStars = selectedPalace.stars.filter(s => s.type === 'major');
    const role = roleOf(selectedPalace.name);
    const pName = term(selectedPalace.name);
    const starDesc = majorStars.length > 0
      ? majorStars.map(s => vi
          ? `${term(s.name)}${s.siHua ? ` hóa ${term(s.siHua)}` : ''}`
          : `${s.name}${s.siHua ? `化${s.siHua}` : ''}`).join(vi ? ', ' : '、')
      : (vi ? 'vô chính diệu (mượn cung đối)' : '空宫（借对宫）');

    const prompt = vi
      ? `Hãy phân tích trọng tâm cung 【${pName}】 (chủ quản: ${role}), chính tinh của cung là ${starDesc}, theo cấu trúc:

**【Định tính cung vị】**
Ý nghĩa của cung ${pName} trong lá số và nhận định tổng thể về cách phối trí sao này.

**【Luận chính tinh】**
Cách luận chính tinh tại cung này theo hệ Nghê Hải Hạ.

**【Liên động tam phương tứ chính】**
Ảnh hưởng của tam phương tứ chính tới cung này.

**【Lời khuyên thực tế】**
Lời khuyên cụ thể dựa trên cung này.`
      : `请重点分析【${selectedPalace.name}】（主管：${role}），该宫主星为${starDesc}，按以下结构输出：

**【宫位定性】**
${selectedPalace.name}在命盘中的意义，以及这种星曜配置的整体判断。

**【主星解读】**
主星在此宫的倪海厦体系解读，引用具体观点。

**【三方四正联动】**
三方四正宫位对此宫的影响。

**【实际建议】**
基于此宫的具体建议。`;

    sendMessage(prompt, true);
  }, [selectedPalace]); // eslint-disable-line react-hooks/exhaustive-deps

  // 注入四化飞化分析
  useEffect(() => {
    if (!selectedSiHua) return;
    const key = `${selectedSiHua.starName}-${selectedSiHua.siHua}-${selectedSiHua.view}`;
    if (key === lastSiHuaKey.current) return;
    lastSiHuaKey.current = key;

    // 找出该星所在宫位
    const palaceOfStar = chart.palaces.find(p =>
      p.stars.some(s => s.name === selectedSiHua.starName)
    );
    const palaceName = palaceOfStar?.name ?? (vi ? 'cung chưa rõ' : '未知宫位');
    const pName = vi ? term(palaceName) : palaceName;
    const starV = vi ? term(selectedSiHua.starName) : selectedSiHua.starName;
    const huaV = vi ? term(selectedSiHua.siHua) : selectedSiHua.siHua;
    const viewLabel = vi
      ? (selectedSiHua.view === 'daxian' ? 'đại hạn' : 'lưu niên')
      : (selectedSiHua.view === 'daxian' ? '大限' : '流年');

    const prompt = vi
      ? `Hãy phân tích ảnh hưởng phi hóa của 【${starV} hóa ${huaV} (${viewLabel})】, theo cấu trúc:

**【Ý nghĩa cơ bản của hóa ${huaV}】**
Ý nghĩa cốt lõi của hóa ${huaV} theo hệ Nghê Hải Hạ, và ý nghĩa đặc biệt khi ${starV} hóa ${huaV}.

**【Ảnh hưởng tại cung rơi vào】**
${starV} hóa ${huaV} rơi vào cung 【${pName}】; lĩnh vực cung này chủ quản bị ảnh hưởng ra sao, thầy Nghê luận thế nào.

**【Đường phi hóa tam phương tứ chính】**
Sau khi hóa ${huaV} nhập cung ${pName}, ảnh hưởng liên động tới tam phương tứ chính (cung đối và hai cung tam hợp).

**【Ảnh hưởng vận hiện tại】**
Ở chiều thời gian ${viewLabel}, hóa ${huaV} này ảnh hưởng cụ thể thế nào tới vận gần đây của mệnh chủ.

**【Lời khuyên thực tế】**
Lời khuyên cụ thể, khả thi dựa trên tứ hóa này.`
      : `请分析【${viewLabel}${selectedSiHua.starName}化${selectedSiHua.siHua}】的飞化影响，按以下结构输出：

**【化${selectedSiHua.siHua}基本含义】**
化${selectedSiHua.siHua}在倪海厦体系中的核心含义，以及${selectedSiHua.starName}化${selectedSiHua.siHua}的特殊含义。

**【落宫影响】**
${selectedSiHua.starName}化${selectedSiHua.siHua}落在【${palaceName}】，该宫主管的领域受到何种影响，倪师如何解读。

**【三方四正飞化路径】**
化${selectedSiHua.siHua}入${palaceName}后，对其三方四正（对宫、两个三合宫）的联动影响。

**【当前运势影响】**
在${viewLabel}时间维度下，此化${selectedSiHua.siHua}对命主近期运势的具体影响。

**【实际建议】**
基于此四化的具体可操作建议。`;

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
      if (!res.ok) throw new Error('请求失败');
      if (!res.body) throw new Error('无响应流');

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
          } catch { /* skip */ }
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
    // Capture current messages synchronously via ref (avoids stale closure)
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
    sendMessage(topicPrompts[topicKey], true);
  };

  const handleSend = () => {
    sendMessage(input);
  };

  return (
    <div className="flex flex-col h-full rounded-xl overflow-hidden card-glass">

      {/* ── Topic buttons ── */}
      <div className="flex-shrink-0 flex items-center gap-1.5 px-2 pt-2.5 pb-2" style={{ borderBottom: '1px solid var(--t-border)' }}>
        <div className="grid grid-cols-6 gap-1 flex-1">
          {TOPICS.map(key => {
            const isActive = activeTopic === key;
            return (
              <button
                key={key}
                onClick={() => handleTopicClick(key)}
                disabled={loading}
                className="py-1.5 text-[10px] font-medium rounded-lg transition-all duration-150 disabled:opacity-40"
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

      {/* ── Messages ── */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">

        {/* Loading state before first message */}
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

            // Assistant message
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

      {/* ── Input ── */}
      <div className="flex-shrink-0 px-3 pb-3 pt-2" style={{ borderTop: '1px solid var(--t-border)' }}>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder={m.insight.placeholder}
            disabled={loading}
            className="flex-1 rounded-lg px-3 py-2 text-[11px] focus:outline-none transition-colors"
            style={{
              background: 'var(--t-card)',
              border: '1px solid var(--t-border)',
              color: 'var(--t-text)',
            }}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="px-3 py-2 rounded-lg text-[11px] font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed"
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
