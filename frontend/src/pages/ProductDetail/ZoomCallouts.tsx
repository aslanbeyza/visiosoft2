import { useId, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import Picture from '../../components/Picture/index.ts'
import { RevealGroup, RevealItem, revealEase } from '../../components/Reveal/index.ts'
import Section from '../../components/Section/index.ts'
import SectionHeading from '../../components/SectionHeading/index.ts'
import type { DetailZoom } from './detailTypes.ts'
import styles from './ZoomCallouts.module.css'

type ZoomCalloutsProps = {
  zoom: Extract<DetailZoom, { kind: 'callouts' }>
}

const pad = (value: number) => String(value).padStart(2, '0')

export default function ZoomCallouts({ zoom }: ZoomCalloutsProps) {
  const titleId = useId()
  const reduce = Boolean(useReducedMotion())
  const figureRef = useRef<HTMLDivElement>(null)
  const inView = useInView(figureRef, { once: true, amount: 0.35 })
  const shown = reduce || inView
  const [active, setActive] = useState<string | null>(null)
  const { image } = zoom

  return (
    <Section tone="surface" spacing="lg" labelledBy={titleId}>
      <div className={styles.layout}>
        <div className={styles.copy}>
          <SectionHeading eyebrow={zoom.eyebrow} title={zoom.title} lead={zoom.lead} id={titleId} />
          <RevealGroup as="ol" className={styles.list} stagger={0.1}>
            {zoom.callouts.map((callout, index) => (
              <RevealItem as="li" key={callout.id} className={styles.entry}>
                <div
                  className={styles.entryInner}
                  data-active={active === callout.id}
                  onPointerEnter={() => setActive(callout.id)}
                  onPointerLeave={() => setActive(null)}
                >
                  <span className={styles.index} aria-hidden="true">
                    {pad(index + 1)}
                  </span>
                  <h3 className={styles.entryTitle}>{callout.title}</h3>
                  <p className={styles.entryText}>{callout.description}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>

        <div ref={figureRef} className={styles.figure}>
          <div className={styles.box} style={{ aspectRatio: `${image.width} / ${image.height}` }}>
            <motion.div
              className={styles.reveal}
              initial={reduce ? false : { clipPath: 'inset(0% 0% 100% 0%)', y: 24 }}
              animate={shown ? { clipPath: 'inset(0% 0% 0% 0%)', y: 0 } : { clipPath: 'inset(0% 0% 100% 0%)', y: 24 }}
              transition={{ duration: 1.1, ease: revealEase }}
            >
              <Picture src={image.src} avif={image.avif} alt={image.alt} width={image.width} height={image.height} className={styles.image} />
            </motion.div>
            {zoom.callouts.map((callout, index) => (
              <div
                key={callout.id}
                className={styles.pin}
                data-active={active === callout.id}
                style={{ left: `${callout.x}%`, top: `${callout.y}%`, '--x': callout.x } as CSSProperties}
                aria-hidden="true"
              >
                <motion.span
                  className={styles.leader}
                  initial={reduce ? false : { scaleX: 0 }}
                  animate={shown ? { scaleX: 1 } : { scaleX: 0 }}
                  transition={{ duration: 0.8, delay: 1 + index * 0.15, ease: revealEase }}
                />
                <motion.span
                  className={styles.marker}
                  initial={reduce ? false : { opacity: 0, scale: 0.4 }}
                  animate={shown ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.4 }}
                  transition={{ duration: 0.6, delay: 0.85 + index * 0.15, ease: revealEase }}
                >
                  {index + 1}
                </motion.span>
                <motion.span
                  className={styles.label}
                  initial={reduce ? false : { opacity: 0, x: -6 }}
                  animate={shown ? { opacity: 1, x: 0 } : { opacity: 0, x: -6 }}
                  transition={{ duration: 0.5, delay: 1.55 + index * 0.15, ease: revealEase }}
                >
                  {callout.title}
                </motion.span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  )
}
