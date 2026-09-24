import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import CodeBlock from '../../components/CodeBlock/index.ts'
import { revealEase } from '../../components/Reveal/index.ts'
import styles from './HeroTerminal.module.css'

type Snippet = { title: string; language: string; code: string }

type HeroTerminalProps = {
  label: string
  flow: string[]
  socket: Snippet
  webhook: Snippet
}

export default function HeroTerminal({ label, flow, socket, webhook }: HeroTerminalProps) {
  const reduce = Boolean(useReducedMotion())
  const railRef = useRef<HTMLOListElement>(null)
  const inView = useInView(railRef, { once: true, amount: 0.6 })
  const show = reduce || inView

  return (
    <div className={styles.root}>
      <ol ref={railRef} className={styles.rail} aria-label={label}>
        <motion.span
          className={styles.railLine}
          aria-hidden="true"
          initial={reduce ? false : { scaleX: 0 }}
          animate={show ? { scaleX: 1 } : undefined}
          transition={{ duration: 1.4, delay: 0.3, ease: revealEase }}
        />
        {flow.map((step, index) => (
          <motion.li
            key={step}
            className={styles.step}
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={show ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.6, delay: 0.35 + index * 0.3, ease: revealEase }}
          >
            <span className={styles.dot} aria-hidden="true" />
            <span className={styles.stepLabel}>{step}</span>
          </motion.li>
        ))}
      </ol>

      <div className={styles.blocks}>
        <div className={styles.block} data-index="0">
          <CodeBlock title={socket.title} language={socket.language} code={socket.code} typing />
        </div>
        <div className={styles.block} data-index="1">
          {}
          <CodeBlock title={webhook.title} language={webhook.language} code={webhook.code} typing delay={1.5} />
        </div>
      </div>
    </div>
  )
}
