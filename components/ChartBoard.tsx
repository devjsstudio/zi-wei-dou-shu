'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ZiweiChart, Palace, Star } from '@/lib/ziwei/types';
import { BRANCHES, STEMS } from '@/lib/ziwei/constants';
import PalaceCell from './PalaceCell';
import { useLocale } from './LocaleProvider';
import TimeNav, { type TimeView, getYearStemIndex, buildSiHuaOverlay } from './TimeNav';

interface ChartBoardProps {
  chart: ZiweiChart;
  onStarSelect?: (star: Star, palace: Palace) => void;
  onPalaceSelect?: (palace: Palace) => void;
  onSiHuaClick?: (starName: string, siHua: string, view: TimeView) => void;
}

const BRANCH_GRID_POS: Record<number, [number, number]> = {
  5: [1, 1], 6: [1, 2], 7: [1, 3], 8: [1, 4],
  4: [2, 1], 9: [2, 4],
  3: [3, 1], 10: [3, 4],
  2: [4, 1], 1: [4, 2], 0: [4, 3], 11: [4, 4],
};

// 每个地支宫位在网格中的中心坐标（百分比）
const BRANCH_SVG_POS: Record<number, [number, number]> = {
  5: [12.5, 12.5], 6: [37.5, 12.5], 7: [62.5, 12.5], 8: [87.5, 12.5],
  4: [12.5, 37.5],                                      9: [87.5, 37.5],
  3: [12.5, 62.5],                                     10: [87.5, 62.5],
  2: [12.5, 87.5], 1: [37.5, 87.5], 0: [62.5, 87.5], 11: [87.5, 87.5],
};

// 绕盘面顺时针排列（用于三方四正四边形排序）
const CLOCKWISE_INDEX: Record<number, number> = {
  5: 0, 6: 1, 7: 2, 8: 3,
  9: 4, 10: 5,
  11: 6, 0: 7, 1: 8, 2: 9,
  3: 10, 4: 11,
};

function sortClockwise(branches: number[]): number[] {
  return [...branches].sort((a, b) => CLOCKWISE_INDEX[a] - CLOCKWISE_INDEX[b]);
}

/** 三方四正：本宫 + 对宫 + 两个三合宫 */
function getSanFangSiZheng(branch: number): [number, number, number, number] {
  return [
    branch,
    (branch + 6) % 12,   // 对宫
    (branch + 4) % 12,   // 三合1
    (branch + 8) % 12,   // 三合2
  ];
}

const ANIMATION_ORDER = [5, 6, 7, 8, 9, 10, 11, 0, 1, 2, 3, 4];

