export type ResourcePlatform = '闲鱼' | '小红书' | '免费'

export interface Resource {
  title: string
  description: string
  price: string
  platform: ResourcePlatform
  href?: string
  imgSrc?: string
  status: '在售' | '已下架'
}

// 在这里维护你挂在闲鱼 / 小红书上的内容，改完保存即可热更新
// 数据来源：闲鱼卖家工作台「商品管理」（2026-08-30 同步）
const resourcesData: Resource[] = [
  {
    title: '12 只国潮盲盒风生肖 3D 图',
    description:
      '1024×1024 高清 12 张，米白奶油底萌系 3D、头顶书法生肖字，适合头像 / 手账贴纸 / 潮玩参考。',
    price: '¥1.99',
    platform: '闲鱼',
    href: 'https://www.goofish.com/item?id=1077608231985',
    status: '在售',
  },
  {
    title: '61 张 AI 岩彩敦煌图',
    description: '从千年壁画到赛博朋克，61 张岩彩风格敦煌主题图，适合壁纸与设计素材。',
    price: '¥9.90',
    platform: '闲鱼',
    href: 'https://www.goofish.com/item?id=1077371463637',
    status: '在售',
  },
  {
    title: '64 个朝代印章素材（上古—民国）',
    description: '各朝代印章 1:1 复刻，国风设计、课件 PPT 都能用。',
    price: '¥9.90',
    platform: '闲鱼',
    href: 'https://www.goofish.com/item?id=1078229906014',
    status: '在售',
  },
  {
    title: '国风古城山水手机壁纸（8 张）',
    description: '8 张国风古城山水主题手机壁纸。',
    price: '¥3.99',
    platform: '闲鱼',
    href: 'https://www.goofish.com/item?id=1077436551605',
    status: '在售',
  },
  {
    title: '18 款免费商用中文字体包',
    description:
      '楷书、手写、毛笔书法、黑体、宋体、艺术体共 18 款 TTF，附授权说明，海报 / PPT / 短视频通用。',
    price: '¥1.99~4.99',
    platform: '闲鱼',
    href: 'https://www.goofish.com/item?id=1078786220110',
    status: '在售',
  },
  {
    title: '270 个 AI 智能体专家提示词',
    description: '覆盖 17 大领域、中英对照、导入即用，按领域分册交付。',
    price: '¥19.90',
    platform: '闲鱼',
    href: 'https://www.goofish.com/item?id=1075954503704',
    status: '在售',
  },
  {
    title: '32 种风格 AI 图片定制',
    description: '32 种风格任选的 AI 图片定制服务。',
    price: '¥9.90~29.90',
    platform: '闲鱼',
    href: 'https://www.goofish.com/item?id=1071105755716',
    status: '在售',
  },
  {
    title: '网站 / APP 专属定制',
    description: '0 基础也能上手的网站 / APP 专属定制服务。',
    price: '¥29.90',
    platform: '闲鱼',
    href: 'https://www.goofish.com/item?id=1063291754381',
    status: '在售',
  },
  {
    title: '资源代找',
    description: '各类资源代找，明码标价不收费。',
    price: '¥2.90',
    platform: '闲鱼',
    href: 'https://www.goofish.com/item?id=1065568488221',
    status: '在售',
  },
  {
    title: '墨帖 · 书法碑帖检索',
    description: '书法碑帖检索与欣赏，在线生成字帖 PDF，免费使用。',
    price: '免费',
    platform: '免费',
    href: 'https://ink.ason.top',
    status: '在售',
  },
  {
    title: '工具站 · 在线小工具',
    description: '日常开发与效率小工具集合，免费使用。',
    price: '免费',
    platform: '免费',
    href: 'https://tools.ason.top',
    status: '在售',
  },
  {
    title: '画廊 · AI 作品与影像',
    description: 'AI 生成的国风作品与影像展示，免费浏览。',
    price: '免费',
    platform: '免费',
    href: 'https://gallery.ason.top',
    status: '在售',
  },
]

export default resourcesData
