import { useRef } from 'react'
import type { CSSProperties } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import Button from '../../components/Button/index.ts'
import ChipList from '../../components/ChipList/index.ts'
import PageHero from '../../components/PageHero/index.ts'
import { revealEase } from '../../components/Reveal/index.ts'
import { navCta } from '../../data/siteNav.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import { hgsPageCopy } from './hgsPageCopy.ts'
import styles from './HgsHero.module.css'

const { hero } = hgsPageCopy
const stack = hero.stackLabel.split(' / ')

const rise: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.55 + i * 0.1, ease: revealEase } }),
}

const link: Variants = {
  hidden: { scaleX: 0 },
  show: (i: number) => ({ scaleX: 1, transition: { duration: 0.9, delay: 0.35 + i * 0.18, ease: revealEase } }),
}

function HeroFacts() {
  const reduce = Boolean(useReducedMotion())
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })
  const initial = reduce ? false : 'hidden'
  const animate = inView ? 'show' : undefined

  return (
    <div ref={ref} className={styles.panel} data-in={reduce || inView}>
      <p className={styles.kicker}>{hero.factsLabel}</p>
      <ol className={styles.stack} aria-label={hero.highlights[1]}>
        {stack.map((item, index) => (
          <li key={item} className={styles.stackItem}>
            <motion.span className={styles.tag} variants={rise} custom={index - 3} initial={initial} animate={animate}>
              {item}
            </motion.span>
            {index < stack.length - 1 ? (
              <motion.span
                className={styles.link}
                aria-hidden="true"
                variants={link}
                custom={index}
                initial={initial}
                animate={animate}
              />
            ) : null}
          </li>
        ))}
      </ol>
      <dl className={styles.facts}>
        {hero.facts.map((fact, index) => (
          <motion.div
            key={fact.value}
            className={styles.fact}
            style={{ '--i': index } as CSSProperties}
            variants={rise}
            custom={index}
            initial={initial}
            animate={animate}
          >
            <dt>{fact.value}</dt>
            <dd>{fact.label}</dd>
          </motion.div>
        ))}
      </dl>
    </div>
  )
}

export default function HgsHero() {
  const path = usePath()

  return (
    <PageHero
      variant="split"
      eyebrow={hero.eyebrow}
      title={hero.title}
      lead={hero.lead}
      mediaOrder="last"
      aside={<ChipList items={hero.outcomes} label={hero.outcomesLabel} className={styles.outcomes} />}
      actions={
        <>
          <Button to={path(navCta.primary.route)} size="lg" arrow>
            {navCta.primary.label}
          </Button>
          <Button to={path(navCta.quickQuote.route)} variant="secondary" size="lg">
            {navCta.quickQuote.label}
          </Button>
        </>
      }
      media={<HeroFacts />}
    />
  )
}
