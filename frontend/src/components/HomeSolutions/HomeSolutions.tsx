import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { RevealGroup, RevealItem, revealEase } from '../Reveal/index.ts'
import Section from '../Section/index.ts'
import SectionHeading from '../SectionHeading/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import SolutionIcon from './SolutionIcon.tsx'
import { homeSolutionsCopy as text } from './homeSolutionsCopy.ts'
import styles from './HomeSolutions.module.css'

const pad = (value: number) => String(value).padStart(2, '0')

export default function HomeSolutions() {
  const path = usePath()

  return (
    <Section tone="paper" spacing="md" labelledBy="home-solutions-title">
      <SectionHeading eyebrow={text.eyebrow} title={text.title} id="home-solutions-title" />

      <RevealGroup as="ol" className={styles.grid} stagger={0.1} amount={0.2}>
        {text.items.map((item, index) => (
          <RevealItem as="li" key={item.route} className={styles.item}>
            <motion.span
              className={styles.hairline}
              aria-hidden="true"
              variants={{
                hidden: { scaleX: 0 },
                show: { scaleX: 1, transition: { duration: 1.1, ease: revealEase } },
              }}
            />
            <article className={styles.card}>
              <div className={styles.top}>
                <span className={styles.index} aria-hidden="true">
                  {pad(index + 1)}
                </span>
                <SolutionIcon id={item.icon} className={styles.icon} />
              </div>
              <h3 className={styles.title}>
                <Link to={path(item.route)} className={styles.link}>
                  {item.title}
                </Link>
              </h3>
              <p className={styles.text}>{item.description}</p>
              <span className={styles.more} aria-hidden="true">
                {text.inspect}
                <svg viewBox="0 0 24 24" className={styles.arrow} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
            </article>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  )
}
