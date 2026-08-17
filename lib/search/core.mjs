const DEFAULT_LIMIT = 8

function normalizeQuery(query) {
  return query.trim().toLowerCase()
}

function includesValue(value, query) {
  return typeof value === 'string' && value.toLowerCase().includes(query)
}

function scoreDocument(document, query) {
  if (includesValue(document.title, query)) return 4
  if ((document.tags || []).some((tag) => includesValue(tag, query))) return 3
  if (includesValue(document.summary, query)) return 2
  if (includesValue(document.path, query)) return 1
  return 0
}

export function matchesSearchQuery(document, query) {
  const normalizedQuery = normalizeQuery(query)
  if (!normalizedQuery) return true
  return scoreDocument(document, normalizedQuery) > 0
}

export function filterSearchDocuments(documents, query, limit = DEFAULT_LIMIT) {
  const normalizedQuery = normalizeQuery(query)
  if (!normalizedQuery) return documents.slice(0, limit)

  return documents
    .map((document, index) => ({
      document,
      index,
      score: scoreDocument(document, normalizedQuery),
    }))
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, limit)
    .map((result) => result.document)
}
