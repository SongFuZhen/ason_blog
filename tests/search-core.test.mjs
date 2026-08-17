import assert from 'node:assert/strict'
import test from 'node:test'

test('filterSearchDocuments returns the initial preview for an empty query', async () => {
  const { filterSearchDocuments } = await import('../lib/search/core.mjs')
  const documents = Array.from({ length: 10 }, (_, index) => ({
    path: `blog/post-${index}`,
    title: `Post ${index}`,
  }))

  const results = filterSearchDocuments(documents, '')

  assert.equal(results.length, 8)
  assert.deepEqual(
    results.map((document) => document.path),
    documents.slice(0, 8).map((document) => document.path)
  )
})

test('filterSearchDocuments ranks title matches before weaker field matches', async () => {
  const { filterSearchDocuments } = await import('../lib/search/core.mjs')
  const documents = [
    {
      path: 'blog/rendering-notes',
      title: 'Rendering notes',
      summary: 'A compact index for local discovery',
      tags: ['nextjs'],
    },
    {
      path: 'blog/local-search',
      title: 'Local search architecture',
      summary: 'How generated documents power the command palette',
      tags: ['contentlayer'],
    },
    {
      path: 'blog/content-pipeline',
      title: 'Content pipeline',
      summary: 'Search index generation for static publishing',
      tags: ['search'],
    },
  ]

  const results = filterSearchDocuments(documents, 'search')

  assert.deepEqual(
    results.map((document) => document.path),
    ['blog/local-search', 'blog/content-pipeline']
  )
})
