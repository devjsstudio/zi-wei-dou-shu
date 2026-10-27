// 调用 OpenAI 兼容的推理接口（默认 DeepSeek），把输出转成前端
// InsightPanel/heming 期望的 SSE：
//   data: {"delta":{"text":"..."}}\n\n   ... 最后 data: [DONE]\n\n
// 仅服务端使用。

export interface AiMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface StreamArgs {
  apiKey: string;
  model: string;
  baseUrl: string;
  system: string;
  messages: AiMessage[];
}

/** 过滤出合法消息：非空、role 正确、首条必须是 user。 */
function sanitize(messages: AiMessage[]): AiMessage[] {
  const cleaned = (messages || [])
    .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim())
    .map(m => ({ role: m.role, content: m.content }));
  const firstUser = cleaned.findIndex(m => m.role === 'user');
  return firstUser <= 0 ? cleaned : cleaned.slice(firstUser);
}

const enc = new TextEncoder();
const sseLine = (obj: unknown) => enc.encode(`data: ${JSON.stringify(obj)}\n\n`);
const DONE = enc.encode('data: [DONE]\n\n');

function errorStream(text: string): ReadableStream<Uint8Array> {
  return new ReadableStream<Uint8Array>({
    start(c) { c.enqueue(sseLine({ delta: { text } })); c.enqueue(DONE); c.close(); },
  });
}

export async function createSseStream({ apiKey, model, baseUrl, system, messages }: StreamArgs): Promise<ReadableStream<Uint8Array>> {
  let upstream: Response;
  try {
    upstream = await fetch(`${baseUrl.replace(/\/$/, '')}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model,
        stream: true,
        messages: [{ role: 'system', content: system }, ...sanitize(messages)],
      }),
    });
  } catch (e) {
    return errorStream(`⚠ Không kết nối được tới máy chủ AI: ${e instanceof Error ? e.message : String(e)}`);
  }

  if (!upstream.ok || !upstream.body) {
    let detail = '';
    try { detail = (await upstream.text()).slice(0, 300); } catch { /* ignore */ }
    let msg = `⚠ Máy chủ AI báo lỗi ${upstream.status}: ${detail}`;
    if (upstream.status === 401) msg = '⚠ API key không hợp lệ. Kiểm tra lại key trong ⚙ Cấu hình AI hoặc trong .env.local.';
    else if (upstream.status === 402) msg = '⚠ Tài khoản DeepSeek đã hết số dư. Hãy nạp thêm tại platform.deepseek.com.';
    else if (upstream.status === 429) msg = '⚠ Bị giới hạn tần suất, vui lòng thử lại sau giây lát.';
    return errorStream(msg);
  }

  const reader = upstream.body.getReader();
  const decoder = new TextDecoder();
  let buf = '';

  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      try {
        const { done, value } = await reader.read();
        if (done) { controller.enqueue(DONE); controller.close(); return; }
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split('\n');
        buf = lines.pop() ?? '';
        for (const line of lines) {
          const t = line.trim();
          if (!t.startsWith('data:')) continue;
          const data = t.slice(5).trim();
          if (data === '[DONE]') { controller.enqueue(DONE); controller.close(); return; }
          try {
            const json = JSON.parse(data);
            const text = json?.choices?.[0]?.delta?.content;
            if (text) controller.enqueue(sseLine({ delta: { text } }));
          } catch { /* 跳过不完整/非 JSON 行 */ }
        }
      } catch (e) {
        controller.enqueue(sseLine({ delta: { text: `⚠ Lỗi khi nhận dữ liệu: ${e instanceof Error ? e.message : String(e)}` } }));
        controller.enqueue(DONE);
        controller.close();
      }
    },
    cancel() { reader.cancel().catch(() => {}); },
  });
}

const SSE_HEADERS = {
  'Content-Type': 'text/event-stream; charset=utf-8',
  'Cache-Control': 'no-cache, no-transform',
  Connection: 'keep-alive',
};

export function sseResponse(stream: ReadableStream<Uint8Array>): Response {
  return new Response(stream, { headers: SSE_HEADERS });
}

export { SSE_HEADERS };
