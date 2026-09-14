/**
 * Kullanım:
 *   <CheckList items={copy.summary} />
 *   <CheckList items={copy.use_cases} columns={2} tone="dark" />
 * Onay işaretleri görünüme girince sırayla çizilir (M3); satırlar hafifçe yükselir.
 * Hareket azaltmada işaretler ve satırlar doğrudan tam hâlde görünür.
 */
import { motion } from 'framer-motion'
import { RevealGroup, RevealItem, revealEase } from '../Reveal/index.ts'
import styles from './CheckList.module.css'

export type CheckListProps = {
  items: string[]
  columns?: 1 | 2
  tone?: 'light' | 'dark'
  className?: string
  /** Liste için erişilebilir etiket (grup adı). */
  label?: string
}

export default function CheckList({ items, columns = 1, tone = 'light', className = '', label }: CheckListProps) {
  if (items.length === 0) return null

  return (
    <div
      className={`${styles.root} ${className}`.trim()}
      data-columns={columns}
      data-tone={tone}
      role={label ? 'group' : undefined}
      aria-label={label}
    >
      <RevealGroup as="ul" className={styles.list} stagger={0.09} amount={0.2}>
        {items.map((item, index) => (
          <RevealItem as="li" key={`${index}-${item}`} className={styles.item} y={16}>
            <span className={styles.check} aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" focusable="false">
                <motion.path
                  d="m5 12.5 4.5 4.5L19 7.5"
                  variants={{
                    hidden: { pathLength: 0, opacity: 0 },
                    show: { pathLength: 1, opacity: 1, transition: { duration: 0.6, delay: 0.2, ease: revealEase } },
                  }}
                />
              </svg>
            </span>
            <span className={styles.text}>{item}</span>
          </RevealItem>
        ))}
      </RevealGroup>
    </div>
  )
}
