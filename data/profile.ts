export type SocialLink = {
  label: string
  href: string
}

export const profile = {
  name: 'A Sense of Now',
  handle: 'ason',
  title: '一人公司、前端开发者、写作者、铲屎官',
  email: 'ason.fuzhen@gmail.com',
  location: '中国 · 成都',
  avatar: '/static/images/avatar.png',
  intro:
    '关注前端开发、产品思考、AI 工具与长期个人系统，并用这个博客记录技术笔记、项目复盘与实践实验，尤其痴迷 AI Coding。',
  now: '独立开发者，网站开发，痴迷 AI Coding。这里记录技术笔记、项目复盘与实践实验，也随手记下两只猫、读书与日常。',
  quote: '从现在做起，永远不迟',
  socialLinks: [] as SocialLink[],
  interests: ['写作', '产品', '开源', '设计系统'],
  skills: {
    languages: ['HTML', 'JavaScript', 'CSS', 'Markdown'],
    frontend: ['Next.js', 'React', 'Vue2/3', 'Tailwind CSS', 'shadcn/ui', 'Antd', 'UMI'],
    content: ['SEO', '0-1全干'],
    deployment: ['Vercel', 'Cloudflare'],
  },
  siteHistory: ['随便发发牢骚，写写东西'],
  contact: {
    feishuQrcode: '/static/images/feishu-qrcode.jpg',
    feishuNote: '扫码添加我的飞书，交流前端、AI Coding 或合作都欢迎。',
  },
  donate: {
    qrcodes: [
      {
        src: '/static/images/wechat-qrcode.png',
        label: '微信',
        alt: '微信赞赏二维码，自愿捐赠支持本站服务器和域名开销',
      },
      {
        src: '/static/images/alipay-qrcode.png',
        label: '支付宝',
        alt: '支付宝收款二维码，自愿捐赠支持本站服务器和域名开销',
      },
      {
        src: '/static/images/paypal-qrcode-v2.jpg',
        label: 'PayPal',
        alt: 'PayPal 收款二维码，自愿捐赠支持本站服务器和域名开销',
      },
    ],
    note: '博客与所有工具完全免费，无需付费。如果你觉得内容有帮助、想支持服务器和域名开销，可以扫描上方二维码自愿请我喝杯咖啡，金额随意，不捐也完全不影响任何内容。',
  },
  site: {
    positioning:
      'ason.top 是一个个人博客，记录我在 AI Coding、独立开发与前端技术上的实践笔记、项目复盘与踩坑记录。所有内容来自真实的项目经验与动手实验，不搬运、不灌水。',
    audience: [
      '想用 AI 提升开发效率的前端与全栈开发者',
      '正在做（或想做）自己产品的一人公司 / 独立开发者',
      '对工具站、小程序等小产品从 0 到 1 过程感兴趣的读者',
    ],
  },
}
