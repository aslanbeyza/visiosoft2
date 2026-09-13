import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { revealEase } from './motion.ts'

const tags = {
  div: motion.div,
  section: motion.section,
  article: motion.article,
  header: motion.header,
  figure: motion.figure,
  ul: motion.ul,
  ol: motion.ol,
  li: motion.li,
  p: motion.p,
}

type RevealTag = keyof typeof tags

type RevealProps = {
  children: ReactNode
  as?: RevealTag
  className?: string
  /** Saniye cinsinden gecikme. */
  delay?: number
  /** Başlangıçtaki dikey kayma (px). */
  y?: number
  /** Animasyonun başlaması için görünmesi gereken oran. */
  amount?: number
}

/** Görünüm alanına girince hafifçe yukarı kayarak beliren kapsayıcı. */
export default function Reveal({ children, as = 'div', className, delay = 0, y = 28, amount = 0.25 }: RevealProps) {
  const reduce = useReducedMotion()
  const Component = tags[as] as typeof motion.div

  return (
    <Component
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.8, delay, ease: revealEase }}
    >
      {children}
    </Component>
  )
}

type RevealGroupProps = Omit<RevealProps, 'y'> & {
  /** Çocuklar arasındaki gecikme (s). */
  stagger?: number
}

/** İçindeki RevealItem öğelerini sırayla gösterir. */
export function RevealGroup({ children, as = 'div', className, delay = 0, stagger = 0.09, amount = 0.2 }: RevealGroupProps) {
  const reduce = useReducedMotion()
  const Component = tags[as] as typeof motion.div

  return (
    <Component
      className={className}
      initial={reduce ? false : 'hidden'}
      whileInView="show"
      viewport={{ once: true, amount }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
    >
      {children}
    </Component>
  )
}

type RevealItemProps = Pick<RevealProps, 'children' | 'as' | 'className' | 'y'>

export function RevealItem({ children, as = 'div', className, y = 24 }: RevealItemProps) {
  const Component = tags[as] as typeof motion.div

  return (
    <Component
      className={className}
      variants={{
        hidden: { opacity: 0, y },
        show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: revealEase } },
      }}
    >
      {children}
    </Component>
  )
}
