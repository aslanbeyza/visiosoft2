import { motion, useReducedMotion } from 'framer-motion'
import { RevealGroup, RevealItem, revealEase } from '../Reveal/index.ts'
import styles from './SectionHeading.module.css'

type SectionHeadingProps = {
  eyebrow?: string
  title: string
  lead?: string
  as?: 'h1' | 'h2'
  id?: string
  align?: 'start' | 'center'
  tone?: 'light' | 'dark'
  className?: string
}

/** Kurumsal bölüm başlığı: çizgili üst etiket, başlık ve açıklama sırayla belirir. */
export default function SectionHeading({
  eyebrow,
  title,
  lead,
  as: Heading = 'h2',
  id,
  align = 'start',
  tone = 'light',
  className = '',
}: SectionHeadingProps) {
  const reduce = useReducedMotion()

  return (
    <RevealGroup className={`${styles.heading} ${className}`.trim()} stagger={0.1}>
      <div data-align={align} data-tone={tone} className={styles.inner}>
        {eyebrow ? (
          <RevealItem as="p" className={styles.eyebrow}>
            <motion.span
              className={styles.rule}
              aria-hidden="true"
              initial={reduce ? false : { scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: revealEase }}
            />
            {eyebrow}
          </RevealItem>
        ) : null}
        <RevealItem y={32}>
          <Heading id={id} className={styles.title}>
            {title}
          </Heading>
        </RevealItem>
        {lead ? (
          <RevealItem as="p" className={styles.lead}>
            {lead}
          </RevealItem>
        ) : null}
      </div>
    </RevealGroup>
  )
}
