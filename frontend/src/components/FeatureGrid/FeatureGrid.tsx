
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { revealEase } from '../Reveal/index.ts'
import { featureGridCopy } from './featureGridCopy.ts'
import { spotlightLeave, spotlightMove } from './spotlight.ts'
import styles from './FeatureGrid.module.css'

export type FeatureItem = {
  icon?: ReactNode
  title: string
  description: string

  meta?: string

  to?: string

  external?: boolean

  featured?: boolean
}

export type FeatureGridProps = {
  items: FeatureItem[]
  columns?: 2 | 3 | 4
  variant?: 'card' | 'plain' | 'numbered'
  tone?: 'light' | 'dark'

  headingAs?: 'h3' | 'h4'

  label?: string
  className?: string
}

const pad = (value: number) => String(value).padStart(2, '0')
const isExternalHref = (href: string) => /^(https?:|mailto:|tel:)/i.test(href)

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: revealEase, delay },
  }),
}

const hairlineVariants: Variants = {
  hidden: { scaleX: 0 },
  show: (delay: number = 0) => ({
    scaleX: 1,
    transition: { duration: 1.1, ease: revealEase, delay: delay + 0.1 },
  }),
}

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" className={styles.arrow} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

type ItemProps = {
  item: FeatureItem
  index: number
  delay: number
  variant: NonNullable<FeatureGridProps['variant']>
  headingAs: NonNullable<FeatureGridProps['headingAs']>
}

function Item({ item, index, delay, variant, headingAs: Heading }: ItemProps) {
  const reduce = useReducedMotion()
  const external = item.to ? (item.external ?? isExternalHref(item.to)) : false
  const featured = variant === 'card' && Boolean(item.featured)

  const title = item.to ? (
    external ? (
      <a href={item.to} className={styles.link} target="_blank" rel="noopener noreferrer">
        {item.title}
        <span className={styles.srOnly}> ({featureGridCopy.external})</span>
      </a>
    ) : (
      <Link to={item.to} className={styles.link}>
        {item.title}
      </Link>
    )
  ) : (
    item.title
  )

  return (
    <motion.li
      className={styles.item}
      data-featured={featured ? 'true' : undefined}
      variants={itemVariants}
      custom={delay}
      initial={reduce ? false : 'hidden'}
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
    >
      {}
      {variant === 'card' ? null : <motion.span className={styles.hairline} aria-hidden="true" variants={hairlineVariants} />}
      <article
        className={styles.card}
        data-link={item.to ? 'true' : undefined}
        onPointerMove={spotlightMove}
        onPointerLeave={spotlightLeave}
      >
        <div className={styles.head}>
          {variant === 'numbered' ? (
            <span className={styles.index} aria-hidden="true">
              {pad(index + 1)}
            </span>
          ) : null}
          {item.icon ? (
            <span className={styles.icon} aria-hidden="true">
              {item.icon}
            </span>
          ) : null}
        </div>
        <Heading className={styles.title}>{title}</Heading>
        <p className={styles.text}>{item.description}</p>
        {item.meta || item.to ? (
          <div className={styles.foot}>
            {item.meta ? <span className={styles.meta}>{item.meta}</span> : null}
            {item.to ? (
              <span className={styles.more} aria-hidden="true">
                <Arrow />
              </span>
            ) : null}
          </div>
        ) : null}
      </article>
    </motion.li>
  )
}

export default function FeatureGrid({
  items,
  columns = 3,
  variant = 'card',
  tone = 'light',
  headingAs = 'h3',
  label,
  className = '',
}: FeatureGridProps) {
  return (
    <ul
      className={`${styles.grid} ${className}`.trim()}
      role="list"
      aria-label={label}
      data-columns={columns}
      data-variant={variant}
      data-tone={tone}
    >
      {items.map((item, index) => (
        <Item
          key={item.title}
          item={item}
          index={index}

          delay={(index % columns) * 0.08}
          variant={variant}
          headingAs={headingAs}
        />
      ))}
    </ul>
  )
}
