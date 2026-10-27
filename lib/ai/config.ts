'use client';
// AI 配置（仅存浏览器 localStorage，绝不上传服务器之外的任何地方）。
// 请求时作为请求头发给本仓库自己的 /api/interpret、/api/heming；
// 留空则后端改用 .env.local 里的 DEEPSEEK_API_KEY。

export const AI_KEY_STORAGE = 'ziwei-ai-key';
export const AI_MODEL_STORAGE = 'ziwei-ai-model';
export const DEFAULT_MODEL = 'deepseek-chat';

export interface ModelOption {
  id: string;
  label: string;
  hint: { zh: string; vi: string };
}

/** 可选模型（DeepSeek，OpenAI 兼容）。 */
export const MODEL_OPTIONS: ModelOption[] = [
  { id: 'deepseek-chat',     label: 'DeepSeek Chat (V3)',  hint: { zh: '快 · 便宜 · 日常够用', vi: 'Nhanh · rẻ · đủ dùng' } },
  { id: 'deepseek-reasoner', label: 'DeepSeek Reasoner (R1)', hint: { zh: '会推理 · 更深入 · 稍贵', vi: 'Có suy luận · sâu hơn · đắt hơn chút' } },
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
  } catch { /* 隐私模式等场景忽略 */ }
}

/**
 * 给 fetch 用的请求头：带上（可选的）浏览器端 key 与模型。
 * key 为空字符串时后端回退到 .env.local 的服务器密钥。
 */
/** 当前界面语言（与 LocaleProvider 共用 localStorage key）。 */
function getLocale(): string {
  try {
    const l = localStorage.getItem('ziwei-locale');
    return l === 'zh' ? 'zh' : 'vi';
  } catch { return 'vi'; }
}

export function aiHeaders(): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    'x-ai-key': getAiKey(),
    'x-ai-model': getAiModel(),
    'x-ai-lang': getLocale(),
  };
}
