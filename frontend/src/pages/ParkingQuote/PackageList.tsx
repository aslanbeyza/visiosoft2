import type { ComponentType } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  BarrierIcon,
  CardIcon,
  ChartIcon,
  InvoiceIcon,
  KioskIcon,
  PlateIcon,
  SettingsIcon,
  UsersIcon,
} from '../../components/FeatureGrid/icons.tsx'
import type { IconProps } from '../../components/FeatureGrid/icons.tsx'
import { revealEase } from '../../components/Reveal/index.ts'
import { quoteCopy } from './quoteCopy.ts'
import type { CatalogId, PackageItem } from './quoteRules.ts'
import styles from './PackageList.module.css'

const icons: Record<CatalogId, ComponentType<IconProps>> = {
  plate_recognition: PlateIcon,
  parking_software: ChartIcon,
  payment_automation: InvoiceIcon,
  subscription_module: UsersIcon,
  hgs_integration: CardIcon,
  kiosk: KioskIcon,
  barrier_system: BarrierIcon,
  turnkey_installation: SettingsIcon,
}

type PackageListProps = {
  items: PackageItem[]
}

export default function PackageList({ items }: PackageListProps) {
  const reduce = Boolean(useReducedMotion())

  if (items.length === 0) {
    return (
      <div className={styles.empty}>
        <div className={styles.ghosts} aria-hidden="true">
          <span className={styles.ghost} />
          <span className={styles.ghost} />
          <span className={styles.ghost} />
        </div>
        <p className={styles.emptyText}>{quoteCopy.panel.empty}</p>
      </div>
    )
  }

  return (
    <ol className={styles.list} aria-label={quoteCopy.panel.listLabel}>
      <AnimatePresence initial={false} mode="popLayout">
        {items.map((item) => {
          const Icon = icons[item.id]
          return (
            <motion.li
              key={item.id}
              className={styles.item}
              data-group={item.group}
              layout={reduce ? false : 'position'}
              initial={reduce ? false : { opacity: 0, x: 36 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduce ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, x: -20, transition: { duration: 0.25 } }}
              transition={{ duration: 0.7, ease: revealEase }}
            >
              <motion.span
                className={styles.icon}
                aria-hidden="true"
                initial={reduce ? false : { scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.12, ease: revealEase }}
              >
                <Icon className={styles.iconSvg} />
              </motion.span>
              <span className={styles.text}>
                <span className={styles.name}>{item.name}</span>
                <span className={styles.reason}>{item.reason}</span>
              </span>
              <svg className={styles.check} viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false">
                <circle cx="10" cy="10" r="9" className={styles.checkRing} />
                <motion.path
                  d="m5.8 10.3 2.8 2.8 5.6-5.8"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={reduce ? false : { pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 0.35, ease: revealEase }}
                />
              </svg>
            </motion.li>
          )
        })}
      </AnimatePresence>
    </ol>
  )
}
