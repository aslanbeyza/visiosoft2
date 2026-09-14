import { useState } from 'react'
import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import Button from '../../components/Button/index.ts'
import Reveal, { RevealGroup, revealEase } from '../../components/Reveal/index.ts'
import Section from '../../components/Section/index.ts'
import SectionHeading from '../../components/SectionHeading/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import LocationsScene from '../Contact/LocationsScene.tsx'
import { officeLocations, padIndex } from '../Contact/locationDetails.ts'
import { aboutPageCopy } from './aboutPageCopy.ts'
import styles from './AboutLocations.module.css'

const copy = aboutPageCopy.locations

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: revealEase } },
}

/**
 * Neredeyiz: dört adresin cephe çizimi (Perpa kulesinde showroom ve depo katları, Başakşehir'de Living LAB ve Teknopark)
 * ve görevleriyle adlandırılmış kartlar. Kartın üzerine gelindiğinde çizimdeki işareti öne çıkar; adresler İletişim'de.
 */
export default function AboutLocations({ id }: { id: string }) {
  const path = usePath()
  const [active, setActive] = useState<number | null>(null)
  const headingId = `${id}-baslik`

  return (
    <Section id={id} tone="surface" spacing="lg" labelledBy={headingId}>
      <SectionHeading id={headingId} eyebrow={copy.eyebrow} title={copy.title} lead={copy.lead} />

      <Reveal className={styles.scene} y={32} amount={0.2}>
        <LocationsScene labels={officeLocations.map((item) => item.label)} active={active} />
      </Reveal>

      <RevealGroup as="ul" className={styles.list} stagger={0.08} amount={0.2}>
        {officeLocations.map((item) => (
          <motion.li
            key={item.key}
            variants={itemVariants}
            className={styles.item}
            data-active={active === item.index ? 'true' : 'false'}
            onPointerEnter={() => setActive(item.index)}
            onPointerLeave={() => setActive(null)}
          >
            <span className={styles.head}>
              <span className={styles.index} aria-hidden="true">
                {padIndex(item.index + 1)}
              </span>
              <span className={styles.district}>{item.district}</span>
            </span>
            <h3 className={styles.name}>{item.label}</h3>
            <p className={styles.place}>{item.place}</p>
          </motion.li>
        ))}
      </RevealGroup>

      <Reveal className={styles.actions} delay={0.2} y={12}>
        <Button to={`${path('contact')}#lokasyonlar`} variant="secondary" arrow>
          {copy.link}
        </Button>
      </Reveal>
    </Section>
  )
}
