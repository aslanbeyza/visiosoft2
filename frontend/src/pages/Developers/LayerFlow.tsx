import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { revealEase } from '../../components/Reveal/index.ts'
import styles from './LayerFlow.module.css'

type LayerFlowProps = {
  label: string
  inputs: string[]
  hub: string
  channel: string
  outputs: string[]
}

/**
 * Katman şeması: kaynaklar → merkez (SDK/API) → kanal → hedefler.
 * Bağlantılar sırayla çizilir; dar ekranda dikey akar. Tüm metin gerçek DOM'dur.
 */
export default function LayerFlow({ label, inputs, hub, channel, outputs }: LayerFlowProps) {
  const reduce = Boolean(useReducedMotion())
  const rootRef = useRef<HTMLDivElement>(null)
  const inView = useInView(rootRef, { once: true, amount: 0.4 })
  const show = reduce || inView

  const appear = (delay: number, axis: 'x' | 'y' = 'y') => ({
    initial: reduce ? false : { opacity: 0, [axis]: 14 },
    animate: show ? { opacity: 1, [axis]: 0 } : undefined,
    transition: { duration: 0.7, delay, ease: revealEase },
  })
  const draw = (delay: number) => ({
    initial: reduce ? false : { scale: 0 },
    animate: show ? { scale: 1 } : undefined,
    transition: { duration: 0.8, delay, ease: revealEase },
  })

  return (
    <div ref={rootRef} className={styles.root} role="group" aria-label={label}>
      <ul className={styles.list} data-side="inputs">
        {inputs.map((item, index) => (
          <motion.li key={item} className={styles.item} {...appear(0.1 + index * 0.08)}>
            {item}
          </motion.li>
        ))}
      </ul>

      <span className={styles.connector} aria-hidden="true">
        <motion.span className={styles.connectorLine} {...draw(0.45)} />
      </span>

      <motion.div className={styles.hub} {...appear(0.7)}>
        <span className={styles.hubName}>{hub}</span>
        <span className={styles.channel}>{channel}</span>
      </motion.div>

      <span className={styles.connector} aria-hidden="true">
        <motion.span className={styles.connectorLine} {...draw(0.95)} />
      </span>

      <ul className={styles.list} data-side="outputs">
        {outputs.map((item, index) => (
          <motion.li key={item} className={styles.item} data-output="true" {...appear(1.2 + index * 0.08)}>
            {item}
          </motion.li>
        ))}
      </ul>
    </div>
  )
}
