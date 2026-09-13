import { motion, useReducedMotion } from 'framer-motion'
import Button from '../Button/index.ts'
import { RevealGroup, RevealItem, revealEase } from '../Reveal/index.ts'
import styles from './CtaBand.module.css'

type CtaAction = { label: string; to: string }

type CtaBandProps = {
  eyebrow?: string
  title: string
  description?: string
  primary: CtaAction
  secondary?: CtaAction
}

/** Sayfa sonlarındaki koyu lacivert dönüşüm bandı. */
export default function CtaBand({ eyebrow, title, description, primary, secondary }: CtaBandProps) {
  const reduce = useReducedMotion()

  return (
    <section className={styles.band} aria-label={title}>
      <motion.span
        className={styles.line}
        aria-hidden="true"
        initial={reduce ? false : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 1.2, ease: revealEase }}
      />
      <RevealGroup className={styles.inner} stagger={0.1}>
        <div className={styles.copy}>
          {eyebrow ? (
            <RevealItem as="p" className={styles.eyebrow}>
              {eyebrow}
            </RevealItem>
          ) : null}
          <RevealItem y={30}>
            <h2 className={styles.title}>{title}</h2>
          </RevealItem>
          {description ? (
            <RevealItem as="p" className={styles.description}>
              {description}
            </RevealItem>
          ) : null}
        </div>
        <RevealItem className={styles.actions}>
          <Button to={primary.to} variant="light" size="lg" arrow>
            {primary.label}
          </Button>
          {secondary ? (
            <Button to={secondary.to} variant="outlineLight" size="lg">
              {secondary.label}
            </Button>
          ) : null}
        </RevealItem>
      </RevealGroup>
    </section>
  )
}
