import type { Blog } from 'contentlayer/generated'
import { formatDate } from '@/lib/content/format-date.mjs'
import type { CoreContent } from '@/lib/content/types'
import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'

type PostFeedProps = {
  posts: CoreContent<Blog>[]
}

function PostFeedItem({ index, post }: { index: number; post: CoreContent<Blog> }) {
  const { slug, date, title, tags } = post

  return (
    <li className="animate-item-reveal opacity-0" style={{ animationDelay: `${index * 60}ms` }}>
      <article className="group flex items-baseline gap-4 py-4">
        <time
          dateTime={date}
          className="shrink-0 font-mono text-xs text-gray-400 dark:text-gray-500"
          suppressHydrationWarning
        >
          {formatDate(date, siteMetadata.locale)}
        </time>
        <div className="min-w-0 flex-1">
          <h2 className="font-heading text-base font-medium tracking-tight">
            <Link
              href={`/blog/${slug}`}
              className="text-gray-900 transition-all duration-200 hover:translate-x-1 hover:underline hover:underline-offset-4 dark:text-gray-100"
            >
              {title}
            </Link>
          </h2>
          {tags.length > 0 && (
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <Tag key={tag} text={tag} />
              ))}
            </div>
          )}
        </div>
      </article>
    </li>
  )
}

export function PostFeed({ posts }: PostFeedProps) {
  if (!posts.length) {
    return <p className="py-10 text-sm text-gray-500 dark:text-gray-400">还没有文章。</p>
  }

  return (
    <ul className="divide-y divide-gray-200 dark:divide-gray-800">
      {posts.map((post, index) => (
        <PostFeedItem key={post.slug} index={index} post={post} />
      ))}
    </ul>
  )
}
