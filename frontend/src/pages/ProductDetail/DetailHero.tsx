import { useId } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import Breadcrumbs from '../../components/Breadcrumbs/index.ts'
import Button from '../../components/Button/index.ts'
import Magnetic from '../../components/Magnetic/index.ts'
import { RevealGroup, RevealItem, revealEase } from '../../components/Reveal/index.ts'
import TextReveal from '../../components/TextReveal/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import HeroStage from './HeroStage.tsx'
import { detailCopy } from './detailShared.ts'
import type { ProductDetailData } from './detailTypes.ts'
import styles from './DetailHero.module.css'

type DetailHeroProps = {
  data: ProductDetailData
}

/** Ürün kahramanı: künye, kısa tanım ve teknik pafta sahnesinde yükselen ürün. */
export default function DetailHero({ data }: DetailHeroProps) {
  const path = usePath()
  const reduce = Boolean(useReducedMotion())
  const titleId = useId()
  const { copy } = data
  const crumbs = [
    { label: detailCopy.breadcrumb.home, to: path('home') },
    { label: detailCopy.breadcrumb.category, to: path(detailCopy.breadcrumb.categoryRoute) },
    { label: data.navLabel },
  ]

  return (
    <section className={styles.hero} aria-labelledby={titleId}>
      <div className={styles.inner}>
        <div className={styles.copy}>
          <RevealGroup stagger={0.08} amount={0.05}>
            <RevealItem y={12} className={styles.crumbs}>
              <Breadcrumbs items={crumbs} />
            </RevealItem>
            <RevealItem as="p" className={styles.eyebrow}>
              <motion.span
                className={styles.rule}
                aria-hidden="true"
                initial={reduce ? false : { scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.9, delay: 0.35, ease: revealEase }}
              />
              {copy.eyebrow}
            </RevealItem>
          </RevealGroup>

          <TextReveal as="h1" id={titleId} text={copy.name} className={styles.title} delay={0.15} />

          <RevealGroup stagger={0.1} delay={0.45} amount={0.05}>
            <RevealItem as="p" className={styles.lead}>
              {copy.lead}
            </RevealItem>

            {data.heroMeta ? (
              <RevealItem>
                <dl className={styles.meta}>
                  {copy.meta.map((item) => (
                    <div key={item.label} className={styles.metaItem}>
                      <dt>{item.label}</dt>
                      <dd>{item.value}</dd>
                    </div>
                  ))}
                </dl>
              </RevealItem>
            ) : null}

            <RevealItem className={styles.actions}>
              <Magnetic>
                <Button to={path('discovery.show')} size="lg" arrow>
                  {detailCopy.actions.discovery}
                </Button>
              </Magnetic>
              <Button to={path('quote.index')} variant="secondary" size="lg">
                {detailCopy.actions.quote}
              </Button>
            </RevealItem>
          </RevealGroup>
        </div>

        <HeroStage data={data} reduce={reduce} />
      </div>
    </section>
  )
}
