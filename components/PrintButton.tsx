'use client'

/**
 * 打印按钮：点击后调用浏览器打印，配合文章页的
 * @media print 样式只输出 A4 正文内容。
 */
export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      aria-label="打印文章"
      className="hover:border-primary-400 hover:text-primary-600 dark:hover:text-primary-400 inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-md border border-gray-300 px-2 py-0.5 text-xs text-gray-500 transition-colors dark:border-gray-700 dark:text-gray-400 print:hidden"
    >
      打印
    </button>
  )
}
