import { Link } from 'react-router-dom'
import Button from '../../components/Button/index.ts'
import Seo from '../../components/Seo/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import { catalogItems, catalogSection, heroContent, hubSeo } from './copy.ts'
import styles from './HardwareProducts.module.css'

export default function HardwareProducts() {
  const path = usePath()
  const hero = heroContent
  const section = catalogSection
  const seo = hubSeo

  return (
    <>
      <Seo title={seo.title} description={seo.description} />

      <div className={styles.page}>
        <section className={styles.heroWrap}>
          <div className={styles.heroCard}>
            <div className={styles.heroGrid}>
              <div className={styles.heroCopy}>
                <div className={styles.eyebrow}>
                  <span className={styles.eyebrowLine} />
                  {hero.eyebrow}
                </div>
                <h1>{hero.title}</h1>
                <p>{hero.description}</p>
              </div>

              <div className={styles.points}>
                {hero.points.map((point, index) => (
                  <article key={point.title} className={styles.point}>
                    <div className={styles.pointNum}>{String(index + 1).padStart(2, '0')}</div>
                    <div>
                      <h2>{point.title}</h2>
                      <p>{point.description}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <nav className={styles.nav} aria-label={section.title}>
          <div className={styles.navScroll}>
            {catalogItems.map((item) => (
              <Link key={item.route} to={path(item.route)}>
                <span aria-hidden="true">{item.icon}</span>
                {item.navLabel}
              </Link>
            ))}
          </div>
        </nav>

        <section className={styles.catalog}>
          <div className={styles.catalogHead}>
            <div className={styles.eyebrow}>
              <span className={styles.eyebrowLine} />
              {section.eyebrow}
            </div>
            <h2>{section.title}</h2>
            <p>{section.description}</p>
          </div>

          <div className={styles.grid}>
            {catalogItems.map((item, index) => (
              <Link key={item.route} to={path(item.route)} className={styles.card}>
                <div className={styles.cardTop}>
                  <span className={styles.tag}>{item.tag}</span>
                  <span className={styles.cardNum}>{String(index + 1).padStart(2, '0')}</span>
                </div>
                <div className={styles.cardImage}>
                  <img src={item.image} alt="" loading="lazy" decoding="async" />
                </div>
                <div className={styles.cardBody}>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <div className={styles.actions}>
          <Button to={path('hardware-products.catalog')}>🖨 {section.cta}</Button>
        </div>
      </div>
    </>
  )
}
