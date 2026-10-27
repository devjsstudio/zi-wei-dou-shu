// 把 ZiweiChart 序列化成「术语」文本，供 AI 作为命盘上下文。
// 支持越南语(vi) / 中文(zh) 两种输出语言。仅服务端使用。

import type { ZiweiChart } from '@/lib/ziwei/types';
import { STEMS, BRANCHES } from '@/lib/ziwei/constants';
import { starVi, palaceVi, stemVi, branchVi, sihuaVi, brightnessVi, termVi } from '@/lib/i18n/terms-vi';

export type Lang = 'vi' | 'zh';

/** 根据语言返回术语转换函数（zh 直接用中文原名）。 */
function labels(lang: Lang) {
  if (lang === 'zh') {
    const id = (s: string) => s;
    return { star: id, palace: id, stem: id, branch: id, sihua: id, bright: id, term: id };
  }
  return { star: starVi, palace: palaceVi, stem: stemVi, branch: branchVi, sihua: sihuaVi, bright: brightnessVi, term: termVi };
}

/** 单张命盘 → 文本摘要。 */
export function chartToText(chart: ZiweiChart, lang: Lang): string {
  const L = labels(lang);
  const vi = lang === 'vi';
  const lines: string[] = [];

  const info = chart.birthInfo;
  const gender = vi ? (info.gender === 'male' ? 'Nam' : 'Nữ') : (info.gender === 'male' ? '男' : '女');
  const lunar = chart.lunarInfo;

  if (vi) {
    lines.push(`Giới tính: ${gender}${chart.yinYangGender ? ` (${L.term(chart.yinYangGender)})` : ''}`);
    lines.push(`Dương lịch: ${info.year}-${info.month}-${info.day}, giờ ${L.branch(BRANCHES[info.hour])}`);
    lines.push(`Âm lịch: năm ${lunar.lunarYear}, tháng ${lunar.isLeapMonth ? 'nhuận ' : ''}${lunar.lunarMonth}, ngày ${lunar.lunarDay}`);
    lines.push(`Cục: ${L.term(chart.wuxingJuName)}`);
    if (chart.mingZhu) lines.push(`Mệnh chủ: ${L.star(chart.mingZhu)}`);
    if (chart.shenZhu) lines.push(`Thân chủ: ${L.star(chart.shenZhu)}`);
    lines.push(`Cung Mệnh ở ${L.branch(BRANCHES[chart.mingGongBranch])}, cung Thân ở ${L.branch(BRANCHES[chart.shenGongBranch])}`);
  } else {
    lines.push(`性别：${gender}${chart.yinYangGender ? `（${chart.yinYangGender}）` : ''}`);
    lines.push(`公历：${info.year}-${info.month}-${info.day}，${BRANCHES[info.hour]}时`);
    lines.push(`农历：${lunar.lunarYear}年${lunar.isLeapMonth ? '闰' : ''}${lunar.lunarMonth}月${lunar.lunarDay}日`);
    lines.push(`五行局：${chart.wuxingJuName}`);
    if (chart.mingZhu) lines.push(`命主：${chart.mingZhu}`);
    if (chart.shenZhu) lines.push(`身主：${chart.shenZhu}`);
    lines.push(`命宫在${BRANCHES[chart.mingGongBranch]}，身宫在${BRANCHES[chart.shenGongBranch]}`);
  }

  const dx = chart.daXians?.[chart.currentDaXianIndex];
  if (dx) {
    if (vi) {
      lines.push(`Đại hạn hiện tại: ${dx.startAge}-${dx.endAge} tuổi, tại cung ${L.palace(dx.palaceName)}` +
        (dx.siHua ? ` (hóa: Lộc ${L.star(dx.siHua.lu)}, Quyền ${L.star(dx.siHua.quan)}, Khoa ${L.star(dx.siHua.ke)}, Kỵ ${L.star(dx.siHua.ji)})` : ''));
    } else {
      lines.push(`当前大限：${dx.startAge}-${dx.endAge}岁，在${dx.palaceName}` +
        (dx.siHua ? `（禄${dx.siHua.lu} 权${dx.siHua.quan} 科${dx.siHua.ke} 忌${dx.siHua.ji}）` : ''));
    }
  }

  lines.push('', vi ? '12 cung:' : '十二宫：');
  for (const p of chart.palaces) {
    const tags: string[] = [];
    if (p.isMingGong) tags.push(vi ? 'Mệnh' : '命');
    if (p.isShenGong) tags.push(vi ? 'Thân' : '身');
    const starStr = p.stars.map(s => {
      let t = L.star(s.name);
      if (s.siHua) t += vi ? `(hóa ${L.sihua(s.siHua)})` : `(${s.siHua})`;
      if (s.brightnessRaw) t += `[${L.bright(s.brightnessRaw)}]`;
      return t;
    }).join(vi ? ', ' : '、') || (vi ? 'vô chính diệu' : '空宫');
    const self = p.selfSihua?.length
      ? (vi ? ` | tự hóa: ${p.selfSihua.map(x => `${L.star(x.starName)} ${L.sihua(x.siHua)}`).join(', ')}`
            : ` | 自化：${p.selfSihua.map(x => `${x.starName}${x.siHua}`).join('、')}`)
      : '';
    const borrow = p.isEmpty && p.borrowedStars?.length
      ? (vi ? ` | mượn sao cung đối: ${p.borrowedStars.map(L.star).join(', ')}`
            : ` | 借对宫：${p.borrowedStars.join('、')}`)
      : '';
    const age = p.daXianAge ? (vi ? ` ĐH ${p.daXianAge[0]}-${p.daXianAge[1]}` : ` 大限${p.daXianAge[0]}-${p.daXianAge[1]}`) : '';
    lines.push(`- ${L.palace(p.name)} (${L.stem(STEMS[p.stem])} ${L.branch(BRANCHES[p.branch])})${tags.length ? ` [${tags.join('/')}]` : ''}${age}: ${starStr}${self}${borrow}`);
  }

  return lines.join('\n');
}

