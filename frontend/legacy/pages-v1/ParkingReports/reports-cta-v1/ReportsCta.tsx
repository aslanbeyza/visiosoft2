import { motion, useReducedMotion } from 'framer-motion'
import Button from '../../components/Button/index.ts'
import Magnetic from '../../components/Magnetic/index.ts'
import { RevealGroup, RevealItem, revealEase } from '../../components/Reveal/index.ts'
import styles from './ReportsCta.module.css'

type ReportsCtaProps = {
  eyebrow?: string
  title: string
  description?: string
  primary: { label: string; to: string }
  secondary: { label: string; href: string }
}

export default function ReportsCta({ eyebrow, title, description, primary, secondary }: ReportsCtaProps) {
  const reduce = useReducedMotion()

  return (
    <section className={styles.band} aria-labelledby="rapor-cta-title">
      <motion.span
        className={styles.line}
        aria-hidden="true"
        initial={reduce ? false : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 1.2, ease: revealEase }}
      />
      <RevealGroup className={styles.inner} stagger={0.1}>
        <div>
          {eyebrow ? (
            <RevealItem as="p" className={styles.eyebrow}>
              {eyebrow}
            </RevealItem>
          ) : null}
          <RevealItem y={30}>
            <h2 id="rapor-cta-title" className={styles.title}>
              {title}
            </h2>
          </RevealItem>
          {description ? (
            <RevealItem as="p" className={styles.description}>
              {description}
            </RevealItem>
          ) : null}
        </div>
        <RevealItem className={styles.actions}>
          <Magnetic>
            <Button to={primary.to} variant="light" size="lg" arrow>
              {primary.label}
            </Button>
          </Magnetic>
          <Button href={secondary.href} external variant="outlineLight" size="lg">
            <svg className={styles.wa} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path
                fill="currentColor"
                d="M12 2a9.9 9.9 0 0 0-8.5 15l-1.4 5 5.1-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.4.8 3.2.7a2.8 2.8 0 0 0 1.8-1.3 2.3 2.3 0 0 0 .2-1.3c-.1-.1-.2-.2-.5-.3Z"
              />
            </svg>
            {secondary.label}
          </Button>
        </RevealItem>
      </RevealGroup>
    </section>
  )
}
