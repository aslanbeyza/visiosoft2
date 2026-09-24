import type { CSSProperties } from 'react'
import type { MethodKey, PaymentMethod } from './hgsPageCopy.ts'
import styles from './MethodRoutes.module.css'

type MethodRoutesProps = {
  methods: PaymentMethod[]
  selected: MethodKey
  label: string
}

export default function MethodRoutes({ methods, selected, label }: MethodRoutesProps) {
  return (
    <div className={styles.routes}>
      {methods.map((method) => {
        const on = method.key === selected
        return (
          <div key={method.key} className={styles.panel} data-on={on} aria-hidden={!on}>
            <p className={styles.label}>
              {label} · {method.label}
            </p>
            <ol className={styles.list}>
              {method.route.map((step, index) => (
                <li key={step} className={styles.step} style={{ '--i': index } as CSSProperties}>
                  <span className={styles.dot} aria-hidden="true" />
                  {step}
                </li>
              ))}
            </ol>
          </div>
        )
      })}
    </div>
  )
}
