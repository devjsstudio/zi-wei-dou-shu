'use client';
import { motion } from 'framer-motion';
import type { Palace, Star } from '@/lib/ziwei/types';
import { STEMS, BRANCHES } from '@/lib/ziwei/constants';
import clsx from 'clsx';
import { useLocale } from './LocaleProvider';

interface PalaceCellProps {
  palace: Palace;
  onClick?: () => void;
  onStarClick?: (star: Star) => void;
  isSelected?: boolean;
  isSanFang?: boolean;
  delay?: number;
  /** 叠加四化：星名 → 四化类型（'禄'/'权'/'科'/'忌'） */
  overlayStarSiHua?: Record<string, string>;
  /** 叠加标签：'年'（流年）或 '限'（大限） */
  overlayLabel?: string;
  /** 点击叠加四化 badge 回调 */
  onSiHuaClick?: (starName: string, siHua: string) => void;
}

/** 14 chính tinh + sao phụ chính → màu ngũ hành (theo thiết kế Stitch) */
const EL_GOLD = '#F59E0B';   // 土 Thổ
const EL_GREEN = '#10B981';  // 木 Mộc
const EL_BLUE = '#38BDF8';   // 水 Thủy
const EL_WHITE = '#E2E8F0';  // 金 Kim
const EL_RED = '#F43F5E';    // 火 Hỏa

const STAR_COLOR: Record<string, string> = {
  '紫微': EL_GOLD, '天府': EL_GOLD, '天梁': EL_GOLD, '禄存': EL_GOLD, '左辅': EL_GOLD, '右弼': EL_GOLD,
  '天机': EL_GREEN, '文曲': EL_GREEN,
  '太阴': EL_BLUE, '天同': EL_BLUE, '巨门': EL_BLUE, '天相': EL_BLUE, '贪狼': EL_BLUE, '破军': EL_BLUE,
  '武曲': EL_WHITE, '七杀': EL_WHITE, '文昌': EL_WHITE,
  '太阳': EL_RED, '廉贞': EL_RED,
};

/** 天干 → màu ngũ hành (0-9 = 甲乙丙丁戊己庚辛壬癸) */
const STEM_COLOR = [EL_GREEN, EL_GREEN, EL_RED, EL_RED, EL_GOLD, EL_GOLD, EL_WHITE, EL_WHITE, EL_BLUE, EL_BLUE];

/** 7 档亮度 Hán → mã 1 chữ (hiển thị trong ngoặc) */
const BRIGHT_CODE: Record<string, string> = {
  '庙': 'M', '旺': 'V', '得': 'Đ', '利': 'L', '平': 'B', '不': 'B', '陷': 'H',
};

const SIHUA_STYLES: Record<string, string> = {
  '禄': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/40',
  '权': 'text-sky-400 bg-sky-500/10 border-sky-500/40',
  '科': 'text-yellow-400 bg-yellow-500/10 border-yellow-500/40',
  '忌': 'text-rose-400 bg-rose-500/10 border-rose-500/40',
};

const SiHuaBadge = ({
  siHua, overlay, label, onClick,
}: {
  siHua: string;
  overlay?: boolean;
  label?: string;
  onClick?: (e: React.MouseEvent) => void;
}) => {
  const { term } = useLocale();
  return (
    <span
      className={clsx(
        'inline-flex items-center text-[8px] px-1 rounded-full border leading-none py-px font-bold ml-1 flex-shrink-0',
        SIHUA_STYLES[siHua],
        overlay && 'border-dashed opacity-80',
        onClick && 'cursor-pointer hover:opacity-100',
      )}
      onClick={onClick}
    >
      {overlay && label && <span className="mr-px opacity-70">{label}</span>}
      {term(siHua)}
    </span>
  );
};

