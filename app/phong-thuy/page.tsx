'use client';
import { useMemo, useState } from 'react';
import AppHeader from '@/components/AppHeader';
import { useStoredChart } from '@/lib/useStoredChart';
import { useLocale } from '@/components/LocaleProvider';

interface Product { id: string; name: string; sub: string; price: number; icon: string; element: string; color: string; img?: string; }

const TALISMANS: Product[] = [
  { id: 'tai', name: 'Bùa Chiêu Tài Tụ Lộc', sub: 'Hành Thổ/Kim · kích hoạt cung Tài Bạch', price: 99000, icon: 'paid', element: 'Kim', color: '#F59E0B' },
  { id: 'ta', name: 'Bùa Trấn Sát Hộ Thân', sub: 'Hành Hỏa · hóa giải lục sát xung chiếu', price: 99000, icon: 'shield', element: 'Hỏa', color: '#F43F5E' },
  { id: 'duyen', name: 'Bùa Hòa Hợp Nhân Duyên', sub: 'Hành Mộc/Hỏa · dung dưỡng cung Phu Thê', price: 99000, icon: 'favorite', element: 'Mộc', color: '#10B981' },
];

const BAO_VAT: Product[] = [
  { id: 'tram', name: 'Vòng Trầm Hương Phối Vàng 24K', sub: 'Khai quang trấn trạch, chiêu tài an thần', price: 2990000, icon: 'spa', element: 'Thổ', color: '#F59E0B', img: '/_assets/stitch/img09.png' },
  { id: 'thachanh', name: 'Vòng Thạch Anh Tóc Vàng', sub: 'Kích hoạt tài khí, thu hút quý nhân', price: 1850000, icon: 'diamond', element: 'Kim', color: '#F59E0B', img: '/_assets/stitch/img14.png' },
  { id: 'longquy', name: 'Tượng Long Quy Ngọc Bích', sub: 'Trấn sát, bảo gia, vững sự nghiệp', price: 3600000, icon: 'temple_buddhist', element: 'Mộc', color: '#10B981', img: '/_assets/stitch/img01.png' },
];

const vnd = (n: number) => n.toLocaleString('vi-VN') + 'đ';

