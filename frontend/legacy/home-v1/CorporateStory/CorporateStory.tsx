import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import Button from '../Button/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import { references } from '../../pages/References/references.ts'
import { corporateStoryCopy as text, featuredReferenceFiles } from './corporateStoryCopy.ts'
import styles from './CorporateStory.module.css'

const fade = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
}

export default function CorporateStory() {
  const path = usePath()
  const reduce = useReducedMotion()
  const featured = featuredReferenceFiles
    .map((file) => references.find((logo) => logo.file === file))
    .filter((logo): logo is (typeof references)[number] => Boolean(logo))
  const logos = featured.length >= 8 ? featured : references.slice(0, 12)

  return (
    <section className={styles.section} aria-label="Visiosoft">
      <div className={styles.block}>
        <p className={styles.kicker}>{text.about.kicker}</p>
        <h2 className={styles.title}>{text.about.title}</h2>
        <p className={styles.lead}>{text.about.lead}</p>
        <Link to={path('team')} className={styles.more}>
          {text.about.aboutLink} →
        </Link>
        <ul className={styles.stats} aria-label="Kanıt">
          {text.stats.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <div className={styles.aboutGrid}>
          {text.about.points.map((point) => (
            <motion.article
              key={point.title}
              className={styles.point}
              variants={reduce ? undefined : fade}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.4 }}
            >
              <h3>{point.title}</h3>
              <p>{point.desc}</p>
            </motion.article>
          ))}
        </div>
      </div>

      <div className={styles.block}>
        <p className={styles.kicker}>{text.industries.kicker}</p>
        <h2 className={styles.title}>{text.industries.title}</h2>
        <div className={styles.industryGrid}>
          {text.industries.items.map((item) => (
            <Link key={item.title} to={path(item.route)} className={styles.industry}>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
              <span>{text.industries.inspect}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className={styles.block}>
        <p className={styles.kicker}>{text.process.kicker}</p>
        <h2 className={styles.title}>{text.process.title}</h2>
        <div className={styles.stepGrid}>
          {text.process.steps.map((step) => (
            <article key={step.n} className={styles.step}>
              <span>{step.n}</span>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </article>
          ))}
        </div>
        <div className={styles.processFoot}>
          <Button to={path('services')} variant="ghost">
            {text.process.cta}
          </Button>
        </div>
      </div>

      <div className={styles.block}>
        <div className={styles.proofHead}>
          <div>
            <p className={styles.kicker}>{text.proof.kicker}</p>
            <h2 className={styles.title}>{text.proof.title}</h2>
          </div>
          <Link to={path('references')} className={styles.more}>
            {text.proof.more} →
          </Link>
        </div>
        <div className={styles.logos}>
          {logos.map((logo) => (
            <div key={logo.file} className={styles.logo}>
              <img src={logo.url} alt={logo.name} loading="lazy" />
            </div>
          ))}
        </div>
      </div>

      <div className={`${styles.block} ${styles.close}`}>
        <h2 className={styles.title}>{text.close.title}</h2>
        <p className={styles.lead}>{text.close.lead}</p>
        <div className={styles.closeActions}>
          <Button to={path('discovery.show')}>{text.close.primary}</Button>
          <Button to={path('quote.index')} variant="ghost">
            {text.close.secondary}
          </Button>
        </div>
      </div>
    </section>
  )
}
