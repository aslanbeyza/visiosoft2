import LeadForm from '../../components/LeadForm/index.ts'
import PageHero from '../../components/PageHero/index.ts'
import Seo from '../../components/Seo/index.ts'
import { useLocale } from '../../hooks/useLocale/index.ts'
import styles from './ParkingQuote.module.css'

export default function ParkingQuote() {
  const { t } = useLocale()

  return (
    <>
      <Seo title={`${t('Otopark teklif motoru')} - Visiosoft`} />
      <PageHero title={t('Otopark teklif motoru')} description={t('İhtiyaçlarınızı seçin, Otopark keşif uzmanımız sizinle iletişime geçecektir.')} />
      <section className={styles.section}>
        <div className={styles.wrap}>
          <LeadForm kind="parking-quote-engine" extraFields="parking" />
        </div>
      </section>
    </>
  )
}
