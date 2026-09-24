
const BLOCK_TAG = /<(p|h[1-6]|ul|ol|li|table|blockquote|div|figure|pre|section|article|hr)[\s>/]/i
const INDENT = /^(?:\s|&nbsp;|&#160;| )+/i

function inlineMarkdown(text: string) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>')
}

function renderBlock(block: string) {
  const lines = block
    .split('\n')
    .map((line) => line.replace(INDENT, '').trimEnd())
    .filter(Boolean)
  if (lines.length === 0) return ''

  const out: string[] = []
  let paragraph: string[] = []
  let list: { tag: 'ul' | 'ol'; items: string[] } | null = null

  const flushParagraph = () => {
    if (paragraph.length) out.push(`<p>${inlineMarkdown(paragraph.join(' '))}</p>`)
    paragraph = []
  }
  const flushList = () => {
    if (list) out.push(`<${list.tag}>${list.items.map((item) => `<li>${inlineMarkdown(item)}</li>`).join('')}</${list.tag}>`)
    list = null
  }

  for (const line of lines) {
    const heading = /^(#{2,4})\s+(.+?)\s*#*$/.exec(line)
    const bullet = /^[-*]\s+(.+)$/.exec(line)
    const ordered = /^\d+[.)]\s+(.+)$/.exec(line)
    if (heading) {
      flushParagraph()
      flushList()
      const level = heading[1].length
      out.push(`<h${level}>${inlineMarkdown(heading[2])}</h${level}>`)
    } else if (bullet || ordered) {
      flushParagraph()
      const tag = bullet ? 'ul' : 'ol'
      if (list && list.tag !== tag) flushList()
      if (!list) list = { tag, items: [] }
      list.items.push((bullet ?? ordered)![1])
    } else {
      flushList()
      paragraph.push(line)
    }
  }
  flushParagraph()
  flushList()
  return out.join('\n')
}

export function normalizeContent(content: string) {
  if (!content.trim()) return ''
  if (BLOCK_TAG.test(content)) {

    return content.replace(/(<p[^>]*>)(?:\s|&nbsp;|&#160;| )+/gi, '$1')
  }
  return content
    .replace(/\r\n?/g, '\n')
    .replace(/<br\s*\/?>/gi, '\n\n')
    .split(/\n\s*\n/)
    .map(renderBlock)
    .filter(Boolean)
    .join('\n')
}

export function tocDepthFor(html: string): 2 | 3 | null {
  if (/<h2[\s>]/i.test(html)) return 2
  if (/<h3[\s>]/i.test(html)) return 3
  return null
}
