import { Link } from 'react-router-dom'
import Button from '../../components/Button/index.ts'
import Seo from '../../components/Seo/index.ts'
import { useLocale } from '../../hooks/useLocale/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import { alprLandingCopy } from './alprLandingCopy.ts'
import styles from './AlprLanding.module.css'

function Glyph({ name }: { name: string }) {
  const path =
    name === 'id'
      ? 'M4 6h16v12H4zM8 10h5M8 14h8'
      : name === 'chip'
        ? 'M8 8h8v8H8zM4 10h4M4 14h4M16 10h4M16 14h4'
        : name === 'headset'
          ? 'M5 12a7 7 0 0 1 14 0v5a2 2 0 0 1-2 2h-2v-6h4M5 17h2v-6H5'
          : name === 'search'
            ? 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3'
            : name === 'file'
              ? 'M7 3h8l5 5v13H7zM15 3v5h5'
              : 'M8 8h2v2H8zM14 8h2v2h-2zM10 14h4v2h-4z'
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d={path} />
    </svg>
  )
}

export default function AlprLanding() {
  const { config } = useLocale()
  const path = usePath()
  const copy = alprLandingCopy()
  const wa = config?.whatsapp_wa_id || '905015045034'
  const waUrl = `https://wa.me/${wa}?text=${encodeURIComponent(copy.whatsappMessage)}`

  return (
    <>
      <Seo title={copy.metaTitle} description={copy.metaDescription} />

      <div className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.container}>
            <p className={styles.eyebrow}>{copy.eyebrow}</p>
            <h1>{copy.headline}</h1>
            <p>{copy.subtitle}</p>
            <div className={styles.needs}>
              {copy.needs.map((need) => (
                <article key={need.title} className={styles.need}>
                  <span className={styles.icon}>
                    <Glyph name={need.icon} />
                  </span>
                  <h3>{need.title}</h3>
                  <img
                    src={need.image}
                    alt={need.imageAlt}
                    className={`${styles.needImg} ${need.portrait ? styles.portrait : ''}`}
                    loading="lazy"
                  />
                  <Link to={path(need.linkRoute)} className={styles.needLink}>
                    {need.linkLabel}
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>{copy.section2Title}</h2>
            <p className={styles.intro}>{copy.section2Intro}</p>
            <div className={styles.metrics}>
              {copy.section2Metrics.map((metric) => (
                <span key={metric} className={styles.metric}>
                  {metric}
                </span>
              ))}
            </div>
            <div className={styles.grid}>
              {copy.salesFlow.map((flow) => (
                <article key={flow.title} className={styles.card}>
                  <span className={styles.icon}>
                    <Glyph name={flow.icon} />
                  </span>
                  <h3>{flow.title}</h3>
                  <p>{flow.desc}</p>
                  <Link to={path(flow.ctaRoute)} className={styles.cardLink}>
                    {flow.ctaLabel}
                  </Link>
                </article>
              ))}
            </div>

            <div className={styles.proof}>
              <h3 className={styles.proofTitle}>{copy.proofTitle}</h3>
              <p className={styles.proofDesc}>{copy.proofDesc}</p>
              <div className={styles.logos}>
                {copy.proofLogos.map((logo) => (
                  <div key={logo.src} className={styles.logo}>
                    <img src={logo.src} alt={logo.alt} loading="lazy" />
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.demo}>
              <div className={styles.demoCard}>
                <h3 className={styles.demoTitle}>{copy.demoTitle}</h3>
                <p className={styles.demoDesc}>{copy.demoDesc}</p>
              </div>
              <div className={styles.media}>
                <img src={copy.demoImage} alt={copy.demoImageAlt} loading="lazy" />
              </div>
            </div>

            <div className={styles.compliance}>
              <h3 className={styles.proofTitle}>{copy.complianceTitle}</h3>
              <div className={styles.complianceItems}>
                {copy.complianceItems.map((item) => (
                  <span key={item} className={styles.complianceItem}>
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className={styles.faq}>
              <h3 className={styles.proofTitle}>{copy.faqTitle}</h3>
              {copy.faqItems.map((item) => (
                <details key={item.q}>
                  <summary>{item.q}</summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </div>

            <div className={styles.sectionActions}>
              <Button to={path('quote.index')}>{copy.quote}</Button>
              <Link to={path('services')} className={styles.link}>
                {copy.servicesLabel}
              </Link>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.final}>
              <h3>{copy.section3Title}</h3>
              <p>{copy.section3Desc}</p>
              <p>
                  <a href="mailto:info@visiosoft.com.tr">E-posta</a> veya{' '}
                  <a href={waUrl} target="_blank" rel="noreferrer">
                    WhatsApp
                  </a>{' '}
                  üzerinden bize ulaşın. Her zaman yanınızdayız.
                </p>
              <div className={styles.actions}>
                <Button to={path('contact')}>{copy.contact}</Button>
                <Button href="mailto:info@visiosoft.com.tr">{copy.email}</Button>
                <Button href={waUrl}>{copy.whatsapp}</Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
