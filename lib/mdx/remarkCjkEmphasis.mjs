/**
 * remark-cjk-emphasis
 *
 * CommonMark's emphasis flanking rule refuses to *open* or *close* `*` / `**`
 * when the marker is adjacent to Unicode punctuation. In Chinese text the
 * emphasized phrase almost always ends in a full-width mark (。？；，）！…),
 * so `**怎么说话的？**` is left as literal asterisks instead of <strong>.
 *
 * This plugin converts the leftover literal `*` / `**` runs in text nodes into
 * `emphasis` / `strong` mdast nodes — but ONLY when the run is obviously CJK
 * emphasis (the
 * inner text, or the character right before the opening / after the closing
 * marker, is a CJK character or CJK punctuation). That guard keeps literal `*`
 * elsewhere (e.g. `2 * 3`, multiplication, file globs) untouched.
 *
 * Implemented as a post-order tree walk (not a mutating `visit`) so it cannot
 * re-enter and grow the tree.
 */
function isCJK(ch) {
  if (!ch) return false
  const c = ch.codePointAt(0)
  return (
    (c >= 0x3400 && c <= 0x4dbf) || // CJK Extension A
    (c >= 0x4e00 && c <= 0x9fff) || // CJK Unified Ideographs
    (c >= 0xf900 && c <= 0xfaff) || // CJK Compatibility Ideographs
    (c >= 0x3000 && c <= 0x303f) || // CJK Symbols and Punctuation
    (c >= 0xff00 && c <= 0xffef) || // Fullwidth forms (incl. full-width punctuation)
    (c >= 0x20000 && c <= 0x2ebef) // CJK Extension B+
  )
}

function hasCJK(str) {
  for (const ch of str) if (isCJK(ch)) return true
  return false
}

// Split a text value on a given emphasis regex, turning matched runs into
// `type` nodes only when the CJK guard passes; everything else stays text.
// The regex MUST carry the `g` flag: without it, exec() never advances
// lastIndex and the loop below spins forever.
function splitByRule(value, regex, type) {
  const out = []
  let last = 0
  let m
  regex.lastIndex = 0
  while ((m = regex.exec(value)) !== null) {
    const inner = m[1]
    const before = value[m.index - 1]
    const after = value[m.index + m[0].length]
    const ok = hasCJK(inner) || isCJK(before) || isCJK(after)
    if (!ok) {
      // Not CJK emphasis — keep markers as literal text.
      if (m.index > last) out.push({ type: 'text', value: value.slice(last, m.index) })
      out.push({ type: 'text', value: m[0] })
      last = m.index + m[0].length
      continue
    }
    if (m.index > last) out.push({ type: 'text', value: value.slice(last, m.index) })
    out.push({ type, children: [{ type: 'text', value: inner }] })
    last = m.index + m[0].length
  }
  if (last < value.length) out.push({ type: 'text', value: value.slice(last) })
  return out
}

function parseEmphasis(value) {
  // Strong first (so its markers are consumed before we look for single *).
  const strongNodes = splitByRule(value, /\*\*([^*]+?)\*\*/g, 'strong')
  const result = []
  for (const n of strongNodes) {
    if (n.type === 'text') {
      // mdast node type for single emphasis is `emphasis` (renders to <em>),
      // NOT `em`. Using `em` makes remark-rehype treat it as an unknown node
      // and emit a <div> fallback.
      result.push(...splitByRule(n.value, /\*([^*]+?)\*/g, 'emphasis'))
    } else {
      result.push(n)
    }
  }
  return result
}

function transform(node) {
  if (!node || typeof node !== 'object' || !Array.isArray(node.children)) return
  const out = []
  for (const child of node.children) {
    if (child.type === 'text' && typeof child.value === 'string' && child.value.includes('*')) {
      out.push(...parseEmphasis(child.value))
    } else {
      out.push(child)
    }
  }
  node.children = out
  for (const child of node.children) transform(child)
}

export function remarkCjkEmphasis() {
  return (tree) => {
    transform(tree)
  }
}
