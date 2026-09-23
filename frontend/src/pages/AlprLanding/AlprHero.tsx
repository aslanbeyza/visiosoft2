import { motion, useReducedMotion } from 'framer-motion'
import { useId, useRef, useState } from 'react'
import type { FocusEvent, PointerEvent } from 'react'
import Button from '../../components/Button/index.ts'
import CardGrid, { LinkCard } from '../../components/CardGrid/index.ts'
import Reveal, { revealEase } from '../../components/Reveal/index.ts'
import TextReveal from '../../components/TextReveal/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import TriadDiagram from './TriadDiagram.tsx'
import { alprCopy as copy } from './alprCopy.ts'
import styles from './AlprHero.module.css'

// Olayın geldiği kartın listedeki sırası
function cardIndex(target: EventTarget | null, root: HTMLElement | null): number | null {
  if (!root || !(target instanceof Element)) return null
  const item = target.closest('li')
  if (!item || !root.contains(item) || !item.parentElement) return null
  return Array.prototype.indexOf.call(item.parentElement.children, item)
}

/** Satış sayfası hero'su: başlık + üç bileşen şeması, altında şemayla eşleşen üç kart. */
export default function AlprHero() {
  const path = usePath()
  const reduce = Boolean(useReducedMotion())
  const titleId = useId()
  const cardsRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<number | null>(null)

  const pick = (event: PointerEvent | FocusEvent) => {
    const next = cardIndex(event.target, cardsRef.current)
    if (next !== null && next !== active) setActive(next)
  }
  const release = (event: FocusEvent) => {
    if (!cardsRef.current?.contains(event.relatedTarget as Node | null)) setActive(null)
  }

  return (
    <section className={styles.hero} aria-labelledby={titleId}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <div className={styles.copy}>
            <p className={styles.eyebrow}>
              <motion.span
                className={styles.rule}
                aria-hidden="true"
                initial={reduce ? false : { scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.9, ease: revealEase }}
              />
              {copy.eyebrow}
            </p>
            <TextReveal as="h1" id={titleId} text={copy.headline} className={styles.title} delay={0.15} />
            <Reveal as="p" className={styles.lead} delay={0.45} y={16}>
              {copy.subtitle}
            </Reveal>
            <Reveal className={styles.actions} delay={0.6} y={16}>
              <Button to={path('quote.index')} size="lg" arrow>
                {copy.quote}
              </Button>
              <Button to={path('discovery.show')} size="lg" variant="secondary">
                {copy.discovery}
              </Button>
            </Reveal>
          </div>
          <TriadDiagram labels={copy.triad.nodes} hub={copy.triad.hub} label={copy.triad.label} active={active} />
        </div>

        <div
          ref={cardsRef}
          className={styles.cards}
          onPointerOver={pick}
          onPointerLeave={() => setActive(null)}
          onFocus={pick}
          onBlur={release}
        >
          <CardGrid columns={3} label={copy.triad.cardsLabel}>
            {copy.needs.map((need, index) => (
              <LinkCard
                key={need.key}
                to={path(need.route)}
                index={index + 1}
                title={need.title}
                description={need.description}
                action={need.action}
              />
            ))}
          </CardGrid>
        </div>
      </div>
    </section>
  )
}
