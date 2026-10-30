'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useTheme } from '@/components/ThemeProvider';
import { useLocale } from '@/components/LocaleProvider';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Solar } from 'lunar-javascript';

export type NavKey =
  | 'lap-la-so' | 'la-so' | 'luan-giai' | 'van-han' | 'dai-su-ai'
  | 'hop-duyen' | 'van-khi' | 'phong-thuy' | 'bach-khoa' | 'chia-se'
  | 'trach-nhat' | 'gia-pha' | 'dinh-gio' | 'gieo-que' | 'su-nghiep' | 'am-nhac';

const NAV: { key: NavKey; label: string; href: string }[] = [
  { key: 'lap-la-so', label: 'Lập Lá Số', href: '/' },
  { key: 'la-so', label: 'Bảng Lá Số', href: '/chart' },
  { key: 'luan-giai', label: 'Luận Giải', href: '/luan-giai' },
  { key: 'van-han', label: 'Vận Hạn', href: '/van-han' },
  { key: 'dai-su-ai', label: 'Đại Sư AI', href: '/dai-su-ai' },
  { key: 'hop-duyen', label: 'Hợp Duyên & Đối Tác', href: '/hop-duyen' },
  { key: 'van-khi', label: 'Vận Khí Hàng Ngày', href: '/van-khi' },
  { key: 'phong-thuy', label: 'Phong Thủy Cải Vận', href: '/phong-thuy' },
  { key: 'bach-khoa', label: 'Bách Khoa Tinh Đẩu', href: '/bach-khoa' },
  { key: 'chia-se', label: 'Thẻ Chia Sẻ', href: '/chia-se' },
];

/** 6 công cụ "Pháp Khí" mới — gom vào dropdown để header không tràn. */
const PHAP_KHI: { key: NavKey; label: string; href: string; icon: string; desc: string; ready?: boolean }[] = [
  { key: 'trach-nhat', label: 'Trạch Nhật Cát Thời', href: '/trach-nhat', icon: 'event_available', desc: 'Chọn ngày hoàng đạo khởi sự', ready: true },
  { key: 'dinh-gio', label: 'Trắc Nghiệm Định Giờ Sinh', href: '/dinh-gio', icon: 'schedule', desc: 'Khảo đính giờ sinh chính xác', ready: true },
  { key: 'gia-pha', label: 'Mạch Vận Gia Phả', href: '/gia-pha', icon: 'account_tree', desc: 'Vận khí ngũ hành dòng tộc', ready: true },
  { key: 'gieo-que', label: 'Gieo Quẻ Kinh Dịch', href: '/gieo-que', icon: 'casino', desc: 'Lục hào vấn sự linh ứng', ready: true },
  { key: 'su-nghiep', label: 'La Bàn Sự Nghiệp', href: '/su-nghiep', icon: 'explore', desc: 'Ma trận sự nghiệp & dụng thần', ready: true },
  { key: 'am-nhac', label: 'Âm Nhạc & Đặt Lịch Đại Sư', href: '/am-nhac', icon: 'graphic_eq', desc: 'Nhạc thiền ngũ âm · đặt lịch', ready: true },
];
const PHAP_KHI_KEYS = PHAP_KHI.map((p) => p.key);

function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const dark = theme === 'dark';
  return (
    <button type="button" onClick={toggle} title={dark ? 'Chế độ sáng' : 'Chế độ tối'}
      className="w-9 h-9 rounded-full bg-surface-container-low flex items-center justify-center text-primary hover:bg-surface-container-high hover:text-on-surface transition-all shadow-[0_2px_8px_rgba(0,0,0,0.4)] border border-[#D4AF37]/30">
      <span className="material-symbols-outlined text-[18px]">{dark ? 'dark_mode' : 'light_mode'}</span>
    </button>
  );
}

