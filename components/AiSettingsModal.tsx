'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/components/ThemeProvider';
import { useLocale } from '@/components/LocaleProvider';
import { getAiKey, getAiModel, setAiConfig, MODEL_OPTIONS } from '@/lib/ai/config';

interface Props {
  open: boolean;
  onClose: () => void;
  /** 保存成功后回调（可用于自动重试解读） */
  onSaved?: () => void;
}

export default function AiSettingsModal({ open, onClose, onSaved }: Props) {
  const { theme } = useTheme();
  const { tr, locale } = useLocale();
  const isDark = theme === 'dark';

  const [key, setKey] = useState('');
  const [model, setModel] = useState(MODEL_OPTIONS[0].id);
  const [show, setShow] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // 打开时读入已存配置
  useEffect(() => {
    if (open) {
      setKey(getAiKey());
      setModel(getAiModel());
      setShow(false);
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [open]);

  const save = () => {
    setAiConfig(key, model);
    onSaved?.();
    onClose();
  };

  // 颜色
  const panelBg = isDark ? '#0b1526' : '#fffdf7';
  const border = isDark ? 'rgba(212,168,67,0.25)' : 'rgba(184,146,42,0.3)';
  const text = isDark ? '#e8eef6' : '#1a1a18';
  const faint = isDark ? '#9db0d0' : '#6a6a62';
  const inputBg = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,252,240,0.9)';
  const inputBorder = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(184,146,42,0.3)';
  const gold = isDark ? '#d4a843' : '#9a6210';

  const label = { fontSize: 11, color: faint, letterSpacing: '0.04em', marginBottom: 6, display: 'block', fontWeight: 500 } as const;
  const field = {
    width: '100%', boxSizing: 'border-box' as const, background: inputBg,
    border: `1px solid ${inputBorder}`, borderRadius: 10, padding: '10px 12px',
    fontSize: 13, color: text, outline: 'none',
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0, zIndex: 9998,
            background: 'rgba(8,10,20,0.72)', backdropFilter: 'blur(6px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
          }}
        >
          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 16 }} animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0 }} transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%', maxWidth: 460, background: panelBg,
              border: `1px solid ${border}`, borderRadius: 18, padding: 24,
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)', color: text,
            }}
          >
            {/* 标题 */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, letterSpacing: '0.02em', margin: 0 }}>
                {tr('AI 解读设置', 'Cấu hình luận giải AI')}
              </h2>
              <button onClick={onClose} aria-label={tr('关闭', 'Đóng')}
                style={{ background: 'none', border: 'none', color: faint, fontSize: 20, cursor: 'pointer', lineHeight: 1 }}>×</button>
            </div>
            <p style={{ fontSize: 12, color: faint, lineHeight: 1.7, margin: '6px 0 18px' }}>
              {tr(
                '解读由 DeepSeek 生成。本站已在服务器（.env.local）配好密钥，可直接用；下面留空即可。若想用你自己的密钥，填入即可——它只存在你的浏览器里，不会存入任何数据库。',
                'Phần luận giải do DeepSeek tạo ra. Trang đã cấu hình sẵn key trên máy chủ (.env.local) nên bạn có thể dùng ngay; cứ để trống ô dưới. Nếu muốn dùng key riêng, hãy nhập vào — key chỉ lưu trong trình duyệt của bạn, không lưu vào cơ sở dữ liệu nào.',
              )}
            </p>

            {/* API Key */}
            <div style={{ marginBottom: 16 }}>
              <label style={label}>{tr('DeepSeek API Key（可选）', 'DeepSeek API Key (không bắt buộc)')}</label>
              <div style={{ position: 'relative' }}>
                <input
                  ref={inputRef}
                  type={show ? 'text' : 'password'}
                  value={key}
                  onChange={e => setKey(e.target.value)}
                  placeholder={tr('留空则用服务器密钥', 'Để trống sẽ dùng key máy chủ')}
                  spellCheck={false}
                  autoComplete="off"
                  style={{ ...field, paddingRight: 54, fontFamily: 'var(--font-mono, monospace)' }}
                />
                <button
                  type="button"
                  onClick={() => setShow(s => !s)}
                  style={{
                    position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', color: faint, fontSize: 11, cursor: 'pointer',
                  }}
                >
                  {show ? tr('隐藏', 'Ẩn') : tr('显示', 'Hiện')}
                </button>
              </div>
              <a href="https://platform.deepseek.com/api_keys" target="_blank" rel="noreferrer"
                style={{ fontSize: 11, color: gold, textDecoration: 'none', display: 'inline-block', marginTop: 7 }}>
                {tr('→ 到 platform.deepseek.com 创建密钥并充值', '→ Tạo key & nạp tiền tại platform.deepseek.com')}
              </a>
            </div>

            {/* 模型 */}
            <div style={{ marginBottom: 22 }}>
              <label style={label}>{tr('模型', 'Model')}</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {MODEL_OPTIONS.map(opt => {
                  const active = model === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setModel(opt.id)}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '10px 12px', borderRadius: 10, cursor: 'pointer', textAlign: 'left',
                        background: active ? 'rgba(212,168,67,0.14)' : 'transparent',
                        border: `1px solid ${active ? gold : inputBorder}`,
                        color: text,
                      }}
                    >
                      <span style={{ fontSize: 13, fontWeight: active ? 600 : 400 }}>{opt.label}</span>
                      <span style={{ fontSize: 11, color: faint }}>{opt.hint[locale]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 按钮 */}
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={onClose}
                style={{ padding: '10px 18px', borderRadius: 10, border: `1px solid ${inputBorder}`, background: 'transparent', color: faint, fontSize: 13, cursor: 'pointer' }}>
                {tr('取消', 'Hủy')}
              </button>
              <button onClick={save}
                style={{
                  padding: '10px 22px', borderRadius: 10, border: 'none', cursor: 'pointer',
                  fontSize: 13, fontWeight: 600, letterSpacing: '0.04em',
                  background: isDark ? 'linear-gradient(135deg,#b8892a,#f0d070)' : 'linear-gradient(135deg,#9a6210,#c88020)',
                  color: isDark ? '#08080a' : '#fff8e8',
                }}>
                {tr('保存', 'Lưu')}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
