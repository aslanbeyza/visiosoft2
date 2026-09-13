import Seo from '../../components/Seo/index.ts'
import { useLocale } from '../../hooks/useLocale/index.ts'
import { references } from './references.ts'
import styles from './References.module.css'

export default function References() {
  const { t } = useLocale()

  return (
    <>
      <Seo title={`${t('footer_references')} - Visiosoft`} description={t('references_hero_description')} />
      <section className={styles.page}>
        <div className={styles.hero}>
          <h1>{t('references_hero_title')}</h1>
          <p>{t('references_hero_description')}</p>
        </div>
        <div className={styles.grid}>
          {references.map((logo) => {
            const inner = (
              <>
                <div className={styles.logoWrap}>
                  <img src={logo.url} alt={logo.name} />
                </div>
                <p>{logo.name}</p>
              </>
            )

            if (logo.website) {
              return (
                <a key={logo.file} href={logo.website} target="_blank" rel="noopener noreferrer" className={styles.card}>
                  {inner}
                </a>
              )
            }

            return (
              <div key={logo.file} className={styles.card}>
                {inner}
              </div>
            )
          })}
        </div>
      </section>
    </>
  )
}
