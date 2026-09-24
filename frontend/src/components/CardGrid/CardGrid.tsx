
import { Children, isValidElement } from 'react'
import type { ReactNode } from 'react'
import { AnimatePresence } from 'framer-motion'
import { CardGridContext } from './context.ts'
import styles from './CardGrid.module.css'

export type CardGridProps = {
  children: ReactNode
  columns?: 2 | 3 | 4

  label?: string

  animateLayout?: boolean
  className?: string
}

export default function CardGrid({ children, columns = 3, label, animateLayout = false, className = '' }: CardGridProps) {
  const items = Children.toArray(children)
  const wrapped = items.map((child, index) => (
    <CardGridContext.Provider
      key={isValidElement(child) && child.key !== null ? child.key : index}
      value={{ columns, position: index, animateLayout }}
    >
      {child}
    </CardGridContext.Provider>
  ))

  return (
    <ul className={`${styles.grid} ${className}`.trim()} role="list" aria-label={label} data-columns={columns}>
      {animateLayout ? <AnimatePresence initial={false}>{wrapped}</AnimatePresence> : wrapped}
    </ul>
  )
}
