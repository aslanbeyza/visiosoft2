import { useState } from 'react'
import { Link } from 'react-router-dom'
import { company, whatsappUrl } from '../../data/company.ts'
import { useLocale } from '../../hooks/useLocale/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import BarrierArms from './BarrierArms.tsx'
import { homeReadyCopy as text } from './homeReadyCopy.ts'
import styles from './HomeReady.module.css'

export default function HomeReady() {
  const path = usePath()
  const { config } = useLocale()
  const [armsOpen, setArmsOpen] = useState(false)
  const waId = config?.whatsapp_wa_id || company.whatsapp.waId

  return (
    <section id="hazir" className={styles.section} aria-labelledby="home-ready-title">
      <div
        className={styles.block}
        onMouseEnter={() => setArmsOpen(true)}
        onMouseLeave={() => setArmsOpen(false)}
        onFocus={() => setArmsOpen(true)}
        onBlur={(event) => {
          const next = event.relatedTarget
          if (next instanceof Node && event.currentTarget.contains(next)) return
          setArmsOpen(false)
        }}
      >
        <h2 id="home-ready-title" className={styles.title}>
          {text.title}
        </h2>
        <BarrierArms open={armsOpen} />
        <p className={styles.description}>{text.description}</p>
        <div className={styles.actions}>
          <Link to={path('discovery.show')} className={styles.primary}>
            {text.ctaPrimary}
          </Link>
          <a className={styles.secondary} href={whatsappUrl(waId)} target="_blank" rel="noopener noreferrer">
            {text.ctaSecondary}
            <span className={styles.phone}>{text.phone}</span>
            <span className="sr-only"> (yeni sekmede açılır)</span>
          </a>
        </div>
      </div>
    </section>
  )
}
