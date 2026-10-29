'use client';
// Cấu hình AI (chỉ lưu trong localStorage của trình duyệt, tuyệt đối không gửi đi đâu ngoài máy chủ).
// Khi gọi, được gắn vào request header gửi tới /api/interpret, /api/heming của chính dự án;
// để trống thì backend dùng DEEPSEEK_API_KEY trong .env.local.

export const AI_KEY_STORAGE = 'ziwei-ai-key';
export const AI_MODEL_STORAGE = 'ziwei-ai-model';
export const DEFAULT_MODEL = 'deepseek-chat';

export interface ModelOption {
  id: string;
  label: string;
  hint: string;
}

/** Các model khả dụng (DeepSeek, tương thích OpenAI). */
export const MODEL_OPTIONS: ModelOption[] = [
  { id: 'deepseek-chat',     label: 'DeepSeek Chat (V3)',    hint: 'Nhanh · rẻ · đủ dùng' },
  { id: 'deepseek-reasoner', label: 'DeepSeek Reasoner (R1)', hint: 'Có suy luận · sâu hơn · đắt hơn chút' },
];

export function getAiKey(): string {
  try { return localStorage.getItem(AI_KEY_STORAGE) || ''; } catch { return ''; }
}

export function getAiModel(): string {
  try { return localStorage.getItem(AI_MODEL_STORAGE) || DEFAULT_MODEL; } catch { return DEFAULT_MODEL; }
}

export function setAiConfig(key: string, model: string): void {
  try {
    if (key) localStorage.setItem(AI_KEY_STORAGE, key.trim());
    else localStorage.removeItem(AI_KEY_STORAGE);
    localStorage.setItem(AI_MODEL_STORAGE, model);
  } catch { /* bỏ qua trong chế độ riêng tư */ }
}

/**
 * Header cho fetch: kèm theo key & model (tùy chọn) phía trình duyệt.
 * Khi key rỗng, backend dùng key máy chủ trong .env.local.
 */
export function aiHeaders(): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    'x-ai-key': getAiKey(),
    'x-ai-model': getAiModel(),
    'x-ai-lang': 'vi',
  };
}
