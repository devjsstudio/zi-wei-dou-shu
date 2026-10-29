'use client';
import { createContext, useContext } from 'react';
import { MESSAGES, type Locale, type Messages } from '@/lib/i18n/messages';
import { termVi } from '@/lib/i18n/terms-vi';

// Ứng dụng chỉ còn tiếng Việt. Giữ API term()/tr()/L()/m để các trang không phải sửa,
// nhưng tất cả đều trả về tiếng Việt.
const DEFAULT_LOCALE: Locale = 'vi';

const LocaleContext = createContext<{
  locale: Locale;
  setLocale: (l: Locale) => void;
  m: Messages;
  /** Hiển thị thuật ngữ: tra bảng đối chiếu sang tiếng Việt. */
  term: (zh: string) => string;
  /** Chọn một trong hai đoạn văn ngắn; nay luôn trả bản tiếng Việt. */
  tr: <T>(zh: T, vi: T) => T;
}>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
  m: MESSAGES[DEFAULT_LOCALE],
  term: termVi,
  tr: (_zh, vi) => vi,
});

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const value = {
    locale: DEFAULT_LOCALE,
    setLocale: () => {},
    m: MESSAGES[DEFAULT_LOCALE],
    term: termVi,
    tr: <T,>(_zh: T, vi: T): T => vi,
  };
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export const useLocale = () => useContext(LocaleContext);

/**
 * Đoạn văn song ngữ cũ: <L zh="…" vi="…" />. Nay luôn hiển thị bản tiếng Việt.
 */
export function L({ vi }: { zh: React.ReactNode; vi: React.ReactNode }) {
  return <>{vi}</>;
}
