import { useId, useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { company, whatsappUrl } from '../../data/company.ts'
import { useLocale } from '../../hooks/useLocale/index.ts'
import { usePath } from '../../hooks/usePath/index.ts'
import Button from '../Button/index.ts'
import { spotlightLeave, spotlightMove } from '../FeatureGrid/spotlight.ts'
import { revealEase } from '../Reveal/index.ts'
import TextReveal from '../TextReveal/index.ts'
import { leadPageCopy } from './leadPageCopy.ts'
import styles from './LeadAside.module.css'

const copy = leadPageCopy.direct

const ICONS = {
  whatsapp: ['M4.5 19.5 5.7 16A7.8 7.8 0 1 1 8.3 18.4Z', 'M9.2 8.6c.3 2.9 2.3 5 5.3 5.6l1-1.2-1.6-1-1 .7a4 4 0 0 1-2-2l.7-1-1-1.6Z'],
  mail: ['M3.5 6.5h17v11h-17Z', 'm3.8 7 8.2 6.3L20.2 7'],
} as const

type DirectContactProps = {
  /** İletişim sayfasında kendini gösteren bağlantıyı kapatır. */
  showContactLink?: boolean
  /** WhatsApp kutucuğunda numara yerine gösterilecek metin (ör. "WhatsApp"). */
  whatsappValue?: string
}

/** Formu doldurmak istemeyenler için WhatsApp ve e-posta kutucukları (+ isteğe bağlı İletişim bağlantısı). */
export default function DirectContact({ showContactLink = true, whatsappValue }: DirectContactProps) {
  const reduce = Boolean(useReducedMotion())
  const { config } = useLocale()
  const path = usePath()
  const titleId = useId()
  const listRef = useRef<HTMLUListElement>(null)
  const inView = useInView(listRef, { once: true, amount: 0.3 })
  const run = reduce || inView

  const tiles = [
    {
      key: 'whatsapp' as const,
      ...copy.whatsapp,
      value: whatsappValue ?? (config?.whatsapp_display || company.whatsapp.display),
      href: whatsappUrl(config?.whatsapp_wa_id || company.whatsapp.waId),
      external: true,
    },
    { key: 'mail' as const, ...copy.email, value: company.email, href: `mailto:${company.email}`, external: false },
  ]

  return (
    <section className={styles.block} aria-labelledby={titleId}>
      <TextReveal as="h2" id={titleId} className={styles.titleSmall} text={copy.title} />
      <p className={styles.lead}>{copy.lead}</p>

      <ul ref={listRef} className={styles.tiles}>
        {tiles.map((tile, index) => (
          <motion.li
            key={tile.key}
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={run ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.7, delay: index * 0.1, ease: revealEase }}
          >
            <a
              className={styles.tile}
              href={tile.href}
              target={tile.external ? '_blank' : undefined}
              rel={tile.external ? 'noopener noreferrer' : undefined}
              onPointerMove={spotlightMove}
              onPointerLeave={spotlightLeave}
            >
              <span className={styles.iconTile}>
                <svg viewBox="0 0 24 24" className={styles.icon} aria-hidden="true" focusable="false">
                  {ICONS[tile.key].map((d, i) => (
                    <motion.path
                      key={d}
                      d={d}
                      initial={reduce ? false : { pathLength: 0 }}
                      animate={run ? { pathLength: 1 } : undefined}
                      transition={{ duration: 0.9, delay: 0.2 + index * 0.1 + i * 0.25, ease: revealEase }}
                    />
                  ))}
                </svg>
              </span>
              <span className={styles.tileBody}>
                <span className={styles.tileEyebrow}>{tile.eyebrow}</span>
                <strong className={styles.tileValue}>{tile.value}</strong>
                <span className={styles.tileText}>{tile.description}</span>
                <span className={styles.tileAction}>
                  {tile.action}
                  {tile.external ? <span className={styles.srOnly}> {copy.newTab}</span> : null}
                  <svg viewBox="0 0 24 24" className={styles.arrow} aria-hidden="true" focusable="false">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </span>
            </a>
          </motion.li>
        ))}
      </ul>

      {showContactLink ? (
        <div className={styles.more}>
          <Button to={path('contact')} variant="secondary" arrow>
            {copy.contactLink}
          </Button>
        </div>
      ) : null}
    </section>
  )
}
