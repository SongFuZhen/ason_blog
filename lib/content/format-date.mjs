/*
 * Format a date for post metadata and search result subtitles.
 *
 * Output uses long month name, numeric day, numeric year, and `en-US` when no
 * locale is supplied. Callers pass `siteMetadata.locale` where the UI should
 * follow site configuration.
 *
 * @param {string | Date} date Date value accepted by the JavaScript `Date` constructor.
 * @param {string} [locale='en-US'] BCP 47 locale string.
 * @returns {string} Locale-formatted date, e.g. `March 10, 2025`.
 */
export function formatDate(date, locale = 'en-US') {
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Compact date for search results. Current year → "3月10日", other years → "24/3/10".
 *
 * @param {string | Date} date
 * @returns {string}
 */
export function formatDateShort(date) {
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) return ''
  const now = new Date()
  if (d.getUTCFullYear() === now.getUTCFullYear()) {
    return `${d.getUTCMonth() + 1}月${d.getUTCDate()}日`
  }
  return `${String(d.getUTCMonth() + 1).padStart(2, '0')}/${String(d.getUTCDate()).padStart(2, '0')}`
}
