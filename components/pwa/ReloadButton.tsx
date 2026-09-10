'use client'

export default function ReloadButton() {
  return (
    <button
      type="button"
      onClick={() => window.location.reload()}
      className="hover:text-primary-600 dark:hover:text-primary-400 font-mono text-xs text-gray-500 transition-colors dark:text-gray-400"
    >
      [ retry ]
    </button>
  )
}
