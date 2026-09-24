import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import Button from '../Button/index.ts'
import { revealEase } from '../Reveal/index.ts'
import Section from '../Section/index.ts'
import SectionHeading from '../SectionHeading/index.ts'
import { useMediaQuery } from '../../hooks/useMediaQuery/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import FlowCompact from './FlowCompact.tsx'
import FlowPinned from './FlowPinned.tsx'
import FlowStatic from './FlowStatic.tsx'
import { homeSystemFlowCopy as text } from './homeSystemFlowCopy.ts'
import styles from './HomeSystemFlow.module.css'

export default function HomeSystemFlow() {
  const reduce = Boolean(useReducedMotion())
  const wide = useMediaQuery('(min-width: 1024px)')
  const path = usePath()
  const headRef = useRef<HTMLDivElement>(null)
  const pinned = wide && !reduce

  useEffect(() => {
    headRef.current?.querySelector(`#${text.titleId}`)?.setAttribute('tabindex', '-1')
  }, [])

  return (
    <Section id="sistem" tone="surface" spacing="lg" labelledBy={text.titleId} className={styles.section}>
      <div ref={headRef} className={styles.head} data-pinned={pinned}>
        <SectionHeading eyebrow={text.eyebrow} title={text.title} lead={text.lead} id={text.titleId} />
      </div>

      {reduce ? <FlowStatic /> : pinned ? <FlowPinned /> : <FlowCompact />}

      <motion.div
        className={styles.links}
        initial={reduce ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.7, ease: revealEase }}
      >
        <Button to={path(text.links.primary.route)} variant="secondary" arrow>
          {text.links.primary.label}
        </Button>
        <Link to={path(text.links.secondary.route)} className={styles.textLink}>
          {text.links.secondary.label}
          <svg viewBox="0 0 24 24" className={styles.textLinkArrow} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </Link>
      </motion.div>
    </Section>
  )
}
