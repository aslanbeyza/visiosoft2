import PageHero from '../../components/PageHero/index.ts'
import Seo from '../../components/Seo/index.ts'
import { useLocale } from '../../hooks/useLocale/index.ts'
import styles from './Payment.module.css'

export default function Payment() {
  const { t, config } = useLocale()

  return (
    <>
      <Seo title="Payment - Visiosoft" />
      <PageHero title="PayTR" description={t('footer_more_info')} />
      <section className={styles.section}>
        {config?.payment_iframe ? <iframe title="PayTR" src={config.payment_iframe} className={styles.frame} /> : null}
      </section>
    </>
  )
}
