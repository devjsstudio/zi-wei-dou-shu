'use client';
import Link from 'next/link';
import { useTheme } from '@/components/ThemeProvider';
import { LocaleSwitch } from '@/components/LocaleProvider';

export type NavKey = 'lap-la-so' | 'la-so' | 'luan-giai' | 'van-han' | 'dai-su-ai';

const NAV: { key: NavKey; label: string; href: string }[] = [
  { key: 'lap-la-so', label: 'Lập Lá Số', href: '/' },
  { key: 'la-so', label: 'Lá Số Tương Tác', href: '/chart' },
  { key: 'luan-giai', label: 'Sách Luận Giải', href: '/luan-giai' },
  { key: 'van-han', label: 'Vận Hạn & Lưu Niên', href: '/van-han' },
  { key: 'dai-su-ai', label: 'Đại Sư AI & Tủ Lá Số', href: '/dai-su-ai' },
];

function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const dark = theme === 'dark';
  return (
    <button
      type="button"
      onClick={toggle}
      title={dark ? 'Chế độ sáng' : 'Chế độ tối'}
      className="w-9 h-9 rounded-full bg-surface-container-low flex items-center justify-center text-primary hover:bg-surface-container-high hover:text-on-surface transition-all shadow-[0_2px_8px_rgba(0,0,0,0.4)]"
    >
      <span className="material-symbols-outlined text-[18px]">{dark ? 'dark_mode' : 'light_mode'}</span>
    </button>
  );
}

/** Header cố định "Mystical Oriental Luxury" — dùng chung cho toàn bộ 5 màn hình. */
export default function AppHeader({ active }: { active: NavKey }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface-container-lowest/85 backdrop-blur-2xl shadow-[0_4px_30px_rgba(0,0,0,0.85)]">
      <div className="h-16 md:h-20 w-full px-space-lg lg:px-margin flex items-center justify-between gap-space-md">
        <Link href="/" className="flex items-center gap-space-md shrink-0">
          <span className="material-symbols-outlined text-primary text-[30px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
          <div className="flex flex-col">
            <div className="flex items-center gap-space-xs">
              <span className="font-headline-sm text-headline-sm text-primary tracking-wide font-bold">THIÊN CƠ TINH TƯỢNG</span>
              <span className="hidden xl:inline-block px-space-xs py-0.5 rounded bg-surface-container-high text-secondary text-[10px] tracking-wider uppercase">Hoàng Gia</span>
            </div>
            <span className="font-label-esoteric text-label-esoteric text-on-surface-variant/80 hidden sm:block">Huyền Học Hoàng Gia &amp; Tử Vi Đẩu Số Chiêm Tinh</span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-space-xs bg-surface-container-low/90 px-space-xs py-1.5 rounded-full shadow-[0_2px_12px_rgba(0,0,0,0.5)]">
          {NAV.map((n) => (
            <Link
              key={n.key}
              href={n.href}
              className={n.key === active
                ? 'px-space-md py-2 rounded-full font-label-md text-label-md bg-primary-container text-on-primary-container font-semibold shadow-[0_0_18px_rgba(245,158,11,0.35)] transition-all'
                : 'px-space-md py-2 rounded-full font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all'}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-space-sm shrink-0">
          <LocaleSwitch />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
