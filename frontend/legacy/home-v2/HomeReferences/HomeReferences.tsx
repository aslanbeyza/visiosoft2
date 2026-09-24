import { useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { useInView, useReducedMotion } from 'framer-motion'
import Reveal from '../Reveal/index.ts'
import Section from '../Section/index.ts'
import SectionHeading from '../SectionHeading/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import { references } from '../../pages/References/references.ts'
import { logoSizes, homeReferencesCopy as text } from './homeReferencesCopy.ts'
import styles from './HomeReferences.module.css'

type Reference = (typeof references)[number]

function Logo({ logo, decorative = false }: { logo: Reference; decorative?: boolean }) {
  const [width, height] = logoSizes[logo.file] ?? [160, 80]
  return (
    <img
      src={logo.url}
      alt={decorative ? '' : logo.name}
      width={width}
      height={height}
      className={styles.logo}
      loading="lazy"
      decoding="async"
      draggable={false}
    />
  )
}

const SECONDS_PER_LOGO = 3.4

export default function HomeReferences() {
  const path = usePath()
  const reduce = useReducedMotion()
  const marqueeRef = useRef<HTMLDivElement>(null)
  const inView = useInView(marqueeRef, { amount: 0.1 })
  const [paused, setPaused] = useState(false)

  const half = Math.ceil(references.length / 2)
  const rows = [references.slice(0, half), references.slice(half)]

  return (
    <Section tone="surface" spacing="md" width="full" labelledBy="home-references-title">
      <div className={styles.container}>
        <div className={styles.head}>
          <SectionHeading eyebrow={text.eyebrow} title={text.title} id="home-references-title" />
          <Reveal className={styles.headAction} delay={0.2} amount={0.5}>
            <Link to={path('references')} className={styles.allLink}>
              {text.all}
              <svg viewBox="0 0 24 24" className={styles.arrow} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          </Reveal>
        </div>
      </div>

      {reduce ? (
        <div className={styles.container}>
          <ul className={styles.grid} aria-label={text.listLabel}>
            {references.map((logo) => (
              <li key={logo.file} className={styles.tile}>
                <Logo logo={logo} />
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <Reveal className={styles.marqueeBlock} amount={0.15}>
          <div ref={marqueeRef} className={styles.marqueeRoot} data-running={inView && !paused ? 'true' : 'false'}>
            <div className={styles.marquee}>
              {rows.map((row, rowIndex) => (
                <div
                  key={rowIndex === 0 ? 'first' : 'second'}
                  className={styles.row}
                  data-direction={rowIndex === 0 ? 'left' : 'right'}
                  style={{ '--duration': `${row.length * SECONDS_PER_LOGO}s` } as CSSProperties}
                >
                  <div className={styles.track}>
                    <ul className={styles.list} aria-label={rowIndex === 0 ? text.listLabel : undefined}>
                      {row.map((logo) => (
                        <li key={logo.file} className={styles.tile}>
                          <Logo logo={logo} />
                        </li>
                      ))}
                    </ul>
                    {}
                    <ul className={styles.list} aria-hidden="true">
                      {row.map((logo) => (
                        <li key={logo.file} className={styles.tile}>
                          <Logo logo={logo} decorative />
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.container}>
              <div className={styles.controls}>
                <button
                  type="button"
                  className={styles.toggle}
                  aria-label={paused ? text.play : text.pause}
                  onClick={() => setPaused((value) => !value)}
                >
                  <svg viewBox="0 0 16 16" className={styles.toggleIcon} fill="currentColor" aria-hidden="true">
                    {paused ? <path d="M5 3.2v9.6L12.6 8z" /> : <path d="M4.5 3h2.2v10H4.5zM9.3 3h2.2v10H9.3z" />}
                  </svg>
                  <span aria-hidden="true">{paused ? text.playShort : text.pauseShort}</span>
                </button>
              </div>
            </div>
          </div>
        </Reveal>
      )}
    </Section>
  )
}
