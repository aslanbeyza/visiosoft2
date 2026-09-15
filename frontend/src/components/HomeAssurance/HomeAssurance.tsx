import { Link } from 'react-router-dom'
import Section from '../Section/index.ts'
import SectionHeading from '../SectionHeading/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import AssuranceColumns from './AssuranceColumns.tsx'
import { homeAssuranceCopy as text } from './homeAssuranceCopy.ts'
import { arrowPath } from './icons.ts'
import styles from './HomeAssurance.module.css'

/** Ana sayfa güvence: solda iddia, sağda destek / güvenlik / entegrasyon kartları. */
export default function HomeAssurance() {
  const path = usePath()

  return (
    <Section id="guvence" tone="paper" spacing="none" width="full" labelledBy="home-assurance-title">
      <div className={styles.top}>
        <div className={styles.layout}>
          <div className={styles.intro}>
            <SectionHeading eyebrow={text.eyebrow} title={text.title} lead={text.lead} id="home-assurance-title" className={styles.heading} />
            <Link to={path('developers')} className={styles.cta}>
              {text.cta}
              <svg viewBox="0 0 24 24" className={styles.ctaArrow} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d={arrowPath} />
              </svg>
            </Link>
          </div>
          <AssuranceColumns />
        </div>
      </div>
    </Section>
  )
}
