import { useRef } from 'react'
import { motion, useInView, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import type { MotionValue } from 'framer-motion'
import { revealEase } from '../../components/Reveal/index.ts'
import { useMediaQuery } from '../../hooks/useMediaQuery/index.ts'
import styles from './EdgeDiagram.module.css'

type EdgeDiagramProps = {
  label: string
  nodes: {
    field: { title: string; items: string[] }
    edge: { title: string; note: string }
    center: { title: string; note: string }
  }
  links: { local: string; sync: string }
}

type LinkProps = { label: string; sync?: boolean; show: boolean; delay: number; flow: MotionValue<string> }

function Link({ label, sync = false, show, delay, flow }: LinkProps) {
  const reduce = Boolean(useReducedMotion())
  const wide = useMediaQuery('(min-width: 768px)')
  const axis = wide ? 'scaleX' : 'scaleY'

  return (
    <div className={styles.link} data-sync={sync}>
      <span className={styles.linkLabel}>{label}</span>
      <span className={styles.track}>
        <motion.span
          key={axis}
          className={styles.draw}
          initial={reduce ? false : { [axis]: 0 }}
          animate={show ? { [axis]: 1 } : undefined}
          transition={{ duration: 0.9, delay, ease: revealEase }}
        >
          {sync ? <motion.span className={styles.dashes} style={reduce ? undefined : wide ? { x: flow } : { y: flow }} /> : null}
        </motion.span>
      </span>
    </div>
  )
}

export default function EdgeDiagram({ label, nodes, links }: EdgeDiagramProps) {
  const reduce = Boolean(useReducedMotion())
  const rootRef = useRef<HTMLDivElement>(null)
  const inView = useInView(rootRef, { once: true, amount: 0.35 })
  const show = reduce || inView
  const { scrollYProgress } = useScroll({ target: rootRef, offset: ['start end', 'end start'] })

  const flow = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])

  const rise = (index: number) => ({
    initial: reduce ? false : { opacity: 0, y: 20 },
    animate: show ? { opacity: 1, y: 0 } : undefined,
    transition: { duration: 0.8, delay: 0.1 + index * 0.35, ease: revealEase },
  })

  return (
    <div ref={rootRef} className={styles.root} role="img" aria-label={label}>
      <motion.div className={styles.node} data-kind="field" {...rise(0)} aria-hidden="true">
        <span className={styles.nodeTitle}>{nodes.field.title}</span>
        <ul className={styles.devices}>
          {nodes.field.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </motion.div>

      <Link label={links.local} show={show} delay={0.45} flow={flow} />

      <motion.div className={styles.node} data-kind="edge" {...rise(1)} aria-hidden="true">
        <span className={styles.nodeTitle}>{nodes.edge.title}</span>
        <span className={styles.note}>
          <span className={styles.pulse} />
          {nodes.edge.note}
        </span>
      </motion.div>

      <Link label={links.sync} sync show={show} delay={0.8} flow={flow} />

      <motion.div className={styles.node} data-kind="center" {...rise(2)} aria-hidden="true">
        <span className={styles.nodeTitle}>{nodes.center.title}</span>
        <span className={styles.note}>{nodes.center.note}</span>
      </motion.div>
    </div>
  )
}
