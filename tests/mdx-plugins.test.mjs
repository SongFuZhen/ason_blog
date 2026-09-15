import assert from 'node:assert/strict'
import test from 'node:test'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { remark } from 'remark'

const fixturesDir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'fixtures')

/*
 * All three fixtures are real encoder output from the same 13x7 source canvas.
 * The size is deliberately non-square so a width/height swap cannot pass, and
 * the three files exercise the three container layouts WebP uses.
 */
const SOURCE_WIDTH = 13
const SOURCE_HEIGHT = 7
// FourCC is 4 bytes: the lossy one really is "VP8" followed by a space.
const WEBP_FIXTURES = [
  ['webp-vp8-lossy.webp', 'VP8 '],
  ['webp-vp8l-lossless.webp', 'VP8L'],
  ['webp-vp8x-alpha.webp', 'VP8X'],
]

test('extractTocHeadings returns GitHub-style heading links', async () => {
  const { extractTocHeadings } = await import('../lib/mdx/plugins.mjs')

  const toc = await extractTocHeadings('# Intro\n\n## Intro\n\n### Details')

  assert.deepEqual(toc, [
    { value: 'Intro', url: '#intro', depth: 1 },
    { value: 'Intro', url: '#intro-1', depth: 2 },
    { value: 'Details', url: '#details', depth: 3 },
  ])
})

test('remarkCodeTitles inserts a title node and keeps the code language', async () => {
  const { remarkCodeTitles } = await import('../lib/mdx/plugins.mjs')
  const processor = remark().use(remarkCodeTitles)
  const tree = processor.parse('```ts:lib/example.ts\nexport const value = 1\n```')
  const transformed = await processor.run(tree)

  assert.equal(transformed.children[0].type, 'mdxJsxFlowElement')
  assert.equal(transformed.children[0].name, 'div')
  assert.deepEqual(transformed.children[0].attributes, [
    { type: 'mdxJsxAttribute', name: 'className', value: 'remark-code-title' },
  ])
  assert.deepEqual(transformed.children[0].children, [{ type: 'text', value: 'lib/example.ts' }])
  assert.equal(transformed.children[1].type, 'code')
  assert.equal(transformed.children[1].lang, 'ts')
})

test('readImageDimensions reads all three WebP container layouts', async () => {
  const { readImageDimensions } = await import('../lib/mdx/plugins.mjs')

  for (const [file] of WEBP_FIXTURES) {
    const dimensions = readImageDimensions(path.join(fixturesDir, file))

    assert.ok(dimensions, `${file}: expected dimensions, got ${dimensions}`)
    assert.equal(dimensions.width, SOURCE_WIDTH, `${file}: width`)
    assert.equal(dimensions.height, SOURCE_HEIGHT, `${file}: height`)
  }
})

/*
 * Guards the premise of the test above: if a fixture is ever regenerated into a
 * different layout, these assertions fail loudly instead of letting the VP8
 * branch quietly stop being covered.
 */
test('WebP fixtures cover VP8, VP8L and VP8X', () => {
  for (const [file, expectedChunk] of WEBP_FIXTURES) {
    const buffer = readFileSync(path.join(fixturesDir, file))

    assert.equal(buffer.toString('ascii', 0, 4), 'RIFF', `${file}: RIFF magic`)
    assert.equal(buffer.toString('ascii', 8, 12), 'WEBP', `${file}: WEBP magic`)
    assert.equal(buffer.toString('ascii', 12, 16), expectedChunk, `${file}: chunk layout`)
  }
})