export default function PalaceCell({
  palace, onClick, onStarClick, isSelected, isSanFang, delay = 0,
  overlayStarSiHua, overlayLabel, onSiHuaClick,
}: PalaceCellProps) {
  const { branch, stem, name, stars, daXianAge, isMingGong, isShenGong } = palace;
  const { m, term, locale } = useLocale();
  const ganzhi = locale === 'vi'
    ? `${term(STEMS[stem])} ${term(BRANCHES[branch])}`
    : `${STEMS[stem]}${BRANCHES[branch]}`;

  const majorStars = stars.filter(s => s.type === 'major');
  const luckyStars = stars.filter(s => s.type === 'lucky');
  const shaStars = stars.filter(s => s.type === 'sha');

  const active = isMingGong || isSelected;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay, ease: 'easeOut' }}
      onClick={onClick}
      className={clsx(
        'palace-card group flex flex-col justify-between p-2.5 cursor-pointer transition-all duration-300 relative overflow-hidden h-full',
        active
          ? 'bg-surface-container-high/90 ring-2 ring-primary shadow-2xl'
          : isSanFang
          ? 'bg-surface-container ring-1 ring-secondary/50 shadow-md'
          : 'bg-surface-container-low/95 hover:bg-surface-container shadow-md',
      )}
    >
      {/* Badge góc cho cung Mệnh */}
      {isMingGong && (
        <div className="absolute top-0 right-0 px-2 py-0.5 bg-gradient-to-l from-primary to-secondary text-surface-container-lowest text-[9px] font-bold rounded-bl-lg z-10">
          {m.palace.mingTag}
        </div>
      )}

      {/* Tên cung + can chi */}
      <div className={clsx('flex items-center justify-between gap-1', isMingGong && 'mt-1 pr-16')}>
        <div className="flex items-center gap-1 min-w-0">
          <span className="font-headline-sm text-[13px] text-primary font-bold tracking-wide uppercase truncate">{term(name)}</span>
          {isShenGong && (
            <span className="px-1 rounded bg-sky-500/15 text-sky-300 text-[8px] font-bold shrink-0">{m.palace.shenTag}</span>
          )}
        </div>
        <span
          className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-surface-container-highest shrink-0"
          style={{ color: STEM_COLOR[stem] }}
        >
          {ganzhi}
        </span>
      </div>

      {/* Chính tinh (giữa) */}
      <div className="my-auto py-1 flex flex-col items-center">
        {majorStars.length === 0 && (
          <span className="text-[11px] italic text-on-surface-variant/60">{m.palace.empty}</span>
        )}
        {majorStars.map((star) => {
          const overlaySiHua = overlayStarSiHua?.[star.name];
          const color = STAR_COLOR[star.name] || EL_GOLD;
          const code = star.brightnessRaw ? BRIGHT_CODE[star.brightnessRaw] : '';
          return (
            <div
              key={star.name}
              className="flex items-center justify-center flex-wrap"
              onClick={e => { e.stopPropagation(); onStarClick?.(star); }}
            >
              <span
                className="font-headline-md text-[15px] font-bold tracking-wide cursor-pointer hover:brightness-125 transition-all"
                style={{ color }}
              >
                {term(star.name)}{code ? ` (${code})` : ''}
              </span>
              {star.siHua && <SiHuaBadge siHua={star.siHua} />}
              {overlaySiHua && (
                <SiHuaBadge
                  siHua={overlaySiHua}
                  overlay
                  label={overlayLabel}
                  onClick={e => { e.stopPropagation(); onSiHuaClick?.(star.name, overlaySiHua); }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Phụ tinh: tốt (xanh) trái · xấu (đỏ) phải */}
      {(luckyStars.length > 0 || shaStars.length > 0) && (
        <div className="grid grid-cols-2 gap-1 text-[10px]">
          <div className="flex flex-col space-y-0.5" style={{ color: EL_GREEN }}>
            {luckyStars.map(s => {
              const overlaySiHua = overlayStarSiHua?.[s.name];
              return (
                <span key={s.name} className="inline-flex items-center leading-tight">
                  {term(s.name)}
                  {s.siHua && <SiHuaBadge siHua={s.siHua} />}
                  {overlaySiHua && (
                    <SiHuaBadge
                      siHua={overlaySiHua}
                      overlay
                      label={overlayLabel}
                      onClick={e => { e.stopPropagation(); onSiHuaClick?.(s.name, overlaySiHua); }}
                    />
                  )}
                </span>
              );
            })}
          </div>
          <div className="flex flex-col text-right space-y-0.5" style={{ color: EL_RED }}>
            {shaStars.map(s => (
              <span key={s.name} className="leading-tight">
                {term(s.name)}{s.siHua && <SiHuaBadge siHua={s.siHua} />}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Đại vận */}
      {daXianAge && (
        <div className="flex items-center justify-between text-[10px] text-on-surface-variant pt-1 mt-1 border-t border-outline-variant/30">
          <span className="text-secondary font-semibold tabular-nums">ĐV [{daXianAge[0]}–{daXianAge[1]}]</span>
          <span className="font-label-esoteric text-[9px] opacity-70">{term(BRANCHES[branch])}</span>
        </div>
      )}
    </motion.div>
  );
}
