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
  siteHistory: ['随便发发牢骚，谢谢东西'],
}
