/**
 * Kullanım:
 * <CardGrid columns={3} label="Donanım ürünleri">
 *   {items.map((item, index) => (
 *     <LinkCard key={item.slug} to={path(item.route)} eyebrow={item.tag} title={item.name} description={item.lead} image={...} index={index + 1} />
 *   ))}
 * </CardGrid>
 * Eşit yükseklikte kart ızgarası. `animateLayout` ile (filtreleme gibi) çocuk değişimleri layout animasyonuyla izlenir;
 * bu durumda çocukların anahtarları (key) kararlı olmalıdır.
 */
import { Children, isValidElement } from 'react'
import type { ReactNode } from 'react'
import { AnimatePresence } from 'framer-motion'
import { CardGridContext } from './context.ts'
import styles from './CardGrid.module.css'

export type CardGridProps = {
  children: ReactNode
  columns?: 2 | 3 | 4
  /** Listenin erişilebilir adı. */
  label?: string
  /** Çocuk kartlar eklenip çıkarıldığında konumlar animasyonla güncellenir. */
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
