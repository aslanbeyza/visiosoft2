/**
 * Kullanım:
 * <Prose toc html={post.content} />            // API'den gelen HTML: temizlenir, başlıklara id verilir
 * <Prose toc><h2 id="kapsam">Kapsam</h2><p>…</p></Prose>   // React içeriği; id'siz başlıklara id atanır
 * h2/h3/p/ul/ol/blockquote/table/code/img için tipografi. `toc` h2 başlıklardan yapışkan "İçindekiler" üretir
 * (tocDepth={3} ile h3 de eklenir); etkin başlık IntersectionObserver ile izlenir. Dar ekranda içindekiler katlanır.
 */
import { useId, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { useActiveHeading, useDomHeadings } from './headings.ts'
import { sanitizeHtml } from './sanitize.ts'
import { proseCopy } from './proseCopy.ts'
import styles from './Prose.module.css'

export type ProseProps = {
  children?: ReactNode
  /** Sunucudan gelen HTML; script ve on* öznitelikleri ayıklanır. `children` yerine kullanılır. */
  html?: string
  /** Başlıklardan yapışkan içindekiler listesi üretir. */
  toc?: boolean
  /** İçindekilere dahil edilen en derin başlık düzeyi. */
  tocDepth?: 2 | 3
  tocLabel?: string
  tone?: 'light' | 'dark'
  size?: 'md' | 'lg'
  className?: string
}

function Chevron() {
  return (
    <svg viewBox="0 0 16 16" className={styles.chevron} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="m4 6 4 4 4-4" />
    </svg>
  )
}

export default function Prose({
  children,
  html,
  toc = false,
  tocDepth,
  tocLabel = proseCopy.toc,
  tone = 'light',
  size = 'md',
  className = '',
}: ProseProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const titleId = useId()
  const listId = useId()
  const [tocOpen, setTocOpen] = useState(false)

  const sanitized = useMemo(() => (html === undefined ? null : sanitizeHtml(html, { tableWrapClass: styles.tableWrap })), [html])
  const domHeadings = useDomHeadings(rootRef, toc && html === undefined)
  const allHeadings = sanitized ? sanitized.headings : domHeadings
  // Düzey verilmezse h2 kullanılır; metinde hiç h2 yoksa içindekiler h3 başlıklardan üretilir.
  const depth = tocDepth ?? (allHeadings.some((heading) => heading.level === 2) ? 2 : 3)
  const headings = allHeadings.filter((heading) => heading.level <= depth)
  const active = useActiveHeading(
    headings.map((heading) => heading.id),
    toc && headings.length > 0,
  )

  const proseClass = `${styles.prose} ${className}`.trim()
  const content = sanitized ? (
    <div ref={rootRef} className={proseClass} data-tone={tone} data-size={size} dangerouslySetInnerHTML={{ __html: sanitized.html }} />
  ) : (
    <div ref={rootRef} className={proseClass} data-tone={tone} data-size={size}>
      {children}
    </div>
  )

  if (!toc) return content

  return (
    <div className={styles.layout} data-tone={tone} data-toc={headings.length > 0 ? 'true' : 'false'}>
      {headings.length > 0 ? (
        <aside className={styles.aside}>
          <nav className={styles.toc} aria-labelledby={titleId}>
            <p id={titleId} className={styles.tocTitle}>
              {tocLabel}
            </p>
            <button
              type="button"
              className={styles.tocToggle}
              aria-expanded={tocOpen}
              aria-controls={listId}
              onClick={() => setTocOpen((value) => !value)}
            >
              {tocLabel}
              <Chevron />
            </button>
            <ol id={listId} className={styles.tocList} data-open={tocOpen ? 'true' : 'false'}>
              {headings.map((heading) => (
                <li key={heading.id} className={styles.tocItem} data-level={heading.level}>
                  <a
                    href={`#${heading.id}`}
                    className={styles.tocLink}
                    aria-current={active === heading.id ? 'location' : undefined}
                    onClick={() => setTocOpen(false)}
                  >
                    {heading.text}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </aside>
      ) : null}
      {content}
    </div>
  )
}
