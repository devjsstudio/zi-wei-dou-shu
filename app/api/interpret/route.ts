import type { NextRequest } from 'next/server';
import type { ZiweiChart } from '@/lib/ziwei/types';
import { buildInterpretSystem } from '@/lib/ai/chart-prompt';
import { createSseStream, sseResponse, type AiMessage } from '@/lib/ai/stream';

export const runtime = 'nodejs';
export const maxDuration = 60;

/**
 * /api/interpret —— 单盘 AI 解读（流式，DeepSeek / OpenAI 兼容）。
 *
 * API key 来源（任一即可）：
 *   · 请求头 x-ai-key（用户在前端 ⚙ 里填，只存浏览器）
 *   · 环境变量 DEEPSEEK_API_KEY / AI_API_KEY（.env.local）
 */
export async function POST(req: NextRequest) {
  const headerKey = req.headers.get('x-ai-key')?.trim();
  const apiKey = headerKey || process.env.DEEPSEEK_API_KEY || process.env.AI_API_KEY;
  const model = req.headers.get('x-ai-model')?.trim() || process.env.AI_MODEL || 'deepseek-chat';
  const baseUrl = process.env.AI_BASE_URL || 'https://api.deepseek.com/v1';
  const lang = req.headers.get('x-ai-lang') === 'zh' ? 'zh' : 'vi';

  if (!apiKey) {
    return Response.json({ error: 'no-key' }, { status: 401 });
  }

  let body: { chart?: ZiweiChart; messages?: AiMessage[] };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'bad-json' }, { status: 400 });
  }
  if (!body?.chart || !Array.isArray(body.messages)) {
    return Response.json({ error: 'bad-request' }, { status: 400 });
  }

  const system = buildInterpretSystem(body.chart, lang);
  const stream = await createSseStream({ apiKey, model, baseUrl, system, messages: body.messages });
  return sseResponse(stream);
}
