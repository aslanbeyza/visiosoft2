import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import IframeEmbed from '../../components/IframeEmbed/index.ts'
import Reveal, { revealEase } from '../../components/Reveal/index.ts'
import Section from '../../components/Section/index.ts'
import SectionHeading from '../../components/SectionHeading/index.ts'
import { contactCopy } from './contactCopy.ts'
import styles from './MeetingSection.module.css'

const copy = contactCopy.meeting

type MeetingSectionProps = {
  id: string
  calendlyUrl: string
}

export default function MeetingSection({ id, calendlyUrl }: MeetingSectionProps) {
  const reduce = Boolean(useReducedMotion())
  const listRef = useRef<HTMLUListElement>(null)
  const inView = useInView(listRef, { once: true, amount: 0.2 })
  const run = reduce || inView
  const headingId = `${id}-baslik`

  return (
    <Section id={id} tone="paper" spacing="lg" labelledBy={headingId}>
      <div className={styles.shell}>
        <div className={styles.copy}>
          <SectionHeading id={headingId} eyebrow={copy.eyebrow} title={copy.title} lead={copy.lead} />

          <ul ref={listRef} className={styles.points} aria-label={copy.pointsLabel}>
            {copy.points.map((point, index) => (
              <motion.li
                key={point.title}
                className={styles.point}
                initial={reduce ? false : { opacity: 0, x: -12 }}
                animate={run ? { opacity: 1, x: 0 } : undefined}
                transition={{ duration: 0.55, delay: 0.08 + index * 0.08, ease: revealEase }}
              >
                <span className={styles.pointIndex} aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className={styles.pointBody}>
                  <span className={styles.pointTitle}>{point.title}</span>
                  <span className={styles.pointText}>{point.text}</span>
                </span>
              </motion.li>
            ))}
          </ul>

          <Reveal as="p" className={styles.note} delay={0.28} y={14}>
            {copy.note}
          </Reveal>
        </div>

        <Reveal className={styles.panelWrap} delay={0.12} y={28}>
          <div className={styles.panel}>
            <div className={styles.panelHead}>
              <div className={styles.panelIdentity}>
                <span className={styles.panelIcon} aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="5" width="18" height="16" rx="2" />
                    <path d="M8 3v4M16 3v4M3 10h18" />
                  </svg>
                </span>
                <div className={styles.panelTitles}>
                  <p className={styles.panelEyebrow}>{copy.panel.eyebrow}</p>
                  <p className={styles.panelTitle}>{copy.panel.title}</p>
                </div>
              </div>
              <ul className={styles.meta} aria-label={copy.panel.metaLabel}>
                {copy.panel.meta.map((item) => (
                  <li key={item} className={styles.metaItem}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.embed}>
              <IframeEmbed
                src={calendlyUrl}
                title={copy.embedTitle}
                description={copy.embedDescription}
                height="42rem"
                loadOn="click"
                loadLabel={copy.load}
                fallbackHref={calendlyUrl}
                fallbackLabel={copy.open}
              />
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