export default function ChartBoard({ chart, onStarSelect, onPalaceSelect, onSiHuaClick }: ChartBoardProps) {
  const [selectedBranch, setSelectedBranch] = useState<number | null>(null);
  const [timeView, setTimeView] = useState<TimeView>('mingpan');
  const [liunianYear, setLiunianYear] = useState<number>(new Date().getFullYear());
  const { m, term } = useLocale();

  const palaceMap: Record<number, Palace> = {};
  chart.palaces.forEach(p => { palaceMap[p.branch] = p; });

  // 计算当前叠加四化数据（大限或流年）
  const currentDx = chart.daXians[chart.currentDaXianIndex];
  const overlayData: Record<string, string> = (() => {
    if (timeView === 'daxian' && currentDx) {
      const dxPalace = chart.palaces.find(p => p.branch === currentDx.palaceBranch);
      if (dxPalace) return buildSiHuaOverlay(dxPalace.stem);
    }
    if (timeView === 'liunian') {
      return buildSiHuaOverlay(getYearStemIndex(liunianYear));
    }
    return {};
  })();
  const overlayLabel = timeView === 'daxian' ? m.board.overlayDaxian : timeView === 'liunian' ? m.board.overlayLiunian : undefined;

  const handlePalaceClick = (branch: number) => {
    const isDeselecting = selectedBranch === branch;
    setSelectedBranch(prev => prev === branch ? null : branch);
    if (!isDeselecting) {
      const palace = palaceMap[branch];
      if (palace) onPalaceSelect?.(palace);
    }
  };

  // 三方四正
  const sanFangBranches = selectedBranch !== null ? getSanFangSiZheng(selectedBranch) : null;
  const sanFangSet = sanFangBranches ? new Set(sanFangBranches) : null;

  // ── Dữ liệu ô giữa "Thiên Bàn Hoàng Gia" ──
  const hourBranch = chart.birthInfo.hour;
  const bi = chart.birthInfo;
  const li = chart.lunarInfo;
  const amLichYear = `${term(STEMS[li.yearStem])} ${term(BRANCHES[li.yearBranch])}`;
  const theCach = chart.mingGongBranch === chart.shenGongBranch
    ? 'Mệnh Thân Đồng Cung'
    : `Mệnh cư ${term(BRANCHES[chart.mingGongBranch])} · Thân cư ${term(BRANCHES[chart.shenGongBranch])}`;

  return (
    <div className="w-full select-none flex flex-col h-full">
      {/* 时间导航轴 */}
      <TimeNav
        chart={chart}
        view={timeView}
        liunianYear={liunianYear}
        onViewChange={setTimeView}
        onYearChange={setLiunianYear}
      />

      {/* Lưới 4x4 lá số (kèm lớp SVG tam hợp) —— flex-1 lấp đầy chiều cao */}
      <div
        className="grid relative flex-1 min-h-0"
        style={{
          gridTemplateColumns: 'repeat(4, 1fr)',
          gridTemplateRows: 'repeat(4, minmax(0, 1fr))',
          gap: '10px',
        }}
      >
        {ANIMATION_ORDER.map((branch, i) => {
          const [row, col] = BRANCH_GRID_POS[branch];
          const palace = palaceMap[branch];
          if (!palace) return null;
          return (
            <div key={branch} style={{ gridRow: row, gridColumn: col }} className="rounded-xl overflow-hidden">
              <PalaceCell
                palace={palace}
                onClick={() => handlePalaceClick(branch)}
                onStarClick={(star) => onStarSelect?.(star, palace)}
                isSelected={selectedBranch === branch}
                isSanFang={!!(sanFangSet?.has(branch) && selectedBranch !== branch)}
                delay={i * 0.04}
                overlayStarSiHua={Object.keys(overlayData).length > 0 ? overlayData : undefined}
                overlayLabel={overlayLabel}
                onSiHuaClick={(starName, siHua) => onSiHuaClick?.(starName, siHua, timeView)}
              />
            </div>
          );
        })}

        {/* Ô giữa: THIÊN BÀN HOÀNG GIA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl bg-surface-container/95 p-4 flex flex-col justify-between relative shadow-2xl overflow-hidden backdrop-blur-xl"
          style={{ gridRow: '2 / 4', gridColumn: '2 / 4' }}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-col">
              <span className="font-label-esoteric text-[10px] text-primary tracking-widest uppercase">Thiên Cung Khâm Định</span>
              <h2 className="font-headline-md text-[18px] text-primary font-bold tracking-wide">THIÊN BÀN HOÀNG GIA</h2>
            </div>
            <div className="flex flex-col items-end shrink-0">
              <div className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-semibold text-right">
                {chart.yinYangGender ? term(chart.yinYangGender) : ''} • {term(chart.wuxingJuName)}
              </div>
              <span className="text-[11px] text-on-surface-variant mt-0.5">Giờ {term(BRANCHES[hourBranch])}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-2 my-auto py-2 bg-surface-container-low/70 p-3 rounded-xl shadow-inner">
            <div className="flex flex-col">
              <span className="text-[10px] text-on-surface-variant">Họ &amp; Tên Đương Số</span>
              <span className="text-[14px] text-primary font-bold">{bi.name || '—'}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-on-surface-variant">Bản Mệnh / Ngũ Hành</span>
              <span className="text-[13px] font-semibold" style={{ color: '#38BDF8' }}>{term(chart.wuxingJuName)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-on-surface-variant">Dương Lịch Khởi Sinh</span>
              <span className="text-[13px] text-on-surface">{`${String(bi.day).padStart(2, '0')}/${String(bi.month).padStart(2, '0')}/${bi.year}`}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-on-surface-variant">Âm Lịch Niên Kỷ</span>
              <span className="text-[13px] text-secondary font-semibold">{amLichYear} • {li.isLeapMonth ? 'N.' : ''}{Math.abs(li.lunarMonth)}/{li.lunarDay}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-on-surface-variant">Mệnh Chủ / Thân Chủ</span>
              <span className="text-[13px] text-on-surface">{chart.mingZhu ? term(chart.mingZhu) : '—'} / {chart.shenZhu ? term(chart.shenZhu) : '—'}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-on-surface-variant">Cung Cư Thể Cách</span>
              <span className="text-[13px] text-tertiary">{theCach}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 gap-2 flex-wrap">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse shrink-0" />
              <span className="font-label-esoteric text-[11px] text-on-surface-variant truncate">Lưu Niên: {liunianYear}</span>
            </div>
            {chart.currentDaXianIndex >= 0 && (() => {
              const dx = chart.daXians[chart.currentDaXianIndex];
              return (
                <div className="flex items-center gap-1.5 text-[11px] text-primary shrink-0">
                  <span className="material-symbols-outlined text-[16px]">verified</span>
                  <span>ĐV {dx.startAge}–{dx.endAge} · {term(dx.palaceName)}</span>
                </div>
              );
            })()}
          </div>
        </motion.div>

        {/* ── 三方四正 SVG 连线（绝对定位在 grid 内部，受 overflow:hidden 裁切） ── */}
        <AnimatePresence>
          {sanFangBranches !== null && (
            <motion.div
              key={`sf-${selectedBranch}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="pointer-events-none"
              style={{
                position: 'absolute',
                inset: 0,
                zIndex: 20,
              }}
            >
              <svg
                width="100%"
                height="100%"
                xmlns="http://www.w3.org/2000/svg"
                style={{ display: 'block' }}
              >
                {(() => {
                  // 三角形（三方）+ 一条直线（对宫）
                  const p0 = BRANCH_SVG_POS[sanFangBranches[0]]; // 本宫
                  const p1 = BRANCH_SVG_POS[sanFangBranches[1]]; // 对宫
                  const p2 = BRANCH_SVG_POS[sanFangBranches[2]]; // 三合1
                  const p3 = BRANCH_SVG_POS[sanFangBranches[3]]; // 三合2
                  const dash = "6,5";
                  const stroke = "rgba(242,202,80,0.55)";
                  const sw = "1.5";
                  return (
                    <>
                      {/* 对宫直线：本宫 ↔ 对宫（穿过中心） */}
                      <line
                        x1={`${p0[0]}%`} y1={`${p0[1]}%`}
                        x2={`${p1[0]}%`} y2={`${p1[1]}%`}
                        stroke={stroke} strokeWidth={sw}
                        strokeDasharray={dash} strokeLinecap="round"
                      />
                      {/* 三合三角形：本宫 → 三合1 → 三合2 → 本宫 */}
                      <line
                        x1={`${p0[0]}%`} y1={`${p0[1]}%`}
                        x2={`${p2[0]}%`} y2={`${p2[1]}%`}
                        stroke={stroke} strokeWidth={sw}
                        strokeDasharray={dash} strokeLinecap="round"
                      />
                      <line
                        x1={`${p2[0]}%`} y1={`${p2[1]}%`}
                        x2={`${p3[0]}%`} y2={`${p3[1]}%`}
                        stroke={stroke} strokeWidth={sw}
                        strokeDasharray={dash} strokeLinecap="round"
                      />
                      <line
                        x1={`${p3[0]}%`} y1={`${p3[1]}%`}
                        x2={`${p0[0]}%`} y2={`${p0[1]}%`}
                        stroke={stroke} strokeWidth={sw}
                        strokeDasharray={dash} strokeLinecap="round"
                      />
                      {/* 四个宫位中心标记点 */}
                      {[p0, p1, p2, p3].map((p, i) => (
                        <circle
                          key={i}
                          cx={`${p[0]}%`} cy={`${p[1]}%`}
                          r="3"
                          fill={i === 0 ? 'rgba(242,202,80,0.9)' : 'rgba(242,202,80,0.5)'}
                        />
                      ))}
                    </>
                  );
                })()}
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 图例 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mt-3 flex items-center justify-center gap-2 text-[9px] flex-wrap"
      >
        {[
          { h: m.board.legend[0], c: 'text-emerald-500 border-emerald-500/30' },
          { h: m.board.legend[1], c: 'text-blue-500 border-blue-500/30' },
          { h: m.board.legend[2], c: 'text-yellow-500 border-yellow-500/30' },
          { h: m.board.legend[3], c: 'text-red-500 border-red-500/30' },
        ].map(({ h, c }) => (
          <span key={h} className={`border px-1.5 py-0.5 rounded-full font-medium ${c}`}>{h}</span>
        ))}
        <span className="px-1.5 py-0.5 rounded-full" style={{ color: 'var(--t-faint)', border: '1px solid var(--t-border)' }}>
          {m.board.hint}
        </span>
      </motion.div>
    </div>
  );
}
