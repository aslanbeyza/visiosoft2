import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import type { HTMLMotionProps } from 'framer-motion'
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

/** Hareket durumunu bileşen yönetir; bu yüzden variants/initial/animate dışarıdan verilemez. */
type PassThroughProps = Omit<
  HTMLMotionProps<'div'>,
  'children' | 'className' | 'variants' | 'initial' | 'animate' | 'whileInView' | 'exit' | 'viewport'
>

type RevealGroupProps = Omit<RevealProps, 'y'> &
  PassThroughProps & {
    /** Çocuklar arasındaki gecikme (s). */
    stagger?: number
  }

/**
 * İçindeki RevealItem öğelerini sırayla gösterir. Ek özellikler (aria-*, id, data-*, role, style) kapsayıcıya aktarılır:
 * `<RevealGroup as="ul" aria-label="Özellikler">`
 */
export function RevealGroup({ children, as = 'div', className, delay = 0, stagger = 0.09, amount = 0.2, ...rest }: RevealGroupProps) {
  const reduce = useReducedMotion()
  const Component = tags[as] as typeof motion.div

  return (
    <Component
      {...rest}
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

type RevealItemProps = Pick<RevealProps, 'children' | 'as' | 'className' | 'y'> & PassThroughProps

/**
 * RevealGroup içindeki sıralı öğe. Ek özellikler (data-*, id, olay işleyicileri, style, aria-*) öğeye aktarılır:
 * `<RevealItem as="li" data-active={on} onPointerEnter={…}>`
 */
export function RevealItem({ children, as = 'div', className, y = 24, ...rest }: RevealItemProps) {
  const Component = tags[as] as typeof motion.div

  return (
    <Component
      {...rest}
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
