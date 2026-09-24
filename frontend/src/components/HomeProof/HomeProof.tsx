import { Link } from 'react-router-dom'
import Section from '../Section/index.ts'
import TrustLogos from '../HomeTrust/TrustLogos.tsx'
import { usePath } from '../../hooks/usePath/index.ts'
import { homeProofCopy as text } from './homeProofCopy.ts'
import styles from './HomeProof.module.css'

export default function HomeProof() {
  const path = usePath()

  return (
    <Section id="referanslar-ozet" tone="paper" spacing="none" labelledBy={text.titleId} className={styles.section} width="full">
      <div className={styles.bar}>
        <h2 id={text.titleId} className={styles.eyebrow}>
          <span className={styles.rule} aria-hidden="true" />
          {text.eyebrow}
        </h2>
        <Link to={path('references')} className={styles.more}>
          {text.more}
          <svg viewBox="0 0 24 24" className={styles.arrow} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </Link>
      </div>
      <div className={styles.rail}>
        <TrustLogos variant="marquee" />
      </div>
    </Section>
  )
}
