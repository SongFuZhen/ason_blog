export type SocialLink = {
  label: string
  href: string
}

export type SiteStackNote = {
  title: string
  description: string
}

export const profile = {
  name: 'A Sense of Now',
  handle: 'ason',
  title: '前端开发者、写作者与创造者',
  email: '',
  location: '中国 · 成都',
  avatar: '/static/images/avatar.png',
  intro:
    '关注前端开发、产品思考、AI 工具与长期个人系统，并用这个博客记录技术笔记、项目复盘与实践实验，尤其痴迷 AI Coding。',
  now: '独立开发者，网站开发，痴迷 AI Coding。这里记录技术笔记、项目复盘与实践实验，也随手记下两只猫、读书与日常。',
  quote: '从现在做起，永远不迟',
  socialLinks: [],
  interests: ['写作', '工程', '开源', '设计系统'],
  skills: {
    languages: ['TypeScript', 'JavaScript', 'MDX', 'CSS'],
    frontend: ['Next.js', 'React', 'Tailwind CSS', 'shadcn/ui'],
    content: ['Contentlayer', 'RSS', '本地搜索', 'SEO 元数据'],
    deployment: ['Vercel', '静态导出', 'GitHub Actions 就绪'],
  },
  siteHistory: [
    '从编辑 data/siteMetadata.js 与 data/profile.ts 开始。',
    '在 data/blog 中编写 MDX 文章，使用 frontmatter 填写标题、日期、标签、摘要与作者。',
    '将文章配图放在 public/static/blog/<slug> 目录下，并在 MDX 中引用。',
    '部署到 Vercel、Netlify 或任何支持 Next.js 的平台。',
  ],
  siteStackNotes: [
    {
      title: '框架',
      description: '基于 Next.js App Router，使用 TypeScript 与 React 19。',
    },
    {
      title: '内容',
      description: '由 Contentlayer 驱动的 MDX 文章，自动计算 slug、阅读时间与目录。',
    },
    {
      title: '发布',
      description: '内置 RSS、sitemap、robots、本地搜索、暗色模式，以及可选的 Giscus 评论。',
    },
  ] satisfies SiteStackNote[],
}