export default function PhongThuyPage() {
  const chart = useStoredChart();
  const { term } = useLocale();
  const [talisman, setTalisman] = useState('tai');
  const [pay, setPay] = useState<Product | null>(null);
  const [paid, setPaid] = useState(false);

  // Điểm nghẽn vận khí: suy từ Hóa Kỵ + sát tinh trong lá số
  const issues = useMemo(() => {
    if (!chart) return [];
    const out: { palace: string; stars: string; remedy: string; type: string }[] = [];
    for (const p of chart.palaces) {
      const ky = p.stars.find((s) => s.siHua === '忌');
      const sha = p.stars.filter((s) => s.type === 'sha');
      if (ky) {
        out.push({
          palace: term(p.name), stars: `${term(ky.name)} Hóa Kỵ`,
          type: 'Hóa Kỵ Vướng Mắc',
          remedy: `Cung ${term(p.name)} bị Hóa Kỵ dẫn động — dễ vướng mắc, hao tâm về lĩnh vực cung này. Nên dùng tâm tĩnh tại, thỉnh bùa Hòa Hợp hành Mộc/Hỏa và bài trí vật phẩm hợp dụng thần để hóa giải.`,
        });
      } else if (sha.length >= 2) {
        out.push({
          palace: term(p.name), stars: sha.map((s) => term(s.name)).join(', '),
          type: 'Sát Tinh Hội Tụ',
          remedy: `Cung ${term(p.name)} hội nhiều sát tinh — dễ gặp trắc trở, biến động. Nên thỉnh bùa Trấn Sát Hộ Thân hành Hỏa và an trí bảo vật trấn yểm tại phương vị tương ứng.`,
        });
      }
      if (out.length >= 3) break;
    }
    if (out.length === 0) {
      out.push({ palace: 'Tổng Mệnh', stars: 'Cát tinh hội chiếu', type: 'Vận Khí Hanh Thông', remedy: 'Lá số cân bằng, ít điểm nghẽn lớn. Nên duy trì bài trí phong thủy thuận dụng thần và tích phúc hành thiện để giữ vững vượng khí.' });
    }
    return out;
  }, [chart, term]);

  if (!chart) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-space-md bg-background text-on-surface-variant">
        <span className="material-symbols-outlined text-primary text-[40px] animate-spin">progress_activity</span>
        <p className="font-body-md text-body-md">Đang chuyển về Trang Chủ để lập lá số…</p>
      </main>
    );
  }

  const curTal = TALISMANS.find((t) => t.id === talisman)!;
  const openPay = (p: Product) => { setPay(p); setPaid(false); };

  return (
    <div className="bg-background font-body-md text-on-surface min-h-screen selection:bg-primary selection:text-on-primary">
      <AppHeader active="phong-thuy" />
      <main className="w-full pt-16 md:pt-20 bg-background min-h-screen relative overflow-hidden">
        <div className="absolute -top-24 left-1/3 w-96 h-96 rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
        <div className="w-full max-w-[1280px] mx-auto px-margin-mobile md:px-space-lg lg:px-margin py-space-lg relative">
          <div className="flex flex-col gap-1 mb-space-lg">
            <span className="px-space-sm py-0.5 rounded-full bg-surface-container-high text-secondary font-label-esoteric text-label-esoteric uppercase tracking-wider w-fit">Khâm Thiên Mật Pháp</span>
            <h1 className="font-headline-lg text-[26px] md:text-headline-lg text-primary tracking-tight uppercase">Mật Pháp Cải Mệnh & Bảo Vật Trấn Yểm</h1>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl">Chẩn đoán điểm nghẽn vận khí từ lá số và gợi ý vật phẩm hóa giải theo dụng thần.</p>
          </div>

          {/* Điểm nghẽn */}
          <section className="mb-space-xl">
            <h2 className="font-headline-md text-[20px] text-primary font-bold mb-space-md flex items-center gap-2"><span className="material-symbols-outlined text-error">warning</span> Điểm Nghẽn Vận Khí & Cứu Cánh Hóa Giải</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-lg">
              {issues.map((it, i) => (
                <div key={i} className="rounded-2xl bg-surface-container/95 p-space-lg shadow-xl flex flex-col gap-space-sm">
                  <span className="font-label-esoteric text-label-esoteric text-error uppercase tracking-wider">{it.type}</span>
                  <h3 className="font-headline-sm text-[16px] text-primary font-bold">Cung {it.palace} · {it.stars}</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-[1.7]">{it.remedy}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Bùa hình nền */}
          <section className="mb-space-xl grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
            <div className="lg:col-span-7">
              <h2 className="font-headline-md text-[20px] text-primary font-bold mb-space-md">Tạo Hình Nền Bùa Bình An & Chiêu Tài</h2>
              <div className="flex flex-col gap-space-sm">
                {TALISMANS.map((t) => (
                  <button key={t.id} type="button" onClick={() => setTalisman(t.id)}
                    className={t.id === talisman
                      ? 'flex items-center gap-space-md p-space-md rounded-xl bg-surface-container-high text-left shadow-md ring-1 ring-primary/40 transition-all'
                      : 'flex items-center gap-space-md p-space-md rounded-xl bg-surface-container text-left hover:bg-surface-container-high transition-all'}>
                    <span className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${t.color}1a`, color: t.color }}>
                      <span className="material-symbols-outlined">{t.icon}</span>
                    </span>
                    <span className="flex flex-col">
                      <span className="font-title-sm text-title-sm text-on-surface font-semibold">{t.name}</span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">{t.sub}</span>
                    </span>
                  </button>
                ))}
              </div>
              <button type="button" onClick={() => openPay({ ...curTal, name: `Hình nền 4K Khai Quang · ${curTal.name}` })}
                className="mt-space-md w-full bg-gradient-to-r from-primary-container to-secondary-container hover:from-primary hover:to-secondary text-on-primary-container font-title-sm text-title-sm font-bold py-3.5 px-space-md rounded-xl transition-all shadow-[0_0_24px_rgba(242,202,80,0.35)] flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">wallpaper</span> Thỉnh Hình Nền 4K Khai Quang ({vnd(99000)})
              </button>
            </div>
            {/* preview */}
            <div className="lg:col-span-5">
              <div className="relative w-full max-w-[260px] mx-auto aspect-[9/16] rounded-2xl overflow-hidden shadow-2xl flex flex-col items-center justify-center gap-space-md"
                style={{ background: `radial-gradient(ellipse at top, ${curTal.color}22, #0a0e18 65%)` }}>
                <span className="material-symbols-outlined text-[72px]" style={{ color: curTal.color, fontVariationSettings: "'FILL' 1" }}>{curTal.icon}</span>
                <span className="font-headline-md text-[18px] font-bold text-center px-4" style={{ color: curTal.color }}>{curTal.name}</span>
                <span className="font-label-esoteric text-[10px] text-on-surface-variant uppercase tracking-widest">Khai Quang Điểm Nhãn</span>
                <span className="absolute bottom-3 font-label-esoteric text-[9px] text-on-surface-variant/60 tracking-widest">thiencotinhtuong.vn</span>
              </div>
            </div>
          </section>

          {/* Bảo vật */}
          <section>
            <h2 className="font-headline-md text-[20px] text-primary font-bold mb-space-md">Bảo Vật Chế Hóa Theo Dụng Thần</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-lg">
              {BAO_VAT.map((b) => (
                <div key={b.id} className="group rounded-2xl bg-surface-container/95 p-space-md shadow-xl flex flex-col gap-space-sm">
                  <div className="relative w-full h-48 rounded-xl overflow-hidden bg-surface-container-lowest">
                    {b.img ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img alt={b.name} src={b.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center" style={{ color: b.color }}><span className="material-symbols-outlined text-[48px]">{b.icon}</span></div>
                    )}
                    <span className="absolute top-2 right-2 text-[10px] px-2 py-0.5 rounded-full backdrop-blur-sm" style={{ color: b.color, background: `${b.color}1a` }}>Hành {b.element}</span>
                  </div>
                  <h3 className="font-title-md text-title-md text-on-surface font-semibold group-hover:text-primary transition-colors">{b.name}</h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant flex-1">{b.sub}</p>
                  <div className="flex items-center justify-between pt-space-sm">
                    <span className="font-headline-sm text-[16px] text-primary font-bold">{vnd(b.price)}</span>
                    <span className="text-[10px] text-tertiary flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">verified</span> Đã khai quang</span>
                  </div>
                  <button type="button" onClick={() => openPay(b)} className="w-full bg-surface-container-high hover:bg-primary hover:text-on-primary text-on-surface font-title-sm text-title-sm font-medium py-2.5 rounded-lg transition-all flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">redeem</span> Thỉnh Bảo Vật Ngay
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Modal thanh toán (GIẢ LẬP) */}
        {pay && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setPay(null)}>
            <div className="w-full max-w-md rounded-2xl bg-surface-container shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between px-space-lg py-space-md border-b border-outline-variant/30">
                <span className="font-headline-sm text-[16px] text-primary font-bold">Thỉnh Vật Phẩm</span>
                <button type="button" onClick={() => setPay(null)} className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high"><span className="material-symbols-outlined text-[18px]">close</span></button>
              </div>
              {!paid ? (
                <div className="p-space-lg flex flex-col gap-space-md">
                  <div className="flex items-center gap-space-md">
                    <span className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${pay.color}1a`, color: pay.color }}><span className="material-symbols-outlined text-[28px]">{pay.icon}</span></span>
                    <div className="flex flex-col">
                      <span className="font-title-sm text-title-sm text-on-surface font-semibold">{pay.name}</span>
                      <span className="font-headline-sm text-[18px] text-primary font-bold">{vnd(pay.price)}</span>
                    </div>
                  </div>
                  <div className="rounded-xl bg-surface-container-lowest p-space-md flex flex-col items-center gap-space-sm">
                    <span className="font-label-esoteric text-[10px] text-on-surface-variant uppercase tracking-widest">Quét mã QR chuyển khoản (mô phỏng)</span>
                    <div className="w-36 h-36 rounded-lg bg-white p-2 grid grid-cols-7 grid-rows-7 gap-0.5">
                      {Array.from({ length: 49 }).map((_, i) => (
                        <span key={i} className="rounded-[1px]" style={{ background: ((i * 7 + (i % 5) + (i >> 2)) % 3 === 0) ? '#0a0e18' : 'transparent' }} />
                      ))}
                    </div>
                    <span className="font-body-sm text-[11px] text-on-surface-variant">Thiên Cơ Tinh Tượng · NH giả lập</span>
                  </div>
                  <p className="text-[11px] text-center text-on-surface-variant/70">* Đây là luồng thanh toán <strong>giả lập (demo)</strong>, không thu tiền hay thông tin thẻ thật.</p>
                  <button type="button" onClick={() => setPaid(true)} className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-on-primary font-title-sm text-title-sm font-bold shadow-[0_0_20px_rgba(242,202,80,0.4)] flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined">verified</span> Xác nhận đã chuyển khoản (giả lập)
                  </button>
                </div>
              ) : (
                <div className="p-space-xl flex flex-col items-center gap-space-md text-center">
                  <span className="material-symbols-outlined text-tertiary text-[56px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  <h3 className="font-headline-sm text-[18px] text-primary font-bold">Thỉnh vật phẩm thành công!</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">{pay.name} đã được khai quang và sẽ gửi tới bạn. (Giao dịch giả lập)</p>
                  <button type="button" onClick={() => setPay(null)} className="mt-space-sm px-space-lg py-2.5 rounded-full bg-surface-container-high text-on-surface font-label-md text-label-md">Đóng</button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
