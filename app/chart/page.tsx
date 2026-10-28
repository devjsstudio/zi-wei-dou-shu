'use client';
import { useState } from 'react';
import BirthForm from '@/components/BirthForm';
import ChartBoard from '@/components/ChartBoard';
import InsightPanel from '@/components/InsightPanel';
import { generateChart } from '@/lib/ziwei/algorithm';
import { useLocale, LocaleSwitch } from '@/components/LocaleProvider';
import type { BirthInfo, ZiweiChart, Palace } from '@/lib/ziwei/types';

/**
 * 命盘页 —— 开源版「排盘引擎 Demo」
 *
 * 这是一个最小可运行示例：用本仓库的排盘引擎 generateChart() 配合基础 UI
 * 组件，渲染一张完整紫微命盘 + 基础解读，并支持本命 / 大限 / 流年切换。
 *
 * 说明：线上商业版的完整交互界面（重设计的新 UI、AI 流式解读、合盘、分享
 * 卡片等）不在开源范围内；但排盘内核——安星算法、四化、格局识别、古籍库——
 * 完全开放（见 lib/ziwei/*），可自由二次开发出你自己的界面。
 */
export default function ChartPage() {
  const [chart, setChart] = useState<ZiweiChart | null>(null);
  const [selectedPalace, setSelectedPalace] = useState<Palace | null>(null);
  const { m, term } = useLocale();

  // ── 未起盘：展示出生信息表单 ──
  if (!chart) {
    return (
      <main style={{ maxWidth: 720, margin: '0 auto', padding: '48px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
          <LocaleSwitch />
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>{m.chartPage.title}</h1>
        <p style={{ color: '#888', marginBottom: 32, fontSize: 14, lineHeight: 1.7 }}>
          {m.chartPage.intro}
          <br />
          {m.chartPage.introNote}
        </p>
        <BirthForm onSubmit={(info: BirthInfo) => setChart(generateChart(info))} />
      </main>
    );
  }

  // ── 已起盘：命盘 + 解读 ──
  return (
    <main style={{ maxWidth: 1960, margin: '0 auto', padding: '20px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 14, flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => { setChart(null); setSelectedPalace(null); }}
          style={{
            padding: '7px 16px', cursor: 'pointer', fontSize: 13,
            border: '1px solid var(--t-border)', borderRadius: 999,
            background: 'var(--t-card)', color: 'var(--t-text2)',
          }}
        >
          {m.chartPage.restart}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, flex: 1, justifyContent: 'center', minWidth: 0 }}>
          {chart.birthInfo.name && (
            <span style={{ fontWeight: 700, color: 'var(--t-gold)', letterSpacing: '0.05em' }}>{chart.birthInfo.name}</span>
          )}
          <span style={{ color: 'var(--t-faint)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {`${chart.birthInfo.year}-${String(chart.birthInfo.month).padStart(2, '0')}-${String(chart.birthInfo.day).padStart(2, '0')} · ${term(chart.wuxingJuName)}${chart.yinYangGender ? ` · ${term(chart.yinYangGender)}` : ''}`}
          </span>
        </div>

        <LocaleSwitch />
      </div>

      <div
        className="chart-layout"
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1120px) minmax(0, 1fr)',
          gap: 24, marginTop: 8, alignItems: 'stretch',
        }}
      >
        <ChartBoard chart={chart} onPalaceSelect={setSelectedPalace} />
        <div style={{ position: 'sticky', top: 16, height: 'calc(100vh - 110px)' }}>
          <InsightPanel chart={chart} selectedPalace={selectedPalace} />
        </div>
      </div>

      {/* 窄屏：解读面板移到命盘下方，不再并排挤压命盘 */}
      <style>{`
        @media (max-width: 920px) {
          .chart-layout { grid-template-columns: 1fr !important; }
          .chart-layout > div:last-child { position: static !important; height: 70vh !important; }
        }
      `}</style>
    </main>
  );
}
