export interface ExternalPost {
  title: string
  url: string
  platform: string
  date?: string
}

const externalPosts: ExternalPost[] = [
  {
    title: '用量仪表盘',
    url: 'https://juejin.cn/aiusage/dashboard',
    platform: '掘金·AI用量',
    date: '2026-08-31',
  },
  {
    title: 'WorkBuddy 免费到 9.30，Hy 模型将成下月主力',
    url: 'https://juejin.cn/pin/7679002790802915368',
    platform: '掘金·沸点',
    date: '2026-08-29',
  },
  {
    title: '甲方要“免费商用”字体？这 18 款我替你试过',
    url: 'https://mp.weixin.qq.com/s/aM02TT6i8Gmde8Wm4FBQQg',
    platform: '公众号',
    date: '2026-08-30',
  },
]

export default externalPosts
