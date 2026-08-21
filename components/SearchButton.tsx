'use client'

import { openSearchDialog } from '@/components/search/SearchDialogController'
import siteMetadata from '@/data/siteMetadata'

const SearchButton = () => {
  if (siteMetadata.search?.provider === 'kbar') {
    return (
      <button
        aria-label="搜索"
        className="hover:text-primary-500 dark:hover:text-primary-400 text-gray-700 transition-colors outline-none select-none dark:text-gray-300"
        onClick={openSearchDialog}
        type="button"
      >
        <span className="hidden sm:inline">〔 搜索 〕</span>
        <span className="sm:hidden" aria-hidden>
          搜索
        </span>
      </button>
    )
  }

  return null
}

export default SearchButton
