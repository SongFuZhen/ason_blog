import assert from 'node:assert/strict'
import test from 'node:test'

test('tagKey maps a registered display name to its URL key', async () => {
  const { tagKey } = await import('../data/tags.ts')
  assert.equal(tagKey('AI'), 'ai')
  assert.equal(tagKey('AI Coding'), 'ai-coding')
})

test('tagName maps a key back to its display name', async () => {
  const { tagName } = await import('../data/tags.ts')
  assert.equal(tagName('ai'), 'AI')
  assert.equal(tagName('ai-coding'), 'AI Coding')
})

test('unknown tags fall back to a slug instead of throwing', async () => {
  const { tagKey, tagName } = await import('../data/tags.ts')
  assert.equal(tagKey('未登记的标签'), '未登记的标签')
  assert.equal(tagName('not-registered'), 'not-registered')
})
