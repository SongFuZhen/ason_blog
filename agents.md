# agents.md

Project notes for AI agents working in this repo (ason_blog — personal blog on the Skyplume Next.js 15 template).

## Blog post rendering pipeline

Posts are written as **MDX**, not plain Markdown. The chain is:

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
