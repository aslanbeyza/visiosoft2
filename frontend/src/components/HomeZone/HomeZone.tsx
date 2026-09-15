import Section from '../Section/index.ts'
import SectionHeading from '../SectionHeading/index.ts'
import ZoneStage from '../HomeSoftware/index.ts'
import { homeSoftwareCopy as software } from '../HomeSoftware/homeSoftwareCopy.ts'
import styles from './HomeZone.module.css'

/** Ana sayfa Zone: tıklanabilir panel demosu (telefon + laptop). */
export default function HomeZone() {
  return (
    <Section id="zone" tone="night" spacing="lg" className={styles.section} innerClassName={styles.inner} labelledBy="zone-title">
      <div className={styles.head}>
        <SectionHeading
          eyebrow={software.eyebrow}
          title={software.title}
          lead={software.lead}
          id="zone-title"
          tone="dark"
          className={styles.heading}
        />
      </div>
      <ZoneStage />
    </Section>
  )
}
