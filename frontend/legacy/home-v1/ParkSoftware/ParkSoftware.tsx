import Button from '../Button/index.ts'
import { useLocale } from '../../hooks/useLocale/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import MobilePreview from './MobilePreview.tsx'
import styles from './ParkSoftware.module.css'
import RevenueCard from './RevenueCard.tsx'
import ServiceStrip from './ServiceStrip.tsx'

export default function ParkSoftware() {
  const { t } = useLocale()
  const path = usePath()

  return (
    <section className={styles.section}>
      <div className={styles.wrap}>
        <div className={styles.header}>
          <h2>{t('footer_park_software')}</h2>
          <p>{t('software_section_desc')}</p>
        </div>

        <div className={styles.revenueMobile}>
          <RevenueCard active />
        </div>

        <div className={styles.trackStatic}>
          <div className={styles.stage}>
            <div className={styles.revenueDesktop}>
              <RevenueCard active />
            </div>
            <MobilePreview />
          </div>
        </div>

        <ServiceStrip />

        <div className={styles.cta}>
          <Button to={path('software-products')}>{t('index_all_software_cta')}</Button>
        </div>
      </div>
    </section>
  )
}
