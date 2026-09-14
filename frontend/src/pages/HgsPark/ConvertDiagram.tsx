import { useRef } from 'react'
import type { CSSProperties } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'
import styles from './ConvertDiagram.module.css'

type DiagramNode = { kicker: string; title: string }

type ConvertDiagramProps = {
  label: string
  nodes: DiagramNode[]
}

/**
 * Dönüşüm şeması: mevcut plaka tanıma → HGS Park → ödeme merkezi. Kırpılmamış kök görünüme girince düğümler
 * sırayla yükselir, aralarındaki bağlantı çizgileri çizilir (M3). Hareket azaltmada tam hâlde görünür.
 */
export default function ConvertDiagram({ label, nodes }: ConvertDiagramProps) {
  const reduce = Boolean(useReducedMotion())
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })

  return (
    <div ref={ref} className={styles.root} data-in={reduce || inView}>
      <ol className={styles.nodes} aria-label={label}>
        {nodes.map((node, index) => (
          <li
            key={node.title}
            className={styles.node}
            data-core={index === 1}
            style={{ '--i': index } as CSSProperties}
          >
            <span className={styles.kicker}>{node.kicker}</span>
            <span className={styles.title}>{node.title}</span>
            {index < nodes.length - 1 ? (
              <span className={styles.link} aria-hidden="true">
                <span className={styles.line} />
                <svg viewBox="0 0 12 12" className={styles.head} focusable="false">
                  <path d="M3 2.5 7.5 6 3 9.5" />
                </svg>
              </span>
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  )
}
