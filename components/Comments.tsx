'use client'

import { GiscusComments } from '@/components/comments/GiscusComments'
import siteMetadata from '@/data/siteMetadata'

export default function Comments({ term }: { term?: string }) {
  const commentsProvider = (siteMetadata.comments as { provider?: string } | undefined)?.provider

  if (commentsProvider !== 'giscus') {
    return null
  }

  return (
    <div className="not-prose">
      <GiscusComments term={term} />
    </div>
  )
}
