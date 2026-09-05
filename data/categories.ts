/**
 * 分类注册表：英文 key（与 data/blog 下的文件夹名一致） → 中文展示名。
 * URL 使用 key，展示使用 name。新增分类时在此登记，并把文件夹改名为对应 key。
 */
export interface CategoryMeta {
  name: string
  description?: string
}

export const categories: Record<string, CategoryMeta> = {
  products: { name: '产品' },
  ai: { name: 'AI' },
  tech: { name: '技术' },
  competition: { name: '比赛' },
  cats: { name: '猫咪' },
  life: { name: '生活' },
  reading: { name: '读书' },
}

export function categoryName(key: string): string {
  return categories[key]?.name ?? key
}

export function categoryKeyByName(name: string): string | undefined {
  return Object.keys(categories).find((k) => categories[k].name === name)
}
