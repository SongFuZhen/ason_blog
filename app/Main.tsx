import type { Blog } from 'contentlayer/generated'
import type { CoreContent } from '@/lib/content/types'
import Link from '@/components/Link'
import { LabHero } from '@/components/home/LabHero'
import { LogoBlob } from '@/components/home/LogoBlob'

const MAX_DISPLAY = 5

export default function Home({ posts }: { posts: CoreContent<Blog>[] }) {
  return (
    <div className="relative min-h-[60vh] pt-16 pb-16">
      <div className="lg:grid lg:grid-cols-[400px_1fr] lg:items-start">
        {/* Left: logo (hidden when there isn't room for the right column) */}
        <aside className="hidden lg:flex">
          <LogoBlob />
        </aside>

        {/* Right: terminal hero (whoami + now + projects + posts) */}
        <div className="min-w-0">
          <LabHero posts={posts} />

          {posts.length > MAX_DISPLAY && (
            <div className="flex justify-end pt-4 text-sm font-medium">
              <Link
                href="/blog"
                className="text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                aria-label="查看全部文章"
              >
                全部文章 &rarr;
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
