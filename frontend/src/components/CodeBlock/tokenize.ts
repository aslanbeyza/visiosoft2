
export type TokenType = 'text' | 'string' | 'key' | 'number' | 'comment' | 'keyword' | 'method' | 'url' | 'punct'

export type Token = { type: TokenType; value: string }

const KEYWORDS = new Set([
  'const',
  'let',
  'var',
  'function',
  'return',
  'import',
  'export',
  'from',
  'default',
  'await',
  'async',
  'if',
  'else',
  'for',
  'while',
  'new',
  'class',
  'extends',
  'try',
  'catch',
  'throw',
  'true',
  'false',
  'null',
  'undefined',
  'def',
  'curl',
])

const METHODS = new Set(['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'])

const HASH_COMMENT_LANGUAGES = new Set(['bash', 'sh', 'shell', 'zsh', 'yaml', 'yml', 'python', 'py', 'toml', 'ini'])

const SLASH_PATTERN = /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|((?<![:\w])\/\/.*)|(\bhttps?:\/\/\S+|\bwss?:\/\/\S+)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_$][\w$]*)|([{}[\]():,;=<>+\-*/%!&|?.])/g
const HASH_PATTERN = /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(#.*)|(\bhttps?:\/\/\S+|\bwss?:\/\/\S+)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_$][\w$-]*)|([{}[\]():,;=<>+\-*/%!&|?.])/g

export function tokenizeLine(line: string, language = ''): Token[] {
  const pattern = HASH_COMMENT_LANGUAGES.has(language.toLowerCase()) ? HASH_PATTERN : SLASH_PATTERN
  const tokens: Token[] = []
  let cursor = 0

  pattern.lastIndex = 0
  for (let match = pattern.exec(line); match !== null; match = pattern.exec(line)) {
    if (match.index > cursor) tokens.push({ type: 'text', value: line.slice(cursor, match.index) })
    const [value, string, comment, url, number, word, punct] = match
    let type: TokenType = 'text'
    if (string !== undefined) type = /^\s*:/.test(line.slice(match.index + value.length)) ? 'key' : 'string'
    else if (comment !== undefined) type = 'comment'
    else if (url !== undefined) type = 'url'
    else if (number !== undefined) type = 'number'
    else if (word !== undefined) type = METHODS.has(word) ? 'method' : KEYWORDS.has(word) ? 'keyword' : 'text'
    else if (punct !== undefined) type = 'punct'
    tokens.push({ type, value })
    cursor = match.index + value.length
    if (value.length === 0) pattern.lastIndex++
  }
  if (cursor < line.length) tokens.push({ type: 'text', value: line.slice(cursor) })

  return tokens
}
