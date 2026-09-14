import { Link } from 'react-router-dom'
import Button from '../../components/Button/index.ts'
import Seo from '../../components/Seo/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import { hgsCopy } from './hgsCopy.ts'
import styles from './Hgs.module.css'

function Mark({ name }: { name: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      {name === 'check' ? <path d="M5 12l5 5L20 7" /> : null}
      {name === 'barrier' ? <path d="M4 20V8M20 20V8M4 12h16M8 8l8 8" /> : null}
      {name === 'layers' ? <path d="M12 3 3 8l9 5 9-5-9-5zM3 12l9 5 9-5M3 16l9 5 9-5" /> : null}
      {name === 'chart' ? <path d="M4 19V5M4 19h16M8 15v4M12 10v9M16 7v12" /> : null}
      {name === 'wifi' ? <path d="M5 12a9 9 0 0 1 14 0M8 15a5 5 0 0 1 8 0M12 19h.01" /> : null}
      {name === 'card' ? <path d="M3 7h18v10H3zM3 11h18" /> : null}
      {name === 'qr' ? <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM18 18h2v2h-2z" /> : null}
      {name === 'building' ? <path d="M4 21V7l8-4 8 4v14M9 21v-6h6v6" /> : null}
      {name === 'gauge' ? <path d="M12 21a9 9 0 1 0-9-9M12 12l5-3" /> : null}
      {name === 'user' ? <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" /> : null}
      {name === 'shield' ? <path d="M12 3 4 7v6c0 5 3.5 7.5 8 9 4.5-1.5 8-4 8-9V7l-8-4z" /> : null}
      {name === 'pie' ? <path d="M12 3v9h9A9 9 0 1 1 12 3zM12 3a9 9 0 0 1 9 9" /> : null}
      {name === 'mall' ? <path d="M4 10h16v11H4zM2 10l10-7 10 7" /> : null}
      {name === 'home' ? <path d="M4 11l8-7 8 7v10H4z" /> : null}
      {name === 'hospital' ? <path d="M4 21V8h16v13M12 8v13M8 12h8M8 16h8" /> : null}
      {name === 'city' ? <path d="M4 21V10h6v11M10 21V4h10v17M13 8h4M13 12h4" /> : null}
      {name === 'brief' ? <path d="M4 8h16v12H4zM9 8V5h6v3" /> : null}
      {name === 'truck' ? <path d="M3 16V8h11v8H3zM14 11h5l2 3v2h-7M6 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM18 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" /> : null}
    </svg>
  )
}

export default function Hgs() {
  const path = usePath()
  const copy = hgsCopy()

  return (
    <>
      <Seo title={copy.metaTitle} description={copy.metaDescription} />

      <section className={styles.hero}>
        <div className={styles.wash} />
        <div className={styles.gridBg} />
        <div className={styles.wrap}>
          <div className={styles.heroGrid}>
            <div>
              <div className={styles.eyebrow}>
                <span className={styles.dot} />
                {copy.eyebrow}
              </div>
              <h1>{copy.title}</h1>
              <p className={styles.heroLead}>{copy.subtitle}</p>
              <div className={styles.highlights}>
                {copy.heroHighlights.map((item) => (
                  <div key={item.label} className={styles.highlight}>
                    <div className={styles.hiIcon}>
                      <Mark name={item.icon} />
                    </div>
                    <strong>{item.label}</strong>
                  </div>
                ))}
              </div>
              <div className={styles.actions}>
                <Button to={path('quote.index')}>{copy.primaryCta}</Button>
                <Link to={path('discovery.show')} className={styles.ghost}>
                  {copy.secondaryCta}
                </Link>
              </div>
            </div>

            <div className={styles.panelWrap}>
              <div className={styles.glow} />
              <div className={styles.panel}>
                <img src="/img/arac-plaka-tanima.png" alt={copy.title} />
                <div className={styles.shade} />
                <div className={styles.panelInner}>
                  <div className={styles.panelTop}>
                    <div className={styles.matrixTag}>
                      <span className={`${styles.dot} ${styles.green}`} />
                      {copy.heroPanelTitle}
                    </div>
                    <div className={styles.live}>
                      <span>{copy.liveLabel}</span>
                      <strong>HGS / POS / QR</strong>
                    </div>
                  </div>
                  <div className={styles.matrix}>
                    <h2>{copy.heroPanelTitle}</h2>
                    {copy.heroPanelRows.map((row) => (
                      <div key={row.label} className={styles.row}>
                        <span>{row.label}</span>
                        <p>{row.description}</p>
                      </div>
                    ))}
                  </div>
                  <div className={styles.stats}>
                    {copy.heroStats.map((stat) => (
                      <div key={stat.value} className={styles.stat}>
                        <span>{stat.value}</span>
                        <p>{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className={styles.bar}>
          {copy.outcomes.map((outcome) => (
            <div key={outcome} className={styles.outcome}>
              <span className={styles.check}>
                <Mark name="check" />
              </span>
              {outcome}
            </div>
          ))}
        </div>
      </section>

      <section className={styles.soft}>
        <div className={styles.wrap}>
          <div className={styles.kicker}>
            <span className={`${styles.dot} ${styles.amber}`} />
            HGS + POS + QR
          </div>
          <h2>{copy.paymentTitle}</h2>
          <p className={styles.lead}>{copy.paymentIntro}</p>
          <div className={styles.methods}>
            {copy.paymentMethods.map((method) => (
              <article key={method.title} className={styles.method}>
                <div className={styles.methodIcon}>
                  <Mark name={method.icon} />
                </div>
                <h3>{method.title}</h3>
                <p>{method.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.white}>
        <div className={styles.wrap}>
          <div className={styles.split}>
            <div>
              <h2>{copy.advantagesTitle}</h2>
              <p className={styles.lead}>{copy.advantagesIntro}</p>
            </div>
            <div className={styles.advGrid}>
              {copy.advantages.map((item) => (
                <article key={item.title} className={styles.adv}>
                  <div className={styles.advIcon}>
                    <Mark name={item.icon} />
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={styles.dark}>
        <div className={styles.wrap}>
          <h2>{copy.flowTitle}</h2>
          <div className={styles.steps}>
            {copy.flowSteps.map((step) => (
              <article key={step.step} className={styles.step}>
                <div className={styles.stepNum}>{step.step}</div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.white}>
        <div className={styles.wrap}>
          <div className={styles.center}>
            <h2>{copy.sectorsTitle}</h2>
          </div>
          <div className={styles.sectors}>
            {copy.sectors.map((sector) => (
              <div key={sector.label} className={styles.sector}>
                <div className={styles.sectorIcon}>
                  <Mark name={sector.icon} />
                </div>
                <span>{sector.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.ctaSec}>
        <div className={styles.ctaWrap}>
          <div className={styles.ctaBox}>
            <h2>{copy.ctaTitle}</h2>
            <p>{copy.ctaDescription}</p>
            <div className={styles.actions}>
              <Button to={path('quote.index')}>{copy.ctaPrimary}</Button>
              <Link to={path('contact')} className={styles.ghostDark}>
                {copy.ctaSecondary}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
