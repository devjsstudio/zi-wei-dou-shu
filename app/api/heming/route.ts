import type { NextRequest } from 'next/server';
import type { ZiweiChart } from '@/lib/ziwei/types';
import { buildHemingSystem } from '@/lib/ai/chart-prompt';
import { createSseStream, sseResponse, type AiMessage } from '@/lib/ai/stream';

export const runtime = 'nodejs';
export const maxDuration = 60;

/** /api/heming —— 合盘 AI 分析（流式，DeepSeek / OpenAI 兼容）。key 来源同 /api/interpret。 */
export async function POST(req: NextRequest) {
  const headerKey = req.headers.get('x-ai-key')?.trim();
  const apiKey = headerKey || process.env.DEEPSEEK_API_KEY || process.env.AI_API_KEY;
  const model = req.headers.get('x-ai-model')?.trim() || process.env.AI_MODEL || 'deepseek-chat';
  const baseUrl = process.env.AI_BASE_URL || 'https://api.deepseek.com/v1';
  const lang = req.headers.get('x-ai-lang') === 'zh' ? 'zh' : 'vi';

  if (!apiKey) {
    return Response.json({ error: 'no-key' }, { status: 401 });
  }

  let body: { chartA?: ZiweiChart; chartB?: ZiweiChart; question?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'bad-json' }, { status: 400 });
  }
  if (!body?.chartA || !body?.chartB) {
    return Response.json({ error: 'bad-request' }, { status: 400 });
  }

  const system = buildHemingSystem(body.chartA, body.chartB, lang);
  const defaultPrompt = lang === 'zh'
    ? `请分析两人合盘，按以下结构输出：

**【姻缘定性】**
一句话概括两人契合度。

**【命宫与气质】**
对比双方命宫，性格互补还是冲突。

**【夫妻宫互参】**
分析双方夫妻宫与感情契合度。

**【四化互动】**
一方的禄/权/科/忌照入对方哪个宫位。

**【相处建议】**
让两人合作/相爱/相处更好的具体建议。`
    : `Hãy phân tích hợp hôn hai người, theo cấu trúc:

**【Định điệu nhân duyên】**
Một câu khái quát mức độ hợp nhau của hai người.

**【Cung Mệnh & khí chất】**
So sánh cung Mệnh hai bên, tính cách có bổ trợ hay xung khắc.

**【Cung Phu Thê tương tham】**
Phân tích cung Phu Thê hai lá số và sự ăn khớp về tình cảm.

**【Tứ hóa tương tác】**
Hóa Lộc/Quyền/Khoa/Kỵ của người này chiếu vào cung nào của người kia.

**【Lời khuyên chung sống】**
Gợi ý cụ thể để hai người hợp tác/yêu đương/chung sống tốt hơn.`;
  const prompt = body.question?.trim() || defaultPrompt;

  const messages: AiMessage[] = [{ role: 'user', content: prompt }];
  const stream = await createSseStream({ apiKey, model, baseUrl, system, messages });
  return sseResponse(stream);
}
