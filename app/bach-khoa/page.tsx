'use client';
import { useState, useMemo } from 'react';
import AppHeader from '@/components/AppHeader';
import { STARS, CAT_LABEL, ELEMENT_COLOR, STAR_IMG, type StarCat, type StarEntry } from '@/lib/stars-encyclopedia';

const FILTERS: { key: StarCat | 'all'; label: string }[] = [
  { key: 'all', label: 'Tất Cả' },
  { key: 'chinh-tinh', label: '14 Chính Tinh' },
  { key: 'tu-hoa', label: 'Tứ Hóa' },
  { key: 'luc-cat', label: 'Lục Cát' },
  { key: 'luc-sat', label: 'Lục Sát' },
];

const ELEMENT_ICON: Record<string, string> = {
  'Thổ': 'public', 'Mộc': 'forest', 'Thủy': 'water_drop', 'Kim': 'diamond', 'Hỏa': 'local_fire_department',
  'Kim / Hỏa': 'bolt', 'Thủy / Mộc': 'spa',
};

/** Tranh thiên thể cho sao không có ảnh — chòm sao + icon ngũ hành + tên sao. */
function StarArt({ name, element, color }: { name: string; element: string; color: string }) {
  const icon = ELEMENT_ICON[element] || 'auto_awesome';
  return (
    <div className="w-full h-full relative flex items-center justify-center overflow-hidden" style={{ background: `radial-gradient(ellipse at 50% 28%, ${color}33, #0a0e18 72%)` }}>
      <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.45 }} viewBox="0 0 120 120" preserveAspectRatio="none">
        <polyline points="18,24 42,40 30,70 64,58 92,34 104,72 72,96" fill="none" stroke={color} strokeWidth="0.6" strokeOpacity="0.5" />
        {[[18, 24], [42, 40], [30, 70], [64, 58], [92, 34], [104, 72], [72, 96], [50, 20], [100, 100]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 1.8 : 1} fill={color} />
        ))}
      </svg>
      <div className="relative flex flex-col items-center gap-1.5">
        <span className="material-symbols-outlined" style={{ fontSize: 40, color, filter: `drop-shadow(0 0 10px ${color})`, fontVariationSettings: "'FILL' 1" }}>{icon}</span>
        <span className="font-headline-sm text-[13px] font-bold tracking-[0.15em] text-center px-2" style={{ color }}>{name.toUpperCase()}</span>
      </div>
    </div>
  );
}

function Meter({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center justify-between text-[10px] text-on-surface-variant">
        <span>{label}</span><span className="font-semibold" style={{ color }}>{value}</span>
      </div>
      <div className="h-1.5 rounded-full bg-surface-container-lowest overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${value}%`, background: color }} />
      </div>
    </div>
  );
}

