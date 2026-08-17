import type { Blog } from 'contentlayer/generated'
import type { CoreContent } from '@/lib/content/types'
import Link from '@/components/Link'
import { LabHero } from '@/components/home/LabHero'
import { PostFeed } from '@/components/home/PostFeed'

const MAX_DISPLAY = 5

export default function Home({ posts }: { posts: CoreContent<Blog>[] }) {
  const displayPosts = posts.slice(0, MAX_DISPLAY)

  return (
    <div className="relative min-h-screen">
      <LabHero postCount={posts.length} />

      {/* Section divider with dots */}
      <div className="relative flex items-center gap-4 py-4">
        <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
        <div className="h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-700" />
        <div className="bg-primary-400/50 h-1.5 w-1.5 rounded-full" />
        <div className="h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-700" />
        <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
      </div>

      {/* Latest posts */}
      <section className="pb-16">
        <h2 className="mb-6 font-mono text-xs font-medium tracking-widest text-gray-400 uppercase dark:text-gray-500">
          最新文章
        </h2>
        <PostFeed posts={displayPosts} />
      </section>

      {posts.length > MAX_DISPLAY && (
        <div className="flex justify-end pb-8 text-sm font-medium">
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
  )
}
