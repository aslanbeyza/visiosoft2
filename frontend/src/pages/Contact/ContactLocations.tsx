import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import IframeEmbed from '../../components/IframeEmbed/index.ts'
import Reveal, { RevealGroup, revealEase } from '../../components/Reveal/index.ts'
import Section from '../../components/Section/index.ts'
import SectionHeading from '../../components/SectionHeading/index.ts'
import { contactCopy } from './contactCopy.ts'
import { officeLocations, padIndex } from './locationDetails.ts'
import styles from './ContactLocations.module.css'

const copy = contactCopy.locations

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: revealEase } },
}

const lineVariants: Variants = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 1, delay: 0.15, ease: revealEase } },
}

/** Lokasyonlar: tam adresli dört kart ve düğmeyle yüklenen OpenStreetMap haritası. */
export default function ContactLocations({ id }: { id: string }) {
  const headingId = `${id}-baslik`

  return (
    <Section id={id} tone="surface" spacing="lg" labelledBy={headingId}>
      <SectionHeading id={headingId} eyebrow={copy.eyebrow} title={copy.title} lead={copy.lead} />

      <div className={styles.grid}>
        <RevealGroup as="ol" className={styles.list} stagger={0.08} amount={0.15}>
          {officeLocations.map((item) => (
            <motion.li key={item.key} variants={cardVariants} className={styles.card}>
              <motion.span className={styles.hairline} variants={lineVariants} aria-hidden="true" />
              <div className={styles.cardHead}>
                <span className={styles.index} aria-hidden="true">
                  {padIndex(item.index + 1)}
                </span>
                <span className={styles.district}>{item.district}</span>
              </div>
              <h3 className={styles.name}>{item.label}</h3>
              <address className={styles.address}>{item.address}</address>
              {item.note ? <p className={styles.note}>{item.note}</p> : null}
              <a className={styles.directions} href={item.mapUrl} target="_blank" rel="noopener noreferrer">
                {copy.directions}
                <span className={styles.srOnly}>
                  {' '}
                  — {item.label} {contactCopy.channels.newTab}
                </span>
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path d="M7 17 17 7M9 7h8v8" />
                </svg>
              </a>
            </motion.li>
          ))}
        </RevealGroup>

        <Reveal className={styles.map} delay={0.15} y={32}>
          <IframeEmbed
            src={copy.map.src}
            title={copy.map.title}
            description={copy.map.description}
            loadOn="click"
            loadLabel={copy.map.load}
            ratio="4 / 5"
            fallbackHref={copy.map.href}
            fallbackLabel={copy.map.open}
          />
        </Reveal>
      </div>
    </Section>
  )
}
