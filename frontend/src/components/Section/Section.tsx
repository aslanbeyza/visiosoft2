import type { ReactNode } from 'react'
import styles from './Section.module.css'

type SectionProps = {
  children: ReactNode
  id?: string
  /** paper: beyaz · surface: açık gri · navy: koyu lacivert · night: en koyu lacivert */
  tone?: 'paper' | 'surface' | 'navy' | 'night'
  /** Dikey boşluk. */
  spacing?: 'none' | 'md' | 'lg'
  /** İç kap genişliği: prose 46rem · content 72rem · wide 80rem · full */
  width?: 'prose' | 'content' | 'wide' | 'full'
  className?: string
  innerClassName?: string
  labelledBy?: string
  label?: string
}

/** Tasarım sistemindeki tüm bölümlerin ortak kabı: zemin tonu, dikey boşluk ve içerik genişliği. */
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
