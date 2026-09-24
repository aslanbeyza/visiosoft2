
import { RevealGroup, RevealItem } from '../Reveal/index.ts'
import styles from './ChipList.module.css'

export type ChipListProps = {
  items: string[]
  tone?: 'light' | 'dark'

  icon?: 'check' | 'dot' | 'none'
  className?: string

  label?: string
}

export default function ChipList({ items, tone = 'light', icon = 'check', className = '', label }: ChipListProps) {
  if (items.length === 0) return null

  return (
    <div
      className={`${styles.root} ${className}`.trim()}
      data-tone={tone}
      data-icon={icon}
      role={label ? 'group' : undefined}
      aria-label={label}
    >
      <RevealGroup as="ul" className={styles.list} stagger={0.07} amount={0.4}>
        {items.map((item, index) => (
          <RevealItem as="li" key={`${index}-${item}`} className={styles.chip} y={14}>
            {icon === 'check' ? (
              <svg viewBox="0 0 16 16" className={styles.icon} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                <path d="m3.5 8.4 2.9 2.9 6.1-6.3" />
              </svg>
            ) : null}
            {icon === 'dot' ? <span className={styles.dot} aria-hidden="true" /> : null}
            {item}
          </RevealItem>
        ))}
      </RevealGroup>
    </div>
  )
}
