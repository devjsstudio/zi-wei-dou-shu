'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AppHeader from '@/components/AppHeader';
import { useLocale } from '@/components/LocaleProvider';
import { lunarToSolar } from '@/lib/ziwei/lunar-solar';
import type { BirthInfo } from '@/lib/ziwei/types';

/**
 * Trang Chủ & Lập Lá Số —— bố cục "Mystical Oriental Luxury" (theo thiết kế Stitch).
 * Hero + tinh bàn xoay + form "Khởi Bàn An Mệnh" (lập lá số thật) + banner triết lý.
 * Form gửi lá số sang /chart qua sessionStorage.
 */

const BRANCHES_VI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];
const BRANCH_HAN = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const BRANCH_RANGE = ['23–1h', '1–3h', '3–5h', '5–7h', '7–9h', '9–11h', '11–13h', '13–15h', '15–17h', '17–19h', '19–21h', '21–23h'];

export default function HomePage() {
  const router = useRouter();
  const { tr } = useLocale();

  const now = new Date();
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [cal, setCal] = useState<'solar' | 'lunar'>('solar');
  const [day, setDay] = useState('15');
  const [month, setMonth] = useState('8');
  const [year, setYear] = useState('1990');
  const [hour, setHour] = useState(4); // branch index 0-11
  const [leap, setLeap] = useState(false);
  const [err, setErr] = useState('');

  const loadSample = (n: string, g: 'male' | 'female', d: string, mo: string, y: string, hb: number) => {
    setName(n); setGender(g); setDay(d); setMonth(mo); setYear(y); setHour(hb); setCal('solar'); setErr('');
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    let Y = parseInt(year), M = parseInt(month), D = parseInt(day);
    if (!Y || !M || !D) { setErr(tr('请填写完整出生日期', 'Vui lòng nhập đủ ngày tháng năm sinh')); return; }
    if (cal === 'lunar') {
      const s = lunarToSolar(Y, M, D, leap);
      if (!s) { setErr(tr('农历日期无效', 'Ngày âm lịch không hợp lệ')); return; }
      Y = s.year; M = s.month; D = s.day;
    }
    const info: BirthInfo = { year: Y, month: M, day: D, hour, gender, name: name.trim() || undefined };
    try { sessionStorage.setItem('ziwei-birth', JSON.stringify(info)); } catch { /* ignore */ }
    router.push('/chart');
  };

  const years = Array.from({ length: 127 }, (_, i) => 2026 - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="bg-background font-body-md text-on-surface min-h-screen selection:bg-primary selection:text-on-primary">
      <AppHeader active="lap-la-so" />

      {/* ─── Main ─── */}
      <main className="w-full pt-16 md:pt-20 bg-background min-h-screen relative">
        <div className="w-full max-w-[1536px] mx-auto px-margin-mobile md:px-space-lg lg:px-margin py-space-lg">
          <div className="flex flex-col w-full relative">
            {/* Celestial ambience */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[640px] pointer-events-none overflow-hidden select-none -z-10">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[720px] h-[720px] bg-primary/10 rounded-full blur-[140px]" />
              <div className="absolute top-48 left-1/4 w-[360px] h-[360px] bg-secondary/10 rounded-full blur-[100px]" />
              <div className="absolute top-36 right-1/4 w-[320px] h-[320px] bg-tertiary-container/10 rounded-full blur-[90px]" />
            </div>

            {/* ─── Hero ─── */}
            <section className="relative w-full flex flex-col items-center text-center pt-space-md pb-space-lg lg:pb-space-xl">
              <div className="inline-flex items-center gap-space-xs px-space-md py-1 rounded-full bg-surface-container-high/70 shadow-md backdrop-blur-md mb-space-md">
                <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                <span className="font-label-esoteric text-label-esoteric text-primary uppercase tracking-[0.25em]">Mật Truyền Khâm Thiên Giám • Hoàng Gia Bí Pháp</span>
                <span className="material-symbols-outlined text-primary text-[14px]">auto_awesome</span>
              </div>

              <h1 className="font-headline-xl text-[32px] leading-[40px] md:text-headline-xl text-primary max-w-4xl tracking-tight leading-tight uppercase drop-shadow-[0_2px_18px_rgba(242,202,80,0.35)]">
                THIÊN CƠ TINH TƯỢNG
                <span className="text-on-background font-headline-md text-headline-md tracking-normal font-medium mt-space-xs block normal-case">
                  Khám Phá Vận Mệnh Tiền Định &amp; Đồ Hình Tinh Bàn
                </span>
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mt-space-md px-space-sm leading-relaxed">
                Thấu triệt 12 cung số tử vi, luận giải Thiên Can Địa Chi, kích hoạt cát tường hóa giải hung tinh qua pháp điển Tử Vi Khâm Thiên Môn hoàng gia.
              </p>

              {/* Astrolabe / BaGua centerpiece */}
              <div className="relative w-72 h-72 md:w-96 md:h-96 my-space-lg flex items-center justify-center">
                {/* Outer rotating zodiac ring */}
                <div className="absolute inset-0 rounded-full shadow-[0_0_50px_rgba(212,175,55,0.18)] flex items-center justify-center animate-[spin_120s_linear_infinite]">
                  <svg className="w-full h-full text-primary/40" viewBox="0 0 400 400">
                    <circle cx="200" cy="200" fill="none" r="190" stroke="currentColor" strokeDasharray="4 6" strokeWidth="1.2" />
                    <circle cx="200" cy="200" fill="none" r="170" stroke="currentColor" strokeWidth="0.8" />
                    <g stroke="currentColor" strokeWidth="1.5">
                      <line x1="200" x2="200" y1="10" y2="28" />
                      <line x1="200" x2="200" y1="372" y2="390" />
                      <line x1="10" x2="28" y1="200" y2="200" />
                      <line x1="372" x2="390" y1="200" y2="200" />
                      <line x1="66" x2="79" y1="66" y2="79" />
                      <line x1="321" x2="334" y1="321" y2="334" />
                      <line x1="66" x2="79" y1="334" y2="321" />
                      <line x1="321" x2="334" y1="79" y2="66" />
                    </g>
                    <text className="font-label-esoteric text-[11px] font-bold" fill="currentColor" x="195" y="44">TÝ</text>
                    <text className="font-label-esoteric text-[11px]" fill="currentColor" x="278" y="66">SỬU</text>
                    <text className="font-label-esoteric text-[11px]" fill="currentColor" x="340" y="128">DẦN</text>
                    <text className="font-label-esoteric text-[11px] font-bold" fill="currentColor" x="362" y="204">MÃO</text>
                    <text className="font-label-esoteric text-[11px]" fill="currentColor" x="340" y="280">THÌN</text>
                    <text className="font-label-esoteric text-[11px]" fill="currentColor" x="278" y="342">TỴ</text>
                    <text className="font-label-esoteric text-[11px] font-bold" fill="currentColor" x="195" y="366">NGỌ</text>
                    <text className="font-label-esoteric text-[11px]" fill="currentColor" x="110" y="342">MÙI</text>
                    <text className="font-label-esoteric text-[11px]" fill="currentColor" x="50" y="280">THÂN</text>
                    <text className="font-label-esoteric text-[11px] font-bold" fill="currentColor" x="30" y="204">DẬU</text>
                    <text className="font-label-esoteric text-[11px]" fill="currentColor" x="50" y="128">TUẤT</text>
                    <text className="font-label-esoteric text-[11px]" fill="currentColor" x="110" y="66">HỢI</text>
                  </svg>
                </div>
                {/* Mid bagua ring (reverse) */}
                <div className="absolute w-[75%] h-[75%] rounded-full shadow-[0_0_35px_rgba(245,158,11,0.22)] animate-[spin_90s_linear_infinite_reverse] flex items-center justify-center">
                  <svg className="w-full h-full text-secondary/60" viewBox="0 0 300 300">
                    <circle cx="150" cy="150" fill="none" r="142" stroke="currentColor" strokeWidth="1.2" />
                    <polygon fill="none" opacity="0.6" points="150,14 188,38 214,14 246,54 286,86 262,112 286,150 262,188 286,214 246,246 214,286 188,262 150,286 112,262 86,286 54,246 14,214 38,188 14,150 38,112 14,86 54,54 86,14 112,38" stroke="currentColor" strokeWidth="0.8" />
                    <circle cx="150" cy="150" fill="none" r="95" stroke="currentColor" strokeDasharray="2 4" strokeWidth="1" />
                  </svg>
                </div>
                {/* Central golden core */}
                <div className="relative w-36 h-36 rounded-full bg-gradient-to-tr from-surface-container-lowest via-surface-container-high to-surface-container shadow-[0_0_36px_rgba(242,202,80,0.5)] flex items-center justify-center backdrop-blur-xl">
                  <div className="absolute inset-1 rounded-full bg-surface-container-low flex items-center justify-center overflow-hidden">
                    <div className="absolute w-28 h-28 rounded-full bg-gradient-to-b from-primary/20 to-transparent blur-md" />
                    <div className="flex flex-col items-center justify-center text-primary z-10">
                      <span className="material-symbols-outlined text-[42px] drop-shadow-[0_0_12px_rgba(242,202,80,0.8)]" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
                      <span className="font-headline-sm text-headline-sm text-primary -mt-1 font-bold tracking-wider">THIÊN BÀN</span>
                      <span className="font-label-esoteric text-[10px] text-secondary tracking-widest uppercase">Cửu Trọng Thiên</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3 badges */}
              <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-space-md mt-space-xs">
                {[
                  { icon: 'verified', color: 'text-primary', t: 'Khâm Thiên Môn 100%', d: 'Quy chuẩn lịch số triều Nguyễn chính thống' },
                  { icon: 'hub', color: 'text-secondary', t: '108 Tinh Tú & Tứ Hóa', d: 'Lập quẻ sâu sắc, an sao đắc - miếu - hãm địa' },
                  { icon: 'psychology', color: 'text-tertiary', t: 'Đại Sư AI Luận Giải', d: 'Phân tích đa tầng thời gian thực cá nhân hóa' },
                ].map((b) => (
                  <div key={b.t} className="flex items-center gap-space-md p-space-md rounded-xl bg-surface-container/70 shadow-lg backdrop-blur-md">
                    <div className={`w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center ${b.color} shrink-0 shadow-inner`}>
                      <span className="material-symbols-outlined text-[26px]">{b.icon}</span>
                    </div>
                    <div className="text-left">
                      <span className="font-title-sm text-title-sm text-on-surface block font-semibold">{b.t}</span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">{b.d}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ─── Form card ─── */}
            <section className="relative w-full max-w-4xl mx-auto my-space-lg">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary-container/20 via-primary/30 to-secondary-container/20 blur-xl opacity-75" />
              <div className="relative bg-surface-container-low/90 rounded-2xl shadow-[0_16px_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl p-space-md sm:p-space-lg md:p-space-xl overflow-hidden">
                {/* corner filigree */}
                {['top-2 left-2', 'top-2 right-2 rotate-90', 'bottom-2 left-2 -rotate-90', 'bottom-2 right-2 rotate-180'].map((pos) => (
                  <div key={pos} className={`absolute ${pos} w-8 h-8 pointer-events-none text-primary/40 flex items-center justify-center`}>
                    <svg className="w-full h-full fill-current" viewBox="0 0 32 32"><path d="M2 2h14v2H4v12H2V2zm4 4h8v2H8v6H6V6z" /></svg>
                  </div>
                ))}

                {/* header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pb-space-lg mb-space-lg border-b border-outline-variant/40">
                  <div className="flex items-center gap-space-md">
                    <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-primary shadow-md">
                      <span className="material-symbols-outlined text-[28px]">edit_note</span>
                    </div>
                    <div className="text-left">
                      <h2 className="font-headline-sm text-headline-sm text-primary font-bold">Khởi Bàn An Mệnh</h2>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">Nhập chính xác bát tự để nạp khí thiên can, định vị các cung vị</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-space-xs self-start sm:self-center px-space-md py-1.5 rounded-full bg-surface-container-high/90">
                    <span className="material-symbols-outlined text-secondary text-[16px]">menu_book</span>
                    <span className="font-label-esoteric text-label-esoteric text-secondary">Khâm Định Vạn Niên Thư</span>
                  </div>
                </div>

                <form className="flex flex-col gap-space-lg" onSubmit={submit}>
                  {/* name + gender */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                    <div className="flex flex-col gap-space-xs">
                      <label className="font-label-md text-label-md text-on-surface-variant uppercase">Họ &amp; Tên</label>
                      <div className="relative">
                        <span className="material-symbols-outlined text-primary/70 text-[20px] absolute left-3.5 top-1/2 -translate-y-1/2">badge</span>
                        <input
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Ví dụ: Nguyễn Hoàng Thiên Ân"
                          className="w-full h-12 pl-11 pr-space-md rounded-xl bg-surface-container-lowest text-on-surface font-title-sm text-title-sm placeholder:text-on-surface-variant/40 focus:outline-none focus:shadow-[0_0_0_2px_rgba(242,202,80,0.5)] transition-all"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-space-xs">
                      <label className="font-label-md text-label-md text-on-surface-variant uppercase">Giới Tính</label>
                      <div className="grid grid-cols-2 gap-space-sm h-12">
                        {(['male', 'female'] as const).map((g) => (
                          <button
                            key={g}
                            type="button"
                            onClick={() => setGender(g)}
                            className={gender === g
                              ? 'flex items-center justify-center gap-space-xs rounded-xl bg-primary text-on-primary font-title-sm text-title-sm shadow-[0_0_16px_rgba(242,202,80,0.35)] transition-all'
                              : 'flex items-center justify-center gap-space-xs rounded-xl bg-surface-container text-on-surface-variant font-title-sm text-title-sm hover:bg-surface-container-high transition-all'}
                          >
                            <span className="material-symbols-outlined text-[18px]">{g === 'male' ? 'male' : 'female'}</span>
                            {g === 'male' ? 'Càn Nam' : 'Khôn Nữ'}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* date + calendar toggle */}
                  <div className="flex flex-col gap-space-sm">
                    <div className="flex items-center justify-between flex-wrap gap-space-sm">
                      <label className="font-label-md text-label-md text-on-surface-variant uppercase">Ngày Sinh</label>
                      <div className="flex items-center gap-1 bg-surface-container rounded-full p-1">
                        {(['solar', 'lunar'] as const).map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => setCal(c)}
                            className={cal === c
                              ? 'px-space-md py-1 rounded-full font-label-md text-label-md bg-primary text-on-primary shadow-sm transition-all'
                              : 'px-space-md py-1 rounded-full font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-all'}
                          >
                            {c === 'solar' ? 'Dương Lịch' : 'Âm Lịch'}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-space-sm">
                      <select value={day} onChange={(e) => setDay(e.target.value)} className="h-11 px-space-sm rounded-lg bg-surface-container-lowest text-on-surface font-title-sm text-title-sm focus:outline-none focus:shadow-[0_0_0_2px_rgba(242,202,80,0.5)] cursor-pointer">
                        {days.map((d) => <option key={d} value={d}>Ngày {d}</option>)}
                      </select>
                      <select value={month} onChange={(e) => setMonth(e.target.value)} className="h-11 px-space-sm rounded-lg bg-surface-container-lowest text-on-surface font-title-sm text-title-sm focus:outline-none focus:shadow-[0_0_0_2px_rgba(242,202,80,0.5)] cursor-pointer">
                        {months.map((m) => <option key={m} value={m}>Tháng {m}</option>)}
                      </select>
                      <select value={year} onChange={(e) => setYear(e.target.value)} className="h-11 px-space-sm rounded-lg bg-surface-container-lowest text-on-surface font-title-sm text-title-sm focus:outline-none focus:shadow-[0_0_0_2px_rgba(242,202,80,0.5)] cursor-pointer">
                        {years.map((y) => <option key={y} value={y}>Năm {y}</option>)}
                      </select>
                    </div>
                    {cal === 'lunar' && (
                      <label className="flex items-center gap-space-xs text-on-surface-variant font-body-sm text-body-sm cursor-pointer">
                        <input type="checkbox" checked={leap} onChange={(e) => setLeap(e.target.checked)} className="accent-primary" />
                        Tháng nhuận
                      </label>
                    )}
                  </div>

                  {/* 12 double-hours */}
                  <div className="flex flex-col gap-space-sm">
                    <label className="font-label-md text-label-md text-on-surface-variant uppercase flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-primary text-[16px]">schedule</span>
                      Canh Giờ Sinh (12 Thời Thần)
                    </label>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-space-sm">
                      {BRANCHES_VI.map((b, i) => (
                        <button
                          key={b}
                          type="button"
                          onClick={() => setHour(i)}
                          className={hour === i
                            ? 'flex flex-col items-center justify-center p-2 rounded-xl bg-primary text-on-primary shadow-[0_0_14px_rgba(242,202,80,0.35)] transition-all text-center'
                            : 'flex flex-col items-center justify-center p-2 rounded-xl bg-surface-container hover:bg-surface-container-high transition-all text-center'}
                        >
                          <span className={hour === i ? 'font-headline-sm text-[15px] font-bold' : 'font-headline-sm text-[15px] text-primary font-bold'}>Giờ {b}</span>
                          <span className={hour === i ? 'font-label-sm text-[10px] text-on-primary-container' : 'font-label-sm text-[10px] text-on-surface-variant'}>{BRANCH_RANGE[i]}</span>
                          <span className={hour === i ? 'font-label-esoteric text-[9px] text-on-primary-fixed-variant mt-0.5 font-bold' : 'font-label-esoteric text-[9px] text-secondary mt-0.5'}>{BRANCH_HAN[i]}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {err && <p className="font-body-sm text-body-sm text-error">✕ {err}</p>}

                  {/* submit */}
                  <button
                    type="submit"
                    className="relative w-full h-14 rounded-xl bg-gradient-to-r from-primary-container via-primary to-primary-fixed-dim text-on-primary font-title-md text-title-md font-bold tracking-wide shadow-[0_8px_30px_rgba(242,202,80,0.4)] hover:shadow-[0_8px_40px_rgba(242,202,80,0.6)] transition-all flex items-center justify-center gap-space-sm overflow-hidden group"
                  >
                    <span className="material-symbols-outlined">auto_awesome</span>
                    <span className="drop-shadow-sm">LẬP LÁ SỐ &amp; LUẬN GIẢI NGAY</span>
                  </button>

                  {/* templates */}
                  <div className="pt-space-sm flex flex-col gap-space-xs text-left">
                    <span className="font-label-esoteric text-label-esoteric text-on-surface-variant flex items-center gap-1.5 uppercase tracking-wider">
                      <span className="material-symbols-outlined text-primary text-[14px]">history_edu</span>
                      Thử nghiệm với các cách cục thượng phẩm mẫu:
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-space-sm mt-1">
                      <button type="button" onClick={() => loadSample('Doanh Nhân Vương Giả', 'male', '15', '8', '1988', 4)} className="flex items-center justify-between p-space-sm rounded-xl bg-surface-container hover:bg-surface-container-high transition-all text-left shadow-sm group">
                        <div className="flex items-center gap-space-sm">
                          <div className="w-8 h-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center font-bold font-headline-sm text-[12px]">TỬ</div>
                          <div className="flex flex-col">
                            <span className="font-title-sm text-[14px] text-on-surface group-hover:text-primary transition-colors">Doanh Nhân Mậu Thìn 1988</span>
                            <span className="font-body-sm text-[11px] text-on-surface-variant">Cách Cục: Tử Phủ Vũ Tướng • Đại Phú Quý</span>
                          </div>
                        </div>
                        <span className="material-symbols-outlined text-primary text-[18px]">play_circle</span>
                      </button>
                      <button type="button" onClick={() => loadSample('Học Giả Uyên Bác', 'female', '22', '4', '1992', 3)} className="flex items-center justify-between p-space-sm rounded-xl bg-surface-container hover:bg-surface-container-high transition-all text-left shadow-sm group">
                        <div className="flex items-center gap-space-sm">
                          <div className="w-8 h-8 rounded-lg bg-tertiary/20 text-tertiary flex items-center justify-center font-bold font-headline-sm text-[12px]">LƯƠNG</div>
                          <div className="flex flex-col">
                            <span className="font-title-sm text-[14px] text-on-surface group-hover:text-tertiary transition-colors">Học Giả Nhâm Thân 1992</span>
                            <span className="font-body-sm text-[11px] text-on-surface-variant">Cách Cục: Cơ Nguyệt Đồng Lương • Văn Tinh Đắc Địa</span>
                          </div>
                        </div>
                        <span className="material-symbols-outlined text-tertiary text-[18px]">play_circle</span>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </section>

            {/* ─── Philosophy banner ─── */}
            <section className="w-full max-w-5xl mx-auto my-space-lg grid grid-cols-1 md:grid-cols-3 gap-space-md text-left">
              {[
                { icon: 'balance', color: 'text-primary', t: 'Ngũ Hành Sinh Khắc', d: 'Phân tích định lượng tỷ lệ Kim - Mộc - Thủy - Hỏa - Thổ của bản mệnh và cung an thân, tìm kiếm dụng thần hóa giải xung khắc.' },
                { icon: 'crisis_alert', color: 'text-secondary', t: 'Thập Nhị Cung Vị', d: 'Chi tiết toàn diện Mệnh, Phụ, Phúc, Điền, Quan, Nô, Di, Tật, Tài, Tử, Phu Thê, Huynh Đệ qua đồ hình vạn tinh hội chiếu chuẩn xác.' },
                { icon: 'flare', color: 'text-tertiary', t: 'Lưu Niên Vận Hạn', d: 'Tra cứu đại vận 10 năm, tiểu hạn từng năm và nguyệt hạn từng tháng kèm lời khuyên cát tường hành động chuẩn huyền thư.' },
              ].map((c) => (
                <div key={c.t} className="p-space-lg rounded-2xl bg-surface-container-low/70 shadow-md backdrop-blur-md flex flex-col gap-space-xs">
                  <div className={`flex items-center gap-space-xs ${c.color} font-headline-sm text-headline-sm`}>
                    <span className="material-symbols-outlined">{c.icon}</span>
                    <span>{c.t}</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">{c.d}</p>
                </div>
              ))}
            </section>
          </div>
        </div>

        {/* ─── Footer ─── */}
        <footer className="w-full bg-surface-container-lowest py-space-xl mt-space-xl">
          <div className="w-full max-w-[1536px] mx-auto px-margin-mobile md:px-space-lg lg:px-margin flex flex-col md:flex-row items-center justify-between gap-space-lg text-center md:text-left">
            <div className="flex flex-col gap-1">
              <span className="font-headline-sm text-headline-sm text-primary">THIÊN CƠ TINH TƯỢNG</span>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Hệ Thống Lập &amp; Luận Giải Lá Số Tử Vi Đẩu Số Hoàng Gia Chuẩn Xác</p>
            </div>
            <div className="flex items-center gap-space-lg flex-wrap justify-center">
              <span className="font-label-esoteric text-label-esoteric text-secondary">Khâm Thiên Giám Pháp Tạng</span>
              <span className="font-label-esoteric text-label-esoteric text-on-surface-variant">© {now.getFullYear()} Thiên Cơ Tinh Tượng. Bảo lưu mọi quyền.</span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
