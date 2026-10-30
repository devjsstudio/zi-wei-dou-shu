'use client';
import { useEffect, useMemo, useState } from 'react';
import AppHeader from '@/components/AppHeader';
import { useStoredChart } from '@/lib/useStoredChart';
import { nayinOf, yearGanZhi, amDuong, hanhRelation, hanhSinh, HANH_COLOR, HANH_ICON, type NguHanh } from '@/lib/tools';

const STORE = 'ziwei-giapha';
const PORTRAITS = ['/_assets/stitch/img18.png', '/_assets/stitch/img19.png', '/_assets/stitch/img21.png', '/_assets/stitch/img22.png', '/_assets/stitch/img24.png', '/_assets/stitch/img25.png'];

const RELATIONS = ['Thân Phụ', 'Thân Mẫu', 'Phối Ngẫu', 'Trưởng Tử', 'Thứ Nam', 'Ái Nữ', 'Ông Bà Nội', 'Ông Bà Ngoại', 'Anh/Chị/Em Ruột'];

interface Member { id: string; name: string; year: number; relation: string; }

export default function GiaPhaPage() {
  const chart = useStoredChart();
  const [members, setMembers] = useState<Member[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', year: '', relation: RELATIONS[0] });

  useEffect(() => {
    try { const raw = localStorage.getItem(STORE); if (raw) setMembers(JSON.parse(raw)); } catch { /* ignore */ }
  }, []);
  const persist = (list: Member[]) => { setMembers(list); try { localStorage.setItem(STORE, JSON.stringify(list)); } catch { /* ignore */ } };

  const ownerYear = chart ? (chart.birthInfo.origInput?.year ?? chart.birthInfo.year) : 0;
  const ownerHanh = chart ? nayinOf(ownerYear).hanh : 'Thổ';
  const ownerName = chart?.birthInfo.name || 'Gia Chủ';

  const add = () => {
    const y = parseInt(form.year);
    if (!form.name.trim() || !y || y < 1900 || y > 2030) return;
    persist([...members, { id: String(Date.now()), name: form.name.trim(), year: y, relation: form.relation }]);
    setForm({ name: '', year: '', relation: RELATIONS[0] }); setOpen(false);
  };
  const remove = (id: string) => persist(members.filter((m) => m.id !== id));

  const rows = useMemo(() => members.map((m) => {
    const na = nayinOf(m.year);
    const rel = hanhRelation(na.hanh, ownerHanh);
    // khí vận: thiện cảm với gia chủ (score -2..2 → 40..98)
    const khiVan = Math.round(70 + rel.score * 11);
    return { ...m, nayin: na, hanh: na.hanh, rel, khiVan: Math.max(40, Math.min(98, khiVan)) };
  }), [members, ownerHanh]);

  const tuongDung = rows.length ? Math.round(rows.reduce((a, r) => a + r.khiVan, 0) / rows.length * 10) / 10 : 0;
  const dungThan = hanhSinh(ownerHanh); // hành gia chủ sinh ra... dùng để hòa giải: chọn hành trung gian
  // hành hòa giải = hành mà gia chủ sinh (xì hơi khắc) — đơn giản hóa
  const conflicts = rows.filter((r) => r.rel.type === 'khắc-nhập' || r.rel.type === 'khắc-xuất');

  return (
    <div className="bg-background font-body-md text-on-surface min-h-screen">
      <AppHeader active="gia-pha" />
      <main className="w-full pt-16 md:pt-20 min-h-screen relative overflow-hidden">
        <div className="absolute -top-24 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
        <div className="w-full max-w-[1280px] mx-auto px-margin-mobile md:px-space-lg lg:px-margin py-space-lg relative">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-space-md mb-space-lg">
            <div className="flex flex-col gap-1">
              <span className="px-space-sm py-0.5 rounded-full bg-surface-container-high text-secondary font-label-esoteric text-label-esoteric uppercase tracking-wider w-fit">Khâm Thiên Mệnh Tạng · Mạch Vận Tông Tộc</span>
              <h1 className="font-headline-lg text-[26px] md:text-headline-lg text-primary tracking-tight uppercase">Tông Tộc Khí Vận Đồ · Mạch Năng Lượng Gia Phả</h1>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl">Nạp âm ngũ hành từng thành viên tính theo năm sinh; quan hệ tương sinh – tương khắc đối chiếu bản mệnh gia chủ <span className="text-primary font-semibold">{ownerName}</span> ({ownerHanh}).</p>
            </div>
            <button type="button" onClick={() => setOpen(true)}
              className="flex items-center gap-space-sm px-space-md py-2.5 rounded-full bg-primary text-on-primary font-label-md text-label-md font-bold shadow-lg hover:brightness-110 whitespace-nowrap">
              <span className="material-symbols-outlined text-[20px]">group_add</span>Thêm Thành Viên Gia Phả
            </button>
          </div>

          {/* Tổng quan khí vận */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md mb-space-lg">
            <Stat icon="verified_user" label="Thành viên phả hệ" value={`${members.length} người`} tone="#f2ca50" />
            <Stat icon="all_inclusive" label="Độ tương dung khí vận" value={members.length ? `${tuongDung}%` : '—'} tone="#58e7aa" />
            <Stat icon="change_circle" label="Dụng thần hòa giải" value={`Hành ${dungThan}`} tone="#8fb6ff" />
          </div>

          {/* Gia chủ + thành viên */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-space-md">
            {/* Thẻ gia chủ */}
            {chart && (
              <div className="rounded-2xl bg-gradient-to-b from-primary-container/30 to-surface-container p-space-md shadow-xl ring-2 ring-primary/60 relative">
                <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-primary text-on-primary text-[9px] font-bold">GIA CHỦ</span>
                <div className="flex items-center gap-space-sm mb-space-sm">
                  <span className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ background: `${HANH_COLOR[ownerHanh]}22` }}>
                    <span className="material-symbols-outlined text-[26px]" style={{ color: HANH_COLOR[ownerHanh] }}>{HANH_ICON[ownerHanh]}</span>
                  </span>
                  <div className="min-w-0">
                    <p className="font-headline-sm text-[16px] text-primary font-bold truncate">{ownerName}</p>
                    <p className="font-body-sm text-[11px] text-on-surface-variant">{yearGanZhi(ownerYear)} {ownerYear} · {amDuong(ownerYear)} {chart.birthInfo.gender === 'male' ? 'Nam' : 'Nữ'}</p>
                  </div>
                </div>
                <div className="rounded-lg bg-surface-container-low/80 p-space-sm">
                  <span className="text-[10px] text-on-surface-variant uppercase">Bản mệnh</span>
                  <p className="font-title-sm text-[13px] font-semibold" style={{ color: HANH_COLOR[ownerHanh] }}>{nayinOf(ownerYear).name}</p>
                </div>
              </div>
            )}

            {rows.map((m, i) => {
              const col = HANH_COLOR[m.hanh];
              return (
                <div key={m.id} className="rounded-2xl bg-surface-container-low/95 p-space-md shadow-xl relative group">
                  <button type="button" onClick={() => remove(m.id)} title="Xóa"
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-surface-container-high text-on-surface-variant opacity-0 group-hover:opacity-100 hover:text-error flex items-center justify-center transition-all z-10">
                    <span className="material-symbols-outlined text-[15px]">close</span>
                  </button>
                  <div className="flex items-center gap-space-sm mb-space-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img alt={m.name} src={PORTRAITS[i % PORTRAITS.length]} className="w-12 h-12 rounded-full object-cover shrink-0 ring-1 ring-primary/30" />
                    <div className="min-w-0">
                      <span className="font-label-esoteric text-[10px] text-secondary uppercase">{m.relation}</span>
                      <p className="font-headline-sm text-[15px] text-on-surface font-bold truncate">{m.name}</p>
                      <p className="font-body-sm text-[11px] text-on-surface-variant">{yearGanZhi(m.year)} {m.year}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 mb-space-sm">
                    <span className="px-2 py-0.5 rounded font-label-sm text-[10px] font-bold" style={{ background: col, color: '#0a0e18' }}>{m.hanh}</span>
                    <span className="font-body-sm text-[11px] text-on-surface-variant truncate">{m.nayin.name}</span>
                  </div>
                  <div className="rounded-lg bg-surface-container/70 p-space-sm flex items-center justify-between">
                    <div className="min-w-0">
                      <span className="text-[10px] text-on-surface-variant uppercase block">Khí với gia chủ</span>
                      <span className={`font-title-sm text-[12px] font-semibold ${m.rel.score >= 1 ? 'text-tertiary' : m.rel.score <= -1 ? 'text-error' : 'text-secondary'}`}>{m.rel.label}</span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-on-surface-variant block">Khí vận</span>
                      <span className="font-headline-sm text-[16px] font-bold" style={{ color: col }}>{m.khiVan}</span>
                    </div>
                  </div>
                </div>
              );
            })}

            {members.length === 0 && (
              <button type="button" onClick={() => setOpen(true)}
                className="rounded-2xl border-2 border-dashed border-outline-variant/40 p-space-lg flex flex-col items-center justify-center gap-space-sm text-on-surface-variant hover:border-primary/50 hover:text-primary transition-all min-h-[160px]">
                <span className="material-symbols-outlined text-[36px]">person_add</span>
                <span className="font-body-md text-body-md">Thêm người thân đầu tiên vào gia phả</span>
              </button>
            )}
          </div>

          {/* Luận giải ngũ hành gia tộc */}
          {rows.length > 0 && (
            <div className="mt-space-lg grid grid-cols-1 lg:grid-cols-2 gap-space-md">
              <div className="rounded-2xl bg-surface-container/95 p-space-lg shadow-xl">
                <div className="flex items-center gap-space-xs mb-space-md">
                  <span className="material-symbols-outlined text-primary">spa</span>
                  <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">Phương Pháp Điều Hòa Vận Khí</span>
                </div>
                {conflicts.length > 0 ? (
                  <p className="font-body-md text-body-md text-on-surface-variant leading-[1.8]">
                    Bản mệnh {ownerHanh} có tương khắc với {conflicts.map((c) => `${c.relation} (${c.hanh})`).join(', ')}. Khuyên gia chủ dùng <span className="text-primary font-semibold">Hành {dungThan} làm Dụng Thần Hòa Giải</span> — bố trí vật phẩm, màu sắc, hướng thuộc hành {dungThan} để điều hòa, hóa giải xung khắc, tụ khí an hòa.
                  </p>
                ) : (
                  <p className="font-body-md text-body-md text-on-surface-variant leading-[1.8]">Các thành viên tương sinh – tỷ hòa thuận lợi với bản mệnh gia chủ. Gia đạo an định, khí vận tụ hội. Duy trì hành <span className="text-primary font-semibold">{dungThan}</span> làm dụng thần nuôi dưỡng để phúc thọ lâu bền.</p>
                )}
                <div className="mt-space-md flex items-center gap-space-md">
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-[11px] mb-1"><span className="text-on-surface-variant">Độ tương dung khí vận</span><span className="font-bold text-tertiary">{tuongDung}%</span></div>
                    <div className="h-2 rounded-full bg-surface-container-lowest overflow-hidden"><div className="h-full rounded-full bg-tertiary" style={{ width: `${tuongDung}%` }} /></div>
                  </div>
                  <span className="text-[11px] px-2 py-1 rounded bg-tertiary/10 text-tertiary font-semibold whitespace-nowrap">{tuongDung >= 80 ? 'An Định Phúc Thọ' : tuongDung >= 60 ? 'Khá Hòa Thuận' : 'Cần Điều Hòa'}</span>
                </div>
              </div>

              <div className="rounded-2xl bg-surface-container/95 p-space-lg shadow-xl">
                <div className="flex items-center gap-space-xs mb-space-md">
                  <span className="material-symbols-outlined text-primary">account_tree</span>
                  <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">Mạch Tương Sinh – Tương Khắc</span>
                </div>
                <div className="flex flex-col gap-2">
                  {rows.map((m) => (
                    <div key={m.id} className="flex items-center gap-space-sm">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: HANH_COLOR[m.hanh] }} />
                      <span className="font-body-md text-[13px] text-on-surface min-w-0 truncate flex-1">{m.relation} · {m.name}</span>
                      <span className={`font-label-sm text-[11px] font-semibold whitespace-nowrap ${m.rel.score >= 1 ? 'text-tertiary' : m.rel.score <= -1 ? 'text-error' : 'text-secondary'}`}>
                        {m.rel.type === 'tỷ-hòa' ? 'Tỷ hòa' : m.rel.type.startsWith('sinh') ? 'Tương sinh' : 'Tương khắc'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modal thêm thành viên */}
      {open && (
        <div className="fixed inset-0 z-[9998] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setOpen(false)}>
          <div className="w-full max-w-md rounded-2xl bg-surface-container p-space-lg shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-space-md">
              <h2 className="font-headline-sm text-headline-sm text-primary font-bold">Thêm Mạch Vận Gia Đình</h2>
              <button type="button" onClick={() => setOpen(false)} className="text-on-surface-variant hover:text-on-surface"><span className="material-symbols-outlined">close</span></button>
            </div>
            <div className="flex flex-col gap-space-md">
              <Field label="Họ & Tên Thành Viên">
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nhập họ tên"
                  className="w-full h-11 px-space-md rounded-xl bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:shadow-[0_0_0_2px_rgba(242,202,80,0.4)]" />
              </Field>
              <div className="grid grid-cols-2 gap-space-md">
                <Field label="Năm Sinh (DL)">
                  <input value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value.replace(/\D/g, '').slice(0, 4) })} inputMode="numeric" placeholder="VD: 1996"
                    className="w-full h-11 px-space-md rounded-xl bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:shadow-[0_0_0_2px_rgba(242,202,80,0.4)]" />
                  {form.year.length === 4 && <span className="text-[11px] text-tertiary mt-1 block">{nayinOf(parseInt(form.year)).name}</span>}
                </Field>
                <Field label="Quan Hệ Gia Đình">
                  <select value={form.relation} onChange={(e) => setForm({ ...form, relation: e.target.value })}
                    className="w-full h-11 px-space-md rounded-xl bg-surface-container-lowest text-on-surface focus:outline-none focus:shadow-[0_0_0_2px_rgba(242,202,80,0.4)]">
                    {RELATIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </Field>
              </div>
            </div>
            <div className="flex justify-end gap-space-sm mt-space-lg">
              <button type="button" onClick={() => setOpen(false)} className="px-space-md py-2.5 rounded-full bg-surface-container-high text-on-surface font-label-md text-label-md">Hủy Bỏ</button>
              <button type="button" onClick={add} className="px-space-md py-2.5 rounded-full bg-primary text-on-primary font-label-md text-label-md font-bold">Nhập Vào Phả Hệ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ icon, label, value, tone }: { icon: string; label: string; value: string; tone: string }) {
  return (
    <div className="rounded-2xl bg-surface-container-low/90 p-space-md shadow-xl flex items-center gap-space-md">
      <span className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${tone}1a`, color: tone }}>
        <span className="material-symbols-outlined text-[24px]">{icon}</span>
      </span>
      <div>
        <span className="font-body-sm text-[11px] text-on-surface-variant uppercase">{label}</span>
        <p className="font-headline-sm text-[18px] font-bold" style={{ color: tone }}>{value}</p>
      </div>
    </div>
  );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">{label}</span>
      {children}
    </label>
  );
}
