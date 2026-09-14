import Section from '../Section/index.ts'
import SectionHeading from '../SectionHeading/index.ts'
import DriverStrip from './DriverStrip.tsx'
import { homeZoneCopy as copy } from './homeZoneCopy.ts'
import ZoneTour from './ZoneTour.tsx'
import styles from './HomeZone.module.css'

/**
 * Ana sayfa 4.4: Zone yazılımı. Bölümün merkezinde gerçek Zone ekranlarıyla modül turu,
 * altında sürücünün gördüğü kiosk, mobil uygulama ve ödeme kanalları.
 */
export default function HomeZone() {
  return (
    <Section id="zone" tone="night" spacing="lg" className={styles.section} innerClassName={styles.inner} labelledBy="zone-title">
      <div className={styles.head}>
        <SectionHeading eyebrow={copy.eyebrow} title={copy.title} lead={copy.lead} id="zone-title" tone="dark" className={styles.heading} />
      </div>
      <ZoneTour />
      <DriverStrip />
    </Section>
  )
}
