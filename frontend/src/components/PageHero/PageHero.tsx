import type { ReactNode } from 'react'
import styles from './PageHero.module.css'

type PageHeroProps = {
  eyebrow?: string
  title: string
  description?: string
  actions?: ReactNode
}

export default function PageHero({ eyebrow, title, description, actions }: PageHeroProps) {
  return (
    <section className={styles.hero}>
      <div className={styles.inner}>
        {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
        <h1>{title}</h1>
        {description ? <p className={styles.copy}>{description}</p> : null}
        {actions ? <div className={styles.actions}>{actions}</div> : null}
      </div>
    </section>
  )
}
