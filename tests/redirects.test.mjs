import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import test from 'node:test'

const require = createRequire(import.meta.url)
const redirects = require('../lib/redirects.generated.cjs')

test('redirect table is generated and non-empty', () => {
  assert.ok(Array.isArray(redirects))
  assert.ok(redirects.length > 0)
})

test('no redirect loops back to itself case-insensitively', () => {
  // Next.js matches redirect sources case-insensitively, so `/categories/AI`
  // redirecting to `/categories/ai` would match the destination and loop.
  const loops = redirects.filter(
    (redirect) => redirect.source.toLowerCase() === redirect.destination.toLowerCase()
  )
  assert.deepEqual(loops, [])
})

test('every redirect has a non-empty source and destination', () => {
  for (const redirect of redirects) {
    assert.equal(typeof redirect.source, 'string')
    assert.equal(typeof redirect.destination, 'string')
    assert.ok(redirect.source.startsWith('/'))
    assert.ok(redirect.destination.startsWith('/'))
  }
})
