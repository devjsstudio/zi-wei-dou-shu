'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react';
import AppHeader from '@/components/AppHeader';
import { HANH_COLOR, type NguHanh } from '@/lib/tools';

interface Track { hanh: NguHanh; cung: string; tang: string; desc: string; freq: number; }
const TRACKS: Track[] = [
  { hanh: 'Kim', cung: 'Thương', tang: 'Phế Khí', desc: 'Thanh tao, định tâm, tan âu lo phiền muộn', freq: 528 },
  { hanh: 'Mộc', cung: 'Giốc', tang: 'Can Đởm', desc: 'Sinh sôi, khai mở trí tuệ, dưỡng khí gan mật', freq: 396 },
  { hanh: 'Thủy', cung: 'Vũ', tang: 'Thận Thủy', desc: 'An tịnh, dưỡng thận, thanh lọc trường năng lượng', freq: 432 },
  { hanh: 'Hỏa', cung: 'Chủy', tang: 'Tâm Bào', desc: 'Nhiệt huyết, kích hoạt đam mê, vượng tâm mạch', freq: 639 },
  { hanh: 'Thổ', cung: 'Cung', tang: 'Tỳ Vị', desc: 'Vững vàng, an định tâm trí, hòa hợp tỳ vị', freq: 741 },
];

const TIMERS = [15, 30, 45, 60];

const SCHOOLS = ['Tất Cả Môn Phái', 'Tử Vi Nam Phái', 'Bắc Phái Khâm Thiên', 'Tứ Hóa Phi Tinh', 'Phong Thủy Bát Trạch'];

interface Master { name: string; school: string; tag: string; desc: string; rating: number; reviews: number; stat: string; form: string; slots: string[]; fee: string; img: string; }
const MASTERS: Master[] = [
  { name: 'Đại Sư Huyền Không Đạo Trưởng', school: 'Tử Vi Nam Phái', tag: '35 năm nghiên cứu di sản Hoàng Triều', desc: 'Luận mệnh chính tông triều Nguyễn, trạch cát đại sự.', rating: 5.0, reviews: 980, stat: '12.000+ Lá Số', form: 'Video Call 1-1 HD', slots: ['Hôm nay • 15:00', 'Hôm nay • 20:30'], fee: '1.500.000đ', img: '/_assets/stitch/img17.png' },
  { name: 'Pháp Sư Tinh Anh Tứ Hóa', school: 'Tứ Hóa Phi Tinh', tag: 'Chuyên gia định vị biến động chu kỳ vận thế', desc: 'Mũi nhọn Tài Vận & Sự Nghiệp, phi tinh tứ hóa.', rating: 4.9, reviews: 640, stat: '8.500+ Hồ Sơ', form: 'Video Call 1-1', slots: ['Ngày mai • 09:30', 'Ngày mai • 14:00'], fee: '1.200.000đ', img: '/_assets/stitch/img20.png' },
  { name: 'Nữ Danh Sư Tuệ Nhã', school: 'Bắc Phái Khâm Thiên', tag: 'Khắc phục xung khắc cung Phu Thê & Gia Đạo', desc: 'Hợp duyên phu thê, hóa sát, điều hòa gia đạo.', rating: 5.0, reviews: 420, stat: '5.200+ Cặp Đôi', form: '30 Phút Trọng Tâm', slots: ['Thứ Bảy • 10:00', 'Thứ Bảy • 16:30'], fee: '1.000.000đ', img: '/_assets/stitch/img23.png' },
];

