const siteMetadata = {
  title: 'ASoN 的博客',
  author: 'ASoN',
  headerTitle: 'ASoN',
  description:
    'ASoN 的个人博客：记录 AI Coding、独立开发与前端技术的实践，分享 AI 打造的产品与日常思考。',
  language: 'zh-CN',
  theme: 'system',
  // 站点地址（影响 SEO、RSS、sitemap、canonical）。首选 ason.top；www.ason.top 在 Vercel 中配置重定向。
  siteUrl: 'https://ason.top',
  socialBanner: `${process.env.BASE_PATH || ''}/static/images/skyplume-card.svg`,
  email: 'ason.fuzhen@gmail.com',
  // 作者的 GitHub（footer 社交图标）。
  github: 'https://github.com/SongFuZhen',
  locale: 'zh-CN',
  stickyNav: false,
  // IndexNow 协议（Bing 等搜索引擎快速收录）。key 文件已放在 public/<key>.txt。
  indexNow: {
    key: 'dedf27909dcb083b9270ea7809f50df4',
  },
  // 搜索引擎验证 meta（硬编码，不依赖 env；Bing/Google 要求常驻，勿移除）
  verification: {
    google: 'ENWkPav6SpNVqYhLgratSPLTQFhHYXlRSlSUbnOHn6s',
    other: {
      'msvalidate.01': 'BBA93819F2F865003D80FFBC20FD4392',
      'google-adsense-account': 'ca-pub-1857431419637010',
    },
  },
  analytics: {},
  newsletter: {
    provider: '',
  },
  // 评论已通过 Giscus 启用（provider: 'giscus'）。Giscus 参数在 .env 中配置（NEXT_PUBLIC_GISCUS_*）。
  comments: {
    provider: 'giscus',
  },
  search: {
    provider: 'kbar',
    kbarConfig: {
      searchDocumentsPath: `${process.env.BASE_PATH || ''}/search.json`,
    },
  },
}

module.exports = siteMetadata
