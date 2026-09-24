import { useId } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import Breadcrumbs from '../../components/Breadcrumbs/index.ts'
import Button from '../../components/Button/index.ts'
import KioskExplode from '../../components/KioskExplode/index.ts'
import { explodeVariantFor } from '../../components/KioskExplode/explodeVariants.ts'
import { RevealGroup, RevealItem, revealEase } from '../../components/Reveal/index.ts'
import TextReveal from '../../components/TextReveal/index.ts'
import { navCta } from '../../data/siteNav.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import HeroStage from './HeroStage.tsx'
import ProductViewer from './ProductViewer.tsx'
import { productModelSrc } from './productModels.ts'
import { detailCopy } from './detailShared.ts'
import type { ProductDetailData } from './detailTypes.ts'
import styles from './DetailHero.module.css'

type DetailHeroProps = {
  data: ProductDetailData
}

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
  const heroFallback = <HeroStage data={data} reduce={reduce} />

  if (explodeVariantFor(data.slug)) {
    return <KioskExplode slug={data.slug} />
  }

  if (productModelSrc(data.slug)) {
    return <ProductViewer slug={data.slug} name={copy.name} mode="hero" fallback={heroFallback} />
  }

  return (
    <section className={styles.hero} aria-labelledby={titleId}>
      <div className={styles.inner}>
        <div className={styles.copy}>
          <div className={styles.intro}>
            <RevealGroup stagger={0.08} amount={0.05}>
              <RevealItem y={12}>
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
          </div>

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
              <Button to={path(navCta.primary.route)} size="lg" arrow>
                {navCta.primary.label}
              </Button>
              <Button to={path(navCta.quickQuote.route)} variant="secondary" size="lg">
                {navCta.quickQuote.label}
              </Button>
            </RevealItem>
          </RevealGroup>
        </div>

        {heroFallback}
      </div>
    </section>
  )
}
