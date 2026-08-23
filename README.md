# ASoN's Blog

> A personal blog by ASoN — a front-end developer, indie builder, writer, and cat owner.

[![Live site](https://img.shields.io/badge/live-ason.top-17897e?style=flat)](https://ason.top)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-087ea4?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?style=flat&logo=tailwindcss)](https://tailwindcss.com/)

🌐 **Live site:** [ason.top](https://ason.top) · [About](https://ason.top/about) · [GitHub](https://github.com/SongFuZhen)

## About

This is ASoN's personal corner on the web. It is used to record front-end development, product thinking, AI tools, and experiments with long-term personal systems — especially the practice of AI Coding.

The blog also keeps notes from indie development, project retrospectives, reading, daily life, and the occasional thought about two cats. The guiding idea is simple: **start from now; it is never too late.**

## Projects

| Project | Description                                        | Link                                         |
| ------- | -------------------------------------------------- | -------------------------------------------- |
| 墨帖    | Search and appreciate Chinese calligraphy rubbings | [ink.ason.top](https://ink.ason.top)         |
| 画廊    | A showcase for AI works and images                 | [gallery.ason.top](https://gallery.ason.top) |
| 工具站  | A collection of daily development tools            | [tools.ason.top](https://tools.ason.top)     |

## Highlights

- MDX-based publishing with front matter, syntax highlighting, math, citations, heading anchors, and custom components.
- Article discovery through categories, tags, local search, RSS, sitemap, and robots.txt.
- Responsive reading experience with dark mode, table of contents, reading time, and previous/next navigation.
- SEO defaults including Open Graph, Twitter cards, JSON-LD, canonical URLs, and metadata.
- Giscus-powered comments, with a terminal-inspired visual style.
- Built with static generation and deployable to Vercel.

## Tech stack

Next.js 15 App Router · React 19 · TypeScript · Tailwind CSS 4 · Contentlayer2 · MDX · KaTeX · Giscus

## Run locally

Requirements: Node.js 22.x and npm.

```powershell
npm install
npm run dev
```

Open [http://localhost:11250](http://localhost:11250).

On Windows, run the development server and production build from PowerShell or Windows Terminal. Contentlayer2 generation may fail or become stale when run from Git Bash.

### Available scripts

```powershell
npm run dev        # Start the development server
npm run build      # Build the site and generate RSS
npm run serve      # Serve the production build on port 11250
npm run test:local # Run local tests
npm run lint       # Run lint checks
```

### Comments

Comments use [Giscus](https://giscus.app). Copy `.env.example` to `.env.local` and fill in the repository, repository ID, category, and category ID values. The same variables must be configured in Vercel for comments to work on the deployed site.

## Write a post

Create an `.md` or `.mdx` file under `data/blog/<category>/`:

```mdx
---
title: My first post
date: '2026-08-23'
tags: [writing]
categories: [notes]
authors: [default]
summary: A short description used by cards, feeds, and SEO.
layout: PostLayout
---

Write your post here with Markdown and MDX.
```

Images can be placed in `public/static/blog/<post-slug>/` and referenced with an absolute path such as `/static/blog/my-first-post/image.png`.

## Customize

| File                       | Purpose                                                 |
| -------------------------- | ------------------------------------------------------- |
| `data/siteMetadata.js`     | Site title, URL, author, SEO, search, and comments      |
| `data/profile.ts`          | About page profile, skills, interests, and site history |
| `data/authors/default.mdx` | Author metadata                                         |
| `data/projectsData.ts`     | Projects page content                                   |
| `data/headerNavLinks.ts`   | Header navigation                                       |
| `data/blog/`               | Blog posts                                              |
| `public/static/images/`    | Avatars, logos, and site images                         |

## Project structure

```text
app/          App Router pages, metadata, sitemap, and RSS entry points
components/   Shared UI, MDX components, search, comments, and theme
data/         Site metadata, profile, authors, projects, and posts
layouts/      Blog post and list layouts
public/       Static images, favicons, and generated assets
scripts/      RSS and post-build utilities
css/          Tailwind, typography, syntax highlighting, and animations
```

## Deployment

The site is deployed on [Vercel](https://vercel.com/). Import this repository, set the Giscus environment variables when comments are enabled, and deploy with the Node.js 22 runtime.

## License

MIT. See [LICENSE](./LICENSE).

[简体中文](./README.zh-CN.md)
