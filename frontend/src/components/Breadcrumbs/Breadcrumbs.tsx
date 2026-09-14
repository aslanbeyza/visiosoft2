/**
 * Kullanım:
 *   <Breadcrumbs items={[{ label: 'Ana sayfa', to: path('home') }, { label: 'Donanım', to: path('hardware-products') }, { label: 'Kiosk' }]} />
 * Son öğe geçerli sayfadır (aria-current="page"); `to` verilmeyen ara öğeler düz metin olarak basılır.
 * Koyu zeminde `tone="dark"` kullanın.
 */
import { Link } from 'react-router-dom'
import { breadcrumbsCopy } from './breadcrumbsCopy.ts'
import styles from './Breadcrumbs.module.css'

export type BreadcrumbItem = {
  label: string
  to?: string
}

export type BreadcrumbsProps = {
  items: BreadcrumbItem[]
  tone?: 'light' | 'dark'
  className?: string
  /** nav etiketi; varsayılan "Sayfa yolu". */
  label?: string
}

function Chevron() {
  return (
    <svg className={styles.chevron} viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path d="M6 3.5 10.5 8 6 12.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function Breadcrumbs({ items, tone = 'light', className = '', label }: BreadcrumbsProps) {
  if (items.length === 0) return null

  return (
    <nav aria-label={label ?? breadcrumbsCopy.label} className={`${styles.nav} ${className}`.trim()} data-tone={tone}>
      <ol className={styles.list}>
        {items.map((item, index) => {
          const last = index === items.length - 1
          return (
            <li key={`${index}-${item.label}`} className={styles.item}>
              {!last && item.to ? (
                <Link to={item.to} className={styles.link}>
                  {item.label}
                </Link>
              ) : (
                <span className={styles.text} aria-current={last ? 'page' : undefined}>
                  {item.label}
                </span>
              )}
              {last ? null : <Chevron />}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
