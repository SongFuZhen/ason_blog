# agents.md

Project notes for AI agents working in this repo (ason_blog — personal blog on the Skyplume Next.js 15 template).

## Blog post rendering pipeline

Posts are written as **MDX**, not plain Markdown (both `.md` and `.mdx` extensions are accepted — Contentlayer processes them identically through the MDX pipeline). The chain is:

1. Source: `data/blog/<category>/<slug>.mdx` (frontmatter: `title`, `date`, `tags`, `categories`, `authors`, `summary`, `layout`).
2. `contentlayer.config.ts` defines the `Blog` (and `Authors`) document schema. At dev/build time **Contentlayer2** compiles each MDX into JS (`post.body.code`) and emits the generated collections in `contentlayer/generated` (`allBlogs`, `allAuthors`).
3. `app/blog/[...slug]/page.tsx` finds the post by `slug`, then renders the body via:
   ```tsx
   <MDXLayoutRenderer code={post.body.code} components={components} toc={post.toc} />
   ```
4. `components/MDXComponents.tsx` maps MDX tags to styled components: `img` → `ProseImage`, `a` → `CustomLink`, `pre` → `Pre`, `table` → `TableWrapper`, plus `TOCInline` / `BlogNewsletterForm`.
5. Layout: `layouts/PostLayout.tsx` wraps the body in a terminal-window aesthetic and applies typography via `prose dark:prose-invert post-prose` (Tailwind Typography plugin, configured in `css/tailwind.css`).

So "the markdown is wrong" almost never means the parser is broken — it means Contentlayer didn't compile, or the `prose` CSS didn't load.

## "md 显示不对" — how to diagnose

When a post looks broken/unstyled on the detail page:

- **Live site (ason.top / Vercel)** usually renders fine. Verify before assuming a bug:
  - `curl` the page, grep the article HTML for the `prose` wrapper class and for raw `###` leaking through (raw markdown leaking = Contentlayer didn't compile).
  - Fetch the deployed CSS (`/_next/static/css/*.css`) and confirm `prose` / `tw-prose-body` rules exist.
  - If both are present, the server output is correct → the user is most likely seeing a **stale CSS cache** (browser or Vercel edge). Tell them to hard-refresh (Ctrl/Cmd+Shift+R) and re-check.
- **Local dev** is the usual real failure point — see the next section.

## Local dev / build: use PowerShell, NOT Git Bash

On Windows, **run `npm run dev` / `npm run build` from PowerShell or Windows Terminal**. Git Bash breaks the Contentlayer2 generation step, so `contentlayer/generated` is stale or missing and the page falls back to showing raw/uncompiled MDX — which looks exactly like "md 渲染不对" but is an environment issue, not a code bug.

If a local page shows raw MDX: stop the dev server, delete `.contentlayer` and `node_modules/.cache` if needed, and re-run from PowerShell.

## Gotchas

- Contentlayer is ESM-sensitive: `build` uses `NODE_OPTIONS='--experimental-json-modules'` and `INIT_CWD=$PWD` (set in `package.json` scripts) — keep those wrappers.
- Posts under non-ASCII category folders (e.g. `产品/`, `AI/`) work; slugs are URL-encoded. Don't rename folders without updating `categories/[...category]` links.
- Images in MDX without explicit `width`/`height` fall back to a native `<img>` in `components/mdx/ProseImage.tsx` (so they bypass `next/image` remote-pattern restrictions and won't 404 on domain config).
- **Live-site "md 显示不对" is usually a stale CSS cache, NOT a code bug.** If `curl` shows the `prose` wrapper class in the HTML and `prose`/`tw-prose-body` rules exist in the deployed CSS, the server output is correct — the user is almost certainly seeing a cached old CSS (browser, or Vercel edge). Tell them to hard-refresh (Ctrl/Cmd+Shift+R) and re-check before touching any code. This is the #1 false alarm for "渲染不对" reports on ason.top.

## Pre-push SEO checklist (MANDATORY before any push)

Before running `git push` (whether the user says "push" or asks to commit & push), always run through this SEO check for every blog post included in the push. SEO here is template-automated, so this is a **verification** pass, not manual authoring — most items are auto-derived from frontmatter.

1. **Frontmatter complete** for each new/changed post in `data/blog/**`: `title`, `date`, `tags`, `categories`, `authors`, `summary` present. Missing `summary` → no meta description / OG description.
2. **No `draft: true`** on posts intended to go live (sitemap + prod build filter drafts out).
3. **OG / share image**: if you want a post-specific share card, the post needs an `images` field; otherwise it falls back to `siteMetadata.socialBanner` (acceptable, but flag it).
4. **Sitemap coverage**: confirm `app/sitemap.ts` will include the post — it auto-maps `allBlogs` (non-draft), so a correctly-compiled post is included. If Contentlayer didn't compile (see "Local dev / build" above), the post is missing from `allBlogs` and silently absent from sitemap + metadata.
5. **Title stability**: Giscus maps discussions by `<title>` (`data-mapping="title"`). Renaming a live post's `title` orphans its comments — only flag if the post is already published.

If a post fails any check, fix it (or tell the user) **before** pushing. Confirm to the user that SEO was verified as part of the push.

## Comments (Giscus)

Comments are powered by **Giscus** (GitHub Discussions backend). Notes for maintainers:

- **Enabled via** `data/siteMetadata.js` → `comments.provider: 'giscus'`. The `Comments` component renders `null` unless provider is exactly `'giscus'`.
- **Config source**: environment variables `NEXT_PUBLIC_GISCUS_REPO` / `_REPOSITORY_ID` / `_CATEGORY` / `_CATEGORY_ID` (see `.env.example`). `.env` is gitignored — these must also be set in **Vercel → Settings → Environment Variables** for the live build (Vercel does not read local `.env`).
- **Mapping**: `data-mapping="title"` — discussions are keyed by the page `<title>` (not the URL pathname). GitHub Discussions titles become the post title. Keep post titles stable; renaming a post starts a fresh discussion. (Comments were empty at switch time, so no data was lost.)
- **UI language**: `data-lang="zh-CN"` (Chinese UI, matching the rest of the site).
- **Theme**: custom terminal-style themes in `public/giscus-terminal-dark.css` / `public/giscus-terminal-light.css`, wired in `components/comments/GiscusComments.tsx` via a `window.location.origin`-based `data-theme` URL (works on both localhost and the live domain) and switched on light/dark via `postMessage`.
- **Auto-load**: `components/Comments.tsx` renders `GiscusComments` directly (no click-to-load button) — the Giscus script is injected client-side, so it never appears in server-rendered / `curl` HTML (only the "not configured" fallback message would).
- **Requires GitHub login to post** (Giscus limitation). Waline / Twikoo were evaluated 2026-08-19 as anonymous-friendly alternatives but Giscus was kept.
