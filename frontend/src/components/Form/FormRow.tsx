/**
 * Kullanım: <FormRow columns={2}><Field …/><Field …/></FormRow>
 * Alanları geniş ekranda yan yana, dar ekranda alt alta dizer.
 */
import type { ReactNode } from 'react'
import styles from './FormRow.module.css'

export type FormRowProps = {
  children: ReactNode
  columns?: 1 | 2 | 3
  className?: string
}

export default function FormRow({ children, columns = 2, className = '' }: FormRowProps) {
  return (
    <div className={`${styles.row} ${className}`.trim()} data-columns={columns}>
      {children}
    </div>
  )
}
