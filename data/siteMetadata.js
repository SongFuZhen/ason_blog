const siteMetadata = {
  title: 'Ason 的博客',
  author: 'Ason',
  headerTitle: 'Ason',
  description: '一个干净、以内容为先的 Next.js 博客，使用 Contentlayer、Tailwind CSS 和 MDX 构建。',
  language: 'zh-CN',
  theme: 'system',
  // 站点地址（影响 SEO、RSS、sitemap、canonical）。首选 ason.top；www.ason.top 在 Vercel 中配置重定向。
  siteUrl: 'https://ason.top',
  socialBanner: `${process.env.BASE_PATH || ''}/static/images/skyplume-card.svg`,
  email: '',
  // 作者的 GitHub（footer 社交图标）。
  github: 'https://github.com/SongFuZhen',
  locale: 'zh-CN',
  stickyNav: false,
  analytics: {},
  newsletter: {
    provider: '',
  },
  // 评论默认关闭。如需启用，将 provider 改为 'giscus' 并在 .env 中配置 Giscus 参数。
  comments: {
    provider: '',
  },
  search: {
    provider: 'kbar',
    kbarConfig: {
      searchDocumentsPath: `${process.env.BASE_PATH || ''}/search.json`,
    },
  },
}

module.exports = siteMetadata
