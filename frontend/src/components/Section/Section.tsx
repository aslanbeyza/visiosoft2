import type { ReactNode } from 'react'
import styles from './Section.module.css'

type SectionProps = {
  children: ReactNode
  id?: string

  tone?: 'paper' | 'surface' | 'navy' | 'night'

  spacing?: 'none' | 'md' | 'lg'

  width?: 'prose' | 'content' | 'wide' | 'full'
  className?: string
  innerClassName?: string
  labelledBy?: string
  label?: string
}

export default function Section({
  children,
  id,
  tone = 'paper',
  spacing = 'md',
  width = 'wide',
  className = '',
  innerClassName = '',
  labelledBy,
  label,
}: SectionProps) {
  return (
    <section
      id={id}
      className={`${styles.section} ${className}`.trim()}
      data-tone={tone}
      data-spacing={spacing}
      aria-labelledby={labelledBy}
      aria-label={label}
    >
      <div className={`${styles.inner} ${innerClassName}`.trim()} data-width={width}>
        {children}
      </div>
    </section>
  )
}