/** Dropdown "Pháp Khí" chứa 6 công cụ huyền học mới. */
function PhapKhiMenu({ active }: { active: NavKey }) {
  const [open, setOpen] = useState(false);
  const isActive = PHAP_KHI_KEYS.includes(active);
  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open}
        className={`flex items-center gap-1.5 px-3 h-9 rounded-full font-label-md text-label-md transition-all whitespace-nowrap border ${
          isActive
            ? 'bg-primary-container text-on-primary-container font-semibold border-transparent shadow-[0_0_18px_rgba(245,158,11,0.35)]'
            : 'bg-surface-container-low text-primary border-[#D4AF37]/30 hover:bg-surface-container-high'}`}>
        <span className="material-symbols-outlined text-[18px]">widgets</span>
        <span className="hidden xl:inline">Pháp Khí</span>
        <span className="material-symbols-outlined text-[16px] transition-transform" style={{ transform: open ? 'rotate(180deg)' : 'none' }}>expand_more</span>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 z-50 w-72 rounded-2xl bg-surface-container/98 backdrop-blur-2xl border border-[#D4AF37]/25 shadow-[0_12px_40px_rgba(0,0,0,0.75)] p-1.5">
            <div className="px-space-sm py-1.5 font-label-esoteric text-label-esoteric text-secondary uppercase tracking-wider">Lục Đại Pháp Khí Huyền Môn</div>
            {PHAP_KHI.map((p) => {
              const content = (
                <>
                  <span className={`material-symbols-outlined text-[20px] ${p.key === active ? '' : p.ready ? 'text-primary' : 'text-on-surface-variant/50'}`}>{p.icon}</span>
                  <span className="flex flex-col min-w-0 flex-1">
                    <span className="font-title-sm text-[13px] font-semibold truncate">{p.label}</span>
                    <span className="font-body-sm text-[11px] opacity-70 truncate">{p.desc}</span>
                  </span>
                  {!p.ready && <span className="text-[9px] px-1.5 py-0.5 rounded bg-surface-container-high text-on-surface-variant/70 whitespace-nowrap">Sắp ra mắt</span>}
                </>
              );
              return p.ready ? (
                <Link key={p.key} href={p.href} onClick={() => setOpen(false)}
                  className={`flex items-center gap-space-sm px-space-sm py-2 rounded-xl transition-all ${p.key === active ? 'bg-primary-container/90 text-on-primary-container' : 'text-on-surface hover:bg-surface-container-high'}`}>
                  {content}
                </Link>
              ) : (
                <div key={p.key} className="flex items-center gap-space-sm px-space-sm py-2 rounded-xl text-on-surface-variant/60 cursor-not-allowed select-none" title="Sắp ra mắt">
                  {content}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

/** Header cố định "Mystical Oriental Luxury" — dùng chung cho toàn bộ màn hình. */
export default function AppHeader({ active }: { active: NavKey }) {
  const { term } = useLocale();
  const [lunar, setLunar] = useState<{ y: string; m: string }>({ y: '', m: '' });

  useEffect(() => {
    try {
      const l = (Solar as any).fromDate(new Date()).getLunar();
      setLunar({
        y: `${term(l.getYearGan())} ${term(l.getYearZhi())}`,
        m: `${term(l.getMonthGan())} ${term(l.getMonthZhi())}`,
      });
    } catch { /* ignore */ }
  }, [term]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0B0F19]/90 backdrop-blur-2xl shadow-[0_4px_30px_rgba(0,0,0,0.85)] border-b border-[#D4AF37]/20">
      <div className="h-16 md:h-20 w-full px-space-md lg:px-margin flex items-center justify-between gap-space-md">
        <Link href="/" className="flex items-center gap-space-md shrink-0">
          <span className="material-symbols-outlined text-primary text-[30px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
          <div className="flex flex-col">
            <div className="flex items-center gap-space-xs">
              <span className="font-headline-sm text-headline-sm text-primary tracking-wide font-bold">THIÊN CƠ TINH TƯỢNG</span>
              <span className="hidden 2xl:inline-block px-space-xs py-0.5 rounded bg-surface-container-high text-secondary text-[10px] tracking-wider uppercase border border-[#D4AF37]/30">Hoàng Gia</span>
            </div>
            <span className="font-label-esoteric text-label-esoteric text-on-surface-variant/80 hidden sm:block">Huyền Học Hoàng Gia &amp; Tử Vi Đẩu Số Chiêm Tinh</span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1 bg-[#171b26]/90 px-2 py-1.5 rounded-full shadow-[0_2px_12px_rgba(0,0,0,0.5)] border border-[#D4AF37]/25 overflow-x-auto no-scrollbar flex-1 min-w-0 mx-space-sm">
          {NAV.map((n) => (
            <Link key={n.key} href={n.href}
              className={n.key === active
                ? 'px-3 py-1.5 rounded-full font-label-md text-label-md bg-primary-container text-on-primary-container font-semibold shadow-[0_0_18px_rgba(245,158,11,0.35)] transition-all whitespace-nowrap'
                : 'px-3 py-1.5 rounded-full font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all whitespace-nowrap'}>
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-space-sm shrink-0">
          <div className="hidden 2xl:flex flex-col items-end px-space-sm py-1 rounded bg-surface-container/60 border border-[#D4AF37]/20">
            <div className="flex items-center gap-1.5 text-secondary font-label-sm text-label-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
              <span>Năm {lunar.y || '…'} • Tháng {lunar.m || '…'}</span>
            </div>
            <span className="font-label-esoteric text-label-esoteric text-tertiary-fixed-dim">Giờ Hoàng Đạo Cát Tinh</span>
          </div>
          <div className="hidden lg:block"><PhapKhiMenu active={active} /></div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
