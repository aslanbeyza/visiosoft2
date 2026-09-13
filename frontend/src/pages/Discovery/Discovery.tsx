import LeadForm from '../../components/LeadForm/index.ts'
import PageHero from '../../components/PageHero/index.ts'
import Seo from '../../components/Seo/index.ts'
import { useLocale } from '../../hooks/useLocale/index.ts'
import styles from './Discovery.module.css'

export default function Discovery() {
  const { t } = useLocale()

  return (
    <>
      <Seo title={`${t('footer_free_consultation')} - Visiosoft`} description={t('free_consultation_meta_desc')} />
      <PageHero title={t('footer_free_consultation')} description={t('free_consultation_subtitle')} />
      <section className={styles.section}>
        <div className={styles.wrap}>
          <LeadForm kind="discovery" extraFields="address" />
        </div>
      </section>
    </>
  )
}
