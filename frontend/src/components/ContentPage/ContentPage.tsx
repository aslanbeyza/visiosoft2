import { useLocale } from '../../hooks/useLocale/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import Button from '../Button/index.ts'
import PageHero from '../PageHero/index.ts'
import Seo from '../Seo/index.ts'
import styles from './ContentPage.module.css'

type ContentPageProps = {
  routeName: string
  titleKey: string
  descriptionKey?: string
  points?: string[]
  image?: string
}

export default function ContentPage({ routeName, titleKey, descriptionKey, points = [], image }: ContentPageProps) {
  const { t } = useLocale()
  const path = usePath()
  const title = t(titleKey)
  const description = descriptionKey ? t(descriptionKey) : t('software_section_desc')

  return (
    <>
      <Seo title={`${title} - Visiosoft`} description={description} />
      <PageHero
        eyebrow={routeName}
        title={title}
        description={description}
        actions={
          <>
            <Button to={path('quote.index')}>{t('Teklif Al')}</Button>
            <Button to={path('contact')} variant="ghost">
              {t('nav_contact')}
            </Button>
          </>
        }
      />
      <section className={styles.section}>
        {image ? <img src={image} alt={title} className={styles.heroImage} /> : null}
        <div className={styles.grid}>
          {(points.length ? points : ['support_description', 'hardware_subtitle', 'hero_subtitle']).map((key) => (
            <article key={key} className={styles.card}>
              <p>{t(key)}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}
