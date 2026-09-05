'use client'

import { GiscusComments } from '@/components/comments/GiscusComments'
import siteMetadata from '@/data/siteMetadata'

export default function Comments() {
  const commentsProvider = (siteMetadata.comments as { provider?: string } | undefined)?.provider

  if (commentsProvider !== 'giscus') {
    return null
  }

  return (
    <div className="not-prose">
      <GiscusComments />
    </div>
  )
}
