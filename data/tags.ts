import { slug } from 'github-slugger'

/**
 * 标签注册表：英文 key → 中文（或原文）展示名。
 * URL 使用 key，展示使用 name。新增标签时在此登记；未登记的标签会回退到
 * github-slugger 的结果（中文标签会保留中文，不影响页面，只是 SEO 不够友好）。
 */
export const tags: Record<string, { name: string }> = {
  // 英文 / 已罗马化
  ai: { name: 'AI' },
  'ai-agent': { name: 'AI Agent' },
  agent: { name: 'Agent' },
  'ai-coding': { name: 'AI Coding' },
  ollama: { name: 'Ollama' },
  'local-model': { name: '本地模型' },
  codebuddy: { name: 'CodeBuddy' },
  opencode: { name: 'OpenCode' },
  codex: { name: 'Codex' },
  deepseek: { name: 'DeepSeek' },
  glm: { name: 'GLM' },
  zhipu: { name: '智谱' },
  'free-model': { name: '免费模型' },
  token: { name: 'Token' },
  'annual-pass': { name: '年抛' },
  'umi-request': { name: 'umi-request' },
  fetch: { name: 'fetch' },
  abortcontroller: { name: 'AbortController' },
  'request-timeout': { name: '请求超时' },
  frontend: { name: '前端' },
  juejin: { name: '掘金' },
  vibelaunch: { name: 'VibeLaunch' },
  works: { name: '作品' },
  agnes: { name: 'Agnes' },
  'ai-painting': { name: 'AI绘画' },
  linghui: { name: '灵绘' },
  gallery: { name: '画廊' },
  painting: { name: '绘画' },
  workbuddy: { name: 'WorkBuddy' },
  netdisk: { name: '网盘' },
  temporary: { name: '临时' },
  'temp-netdisk': { name: '临时网盘' },
  privacy: { name: '隐私' },
  'file-transfer': { name: '文件传输' },
  dictionary: { name: '词典' },
  'hometown-dialect': { name: '乡音' },
  long: { name: '陇' },
  gansu: { name: '甘肃' },
  'wechat-miniprogram': { name: '微信小程序' },
  dialect: { name: '方言' },
  copybook: { name: '字帖' },
  custom: { name: '定制' },
  calligraphy: { name: '书法' },
  'copybook-generator': { name: '字帖生成器' },
  pdf: { name: 'PDF' },
  'tool-site': { name: '工具站' },
  'dev-tools': { name: '开发者工具' },
  json: { name: 'JSON' },
  image: { name: '图片' },
  translation: { name: '翻译' },
  'mortgage-calc': { name: '房贷计算' },
  'indie-dev': { name: '独立开发者' },
  experience: { name: '经历' },
  harness: { name: 'Harness' },
  superpowers: { name: 'Superpowers' },
  life: { name: '生活' },
  handcraft: { name: '手工' },
  cats: { name: '猫咪' },
  speaking: { name: '说话' },
  communication: { name: '沟通' },
  nonviolence: { name: '非暴力' },
  nonsense: { name: '废话' },
  'trash-talk': { name: '垃圾话' },
  anger: { name: '生气' },
  thinking: { name: '思考' },
  reality: { name: '现实' },
  compromise: { name: '妥协' },
}

/** 中文/原文标签名 → 英文 key（用于生成 URL）。找不到时回退到 slug。 */
export function tagKey(name: string): string {
  const found = Object.keys(tags).find((k) => tags[k].name === name)
  return found ?? slug(name)
}

/** 英文 key → 展示名。找不到时回退到 key 本身。 */
export function tagName(key: string): string {
  return tags[key]?.name ?? key
}
