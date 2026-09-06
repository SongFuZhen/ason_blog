// Rehype plugin: convert string `style="..."` attributes (valid HTML, but
// invalid as a React/JSX prop) into style objects so plain Markdown/HTML
// written in .md/.mdx files renders without the
// "The `style` prop expects a mapping ..." error.
//
// MDX compiles HTML tags to MDX JSX element nodes (mdxJsxFlowElement /
// mdxJsxTextElement) whose static `style` attribute is a plain string. React's
// `style` prop must be an object ({zoom:'50%'}) rather than a CSS string
// ("zoom:50%;"). This plugin rewrites those string attributes into JSX
// expression attributes ({zoom:"50%"}) during compilation, so authors can keep
// writing familiar HTML like <img style="zoom:50%;" />.

function parseStyleToObject(str) {
  const style = {}
  if (typeof str !== 'string') return style
  for (const decl of str.split(';')) {
    const sep = decl.indexOf(':')
    if (sep === -1) continue
    const prop = decl.slice(0, sep).trim()
    const value = decl.slice(sep + 1).trim()
    if (!prop) continue
    // Preserve CSS custom properties (--foo) verbatim.
    if (prop.startsWith('--')) {
      style[prop] = value
      continue
    }
    const camel = prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
    style[camel] = value
  }
  return style
}

function styleStringToExpression(str) {
  const obj = parseStyleToObject(str)
  const lit =
    '{' +
    Object.entries(obj)
      .map(([k, v]) => `${JSON.stringify(k)}:${JSON.stringify(v)}`)
      .join(',') +
    '}'
  // hast-util-to-estree expects the expression as an estree `Program` node
  // (body[0].expression is the actual expression) on `value.data.estree`.
  const expression = {
    type: 'ObjectExpression',
    properties: Object.entries(obj).map(([k, v]) => ({
      type: 'Property',
      kind: 'init',
      method: false,
      shorthand: false,
      computed: false,
      key: { type: 'Literal', value: k, raw: JSON.stringify(k) },
      value: { type: 'Literal', value: v, raw: JSON.stringify(v) },
    })),
  }
  return {
    type: 'mdxJsxAttributeValueExpression',
    value: lit,
    data: {
      estree: {
        type: 'Program',
        body: [{ type: 'ExpressionStatement', expression }],
        sourceType: 'module',
        comments: [],
      },
    },
  }
}

function walk(node) {
  if (!node || typeof node !== 'object') return

  if (
    (node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement') &&
    Array.isArray(node.attributes)
  ) {
    for (const attr of node.attributes) {
      if (attr && attr.type === 'mdxJsxAttribute' && attr.name === 'style' && typeof attr.value === 'string') {
        attr.value = styleStringToExpression(attr.value)
      }
    }
  }

  // Also handle already-parsed hast elements (e.g. produced by rehype-raw).
  if (node.type === 'element' && node.properties && typeof node.properties.style === 'string') {
    const obj = parseStyleToObject(node.properties.style)
    node.properties.style = obj
  }

  if (Array.isArray(node.children)) {
    for (const child of node.children) walk(child)
  }
}

export function rehypeParseStyle() {
  return (tree) => {
    walk(tree)
  }
}
