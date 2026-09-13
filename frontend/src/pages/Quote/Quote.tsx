import LeadForm from '../../components/LeadForm/index.ts'
import PageHero from '../../components/PageHero/index.ts'
import Seo from '../../components/Seo/index.ts'
import { useLocale } from '../../hooks/useLocale/index.ts'
import styles from './Quote.module.css'

export default function Quote() {
  const { t } = useLocale()

  return (
    <>
      <Seo title={`${t('Teklif Al')} - Visiosoft`} />
      <PageHero title={t('Teklifinizi Oluşturun.')} description={t('İhtiyaçlarınızı seçin, Otopark keşif uzmanımız sizinle iletişime geçecektir.')} />
      <section className={styles.section}>
        <div className={styles.wrap}>
          <LeadForm kind="quote" />
        </div>
      </section>
    </>
  )
}
