import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import Button from '../Button/index.ts'
import Picture from '../Picture/index.ts'
import { revealEase } from '../Reveal/index.ts'
import Section from '../Section/index.ts'
import SectionHeading from '../SectionHeading/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import { products } from '../../pages/HardwareProduct/products.ts'
import { homeProductsCopy as text, productImage } from './homeProductsCopy.ts'
import type { HomeProductCard } from './homeProductsCopy.ts'
import styles from './HomeProducts.module.css'

/** Kart kendi gecikmesiyle belirir; görsel sahnesi ve görsel aynı gecikmeyle kart içinde açılır. */
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: revealEase, delay, delayChildren: delay },
  }),
}

const stageVariants: Variants = {
  hidden: { clipPath: 'inset(0% 0% 100% 0%)' },
  show: { clipPath: 'inset(0% 0% 0% 0%)', transition: { duration: 1.1, ease: revealEase } },
}

const imageVariants: Variants = {
  hidden: { scale: 1.08 },
  show: { scale: 1, transition: { duration: 1.2, ease: revealEase } },
}

/** Masaüstü ızgarasında aynı satırdaki kartlar soldan sağa sırayla gelir (kiosk, tir, box, rack, housing, tower, katalog). */
const delays = [0, 0.08, 0.16, 0.08, 0.16, 0, 0.08]

function Arrow({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

type ProductCardProps = {
  card: HomeProductCard
  delay: number
  featured: boolean
}

function ProductCard({ card, delay, featured }: ProductCardProps) {
  const path = usePath()
  const reduce = useReducedMotion()
  const product = products[card.slug]
  const { copy } = product
  const image = productImage(card.slug)

  return (
    <motion.li
      className={styles.card}
      data-area={card.area}
      data-featured={featured ? 'true' : undefined}
      variants={cardVariants}
      custom={delay}
      initial={reduce ? false : 'hidden'}
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      <article className={styles.surface}>
        <motion.div className={styles.stage} variants={stageVariants}>
          <motion.div className={styles.stageInner} variants={imageVariants}>
            <Picture
              src={image.src}
              avif={image.avif}
              alt={card.alt}
              width={card.width}
              height={card.height}
              className={styles.image}
            />
          </motion.div>
        </motion.div>

        <div className={styles.body}>
          <p className={styles.tag}>{copy.eyebrow}</p>
          <h3 className={styles.name}>
            <Link to={path(product.route)} className={styles.link}>
              {copy.name}
            </Link>
          </h3>
          <p className={styles.lead}>{copy.lead}</p>

          {featured ? (
            <ul className={styles.features} aria-label={text.featuresLabel}>
              {copy.features.map((feature) => (
                <li key={feature.title}>
                  <svg viewBox="0 0 16 16" className={styles.check} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="m3.5 8.4 2.9 2.9 6.1-6.3" />
                  </svg>
                  {feature.title}
                </li>
              ))}
            </ul>
          ) : null}

          <div className={styles.meta}>
            <span className={styles.inspect} aria-hidden="true">
              {text.inspect}
              <Arrow className={styles.arrow} />
            </span>
            {card.dimensions ? (
              <p className={styles.dimensions}>
                <span className={styles.srOnly}>{text.dimensionsLabel}: </span>
                {card.dimensions}
              </p>
            ) : null}
          </div>
        </div>
      </article>
    </motion.li>
  )
}

function LedIcon({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="13" rx="1.5" />
      <path d="M12 16v5M8.5 21h7" />
      <path d="M7 7.5h.01M10.3 7.5h.01M13.7 7.5h.01M17 7.5h.01M7 11.5h.01M10.3 11.5h.01M13.7 11.5h.01M17 11.5h.01" strokeWidth="2.2" />
    </svg>
  )
}

export default function HomeProducts() {
  const path = usePath()
  const reduce = useReducedMotion()
  const more = text.more

  return (
    <Section tone="surface" spacing="lg" labelledBy="home-products-title">
      <SectionHeading eyebrow={text.eyebrow} title={text.title} lead={text.lead} id="home-products-title" />

      <ul className={styles.grid}>
        {text.cards.map((card, index) => (
          <ProductCard key={card.slug} card={card} delay={delays[index] ?? 0} featured={index === 0} />
        ))}

        <motion.li
          className={styles.more}
          variants={cardVariants}
          custom={delays[text.cards.length] ?? 0}
          initial={reduce ? false : 'hidden'}
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className={styles.moreInner}>
            <span className={styles.moreIcon}>
              <LedIcon className={styles.moreSvg} />
            </span>
            <p className={styles.moreEyebrow}>{more.eyebrow}</p>
            <h3 className={styles.moreTitle}>{more.title}</h3>
            <p className={styles.moreText}>{more.description}</p>
            <div className={styles.moreActions}>
              <Button to={path('hardware-products')} variant="light" arrow>
                {more.primary}
              </Button>
              <Link to={path('hardware-products.ledli-reklam-paneli')} className={styles.moreLink}>
                {more.led}
                <Arrow className={styles.arrow} />
              </Link>
            </div>
          </div>
        </motion.li>
      </ul>
    </Section>
  )
}
