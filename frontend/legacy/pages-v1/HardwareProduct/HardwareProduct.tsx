import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../../components/Button/index.ts'
import ProductViewer from '../../components/ProductViewer/index.ts'
import Seo from '../../components/Seo/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import styles from './HardwareProduct.module.css'
import { getHardwareProduct, productNav } from './products.ts'

export type HardwareProductProps = {
  slug: string
}

export default function HardwareProduct({ slug }: HardwareProductProps) {
  const path = usePath()
  const product = getHardwareProduct(slug)
  const copy = product.copy
  const [technicalOpen, setTechnicalOpen] = useState(false)
  const [fullscreenOpen, setFullscreenOpen] = useState(false)

  useEffect(() => {
    setTechnicalOpen(false)
    setFullscreenOpen(false)
  }, [slug])

  useEffect(() => {
    const open = technicalOpen || fullscreenOpen
    document.body.style.overflow = open ? 'hidden' : ''

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setTechnicalOpen(false)
        setFullscreenOpen(false)
      }
    }

    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [technicalOpen, fullscreenOpen])

  return (
    <>
      <Seo title={copy.page_title} description={copy.meta_desc} />

      <div className={styles.page}>
        <nav className={styles.nav} aria-label={copy.name}>
          <div className={styles.navScroll}>
            {productNav.map((item) => (
              <Link
                key={item.slug}
                to={path(item.route)}
                className={item.slug === product.slug ? styles.navActive : undefined}
              >
                {item.navLabel}
              </Link>
            ))}
          </div>
        </nav>

        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <span className={styles.eyebrow}>{copy.eyebrow}</span>
            <h1>{copy.name}</h1>
            <p className={styles.lead}>{copy.lead}</p>
            <div className={styles.meta}>
              {copy.meta.map((item) => (
                <div key={item.label} className={styles.metaItem}>
                  <span className={styles.metaLabel}>{item.label}</span>
                  <span className={styles.metaValue}>{item.value}</span>
                </div>
              ))}
            </div>
            <div className={styles.ctaRow}>
              <Button to={path('discovery.show')}>{copy.request_discovery}</Button>
              {product.technicalImage ? (
                <button type="button" className={styles.textLink} onClick={() => setTechnicalOpen(true)}>
                  {copy.show_technical_image}
                </button>
              ) : null}
              <Link className={styles.textLink} to={path('hardware-products.catalog')}>
                {copy.open_catalog}
              </Link>
            </div>
          </div>

          <div className={styles.viewerCard}>
            <div className={styles.viewerHeader}>
              <div>
                <p className={styles.viewerKicker}>{copy.viewer_kicker}</p>
                <p className={styles.viewerTitle}>{copy.viewer_title}</p>
              </div>
              <button
                type="button"
                className={styles.viewerAction}
                onClick={() => setFullscreenOpen(true)}
                aria-label={copy.viewer_fullscreen}
              >
                {copy.viewer_fullscreen}
              </button>
            </div>
            <ProductViewer
              src={product.model}
              poster={product.technicalImage}
              className={styles.viewer}
            />
            <div className={styles.viewerHint}>{copy.viewer_hint}</div>
          </div>
        </section>

        <section className={styles.features}>
          <div className={styles.sectionHead}>
            <h2>{copy.highlights_title}</h2>
            <p>{copy.highlights_desc}</p>
          </div>
          {copy.dimensions ? (
            <span className={styles.dimensions}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <rect x="2" y="6" width="20" height="12" rx="2" />
                <line x1="6" y1="6" x2="6" y2="10" />
                <line x1="10" y1="6" x2="10" y2="12" />
                <line x1="14" y1="6" x2="14" y2="10" />
                <line x1="18" y1="6" x2="18" y2="12" />
              </svg>
              {copy.dimensions}
            </span>
          ) : null}
          <div className={styles.featureGrid}>
            {copy.features.map((feature) => (
              <article key={feature.title} className={styles.featureCard}>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.details}>
          <div className={styles.detailsCard}>
            <h3>{copy.tech_summary_title}</h3>
            <ul>
              {copy.summary.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className={styles.detailsCard}>
            <h3>{copy.use_cases_title}</h3>
            <ul>
              {copy.use_cases.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className={styles.cta}>
          <div>
            <h2>{copy.cta_title}</h2>
            <p>{copy.cta_desc}</p>
          </div>
          <Button to={path('quote.index')}>{copy.get_quote}</Button>
        </section>
      </div>

      {fullscreenOpen ? (
        <div className={styles.viewerModal}>
          <button type="button" className={styles.backdrop} onClick={() => setFullscreenOpen(false)} aria-label={copy.close} />
          <div className={styles.viewerPanel} role="dialog" aria-modal="true" aria-label={copy.viewer_fullscreen}>
            <button type="button" className={styles.viewerClose} onClick={() => setFullscreenOpen(false)}>
              {copy.close}
            </button>
            <ProductViewer src={product.model} poster={product.technicalImage} className={styles.viewerFull} />
          </div>
        </div>
      ) : null}

      {technicalOpen && product.technicalImage ? (
        <div className={styles.imageModal}>
          <button type="button" className={styles.backdrop} onClick={() => setTechnicalOpen(false)} aria-label={copy.close} />
          <div className={styles.imagePanel} role="dialog" aria-modal="true">
            <button type="button" className={styles.imageClose} onClick={() => setTechnicalOpen(false)} aria-label={copy.close}>
              ✕
            </button>
            <img src={product.technicalImage} alt={copy.show_technical_image} />
          </div>
        </div>
      ) : null}
    </>
  )
}
