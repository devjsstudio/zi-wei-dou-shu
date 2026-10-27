'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { MESSAGES, type Locale, type Messages } from '@/lib/i18n/messages';
import { termVi } from '@/lib/i18n/terms-vi';

const STORAGE_KEY = 'ziwei-locale';
const HTML_LANG: Record<Locale, string> = { zh: 'zh-CN', vi: 'vi' };
/** 默认语言：越南语；用户切到中文后记在 localStorage */
const DEFAULT_LOCALE: Locale = 'vi';

const LocaleContext = createContext<{
  locale: Locale;
  setLocale: (l: Locale) => void;
  m: Messages;
  /** 术语显示：中文原样返回，越南语查对照表 */
  term: (zh: string) => string;
  /** 按当前语言二选一，用于页面里零散的短文案 */
  tr: <T>(zh: T, vi: T) => T;
}>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
  m: MESSAGES[DEFAULT_LOCALE],
  term: termVi,
  tr: (_zh, vi) => vi,
});

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>(DEFAULT_LOCALE);
  const [mounted, setMounted] = useState(false);

  // 首次进入：读取已保存的语言选择
  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'zh' || saved === 'vi') setLocale(saved);
    } catch { /* 隐私模式等场景下 localStorage 不可用 */ }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.lang = HTML_LANG[locale];
    try { localStorage.setItem(STORAGE_KEY, locale); } catch { /* ignore */ }
  }, [locale, mounted]);

  const term = locale === 'vi' ? termVi : (s: string) => s;
  const tr = <T,>(zh: T, vi: T): T => (locale === 'vi' ? vi : zh);

  return (
    <LocaleContext.Provider value={{ locale, setLocale, m: MESSAGES[locale], term, tr }}>
      {children}
    </LocaleContext.Provider>
  );
}

export const useLocale = () => useContext(LocaleContext);

/**
 * 服务端组件里用的双语片段：<L zh="中文" vi="Tiếng Việt" />。
 * 两种语言都随页面下发，客户端按当前语言渲染其一。
 */
export function L({ zh, vi }: { zh: React.ReactNode; vi: React.ReactNode }) {
  const { locale } = useLocale();
  return <>{locale === 'vi' ? vi : zh}</>;
}

/** 中文 / Tiếng Việt 切换按钮 */
export function LocaleSwitch() {
  const { locale, setLocale } = useLocale();
  return (
    <div
      style={{ display: 'inline-flex', border: '1px solid rgba(184,146,42,0.35)', borderRadius: 8, overflow: 'hidden', fontSize: 12, flexShrink: 0 }}
    >
      {([['zh', '中文'], ['vi', 'Tiếng Việt']] as const).map(([l, label]) => (
        <button
          key={l}
          type="button"
          onClick={() => setLocale(l)}
          aria-pressed={locale === l}
          style={{
            padding: '5px 12px', cursor: 'pointer', border: 'none',
            background: locale === l ? 'rgba(212,168,67,0.18)' : 'transparent',
            color: locale === l ? 'var(--ac)' : 'var(--tx-3, #888)',
            fontWeight: locale === l ? 600 : 400,
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
