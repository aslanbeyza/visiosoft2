import Section from '../Section/index.ts'
import SectionHeading from '../SectionHeading/index.ts'
import AssuranceColumns from './AssuranceColumns.tsx'
import WorkingSteps from './WorkingSteps.tsx'
import { homeAssuranceCopy as text } from './homeAssuranceCopy.ts'
import styles from './HomeAssurance.module.css'

/** Ana sayfa 4.7: destek, güvenlik ve entegrasyon sütunları + "Çalışma şeklimiz" şeridi (beyaz → açık gri). */
export default function HomeAssurance() {
  return (
    <Section id="guvence" tone="paper" spacing="none" width="full" labelledBy="home-assurance-title">
      <div className={styles.top}>
        <SectionHeading eyebrow={text.eyebrow} title={text.title} id="home-assurance-title" className={styles.heading} />
        <AssuranceColumns />
      </div>
      <WorkingSteps />
    </Section>
  )
}
