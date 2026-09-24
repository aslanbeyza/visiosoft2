import { useId } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import Reveal, { revealEase } from '../Reveal/index.ts'
import TextReveal from '../TextReveal/index.ts'
import RouteScene from './RouteScene.tsx'
import styles from './LeadHero.module.css'

export type LeadHeroProps = {
  eyebrow: string
  title: string | string[]
  lead: string
  variant: 'quote' | 'discovery'
  route?: { label: string; steps: string[] }

  jump?: { href: string; label: string }
}

export default function LeadHero({ eyebrow, title, lead, variant, route, jump }: LeadHeroProps) {
  const reduce = Boolean(useReducedMotion())
  const titleId = useId()
  const titleProps = Array.isArray(title) ? { lines: title } : { text: title }

  return (
    <section className={styles.hero} aria-labelledby={titleId} data-variant={variant}>
      <div className={styles.copy}>
        <Reveal as="p" className={styles.eyebrow} delay={0.05} y={14} amount={0.1}>
          <motion.span
            className={styles.rule}
            aria-hidden="true"
            initial={reduce ? false : { scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.9, delay: 0.25, ease: revealEase }}
          />
          {eyebrow}
        </Reveal>

        <TextReveal as="h1" id={titleId} className={styles.title} delay={0.15} {...titleProps} />

        <Reveal as="p" className={styles.lead} delay={0.45} y={20} amount={0.1}>
          {lead}
        </Reveal>

        {jump ? (
          <Reveal className={styles.jumpWrap} delay={0.6} y={14} amount={0.1}>
            <a className={styles.jump} href={jump.href}>
              {jump.label}
              <svg viewBox="0 0 24 24" className={styles.jumpIcon} aria-hidden="true" focusable="false">
                <path d="M12 5v14M6 13l6 6 6-6" />
              </svg>
            </a>
          </Reveal>
        ) : null}
      </div>

      {route ? (
        <Reveal className={styles.stage} delay={0.35} y={28} amount={0.2}>
          <RouteScene variant={variant} steps={route.steps} label={route.label} />
        </Reveal>
      ) : null}
    </section>
  )
}
