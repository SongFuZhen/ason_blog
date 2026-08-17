export type SocialLink = {
  label: string
  href: string
}

export type SiteStackNote = {
  title: string
  description: string
}

export const profile = {
  name: 'Ason',
  handle: 'ason',
  title: '前端开发者、写作者与创造者',
  email: '',
  location: '中国',
  avatar: '/static/images/avatar.svg',
  intro:
    '我是 Ason，这个博客的作者。我关注前端开发、产品思考、AI 工具与长期个人系统，并用这个博客记录技术笔记、项目复盘和实践实验。',
  quote: '做有用的东西，把它写下来，并不断改进这个系统。',
  socialLinks: [
    { label: 'GitHub', href: 'https://github.com/SongFuZhen' },
    { label: '博客', href: 'https://ason.top' },
  ] satisfies SocialLink[],
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