export default function AmNhacPage() {
  const [cur, setCur] = useState(2); // Thủy – Vũ mặc định
  const [playing, setPlaying] = useState(false);
  const [timer, setTimer] = useState(30);
  const [remain, setRemain] = useState(30 * 60);
  const [school, setSchool] = useState(SCHOOLS[0]);
  const [booked, setBooked] = useState<Master | null>(null);

  const ctxRef = useRef<any>(null);
  const oscRef = useRef<any>(null);
  const gainRef = useRef<any>(null);

  const stopTone = () => {
    try { gainRef.current?.gain.linearRampToValueAtTime(0, (ctxRef.current?.currentTime ?? 0) + 0.3); oscRef.current?.stop((ctxRef.current?.currentTime ?? 0) + 0.35); } catch { /* ignore */ }
    oscRef.current = null;
  };
  const startTone = (freq: number) => {
    try {
      if (!ctxRef.current) ctxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      const ctx = ctxRef.current; if (ctx.state === 'suspended') ctx.resume();
      stopTone();
      const osc = ctx.createOscillator(); const gain = ctx.createGain();
      osc.type = 'sine'; osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, ctx.currentTime); gain.gain.linearRampToValueAtTime(0.09, ctx.currentTime + 0.6);
      osc.connect(gain); gain.connect(ctx.destination); osc.start();
      oscRef.current = osc; gainRef.current = gain;
    } catch { /* Web Audio không khả dụng */ }
  };

  const toggle = () => {
    if (playing) { stopTone(); setPlaying(false); }
    else { startTone(TRACKS[cur].freq); setPlaying(true); if (remain <= 0) setRemain(timer * 60); }
  };
  const select = (i: number) => { setCur(i); if (playing) startTone(TRACKS[i].freq); };

  // Đếm ngược hẹn giờ thiền
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setRemain((r) => { if (r <= 1) { stopTone(); setPlaying(false); return 0; } return r - 1; }), 1000);
    return () => clearInterval(id);
  }, [playing]);
  useEffect(() => () => stopTone(), []);
  useEffect(() => { if (!playing) setRemain(timer * 60); }, [timer, playing]);

  const mm = String(Math.floor(remain / 60)).padStart(2, '0');
  const ss = String(remain % 60).padStart(2, '0');
  const track = TRACKS[cur];
  const masters = MASTERS.filter((m) => school === SCHOOLS[0] || m.school === school);

  return (
    <div className="bg-background font-body-md text-on-surface min-h-screen">
      <AppHeader active="am-nhac" />
      <main className="w-full pt-16 md:pt-20 min-h-screen relative overflow-hidden">
        <div className="absolute -top-24 right-1/3 w-96 h-96 rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
        <div className="w-full max-w-[1280px] mx-auto px-margin-mobile md:px-space-lg lg:px-margin py-space-lg relative">
          <div className="flex flex-col gap-1 mb-space-lg">
            <span className="px-space-sm py-0.5 rounded-full bg-surface-container-high text-secondary font-label-esoteric text-label-esoteric uppercase tracking-wider w-fit">Pháp Âm Thanh Tịnh · Khâm Thiên Tinh Đạo</span>
            <h1 className="font-headline-lg text-[26px] md:text-headline-lg text-primary tracking-tight uppercase">Ngũ Âm Dưỡng Tâm · Thiền Đạo & Đặt Lịch Đại Sư</h1>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl">Năm cung bậc ngũ âm phát tần số chữa lành thật qua Web Audio, dưỡng ngũ tạng theo hành. Kết nối đại sư luận giải 1-1.</p>
          </div>

          {/* Phân hệ I: trình phát */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
            <section className="lg:col-span-5">
              <div className="rounded-2xl bg-gradient-to-b from-primary-container/20 to-surface-container p-space-lg shadow-2xl">
                <span className="font-label-esoteric text-label-esoteric text-secondary uppercase">Phân Hệ I · Trình Phát Nhạc Thiền</span>
                <div className="flex flex-col items-center text-center mt-space-md">
                  <div className="relative w-44 h-44 flex items-center justify-center mb-space-md">
                    <div className={`absolute inset-0 rounded-full border-2 ${playing ? 'animate-ping' : ''}`} style={{ borderColor: `${HANH_COLOR[track.hanh]}55`, animationDuration: '2.4s' }} />
                    <div className="absolute inset-4 rounded-full" style={{ background: `radial-gradient(circle, ${HANH_COLOR[track.hanh]}33, transparent 72%)` }} />
                    <div className="relative flex flex-col items-center">
                      <span className="material-symbols-outlined text-[46px]" style={{ color: HANH_COLOR[track.hanh], fontVariationSettings: "'FILL' 1" }}>spatial_audio_off</span>
                      <span className="font-headline-md text-[20px] font-bold mt-1" style={{ color: HANH_COLOR[track.hanh] }}>{track.freq} Hz</span>
                    </div>
                  </div>
                  <p className="font-headline-sm text-[16px] text-on-surface font-semibold">Hành {track.hanh} · Cung {track.cung}</p>
                  <p className="font-body-sm text-[12px] text-on-surface-variant mb-space-md">Dưỡng {track.tang} — {track.desc}</p>

                  <div className="w-full flex items-center justify-between font-mono text-[13px] text-on-surface-variant mb-1.5">
                    <span style={{ color: HANH_COLOR[track.hanh] }}>{mm}:{ss}</span>
                    <span>{String(timer).padStart(2, '0')}:00</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-surface-container-lowest overflow-hidden mb-space-md">
                    <div className="h-full rounded-full transition-all" style={{ width: `${100 - (remain / (timer * 60)) * 100}%`, background: HANH_COLOR[track.hanh] }} />
                  </div>

                  <div className="flex items-center gap-space-lg mb-space-md">
                    <button type="button" onClick={() => select((cur + TRACKS.length - 1) % TRACKS.length)} className="text-on-surface-variant hover:text-primary"><span className="material-symbols-outlined text-[28px]">skip_previous</span></button>
                    <button type="button" onClick={toggle} className="w-16 h-16 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-lg hover:brightness-110">
                      <span className="material-symbols-outlined text-[34px]" style={{ fontVariationSettings: "'FILL' 1" }}>{playing ? 'pause' : 'play_arrow'}</span>
                    </button>
                    <button type="button" onClick={() => select((cur + 1) % TRACKS.length)} className="text-on-surface-variant hover:text-primary"><span className="material-symbols-outlined text-[28px]">skip_next</span></button>
                  </div>

                  <div className="w-full">
                    <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Hẹn giờ thiền</span>
                    <div className="flex items-center gap-2 mt-1.5">
                      {TIMERS.map((t) => (
                        <button key={t} type="button" onClick={() => setTimer(t)}
                          className={`flex-1 py-2 rounded-xl font-label-md text-label-md font-semibold transition-all ${timer === t ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant hover:text-primary'}`}>{t}p</button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="lg:col-span-7">
              <div className="flex items-center gap-space-xs mb-space-md">
                <span className="material-symbols-outlined text-primary">graphic_eq</span>
                <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">Cổ Truyền Lạc Luật · 5 Cung Bậc Ngũ Âm</span>
              </div>
              <div className="flex flex-col gap-space-sm">
                {TRACKS.map((t, i) => {
                  const active = i === cur; const col = HANH_COLOR[t.hanh];
                  return (
                    <button key={t.hanh} type="button" onClick={() => select(i)}
                      className={`flex items-center gap-space-md p-space-md rounded-2xl text-left shadow-md transition-all ${active ? 'bg-surface-container ring-2 ring-primary/60' : 'bg-surface-container-low/90 hover:bg-surface-container'}`}>
                      <span className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${col}1a` }}>
                        <span className="material-symbols-outlined text-[26px]" style={{ color: col }}>music_note</span>
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-headline-sm text-[15px] font-bold" style={{ color: col }}>Hành {t.hanh} · Cung {t.cung}</span>
                          <span className="font-body-sm text-[11px] text-on-surface-variant">{t.freq}Hz · {t.tang}</span>
                        </div>
                        <p className="font-body-sm text-[12px] text-on-surface-variant truncate">{t.desc}</p>
                      </div>
                      {active && playing
                        ? <span className="font-label-sm text-[10px] px-2 py-0.5 rounded bg-tertiary/20 text-tertiary font-bold animate-pulse whitespace-nowrap">ĐANG PHÁT</span>
                        : <span className="material-symbols-outlined text-[24px]" style={{ color: col }}>{active ? 'album' : 'play_circle'}</span>}
                    </button>
                  );
                })}
              </div>
            </section>
          </div>

          {/* Phân hệ II: đặt lịch đại sư */}
          <div className="mt-space-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md mb-space-md">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary">self_improvement</span>
                <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">Phân Hệ II · Kết Nối Đại Sư Thực Tế (1-1)</span>
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                {SCHOOLS.map((s) => (
                  <button key={s} type="button" onClick={() => setSchool(s)}
                    className={`px-3 py-1.5 rounded-full font-label-sm text-label-sm whitespace-nowrap transition-all ${school === s ? 'bg-primary text-on-primary font-bold' : 'bg-surface-container-high text-on-surface-variant hover:text-primary'}`}>{s}</button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
              {masters.map((m) => (
                <div key={m.name} className="rounded-2xl bg-surface-container-low/95 p-space-md shadow-xl flex flex-col">
                  <div className="flex items-center gap-space-sm mb-space-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img alt={m.name} src={m.img} className="w-14 h-14 rounded-full object-cover shrink-0 ring-1 ring-primary/30" />
                    <div className="min-w-0">
                      <span className="font-label-esoteric text-[10px] text-secondary uppercase">{m.school}</span>
                      <p className="font-headline-sm text-[14px] text-on-surface font-bold leading-tight">{m.name}</p>
                      <div className="flex items-center gap-1 text-[11px]">
                        <span className="material-symbols-outlined text-secondary text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="text-secondary font-bold">{m.rating.toFixed(1)}</span>
                        <span className="text-on-surface-variant">({m.reviews})</span>
                      </div>
                    </div>
                  </div>
                  <p className="font-body-sm text-[12px] text-on-surface-variant mb-space-sm flex-1">{m.desc}</p>
                  <div className="grid grid-cols-2 gap-2 text-[11px] mb-space-sm">
                    <Mini k="Đã luận" v={m.stat} />
                    <Mini k="Hình thức" v={m.form} />
                  </div>
                  <div className="rounded-lg bg-surface-container/70 p-space-sm mb-space-sm">
                    <span className="text-[10px] text-on-surface-variant uppercase flex items-center gap-1"><span className="material-symbols-outlined text-[13px]">schedule</span>Khung giờ trống</span>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {m.slots.map((s) => <span key={s} className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-semibold">{s}</span>)}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-space-sm">
                    <span className="font-headline-sm text-[16px] text-primary font-bold">{m.fee}</span>
                    <span className="font-body-sm text-[10px] text-on-surface-variant">/ phiên</span>
                  </div>
                  <button type="button" onClick={() => setBooked(m)}
                    className="w-full py-2.5 rounded-full bg-primary text-on-primary font-label-md text-label-md font-bold hover:brightness-110 flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">calendar_month</span>Đặt Lịch 1-1
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Modal đặt lịch (giả lập — không thu thông tin thanh toán) */}
      {booked && (
        <div className="fixed inset-0 z-[9998] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setBooked(null)}>
          <div className="w-full max-w-sm rounded-2xl bg-surface-container p-space-lg shadow-2xl text-center" onClick={(e) => e.stopPropagation()}>
            <span className="material-symbols-outlined text-tertiary text-[44px]">event_available</span>
            <h2 className="font-headline-sm text-headline-sm text-primary font-bold mt-space-sm">Đã gửi yêu cầu đặt lịch</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-space-sm">Phiên luận 1-1 với <span className="text-on-surface font-semibold">{booked.name}</span> ({booked.form}). Đại sư sẽ xác nhận khung giờ qua liên hệ của bạn.</p>
            <p className="font-body-sm text-[11px] text-on-surface-variant mt-space-sm italic">* Đây là bản demo — hệ thống chưa thu phí hay thông tin thanh toán thật.</p>
            <button type="button" onClick={() => setBooked(null)} className="mt-space-md w-full py-2.5 rounded-full bg-primary text-on-primary font-label-md text-label-md font-bold">Đã hiểu</button>
          </div>
        </div>
      )}
    </div>
  );
}

function Mini({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-lg bg-surface-container/70 p-space-sm">
      <span className="text-[9px] text-on-surface-variant uppercase block">{k}</span>
      <span className="text-[12px] text-on-surface font-semibold">{v}</span>
    </div>
  );
}
