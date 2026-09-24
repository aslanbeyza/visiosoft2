import { useLayoutEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { revealEase } from '../Reveal/index.ts'
import { company, whatsappUrl } from '../../data/company.ts'
import { useLocale } from '../../hooks/useLocale/index.ts'
import WhatsAppGlyph from './WhatsAppGlyph.tsx'
import styles from './WhatsAppButton.module.css'

const LABEL = 'WhatsApp ile yazın'
const NEW_TAB = '(yeni sekmede açılır)'

export default function WhatsAppButton() {
  const { config } = useLocale()
  const reduce = Boolean(useReducedMotion())
  const waId = config?.whatsapp_wa_id || company.whatsapp.waId
  const [isFooterVisible, setIsFooterVisible] = useState(false)
  const hasEntered = useRef(false)

  useLayoutEffect(() => {
    const footer = document.getElementById('site-footer')
    if (!footer) return

    const mark = () => {
      const rect = footer.getBoundingClientRect()
      setIsFooterVisible(rect.top < window.innerHeight && rect.bottom > 0)
    }
    mark()

    const observer = new IntersectionObserver(([entry]) => {
      setIsFooterVisible(entry.isIntersecting)
    })
    observer.observe(footer)
    return () => observer.disconnect()
  }, [])

  if (isFooterVisible) hasEntered.current = true

  return (
    <motion.a
      className={styles.button}
      href={whatsappUrl(waId)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${LABEL} ${NEW_TAB}`}
      aria-hidden={isFooterVisible || undefined}
      tabIndex={isFooterVisible ? -1 : undefined}
      style={{ pointerEvents: isFooterVisible ? 'none' : 'auto' }}
      initial={reduce ? false : { opacity: 0, scale: 0.6 }}
      animate={{ opacity: isFooterVisible ? 0 : 1, scale: isFooterVisible ? 0.94 : 1 }}
      transition={{
        duration: reduce ? 0 : isFooterVisible ? 0.28 : 0.55,
        delay: isFooterVisible || hasEntered.current || reduce ? 0 : 1.2,
        ease: revealEase,
      }}
    >
      <span className={styles.labelWrap} aria-hidden="true">
        <span className={styles.label}>{LABEL}</span>
      </span>
      <span className={styles.circle}>
        <WhatsAppGlyph className={styles.glyph} />
      </span>
    </motion.a>
  )
}
