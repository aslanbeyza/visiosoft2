import Button from '../../components/Button/index.ts'
import Seo from '../../components/Seo/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import { aboutCopy as text } from './aboutCopy.ts'
import styles from './About.module.css'

export default function About() {
  const path = usePath()

  return (
    <>
      <Seo title={text.seoTitle} description={text.seoDescription} />
      <section className={styles.page}>
        <div className={styles.wrap}>
          <p className={styles.kicker}>{text.kicker}</p>
          <h1 className={styles.title}>{text.title}</h1>
          <p className={styles.lead}>{text.lead}</p>

          <div className={styles.story}>
            {text.story.map((item) => (
              <article key={item.title} className={styles.card}>
                <h2>{item.title}</h2>
                <p>{item.desc}</p>
              </article>
            ))}
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Kurum</h2>
            <dl className={styles.facts}>
              {text.facts.map(([label, value]) => (
                <div key={label} className={styles.fact}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>{text.locationsTitle}</h2>
            <div className={styles.places}>
              {text.locations.map((item) => (
                <article key={item.title} className={styles.place}>
                  <span>{item.title}</span>
                  <strong>{item.place}</strong>
                </article>
              ))}
            </div>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>{text.teamTitle}</h2>
            <p className={styles.teamLead}>{text.teamLead}</p>
            <figure className={styles.team}>
              <img src="/img/pages/visiosoft_visio_takimimiz.webp" alt={text.teamAlt} />
            </figure>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>{text.ctaTitle}</h2>
            <div className={styles.actions}>
              <Button to={path('contact')}>{text.primary}</Button>
              <Button to={path('discovery.show')} variant="ghost">
                {text.secondary}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
