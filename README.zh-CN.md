# ASoN 的博客

> ASoN 的个人博客：记录前端开发、独立开发、AI Coding、产品思考与日常生活。

[![在线访问](https://img.shields.io/badge/在线访问-ason.top-17897e?style=flat)](https://ason.top)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-087ea4?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?style=flat&logo=tailwindcss)](https://tailwindcss.com/)

🌐 **网站：** [ason.top](https://ason.top) · [关于我](https://ason.top/about) · [GitHub](https://github.com/SongFuZhen)

## 关于这个博客

这里是 ASoN 的个人角落。ASoN（A Sense of Now）是一名来自中国成都的前端开发者、独立开发者、写作者和铲屎官，关注前端开发、产品思考、AI 工具与长期个人系统，尤其痴迷 AI Coding。

博客主要记录技术笔记、项目复盘、实践实验、读书与日常思考，也会随手记录两只猫。正如 About 页面里的话：**从现在做起，永远不迟。**

## 正在做的项目

| 项目   | 介绍                 | 地址                                         |
| ------ | -------------------- | -------------------------------------------- |
| 墨帖   | 书法碑帖检索与欣赏   | [ink.ason.top](https://ink.ason.top)         |
| 画廊   | AI 作品与影像展示    | [gallery.ason.top](https://gallery.ason.top) |
| 工具站 | 日常开发与小工具集合 | [tools.ason.top](https://tools.ason.top)     |

## 项目特点

- 基于 MDX 写作，支持 front matter、代码高亮、数学公式、引用、标题锚点和自定义组件。
- 支持分类、标签、本地搜索、RSS、sitemap 与 robots.txt，方便发现和订阅文章。
- 提供响应式阅读体验、暗色模式、目录、阅读时间和上一篇/下一篇导航。
- 内置 Open Graph、Twitter Card、JSON-LD、canonical URL 等 SEO 配置。
- 使用 Giscus 接入 GitHub Discussions 评论，并配套终端风格主题。
- 使用静态生成，支持部署到 Vercel。

## 技术栈

Next.js 15 App Router · React 19 · TypeScript · Tailwind CSS 4 · Contentlayer2 · MDX · KaTeX · Giscus

## 本地运行

环境要求：Node.js 22.x、npm。

```powershell
npm install
npm run dev
```

打开 [http://localhost:11250](http://localhost:11250)。

在 Windows 下，请使用 PowerShell 或 Windows Terminal 执行开发和构建命令。Contentlayer2 在 Git Bash 中生成内容时可能失败或留下过期文件。

### 可用脚本

```powershell
npm run dev        # 启动开发服务器
npm run build      # 构建网站并生成 RSS
npm run serve      # 在 11250 端口预览生产构建
npm run test:local # 运行本地测试
npm run lint       # 执行 lint 检查
```

### 评论配置

评论使用 [Giscus](https://giscus.app)。复制 `.env.example` 为 `.env.local`，填写仓库、仓库 ID、讨论分类和分类 ID。部署到 Vercel 时，也需要在 Vercel 项目环境变量中配置这些值。

## 写文章

在 `data/blog/<分类>/` 下创建 `.md` 或 `.mdx` 文件：

```mdx
---
title: 我的第一篇文章
date: '2026-08-23'
tags: [写作]
categories: [笔记]
authors: [default]
summary: 用于文章卡片、Feed 和 SEO 的简短描述。
layout: PostLayout
---

使用 Markdown 和 MDX 写作。
```

图片可以放在 `public/static/blog/<文章 slug>/` 下，并使用绝对路径引用，例如 `/static/blog/my-first-post/image.png`。

## 如何定制

| 文件                       | 用途                                   |
| -------------------------- | -------------------------------------- |
| `data/siteMetadata.js`     | 站点标题、地址、作者、SEO、搜索和评论  |
| `data/profile.ts`          | 关于页的个人介绍、技能、兴趣和网站历程 |
| `data/authors/default.mdx` | 作者信息                               |
| `data/projectsData.ts`     | 项目页内容                             |
| `data/headerNavLinks.ts`   | 顶部导航                               |
| `data/blog/`               | 博客文章                               |
| `public/static/images/`    | 头像、Logo 和站点图片                  |

## 项目结构

```text
app/          App Router 页面、metadata、sitemap 与 RSS 入口
components/   通用 UI、MDX、搜索、评论和主题组件
data/         站点配置、个人资料、作者、项目和文章
layouts/      博客文章与列表布局
public/       静态图片、favicon 与生成资源
scripts/      RSS 和构建后处理脚本
css/          Tailwind、排版、代码高亮和动画样式
```

## 部署

本站部署在 [Vercel](https://vercel.com/)。导入仓库后，使用 Node.js 22 运行时构建；如果启用评论，请同时配置 Giscus 环境变量。

## License

MIT，详见 [LICENSE](./LICENSE)。

[English](./README.md)
