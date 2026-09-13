import { useId } from 'react'
import { ChartIcon, CoinIcon, ShieldIcon } from './Icons.tsx'
import { useLocale } from '../../hooks/useLocale/index.ts'
import { parkExtras } from './parkSoftwareCopy.ts'
import styles from './ParkSoftware.module.css'
import { useCountUp } from './useCountUp.ts'

const FEATURES = [
  { key: 'index_gelir_raporlari', Icon: ChartIcon },
  { key: 'index_kacak_onleme', Icon: ShieldIcon },
  { key: 'index_otomatik_tahsilat', Icon: CoinIcon },
] as const

type RevenueCardProps = {
  active: boolean
}

export default function RevenueCard({ active }: RevenueCardProps) {
  const { t } = useLocale()
  const extra = parkExtras
  const gaugeId = useId().replace(/:/g, '')
  const revenue = useCountUp(127000, active)
  const success = useCountUp(98, active)

  return (
    <article className={`${styles.revenue} ${active ? styles.shown : ''}`}>
      <div className={styles.revenueCopy}>
        <span className={styles.kicker}>{t('index_gelir_yonetimi')}</span>
        <ul className={styles.checks}>
          {FEATURES.map(({ key, Icon }) => (
            <li key={key}>
              <span className={styles.featureIcon}>
                <Icon />
              </span>
              {t(key)}
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.stats}>
        <p className={styles.dashTitle}>{extra.dashboard}</p>

        <div className={styles.stat}>
          <div className={styles.statTop}>
            <div>
              <div className={styles.statLabel}>{t('index_toplam_gelir')}</div>
              <div className={styles.statValue}>₺{Math.round(revenue).toLocaleString('tr-TR')}</div>
            </div>
            <svg className={styles.spark} viewBox="0 0 88 32" width="88" height="32" aria-hidden="true">
              <polyline
                className={styles.sparkLine}
                points="0,24 12,20 22,22 34,14 46,16 58,8 70,10 88,4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <div className={styles.stat}>
          <div>
            <div className={styles.statLabel}>{t('index_tahsilat_basarisi')}</div>
            <div className={styles.statRow}>
              <div className={styles.statValue}>%{Math.round(success)}</div>
              <span className={styles.up} aria-hidden="true">
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 10l7-7 7 7M12 3v18" />
                </svg>
              </span>
            </div>
          </div>
          <svg className={styles.gauge} viewBox="0 0 56 34" width="136" height="82" aria-hidden="true">
            <path d="M6 32 A 22 22 0 1 1 50 32" fill="none" stroke="rgba(15,23,42,0.08)" strokeWidth="5" strokeLinecap="round" />
            <path
              className={styles.gaugeFill}
              d="M6 32 A 22 22 0 1 1 50 32"
              fill="none"
              stroke={`url(#${gaugeId})`}
              strokeWidth="5"
              strokeLinecap="round"
              pathLength={100}
              strokeDasharray={active ? '96 100' : '0 100'}
            />
            <line x1="28" y1="32" x2="47" y2="16" stroke="#1d4ed8" strokeWidth="1.7" strokeLinecap="round" />
            <circle cx="28" cy="32" r="2.15" fill="#1d4ed8" />
            <defs>
              <linearGradient id={gaugeId} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#1d4ed8" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </article>
  )
}
