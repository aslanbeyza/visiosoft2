import { Link } from 'react-router-dom'
import PageHero from '../../components/PageHero/index.ts'
import Seo from '../../components/Seo/index.ts'
import { marketingRouteNames, pathFor } from '../../lib/index.ts'
import { useLocale } from '../../hooks/useLocale/index.ts'
import styles from './Sitemap.module.css'

export default function Sitemap() {
  const { t } = useLocale()
  const names = ['home', 'blog.index', 'hgs-park', 'quote.index', 'discovery.show', 'software-products', ...marketingRouteNames]

  return (
    <>
      <Seo title={`${t('footer_sitemap')} - Visiosoft`} />
      <PageHero title={t('footer_sitemap')} />
      <section className={styles.section}>
        <ul>
          {names.map((name) => (
            <li key={name}>
              <Link to={pathFor(name)}>{t(name)}</Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
