import type { BlogPost } from '../../services/index.ts'
import { blogCopy } from './blogCopy.ts'

type CoverSource = Pick<BlogPost, 'slug' | 'featured_image'>

export function postMeta(post: Pick<BlogPost, 'formatted_date' | 'reading_minutes'>) {
  const parts: string[] = []
  if (post.formatted_date) parts.push(post.formatted_date)
  if (post.reading_minutes && post.reading_minutes > 0) parts.push(blogCopy.readingTime(post.reading_minutes))
  return parts.join(' · ')
}

const namedEntities: Record<string, string> = { amp: '&', quot: '"', apos: "'", nbsp: ' ', lt: '<', gt: '>' }

function decodeEntities(text: string) {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, code: string) => {
    if (code[0] === '#') {
      const value = code[1].toLowerCase() === 'x' ? parseInt(code.slice(2), 16) : Number(code.slice(1))
      return Number.isFinite(value) && value > 0 ? String.fromCodePoint(value) : match
    }
    return namedEntities[code.toLowerCase()] ?? match
  })
}

export function plainText(text?: string | null) {
  return decodeEntities((text ?? '').replace(/<[^>]+>/g, ' '))
    .replace(/(^|\n)[ \t]*(#{1,6}|[-*]|\d+[.)])[ \t]+/g, '$1')
    .replace(/\*\*/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export function readableExcerpt(text?: string | null) {
  const value = plainText(text)
  if (!value) return ''
  if (/[.!?…)"”]$/.test(value)) return value
  const whole = value.replace(/\s+\S*$/, '').replace(/[\s,;:–—-]+$/, '')
  if (!whole) return `${value}…`

  return /[.!?…)"”]$/.test(whole) ? whole : `${whole}…`
}

export function excerptRepeatsContent(excerpt?: string | null, content?: string | null) {
  const head = plainText(excerpt).slice(0, 80)
  return head.length > 0 && plainText(content).startsWith(head)
}

const fileName = (src: string) => {
  let file = src
  try {
    file = decodeURIComponent(src)
  } catch {

  }
  return (file.split('/').pop() ?? '').replace(/\.[a-z0-9]+$/i, '').toLocaleLowerCase('tr-TR')
}

const plateCovers = new Set(['visiosoft otopark sistemi', 'visiosoft-otopark-sistemleri', 'insansiz-plaka-sistemleri', 'arac-plaka-tanima'])

const neutral = {
  garage: '/img/İnsansiz-Otopark.webp',
  hall: '/img/pages/otopark-1600.webp',
  street: '/img/pages/yol_ustu.webp',
  exit: '/img/otopark-cikis.jpeg',
}
const neutralPool = [neutral.hall, neutral.street, neutral.garage]

const slugCovers: Record<string, string> = {
  'plaka-tanima-sistemi-otopark-yazilimi-ve-otopark-kurulumu-rehberi': neutral.hall,
  'izmirde-otopark-sorunu-ve-akilli-plaka-tanima-sistemleri-ile-cozum': neutral.street,
  'istanbul-insansiz-otopark-sistemleri': neutral.hall,
  'otopark-yonetiminde-isler-nasil-kolaylasir-yeni-nesil-yazilimlar-ne-sagliyor': neutral.exit,
  'otopark-cozumlerinde-visiosoft-yaklasimi': neutral.garage,
  'c2c-otopark-platformu-kurarken-dikkat-edilmesi-gerekenler': neutral.hall,
  'akilli-park-sistemi-nedir-ne-ise-yarar': neutral.street,
  'akilli-otopark-kurulumu': neutral.garage,
}

export function postCover(post: CoverSource) {
  const src = post.featured_image
  if (!src) return undefined
  if (!plateCovers.has(fileName(src))) return src
  if (slugCovers[post.slug]) return slugCovers[post.slug]
  const hash = Array.from(post.slug).reduce((sum, char) => (sum * 31 + char.charCodeAt(0)) >>> 0, 7)
  return neutralPool[hash % neutralPool.length]
}

export function postImage(post: CoverSource) {
  const src = postCover(post)
  return src ? { src, width: 1200, height: 900, alt: '', fit: 'cover' as const } : undefined
}

export type CoverNote = 'render' | 'demo'

const coverNotes: Record<string, CoverNote> = {
  'insansiz-otopark': 'render',
  'otopark-1600': 'render',
  yol_ustu: 'render',
  toger_ustten_gorunus: 'render',
  'tır insansiz ödeme': 'render',
  '1c64fe62-3432-446a-a784-5973c460989c': 'render',

  'arac-plaka-tanima': 'render',
  'visiosoft otopark sistemi': 'render',
  'visiosoft-otopark-sistemleri': 'render',
  'insansiz-plaka-sistemleri': 'render',
  zone2: 'demo',
  zone3: 'demo',
  'visiosoft-finansal-raporlar': 'demo',
  'visiosoft-oturumlar-sayfasi': 'demo',
  visiosoft: 'demo',
}

export function coverNote(src?: string | null): CoverNote | undefined {
  return src ? coverNotes[fileName(src)] : undefined
}

export function coverCaption(src?: string | null) {
  const note = coverNote(src)
  return note ? blogCopy.coverNotes[note] : undefined
}
