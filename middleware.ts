import { NextResponse, type NextRequest } from 'next/server'

/**
 * Next.js 路由匹配不区分大小写：`/tags/AI` 与 `/tags/ai` 会命中同一个静态页，
 * 造成重复内容，且 canonical 会随请求路径变化。这里把内容路由统一 301 到小写。
 * 站内所有 slug / key 均为小写（中文 key 调用 toLowerCase 不受影响）。
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const lowerPathname = pathname.toLowerCase()

  if (pathname !== lowerPathname) {
    const url = request.nextUrl.clone()
    url.pathname = lowerPathname
    return NextResponse.redirect(url, 301)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/blog/:path*', '/categories/:path*', '/tags/:path*'],
}
