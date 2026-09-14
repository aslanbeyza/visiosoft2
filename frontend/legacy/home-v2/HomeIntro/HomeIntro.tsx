import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import type { MotionValue } from 'framer-motion'
import { RevealGroup, RevealItem, revealEase } from '../Reveal/index.ts'
import Section from '../Section/index.ts'
import SectionHeading from '../SectionHeading/index.ts'
import PillarIcon from './PillarIcon.tsx'
import { homeIntroCopy as text } from './homeIntroCopy.ts'
import styles from './HomeIntro.module.css'

const pad = (value: number) => String(value).padStart(2, '0')

type WordProps = {
  children: string
  progress: MotionValue<number>
  range: [number, number]
  last: boolean
}

function Word({ children, progress, range, last }: WordProps) {
  const opacity = useTransform(progress, range, [0.18, 1])
  return (
    <>
      <motion.span style={{ opacity }}>{children}</motion.span>
      {last ? null : ' '}
    </>
  )
}

/** Kaydırdıkça kelime kelime koyulaşan açılış cümlesi; ekran okuyucu tüm cümleyi tek parça okur. */
function Statement({ children }: { children: string }) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.88', 'end 0.5'] })
  const words = children.split(' ')

  if (reduce) {
    return (
      <p ref={ref} className={styles.statement}>
        {children}
      </p>
    )
  }

  return (
    <p ref={ref} className={styles.statement}>
      <span className={styles.srOnly}>{children}</span>
      <span aria-hidden="true">
        {words.map((word, index) => (
          <Word
            key={`${index}-${word}`}
            progress={scrollYProgress}
            range={[index / words.length, (index + 1) / words.length]}
            last={index === words.length - 1}
          >
            {word}
          </Word>
        ))}
      </span>
    </p>
  )
}

export default function HomeIntro() {
  return (
    <Section tone="paper" spacing="lg" labelledBy="home-intro-title">
      <div className={styles.top}>
        <SectionHeading eyebrow={text.eyebrow} title={text.title} id="home-intro-title" />
        <div className={styles.statementColumn}>
          <Statement>{text.statement}</Statement>
        </div>
      </div>

      <RevealGroup as="ul" className={styles.pillars} stagger={0.12} amount={0.25}>
        {text.pillars.map((pillar, index) => (
          <RevealItem as="li" key={pillar.id} className={styles.pillar} y={28}>
            <motion.span
              className={styles.pillarRule}
              aria-hidden="true"
              variants={{
                hidden: { scaleX: 0 },
                show: { scaleX: 1, transition: { duration: 1.1, delay: 0.2, ease: revealEase } },
              }}
            />
            <div className={styles.pillarHead}>
              <span className={styles.pillarIcon}>
                <PillarIcon id={pillar.id} className={styles.pillarSvg} />
              </span>
              <span className={styles.pillarIndex} aria-hidden="true">
                {pad(index + 1)}
              </span>
            </div>
            <h3 className={styles.pillarTitle}>{pillar.title}</h3>
            <p className={styles.pillarText}>{pillar.description}</p>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  )
}
