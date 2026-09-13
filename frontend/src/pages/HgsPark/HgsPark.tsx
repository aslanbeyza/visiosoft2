import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Button from '../../components/Button/index.ts'
import Seo from '../../components/Seo/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import { hgsParkCopy } from './hgsParkCopy.ts'
import styles from './HgsPark.module.css'

function Mark({ name }: { name: 'rocket' | 'card' | 'check' }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      {name === 'rocket' ? <path d="M14 4c3 1 6 4 6 7-4 1-8 5-9 9-3-3-4-6-4-8 2-3 5-6 7-8zM9 15l-4 4M15 9l2 2" /> : null}
      {name === 'card' ? <path d="M3 7h18v10H3zM3 11h18" /> : null}
      {name === 'check' ? <path d="M5 12l5 5L20 7" /> : null}
    </svg>
  )
}

export default function HgsPark() {
  const path = usePath()
  const copy = hgsParkCopy()

  useEffect(() => {
    const existing = document.getElementById('hgs-park-schema') as HTMLScriptElement | null
    const script = existing || document.createElement('script')
    script.id = 'hgs-park-schema'
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'HGS Park',
      provider: {
        '@type': 'Organization',
        name: 'Visiosoft Technology Inc.',
        url: window.location.origin,
      },
      areaServed: 'TR',
      serviceType: 'Parking payment and collection system',
      description: copy.metaDescription,
    })
    if (!existing) document.head.appendChild(script)
    return () => {
      script.remove()
    }
  }, [copy.metaDescription])

  return (
    <>
      <Seo title={copy.metaTitle} description={copy.metaDescription} />

      <section className={styles.hero}>
        <div className={styles.wrap}>
          <div className={styles.eyebrow}>{copy.heroEyebrow}</div>
          <img src="/img/hgspark.png" alt={copy.heroTitle} className={styles.logo} />
          <h1>{copy.heroSubtitle}</h1>
          <p>{copy.heroDescription}</p>
          <div className={styles.actions}>
            <Button href="#hgs-park-detay">{copy.heroPrimaryCta}</Button>
            <Link to={path('contact')} className={styles.ghost}>
              {copy.heroSecondaryCta}
            </Link>
          </div>
        </div>
      </section>

      <section id="hgs-park-detay" className={styles.future}>
        <div className={`${styles.wrap} ${styles.split}`}>
          <div>
            <div className={styles.label}>{copy.futureEyebrow}</div>
            <h2>{copy.futureTitle}</h2>
            <p className={styles.lead}>{copy.futureDescription}</p>
          </div>
          <div className={styles.features}>
            {copy.futureFeatures.map((feature) => (
              <article key={feature.title} className={styles.feature}>
                <div className={styles.icon}>
                  <Mark name={feature.icon} />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.solutions}>
        <div className={styles.wrap}>
          <div className={styles.center}>
            <div className={styles.label}>{copy.solutionsEyebrow}</div>
            <h2>{copy.solutionsTitle}</h2>
            <p className={styles.lead}>{copy.solutionsDescription}</p>
          </div>
          <div className={styles.panels}>
            <div className={styles.panel}>
              <h3>{copy.activityTitle}</h3>
              <div className={styles.activity}>
                {copy.activityItems.map((item) => (
                  <article key={item.title} className={styles.item}>
                    <h4>{item.title}</h4>
                    <p>{item.description}</p>
                  </article>
                ))}
              </div>
            </div>
            <div className={styles.panel}>
              <h3>{copy.businessTitle}</h3>
              <div className={styles.business}>
                {copy.businessItems.map((item) => (
                  <div key={item} className={styles.biz}>
                    <span className={styles.check}>
                      <Mark name="check" />
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.advantages}>
        <div className={styles.wrap}>
          <div className={styles.center}>
            <h2>{copy.advantagesTitle}</h2>
            <p className={styles.lead}>{copy.advantagesDescription}</p>
          </div>
          <div className={styles.advGrid}>
            {copy.advantages.map((item) => (
              <article key={item.title} className={styles.adv}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.finalSec}>
        <div className={styles.narrow}>
          <div className={styles.box}>
            <h2>{copy.finalTitle}</h2>
            <p>{copy.finalDescription}</p>
            <div className={styles.actions}>
              <Button to={path('quote.index')}>{copy.finalPrimaryCta}</Button>
              <Link to={path('contact')} className={styles.ghost}>
                {copy.finalSecondaryCta}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
