import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { LocaleProvider } from '@/components/LocaleProvider';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Lá Số Tử Vi · Tử Vi Đẩu Số chính tông Nghê Hải Hạ',
  description: 'Lập lá số Tử Vi Đẩu Số theo hệ chính tông Nghê Hải Hạ: cục diện lá số, đại hạn lưu niên, tình cảm, sự nghiệp, tài vận, sức khỏe.',
  keywords: 'Tử Vi Đẩu Số, lá số tử vi, Nghê Hải Hạ, 14 chính tinh, 12 cung',
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Lá Số Tử Vi · Tử Vi Đẩu Số chính tông Nghê Hải Hạ',
    description: 'Lập lá số Tử Vi Đẩu Số theo hệ chính tông Nghê Hải Hạ: cục diện lá số, đại hạn lưu niên, tình cảm, sự nghiệp, tài vận, sức khỏe.',
    url: SITE_URL,
    siteName: 'Lá Số Tử Vi',
    locale: 'vi_VN',
    type: 'website',
  },
  // Xác minh công cụ quản trị website (điền verification code rồi deploy lại)
  verification: {
    // Google Search Console: thêm site tại https://search.google.com/search-console để lấy mã
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || undefined,
    // Bing Webmaster Tools: thêm site tại https://www.bing.com/webmasters để lấy mã
    other: {
      'msvalidate.01': process.env.NEXT_PUBLIC_BING_VERIFICATION || '808FFC6023A2C359B375DD860FEDA856',
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        {/* Design system "Mystical Oriental Luxury": tiêu đề Noto Serif · nội dung Be Vietnam Pro */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&family=Noto+Serif:ital,wght@0,500;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('ziwei-theme');if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t);else document.documentElement.setAttribute('data-theme','dark');}catch(e){}})();` }} />
      </head>
      <body className="min-h-screen">
        <ThemeProvider>
          <LocaleProvider>
            {children}
          </LocaleProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