export default function BachKhoaPage() {
  const [filter, setFilter] = useState<StarCat | 'all'>('all');
  const [q, setQ] = useState('');
  const [selId, setSelId] = useState('tu-vi');

  const list = useMemo(() => {
    return STARS.filter((s) =>
      (filter === 'all' || s.cat === filter) &&
      (!q.trim() || s.name.toLowerCase().includes(q.trim().toLowerCase())),
    );
  }, [filter, q]);

  const sel: StarEntry = STARS.find((s) => s.id === selId) || STARS[0];
  const selColor = ELEMENT_COLOR[sel.element] || '#f2ca50';

  return (
    <div className="bg-background font-body-md text-on-surface min-h-screen selection:bg-primary selection:text-on-primary">
      <AppHeader active="bach-khoa" />
      <main className="w-full pt-16 md:pt-20 bg-background min-h-screen relative overflow-hidden">
        <div className="absolute -top-24 right-1/4 w-96 h-96 rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
        <div className="w-full max-w-[1280px] mx-auto px-margin-mobile md:px-space-lg lg:px-margin py-space-lg relative">
          {/* Header */}
          <div className="flex flex-col gap-1 mb-space-lg">
            <span className="px-space-sm py-0.5 rounded-full bg-surface-container-high text-secondary font-label-esoteric text-label-esoteric uppercase tracking-wider w-fit">Thiên Văn Tàng Thư</span>
            <h1 className="font-headline-lg text-[26px] md:text-headline-lg text-primary tracking-tight uppercase">Vạn Tượng Bách Khoa • Tinh Đẩu</h1>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl">Tra cứu ý nghĩa, ngũ hành, hóa khí và miếu vượng của chính tinh, tứ hóa, lục cát và lục sát.</p>
          </div>

          {/* Search + filters */}
          <div className="flex flex-col md:flex-row md:items-center gap-space-md mb-space-lg">
            <div className="relative flex-1 max-w-md">
              <span className="material-symbols-outlined text-on-surface-variant/60 text-[20px] absolute left-3.5 top-1/2 -translate-y-1/2">search</span>
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm sao: Tử Vi, Thái Âm, Hóa Lộc…"
                className="w-full h-11 pl-11 pr-4 rounded-full bg-surface-container-lowest text-on-surface font-body-md text-body-md placeholder:text-on-surface-variant/40 focus:outline-none focus:shadow-[0_0_0_2px_rgba(242,202,80,0.4)]" />
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {FILTERS.map((f) => (
                <button key={f.key} type="button" onClick={() => setFilter(f.key)}
                  className={f.key === filter
                    ? 'px-3.5 py-1.5 rounded-full font-label-md text-label-md bg-primary text-on-primary font-bold shadow-md whitespace-nowrap'
                    : 'px-3.5 py-1.5 rounded-full font-label-md text-label-md bg-surface-container-high text-on-surface-variant hover:text-primary transition-all whitespace-nowrap'}>
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg items-start">
            {/* Lưới thẻ bài thần tinh */}
            <div className="xl:col-span-8">
              <div className="flex items-center gap-space-xs mb-space-md">
                <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">Tàng Kinh Các Bộ Bài Thần Tinh</span>
                <span className="font-label-sm text-label-sm px-2 py-0.5 rounded bg-surface-container-high text-secondary">Chạm để Luận Giải Chi Tiết</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
                {list.map((s, idx) => {
                  const color = ELEMENT_COLOR[s.element] || '#f2ca50';
                  const active = s.id === selId;
                  const img = STAR_IMG[s.id];
                  return (
                    <button key={s.id} type="button" onClick={() => setSelId(s.id)}
                      className={`star-card group relative flex flex-col rounded-xl p-space-sm bg-gradient-to-b from-surface-container to-surface-container-low shadow-xl cursor-pointer transform hover:-translate-y-1.5 transition-all duration-300 text-left ${active ? 'ring-2 ring-primary/80' : ''}`}>
                      <div className="absolute top-2 left-2 z-10 font-label-esoteric text-[10px] text-primary/70">✦ {CAT_LABEL[s.cat].replace('14 ', '').toUpperCase()}</div>
                      <div className="absolute top-2 right-2 z-10 px-1.5 py-0.5 rounded bg-amber-500/20 text-secondary font-label-sm text-[10px] font-bold">#{String(idx + 1).padStart(2, '0')}</div>
                      {/* Tranh tarot */}
                      <div className="relative w-full h-48 rounded-lg overflow-hidden mt-5 bg-surface-container-lowest flex items-center justify-center shadow-inner">
                        {img ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img alt={s.name} src={img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <StarArt name={s.name} element={s.element} color={color} />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-transparent" />
                        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between gap-1">
                          <span className="px-2 py-0.5 rounded font-label-sm text-[11px] font-bold" style={{ background: color, color: '#0a0e18' }}>{s.element}</span>
                          <span className="px-2 py-0.5 rounded bg-surface-container/90 text-secondary font-label-sm text-[10px] truncate">{s.mieu.replace('Miếu tại ', 'M: ').replace('Đắc tại ', 'Đ: ')}</span>
                        </div>
                      </div>
                      {/* Nội dung */}
                      <div className="flex flex-col gap-1.5 pt-3">
                        <div className="flex items-center justify-between">
                          <h3 className="font-headline-sm text-[15px] text-primary font-bold">{s.name}</h3>
                          <span className="material-symbols-outlined text-[18px]" style={{ color }}>stars</span>
                        </div>
                        <p className="font-body-sm text-[11px] text-on-surface-variant line-clamp-2">{s.hoa} — {s.desc}</p>
                        <Meter label="Quyền Lực Thần Cách" value={s.power} color={color} />
                        <div className="mt-1 flex items-center justify-between text-secondary">
                          <span className="font-label-esoteric text-[10px]">Bấm để lật đồ trận</span>
                          <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
                {list.length === 0 && <p className="col-span-full text-on-surface-variant py-space-xl text-center">Không tìm thấy sao phù hợp.</p>}
              </div>
            </div>

            {/* Chi tiết */}
            <aside className="xl:col-span-4 xl:sticky xl:top-24">
              <div className="rounded-2xl bg-surface-container/95 p-space-lg shadow-2xl relative overflow-hidden">
                <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full blur-3xl pointer-events-none" style={{ background: `${selColor}22` }} />
                <div className="relative">
                  <div className="aspect-[3/2.2] rounded-xl mb-space-md overflow-hidden flex items-center justify-center" style={{ background: `radial-gradient(circle at 50% 40%, ${selColor}33, transparent 70%)` }}>
                    {STAR_IMG[sel.id] ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img alt={sel.name} src={STAR_IMG[sel.id]} className="w-full h-full object-cover" />
                    ) : (
                      <StarArt name={sel.name} element={sel.element} color={selColor} />
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h2 className="font-headline-md text-[22px] text-primary font-bold">{sel.name}</h2>
                    <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold" style={{ color: selColor, background: `${selColor}1a` }}>{sel.element}</span>
                  </div>
                  <span className="font-label-esoteric text-label-esoteric text-secondary uppercase tracking-wider">{CAT_LABEL[sel.cat]} · {sel.hoa}</span>

                  <div className="grid grid-cols-2 gap-space-sm my-space-md">
                    <div className="rounded-lg bg-surface-container-low/80 p-space-sm">
                      <span className="text-[10px] text-on-surface-variant uppercase">Miếu Vượng</span>
                      <p className="font-title-sm text-[13px] text-on-surface font-semibold">{sel.mieu}</p>
                    </div>
                    <div className="rounded-lg bg-surface-container-low/80 p-space-sm flex flex-col gap-space-sm justify-center">
                      <Meter label="Lực tinh" value={sel.power} color={selColor} />
                      <Meter label="Uy vọng" value={sel.prestige} color="#ffb95f" />
                    </div>
                  </div>

                  <p className="font-body-md text-body-md text-on-surface-variant leading-[1.8]">{sel.desc}</p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