const RULES_VI = `Bạn là một bậc thầy Tử Vi Đẩu Số theo hệ phái Nghê Hải Hạ (Nam phái Tam Hợp: lấy cung Mệnh làm gốc, tam phương tứ chính làm dụng, Tứ hóa làm cương lĩnh).

Quy tắc trả lời (BẮT BUỘC):
- Trả lời HOÀN TOÀN bằng TIẾNG VIỆT. TUYỆT ĐỐI không dùng chữ Hán / tiếng Trung ở bất kỳ đâu.
- Mọi tiêu đề mục dạng 【…】, mọi tên sao, tên cung, thuật ngữ đều phải viết bằng tiếng Việt (âm Hán-Việt), ví dụ: Tử Vi, Thiên Phủ, Hóa Lộc, cung Mệnh, Đại hạn. Không được chèn chữ Hán kèm theo.
- KHÔNG trích dẫn nguyên văn chữ Hán. Nếu muốn dẫn ý của Nghê Hải Hạ, hãy diễn đạt lại bằng tiếng Việt.
- Giữ đúng cấu trúc các mục 【…】 như trong câu hỏi, nhưng viết tên mục bằng tiếng Việt.
- Bám sát lá số cụ thể bên dưới (sao, cung, Tứ hóa, đại hạn); không bịa sao không có trong lá số. Đây là nội dung tham khảo để hiểu bản thân.`;

const RULES_ZH = `你是倪海厦体系（南派三合：以命宫为本、三方四正为用、四化为纲）的紫微斗数老师。

回答规则：
- 全程用简体中文回答。
- 保持问题中 **【…】** 的小节标题格式。
- 紧扣下面这张具体命盘（星曜、宫位、四化、大限）来论断，不要泛泛而谈，也不要编造命盘里没有的星。
- 仅作文化与自我认识的参考。`;

/** 单盘解读 system prompt。 */
export function buildInterpretSystem(chart: ZiweiChart, lang: Lang): string {
  const rules = lang === 'zh' ? RULES_ZH : RULES_VI;
  const head = lang === 'zh' ? '=== 命盘 ===' : '=== LÁ SỐ ===';
  return `${rules}\n\n${head}\n${chartToText(chart, lang)}`;
}

/** 合盘 system prompt。 */
export function buildHemingSystem(chartA: ZiweiChart, chartB: ZiweiChart, lang: Lang): string {
  const rules = lang === 'zh' ? RULES_ZH : RULES_VI;
  if (lang === 'zh') {
    return `${rules}\n\n这是两张命盘的合盘分析。请对比双方命宫、夫妻宫、三方四正及四化互动。\n\n=== 命盘 A ===\n${chartToText(chartA, 'zh')}\n\n=== 命盘 B ===\n${chartToText(chartB, 'zh')}`;
  }
  return `${rules}

Đây là phân tích HỢP HÔN giữa hai lá số. Hãy so sánh cung Mệnh, cung Phu Thê, tam phương tứ chính và sự tương tác Tứ hóa giữa hai người.

=== LÁ SỐ A ===
${chartToText(chartA, 'vi')}

=== LÁ SỐ B ===
${chartToText(chartB, 'vi')}`;
}
