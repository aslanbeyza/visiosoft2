import { motion, useReducedMotion } from 'framer-motion'
import { revealEase } from '../Reveal/index.ts'
import { company, whatsappUrl } from '../../data/company.ts'
import { useLocale } from '../../hooks/useLocale/index.ts'
import WhatsAppGlyph from './WhatsAppGlyph.tsx'
import styles from './WhatsAppButton.module.css'

const LABEL = 'WhatsApp ile yazın'
const NEW_TAB = '(yeni sekmede açılır)'

/** Sağ altta sabit WhatsApp bağlantısı; numara backend config'ten, yoksa şirket bilgisinden gelir. */
export default function WhatsAppButton() {
  const { config } = useLocale()
  const reduce = useReducedMotion()
  const waId = config?.whatsapp_wa_id || company.whatsapp.waId

  return (
    <motion.a
      className={styles.button}
      href={whatsappUrl(waId)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${LABEL} ${NEW_TAB}`}
      initial={reduce ? false : { opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.2, duration: 0.6, ease: revealEase }}
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
